// Earium's sound: a handful of instruments, each able to hold a note for as long as it's wanted, all playing into one
// large, soft hall (a convolution reverb built from shaped noise, so nothing is downloaded). Notes are voices that
// are switched on and off by MIDI number: a chord change only moves the notes that move, so common tones ring on
// and a morph is heard as one voice stepping, never as the whole chord restarting.
import * as A from '../audio.js';

const hz = (m) => 440 * Math.pow(2, (m - 69) / 12);
const rnd = (a, b) => a + Math.random() * (b - a);

export const INSTRUMENTS = [
  { id: 'guitar', name: 'Mystic guitar', blurb: 'A nylon string plucked, then sustained like an e-bow, with a shimmer in the hall.' },
  { id: 'chimes', name: 'Glass chimes', blurb: 'Struck glass that keeps ringing and is touched again now and then, like wind chimes.' },
  { id: 'clear', name: 'Clear tones', blurb: 'Nearly pure tones: the most transparent sound for hearing every interval.' },
  { id: 'pad', name: 'Warm pad', blurb: 'A soft analogue pad, slowly breathing.' },
  { id: 'choir', name: 'Choir', blurb: 'Airy voices singing “ah”, drifting towards “oo”.' },
  { id: 'keys', name: 'Electric piano', blurb: 'A mellow tine piano, its tremolo slowly panning.' },
];

// ---------- the room ----------
let G = null;
function impulse(c, secs, { bright = 0.55, early = true } = {}) {
  const sr = c.sampleRate, len = Math.floor(sr * secs);
  const buf = c.createBuffer(2, len, sr);
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    let lp = 0;
    for (let i = 0; i < len; i++) {
      const t = i / sr;
      // the tail darkens as it decays: a one-pole low-pass that closes over time
      const k = Math.max(0.04, bright * Math.exp(-t / (secs * 0.35)));
      lp += k * ((Math.random() * 2 - 1) - lp);
      const env = Math.pow(1 - i / len, 2.2) * Math.exp(-t * (3.2 / secs));
      d[i] = lp * env * (t < 0.012 ? t / 0.012 : 1);
    }
    if (early) for (let r = 0; r < 14; r++) { // early reflections, different each side
      const at = Math.floor(sr * rnd(0.008, 0.075)), g = rnd(0.15, 0.5) * (ch ? 0.9 : 1);
      if (at < len) d[at] += (Math.random() < 0.5 ? -1 : 1) * g;
    }
  }
  // normalise
  let peak = 0;
  for (let ch = 0; ch < 2; ch++) { const d = buf.getChannelData(ch); for (let i = 0; i < len; i++) peak = Math.max(peak, Math.abs(d[i])); }
  for (let ch = 0; ch < 2; ch++) { const d = buf.getChannelData(ch); for (let i = 0; i < len; i++) d[i] *= 0.6 / peak; }
  return buf;
}
function noiseBuffer(c) {
  const b = c.createBuffer(1, c.sampleRate * 2, c.sampleRate), d = b.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  return b;
}
export function graph() {
  if (G) return G;
  const c = A.audioCtx();
  const out = c.createGain(); out.gain.value = 0.85;
  const comp = c.createDynamicsCompressor();
  comp.threshold.value = -20; comp.knee.value = 14; comp.ratio.value = 2.5; comp.attack.value = 0.03; comp.release.value = 0.5;
  const tame = c.createBiquadFilter(); tame.type = 'highshelf'; tame.frequency.value = 6500; tame.gain.value = -3;
  const lowcut = c.createBiquadFilter(); lowcut.type = 'highpass'; lowcut.frequency.value = 38;
  out.connect(lowcut).connect(tame).connect(comp).connect(c.destination);
  const dry = c.createGain(); dry.gain.value = 0.55; dry.connect(out);
  const rev = c.createConvolver(); rev.buffer = impulse(c, 7);
  const pre = c.createDelay(0.2); pre.delayTime.value = 0.035;
  const wet = c.createGain(); wet.gain.value = 0.9;
  const send = c.createGain(); send.gain.value = 1;
  send.connect(pre).connect(rev).connect(wet).connect(out);
  // a slow stereo chorus on the dry path widens everything a little
  G = { c, out, dry, send, wet, noise: noiseBuffer(c), waves: {} };
  return G;
}
export function setSpace(v) { const g = graph(); g.wet.gain.setTargetAtTime(0.35 + v * 1.1, g.c.currentTime, 0.3); g.dry.gain.setTargetAtTime(0.75 - v * 0.35, g.c.currentTime, 0.3); }
export function setVolume(v) { const g = graph(); g.out.gain.setTargetAtTime(v, g.c.currentTime, 0.1); }

