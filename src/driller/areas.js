// Where on the neck: one CAGED shape (the window round that chord shape's roots), two neighbouring shapes, the whole
// neck, or three notes per string. Each position gives the scale's notes in that window and a playing path (low to
// high, one note per pitch) that the practice patterns run over.
import * as T from '../theory.js';
import * as F from '../fretboard.js';
import * as G from '../caged/grips.js';
import { BY, ivsOf, semi } from './data.js';

export const AREAS = [
  ['caged', 'One CAGED shape'],
  ['pair', 'Two shapes joined'],
  ['nps3', '3 notes per string'],
  ['neck', 'Whole neck'],
];
export const AREA_NAME = Object.fromEntries(AREAS);
const KEYS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
export const NECK_TOP = 15;

// the root name that spells the scale most cleanly (F♯ Lydian, not G♭ Lydian)
export function spell(pc, id) {
  const opts = [...new Set([KEYS[pc], T.noteName(T.enharmonic(T.parseNote(KEYS[pc])))])];
  let best = opts[0], cost = Infinity;
  for (const nm of opts) {
    const r = T.parseNote(nm);
    const c = BY[id].ivs.reduce((s, iv) => { const n = T.transpose(r, F.simpleIv(iv)); return s + Math.abs(n.acc) * (Math.abs(n.acc) > 1 ? 4 : 1); }, 0) + (nm.length > 1 ? 0.5 : 0);
    if (c < cost) { cost = c; best = nm; }
  }
  return T.parseNote(best);
}

// every position of an area type: [{ title, short, sub, notes, path, win }]
export const positions = (id, pc, type) => positionsIvs(ivsOf(id), pc, type, spell(pc, id));
// the same for any set of intervals (a chord's tones) on a given root
export function positionsIvs(ivs, pc, type, root) {
  const bySemi = new Map(); ivs.forEach((iv) => { if (!bySemi.has(semi(iv))) bySemi.set(semi(iv), iv); });
  const rel = (m) => ((m - pc) % 12 + 12) % 12;
  const at = (s, f) => { const m = F.OPEN[s] + f; return bySemi.has(rel(m)) ? { string: s, fret: f, midi: m, iv: bySemi.get(rel(m)) } : null; };
  const inWin = (lo, hi) => { const out = []; for (let s = 6; s >= 1; s--) for (let f = lo; f <= hi; f++) { const n = at(s, f); if (n) out.push(n); } return out; };
  const pathOf = (notes) => { const seen = new Set(); return [...notes].sort((a, b) => a.midi - b.midi || b.string - a.string).filter((n) => (seen.has(n.midi) ? false : seen.add(n.midi))); };
  const sorted = [...bySemi.keys()].sort((a, b) => a - b);
  // k notes per string from scale step d on the low E
  const climb = (k, d) => {
    let f0 = ((pc + sorted[d] - 4) % 12 + 12) % 12;
    const seq = [];
    for (let m = 40 + f0; m <= 40 + f0 + 60; m++) if (bySemi.has(rel(m))) seq.push(m);
    const out = []; let i = 0;
    for (let s = 6; s >= 1; s--) for (let j = 0; j < k && i < seq.length; j++, i++) out.push({ string: s, fret: seq[i] - F.OPEN[s], midi: seq[i], iv: bySemi.get(rel(seq[i])) });
    if (out.some((n) => n.fret < 0)) { out.forEach((n) => { n.fret += 12; n.midi += 12; }); f0 += 12; }
    return { notes: out, f0 };
  };
  let list = [];
  if (type === 'caged' || type === 'pair') {
    for (const sh of G.SHAPES) {
      let w = type === 'caged' ? F.cagedWindow(root, sh) : G.positionOfPair(root, sh);
      w = { lo: Math.max(0, w.lo), hi: w.hi };
      if (w.hi > 17 && w.lo - 12 >= 0) w = { lo: w.lo - 12, hi: w.hi - 12 };
      const notes = inWin(w.lo, w.hi);
      const short = type === 'caged' ? sh : `${sh}+${G.nextShape(sh)}`;
      list.push({ title: type === 'caged' ? `${sh} shape` : `${sh} and ${G.nextShape(sh)} shapes`, short, sub: `frets ${w.lo}–${w.hi}`, notes, path: pathOf(notes), win: w });
    }
    list.sort((a, b) => a.win.lo - b.win.lo);
  } else if (type === 'nps3') {
    list = sorted.map((s, d) => {
      const c = climb(3, d);
      return { title: `3 per string from the ${T.prettyIv(bySemi.get(s))}`, short: T.prettyIv(bySemi.get(s)), sub: c.f0 ? `starts fret ${c.f0}, low E` : 'starts on the open low E', notes: c.notes, path: c.notes, f0: c.f0 };
    }).filter((p) => Math.max(...p.notes.map((n) => n.fret)) <= 19).sort((a, b) => a.f0 - b.f0);
    list.forEach((p, i) => { p.short = String(i + 1); p.title = `Pattern ${i + 1}, from the ${p.title.split('the ')[1]}`; });
  } else {
    const notes = inWin(0, NECK_TOP);
    // the guide runs one long diagonal: three per string from the lowest root on the low E
    const r0 = sorted.indexOf(0);
    const c = climb(3, r0 < 0 ? 0 : r0);
    list.push({ title: 'Whole neck', short: 'All', sub: `frets 0–${NECK_TOP}; drills run a 3-per-string diagonal from the root`, notes, path: c.notes, whole: true });
  }
  for (const p of list) {
    const fr = p.notes.map((n) => n.fret);
    if (!p.win) p.win = { lo: Math.min(...fr), hi: Math.max(...fr) };
    p.top = Math.max(...fr, ...p.path.map((n) => n.fret));
  }
  return { root, list };
}

// the neck spot nearest an area for a pitch (used to place number lines): inside the window if possible
export function placePitch(midi, area, prefer = null) {
  const opts = [];
  for (let s = 6; s >= 1; s--) { const f = midi - F.OPEN[s]; if (f >= 0 && f <= 19) opts.push({ string: s, fret: f, midi }); }
  if (!opts.length) return null;
  const { lo, hi } = area.win;
  const inArea = (o) => area.notes.some((n) => n.string === o.string && n.fret === o.fret);
  const cost = (o) => (inArea(o) ? 0 : 10 + Math.max(0, lo - o.fret, o.fret - hi) * 3) + (prefer ? Math.abs(o.fret - prefer.fret) * 0.3 + Math.abs(o.string - prefer.string) * 0.2 : 0);
  return opts.sort((a, b) => cost(a) - cost(b))[0];
}
