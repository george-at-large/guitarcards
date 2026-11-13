// Ear trainer sound: the drill videos' plucked guitar (tools/drillvideo, tools/audiation build.py), a warm held tone for
// audiation, a bass for the real-music levels, one room reverb, and the narrator's recorded lines.
import { audioCtx, unlockAudio } from '../audio.js';

export { unlockAudio };
export const hz = (m) => 440 * Math.pow(2, (m - 69) / 12);

let bus = null; // { dry, verb, voice }
const live = new Set(); // every scheduled node, so hush() can cut them all

function ir(c, { seconds = 2.6, rt60 = 1.6, rt60High = 0.8, predelay = 0.02 } = {}) {
  // decorrelated noise, the highs dying faster than the lows, a soft onset (as reverb_ir in build.py)
  const sr = c.sampleRate;
  const pre = Math.floor(predelay * sr);
  const n = Math.floor(seconds * sr);
  const buf = c.createBuffer(2, pre + n, sr);
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    let lp = 0, energy = 0;
    const a = Math.exp(-2 * Math.PI * 2500 / sr);
    for (let i = 0; i < n; i++) {
      const t = i / sr;
      const x = Math.random() * 2 - 1;
      lp = a * lp + (1 - a) * x;
      const v = (lp * Math.exp(-6.9 * t / rt60) + 0.6 * (x - lp) * Math.exp(-6.9 * t / rt60High)) * (1 - Math.exp(-t / 0.012));
      d[pre + i] = v;
      energy += v * v;
    }
    const k = 1 / Math.sqrt(energy);
    for (let i = pre; i < pre + n; i++) d[i] *= k;
  }
  return buf;
}

export function ctx() {
  const c = audioCtx();
  if (!bus) {
    const master = c.createGain(); master.gain.value = 0.9;
    const comp = c.createDynamicsCompressor();
    comp.threshold.value = -14; comp.knee.value = 10; comp.ratio.value = 2.5; comp.attack.value = 0.005; comp.release.value = 0.25;
    master.connect(comp).connect(c.destination);
    const verb = c.createConvolver(); verb.buffer = ir(c);
    const wet = c.createGain(); wet.gain.value = 1.6;
    verb.connect(wet).connect(master);
    const voice = c.createGain(); voice.gain.value = 1.0;
    voice.connect(master);
    bus = { master, verb, voice };
  }
  return c;
}

// a source's way out: dry to the master and a send to the room, panned
function out(c, pan, send) {
  const p = c.createStereoPanner(); p.pan.value = pan;
  p.connect(bus.master);
  if (send) { const s = c.createGain(); s.gain.value = send; p.connect(s).connect(bus.verb); }
  return p;
}
const panOf = (string) => ((3.5 - (string || 3.5)) / 2.5) * 0.35; // low strings left, high right

// ---------- the plucked string ----------
const pluckCache = new Map();
function rand(seed) { let s = seed * 9301 + 49297; return () => ((s = (s * 9301 + 49297) % 233280) / 233280); }

