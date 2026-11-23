// Simple: one screen. The neck, a chord menu and an exercise menu, a key, then step through the shapes by hand or
// let it run on a click, with or without the chord sounding. The exercises are the ones a teacher sets for that chord
// (close and spread triads up a string set, drop 2 and drop 3, area by area, shells, the five CAGED forms, arpeggios).
// Every shape is computed by the engine; the faint dots are the chord's other notes all over the neck.
import * as T from '../theory.js';
import * as F from '../fretboard.js';
import * as A from '../audio.js';
import * as G from '../caged/grips.js';
import { spellRoot, typeName, esc } from '../fundamentals/core.js';

// ---------- chords and exercises ----------
const CHORDS = [
  ['Core', [['maj', 'Major triad'], ['min', 'Minor triad'], ['maj7', 'Major 7th'], ['7', 'Dominant 7th'], ['m7', 'Minor 7th'], ['m7b5', 'Half-diminished (m7♭5)']]],
  ['More', [['dim', 'Diminished triad'], ['aug', 'Augmented triad'], ['sus4', 'Sus4 triad'], ['sus2', 'Sus2 triad'], ['dim7', 'Diminished 7th (°7)'], ['6', 'Major 6th'], ['m6', 'Minor 6th'], ['mMaj7', 'Minor-major 7th'], ['7sus4', '7sus4'], ['maj7#5', 'Major 7♯5'], ['7#5', 'Dominant 7♯5'], ['7b5', 'Dominant 7♭5']]],
];
const QNAME = Object.fromEntries(CHORDS.flatMap((g) => g[1]));
const isTriad = (q) => T.getChord(q).ivs.length === 3;
const SET = (s) => s.split('').map(Number);
const EX_TRIAD = [
  ['Close triads, up one string set', [['close:321', 'Close triads on 3‑2‑1'], ['close:432', 'Close triads on 4‑3‑2'], ['close:543', 'Close triads on 5‑4‑3'], ['close:654', 'Close triads on 6‑5‑4']]],
  ['Spread triads, up one string set', [['spread:643', 'Spread triads on 6‑4‑3'], ['spread:532', 'Spread triads on 5‑3‑2'], ['spread:421', 'Spread triads on 4‑2‑1']]],
  ['Across the neck', [['all', 'All shapes, area by area'], ['area:close', 'Close triads, area by area'], ['area:spread', 'Spread triads, area by area'], ['caged', 'The five CAGED forms'], ['arp', 'Arpeggio, area by area']]],
];
const EX_SEV = [
  ['Drop 2, up one string set', [['drop2:4321', 'Drop 2 on 4‑3‑2‑1'], ['drop2:5432', 'Drop 2 on 5‑4‑3‑2'], ['drop2:6543', 'Drop 2 on 6‑5‑4‑3']]],
  ['Drop 3, up one string set', [['drop3:6432', 'Drop 3 on 6‑4‑3‑2'], ['drop3:5321', 'Drop 3 on 5‑3‑2‑1']]],
  ['Drop 2 & 4, up one string set', [['drop24:6532', 'Drop 2 & 4 on 6‑5‑3‑2'], ['drop24:5421', 'Drop 2 & 4 on 5‑4‑2‑1']]],
  ['Across the neck', [['all', 'All shapes, area by area'], ['area:drop2', 'Drop 2, area by area'], ['area:drop3', 'Drop 3, area by area'], ['area:drop24', 'Drop 2 & 4, area by area'], ['shell', 'Shells (root on the 6th and 5th)'], ['caged', 'The five CAGED forms'], ['arp', 'Arpeggio, area by area']]],
];
// Drop 2 with extensions: the substitutions players actually make inside a four-note shape (9 for the root, 13 for
// the 5th, 11 on a minor chord), each spelled out so the colour tone shows in violet
const EXT = {
  maj7: [['maj9', ['3', '5', '7', '9'], '9 for the root'], ['maj13', ['3', '7', '9', '13'], '9 for the root, 13 for the 5th']],
  '7': [['9', ['3', '5', 'b7', '9'], '9 for the root'], ['13', ['1', '3', 'b7', '13'], '13 for the 5th'], ['13', ['3', 'b7', '9', '13'], '9 and 13, rootless']],
  m7: [['m9', ['b3', '5', 'b7', '9'], '9 for the root'], ['m11', ['b3', 'b7', '9', '11'], '9 and 11, rootless']],
  m7b5: [['m7b5', ['b3', 'b5', 'b7', '9'], '9 for the root (ø9)']],
};
// shells with one colour tone on top: the four-note comping grips (root on the 6th, then on the 5th)
const SHELLX = {
  maj7: [[[6, 4, 3, 2], ['1', '7', '3', '13'], 'maj13', '1-7-3-13'], [[5, 4, 3, 2], ['1', '3', '7', '9'], 'maj9', '1-3-7-9']],
  '7': [[[6, 4, 3, 2], ['1', 'b7', '3', '13'], '13', '1-♭7-3-13'], [[5, 4, 3, 2], ['1', '3', 'b7', '9'], '9', '1-3-♭7-9']],
  m7: [[[6, 4, 3, 2], ['1', 'b7', 'b3', '11'], 'm11', '1-♭7-♭3-11'], [[5, 4, 3, 2], ['1', 'b3', 'b7', '9'], 'm9', '1-♭3-♭7-9']],
  m7b5: [[[6, 4, 3, 2], ['1', 'b7', 'b3', 'b5'], 'm7b5', '1-♭7-♭3-♭5'], [[5, 4, 3, 2], ['1', 'b3', 'b7', '9'], 'm7b5', '1-♭3-♭7-9 (ø9)']],
};
function exercisesFor(q) {
  if (isTriad(q)) return EX_TRIAD;
  const out = EX_SEV.map(([g, list]) => [g, [...list]]);
  if (EXT[q]) out.splice(3, 0, ['Drop 2 with extensions', EXT[q].flatMap(([, , label], k) => ['4321', '5432'].map((ss) => [`ext:${k}:${ss}`, `${label[0].toUpperCase() + label.slice(1)} · ${ss.split('').join('‑')}`]))]);
  if (SHELLX[q]) out[out.length - 1][1].splice(3, 0, ['shellx', 'Shells plus a colour tone']);
  return out;
}
const KEYS = [['cycle', 'Cycle of 4ths'], ...['C', 'F', 'B♭', 'E♭', 'A♭', 'D♭', 'F♯', 'B', 'E', 'A', 'D', 'G'].map((k, i) => [String([0, 5, 10, 3, 8, 1, 6, 11, 4, 9, 2, 7][i]), k])];
const FOURTHS = [0, 5, 10, 3, 8, 1, 6, 11, 4, 9, 2, 7];
const KEYNAME = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
const SHAPES = ['C', 'A', 'G', 'E', 'D'];
const INV = ['Root position', '1st inversion', '2nd inversion', '3rd inversion'];
const BASS = { '1': 'root', '3': '3rd', b3: '♭3', '5': '5th', b5: '♭5', '#5': '♯5', '7': '7th', b7: '♭7', bb7: '𝄫7', '6': '6th', '4': '4th', '2': '2nd' };
const MAXF = 15;

