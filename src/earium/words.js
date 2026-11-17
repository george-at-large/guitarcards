// Everything Earium says, as whole short sentences (each one a recorded clip of Theo Silk, the same voice as the
// CAGED Listen section; tools/listenvoice/build.mjs records them into voice/theo). The text on screen is always the
// same sentence, so what is heard is always written down too.
import { DEGS, MOVE_PAIRS, ALL_SAYS, FAMILY } from './harm.js';
import { SAYS as REHARM_SAYS } from './reharm.js';
import { allPhrases as feelPhrases } from './feel.js';

const NUM = { 1: 'one', 2: 'two', 3: 'three', 4: 'four', 5: 'five', 6: 'six', 7: 'seven', 9: 'nine', 11: 'eleven', 13: 'thirteen' };
const ACC = { b: 'flat ', bb: 'double flat ', '#': 'sharp ' };
export const degWord = (d) => { const m = /^(bb|b|#)?(\d+)$/.exec(d); return m ? (ACC[m[1]] || '') + NUM[m[2]] : d; };
export const degText = (d) => d.replace(/bb/g, '𝄫').replace(/b/g, '♭').replace(/#/g, '♯');
const cap = (s) => s[0].toUpperCase() + s.slice(1);
const semi = { 1: 0, b2: 1, 2: 2, b3: 3, 3: 4, 4: 5, '#4': 6, b5: 6, 5: 7, '#5': 8, b6: 8, 6: 9, bb7: 9, b7: 10, 7: 11, b9: 13, 9: 14, '#9': 15, 11: 17, '#11': 18, b13: 20, 13: 21 };

// a note's character, for the rich voice
export const COLOUR = {
  1: 'The root: home.', b2: 'Dark and close, the Phrygian tension.', 2: 'Open and unresolved.', b3: 'The minor colour.', 3: 'The major colour, bright and settled.',
  4: 'Suspended, leaning down to the three.', '#4': 'The Lydian lift.', b5: 'The tritone, restless.', 5: 'The open, stable fifth.', '#5': 'Augmented, stretching upward.',
  b6: 'Bittersweet, pulling down to the five.', 6: 'Warm and sweet.', bb7: 'The diminished seventh: a six in disguise.', b7: 'The dominant colour, a bluesy pull.',
  7: 'Dreamy, a half step below home.', b9: 'Tense and dark, a Spanish edge.', 9: 'The two up high: open and lush.', '#9': 'The blues clash, the Hendrix sound.',
  11: 'The four up high, a suspended glow.', '#11': 'The Lydian sparkle.', b13: 'Dark and yearning.', 13: 'The six up high: sweet and full.',
};

// ---------- Guided sentences ----------
export const G = {
  root: 'This is the one, the root.',
  rootIs: (name) => `The root is ${name}.`,
  bass: (d) => `In the bass, the ${degWord(d)}.`,
  inA: (d) => `Here's the ${degWord(d)}.`,
  inB: (d) => `The ${degWord(d)} comes in.`,
  out: (d) => `The ${degWord(d)} steps out.`,
  move: (a, b) => `The ${degWord(a)} ${semi[b] > semi[a] ? 'rises' : 'falls'} to the ${degWord(b)}.`,
  now: (say) => `Now it's ${say}.`,
  colour: (d) => COLOUR[d],
  imagine: (d) => `Before it sounds, hear the ${degWord(d)} in your mind.`,
  imagineMove: 'Before it moves, hear the change in your mind.',
  thereItIs: 'There it is.',
  quizIn: 'A new note is coming. What is it?',
  quizMove: 'Something is about to change. Listen.',
  itWas: (d) => `It's the ${degWord(d)}.`,
  ring: 'Let it ring.',
  whole: 'Listen to the whole chord.',
  thin: 'The chord thins out.',
  alone: 'Back to the root alone.',
  newRoot: 'A new root.',
  over: (d) => `The ${degWord(d)}, over the drone.`,
};
const ROOTS = ['C', 'D flat', 'D', 'E flat', 'E', 'F', 'F sharp', 'G', 'A flat', 'A', 'B flat', 'B'];
export const rootName = (pc) => ROOTS[pc];

// ---------- Ambient sentences ----------
// a numeral as words: "four", "flat six", "five of two"
const ROMAN = { I: 1, II: 2, III: 3, IV: 4, V: 5, VI: 6, VII: 7 };
export function romanWords(rn) {
  const m = /^(𝄫|♭|♯|b|#)?([IViv]+)/.exec(rn || '');
  if (!m) return null;
  const acc = { '♭': 'flat ', b: 'flat ', '♯': 'sharp ', '#': 'sharp ', '𝄫': 'double flat ' }[m[1]] || '';
  const n = ROMAN[m[2].toUpperCase()];
  return n ? acc + NUM[n] : null;
}
// the function of a chord in the key, in a few words (rich narration)
export const ROLE = {
  tonic: 'home', tonicMinor: 'home, in minor', super: 'the supertonic, leaning to five', mediant: 'the mediant, a soft tonic', sub: 'the subdominant, opening out',
  dom: 'the dominant, pulling home', rel: 'the relative minor', lead: 'the leading tone chord', borrowed: 'borrowed from the parallel minor', borrowedMaj: 'borrowed from the parallel major',
  secondary: 'a secondary dominant', tritone: 'a tritone substitute', passing: 'a passing diminished chord', mediantChrom: 'a chromatic mediant', neapolitan: 'the Neapolitan',
  subMinor: 'the minor subdominant', domMinor: 'the minor dominant', backdoor: 'the backdoor dominant', picardy: 'a Picardy third', sus: 'suspended, waiting to resolve',
  relMaj: 'the relative major', flatSix: 'the flat six, warm and wide', subtonic: 'the flat seven, the subtonic',
};
// the function in two or three words (spoken, economically); null where the chord's name already says it
export const ROLE_SHORT = {
  tonic: 'home', tonicMinor: 'home', super: 'pre-dominant', mediant: 'mediant', sub: 'subdominant', dom: 'dominant', rel: 'relative minor', lead: 'leading tone',
  borrowed: 'from parallel minor', borrowedMaj: 'from parallel major', secondary: null, tritone: 'tritone sub', passing: 'passing diminished', mediantChrom: 'chromatic mediant',
  neapolitan: 'Neapolitan', subMinor: 'from parallel minor', domMinor: 'minor dominant', backdoor: 'backdoor dominant', picardy: 'Picardy third', sus: 'suspended',
  relMaj: 'relative major', flatSix: null, subtonic: null,
};
// why it works, in one sentence (spoken at Theory: more; role, or role:root-semitones above the key)
export const WHY = {
  tonic: 'Home: every other chord is heard against it.',
  tonicMinor: 'Home, in minor.',
  super: 'Two leads to five: its root falls a fifth, the strongest move.',
  mediant: 'Three shares two notes with one: a softer tonic.',
  sub: 'Four steps away from home: it can go back, or on to five.',
  dom: 'Five holds the leading tone, a half step below home: it wants to resolve.',
  rel: 'Six minor shares two notes with one: home’s darker twin.',
  lead: 'Built on the leading tone: a dominant without its root.',
  'borrowed:8': 'Flat six: two flattened notes, a big shadow before home.',
  'borrowed:10': 'Flat seven: a whole step below home, resolving without a leading tone.',
  'borrowed:3': 'Flat three: the key’s minor third as a major chord, bold and bluesy.',
  'borrowed:0': 'Home turned minor: the parallel key for a moment.',
  borrowed: 'A flattened note from the parallel minor darkens the key.',
  borrowedMaj: 'The Dorian four: a bright major chord inside a minor key.',
  secondary: 'A dominant from another key: the next chord sounds like home for a moment.',
  tritone: 'It shares its tritone with the dominant, and slides down a half step.',
  passing: 'Every note a half step from the chords either side: pure motion.',
  mediantChrom: 'A third away, the same quality, one note shared: a sudden change of light.',
  neapolitan: 'A major chord on the flat two: dark, and heading for the dominant.',
  subMinor: 'Its flat six falls to the five: a sigh on the way home.',
  domMinor: 'No leading tone, so it floats instead of pulling home.',
  backdoor: 'Flat seven dominant: it resolves up a whole step, home by the back door.',
  picardy: 'A major chord ending a minor phrase: sudden light.',
  sus: 'The fourth replaces the third: waiting to resolve.',
  relMaj: 'The relative major: the minor key’s brighter side.',
  flatSix: 'Flat six: warm and wide, often falling to five.',
  subtonic: 'Flat seven: a whole step below home, leading back without a leading tone.',
};
export const whyOf = (role, semi) => WHY[`${role}:${semi}`] || WHY[role] || null;
// extensions: what the voice says as one comes in, and what the screen says about why it fits
export const EXT_SAY = (e) => `adding the ${degWord(e)}`;
export const EXTS = ['b9', '9', '#9', '11', '#11', 'b13', '13'];
export const EXT_INFO = {
  9: 'The 9th is the 2nd an octave up. It fits major, minor and dominant chords: open and lush, no clash with the 3rd.',
  b9: 'The ♭9 sits a half step above the root: a dominant’s tension, most at home resolving to minor, where it falls to the next chord’s 5th.',
  '#9': 'The ♯9 is the minor 3rd over a major chord: the blues clash on a dominant.',
  11: 'The 11th is the 4th up high. Natural on minor and sus chords; on a major chord it rubs against the 3rd, so major chords take the ♯11.',
  '#11': 'The ♯11 is the Lydian note: on major and dominant chords it adds sparkle without the 11th’s clash.',
  b13: 'The ♭13 is a dominant’s dark tension: heading to minor, it is already the new tonic’s 3rd.',
  13: 'The 13th is the 6th up high: on dominants and major chords, sweet and full, often on top.',
};
// listening demos: the voicing style, and the held melody note's role in each chord
export const VOICING_SAY = { close: 'close voicing', spread: 'spread voicing', fourths: 'in fourths', cluster: 'a cluster', open: 'with open strings' };
export const MELODY_SAY = (iv) => `the melody is the ${degWord(iv)}`;
// Spotlight: how a guide tone (3rd or 7th) moves into the next chord
export const GUIDE = ['3', 'b3', '7', 'b7'];
export const SPOT_TO = ['1', '3', 'b3', '4', '5', '7', 'b7', '6', '9', 'b9', '#9', '11', '#11', '13', 'b13'];
export const SPOT_SAY = (a, b, dir) => (dir === 0 ? `the ${degWord(a)} holds, as the ${degWord(b)}` : `the ${degWord(a)} ${dir < 0 ? 'falls' : 'rises'} to the ${degWord(b)}`);
// Tension: the voice marks the high point and the release
export const TENSION_SAY = { peak: 'the peak', release: 'release' };
// Voice leading: a voice's note, where it goes, and which voice
export const VL = {
  the: (d) => `the ${degWord(d)}`,
  move: (b, dir, same = false) => (dir === 0 ? `holds, as the ${degWord(b)}` : `${dir < 0 ? 'falls' : 'rises'} to the ${same ? 'new ' : ''}${degWord(b)}`),
  voice: (name) => `the ${name}`,
  four: 'In four voices.', three: 'In three voices.', inTime: 'Now in time.',
};
export const AMB = {
  movingTo: 'moving to',
  then: 'then',
  newKey: 'new key,',
  home: 'home again,',
};
// the numeral and quality words the narration uses (also recorded)
export const QUAL_WORDS = ['major', 'minor', 'diminished', 'augmented', 'sus two', 'sus four', 'major seven', 'seven', 'minor seven', 'half diminished', 'diminished seven',
  'minor major seven', 'six', 'minor six', 'add nine', 'minor add nine', 'six nine', 'minor six nine', 'major nine', 'nine', 'minor nine', 'eleven', 'minor eleven',
  'major seven sharp eleven', 'major nine sharp eleven', 'thirteen', 'minor thirteen', 'major thirteen', 'nine sus four', 'thirteen sus four', 'seven sus four',
  'seven flat nine', 'seven sharp nine', 'seven sharp eleven', 'seven flat thirteen', 'seven flat nine flat thirteen', 'seven sharp nine flat thirteen', 'thirteen flat nine',
  'thirteen sharp eleven', 'altered', 'seven sharp five', 'seven flat five', 'minor seven sharp five', 'seven sus two', 'major seven sharp five'];

// every phrase, for the recorder
export function allPhrases() {
  const P = new Set([G.root, G.imagineMove, G.thereItIs, G.quizIn, G.quizMove, G.ring, G.whole, G.thin, G.alone, G.newRoot]);
  for (const d of DEGS) { [G.bass, G.inA, G.inB, G.out, G.imagine, G.itWas, G.over].forEach((f) => P.add(f(d))); P.add(COLOUR[d]); }
  for (const [a, b] of MOVE_PAIRS) P.add(G.move(a, b));
  ALL_SAYS.forEach((s) => P.add(G.now(s)));
  ROOTS.forEach((r) => P.add(G.rootIs(r)));
  // ambient
  Object.values(ROLE).forEach((s) => P.add(s));
  Object.values(AMB).forEach((s) => P.add(s));
  Object.values(ROLE_SHORT).forEach((s) => s && P.add(s));
  Object.values(WHY).forEach((s) => P.add(s));
  EXTS.forEach((e) => P.add(EXT_SAY(e)));
  DEGS.forEach((d) => P.add(degWord(d)));
  REHARM_SAYS.forEach((x) => P.add(x));
  Object.values(VOICING_SAY).forEach((x) => P.add(x));
  for (const g of GUIDE) for (const t of SPOT_TO) for (const d of [-1, 0, 1]) P.add(SPOT_SAY(g, t, d));
  Object.values(TENSION_SAY).forEach((x) => P.add(x));
  for (const d of [...DEGS, '2', '4', '6', 'b6']) { P.add(VL.the(d)); for (const dir of [-1, 0, 1]) P.add(VL.move(d, dir)); P.add(VL.move(d, -1, true)); P.add(VL.move(d, 1, true)); }
  ['bass', 'tenor', 'alto', 'soprano', 'middle voice', 'top voice'].forEach((v) => P.add(VL.voice(v)));
  [VL.four, VL.three, VL.inTime].forEach((x) => P.add(x));
  ['The melody alone.', 'Now with the chords.', 'Slowly, chord by chord.'].forEach((x) => P.add(x));
  [...DEGS, '2', '4', '6', 'b6'].forEach((d) => P.add(MELODY_SAY(d)));
  feelPhrases().forEach((x) => P.add(x));
  for (const acc of ['', 'flat ', 'sharp ']) for (const n of [1, 2, 3, 4, 5, 6, 7]) { P.add(acc + NUM[n]); P.add(`minor ${acc}${NUM[n]}`); P.add(`of ${acc}${NUM[n]}`); P.add(`over ${acc}${NUM[n]}`); }
  QUAL_WORDS.forEach((q) => P.add(q));
  return [...P].filter(Boolean);
}
export { cap, FAMILY };