// partials shaped by the picking point, each dying faster the higher it is, a touch of stiffness (pluck() in build.py)
function pluckBuffer(c, midi, { decay = 1.9, position = 0.18, mute = false } = {}) {
  const key = `${midi}|${decay}|${position}|${mute}`;
  if (pluckCache.has(key)) return pluckCache.get(key);
  const sr = c.sampleRate;
  const dec = mute ? 0.045 : decay;
  const n = Math.floor(Math.max(dec * 2.5, mute ? 0.25 : 0) * sr);
  const buf = c.createBuffer(1, n, sr);
  const d = buf.getChannelData(0);
  const f0 = hz(midi);
  const r = rand(midi + 7);
  for (let k = 1; k < 18; k++) {
    const fk = f0 * k * Math.sqrt(1 + 0.00008 * k * k);
    if (fk > 12000) break;
    const amp = Math.abs(Math.sin(Math.PI * k * position)) / k;
    const w = 2 * Math.PI * fk / sr;
    const cw = Math.cos(w), sw = Math.sin(w);
    const ph = r() * 0.3;
    let re = Math.cos(ph), im = Math.sin(ph), a = amp;
    const da = Math.exp(-(1 / dec) * (1 + 0.35 * (k - 1)) / sr);
    for (let i = 0; i < n; i++) {
      d[i] += a * im;
      const re2 = re * cw - im * sw; im = re * sw + im * cw; re = re2;
      a *= da;
    }
  }
  const att = Math.floor(0.004 * sr);
  for (let i = 0; i < att; i++) d[i] *= i / att;
  let peak = 0;
  for (let i = 0; i < n; i++) peak = Math.max(peak, Math.abs(d[i]));
  for (let i = 0; i < n; i++) d[i] /= peak || 1;
  if (mute) { // a scratch: the damped string plus a little noise
    const nr = rand(midi + 3);
    for (let i = 0; i < n; i++) d[i] = d[i] * 1.1 + (nr() * 2 - 1) * Math.exp(-i / (0.015 * sr)) * 0.9;
  }
  pluckCache.set(key, buf);
  return buf;
}
// build the common buffers ahead, a few at a time, so the first strum doesn't stall
export function warm(instrument, midis) {
  const c = ctx();
  const todo = [...midis];
  const make = instrument === 'piano' ? (m) => pianoBuffer(c, m) : instrument === 'guitar' ? (m) => pluckBuffer(c, m, { decay: 3.4 }) : null;
  if (!make) return;
  const step = () => { if (todo.length) make(todo.shift()); if (todo.length) setTimeout(step, 4); };
  setTimeout(step, 50);
}

const ringing = new Map(); // string -> gain node of the note sounding on it
function damp(g, t, fade = 0.03) {
  try { g.gain.cancelScheduledValues(t); g.gain.setValueAtTime(g.gain.value, t); g.gain.setTargetAtTime(0, t, fade / 3); } catch (e) { /* */ }
}

// one plucked note on a string
export function pluck(midi, t, { string = 3, vel = 0.8, mute = false, level = 0.5, send = 0.16, dur = null, decay = 1.9 } = {}) {
  const c = ctx();
  if (ringing.has(string)) damp(ringing.get(string), t);
  const src = c.createBufferSource(); src.buffer = pluckBuffer(c, midi, { mute, decay });
  const g = c.createGain(); g.gain.value = level * vel * Math.pow(hz(midi) / 130.8, -0.15);
  src.connect(g).connect(out(c, panOf(string), send));
  src.start(t);
  if (dur) damp(g, t + dur, 0.06);
  ringing.set(string, g);
  live.add(src); src.onended = () => live.delete(src);
  return g;
}

// a strum: low string to high (down) or high to low (up); strings not in it are damped, as a guitarist lifts a chord
export function strum(notes, t, { dir = 'D', spread = 0.028, vel = 0.8, mute = false, dur = null, keep = false, decay = 1.9 } = {}) {
  const ns = [...notes].sort((a, b) => b.string - a.string);
  if (dir === 'U') ns.reverse();
  if (!keep) for (const [s, g] of ringing) if (!ns.some((n) => n.string === s)) { damp(g, t, 0.06); ringing.delete(s); }
  ns.forEach((n, i) => pluck(n.midi, t + i * spread, { string: n.string, vel: vel * (dir === 'U' ? 0.8 : 1) * (1 - 0.05 * i) * (0.95 + 0.05 * Math.random()), mute, dur, decay }));
}
export function dampAll(t) { const c = ctx(); for (const g of ringing.values()) damp(g, t ?? c.currentTime, 0.08); ringing.clear(); }

