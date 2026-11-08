// Guitar video player: draws any moment of a timeline (video/README.md) as a 1920x1080 SVG,
// and renders the guitar and click tracks offline with the app's own synth (src/audio.js).
// tools/video/render.mjs drives it frame by frame; opened in a browser it is a live preview.
//   http://localhost:8765/video/player.html?t=/video/out/intervals.json
import * as A from '../src/audio.js';
import { OPEN } from '../src/fretboard.js';
import { prettyIv } from '../src/theory.js';

const W = 1920, H = 1080;
const SR = 48000;
let TL = null;          // the loaded timeline, normalised
let DURATION = 0;

// ---------- timeline ----------
const midiOf = (n) => n.midi ?? OPEN[n.string] + n.fret;
const endOf = (e) => e.until ?? e.t + (e.dur ?? 0);

export function loadTimeline(tl, { sayDurations = {} } = {}) {
  const events = (tl.events || []).map((e, i) => ({ type: e.type || (e.notes ? 'play' : e.say ? 'say' : 'text'), ...e, i }));
  // the plan's shorthand: {t, notes, label} is a play event; {t, say} is narration
  for (const e of events) {
    if (e.type === 'say' && e.say && !e.text) e.text = e.say;
    if (e.type === 'play') { e.dur = e.dur ?? (tl.bpm ? 60 / tl.bpm : 1); e.notes = e.notes.map((n) => ({ at: 0, ...n, midi: midiOf(n) })); }
    if (e.type === 'say') e.dur = sayDurations[e.text] ?? e.dur ?? estimateSpeech(e.text);
  }
  events.sort((a, b) => a.t - b.t || a.i - b.i);
  const plays = events.filter((e) => e.type === 'play');
  const frets = plays.flatMap((e) => e.notes.map((n) => n.fret)).filter((f) => f != null);
  const win = tl.window || autoWindow(frets);
  TL = { fps: 30, ghost: false, ...tl, events, plays, window: win, clicks: [tl.click || []].flat() };
  DURATION = tl.duration ?? Math.max(1, ...events.map(endOf), ...TL.clicks.map((c) => c.to ?? 0)) + (tl.tail ?? 1.5);
  return { duration: DURATION, fps: TL.fps, says: events.filter((e) => e.type === 'say').map((e) => ({ t: e.t, text: e.text, voice: e.voice })) };
}
const estimateSpeech = (s) => 0.4 + String(s).split(/\s+/).length * 0.38;
function autoWindow(frets) {
  if (!frets.length) return { lo: 0, hi: 12 };
  let lo = Math.min(...frets), hi = Math.max(...frets);
  lo = lo <= 2 ? 0 : lo - 1;
  hi = Math.max(hi + 1, lo + 5);
  return { lo, hi };
}

// ---------- drawing ----------
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const ease = (x) => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3);
const fade = (T, e, inS = 0.25) => ease((T - e.t) / inS);

// colour by what the note is in the chord: root, 3rd, 5th, 7th, or a tension
const FAMILY = { r: '#e8553d', t3: '#f2b134', t5: '#4fb3e8', t7: '#a687f0', tx: '#e9dcc0', n: '#d9d6cf' };
function family(label) {
  if (label == null || label === '') return 'n';
  const m = /([0-9]+)/.exec(String(label));
  if (!m) return 'n';
  const d = ((Number(m[1]) - 1) % 7) + 1;
  return { 1: 'r', 3: 't3', 5: 't5', 7: 't7' }[d] || 'tx';
}

const NECK = { x0: 170, x1: 1750, y0: 300, gap: 70, open: 80 };
function neckGeometry(lo, hi) {
  const cells = lo === 0 ? hi : hi - lo + 1;
  const left = NECK.x0 + (lo === 0 ? NECK.open : 0);
  const fw = (NECK.x1 - left) / cells;
  const xWire = (i) => left + i * fw;                              // i-th wire from the left
  const xFret = (f) => (lo === 0 ? (f === 0 ? NECK.x0 + NECK.open / 2 - 6 : left + (f - 0.5) * fw) : left + (f - lo + 0.5) * fw);
  const yStr = (s) => NECK.y0 + (s - 1) * NECK.gap;
  return { cells, left, fw, xWire, xFret, yStr, top: NECK.y0 - 34, bottom: NECK.y0 + 5 * NECK.gap + 34 };
}

