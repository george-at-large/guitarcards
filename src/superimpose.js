// Superimposition: triads and pentatonics played over a chord, named by the chord degree they are built on
// and read as the tensions they add to that chord. One data table feeds the Memory pack cards and Deep chord study.
import * as T from './theory.js';

const SHAPES = {
  maj: ['1', '3', '5'], min: ['1', 'b3', '5'],
  pent: ['1', '2', '3', '5', '6'], mpent: ['1', 'b3', '4', '5', 'b7'],
};
const SHAPE_NAME = { maj: 'major triad', min: 'minor triad', pent: 'major pentatonic', mpent: 'minor pentatonic' };

// semitones above the chord root -> how that note reads over the chord
const TENSIONS = {
  maj: ['1', '♭9', '9', '♯9', '3', '11', '♯11', '5', '♯5', '13', '♭7', '7'],
  dom: ['1', '♭9', '9', '♯9', '3', '11', '♯11', '5', '♭13', '13', '♭7', '7'],
  min: ['1', '♭9', '9', '♭3', '3', '11', '♭5', '5', '♭13', '13', '♭7', '7'],
  half: ['1', '♭9', '9', '♭3', '3', '11', '♭5', '5', '♭13', '13', '♭7', '7'],
  mmaj: ['1', '♭9', '9', '♭3', '3', '11', '♯11', '5', '♭13', '13', '♭7', '7'],
  dim: ['1', '♭9', '9', '♭3', '3', '11', '♭5', '5', '♭13', '°7', '♭7', '7'],
};

