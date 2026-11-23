"""Write the repertoire videos that come from a classtab.org tab: a playthrough, then the annotated page.
Each entry names the tab file, the bars, the metre and the harmony (reviewed by hand), the marks and the tempos.
Tabs are cached in cache/src/ (classtab files are for private study: the notes are public domain, the fingering is
the tabber's, and these videos are for the user's own practice).

    python3 tools/drillvideo/songs.py            # rewrites every song listed here
"""
import json
import re
import urllib.request
from pathlib import Path

HERE = Path(__file__).resolve().parent
SRC = HERE / 'cache' / 'src'
q = lambda x: json.dumps(x, ensure_ascii=False)
OCT = {6: {'E': 'E2', 'D': 'D2', 'C': 'C2', 'F': 'F2', 'G': 'G2'}, 5: {'A': 'A2', 'G': 'G2', 'B': 'B2'}, 4: {'D': 'D3', 'C': 'C3', 'E': 'E3'},
       3: {'G': 'G3', 'F#': 'F#3', 'F': 'F3'}, 2: {'B': 'B3', 'A': 'A3', 'C': 'C4'}, 1: {'E': 'E4', 'D': 'D4', 'F': 'F4'}}
STANDARD = ['E2', 'A2', 'D3', 'G3', 'B3', 'E4']
DADGAD = ['D2', 'A2', 'D3', 'G3', 'A3', 'D4']


def fetch(name: str) -> str:
    SRC.mkdir(parents=True, exist_ok=True)
    path = SRC / name
    if not path.exists():
        req = urllib.request.Request(f'https://www.classtab.org/{name}', headers={'User-Agent': 'Mozilla/5.0'})
        path.write_bytes(urllib.request.urlopen(req).read())
    return path.read_text(errors='replace')


def parse(text: str):
    """The first version's bars: for each, its onsets (string.fret, '+' for together) and their columns; the tuning."""
    lines = text.split('\n')
    bars, tuning, i = [], None, 0
    while i < len(lines):
        blk = lines[i:i + 6]
        if len(blk) == 6 and all(re.match(r'^\s*([A-Ga-g][#b]?)?\s*[|:-]', l) and l.count('-') > 3 for l in blk):
            names = [(re.match(r'^\s*([A-Ga-g][#b]?)', l) or [None, None])[1] for l in blk]
            tun = [OCT[6 - k].get(names[5 - k][0].upper() + names[5 - k][1:]) if names[5 - k] else None for k in range(6)]
            if None in tun:
                tun = tuning
            if tuning is None:
                tuning = tun
            elif tun != tuning and bars:
                break  # a second version in another tuning
            rows = [re.sub(r'^\s*[A-Ga-g][#b]?\s*', '', l).lstrip('|:') for l in blk]
            segs = [r.split('|') for r in rows]
            for b in range(max(len(x) for x in segs)):
                rr = [x[b] if b < len(x) else '' for x in segs]
                if not any(ch.isdigit() for r in rr for ch in r):
                    continue
                width = max(len(r) for r in rr)
                # each string's notes by column; a run of digits that can't be one fret (107, 129: notes written with no
                # dash between them) splits into frets, each at its own column: two digits when they make a fret up to
                # 19, else one
                at = {}
                for s_, r in enumerate(rr):
                    for m in re.finditer(r'[0-9]+', r):
                        run, c0 = m.group(0), m.start()
                        harm = 'n' if c0 and r[c0 - 1] == '<' else ''
                        parts, k = [], 0
                        if len(run) <= 2:
                            parts = [(0, run)]
                        else:
                            while k < len(run):
                                two = run[k:k + 2]
                                take = two if len(two) == 2 and two[0] == '1' and int(two) <= 19 else run[k]
                                parts.append((k, take)); k += len(take)
                        for off, fr in parts:
                            at.setdefault(c0 + off, []).append(f'{s_ + 1}.{int(fr)}{harm}')
                ons, cols = [], []
                for c in range(width):
                    col = at.get(c, [])
                    if col:
                        ons.append('+'.join(sorted(col, key=lambda x: -int(x.split('.')[0]))))
                        cols.append(c)
                bars.append((ons, cols, width))
            i += 6
            continue
        if bars and re.match(r'^\s*(2nd|second|3rd) version', lines[i].lower()):
            break
        i += 1
    return bars, tuning or STANDARD


def voice(bars, a: int, b: int, beats: float, quantum: float, even: bool = False) -> str:
    """Bars a..b (1-based) as one tab voice; timing from the columns (classtab spaces time evenly), snapped."""
    out = []
    for ons, cols, width in bars[a - 1:b]:
        if even:
            ts = [k * beats / len(ons) for k in range(len(ons))]
        else:
            ts = [min(round(((c - 1) / max(1, width - 1)) * beats / quantum) * quantum, beats - quantum) for c in cols]
            merged = {}  # notes that snap to the same slot sound together
            for t, o in zip(ts, ons):
                notes = {x.split('.')[0]: x for x in (merged.get(round(t, 6), '') + '+' + o).strip('+').split('+') if x}
                merged[round(t, 6)] = '+'.join(sorted(notes.values(), key=lambda x: -int(x.split('.')[0])))
            ts, ons = list(merged.keys()), list(merged.values())
        toks = [f'r:{ts[0]:g}'] if ts and ts[0] > 0 else []
        for k, (t, o) in enumerate(zip(ts, ons)):
            nxt = ts[k + 1] if k + 1 < len(ts) else beats
            toks.append(f'{o}:{max(quantum, nxt - t):g}')
        out.append(' '.join(toks))
    return ' | '.join(out) + ' |'


def song(S: dict) -> str:
    bars, tuning = parse(fetch(S['file']))
    v = voice(bars, S['bars'][0], S['bars'][1], S['beats'], S.get('quantum', 0.25), S.get('even', False))
    return render(S, [v], tuning)


def render(S: dict, voices: list, tuning: list) -> str:
    if S.get('short', True):  # every repertoire piece now: the whole tab with the neck, at tempo
        return render_short(S, voices, tuning)
    tune = '' if tuning == STANDARD else f'tuning: {q(tuning)}\n'
    pickup = '      pickup: true\n' if S.get('pickup') else ''
    drill = S.get('drill') or ['1   Hear it once, following the tab', '2   Read the page: each mark explains a bar',
                               '3   Two bars at a time, slowly', f"4   The whole excerpt at {S['bpm']}"]
    return f'''# {S['comment']}
# Written by songs.py from {S.get('file') or 'the ABC at abcnotation.com, ' + S.get('abc', '')}: change it there, not here.
id: {S['id']}
title: {q(S['title'])}
rule: {q(S['rule'])}
{tune}bpm: {S['bpm']}
captions: false

steps:
  - card: {{title: {q(S['title'])}, lines: {q(S['lines'])}}}
    hold: 4
  - card: {{title: The drill, lines: {q(drill)}}}
    hold: 8.5

  - card: null
    section: Hear it
    key: {q(S['key'])}
    now: {q(S['now'])}
    sub: {q(S['sub'])}
    notes: {q(S.get('hear_notes')) if S.get('hear_notes') else 'null'}
    tab:
      root: {S['root']}
      harmony: {q(S['harmony'])}
{pickup}      voices: {q(voices)}

  - section: The score
    bpm: {S['page_bpm']}
    notes: {q(S.get('notes')) if S.get('notes') else 'null'}
    page:
      marks: {q(S['marks'])}

  - section: null
    key: null
    notes: {q(S.get('next')) if S.get('next') else 'null'}
    card:
      title: You've got it when
      lines: {q(S['got'])}
    hold: 5
'''


GENRE = {'c': 'Classical guitar', 'cl': 'Classical guitar', 'cp': 'Counterpoint', 'fb': 'Folk baroque', 'r': 'Roots and ragtime',
         'l': 'Latin American', 'b': 'Brazilian', 'j': 'Jazz', 's': 'Spanish', 'w': 'World', 'o': 'Original', 'tp': 'Fingerstyle'}