// a periodic wave from harmonic amplitudes, cached
function wave(name, amps) {
  const g = graph();
  if (!g.waves[name]) {
    const real = new Float32Array(amps.length + 1), imag = new Float32Array(amps.length + 1);
    amps.forEach((a, i) => { imag[i + 1] = a; });
    g.waves[name] = g.c.createPeriodicWave(real, imag, { disableNormalization: false });
  }
  return g.waves[name];
}
const SAW = Array.from({ length: 28 }, (_, i) => 1 / (i + 1));
const WARM = Array.from({ length: 14 }, (_, i) => 1 / Math.pow(i + 1, 1.5) * (i % 2 ? 0.8 : 1));
const BOW = [1, 0.55, 0.36, 0.22, 0.17, 0.1, 0.08, 0.05, 0.035, 0.02, 0.012];
const CLEAR = [1, 0.1, 0.035, 0.012];
const GLASS = [1, 0.18, 0.05, 0.02];

// ---------- the plucked string (Karplus–Strong, warm, long) ----------
const ksCache = new Map();
function ksBuffer(midi) {
  if (ksCache.has(midi)) return ksCache.get(midi);
  const c = graph().c, sr = c.sampleRate, f = hz(midi);
  const t60 = Math.max(2.4, 9 - (midi - 40) * 0.13);
  const len = Math.floor(sr * Math.min(7, t60));
  const buf = c.createBuffer(1, len, sr), y = buf.getChannelData(0);
  const D = sr / f - 0.5, Di = Math.floor(D), fr = D - Di;
  const rho = Math.pow(10, -3 / (sr * t60));
  const N = Math.ceil(D), exc = new Float32Array(N + 1);
  let lp = 0;
  const bright = Math.min(0.55, 0.32 + (76 - midi) * 0.004); // a nylon string, plucked with the flesh
  for (let i = 0; i < N; i++) { lp += bright * ((Math.random() * 2 - 1) - lp); exc[i] = lp; }
  const P = Math.max(1, Math.round(N * 0.16));
  for (let i = N - 1; i >= P; i--) exc[i] -= exc[i - P] * 0.85;
  const at = (n) => (n >= 0 ? y[n] : 0);
  for (let n = 0; n < len; n++) {
    const a1 = (1 - fr) * at(n - Di) + fr * at(n - Di - 1);
    const a2 = (1 - fr) * at(n - Di - 1) + fr * at(n - Di - 2);
    y[n] = (n < N ? exc[n] : 0) + rho * (0.47 * a1 + 0.53 * a2);
  }
  let peak = 0; for (let n = 0; n < Math.min(len, N * 6); n++) peak = Math.max(peak, Math.abs(y[n]));
  const k = peak ? 0.9 / peak : 1, fade = Math.floor(sr * 0.3);
  for (let n = 0; n < len; n++) y[n] *= k * (n > len - fade ? (len - n) / fade : 1);
  ksCache.set(midi, buf);
  return buf;
}

