// Melodies by degree: learn the interval structure of well-known (public-domain) melodies as scale degrees from the 1, and sing them.
// Degrees are major-relative (minor tunes spell b3/b6/b7). Intervals are computed from the notes, never typed by hand.
const M = [
  ['twinkle', 'Twinkle Twinkle Little Star', 1, 'major', '1 1 5 5 | 6 6 5 - | 4 4 3 3 | 2 2 1 - |', 'The first leap is a perfect 5th up; after that it walks down by step.'],
  ['mary', 'Mary Had a Little Lamb', 1, 'major', '3 2 1 2 | 3 3 3 - | 2 2 2 - | 3 5 5 - |', 'Almost all steps (major 2nds) — then a minor 3rd up at the end.'],
  ['ode', 'Ode to Joy (Beethoven)', 1, 'major', '3 3 4 5 | 5 4 3 2 | 1 1 2 3 | 3 -_ 2_ 2 - |', 'Stepwise motion only: a great tune for major vs minor 2nds (3→4 is a half step).'],
  ['frere', 'Frère Jacques', 1, 'major', '1 2 3 1 | 1 2 3 1 | 3 4 5 - | 3 4 5 - |', 'Up a 2nd, 2nd, then down a major 3rd back to 1.'],
  ['row', 'Row, Row, Row Your Boat', 2, 'major', '1 1 1 2 | 3 - 3 2 | 3 4 5 - | 1\' 1\' 1\' 5 | 5 5 3 3 | 3 1 1 1 | 5 4 3 2 | 1 - - - |', '“Merrily” drops down the major triad: octave → 5 → 3 → 1.'],
  ['london', 'London Bridge', 2, 'major', '5 6 5 4 | 3 4 5 - | 2 3 4 - | 3 4 5 - |', 'Neighbour-note shapes around the 5th.'],
  ['jingle', 'Jingle Bells (chorus)', 2, 'major', '3 3 3 - | 3 3 3 - | 3 5 1 2 | 3 - - - |', '“Jingle all the way”: up a minor 3rd, then down a perfect 5th.'],
  ['saints', 'When the Saints Go Marching In', 2, 'major', '1 3 4 | 5 - - - | . 1 3 4 | 5 - - - | . 1 3 4 | 5 - 3 - | 1 - 3 - | 2 - - - |', 'Starts with a major 3rd up, then steps to the 5th.'],
  ['yankee', 'Yankee Doodle', 2, 'major', '1 1 2 3 | 1 3 2 5, | 1 1 2 3 | 1 - 7, - |', 'A perfect 4th down (2 → 5,) and the leading tone (7) under the root.'],
  ['susanna', 'Oh! Susanna (Stephen Foster)', 3, 'major', '1 2 | 3 5 5 6 | 5 3 1 2 | 3 3 2 1 | 2 - - |', 'A minor 3rd up (3→5), then down the major triad 5→3→1.'],
  ['birthday', 'Happy Birthday', 3, 'major', "5,_ 5,_ | 6, 5, 1 | 7, - 5,_ 5,_ | 6, 5, 2 | 1 - 5,_ 5,_ | 5 3 1 | 7, 6, 4_ 4_ | 3 1 2 | 1 - - |", 'The big one: a whole octave up from the low 5 (“happy BIRTH-day dear…”).'],
  ['amazing', 'Amazing Grace', 3, 'major', '5, | 1 - 3_ 1_ | 3 - 2 | 1 - 6, | 5, - 5, | 1 - 3_ 1_ | 3 - 2 | 5 - - |', 'Opens with a perfect 4th up (5, → 1), then the major 3rd.'],
  ['auld', 'Auld Lang Syne', 3, 'major', "5, | 1 -_ 1_ 1 3 | 2 -_ 1_ 2 3 | 1 -_ 1_ 3 5 | 6 - - 6 | 5 -_ 3_ 3 1 | 2 -_ 1_ 2 3 | 1 -_ 6,_ 6, 5, | 1 - - |", 'Perfect 4th up to start; built on the major pentatonic.'],
  ['swinglow', 'Swing Low, Sweet Chariot', 3, 'major', "3 1 - 3 | 1 -_ 1_ 6,_ 5, -_ |", 'Starts with a major 3rd DOWN (3 → 1).'],
  ['minuet', 'Minuet in G (Petzold, “Bach”)', 3, 'major', "5 1_ 2_ 3_ 4_ | 5 1 1 | 6 4_ 5_ 6_ 7_ | 1' 1 1 |", 'Perfect 4th down to start, a scale run up, then octave drops.'],
  ['brahms', 'Brahms’ Lullaby', 4, 'major', "3 3 | 5 - 3 3 | 5 - 3 5 | 1' 7 6 6 | 5 - 2 3 | 4 - 2 3 | 4 - 2 4 | 7 6 5 7 | 1' - - |", 'Minor 3rds (3→5) and a perfect 4th up to the top (5 → 1\').'],
  ['silent', 'Silent Night', 4, 'major', "5 -_ 6_ 5 | 3 - - | 5 -_ 6_ 5 | 3 - - | 2' - 2' | 7 - - | 1' - 1' | 5 - - |", 'A major 3rd down (5→3), then a perfect 5th up (5 → 2\').'],
  ['scarborough', 'Scarborough Fair (Dorian)', 5, 'dorian', '1 - 1 | 5 5 5 | 2 -_ b3_ 2 | 1 - - |', 'A perfect 5th up, then Dorian’s minor colour (♭3) and back down.'],
  ['beethoven5', 'Beethoven’s 5th — the motif', 3, 'aeolian', '5 5 5 | b3 - - - | 4 4 4 | 2 - - - |', 'Three repeated notes then a major 3rd DOWN (5 → ♭3), then the same a step lower.'],
  ['furelise', 'Für Elise — opening', 4, 'aeolian', '5 #4 5 #4 | 5 2 4 b3 | 1 - - - |', 'Half-step trills (5 ↔ ♯4), then a perfect 4th down and down the minor triad.'],
  ['mountainking', 'In the Hall of the Mountain King (Grieg)', 5, 'aeolian', '1_ 2_ b3_ 4_ 5_ b3_ 5 | #4_ 2_ #4 4_ 2_ 4 |', 'Natural-minor steps, then chromatic shifts (♯4, 4) — sing it slowly first.'],
];
const MODE = { major: 'major', dorian: 'minor', aeolian: 'minor' };
export const templates = M.map(([id, name, level, scale, melody, tip]) => ({
  id: `mel-${id}`, mode: 'ear', category: 'ear-melody', tags: ['melody', 'intervals', 'singing', MODE[scale]],
  title: `Melody: ${name} — ${MODE[scale]}`, level, length: 'short', minutes: 3,
  prompt: `**${name}** is in a **${MODE[scale]}** key. Here is its shape as scale degrees from the 1. Play it, tap notes to hear each one against the 1, then **sing it with the numbers** (“5 5 6 5 1 7…”).`,
  goal: 'Sing the melody from any 1, naming each note’s degree.',
  hints: [tip, 'Hum the 1 first and keep it in your ear — every number is a distance from it.'],
  explain: `### Why learn melodies as degrees\nHearing every note as a distance from the **1** (the tonic) is how you hear harmony: a 3 sounds sweet, a 4 wants to fall, a 7 leans up. Know a tune as degrees and you can sing or play it in **any key**, and you will start hearing other tunes the same way.\n\n${tip}`,
  quiz: { kind: 'melody-intervals', name, melody, scale },
}));
export const concepts = [];
