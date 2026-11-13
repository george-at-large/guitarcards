// CAGED Changes: pick a key and a CAGED shape, start the beat, and play each chord as it arrives, in that shape.
// Silent by design: the metronome is visual (an audible click is an opt-in), and no chord is ever played back.
// Chords come from a set (diatonic → modal interchange → everything → any chord) or a progression from the library;
// colour tiers turn triads into sevenths and sevenths into 9ths, 13ths and altered dominants. Evolving mode swaps
// chords for others with the same job as the loop goes round. A progression counts as done once you've confirmed a
// clean run in all five shapes at a fast tempo.
import * as T from '../theory.js';
import * as A from '../audio.js';
import * as G from './grips.js';
import * as H from './harmony.js';
import * as L from './library.js';
import * as E from './evolve.js';
import * as SC from './scales.js';

const $app = document.getElementById('caged');
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const fmt = (s) => esc(s).replace(/([♭♯𝄫])/g, '<span class="acc">$1</span>');
const pickOne = (a) => a[Math.floor(Math.random() * a.length)];
const standalone = matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;

// ---------- settings and progress ----------
const STORE = 'caged-changes';
const load = () => { try { return JSON.parse(localStorage.getItem(STORE) || '{}'); } catch (e) { return {}; } };
const D = Object.assign({
  key: 'C', kt: 'major', shape: 'C', mode: 'pos', src: 'set', set: 'dia', prog: 'major-ii-v-i',
  colour: 'sev', pcolour: 'as', names: false, nums: true, neck: true, voicing: 'caged', play: 'chords', scaleLevel: 1, diagram: 'now', labels: 'iv', hint: true, moves: true, evolve: false,
  bpm: 72, beats: 4, barBeats: 4, click: false, countIn: true, done: {},
}, load());
const save = () => { try { localStorage.setItem(STORE, JSON.stringify(D)); } catch (e) { /* private mode */ } };
if (D.diagram === 'off') { D.neck = false; D.diagram = 'now'; } // older setting: "never" is now the neck toggle
if (!D.nums && !D.names) D.nums = true;

const MAJOR_KEYS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
const MINOR_KEYS = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'G#', 'A', 'Bb', 'B'];
const keysFor = (minor) => (minor ? MINOR_KEYS : MAJOR_KEYS);
const prog = () => L.byId(D.prog);
const isMinor = () => D.kt === 'minor';
// a progression counts as done at this tempo (normalised to 4 beats a bar): 120, or 100 when bars hold two chords
const progBars = () => L.resolve(prog());
const target = () => (D.src === 'prog' ? (progBars().some((b) => b.length > 1) ? 100 : 120) : 120);
const doneKey = () => (D.play === 'scales' ? 'x:' : '') + (D.src === 'prog' ? `p:${D.prog}:${D.kt}` : `s:${D.kt}:${D.set}:${D.colour}`);
const record = (k = doneKey()) => D.done[k] || {};
const complete = (k, tgt) => G.SHAPES.every((s) => (record(k)[s] || 0) >= tgt);
const normBpm = (bpm) => Math.round(D.src === 'prog' ? bpm * 4 / D.barBeats : bpm * 4 / D.beats);

// ---------- a session: key, position, and the stream of chords ----------
function session() {
  const minor = isMinor();
  const keyName = D.key === 'rand' ? pickOne(keysFor(minor)) : D.key;
  const tonic = T.parseNote(keyName);
  const shape = D.shape === 'rand' ? pickOne(G.SHAPES) : D.shape;
  // two neighbouring shapes: one wider area (C+A, A+G, G+E, E+D, D+C)
  const pos = D.pair ? G.positionOfPair(tonic, shape) : G.positionOf(tonic, shape);
  const shapes = D.pair ? pos.shapes : [shape];
  return { tonic, minor, shape, shapes, shapeKey: shapes.join('+'), pos, keyName };
}
const keyLabel = (S) => `${T.noteName(S.tonic, true)} ${S.minor ? 'minor' : 'major'}`;
const shapeWord = (S) => `${S.shapeKey} shape${S.shapes.length > 1 ? 's' : ''}`;
const posLabel = (S) => (D.mode === 'pos' ? `${shapeWord(S)} · frets ${S.pos.lo}–${S.pos.hi}` : `${shapeWord(S)} everywhere`);

// a grip for a chord: in position, or this shape nearest the last chord; a colour chord with no grip here steps
// down to its plainer cousin
const scaleMode = () => D.play === 'scales';
const usesArea = () => D.mode === 'pos' || D.voicing !== 'caged' || scaleMode();
// a chord's quality as the voicing set plays it: triad sets play the triad, drop sets need four notes
function adaptQ(q, spec, S) {
  const v = G.voicingById(D.voicing);
  if (v.fam === 'tri') return H.toTriad(q);
  if (v.fam && T.getChord(q).ivs.length < 4) return H.toSeventh(q, spec.iv, { dominant: !!spec.rel, minorKey: S.minor });
  return q;
}
function gripFor(S, root, q, prev, vl) {
  if (D.voicing !== 'caged') return G.voiceLeadPick(root, q, D.voicing, S.pos, prev);
  if (D.mode === 'pos') return G.gripInPosition(root, q, S.pos, prev, vl ? 0.6 : 0.12);
  // one shape everywhere: follow the last chord, but stay anchored to the key's position so it doesn't drift up the neck
  const near = prev ? (prev.center + S.pos.mid) / 2 : S.pos.mid;
  const gs = S.shapes.map((sh) => G.gripNear(root, q, sh, near)).filter(Boolean);
  return gs.length ? gs.reduce((a, b) => (Math.abs(a.center - near) <= Math.abs(b.center - near) ? a : b)) : null;
}
function realise(S, spec, q, prev, extra = {}) {
  const root = H.spell(S.tonic, spec.iv);
  // scale mode: the chord as written, and a scale to solo over it at the chosen level (not the same one twice running)
  if (scaleMode()) {
    S.lastScale ||= {};
    const k = `${spec.iv}:${q}`;
    const solo = SC.pickScale(spec.iv, q, S.minor, D.scaleLevel, S.lastScale[k], T.notePc(S.tonic));
    S.lastScale[k] = solo;
    return { spec, q, root, name: H.chordName(root, q), rn: H.label(spec, q), grip: null, solo, ...extra };
  }
  q = adaptQ(q, spec, S);
  let qq = q, grip = gripFor(S, root, qq, prev, extra.vl), plainer = null;
  while (!grip && H.simpler(qq)) { qq = H.simpler(qq); grip = gripFor(S, root, qq, prev, extra.vl); plainer = q; }
  if (!grip && D.mode === 'one' && D.voicing === 'caged') { qq = q; grip = G.gripInPosition(root, qq, { lo: Math.max(0, (prev?.center ?? S.pos.mid) - 3), hi: (prev?.center ?? S.pos.mid) + 3, mid: prev?.center ?? S.pos.mid }); }
  return { spec, q: qq, root, name: H.chordName(root, qq), rn: H.label(spec, qq), grip, plainer, ...extra };
}

