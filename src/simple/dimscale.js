// How teachers practise the diminished scale: fingering, the °7 and dominant arpeggios inside it, its triads,
// the tritone pair, °7 + neighbour cells, beat placement, use in tunes, and the Barry Harris 6th-diminished contrast.
// All examples in C half-whole (C D♭ E♭ E F♯ G A B♭) unless a card says otherwise.
const D = (bpm, sub, from, goal, drone) => ({ bpm, sub, from, goal, drone });
const C7 = '=C3 Bb3 E4 A4'; // C13 shell to play the lines over
const line = (chord, notes, then = '') => `${chord} | ${notes.split(' ').join(' | ')}${then ? ` | ${then}` : ''}`;

export const DECK = { id: 'dimscale', name: 'Practising the diminished scale', cards: [
  { t: 'Which diminished, which chord', s: 'read this first', b: [
    'Eight notes, alternating half and whole steps. It has two names, depending on where you start:',
    '- <b>Half-whole</b> from a dominant’s root: C D♭ E♭ E F♯ G A B♭ over C7♭9 = 1 ♭9 ♯9 3 ♯11 5 13 ♭7',
    '- <b>Whole-half</b> from a °7’s root: the same notes from D♭ fit D♭°7 (= E°7, G°7, B♭°7)',
    '- Over a dominant: half-whole from its 1, ♯9, ♯11 or 13; whole-half from its ♭9, 3, 5 or ♭7. Same eight notes either way',
    'It repeats every minor 3rd, so there are only three: C, D♭ and D half-whole cover all twelve dominants. Use it on 13♭9 sounds (♭9 with a natural 5 and 13), not on 7♭13 or 7alt.',
  ], ex: [['C13♭9, the chord it spells', 'C:13b9'], ['Its °7, D♭°7: C7♭9 without the root', 'Db:dim7 C:7b9']] },

  { t: 'One fingering, four keys', s: 'move it 3 frets', drill: D(60, 2, '8ths at 60', '8ths at 160, then the same shape 3, 6 and 9 frets up', 'C'),
    neck: { kind: 'list', events: [[6, 8, '1'], [6, 9, '♭9'], [6, 11, '♯9'], [5, 7, '3'], [5, 9, '♯11'], [5, 10, '5'], [4, 7, '13'], [4, 8, '♭7'], [4, 10, '1'], [3, 6, '♭9'], [3, 8, '♯9'], [3, 9, '3'], [2, 7, '♯11'], [2, 8, '5'], [2, 10, '13'], [1, 6, '♭7'], [1, 8, '1'], [1, 9, '♭9'], [1, 8, '1'], [1, 6, '♭7'], [2, 10, '13'], [2, 8, '5'], [2, 7, '♯11'], [3, 9, '3'], [3, 8, '♯9'], [3, 6, '♭9'], [4, 10, '1'], [4, 8, '♭7'], [4, 7, '13'], [5, 10, '5'], [5, 9, '♯11'], [5, 7, '3'], [6, 11, '♯9'], [6, 9, '♭9']] }, b: [
    'Three notes per string from C on the 8th fret of the low E:',
    '- E 8 9 11 · A 7 9 10 · D 7 8 10 · G 6 8 9 · B 7 8 10 · e 6 8 9',
    '- Move the whole shape up 3 frets and you have the same notes from E♭; again for F♯ and A. One fingering, four dominants',
    '- It spans frets 6 to 11: shift with the 1st finger as you cross strings rather than stretching. Pick strictly alternate',
    '<b>Harder</b>: play the C7 chord, the °7 arpeggio, then the scale in each of the four positions, up the neck without stopping. Then learn the roots on the 5th and 4th strings.',
  ] },

  { t: 'Two °7s and four dominants', s: 'chord tones, not runs', drill: D(60, 2, '8ths at 60', '8ths at 140, then improvise with arpeggios only', 'C'),
    neck: { kind: 'play', key: 'C', play: '=C3 | E3 | G3 | Bb3 | Eb3 | G3 | Bb3 | Db4 | F#3 | A#3 | C#4 | E4 | A3 | C#4 | E4 | G4 | C4' }, b: [
    'Stack the scale in 3rds and it splits into two °7 chords a half step apart: <b>C°7</b> (C E♭ F♯ A) and <b>D♭°7</b> (D♭ E G B♭). It also holds four dominant 7ths: <b>C7, E♭7, F♯7, A7</b>.',
    'Matt Warnock’s drill, over a C7♭9 vamp:',
    '- 1. Solo with the scale',
    '- 2. Solo with only the C7, E♭7, F♯7 and A7 arpeggios (the drill)',
    '- 3. Solo with only D♭°7, in its four positions: it’s C7♭9 without the root',
    '<b>Harder</b>: all three steps in every key, then on a tune, treating each dominant as 7♭9. From Guitar World, “One quick trick to solo over 7♭9 chords”.',
  ] },

  { t: 'Four triads a minor 3rd apart', s: 'C, E♭, F♯ and A', drill: D(60, 3, 'triplets at 60', 'triplets at 132', 'C'),
    neck: { kind: 'play', key: 'C', play: '=G4 | E4 | C4 | E4 | C#4 | A3 | C#4 | A#3 | F#3 | Bb3 | G3 | Eb3 | F3' }, b: [
    'The major triads on C, E♭, F♯ and A are all in the scale (so are the minor ones). Over C7:',
    '- C = 1 3 5 · E♭ = ♯9 5 ♭7 · F♯ = ♯11 ♭7 ♭9 · A = 13 ♭9 3',
    '- Play each up and down from its root, 3rd and 5th, then through the inversions',
    '- The drill comes down through C, A, F♯ and E♭, a triad per beat, and lands on F: a C7 line into F minor',
    '<b>Harder</b>: a chromatic approach note before each triad. Over G7 in a ii–V–I, B♭ and D♭ (♯9 5 ♭7, ♭5 ♭7 ♭9) are the tense pair. From Jazzadvice and Premier Guitar.',
  ], ex: [['B♭ and D♭ triads over G7, into C', '=G2 F3 B3 | Bb3 | D4 | F4 | Ab4 | F4 | Db4 | C3 G3 C4 E4']] },

  { t: 'The tritone pair', s: 'C and F♯: two shapes, six notes', drill: D(60, 3, 'triplets at 60', 'triplets at 132', 'C'),
    neck: { kind: 'list', events: [[3,  5,  '1'],  [2,  5,  '3'],  [1,  3,  '5'],  [3,  6,  '♭9'],  [2,  7,  '♯11'],  [1,  6,  '♭7'],  [3,  9,  '3'],  [2,  8,  '5'],  [1,  8,  '1'],  [3,  11,  '♯11'],  [2,  11,  '♭7'],  [1,  9,  '♭9'],  [3,  12,  '5'],  [2,  13,  '1'],  [1,  12,  '3'],  [1,  9,  '♭9'],  [2,  11,  '♭7'],  [3,  11,  '♯11'],  [1,  8,  '1'],  [2,  8,  '5'],  [3,  9,  '3'],  [1,  6,  '♭7'],  [2,  7,  '♯11'],  [3,  6,  '♭9'],  [1,  3,  '5'],  [2,  5,  '3'],  [3,  5,  '1']] }, b: [
    'Two major triads a tritone apart, C and F♯: C D♭ E F♯ G B♭ = 1 ♭9 3 ♯11 5 ♭7. It’s the half-whole scale without E♭ and A, so it’s strong on 7♭9♯11.',
    '- Sing C, then play the six notes up and down',
    '- Vamp C7 and use only these two triads, alternating. The drill climbs the top three strings, C, F♯, C, F♯, C, each in the next inversion, and comes back down',
    '- Then on the V of a ii–V–I, then on every chord of a blues, then in twelve keys',
    '<b>Harder</b>: keep each triad on its own string set (C on 4-3-2, F♯ on 3-2-1) and cross between them. Warnock calls it the “tritone scale” (Guitar World).',
  ], ex: [['C and F♯ over C7', line(C7, 'C4 E4 G4 F#4 A#4 C#5')]] },

  { t: 'The °7 with neighbour notes', s: 'cells that sound like jazz', drill: D(60, 2, '8ths at 60', '8ths at 160, in two other directions', 'C'),
    neck: { kind: 'list', events: [[3, 5, '1'], [4, 5, '5'], [3, 8, '♯9'], [4, 8, '♭7'], [2, 7, '♯11'], [3, 6, '♭9'], [1, 5, '13'], [2, 5, '3'], [1, 8, '1'], [2, 8, '5'], [1, 5, '13'], [2, 5, '3'], [2, 7, '♯11'], [3, 6, '♭9'], [3, 8, '♯9'], [4, 8, '♭7']] }, b: [
    'Take C°7 (C E♭ F♯ A) as the skeleton and add one note to each:',
    '- <b>A 4th below</b> each note: C–G, E♭–B♭, F♯–C♯, A–E (the drill goes up and back in one position). The lower notes spell D♭°7, so all eight notes are in the scale. The source credits Michael Brecker and Mike Miller with this one',
    '- <b>A whole step below</b> each: B♭–C, D♭–E♭, E–F♯, G–A. Alternate the direction',
    '- Careful: a whole step <i>above</i> (D, F, G♯, B) is the other diminished scale. Fine on C°7, wrong on C7',
    '<b>Harder</b>: shift the cell across the beat, reverse it, or switch to another diminished scale halfway. From Jazzadvice, “10 Diminished Patterns”.',
  ] },

  { t: 'Chord tones on the beat', s: 'which note starts the run', drill: D(60, 2, '8ths at 60', '8ths at 160, starting each time on a different note', 'C'),
    neck: { kind: 'scale', id: 'dim-hw', key: 'C', fam: 'nps3', near: 8, seq: 'thirds' }, b: [
    'Eighth notes in a step line put every other note on the beat. Which °7 lands there is up to you:',
    '- From <b>D♭</b>, whole step first (D♭ E♭ E F♯ G A B♭ C): D♭ E G B♭ on the beats, the ♭9 3 5 ♭7 of C7. The line sounds like the chord',
    '- From <b>C</b>, half step first: C E♭ F♯ A on the beats, 1 ♯9 ♯11 13. More tension',
    '- In 3rds (the drill), the scale becomes its two °7s, interlocked',
    '<b>Harder</b>: the scale in 4ths, then in 6ths, starting from D♭ and then from C. From Josiah Boornazian, Learn Jazz Standards.',
  ], ex: [['From D♭: the chord on the beats', line(C7, 'Db4 Eb4 E4 F#4 G4 A4 Bb4 C5', 'F3 C4 F4 Ab4')], ['From C: the tension on the beats', line(C7, 'C4 Db4 Eb4 E4 F#4 G4 A4 Bb4', 'F3 C4 F4 Ab4')]] },

  { t: 'In a tune', s: '7♭9, ♯I°7 and minor ii–V', comp: { chart: 'C:maj7 | C#:dim7 | D:m7 | G:7b9 | E:m7b5 | A:7b9 | D:m7 | G:7b9', bpm: 120 }, b: [
    'A °7 is a rootless 7♭9, so it takes the same scale as its dominant.',
    '- <b>C♯°7</b> (♯I°7 between C and Dm7) = rootless A7♭9: A half-whole, which is the same as C♯ whole-half',
    '- <b>G7♭9</b> into C: G half-whole (G A♭ B♭ B C♯ D E F)',
    '- <b>A7♭9</b> into Dm: A half-whole. It has F♯, the natural 13, where harmonic minor has F: brighter and more modern; let the F♯ fall to F as Dm arrives',
    'Comp the chart, and play the scale only on the 7♭9 and °7 bars; elsewhere, chord tones. Then one °7 arpeggio per bar instead of the scale.',
  ] },

  { t: 'Barry Harris: a different scale', s: 'the 6th-diminished scale', drill: D(60, 2, '8ths at 60', '8ths at 140, alternating with drop-2 chords', 'C'),
    neck: { kind: 'scale', id: 'bebop-maj', key: 'C', fam: 'caged', near: 8 }, b: [
    'C D E F G A♭ A B: C major plus A♭. Not symmetrical, and not for C7♭9: it belongs on C6 or Cmaj7.',
    '- Every other note is <b>C6</b> (C E G A); the rest are <b>D°7</b> (D F A♭ B), a rootless G7♭9. Tonic and dominant, alternating',
    '- Alternate C6 and D°7 arpeggios over a C6 vamp',
    '- Harmonise it in drop 2: each note of the scale gets a C6 or a D°7 voicing, so a scale becomes a moving chord line (the example)',
    'Its “diminished” is the V7♭9 inside I, not the dominant’s own scale. From JG Music Lessons on Barry Harris.',
  ], ex: [['Drop 2 on the top four: C6, D°7, C6, D°7, C6', '=G3 C4 E4 A4 | Ab3 D4 F4 B4 | A3 E4 G4 C5 | B3 F4 Ab4 D5 | C4 G4 A4 E5']] },

  { t: 'A routine', s: 'ten minutes a day', b: [
    '- <b>Ear</b>: strum C7♭9, sing C, then sing the scale up and down over it',
    '- <b>Fingering</b>: the one shape, then 3, 6 and 9 frets up',
    '- <b>Arpeggios</b>: the four dominants, then the °7 in four positions',
    '- <b>One cell</b>: a triad, the tritone pair or the 4ths cell, at 60 in quarters, then 8ths, then triplets',
    '- <b>Apply it</b>: one 7♭9 in a ii–V–I, all twelve keys over a week (only three fingerings to learn)',
    'Over the bars where the chord isn’t 7♭9 or °7, stop. Knowing when not to use it is half the skill.',
  ] },
] };

export const DECKS = [DECK];
