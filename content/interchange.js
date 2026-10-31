// Modal-interchange palette drills: play every chord of a parallel mode, then use them against the major key.
// Help panels for these cards add an engine-generated table: each chord's function, the major-key chord it
// replaces, and exactly which notes changed.
const MODES = [
  { v: 'aeolian', label: 'Aeolian (natural minor)' },
  { v: 'harmonic-minor', label: 'harmonic minor' },
  { v: 'melodic-minor', label: 'melodic minor' },
  { v: 'dorian', label: 'Dorian', lvl: 2 },
  { v: 'mixolydian', label: 'Mixolydian', lvl: 3 },
];
const EXPLAIN = `### Modal interchange in one sentence
Keep the **same tonic**, but borrow chords from a **parallel mode** (same root, different scale). C major can borrow from C Aeolian, C Dorian, C Mixolydian, C Phrygian, C harmonic minor…

### How to relate it back to the diatonic lesson
Play the major-key chord on each degree first, then the borrowed version. The table in Help shows, for every degree, **which notes changed** and **what job the chord does**. The roman numerals are always measured against the *major* scale, so a borrowed chord carries its accidentals: ♭III, iv, ♭VI, ♭VII.

### The usual suspects
- **iv** (from Aeolian, Phrygian or harmonic minor; Dorian's IV stays major): IV → iv → I, the ♭6 sighing down to 5.
- **♭VI** and **♭VII** (Aeolian): ♭VI–♭VII–I, and V → ♭VI as a deceptive cadence.
- **♭VII7** (backdoor dominant, Aeolian), **iiø7** (darker predominant, Aeolian/Phrygian), **♭II** (Phrygian; the Neapolitan), **II7** (Lydian lift).`;

