"""A4 - Coupled-oscillator rhythm.

Twelve percussion 'agents', each with its own preferred tempo, listen to each
other through Kuramoto coupling. Coupling strength K(t) ramps from zero, so the
rhythm self-organises: free-running chaos -> a shared pulse. Then the
first-harmonic coupling turns repulsive while a second-harmonic term
(sin 2dtheta) stays attractive: the only stable state is two clusters in
anti-phase, each on the other's off-beat - a hocket nobody wrote. Finally all
coupling is withdrawn and the agents drift apart again."""
import numpy as np

import dissonance as dz
import synth as S

rng = np.random.default_rng(4)
N = 12
DUR = 45.0
dt = 0.001
nat_hz = np.sort(rng.uniform(1.75, 2.45, N))      # 105..147 bpm natural tempos
omega = 2 * np.pi * nat_hz
theta = rng.uniform(0, 2 * np.pi, N)


T_KNOTS = [0, 6, 15, 21, 26, 39, 45]  # chaos | sync | hold | split | hocket | dissolve


def K_of(t):  # first-harmonic coupling ramp
    return float(np.interp(t, T_KNOTS, [0, 0, 6.5, 6.5, -8.0, -8.0, 0]))


def K2_of(t):  # second-harmonic (anti-phase-friendly) coupling
    # hocket needs K1 + 2*K2 < 0 (unison unstable) and 2*K2 - K1 > 0 (anti-phase stable)
    return float(np.interp(t, T_KNOTS, [0, 0, 1.5, 1.5, 3.0, 3.0, 0]))


hits = [[] for _ in range(N)]
log = []
steps = int(DUR / dt)
for s in range(steps):
    t = s * dt
    d = theta[None, :] - theta[:, None]          # theta_j - theta_i
    dtheta = omega + (K_of(t) * np.sin(d).mean(axis=1)
                      + K2_of(t) * np.sin(2 * d).mean(axis=1))
    new = theta + dtheta * dt
    crossed = np.floor(new / (2 * np.pi)) > np.floor(theta / (2 * np.pi))
    for i in np.where(crossed)[0]:
        hits[i].append(t)
    theta = new
    if s % 1000 == 0:
        z = np.exp(1j * theta)
        log.append((t, abs(z.mean()), abs((z ** 2).mean()), dtheta.mean() / (2 * np.pi)))

for t, r1, r2, f in log[::5]:
    print(f"t={t:4.0f}s  sync r1={r1:.2f}  two-cluster r2={r2:.2f}  mean tempo={f*60:5.1f} bpm")

# --- 12 voices: pitched ones take their pitches from the A1 alien scale
A = 2.2
scale = [1.0, 1.192, 1.289, 1.466, 1.586, 1.788, 1.89]
body = dz.stretched(A, 6)


def voice(i):
    kind = i % 4
    f = 110 * A ** (i // 7) * scale[(i * 3) % 7]
    if kind == 0:   # membrane: falling pitch
        n = S.secs(0.6); t = np.arange(n) / S.SR
        fr = f * (1 + 0.6 * np.exp(-t / 0.02))
        return np.sin(2 * np.pi * np.cumsum(fr) / S.SR) * S.env_perc(n, 0.001, 0.12)
    if kind == 1:   # wooden bar, short and inharmonic
        return S.partials_tone(f * 2, [1, 2.76, 5.4], [1, .4, .15], [.08, .04, .02], .5, .001, rng=rng)
    if kind == 2:   # tuned metal using the alien body partials
        return S.partials_tone(f * 2, body, 0.8 ** np.arange(6), 0.5 / (1 + np.arange(6)), 1.2, .001, rng=rng) * .6
    return S.noise_burst(0.15, decay=0.03, bright=0.9, rng=rng) * 0.5   # shaker


mix = S.silence(DUR + 2)
for i in range(N):
    v = voice(i)
    p = -0.9 + 1.8 * i / (N - 1)
    for t in hits[i]:
        tail = float(np.interp(t, [0, DUR - 5, DUR], [1, 1, 0.15]))   # fade the dissolve
        S.place(mix, S.pan(v * rng.uniform(.6, 1.0) * tail, p), t)
mix = S.reverb(mix, seconds=1.6, wet=0.2)
import os
os.makedirs(S.SPEC, exist_ok=True)
S.raster_png(hits, DUR, os.path.join(S.SPEC, "A4_raster.png"), marks=T_KNOTS[1:-1])
S.save("A4_coupled_rhythm", mix, title="A4 Coupled-oscillator rhythm")
