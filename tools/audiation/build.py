"""Build a guided-audiation video from a session file and the house style.

    tools/audiation/.venv/bin/python tools/audiation/build.py 01-build-and-hold          # render the video
    tools/audiation/.venv/bin/python tools/audiation/build.py 01-build-and-hold --plan   # timings only, no speech

A session (sessions/<id>.yaml) names its voices (a string and a fret each; `label` only if no chord names it), optional
`groups` of voices, and its steps; the style (style.yaml) says how everything looks, sounds and is paced. Ids below may
be a voice, a list, a group or `all`. A step may carry any of these:

  cue: <text>            the faint line at the top saying what to do now ('' clears it)
  chord: {name, root, ivs, about}   the chord's name, its intervals (coloured) and where it comes from; every dot is
                         labelled by its interval from this root (null hides the name and keeps the labels)
  sound: ids             those voices come in (a soft pluck, then a held tone), rolled up from the lowest
  drop: ids              the sounding ones fade out and leave a ring: keep hearing it
  stop: ids              they fade out and leave nothing
  move: {from: to}       a voice moves: the old one stops, the new one sounds, a dot slides between the frets
  clear: ids             rings (held or imagined) fade away
  imagine: ids           a dashed ring at each voice's fret: where to imagine the note before it sounds
  hear: ids              only these rings stay bright: the notes to hold in mind now (anything sounding resets it)
  say: <line>            spoken, and captioned (after a step that changes the sound it starts pacing.after_sound_s
                         later; `after: N` overrides)
  hold: N                N seconds after everything above, to carry out the instruction in silence

Speech is ElevenLabs, cached line by line in cache/speech by its text, voice and the script around it. The sound is
synthesised here, offline, at 48 kHz. Writes out/<id>.mp4 and out/<id>.json (each step's start and end).
"""
from __future__ import annotations

import argparse
import hashlib
import json
import math
import os
import subprocess
import sys
import urllib.request
import zlib
from pathlib import Path

import imageio_ffmpeg
import numpy as np
import yaml
from PIL import Image, ImageDraw, ImageFilter, ImageFont
from scipy.signal import oaconvolve

HERE = Path(__file__).resolve().parent
CACHE, OUT = HERE / 'cache', HERE / 'out'
FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()
OPEN_STRINGS = {6: 40, 5: 45, 4: 50, 3: 55, 2: 59, 1: 64}  # standard tuning, MIDI
WPS = 2.3  # words a second at speed 0.9, for --plan


# ---------- speech ----------

def env_keys() -> dict:
    """API keys from this repo's .env, else the Mila prototype's, else the environment."""
    keys = {}
    for path in (HERE.parents[1] / '.env', Path.home() / 'Desktop' / 'mind-at-large-prototype' / '.env'):
        if path.exists():
            for line in path.read_text(encoding='utf-8').splitlines():
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    k, v = line.split('=', 1)
                    keys.setdefault(k.strip(), v.strip().strip('"').strip("'"))
    return {**keys, **{k: v for k, v in os.environ.items() if k.endswith('_API_KEY')}}


def speech_path(text: str, voice: dict, context: tuple[str, str]) -> Path:
    identity = json.dumps({'text': text, 'voice': voice, 'context': context}, sort_keys=True)
    return CACHE / 'speech' / f'{hashlib.sha256(identity.encode()).hexdigest()[:24]}.mp3'


def synthesize(text: str, voice: dict, context: tuple[str, str], keys: dict) -> Path:
    path = speech_path(text, voice, context)
    if path.exists():
        return path
    path.parent.mkdir(parents=True, exist_ok=True)
    body = {'text': text, 'model_id': voice['model'], 'voice_settings': voice['settings'], 'seed': voice['seed'],
            'previous_text': context[0], 'next_text': context[1]}
    req = urllib.request.Request(
        f"https://api.elevenlabs.io/v1/text-to-speech/{voice['voice']}?output_format=mp3_44100_128",
        data=json.dumps(body).encode(),
        headers={'xi-api-key': keys['ELEVENLABS_API_KEY'], 'Content-Type': 'application/json', 'Accept': 'audio/mpeg'})
    with urllib.request.urlopen(req, timeout=120) as r:
        data = r.read()
    if not data:
        raise RuntimeError(f'The voice returned no audio for: {text}')
    path.write_bytes(data)
    return path


