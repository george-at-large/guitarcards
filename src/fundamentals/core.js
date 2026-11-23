// Fundamentals core: saved progress (items, keys, scores), weighted key choice, spelling, labels.
// An "item" is the thing being learned apart from the key ("m7 drop 2 on 4-3-2-1, up the neck"); keys are tracked
// on their own, so a weak key shows up whatever the drill.
import * as T from '../theory.js';
import { simpleIv } from '../fretboard.js';

// ---------- keys ----------
// tonic pitch classes, most used first (the jazz keys bumped, owner's decision 2026-11-23)
export const KEY_ORDER = [4, 9, 7, 2, 0, 5, 10, 3, 8, 11, 1, 6];
export const DEFAULT_WEIGHTS = { 4: 5, 9: 5, 7: 5, 2: 5, 0: 5, 5: 5, 10: 5, 3: 5, 8: 3, 11: 3, 1: 3, 6: 2 };
const FLAT = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
const SHARP = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const PREF = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
export const keyLabel = (pc) => (pc === 6 ? 'F♯/G♭' : T.pretty(PREF[pc]));

// the spelling of a pitch class that gives these notes the fewest accidentals (ties go to the usual name)
function bestSpelling(pc, notesFor) {
  let best = null, bestScore = Infinity;
  for (const name of new Set([FLAT[pc], SHARP[pc], PREF[pc]])) {
    let notes;
    try { notes = notesFor(name); } catch (e) { continue; }
    const score = notes.reduce((s, n) => s + Math.abs(n.acc) + (Math.abs(n.acc) > 1 ? 4 : 0), 0) + (name === PREF[pc] ? 0 : 0.1);
    if (score < bestScore) { bestScore = score; best = name; }
  }
  return T.parseNote(best || PREF[pc]);
}
export const spellTonic = (pc, scaleId = 'major') => bestSpelling(pc, (n) => T.scaleNotes(n, scaleId));
export const spellRoot = (pc, quality = 'maj') => bestSpelling(pc, (n) => T.chordNotes(n, quality));
export const nn = (note) => T.noteName(note, true);
export const sym = (root, q) => T.chordSymbol(root, q);

// ---------- store ----------
const KEY = 'fundamentals.v1';
const blank = () => ({ weights: { ...DEFAULT_WEIGHTS }, setups: {}, items: {}, keys: {}, best: {}, days: {}, sessions: [] });
let S;
try { S = { ...blank(), ...JSON.parse(localStorage.getItem(KEY) || '{}') }; } catch (e) { S = blank(); }
export const state = () => S;
export function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* private mode */ } }
export function resetProgress() { const w = S.weights, setups = S.setups; S = { ...blank(), weights: w, setups }; save(); }
export const today = () => new Date().toLocaleDateString('en-CA');

// record one answer. fuzz: 0 clean, 0.5 half (needed a hint), 1 revealed or wrong
export function record(item, { clean, fuzz = clean ? 0 : 1, keyPc = null }) {
  const r = S.items[item.id] || (S.items[item.id] = { n: 0, clean: 0, miss: 0, fuzzy: false, cleanDays: [], last: 0, ema: 0.6 });
  Object.assign(r, { mode: item.mode, label: item.label, params: item.params });
  r.n++; r.last = Date.now();
  let change = null;
  if (clean) {
    r.clean++; r.ema = r.ema * 0.6 + 0.4;
    if (r.fuzzy) {
      const d = today();
      if (!r.cleanDays.includes(d)) r.cleanDays.push(d);
      if (r.cleanDays.length >= 3) { r.fuzzy = false; r.cleanDays = []; change = 'cleared'; }
    }
  } else {
    r.miss++; r.ema = r.ema * 0.6 + 0.4 * (1 - fuzz) * 0.5;
    if (!r.fuzzy) change = 'fuzzy';
    r.fuzzy = true; r.cleanDays = [];
  }
  if (keyPc != null) {
    const k = S.keys[keyPc] || (S.keys[keyPc] = { n: 0, ema: 0.8 });
    k.n++; k.ema = k.ema * 0.75 + 0.25 * (clean ? 1 : 0);
  }
  save();
  return change;
}
export const itemRec = (id) => S.items[id];
export const isFuzzy = (id) => !!S.items[id]?.fuzzy;
export function fuzzyItems(mode = null) {
  return Object.entries(S.items).filter(([, r]) => r.fuzzy && (!mode || r.mode === mode))
    .map(([id, r]) => ({ id, ...r })).sort((a, b) => a.ema - b.ema);
}
export const weakKeys = () => KEY_ORDER.filter((pc) => S.keys[pc] && S.keys[pc].n >= 3 && S.keys[pc].ema < 0.7);