// sets: a random chord from the pool, never the same twice running
function colourFor(e) {
  if (D.colour === 'tri') return e.tri;
  if (D.colour === 'sev') return e.sev;
  return pickOne(e.col);
}
function setStream(S) {
  const pool = H.setPool(S.minor ? 'minor' : 'major', D.set);
  let last = null, prev = null;
  return {
    next() {
      let spec, fn = '', tag = '', q;
      if (D.set === 'any') {
        do { spec = { iv: H.randomIv() }; q = pickOne(H.ANY_QUALITIES[D.colour]); } while (last && last.iv === spec.iv && last.q === q);
        spec.q = q;
      } else {
        let e;
        do { e = pickOne(pool); } while (pool.length > 1 && last && e === last.e);
        q = colourFor(e);
        spec = { iv: e.iv, q, rel: e.rel };
        fn = e.fn; tag = e.tag || '';
        last = { e };
      }
      if (D.set === 'any') last = { iv: spec.iv, q };
      const c = realise(S, spec, q, prev, { fn, tag, beats: D.beats });
      prev = c.grip;
      return c;
    },
  };
}
// a progression's colour: as written, or reduced to triads, or every chord a seventh, or 9ths/13ths/alt
function colourise(spec, next, i, minor) {
  const c = D.pcolour;
  if (c === 'as') return spec.q;
  const tri = H.toTriad(spec.q);
  if (c === 'tri') return tri;
  const sev = T.getChord(spec.q).ivs.length >= 4 ? spec.q : H.toSeventh(tri, spec.iv, { dominant: !!spec.rel, minorKey: minor });
  if (c === 'sev') return sev;
  const opts = H.colourOptions(sev, spec.iv, { toMinor: next ? H.isMinorish(next.q) || E.cls(next.q) === 'hd' : false, minorKey: minor });
  return opts[i % opts.length];
}
// the progression's slots, converted to the chosen mode if it was written in the other one
function progSlots(minor) {
  const p = prog();
  const bars = progBars();
  const conv = !!p.minor !== minor;
  const slots = [];
  bars.forEach((b, bi) => b.forEach((spec) => {
    const beats = Math.max(1, Math.round(D.barBeats / b.length));
    slots.push({ spec: conv ? E.toParallel(spec, minor) : spec, beats, bar: bi });
  }));
  slots.forEach((x, i) => { x.oid = i; });
  return slots;
}
function progStream(S, R) {
  const orig = progSlots(S.minor);
  const vl = prog().vl;
  let cur = orig, i = 0, pass = 0, prev = null;
  R.slots = cur;
  return {
    next() {
      if (i >= cur.length) {
        i = 0; pass++;
        if (D.evolve) { const r = E.evolve(cur, orig, S.minor); cur = r.slots; R.pendingNote = r.note; }
        R.slots = cur;
      }
      const x = cur[i], nx = cur[(i + 1) % cur.length];
      const q = colourise(x.spec, nx.spec, x.oid + pass, S.minor);
      const c = realise(S, x.spec, q, prev, { beats: x.beats, bar: x.bar, slot: i, pass, sub: x.sub, vl, slots: cur });
      prev = c.grip;
      i++;
      return c;
    },
  };
}