def decode(path: Path, rate: int) -> np.ndarray:
    """A clip as mono float32 at `rate`, the silence the provider adds at either end trimmed."""
    trim = 'silenceremove=start_periods=1:start_threshold=-50dB'
    out = subprocess.run([FFMPEG, '-v', 'error', '-i', str(path), '-af', f'{trim},areverse,{trim},areverse',
                          '-ar', str(rate), '-ac', '1', '-f', 'f32le', '-'], check=True, capture_output=True).stdout
    return np.frombuffer(out, dtype=np.float32).copy()


# ---------- the timeline ----------

def ids_of(v, voices, groups=None) -> list:
    """Voice ids from an id, a list, a group name from the session's `groups`, or 'all'."""
    if v == 'all':
        return list(voices)
    if isinstance(v, (str, int)):
        v = (groups or {}).get(str(v), [v])
    return [str(x) for x in v]


def midi_of(v: dict) -> int:
    return OPEN_STRINGS[v['string']] + v['fret']


def layout(session: dict, style: dict, clips: dict) -> dict:
    """Times for everything: speech, captions, cues, chord labels and each voice's events."""
    P = style['pacing']
    voices = {str(k): v for k, v in session['voices'].items()}
    ev = {k: [] for k in voices}  # (time, 'ghost'|'on'|'off'|'clear'|'dim'|'undim')
    speech, captions, cues, chords, glides, steps = [], [], [], [], [], []
    groups, sounding = session.get('groups', {}), set()
    t = P['lead_in_s']
    for i, st in enumerate(session['steps']):
        t0 = t
        if 'cue' in st:
            cues.append((t0, st['cue'] or ''))
        if 'chord' in st:
            chords.append((t0, st['chord']))
        ids = lambda key: ids_of(st.get(key, []), voices, groups)
        moves = {str(a): str(b) for a, b in (st.get('move') or {}).items()}
        for a, b in moves.items():
            glides.append((t0, a, b))
        stop = ids('stop') + list(moves)
        sound = ids('sound') + list(moves.values())
        drop = [vid for vid in ids('drop') if vid in sounding]  # only what is sounding leaves a ring to hold
        sounding.difference_update(drop + stop)
        sounding.update(sound)
        for kind, vids in (('off', drop), ('clear', ids('clear')), ('ghost', ids('imagine'))):
            for vid in vids:
                ev[vid].append((t0, kind))
        for vid in stop:  # stopped (or moved away from): it fades without leaving a ring to hold
            ev[vid] += [(t0, 'off'), (t0, 'clear'), (t0, 'stop')]
        # a chord sounds rolled from its lowest note up, like a slow strum
        roll = st.get('roll', P['roll_s'])
        for j, vid in enumerate(sorted(sound, key=lambda x: midi_of(voices[x]))):
            ev[vid].append((t0 + j * roll, 'on'))
        # focus: the voices named stay bright as rings to hold, the rest dim; anything sounding resets it
        if 'hear' in st or sound:
            keep = set(ids_of(st.get('hear', 'all'), voices, groups)) | set(sound)
            for vid in voices:
                ev[vid].append((t0, 'undim' if vid in keep else 'dim'))
        moved = sound or stop or drop
        t = t0 + st.get('after', P['after_sound_s'] if moved and 'say' in st else 0)
        if 'say' in st:
            n = clips[st['say']]
            speech.append((t, st['say']))
            captions.append([t, t + n, st['say']])
            t += n + P['gap_after_line_s']
        t += st.get('hold', 0)
        steps.append({'index': i, 'start': round(t0, 3), 'end': round(t, 3), 'say': st.get('say'), 'cue': st.get('cue')})
    end = t + P['tail_s']
    for vid in ev:  # everything still sounding fades at the end
        if any(k == 'on' for _, k in ev[vid]):
            ev[vid].append((t, 'off'))
    return {'voices': voices, 'events': ev, 'speech': speech, 'captions': captions, 'cues': cues, 'chords': chords,
            'glides': glides, 'steps': steps, 'duration': end}


PC = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11}
SEMIS = {'1': 0, 'b2': 1, 'b9': 1, '2': 2, '9': 2, '#9': 3, 'b3': 3, '3': 4, '4': 5, '11': 5, '#11': 6, 'b5': 6,
         '5': 7, '#5': 8, 'b13': 8, 'b6': 8, '6': 9, '13': 9, 'bb7': 9, 'b7': 10, '7': 11}
DEFAULT_IV = ['1', 'b9', '9', 'b3', '3', '11', '#11', '5', 'b13', '13', 'b7', '7']


