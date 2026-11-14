// Why this colour? For a chord with colour tones (9ths, 11ths, 13ths, a 6, ♯11, altered tensions, sus, a minor-major
// 7th), what each added note is, where it comes from (the key itself, or which scale it borrows from), why it suits
// this chord's job here, and where it tends to go next. Pure: words only.
import * as T from '../theory.js';
import * as F from '../fretboard.js';

const semi = (iv) => T.intervalSemis(F.simpleIv(String(iv).replace(/^(b|#)?(9|11|13)$/, (m, a, n) => (a || '') + { 9: '2', 11: '4', 13: '6' }[n]))) % 12;
const MAJOR = [0, 2, 4, 5, 7, 9, 11], MINOR = [0, 2, 3, 5, 7, 8, 10];
const DEG = ['root', '♭2nd', '2nd', '♭3rd', '3rd', '4th', '♯4th', '5th', '♭6th', '6th', '♭7th', '7th'];
const simpleOf = (iv) => F.simpleIv(String(iv).replace(/^(b|#)?(9|11|13)$/, (m, a, n) => (a || '') + { 9: '2', 11: '4', 13: '6' }[n]));

function family(ivs) {
  const has = (x) => ivs.includes(x);
  if (has('3') && has('b7')) return 'dom';
  if (has('b3') && has('b5')) return has('bb7') ? 'dim7' : 'hd';
  if (has('b3')) return 'min';
  if (!has('3') && !has('b3')) return 'sus';
  return 'maj';
}
// the colour notes of a chord: tensions, and the notes that stand in for or join the basic chord
export function colours(q) {
  const ivs = T.getChord(q).ivs, fam = family(ivs), out = [];
  for (const iv of ivs) {
    if (/^(b|#)?(9|11|13)$/.test(iv)) out.push(iv);
    else if (iv === '6' && !ivs.includes('b7') && !ivs.includes('7')) out.push('6');
    else if ((iv === '#5' || iv === 'b5') && fam !== 'hd' && fam !== 'dim7') out.push(iv);
    else if (iv === '7' && ivs.includes('b3')) out.push('7');
    else if ((iv === '4' || iv === '2') && fam === 'sus') out.push(iv === '4' ? 'sus4' : 'sus2');
  }
  return out;
}
export const hasColour = (q, grip) => colours(q).length > 0 || !!(grip?.tg && grip.notes.some((n) => n.extra));

// what each colour note does, by chord family
const TEXT = {
  maj: {
    9: 'The 9th is the 2nd of the scale an octave up. It sits a whole step above the root and clashes with nothing, so it opens the chord out: spacious, modern, the sound of a maj9.',
    '#11': 'The ♯11 is the Lydian note. The plain 11 (the 4th) would rub a half step above the 3rd, so it’s raised: the chord floats instead of leaning. On IV in a major key the ♯11 is just the key’s own 7th.',
    13: 'The 13th (the 6th) sweetens a major chord: the 6 chord and 6/9 are the major pentatonic stacked up, so nothing clashes. It’s the classic ending chord.',
    6: 'The 6th in place of the 7th: the major pentatonic sound, warm and settled, a little old-fashioned. The 7th would make it more restless.',
  },
  dom: {
    9: 'The natural 9th makes a plain dominant richer without adding tension: it’s the 2nd of Mixolydian, the dominant’s own mode in the key.',
    13: 'The 13th (the 6th of Mixolydian) is the sweet dominant tension. When V goes to I, the 13 often holds over as the 3rd of I, or steps down to its 9th.',
    b9: 'The ♭9 is a half step above the root and a half step above the 5th of where it’s going: it falls down into the target’s 5th. It comes from harmonic minor (Phrygian dominant), which is why it sounds right going into a minor chord.',
    '#9': 'The ♯9 is the ♭3 sounding against the major 3rd: the blues “Hendrix chord” rub. Altered, it pulls down by a half step into the next chord’s tones.',
    '#11': 'The ♯11 on a dominant is Lydian dominant (the 4th mode of melodic minor). The plain 11 would fight the 3rd; raised, it shimmers. It suits dominants that don’t resolve down a 5th: IV7, ♭VII7, the tritone sub ♭II7.',
    b13: 'The ♭13 (♭6) darkens the dominant. Going into a minor chord it becomes that chord’s 3rd, so it’s really a note of the target key arriving early: Mixolydian ♭6 or Phrygian dominant.',
    '#5': 'The ♯5 is the augmented dominant: the 5th pushed up, so it climbs a half step into the next chord’s 3rd. Whole-tone colour.',
    b5: 'The ♭5 (♯11) splits the dominant symmetrically: it’s the tritone sub’s own 5th, a note shared between V7 and ♭II7.',
    sus4: 'The 4 replaces the 3rd: the dominant is suspended, the tension held without the leading tone. It wants the 4 to fall to the 3rd, or to be left floating (9sus4: IV over V).',
  },
  min: {
    9: 'The 9th on a minor chord is the 2nd of Dorian or Aeolian, a whole step above the root: soft and modern. Minor 9ths suit ii and vi in a major key.',
    11: 'The 11th (the 4th) on a minor chord doesn’t clash, since the ♭3 is a whole step below it: stacked 4ths, the open “So What” sound.',
    13: 'The 13th (natural 6) on a minor chord is Dorian’s colour note: brighter, jazzier than natural minor.',
    6: 'The natural 6 in place of the 7th: the minor-six sound from Dorian and melodic minor. On the tonic of a minor key it’s the sophisticated minor ending.',
    7: 'The major 7th over a minor triad: the minor-major chord, from harmonic and melodic minor. It’s the line-cliché sound, the 7 waiting to fall to ♭7 and 6.',
  },
  hd: {
    9: 'The natural 9 on a half-diminished chord is Locrian ♮2 (from melodic minor): it smooths the darkest chord. The plain Locrian ♭9 is usually avoided.',
    11: 'The 11th on a half-diminished chord is the 4th of Locrian: it adds a stacked-4ths openness above the ♭5.',
    b13: 'The ♭13 on a half-diminished chord is its own ♭6: Locrian through and through.',
  },
  dim7: {
    9: 'Over a diminished 7th, the tensions a whole step above each chord tone (the whole-half scale) colour it without changing its job.',
    11: 'Over a diminished 7th, the tensions a whole step above each chord tone (the whole-half scale) colour it without changing its job.',
    b13: 'Over a diminished 7th, the tensions a whole step above each chord tone (the whole-half scale) colour it without changing its job.',
    7: 'The major 7th over a diminished chord: the whole-half scale’s own tension, eerie and floating.',
  },
  sus: {
    sus4: 'The 4 replaces the 3rd: neither major nor minor, a held breath that usually resolves down to the 3rd.',
    sus2: 'The 2 replaces the 3rd: open and ambiguous, the sound of the open strings.',
    9: 'The 9th on a sus chord stacks 4ths and 5ths: the open, modern sound of 9sus4 (IV over V).',
    13: 'The 13th on a sus chord adds the 6th: wide and open.',
  },
};
const GENERIC = 'A colour note beyond the basic chord: it changes the chord’s mood without changing its job.';

// the explanation for chord c (with its root and quality) in the key {tonic, minor}, heading for `next`
export function explain(c, key, next) {
  const q = c.lq || c.q, ivs = T.getChord(q).ivs, fam = family(ivs);
  const tonicPc = T.notePc(key.tonic), rootPc = T.notePc(c.root);
  const scale = key.minor ? MINOR : MAJOR;
  // Ted Greene's extra notes count as colour too
  const extra = c.grip?.tg ? c.grip.notes.filter((n) => n.extra).map((n) => n.iv) : [];
  const items = [...new Set([...colours(q), ...extra])].map((iv) => {
    const raw = iv === 'sus4' ? '4' : iv === 'sus2' ? '2' : iv;
    const pc = (rootPc + semi(raw)) % 12, deg = ((pc - tonicPc) % 12 + 12) % 12;
    const note = T.noteName(T.transpose(c.root, simpleOf(raw)), true);
    const inKey = scale.includes(deg);
    const where = inKey ? `${note} is in the key: it’s the key’s ${DEG[deg]}.` : `${note} is outside ${T.noteName(key.tonic, true)} ${key.minor ? 'minor' : 'major'} (where the key has no ${DEG[deg]}): ${key.minor ? 'borrowed from the parallel major, melodic minor or the altered sounds' : (deg === 3 || deg === 8 || deg === 10) ? 'borrowed from the parallel minor' : 'a chromatic colour'}.`;
    const words = (TEXT[fam] || {})[iv] || (TEXT[fam] || {})[raw] || GENERIC;
    return { tone: iv === 'sus4' ? 'sus 4' : iv === 'sus2' ? 'sus 2' : T.prettyIv(iv), note, text: words, where, inKey };
  });
  // why here: the chord's job
  const ctx = [];
  const nRoot = next ? T.notePc(next.root) : null;
  const toMinor = next ? /^m(?!aj)|^min|m7b5|dim/.test(next.lq || next.q || '') : false;
  if (fam === 'dom' && next && ((nRoot - rootPc + 12) % 12) === 5) {
    ctx.push(`Here it’s a dominant resolving down a 5th to ${next.name}${toMinor ? ', a minor chord: so the darker tensions (♭9, ♭13) suit it, because they’re notes of the minor key it’s heading for' : ', a major chord: the natural 9 and 13 keep it sweet; altered tensions (♭9, ♯9, ♭13) add pull'}.`);
  } else if (fam === 'dom' && next && ((nRoot - rootPc + 12) % 12) === 11) {
    ctx.push(`Here it slides down a half step into ${next.name}: a tritone substitute, so ♯11 (Lydian dominant) is its natural colour.`);
  } else if (fam === 'dom') {
    ctx.push('Here the dominant doesn’t resolve down a 5th, so it’s heard as a colour in its own right: the ♯11 (Lydian dominant) and 9 or 13 suit it better than the darker altered tensions.');
  } else if (fam === 'maj' && ((rootPc - tonicPc + 12) % 12) === 5 && !key.minor) {
    ctx.push('Here it’s IV in a major key: its ♯11 is the key’s own 7th, which is why Lydian is IV’s natural mode.');
  } else if (fam === 'maj' && rootPc === tonicPc) {
    ctx.push('Here it’s the tonic: colour on home (maj7, 6/9, maj9) makes the arrival richer without making it restless.');
  } else if (fam === 'min' && !key.minor && [2, 9, 4].includes((rootPc - tonicPc + 12) % 12)) {
    const d = (rootPc - tonicPc + 12) % 12, rn = d === 2 ? 'ii' : d === 9 ? 'vi' : 'iii', mode = d === 2 ? 'Dorian' : d === 9 ? 'Aeolian' : 'Phrygian';
    const outside = items.filter((x) => !x.inKey);
    ctx.push(outside.length
      ? `Here it’s ${rn} in a major key, whose own mode is ${mode}. ${outside.map((x) => x.note).join(' and ')} ${outside.length === 1 ? 'isn’t' : 'aren’t'} in the key, so this colour reaches outside it${d === 4 ? ': Phrygian’s own 9th is the ♭9, which clashes, so a brighter, Dorian-like iii is borrowed instead' : ''}. It’s a tint, not the key’s own sound.`
      : `Here it’s ${rn} in a major key (its own mode is ${mode}): its colour notes are notes of the key, so they’re safe.`);
  } else if (items.some((x) => !x.inKey)) {
    ctx.push(`${items.filter((x) => !x.inKey).map((x) => x.note).join(' and ')} ${items.filter((x) => !x.inKey).length === 1 ? 'is' : 'are'} outside the key: a chromatic tint on top of the chord’s job.`);
  }
  if (c.grip?.tg && c.grip.notes.some((n) => n.extra)) ctx.push(`In Ted Greene’s grip the extra notes (${c.grip.notes.filter((n) => n.extra).map((n) => T.prettyIv(n.iv)).join(', ')}) are his own additions: the same reasoning applies.`);
  return { title: `${c.name}: why this colour?`, items, ctx };
}