function drawNeck(lo, hi) {
  const g = neckGeometry(lo, hi);
  let s = '';
  s += `<rect x="${g.left - (lo === 0 ? 0 : 14)}" y="${g.top}" width="${NECK.x1 - g.left + (lo === 0 ? 0 : 28)}" height="${g.bottom - g.top}" rx="6" fill="url(#wood)"/>`;
  s += `<rect x="${g.left - (lo === 0 ? 0 : 14)}" y="${g.top}" width="${NECK.x1 - g.left + (lo === 0 ? 0 : 28)}" height="${g.bottom - g.top}" rx="6" fill="url(#woodShade)"/>`;
  s += `<rect x="${g.left - (lo === 0 ? 0 : 14)}" y="${g.top}" width="${NECK.x1 - g.left + (lo === 0 ? 0 : 28)}" height="${g.bottom - g.top}" rx="6" fill="url(#grain)"/>`;
  // inlays
  const inlay = (f, y) => `<circle cx="${g.xFret(f)}" cy="${y}" r="13" fill="url(#pearl)" opacity="0.9"/>`;
  for (let f = Math.max(1, lo); f <= hi; f++) {
    if ([3, 5, 7, 9, 15, 17, 19, 21].includes(f)) s += inlay(f, g.yStr(3.5));
    if (f === 12 || f === 24) s += inlay(f, g.yStr(2)) + inlay(f, g.yStr(5));
  }
  // frets (nut when the window starts at 0)
  for (let i = 0; i <= g.cells; i++) {
    const x = g.xWire(i);
    if (i === 0 && lo === 0) s += `<rect x="${x - 9}" y="${g.top}" width="14" height="${g.bottom - g.top}" fill="#efe8d6"/>`;
    else s += `<rect x="${x - 4}" y="${g.top}" width="8" height="${g.bottom - g.top}" fill="url(#nickel)"/>`;
  }
  // strings, wound ones thicker
  const thick = { 1: 2.2, 2: 2.8, 3: 3.6, 4: 4.6, 5: 5.6, 6: 6.8 };
  for (let st = 1; st <= 6; st++) {
    const y = g.yStr(st);
    s += `<rect x="${lo === 0 ? NECK.x0 : g.left - 14}" y="${y - thick[st] / 2}" width="${NECK.x1 - (lo === 0 ? NECK.x0 : g.left - 14) + (lo === 0 ? 0 : 14)}" height="${thick[st]}" fill="${st <= 2 ? '#d8dade' : '#c9a86a'}" opacity="0.95"/>`;
    s += `<rect x="${lo === 0 ? NECK.x0 : g.left - 14}" y="${y - thick[st] / 2}" width="${NECK.x1 - (lo === 0 ? NECK.x0 : g.left - 14) + (lo === 0 ? 0 : 14)}" height="${thick[st] * 0.35}" fill="#fff" opacity="0.35"/>`;
  }
  // fret numbers
  const shown = lo === 0 ? [...Array(hi + 1).keys()] : [...Array(hi - lo + 1).keys()].map((k) => lo + k);
  for (const f of shown) {
    if (lo === 0 && f === 0) continue;
    const marked = [3, 5, 7, 9, 12, 15, 17, 19, 21].includes(f);
    s += `<text x="${g.xFret(f)}" y="${g.bottom + 44}" text-anchor="middle" font-size="26" font-weight="${marked ? 600 : 400}" fill="${marked ? '#cfcac0' : '#6d6f76'}">${f}</text>`;
  }
  return { svg: s, g };
}