// ---------- one note ----------
// every voice: { gain (its level), stop(t, release), strike?(t) }
function chain(g, { pan = 0, dry = 1, wet = 0.8 }) {
  const c = g.c;
  const level = c.createGain(); level.gain.value = 0;
  const p = c.createStereoPanner ? c.createStereoPanner() : null;
  if (p) { p.pan.value = pan; level.connect(p); }
  const src = p || level;
  const d = c.createGain(); d.gain.value = dry; src.connect(d).connect(g.dry);
  const w = c.createGain(); w.gain.value = wet; src.connect(w).connect(g.send);
  return level;
}
function osc(c, type, f, t, dest, { det = 0, gain = 1, w = null } = {}) {
  const o = c.createOscillator();
  if (w) o.setPeriodicWave(w); else o.type = type;
  o.frequency.value = f; o.detune.value = det;
  const a = c.createGain(); a.gain.value = gain;
  o.connect(a).connect(dest); o.start(t);
  return o;
}
function vibrato(c, t, targets, { rate = 4.8, cents = 4, delay = 1.2 } = {}) {
  const l = c.createOscillator(); l.frequency.value = rate * rnd(0.9, 1.1);
  const d = c.createGain(); d.gain.setValueAtTime(0, t); d.gain.linearRampToValueAtTime(cents, t + delay + 1.5);
  l.connect(d); targets.forEach((o) => d.connect(o.detune)); l.start(t);
  return l;
}
// the shimmer: the note an octave and two up, very quiet, only in the hall
function shimmer(g, f, t, amt, nodes) {
  if (!amt) return;
  const c = g.c, s = c.createGain(); s.gain.setValueAtTime(0, t); s.gain.setTargetAtTime(amt, t + 0.8, 2.5);
  s.connect(g.send);
  nodes.push(osc(c, 'sine', f * 2, t, s, { gain: 0.7 }), osc(c, 'sine', f * 4, t, s, { gain: 0.25 }));
  nodes.gainNodes.push(s);
}

