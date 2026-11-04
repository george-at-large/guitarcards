#!/usr/bin/env node
// Builds the printable study guide: guide/guitar-mastery.html -> guide/guitar-mastery.pdf (headless Chrome).
// Every note spelling, interval and fret position is computed by the app's own engine
// (src/theory.js, src/fretboard.js), so the diagrams are correct by construction.
//
//   node tools/build-guide.mjs            build HTML + PDF (two passes so the contents page gets page numbers)
//   node tools/build-guide.mjs --html     build the HTML only
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

globalThis.window ??= globalThis;
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const imp = (p) => import(pathToFileURL(path.join(ROOT, p)).href);
const T = await imp('src/theory.js');
const F = await imp('src/fretboard.js');
const { SCALE_INFO } = await imp('src/context.js');
const { toolbox } = await imp('content/harmony.js');

const OUT_DIR = path.join(ROOT, 'guide');
const HTML = path.join(OUT_DIR, 'guitar-mastery.html');
const PDF = path.join(OUT_DIR, 'guitar-mastery.pdf');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

// ---------------------------------------------------------------------------------------------
// small helpers
// ---------------------------------------------------------------------------------------------
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const N = (s) => (typeof s === 'string' ? T.parseNote(s) : s);
const nn = (n) => T.noteName(N(n), true);
const piv = (iv) => T.prettyIv(iv);
const fmt = (ivs) => ivs.map(piv).join(' ');
const sym = (r, q) => T.chordSymbol(N(r), q);
const notesOf = (r, q) => T.chordNotes(N(r), q).map(nn).join(' ');
const C = N('C');
const SEMI_IV = ['1', 'b2', '2', 'b3', '3', '4', 'b5', '5', 'b6', '6', 'b7', '7'];
const TENSION = { b2: 'b9', 2: '9', '#2': '#9', 4: '11', '#4': '#11', b6: 'b13', 6: '13' };
const md = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\*(.+?)\*/g, '<i>$1</i>');
const table = (head, rows, cls = '') => `<table class="${cls}"><thead><tr>${head.map((h) => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${c ?? ''}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
const ul = (items, cls = '') => `<ul class="${cls}">${items.map((i) => `<li>${md(i)}</li>`).join('')}</ul>`;
const p = (s, cls = '') => `<p class="${cls}">${md(s)}</p>`;
const h3 = (s) => `<h3>${s}</h3>`;
const figs = (items, cls = '') => `<div class="figs ${cls}">${items.join('')}</div>`;
const assert = (cond, msg) => { if (!cond) throw new Error('Guide check failed: ' + msg); };

// roman numeral for a diatonic chord (relative to the MAJOR scale on the tonic), with 7th-quality suffix
function roman7(tonic, ch) {
  const r = F.romanOf(tonic, ch.root, ch.ivs);
  const suf = { maj7: 'maj7', 7: '7', m7: '7', m7b5: '7', dim7: '7', mMaj7: '(maj7)', 'maj7#5': 'maj7', '7#5': '7', '7b5': '7♭5', 'dim-maj7': '(maj7)', 'm7#5': '7♯5' }[ch.quality] ?? '';
  return T.prettyRoman(r) + suf;
}
// roman display for a chart token like "bVII:7", "ii:m7b5", "V/ii:7"
function romanTok(tok) {
  const [head, qq = 'maj'] = tok.split(':');
  const [q, bass] = qq.split('/');
  const core = head.split('/')[0].replace(/^(bb|b|#)/, '');
  const lower = core === core.toLowerCase();
  const S = { maj: '', min: '', dim: '°', aug: '+', 5: '5', maj7: 'maj7', 7: '7', m7: lower ? '7' : 'm7', m7b5: 'ø7', dim7: '°7', m6: 'm6', 6: '6', mMaj7: '(maj7)', 'maj7#5': '+maj7' };
  let suf = S[q];
  if (suf === undefined) { suf = T.getChord(q).sym; if (lower) suf = suf.replace(/^m(?!aj)/, ''); }
  return T.prettyRoman(head) + suf + (bass ? '/' + piv(bass) : '');
}
// a chord chart in roman numerals and in a key: { roman, names }
function chart(ch, key = 'C') {
  const k = T.parseKey(key);
  const bars = ch.split('|').map((b) => b.trim()).filter(Boolean);
  const roman = bars.map((b) => b.split(/\s+/).map((t) => (t === '%' ? '%' : romanTok(t))).join(' '));
  const parsed = T.parseChart(ch, k.tonic);
  const names = parsed.map((bar) => bar.map((c) => T.chordSymbol(c.root, c.quality) + (c.bass ? '/' + nn(c.bass) : '')).join(' '));
  return { roman: roman.join(' | '), names: names.join(' | '), bars: roman.map((r, i) => [r, names[i]]) };
}
const tension = (iv) => TENSION[iv] || iv;
// prettify accidentals in free text from content files ("b9", "#11", "Ab", "bVII", "m7b5")
const ptext = (s) => String(s).replace(/(^|[\s(\/,=–-])b(\d)/g, '$1♭$2').replace(/(\d)b(\d)/g, '$1♭$2').replace(/#(\d)/g, '♯$1').replace(/\b([A-G])b\b/g, '$1♭').replace(/([A-G])#/g, '$1♯').replace(/(^|[\s(\/])b([IV]+|[iv]+(?![a-z]))/g, '$1♭$2');

// ---------------------------------------------------------------------------------------------
// SVG: fretboards and chord boxes
// ---------------------------------------------------------------------------------------------
const ACC = '#c2410c';
const INK = '#1b1b1b';
const TONE = '#d3d3d3';
const GUIDE = new Set(['3', 'b3', '7', 'b7', 'bb7']);

function dotSVG(cx, cy, r, label, kind, ring) {
  const fill = kind === 'root' ? ACC : kind === 'tone' ? TONE : '#fff';
  const stroke = kind === 'root' ? ACC : INK;
  const tc = kind === 'root' ? '#fff' : '#111';
  const L = String(label);
  const len = [...L].length;
  const fs = len <= 1 ? r * 1.2 : len === 2 ? r * 1.02 : len === 3 ? r * 0.86 : r * 0.72;
  let o = '';
  if (ring) o += `<circle cx="${cx}" cy="${cy}" r="${r + 2.4}" fill="none" stroke="${ACC}" stroke-width="1.8"/>`;
  o += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="1.1"/>`;
  if (L) o += `<text x="${cx}" y="${cy + 0.5}" font-size="${fs.toFixed(1)}" fill="${tc}" text-anchor="middle" dominant-baseline="central" font-weight="700">${esc(L)}</text>`;
  return o;
}

// horizontal neck: strings horizontal, high e on top, low E at the bottom (looking down at the neck)
// notes: [{string, fret, label, kind, ring}]
function neck({ notes = [], lo, hi, fw = 32, sh = 20, r = 9, bands = [], lines = [], minFrets = 4 }) {
  const fretted = notes.map((n) => n.fret);
  if (lo == null) lo = Math.min(...fretted);
  if (hi == null) hi = Math.max(...fretted);
  lo = Math.max(0, lo);
  const first = Math.max(1, lo);
  if (hi - first + 1 < minFrets) hi = first + minFrets - 1;
  const open = lo === 0;
  const nF = hi - first + 1;
  const L = open ? 28 : 12;
  const bandRows = bands.length ? Math.max(...bands.map((b) => b.row || 0)) + 1 : 0;
  const T0 = 12 + bandRows * 15;
  const W = L + nF * fw + 6;
  const H = T0 + 5 * sh + r + 15;
  const x = (f) => (f === 0 ? L - 15 : L + (f - first + 0.5) * fw);
  const y = (s) => T0 + (s - 1) * sh;
  let o = '';
  for (const b of bands) {
    const a = Math.max(b.lo, first), z = Math.min(b.hi, hi);
    if (z < a) continue;
    const x1 = L + (a - first) * fw + 2, x2 = L + (z - first + 1) * fw - 2;
    const yy = 4 + (b.row || 0) * 15;
    o += `<rect x="${x1}" y="${yy}" width="${x2 - x1}" height="11" rx="3" fill="${b.fill || '#efefef'}" stroke="#999" stroke-width="0.6"/>`;
    o += `<text x="${(x1 + x2) / 2}" y="${yy + 8.6}" font-size="8.5" text-anchor="middle" font-weight="700" fill="#333">${esc(b.label)}</text>`;
  }
  for (let f = first; f <= hi; f++) {
    const cx = x(f);
    if ([3, 5, 7, 9, 15, 17, 21].includes(f)) o += `<circle cx="${cx}" cy="${T0 + 2.5 * sh}" r="3.6" fill="#e2e2e2"/>`;
    if (f === 12 || f === 24) o += `<circle cx="${cx}" cy="${T0 + 1.5 * sh}" r="3.6" fill="#e2e2e2"/><circle cx="${cx}" cy="${T0 + 3.5 * sh}" r="3.6" fill="#e2e2e2"/>`;
    const bold = [3, 5, 7, 9, 12, 15, 17].includes(f);
    o += `<text x="${cx}" y="${y(6) + r + 11}" font-size="9" text-anchor="middle" fill="${bold ? '#111' : '#888'}" font-weight="${bold ? 700 : 400}">${f}</text>`;
  }
  for (let i = 0; i <= nF; i++) {
    const fx = L + i * fw;
    const nut = i === 0 && first === 1;
    o += `<line x1="${fx}" y1="${y(1)}" x2="${fx}" y2="${y(6)}" stroke="${nut ? INK : '#9a9a9a'}" stroke-width="${nut ? 3.5 : 1}"/>`;
  }
  for (let s = 1; s <= 6; s++) o += `<line x1="${open ? L - 26 : L - 6}" y1="${y(s)}" x2="${L + nF * fw}" y2="${y(s)}" stroke="#555" stroke-width="${(0.55 + (s - 1) * 0.2).toFixed(2)}"/>`;
  for (const [a, b, dash] of lines) o += `<line x1="${x(a.fret)}" y1="${y(a.string)}" x2="${x(b.fret)}" y2="${y(b.string)}" stroke="${ACC}" stroke-width="1.6" ${dash ? 'stroke-dasharray="3 2"' : ''} opacity="0.75"/>`;
  for (const n of notes) {
    if (n.fret > hi || (n.fret < first && n.fret !== 0)) continue;
    o += dotSVG(x(n.fret), y(n.string), r, n.label ?? '', n.kind, n.ring);
  }
  return `<svg class="neck" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${o}</svg>`;
}

// vertical chord box: low E on the left, nut at the top, starting fret number at the left
function chordBox({ notes, sx = 20, fy = 23, r = 8.5, compact = false }) {
  if (compact) { sx = 17; fy = 20; r = 7.6; }
  const fretted = notes.filter((n) => n.fret > 0).map((n) => n.fret);
  const mx = fretted.length ? Math.max(...fretted) : 1;
  const mn = fretted.length ? Math.min(...fretted) : 1;
  const start = mx <= 4 ? 1 : mn;
  const rows = Math.max(4, mx - start + 1);
  const L = 26, T0 = 20;
  const W = L + 5 * sx + 12;
  const H = T0 + rows * fy + 6;
  const xs = (s) => L + (6 - s) * sx;
  let o = '';
  for (let i = 0; i <= rows; i++) {
    const nut = i === 0 && start === 1;
    o += `<line x1="${xs(6)}" y1="${T0 + i * fy}" x2="${xs(1)}" y2="${T0 + i * fy}" stroke="${nut ? INK : '#9a9a9a'}" stroke-width="${nut ? 3.5 : 1}"/>`;
  }
  for (let s = 1; s <= 6; s++) o += `<line x1="${xs(s)}" y1="${T0}" x2="${xs(s)}" y2="${T0 + rows * fy}" stroke="#555" stroke-width="${(0.55 + (s - 1) * 0.2).toFixed(2)}"/>`;
  if (start > 1) o += `<text x="${xs(6) - r - 3}" y="${T0 + fy * 0.5}" font-size="10" text-anchor="end" dominant-baseline="central" font-weight="700" fill="${INK}">${start}</text>`;
  const used = new Set(notes.map((n) => n.string));
  for (let s = 1; s <= 6; s++) if (!used.has(s)) o += `<text x="${xs(s)}" y="${T0 - 7}" font-size="10" text-anchor="middle" dominant-baseline="central" fill="#888">×</text>`;
  for (const n of notes) {
    if (n.fret === 0) o += dotSVG(xs(n.string), T0 - 9, r - 1.5, n.label ?? '', n.kind, n.ring);
    else o += dotSVG(xs(n.string), T0 + (n.fret - start + 0.5) * fy, r, n.label ?? '', n.kind, n.ring);
  }
  return `<svg class="box" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${o}</svg>`;
}

const fig = (svg, title, sub = '') => `<figure>${title ? `<div class="ft">${title}</div>` : ''}${svg}${sub ? `<div class="fs">${sub}</div>` : ''}</figure>`;
const isRoot = (iv) => ['1', '8', '15'].includes(iv);

// engine notes -> drawable dots. tones: Set of interval names drawn grey; labels via iv
function dots(notes, { tones = new Set(), rings = new Set(), label = (n) => piv(n.iv) } = {}) {
  return notes.map((n) => ({ string: n.string, fret: n.fret, label: label(n), kind: isRoot(n.iv) ? 'root' : tones.has(n.iv) ? 'tone' : 'other', ring: rings.has(n.iv) }));
}
const chordDots = (notes) => dots(notes, { tones: GUIDE });

// one placement per inversion (0 = root position), the lowest movable one (no open strings, fret <= 15)
function inversions(root, quality, voicing, stringSet) {
  const all = F.chordVoicings({ root, quality, voicing, stringSet, inversion: 'all' });
  const by = new Map();
  for (const v of all) { if (!by.has(v.inversion)) by.set(v.inversion, []); by.get(v.inversion).push(v); }
  return [...by.keys()].sort((a, b) => a - b).map((k) => {
    const ps = by.get(k);
    const ok = ps.filter((v) => v.minFret >= 1 && v.maxFret <= 15).sort((a, b) => a.minFret - b.minFret);
    return ok[0] || ps.sort((a, b) => a.minFret - b.minFret)[0];
  });
}
const INV = ['Root pos.', '1st inv.', '2nd inv.', '3rd inv.', '4th inv.'];
const topIv = (v) => v.notes.reduce((a, b) => (b.midi > a.midi ? b : a)).iv;
const startFret = (v) => { const f = v.notes.filter((n) => n.fret > 0).map((n) => n.fret); return Math.max(...f) <= 4 ? 1 : Math.min(...f); };
function voicingFig(v, title) {
  const sub = `bass ${piv(v.bassIv)} · top ${piv(topIv(v))}`;
  return fig(chordBox({ notes: chordDots(v.notes) }), title, sub);
}

// a hand-written grip (frets low E -> high e, null = muted), labelled by the engine: every note must be a chord tone
function grip(root, quality, frets) {
  const r = N(root);
  const ivs = T.getChord(quality).ivs;
  const rootPc = T.notePc(r);
  const notes = [];
  frets.forEach((f, i) => {
    if (f == null) return;
    const s = 6 - i;
    const semi = ((F.midiAt(s, f) - rootPc) % 12 + 12) % 12;
    const iv = ivs.find((x) => T.intervalSemis(F.simpleIv(x)) % 12 === semi);
    assert(iv, `grip ${root}${quality} ${frets.join(',')} has a non-chord tone on string ${s}`);
    notes.push({ string: s, fret: f, iv, midi: F.midiAt(s, f) });
  });
  return notes;
}

// rhythm grid: steps = string of x / X (accent) / . ; group = cells per beat
function rhythmGrid(steps, { group = 4, counts } = {}) {
  const n = steps.length;
  const cw = 22, ch = 22, L = 4, T0 = 4;
  const W = L + n * cw + 4, H = T0 + ch + 16;
  const cnt = counts || (group === 4 ? ['1', 'e', '&', 'a'] : group === 3 ? ['1', 'trip', 'let'] : ['1', '&']);
  let o = '';
  for (let i = 0; i < n; i++) {
    const x0 = L + i * cw;
    const c = steps[i];
    const fill = c === 'X' ? ACC : c === 'x' ? INK : '#fff';
    o += `<rect x="${x0}" y="${T0}" width="${cw}" height="${ch}" fill="${i % group === 0 ? '#f4f4f4' : '#fff'}" stroke="#999" stroke-width="${i % group === 0 ? 1.2 : 0.6}"/>`;
    if (c !== '.') o += `<circle cx="${x0 + cw / 2}" cy="${T0 + ch / 2}" r="6.5" fill="${fill}"/>`;
    const lab = i % group === 0 ? String(Math.floor(i / group) + 1) : cnt[i % group];
    o += `<text x="${x0 + cw / 2}" y="${T0 + ch + 11}" font-size="8.5" text-anchor="middle" fill="${i % group === 0 ? '#111' : '#777'}" font-weight="${i % group === 0 ? 700 : 400}">${lab}</text>`;
  }
  return `<svg class="rg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${o}</svg>`;
}

