"""Build a drill video from a video file and the house style.

    tools/audiation/.venv/bin/python tools/drillvideo/build.py 01-caged-root-areas            # render the video
    tools/audiation/.venv/bin/python tools/drillvideo/build.py 01-caged-root-areas --plan     # timings, no speech
    tools/audiation/.venv/bin/python tools/drillvideo/build.py 01-caged-root-areas --frames 30,95   # stills, no video

A video (videos/<id>.yaml) has an id, a title, a rule, a bpm, `captions: false` to show no captions, and steps. The shapes come from the Guitar Cards engine
(resolve.mjs), so the videos show exactly what the app does. Whatever a step puts on screen stays until a later
step changes it (null clears it):

  section: <text>      top right: the part of the video (Learn it, Practise it, All 12 keys…)
  key: <text>          under it: the key we're in
  now: <text>          the big line: what is on the neck
  sub: <text>          the line under it
  show: <shape> | [<shape>, …]   dots on the neck. A shape is a resolve.mjs request, plus `as: iv|name|chord` (what
                       each dot says, default iv) and `faint: true` (an empty ring: another place for the same thing)
  band: true | [lo, hi]   a soft band over a span of frets (true: the first shape's own span)
  finger: true | false ring the CAGED form's root and say which finger frets it
  mark: {string, fret, label}   ring one note and label it (a morph rings the note that moved)
  keys: {list: [...], at: i}   the twelve keys along the bottom, key i lit (a later `keys: {at: j}` moves it)
  table: {title, head, rows} | {title, head, rows_from: {<request>, cols: ['{key}', …]}}   a table over the neck
  card: {title, lines}  a full-screen card in place of the neck
  notes: [<line>, …]   up to three short lines of text along the bottom: the extras nobody needs to hear
  say: <line>          spoken and captioned
  play: <pattern> | [<pattern>, …]   play the shape after the line: strum, up, down, updown, downup or root,
                       each optionally followed by its beats ('up 0.25'); a strum or root lasts 2 beats by default,
                       an arpeggio's notes half a beat
  over: true           play while the line is spoken, not after it
  items: [<step>, …]   played in time after the line over a click, one bar each (`bars: N`); the next item's `now`
                       shows a beat before it; `play` on the step is every item's default
  expand: <request>    items made from a `ladder`, `prog` or `morph` request, plus `dir: up|updown`, `minFret`, `maxFret`,
                       `now`/`sub` formats ({chord} {bass} {bassNote} {bassString} {bassFret}, and {move} for a morph),
                       and `map: true` to end a ladder on all its voicings at once (`mapNow`, `mapBars`)
  click: false         items without a count-in or a click
  play: {groove: 'T-F- tF--', grid: 2, swing: 0, accents: []}   a right-hand pattern on the grip shown, one token a
                       slot (bars split by |): T thumb on the root, t thumb on the 5th, F fingers, TF/tF both, N the
                       fingers playing the next item's chord early (an anticipation: its grip shows then), D/U strum
                       down/up, d/u muted strum, x chuck, - rest. The grid of slots shows under the neck, the slot
                       sounding lit. `repeat: N` plays it N times
  play: {run: B, strokes: 'D D U …'}   the shape's notes in their own order, B beats each, pick strokes on the grid
  play: [{hits: [0, 2]}, 'run 1']   strike the other shapes as a chord at those beats while the line runs
  tab: {voices: ['1.0:.5 1.2:.5 | 1.3:1 …', '6.3:.5 …'], root: E, sound: [0, 1], repeat: N}   written music in time:
                       each voice is tokens string.fret:beats ('+' joins a chord, r:beats is a rest, | a bar line);
                       a fret may end h/p/s/n/b/m (hammer-on, pull-off, slide, harmonic, bend, muted);
                       voices sound together, a scrolling tab shows under the neck, and each dot is labelled by its
                       degree from `root` (or each bar from `roots: [E, Eb, D…]`). A video-level `tuning: [D2, A2, D3, G3, A3, D4]` (low to high) sets the tuning
  drone: <note> | null a soft held note (e.g. G2) under everything from here on
  bpm: N               tempo from here on
  hold: N              seconds of silence after the step
"""
from __future__ import annotations

import argparse
import bisect
import re
import copy
import hashlib
import importlib.util
import json
import math
import subprocess
import sys
from collections import defaultdict
from pathlib import Path

import numpy as np
import yaml
from PIL import Image, ImageDraw, ImageFont
from scipy.signal import oaconvolve

HERE = Path(__file__).resolve().parent
_spec = importlib.util.spec_from_file_location('audiation_build', HERE.parent / 'audiation' / 'build.py')
A = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(A)  # the voice, the neck and the dots are the audiation videos'
A.CACHE = HERE / 'cache'
OUT = HERE / 'out'
WPS = 2.6  # words a second at speed 1.0, for --plan

SCREEN = ('section', 'key', 'now', 'sub', 'show', 'band', 'finger', 'mark', 'keys', 'table', 'card', 'notes')
RENDER_ONLY = {'as', 'faint', 'ring', 'dir', 'minFret', 'maxFret', 'now', 'sub', 'cols', 'pattern', 'beats', 'bars',
               'click', 'map', 'mapNow', 'mapSub', 'mapBars'}
SUBDIV = {1: [''], 2: ['', '&'], 3: ['', 'trip', 'let'], 4: ['', 'e', '&', 'a'], 6: ['', 'la', 'li', '&', 'la', 'li']}
def glyph(tok: str) -> str:
    """A grid label: string-number tokens read as the finger (p5, i, m, a; '51' → p5+a), the rest from GLYPH."""
    if tok.isdigit():
        return '+'.join(f'p{c}' if int(c) >= 4 else 'ima'[3 - int(c)] for c in tok)
    return GLYPH.get(tok, tok)


GLYPH = {'T': 'p', 't': 'p', 'F': 'ima', 'TF': 'p+ima', 'tF': 'p+ima', 'N': 'ima→', 'TN': 'p+ima→', 'D': '↓', 'U': '↑', 'd': '×↓', 'u': '×↑', 'x': '×',
         '-': ''}


# ---------- shapes ----------

def request(spec: dict) -> dict:
    return {k: v for k, v in spec.items() if k not in RENDER_ONLY}


def rkey(spec: dict) -> str:
    return json.dumps(request(spec), sort_keys=True)


def requests_in(steps: list) -> list:
    out = []
    for st in steps:
        shows = st.get('show')
        for sp in (shows if isinstance(shows, list) else [shows] if shows else []):
            if 'kind' in sp:
                out.append(request(sp))
        if st.get('expand'):
            out.append(request(st['expand']))
        if isinstance(st.get('table'), dict) and st['table'].get('rows_from'):
            out.append(request(st['table']['rows_from']))
        out += requests_in(st.get('items', []))
    return out


def resolve(reqs: list) -> dict:
    uniq = list({json.dumps(r, sort_keys=True): r for r in reqs}.values())
    res = subprocess.run(['node', str(HERE / 'resolve.mjs')], input=json.dumps({'shapes': uniq}), capture_output=True,
                         text=True)
    if res.returncode:
        raise RuntimeError(res.stderr)
    return {json.dumps(r, sort_keys=True): v for r, v in zip(uniq, json.loads(res.stdout)['results'])}


