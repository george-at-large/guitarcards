// Ladder: a practice room built on the ultimate ladder (the seven modes over one root, brightest to darkest, with a
// detour from each rung to a related mode). Pick a mode (or none), a chord of it, and where on the neck, then one of
// the practices: bounce through the chord's inversions; the next voicing shown a beat early; a deep dive into one
// chord; the extended arpeggio of every mode; the full ladder (scale, arpeggio, chords); or voice leading down it.
// A metronome keeps time, each step lasts a set number of beats, and ghost notes can show the mode or its extended
// arpeggio around the voicing. Every mode says where it comes from: its parent scale and degree.
import * as T from '../theory.js';
import * as A from '../audio.js';
import * as V from '../caged/voice.js';
import * as F from '../fretboard.js';
import * as SC from '../caged/scales.js';
import * as Gr from '../caged/grips.js';
import * as E from './engine.js';
import { ULT_WALK, ULT_INFO } from '../caged/fsladder.js';
import { TRIAD, SEVENTH, CHORD, MODE_CHORDS, route } from '../caged/cladder.js';
import { fingerable, KIND } from './harm.js';
import { degText, degWord, romanWords } from './words.js';
import { nameOf } from './harm.js';
import { neckSVG } from './neck.js';
import { perc } from './rhythm.js';

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const fmt = (s) => esc(T.pretty(String(s ?? '')));
const KEYS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
const OPEN = [40, 45, 50, 55, 59, 64]; // strings 6 → 1
const openOf = (s) => OPEN[6 - s];
const semi = (iv) => T.intervalSemis(F.simpleIv(String(iv))) % 12;
const SHAPES = ['C', 'A', 'G', 'E', 'D'];
export const BY = Object.fromEntries(SC.SCALES.map((s) => [s.id, s]));
export const modeName = (m) => (BY[m] ? BY[m].name.replace(/\s*\(.*\)/, '').replace(/^./, (c) => c.toUpperCase()) : '');
const cap = (s) => (s ? s[0].toUpperCase() + s.slice(1) : s);

// ---------- the ladder: rungs and their detours ----------
export const RUNGS = (() => {
  const out = [];
  for (const [m, k] of ULT_WALK) {
    if (typeof k === 'number') out.push({ mode: m, n: k, detours: [] });
    else if (k === 'detour' && !out[out.length - 1].detours.includes(m)) out[out.length - 1].detours.push(m);
  }
  return out;
})();
const RUNG_OF = Object.fromEntries(RUNGS.flatMap((r) => [[r.mode, r], ...r.detours.map((d) => [d, r])]));
const LADDER_MODES = RUNGS.flatMap((r) => [r.mode, ...r.detours]);

// ---------- where each mode comes from: its parent scale and degree ----------
const MAJ_NAMES = ['C', 'D♭', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'A♭', 'A', 'B♭', 'B'];
const MIN_NAMES = ['C', 'C♯', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'B♭', 'B'];
const SYS = {
  maj: { name: 'major', say: 'the major scale', ivs: [0, 2, 4, 5, 7, 9, 11], names: MAJ_NAMES },
  mm: { name: 'melodic minor', say: 'melodic minor', ivs: [0, 2, 3, 5, 7, 9, 11], names: MAJ_NAMES },
  hm: { name: 'harmonic minor', say: 'harmonic minor', ivs: [0, 2, 3, 5, 7, 8, 11], names: MIN_NAMES },
};
const PARENT = { ionian: ['maj', 1], dorian: ['maj', 2], phrygian: ['maj', 3], lydian: ['maj', 4], mixolydian: ['maj', 5], aeolian: ['maj', 6], locrian: ['maj', 7],
  'mel-min': ['mm', 1], 'dorian-b2': ['mm', 2], 'lyd-aug': ['mm', 3], 'lyd-dom': ['mm', 4], 'mixo-b6': ['mm', 5], 'locrian-n2': ['mm', 6], altered: ['mm', 7],
  'harm-min': ['hm', 1], 'locrian-n6': ['hm', 2], 'ionian-s5': ['hm', 3], 'dorian-s4': ['hm', 4], 'phryg-dom': ['hm', 5], 'lydian-s2': ['hm', 6] };
