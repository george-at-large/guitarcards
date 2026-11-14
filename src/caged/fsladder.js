// Free scales, moving: what to step through (ladders of modes one note apart, shuffles, sets of arpeggio types), the
// arpeggio inside a mode (to the 7th, or stacked on to 13), and interval patterns (degree numbers like 1 2 3 5 or
// 3 5 7 9) spelled out in whichever mode is playing. Pure: no screen, no sound.
import * as T from '../theory.js';
import * as F from '../fretboard.js';
import * as SC from './scales.js';

const BY = Object.fromEntries(SC.SCALES.map((s) => [s.id, s]));
export const semisOf = (iv) => T.intervalSemis(F.simpleIv(String(iv))) % 12;
// an interval's degree number inside one octave: 9 → 2, 11 → 4, 13 → 6
export const numberOf = (iv) => { const n = Number(String(iv).replace(/\D/g, '')); return n > 7 ? n - 7 : n; };
// as a tension: 2 → 9, 4 → 11, 6 → 13 (accidentals kept)
export const asExt = (iv) => String(iv).replace(/^(bb|b|#)?([246])$/, (m, a, n) => (a || '') + { 2: '9', 4: '11', 6: '13' }[n]);
// back inside the octave: 9 → 2, 11 → 4, 13 → 6
export const asSimple = (iv) => String(iv).replace(/^(bb|b|#)?(9|11|13)$/, (m, a, n) => (a || '') + { 9: '2', 11: '4', 13: '6' }[n]);

// ---------- what to step through ----------
// ladders: each step moves one note by a half step (the dominant ladder's last rung moves two)
export const LADDERS = [
  // drifts: one set of notes, the 1 moves. Each scale is a mode of the first, on its own root (shifts: semitones above
  // the key), and the drone and chords move with it. Only modes that are really used as a home are here.
  // Roles use {degree} for the note name of that degree from the current 1
  { id: 'd-min', group: 'Drifts: same notes, the 1 moves', land: true, drift: true, loop: true, name: 'Drift: natural minor key', ids: ['aeolian', 'dorian', 'lydian', 'mixolydian'], big: ['aeolian', 'ionian', 'dorian', 'phrygian', 'lydian', 'mixolydian'], shifts: { aeolian: 0, ionian: 3, dorian: 5, phrygian: 7, lydian: 8, mixolydian: 10 },
    targets: { aeolian: ['1', 'b3', '5', 'b6'], ionian: ['1', '3', '5'], dorian: ['1', 'b3', '5', '6'], phrygian: ['1', 'b3', '5', 'b2'], lydian: ['1', '3', '5', '#4'], mixolydian: ['1', '3', '5', 'b7'] },
    blurb: 'A minor key’s seven notes, with the 1 moving to the chords of the key: i, then iv, ♭VI and ♭VII (the relative major ♭III and the minor v in All). The drone moves to the new 1.',
    roles: { aeolian: 'Home: the minor key. Land {1}, {b3} and {5}; let {b6} fall to {5} for the minor colour.', ionian: 'The relative major: the same notes with a brighter home. Land {1}, {3} and {5}; {4} and {7} resolve to {3} and {1}.', dorian: 'The iv chord as home. Land {1}, {b3}, {5} and {b7}, and put {6} on a strong beat: it’s the note that makes it Dorian.', phrygian: 'The minor v chord as home: dark. Land {1}, {b3} and {5}; let {b2} fall to {1} off the beat.', lydian: 'The ♭VI chord as home: the big, bright sound of minor-key rock and film. Land {1}, {3} and {5}, and let {#4} ring.', mixolydian: 'The ♭VII chord as home. Land {1}, {3} and {b7}: {b7} is what keeps it from sounding like plain major.' } },
  { id: 'd-hm', targets: { 'harm-min': ['1', 'b3', '5', '7'], 'phryg-dom': ['1', '3', '5'], 'dorian-s4': ['1', 'b3', '5', '#4'] },
    group: 'Drifts: same notes, the 1 moves', land: true, drift: true, loop: true, name: 'Drift: harmonic minor', ids: ['harm-min', 'phryg-dom'], big: ['harm-min', 'dorian-s4', 'phryg-dom'], shifts: { 'harm-min': 0, 'dorian-s4': 5, 'phryg-dom': 7 },
    blurb: 'Harmonic minor, then the same seven notes heard from its 5th: Phrygian dominant, the V7 of a minor key, as a home of its own. The drone moves to the new 1.',
    roles: { 'harm-min': 'Home. On the beats land on {1}, {b3} and {5}; put {7} just before a beat and resolve it up to {1}.', 'phryg-dom': 'Same notes, new 1. Land {1} on beat 1 and {3} on beat 3: the old leading tone is now the major 3rd that makes {1} home. Off the beat, let {b2} fall to {1} and {b6} to {5}.', 'dorian-s4': 'From the 4th: the Ukrainian Dorian of klezmer and Eastern European folk. Land {1}, {b3}, {5}; lean {#4} up into {5}.' } },
  { id: 'd-maj', targets: { ionian: ['1', '3', '5'], dorian: ['1', 'b3', '5', '6'], phrygian: ['1', 'b3', '5', 'b2'], lydian: ['1', '3', '5', '#4'], mixolydian: ['1', '3', '5', 'b7'], aeolian: ['1', 'b3', '5', 'b6'] },
    group: 'Drifts: same notes, the 1 moves', land: true, drift: true, loop: true, name: 'Drift: major scale modes', ids: ['ionian', 'dorian', 'mixolydian', 'aeolian'], big: ['ionian', 'dorian', 'phrygian', 'lydian', 'mixolydian', 'aeolian'], shifts: { ionian: 0, dorian: 2, phrygian: 4, lydian: 5, mixolydian: 7, aeolian: 9 },
    blurb: 'One major scale’s notes, with the 1 moving to each of its degrees: the same frets, a different home each time. The drone moves to the new 1.',
    roles: { ionian: 'Home: the major scale. Land {1}, {3} and {5} on the beats; {4} and {7} are the tension notes, resolving to {3} and {1}.', dorian: 'Land {1}, {b3}, {5} and {b7} on the beats, and put {6} on a strong beat now and then: it’s the note that says Dorian, not natural minor.', phrygian: 'Land {1}, {b3} and {5}; let {b2} fall to {1} off the beat. That half step down is the whole sound.', lydian: 'Land {1}, {3} and {5}, and let {#4} sit on a beat: it floats instead of resolving.', mixolydian: 'Land {1}, {3} and {b7} on the beats: {b7} is what makes it Mixolydian, not major.', aeolian: 'The relative minor. Land {1}, {b3} and {5}; let {b6} fall to {5} for the minor colour.' } },
  { id: 'd-mm', targets: { 'mel-min': ['1', 'b3', '5', '7'], 'lyd-dom': ['1', '3', 'b7', '#4'], 'mixo-b6': ['1', '3', 'b7', 'b6'], 'locrian-n2': ['1', 'b3', 'b5', 'b7'], altered: ['1', '3', 'b7'] },
    group: 'Drifts: same notes, the 1 moves', land: true, drift: true, loop: true, name: 'Drift: melodic minor modes', ids: ['mel-min', 'lyd-dom', 'altered'], big: ['mel-min', 'lyd-dom', 'mixo-b6', 'locrian-n2', 'altered'], shifts: { 'mel-min': 0, 'lyd-dom': 5, 'mixo-b6': 7, 'locrian-n2': 9, altered: 11 },
    blurb: 'The jazz family: melodic minor’s notes, heard from the degrees jazz players actually use as a home. The drone moves to the new 1.',
    roles: { 'mel-min': 'Home: melodic minor. Land {1}, {b3}, {5} and {7}: the {7} against {b3} is the minor-major sound.', 'lyd-dom': 'From the 4th: a dominant 7th that floats. Land {1}, {3} and {b7}, and put {#4} on a beat: the ♯11 is its sound.', 'mixo-b6': 'From the 5th: land {1}, {3}, {5} and {b7}; let {b6} fall to {5}.', 'locrian-n2': 'From the 6th: the m7♭5 sound jazz players reach for. Land {1}, {b3}, {b5} and {b7}; the natural {2} softens it.', altered: 'From the 7th: it never feels settled. Land {1}, {3} and {b7}, the shell of the chord, and put the tensions {b9}, {#9}, {#11} and {b13} between them.' } },
  // landscapes: a family of scales you want side by side, over one root and one drone. The first is home: each of
  // the others is shown against it (the notes that changed ringed, the home notes they replaced faint)
  { id: 'l-minor', group: 'Landscapes', land: true, loop: true, name: 'Minor: natural, harmonic, melodic', ids: ['aeolian', 'harm-min', 'mel-min'], big: ['min-pent', 'blues', 'aeolian', 'harm-min', 'mel-min', 'dorian'], blurb: 'Natural, harmonic and melodic minor on one root: your minor shapes, then the same shapes with the 7th raised, then the 6th too.',
    roles: { aeolian: 'Natural minor, the home shape: ♭6 and ♭7 give the plain minor of rock and pop.', 'harm-min': 'Raise the 7th: a leading tone a half step under the root, so the V chord becomes a dominant 7th. The gap from ♭6 up to 7 is its exotic sound.', 'mel-min': 'Raise the 6th as well: the smooth jazz minor, for m6 and m(maj7) chords, and the classical way up to the root.', 'min-pent': 'Minor pentatonic: the five strongest notes of the minor shape, with no half steps. The 2nd and ♭6 drop out (faint).', blues: 'Minor pentatonic plus the ♭5 blue note.', dorian: 'Back to seven notes with a natural 6th: the brighter minor of funk and jazz (melodic minor with its 7th lowered).' } },
  { id: 'l-mmodes', group: 'Landscapes', land: true, loop: true, name: 'Minor modes', ids: ['aeolian', 'dorian', 'phrygian'], big: ['min-pent', 'dorian', 'aeolian', 'phrygian'], blurb: 'The three everyday minor modes from one shape: only the 6th or the 2nd moves.',
    roles: { aeolian: 'Natural minor, the home shape.', dorian: 'Raise the 6th: the brighter minor of funk, jazz and Latin rock. The iv chord turns major.', phrygian: 'Lower the 2nd: the darkest common minor, a half step above the root. Metal, flamenco and film menace.', 'min-pent': 'Minor pentatonic: the notes all three minor modes share, so it fits over any of them.', locrian: 'Lower the 5th too: the darkest mode, for the m7♭5 chord rather than a key of its own.' } },
  { id: 'l-major', group: 'Landscapes', land: true, loop: true, name: 'Major: major, harmonic, melodic', ids: ['ionian', 'harm-maj', 'mixo-b6'], big: ['maj-pent', 'ionian', 'harm-maj', 'mixo-b6', 'mixolydian'], blurb: 'Major, harmonic major and melodic major on one root: the mirror of the three minors, with the 6th lowered, then the 7th.',
    roles: { ionian: 'The major scale, the home shape.', 'harm-maj': 'Lower the 6th (harmonic major): major with a dark edge, from borrowing the minor iv chord. Film music and Beatles-style turns.', 'mixo-b6': 'Lower the 7th as well (melodic major, also called Mixolydian ♭6): a major 3rd under a minor top half, the sound of a dominant leaning to minor.', 'maj-pent': 'Major pentatonic: the major shape without its half steps. The 4th and 7th drop out (faint).', mixolydian: 'Raise the 6th back: Mixolydian, the bluesy, rock major.' } },
  { id: 'l-mmajor', group: 'Landscapes', land: true, loop: true, name: 'Major modes', ids: ['ionian', 'lydian', 'mixolydian'], big: ['maj-pent', 'ionian', 'lydian', 'lyd-dom', 'mixolydian'], blurb: 'The three major modes from one shape: only the 4th or the 7th moves.',
    roles: { ionian: 'The major scale, the home shape.', lydian: 'Raise the 4th: a floating, dreamy major with no pull towards IV. Film scores and instrumental rock.', mixolydian: 'Lower the 7th: the bluesy, rock major. The I chord becomes a dominant 7th and a major ♭VII appears.', 'maj-pent': 'Major pentatonic: the notes the major modes share, without the 4th and 7th that tell them apart.', 'lyd-dom': 'Raise the 4th and lower the 7th: Lydian dominant, the bright 7♯11 sound.' } },
  { id: 'l-blues', group: 'Landscapes', land: true, loop: true, name: 'Blues: minor and major', ids: ['min-pent', 'blues', 'maj-pent'], big: ['min-pent', 'blues', 'dorian', 'mixolydian', 'maj-pent', 'maj-blues'], blurb: 'The blues player’s landscape over one root: minor pentatonic, the blue note and the major pentatonic. Large adds the modes that fill them out and the major blues scale.',
    roles: { 'min-pent': 'Minor pentatonic, the home box of blues and rock.', blues: 'Add the ♭5: the blue note, passed through between 4 and 5.', 'maj-pent': 'Major pentatonic on the same root: the sweet, country side. Blues players swap between this and the minor one, often chord by chord.', mixolydian: 'The major pentatonic plus 4 and ♭7: it fits the dominant 7th chords of a blues.', dorian: 'The minor pentatonic plus 2 and 6: minor blues with a brighter, jazzier edge.', 'maj-blues': 'Major pentatonic plus the ♭3, slid up into the 3rd: the country-blues major sound.' } },
  { id: 'l-dom', group: 'Landscapes', land: true, loop: true, name: 'Dominant colours', ids: ['mixolydian', 'lyd-dom', 'altered'], big: ['lyd-dom', 'mixolydian', 'mixo-b6', 'phryg-dom', 'altered', 'dim-hw'], home: 'mixolydian', blurb: 'Scales for one dominant 7th chord: 1, 3 and ♭7 stay, and the tensions around them change.',
    roles: { mixolydian: 'Mixolydian, the home shape: the plain dominant sound.', 'lyd-dom': 'Raise the 4th to ♯11: bright and floating, for 7th chords that don’t resolve, like ♭VII7 and tritone subs.', 'mixo-b6': 'Lower the 6th to ♭13: a dominant leaning towards a minor chord.', 'phryg-dom': 'Add ♭9 to the ♭13: the V7 of a minor key (harmonic minor from its 5th).', altered: 'Every tension altered (♭9, ♯9, ♯11, ♭13), no natural 5th: the most tension, for a jazz V7 resolving.', 'dim-hw': 'Half-whole diminished: ♭9, ♯9 and ♯11 with a natural 5th and 13th. For 7♭9 and 13♭9 chords.' } },
  { id: 'l-flam', group: 'Landscapes', land: true, loop: true, name: 'Flamenco Phrygian', ids: ['phrygian', 'phryg-dom'], big: ['phrygian', 'phryg-dom', 'dbl-harm', 'harm-min'], blurb: 'Over one root, swap the minor 3rd for the major one and back, as flamenco and metal players do with the chord.',
    roles: { phrygian: 'Phrygian, the home shape: minor with a ♭2.', 'phryg-dom': 'Raise the 3rd: the major I chord of the flamenco cadence. The 3rd moves with the chord, so players switch all the time.', 'dbl-harm': 'Raise the 7th too (double harmonic, or Byzantine): two exotic gaps, heard in Arabic, Balkan and Indian music.', 'harm-min': 'Harmonic minor on the same root: the 2nd and 7th rise. Its family is the same one: Phrygian dominant is harmonic minor played from its 5th.' } },
  { id: 'bright', group: 'Ladders', name: 'Brightness: the seven modes', ids: ['lydian', 'ionian', 'mixolydian', 'dorian', 'aeolian', 'phrygian', 'locrian'], blurb: 'Lydian down to Locrian, one note lower at each step, then back up.' },
  { id: 'bright-x', group: 'Ladders', name: 'Brightness, extended', ids: ['lyd-aug', 'lydian', 'ionian', 'mixolydian', 'dorian', 'aeolian', 'phrygian', 'locrian', 'altered', 'superloc-bb7'], blurb: 'The seven modes with a rung above (Lydian augmented) and two below (altered, super-Locrian 𝄫7): melodic and harmonic minor modes stretch the ladder.' },
  { id: 'dom', group: 'Ladders', name: 'Dominant: inside to outside', ids: ['lyd-dom', 'mixolydian', 'mixo-b6', 'phryg-dom', 'altered'], blurb: 'Over a dominant 7th: the root, 3rd and ♭7 stay put while the tensions darken, from Lydian dominant to altered (the last step moves two notes).' },
  { id: 'minor', group: 'Ladders', name: 'Minor: brightest to darkest', ids: ['mel-min', 'dorian', 'aeolian', 'phrygian', 'locrian'], blurb: 'Every minor mode from melodic minor down to Locrian, one note at a time.' },
  { id: 'mdia-a', group: 'Ladders', name: 'Minor diamond, via Aeolian', ids: ['dorian-s4', 'dorian', 'aeolian', 'phrygian'], blurb: 'Dorian ♯4 down to Phrygian: the 6th drops before the 2nd.' },
  { id: 'mdia-b', group: 'Ladders', name: 'Minor diamond, via Dorian ♭2', ids: ['dorian', 'dorian-b2', 'phrygian'], blurb: 'Dorian to Phrygian the other way: the 2nd drops before the 6th.' },
  { id: 'hd', group: 'Ladders', name: 'Half-diminished square', ids: ['aeolian', 'locrian-n2', 'locrian', 'phrygian'], loop: true, blurb: 'Round the square: Aeolian, Locrian ♮2, Locrian, Phrygian, back to Aeolian. The 2nd and 5th take turns to drop and rise.' },
  { id: 'cube', group: 'Major to minor', name: 'The cube: all eight scales', ids: ['ionian', 'mixolydian', 'mixo-b6', 'harm-maj', 'harm-min', 'mel-min', 'dorian', 'aeolian'], blurb: 'Every mix of 3 or ♭3, 6 or ♭6, 7 or ♭7 over the same root, visited one note at a time.' },
  { id: 'r-dia', group: 'Major to minor', name: 'Diatonic route (7, 3, 6)', ids: ['ionian', 'mixolydian', 'dorian', 'aeolian'], blurb: 'Major to minor through the church modes: the 7th drops, then the 3rd, then the 6th.' },
  { id: 'r-mel', group: 'Major to minor', name: 'Classical route (3, 6, 7)', ids: ['ionian', 'mel-min', 'harm-min', 'aeolian'], blurb: 'Major to minor through melodic and harmonic minor: the 3rd drops, then the 6th, then the 7th.' },
  { id: 'r-harm', group: 'Major to minor', name: 'Harmonic route (6, 3, 7)', ids: ['ionian', 'harm-maj', 'harm-min', 'aeolian'], blurb: 'The 6th drops first (harmonic major), then the 3rd (harmonic minor), then the 7th.' },
  { id: 'r-dark', group: 'Major to minor', name: 'Dark-major route (6, 7, 3)', ids: ['ionian', 'harm-maj', 'mixo-b6', 'aeolian'], blurb: 'The major 3rd holds on longest: harmonic major, then Mixolydian ♭6, the film-score sound.' },
  { id: 'r-mix', group: 'Major to minor', name: 'Mixolydian route (7, 6, 3)', ids: ['ionian', 'mixolydian', 'mixo-b6', 'aeolian'], blurb: 'The 7th drops, then the 6th, and the 3rd last.' },
  { id: 'r-mm', group: 'Major to minor', name: 'Melodic route (3, 7, 6)', ids: ['ionian', 'mel-min', 'dorian', 'aeolian'], blurb: 'The 3rd drops (melodic minor), then the 7th (Dorian), then the 6th.' },
  { id: 'sh-modes', group: 'Shuffles', name: 'The seven modes, shuffled', ids: ['ionian', 'dorian', 'phrygian', 'lydian', 'mixolydian', 'aeolian', 'locrian'], shuffle: true, blurb: 'The seven modes in a random order, each pass a new order.' },
  { id: 'sh-mm', group: 'Shuffles', name: 'Melodic minor modes, shuffled', ids: ['mel-min', 'dorian-b2', 'lyd-aug', 'lyd-dom', 'mixo-b6', 'locrian-n2', 'altered'], shuffle: true, blurb: 'The seven modes of melodic minor, shuffled.' },
  { id: 'sh-hm', group: 'Shuffles', name: 'Harmonic minor modes, shuffled', ids: ['harm-min', 'locrian-n6', 'ionian-s5', 'dorian-s4', 'phryg-dom', 'lydian-s2', 'superloc-bb7'], shuffle: true, blurb: 'The seven modes of harmonic minor, shuffled.' },
  { id: 'sh-all', group: 'Shuffles', name: 'Everything, exotic too, shuffled', ids: SC.SCALES.map((s) => s.id), shuffle: true, blurb: 'Every scale the app knows, exotic ones too, shuffled.' },
  { id: 'sh-use', group: 'Shuffles', name: 'Everything useful, shuffled', ids: ['ionian', 'aeolian', 'min-pent', 'maj-pent', 'blues', 'dorian', 'mixolydian', 'lydian', 'phrygian', 'harm-min', 'mel-min', 'altered', 'lyd-dom', 'locrian-n2', 'mixo-b6', 'phryg-dom'], shuffle: true, blurb: 'The essentials, everyday, colour and jazz scales, shuffled.' },
];
// progressions: a mode for each chord. Each step is [mode, semitones above the key, chord]; the 1, the drone and the
// chord move with every step. ids[0] is the key's own scale (for naming degrees); steps can repeat
const P = (id, name, key, steps, blurb) => ({ id, group: 'Progressions', land: true, drift: true, loop: true, name, ids: [key], steps, blurb, keyName: { ionian: 'major', aeolian: 'minor', 'harm-min': 'minor', mixolydian: 'blues' }[key] });
LADDERS.push(
  P('p-pop', 'Pop: I – V – vi – IV', 'ionian', [['ionian', 0, ''], ['mixolydian', 7, ''], ['aeolian', 9, 'm'], ['lydian', 5, '']], 'The four chords of a thousand pop songs, each with the mode of the key built on it: Ionian, Mixolydian, Aeolian, Lydian. Same notes throughout; the 1 moves with the chord.'),
  P('p-251', 'Jazz: ii – V – I', 'ionian', [['dorian', 2, 'm7'], ['mixolydian', 7, '7'], ['ionian', 0, 'maj7'], ['ionian', 0, 'maj7']], 'The cadence of jazz: Dorian on the ii, Mixolydian on the V, Ionian on the I (two bars). Aim for each chord’s 3rd as it arrives.'),
  P('p-1625', 'Turnaround: I – vi – ii – V', 'ionian', [['ionian', 0, 'maj7'], ['aeolian', 9, 'm7'], ['dorian', 2, 'm7'], ['mixolydian', 7, '7']], 'The 1950s and rhythm-changes turnaround, a mode for each chord.'),
  P('p-145', 'Major: I – IV – V', 'ionian', [['ionian', 0, ''], ['lydian', 5, ''], ['mixolydian', 7, ''], ['ionian', 0, '']], 'Folk, rock and country’s three chords, each heard as its own mode of the key.'),
  P('p-blues', 'Blues: 12 bars, Mixolydian on each', 'mixolydian', [['mixolydian', 0, '7'], ['mixolydian', 5, '7'], ['mixolydian', 0, '7'], ['mixolydian', 0, '7'], ['mixolydian', 5, '7'], ['mixolydian', 5, '7'], ['mixolydian', 0, '7'], ['mixolydian', 0, '7'], ['mixolydian', 7, '7'], ['mixolydian', 5, '7'], ['mixolydian', 0, '7'], ['mixolydian', 7, '7']], 'A 12-bar blues (quick change) with Mixolydian on every 7th chord, so the notes change with each chord. Set Auto to every 4 beats for one bar a chord.'),
  P('p-m-rock', 'Minor rock: i – ♭VI – ♭VII', 'aeolian', [['aeolian', 0, 'm'], ['lydian', 8, ''], ['mixolydian', 10, ''], ['aeolian', 0, 'm']], 'The Aeolian rock progression: Aeolian, then Lydian on ♭VI and Mixolydian on ♭VII, all the same notes.'),
  P('p-m-145', 'Minor: i – iv – v', 'aeolian', [['aeolian', 0, 'm'], ['dorian', 5, 'm'], ['phrygian', 7, 'm'], ['aeolian', 0, 'm']], 'A natural minor key’s three minor chords: Aeolian, Dorian on iv, Phrygian on v.'),
  P('p-andal', 'Andalusian: i – ♭VII – ♭VI – V', 'aeolian', [['aeolian', 0, 'm'], ['mixolydian', 10, ''], ['lydian', 8, ''], ['phryg-dom', 7, '7']], 'The flamenco and rock descent. The V is major, so its mode is Phrygian dominant: the 7th of the key rises for that chord only.'),
  P('p-m251', 'Minor jazz: iiø – V7♭9 – i', 'harm-min', [['locrian', 2, 'm7b5'], ['phryg-dom', 7, '7b9'], ['mel-min', 0, 'm6'], ['mel-min', 0, 'm6']], 'The minor ii – V – i: Locrian on the half-diminished ii, Phrygian dominant on the V7♭9, melodic minor on the i (two bars).'),
);
// for progressions: what to do in each mode, whatever chord of the key it sits on
export const MODE_ROLES = {
  ionian: 'Land {1}, {3} and {5}; {4} and {7} are the tension notes, resolving to {3} and {1}.',
  dorian: 'Land {1}, {b3}, {5} and {b7}; put {6} on a strong beat now and then: it’s the note that makes it Dorian.',
  phrygian: 'Land {1}, {b3} and {5}; let {b2} fall to {1} off the beat.',
  lydian: 'Land {1}, {3} and {5}, and let {#4} ring: it floats instead of resolving.',
  mixolydian: 'Land {1}, {3} and {b7}: the {b7} is what makes it a dominant sound.',
  aeolian: 'Land {1}, {b3} and {5}; let {b6} fall to {5} for the minor colour.',
  locrian: 'The half-diminished chord: land {1}, {b3}, {b5} and {b7}, then step to the next chord’s 3rd.',
  'phryg-dom': 'The dominant of a minor key. Land {3}, the key’s leading tone, as the chord arrives, with {1} and {5}; let {b2} fall to {1} and {b6} to {5}.',
  'mel-min': 'Land {1}, {b3}, {5} and {6} or {7}: the natural 6 and 7 are the jazz minor sound.',
};
export const MODE_TARGETS = { ionian: ['1', '3', '5'], dorian: ['1', 'b3', '5', '6'], phrygian: ['1', 'b3', '5', 'b2'], lydian: ['1', '3', '5', '#4'], mixolydian: ['1', '3', '5', 'b7'], aeolian: ['1', 'b3', '5', 'b6'], locrian: ['1', 'b3', 'b5', 'b7'], 'phryg-dom': ['3', '1', '5', 'b2'], 'mel-min': ['1', 'b3', '5', '6'] };

// arpeggio types to step through: plain ones and extended ones
export const ARPSETS = [
  { id: 'a-tri', ext: false, name: 'Triads', qs: ['', 'm', 'dim', 'aug', 'sus2', 'sus4'], blurb: 'The six triads on the same root.' },
  { id: 'a-6', ext: false, name: 'Sixes', qs: ['6', 'm6', '69'], blurb: 'The 6 chords: the 6th in place of the 7th.' },
  { id: 'a-7', ext: false, name: 'Sevenths', qs: ['maj7', '7', 'm7', 'm7b5', 'dim7', 'mMaj7'], blurb: 'The six main seventh chords on the same root.' },
  { id: 'a-all', ext: false, name: 'All of these, shuffled', qs: ['', 'm', 'dim', 'aug', 'sus4', '6', 'm6', 'maj7', '7', 'm7', 'm7b5', 'dim7', 'mMaj7', 'maj7#5', '7sus4'], shuffle: true, blurb: 'Triads, sixes and sevenths, shuffled.' },
  { id: 'e-9', ext: true, name: 'Ninths', qs: ['maj9', '9', 'm9', 'add9', 'madd9', '69'], blurb: 'The ninth chords: the 9th on top of the 7th (or the triad).' },
  { id: 'e-dom', ext: true, name: 'Dominant tensions', qs: ['9', '13', '7b9', '7#9', '7#11', '7b13', '7alt'], blurb: 'One dominant 7th, a different tension each time.' },
  { id: 'e-13', ext: true, name: 'Elevenths and thirteenths', qs: ['m11', 'maj7#11', '11', '9sus4', '13', 'm13', 'maj13'], blurb: 'The tall chords: 11ths and 13ths.' },
  { id: 'e-all', ext: true, name: 'All of these, shuffled', qs: ['maj9', '9', 'm9', 'add9', '69', '13', '7b9', '7#9', '7#11', '7b13', '7alt', 'm11', 'maj7#11', '9sus4', 'm13', 'maj13'], shuffle: true, blurb: 'Every extended arpeggio here, shuffled.' },
];
export const seqDef = (id) => LADDERS.find((l) => l.id === id) || ARPSETS.find((a) => a.id === id) || null;
// the items of a sequence: modes ({mode}) or arpeggio types ({q})
export const itemsOf = (def, big = false) => (def.qs ? def.qs.map((q) => ({ q })) : ((big && def.big) || def.ids).filter((id) => BY[id]).map((mode) => ({ mode })));
// a landscape's home scale: the one every other is shown against
export const homeOf = (def) => def.home || def.ids[0];
// the order to visit them in: a loop goes round; anything else goes there and back (without repeating the ends)
export function walkOf(def, n) {
  const fwd = Array.from({ length: n }, (_, i) => i);
  if (def.loop || def.shuffle || n < 3) return fwd;
  return fwd.concat(fwd.slice(1, -1).reverse());
}
export function shuffled(a, avoidFirst = null) {
  const b = a.slice();
  for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; }
  if (avoidFirst != null && b.length > 1 && b[0] === avoidFirst) [b[0], b[1]] = [b[1], b[0]];
  return b;
}
export const qName = (q) => ({ '': 'major', m: 'minor', dim: 'diminished', aug: 'augmented' }[q] ?? q.replace(/b(?=\d)/g, '♭').replace(/#/g, '♯').replace('mMaj7', 'm(maj7)').replace(/^69$/, '6/9').replace(/^add9$/, 'add 9').replace(/^madd9$/, 'm(add 9)'));

// what moved between two modes on the same root: the notes that left and the notes that came, each in its own spelling
export function moved(fromId, toId) {
  if (!BY[fromId] || !BY[toId]) return null;
  const a = BY[fromId].ivs.map((iv) => [semisOf(iv), iv]), b = BY[toId].ivs.map((iv) => [semisOf(iv), iv]);
  const A = new Set(a.map((x) => x[0])), B = new Set(b.map((x) => x[0]));
  const out = a.filter((x) => !B.has(x[0])), inn = b.filter((x) => !A.has(x[0]));
  if (!out.length && !inn.length) return null;
  // pair each leaver with the arrival nearest to it (the pairing that moves least), in each scale's own spelling
  const d = (x, y) => { const k = Math.abs(x - y) % 12; return Math.min(k, 12 - k); };
  const perms = (a) => (a.length <= 1 ? [a] : a.flatMap((x, i) => perms(a.slice(0, i).concat(a.slice(i + 1))).map((r) => [x, ...r])));
  let best = null, bs = Infinity;
  for (const p of perms(inn.map((_, i) => i))) {
    let c = 0;
    out.forEach((o, i) => { c += p[i] === undefined ? 6 : d(o[0], inn[p[i]][0]); });
    if (c < bs) { bs = c; best = p; }
  }
  const pairs = out.map((o, i) => [o[1], best[i] === undefined ? null : inn[best[i]][1]]);
  for (let j = 0; j < inn.length; j++) if (!best.includes(j)) pairs.push([null, inn[j][1]]);
  return { pairs, added: inn.map((x) => x[0]) };
}

// ---------- arpeggios ----------
// the arpeggio inside a mode: 1 3 5 7 (or 6 when it has no 7th), and stacked on to 9, 11 and 13 when extended
export function modeArp(id, ext) {
  // (a natural 5th wins over an altered one when the scale has both, as in the blues scale)
  const ivs = BY[id].ivs, pick = (n) => (n === 5 && ivs.includes('5') ? '5' : ivs.find((iv) => numberOf(iv) === n));
  const out = [];
  for (const n of [1, 3, 5]) { const iv = pick(n); if (iv) out.push(asSimple(iv)); }
  const sev = pick(7) || pick(6);
  if (sev) out.push(asSimple(sev));
  if (ext) for (const iv of ivs) if ([2, 4, 6].includes(numberOf(iv)) && !out.includes(asSimple(iv))) out.push(asExt(asSimple(iv)));
  return out;
}

// ---------- interval patterns ----------
// degree numbers, played in whichever mode is up: the shape stays, the mode decides each note's flavour
export const CELLS = [
  { c: [1, 2, 3, 5], name: 'the Coltrane cell' },
  { c: [1, 3, 5, 7], name: 'the seventh arpeggio' },
  { c: [3, 5, 7, 9], name: 'the upper structure' },
  { c: [1, 3, 5, 9], name: 'triad and 9th' },
  { c: [5, 7, 9, 11], name: 'the triad on the 5th, plus 11' },
  { c: [7, 9, 11, 13], name: 'the tensions from the 7th' },
  { c: [9, 11, 13], name: 'the tension triad' },
  { c: [1, 4, 7], name: 'stacked 4ths' },
  { c: [1, 5, 9, 13], name: 'stacked 5ths' },
  { c: [3, 7, 9, 13], name: 'a rootless voicing' },
  { c: [1, 2, 3, 4, 5], name: 'the first five' },
  { c: [2, 4, 6], name: 'the triad on the 2nd' },
  { c: [1, 2, 5], name: 'the sus2 cell' },
  { c: [1, 4, 5], name: 'the sus4 cell' },
  { c: [1, 3, 6, 9], name: 'the 6/9 shape' },
  { c: [3, 4, 5, 7], name: 'the leading notes' },
  { c: [5, 6, 7, 9], name: 'up from the 5th' },
];
const POOL = [1, 2, 3, 4, 5, 6, 7, 9, 11, 13];
// a pattern: usually a named cell, sometimes a random set of 3 to 5 degrees
export function newPattern(prev = null) {
  for (let tries = 0; tries < 20; tries++) {
    let p;
    if (Math.random() < 0.7) p = CELLS[Math.floor(Math.random() * CELLS.length)];
    else {
      const k = 3 + Math.floor(Math.random() * 3), got = [], base = new Set();
      for (const n of shuffled(POOL)) { const b = n > 7 ? n - 7 : n; if (base.has(b)) continue; base.add(b); got.push(n); if (got.length === k) break; }
      p = { c: got.sort((a, b) => a - b), name: '' };
    }
    if (!prev || p.c.join() !== prev.join()) return { c: p.c.slice(), name: p.name };
  }
  return { c: [1, 2, 3, 5], name: 'the Coltrane cell' };
}
// one degree number in a mode: its spelling (a 9 stays a 9: ♭9, 9, ♯9) or null if the scale has no such degree
export function spellNum(id, n) {
  const base = n > 7 ? n - 7 : n;
  const iv = BY[id].ivs.find((x) => numberOf(x) === base);
  if (!iv) return null;
  return n > 7 ? asExt(asSimple(iv)) : asSimple(iv);
}

// ---------- congruent scales: the gapped scales (on any root) whose notes all sit inside a scale ----------
const IVC = ['1', 'b2', '2', 'b3', '3', '4', '#4', '5', 'b6', '6', 'b7', '7'];
const pcsOfC = (ivs, start = 0) => [...new Set(ivs.map((iv) => (T.intervalSemis(F.simpleIv(iv)) + start) % 12))];
const IVN = IVC;
// the gapped scales on any root whose notes all sit inside this one (plus the blues fits), as heard over the drone
export function congruent(id) {
  const base = pcsOfC(BY[id].ivs);
  const out = [], seen = new Set();
  const gapped = SC.SCALES.filter((s) => s.ivs.length <= 6 && s.id !== 'whole-tone' && s.id !== 'aug-hex');
  for (const g of gapped) for (let st = 0; st < 12; st++) {
    const p = pcsOfC(g.ivs, st);
    let why = null;
    if (p.every((x) => base.includes(x))) why = 'inside';
    else if (st === 0 && base.includes(4) && base.includes(10) && (g.id === 'min-pent' || g.id === 'blues')) why = 'blues';
    if (!why) continue;
    // the same notes under another name (C minor pentatonic = E♭ major pentatonic): keep the first, note the other
    const key = [...p].sort((x, y) => x - y).join();
    if (seen.has(key)) {
      const prev = out.find((o) => o.key === key);
      if (prev && st === 0 && prev.start !== 0) { prev.also = { id: prev.id, start: prev.start }; prev.id = g.id; prev.start = 0; } // name it from the drone's root
      else if (prev && !prev.also) prev.also = { id: g.id, start: st };
      continue;
    }
    seen.add(key);
    const as = p.map((x) => T.prettyIv(IVN[x])).sort((x, y) => IVN.indexOf(x.replace('♭', 'b').replace('♯', '#')) - IVN.indexOf(y.replace('♭', 'b').replace('♯', '#')));
    out.push({ id: g.id, start: st, why, as, key });
  }
  // the plainest first: pentatonics on the root, then on other roots, then the rest
  const rank = (c) => (c.start === 0 ? 0 : 1) + (c.id.includes('pent') ? 0 : 2) + (c.why === 'blues' ? 1 : 0);
  return out.sort((a, b) => rank(a) - rank(b));
}


// ---------- chord context: the chords that call for each scale ----------
// key: where a progression resolves (semitones above the 1), so V7 → I is numbered as such, not as I7 → IV
// over one root: [semitones above the root, chord quality], a bar each (shorter when the scale changes sooner), looping.
// A landscape can override any of them (the blues landscape plays everything over I7 – IV7, say)
export const CONTEXT = {
  aeolian: { prog: [[0, 'm'], [8, ''], [10, ''], [0, 'm']], why: 'i – ♭VI – ♭VII – i: the ♭6 and ♭7 as chords, the rock and pop minor.' },
  'harm-min': { prog: [[0, 'm'], [7, '7b9']], why: 'i – V7♭9: the raised 7 is the 3rd of the V chord, pulling up to the root; the ♭6 is its ♭9.' },
  'mel-min': { prog: [[0, 'm6'], [0, 'mMaj7']], why: 'i6 – i(maj7): the natural 6 and 7 are chord tones, the jazz minor tonic.' },
  dorian: { prog: [[0, 'm7'], [5, '7']], why: 'i7 – IV7: the natural 6 is the 3rd of the IV chord, the funk and Latin vamp.' },
  phrygian: { prog: [[0, 'm'], [1, '']], why: 'i – ♭II: the ♭2 as a major chord a half step up, the metal and flamenco rub.' },
  locrian: { prog: [[0, 'm7b5'], [1, 'maj7']], why: 'iø7 – ♭IImaj7: Locrian only really works over the m7♭5 chord.' },
  'min-pent': { prog: [[0, 'm7'], [5, 'm7']], why: 'i7 – iv7: the minor blues-rock vamp.' },
  blues: { prog: [[0, 'm7'], [5, 'm7']], why: 'i7 – iv7: the ♭5 passes between 4 and 5 on both chords.' },
  ionian: { prog: [[0, 'maj7'], [7, '7']], why: 'Imaj7 – V7: the 7 and 4 are the notes that pull V back to I.' },
  'harm-maj': { prog: [[0, 'maj7'], [5, 'm6']], why: 'Imaj7 – iv6: the ♭6 is the borrowed minor iv chord’s 3rd.' },
  'mixo-b6': { prog: [[0, ''], [10, ''], [5, 'm'], [0, '']], why: 'I – ♭VII – iv – I: major on top, ♭6 and ♭7 underneath.' },
  lydian: { prog: [[0, 'maj7'], [2, '']], why: 'Imaj7 – II: the ♯4 is the 3rd of the major II chord, the floating film vamp.' },
  mixolydian: { prog: [[0, '7'], [10, '']], why: 'I7 – ♭VII: the ♭7 as a chord, the rock major.' },
  'maj-pent': { prog: [[0, '69'], [5, 'add9']], why: 'I6/9 – IVadd9: no 4 or 7 to clash with either chord.' },
  'maj-blues': { prog: [[0, '7'], [5, '7']], why: 'I7 – IV7: the ♭3 slides into the 3rd of each chord.' },
  'lyd-dom': { prog: [[0, '7#11'], [0, '9']], why: 'A 7th chord that stays put: the ♯11 floats instead of resolving.' },
  'phryg-dom': { key: 5, prog: [[0, '7b9'], [5, 'm']], why: 'V7♭9 – i: the dominant of a minor key, its ♭9 and ♭13 from the key’s ♭6 and ♭2.' },
  altered: { key: 5, prog: [[0, '7alt'], [5, 'maj7']], why: 'V7alt – Imaj7: every tension altered, then resolved.' },
  'dim-hw': { key: 5, prog: [[0, '13b9'], [5, 'maj7']], why: 'V13♭9 – Imaj7: the ♭9 with a natural 13, resolved.' },
  'dbl-harm': { prog: [[0, 'maj7'], [1, 'maj7']], why: 'Imaj7 – ♭IImaj7: both chords from the scale’s two exotic gaps.' },
};
export const LAND_CONTEXT = {
  'l-blues': {
    'min-pent': { prog: [[0, '7'], [5, '7']], why: 'I7 – IV7 of a blues: the minor 3rd rubs the chord’s major 3rd on purpose.' },
    blues: { prog: [[0, '7'], [5, '7']], why: 'I7 – IV7: the ♭5 is the blue note between 4 and 5.' },
    'maj-pent': { prog: [[0, '7'], [5, '7']], why: 'I7 – IV7: sweet over the I chord; over IV its 3 rubs the IV7’s ♭7, so players switch to minor there.' },
    mixolydian: { prog: [[0, '7'], [5, '7']], why: 'I7 – IV7: every note of the I7 is in the scale.' },
    dorian: { prog: [[0, 'm7'], [5, '7']], why: 'i7 – IV7: the minor blues and funk vamp.' },
  },
  'l-dom': {
    mixolydian: { key: 5, prog: [[0, '13'], [5, 'maj7']], why: 'V13 – Imaj7: the plain dominant, resolving to major.' },
    'mixo-b6': { key: 5, prog: [[0, '7b13'], [5, 'm']], why: 'V7♭13 – i: a dominant heading for a minor chord.' },
  },
  'l-flam': {
    phrygian: { prog: [[0, 'm'], [1, '']], why: 'i – ♭II: the minor side of flamenco.' },
    'phryg-dom': { prog: [[5, 'm'], [3, ''], [1, ''], [0, '']], why: 'iv – ♭III – ♭II – I: the Andalusian cadence, landing on the major chord.' },
  },
};
// in a drift, each mode sits on a vamp of its own 1, so the new home is what you hear
Object.assign(LAND_CONTEXT, {
  'd-hm': { 'harm-min': { prog: [[0, 'm'], [0, 'mMaj7']], why: 'i – i(maj7): harmonic minor’s own tonic.' }, 'phryg-dom': { prog: [[0, '7b9'], [1, '']], why: 'I7♭9 – ♭II: the flamenco and Middle Eastern vamp, the old V7 staying put as home.' }, 'dorian-s4': { prog: [[0, 'm7'], [2, '7']], why: 'i7 – II7: the ♯4 is the 3rd of the II7 chord.' } },
  'd-mm': { 'lyd-dom': { prog: [[0, '7#11']], why: 'A 7♯11 vamp: the ♯11 floats.' }, 'locrian-n2': { prog: [[0, 'm7b5']], why: 'A m7♭5 vamp.' }, altered: { prog: [[0, '7alt']], why: 'A 7alt vamp: every tension altered, nowhere to resolve.' } },
});
export const contextOf = (landId, id) => (LAND_CONTEXT[landId] || {})[id] || CONTEXT[id] || null;