// dot = {string, fret, label, finger, state: 'on'|'lit'|'ghost', attack}
function drawDot(g, d, T) {
  const cx = g.xFret(d.fret), cy = g.yStr(d.string);
  const fam = family(d.label);
  const col = d.color || FAMILY[fam];
  const darkText = fam === 'tx' || fam === 't3' || fam === 'n';
  const R = 29;
  let s = '';
  if (d.state === 'ghost') {
    return `<circle cx="${cx}" cy="${cy}" r="${R - 2}" fill="none" stroke="${col}" stroke-width="3" stroke-dasharray="7 6" opacity="0.55"/>` +
      (d.label ? `<text x="${cx}" y="${cy + 9}" text-anchor="middle" font-size="25" font-weight="600" fill="${col}" opacity="0.55">${esc(prettyIv(d.label))}</text>` : '');
  }
  if (d.state === 'lit' && d.attack != null) {
    const k = (T - d.attack) / 0.55;
    if (k >= 0 && k < 1) s += `<circle cx="${cx}" cy="${cy}" r="${R + 6 + 34 * ease(k)}" fill="none" stroke="${col}" stroke-width="${6 * (1 - k)}" opacity="${0.9 * (1 - k)}"/>`;
    s += `<circle cx="${cx}" cy="${cy}" r="${R + 10}" fill="${col}" opacity="0.28" filter="url(#glow)"/>`;
  }
  const dim = d.state === 'on' && d.dimmed ? 0.45 : 1;
  s += `<g opacity="${dim * (d.opacity ?? 1)}"><circle cx="${cx}" cy="${cy + 3}" r="${R}" fill="#000" opacity="0.35"/>` +
    `<circle cx="${cx}" cy="${cy}" r="${R}" fill="${col}" stroke="#101114" stroke-width="2.5"/>`;
  if (d.label != null && d.label !== '') s += `<text x="${cx}" y="${cy + 9}" text-anchor="middle" font-size="${String(d.label).length > 2 ? 22 : 27}" font-weight="700" fill="${darkText ? '#1b1a17' : '#fff'}">${esc(prettyIv(d.label))}</text>`;
  // finger: a small dark tag beside the dot, so it never reads as the interval
  if (d.finger) s += `<rect x="${cx + R + 6}" y="${cy - 15}" width="30" height="30" rx="8" fill="#101114" stroke="#5c5f67" stroke-width="2"/><text x="${cx + R + 21}" y="${cy + 7}" text-anchor="middle" font-size="20" font-weight="700" fill="#ecebe7">${esc(d.finger)}</text>`;
  return s + '</g>';
}

const DEFS = `<defs>
  <linearGradient id="wood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a2618"/><stop offset="0.5" stop-color="#4a3020"/><stop offset="1" stop-color="#33210f"/></linearGradient>
  <pattern id="grain" width="400" height="12" patternUnits="userSpaceOnUse"><rect width="400" height="12" fill="none"/><path d="M0 3 Q100 1 200 4 T400 3" stroke="#000" stroke-opacity="0.12" fill="none"/><path d="M0 9 Q120 11 220 8 T400 9" stroke="#fff" stroke-opacity="0.04" fill="none"/></pattern>
  <linearGradient id="woodShade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0.35"/><stop offset="0.12" stop-color="#000" stop-opacity="0"/><stop offset="0.88" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.4"/></linearGradient>
  <linearGradient id="nickel" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7d8086"/><stop offset="0.45" stop-color="#e9ebee"/><stop offset="1" stop-color="#6c6f75"/></linearGradient>
  <radialGradient id="pearl" cx="0.4" cy="0.35" r="0.7"><stop offset="0" stop-color="#fbf7ee"/><stop offset="0.6" stop-color="#d9d2c4"/><stop offset="1" stop-color="#a8a194"/></radialGradient>
  <filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="10"/></filter>
  <radialGradient id="vignette" cx="0.5" cy="0.45" r="0.75"><stop offset="0.6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.55"/></radialGradient>
</defs>`;