const MAKERS = {
  // a nylon pluck that blooms into a bowed, e-bow-like sustain
  guitar(g, m, t, vel, pan) {
    const c = g.c, f = hz(m), nodes = []; nodes.gainNodes = [];
    const lvl = chain(g, { pan, dry: 0.9, wet: 0.85 });
    const pl = c.createBufferSource(); pl.buffer = ksBuffer(m);
    const body = c.createBiquadFilter(); body.type = 'peaking'; body.frequency.value = 180; body.Q.value = 0.8; body.gain.value = 3;
    const pg = c.createGain(); pg.gain.value = 0.55;
    pl.connect(body).connect(pg).connect(lvl); pl.start(t); nodes.push(pl);
    const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = Math.min(4200, 900 + f * 3.2); lp.Q.value = 0.3;
    const sg = c.createGain(); sg.gain.setValueAtTime(0, t); sg.gain.setTargetAtTime(0.32, t + 0.35, 1.6);
    lp.connect(sg).connect(lvl);
    const o = osc(c, null, f, t, lp, { w: wave('bow', BOW), det: rnd(-2, 2) });
    const o2 = osc(c, null, f, t, lp, { w: wave('bow', BOW), det: rnd(5, 8), gain: 0.5 });
    nodes.push(o, o2, vibrato(c, t, [o, o2], { cents: 5, delay: 1.5 }));
    // the bowed tone breathes a little
    const br = c.createOscillator(); br.frequency.value = rnd(0.07, 0.14); const bd = c.createGain(); bd.gain.value = 0.06; br.connect(bd).connect(sg.gain); br.start(t); nodes.push(br);
    shimmer(g, f, t, 0.035, nodes);
    lvl.gain.setValueAtTime(vel, t);
    return { level: lvl, nodes, release: 2.2 };
  },
  // struck glass, a held glass-harmonica tone under it, touched again now and then
  chimes(g, m, t, vel, pan) {
    const c = g.c, f = hz(m), nodes = []; nodes.gainNodes = [];
    const lvl = chain(g, { pan, dry: 0.7, wet: 1.1 });
    const hold = c.createGain(); hold.gain.setValueAtTime(0, t); hold.gain.setTargetAtTime(0.2, t + 0.2, 1.2); hold.connect(lvl);
    const o = osc(c, null, f, t, hold, { w: wave('glass', GLASS) });
    const tr = c.createOscillator(); tr.frequency.value = rnd(3.5, 5.5); const td = c.createGain(); td.gain.value = 0.05; tr.connect(td).connect(hold.gain); tr.start(t);
    nodes.push(o, tr);
    const strike = (at, v = 1) => {
      const s = c.createGain(); s.connect(lvl);
      for (const [ratio, amp, dk] of [[1, 0.55, 1], [2.001, 0.16, 0.55], [3.0, 0.07, 0.38], [4.16, 0.035, 0.25], [5.43, 0.02, 0.18]]) {
        const og = c.createGain(); const d = 7 * dk;
        og.gain.setValueAtTime(0.0001, at); og.gain.exponentialRampToValueAtTime(amp * v, at + 0.006); og.gain.exponentialRampToValueAtTime(0.0001, at + d);
        const so = c.createOscillator(); so.type = 'sine'; so.frequency.value = f * ratio; so.connect(og).connect(s); so.start(at); so.stop(at + d + 0.1);
      }
    };
    strike(t, 1);
    shimmer(g, f, t, 0.03, nodes);
    lvl.gain.setValueAtTime(vel, t);
    return { level: lvl, nodes, release: 3, strike, every: [5, 12] };
  },
  // almost pure: a sine with a trace of overtones, a soft attack
  clear(g, m, t, vel, pan) {
    const c = g.c, f = hz(m), nodes = []; nodes.gainNodes = [];
    const lvl = chain(g, { pan, dry: 1, wet: 0.6 });
    const a = c.createGain(); a.gain.setValueAtTime(0, t); a.gain.setTargetAtTime(0.5, t, 0.25); a.connect(lvl);
    const o = osc(c, null, f, t, a, { w: wave('clear', CLEAR) });
    nodes.push(o, vibrato(c, t, [o], { rate: 4.2, cents: 1.5, delay: 2 }));
    shimmer(g, f, t, 0.02, nodes);
    lvl.gain.setValueAtTime(vel, t);
    return { level: lvl, nodes, release: 1.6 };
  },
  // two detuned saws and a sine, low-passed, the filter slowly breathing
  pad(g, m, t, vel, pan) {
    const c = g.c, f = hz(m), nodes = []; nodes.gainNodes = [];
    const lvl = chain(g, { pan, dry: 0.75, wet: 1 });
    const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.Q.value = 0.6; lp.frequency.value = Math.min(2600, 500 + f * 2);
    const lfo = c.createOscillator(); lfo.frequency.value = rnd(0.05, 0.11); const ld = c.createGain(); ld.gain.value = Math.min(500, 120 + f); lfo.connect(ld).connect(lp.frequency); lfo.start(t);
    const a = c.createGain(); a.gain.setValueAtTime(0, t); a.gain.setTargetAtTime(0.3, t, 0.9);
    lp.connect(a).connect(lvl);
    nodes.push(lfo, osc(c, null, f, t, lp, { w: wave('saw', SAW), det: -7, gain: 0.5 }), osc(c, null, f, t, lp, { w: wave('saw', SAW), det: 7, gain: 0.5 }), osc(c, 'sine', f, t, lp, { gain: 0.9 }));
    lvl.gain.setValueAtTime(vel, t);
    return { level: lvl, nodes, release: 3 };
  },
  // a sung "ah": a buzzy source through three vowel formants, a breath of air, the vowel drifting
  choir(g, m, t, vel, pan) {
    const c = g.c, f = hz(m), nodes = []; nodes.gainNodes = [];
    const lvl = chain(g, { pan, dry: 0.65, wet: 1.2 });
    const src = c.createGain();
    const o1 = osc(c, null, f, t, src, { w: wave('saw', SAW), det: rnd(-4, -1), gain: 0.5 });
    const o2 = osc(c, null, f, t, src, { w: wave('saw', SAW), det: rnd(1, 4), gain: 0.5 });
    nodes.push(o1, o2, vibrato(c, t, [o1, o2], { rate: 5.2, cents: 9, delay: 1 }));
    const mix = c.createGain(); mix.gain.setValueAtTime(0, t); mix.gain.setTargetAtTime(0.42, t, 0.7); mix.connect(lvl);
    const drift = c.createOscillator(); drift.frequency.value = rnd(0.03, 0.06); drift.start(t); nodes.push(drift);
    // ah (800, 1150, 2900) drifting towards oo (400, 800, 2600)
    for (const [fa, fo, q, gn] of [[800, 420, 7, 1], [1150, 820, 9, 0.6], [2900, 2600, 12, 0.18]]) {
      const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = q; bp.frequency.value = (fa + fo) / 2;
      const dd = c.createGain(); dd.gain.value = (fa - fo) / 2; drift.connect(dd).connect(bp.frequency);
      const gg = c.createGain(); gg.gain.value = gn * 3;
      src.connect(bp).connect(gg).connect(mix);
    }
    const nz = c.createBufferSource(); nz.buffer = g.noise; nz.loop = true;
    const nf = c.createBiquadFilter(); nf.type = 'bandpass'; nf.frequency.value = Math.min(6000, f * 6); nf.Q.value = 1.2;
    const ng = c.createGain(); ng.gain.value = 0.012; nz.connect(nf).connect(ng).connect(mix); nz.start(t, Math.random()); nodes.push(nz);
    lvl.gain.setValueAtTime(vel, t);
    return { level: lvl, nodes, release: 2.6 };
  },
  // FM tine piano: a bell-like strike that settles into a soft, held tone; the tremolo pans it slowly
  keys(g, m, t, vel, pan) {
    const c = g.c, f = hz(m), nodes = []; nodes.gainNodes = [];
    const lvl = chain(g, { pan, dry: 0.9, wet: 0.7 });
    const amp = c.createGain(); amp.gain.setValueAtTime(0.0001, t); amp.gain.exponentialRampToValueAtTime(0.55, t + 0.008);
    amp.gain.setTargetAtTime(0.2, t + 0.05, 1.6);
    const car = c.createOscillator(); car.type = 'sine'; car.frequency.value = f;
    const mod = c.createOscillator(); mod.type = 'sine'; mod.frequency.value = f;
    const idx = c.createGain(); idx.gain.setValueAtTime(f * 2.2, t); idx.gain.setTargetAtTime(f * 0.35, t, 0.6);
    mod.connect(idx).connect(car.frequency);
    const tine = c.createOscillator(); tine.type = 'sine'; tine.frequency.value = f * 14;
    const ti = c.createGain(); ti.gain.setValueAtTime(f * 3, t); ti.gain.exponentialRampToValueAtTime(1, t + 0.12);
    tine.connect(ti).connect(car.frequency);
    const trem = c.createOscillator(); trem.frequency.value = rnd(3, 4); const tg = c.createGain(); tg.gain.value = 0.06; trem.connect(tg).connect(amp.gain);
    car.connect(amp).connect(lvl);
    [car, mod, tine, trem].forEach((o) => o.start(t));
    nodes.push(car, mod, tine, trem);
    lvl.gain.setValueAtTime(vel, t);
    return { level: lvl, nodes, release: 1.8 };
  },
};