// ---------- state ----------
const KEY = 'simple.v1';
let S;
try { S = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { S = {}; }
S = Object.assign({ q: 'maj7', ex: 'drop2:4321', key: '0', mode: 'manual', sound: true, click: false, bpm: 60, beats: 4, labels: 'deg', drone: false }, S);
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* */ } };
let cyclePc = 0, steps = [], at = 0, timer = null;
const keyPc = () => (S.key === 'cycle' ? cyclePc : Number(S.key));
const root = () => spellRoot(keyPc(), S.q);

// ---------- the steps of an exercise: each one a shape on the neck with its caption ----------
const avg = (p) => p.notes.reduce((s, n) => s + n.fret, 0) / p.notes.length;
function build() {
  const r = root(), q = S.q;
  const ex = S.ex;
  const out = [];
  const inv = (x) => { const hasRoot = x.notes.some((n) => n.iv === '1'); return hasRoot ? `${INV[x.inversion] || ''} · ${BASS[x.bassIv] || T.prettyIv(x.bassIv)} in the bass` : `${T.prettyIv(x.bassIv)} in the bass`; };
  const [kind, arg] = ex.split(':');
  if (['close', 'spread', 'drop2', 'drop3', 'drop24'].includes(kind)) {
    const ss = SET(arg);
    const up = F.chordVoicings({ root: r, quality: q, voicing: kind, stringSet: ss, inversion: 'all' }).filter((x) => x.maxFret <= MAXF).sort((a, b) => a.minFret - b.minFret || a.inversion - b.inversion);
    const seq = up.concat(up.slice(0, -1).reverse());
    seq.forEach((x, i) => out.push({ notes: x.notes, text: `${inv(x)} · strings ${ss.join('‑')}${i >= up.length ? ' · back down' : ''}` }));
  } else if (kind === 'area') {
    const sets = { close: ['321', '432', '543', '654'], spread: ['643', '532', '421'], drop2: ['4321', '5432', '6543'], drop3: ['6432', '5321'], drop24: ['6532', '5421'] }[arg].map(SET);
    for (const w of windows(r)) {
      const inArea = [];
      for (const ss of sets) for (const x of F.chordVoicings({ root: r, quality: q, voicing: arg, stringSet: ss, inversion: 'all' })) if (x.minFret >= Math.max(0, w.lo - 1) && x.maxFret <= w.hi + 1 && x.maxFret <= MAXF) inArea.push({ ...x, ss });
      inArea.sort((a, b) => b.ss[0] - a.ss[0] || a.minFret - b.minFret).forEach((x) => out.push({ notes: x.notes, text: `${w.shape}-shape area · ${inv(x)} · strings ${x.ss.join('‑')}`, win: w }));
    }
  } else if (kind === 'shell') {
    for (const [ss, name] of [[[6, 4, 3], 'root on the 6th · 1-7-3'], [[6, 5, 4], 'root on the 6th · 1-3-7'], [[5, 3, 2], 'root on the 5th · 1-7-3'], [[5, 4, 3], 'root on the 5th · 1-3-7']]) {
      const v = F.chordVoicings({ root: r, quality: q, voicing: 'shell', stringSet: ss }).filter((x) => x.notes[0].iv === '1' && x.maxFret <= MAXF).sort((a, b) => a.minFret - b.minFret);
      if (v[0]) out.push({ notes: v[0].notes, text: `Shell · ${name}` });
    }
  } else if (kind === 'ext') {
    // drop 2 with a colour tone in place of a chord tone, up the set and back
    const [, k, set] = ex.split(':');
    const [qx, tones, label] = EXT[q][Number(k)];
    const ss = SET(set);
    const name = T.pretty(T.chordSymbol(r, qx)) + (tones.includes('1') ? '' : ' (no root)');
    const up = F.chordVoicings({ root: r, quality: qx, tones, voicing: 'drop2', stringSet: ss, inversion: 'all' }).filter((x) => x.maxFret <= MAXF).sort((a, b) => a.minFret - b.minFret || a.inversion - b.inversion);
    const seq = up.concat(up.slice(0, -1).reverse());
    seq.forEach((x, i) => out.push({ notes: x.notes, text: `${name} · ${label} · ${inv(x)} · strings ${ss.join('‑')}${i >= up.length ? ' · back down' : ''}` }));
  } else if (kind === 'shellx') {
    // each grip low on the neck, then an octave up where it fits
    for (const [ss, order, qx, shape] of SHELLX[q]) {
      const v = F.chordVoicings({ root: r, quality: qx, voicing: 'custom', order, stringSet: ss }).filter((x) => x.maxFret <= MAXF).sort((a, b) => a.minFret - b.minFret);
      v.slice(0, 2).forEach((x) => out.push({ notes: x.notes, text: `${T.pretty(T.chordSymbol(r, qx))} · ${shape} · root on the ${ss[0] === 6 ? '6th' : '5th'} · frets ${x.minFret}–${x.maxFret}` }));
    }
  } else if (kind === 'all') {
    // every shape of the chord that lives in each area, area by area up the neck: the CAGED grip first, then the
    // voicing families, each shape once
    const fams = isTriad(q)
      ? [['close', 'Close triad', ['321', '432', '543', '654']], ['spread', 'Spread triad', ['643', '532', '421']]]
      : [['drop2', 'Drop 2', ['4321', '5432', '6543']], ['drop3', 'Drop 3', ['6432', '5321']], ['drop24', 'Drop 2 & 4', ['6532', '5421']], ['shell', 'Shell', ['643', '654', '532', '543']]];
    for (const w of windows(r)) {
      const inside = (x) => x.minFret >= Math.max(0, w.lo - 1) && x.maxFret <= w.hi + 1 && x.maxFret <= MAXF;
      const seen = new Set();
      const add = (notes, text) => { const k = notes.map((n) => n.string + ':' + n.fret).sort().join(','); if (seen.has(k)) return; seen.add(k); out.push({ notes, text: `${w.shape}-shape area · ${text}`, win: w }); };
      const grip = G.placements(r, q, w.shape).find((p) => p.lo >= Math.max(0, w.lo - 1) && p.hi <= w.hi + 1);
      if (grip) add(grip.notes, `${w.shape} form (CAGED grip)`);
      for (const [v, name, sets] of fams) {
        const list = [];
        for (const ss of sets.map(SET)) for (const x of F.chordVoicings({ root: r, quality: q, voicing: v, stringSet: ss, inversion: 'all' })) if (inside(x) && (v !== 'shell' || x.notes[0].iv === '1')) list.push({ ...x, ss });
        list.sort((a, b) => b.ss[0] - a.ss[0] || a.minFret - b.minFret).forEach((x) => add(x.notes, `${name} · ${v === 'shell' ? x.label.replace(/b/g, '♭') : inv(x)} · strings ${x.ss.join('‑')}`));
      }
      for (const [ss, order, qx, shape] of SHELLX[q] || []) {
        for (const x of F.chordVoicings({ root: r, quality: qx, voicing: 'custom', order, stringSet: ss })) if (inside(x)) add(x.notes, `Shell plus a colour · ${T.pretty(T.chordSymbol(r, qx))} · ${shape}`);
      }
    }
  } else if (kind === 'caged') {
    const all = [];
    for (const sh of SHAPES) for (const p of G.placements(r, q, sh)) if (p.hi <= MAXF) all.push({ ...p, sh });
    all.sort((a, b) => a.lo - b.lo || a.center - b.center);
    // up the neck in order: C, A, G, E, D, then the first form again an octave up
    let last = null;
    for (const p of all) { if (p.sh === last) continue; last = p.sh; out.push({ notes: p.notes, text: `${p.sh} form · frets ${p.lo}–${p.hi}` }); if (out.length >= 6) break; }
  } else if (kind === 'arp') {
    for (const w of windows(r)) {
      const notes = F.regionNotes({ root: r, quality: q, region: { caged: w.shape } }).filter((n) => n.fret <= MAXF);
      out.push({ notes, text: `Arpeggio · ${w.shape}-shape area · frets ${w.lo}–${w.hi}`, arp: true, win: w });
    }
  }
  return out;
}
// the five CAGED areas of a key, in order up the neck
function windows(r) {
  return SHAPES.map((shape) => ({ shape, ...F.cagedWindow(r, shape) })).filter((w) => w.hi <= MAXF + 1).sort((a, b) => a.lo - b.lo);
}

