"""Shared synthesis toolkit for the sound lab.

Pure numpy (no scipy). Everything is float64 stereo arrays of shape (n, 2)
at SR samples per second. Each clip script builds a mix with these helpers
and calls `save()`, which writes WAV -> loudness-normalised MP3 + spectrogram.
"""
import os
import subprocess
import wave

import numpy as np

SR = 44100
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "audio")
SPEC = os.path.join(HERE, "spectrograms")


# ---------------------------------------------------------------- basics
def secs(n):
    return int(round(n * SR))


def silence(dur):
    return np.zeros((secs(dur), 2))


def t_axis(dur):
    return np.arange(secs(dur)) / SR


def pan(mono, p):
    """Equal-power pan, p in [-1 (left), +1 (right)]."""
    a = (p + 1) * np.pi / 4
    return np.stack([mono * np.cos(a), mono * np.sin(a)], axis=1)


def place(mix, sound, at):
    """Add `sound` (mono or stereo) into `mix` starting at time `at` seconds."""
    if sound.ndim == 1:
        sound = pan(sound, 0.0)
    i = max(0, secs(at))
    if i >= len(mix):
        return
    j = min(len(mix), i + len(sound))
    mix[i:j] += sound[: j - i]


def midi_hz(m):
    return 440.0 * 2 ** ((m - 69) / 12)


# ---------------------------------------------------------------- envelopes
def env_perc(n, attack=0.003, decay=1.0):
    """Fast linear attack, exponential decay (decay = time constant in s)."""
    t = np.arange(n) / SR
    e = np.exp(-t / decay)
    na = max(1, secs(attack))
    e[:na] *= np.linspace(0, 1, na)
    return e


def env_adsr(n, a=0.05, d=0.1, s=0.7, r=0.3):
    t = np.arange(n) / SR
    dur = n / SR
    e = np.full(n, s)
    e[t < a] = t[t < a] / a
    m = (t >= a) & (t < a + d)
    e[m] = 1 - (1 - s) * (t[m] - a) / d
    rel = t > dur - r
    e[rel] *= np.clip((dur - t[rel]) / r, 0, 1)
    return e


def fade(x, fin=0.01, fout=0.05):
    x = x.copy()
    a, b = secs(fin), secs(fout)
    if a:
        x[:a] *= np.linspace(0, 1, a)[:, None] if x.ndim == 2 else np.linspace(0, 1, a)
    if b:
        x[-b:] *= np.linspace(1, 0, b)[:, None] if x.ndim == 2 else np.linspace(1, 0, b)
    return x


# ---------------------------------------------------------------- generators
def partials_tone(f0, ratios, amps, decays, dur, attack=0.004, detune_cents=0.0, rng=None):
    """Additive tone: sine partials at f0*ratio, each with its own exponential decay.

    detune_cents > 0 doubles every partial with a slightly sharp copy (chorus /
    multiple-string beating)."""
    n = secs(dur)
    t = np.arange(n) / SR
    out = np.zeros(n)
    rng = rng or np.random.default_rng()
    for r, a, d in zip(ratios, amps, decays):
        f = f0 * r
        if f >= SR / 2 * 0.9:
            continue
        ph = rng.uniform(0, 2 * np.pi)
        e = np.exp(-t / d)
        out += a * e * np.sin(2 * np.pi * f * t + ph)
        if detune_cents:
            f2 = f * 2 ** (detune_cents / 1200)
            out += a * e * np.sin(2 * np.pi * f2 * t + ph + 1.0)
    na = max(1, secs(attack))
    out[:na] *= np.linspace(0, 1, na)
    return out


def noise_burst(dur, decay=0.01, bright=0.5, rng=None):
    """Short noise click; `bright` 0..1 mixes white with a crude one-pole lowpass."""
    rng = rng or np.random.default_rng()
    n = secs(dur)
    w = rng.standard_normal(n)
    lp = onepole(w, 0.05 + 0.9 * bright)
    return lp * env_perc(n, 0.0005, decay)


def fftconv(x, h):
    L = len(x) + len(h) - 1
    nfft = 1 << (L - 1).bit_length()
    return np.fft.irfft(np.fft.rfft(x, nfft) * np.fft.rfft(h, nfft), nfft)[:L]


def onepole(x, a):
    """One-pole lowpass y[n] = a*x[n] + (1-a)*y[n-1], applied as an FFT
    convolution with its impulse response truncated at -120 dB."""
    b = 1 - a
    k = int(min(SR, np.ceil(np.log(1e-6) / np.log(max(b, 1e-9))))) + 1 if b > 0 else 1
    h = a * b ** np.arange(k)
    return fftconv(x, h)[: len(x)]


def piano_note(f0, dur, vel=0.8, rng=None):
    """Simple modelled piano: stiff-string inharmonic partials, two detuned
    strings per note, high partials decaying faster, felt-hammer thump."""
    rng = rng or np.random.default_rng()
    B = 0.00035 * (f0 / 261.6) ** 0.5
    nmax = int(min(24, (SR * 0.42) / f0))
    n = np.arange(1, nmax + 1)
    ratios = n * np.sqrt(1 + B * n ** 2)
    hammer = np.abs(np.sinc(n * 0.12))  # strike point ~1/8 of the string
    amps = hammer / n ** (1.25 - 0.4 * vel)
    base_decay = 2.6 * (261.6 / f0) ** 0.45
    decays = base_decay / (1 + 0.35 * (n - 1))
    tone = partials_tone(f0, ratios, amps, decays, dur, attack=0.002,
                         detune_cents=1.6, rng=rng)
    tone += 0.15 * noise_burst(dur, decay=0.012, bright=0.25, rng=rng)
    return tone * vel