def render_short(S: dict, voices: list, tuning: list) -> str:
    """The short format (under a minute): a title card, the whole excerpt as a page of tab with the neck over it,
    played at tempo (`repeat` times), and a two-line end card."""
    tune = '' if tuning == STANDARD else f'tuning: {q(tuning)}\n'
    pickup = '      pickup: true\n' if S.get('pickup') else ''
    notes = (S.get('hear_notes') or []) + (S.get('notes') or [])
    S = {**S, 'notes': notes, 'genre': S.get('genre') or GENRE.get(re.match(r'[a-z]+', S['id']).group(0), S['title'])}
    return f'''# {S['comment']}
# Written by songs.py from {S.get('file') or 'the ABC at abcnotation.com, ' + S.get('abc', '')}: change it there, not here.
id: {S['id']}
title: {q(S['title'])}
rule: {q(S['rule'])}
{tune}bpm: {S['bpm']}
captions: false
page_neck: true

steps:
  - card: {{title: {q(S['title'])}, lines: {q(S['lines'])}}}
    hold: 3

  - card: null
    section: {q(S.get('genre', S['title']))}
    key: {q(S['key'])}
    notes: {q(S.get('notes')) if S.get('notes') else 'null'}
    page:
      root: {S['root']}
      repeat: {S.get('repeat', 1)}
      harmony: {q(S['harmony'])}
{pickup}      voices: {q(voices)}
      marks: {q(S['marks'])}

  - section: null
    key: null
    notes: null
    card:
      title: You've got it when
      lines: {q(S['got'])}
    hold: 3
'''


# ---------- ABC (folk tunes, with chord symbols) ----------

KEYSIG = {'C': '', 'G': 'F', 'D': 'FC', 'A': 'FCG', 'E': 'FCGD', 'B': 'FCGDA', 'F': 'B', 'Bb': 'BE', 'Eb': 'BEA', 'Ab': 'BEAD',
          'Am': '', 'Em': 'F', 'Bm': 'FC', 'Dm': 'B', 'Gm': 'BE', 'Cm': 'BEA',
          'ADor': 'FC'[:0] + '', 'DDor': '', 'EDor': 'FC'[:1], 'GDor': 'B', 'AMix': 'FC', 'DMix': 'F', 'GMix': '', 'EMin': 'F', 'AMin': ''}
PC = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11}


def fetch_abc(page: str) -> str:
    SRC.mkdir(parents=True, exist_ok=True)
    path = SRC / (re.sub(r'[^A-Za-z0-9]+', '_', page)[-80:] + '.abc')
    if not path.exists():
        req = urllib.request.Request(f'https://abcnotation.com/tunePage?a={page}', headers={'User-Agent': 'Mozilla/5.0'})
        import html as H
        t = urllib.request.urlopen(req).read().decode('utf-8', 'replace')
        m = re.search(r'<textarea[^>]*>(.*?)</textarea>', t, re.S) or re.search(r'<pre[^>]*>(.*?)</pre>', t, re.S)
        path.write_text(H.unescape(m.group(1)))
    return path.read_text()


def signature(k: str):
    """The sharps or flats of an ABC key (tonic + mode): via the relative major and the circle of fifths."""
    m = re.match(r'\s*([A-G])([#b]?)\s*([A-Za-z]*)', k)
    tonic = PC[m[1]] + (1 if m[2] == '#' else -1 if m[2] == 'b' else 0)
    mode = (m[3] or 'maj').lower()[:3]
    off = {'maj': 0, 'ion': 0, 'dor': 2, 'phr': 4, 'lyd': 5, 'mix': 7, 'm': 9, 'min': 9, 'aeo': 9, 'loc': 11}.get(mode, 9 if mode.startswith('m') else 0)
    major = (tonic - off) % 12
    n = {0: 0, 7: 1, 2: 2, 9: 3, 4: 4, 11: 5, 6: 6, 5: -1, 10: -2, 3: -3, 8: -4, 1: -5}[major]
    return (set('FCGDAEB'[:n]), set()) if n >= 0 else (set(), set('BEADGCF'[:-n]))


def abc_parse(text: str, first_ending: bool = True):
    """Bars of (beats, midi or None, duration) plus chord symbols per bar; written pitch (guitar sounds an octave lower)."""
    hdr = dict(re.findall(r'^([A-Z]):\s*(.*)$', text, re.M))
    unit = eval(hdr.get('L', '1/8')) * 4  # quarter = 1 beat
    sharps, flats = signature(hdr.get('K', 'C'))
    keep, lyric = [], False
    for l in text.split('\n'):  # drop headers, comments and lyric lines, with their backslash continuations
        if re.match(r'^[wW]:', l) or lyric:
            lyric = l.rstrip().endswith('\\')
            continue
        if not re.match(r'^[A-Za-z]:', l) and not l.startswith('%'):
            keep.append(l)
    body = '\n'.join(keep)
    body = re.sub(r'\{[^}]*\}', '', body)          # grace notes
    body = re.sub(r'![^!]*!|\+[^+]*\+', '', body)  # decorations
    bars, cur, chords, cur_ch, t = [], [], [], [], 0.0
    i, triplet, broken, tied = 0, 0, None, None
    skip = False
    while i < len(body):
        c = body[i]
        if c == '"':
            j = body.index('"', i + 1)
            sym = body[i + 1:j]
            if not sym.startswith(('^', '_', '<', '>', '@')):
                cur_ch.append((t, sym))
            i = j + 1
            continue
        if c in '|:[]':
            m = re.match(r'(\|\]|\|\||:\|\]?|\|:|::|\[\d|\|\d|\||:)', body[i:])
            tok = m.group(0) if m else c
            if re.match(r'(\[|\|)2', tok):
                skip = first_ending
            elif re.match(r'(\[|\|)1', tok):
                skip = False
            if '|' in tok and (cur or t):
                if not skip or tok.startswith(':'):
                    bars.append(cur); chords.append(cur_ch)
                cur, cur_ch, t = [], [], 0.0
                if tok.startswith(':|') and skip:
                    skip = False
            i += len(tok)
            continue
        if c == '(' and i + 1 < len(body) and body[i + 1].isdigit():
            triplet = int(body[i + 1]); i += 2; continue
        m = re.match(r"([_^=]*)([A-Ga-gz])([',]*)(\d*)(/*)(\d*)", body[i:])
        if m:
            acc, n, octs, num, slash, den = m.groups()
            d = float(num) if num else 1.0
            if slash:
                d /= float(den) if den else 2 ** len(slash)
            d *= unit
            if triplet:
                d *= 2 / 3; triplet -= 1
            if broken:
                d *= broken; broken = None
            nxt = body[i + len(m.group(0)):i + len(m.group(0)) + 1]
            if nxt in '><':
                broken = 0.5 if nxt == '>' else 1.5
                d *= 1.5 if nxt == '>' else 0.5
            if n == 'z':
                midi = None
            else:
                L = n.upper()
                midi = 60 + PC[L] + (12 if n.islower() else 0) + 12 * octs.count("'") - 12 * octs.count(',')
                if '^' in acc: midi += acc.count('^')
                elif '_' in acc: midi -= acc.count('_')
                elif '=' not in acc:
                    midi += 1 if L in sharps else -1 if L in flats else 0
            if not skip:
                if tied is not None and midi == tied:
                    cur.append((t, None, d))  # tied over: the note rings on
                else:
                    cur.append((t, midi, d))
            tied = None
            t += d
            i += len(m.group(0)) + (1 if nxt in '><' else 0)
            if i < len(body) and body[i] == '-':
                tied = midi
                i += 1
            continue
        if c == '-' and cur:  # a tie: lengthen the last note
            pass
        i += 1
    if cur:
        bars.append(cur); chords.append(cur_ch)
    return bars, chords