// ---------------------------------------------------------------------------------------------
// document model
// ---------------------------------------------------------------------------------------------
const SECTIONS = [];
let secNo = 0;
function section(part, id, title, body, { lead = '', partTitle = null } = {}) {
  secNo++;
  SECTIONS.push({ part, id, num: secNo, title, partTitle, html: `<section class="sec" id="${id}">${partTitle ? `<div class="partband">${partTitle}</div>` : ''}<h2><span class="num">${secNo}</span>${title}</h2>${lead ? `<p class="lead">${md(lead)}</p>` : ''}${body}</section>` });
}

// =============================================================================================
// PART I — QUICK REFERENCE
// =============================================================================================
const P1 = 'Part I · Quick reference';

// 1. Fretboard notes & octaves ----------------------------------------------------------------
{
  const NAT = { 0: 'C', 2: 'D', 4: 'E', 5: 'F', 7: 'G', 9: 'A', 11: 'B' };
  const nat = [];
  for (let s = 1; s <= 6; s++) for (let f = 0; f <= 12; f++) {
    const L = NAT[F.midiAt(s, f) % 12];
    if (L) nat.push({ string: s, fret: f, label: L, kind: L === 'C' ? 'root' : 'other' });
  }
  const cs = [];
  for (let s = 1; s <= 6; s++) for (let f = 0; f <= 15; f++) if (F.midiAt(s, f) % 12 === 0) cs.push({ string: s, fret: f, label: 'C', kind: 'root' });
  const lines = [];
  for (const a of cs) {
    const b = cs.find((c) => c.string === a.string - 2 && F.midiAt(c.string, c.fret) === F.midiAt(a.string, a.fret) + 12);
    if (b) lines.push([a, b]);
  }
  const octRows = [[6, 4], [5, 3], [4, 2], [3, 1], [6, 1], [5, 2], [6, 3], [4, 1]].map(([a, b]) => {
    const f0 = 5;
    const m = F.midiAt(a, f0);
    let fb = null, oct = 0;
    for (const k of [12, 24]) { const f = m + k - F.OPEN[b]; if (f >= 0 && f <= 17) { fb = f; oct = k / 12; break; } }
    const d = fb - f0;
    return [`string ${a} → string ${b}`, oct === 2 ? 'two octaves' : 'one octave', d === 0 ? 'same fret' : `${d > 0 ? '+' : '−'}${Math.abs(d)} frets`, (a >= 3 && b <= 2) ? 'crosses G–B: one fret further' : ''];
  });
  const body = fig(neck({ notes: nat, lo: 0, hi: 12, fw: 50, r: 10 }), 'Natural notes, frets 0–12 (C highlighted; sharps/flats sit between; E–F and B–C are one fret apart)')
    + `<div class="two">` + `<div>${h3('Octave shapes')}${table(['Root on', 'Octave', 'Move'], octRows.map((r) => [r[0], r[1], r[2] + (r[3] ? ` <span class="muted">(${r[3]})</span>` : '')]))}</div>`
    + `<div>${h3('Landmarks')}${ul([
      'Frets 5, 7, 12 are your anchors: fret 12 repeats the open strings an octave up.',
      'Fret 5 on any string = the next (higher) open string, **except** the G string: fret 4 = open B.',
      'Learn strings 6 and 5 first (every barre-chord and CAGED root lives there), then use octave shapes to find the same note on strings 4–1.',
      'Same note, next string up: **5 frets lower** (4 frets lower crossing G→B).',
      'Drill: choose a note, find it on all six strings low→high→low in under 10 seconds, saying the string and fret aloud. One note per day, all 12 in two weeks.',
    ])}</div></div>`
    + fig(neck({ notes: cs, lo: 0, hi: 15, fw: 38, lines }), 'Every C from fret 0 to 15 with the octave shapes joined (two strings up: +2 frets, or +3 when the pair straddles the B string)');
  section(P1, 'notes', 'The fretboard: notes and octaves', body, { partTitle: P1, lead: 'Standard tuning E A D G B E (low to high). All diagrams in this guide show the neck as you look down at it: high e string on top, low E at the bottom, nut on the left.' });
}

// 2. Intervals: table and shapes ---------------------------------------------------------------
{
  const IV_ROWS = [
    ['m2', '♭2', 1, 'M7', '+1', '−4', 'The Entertainer (opening D–D♯–E)', 'Joy to the World (first two notes)', 'tense, rubbing'],
    ['M2', '2', 2, 'm7', '+2', '−3', 'Frère Jacques', 'Mary Had a Little Lamb', 'a step'],
    ['m3', '♭3', 3, 'M6', '+3', '−2', 'Greensleeves', 'This Old Man', 'minor, sad'],
    ['M3', '3', 4, 'm6', '+4', '−1', 'When the Saints Go Marching In', 'Swing Low, Sweet Chariot', 'major, bright'],
    ['P4', '4', 5, 'P5', '+5', '0 (same fret)', 'Amazing Grace; Auld Lang Syne', 'O Come, All Ye Faithful', 'open, hymn-like'],
    ['TT', '♯4/♭5', 6, 'TT', '+6', '+1', 'Saint-Saëns, Danse Macabre (violin)', 'same (it is symmetric)', 'unstable; 3rd + ♭7 of a V7'],
    ['P5', '5', 7, 'P4', '+7', '+2', 'Twinkle Twinkle Little Star', 'Minuet in G (Petzold, opening D–G)', 'strong, hollow'],
    ['m6', '♭6', 8, 'M3', '+8', '+3', 'The Entertainer (E up to C)', '—', 'bittersweet'],
    ['M6', '6', 9, 'm3', '+9', '+4', 'My Bonnie Lies Over the Ocean', "Nobody Knows the Trouble I've Seen", 'sweet, open'],
    ['m7', '♭7', 10, 'M2', '+10', '+5 · or 2 strings up, same fret', 'root → ♭7 of any dominant 7th', '—', 'bluesy, wants to fall'],
    ['M7', '7', 11, 'm2', '+11', '+6 · or 2 strings up, −1', 'one fret below the octave', '—', 'lush, leading tone'],
    ['P8', '8', 12, 'P1', '+12', '2 strings up, +2 (+3 over B)', 'same note, higher', 'Joy to the World (whole first phrase)', 'the same note'],
  ];
  const tbl = table(['Interval', 'Label', 'Semis', 'Inverts to', 'Same string', 'Next string up*', 'Ascending reference', 'Descending reference', 'Character'],
    IV_ROWS.map((r) => [`<b>${r[0]}</b>`, `<b>${r[1]}</b>`, r[2], r[3], r[4], r[5], r[6], r[7], r[8]]), 'small');
  const comp = table(['Compound', '♭9', '9', '♯9', '11', '♯11', '♭13', '13'], [['= simple + octave', '♭2', '2', '♯2 (sounds as ♭3)', '4', '♯4 (= ♭5)', '♭6 (= ♯5)', '6']], 'small');
  // interval maps around a root on strings 6, 5, 4, 3
  const imap = (rs, rf) => {
    const notes = [];
    const lo = rf - 3, hi = rf + 4;
    for (let s = 1; s <= 6; s++) for (let f = lo; f <= hi; f++) {
      const semi = (((F.midiAt(s, f) - F.midiAt(rs, rf)) % 12) + 12) % 12;
      notes.push({ string: s, fret: f, label: piv(SEMI_IV[semi]), kind: semi === 0 ? 'root' : ['b3', '3', '5', 'b7', '7'].includes(SEMI_IV[semi]) ? 'tone' : 'other' });
    }
    return neck({ notes, lo, hi, fw: 31, r: 9.5 });
  };
  const maps = figs([
    fig(imap(6, 5), 'Root on string 6 (A, fret 5)'), fig(imap(5, 5), 'Root on string 5 (D, fret 5)'),
    fig(imap(4, 5), 'Root on string 4 (G, fret 5)'), fig(imap(3, 5), 'Root on string 3 (C, fret 5)'),
  ], 'c2');
  const body = tbl + `<p class="note">* Moving to the next higher string, not crossing G→B. Crossing from G to B, add one fret. Interval reference tunes are all traditional or public domain; where none is reliable the chord-sound reference is given.</p>`
    + comp
    + h3('Every interval around a root — learn these four maps and you can find any interval anywhere')
    + p('Accent = root. Grey = the chord tones (♭3, 3, 5, ♭7, 7). Compare maps 1–2 with 3–4: any shape that crosses the G–B pair shifts up one fret on the B and e strings.')
    + maps;
  section(P1, 'intervals', 'Intervals: names, sounds and shapes', body);
}

// 3. Chord formulas ----------------------------------------------------------------------------
{
  const ALSO = { maj: 'M, maj', min: 'm, min, −', dim: '°, dim', aug: '+, aug', '5': 'power chord', maj7: 'Δ7, M7', '7': 'dom7', m7: '−7, min7', m7b5: 'ø7, m7(♭5)', dim7: '°7, dim7', mMaj7: 'm(Δ7), −Δ7', 'maj7#5': '+maj7, Δ♯5', '7#5': '+7, aug7, 7(♯5)', '7b5': '7(♭5)', '6': 'M6, add6', m6: '−6', '6/9': '69', maj9: 'Δ9', m9: '−9', '11': '9sus4 (no 3rd)', maj13: 'Δ13', '7alt': '7(♯9♭13), alt', '13b9': '13(♭9)', '7#11': '7(♯11), 9♯11', '13#11': '13(♯11)', 'maj7#11': 'Δ♯11, Lydian chord' };
  const JOB = {
    maj: 'I, IV, V of a major key', min: 'ii, iii, vi; minor tonic', dim: 'vii° in major, ii° in minor', aug: 'passing (I → I+ → vi/IV), V+', sus2: 'colour, no 3rd', sus4: 'Vsus4 → V; decoration', '5': 'rock riffs (neither major nor minor)',
    '6': 'major tonic (swing, bossa)', m6: 'minor tonic; iv6 in major', add9: 'pop colour on I, IV', madd9: 'minor colour', '6/9': 'final major tonic', 'm6/9': 'final minor tonic',
    maj7: 'I, IV', '7': 'V; every chord of a blues', m7: 'ii, iii, vi; Dorian i', m7b5: 'vii in major; ii in minor', dim7: 'vii°7 in minor; passing chord', mMaj7: 'minor tonic (melodic/harmonic minor)', 'maj7#5': '♭III+ in minor; tonic colour', '7#5': 'V whose ♯5 rises to the next 3rd', '7b5': 'V; same notes as its tritone sub', '7sus4': 'V delayed; modal vamp',
    maj9: 'I, IV', '9': 'V; funk vamp', m9: 'ii; minor tonic', '11': 'sus dominant (= IV/V)', m11: 'Dorian vamp; ii', 'maj7#11': 'IV; Lydian tonic', '13': 'V (Mixolydian)', m13: 'Dorian i / ii', maj13: 'I, IV', '9sus4': 'V sus', '13sus4': 'V sus',
    '7b9': 'V → minor i', '7#9': 'blues/rock I7; V alt', '7#11': 'II7, ♭VII7, ♭II7 (non-resolving V)', '7b13': 'V → minor', '7b9b13': 'V → minor (harmonic minor)', '7#9b13': 'altered V', '7#9#5': 'altered V', '13b9': 'V (half-whole diminished)', '13#11': 'II7, ♭II7 (Lydian dominant)', '7alt': 'V → I or i, maximum tension',
  };
  const groups = [
    ['Triads and power chords', ['maj', 'min', 'dim', 'aug', 'sus2', 'sus4', '5']],
    ['Sixths and added-note chords', ['6', 'm6', 'add9', 'madd9', '6/9', 'm6/9']],
    ['Seventh chords', ['maj7', '7', 'm7', 'm7b5', 'dim7', 'mMaj7', 'maj7#5', '7#5', '7b5', '7sus4']],
    ['Extended chords (9, 11, 13)', ['maj9', '9', 'm9', '11', 'm11', 'maj7#11', '13', 'm13', 'maj13', '9sus4', '13sus4']],
    ['Altered dominants', ['7b9', '7#9', '7#11', '7b13', '7b9b13', '7#9b13', '7#9#5', '13b9', '13#11', '7alt']],
  ];
  let body = '';
  for (const [g, ids] of groups) {
    body += h3(g) + table(['Chord (on C)', 'Also written', 'Formula', 'Notes', 'Typical job'], ids.map((q) => [`<b>${sym(C, q)}</b>`, ALSO[q] || '', `<b>${fmt(T.getChord(q).ivs)}</b>`, notesOf(C, q), JOB[q] || '']), 'small');
  }
  body += h3('Rules that generate every chord symbol') + ul([
    '**Triad** = 1 3 5 stacked in thirds; the 3rd decides major/minor, the 5th decides diminished/augmented.',
    '**7th chords** add a 3rd on top: maj7 = major 7th (11 semitones), 7 = minor 7th (10), °7 = diminished 7th (9 = same pitch as 6).',
    '**A plain "7" always means ♭7.** "maj" in a symbol only ever refers to the 7th.',
    '**9, 11, 13** imply the 7th (C9 contains B♭); **add9 / 6** chords have no 7th. "sus" replaces the 3rd with 4 (or 2).',
    '**Tensions** (9, 11, 13 and their alterations) are the scale notes between chord tones, numbered an octave up. Avoid the natural 11 over a major 3rd unless it is a passing note (use ♯11 instead).',
    'On guitar the **5th is the first note to drop**, then the root (a bassist or the ear supplies it). The 3rd and 7th define the chord: keep them.',
  ]);
  section(P1, 'chords', 'Chord formulas', body, { lead: 'Every chord in one table, spelled on C. To use another root, keep the formula and move the shape.' });
}

// 3b. Essential chord grips ------------------------------------------------------------------
{
  const OPEN = [
    ['C', 'maj', [null, 3, 2, 0, 1, 0]], ['A', 'maj', [null, 0, 2, 2, 2, 0]], ['G', 'maj', [3, 2, 0, 0, 0, 3]], ['E', 'maj', [0, 2, 2, 1, 0, 0]], ['D', 'maj', [null, null, 0, 2, 3, 2]],
    ['A', 'min', [null, 0, 2, 2, 1, 0]], ['E', 'min', [0, 2, 2, 0, 0, 0]], ['D', 'min', [null, null, 0, 2, 3, 1]], ['A', 'm7', [null, 0, 2, 0, 1, 0]], ['E', 'm7', [0, 2, 0, 0, 0, 0]],
    ['A', '7', [null, 0, 2, 0, 2, 0]], ['E', '7', [0, 2, 0, 1, 0, 0]], ['D', '7', [null, null, 0, 2, 1, 2]], ['G', '7', [3, 2, 0, 0, 0, 1]], ['C', '7', [null, 3, 2, 3, 1, 0]],
    ['B', '7', [null, 2, 1, 2, 0, 2]], ['C', 'maj7', [null, 3, 2, 0, 0, 0]], ['F', 'maj7', [null, null, 3, 2, 1, 0]], ['D', 'maj7', [null, null, 0, 2, 2, 2]], ['A', 'maj7', [null, 0, 2, 1, 2, 0]],
  ];
  const openFigs = OPEN.map(([r, q, fr]) => fig(chordBox({ notes: chordDots(grip(r, q, fr)), compact: true }), sym(r, q), fr.map((f) => (f == null ? '×' : f)).join(' ')));
  const Q = ['maj', 'min', '7', 'm7', 'maj7', 'm7b5', 'sus4', 'm6', '7sus4', '9'];
  const barre = (root, shape) => Q.map((q) => { const g = F.gripFor(root, q, 3); assert(g && g.label === shape, `${shape} grip for ${q}`); return fig(chordBox({ notes: chordDots(g.notes), compact: true }), sym(root, q), `${shape} · root fret ${F.cagedWindow(root, shape[0]).rootFret}`); });
  const body = h3('Open-position chords') + figs(openFigs, 'c5')
    + `<div class="keep">${h3('E-shape barre chords (root on string 6) — shown on G, 3rd fret') + figs(barre('G', 'E shape'), 'c5')}</div>`
    + `<div class="keep">${h3('A-shape barre chords (root on string 5) — shown on C, 3rd fret') + figs(barre('C', 'A shape'), 'c5')}</div>`
    + p('Move a barre shape so the accent dot sits on the root you need: string 6 roots use the E shapes, string 5 roots the A shapes (section §{notes} shows where every root is). Grey = 3rd and 7th: compare the shapes and notice that changing quality only moves those notes.', 'note');
  section(P1, 'grips', 'Essential chord grips: open and barre', body);
}

