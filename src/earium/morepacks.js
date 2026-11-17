// More harmony for Ambient: quartal and sus, planing, pedals and the open-string ECM sound, upper-structure triads,
// neo-Riemannian moves and Coltrane cycles, harmonic minor and major, gospel and neo-soul, impressionist colour,
// negative harmony; and listening demos: one chord in many voicings, one melody note over many chords, one triad
// over many basses. Charts are in the library's language (numerals against the home key's major scale). Extra fields:
//   minor   the home key is minor        home   play in this key (open strings need it)
//   voicing a voicing style for every chord: close, spread, fourths, cluster, open
//   voicings one style per chord           top    the melody note held on top (an interval above home)
//   labels  what each chord becomes (shown)
const X = (id, name, chart, note, o = {}) => ({ id: `x-${id}`, name, chart, note, minor: false, ...o });
const M = { minor: true };
// an eight-bar tune in the major key: [interval above home, beats, octave]
const TUNE = [['3', 2], ['2', 1], ['1', 1], ['2', 2], ['5', 2, -1], ['3', 1], ['4', 1], ['5', 2], ['6', 2], ['5', 2], ['4', 2], ['3', 1], ['2', 1], ['3', 2], ['1', 2], ['2', 2], ['7', 2, -1], ['1', 4]];