def label_for(v: dict, chord: dict | None) -> str:
    """A voice's interval in the chord sounding: from the chord's root and intervals, else the voice's own label."""
    if not chord or 'root' not in chord:
        return str(v.get('label', '?'))
    r = chord['root']
    root = PC[r[0]] + r[1:].count('#') - r[1:].count('b')
    semis = (midi_of(v) - root) % 12
    return next((iv for iv in chord.get('ivs', []) if SEMIS.get(iv) == semis), DEFAULT_IV[semis])


def intervals(events: list, start_kinds: set, end_kinds: set) -> list:
    """[start, end) spans that open at a start kind and close at the next end kind."""
    spans, open_t = [], None
    for t, k in sorted(events, key=lambda e: e[0]):
        if k in start_kinds and open_t is None:
            open_t = t
        elif k in end_kinds and open_t is not None:
            spans.append((open_t, t))
            open_t = None
    if open_t is not None:
        spans.append((open_t, math.inf))
    return spans


def ramp(t: float, spans: list, fade_in: float, fade_out: float) -> float:
    a = 0.0
    for s, e in spans:
        if t < s or e - s < 1e-6:
            continue
        up = min(1.0, (t - s) / fade_in) if fade_in else 1.0
        down = 1.0 if t < e else max(0.0, 1 - (t - e) / fade_out)
        a = max(a, min(up, down))
    return 0.5 - 0.5 * math.cos(math.pi * a)  # eased


# ---------- sound ----------

def tone(freq: float, dur: float, S: dict, seed: int) -> np.ndarray:
    """One held voice: soft harmonics, three detuned copies with a slow drift, a swell, attack and release."""
    rate = S['rate']
    n = int((dur + S['release_s']) * rate)
    t = np.arange(n) / rate
    rng = np.random.default_rng(seed)
    out = np.zeros(n)
    for c, cents in enumerate((-S['detune_cents'], 0.0, S['detune_cents'])):
        drift = 1.2 * np.sin(2 * np.pi * t / rng.uniform(7, 13) + rng.uniform(0, 6.3))  # cents
        f = freq * 2 ** ((cents + drift) / 1200)
        phase = 2 * np.pi * np.cumsum(f) / rate
        for k in range(1, 11):
            fk = freq * k
            if fk > 9000:
                break
            amp = k ** -1.7 * (1 / (1 + (fk / 2600) ** 2)) * (1.25 if k in (2, 3) else 1.0)
            out += amp * np.sin(k * phase + rng.uniform(0, 2 * np.pi)) * (0.8 if c != 1 else 1.0)
    out /= np.max(np.abs(out[: rate])) + 1e-9
    sw = S['swell']
    out *= 1 - sw['depth'] * (0.5 + 0.5 * np.sin(2 * np.pi * t / sw['period_s'] + rng.uniform(0, 6.3)))
    env = np.ones(n)
    a = int(S['attack_s'] * rate)
    env[:a] = 0.5 - 0.5 * np.cos(np.pi * np.arange(a) / a)
    r0, r = int(dur * rate), n - int(dur * rate)
    env[r0:] *= 0.5 + 0.5 * np.cos(np.pi * np.arange(r) / r)
    return out * env


def pluck(freq: float, S: dict, seed: int) -> np.ndarray:
    """A soft guitar-like pluck: partials shaped by the picking point, the high ones dying first."""
    P, rate = S['pluck'], S['rate']
    n = int(P['decay_s'] * 2.5 * rate)
    t = np.arange(n) / rate
    rng = np.random.default_rng(seed + 99)
    out = np.zeros(n)
    for k in range(1, 18):
        fk = freq * k * math.sqrt(1 + 0.00008 * k * k)  # a touch of string stiffness
        if fk > 12000:
            break
        amp = abs(math.sin(math.pi * k * P['position'])) / k
        out += amp * np.exp(-t * (1 / P['decay_s']) * (1 + 0.35 * (k - 1))) * np.sin(2 * np.pi * fk * t + rng.uniform(0, 0.3))
    att = int(0.004 * rate)
    out[:att] *= np.linspace(0, 1, att)
    return out / (np.max(np.abs(out)) + 1e-9)