const active = (T, type) => TL.events.filter((e) => e.type === type && e.t <= T && T < endOf(e));
const lastActive = (T, type, pred = () => true) => { const a = active(T, type).filter(pred); return a[a.length - 1]; };

// everything visible at time T, as one SVG string (so the renderer can skip identical frames)
export function frameAt(T) {
  if (!TL) return '';
  let s = DEFS + `<rect width="${W}" height="${H}" fill="#101114"/><rect width="${W}" height="${H}" fill="url(#vignette)"/>`;

  // neck: an explicit neck event, else the sounding notes of play events
  const neck = lastActive(T, 'neck');
  const sounding = TL.plays.filter((e) => e.t <= T && T < e.t + e.dur && !e.hidden);
  const showNeck = neck ? !neck.hidden : (TL.autoNeck !== false && TL.plays.length > 0);
  if (showNeck) {
    const lo = neck?.lo ?? TL.window.lo, hi = neck?.hi ?? TL.window.hi;
    const { svg, g } = drawNeck(lo, hi);
    const op = neck ? fade(T, neck, 0.3) : 1;
    s += `<g opacity="${neck && neck.fadeIn === false ? 1 : op}">` + svg;
    const dots = new Map();
    const put = (d) => dots.set(`${d.string}:${d.fret}`, { ...(dots.get(`${d.string}:${d.fret}`) || {}), ...d });
    if (neck) for (const d of neck.dots || []) put({ ...d, state: 'on' });
    if (!neck || neck.lightPlayed !== false) {
      for (const e of sounding) for (const n of e.notes) {
        if (n.fret == null || T < e.t + n.at) continue;
        put({ string: n.string, fret: n.fret, label: n.label, finger: n.finger, state: 'lit', attack: e.t + n.at });
      }
    }
    if (TL.ghost && !neck) {
      const next = TL.plays.find((e) => e.t > T && !e.hidden);
      if (next && next.t - T < (TL.ghostAhead ?? 1.5)) for (const n of next.notes) if (!dots.has(`${n.string}:${n.fret}`)) put({ string: n.string, fret: n.fret, label: n.label, state: 'ghost' });
    }
    for (const d of [...dots.values()].sort((a, b) => (a.state === 'ghost') - (b.state === 'ghost')).reverse()) s += drawDot(g, d, T);
    if ([...dots.values()].some((d) => d.finger && d.state !== 'ghost')) {
      const x = 90, y = H - 60;
      s += `<circle cx="${x + 12}" cy="${y - 8}" r="13" fill="#e8553d"/><text x="${x + 12}" y="${y - 1}" text-anchor="middle" font-size="15" font-weight="700" fill="#fff">1</text>` +
        `<text x="${x + 34}" y="${y}" font-size="22" fill="#8a8c93">interval</text>` +
        `<rect x="${x + 130}" y="${y - 22}" width="26" height="26" rx="7" fill="#101114" stroke="#5c5f67" stroke-width="2"/><text x="${x + 143}" y="${y - 2}" text-anchor="middle" font-size="16" font-weight="700" fill="#ecebe7">1</text>` +
        `<text x="${x + 166}" y="${y}" font-size="22" fill="#8a8c93">finger</text>`;
    }
    s += '</g>';
  }

  // text slots: the latest active text event per slot wins; a sounding note's label fills "big" if it is free
  const slot = (name) => lastActive(T, 'text', (e) => (e.slot || 'big') === name);
  const labelNow = [...sounding].reverse().find((e) => e.label);
  const STY = {
    title: { x: 90, y: 110, size: 46, weight: 600, fill: '#ecebe7', anchor: 'start' },
    corner: { x: W - 90, y: 110, size: 34, weight: 500, fill: '#8a8c93', anchor: 'end' },
    big: { x: W / 2, y: showNeck ? 860 : 520, size: showNeck ? 78 : 104, weight: 700, fill: '#ecebe7', anchor: 'middle' },
    sub: { x: W / 2, y: showNeck ? 930 : 610, size: 38, weight: 400, fill: '#a9aab0', anchor: 'middle' },
    caption: { x: W / 2, y: 220, size: 36, weight: 500, fill: '#8a8c93', anchor: 'middle' },
  };
  for (const name of Object.keys(STY)) {
    let e = slot(name);
    if (!e && name === 'big' && labelNow) e = { t: labelNow.t, text: labelNow.label, style: 'label' };
    if (!e) continue;
    const st = STY[name];
    const col = e.style === 'answer' ? '#f2b134' : e.color || st.fill;
    const op = e.fadeIn === false ? 1 : fade(T, e);
    const rise = e.style === 'answer' ? (1 - op) * 18 : 0;
    s += `<text x="${st.x}" y="${st.y + rise}" text-anchor="${st.anchor}" font-size="${e.size || st.size}" font-weight="${st.weight}" fill="${col}" opacity="${op}">${esc(e.text)}</text>`;
  }

  // thinking timer: a bar that drains through the silent gap
  const timer = lastActive(T, 'timer');
  if (timer) {
    const k = (T - timer.t) / (endOf(timer) - timer.t);
    const bw = 1100, bx = (W - bw) / 2, by = showNeck ? 985 : 760;
    s += `<rect x="${bx}" y="${by}" width="${bw}" height="14" rx="7" fill="#26282e"/>`;
    s += `<rect x="${bx}" y="${by}" width="${bw * (1 - k)}" height="14" rx="7" fill="#f2b134"/>`;
    if (timer.text) s += `<text x="${W / 2}" y="${by - 26}" text-anchor="middle" font-size="34" font-weight="500" fill="#cfcac0">${esc(timer.text)}</text>`;
  }

  // beat pulse while a click is running
  const click = TL.clicks.find((c) => T >= (c.from ?? 0) && T < (c.to ?? DURATION));
  if (click) {
    const spb = 60 / click.bpm, bpb = click.beatsPerBar || 4;
    const n = Math.floor((T - (click.from ?? 0)) / spb + 1e-6);
    const since = T - (click.from ?? 0) - n * spb;
    const x0 = W - 90 - (bpb - 1) * 44;
    for (let b = 0; b < bpb; b++) {
      const on = b === n % bpb;
      const k = on ? Math.max(0, 1 - since / (spb * 0.7)) : 0;
      s += `<circle cx="${x0 + b * 44}" cy="${H - 70}" r="${13 + 5 * k}" fill="${b === 0 ? '#e8553d' : '#ecebe7'}" opacity="${0.18 + 0.82 * k}"/>`;
    }
    s += `<text x="${x0 - 36}" y="${H - 60}" text-anchor="end" font-size="30" font-weight="600" fill="#8a8c93">${click.bpm} BPM</text>`;
  }
  return s;
}

