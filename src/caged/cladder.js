// The chord ladder: the ultimate ladder (seven modes, bright to dark, with detours into melodic minor, harmonic minor
// and the diminished scale) played as chords. Each mode gives its chord, and a colour or two (its sus chord where it has
// one), as four-note voicings from Ted Greene's V-System (drop 2 and drop 3 on their natural string sets), all inside
// one CAGED area. The route is voice-led: each chord takes the voicing that moves fewest voices the shortest way, so on
// most steps one finger moves a fret. Optionally each rung's chord is walked through its other inversions in the area
// before the next mode, in whichever order ends nearest the next chord. Pure: no screen, no sound.
import * as T from '../theory.js';
import * as F from '../fretboard.js';
import * as G from './grips.js';
import { QUALS, voicingsOn } from './xmorph.js';

// the morpher's chords, plus Dorian ♭2's own 13sus♭9 and a 9sus4 that keeps its 5th (9 4 5 ♭7): one voice from the 9 chord, where the morpher's
// "11" grip (1 4 ♭7 9) is two away
const Q = { ...QUALS, '13susb9': { id: '13susb9', sym: '13sus4♭9', tones: ['b9', '4', '13', 'b7'], from: 'Dorian ♭2, the 2nd mode of melodic minor', use: 'The sus♭9 with Dorian’s 13 on top: dark below, bright above, the sound of modal jazz vamps.' }, '9sus': { id: '9sus', sym: '9sus4', tones: ['9', '4', '5', 'b7'], from: 'Mixolydian, with the 4th in place of the 3rd', use: 'The suspended dominant: the 3rd held back a half step up, waiting to fall.' } };
export const CHORD = Q;

// each mode's chord first, then its colours (one voice away where possible); tones from the morpher's vocabulary
export const MODE_CHORDS = {
  lydian: ['maj7#11', 'maj9#11'],
  ionian: ['maj9', '69'],
  'mel-min': ['mMaj9', 'm69'],
  mixolydian: ['13', '9', '9sus'],
  'lyd-dom': ['9#11'],
  dorian: ['m13', 'm9', 'm11'],
  'dorian-b2': ['13susb9', 'susb9'],
  aeolian: ['m9', 'm11'],
  'harm-min': ['mMaj9'],
  'locrian-n2': ['m9b5'],
  phrygian: ['susb9', 'm7_11'],
  'phryg-dom': ['7b9', '7b9#5'],
  locrian: ['m7b5'],
  altered: ['7#9#5', '7b9#5', '7#9b5'],
  'dim-hw': ['13b9', '13#9'],
};
// the voicings to draw from: drop 2 and drop 3 on their natural string sets (Ted Greene's V-2 and V-4), or the best of
// both; a chord with nothing in its lane in this area borrows from the other
const SETS = [{ g: 2, set: [4, 3, 2, 1] }, { g: 2, set: [5, 4, 3, 2] }, { g: 2, set: [6, 5, 4, 3] }, { g: 4, set: [6, 4, 3, 2] }, { g: 4, set: [5, 3, 2, 1] }];
export const LANES = [
  { id: 'best', name: 'Best', sets: SETS, blurb: 'Drop 2 and drop 3 together: each chord takes whichever moves least.' },
  { id: 'd2', name: 'Drop 2', sets: SETS.filter((x) => x.g === 2), blurb: 'Drop 2 (Ted Greene’s V-2) on strings 4-3-2-1, 5-4-3-2 and 6-5-4-3.' },
  { id: 'd3', name: 'Drop 3', sets: SETS.filter((x) => x.g === 4), blurb: 'Drop 3 (V-4), root-heavy and wide, on strings 6-4-3-2 and 5-3-2-1.' },
];
export const laneById = (id) => LANES.find((l) => l.id === id) || LANES[0];