// ---------- the neck ----------
// real fret spacing (each fret 1/17.817 shorter), rosewood, pearl dots, a bone nut; low E at the bottom, like tab
const NF = MAXF;
const fx = (f) => 1 - Math.pow(2, -f / 12);
function neckSVG(step) {
  const W = 1000, H = 190, padL = 34, padR = 14, top = 22, bot = 26;
  const scale = (W - padL - padR) / fx(NF + 0.6);
  const X = (f) => padL + fx(f) * scale;
  const mid = (f) => (f === 0 ? padL - 15 : (X(f - 1) + X(f)) / 2);
  const sy = (s) => top + ((s - 1) * (H - top - bot)) / 5; // string 1 (high e) at the top
  const r = root();
  let svg = `<svg class="neck" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMinYMid meet" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="wood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a2417"/><stop offset=".5" stop-color="#4a2e1c"/><stop offset="1" stop-color="#2f1d12"/></linearGradient>
      <linearGradient id="fret" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#9a9a9a"/><stop offset=".5" stop-color="#eeeeee"/><stop offset="1" stop-color="#8a8a8a"/></linearGradient>
      <radialGradient id="pearl"><stop offset="0" stop-color="#fbf7ee"/><stop offset="1" stop-color="#cfc6b4"/></radialGradient>
    </defs>
    <rect x="${padL}" y="${top - 12}" width="${X(NF + 0.6) - padL}" height="${H - top - bot + 24}" rx="4" fill="url(#wood)"/>`;
  // the area being worked on
  if (step && step.win) svg += `<rect x="${X(Math.max(0, step.win.lo - 1))}" y="${top - 12}" width="${X(step.win.hi) - X(Math.max(0, step.win.lo - 1))}" height="${H - top - bot + 24}" fill="rgba(255,181,71,0.10)"/>`;
  for (const f of [3, 5, 7, 9, 15]) if (f <= NF) svg += `<circle cx="${mid(f)}" cy="${(sy(3) + sy(4)) / 2}" r="6" fill="url(#pearl)" opacity=".85"/>`;
  if (NF >= 12) svg += `<circle cx="${mid(12)}" cy="${(sy(2) + sy(3)) / 2}" r="6" fill="url(#pearl)" opacity=".85"/><circle cx="${mid(12)}" cy="${(sy(4) + sy(5)) / 2}" r="6" fill="url(#pearl)" opacity=".85"/>`;
  svg += `<rect x="${padL - 6}" y="${top - 12}" width="7" height="${H - top - bot + 24}" fill="#efe6d2"/>`;
  for (let f = 1; f <= NF; f++) svg += `<rect x="${X(f) - 1.6}" y="${top - 12}" width="3.2" height="${H - top - bot + 24}" fill="url(#fret)"/>`;
  for (let f = 1; f <= NF; f++) if ([3, 5, 7, 9, 12, 15].includes(f)) svg += `<text class="fn" x="${mid(f)}" y="${H - 6}" text-anchor="middle">${f}</text>`;
  for (let s = 1; s <= 6; s++) svg += `<line x1="${padL - 30}" y1="${sy(s)}" x2="${X(NF + 0.6)}" y2="${sy(s)}" stroke="${s <= 3 ? '#e9e6df' : '#d9b77a'}" stroke-width="${0.9 + (s - 1) * 0.45}" opacity=".9"/>`;
  // the chord's other notes, faint, everywhere
  const all = F.regionNotes({ root: r, quality: S.q, region: { frets: [0, NF] } });
  const lit = new Set((step?.notes || []).map((n) => n.string + ':' + n.fret));
  for (const n of all) if (!lit.has(n.string + ':' + n.fret)) svg += `<circle cx="${mid(n.fret)}" cy="${sy(n.string)}" r="5" class="ghost ${role(n.iv)}"/>`;
  // the shape
  const bass = step && !step.arp ? Math.max(...step.notes.map((n) => n.string)) : null;
  for (const n of step?.notes || []) {
    const lab = S.labels === 'deg' ? T.prettyIv(n.iv) : T.noteName(n.note, true);
    svg += `<g class="dot ${role(n.iv)}"><circle cx="${mid(n.fret)}" cy="${sy(n.string)}" r="12.5"/>${n.string === bass ? `<circle class="ring" cx="${mid(n.fret)}" cy="${sy(n.string)}" r="16"/>` : ''}<text x="${mid(n.fret)}" y="${sy(n.string) + 4.3}" text-anchor="middle">${esc(lab)}</text></g>`;
  }
  return svg + '</svg>';
}
// the same neck upright, for a phone held upright: the nut at the top, low E on the left (as in a chord diagram),
// all 15 frets in view, fret numbers down the right
function neckV(step) {
  const W = 220, H = 860, padL = 16, padR = 30, padT = 34, padB = 8;
  const scale = (H - padT - padB) / fx(NF + 0.6);
  const Y = (f) => padT + fx(f) * scale;
  const mid = (f) => (f === 0 ? padT - 17 : (Y(f - 1) + Y(f)) / 2);
  const sx = (s) => padL + 14 + ((6 - s) * (W - padL - padR - 28)) / 5;
  const x0 = sx(6) - 15, x1 = sx(1) + 15;
  const r = root();
  let svg = `<svg class="neck v" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMin meet" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="woodv" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2f1d12"/><stop offset=".5" stop-color="#4a2e1c"/><stop offset="1" stop-color="#2f1d12"/></linearGradient>
      <linearGradient id="fretv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8a8a8a"/><stop offset=".5" stop-color="#eeeeee"/><stop offset="1" stop-color="#8a8a8a"/></linearGradient>
      <radialGradient id="pearlv"><stop offset="0" stop-color="#fbf7ee"/><stop offset="1" stop-color="#cfc6b4"/></radialGradient>
    </defs>
    <rect x="${x0}" y="${padT}" width="${x1 - x0}" height="${Y(NF + 0.6) - padT}" rx="4" fill="url(#woodv)"/>`;
  if (step && step.win) svg += `<rect x="${x0}" y="${Y(Math.max(0, step.win.lo - 1))}" width="${x1 - x0}" height="${Y(step.win.hi) - Y(Math.max(0, step.win.lo - 1))}" fill="rgba(255,181,71,0.12)"/>`;
  const cx = (sx(3) + sx(4)) / 2;
  for (const f of [3, 5, 7, 9, 15]) if (f <= NF) svg += `<circle cx="${cx}" cy="${mid(f)}" r="6" fill="url(#pearlv)" opacity=".85"/>`;
  svg += `<circle cx="${(sx(2) + sx(3)) / 2}" cy="${mid(12)}" r="6" fill="url(#pearlv)" opacity=".85"/><circle cx="${(sx(4) + sx(5)) / 2}" cy="${mid(12)}" r="6" fill="url(#pearlv)" opacity=".85"/>`;
  svg += `<rect x="${x0}" y="${padT - 5}" width="${x1 - x0}" height="7" fill="#efe6d2"/>`;
  for (let f = 1; f <= NF; f++) svg += `<rect x="${x0}" y="${Y(f) - 1.6}" width="${x1 - x0}" height="3.2" fill="url(#fretv)"/>`;
  for (let f = 1; f <= NF; f++) if ([3, 5, 7, 9, 12, 15].includes(f)) svg += `<text class="fn" x="${W - 3}" y="${mid(f) + 4}" text-anchor="end">${f}</text>`;
  for (let s = 1; s <= 6; s++) svg += `<line x1="${sx(s)}" y1="${padT - 30}" x2="${sx(s)}" y2="${Y(NF + 0.6)}" stroke="${s <= 3 ? '#e9e6df' : '#d9b77a'}" stroke-width="${0.9 + (s - 1) * 0.45}" opacity=".9"/>`;
  const all = F.regionNotes({ root: r, quality: S.q, region: { frets: [0, NF] } });
  const lit = new Set((step?.notes || []).map((n) => n.string + ':' + n.fret));
  for (const n of all) if (!lit.has(n.string + ':' + n.fret)) svg += `<circle cx="${sx(n.string)}" cy="${mid(n.fret)}" r="5" class="ghost ${role(n.iv)}"/>`;
  const bass = step && !step.arp ? Math.max(...step.notes.map((n) => n.string)) : null;
  for (const n of step?.notes || []) {
    const lab = S.labels === 'deg' ? T.prettyIv(n.iv) : T.noteName(n.note, true);
    svg += `<g class="dot ${role(n.iv)}"><circle cx="${sx(n.string)}" cy="${mid(n.fret)}" r="13"/>${n.string === bass ? `<circle class="ring" cx="${sx(n.string)}" cy="${mid(n.fret)}" r="16.5"/>` : ''}<text x="${sx(n.string)}" y="${mid(n.fret) + 4.3}" text-anchor="middle">${esc(lab)}</text></g>`;
  }
  return svg + '</svg>';
}
// upright on a phone held upright; across in landscape and on wide screens
const upright = () => window.innerHeight > window.innerWidth && window.innerWidth < 700;
function role(iv) {
  if (['9', 'b9', '#9', '11', '#11', '13', 'b13'].includes(iv)) return 'x'; // a colour tone, always violet
  const s = F.simpleIv(iv);
  if (s === '1') return 'r';
  if (['3', 'b3'].includes(s)) return 't';
  if (['5', 'b5', '#5'].includes(s)) return 'f';
  if (['7', 'b7', 'bb7', '6'].includes(s)) return 's';
  return 'x';
}