// ---------- keyboards ----------
// a modelled piano note: stiff-string partials, three slightly detuned strings (two below the bass), a quick first
// decay into a long second one (highs dying first), a little hammer thump
const pianoCache = new Map();
function pianoBuffer(c, midi) {
  if (pianoCache.has(midi)) return pianoCache.get(midi);
  const sr = c.sampleRate, f0 = hz(midi);
  const n = Math.floor(Math.min(6, 3 + 40 / Math.sqrt(f0)) * sr);
  const buf = c.createBuffer(2, n, sr);
  const L = buf.getChannelData(0), R = buf.getChannelData(1);
  const B = 0.00012 * Math.pow(2, (midi - 60) / 20);
  const r = rand(midi + 11);
  const slow = 7 * Math.pow(f0 / 261.6, -0.55), fast = slow / 7;
  const strings = midi < 46 ? [-0.7, 0.7] : [-0.9, 0, 0.8];
  for (let k = 1; k <= 24; k++) {
    const fk = f0 * k * Math.sqrt(1 + B * k * k);
    if (fk > 11000) break;
    const amp = Math.pow(k, -1.15) * Math.exp(-(k - 1) * f0 / 2600) * (k === 1 ? 0.8 : 1);
    if (amp < 0.002) continue;
    const dS = Math.exp(-(1 + 0.08 * k * k * f0 / 600) / (slow * sr)), dF = Math.exp(-(1 + 0.15 * k) / (fast * sr));
    for (const [si, cents] of strings.entries()) {
      const w = 2 * Math.PI * fk * Math.pow(2, cents / 1200) / sr;
      const cw = Math.cos(w), sw = Math.sin(w);
      let re = Math.cos(r() * 6.28), im = Math.sin(r() * 6.28);
      let aS = 0.45 * amp, aF = 0.55 * amp;
      const pan = (si - (strings.length - 1) / 2) * 0.25;
      const gl = 1 - pan, gr = 1 + pan;
      for (let i = 0; i < n; i++) {
        const v = (aS + aF) * im;
        L[i] += v * gl; R[i] += v * gr;
        const re2 = re * cw - im * sw; im = re * sw + im * cw; re = re2;
        aS *= dS; aF *= dF;
      }
    }
  }
  const thump = rand(midi + 5);
  let lp = 0;
  for (let i = 0; i < 0.03 * sr; i++) { lp = lp * 0.9 + (thump() * 2 - 1) * 0.1; const v = lp * 0.6 * Math.exp(-i / (0.006 * sr)); L[i] += v; R[i] += v; }
  const att = Math.floor(0.002 * sr);
  let peak = 0;
  for (let i = 0; i < n; i++) { if (i < att) { L[i] *= i / att; R[i] *= i / att; } peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i])); }
  for (let i = 0; i < n; i++) { L[i] /= peak; R[i] /= peak; }
  pianoCache.set(midi, buf);
  return buf;
}
const held = []; // keyboard notes sounding: {g, stop}
function piano(midi, t, vel) {
  const c = ctx();
  const src = c.createBufferSource(); src.buffer = pianoBuffer(c, midi);
  const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1800 + 5000 * vel; lp.Q.value = 0.4;
  const g = c.createGain(); g.gain.value = 0.42 * vel * Math.pow(hz(midi) / 261.6, -0.18);
  src.connect(lp).connect(g).connect(out(c, (midi - 60) / 60, 0.2));
  src.start(t);
  live.add(src); src.onended = () => live.delete(src);
  return g;
}
// an FM electric piano: a sine carried by a sine at the same frequency whose index falls, a quieter tine an octave
// and a fifth up, a slow decay
function epiano(midi, t, vel) {
  const c = ctx(), f = hz(midi);
  const o = out(c, (midi - 60) / 50, 0.22);
  const g = c.createGain(); g.gain.value = 0; g.connect(o);
  const base = 0.3 * vel * Math.pow(f / 261.6, -0.25);
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(base, t + 0.004); g.gain.setTargetAtTime(base * 0.35, t + 0.004, 0.7);
  const car = c.createOscillator(); car.frequency.value = f;
  const mod = c.createOscillator(); mod.frequency.value = f;
  const idx = c.createGain(); idx.gain.setValueAtTime(f * 2.2 * vel, t); idx.gain.setTargetAtTime(f * 0.25, t, 0.25);
  mod.connect(idx).connect(car.frequency);
  const tine = c.createOscillator(); tine.frequency.value = f * 3;
  const tg = c.createGain(); tg.gain.setValueAtTime(base * 0.25, t); tg.gain.setTargetAtTime(0, t, 0.08);
  car.connect(g); tine.connect(tg).connect(o);
  [car, mod, tine].forEach((x) => { x.start(t); live.add(x); });
  return { g, stop: (at) => [car, mod, tine].forEach((x) => { try { x.stop(at + 0.4); } catch (e) { /* */ } }) };
}
// lift the hands: everything held is damped
function release(t, fade = 0.12) {
  while (held.length) { const h = held.pop(); damp(h.g, t, fade); h.stop?.(t + fade); }
}
export const INSTRUMENTS = { guitar: 'Guitar', piano: 'Piano', epiano: 'Electric piano', pad: 'Warm pad' };
// one chord, struck once and held for `dur` seconds. notes: [{midi, string}] (string only matters on the guitar)
export function playChord(instrument, notes, t, dur, { vel = 0.8 } = {}) {
  if (instrument === 'guitar') {
    // one slow, even strum, low to high, the top strings a little softer, ringing until the next chord
    strum(notes, t, { spread: 0.045, vel: vel * 0.9, decay: 3.4 });
    return;
  }
  release(t);
  const ms = [...notes].map((n) => n.midi).sort((a, b) => a - b);
  ms.forEach((m, i) => {
    const at = t + (instrument === 'pad' ? 0 : i * 0.008);
    if (instrument === 'piano') held.push({ g: piano(m, at, vel * (i === 0 ? 0.95 : 0.8)) });
    else if (instrument === 'epiano') held.push(epiano(m, at, vel * (i === 0 ? 0.9 : 0.75)));
    else {
      const h = tone(m, at, { attack: 0.18, pluckLevel: 0, level: 0.1, send: 0.35 });
      held.push({ g: { gain: { cancelScheduledValues() {}, setValueAtTime() {}, setTargetAtTime() {}, value: 0 } }, stop: (x) => h.stop(x, 0.5) });
    }
  });
  if (dur) release(t + dur, instrument === 'pad' ? 0.3 : 0.15);
}

