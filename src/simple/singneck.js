// Sing on the neck: a first note appears on the neck and sounds; the next notes appear, labelled by interval (from the
// first note) or by name, and stay silent. Sing them, play them, then Check plays the lot so you can hear if you were
// right. Anywhere on the neck or inside one CAGED area; any interval (chromatic) or only a scale's notes.
import * as T from '../theory.js';
import * as F from '../fretboard.js';
import * as A from '../audio.js';
import { esc } from '../fundamentals/core.js';
import { TIERS, TIER_NAMES, scaleName, formula } from '../fundamentals/scaledata.js';
import * as N from './neck.js';

const CHROM = ['1', 'b2', '2', 'b3', '3', '4', 'b5', '5', 'b6', '6', 'b7', '7'];
const NAMES = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
const SHAPES = ['C', 'A', 'G', 'E', 'D'];
const pick = (a) => a[Math.floor(Math.random() * a.length)];
// how the answer plays: the notes in turn, together (each note sounded with the first), or in turn then together;
// and how fast. Shared with the Degrees page (sing.js).
export const PLAYS = [['seq', 'In turn'], ['uni', 'Together'], ['both', 'In turn, then together']];
export const SPEEDS = [['normal', 'Normal', 0.6], ['slow', 'Slow', 1.0], ['vslow', 'Very slow', 1.6]];
export const gapOf = (sp) => (SPEEDS.find(([v]) => v === sp) || SPEEDS[0])[2];
const cycle = (list, cur) => list[(list.findIndex(([v]) => v === cur) + 1) % list.length][0];
export const nextSpeed = (cur) => cycle(SPEEDS, cur);
export const speedName = (cur) => (SPEEDS.find(([v]) => v === cur) || SPEEDS[0])[1];
const semis = (iv) => T.intervalSemis(iv) % 12;

// the scale's notes as intervals from the root (chromatic: all twelve)
function ivSet(scale) {
  if (scale === 'chromatic') return CHROM;
  const s = T.getScale(scale);
  return s.labels || s.ivs;
}
// the root name that spells the scale most cleanly
function spellRoot(pc, scale) {
  const opts = [NAMES[pc], T.noteName(T.enharmonic(T.parseNote(NAMES[pc])))].filter((x, i, a) => a.indexOf(x) === i);
  let best = opts[0], cost = Infinity;
  for (const nm of opts) {
    const r = T.parseNote(nm);
    const c = ivSet(scale).reduce((s, iv) => { const n = T.transpose(r, iv); return s + Math.abs(n.acc) * (Math.abs(n.acc) > 1 ? 4 : 1); }, 0) + (nm.length > 1 ? 0.5 : 0);
    if (c < cost) { cost = c; best = nm; }
  }
  return T.parseNote(best);
}

export function makeLine(st) {
  const ivs = ivSet(st.scale);
  const bySemi = new Map(ivs.map((iv) => [semis(iv), iv]));
  for (let tries = 0; tries < 50; tries++) {
    const pc = Math.floor(Math.random() * 12);
    const root = spellRoot(pc, st.scale);
    // the area: the whole neck, or one CAGED area of this root
    let win = null, shape = null;
    if (st.area === 'caged') {
      const ok = SHAPES.map((sh) => ({ sh, w: F.cagedWindow(root, sh) })).filter(({ w }) => w.hi <= N.NF);
      if (!ok.length) continue;
      ({ sh: shape, w: win } = pick(ok));
      win = { lo: Math.max(0, win.lo), hi: win.hi };
    }
    const lo = win ? win.lo : 0, hi = win ? win.hi : N.NF;
    const spots = [];
    for (let s = 1; s <= 6; s++) for (let f = lo; f <= hi; f++) spots.push({ string: s, fret: f, midi: F.midiAt(s, f) });
    const roots = spots.filter((p) => p.midi % 12 === pc && (st.area === 'caged' || p.string >= 2));
    if (!roots.length) continue;
    const first = pick(roots);
    const line = [{ ...first, iv: '1', semi: 0 }];
    let ok = true;
    while (line.length < st.len) {
      const prev = line[line.length - 1];
      // a sung leap of up to an octave, within an octave of the first note, never the same pitch twice running
      const pitches = [...new Set(spots.map((p) => p.midi))].filter((m) => bySemi.has(((m - first.midi) % 12 + 12) % 12) && m !== prev.midi && Math.abs(m - prev.midi) <= 12 && Math.abs(m - first.midi) <= 12);
      if (!pitches.length) { ok = false; break; }
      const fresh = pitches.filter((x) => !line.some((n) => n.midi === x));
      const m = pick(fresh.length && Math.random() < 0.85 ? fresh : pitches);
      // where a player would take it: the spot nearest the last fret
      const at = spots.filter((p) => p.midi === m).sort((a, b) => Math.abs(a.fret - prev.fret) - Math.abs(b.fret - prev.fret) || Math.random() - 0.5)[0];
      const semi = m - first.midi;
      line.push({ ...at, iv: bySemi.get(((semi % 12) + 12) % 12), semi });
    }
    if (!ok) continue;
    // a scale keeps its own spelling; any interval gets the plainest name (G♭ not F𝄪, E not F♭)
    const plain = (n) => (Math.abs(n.acc) > 1 || ['Cb', 'Fb', 'E#', 'B#'].includes(T.noteName(n)) ? T.enharmonic(n) : n);
    for (const n of line) n.note = st.scale === 'chromatic' ? plain(T.transpose(root, n.iv)) : T.transpose(root, n.iv);
    return { root, pc, win, shape, line };
  }
  return null;
}