// ---------- the neck diagram: the position stood upright, low E on the left ----------
const KIND = (iv) => (iv === '1' ? 'r' : /^(b?3)$/.test(iv) ? 't3' : /^(b5|5|#5)$/.test(iv) ? 't5' : /^(b?b?7)$/.test(iv) ? 't7' : 'tx');
function neckSVG(grip, { lo, hi, labels = D.labels, prev = null, band = null, small = false, tiny = false, bg = null } = {}) {
  if (!grip) return '<div class="cnone">No grip for this one here</div>';
  lo = Math.max(0, Math.min(lo, grip.lo));
  hi = Math.max(hi, grip.hi, lo + 4);
  const left = 50, sp = 44, top = 38, fh = 50;
  const rows = lo === 0 ? hi : hi - lo + 1;
  const W = left + 5 * sp + 26, H = top + rows * fh + 10;
  const x = (s) => left + (6 - s) * sp;
  const y = (f) => (f === 0 ? top - 17 : lo === 0 ? top + (f - 0.5) * fh : top + (f - lo + 0.5) * fh);
  let g = '';
  if (band) {
    const a = Math.max(band.lo, lo === 0 ? 1 : lo), b = Math.min(band.hi, hi);
    if (b >= a) g += `<rect x="${x(6) - 20}" y="${y(a) - fh / 2}" width="${5 * sp + 40}" height="${(b - a + 1) * fh}" rx="8" class="band"/>`;
  }
  for (let i = 0; i <= rows; i++) g += `<line x1="${x(6)}" y1="${top + i * fh}" x2="${x(1)}" y2="${top + i * fh}" class="${i === 0 && lo === 0 ? 'nut' : 'wire'}"/>`;
  for (let f = Math.max(1, lo); f <= hi; f++) {
    if (!tiny) g += `<text x="16" y="${y(f) + 4}" class="fnum">${f}</text>`;
    else if (f === Math.max(1, lo)) g += `<text x="22" y="${y(f) + 10}" class="fnum big">${f}</text>`;
    if ([3, 5, 7, 9, 15, 17].includes(f)) g += `<circle cx="${(x(4) + x(3)) / 2}" cy="${y(f)}" r="5" class="inlay"/>`;
    if (f === 12) g += `<circle cx="${(x(5) + x(4)) / 2}" cy="${y(f)}" r="5" class="inlay"/><circle cx="${(x(3) + x(2)) / 2}" cy="${y(f)}" r="5" class="inlay"/>`;
  }
  for (let s = 1; s <= 6; s++) g += `<line x1="${x(s)}" y1="${top}" x2="${x(s)}" y2="${H - 6}" class="str s${s}"/>`;
  // the key's CAGED shape, faintly: the tonic chord's notes across the area
  if (bg) for (const b of bg) if (b.fret >= lo && b.fret <= hi && (b.fret > 0 || lo === 0)) g += `<circle cx="${x(b.string)}" cy="${y(b.fret)}" r="${b.fret === 0 ? 10 : 13}" class="bg${b.root ? ' root' : ''}"/>`;
  const at = new Map(grip.notes.map((n) => [n.string, n]));
  // the previous chord: where each moving voice came from, and which notes are held
  if (prev && D.moves) {
    for (const p of prev.notes) {
      const n = at.get(p.string);
      if (n && n.fret === p.fret) continue;
      if (p.fret >= lo && p.fret <= hi && (p.fret > 0 || lo === 0)) g += `<circle cx="${x(p.string)}" cy="${y(p.fret)}" r="9" class="was"/>`;
    }
  }
  for (let s = 1; s <= 6; s++) if (!at.has(s)) g += `<text x="${x(s)}" y="${top - 12}" class="mute">×</text>`;
  for (const n of grip.notes) {
    const lab = labels === 'finger' && n.finger !== undefined ? (n.finger || '○') : labels === 'note' ? T.noteName(n.note, true) : T.prettyIv(n.iv);
    const held = prev && D.moves && prev.notes.some((p) => p.string === n.string && p.fret === n.fret);
    const cls = `dot ${n.kind || KIND(n.iv)}${n.fret === 0 ? ' open' : ''}${held ? ' held' : ''}`;
    const r = tiny ? (n.fret === 0 ? 13 : 18) : n.fret === 0 ? 12 : 16;
    g += `<g class="${cls}"><circle cx="${x(n.string)}" cy="${y(n.fret)}" r="${r}"/>${tiny ? '' : `<text x="${x(n.string)}" y="${y(n.fret) + 4.5}">${esc(lab)}</text>`}</g>`;
  }
  return `<svg viewBox="0 0 ${W} ${H}" class="neck${small ? ' small' : ''}${tiny ? ' tiny' : ''}" role="img" aria-label="Chord diagram">${g}</svg>`;
}
const LEGEND = '<div class="legend"><span class="k r">root</span><span class="k t3">3rd</span><span class="k t5">5th</span><span class="k t7">7th</span><span class="k tx">colour</span></div>';
function windowFor(S, grip) {
  if (usesArea()) return { lo: Math.max(0, S.pos.lo - (S.pos.lo > 0 ? 1 : 0)), hi: S.pos.hi + 1, band: S.pos };
  return { lo: Math.max(0, (grip?.lo ?? 1) - 1), hi: (grip?.lo ?? 1) + 4, band: null };
}

// ---------- setup ----------
function seg(name, opts, cur) {
  // data-bar-beats reads back as dataset.barBeats (HTML lowercases data-barBeats)
  const attr = name.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
  return `<div class="seg" role="radiogroup">${opts.map(([v, l]) => `<button data-${attr}="${v}" class="${String(cur) === String(v) ? 'on' : ''}" role="radio" aria-checked="${String(cur) === String(v)}">${l}</button>`).join('')}</div>`;
}
function shapeProgress(k, tgt) {
  const r = D.done[k] || {};
  return `<div class="prog-shapes">${G.SHAPES.map((s) => { const b = r[s] || 0; return `<span class="ps ${b >= tgt ? 'ok' : b ? 'part' : ''}" title="${s} shape${b ? `: best ${b} bpm` : ''}"><b>${s}</b>${b ? `<small>${b}</small>` : ''}</span>`; }).join('')}</div>`;
}
function progOptions() {
  return L.LIBRARY.map((g) => `<optgroup label="${esc(g.cat)}">${L.ALL.filter((p) => p.cat === g.cat).map((p) => {
    const kt = p.minor ? 'minor' : 'major';
    const tgt = L.resolve(p).some((b) => b.length > 1) ? 100 : 120;
    const done = complete(`p:${p.id}:${kt}`, tgt) || complete(`p:${p.id}:${kt === 'major' ? 'minor' : 'major'}`, tgt);
    return `<option value="${p.id}" ${p.id === D.prog ? 'selected' : ''}>${done ? '✓ ' : ''}${esc(p.name)}${p.minor ? ' (minor)' : ''}</option>`;
  }).join('')}</optgroup>`).join('');
}
function chartHTML(slots, { cur = -1, tonic = null } = {}) {
  const bars = [];
  slots.forEach((x, i) => { (bars[x.bar] ||= []).push({ x, i }); });
  return `<div class="chart">${bars.map((b) => `<div class="bar">${(b || []).map(({ x, i }) => {
    const nm = tonic ? `<span class="cname">${fmt(H.chordName(H.spell(tonic, x.spec.iv), x.spec.q))}</span>` : '';
    return `<span class="ch${i === cur ? ' cur' : ''}${x.sub ? ' sub' : ''}" ${x.sub ? `title="${esc(x.sub)}"` : ''}><span class="cnum">${fmt(H.label(x.spec))}</span>${nm}</span>`;
  }).join('')}</div>`).join('')}</div>`;
}

function setup() {
  stop();
  const minor = isMinor();
  const keys = keysFor(minor);
  if (D.key !== 'rand' && !keys.includes(D.key)) D.key = minor ? ({ Db: 'C#', Ab: 'G#' }[D.key] || D.key) : ({ 'C#': 'Db', 'G#': 'Ab' }[D.key] || D.key);
  const p = prog();
  const S0 = { tonic: T.parseNote(D.key === 'rand' ? 'C' : D.key), minor, shape: D.shape === 'rand' ? 'C' : D.shape };
  S0.pos = D.pair ? G.positionOfPair(S0.tonic, S0.shape) : G.positionOf(S0.tonic, S0.shape);
  S0.shapes = D.pair ? S0.pos.shapes : [S0.shape]; S0.shapeKey = S0.shapes.join('+');
  const tgt = target();
  const sets = H.SETS[D.kt];
  const conv = D.src === 'prog' && !!p.minor !== minor;
  $app.innerHTML = `
  <header class="chead">${standalone ? '<span></span>' : '<a class="cback" href="./" aria-label="Guitar Cards">‹</a>'}<h1>CAGED Changes</h1><span></span></header>
  <p class="lead">${scaleMode() ? 'Pick a key and a shape. The chords keep coming on the beat; for each one you get a scale to solo over it, inside the shape.' : 'Pick a key and a shape. The beat keeps time and the chords keep coming. Play each one in the shape as it arrives.'}</p>
  ${seg('play', [['chords', 'Play the chords'], ['scales', 'Solo with scales']], D.play)}

  <section class="card">
    <h2>Key</h2>
    ${seg('kt', [['major', 'Major'], ['minor', 'Minor']], D.kt)}
    <div class="chips">${['rand', ...keys].map((k) => `<button class="chip ${D.key === k ? 'on' : ''}" data-key="${k}">${k === 'rand' ? 'Any' : fmt(T.pretty(k)) + (minor ? 'm' : '')}</button>`).join('')}</div>
    <h2>Shape</h2>
    <div class="chips shapes">${['rand', ...G.SHAPES].map((s) => `<button class="chip ${D.shape === s ? 'on' : ''}" data-shape="${s}">${s === 'rand' ? 'Any' : D.pair ? `${s}+${G.nextShape(s)}` : s}</button>`).join('')}</div>
    <div class="chips"><button class="chip ${D.pair ? 'on' : ''}" data-act="pair">Two shapes at once</button></div>
    ${seg('mode', [['pos', 'Stay in position'], ['one', 'One shape everywhere']], D.mode)}
    <p class="note">${D.mode === 'pos'
      ? `The key’s ${D.pair ? `${S0.shapeKey} shapes mark` : `${S0.shape} shape marks`} out ${D.pair ? 'an area' : 'a position'}${D.key !== 'rand' && D.shape !== 'rand' ? ` (frets ${S0.pos.lo}–${S0.pos.hi} in ${fmt(T.pretty(D.key))}${minor ? 'm' : ''})` : ''}. Every chord is played inside it, in whichever CAGED shape of that chord lives there.`
      : `Every chord in the ${D.pair ? `${S0.shapeKey} shapes (whichever is nearer)` : `${S0.shape} shape`}, moving up and down the neck to find its root.`}</p>
  </section>

  ${scaleMode() ? `<section class="card">
    <h2>Scales</h2>
    ${seg('scaleLevel', [[1, 'Easy'], [2, 'Medium'], [3, 'Hard'], [4, 'Exotic'], ['any', 'Mix']], D.scaleLevel)}
    <p class="note">${{ 1: 'Pentatonics, blues and the key’s own mode for each chord: inside sounds.', 2: 'One or two notes outside the key, and the everyday jazz scales: Lydian dominant, altered, Phrygian dominant, diminished, bebop.', 3: 'Rarer melodic- and harmonic-minor modes, harmonic major, and modes that bend three or more notes.', 4: 'Double harmonic, Hungarian, Neapolitan, Persian, enigmatic, Japanese pentatonics: wherever they genuinely fit.', any: 'Anything that works, any level.' }[D.scaleLevel]} Only scales that hold every chord tone (or, for pentatonics, leave the clashing ones out) are offered. When a chord has nothing at your level, the nearest level is used.</p>
  </section>` : `  <section class="card">
    <h2>Voicings</h2>
    <select id="voicing" class="select" aria-label="Voicing set">${G.VOICINGS.map((v) => `<option value="${v.id}" ${v.id === D.voicing ? 'selected' : ''}>${esc(v.name)}</option>`).join('')}</select>
    <p class="note">${D.voicing === 'caged' || D.voicing === 'any' ? esc(G.voicingById(D.voicing).blurb) : `Every chord as a ${esc(G.voicingById(D.voicing).name.split(' · ')[0].toLowerCase().replace(/s$/, ''))} on strings ${G.voicingById(D.voicing).set.join('-')}, in whichever inversion is closest to the last chord, so the voices move as little as possible. ${G.voicingById(D.voicing).fam === 'tri' ? 'Seventh and colour chords are played as their triads.' : 'Triads are played as seventh chords; bigger chords keep their most telling four notes.'}`}</p>
  </section>`}

  <section class="card">
    <h2>Chords</h2>
    ${seg('src', [['set', 'Chord sets'], ['prog', 'Progressions']], D.src)}
    ${D.src === 'set' ? `
      <div class="sets">${sets.map((s) => `<button class="set ${D.set === s.id ? 'on' : ''}" data-set="${s.id}"><b>${esc(s.name)}</b><small>${esc(s.blurb)}</small></button>`).join('')}</div>
      <h3>Colour</h3>
      ${seg('colour', H.COLOURS.map((c) => [c.id, c.name]), D.colour)}
      <p class="note">${esc(H.COLOURS.find((c) => c.id === D.colour).blurb)}</p>`
    : `
      <select id="prog" class="select" aria-label="Progression">${progOptions()}</select>
      <p class="note"><b>${esc(p.name)}</b> · ${esc(p.by)}${p.vl ? ' · a voice-leading study: the grips are chosen to move as little as possible' : ''}${conv ? ` · <i>written in ${p.minor ? 'minor' : 'major'}, converted to ${D.kt}</i>` : ''}</p>
      ${chartHTML(progSlots(minor), { tonic: S0.tonic })}
      <h3>Colour</h3>
      ${seg('pcolour', [['as', 'As written'], ['tri', 'Triads'], ['sev', 'Sevenths'], ['col', 'Colour tones']], D.pcolour)}
      <button class="toggle ${D.evolve ? 'on' : ''}" data-act="evolve"><b>Evolving mode ${D.evolve ? 'on' : 'off'}</b><small>Each time round, one chord is swapped for another with the same job (iii or vi for I, ii for IV, ♭II7 for V7), or a ii–V, secondary dominant or passing diminished slips in. Old swaps drift back.</small></button>`}
  </section>

  <section class="card">
    <h2>Show</h2>
    <div class="chips"><button class="chip ${D.nums ? 'on' : ''}" data-act="nums">Numerals</button><button class="chip ${D.names ? 'on' : ''}" data-act="names">Chord names</button><button class="chip ${D.neck ? 'on' : ''}" data-act="neck">Neck diagram</button></div>
    <p class="note">At least one of numeral and name stays on. All three can be switched during a run too. With the neck off it’s just the beat and the chord.</p>
    ${D.neck ? `<h3>Show the neck</h3>
    ${seg('diagram', [['now', 'Right away'], ['half', 'Halfway'], ['tap', 'On tap']], D.diagram)}` : ''}
    <h3>Dots show</h3>
    ${seg('labels', [['iv', 'Intervals'], ['finger', 'Fingers'], ['note', 'Notes']], D.labels)}
    <div class="chips"><button class="chip ${D.hint ? 'on' : ''}" data-act="hint">Name the shape</button><button class="chip ${D.moves ? 'on' : ''}" data-act="moves">Show held notes</button></div>
  </section>

  <section class="card">
    <h2>Tempo</h2>
    <div class="tempo"><button data-act="bpm-" aria-label="Slower">−</button><b>${D.bpm}<small> bpm</small></b><button data-act="bpm+" aria-label="Faster">+</button></div>
    <input type="range" id="bpm" min="30" max="220" step="2" value="${D.bpm}" aria-label="Tempo">
    ${D.src === 'set'
      ? `<h3>Change chord every</h3>${seg('beats', [[1, '1 beat'], [2, '2'], [4, '4 (a bar)'], [8, '8']], D.beats)}`
      : `<h3>Beats in a bar</h3>${seg('barBeats', [[2, '2 (double time)'], [4, '4'], [8, '8 (half time)']], D.barBeats)}`}
    <div class="chips"><button class="chip ${D.countIn ? 'on' : ''}" data-act="countIn">Count-in</button><button class="chip ${D.click ? 'on' : ''}" data-act="click">Audible click</button></div>
    <p class="note">The beat is shown, not heard: the dots light up on every beat${D.click ? ', and the click sounds too' : '. Turn on the audible click if you want one'}.</p>
  </section>

  <section class="card">
    <h2>Progress</h2>
    <p class="note">${D.src === 'prog' ? `<b>${esc(p.name)}</b> in ${D.kt}` : `<b>${esc(sets.find((s) => s.id === D.set).name)}</b>, ${esc(H.COLOURS.find((c) => c.id === D.colour).name.toLowerCase())}, ${D.kt}`} is done when you’ve played it cleanly in all five shapes at <b>${tgt} bpm</b>${D.src === 'prog' ? ' with 4 beats a bar' : ' changing every bar'} (or the same speed of change at other settings). You confirm each run yourself.</p>
    ${shapeProgress(doneKey(), tgt)}
    ${complete(doneKey(), tgt) ? '<p class="done">✓ Done in every shape</p>' : ''}
  </section>

  <div class="actions"><button class="primary" data-act="go">▶ Start</button><button data-act="walk">${scaleMode() ? 'Scale options' : 'Walkthrough'}</button></div>`;

  $app.onclick = (e) => {
    const b = e.target.closest('button'); if (!b) return;
    const d = b.dataset;
    const redraw = () => { save(); setup(); };
    for (const k of ['kt', 'key', 'shape', 'mode', 'src', 'set', 'colour', 'pcolour', 'diagram', 'labels', 'play']) if (d[k] !== undefined) { D[k] = d[k]; return redraw(); }
    for (const k of ['beats', 'barBeats']) if (d[k] !== undefined) { D[k] = Number(d[k]); return redraw(); }
    if (d.scaleLevel !== undefined) { D.scaleLevel = d.scaleLevel === 'any' ? 'any' : Number(d.scaleLevel); return redraw(); }
    const a = d.act;
    if (a === 'nums' || a === 'names') { flipLabel(a); return redraw(); }
    if (['hint', 'moves', 'click', 'countIn', 'evolve', 'neck', 'pair'].includes(a)) { D[a] = !D[a]; return redraw(); }
    if (a === 'bpm-' || a === 'bpm+') { D.bpm = Math.max(30, Math.min(220, D.bpm + (a === 'bpm+' ? 2 : -2))); return redraw(); }
    if (a === 'go') { save(); run(); }
    if (a === 'walk') { save(); walkthrough(); }
  };
  applyNames();
  const r = $app.querySelector('#bpm');
  r.oninput = () => { D.bpm = Number(r.value); $app.querySelector('.tempo b').innerHTML = `${D.bpm}<small> bpm</small>`; };
  r.onchange = () => save();
  const vsel = $app.querySelector('#voicing');
  if (vsel) vsel.onchange = () => { D.voicing = vsel.value; save(); setup(); };
  const sel = $app.querySelector('#prog');
  if (sel) sel.onchange = () => { D.prog = sel.value; D.kt = prog().minor ? 'minor' : 'major'; save(); setup(); };
}

// ---------- the run ----------
let R = null;
function stop() {
  if (!R) return;
  clearTimeout(R.timer);
  R.ui.forEach(clearTimeout);
  if (R.sound) A.hush();
  awake(false);
  R.stopped = true;
}
const now = () => (R && R.sound ? A.audioCtx().currentTime : performance.now() / 1000);
let lock = null;
async function awake(on) {
  try {
    if (on && !lock && navigator.wakeLock) lock = await navigator.wakeLock.request('screen');
    if (!on && lock) { await lock.release(); lock = null; }
  } catch (e) { lock = null; }
}

async function run() {
  const S = session();
  R = { S, ui: [], timer: null, queue: [], cur: null, beatIn: 0, count: 0, passes: 0, countLeft: D.countIn ? 4 : 0, bpm: D.bpm, paused: false, prevGrip: null, maxBpm: D.bpm, minBpm: D.bpm };
  R.stream = D.src === 'prog' ? progStream(S, R) : setStream(S);
  R.queue.push(R.stream.next(), R.stream.next());
  drawRun();
  // the clock: the audio clock when the click sounds (sample-accurate), otherwise the page clock; no audio is
  // touched at all when the click is off
  R.sound = D.click;
  if (R.sound) { await A.unlockAudio(); await A.ensureRunning(); }
  awake(true);
  R.nextTime = now() + 0.15;
  if (R.countLeft) showChord(R.queue[0], { counting: true });
  pump();
}
function at(t, fn) {
  const ms = Math.max(0, (t - now()) * 1000);
  const id = setTimeout(() => { R.ui = R.ui.filter((x) => x !== id); fn(); }, ms);
  R.ui.push(id);
}
function pump() {
  if (!R || R.stopped || R.paused) return;
  while (R.nextTime < now() + 0.12) { beat(R.nextTime); R.nextTime += 60 / R.bpm; }
  R.timer = setTimeout(pump, 25);
}
function beat(t) {
  if (R.countLeft > 0) {
    const n = R.countLeft;
    if (R.sound) A.click(t, n === 4 ? 2 : 1);
    at(t, () => { const el = document.getElementById('count'); if (el) el.textContent = String(5 - n); });
    R.countLeft--;
    return;
  }
  if (R.beatIn === 0) {
    R.prevGrip = R.cur ? R.cur.grip : null;
    R.cur = R.queue.shift();
    R.queue.push(R.stream.next());
    const c = R.cur, nx = R.queue[0], prev = R.prevGrip, note = R.pendingNote;
    if (c.slot === 0 && note) R.pendingNote = null;
    at(t, () => { showChord(c, { next: nx, prev, note: c.slot === 0 ? note : null }); });
    if (c.slot === 0 && R.count > 0) R.passes++;
  }
  const c = R.cur, b = R.beatIn;
  if (R.sound) A.click(t, b === 0 ? 2 : 1);
  at(t, () => {
    document.querySelectorAll('#beats i').forEach((el, i) => el.classList.toggle('on', i === b));
    document.getElementById('next')?.classList.toggle('soon', b === c.beats - 1); // the change is on the next beat
    if (D.neck && D.diagram === 'half' && b === Math.floor(c.beats / 2)) revealNeck();
  });
  R.beatIn++;
  if (R.beatIn >= c.beats) { R.beatIn = 0; R.count++; }
}

function drawRun() {
  const { S } = R;
  $app.innerHTML = `
  <header class="chead run"><button class="icon" data-r="stop" aria-label="Stop">■</button><div class="where">${fmt(keyLabel(S))}<small>${fmt(posLabel(S))}${scaleMode() ? ` · scales: ${LEVEL_NAME[D.scaleLevel] || 'mix'}` : D.voicing !== 'caged' ? ` · ${esc(G.voicingById(D.voicing).name.toLowerCase().replace('strings ', ''))}` : ''}${D.evolve && D.src === 'prog' ? ' · evolving' : ''}</small></div><button class="icon" data-r="pause" aria-label="Pause">❚❚</button></header>
  <div class="now" id="now"></div>
  <div class="beats" id="beats"></div>
  <div class="nextline" id="next"></div>
  <div class="stage" id="stage"></div>
  <div class="evo" id="evo"></div>
  <div id="chart"></div>
  <div class="runctl"><button data-r="bpm-" aria-label="Slower">−</button><b id="bpmnow">${R.bpm} bpm</b><button data-r="bpm+" aria-label="Faster">+</button></div>
  <div class="runbtns"><button class="rt" data-r="nums">Numeral</button><button class="rt" data-r="names">Name</button><button class="rt" data-r="neck">Neck</button><button class="sheet-btn" data-r="sheet">${scaleMode() ? 'Scale options' : 'Chord set'}</button></div>
  <div class="sheet" id="sheet" hidden></div>`;
  applyNames();
  window.scrollTo(0, 0);
  $app.onclick = (e) => {
    const b = e.target.closest('button, #stage'); if (!b) return;
    const r = b.dataset?.r || (b.id === 'stage' ? 'reveal' : null);
    if (r === 'stop') return finish();
    if (r === 'names' || r === 'nums') { flipLabel(r); save(); return applyNames(); }
    if (r === 'neck') { D.neck = !D.neck; save(); applyNames(); return renderStage(); }
    if (r === 'sheet') return openSheet();
    if (r === 'close-sheet') return closeSheet();
    if (r === 'pause') return togglePause(b);
    if (r === 'reveal') return revealNeck();
    if (r === 'bpm-' || r === 'bpm+') {
      R.bpm = Math.max(30, Math.min(220, R.bpm + (r === 'bpm+' ? 2 : -2)));
      R.maxBpm = Math.max(R.maxBpm, R.bpm); R.minBpm = Math.min(R.minBpm, R.bpm);
      D.bpm = R.bpm; save();
      document.getElementById('bpmnow').textContent = `${R.bpm} bpm`;
    }
  };
}
function togglePause(btn) {
  if (!R) return;
  R.paused = !R.paused;
  btn.textContent = R.paused ? '▶' : '❚❚';
  if (R.paused) { clearTimeout(R.timer); R.ui.forEach(clearTimeout); R.ui = []; if (R.sound) A.hush(); }
  else { R.nextTime = now() + 0.1; pump(); }
}
// numeral and name are both always in the page; classes on the app decide which show (at least one does), and
// with the numeral off the name takes its place and size
function labelsFor(c) { return { main: c.rn, sub: c.name }; }
function flipLabel(which) {
  const other = which === 'nums' ? 'names' : 'nums';
  if (D[which] && !D[other]) D[other] = true;
  D[which] = !D[which];
}
function namesButton(attr) {
  return `<div class="runbtns"><button class="rt" data-${attr}="nums">Numeral</button><button class="rt" data-${attr}="names">Name</button></div>`;
}
function applyNames() {
  $app.classList.toggle('hide-names', !D.names);
  $app.classList.toggle('hide-nums', !D.nums);
  $app.classList.toggle('no-neck', !D.neck);
  const on = { nums: D.nums, names: D.names, neck: D.neck };
  $app.querySelectorAll('.rt').forEach((b) => { const k = b.dataset.r || b.dataset.w; b.classList.toggle('on', !!on[k]); b.setAttribute('aria-pressed', !!on[k]); });
}
const gripTag = (g) => (g ? (g.shape ? `${g.shape} shape` : g.label) : '');
function showChord(c, { next = null, prev = null, counting = false, note = null } = {}) {
  if (!R) return;
  const { main, sub } = labelsFor(c);
  const tags = [];
  if (D.hint && c.grip) tags.push(`<span class="tag shape">${esc(gripTag(c.grip))}</span>`);
  if (c.tag) tags.push(`<span class="tag">${esc(c.tag)}</span>`);
  if (c.plainer) tags.push(`<span class="tag warn" title="No ${esc(c.plainer)} grip here">plainer: no ${fmt(T.pretty(T.getChord(c.plainer).sym))} grip here</span>`);
  if (c.grip?.outside) tags.push('<span class="tag warn">stretches out of position</span>');
  const solo = c.solo ? soloHTML(c) : '';
  document.getElementById('now').innerHTML = counting
    ? `<div class="count" id="count"></div><div class="first">first: <b class="cnum">${fmt(main)}</b> <b class="cname">${fmt(sub)}</b></div>`
    : `<div class="main cnum">${fmt(main)}</div><div class="sub cname">${fmt(sub)}</div><div class="tags">${tags.join('')}</div>${solo}${c.fn && !solo ? `<div class="fn">${esc(c.fn)}</div>` : ''}${c.sub ? `<div class="fn subnote">${esc(c.sub)}</div>` : ''}`;
  document.getElementById('beats').innerHTML = counting ? '' : Array.from({ length: c.beats }, () => '<i></i>').join('');
  R.shown = { c, prev, counting };
  renderStage();
  if (next) { const l = labelsFor(next); document.getElementById('next').innerHTML = `<span class="lbl">next</span> <b class="cnum">${fmt(l.main)}</b> <b class="cname">${fmt(l.sub)}</b>${D.hint && next.grip ? ` <span class="muted">${esc(gripTag(next.grip))}</span>` : ''}${next.solo ? ` <span class="nsolo">${fmt(SC.scaleTitle(next.solo, next.root))}</span>` : ''}`; }
  if (note) document.getElementById('evo').innerHTML = `<span>Evolved:</span> ${esc(note)}`;
  if (D.src === 'prog' && c.slots) document.getElementById('chart').innerHTML = chartHTML(c.slots, { cur: c.slot, tonic: R.S.tonic });
}
// the neck: off, shown, or waiting (halfway / on tap)
function renderStage() {
  const st = document.getElementById('stage');
  if (!st || !R?.shown) return;
  if (!D.neck) { st.innerHTML = ''; return; }
  if (R.shown.counting || D.diagram === 'now') return revealNeck();
  st.innerHTML = `<div class="hidden">${D.diagram === 'half' ? `Find it… the ${scaleMode() ? 'scale' : 'voicing'} shows halfway through` : 'Find it. Tap here to check.'}</div>`;
}
function revealNeck() {
  if (!R?.shown || !D.neck) return;
  const { c, prev } = R.shown;
  const w = windowFor(R.S, c.grip);
  if (c.solo) {
    // the scale across the area, chord tones in their colours, the rest of the scale as quiet dots
    const notes = SC.scaleNotesIn(c.solo, c.root, c.q, R.S.pos.lo, R.S.pos.hi).map((n) => ({ ...n, kind: n.chord ? KIND(n.iv) : 'sc' }));
    document.getElementById('stage').innerHTML = neckSVG({ notes, lo: w.lo, hi: w.hi }, { ...w, labels: D.labels === 'finger' ? 'iv' : D.labels }) + LEGEND_SCALE;
    return;
  }
  document.getElementById('stage').innerHTML = neckSVG(c.grip, { ...w, prev }) + LEGEND;
}
function finish() {
  closeSheet();
  if (!R) return setup();
  const { S, count, passes } = R;
  const bpm = R.minBpm;
  stop();
  const enough = D.src === 'prog' ? passes >= 1 : count >= 8;
  if (!enough) { R = null; return setup(); }
  const n = normBpm(bpm), tgt = target(), k = doneKey();
  const prevBest = record(k)[S.shapeKey] || 0;
  window.scrollTo(0, 0);
  $app.innerHTML = `
  <header class="chead"><span></span><h1>How was it?</h1><span></span></header>
  <section class="card end">
    <p>${D.src === 'prog' ? `<b>${esc(prog().name)}</b>, ${passes} time${passes === 1 ? '' : 's'} round` : `<b>${count} chords</b>`} in ${fmt(keyLabel(S))}, <b>${shapeWord(S)}</b>, at ${bpm} bpm${n !== bpm ? ` (counts as ${n})` : ''}.</p>
    <p>Was every chord clean and on time?</p>
    <div class="actions"><button class="primary" data-e="yes">✓ Clean</button><button data-e="no">Not yet</button></div>
    <p class="note">${prevBest ? `Best in the ${shapeWord(S)} so far: ${prevBest} bpm.` : `First clean run in the ${shapeWord(S)} gets recorded.`} Fast is ${tgt} bpm. ${n >= tgt ? 'This one counts as fast.' : `${tgt - n} to go.`}${S.shapes.length > 1 ? ' Two-shape runs are logged; the five single shapes are what count towards done.' : ''}</p>
    ${shapeProgress(k, tgt)}
  </section>`;
  $app.onclick = (e) => {
    const b = e.target.closest('[data-e]'); if (!b) return;
    if (b.dataset.e === 'yes') {
      const rec = (D.done[k] ||= {});
      if (n > (rec[S.shapeKey] || 0)) rec[S.shapeKey] = n;
      if (bpm < 220) D.bpm = Math.min(220, bpm + 4);
      save();
      if (complete(k, tgt)) { $app.querySelector('.end').insertAdjacentHTML('beforeend', '<p class="done">✓ Done in all five shapes</p>'); setTimeout(() => { R = null; setup(); }, 1600); return; }
    }
    R = null; setup();
  };
}

// ---------- the chord set: everything that can come up, every version of it in this area ----------
// the key's CAGED shape for the faint background: the tonic chord's notes across the area
function bgFor(S, lo, hi) {
  const t = T.notePc(S.tonic), pcs = [t, (t + (S.minor ? 3 : 4)) % 12, (t + 7) % 12], out = [];
  for (let st = 1; st <= 6; st++) for (let f = lo; f <= hi; f++) { const pc = (F_OPEN[st] + f) % 12; if (pcs.includes(pc)) out.push({ string: st, fret: f, root: pc === t }); }
  return out;
}
const F_OPEN = { 1: 64, 2: 59, 3: 55, 4: 50, 5: 45, 6: 40 };
function sheetChords(S) {
  const groups = [];
  const add = (title, list) => { if (list.length) groups.push({ title, list }); };
  const qsFor = (q, spec, next) => {
    if (D.src === 'prog' && D.pcolour === 'col') {
      const tri = H.toTriad(q);
      const sev = T.getChord(q).ivs.length >= 4 ? q : H.toSeventh(tri, spec.iv, { dominant: !!spec.rel, minorKey: S.minor });
      return H.colourOptions(sev, spec.iv, { toMinor: next ? H.isMinorish(next.q) || E.cls(next.q) === 'hd' : false, minorKey: S.minor });
    }
    return [D.src === 'prog' ? colourise(spec, next, 0, S.minor) : q];
  };
  if (D.src === 'prog') {
    const slots = progSlots(S.minor), seen = new Set(), own = [];
    slots.forEach((x, i) => {
      const next = slots[(i + 1) % slots.length].spec;
      for (const q of qsFor(x.spec.q, x.spec, next)) {
        const k = `${x.spec.iv}:${q}:${x.spec.rel ? x.spec.rel.to : ''}`;
        if (!seen.has(k)) { seen.add(k); own.push({ spec: x.spec, q }); }
      }
    });
    add('In the progression', own);
    if (D.evolve) {
      const subs = [];
      for (const r of E.reachable(slots, S.minor)) for (const q of qsFor(r.spec.q, r.spec, r.next)) {
        const k = `${r.spec.iv}:${q}:${r.spec.rel ? r.spec.rel.to : ''}`;
        if (!seen.has(k)) { seen.add(k); subs.push({ spec: r.spec, q, note: r.why }); }
      }
      add('Substitutes evolving mode can bring in', subs);
    }
  } else if (D.set === 'any') {
    for (const iv of ['1', 'b2', '2', 'b3', '3', '4', '#4', '5', 'b6', '6', 'b7', '7']) add(H.numeral(iv, 'maj').replace(/maj|7/g, ''), H.ANY_QUALITIES[D.colour].map((q) => ({ spec: { iv, q }, q, one: true })));
  } else {
    const byGroup = {};
    for (const e of H.setPool(S.minor ? 'minor' : 'major', D.set)) {
      const qs = D.colour === 'tri' ? [e.tri] : D.colour === 'sev' ? [e.sev] : e.col;
      for (const q of qs) (byGroup[e.group] ||= []).push({ spec: { iv: e.iv, q, rel: e.rel }, q, note: e.tag ? `${e.tag}: ${e.fn}` : e.fn });
    }
    for (const g of ['dia', 'mi', 'chr']) if (byGroup[g]) add(H.GROUP_NAMES[g], byGroup[g]);
  }
  return groups;
}
function versionsFor(S, root, q) {
  if (D.voicing !== 'caged') return G.familyVoicings(root, q, D.voicing, S.pos).inside;
  if (D.mode === 'pos') return G.versionsIn(root, q, S.pos);
  return S.shapes.flatMap((sh) => G.placements(root, q, sh).map((p) => ({ ...p, label: `${sh} shape · fret ${p.rootFret}` })));
}
function sheetHTML(S) {
  const w = usesArea() ? windowFor(S, null) : null;
  const bg = w ? bgFor(S, w.lo, w.hi) : null;
  let html = '';
  for (const grp of sheetChords(S)) {
    html += `<h2 class="sgroup">${fmt(grp.title)}</h2>`;
    for (const c of grp.list) {
      const root = H.spell(S.tonic, c.spec.iv);
      let q = adaptQ(c.q, c.spec, S), vs = versionsFor(S, root, q), plainer = null;
      while (!vs.length && H.simpler(q)) { q = H.simpler(q); vs = versionsFor(S, root, q); plainer = c.q; }
      if (c.one) vs = vs.slice(0, 1);
      html += `<div class="schord"><div class="shead"><b class="cnum">${fmt(H.label(c.spec, q))}</b><span class="cname">${fmt(H.chordName(root, q))}</span>${c.note ? `<small>${esc(c.note)}</small>` : ''}${plainer ? `<small class="warn">no ${fmt(T.pretty(T.getChord(plainer).sym))} grip here</small>` : ''}</div>`;
      html += vs.length ? `<div class="sgrid">${vs.map((v) => {
        const win = w || { lo: Math.max(0, v.lo - 1), hi: v.lo + 4 };
        return `<figure class="sv${v.kind === 'caged' || !v.kind ? ' caged' : ''}">${neckSVG(v, { lo: win.lo, hi: win.hi, band: w ? S.pos : null, tiny: true, bg, labels: 'iv' })}<figcaption>${esc(v.label)}</figcaption></figure>`;
      }).join('')}</div>` : '<p class="note">Nothing fits here.</p>';
      html += '</div>';
    }
  }
  return html;
}
function openSheet() {
  const el = document.getElementById('sheet');
  if (!el || !R) return;
  if (!R.sheet) R.sheet = scaleMode() ? scaleListHTML(R.S) : sheetHTML(R.S);
  if (scaleMode()) {
    el.innerHTML = `<div class="sheet-head"><div><b>Scale options</b><small>${fmt(keyLabel(R.S))} · ${fmt(posLabel(R.S))}</small></div><button class="icon" data-r="close-sheet" aria-label="Close">✕</button></div>
    <p class="note">Every chord that can come up and every scale that works over it, easiest first. Your level is highlighted; the run picks from it.</p>${R.sheet}`;
  } else el.innerHTML = `<div class="sheet-head"><div><b>Chord set</b><small>${fmt(keyLabel(R.S))} · ${fmt(posLabel(R.S))}</small></div><button class="icon" data-r="close-sheet" aria-label="Close">✕</button></div>
  <p class="note">Every chord that can come up, and ${D.voicing === 'caged' || D.voicing === 'any' ? `every version of it ${usesArea() ? 'inside the area' : 'in the shape'}: the CAGED grip${usesArea() ? ', then triads or drop voicings on each string set and inversion' : ' wherever it lands'}` : `every ${esc(G.voicingById(D.voicing).name.toLowerCase())} voicing of it inside the area (the run picks the one nearest the last chord)`}.${usesArea() ? ' The key’s own shape is the faint dots behind.' : ''}</p>${LEGEND}${R.sheet}`;
  el.hidden = false;
  el.scrollTop = 0;
  document.body.classList.add('locked');
}
function closeSheet() {
  const el = document.getElementById('sheet');
  if (el) el.hidden = true;
  document.body.classList.remove('locked');
}

// ---------- scale mode ----------
const LEVEL_NAME = { 1: 'Easy', 2: 'Medium', 3: 'Hard', 4: 'Exotic' };
const LEGEND_SCALE = '<div class="legend"><span class="k r">root</span><span class="k t3">3rd</span><span class="k t5">5th</span><span class="k t7">7th</span><span class="k tx">chord colour</span><span class="k sc">rest of the scale</span></div>';
function soloHTML(c) {
  const x = c.solo;
  const from = [x.scale.alias, x.note].filter(Boolean).join(' · ');
  return `<div class="solo lv${x.level}"><div class="solo-top"><small>Solo with</small><span class="lvl">${LEVEL_NAME[x.level]}</span></div><b>${fmt(SC.scaleTitle(x, c.root))}</b>${from ? `<i>${fmt(from)}</i>` : ''}<p>${fmt(x.sentence)}</p></div>`;
}
function scaleListHTML(S) {
  let html = '';
  const tpc = T.notePc(S.tonic);
  for (const grp of sheetChords(S)) {
    html += `<h2 class="sgroup">${fmt(grp.title)}</h2>`;
    for (const c of grp.list) {
      const root = H.spell(S.tonic, c.spec.iv);
      const all = SC.scalesFor(c.spec.iv, c.q, S.minor, tpc);
      html += `<div class="schord"><div class="shead"><b class="cnum">${fmt(H.label(c.spec, c.q))}</b><span class="cname">${fmt(H.chordName(root, c.q))}</span>${c.note ? `<small>${esc(c.note)}</small>` : ''}</div>`;
      for (const lv of [1, 2, 3, 4]) {
        const xs = all.filter((x) => x.level === lv);
        if (!xs.length) continue;
        html += `<div class="slevel${D.scaleLevel === 'any' || Number(D.scaleLevel) === lv ? ' cur' : ''}"><span class="lvl">${LEVEL_NAME[lv]}</span>${xs.map((x) => {
          const from = [x.scale.alias, x.note].filter(Boolean).join(' · ');
          return `<div class="sopt"><b>${fmt(SC.scaleTitle(x, root))}</b>${from ? ` <i>${fmt(from)}</i>` : ''}<p>${fmt(x.sentence)}</p></div>`;
        }).join('')}</div>`;
      }
      html += '</div>';
    }
  }
  return html;
}
function scaleWalkthrough(S) {
  const title = D.src === 'prog' ? prog().name : H.SETS[D.kt].find((s) => s.id === D.set).name;
  $app.innerHTML = `
  <header class="chead"><button class="icon" data-w="back" aria-label="Back">‹</button><h1>Scale options</h1><span></span></header>
  <p class="lead"><b>${esc(title)}</b> · ${fmt(keyLabel(S))}. Every scale that works over each chord, from easy to exotic, with what it sounds like here.</p>
  ${D.src === 'prog' ? chartHTML(progSlots(S.minor), { tonic: S.tonic }) : ''}
  ${namesButton('w')}
  <div class="scalelist">${scaleListHTML(S)}</div>`;
  applyNames();
  $app.onclick = (e) => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.w === 'back') return setup();
    if (b.dataset.w === 'names' || b.dataset.w === 'nums') { flipLabel(b.dataset.w); save(); applyNames(); }
  };
  window.scrollTo(0, 0);
}