def reverb_ir(R: dict, rate: int, seed: int = 3) -> np.ndarray:
    """A stereo room: decorrelated noise, highs dying faster than lows, a little pre-delay."""
    n = int(R['seconds'] * rate)
    t = np.arange(n) / rate
    rng = np.random.default_rng(seed)
    ir = np.zeros((n, 2))
    for ch in range(2):
        noise = rng.standard_normal(n)
        spec = np.fft.rfft(noise)
        f = np.fft.rfftfreq(n, 1 / rate)
        lo = np.fft.irfft(spec * (f < 2500), n) * np.exp(-6.9 * t / R['rt60'])
        hi = np.fft.irfft(spec * (f >= 2500), n) * np.exp(-6.9 * t / R['rt60_high'])
        ir[:, ch] = (lo + 0.6 * hi) * (1 - np.exp(-t / 0.012))  # soft onset
    pre = np.zeros((int(R['predelay_ms'] / 1000 * rate), 2))
    ir = np.vstack([pre, ir])
    return ir / np.sqrt(np.sum(ir ** 2, axis=0))


def mix(L: dict, style: dict, voices_pcm: dict) -> np.ndarray:
    S = style['sound']
    rate = S['rate']
    n = int((L['duration'] + 1) * rate)
    tones = np.zeros((n, 2))
    for i, (vid, v) in enumerate(L['voices'].items()):
        midi = OPEN_STRINGS[v['string']] + v['fret']
        freq = 440 * 2 ** ((midi - 69) / 12)
        level = S['level'] * (freq / 130.8) ** -0.22
        pan = (3.5 - v['string']) / 2.5 * 0.32  # low strings left, high right
        gains = np.array([math.cos((pan + 1) * math.pi / 4), math.sin((pan + 1) * math.pi / 4)]) * math.sqrt(2)
        for j, (s, e) in enumerate(intervals(L['events'][vid], {'on'}, {'off'})):
            seed = zlib.crc32(f"{vid}{j}".encode()) & 0xffff
            sig = tone(freq, e - s, S, seed)
            pk = pluck(freq, S, seed) * S['pluck']['level']
            sig[: len(pk)] += pk[: len(sig)]
            a = int(s * rate)
            b = min(n, a + len(sig))
            tones[a:b] += np.outer(sig[: b - a] * level, gains)
    voice = np.zeros(n)
    for t0, text in L['speech']:
        pcm = voices_pcm[text]
        a = int(t0 * rate)
        voice[a: a + len(pcm)] += pcm[: n - a]
    R = S['reverb']
    ir = reverb_ir(R, rate)
    wet_t = np.stack([oaconvolve(tones[:, c], ir[:, c])[:n] for c in range(2)], axis=1)
    wet_v = np.stack([oaconvolve(voice, ir[:, c])[:n] for c in range(2)], axis=1)
    tones_mix = tones * (1 - R['wet_tones']) + wet_t * R['wet_tones'] * 2.2
    # levels by loudness: the voice's speaking level against the fullest second of the chord
    sec = rate
    t_rms = max(np.sqrt(np.mean(tones_mix[i: i + sec] ** 2)) for i in range(0, n - sec, sec))
    v_rms = np.sqrt(np.mean(voice[np.abs(voice) > 0.01] ** 2))
    gain = t_rms * 10 ** (S['voice_db'] / 20) / v_rms
    voice_mix = (voice[:, None] * (1 - R['wet_voice']) + wet_v * R['wet_voice'] * 2.2) * gain
    out = tones_mix + voice_mix
    out /= np.max(np.abs(out))
    # a faint unpitched room tone, so a silent hold never sounds like the sound has cut out
    m = 30 * rate  # thirty seconds of it, looped
    spec = np.fft.rfft(np.random.default_rng(5).standard_normal((m, 2)), axis=0)
    f = np.fft.rfftfreq(m, 1 / rate)[:, None]
    room = np.fft.irfft(spec / np.sqrt(np.maximum(f, 20)) / (1 + f / 4000), m, axis=0)  # pink, darkened
    room = np.tile(room, (n // m + 1, 1))[:n]
    out += room / np.sqrt(np.mean(room ** 2)) * 10 ** (S['room_db'] / 20)
    return (out / np.max(np.abs(out)) * S['peak']).astype(np.float32)


# ---------- pictures ----------

def rgb(hexs: str) -> tuple:
    hexs = hexs.lstrip('#')
    return tuple(int(hexs[i: i + 2], 16) for i in (0, 2, 4))


def family(label: str) -> str:
    label = str(label)
    if label == '1':
        return 'r'
    d = int(''.join(ch for ch in label if ch.isdigit()) or 0)
    return {3: 't3', 5: 't5', 7: 't7'}.get(((d - 1) % 7) + 1 if d else 0, 'tx')


def pretty(label: str) -> str:
    return str(label).replace('b', '♭').replace('#', '♯')


class Painter:
    def __init__(self, style: dict, voices: dict):
        V = style['visual']
        self.V, self.W, self.H = V, *V['size']
        self.font = lambda size, face='font_light': ImageFont.truetype(V['font'], size, index=V[face])
        N = V['neck']
        self.frets = N['frets']
        (self.x0, self.x1), (self.yt, self.yb) = N['x'], N['y']
        scale = (self.x1 - self.x0) / (1 - 2 ** (-self.frets / 12))
        self.fx = [self.x0 + scale * (1 - 2 ** (-f / 12)) for f in range(self.frets + 1)]
        self.sy = {s: self.yt + (s - 1) * (self.yb - self.yt) / 5 for s in range(1, 7)}
        self.base = self.draw_neck()
        self.sprites = {}
        self.voices = voices
        self.cap_font, self.cue_font = self.font(V['caption']['size']), self.font(V['cue']['size'])
        C = V['chord']
        self.chord_font, self.ivs_font = self.font(C['size']), self.font(C['ivs_size'], 'font_medium')
        self.about_font = self.font(C['about_size'])

    def pos(self, v: dict) -> tuple:
        f = v['fret']
        x = self.x0 - 34 if f == 0 else (self.fx[f - 1] + self.fx[f]) / 2
        return x, self.sy[v['string']]

    def draw_neck(self) -> Image.Image:
        """Rosewood, nickel frets, a bone nut, pearl dots and strings, drawn at 2x and dimmed."""
        k = 2
        W, H = self.W * k, self.H * k
        img = Image.new('RGB', (W, H), self.V['background'])
        d = ImageDraw.Draw(img)
        top, bot = (self.yt - 46) * k, (self.yb + 46) * k
        x0, x1 = self.x0 * k, (self.x1 + 60) * k
        for y in range(int(top), int(bot)):  # wood: darker at the edges, a faint grain
            u = (y - top) / (bot - top)
            shade = 0.55 + 0.45 * math.sin(math.pi * u)
            grain = 1 + 0.05 * math.sin(y * 0.37) * math.sin(y * 0.071)
            c = tuple(int(ch * shade * grain) for ch in (58, 36, 22))
            d.line([(x0, y), (x1, y)], fill=c)
        for y in (top, bot - 2 * k):  # binding
            d.rectangle([x0, y, x1, y + 2 * k], fill=(196, 182, 150))
        for f in (3, 5, 7, 9, 15, 17):
            if f <= self.frets:
                cx, cy, r = (self.fx[f - 1] + self.fx[f]) / 2 * k, (self.yt + self.yb) / 2 * k, 13 * k
                d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(214, 210, 222))
        if self.frets >= 12:
            cx = (self.fx[11] + self.fx[12]) / 2 * k
            for cy in ((self.sy[2] + self.sy[3]) / 2 * k, (self.sy[4] + self.sy[5]) / 2 * k):
                r = 13 * k
                d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(214, 210, 222))
        d.rectangle([x0 - 14 * k, top, x0, bot], fill=(236, 226, 200))  # nut
        for f in range(1, self.frets + 1):
            x = self.fx[f] * k
            d.rectangle([x - 3 * k, top, x + 3 * k, bot], fill=(150, 152, 148))
            d.rectangle([x - 1 * k, top, x + 1 * k, bot], fill=(232, 233, 228))
        for s in range(1, 7):
            y = self.sy[s] * k
            w = (0.9 + 0.42 * (s - 1)) * k
            col = (222, 206, 166) if s >= 4 else (214, 218, 222)
            d.rectangle([x0 - 120 * k, y - w, x1 + 40 * k, y + w], fill=tuple(int(c * 0.55) for c in col))
            d.rectangle([x0 - 120 * k, y - w * 0.4, x1 + 40 * k, y + w * 0.4], fill=col)
        img = img.resize((self.W, self.H), Image.LANCZOS)
        a = np.asarray(img).astype(np.float32) * self.V['neck']['dim']
        x = np.arange(self.W)
        fade = np.clip((self.x1 + 70 - x) / 150, 0, 1) * np.clip((x - self.x0 + 170) / 120, 0, 1)  # into the dark
        a *= fade[None, :, None]
        return Image.fromarray(a.astype(np.uint8)).convert('RGBA')

    def sprite(self, kind: str, fam: str, label: str, a: float) -> Image.Image:
        """A dot, glow, ring or dashed ring, supersampled for smooth edges, cached by its alpha in 1/40 steps."""
        q = round(a * 40)
        key = (kind, fam, label, q)
        if key in self.sprites:
            return self.sprites[key]
        D = self.V['dot']
        col = rgb(self.V['colours'][fam])
        r = D['radius']
        if kind == 'glow':
            R = int(r * D['glow'])
            im = Image.new('RGBA', (R * 2, R * 2), (0, 0, 0, 0))
            ImageDraw.Draw(im).ellipse([R - r * 1.15, R - r * 1.15, R + r * 1.15, R + r * 1.15], fill=col + (int(235 * q / 40),))
            im = im.filter(ImageFilter.GaussianBlur(r * 0.6))
        else:
            k, R = 4, r + 6
            im = Image.new('RGBA', (R * 2 * k, R * 2 * k), (0, 0, 0, 0))
            d = ImageDraw.Draw(im)
            c, rr = R * k, r * k
            alpha = int(255 * q / 40)
            if kind != 'dot':  # an empty ring is dark inside, so the strings don't cross its label
                d.ellipse([c - rr, c - rr, c + rr, c + rr], fill=(8, 6, 5, int(200 * q / 40)))
            if kind == 'dot':
                d.ellipse([c - rr, c - rr, c + rr, c + rr], fill=col + (alpha,))
            elif kind == 'ring':
                d.ellipse([c - rr, c - rr, c + rr, c + rr], outline=col + (alpha,), width=3 * k)
            elif kind == 'ghost':
                for j in range(16):  # dashed
                    a0 = j * 22.5
                    d.arc([c - rr, c - rr, c + rr, c + rr], a0, a0 + 12, fill=col + (alpha,), width=3 * k)
            im = im.resize((R * 2, R * 2), Image.LANCZOS)
            f = self.font(28, 'font_medium')
            if f.getlength(pretty(label)) > r * 1.5:  # a long label steps down a size to stay inside the dot
                f = self.font(22, 'font_medium')
            ink = (24, 20, 16, int(240 * q / 40)) if kind == 'dot' else col + (alpha,)
            ImageDraw.Draw(im).text((R, R + 1), pretty(label), font=f, fill=ink, anchor='mm')
        self.sprites[key] = im
        return im

    def text(self, img, xy, s, font, rgb_, a, anchor='mm'):
        if a <= 0.01 or not s:
            return
        ImageDraw.Draw(img).text(xy, s, font=font, fill=rgb_ + (int(255 * a),), anchor=anchor)

    def frame(self, state: dict) -> bytes:
        img = self.base.copy()
        layer = Image.new('RGBA', img.size, (0, 0, 0, 0))
        def put(kind, lab, a, x, y):
            if a > 0.012:
                sp = self.sprite(kind, family(lab), lab, a)
                layer.alpha_composite(sp, (int(x - sp.width / 2), int(y - sp.height / 2)))

        for vid, s in state['voices'].items():
            x, y = self.pos(self.voices[vid])
            for kind in ('glow', 'ghost', 'ring', 'fill'):
                if s[kind] > 0.012:  # a label changing with the chord crossfades
                    if s['u'] < 1:
                        put('dot' if kind == 'fill' else kind, s['prev'], s[kind] * (1 - s['u']), x, y)
                    put('dot' if kind == 'fill' else kind, s['lab'], s[kind] * s['u'], x, y)
        for a_id, b_id, u, lab in state['glides']:  # a moving voice travels from its old fret to its new one
            (xa, ya), (xb, yb) = self.pos(self.voices[a_id]), self.pos(self.voices[b_id])
            e = 0.5 - 0.5 * math.cos(math.pi * u)
            a = round(0.8 * math.sin(math.pi * u), 2)
            put('glow', lab, a, xa + (xb - xa) * e, ya + (yb - ya) * e)
            put('dot', lab, a, xa + (xb - xa) * e, ya + (yb - ya) * e)
        ink = rgb(self.V['ink'])
        V = self.V
        for text, a in state['captions']:
            lines = wrap(text, self.cap_font, self.W - 360)
            lh = V['caption']['size'] * 1.3
            y0 = self.H - V['caption']['margin_bottom'] - lh * (len(lines) - 1)
            for i, ln in enumerate(lines):
                self.text(layer, (self.W / 2, y0 + i * lh), ln, self.cap_font, ink, a)
        for text, a in state['cues']:
            self.text(layer, (self.W / 2, V['cue']['margin_top']), text, self.cue_font, ink, a * V['cue']['alpha'])
        C = V['chord']
        for ch, a in state['chords']:
            self.text(layer, (self.W / 2, C['y']), ch.get('name', ''), self.chord_font, ink, a * 0.92)
            ivs = [pretty(i) for i in ch.get('ivs', [])]
            if ivs:
                gap = 26
                widths = [self.ivs_font.getlength(i) for i in ivs]
                x = self.W / 2 - (sum(widths) + gap * (len(ivs) - 1)) / 2
                for i, w in zip(ch['ivs'], widths):
                    self.text(layer, (x, C['y'] + 74), pretty(i), self.ivs_font, rgb(V['colours'][family(i)]), a * 0.9, 'lm')
                    x += w + gap
            if ch.get('about'):
                self.text(layer, (self.W / 2, C['y'] + 128), ch['about'], self.about_font, ink, a * 0.5)
        img.alpha_composite(layer)
        return img.convert('RGB').tobytes()


