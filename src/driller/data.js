// Scale Driller's scales: the ones players actually use, grouped, each with its tips. The intervals come from the
// shared scale table (caged/scales.js); here is what to play it over, its colour notes, how to think of it, and the
// drills that suit it best (practice ids from practice.js, shown first and starred when you flick through drills).
import * as T from '../theory.js';
import * as F from '../fretboard.js';
import { SCALES as ALL } from '../caged/scales.js';

export const BY = Object.fromEntries(ALL.map((s) => [s.id, s]));

export const GROUPS = [
  ['Major modes', ['ionian', 'dorian', 'phrygian', 'lydian', 'mixolydian', 'aeolian', 'locrian']],
  ['Pentatonics and blues', ['min-pent', 'maj-pent', 'blues', 'maj-blues', 'dom-pent', 'm6-pent']],
  ['Melodic minor modes', ['mel-min', 'dorian-b2', 'lyd-aug', 'lyd-dom', 'mixo-b6', 'locrian-n2', 'altered']],
  ['Harmonic minor and major', ['harm-min', 'phryg-dom', 'harm-maj']],
  ['Diminished and whole tone', ['dim-hw', 'dim-wh', 'whole-tone']],
  ['Bebop', ['bebop-dom', 'bebop-maj', 'bebop-dor']],
];
export const ORDER = GROUPS.flatMap((g) => g[1]);
export const groupOf = (id) => GROUPS.findIndex((g) => g[1].includes(id));

const NAME = {
  ionian: 'Ionian (major)', aeolian: 'Aeolian (natural minor)', 'mel-min': 'Melodic minor', 'harm-min': 'Harmonic minor',
  'harm-maj': 'Harmonic major', 'dim-hw': 'Diminished, half-whole', 'dim-wh': 'Diminished, whole-half', 'whole-tone': 'Whole tone',
  'min-pent': 'Minor pentatonic', 'maj-pent': 'Major pentatonic', blues: 'Blues', 'maj-blues': 'Major blues',
  'dom-pent': 'Dominant pentatonic', 'm6-pent': 'Minor 6 pentatonic', altered: 'Altered', 'bebop-dom': 'Bebop dominant',
  'bebop-maj': 'Bebop major', 'bebop-dor': 'Bebop Dorian',
};
export const nameOf = (id) => NAME[id] || BY[id].name[0].toUpperCase() + BY[id].name.slice(1);
export const ivsOf = (id) => BY[id].ivs;

// the scale's own chord (its arpeggio), where the 1-3-5-7 rule doesn't give the right one
const CHORD = {
  'maj-pent': ['1', '3', '5', '6'], 'maj-blues': ['1', '3', '5', '6'], 'm6-pent': ['1', 'b3', '5', '6'],
  'dorian-b2': ['1', '4', '5', 'b7'], altered: ['1', '3', 'b7', '#9'], 'whole-tone': ['1', '3', '#5', 'b7'],
  'dim-wh': ['1', 'b3', 'b5', '6'], 'bebop-dom': ['1', '3', '5', 'b7'], 'bebop-maj': ['1', '3', '5', '6'],
  'bebop-dor': ['1', 'b3', '5', 'b7'],
};
// numbers mode reads the bebop scales through their parent mode (the passing note has no number)
const NUMS = { 'bebop-dom': 'mixolydian', 'bebop-maj': 'ionian', 'bebop-dor': 'dorian' };

// the digit of an interval name, folded into one octave: b9 → 2, #11 → 4, 13 → 6
export const digit = (iv) => { const d = Number(String(iv).replace(/[^0-9]/g, '')); return ((d - 1) % 7) + 1; };
// which of the scale's notes a number names: the plain one if the scale has it (5 rather than ♭5), else the first
// with that digit; null when the scale has none (2 in a minor pentatonic, 5 in the altered scale)
export function ivForNumber(id, n) {
  const ivs = ivsOf(NUMS[id] || id), d = digit(n);
  const hits = ivs.filter((iv) => digit(iv) === d);
  if (!hits.length) return null;
  return hits.find((iv) => /^\d+$/.test(iv)) || hits[0];
}
export function chordOf(id) {
  if (CHORD[id]) return CHORD[id];
  return [1, 3, 5, 7].map((n) => ivForNumber(id, n)).filter(Boolean);
}
export const semi = (iv) => T.intervalSemis(F.simpleIv(iv)) % 12;
export const pcsOf = (ivs) => [...new Set(ivs.map(semi))];
export const sizeOf = (id) => pcsOf(ivsOf(id)).length;

