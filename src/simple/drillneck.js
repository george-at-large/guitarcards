// Fluency drills on the neck: each drill card describes its pattern as a small spec, and this turns it into the notes
// to show (with degree labels) and the order to play them in, one event per subdivision. Scales come from the Scales
// page’s positions; sequences (3rds, groups of 3 and 4, 4ths, 6ths, the sawtooth, triads, 7ths, 1-2-3-5) are applied
// to the position’s notes low to high, then the same pattern coming back down.
import * as T from '../theory.js';
import * as F from '../fretboard.js';
import { positions } from './scales.js';

const OPEN = F.OPEN;
const KEYS = { C: 0, 'C#': 1, Db: 1, D: 2, Eb: 3, E: 4, F: 5, 'F#': 6, Gb: 6, G: 7, Ab: 8, A: 9, Bb: 10, B: 11 };
const semi = (iv) => T.intervalSemis(F.simpleIv(iv)) % 12;
const note = (s, f, iv) => ({ string: s, fret: f, midi: OPEN[s] + f, iv });

// a sequence: which notes of the ascending list each step plays, as offsets from i
export const SEQS = {
  up: { cell: [0], name: 'straight' },
  thirds: { cell: [0, 2], name: '3rds: 1-3, 2-4, 3-5' },
  broken3: { cell: [0, 2], alt: true, name: 'broken 3rds: 1-3, 4-2, 3-5' },
  g3: { cell: [0, 1, 2], name: 'groups of 3' },
  g4: { cell: [0, 1, 2, 3], name: 'groups of 4' },
  fourths: { cell: [0, 3], name: '4ths' },
  sixths: { cell: [0, 5], name: '6ths' },
  saw: { cell: [0, 2, 3, 1], name: 'the sawtooth: 1-3-4-2' },
  up3down: { cell: [0, 2, 1], name: '1-3-2' },
  triads: { cell: [0, 2, 4], name: 'triads' },
  sevenths: { cell: [0, 2, 4, 6], name: '7th arpeggios' },
  sevalt: { cell: [0, 2, 4, 6], alt: true, name: '7ths, alternating up and down' },
  digital: { cell: [0, 1, 2, 4], name: '1-2-3-5' },
};
function sequence(asc, seq, back = true) {
  const s = SEQS[seq] || SEQS.up, span = Math.max(...s.cell), out = [];
  const run = (list) => { for (let i = 0; i + span < list.length; i++) { let c = s.cell.map((k) => list[i + k]); if (s.alt && i % 2) c = c.reverse(); out.push(...c.map((n) => [n])); } };
  run(asc);
  if (back) { const desc = [...asc].reverse(); if (seq === 'up') out.push(...desc.slice(1).map((n) => [n])); else run(desc); }
  return out;
}
// the scale position nearest a fret
function scalePos(id, pc, fam, near = 5) {
  const { list } = positions(id, pc, fam);
  const lo = (p) => Math.min(...p.notes.map((n) => n.fret));
  return list.reduce((a, b) => (Math.abs(lo(a) - near) <= Math.abs(lo(b) - near) ? a : b));
}
const byPitch = (a, b) => a.midi - b.midi || b.string - a.string;
const uniq = (notes) => { const seen = new Set(); return [...notes].sort(byPitch).filter((n) => (seen.has(n.midi) ? false : seen.add(n.midi))); };

// an arpeggio climbing diagonally from the root on the 6th string, k notes a string, up to `count` notes
function arpClimb(ivs, pc, k = 2, count = 13) {
  const pcs = new Map(ivs.map((iv) => [semi(iv), iv]));
  let low = 6, f0 = ((pc - 4) % 12 + 12) % 12;
  if (f0 > 7) { low = 5; f0 = ((pc - 9) % 12 + 12) % 12; } // C on the low E is fret 8: start from the A string
  const seq = [];
  for (let m = OPEN[low] + f0; seq.length < count && m < OPEN[low] + f0 + 50; m++) if (pcs.has(((m - pc) % 12 + 12) % 12)) seq.push(m);
  const out = []; let i = 0;
  for (let s = low; s >= 1 && i < seq.length; s--) for (let j = 0; j < k && i < seq.length; j++, i++) out.push(note(s, seq[i] - OPEN[s], pcs.get(((seq[i] - pc) % 12 + 12) % 12)));
  // the top string takes whatever is left
  while (i < seq.length) { out.push(note(1, seq[i] - OPEN[1], pcs.get(((seq[i] - pc) % 12 + 12) % 12))); i++; }
  return out;
}