export const MORE_GROUPS = [
  { name: 'Modern harmony', packs: [
    { id: 'x-quartal', name: 'Quartal and sus', intro: 'Quartal and sus harmony: chords built in fourths, or with the third left out. Nothing pulls; the harmony floats.', items: [
      X('sowhat', 'So What chords', '| i:m11 | i:m11 | bii:m11 | i:m11 |', 'Fourths stacked, with a third on top, moved as one shape a half step up and back: modal jazz, colour without pull.', { ...M, voicing: 'fourths' }),
      X('tyner', 'Fourths around the mode', '| i:quartal | iv:quartal | i:quartal | v:quartal |', 'Three notes a fourth apart, moved around the Dorian mode: McCoy Tyner’s piano sound, on guitar.', { ...M, voicing: 'fourths' }),
      X('maiden', 'Sus chords a minor third apart', '| I:9sus4 | bIII:9sus4 | I:9sus4 | bIII:9sus4 |', 'Nine sus four chords, no thirds anywhere, so nothing resolves: the floating, Maiden Voyage idea.', { voicing: 'fourths' }),
      X('susres', 'The sus four that resolves', '| ii:m7 | V:7sus4 | V:7 | I:maj7 |', 'The sus four delays the dominant: the fourth hangs, then falls to the third.'),
      X('sixnine', 'Six nine chords in fourths', '| I:6/9 | IV:6/9 | I:6/9 | V:9sus4 |', 'Six nine chords voiced in fourths: the pentatonic sound of modern jazz guitar.', { voicing: 'fourths' }),
    ] },
    { id: 'x-planing', name: 'Planing', intro: 'Planing: one chord shape moved around as a block, by step, without a key pulling it anywhere.', items: [
      X('maj7', 'Major sevens by step', '| I:maj7 | II:maj7 | bIII:maj7 | II:maj7 |', 'One shape moved up and down: no chord leads anywhere, each is just a colour.', { voicing: 'close' }),
      X('m9', 'Minor nines descending', '| vi:m9 | v:m9 | iv:m9 | iii:m9 |', 'The same minor nine shape sliding down the scale, like light moving across a room.', { voicing: 'close' }),
      X('ninths', 'Parallel ninths, by whole step', '| I:9 | II:9 | III:9 | II:9 |', 'Dominant ninths moved in whole steps: Debussy’s floating parallel chords.', { voicing: 'close' }),
      X('sus', 'Sus chords sliding', '| I:7sus4 | bVII:7sus4 | bVI:7sus4 | bVII:7sus4 |', 'Seven sus four chords as blocks, down by whole steps and back.', { voicing: 'close' }),
      X('lyd', 'Constant structure', '| I:maj7#11 | bVI:maj7#11 | bIII:maj7#11 | bVII:maj7#11 |', 'The same major seven sharp eleven on roots that share no key: the Kenny Wheeler kind of ballad, where the shape is the logic.', { voicing: 'close' }),
    ] },
    { id: 'x-pedal', name: 'Pedals and open strings', intro: 'Pedals and open strings: a bass that holds while chords move above it, and open strings ringing under fretted notes. The ECM guitar sound.', items: [
      X('triads', 'Triads over a held bass', '| I:maj | II:maj/b7 | bVII:maj/2 | I:maj |', 'The bass holds the home note; triads move above it. Two over one is the Lydian sound, flat seven over one a soft nine sus.', { home: 'E', voicing: 'open' }),
      X('ecm', 'Open strings, moving voices', '| i:madd9 | bVI:maj7#11 | i:madd9 | bVII:add9 |', 'Open strings ring under fretted notes that move: Ralph Towner and Pat Metheny territory.', { ...M, home: 'E', voicing: 'open' }),
      X('pedalprog', 'A progression over a pedal', '| I:maj | IV:maj/5 | ii:m7/b7 | V:9sus4/4 |', 'Everything over the home note in the bass: the harmony moves, the ground stays.', { home: 'A', voicing: 'open' }),
      X('clusters', 'Clusters', '| I:add9 | I:add9 | IV:add9 | IV:add9 |', 'Seconds ringing together, open strings against fretted notes: the shimmer of a cluster.', { home: 'E', voicing: 'cluster' }),
      X('dpedal', 'Sus and nine over D', '| I:sus2 | IV:maj9/5 | I:sus2 | bVII:add9/2 |', 'Over the open D, chords that never quite say major or minor.', { home: 'D', voicing: 'open' }),
    ] },
    { id: 'x-upper', name: 'Upper-structure triads', intro: 'Upper-structure triads: a dominant chord with a different triad sitting on top. The triad on top is the colour.', items: [
      X('ii', 'Two over five', '| ii:m7 | V:13#11 | I:maj7 | I:maj7 |', 'A major triad a step above the dominant’s root, on top of it: nine, sharp eleven, thirteen.', { voicing: 'spread' }),
      X('biii', 'Flat three over five', '| ii:m7 | V:7#9 | I:maj7 | I:maj7 |', 'A triad on the flat three over the dominant: the sharp nine, the blues clash, sitting high and clean.', { voicing: 'spread' }),
      X('vi', 'Six over five', '| ii:m7 | V:13b9 | I:maj7 | I:maj7 |', 'A major triad a sixth above: thirteen and flat nine, sweet and dark at once.', { voicing: 'spread' }),
      X('bvi', 'Flat six over five, into minor', '| ii:m7b5 | V:7#9#5 | i:m9 | i:m9 |', 'A triad on the flat six: sharp five and sharp nine, falling into a minor home.', { ...M, voicing: 'spread' }),
    ] },
    { id: 'x-neo', name: 'Neo-Riemannian and Coltrane', intro: 'Chords linked by moving one or two notes, not by key: the drifting of film scores, and Coltrane’s cycles of thirds.', items: [
      X('hex', 'The hexatonic cycle', '| I:maj | i:min | bVI:maj | bvi:min | III:maj | iii:min |', 'Each chord moves one note: major to minor, then down a third. Six steps and you are home.'),
      X('pole', 'The hexatonic pole', '| I:maj | bvi:min | I:maj | bvi:min |', 'Major to the minor chord a major third below: not a single note shared. The uncanny sound composers use for the supernatural.'),
      X('slide', 'The slide', '| I:maj | bii:min | I:maj | bii:min |', 'The third stays; root and fifth slide up a half step: a sudden, sideways shift.'),
      X('giant', 'Coltrane cycle', '| I:maj7 bIII:7 | bVI:maj7 VII:7 | III:maj7 V:7 | I:maj7 |', 'Three keys a major third apart, each reached by its own dominant: the Giant Steps idea.'),
      X('countdown', 'Coltrane over a two five', '| ii:m7 bIII:7 | bVI:maj7 VII:7 | III:maj7 V:7 | I:maj7 |', 'A two, five, one with the major-third cycle squeezed in between: the Countdown idea.'),
    ] },
    { id: 'x-scales', name: 'Harmonic minor and major', intro: 'The chords of harmonic minor and harmonic major: scales with one altered note, and the colours that come with it.', items: [
      X('hmin', 'Harmonic minor in sevenths', '| i:mMaj7 | ii:m7b5 | bIII:maj7#5 | iv:m7 | V:7 | bVI:maj7 | vii:dim7 | i:mMaj7 |', 'Natural minor with a raised seventh: the dominant gets its leading tone, and the diminished seven appears.', M),
      X('hmaj', 'Harmonic major in sevenths', '| I:maj7 | ii:m7b5 | iii:m7 | iv:mMaj7 | V:7 | bVI:maj7#5 | vii:dim7 | I:maj7 |', 'Major with a flat six: a bright key with the minor four inside it.'),
      X('hmincad', 'The harmonic minor cadence', '| iv:m7 | vii:dim7 | V:7b9 | i:mMaj7 |', 'The minor four, the leading-tone diminished, the dominant with a flat nine: all from one scale.', M),
      X('hmajcad', 'Harmonic major, home', '| I:maj7 | IV:maj7 | iv:m6 | V:7b9 | I:maj7 |', 'Harmonic major gives a major key its minor four and a flat nine on the five.'),
    ] },
    { id: 'x-soul', name: 'Gospel and neo-soul', intro: 'Gospel and neo-soul: lush ninths and elevenths, passing chords, and chords that slide into each other.', items: [
      X('neosoul', 'Neo-soul, stepping down', '| IV:maj9 | iii:m7 | ii:m9 | I:maj9 |', 'Ninths stepping down the scale, every chord with a soft top.'),
      X('gospel25', 'Gospel turnaround', '| I:maj9 | VI:7b9 | ii:m9 | V:13 |', 'The six chord made dominant with a flat nine, pulling into the two: church in four chords.'),
      X('twoofus', 'Four, three, six', '| IV:maj7 | III:7 | vi:m9 | vi:m9 |', 'Major seven on four, a dominant on three pulling to the six: the Just the Two of Us progression.'),
      X('walk', 'The minor plagal walk', '| IV:maj7 | #iv:m7b5 | I:maj7/5 | VI:7#9 |', 'The bass climbs four, sharp four, five, through a half-diminished chord: gospel’s favourite approach home.'),
      X('neominor', 'Neo-soul in minor', '| i:m9 | iv:m9 | bVII:13 | bIII:maj9 |', 'Minor ninths and a thirteen: dark, warm and unhurried.', M),
    ] },
    { id: 'x-impress', name: 'Impressionist colour', intro: 'Impressionist colour: whole-tone and augmented chords, Lydian brightness, harmony as light rather than motion.', items: [
      X('wholetone', 'Whole-tone shimmer', '| I:aug | II:aug | I:aug | II:aug |', 'Two augmented chords a whole step apart use every note of the whole-tone scale: no centre, all shimmer.'),
      X('aug', 'The augmented passing chord', '| I:maj | I:aug | vi:min | IV:maj7 |', 'The fifth rises a half step, and the major chord dissolves into the relative minor.'),
      X('lydbliss', 'Lydian brightness', '| I:maj9#11 | II:9 | I:maj9#11 | II:9 |', 'The major nine sharp eleven and the chord a step above it: both from Lydian, both bright, neither resolving.'),
    ] },
    { id: 'x-negative', name: 'Negative harmony', intro: 'Negative harmony: each note mirrored around the axis between the third and the flat third. Major turns minor, and progressions turn inside out.', items: [
      X('pop', 'A pop loop', '| I:maj | V:maj | vi:min | IV:maj |', 'The loop as written. Its mirror follows.'),
      X('popneg', 'The same loop, mirrored', '| i:min | iv:min | bIII:maj | v:min |', 'Each note reflected around the axis: one becomes minor one, five becomes minor four, six minor becomes flat three, four becomes minor five.', M),
      X('251', 'Two, five, one', '| ii:min | V:maj | I:maj | I:maj |', 'As written. Its mirror follows.'),
      X('251neg', 'Two, five, one, mirrored', '| bVII:maj | iv:min | i:min | i:min |', 'The mirror: two becomes flat seven, five becomes minor four, one becomes minor one. A dominant cadence turned into a plagal one.', M),
    ] },
  ] },
  { name: 'Listening demos', packs: [
    { id: 'x-voicings', name: 'One chord, many voicings', intro: 'One chord, voiced four ways. The notes hardly change; the feeling does.', items: [
      X('maj9', 'A major nine, four ways', '| I:maj9 | I:maj9 | I:maj9 | I:maj9 |', 'Close, then spread, then in fourths, then as a cluster.', { voicings: ['close', 'spread', 'fourths', 'cluster'] }),
      X('m11', 'A minor eleven, four ways', '| i:m11 | i:m11 | i:m11 | i:m11 |', 'Close, then spread, then in fourths, then with open strings ringing.', { ...M, home: 'E', voicings: ['close', 'spread', 'fourths', 'open'] }),
      X('13', 'A dominant thirteen, four ways', '| V:13 | V:13 | V:13 | I:maj7 |', 'Close, then spread, then in fourths, then home.', { voicings: ['close', 'spread', 'fourths', null] }),
    ] },
    { id: 'x-melody', name: 'One note, many chords', intro: 'One melody note held on top while the chords change under it. The note never moves, but its meaning does.', items: [
      X('m1', 'The home note on top', '| I:maj | vi:min | IV:maj | ii:m7 | bVI:maj | bII:maj7 | II:7 | V:7sus4 |', 'The melody holds the home note: the root, the flat three, the five, the flat seven, the three, the seven, the flat seven again, the four.', { top: '1', bpm: 60 }),
      X('m5', 'The fifth on top', '| I:maj | iii:min | bIII:maj | V:7 | ii:m11 | bVI:maj7 | IV:maj9 | vi:m7 |', 'The melody holds the fifth of the key: it becomes a root, a minor third, an eleven, a seven, a nine.', { top: '5', bpm: 60 }),
      X('m3', 'The third on top', '| I:maj | vi:min | IV:maj7 | ii:m9 | V:13 | bVII:maj7#11 | III:7 | I:maj |', 'The melody holds the third of the key: three, five, seven, nine, thirteen, sharp eleven, root.', { top: '3', bpm: 60 }),
    ] },
    { id: 'x-tune', name: 'A melody, harmonised', intro: 'An eight-bar melody: first alone, then with its chords in time, then slowly, so you can hear what each chord does to it.', items: [
      X('plain', 'Plainly harmonised', '| I:maj | V:maj | IV:maj7 | I:6 | ii:m7 | vi:min | V:7 | I:maj |', 'Simple chords under the tune: each melody note is a chord tone or a step away from one.', { melody: TUNE, bpm: 72 }),
      X('reharm', 'The same melody, reharmonised', '| I:maj9 | iii:m7 | IV:maj7#11 | VI:7 | ii:m9 | vi:m7 | V:9sus4 | I:6/9 |', 'The same tune with richer chords under it: the notes stay, their meaning changes.', { melody: TUNE, bpm: 72 }),
    ] },
    { id: 'x-bass', name: 'One chord, many basses', intro: 'One triad held above, a new note in the bass each time: every bass note makes it a different chord.', items: [
      X('cbass', 'A major triad over eight basses', '| I:maj | I:maj/6 | I:maj/4 | I:maj/2 | I:maj/b3 | I:maj/b7 | I:maj/#4 | I:maj/5 |', 'Over its root; over the six, a minor seven; over the four, a major nine; over the two, a nine sus; over the flat three, a major seven sharp eleven; over the flat seven, a Lydian nine; over the sharp four, a rootless dominant; over the five, a six four, waiting.',
        { labels: ['major', 'minor 7 on 6', 'maj9 (no 3) on 4', '9sus4 on 2', 'maj7♯11 on ♭3', 'Lydian 9 on ♭7', '7♭9♯11 on ♯4', '6/4 on 5'] }),
      X('mbass', 'A minor triad over six basses', '| i:min | i:min/b6 | i:min/4 | i:min/b7 | i:min/2 | i:min/5 |', 'Over its root; over the flat six, a major seven; over the four, a minor nine; over the flat seven, a thirteen sus; over the two, a half-diminished eleven; over the five, waiting.', { ...M }),
    ] },
  ] },
];