const pcOf = (root, iv) => (T.notePc(root) + T.intervalSemis(F.simpleIv(String(iv)))) % 12;
// a voicing, fingered; the same four sounding notes in another lane count once
function finish(v) {
  const notes = G.assignFingers(v.notes.map((n) => ({ ...n }))).sort((a, b) => b.string - a.string);
  return { ...v, notes, key: notes.map((n) => `${n.string}:${n.fret}`).join(' ') };
}
// a hand has to be able to hold it: no finger asked for two frets, and no wider gap between two fingers than their
// distance allows plus one fret (index to middle two frets at most, ring to little finger two)
function playable(v) {
  const fr = v.notes.filter((n) => n.finger);
  for (const a of fr) for (const b of fr) {
    if (a.finger === b.finger && a.fret !== b.fret) return false;
    if (a.finger < b.finger && b.fret - a.fret > b.finger - a.finger + 1) return false;
  }
  return true;
}
// what makes a voicing less good, as a cost: a four-fret stretch, and a tension (9, 11, 13) in the bass, which low
// down sounds like a slash chord; worst on the 6th string
const TENSION = /^(b9|9|#9|11|#11|b13|13)$/;
const rough = (v) => { const bass = v.notes[0]; return (span(v) >= 4 ? 8 : 0) + (TENSION.test(bass.iv) ? (bass.string === 6 ? 14 : bass.string === 5 ? 6 : 2) : 0); };
// a four-fret span is playable but a stretch: the route takes one only when it saves a real move
const span = (v) => { const fr = v.notes.filter((n) => n.fret > 0).map((n) => n.fret); return fr.length ? Math.max(...fr) - Math.min(...fr) : 0; };
const cache = new Map();
export function voicingsIn(root, id, lane, pos) {
  const k = `${T.notePc(root)}|${id}|${lane.id}|${pos.lo}|${pos.hi}`;
  if (cache.has(k)) return cache.get(k);
  const seen = new Set(), out = [];
  for (const l of lane.sets) for (const v of voicingsOn(root, Q[id], l.set, l.g, pos)) {
    const f = finish({ ...v, group: l.g });
    if (seen.has(f.key) || !playable(f)) continue;
    seen.add(f.key); out.push(f);
  }
  // nearest the middle of the area first
  const mid = (pos.lo + pos.hi) / 2, c = (v) => { const fr = v.notes.filter((n) => n.fret > 0).map((n) => n.fret); return fr.length ? Math.abs(fr.reduce((a, b) => a + b, 0) / fr.length - mid) : 9; };
  out.sort((a, b) => c(a) - c(b));
  cache.set(k, out);
  return out;
}

// the cost of a change: voices that move (bass up, pitch by pitch), how far they move, and, between lanes, the
// strings the hand has to change
export function moveCost(a, b) {
  const x = a.notes.map((n) => n.midi).sort((p, q) => p - q), y = b.notes.map((n) => n.midi).sort((p, q) => p - q);
  let moved = 0, dist = 0;
  for (let i = 0; i < 4; i++) { const d = Math.abs(x[i] - y[i]); if (d) { moved++; dist += d; } }
  const sa = new Set(a.notes.map((n) => n.string)), strings = b.notes.filter((n) => !sa.has(n.string)).length;
  const shift = Math.abs(a.notes.reduce((t, n) => t + n.fret, 0) - b.notes.reduce((t, n) => t + n.fret, 0)) / 4;
  return moved * 10 + dist + strings * 6 + shift + rough(b);
}
// which voices moved, bass up: "♯11 → 5, up a half step"
export function movedText(a, b) {
  const x = a.notes.slice().sort((p, q) => p.midi - q.midi), y = b.notes.slice().sort((p, q) => p.midi - q.midi);
  const out = [];
  for (let i = 0; i < 4; i++) {
    const d = y[i].midi - x[i].midi;
    if (!d) continue;
    out.push(`${T.prettyIv(x[i].iv)} → ${T.prettyIv(y[i].iv)}, ${d < 0 ? 'down' : 'up'} ${Math.abs(d) === 1 ? 'a half step' : Math.abs(d) === 2 ? 'a whole step' : `${Math.abs(d)} half steps`}`);
  }
  return out;
}
const perms = (a) => (a.length <= 1 ? [a] : a.flatMap((x, i) => perms(a.slice(0, i).concat(a.slice(i + 1))).map((r) => [x, ...r])));

// the route through a walk ([mode, 'rung' n | 'detour' | 'back'] from the ladder) on one root, in one area and lane.
// colours: play each mode's colour chords too; inv: walk each rung's chord through its other inversions in the area.
// A return to the rung is its chord alone. Each step: { mode, kind, rung, id, q, v, first (of its mode), inv (an
// inversion of the chord just played), moved }.
export function route(root, walk, pos, laneId, { colours = true, inv = false } = {}) {
  const lane = laneById(laneId), mid = (pos.lo + pos.hi) / 2;
  const units = walk.map(([mode, kind]) => {
    const k = typeof kind === 'number' ? 'rung' : kind, ids = MODE_CHORDS[mode] || [];
    // a return to the rung: whichever of its chords is nearest (the route picks one)
    const want = !colours ? ids.slice(0, 1) : ids;
    // a chord with no voicing here (in this lane and area) is left out
    const chords = want.map((id) => { let vs = voicingsIn(root, id, lane, pos), off = false; if (!vs.length && lane.id !== 'best') { vs = voicingsIn(root, id, LANES[0], pos); off = vs.length > 0; } return { id, vs, off }; }).filter((c) => c.vs.length);
    return { mode, kind: k, rung: typeof kind === 'number' ? kind : null, chords, missing: want.filter((id) => !chords.some((c) => c.id === id)) };
  });
  // the ways through one unit: its chords in any order (the mode's own chord need not come first: a sus can resolve
  // into it), each one voicing, the one nearest the chord before; with inversions on, the rung's own chord is played
  // in every voicing it has in the area, low to high or high to low, from any of them. A return to the rung plays
  // just one of its chords.
  function plans(u) {
    if (!u.chords.length) return [];
    const out = [];
    const blockOf = (c) => {
      if (!(inv && u.kind === 'rung' && c === u.chords[0] && c.vs.length > 1)) return null;
      const s = c.vs.slice(0, 4).sort((a, b) => a.notes[0].midi - b.notes[0].midi);
      return s.flatMap((_, i) => [s.slice(i).concat(s.slice(0, i)), s.slice(0, i + 1).reverse().concat(s.slice(i + 1).reverse())]);
    };
    const orders = u.kind === 'back' ? u.chords.map((c) => [c]) : perms(u.chords);
    for (const order of orders) {
      const [c0, ...rest] = order, b0 = blockOf(c0);
      const starts = b0 ? b0.map((vs) => vs.map((v) => [c0.id, v])) : c0.vs.map((v) => [[c0.id, v]]);
      for (const h of starts) {
        const seq = h.slice();
        let cost = 0;
        for (let i = 1; i < h.length; i++) cost += moveCost(h[i - 1][1], h[i][1]);
        for (const c of rest) {
          const last = seq[seq.length - 1][1], b = blockOf(c);
          if (b) { const vs = b.reduce((x, y) => (moveCost(last, x[0]) <= moveCost(last, y[0]) ? x : y)); for (const v of vs) { cost += moveCost(seq[seq.length - 1][1], v); seq.push([c.id, v]); } continue; }
          const v = c.vs.reduce((x, y) => (moveCost(last, x) <= moveCost(last, y) ? x : y));
          cost += moveCost(last, v); seq.push([c.id, v]);
        }
        out.push({ seq, cost });
      }
    }
    return out;
  }
  // dynamic programming over the units: the state is the last voicing played
  let states = [{ last: null, cost: 0, path: [] }];
  for (const u of units) {
    const ps = plans(u);
    if (!ps.length) { states = states.map((s) => ({ ...s, path: [...s.path, { u, seq: [] }] })); continue; }
    const next = new Map();
    for (const s of states) for (const p of ps) {
      const first = p.seq[0][1];
      const same = (a, b) => a.notes.map((n) => n.midi).sort().join() === b.notes.map((n) => n.midi).sort().join();
      const enter = s.last ? moveCost(s.last, first) + (same(s.last, first) ? 40 : 0) : Math.abs(first.notes.reduce((t, n) => t + n.fret, 0) / 4 - mid) + (first.notes[0].iv === '1' ? 0 : 3);
      const c = s.cost + enter + p.cost, end = p.seq[p.seq.length - 1][1].key;
      if (!next.has(end) || next.get(end).cost > c) next.set(end, { last: p.seq[p.seq.length - 1][1], cost: c, path: [...s.path, { u, seq: p.seq }] });
    }
    states = [...next.values()];
  }
  const best = states.reduce((a, b) => (a.cost <= b.cost ? a : b));
  const steps = [];
  let prev = null;
  for (const { u, seq } of best.path) {
    if (!seq.length) { steps.push({ mode: u.mode, kind: u.kind, rung: u.rung, id: null, missing: u.missing }); continue; }
    seq.forEach(([id, v], i) => {
      steps.push({ mode: u.mode, kind: u.kind, rung: u.rung, id, q: Q[id], v, first: i === 0, inv: i > 0 && id === seq[i - 1][0], moved: prev ? movedText(prev, v) : [], missing: i === 0 ? u.missing : [] });
      prev = v;
    });
  }
  return { steps, cost: best.cost };
}
