// The progression game: levels from I→IV to any progression at all, with real songs' changes on the way up.
// A chord is a token in the chart language of the engine (SCHEMA §4.4): 'vi:min', 'V:7', 'bVII:maj', 'V:7/3'
// (a bass interval after the slash: V7 with its 3rd in the bass). Romans are read against the major scale of the tonic.
import * as T from '../theory.js';
import * as F from '../fretboard.js';
import * as S from './sound.js';

const t = (s) => s.trim().split(/\s+/);
// pass: N perfect rounds out of the last M; `streak` levels need N perfect in a row
export const PASS = { need: 8, of: 10 };

export const TIERS = [
  { id: 'triads', title: 'Major-key triads', levels: [
    { id: 'p1', title: 'Home and away', tip: 'Every round starts on I. IV opens and lifts (the bass rises a 4th); V leans, wanting to come home.', start: 'I:maj', len: 2, vocab: t('I:maj IV:maj V:maj'), },
    { id: 'p2', title: 'Three chords', tip: 'Follow the bass: up a 4th to IV, up a 5th (or down a 4th) to V.', start: 'I:maj', len: 3, vocab: t('I:maj IV:maj V:maj'), },
    { id: 'p3', title: 'The relative minor', tip: 'vi shares two notes with I but turns the colour sad. The bass falls a minor 3rd from I.', start: 'I:maj', len: 4, vocab: t('I:maj IV:maj V:maj vi:min'), },
    { id: 'p4', title: 'Add ii', tip: 'ii is minor and a step above home. It usually leads to V.', start: 'I:maj', len: 4, vocab: t('I:maj ii:min IV:maj V:maj vi:min'), },
    { id: 'p5', title: 'Every diatonic triad', tip: 'iii is the rarest: minor, a 3rd above home, close to both I and V. vii° is tense and thin.', start: 'I:maj', len: 4, vocab: t('I:maj ii:min iii:min IV:maj V:maj vi:min vii:dim'), weights: { 'vii:dim': 0.3 }, },
    { id: 'c1', title: 'The pop canon', tip: 'Three-chord rock, the axis and its rotations, doo-wop, plagal and half cadences. Named after you answer.', real: 'pop' },
  ] },
  { id: 'minor', title: 'Minor keys and modes', levels: [
    { id: 'p6', title: 'Minor key', tip: 'Home is i. Natural minor gives v, ♭III, ♭VI and ♭VII; the major V borrows its leading note from harmonic minor.', start: 'i:min', minor: true, len: 4, vocab: t('i:min iv:min v:min V:maj bIII:maj bVI:maj bVII:maj'), },
    { id: 'c2', title: 'Minor and modal canon', tip: 'Pachelbel, the circle of fifths, the Andalusian cadence, Aeolian and Mixolydian rock, Dorian, Phrygian and Lydian vamps.', real: 'modal' },
  ] },
  { id: 'sevenths', title: 'Sevenths and the blues', levels: [
    { id: 'p7', title: 'Diatonic sevenths', tip: 'The same functions, richer. Imaj7 and IVmaj7 are soft; V7 has the bite of a tritone; ii7, iii7, vi7 are minor 7ths.', start: 'I:maj7', len: 4, vocab: t('I:maj7 ii:m7 iii:m7 IV:maj7 V:7 vi:m7'), },
    { id: 'p8', title: 'ii–V–I, major and minor', tip: 'Minor ii–V: a half-diminished ii and a dark V7 (♭9) landing on i. Listen for the arrival: maj7 or minor.', len: 3, pool: [
      'ii:m7 V:7 I:maj7', 'ii:m7b5 V:7b9 i:m7', 'ii:m7 V:7 vi:m7', 'ii:m7b5 V:7b9 I:maj7', 'ii:m7 V:7 i:m7', 'IV:maj7 V:7 I:maj7', 'vi:m7 ii:m7 V:7', 'ii:m7b5 V:7b9 vi:m7'],
      vocab: t('I:maj7 i:m7 ii:m7 ii:m7b5 IV:maj7 V:7 V:7b9 vi:m7'), tempo: 88, cadence: true },
    { id: 'c3', title: 'Blues and jazz basics', tip: 'ii–V–I major and minor, the turnarounds, the Royal Road, 12-bar and 8-bar blues. Every chord of a blues is a dominant 7th.', real: 'blues' },
  ] },
  { id: 'inversions', title: 'Inversions and bass lines', levels: [
    { id: 'p12', title: 'First inversions', tip: '/3 means the chord’s 3rd is in the bass. Listen to the bass line: I/3 and V/3 make steps instead of leaps (I – V/3 – vi).', start: 'I:maj', len: 4, vocab: t('I:maj I:maj/3 ii:min IV:maj V:maj V:maj/3 vi:min'), inversions: true },
    { id: 'p13', title: 'Walking bass lines', tip: '/5: the 5th in the bass (I/5 before V is the cadential six-four). /7: a seventh chord’s 7th in the bass, falling to the next chord’s 3rd.', start: 'I:maj', len: 5, vocab: t('I:maj I:maj/3 I:maj/5 ii:min IV:maj IV:maj/5 V:maj V:maj/3 V:7/b7 vi:min'), inversions: true },
    { id: 'c4', title: 'Cadences and bass lines', tip: 'The cadential six-four, ii/3, deceptive and Phrygian cadences, the Picardy third, descending bass laments, the Prinner, Romanesca and Folia. Follow the bass.', real: 'cadences' },
  ] },
  { id: 'chromatic', title: 'Chromatic harmony', levels: [
    { id: 'p9', title: 'Secondary dominants', tip: 'A major (dominant) chord where you expect a minor one: VI7 instead of vi7, II7 instead of ii7. It pulls a 5th down to the next chord.', start: 'I:maj7', len: 4, vocab: t('I:maj7 ii:m7 IV:maj7 V:7 vi:m7 I:7 II:7 III:7 VI:7'), },
    { id: 'p10', title: 'Borrowed chords', tip: 'One chord suddenly goes dark while home stays major: iv, ♭VI, ♭VII, ♭III borrowed from the parallel minor.', start: 'I:maj', len: 4, vocab: t('I:maj ii:min IV:maj V:maj vi:min iv:min bVI:maj bVII:maj bIII:maj'), },
    { id: 'p11', title: 'Jazz substitutions', tip: 'Tritone sub: ♭II7 slides down to I. Backdoor: iv7–♭VII7–I. Passing ♯i°7 climbs from I to ii.', start: 'I:maj7', len: 4, vocab: t('I:maj7 ii:m7 V:7 vi:m7 bII:7 iv:m7 bVII:7 #i:dim7 bIII:7 bVI:7'), tempo: 90 },
    { id: 'c5', title: 'The colour canon', tip: 'Secondary dominants, borrowed chords, line clichés, ragtime and gospel turnarounds, the Monte and Fonte, pivots to new keys.', real: 'colour' },
  ] },
  { id: 'standards', title: 'Standards and modulation', levels: [
    { id: 'c6', title: 'Jazz standards and modulation', tip: 'Tritone subs, backdoor, rhythm changes, the jazz blues, standards’ opening changes, the Neapolitan and augmented sixth, key changes.', real: 'standards' },
  ] },
  { id: 'mastery', title: 'Mastery', levels: [
    { id: 'c7', title: 'Hard standards', tip: 'Stella, Solar, Lady Bird, Countdown and Giant Steps: three tonics a major third apart, chains of ii–Vs, inversions in a walking line.', real: 'masters' },
    { id: 'x1', title: 'Any chord, root position', tip: 'Any root, any of seven chord types. A cadence sets the key first. Pick the root, then the type.', len: 4, any: { qualities: t('maj min 7 maj7 m7 m7b5 dim7') }, tempo: 84, cadence: true },
    { id: 'x2', title: 'The gauntlet', tip: 'Anything at all: any root, nine chord types, any inversion. Ten perfect rounds in a row beats the game.', len: 4, any: { qualities: t('maj min aug sus4 7 maj7 m7 m7b5 dim7'), inversions: true }, tempo: 84, cadence: true, streak: 10 },
  ] },
];
export const LEVELS = TIERS.flatMap((tier) => tier.levels.map((l) => ({ ...l, tier: tier.id, tierTitle: tier.title })));