// ---------- picking ----------
export function weighted(list, w) {
  const ws = list.map(w);
  let t = ws.reduce((a, b) => a + b, 0) * Math.random();
  for (let i = 0; i < list.length; i++) { t -= ws[i]; if (t <= 0) return list[i]; }
  return list[list.length - 1];
}
export const pick = (list) => list[Math.floor(Math.random() * list.length)];
export const shuffle = (list) => { const a = [...list]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
// a key by weight, raised for keys that keep needing reveals, and not the same as last time
export function pickKeyPc(avoid = null) {
  const pcs = KEY_ORDER.filter((pc) => (S.weights[pc] ?? 0) > 0 && pc !== avoid);
  if (!pcs.length) return pick(KEY_ORDER);
  return weighted(pcs, (pc) => S.weights[pc] * (1 + 1.5 * (1 - (S.keys[pc]?.ema ?? 0.8))));
}
// an item by weight: fuzzy ones and new ones come up more, the last few asked come up less
// when items carry a group (triads up the neck, arpeggios in an area…), a group is chosen first, so a big family
// doesn't crowd out a small one
export function pickItem(pool, recent = []) {
  let fresh = pool.length > 4 ? pool.filter((it) => !recent.includes(it.id)) : pool;
  if (!fresh.length) fresh = pool;
  const groups = [...new Set(fresh.map((it) => it.group).filter(Boolean))];
  if (groups.length > 1) {
    const g = weighted(groups, (g) => 1 + 2 * fresh.filter((it) => it.group === g && S.items[it.id]?.fuzzy).length / fresh.filter((it) => it.group === g).length);
    fresh = fresh.filter((it) => it.group === g);
  }
  return weighted(fresh, (it) => {
    const r = S.items[it.id];
    return 1 + (r?.fuzzy ? 2.5 : 0) + (r ? 0 : 0.5) + (r ? (1 - r.ema) : 0);
  });
}

// ---------- labels ----------
export const iv = (x) => T.prettyIv(x);
export function role(ivName) {
  if (simpleIv(ivName) === '1') return 'r';
  if (['3', 'b3'].includes(ivName) || ['10', 'b10'].includes(ivName)) return 't';
  if (['5', 'b5', '#5'].includes(ivName)) return 'f';
  if (['7', 'b7', 'bb7'].includes(ivName)) return 's';
  return 'x';
}
export const ordinal = (n) => n + ({ 1: 'st', 2: 'nd', 3: 'rd' }[n] || 'th');
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
const MAJ_SEMIS = [0, 2, 4, 5, 7, 9, 11];
// Roman numeral relative to the major scale: ♭III, ivm7 → iv7 style, with the quality's suffix
export function roman(deg, semisFromTonic, quality) {
  const d = semisFromTonic - MAJ_SEMIS[deg];
  const acc = d === -1 ? '♭' : d === 1 ? '♯' : d === -2 ? '𝄫' : '';
  const minor = ['min', 'dim', 'm7', 'm7b5', 'dim7', 'mMaj7', 'm6'].includes(quality);
  const base = minor ? ROMAN[deg].toLowerCase() : ROMAN[deg];
  const suf = { maj: '', min: '', dim: '°', aug: '+', maj7: 'maj7', '7': '7', m7: '7', m7b5: 'ø7', dim7: '°7', mMaj7: '(maj7)', 'maj7#5': '+maj7', '7#5': '+7', m6: '6', '6': '6' }[quality] ?? '';
  return acc + base + suf;
}
export const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