// iv = interval from the chord root to the structure's root; deg = the roman name players use
const MENUS = {
  maj: {
    label: 'major 7', example: 'maj7',
    items: [
      { iv: '5', deg: 'V', shape: 'maj', result: 'maj9', scale: 'Ionian', why: 'The triad a 5th up adds the 7 and 9 on top of the chord: the plainest, prettiest upper structure.' },
      { iv: '2', deg: 'II', shape: 'maj', result: 'maj13♯11', scale: 'Lydian', why: 'The major triad a step up gives 9, ♯11 and 13: the whole Lydian colour in three notes.' },
      { iv: '3', deg: 'iii', shape: 'min', result: 'maj7 (no root)', scale: 'Ionian', why: 'The minor triad on the 3rd is the chord without its root: 3, 5, 7. Safe, inside, and a smooth way to target the 3rd.' },
      { iv: '7', deg: 'vii', shape: 'min', result: 'maj9♯11', scale: 'Lydian', why: 'B minor over C: 7, 9, ♯11. Bright and floating.' },
      { iv: '2', deg: 'II', shape: 'pent', result: 'maj13♯11', scale: 'Lydian', why: 'Major pentatonic a step up: 9, 3, ♯11, 13, 7 — no root and no 4th, so nothing clashes.' },
      { iv: '5', deg: 'V', shape: 'pent', result: 'maj13', scale: 'Ionian', why: 'Major pentatonic a 5th up: 5, 13, 7, 9, 3 — Ionian without the avoid note (the 4th).' },
    ],
  },
  dom: {
    label: 'dominant 7', example: '7',
    items: [
      { iv: '5', deg: 'v', shape: 'min', result: '9', scale: 'Mixolydian', why: 'The minor triad a 5th up: 5, ♭7, 9. Plain, inside dominant sound.' },
      { iv: '2', deg: 'II', shape: 'maj', result: '13♯11', scale: 'Lydian dominant', why: 'The major triad a step up: 9, ♯11, 13. The Lydian dominant sound used on IV7, ♭VII7 and tritone subs.' },
      { iv: '6', deg: 'VI', shape: 'maj', result: '13♭9', scale: 'half-whole diminished', why: 'The major triad a major 6th up: 13, ♭9, 3. Bright and tense at once; resolves beautifully.' },
      { iv: 'b3', deg: '♭III', shape: 'maj', result: '7♯9', scale: 'half-whole diminished', why: 'E♭ over C7: ♯9, 5, ♭7. The bluesy ♯9 sound.' },
      { iv: 'b5', deg: '♭V', shape: 'maj', result: '7♭9♯11', scale: 'altered / half-whole', why: 'The triad of the tritone sub: ♯11, ♭7, ♭9. The bridge between G7 and D♭7.' },
      { iv: 'b6', deg: '♭VI', shape: 'maj', result: '7♯9♭13', scale: 'altered', why: 'A♭ over C7: ♭13, 1, ♯9. Dark and altered, resolves down to the I.' },
      { iv: 'b3', deg: '♭iii', shape: 'mpent', result: '7alt', scale: 'altered', why: 'Minor pentatonic a minor 3rd up: ♯9, ♯11, ♭13, ♭7, ♭9 — five altered notes, no root, no 3rd.' },
      { iv: '5', deg: 'v', shape: 'mpent', result: '9sus4', scale: 'Mixolydian', why: 'Minor pentatonic a 5th up: 5, ♭7, 1, 9, 11. Suspended, open, great on 7sus4.' },
    ],
  },
  min: {
    label: 'minor 7', example: 'm7',
    items: [
      { iv: 'b3', deg: '♭III', shape: 'maj', result: 'm7 (no root)', scale: 'Dorian / Aeolian', why: 'E♭ over Cm7: ♭3, 5, ♭7. The chord without its root.' },
      { iv: '5', deg: 'v', shape: 'min', result: 'm9', scale: 'Dorian / Aeolian', why: 'The minor triad a 5th up: 5, ♭7, 9.' },
      { iv: 'b7', deg: '♭VII', shape: 'maj', result: 'm11', scale: 'Dorian / Aeolian', why: 'B♭ over Cm7: ♭7, 9, 11. Open, modern minor.' },
      { iv: '4', deg: 'IV', shape: 'maj', result: 'm13', scale: 'Dorian', why: 'F over Cm7: 11, 13, 1. The natural 13 is the Dorian note.' },
      { iv: '1', deg: 'i', shape: 'mpent', result: 'm11', scale: 'Dorian / Aeolian', why: 'The home minor pentatonic: 1, ♭3, 11, 5, ♭7.' },
      { iv: '2', deg: 'ii', shape: 'mpent', result: 'm13', scale: 'Dorian', why: 'Minor pentatonic a step up: 9, 11, 5, 13, 1 — the Dorian pentatonic.' },
      { iv: '5', deg: 'v', shape: 'mpent', result: 'open m11 (no 3rd)', scale: 'Dorian / Aeolian', why: 'Minor pentatonic a 5th up: 5, ♭7, 1, 9, 11 — no 3rd, so it floats.' },
    ],
  },
  half: {
    label: 'half-diminished', example: 'm7b5',
    items: [
      { iv: 'b3', deg: '♭iii', shape: 'min', result: 'm7♭5 (no root)', scale: 'Locrian', why: 'E♭m over Cø7: ♭3, ♭5, ♭7. The chord without its root.' },
      { iv: 'b6', deg: '♭VI', shape: 'maj', result: 'm7♭5♭13', scale: 'Locrian', why: 'A♭ over Cø7: ♭13, 1, ♭3.' },
      { iv: 'b7', deg: '♭VII', shape: 'maj', result: 'm9♭5', scale: 'Locrian ♮2', why: 'B♭ over Cø7: ♭7, 9, 11. The natural 9 is the melodic-minor (Locrian ♮2) colour.' },
      { iv: '4', deg: 'iv', shape: 'mpent', result: 'm11♭5', scale: 'Locrian', why: 'Minor pentatonic a 4th up: 11, ♭13, ♭7, 1, ♭3.' },
      { iv: 'b3', deg: '♭iii', shape: 'mpent', result: 'm7♭5♭9', scale: 'Locrian', why: 'Minor pentatonic a minor 3rd up: ♭3, ♭5, ♭13, ♭7, ♭9.' },
    ],
  },
  mmaj: {
    label: 'minor-major 7 / minor 6', example: 'mMaj7',
    items: [
      { iv: '5', deg: 'V', shape: 'maj', result: 'm(maj9)', scale: 'melodic minor', why: 'G over Cm: 5, 7, 9. The major triad a 5th up is the sound of melodic minor.' },
      { iv: '4', deg: 'IV', shape: 'maj', result: 'm6/9', scale: 'melodic minor / Dorian', why: 'F over Cm: 11, 13, 1.' },
      { iv: '2', deg: 'ii', shape: 'mpent', result: 'm6/9', scale: 'melodic minor', why: 'Minor pentatonic a step up: 9, 11, 5, 13, 1.' },
    ],
  },
  dim: {
    label: 'diminished 7', example: 'dim7',
    items: [
      { iv: '2', deg: 'II', shape: 'maj', result: '°7 with 9, 11', scale: 'whole-half diminished', why: 'D over C°7: 9, ♭5, 13(=°7). Any major triad a step above a dim7 note fits.' },
      { iv: '7', deg: 'VII', shape: 'maj', result: '°(maj7)', scale: 'whole-half diminished', why: 'B over C°7: 7, ♭3, ♭5. The leading-tone triad hidden in the scale.' },
    ],
  },
};