// ---------- the screen ----------
const $app = document.getElementById('simple');
function render() {
  const step = steps[at];
  const r = root();
  const symb = T.pretty(T.chordSymbol(r, S.q));
  const exs = exercisesFor(S.q);
  const opt = (v, l, cur) => `<option value="${esc(v)}" ${String(cur) === String(v) ? 'selected' : ''}>${esc(l)}</option>`;
  const prevScroll = document.getElementById('neckbox')?.scrollLeft || 0;
  const v = upright();
  $app.className = v ? 'v' : 'h';
  $app.innerHTML = `
    <header><h1>Simple</h1><span class="key">${esc(symb)}${typeName(S.q) ? ` <i>${typeName(S.q)}</i>` : ''}</span></header>
    <div class="neckbox" id="neckbox">${v ? neckV(step) : neckSVG(step)}</div>
    <div class="panel">
    <div class="cap"><b>${step ? esc(step.text) : 'No shapes for this one'}</b><span>${steps.length ? `${at + 1} / ${steps.length}` : ''}</span></div>
    <div class="menus">
      <label><span>Chord</span><select id="q">${CHORDS.map(([g, list]) => `<optgroup label="${g}">${list.map(([v, l]) => opt(v, l, S.q)).join('')}</optgroup>`).join('')}</select></label>
      <label><span>Exercise</span><select id="ex">${exs.map(([g, list]) => `<optgroup label="${esc(g)}">${list.map(([v, l]) => opt(v, l, S.ex)).join('')}</optgroup>`).join('')}</select></label>
      <label class="small"><span>Key</span><select id="key">${KEYS.map(([v, l]) => opt(v, l, S.key)).join('')}</select></label>
    </div>
    <div class="seg"><button data-mode="manual" class="${S.mode === 'manual' ? 'on' : ''}">Manual</button><button data-mode="auto" class="${S.mode === 'auto' ? 'on' : ''}">Auto</button></div>
    ${S.mode === 'manual'
      ? `<div class="row big"><button id="prev">◀</button><button id="next">▶</button></div>`
      : `<div class="row big"><button id="run" class="${timer ? 'on' : ''}">${timer ? '■ Stop' : '▶ Start'}</button></div>`}
    ${S.mode === 'auto' || S.click ? `<div class="row"><button class="sq" id="down">−</button><span class="bpm">${S.bpm} bpm</span><button class="sq" id="up">+</button></div>` : ''}
    ${S.mode === 'auto' ? `<div class="row"><button id="beats" class="wide">A shape every ${S.beats} beats</button></div>` : ''}
    <div class="row toggles">
      <button id="sound" class="${S.sound ? 'on' : ''}" aria-pressed="${S.sound}">${S.sound ? '♪ Sound' : 'Sound off'}</button>
      <button id="click" class="${S.click ? 'on' : ''}" aria-pressed="${S.click}">Click</button>
      <button id="drone" class="${S.drone ? 'on' : ''}" aria-pressed="${S.drone}">Drone ${esc(T.noteName(T.parseNote(KEYNAME[keyPc()]), true))}</button>
      <button id="labels">${S.labels === 'deg' ? 'Degrees' : 'Notes'}</button>
    </div>
    </div>`;
  document.getElementById('neckbox').scrollLeft = prevScroll; // glide from where it was, not from the nut
  bind();
  follow();
}
// keep the lit shape in view on a narrow screen
function follow() {
  const box = document.getElementById('neckbox'), step = steps[at];
  if (!box || !step || upright() || box.scrollWidth <= box.clientWidth) return;
  const svg = box.querySelector('svg');
  const k = svg.getBoundingClientRect().width / 1000;
  const fs = step.notes.map((n) => n.fret);
  const lo = Math.min(...fs), hi = Math.max(...fs);
  const center = ((34 + fx((lo + hi) / 2) * ((1000 - 48) / fx(NF + 0.6)))) * k;
  glide(box, Math.max(0, Math.min(box.scrollWidth - box.clientWidth, center - box.clientWidth / 2)));
}
// an eased scroll of our own (native smooth scrolling isn't reliable everywhere)
let glideId = 0;
function glide(box, to) {
  const from = box.scrollLeft, d = to - from, t0 = performance.now(), id = ++glideId;
  if (Math.abs(d) < 2) return;
  const step = (t) => {
    if (id !== glideId) return;
    const k = Math.min(1, (t - t0) / 320), e = 1 - Math.pow(1 - k, 3);
    const el = document.getElementById('neckbox');
    if (!el) return;
    el.scrollLeft = from + d * e;
    if (k < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
function bind() {
  const $ = (id) => $app.querySelector('#' + id);
  $('q').onchange = (e) => { S.q = e.target.value; const exs = exercisesFor(S.q).flatMap((g) => g[1].map((x) => x[0])); if (!exs.includes(S.ex)) S.ex = exs[0]; restart(); };
  $('ex').onchange = (e) => { S.ex = e.target.value; restart(); };
  $('key').onchange = (e) => { S.key = e.target.value; restart(); };
  $app.querySelectorAll('[data-mode]').forEach((b) => (b.onclick = () => { S.mode = b.dataset.mode; stop(); stopPulse(); save(); syncPulse(); render(); }));
  if (S.mode === 'manual') {
    $('prev').onclick = () => go(-1);
    $('next').onclick = () => go(1);
  } else {
    $('run').onclick = () => { if (timer) { stop(); render(); } else run(); };
    $('beats').onclick = () => { S.beats = S.beats === 4 ? 2 : 4; save(); if (timer) { stop(); run(); } else render(); };
  }
  if ($('down')) {
    $('down').onclick = () => { S.bpm = Math.max(30, S.bpm - 4); save(); retime(); render(); };
    $('up').onclick = () => { S.bpm = Math.min(200, S.bpm + 4); save(); retime(); render(); };
  }
  // Click: in Auto it's the click the shapes change on; in Manual a plain metronome to step through over
  $('click').onclick = () => { A.unlockAudio(); S.click = !S.click; save(); if (timer) { stop(); run(); } else { syncPulse(); render(); } };
  $('drone').onclick = () => { A.unlockAudio(); S.drone = !S.drone; save(); syncDrone(); render(); };
  $('sound').onclick = () => { S.sound = !S.sound; if (S.sound) A.unlockAudio(); save(); render(); };
  $('labels').onclick = () => { S.labels = S.labels === 'deg' ? 'note' : 'deg'; save(); render(); };
  // swipe the neck to step through
  const box = $('neckbox');
  let x0 = null;
  box.ontouchstart = (e) => { x0 = e.touches[0].clientX; };
  box.ontouchend = (e) => { if (x0 == null || S.mode !== 'manual') return; const dx = e.changedTouches[0].clientX - x0; x0 = null; if (Math.abs(dx) > 60 && (upright() || box.scrollWidth <= box.clientWidth)) go(dx < 0 ? 1 : -1); };
  box.onclick = () => { if (steps[at]) sound(steps[at], true); };
}

// ---------- moving through ----------
function restart() { stop(); steps = build(); at = 0; save(); syncDrone(); render(); }
function go(d, fromAuto = false) {
  if (!steps.length) return;
  at += d;
  if (at >= steps.length) {
    // the cycle of 4ths moves on a key when an exercise is done
    if (S.key === 'cycle') { cyclePc = FOURTHS[(FOURTHS.indexOf(cyclePc) + 1) % 12]; steps = build(); syncDrone(); }
    at = 0;
  }
  if (at < 0) at = steps.length - 1;
  render();
  if (S.sound || fromAuto) sound(steps[at], S.sound);
}
function sound(step, on) {
  if (!on || !step) return;
  A.unlockAudio();
  const c = A.audioCtx(), t = c.currentTime + 0.03;
  const midis = [...step.notes].sort((a, b) => a.midi - b.midi).map((n) => n.midi);
  if (step.arp) {
    const seq = midis.concat(midis.slice(0, -1).reverse());
    const gap = Math.min(0.22, (60 / S.bpm) * S.beats / Math.max(1, seq.length));
    seq.forEach((m, i) => A.pluck(m, t + i * gap, { vel: 0.7, dur: 0.45 }));
  } else A.strum(midis, t, { spread: 0.03 });
}
// auto: the shared Web Audio metronome keeps time; the next shape comes on beat 1 of each bar (silent when Click is off)
function run() {
  A.unlockAudio();
  stopPulse(); // Auto's own click takes over from Manual's
  let first = true;
  timer = A.startMetronome({
    bpm: S.bpm, meter: `${S.beats}/4`, gap: S.click ? null : { play: 0, mute: 1 },
    onBeat: ({ beat }) => { if (beat !== 0) return; if (first) { first = false; sound(steps[at], S.sound); } else go(1, true); },
  });
  render();
}
function retime() { if (timer || pulse) A.setMetronomeBpm(S.bpm); }
function stop() { if (timer) { A.stopMetronome(); timer = null; } }
// manual mode's own metronome, when Click is on
let pulse = null;
function syncPulse() {
  if (S.mode === 'manual' && S.click) { if (!pulse) { A.unlockAudio(); pulse = A.startMetronome({ bpm: S.bpm, meter: '4/4' }); } }
  else stopPulse();
}
function stopPulse() { if (pulse) { A.stopMetronome(); pulse = null; } }
// the drone: the key's root, low (E2 to D♯3), following the key
let droneAt = null;
function syncDrone() {
  if (!S.drone) { if (droneAt != null) { A.stopDrone(); droneAt = null; } return; }
  const midi = 40 + ((keyPc() - 4 + 12) % 12);
  if (droneAt !== midi) { A.startDrone(midi, false); droneAt = midi; }
}

steps = build();
render();
let lastV = upright();
window.addEventListener('resize', () => { if (upright() !== lastV) { lastV = upright(); render(); } });
// sound can only start from a tap (iOS): Click and Drone left on pick up again on the first tap
document.addEventListener('pointerdown', () => {
  if (S.drone && droneAt == null) syncDrone();
  if (S.mode === 'manual' && S.click && !pulse) syncPulse();
}, true);
// leaving the app silences everything; Click and Drone stay switched on and come back with a tap
document.addEventListener('visibilitychange', () => { if (document.hidden) { stop(); stopPulse(); if (droneAt != null) { A.stopDrone(); droneAt = null; } render(); } });
if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