// ---------- the voices: notes on and off by MIDI number ----------
export function voices(inst = 'guitar') {
  const g = graph(), c = g.c;
  const held = new Map(); // midi → voice
  let cur = inst;
  const panOf = (m) => Math.max(-0.6, Math.min(0.6, (m - 62) / 24));
  const levelFor = (n) => 0.42 / Math.sqrt(Math.max(1, n));
  // every voice made, until it has finished: a stop reaches the ones already leaving or not yet started, too
  const live = new Set();
  function stopVoice(v, t, rel = v.release) {
    if (v.endAt !== undefined && v.endAt <= t) return; // already gone
    const end = t + rel * 3 + 0.2;
    const fade = (gn) => { gn.cancelScheduledValues(t); gn.setValueAtTime(t < v.startAt ? 0 : gn.value || v.vel, t); gn.setTargetAtTime(0, t, rel / 3); };
    fade(v.level.gain);
    (v.nodes.gainNodes || []).forEach((gn) => fade(gn.gain)); // the shimmer, which bypasses the note's own level
    v.nodes.forEach((o) => { try { o.stop(t < v.startAt ? v.startAt + 0.01 : end); } catch (e) { /* */ } });
    clearTimeout(v.timer);
    v.endAt = Math.min(v.endAt ?? Infinity, end);
    v.dead = true;
  }
  // a held note sounded again: re-plucked, re-struck, or (sustained instruments) a soft swell
  function touch(m, v, at) {
    if (v.strike) { v.strike(at, 0.6); return; }
    if (cur === 'guitar') { const pl = c.createBufferSource(); pl.buffer = ksBuffer(m); const gg = c.createGain(); gg.gain.value = 0.45; pl.connect(gg).connect(v.level); pl.start(at); return; }
    const gn = v.level.gain, base = v.vel || 0.2;
    gn.setTargetAtTime(base * 1.7, at, 0.04); gn.setTargetAtTime(base, at + 0.25, 0.5);
  }
  const prune = () => { const now = c.currentTime; for (const v of live) if (v.endAt !== undefined && v.endAt < now) live.delete(v); };
  function ringOn(v) { // chimes: touched again now and then
    if (!v.strike) return;
    const next = () => {
      v.timer = setTimeout(() => {
        if (v.dead) return;
        v.strike(c.currentTime + 0.05, rnd(0.35, 0.7));
        next();
      }, rnd(v.every[0], v.every[1]) * 1000);
    };
    next();
  }
  return {
    get inst() { return cur; },
    set inst(i) { cur = i; },
    held: () => [...held.keys()],
    // sound exactly these notes from t: common tones hold, new ones enter (staggered if asked), old ones leave
    // arp: a gap in seconds (low to high, evenly), or a list of offsets, one per note in order
    set(midis, t, { stagger = 0, vel = 1, arp = null, boost = null } = {}) {
      const up = (m) => (boost && boost.includes(m) ? 1.7 : 1);
      const want = [...new Set(midis)];
      const lv = levelFor(want.length) * vel;
      prune();
      for (const [m, v] of held) if (!want.includes(m)) { stopVoice(v, t + (stagger ? Math.random() * stagger : 0)); held.delete(m); }
      want.forEach((m, i) => {
        const v = held.get(m);
        const slot = arp == null ? null : Array.isArray(arp) ? (arp[i] ?? arp[arp.length - 1]) : i * arp;
        if (v) { v.level.gain.setTargetAtTime(lv * up(m), t, 0.6); v.vel = lv * up(m); if (slot != null) touch(m, v, t + slot); return; }
        const at = t + (slot != null ? slot : stagger ? (i / Math.max(1, want.length - 1)) * stagger * rnd(0.6, 1) : 0);
        const nv = MAKERS[cur](g, m, at, lv * up(m), panOf(m));
        nv.vel = lv * up(m); nv.startAt = at;
        live.add(nv);
        held.set(m, nv);
        ringOn(nv);
      });
      // levels follow the number of notes
      for (const [m, v] of held) { v.level.gain.setTargetAtTime(lv * up(m), t + 0.05, 0.8); v.vel = lv * up(m); }
    },
    // one note in or out
    add(m, t) { this.set([...held.keys(), m], t); },
    remove(m, t) { this.set([...held.keys()].filter((x) => x !== m), t); },
    // the held notes struck again one after another, low to high (an arpeggio over a sustained chord)
    roll(midis, t, gap) { [...midis].sort((a, b) => a - b).forEach((m, i) => { const v = held.get(m); if (v) touch(m, v, t + i * gap); }); },
    // pluck / strike what's held again, softly (the guitar and keys)
    retouch(t) {
      for (const [m, v] of held) {
        if (v.strike) v.strike(t, 0.5);
        else if (cur === 'guitar') { const pl = c.createBufferSource(); pl.buffer = ksBuffer(m); const gg = c.createGain(); gg.gain.value = 0.3; pl.connect(gg).connect(v.level); pl.start(t + Math.random() * 0.25); }
      }
    },
    // everything stops: what's held, what's leaving, what was due to start
    releaseAll(t, rel) { for (const v of live) stopVoice(v, t, Math.min(rel ?? v.release, v.release)); live.clear(); held.clear(); },
    // a jump (skip): notes still on their way out, or due later, are cut now; what's held stays for the next set()
    cut(t) { const keep = new Set(held.values()); for (const v of live) if (!keep.has(v) || v.startAt > t) { stopVoice(v, t, 0.5); live.delete(v); if (keep.has(v)) for (const [m, x] of held) if (x === v) held.delete(m); } },
  };
}

// a single soft tone (count-in, quiz reveal): a bell
export function ping(midi, t, vel = 0.2) {
  const g = graph(), c = g.c;
  const lvl = chain(g, { pan: 0, dry: 0.6, wet: 1 });
  lvl.gain.setValueAtTime(0.0001, t); lvl.gain.exponentialRampToValueAtTime(vel, t + 0.01); lvl.gain.exponentialRampToValueAtTime(0.0001, t + 3);
  const o = c.createOscillator(); o.type = 'sine'; o.frequency.value = hz(midi); o.connect(lvl); o.start(t); o.stop(t + 3.1);
}
