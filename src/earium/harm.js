// The harmony behind Guided mode: a chord is a set of degrees above a root ('1', 'b3', '5', 'b7', '9' …). It is
// named from the app's chord table (src/theory.js), voiced as an open spread with every degree in its own register
// (so a morph is one voice stepping), and changed one note at a time: a note comes in, a note leaves, or a note
// steps to its neighbour in the same family (3 → ♭3, 3 → 4, 5 → ♯5, ♭7 → 7, 9 → ♭9 …).
import * as T from '../theory.js';

export const DEGS = ['1', 'b2', '2', 'b3', '3', '4', '#4', 'b5', '5', '#5', 'b6', '6', 'bb7', 'b7', '7', 'b9', '9', '#9', '11', '#11', 'b13', '13'];
// each degree's place in the spread voicing, in semitones above the root
export const SPREAD = { 1: 0, 5: 7, b5: 6, '#5': 8, b6: 8, b3: 15, 3: 16, 2: 14, 4: 17, b2: 13, '#4': 18, 6: 21, bb7: 21, b7: 22, 7: 23, b9: 25, 9: 26, '#9': 27, 11: 29, '#11': 30, b13: 32, 13: 33 };
export const FAMILY = { 1: 'root', b2: 'third', 2: 'third', b3: 'third', 3: 'third', 4: 'third', '#4': 'fifth', b5: 'fifth', 5: 'fifth', '#5': 'fifth', b6: 'fifth',
  6: 'seventh', bb7: 'seventh', b7: 'seventh', 7: 'seventh', b9: 'ninth', 9: 'ninth', '#9': 'ninth', 11: 'eleventh', '#11': 'eleventh', b13: 'thirteenth', 13: 'thirteenth' };
// colour classes for the neck and the stack (as in the other apps: root, 3rds, 5ths, 7ths, the rest)
export const KIND = (d) => (d === '1' ? 'r' : FAMILY[d] === 'third' ? 't3' : FAMILY[d] === 'fifth' ? 't5' : FAMILY[d] === 'seventh' ? 't7' : 'tx');
const semi = (d) => T.intervalSemis(d);
export const pc = (d) => semi(d) % 12;

// ---------- names ----------
// sets that the chord table doesn't have, but that come up on the way
const EXTRA = [
  ['P1', ['1'], 'the root alone'],
  ['P5', ['1', '5'], 'an open fifth'],
  ['M3', ['1', '3'], 'a major third'],
  ['m3', ['1', 'b3'], 'a minor third'],
  ['add11', ['1', '3', '5', '11'], 'major add eleven'],
  ['madd11', ['1', 'b3', '5', '11'], 'minor add eleven'],
  ['add#11', ['1', '3', '5', '#11'], 'major add sharp eleven'],
  ['maj7sus2', ['1', '2', '5', '7'], 'major seven sus two'],
  ['maj7sus4', ['1', '4', '5', '7'], 'major seven sus four'],
  ['sus24', ['1', '2', '4', '5'], 'sus two sus four'],
  ['m7add11', ['1', 'b3', '5', 'b7', '11'], 'minor seven add eleven'],
  ['maj9sus4', ['1', '4', '5', '7', '9'], 'major nine sus four'],
  ['7sus4b9', ['1', '4', '5', 'b7', 'b9'], 'seven sus four flat nine'],
  ['m9b5', ['1', 'b3', 'b5', 'b7', '9'], 'half diminished nine'],
  ['m11b5', ['1', 'b3', 'b5', 'b7', '11'], 'half diminished eleven'],
  ['dim9', ['1', 'b3', 'b5', 'bb7', '9'], 'diminished nine'],
  ['augadd9', ['1', '3', '#5', '9'], 'augmented add nine'],
  ['6add9sus', ['1', '2', '5', '6'], 'six sus two'],
];
// spoken names for the table's chords, as "now it's …" would say them
export const QSAY = { maj: 'a major triad', min: 'a minor triad', dim: 'a diminished triad', aug: 'an augmented triad', sus2: 'sus two', sus4: 'sus four', 5: 'an open fifth',
  maj7: 'major seven', 7: 'dominant seven', m7: 'minor seven', m7b5: 'half diminished', dim7: 'diminished seven', mMaj7: 'minor major seven', 'maj7#5': 'major seven sharp five',
  '7#5': 'seven sharp five', '7b5': 'seven flat five', '7sus4': 'seven sus four', 6: 'major six', m6: 'minor six', add9: 'major add nine', madd9: 'minor add nine', '6/9': 'six nine',
  'm6/9': 'minor six nine', maj9: 'major nine', 9: 'dominant nine', m9: 'minor nine', mMaj9: 'minor major nine', 11: 'dominant eleven', m11: 'minor eleven',
  'maj7#11': 'major seven sharp eleven', 'maj9#11': 'major nine sharp eleven', 13: 'dominant thirteen', m13: 'minor thirteen', maj13: 'major thirteen', '9sus4': 'nine sus four',
  '13sus4': 'thirteen sus four', '7b9': 'seven flat nine', '7#9': 'seven sharp nine', '7#11': 'seven sharp eleven', '7b13': 'seven flat thirteen', '7b9b13': 'seven flat nine flat thirteen',
  '7#9b13': 'seven sharp nine flat thirteen', '7#9#5': 'seven sharp nine sharp five', '13b9': 'thirteen flat nine', '13#11': 'thirteen sharp eleven', '7alt': 'altered dominant',
  'dim-maj7': 'diminished major seven', 'm7#5': 'minor seven sharp five', '7sus2': 'seven sus two', '7sus4b5': 'seven sus four flat five' };
