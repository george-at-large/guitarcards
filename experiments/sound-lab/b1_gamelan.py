"""B1 - Gamelan-inspired interlocking (an approximation, not a recreation).

Ingredients borrowed as *principles*:
  * a pelog-like 5-note subset of an unequal 7-tone tuning;
  * colotomic structure: a 16-beat gong cycle punctuated by gong, kempul, kenong
    and kethuk-like strokes at fixed positions;
  * a slow skeletal melody (balungan-like) on metallophones;
  * two-part interlocking elaboration (kotekan-like): neither part makes sense
    alone, together they form one fast line that anticipates the next skeletal note;
  * paired instruments tuned a few Hz apart so each unison shimmers (ombak) at
    a roughly constant beat rate across registers;
  * tempo surges then settles, ending on the gong."""
import numpy as np

import synth as S

rng = np.random.default_rng(3)
# pelog-like tuning (cents above the tonic); one plausible set - real gamelans differ
PELOG = [0, 120, 270, 540, 670, 785, 950]
MODE = [0, 1, 2, 4, 5]                        # 5-tone subset (pelog bem-ish: 1 2 3 5 6)
TONIC = 277.0
OMBAK_HZ = 6.0                                # beat rate between paired instruments
BAR_RATIOS = [1.0, 2.76, 5.40, 8.93]          # free metal bar partials


def pitch(deg, octave=0):
    o, d = divmod(deg, len(MODE))
    return TONIC * 2 ** (octave + o + PELOG[MODE[d]] / 1200)


def bar(f, dur, amp, pair_offset=0.0, bright=1.0, decay=1.6):
    """Metallophone stroke; pair_offset Hz shifts the whole spectrum (ombak partner)."""
    amps = np.array([1, .35 * bright, .12 * bright, .05 * bright])
    decs = decay * np.array([1, .35, .18, .1]) * (440 / f) ** 0.3
    return amp * S.partials_tone(f + pair_offset, BAR_RATIOS, amps, decs, dur, .002, rng=rng)


def gong(f, dur, amp):
    t = S.t_axis(dur)
    out = np.zeros(len(t))
    for r, a, d in ((1, 1, 6), (1.007, .8, 6), (2.0, .3, 3), (2.43, .2, 2), (3.1, .1, 1.5)):
        out += a * np.exp(-t / d) * np.sin(2 * np.pi * f * r * t)
    out *= 1 + 0.25 * np.sin(2 * np.pi * 0.7 * t)        # slow swell of the gong
    out[:S.secs(.03)] *= np.linspace(0, 1, S.secs(.03))
    return amp * out


# balungan: 16 beats per gong cycle, two cycles, degrees in MODE (None = rest/hold)
balungan = [2, 1, 2, 3, 2, 1, 0, 1,  3, 4, 3, 2, 1, 0, 1, 0,
            0, 1, 3, 2, 3, 4, 5, 4,  3, 2, 1, 2, 3, 1, 1, 0]
seq = balungan + balungan[:16]
n_beats = len(seq)

# tempo curve (beats per second): settle in, surge, slow to final gong
bps = np.interp(np.arange(n_beats), [0, 8, 24, 36, 44, n_beats - 1], [1.0, 1.1, 1.75, 1.75, 1.2, 0.7])
beat_t = np.concatenate([[0], np.cumsum(1 / bps[:-1])]) + 0.4
total = beat_t[-1] + 8

mix = S.silence(total)


def put(sound, t, p):
    S.place(mix, S.pan(sound, p), t)


for b, deg in enumerate(seq):
    t = beat_t[b]
    pos = b % 16
    # skeletal melody on two saron-like pairs (low octave), one tuned OMBAK_HZ sharp
    put(bar(pitch(deg), 2.5, .5), t, -0.25)
    put(bar(pitch(deg), 2.5, .45, OMBAK_HZ), t, 0.25)
    # colotomic punctuation
    if pos == 15:
        put(gong(pitch(0, -2), 9, 1.0), t, 0)
    elif pos in (7,):
        put(gong(pitch(3, -2), 5, .45), t, -0.1)       # kempul-like
    if pos % 4 == 3:
        put(bar(pitch(deg, -1), 3, .5, decay=3.0, bright=.4), t, 0.1)   # kenong-like
    if pos % 2 == 0:
        put(bar(pitch(4, -1), .5, .25, decay=.25, bright=.3), t + 0.5 / bps[b], 0)  # kethuk-like offbeat

    # interlocking elaboration toward the NEXT skeletal note (4 subdivisions per beat)
    nxt = seq[(b + 1) % n_beats]
    target = nxt + len(MODE)                         # upper octave
    figure = [target + 1, target, target - 1, target] if b % 2 else [target - 1, target + 1, target, target]
    sub = 1 / bps[b] / 4
    for k, d in enumerate(figure):
        f = pitch(d)
        part_pan, off = (-0.6, 0.0) if k % 2 == 0 else (0.6, OMBAK_HZ)   # polos / sangsih
        # near the end of each fast passage both parts sometimes double a note (shared tone)
        put(bar(f, .9, .28 * rng.uniform(.8, 1), off, bright=.8, decay=.5), t + k * sub, part_pan)
        if k == 3 and b % 4 == 3:
            put(bar(f, .9, .2, OMBAK_HZ - off, bright=.8, decay=.5), t + k * sub, -part_pan)

mix = S.reverb(mix, seconds=2.8, wet=0.22)
print(f"beats={n_beats}, duration={total:.1f}s, tempo range {bps.min()*60:.0f}-{bps.max()*60:.0f} bpm")
S.save("B1_gamelan_inspired", mix, title="B1 Gamelan-inspired interlocking")