// 4. Harmonic systems --------------------------------------------------------------------------
const CHAR = {
  ionian: '7 and natural 4', dorian: '♮6', phrygian: '♭2', lydian: '♯4', mixolydian: '♭7', aeolian: '♭6', locrian: '♭5 (and ♭2)',
  'melodic-minor': '♮7 under a ♭3', 'dorian-b2': '♭2 with ♮6', 'lydian-augmented': '♯5 (and ♯4)', 'lydian-dominant': '♯4 with ♭7', 'mixolydian-b6': '♭6 with 3', 'locrian-nat2': '♮2 with ♭5', altered: '♭9 ♯9 ♯11 ♭13',
  'harmonic-minor': '♮7 with ♭6 (augmented 2nd)', 'locrian-nat6': '♮6 with ♭5', 'ionian-sharp5': '♯5', 'dorian-sharp4': '♯4 with ♭3', 'phrygian-dominant': '♭2 with 3', 'lydian-sharp2': '♯2 with ♯4', 'altered-dim': '𝄫7 (= 6) with ♭4 (= 3)',
  'harmonic-major': '♭6 with 3', 'dorian-b5': '♭5 with ♮6', 'phrygian-b4': '♭4 (= 3) with ♭2', 'lydian-b3': '♭3 with ♯4', 'mixolydian-b2': '♭2 with 3 and ♮6', 'lydian-augmented-sharp2': '♯2 ♯4 ♯5', 'locrian-bb7': '𝄫7 with ♭2',
};
const USE = {
  ionian: 'Imaj7 (4 = avoid note over the 3rd)', dorian: 'ii7; modal/funk minor i7', phrygian: 'iii7; Spanish/metal minor; sus♭9', lydian: 'IVmaj7; any maj7♯11', mixolydian: 'V7 → I; blues I7; I–♭VII–IV rock', aeolian: 'vi7; minor-key i; i–♭VI–♭VII', locrian: 'viiø7 of a major key',
  'melodic-minor': 'im(maj7), im6 tonic', 'dorian-b2': '7sus4♭9 (Phrygian sus)', 'lydian-augmented': 'maj7♯5', 'lydian-dominant': '7♯11: II7, ♭VII7, ♭II7, IV7 in minor', 'mixolydian-b6': '7♭13 → minor', 'locrian-nat2': 'iiø7 of a minor ii–V', altered: 'V7alt → I or i',
  'harmonic-minor': 'im(maj7) with a leading tone', 'locrian-nat6': 'iiø7 in minor', 'ionian-sharp5': '♭III+maj7 in minor', 'dorian-sharp4': 'iv7 in minor; Ukrainian/klezmer', 'phrygian-dominant': 'V7♭9♭13 → minor; flamenco', 'lydian-sharp2': '♭VImaj7 in minor (exotic)', 'altered-dim': 'vii°7 → i',
  'harmonic-major': 'Imaj7 with a ♭6 colour', 'dorian-b5': 'iiø7 → V7 → I (major)', 'phrygian-b4': 'iii7, rarely', 'lydian-b3': 'iv(maj7) borrowed in major', 'mixolydian-b2': 'V7♭9 → major I', 'lydian-augmented-sharp2': '♭VI+maj7 (rare)', 'locrian-bb7': 'vii°7 → major I',
};
const modesOf = (fam) => Object.values(T.SCALES).filter((s) => s.family === fam && !s.alias).sort((a, b) => a.modeIndex - b.modeIndex);
const scaleFormula = (s) => fmt(s.id === 'altered-dim' ? s.ivs : (s.labels || s.ivs));
{
  const FAMS = [
    ['major', 'Major scale system (the seven "church" modes)', 'C'],
    ['melodic-minor', 'Melodic minor system (jazz minor: the ascending form)', 'C'],
    ['harmonic-minor', 'Harmonic minor system', 'C'],
    ['harmonic-major', 'Harmonic major system', 'C'],
  ];
  let body = '';
  for (const [fam, title, key] of FAMS) {
    const ms = modesOf(fam);
    const tonic = N(key);
    const notes = T.scaleNotes(tonic, ms[0].id);
    body += `<div class="keep">${h3(`${title} — on ${nn(tonic)}: ${notes.map(nn).join(' ')}`)}`;
    body += table(['°', 'Chord (in C)', 'Mode (starts on this degree)', 'Formula vs major', 'Characteristic note', 'Typical use'], ms.map((m, i) => {
      const ch = T.diatonicChord(tonic, ms[0].id, i, 4);
      const tri = T.diatonicChord(tonic, ms[0].id, i, 3);
      return [i + 1, `<b>${roman7(tonic, ch)}</b> ${sym(ch.root, ch.quality)}<br><span class="muted">triad ${T.prettyRoman(F.romanOf(tonic, tri.root, tri.ivs))}</span>`, `<b>${nn(notes[i])} ${esc(m.name)}</b>`, `<b>${scaleFormula(m)}</b>`, CHAR[m.id], USE[m.id]];
    }), 'small') + '</div>';
  }
  // parallel view and brightness
  const BRIGHT = ['lydian', 'ionian', 'mixolydian', 'dorian', 'aeolian', 'phrygian', 'locrian'];
  const changes = ['', '♯4 → 4', '7 → ♭7', '3 → ♭3', '6 → ♭6', '2 → ♭2', '5 → ♭5'];
  body += `<div class="keep">${h3('Parallel view: all seven modes on the same root, brightest to darkest')}` + table(['Mode on C', 'Notes', 'Formula', 'Change from the line above', 'Same notes as'], BRIGHT.map((id, i) => {
    const s = T.getScale(id);
    const par = T.parentOf(C, id);
    return [`<b>C ${esc(s.name)}</b>`, T.scaleNotes(C, id).map(nn).join(' '), fmt(s.ivs), changes[i], `${nn(par.root)} major`];
  }), 'small') + p('Each step down lowers exactly one note. Major-type modes: Lydian, Ionian, Mixolydian. Minor-type: Dorian, Aeolian, Phrygian. Locrian is diminished. To find a mode\'s parent major scale: Dorian = major a whole step down, Phrygian = a major 3rd down, Lydian = a 4th down, Mixolydian = a 5th down, Aeolian = a minor 3rd up, Locrian = a half step up.') + '</div>';
  // minor-key composite
  const A = N('A');
  const MIN = [['aeolian', 'Natural minor'], ['harmonic-minor', 'Harmonic minor'], ['melodic-minor', 'Melodic minor']];
  const most = ['i7, i6, i(maj7)', 'iiø7', '♭IIImaj7', 'iv7 (iv6)', 'V7 (♭9) — from harmonic minor', '♭VImaj7', '♭VII7 (or vii°7)'];
  body += `<div class="keep">${h3('Minor keys: natural minor (Aeolian view) plus the two "fixes"')}` + table(['°', ...MIN.map((m) => `${m[1]} (A)`), 'What players actually use'], [0, 1, 2, 3, 4, 5, 6].map((i) => [i + 1, ...MIN.map(([id]) => { const ch = T.diatonicChord(A, id, i, 4); return `<b>${roman7(A, ch)}</b> ${sym(ch.root, ch.quality)}`; }), most[i]]), 'small')
    + p('Roman numerals are always measured against the **major** scale of the tonic, so minor-key chords carry flats: i iiø ♭III iv v ♭VI ♭VII. Natural minor has a weak minor v; harmonic minor raises the 7th to make a real V7 (and vii°7); melodic minor also raises the 6th (smooth line, IV7, iiø with ♮9). In practice a minor key mixes all three.') + '</div>';
  // symmetric scales
  const SYM = [
    ['diminished-hw', 'H W H W…', '3', '7♭9, 13♭9, 7♯9 (dominant)', 'four dom7s (C7 E♭7 G♭7 A7), dim7s, the ♭9/♯9/♯11/13 tensions'],
    ['diminished-wh', 'W H W H…', '3', 'dim7 chords; °(maj7)', 'two dim7 chords a half step apart'],
    ['whole-tone', 'all whole steps', '2', '7♯5, 9♯5, 7♭5', 'two augmented triads, 7♯5 chords'],
    ['augmented', 'm3 H m3 H…', '4', 'maj7♯5, major-3rd cycles', 'two augmented triads, three major + three minor triads'],
    ['chromatic', 'all half steps', '1', 'passing tones only', 'everything'],
  ];
  body += `<div class="keep">${h3('Symmetric scales (repeat inside the octave, so each has only a few distinct transpositions)')}` + table(['Scale', 'Formula', 'On C', 'Pattern', 'Distinct', 'Use over', 'Contains'], SYM.map(([id, pat, n, use, has]) => {
    const s = T.getScale(id);
    return [`<b>${esc(s.name)}</b>`, fmt(s.ivs), T.scaleNotes(C, id).map(nn).join(' '), pat, n, use, has];
  }), 'small') + p('Half-whole from the root = whole-half from the ♭9 (or from the 3, 5, ♭7). Diminished shapes repeat every **3 frets**, whole-tone shapes every **2 frets**.') + '</div>';
  section(P1, 'systems', 'Harmonic systems: chords and modes', body, { lead: 'Each parent scale, harmonised in 7th chords. Columns: the chord built on each degree (roman numerals relative to the major scale of the tonic), the mode that starts on that degree, its formula measured against the major scale of its own root, the note that gives it its flavour, and where you would use it.' });
}

// 5. Chord-scale cheat sheet -------------------------------------------------------------------
{
  const optName = (o) => `${esc(T.getScale(o.scale).name)}${o.from && o.from !== '1' ? ` on the ${piv(o.from)}` : ''}`;
  const rows = toolbox.map((e) => {
    const opts = e.options;
    return [`<b>${ptext(esc(e.label))}</b>`, `<b>${optName(opts[0])}</b>`, opts.slice(1, 5).map(optName).join(' · '), ptext(md(opts[0].why))];
  });
  const ex = (tok, key = 'C') => chart(`| ${tok} |`, key).names;
  const FUNC = [
    ['Imaj7 (tonic)', ex('I:maj7'), 'Ionian · major pentatonic', 'Lydian, bebop major'],
    ['IVmaj7', ex('IV:maj7'), 'Lydian', 'Major pentatonic on the 1 or 5'],
    ['ii7', ex('ii:m7'), 'Dorian', 'Minor pentatonic, bebop Dorian'],
    ['iii7', ex('iii:m7'), 'Phrygian (♭2 only as a passing note)', 'Minor pentatonic'],
    ['vi7', ex('vi:m7'), 'Aeolian', 'Dorian when it acts like a ii (vi–II7–ii–V)'],
    ['V7 → I (major)', ex('V:7'), 'Mixolydian · bebop dominant', 'Altered or half-whole for tension'],
    ['V7 → i (minor)', `${ex('V:7b9', 'Cm')} → Cm`, 'Phrygian dominant (= harmonic minor of the target)', 'Altered, half-whole diminished'],
    ['V7alt', ex('V:7alt'), 'Altered (melodic minor a half step up)', 'Minor pentatonic on the ♭3'],
    ['iiø7 in minor', ex('ii:m7b5', 'Cm'), 'Locrian ♮2 (melodic minor on the ♭3)', 'Locrian'],
    ['viiø7 in major', ex('vii:m7b5'), 'Locrian', '—'],
    ['Minor tonic (im6, im(maj7))', ex('i:m6', 'Cm'), 'Melodic minor', 'Dorian, harmonic minor'],
    ['Non-resolving dominant (II7, ♭VII7, IV7 in minor)', `${ex('II:7')}, ${ex('bVII:7')}`, 'Lydian dominant', 'Mixolydian'],
    ['Tritone sub ♭II7', `${ex('bII:7')} → C`, 'Lydian dominant (same notes as G altered)', '—'],
    ['Secondary dominant to a minor chord', `${ex('VI:7')} → Dm`, 'Mixolydian ♭6 / Phrygian dominant', 'Altered'],
    ['Secondary dominant to a major chord', `${ex('II:7')} → G`, 'Mixolydian', 'Lydian dominant'],
    ['Passing dim7', `${ex('#i:dim7')} → Dm7`, 'Whole-half diminished', 'Harmonic minor of the target'],
    ['7sus4', ex('V:7sus4'), 'Mixolydian (4 is now a chord tone)', 'Minor pentatonic on the 5'],
    ['Blues (I7 IV7 V7)', 'C7 F7 G7', 'Blues scale / minor pentatonic of the key', 'Major pentatonic, each chord\'s Mixolydian'],
  ];
  const body = h3('By function (in C)') + table(['Function', 'Example', 'First choice', 'Alternatives'], FUNC.map((r) => [`<b>${r[0]}</b>`, r[1], `<b>${r[2]}</b>`, r[3]]), 'small')
    + h3('By chord quality: first choice, other options, and why') + table(['Chord', 'First choice', 'Other options', 'Why the first choice works'], rows, 'small')
    + p('"On the ♭3" etc. means start that scale on that degree of the chord (G7alt: minor pentatonic on the ♭3 = B♭ minor pentatonic). Whatever the scale, land chord tones on strong beats.', 'note');
  section(P1, 'chord-scales', 'Chord–scale cheat sheet: what to play over what', body);
}

// 6. Keys: circle of fifths, signatures, diatonic chords ---------------------------------------
{
  const CIRCLE = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'Db', 'Ab', 'Eb', 'Bb', 'F'];
  const ALT = { 'F#': 'G♭', Db: 'C♯', B: 'C♭' };
  const cx = 175, cy = 175;
  let o = `<circle cx="${cx}" cy="${cy}" r="160" fill="#fff" stroke="${INK}" stroke-width="1.4"/><circle cx="${cx}" cy="${cy}" r="112" fill="#fafafa" stroke="#888"/><circle cx="${cx}" cy="${cy}" r="72" fill="#fff" stroke="#888"/>`;
  CIRCLE.forEach((k, i) => {
    const a = ((i * 30 - 90) * Math.PI) / 180, b = ((i * 30 - 75) * Math.PI) / 180;
    o += `<line x1="${cx + 72 * Math.cos(b)}" y1="${cy + 72 * Math.sin(b)}" x2="${cx + 160 * Math.cos(b)}" y2="${cy + 160 * Math.sin(b)}" stroke="#bbb"/>`;
    const r = N(k);
    const sig = T.scaleNotes(r, 'major').filter((n) => n.acc !== 0);
    const count = sig.length ? `${sig.length}${sig[0].acc > 0 ? '♯' : '♭'}` : '0';
    o += `<text x="${cx + 138 * Math.cos(a)}" y="${cy + 138 * Math.sin(a)}" font-size="17" font-weight="700" text-anchor="middle" dominant-baseline="central" fill="${k === 'C' ? ACC : INK}">${nn(r)}</text>`;
    if (ALT[k]) o += `<text x="${cx + 138 * Math.cos(a)}" y="${cy + 138 * Math.sin(a) + 14}" font-size="9" text-anchor="middle" dominant-baseline="central" fill="#666">(${ALT[k]})</text>`;
    o += `<text x="${cx + 93 * Math.cos(a)}" y="${cy + 93 * Math.sin(a)}" font-size="12" text-anchor="middle" dominant-baseline="central" fill="#333">${nn(T.transpose(r, '6'))}m</text>`;
    o += `<text x="${cx + 58 * Math.cos(a)}" y="${cy + 58 * Math.sin(a)}" font-size="9" text-anchor="middle" dominant-baseline="central" fill="#666">${count}</text>`;
  });
  o += `<text x="${cx}" y="${cy - 8}" font-size="10" text-anchor="middle" fill="#444">clockwise: up a 5th</text><text x="${cx}" y="${cy + 6}" font-size="10" text-anchor="middle" fill="#444">(adds a ♯)</text><text x="${cx}" y="${cy + 22}" font-size="10" text-anchor="middle" fill="#444">anticlockwise: up a 4th</text>`;
  const circle = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 350 350" width="330" height="330">${o}</svg>`;
  const sigRows = CIRCLE.map((k) => {
    const r = N(k);
    const ns = T.scaleNotes(r, 'major');
    const acc = ns.filter((n) => n.acc !== 0);
    return [`<b>${nn(r)}</b>`, `${nn(T.transpose(r, '6'))}m`, acc.length ? `${acc.length} ${acc[0].acc > 0 ? '♯' : '♭'}` : '—', acc.map(nn).join(' ') || '—'];
  });
  const side = table(['Major', 'Rel. minor', '#', 'Accidentals'], sigRows, 'small') + p('Order of sharps: F C G D A E B. Order of flats: B E A D G C F. Relative minor = 6th degree (3 frets below the major root); same notes, same key signature.', 'note');
  const MAJ = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'Gb', 'Db', 'Ab', 'Eb', 'Bb', 'F'];
  const majRows = MAJ.map((k) => { const r = N(k); return [`<b>${nn(r)}</b>`, ...[0, 1, 2, 3, 4, 5, 6].map((i) => { const c = T.diatonicChord(r, 'major', i, 4); return sym(c.root, c.quality); })]; });
  const MINK = ['A', 'E', 'B', 'F#', 'C#', 'G#', 'D#', 'Eb', 'Bb', 'F', 'C', 'G', 'D'];
  const minRows = MINK.map((k) => { const r = N(k); return [`<b>${nn(r)}m</b>`, ...[0, 1, 2, 3, 4, 5, 6].map((i) => { const c = T.diatonicChord(r, 'aeolian', i, 4); return sym(c.root, c.quality); }), (() => { const c = T.diatonicChord(r, 'harmonic-minor', 4, 4); return sym(c.root, c.quality); })()]; });
  const body = `<div class="two"><div>${circle}</div><div>${side}</div></div>`
    + h3('Diatonic 7th chords in every major key (drop the 7th for the triad: I ii iii IV V vi vii°)')
    + table(['Key', 'Imaj7', 'ii7', 'iii7', 'IVmaj7', 'V7', 'vi7', 'viiø7'], majRows, 'small center')
    + h3('Diatonic 7th chords in every minor key (natural minor, plus the harmonic-minor V7)')
    + table(['Key', 'i7', 'iiø7', '♭IIImaj7', 'iv7', 'v7', '♭VImaj7', '♭VII7', 'V7 (harm.)'], minRows, 'small center')
    + p('Functions: **tonic** I iii vi · **predominant** ii IV · **dominant** V vii°. Qualities never change: maj7 m7 m7 maj7 7 m7 m7♭5 in every major key.', 'note');
  section(P1, 'keys', 'Keys: circle of fifths, signatures, diatonic chords', body);
}

