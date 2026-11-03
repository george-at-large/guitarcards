// Robbie Barnby's three-octave arpeggio workout (after his YouTube "arpeggio exercise I do every day").
// One skeleton shape from the low-E root, three octaves up and back, every essential quality, all 12 keys.
const CYCLE = ['C', 'F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'B', 'E', 'A', 'D', 'G'];
export const RB_QUALITIES = [
  { v: 'maj7', label: 'major 7', tip: 'Index finger sets up each new position; the big jump lands on the 7th with the ring finger.' },
  { v: 'm7', label: 'minor 7', tip: 'Same shapes as major 7, notes adjusted. Land the jump on the ♭7 with the middle finger (it’s now two frets from the root).' },
  { v: 'mMaj7', label: 'minor-major 7', lvl: 1, tip: 'The low area gets cramped — leave the pinky out until the third octave.' },
  { v: 'maj7#5', label: 'major 7 ♯5', lvl: 1, tip: 'The 3rd→♯5 gap is wider: take the ♯5 with the pinky, then jump to the 7th with the middle finger.' },
  { v: 'm7b5', label: 'minor 7 ♭5', lvl: 1, tip: 'Keep the same skeleton; only the 5th drops.' },
  { v: '7', label: 'dominant 7', tip: 'Major-7 skeleton with the 7th lowered a fret.' },
  { v: '7b5', label: 'dominant 7 ♭5', lvl: 1, tip: 'Great for whole-tone sounds and for a dominant ♯11.' },
  { v: '7#5', label: 'dominant 7 ♯5', lvl: 1, tip: 'Augmented dominant: the ♯5 leans up into the next chord.' },
  { v: '7sus4', label: 'dominant 7 sus4', lvl: 1, tip: 'No 3rd — it has a pentatonic sound.' },
  { v: '7sus4b5', label: 'dominant 7 sus4 ♭5', lvl: 2, tip: 'Sus4 with a ♭5: a sophisticated, minor-bluesy colour.' },
  { v: 'dim-maj7', label: 'diminished major 7', lvl: 2, tip: 'Bigger jump from ♭5 to 7. Near the top use the middle finger for the last ♭5 so the index has time to move.' },
  { v: 'dim7', label: 'diminished 7', lvl: 1, tip: 'Fully symmetrical: the shape repeats every 3 frets.' },
];
const TIPS = RB_QUALITIES.map((q) => `- **${q.label}:** ${q.tip}`).join('\n');
const EXPLAIN = `### The exercise (Robbie Barnby)
A **three-octave arpeggio** from the lowest root on the 6th string, up and back down. The same skeleton shape is used for every chord quality — only the notes inside it change — so learning one quality makes the next one easy.

### Fingering
Focus on the **position changes**: use the **index finger to set up each new position**, and practise the **jump that lands on the 7th** until it feels obvious. Find what works for your hand — these are his preferences:
${TIPS}

### Then all 12 keys
Take each quality round the **cycle of fourths** (C, F, B♭, E♭, A♭, D♭, G♭, B, E, A, D, G): the fingering and positions stay identical, the shape just moves.

### Why a long exercise
It trains **concentration, consistency and stamina** as well as technique — every note has to sound good for a long time. Combine it with metronome tricks (gap click, click on 2 & 4, slow → fast) to work on several things at once.`;

export const templates = [
  {
    id: 'rb-3oct', mode: 'play', category: 'arpeggios', tags: ['arpeggios', 'barnby', 'three-octave', 'technique', 'stamina'],
    title: 'Three-octave {p:quality} arpeggio: {chord}',
    level: 4, length: 'short', minutes: 2,
    params: { key: 'major', quality: RB_QUALITIES.map(({ tip, ...q }) => q) },
    prompt: 'Play the **{chord}** arpeggio over **three octaves** from the lowest root on the 6th string, ascending and descending, slowly and evenly. Watch the position shifts.',
    goal: 'Every note even and clean; the position shifts are smooth, not lunges.',
    tempo: { start: 60, min: 30, max: 200, step: 4 }, metronome: { meter: '4/4', subdivision: 2 },
    hints: ['The index finger sets up each new position.', 'Practise the big jump to the 7th on its own a few times first.'],
    explain: EXPLAIN,
    visual: { type: 'arpeggio', root: '$key', quality: '$quality', region: { octaves: 3 } },
    demo: { type: 'arpeggio', root: '$key', quality: '$quality', region: { octaves: 3 }, path: 'up-and-down', beatsPerNote: 0.5 },
    vary: ['key', 'quality', 'tempo'], source: 'Robbie Barnby, arpeggio exercise video (YouTube)',
  },
  {
    id: 'rb-cycle', mode: 'play', category: 'arpeggios', tags: ['arpeggios', 'barnby', 'three-octave', 'cycle-of-fourths', 'all-keys', 'stamina'],
    title: '{p:quality} — three octaves through all 12 keys',
    level: 5, length: 'long', minutes: 8,
    params: { quality: RB_QUALITIES.map(({ tip, ...q }) => q) },
    prompt: 'Three-octave **{p:quality}** arpeggio, up and back, in **C, then F, B♭, E♭, A♭, D♭, G♭, B, E, A, D, G** (up a 4th each time). Same fingering in every key — the shape just moves. Don’t stop between keys.',
    goal: 'All 12 keys without stopping, every note sounding.',
    tempo: { start: 60, min: 30, max: 200, step: 4 }, metronome: { meter: '4/4', subdivision: 2 },
    hints: ['Some keys go high up the neck (above fret 17) — play what your guitar allows, or drop the top octave there.', 'Index sets up each position; land the jump on the 7th.'],
    explain: EXPLAIN,
    visual: { type: 'arpeggio', root: 'C', quality: '$quality', region: { octaves: 3 } },
    demo: CYCLE.map((k) => ({ type: 'arpeggio', root: k, quality: '$quality', region: { octaves: 3 }, path: 'up-and-down', beatsPerNote: 0.5, title: `${k.replace('b', '♭')}` })),
    vary: ['quality', 'tempo'], source: 'Robbie Barnby, arpeggio exercise video (YouTube)',
  },
  {
    id: 'rb-other-sounds', mode: 'theory', category: 'theory', tags: ['arpeggios', 'barnby', 'substitution', 'upper-structures'],
    title: 'Same shape, other sounds: arpeggio substitutions',
    level: 5, length: 'short',
    prompt: 'Each arpeggio shape also spells other chords when you put a different root under it. Think about each one, then reveal.',
    quiz: { kind: 'reveal', question: 'Over which other chords can you use: **Cmaj7**, **Cm7**, **Cmaj7♯5**, **Cm7♭5**, **C°(maj7)**?', answer: '- **Cmaj7** (C E G B) = **Am9** without its root: ♭3 5 ♭7 9.\n- **Cm7** (C E♭ G B♭) = **A♭maj9** (3 5 7 9) and **E♭6**.\n- **Cmaj7♯5** (C E G♯ B) = **Am(maj9)** (♭3 5 7 9).\n- **Cm7♭5** (C E♭ G♭ B♭) = **A♭9** (3 5 ♭7 9) and **E♭m6**.\n- **C°(maj7)** (C E♭ G♭ B) = **D13♭9** without its root (♭7 ♭9 3 13) — and also F13♭9, A♭13♭9 and B13♭9 (the dominants a minor 3rd apart). The plain **C°7** works for the same family of dominants.' },
    explain: 'An arpeggio is just a set of notes; the chord underneath decides which intervals they are. Playing a 7th-chord arpeggio from the 3rd of a chord (e.g. Cmaj7 over A minor) gives you the 9th for free — an easy way into extensions.',
    source: 'Robbie Barnby, arpeggio exercise video (YouTube)',
  },
  {
    id: 'rb-chromatic', mode: 'play', category: 'arpeggios', tags: ['arpeggios', 'barnby', 'three-octave', 'chromatic'],
    title: 'Chromatic arpeggio ladder: {p:quality} from E',
    level: 6, length: 'medium', minutes: 5,
    params: { quality: [{ v: 'maj7', label: 'major 7' }, { v: 'm7', label: 'minor 7' }, { v: '7', label: 'dominant 7' }, { v: 'm7b5', label: 'minor 7 ♭5', lvl: 1 }] },
    prompt: 'One quality, moving chromatically: start on the lowest option, **E**, and ascend the three-octave **{p:quality}** arpeggio; descend in **F** (a half step up); ascend in **F♯**; descend in **G**… keep going as far up as you can.',
    goal: 'Switch keys at the top and bottom without a pause.',
    tempo: { start: 56, min: 30, max: 200, step: 4 }, metronome: { meter: '4/4', subdivision: 2 },
    hints: ['For major 7: at the top, instead of jumping to the 7th, jump to the root — it is the 7th of the next key up.', 'The turnaround is where it goes wrong: slow it right down there.'],
    explain: EXPLAIN,
    visual: { type: 'arpeggio', root: 'E', quality: '$quality', region: { octaves: 3 } },
    demo: [['E', 'ascending'], ['F', 'descending'], ['F#', 'ascending'], ['G', 'descending'], ['Ab', 'ascending'], ['A', 'descending']].map(([r, path]) => ({ type: 'arpeggio', root: r, quality: '$quality', region: { octaves: 3 }, path, beatsPerNote: 0.5, title: `${r.replace('b', '♭').replace('#', '♯')} ${path === 'ascending' ? 'up' : 'down'}` })),
    vary: ['quality', 'tempo'], source: 'Robbie Barnby, arpeggio exercise video (YouTube)',
  },
];
export const concepts = [];