// the canon: named progressions, one set per level (chord progressions aren't copyrightable; nothing here is a
// recording or a melody, and a song is named only where it's well known for the changes). Romans against the major
// scale of the tonic; `minor` means the tonic is minor.
const S_ = (song, by, chart, o = {}) => ({ song, by, chart, ...o });
const M = { minor: true };
export const SONGS = {
  pop: [
    S_('Three-chord rock', 'Twist and Shout, La Bamba', '| I:maj | IV:maj | V:maj | I:maj |'),
    S_('I–IV–V–IV', 'Wild Thing', '| I:maj | IV:maj | V:maj | IV:maj |'),
    S_('Plagal vamp', 'the “amen”', '| I:maj | IV:maj | I:maj | IV:maj |'),
    S_('Authentic cadence', 'the classical cadence formula', '| I:maj | IV:maj | V:7 | I:maj |'),
    S_('Half cadence', 'a phrase that stops on V', '| I:maj | IV:maj | I:maj | V:maj |'),
    S_('The axis', 'Let It Be, With or Without You, Don’t Stop Believin’', '| I:maj | V:maj | vi:min | IV:maj |'),
    S_('The axis from vi', 'Zombie, Save Tonight', '| vi:min | IV:maj | I:maj | V:maj |'),
    S_('The axis from IV', 'a rotation of the four chords', '| IV:maj | I:maj | V:maj | vi:min |'),
    S_('Doo-wop (the 50s progression)', 'Stand by Me', '| I:maj | vi:min | IV:maj | V:maj |'),
    S_('Pop deceptive', 'V turning to vi', '| I:maj | IV:maj | V:maj | vi:min |'),
    S_('Knockin’ on Heaven’s Door', 'Bob Dylan', '| I:maj | V:maj | ii:min | ii:min | I:maj | V:maj | IV:maj | IV:maj |'),
  ],
  modal: [
    S_('Pachelbel’s Canon', 'Pachelbel', '| I:maj V:maj | vi:min iii:min | IV:maj I:maj | IV:maj V:maj |'),
    S_('Diatonic circle of fifths', 'the Baroque sequence', '| I:maj | IV:maj | vii:dim | iii:min | vi:min | ii:min | V:maj | I:maj |'),
    S_('I–vi–ii–V', 'Blue Moon', '| I:maj | vi:min | ii:min | V:maj |'),
    S_('I–IV–ii–V', 'a pre-dominant pair', '| I:maj | IV:maj | ii:min | V:maj |'),
    S_('Andalusian cadence', 'Hit the Road Jack, Runaway', '| i:min | bVII:maj | bVI:maj | V:maj |', M),
    S_('Aeolian rock', 'All Along the Watchtower', '| i:min | bVII:maj | bVI:maj | bVII:maj |', M),
    S_('Aeolian i–♭VI–♭VII', 'the epic minor loop', '| i:min | bVI:maj | bVII:maj | i:min |', M),
    S_('Minor four chords', 'the axis heard from minor', '| i:min | bVI:maj | bIII:maj | bVII:maj |', M),
    S_('Harmonic-minor cadence', 'i–iv–V–i', '| i:min | iv:min | V:maj | i:min |', M),
    S_('Natural-minor cadence', 'i–iv–v–i', '| i:min | iv:min | v:min | i:min |', M),
    S_('Mixolydian rock', 'Sweet Child o’ Mine, Sympathy for the Devil, Gloria', '| I:maj | bVII:maj | IV:maj | I:maj |'),
    S_('Sweet Home Alabama', 'Lynyrd Skynyrd', '| I:maj bVII:maj | IV:maj IV:maj |'),
    S_('Hey Joe', 'Jimi Hendrix', '| bVI:maj bIII:maj | bVII:maj IV:maj | I:maj | I:maj |'),
    S_('Dorian vamp', 'Evil Ways', '| i:min | IV:maj | i:min | IV:maj |', M),
    S_('Phrygian vamp', 'flamenco and metal', '| i:min | bII:maj | i:min | bII:maj |', M),
    S_('Lydian vamp', 'I–II', '| I:maj | II:maj | I:maj | II:maj |'),
    S_('House of the Rising Sun', 'traditional', '| i:min | bIII:maj | IV:maj | bVI:maj | i:min | bIII:maj | V:maj | V:maj |', M),
    S_('Smells Like Teen Spirit', 'Nirvana', '| i:min iv:min | bIII:maj bVI:maj |', M),
  ],
  blues: [
    S_('Major ii–V–I', 'the jazz staple', '| ii:m7 | V:7 | I:maj7 | I:maj7 |'),
    S_('Minor ii–V–i', 'the jazz staple, minor', '| ii:m7b5 | V:7b9 | i:m6 | i:m6 |', M),
    S_('I–vi–ii–V', 'the standard turnaround', '| I:maj7 vi:m7 | ii:m7 V:7 |'),
    S_('iii–vi–ii–V–I', 'the long turnaround', '| iii:m7 vi:m7 | ii:m7 V:7 | I:maj7 |'),
    S_('The Royal Road', 'the J-pop staple', '| IV:maj7 | V:7 | iii:m7 | vi:m7 |'),
    S_('Dorian vamp in sevenths', 'Oye Como Va', '| i:m7 | IV:7 | i:m7 | IV:7 |', M),
    S_('12-bar blues', 'the blues form', '| I:7 | I:7 | I:7 | I:7 | IV:7 | IV:7 | I:7 | I:7 | V:7 | IV:7 | I:7 | V:7 |'),
    S_('Quick-change blues', 'the blues form', '| I:7 | IV:7 | I:7 | I:7 | IV:7 | IV:7 | I:7 | I:7 | V:7 | IV:7 | I:7 | V:7 |'),
    S_('8-bar blues', 'Key to the Highway', '| I:7 | V:7 | IV:7 | IV:7 | I:7 | V:7 | I:7 | V:7 |'),
    S_('My Girl', 'The Temptations', '| I:maj ii:m7 | I:maj ii:m7 |'),
  ],
  cadences: [
    S_('ii/3 cadence', 'the common-practice cadence', '| I:maj | ii:min/b3 | V:7 | I:maj |'),
    S_('Cadential six-four', 'the classical cadence', '| I:maj | IV:maj | I:maj/5 | V:7 | I:maj |'),
    S_('Deceptive cadence', 'V7 to vi', '| I:maj | ii:min/b3 | V:7 | vi:min |'),
    S_('Deceptive cadence in minor', 'V7 to ♭VI', '| i:min | iv:min | V:7 | bVI:maj |', M),
    S_('Picardy third', 'Bach chorale endings', '| i:min | iv:min | V:7 | I:maj |', M),
    S_('Phrygian half cadence', 'Baroque slow movements', '| i:min | iv:min/b3 | V:maj |', M),
    S_('Pop with V/3', 'Someone Like You', '| I:maj | V:maj/3 | vi:min | IV:maj |'),
    S_('Descending bass', 'in the spirit of A Whiter Shade of Pale', '| I:maj | V:maj/3 | vi:min | I:maj/5 | IV:maj | I:maj/3 | ii:min | V:maj |'),
    S_('Lament bass', 'the descending minor tetrachord', '| i:min | v:min/b3 | iv:min/b3 | V:maj |', M),
    S_('The Prinner', 'a galant schema', '| IV:maj | I:maj/3 | vii:dim/b3 | I:maj |'),
    S_('Romanesca', 'the Greensleeves family', '| bIII:maj | bVII:maj | i:min | V:maj | bIII:maj | bVII:maj | i:min V:maj | i:min |', M),
    S_('La Folia', 'Corelli, Op. 5 No. 12', '| i:min | V:maj | i:min | bVII:maj | bIII:maj | bVII:maj | i:min | V:maj |', M),
  ],
  colour: [
    S_('I–VI7–ii–V', 'a secondary dominant to ii', '| I:maj | VI:7 | ii:min | V:7 |'),
    S_('V7 of vi', 'I–III7–vi–IV', '| I:maj | III:7 | vi:min | IV:maj |'),
    S_('Take the A Train', 'Strayhorn (A section)', '| I:6 | I:6 | II:7 | II:7 | ii:m7 | V:7 | I:6 | ii:m7 V:7 |'),
    S_('I–I7–IV', 'tonicising IV', '| I:maj | I:7 | IV:maj | I:maj |'),
    S_('In My Life (verse)', 'The Beatles', '| I:maj | V:maj | vi:min | I:7 | IV:maj | iv:min | I:maj |'),
    S_('Creep', 'Radiohead', '| I:maj | III:maj | IV:maj | iv:min |'),
    S_('The Mario cadence', '♭VI–♭VII–I', '| I:maj | bVI:maj | bVII:maj | I:maj |'),
    S_('Minor plagal', 'IV–iv–I', '| I:maj | IV:maj | iv:min | I:maj |'),
    S_('Backdoor in triads', 'IV–♭VII–I', '| I:maj | IV:maj | bVII:maj | I:maj |'),
    S_('Hotel California', 'Eagles', '| i:min | V:maj | bVII:maj | IV:maj | bVI:maj | bIII:maj | iv:min | V:maj |', M),
    S_('Minor line cliché', 'My Funny Valentine; the Stairway to Heaven intro', '| i:min | i:mMaj7 | i:m7 | i:m6 |', M),
    S_('Major line cliché', 'Something', '| I:maj | I:maj7 | I:7 | IV:maj |'),
    S_('Rising line cliché', '5–♯5–6–♭7 over I', '| I:maj | I:aug | I:6 | I:7 |'),
    S_('Ragtime', 'Sweet Georgia Brown', '| III:7 | VI:7 | II:7 | V:7 | I:maj |'),
    S_('Montgomery-Ward bridge', 'I7–IV, II7–V', '| I:7 | I:7 | IV:maj | IV:maj | II:7 | II:7 | V:7 | V:7 |'),
    S_('Gospel walk-up', 'IV–♯iv°7–I/5', '| I:maj | I:7 | IV:maj | #iv:dim7 | I:maj/5 | VI:7 | ii:m7 | V:7 |'),
    S_('Minor blues', 'Mr. P.C., The Thrill Is Gone', '| i:m7 | i:m7 | i:m7 | i:m7 | iv:m7 | iv:m7 | i:m7 | i:m7 | bVI:7 | V:7 | i:m7 | V:7 |', M),
    S_('Minor circle of fifths', 'I Will Survive', '| i:min | iv:min | bVII:maj | bIII:maj7 | bVI:maj7 | ii:m7b5 | V:7 | i:min |', M),
    S_('Fly Me to the Moon', 'the major circle from vi', '| vi:m7 | ii:m7 | V:7 | I:maj7 | IV:maj7 | vii:m7b5 | III:7 | vi:m7 |'),
    S_('All of Me', 'Simons and Marks (first 8)', '| I:maj7 | I:maj7 | III:7 | III:7 | VI:7 | VI:7 | ii:m7 | ii:m7 |'),
    S_('Pivot to the relative minor', 'viiø–III7–vi', '| I:maj | IV:maj | vii:m7b5 | III:7 | vi:min |'),
    S_('Pivot to the dominant', 'vi becomes ii of V', '| I:maj | vi:min | II:7 | V:maj |'),
    S_('The Monte', 'a rising sequence', '| I:7 | IV:maj | II:7 | V:maj |'),
    S_('The Fonte', 'a falling sequence', '| VI:7 | ii:min | V:7 | I:maj |'),
  ],
  standards: [
    S_('Tritone substitution', 'ii–♭II7–I', '| ii:m7 | bII:7 | I:maj7 | I:maj7 |'),
    S_('Tritone-sub turnaround', 'I–VI7–ii–♭II7', '| I:maj7 VI:7 | ii:m7 bII:7 |'),
    S_('All-dominant turnaround', 'I–♭III7–ii–♭II7', '| I:maj7 bIII:7 | ii:m7 bII:7 |'),
    S_('Backdoor ii–V', 'iv7–♭VII7–I (Lady Bird)', '| iv:m7 | bVII:7 | I:maj7 | I:maj7 |'),
    S_('Passing diminished', 'I–♯i°7–ii–V', '| I:maj7 #i:dim7 | ii:m7 V:7 |'),
    S_('Jazz blues', 'Now’s the Time (simplified)', '| I:7 | IV:7 | I:7 | v:m7 I:7 | IV:7 | #iv:dim7 | I:7 | VI:7 | ii:m7 | V:7 | I:7 VI:7 | ii:m7 V:7 |'),
    S_('Rhythm changes, A section', 'I Got Rhythm, Oleo, Anthropology', '| I:maj7 vi:m7 | ii:m7 V:7 | I:maj7 vi:m7 | ii:m7 V:7 | I:maj7 I:7 | IV:maj7 iv:m7 | I:maj7 V:7 | I:maj7 |'),
    S_('Rhythm changes, bridge', 'III7–VI7–II7–V7', '| III:7 | III:7 | VI:7 | VI:7 | II:7 | II:7 | V:7 | V:7 |'),
    S_('Satin Doll', 'Ellington and Strayhorn (A section)', '| ii:m7 V:7 | ii:m7 V:7 | iii:m7 VI:7 | iii:m7 VI:7 | vi:m7 II:7 | bvi:m7 bII:7 | I:maj7 |'),
    S_('ii–V into IV', 'v7–I7–IV', '| I:maj7 | v:m7 I:7 | IV:maj7 | iv:m7 bVII:7 | I:maj7 |'),
    S_('ii–V into ii', 'iiiø–VI7–ii', '| I:maj7 | iii:m7b5 VI:7 | ii:m7 | V:7 | I:maj7 |'),
    S_('Autumn Leaves', 'Kosma (A section, from the minor tonic)', '| iv:m7 | bVII:7 | bIII:maj7 | bVI:maj7 | ii:m7b5 | V:7b9 | i:m6 | i:m6 |', M),
    S_('Blue Bossa', 'Kenny Dorham', '| i:m7 | i:m7 | iv:m7 | iv:m7 | ii:m7b5 | V:7b9 | i:m7 | i:m7 | biii:m7 | bVI:7 | bII:maj7 | bII:maj7 | ii:m7b5 | V:7b9 | i:m7 | ii:m7b5 V:7b9 |', M),
    S_('There Will Never Be Another You', 'Warren (first 8)', '| I:maj7 | I:maj7 | vii:m7b5 | III:7 | vi:m7 | vi:m7 | v:m7 | I:7 |'),
    S_('All the Things You Are', 'Kern (first 8)', '| vi:m7 | ii:m7 | V:7 | I:maj7 | IV:maj7 | #iv:m7 VII:7 | III:maj7 | III:maj7 |'),
    S_('Just the Two of Us', 'Grover Washington Jr.', '| IV:maj7 | III:7 | vi:m7 | v:m7 I:7 |'),
    S_('The Girl from Ipanema', 'Jobim (A section)', '| I:maj7 | I:maj7 | II:7 | II:7 | ii:m7 | bII:7 | I:maj7 | bII:7 |'),
    S_('Misty', 'Erroll Garner', '| I:maj7 | v:m7 I:7 | IV:maj7 | iv:m7 bVII:7 | I:maj7 vi:m7 | ii:m7 V:7 |'),
    S_('Neapolitan sixth', 'the Moonlight Sonata opening', '| i:min | bII:maj/3 | i:min/5 | V:7 | i:min |', M),
    S_('Augmented sixth', 'sounds as ♭VI7, falls to V', '| i:min | bVI:7 | i:min/5 | V:7 | i:min |', M),
    S_('Truck-driver key change', 'Man in the Mirror: up a half step', '| I:maj | V:maj | vi:min | IV:maj | bVI:7 | bII:maj | bVI:maj | bvii:min | bV:maj |', { modulate: { at: 5, shift: 1 } }),
    S_('Half-step modal shift', 'So What, Impressions', '| i:m7 | i:m7 | bii:m7 | bii:m7 | i:m7 |', M),
    S_('Chromatic mediants', 'the film-score loop', '| I:maj | bVI:maj | I:maj | bIII:maj |'),
  ],
  masters: [
    S_('Stella by Starlight', 'Young (opening)', '| #iv:m7b5 | VII:7 | ii:m7 | V:7 | v:m7 | I:7 | IV:maj7 | bVII:7 | I:maj7 |'),
    S_('Solar', 'Miles Davis', '| i:mMaj7 | i:mMaj7 | v:m7 | I:7 | IV:maj7 | IV:maj7 | iv:m7 | bVII:7 | bIII:maj7 | biii:m7 bVI:7 | bII:maj7 | ii:m7b5 V:7b9 |', M),
    S_('Lady Bird turnaround', 'Tadd Dameron', '| I:maj7 bIII:7 | bVI:maj7 bII:7 | I:maj7 |'),
    S_('Countdown', 'Coltrane changes over a ii–V–I', '| ii:m7 bIII:7 | bVI:maj7 VII:7 | III:maj7 V:7 | I:maj7 |'),
    S_('Giant Steps', 'John Coltrane (bars 1–8)', '| I:maj7 bIII:7 | bVI:maj7 VII:7 | III:maj7 | bvii:m7 bIII:7 | bVI:maj7 VII:7 | III:maj7 V:7 | I:maj7 | #iv:m7 VII:7 |'),
    S_('Major-third cycle', 'I–♭VI–III', '| I:maj7 | bVI:maj7 | III:maj7 | I:maj7 |'),
    S_('A walking line in inversions', 'I/3–iv7–♭VII7–I/5–VI7♭9–ii7–V7/7', '| I:maj7/3 | iv:m7 bVII:7 | I:maj7/5 VI:7b9 | ii:m7 V:7/b7 | I:maj7/3 |'),
  ],
};