def join_short(bars, chords, full):
    """A part's short last bar and the next part's pickup make one full bar."""
    out_b, out_c, k = [], [], 0
    dur = lambda b: sum(d for _, _, d in b)
    while k < len(bars):
        b, c = bars[k], chords[k]
        if k > 0 and k + 1 < len(bars) and dur(b) < full - 1e-6 and abs(dur(b) + dur(bars[k + 1]) - full) < 1e-6:
            off = dur(b)
            b = b + [(t + off, m, d) for t, m, d in bars[k + 1]]
            c = c + [(t + off, sym) for t, sym in chords[k + 1]]
            k += 1
        out_b.append(b); out_c.append(c); k += 1
    return out_b, out_c


def place(midi: int, tuning: list, prev):
    """The string and fret for a written pitch (sounding an octave lower), near the last one, low on the neck."""
    op = {6 - k: 12 * (int(n[-1]) + 1) + PC[n[0]] + (1 if '#' in n else -1 if 'b' in n[1:-1] else 0) for k, n in enumerate(tuning)}
    sound = midi - 12
    cands = [(st, sound - op[st]) for st in op if 0 <= sound - op[st] <= 12]
    ps, pf = prev or (3, 2)
    return min(cands, key=lambda c: (c[1] > 5) * 6 + abs(c[1] - pf) * 0.8 + abs(c[0] - ps) * 0.5 + (c[1] > 0) * 0.3)


def abc_song(S: dict) -> str:
    bars, chords = join_short(*abc_parse(fetch_abc(S['abc'])), S['beats'])
    a, b = S.get('bars', (1, len(bars)))
    tuning = S.get('tuning', STANDARD)
    beats = S['beats']
    mel, bas, harm, prev, held = [], [], [], None, None
    for k in range(a - 1, b):
        toks, t = [], 0.0
        for (bt, midi, d) in bars[k]:
            if midi is None:
                toks.append(f'r:{d:g}')
            else:
                st, fr = place(midi + S.get('transpose', 0), tuning, prev)
                prev = (st, fr)
                toks.append(f'{st}.{fr}:{d:g}')
        mel.append(' '.join(toks))
        hs, btoks = [], []
        for (ct, sym) in chords[k]:
            held = sym
            hs.append((ct, sym))
        if S.get('bass'):
            pts = [(0.0, held if not hs or hs[0][0] > 0 else hs[0][1])] + [h for h in hs if h[0] > 0] if hs or held else []
            for j, (ct, sym) in enumerate(pts):
                end = pts[j + 1][0] if j + 1 < len(pts) else sum(d for _, _, d in bars[k])
                root = re.match(r'([A-G][#b]?)', sym)
                if not root or end - ct <= 0:
                    continue
                pc = PC[root.group(1)[0]] + (1 if '#' in root.group(1) else -1 if 'b' in root.group(1) else 0)
                low = min((m for m in range(40, 53) if m % 12 == pc % 12), default=None)
                st, fr = place(low + 12, tuning, (6, 1))
                btoks.append(f'{st}.{fr}:{end - ct:g}')
            bas.append(' '.join(btoks) if btoks else f'r:{sum(d for _, _, d in bars[k]):g}')
        names = S.get('chords', {})
        nbeats = int(round(sum(d for _, _, d in bars[k])))
        slots = []
        for beat in range(max(1, nbeats)):  # one slot a beat: the chord where it changes, '-' to hold
            here = [sym for ct, sym in hs if beat - 1e-6 <= ct < beat + 1 - 1e-6]
            slots.append(names.get(here[-1], here[-1]) if here else '-')
        harm.append(' '.join(slots) if any(x != '-' for x in slots) else '')
    if S.get('drone'):
        bas = [f"{S['drone']}:{sum(d for _, _, d in bars[k]):g}" for k in range(a - 1, b)]
    voices = [' | '.join(mel) + ' |'] + ([' | '.join(bas) + ' |'] if S.get('bass') or S.get('drone') else [])
    S2 = dict(S)
    S2['harmony'] = S.get('harmony') or harm
    return render(S2, voices, tuning)