const $stage = document.getElementById('stage');
export function renderAt(T) { const svg = frameAt(T); $stage.innerHTML = svg; return svg; }

// ---------- audio ----------
function scheduleGuitar(offset = 0) {
  for (const e of TL.plays) {
    if (e.silent) continue;
    for (const n of e.notes) {
      const t = e.t + n.at + offset;
      const ring = e.ring ?? Math.max(0.3, e.dur - n.at);
      A.pluck(n.midi, t, { vel: n.vel ?? e.vel ?? 0.8, dur: ring, muted: !!n.muted });
    }
  }
}
function scheduleClick(offset = 0) {
  for (const c of TL.clicks) {
    const spb = 60 / c.bpm, bpb = c.beatsPerBar || 4;
    const from = c.from ?? 0, to = c.to ?? DURATION;
    for (let k = 0; from + k * spb < to - 1e-6; k++) A.click(from + k * spb + offset, k % bpb === 0 && c.accent !== false ? 2 : 1);
  }
}
// render one stem offline with the app's synth; kept in the page so the driver can pull it in chunks
const stems = {};
export async function renderStem(name) {
  const len = Math.ceil((DURATION + 0.25) * SR);
  const oc = new OfflineAudioContext(2, len, SR);
  const prev = A.useContext(oc);
  try {
    if (name === 'guitar') scheduleGuitar(); else if (name === 'click') scheduleClick(); else throw new Error('unknown stem ' + name);
    stems[name] = await oc.startRendering();
  } finally { A.useContext(prev); }
  const b = stems[name];
  let peak = 0;
  for (let ch = 0; ch < b.numberOfChannels; ch++) { const d = b.getChannelData(ch); for (let i = 0; i < d.length; i++) peak = Math.max(peak, Math.abs(d[i])); }
  return { length: b.length, sampleRate: b.sampleRate, channels: b.numberOfChannels, peak };
}
// base64 of a Float32 slice of one channel (little-endian, which every browser we run on is)
export function stemChunk(name, ch, start, n) {
  const d = stems[name].getChannelData(ch).subarray(start, start + n);
  const bytes = new Uint8Array(d.buffer, d.byteOffset, d.byteLength);
  let bin = '';
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
  return btoa(bin);
}