// ---------- walkthrough: every chord in the set or progression, with its grip ----------
function walkItems(S) {
  const items = [];
  let prev = null;
  if (D.src === 'prog') {
    const slots = progSlots(S.minor);
    const seen = new Set();
    slots.forEach((x, i) => {
      const q = colourise(x.spec, slots[(i + 1) % slots.length].spec, x.oid, S.minor);
      const key = `${x.spec.iv}:${q}:${x.spec.rel ? x.spec.rel.to : ''}`;
      const c = realise(S, x.spec, q, prev, { vl: prog().vl });
      prev = c.grip;
      if (seen.has(key)) return;
      seen.add(key);
      items.push({ ...c, group: '' });
    });
    return items;
  }
  if (D.set === 'any') {
    for (const q of H.ANY_QUALITIES[D.colour]) items.push({ ...realise(S, { iv: '1', q }, q, null), group: `Every chord type on ${T.noteName(S.tonic, true)}, in this position` });
    return items;
  }
  for (const e of H.setPool(S.minor ? 'minor' : 'major', D.set)) {
    const qs = D.colour === 'tri' ? [e.tri] : D.colour === 'sev' ? [e.sev] : e.col;
    for (const q of qs) items.push({ ...realise(S, { iv: e.iv, q, rel: e.rel }, q, null, { fn: e.fn, tag: e.tag }), group: H.GROUP_NAMES[e.group] });
  }
  return items;
}
function walkthrough() {
  stop();
  const S = session();
  if (scaleMode()) return scaleWalkthrough(S);
  const items = walkItems(S);
  const title = D.src === 'prog' ? prog().name : H.SETS[D.kt].find((s) => s.id === D.set).name;
  let html = '', group = null;
  items.forEach((c, i) => {
    if (c.group && c.group !== group) { if (group !== null) html += '</div>'; html += `<h2 class="wgroup">${esc(c.group)}</h2><div class="cards">`; group = c.group; }
    else if (i === 0) html += '<div class="cards">';
    html += `<button class="wcard" data-i="${i}"><div class="wtop"><b class="cnum">${fmt(c.rn)}</b><span class="cname">${fmt(c.name)}</span></div>${neckSVG(c.grip, { ...windowFor(S, c.grip), small: true })}<div class="wmeta">${esc(gripTag(c.grip))}${c.tag ? ` · ${esc(c.tag)}` : ''}${c.plainer ? ` · <i>plainer: no ${fmt(T.pretty(T.getChord(c.plainer).sym))} grip here</i>` : ''}</div>${c.fn ? `<div class="wfn">${esc(c.fn)}</div>` : ''}</button>`;
  });
  html += '</div>';
  $app.innerHTML = `
  <header class="chead"><button class="icon" data-w="back" aria-label="Back">‹</button><h1>Walkthrough</h1><span></span></header>
  <p class="lead"><b>${esc(title)}</b> · ${fmt(keyLabel(S))} · ${fmt(posLabel(S))}${D.src === 'set' ? ` · ${esc(H.COLOURS.find((c) => c.id === D.colour).name.toLowerCase())}` : ''}. Play through steps along at your tempo.</p>
  ${D.src === 'prog' ? chartHTML(progSlots(S.minor), { tonic: S.tonic }) : ''}
  <div class="actions"><button class="primary" data-w="play">▶ Play through</button></div>
  ${namesButton('w')}
  ${LEGEND}
  ${html}`;
  applyNames();
  let playing = null;
  const mark = (i) => {
    $app.querySelectorAll('.wcard').forEach((el) => el.classList.toggle('on', Number(el.dataset.i) === i));
  };
  $app.onclick = async (e) => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.w === 'back') { clearTimeout(playing); return setup(); }
    if (b.dataset.w === 'names' || b.dataset.w === 'nums') { flipLabel(b.dataset.w); save(); return applyNames(); }
    if (b.dataset.w === 'play') {
      if (playing !== null) { clearTimeout(playing); playing = null; b.textContent = '▶ Play through'; return; }
      b.textContent = '■ Stop';
      let i = 0;
      const step = () => {
        if (i >= items.length) { playing = null; b.textContent = '▶ Play through'; return; }
        mark(i);
        $app.querySelector(`.wcard[data-i="${i}"]`)?.scrollIntoView({ block: 'center', behavior: 'smooth' });
        i++;
        playing = setTimeout(step, Math.max(900, 2 * 60000 / D.bpm));
      };
      step();
      return;
    }
    if (b.dataset.i !== undefined) mark(Number(b.dataset.i));
  };
  window.scrollTo(0, 0);
}

document.addEventListener('keydown', (e) => {
  if (!R || R.stopped) return;
  if (e.code === 'Space') { e.preventDefault(); const b = $app.querySelector('[data-r="pause"]'); if (b) togglePause(b); }
  if (e.code === 'Escape') finish();
});
setup();
if ('serviceWorker' in navigator && location.protocol !== 'file:') navigator.serviceWorker.register('sw.js').catch(() => {});