// ---------- bass ----------
export function bass(midi, t, dur = 0.9, vel = 0.9) {
  const c = ctx();
  const src = c.createBufferSource(); src.buffer = pluckBuffer(c, midi, { decay: 1.3, position: 0.3 });
  const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 900; lp.Q.value = 0.5;
  const g = c.createGain(); g.gain.value = 0.55 * vel;
  src.connect(lp).connect(g).connect(out(c, 0, 0.05));
  src.start(t);
  damp(g, t + dur, 0.05);
  live.add(src); src.onended = () => live.delete(src);
}

// ---------- the held tone (audiation) ----------
const waves = new Map();
function waveFor(c, midi) {
  if (waves.has(midi)) return waves.get(midi);
  const f = hz(midi);
  const real = new Float32Array(11), imag = new Float32Array(11);
  for (let k = 1; k <= 10; k++) {
    const fk = f * k;
    if (fk > 9000) break;
    imag[k] = Math.pow(k, -1.7) * (1 / (1 + Math.pow(fk / 2600, 2))) * (k === 2 || k === 3 ? 1.25 : 1);
  }
  const w = c.createPeriodicWave(real, imag);
  waves.set(midi, w);
  return w;
}
// a held voice: a soft pluck that blooms into three slightly detuned copies with a slow drift and swell.
// Returns a handle: level(lin, t) changes its loudness (boost, solo), stop(t) lets it go.
export function tone(midi, t, { string = 3, attack = 0.3, level = 0.13, pluckLevel = 0.55, send = 0.32 } = {}) {
  const c = ctx();
  const o = out(c, panOf(string), send);
  const env = c.createGain(); env.gain.value = 0;
  const lvl = c.createGain(); lvl.gain.value = 1;
  const swell = c.createGain(); swell.gain.value = 0.965;
  env.connect(lvl).connect(swell).connect(o);
  const base = level * Math.pow(hz(midi) / 130.8, -0.22);
  env.gain.setValueAtTime(0, t);
  env.gain.linearRampToValueAtTime(base, t + attack);
  const nodes = [];
  const sw = c.createOscillator(); sw.frequency.value = 1 / 11; const swg = c.createGain(); swg.gain.value = 0.035;
  sw.connect(swg).connect(swell.gain); sw.start(t); nodes.push(sw);
  [-3.5, 0, 3.5].forEach((cents, i) => {
    const osc = c.createOscillator(); osc.setPeriodicWave(waveFor(c, midi)); osc.frequency.value = hz(midi); osc.detune.value = cents;
    const drift = c.createOscillator(); drift.frequency.value = 1 / (7 + 2.5 * i); const dg = c.createGain(); dg.gain.value = 1.2;
    drift.connect(dg).connect(osc.detune);
    const g = c.createGain(); g.gain.value = i === 1 ? 0.42 : 0.33;
    osc.connect(g).connect(env);
    osc.start(t); drift.start(t);
    nodes.push(osc, drift);
  });
  if (pluckLevel) {
    const src = c.createBufferSource(); src.buffer = pluckBuffer(c, midi);
    const pg = c.createGain(); pg.gain.value = base * pluckLevel * 2.2;
    src.connect(pg).connect(lvl); src.start(t); nodes.push(src);
  }
  nodes.forEach((n) => live.add(n));
  let stopped = false;
  return {
    level(v, at = c.currentTime, ramp = 0.25) { lvl.gain.cancelScheduledValues(at); lvl.gain.setValueAtTime(lvl.gain.value, at); lvl.gain.linearRampToValueAtTime(v, at + ramp); },
    stop(at = c.currentTime, release = 1.1) {
      if (stopped) return; stopped = true;
      env.gain.cancelScheduledValues(at); env.gain.setValueAtTime(env.gain.value, at); env.gain.setTargetAtTime(0, at, release / 4);
      nodes.forEach((n) => { try { n.stop(at + release + 0.2); } catch (e) { /* */ } live.delete(n); });
    },
  };
}