// ---------- chords ----------
const DEG = ['I', 'bII', 'II', 'bIII', 'III', 'IV', '#IV', 'V', 'bVI', 'VI', 'bVII', 'VII'];
const PRETTY_DEG = ['I', '♭II', 'II', '♭III', 'III', 'IV', '♯IV', 'V', '♭VI', 'VI', '♭VII', 'VII'];
export const DEGREES = PRETTY_DEG;
const MINORISH = new Set(['min', 'm7', 'm7b5', 'dim', 'dim7', 'mMaj7', 'm6', 'm9']);
const SUFFIX = { maj: '', min: '', dim: '°', aug: '+', sus4: 'sus4', sus2: 'sus2', '7': '7', maj7: 'maj7', m7: '7', m7b5: 'ø7', dim7: '°7', mMaj7: '(maj7)', '7b9': '7♭9', '6': '6', m6: '6', '9': '9' };
export const QUALITY_NAMES = { maj: 'major', min: 'minor', dim: 'diminished', aug: 'augmented', sus4: 'sus4', '7': 'dominant 7', maj7: 'major 7', m7: 'minor 7', m7b5: 'half-diminished', dim7: 'diminished 7', '7b9': '7♭9' };
export const QUALITY_BUTTONS = { maj: 'maj', min: 'm', dim: '°', aug: '+', sus4: 'sus4', '6': '6', m6: 'm6', '7': '7', maj7: 'maj7', m7: 'm7', mMaj7: 'm(maj7)', m7b5: 'ø7', dim7: '°7', '7b9': '7♭9' };
const SIMPLE_BASS = (iv) => (iv ? { b3: '3', 3: '3', b5: '5', 5: '5', '#5': '5', b7: '7', 7: '7', bb7: '7', 4: '4', 2: '2' }[iv] || iv : '1');

