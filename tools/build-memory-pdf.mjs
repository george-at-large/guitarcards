#!/usr/bin/env node
// Builds the printed companion to the Memory pack: guide/memory-essentials.html -> guide/memory-essentials.pdf
// (headless Chrome, A4). Only what is worth memorising: the circle of fifths, every modal-interchange chord in a
// major and a minor key with its source modes, the interval structure of every scale and of the chords of melodic
// and harmonic minor, superimposition (what and why), and a daily recall checklist. No 12-key grids.
// Everything musical is computed: borrowed chords from the engine's modes (src/memory/engine.js), scale formulas
// from src/theory.js SCALES (cross-checked against the engine), superimpositions from src/superimpose.js and the
// stock moves from content/core.js.
//
//   node tools/build-memory-pdf.mjs          build HTML + PDF (repeated passes so the contents page gets page numbers)
//   node tools/build-memory-pdf.mjs --html   build the HTML only
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

globalThis.window ??= globalThis;
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const imp = (p) => import(pathToFileURL(path.join(ROOT, p)).href);
const E = await imp('src/memory/engine.js');
const T = await imp('src/theory.js');
const { UNITS } = await imp('src/memory/cards.js');
const SI = await imp('src/superimpose.js');
const { MI_MOVES } = await imp('content/core.js');

const OUT_DIR = path.join(ROOT, 'guide');
const HTML = path.join(OUT_DIR, 'memory-essentials.html');
const PDF = path.join(OUT_DIR, 'memory-essentials.pdf');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const ACC = '#0f766e';

// ---------------------------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------------------------
const { N, nm, up } = E;
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const inl = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\*(.+?)\*/g, '<i>$1</i>');
const assert = (c, msg) => { if (!c) throw new Error('Memory PDF check failed: ' + msg); };
const pd = E.prettyDeg;
const pf = (toks) => toks.map(pd).join(' ');
const list = (ns, sep = ' ') => ns.map(nm).join(sep);
const sigLabel = (k) => { const s = E.SIG[k]; return s === 0 ? '—' : s > 0 ? `${s}♯` : `${-s}♭`; };