// tips: over (what to play it over), colour (the notes that make its sound, as interval names), think (a way to find
// it), tips (how to practise it), best (the drills that suit it)
export const TIPS = {
  ionian: {
    over: 'maj7 and 6 chords on I; the parent of every major mode.',
    colour: ['7', '3'], think: 'The parent shapes: learn these and the other six modes are the same fingers from another note.',
    tips: ['The 4 is an avoid note over a maj7: pass through it, don’t sit on it.', 'Drill 3rds and diatonic 7ths here first. Every mode inherits them.', 'Sing the degree as you play it.'],
    best: ['thirds', 'sevenths', 'inv', 'g4', 'cells', 'triads'],
  },
  dorian: {
    over: 'm7 and m6 chords, a ii in a major key, or a minor vamp (So What, Oye Como Va).',
    colour: ['6'], think: 'The major scale from its 2nd note, or natural minor with a raised 6.',
    tips: ['The natural 6 is the whole sound: pedal the root against it until you hear it.', 'Hidden inside: minor pentatonics on 1, 2 and 5. Drill them and the mode stops sounding like a scale.', 'Over a m7, target ♭3 and ♭7 on the beat.'],
    best: ['pedal', 'pents', 'inv', 'sevenths', 'thirds', 'into'],
  },
  phrygian: {
    over: 'm7 on iii, minor vamps with a ♭II (Spanish, metal), sus♭9 sounds.',
    colour: ['b2'], think: 'The major scale from its 3rd note, or natural minor with a ♭2.',
    tips: ['The ♭2 falling to 1 is the sound: pedal the root and lean on it.', 'Triads on 1 and ♭2 (Em and F in E) are the Spanish vamp. Drill the diatonic triads to find them.', 'Avoid sitting on the ♭6 and ♭2 over a plain m7 in jazz; it’s a colour for vamps.'],
    best: ['pedal', 'triads', 'g3', 'thirds', 'skip'],
  },
  lydian: {
    over: 'maj7 on IV, maj7♯11, and Lydian tonics (film music, Satriani).',
    colour: ['#4'], think: 'The major scale from its 4th note, or major with a ♯4.',
    tips: ['The ♯4 floats: pedal the root under it.', 'Triads on 1 and 2 (C and D in C Lydian) are the triad pair that spells the whole mode. Play them up and down.', 'Hidden inside: major pentatonics on 1, 2 and 5.'],
    best: ['pedal', 'triadsAlt', 'pents', 'sevenths', 'ext'],
  },
  mixolydian: {
    over: 'Dominant 7ths that resolve or vamp: V7, blues and funk, rock I chords.',
    colour: ['b7', '3'], think: 'The major scale from its 5th note, or major with a ♭7.',
    tips: ['The 4 is the avoid note over a 7th chord: use it as a passing note into the 3.', 'Run into the chord tones (1 3 5 ♭7) so they land on the beat.', 'Mix in the minor pentatonic’s ♭3 for blues.'],
    best: ['into', 'enclose', 'inv', 'sevenths', 'g4'],
  },
  aeolian: {
    over: 'The vi chord, m7 in a minor key, minor rock and pop.',
    colour: ['b6'], think: 'The major scale from its 6th note.',
    tips: ['The ♭6 is what makes it sad. Over a ii in jazz it clashes, so use Dorian there.', 'Pedal the root and hear the ♭6 fall to the 5.', 'Minor pentatonic plus 2 and ♭6: start from the pentatonic you already know.'],
    best: ['pedal', 'thirds', 'g3', 'triads', 'pents'],
  },
  locrian: {
    over: 'm7♭5 (half-diminished), the ii of a minor ii–V.',
    colour: ['b5', 'b2'], think: 'The major scale from its 7th note.',
    tips: ['The ♭2 sounds harsh over ø7: Locrian ♮2 is the smoother modern choice.', 'Drill the m7♭5 arpeggio (1 ♭3 ♭5 ♭7) inside the scale before anything else.', 'Resolve its ♭7 down a half step to the next chord’s 3rd (Bø → E7: A → G♯).'],
    best: ['sevenths', 'thirds', 'inv', 'into'],
  },
  'min-pent': {
    over: 'Minor chords, dominant 7ths in a blues, rock riffs.',
    colour: ['b3', 'b7'], think: 'Same notes as the major pentatonic a minor 3rd up.',
    tips: ['Learn the five boxes, then join them: the 3-per-string shapes give you long diagonal runs.', 'Groups of 3 and 4 are the classic rock sequences.', 'String skipping breaks the box sound.'],
    best: ['g4', 'g3', 'inv', 'skip', 'thirds'],
  },
  'maj-pent': {
    over: 'Major and 6 chords, dominants in country and soul.',
    colour: ['6', '3'], think: 'The minor pentatonic’s shapes, a minor 3rd down.',
    tips: ['No half steps, so nothing clashes: play it over the I, IV and V of a major key.', 'Groups of 4 and skipping thirds make it sound like a melody, not a scale.', 'Over a maj7, try the major pentatonic from the 5th: it adds the 7 and 9.'],
    best: ['g4', 'thirds', 'inv', 'skip', 'g3'],
  },
  blues: {
    over: 'The whole 12-bar blues, minor vamps, rock.',
    colour: ['b5'], think: 'Minor pentatonic plus the ♭5.',
    tips: ['The ♭5 is a passing note: slide or hammer through it, don’t land on it.', 'Groups of 3 down the scale are the classic blues run.', 'Over the I7 bend the ♭3 a quarter tone toward the 3.'],
    best: ['g3', 'g4', 'skip', 'updown', 'into'],
  },
  'maj-blues': {
    over: 'I7 in a blues, country, soul and gospel.',
    colour: ['b3'], think: 'Major pentatonic plus the ♭3.',
    tips: ['The ♭3 hammers or slides into the 3: that’s the whole idea.', 'Alternate with the minor blues over a 12-bar: major on I7, minor on IV7.', 'Run into the 3 and the 6.'],
    best: ['into', 'g3', 'g4', 'skip'],
  },
  'dom-pent': {
    over: 'Dominant 7ths: funk vamps, V7 chords, a ♭VII7.',
    colour: ['b7', '3'], think: 'Mixolydian without the 4 and 6, or major pentatonic with ♭7 for 6.',
    tips: ['No avoid notes over a 7th chord: it’s all chord tones plus the 9.', 'Over V7 → I, it’s a clean way into the changes.', 'Groups of 4 give funky, angular lines.'],
    best: ['g4', 'home', 'skip', 'thirds'],
  },
  'm6-pent': {
    over: 'm6 and Dorian minor chords, a minor i with a natural 6.',
    colour: ['6'], think: 'Minor pentatonic with the 6 instead of the ♭7.',
    tips: ['It’s the m6 arpeggio plus a 4: drill the arpeggio first.', 'Dorian’s colour without its 2 and ♭7.', 'Good over m(maj7) too.'],
    best: ['home', 'g4', 'skip', 'thirds'],
  },
  'mel-min': {
    over: 'm(maj7) and m6 tonics, a minor i in jazz.',
    colour: ['7', '6'], think: 'Major with a ♭3. Learn its shapes once and you have all seven modes below.',
    tips: ['Diatonic 7ths here give m(maj7), m7, maj7♯5, 7, 7, ø, ø: the jazz vocabulary.', 'Thirds and 1-2-3-5 cells are the classic drills.', 'Then play the same fingering over its other roots: it is the altered, Lydian dominant and Locrian ♮2 too.'],
    best: ['sevenths', 'thirds', 'inv', 'cells', 'triads', 'ext'],
  },
  'dorian-b2': {
    over: 'sus♭9 chords (7sus with a ♭9), Phrygian-minor vamps.',
    colour: ['b2', '6'], think: 'Melodic minor from a whole step below the root.',
    tips: ['Dorian with Phrygian’s ♭2: pedal the root to hear both colours.', 'Play the melodic minor shape from the ♭7.', 'Triads on ♭2 and ♭3 (E♭ aug and F in D) give the sus♭9 sound.'],
    best: ['pedal', 'triads', 'thirds', 'g3'],
  },
  'lyd-aug': {
    over: 'maj7♯5 chords, the ♭III+ of minor.',
    colour: ['#5', '#4'], think: 'Melodic minor from a minor 3rd below the root.',
    tips: ['Lydian with a ♯5: drill the maj7♯5 arpeggio inside it.', 'Triads on 2 and 3 (D and E in C) over the root give the whole maj7♯5 sound.', 'Play the melodic minor shape from the 6th.'],
    best: ['home', 'triadsAlt', 'pedal', 'thirds'],
  },
  'lyd-dom': {
    over: 'Dominants that don’t fall a 5th: tritone subs, ♭VII7, IV7 in a blues, 7♯11.',
    colour: ['#4', 'b7'], think: 'Melodic minor from the 5th, or Mixolydian with a ♯4.',
    tips: ['The ♯11 removes the avoid note: every note sounds good on a 7th.', 'Triads on 1 and 2 (D and E in D) are the 7♯11 triad pair.', 'Play the melodic minor shape a 5th up.'],
    best: ['triadsAlt', 'into', 'pedal', 'sevenths', 'ext'],
  },
  'mixo-b6': {
    over: 'V7 going to minor with a natural 9, and 7♭13 chords.',
    colour: ['b6'], think: 'Melodic minor from the 4th, or Mixolydian with a ♭6.',
    tips: ['The ♭6 leans down to the 5: let it.', 'Over V7 → i, it keeps the 9 natural; the altered scale bends it.', 'Play the melodic minor shape a 4th up.'],
    best: ['pedal', 'into', 'thirds', 'sevenths'],
  },
  'locrian-n2': {
    over: 'm7♭5 chords: the ii of a minor ii–V, and ♯iv ø in major.',
    colour: ['2', 'b5'], think: 'Melodic minor from the ♭3 (C melodic minor = A Locrian ♮2).',
    tips: ['The natural 9 is the difference from Locrian: smooth instead of harsh.', 'Drill the ø7 arpeggio and the extended arpeggio (1 ♭3 ♭5 ♭7 9 11).', 'Play the melodic minor shape a minor 3rd up.'],
    best: ['ext', 'sevenths', 'inv', 'into', 'thirds'],
  },
  altered: {
    over: 'V7alt resolving, above all into minor: 7♭9, 7♯9, 7♭13, 7♯11.',
    colour: ['b9', '#9', '#11', 'b13'], think: 'Melodic minor from a half step above the root (G7alt = A♭ melodic minor).',
    tips: ['Every tension bent: resolve it on the next chord, a half step into the 3rd or 5th.', 'Drill 3, ♭7, then the tensions: chord tones first so it doesn’t sound random.', 'Run into the 3 and ♭7; enclose them from the tensions.', 'Hidden inside: a minor pentatonic from the ♭3 (♭3 ♭5 ♭6 ♭7 ♭9 over the root).'],
    best: ['into', 'enclose', 'pents', 'thirds', 'cells'],
  },
  'harm-min': {
    over: 'Minor i with a leading tone, m(maj7), and V7♭9 → i (from its 5th).',
    colour: ['7', 'b6'], think: 'Natural minor with a raised 7.',
    tips: ['The ♭6–7 gap is the sound: play it slowly, it’s a stretch.', 'Diatonic 7ths: m(maj7), ø, maj7♯5, m7, 7, maj7, °7.', 'Its °7 arpeggio on the 7th is the V7♭9 sound.'],
    best: ['sevenths', 'thirds', 'inv', 'triads', 'g3', 'cells'],
  },
  'phryg-dom': {
    over: 'V7♭9 into minor (E7♭9 → Am), flamenco, klezmer, metal.',
    colour: ['b2', '3'], think: 'Harmonic minor from its 5th.',
    tips: ['The ♭2 to 3 gap is the Spanish sound: pedal the root.', 'The 7♭9 arpeggio (1 3 5 ♭7 ♭9) is a °7 on the 3rd: drill it.', 'Over V7 → i, resolve the ♭9 down to the 5th of i.'],
    best: ['pedal', 'home', 'g3', 'triads', 'into'],
  },
  'harm-maj': {
    over: 'Major with the minor iv colour, maj7 with ♭6, V7♭9 into major.',
    colour: ['b6'], think: 'Major with a ♭6.',
    tips: ['The ♭6 is the borrowed iv chord’s note: let it sigh down to the 5.', 'Diatonic triads include a minor iv and an augmented ♭VI.', 'Its °7 arpeggio from the 7th resolves into the I.'],
    best: ['triads', 'sevenths', 'pedal', 'thirds'],
  },
  'dim-hw': {
    over: '13♭9 and 7♭9 dominants (G7♭9 → C).',
    colour: ['b9', '#9', '#11', '13'], think: 'Half step, whole step from the root. It repeats every minor 3rd, so every shape moves up 3 frets.',
    tips: ['Move a 4-note cell up in minor 3rds: the classic diminished line.', 'Every other note is a °7 arpeggio: two of them make the scale.', 'Major triads on 1, ♭3, ♭5 and 6: the triad pairs players use.', 'Over a dominant, target 3 and ♭7 and treat the rest as colour.'],
    best: ['m3cells', 'dimtriads', 'dimarps', 'into', 'g4'],
  },
  'dim-wh': {
    over: '°7 chords (passing diminished chords, vii°7).',
    colour: ['2', '4', 'b6', '7'], think: 'Whole step, half step. It is the half-whole scale from its 2nd note.',
    tips: ['The °7 is the chord tones; the notes in between are each a whole step above one.', 'Move a 4-note cell up in minor 3rds.', 'Major triads on 2, 4, ♭6 and 7.'],
    best: ['dimarps', 'm3cells', 'dimtriads', 'g4'],
  },
  'whole-tone': {
    over: '7♯5 and 7♭13 dominants, and 9♯11♭13.',
    colour: ['#5', '#4'], think: 'Six whole steps: there are only two whole-tone scales.',
    tips: ['Every other note is an augmented triad: play them up the neck.', 'It repeats every 2 frets, so one shape moves up a whole step.', 'Use it briefly on a V7 and resolve: on its own it has no home.'],
    best: ['triads', 'g3', 'thirds', 'home'],
  },
  'bebop-dom': {
    over: 'Dominant 7ths, and the ii–V when you think in V.',
    colour: ['7'], think: 'Mixolydian with a passing major 7.',
    tips: ['Descend from the root in 8ths starting on the beat: chord tones land on the beats.', 'Start from any chord tone on a downbeat and the passing tone keeps them on the beat.', 'Enclose the 3rd and the root.'],
    best: ['bebopdown', 'enclose', 'inv', 'into'],
  },
  'bebop-maj': {
    over: 'maj7 and 6 chords; Barry Harris’s major 6th diminished.',
    colour: ['#5'], think: 'Major with a passing ♯5 (C6 and B°7 alternating).',
    tips: ['Descend from the root in 8ths: chord tones (1 3 5 6) on the beats.', 'The notes off the beat make a °7: alternate the 6 chord and the °7.', 'Enclose the 3rd and 5th.'],
    best: ['bebopdown', 'enclose', 'home', 'into'],
  },
  'bebop-dor': {
    over: 'm7 chords, the ii of a ii–V.',
    colour: ['3'], think: 'Dorian with a passing major 3rd.',
    tips: ['Descend from the root in 8ths: chord tones on the beats.', 'The major 3 is only a passing tone between 4 and ♭3.', 'Enclose the ♭3 and the root.'],
    best: ['bebopdown', 'enclose', 'inv', 'into'],
  },
};
