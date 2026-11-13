// Chord sets, colour tiers, numerals and spelling. A chord is { iv, q }: its root as an interval above the tonic,
// measured against the tonic's MAJOR scale ('b6' = A♭ in C), and an engine chord quality. Numerals follow the same
// convention as the rest of the app: in C minor, E♭ is ♭III.
import * as T from '../theory.js';

// ---------- spelling ----------
const IV_BY_SEMI = ['1', 'b2', '2', 'b3', '3', '4', '#4', '5', 'b6', '6', 'b7', '7'];
const ROMAN = { 1: 'I', 2: 'II', 3: 'III', 4: 'IV', 5: 'V', 6: 'VI', 7: 'VII' };
const ODD = new Set(['Cb', 'Fb', 'E#', 'B#']);
// the numerals a chart may keep from its spelling (♯I°7, ♭V7); anything odder (♭IV, ♯III) falls back to the usual name
const SPELLABLE = ['1', '#1', 'b2', '2', '#2', 'b3', '3', '4', '#4', 'b5', '5', '#5', 'b6', '6', 'b7', '7'];

export function spell(tonic, iv) {
  let r = T.transpose(tonic, iv);
  if (Math.abs(r.acc) > 1 || ODD.has(T.noteName(r))) r = T.enharmonic(r);
  return r;
}
// the interval from a tonic up to a spelled root, keeping the letter distance ('Db' over C = b2, 'C#' over C = #1)
export function ivFrom(tonic, root) {
  const deg = ((root.letter - tonic.letter) % 7 + 7) % 7 + 1;
  const semis = ((T.notePc(root) - T.notePc(tonic)) % 12 + 12) % 12;
  const hit = SPELLABLE.find((k) => T.INTERVALS[k][0] === deg && T.INTERVALS[k][1] % 12 === semis);
  return hit || IV_BY_SEMI[semis];
}
export const semisOf = (iv) => T.intervalSemis(iv) % 12;
export const randomIv = () => IV_BY_SEMI[Math.floor(Math.random() * 12)];

// ---------- numerals ----------
const LOWER = new Set(['min', 'm7', 'm6', 'm9', 'm11', 'm13', 'mMaj7', 'mMaj9', 'm7b5', 'dim', 'dim7', 'madd9', 'm6/9', 'm7#5', 'dim-maj7']);
// when a colour chord has no grip in the position, step down to its plainer cousin
const SIMPLER = { '13': '9', '9': '7', '13b9': '7b9', '7b9b13': '7b9', '7#9b13': '7#9', '7alt': '7b9', '7b9': '7', '7#9': '7', '7#11': '9', '7b13': '7', '7#5': 'aug',
  maj13: 'maj9', maj9: 'maj7', '6/9': '6', '6': 'maj', 'maj7#11': 'maj7', 'maj9#11': 'maj7#11', add9: 'maj', 'maj7#5': 'aug', maj7: 'maj',
  m13: 'm9', m11: 'm7', m9: 'm7', 'm6/9': 'm6', m6: 'min', madd9: 'min', mMaj9: 'mMaj7', mMaj7: 'min', m7: 'min', m7b5: 'dim', dim7: 'dim',
  '13sus4': '9sus4', '9sus4': '7sus4', '7sus4': 'sus4', '11': '7sus4', '7': 'maj' };