def wrap(text: str, font, width: float) -> list:
    words, lines, cur = text.split(), [], ''
    for w in words:
        nxt = (cur + ' ' + w).strip()
        if font.getlength(nxt) > width and cur:
            lines.append(cur)
            cur = w
        else:
            cur = nxt
    return lines + [cur] if cur else lines


def states(L: dict, style: dict):
    """The picture's state at each frame, its alphas rounded so a still moment repeats the frame before."""
    V = style['visual']
    D = V['dot']
    fps = V['fps']
    spans = {}
    for vid, ev in L['events'].items():
        spans[vid] = {'fill': intervals(ev, {'on'}, {'off'}),
                      'ring': intervals(ev, {'off'}, {'on', 'clear'}),
                      'ghost': intervals(ev, {'ghost'}, {'on', 'clear', 'off'}),
                      'dim': intervals(ev, {'dim'}, {'undim'})}
    ctx = [(s, c) for s, c in L['chords'] if c and 'root' in c]  # the chord the interval labels are read from
    caps = L['captions']
    lingers = []
    for i, (s, e, text) in enumerate(caps):  # a caption lingers, but not past the next one
        nxt = caps[i + 1][0] if i + 1 < len(caps) else math.inf
        lingers.append((s, min(e + V['caption']['linger_s'], nxt - 0.2), text))

    def changes(items, t, fade):  # (start, value) items, each holding until the next, fading in after the last fades out
        out = []
        for i, (s, val) in enumerate(items):
            e = items[i + 1][0] if i + 1 < len(items) else math.inf
            s_in = s + fade if i and items[i - 1][1] else s
            a = ramp(t, [(s_in, max(e, s_in))], fade, fade)
            if a > 0.01 and val:
                out.append((val, round(a, 2)))
        return out

    for fi in range(int(L['duration'] * fps)):
        t = fi / fps
        vs = {}
        ci = max((i for i, (s, _) in enumerate(ctx) if s <= t), default=None)
        u = 1.0 if ci is None or ci == 0 else round(min(1.0, (t - ctx[ci][0]) / 0.5), 1)
        for vid, sp in spans.items():
            v = L['voices'][vid]
            fill = ramp(t, sp['fill'], D['fade_in_s'], D['fade_out_s'])
            breathe = 0.82 + 0.18 * math.sin(2 * math.pi * t / D['breathe_s'] + zlib.crc32(vid.encode()) % 7)
            focus = 1 - 0.8 * ramp(t, sp['dim'], 0.4, 0.4)
            lab = label_for(v, ctx[ci][1] if ci is not None else None)
            prev = label_for(v, ctx[ci - 1][1]) if ci else lab
            st = max((s for s, k in L['events'][vid] if k == 'stop' and s <= t), default=None)
            if st is not None and t - st < D['fade_out_s'] + 0.1:  # a note leaving keeps the label it had
                old = max((i for i, (s, _) in enumerate(ctx) if s < st), default=None)
                lab = prev = label_for(v, ctx[old][1] if old is not None else None)
            vs[vid] = {'fill': round(fill, 2), 'glow': round(fill * breathe, 2),
                       'ring': round(ramp(t, sp['ring'], D['ring_fade_s'], D['ring_fade_s']) * (1 - fill) * focus, 2),
                       'ghost': round(ramp(t, sp['ghost'], D['ring_fade_s'], D['ring_fade_s']) * 0.7 * (1 - fill) * focus, 2),
                       'lab': lab, 'prev': prev, 'u': u if prev != lab else 1.0}
        gl = [(a, b, round((t - s) / D['glide_s'], 2), vs[b]['lab']) for s, a, b in L['glides'] if 0 < t - s < D['glide_s']]
        cap = [(text, round(ramp(t, [(s, e)], V['caption']['fade_s'], V['caption']['fade_s']), 2)) for s, e, text in lingers]
        yield {'voices': vs, 'glides': gl, 'captions': [c for c in cap if c[1] > 0.01],
               'cues': changes(L['cues'], t, V['cue']['fade_s']),
               'chords': [(c, a) for c, a in changes([(s, json.dumps(c) if c else None) for s, c in L['chords']], t,
                                                     V['chord']['fade_s'])]}