SONGS = [
    # ---------- the short series: under a minute each, the whole excerpt on screen with the neck ----------
    # counterpoint and technique (unrestricted classtab tabs only)
    dict(id='cp10-bach-fuga-bwv1001', file='bach_js_bwv1001_violin_sonata_no1_in_gm_2_fuga.txt', bars=(1, 8), beats=4,
         comment='Counterpoint: Bach, Fuga from the Violin Sonata No. 1, BWV 1001, in Tárrega’s arrangement (A minor), bars 1–8.',
         title='Bach: Fuga BWV 1001', rule='Hold every voice for its full length: the counterpoint lives in the sustain.', genre='Counterpoint',
         lines=['The G minor violin fugue, in Tárrega’s guitar version in A minor:', 'the subject alone, then the voices entering one by one.'],
         key='A minor', root='A', bpm=72, harmony=['Am:i', '', '', '', '', '', '', ''],
         marks=[[1, 'The subject, alone: E four times, then stepping down.'], [2, 'The next voice enters with the answer: keep the first one sounding under it.'],
                [5, 'Three voices: let each finger hold its note while the others move.']],
         notes=['Tab: Rod Kahler (classtab.org), after Tárrega’s 1908 arrangement.'],
         got=['each voice sustains for its full length,', 'and you can hear every entry of the subject.']),
    dict(id='cp11-narvaez-emperador', file='narvaez_vol3_no4_cancion_del_emperador.txt', bars=(1, 12), beats=4,
         comment='Counterpoint: Narváez, Canción del Emperador (1538), his vihuela setting of Josquin’s Mille regretz, bars 1–12.',
         title='Narváez: Canción del Emperador', rule='Four voices from a Josquin chanson: each line moves on its own.', genre='Renaissance counterpoint',
         lines=['Narváez’s 1538 vihuela setting of Josquin’s “Mille regretz”,', 'the Emperor Charles V’s favourite song: four voices on one guitar.'],
         key='E Phrygian · 3rd string to F♯', root='E', bpm=80, harmony=[''] * 12,
         marks=[[1, 'Vihuela tuning: the 3rd string down to F♯, so the shapes are the lute’s.'], [3, 'The voices move independently: hold the long notes while the others pass.']],
         notes=['Tab: Cody Swanson (classtab.org). Tune the 3rd string down a half step.'],
         got=['the long notes ring through the moving ones,', 'and you can follow one voice through the whole phrase.']),
    dict(id='cp12-mudarra-fantasia', file='mudarra_tres_libros_l1_f13.txt', bars=(1, 12), beats=4,
         comment='Counterpoint: Mudarra, a fantasía from Tres libros (1546), book 1, bars 1–12.',
         title='Mudarra: Fantasía', rule='Imitation: one voice states a motif, the next one copies it.', genre='Renaissance counterpoint',
         lines=['A fantasía by Alonso Mudarra (1546), for vihuela:', 'a motif passed between voices and moved up a step.'],
         key='A · 3rd string to F♯', root='A', bpm=80, harmony=[''] * 12,
         marks=[[1, 'Vihuela tuning: the 3rd string down to F♯.'], [8, 'The opening idea again, a step higher: a sequence.']],
         notes=['Tab: classtab.org. Tune the 3rd string down a half step.'],
         got=['each entry of the motif is clear,', 'and the voices stay even with each other.']),
    dict(id='c14-carcassi-op60-no3', file='carcassi_op60_no03_study_in_a.txt', bars=(1, 8), beats=2, quantum=1 / 6, repeat=2,
         comment='Technique: Carcassi, Study Op. 60 No. 3 in A, bars 1–8.',
         title='Carcassi: Study Op. 60 No. 3', rule='Even triplets: the thumb on the bass, the fingers rolling through the chord.', genre='Classical technique',
         lines=['Carcassi’s A major study:', 'running triplet arpeggios through I – V7 – I and on to the dominant.'],
         key='A major', root='A', bpm=72, harmony=['A:I', 'E7:V7', 'E7:V7', 'A:I', 'A:I', 'A♯°7:vii°7/V', 'B7:V7/V', 'E:V'],
         marks=[[1, 'Even triplets: p on the bass, the fingers rolling upward.'], [6, 'A♯°7 – B7 – E: the music turns to the dominant.']],
         notes=['Tab: Kevin J. Manges (classtab.org).'],
         got=['the triplets stay even through every chord change,', 'and the bass rings under them.']),
    dict(id='c15-coste-op38-no22', file='coste_op38_no22_allegro_moderato_in_a.txt', bars=(1, 8), beats=4,
         comment='Technique: Coste, Study Op. 38 No. 22 (Allegro moderato) in A, bars 1–8.',
         title='Coste: Allegro moderato Op. 38', rule='The thumb holds the bass; the fingers keep the 16ths even.', genre='Classical technique',
         lines=['Napoléon Coste’s A major study:', 'a running 16th-note arpeggio over a held bass.'],
         key='A major', root='A', bpm=84, harmony=['A:I', 'A:I', 'A:I', 'E7:V7', 'A:I', 'E7:V7', '', 'E7:V7'],
         marks=[[3, 'The 16ths start: p a m i patterns over each chord.'], [4, 'E7: change the shape without a gap in the 16ths.']],
         notes=['Tab: classtab.org.'],
         got=['the 16ths never stumble at a chord change,', 'and the bass rings under them.']),
    dict(id='c16-coste-agitato', file='coste_op38_no07_agitato_in_am.txt', bars=(1, 16), beats=2,
         comment='Technique: Coste, Agitato Op. 38 No. 7 in A minor, bars 1–16.',
         title='Coste: Agitato Op. 38 No. 7', rule='Restless 16ths: speed with a relaxed hand.', genre='Classical technique',
         lines=['Coste’s A minor “Agitato”:', 'restless 16ths through i – V7, the iv and its own dominant.'],
         key='A minor', root='A', bpm=96,
         harmony=['Am:i', 'E7:V7', 'Am:i', 'E7:V7', 'A7:V7/iv', 'Dm:iv', 'E7:V7', 'F:VI', 'A7:V7/iv', 'Dm:iv', 'E7:V7', 'Am:i', 'E7:V7', 'Am:i', 'E7:V7', 'Am:i'],
         marks=[[1, 'i – V7 twice: the pattern settles in.'], [5, 'A7 – Dm: V7 of iv, the music darkening.'], [8, 'F, the ♭VI, then round again.']],
         notes=['Tab: Francisco Galera (classtab.org).'],
         got=['the 16ths stay even at 96,', 'and the left hand shifts without breaking the line.']),
    dict(id='tp5-pernambuco-carrilhoes', file='pernambuco_sounds_of_bells.txt', bars=(1, 17), beats=2, pickup=True, short=True,
         comment='Short series: Pernambuco, Sons de Carrilhões (João Pernambuco’s own guitar choro), the A section, drop D.',
         title='Pernambuco: Sons de Carrilhões', rule='A choro bass under bells: harmonics ring over it.', genre='Brazilian choro',
         lines=['“Sounds of the bells”, a choro-maxixe for guitar, drop D:', 'syncopated bass, melody and harmonics on top.'],
         key='D major · drop D', root='D', bpm=76,
         harmony=['', 'D:I', 'Em7:ii7', 'A7:V7', 'D:I', 'G/D:IV', 'Em/D:ii', 'A7:V7', 'D:I', 'D:I', 'Em7:ii7', 'A7:V7', 'D:I',
                  'D♯°7:vii°7/ii', 'Em:ii', 'A7:V7', 'D:I'],
         marks=[[1, 'I – ii7 – V7 – I, two bars each: the choro’s home loop.'], [6, 'The bass moves while the bells ring.'],
                [13, 'D♯°7: the diminished chord leading up to Em.']],
         notes=['Transcription: Paul R. Estrada (classtab.org).'],
         got=['you can keep the bass steady under the harmonics,', 'and the syncopations sit like a dance.']),
    dict(id='tp6-barrios-maxixe', file='barrios_maxixe.txt', bars=(1, 16), beats=2, short=True, repeat=2,
         comment='Short series: Barrios, Maxixe (his own guitar piece), the opening 16 bars.',
         title='Barrios: Maxixe', rule='Bass on the beat, chords on the &: the maxixe swing.', genre='Brazilian maxixe',
         lines=['Agustín Barrios’s maxixe, the Brazilian tango:', 'a bass on the beat, the chord answering off it.'],
         key='A major', root='A', bpm=96,
         harmony=['A:I', 'E7:V7', 'A:I', 'E7:V7', 'A:I', 'E7:V7', 'E7:V7', 'F♯7:V7/ii', 'Bm:ii', 'E:V', 'A:I', 'A:I',
                  'D♯°7:♯iv°7', 'E7:V7', 'A:I', 'A:I'],
         marks=[[1, 'I – V7, the bass on 1 and 2, the chord pinched on the &s.'], [8, 'F♯7 – Bm: V7 of ii, the classic choro detour.'],
                [13, 'D♯°7 between A and E7: the passing diminished.']],
         notes=['Tab: Luís Quinta (classtab.org).'],
         got=['you can play the 16 bars twice at 96 without the bass rushing,', 'and the off-beat chords stay light.']),
    dict(id='tp8-tarrega-velocidad', file='tarrega_estudio_de_velocidad.txt', bars=(1, 16), beats=2, short=True, repeat=2,
         comment='Short series: Tárrega, Estudio de Velocidad, bars 1–16.',
         title='Tárrega: Estudio de Velocidad', rule='Alternate i and m: speed comes from the slurs and the shifts.', genre='Classical speed',
         lines=['Tárrega’s velocity study:', 'scale runs with slurs and shifts, i–m alternating throughout.'],
         key='E major', root='E', bpm=92,
         harmony=['E:I', 'E:I', 'E:I', 'A:IV', '', 'A:IV', '', 'E:I', 'B7:V7', 'E:I', 'F♯°7:', 'F♯°7:', '', '', '', ''],
         marks=[[1, 'i m i m throughout: never the same finger twice.'], [9, 'B7, then the diminished: the run turns chromatic.']],
         notes=['Tab: Tarek Yazbek (classtab.org). Work up to speed: clean first, then 4 bpm a pass.'],
         got=['you can play the 16 bars twice at 92 with i and m strictly alternating,', 'then push the tempo up.']),
    dict(id='c3-bach-prelude-bwv999', file='bach_js_bwv0999_prelude_in_cm_for_lute.txt', bars=(1, 20), beats=3,
         comment='Repertoire C3: Bach, Prelude BWV 999 (for lute, in C minor; played on guitar in D minor), bars 1–20.',
         title='Bach: Prelude BWV 999', rule='One chord a bar, broken; the bass tells you where you are.',
         lines=['The opening of the lute prelude in D minor:', 'harmony as arpeggios, over a tonic pedal, then towards the dominant.'],
         key='D minor', root='D', now='Bars 1–20', sub='one chord a bar: the bass, then the chord above it',
         hear_notes=['Twelve 16ths a bar, the same pattern each time: only the chord changes.'],
         harmony=['Dm:i', 'Dm:i', 'Gm/D:iv', 'Gm/D:iv', 'C♯°7/D:vii°7', 'C♯°7/D:vii°7', 'Dm:i', 'Dm/C:i', 'B♭maj7:VImaj7', 'Dm/A:i',
                  'G♯°7:vii°7/V', 'G♯°7:vii°7/V', 'Am(add9):v', 'Am:v', 'Fmaj7:IIImaj7', 'Bm7♭5:viø7', 'E7:V7/V', 'E7:V7/V', 'E7♭13:V7/V', 'E7:V7/V'],
         marks=[[1, 'Bars 1–8: over the open D, i – iv – vii°7 – i: the tonic pedal, the harmony moving above a still bass.'],
                [5, 'Bars 5–6: C♯°7 over D, the leading-tone chord clashing with the pedal, resolving in bar 7.'],
                [8, 'Bars 8–10: the bass falls D C B♭ A: i, VI, i over its 5th.'],
                [11, 'Bars 11–14: G♯°7, the V of V’s leading-tone chord, tips the music to A minor (v).'],
                [16, 'Bars 16–20: Bm7♭5 (the raised 6th of melodic minor), then E7, the V of V: a long dominant of the dominant.']],
         notes=['Hold each chord shape for the whole bar and let it ring: the left hand moves once a bar.'],
         bpm=80, page_bpm=60, next=['Next: bars 21–43, the long dominant pedal on A with its diminished chords.'],
         got=['you can play the 20 bars at 80, the shapes held and ringing,', 'name each bar’s chord,', 'and hear the pedal under bars 1–8.']),
    dict(id='cp1-bach-invention-1', file='bach_js_bwv0772_two-part_invention_01.txt', bars=(1, 7), beats=4,
         comment='Repertoire CP1: Bach, Two-Part Invention No. 1 in C, BWV 772, bars 1–7 (to the cadence in G), solo guitar.',
         title='Bach: Invention No. 1', rule='One idea, imitated and turned upside down.',
         lines=['The opening of the first two-part invention:', 'a subject, its imitation, and its inversion moving against it.'],
         key='C major', root='C', now='Bars 1–7', sub='two voices: the subject passes between them',
         harmony=['C:I -', 'G7:V7 -', 'Am:vi Em:iii', 'C/E:I Am:vi', 'D7:V7/V G:V', 'Em:vi D7/F♯:V7', '@G_major G:I -'],
         marks=[[1, 'Bar 1: the subject, C D E F D E C, in one voice; half a bar later the other voice imitates it.'],
                [3, 'Bars 3–4: the subject upside down (inversion): one voice rises while the other falls, contrary motion by design.'],
                [5, 'Bars 5–6: D7, the V of V, turns the music towards G.'],
                [7, 'Bar 7: the cadence in G, the dominant: the first section ends.']],
         notes=['Bring out whichever voice has the subject; the other accompanies.'],
         bpm=66, page_bpm=50, next=['Next: bars 8–22, through A minor and home to C.'],
         got=['you can play bars 1–7 at 66 with both voices clear,', 'point to every entry of the subject and its inversion,', 'and hear the move to G.']),
    dict(id='cl3-bach-preludio-bwv1006a', file='bach_js_bwv1006a_lute_suite_no4_in_e_1_preludio.txt', bars=(1, 24), beats=3,
         comment='Repertoire CL3: Bach, Preludio from the Lute Suite BWV 1006a, in E, bars 1–24.',
         title='Bach: Preludio BWV 1006a', rule='Let the open strings ring: the pedal is the point.',
         lines=['The opening of the E major Preludio:', 'harmony over an open-E pedal, and campanella runs that ring like bells.'],
         key='E major', root='E', now='Bars 1–24', sub='16ths throughout: the open E under everything',
         harmony=['E:I', 'E:I', 'E:I', 'E:I', 'B7/E:V7', 'E:I', 'B7/E:V7', 'E:I', 'F♯m7/E:ii7', 'E:I', 'A/E:IV', 'A/E:IV', 'B7/E:V7', 'A/E:IV',
                  '', '', '', '', '', '', 'E7/D:V7/IV', 'A/C♯:IV', 'B7:V7', 'E/B:I'],
         marks=[[1, 'Bars 1–4: the opening flourish, all on the E chord.'],
                [5, 'Bars 5–14: the open E never stops (a pedal): V7, ii7 and IV come and go above it.'],
                [15, 'Bars 15–20: campanella: neighbouring notes on different strings, ringing over each other like bells.'],
                [21, 'Bars 21–24: the bass moves at last: E7/D – A/C♯ – B7 – E: V7 of IV, IV, V7, I.']],
         notes=['Hold fingers down as long as you can, so every note rings into the next.'],
         bpm=96, page_bpm=72, next=['Next: bars 25–60, the long sequences over the bass.'],
         got=['you can play bars 1–24 at 96 with the open E ringing,', 'let the campanella notes overlap,', 'and name the chord over the pedal in each bar.']),
    dict(id='cl5-coste-prelude-dm', file='coste_op38_no03_prelude_in_dm.txt', bars=(1, 12), beats=4,
         comment='Repertoire CL5: Coste, Prélude in D minor Op. 38 No. 3 (drop D), bars 1–12.',
         title='Coste: Prélude in D minor', rule='Six-chords falling by step: parallel, not contrary.',
         lines=['Napoléon Coste’s D minor prelude, drop D:', 'chords over an open-string pedal, then a chain of 6th chords falling by step.'],
         key='D minor · drop D', root='D', now='Bars 1–12', sub='16ths: bass, then the chord above it',
         harmony=['A7:V7', 'Dm:i', 'A7:V7', 'Dm:i', 'B♭/D:VI⁶ A/C♯:V⁶', 'G/B:IV⁶ F/A:III⁶', 'E°/G:ii°⁶ Dm/F:i⁶', 'C♯°/E:vii°⁶ B♭/D:VI⁶',
                  'A/C♯:V⁶ G/B:IV⁶', 'Dm/A:i⁶₄ A7:V7', 'Dm:i', 'Dm:i'],
         marks=[[1, 'Bars 1–4: V7 – i twice, the open A and D strings ringing under the chords.'],
                [5, 'Bars 5–9: first-inversion chords falling a step every two beats: B♭/D, A/C♯, G/B, F/A, E°/G … (fauxbourdon).'],
                [6, 'G/B: the raised 6th (B♮) of melodic minor, used on the way down.'],
                [10, 'Bars 10–12: i⁶₄ – V7 – i, the cadence.']],
         notes=['Parallel motion: the outer voices move in 6ths together, the opposite of contrary motion.'],
         bpm=72, page_bpm=54, got=['you can play the 12 bars at 72 with the bass ringing,', 'name every chord in the falling chain,', 'and hear the parallel 6ths.']),
    dict(id='c13-romance', file='anon_romance_de_amor.txt', bars=(4, 19), beats=3, quantum=1 / 3,
         comment='Repertoire C13: Romance (anonymous, 19th century, public domain), the E minor section, 16 bars.',
         title='Romance', rule='p the bass, a the melody, i m the triplets.',
         lines=['The anonymous Romance (the “Spanish Romance”):', 'a melody over a triplet arpeggio, in E minor.'],
         key='E minor', root='E', now='The E minor section', sub='3/4 · a triplet on every beat',
         harmony=['Em:i', 'Em:i', 'Em:i', 'Em:i', 'Em:i', 'Em:i', 'Em:i', 'Am:iv', 'Am:iv', 'B7♭9:V7♭9', 'B7/D♯:V7', 'Em:i', 'Em:i', 'B7:V7', 'B7:V7', 'Em:i'],
         marks=[[1, 'Bars 1–7: Em: the melody on string 1 (a) over the triplet (i m) and a bass on beat 1 (p).'],
                [8, 'Bars 8–9: Am, iv: the melody climbs to C.'],
                [10, 'Bars 10–11: B7, the dominant: its D♯ is the leading tone, and C adds the ♭9.'],
                [12, 'Bars 12–16: Em, then B7 and Em again: i – iv – V7 – i is the whole harmony.']],
         notes=['Keep the melody louder than the triplets: rest stroke with a if you can.'],
         bpm=60, page_bpm=48, next=['Next: the E major section: the same tune, the mode flipped.'],
         got=['you can play the 16 bars at 60 with the melody singing over the triplets,', 'keep the triplets even,', 'and name i – iv – V7 – i as you play.']),
    dict(id='c8-tarrega-lagrima', file='tarrega_lagrima.txt', bars=(1, 16), beats=3, quantum=0.5,
         comment='Repertoire C8: Tárrega, Lágrima (public domain), both halves: E major, then E minor.',
         title='Tárrega: Lágrima', rule='The same melody, the mode flipped.',
         lines=['Tárrega’s “Teardrop”:', 'eight bars in E major, then the same shape in E minor.'],
         key='E major', root='E', now='Lágrima', sub='E major, then E minor',
         harmony=['E:I', 'B7/D♯:V7', 'E:I', 'B7/D♯:V7', 'A/C♯:IV', 'E/B:I⁶₄', 'B7:V7', 'E:I',
                  '@E_minor Em:i', 'Am/E:iv', 'Em:i', 'B7:V7', 'Em:i', 'Am:iv', 'B7:V7', 'Em:i'],
         marks=[[1, 'Bars 1–4: I – V7 – I – V7: the melody sings on the 2nd string over a ringing bass.'],
                [5, 'Bars 5–8: IV – I⁶₄ – V7 – I: the cadence.'],
                [9, 'Bar 9: E minor, the parallel minor: same tonic, three notes lowered (G, C, D). The tear.'],
                [12, 'Bar 12: B7 serves both keys: the dominant of E major and of E minor.']],
         notes=['Parallel major and minor share a tonic and a dominant: only the colour changes.'],
         bpm=66, page_bpm=50, got=['you can play both halves at 66 with the melody on top,', 'hear the switch from major to minor,', 'and name the chords in each half.']),
    dict(id='c5-sor-op35-no22', file='sor_op35_no22_allegretto_in_bm.txt', bars=(1, 16), beats=6, quantum=0.5,
         comment='Repertoire C5: Sor, Study in B minor Op. 35 No. 22 (public domain), bars 1–16; the beat is the 8th note (6/8).',
         title='Sor: Study in B minor', rule='The melody in the fingers, the dominant in the thumb.',
         lines=['Sor’s B minor study (Op. 35 No. 22):', 'a melody in 3rds and 6ths over a dominant pedal.'],
         key='B minor · 6/8', root='B', now='Bars 1–16', sub='6/8: a melody over the F♯ in the bass',
         harmony=['Bm:i', 'D/F♯:III⁶', 'F♯7:V7', 'Bm/F♯:i⁶₄', 'F♯:V', 'Bm/F♯:i⁶₄', 'Em/G:iv⁶', 'F♯:V',
                  'Bm:i', 'D/F♯:III⁶', 'F♯7:V7', 'G:VI', 'E♯°7:vii°7/V', 'Bm/F♯:i⁶₄', 'F♯:V', 'Bm:i'],
         marks=[[1, 'Bars 1–8: the F♯ in the bass under almost every chord: a dominant pedal, holding the tension.'],
                [4, 'Bm over F♯ then F♯: the cadential six-four, the strongest way to arrive on V.'],
                [12, 'Bar 12: G, the VI: a turn away before the cadence.'],
                [13, 'Bar 13: E♯°7, the leading-tone chord of F♯, pushes to the dominant.']],
         notes=['6/8: feel two beats a bar; each beat is three 8ths.'],
         bpm=150, page_bpm=110, got=['you can play the 16 bars at tempo, the pedal steady,', 'name the cadential six-four when it comes,', 'and feel the bar in two.']),
    dict(id='c9-tarrega-adelita', file='tarrega_adelita.txt', bars=(1, 16), beats=3,
         comment='Repertoire C9: Tárrega, Adelita (mazurka, public domain), bars 1–16: E minor, then E major.',
         title='Tárrega: Adelita', rule='A mazurka: lean on beat 2.',
         lines=['Tárrega’s mazurka Adelita:', 'eight bars in E minor, then the turn to the parallel major.'],
         key='E minor · 3/4', root='E', now='Bars 1–16', sub='E minor, then E major',
         harmony=['Em:i', 'F♯ø7/A:iiø7', 'B7:V7', 'Em:i', 'Em:i', 'F♯ø7/A:iiø7', 'B7:V7', 'Em:i',
                  '@E_major E:I', 'E:I', 'E:I', 'B7:V7', 'E:I', 'E:I', 'B7:V7', 'E:I'],
         marks=[[1, 'Bars 1–4: i – iiø7 – V7 – i, the minor cadence, with the mazurka’s accent on beat 2.'],
                [3, 'Bar 3: B7 with C and G above it: the ♭9 and ♭13, the dark colours of a minor-key dominant.'],
                [9, 'Bar 9: E major, the parallel major: same tonic, the third raised.'],
                [12, 'Bar 12: B7 again, now leading home to E major.']],
         notes=['Mazurka: three beats, but the weight falls on the second.'],
         bpm=66, page_bpm=50, got=['you can play the 16 bars at 66 with the mazurka lilt,', 'hear the switch from minor to major,', 'and name i – iiø7 – V7 – i.']),
    dict(id='r1-joplin-entertainer', file='joplin_the_entertainer.txt', bars=(1, 16), beats=2,
         comment='Repertoire R1: Joplin, The Entertainer (1902, public domain), the intro and the first 12 bars of the theme, drop D.',
         title='Joplin: The Entertainer', rule='Ragtime: a steady bass, a syncopated tune.',
         lines=['Scott Joplin’s rag, on guitar in C, drop D:', 'the intro and the opening theme, its chromatic pickups and passing chords.'],
         key='C major · drop D · 2/4', root='C', now='The intro and the theme', sub='2/4: bass on the beat, the tune off it',
         harmony=['', '', '', 'G7:V7', 'C7/E:I7', 'F:IV F♯°7:vii°7/V', 'C/G:I⁶₄ G7:V7', 'C:I', 'C7/E:I7', 'F:IV', 'D7:V7/V', 'D7:V7/V G:V',
                  'C7/E:I7', 'F:IV F♯°7:vii°7/V', 'C/G:I⁶₄ G7:V7', 'C:I'],
         marks=[[1, 'Bars 1–4: the intro, a run falling in octaves, landing on G7.'],
                [5, 'Bar 5: the theme: the chromatic pickup D – D♯ – E, and B♭ makes C into C7.'],
                [6, 'Bars 6–7: F – F♯°7 walks the bass up to G; C/G – G7, the cadential six-four, then V7 – I.'],
                [11, 'Bars 11–12: D7 – G, the V of V: the turn every rag uses.']],
         notes=['Not fast: Joplin wrote “it is never right to play ragtime fast”.'],
         bpm=80, page_bpm=60, got=['you can play the 16 bars at 80 with the bass steady,', 'land the syncopations cleanly,', 'and name the passing chords.']),
    dict(id='c4-dowland-lachrimae', file='dowland_john_lachrimae_pavan.txt', bars=(1, 8), beats=4,
         comment='Repertoire C4: Dowland, Lachrimae Pavan (lute, public domain), the opening strain, bars 1–8, here in E minor.',
         title='Dowland: Lachrimae', rule='The falling tear: four notes, step by step, down.',
         lines=['Dowland’s Lachrimae (“tears”), the opening strain:', 'the falling-tear motif and a Renaissance cadence with a major third.'],
         key='E minor', root='E', now='The first strain', sub='a slow pavan: two beats to a step',
         harmony=['Em:i', 'B:V', 'Em:i', 'Am:iv B:V', 'Em:i B/D♯:V⁶', 'C:VI G:III', 'Am:iv B:V', 'E:I'],
         marks=[[1, 'Bar 1: the “falling tear”: the melody steps down a 4th, the most imitated motif of its age.'],
                [4, 'Bar 4: iv – V: the cadence approached from the subdominant.'],
                [6, 'Bar 6: C and G, VI and III: the relative major opening out before the fall back.'],
                [8, 'Bar 8: E major, not minor: the Picardy third, a bright chord ending a minor phrase.']],
         notes=['Renaissance lute style: let the voices overlap; every note rings to its full length.'],
         bpm=60, page_bpm=46, got=['you can play the strain at 60 with the voices ringing,', 'point to the falling tear,', 'and hear the Picardy third at the end.']),
    dict(id='r6-soldiers-joy', abc='natunelist.net/soldiers-joy/index.html/0001', beats=4, pickup=True,
         comment="Repertoire R6: Soldier's Joy (traditional fiddle tune), flatpicked, both parts, from the ABC at natunelist.net.",
         title="Soldier's Joy", rule='Alternate picking: down on the beat, up off it.',
         lines=['The bluegrass and old-time fiddle tune, flatpicked:', 'the melody alone, in first position in D.'],
         key='D major', root='D', now='Both parts', sub='flatpick: down strokes on the beat, up strokes between',
         chords={'D': 'D:I', 'A': 'A:V', 'G': 'G:IV'},
         marks=[[1, 'Bars 1–4: the A part spells D (A F♯ D F♯): keep the pick moving down-up even through the long notes.'],
                [4, 'Bar 4: A, the V, then back to D: the whole tune is I and V.'],
                [9, 'Bars 9–16: the B part climbs to F♯ and E, the top of first position.'],
                [15, 'Bars 15–16: f a g f, e g f e, d: the closing run, a scale falling home.']],
         notes=['Fiddle tunes are played twice through each part (AABB): repeat each part before moving on.'],
         bpm=100, page_bpm=76, got=['you can flatpick both parts at 100 with strict alternate picking,', 'play each part twice through without stopping,', 'and hear I and V under the tune.']),
    dict(id='l2-cielito-lindo', abc='trillian.mit.edu/~jc/music/abc/Mexico/song/Cielito_Lindo-C-32-/0000', beats=3, bass=True,
         comment='Repertoire L2: Cielito Lindo (Quirino Mendoza y Cortés, 1882, public domain), verse and refrain, from the ABC by John Chambers.',
         title='Cielito Lindo', rule='The ranchera waltz: bass on 1, the tune singing over it.',
         lines=['The Mexican waltz-song, melody and bass:', 'I – V7 in 3/4, then the refrain on I and IV.'],
         key='C major · 3/4', root='C', now='Verse and refrain', sub='3/4: the bass on beat 1 of every bar',
         chords={'C': 'C:I', 'G7': 'G7:V7', 'G': 'G:V', 'Dm': 'Dm:ii', 'F': 'F:IV'},
         marks=[[1, 'Bars 1–4: C – G7, I – V7: the whole verse swings between home and the dominant.'],
                [7, 'Bars 7–8: Dm, ii, the step before the dominant.'],
                [17, 'The refrain: long notes on I and IV, “ay, ay, ay, ay”.']],
         notes=['Strum the chord on beats 2 and 3 when you accompany a singer: the bass on 1 stays.'],
         bpm=132, page_bpm=100, got=['you can play verse and refrain at 132 with the bass on 1,', 'hear I – V7 under the verse,', 'and add the oom-pah-pah strum.']),
    dict(id='fb1-she-moved-through-the-fair', abc='thesession.org/tunes/4735.no-ext/0001', beats=3, pickup=True, tuning=DADGAD, drone='6.0',
         comment='Repertoire FB1: She Moved Through the Fair (traditional), in DADGAD over a D drone, after Davy Graham; from the ABC at thesession.org.',
         title='She Moved Through the Fair', rule='The melody over the drone: let every open string ring.',
         lines=['The Irish air in DADGAD, as Davy Graham played it:', 'a modal melody over a ringing open D.'],
         key='D Mixolydian · DADGAD', root='D', now='The air', sub='3/4, slow and free: the drone on every bar',
         harmony=[],
         marks=[[1, 'Bar 1: D Mixolydian: a major scale with a ♭7 (C♮), the sound of the old modes.'],
                [4, 'The C♮ is the ♭7: it is what makes the tune sound ancient rather than major.'],
                [8, 'Grace notes and slides: ornament the long notes as a singer would.']],
         notes=['Sing it in your head: the rhythm is the words’ rhythm, not strict 3/4.'],
         bpm=72, page_bpm=56, got=['you can play the air over the drone with every string ringing,', 'ornament the long notes,', 'and hear the ♭7 colour of Mixolydian.']),
    dict(id='fb6-scarborough-fair', abc='pghardy.net/tunebooks/pgh_songs_tunebook/0031', beats=3, bass=True, tuning=DADGAD,
         comment="Repertoire FB6: Scarborough Fair (traditional), in DADGAD, from Paul Hardy's Songs Tunebook (CC BY-NC-SA) ABC.",
         title='Scarborough Fair', rule='The Dorian 6th: B♮ in D minor is the colour.',
         lines=['The English ballad in D Dorian, in DADGAD:', 'the melody over a bass from its chords.'],
         key='D Dorian · DADGAD', root='D', now='The tune', sub='3/4: Dm – C – G – F, all from D Dorian',
         chords={'Dm': 'Dm:i', 'C': 'C:♭VII', 'G': 'G:IV', 'F': 'F:♭III'},
         marks=[[1, 'Bars 1–4: Dm and C, i – ♭VII: the modal cadence, no leading tone.'],
                [7, 'G major, IV in D Dorian: its B♮ is the raised 6th, the Dorian colour (in D minor it would be B♭).'],
                [16, 'The last phrase falls C – D: ♭VII – i, the Dorian close.']],
         notes=['Dorian is natural minor with a major 6th: the B♮ makes it sound bittersweet rather than sad.'],
         bpm=96, page_bpm=72, got=['you can play the tune in DADGAD with the bass under it,', 'point to the B♮ that makes it Dorian,', 'and hear ♭VII – i at the cadence.']),
    dict(id='cp3-bach-invention-8', file='bach_js_bwv0779_two-part_invention_08.txt', bars=(1, 12), beats=3,
         comment='Repertoire CP3: Bach, Two-Part Invention No. 8 in F, BWV 779, bars 1–12 (to the cadence in C), solo guitar.',
         title='Bach: Invention No. 8', rule='A canon: the second voice repeats the first, a bar later.',
         lines=['The eighth two-part invention, in F:', 'a broken-chord subject in canon at the octave, then a turn to C.'],
         key='F major · 3/4', root='F', now='Bars 1–12', sub='the lower voice copies the upper one bar later',
         harmony=['F:I', 'C7:V7', 'F:I', 'F:I', '', '', 'G7/D:V7/V', '', '', '', '', '@C_major C:I'],
         marks=[[1, 'Bar 1: the subject climbs the F chord (F A C F), then runs down the scale in 16ths.'],
                [2, 'Bar 2: the lower voice enters with the same subject an octave down: a canon at the octave.'],
                [5, 'Bars 5–6: a sequence: the same figure stepped down, over a moving bass.'],
                [7, 'Bar 7: G7, the V of V, starts the turn towards C.'],
                [12, 'Bar 12: the cadence in C, the dominant: the first section ends.']],
         notes=['Practise each voice’s entry until you can hear the canon: one voice always echoes the other.'],
         bpm=72, page_bpm=54, next=['Next: bars 13–34, the same canon in C, then home through D minor.'],
         got=['you can play the 12 bars at 72 with both voices clear,', 'hear the second voice copying the first,', 'and land the cadence in C.']),
    dict(id='cp8-scarlatti-k11', file='scarlatti_d_k011.txt', bars=(1, 12), beats=3,
         comment='Repertoire CP8: D. Scarlatti, Sonata K. 11 (keyboard; Segovia’s guitar version in E minor), bars 1–12.',
         title='Scarlatti: Sonata K. 11', rule='Keyboard writing: the motif passes from hand to hand.',
         lines=['A keyboard sonata on guitar, in E minor:', 'two-part writing, harmonic minor colour, and a turn to the minor dominant.'],
         key='E minor · 3/4', root='E', now='Bars 1–12', sub='treble and bass trade the motif',
         harmony=['Em:i', 'B7:V7', 'Em:i', 'B7:V7', 'G+:III+', 'G+:III+', 'Am/G:iv', 'Am/G:iv', 'F♯7:V7/v', '@B_minor Bm:i', 'Bm/D:i', 'Bm:i'],
         marks=[[1, 'Bars 1–4: i – V7 – i – V7: the motif in the treble, answered in the bass.'],
                [5, 'Bars 5–6: G with D♯: III+, the augmented chord of harmonic minor (D♯ is the leading tone).'],
                [9, 'Bar 9: F♯7, the V of B minor: the music turns to the minor dominant.'],
                [10, 'Bars 10–12: B minor, v: the first half heads away from home, as sonatas do.']],
         notes=['Scarlatti wrote for harpsichord: keep it crisp, the notes short and even.'],
         bpm=84, page_bpm=60, got=['you can play the 12 bars at 84, crisp and even,', 'follow the motif between treble and bass,', 'and hear the move to B minor.']),
    dict(id='cp9-narvaez-guardame-las-vacas', file='narvaez_vol6_no2_guardame_las_vacas.txt', bars=(1, 16), beats=3,
         comment='Repertoire CP9: Narváez, Diferencias sobre Guárdame las vacas (1538, vihuela; guitar version), theme and first variations.',
         title='Narváez: Guárdame las vacas', rule='The bass never changes; the counterpoint does.',
         lines=['Variations on the Romanesca ground (1538):', 'one four-bar bass pattern, new counterpoint over it each time.'],
         key='A minor · 3/4', root='A', now='Theme and variations', sub='the ground: III – ♭VII – i – V',
         harmony=['C:III', 'G:VII', 'Am:i', 'E:V', 'C:III', 'G:VII', 'Am:i E:V -', 'A:i', 'C:III', 'G:VII', 'Am:i', 'E:V',
                  'C:III', 'G:VII', 'Am:i E:V -', 'A:i'],
         marks=[[1, 'Bars 1–4: the Romanesca ground: C – G – Am – E, III – VII – i – V, a bass that repeats under everything.'],
                [7, 'Bars 7–8: the cadence closes on A: the first statement ends.'],
                [9, 'Bars 9–16: the same ground, a new upper line: that is what a diferencia (variation) is.']],
         notes=['Hear the bass first: once it is in your ear, every variation sits on it.'],
         bpm=84, page_bpm=60, got=['you can play the theme and variations over the ground at 84,', 'sing the ground’s bass from memory,', 'and invent one more variation over it.']),
    dict(id='c12-granados-andaluza', file='granados_danzas_espanolas_h142_05_andaluza.txt', bars=(1, 12), beats=2,
         comment='Repertoire C12: Granados, Spanish Dance No. 5, Andaluza (public domain; guitar version), the opening, bars 1–12.',
         title='Granados: Andaluza', rule='The melody over a ringing E: Spain in a few notes.',
         lines=['Granados’s Spanish Dance No. 5:', 'a melody over an E pedal, its chromatic sigh, then III – VII – VI.'],
         key='E minor · 2/4', root='E', now='The opening', sub='2/4: the open E under the tune',
         harmony=['Em:i', 'Em:i', 'Em:i', 'Em:i', 'Em:i', 'Em:i', 'Em:i', 'G:III', 'D:VII', 'C:VI', 'Em:i', 'Em:i'],
         marks=[[1, 'Bars 1–7: the open E rings while the tune circles B, its chromatic neighbour A♯, and G.'],
                [8, 'Bars 8–10: G – D – C, III – VII – VI: falling through the relative major towards the Spanish cadence.'],
                [11, 'Bars 11–12: home on E.']],
         notes=['Let the bass E ring under everything: it is a pedal, the drone of the dance.'],
         bpm=80, page_bpm=60, got=['you can play the opening at 80 with the E ringing,', 'shape the chromatic sigh B – A♯ – B,', 'and name III – VII – VI.']),
    dict(id='c11-albeniz-asturias', file='albeniz_isaac_op047_no5_espanola_asturias.txt', bars=(1, 12), beats=3,
         comment='Repertoire C11: Albéniz, Asturias (Leyenda), the opening, bars 1–12 (guitar version, public domain).',
         title='Albéniz: Asturias', rule='The open B never stops: the melody moves around it.',
         lines=['The opening of Asturias:', 'a melody woven round an open-B pedal, the Phrygian sound of Spain.'],
         key='B Phrygian · E minor', root='B', now='The opening', sub='16ths: melody note, then the open B, again and again',
         harmony=['Em/B:iv', 'Em/B:iv', 'Em/B:iv', 'D/F♯:♭III', 'Em/B:iv', 'Em/B:iv', 'Em/B:iv', 'C:♭II', 'B:I', 'B:I', 'B:I', 'B:I'],
         marks=[[1, 'Bars 1–3: every other note is the open B: a pedal, imitating the guitar’s own flamenco drone.'],
                [8, 'Bar 8: C, the ♭II: the half step above B is the Phrygian, Spanish colour.'],
                [9, 'Bars 9–12: B major, the home of B Phrygian (and the V of E minor), the C still leaning on it.']],
         notes=['Alternate p and i (or i and m) for the pedal; keep the melody notes slightly louder.'],
         bpm=120, page_bpm=84, next=['Next: the bariolage climax, then the copla in the middle section.'],
         got=['you can play the 12 bars at 120 with the pedal even,', 'bring the melody out over the B,', 'and hear the ♭2 (C) pull down to B.']),
    dict(id='fb4-byrd-earl-of-salisbury', file='byrd_pavane_the_earl_of_salisbury.txt', bars=(1, 8), beats=4, quantum=0.5,
         comment='Repertoire FB4: Byrd, Pavan: The Earle of Salisbury (keyboard, 1612; guitar version), the first strain.',
         title='Byrd: The Earl of Salisbury', rule='A slow pavan: let the voices sustain.',
         lines=['William Byrd’s pavan, as John Renbourn loved it:', 'Renaissance harmony and a major chord inside a minor key.'],
         key='A minor', root='A', now='The first strain', sub='a stately pavan: two steps forward, one back',
         harmony=['Am:i', 'E:V', '', 'A:I', 'Am:i', 'G7:VII7', 'F:VI', 'E:V'],
         marks=[[1, 'Bars 1–4: i – V, then A major in bar 4: a major chord in a minor phrase, the Renaissance “tierce de Picardie”.'],
                [5, 'Bars 5–8: i – VII – VI – V: the bass falls A G F E, the lament line.'],
                [8, 'Bar 8: E, V: a half cadence; the next strain answers it.']],
         notes=['Renbourn played it on steel strings: let every note ring its full length.'],
         bpm=60, page_bpm=46, got=['you can play the strain at 60 with the voices sustained,', 'hear the bass fall A – G – F – E,', 'and the major chord inside the minor key.']),
    dict(id='fb7-johnson-alman', file='johnson_robert_2_alman_fvb_145.txt', bars=(1, 12), beats=4, quantum=0.5, pickup=True,
         comment='Repertoire FB7: Robert Johnson (lutenist, c.1583–1633), Alman (Fitzwilliam Virginal Book 145; guitar version), bars 1–12.',
         title='Robert Johnson: Alman', rule='A Renaissance dance in two: steady, stately, the voices clear.',
         lines=['An alman (allemande) by the lutenist Robert Johnson:', 'a dance in A minor, as the folk-baroque players arranged it.'],
         key='A minor', root='A', now='Bars 1–12', sub='a stately dance in 2',
         harmony=['', 'Am:i', 'C:III', 'Am:i', 'E:V', '', 'Dm:iv', 'E:V', 'Am:i', 'G:VII', 'C:III', 'Am:i'],
         marks=[[1, 'Bars 1–3: i – III – i: A minor and its relative major, side by side.'],
                [4, 'Bar 4: E, the V, with G♯: the leading tone of A minor.'],
                [6, 'Bars 6–7: Dm – E, iv – V: the cadence of the first strain.'],
                [9, 'Bars 9–11: i – VII – III: the second strain starts by falling through the natural minor.']],
         notes=['John Renbourn’s repertoire: Renaissance lute music on the steel-string guitar.'],
         bpm=72, page_bpm=56, got=['you can play the 12 bars at 72 with the voices clear,', 'name i – III – V in the first strain,', 'and feel the dance in 2.']),
]


if __name__ == '__main__':
    for S in SONGS:
        (HERE / 'videos' / f"{S['id']}.yaml").write_text(abc_song(S) if S.get('abc') else song(S))
        print(S['id'])
