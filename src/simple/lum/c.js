// Guitar Luminary handouts, group C: altered dominants and diminished; Kessel thirds, enclosures, pivots.
// Plus NOCTURNE_FIXES: replacements for the existing Nocturne cards in src/simple/cards.js.
const D = (bpm, sub, from, goal, drone) => ({ bpm, sub, from, goal, drone });
// 'string:fret:label+string:fret:label …' per event, space separated; '-' is a rest
const L = (spec) => spec.trim().split(/\s+/).map((tok) => (tok === '-' ? [] : tok.split('+').map((n) => { const [s, f, l] = n.split(':'); return [Number(s), Number(f), l]; })));
const SRC = (t) => `From the Guitar Luminary handout “${t}”.`;
const SRC2 = (a, b) => `From the Guitar Luminary handouts “${a}” and “${b}”.`;

// ---------------- Luminary: altered and diminished ----------------
const DIM1 = 'Diminished Scale Exercises 1';
const DIM2 = 'Diminished Scale Exercises 2';
const SHAPES = 'Altered Dominant - Diminished Shapes';
const BREAK = 'Breaking the Altered Scale';
const M6D = 'The Altered Scale as Minor 6th Diminished';
const R3 = '- - -';

const altered = { id: 'lum-altered', name: 'Luminary: altered and diminished', cards: [
  { t: 'Diminished over G7', s: 'what the two handouts are for', b: [
    'G half-whole diminished over G7: G A♭ A♯ B C♯ D E F. Against G7 that’s 1 ♭9 ♯9 3 ♯11 5 13 ♭7: every chord tone, plus all the dominant tensions except ♭13.',
    '- Run straight up and down, it sounds like an exercise. These two handouts break it up with patterns: skip 2, rows of 4 (part 1), then enclosures and chromatic passing notes (part 2)',
    '- Everything is in one position: from the E on the D string (2nd fret) up to A♯ on the top string',
    '- The scale repeats every minor 3rd (G, A♯/B♭, C♯, E), so any shape you find moves up or down three frets and still fits',
    'Each phrase ends on a C chord: these are G7 lines resolving to C. ' + SRC2(DIM1, DIM2),
  ], ex: [
    ['G7♭9 to C: the sound the scale makes', 'G:7b9 C:maj7'],
    ['The scale up from G', '=G3 | Ab3 | A#3 | B3 | C#4 | D4 | E4 | F4 | G4', 'G half-whole'],
    ['B°7: a rootless G7♭9, the scale’s skeleton', '=B2 F3 Ab3 D4'],
  ] },

  { t: 'G diminished: the position', s: 'E on the D string up to A♯', drill: D(60, 2, '8ths at 60', '8ths at 160', 'G'),
    neck: { kind: 'list', events: L('4:2:13 4:3:b7 4:5:1 4:6:b9 3:3:#9 3:4:3 3:6:#11 2:3:5 2:5:13 2:6:b7 1:3:1 1:4:b9 1:6:#9 1:4:b9 1:3:1 2:6:b7 2:5:13 2:3:5 3:6:#11 3:4:3 3:3:#9 4:6:b9 4:5:1 4:3:b7 4:2:13') }, b: [
    'The handout’s basic position, which every later exercise uses: four notes on the D string (frets 2, 3, 5, 6), three on the G (3, 4, 6), three on the B (3, 5, 6), three on the top E (3, 4, 6). Up from E to A♯, then back down.',
    '- Third position: the first finger reaches back for the E at the 2nd fret',
    '- Alternate picking, or i–m rest strokes fingerstyle; accent G, B, D and F (the G7 notes) on the beats',
    '- Say the degree as you play it until the ♭9 (A♭) and ♯9 (A♯) stop feeling like a chromatic smudge',
    '<b>Harder</b>: start on each note of B°7 (B, D, F, A♭) and run the position from there. ' + SRC(DIM1),
  ] },

  { t: 'Diminished: rows of 4', s: '1-2-3-1, one step higher each time', drill: D(60, 2, '8ths at 60', '8ths at 160', 'G'),
    neck: { kind: 'list', events: L('4:3:b7 4:5:1 4:6:b9 4:3:b7 4:5:1 4:6:b9 3:3:#9 4:5:1 4:6:b9 3:3:#9 3:4:3 4:6:b9 3:3:#9 3:4:3 3:6:#11 3:3:#9 3:4:3 3:6:#11 2:3:5 3:4:3 3:6:#11 2:3:5 2:5:13 3:6:#11 2:3:5 2:5:13 2:6:b7 2:3:5 2:5:13 2:6:b7 1:3:1 2:5:13 2:6:b7 1:3:1 1:4:b9 2:6:b7 1:3:1 1:4:b9 1:6:#9 1:3:1 1:4:b9 1:6:#9 1:7:3') }, b: [
    'Groups of four: three scale notes up, then back to the first. Then start the next group one scale note higher: F G A♭ F, G A♭ A♯ G, A♭ A♯ B A♭, and so on up the position.',
    '- Each group starts on the beat, so the starting notes walk up the scale on beats 1 and 3: you hear the scale behind the pattern',
    '- Same fingering as the basic position; the only new thing is the turn back',
    '- Descend too: three down and back up (F E D F, E D C♯ E…)',
    '<b>Harder</b>: mix rows of 4 with straight runs, a bar of each, so neither becomes a habit. ' + SRC(DIM1),
  ] },

  { t: 'Diminished: skip 2', s: 'jump past two notes, come back', drill: D(60, 2, '8ths at 60', '8ths at 150', 'G'),
    neck: { kind: 'list', events: L('1:3:1 1:6:#9 1:4:b9 2:5:13 1:3:1 2:6:b7 2:3:5 2:6:b7 2:5:13 3:6:#11 2:3:5 3:4:3 3:3:#9 3:6:#11 3:4:3 4:5:1 3:3:#9 4:6:b9 4:2:13 4:5:1 4:3:b7 5:4:#11 4:2:13 5:5:5') }, b: [
    'Descend the scale, but from a note leap down past the next two, then step back up to pick up the ones you skipped and carry on down. A♭ – E – G – F is the basic cell: A♭, skip G and F, land on E, come back for G and F.',
    '- This is the handout’s three-bar line, from G on the top string down to D on the A string. It uses the rule with a few turns, so it sounds like a line rather than a formula',
    '- The leaps are a minor or major 3rd: in a diminished scale those are the chord-tone jumps (E to G, C♯ to E, A♯ to C♯…)',
    '- Keep the position; the leaps cross strings, so pick them cleanly rather than fast',
    '<b>Harder</b>: apply the rule strictly, from every scale note, all the way down, then up. ' + SRC(DIM1),
  ] },

  { t: 'The same cell, a minor 3rd up', s: 'two diminished phrases into C', drill: D(60, 2, '8ths at 60', '8ths at 160', 'G'),
    neck: { kind: 'list', events: L('1:3:1 1:6:#9 1:4:b9 2:5:13 1:3:1 2:6:b7 2:5:13 2:3:5 3:3:#9 3:6:#11 3:4:3 4:5:1 3:3:#9 4:6:b9 4:5:1 4:3:b7 5:3:1+4:2:3+3:4:7+2:3:9 ' + R3) }, b: [
    'The handout’s second skip-2 phrase. Bar one: the cell G A♯ A♭ E, then a plain run G F E D. Bar two: the same cell started on A♯ (A♯ C♯ B G), then the same run started on A♯ (A♯ A♭ G F). Then a Cmaj9.',
    '- A♯ is a minor 3rd above G (here an octave lower): the diminished scale lets the whole phrase move by a minor 3rd and stay inside the scale',
    '- The two bars sound like question and answer: same rhythm, same shape, a different register',
    '- Land on the C chord (C, E, B, D) on beat 1 and let it ring',
    '<b>Harder</b>: start the cell on C♯ and on E as well, so you have four versions of the same phrase in one position. ' + SRC(DIM1),
  ], ex: [
    ['Phrase 1: the cell from A♯ and a run, to Cmaj9', '=A#3 | C#4 | B3 | G3 | A#3 | Ab3 | G3 | F3 | C3 E3 B3 D4'],
  ] },

  { t: 'Diminished enclosures', s: 'F, B, D and A♭: one shape, four places', drill: D(60, 2, '8ths at 60', '8ths at 150', 'G'),
    neck: { kind: 'list', events: L(`4:2:13 4:5:1 4:4:ap 4:2:13 4:3:b7 ${R3} 3:3:#9 3:6:#11 3:5:ap 3:3:#9 3:4:3 ${R3} 2:2:#11 2:5:13 2:4:ap 2:2:#11 2:3:5 ${R3} 1:3:1 1:6:#9 1:5:ap 1:3:1 1:4:b9 ${R3}`) }, b: [
    'Part 2 adds enclosures. The target notes are F, B, D and A♭: the ♭7, 3, 5 and ♭9 of G7, which together are B°7. Each gets the same five-note shape: the scale note below, the scale note above, the chromatic note just above the target, the note below again, then the target.',
    '- E G F♯ E → F · A♯ C♯ C A♯ → B · C♯ E E♭ C♯ → D · G A♯ A G → A♭',
    '- Each one is the same shape a minor 3rd higher, moved over one string (frets 2-5-4-2-3 on the D and B strings, 3-6-5-3-4 on the G and top E): the diminished symmetry again',
    '- Put the target on the beat after the pickup notes; it should sound like arriving, not passing',
    '<b>Harder</b>: target B°7 notes in a different order (D, F, A♭, B), then link two enclosures without a rest. ' + SRC(DIM2),
  ] },

  { t: 'Enclosure into a run', s: 'part 2 phrases, resolving to C', drill: D(60, 2, '8ths at 60', '8ths at 160', 'G'),
    neck: { kind: 'list', events: L('4:2:13 4:5:1 4:4:ap 4:2:13 4:3:b7 4:5:1 4:6:b9 3:3:#9 3:4:3 3:6:#11 2:3:5 2:5:13 2:6:b7 1:3:1 1:4:b9 1:6:#9 1:3:1 5:3:1+4:2:3+3:4:7+2:3:9 ' + R3) }, b: [
    'Phrase 1 of part 2: enclose F (E G F♯ E F), then don’t stop: run the scale straight up from F to A♯ and fall back to G, over a Cmaj9.',
    '- The enclosure delays the scale by a beat; the run then releases it. That push and pull is the point',
    '- The other two phrases below: enclose D then B (A♯ C♯ B), down to G; and enclose A♭ on the top string, drop to E, and land on Cmaj7',
    '- The last one is pure chromaticism: B A♯ A G F♯ E F G, half steps down to an enclosure of F, then a skip-2 cell',
    '<b>Harder</b>: build your own: one enclosure + one pattern from part 1 (skip 2 or rows of 4) + a landing on C. The handout’s advice is to mix them freely rather than play whole exercises. ' + SRC(DIM2),
  ], ex: [
    ['Enclose D, then B, down to G', '=C#4 | E4 | Eb4 | C#4 | D4 | A#3 | C#4 | B3 | G3'],
    ['Enclose A♭ on top, land on Cmaj7', '=G4 | A#4 | A4 | G4 | Ab4 | E4 | G4 | F4 | C3 G3 B3 E4'],
    ['Half steps down, enclose F, skip-2 cell, Cmaj9', '=B3 | A#3 | A3 | G3 | F#3 | E3 | F3 | G3 | Ab3 | A#3 | B3 | G3 | A#3 | Ab3 | G3 | F3 | C3 E3 B3 D4'],
  ] },

  { t: 'Altered = diminished shapes', s: 'two B°7 grips, one note moved', b: [
    'The handout starts from a C minor ii–V that Russ Freeman plays on Chet Baker’s “My Funny Valentine” (not written out here). His G7 line is built on two grips of the same diminished chord, B D F A♭ (G7♭9 without its root), with one note nudged a half step.',
    '- Grip 1, strings 5–2: B, F, A♭, D. Lower the D to D♭ and you have the ♭5',
    '- Grip 2, strings 4–1: F, B, D, A♭. Raise the A♭ to B♭ and you have the ♯9',
    '- In C minor, A♭, B♭ and E♭ are already in the key: only the D♭ sounds outside. Move the same idea to C major and ♭9, ♯9, ♭5 and ♭13 all become altered tensions: full G7alt',
    'Finger them as the handout does: grip 1 with 2-1-3 (B, A♭, D♭), grip 2 as a small barre. ' + SRC(SHAPES),
  ], ex: [
    ['Grip 1: B°7 on strings 5–2', '=B2 F3 Ab3 D4'],
    ['…with D lowered to D♭ (♭5)', '=B2 Ab3 Db4'],
    ['Grip 2: B°7 on strings 4–1, then A♭ up to B♭ (♯9)', '=F3 B3 D4 Ab4 | F3 B3 D4 Bb4'],
  ] },

  { t: 'Dm7 contrary, G7alt, C', s: 'the handout’s phrase 1', drill: D(60, 2, '8ths at 60', '8ths at 140', 'C'),
    neck: { kind: 'list', events: L('2:3:1+3:5:b7 2:5:9+3:4:13 2:6:b3+4:7:5 2:8:11+4:5:11 2:6:b3+4:7:5 2:8:11+4:5:11 2:10:5+5:8:b3 1:7:13+5:7:9 2:9:b9+3:8:b13+4:9:3+5:8:b7 4:9:3 3:8:b13 2:9:b9 2:11:#9+3:7:5+4:9:3+5:8:b7 - 2:9:b9 - 2:8:5+3:9:3+4:9:7+6:8:1 ' + R3) }, b: [
    'A ii–V–I in C. Over Dm7, two voices move apart in D Dorian: C/D, B/E, A/F, G/G, back in a step (A/F, G/G), then out to F/A and E/B. Over G7alt, the diminished-shape idea in C major. Then Cmaj7.',
    '- G7alt grip: F B E♭ A♭ (♭7 3 ♭13 ♭9), then its notes one at a time (B, E♭, A♭), then F B D A♯ (the ♯9 grip) and A♭ again',
    '- Labels are degrees of the chord sounding at the time',
    '- Fingerstyle: thumb on the lower voice, i or m on the upper. With a pick, hybrid-pick the upper voice',
    '<b>Harder</b>: the handout’s other phrases bring the Dm7 voices in from D/F to F/D before the same G7alt bar, and the last exercise moves everything to E♭ (Fm7 – B♭7alt – E♭). Transpose this one there yourself. ' + SRC(SHAPES),
  ] },

  { t: 'The altered scale, from G', s: 'what the next three cards are for', b: [
    'G altered has the same notes as A♭ melodic minor (A♭ B♭ C♭ D♭ E♭ F G), but over G7alt you spell them from G: 1, ♭9, ♯9, 3, ♭5, ♭13, ♭7. No natural 5th, no natural 9th or 13th: every tension is altered.',
    '- Add one note, E (F♭), and A♭ melodic minor becomes <b>A♭ minor 6th diminished</b>: A♭m6 (A♭ C♭ E♭ F) alternating with G°7 (G B♭ D♭ F♭)',
    '- Over G7 the A♭m6 notes are ♭9, 3, ♭13, ♭7: the G7alt grip F B E♭ A♭ simply <i>is</i> A♭m6. The G°7 notes are 1, ♯9, ♭5 and the passing 13',
    '- The handouts play both scales in contrary motion, then at two speeds (one voice in 8ths, one in quarters), then as 3 against 2',
    'Every phrase resolves G7alt to Cmaj7. ' + SRC2(BREAK, M6D),
  ], ex: [
    ['G altered from the ♭9', '=Ab3 | A#3 | B3 | Db4 | Eb4 | F4 | G4 | Ab4', 'G altered'],
    ['A♭m6 is the G7alt grip', '=F3 B3 Eb4 Ab4 | C3 B3 E4 G4', 'G7alt – Cmaj7'],
    ['A♭ minor 6th diminished: add E', '=Ab3 | A#3 | B3 | Db4 | Eb4 | E4 | F4 | G4 | Ab4'],
  ] },

  { t: 'G altered in contrary motion', s: 'from one A♭ out to two octaves', drill: D(50, 2, '8ths at 50', '8ths at 120', 'G'),
    neck: { kind: 'list', events: L('4:6:b9 3:3:#9+4:5:1 3:4:3+4:3:b7 3:6:b5+5:6:b13 2:4:b13+5:4:b5 2:6:b7+6:7:3 2:8:1+6:6:#9 1:4:b9+6:4:b9 1:6:#9 1:4:b9 1:3:1 2:6:b7 2:4:b13 3:4:3 3:3:#9 4:6:b9 5:3:1+4:5:5+3:4:7+2:5:3 ' + R3) }, b: [
    'Both voices start on the same A♭ (D string, 6th fret). The top climbs the altered scale, the bottom falls, until they’re two octaves apart on the two E strings. Then the top comes back down alone to A♭ and resolves to Cmaj7.',
    '- Pairs: A♭ · A♯/G · B/F · D♭/E♭ · E♭/D♭ · F/B · G/A♯ · A♭/A♭',
    '- Learn it slowly as double stops first; later separate the voices rhythmically',
    '- Fingers: index and ring for the inside pairs, then the lower voice moves to the 6th string on the F/B pair',
    '<b>Harder</b>: start from the ♯9 in the top voice and the ♭9 in the bottom (the handout’s last variation, with D natural added at the top). ' + SRC(BREAK),
  ] },

  { t: 'A♭ minor 6th dim in contrary', s: 'the altered scale plus E', drill: D(50, 2, '8ths at 50', '8ths at 120', 'G'),
    neck: { kind: 'list', events: L('4:6:b9 3:3:#9+4:5:1 3:4:3+4:3:b7 3:6:b5+5:7:13 2:4:b13+5:6:b13 2:5:13+5:4:b5 2:6:b7+6:7:3 2:8:1+6:6:#9 1:4:b9+6:4:b9 1:6:#9 6:3:1+3:4:3+2:4:b13+1:3:1 - - - -') }, b: [
    'The same exercise with the eight-note scale: A♭ A♯ B D♭ E♭ E F G. The extra E makes the two voices meet in an octave on E♭ halfway, and ends with a G(♭13) chord: G, B, E♭, G.',
    '- Pairs: A♭ · A♯/G · B/F · D♭/E · E♭/E♭ · E/D♭ · F/B · G/A♯ · A♭/A♭',
    '- Eight notes means the pairs alternate: one note from A♭m6, one from G°7. Hear the A♭m6 pairs as the dominant, the G°7 pairs as passing',
    '- Compare it with the previous card: the 13 (E) softens the sound; use it as a passing note, not a landing note',
    '<b>Harder</b>: play the altered scale in the top voice against this scale in the bottom: the two-speed card next. ' + SRC(BREAK),
  ] },

  { t: 'Two speeds over G7alt', s: '8ths on top, quarters below', drill: D(50, 2, '8ths at 50', '8ths at 120', 'G'),
    neck: { kind: 'list', events: L('3:3:#9+4:6:b9 3:4:3 3:6:b5+4:5:1 2:4:b13 2:6:b7+4:3:b7 1:3:1 2:9:b9+5:7:13 1:6:#9 1:7:3+5:6:b13 1:9:b5 2:9:b9+3:8:b13+4:9:3+5:8:b7 ' + R3 + ' - 2:12:7+3:9:3+4:9:7+5:10:5 ' + R3) }, b: [
    'The top voice climbs G altered in 8th notes from the ♯9 (A♯); the bottom falls through A♭ minor 6th diminished in quarters (A♭ G F E E♭). Both arrive on the G7alt grip, F B E♭ A♭, which resolves to a rootless Cmaj7 (G B E B).',
    '- The top moves twice as fast as the bottom: a complete altered phrase out of one simple idea',
    '- Play the bottom with the thumb on the beat; the top alternates i and m',
    '- Below: the handout’s one-bar version, and its last phrase, which adds D (the natural 5th, from the half-whole diminished scale) near the top',
    '<b>Harder</b>: 3 against 2. The rising voice plays three evenly spaced notes against every two falling 8ths; count it slowly with a click on the 8ths. ' + SRC2(M6D, BREAK),
  ], ex: [
    ['One bar of G7alt, to Cmaj7', '=Ab3 A#3 | B3 | G3 Db4 | Eb4 | F3 F4 | G4 | B3 D4 Bb4 | G#4 | G4 | G3 B3 E4'],
    ['With D from the half-whole scale', '=E3 Ab4 | A#4 | Eb3 B4 | Db5 | Db3 D5 | Eb5 | F3 B3 Eb4 Ab4 | C3 B3 E4 G4'],
  ] },
] };