// ---------- the narrator ----------
let manifest = null;
const clips = new Map();
async function loadManifest() {
  if (manifest) return manifest;
  try { manifest = await (await fetch('ear/voice/index.json', { cache: 'no-cache' })).json(); } catch (e) { manifest = {}; }
  return manifest;
}
async function clip(text) {
  const m = await loadManifest();
  const file = m[text];
  if (!file) return null;
  if (!clips.has(file)) clips.set(file, fetch('ear/voice/' + file).then((r) => r.arrayBuffer()).then((b) => ctx().decodeAudioData(b)).catch(() => null));
  return clips.get(file);
}
export async function preload(lines) { await loadManifest(); await Promise.all(lines.map(clip)); }
let speaking = null;
// say a line; resolves when it has been said. Lines not yet recorded fall back to the device's voice.
export async function say(text) {
  const c = ctx();
  const buf = await clip(text);
  if (buf) {
    return new Promise((res) => {
      const src = c.createBufferSource(); src.buffer = buf;
      const g = c.createGain(); g.gain.value = 1.1;
      src.connect(g).connect(bus.voice);
      const s = c.createGain(); s.gain.value = 0.05; g.connect(s).connect(bus.verb);
      src.onended = () => { live.delete(src); speaking = null; res(); };
      speaking = { stop: () => { try { src.stop(); } catch (e) { /* */ } } };
      live.add(src);
      src.start();
    });
  }
  if (!('speechSynthesis' in window)) return;
  return new Promise((res) => {
    const u = new SpeechSynthesisUtterance(text); u.rate = 0.95;
    u.onend = u.onerror = () => { speaking = null; res(); };
    speaking = { stop: () => speechSynthesis.cancel() };
    speechSynthesis.speak(u);
  });
}

export function hush() {
  const c = ctx();
  if (speaking) speaking.stop();
  for (const n of live) { try { n.stop(c.currentTime + 0.05); } catch (e) { /* */ } }
  live.clear();
  dampAll();
}

// keep the screen awake while something plays (iOS stops Web Audio when the phone locks)
let lock = null;
export async function awake(on) {
  try {
    if (on && !lock && navigator.wakeLock) lock = await navigator.wakeLock.request('screen');
    if (!on && lock) { await lock.release(); lock = null; }
  } catch (e) { lock = null; }
}
export const now = () => ctx().currentTime;
export const sleep = (s) => new Promise((r) => setTimeout(r, s * 1000));
