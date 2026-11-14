// The progression library. Chord progressions aren't copyrightable: a song is named only where it's well known for its
// changes, and nothing here is a melody or a lyric. Two ways to write a chart (bars split by |, chords by spaces):
//  • numerals in the engine's chart language, read against the tonic's major scale: 'ii:m7 V:7 | I:maj7 |'
//  • chord symbols in a real key, for standards as they appear on lead sheets: key 'Bb', '| Cm7 F7 | Bbmaj7 |'
// `minor: true` means the tonic is minor. Charts are resolved to { iv, q, rn } and then played in any key.
import * as T from '../theory.js';
import { ivFrom } from './harmony.js';
import { BORROWED } from './borrowdata.js';
import { CHROMATIC } from './chromdata.js';

const P = (name, by, chart, o = {}) => ({ name, by, chart, ...o });
const M = { minor: true };
const K = (key, o = {}) => ({ key, ...o });

export const LIBRARY = [
  { cat: 'Cadences', items: [
    P('Authentic cadence (IV–V7–I)', 'the full stop', '| I:maj | IV:maj | V:7 | I:maj |'),
    P('Major ii–V–I', 'the jazz staple', '| ii:m7 | V:7 | I:maj7 | I:maj7 |'),
    P('Minor ii–V–i', 'the jazz staple in minor', '| ii:m7b5 | V:7b9 | i:m6 | i:m6 |', M),
    P('Plagal cadence (IV–I)', 'the “amen”', '| I:maj | IV:maj | IV:maj | I:maj |'),
    P('Minor plagal (IV–iv–I)', 'the tear-jerker', '| I:maj | IV:maj | iv:min | I:maj |'),
    P('Jazz minor plagal', 'iv6 back home', '| I:maj7 | IV:maj7 | iv:m6 | I:maj7 |'),
    P('Half cadence', 'a phrase that stops on V', '| I:maj | vi:min | ii:min | V:maj |'),
    P('Deceptive cadence (V–vi)', 'V turns to vi', '| I:maj | IV:maj | V:7 | vi:min |'),
    P('Deceptive to ♭VI', 'V7 → ♭VI, borrowed', '| I:maj | IV:maj | V:7 | bVI:maj |'),
    P('Backdoor cadence', 'iv7–♭VII7–I', '| iv:m7 | bVII:7 | I:maj7 | I:maj7 |'),
    P('Tritone substitution', 'ii–♭II7–I', '| ii:m7 | bII:7 | I:maj7 | I:maj7 |'),
    P('The Mario cadence', '♭VI–♭VII–I', '| I:maj | bVI:maj | bVII:maj | I:maj |'),
    P('Picardy third', 'a minor piece ends major', '| i:min | iv:min | V:7 | I:maj |', M),
    P('Neapolitan cadence', '♭II–V–i', '| i:min | bII:maj | V:7 | i:min |', M),
    P('Augmented-sixth cadence', '♭VI7 (German sixth) → V', '| i:min | bVI:7 | V:7 | i:min |', M),
    P('Leading-tone diminished', 'vii°7 → i', '| i:min | iv:min | vii:dim7 | i:min |', M),
    P('Andalusian cadence', 'Hit the Road Jack, Runaway', '| i:min | bVII:maj | bVI:maj | V:maj |', M),
    P('Natural-minor cadence', 'i–iv–v–i', '| i:min | iv:min | v:min | i:min |', M),
    P('Harmonic-minor cadence', 'i–iv–V–i', '| i:min | iv:min | V:7 | i:min |', M),
  ] },
  { cat: 'Pop and rock', items: [
    P('Three-chord rock', 'Twist and Shout, La Bamba', '| I:maj | IV:maj | V:maj | I:maj |'),
    P('I–IV–V–IV', 'Wild Thing', '| I:maj | IV:maj | V:maj | IV:maj |'),
    P('I–IV–v–IV (minor v)', 'Louie Louie', '| I:maj | IV:maj | v:min | IV:maj |'),
    P('I–IV–I–V', 'Brown Eyed Girl', '| I:maj | IV:maj | I:maj | V:maj |'),
    P('The axis (I–V–vi–IV)', 'Let It Be, With or Without You, Don’t Stop Believin’', '| I:maj | V:maj | vi:min | IV:maj |'),
    P('The axis from vi', 'Zombie, Save Tonight', '| vi:min | IV:maj | I:maj | V:maj |'),
    P('The axis from IV', 'a rotation of the four chords', '| IV:maj | I:maj | V:maj | vi:min |'),
    P('Doo-wop (I–vi–IV–V)', 'Stand by Me, Heart and Soul', '| I:maj | vi:min | IV:maj | V:maj |'),
    P('I–V–ii–IV', 'Knockin’ on Heaven’s Door shape', '| I:maj | V:maj | ii:min | ii:min | I:maj | V:maj | IV:maj | IV:maj |'),
    P('Pachelbel’s Canon', 'Pachelbel, and half of pop', '| I:maj V:maj | vi:min iii:min | IV:maj I:maj | IV:maj V:maj |'),
    P('Mixolydian rock', 'Sweet Child o’ Mine, Gloria', '| I:maj | bVII:maj | IV:maj | I:maj |'),
    P('Sweet Home Alabama', 'Lynyrd Skynyrd', '| I:maj bVII:maj | IV:maj IV:maj |'),
    P('Hey Joe', 'the cycle of fourths into I', '| bVI:maj bIII:maj | bVII:maj IV:maj | I:maj | I:maj |'),
    P('Creep', 'Radiohead', '| I:maj | III:maj | IV:maj | iv:min |'),
    P('Aeolian rock', 'All Along the Watchtower', '| i:min | bVII:maj | bVI:maj | bVII:maj |', M),
    P('Epic minor (i–♭VI–♭VII)', 'the film-trailer loop', '| i:min | bVI:maj | bVII:maj | i:min |', M),
    P('Minor four chords', 'the axis heard from minor', '| i:min | bVI:maj | bIII:maj | bVII:maj |', M),
    P('Smells Like Teen Spirit', 'Nirvana', '| i:min iv:min | bIII:maj bVI:maj |', M),
    P('House of the Rising Sun', 'traditional', '| i:min | bIII:maj | IV:maj | bVI:maj | i:min | bIII:maj | V:maj | V:maj |', M),
    P('Hotel California', 'Eagles', '| i:min | V:maj | bVII:maj | IV:maj | bVI:maj | bIII:maj | iv:min | V:maj |', M),
    P('I Will Survive', 'the minor circle of fifths', '| i:min | iv:min | bVII:maj | bIII:maj7 | bVI:maj7 | ii:m7b5 | V:7 | i:min |', M),
    P('Blues-rock I–♭III–IV', 'the riff-rock move', '| I:maj | bIII:maj | IV:maj | I:maj |'),
    P('The Royal Road', 'IV–V–iii–vi (J-pop)', '| IV:maj7 | V:7 | iii:m7 | vi:m7 |'),
    P('Just the Two of Us', 'Grover Washington Jr.', '| IV:maj7 | III:7 | vi:m7 | v:m7 I:7 |'),
    P('Neo-soul IV–iii–ii–I', 'descending sevenths', '| IV:maj7 | iii:m7 | ii:m7 | I:maj7 |'),
  ] },
  { cat: 'Modal vamps', items: [
    P('Dorian (i–IV)', 'Evil Ways, Oye Como Va', '| i:m7 | IV:7 | i:m7 | IV:7 |', M),
    P('Mixolydian (I–♭VII)', 'the jam-band vamp', '| I:maj | bVII:maj | I:maj | bVII:maj |'),
    P('Lydian (I–II)', 'the floating sound', '| I:maj | II:maj | I:maj | II:maj |'),
    P('Phrygian (i–♭II)', 'flamenco and metal', '| i:min | bII:maj | i:min | bII:maj |', M),
    P('Aeolian (i–♭VI–♭III–♭VII)', 'the natural-minor loop', '| i:min | bVI:maj | bIII:maj | bVII:maj |', M),
    P('Locrian (iø–♭II)', 'the unstable one', '| i:m7b5 | bII:maj7 | i:m7b5 | bII:maj7 |', M),
    P('So What / Impressions', 'Dorian a half step up and back (condensed)', '| i:m7 | i:m7 | i:m7 | i:m7 | bii:m7 | bii:m7 | i:m7 | i:m7 |', M),
    P('Cantaloupe Island', 'Herbie Hancock (condensed)', '| i:m7 | i:m7 | bVI:7 | bVI:7 | vi:m7 | vi:m7 | i:m7 | i:m7 |', M),
  ] },
  { cat: 'Blues', items: [
    P('12-bar blues', 'the blues form', '| I:7 | I:7 | I:7 | I:7 | IV:7 | IV:7 | I:7 | I:7 | V:7 | IV:7 | I:7 | V:7 |'),
    P('Quick-change blues', 'IV in bar 2', '| I:7 | IV:7 | I:7 | I:7 | IV:7 | IV:7 | I:7 | I:7 | V:7 | IV:7 | I:7 | V:7 |'),
    P('8-bar blues', 'Key to the Highway', '| I:7 | V:7 | IV:7 | IV:7 | I:7 | V:7 | I:7 | V:7 |'),
    P('Jazz blues', 'Now’s the Time, Tenor Madness', '| I:7 | IV:7 | I:7 | v:m7 I:7 | IV:7 | #iv:dim7 | I:7 | VI:7 | ii:m7 | V:7 | I:7 VI:7 | ii:m7 V:7 |'),
    P('Bird blues', 'Blues for Alice (in F)', '| Fmaj7 | Em7b5 A7 | Dm7 G7 | Cm7 F7 | Bb7 | Bbm7 Eb7 | Am7 D7 | Abm7 Db7 | Gm7 | C7 | Fmaj7 D7 | Gm7 C7 |', K('F')),
    P('Minor blues', 'Mr. P.C., The Thrill Is Gone', '| i:m7 | i:m7 | i:m7 | i:m7 | iv:m7 | iv:m7 | i:m7 | i:m7 | bVI:7 | V:7 | i:m7 | V:7 |', M),
    P('Jazz blues with tritone subs', 'every V7 swapped', '| I:7 | IV:7 | I:7 | v:m7 bV:7 | IV:7 | #iv:dim7 | I:7 | iii:m7 bIII:7 | ii:m7 | bII:7 | I:7 bIII:7 | ii:m7 bII:7 |'),
  ] },
  { cat: 'Turnarounds and jazz moves', items: [
    P('I–vi–ii–V', 'the standard turnaround', '| I:maj7 vi:m7 | ii:m7 V:7 |'),
    P('iii–vi–ii–V–I', 'the long turnaround', '| iii:m7 vi:m7 | ii:m7 V:7 | I:maj7 | I:maj7 |'),
    P('I–VI7–ii–V7', 'a secondary dominant to ii', '| I:maj7 VI:7 | ii:m7 V:7 |'),
    P('Tritone-sub turnaround', 'I–VI7–ii–♭II7', '| I:maj7 VI:7 | ii:m7 bII:7 |'),
    P('All-dominant turnaround', 'I–♭III7–ii–♭II7', '| I:maj7 bIII:7 | ii:m7 bII:7 |'),
    P('Tadd Dameron turnaround', 'I–♭III7–♭VI7–♭II7', '| I:maj7 bIII:7 | bVI:7 bII:7 |'),
    P('Passing diminished', 'I–♯i°7–ii–V', '| I:maj7 #i:dim7 | ii:m7 V:7 |'),
    P('Minor turnaround', 'i–♭VI7–iiø–V7', '| i:m7 bVI:7 | ii:m7b5 V:7b9 |', M),
    P('Rhythm changes, A section', 'I Got Rhythm, Oleo, Anthropology', '| I:maj7 vi:m7 | ii:m7 V:7 | I:maj7 vi:m7 | ii:m7 V:7 | I:maj7 I:7 | IV:maj7 iv:m7 | I:maj7 V:7 | I:maj7 |'),
    P('Rhythm changes, bridge', 'III7–VI7–II7–V7', '| III:7 | III:7 | VI:7 | VI:7 | II:7 | II:7 | V:7 | V:7 |'),
    P('Ragtime progression', 'III7–VI7–II7–V7–I', '| III:7 | VI:7 | II:7 | V:7 | I:maj | I:maj |'),
    P('Montgomery-Ward bridge', 'I7–IV, II7–V', '| I:7 | I:7 | IV:maj | IV:maj | II:7 | II:7 | V:7 | V:7 |'),
    P('Gospel walk-up', 'IV–♯iv°7–I', '| I:maj | I:7 | IV:maj | #iv:dim7 | I:maj | VI:7 | ii:m7 | V:7 |'),
    P('ii–V into IV', 'v7–I7–IV', '| I:maj7 | v:m7 I:7 | IV:maj7 | iv:m7 bVII:7 | I:maj7 |'),
    P('ii–V into ii', 'iiiø–VI7–ii', '| I:maj7 | iii:m7b5 VI:7 | ii:m7 | V:7 | I:maj7 |'),
    P('Descending ii–Vs', 'down in whole steps', '| ii:m7 V:7 | I:maj7 | i:m7 IV:7 | bVII:maj7 | bvii:m7 bIII:7 | bVI:maj7 | ii:m7 V:7 | I:maj7 |'),
    P('Coltrane substitution', 'Countdown over a ii–V–I', '| ii:m7 bIII:7 | bVI:maj7 VII:7 | III:maj7 V:7 | I:maj7 |'),
    P('Major-third cycle', 'I–♭VI–III, three tonics', '| I:maj7 | bVI:maj7 | III:maj7 | I:maj7 |'),
  ] },
  { cat: 'Voice leading', vl: true, items: [
    P('Guide tones: ii–V–I', '3rds and 7ths fall by half step', '| ii:m7 | V:7 | I:maj7 | I:maj7 |'),
    P('Guide tones: minor ii–V–i', 'the ♭9 falls to the 5th', '| ii:m7b5 | V:7b9 | i:m7 | i:m7 |', M),
    P('Diatonic cycle in sevenths', 'one voice moves at a time', '| I:maj7 | IV:maj7 | vii:m7b5 | iii:m7 | vi:m7 | ii:m7 | V:7 | I:maj7 |'),
    P('Dominant cycle of fourths', 'each 3rd becomes the next 7th, through all 12', '| I:7 | IV:7 | bVII:7 | bIII:7 | bVI:7 | bII:7 | bV:7 | VII:7 | III:7 | VI:7 | II:7 | V:7 |'),
    P('Chain of secondary dominants', 'III7–VI7–II7–V7–I', '| III:7 | VI:7 | II:7 | V:7 | I:maj7 | I:maj7 |'),
    P('Chromatic dominants', 'every chord slides down a half step', '| III:7 | bIII:7 | II:7 | bII:7 | I:maj7 | I:maj7 |'),
    P('Descending m7 chain', 'iii7–♭iii7–ii7–♭II7–I', '| iii:m7 | biii:m7 | ii:m7 | bII:7 | I:maj7 | I:maj7 |'),
    P('Minor line cliché', 'one inner voice falls: 1–7–♭7–6', '| i:min | i:mMaj7 | i:m7 | i:m6 |', M),
    P('Major line cliché', 'the inner voice falls: 1–7–♭7, then IV', '| I:maj | I:maj7 | I:7 | IV:maj |'),
    P('Rising line cliché', 'the 5th climbs: 5–♯5–6–♭7', '| I:maj | I:aug | I:6 | I:7 |'),
    P('Minor plagal in sevenths', 'IVmaj7–iv6–Imaj7: the 6 sighs to ♭6, then 5', '| IV:maj7 | iv:m6 | I:maj7 | I:maj7 |'),
    P('Backdoor guide tones', 'IV–iv–♭VII7–I', '| IV:maj7 | iv:m7 | bVII:7 | I:maj7 |'),
    P('Rising diminished', 'I–♯I°7–ii–♯II°7–iii', '| I:maj7 | #i:dim7 | ii:m7 | #ii:dim7 | iii:m7 | VI:7 | ii:m7 | V:7 |'),
    P('Common-tone diminished', 'I°7 decorates I: the root stays, the rest step', '| I:maj7 | i:dim7 | I:maj7 | i:dim7 |'),
    P('ii–Vs down a half step', 'ii–V, then the same a half step lower, then home', '| ii:m7 V:7 | bii:m7 bV:7 | I:maj7 | I:maj7 |'),
    P('Pachelbel in sevenths', 'the bass falls, the upper voices barely move', '| I:maj7 | V:7 | vi:m7 | iii:m7 | IV:maj7 | I:maj7 | IV:maj7 | V:7 |'),
  ] },
  { cat: 'Bass lines and slash chords', bass: true, items: [
    P('Descending major bass', 'the bass walks down the scale (A Whiter Shade of Pale shape)', '| I:maj | V:maj/3 | vi:min | I:maj/5 | IV:maj | I:maj/3 | ii:min | V:maj |'),
    P('Ascending major bass', 'the bass climbs 1 to 8', '| I:maj | ii:min | I:maj/3 | IV:maj | V:maj | vi:min | V:maj/3 | I:maj |'),
    P('Lament bass', 'the descending minor tetrachord', '| i:min | v:min/b3 | iv:min/b3 | V:maj |', M),
    P('Chromatic minor descent', 'the bass falls by half steps under a minor chord', '| i:min | i:min/7 | i:min/b7 | IV:maj/3 | bVI:maj7 | V:7 |', M),
    P('Chromatic major descent', '1 7 ♭7 6 ♭6 5 ♯4 5 in the bass', '| I:maj | I:maj/7 | I:7/b7 | IV:maj/3 | iv:min/b3 | I:maj/5 | II:7/3 | V:7 |'),
    P('Gospel walk-up with inversions', 'bass 1 3 4 ♯4 5 6 2 5', '| I:maj | I:maj/3 | IV:maj | #iv:dim7 | I:maj/5 | VI:7 | ii:m7 | V:7 |'),
    P('Cadential six-four', 'I over its 5th before V', '| I:maj | IV:maj | I:maj/5 | V:7 | I:maj | I:maj |'),
    P('ii over its 3rd', 'the common-practice cadence', '| I:maj | ii:min/b3 | V:7 | I:maj |'),
    P('Tonic pedal', 'IV and V over a held tonic bass', '| I:maj | IV:maj/5 | V:maj/4 | I:maj |'),
    P('Dominant pedal', 'everything over the 5th in the bass', '| V:maj | I:maj/5 | IV:maj/2 | V:7 |'),
    P('Pop inversion loop', 'I–V/3–vi–IV: the bass steps 1 7 6 4', '| I:maj | V:maj/3 | vi:min | IV:maj |'),
    P('Canon with stepwise bass', '1 7 6 5 4 3 4 5', '| I:maj V:maj/3 | vi:min I:maj/5 | IV:maj I:maj/3 | IV:maj V:maj |'),
    P('Minor line cliché in the bass', '1 7 ♭7 6 under the minor tonic', '| i:min | i:min/7 | i:min/b7 | i:min/6 |', M),
    P('Rising diminished bass', 'I–♯I°7–ii–♯II°7–iii', '| I:maj7 | #i:dim7 | ii:m7 | #ii:dim7 | iii:m7 | VI:7 | ii:m7 | V:7 |'),
  ] },
  { cat: 'Classical patterns', items: [
    P('Diatonic circle of fifths', 'the Baroque sequence', '| I:maj | IV:maj | vii:dim | iii:min | vi:min | ii:min | V:maj | I:maj |'),
    P('Circle of fifths in sevenths', 'Autumn-Leaves-style', '| I:maj7 | IV:maj7 | vii:m7b5 | iii:m7 | vi:m7 | ii:m7 | V:7 | I:maj7 |'),
    P('Romanesca', 'the Greensleeves family', '| bIII:maj | bVII:maj | i:min | V:maj | bIII:maj | bVII:maj | i:min V:maj | i:min |', M),
    P('La Folia', 'Corelli, Op. 5 No. 12', '| i:min | V:maj | i:min | bVII:maj | bIII:maj | bVII:maj | i:min | V:maj |', M),
    P('The Monte', 'a rising sequence', '| I:7 | IV:maj | II:7 | V:maj |'),
    P('The Fonte', 'a falling sequence', '| VI:7 | ii:min | V:7 | I:maj |'),
    P('Pivot to the relative minor', 'viiø–III7–vi', '| I:maj | IV:maj | vii:m7b5 | III:7 | vi:min |'),
    P('Pivot to the dominant', 'vi becomes ii of V', '| I:maj | vi:min | II:7 | V:maj |'),
    P('Chromatic mediants', 'the film-score loop', '| I:maj | bVI:maj | I:maj | bIII:maj |'),
  ] },
  { cat: 'Jazz standards', items: [
    P('Autumn Leaves', 'Kosma (with the chromatic ii–Vs at the end)', '| Cm7 | F7 | Bbmaj7 | Ebmaj7 | Am7b5 | D7 | Gm6 | Gm6 | Cm7 | F7 | Bbmaj7 | Ebmaj7 | Am7b5 | D7 | Gm6 | Gm6 | Am7b5 | D7 | Gm6 | Gm6 | Cm7 | F7 | Bbmaj7 | Ebmaj7 | Am7b5 | D7 | Gm7 Gb7 | Fm7 E7 | Ebmaj7 | Am7b5 D7 | Gm6 | Gm6 |', K('G', M)),
    P('Blue Bossa', 'Kenny Dorham', '| Cm7 | Cm7 | Fm7 | Fm7 | Dm7b5 | G7 | Cm7 | Cm7 | Ebm7 | Ab7 | Dbmaj7 | Dbmaj7 | Dm7b5 | G7 | Cm7 | Dm7b5 G7 |', K('C', M)),
    P('All the Things You Are', 'Kern', '| Fm7 | Bbm7 | Eb7 | Abmaj7 | Dbmaj7 | G7 | Cmaj7 | Cmaj7 | Cm7 | Fm7 | Bb7 | Ebmaj7 | Abmaj7 | D7 | Gmaj7 | Gmaj7 | Am7 | D7 | Gmaj7 | Gmaj7 | F#m7 | B7 | Emaj7 | C7#5 | Fm7 | Bbm7 | Eb7 | Abmaj7 | Dbmaj7 | Dbm7 | Cm7 | Bdim7 | Bbm7 | Eb7 | Abmaj7 | Gm7b5 C7 |', K('Ab')),
    P('All of Me', 'Simons and Marks', '| C6 | C6 | E7 | E7 | A7 | A7 | Dm7 | Dm7 | E7 | E7 | Am7 | Am7 | D7 | D7 | Dm7 | G7 | C6 | C6 | E7 | E7 | A7 | A7 | Dm7 | Dm7 | Fmaj7 | Fm6 | C6 Em7 | A7 | Dm7 | G7 | C6 | Dm7 G7 |', K('C')),
    P('Fly Me to the Moon', 'Howard (first 16)', '| Am7 | Dm7 | G7 | Cmaj7 | Fmaj7 | Bm7b5 | E7 | Am7 A7 | Dm7 | G7 | Cmaj7 | Am7 | Dm7 | G7 | Cmaj7 | Bm7b5 E7 |', K('C')),
    P('Take the A Train', 'Strayhorn', '| C6 | C6 | D7#11 | D7#11 | Dm7 | G7 | C6 | Dm7 G7 | C6 | C6 | D7#11 | D7#11 | Dm7 | G7 | C6 | C6 | Fmaj7 | Fmaj7 | Fmaj7 | Fmaj7 | D7 | D7 | Dm7 | G7 | C6 | C6 | D7#11 | D7#11 | Dm7 | G7 | C6 | Dm7 G7 |', K('C')),
    P('Satin Doll', 'Ellington and Strayhorn', '| Dm7 G7 | Dm7 G7 | Em7 A7 | Em7 A7 | Am7 D7 | Abm7 Db7 | Cmaj7 | Cmaj7 | Gm7 C7 | Gm7 C7 | Fmaj7 | Fmaj7 | Am7 D7 | Am7 D7 | Dm7 | G7 |', K('C')),
    P('Stella by Starlight', 'Young', '| Em7b5 | A7 | Cm7 | F7 | Fm7 | Bb7 | Ebmaj7 | Ab7 | Bbmaj7 | Em7b5 A7 | Dm7 | Bbm7 Eb7 | Fmaj7 | Em7b5 A7 | Am7b5 | D7 | G7#5 | G7#5 | Cm7 | Cm7 | Ab7 | Ab7 | Bbmaj7 | Bbmaj7 | Em7b5 | A7 | Dm7b5 | G7 | Cm7b5 | F7 | Bbmaj7 | Bbmaj7 |', K('Bb')),
    P('There Will Never Be Another You', 'Warren (first 16)', '| Ebmaj7 | Ebmaj7 | Dm7b5 | G7 | Cm7 | Cm7 | Bbm7 | Eb7 | Abmaj7 | Db7 | Ebmaj7 | Cm7 | F7 | F7 | Fm7 | Bb7 |', K('Eb')),
    P('Misty', 'Erroll Garner (A section)', '| Ebmaj7 | Bbm7 Eb7 | Abmaj7 | Abm7 Db7 | Ebmaj7 Cm7 | Fm7 Bb7 | Gm7 C7 | Fm7 Bb7 |', K('Eb')),
    P('The Girl from Ipanema', 'Jobim (A section)', '| Fmaj7 | Fmaj7 | G7 | G7 | Gm7 | Gb7 | Fmaj7 | Gb7 |', K('F')),
    P('Lady Bird', 'Tadd Dameron', '| Cmaj7 | Cmaj7 | Fm7 | Bb7 | Cmaj7 | Cmaj7 | Bbm7 | Eb7 | Abmaj7 | Abmaj7 | Am7 | D7 | Dm7 | G7 | Cmaj7 Eb7 | Abmaj7 Db7 |', K('C')),
    P('Solar', 'Miles Davis', '| CmMaj7 | CmMaj7 | Gm7 | C7 | Fmaj7 | Fmaj7 | Fm7 | Bb7 | Ebmaj7 | Ebm7 Ab7 | Dbmaj7 | Dm7b5 G7 |', K('C', M)),
    P('Tune Up', 'Miles Davis (the falling ii–V–Is)', '| Em7 | A7 | Dmaj7 | Dmaj7 | Dm7 | G7 | Cmaj7 | Cmaj7 | Cm7 | F7 | Bbmaj7 | Bbmaj7 |', K('D')),
    P('Giant Steps', 'John Coltrane', '| Bmaj7 D7 | Gmaj7 Bb7 | Ebmaj7 | Am7 D7 | Gmaj7 Bb7 | Ebmaj7 F#7 | Bmaj7 | Fm7 Bb7 | Ebmaj7 | Am7 D7 | Gmaj7 | C#m7 F#7 | Bmaj7 | Fm7 Bb7 | Ebmaj7 | C#m7 F#7 |', K('B')),
    P('Rhythm changes', 'I Got Rhythm (AABA, simplified)', '| Bbmaj7 Gm7 | Cm7 F7 | Bbmaj7 Gm7 | Cm7 F7 | Bbmaj7 Bb7 | Ebmaj7 Ebm7 | Bbmaj7 F7 | Bbmaj7 | Bbmaj7 Gm7 | Cm7 F7 | Bbmaj7 Gm7 | Cm7 F7 | Bbmaj7 Bb7 | Ebmaj7 Ebm7 | Bbmaj7 F7 | Bbmaj7 | D7 | D7 | G7 | G7 | C7 | C7 | F7 | F7 | Bbmaj7 Gm7 | Cm7 F7 | Bbmaj7 Gm7 | Cm7 F7 | Bbmaj7 Bb7 | Ebmaj7 Ebm7 | Bbmaj7 F7 | Bbmaj7 |', K('Bb')),
    P('Sweet Georgia Brown', 'the ragtime chain (A section, condensed)', '| D7 | D7 | G7 | G7 | C7 | C7 | F6 | F6 |', K('F')),
  ] },
];