// 7. Progressions & functional harmony ---------------------------------------------------------
function barGrid(ch, key = 'C', per = 4) {
  const { bars } = chart(ch, key);
  let rows = '';
  for (let i = 0; i < bars.length; i += per) rows += `<tr>${bars.slice(i, i + per).map(([r, n]) => `<td><b>${r}</b><br><span class="muted">${n}</span></td>`).join('')}</tr>`;
  return `<table class="grid small">${rows}</table>`;
}
{
  const PROGS = [
    ['Authentic cadence', '| IV:maj | V:7 | I:maj |', 'The strongest ending: V7 → I (the 3rd of V rises to the root, the 7th falls to the 3rd).'],
    ['Plagal cadence', '| IV:maj | I:maj |', '"Amen" ending; softer than V → I.'],
    ['Major ii–V–I', '| ii:m7 | V:7 | I:maj7 |', 'The core of jazz harmony. Learn it in all 12 keys, in every voicing type.'],
    ['Minor ii–V–i', '| ii:m7b5 | V:7b9 | i:m6 |', 'iiø7 and V7♭9 from harmonic minor; the tonic is often m6 or m(maj7).'],
    ['I–vi–ii–V turnaround', '| I:maj7 vi:m7 | ii:m7 V:7 |', 'Two-bar loop at the end of a tune to return to the top.'],
    ['iii–VI–ii–V', '| iii:m7 VI:7 | ii:m7 V:7 |', 'iii replaces I; VI7 is V7/ii (secondary dominant).'],
    ['I–VI7–ii–V', '| I:maj7 VI:7 | ii:m7 V:7 |', 'Make vi dominant for a stronger pull to ii.'],
    ['Tritone turnaround', '| I:maj7 bIII:7 | bVI:7 bII:7 |', 'Every dominant of I–VI–II–V replaced by its tritone sub.'],
    ['Dameron turnaround', '| I:maj7 bIII:maj7 | bVI:maj7 bII:maj7 |', 'Same roots as above, all maj7: a borrowed-chord chain sliding home.'],
    ['Backdoor ii–V', '| iv:m7 bVII:7 | I:maj7 |', '♭VII7 resolves up a whole step: softer, from the parallel minor.'],
    ['Pop / axis', '| I:maj | V:maj | vi:min | IV:maj |', 'Rotate it: vi–IV–I–V and IV–I–V–vi are the same loop.'],
    ['50s / doo-wop', '| I:maj | vi:min | IV:maj | V:maj |', 'Same as I–vi–ii–V with IV in place of ii.'],
    ['Andalusian cadence', '| i:min | bVII:maj | bVI:maj | V:maj |', 'Minor key; bass walks 1–♭7–♭6–5, V is major (harmonic minor).'],
    ['Pachelbel / Canon', '| I:maj V:maj | vi:min iii:min | IV:maj I:maj | IV:maj V:maj |', 'Bass falls by step; endless melodic options.'],
    ['Mixolydian rock', '| I:maj | bVII:maj | IV:maj | I:maj |', '♭VII from Mixolydian; the ♭7 is the colour.'],
    ['Minor rock', '| i:min | bVI:maj | bVII:maj | i:min |', 'Aeolian; ♭VI–♭VII–i is the minor "power cadence".'],
    ['Passing diminished', '| I:maj7 #i:dim7 | ii:m7 #ii:dim7 | iii:m7 |', 'A dim7 a half step below a chord = its rootless V7♭9.'],
    ['Cycle of 4ths (diatonic)', '| I:maj7 IV:maj7 | vii:m7b5 iii:m7 | vi:m7 ii:m7 | V:7 I:maj7 |', 'Every root moves up a 4th: the strongest diatonic motion; ideal for voice-leading drills.'],
    ['Coltrane cycle', '| I:maj7 bIII:7 | bVI:maj7 VII:7 | III:maj7 V:7 | I:maj7 |', 'Three tonics a major 3rd apart, each reached by its V7.'],
  ];
  const progTbl = table(['Name', 'Roman', 'In C', 'Notes'], PROGS.map(([n, c, d]) => { const x = chart(c, /i:min|i:m6/.test(c) ? 'Cm' : 'C'); return [`<b>${n}</b>`, `<b>${x.roman}</b>`, x.names, d]; }), 'small');
  const FUNC = table(['Function', 'Major key', 'Minor key', 'Feels'], [
    ['<b>Tonic</b>', 'I, iii, vi', 'i, ♭III, (♭VI)', 'home, stable'],
    ['<b>Predominant</b> (subdominant)', 'ii, IV (and borrowed iv, iiø7, ♭VI)', 'iiø, iv, ♭VI', 'moving away'],
    ['<b>Dominant</b>', 'V, vii°', 'V (from harmonic minor), vii°7, ♭VII', 'tension: the tritone between 3 and ♭7 wants to resolve'],
  ], 'small');
  const SEC = ['ii', 'iii', 'IV', 'V', 'vi'].map((t) => {
    const deg = { ii: 1, iii: 2, IV: 3, V: 4, vi: 5 }[t];
    const target = T.diatonicChord(C, 'major', deg, 4);
    const v = T.transpose(target.root, '5');
    const minorTarget = target.ivs[1] === 'b3';
    const iiQ = minorTarget ? 'm7b5' : 'm7';
    return [`<b>V7/${t}</b> = ${T.prettyRoman(F.romanOf(C, v, ['1', '3', '5']))}7`, `<b>${sym(v, '7')}</b> → ${sym(target.root, target.quality)}`, nn(T.transpose(v, '3')) + ' (its 3rd, the leading tone)', `${sym(T.transpose(target.root, '2'), iiQ)} – ${sym(v, minorTarget ? '7b9' : '7')}`, minorTarget ? 'Mixolydian ♭6 / Phrygian dominant (♭9 ♭13)' : 'Mixolydian (V7/V: Lydian dominant also good)'];
  });
  const TT = [['G', 'Db'], ['C', 'Gb'], ['D', 'Ab'], ['A', 'Eb'], ['E', 'Bb'], ['B', 'F']].map(([a, b]) => {
    const A3 = T.transpose(N(a), '3'), A7 = T.transpose(N(a), 'b7');
    return [`<b>${sym(a, '7')}</b> ↔ <b>${sym(b, '7')}</b>`, `${nn(A3)} + ${nn(A7)}`, `${nn(A3)} is the ♭7 of ${sym(b, '7')} (spelled ${nn(T.transpose(N(b), 'b7'))}); ${nn(A7)} is its 3rd`];
  });
  const body = h3('Functions') + FUNC
    + h3('Cadences, turnarounds and stock progressions') + progTbl
    + `<div class="keep">${h3('12-bar blues (dominant)')}${barGrid('| I:7 | IV:7 | I:7 | I:7 | IV:7 | IV:7 | I:7 | I:7 | V:7 | IV:7 | I:7 | V:7 |')}${p('Bar 2 = "quick change" to IV (optional). Bars 11–12 are the turnaround.', 'note')}</div>`
    + `<div class="keep">${h3('Jazz blues')}${barGrid('| I:7 | IV:7 | I:7 | v:m7 I:7 | IV:7 | #iv:dim7 | I:7 | iii:m7 VI:7 | ii:m7 | V:7 | I:7 VI:7 | ii:m7 V:7 |')}</div>`
    + `<div class="keep">${h3('Minor blues')}${barGrid('| i:m7 | iv:m7 | i:m7 | i:m7 | iv:m7 | iv:m7 | i:m7 | i:m7 | bVI:7 | V:7 | i:m7 | V:7 |', 'Cm')}</div>`
    + `<div class="keep">${h3('Rhythm changes — A section (AABA; bridge: III7 | % | VI7 | % | II7 | % | V7 | % |)')}${barGrid('| I:6 vi:m7 | ii:m7 V:7 | iii:m7 vi:m7 | ii:m7 V:7 | I:maj7 I:7 | IV:maj7 #iv:dim7 | I:6/5 V:7 | I:6 |')}${p('Bridge in C: ' + chart('| III:7 | % | VI:7 | % | II:7 | % | V:7 | % |').names + ' — a chain of dominants around the cycle of 4ths.', 'note')}</div>`
    + `<div class="keep">${h3('Secondary dominants: V7 of each diatonic chord (in C)')}${table(['Symbol', 'Chord → target', 'Chromatic note', 'Its own ii–V', 'Scale'], SEC, 'small')}</div>`
    + `<div class="keep">${h3('Tritone substitution: dominants a ♭5 apart share their 3rd and ♭7')}${table(['Pair', 'Shared tritone', 'How'], TT, 'small')}${p('So D♭7 can replace G7 before C: the bass falls by half step (D♭ → C) and the guide tones are identical. Over the sub, play Lydian dominant; it equals the altered scale of the original V.', 'note')}</div>`;
  section(P1, 'progressions', 'Progressions and functional harmony', body, { lead: 'Roman numerals relative to the major scale of the tonic; examples in C (minor ones in C minor).' });
}

