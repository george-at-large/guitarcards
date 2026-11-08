import { swingFrac, slotOffsets } from './rhythm.js';
export { swingFrac };
// Web Audio engine: Karplus-Strong guitar, soft keys, metronome, drone, event player.
let ctx = null;
let master = null;     // every voice goes in here
let guitarBus = null;  // plucked strings go through a guitar-body EQ first
let irBuf = null;
const pluckCache = new Map();

// small-room reverb impulse: decaying stereo noise, generated once
function roomIR(c) {
  if (irBuf) return irBuf;
  const len = Math.floor(c.sampleRate * 1.6);
  irBuf = c.createBuffer(2, len, c.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const d = irBuf.getChannelData(ch);
    let lp = 0;
    for (let i = 0; i < len; i++) {
      const t = i / c.sampleRate;
      lp = lp * 0.6 + (Math.random() * 2 - 1) * 0.4;           // darker tail
      d[i] = lp * Math.pow(1 - i / len, 2.2) * Math.exp(-t * 2.2) * (i < 80 ? i / 80 : 1);
    }
  }
  return irBuf;
}
function buildBus() {
  const c = ctx;
  master = c.createGain(); master.gain.value = 0.85;
  const comp = c.createDynamicsCompressor(); comp.threshold.value = -16; comp.knee.value = 12; comp.ratio.value = 3; comp.attack.value = 0.004; comp.release.value = 0.2;
  const dry = c.createGain(); dry.gain.value = 1;
  const verb = c.createConvolver(); verb.buffer = roomIR(c);
  const wet = c.createGain(); wet.gain.value = 0.16;
  master.connect(dry).connect(comp);
  master.connect(verb).connect(wet).connect(comp);
  comp.connect(c.destination);
  // guitar body: a little low-mid warmth, tame the harsh upper mids and fizz
  guitarBus = c.createGain(); guitarBus.gain.value = 1;
  const body = c.createBiquadFilter(); body.type = 'peaking'; body.frequency.value = 120; body.Q.value = 0.9; body.gain.value = 3.5;
  const mid = c.createBiquadFilter(); mid.type = 'peaking'; mid.frequency.value = 2400; mid.Q.value = 1.2; mid.gain.value = -3;
  const air = c.createBiquadFilter(); air.type = 'highshelf'; air.frequency.value = 6500; air.gain.value = -7;
  guitarBus.connect(body).connect(mid).connect(air).connect(master);
}
export function audioCtx() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    ctx = new AC({ latencyHint: 'interactive' });
    buildBus();
  }
  return ctx;
}
// Route every voice into a given context instead, e.g. an OfflineAudioContext for video export
// (video/player.js). Returns the previous context so the caller can switch back.
export function useContext(c) {
  const prev = ctx;
  ctx = c; irBuf = null; clickBuf = null; pluckCache.clear();
  if (c) buildBus();
  return prev;
}
// iOS home-screen apps: a looping silent <audio> element puts the page in the "media playback" audio session,
// so Web Audio isn't muted by the ring/silent switch and keeps working when the app is reopened offline.
let keepAlive = null;
function silentWavUrl() {
  const sr = 8000, n = sr; // 1 s of silence, 8-bit mono
  const buf = new ArrayBuffer(44 + n), v = new DataView(buf);
  const w = (o, str) => [...str].forEach((ch, i) => v.setUint8(o + i, ch.charCodeAt(0)));
  w(0, 'RIFF'); v.setUint32(4, 36 + n, true); w(8, 'WAVE'); w(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
  v.setUint32(24, sr, true); v.setUint32(28, sr, true); v.setUint16(32, 1, true); v.setUint16(34, 8, true); w(36, 'data'); v.setUint32(40, n, true);
  for (let i = 0; i < n; i++) v.setUint8(44 + i, 128);
  return URL.createObjectURL(new Blob([buf], { type: 'audio/wav' }));
}
// call from a user gesture (iOS)
export async function unlockAudio() {
  try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch (e) { /* */ }
  try {
    if (!keepAlive) { keepAlive = new Audio(silentWavUrl()); keepAlive.loop = true; keepAlive.setAttribute('playsinline', ''); keepAlive.volume = 0.01; }
    if (keepAlive.paused) keepAlive.play().catch(() => {});
  } catch (e) { /* */ }
  const c = audioCtx();
  if (c.state !== 'running') { try { await c.resume(); } catch (e) { /* */ } }
  const b = c.createBuffer(1, 1, 22050);
  const s = c.createBufferSource(); s.buffer = b; s.connect(c.destination); s.start(0);
}
const hz = (m) => 440 * Math.pow(2, (m - 69) / 12);

function ksBuffer(midi, muted = false) {
  const key = midi + (muted ? 'm' : '');
  if (pluckCache.has(key)) return pluckCache.get(key);
  const c = audioCtx();
  const sr = c.sampleRate;
  const f = hz(midi);
  // low strings ring longer than high ones
  const t60 = muted ? 0.09 : Math.max(1.1, 4.2 - (midi - 40) * 0.075);
  const len = Math.floor(sr * Math.min(3.2, muted ? 0.16 : t60 * 0.85));
  const buf = c.createBuffer(1, len, sr);
  const y = buf.getChannelData(0);
  const D = sr / f - 0.5;                 // loop delay incl. the averaging filter's half-sample
  const Di = Math.floor(D), fr = D - Di;
  const rho = Math.pow(10, -3 / (sr * t60));
  // excitation: soft-picked noise burst, then a pick-position comb (removes harmonics like a real pluck point)
  const N = Math.ceil(D);
  const exc = new Float32Array(N + 1);
  let lp = 0;
  const bright = muted ? 0.25 : Math.min(0.75, 0.45 + (80 - midi) * 0.004);
  for (let i = 0; i < N; i++) { lp += bright * ((Math.random() * 2 - 1) - lp); exc[i] = lp; }
  const P = Math.max(1, Math.round(N * 0.14));
  for (let i = N - 1; i >= P; i--) exc[i] -= exc[i - P] * 0.9;
  const at = (n) => (n >= 0 ? y[n] : 0);
  for (let n = 0; n < len; n++) {
    const a1 = (1 - fr) * at(n - Di) + fr * at(n - Di - 1);
    const a2 = (1 - fr) * at(n - Di - 1) + fr * at(n - Di - 2);
    y[n] = (n < N ? exc[n] : 0) + rho * 0.5 * (a1 + a2);
  }
  // normalise and fade the tail
  let peak = 0; for (let n = 0; n < Math.min(len, N * 4); n++) peak = Math.max(peak, Math.abs(y[n]));
  const k = peak ? 0.9 / peak : 1;
  const fade = Math.min(len, Math.floor(sr * 0.08));
  for (let n = 0; n < len; n++) y[n] *= k * (n > len - fade ? (len - n) / fade : 1);
  pluckCache.set(key, buf);
  return buf;
}

export function pluck(midi, t, { vel = 0.8, muted = false, dur = null, dest = null } = {}) {
  const c = audioCtx();
  const s = c.createBufferSource();
  s.buffer = ksBuffer(midi, muted);
  const g = c.createGain();
  const v = vel * 0.42;
  g.gain.value = v;
  // softer touch = darker tone
  const lp = c.createBiquadFilter();
  lp.type = 'lowpass'; lp.frequency.value = muted ? 1400 : 2200 + vel * 4200; lp.Q.value = 0.5;
  s.connect(lp).connect(g).connect(dest || guitarBus);
  s.start(t);
  if (dur) { g.gain.setValueAtTime(v, t + dur); g.gain.exponentialRampToValueAtTime(0.0005, t + dur + 0.12); s.stop(t + dur + 0.15); }
  return s;
}

export function keys(midi, t, dur = 1, vel = 0.6) {
  const c = audioCtx();
  const f = hz(midi);
  const hold = Math.max(0.35, dur);
  const end = t + hold + 0.6;
  const out = c.createGain();
  out.gain.setValueAtTime(0.0001, t);
  out.gain.exponentialRampToValueAtTime(vel * 0.2, t + 0.006);
  out.gain.exponentialRampToValueAtTime(vel * 0.11, t + 0.4);
  out.gain.setTargetAtTime(vel * 0.06, t + 0.4, 1.2);
  out.gain.setTargetAtTime(0.0001, t + hold, 0.18);
  const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = Math.min(9000, 1800 + 5 * f); lp.Q.value = 0.4;
  out.connect(lp).connect(master);
  // tine: carrier + modulator at 1:1, bright at the attack then mellowing (Rhodes-like)
  const car = c.createOscillator(); car.type = 'sine'; car.frequency.value = f;
  const mod = c.createOscillator(); mod.type = 'sine'; mod.frequency.value = f;
  const mi = c.createGain();
  mi.gain.setValueAtTime(f * 1.6 * vel, t);
  mi.gain.exponentialRampToValueAtTime(f * 0.25, t + 0.5);
  mod.connect(mi).connect(car.frequency);
  // bell partial for the "ding"
  const bell = c.createOscillator(); bell.type = 'sine'; bell.frequency.value = f * 4.01;
  const bg = c.createGain(); bg.gain.setValueAtTime(0.06 * vel, t); bg.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
  // body: soft sine an octave below for warmth on higher notes
  const sub = c.createOscillator(); sub.type = 'sine'; sub.frequency.value = f / 2;
  const sg = c.createGain(); sg.gain.value = midi > 60 ? 0.12 : 0.05;
  car.connect(out); bell.connect(bg).connect(out); sub.connect(sg).connect(out);
  for (const o of [car, mod, bell, sub]) { o.start(t); o.stop(end); }
}

export function noiseHit(t, { dur = 0.05, freq = 2500, vel = 0.5 } = {}) {
  const c = audioCtx();
  const len = Math.floor(c.sampleRate * dur);
  const b = c.createBuffer(1, len, c.sampleRate);
  const d = b.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len) ** 2;
  const s = c.createBufferSource(); s.buffer = b;
  const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = freq; bp.Q.value = 0.8;
  const g = c.createGain(); g.gain.value = vel;
  s.connect(bp).connect(g).connect(master);
  s.start(t);
}