const SYM_EXTRA = { P1: '', P5: '5', M3: '(3)', m3: 'm(3)', add11: 'add11', madd11: 'm(add11)', 'add#11': 'add♯11', maj7sus2: 'maj7sus2', maj7sus4: 'maj7sus4', sus24: 'sus2sus4',
  m7add11: 'm7(add11)', maj9sus4: 'maj9sus4', '7sus4b9': '7sus4♭9', m9b5: 'm9♭5', m11b5: 'm11♭5', dim9: '°9', augadd9: '+(add9)', '6add9sus': '6sus2' };
const keyOf = (degs) => [...degs].sort((a, b) => semi(a) - semi(b)).join(' ');
const TABLE = new Map();
for (const [id, c] of Object.entries(T.CHORDS)) if (QSAY[id]) TABLE.set(keyOf(c.ivs), { id, sym: c.sym, say: QSAY[id] });
for (const [id, ivs, say] of EXTRA) if (!TABLE.has(keyOf(ivs))) TABLE.set(keyOf(ivs), { id, sym: SYM_EXTRA[id], say });
export const ALL_SAYS = [...new Set([...TABLE.values()].map((x) => x.say))];

// the chord's name: exact, else with the 5th understood ("no 5")
export function nameOf(degs) {
  const ex = TABLE.get(keyOf(degs));
  if (ex) return { ...ex, no5: false };
  if (!degs.includes('5') && !degs.some((d) => FAMILY[d] === 'fifth') && degs.length >= 3) {
    const w = TABLE.get(keyOf([...degs, '5']));
    if (w && !['P5', 'maj', 'min'].includes(w.id)) return { ...w, no5: true };
  }
  return null;
}
export const symOf = (root, n) => (n ? `${T.noteName(root, true)}${n.sym}`.replace(/\s+/g, '') + (n.no5 ? ' (no 5)' : '') : T.noteName(root, true));

// ---------- the level: which degrees may sound ----------
export const LEVELS = [
  { n: 1, name: 'Triads', blurb: 'Root, 3rds, 5ths, sus chords.', degs: ['1', '2', 'b3', '3', '4', '5'] },
  { n: 2, name: 'Sevenths', blurb: 'Adds 6ths and 7ths: maj7, m7, dominant 7, sixes.', degs: ['6', 'b7', '7'] },
  { n: 3, name: 'Extensions', blurb: 'Adds 9, 11 and 13.', degs: ['9', '11', '13'] },
  { n: 4, name: 'Altered', blurb: 'Adds ♭9, ♯9, ♯11, ♭13, diminished and augmented.', degs: ['b9', '#9', '#11', 'b13', 'b5', '#5', 'bb7'] },
  { n: 5, name: 'Everything', blurb: 'Every colour, all at once if it likes.', degs: ['b2', '#4', 'b6'] },
];
export const allowed = (L) => new Set(LEVELS.filter((l) => l.n <= L).flatMap((l) => l.degs));

