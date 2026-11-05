// Disco mode: move between chords (chord mode) or modes (mode mode) in a key, inside one CAGED position, on a click.
// Levels are the palette tiers (diatonic → secondary dominants → … → chromatic colours); you set the tempo.
import * as T from './theory.js';
import * as F from './fretboard.js';
import * as A from './audio.js';
import { esc, md } from './render.js';
import { MAJOR, MINOR, TIERS, PHRASES, GLOSSARY } from './discodata.js';

const ROOTS = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'Db', 'Ab', 'Eb', 'Bb', 'F'];
const SHAPES = ['C', 'A', 'G', 'E', 'D'];
const KEY = 'guitarcards-disco';
const load = () => { try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { return null; } };
const D = Object.assign({ game: 'chord', kt: 'major', key: 'rand', shape: 'rand', level: 1, bpm: 70, beats: 4, speedUp: false, click: true, backing: true, reveal: 'now', best: {} }, load() || {});
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(D)); } catch (e) { /* private mode */ } };

const palette = () => (D.kt === 'major' ? MAJOR : MINOR);
const byId = () => Object.fromEntries(palette().map((c) => [c.id, c]));
const bestKey = () => `${D.game}.${D.kt}.${D.level}`;

// a root from a degree of the tonic's major scale, keeping letter spelling ('#1' = C♯ in C, 'b6' = A♭)
function rootAt(tonic, deg) {
  const m = /^(bb|b|#)?(\d)$/.exec(deg);
  const n = T.transpose(tonic, m[2]);
  return { letter: n.letter, acc: n.acc + ({ b: -1, bb: -2, '#': 1 }[m[1]] || 0) };
}
const sym = (root, q) => T.pretty(T.chordSymbol(root, q));
const pcs = (root, ivs) => ivs.map((iv) => (T.notePc(root) + T.intervalSemis(F.simpleIv(iv))) % 12);

// ---------- the chord stream ----------
function phrase(level) {
  const pool = palette().filter((c) => c.tier <= level);
  const ids = byId();
  const fresh = pool.filter((c) => c.tier === level && c.tier > 1);
  const spicy = pool.filter((c) => c.tier > 1);
  if (level === 1 || Math.random() < (level > 3 ? 0.15 : 0.25) || !spicy.length) return PHRASES[D.kt][Math.floor(Math.random() * PHRASES[D.kt].length)];
  const src = fresh.length && Math.random() < 0.6 ? fresh : spicy;
  const pick = src[Math.floor(Math.random() * src.length)];
  const out = [];
  const tonic = D.kt === 'major' ? 'I' : 'i';
  if (Math.random() < 0.5) out.push(Math.random() < 0.5 ? tonic : D.kt === 'major' ? 'IV' : 'iv');
  let c = pick;
  for (let i = 0; c && i < 4; i++) {
    out.push(c.id);
    if (!c.to || (i > 0 && c.tier === 1)) break;
    c = ids[c.to];
  }
  const last = ids[out[out.length - 1]];
  if (last.id !== tonic && (last.to === tonic || Math.random() < 0.5)) out.push(tonic);
  return out;
}

// ---------- shapes in the CAGED window ----------
function windowFor() {
  const w = F.cagedWindow(S.tonic, S.shape);
  return { lo: Math.max(0, w.lo - 1), hi: Math.min(F.MAX_FRET, w.hi + 1), core: [w.lo, w.hi] };
}
function voicingIn(root, q, win) {
  const n = T.getChord(q).ivs.length;
  const fams = n >= 4 ? ['drop2', 'drop3', 'close'] : ['close', 'spread'];
  const mid = (win.core[0] + win.core[1]) / 2;
  let best = null, bs = 1e9;
  for (const v of fams) {
    let list = [];
    try { list = F.chordVoicings({ root, quality: q, voicing: v, stringSet: 'auto', stringSetAll: true, inversion: 'all' }); } catch (e) { /* none */ }
    for (const p of list) {
      const fr = p.notes.map((x) => x.fret);
      if (fr.some((f) => f < win.lo || f > win.hi) || (Math.min(...fr) === 0 && win.lo > 0)) continue;
      const avg = fr.reduce((a, b) => a + b, 0) / fr.length;
      const sc = Math.abs(avg - mid) + (v === 'close' && n >= 4 ? 1.5 : 0) + (v === 'spread' ? 0.5 : 0);
      if (sc < bs) { bs = sc; best = p; }
    }
  }
  return best;
}
function dotsFor(ch, win) {
  const root = ch.root, dots = [];
  const chordIvs = T.getChord(ch.q).ivs.map(F.simpleIv);
  const cps = pcs(root, chordIvs);
  const ivOf = (pc, list) => list[cps.indexOf(pc)];
  if (D.game === 'chord') {
    const v = ch.voicing;
    const on = new Set(v ? v.notes.map((x) => `${x.string}:${x.fret}`) : []);
    for (let s = 1; s <= 6; s++) for (let f = win.lo; f <= win.hi; f++) {
      const pc = F.midiAt(s, f) % 12;
      if (!cps.includes(pc)) continue;
      const iv = ivOf(pc, chordIvs);
      const cur = on.has(`${s}:${f}`) || !v;
      dots.push({ s, f, label: T.prettyIv(iv), kind: cur ? (iv === '1' ? 'root' : 'tone') : 'ghost dim' });
    }
  } else {
    const sc = T.getScale(ch.scale);
    const labels = sc.labels || sc.ivs;
    const sps = pcs(root, sc.ivs);
    for (let s = 1; s <= 6; s++) for (let f = win.lo; f <= win.hi; f++) {
      const pc = F.midiAt(s, f) % 12;
      const i = sps.indexOf(pc); if (i < 0) continue;
      const isChord = cps.includes(pc);
      dots.push({ s, f, label: T.prettyIv(labels[i]), kind: sc.ivs[i] === '1' ? 'root' : isChord ? 'tone' : 'ghost' });
    }
  }
  return dots;
}
// the position stood upright: low E on the left, frets going down
function neckSVG(dots, win) {
  const left = 30, sp = 40, top = 22, fh = 42, n = win.hi - win.lo + 1;
  const W = left + 5 * sp + 22, H = top + n * fh + 8;
  const x = (s) => left + (6 - s) * sp;
  const y = (f) => (f === 0 ? top - 11 : top + (f - win.lo + (win.lo === 0 ? -0.5 : 0.5)) * fh);
  let g = '';
  const rows = win.lo === 0 ? win.hi : n;
  for (let i = 0; i <= rows; i++) g += `<line x1="${x(6)}" y1="${top + i * fh}" x2="${x(1)}" y2="${top + i * fh}" class="${i === 0 && win.lo === 0 ? 'nut' : 'wire'}"/>`;
  for (let f = Math.max(1, win.lo); f <= win.hi; f++) {
    g += `<text x="12" y="${y(f) + 4}" class="fretnum${[3, 5, 7, 9, 12, 15, 17].includes(f) ? ' strong' : ''}">${f}</text>`;
    if ([3, 5, 7, 9, 15, 17].includes(f)) g += `<circle cx="${(x(4) + x(3)) / 2}" cy="${y(f)}" r="4.5" class="inlay"/>`;
    if (f === 12) g += `<circle cx="${(x(5) + x(4)) / 2}" cy="${y(f)}" r="4.5" class="inlay"/><circle cx="${(x(3) + x(2)) / 2}" cy="${y(f)}" r="4.5" class="inlay"/>`;
  }
  for (let s = 1; s <= 6; s++) g += `<line x1="${x(s)}" y1="${top}" x2="${x(s)}" y2="${H - 6}" class="string s${s}"/>`;
  for (const d of dots) g += `<g class="dot ${d.kind}"><circle cx="${x(d.s)}" cy="${y(d.f)}" r="14"/><text x="${x(d.s)}" y="${y(d.f) + 4}">${esc(d.label)}</text></g>`;
  return `<svg viewBox="0 0 ${W} ${H}" class="fretboard discoNeck" preserveAspectRatio="xMidYMin meet">${g}</svg>`;
}

// ---------- state of a run ----------
let S = null, timer = null;
function makeChord(id) {
  const c = byId()[id];
  const root = rootAt(S.tonic, c.deg);
  const ch = { ...c, root, name: sym(root, c.q), scaleName: `${T.noteName(root, true)} ${T.getScale(c.scale).name}` };
  ch.voicing = voicingIn(root, c.q, S.win);
  return ch;
}
function refill() { while (S.queue.length < 3) S.queue.push(...phrase(D.level).map(makeChord)); }

export function stopDisco() { if (timer) { clearTimeout(timer); timer = null; } A.hush(); }

// ---------- setup screen ----------
export function renderDisco($app, { onBack }) {
  stopDisco();
  const tiers = TIERS[D.kt];
  if (D.level > tiers.length) D.level = tiers.length;
  const lvlBest = (l) => D.best[`${D.game}.${D.kt}.${l}`];
  $app.innerHTML = `
  <div class="row spread"><button class="icon" data-d="back" aria-label="Back">←</button><h2 style="margin:0">🪩 Disco mode</h2><button class="icon" data-d="help" aria-label="More help">?</button></div>
  <p class="muted small">Stay in one CAGED position. The click keeps time; the chords keep coming. ${D.game === 'chord' ? 'Play each chord in the position as it arrives.' : 'Play the mode of each chord in the position — land on its chord tones.'}</p>
  <div class="seg dgame">${[['chord', '🎸 Chord mode'], ['mode', '🎼 Mode mode']].map(([k, l]) => `<button data-game="${k}" class="${D.game === k ? 'on' : ''}">${l}</button>`).join('')}</div>
  <div class="seg">${[['major', 'Major key'], ['minor', 'Minor key']].map(([k, l]) => `<button data-kt="${k}" class="${D.kt === k ? 'on' : ''}">${l}</button>`).join('')}</div>
  <h3>Level</h3>
  <div class="dlevels">${tiers.map((t, i) => `<button data-lvl="${i + 1}" class="${D.level === i + 1 ? 'on' : ''}"><b>${i + 1}. ${esc(t)}</b><small>${palette().filter((c) => c.tier === i + 1).length} chords${lvlBest(i + 1) ? ` · best ${lvlBest(i + 1)} bpm` : ''}</small></button>`).join('')}</div>
  <h3>Key</h3>
  <div class="chips">${['rand', ...ROOTS].map((r) => `<button class="chip ${D.key === r ? 'on' : ''}" data-key="${r}">${r === 'rand' ? '🎲 Any' : esc(T.pretty(r)) + (D.kt === 'minor' ? 'm' : '')}</button>`).join('')}</div>
  <h3>Position</h3>
  <div class="chips">${['rand', ...SHAPES].map((s) => `<button class="chip ${D.shape === s ? 'on' : ''}" data-shape="${s}">${s === 'rand' ? '🎲 Any' : s + ' shape'}</button>`).join('')}</div>
  <h3>Tempo</h3>
  <div class="row dtempo"><button data-d="bpm-">−</button><b>${D.bpm} bpm</b><button data-d="bpm+">+</button><input type="range" min="30" max="200" step="5" value="${D.bpm}" id="dbpm"></div>
  <div class="chips"><span class="muted small">Beats per chord</span>${[1, 2, 4, 8].map((b) => `<button class="chip ${D.beats === b ? 'on' : ''}" data-beats="${b}">${b}</button>`).join('')}</div>
  <div class="chips"><button class="chip ${D.speedUp ? 'on' : ''}" data-d="speed">Speed up +5 every 8 chords</button><button class="chip ${D.click ? 'on' : ''}" data-d="click">Click</button><button class="chip ${D.backing ? 'on' : ''}" data-d="backing">Hear the chord</button></div>
  <div class="chips"><span class="muted small">Show the neck</span>${[['now', 'Right away'], ['half', 'Halfway through'], ['off', 'Never (test me)']].map(([k, l]) => `<button class="chip ${D.reveal === k ? 'on' : ''}" data-reveal="${k}">${l}</button>`).join('')}</div>
  <button class="primary start" data-d="go">▶ Start level ${D.level}</button>`;
  $app.onclick = (e) => {
    const b = e.target.closest('button'); if (!b) return;
    const d = b.dataset;
    const redraw = () => { save(); renderDisco($app, { onBack }); };
    if (d.d === 'back') { stopDisco(); onBack(); return; }
    if (d.d === 'help') return renderHelp($app, () => renderDisco($app, { onBack }));
    if (d.game) { D.game = d.game; return redraw(); }
    if (d.kt) { D.kt = d.kt; return redraw(); }
    if (d.lvl) { D.level = Number(d.lvl); return redraw(); }
    if (d.key) { D.key = d.key; return redraw(); }
    if (d.shape) { D.shape = d.shape; return redraw(); }
    if (d.beats) { D.beats = Number(d.beats); return redraw(); }
    if (d.reveal) { D.reveal = d.reveal; return redraw(); }
    if (d.d === 'bpm-' || d.d === 'bpm+') { D.bpm = Math.max(30, Math.min(200, D.bpm + (d.d === 'bpm+' ? 5 : -5))); return redraw(); }
    if (d.d === 'speed') { D.speedUp = !D.speedUp; return redraw(); }
    if (d.d === 'click') { D.click = !D.click; return redraw(); }
    if (d.d === 'backing') { D.backing = !D.backing; return redraw(); }
    if (d.d === 'go') { save(); startRun($app, { onBack }); }
  };
  const r = $app.querySelector('#dbpm'); if (r) r.onchange = () => { D.bpm = Number(r.value); save(); renderDisco($app, { onBack }); };
}

// ---------- the run ----------
function startRun($app, { onBack }) {
  const keyName = D.key === 'rand' ? ROOTS[Math.floor(Math.random() * 12)] : D.key;
  const shape = D.shape === 'rand' ? SHAPES[Math.floor(Math.random() * 5)] : D.shape;
  S = { tonic: T.parseNote(keyName), shape, bpm: D.bpm, queue: [], cur: null, beat: 0, count: 0, $app, onBack };
  S.win = windowFor();
  refill();
  drawRun();
  A.unlockAudio().then(() => A.ensureRunning()).then(() => { S.cur = S.queue.shift(); refill(); tick(); });
}
function keyLabel() { return `${T.noteName(S.tonic, true)} ${D.kt === 'major' ? 'major' : 'minor'} · ${S.shape} shape (frets ${S.win.core[0]}–${S.win.core[1]})`; }
function drawRun() {
  const $app = S.$app;
  $app.innerHTML = `
  <div class="row spread"><button class="icon" data-r="stop" aria-label="Stop">■</button><div class="muted small" style="text-align:center">${esc(keyLabel())}<br>Level ${D.level}: ${esc(TIERS[D.kt][D.level - 1])} · ${D.game === 'chord' ? 'chords' : 'modes'}</div><button class="icon" data-r="help" aria-label="More help">?</button></div>
  <div class="dnow" id="dnow"></div>
  <div class="dbeats" id="dbeats">${Array.from({ length: D.beats }, () => '<i></i>').join('')}</div>
  <div class="dneck" id="dneck"></div>
  <div class="dwhy" id="dwhy"></div>
  <div class="row dctl"><button data-r="bpm-">−</button><b id="dbpmnow">${S.bpm} bpm</b><button data-r="bpm+">+</button><button data-r="why">Why this chord?</button><button data-r="show">Show neck</button></div>`;
  $app.onclick = (e) => {
    const b = e.target.closest('button'); if (!b) return;
    const r = b.dataset.r;
    if (r === 'stop') return finishRun();
    if (r === 'help') { stopDisco(); return renderHelp($app, () => renderDisco($app, { onBack: S.onBack })); }
    if (r === 'bpm-' || r === 'bpm+') { S.bpm = Math.max(30, Math.min(200, S.bpm + (r === 'bpm+' ? 5 : -5))); document.getElementById('dbpmnow').textContent = `${S.bpm} bpm`; }
    if (r === 'why' && S.cur) document.getElementById('dwhy').innerHTML = whyHTML(S.cur);
    if (r === 'show' && S.cur) showNeck(S.cur);
  };
}
function showNeck(ch) { const el = document.getElementById('dneck'); if (el) el.innerHTML = neckSVG(dotsFor(ch, S.win), S.win); }
function drawChord() {
  const ch = S.cur, nx = S.queue[0];
  const el = document.getElementById('dnow'); if (!el) return;
  el.innerHTML = `<div class="dname">${esc(ch.name)}</div><div class="drn">${esc(ch.rn)} · ${esc(ch.fn)}</div>${D.game === 'mode' ? `<div class="dmode">${esc(ch.scaleName)}</div>` : ''}<div class="dnext">next: <b>${esc(nx.name)}</b> <span class="muted">${esc(nx.rn)}</span></div>`;
  document.getElementById('dwhy').innerHTML = '';
  if (D.reveal === 'now') showNeck(ch);
  else document.getElementById('dneck').innerHTML = `<div class="dhidden">${D.reveal === 'half' ? 'Find it… the neck shows halfway through' : 'Find it — tap “Show neck” to check'}</div>`;
}
function whyHTML(ch) {
  return `<div class="panel"><b>${esc(ch.name)} — ${esc(ch.rn)}</b><p class="small">${esc(ch.why)}</p><p class="small muted">Play over it: ${esc(ch.scaleName)}.${ch.to ? ` Usually goes to ${esc(byId()[ch.to].rn)}.` : ''}</p></div>`;
}
function tick() {
  if (!S) return;
  const ctx = A.audioCtx();
  const t = ctx.currentTime + 0.03;
  const first = S.beat === 0;
  if (first) {
    drawChord();
    if (D.backing && S.cur.voicing) A.strum(S.cur.voicing.notes.map((n) => n.midi).sort((a, b) => a - b), t, { vel: 0.45 });
  }
  if (D.click) A.click(t, first ? 1 : 0.55);
  const dots = document.querySelectorAll('#dbeats i');
  dots.forEach((d, i) => d.classList.toggle('on', i === S.beat));
  if (D.reveal === 'half' && S.beat === Math.floor(D.beats / 2)) showNeck(S.cur);
  S.beat++;
  if (S.beat >= D.beats) {
    S.beat = 0; S.count++;
    S.cur = S.queue.shift(); refill();
    if (D.speedUp && S.count % 8 === 0) { S.bpm = Math.min(200, S.bpm + 5); const b = document.getElementById('dbpmnow'); if (b) b.textContent = `${S.bpm} bpm`; }
  }
  timer = setTimeout(tick, 60000 / S.bpm);
}
function finishRun() {
  stopDisco();
  const { $app, onBack, bpm, count } = S;
  const prev = D.best[bestKey()] || 0;
  $app.innerHTML = `<div class="panel dend"><h2>Nice — ${count} chords</h2><p class="muted">${esc(keyLabel())} · level ${D.level} at ${bpm} bpm</p>
  <p>Was it clean — every ${D.game === 'chord' ? 'chord' : 'mode'} found in time?</p>
  <div class="row"><button class="primary grow" data-e="yes">✓ Clean at ${bpm} bpm</button><button class="grow" data-e="no">Not yet</button></div>
  <p class="muted small">${prev ? `Your best on this level: ${prev} bpm.` : 'No best tempo yet on this level.'} Next time try ${Math.min(200, bpm + 5)} bpm, or the next level at a slower tempo.</p></div>`;
  $app.onclick = (e) => {
    const b = e.target.closest('[data-e]'); if (!b) return;
    if (b.dataset.e === 'yes' && bpm > prev) { D.best[bestKey()] = bpm; D.bpm = Math.min(200, bpm + 5); }
    save(); S = null;
    renderDisco($app, { onBack });
  };
}

// ---------- more help: every chord in the palette, with when and why ----------
function renderHelp($app, back) {
  const tonic = T.parseNote(D.key === 'rand' ? 'C' : D.key);
  const tiers = TIERS[D.kt];
  $app.innerHTML = `
  <div class="row spread"><button class="icon" data-h="back" aria-label="Back">←</button><h2 style="margin:0">More help</h2><span></span></div>
  <p class="muted small">Every chord in ${D.kt} keys, shown in ${T.noteName(tonic, true)}${D.kt === 'minor' ? ' minor' : ' major'}. Numerals are measured against the major scale of the tonic. Each has what it does, when it’s used, and the mode to play over it.</p>
  <div class="md small">${md(GLOSSARY)}</div>
  ${tiers.map((t, i) => `<h3>Level ${i + 1}: ${esc(t)}</h3>${palette().filter((c) => c.tier === i + 1).map((c) => { const r = rootAt(tonic, c.deg); return `<div class="dhelp ${D.level === i + 1 ? 'cur' : ''}"><div class="row spread"><b>${esc(c.rn)}</b><span>${esc(sym(r, c.q))}</span></div><div class="small"><i>${esc(c.fn)}.</i> ${esc(c.why)}</div><div class="small muted">Mode: ${esc(T.noteName(r, true))} ${esc(T.getScale(c.scale).name)}${c.to ? ` · goes to ${esc(byId()[c.to].rn)}` : ''}</div></div>`; }).join('')}`).join('')}`;
  window.scrollTo(0, 0);
  $app.onclick = (e) => { if (e.target.closest('[data-h="back"]')) back(); };
}