let clickBuf = null;
export function click(t, level = 1) {
  // level 2 = bar accent, 1 = beat, 0 = subdivision — a short woodblock-like tick
  const c = audioCtx();
  if (!clickBuf) { const n = Math.floor(c.sampleRate * 0.03); clickBuf = c.createBuffer(1, n, c.sampleRate); const d = clickBuf.getChannelData(0); for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (n * 0.12)); }
  const f = level === 2 ? 2100 : level === 1 ? 1500 : 1050;
  const v = level === 2 ? 0.9 : level === 1 ? 0.6 : 0.28;
  const s = c.createBufferSource(); s.buffer = clickBuf;
  const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = f; bp.Q.value = 9;
  const g = c.createGain(); g.gain.value = v * 2.2;
  s.connect(bp).connect(g).connect(master); s.start(t);
  const o = c.createOscillator(); o.type = 'sine'; o.frequency.value = f;
  const og = c.createGain(); og.gain.setValueAtTime(v * 0.25, t); og.gain.exponentialRampToValueAtTime(0.0001, t + 0.025);
  o.connect(og).connect(master); o.start(t); o.stop(t + 0.03);
}

// strum: midis low->high; dir 'D' plays low->high, 'U' high->low
export function strum(midis, t, { dir = 'D', spread = 0.012, vel = 0.8, muted = false, dur = null, sound = 'guitar' } = {}) {
  const ord = dir === 'U' ? [...midis].reverse() : midis;
  ord.forEach((m, i) => {
    if (sound === 'keys') keys(m, t, dur || 1, vel * 0.8);
    else pluck(m, t + i * spread, { vel: vel * (dir === 'U' ? 0.8 : 1), muted, dur });
  });
}