// a chord from a token, in a key: the engine's {root, quality, bass} plus deg (semitones above the tonic), inv (the
// chord tone in the bass: '1' | '3' | '5' | '7'), pcs (its notes above the tonic) and bassRel (its bass above the tonic)
export function chordOf(token, tonic) {
  const c = T.parseChordToken(token, tonic);
  const tonicPc = T.notePc(tonic);
  const deg = ((T.notePc(c.root) - tonicPc) % 12 + 12) % 12;
  const ivs = T.getChord(c.quality).ivs;
  return { ...c, deg, inv: SIMPLE_BASS(c.bassIv), token, pcs: ivs.map((iv) => (deg + T.intervalSemis(F.simpleIv(iv))) % 12), bassRel: c.bass ? ((T.notePc(c.bass) - tonicPc) % 12 + 12) % 12 : deg };
}
// the token for a chord built in the answer pad
export function tokenOf(deg, quality, bass = '1') {
  const minorish = MINORISH.has(quality);
  let r = DEG[deg];
  if (minorish) r = r.toLowerCase();
  if (bass && bass !== '1') {
    const iv = T.getChord(quality).ivs.find((x) => SIMPLE_BASS(x) === bass) || bass;
    return `${r}:${quality}/${iv}`;
  }
  return `${r}:${quality}`;
}
// how a chord is written in the game: vi7, ♭VII, V7/3, iiø7
export function label(token) {
  const [head, rest = 'maj'] = token.split(':');
  const [q, bassIv] = rest.split('/');
  const acc = head.match(/^[b#]*/)[0];
  const num = head.slice(acc.length);
  const pre = acc.replace(/b/g, '♭').replace(/#/g, '♯');
  return `${pre}${num}${SUFFIX[q] ?? q}${bassIv ? '/' + SIMPLE_BASS(bassIv) : ''}`;
}
// the chord's name in the key (Em7, G/B)
export function nameIn(c) {
  let s = T.chordSymbol(c.root, c.quality);
  if (c.bass && T.notePc(c.bass) !== T.notePc(c.root)) s += '/' + T.noteName(c.bass, true);
  return T.pretty(s);
}
// right answer: the same notes over the same bass (a °7 named from any of its notes is still right)
export function same(a, b) {
  const sa = [...new Set(a.pcs)].sort().join(), sb = [...new Set(b.pcs)].sort().join();
  return sa === sb && a.bassRel === b.bassRel;
}

// ---------- rounds ----------
const pick = (arr, w = () => 1) => { const ws = arr.map(w); let r = Math.random() * ws.reduce((a, b) => a + b, 0); for (let i = 0; i < arr.length; i++) if ((r -= ws[i]) <= 0) return arr[i]; return arr[arr.length - 1]; };
const KEYS = ['C', 'G', 'D', 'A', 'E', 'F', 'Bb', 'Eb', 'Ab', 'B', 'Db', 'F#'];
const MINOR_TONICS = ['A', 'E', 'B', 'D', 'G', 'C', 'F', 'F#', 'C#', 'Bb', 'Eb', 'G#'];

// a round: {tonic, minor, tokens: [...], given: index count shown, song?, style, tempo, bars}
const changesOf = (chart, tonic) => {
  const out = [];
  T.parseChart(chart, tonic).flat().forEach((c) => { if (out[out.length - 1] !== c.token) out.push(c.token); });
  return out;
};
const homeFirst = (tokens) => /^[Ii]:/.test(tokens[0]);
// the named progressions a level's chords can spell (so a third or more of its rounds are real cadences and songs)
const canonCache = new Map();
function canonFor(level) {
  if (!canonCache.has(level.id)) {
    const C = T.parseNote('C');
    canonCache.set(level.id, Object.values(SONGS).flat().filter((s) => {
      const ch = changesOf(s.chart, C);
      return !!s.minor === !!level.minor && ch.length >= 2 && (level.len || 4) >= 3 && ch.length <= (level.len || 4) + 2
        && ch.every((x) => level.vocab.includes(x)) && (!level.start || ch[0] === level.start);
    }));
  }
  return canonCache.get(level.id);
}
// a round: {tonic, minor, tokens (one per chord change), given (how many are shown), song?, chart?, cadence}
// The key is set with a cadence only when the round doesn't start at home.
export function makeRound(level) {
  const song = (s, given = 0) => {
    const tonic = T.parseNote(pick(s.minor ? MINOR_TONICS : KEYS));
    const tokens = changesOf(s.chart, tonic);
    return { tonic, minor: !!s.minor, tokens, given, song: s, tempo: s.tempo || 100, chart: s.chart, loops: 1, cadence: !homeFirst(tokens) };
  };
  if (level.real) return song(pick(SONGS[level.real]));
  const canon = level.vocab ? canonFor(level) : [];
  if (canon.length && Math.random() < 0.4) return song(pick(canon), level.start ? 1 : 0);
  const minor = !!level.minor;
  const tonic = T.parseNote(pick(minor ? MINOR_TONICS : KEYS));
  let tokens;
  if (level.pool) tokens = t(pick(level.pool));
  else if (level.any) tokens = anyTokens(level);
  else {
    tokens = level.start ? [level.start] : [];
    while (tokens.length < level.len) {
      const prev = tokens[tokens.length - 1];
      const opts = level.vocab.filter((x) => x !== prev && !(level.start && tokens.length === 1 && x === level.start && level.vocab.length > 2));
      tokens.push(pick(opts, (x) => (level.weights?.[x] ?? 1) * move(prev, x)));
    }
  }
  return { tonic, minor, tokens, given: level.start ? 1 : 0, secs: level.secs || 2.3, loops: 1, cadence: level.any ? true : !homeFirst(tokens) };
}
// how often one chord follows another in pop and jazz (rounded from Hooktheory's trends), by root degree, so generated
// rounds sound like music; a move not listed still happens, less often
const MOVES = {
  I: { IV: 0.3, V: 0.3, VI: 0.22, II: 0.12, III: 0.06 }, IV: { I: 0.32, V: 0.29, VI: 0.15, II: 0.1, III: 0.04 },
  V: { I: 0.45, VI: 0.25, IV: 0.2, II: 0.05 }, VI: { IV: 0.4, II: 0.2, V: 0.2, I: 0.1, III: 0.1 },
  II: { V: 0.55, IV: 0.15, I: 0.1, VI: 0.1, III: 0.1 }, III: { VI: 0.45, IV: 0.3, II: 0.1, I: 0.1 }, VII: { I: 0.5, III: 0.2, VI: 0.2 },
};
const degOf = (tok) => tok.split(':')[0].replace(/^[b#]+/, '').toUpperCase();
function move(prev, x) {
  if (!prev) return 1;
  const m = MOVES[degOf(prev)]?.[degOf(x)];
  return m === undefined ? 0.12 : 0.1 + m;
}
// the function a degree usually has: tonic, pre-dominant or dominant (for grouping the answer buttons)
export function functionOf(tok) {
  const d = degOf(tok);
  return { I: 'T', III: 'T', VI: 'T', II: 'PD', IV: 'PD', V: 'D', VII: 'D' }[d] || 'T';
}
function anyTokens(level) {
  const out = [];
  const diatonic = [0, 2, 4, 5, 7, 9, 11];
  while (out.length < level.len) {
    const deg = Math.random() < 0.6 ? pick(diatonic) : Math.floor(Math.random() * 12);
    const q = pick(level.any.qualities);
    let bass = '1';
    if (level.any.inversions && Math.random() < 0.35) bass = pick(T.getChord(q).ivs.slice(1).map(SIMPLE_BASS).filter((b) => ['3', '5', '7'].includes(b)));
    const tok = tokenOf(deg, q, bass);
    if (out[out.length - 1] !== tok) out.push(tok);
  }
  return out;
}

// what the answer pad offers: buttons for a small vocabulary, else root × type × bass
export function padFor(level, round) {
  if (level.real) {
    const toks = [...new Set(SONGS[level.real].flatMap((s) => T.parseChart(s.chart, T.parseNote('C')).flat().map((c) => c.token)))];
    const qs = [...new Set(toks.map((x) => x.split(':')[1].split('/')[0]))];
    return { kind: 'build', qualities: qs, inversions: toks.some((x) => x.includes('/')) };
  }
  if (level.any) return { kind: 'build', qualities: level.any.qualities, inversions: !!level.any.inversions };
  return { kind: 'buttons', tokens: level.vocab };
}

// ---------- voicings and playing ----------
// guitar placements, one per chord: barre grips for root-position chords, voice-led drop 2 / close voicings when a bass
// note matters or a grip doesn't exist
export function voicings(round) {
  const chords = round.tokens.map((x) => chordOf(x, round.tonic));
  return voicingsFor(chords);
}
function voicingsFor(chords) {
  const needsLead = chords.some((c) => c.bass && T.notePc(c.bass) !== T.notePc(c.root));
  // root position unless the chord asks for another bass: the bass note is what the ear follows
  const withBass = chords.map((c) => ({ ...c, bass: c.bass || c.root }));
  if (needsLead) {
    const four = chords.some((c) => T.getChord(c.quality).ivs.length >= 4);
    const pls = F.voiceLead(withBass, { voicing: four ? 'drop2' : 'close', startFret: 4 + Math.floor(Math.random() * 4) });
    return pls.map((p, i) => {
      const c = withBass[i];
      if (!c.bass || (p && lowest(p) % 12 === T.notePc(c.bass))) return p || F.gripFor(c.root, c.quality, 5);
      // the voice-led choice lost the bass: the nearest voicing of another family that has it
      const near = p ? avg(p) : 5;
      for (const v of ['drop3', 'close', 'drop2']) {
        const q = F.voiceLead([c], { voicing: v, startFret: near })[0];
        if (q && lowest(q) % 12 === T.notePc(c.bass)) return q;
      }
      return p;
    });
  }
  let target = 2 + Math.floor(Math.random() * 5);
  return withBass.map((c) => {
    let g = F.gripFor(c.root, c.quality, target);
    const low = g && g.notes.reduce((a, n) => (n.midi < a.midi ? n : a));
    if (!g || low.midi % 12 !== T.notePc(c.root)) g = F.voiceLead([c], { voicing: 'close', startFret: target })[0] || g;
    if (g) target = Math.round(avg(g));
    return g;
  });
}
const lowest = (p) => Math.min(...p.notes.map((n) => n.midi));
const avg = (p) => p.notes.reduce((a, n) => a + n.fret, 0) / p.notes.length;
const notesOf = (p) => p.notes.map((n) => ({ midi: n.midi, string: n.string }));

// on a keyboard: the bass low, the other notes voice-led close above it (each chord's upper voices move as little as
// they can from the last)
export function keysVoicings(round) {
  const chords = round.tokens.map((x) => chordOf(x, round.tonic));
  let prev = null;
  return chords.map((c) => {
    const ivs = T.getChord(c.quality).ivs.map(F.simpleIv);
    const pcs = [...new Set(ivs.map((iv) => (T.notePc(c.root) + T.intervalSemis(iv)) % 12))];
    const bassPc = T.notePc(c.bass || c.root);
    const upper = pcs.length > 4 ? pcs.filter((p) => p !== T.notePc(c.root)) : pcs;
    const bass = 36 + ((bassPc - 36) % 12 + 12) % 12;
    let best = null;
    for (let k = 0; k < upper.length; k++) {
      const rot = upper.slice(k).concat(upper.slice(0, k));
      for (const start of [53, 57, 60]) {
        const mids = [start + ((rot[0] - start) % 12 + 12) % 12];
        for (let j = 1; j < rot.length; j++) { let x = mids[j - 1] + 1; while (x % 12 !== rot[j]) x++; mids.push(x); }
        if (mids[0] - bass < 3) continue;
        const cost = prev ? mids.reduce((a, x, i) => a + Math.abs(x - (prev[i] ?? prev[prev.length - 1])), 0) : Math.abs(mids[0] - 60);
        if (!best || cost < best.cost) best = { mids, cost };
      }
    }
    prev = best.mids;
    return { notes: [bass, ...best.mids].map((midi) => ({ midi })) };
  });
}

// schedule a round from time t0, one chord struck per bar (or half bar); returns {end, marks: [{t, i}]} for highlighting
// chord i at time t. Generated rounds give each chord `secs`; real songs keep their bars and tempo.
export function schedule(round, pls, t0, { onlyIndex = null, instrument = 'guitar' } = {}) {
  const marks = [];
  let t = t0;
  const bars = round.chart ? T.parseChart(round.chart, round.tonic) : round.tokens.map((x) => [T.parseChordToken(x, round.tonic)]);
  const barSecs = round.chart ? 4 * 60 / round.tempo : round.secs || 2.4;
  const slots = [];
  bars.forEach((bar) => bar.forEach((c) => slots.push({ c, secs: barSecs / bar.length })));
  let idx = -1, prevTok = null;
  slots.forEach((s) => { if (s.c.token !== prevTok) { idx++; prevTok = s.c.token; } s.i = idx; });
  const loops = onlyIndex !== null ? 1 : round.loops || 1;
  for (let l = 0; l < loops; l++) {
    let last = null;
    for (const s of slots) {
      if (onlyIndex !== null && s.i !== onlyIndex) continue;
      const p = pls[s.i];
      const fresh = s.i !== last;
      if (fresh) { marks.push({ t, i: s.i }); last = s.i; }
      if (p) S.playChord(instrument, notesOf(p), t, s.secs, { vel: fresh ? 0.82 : 0.7 });
      t += s.secs;
    }
  }
  return { end: t, marks };
}
// the key, before a round: I–IV–V7–I (or i–iv–V7–i)
export function scheduleCadence(round, t0, instrument = 'guitar') {
  const r = { ...round, chart: null, tokens: t(round.minor ? 'i:min iv:min V:7 i:min' : 'I:maj IV:maj V:7 I:maj'), secs: 0.9 };
  const pls = instrument === 'guitar' ? voicingsFor(r.tokens.map((x) => chordOf(x, round.tonic))) : keysVoicings(r);
  const { end } = schedule(r, pls, t0, { instrument });
  return end + 0.5;
}
export const songLine = (s) => `${s.song}${s.by ? ' · ' + s.by : ''}`;