// ---------------- Luminary: Kessel thirds and enclosures ----------------
const TE = 'Thirds and Enclosures';
const PIV = 'Pivot + Enclosure Reststroke';
const K1 = 'Barney Kessel - Thirds 1';
const KM7 = 'What a Classy Way to Play Minor 7 Chords';
const H2 = 'Handout 2-Melodic Thirds';

const kessel = { id: 'lum-kessel', name: 'Luminary: Kessel thirds and enclosures', cards: [
  { t: 'Thirds, enclosures, pivots', s: 'what the practice handouts are for', b: [
    'Three ways of breaking a scale into lines, all in C major, all in one position. Learn them as technique first; the Kessel cards later in this deck use the same skills on chords.',
    '- <b>Jumping thirds</b>: up and down the scale in 3rds (1-3, 2-4, 3-5…), started from each degree so you hear each mode',
    '- <b>Diatonic enclosures</b>: surround a target with the scale note above and the note a half step below',
    '- <b>Pivots</b> (Barry Harris): play a scale note, drop to its chord’s 3rd below, and climb the 7th chord back up',
    'Right hand: alternate i and m with rest strokes, starting with i one time and m the next; then try slurs (a pull-off, a slide) so not every note is a rest stroke. ' + SRC2(TE, PIV),
  ], ex: [
    ['Jumping thirds in C from G', '=G2 | B2 | A2 | C3 | B2 | D3 | C3 | E3'],
    ['Enclosure of C, then of D', '=D3 | C3 | B2 | C3 | E3 | D3 | Db3 | D3'],
    ['Pivot on C, then on D', '=C4 | E3 | G3 | B3 | D4 | F3 | A3 | C4'],
  ] },

  { t: 'Jumping thirds from G', s: 'C major as G Mixolydian', drill: D(60, 2, '8ths at 60', '8ths at 160', 'G'),
    neck: { kind: 'list', events: L('6:3:1 5:2:3 6:5:2 5:3:4 5:2:3 5:5:5 5:3:4 4:2:6 5:5:5 4:3:b7 4:2:6 4:5:1 4:3:b7 3:2:2 4:5:1 3:4:3 3:2:2 3:5:4 3:4:3 2:3:5 3:5:4 2:5:6 2:3:5 2:6:b7 2:5:6 1:3:1 2:6:b7 1:5:2 1:5:2 2:6:b7 1:3:1 2:5:6 2:6:b7 2:3:5 2:5:6 3:5:4 2:3:5 3:4:3 3:5:4 3:2:2 3:4:3 4:5:1 3:2:2 4:3:b7 4:5:1 4:2:6 4:3:b7 5:5:5 4:2:6 5:3:4 5:5:5 5:2:3 5:3:4 6:5:2 5:2:3 6:3:1') }, b: [
    'The C major scale from its 5th, G, in 3rds: G B, A C, B D, C E… up to F A on the top string, then back down in 3rds. Low position, frets 2–6.',
    '- Started on G, the same notes are G Mixolydian: a dominant scale. The handout then starts from A (Am7, Aeolian), B (Bø, Locrian), D (Dm7, Dorian) and E (Em7, Phrygian), each higher up the neck',
    '- Hear the second note of each pair as the destination: the 3rds outline the scale’s chords',
    '- Strict alternate strokes; don’t let the string crossings slow you',
    '<b>Harder</b>: the same from A at the 5th fret, B at the 7th, D at the 10th and E at the 12th, each as its own mode. ' + SRC(TE),
  ] },

  { t: 'Diatonic enclosures in C', s: 'above, target, half step below, target', drill: D(60, 2, '8ths at 60', '8ths at 160', 'C'),
    neck: { kind: 'list', events: L('5:5:2 6:8:1 6:7:7 6:8:1 5:7:3 5:5:2 5:4:ap 5:5:2 5:8:4 5:7:3 5:6:ap 5:7:3 4:5:5 5:8:4 5:7:3 5:8:4 4:7:6 4:5:5 4:4:ap 4:5:5 3:4:7 4:7:6 4:6:ap 4:7:6 3:5:1 3:4:7 3:3:ap 3:4:7 3:7:2 3:5:1 3:4:7 3:5:1 2:5:3 3:7:2 3:6:ap 3:7:2 2:6:4 2:5:3 2:4:ap 2:5:3 2:8:5 2:6:4 2:5:3 2:6:4 1:5:6 2:8:5 2:7:ap 2:8:5 1:7:7 1:5:6 1:4:ap 1:5:6 1:8:1 1:7:7 1:6:ap 1:7:7 1:10:2 1:8:1 1:7:7 1:8:1') }, b: [
    'Every note of C major as a target, in turn: the scale note above, the target, the note a half step below, the target. D C B C, E D D♭ D, F E E♭ E, G F E F…',
    '- Below C and F the scale already has a half step (B, E). Everywhere else the note below is chromatic (D♭, E♭, G♭, A♭, B♭)',
    '- The target lands on beats 2 and 4 of each group; the shape around it makes it sound inevitable',
    '- Rest strokes, alternating i and m; start once with i, once with m. Fifth position from the low C on the 8th fret of the 6th string',
    '<b>Harder</b>: the handout also plays it from G in 2nd position (“dominant position”) and from D at the 10th fret (“tonic position”). Find both. ' + SRC2(PIV, TE),
  ] },

  { t: 'Barry Harris pivots', s: '7th chords, the root pivoted up', drill: D(60, 2, '8ths at 60', '8ths at 150', 'C'),
    neck: { kind: 'list', events: L('3:5:1 5:7:3 4:5:5 3:4:7 3:7:2 5:8:4 4:7:6 3:5:1 2:5:3 4:5:5 3:4:7 3:7:2 2:6:4 4:7:6 3:5:1 2:5:3 2:8:5 3:4:7 3:7:2 2:6:4 1:5:6 3:5:1 2:5:3 2:8:5 1:7:7 3:7:2 2:6:4 1:5:6 1:8:1 3:9:3 2:8:5 1:7:7') }, b: [
    'For each note of C major: play it, then drop to the 3rd of its 7th chord below and climb 3rd, 5th, 7th. C – E G B (Cmaj7), D – F A C (Dm7), E – G B D (Em7), and so on up to C – E G B again.',
    '- Each group is the scale’s 7th chord with its root pivoted to the top: a big leap down, then steps of a 3rd up',
    '- The 7th of each group is a step below the next group’s first note, so the line keeps climbing',
    '- Fifth position, i–m alternating. Some pivots lie better elsewhere on the neck: try them',
    '<b>Harder</b>: descend (start from the top C and pivot down), and do it in F and B♭. ' + SRC(PIV),
  ] },

  { t: 'Pivot, enclose, resolve', s: 'both ideas on every degree', drill: D(60, 2, '8ths at 60', '8ths at 140', 'C'),
    neck: { kind: 'list', events: L(`3:5:1 5:7:3 4:5:5 3:4:7 3:7:2 3:5:1 3:4:7 3:5:1 3:9:3 ${R3} 3:7:2 5:8:4 4:7:6 3:5:1 3:9:3 3:7:2 3:6:ap 3:7:2 3:10:4 ${R3} 2:5:3 4:5:5 3:4:7 3:7:2 2:6:4 2:5:3 2:4:ap 2:5:3 2:8:5 ${R3} 2:6:4 4:7:6 3:5:1 2:5:3 2:8:5 2:6:4 2:5:3 2:6:4 2:10:6 ${R3} 2:8:5 3:4:7 3:7:2 2:6:4 1:5:6 2:8:5 2:7:ap 2:8:5 1:7:7 ${R3} 1:5:6 3:5:1 2:5:3 2:8:5 1:7:7 1:5:6 1:4:ap 1:5:6 1:8:1 ${R3} 1:7:7 3:7:2 2:6:4 1:5:6 1:8:1 1:7:7 1:6:ap 1:7:7 1:10:2 ${R3}`) }, b: [
    'One bar per degree: the pivot arpeggio (C E G B), then an enclosure of the same root (D C B C), then a half note on the root’s 3rd (E). Then the same from D (D F A C, E D D♭ D, F), and on up to B.',
    '- The pivot spells the chord, the enclosure re-targets its root, the leap of a 3rd resolves it: a complete little phrase on each chord',
    '- Mind the stretch on the G string (E and F at the 9th and 10th frets) in the first two bars',
    '- Slur some of it: on E, pull off F to E and slide E♭ to E, as the handout suggests, so rest strokes don’t flatten everything',
    '<b>Harder</b>: play it over a ii–V–I (Dm7 bar, G7 bar, Cmaj7 bar), choosing the degree that matches each chord. ' + SRC(PIV),
  ] },

  { t: 'Kessel’s thirds: the idea', s: 'chord tones in 3rds, up a m7', b: [
    'Barney Kessel’s minor 7th move: a pair of notes a 3rd apart climbs the chord’s own stack. Over Am7: A/C, C/E, E/G, G/B (1/♭3, ♭3/5, 5/♭7, ♭7/9), then the 11th on top.',
    '- It starts from the pair just below, G♯/B: the 3rd and 5th of E7, the chord that leads to Am. The same pair also sets up A/C by a half step and a whole step',
    '- At the top he holds the ♭7 and lets the upper note fall (D, C), then drops into an altered dominant grip',
    '- The handouts take this from his “Corcovado” (Am7) and show near copies in “Embraceable You” and “My Funny Valentine”; here they’re turned into exercises',
    'Over Dm7 it is C♯/E into D/F, F/A, A/C, C/E. Over C♯m7, B♯/D♯ into C♯/E… ' + SRC2(K1, KM7),
  ], ex: [
    ['Over Am7: A, then the stack', '=A2 | G#3 B3 | A3 C4 | C4 E4 | E4 G4 | G4 B4', 'Am7'],
    ['Over Dm7', '=C#3 E3 | D3 F3 | F3 A3 | A3 C4 | C4 E4', 'Dm7'],
    ['Am7 to an altered dominant, as he uses it', 'A:m7 D:7alt'],
  ] },

  { t: 'Kessel’s thirds over Am7', s: 'up the stack and back', drill: D(60, 2, '8ths at 60', '8ths at 140', 'A'),
    neck: { kind: 'list', events: L('5:0:1 4:6:7+3:4:9 4:7:1+3:5:b3 3:5:b3+2:5:5 3:9:5+2:8:b7 2:8:b7+1:7:9 3:9:5+2:8:b7+1:10:11 2:8:b7+1:8:b3 2:8:b7+1:7:9 3:9:5+2:8:b7 3:5:b3+2:5:5 4:7:1+3:5:b3') }, b: [
    'Open A in the bass, then the pairs: G♯/B, A/C, C/E, E/G, G/B, then E G D (11 on top) and G/C. Then back down the stack to A/C (the descent is for practice; the handouts go on into a dominant).',
    '- Strings: D and G for the first two pairs, G and B for the next two, B and E for the top. The shapes alternate between a major and a minor 3rd',
    '- Fingers 1 and 2, or 2 and 3, shifting; keep each pair legato into the next',
    '- Hear the line as Am7 being drawn upward, not as a scale in 3rds: the scale notes D and F♯ are left out until the top',
    '<b>Harder</b>: the same over Fm7 (E/G into F/A♭) and over C♯m7 (B♯/D♯ into C♯/E). ' + SRC2(K1, H2),
  ] },

  { t: 'Kessel thirds: ii–V–I in C', s: 'the Corcovado idea on Dm7 G7 C', drill: D(60, 2, '8ths at 60', '8ths at 140', 'C'),
    neck: { kind: 'list', events: L('- 5:4:7+4:2:9 5:5:1+4:3:b3 4:3:b3+3:2:5 4:7:5+3:5:b7 3:5:b7+2:5:9 4:7:5+3:5:b7+2:8:11 3:5:b7+2:6:b3 4:3:b7+3:2:9+2:5:13 3:2:9+2:3:5 4:3:b7+3:1:b9+2:2:b5 - - 2:5:13 5:2:3+4:3:b7+3:2:9+2:3:5 - 5:3:1+3:4:7+2:5:3 ' + R3) }, b: [
    'The handout moves the device to a ii–V–I. Dm7: C♯/E, D/F, F/A, A/C, C/E, then A C G (11 on top) and C/F. G7: F A E (13), A/D, then F A♭ D♭ (♭9 and ♭5), E, and a rootless G9 (B F A D). Cmaj7: C, B, E.',
    '- The C♯/E pickup is A7’s 3rd and 5th: Kessel’s approach pair, a half step and a whole step under D/F',
    '- On G7 the top voice goes E, D, D♭, E, D: 13, 5, ♭5, 13, 5. The middle voice goes A, A, A♭, A: 9, 9, ♭9, 9',
    '- Labels are degrees of the chord sounding at the time',
    '<b>Harder</b>: take it round the cycle: Gm7 C7 F, Cm7 F7 B♭. Then try it on the handout’s tritone-sub chain, the next card. ' + SRC(KM7),
  ] },

  { t: 'Am7 is C6: Barry Harris', s: 'Kessel’s stack into C6–diminished', drill: D(60, 2, '8ths at 60', '8ths at 120', 'C'),
    neck: { kind: 'list', events: L('4:10:1+3:12:5+2:10:6+1:12:3 4:9:7+3:10:4+2:9:#5+1:10:2 4:7:6+3:9:3+2:8:5+1:8:1 4:6:#5+3:7:2+2:6:4+1:7:7 4:5:5+3:5:1+2:5:3+1:5:6 5:8:4+4:9:7+3:7:2+2:9:#5 5:7:3+4:7:6+3:5:1+2:8:5 5:5:2+4:6:#5+3:4:7+2:6:4 5:3:1+4:5:5+3:2:6+2:5:3 ' + R3) }, b: [
    'Am7 and C6 are the same four notes (A C E G). So after Kessel’s thirds climb Am7, the handout comes down in Barry Harris’s C major 6th–diminished: C6 chords alternating with D°7 (D F G♯ B), in drop-2 voicings.',
    '- Top set (strings 4–1): C6 at the 10th–12th frets, D°7, C6, D°7, C6 at the 5th fret',
    '- Then the middle set (strings 5–2): D°7, C6, D°7, and C6 again, low',
    '- Each C6 voice moves by step to the °7 and back: every chord tone of C6 has a diminished neighbour',
    '<b>Harder</b>: play the Kessel stack over Am7 (A, G♯/B … G/B) straight into this descent, as the handout does: one bar of each. ' + SRC(H2),
  ] },

  { t: 'Stack, then spread triads down', s: 'three-note inversions on Cmaj7', drill: D(60, 2, '8ths at 60', '8ths at 120', 'C'),
    neck: { kind: 'list', events: L('5:0:6 4:6:#5+3:4:7 4:7:6+3:5:1 3:5:1+2:5:3 3:9:3+2:8:5 2:8:5+1:7:7 3:9:3+2:8:5+1:10:9 2:8:5+1:8:1 4:9:7+2:8:5+1:10:9 - 4:5:5+2:5:3+1:7:7 - 5:7:3+3:5:1+2:8:5 - 5:3:1+3:2:6+2:5:3 - 4:5:5+2:5:3+1:7:7 ' + R3) }, b: [
    'Up Kessel’s Am7 stack, then down in spread three-note triads a 3rd apart over Cmaj7: G (B G D), Em (G E B), C (E C G), Am (C A E), ending on G E B. The handout labels them “Froggy’s 3-finger inversions”.',
    '- Every triad is spread the same way: 3rd in the bass, root in the middle, 5th on top, with a string skipped',
    '- Their top notes, D B G E, walk back down the very stack you just climbed',
    '- Fingerstyle: p i m on the three strings. With a pick, hybrid-pick the top two',
    '<b>Harder</b>: the handout also comes down in drop-2 C major chords (F E D C on top). Write and play that version. Labels here are degrees of C. ' + SRC(H2),
  ] },

  { t: 'Kessel thirds into contrary', s: 'the stack opens into two voices', drill: D(60, 2, '8ths at 60', '8ths at 120', 'C'),
    neck: { kind: 'list', events: L('4:6:#5+3:4:7 4:7:6+3:5:1 3:5:1+2:5:3 3:9:3+2:8:5 4:12:2+2:9:#5 4:10:1+2:10:6 4:9:7+2:12:7 5:12:6+2:13:1 5:11:#5+1:10:2 5:10:5+1:12:3 ' + R3) }, b: [
    'G♯/B, A/C, C/E, E/G: Kessel’s 3rds climbing. Then the voices split: the top keeps rising (G♯ A B C D E), the bottom falls (D C B A G♯ G), in C6–diminished, to G/E.',
    '- Pairs after the split: D/G♯, C/A, B/B, A/C, G♯/D, G/E. They alternate D°7, C6, D°7, C6…',
    '- The bottom voice moves from the D string to the A string at the 12th fret; keep the top on the B and E strings',
    '- Labels are degrees of C (G♯ is the ♯5, the diminished note)',
    '<b>Harder</b>: start the split one pair later (from G/B), and end on A/C instead of G/E. ' + SRC(H2),
  ] },

  { t: 'Kessel’s tritone-sub chain', s: 'iii – subV/ii – ii – subV – I', b: [
    'The handouts’ last example is a Kessel phrase from “My Funny Valentine” (not written out here): in A♭, Cm7 – B9 – B♭m7 – A9 – A♭maj7, where each 9 chord is a tritone substitute.',
    '- iii7 to ii7 by way of B9 (in place of F7), ii7 to I by way of A9 (in place of E♭7): every chord a half step below the last',
    '- On each m7 he runs the 3rds stack from its approach pair (B/D into C/E♭ on Cm7; A/C into B♭/D♭ on B♭m7)',
    '- On each 9 chord the pairs come back down that chord’s own stack (on A9: G/B, E/G, C♯/E, A/C♯), so the line rises on the minor chords and falls on the dominants',
    'Work it out yourself over the chords below, slowly, with the stack on each minor chord. The “Embraceable You” phrase in the handout is almost the same shape as the Am7 one. ' + SRC(KM7),
  ], ex: [
    ['The chain in A♭', 'C:m7 B:9 Bb:m7 A:9 Ab:maj7'],
    ['Without the subs', 'C:m7 F:7 Bb:m7 Eb:7 Ab:maj7'],
    ['The stack’s first pairs on Cm7 and B♭m7', '=B3 D4 | C4 Eb4 | A3 C4 | Bb3 Db4'],
  ] },
] };