// ---------- drone ----------
let drone = null;
export function startDrone(midi, fifth = true) {
  stopDrone();
  const c = audioCtx();
  const out = c.createGain();
  out.gain.setValueAtTime(0.0001, c.currentTime);
  out.gain.exponentialRampToValueAtTime(0.14, c.currentTime + 1.2);
  const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1100; lp.Q.value = 0.7;
  // slow filter sweep so it breathes
  const lfo = c.createOscillator(); lfo.frequency.value = 0.09; const lfoG = c.createGain(); lfoG.gain.value = 350;
  lfo.connect(lfoG).connect(lp.frequency);
  out.connect(lp).connect(master);
  const voices = [[midi, 'triangle', 0.5], [midi, 'sine', 0.35], [midi + 12, 'sine', 0.22], [midi + 24, 'sine', 0.06]].concat(fifth ? [[midi + 7, 'sine', 0.2], [midi + 19, 'sine', 0.06]] : []);
  const oscs = [lfo];
  voices.forEach(([m, type, amp], i) => {
    const o = c.createOscillator(); o.type = type; o.frequency.value = hz(m); o.detune.value = (i % 2 ? 3 : -3);
    const g = c.createGain(); g.gain.value = amp;
    o.connect(g).connect(out); o.start(); oscs.push(o);
  });
  lfo.start();
  drone = { out, oscs, midi, fifth };
}
export function stopDrone() {
  if (!drone) return;
  const c = audioCtx();
  const d = drone; drone = null;
  d.out.gain.cancelScheduledValues(c.currentTime);
  d.out.gain.setValueAtTime(d.out.gain.value, c.currentTime);
  d.out.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.4);
  d.oscs.forEach((o) => o.stop(c.currentTime + 0.45));
}
export const droneOn = () => !!drone;