// 8. Modal interchange -------------------------------------------------------------------------
{
  const MODES = [['ionian', 'Ionian (reference)'], ['lydian', 'Lydian'], ['mixolydian', 'Mixolydian'], ['dorian', 'Dorian'], ['aeolian', 'Aeolian'], ['phrygian', 'Phrygian'], ['locrian', 'Locrian'], ['harmonic-minor', 'Harmonic minor'], ['melodic-minor', 'Melodic minor'], ['harmonic-major', 'Harmonic major']];
  const ref = [0, 1, 2, 3, 4, 5, 6].map((i) => T.diatonicChord(C, 'ionian', i, 4));
  const rows = MODES.map(([id, name]) => [`<b>${name}</b>`, ...[0, 1, 2, 3, 4, 5, 6].map((i) => {
    const c = T.diatonicChord(C, id, i, 4);
    const same = id !== 'ionian' && T.notePc(c.root) === T.notePc(ref[i].root) && c.quality === ref[i].quality;
    return same ? '<span class="faint">=</span>' : `<b>${roman7(C, c)}</b><br>${sym(c.root, c.quality)}`;
  })]);
  const MOVES = [
    ['IV → iv → I', '| IV:maj7 | iv:m6 | I:maj7 |', 'Aeolian', 'The ♭6 (A♭) sighs down to the 5th. The most-used borrowed chord.'],
    ['iv7 → ♭VII7 → I (backdoor)', '| iv:m7 | bVII:7 | I:maj7 |', 'Aeolian', 'A soft dominant: ♭VII7 resolves up a whole step.'],
    ['iiø7 → V7 → I', '| ii:m7b5 | V:7b9 | I:maj7 |', 'Aeolian / harmonic minor', 'Minor ii–V landing on a major tonic: dark approach, bright arrival.'],
    ['V7 → ♭VImaj7 (deceptive) → V7 → I', '| V:7 | bVI:maj7 | V:7 | I:maj7 |', 'Aeolian', 'V7 dodges to ♭VI (leading tone holds as maj7), then tries again.'],
    ['♭VI → ♭VII → I', '| bVI:maj | bVII:maj | I:maj |', 'Aeolian', 'Rising "victory" cadence; no leading tone needed.'],
    ['I → ♭VII → IV → I', '| I:maj | bVII:maj | IV:maj | I:maj |', 'Mixolydian', 'Rock staple; the ♭7 of the key in the bass.'],
    ['I → v → IV', '| I:maj | v:min | IV:maj | I:maj |', 'Mixolydian / Dorian', 'Minor v: a "dominant" with no leading tone, laid-back.'],
    ['I → ♭III → IV', '| I:maj | bIII:maj | IV:maj | I:maj |', 'Aeolian / Dorian', 'Blues-rock colour: the ♭3 of the key as a major chord.'],
    ['I → ♭IImaj7 → I', '| I:maj7 | bII:maj7 | I:maj7 |', 'Phrygian', 'Half-step slide into the tonic; the Neapolitan colour.'],
    ['I → II → IV → I', '| I:maj | II:maj | IV:maj | I:maj |', 'Lydian', 'Major II (♯4 as its 3rd): bright, floating lift.'],
    ['Imaj7 → i7 (parallel minor tonic)', '| I:maj7 | % | i:m7 | % |', 'Dorian / Aeolian', 'Same root, 3rd drops: instant darkening; common in bridges.'],
    ['I → iv6 → I', '| I:maj7 | iv:m6 | I:maj7 | % |', 'Melodic/Aeolian', 'iv6 = iiø7 with the 4th in the bass; the ♭6 → 5 and 6 → 5 voices.'],
    ['vii°7 → I', '| I:maj7 | vii:dim7 | I:maj7 | % |', 'Harmonic major / minor', 'The ♭6 turns viiø7 into a full dim7 leading-tone chord.'],
    ['Dameron turnaround', '| I:maj7 bIII:maj7 | bVI:maj7 bII:maj7 | I:maj7 |', 'Aeolian + Phrygian', 'Chain of borrowed maj7 chords sliding back home.'],
    ['Picardy third', '| iv:m7 | V:7 | I:maj |', 'Ionian into a minor key', 'A minor-key piece ends on a major tonic chord.'],
  ];
  const moveTbl = table(['Move', 'Roman', 'In C', 'Borrowed from', 'What it does'], MOVES.map(([n, c, src, d]) => { const x = chart(c); return [`<b>${n}</b>`, `<b>${x.roman}</b>`, x.names, src, d]; }), 'small');
  const body = p('**Modal interchange** = keep the tonic, borrow chords from a **parallel** scale (same root, different mode). Each row below shows the 7th chords of C in that mode; "=" means identical to the C major chord. Numerals are against C major, so a borrowed chord carries its accidental (♭III, iv, ♭VI, ♭VII).')
    + table(['Mode on C', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII'], rows, 'small center')
    + h3('The 15 moves you will meet most, in context') + moveTbl
    + h3('How to use it') + ul([
      'Find the major-key chord on the same degree, then compare: usually **one note** moves by a half step (A → A♭ for iv, ♭VI; B → B♭ for ♭VII). That note is the sound.',
      'Borrowed chords are mostly **predominants** (iv, iiø7, ♭VI, ♭VII7): they lead to V or straight to I.',
      'Over a borrowed chord, play the **source mode on the tonic** (C Aeolian notes over A♭maj7 and Fm7), or the chord\'s own mode (A♭ Lydian = C Aeolian).',
      'Darkness scale: Lydian (brightest) → Ionian → Mixolydian → Dorian → Aeolian → Phrygian → Locrian. Borrowing from further down = darker colour.',
    ]);
  section(P1, 'interchange', 'Modal interchange: borrowed chords', body);
}

// 9. CAGED -------------------------------------------------------------------------------------
const CAGED_ORDER = ['C', 'A', 'G', 'E', 'D'];
function cagedBands(root) {
  const raw = [];
  CAGED_ORDER.forEach((sh) => {
    const w = F.cagedWindow(root, sh);
    raw.push({ lo: w.lo, hi: w.hi, label: `${sh} shape` });
    if (w.hi + 12 <= 17) raw.push({ lo: w.lo + 12, hi: w.hi + 12, label: `${sh} shape` });
  });
  raw.sort((a, b) => a.lo - b.lo);
  const ends = [];
  for (const b of raw) {
    let row = ends.findIndex((e) => e < b.lo);
    if (row < 0) { row = ends.length; ends.push(-1); }
    ends[row] = b.hi;
    b.row = row;
  }
  return raw;
}
{
  const fullTriad = F.regionNotes({ root: 'C', quality: 'maj', region: { frets: [0, 15] } });
  const fullScale = F.regionNotes({ root: 'C', scale: 'major', region: { frets: [0, 15] } });
  const bands = cagedBands('C').filter((b) => b.lo <= 15);
  const FORMS = [['C', [null, 3, 2, 0, 1, 0]], ['A', [null, 3, 5, 5, 5, 3]], ['G', [8, 7, 5, 5, 5, 8]], ['E', [8, 10, 10, 9, 8, 8]], ['D', [null, null, 10, 12, 13, 12]]];
  const boxes = FORMS.map(([sh, fr]) => fig(chordBox({ notes: dots(grip('C', 'maj', fr), { tones: new Set(['3']) }), compact: true }), `${sh} shape`, `root on string ${{ C: 5, A: 5, G: 6, E: 6, D: 4 }[sh]}`));
  const ROOTS_ON = { C: 'strings 5 and 2', A: 'strings 5 and 3', G: 'strings 6, 3 and 1', E: 'strings 6, 4 and 1', D: 'strings 4 and 2' };
  const shapeTbl = table(['Shape', 'Roots on', 'C chord: root fret', 'Scale window (C major)', 'Next shape up the neck'], CAGED_ORDER.map((sh, i) => {
    const w = F.cagedWindow('C', sh);
    return [`<b>${sh}</b>`, ROOTS_ON[sh], `${w.rootFret} (string ${w.anchor})`, `frets ${w.lo}–${w.hi}`, CAGED_ORDER[(i + 1) % 5]];
  }), 'small');
  const body = fig(neck({ notes: dots(fullTriad, { tones: new Set(['3']) }), lo: 0, hi: 15, fw: 39, bands }), 'C major triad (1 3 5) over the whole neck, with the five CAGED windows')
    + figs(boxes)
    + fig(neck({ notes: dots(fullScale, { tones: new Set(['3', '5']) }), lo: 0, hi: 15, fw: 39, bands }), 'The key of C major over the whole neck: every scale note, chord tones of C shaded')
    + shapeTbl
    + ul([
      'The five open-chord shapes C, A, G, E, D, moved up the neck, tile the fretboard in that order and then repeat (C again at fret 12).',
      'Each chord shape carries a **scale shape**, an **arpeggio shape** and a **pentatonic box** with it (Part II). Learn them as one unit: chord → arpeggio → scale in the same window.',
      'Any key: find the root on string 6, 5 or 4, choose the shape whose root sits there, and the whole system shifts with it. The sequence is always C→A→G→E→D going up.',
    ]);
  section(P1, 'caged', 'CAGED: one key across the whole neck', body);
}

// =============================================================================================
// PART II — THE NECK
// =============================================================================================
const P2 = 'Part II · The neck';
const ssName = (ss) => ss.join('-');
const vrow = (label, sub, items) => `<div class="row"><div class="rl">${label}${sub ? `<small>${sub}</small>` : ''}</div>${figs(items)}</div>`;
const invRow = (root, q, voicing, ss, label) => {
  const vs = inversions(root, q, voicing, ss);
  assert(vs.length === T.getChord(q).ivs.length || voicing === 'shell', `${q} ${voicing} ${ss} has ${vs.length} inversions`);
  return vrow(label ?? `${sym(root, q)}`, `strings ${ssName(ss)}`, vs.map((v) => voicingFig(v, `${INV[v.inversion]} · fret ${startFret(v)}`)));
};

// 10. Triads -------------------------------------------------------------------------------
{
  const SETS = [[3, 2, 1], [4, 3, 2], [5, 4, 3], [6, 5, 4]];
  const INFO = {
    maj: ['Major triad · 1 3 5', 'Tops: root position has the 5 on top, 1st inversion the 1, 2nd inversion the 3. Pick the inversion by the melody note you want on top.'],
    min: ['Minor triad · 1 ♭3 5', 'Every major shape with the 3 lowered one fret. Minor triads = ii, iii, vi of a major key.'],
    dim: ['Diminished triad · 1 ♭3 ♭5', 'Every minor shape with the 5 lowered one fret. vii° of a major key = the top of a V7 (rootless).'],
    aug: ['Augmented triad · 1 3 ♯5', 'Symmetric: every inversion is the same shape 4 frets higher, and each one is also the augmented triad on its own bass note.'],
  };
  let body = p('Close-position triads (all three notes within an octave) on the four adjacent string sets, root C. The three inversions on one string set follow each other up the neck; each grip is movable — slide it so the accent dot lands on your root. The B string makes 3-2-1 and 4-3-2 shapes differ from 5-4-3 and 6-5-4.');
  for (const q of ['maj', 'min', 'dim', 'aug']) {
    body += `<div class="tri"><h3>${INFO[q][0]} <span class="muted">(${notesOf(C, q)})</span></h3>${p(INFO[q][1], 'note')}`;
    for (const ss of SETS) body += invRow('C', q, 'close', ss, `${sym(C, q)}`);
    body += `</div>`;
  }
  body += h3('Drills') + ul([
    'One string set at a time: root position → 1st → 2nd → root position an octave up, saying the bass note interval aloud.',
    'Same chord, all four string sets, staying in one 5-fret area (frets 5–9): find the inversion that lives there on each set.',
    'Diatonic triads of C (C Dm Em F G Am B°) up one string set in one inversion, then in the inversion nearest the previous chord (voice leading).',
    'I–IV–V–I and ii–V–I with the smallest possible movement between chords; each voice moves by step or stays.',
  ]);
  section(P2, 'triads', 'Triads in every inversion', body, { partTitle: P2 });
}

// 11. Drop 2 ------------------------------------------------------------------------------
{
  const plan = [
    ['maj7', [[4, 3, 2, 1], [5, 4, 3, 2], [6, 5, 4, 3]]], ['7', [[4, 3, 2, 1], [5, 4, 3, 2], [6, 5, 4, 3]]], ['m7', [[4, 3, 2, 1], [5, 4, 3, 2], [6, 5, 4, 3]]],
    ['m7b5', [[4, 3, 2, 1], [5, 4, 3, 2]]], ['dim7', [[4, 3, 2, 1], [5, 4, 3, 2]]], ['m6', [[4, 3, 2, 1], [5, 4, 3, 2]]], ['6', [[4, 3, 2, 1], [5, 4, 3, 2]]],
  ];
  let body = `<div class="callout">${md('**How drop 2 is built:** take a close 7th chord (four notes inside an octave) and drop the **second-highest** note an octave. Root position C E G B → drop the G → **C G B E** (1 5 7 3). The result fits four adjacent strings with a one-finger-per-string grip. Each inversion puts a different chord tone in the bass (R → 3 → 5 → 7) and on top. Captions give the bass and top intervals: choose by the bass line you want or by the melody note on top.')}</div>`;
  for (const [q, sets] of plan) for (const ss of sets) body += invRow('C', q, 'drop2', ss);
  body += p('**Shortcuts:** from maj7, lower the 7 one fret → dominant 7; lower the 3 as well → m7; lower the 5 as well → m7♭5; lower the ♭7 again → °7. **°7** is symmetric (all four inversions are the same shape, 3 frets apart). **m6 and m7♭5 share notes:** Cm6 = Am7♭5 (C E♭ G A). **C6 = Am7.**', 'note');
  section(P2, 'drop2', 'Drop 2 voicings', body, { lead: 'The workhorse jazz/comping voicing. All four inversions of each quality on strings 4-3-2-1 and 5-4-3-2 (and 6-5-4-3 for the three main qualities). Root C; grey = 3rd and 7th.' });
}

// 12. Drop 3 ------------------------------------------------------------------------------
{
  let body = `<div class="callout">${md('**How drop 3 is built:** drop the **third-highest** note of a close 7th chord an octave. From the close voicing B C E G (7 1 3 5), dropping the C gives **C B E G = 1 7 3 5**: root on string 6 or 5, one string skipped, then 7, 3, 5 on the next three strings — the classic jazz "barre" grip. The other three inversions put the 3, 5 or 7 in the bass.')}</div>`;
  for (const q of ['maj7', '7', 'm7', 'm7b5']) for (const ss of [[6, 4, 3, 2], [5, 3, 2, 1]]) body += invRow('C', q, 'drop3', ss);
  body += p('Drop 3 puts a low bass under three close upper voices: a big-band / chord-melody sound. Root-position drop 3 on string 6 and drop 2 root position on string 5 are the two grips most players use to comp every chord in a tune.', 'note');
  section(P2, 'drop3', 'Drop 3 voicings', body, { lead: 'Bass note on string 6 or 5, one string skipped, three upper voices on adjacent strings. All four inversions for maj7, 7, m7 and m7♭5. Root C.' });
}

// 13. Shells, guide tones, extended & altered grips --------------------------------------------
{
  const SH = [[6, 4, 3], [6, 5, 4], [5, 3, 2], [5, 4, 3]];
  let body = p('A **shell** is root + 3rd + 7th (no 5th). The 3rd and 7th — the **guide tones** — define the chord; everything else is colour. Two shapes per root string: **1-7-3** and **1-3-7**.');
  for (const q of ['maj7', '7', 'm7', '6']) {
    const items = SH.map((ss) => {
      const v = F.chordVoicings({ root: 'C', quality: q, voicing: 'shell', stringSet: ss, inversion: 'all' }).filter((x) => x.minFret >= 1).sort((a, b) => a.minFret - b.minFret)[0];
      return fig(chordBox({ notes: chordDots(v.notes) }), `${v.notes.map((n) => piv(n.iv)).join('-')} · strings ${ssName(ss)}`, `fret ${startFret(v)}`);
    });
    body += vrow(sym(C, q), q === '6' ? '6 replaces the 7' : '', items);
  }
  // guide-tone ii-V-I
  const GT = [
    ['ii–V–I in C', 'root on 5 → 6 → 5', [['D', 'm7', [null, 5, null, 5, 6, null]], ['G', '7', [3, null, 3, 4, null, null]], ['C', 'maj7', [null, 3, null, 4, 5, null]]]],
    ['ii–V–I in C', 'root on 6 → 5 → 6', [['D', 'm7', [10, null, 10, 10, null, null]], ['G', '7', [null, 10, 9, 10, null, null]], ['C', 'maj7', [8, null, 9, 9, null, null]]]],
  ];
  const gtRow = ([label, sub, chs]) => vrow(label, sub, chs.map(([r, q, fr]) => { const ns = grip(r, q, fr); return fig(chordBox({ notes: chordDots(ns) }), sym(r, q), ns.slice().sort((x, y) => x.midi - y.midi).map((n) => piv(n.iv)).join('-')); }));
  body += h3('Guide tones through ii–V–I') + p('In a ii–V–I the **7th of each chord falls a half step to the 3rd of the next**, while the 3rd stays put and becomes the next 7th: Dm7 (F, C) → G7 (F, B) → Cmaj7 (E, B). Play only those two notes and you already hear the progression. Alternating root strings (5 → 6 → 5 or 6 → 5 → 6) keeps the hand in one place.')
    + GT.map(gtRow).join('');
  // extended & altered grips (hand-written frets, labelled and checked by the engine)
  const GR = [
    ['C', 'maj9', [null, 3, 2, 4, 3, null]], ['C', '6/9', [null, 3, 2, 2, 3, 3]], ['C', 'm9', [null, 3, 1, 3, 3, null]], ['C', 'mMaj7', [null, 3, 5, 4, 4, 3]],
    ['C', 'm6', [null, 3, 1, 2, 1, null]], ['G', 'm11', [3, null, 3, 3, 1, null]], ['C', '9', [null, 3, 2, 3, 3, 3]], ['C', '13', [null, 3, null, 3, 5, 5]],
    ['G', '13', [3, null, 3, 4, 5, null]], ['C', '9sus4', [null, 3, 3, 3, 3, null]], ['C', '7b9', [null, 3, 2, 3, 2, null]], ['G', '7b9', [3, null, 3, 4, 3, 4]],
    ['G', '13b9', [3, null, 3, 4, 5, 4]], ['C', '7#9', [null, 3, 2, 3, 4, null]], ['C', '7#5', [null, 3, null, 3, 5, 4]], ['C', '7#9b13', [null, 3, 2, 3, 4, 4]],
    ['C', '7#11', [null, 3, 4, 3, 5, null]], ['G', 'm7b5', [3, null, 3, 3, 2, null]], ['C', 'dim7', [null, 3, 4, 2, 4, null]], ['G', 'maj7', [3, null, 4, 4, 3, null]],
  ];
  const grips = GR.map(([r, q, fr]) => fig(chordBox({ notes: chordDots(grip(r, q, fr)) }), sym(r, q), fr.map((f) => (f == null ? '×' : f)).join(' ')));
  body += h3('Extended and altered grips (labelled by interval — move them anywhere)') + figs(grips, 'c5')
    + p('Sub-captions give the frets low E → high e (× = not played). Many of these are **rootless in disguise**: e.g. C9 contains E G B♭ D = Em7♭5 over a C bass; C7♯9 = the "blues 7♯9" with the ♯9 on top. Learn each grip as a set of intervals, then you can alter one note at a time (9 → ♭9 → ♯9, 13 → ♭13).', 'note');
  section(P2, 'shells', 'Shells, guide tones and extended grips', body);
}

// 13b. The harmonised scale on the neck -------------------------------------------------------
{
  const row = (size, voicing, ss) => {
    const cs = F.chordScale({ root: 'C', scale: 'major', size, voicing, stringSet: ss, inversion: 0 });
    const items = cs.map((c) => (c.placement ? fig(chordBox({ notes: chordDots(c.placement.notes), compact: true }), `${T.prettyRoman(c.roman)}${size === 4 ? { maj7: 'maj7', 7: '7', m7: '7', m7b5: '7' }[c.quality] ?? '' : ''} · ${sym(c.root, c.quality)}`, `fret ${startFret(c.placement)}`) : ''));
    return vrow(size === 4 ? 'Diatonic 7ths' : 'Diatonic triads', `${voicing === 'close' ? 'root position' : voicing.replace('drop', 'drop ') + ', root pos.'} · strings ${ssName(ss)}`, items);
  };
  const body = p('The seven chords of C major, each in the same inversion, walking up one string set. This is the bridge between the scale shapes and the chord shapes: every voicing is the previous one with each voice moved up to the next scale note. Say the numeral as you play each chord, then do the same in the other inversions and in other keys.')
    + row(3, 'close', [3, 2, 1]) + row(3, 'close', [4, 3, 2]) + row(4, 'drop2', [4, 3, 2, 1]) + row(4, 'drop2', [5, 4, 3, 2]) + row(4, 'drop3', [6, 4, 3, 2])
    + p('Where a voicing would run off the top of the neck the engine drops it an octave, so a row may wrap back down. Next steps: play the same chord scale in 1st, 2nd and 3rd inversion; play it in the parallel modes (section §{interchange}) to hear the borrowed chords.', 'note');
  section(P2, 'harmonised', 'The harmonised scale on the neck', body);
}

// 14. Major scale: CAGED + 3 notes per string -------------------------------------------------
const TONES_OVERRIDE = { altered: ['3', 'b7'], 'super-locrian': ['3', 'b7'], 'altered-dim': ['#9', '#11', '6'] };
const scaleTones = (id) => { if (TONES_OVERRIDE[id]) return new Set(TONES_OVERRIDE[id]); const s = T.getScale(id); const L = s.labels || s.ivs; return L.length === 7 ? new Set([L[2], L[4], L[6]]) : new Set(); };
function scaleFig(spec, title, opts = {}) {
  const ns = F.regionNotes(spec);
  const lo = opts.lo ?? Math.min(...ns.map((n) => n.fret));
  const hi = opts.hi ?? Math.max(...ns.map((n) => n.fret));
  const tones = opts.tones ?? (spec.scale ? scaleTones(spec.scale) : new Set());
  return fig(neck({ notes: dots(ns, { tones, rings: opts.rings || new Set(), ...(opts.label ? { label: opts.label } : {}) }), lo, hi, fw: opts.fw ?? 30, r: 9 }), title, opts.sub ?? `frets ${lo}–${hi}`);
}
{
  const cag = CAGED_ORDER.map((sh) => { const w = F.cagedWindow('C', sh); return scaleFig({ root: 'C', scale: 'major', region: { caged: sh } }, `${sh} shape`, { lo: w.lo, hi: w.hi }); });
  const nps = [1, 2, 3, 4, 5, 6, 7].map((k) => scaleFig({ root: 'C', scale: 'major', region: { nps3: k } }, `Pattern ${k}: starts on the ${['1', '2', '3', '4', '5', '6', '7'][k - 1]} (string 6)`, { fw: 27 }));
  const body = h3('Five CAGED positions (C major)') + figs(cag, 'c3') + p('Grey = the Cmaj7 arpeggio (3 5 7) inside the scale. Each position overlaps the next; together they cover the neck (see section §{caged}). The same five shapes, with a different note called "1", are the five positions of every mode of the major scale.', 'note')
    + h3('Seven three-notes-per-string patterns (C major)') + figs(nps, 'c3') + p('Three notes on every string: even picking groups, wide reach, easy legato. Pattern n starts on scale degree n on string 6; each pattern is also the "home" shape of a mode (pattern 2 = D Dorian, pattern 5 = G Mixolydian…). Each pattern is shown in its lowest position; it repeats 12 frets higher.', 'note');
  const sc = [...T.scaleNotes(C, 'major'), ...T.scaleNotes(C, 'major'), ...T.scaleNotes(C, 'major')].map(nn);
  const seq = (cell, n = 5) => Array.from({ length: n }, (_, i) => cell.map((k) => sc[i + k]).join(' ')).join(' · ') + ' …';
  const seqTbl = table(['Sequence', 'In C (ascending; then descend the same way)'], [
    ['3rds', seq([0, 2], 7)], ['4ths', seq([0, 3], 7)], ['Groups of 3', seq([0, 1, 2])], ['Groups of 4', seq([0, 1, 2, 3])],
    ['Triads (diatonic arpeggios)', seq([0, 2, 4])], ['7th chords (diatonic arpeggios)', seq([0, 2, 4, 6], 4)], ['1-2-3-5 cells', seq([0, 1, 2, 4], 4)],
  ], 'small');
  const body2 = body + h3('Sequences — play every shape through these') + seqTbl;
  section(P2, 'major-scale', 'The major scale: CAGED and 3-notes-per-string', body2, { lead: 'Root C. Practise every shape ascending and descending from the lowest note to the highest and back, then from root to root, saying the interval names. Then sequence it (table below).' });
}

// 15. Parallel modes in one position -------------------------------------------------------
{
  const BR = ['lydian', 'ionian', 'mixolydian', 'dorian', 'aeolian', 'phrygian', 'locrian'];
  const RING = { lydian: '#4', ionian: '7', mixolydian: 'b7', dorian: '6', aeolian: 'b6', phrygian: 'b2', locrian: 'b5' };
  const w = F.cagedWindow('C', 'E');
  const items = BR.map((id) => scaleFig({ root: 'C', scale: id, region: { caged: 'E' } }, `C ${T.getScale(id).name}`, { lo: w.lo, hi: w.hi, rings: new Set([RING[id]]), sub: `${scaleFormula(T.getScale(id))} · colour: ${piv(RING[id])}` }));
  const extra = ['melodic-minor', 'lydian-dominant', 'altered', 'phrygian-dominant', 'harmonic-minor'].map((id) => scaleFig({ root: 'C', scale: id, region: { caged: 'E' } }, `C ${T.getScale(id).name}`, { lo: w.lo, hi: w.hi, sub: scaleFormula(T.getScale(id)) }));
  const body = p('All seven modes of the major scale on the **same root** (C, root on string 6 at fret 8), brightest to darkest. Ringed = the note that gives the mode its colour. Play them back to back over a C drone and listen to one note change at a time. This is the "parallel" view you need for modal interchange; the CAGED/3NPS shapes on the previous page are the "derivative" view (one parent scale, many starting notes).')
    + figs(items, 'c3') + h3('The most-used melodic and harmonic minor modes, same position') + figs(extra, 'c3');
  section(P2, 'modes-neck', 'Modes on one root: the parallel view', body);
}

// 16. Pentatonic and blues -----------------------------------------------------------------
{
  const mk = (root, id, tones, rings) => [1, 2, 3, 4, 5].map((b) => scaleFig({ root, scale: id, region: { box: b } }, `Box ${b}`, { tones, rings, fw: 30 }));
  const body = h3('Minor pentatonic (A): 1 ♭3 4 5 ♭7') + figs(mk('A', 'minor-pentatonic', new Set(['b3', '5'])), 'c3')
    + h3('Major pentatonic (C): 1 2 3 5 6 — the same five shapes, root moved to the relative major') + figs(mk('C', 'major-pentatonic', new Set(['3', '5'])), 'c3')
    + h3('Blues scale (A): minor pentatonic + ♭5 (ringed)') + figs(mk('A', 'blues', new Set(['b3', '5']), new Set(['b5'])), 'c3')
    + p('Box 1 is the familiar root-on-string-6 shape. Boxes connect end to end (box 1\'s top notes are box 2\'s bottom notes) and repeat after box 5. The major-pentatonic boxes are the minor ones with the root moved: A minor pentatonic = C major pentatonic. Over a dominant blues, mix the two (♭3 → 3 slides) and add the ♭5.', 'note');
  section(P2, 'pentatonic', 'Pentatonic and blues boxes', body, { lead: 'Grey = the triad tones (minor ♭3 and 5, major 3 and 5). The pentatonic is a major/minor scale with the two "difficult" notes removed: no half steps, nothing clashes.' });
}

// 17. Melodic and harmonic minor ------------------------------------------------------------
{
  const mk = (id) => CAGED_ORDER.map((sh) => { const w = F.cagedWindow('C', sh); return scaleFig({ root: 'C', scale: id, region: { caged: sh } }, `${sh} shape`, { lo: w.lo, hi: w.hi, rings: id === 'harmonic-minor' ? new Set(['b6', '7']) : new Set(['6', '7']) }); });
  const body = h3('C melodic minor: 1 2 ♭3 4 5 6 7 (ringed: the ♮6 and ♮7 that differ from natural minor)') + figs(mk('melodic-minor'), 'c3')
    + h3('C harmonic minor: 1 2 ♭3 4 5 ♭6 7 (ringed: the ♭6–7 augmented 2nd)') + figs(mk('harmonic-minor'), 'c3')
    + p('Same five CAGED windows as the major scale. Use them through their modes: **G altered = A♭ melodic minor**, **F Lydian dominant = C melodic minor**, **A Locrian ♮2 = C melodic minor**, **G Phrygian dominant = C harmonic minor**. Know the parent shape, then think of the chord\'s root inside it.', 'note');
  section(P2, 'minor-scales', 'Melodic minor and harmonic minor', body, { lead: 'Grey = the tonic Cm(maj7) arpeggio (♭3 5 7) inside each scale.' });
}

// 18. Symmetric scales -----------------------------------------------------------------------
{
  const hwLab = (n) => piv({ b2: 'b9', '#2': '#9', '#4': '#11', 6: '13' }[n.iv] || n.iv);
  const body = h3('Half-whole diminished (C): use over C7♭9 / C13♭9') + figs([
    scaleFig({ root: 'C', scale: 'diminished-hw', region: { position: 7 } }, 'One position', { tones: new Set(['3', '5', 'b7']), label: hwLab }),
    scaleFig({ root: 'C', scale: 'diminished-hw', region: { nps3: 1 } }, 'Three notes per string', { tones: new Set(['3', '5', 'b7']), fw: 27, label: hwLab }),
  ], 'c3')
    + h3('Whole-half diminished (C): use over C°7') + figs([
      scaleFig({ root: 'C', scale: 'diminished-wh', region: { position: 7 } }, 'One position', { tones: new Set(['b3', 'b5', 'bb7']) }),
      scaleFig({ root: 'C', scale: 'diminished-wh', region: { nps3: 1 } }, 'Three notes per string', { tones: new Set(['b3', 'b5', 'bb7']), fw: 27 }),
    ], 'c3')
    + h3('Whole tone (C): use over C7♯5 / C9♯5') + figs([
      scaleFig({ root: 'C', scale: 'whole-tone', region: { position: 7 } }, 'One position', { tones: new Set(['3', '#5', 'b7']) }),
      scaleFig({ root: 'C', scale: 'whole-tone', region: { position: 10 } }, 'Next position (two frets up)', { tones: new Set(['3', '#5', 'b7']) }),
    ], 'c3')
    + p('Half-whole is labelled as tensions over C7 (♭9 ♯9 ♯11 13). Grey = the chord the scale is used over (C7 for half-whole, C°7 for whole-half, C7♯5 for whole tone). **Diminished: move any shape 3 frets and it is the same scale** (the root changes to another chord tone). **Whole tone: move any shape 2 frets.** So there are only three diminished scales and two whole-tone scales to learn.', 'note');
  section(P2, 'symmetric', 'Symmetric scales: diminished and whole tone', body);
}

// 19. Arpeggios ---------------------------------------------------------------------------
{
  let body = '';
  for (const q of ['maj7', '7', 'm7', 'm7b5', 'dim7']) {
    const items = CAGED_ORDER.map((sh) => { const w = F.cagedWindow('C', sh); const ns = F.regionNotes({ root: 'C', quality: q, region: { caged: sh } }); return fig(neck({ notes: dots(ns, { tones: GUIDE }), lo: w.lo, hi: w.hi, fw: 30 }), `${sh} shape`, `frets ${w.lo}–${w.hi}`); });
    body += `<div class="keep">${h3(`${sym(C, q)} arpeggio · ${fmt(T.getChord(q).ivs)} <span class="muted">(${notesOf(C, q)})</span>`)}${figs(items, 'c3')}</div>`;
  }
  body += p('Practise each arpeggio from the lowest chord tone in the window to the highest and back, then from the root, then starting on the 3rd, 5th and 7th. Then cycle the qualities in one shape (maj7 → 7 → m7 → m7♭5 → °7): each step lowers one note by a fret.', 'note');
  section(P2, 'arpeggios', 'Seventh-chord arpeggios in the five CAGED shapes', body, { lead: 'Root C, grey = 3rd and 7th. The arpeggio is the skeleton of every scale shape in the same window: these are the notes to land on.' });
}

// =============================================================================================
// PART III — HARMONY, EAR, RHYTHM AND PRACTICE
// =============================================================================================
const P3 = 'Part III · Harmony, improvisation, rhythm, ear, practice';
// interval of a note over a chord root, named the way a jazz player hears it over that chord
function ivOver(root, note, kind) {
  let iv = T.intervalBetween(N(root), N(note));
  if (iv === 'b4') iv = '3';
  const dom = kind === 'dom';
  const map = { b2: 'b9', 2: '9', '#2': '#9', b3: dom ? '#9' : 'b3', 4: '11', '#4': '#11', b5: kind === 'hd' || kind === 'dim' ? 'b5' : '#11', '#5': dom ? 'b13' : '#5', b6: dom ? 'b13' : 'b6', 6: '13', bb7: kind === 'dim' ? 'bb7' : '13' };
  return piv(map[iv] ?? iv);
}

// 20. Voice leading and chord melody ---------------------------------------------------------
{
  const iiVI = T.parseChart('| ii:m7 | V:7 | I:maj7 |', C).flat();
  const names = iiVI.map((c) => sym(c.root, c.quality));
  const vlRow = (ss, sf) => { const pl = F.voiceLead(iiVI, { voicing: 'drop2', stringSet: ss, startFret: sf }); return vrow('ii–V–I in C', `drop 2 · ${ssName(ss)}`, pl.map((v, i) => fig(chordBox({ notes: chordDots(v.notes) }), names[i], v.notes.slice().sort((a, b) => a.midi - b.midi).map((n) => piv(n.iv)).join(' ')))); };
  const cyc = ['C', 'F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'B', 'E', 'A', 'D', 'G'];
  const gtRows = [cyc.map((k) => `<b>${sym(k, '7')}</b>`), cyc.map((k, i) => nn(i % 2 ? T.transpose(N(k), '3') : T.transpose(N(k), 'b7')) + (i % 2 ? ' (3)' : ' (♭7)')), cyc.map((k, i) => nn(i % 2 ? T.transpose(N(k), 'b7') : T.transpose(N(k), '3')) + (i % 2 ? ' (♭7)' : ' (3)'))];
  const d2 = inversions('C', 'maj7', 'drop2', [4, 3, 2, 1]);
  const d3 = inversions('C', 'maj7', 'drop3', [5, 3, 2, 1]);
  const topTbl = table(['Melody note on top', ...['1', '3', '5', '7'].map((x) => `<b>${x}</b>`)], [
    ['Drop 2, strings 4-3-2-1', ...['1', '3', '5', '7'].map((t) => { const v = d2.find((x) => topIv(x) === t); return v ? `${INV[v.inversion]} (${piv(v.bassIv)} in bass)` : '—'; })],
    ['Drop 3, strings 5-3-2-1', ...['1', '3', '5', '7'].map((t) => { const v = d3.find((x) => topIv(x) === t); return v ? `${INV[v.inversion]} (${piv(v.bassIv)} in bass)` : '—'; })],
  ], 'small center');
  const body = h3('Principles') + ul([
    '**Keep common tones** in the same voice; move every other voice by the **smallest step** available (half or whole step).',
    '**Guide tones (3rd and 7th) carry the harmony.** When the root moves up a 4th (ii–V, V–I, any cycle of 4ths) the 7th falls a step to the next 3rd and the 3rd holds to become the next 7th (between two dominant 7ths it slips down a half step instead).',
    '**Contrary motion** between bass and top voice sounds strongest; parallel motion in all voices sounds like sliding shapes (fine as an effect, weak as voice leading).',
    'In any one area of the neck, choose the **inversion** of the next chord that is closest to the current one — never jump to the "root-position" grip by habit.',
  ])
    + h3('ii–V–I voice-led (engine-chosen nearest inversions)') + vlRow([4, 3, 2, 1], 3) + vlRow([5, 4, 3, 2], 8)
    + h3('Guide-tone line through the cycle of 4ths (dominant 7ths)') + table(['', ...cyc.map((_, i) => i + 1)], [['Chord', ...gtRows[0]], ['Upper voice', ...gtRows[1]], ['Lower voice', ...gtRows[2]]], 'small center')
    + p('With dominant 7ths all the way round, **both voices slide down a half step at every change**: the ♭7 becomes the next 3rd and the 3rd becomes the next ♭7, so the two lines swap roles each bar. Play them on strings 4-3 or 3-2 through all 12 dominants without moving more than one fret.', 'note')
    + h3('Chord melody: the melody note goes on top') + topTbl + ul([
      '**1. Learn the melody** on the top two strings in one position; sing it.',
      '**2. Strong beats get a chord** with the melody note as the highest voice: look up which inversion puts that chord tone on top (table above). Drop 3 adds a bass note under the melody; drop 2 keeps it compact.',
      '**3. Melody note not a chord tone?** Treat it as a tension: 9 replaces the root, 13 replaces the 5th, 11 / ♯11 replaces the 3rd on minor / major chords. Or harmonise it with a diatonic or diminished **passing chord**.',
      '**4. Between strong beats** play single melody notes, or move inner voices. Bass notes on beat 1 and 3 imply the harmony with very little effort.',
      '**5. Reharmonise** (next section) only after the plain version sounds smooth.',
    ]);
  section(P3, 'voice-leading', 'Voice leading and chord melody', body, { partTitle: P3 });
}

// 21. Reharmonisation -------------------------------------------------------------------------
{
  const RH = [
    ['Diatonic substitution', 'Chords sharing two notes can replace each other: I ↔ iii ↔ vi, IV ↔ ii.', '| I:maj7 | IV:maj7 | ii:m7 | V:7 |', '| iii:m7 | ii:m7 | ii:m7 | V:7 |'],
    ['Secondary dominant', 'Precede any chord with its own V7 (a 5th above).', '| I:maj7 | ii:m7 | V:7 | I:maj7 |', '| I:maj7 VI:7 | ii:m7 | V:7 | I:maj7 |'],
    ['Related ii', 'Split any dominant into its ii–V.', '| I:maj7 | VI:7 | ii:m7 V:7 | I:maj7 |', '| I:maj7 | iii:m7 VI:7 | ii:m7 V:7 | I:maj7 |'],
    ['Tritone substitution', 'Replace V7 with the dominant a ♭5 away: bass falls by half steps.', '| ii:m7 | V:7 | I:maj7 |', '| ii:m7 | bII:7 | I:maj7 |'],
    ['Backdoor dominant', 'Approach I from ♭VII7 (with its ii: iv7).', '| ii:m7 | V:7 | I:maj7 |', '| iv:m7 | bVII:7 | I:maj7 |'],
    ['Passing diminished', 'A dim7 a half step below the target fills a whole-step bass gap.', '| I:maj7 | ii:m7 | iii:m7 |', '| I:maj7 #i:dim7 | ii:m7 #ii:dim7 | iii:m7 |'],
    ['Modal interchange', 'Borrow from the parallel minor (section §{interchange}).', '| I:maj7 | IV:maj7 | I:maj7 |', '| I:maj7 | iv:m6 | I:maj7 |'],
    ['Side-step (chromatic approach chord)', 'Approach any chord from a half step above or below with the same quality.', '| ii:m7 | V:7 | I:maj7 |', '| biii:m7 ii:m7 | bII:7 V:7 | I:maj7 |'],
    ['Line cliché', 'Hold the chord; move one inner voice chromatically.', '| i:min | % | % | % |', '| i:min | i:mMaj7 | i:m7 | i:m6 |'],
    ['Pedal point', 'Keep the bass on one note (usually 1 or 5) while the chords above change.', '| I:maj7 | IV:maj7 | V:7 | I:maj7 |', '| I:maj7 | IV:maj7/5 | V:7sus4 | I:maj7 |'],
    ['Extend and alter', 'Same function, richer chord: maj7 → maj9/6/9, m7 → m9/m11, V7 → 13 / 7♭9 / 7alt.', '| ii:m7 | V:7 | I:maj7 |', '| ii:m9 | V:7alt | I:6/9 |'],
  ];
  const rows = RH.map(([n, rule, a, b]) => { const A = chart(a, /i:min/.test(a) ? 'Cm' : 'C'), B = chart(b, /i:min/.test(b) ? 'Cm' : 'C'); return [`<b>${n}</b>`, rule, `${A.roman}<br><span class="muted">${A.names}</span>`, `<b>${B.roman}</b><br><span class="muted">${B.names}</span>`]; });
  const body = table(['Technique', 'Rule', 'Before', 'After (in C)'], rows, 'small')
    + h3('Order of operations') + ul([
      '**Keep the melody.** A reharmonisation must still contain (or tension-colour) the melody note on each strong beat. Check: is the melody a chord tone or a usable tension of the new chord?',
      '**Keep the arrival points** (cadences, the tonic at phrase ends); reharmonise the road, not the destination.',
      '**Change one thing at a time**, play it, and decide by ear. Two or three substitutions per chorus is plenty.',
      'Every substitution is a **voice-leading** device: the good ones move the bass or a guide tone by a half step.',
    ]);
  section(P3, 'reharm', 'Reharmonisation essentials', body);
}

// 22. Improvisation ---------------------------------------------------------------------------
{
  const SUP = [
    ['C', 'maj7', 'E', 'm7', 'maj', 'Cmaj9 without the root'], ['C', 'maj7', 'G', 'maj7', 'maj', 'Lydian brightness'], ['C', 'maj7', 'B', 'm7', 'maj', 'maj13♯11, very open'],
    ['D', 'm7', 'F', 'maj7', 'min', 'Dm9'], ['D', 'm7', 'A', 'm7', 'min', 'Dm11, open'],
    ['G', '7', 'B', 'm7b5', 'dom', 'G9'], ['G', '7', 'D', 'm7', 'dom', 'G9sus / 11 colour'], ['G', '7', 'B', 'dim7', 'dom', 'G7♭9'], ['G', '7', 'Db', '7', 'dom', 'tritone sub: ♯11 and ♭9'],
    ['G', '7alt', 'Bb', 'm7', 'dom', 'altered'], ['G', '7alt', 'Ab', 'mMaj7', 'dom', 'altered (melodic minor ½ step up)'],
    ['B', 'm7b5', 'D', 'm7', 'hd', 'Locrian, adds ♭9'], ['C', 'mMaj7', 'Eb', 'maj7#5', 'min', 'melodic-minor colour with 9'],
  ];
  const sup = table(['Over', 'Play the arpeggio of', 'Which gives', 'Sound'], SUP.map(([r, q, ar, aq, kind, snd]) => [
    `<b>${sym(r, q)}</b>`, `<b>${sym(ar, aq)}</b> (${notesOf(ar, aq)})`, T.chordNotes(N(ar), aq).map((n) => ivOver(r, n, kind)).join(' '), snd,
  ]), 'small');
  const ENC = [
    ['Chromatic approach from below', 'D♯ → E', 'F♯ → G'],
    ['Scale approach from above', 'F → E', 'A → G'],
    ['Enclosure: above, then below', 'F → D♯ → E', 'A → F♯ → G'],
    ['Enclosure: below, then above', 'D♯ → F → E', 'F♯ → A → G'],
    ['Double chromatic from below', 'D → D♯ → E', 'F → F♯ → G'],
    ['Double chromatic from above', 'F♯ → F → E', 'A → A♭ → G'],
    ['Scale above + chromatic below', 'F → D → D♯ → E', 'A → F → F♯ → G'],
  ];
  const body = h3('The note hierarchy') + table(['Level', 'Notes', 'Where they go'], [
    ['<b>Chord tones</b>', '1 3 5 7 (3rd and 7th most of all)', 'on the beat, at the start and end of phrases, on chord changes'],
    ['<b>Tensions</b>', '9 11 13 and alterations, from the chord–scale', 'held for colour, or resolved to a neighbouring chord tone'],
    ['<b>Passing / approach notes</b>', 'any note a half or whole step from a target', 'off the beat, moving into a chord tone'],
  ], 'small')
    + h3('Target tones, approach notes and enclosures (targets: E = 3rd of C, G = 5th of C)') + table(['Device', 'Into E', 'Into G'], ENC, 'small')
    + p('Aim each phrase at a **target** (usually the 3rd or 7th of the next chord) and arrive **on the beat**: start the approach figure early enough that the target lands on beat 1 (or 3). The **bebop scales** add one chromatic passing note so that a run of 8th notes starting on a chord tone on the beat keeps chord tones on every beat.', 'note')
    + h3('Arpeggio superimposition: one shape, richer sound') + sup
    + p('Rule of thumb: an arpeggio built on the **3rd** of a chord gives 3 5 7 9; on the **5th** gives 5 7 9 11/♯11; on the **7th** gives 7 9 11 13. Over a dominant, the **dim7 on the 3rd** gives 7♭9 and the **tritone sub\'s dominant** gives ♯11 ♭7 ♭9 3.', 'note')
    + `<div class="two"><div>${h3('Motif development')}${ul([
      '**Repeat** it — then change one thing.',
      '**Sequence:** move it up/down the scale or by a fixed interval.',
      '**Displace** it rhythmically: start it on beat 2, or an 8th later.',
      '**Augment / diminish:** double or halve the note values.',
      '**Invert** the contour (up becomes down); **retrograde** (backwards).',
      '**Fragment:** keep only its first two or three notes and build from them.',
      '**Call and response:** a two-bar phrase, then a two-bar answer.',
    ])}</div><div>${h3('Playing over changes — build it in layers')}${ul([
      '**1. Roots** in time (one per chord), then **guide tones** (3rds and 7ths) as a slow melody.',
      '**2. Arpeggios**, nearest inversion to the previous one, connecting at the change.',
      '**3. Arpeggio + approach notes** into each next chord tone.',
      '**4. Scales** linking chord tones; land a chord tone on each change.',
      '**5. Superimpositions, tensions, side-slipping** and outside-inside lines.',
      '**6. Motifs** carried across the changes: same idea, adjusted to each chord.',
    ])}</div></div>`
    + h3('Phrasing') + ul([
      'Leave space: phrases of 2–4 bars with rests between. Rests are where the listener digests the idea.',
      'Vary where phrases start (beat 1, the "and" of 1, beat 2, the "and" of 4 of the previous bar) and how long they are.',
      'Sing the phrase, then play it. If you cannot sing it, simplify it.',
      'Dynamics, articulation (slides, hammer-ons, ghost notes), vibrato and note length are half of the message.',
    ]);
  section(P3, 'improv', 'Improvisation essentials', body);
}

// 23. Rhythm and time ------------------------------------------------------------------------
{
  const G = (steps, title, sub, opts) => fig(rhythmGrid(steps, opts), title, sub);
  const body = `<div class="two"><div>${h3('Subdivisions')}${table(['Subdivision', 'Count it', 'Per beat'], [
    ['Quarters', '1 2 3 4', 1], ['8ths', '1 & 2 &', 2], ['8th triplets', '1 trip let 2 trip let', 3], ['16ths', '1 e & a 2 e & a', 4], ['Quintuplets', '1 ta ka di mi', 5], ['16th triplets (sextuplets)', '1 la li & la li', 6],
  ], 'small')}</div><div>${h3('Feels')}${table(['Feel', 'What it means'], [
    ['Straight', 'each beat split evenly (1 : 1)'], ['Swing / shuffle', 'each beat long–short, about 2 : 1 — the "1" and "let" of 1-trip-let; lighter (closer to straight) at fast tempos'],
    ['Backbeat', 'accents on 2 and 4'], ['Syncopation', 'accents off the beat: the "&", "e", "a" — or tied over the beat'], ['Half-time / double-time', 'the pulse feels half or twice as fast; the chords do not change speed'],
  ], 'small')}</div></div>`
    + h3('Patterns to know (16 steps = one 4/4 bar of 16ths; accent colour = accent)') + figs([
      G('X.x.X.x.X.x.X.x.', 'Straight 8th strum, backbeat', 'down on each beat, up on each "&"; accent 2 and 4'),
      G('x...x.x...x.x.x.', 'Pop strum', 'D · D U · U D U (1, 2 &, & 4 &)'),
      G('x.xxX.x.x.xxX.x.', 'Funk 16ths', 'keep the hand moving in 16ths; hit only some'),
      G('x.....x.........', 'Charleston', 'swing comping: beat 1 and the "&" of 2'),
      G('..x.....x.......', 'Reverse Charleston', 'the "&" of 1 and beat 3'),
      G('x...X...x...X...', 'Four to the bar (Freddie Green style)', 'short quarter notes, 2 and 4 slightly stronger'),
      G('x..x..x...x.x...', 'Son clave 3-2', 'the backbone of Afro-Cuban music'),
      G('..x.x...x..x..x.', 'Son clave 2-3', 'same pattern starting on the other bar'),
      G('x..x...x..x.x...', 'Rumba clave 3-2', 'third note pushed late'),
      G('x..x..x...x..x..', 'Bossa nova clave', 'the guitar\'s thumb plays 1 and 3 underneath'),
      G('x..x..x.x..x..x.', 'Tresillo (3+3+2), twice', 'Latin, second-line, reggaeton, pop'),
      G('x.xx.xx.xx.x', 'Shuffle / swing 8ths', 'triplet grid: play the 1st and 3rd of each triplet', { group: 3 }),
    ], 'c3')
    + h3('Time-feel practice') + ul([
      '**Metronome on 2 and 4:** set the click to half the tempo and hear it as beats 2 and 4 (the hi-hat in swing). Count out loud until it locks.',
      '**Gap click:** click only on beat 1, then only on beat 1 of every second bar, then every fourth. Your internal time fills the gaps.',
      '**Subdivide every tempo:** play quarters, 8ths, triplets, 16ths against the same click; switch on command without losing the beat.',
      '**Slow is harder:** practise at 40–60 bpm as well as fast; at slow tempos every note placement shows.',
      '**Tempo ladder:** start where it is perfect, go up 4–6 bpm per success, back down 10 when it breaks. Stop at 3 clean repetitions.',
      '**Comping time:** play only the rhythm (muted strings) with the click; then add chords without changing the feel.',
      '**Record yourself** against the click and listen back: are you ahead, behind, or on it? Then do it on purpose.',
    ]);
  section(P3, 'rhythm', 'Rhythm and time', body);
}

// 24. Ear training ---------------------------------------------------------------------------
{
  const body = `<div class="two"><div>${h3('Intervals')}${ul([
    'Sing every interval up and down from any note before you play it; use the reference tunes in section §{intervals} only as a bridge.',
    'Recognise intervals **in a key** (as scale degrees) rather than in isolation: hear 5 → 1, 7 → 1, 4 → 3.',
    'Do melodic (one after the other) and harmonic (together) intervals; harmonic ones are what you hear inside chords.',
    'On the guitar: play a root, sing a target interval, then find it on the neck. Check. Repeat in every position.',
  ])}</div><div>${h3('Chord qualities')}${table(['Chord', 'Hear it as'], [
    ['Major', 'bright, stable'], ['Minor', 'dark, stable'], ['Diminished', 'tense, closed'], ['Augmented', 'floating, unresolved'], ['sus4', 'suspended, wants the 3rd'],
    ['maj7', 'lush; the 7 rubs against the root'], ['7', 'bluesy, pulls to resolve'], ['m7', 'soft minor'], ['m7♭5', 'dark, yearning'], ['°7', 'dramatic, symmetrical'],
  ], 'small')}</div></div>`
    + h3('Function: hearing where you are in the key') + ul([
      '**Sing the bass line.** Most progressions are recognisable from the bass: 1–4–5–1, 1–6–2–5, 1–♭7–4, the chromatic descents.',
      '**Hear degrees, not letters:** play a cadence in a key, then a single note; name its degree (do–re–mi or 1–2–3). Ten a day, random keys.',
      '**Chord numerals:** I and vi share two notes (tonic family); ii and IV (predominant) "lean"; V and vii° pull. Name the function before the exact chord.',
      '**Colour notes:** borrowed iv (the ♭6), ♭VII (the ♭7), secondary dominants (a raised note that resolves up), tritone subs (bass falling by half step).',
    ])
    + h3('Transcribing — the fastest ear trainer') + ul([
      '**Choose** something short and slightly too hard: one 4–8 bar phrase.',
      '**Sing it** until you can sing it without the recording. Only then look for it on the guitar.',
      '**Find the key and the bass** first, then the melody, then the chords.',
      '**Slow it down** (software at 50–75%) without changing pitch for fast passages.',
      '**Analyse** what you transcribed with Part I: chord tones? approach notes? which scale? Then play it in three other keys and use it in your own playing.',
    ])
    + h3('A 10-minute daily ear routine') + table(['Minutes', 'Activity'], [
      ['2', 'Sing a major scale and a minor scale from a random note; check with the guitar.'],
      ['3', 'Interval drill: a partner, an app, or the Guitar Cards ear gym — 20 intervals, melodic and harmonic.'],
      ['3', 'Chord-quality drill: triads and 7th chords, root position then inversions.'],
      ['2', 'Function drill: play I–IV–V–I, then a note or chord; name its degree / numeral.'],
    ], 'small');
  section(P3, 'ear', 'Ear training', body);
}

// 25. Mastery plan and checklists --------------------------------------------------------------
{
  const plan = table(['Block', 'Minutes', 'What', 'Example'], [
    ['Warm-up / technique', '10', 'scales and arpeggios from Part II, in time', 'one CAGED position of today\'s key: scale, then maj7/7/m7 arpeggios, saying intervals'],
    ['Fretboard & theory', '10', 'note finding, intervals, Part I tables', 'find every 3rd and 7th of today\'s ii–V–I on strings 4-3-2'],
    ['Chords & voice leading', '15', 'triads, drop 2/3, shells through progressions', 'ii–V–I in today\'s key with drop 2 on 4-3-2-1, three inversions'],
    ['Improvisation', '15', 'layers from section §{improv} over a backing loop', 'guide tones → arpeggios → approach notes over a blues'],
    ['Ear', '5', 'section §{ear} routine', 'sing the bass line of the tune you are learning'],
    ['Repertoire / music', '5+', 'play a real tune with everything above', 'melody, then comp, then a chorus of solo'],
  ], 'small');
  const ladder = table(['Level', 'You can…'], [
    ['1', 'play it while reading the diagram'],
    ['2', 'play it from memory in C, saying every interval'],
    ['3', 'play it in three more keys (G, F, B♭) without hesitation'],
    ['4', 'play it in all 12 keys around the cycle of 4ths at 60 bpm'],
    ['5', 'play it in time at 120 bpm (8th notes) and start from any note or inversion'],
    ['6', 'use it in music: hear it before you play it, and choose it on purpose'],
  ], 'small');
  const CHECK = [
    [['notes', 'intervals'], 'Fretboard and intervals', ['Name any note at any fret in under 2 seconds.', 'Find the 3, 5 and ♭7 above any root on any string without counting.', 'Sing any interval up and down from any note.']],
    [['chords', 'grips'], 'Chord formulas and grips', ['Spell every chord in the table from any root, aloud, in under 5 seconds.', 'Play every open and barre grip, changing between any two in time at 80 bpm.', 'Build any chord on the neck from its formula without a stored grip.']],
    [['systems'], 'Harmonic systems', ['Name the 7th chord on every degree of major, melodic minor and harmonic minor.', 'Name the mode, its formula and its colour note for every degree of all four systems.']],
    [['chord-scales'], 'Chord–scale', ['For any chord in a tune, name two scales and play them over it in one position.']],
    [['keys', 'progressions'], 'Keys and progressions', ['Write and play the diatonic chords of any key.', 'Play ii–V–I, I–vi–ii–V, the three blues forms and rhythm-changes A in all 12 keys.', 'Recognise these progressions by ear.']],
    [['interchange'], 'Modal interchange', ['Name the source and the changed note of every borrowed chord; play all 15 moves in 4 keys.']],
    [['caged'], 'CAGED', ['Play a chord, its arpeggio and its scale in all five shapes, in any key, connecting the shapes up and down the neck.']],
    [['triads'], 'Triads', ['Play all inversions of all four triad types on all four string sets, in any key, at 60 bpm, naming bass and top note.']],
    [['drop2', 'drop3'], 'Drop 2 and drop 3', ['Play every inversion of maj7, 7, m7, m7♭5 on each string set in any key.', 'Comp a ii–V–I in any key with the nearest inversion each time.']],
    [['shells', 'harmonised'], 'Shells, grips, harmonised scale', ['Comp a jazz blues and rhythm changes with shells only; then add 9ths, 13ths and altered grips.', 'Play the diatonic 7th chords of any key up the neck on two string sets, naming each numeral.']],
    [['major-scale', 'modes-neck', 'pentatonic', 'minor-scales', 'symmetric', 'arpeggios'], 'Scales and arpeggios', ['Play the major scale in all CAGED and 3NPS shapes in any key; sequence it in 3rds and 4ths.', 'Play all seven modes from one root and hear each colour note.', 'Play all five pentatonic boxes connected end to end.', 'Play every arpeggio in all five shapes from any chord tone.', 'Locate melodic minor, harmonic minor, diminished and whole-tone shapes around any root.']],
    [['voice-leading', 'reharm', 'improv'], 'Voice leading, reharmonisation, improvisation', ['Play a guide-tone line through a standard.', 'Arrange a simple melody as chord melody, then reharmonise two bars of it.', 'Improvise over ii–V–I and blues landing chord tones on the changes, with enclosures and a developed motif.']],
    [['rhythm', 'ear'], 'Rhythm and ear', ['Play with the click on 2 and 4 at 60 and 200 bpm; keep time through a 4-bar gap.', 'Transcribe and play an 8-bar solo phrase; identify a progression\'s numerals by ear.']],
  ];
  const checks = table(['§', 'Section', 'You have mastered it when you can…'], CHECK.map(([ids, t, items]) => [ids.map((id) => `§{${id}}`).join(', '), `<b>${t}</b>`, `<ul class="check">${items.map((i) => `<li>${md(i)}</li>`).join('')}</ul>`]), 'small chk');
  const body = h3('How to drill this guide') + ul([
    '**One small thing, every day.** 60 focused minutes beats 4 hours once a week. Short daily sessions consolidate in sleep.',
    '**Spaced repetition:** revisit each item after 1 day, 3 days, a week, two weeks, a month. Use the Guitar Cards app — it schedules this for you — or a written log.',
    '**All 12 keys, around the cycle of 4ths** (C F B♭ E♭ A♭ D♭ G♭ B E A D G). One key per day for a shape you know; one key per week for a new one.',
    '**Slow → fast:** perfect at slow tempo first. Speed is the last thing you add.',
    '**Say it, then sing it.** Say the interval of every note as you play it; sing the line (or the target note) before you play it.',
    '**Mix the views:** the same material as a chord, an arpeggio, a scale, a line, in one position and along one string.',
    '**Make music with it within a week:** every new shape goes into a tune, a progression or an improvisation.',
  ])
    + `<div class="two"><div>${h3('A 60-minute session')}${plan}</div><div>${h3('The mastery ladder (for any item)')}${ladder}</div></div>`
    + h3('Mastery checklist — you have mastered a section when you can…') + checks;
  section(P3, 'practice', 'The mastery plan and checklists', body);
}

// =============================================================================================
// ASSEMBLY
// =============================================================================================
const CSS = `
@page { size: A4; margin: 12mm 12mm 13mm;
  @bottom-center { content: counter(page); font: 9px -apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif; color: #777; }
  @bottom-right { content: "Guitar Mastery"; font: 8px -apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif; color: #aaa; } }
@page :first { @bottom-center { content: none; } @bottom-right { content: none; } }
* { box-sizing: border-box; }
html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body { margin: 0; background: #fff; color: #1b1b1b; font: 10.5px/1.42 -apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif; }
svg { flex: none; }
svg text { font-family: -apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif; }
section.sec { break-before: page; }
.partband { font-size: 9px; letter-spacing: .14em; text-transform: uppercase; color: ${ACC}; font-weight: 700; margin-bottom: 2px; }
h2 { font-size: 18px; margin: 0 0 6px; padding-bottom: 3px; border-bottom: 2.5px solid ${ACC}; break-after: avoid; }
h2 .num { color: ${ACC}; margin-right: 8px; }
h3 { font-size: 12.5px; margin: 12px 0 4px; break-after: avoid; }
h4 { font-size: 11px; margin: 8px 0 3px; break-after: avoid; }
p { margin: 3px 0 6px; }
p.lead { font-size: 11px; color: #333; margin-bottom: 8px; }
.note, p.note { font-size: 9.5px; color: #444; }
.muted { color: #666; }
.faint { color: #bbb; }
ul { margin: 3px 0 8px; padding-left: 16px; }
li { margin: 1px 0; }
table { border-collapse: collapse; width: 100%; margin: 3px 0 8px; font-size: 10px; }
table.small { font-size: 9.2px; }
thead { display: table-header-group; }
tr { break-inside: avoid; }
th { background: #efefef; text-align: left; font-weight: 700; }
th, td { border: 0.6px solid #c4c4c4; padding: 2px 4px; vertical-align: top; }
table.center td, table.center th { text-align: center; }
table.grid td { width: 25%; text-align: center; padding: 4px; }
.keep { break-inside: avoid; }
table.chk { table-layout: fixed; }
table.chk th:first-child { width: 62px; }
table.chk th:nth-child(2) { width: 150px; }
td ul { margin: 0; padding-left: 14px; }
.two { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; align-items: start; }
.figs { display: flex; flex-wrap: wrap; gap: 6px 10px; align-items: flex-start; margin: 4px 0 6px; }
.figs.c2 > figure { width: calc(50% - 5px); }
figure { margin: 2px 0; break-inside: avoid; text-align: center; }
figure svg { max-width: 100%; height: auto; display: block; margin: 0 auto; }
.ft { font-size: 9.5px; font-weight: 700; margin-bottom: 1px; }
.fs { font-size: 8.5px; color: #555; margin-top: 0; }
.row { display: grid; grid-template-columns: 84px 1fr; gap: 6px; align-items: center; break-inside: avoid; border-top: 0.6px solid #ddd; padding-top: 3px; margin-top: 3px; }
.row .rl { font-size: 10px; font-weight: 700; text-align: right; line-height: 1.25; }
.row .rl small { display: block; font-weight: 400; color: #666; font-size: 8.5px; }
.row .figs { margin: 0; gap: 2px 6px; }
.callout { border-left: 3px solid ${ACC}; background: #fbf4f0; padding: 5px 8px; margin: 6px 0 8px; font-size: 10px; }
.check li { list-style: none; margin-left: -14px; }
.check li::before { content: "☐  "; color: ${ACC}; }
.title { height: 268mm; display: flex; flex-direction: column; justify-content: center; }
.title .kicker { font-size: 11px; letter-spacing: .25em; color: ${ACC}; font-weight: 700; }
.title h1 { font-size: 52px; margin: 6px 0 4px; line-height: 1; }
.title .sub { font-size: 15px; color: #333; max-width: 150mm; margin-bottom: 16mm; }
.title .meta { font-size: 10px; color: #555; margin-top: 12mm; max-width: 160mm; }
.toc { break-before: page; }
.toc h2 { border-bottom: 2.5px solid ${ACC}; }
.toc .tp { font-size: 10px; font-weight: 700; color: ${ACC}; letter-spacing: .12em; text-transform: uppercase; margin: 10px 0 2px; }
.toc a { display: flex; color: inherit; text-decoration: none; font-size: 11.5px; padding: 2.2px 0; }
.toc a .n { width: 24px; color: ${ACC}; font-weight: 700; }
.toc a .t { flex: none; }
.toc a .d { flex: 1; border-bottom: 1px dotted #aaa; margin: 0 6px 4px; }
.toc a .pg { width: 24px; text-align: right; font-variant-numeric: tabular-nums; }
.trigrid { display: grid; grid-template-columns: 1fr 150px; gap: 12px; align-items: start; }
.trigrid .side { font-size: 10px; color: #333; border-left: 2px solid #eee; padding-left: 8px; }
.tri { margin-bottom: 6px; }
.figs.c3 > figure { width: calc(33.3% - 7px); }
.figs.c5 { gap: 4px 6px; }
.legend { display: grid; grid-template-columns: 1fr 1fr; gap: 10px 18px; }
`;

function render(pages = {}) {
  const parts = [];
  for (const s of SECTIONS) { if (!parts.length || parts[parts.length - 1].name !== s.part) parts.push({ name: s.part, secs: [] }); parts[parts.length - 1].secs.push(s); }
  const toc = parts.map((pt) => `<div class="tp">${pt.name}</div>` + pt.secs.map((s) => `<a href="#${s.id}"><span class="n">${s.num}</span><span class="t">${esc(s.title)}</span><span class="d"></span><span class="pg">${pages[s.id] ?? ''}</span></a>`).join('')).join('');
  const hero = F.regionNotes({ root: 'C', scale: 'major', region: { frets: [0, 15] } });
  const title = `<section class="title"><div class="kicker">GUITAR CARDS · STUDY GUIDE</div><h1>Guitar Mastery</h1>
    <div class="sub">The fretboard, harmony and practice in one place: cheat sheets first, then every essential shape on the neck, then how to turn it into music.</div>
    ${neck({ notes: dots(hero, { tones: new Set(['3', '5', '7']) }), lo: 0, hi: 15, fw: 42, r: 10 })}
    <div class="meta">Every note spelling, interval label and fret position in this guide is generated by the Guitar Cards theory engine, so the diagrams are correct by construction. Examples are in C (or the most convenient key); every shape is movable — slide it so its root lands on the root you need.</div></section>`;
  const legendNeck = neck({ notes: dots(F.regionNotes({ root: 'C', scale: 'major', region: { caged: 'A' } }), { tones: new Set(['3', '5', '7']), rings: new Set(['4']) }), fw: 34 });
  const legendBox = chordBox({ notes: chordDots(inversions('C', 'maj7', 'drop2', [5, 4, 3, 2])[0].notes) });
  const howto = `<section class="sec" id="howto"><h2>How to read and use this guide</h2>
    <div class="legend"><div>${h3('Neck diagrams (scales, arpeggios, maps)')}${legendNeck}
    ${ul(['Strings run **horizontally**: high e on top, low E at the bottom — the neck as you see it when you look down at it while playing.', 'Fret numbers under the neck; inlay dots at 3, 5, 7, 9, 12, 15. A thick left edge is the nut; notes left of it are open strings.', 'Example: C major, A-shape window. Ring = the characteristic note being discussed (here the 4th, the avoid note over Cmaj7).'])}</div>
    <div>${h3('Chord boxes (voicings)')}<div style="display:flex;gap:14px;align-items:flex-start">${legendBox}<div>${ul(['Strings run **vertically**: low E on the **left**, high e on the right; frets go down the page.', 'The number at the top left is the fret of the first row (no number = nut / first position).', '× = string not played.', 'Example: Cmaj7 drop 2, root position on strings 5-4-3-2.'])}</div></div></div></div>
    ${h3('Dot colours and labels')}
    <div style="display:flex;gap:18px;align-items:center;margin:4px 0 8px"><svg width="300" height="26" viewBox="0 0 300 26">${dotSVG(12, 13, 10, '1', 'root')}<text x="28" y="17" font-size="10">root</text>${dotSVG(80, 13, 10, '3', 'tone')}<text x="96" y="17" font-size="10">guide / chord tone</text>${dotSVG(200, 13, 10, '6', 'other')}<text x="216" y="17" font-size="10">other note</text></svg>
    <svg width="160" height="30" viewBox="0 0 160 30">${dotSVG(14, 15, 10, '♯4', 'other', true)}<text x="32" y="19" font-size="10">characteristic note</text></svg></div>
    ${ul(['Every dot is labelled with its **interval from the root** (1, ♭3, 3, 5, ♭7, 9, ♯11, 13…), never with a fingering. Saying the interval as you play is the point.', '**Grey** in chord boxes = the guide tones (3rd and 7th), the notes that define the chord. **Grey** in scale diagrams = the notes of the scale\'s own 7th chord (the arpeggio hidden in the scale).', 'Roman numerals are always relative to the **major** scale of the tonic: a minor key reads i iiø ♭III iv v ♭VI ♭VII.', 'Compound tensions (9, 11, 13) name the same notes as 2, 4, 6 an octave higher; in scale diagrams the engine labels scale degrees (2, 4, 6) unless the scale is normally thought of as tensions (altered: ♭9 ♯9 ♯11 ♭13).'])}
    ${h3('How to use it')}
    ${ul(['**Part I** is for lookup: keep it open while you practise and when you analyse tunes.', '**Part II** is the hands: work through it one row at a time, in the order given, and transpose every shape to at least three other keys (then all 12) before you call it learned.', '**Part III** turns shapes into music: voice leading, improvising, rhythm and ear. Section §{practice} is the training plan and the checklist that tells you when each section is mastered.', 'Mastery means: you can find it **without looking**, **in any key**, **in time**, and **hear it** before you play it.'])}
    </section>`;
  const out = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Guitar Mastery — study guide</title><style>${CSS}</style></head><body>
${title}
<section class="toc" id="contents"><h2>Contents</h2><a href="#howto"><span class="n"></span><span class="t">How to read and use this guide</span><span class="d"></span><span class="pg">${pages.howto ?? ''}</span></a>${toc}</section>
${howto}
${SECTIONS.map((s) => s.html).join('\n')}
</body></html>`;
  return out.replace(/§\{([\w-]+)\}/g, (m, id) => { const sec = SECTIONS.find((x) => x.id === id); assert(sec, 'unknown section ref ' + id); return sec.num; });
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

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(HTML, render());
if (process.argv.includes('--html')) { console.log('Wrote', path.relative(ROOT, HTML)); process.exit(0); }
printPdf();
let { map, count } = pdfDestPages(PDF);
if (Object.keys(map).length) {
  fs.writeFileSync(HTML, render(map));
  printPdf();
  const again = pdfDestPages(PDF);
  const moved = Object.keys(map).filter((k) => again.map[k] !== map[k]);
  if (moved.length) { fs.writeFileSync(HTML, render(again.map)); printPdf(); }
  ({ map, count } = pdfDestPages(PDF));
} else console.warn('Could not read page numbers from the PDF; contents page left without numbers.');
const size = fs.statSync(PDF).size;
console.log(`Wrote ${path.relative(ROOT, HTML)} and ${path.relative(ROOT, PDF)}: ${count} pages, ${(size / 1024 / 1024).toFixed(2)} MB`);
for (const s of SECTIONS) console.log(`  ${String(s.num).padStart(2)}  p.${String(map[s.id] ?? '?').padStart(3)}  ${s.title}`);