export const DECKS = [altered, kessel];

// ---------------- replacements for the existing Nocturne cards (src/simple/cards.js) ----------------
const NOC = 'Chopin’s Nocturne - Barry Harris + Barney Kessel';
export const NOCTURNE_FIXES = [
  { replaces: 'E 6th-diminished in contrary motion', card:
    { t: 'E 6th-diminished in contrary motion', s: 'from G♯/B outwards', drill: D(50, 1, 'quarters at 50', '8ths at 100', 'E'),
      neck: { kind: 'list', events: L('4:6:3+3:4:5 4:4:2+3:5:b6 5:7:1+3:6:6 5:6:7+2:4:7 5:4:6+2:5:1 6:8:b6+2:7:2 6:7:5+2:9:3 6:5:4+1:5:4 6:4:3+1:7:5 6:5:4+1:5:4 6:7:5+2:9:3 6:8:b6+2:7:2 5:4:6+2:5:1 5:6:7+2:4:7 5:7:1+3:6:6 4:4:2+3:5:b6 4:6:3+3:4:5') }, b: [
      'Start on the 3rd, G♯/B, with both notes in E6. The top climbs the 6th-diminished scale from B, the bottom falls from G♯, until they’re G♯ and B two octaves apart; then back in.',
      '- Pairs: G♯/B · F♯/C · E/C♯ · D♯/D♯ · C♯/E · C/F♯ · B/G♯ · A/A · G♯/B. E6 and D♯°7 alternate: home, tension, home',
      '- The lower voice moves D string, A string, low E; the upper G string, B string, top E',
      '- Thumb on the lower voice, a finger on the upper. The arrangement uses the first half of this straight after the E chord',
      '<b>Harder</b>: from a unison E out to two octaves (E/E, D♯/F♯, C♯/G♯…), then from B/B. ' + SRC(NOC),
    ] } },
  { replaces: 'Kessel’s thirds over F♯m7', card:
    { t: 'Kessel’s thirds over Am7', s: 'the minor iv, the handout’s way', drill: D(60, 2, '8ths at 60', '8ths at 140', 'E'),
      neck: { kind: 'list', events: L('4:6:7+3:4:9 4:7:1+3:5:b3 3:5:b3+2:5:5 3:9:5+2:8:b7 2:8:b7+1:7:9 2:8:b7+1:10:11 2:8:b7+1:8:b3 4:4:F#+3:5:C+2:4:D#+1:7:B 1:5:A 4:6:G#+3:4:B+2:5:E+1:4:G# ' + R3) }, b: [
      'The handout puts Kessel’s melodic 3rds on <b>Am7</b>, the minor iv of E, and later on C♯m7, not on F♯m7. The pairs climb Am7’s own stack: G♯/B (E’s 3rd and 5th, the approach), A/C, C/E, E/G, G/B.',
      '- Then hold G and let the top fall: D, C (written B♯), into an F♯–C–D♯–B grip (the F♯°7 of the arrangement), A, and E major',
      '- Strings: D–G, G–B, then B–E; the pairs alternate major and minor 3rds',
      '- The G natural is the ♭3 of E: the darker colour of the minor iv. Labels on the stack are Am7 degrees; the landing is named by note',
      '<b>Harder</b>: the same over C♯m7 (bar 14 of the arrangement): B♯/D♯ into C♯/E, E/G♯, G♯/B, B/D♯, then down into B7. ' + SRC(NOC),
    ] } },
  { replaces: 'Turn it into music, in 4/4', card:
    { t: 'Turn it into music, in 4/4', s: 'the handout’s own arrangement plan', comp: { chart: 'E:maj | A:m7 F#:dim7 | E:maj | C#:7 | G#:dim7 F#:m7 B:13 C:dim7 | C#:m7 | B:7 | E:maj', bpm: 72 }, b: [
      'The handout’s variation on the Nocturne gives each chord one idea:',
      '- <b>E</b>: E 6th-diminished 3rds over an open E bass; later the E chord then contrary motion out from G♯/B',
      '- <b>Am7</b> (minor iv): Kessel’s 3rds up the stack, then the falling top line over the F♯°7 grip',
      '- <b>C♯7</b>: a Django-style phrase: a C♯7(♭13) grip, then chromatic notes circling C♯',
      '- <b>G♯°7 – F♯m7 – B7(13) – C°7</b>: one beat each, bass and top note, then an inner 3rd; <b>C♯m7</b>: Kessel’s 3rds again, falling into <b>B7</b> and home to <b>E</b>',
      'Play it at a walking pace, then swap ideas between chords. ' + SRC(NOC),
    ] } },
];