export const templates = [
  {
    id: 'mi-palette-7ths', mode: 'play', category: 'voicings', tags: ['modal-interchange', 'chord-scale', 'drop2', 'borrowed-chords', 'parallel-modes'],
    title: 'Borrowing palette: every 7th chord of {root} {p:mode}',
    level: 4, length: 'medium', minutes: 4,
    params: { key: 'major', mode: MODES, stringSet: [[4, 3, 2, 1], [5, 4, 3, 2]] },
    prompt: 'You are in **{key}**. Play every diatonic 7th chord of the parallel mode **{root} {p:mode}** in drop 2 on strings {stringSet}, up the neck. Say each roman numeral *relative to {key}* (e.g. ♭VI, iv) as you play it.\n\nThen alternate each borrowed chord with the major-key chord on the same degree, and finish each pair on **{rn:I:maj7}**.',
    goal: 'For every chord you can say its numeral, which note(s) changed from {key}, and what it does.',
    tempo: { start: 60, min: 40, max: 120, step: 5 }, metronome: { meter: '4/4' },
    hints: ['Find the I chord first — same root as {key}, but in {p:mode} its quality may change.', 'Only the notes the mode changes move: everything else is the same fingering as the major-key chord scale.', 'Open Help for the table of functions and changed notes.'],
    explain: EXPLAIN,
    visual: { type: 'chordScale', root: '$key', scale: '$mode', size: 4, voicing: 'drop2', stringSet: '$stringSet', inversion: 0, title: 'Step 1: the parallel-mode chord scale (numerals relative to the major key). Step 2, the pairs with the major-key chords, is yours.' },
    vary: ['mode', 'key', 'stringSet'], concepts: ['modal-interchange', 'parallel-vs-derived-modes', 'mode-brightness', 'diatonic-harmony'],
  },
  {
    id: 'mi-palette-triads', mode: 'play', category: 'voicings', tags: ['modal-interchange', 'chord-scale', 'triads', 'borrowed-chords', 'parallel-modes'],
    title: 'Borrowing palette: triads of {root} {p:mode} on {stringSet}',
    level: 3, length: 'short', minutes: 2,
    params: { key: 'major', mode: MODES.slice(0, 6), stringSet: [[3, 2, 1], [4, 3, 2]] },
    prompt: 'In **{key}**, play the triads of **{root} {p:mode}** in root position on strings {stringSet}, up the neck, naming each against {key} (I, ♭III, iv…).',
    goal: 'Name every triad’s numeral and quality before you play it.',
    tempo: { start: 66, min: 40, max: 140, step: 5 }, metronome: { meter: '4/4' },
    hints: ['Same root as the major key — only the mode’s altered degrees change.', 'Help shows which chords stayed the same as in {key}.'],
    explain: EXPLAIN,
    visual: { type: 'chordScale', root: '$key', scale: '$mode', size: 3, voicing: 'close', stringSet: '$stringSet', inversion: 0 },
    vary: ['mode', 'key'], concepts: ['modal-interchange', 'parallel-vs-derived-modes'],
  },
  {
    id: 'mi-borrow-one', mode: 'play', category: 'progressions', tags: ['modal-interchange', 'borrowed-chords', 'comping'],
    title: 'Borrow one chord: {p:chart}',
    level: 3, length: 'short', minutes: 2,
    params: {
      key: 'major',
      chart: [
        { v: '| I:maj7 | IV:maj7 | IV:maj7 | I:maj7 | I:maj7 | IV:maj7 | iv:m6 | I:maj7 |', label: 'IV → iv → I (minor plagal, from Aeolian)' },
        { v: '| I:maj | vi:min | vii:dim | I:maj | I:maj | bVI:maj | bVII:maj | I:maj |', label: '♭VI → ♭VII → I (Aeolian)' },
        { v: '| ii:m7 | V:7 | vi:m7 | % | ii:m7 | V:7 | bVI:maj7 | % |', label: 'V → ♭VI deceptive (Aeolian)' },
        { v: '| I:maj7 | IV:maj7 | vii:m7b5 | I:maj7 | I:maj7 | iv:m7 | bVII:7 | I:maj7 |', label: 'iv → ♭VII7 → I backdoor (Aeolian)', lvl: 1 },
        { v: '| ii:m7 | V:7 | I:maj7 | % | ii:m7b5 | V:7 | I:maj7 | % |', label: 'iiø7 in a major ii–V (Aeolian)', lvl: 1 },
        { v: '| I:maj7 | ii:m7 | IV:maj7 | I:maj7 | I:maj7 | II:7 | IV:maj7 | I:maj7 |', label: 'II7 lift (Lydian)', lvl: 1 },
        { v: '| I:maj | vii:dim | IV:maj | I:maj | I:maj | bVII:maj | IV:maj | I:maj |', label: 'I → ♭VII → IV (Mixolydian)' },
        { v: '| I:maj | V:maj | IV:maj | I:maj | I:maj | v:min | IV:maj | I:maj |', label: 'minor v (Mixolydian)', lvl: 1 },
        { v: '| I:maj7 | ii:m7 | I:maj7 | % | I:maj7 | bII:maj7 | I:maj7 | % |', label: '♭IImaj7 (Phrygian)', lvl: 2 },
        { v: '| I:maj7 | iii:m7 | vi:m7 | ii:m7 | I:maj7 | bIII:maj7 | bVI:maj7 | bII:maj7 |', label: 'chromatic-mediant borrowing (Aeolian/Phrygian)', lvl: 2 },
      ],
    },
    prompt: 'In **{key}**, comp this progression with a metronome: **{p:chart}**. Play it first with the plain diatonic chord in place of the borrowed one, then with the borrowed chord, and listen for the note that changes. (The demo plays exactly that: 4 bars with the diatonic chord on the same root letter, then 4 bars with the borrowed chord.)',
    goal: 'Hear and name the borrowed chord’s colour note.',
    tempo: { start: 72, min: 50, max: 140, step: 6 }, metronome: { meter: '4/4' },
    hints: ['Find the chord the borrowed one replaces (same root letter, diatonic quality) and compare the two grips.', 'Usually only one or two notes move by a half step.'],
    explain: EXPLAIN,
    visual: { type: 'progression', key: '$key', chart: '$chart', voiceLead: true, title: 'Bars 1–4: diatonic chord · bars 5–8: borrowed chord' },
    vary: ['chart', 'key', 'tempo'], concepts: ['modal-interchange'],
  },
  {
    id: 'mi-walk-brightness', mode: 'play', category: 'voicings', tags: ['modal-interchange', 'parallel-modes', 'mode-brightness', 'chord-scale'],
    title: 'Parallel-mode chord walk: {root} Lydian → Ionian → Mixolydian → Dorian → Aeolian',
    level: 6, length: 'long', minutes: 8,
    params: { key: 'major' },
    prompt: 'On strings 4-3-2-1, play the full drop-2 chord scale of **{root} Lydian**, then **Ionian**, **Mixolydian**, **Dorian** and **Aeolian** — each time one more note of the scale is lowered, so a few chords change quality. Before each new mode, say which degree drops and which chords it affects.',
    goal: 'Predict which chords change before you play each mode.',
    tempo: { start: 60, min: 40, max: 110, step: 5 }, metronome: { meter: '4/4' },
    hints: ['Lydian → Ionian: ♯4 → 4 (affects the chords containing the 4th degree).', 'Ionian → Mixolydian: 7 → ♭7. Mixolydian → Dorian: 3 → ♭3. Dorian → Aeolian: 6 → ♭6.'],
    explain: EXPLAIN,
    visual: { type: 'chordScale', root: '$key', scale: 'lydian', size: 4, voicing: 'drop2', stringSet: [4, 3, 2, 1], inversion: 0 },
    demo: [
      { type: 'chordScale', root: '$key', scale: 'lydian', size: 4, voicing: 'drop2', stringSet: [4, 3, 2, 1], inversion: 0, title: 'Lydian' },
      { type: 'chordScale', root: '$key', scale: 'ionian', size: 4, voicing: 'drop2', stringSet: [4, 3, 2, 1], inversion: 0, title: 'Ionian (4 drops from ♯4)' },
      { type: 'chordScale', root: '$key', scale: 'mixolydian', size: 4, voicing: 'drop2', stringSet: [4, 3, 2, 1], inversion: 0, title: 'Mixolydian (7 → ♭7)' },
      { type: 'chordScale', root: '$key', scale: 'dorian', size: 4, voicing: 'drop2', stringSet: [4, 3, 2, 1], inversion: 0, title: 'Dorian (3 → ♭3)' },
      { type: 'chordScale', root: '$key', scale: 'aeolian', size: 4, voicing: 'drop2', stringSet: [4, 3, 2, 1], inversion: 0, title: 'Aeolian (6 → ♭6)' },
    ],
    vary: ['key'], concepts: ['mode-brightness', 'modal-interchange', 'parallel-vs-derived-modes'],
  },
  {
    id: 'mi-thy-source', mode: 'theory', category: 'theory', tags: ['modal-interchange', 'harmony', 'borrowed-chords'],
    title: 'Where is this chord borrowed from?', level: 4, length: 'short',
    prompt: 'Name the most common parallel mode each borrowed chord comes from, then reveal.',
    quiz: { kind: 'reveal', question: 'In a major key, which parallel mode supplies: **iv**, **♭VI**, **♭VII**, **♭II**, **II (major)**, **v (minor)**, **iiø7**, **♭III**?', answer: '- **iv, ♭VI, ♭VII, ♭III, iiø7** → Aeolian (natural minor). ♭III and ♭VII are also in Dorian (whose IV is major, not minor); iv, ♭III and ♭VI are also in Phrygian.\n- **♭II** → Phrygian (also the Neapolitan).\n- **II (major)** → Lydian (the ♯4 is its 3rd).\n- **v (minor)** and **♭VII** → Mixolydian (♭7).\n- Harmonic minor supplies **vii°7** (and iv, ♭VI next to the ordinary V7); melodic minor gives **IV7** and **i(maj7)**.' },
    explain: EXPLAIN, concepts: ['modal-interchange'],
  },
];
export const concepts = [];