// the label for a note: its interval from the first note (8 for the octave above, ↓ for below the first note) or its name
function ivLabel(n) { return n.semi === 12 ? '8' : n.semi === -12 ? '8↓' : T.prettyIv(n.iv) + (n.semi < 0 ? '↓' : ''); }
const noteLabel = (n) => T.noteName(n.note, true);

// find: the other way round. The first note shows and the line plays unseen; tap its notes on the neck in order.
export function mountSingNeck(root, S, save, { upright, onPage, find = false }) {
  S.singNeck = Object.assign({ area: 'neck', labels: 'iv', len: 2, scale: 'chromatic', drone: false, play: 'both', speed: 'normal', sustain: false }, S.singNeck || {});
  const st = S.singNeck;
  let q = makeLine(st), checked = false, droning = false;
  let k = 1, misses = 0, bad = null; // Find it: the next note to find, wrong taps, the last wrong spot
  const box = root.querySelector('.neckbox'), panel = root.querySelector('.panel');
  const lab = (n, other = false) => ((st.labels === 'iv') !== other ? ivLabel(n) : noteLabel(n));
  const drone = () => { if (st.drone) { A.unlockAudio(); A.startDrone(40 + ((q.pc - 4 + 12) % 12), false); droning = true; } else { A.stopDrone(); droning = false; } };
  const playFirst = () => { A.unlockAudio(); A.pluck(q.line[0].midi, A.audioCtx().currentTime + 0.05, { vel: 0.85, dur: st.sustain ? null : 1.4, long: st.sustain }); };
  // in turn, together, or both. Together: two notes sound at once; a longer line plays each note against the first
  const playAll = () => {
    A.unlockAudio();
    const gap = gapOf(st.speed), ring = st.sustain ? null : gap * 1.15, long = st.sustain; // Sustain: every note rings out
    let t = A.audioCtx().currentTime + 0.05;
    if (st.play !== 'uni') { q.line.forEach((n, i) => A.pluck(n.midi, t + i * gap, { vel: 0.85, dur: ring, long })); t += q.line.length * gap + gap * (st.sustain ? 1.6 : 0.6); }
    if (st.play === 'seq') return;
    const [first, ...rest] = q.line;
    rest.forEach((n, i) => A.strum([first.midi, n.midi].sort((a, b) => a - b), t + i * gap * 2, { spread: 0.02, vel: 0.72, dur: st.sustain ? null : gap * 1.8, long }));
  };
  const opt = (v, l, cur) => `<option value="${esc(v)}" ${String(cur) === String(v) ? 'selected' : ''}>${esc(l)}</option>`;
  const done = () => k >= q.line.length;
  const shown = (i) => !find || i === 0 || i < k || checked;
  const render = () => {
    const dots = q.line.map((n, i) => ({ string: n.string, fret: n.fret, cls: i === 0 ? 'r' : find ? (i < k ? 'ok' : 's') : checked ? 's' : 'x', ring: i === 0, label: lab(n), tag: q.line.length > 2 ? i + 1 : null, i })).filter((d) => shown(d.i));
    if (find && bad) dots.push({ ...bad, cls: 'bad', label: '✕' });
    box.innerHTML = (upright() ? N.neckUpright : N.neckAcross)({ win: q.win, dots, tap: find && !done() && !checked });
    panel.innerHTML = `
      <div class="seg sub three"><button data-page="deg">Degrees</button><button data-page="neck" class="${find ? '' : 'on'}">Sing it</button><button data-page="find" class="${find ? 'on' : ''}">Find it</button></div>
      <div class="cap"><b>${q.shape ? `${esc(q.shape)} shape, frets ${q.win.lo}–${q.win.hi}` : 'Anywhere on the neck'}</b><span>${st.scale === 'chromatic' ? 'any interval' : esc(scaleName(st.scale))}</span></div>
      <div class="nline">${q.line.map((n, i) => `<div class="${i === 0 ? 'first' : ''}${find && i > 0 && i < k ? ' got' : ''}"><b>${shown(i) ? esc(lab(n)) : '?'}</b>${(find ? shown(i) && i > 0 : checked) ? `<span>${esc(lab(n, true))}</span>` : ''}</div>`).join('')}</div>
      ${find ? `<div class="nscore">${done() ? `<b class="good">✓ All ${q.line.length - 1} found</b>` : checked ? 'Answer shown' : `Tap note ${k + 1} of ${q.line.length}`}${misses ? ` · ${misses} miss${misses > 1 ? 'es' : ''}` : ''}</div>
      <div class="row big"><button id="nCheck">▶ Play it</button></div>
      <div class="row"><button id="nNext" class="wide">Next ▶</button></div>
      <div class="row toggles"><button id="nShow" class="${checked ? 'on' : ''}">Answer</button><button id="nDrone" class="${st.drone ? 'on' : ''}">Drone</button></div>`
      : `<div class="row big"><button id="nCheck" class="${checked ? 'on' : ''}">${checked ? '▶ Again' : '▶ Check'}</button></div>
      <div class="row"><button id="nNext" class="wide">Next ▶</button></div>
      <div class="row toggles"><button id="nFirst">▶ First</button><button id="nDrone" class="${st.drone ? 'on' : ''}">Drone</button></div>`}
      <div class="row toggles"><button id="nPlay">Play: ${esc((PLAYS.find(([v]) => v === st.play) || PLAYS[2])[1].toLowerCase())}</button><button id="nSpeed">Speed: ${esc(speedName(st.speed).toLowerCase())}</button><button id="nSus" class="${st.sustain ? 'on' : ''}" aria-pressed="${st.sustain}">Sustain</button></div>
      <div class="menus">
        <label><span>Area</span><select id="nArea">${[['neck', 'Whole neck'], ['caged', 'One CAGED shape']].map(([v, l]) => opt(v, l, st.area)).join('')}</select></label>
        <label><span>Show</span><select id="nLab">${[['iv', 'Intervals'], ['note', 'Note names']].map(([v, l]) => opt(v, l, st.labels)).join('')}</select></label>
        <label><span>Notes</span><select id="nLen">${[[2, '2: one interval'], [3, '3 notes'], [4, '4 notes'], [5, '5 notes'], [6, '6 notes']].map(([v, l]) => opt(v, l, st.len)).join('')}</select></label>
        <label><span>Scale</span><select id="nScale">${opt('chromatic', 'Chromatic (any)', st.scale)}${['core', 'jazz'].map((t) => `<optgroup label="${TIER_NAMES[t]}">${TIERS[t].map((id) => opt(id, scaleName(id), st.scale)).join('')}</optgroup>`).join('')}</select></label>
      </div>
      <div class="nform">${st.scale === 'chromatic' ? 'All 12 intervals' : esc(formula(st.scale))}</div>
      <p class="nhelp">${find ? 'The first note shows; then the line plays. Tap its notes on the neck in order (the same pitch anywhere counts). Wrong taps sound too, so you can hear the difference.' : `The first note sounds. Sing the rest from it, then play them; Check plays them all.${st.labels === 'iv' ? ' Intervals are from the first note; ↓ means below it.' : ''}`}</p>`;
    const $ = (id) => panel.querySelector('#' + id);
    panel.querySelectorAll('[data-page]').forEach((b) => (b.onclick = () => onPage(b.dataset.page)));
    $('nCheck').onclick = () => { if (!find) { checked = true; render(); } playAll(); };
    $('nNext').onclick = () => next();
    if (find) $('nShow').onclick = () => { checked = !checked; render(); };
    else $('nFirst').onclick = () => playFirst();
    $('nDrone').onclick = () => { st.drone = !st.drone; save(); drone(); render(); };
    $('nPlay').onclick = () => { st.play = cycle(PLAYS, st.play); save(); render(); playAll(); }; // hear the new way at once
    $('nSpeed').onclick = () => { st.speed = nextSpeed(st.speed); save(); render(); playAll(); };
    $('nSus').onclick = () => { st.sustain = !st.sustain; save(); render(); playAll(); };
    const set = (id, k, num) => { $(id).onchange = (e) => { st[k] = num ? Number(e.target.value) : e.target.value; save(); next(); }; };
    set('nArea', 'area'); set('nLab', 'labels'); set('nLen', 'len', true); set('nScale', 'scale');
  };
  const next = () => { q = makeLine(st); checked = false; k = 1; misses = 0; bad = null; render(); if (st.drone) drone(); if (find) playAll(); else playFirst(); };
  // Find it: a tap on the neck sounds that note; the right pitch (on any string) counts
  box.onclick = (e) => {
    const h = e.target.closest('.hit');
    if (!find || !h || done() || checked) return;
    const s = Number(h.dataset.s), f = Number(h.dataset.f), m = F.midiAt(s, f);
    A.unlockAudio(); A.pluck(m, A.audioCtx().currentTime + 0.02, { vel: 0.85, dur: 0.8 });
    if (m === q.line[k].midi) { q.line[k] = { ...q.line[k], string: s, fret: f }; k++; bad = null; if (done()) setTimeout(playAll, 700); }
    else { misses++; bad = { string: s, fret: f }; }
    render();
  };
  render();
  return {
    render,
    wake: () => { if (st.drone && !droning) drone(); },
    leave: () => { A.stopDrone(); droning = false; },
  };
}
