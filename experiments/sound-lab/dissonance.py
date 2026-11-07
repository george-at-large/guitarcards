"""Sethares/Plomp-Levelt sensory dissonance and scale-from-timbre derivation."""
import numpy as np

def pair_diss(f1, f2, a1, a2):
    fmin = np.minimum(f1, f2)
    s = 0.24 / (0.0207 * fmin + 18.96)
    d = np.abs(f2 - f1)
    return np.minimum(a1, a2) * (np.exp(-3.51 * s * d) - np.exp(-5.75 * s * d))

def curve(f0, ratios, amps, rmin=1.0, rmax=2.5, steps=3000):
    ratios = np.asarray(ratios); amps = np.asarray(amps)
    rs = np.linspace(rmin, rmax, steps)
    F1 = f0 * ratios
    D = []
    for r in rs:
        F = np.concatenate([F1, F1 * r]); A = np.concatenate([amps, amps])
        i, j = np.triu_indices(len(F), 1)
        D.append(pair_diss(F[i], F[j], A[i], A[j]).sum())
    return rs, np.array(D)

def minima(rs, D, prominence=0.02):
    out = []
    span = D.max() - D.min()
    w = 40
    for k in range(1, len(D) - 1):
        if D[k] <= D[k-1] and D[k] <= D[k+1]:
            lo = max(0, k - w); hi = min(len(D), k + w)
            if D[lo:hi].max() - D[k] > prominence * span:
                out.append(rs[k])
    return out

def stretched(A, n):
    k = np.arange(1, n + 1)
    return A ** np.log2(k)
