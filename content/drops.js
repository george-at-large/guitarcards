// Drop voicings & inversions: the concept made crystal clear, then drills with on-neck feedback.
const CONCEPT = `### Close, drop 2, drop 3 — what’s the difference?
Every 7th chord has four notes: **1 3 5 7**. The *voicing* is the order you stack them in from low to high.

| Voicing | How it’s built | What it looks like on guitar | Root position, low → high |
|---|---|---|---|
| **Close** | stack the four notes as tightly as possible, inside one octave | needs big stretches — rarely used for 7ths on guitar | 1 3 5 7 |
| **Drop 2** | take a close voicing, drop the **2nd note from the top** down an octave | **four adjacent strings**, no gaps | 1 5 7 3 |
| **Drop 3** | take a close voicing, drop the **3rd note from the top** down an octave | **bass note, skip a string, three adjacent strings** | 1 7 3 5 |
| **Drop 2 & 4** | drop the 2nd and 4th notes from the top | **two strings, skip, two strings** | 1 5 3 7 (wide, piano-like) |

**How to tell them apart on the neck:** look at the strings. Four strings in a row → drop 2. A gap right above the bass note → drop 3. A gap in the middle → drop 2 & 4.

### Inversions = which note is in the bass
- **Root position:** the root is the lowest note.
- **1st inversion:** the 3rd is in the bass.
- **2nd inversion:** the 5th is in the bass.
- **3rd inversion:** the 7th is in the bass.

The name always refers to the **bass note after the drop**. Going up a string set, the four inversions come in that order (root → 3rd → 5th → 7th in the bass) — each voice simply moves up to the next chord tone — and after four shapes you’re back at root position an octave higher.

### Which to use when
- **Drop 2** on the middle or top four strings: the standard comping sound (Wes Montgomery, Joe Pass) — compact, smooth to voice-lead.
- **Drop 3** with the bass on the 6th or 5th string: a real bass note under the chord — solo guitar, walking-bass comping, chord melody.
- **Drop 2 & 4**: wide, open, piano-like — ballads and pads.

### How these drills work
You get a chord, a voicing, an inversion and a string set. Find it, play it, then **tap it on the neck**: the app tells you if it’s right and shows the correct shape.`;
const SETS_LABEL = { drop2: 'drop 2', drop3: 'drop 3' };
export const templates = [
  {
    id: 'drops-concept', mode: 'theory', category: 'theory', tags: ['drop2', 'drop3', 'inversions', 'voicings', 'concept'],
    title: 'Close vs drop 2 vs drop 3: tell them apart', level: 2, length: 'short',
    prompt: 'Read the help (💡) once, then answer. Which voicing has a bass note, then a skipped string, then three adjacent strings?',
    quiz: { kind: 'choice', question: 'Bass note, then a skipped string, then three adjacent strings — which voicing is that?', choices: ['Drop 3', 'Drop 2', 'Close', 'Drop 2 & 4'], answer: 0, explain: 'Drop 3: dropping the 3rd note from the top an octave leaves a gap between the bass and the other three notes. Drop 2 sits on four adjacent strings; drop 2 & 4 has a gap in the middle.' },
    explain: CONCEPT, concepts: ['drop2'],
    visual: { type: 'voicings', root: 'C', quality: 'maj7', voicing: 'drop3', stringSet: [6, 4, 3, 2], inversion: 0 },
  },
  {
    id: 'drops-concept-inversion', mode: 'theory', category: 'theory', tags: ['drop2', 'inversions', 'voicings', 'concept'],
    title: 'Which inversion is it?', level: 2, length: 'short',
    prompt: 'A drop-2 Cmaj7 has E in the bass. Which inversion is that?',
    quiz: { kind: 'choice', question: 'Drop-2 Cmaj7 with **E** in the bass is…', choices: ['1st inversion', 'Root position', '2nd inversion', '3rd inversion'], answer: 0, explain: 'The inversion is named by the bass note: E is the 3rd of C, so it’s 1st inversion (root = root position, 3rd = 1st, 5th = 2nd, 7th = 3rd).' },
    explain: CONCEPT,
  },
  {
    id: 'drops-tap', mode: 'play', category: 'voicings', tags: ['drop2', 'drop3', 'inversions', 'drill', 'fretboard'],
    title: 'Find it: {chord} {p:voicing}', level: 3, length: 'short',
    params: {
      key: 'major',
      quality: [{ v: 'maj7' }, { v: 'm7' }, { v: '7' }, { v: 'm7b5', lvl: 1 }, { v: 'dim7', lvl: 1.5 }, { v: 'mMaj7', lvl: 2 }, { v: '6', lvl: 2 }, { v: 'm6', lvl: 2.5 }],
      voicing: [{ v: 'drop2', label: 'drop 2' }, { v: 'drop3', label: 'drop 3', lvl: 1 }],
    },
    prompt: 'Find the voicing on your guitar and play it, then tap the notes on the neck below and press Check.',
    quiz: { kind: 'voicing-tap', voicing: '$voicing', quality: '$quality' },
    explain: CONCEPT, concepts: ['drop2'],
    hints: ['Root position drop 2 = 1 5 7 3 from low to high; drop 3 = 1 7 3 5.', 'Each inversion moves every voice up to the next chord tone.'],
    vary: ['quality', 'voicing', 'key'],
  },
  {
    id: 'drops-tap-triads', mode: 'play', category: 'voicings', tags: ['triads', 'inversions', 'drill', 'fretboard'],
    title: 'Find it: {chord} triad, {p:voicing}', level: 2, length: 'short',
    params: { key: 'major', quality: [{ v: 'maj' }, { v: 'min' }, { v: 'dim', lvl: 1 }, { v: 'aug', lvl: 1.5 }], voicing: [{ v: 'close', label: 'close' }, { v: 'spread', label: 'spread', lvl: 1 }] },
    prompt: 'Find the triad on your guitar and play it, then tap it on the neck and press Check.',
    quiz: { kind: 'voicing-tap', voicing: '$voicing', quality: '$quality' },
    explain: 'Close triads sit on three adjacent strings; spread triads put the middle note an octave down, skipping a string. Inversions are named by the bass note: root, 3rd (1st inversion) or 5th (2nd inversion).',
    vary: ['quality', 'voicing', 'key'],
  },
  {
    id: 'drops-all-inversions-map', mode: 'play', category: 'voicings', tags: ['drop2', 'inversions', 'drill', 'whole-neck'],
    title: 'Play every {p:voicing} inversion of {chord}, then check the map', level: 4, length: 'medium', minutes: 4,
    params: {
      key: 'major',
      quality: [{ v: 'maj7' }, { v: 'm7' }, { v: '7' }, { v: 'm7b5', lvl: 1 }],
      voicing: [{ v: 'drop2', label: 'drop 2' }, { v: 'drop3', label: 'drop 3', lvl: 1 }],
    },
    prompt: 'Without looking: play **all four inversions** of **{chord}** as {p:voicing} on **every** string set it uses, climbing the neck. Say the bass note of each. Then reveal the map and check every shape.',
    quiz: { kind: 'voicing-map', question: 'Play all four inversions of {chord} ({p:voicing}) on every string set, then reveal.', spec: { type: 'voicings', root: '$key', quality: '$quality', voicing: '$voicing', stringSet: 'auto', stringSetAll: true, inversion: 'all' } },
    explain: CONCEPT,
    tempo: { start: 60, min: 40, max: 200, step: 4 }, metronome: { meter: '4/4' },
    vary: ['quality', 'voicing', 'key'],
  },
];
export const concepts = [];
