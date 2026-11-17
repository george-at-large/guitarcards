// Feel: what a chord feels like, in plain words, and (Feel + why) why it feels that way. Also the mode a borrowed
// chord comes from. Every sentence here is recorded (tools/listenvoice/build.mjs) and shown on screen.
import * as T from '../theory.js';

// ---------- where a chord comes from ----------
const MODES = {
  Ionian: [0, 2, 4, 5, 7, 9, 11], Dorian: [0, 2, 3, 5, 7, 9, 10], Phrygian: [0, 1, 3, 5, 7, 8, 10], Lydian: [0, 2, 4, 6, 7, 9, 11],
  Mixolydian: [0, 2, 4, 5, 7, 9, 10], Aeolian: [0, 2, 3, 5, 7, 8, 10], Locrian: [0, 1, 3, 5, 6, 8, 10],
  'harmonic minor': [0, 2, 3, 5, 7, 8, 11], 'melodic minor': [0, 2, 3, 5, 7, 9, 11],
};
// the first mode (of the same tonic) that holds every note, in the order a musician would name it
const ORDER = { major: ['Mixolydian', 'Lydian', 'Aeolian', 'Dorian', 'Phrygian', 'Locrian', 'harmonic minor', 'melodic minor'],
  minor: ['Dorian', 'harmonic minor', 'melodic minor', 'Phrygian', 'Ionian', 'Lydian', 'Mixolydian', 'Locrian'] };