const table = (head, rows, cls = '', rowCls = []) => `<table class="${cls}"><thead><tr>${head.map((h) => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map((r, i) => `<tr${rowCls[i] ? ` class="${rowCls[i]}"` : ''}>${r.map((c) => `<td>${c ?? ''}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
const h3 = (s, id = '', cls = '') => `<h3${id ? ` id="${id}"` : ''}${cls ? ` class="${cls}"` : ''}>${s}</h3>`;
const h4 = (s) => `<h4>${s}</h4>`;
const p = (s, cls = '') => `<p class="${cls}">${inl(s)}</p>`;
const ul = (items, cls = '') => `<ul class="${cls}">${items.map((i) => `<li>${inl(i)}</li>`).join('')}</ul>`;
const ol = (items, cls = '') => `<ol class="${cls}">${items.map((i) => `<li>${inl(i)}</li>`).join('')}</ol>`;
const two = (a, b) => `<div class="two"><div>${a}</div><div>${b}</div></div>`;
const keep = (s) => `<div class="keep">${s}</div>`;
const callout = (s) => `<div class="callout">${s}</div>`;
const small = (s) => `<small>${s}</small>`;

// the unit explainers from cards.js, as prose (markdown tables dropped)
const UNIT = Object.fromEntries(UNITS.map((u) => [u.id, u]));
function mdProse(src) {
  const out = [];
  let para = [], li = null, oli = null;
  const flush = () => {
    if (para.length) out.push(`<p>${inl(para.join(' '))}</p>`);
    if (li) out.push(`<ul>${li.map((x) => `<li>${inl(x)}</li>`).join('')}</ul>`);
    if (oli) out.push(`<ol>${oli.map((x) => `<li>${inl(x)}</li>`).join('')}</ol>`);
    para = []; li = null; oli = null;
  };
  for (const raw of src.split('\n')) {
    const line = raw.trim();
    if (!line || line.startsWith('|')) { flush(); continue; }
    let m;
    if ((m = /^#{1,4} (.*)$/.exec(line))) { flush(); out.push(`<h4>${inl(m[1])}</h4>`); continue; }
    if ((m = /^- (.*)$/.exec(line))) { if (para.length || oli) flush(); (li ??= []).push(m[1]); continue; }
    if ((m = /^\d+\. (.*)$/.exec(line))) { if (para.length || li) flush(); (oli ??= []).push(m[1]); continue; }
    if (li || oli) flush();
    para.push(line);
  }
  flush();
  return `<div class="prose">${out.join('')}</div>`;
}
const ruleBox = (id) => `<div class="rule"><span class="rid">Rule</span> ${inl(UNIT[id].rule)}</div>`;

// sections (subs: extra contents-page entries pointing at h3 ids inside the section)
const SECTIONS = [];
function section(part, id, num, title, body, { lead = '', subs = [] } = {}) {
  SECTIONS.push({ part, id, num, title, subs, html: `<section class="sec" id="${id}"><div class="partband">${esc(part)}</div><h2>${num ? `<span class="num">${num}</span>` : ''}${title}</h2>${lead ? `<p class="lead">${inl(lead)}</p>` : ''}${body}</section>` });
}

// ---------------------------------------------------------------------------------------------
// chord analysis: interval tokens, qualities, roman numerals
// ---------------------------------------------------------------------------------------------
const MAJ_SEMI = [0, 2, 4, 5, 7, 9, 11];
// interval token from root up to x, by letter distance first (so a 3rd is always a 3rd: b3, 3, #5, bb7 …)
function tokOf(root, x) {
  const ld = (((x.letter - root.letter) % 7) + 7) % 7;
  let diff = (((E.pc(x) - E.pc(root) - MAJ_SEMI[ld]) % 12) + 12) % 12; if (diff > 6) diff -= 12;
  return ({ '-2': 'bb', '-1': 'b', 0: '', 1: '#', 2: '##' })[diff] + (ld + 1);
}
const Q7 = [['maj7', '1 3 5 7'], ['m7', '1 b3 5 b7'], ['7', '1 3 5 b7'], ['m7b5', '1 b3 b5 b7'], ['dim7', '1 b3 b5 bb7'], ['mMaj7', '1 b3 5 7'], ['maj7#5', '1 3 #5 7'], ['7#5', '1 3 #5 b7']];
const Q3 = [['maj', '1 3 5'], ['min', '1 b3 5'], ['dim', '1 b3 b5'], ['aug', '1 3 #5']];
const qOf = (toks, tbl) => (tbl.find(([, f]) => f === toks.join(' ')) || [null])[0];
const SYM7 = { maj7: 'maj7', m7: 'm7', 7: '7', m7b5: 'm7♭5', dim7: '°7', mMaj7: 'm(maj7)', 'maj7#5': 'maj7♯5', '7#5': '7♯5' };
const RSUF7 = { maj7: 'maj7', m7: 'm7', 7: '7', m7b5: 'ø7', dim7: '°7', mMaj7: '(maj7)', 'maj7#5': 'maj7♯5', '7#5': '7♯5' };
const SYM3 = { maj: '', min: 'm', dim: '°', aug: '+' };
const RSUF3 = { maj: '', min: '', dim: '°', aug: '+' };
const QNAME7 = { maj7: 'major 7', m7: 'minor 7', 7: 'dominant 7', m7b5: 'half-diminished', dim7: 'diminished 7', mMaj7: 'minor-major 7', 'maj7#5': 'major 7 ♯5', '7#5': 'dominant 7 ♯5' };
const MINORISH = (q) => ['m7', 'm7b5', 'dim7', 'mMaj7', 'min', 'dim'].includes(q);
const ROM = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
// numerals relative to the major scale of the tonic (the app's convention): lower case = minor 3rd
function roman(degTok, q, triad = false) {
  const { d, acc } = E.parseDeg(degTok);
  const R = MINORISH(q) ? ROM[d - 1].toLowerCase() : ROM[d - 1];
  return (acc < 0 ? '♭'.repeat(-acc) : '♯'.repeat(acc)) + R + (triad ? RSUF3[q] : RSUF7[q]);
}
const sym7 = (root, q) => nm(root) + SYM7[q];
const sym3 = (root, q) => nm(root) + SYM3[q];

// the seven diatonic 7th chords of a mode on a tonic, with their triads
function diatonic(tonic, modeId) {
  const f = E.formula(modeId), notes = E.spell(tonic, modeId);
  return notes.map((r, i) => {
    const tones = [0, 2, 4, 6].map((k) => notes[(i + k) % 7]);
    const toks = tones.map((x) => tokOf(r, x));
    const q = qOf(toks, Q7), q3 = qOf(toks.slice(0, 3), Q3);
    assert(q && q3, `unrecognised chord ${toks.join(' ')} on degree ${i + 1} of ${modeId}`);
    return { i, deg: f[i], root: r, q, q3, toks, tones, rn: roman(f[i], q), rn3: roman(f[i], q3, true), sym: sym7(r, q), sym3: sym3(r, q3) };
  });
}

// ---------------------------------------------------------------------------------------------
// modal interchange: computed from the parallel modes
// ---------------------------------------------------------------------------------------------
const PAR = ['ionian', 'lydian', 'mixolydian', 'dorian', 'aeolian', 'phrygian', 'locrian', 'harmonic-minor', 'melodic-minor'];
const MNAME = { ionian: 'Ionian (major)', lydian: 'Lydian', mixolydian: 'Mixolydian', dorian: 'Dorian', aeolian: 'Aeolian', phrygian: 'Phrygian', locrian: 'Locrian', 'harmonic-minor': 'harmonic minor', 'melodic-minor': 'melodic minor' };
const MSHORT = { ...MNAME, ionian: 'Ionian', 'harmonic-minor': 'harm. minor', 'melodic-minor': 'mel. minor' };
const pcsOf = (notes) => new Set(notes.map(E.pc));
const contains = (tonic, modeId, notes) => { const s = pcsOf(E.spell(tonic, modeId)); return notes.every((x) => s.has(E.pc(x))); };
const sourcesOf = (tonic, home, notes) => PAR.filter((m) => m !== home && contains(tonic, m, notes));

function interchange(tonic, home) {
  const H = diatonic(tonic, home);
  const map = new Map();
  const byMode = {};
  for (const m of PAR.filter((x) => x !== home)) {
    byMode[m] = [];
    for (const c of diatonic(tonic, m)) {
      const h = H[c.i];
      if (h.q === c.q && E.same(h.root, c.root)) continue; // the home key's own chord
      byMode[m].push(c);
      if (!map.has(c.rn)) map.set(c.rn, { ...c, src: [], sameTriad: E.same(h.root, c.root) && h.q3 === c.q3, homeRn3: h.rn3 });
      map.get(c.rn).src.push(m);
    }
  }
  for (const b of map.values()) {
    // cross-check: the grouped sources are exactly the parallel modes that contain every note of the chord
    const byNotes = sourcesOf(tonic, home, b.tones);
    assert(byNotes.join() === b.src.join(), `sources of ${b.rn}: ${b.src} vs ${byNotes}`);
    b.src3 = sourcesOf(tonic, home, b.tones.slice(0, 3));
  }
  return { H, chords: map, byMode };
}
// a chord outside the 7th-chord sets (e.g. ivm6), with its sources computed from its notes
function extra(tonic, home, degTok, toks, sym) {
  const r = up(tonic, degTok), tones = toks.split(' ').map((t) => up(r, t));
  return { r, name: nm(r) + sym, src: sourcesOf(tonic, home, tones) };
}
const srcList = (src) => src.map((m) => MSHORT[m]).join(', ');

const C = N('C');
const MAJ = interchange(C, 'ionian');
const MIN = interchange(C, 'aeolian');

// spot checks from the brief (fail the build if the engine ever disagrees)
{
  const g = (I, rn) => { const c = I.chords.get(rn); assert(c, `missing ${rn}`); return c; };
  assert(g(MAJ, '♭VImaj7').sym === 'A♭maj7' && ['aeolian', 'phrygian', 'harmonic-minor'].every((m) => g(MAJ, '♭VImaj7').src.includes(m)), '♭VImaj7 = A♭maj7 from Aeolian/Phrygian/harm. minor');
  assert(g(MAJ, '♭VII7').sym === 'B♭7' && g(MAJ, '♭VII7').src.join() === 'aeolian', '♭VII7 = B♭7 from Aeolian only');
  assert(g(MAJ, 'II7').sym === 'D7' && g(MAJ, 'II7').src.join() === 'lydian', 'II7 = D7 from Lydian');
  assert(!g(MAJ, 'ivm7').src.includes('dorian'), 'Dorian has a major IV, so it does not lend ivm7');
  assert(g(MIN, 'V7').src.includes('harmonic-minor') && g(MIN, 'IV7').src.includes('dorian'), 'minor V7 / IV7 sources');
}

// usage notes, in order of usefulness; core = know these cold. Every computed chord must have one and vice versa.
const MAJ_USE = [
  ['ivm7', 1, 'Minor plagal: IV–iv–I, the 6 of the key sighs down to ♭6, then to 5. The triad iv is the common form.'],
  ['♭VImaj7', 1, 'Deceptive cadence V7 → ♭VImaj7 (bass 5 → ♭6); and ♭VI–♭VII–I, the triumphant “Mario” cadence.'],
  ['♭VII7', 1, 'The backdoor dominant: ivm7–♭VII7–Imaj7, a softer arrival than V7–I (♭6 → 5 instead of 7 → 1).'],
  ['♭IIImaj7', 1, 'I–♭III–IV rock and blues climb (the blues ♭3 as a chord); opens the Dameron turnaround.'],
  ['iiø7', 1, 'Minor ii in a major key: iiø7–V7♭9–Imaj7, a darker, more urgent approach to I.'],
  ['vm7', 1, 'Mixolydian v: I–v–IV–I (no leading tone, so nothing pulls); also the ii of IV (vm7–I7–IVmaj7).'],
  ['♭IImaj7', 1, 'Neapolitan ♭II–V7–I, or ♭IImaj7 → Imaj7 directly (the same bass as a tritone sub).'],
  ['II7', 1, 'Lydian II: I–II–IV–I as colour, not resolving to V (♯4 falls back to 4). Resolving to V it is V7/V.'],
  ['♭VIImaj7', 1, 'I–♭VII–I and the double plagal I–♭VII–IV–I; the maj7 form is the Mixolydian/Dorian colour.'],
  ['im7', 1, 'The parallel switch: Imaj7 → im7, a whole section moves to the minor side of the same tonic.'],
  ['vii°7', 0, 'Leading-tone diminished into I (vii°7–I); also a common-tone passing chord.'],
  ['I7', 0, 'Same chord as V7/IV: I7–IVmaj7; and the blues tonic.'],
  ['IV7', 0, 'The blues IV7 (I7–IV7), and IV7–I as a bluesy plagal cadence.'],
  ['♭VI7', 0, 'Tritone sub of II7 (V7/V): ♭VI7–V7; also ♭VI7–I as a backdoor variant.'],
  ['♭viim7', 0, 'ii of ♭VI: ♭viim7–♭III7–♭VImaj7, a common modulating bridge move.'],
  ['♭III7', 0, 'Tritone sub of VI7 (V7/ii): ♭III7–iim7; and V7 of ♭VI.'],
  ['viø7', 0, 'Minor ii–V into V: viø7–II7–V7. Same notes as im6 with the 6 in the bass.'],
  ['i(maj7)', 0, 'Minor line cliché on the parallel-minor tonic: im–i(maj7)–im7–im6.'],
  ['♭iiim7', 0, 'Chromatic ii–Vs falling: iiim7–♭iiim7–iim7; ii of the ♭VI7.'],
  ['vø7', 0, 'ii of a minor iv: vø7–I7♭9–ivm7.'],
  ['♯ivø7', 0, 'Rising bass IV–♯ivø7–I/5 (4 → ♯4 → 5); ii of iii: ♯ivø7–VII7–iiim7.'],
  ['iiiø7', 0, 'ii of a minor ii: iiiø7–VI7♭9–iim7.'],
  ['iø7', 0, 'ii of ♭VII: iø7–IV7–♭VIImaj7. Rare as a tonic.'],
  ['viim7', 0, 'Rare: Lydian colour; a brighter ii into vi (viim7–III7–vim7).'],
  ['Vmaj7', 0, 'Rare: Lydian vamps (Imaj7–Vmaj7); no ♭7, so no dominant pull.'],
  ['♭Vmaj7', 0, 'Rare: a distant, dark colour a tritone from the tonic (film, modern writing).'],
  ['♭IIImaj7♯5', 0, 'Rare: really a rootless i(maj9); a colour voicing of the minor tonic.'],
];
const MIN_USE = [
  ['V7', 1, 'The real dominant: V7–im, usually V7♭9; minor ii–V–i = iiø7–V7–im.'],
  ['vii°7', 1, 'Leading-tone diminished: vii°7–im; it is V7♭9 without its root.'],
  ['Imaj7', 1, 'Picardy third: end a minor piece on a major I (triad or maj7); the switch to the parallel major.'],
  ['IV7', 1, 'Dorian vamp im7–IV7: the ♮6 (3rd of IV) brightens the minor. Funk, soul-jazz, modal tunes.'],
  ['iim7', 1, 'Dorian / melodic-minor ii: iim7–V7–im, softer than iiø7; iim7–IV7 vamps.'],
  ['♭IImaj7', 1, 'Neapolitan ♭II–V7–im, or ♭II–im directly (Phrygian, flamenco, metal).'],
  ['i(maj7)', 1, 'The jazz minor tonic and the line cliché im–i(maj7)–im7–im6.'],
  ['viø7', 1, 'Same notes as im6 with the ♮6 in the bass: line clichés and Dorian minor tunes.'],
  ['I7', 1, 'V7/iv: I7–ivm7, the major-3rd turn into iv.'],
  ['♭VI7', 1, 'Augmented-6th sound: ♭VI7–V7, the tritone sub of II7 (V7/V).'],
  ['II7', 0, 'V7/V: II7–V7–im; from Lydian it is pure colour.'],
  ['IVmaj7', 0, 'The major IV as a maj7: brighter, rarer than IV7.'],
  ['♭VIImaj7', 0, '♭VII as a maj7 instead of the natural ♭VII7: softer, for modal minor vamps.'],
  ['viiø7', 0, 'A rootless V9: passing chord into im.'],
  ['♭III7', 0, 'V7 of ♭VI: ♭III7–♭VImaj7; tritone sub of VI7.'],
  ['♭viim7', 0, 'ii of ♭VI: ♭viim7–♭III7–♭VImaj7.'],
  ['vø7', 0, 'ii of iv: vø7–I7♭9–ivm7.'],
  ['♯ivø7', 0, 'Rising bass iv–♯ivø7–V (4 → ♯4 → 5).'],
  ['iiim7', 0, 'Parallel-major colour: appears when the music turns to the major side.'],
  ['vim7', 0, 'Parallel-major vi; with the ♮6 in the bass it leans Dorian.'],
  ['iiiø7', 0, 'ii of ii: iiiø7–VI7–iim7.'],
  ['iø7', 0, 'The darkest tonic (Locrian); ii of ♭VII: iø7–IV7–♭VII.'],
  ['♭iiim7', 0, 'ii of ♭II: ♭iiim7–♭VI7–♭IImaj7.'],
  ['Vmaj7', 0, 'Rare: Lydian colour; no ♭7, so no dominant pull.'],
  ['viim7', 0, 'Rare: Lydian colour.'],
  ['♭Vmaj7', 0, 'Rare: tritone colour (film, metal).'],
  ['♭IIImaj7♯5', 0, 'Rare: the harmonic/melodic-minor ♭III, really a rootless i(maj9).'],
];
for (const [I, U, tag] of [[MAJ, MAJ_USE, 'major'], [MIN, MIN_USE, 'minor']]) {
  const a = [...I.chords.keys()].sort().join(), b = U.map((u) => u[0]).sort().join();
  assert(a === b, `${tag}-key usage notes do not match the computed chords:\n computed ${a}\n notes    ${b}`);
}

function checklist(I, U, keyLabel) {
  const rowsFor = (items) => items.map(([rn, , use]) => {
    const c = I.chords.get(rn);
    const tri = c.sameTriad
      ? `<span class="enh">same triad as the key (${c.homeRn3}); only the 7th is borrowed</span>`
      : `<b>${c.rn3}</b> ${small(c.sym3)}${c.src3.join() !== c.src.join() ? `<br><span class="enh">triad also in ${srcList(c.src3.filter((m) => !c.src.includes(m)))}</span>` : ''}`;
    return ['<span class="box">☐</span>', `<b class="rn">${c.rn}</b>`, c.sym, tri, srcList(c.src), use];
  });
  const head = ['', 'Chord', keyLabel, 'Triad form', 'From', 'When it’s used'];
  const core = U.filter((u) => u[1]), rest = U.filter((u) => !u[1]);
  return { core: table(head, rowsFor(core), 'ckt core'), rest: table(head, rowsFor(rest), 'ckt'), n: U.length, nCore: core.length };
}
// what each parallel mode lends, against the home scale
function lendsTable(I, home, homeName, coreSet) {
  const hf = E.formula(home);
  const order = PAR.filter((m) => m !== home);
  const rows = order.map((m) => {
    const f = E.formula(m);
    const diff = f.map((t, i) => (t === hf[i] ? null : (/^\d/.test(t) ? '♮' + t : pd(t)))).filter(Boolean);
    const lends = I.byMode[m].map((c) => `<span class="nw">${coreSet.has(c.rn) ? `<b>${c.rn}</b>` : c.rn} <small>${c.sym}</small></span>`).join(', ');
    return [`<b>${MNAME[m]}</b>`, `<span class="nw">${diff.join(' ')}</span>`, lends || '—'];
  });
  return table(['Parallel mode', `vs ${homeName}`, 'Chords it lends (bold = core)'], rows, 'z lends');
}
// stock moves from content/core.js
const QSUF = { maj: '', min: '', m7: 'm7', m6: 'm6', maj7: 'maj7', 7: '7', '7b9': '7♭9', m7b5: 'ø7' };
function chartRoman(chart) {
  return chart.split('|').map((s) => s.trim()).filter(Boolean).map((bar) => bar.split(/\s+/).map((tok) => {
    if (tok === '%') return '%';
    const [h, q] = tok.split(':');
    assert(q in QSUF, `chart quality ${q}`);
    return T.prettyRoman(h) + QSUF[q];
  }).join(' ')).join(' │ ');
}
const isMinorMove = (m) => /^\|\s*i:/.test(m.chart);
const movesTable = (moves) => table(['Move', 'Chart', 'From', 'The voice that moves', 'Where you hear it'],
  moves.map((m) => [`<b>${esc(m.name)}</b>`, `<span class="chart">${chartRoman(m.chart)}</span>`, esc(m.source), esc(m.voice), `<span class="where">${esc(m.where)}</span>`]), 'z moves');

// ---------------------------------------------------------------------------------------------
// 1 · CIRCLE OF FIFTHS (the existing page)
// ---------------------------------------------------------------------------------------------
function circleSVG({ size = 330 } = {}) {
  const c = size / 2, rO = size * 0.385, rI = size * 0.255, rS = size * 0.47;
  const maj = E.MAJOR_KEYS.map((k, i) => (i === 5 ? 'B / C♭' : i === 6 ? 'F♯ / G♭' : i === 7 ? 'D♭ / C♯' : nm(N(k))));
  const min = E.MINOR_KEYS.map((k, i) => (i === 5 ? 'G♯m / A♭m' : i === 6 ? 'D♯m / E♭m' : i === 7 ? 'B♭m / A♯m' : nm(N(k)) + 'm'));
  const sig = E.MAJOR_KEYS.map((k, i) => (i === 0 ? '0' : i === 5 ? '5♯ · 7♭' : i === 6 ? '6♯ · 6♭' : i === 7 ? '5♭ · 7♯' : sigLabel(k)));
  const pt = (r, i) => [c + r * Math.sin((i * Math.PI) / 6), c - r * Math.cos((i * Math.PI) / 6)];
  let s = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">`;
  s += `<circle cx="${c}" cy="${c}" r="${(rO + rS) / 2 - 2}" fill="none" stroke="#d9e7e5" stroke-width="1"/><circle cx="${c}" cy="${c}" r="${(rO + rI) / 2}" fill="none" stroke="#d9e7e5" stroke-width="1"/><circle cx="${c}" cy="${c}" r="${rI - size * 0.06}" fill="none" stroke="#d9e7e5" stroke-width="1"/>`;
  for (let i = 0; i < 12; i++) {
    const [x1, y1] = pt(rI - size * 0.06, i + 0.5), [x2, y2] = pt((rO + rS) / 2 - 2, i + 0.5);
    s += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#e6efee" stroke-width="1"/>`;
    const [xo, yo] = pt(rO, i), [xi, yi] = pt(rI, i), [xs, ys] = pt(rS, i);
    s += `<text x="${xo}" y="${yo + 5}" text-anchor="middle" font-size="${maj[i].length > 3 ? size * 0.04 : size * 0.055}" font-weight="700" fill="${i === 0 ? ACC : '#1b1b1b'}">${maj[i]}</text>`;
    s += `<text x="${xi}" y="${yi + 4}" text-anchor="middle" font-size="${min[i].length > 4 ? size * 0.03 : size * 0.04}" fill="#444">${min[i]}</text>`;
    s += `<text x="${xs}" y="${ys + 3}" text-anchor="middle" font-size="${size * 0.03}" fill="${ACC}">${sig[i]}</text>`;
  }
  s += `<text x="${c}" y="${c - 3}" text-anchor="middle" font-size="${size * 0.03}" fill="#666">clockwise: 5th up, +1♯</text><text x="${c}" y="${c + 9}" text-anchor="middle" font-size="${size * 0.03}" fill="#666">anticlockwise: 4th up, +1♭</text>`;
  return s + '</svg>';
}
{
  const KEY15 = Object.keys(E.SIG).sort((a, b) => { const x = E.SIG[a], y = E.SIG[b]; return (x < 0) - (y < 0) || Math.abs(x) - Math.abs(y); });
  const rows = KEY15.map((k) => {
    const s = E.SIG[k], sig = E.sigNotes(k), key = N(k);
    const last = sig.at(-1);
    const how = s > 0 ? `last sharp ${nm(last)} + semitone = ${nm(key)}` : s === -1 ? 'one flat: memorise F' : s < 0 ? `second-to-last flat: ${nm(sig.at(-2))}` : '—';
    const added = s > 0 ? `${nm(last)} = 7th of ${nm(key)}` : s < 0 ? `${nm(last)} = 4th of ${nm(key)}` : '—';
    return [`<b>${nm(key)}</b>`, sigLabel(k), sig.length ? list(sig) : '—', added, nm(up(key, '6')) + 'm', how];
  });
  const body = ruleBox('A2')
    + `<div class="trigrid"><div>${circleSVG()}</div><div>${mdProse(UNIT.A2.md)}</div></div>`
    + h3('Key signatures: all 15 spellings') + table(['Major key', 'Sig.', 'Accidentals, in order', 'Newest accidental', 'Rel. minor', 'Naming shortcut'], rows, 'z sig')
    + two(callout('<b>Order of sharps:</b> F C G D A E B &nbsp;·&nbsp; <b>Order of flats:</b> B E A D G C F (the same backwards).'), callout('<b>Enharmonic pairs on the circle:</b> B = C♭ (5♯ / 7♭), F♯ = G♭ (6♯ / 6♭), C♯ = D♭ (7♯ / 5♭). Sharps + flats of the pair always add to 12.'));
  section('Keys', 'circle', '1', 'Circle of fifths', body);
}

// ---------------------------------------------------------------------------------------------
// 2 · MODAL INTERCHANGE IN A MAJOR KEY
// ---------------------------------------------------------------------------------------------
{
  const ck = checklist(MAJ, MAJ_USE, 'In C');
  const coreSet = new Set(MAJ_USE.filter((u) => u[1]).map((u) => u[0]));
  const iv6 = extra(C, 'ionian', '4', '1 b3 5 6', 'm6');
  const aeo = MAJ.byMode.aeolian.map((c) => c.rn).join(', ');
  const body = callout(`<b>How the list is made.</b> Take every parallel mode on the same tonic (Lydian, Mixolydian, Dorian, Aeolian, Phrygian, Locrian, harmonic minor, melodic minor), build the 7th chord on each degree, and drop the ones the major key already has. What is left is every borrowed chord: <b>${ck.n} of them</b>. Each appears once, with every mode it can come from. Numerals are relative to the <b>major</b> scale of the tonic, so ♭VI is always a minor 6th above the tonic.`)
    + h3('The core ' + ck.nCore + ' — know these cold', 'mi-major-core') + ck.core
    + p(`**Variant to know:** the jazz form of iv is **ivm6** (${iv6.name} in C, from ${srcList(iv6.src)}); its notes double as a rootless ♭VII9, the backdoor dominant.`, 'note')
    + h3('The rest — the complete set', 'mi-major-rest', 'pb') + ck.rest
    + keep(h3('What each parallel mode lends', 'mi-major-modes') + p(`Each row: the notes that differ from major, and every chord that changes because of them. Read it as “from Aeolian I get ${aeo}”.`, 'note') + lendsTable(MAJ, 'ionian', 'major', coreSet))
    + callout('<b>Finding a source fast:</b> a borrowed chord needs its altered notes. ♭VI contains ♭6 (and ♭3), so it comes from a mode with ♭6: Aeolian, Phrygian or harmonic minor. II7 contains ♯4, which only Lydian has. The darker the mode (brightness ladder), the flatter the chords it lends.')
    + h3('In context: the stock moves', 'mi-moves') + p('The moves from the Modal-interchange core set, one line each. Learn the numerals, the source and the one voice that moves.', 'note') + movesTable(MI_MOVES.filter((m) => !isMinorMove(m)));
  section('Modal interchange', 'mi-major', '2', 'Modal interchange in a major key', body,
    { lead: 'The checklist first: tick a line when you can name the chord, its source mode and its job instantly in any key.', subs: [['mi-major-core', 'The core borrowed chords'], ['mi-major-rest', 'The complete set'], ['mi-major-modes', 'What each parallel mode lends'], ['mi-moves', 'In context: the stock moves']] });
}

// ---------------------------------------------------------------------------------------------
// 3 · MODAL INTERCHANGE IN A MINOR KEY
// ---------------------------------------------------------------------------------------------
{
  const ck = checklist(MIN, MIN_USE, 'In C minor');
  const coreSet = new Set(MIN_USE.filter((u) => u[1]).map((u) => u[0]));
  const im6 = extra(C, 'aeolian', '1', '1 b3 5 6', 'm6');
  const homeRow = MIN.H.map((c) => `${c.rn} ${small(c.sym)}`).join(' · ');
  const body = callout(`<b>Home scale: natural minor (Aeolian).</b> Its own chords: ${homeRow}. Everything below is borrowed from the other parallel modes on the same tonic: the parallel major (Ionian), Dorian, Phrygian, Lydian, Mixolydian, Locrian, harmonic minor and melodic minor. <b>${ck.n} chords</b>, each listed once with all its sources.`)
    + h3('The core ' + ck.nCore + ' — know these cold', 'mi-minor-core') + ck.core
    + p(`**Variant to know:** the jazz minor tonic **im6** (${im6.name} in C minor, from ${srcList(im6.src)}).`, 'note')
    + h3('The rest — the complete set', 'mi-minor-rest', 'pb') + ck.rest
    + keep(h3('What each parallel mode lends', 'mi-minor-modes') + p('Against natural minor. Harmonic and melodic minor are the classical and jazz ways of getting a real V7 (♮7); Dorian and melodic minor give the major IV (♮6); the parallel major gives the Picardy I (♮3).', 'note') + lendsTable(MIN, 'aeolian', 'natural minor', coreSet))
    + keep(h3('In context', 'mi-minor-moves') + movesTable(MI_MOVES.filter(isMinorMove)));
  section('Modal interchange', 'mi-minor', '3', 'Modal interchange in a minor key', body,
    { lead: 'Same method, with natural minor as home. Numerals are still relative to the major scale of the tonic: the natural-minor chords read im7 iiø7 ♭IIImaj7 ivm7 vm7 ♭VImaj7 ♭VII7.', subs: [['mi-minor-core', 'The core borrowed chords'], ['mi-minor-rest', 'The complete set'], ['mi-minor-modes', 'What each parallel mode lends'], ['mi-minor-moves', 'In context']] });
}

// ---------------------------------------------------------------------------------------------
// 4 · INTERVAL STRUCTURE OF EVERY SCALE
// ---------------------------------------------------------------------------------------------
const SC = (id) => T.getScale(id);
const ivsOf = (id) => SC(id).ivs;
// cross-check theory.js against the engine wherever both define the scale
const ENGINE_ID = { 'altered-dim': 'ultralocrian' };
for (const id of Object.keys(T.SCALES)) {
  const eid = ENGINE_ID[id] || id;
  if (E.MODE[eid] && E.MODE[eid].fam !== 'symmetric') assert(ivsOf(id).join(' ') === E.MODE[eid].f, `formula of ${id}: theory ${ivsOf(id).join(' ')} vs engine ${E.MODE[eid].f}`);
}
const chordOfScale = (id) => {
  const iv = ivsOf(id);
  const toks = [iv[0], iv[2], iv[4], iv[6]];
  const q = qOf(toks, Q7), q3 = qOf(toks.slice(0, 3), Q3);
  assert(q && q3, `7th chord of ${id}: ${toks}`);
  return { toks, q, q3 };
};
const chordCell = (id) => {
  const { toks, q } = chordOfScale(id);
  const alt = id === 'altered' ? '<br><span class="enh">read as 7alt: ♭4 = 3</span>' : '';
  return `<span class="nw">${pf(toks)}</span> = <b>${SYM7[q]}</b>${alt}`;
};
const stepsOf = (ivs) => ivs.map((t, i) => { const a = T.intervalSemis(t) % 12, b = i + 1 < ivs.length ? T.intervalSemis(ivs[i + 1]) % 12 : 12; return { 1: 'H', 2: 'W', 3: 'm3' }[b - a] ?? `${b - a}`; }).join(' ');
const famIds = (fam) => Object.values(T.SCALES).filter((s) => s.family === fam && !s.alias && s.id !== 'major').sort((a, b) => a.modeIndex - b.modeIndex).map((s) => s.id);
const modeName = (id) => (E.MODE[ENGINE_ID[id] || id]?.name) || SC(id).name;
const labelsNote = (id) => (SC(id).labels && ['altered', 'phrygian-dominant'].includes(id) ? `<br><span class="enh">as a dominant: ${pf(SC(id).labels)}</span>` : '');
const formulaCell = (id) => `<span class="nw f">${pf(ivsOf(id))}</span>${labelsNote(id)}`;

const MAJ_MODE_INFO = {
  ionian: ['♮4, ♮7', 'I chord: maj7, 6, 6/9 (the 4th is the avoid note)'],
  dorian: ['♮6', 'ii chord; minor vamps (m7, m6, m9)'],
  phrygian: ['♭2', 'iii chord; Spanish / metal minor'],
  lydian: ['♯4', 'IV chord; the bright maj7♯11 tonic'],
  mixolydian: ['♭7 with ♮3', 'V chord (unaltered 7, 9, 13, sus); blues'],
  aeolian: ['♭6', 'vi chord; the natural minor key'],
  locrian: ['♭5 (and ♭2)', 'viiø7; m7♭5 (Locrian ♮2 is usually preferred)'],
};
function familyTable(fam, extraCols) {
  const ids = famIds(fam);
  assert(ids.length === 7, `${fam} has 7 modes`);
  return table(['#', 'Mode', 'Formula (against major)', '7th chord', ...extraCols.head], ids.map((id, i) => [i + 1, `<b>${modeName(id)}</b>`, formulaCell(id), chordCell(id), ...extraCols.row(id, i)]), 'z sc');
}
function chordsOfFamily(fam) {
  const ids = famIds(fam), parent = ids[0], pf0 = ivsOf(parent);
  const sp = E.spell(C, ENGINE_ID[parent] || parent);
  return table(['Degree', 'Chord', 'Mode', '7th chord as intervals', 'Symbol', 'In C ' + modeName(parent).toLowerCase()],
    ids.map((id, i) => { const { toks, q } = chordOfScale(id); return [`<b>${pd(pf0[i])}</b>`, `<b>${roman(pf0[i], q)}</b>`, modeName(id), `<span class="nw f">${pf(toks)}</span>`, `<b>${SYM7[q]}</b>${id === 'altered' ? ' <span class="enh">/ 7alt</span>' : ''} ${small(QNAME7[q])}`, sym7(sp[i], q)]; }), 'z chords');
}
{
  const BR = Object.fromEntries(E.BRIGHT.map((id, i) => [id, i + 1]));
  for (const [id, [ch]] of Object.entries(MAJ_MODE_INFO)) for (const t of ch.match(/[♭♯♮]?\d/g)) assert(ivsOf(id).map(pd).includes(t.replace('♮', '')), `characteristic ${t} of ${id}`);
  const major = familyTable('major', { head: ['Characteristic', 'Use', 'Brightness'], row: (id) => [MAJ_MODE_INFO[id][0], MAJ_MODE_INFO[id][1], `${BR[id]}`] });
  const mel = familyTable('melodic-minor', { head: ['Characteristic', 'Use'], row: (id) => [E.MODE[id].colour, E.MODE[id].use] });
  const harm = familyTable('harmonic-minor', { head: ['Characteristic', 'Use'], row: (id) => [E.MODE[ENGINE_ID[id] || id].colour, E.MODE[ENGINE_ID[id] || id].use] });

  // symmetric scales
  const SYMS = [
    ['diminished-hw', 'half-whole', '7♭9, 13♭9 (♭9 ♯9 ♯11 ♮13, natural 5th)', 3, 'Repeats every minor 3rd: four dominants share one scale.'],
    ['diminished-wh', 'whole-half', '°7 (and °(maj7))', 3, 'Same notes as half-whole a semitone lower.'],
    ['whole-tone', 'whole-tone', '7♯5, 9♯5 (♮9 ♯11 ♭13, no 5th)', 2, 'Only two exist; no perfect 5th anywhere.'],
    ['augmented', null, 'maj7♯5; mMaj7 colour', 4, 'Two augmented triads a minor 3rd apart (1 3 ♯5 + ♭3 5 7).'],
  ];
  for (const [id, eid] of SYMS) if (eid) assert(E.MODE[eid] && pcsOf(E.formula(eid).map((t) => up(C, t))).size === ivsOf(id).length && ivsOf(id).every((t) => pcsOf(E.formula(eid).map((x) => up(C, x))).has(E.pc(up(C, t)))), `symmetric ${id} agrees with engine`);
  const symT = table(['Scale', 'Formula', 'Steps', 'Fits', 'Versions', 'Remember'], SYMS.map(([id, , fits, n, tip]) => [`<b>${SC(id).name}</b>`, `<span class="nw f">${pf(ivsOf(id))}</span>`, `<span class="nw">${stepsOf(ivsOf(id))}</span>`, fits, n, tip]), 'z sc');

  // other scales, described by their difference from a reference scale (computed)
  const OTHER = [
    ['major-pentatonic', 'ionian', 'Major chords, country, melody; over maj7 and dominant'],
    ['minor-pentatonic', 'aeolian', 'Minor chords, blues and rock; superimposes widely'],
    ['blues', 'minor-pentatonic', 'Blues and rock over minor or dominant chords'],
    ['major-blues', 'major-pentatonic', 'Country, gospel and blues over a major or dominant I'],
    ['bebop-dominant', 'mixolydian', 'Bebop lines over V7: chord tones fall on the beat'],
    ['bebop-major', 'ionian', 'Bebop lines over maj7 / 6'],
    ['bebop-dorian', 'dorian', 'Bebop lines over m7'],
    ['harmonic-major', 'ionian', 'Major with the borrowed ♭6: the iv sound inside the I chord'],
  ];
  const describe = (id, base) => {
    const a = ivsOf(id), b = ivsOf(base);
    const add = a.filter((t) => !b.includes(t)), drop = b.filter((t) => !a.includes(t));
    const nb = modeName(base).replace(' (major)', '');
    const swapped = add.length === 1 && drop.length === 1 && E.parseDeg(add[0]).d === E.parseDeg(drop[0]).d;
    if (swapped) return `${nb} with ${pd(add[0])}`;
    return [nb, drop.length ? `without ${drop.map(pd).join(', ')}` : '', add.length ? `+ ${add.map(pd).join(', ')}` : ''].filter(Boolean).join(' ');
  };
  const otherT = table(['Scale', 'Formula', 'Steps', 'Think of it as', 'Use'], OTHER.map(([id, base, use]) => [`<b>${SC(id).name}</b>`, `<span class="nw f">${pf(ivsOf(id))}</span>`, `<span class="nw">${stepsOf(ivsOf(id))}</span>`, describe(id, base), use]), 'z sc');

  const body = p('Every formula is written against the major scale of the same root: 1 2 3 4 5 6 7 is major, ♭3 means a minor 3rd above the root, and so on. The 7th chord of each mode is its 1st, 3rd, 5th and 7th notes, so it is read straight off the formula.', 'lead')
    + keep(h3('Major modes', 'sc-major') + major + p(`**Brightness ladder:** ${E.BRIGHT.map((id) => `${E.MODE[id].name}${E.MODE[id].change !== '—' ? ' ' + E.MODE[id].change : ''}`).join(' → ')}. Each step darkens one more note.`, 'note'))
    + keep(h3('Melodic minor modes', 'sc-mel') + mel + p('Melodic minor = major with ♭3. Each mode is a major mode with one note changed: Lydian dominant = Mixolydian ♯4, Altered = Locrian ♭4, Locrian ♮2 = Locrian with ♮2.', 'note'))
    + keep(h3('The chords of melodic minor', 'sc-mel-chords') + chordsOfFamily('melodic-minor') + p('Two pairs repeat: IV7 and V7 are both 1 3 5 ♭7 (Lydian dominant and Mixolydian ♭6), and viø7 and viiø7 are both 1 ♭3 ♭5 ♭7 (Locrian ♮2 and Altered, which is played as 7alt).', 'note'))
    + keep(h3('Harmonic minor modes', 'sc-harm') + harm + p('Harmonic minor = natural minor with ♮7. The ♭6–7 augmented 2nd is its sound; mode 5 (Phrygian dominant) is why it exists: it gives a minor key its V7.', 'note'))
    + keep(h3('The chords of harmonic minor', 'sc-harm-chords') + chordsOfFamily('harmonic-minor'))
    + keep(h3('Symmetric scales', 'sc-sym') + symT + p('Steps: H = half step, W = whole step, m3 = minor 3rd (three half steps).', 'note'))
    + keep(h3('Other scales worth knowing', 'sc-other') + otherT);
  section('Scales', 'scales', '4', 'Interval structure of every scale', body,
    { subs: [['sc-major', 'Major modes'], ['sc-mel', 'Melodic minor modes'], ['sc-mel-chords', 'The chords of melodic minor'], ['sc-harm', 'Harmonic minor modes'], ['sc-harm-chords', 'The chords of harmonic minor'], ['sc-sym', 'Symmetric scales'], ['sc-other', 'Other scales worth knowing']] });
}

// ---------------------------------------------------------------------------------------------
// 5 · SUPERIMPOSITION — WHAT AND WHY
// ---------------------------------------------------------------------------------------------
{
  const SYM = { maj: 'maj7', dom: '7', min: 'm7', half: 'm7b5', mmaj: 'mMaj7', dim: 'dim7' };
  const chordC = (k) => T.pretty(T.chordSymbol('C', SYM[k]));
  const pick = (k, deg, shape) => { const it = SI.menu(k).items.find((x) => x.deg === deg && x.shape === shape); assert(it, `menu item ${k} ${deg} ${shape}`); return it; };
  // the why principles, straight from the Memory pack explainer
  const whyMd = /### Why superimpositions work\n([\s\S]*?)\n\n/.exec(UNIT.E1.md);
  assert(whyMd, 'why block in E1');
  const why = whyMd[1].split('\n').map((l) => l.replace(/^\d+\.\s*/, '')).filter(Boolean);
  assert(why.length >= 4, 'why principles');
  const exItem = pick('dom', 'II', 'maj');
  const ex = SI.explain('C', 'dom', exItem);
  const method = [
    '**Know the chord’s scale.** The job decides it: a C7 that goes nowhere (IV7, ♭VII7, subV) is Lydian dominant; a C7 resolving to F is Mixolydian, half-whole or altered depending on how much tension you want.',
    '**Pick a triad or pentatonic inside that scale that holds the colour notes you want** — and ideally leaves out the avoid note (the 11 over a major or dominant chord).',
    '**Name it by the chord degree it sits on** (II, ♭VI, ♭iii…), not by its letter. “II triad over a dominant” works on every dominant in every key.',
    '**Read every note as a tension over the chord root** (D over C7 = 9, ♯11, 13), and end the phrase on a guide tone (3rd or 7th) or let it resolve by half step into the next chord.',
  ];
  const menus = SI.MENU_KEYS.map((k) => {
    const mnu = SI.menu(k);
    const rows = mnu.items.map((it) => {
      const st = SI.structure('C', k, it);
      const sw = SI.shortWhy('C', k, it).replace(/^Why it works: /, '');
      return [`<b>${it.deg} ${SI.shapeName(it.shape)}</b><br>${small(`${st.name.replace(' triad', '')}: ${st.names.join(' ')} over ${chordC(k)}`)}`,
        `<span class="nw">${SI.tensionsOf(k, it).join(' ')}</span><br>→ <b>${esc(it.result)}</b>`, esc(it.scale),
        `${esc(it.why)}${sw ? `<br><span class="why">${esc(sw[0].toUpperCase() + sw.slice(1))}</span>` : ''}`];
    });
    return (h3(`Over a ${mnu.label} (X${T.pretty(T.getChord(SYM[k]).sym)})`) + table(['Play', 'Adds → sounds like', 'Scale', 'Why'], rows, 'z si'));
  });
  const name = (k, it) => `${it.deg} ${SI.shapeName(it.shape).replace('pentatonic', 'pent.')} (${SI.tensionsOf(k, it).join(' ')})`;
  const coldDom = [pick('dom', 'II', 'maj'), pick('dom', 'VI', 'maj'), pick('dom', '♭VI', 'maj'), pick('dom', '♭V', 'maj'), pick('dom', '♭iii', 'mpent')];
  const coldMaj = [pick('maj', 'II', 'maj'), pick('maj', 'V', 'maj')];
  const coldMin = [pick('min', '♭VII', 'maj'), pick('min', 'IV', 'maj'), pick('min', 'ii', 'mpent')];
  const body = callout('<b>What you are doing:</b> playing a shape you already own (a triad or a pentatonic) from a different root, so that its notes land on chosen tensions of the chord underneath. <b>Why:</b> it turns “play the 9, ♯11 and 13” into one clear, singable idea that you can find instantly in any key.')
    + h3('The method', 'si-method') + ol(method, 'steps')
    + h3('Why it works', 'si-why') + ol(why, 'steps')
    + keep(h4(`Worked example: ${exItem.deg} ${SI.shapeName(exItem.shape)} over ${chordC('dom')}`) + ul(ex.map((x) => `**${x.k}.** ${x.t}`)))
    + callout(`<b>Know these cold.</b> Over any dominant: ${coldDom.map((it) => name('dom', it)).join(', ')}. Over any maj7: ${coldMaj.map((it) => name('maj', it)).join(', ')}. Over any m7: ${coldMin.map((it) => name('min', it)).join(', ')}.`)
    + h3('The options, chord by chord', 'si-menus', 'pb') + p('Examples over C; the degree name is what transfers to every key.', 'note') + menus.join('');
  section('Superimposition', 'si', '5', 'Superimposition — what and why', body,
    { subs: [['si-method', 'The method'], ['si-why', 'Why it works'], ['si-menus', 'The options, chord by chord']] });
}

// ---------------------------------------------------------------------------------------------
// BACK — daily recall checklist
// ---------------------------------------------------------------------------------------------
{
  const coreOf = (U) => U.filter((u) => u[1]).map((u) => u[0]).join(', ');
  const G = [
    ['Circle of fifths', [
      'Walk the circle both ways from memory (C G D A E B F♯ D♭ A♭ E♭ B♭ F) with the relative minor inside each.',
      'The sharps or flats of any key, in order (F C G D A E B / B E A D G C F).',
      'Name the key from any signature: last sharp + a semitone; the second-to-last flat.',
    ]],
    ['Modal interchange in a major key', [
      `The core borrowed chords, each with its source mode(s): ${coreOf(MAJ_USE)}.`,
      `What each parallel mode lends — e.g. Aeolian: ${MAJ.byMode.aeolian.map((c) => c.rn).join(', ')}.`,
      'The job of each core chord: minor plagal, deceptive ♭VI, backdoor ♭VII7, Mario cadence, Neapolitan ♭II, Lydian II.',
      'The complete set: run down the list and check you know every one and where it comes from.',
      'One stock move a day, played in today’s key.',
    ]],
    ['Modal interchange in a minor key', [
      `The core borrowed chords with sources: ${coreOf(MIN_USE)}.`,
      'Which come from the parallel major (Picardy I), from Dorian (IV7), from harmonic minor (V7, vii°7) and from melodic minor (iim7, IV7, V7, i(maj7)).',
    ]],
    ['Interval structure of every scale', [
      'The formula of every major mode, by the brightness ladder.',
      'The formula of every melodic-minor and harmonic-minor mode, and its 7th chord as intervals (1 ♭3 ♭5 ♭7 = m7♭5 …).',
      'The seven chords of melodic minor and of harmonic minor, as numerals and as interval structures.',
      'Half-whole, whole-half, whole-tone and augmented: the step pattern and what each fits.',
      'Major and minor pentatonic, blues, major blues and the bebop scales as “a scale you know, plus or minus a note”.',
    ]],
    ['Superimposition', [
      'The four steps: chord scale → shape that holds the colour → name it by degree → read it as tensions.',
      'The why: upper floors of the chord, inside the chord’s scale, skips the avoid note, strong shapes, tension that resolves.',
      'Over any dominant: II, VI, ♭VI, ♭V triads and the ♭iii minor pentatonic — the tensions and the sound of each.',
      'Over any maj7: II and V triads; over any m7: ♭VII and IV triads and the ii minor pentatonic.',
    ]],
  ];
  const body = G.map(([t, items]) => `<div class="ck keep"><div class="ckh">${t}</div>${ul(items, 'check')}</div>`).join('')
    + callout('<b>The daily routine (10 minutes):</b> pick today’s key by walking the circle. Say its signature. Name the core borrowed chords of the major and the minor key on that tonic, with sources. Recite one scale family’s formulas and chords. Then name the superimpositions over its V7. Anything slower than a second goes on tomorrow’s list.');
  section('Back', 'checklist', '', 'Daily recall checklist', body, { lead: 'Be able to reel these off with no instrument and no paper. Tick a line when it is instant.' });
}

// ---------------------------------------------------------------------------------------------
// ASSEMBLY
// ---------------------------------------------------------------------------------------------
const FONT = '-apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif';
const CSS = `
@page { size: A4; margin: 13mm 13mm 14mm;
  @bottom-center { content: counter(page); font: 8pt ${FONT}; color: #777; }
  @bottom-right { content: "Memory Essentials"; font: 7pt ${FONT}; color: #aaa; } }
@page :first { @bottom-center { content: none; } @bottom-right { content: none; } }
* { box-sizing: border-box; }
html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body { margin: 0; background: #fff; color: #1b1b1b; font: 10pt/1.45 ${FONT}; }
svg text { font-family: ${FONT}; }
section.sec { break-before: page; }
.partband { font-size: 7.5pt; letter-spacing: .14em; text-transform: uppercase; color: ${ACC}; font-weight: 700; margin-bottom: 2px; }
h2 { font-size: 17pt; margin: 0 0 8px; padding-bottom: 4px; border-bottom: 2px solid ${ACC}; break-after: avoid; }
h2 .num { color: ${ACC}; margin-right: 10px; }
h3 { font-size: 12pt; margin: 16px 0 5px; break-after: avoid; color: #123; }
h3.pb { break-before: page; margin-top: 0; }
h4 { font-size: 10.5pt; margin: 10px 0 3px; break-after: avoid; }
p { margin: 3px 0 7px; }
p.lead { font-size: 10.5pt; color: #333; margin-bottom: 10px; }
p.note, .note { font-size: 9pt; color: #555; margin: 3px 0 6px; }
.prose p { margin: 3px 0 6px; }
.prose ul, .prose ol { margin: 3px 0 6px; padding-left: 18px; }
ul, ol { margin: 4px 0 8px; padding-left: 20px; }
li { margin: 3px 0; }
ol.steps li { margin: 5px 0; padding-left: 3px; }
table { border-collapse: collapse; width: 100%; margin: 4px 0 10px; font-size: 9.2pt; line-height: 1.38; }
thead { display: table-header-group; }
tr { break-inside: avoid; }
th { background: #e3efed; text-align: left; font-weight: 700; color: #123; vertical-align: bottom; font-size: 8.8pt; }
th, td { border: 0.5pt solid #c9d3d1; padding: 3.5px 6px; vertical-align: top; }
table.z tbody tr:nth-child(even) td { background: #f4f8f7; }
td small { color: #555; font-size: 8pt; }
.nw { white-space: nowrap; }
.f { letter-spacing: .02em; }
.enh { color: #777; font-weight: 400; font-size: 8pt; }
.keep { break-inside: avoid; }
.two { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; align-items: start; }
.callout { border-left: 3px solid ${ACC}; background: #eef6f5; padding: 6px 10px; margin: 8px 0 10px; font-size: 9.4pt; break-inside: avoid; }
.rule { border: 0.8pt solid ${ACC}; border-radius: 3px; padding: 5px 9px; margin: 2px 0 8px; font-size: 9.6pt; background: #f7fbfa; break-inside: avoid; }
.rule .rid { font-weight: 700; color: ${ACC}; margin-right: 4px; text-transform: uppercase; font-size: 7.5pt; letter-spacing: .08em; }
.trigrid { display: grid; grid-template-columns: 340px 1fr; gap: 16px; align-items: center; margin: 2px 0 4px; }
table.sig { font-size: 8.8pt; }
table.sig td { padding: 2px 5px; }
/* modal-interchange checklist */
table.ckt td { padding: 5px 6px; }
table.ckt td:nth-child(1) { width: 4%; text-align: center; }
table.ckt td:nth-child(2) { width: 12%; white-space: nowrap; }
table.ckt td:nth-child(3) { width: 11%; white-space: nowrap; }
table.ckt td:nth-child(4) { width: 15%; }
table.ckt td:nth-child(5) { width: 16%; }
table.ckt .rn { font-size: 10.5pt; }
table.ckt.core .rn { color: ${ACC}; }
table.ckt tbody tr:nth-child(even) td { background: #f6f9f8; }
.box { color: ${ACC}; font-size: 12pt; line-height: 1; }
table.lends td:first-child { width: 17%; white-space: nowrap; }
table.lends td:nth-child(2) { width: 13%; }
table.moves { font-size: 8.6pt; }
table.moves td:first-child { width: 21%; }
table.moves td:nth-child(2) { width: 22%; }
table.moves td:nth-child(3) { width: 12%; }
.chart { font-weight: 600; }
.where { color: #555; }
/* scales */
table.sc td:first-child { width: 3%; }
table.chords td:first-child { width: 8%; }
/* superimposition */
table.si td:first-child { width: 25%; }
table.si td:nth-child(2) { width: 17%; }
table.si td:nth-child(3) { width: 14%; }
table.si .why { font-size: 8pt; color: #555; }
/* checklist */
.check { padding-left: 0; }
.check li { list-style: none; padding-left: 20px; text-indent: -20px; margin: 5px 0; font-size: 10pt; }
.check li::before { content: "☐"; color: ${ACC}; display: inline-block; width: 20px; text-indent: 0; }
.ck { margin-bottom: 8px; }
.ckh { font-weight: 700; font-size: 11.5pt; color: ${ACC}; border-bottom: 1pt solid #cfe0dd; margin: 12px 0 3px; }
/* title and contents */
.title { height: 265mm; display: flex; flex-direction: column; justify-content: center; }
.title .kicker { font-size: 9pt; letter-spacing: .25em; color: ${ACC}; font-weight: 700; }
.title h1 { font-size: 40pt; margin: 6px 0 4px; line-height: 1; }
.title .sub { font-size: 12.5pt; color: #333; max-width: 150mm; margin-bottom: 10mm; }
.title .meta { font-size: 9pt; color: #555; margin-top: 10mm; max-width: 165mm; }
.title .fig { display: flex; gap: 22px; align-items: center; }
.title .mods { font-size: 10.5pt; }
.title .mods div { margin: 7px 0; }
.title .mods b { color: ${ACC}; display: inline-block; width: 18px; }
.toc { break-before: page; }
.toc .tp { font-size: 8pt; font-weight: 700; color: ${ACC}; letter-spacing: .12em; text-transform: uppercase; margin: 14px 0 3px; }
.toc a { display: flex; color: inherit; text-decoration: none; font-size: 11.5pt; padding: 3px 0; }
.toc a.sub { font-size: 9.8pt; padding: 1.5px 0 1.5px 30px; color: #333; }
.toc a .n { width: 30px; color: ${ACC}; font-weight: 700; }
.toc a .t { flex: none; }
.toc a .d { flex: 1; border-bottom: 1px dotted #aaa; margin: 0 6px 4px; }
.toc a .pg { width: 24px; text-align: right; font-variant-numeric: tabular-nums; }
.howto { margin-top: 18px; font-size: 9.8pt; }
`;

function render(pages = {}) {
  const parts = [];
  for (const s of SECTIONS) { if (!parts.length || parts.at(-1).name !== s.part) parts.push({ name: s.part, secs: [] }); parts.at(-1).secs.push(s); }
  const toc = parts.map((pt) => `<div class="tp">${esc(pt.name)}</div>` + pt.secs.map((s) => `<a href="#${s.id}"><span class="n">${s.num}</span><span class="t">${esc(s.title)}</span><span class="d"></span><span class="pg">${pages[s.id] ?? ''}</span></a>`
    + s.subs.map(([id, t]) => `<a class="sub" href="#${id}"><span class="t">${esc(t)}</span><span class="d"></span><span class="pg">${pages[id] ?? ''}</span></a>`).join('')).join('')).join('');
  const title = `<section class="title"><div class="kicker">GUITAR CARDS · MEMORY PACK</div><h1>Memory Essentials</h1>
    <div class="sub">Only what is worth memorising: every borrowed chord and where it comes from, the interval structure of every scale, superimposition and the circle of fifths.</div>
    <div class="fig">${circleSVG({ size: 280 })}<div class="mods">${SECTIONS.map((s) => `<div><b>${s.num || '✓'}</b>${esc(s.title)}</div>`).join('')}</div></div>
    <div class="meta">The printed companion to the Memory pack. Every chord, source mode and formula in these pages is computed by the same engine that writes the cards, so nothing is hand-typed: the borrowed-chord lists come from building the 7th chords of every parallel mode, and the scale formulas from the app’s scale table. One example key (C) throughout; the numerals and formulas are what transfer to every key.</div></section>`;
  const howto = `<div class="howto">${ul([
    '**Checklists first.** Each modal-interchange section opens with a tick-box list: name the chord, its source and its job, then tick it.',
    '**Roman numerals are relative to the major scale of the tonic**, as everywhere in the app: ♭VI is a minor 6th above the tonic in a major or a minor key. Lower case = minor 3rd (ivm7, iiø7, vii°7).',
    '**Formulas are against the major scale** of the same root: ♭3 is a minor 3rd, ♯4 an augmented 4th, 𝄫7 a diminished 7th.',
    '**Core** marks the chords and options that come up all the time; learn those first, then the complete set.',
  ])}</div>`;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Memory Essentials</title><style>${CSS}</style></head><body>
${title}
<section class="toc" id="contents"><h2>Contents</h2>${toc}${howto}</section>
${SECTIONS.map((s) => s.html).join('\n')}
</body></html>`;
}

function printPdf() {
  execFileSync(CHROME, ['--headless=new', '--no-pdf-header-footer', '--generate-pdf-document-outline', '--disable-gpu', `--print-to-pdf=${PDF}`, pathToFileURL(HTML).href], { stdio: 'pipe' });
}
// page number of every named destination (element id) in a Chrome PDF
function pdfDestPages(file) {
  const s = fs.readFileSync(file, 'latin1');
  const objAt = (n) => { const m = new RegExp(`(?:^|[\\r\\n])${n} 0 obj\\s*([\\s\\S]*?)endobj`).exec(s); return m ? m[1] : ''; };
  const rootRef = [...s.matchAll(/\/Root (\d+) 0 R/g)].pop();
  if (!rootRef) return { map: {}, count: 0 };
  const cat = objAt(rootRef[1]);
  const order = [];
  const walk = (n) => {
    const o = objAt(n);
    if (/\/Type\s*\/Pages\b/.test(o)) { const kids = /\/Kids\s*\[([^\]]*)\]/.exec(o); if (kids) for (const k of kids[1].matchAll(/(\d+) 0 R/g)) walk(k[1]); }
    else order.push(n);
  };
  const pagesRef = /\/Pages (\d+) 0 R/.exec(cat);
  if (pagesRef) walk(pagesRef[1]);
  const destsRef = /\/Dests (\d+) 0 R/.exec(cat);
  const d = destsRef ? objAt(destsRef[1]) : '';
  const map = {};
  for (const m of d.matchAll(/\/([A-Za-z0-9_.-]+)\s*\[(\d+) 0 R/g)) map[m[1]] = order.indexOf(m[2]) + 1;
  return { map, count: order.length };
}

const html0 = render();
assert(!/undefined|NaN|\[object/.test(html0.replace(/<style>[\s\S]*?<\/style>/, '')), 'undefined/NaN in output');
assert(!/(♭♭|♯♯|𝄫♭|𝄪♯)/.test(html0), 'triple accidental in output');
fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(HTML, html0);
if (process.argv.includes('--html')) { console.log('Wrote', path.relative(ROOT, HTML)); process.exit(0); }
printPdf();
let { map, count } = pdfDestPages(PDF);
if (Object.keys(map).length) {
  for (let pass = 0; pass < 3; pass++) {
    fs.writeFileSync(HTML, render(map));
    printPdf();
    const again = pdfDestPages(PDF);
    const moved = Object.keys(map).filter((k) => again.map[k] !== map[k]);
    ({ map, count } = again);
    if (!moved.length) break;
  }
} else console.warn('Could not read page numbers from the PDF; contents page left without numbers.');
const size = fs.statSync(PDF).size;
console.log(`Wrote ${path.relative(ROOT, HTML)} and ${path.relative(ROOT, PDF)}: ${count} pages, ${(size / 1024 / 1024).toFixed(2)} MB`);
for (const s of SECTIONS) {
  console.log(`  ${String(s.num).padStart(3)}  p.${String(map[s.id] ?? '?').padStart(3)}  ${s.title}`);
  for (const [id, t] of s.subs) console.log(`         p.${String(map[id] ?? '?').padStart(3)}    ${t}`);
}
