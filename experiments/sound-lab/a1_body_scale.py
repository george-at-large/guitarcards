"""A1 - Body-derived scale, A/B.

The same music twice: first played on an ordinary harmonic timbre, then on the
stretched 'body' timbre whose dissonance curve produced the scale."""
import numpy as np

import dissonance as dz
import synth as S

rng = np.random.default_rng(11)
A = 2.2                        # pseudo-octave of the alien body (an octave is 2.0)
NP = 7
amps = 0.85 ** np.arange(NP)
body = dz.stretched(A, NP)                 # partial ratios of the alien body
harm = np.arange(1, NP + 1, dtype=float)   # ordinary harmonic series

# --- derive the scale from the body's own dissonance curve
rs, D = dz.curve(262, body, amps, 1.0, A * 1.02, 4000)
mins = dz.minima(rs, D, 0.015)
keep = [1.192, 1.289, 1.466, 1.586, 1.788, 1.89]
steps = [1.0] + [min(mins, key=lambda m: abs(m - k)) for k in keep]
print("dissonance minima:", [round(m, 3) for m in mins])
print("scale (ratios):  ", [round(s, 3) for s in steps], " pseudo-octave", A)


def pitch(deg, f0):
    o, d = divmod(deg, len(steps))
    return f0 * A ** o * steps[d]


# --- composition: (start beat, degree(s), length beats, velocity)
BEAT = 0.5
melody = [
    (0, [0], 2, .8), (2, [2], 1, .6), (3, [3], 1, .6), (4, [4], 2, .75), (6, [3], 1, .5), (7, [5], 1, .6),
    (8, [4, 7], 3, .8), (11, [2], 1, .5),
    (12, [3], 1, .6), (13, [4], 1, .6), (14, [6], 2, .75), (16, [7], 1, .7), (17, [6], 1, .5), (18, [4], 2, .6),
    (20, [3, 6], 3, .8), (23, [2], 1, .5),
    (24, [5], 1, .6), (25, [4], 1, .55), (26, [3], 1, .55), (27, [2], 1, .55), (28, [0, 4], 4, .85),
    (32, [7], 1, .6), (33, [9], 1, .6), (34, [8], 2, .7), (36, [6], 1, .55), (37, [5], 1, .55),
    (38, [0, 3, 7], 4, .9),
]
DRONE_EVERY = 8


def render(ratios, total):
    mix = S.silence(total)
    decays = 2.4 / (1 + 0.6 * np.arange(NP))
    f_mel = 233.0
    for beat, degs, length, vel in melody:
        for k, d in enumerate(degs):
            f = pitch(d, f_mel)
            tone = S.partials_tone(f, ratios, amps, decays * (1 + 0.3 * length), 4.5,
                                   attack=0.003, rng=rng)
            S.place(mix, S.pan(tone * vel * 0.5, -0.3 + 0.3 * k + 0.1 * (d % 3)), beat * BEAT)
    for b in range(0, 40, DRONE_EVERY):        # low pseudo-octave drone strokes
        tone = S.partials_tone(f_mel / A, ratios, amps, decays * 3.5, 9, attack=0.02, rng=rng)
        S.place(mix, S.pan(tone * 0.35, 0.0), b * BEAT)
    return mix


half = 42 * BEAT + 1.5
mix = np.vstack([render(harm, half), S.silence(1.2), render(body, half)])
mix = S.reverb(mix, seconds=3.0, wet=0.3)


# --- quantify: mean sensory dissonance of the dyads/chords under each timbre
def chord_diss(ratios, degs):
    F, Aa = [], []
    for d in degs:
        F += list(pitch(d, 233.0) * ratios); Aa += list(amps)
    F, Aa = np.array(F), np.array(Aa)
    i, j = np.triu_indices(len(F), 1)
    return dz.pair_diss(F[i], F[j], Aa[i], Aa[j]).sum()


chords = [d for _, d, _, _ in melody if len(d) > 1]
for name, r in (("harmonic", harm), ("body", body)):
    print(f"mean chord dissonance, {name:8s}: {np.mean([chord_diss(r, c) for c in chords]):.3f}")

S.save("A1_body_scale", mix, title="A1 Body-derived scale (A/B)")