const core = (q) => T.getChord(q).ivs.filter((iv) => !/^(b|#)?(9|11|13)$/.test(iv));
export function sourceMode(spec, q, minor) {
  const root = T.intervalSemis(spec.iv) % 12;
  const pcs = core(q).map((iv) => (root + T.intervalSemis(iv)) % 12);
  const home = minor ? [...new Set([...MODES.Aeolian, 11])] : MODES.Ionian; // in minor, the raised 7th of V is home too
  if (pcs.every((p) => home.includes(p))) return null;
  return ORDER[minor ? 'minor' : 'major'].find((m) => pcs.every((p) => MODES[m].includes(p))) || null;
}
export const MODE_SAY = (m) => (m === 'Ionian' ? 'from the parallel major' : `from ${m}`);
export const MODE_NAMES = Object.keys(MODES);

// ---------- feel ----------
// by chord quality
export const FEEL = {
  maj: 'Open and settled, like daylight.',
  min: 'Inward and melancholy.',
  dim: 'Uneasy and cramped, as if holding its breath.',
  aug: 'Eerie and expanding, like a dream that won’t settle.',
  sus2: 'Open and airy: neither happy nor sad.',
  sus4: 'Suspended, an unanswered question.',
  maj7: 'Soft and dreamy, a little wistful, like late afternoon light.',
  7: 'Restless, leaning forward, wanting to move.',
  m7: 'Mellow and soulful: sad, without despair.',
  m7b5: 'Bittersweet and searching, a tender darkness.',
  dim7: 'Dramatic and unstable, like a held breath in an old film.',
  mMaj7: 'Haunted and suspenseful, a film-noir question.',
  'maj7#5': 'Glassy and strange, otherworldly.',
  '7#5': 'Stretched and urgent, tilting forward.',
  '7b5': 'Slippery and sly.',
  '7sus4': 'Hovering and expectant, soft-edged.',
  6: 'Warm and content, an old-fashioned sweetness.',
  m6: 'Mysterious and smoky.',
  add9: 'Bright and clear, a sparkle on top.',
  madd9: 'Tender and aching: a beautiful sadness.',
  '6/9': 'Wide and glowing, with nothing pulling anywhere.',
  'm6/9': 'Cool and elegant, dark but poised.',
  maj9: 'Lush and floating.',
  9: 'Funky and warm: restless, but relaxed.',
  m9: 'Velvet and intimate, a soft ache.',
  mMaj9: 'Dark and luminous at once, like moonlight on water.',
  11: 'Open and modern, a big shape.',
  m11: 'Spacious and cool, more modern than sad.',
  'maj7#11': 'Bright and weightless, shimmering in the air.',
  'maj9#11': 'Wide open and luminous, floating free.',
  13: 'Rich and bluesy, a big-band glow.',
  m13: 'Deep and rich, a warm, dark velvet.',
  maj13: 'Full and radiant, every colour at once.',
  '9sus4': 'Smooth and hovering, soulful and unresolved.',
  '13sus4': 'Lush and suspended, a gospel hush.',
  '7b9': 'Dark and urgent, a shadow before the resolution.',
  '7#9': 'Gritty and raw: the blues clash.',
  '7#11': 'Bright, floating restlessness, slightly strange.',
  '7b13': 'Dark and yearning, sinking toward minor.',
  '7b9b13': 'Heavy and dark, pulling hard toward minor.',
  '7#9b13': 'Tense and smoky, everything leaning.',
  '13b9': 'Rich, but with a shadow in it.',
  '13#11': 'Bright and spacious, a sophisticated tension.',
  '7alt': 'Tense and unstable, everything pulling at once.',
  'm7#5': 'Hazy and ambiguous.',
  '7sus2': 'Open and hovering.',
};
// why it feels that way
export const FEEL_WHY = {
  maj: 'The major third sits at the bottom of the chord: the most consonant interval after the octave and fifth.',
  min: 'The minor third at the bottom: the root’s own overtones disagree with it, a shadow.',
  dim: 'Two minor thirds and a tritone: no stable fifth to rest on.',
  aug: 'Two major thirds: the fifth is pushed up, so nothing anchors it.',
  sus2: 'No third at all: the chord can’t say major or minor.',
  sus4: 'The fourth sits where the third should be, and wants to fall to it.',
  maj7: 'The seventh rubs against the root an octave up, a half step away, but softly: a gentle tension that never needs to resolve.',
  7: 'A tritone between its third and seventh: the most unstable interval, which wants to close inward.',
  m7: 'The minor seventh softens the minor triad: two thirds alternating, minor, major, minor.',
  m7b5: 'A diminished triad with a minor seventh on top: the dark of the tritone, gentled by the seventh.',
  dim7: 'Stacked minor thirds, perfectly symmetrical: it could resolve in any of four directions.',
  mMaj7: 'A minor triad with a major seventh: dark at the bottom, a bright edge at the top, which don’t agree.',
  'maj7#5': 'An augmented triad under a major seventh: bright, but with no stable fifth.',
  '7#5': 'The raised fifth pushes up toward the next chord’s third.',
  '7b5': 'Two tritones inside one chord: it is its own tritone substitute.',
  '7sus4': 'The fourth replaces the third, so the dominant’s tritone is gone: the pull softens to a hover.',
  6: 'The sixth adds sweetness without the edge of a seventh.',
  m6: 'The major sixth over a minor triad makes a tritone with the minor third: a quiet, unresolved strangeness.',
  add9: 'The ninth is a whole step above the root: a bright rub, but far enough away to sparkle.',
  madd9: 'The ninth rubs a half step against the minor third: the ache is that rub.',
  '6/9': 'Built from the pentatonic scale: no half steps anywhere, nothing to resolve.',
  'm6/9': 'Minor, but the sixth and ninth add light and space.',
  maj9: 'The ninth adds a second layer above the major seventh: more air, more float.',
  9: 'The ninth softens the dominant’s pull: still a tritone inside, but cushioned.',
  m9: 'The ninth adds warmth above the minor seventh chord, a soft cushion.',
  mMaj9: 'The ninth softens the clash of minor third and major seventh.',
  11: 'Stacked fourths and fifths: open intervals, no third in the way.',
  m11: 'Thirds and fourths stacked: wide intervals, little pull.',
  'maj7#11': 'The sharp eleven is the Lydian note: no avoid note, nothing pulls down.',
  'maj9#11': 'Every note a step from the next, Lydian all the way up: no tension wants to resolve.',
  13: 'The thirteenth is the sixth up high: sweetness on top of the dominant’s pull.',
  m13: 'The thirteenth adds the Dorian sixth: light shining through the minor.',
  maj13: 'Almost the whole major scale stacked in thirds.',
  '9sus4': 'A minor seventh chord over the fifth in the bass: the dominant without its tritone.',
  '13sus4': 'The fourth and the thirteenth together: a cluster of suspension.',
  '7b9': 'The flat nine is a half step above the root: the darkest tension a dominant can carry.',
  '7#9': 'The sharp nine is the minor third, against the major third: major and minor at once.',
  '7#11': 'The sharp eleven comes from Lydian dominant: brightness on top of the pull.',
  '7b13': 'The flat thirteen is already the next minor chord’s third.',
  '7b9b13': 'Both flattened tensions point down to a minor home.',
  '7#9b13': 'Every tension altered: it wants out.',
  '13b9': 'The thirteenth is sweet, the flat nine dark: they pull against each other.',
  '13#11': 'Lydian dominant: a tritone inside, but no avoid notes on top.',
  '7alt': 'Every possible tension altered: the root, third and seventh hold it together, nothing else is stable.',
  'm7#5': 'The raised fifth blurs the minor chord into something else.',
  '7sus2': 'No third, a seventh on top: open, with a slight lean.',
};
// by function in the key (what it feels like there)
export const FEEL_ROLE = {
  tonic: 'Arrival: at rest.', tonicMinor: 'Arrival, in shadow.', dom: 'Leaning forward, wanting home.', sub: 'Opening outward, a step away from home.',
  super: 'Moving, setting up the turn home.', rel: 'Home’s melancholy twin.', mediant: 'Home, seen through a veil.', lead: 'On edge, a breath before home.',
  borrowed: 'A cloud passing over the sun.', subMinor: 'A sudden shadow: nostalgia.', borrowedMaj: 'Light breaking into the minor key.', secondary: 'A push toward the next chord.',
  tritone: 'A sideways slide home.', passing: 'Motion, a slide between two places.', mediantChrom: 'A sudden change of light, like a scene change.',
  neapolitan: 'Dark and dramatic, an operatic gesture.', domMinor: 'Floating, folky, unhurried.', backdoor: 'Coming home the long way, smiling.',
  picardy: 'Sudden light at the end.', sus: 'Hovering, waiting.', relMaj: 'The minor key opening a window.', flatSix: 'Wide and warm, a grand gesture.', subtonic: 'Rising, anthemic, open sky.',
};
export const FEEL_ROLE_WHY = {
  tonic: 'It is the key’s centre: every other chord is heard as a distance from it.',
  dom: 'It holds the leading tone, a half step below home, and a tritone that wants to close.',
  sub: 'Its root is a fifth below home: moving there feels like leaning away.',
  borrowed: 'It brings a flattened note from the parallel minor into a major key.',
  subMinor: 'Its flat six sits a half step above the five and wants to fall.',
  borrowedMaj: 'It brings a raised note from the parallel major into a minor key.',
  secondary: 'It is the dominant of the next chord, so that chord briefly sounds like home.',
  tritone: 'It shares the dominant’s tritone, with its root a half step above home.',
  mediantChrom: 'Its root is a third away, with a note the key doesn’t have: familiar shape, new colour.',
  neapolitan: 'It is a major chord on the flat two, a half step above home.',
  picardy: 'The third is raised at the last moment: minor becomes major.',
  backdoor: 'The flat seven dominant resolves up a whole step instead of down a fifth.',
  passing: 'Its notes are each a half step from the chords either side.',
};
export function feelLines(q, role, exts, why) {
  const out = [];
  // a plain triad feels like what it's doing: its function's feel, not the generic one
  const plain = (q === 'maj' || q === 'min') && role && FEEL_ROLE[role];
  if (FEEL[q] && !plain) out.push(FEEL[q]);
  if (role && FEEL_ROLE[role]) out.push(FEEL_ROLE[role]);
  if (why) { if (FEEL_WHY[q] && !(plain && FEEL_ROLE_WHY[role])) out.push(FEEL_WHY[q]); if (role && FEEL_ROLE_WHY[role]) out.push(FEEL_ROLE_WHY[role]); }
  return out;
}
export function allPhrases() {
  return [...Object.values(FEEL), ...Object.values(FEEL_WHY), ...Object.values(FEEL_ROLE), ...Object.values(FEEL_ROLE_WHY), ...MODE_NAMES.map(MODE_SAY)];
}
