// Acceptance tests for the Memory pack engine: reproduce every table in the drill spec, then sanity-check all cards.
// Run: node tools/memory-test.mjs
import * as E from '../src/memory/engine.js';
import { buildDeck, UNITS } from '../src/memory/cards.js';

let fails = 0, passes = 0;
const eq = (label, got, want) => {
  const g = Array.isArray(got) ? got.join(' ') : String(got);
  const w = Array.isArray(want) ? want.join(' ') : String(want);
  if (g === w) passes++; else { fails++; console.log(`✗ ${label}\n    got:  ${g}\n    want: ${w}`); }
};
const S = (root, id) => E.spell(E.N(root), id).map(E.nm);
const n = (s) => E.nm(E.N(s));

// ---- A1 intervals (semitones), and the named examples
for (const [k, , semis] of E.IV) eq(`semis ${k}`, (E.pc(E.up(E.N('C'), E.IV.find((x) => x[0] === k)[1])) - 0 + 12) % 12, semis);
eq('m6 above E♭ is C♭', E.nm(E.up(E.N('Eb'), 'b6')), 'C♭');
eq('M3 above A♭', E.nm(E.up(E.N('Ab'), '3')), 'C');
eq('m7 below D', E.nm(E.down(E.N('D'), 'b7')), 'E');
eq('F♯ up to D', E.intervalName(E.N('F#'), E.N('D')), 'm6');
eq('M3 inverts to m6', E.intervalName(E.N('E'), E.N('C')), 'm6');

// ---- A2 / A4 keys
eq('E♯ in F♯ major', S('F#', 'ionian'), ['F♯', 'G♯', 'A♯', 'B', 'C♯', 'D♯', 'E♯']);
eq('E harmonic minor', S('E', 'harmonic-minor'), ['E', 'F♯', 'G', 'A', 'B', 'C', 'D♯']);
eq('E melodic minor', S('E', 'melodic-minor'), ['E', 'F♯', 'G', 'A', 'B', 'C♯', 'D♯']);
eq('6th of B major', E.nm(E.up(E.N('B'), '6')), 'G♯');
eq('A major sharps', E.sigNotes('A').map(E.nm), ['F♯', 'C♯', 'G♯']);
eq('4 flats', E.sigNotes('Ab').map(E.nm), ['B♭', 'E♭', 'A♭', 'D♭']);

// ---- A5 degree triangle
eq('B♭ major 7ths', E.MAJ_TRI.map((t) => E.csym(E.up(E.N('Bb'), t.d), t.q)), ['B♭maj7', 'Cm7', 'Dm7', 'E♭maj7', 'F7', 'Gm7', 'Am7♭5']);
eq('♭VI in C minor', E.csym(E.up(E.N('C'), 'b6'), 'maj7'), 'A♭maj7');
eq('♭VII in E minor', E.csym(E.up(E.N('E'), 'b7'), '7'), 'D7');
eq('♭VI in F minor', E.nm(E.up(E.N('F'), 'b6')), 'D♭');

// ---- B1 brightness ladder
const B1 = { lydian: '1 2 3 #4 5 6 7', ionian: '1 2 3 4 5 6 7', mixolydian: '1 2 3 4 5 6 b7', dorian: '1 2 b3 4 5 6 b7', aeolian: '1 2 b3 4 5 b6 b7', phrygian: '1 b2 b3 4 5 b6 b7', locrian: '1 b2 b3 4 b5 b6 b7' };
for (const [id, f] of Object.entries(B1)) eq(`formula ${id}`, E.MODE[id].f, f);
eq('A Mixolydian', S('A', 'mixolydian'), ['A', 'B', 'C♯', 'D', 'E', 'F♯', 'G']);
eq('E Phrygian parent', E.nm(E.parentOf(E.N('E'), 'phrygian')), 'C');
eq('G Mixolydian parent', E.nm(E.parentOf(E.N('G'), 'mixolydian')), 'C');
for (const id of E.BRIGHT) for (const r of ['C', 'D', 'Eb', 'F#']) eq(`parent ${r} ${id}`, E.spell(E.parentOf(E.N(r), id), 'ionian').map(E.pc).sort().join(','), E.spell(E.N(r), id).map(E.pc).sort().join(','));

