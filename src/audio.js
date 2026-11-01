import { swingFrac, slotOffsets } from './rhythm.js';
export { swingFrac };
// Web Audio engine: Karplus-Strong guitar, soft keys, metronome, drone, event player.
let ctx = null;
let master = null;
const pluckCache = new Map();

export function audioCtx() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    ctx = new AC({ latencyHint: 'interactive' });
    master = ctx.createGain();
    master.gain.value = 0.9;
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -14; comp.ratio.value = 4;
    master.connect(comp).connect(ctx.destination);
  }
  return ctx;
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
  const len = Math.floor(sr * (muted ? 0.18 : 2.2));
  const buf = c.createBuffer(1, len, sr);
  const d = buf.getChannelData(0);
  const f = hz(midi);
  const N = Math.max(2, Math.round(sr / f));
  const ring = new Float32Array(N);
  let last = 0;
  for (let i = 0; i < N; i++) { const r = Math.random() * 2 - 1; last = last * 0.55 + r * 0.45; ring[i] = last; }
  const decay = muted ? 0.9 : 0.996 - Math.max(0, (midi - 64)) * 0.00025;
  let idx = 0;
  for (let i = 0; i < len; i++) {
    const nxt = (idx + 1) % N;
    const v = (ring[idx] + ring[nxt]) * 0.5 * decay;
    d[i] = ring[idx];
    ring[idx] = v;
    idx = nxt;
  }
  // gentle fade-out
  for (let i = Math.max(0, len - 2000); i < len; i++) d[i] *= (len - i) / 2000;
  pluckCache.set(key, buf);
  return buf;
}

export function pluck(midi, t, { vel = 0.8, muted = false, dur = null, dest = null } = {}) {
  const c = audioCtx();
  const s = c.createBufferSource();
  s.buffer = ksBuffer(midi, muted);
  const g = c.createGain();
  g.gain.value = vel * 0.55;
  const lp = c.createBiquadFilter();
  lp.type = 'lowpass'; lp.frequency.value = muted ? 1800 : 5200;
  s.connect(lp).connect(g).connect(dest || master);
  s.start(t);
  if (dur) { g.gain.setValueAtTime(vel * 0.55, t + dur); g.gain.linearRampToValueAtTime(0.0001, t + dur + 0.08); s.stop(t + dur + 0.1); }
  return s;
}

export function keys(midi, t, dur = 1, vel = 0.6) {
  const c = audioCtx();
  const f = hz(midi);
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vel * 0.22, t + 0.012);
  g.gain.exponentialRampToValueAtTime(vel * 0.09, t + 0.35);
  g.gain.setValueAtTime(vel * 0.09, t + Math.max(0.36, dur));
  g.gain.exponentialRampToValueAtTime(0.0001, t + Math.max(0.36, dur) + 0.35);
  const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2400 + 6 * f;
  g.connect(lp).connect(master);
  const partials = [[1, 1], [2, 0.35], [3, 0.12], [4, 0.06]];
  for (const [mult, amp] of partials) {
    const o = c.createOscillator();
    o.type = mult === 1 ? 'triangle' : 'sine';
    o.frequency.value = f * mult;
    const og = c.createGain(); og.gain.value = amp;
    o.connect(og).connect(g);
    o.start(t); o.stop(t + Math.max(0.36, dur) + 0.4);
  }
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

export function click(t, level = 1) {
  // level 2 = bar accent, 1 = beat, 0 = subdivision
  const c = audioCtx();
  const o = c.createOscillator();
  const g = c.createGain();
  o.frequency.value = level === 2 ? 1760 : level === 1 ? 1180 : 820;
  const v = level === 2 ? 0.5 : level === 1 ? 0.34 : 0.16;
  g.gain.setValueAtTime(v, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.04);
  o.connect(g).connect(master);
  o.start(t); o.stop(t + 0.05);
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
  out.gain.exponentialRampToValueAtTime(0.16, c.currentTime + 0.8);
  const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 900;
  out.connect(lp).connect(master);
  const notes = [midi, midi + 12].concat(fifth ? [midi + 7] : []);
  const oscs = [];
  for (const m of notes) {
    for (const det of [-4, 4]) {
      const o = c.createOscillator(); o.type = 'sawtooth'; o.frequency.value = hz(m); o.detune.value = det;
      const g = c.createGain(); g.gain.value = m === midi ? 0.32 : 0.16;
      o.connect(g).connect(out); o.start(); oscs.push(o);
    }
  }
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
    const old = master;
    master = ctx.createGain(); master.gain.value = 0.9;
    const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -14; comp.ratio.value = 4;
    master.connect(comp).connect(ctx.destination);
    setTimeout(() => { try { old.disconnect(); } catch (e) { /* */ } }, 50);
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