def render_video(L: dict, style: dict, audio: np.ndarray, out: Path) -> None:
    V = style['visual']
    W, H = V['size']
    painter = Painter(style, L['voices'])
    wav = out.with_suffix('.f32')
    wav.write_bytes(audio.tobytes())
    cmd = [FFMPEG, '-y', '-v', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(V['fps']),
           '-i', '-', '-f', 'f32le', '-ar', str(style['sound']['rate']), '-ac', '2', '-i', str(wav),
           '-c:v', 'libx264', '-preset', 'medium', '-crf', '17', '-tune', 'stillimage', '-pix_fmt', 'yuv420p',
           '-c:a', 'aac', '-b:a', '256k', '-movflags', '+faststart', '-shortest', str(out)]
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    last_key, last = None, None
    total = int(L['duration'] * V['fps'])
    for i, st in enumerate(states(L, style)):
        st['chords'] = [(json.loads(c), a) for c, a in st['chords']]
        key = json.dumps(st, sort_keys=True)
        if key != last_key:
            last, last_key = painter.frame(st), key
        proc.stdin.write(last)
        if i % (V['fps'] * 30) == 0:
            print(f'  {i / V["fps"]:.0f}s / {total / V["fps"]:.0f}s', flush=True)
    proc.stdin.close()
    proc.wait()
    wav.unlink()
    if proc.returncode:
        raise RuntimeError('ffmpeg failed')