// ---- B2 harmonic minor modes on A
const B2 = [['A', 'harmonic-minor', 'A B C D E F G♯'], ['B', 'locrian-nat6', 'B C D E F G♯ A'], ['C', 'ionian-sharp5', 'C D E F G♯ A B'], ['D', 'dorian-sharp4', 'D E F G♯ A B C'], ['E', 'phrygian-dominant', 'E F G♯ A B C D'], ['F', 'lydian-sharp2', 'F G♯ A B C D E'], ['G#', 'ultralocrian', 'G♯ A B C D E F']];
for (const [r, id, want] of B2) eq(`${r} ${id}`, S(r, id), want.split(' '));
eq('B Phrygian dominant', S('B', 'phrygian-dominant'), ['B', 'C', 'D♯', 'E', 'F♯', 'G', 'A']);
// ---- B3 melodic minor modes on A
const B3 = [['A', 'melodic-minor', 'A B C D E F♯ G♯'], ['B', 'dorian-b2', 'B C D E F♯ G♯ A'], ['C', 'lydian-augmented', 'C D E F♯ G♯ A B'], ['D', 'lydian-dominant', 'D E F♯ G♯ A B C'], ['E', 'mixolydian-b6', 'E F♯ G♯ A B C D'], ['F#', 'locrian-nat2', 'F♯ G♯ A B C D E'], ['G#', 'altered', 'G♯ A B C D E F♯']];
for (const [r, id, want] of B3) eq(`${r} ${id}`, S(r, id), want.split(' '));
eq('D♭ Lydian dominant', S('Db', 'lydian-dominant'), ['D♭', 'E♭', 'F', 'G', 'A♭', 'B♭', 'C♭']);
eq('D♭ Mixolydian', S('Db', 'mixolydian'), ['D♭', 'E♭', 'F', 'G♭', 'A♭', 'B♭', 'C♭']);
eq('A♭ melodic minor', S('Ab', 'melodic-minor'), ['A♭', 'B♭', 'C♭', 'D♭', 'E♭', 'F', 'G']);
// twins: each harmonic/melodic mode is its twin with the stated change
for (const m of E.MODES.filter((x) => x.twin)) {
  const a = m.f.split(' '), b = E.MODE[m.twin].f.split(' ');
  const diff = a.filter((x, i) => x !== b[i]).length;
  eq(`twin ${m.id} differs by ${m.how}`, diff >= 1 && diff <= 2, true);
}
// parent shortcuts
eq('G7alt = A♭ melodic minor', E.nm(E.up(E.N('G'), 'b2')), 'A♭');
eq('D7♯11 = A melodic minor', E.nm(E.up(E.N('D'), '5')), 'A');
eq('F♯m7♭5 = A melodic minor', E.nm(E.up(E.N('F#'), 'b3')), 'A');
eq('E Phrygian dominant = A harmonic minor', E.nm(E.up(E.N('E'), '4')), 'A');
// ---- B4 symmetric
eq('C half-whole', S('C', 'half-whole'), ['C', 'D♭', 'D♯', 'E', 'F♯', 'G', 'A', 'B♭']);
eq('C whole-half', S('C', 'whole-half'), ['C', 'D', 'E♭', 'F', 'G♭', 'A♭', 'A', 'B']);
eq('C whole tone', S('C', 'whole-tone'), ['C', 'D', 'E', 'F♯', 'G♯', 'B♭']);
const hwPcs = (r) => E.spell(E.N(r), 'half-whole').map(E.pc).sort((a, b) => a - b).join(',');
eq('G7 B♭7 D♭7 E7 share one half-whole', new Set(['G', 'Bb', 'Db', 'E'].map(hwPcs)).size, 1);

