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
      { iv: 'b5', deg: '♭V', shape: 'maj', result: '7♭9♯11', scale: 'altered / half-whole', why: 'G♭ over C7: ♯11, ♭7, ♭9 — the triad of the tritone sub (G♭7), so it bridges C7 and its substitute.' },
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

// ---------- why it works ----------
// the chord's own scale for each option (the structure is a subset of it)
const SID = {
  maj: { V: 'ionian', II: 'lydian', iii: 'ionian', vii: 'lydian' },
  dom: { v: 'mixolydian', II: 'lydian-dominant', VI: 'diminished-hw', '♭III': 'diminished-hw', '♭V': 'altered', '♭VI': 'altered', '♭iii': 'altered' },
  min: { '*': 'dorian' }, half: { '*': 'locrian', '♭VII': 'locrian-nat2' }, mmaj: { '*': 'melodic-minor' }, dim: { '*': 'diminished-wh' },
};
const sidOf = (key, item) => SID[key][item.deg] || SID[key]['*'];
const CHORD_TONES = { maj: ['1', '3', '5', '7'], dom: ['1', '3', '5', 'b7'], min: ['1', 'b3', '5', 'b7'], half: ['1', 'b3', 'b5', 'b7'], mmaj: ['1', 'b3', '5', '7'], dim: ['1', 'b3', 'b5', 'bb7'] };
const pcAbove = (r, iv) => (T.notePc(r) + T.intervalSemis(iv)) % 12;
const pn = (n) => T.noteName(n, true);