Object.assign(window, { loadTimeline, renderAt, frameAt, renderStem, stemChunk });

// ---------- live preview ----------
const params = new URLSearchParams(location.search);
if (params.has('render')) document.body.classList.add('render');
else initPreview();

async function initPreview() {
  const $play = document.getElementById('play'), $scrub = document.getElementById('scrub'), $time = document.getElementById('time'), $msg = document.getElementById('msg');
  const src = params.get('t');
  if (!src) { $msg.textContent = 'Add ?t=/video/out/<name>.json to the URL (make one with tools/video/audiation.mjs).'; return; }
  let tl;
  try { tl = await (await fetch(src)).json(); } catch (e) { $msg.textContent = `Could not load ${src}: ${e.message}`; return; }
  const info = loadTimeline(tl);
  $scrub.max = info.duration;
  let ctx = null, srcNode = null, startedAt = 0, pos = 0, buffers = null, said = new Set();
  const show = (T) => { renderAt(T); $time.textContent = `${T.toFixed(1)} / ${info.duration.toFixed(1)}`; $scrub.value = T; };
  show(0);
  const stop = () => { if (srcNode) { srcNode.stop(); srcNode = null; } speechSynthesis?.cancel(); $play.textContent = 'Play'; };
  const loop = () => {
    if (!srcNode) return;
    const T = ctx.currentTime - startedAt;
    if (T >= info.duration) { stop(); pos = 0; show(0); return; }
    // narration in the preview uses the browser's voice; the real render uses the voice track
    for (const s of info.says) if (s.t <= T && T - s.t < 0.3 && !said.has(s.t)) { said.add(s.t); try { speechSynthesis.speak(new SpeechSynthesisUtterance(s.text)); } catch (e) { /* no speech */ } }
    show(T);
    requestAnimationFrame(loop);
  };
  $play.onclick = async () => {
    if (srcNode) { pos = ctx.currentTime - startedAt; stop(); return; }
    if (!buffers) {
      $msg.textContent = 'Rendering audio…';
      await renderStem('guitar'); await renderStem('click');
      buffers = [stems.guitar, stems.click];
      $msg.textContent = '';
    }
    ctx = ctx || new AudioContext();
    await ctx.resume();
    const mix = ctx.createBuffer(2, buffers[0].length, SR);
    for (let ch = 0; ch < 2; ch++) { const out = mix.getChannelData(ch); const g = buffers[0].getChannelData(ch), c = buffers[1].getChannelData(ch); for (let i = 0; i < out.length; i++) out[i] = g[i] + 0.5 * c[i]; }
    srcNode = ctx.createBufferSource(); srcNode.buffer = mix; srcNode.connect(ctx.destination);
    srcNode.start(0, pos); startedAt = ctx.currentTime - pos;
    said = new Set(info.says.filter((s) => s.t < pos).map((s) => s.t));
    $play.textContent = 'Pause';
    requestAnimationFrame(loop);
  };
  $scrub.oninput = () => { const T = Number($scrub.value); if (srcNode) stop(); pos = T; show(T); };
}