// ---- C1 secondary dominants in C
eq('secondaries in C', E.SECONDARY.map((s) => E.csym(E.up(E.up(E.N('C'), s.td), '5'), '7')), ['A7', 'B7', 'C7', 'D7', 'E7']);
eq('out-of-key notes in C', E.SECONDARY.map((s) => E.nm(E.up(E.up(E.up(E.N('C'), s.td), '5'), s.out))), ['C♯', 'D♯', 'B♭', 'F♯', 'G♯']);
eq('V7/V in A♭', E.csym(E.up(E.up(E.N('Ab'), '5'), '5'), '7'), 'B♭7');
eq('D major secondaries', E.SECONDARY.map((s) => E.csym(E.up(E.up(E.N('D'), s.td), '5'), '7')), ['B7', 'C♯7', 'D7', 'E7', 'F♯7']);
eq('V7/vi in F out-of-key', E.nm(E.up(E.up(E.up(E.N('F'), '6'), '5'), '3')), 'C♯');
eq('A minor secondaries', E.SECONDARY_MINOR.map((s) => E.csym(E.up(E.up(E.N('A'), s.td), '5'), '7')), ['A7', 'B7', 'C7', 'D7']);
// ---- C2
eq('tritone pairs', ['C', 'G', 'D', 'A', 'E', 'B'].map((r) => E.nm(E.tritoneSub(E.N(r)))), ['G♭', 'D♭', 'A♭', 'E♭', 'B♭', 'F']);
eq('G7 / D♭7 share guide tones', E.guideTones(E.N('Db'), '7').map(E.nm), ['F', 'C♭']);
// ---- C3
eq('borrowed in C', E.BORROW_MAJOR.map((b) => E.csym(E.up(E.N('C'), b.d), b.q)), ['Fm7', 'A♭maj7', 'B♭7', 'E♭maj7', 'Dm7♭5', 'Gm7', 'B♭maj7', 'D♭maj7', 'D7']);
eq('borrowed in A minor', E.BORROW_MINOR.map((b) => E.csym(E.up(E.N('A'), b.d), b.q)), ['D7', 'E7', 'Amaj7', 'B♭maj7']);
eq('backdoor in E♭', E.csym(E.up(E.N('Eb'), 'b7'), '7'), 'D♭7');
// ---- D1
eq('guide tones in C', ['maj7', '7', 'm7', 'm7b5', 'mMaj7', 'dim7'].map((q) => E.guideTones(E.N('C'), q).map(E.nm).join('')), ['EB', 'EB♭', 'E♭B♭', 'E♭B♭', 'E♭B', 'E♭B𝄫']);
eq('E♭maj7', E.guideTones(E.N('Eb'), 'maj7').map(E.nm), ['G', 'D']);
eq('F♯7', E.guideTones(E.N('F#'), '7').map(E.nm), ['A♯', 'E']);
// ---- D3 lines in C, as in the spec
const L = (id, tonic = 'C') => { const g = E.guideLines(E.N(tonic), E.PROGS.find((p) => p.id === id)); return [g.A.map(E.nm), g.B.map(E.nm)]; };
const D3 = { 'ii-V-I': ['C B B', 'F F E'], 'minor-ii-V-i': ['C B B♭', 'F F E♭'], 'ii-subV-I': ['C C♭ B', 'F F E'], cycle: ['G♯ G F♯ F E', 'D C♯ C B B'], turnaround: ['G F F E', 'C♯ C B B'], blues: ['E E♭', 'B♭ A'] };
for (const [id, [a, b]] of Object.entries(D3)) { const [ga, gb] = L(id); eq(`${id} line A`, ga, a.split(' ')); eq(`${id} line B`, gb, b.split(' ')); }
eq('A♭ ii–V–I', L('ii-V-I', 'Ab').map((x) => x.join(' ')), ['A♭ G G', 'D♭ D♭ C']);
eq('cycle into F', L('cycle', 'F').map((x) => x.join(' ')), ['C♯ C B B♭ A', 'G F♯ F E E']);
// all 12 keys: transposing the C lines by the key interval gives the same pitch classes
for (const id of Object.keys(D3)) for (const k of E.MAJOR_KEYS) {
  const shift = E.pc(E.N(k));
  const [ca, cb] = L(id, 'C'), [ka, kb] = L(id, k);
  eq(`${id} in ${k} transposes`, ka.map((x) => E.pc(E.N(x))).concat(kb.map((x) => E.pc(E.N(x)))).join(','), ca.concat(cb).map((x) => (E.pc(E.N(x)) + shift) % 12).join(','));
  // and every line note is a guide tone of its chord (correct spelling)
  const g = E.guideLines(E.N(k), E.PROGS.find((p) => p.id === id));
  g.chords.forEach((c, i) => { const gt = E.guideTones(c.root, c.q); eq(`${id} ${k} chord ${i} spelled from chord`, [g.A[i], g.B[i]].every((x) => gt.some((y) => E.same(x, y))), true); });
}

// ---- deck sanity
const deck = buildDeck();
const bad = [];
for (const c of deck) {
  const all = [c.prompt, c.why, ...(c.hints || []), ...(c.answer || []), ...((c.accept || []).flat())].join(' ');
  if (/undefined|NaN|null/.test(all)) bad.push(`${c.id}: undefined in text`);
  if (/(♭♭|♯♯|𝄫♭|𝄪♯|bbb|###)/.test(all)) bad.push(`${c.id}: triple accidental`);
  if (!c.answer || !c.answer.length) bad.push(`${c.id}: no answer`);
  if (!c.hints || c.hints.length !== 3) bad.push(`${c.id}: hints`);
  if (c.input === 'choice' && !(c.choices || []).includes(c.answer[0])) bad.push(`${c.id}: answer not in choices`);
}
eq('deck problems', bad.slice(0, 10), []);
const ids = new Set(); for (const c of deck) { if (ids.has(c.id)) bad.push('dup ' + c.id); ids.add(c.id); }
eq('unique ids', bad.filter((b) => b.startsWith('dup')).length, 0);
const byUnit = {}; for (const c of deck) byUnit[c.unit] = (byUnit[c.unit] || 0) + 1;
const byMod = {}; for (const c of deck) byMod[c.module] = (byMod[c.module] || 0) + 1;
const types = {}; for (const c of deck) types[c.type] = (types[c.type] || 0) + 1;
console.log('cards per unit:', UNITS.map((u) => `${u.id} ${byUnit[u.id] || 0}`).join(' · '));
console.log('per module:', JSON.stringify(byMod), '· types:', JSON.stringify(types), '· total', deck.length);
console.log(`${passes} passed, ${fails} failed`);
process.exit(fails ? 1 : 0);