// ---------- metronome ----------
let metro = null;
export function startMetronome(opts) {
  stopMetronome();
  const c = audioCtx();
  const m = { ...opts, next: c.currentTime + 0.08, slot: 0, timer: null, listeners: opts.onBeat ? [opts.onBeat] : [] };
  const { beats } = meter(m.meter);
  const sub = m.subdivision || 1;
  const step = () => {
    const spb = 60 / m.bpm;
    while (m.next < c.currentTime + 0.12) {
      const perBar = beats * sub;
      const bar = Math.floor(m.slot / perBar);
      const inBar = m.slot % perBar;
      const beat = Math.floor(inBar / sub);
      const k = inBar % sub;
      const gap = m.gap ? (bar % (m.gap.play + m.gap.mute)) >= m.gap.play : false;
      let level = k === 0 ? (m.accentBeats ? (m.accentBeats.includes(beat) ? 2 : 1) : (beat === 0 && m.accent !== false ? 2 : 1)) : 0;
      let play = !gap;
      if (m.clickOn === '2&4') play = play && k === 0 && beat % 2 === 1;
      if (m.clickOn === '1') play = play && k === 0 && beat === 0;
      if (m.clickOn === '2&4') level = 1;
      // a swung metronome with subdivision 1 still lets you hear the swing: a soft click on the triplet 'let'
      if (play && sub === 1 && m.swing >= 0.5 && m.swingHint !== false) click(m.next + (60 / m.bpm) * swingFrac(m.swing), 0);
      if (play) click(m.next, level);
      const tt = m.next;
      if (k === 0) m.listeners.forEach((fn) => setTimeout(() => fn({ bar, beat, gap }), Math.max(0, (tt - c.currentTime) * 1000)));
      // swing applies to 8th subdivisions: long-short
      let dur = spb / sub;
      if (m.swing && (sub === 2 || sub === 4)) { const offs = slotOffsets(sub, m.swing); dur = spb * ((offs[k + 1] ?? 1) - offs[k]); }
      m.next += dur;
      m.slot++;
    }
  };
  m.timer = setInterval(step, 25);
  step();
  metro = m;
  return m;
}
export function setMetronomeBpm(bpm) { if (metro) metro.bpm = bpm; }
export function stopMetronome() { if (metro) { clearInterval(metro.timer); metro = null; } }
export const metronomeOn = () => !!metro;
export function meter(mtr = '4/4') { const [n, d] = String(mtr).split('/').map(Number); return { beats: n || 4, unit: d || 4 }; }