// spec → { dots: the notes to draw, events: [[notes sounding together], …], name }
export function drillPattern(spec) {
  const pc = KEYS[spec.key ?? 'C'];
  if (spec.kind === 'chromatic') {
    const f0 = spec.from ?? 1, up = [];
    for (let s = 6; s >= 1; s--) for (let j = 0; j < 4; j++) up.push(note(s, f0 + j, String(j + 1)));
    const ev = [...up, ...[...up].reverse().slice(1)].map((n) => [n]);
    return { dots: up, events: ev, labels: 'finger' };
  }
  if (spec.kind === 'scale') {
    const p = spec.pos != null ? positions(spec.id, pc, spec.fam).list[spec.pos] : scalePos(spec.id, pc, spec.fam || 'caged', spec.near);
    let asc = spec.fam === 'one' || spec.fam === 'two' ? p.path : uniq(p.notes);
    if (spec.fromRoot) { // from the lowest root to the top of the position
      const i = asc.findIndex((n) => n.iv === '1');
      if (i > 0) asc = asc.slice(i);
    }
    let ev;
    if (spec.from === 'top') { // start on the top chord tone and run down
      const top = [...asc].reverse().findIndex((n) => spec.ct.includes(n.iv));
      ev = [...asc].reverse().slice(top).map((n) => [n]);
    } else ev = sequence(asc, spec.seq || 'up', spec.back !== false);
    return { dots: p.notes, events: ev };
  }
  if (spec.kind === 'ladder') { // pentatonic boxes: up one, down the next
    const { list } = positions(spec.id, pc, 'box');
    const boxes = list.filter((b) => Math.min(...b.notes.map((n) => n.fret)) >= (spec.from ?? 4)).slice(0, 5);
    const ev = [];
    boxes.forEach((b, i) => { const asc = uniq(b.notes); (i % 2 ? [...asc].reverse() : asc).forEach((n) => ev.push([n])); });
    return { dots: boxes.flatMap((b) => b.notes), events: ev };
  }
  if (spec.kind === 'arp') {
    const up = arpClimb(spec.ivs, pc, spec.k ?? 2, spec.count ?? 13);
    return { dots: up, events: [...up, ...[...up].reverse().slice(1)].map((n) => [n]) };
  }
  if (spec.kind === 'arpstarts') { // one position: the chord tones, up from each in turn
    const p = scalePos(spec.id, pc, 'caged', spec.near);
    const tones = uniq(p.notes).filter((n) => spec.ct.includes(n.iv));
    const ev = [];
    for (const start of spec.ct) { const i = tones.findIndex((n) => n.iv === start); if (i < 0) continue; tones.slice(i, i + 5).forEach((n) => ev.push([n])); }
    return { dots: tones, events: ev };
  }
  if (spec.kind === 'enclose') { // above, half step below, target
    const p = scalePos(spec.id, pc, 'caged', spec.near);
    const asc = uniq(p.notes), ev = [];
    asc.forEach((t, i) => {
      if (!spec.ct.includes(t.iv) || i === 0 || i === asc.length - 1) return;
      const above = asc[i + 1], below = t.fret > 0 ? note(t.string, t.fret - 1, '') : null;
      if (below) ev.push([above], [below], [t]);
    });
    return { dots: p.notes, events: ev };
  }
  if (spec.kind === 'triads') { // close triads up one string set
    const [a, b, c] = spec.set, q = T.getChord(spec.q || 'maj').ivs.map(semi);
    const shapes = [];
    for (let f = 0; f <= 14; f++) for (let g = Math.max(0, f - 4); g <= f + 4; g++) for (let h = Math.max(0, f - 4); h <= f + 4; h++) {
      const ms = [OPEN[a] + f, OPEN[b] + g, OPEN[c] + h];
      if (!(ms[0] < ms[1] && ms[1] < ms[2]) || ms[2] - ms[0] > 12) continue;
      const rel = ms.map((m) => ((m - pc) % 12 + 12) % 12);
      if (new Set(rel).size !== 3 || !q.every((x) => rel.includes(x))) continue;
      const fr = [f, g, h];
      if (Math.max(...fr) - Math.min(...fr) > 3) continue;
      const ivOf = (r) => ['1', '3', '5'][q.indexOf(r)] || '';
      shapes.push([note(a, f, ivOf(rel[0])), note(b, g, ivOf(rel[1])), note(c, h, ivOf(rel[2]))]);
    }
    shapes.sort((x, y) => x[0].midi - y[0].midi);
    const up = shapes.filter((s, i) => !i || s[0].midi !== shapes[i - 1][0].midi);
    return { dots: up.flat(), events: [...up, ...[...up].reverse().slice(1)] };
  }
  if (spec.kind === 'keys') { // one window, round the keys by 4ths: each key’s notes inside it, low to high
    const ev = [], dots = [];
    for (const k of spec.keys) {
      const kp = KEYS[k], m = T.getScale('major').ivs.map(semi);
      const inWin = [];
      for (let s = 6; s >= 1; s--) for (let f = spec.lo; f <= spec.hi; f++) { const r = ((OPEN[s] + f - kp) % 12 + 12) % 12; if (m.includes(r)) inWin.push(note(s, f, T.getScale('major').ivs[m.indexOf(r)])); }
      const asc = uniq(inWin);
      asc.forEach((n) => { const e = [n]; e.dots = inWin; e.key = k; ev.push(e); });
      if (!dots.length) dots.push(...inWin);
    }
    return { dots, events: ev, perKey: true };
  }
  return { dots: [], events: [] };
}