# ---------- main ----------

def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument('session')
    ap.add_argument('--plan', action='store_true', help='timings from a words-a-second estimate, no speech')
    ap.add_argument('--audio', action='store_true', help='render the sound only, to out/<id>.wav')
    args = ap.parse_args()
    style = yaml.safe_load((HERE / 'style.yaml').read_text())
    session = yaml.safe_load((HERE / 'sessions' / f'{args.session}.yaml').read_text())
    style['visual']['neck'].update(session.get('neck', {}))  # a session may show fewer frets, for a bigger neck
    lines = [st['say'] for st in session['steps'] if 'say' in st]
    rate = style['sound']['rate']
    if args.plan:
        clips = {s: len(s.split()) / WPS for s in lines}
        L = layout(session, style, clips)
        for st in L['steps']:
            print(f"{st['start']:7.1f}  {st['say'] or '(' + (st['cue'] or '…') + ')'}")
        print(f"\n{L['duration'] / 60:.1f} min, {sum(len(s) for s in lines)} characters spoken")
        return
    keys, voice = env_keys(), style['voice']
    pcm = {}
    for i, s in enumerate(lines):
        ctx = (' '.join(lines[:i])[-600:], ' '.join(lines[i + 1:])[:600])
        pcm[s] = decode(synthesize(s, voice, ctx, keys), rate)
    L = layout(session, style, {s: len(p) / rate for s, p in pcm.items()})
    print(f"{session['id']}: {L['duration'] / 60:.1f} min")
    audio = mix(L, style, pcm)
    OUT.mkdir(exist_ok=True)
    if args.audio:
        out = OUT / f"{session['id']}.wav"
        subprocess.run([FFMPEG, '-y', '-v', 'error', '-f', 'f32le', '-ar', str(rate), '-ac', '2', '-i', '-', str(out)],
                       input=audio.tobytes(), check=True)
        print(out)
        return
    out = OUT / f"{session['id']}.mp4"
    render_video(L, style, audio, out)
    (OUT / f"{session['id']}.json").write_text(json.dumps({'id': session['id'], 'title': session.get('title'),
                                                           'duration_s': round(L['duration'], 3), 'steps': L['steps']},
                                                          indent=1, ensure_ascii=False))
    print(out)


if __name__ == '__main__':
    sys.exit(main())