def expand(spec: dict, R: dict) -> list:
    """In-time items from a ladder (each voicing on the string set) or a progression (each chord)."""
    res = R[rkey(spec)]
    steps = res['steps']
    if spec['kind'] == 'ladder':
        lo, hi = spec.get('minFret', 1), spec.get('maxFret', 16)
        steps = [s for s in steps if s['window'][0] >= lo and s['window'][1] <= hi]
        if spec.get('dir', 'updown') == 'updown':
            steps = steps + steps[-2::-1]
    kind = spec['kind']
    fmt = spec.get('now', '{chord} · {bass} in the bass' if kind in ('ladder', 'morph') else '{chord}')
    sub = spec.get('sub', {'morph': '{move}', 'loop': '{roman} in {key}', 'areaProg': '{roman}'}.get(kind))
    items = []
    for s in steps:
        low = min(s['notes'], key=lambda n: n['midi'])
        fields = {**s, 'bass': A.pretty(s.get('bass', '')), 'bassNote': low['name'], 'bassString': low['string'],
                  'bassFret': low['fret'], 'roman': A.pretty(s.get('roman', ''))}
        item = {'show': {'notes': s['notes'], 'chord': s['chord'], 'window': s['window']}, 'now': fmt.format(**fields)}
        if sub:
            item['sub'] = sub.format(**fields)
        if kind == 'loop':
            item['keys'] = {'at': s['keyIndex']}
        if kind == 'areaProg':
            item['band'] = res['area']
        if spec['kind'] == 'morph':
            m = s.get('moved')
            item['mark'] = {'string': m['string'], 'fret': m['fret'], 'label': 'moved'} if m else None
        for k in ('pattern', 'beats', 'bars'):
            if k in spec:
                item['play' if k == 'pattern' else k] = spec[k]
        items.append(item)
    if spec.get('map'):  # every voicing on the string set at once, in silence
        up = steps[: (len(steps) + 1) // 2] if kind == 'ladder' and spec.get('dir', 'updown') == 'updown' else steps
        frets = [f for s in up for f in s['window']]
        strings = '-'.join(str(x) for x in spec.get('strings', []))
        items.append({'show': {'notes': [n for s in up for n in s['notes']], 'chord': up[0]['chord'],
                               'window': [min(frets), max(frets)]},
                      'now': spec.get('mapNow', '{chord} · strings {strings} · the whole neck').format(
                          chord=up[0]['chord'], strings=strings),
                      'sub': spec.get('mapSub', 'bass going up: ' + ' · '.join(A.pretty(s['bass']) for s in up)
                                      if kind == 'ladder' else ''),
                      'play': [], 'bars': spec.get('mapBars', 1)})
    return items


def dots_of(show, R: dict) -> list:
    out = []
    for sp in (show if isinstance(show, list) else [show]):
        r = R[rkey(sp)] if 'kind' in sp else sp
        mode = sp.get('as', 'iv')
        for n in (r['notes'] if 'notes' in r else [n for st in r['steps'] for n in st['notes']]):
            lab = {'iv': n['iv'], 'name': n.get('name'), 'chord': r.get('chord') or r['steps'][0]['chord']}[mode]
            out.append({'s': n['string'], 'f': n['fret'], 'midi': n['midi'], 'iv': n['iv'], 'fam': A.family(n['iv']),
                        'lab': str(lab), 'faint': bool(sp.get('faint')), 'ring': n['iv'] in sp.get('ring', [])})
    return out


def path_of(show, R: dict) -> list | None:
    """The first shape's notes in playing order, when it has one (a run or a written line)."""
    for sp in (show if isinstance(show, list) else [show]):
        r = R[rkey(sp)] if 'kind' in sp else sp
        if r.get('path'):
            return [{'s': n['string'], 'f': n['fret'], 'midi': n['midi'], 'iv': n['iv'], 'fam': A.family(n['iv']),
                     'lab': n['iv'], 'faint': False} for n in r['path']]
    return None


DEGREES = ['1', 'b2', '2', 'b3', '3', '4', '#4', '5', 'b6', '6', 'b7', '7']


def parse_voice(text: str) -> tuple:
    """A voice's tokens (string.fret:beats, '+' for a chord, r:beats a rest, | a bar line) as
    ([(beat, string, fret, beats, technique)], [bar-line beats], total beats). A fret may end in a technique:
    h hammer-on, p pull-off, s slide, n natural harmonic, b bend (a whole step), m muted."""
    t, out, bars = 0.0, [], []
    for tok in text.split():
        if tok == '|':
            bars.append(t)
            continue
        body, _, d = tok.partition(':')
        d = float(d or 1)
        if body != 'r':
            for n in body.split('+'):
                st_, fr = n.split('.')
                tech = fr.lstrip('0123456789')
                out.append((t, int(st_), int(fr[: len(fr) - len(tech)]), d, tech))
        t += d
    return out, bars, t


HARMONIC = {12: 12, 7: 19, 19: 19, 5: 24, 4: 28, 9: 28}  # natural harmonics: fret → semitones above the open string
TECH_MARK = {'h': 'h{}', 'p': 'p{}', 's': '/{}', 'n': '<{}>', 'b': '{}b', 'm': 'x'}


def note_midi(name: str) -> int:
    pcs = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11}
    acc = sum(1 if c in '#♯' else -1 for c in name[1:-1])
    return 12 * (int(name[-1]) + 1) + pcs[name[0].upper()] + acc


# ---------- the timeline ----------

def parse_pattern(p) -> tuple:
    parts = str(p).split()
    return parts[0], float(parts[1]) if len(parts) > 1 else None