# ---------------------------------------------------------------- effects
def reverb(x, seconds=2.4, wet=0.25, predelay=0.015, bright=0.6, seed=7):
    """Convolution reverb with a synthetic stereo IR (decaying, darkening noise)."""
    rng = np.random.default_rng(seed)
    n = secs(seconds)
    t = np.arange(n) / SR
    ir = np.zeros((n, 2))
    for ch in range(2):
        w = rng.standard_normal(n)
        dark = onepole(w, 0.15)
        mixc = np.exp(-t / (seconds * 0.25 * bright + 0.05))  # brightness fades
        ir[:, ch] = (w * mixc + dark * (1 - mixc)) * np.exp(-6.9 * t / seconds)
    pd = secs(predelay)
    ir = np.vstack([np.zeros((pd, 2)), ir])
    ir /= np.sqrt((ir ** 2).sum(axis=0))
    L = len(x) + len(ir) - 1
    nfft = 1 << (L - 1).bit_length()
    out = np.zeros((L, 2))
    for ch in range(2):
        X = np.fft.rfft(x[:, ch], nfft)
        H = np.fft.rfft(ir[:, ch], nfft)
        out[:, ch] = np.fft.irfft(X * H, nfft)[:L]
    dry = np.vstack([x, np.zeros((L - len(x), 2))])
    return dry * (1 - wet * 0.5) + out * wet


# ---------------------------------------------------------------- output
def save(name, mix, tail_trim=True, title=None):
    """Normalise, write WAV, encode MP3 at -16 LUFS, draw a spectrogram."""
    os.makedirs(OUT, exist_ok=True)
    os.makedirs(SPEC, exist_ok=True)
    mix = mix - mix.mean(axis=0)
    if tail_trim:
        thr = 10 ** (-70 / 20) * np.abs(mix).max()
        loud = np.where(np.abs(mix).max(axis=1) > thr)[0]
        if len(loud):
            mix = mix[: loud[-1] + 1]
    mix = fade(mix, 0.005, 0.5)
    peak = np.abs(mix).max()
    mix = mix / peak * 10 ** (-1.0 / 20)
    wav = os.path.join(OUT, name + ".wav")
    pcm = (mix * 32767).astype("<i2")
    with wave.open(wav, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())
    mp3 = os.path.join(OUT, name + ".mp3")
    subprocess.run(
        ["ffmpeg", "-y", "-loglevel", "error", "-i", wav,
         "-af", "loudnorm=I=-16:TP=-1.5:LRA=11", "-ar", str(SR),
         "-codec:a", "libmp3lame", "-b:a", "160k",
         "-metadata", f"title={title or name}", "-metadata", "artist=Sound Lab",
         mp3],
        check=True)
    png = os.path.join(SPEC, name + ".png")
    subprocess.run(
        ["ffmpeg", "-y", "-loglevel", "error", "-i", wav, "-lavfi",
         "showspectrumpic=s=1400x500:mode=combined:scale=log:fscale=log:legend=1",
         png],
        check=True)
    os.remove(wav)
    print(f"{name}: {len(mix)/SR:.1f}s  peak-normalised, -> {mp3}")
    return mp3


def save_png(rgb, path):
    """Write an (h, w, 3) uint8 array as a PNG using only zlib (no imaging libs)."""
    import struct
    import zlib
    h, w, _ = rgb.shape
    raw = b"".join(b"\x00" + rgb[y].tobytes() for y in range(h))

    def chunk(tag, data):
        return struct.pack(">I", len(data)) + tag + data + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF)

    png = (b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", struct.pack(">IIBBBBB", w, h, 8, 2, 0, 0, 0))
           + chunk(b"IDAT", zlib.compress(raw, 9)) + chunk(b"IEND", b""))
    with open(path, "wb") as f:
        f.write(png)


def raster_png(events, dur, path, width=1400, row_h=26, marks=()):
    """Hit raster: one row per voice, one tick per onset; `marks` = section times."""
    n = len(events)
    pad = 10
    h = n * row_h + 2 * pad
    img = np.zeros((h, width, 3), np.uint8)
    img[:] = (14, 16, 24)
    for t in marks:
        x = int(t / dur * (width - 1))
        img[:, x] = (60, 66, 96)
    for r, times in enumerate(events):
        y0 = pad + r * row_h + 4
        y1 = y0 + row_h - 8
        img[y0 + (row_h - 8) // 2, :] = (32, 36, 52)
        hue = r / max(1, n - 1)
        col = (int(255 * (0.55 + 0.45 * hue)), int(170 + 60 * (1 - hue)), int(255 * (1 - 0.5 * hue)))
        for t in times:
            x = int(t / dur * (width - 1))
            img[y0:y1, max(0, x - 1):x + 1] = col
    save_png(img, path)