const ORD = ['', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th'];
const ORD_W = ['', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh'];
const DIM_SAY = 'a symmetrical scale: half step, whole step';
export function parentOf(mode, rootPc) {
  if (mode === 'dim-hw') return { text: 'Symmetrical: half step, whole step, all the way up. A dominant scale with ♭9, ♯9, ♯11 and 13.', say: DIM_SAY };
  const p = PARENT[mode];
  if (!p) return null;
  const s = SYS[p[0]], deg = p[1], ppc = (rootPc - s.ivs[deg - 1] + 12) % 12;
  return { text: deg === 1 ? `${s.names[ppc]} ${s.name} itself: the parent scale, its 1st mode` : `The ${ORD[deg]} mode of ${s.names[ppc]} ${s.name}`, say: `the ${ORD_W[deg]} mode of ${s.say}` };
}
// which notes differ between two modes on one root: "♭2 in place of 2"
function changeText(from, to) {
  const a = BY[from].ivs, b = BY[to].ivs, sa = new Set(a.map(semi)), sb = new Set(b.map(semi));
  const gone = a.filter((iv) => !sb.has(semi(iv))), came = b.filter((iv) => !sa.has(semi(iv)));
  if (!gone.length || gone.length > 2 || gone.length !== came.length) return '';
  return came.map((iv, i) => `${degText(iv)} in place of ${degText(gone[i])}`).join(', ');
}
function placeText(mode) {
  const r = RUNG_OF[mode];
  if (!r) return '';
  if (r.mode === mode) {
    const prev = RUNGS[r.n - 2];
    return `Rung ${r.n} of 7${r.n === 1 ? ': the brightest' : r.n === 7 ? ': the darkest' : ''}${prev ? `. From ${modeName(prev.mode)}: ${changeText(prev.mode, mode)}` : ''}`;
  }
  const ch = changeText(r.mode, mode);
  return `A detour from rung ${r.n}, ${modeName(r.mode)}${ch ? `: ${ch}` : ''}`;
}

// ---------- chords ----------
const QUALS = [['maj', 'Major'], ['min', 'Minor'], ['dim', 'Diminished'], ['aug', 'Augmented'], ['sus4', 'Sus 4'], ['sus2', 'Sus 2'], ['maj7', 'Major 7'], ['7', 'Dominant 7'],
  ['m7', 'Minor 7'], ['m7b5', 'Half-diminished'], ['dim7', 'Diminished 7'], ['mMaj7', 'Minor-major 7'], ['6', 'Major 6'], ['m6', 'Minor 6'], ['maj7#5', 'Major 7♯5'], ['7#5', '7♯5']];
export function chordList(mode, root = '') {
  if (!mode) return QUALS.map(([q, l]) => [`q:${q}`, `${root} ${l}`]);
  const t = T.getChord(TRIAD[mode]), s = T.getChord(SEVENTH[mode]);
  return [['tri', `${root}${t.sym.trim()} triad`], ['sev', `${root}${s.sym.trim()}`], ...(MODE_CHORDS[mode] || []).map((id) => [id, `${root}${CHORD[id].sym}${/^xr:/.test(id) ? ' (rootless)' : ''}`])];
}
function chordOf(mode, key) {
  let q = null;
  if (key?.startsWith('q:')) q = key.slice(2);
  else if (mode && key === 'tri') q = TRIAD[mode];
  else if (mode && (key === 'sev' || !CHORD[key])) q = SEVENTH[mode];
  else if (!mode) q = 'maj7';
  if (q) { const c = T.getChord(q); return { tones: c.ivs, sym: c.sym.trim(), q }; }
  return { tones: CHORD[key].tones, sym: CHORD[key].sym };
}
// the extended arpeggio: the chord, the mode's 7th chord, and the tensions the mode uses
const asExt = (iv) => String(iv).replace(/^(bb|b|#)?([246])$/, (m, a, n) => (a || '') + { 2: '9', 4: '11', 6: '13' }[n]);
function extArp(mode, tones) {
  const m = new Map();
  for (const iv of tones) m.set(semi(iv), iv);
  if (!mode) return m;
  for (const iv of T.getChord(SEVENTH[mode]).ivs) if (!m.has(semi(iv))) m.set(semi(iv), iv);
  for (const iv of ULT_INFO[mode]?.use || []) if (!m.has(semi(iv))) m.set(semi(iv), iv);
  return m;
}
const modeMap = (mode, tones) => (mode ? new Map(BY[mode].ivs.map((iv) => [semi(iv), iv])) : new Map(tones.map((iv) => [semi(iv), iv])));

// ---------- voicings: close triads, drop 2 and drop 3, one note per string ----------
export const SETS = {
  2: [['54', 'Strings 5 and 4'], ['43', 'Strings 4 and 3'], ['32', 'Strings 3 and 2'], ['21', 'Strings 2 and 1']], // guide tones: neighbouring strings, where 3rds and 7ths sit a fret or two apart
  3: [['654', 'Strings 6 5 4'], ['543', 'Strings 5 4 3'], ['432', 'Strings 4 3 2'], ['321', 'Strings 3 2 1']],
  4: [['4321', 'Drop 2 on 4 3 2 1'], ['5432', 'Drop 2 on 5 4 3 2'], ['6543', 'Drop 2 on 6 5 4 3'], ['6432', 'Drop 3 on 6 4 3 2'], ['5321', 'Drop 3 on 5 3 2 1']],
};
const SET_NAME = Object.fromEntries([...SETS[3], ...SETS[4]]);
export const INV_NAMES = ['root position', 'first inversion', 'second inversion', 'third inversion'];
const ORDER = { 1: 0, 3: 1, b3: 1, 2: 1, 4: 1, 5: 2, b5: 2, '#5': 2, 7: 3, b7: 3, bb7: 3, 6: 3 };
export const invName = (bass, tones) => (tones.length === 2 ? `the ${degWord(bass)} in the bass` : bass === '1' ? 'root position' : tones.includes('1') && ORDER[bass] != null ? INV_NAMES[ORDER[bass]] : `the ${degWord(bass)} in the bass`);
function standard(midis, setId) {
  const v = [...midis].sort((a, b) => a - b);
  const close = (x) => { const y = [...x].sort((a, b) => a - b); return y[y.length - 1] - y[0] < 12; };
  if (v.length === 2) return v[1] - v[0] <= 12;
  if (v.length === 3) return close(v);
  if (setId === '6432' || setId === '5321') return close([v[1], v[2], v[3], v[0] + 12]) && v[0] + 12 > v[1] && v[0] + 12 < v[2];
  return close([v[1], v[2], v[3], v[0] + 12]) && v[0] + 12 > v[2] && v[0] + 12 < v[3];
}
export function onSet(rootPc, tones, setId) {
  const pcs = new Map(tones.map((iv) => [(rootPc + semi(iv)) % 12, iv]));
  const strings = setId.split('').map(Number), out = [], cur = [];
  const go = (k) => {
    if (k === strings.length) {
      if (new Set(cur.map((n) => n.iv)).size !== tones.length) return;
      if (cur.some((n, i) => i && n.midi <= cur[i - 1].midi)) return;
      if (!fingerable(cur) || !standard(cur.map((n) => n.midi), setId)) return;
      const fr = cur.filter((n) => n.fret > 0).map((n) => n.fret);
      out.push({ notes: cur.map((n) => ({ ...n })), set: setId, bass: cur[0].iv, at: fr.length ? fr.reduce((a, b) => a + b, 0) / fr.length : 0, span: fr.length ? Math.max(...fr) - Math.min(...fr) : 0 });
      return;
    }
    const s = strings[k];
    for (let f = 0; f <= 15; f++) {
      const midi = openOf(s) + f, iv = pcs.get(midi % 12);
      if (!iv || cur.some((n) => n.iv === iv)) continue;
      cur.push({ string: s, fret: f, midi, iv }); go(k + 1); cur.pop();
    }
  };
  go(0);
  return out;
}
const inside = (v, w) => v.notes.every((n) => (n.fret === 0 ? w.lo <= 1 : n.fret >= w.lo - 1 && n.fret <= w.hi + 1));
// every voicing of the chord on the string sets asked for, in the area; Best keeps the nicest of each inversion on
// each string set (no stretch past three frets, nothing muddy, not too high), All keeps every playable one
export function chordVoicings(rootPc, tones, { set = 'any', win = null, pick = 'best' } = {}) {
  const size = tones.length >= 4 ? 4 : tones.length === 2 ? 2 : 3;
  const ids = set === 'any' || !SETS[size].some(([id]) => id === set) ? SETS[size].map(([id]) => id) : [set];
  let all = ids.flatMap((id) => onSet(rootPc, tones.slice(0, size), id));
  if (win) all = all.filter((v) => inside(v, win));
  if (pick === 'best') {
    const mid = win ? (win.lo + win.hi) / 2 : 7;
    const ok = all.filter((v) => { const m = v.notes.map((n) => n.midi); return v.span <= 3 && m[m.length - 1] <= 81 && !(m[0] < 50 && m[1] - m[0] < 5); });
    const best = new Map();
    for (const v of ok) { const k = `${v.bass}|${v.set}`, c = v.span * 0.6 + Math.abs(v.at - mid) * 0.2; if (!best.has(k) || best.get(k).c > c) best.set(k, { v, c }); }
    all = [...best.values()].map((x) => x.v);
  }
  return all.sort((a, b) => a.at - b.at || a.notes[0].midi - b.notes[0].midi);
}

// ---------- lines: a scale or an arpeggio, up and back down ----------
function lineIn(rootPc, map, win, diagonal = false) {
  const cands = [];
  for (let s = 6; s >= 1; s--) for (let f = Math.max(0, win.lo); f <= win.hi; f++) {
    const midi = openOf(s) + f, iv = map.get(((midi - rootPc) % 12 + 12) % 12);
    if (iv) cands.push({ string: s, fret: f, midi, iv });
  }
  if (!cands.length) return [];
  const by = new Map();
  const lo = Math.min(...cands.map((n) => n.midi)), hi = Math.max(...cands.map((n) => n.midi));
  // each pitch once: in a shape, the spot nearest its middle; across the neck, the spot on a diagonal climbing it
  const target = (m) => (diagonal ? win.lo + ((m - lo) / Math.max(1, hi - lo)) * (win.hi - win.lo) : (win.lo + win.hi) / 2);
  for (const n of cands) { const o = by.get(n.midi); if (!o || Math.abs(n.fret - target(n.midi)) < Math.abs(o.fret - target(n.midi))) by.set(n.midi, n); }
  // start and end on the lowest root in range, when there is one near the bottom
  let up = [...by.values()].sort((a, b) => a.midi - b.midi);
  const r0 = up.findIndex((n) => n.iv === '1');
  if (r0 > 0 && r0 <= Math.max(3, up.length / 3)) up = up.slice(r0);
  return up.concat(up.slice(0, -1).reverse());
}
function acrossWin(rootNote, shape) {
  const a = Gr.positionOf(rootNote, shape), nx = Gr.positionOf(rootNote, Gr.nextShape(shape));
  let b = nx;
  if (b.lo < a.lo) b = b.hi + 12 <= 15 ? { lo: b.lo + 12, hi: b.hi + 12 } : null;
  if (!b) { const pv = Gr.positionOf(rootNote, SHAPES[(SHAPES.indexOf(shape) + 4) % 5]); return { lo: Math.min(pv.lo, a.lo), hi: Math.max(pv.hi, a.hi), label: `across the ${SHAPES[(SHAPES.indexOf(shape) + 4) % 5]} and ${shape} shapes` }; }
  return { lo: a.lo, hi: b.hi, label: `across the ${shape} and ${Gr.nextShape(shape)} shapes` };
}

// ---------- the chord scale: a chord on every degree of the mode, stacked in its own thirds ----------
const SLOT = [{ 2: '2', 3: 'b3', 4: '3', 5: '4' }, { 6: 'b5', 7: '5', 8: '#5' }, { 8: 'b6', 9: 'bb7', 10: 'b7', 11: '7' }];
const ANY = { 0: '1', 1: 'b2', 2: '2', 3: 'b3', 4: '3', 5: '4', 6: 'b5', 7: '5', 8: '#5', 9: '6', 10: 'b7', 11: '7' };
const NUMERAL = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
const Q_WORDS = { maj: 'major', min: 'minor', dim: 'diminished', aug: 'augmented', maj7: 'major seven', 7: 'seven', m7: 'minor seven', m7b5: 'half diminished', dim7: 'diminished seven',
  mMaj7: 'minor major seven', 'maj7#5': 'major seven sharp five', '7#5': 'seven sharp five', '7b5': 'seven flat five', sus2: 'sus two', sus4: 'sus four', '7sus4': 'seven sus four' };
export function chordScale(mode, keyNote, size) {
  const ivs = BY[mode].ivs, sc = ivs.map(semi), n = sc.length, z = size === 2 ? 4 : size;
  return sc.map((s0, d) => {
    let tones = ['1'];
    for (let k = 1; k < z; k++) { const j = d + 2 * k, s1 = sc[j % n] + 12 * Math.floor(j / n), x = ((s1 - s0) % 12 + 12) % 12; tones.push(SLOT[k - 1][x] || ANY[x]); }
    const named = nameOf(tones), q = named?.id || null;
    const deg = F.simpleIv(ivs[d]), m = /^(bb|b|#)?(\d)$/.exec(deg), acc = m?.[1] === 'b' ? '♭' : m?.[1] === '#' ? '♯' : m?.[1] === 'bb' ? '𝄫' : '';
    const minor = tones[1] === 'b3', dim = tones[2] === 'b5', aug = tones[2] === '#5';
    let rn = acc + (minor || (dim && tones[1] !== '3') ? NUMERAL[Number(m?.[2] || d + 1)].toLowerCase() : NUMERAL[Number(m?.[2] || d + 1)]);
    if (dim) rn += tones[3] === 'b7' ? 'ø' : tones[1] === 'b3' ? '°' : '';
    if (aug) rn += '+';
    const root = T.transpose(keyNote, deg);
    const sym = named ? named.sym.trim() : `(${tones.map(degText).join(' ')})`;
    if (size === 2) tones = [tones[1], tones[3]]; // guide tones: the 3rd and the 7th
    return { d, root, rootPc: T.notePc(root), tones, q, sym, rn, say: q && Q_WORDS[q] && romanWords(acc + NUMERAL[Number(m?.[2] || d + 1)]) ? `${romanWords(acc + NUMERAL[Number(m?.[2] || d + 1)])} ${Q_WORDS[q]}` : null };
  });
}
// the orders a chord scale can go in (7-note modes): by step, or in diatonic 3rds, 4ths (the cycle) or 5ths
export const CS_ORDERS = [['steps', 'In steps', 1], ['thirds', 'In 3rds', 2], ['fourths', 'In 4ths', 3], ['fifths', 'In 5ths', 4]];
const csSeq = (order, n) => { const st = (CS_ORDERS.find(([k]) => k === order) || CS_ORDERS[0])[2]; return n === 7 ? [...Array(7).keys()].map((k) => (k * st) % 7) : [...Array(n).keys()]; };
const CS_ORDER_HINT = { steps: 'Up the scale a degree at a time.', thirds: 'Each chord a 3rd up: neighbours share two notes, so on one string set two voices hold and one moves.', fourths: 'The diatonic cycle, each chord a 4th up (a 5th down), as jazz and the baroque use it: on one string set the inversions alternate and every voice moves by step. The classic voice-leading drill.', fifths: 'Each chord a 5th up: the cycle backwards, every voice moving by step.' };
const shiftCost = (a, b) => {
  const x = a.notes.map((n) => n.midi).sort((p, q) => p - q), y = b.notes.map((n) => n.midi).sort((p, q) => p - q);
  const pitch = x.length === y.length ? y.reduce((t, m, i) => t + Math.abs(m - x[i]), 0) : y.reduce((t, m) => t + Math.min(...x.map((o) => Math.abs(o - m))), 0);
  return pitch + Math.abs(a.at - b.at) * 0.7; // and the hand's shift along the neck
};
// the smoothest path through lists of voicings (dynamic programming)
function smoothest(lists, extra = () => 0) {
  if (lists.some((l) => !l.length)) return null;
  let st = lists[0].map((v) => ({ v, c: extra(v), path: [v] }));
  for (const l of lists.slice(1)) st = l.map((v) => { let b = null; for (const p of st) { const c = p.c + shiftCost(p.v, v) + extra(v); if (!b || c < b.c) b = { v, c, path: [...p.path, v] }; } return b; });
  return st.reduce((a, b) => (a.c <= b.c ? a : b)).path;
}

// ---------- nearby: the extensions and changes around a chord ----------
// each note of the mode (or, with no mode, the usual tensions for the chord's family) that the chord doesn't play,
// named from the chord's root: a tension (9, 11, 13 and their alterations), a 6th or 7th a triad could add, or a note a
// half step above a chord tone (an avoid note: it clashes, except the ♭9 and ♭13 of a dominant chord)
const GENERIC = { maj: [2, 6, 9, 11], dom: [1, 2, 3, 9], min: [2, 5, 9, 10], hd: [2, 5, 8], dim: [2, 5, 8, 11], aug: [2, 6, 11] };
export function nearby(chordPc, tones, mode, keyPc) {
  const have = new Set(tones.map(semi)), seventh = tones.some((iv) => /^(b|bb)?7$/.test(iv)) || (have.has(9) && tones.includes('6'));
  const dom = have.has(4) && have.has(10), fam = dom ? 'dom' : have.has(3) && have.has(6) ? (have.has(10) ? 'hd' : 'dim') : have.has(3) ? 'min' : have.has(8) && have.has(4) ? 'aug' : 'maj';
  const pcs = mode ? BY[mode].ivs.map((iv) => ((keyPc + semi(iv) - chordPc) % 12 + 12) % 12) : GENERIC[fam];
  const name = (x) => ({ 1: 'b9', 2: '9', 3: have.has(4) ? '#9' : 'b3', 4: '3', 5: '11', 6: have.has(7) ? '#11' : 'b5', 7: '5', 8: have.has(7) ? 'b13' : '#5', 9: seventh ? '13' : '6', 10: 'b7', 11: '7' }[x]);
  const out = new Map();
  for (const x of pcs) {
    if (have.has(x) || x === 0) continue;
    const avoid = have.has((x + 11) % 12) && !(dom && (x === 1 || x === 8)) && !(x === 5 && !have.has(4) && !have.has(3));
    out.set(x, { iv: name(x), avoid });
  }
  return out;
}

// ---------- the practices ----------
export const WHAT = [
  ['bounce', 'Bounce', 'One chord’s inversions, one after another: bouncing about, up the neck, or up and down.'],
  ['next', 'Next voicing', 'With the metronome: the next inversion shows on the last beat, so you’re there on the one.'],
  ['dive', 'Chord deep dive', 'One chord, all of it: its arpeggio, its extended arpeggio (the mode decides the extensions), every inversion, then the mode’s richer chords.'],
  ['arps', 'Arpeggios', 'The extended arpeggio of every chord in the ladder, mode by mode.'],
  ['ladder', 'Full ladder', 'The whole ladder, rung by rung with its detours: the scale, the arpeggio and the chords, as you choose.'],
  ['vl', 'Voice leading', 'One chord down the ladder, voice-led: each rung moves one note, and you see which.'],
  ['inv', 'Inversions up the neck', 'One chord all over the neck: its inversions climbing one string set from the bottom of the neck to the top, then down. Every string set in turn if you like.'],
  ['cs', 'Chord scale', 'A chord on every degree of the mode: in steps, 3rds, 4ths or 5ths, in position, climbing in one inversion, or voice-led on a string set.'],
];
// ready-made exercises: each sets the practice up
export const DRILLS = [
  ['d-inv', 'One chord, every inversion, every string set', 'The chord’s inversions up the neck and back on each string set in turn.', { what: 'inv', set: 'any', csDir: 'updown' }],
  ['d-tri', 'Triad chord scales: every inversion, every string set', 'Three chord scales per string set (root position, first, second), each climbing the neck in one shape. Twelve runs.', { what: 'cs', csq: 'tri', where: 'climb', csSet: 'all', csInv: -1, csOrder: 'steps', csDir: 'updown' }],
  ['d-sev', '7th chord scales: every inversion, drop 2 and drop 3', 'Four chord scales per string set, each climbing in one inversion.', { what: 'cs', csq: 'sev', where: 'climb', csSet: 'all', csInv: -1, csOrder: 'steps', csDir: 'updown' }],
  ['d-pos', 'The chord scale in one position', 'Every chord inside one CAGED shape: the inversions change so the hand can stay.', { what: 'cs', csq: 'sev', where: 'shape', csOrder: 'steps', csDir: 'updown' }],
  ['d-cycle', 'The diatonic cycle in 4ths, voice-led', 'I IV vii iii vi ii V I on one string set at a time, each chord the nearest voicing: the inversions alternate and every voice steps.', { what: 'cs', csq: 'sev', where: 'set', csSet: 'all', csOrder: 'fourths', csDir: 'up' }],
  ['d-guide', 'Guide tones through the cycle', 'Just the 3rd and 7th of each chord, round the cycle: one falls a half step, the other holds. The skeleton of jazz harmony.', { what: 'cs', csq: 'guide', where: 'set', csSet: 'all', csOrder: 'fourths', csDir: 'up' }],
  ['d-thirds', 'Triads in 3rds: two notes hold, one moves', 'I iii V vii ii IV vi I on one string set: each chord keeps two notes of the last.', { what: 'cs', csq: 'tri', where: 'set', csSet: 'all', csOrder: 'thirds', csDir: 'up' }],
];
const WHERE = {
  bounce: ['shape', 'neck'], next: ['shape', 'neck'], dive: ['shape', 'tour', 'across', 'neck'], arps: ['shape', 'tour', 'across'], ladder: ['shape', 'tour'], vl: ['shape', 'tour'], cs: ['shape', 'climb', 'set', 'neck'], inv: ['neck'],
};
const WHERE_NAME = { shape: 'One CAGED shape', tour: 'Through the shapes', across: 'Across shapes', neck: 'Whole neck', climb: 'Up the neck', set: 'Voice-led on a string set' };
const WHERE_HINT = {
  shape: { def: 'Everything inside one CAGED shape of the key.', cs: 'In position: every chord inside one CAGED shape of the key, voice-led, so the hand barely moves.' },
  climb: 'One string set and one inversion: the shape repeats, each chord a step further along the neck.',
  set: 'One string set, every inversion: each chord takes the voicing nearest the last, so the hand stays and the voices move as little as they can.',
  tour: { dive: 'The whole dive in each of the five shapes, up the neck.', arps: 'Each arpeggio in all five shapes, up the neck, before the next mode.', ladder: 'One lap of the ladder in each shape, up the neck.', vl: 'One lap of the ladder in each shape, up the neck.' },
  across: 'Lines climb on a diagonal from this shape into the next one up: extensions often sit there.',
  neck: { def: 'Anywhere on the neck.', cs: 'The best voicings anywhere on the neck, each chord moving as little as it can to the next.' },
};
const walkMain = (detours) => ULT_WALK.filter(([, k]) => detours || typeof k === 'number');
// the walk starting at a mode (its rung)
function walkFrom(mode, detours) {
  const w = walkMain(detours), r = RUNG_OF[mode]?.mode || 'lydian';
  const i = Math.max(0, w.findIndex(([m, k]) => m === r && typeof k === 'number'));
  return w.slice(i).concat(w.slice(0, i));
}

export const DEF_L = { root: 'C', mode: 'dorian', chord: 'sev', what: 'bounce', where: 'shape', shape: 'A', set: 'any', pick: 'best', move: 'bounce',
  bpm: 72, beats: 4, click: true, auto: true, next: 'off', ghost: 'mode', ghostArea: 'area', play: 'together', voice: true,
  pScale: true, pArp: true, pChords: true, rich: false, detours: true, ext: true, vlq: 'sev', lane: 'best', csq: 'sev', csSet: '4321', csInv: 0, csDir: 'updown', csOrder: 'steps' };

// ---------- the screen ----------
export function ladder(app, { S, save, back, sound }) {
  const O = S.l;
  const ctx = () => A.audioCtx();
  let run = null;

  // ----- setup -----
  function rowL(label, body, note = '') { return `<div class="row"><label>${label}</label>${body}${note ? `<p class="hint">${note}</p>` : ''}</div>`; }
  function seg(k, opts, cur) { return `<div class="seg">${opts.map(([v, l]) => `<button data-l="${k}" data-v="${esc(v)}" class="${String(cur) === String(v) ? 'on' : ''}">${l}</button>`).join('')}</div>`; }
  function flip(k, label) { return `<button data-l="${k}" data-v="${!O[k]}" class="${O[k] ? 'on' : ''}">${label}</button>`; }
  function modeSelect(allowNone) {
    const opt = (m, label) => `<option value="${m}" ${O.mode === m ? 'selected' : ''}>${esc(label)}</option>`;
    return `<select data-lsel="mode" class="sel">${allowNone ? opt('', 'No particular mode: just the chord') : ''}${RUNGS.map((r) => `<optgroup label="Rung ${r.n}${r.n === 1 ? ' · brightest' : r.n === 7 ? ' · darkest' : ''}">${opt(r.mode, modeName(r.mode))}${r.detours.map((d) => opt(d, `↳ ${modeName(d)} (detour)`)).join('')}</optgroup>`).join('')}</select>`;
  }
  function setup() {
    stopRun();
    const walkWhat = ['arps', 'ladder', 'vl'].includes(O.what);
    if ((walkWhat || O.what === 'cs') && !O.mode) O.mode = 'lydian';
    if (!WHERE[O.what].includes(O.where)) O.where = 'shape';
    const mode = O.mode || null, rootPc = T.notePc(T.parseNote(O.root));
    const list = chordList(mode, T.noteName(T.parseNote(O.root), true));
    if (!list.some(([k]) => k === O.chord)) O.chord = mode ? 'sev' : 'q:maj7';
    const ch = chordOf(mode, O.chord), size = ch.tones.length >= 4 ? 4 : 3;
    if (O.set !== 'any' && !SETS[size].some(([id]) => id === O.set)) O.set = 'any';
    const par = mode ? parentOf(mode, rootPc) : null, place = mode ? placeText(mode) : '';
    const chordWhat = ['bounce', 'next', 'dive', 'inv'].includes(O.what);
    const csSize = O.csq === 'tri' ? 3 : O.csq === 'guide' ? 2 : 4;
    if (O.what === 'cs' && O.csSet !== 'all' && !SETS[csSize].some(([id]) => id === O.csSet)) O.csSet = csSize === 4 ? '4321' : csSize === 2 ? '54' : '432';
    if (O.what === 'cs' && O.set !== 'any' && !SETS[csSize].some(([id]) => id === O.set)) O.set = 'any';
    if (O.csInv >= csSize) O.csInv = 0;
    const csText = O.what === 'cs' && mode ? ((cs) => csSeq(O.csOrder, cs.length).map((k) => cs[k].rn).concat(cs[0].rn).join(' · '))(chordScale(mode, T.parseNote(O.root), csSize)) : '';
    const w = WHAT.find(([k]) => k === O.what);
    const hintWhere = typeof WHERE_HINT[O.where] === 'string' ? WHERE_HINT[O.where] : WHERE_HINT[O.where][O.what] || WHERE_HINT[O.where].def;
    app.innerHTML = `
    <header class="bar"><button class="icon" data-l="back" aria-label="Back">‹</button><h2>Ladder</h2><span></span></header>
    <section class="card">
      ${rowL('Practice', `<select data-lsel="what" class="sel"><optgroup label="Practices">${WHAT.map(([k, l]) => `<option value="${k}" ${O.what === k ? 'selected' : ''}>${esc(l)}</option>`).join('')}</optgroup><optgroup label="Exercises">${DRILLS.map(([k, l]) => `<option value="${k}">${esc(l)}</option>`).join('')}</optgroup></select>`, (O.drill ? `<b>${esc(DRILLS.find(([k]) => k === O.drill)?.[1] || '')}</b>: ${esc(DRILLS.find(([k]) => k === O.drill)?.[2] || '')} ` : '') + w[2])}
      ${rowL('Key', `<select data-lsel="root" class="sel">${KEYS.map((k) => `<option value="${k}" ${O.root === k ? 'selected' : ''}>${fmt(k)}</option>`).join('')}</select>`)}
      ${rowL(walkWhat ? 'Start at' : 'Mode', modeSelect(!walkWhat && O.what !== 'cs'), mode ? `<b>${esc(modeName(mode))}</b>: ${esc(par?.text || '')}.${place ? ` ${esc(place)}.` : ''}` : 'Without a mode the chord has no extensions: pick one to hear its extended arpeggio and richer chords.')}
      ${chordWhat ? rowL('Chord', `<select data-lsel="chord" class="sel">${list.map(([k, l]) => `<option value="${k}" ${O.chord === k ? 'selected' : ''}>${fmt(l)}</option>`).join('')}</select>`) : ''}
      ${O.what === 'vl' ? rowL('Chord', seg('vlq', [['tri', 'Triads'], ['sev', '7th chords']], O.vlq), 'Each mode’s own triad or 7th chord on the root.') : ''}
      ${O.what === 'cs' ? rowL('Chords', seg('csq', [['tri', 'Triads'], ['sev', '7th chords'], ['guide', 'Guide tones']], O.csq), O.csq === 'guide' ? 'Just the 3rd and 7th of each 7th chord: the notes that say what the chord is.' : '') : ''}
      ${O.what === 'cs' ? rowL('Order', seg('csOrder', CS_ORDERS.map(([k, l]) => [k, l]), O.csOrder), `${CS_ORDER_HINT[O.csOrder]} ${csText}`) : ''}
      ${rowL('Where', seg('where', WHERE[O.what].map((k) => [k, O.what === 'cs' && k === 'shape' ? 'In position' : WHERE_NAME[k]]), O.where), hintWhere)}
      ${!['neck', 'climb', 'set'].includes(O.where) ? rowL(O.where === 'tour' ? 'Start in' : 'Shape', seg('shape', SHAPES.map((s) => [s, s]), O.shape)) : ''}
      ${chordWhat ? rowL('Strings', seg('set', [['any', O.what === 'inv' ? 'Every set' : 'Any'], ...SETS[size].map(([id, l]) => [id, l.replace('Strings ', '').replace('Drop ', 'D')])], O.set), size === 4 ? 'Drop 2 and drop 3 voicings, one note per string.' : 'Close triads on three neighbouring strings.') : ''}
      ${chordWhat || O.what === 'ladder' ? rowL('Voicings', seg('pick', [['best', 'Best'], ['all', 'All']], O.pick), O.pick === 'best' ? 'The nicest voicing of each inversion on each string set: no long stretches, nothing muddy.' : 'Every playable voicing, stretches and all.') : ''}
      ${['bounce', 'next'].includes(O.what) ? rowL('Move', seg('move', [['bounce', 'Bounce'], ['up', 'Up the neck'], ['updown', 'Up and down']], O.move), O.move === 'bounce' ? 'Each time a different inversion, nearby.' : '') : ''}
      ${O.what === 'ladder' ? rowL('Include', `<div class="seg">${flip('pScale', 'Scales')}${flip('pArp', 'Arpeggios')}${flip('pChords', 'Chords')}</div>`, 'For each mode: its scale, then its extended arpeggio, then its chords.') : ''}
      ${O.what === 'ladder' && O.pChords ? rowL('Chords', seg('rich', [[false, 'Triad and 7th'], [true, '+ richer chords']], O.rich)) : ''}
      ${O.what === 'arps' ? rowL('Arpeggio', seg('ext', [[false, '7th chord'], [true, 'Extended']], O.ext), O.ext ? 'The 7th chord plus the tensions the mode uses.' : 'Just the four notes of each mode’s 7th chord.') : ''}
      ${walkWhat ? rowL('Detours', seg('detours', [[true, 'On'], [false, 'Rungs only']], O.detours), 'A detour changes one note of its rung, then comes back.') : ''}
      ${O.what === 'cs' && (O.where === 'climb' || O.where === 'set') ? rowL('Strings', seg('csSet', [...SETS[csSize].map(([id, l]) => [id, l.replace('Strings ', '').replace('Drop ', 'D')]), ['all', 'Every set']], O.csSet), O.csSet === 'all' ? 'One run on each string set in turn, low strings first.' : '') + (O.where === 'set' ? '' : rowL('Inversion', seg('csInv', [...(csSize === 2 ? ['3rd below', '7th below'] : INV_NAMES.slice(0, csSize).map((l) => cap(l.replace(' position', '').replace(' inversion', '')))).map((l, i) => [i, l]), [-1, 'Each in turn']], O.csInv), O.csInv < 0 ? `All ${csSize === 3 ? 'three' : 'four'} ${csSize === 3 ? 'triad' : '7th-chord'} chord scales, one per inversion: root position, then first, then second${csSize === 4 ? ', then third' : ''}. Each keeps one shape as it climbs.` : 'Every chord in the same inversion, so the shape repeats as it climbs.')) : ''}
      ${O.what === 'cs' && (O.where === 'shape' || O.where === 'neck') ? rowL('Strings', seg('set', [['any', 'Any'], ...SETS[csSize].map(([id, l]) => [id, l.replace('Strings ', '').replace('Drop ', 'D')])], O.set)) : ''}
      ${O.what === 'cs' || O.what === 'inv' ? rowL('Direction', seg('csDir', [['up', 'Up'], ['updown', 'Up and down']], O.csDir)) : ''}
      ${O.what === 'vl' ? rowL('Voicings', seg('lane', [['best', 'Best'], ['d2', 'Drop 2'], ['d3', 'Drop 3']], O.lane)) : ''}
    </section>
    <section class="card">
      <h3>Time</h3>
      ${rowL('Tempo', `<div class="slide"><input type="range" data-lsel="bpm" min="40" max="160" step="2" value="${O.bpm}"><output>${O.bpm} bpm</output></div>`)}
      ${rowL('Each chord', seg('beats', [[2, '2 beats'], [4, '1 bar'], [8, '2 bars'], [16, '4 bars']], O.beats), O.what === 'ladder' || O.what === 'arps' || O.what === 'dive' ? 'Scales and arpeggios take as long as the run up and down, in eighth notes.' : '')}
      ${rowL('Advance', seg('auto', [[true, 'Auto'], [false, 'By hand']], O.auto), O.auto ? '' : 'Tap › for the next one; the metronome keeps going.')}
      ${rowL('Metronome', seg('click', [[true, 'On'], [false, 'Off']], O.click))}
      ${O.what !== 'next' ? rowL('Show next', seg('next', [['off', 'Off'], ['beat', 'Last beat'], ['always', 'Always']], O.next), 'The next voicing as rings on the neck.') : ''}
    </section>
    <section class="card">
      <h3>See and hear</h3>
      ${rowL('Ghost notes', seg('ghost', [['off', 'Off'], ['mode', 'Mode'], ['arp', 'Arpeggio'], ['near', 'Nearby']], O.ghost), O.ghost === 'mode' ? 'Every note of the mode, by interval.' : O.ghost === 'arp' ? 'The extended arpeggio: chord tones and the extensions.' : O.ghost === 'near' ? 'Just the notes to be aware of, right around the voicing: the extensions you could add, the 6th or 7th a triad could take, and (ringed) the notes that clash. The mode decides them.' : '')}
      ${O.ghost !== 'off' && O.ghost !== 'near' ? rowL('Ghosts', seg('ghostArea', [['area', 'In the area'], ['neck', 'Whole neck']], O.ghostArea)) : ''}
      ${rowL('Play', seg('play', [['together', 'Together'], ['arp', 'Arpeggiated'], ['silent', 'Silent']], O.play))}
      ${rowL('Voice', seg('voice', [[true, 'Names'], [false, 'Off']], O.voice), 'The mode and where it comes from; the inversion when there’s time.')}
    </section>
    ${sound()}
    <button class="play" data-l="begin">Begin</button>`;
  }

  // ----- the steps -----
  function build() {
    const rootNote = T.parseNote(O.root), rootPc = T.notePc(rootNote), rootLabel = T.noteName(rootNote, true);
    const mode = O.mode || null;
    const shapesFrom = (s) => { const i = SHAPES.indexOf(s); return SHAPES.slice(i).concat(SHAPES.slice(0, i)); };
    const winOf = (shape) => { const p = Gr.positionOf(rootNote, shape); return { lo: p.lo, hi: p.hi, label: `the ${shape} shape` }; };
    const NECK = { lo: 0, hi: 15, label: 'the whole neck' };
    const sym = (s) => `${rootLabel}${T.pretty(s)}`;
    const lineStep = (m, map, win, part, title, diag) => {
      const notes = lineIn(rootPc, map, win, diag);
      if (!notes.length) return null;
      return { kind: 'line', notes, mode: m, part, title, win, beats: Math.max(O.beats, Math.ceil(notes.length / 2 / 4) * 4) };
    };
    const chordStep = (m, v, ch, win, part, extra = {}) => ({ kind: 'chord', notes: v.notes, mode: m, part, title: sym(ch.sym), inv: invName(v.notes[0].iv, ch.tones), set: SET_NAME[v.set] || '', win, beats: O.beats, ...extra });
    const tones = chordOf(mode, O.chord).tones;
    const ch = chordOf(mode, O.chord);

    if (O.what === 'bounce' || O.what === 'next') {
      const win = O.where === 'shape' ? winOf(O.shape) : NECK;
      const all = chordVoicings(rootPc, tones, { set: O.set, win: O.where === 'shape' ? win : null, pick: O.pick });
      let idx = -1, dir = 1, prev = null;
      const gen = () => {
        if (!all.length) return null;
        let v;
        if (O.move === 'up') { idx = (idx + 1) % all.length; v = all[idx]; }
        else if (O.move === 'updown') { if (idx + dir >= all.length || idx + dir < 0) dir = -dir; idx = Math.max(0, Math.min(all.length - 1, idx + dir)); v = all[idx]; }
        else { const c = all.filter((x) => x !== prev && (!prev || (x.bass !== prev.bass && Math.abs(x.at - prev.at) <= 7))); const pool = c.length ? c : all.filter((x) => x !== prev); v = pool.length ? pool[Math.floor(Math.random() * pool.length)] : all[0]; }
        prev = v;
        return chordStep(mode, v, ch, win, 'chord');
      };
      return { gen, count: all.length };
    }

    let list = [];
    if (O.what === 'cs') {
      const size = O.csq === 'tri' ? 3 : O.csq === 'guide' ? 2 : 4, cs = chordScale(mode, rootNote, size), n = cs.length;
      // the degrees in order, back to the tonic (an octave up); up and down comes back the same way
      const seq = [...csSeq(O.csOrder, n), n];
      const order = O.csDir === 'updown' ? [...seq, ...seq.slice(1, -1).reverse()] : seq;
      const chordAt = (k) => cs[k % n];
      const win = O.where === 'shape' ? winOf(O.shape) : NECK;
      const many = O.csSet === 'all' && (O.where === 'climb' || O.where === 'set');
      const sets = many ? SETS[size].map(([id]) => id) : [O.csSet];
      const push = (ks, path, first) => ks.forEach((k, i) => { const v = path[i]; if (v) list.push(csStep(chordAt(k), v, k, first && i === 0)); });
      if (O.where === 'climb') {
        // one inversion on one string set. In steps: each chord the next one up the neck, the octave on top if it
        // fits. In 3rds, 4ths or 5ths: each chord the nearest voicing in that inversion. Every set and/or each
        // inversion: one run after another, string set by string set
        const invs = O.csInv < 0 ? [...Array(size).keys()] : [Math.min(O.csInv, size - 1)];
        for (const set of sets) for (const inv of invs) {
          const cands = (k) => { const c = chordAt(k); return onSet(c.rootPc, c.tones, set).filter((v) => v.notes[0].iv === c.tones[inv]).sort((a, b) => a.at - b.at); };
          if (O.csOrder !== 'steps') { const path = smoothest(order.map(cands), (v) => v.span * 0.5); if (path) push(order, path, sets.length > 1 || invs.length > 1); continue; }
          const all = Array.from({ length: n + 1 }, (_, k) => cands(k));
          const climb = (v0) => {
            const up = [v0];
            let at = v0.at, wraps = 0;
            for (let k = 1; k <= n; k++) {
              const vs = all[k];
              if (!vs.length) { up.push(null); continue; }
              const v = vs.find((x) => x.at > at + 0.4);
              if (!v) { if (k === n) break; wraps++; up.push(vs[0]); at = vs[0].at; continue; }
              up.push(v); at = v.at;
            }
            return { up, wraps };
          };
          const tries = all[0].map(climb).sort((a, b) => a.wraps - b.wraps || b.up.length - a.up.length || (a.up[0].at < 1) - (b.up[0].at < 1) || a.up[0].at - b.up[0].at);
          const up = tries[0]?.up || [];
          if (up.length > n && up[n] && up[n].notes.map((x) => x.midi).join() === up[0].notes.map((x) => x.midi).join()) up.pop(); // no octave room: no repeat
          const path = O.csDir === 'updown' ? [...up, ...up.slice(1, -1).reverse()] : up;
          const ks = O.csDir === 'updown' ? [...up.keys(), ...[...up.keys()].slice(1, -1).reverse()] : [...up.keys()];
          push(ks, path, sets.length > 1 || invs.length > 1);
        }
      } else if (O.where === 'set') {
        // one string set, every inversion: the smoothest way through, starting low-ish on the neck
        for (const set of sets) {
          const lists = order.map((k) => { const c = chordAt(k); return onSet(c.rootPc, c.tones, set).filter((v) => v.span <= 3); });
          const path = smoothest(lists, (v) => v.span * 0.5 + (lists[0].includes(v) ? Math.abs(v.at - 5) * 0.4 : 0));
          if (path) push(order, path, sets.length > 1);
        }
      } else {
        const lists = order.map((k) => { const c = chordAt(k); return chordVoicings(c.rootPc, c.tones, { set: O.set, win: O.where === 'shape' ? win : null, pick: O.where === 'shape' ? 'all' : 'best' }); });
        const path = smoothest(lists, (v) => v.span * 0.8 + (v.notes[0].iv === '1' ? 0 : 0.6));
        if (path) push(order, path, false);
      }
      function csStep(c, v, k, first = false) {
        return { kind: 'chord', notes: v.notes, mode, part: first ? 'chord scale run' : 'chord scale', rn: c.rn, title: `${T.noteName(c.root, true)}${T.pretty(c.sym)}`, inv: invName(v.notes[0].iv, c.tones), set: SET_NAME[v.set] || '', win: O.where === 'shape' ? win : null, beats: O.beats, chordRoot: c.rootPc, chordNote: c.root, say: c.say, octave: k === n };
      }
    }
    if (O.what === 'inv') {
      // one chord, all over the neck: its voicings on a string set from the bottom of the neck to the top (and back)
      const size = tones.length >= 4 ? 4 : 3, sets = O.set === 'any' || !SETS[size].some(([id]) => id === O.set) ? SETS[size].map(([id]) => id) : [O.set];
      for (const set of sets) {
        const vs = chordVoicings(rootPc, tones, { set, pick: O.pick });
        const path = O.csDir === 'updown' ? [...vs, ...vs.slice(1, -1).reverse()] : vs;
        path.forEach((v, i) => list.push(chordStep(mode, v, ch, NECK, i === 0 && sets.length > 1 ? 'new set' : 'inversions')));
      }
    }
    if (O.what === 'dive') {
      const wins = O.where === 'tour' ? shapesFrom(O.shape).map((s) => ({ w: winOf(s), lineW: winOf(s), diag: false }))
        : O.where === 'across' ? [{ w: acrossWin(rootNote, O.shape), lineW: acrossWin(rootNote, O.shape), diag: true }]
          : O.where === 'neck' ? [{ w: NECK, lineW: { lo: 0, hi: 15, label: 'the whole neck' }, diag: true }]
            : [{ w: winOf(O.shape), lineW: winOf(O.shape), diag: false }];
      const own = new Map(tones.map((iv) => [semi(iv), iv]));
      for (const { w, lineW, diag } of wins) {
        list.push(lineStep(mode, own, lineW, 'arpeggio', `${sym(ch.sym)} arpeggio`, diag));
        if (mode) list.push(lineStep(mode, extArp(mode, tones), lineW, 'extended', `${sym(ch.sym)}, extended`, diag));
        const vs = chordVoicings(rootPc, tones, { set: O.set, win: O.where === 'neck' ? null : w, pick: O.pick });
        vs.forEach((v) => list.push(chordStep(mode, v, ch, w, 'inversions')));
        if (mode) {
          let last = vs[vs.length - 1] || null;
          for (const id of MODE_CHORDS[mode] || []) {
            if (id === O.chord) continue;
            const c2 = { tones: CHORD[id].tones, sym: CHORD[id].sym };
            const opts = chordVoicings(rootPc, c2.tones, { win: O.where === 'neck' ? null : w, pick: 'best' });
            if (!opts.length) continue;
            const cost = (x) => (last ? Math.abs(x.at - last.at) : Math.abs(x.at - ((w.lo + w.hi) / 2))) + (x.bass === '1' ? 0 : /^(b|#)?(9|11|13)$/.test(x.bass) ? 4 : 1.5);
            const v = opts.reduce((a, b) => (cost(a) <= cost(b) ? a : b));
            last = v;
            list.push(chordStep(mode, v, c2, w, 'richer'));
          }
        }
      }
    }
    if (O.what === 'arps') {
      for (const [m, k] of walkFrom(mode, O.detours)) {
        if (k === 'back') continue;
        const t7 = T.getChord(SEVENTH[m]).ivs, map = O.ext ? extArp(m, t7) : new Map(t7.map((iv) => [semi(iv), iv]));
        const name = `${sym(T.getChord(SEVENTH[m]).sym.trim())}${O.ext ? ', extended' : ''}`;
        const shapes = O.where === 'tour' ? shapesFrom(O.shape) : [O.shape];
        for (const s of shapes) {
          const w = O.where === 'across' ? acrossWin(rootNote, s) : winOf(s);
          list.push(lineStep(m, map, w, 'arpeggio', name, O.where === 'across'));
        }
      }
    }
    if (O.what === 'ladder' || O.what === 'vl') {
      const shape = O.where === 'tour' ? SHAPES[(SHAPES.indexOf(O.shape) + lap) % 5] : O.shape;
      const w = winOf(shape), pos = Gr.positionOf(rootNote, shape);
      const walk = walkFrom(mode, O.detours);
      const vl = O.what === 'vl';
      const chords = vl || O.pChords ? route(rootNote, walk, pos, vl ? O.lane : 'best', { kinds: vl ? { tri: O.vlq === 'tri', sev: O.vlq !== 'tri', ext: false } : { tri: true, sev: true, ext: O.rich }, inv: vl || O.pick === 'best' ? 'one' : 'all' }).steps : [];
      walk.forEach(([m, k], ui) => {
        if (!vl && k !== 'back') {
          if (O.pScale) list.push(lineStep(m, modeMap(m), w, 'scale', `${rootLabel} ${modeName(m)}`, false));
          if (O.pArp) list.push(lineStep(m, extArp(m, T.getChord(SEVENTH[m]).ivs), w, 'arpeggio', `${sym(T.getChord(SEVENTH[m]).sym.trim())}, extended`, false));
        }
        for (const s of chords.filter((x) => x.ui === ui && x.v)) {
          const c2 = { tones: s.q.tones || s.v.notes.map((n) => n.iv), sym: s.q.sym };
          list.push(chordStep(m, s.v, c2, w, k === 'back' ? 'back' : vl ? 'voice leading' : 'chords', { moved: s.moved || [] }));
        }
      });
    }
    list = list.filter(Boolean);
    let k = -1;
    return { list, gen: () => { if (!list.length) return null; k++; if (k >= list.length) { k = 0; if (O.where === 'tour' && (O.what === 'ladder' || O.what === 'vl')) { lap++; const b = build(); list = b.list; } } return list[k]; }, count: list.length };
  }
  let lap = 0;

  // ----- running -----
  let voices = null, lock = null;
  function stopRun() {
    if (!run) return;
    run.alive = false; clearInterval(run.timer); run.timeouts.forEach(clearTimeout);
    V.hush(); if (voices) voices.releaseAll(ctx().currentTime, 1.2);
    if (lock) { lock.release().catch(() => {}); lock = null; }
    run = null;
  }
  async function begin() {
    await A.unlockAudio(); await A.ensureRunning();
    E.setSpace(S.space);
    voices = E.voices(S.inst);
    try { if (navigator.wakeLock) lock = await navigator.wakeLock.request('screen'); } catch (e) { lock = null; }
    lap = 0;
    const src = build();
    run = { alive: true, paused: false, timer: null, timeouts: [], hist: [], back: 0, cur: null, ahead: null, bi: 0, nextT: 0, src, lastMode: null, lastPart: null };
    runScreen();
    if (!src.count) { document.querySelector('#lchord').innerHTML = '<div class="say">Nothing playable here: try another shape, string set, or All voicings.</div>'; return; }
    run.ahead = src.gen();
    run.nextT = ctx().currentTime + 0.15; run.bi = Infinity;
    run.timer = setInterval(pump, 25);
  }
  const later = (t, fn) => { const id = setTimeout(fn, Math.max(0, (t - ctx().currentTime) * 1000)); run.timeouts.push(id); if (run.timeouts.length > 300) run.timeouts.splice(0, 150); };
  function pump() {
    if (!run?.alive || run.paused) return;
    const c = ctx();
    while (run.nextT < c.currentTime + 0.12) { beat(run.nextT); run.nextT += 60 / O.bpm; }
  }
  const lenOf = (s) => (s ? s.beats : O.beats);
  function beat(t) {
    if (run.bi >= lenOf(run.cur)) {
      run.bi = 0;
      if (O.auto || !run.cur) forward(t);
      else if (run.cur.kind === 'line') playStep(run.cur, t);
    }
    const bi = run.bi, len = lenOf(run.cur);
    if (O.click) perc(bi % 4 === 0 ? 'clave' : 'shaker', t, bi === 0 ? 0.9 : bi % 4 === 0 ? 0.6 : 0.8);
    const preview = O.what === 'next' ? (O.next === 'always' ? 'always' : 'beat') : O.next;
    const showNext = run.cur?.kind === 'chord' && run.ahead?.kind === 'chord' && O.auto && (preview === 'always' || (preview === 'beat' && bi === len - 1));
    later(t, () => { drawBeats(bi, len); if (showNext || (preview === 'beat' && bi === 0)) drawNeck(run.cur, showNext ? run.ahead : null); });
    run.bi++;
  }
  // the next step: from history when we've stepped back, else the one queued
  function forward(t) {
    let s;
    if (run.back > 0) { run.back--; s = run.hist[run.hist.length - 1 - run.back]; }
    else { s = run.ahead; run.ahead = run.src.gen(); run.hist.push(s); if (run.hist.length > 400) run.hist.shift(); }
    start(s, t);
  }
  function start(s, t) {
    const prev = run.cur;
    run.cur = s;
    if (!s) return;
    if (voices) voices.cut(t);
    playStep(s, t);
    const lines = [];
    if (s.mode && s.mode !== run.lastMode && (O.what !== 'bounce' && O.what !== 'next' || !run.lastMode)) {
      const p = parentOf(s.mode, T.notePc(T.parseNote(O.root)));
      lines.push([V.scaleWords(BY[s.mode].name)]); if (p) lines.push([p.say]);
    }
    if (s.part !== run.lastPart && PART_SAY[s.part] && O.what !== 'vl') lines.push([PART_SAY[s.part]]);
    if (s.part === 'chord scale run') lines.push([s.inv]); // a new run: which inversion it keeps
    else if (s.part === 'chord scale' && s.say && (s.beats * 60) / O.bpm >= 1.5) lines.push([s.say]);
    else if (s.kind === 'chord' && !lines.length && s.inv && (s.beats * 60) / O.bpm >= 2.4 && ['bounce', 'next', 'dive'].includes(O.what)) lines.push([s.inv]);
    if (O.voice && lines.length) V.say(lines, t + 0.15, { vol: S.vvol * 4 });
    run.lastMode = s.mode; run.lastPart = s.part;
    later(t, () => { drawNeck(s, null, prev); drawInfo(s, prev); });
  }
  function playStep(s, t) {
    if (O.play === 'silent' || !voices) return;
    if (s.kind === 'chord') { const m = s.notes.map((n) => n.midi); voices.set(m, t, O.play === 'arp' ? { arp: Math.min(0.3, 30 / O.bpm / m.length) } : { stagger: 0.03 }); return; }
    const e = 30 / O.bpm;
    s.notes.forEach((n, i) => {
      voices.set([n.midi], t + i * e, { vel: i === 0 || n.iv === '1' ? 1.15 : 0.95 });
      later(t + i * e, () => { if (run?.cur === s) drawNeck(s, null, null, i); });
    });
  }
  // manual steps: they sound and show now, and the beat count starts again
  function step(dir) {
    if (!run?.alive) return;
    run.timeouts.forEach(clearTimeout); run.timeouts = [];
    const t = ctx().currentTime + 0.04;
    if (dir < 0) { if (run.hist.length - 1 - run.back <= 0) return; run.back++; start(run.hist[run.hist.length - 1 - run.back], t); }
    else forward(t);
    run.bi = 1; run.nextT = t + 60 / O.bpm;
    drawBeats(0, lenOf(run.cur));
  }

  // ----- drawing -----
  function ghosts(s) {
    if (O.ghost === 'off' || !s) return [];
    const rootPc = T.notePc(T.parseNote(O.root));
    if (O.ghost === 'near') {
      // around the voicing: its strings and one either side, two frets either way
      if (s.kind !== 'chord') return [];
      const base = s.chordRoot ?? rootPc, near = nearby(base, s.notes.map((n) => n.iv), s.mode, rootPc);
      const fr = s.notes.filter((n) => n.fret > 0).map((n) => n.fret), ss = s.notes.map((n) => n.string);
      const lo = Math.max(0, (fr.length ? Math.min(...fr) : 1) - 2), hi = Math.min(15, (fr.length ? Math.max(...fr) : 2) + 2);
      const out = [];
      for (let st = Math.min(6, Math.max(...ss) + 1); st >= Math.max(1, Math.min(...ss) - 1); st--) for (let f = lo; f <= hi; f++) {
        const x = near.get(((openOf(st) + f - base) % 12 + 12) % 12);
        if (x) out.push({ string: st, fret: f, label: degText(x.iv), kind: x.avoid ? 'q' : 'tx', ghost: !x.avoid, avoid: x.avoid });
      }
      return out;
    }
    const tones = s.kind === 'chord' ? s.notes.map((n) => n.iv) : chordOf(O.mode || null, O.chord).tones;
    const own = s.chordRoot != null && O.ghost === 'arp';
    const base = own ? s.chordRoot : rootPc;
    const map = own ? new Map(tones.map((iv) => [semi(iv), iv])) : O.ghost === 'mode' ? modeMap(s.mode, tones) : extArp(s.mode, s.kind === 'chord' ? tones : s.mode ? T.getChord(SEVENTH[s.mode]).ivs : tones);
    let w = O.ghostArea === 'neck' ? { lo: 0, hi: 15 } : s.win && s.win.hi - s.win.lo < 12 ? s.win : null;
    if (!w) { const fr = s.notes.map((n) => n.fret); w = { lo: Math.max(0, Math.min(...fr) - 2), hi: Math.min(15, Math.max(...fr) + 2) }; }
    const out = [];
    for (let st = 6; st >= 1; st--) for (let f = Math.max(0, w.lo); f <= w.hi; f++) {
      const iv = map.get(((openOf(st) + f - base) % 12 + 12) % 12);
      if (!iv) continue;
      const lab = O.ghost === 'arp' ? asExt(iv) : iv;
      out.push({ string: st, fret: f, label: degText(lab), kind: KIND(asExt(iv)), ghost: true });
    }
    return out;
  }
  function drawNeck(s, next = null, prev = null, playing = -1) {
    const el = document.querySelector('#lneck');
    if (!el || !s) return;
    const at = new Set(s.notes.map((n) => `${n.string}:${n.fret}`));
    const g = ghosts(s).filter((n) => !at.has(`${n.string}:${n.fret}`));
    const lab = (iv) => degText(s.part === 'extended' || s.part === 'arpeggio' ? asExt(iv) : iv);
    let cur;
    if (s.kind === 'line') {
      const seen = new Set();
      cur = s.notes.filter((n) => { const k = `${n.string}:${n.fret}`; if (seen.has(k)) return false; seen.add(k); return true; })
        .map((n) => ({ ...n, label: lab(n.iv), kind: KIND(asExt(n.iv)), spot: playing >= 0 && s.notes[playing].string === n.string && s.notes[playing].fret === n.fret, fresh: playing >= 0 && s.notes[playing].string === n.string && s.notes[playing].fret === n.fret }));
    } else {
      cur = s.notes.map((n) => ({ ...n, label: degText(n.iv), kind: KIND(n.iv), fresh: prev && prev.kind === 'chord' ? !prev.notes.some((x) => x.midi === n.midi) : false }));
    }
    const nx = next ? next.notes.filter((n) => !at.has(`${n.string}:${n.fret}`)).map((n) => ({ ...n, label: degText(n.iv), kind: KIND(n.iv), nextv: true })) : [];
    const band = s.win && s.win.hi - s.win.lo < 15 ? [s.win.lo, s.win.hi] : null;
    el.innerHTML = neckSVG([...g, ...cur, ...nx], { band });
  }
  function drawInfo(s, prev) {
    const rootPc = T.notePc(T.parseNote(O.root));
    const p = s.mode ? parentOf(s.mode, rootPc) : null;
    const mh = document.querySelector('#lmode');
    if (mh) mh.innerHTML = s.mode ? `<div class="lm">${esc(modeName(s.mode))}</div><div class="lp">${esc(p?.text || '')}</div><div class="lr">${esc(placeText(s.mode))}</div>` : '<div class="lp">No particular mode</div>';
    const el = document.querySelector('#lchord');
    if (!el) return;
    const partName = { 'new set': 'New string set', 'chord scale': 'Chord scale', 'chord scale run': 'Chord scale · new run', arpeggio: 'Arpeggio', extended: 'Extended arpeggio', scale: 'Scale', inversions: 'Inversions', richer: 'The mode’s richer chords', chords: 'Chords', back: 'Back to the rung', 'voice leading': 'Voice leading' }[s.part] || '';
    const head = [partName, s.win?.label ? cap(s.win.label) : ''].filter(Boolean).join(' · ');
    if (s.kind === 'line') {
      const ivs = [...new Set(s.notes.map((n) => (s.part === 'scale' ? n.iv : asExt(n.iv))))];
      el.innerHTML = `<div class="lpart">${esc(head)}</div><div class="sym">${fmt(s.title)}</div><div class="say">${ivs.map((iv) => degText(iv)).join(' · ')}</div>`;
      document.querySelector('#lstack').innerHTML = '';
      document.querySelector('#lmoved').innerHTML = s.part !== 'scale' && s.mode && ULT_INFO[s.mode]?.avoid?.length ? `<p>Avoid: ${ULT_INFO[s.mode].avoid.map(degText).join(', ')}</p>` : '';
      return;
    }
    const root = s.chordNote || T.parseNote(O.root);
    el.innerHTML = `<div class="lpart">${esc(head)}</div>${s.rn ? `<div class="rn">${esc(s.rn)}</div>` : ''}<div class="sym">${fmt(s.title)}</div><div class="say">${esc(s.inv ? cap(s.inv) : '')}</div>`;
    document.querySelector('#lstack').innerHTML = `<ol>${[...s.notes].sort((a, b) => b.midi - a.midi).map((n) => `<li class="k-${KIND(n.iv)}${prev && prev.kind === 'chord' && !prev.notes.some((x) => x.midi === n.midi) ? ' fresh' : ''}"><i></i><b>${degText(n.iv)}</b><span>${fmt(T.noteName(T.transpose(root, F.simpleIv(n.iv)), true))} · string ${n.string}, fret ${n.fret}</span></li>`).join('')}</ol><div class="exl">${esc(s.set || '')}</div>`;
    let aware = '';
    if (O.ghost === 'near') {
      const near = [...nearby(s.chordRoot ?? T.notePc(T.parseNote(O.root)), s.notes.map((n) => n.iv), s.mode, T.notePc(T.parseNote(O.root))).values()];
      const ok = near.filter((x) => !x.avoid).map((x) => degText(x.iv)), bad = near.filter((x) => x.avoid).map((x) => degText(x.iv));
      aware = `<div class="aware">${ok.length ? `<span>Nearby: <b>${ok.join(' · ')}</b></span>` : ''}${bad.length ? `<span class="bad">Careful: <b>${bad.join(' · ')}</b></span>` : ''}</div>`;
    }
    document.querySelector('#lmoved').innerHTML = aware + (s.moved || []).map((m) => `<p>${fmt(m)}</p>`).join('');
  }
  function drawBeats(bi, len) {
    const el = document.querySelector('#lbeats');
    if (!el) return;
    const bar = Math.floor(bi / 4), bars = Math.ceil(len / 4), inBar = Math.min(4, len - bar * 4);
    el.innerHTML = `${Array.from({ length: inBar }, (_, i) => `<i class="${i === bi % 4 ? 'on' : ''}${i === 0 ? ' one' : ''}"></i>`).join('')}${bars > 1 ? `<span>bar ${bar + 1} of ${bars}</span>` : ''}`;
  }
  function runScreen() {
    app.innerHTML = `
    <header class="bar run"><button class="icon" data-l="stop" aria-label="Stop">✕</button><h2>Ladder</h2><button class="icon" data-l="pause" aria-label="Hold">❚❚</button></header>
    <main class="stage">
      <div class="neckcol" id="lneck">${neckSVG([])}</div>
      <div class="info">
        <div id="lmode" class="lmode"></div>
        <div class="chord" id="lchord"><div class="sym">…</div></div>
        <div id="lbeats" class="lbeats"></div>
        <div id="lstack" class="stack"></div>
        <div id="lmoved" class="caption"></div>
      </div>
    </main>
    <div class="transport ltrans">
      <button data-l="prev" aria-label="Back"><b>‹</b><small>back</small></button>
      <button data-l="cycGhost"><b>◌</b><small id="lgh">${GHOST_NAME[O.ghost]}</small></button>
      <button data-l="togAuto" class="${O.auto ? 'on' : ''}"><b>↻</b><small>${O.auto ? 'auto' : 'by hand'}</small></button>
      <button data-l="togClick" class="${O.click ? 'on' : ''}"><b>♩</b><small>click</small></button>
      <button data-l="next" aria-label="Next"><b>›</b><small>next</small></button>
    </div>
    <footer class="runbar"><button data-l="slower">−</button><span id="lbpm">${O.bpm} bpm</span><button data-l="faster">+</button><span class="instname">${E.INSTRUMENTS.find((i) => i.id === S.inst).name}</span></footer>`;
  }

  // ----- events -----
  const parse = (k, v) => (typeof DEF_L[k] === 'number' ? Number(v) : typeof DEF_L[k] === 'boolean' ? v === 'true' : v);
  app.onclick = async (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    if (b.dataset.set) { setTimeout(() => { if (!run) setup(); }, 0); return; } // the sound card (app handles the value)
    const a = b.dataset.l;
    if (!a) return;
    if (a === 'back') { stopRun(); app.onclick = null; app.onchange = null; app.oninput = null; back(); return; }
    if (a === 'begin') { await begin(); window.scrollTo(0, 0); return; }
    if (a === 'stop') { stopRun(); setup(); return; }
    if (a === 'pause' && run) {
      run.paused = !run.paused; b.textContent = run.paused ? '▶' : '❚❚'; b.classList.toggle('on', run.paused);
      if (run.paused) { run.timeouts.forEach(clearTimeout); run.timeouts = []; if (voices) voices.cut(ctx().currentTime + 0.02); }
      else run.nextT = ctx().currentTime + 0.1;
      return;
    }
    if (a === 'next') { step(1); return; }
    if (a === 'prev') { step(-1); return; }
    if (a === 'cycGhost') { O.ghost = { off: 'mode', mode: 'arp', arp: 'near', near: 'off' }[O.ghost] || 'off'; save(); document.querySelector('#lgh').textContent = GHOST_NAME[O.ghost]; if (run?.cur) { drawNeck(run.cur); drawInfo(run.cur, null); } return; }
    if (a === 'togAuto') { O.auto = !O.auto; save(); b.classList.toggle('on', O.auto); b.querySelector('small').textContent = O.auto ? 'auto' : 'by hand'; return; }
    if (a === 'togClick') { O.click = !O.click; save(); b.classList.toggle('on', O.click); return; }
    if (a === 'slower' || a === 'faster') { O.bpm = Math.max(40, Math.min(200, O.bpm + (a === 'faster' ? 4 : -4))); save(); document.querySelector('#lbpm').textContent = `${O.bpm} bpm`; return; }
    if (b.dataset.v !== undefined && a in DEF_L) { O[a] = parse(a, b.dataset.v); O.drill = null; save(); const y = window.scrollY; setup(); window.scrollTo(0, y); }
  };
  app.onchange = (e) => {
    const k = e.target.dataset.lsel;
    if (!k) return;
    const d = k === 'what' ? DRILLS.find(([id]) => id === e.target.value) : null;
    if (d) { Object.assign(O, d[3]); O.drill = d[0]; if (!O.mode) O.mode = 'ionian'; }
    else { O[k] = parse(k, e.target.value); O.drill = null; }
    save();
    const y = window.scrollY; setup(); window.scrollTo(0, y);
  };
  app.oninput = (e) => {
    if (e.target.dataset.lsel !== 'bpm') return;
    O.bpm = Number(e.target.value); save();
    const out = e.target.parentElement.querySelector('output'); if (out) out.textContent = `${O.bpm} bpm`;
  };
  setup();
  window.scrollTo(0, 0);
}

const GHOST_NAME = { off: 'no ghosts', mode: 'mode', arp: 'arpeggio', near: 'nearby' };
const PART_SAY = { scale: 'The scale.', arpeggio: 'The arpeggio.', extended: 'The extended arpeggio.', inversions: 'The inversions.', richer: 'Richer chords.', chords: 'The chords.' };
export function allPhrases() {
  const out = new Set([...INV_NAMES, ...Object.values(PART_SAY), DIM_SAY]);
  for (const s of Object.values(SYS)) for (let d = 1; d <= 7; d++) out.add(`the ${ORD_W[d]} mode of ${s.say}`);
  for (const tones of [['b9', '9', '#9', '11', '#11', 'b13', '13', '2', '4', '6', 'b6', 'b2', '3', 'b3', '7', 'b7', 'bb7', '5', 'b5', '#5']]) for (const iv of tones) out.add(`the ${degWord(iv)} in the bass`);
  for (const m of LADDER_MODES) { out.add(V.scaleWords(BY[m].name)); for (const z of [3, 4]) for (const c of chordScale(m, T.parseNote('C'), z)) if (c.say) out.add(c.say); }
  return [...out];
}
