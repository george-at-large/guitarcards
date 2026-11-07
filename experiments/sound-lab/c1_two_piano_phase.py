"""C1 - Two-piano phasing (gradual process, after Steve Reich's phase technique).

An original 12-note cell (not Reich's) is played by two identical pianos.
Piano 1 never changes tempo. Piano 2 alternates between
  HOLD  - locked to piano 1 at the current offset, and
  DRIFT - playing very slightly faster, so it gains exactly one sixteenth over
          DRIFT_CYCLES repetitions of the cell.
After 12 drifts it has lapped piano 1 and the two are back in unison.
The 'music' is the series of composite patterns that appear at each offset
and the blurry, flamming textures in between."""
import numpy as np

import synth as S

rng = np.random.default_rng(1)
# original cell: A aeolian / pentatonic colour, two registers, built so that
# different offsets produce distinct resultant melodies (no internal repetition)
CELL = [57, 64, 62, 69, 60, 67, 64, 71, 62, 67, 72, 64]   # A3 E4 D4 A4 C4 G4 E4 B4 D4 G4 C5 E4
NOTE = 60 / 138 / 2                 # eighth-notes at 138 bpm quarter -> 0.217 s
CYCLE = NOTE * len(CELL)
INTRO_CYCLES = 4
HOLD_CYCLES = 3
DRIFT_CYCLES = 3
OUTRO_CYCLES = 4

cache = {}


def note(m, vel, piano):
    """Each piano has its own renders; piano 2 sits 2 cents sharp, like two real instruments."""
    key = (m, piano)
    if key not in cache:
        cache[key] = S.piano_note(S.midi_hz(m + 0.02 * piano), 2.2, 0.8, rng=rng)
    return cache[key] * vel


# ---------- schedule piano 2: list of (start, end, rate) segments
segs = [(INTRO_CYCLES * CYCLE, 1.0)]
for _ in range(12):
    segs.append((DRIFT_CYCLES * CYCLE, 1 + 1 / (DRIFT_CYCLES * len(CELL))))
    segs.append((HOLD_CYCLES * CYCLE, 1.0))
segs.append((OUTRO_CYCLES * CYCLE, 1.0))
total = sum(d for d, _ in segs)


# piano 2's position (in notes) is piecewise linear in time; invert it exactly
# so each HOLD is locked to the sample and each DRIFT gains exactly one note.
knots_t, knots_p = [0.0], [0.0]
for d, r in segs:
    knots_t.append(knots_t[-1] + d)
    knots_p.append(knots_p[-1] + d * r / NOTE)
n2 = int(np.floor(knots_p[-1] - 1e-9)) + 1
onsets2 = np.interp(np.arange(n2), knots_p, knots_t)


mix = S.silence(total + 3)
accent = [1.0, .7, .8, .7, .9, .7, .8, .7, .9, .7, .8, .7]

# piano 1: rigid clock, left
t, k = 0.0, 0
while t < total:
    v = accent[k % 12] * rng.uniform(.93, 1.0)
    S.place(mix, S.pan(note(CELL[k % 12], v, 0), -0.55), t + rng.normal(0, 0.002))
    t += NOTE
    k += 1

# piano 2: same cell, onsets from the exact phase map, right
for k, t in enumerate(onsets2):
    v = accent[k % 12] * rng.uniform(.93, 1.0)
    S.place(mix, S.pan(note(CELL[k % 12], v, 1), 0.55), t + rng.normal(0, 0.002))
n1 = int(np.ceil(total / NOTE - 1e-9))
print(f"piano 1 played {n1} notes, piano 2 played {n2}; difference {n2 - n1} (12 = one full lap)")

mix = S.reverb(mix, seconds=2.2, wet=0.18)
print(f"duration {total:.0f}s, cycle {CYCLE:.2f}s")
S.save("C1_two_piano_phase", mix, title="C1 Two-piano phase")