// ---------- moves ----------
// neighbours inside a family (the third's family includes the sus notes)
const NEAR = {
  third: ['2', 'b3', '3', '4'], fifth: ['b5', '5', '#5'], seventh: ['6', 'b7', '7', 'bb7'], ninth: ['b9', '9', '#9'], eleventh: ['11', '#11'], thirteenth: ['b13', '13'],
};
export const MOVE_PAIRS = Object.values(NEAR).flatMap((fam) => fam.flatMap((a) => fam.filter((b) => b !== a).map((b) => [a, b])));
const OK_SEVENTH = { bb7: (s) => s.has('b3') && s.has('b5'), 6: () => true };
// every chord one move away that the level allows and that has a name
export function moves(degs, L, maxNotes) {
  const S = new Set(degs), ok = allowed(L), out = [];
  const valid = (set) => {
    const n = nameOf([...set]);
    if (!n || !set.has('1')) return null;
    if (set.has('bb7') && !OK_SEVENTH.bb7(set)) return null;
    return n;
  };
  for (const d of degs) {
    if (d === '1') continue;
    for (const nb of NEAR[FAMILY[d]] || []) {
      if (nb === d || !ok.has(nb) || S.has(nb)) continue;
      const set = new Set(S); set.delete(d); set.add(nb);
      const n = valid(set); if (n) out.push({ kind: 'step', from: d, to: nb, degs: [...set], name: n });
    }
    // a note can leave (not the 3rd's family's only member, unless to an open fifth)
    const set = new Set(S); set.delete(d);
    const n = valid(set); if (n && set.size >= 2) out.push({ kind: 'out', from: d, degs: [...set], name: n });
  }
  if (S.size < maxNotes) for (const d of ok) {
    if (S.has(d) || [...S].some((x) => FAMILY[x] === FAMILY[d] && FAMILY[d] !== 'third')) continue;
    if (FAMILY[d] === 'third' && [...S].some((x) => FAMILY[x] === 'third')) continue;
    const set = new Set(S); set.add(d);
    const n = valid(set); if (n) out.push({ kind: 'in', to: d, degs: [...set], name: n });
  }
  return out;
}

// a chord to build towards, at the level and size: its degrees in the order they'll come in
export function target(L, maxNotes) {
  const ok = allowed(L), pool = [];
  for (const [k, x] of TABLE) {
    const degs = k.split(' ');
    if (degs.length < 3 || degs.length > maxNotes || !degs.every((d) => ok.has(d)) || x.id === 'quartal') continue;
    if (degs.includes('bb7') && !(degs.includes('b3') && degs.includes('b5'))) continue;
    // the newest colours of the level are the likeliest
    const top = Math.max(...degs.map((d) => LEVELS.findIndex((l) => l.degs.includes(d)) + 1));
    pool.push([degs, top === L ? 3 : 1, x]);
  }
  // too few with all the 5ths? also allow the 5th left out
  let r = Math.random() * pool.reduce((s, p) => s + p[1], 0);
  let pick = pool[0];
  for (const p of pool) { r -= p[1]; if (r <= 0) { pick = p; break; } }
  let degs = pick[0];
  if (degs.length > maxNotes) degs = degs.filter((d) => d !== '5');
  return order(degs);
}
// the order they come in: the root, then usually the 5th and the 3rd, then up the stack (sometimes the 3rd first,
// sometimes the 7th before the 3rd: a dominant heard as root and tritone)
export function order(degs) {
  const by = (fam) => degs.filter((d) => FAMILY[d] === fam);
  const third = by('third'), fifth = by('fifth'), sev = by('seventh'), up = degs.filter((d) => ['ninth', 'eleventh', 'thirteenth'].includes(FAMILY[d])).sort((a, b) => semi(a) - semi(b));
  const r = Math.random();
  const core = r < 0.55 ? [...fifth, ...third, ...sev] : r < 0.85 ? [...third, ...fifth, ...sev] : [...sev, ...third, ...fifth];
  return ['1', ...core, ...up];
}