// a short list of reasons, each { k: heading, t: sentence }, computed for this chord root
export function explain(chordRoot, key, item) {
  const r = typeof chordRoot === 'string' ? T.parseNote(chordRoot) : chordRoot;
  const st = structure(r, key, item);
  const tens = st.tensions;
  const sid = sidOf(key, item);
  const sc = T.getScale(sid);
  const scNotes = T.scaleNotes(r, sid);
  const scPcs = scNotes.map(T.notePc);
  const label = (pc) => TENSIONS[key][(pc - T.notePc(r) + 12) % 12];
  const chordSym = T.pretty(T.chordSymbol(r, { maj: 'maj7', dom: '7', min: 'm7', half: 'm7b5', mmaj: 'mMaj7', dim: 'dim7' }[key]));
  const out = [];
  out.push({ k: 'The notes', t: `${st.names.join(' ')} over ${chordSym} = ${tens.join(', ')}.` });
  // 1. a stack of thirds: the triad as the upper floors of the chord
  if (sc.ivs.length === 7) {
    const order = [0, 2, 4, 6, 1, 3, 5]; // 1 3 5 7 9 11 13
    const stack = order.map((i) => scNotes[i]);
    const stackPcs = stack.map(T.notePc);
    const pos = st.pcs.map((pc) => stackPcs.indexOf(pc));
    const sorted = [...pos].sort((a, b) => a - b);
    const consecutive = st.triad && sorted.every((x, i) => x >= 0 && (i === 0 || x === sorted[i - 1] + 1));
    if (consecutive) {
      const top = sorted[0] >= 3;
      out.push({ k: 'Upper floors', t: `Stack ${pn(r)} ${sc.name} in thirds: ${stack.map(pn).join(' ')} (${stack.map((n) => label(T.notePc(n))).join(' ')}). The ${st.name.replace(' triad', '')} triad is three neighbouring floors of that stack${top ? ' — the top of the chord, above the 7th' : ''}: the upper part of the full chord, with the bass and comping supplying the lower notes.` });
    }
  }
  // 2. inside the chord's scale
  const inside = st.pcs.every((pc) => scPcs.includes(pc));
  if (inside) out.push({ k: 'From the chord’s own scale', t: `Every note is in ${pn(r)} ${sc.name} (${scNotes.map(pn).join(' ')}), the scale that fits ${chordSym}, so it adds colour without fighting the chord.` });
  // 3. guide tones
  const tones = CHORD_TONES[key].map((iv) => pcAbove(r, iv));
  const has3 = st.pcs.includes(tones[1]), has7 = st.pcs.includes(tones[3]);
  out.push({ k: 'Guide tones', t: has3 && has7 ? 'It contains both the 3rd and the 7th, so it states the chord on its own.' : has3 || has7 ? `It contains the ${has3 ? '3rd' : '7th'}, so it still names the chord’s quality; the other notes are colour.` : 'It has neither the 3rd nor the 7th: it is pure colour. Let the bass or comping state the chord, or land on a guide tone at the end of your phrase.' });
  // 4. avoid notes: scale notes a half step above a chord tone
  const avoid = scPcs.filter((pc) => !tones.includes(pc) && tones.some((t) => (pc - t + 12) % 12 === 1) && !(key === 'dom' && ['♭9', '♯11', '♭13'].includes(label(pc))) && key !== 'dim');
  if (avoid.length) {
    const hit = avoid.filter((pc) => st.pcs.includes(pc));
    const nm = (pc) => `${pn(scNotes[scPcs.indexOf(pc)])} (${label(pc)})`;
    out.push({ k: 'Avoid notes', t: hit.length ? `It includes ${hit.map(nm).join(', ')}, a half step above a chord tone. That rub is the point here (a suspended sound); over the plain chord, treat it as a passing note.` : `It leaves out ${avoid.map(nm).join(', ')}, the note${avoid.length > 1 ? 's' : ''} a half step above a chord tone, which would clash on a long note.` });
  }
  // 5. dominants: every note's way into the I chord a 4th up
  if (key === 'dom') {
    const I = T.transpose(r, '4');
    const target = [['1', '1'], ['3', '3'], ['5', '5'], ['7', '7'], ['2', '9']].map(([iv, lab]) => ({ pc: pcAbove(I, iv), lab, n: T.transpose(I, iv) }));
    const moves = st.notes.map((n) => {
      const pc = T.notePc(n);
      const same = target.find((x) => x.pc === pc);
      if (same) return `${pn(n)} stays (${same.lab})`;
      const step = target.find((x) => (x.pc - pc + 12) % 12 === 1) || target.find((x) => (pc - x.pc + 12) % 12 === 1);
      if (step) return `${pn(n)} ${(step.pc - pc + 12) % 12 === 1 ? 'rises' : 'falls'} to ${pn(step.n)} (${step.lab})`;
      const whole = target.find((x) => (pc - x.pc + 12) % 12 === 2 || (x.pc - pc + 12) % 12 === 2);
      return whole ? `${pn(n)} steps to ${pn(whole.n)} (${whole.lab})` : `${pn(n)} leaps`;
    });
    out.push({ k: `Resolving to ${pn(I)}`, t: `${moves.join('; ')}. ${moves.filter((m) => /rises|falls/.test(m)).length >= 2 ? 'Half-step pulls like these are what make the tension sound intentional: it has somewhere to go.' : 'Smooth, mostly common-tone motion: a gentle arrival.'}` });
  }
  out.push({ k: T.notePc(r) === 0 ? 'Sound' : 'Sound (example in C)', t: item.why });
  return out;
}

// one sentence for a card's why line
export function shortWhy(chordRoot, key, item) {
  const ex = explain(chordRoot, key, item);
  const has = (k) => ex.find((x) => x.k.startsWith(k));
  const parts = [];
  if (has('Upper floors')) parts.push('it is three neighbouring floors of the chord’s stack of thirds');
  if (has('From the chord')) parts.push(`every note is in the chord’s own scale (${item.scale})`);
  const av = has('Avoid notes'); if (av && /leaves out/.test(av.t)) parts.push('it skips the avoid note');
  const res = ex.find((x) => x.k.startsWith('Resolving')); if (res && /rises|falls/.test(res.t)) parts.push('its notes pull by half step into the I chord');
  return parts.length ? `Why it works: ${parts.join(', ')}.` : '';
}
