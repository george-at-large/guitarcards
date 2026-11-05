// Memory pack theory engine: spelled notes (letter + accidental), degree formulas, modes, chords, derivations.
// Notes use the same shape as src/theory.js ({ letter, acc }) so the two engines agree.
import { LETTERS, parseNote, notePc, noteName } from '../theory.js';

const LETTER_PC = [0, 2, 4, 5, 7, 9, 11];
const MAJ = [0, 2, 4, 5, 7, 9, 11];

export const N = (s) => parseNote(String(s).replace('𝄫', 'bb').replace('𝄪', '##').replace('♭', 'b').replace('♯', '#'));
export const pc = notePc;
export const nm = (n) => noteName(n, true); // pretty spelling, e.g. D♭
export const same = (a, b) => a.letter === b.letter && a.acc === b.acc;
export { LETTERS };

// a degree token: optional accidentals then a number (b3, #4, bb7, b4, 13)
export function parseDeg(tok) {
  const m = /^(bb|b|##|#|♮)?(\d+)$/.exec(String(tok).replace(/♭/g, 'b').replace(/♯/g, '#').replace(/𝄫/g, 'bb'));
  if (!m) throw new Error(`Bad degree "${tok}"`);
  const acc = { bb: -2, b: -1, '#': 1, '##': 2 }[m[1]] || 0;
  return { d: Number(m[2]), acc };
}
export const prettyDeg = (tok) => String(tok).replace(/bb/g, '𝄫').replace(/b/g, '♭').replace(/#/g, '♯');

// apply a degree above a root: move the letter first, then set the accidental to hit the semitone count
export function up(root, tok) {
  const { d, acc } = parseDeg(tok);
  const semis = MAJ[(d - 1) % 7] + acc;
  const letter = (root.letter + d - 1) % 7;
  let a = (notePc(root) + semis - LETTER_PC[letter]) % 12;
  if (a > 6) a -= 12; if (a < -6) a += 12;
  if (Math.abs(a) > 2) throw new Error(`Triple accidental: ${tok} above ${nm(root)}`);
  return { letter, acc: a };
}
// the note a degree BELOW the given note (so that up(result, tok) === note)
export function down(note, tok) {
  const { d, acc } = parseDeg(tok);
  const semis = MAJ[(d - 1) % 7] + acc;
  const letter = (((note.letter - (d - 1)) % 7) + 7) % 7;
  let a = (notePc(note) - semis - LETTER_PC[letter]) % 12;
  a = ((a % 12) + 12) % 12; if (a > 6) a -= 12;
  if (Math.abs(a) > 2) throw new Error(`Triple accidental: ${tok} below ${nm(note)}`);
  return { letter, acc: a };
}

// ---------- intervals ----------
export const IV = [
  ['m2', 'b2', 1, 'minor 2nd'], ['M2', '2', 2, 'major 2nd'], ['m3', 'b3', 3, 'minor 3rd'], ['M3', '3', 4, 'major 3rd'],
  ['P4', '4', 5, 'perfect 4th'], ['TT', '#4', 6, 'tritone'], ['P5', '5', 7, 'perfect 5th'], ['m6', 'b6', 8, 'minor 6th'],
  ['M6', '6', 9, 'major 6th'], ['m7', 'b7', 10, 'minor 7th'], ['M7', '7', 11, 'major 7th'],
];
const IVNAME = { m2: 'm2', M2: 'M2', m3: 'm3', M3: 'M3', P4: 'P4', TT: 'tritone', P5: 'P5', m6: 'm6', M6: 'M6', m7: 'm7', M7: 'M7' };
export const ivLabel = (k) => IVNAME[k] || k;
// name the interval from a up to b (letters first, then quality)
export function intervalName(a, b) {
  const ld = (((b.letter - a.letter) % 7) + 7) % 7;
  const semis = (((notePc(b) - notePc(a)) % 12) + 12) % 12;
  const diff = semis - MAJ[ld];
  const perfect = [0, 3, 4].includes(ld);
  const num = ['1', '2', '3', '4', '5', '6', '7'][ld];
  if (perfect) {
    if (diff === 0) return ld === 0 ? 'P1' : 'P' + num;
    if (diff === 1 && ld === 3) return 'TT';
    if (diff === -1 && ld === 4) return 'TT';
    return (diff > 0 ? 'A' : 'd') + num;
  }
  if (diff === 0) return 'M' + num;
  if (diff === -1) return 'm' + num;
  return (diff > 0 ? 'A' : 'd') + num;
}

// ---------- scales and modes (data) ----------
// family, index, name, formula, 7th chord, colour, use, twin (major mode + change), bright (major modes only)
export const MODES = [
  // major (brightness order is given separately)
  { id: 'ionian', fam: 'major', i: 1, name: 'Ionian', f: '1 2 3 4 5 6 7', chord: 'maj7', colour: '9', change: '—' },
  { id: 'dorian', fam: 'major', i: 2, name: 'Dorian', f: '1 2 b3 4 5 6 b7', chord: 'm7', colour: '♮13', change: '♭3' },
  { id: 'phrygian', fam: 'major', i: 3, name: 'Phrygian', f: '1 b2 b3 4 5 b6 b7', chord: 'm7', colour: '♭9', change: '♭2' },
  { id: 'lydian', fam: 'major', i: 4, name: 'Lydian', f: '1 2 3 #4 5 6 7', chord: 'maj7', colour: '♯11', change: '♯4' },
  { id: 'mixolydian', fam: 'major', i: 5, name: 'Mixolydian', f: '1 2 3 4 5 6 b7', chord: '7', colour: '9, 13', change: '♭7' },
  { id: 'aeolian', fam: 'major', i: 6, name: 'Aeolian', f: '1 2 b3 4 5 b6 b7', chord: 'm7', colour: '♭13', change: '♭6' },
  { id: 'locrian', fam: 'major', i: 7, name: 'Locrian', f: '1 b2 b3 4 b5 b6 b7', chord: 'm7b5', colour: '♭9', change: '♭5' },
  // harmonic minor
  { id: 'harmonic-minor', fam: 'harmonic', i: 1, name: 'Harmonic minor', f: '1 2 b3 4 5 b6 7', chord: 'mMaj7', colour: '♮7', use: 'Dark tonic minor', twin: 'aeolian', how: 'raise the 7th', alias: 'Aeolian ♮7' },
  { id: 'locrian-nat6', fam: 'harmonic', i: 2, name: 'Locrian ♮6', f: '1 b2 b3 4 b5 6 b7', chord: 'm7b5', colour: '♮13', use: 'iiø7 in minor', twin: 'locrian', how: 'raise the 6th' },
  { id: 'ionian-sharp5', fam: 'harmonic', i: 3, name: 'Ionian ♯5', f: '1 2 3 4 #5 6 7', chord: 'maj7#5', colour: '♯5', use: 'Augmented colour', twin: 'ionian', how: 'raise the 5th' },
  { id: 'dorian-sharp4', fam: 'harmonic', i: 4, name: 'Dorian ♯4', f: '1 2 b3 #4 5 6 b7', chord: 'm7', colour: '♯11', use: 'Exotic iv', twin: 'dorian', how: 'raise the 4th' },
  { id: 'phrygian-dominant', fam: 'harmonic', i: 5, name: 'Phrygian dominant', f: '1 b2 3 4 5 b6 b7', chord: '7', colour: '♭9, ♭13', use: 'V7♭9 into minor', twin: 'phrygian', how: 'raise the 3rd' },
  { id: 'lydian-sharp2', fam: 'harmonic', i: 6, name: 'Lydian ♯2', f: '1 #2 3 #4 5 6 7', chord: 'maj7', colour: '♯9, ♯11', use: 'Exotic ♭VI', twin: 'lydian', how: 'raise the 2nd' },
  { id: 'ultralocrian', fam: 'harmonic', i: 7, name: 'Ultralocrian', f: '1 b2 b3 b4 b5 b6 bb7', chord: 'dim7', colour: 'dim7', use: 'vii°7 into i', twin: 'locrian', how: 'lower the 4th and 7th' },
  // melodic minor
  { id: 'melodic-minor', fam: 'melodic', i: 1, name: 'Melodic minor', f: '1 2 b3 4 5 6 7', chord: 'mMaj7', colour: '6, 9', use: 'Tonic minor (m6/9)', twin: 'dorian', how: 'raise the 7th', alias: 'Dorian ♮7 (or Ionian ♭3)' },
  { id: 'dorian-b2', fam: 'melodic', i: 2, name: 'Dorian ♭2', f: '1 b2 b3 4 5 6 b7', chord: 'm7', colour: '♭9', use: '7sus♭9 sound', twin: 'phrygian', how: 'raise the 6th' },
  { id: 'lydian-augmented', fam: 'melodic', i: 3, name: 'Lydian augmented', f: '1 2 3 #4 #5 6 7', chord: 'maj7#5', colour: '♯11', use: 'Floating maj7♯5', twin: 'lydian', how: 'raise the 5th' },
  { id: 'lydian-dominant', fam: 'melodic', i: 4, name: 'Lydian dominant', f: '1 2 3 #4 5 6 b7', chord: '7', colour: '♯11', use: 'IV7, ♭VII7, tritone subs', twin: 'mixolydian', how: 'raise the 4th' },
  { id: 'mixolydian-b6', fam: 'melodic', i: 5, name: 'Mixolydian ♭6', f: '1 2 3 4 5 b6 b7', chord: '7', colour: '♭13', use: 'Gentle V7 in minor', twin: 'aeolian', how: 'raise the 3rd' },
  { id: 'locrian-nat2', fam: 'melodic', i: 6, name: 'Locrian ♮2', f: '1 2 b3 4 b5 b6 b7', chord: 'm7b5', colour: '♮9', use: 'iiø7 in minor (standard)', twin: 'locrian', how: 'raise the 2nd' },
  { id: 'altered', fam: 'melodic', i: 7, name: 'Altered', f: '1 b2 b3 b4 b5 b6 b7', chord: '7alt', colour: '♭9, ♯9, ♯11, ♭13', use: 'Tense V7 into major or minor', twin: 'locrian', how: 'lower the 4th' },
  // symmetric
  { id: 'half-whole', fam: 'symmetric', i: 1, name: 'Half-whole diminished', f: '1 b2 #2 3 #4 5 6 b7', chord: '7b9', steps: 'H W H W H W H W', over: '7♭9, 13♭9', versions: 3, shortcut: 'Repeats every minor 3rd: G7, B♭7, D♭7, E7 share one scale' },
  { id: 'whole-half', fam: 'symmetric', i: 2, name: 'Whole-half diminished', f: '1 2 b3 4 b5 b6 6 7', chord: 'dim7', steps: 'W H W H W H W H', over: 'dim7', versions: 3, shortcut: 'Same notes as half-whole a semitone lower' },
  { id: 'whole-tone', fam: 'symmetric', i: 3, name: 'Whole tone', f: '1 2 3 #4 #5 b7', chord: '7#5', steps: 'W W W W W W', over: '7♯5, 9♯5', versions: 2, shortcut: 'Repeats every whole step; contains no perfect 5th' },
];
export const MODE = Object.fromEntries(MODES.map((m) => [m.id, m]));
export const BRIGHT = ['lydian', 'ionian', 'mixolydian', 'dorian', 'aeolian', 'phrygian', 'locrian'];
// parent major scale of each major mode, as an interval DOWN from the mode's root (Aeolian/Locrian go up)
export const PARENT = { ionian: ['1', 'same'], dorian: ['2', 'a whole step down'], phrygian: ['3', 'a major 3rd down'], lydian: ['4', 'a 4th down'], mixolydian: ['5', 'a 5th down'], aeolian: ['6', 'a minor 3rd up'], locrian: ['7', 'a semitone up'] };
export const formula = (id) => MODE[id].f.split(' ');
export function spell(root, id) { return formula(id).map((t) => up(root, t)); }
export function parentOf(root, id) { return down(root, PARENT[id][0]); }

// ---------- chords ----------
export const CHORD = {
  maj7: { sym: 'maj7', f: ['1', '3', '5', '7'], name: 'major 7' },
  m7: { sym: 'm7', f: ['1', 'b3', '5', 'b7'], name: 'minor 7' },
  7: { sym: '7', f: ['1', '3', '5', 'b7'], name: 'dominant 7' },
  m7b5: { sym: 'm7♭5', f: ['1', 'b3', 'b5', 'b7'], name: 'half-diminished' },
  dim7: { sym: '°7', f: ['1', 'b3', 'b5', 'bb7'], name: 'diminished 7' },
  mMaj7: { sym: 'mMaj7', f: ['1', 'b3', '5', '7'], name: 'minor-major 7' },
  'maj7#5': { sym: 'maj7♯5', f: ['1', '3', '#5', '7'], name: 'major 7 ♯5' },
  '7alt': { sym: '7alt', f: ['1', '3', 'b7', 'b9', '#9', '#11', 'b13'], name: 'altered dominant' },
  '7b9': { sym: '7♭9', f: ['1', '3', '5', 'b7', 'b9'], name: 'dominant ♭9' },
  '7#5': { sym: '7♯5', f: ['1', '3', '#5', 'b7'], name: 'dominant ♯5' },
};
export const csym = (root, q) => nm(root) + CHORD[q].sym;
export const third = (q) => CHORD[q].f.find((x) => /^(b?3)$/.test(x));
export const seventh = (q) => CHORD[q].f.find((x) => /^(b?b?7)$/.test(x));
export function guideTones(root, q) { return [up(root, third(q)), up(root, seventh(q))]; }

// ---------- keys ----------
// circle order with the spellings the spec uses; F♯/G♭ are both valid (6 sharps / 6 flats)
export const MAJOR_KEYS = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'Db', 'Ab', 'Eb', 'Bb', 'F'];
export const MINOR_KEYS = ['A', 'E', 'B', 'F#', 'C#', 'G#', 'D#', 'Bb', 'F', 'C', 'G', 'D'];
export const SIG = { C: 0, G: 1, D: 2, A: 3, E: 4, B: 5, 'F#': 6, 'C#': 7, F: -1, Bb: -2, Eb: -3, Ab: -4, Db: -5, Gb: -6, Cb: -7 };
export const SHARPS = ['F', 'C', 'G', 'D', 'A', 'E', 'B'];
export const FLATS = ['B', 'E', 'A', 'D', 'G', 'C', 'F'];
export function sigNotes(key) {
  const s = SIG[key];
  return s >= 0 ? SHARPS.slice(0, s).map((l) => N(l + '#')) : FLATS.slice(0, -s).map((l) => N(l + 'b'));
}
export const keyRank = (k, minor = false) => {
  const i = (minor ? MINOR_KEYS : MAJOR_KEYS).indexOf(k);
  return i < 0 ? 0 : i <= 6 ? i : 12 - i; // C(0) G(1) F(1) D(2) Bb(2)…
};
export const accCount = (notes) => notes.reduce((s, n) => s + Math.abs(n.acc), 0);
// prefer the root spelling with fewer accidentals in what it produces
export function bestRoot(pcNum, make) {
  const opts = [['C'], ['C#', 'Db'], ['D'], ['Eb', 'D#'], ['E'], ['F'], ['F#', 'Gb'], ['G'], ['Ab', 'G#'], ['A'], ['Bb', 'A#'], ['B']][pcNum].map(N);
  let best = null, bestScore = 1e9;
  for (const r of opts) {
    try { const notes = make(r); const sc = accCount(notes) + Math.abs(r.acc) * 0.5 + (notes.some((n) => Math.abs(n.acc) > 1) ? 3 : 0); if (sc < bestScore) { best = r; bestScore = sc; } } catch (e) { /* triple accidentals */ }
  }
  return best;
}

// degree triangle
export const MAJ_TRI = [
  { r: 'I', d: '1', q: 'maj7', mode: 'ionian' }, { r: 'ii', d: '2', q: 'm7', mode: 'dorian' }, { r: 'iii', d: '3', q: 'm7', mode: 'phrygian' },
  { r: 'IV', d: '4', q: 'maj7', mode: 'lydian' }, { r: 'V', d: '5', q: '7', mode: 'mixolydian' }, { r: 'vi', d: '6', q: 'm7', mode: 'aeolian' }, { r: 'vii', d: '7', q: 'm7b5', mode: 'locrian' },
];
export const MIN_TRI = [
  { r: 'i', d: '1', q: 'm7', mode: 'aeolian' }, { r: 'ii', d: '2', q: 'm7b5', mode: 'locrian' }, { r: '♭III', d: 'b3', q: 'maj7', mode: 'ionian' },
  { r: 'iv', d: '4', q: 'm7', mode: 'dorian' }, { r: 'v', d: '5', q: 'm7', mode: 'phrygian' }, { r: '♭VI', d: 'b6', q: 'maj7', mode: 'lydian' }, { r: '♭VII', d: 'b7', q: '7', mode: 'mixolydian' },
];
export const romanQ = (t) => t.r + (t.q === 'maj7' ? 'maj7' : t.q === '7' ? '7' : t.q === 'm7b5' ? 'ø7' : '7');

// ---------- functional harmony ----------
export const SECONDARY = [
  { target: 'ii', td: '2', tq: 'm7', short: 'VI7', dd: '6', out: '3' },
  { target: 'iii', td: '3', tq: 'm7', short: 'VII7', dd: '7', out: '3' },
  { target: 'IV', td: '4', tq: 'maj7', short: 'I7', dd: '1', out: 'b7' },
  { target: 'V', td: '5', tq: '7', short: 'II7', dd: '2', out: '3' },
  { target: 'vi', td: '6', tq: 'm7', short: 'III7', dd: '3', out: '3' },
];
export const SECONDARY_MINOR = [
  { target: 'iv', td: '4' }, { target: 'v', td: '5' }, { target: '♭VI', td: 'b6' }, { target: '♭VII', td: 'b7' },
];
export const tritoneSub = (root) => up(root, 'b5');
// borrowed chords (degree relative to the tonic, quality, source, typical move)
export const BORROW_MAJOR = [
  { r: 'iv', d: '4', q: 'm7', src: 'Aeolian', move: 'IV–iv–I', shows: 'Fm, Fm6, Fm7' },
  { r: '♭VImaj7', d: 'b6', q: 'maj7', src: 'Aeolian', move: '♭VI–♭VII–I or ♭VI–I' },
  { r: '♭VII7', d: 'b7', q: '7', src: 'Aeolian', move: 'Backdoor: iv7–♭VII7–Imaj7', name: 'backdoor dominant' },
  { r: '♭IIImaj7', d: 'b3', q: 'maj7', src: 'Aeolian or Dorian', move: 'I–♭III–IV' },
  { r: 'iiø7', d: '2', q: 'm7b5', src: 'Aeolian', move: 'iiø7–V7–Imaj7' },
  { r: 'v', d: '5', q: 'm7', src: 'Mixolydian', move: 'v–I7–IVmaj7' },
  { r: '♭VIImaj7', d: 'b7', q: 'maj7', src: 'Mixolydian or Dorian', move: 'I–♭VII–I' },
  { r: '♭IImaj7', d: 'b2', q: 'maj7', src: 'Phrygian', move: '♭II–I' },
  { r: 'II7', d: '2', q: '7', src: 'Lydian', move: 'I–II7, not resolving to V' },
];
export const BORROW_MINOR = [
  { r: 'IV7', d: '4', q: '7', src: 'Dorian', move: 'i–IV7 vamp' },
  { r: 'V7', d: '5', q: '7', src: 'harmonic minor', move: 'V7–i' },
  { r: 'Imaj7', d: '1', q: 'maj7', src: 'parallel major', move: 'Picardy ending' },
  { r: '♭IImaj7', d: 'b2', q: 'maj7', src: 'Phrygian', move: '♭II–V–i or ♭II–i' },
];

// ---------- guide-tone lines ----------
export const PROGS = [
  { id: 'ii-V-I', name: 'Major ii–V–I', ch: [['2', 'm7'], ['5', '7'], ['1', 'maj7']], startA: 7 },
  { id: 'minor-ii-V-i', name: 'Minor ii–V–i', ch: [['2', 'm7b5'], ['5', '7'], ['1', 'm7']], startA: 7, minor: true },
  { id: 'ii-subV-I', name: 'ii–subV–I', ch: [['2', 'm7'], ['b2', '7'], ['1', 'maj7']], startA: 7 },
  { id: 'cycle', name: 'Cycle of dominants', ch: [['3', '7'], ['6', '7'], ['2', '7'], ['5', '7'], ['1', 'maj7']], startA: 3 },
  { id: 'turnaround', name: 'Turnaround from VI7', ch: [['6', '7'], ['2', 'm7'], ['5', '7'], ['1', 'maj7']], startA: 7 },
  { id: 'blues', name: 'Blues I7–IV7', ch: [['1', '7'], ['4', '7']], startA: 3 },
];
export function progChords(tonic, prog) { return prog.ch.map(([d, q]) => ({ root: up(tonic, d), q })); }
const dist = (a, b) => { const x = Math.abs(notePc(a) - notePc(b)) % 12; return Math.min(x, 12 - x); };
// two lines: at each change each line takes the nearest guide tone of the next chord
export function guideLines(tonic, prog) {
  const chords = progChords(tonic, prog);
  const [t0, s0] = guideTones(chords[0].root, chords[0].q);
  const A = [prog.startA === 3 ? t0 : s0], B = [prog.startA === 3 ? s0 : t0];
  for (let i = 1; i < chords.length; i++) {
    const [t, s] = guideTones(chords[i].root, chords[i].q);
    const keep = dist(A.at(-1), t) + dist(B.at(-1), s), swap = dist(A.at(-1), s) + dist(B.at(-1), t);
    if (keep <= swap) { A.push(t); B.push(s); } else { A.push(s); B.push(t); }
  }
  return { chords, A, B };
}