const MENU_OF = {
  maj: 'maj', maj7: 'maj', 6: 'maj', '6/9': 'maj', maj9: 'maj', 'maj7#11': 'maj', maj13: 'maj', 'maj9#11': 'maj', add9: 'maj',
  7: 'dom', 9: 'dom', 13: 'dom', '7#11': 'dom', '13#11': 'dom', '7b9': 'dom', '7#9': 'dom', '7b13': 'dom', '13b9': 'dom', '7b9b13': 'dom', '7#9b13': 'dom', '7alt': 'dom', '7sus4': 'dom', '9sus4': 'dom', '13sus4': 'dom', '7#9#5': 'dom', 11: 'dom',
  min: 'min', m7: 'min', m9: 'min', m11: 'min', m13: 'min', madd9: 'min',
  m7b5: 'half', mMaj7: 'mmaj', m6: 'mmaj', 'm6/9': 'mmaj', mMaj9: 'mmaj', dim7: 'dim', dim: 'dim',
};

export const menuKey = (quality) => MENU_OF[quality] || null;
export const MENU_KEYS = Object.keys(MENUS);
export const menu = (key) => MENUS[key];
export const shapeName = (shape) => SHAPE_NAME[shape];
export const tensionsOf = (key, item) => SHAPES[item.shape].map((iv) => TENSIONS[key][(T.intervalSemis(item.iv) + T.intervalSemis(iv)) % 12]);
export const itemName = (item) => `${item.deg} ${SHAPE_NAME[item.shape]}`;

// the structure on a real chord root: its name, notes, and what each note is over the chord
export function structure(chordRoot, key, item) {
  const r = typeof chordRoot === 'string' ? T.parseNote(chordRoot) : chordRoot;
  const sroot = T.transpose(r, item.iv);
  const notes = SHAPES[item.shape].map((iv) => T.transpose(sroot, iv));
  const tens = tensionsOf(key, item);
  const rootName = T.noteName(sroot, true);
  const name = `${rootName}${item.shape === 'min' ? 'm' : ''}${item.shape === 'pent' ? ' major pentatonic' : item.shape === 'mpent' ? ' minor pentatonic' : ' triad'}`;
  return { name, rootName, sroot, notes, names: notes.map((n) => T.noteName(n, true)), pcs: notes.map(T.notePc), tensions: tens, triad: item.shape === 'maj' || item.shape === 'min' ? item.shape : null };
}