def layout(video: dict, style: dict, R: dict, clips: dict) -> dict:
    P, S = style['pacing'], style['sound']
    st = {'finger': False}
    scenes, notes, clicks, speech, captions, steps_out, grids, drones, tabs = [], [], [], [], [], [], [], [], []
    tuning = {6 - i: note_midi(n) for i, n in enumerate(video.get('tuning', ['E2', 'A2', 'D3', 'G3', 'B3', 'E4']))}
    bpm = [video.get('bpm', 72)]
    drone = [None, 0.0]  # the note held, and since when

    def snap(at):
        scenes.append((at, copy.deepcopy(st)))

    def apply(step):
        for k in SCREEN:
            if k not in step:
                continue
            v = step[k]
            if k == 'show':
                st['dots'] = dots_of(v, R) if v else []
                st['path'] = path_of(v, R) if v else None
                first = next((sp for sp in (v if isinstance(v, list) else [v]) if sp and not sp.get('faint')), None) if v else None
                st['shape'] = (R[rkey(first)] if 'kind' in first else first) if first else None
            elif k == 'keys' and v and st.get('keys') and 'list' not in v:
                st['keys'] = {**st['keys'], **v}
            elif k == 'table' and v and v.get('rows_from'):
                rf = v['rows_from']
                rows = [[c.format(**{**row, 'bass': A.pretty(row.get('bass', ''))}) for c in rf['cols']]
                        for row in R[rkey(rf)]['rows']]
                st['table'] = {**{x: y for x, y in v.items() if x != 'rows_from'}, 'rows': rows}
            else:
                st[k] = v
        shape = st.get('shape')
        st['band_span'] = (shape['window'] if st.get('band') is True and shape else
                           st['band'] if isinstance(st.get('band'), list) else None)
        st['anchor'] = (st['mark'] if st.get('mark') else
                        {**shape['anchor'], 'label': f"root · {shape['finger']}"}
                        if st.get('finger') and shape and 'anchor' in shape else None)

    def schedule(play, t0, beat, dots):
        """Notes for a play pattern from t0; returns when the last one ends."""
        t = t0
        playable = [d for d in dots if not d['faint']]
        for p in (play if isinstance(play, list) else [play]):
            if isinstance(p, dict):
                if 'hits' in p:  # chords struck under a line, without moving the line on: the shapes not being run
                    line = {(d['s'], d['f']) for d in (st.get('path') or [])}
                    chord = sorted((d for d in playable if (d['s'], d['f']) not in line), key=lambda d: d['midi'])
                    for b in p['hits']:
                        for j, d in enumerate(chord):
                            notes.append({'t': t + b * beat + j * S['roll_s'], 'd': d, 'vel': 0.6})
                    continue
                t = groove(p, t, beat, playable) if 'groove' in p else run_strokes(p, t, beat)
                continue
            kind, beats = parse_pattern(p)
            if kind == 'run':
                per = (beats or 0.5) * beat
                for j, d in enumerate(st.get('path') or []):
                    notes.append({'t': t + j * per, 'd': d, 'vel': 0.8})
                t += len(st.get('path') or []) * per
                continue
            asc = sorted(playable, key=lambda d: d['midi'])
            if kind in ('strum', 'root'):
                chord = asc if kind == 'strum' else ([d for d in asc if d['iv'] == '1'][:1] or asc[:1])
                for j, d in enumerate(chord):
                    notes.append({'t': t + j * S['roll_s'], 'd': d, 'vel': 0.85})
                t += (beats or 2) * beat
                continue
            seq = {'up': asc, 'down': asc[::-1], 'updown': asc + asc[-2::-1], 'downup': asc[::-1] + asc[1:]}[kind]
            per = (beats or 0.5) * beat
            for j, d in enumerate(seq):
                notes.append({'t': t + j * per, 'd': d, 'vel': 0.8})
            t += len(seq) * per
        return t

    def slot_time(i, grid, swing):
        b, k = divmod(i, grid)
        f = 0.5 + min(0.67, swing) * 0.25
        offs = [0, f] if swing and grid == 2 else [0, f / 2, 0.5, 0.5 + f / 2] if swing and grid == 4 else \
            [x / grid for x in range(grid)]
        return b + offs[k]

    def show_grid(tokens, grid, t, beat, swing, accents, beats_per_bar=4, labels=None):
        n = len(tokens)
        counts = [(str(i // grid % beats_per_bar + 1) if i % grid == 0 else (SUBDIV.get(grid) or [''] * grid)[i % grid])
                  for i in range(n)]
        if labels:  # a written count, e.g. flamenco's 12 … 11
            counts = [str(labels[(i // grid) % len(labels)]) if i % grid == 0 else counts[i] for i in range(n)]
        times = [t + slot_time(i, grid, swing) * beat for i in range(n + 1)]
        grids.append({'tokens': tokens, 'counts': counts, 'times': times, 'accents': sorted(accents)})
        return times[-1]

    def groove(p, t, beat, dots):
        """A right-hand pattern on the grip: thumb on root or 5th, fingers on the upper strings, strums, scratches."""
        grid, swing, accents = p.get('grid', 2), p.get('swing', 0), set(p.get('accents', []))
        # one token a slot; a run of strokes written together ('Dudu') is one slot each
        tokens = [c for tok in str(p['groove']).replace('|', ' ').split()
                  for c in (list(tok) if set(tok) <= set('DUdux-') else [tok])]
        asc = sorted(dots, key=lambda d: d['midi'])
        bass = [d for d in asc if d['s'] >= 4]
        root = next((d for d in bass if d['iv'] == '1'), bass[0] if bass else asc[0])
        fifth = next((d for d in bass if d['iv'] == '5' and d is not root), root)
        upper = [d for d in asc if d not in (root, fifth)] or asc
        if coming['dots']:  # the next chord's fingers, for an anticipation
            nb = sorted(coming['dots'], key=lambda d: d['midi'])
            nbass = [d for d in nb if d['s'] >= 4]
            nroot = next((d for d in nbass if d['iv'] == '1'), None)
            nfifth = next((d for d in nbass if d['iv'] == '5' and d is not nroot), None)
            ahead = [d for d in nb if d not in (nroot, nfifth)]
        else:
            ahead = upper
        for rep in range(p.get('repeat', 1)):
            for i, tok in enumerate(tokens):
                at = t + slot_time(i, grid, swing) * beat
                loud = 1.0 if i in accents else 0.75
                if tok.isdigit():  # string numbers: 6 5 4 the thumb on that string, 3 2 1 = i m a; '51' a pinch
                    for ch in tok:
                        d = next((x for x in asc if x['s'] == int(ch)), None)
                        if d:
                            notes.append({'t': at, 'd': d, 'vel': (0.8 if int(ch) >= 4 else 0.62) * loud})
                    continue
                if 'T' in tok or 't' in tok:
                    notes.append({'t': at, 'd': root if 'T' in tok else fifth, 'vel': 0.8 * loud})
                if 'F' in tok or 'N' in tok:
                    for d in (ahead if 'N' in tok else upper):
                        notes.append({'t': at + 0.004, 'd': d, 'vel': 0.55 * loud})
                    if 'N' in tok:
                        coming['at'] = at
                if tok in ('D', 'U', 'd', 'u'):
                    order = asc if tok in 'Dd' else asc[::-1]
                    for j, d in enumerate(order):
                        notes.append({'t': at + j * 0.009, 'd': d, 'vel': (0.85 if tok.isupper() else 0.5) * loud,
                                      'mute': tok.islower()})
                if tok == 'x':
                    notes.append({'t': at, 'd': upper[-1], 'vel': 0.6 * loud, 'mute': True})
            t = show_grid([glyph(x) for x in tokens], grid, t, beat, swing, accents, labels=p.get('counts'))
        return t

    def run_strokes(p, t, beat):
        """The shape's notes in order, with the pick strokes on the grid."""
        per, path = p['run'] * beat, st.get('path') or []
        strokes = str(p.get('strokes', '')).split() or ['·'] * len(path)
        for rep in range(p.get('repeat', 1)):
            for j, d in enumerate(path):
                notes.append({'t': t + j * per, 'd': d, 'vel': 0.8 if j % round(1 / p['run']) == 0 else 0.68})
            # one slot per note: `run` beats each, so round(1 / run) slots a beat
            show_grid([{'D': '↓', 'U': '↑'}.get(x, x) for x in strokes], round(1 / p['run']), t, beat, 0, [])
            t += len(path) * per
        return t

    coming = {'dots': None, 'at': None}  # the next item's grip, and when a groove played it early

    def run_items(items, t, default_play, click=True):
        beat = 60 / bpm[0]
        if click:
            for i in range(P['count_in']):
                clicks.append((t + i * beat, i == 0))
            t += P['count_in'] * beat
        for j, it in enumerate(items):
            st['next'] = None
            apply(it)
            snap(t)
            length = it.get('bars', 1) * 4 * beat
            for k in range(int(round(length / beat)) if click else 0):
                clicks.append((t + k * beat, k % 4 == 0))
            nxt = items[j + 1] if j + 1 < len(items) else None
            coming.update(dots=dots_of(nxt['show'], R) if nxt and nxt.get('show') else None, at=None)
            schedule(it.get('play', default_play), t, beat, st['dots'])
            if nxt and nxt.get('now'):
                st['next'] = nxt['now']
                snap(t + length - P['preview_beats'] * beat)
            if nxt and coming['at'] is not None and coming['at'] < t + length:  # anticipated: the grip changes then
                apply(nxt)
                st['next'] = None
                snap(coming['at'])
            coming.update(dots=None, at=None)
            t += length
        st['next'] = None
        snap(t)
        return t

    def run_tab(spec, t0, beat, page=False):
        """Written music: the voices sound together, the dots follow what is ringing, the tab scrolls."""
        root = note_midi(spec.get('root', 'E') + '4') % 12
        parsed = [parse_voice(v) for v in spec['voices']]
        # `roots: [E, Eb, D, …]` labels each bar from its own chord; bars counted from voice 1's bar lines
        # a root may carry its quality (`E7`, `Bm`): with `ext: true` colour tones read as 9/11/13, and ♭3 over a dominant as ♯9
        split = [re.match(r'([A-G][#b]?)(.*)', r).groups() for r in spec.get('roots', [])]
        bar_roots = [note_midi(r + '4') % 12 for r, _ in split]
        bar_dom = ['7' in qu and 'm' not in qu.replace('maj', '') for _, qu in split]
        bar_at = lambda bt: min(bisect.bisect_right(parsed[0][1], bt + 1e-6), len(bar_roots) - 1)
        root_at = lambda bt: bar_roots[bar_at(bt)] if bar_roots else root
        EXT = {'2': '9', 'b2': 'b9', '4': '11', '#4': '#11', '6': '13', 'b6': 'b13'}
        def label(iv, bt):
            if not spec.get('ext'):
                return iv
            if iv == 'b3' and bar_roots and bar_dom[bar_at(bt)]:
                return '#9'
            return EXT.get(iv, iv)
        length = max(p[2] for p in parsed)
        sw = spec.get('swing', 0)  # swung 8ths: an off-beat 8th lands late (0.67 = triplet feel)
        swung = (lambda b_: math.floor(b_) + (0.5 + (sw - 0.5) * 1.0 if abs(b_ - math.floor(b_) - 0.5) < 1e-6 else b_ - math.floor(b_))) if sw else (lambda b_: b_)
        evs, bars = [], []
        for rep in range(spec.get('repeat', 1)):
            base = t0 + rep * length * beat
            bars += [base + b * beat for b in parsed[0][1]]
            for vi, (events, _, _) in enumerate(parsed):
                for bt, st_, fr, d, tech in events:
                    midi = tuning[st_] + (HARMONIC.get(fr, 12) if tech == 'n' else fr + (2 if tech == 'b' else 0))
                    iv = DEGREES[(midi - root_at(bt)) % 12]
                    dot = {'s': st_, 'f': fr, 'midi': midi, 'iv': iv, 'fam': A.family(iv), 'lab': label(iv, bt), 'faint': False}
                    evs.append({'t': base + swung(bt) * beat, 'end': base + swung(bt + d) * beat, 's': st_, 'f': fr, 'v': vi,
                                'tech': tech, 'heard': vi in spec.get('sound', range(len(parsed))), 'dot': dot})
        evs.sort(key=lambda e: e['t'])
        for e in evs:  # slurred notes (no pick) are softer; a muted note is a dead stroke
            if e['heard']:
                notes.append({'t': e['t'], 'd': e['dot'], 'mute': e['tech'] == 'm',
                              'vel': (0.55 if e['tech'] in ('h', 'p', 's', 'n') else 0.82 if e['v'] == 0 else 0.7)})
        st['fast'] = True  # notes come quickly: the dots change without a slow crossfade
        for tm in sorted({e['t'] for e in evs}):
            st['dots'] = [e['dot'] for e in evs if e['heard'] and e['t'] <= tm < e['end']]
            snap(tm)
        t1 = t0 + spec.get('repeat', 1) * length * beat
        # `harmony: ['Em:i B7:V7', …]` one string a bar: each token a slot (`-` holds), `@E_minor` changes the key label
        ends = list(parsed[0][1]) + ([length] if not parsed[0][1] or parsed[0][1][-1] < length - 1e-6 else [])
        hb = []  # (beat, chord, numeral), or (beat, 'key', name)
        for i, bar in enumerate(spec.get('harmony', [])[:len(ends)]):
            b0, b1 = (ends[i - 1] if i else 0), ends[i]
            toks = bar.split()
            slots = [x for x in toks if not x.startswith('@')]
            k = 0
            for x in toks:
                bt = b0 + k * (b1 - b0) / max(1, len(slots))
                if x.startswith('@'):
                    hb.append((bt, 'key', x[1:].replace('_', ' ')))
                    continue
                if x != '-':
                    ch, _, rn = x.replace('_', ' ').partition(':')
                    hb.append((bt, ch, rn))
                k += 1
        harm = [(t0 + (rep * length + bt) * beat, ch, rn) for rep in range(spec.get('repeat', 1)) for bt, ch, rn in hb]
        pg = page_layout(parsed, ends, hb, spec, style['visual']) if page else None
        tabs.append({'harm': harm, 'key': st.get('key'), 'page': pg, 'events': [{k: e[k] for k in ('t', 'end', 's', 'f', 'heard', 'tech')} for e in evs], 'bars': bars,
                     'beat': beat, 't0': t0, 't1': t1})
        st['fast'] = False
        return t1

    t = P['lead_in_s']
    last_tab = [None]
    for i, step in enumerate(video['steps']):
        t0 = t
        st['page'] = bool(step.get('page'))
        if 'bpm' in step:
            bpm[0] = step['bpm']
        st['next'] = None
        if 'drone' in step:
            if drone[0]:
                drones.append((drone[1], t0, drone[0]))
            drone[:] = [note_midi(step['drone']) if step['drone'] else None, t0]
        apply(step)
        snap(t0)
        end = t0
        say_end = None
        if 'say' in step:
            ts = t0 + P['say_after_s']
            n = clips[step['say']]
            speech.append((ts, step['say']))
            if video.get('captions', True):
                captions.append((ts, ts + n, step['say']))
            say_end = ts + n
            end = say_end
        beat = 60 / bpm[0]
        items = step.get('items') or (expand(step['expand'], R) if step.get('expand') else None)
        if items:
            start = (say_end + P['play_after_s']) if say_end else t0 + P['play_after_s']
            end = max(end, run_items(items, start, step.get('play', 'strum'), step.get('click', True)))
        elif step.get('tab'):
            start = (say_end + P['play_after_s']) if say_end else t0 + P['play_after_s']
            last_tab[0] = step['tab']
            end = max(end, run_tab(step['tab'], start, beat))
        elif step.get('page'):  # the whole excerpt as a page: the last tab, its marks, played again under a cursor
            start = (say_end + P['play_after_s']) if say_end else t0 + P['play_after_s']
            spec = {**(last_tab[0] or {}), **({} if step['page'] is True else step['page']), 'notes': step.get('notes') or []}  # a page may carry its own tab
            end = max(end, run_tab(spec, start, beat, page=True))
        elif step.get('play'):
            start = (t0 + P['say_after_s'] + 0.3) if step.get('over') or not say_end else say_end + P['play_after_s']
            end = max(end, schedule(step['play'], start, beat, st.get('dots', [])))
        # card holds kept short: the title 3 s, a drill card 7 s, the end card 4 s (time enough to read, no longer)
        hold = step.get('hold', 0)
        ttl = (step.get('card') or {}).get('title')
        if ttl:
            hold = min(hold, 3.0 if i == 0 else 7.0 if ttl == 'The drill' else 4.0 if ttl.startswith("You've got it") else hold)
        t = end + (P['gap_s'] if end > t0 else 0) + hold
        steps_out.append({'index': i, 'start': round(t0, 3), 'end': round(t, 3), 'say': step.get('say'),
                          'now': st.get('now')})
    if drone[0]:
        drones.append((drone[1], t, drone[0]))
    notes.sort(key=lambda e: e['t'])
    return {'scenes': scenes, 'notes': notes, 'clicks': clicks, 'speech': speech, 'captions': captions, 'grids': grids,
            'drones': drones, 'tabs': tabs, 'steps': steps_out, 'duration': t + P['tail_s']}


# ---------- sound ----------

def woodblock(S: dict, accent: bool) -> np.ndarray:
    C, rate = S['click'], S['rate']
    n = int(C['decay_s'] * 6 * rate)
    t = np.arange(n) / rate
    f = C['freq'] * (1.22 if accent else 1.0)
    sig = (np.sin(2 * np.pi * f * t) + 0.45 * np.sin(2 * np.pi * f * 2.7 * t)) * np.exp(-t / C['decay_s'])
    return sig * C['level'] * (C['accent'] if accent else 1.0)


def mix(L: dict, style: dict, pcm: dict) -> np.ndarray:
    S = style['sound']
    rate = S['rate']
    n = int((L['duration'] + 3) * rate)
    gtr = np.zeros((n, 2))
    plucks = {}
    by_string = defaultdict(list)
    for e in sorted(L['notes'], key=lambda e: e['t']):
        by_string[e['d']['s']].append(e)
    for s, evs in by_string.items():
        pan = (3.5 - s) / 2.5 * 0.35  # low strings left, high right
        gains = np.array([math.cos((pan + 1) * math.pi / 4), math.sin((pan + 1) * math.pi / 4)]) * math.sqrt(2)
        for i, e in enumerate(evs):
            midi = e['d']['midi']
            freq = 440 * 2 ** ((midi - 69) / 12)
            key = (midi, bool(e.get('mute')))
            if key not in plucks:  # a muted stroke: the same string, damped at once, with a little scrape
                plucks[key] = A.pluck(freq, {**S, 'pluck': {**S['pluck'], 'decay_s': S['mute_s']}} if key[1] else S, midi)
                if key[1]:
                    k = len(plucks[key])
                    plucks[key] = plucks[key] * 1.1 + np.random.default_rng(midi).standard_normal(k) * np.exp(
                        -np.arange(k) / (0.015 * rate)) * 0.9
            sig = plucks[key].copy()
            if i + 1 < len(evs):  # the string plays again: this note stops
                cut = int((evs[i + 1]['t'] - e['t']) * rate)
                if cut < len(sig):
                    sig = sig[:cut]
                    k = min(len(sig), int(S['damp_s'] * rate))
                    sig[len(sig) - k:] *= np.linspace(1, 0, k)
            a = int(e['t'] * rate)
            b = min(n, a + len(sig))
            gtr[a:b] += np.outer(sig[: b - a] * S['level'] * e['vel'] * (freq / 130.8) ** -0.15, gains)
    D = S['drone']
    for t0, t1, midi in L['drones']:  # the audiation videos' warm held tone, root and an octave below
        for m, lev in ((midi, 1.0), (midi - 12, 0.6)):
            sig = A.tone(440 * 2 ** ((m - 69) / 12), t1 - t0, {**D, 'rate': rate}, m) * D['level'] * lev
            a = int(t0 * rate)
            b = min(n, a + len(sig))
            gtr[a:b] += sig[: b - a, None]
    R = S['reverb']
    ir = A.reverb_ir(R, rate)
    gtr = gtr * (1 - R['wet']) + np.stack([oaconvolve(gtr[:, c], ir[:, c])[:n] for c in range(2)], axis=1) * R['wet'] * 2
    for t, accent in L['clicks']:
        w = woodblock(S, accent)
        a = int(t * rate)
        b = min(n, a + len(w))
        gtr[a:b] += w[: b - a, None]
    voice = np.zeros(n)
    for t0, text in L['speech']:
        p = pcm[text]
        a = int(t0 * rate)
        voice[a: a + len(p)] += p[: n - a]
    loud = np.abs(gtr).max(axis=1) > 0.02
    g_rms = np.sqrt(np.mean(gtr[loud] ** 2)) if loud.any() else 0.1
    v_rms = np.sqrt(np.mean(voice[np.abs(voice) > 0.01] ** 2)) if np.any(np.abs(voice) > 0.01) else 1
    out = gtr + (voice * g_rms * 10 ** (S['voice_db'] / 20) / v_rms)[:, None]
    top = np.max(np.abs(out))  # a silent video (cards only) stays silent instead of dividing by zero
    return (out / top * S['peak'] if top > 0 else out).astype(np.float32)


# ---------- pictures ----------

def ease(u: float) -> float:
    u = min(1.0, max(0.0, u))
    return 0.5 - 0.5 * math.cos(math.pi * u)


def page_layout(parsed, ends, hb, spec, V) -> dict:
    """Bars into systems (whole bars a line, justified), systems into pages; the notes, chords and marks placed."""
    P = V['page']
    width = P['x1'] - P['x0']
    durs = [d for ev, _, _ in parsed for _, _, _, d, _ in ev if d > 0.05]
    ppb = min(150, max(56, P['unit'] / min(durs))) if durs else 100
    bars = [((ends[i - 1] if i else 0), ends[i]) for i in range(len(ends))]
    systems, cur = [], []
    for i, (b0, b1) in enumerate(bars):
        if cur and (b1 - bars[cur[0]][0]) * ppb > width:
            systems.append(cur)
            cur = []
        cur.append(i)
    systems.append(cur)
    out = []
    for si, sb in enumerate(systems):
        b0, b1 = bars[sb[0]][0], bars[sb[-1]][1]
        used = (b1 - b0) * ppb
        k = width / used if used > width or si < len(systems) - 1 or used > 0.7 * width else 1.0
        out.append({'b0': b0, 'b1': b1, 'ppb': ppb * k, 'bars': sb, 'page': si // P['per_page'], 'row': si % P['per_page']})
    pickup = spec.get('pickup', len(bars) > 1 and bars[0][1] - bars[0][0] < bars[1][1] - bars[1][0] - 1e-6)  # bar 0
    number = lambda i: i if pickup else i + 1
    marks = [(m[0] - (0 if pickup else 1), m[1]) for m in spec.get('marks', [])]
    evs = []
    for vi, (events, _, _) in enumerate(parsed):
        for bt, s_, fr, d, tech in events:
            evs.append({'b': bt, 's': s_, 'lab': TECH_MARK.get(tech, '{}').format(fr), 'end': bt + d})
    return {'systems': out, 'bars': [list(b) for b in bars], 'numbers': [number(i) for i in range(len(bars))],
            'events': evs, 'harm': [list(h) for h in hb], 'marks': [[i, txt] for i, txt in marks],
            'notes': list(spec.get('notes', [])), 'pages': out[-1]['page'] + 1}


def picture(L: dict, style: dict, t: float) -> list:
    """Everything on screen at time t, as a list of primitives (equal lists draw equal frames)."""
    V = style['visual']
    sc = L['scenes']
    times = L.setdefault('_scene_times', [s for s, _ in sc])
    i = max(0, bisect.bisect_right(times, t) - 1)
    cur, prev = sc[i][1], (sc[i - 1][1] if i else {})
    fade = 0.06 if cur.get('fast') and prev.get('fast') else V['fade_s']
    u = round(ease((t - sc[i][0]) / fade), 2)
    out = []

    def both(get, draw):  # unchanged: drawn fully; changed: the old fades out as the new fades in
        a, b = get(prev), get(cur)
        if a == b:
            if b:
                draw(b, 1.0)
            return
        if a and u < 1:
            draw(a, 1 - u)
        if b and u > 0:
            draw(b, u)

    covered = lambda s: bool(s.get('card') or s.get('table') or (s.get('page') and not V.get('_page_neck')))  # a card or a table takes the neck's place
    cover_a = (1.0 if covered(cur) else 0.0) if covered(cur) == covered(prev) else (u if covered(cur) else 1 - u)
    neck_a = round(1 - cover_a, 2)
    both(lambda s: json.dumps(s.get('card')) if s.get('card') else None, lambda c, a: out.append(('card', c, round(a, 2))))
    both(lambda s: json.dumps(s['table']) if s.get('table') else None,
         lambda tb, a: out.append(('table', tb, round(a, 2))))
    if neck_a > 0.01:
        out.append(('neck', neck_a))
        both(lambda s: tuple(s['band_span']) if s.get('band_span') else None,
             lambda b, a: out.append(('band', b[0], b[1], round(a * neck_a, 2))))
        cd = {(d['s'], d['f']): d for d in cur.get('dots', [])}
        pd = {(d['s'], d['f']): d for d in prev.get('dots', [])}
        for k in sorted(set(cd) | set(pd)):
            c, p = cd.get(k), pd.get(k)
            same = c and p and c['lab'] == p['lab'] and c['faint'] == p['faint'] and c.get('ring') == p.get('ring')
            for d, a in ((c, 1.0),) if same else ((p, 1 - u), (c, u)):
                if d and a > 0.01:
                    out.append(('dot', d['s'], d['f'], d['fam'], d['lab'], 'ring' if d['faint'] else 'dot',
                                bool(d.get('ring')), round(a * neck_a, 2)))
        times = L.setdefault('_note_times', [e['t'] for e in L['notes']])
        for e in L['notes'][bisect.bisect_left(times, t - V['glow_s']): bisect.bisect_right(times, t)]:
            d = e['d']
            out.append(('glow', d['s'], d['f'], d['fam'], d['lab'],
                        round((1 - (t - e['t']) / V['glow_s']) ** 2 * neck_a * (0.5 if e.get('mute') else 1), 1)))
        for tb in L.get('tabs', []):  # the scrolling tab: a window of beats around now, the playhead fixed
            if tb.get('page'):
                continue
            if tb['t0'] - 0.4 <= t < tb['t1'] + 0.8:
                b = tb['beat']
                win = tuple((round((e['t'] - t) / b, 3), e['s'], TECH_MARK.get(e['tech'], '{}').format(e['f']),
                             2 if e['t'] <= t < max(e['t'] + 0.25, min(e['end'], e['t'] + 0.6)) else 1 if e['t'] > t else 0,
                             e['heard']) for e in tb['events'] if -3 * b < e['t'] - t < 7 * b)
                bl = tuple(round((x - t) / b, 3) for x in tb['bars'] if -3 * b < x - t < 7 * b)
                a = min(ease((t - tb['t0'] + 0.4) / 0.4), ease((tb['t1'] + 0.8 - t) / 0.8))
                hv, key, last, sounding = [], tb['key'], None, None
                for tt, ch, rn in tb.get('harm', []):
                    if ch == 'key':
                        if tt <= t + 1e-6:
                            key = rn
                        continue
                    if (ch, rn) != last:  # a chord shows where it changes; the sounding one always
                        if tt <= t + 1e-6:
                            sounding = (round((tt - t) / b, 3), ch, rn)
                        elif tt - t < 9 * b:
                            hv.append((round((tt - t) / b, 3), ch, rn))
                    last = (ch, rn)
                hv = ([sounding] if sounding else []) + hv
                out.append(('tab', win, bl, round(a * neck_a, 2), tuple(hv), key if tb.get('harm') else None))
        # one right-hand grid at a time: the one playing, else one fading in or out; back-to-back grids hand over
        grids = L['grids']
        joined = lambda x, y: abs(x - y) < 0.05
        g = next((g for g in grids if g['times'][0] <= t < g['times'][-1]), None)
        if g:
            cur_slot = bisect.bisect_right(g['times'], t) - 1
            a = 1.0 if any(joined(o['times'][-1], g['times'][0]) for o in grids) else ease((t - g['times'][0] + 0.3) / 0.3)
        else:
            cur_slot = -1
            g = next((g for g in grids if g['times'][0] - 0.3 <= t < g['times'][0]
                      and not any(joined(o['times'][-1], g['times'][0]) for o in grids)), None) or \
                next((g for g in grids if g['times'][-1] <= t < g['times'][-1] + 0.4
                      and not any(joined(o['times'][0], g['times'][-1]) for o in grids)), None)
            a = (ease((t - g['times'][0] + 0.3) / 0.3) if t < g['times'][0] else ease((g['times'][-1] + 0.4 - t) / 0.4)) if g else 0
        if g and a > 0.01:
            out.append(('grid', json.dumps({k: g[k] for k in ('tokens', 'counts', 'accents')}), cur_slot, round(a * neck_a, 2)))
        both(lambda s: json.dumps(s['anchor']) if s.get('anchor') else None,
             lambda an, a: out.append(('anchor', an, round(a * neck_a, 2))))
        both(lambda s: json.dumps(s['keys']) if s.get('keys') and s['keys'].get('list') else None,
             lambda ks, a: out.append(('keys', ks, round(a * neck_a, 2))))
    for ti, tb in enumerate(L.get('tabs', [])):  # a page of tab: which page, the cursor, the notes sounding
        pg = tb.get('page')
        if not pg or not (tb['t0'] - 0.6 <= t < tb['t1'] + 1.2):
            continue
        a = min(ease((t - tb['t0'] + 0.6) / 0.5), ease((tb['t1'] + 1.2 - t) / 0.6))
        bn = (t - tb['t0']) / tb['beat']
        sy = pg['systems']
        if 0 <= bn < (tb['t1'] - tb['t0']) / tb['beat']:  # a repeat: the cursor goes round the page again
            bn %= sy[-1]['b1']
        si = 0 if bn < 0 else len(sy) - 1 if bn >= sy[-1]['b1'] else next(i for i, s_ in enumerate(sy) if s_['b0'] <= bn < s_['b1'])
        s_ = sy[si]
        cx = round(style['visual']['page']['x0'] + (bn - s_['b0']) * s_['ppb']) if 0 <= bn < sy[-1]['b1'] else None
        lit = tuple(j for j, e in enumerate(pg['events']) if e['b'] <= bn < max(e['b'] + 0.25, min(e['end'], e['b'] + 0.6 / tb['beat'])))
        out.append(('page', ti, s_['page'], s_['row'] if cx is not None else -1, cx, lit, round(a, 2)))
    if not cur.get('card') and not cur.get('page'):
        for k in ('now', 'sub', 'next'):
            both(lambda s, k=k: s.get(k), lambda v, a, k=k: out.append(('text', k, v, round(a, 2))))
    for k in ('section', 'key'):
        both(lambda s, k=k: s.get(k), lambda v, a, k=k: out.append(('text', k, v, round(a, 2))))
    both(lambda s: tuple(s['notes']) if s.get('notes') and not s.get('page') else None,
         lambda n, a: out.append(('notes', n, round(a, 2))))
    if V.get('_theory'):  # the piece's theory, along the bottom (a page of tab draws its own, in its legend)
        both(lambda s: None if s.get('card') or s.get('table') or s.get('page') else 'theory',
             lambda _, a: out.append(('theory', round(a, 2))))
    for s, e, text in L['captions']:
        a = min(ease((t - s) / 0.25), ease((e + 0.6 - t) / 0.35))
        if a > 0.01:
            out.append(('caption', text, round(a, 2)))
    return out


class Painter:
    def __init__(self, style: dict, video: dict):
        self.V, self.video = style['visual'], video
        self.W, self.H = self.V['size']
        self.neck = A.Painter(style, {})  # the audiation neck and dots
        self.blank = Image.new('RGBA', (self.W, self.H), self.V['background'])
        self.necks, self.fonts, self.glyphs = {}, {}, {}
        self.pages, self.page_cache = [], {}  # the layout's tabs (set by the caller) and drawn pages
        self.ink = A.rgb(self.V['ink'])

    def font(self, size: int, face: str = 'font_light'):
        key = (size, face)
        if key not in self.fonts:
            path, idx = (self.V['fallback'], 0) if face == 'fallback' else (self.V['font'], self.V[face])
            self.fonts[key] = ImageFont.truetype(path, size, index=idx)
        return self.fonts[key]

    def has_glyph(self, font, ch: str) -> bool:
        key = (id(font), ch)
        if key not in self.glyphs:  # a missing glyph draws as the font's empty box, like an unmapped code point
            a, b = np.asarray(font.getmask(ch)), np.asarray(font.getmask('￿'))
            self.glyphs[key] = ch.isspace() or not (a.shape == b.shape and (a == b).all())
        return self.glyphs[key]

    def text(self, img, xy, s, size, a, face='font_light', anchor='mm', colour=None):
        """Text, with any character the face lacks (♭, ♯, →…) drawn from the fallback font."""
        if a <= 0.01 or not s:
            return
        main, alt = self.font(size, face), self.font(size, 'fallback')
        runs = []
        for ch in str(s):
            f = main if self.has_glyph(main, ch) else alt
            if runs and runs[-1][0] is f:
                runs[-1][1] += ch
            else:
                runs.append([f, ch])
        width = sum(f.getlength(t) for f, t in runs)
        asc, desc = main.getmetrics()
        x = xy[0] - {'l': 0, 'm': width / 2, 'r': width}[anchor[0]]
        y = xy[1] + (asc - desc) / 2 if anchor[1] == 'm' else xy[1]
        d = ImageDraw.Draw(img)
        for f, t in runs:
            d.text((x, y), t, font=f, fill=(colour or self.ink) + (int(255 * a),), anchor='ls')
            x += f.getlength(t)

    def base(self, a: float) -> Image.Image:
        q = round(a * 20) / 20
        if q not in self.necks:
            self.necks[q] = Image.blend(self.blank, self.neck.base, q) if q < 1 else self.neck.base.copy()
        return self.necks[q]

    def x_of(self, fret: int) -> float:
        return self.neck.pos({'string': 1, 'fret': fret})[0]

    def frame(self, prims: list) -> bytes:
        V, W, H = self.V, self.W, self.H
        neck_a = next((p[1] for p in prims if p[0] == 'neck'), 0)
        img = self.base(neck_a).copy() if neck_a > 0.01 else self.blank.copy()
        layer = Image.new('RGBA', img.size, (0, 0, 0, 0))
        d = ImageDraw.Draw(layer)
        N = self.neck
        T = V['title']
        self.text(layer, (T['x'], T['y']), self.video['title'], T['size'], 1.0, 'font_medium', 'lm')
        self.text(layer, (T['x'], T['y'] + 48), self.video.get('rule', ''), V['rule']['size'], V['rule']['alpha'], anchor='lm')
        gridded = any(p[0] in ('grid', 'tab') for p in prims)  # a grid or a tab takes the fret numbers' place
        tabbed = any(p[0] == 'tab' for p in prims)
        for f in (3, 5, 7, 9, 12, 15, 17):  # fret numbers under the neck
            if f <= N.frets and not gridded:
                self.text(layer, (self.x_of(f), N.yb + 70), str(f), 20, 0.38 * neck_a)
        for p in prims:
            kind = p[0]
            if kind == 'band':
                _, lo, hi, a = p
                x0 = N.fx[max(0, lo - 1)] + 4 if lo > 0 else N.x0
                x1 = N.fx[hi] - 4
                d.rounded_rectangle([x0, N.yt - 40, x1, N.yb + 40], radius=14, fill=(255, 244, 220, int(26 * a)),
                                    outline=(255, 244, 220, int(70 * a)), width=2)
                self.text(layer, ((x0 + x1) / 2, N.yt - 64), f'frets {lo}–{hi}' if lo != hi else f'fret {lo}',
                          24, 0.6 * a)
            elif kind in ('dot', 'glow'):
                _, s, f, fam, lab, *rest = p
                x, y = N.pos({'string': s, 'fret': f})
                sk = 'glow' if kind == 'glow' else rest[0]
                a = rest[-1]
                sp = N.sprite(sk, fam, lab, a)
                layer.alpha_composite(sp, (int(x - sp.width / 2), int(y - sp.height / 2)))
                if kind == 'dot' and rest[1]:  # a ringed note: the colour note, the target
                    r = V['dot']['radius'] + 8
                    d.ellipse([x - r, y - r, x + r, y + r], outline=self.ink + (int(235 * a),), width=3)
            elif kind == 'grid':
                self.grid(layer, json.loads(p[1]), p[2], p[3])
            elif kind == 'anchor':
                an, a = json.loads(p[1]), p[2]
                x, y = N.pos({'string': an['string'], 'fret': an['fret']})
                r = V['dot']['radius'] + 9
                d.ellipse([x - r, y - r, x + r, y + r], outline=self.ink + (int(230 * a),), width=3)
                self.text(layer, (x, N.yb + 112), an.get('label', ''), 26, 0.85 * a)
                d.line([(x, N.yb + 50), (x, y + r + 4)], fill=self.ink + (int(90 * a),), width=2)
            elif kind == 'text':
                _, k, v, a = p
                if k == 'now':
                    self.text(layer, (W / 2, V['now']['y']), v, V['now']['size'], a, 'font_medium')
                elif k == 'sub':
                    self.text(layer, (W / 2, V['now']['y'] + 68), v, V['sub']['size'], a * V['sub']['alpha'])
                elif k == 'next':
                    self.text(layer, (W / 2, V['now']['y'] + 122), f'next  →  {v}', V['next']['size'],
                              a * V['next']['alpha'])
                elif k == 'section':
                    self.text(layer, (W - 90, T['y']), v, V['section']['size'] + 2, a * V['section']['alpha'],
                              'font_medium', 'rm')
                elif k == 'key':
                    self.text(layer, (W - 90, T['y'] + 48), v, V['rule']['size'], a * 0.85, anchor='rm')
            elif kind == 'keys':
                ks, a = json.loads(p[1]), p[2]
                lst, at = ks['list'], ks.get('at', -1)
                gap = 92
                x0 = W / 2 - gap * (len(lst) - 1) / 2
                for j, kname in enumerate(lst):
                    x, y = x0 + j * gap, V['keys']['y']
                    on = j == at
                    self.text(layer, (x, y), kname, V['keys']['size'], a * (1.0 if on else 0.55 if j < at else 0.3),
                              'font_medium' if on else 'font_light')
                    if on:
                        d.rounded_rectangle([x - 34, y - 32, x + 34, y + 32], radius=10,
                                            outline=A.rgb(V['colours']['r']) + (int(220 * a),), width=3)
                self.text(layer, (W / 2, V['keys']['y'] + 44), ks.get('label', 'round the cycle of fourths'), 22, 0.45 * a)
            elif kind == 'table':
                self.table(layer, json.loads(p[1]), p[2])
            elif kind == 'card':
                c, a = json.loads(p[1]), p[2]
                C = V['card']
                self.text(layer, (W / 2, 400), c.get('title', ''), C['title_size'], a, 'font_medium')
                lines = c.get('lines', [])
                if lines and all(ln[:1].isdigit() for ln in lines):  # a numbered list: one left-aligned block
                    left = W / 2 - max(self.font(C['line_size']).getlength(ln) for ln in lines) / 2
                    for j, ln in enumerate(lines):
                        self.text(layer, (left, 520 + j * 64), ln, C['line_size'], a * 0.85, anchor='lm')
                else:
                    for j, ln in enumerate(lines):
                        self.text(layer, (W / 2, 520 + j * 64), ln, C['line_size'], a * 0.85)
            elif kind == 'notes':
                _, lines, a = p
                size = V['notes']['size'] - (2 if tabbed else 0)
                lines = [w for ln in lines for w in A.wrap(ln, self.font(size), W - 260)]  # a long note wraps
                y0 = V['notes']['y'] + (48 if tabbed else 0)  # below the tab when one is showing
                if V.get('_theory'):  # the theory panel takes the bottom two rows: the notes sit above it
                    y0 = min(y0, 958 - (len(lines) - 1) * V['notes']['gap'])
                for j, ln in enumerate(lines):
                    self.text(layer, (W / 2, y0 + j * V['notes']['gap']), ln, V['notes']['size'] - (2 if tabbed else 0),
                              a * V['notes']['alpha'])
            elif kind == 'theory':
                self.theory_block(layer, W / 2, 1008, 38, 25, p[1], centre=True)
            elif kind == 'tab':
                self.tab(layer, p[1], p[2], p[3], p[4], p[5])
            elif kind == 'page':
                self.page(layer, *p[1:])
            elif kind == 'caption':
                _, text, a = p
                lines = A.wrap(text, self.font(V['caption']['size']), W - 380)
                lh = V['caption']['size'] * 1.3
                y0 = H - V['caption']['margin_bottom'] - lh * (len(lines) - 1)
                for j, ln in enumerate(lines):
                    self.text(layer, (W / 2, y0 + j * lh), ln, V['caption']['size'], a)
        img.alpha_composite(layer)
        return img.convert('RGB').tobytes()

    def tab(self, layer, win, bars, a: float, harm=(), key=None):
        """Six tab lines under the neck (string 1 on top), the music scrolling past a fixed playhead; over them the
        harmony: each chord and its numeral where it changes, the one sounding lit, the key at the left."""
        V, W = self.V, self.W
        T = V['tab']
        d = ImageDraw.Draw(layer)
        y = lambda s: T['y'] + (s - 1) * T['gap']
        x = lambda beats: T['playhead'] + beats * T['px_per_beat']
        edge = lambda xx: min(1.0, max(0.0, (xx - 110) / 120), max(0.0, (W - 110 - xx) / 160))
        if key:
            Hm = V['harmony']
            hy = T['y'] - Hm['dy']
            self.text(layer, (110, hy), key, Hm['chord_size'] - 4, a * 0.6, 'font_medium', 'lm')
            self.text(layer, (110, hy + Hm['gap']), 'key', Hm['roman_size'] - 3, a * 0.35, anchor='lm')
            hedge = lambda xx: min(1.0, max(0.0, (xx - 330) / 110), max(0.0, (W - 110 - xx) / 160))
            now_i = max((i for i, h in enumerate(harm) if h[0] <= 0.001), default=None)
            for i, (beats, ch, rn) in enumerate(harm):
                if now_i is not None and i < now_i:
                    continue  # chords already gone by are not drawn
                xx = x(beats) if i != now_i else max(x(beats), 360)  # the sounding chord stays on screen
                k = (hedge(xx) if i != now_i else 1.0) * a
                if k <= 0.01:
                    continue
                on = i == now_i
                col = A.rgb(V['colours']['r']) if on else None
                self.text(layer, (xx, hy), ch, Hm['chord_size'], k * (1.0 if on else 0.75), 'font_medium', 'lm', colour=col)
                self.text(layer, (xx, hy + Hm['gap']), rn, Hm['roman_size'], k * (0.9 if on else 0.5), anchor='lm', colour=col)
        for s in range(1, 7):
            d.line([(110, y(s)), (W - 110, y(s))], fill=self.ink + (int(70 * a),), width=1)
        for b in bars:
            xx = x(b)
            d.line([(xx, y(1)), (xx, y(6))], fill=self.ink + (int(110 * a * edge(xx)),), width=2)
        d.line([(T['playhead'], y(1) - 14), (T['playhead'], y(6) + 14)], fill=A.rgb(V['colours']['r']) + (int(150 * a),), width=2)
        f = self.font(T['size'], 'font_medium')
        for beats, s, fr, state, heard in win:
            xx = x(beats)
            k = edge(xx) * a * (1.0 if state == 2 else 0.85 if state == 1 else 0.35) * (1.0 if heard else 0.45)
            if k <= 0.01:
                continue
            label = str(fr)
            w = f.getlength(label) + 8
            d.rectangle([xx - w / 2, y(s) - 12, xx + w / 2, y(s) + 12], fill=(0, 0, 0, int(255 * a)))
            col = A.rgb(V['colours']['r']) if state == 2 else self.ink
            self.text(layer, (xx, y(s)), label, T['size'], k, 'font_medium', colour=col)

    def theory_block(self, img, x, y, gap, size, a, centre=False):
        """The theory panel: labels in blue, medium weight, in a column; the text lined up after them.
        centre: the whole block centred on x (left-aligned inside)."""
        rows = self.V.get('_theory') or []
        fm, fl = self.font(size, 'font_medium'), self.font(size)
        wl = max(fm.getlength(lab) for lab, _ in rows) + size * 0.8
        if centre:
            x -= (wl + max(fl.getlength(t) for _, t in rows)) / 2
        for j, (lab, txt) in enumerate(rows):
            self.text(img, (x, y + j * gap), lab, size, 0.95 * a, 'font_medium', 'lm', colour=A.rgb(self.V['colours']['t5']))
            self.text(img, (x + wl, y + j * gap), txt, size, 0.88 * a, anchor='lm')

    def page_sys(self, pg, s_):
        P = self.V['page']
        y_top = P['top'] + s_['row'] * P['sys_h']
        return y_top, (lambda b: P['x0'] + (b - s_['b0']) * s_['ppb']), (lambda st_: y_top + 84 + (st_ - 1) * P['gap'])

    def page_static(self, ti: int, pno: int) -> Image.Image:
        """One page of tab: chords and numerals over each system, bar numbers and marks, the notes; the legend under."""
        key = (ti, pno)
        if key in self.page_cache:
            return self.page_cache[key]
        V, P = self.V, self.V['page']
        pg = self.pages[ti]['page']
        img = Image.new('RGBA', (self.W, self.H), (0, 0, 0, 0))
        d = ImageDraw.Draw(img)
        circled = '①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳'
        mark_no = {i: j for j, (i, _) in enumerate(pg['marks'])}
        harm = [h for h in pg['harm']]
        on_page = [s_ for s_ in pg['systems'] if s_['page'] == pno]
        for s_ in on_page:
            y_top, x, y = self.page_sys(pg, s_)
            for st_ in range(1, 7):
                d.line([(P['x0'], y(st_)), (P['x1'], y(st_))], fill=self.ink + (70,), width=1)
            for bi in s_['bars']:
                b0, b1 = pg['bars'][bi]
                xb = x(b0)
                d.line([(xb, y(1)), (xb, y(6))], fill=self.ink + (110,), width=2)
                self.text(img, (xb + 6, y_top + 64), str(pg['numbers'][bi]), 17, 0.4, anchor='lm')
                if bi in mark_no:
                    self.text(img, (xb + 40, y_top + 64), circled[mark_no[bi] % 20], 24, 0.95, 'fallback',
                              colour=A.rgb(V['colours']['r']))
            d.line([(x(s_['b1']), y(1)), (x(s_['b1']), y(6))], fill=self.ink + (110,), width=2)
            # chords where they change; the chord in force repeated, dimmer, at the start of a line
            last, held, newkey, drawn_at_start = None, None, None, False
            for bt, ch, rn in harm:
                if ch == 'key':  # a new key is named in front of the next numeral
                    if s_['b0'] - 1e-6 <= bt < s_['b1'] - 1e-6:
                        newkey = rn
                    continue
                if bt < s_['b0'] + 1e-6:
                    held = (ch, rn)
                if s_['b0'] - 1e-6 <= bt < s_['b1'] - 1e-6 and ((ch, rn) != last or newkey):
                    drawn_at_start = drawn_at_start or abs(bt - s_['b0']) < 1e-6
                    self.text(img, (x(bt), y_top + 14), ch, P['chord'], 0.95, 'font_medium', 'lm')
                    xr = x(bt)
                    if newkey:
                        kl = f'{newkey}:  '
                        self.text(img, (xr, y_top + 42), kl, P['roman'], 0.95, 'font_medium', 'lm', colour=A.rgb(V['colours']['r']))
                        xr += self.font(P['roman'], 'font_medium').getlength(kl)
                        newkey = None
                    self.text(img, (xr, y_top + 42), rn, P['roman'], 0.6, anchor='lm')
                last = (ch, rn)
            if held and not drawn_at_start:  # the chord carried over the line break, dimmed
                self.text(img, (x(s_['b0']) + 4, y_top + 14), f'({held[0]})', P['chord'] - 4, 0.45, 'font_medium', 'lm')
            f = self.font(P['digit'], 'font_medium')
            for e in pg['events']:
                if s_['b0'] - 1e-6 <= e['b'] < s_['b1'] - 1e-6:
                    xx, w = x(e['b']) + 12, f.getlength(e['lab']) + 6
                    d.rectangle([xx - w / 2, y(e['s']) - 10, xx + w / 2, y(e['s']) + 10], fill=(0, 0, 0, 255))
                    self.text(img, (xx, y(e['s'])), e['lab'], P['digit'], 0.88, 'font_medium')
        rows = len(on_page)
        ly = P['top'] + rows * P['sys_h'] + (30 if V.get('_page_neck') else 18)
        theory = V.get('_theory') or []
        lines = [(None, n) for n in pg['notes']] + [(circled[j % 20], txt) for j, (i, txt) in enumerate(pg['marks'])
                                                     if any(i in s_['bars'] for s_ in on_page)]
        n_all = len(theory) + len(lines)
        gap = min(37, (1030 - ly) / max(1, n_all - 1)) if n_all > 1 else 37  # the legend squeezes to stay above the footer
        if theory:
            self.theory_block(img, P['x0'], ly, gap, P['legend'], 1.0)
        ly += len(theory) * gap + (6 if theory and lines else 0)
        for j, (c, txt) in enumerate(lines):
            yy = ly + j * gap
            if c:
                self.text(img, (P['x0'], yy), c, P['legend'], 0.95, 'fallback', 'lm', colour=A.rgb(V['colours']['r']))
            self.text(img, (P['x0'] + (36 if c else 0), yy), txt, P['legend'], 0.85 if c else 0.7, anchor='lm')
        foot = 1056 if V.get('_page_neck') else P['top'] - 40
        if V.get('_credit') and V.get('_page_neck'):
            self.text(img, (P['x0'], foot), V['_credit'], 18, 0.38, anchor='lm')
        if pg['pages'] > 1:
            self.text(img, (P['x1'], foot), f'page {pno + 1} of {pg["pages"]}', 20, 0.4, anchor='rm')
        self.page_cache[key] = img
        return img

    def page(self, layer, ti: int, pno: int, row: int, cx, lit: tuple, a: float):
        P, V = self.V['page'], self.V
        static = self.page_static(ti, pno)
        if a < 0.99:
            arr = np.asarray(static).copy()
            arr[..., 3] = (arr[..., 3] * a).astype(np.uint8)
            layer.alpha_composite(Image.fromarray(arr))
        else:
            layer.alpha_composite(static)
        pg = self.pages[ti]['page']
        if cx is None or row < 0:
            return
        s_ = next(s for s in pg['systems'] if s['page'] == pno and s['row'] == row)
        y_top, x, y = self.page_sys(pg, s_)
        d = ImageDraw.Draw(layer)
        orange = A.rgb(V['colours']['r'])
        d.line([(cx + 12, y(1) - 12), (cx + 12, y(6) + 12)], fill=orange + (int(140 * a),), width=2)
        f = self.font(P['digit'], 'font_medium')
        for j in lit:
            e = pg['events'][j]
            if not (s_['b0'] - 1e-6 <= e['b'] < s_['b1'] - 1e-6):
                continue
            xx, w = x(e['b']) + 12, f.getlength(e['lab']) + 6
            d.rectangle([xx - w / 2, y(e['s']) - 10, xx + w / 2, y(e['s']) + 10], fill=(0, 0, 0, int(255 * a)))
            self.text(layer, (xx, y(e['s'])), e['lab'], P['digit'], a, 'font_medium', colour=orange)

    def grid(self, layer, g: dict, cur: int, a: float):
        """The right hand: one box a slot, the count above, the stroke or finger inside, the slot sounding lit."""
        V, W = self.V, self.W
        n = len(g['tokens'])
        w = min(96, (W - 300) / n)
        x0, y = W / 2 - w * n / 2, V['keys']['y'] - 6
        d = ImageDraw.Draw(layer)
        accent = A.rgb(V['colours']['r'])
        for i, (tok, cnt) in enumerate(zip(g['tokens'], g['counts'])):
            x = x0 + i * w
            on = i == cur
            fill = accent + (int(200 * a),) if on else (255, 244, 220, int((22 if cnt and cnt[0].isdigit() else 10) * a))
            d.rounded_rectangle([x + 3, y - 30, x + w - 3, y + 30], radius=8, fill=fill)
            self.text(layer, (x + w / 2, y - 52), cnt, 22, a * (0.75 if cnt and cnt[0].isdigit() else 0.4))
            if tok:
                big = i in g['accents']
                self.text(layer, (x + w / 2, y), tok, 30 if len(tok) < 3 else 22, a * (0.55 if '×' in tok else 1.0),
                          'font_medium' if big or on else 'font_light', colour=(20, 16, 12) if on else None)

    def table(self, layer, tb: dict, a: float):
        V, W = self.V, self.W
        TB = V['table']
        rows, head = tb.get('rows', []), tb.get('head', [])
        groups = [rows] if len(rows) <= 6 else [rows[: (len(rows) + 1) // 2], rows[(len(rows) + 1) // 2:]]
        rh = 44
        top = 400
        bottom = top + 70 + rh * (max(len(g) for g in groups) + (1 if head else 0)) + 20
        d = ImageDraw.Draw(layer)
        d.rounded_rectangle([200, top - 24, W - 200, bottom], radius=18, fill=(255, 244, 220, int(10 * a)),
                            outline=(255, 244, 220, int(50 * a)), width=2)
        self.text(layer, (W / 2, top + 18), tb.get('title', ''), TB['size'] + 2, a, 'font_medium')
        gw = (W - 480) / len(groups)
        for gi, g in enumerate(groups):
            gx = 240 + gi * gw
            ncol = max(len(r) for r in rows) if rows else 1
            widths = tb.get('widths') or [1 / ncol] * ncol
            xs = [gx + 20 + sum(widths[:c]) * (gw - 40) for c in range(ncol)]
            y = top + 78
            if head:
                for c, h in enumerate(head):
                    self.text(layer, (xs[c], y), h.upper(), TB['head_size'], a * 0.5, 'font_medium', 'lm')
                y += rh
            for r in g:
                for c, cell in enumerate(r):
                    self.text(layer, (xs[c], y), cell, TB['size'], a * (1.0 if c == 0 else 0.85),
                              'font_medium' if c == 0 else 'font_light', 'lm')
                y += rh


def render_video(L: dict, style: dict, video: dict, audio: np.ndarray, out: Path) -> None:
    V = style['visual']
    W, H = V['size']
    painter = Painter(style, video)
    painter.pages = L['tabs']
    wav = out.with_suffix('.f32')
    wav.write_bytes(audio.tobytes())
    cmd = [A.FFMPEG, '-y', '-v', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(V['fps']),
           '-i', '-', '-f', 'f32le', '-ar', str(style['sound']['rate']), '-ac', '2', '-i', str(wav),
           '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p',
           '-c:a', 'aac', '-b:a', '256k', '-movflags', '+faststart', '-shortest', str(out)]
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    last_key, last = None, None
    total = int(L['duration'] * V['fps'])
    for i in range(total):
        prims = picture(L, style, i / V['fps'])
        key = repr(prims)
        if key != last_key:
            last, last_key = painter.frame(prims), key
        proc.stdin.write(last)
        if i % (V['fps'] * 30) == 0:
            print(f'  {i / V["fps"]:.0f}s / {total / V["fps"]:.0f}s', flush=True)
    proc.stdin.close()
    proc.wait()
    wav.unlink()
    if proc.returncode:
        raise RuntimeError('ffmpeg failed')


# ---------- main ----------

def lines_in(steps: list) -> list:
    out = []
    for st in steps:
        if 'say' in st:
            out.append(st['say'])
        out += lines_in(st.get('items', []))
    return out


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument('video')
    ap.add_argument('--plan', action='store_true', help='timings from a words-a-second estimate, no speech')
    ap.add_argument('--frames', help='comma-separated seconds: write stills to out/, no video')
    ap.add_argument('--force', action='store_true', help='render even if nothing has changed since the last render')
    args = ap.parse_args()
    style = yaml.safe_load((HERE / 'style.yaml').read_text())
    video = yaml.safe_load((HERE / 'videos' / f'{args.video}.yaml').read_text())
    song = style['visual'].pop('song', {})
    if any(s_.get('tab') for s_ in video['steps']):  # a song video: the neck moves up to make room over the tab
        for k, v in song.items():
            style['visual'][k].update(v)
    pn = style['visual'].pop('page_neck', {})
    if video.get('page_neck'):  # the neck stays on screen over the whole page of tab: a slimmer neck at the top
        for k, v in pn.items():
            style['visual'][k].update(v)
        style['visual']['_page_neck'] = True
    th = (yaml.safe_load((HERE / 'theory.yaml').read_text()) or {}).get(video['id'], {})
    style['visual']['_theory'] = video.get('theory') or th.get('theory') or []  # [[label, text], …]: the piece's theory, on screen
    credit = video.get('credit') or th.get('credit')  # the source, small in the footer, out of the legend
    for st in video['steps']:
        keep = []
        for n in st.get('notes') or []:
            m = re.match(r'^((?:Tab|Transcription):.*?\.)(?=\s|$)\s*(.*)$', n)
            if credit and n == credit:
                continue
            if m and st.get('page'):
                credit = credit or m.group(1)
                if m.group(2):
                    keep.append(m.group(2))
                continue
            keep.append(n)
        if st.get('notes'):
            st['notes'] = keep
    style['visual']['_credit'] = credit
    R = resolve(requests_in(video['steps']))
    lines = lines_in(video['steps'])
    rate = style['sound']['rate']
    if args.plan:
        L = layout(video, style, R, {s: len(s.split()) / WPS for s in lines})
        for st in L['steps']:
            print(f"{st['start']:7.1f}  {st['say'] or '(' + str(st['now']) + ')'}")
        print(f"\n{L['duration'] / 60:.1f} min, {sum(len(s) for s in lines)} characters spoken")
        for tb in L.get('tabs', []):  # legend lines on each page of tab (theory + notes + that page's marks)
            pg = tb.get('page')
            for pno in range(pg['pages'] if pg else 0):
                bars = {b for s_ in pg['systems'] if s_['page'] == pno for b in s_['bars']}
                n = len(style['visual']['_theory']) + len(pg['notes']) + sum(1 for i, _ in pg['marks'] if i in bars)
                print(f'legend page {pno + 1}: {n} lines')
        return
    keys, voice = A.env_keys(), style['voice']
    pcm = {}
    for i, s in enumerate(lines):
        ctx = (' '.join(lines[:i])[-600:], ' '.join(lines[i + 1:])[:600])
        pcm[s] = A.decode(A.synthesize(s, voice, ctx, keys), rate)
    L = layout(video, style, R, {s: len(p) / rate for s, p in pcm.items()})
    print(f"{video['id']}: {L['duration'] / 60:.1f} min, {sum(len(s) for s in lines)} characters spoken")
    OUT.mkdir(exist_ok=True)
    if args.frames:
        painter = Painter(style, video)
        painter.pages = L['tabs']
        for sec in args.frames.split(','):
            W, H = style['visual']['size']
            img = Image.frombytes('RGB', (W, H), painter.frame(picture(L, style, float(sec))))
            path = OUT / f"{video['id']}-{float(sec):.0f}s.png"
            img.save(path)
            print(path)
        return
    # skip the render when the video, the style, the builder and the engine's shapes are all as last rendered
    stamp = hashlib.sha256(json.dumps([video, style, R, (HERE / 'build.py').read_text(), (HERE / 'resolve.mjs').read_text(),
                                       (HERE.parent / 'audiation' / 'build.py').read_text()], sort_keys=True,
                                      default=str).encode()).hexdigest()[:16]
    out, meta = OUT / f"{video['id']}.mp4", OUT / f"{video['id']}.json"
    if not args.force and out.exists() and meta.exists() and json.loads(meta.read_text()).get('stamp') == stamp:
        print(f'{out} is up to date (--force to render anyway)')
        return
    audio = mix(L, style, pcm)
    render_video(L, style, video, audio, out)
    meta.write_text(json.dumps({'id': video['id'], 'title': video.get('title'), 'stamp': stamp,
                                'duration_s': round(L['duration'], 3), 'steps': L['steps']}, indent=1, ensure_ascii=False))
    print(out)


if __name__ == '__main__':
    sys.exit(main())