// ---------- voicing ----------
// MIDI notes for the degrees above a root MIDI note; bass: the degree that must be lowest (an inversion)
export function voice(degs, rootMidi, bass = '1') {
  const out = degs.map((d) => ({ deg: d, midi: rootMidi + SPREAD[d] }));
  if (bass !== '1' && degs.includes(bass)) {
    const b = out.find((x) => x.deg === bass);
    // below the root when there's room (the root stays where it was), else just above it
    b.midi = rootMidi + (SPREAD[bass] % 12) - 12;
    if (b.midi < 36) b.midi += 12;
    // everything else above it
    out.forEach((x) => { while (x !== b && x.midi <= b.midi) x.midi += 12; });
    // the root keeps its home an octave up, so it still rings as the anchor
  }
  return out.sort((a, b) => a.midi - b.midi);
}
// where the bass may go in an inversion: a chord tone other than the root
export function bassChoices(degs) { return degs.filter((d) => ['third', 'fifth', 'seventh'].includes(FAMILY[d]) && d !== '6'); }

// a root for the drone, low in the guitar's range (E2 to D#3)
export function rootMidi(pcRoot) { return 40 + (((pcRoot - 4) % 12) + 12) % 12; }

// ---------- the neck: a place for every note (one per string when it can be, near the last place) ----------
export const OPEN = [40, 45, 50, 55, 59, 64]; // strings 6 → 1, as indexes 0..5
export function place(midis, prev = null, maxFret = 15) {
  const n = midis.length;
  const centre = prev ? prev.centre : 5;
  let best = null;
  const used = new Array(6).fill(false), cur = [];
  function cost(asg) {
    const fr = asg.filter((a) => a.fret > 0).map((a) => a.fret);
    const span = fr.length ? Math.max(...fr) - Math.min(...fr) : 0;
    const mid = fr.length ? fr.reduce((s, f) => s + f, 0) / fr.length : centre;
    return Math.max(0, span - 4) * 6 + span + Math.abs(mid - centre) * 0.6;
  }
  function go(i) {
    if (i === n) { const c = cost(cur); if (!best || c < best.c) best = { c, a: cur.map((x) => ({ ...x })) }; return; }
    for (let s = 0; s < 6; s++) {
      if (used[s]) continue;
      const f = midis[i] - OPEN[s];
      if (f < 0 || f > maxFret) continue;
      used[s] = true; cur.push({ string: 6 - s, fret: f, midi: midis[i] }); go(i + 1); cur.pop(); used[s] = false;
    }
  }
  if (n <= 6) go(0);
  let a = best ? best.a : null;
  if (!a) a = midis.map((m) => { // more notes than strings: the nearest place for each, strings may share
    let bs = null;
    for (let s = 0; s < 6; s++) { const f = m - OPEN[s]; if (f >= 0 && f <= 20 && (!bs || Math.abs(f - centre) < Math.abs(bs.fret - centre))) bs = { string: 6 - s, fret: f, midi: m }; }
    return bs || { string: 1, fret: Math.max(0, m - 64), midi: m };
  });
  const fr = a.filter((x) => x.fret > 0).map((x) => x.fret);
  return { notes: a, centre: fr.length ? fr.reduce((s, f) => s + f, 0) / fr.length : centre };
}

// ---------- can a hand play it? ----------
// fretted notes within a 3-fret span below the 7th fret (4 above, where frets are narrower); up to four fretted
// notes, or more only with an index-finger barre on the lowest fret and at most three notes above it; open strings
// only in open position (everything else within the first four frets)
export function fingerable(notes) {
  const fr = notes.filter((n) => n.fret > 0);
  if (!fr.length) return true;
  const lo = Math.min(...fr.map((n) => n.fret)), hi = Math.max(...fr.map((n) => n.fret));
  if (hi - lo > (lo >= 7 ? 4 : 3)) return false;
  if (notes.some((n) => n.fret === 0) && hi > 5) return false;
  if (fr.length <= 4) return true;
  const atLo = fr.filter((n) => n.fret === lo), above = fr.filter((n) => n.fret > lo);
  if (atLo.length < 2 || above.length > 3) return false;
  // the barre lies across the strings between its outer notes: notes above it must be on strings inside or beside it
  return true;
}