// ---------- event player ----------
// events: [{beat, dur, notes:[midi], kind:'note'|'strum'|'mute'|'chuck'|'keys'|'click', dir, vel, onStart}]
let player = null;
export function playEvents(events, { bpm = 80, loops = 1, countIn = 0, sound = 'guitar', onEvent, onDone, onCount, clickTrack = false, beatsPerBar = 4, clickAccents = [0], silentPasses = null } = {}) {
  stopPlayer();
  const c = audioCtx();
  const spb = 60 / bpm;
  const total = Math.max(...events.map((e) => e.beat + (e.dur || 1)), 1);
  const length = Math.ceil(total);
  const timers = [];
  let t0 = c.currentTime + 0.12;
  for (let i = 0; i < countIn; i++) {
    click(t0 + i * spb, i === 0 ? 2 : 1);
    if (onCount) { const n = i; timers.push(setTimeout(() => onCount(n + 1, countIn), Math.max(0, (t0 + i * spb - c.currentTime) * 1000))); }
  }
  t0 += countIn * spb;
  const accSet = new Set(clickAccents);
  const p = { timers, stopped: false };
  const schedulePass = (pass, start) => {
    const silent = silentPasses && silentPasses(pass);
    for (const e0 of events) {
      const e = silent ? { ...e0, kind: 'rest', silent: true } : e0;
      const t = start + e.beat * spb;
      const dur = (e.dur || 1) * spb;
      const snd = e.sound || sound;
      if (e.kind === 'strum') strum(e.notes, t, { dir: e.dir || 'D', vel: e.vel ?? 0.8, dur: e.hold ? dur : null, sound: snd });
      else if (e.kind === 'mute') strum(e.notes.length ? e.notes : [52, 57, 62, 67], t, { dir: e.dir || 'D', vel: 0.6, muted: true, spread: 0.006 });
      else if (e.kind === 'chuck') { noiseHit(t, { dur: 0.06, freq: 1800, vel: (e.vel ?? 0.7) * 0.9 }); pluck(45, t, { vel: 0.25, muted: true }); }
      else if (e.kind === 'click') click(t, e.level ?? 1);
      else if (e.kind === 'rest') { /* visual only */ }
      else for (const m of e.notes || []) snd === 'keys' ? keys(m, t, dur * 0.95, e.vel ?? 0.6) : pluck(m, t, { vel: e.vel ?? 0.8, dur: e.legato ? null : Math.max(dur * 1.6, 0.25) });
      if (onEvent) timers.push(setTimeout(() => !p.stopped && onEvent(e, pass), Math.max(0, (t - c.currentTime) * 1000)));
    }
    if (clickTrack || silent) for (let b = 0; b < length; b++) click(start + b * spb, accSet.has(b % beatsPerBar) ? 2 : 1);
  };
  for (let pass = 0; pass < loops; pass++) {
    const start = t0 + pass * length * spb;
    // schedule passes lazily to keep node counts low
    const lead = Math.max(0, (start - c.currentTime - 0.3) * 1000);
    timers.push(setTimeout(() => !p.stopped && schedulePass(pass, start), pass === 0 ? 0 : lead));
  }
  const endT = t0 + loops * length * spb;
  timers.push(setTimeout(() => { if (!p.stopped) { player = null; onDone && onDone(); } }, (endT - c.currentTime) * 1000 + 150));
  player = p;
  return p;
}
// timers that belong to the current screen (ear-quiz playback, silent animations…)
const pending = new Set();
export function later(fn, ms) { const id = setTimeout(() => { pending.delete(id); fn(); }, ms); pending.add(id); return id; }
// stop EVERYTHING: player, metronome, drone, pending timers, and any notes already scheduled
export function hush() {
  stopMetronome();
  if (player) { player.stopped = true; player.timers.forEach(clearTimeout); player = null; }
  pending.forEach(clearTimeout); pending.clear();
  drone = null;
  cutMaster(false);
}
export function stopPlayer() {
  if (!player) return;
  player.stopped = true;
  player.timers.forEach(clearTimeout);
  player = null;
  cutMaster(true);
}
function cutMaster(keepDrone) {
  // silence anything already scheduled by swapping the master bus
  if (master && ctx) {
    const t = ctx.currentTime;
    master.gain.cancelScheduledValues(t);
    master.gain.setValueAtTime(0.0001, t);
    // rebuild master so scheduled sources are cut off
    const old = master, oldG = guitarBus;
    buildBus();
    setTimeout(() => { try { old.disconnect(); oldG.disconnect(); } catch (e) { /* */ } }, 50);
    if (keepDrone && drone) { const d = drone; drone = null; startDrone(d.midi, d.fifth); }
  }
}
export const playing = () => !!player;
// make sure the audio clock is actually running before scheduling (iOS can leave it 'suspended' or 'interrupted')
export async function ensureRunning() {
  const c = audioCtx();
  if (c.state !== 'running') { try { await c.resume(); } catch (e) { /* */ } }
  if (c.state !== 'running') await new Promise((r) => setTimeout(r, 120));
  return c.state === 'running';
}
if (typeof document !== 'undefined') {
  const wake = () => { if (ctx && ctx.state !== 'running' && document.visibilityState === 'visible') ctx.resume().catch(() => {}); };
  document.addEventListener('visibilitychange', wake);
  window.addEventListener('pageshow', wake);
  window.addEventListener('focus', wake);
}