export const simpler = (q) => SIMPLER[q] || null;
export const isMinorish = (q) => LOWER.has(q);
export function numeral(iv, q) {
  const m = /^(bb|b|#)?(\d)$/.exec(iv);
  const acc = { b: '♭', bb: '𝄫', '#': '♯' }[m[1]] || '';
  let rn = ROMAN[m[2]];
  if (LOWER.has(q)) rn = rn.toLowerCase();
  let suf = T.getChord(q).sym;
  if (q === 'm7b5') suf = 'ø7';
  else if (q === 'min' || q === 'maj') suf = '';
  else if (LOWER.has(q) && suf.startsWith('m') && !suf.startsWith('maj')) suf = suf.slice(1);
  return acc + rn + T.pretty(suf).trim();
}
// a chord's numeral; secondary chords read as function + quality / target (V7/ii, ii7/V)
export function label(spec, q = spec.q) {
  if (!spec.rel) return numeral(spec.iv, q);
  const suf = numeral('1', q).replace(/^[IiVv]+/, '');
  return T.prettyRoman(spec.rel.fn) + suf + '/' + T.prettyRoman(spec.rel.to);
}
export const chordName = (root, q) => T.pretty(T.chordSymbol(root, q)).replace(/\s+/g, '');

// ---------- colour tiers ----------
export const COLOURS = [
  { id: 'tri', name: 'Triads', blurb: 'Three-note chords: the CAGED shapes as you first learned them.' },
  { id: 'sev', name: 'Sevenths', blurb: 'maj7, m7, 7, ø7, °7: the same shapes with one finger moved.' },
  { id: 'col', name: 'Colour tones', blurb: '9ths, 11ths, 13ths, 6/9, ♯11, altered dominants: real jazz and soul grips in the shape.' },
];
const TRIAD = { maj: 'maj', min: 'min', dim: 'dim', aug: 'aug', sus4: 'sus4', sus2: 'sus2', '5': 'maj', maj7: 'maj', '6': 'maj', 'maj9': 'maj', '6/9': 'maj', add9: 'maj', 'maj7#11': 'maj', 'maj9#11': 'maj', maj13: 'maj', m7: 'min', m6: 'min', m9: 'min', m11: 'min', m13: 'min', mMaj7: 'min', mMaj9: 'min', madd9: 'min', 'm6/9': 'min', m7b5: 'dim', dim7: 'dim', '7': 'maj', '9': 'maj', '13': 'maj', '7b9': 'maj', '7#9': 'maj', '7#11': 'maj', '7alt': 'maj', '7b13': 'maj', '13b9': 'maj', '13#11': 'maj', '7b9b13': 'maj', '7sus4': 'sus4', '9sus4': 'sus4', '13sus4': 'sus4', '7#5': 'aug', 'maj7#5': 'aug', '11': 'sus4' };
export const toTriad = (q) => TRIAD[q] || 'maj';

// a triad made a seventh chord by its job in the key: V and secondary dominants get the ♭7, everything major
// otherwise gets maj7, minor m7, diminished ø7 (°7 when it is a passing or leading-tone diminished)
export function toSeventh(q, iv, { dominant = false, minorKey = false } = {}) {
  if (T.getChord(q).ivs.length >= 4) return q;
  if (q === 'maj') return dominant || semisOf(iv) === 7 || (minorKey && semisOf(iv) === 10) ? '7' : 'maj7';
  if (q === 'min') return 'm7';
  if (q === 'dim') return minorKey && semisOf(iv) === 11 ? 'dim7' : 'm7b5';
  if (q === 'aug') return '7#5';
  if (q === 'sus4') return '7sus4';
  if (q === 'sus2') return 'add9';
  return q;
}
// colour versions of a seventh chord; `toMinor` = it resolves to a minor chord (a dark dominant: ♭9, ♯9, alt)
export function colourOptions(q, iv, { toMinor = false, minorKey = false } = {}) {
  const s = semisOf(iv);
  switch (q) {
    case 'maj7': return s === 5 || s === 8 || s === 1 ? ['maj7#11', 'maj9', '6/9'] : ['maj9', '6/9', 'maj7'];
    case 'm7': return s === 4 || s === 11 || (minorKey && s === 7) ? ['m11', 'm7'] : ['m9', 'm11'];
    case '7': if (toMinor) return ['7b9', '7#9', '7alt'];
      return s === 1 || s === 8 || (s === 10 && !minorKey) ? ['9', '7#11', '13'] : ['13', '9', '7sus4'];
    case 'm6': return ['m6/9', 'm6'];
    case '6': return ['6/9'];
    case 'mMaj7': return ['mMaj9', 'mMaj7'];
    case 'maj': return ['add9', '6/9'];
    case 'min': return ['madd9', 'm7'];
    default: return [q];
  }
}

// ---------- chord sets ----------
// [iv, triad, seventh, colours, numeral override, job, group]
// rn: 'V7/ii' marks a secondary dominant (labelled V7/ii, V♭9/ii… as its colour changes); 'tag:…' a nickname
const E = (iv, tri, sev, col, rn, fn, group) => {
  const e = { iv, tri, sev, col, fn, group };
  if (rn && rn.startsWith('V7/')) e.rel = { fn: 'V', to: rn.slice(3) };
  else if (rn && rn.startsWith('tag:')) e.tag = rn.slice(4);
  return e;
};
export const SETS = {
  major: [
    { id: 'dia', name: 'Diatonic', blurb: 'The seven chords of the major key.', groups: ['dia'] },
    { id: 'exp', name: 'Diatonic + modal interchange', blurb: 'Adds the chords borrowed from the parallel minor: i, iiø, ♭III, iv, v, ♭VI, ♭VII.', groups: ['dia', 'mi'] },
    { id: 'chr', name: 'Everything', blurb: 'Adds secondary dominants, passing diminished, tritone subs, the Neapolitan, augmented and chromatic mediants.', groups: ['dia', 'mi', 'chr'] },
    { id: 'any', name: 'Any chord', blurb: 'Any root, any type. The numeral still tells you where it sits in the key.', groups: [] },
  ],
  minor: [
    { id: 'dia', name: 'Diatonic', blurb: 'Natural minor plus the harmonic-minor V7 and vii°7.', groups: ['dia'] },
    { id: 'exp', name: 'Diatonic + modal interchange', blurb: 'Adds Dorian ii and IV, the Picardy I, the Neapolitan ♭II and the minor-major tonic.', groups: ['dia', 'mi'] },
    { id: 'chr', name: 'Everything', blurb: 'Adds secondary dominants, tritone subs, the augmented sixth, diminished passing chords and chromatic mediants.', groups: ['dia', 'mi', 'chr'] },
    { id: 'any', name: 'Any chord', blurb: 'Any root, any type. The numeral still tells you where it sits in the key.', groups: [] },
  ],
};
export const PALETTE = {
  major: [
    E('1', 'maj', 'maj7', ['maj9', '6/9'], null, 'Tonic: home', 'dia'),
    E('2', 'min', 'm7', ['m9', 'm11'], null, 'Predominant: sets up V', 'dia'),
    E('3', 'min', 'm7', ['m11'], null, 'Weak tonic, often heads to vi', 'dia'),
    E('4', 'maj', 'maj7', ['maj7#11', 'maj9', '6/9'], null, 'Predominant: Lydian colour', 'dia'),
    E('5', 'maj', '7', ['13', '9', '9sus4'], null, 'Dominant: pulls home', 'dia'),
    E('6', 'min', 'm7', ['m9', 'm11'], null, 'Relative minor', 'dia'),
    E('7', 'dim', 'm7b5', ['m7b5'], null, 'Dominant function (rootless V9)', 'dia'),
    E('1', 'min', 'm7', ['m9', 'm11'], null, 'Parallel minor tonic', 'mi'),
    E('2', 'dim', 'm7b5', ['m7b5'], null, 'Minor ii: darker predominant', 'mi'),
    E('b3', 'maj', 'maj7', ['maj9', '6/9'], null, 'Borrowed ♭III', 'mi'),
    E('4', 'min', 'm7', ['m6', 'm9'], null, 'Minor iv: the tear-jerker (iv → I)', 'mi'),
    E('5', 'min', 'm7', ['m11'], null, 'Minor v: a dominant with no pull', 'mi'),
    E('b6', 'maj', 'maj7', ['maj7#11', 'maj9'], null, 'Borrowed ♭VI: cinematic', 'mi'),
    E('b7', 'maj', '7', ['9', '13'], null, 'Backdoor dominant (♭VII7 → I)', 'mi'),
    E('6', 'maj', '7', ['7b9', '7alt'], 'V7/ii', 'Secondary dominant → ii', 'chr'),
    E('7', 'maj', '7', ['7b9', '7#9'], 'V7/iii', 'Secondary dominant → iii', 'chr'),
    E('1', 'maj', '7', ['9', '13'], 'V7/IV', 'Secondary dominant → IV', 'chr'),
    E('2', 'maj', '7', ['9', '13'], 'V7/V', 'Secondary dominant → V', 'chr'),
    E('3', 'maj', '7', ['7b9', '7#9', '7alt'], 'V7/vi', 'Secondary dominant → vi', 'chr'),
    E('#1', 'dim', 'dim7', ['dim7'], null, 'Passing diminished: I → ii', 'chr'),
    E('#4', 'dim', 'dim7', ['dim7'], null, 'Passing diminished: IV → V', 'chr'),
    E('#5', 'dim', 'dim7', ['dim7'], null, 'Leading-tone diminished → vi', 'chr'),
    E('b2', 'maj', '7', ['9', '7#11'], 'tag:subV', 'Tritone sub for V7', 'chr'),
    E('b2', 'maj', 'maj7', ['maj7#11'], 'tag:Neapolitan', 'Neapolitan: Phrygian colour', 'chr'),
    E('b6', 'maj', '7', ['9', '7#11'], null, 'Tritone sub of V7/V; augmented sixth', 'chr'),
    E('1', 'aug', 'maj7#5', ['maj7#5'], null, 'Augmented tonic: the rising line', 'chr'),
    E('5', 'aug', '7#5', ['7#5', '7alt'], null, 'Augmented dominant', 'chr'),
    E('3', 'maj', 'maj7', ['maj9'], null, 'Chromatic mediant', 'chr'),
    E('6', 'maj', 'maj7', ['maj9'], null, 'Chromatic mediant', 'chr'),
  ],
  minor: [
    E('1', 'min', 'm7', ['m9', 'm11'], null, 'Tonic: home', 'dia'),
    E('2', 'dim', 'm7b5', ['m7b5'], null, 'Predominant: minor ii', 'dia'),
    E('b3', 'maj', 'maj7', ['maj9', '6/9'], null, 'Relative major', 'dia'),
    E('4', 'min', 'm7', ['m9', 'm11'], null, 'Predominant: minor iv', 'dia'),
    E('5', 'min', 'm7', ['m11'], null, 'Natural-minor v: modal, no pull', 'dia'),
    E('b6', 'maj', 'maj7', ['maj7#11', 'maj9'], null, 'Warm ♭VI', 'dia'),
    E('b7', 'maj', '7', ['9', '13', '9sus4'], null, 'Subtonic: V of ♭III', 'dia'),
    E('5', 'maj', '7', ['7b9', '7alt', '7#9'], null, 'Harmonic-minor dominant: pulls home', 'dia'),
    E('7', 'dim', 'dim7', ['dim7'], null, 'Leading-tone diminished (rootless V7♭9)', 'dia'),
    E('1', 'maj', 'maj7', ['maj9', '6/9'], 'tag:Picardy', 'Major tonic borrowed from the parallel major', 'mi'),
    E('2', 'min', 'm7', ['m9'], null, 'Dorian ii: a lighter predominant', 'mi'),
    E('4', 'maj', '7', ['9', '13'], null, 'Dorian IV: the bright minor sound', 'mi'),
    E('b2', 'maj', 'maj7', ['maj7#11'], 'tag:Neapolitan', 'Neapolitan: Phrygian colour', 'mi'),
    E('1', 'min', 'mMaj7', ['mMaj9', 'mMaj7'], null, 'Minor-major tonic: the line cliché', 'mi'),
    E('1', 'min', 'm6', ['m6/9', 'm6'], null, 'Minor six tonic: Dorian colour', 'mi'),
    E('1', 'maj', '7', ['9', '7b9'], 'V7/iv', 'Secondary dominant → iv', 'chr'),
    E('2', 'maj', '7', ['9', '13'], 'V7/V', 'Secondary dominant → V', 'chr'),
    E('b3', 'maj', '7', ['9', '13'], 'V7/♭VI', 'Secondary dominant → ♭VI', 'chr'),
    E('4', 'maj', '7', ['9', '13'], 'V7/♭VII', 'Secondary dominant → ♭VII', 'chr'),
    E('b2', 'maj', '7', ['9', '7#11'], 'tag:subV', 'Tritone sub for V7', 'chr'),
    E('b6', 'maj', '7', ['9', '7#11'], 'tag:German sixth', 'Augmented sixth → V', 'chr'),
    E('#4', 'dim', 'dim7', ['dim7'], null, 'Passing diminished: iv → V', 'chr'),
    E('5', 'aug', '7#5', ['7#5', '7alt'], null, 'Augmented dominant', 'chr'),
    E('b3', 'aug', 'maj7#5', ['maj7#5'], null, 'Harmonic/melodic-minor ♭III+', 'chr'),
    E('6', 'dim', 'm7b5', ['m7b5'], null, 'Raised-6th half-diminished (melodic minor)', 'chr'),
    E('3', 'maj', 'maj7', ['maj9'], null, 'Chromatic mediant', 'chr'),
    E('b6', 'min', 'm7', ['m9'], null, 'Dark mediant', 'chr'),
  ],
};
export const ANY_QUALITIES = {
  tri: ['maj', 'min', 'dim', 'aug', 'sus4'],
  sev: ['maj7', '7', 'm7', 'm7b5', 'dim7', 'mMaj7', '6', 'm6', '7sus4'],
  col: ['maj9', '6/9', 'maj7#11', '9', '13', '7b9', '7#9', '7alt', 'm9', 'm11', '9sus4', 'add9'],
};
export function setPool(kt, setId) {
  const set = SETS[kt].find((s) => s.id === setId) || SETS[kt][0];
  return PALETTE[kt].filter((e) => set.groups.includes(e.group));
}
export const GROUP_NAMES = { dia: 'Diatonic', mi: 'Modal interchange', chr: 'Chromatic' };