// ---------- chord symbols ----------
const SUFFIX = {
  '': 'maj', m: 'min', '-': 'min', m7: 'm7', '-7': 'm7', maj7: 'maj7', M7: 'maj7', '7': '7', m7b5: 'm7b5', 'ø': 'm7b5', 'ø7': 'm7b5',
  dim7: 'dim7', o7: 'dim7', dim: 'dim', o: 'dim', '6': '6', m6: 'm6', '9': '9', m9: 'm9', maj9: 'maj9', '13': '13',
  '7b9': '7b9', '7#9': '7#9', '7#11': '7#11', '7alt': '7alt', '7#5': '7#5', '+7': '7#5', aug: 'aug', '+': 'aug',
  sus4: 'sus4', sus: 'sus4', '7sus4': '7sus4', '7sus': '7sus4', mMaj7: 'mMaj7', mM7: 'mMaj7', '6/9': '6/9', '69': '6/9',
  m11: 'm11', '11': '11', add9: 'add9', '7b13': '7b13', '13b9': '13b9', 'maj7#11': 'maj7#11', '9sus4': '9sus4', 'm7#5': 'm7#5',
};
export function parseSymbol(sym) {
  const m = /^([A-G](?:b|#)?)(.*)$/.exec(sym.trim());
  if (!m || !(m[2] in SUFFIX)) throw new Error(`Unknown chord symbol "${sym}"`);
  return { root: T.parseNote(m[1]), q: SUFFIX[m[2]] };
}

// a chart as bars of chords { iv, q, rel? } (rel keeps a secondary numeral like V/ii from the chart)
export function resolve(item) {
  const bars = item.chart.split('|').map((b) => b.trim()).filter(Boolean);
  const tonic = item.key ? T.parseNote(item.key) : T.parseNote('C');
  return bars.map((bar) => bar.split(/\s+/).filter(Boolean).map((tok) => {
    if (item.key) {
      const { root, q } = parseSymbol(tok);
      return { iv: ivFrom(tonic, root), q };
    }
    const c = T.parseChordToken(tok, tonic);
    const iv = ivFrom(tonic, c.root);
    const head = c.roman || '';
    const bass = c.bassIv ? { bass: c.bassIv } : {}; // a slash chord: the bass as an interval above the chord's root
    if (!head.includes('/')) return { iv, q: c.quality, ...bass };
    const [fn, ...to] = head.split('/');
    return { iv, q: c.quality, rel: { fn, to: to.join('/') }, ...bass };
  }));
}

// the borrowed-chord drills, each progression under its chord (ids are explicit: the numerals don't slug)
LIBRARY.push({ cat: 'Borrowed chords', items: BORROWED.flatMap((b) => b.progs.map((p, i) => ({ name: `${b.rn}: ${p.name}`, by: b.name.toLowerCase(), chart: p.chart, minor: !!p.minor, id: `borrow-${b.id}-${i}`, borrow: b.id }))) });
LIBRARY.push({ cat: 'Chromatic chords', items: CHROMATIC.flatMap((b) => b.progs.map((p, i) => ({ name: `${b.name}: ${p.name}`, by: b.from, chart: p.chart, minor: !!p.minor, id: `chrom-${b.id}-${i}`, borrow: b.id }))) });

const slug = (s) => s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
export const ALL = LIBRARY.flatMap((g) => g.items.map((it) => ({ ...it, cat: g.cat, vl: !!g.vl, bassLine: !!g.bass, id: it.id || slug(it.name) })));
export const byId = (id) => ALL.find((p) => p.id === id) || ALL[0];
