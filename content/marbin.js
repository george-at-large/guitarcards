// Marbin (Dani Rabin) practice routines: cards + routines built from his YouTube lessons (@marbinmusic).
// All prose is our own summary of the ideas; melodies only for public-domain tunes, chord progressions otherwise.
const SRC = (t) => `After Marbin (Dani Rabin), "${t}", YouTube`;

const V = {
  caged: { id: '4ifrANK6u4s', title: 'This BORING Practice Routine Will Teach You Harmony in WEEKS' },
  tune: { id: 'wotd2Y3Ck14', title: 'Boring, But You’ll Never Forget a Tune Again' },
  pain: { id: 'omjeZgrwJgA', title: "The Painful Practice You’re Not Doing (is why you suck at jazz)" },
  ladder: { id: 'Mc_hTD_TxVc', title: 'The Pentatonic Ladder - How It Works' },
  tpAlt: { id: 'QNB0HAkTBZ0', title: 'Master Altered Triad Pairs in One BORING Lesson' },
  tpComp: { id: 'u74vroeYp48', title: 'Triad Pairs: Stop Comping Like a Child' },
  speed: { id: '8C56xRK2SB4', title: 'Speed Practice For Jazz Guitar' },
  joe: { id: 'Nvs12G30emw', title: 'Joe Pass LIED??' },
  cp: { id: 'AZMZaFKZo58', title: 'How to Play Counterpoint on Guitar in 10 minutes' },
  phrase: { id: 'j2IY4_Tiaas', title: "Give Me 15 MINUTES & I’ll Completely RESET Your Phrasing" },
  funk: { id: null, title: 'Funk Guitar Mechanics That Actually Work' },
  lines: { id: 'rpn8ulsRgD4', title: 'How to Outline Chord Changes' },
  dim: { id: 'iej28qSkB5c', title: 'Diminished Can Fit Into Your Jazz Baby Brain' },
  reharm: { id: 'AAWWbHh9Gj0', title: "Harmonize Any Melody Like a Genius (even if you’re stupid)" },
  hack: { id: 'shf6dOSx96o', title: '#1 Chord Soloing Hack Nobody Taught You for Blues' },
};

// ---------- shared pools ----------
const CAGED = [
  { v: 'C', label: 'C form' }, { v: 'A', label: 'A form' }, { v: 'G', label: 'G form' }, { v: 'E', label: 'E form' }, { v: 'D', label: 'D form' },
];
const GROUPS = [
  { v: [6, 5, 4, 3], label: 'low four (6-5-4-3)' },
  { v: [5, 4, 3, 2], label: 'middle four (5-4-3-2)' },
  { v: [4, 3, 2, 1], label: 'top four (4-3-2-1)' },
];
const TRIAD_SETS = [
  { v: [6, 5, 4], label: '6-5-4 (inside the low four)', lvl: 1 },
  { v: [5, 4, 3], label: '5-4-3 (inside the low/middle four)' },
  { v: [4, 3, 2], label: '4-3-2 (inside the middle/top four)' },
  { v: [3, 2, 1], label: '3-2-1 (inside the top four)' },
];
const AREAS = [
  { v: 4, label: 'the area around fret 4' },
  { v: 6, label: 'the area around fret 6' },
  { v: 8, label: 'the area around fret 8' },
  { v: 10, label: 'the area around fret 10' },
  { v: 12, label: 'the area around fret 12', lvl: 1 },
];
const SWING = { meter: '4/4', subdivision: 1, swing: 0.67, accent: true, clickOn: '2&4' };
const STRAIGHT = { meter: '4/4', subdivision: 1, swing: 0, accent: true };

const MICHELLE_TRIADS = '| I:maj | iv:min | bVII:maj | vi:dim | V:maj | vi:dim | V:maj | % |';
const AREA_CHARTS = [
  { v: '| ii:m7 | V:7 | I:maj7 | % |', label: 'ii–V–I' },
  { v: '| I:maj7 | vi:m7 | ii:m7 | V:7 |', label: 'I–vi–ii–V' },
  { v: '| I:6 | iv:m7 | bVII:6 | vi:dim7 | V:7 | vi:dim7 | V:7 | % |', label: 'Michelle-type descent, 4-note grips (I6 – iv7 – ♭VII6 – vi°7 – V7)', lvl: 1 },
];
const AUTUMN_MAJOR = '| ii:m7 | V:7 | I:maj7 | IV:maj7 | vii:m7b5 | III:7 | vi:m7 | % |';

// root-motion map: one diagram per chord, lighting every place that chord’s root lives inside one CAGED area of the key
function rootMap(id, { title, name, chords, source, level = 3, tags = [], extraHint }) {
  const degs = [...new Set(chords.map((c) => c[0]))];
  return {
    id, mode: 'play', category: 'fretboard', tags: ['caged', 'root-motion', 'marbin', ...tags],
    title, level, length: 'short', minutes: 3,
    params: { key: 'major', caged: CAGED },
    prompt: `Stay inside the **{p:caged}** area of **{key}**. Before you play a single chord, play the **roots only** of ${name}, in time, one per bar: ${chords.map((c) => `**${c[1]}** ({rn:${c[2]}})`).join(' → ')}.\n\nFor every root, say out loud which string it is on and which finger frets it, and so which CAGED form that chord will use here. No open strings.`,
    goal: 'Every root found inside the area without looking around; the form named for each chord.',
    tempo: { start: 60, min: 40, max: 160, step: 5, unit: 'bpm' },
    metronome: STRAIGHT,
    hints: [
      'Index on the 6th or 4th string = E or D form. Ring/pinky on the 6th = G form. On the 5th string: index with the chord to the right = A form, ring/pinky with the chord to the left = C form.',
      'The diagram labels each root as a degree of the key (2 = the ii chord’s root, ♭7 = the ♭VII chord’s root…).',
      extraHint || 'If a root appears twice in the area, pick the one nearest the previous root: that is already voice leading.',
    ],
    explain: `### Root motion first, grips second
A progression is a **path of roots**. Inside one hand position every root is available somewhere, and where it sits (string + finger) tells you which CAGED form the chord takes there. Map the path once with roots alone and the chord grips mostly look after themselves.

### How to practise it
- Play the roots in time, one per bar, saying the form names.
- Then play each chord’s triad from that root, in the same area.
- Change area and repeat: five areas per key.`,
    visual: { type: 'fretboard', root: '$key', tones: degs, region: { caged: '$caged' }, title: `Roots of ${name} in the {p:caged} area of {key}` },
    demo: chords.map(([deg, rn, tok]) => ({ type: 'arpeggio', root: '$key', tones: [deg], region: { caged: '$caged' }, path: 'ascending', beatsPerNote: 1, title: `${rn} = {rn:${tok}}: its root in this area` })),
    concepts: ['caged-root-areas', 'caged-system', 'roman-numerals'],
    vary: ['caged', 'key'], source,
  };
}

const BH_SCALES = [
  { v: ['1', '2', '3', '4', '5', 'b6', '6', '7'], label: 'major 6th + diminished (C6 + B° in C)' },
  { v: ['1', '2', 'b3', '4', '5', 'b6', '6', '7'], label: 'minor 6th + diminished (Cm6 + B° in C)', lvl: 1 },
  { v: ['1', '2', '3', '4', '5', 'b6', 'b7', '7'], label: 'dominant 7th + diminished (C7 + B° in C)', lvl: 1 },
];

const ALL_OF_ME = [
  { v: '| I:6 | % | III:7 | % |', label: 'bars 1–4 (I → III7)' },
  { v: '| VI:7 | % | ii:m7 | % |', label: 'bars 5–8 (VI7 → ii)' },
  { v: '| III:7 | % | vi:m7 | % |', label: 'bars 9–12 (III7 → vi)' },
  { v: '| II:7 | % | ii:m7 | V:7 |', label: 'bars 13–16 (II7 → ii–V)' },
];

const SILENT_NIGHT = "5 -_ 6_ 5 | 3 - - | 5 -_ 6_ 5 | 3 - - | 2' - 2' | 7 - - | 1' - 1' | 5 - - | 6 - 6 | 1' -_ 7_ 6 | 5 -_ 6_ 5 | 3 - - | 6 - 6 | 1' -_ 7_ 6 | 5 -_ 6_ 5 | 3 - - | 2' - 2' | 4' -_ 2'_ 7 | 1' - - | 3' - - | 1' -_ 5_ 3 | 5 4 2 | 1 - - | - - - |";
const GOD_REST = '. . . 1 | 1 5 5 4 | b3 2 1 b7, | 1 2 b3 4 | 5 - - 1 | 1 5 5 4 | b3 2 1 b7, | 1 2 b3 4 | 5 - - - |';
const HAPPY_BDAY = '. . 5,_ 5,_ | 6, 5, 1 | 7, - 5,_ 5,_ | 6, 5, 2 | 1 - 5,_ 5,_ | 5 3 1 | 7, 6, 4_ 4_ | 3 1 2 | 1 - - |';

const KEY_JUMPS = [
  { v: '| ii:m7 | V:7 | I:maj7 | % | ii/III:m7 | V/III:7 | III:maj7 | % |', label: 'home → a major 3rd up (III)' },
  { v: '| ii:m7 | V:7 | I:maj7 | % | ii/V:m7 | V/V:7 | V:maj7 | % |', label: 'home → a 5th up (V)' },
  { v: '| ii:m7 | V:7 | I:maj7 | % | ii/bVII:m7 | V/bVII:7 | bVII:maj7 | % |', label: 'home → a whole step down (♭VII)' },
  { v: '| ii:m7 | V:7 | I:maj7 | % | ii/VII:m7 | V/VII:7 | VII:maj7 | % |', label: 'home → a half step down (VII)', lvl: 1 },
  { v: '| ii:m7 | V:7 | I:maj7 | % | ii/bVI:m7 | V/bVI:7 | bVI:maj7 | % |', label: 'home → a minor 6th up (♭VI)', lvl: 1 },
];

export const templates = [
  // ===================== 1. CAGED voice leading =====================
  {
    id: 'mb-caged-root-finger', mode: 'play', category: 'fretboard', tags: ['caged', 'marbin', 'roots', 'fingering'],
    title: 'CAGED as root + finger: {chord} in all five forms',
    level: 2, length: 'short', minutes: 3,
    params: { key: 'major' },
    prompt: 'Play a **{chord}** triad arpeggio in each of the five forms, from the bottom of the neck up. Before each one, say where the **root** is and **which finger** frets it:\n- **C form**: root on the 5th string, ring or pinky, chord to the left.\n- **A form**: root on the 5th string, index, chord to the right.\n- **G form**: root on the 6th string, ring or pinky.\n- **E form**: root on the 6th string, index.\n- **D form**: root on the 4th string, index.',
    goal: 'You can find all five roots and name each form by its root string + finger, without thinking about the grip.',
    tempo: { start: 60, min: 40, max: 160, step: 5, unit: 'bpm' },
    metronome: STRAIGHT,
    hints: ['The two 6th-string forms differ only in the finger: index (E) or ring/pinky (G).', 'The two 5th-string forms: index with the shape stretching right (A), ring/pinky with the shape stretching left (C).', 'The D form is the only one rooted on the 4th string.'],
    explain: `### What CAGED really tells you
Forget the five open-chord pictures. Each form is just an answer to two questions: **which string is the root on, and which finger plays it?** That makes CAGED a map of where roots live in one hand position, and roots are what a progression moves.

### How to practise
Say the string + finger before each arpeggio. Then do it for a minor triad: the root stays put, only the 3rd moves.`,
    visual: { type: 'arpeggio', root: '$key', quality: 'maj', region: { connect: ['C', 'A', 'G', 'E', 'D'] } },
    demo: [
      { type: 'arpeggio', root: '$key', quality: 'maj', region: { caged: 'C' }, path: 'up-and-down', beatsPerNote: 0.5, title: 'C form: root on 5, ring/pinky, chord to the left' },
      { type: 'arpeggio', root: '$key', quality: 'maj', region: { caged: 'A' }, path: 'up-and-down', beatsPerNote: 0.5, title: 'A form: root on 5, index, chord to the right' },
      { type: 'arpeggio', root: '$key', quality: 'maj', region: { caged: 'G' }, path: 'up-and-down', beatsPerNote: 0.5, title: 'G form: root on 6, ring/pinky' },
      { type: 'arpeggio', root: '$key', quality: 'maj', region: { caged: 'E' }, path: 'up-and-down', beatsPerNote: 0.5, title: 'E form: root on 6, index' },
      { type: 'arpeggio', root: '$key', quality: 'maj', region: { caged: 'D' }, path: 'up-and-down', beatsPerNote: 0.5, title: 'D form: root on 4, index' },
    ],
    concepts: ['caged-root-areas', 'caged-system'], vary: ['key', 'tempo'], source: SRC(V.caged.title),
  },
  {
    id: 'mb-caged-quality-morph', mode: 'play', category: 'arpeggios', tags: ['caged', 'marbin', 'triads', 'quality-morph'],
    title: 'One form, four qualities: {root} in the {p:caged}',
    level: 3, length: 'short', minutes: 3,
    params: { key: 'major', caged: CAGED },
    prompt: 'Keep the root of **{root}** where the **{p:caged}** puts it and play the triad arpeggio four ways: **major → minor (♭3) → diminished (♭3 ♭5) → augmented (3 ♯5)**. Only the moving notes change; the root and your hand position do not.',
    goal: 'All four qualities in the same area with no shift; you can say which note moved each time.',
    tempo: { start: 60, min: 40, max: 160, step: 5, unit: 'bpm' },
    metronome: STRAIGHT,
    hints: ['Major → minor: every 3 drops one fret.', 'Minor → diminished: every 5 drops one fret.', 'Augmented: back to the major 3, then every 5 rises one fret.'],
    explain: `### Every form works for every triad
Because a CAGED form is really "root here, finger here", any triad quality fits it: flatten the 3rd for minor, flatten the 5th too for diminished, sharpen the 5th for augmented. That is why one area can hold a whole progression, Michelle’s iv minor and diminished chord included.`,
    visual: { type: 'arpeggio', root: '$key', quality: 'maj', region: { caged: '$caged' } },
    demo: [
      { type: 'arpeggio', root: '$key', quality: 'maj', region: { caged: '$caged' }, path: 'up-and-down', beatsPerNote: 0.5, title: 'major (1 3 5)' },
      { type: 'arpeggio', root: '$key', quality: 'min', region: { caged: '$caged' }, path: 'up-and-down', beatsPerNote: 0.5, title: 'minor (1 ♭3 5)' },
      { type: 'arpeggio', root: '$key', quality: 'dim', region: { caged: '$caged' }, path: 'up-and-down', beatsPerNote: 0.5, title: 'diminished (1 ♭3 ♭5)' },
      { type: 'arpeggio', root: '$key', quality: 'aug', region: { caged: '$caged' }, path: 'up-and-down', beatsPerNote: 0.5, title: 'augmented (1 3 ♯5)' },
    ],
    concepts: ['caged-root-areas', 'quality-morphing'], vary: ['caged', 'key'], source: SRC(V.caged.title),
  },
  rootMap('mb-roots-michelle', {
    title: 'Root motion of a Michelle-type progression in the {p:caged} area of {key}',
    name: 'the Michelle-type descent (I – iv – ♭VII – vi° – V)',
    chords: [['1', 'I', 'I:maj'], ['4', 'iv', 'iv:min'], ['b7', '♭VII', 'bVII:maj'], ['6', 'vi°', 'vi:dim'], ['5', 'V', 'V:maj'], ['6', 'vi°', 'vi:dim'], ['5', 'V', 'V:maj']],
    source: SRC(V.caged.title), tags: ['michelle', 'song-progression'],
    extraHint: 'In C, for example: A-form C → D-form Fm → G-form B♭ → G-form A° → G … all without leaving frets 3–6.',
  }),
  {
    id: 'mb-caged-michelle-triads', mode: 'play', category: 'voicings', tags: ['caged', 'marbin', 'voice-leading', 'triads', 'michelle', 'song-progression'],
    title: 'Michelle-type triads, voice-led on {stringSet} in {key}',
    level: 4, length: 'medium', minutes: 4,
    params: { key: ['C', 'F', 'G', 'D', 'Bb', 'A'], stringSet: TRIAD_SETS, area: AREAS },
    prompt: 'Play the Michelle-type progression **I – iv – ♭VII – vi° – V – vi° – V** in **{key}** as close triads on strings **{p:stringSet}**, starting in **{p:area}**. Stay on these strings: each chord takes the inversion nearest to the last one. No open strings.\n\nFirst out of time (find each grip, check its root), then in time: groove it, one chord per bar, and hum a top line over it.',
    goal: 'The whole loop in time on one string set, with every voice moving a fret or two at most.',
    tempo: { start: 60, min: 40, max: 140, step: 5, unit: 'bpm' },
    metronome: STRAIGHT,
    hints: ['In C: C → Fm → B♭ → A° → G. One voice walks down C → C → B♭ → A → G: find it and keep it on one string.', 'vi° is a diminished triad on the 6th degree (A–C–E♭ in C).', 'A 4-string grip that doubles one triad note is fine too. Keep the triad notes on the strings shown.'],
    explain: `### Why a string group voice-leads itself
Big six-string grips jump when the chord changes. A triad kept on **three adjacent strings** (or a 4-note grip on four) can only move by small steps, because each chord’s nearest inversion is always close by. That is voice leading without trying.

### Learning vs practising
**Learning** is the prep cooking: out of time, find each grip and check it against the root map. **Practising** is in time: one area, a groove, the melody hummed on top. Don’t mix the two.`,
    visual: { type: 'progression', key: '$key', chart: MICHELLE_TRIADS, voicing: 'close', stringSet: '$stringSet', voiceLead: true, startFret: '$area' },
    demo: { type: 'progression', key: '$key', chart: MICHELLE_TRIADS, voicing: 'close', stringSet: '$stringSet', voiceLead: true, startFret: '$area' },
    concepts: ['caged-root-areas', 'voice-leading-basics', 'close-triads'], vary: ['key', 'stringSet', 'area', 'tempo'], source: SRC(V.caged.title),
  },
  {
    id: 'mb-caged-15-areas', mode: 'play', category: 'progressions', tags: ['caged', 'marbin', 'voice-leading', 'drop2', 'string-groups'],
    title: '15 areas: {p:chart} on the {p:stringSet} in {key}',
    level: 5, length: 'medium', minutes: 5,
    params: { key: ['C', 'F', 'G', 'Bb', 'D', 'Eb', 'A'], chart: AREA_CHARTS, stringSet: GROUPS, area: AREAS },
    prompt: 'Comp **{p:chart}** in **{key}** with 4-note grips on the **{p:stringSet}** strings only, starting in **{p:area}**. Every chord takes the grip nearest the previous one.\n\nThen move: same progression, same string group, the next area up. Five areas × three string groups = **15 voice-led versions** of the same progression.',
    goal: 'Loop it in time on this group/area with no jumps; you can name the CAGED form of each chord’s root.',
    tempo: { start: 60, min: 40, max: 180, step: 5, unit: 'bpm' },
    metronome: SWING,
    hints: ['Find the first chord in the area, then let the others come to you: move each voice to its nearest note.', 'Root not in the grip? Locate it on a neighbouring string anyway, so you always know the form.', 'Learning first (out of time), practising second (in time, groove, hum the melody).'],
    explain: `### The 15 areas
CAGED gives five areas along the neck; each area has three groups of four adjacent strings (low, middle, top). Hold one group and one area and any progression voice-leads itself, so every tune has **15 compact homes**. Working through them builds the whole fretboard one small, musical piece at a time.

### Learning vs practising
Map the area slowly first. Then practise it in time: the progression on loop, a steady groove, and the melody hummed over it. In time is what makes it usable on a gig.`,
    visual: { type: 'progression', key: '$key', chart: '$chart', voicing: 'drop2', stringSet: '$stringSet', voiceLead: true, startFret: '$area' },
    demo: { type: 'progression', key: '$key', chart: '$chart', voicing: 'drop2', stringSet: '$stringSet', voiceLead: true, startFret: '$area' },
    concepts: ['caged-root-areas', 'voice-leading-basics', 'drop2', 'string-sets'], vary: ['chart', 'stringSet', 'area', 'key'], source: SRC(V.caged.title),
  },

  // ===================== 2. Never forget a tune =====================
  {
    id: 'mb-tune-recite', mode: 'theory', category: 'theory', tags: ['harmony', 'marbin', 'memorisation', 'root-motion', 'autumn-leaves'],
    title: 'Recite the tune as a number: Autumn Leaves A section',
    level: 2, length: 'short',
    prompt: 'Without an instrument: say the A section of **Autumn Leaves** as root-motion numbers in the relative **major** key, like a phone number. Then write it down. Then reveal.',
    quiz: { kind: 'reveal', question: 'Autumn Leaves A section, numbered from the relative major: which seven numbers?', answer: '**2 5 1 4 7 3 6**\n\nii7 – V7 – Imaj7 – IVmaj7 – viiø7 – III7 – vi(m)\n\nIn B♭ that is Cm7 F7 B♭maj7 E♭maj7 Aø7 D7 Gm. "Two-five-one-four, seven-three-six." Write it out 20 times today; recite it tomorrow before you play it.' },
    hints: ['It starts with a ii–V–I.', 'After the I, it keeps falling in 4ths through the key.'],
    explain: `### A tune is a number, not a set of grips
If you memorise grips you have memorised one key in one position. Memorise the **intervallic root motion** (the numbers against the key) and you can play it anywhere. Treat it like a phone number: write it 20 times, recite it until it is boring. Then find it in time on the guitar.`,
    concepts: ['root-motion-numbers', 'roman-numerals'], source: SRC(V.tune.title),
  },
  {
    id: 'mb-tune-numbers-to-chords', mode: 'theory', category: 'theory', tags: ['harmony', 'marbin', 'memorisation', 'root-motion'],
    title: '2-5-1-4-7-3-6 in {key}',
    level: 3, length: 'short',
    params: { key: 'major' },
    prompt: 'Turn the number into chords in **{key}**: 2 5 1 4 7 3 6, with the right quality for each. Say them out loud, then reveal.',
    quiz: { kind: 'reveal', question: 'Spell 2-5-1-4-7-3-6 in **{key}** (ii7 V7 Imaj7 IVmaj7 viiø7 III7 vi).', answer: '{rn:ii:m7} – {rn:V:7} – {rn:I:maj7} – {rn:IV:maj7} – {rn:vii:m7b5} – {rn:III:7} – {rn:vi:m7}' },
    hints: ['All diatonic, except the III7: a secondary dominant (V of vi), so its 3rd is raised.', 'The last three (7 3 6) are a minor ii–V–i into the relative minor.'],
    explain: 'Same number, any key. The qualities never change: ii is minor 7, V dominant, I and IV major 7, vii half-diminished, III a dominant (V/vi) and vi minor. Do this in a different key every day until the numbers turn into chord names instantly.',
    concepts: ['root-motion-numbers', 'secondary-dominants'], vary: ['key'], source: SRC(V.tune.title),
  },
  rootMap('mb-roots-autumn', {
    title: 'Autumn Leaves-type root motion in the {p:caged} area of {key}',
    name: 'the Autumn Leaves-type A section (2 5 1 4 7 3 6)',
    chords: [['2', 'ii', 'ii:m7'], ['5', 'V', 'V:7'], ['1', 'I', 'I:maj7'], ['4', 'IV', 'IV:maj7'], ['7', 'viiø', 'vii:m7b5'], ['3', 'III7', 'III:7'], ['6', 'vi', 'vi:m7']],
    source: SRC(V.tune.title), tags: ['autumn-leaves', 'memorisation'],
    extraHint: 'Example path: C-form ii → E-form V → A-form I → D-form IV → A-form viiø → III7 → vi, all without leaving the area.',
  }),
  {
    id: 'mb-tune-autumn-areas', mode: 'play', category: 'progressions', tags: ['marbin', 'memorisation', 'root-motion', 'autumn-leaves', 'drop2', 'string-groups'],
    title: '2514736 in time: {key}, {p:stringSet} strings',
    level: 4, length: 'medium', minutes: 5,
    params: { key: 'major', stringSet: GROUPS, area: AREAS },
    prompt: 'Recite **2 5 1 4 7 3 6** once, then comp it in **{key}** in time on the **{p:stringSet}** strings, starting in **{p:area}**: {rn:ii:m7} → {rn:V:7} → {rn:I:maj7} → {rn:IV:maj7} → {rn:vii:m7b5} → {rn:III:7} → {rn:vi:m7}.\n\nNo chart: if you lose your place, say the numbers, not the chord names.',
    goal: 'Two loops in time without stopping, thinking in numbers.',
    tempo: { start: 70, min: 50, max: 200, step: 5, unit: 'bpm' },
    metronome: SWING,
    hints: ['Find the roots in the area first (the root-map card), then grip them.', 'Change key every session: the numbers stay, the area moves.'],
    explain: `### From the number to the neck
Once the number is memorised, the job is to find it **in time** in each area of each key. The numbers are the same; only the CAGED forms change from area to area. Do this in several keys and the tune stops being a list of chords and becomes a shape you can find anywhere.`,
    visual: { type: 'progression', key: '$key', chart: AUTUMN_MAJOR, voicing: 'drop2', stringSet: '$stringSet', voiceLead: true, startFret: '$area' },
    demo: { type: 'progression', key: '$key', chart: AUTUMN_MAJOR, voicing: 'drop2', stringSet: '$stringSet', voiceLead: true, startFret: '$area' },
    concepts: ['root-motion-numbers', 'caged-root-areas', 'drop2'], vary: ['key', 'stringSet', 'area'], source: SRC(V.tune.title),
  },
  {
    id: 'mb-tune-map-blue-bossa', mode: 'theory', category: 'theory', tags: ['harmony', 'marbin', 'memorisation', 'modulation', 'blue-bossa'],
    title: 'Blue Bossa as numbers from the home key',
    level: 4, length: 'short',
    prompt: 'Blue Bossa sits in C minor, i.e. the relative minor of **E♭**. Number every chord **from E♭** (the home key), including the modulation, then reveal. Measure the new key from home, not from the last chord.',
    quiz: { kind: 'reveal', question: 'Blue Bossa (Cm7 Fm7 Dø7 G7 Cm7 | E♭m7 A♭7 D♭maj7 | Dø7 G7 Cm7) measured from E♭?', answer: '**vi – ii – viiø – V/vi – vi**, then a **ii–V–I a whole step down** (♭VII: D♭), then **viiø – V/vi – vi** home.\n\nSo the whole tune is "6 2 7 3(7) 6, then 2-5-1 down a whole step, then 7 3 6".' },
    hints: ['Cm is vi of E♭; Fm is ii; Dø is vii; G7 is the V of vi (III7).', 'D♭ is a whole step below E♭.'],
    explain: 'Measuring every new key from the **home** key keeps a modulating tune in one frame of reference. "A whole step down from home" is one fact to remember; a chain of "a 4th from the previous chord, then…" is many.',
    concepts: ['root-motion-numbers', 'modulation', 'relative-major'], source: SRC(V.tune.title),
  },
  {
    id: 'mb-tune-map-attya', mode: 'theory', category: 'theory', tags: ['harmony', 'marbin', 'memorisation', 'modulation', 'all-the-things-you-are'],
    title: 'All the Things You Are as key-centre numbers',
    level: 5, length: 'short',
    prompt: 'All the Things You Are is in **A♭**. Describe the form as "6-2-5-1-4" and "2-5-1"s, each measured **from A♭**. Then reveal.',
    quiz: { kind: 'reveal', question: 'The key-centre map of All the Things You Are, measured from A♭?', answer: '- **A1:** 6-2-5-1-4 at home (A♭), then a 2-5-1 a **major 3rd up** (C).\n- **A2:** the same 6-2-5-1-4 a **5th up** (E♭), then a 2-5-1 into **G**: a half step below home (the 7).\n- **Bridge:** 2-5-1 in G again, then a 2-5-1 a **♭6 away** (E), then the **V of vi** (C7) back to home.\n- **A3:** 6 2 5 1 4, then **iv** (D♭m), **I**, **♭iii°**, and ii–V–I home.' },
    hints: ['Only three shapes to remember: 6-2-5-1-4, 2-5-1 and the V of vi.', 'C is a major 3rd above A♭; E♭ a 5th; E (F♭) a minor 6th.'],
    explain: 'With every key measured from A♭, the tune is a short list: the 6-2-5-1-4 cell in two keys, 2-5-1s to three other centres, and a few standard home-key moves at the end. Recite the list, then play it in one area with the play card.',
    concepts: ['root-motion-numbers', 'modulation', 'ii-v-i'], source: SRC(V.tune.title),
  },
  {
    id: 'mb-tune-key-jumps', mode: 'play', category: 'progressions', tags: ['marbin', 'modulation', 'ii-v-i', 'root-motion', 'drop2'],
    title: 'Key jumps from home: {p:chart}',
    level: 5, length: 'medium', minutes: 4,
    params: { key: ['Ab', 'Eb', 'C', 'F', 'G', 'Bb'], chart: KEY_JUMPS, stringSet: GROUPS },
    prompt: 'A ii–V–I in **{key}** (home), then a ii–V–I in the key **{p:chart}**. Say the new key as a number from home before you play it. Stay on the **{p:stringSet}** strings and in one area: find the new key’s ii chord near where the home I chord was.',
    goal: 'The jump lands in time, in the same area, and you can say "that is the III" (or V, ♭VII…) without counting.',
    tempo: { start: 70, min: 50, max: 200, step: 5, unit: 'bpm' },
    metronome: SWING,
    hints: ['Measure from home, not from the last chord.', 'These are the moves of All the Things You Are (III, V, VII, ♭VI) and Blue Bossa (♭VII).'],
    explain: 'Modulating tunes reuse a few key relationships. Practise each relationship once as a drill and the tunes that use them become easy to remember: "ii–V–I up a major 3rd" is one thing, not three chord names.',
    visual: { type: 'progression', key: '$key', chart: '$chart', voicing: 'drop2', stringSet: '$stringSet', voiceLead: true },
    demo: { type: 'progression', key: '$key', chart: '$chart', voicing: 'drop2', stringSet: '$stringSet', voiceLead: true },
    concepts: ['root-motion-numbers', 'modulation', 'ii-v-i'], vary: ['chart', 'key', 'stringSet'], source: SRC(V.tune.title),
  },

  // ===================== 3. Painful practice (Barry Harris) =====================
  {
    id: 'mb-bh-caged-sixths', mode: 'play', category: 'arpeggios', tags: ['marbin', 'barry-harris', 'caged', 'arpeggios', 'sixth-chords'],
    title: '{chord} arpeggio in the {p:caged}',
    level: 3, length: 'short', minutes: 3,
    params: { key: 'major', caged: CAGED, quality: [{ v: '6', label: 'major 6' }, { v: 'm6', label: 'minor 6' }, { v: '7', label: 'dominant 7' }, { v: 'maj', label: 'major triad' }, { v: 'min', label: 'minor triad' }] },
    prompt: 'Arpeggiate **{chord}** in the **{p:caged}**, from the lowest chord tone in the shape to the highest and back. Name every interval out loud as you play it (1, 3, 5, 6…).\n\nWork order: major and minor triads in all five forms first, then turn them into 6, m6 and 7 chords by adding one note.',
    goal: 'Every note named as you play it, in time, in all five forms.',
    tempo: { start: 60, min: 40, max: 160, step: 5, unit: 'bpm' },
    metronome: { meter: '4/4', subdivision: 2, swing: 0, accent: true },
    hints: ['6 = the note a whole step above the 5. ♭7 = a whole step below the root.', 'm6 = minor triad + the major 6th (C E♭ G A).'],
    explain: `### Why the boring arpeggios
The Barry Harris scales are built **from** these chords, so you need the C6, Cm6 and C7 arpeggios in every form before the scales mean anything. Naming the intervals aloud is the painful part, and it is the part that makes the knowledge usable.`,
    visual: { type: 'arpeggio', root: '$key', quality: '$quality', region: { caged: '$caged' } },
    demo: { type: 'arpeggio', root: '$key', quality: '$quality', region: { caged: '$caged' }, path: 'up-and-down', beatsPerNote: 0.5 },
    concepts: ['sixth-diminished', 'caged-system'], vary: ['quality', 'caged', 'key'], source: SRC(V.pain.title),
  },
  {
    id: 'mb-bh-scale-chunks', mode: 'play', category: 'scales', tags: ['marbin', 'barry-harris', 'sixth-diminished', 'diminished', 'caged'],
    title: 'Barry Harris scale in 4-note chunks: {p:bh}',
    level: 5, length: 'medium', minutes: 4,
    params: { key: 'major', bh: BH_SCALES, caged: CAGED },
    prompt: 'Play the **{p:bh}** scale on **{root}** in the **{p:caged}**, not as a run but in **4-note chunks**: one chord, then the diminished chord, then the chord again, each a step higher (C E G A → D F A♭ B → E G A C …).\n\nSay each chunk out loud as a chord: "tonic, diminished, tonic…".',
    goal: 'Clean alternation of tonic and diminished chunks up and down the shape, in time.',
    tempo: { start: 60, min: 40, max: 180, step: 5, unit: 'bpm' },
    metronome: { meter: '4/4', subdivision: 2, swing: 0.67, accent: true },
    hints: ['Every second scale note belongs to the diminished chord a half step below the root.', 'The diminished notes are 2, 4, ♭6 and 7 of {root}.', 'Small chunks, not two-octave sweeps: a chunk is something you can drop into a line.'],
    explain: `### Chord + diminished = an 8-note scale
Barry Harris' scales add the diminished 7th chord a half step below the root to a 6th or 7th chord:
- **C6 + B°** = C D E F G A♭ A B (major 6th-diminished)
- **Cm6 + B°** = C D E♭ F G A♭ A B (minor 6th-diminished)
- **C7 + B°** = C D E F G A♭ B♭ B (dominant 7th-diminished)

Played every other note, the scale alternates chord and diminished: chord, motion, chord, motion. Four-note chunks make that audible.`,
    visual: { type: 'scale', root: '$key', tones: '$bh', region: { caged: '$caged' } },
    demo: { type: 'scale', root: '$key', tones: '$bh', region: { caged: '$caged' }, sequence: { kind: 'pattern', degrees: [1, 3, 5, 7] }, beatsPerNote: 0.5 },
    concepts: ['sixth-diminished', 'diminished-scale'], vary: ['bh', 'caged', 'key'], source: SRC(V.pain.title),
  },
  {
    id: 'mb-bh-dim-on-tonic', mode: 'theory', category: 'theory', tags: ['harmony', 'marbin', 'barry-harris', 'diminished'],
    title: 'The diminished chord as degrees of {key}',
    level: 4, length: 'short',
    params: { key: 'major' },
    prompt: 'Don’t think of the diminished chord from its own root. Name its notes as **degrees of the tonic**, then name the dominant it really is. Reveal to check.',
    quiz: { kind: 'reveal', question: 'In **{key}**, the diminished 7th a half step below the root is {rn:vii:dim7}. Which degrees of {key} does it contain, and what is it?', answer: 'Degrees **2, 4, ♭6 and 7** of {key}.\n\nThat is a **rootless {rn:V:7b9}** (3, 5, ♭7, ♭9 of the V), so it pulls straight back to the tonic. Moving tonic → diminished four notes at a time is tonic → dominant → tonic.' },
    hints: ['7 and 4 are the tritone of the V7 chord.', '♭6 of the key is the ♭9 of the V.'],
    explain: 'Hearing the diminished chord as 2-4-♭6-7 of the key tells you where each note goes: 7 → 1, 2 → 1 or 3, 4 → 3, ♭6 → 5. It is the same chord as a V7♭9 without its root, so it works as the "motion" between tonic chords.',
    visual: [
      { type: 'fretboard', root: '$key', tones: ['1', '3', '5', '6'], region: { frets: [0, 12] }, title: 'Tonic 6th chord tones' },
      { type: 'fretboard', root: '$key', tones: ['2', '4', 'b6', '7'], region: { frets: [0, 12] }, title: 'Diminished tones as degrees of the key: 2 4 ♭6 7' },
    ],
    concepts: ['sixth-diminished', 'dim7-rootless-dominant'], vary: ['key'], source: SRC(V.pain.title),
  },
  {
    id: 'mb-bh-string-group', mode: 'play', category: 'scales', tags: ['marbin', 'barry-harris', 'sixth-diminished', 'string-groups'],
    title: '6th-diminished on G-B-E: {root}, {p:window}',
    level: 5, length: 'short', minutes: 3,
    params: { key: 'major', window: [{ v: [2, 7], label: 'frets 2–7' }, { v: [5, 10], label: 'frets 5–10' }, { v: [8, 13], label: 'frets 8–13' }, { v: [10, 15], label: 'frets 10–15' }] },
    prompt: 'On the **G, B and E strings only** ({p:window}), play the **{root} major 6th-diminished** scale in 4-note chunks laid out **one note, one note, two notes** (G string, B string, two on the E string). Alternate tonic chunks and diminished chunks, moving up a scale step each time.',
    goal: 'Tonic and diminished chunks alternate smoothly up and down the three strings.',
    tempo: { start: 56, min: 40, max: 160, step: 4, unit: 'bpm' },
    metronome: { meter: '4/4', subdivision: 2, swing: 0.67, accent: true },
    hints: ['Tonic chunk = 1 3 5 6 in some order; diminished chunk = 2 4 ♭6 7.', 'Same fingering family repeats: the diminished shapes move in minor 3rds.'],
    explain: 'Mapping the scale onto a small string group makes it a chord-melody tool as well as a line: each chunk is nearly a grip. The 1-1-2 layout keeps every chunk under one hand position.',
    visual: { type: 'scale', root: '$key', tones: BH_SCALES[0].v, region: { strings: [3, 2, 1], frets: '$window' } },
    demo: { type: 'scale', root: '$key', tones: BH_SCALES[0].v, region: { strings: [3, 2, 1], frets: '$window' }, sequence: { kind: 'pattern', degrees: [1, 3, 5, 7] }, beatsPerNote: 0.5 },
    concepts: ['sixth-diminished', 'string-sets'], vary: ['window', 'key'], source: SRC(V.pain.title),
  },
  {
    id: 'mb-bh-georgia', mode: 'play', category: 'progressions', tags: ['marbin', 'barry-harris', 'diminished', 'georgia', 'song-progression'],
    title: 'Where am I going? I → III7 → vi as diminished motion in {key}',
    level: 5, length: 'medium', minutes: 4,
    params: { key: ['C', 'F', 'G', 'Bb', 'Eb'], stringSet: [{ v: [4, 3, 2, 1] }, { v: [5, 4, 3, 2] }] },
    prompt: 'The opening move of a Georgia on My Mind-type progression: **I → III7 → vi** ({rn:I:6} → {rn:III:7} → {rn:vi:m6}).\n\nPlay it as written first. Then replace the III7 by the diminished chord on the **2, 4, ♭6, 7 of vi** ({rn:#v:dim7}) and play lines in 4-note chunks: tonic chunk of I, diminished chunk, tonic chunk of vi.',
    goal: 'You can hear and play the III7 as "the diminished that leads to vi".',
    tempo: { start: 60, min: 40, max: 160, step: 5, unit: 'bpm' },
    metronome: SWING,
    hints: ['In C: E7 contains G♯ B D F = G♯°7 = 7, 2, 4, ♭6 of A.', 'Think of where you are going (vi), not where you are (III7).'],
    explain: `### Where am I going, not where am I
A secondary dominant is just the diminished chord of its target. E7♭9 without its root is G♯°7, and G♯°7 is 7-2-4-♭6 of A minor. So instead of a new scale for E7, use the A minor 6th-diminished scale: its diminished notes over E7, its tonic notes on Am.`,
    visual: { type: 'progression', key: '$key', chart: '| I:6 | III:7 | vi:m6 | % |', voicing: 'drop2', stringSet: '$stringSet', voiceLead: true },
    demo: [
      { type: 'progression', key: '$key', chart: '| I:6 | III:7 | vi:m6 | % |', voicing: 'drop2', stringSet: '$stringSet', voiceLead: true, title: 'As written: I6 – III7 – vi6' },
      { type: 'progression', key: '$key', chart: '| I:6 | #v:dim7 | vi:m6 | % |', voicing: 'drop2', stringSet: '$stringSet', voiceLead: true, title: 'As Barry Harris would think it: the diminished of vi' },
    ],
    concepts: ['sixth-diminished', 'secondary-dominants', 'dim7-rootless-dominant'], vary: ['key', 'stringSet'], source: SRC(V.pain.title),
  },

  // ===================== 4. Pentatonic ladder =====================
  {
    id: 'mb-ladder-32', mode: 'play', category: 'pentatonic', tags: ['marbin', 'pentatonic', 'ladder', 'three-octave', 'diagonal'],
    title: 'Pentatonic ladder, 3-2 shape: {root} major pentatonic',
    level: 4, length: 'short', minutes: 3,
    params: { key: ['C', 'G', 'A', 'F', 'Bb', 'Ab'] },
    prompt: 'Climb **{root} major pentatonic** from the root on the 6th string, three octaves, using the ladder rule: **whole steps along a string, minor 3rds across strings**. That gives three notes, then two, then three… ("3-2"). Slide with the **ring finger** to move up instead of reaching with the pinky.',
    goal: 'Three octaves up and back in time, shifting smoothly, ring-finger slides only.',
    tempo: { start: 60, min: 40, max: 180, step: 4, unit: 'bpm' },
    metronome: { meter: '4/4', subdivision: 2, swing: 0, accent: true },
    hints: ['Three-note strings: 1 2 3 (or 5 6 1 an octave on is a two-note string). Two-note strings: 5 6.', 'Every string crossing is a minor 3rd: 3 → 5 and 6 → 1.', 'The top note may need a stretch or slide: that is the end of the ladder.'],
    explain: `### The ladder
The major pentatonic has only two kinds of step: whole steps (1-2, 2-3, 5-6) and minor 3rds (3-5, 6-1). Put every whole step **along** a string and every minor 3rd **across** strings and the scale becomes a diagonal ladder covering three octaves with no box shapes at all. Starting on the root gives the **3-2** shape; starting on the 5th gives the **2-3** shape.`,
    visual: { type: 'scale', root: '$key', scale: 'major-pentatonic', region: { octaves: 3 } },
    demo: { type: 'scale', root: '$key', scale: 'major-pentatonic', region: { octaves: 3 }, path: 'up-and-down', beatsPerNote: 0.5 },
    concepts: ['pentatonic-ladder', 'pentatonic-boxes'], vary: ['key', 'tempo'], source: SRC(V.ladder.title),
  },
  {
    id: 'mb-ladder-23', mode: 'play', category: 'pentatonic', tags: ['marbin', 'pentatonic', 'ladder', 'three-octave', 'diagonal', 'caged'],
    title: 'Pentatonic ladder, 2-3 shape: {p:root}',
    level: 4, length: 'short', minutes: 3,
    params: { root: [{ v: 'G', label: 'C major pentatonic from its 5th (G)' }, { v: 'A', label: 'D major pentatonic from its 5th (A)' }, { v: 'C', label: 'F major pentatonic from its 5th (C)' }, { v: 'D', label: 'G major pentatonic from its 5th (D)' }, { v: 'F', label: 'B♭ major pentatonic from its 5th (F)' }] },
    prompt: 'Start the ladder on the **5th** of the scale on the 6th string ({p:root}): **two** notes on that string, **three** on the next, two, three… Whole steps along strings, minor 3rds across. Note names are shown.\n\nAs you climb, notice the major chord forms you pass through: **A form** at the bottom (it feels like a bass line), then **G, E, D** and **C** forms higher up.',
    goal: 'Up and down in time, with each CAGED chord form recognised as you pass it.',
    tempo: { start: 60, min: 40, max: 180, step: 4, unit: 'bpm' },
    metronome: { meter: '4/4', subdivision: 2, swing: 0, accent: true },
    hints: ['Low strings: 5 6 | 1 2 3 | 5 6 | 1 2 3 …', 'Ring finger slides between groups; no pinky.', 'The relative minor (6th degree) lives on the same ladder: same notes, aim at a different home.'],
    explain: `### 2-3 vs 3-2
The two ladders are the same rule from two starting points. From the 5th you get 2-3; from the root, 3-2. Together they cover the neck diagonally, and both cross the five CAGED chord shapes of the key in order, so every chord tone you need for a chord change is always one step away.`,
    visual: { type: 'scale', root: '$root', tones: ['1', '2', '4', '5', '6'], region: { octaves: 3 }, labels: 'note' },
    demo: { type: 'scale', root: '$root', tones: ['1', '2', '4', '5', '6'], region: { octaves: 3 }, path: 'up-and-down', beatsPerNote: 0.5, labels: 'note' },
    concepts: ['pentatonic-ladder', 'caged-system'], vary: ['root', 'tempo'], source: SRC(V.ladder.title),
  },
  {
    id: 'mb-ladder-relative-minor', mode: 'play', category: 'pentatonic', tags: ['marbin', 'pentatonic', 'ladder', 'relative-minor'],
    title: 'The ladder as {root} minor pentatonic',
    level: 4, length: 'short', minutes: 3,
    params: { key: ['Am', 'Em', 'Dm', 'Gm', 'Bm'] },
    prompt: 'Same notes as the relative major ladder, new home: climb **{root} minor pentatonic** three octaves on a diagonal, then improvise short phrases that **end on {root}**, then on the relative major root. Same area, two tonics.',
    goal: 'Phrases that clearly land on the minor root, then on the major root, from the same ladder.',
    tempo: { start: 66, min: 40, max: 180, step: 4, unit: 'bpm' },
    metronome: { meter: '4/4', subdivision: 2, swing: 0.33, accent: true },
    drone: { note: '$key', fifth: true },
    hints: ['A minor pentatonic = C major pentatonic: A C D E G.', 'The drone decides which one you hear.'],
    explain: 'The ladder belongs to a set of five notes, not to one root. With a minor drone the same diagonal is A minor pentatonic; with a major drone it is C major. That is what lets it follow chord changes between relatives (C–Am).',
    visual: { type: 'scale', root: '$key', scale: 'minor-pentatonic', region: { octaves: 3 } },
    demo: { type: 'scale', root: '$key', scale: 'minor-pentatonic', region: { octaves: 3 }, path: 'up-and-down', beatsPerNote: 0.5 },
    concepts: ['pentatonic-ladder', 'relative-major'], vary: ['key'], source: SRC(V.ladder.title),
  },
  {
    id: 'mb-ladder-blue-note', mode: 'play', category: 'pentatonic', tags: ['marbin', 'pentatonic', 'ladder', 'blue-note', 'blues'],
    title: 'Add the blue note to the {root} ladder',
    level: 4, length: 'short', minutes: 3,
    params: { key: ['C', 'G', 'A', 'F'] },
    prompt: 'Climb the **{root} major pentatonic** ladder (3-2 shape). On every three-note string, add the **♭3** between the 2 and the 3 (in C: E♭ between D and E) as a slide or hammer-on into the 3. It is the ♭3 of the major key and the ♭5 of the relative minor.',
    goal: 'The blue note as a quick passing tone, never as a resting note.',
    tempo: { start: 60, min: 40, max: 160, step: 4, unit: 'bpm' },
    metronome: { meter: '4/4', subdivision: 2, swing: 0.67, accent: true },
    hints: ['2 → ♭3 → 3: the ring finger slides from ♭3 to 3.', 'Second diagram: every ♭3 on the neck.'],
    explain: 'The major blues scale (1 2 ♭3 3 5 6) is the ladder plus one chromatic note. Because the ♭3 always sits one fret below the 3, it slots into the three-note strings without changing the fingering.',
    visual: [
      { type: 'scale', root: '$key', scale: 'major-pentatonic', region: { octaves: 3 }, title: 'The ladder (3-2)' },
      { type: 'fretboard', root: '$key', tones: ['b3', '3'], region: { frets: [0, 15] }, title: 'The blue note (♭3) next to each 3' },
    ],
    demo: [
      { type: 'scale', root: '$key', scale: 'major-pentatonic', region: { octaves: 3 }, path: 'ascending', beatsPerNote: 0.5, title: 'The ladder' },
      { type: 'scale', root: '$key', scale: 'major-blues', region: { octaves: 2 }, path: 'up-and-down', beatsPerNote: 0.5, title: 'With the blue note (one fingering)' },
    ],
    concepts: ['pentatonic-ladder'], vary: ['key'], source: SRC(V.ladder.title),
  },
  {
    id: 'mb-ladder-moving-chords', mode: 'play', category: 'improv', tags: ['marbin', 'pentatonic', 'ladder', 'changes', 'song-progression'],
    title: 'Ladder over moving chords: {p:chart} in {key}',
    level: 5, length: 'medium', minutes: 4,
    params: { key: ['C', 'G', 'F', 'D'], chart: [{ v: '| I:maj | % | vi:min | % |', label: 'I – vi (Hallelujah-style rocking)' }, { v: '| vi:min | V:maj | IV:maj | % |', label: 'vi – V – IV (6-5-4)' }] },
    prompt: 'Improvise on the ladder over **{p:chart}** in **{key}**. Stay on one diagonal and change the **target** with the chord: land on a chord tone of each new chord on beat 1. For vi–V–IV, try switching to each chord’s own pentatonic on the same strings.',
    goal: 'Every chord change marked by a chord tone on the downbeat, without leaving the ladder.',
    tempo: { start: 72, min: 50, max: 160, step: 4, unit: 'bpm' },
    metronome: STRAIGHT,
    hints: ['I and vi share the same pentatonic: only the target changes.', 'Over V, the major pentatonic of V; over IV, that of IV: each sits a whole step from the next on the ladder.'],
    explain: 'The ladder makes chord following easy because every chord shape of the key is crossed somewhere on it. Practise the slow way: one chord per bar, aim, land, sustain.',
    visual: { type: 'progression', key: '$key', chart: '$chart', voiceLead: true, scales: { 'I:maj': 'major-pentatonic', 'vi:min': 'minor-pentatonic', 'V:maj': 'major-pentatonic', 'IV:maj': 'major-pentatonic' } },
    demo: { type: 'progression', key: '$key', chart: '$chart', voiceLead: true, scales: { 'I:maj': 'major-pentatonic', 'vi:min': 'minor-pentatonic', 'V:maj': 'major-pentatonic', 'IV:maj': 'major-pentatonic' } },
    concepts: ['pentatonic-ladder', 'chord-tone-targeting'], vary: ['chart', 'key'], source: SRC(V.ladder.title),
  },

  // ===================== 5. Triad pairs =====================
  {
    id: 'mb-tp-sub-vs-sus', mode: 'theory', category: 'theory', tags: ['harmony', 'marbin', 'triad-pairs', 'substitution', 'suspension'],
    title: 'Substitution or suspension? Triads over {rn:I:maj7}',
    level: 4, length: 'short',
    params: { key: 'major' },
    prompt: 'Over a {rn:I:maj7} chord, sort the seven diatonic triads of {key} into **substitutions** (they sound like the chord) and **suspensions** (they lean and want to resolve). Reveal to check.',
    quiz: { kind: 'reveal', question: 'Over {rn:I:maj7}: which diatonic triads substitute and which suspend?', answer: '**Substitutions:** triads built on **1, 3, 5 and 6** of the mode (here {rn:I:maj}, {rn:iii:min}, {rn:V:maj}, {rn:vi:min}): they contain chord tones and safe tensions.\n\n**Suspensions:** triads on **2, 4 and 7** ({rn:ii:min}, {rn:IV:maj}, {rn:vii:dim}): they hold the avoid note or replace the 3rd, so they sound like a sus chord that resolves.\n\nOn a mode where the 6 is an avoid note (e.g. Aeolian, Phrygian), the triad on 6 becomes a suspension too.' },
    hints: ['In Ionian the 4 is the avoid note: any triad containing it leans.', 'A pair of one sub + one sus triad gives tension and release inside a single chord.'],
    explain: 'This classification tells you what a triad pair will do. Two substitution triads give a stable colour; a substitution + suspension pair (e.g. ii over I, as heard in many pop-funk grooves) gives movement inside one chord.',
    concepts: ['triad-sub-vs-sus', 'triad-pairs', 'avoid-notes'], vary: ['key'], source: SRC(V.tpComp.title),
  },
  {
    id: 'mb-tp-mode-pairs', mode: 'play', category: 'arpeggios', tags: ['marbin', 'triad-pairs', 'hexatonic', 'modes'],
    title: 'Triad pair over {root}: {p:pair}',
    level: 5, length: 'medium', minutes: 4,
    params: { root: 'any', pair: [
      { v: ['1', '2', '3', '4', '5', '6'], label: 'Ionian: I + ii (major chord)' },
      { v: ['1', 'b3', '4', '5', '6', 'b7'], label: 'Dorian: ♭III + IV (So What-type minor 7)' },
      { v: ['1', '2', 'b3', '4', '6', '7'], label: 'melodic minor: vi° + vii° (minor 6 chord)', lvl: 1 },
      { v: ['1', '2', '3', '#4', '5', '6'], label: 'Lydian: I + II (maj7♯11)', lvl: 1 },
    ], caged: CAGED },
    prompt: 'Over a **{root}** drone, alternate the two triads of **{p:pair}** in the **{p:caged}**: one triad, the other a step higher, the first again a step higher… (the six notes form a hexatonic scale). Then comp with them: one triad on beat 1, the other on the "and" of 2.',
    goal: 'Both triads heard clearly; lines and comping both stay inside the six notes.',
    tempo: { start: 60, min: 40, max: 180, step: 4, unit: 'bpm' },
    metronome: { meter: '4/4', subdivision: 2, swing: 0, accent: true },
    drone: { note: '$root', fifth: true },
    hints: ['Adjacent triads share no notes, so together they always give six different notes.', 'Dorian ♭III–IV: the IV → ♭III movement is the classic modal-jazz comping sound.'],
    explain: `### Triad pairs from a mode
Two triads a step apart in a scale share no notes, so they fill six of its seven degrees. Taking one away (usually the avoid note) leaves a hexatonic scale with a strong, clear sound. Each mode has a few good pairs:
- Ionian ii over I: a suspension that resolves.
- Dorian IV and ♭III: modal-jazz comping.
- Melodic minor vi° and vii°: dark, symmetrical colour over a minor 6.`,
    visual: { type: 'scale', root: '$root', tones: '$pair', region: { caged: '$caged' } },
    demo: { type: 'scale', root: '$root', tones: '$pair', region: { caged: '$caged' }, sequence: { kind: 'triads' }, beatsPerNote: 0.5 },
    concepts: ['triad-pairs', 'triad-sub-vs-sus'], vary: ['pair', 'root', 'caged'], source: SRC(V.tpComp.title),
  },
  {
    id: 'mb-tp-harmonic-minor-V', mode: 'play', category: 'arpeggios', tags: ['marbin', 'triad-pairs', 'harmonic-minor', 'dominant', 'minor-ii-v-i'],
    title: 'Harmonic-minor triad pair over {root}7: ii° + ♭III+',
    level: 6, length: 'medium', minutes: 4,
    params: { root: 'any', caged: CAGED },
    prompt: 'Over **{root}7** as the V of a minor key, alternate the minor key\'s **ii° triad** (the 5, ♭7, ♭9 of {root}7) and its **♭III augmented triad** (♭13, 1, 3) in the **{p:caged}**. Resolve each line to the 5th or root of the minor tonic.',
    goal: 'The two triads alternate cleanly and resolve to the minor i chord.',
    tempo: { start: 56, min: 40, max: 180, step: 4, unit: 'bpm' },
    metronome: SWING,
    hints: ['In C minor over G7: D° (D F A♭) and E♭+ (E♭ G B).', 'Together: G A♭ B D E♭ F, the V’s Phrygian dominant without its 4th.'],
    explain: 'Harmonic minor builds a diminished ii and an augmented ♭III. Over the V7 they spell b9, b13, the 3rd and the ♭7: exactly the tensions of a minor-key dominant, arranged as two easy triads.',
    visual: { type: 'scale', root: '$root', tones: ['1', 'b9', '3', '5', 'b13', 'b7'], region: { caged: '$caged' } },
    demo: [
      { type: 'arpeggio', root: '$root', tones: ['5', 'b7', 'b9'], region: { caged: '$caged' }, path: 'ascending', beatsPerNote: 0.5, title: 'ii° of the minor key (5 ♭7 ♭9)' },
      { type: 'arpeggio', root: '$root', tones: ['b13', '1', '3'], region: { caged: '$caged' }, path: 'ascending', beatsPerNote: 0.5, title: '♭III+ of the minor key (♭13 1 3)' },
      { type: 'scale', root: '$root', tones: ['1', 'b9', '3', '5', 'b13', 'b7'], region: { caged: '$caged' }, sequence: { kind: 'triads' }, beatsPerNote: 0.5, title: 'Alternating the pair' },
    ],
    concepts: ['triad-pairs', 'harmonic-minor-modes', 'minor-ii-v-i'], vary: ['root', 'caged'], source: SRC(V.tpAlt.title),
  },

  // ===================== 6. Speed picking =====================
  {
    id: 'mb-speed-joe-pass-triplets', mode: 'play', category: 'picking', tags: ['marbin', 'picking', 'joe-pass', 'triplets', 'sweep-picking', 'economy-picking'],
    title: 'Joe Pass triplets: 1 + 2 note-per-string triads on {chord}',
    level: 5, length: 'medium', minutes: 3,
    params: { root: ['C', 'G', 'A', 'F'], quality: ['maj', 'min'] },
    prompt: 'Play **{chord}** triad arpeggios as triplets with **one note on the lower string and two on the higher**. Picking: **down, down, up**: the first down sweeps straight into the second string, then a wide upstroke clears the strings so the next group can start with a down again.',
    goal: 'Even triplets at speed with no extra motion; the up-stroke escapes cleanly.',
    tempo: { start: 60, min: 40, max: 200, step: 4, unit: 'bpm' },
    metronome: { meter: '4/4', subdivision: 3, swing: 0, accent: true },
    hints: ['Down-down is one motion (a two-string sweep).', 'The up-stroke is deliberately wide: it lifts out so the next down can fall onto the lower string.', 'Move the shape through the inversions up the neck.'],
    explain: 'This is the economy-picking engine behind Joe Pass-style triplet runs: each 3-note group is a tiny sweep plus one escape stroke, so the hand never works against the direction of travel. Start slow; speed comes from relaxation, not force.',
    visual: { type: 'arpeggio', root: '$root', quality: '$quality', region: { strings: [4, 3], frets: [0, 12] } },
    demo: { type: 'rhythm', meter: '4/4', grid: 3, bars: 1, pick: '4 3 3 4 3 3 4 3 3 4 3 3', strokes: 'D D U D D U D D U D D U', chord: { root: '$root', quality: '$quality' }, accents: [0, 3, 6, 9] },
    concepts: ['economy-picking', 'sweep-picking', 'triplets'], vary: ['root', 'quality', 'tempo'], source: SRC(V.speed.title),
  },
  {
    id: 'mb-speed-8-note', mode: 'play', category: 'picking', tags: ['marbin', 'picking', 'double-time', 'economy-picking', 'legato'],
    title: 'The 8-note double-time cell: 3 + 2 with a pull-off',
    level: 6, length: 'medium', minutes: 3,
    params: { key: 'major' },
    prompt: 'Take an 8-note 16th cell from **{key}**: three notes on one string, two on the next, and back. Stroke recipe: **down–up–down** (3 notes), **sweep** down onto the next string, a **big upstroke**, a **pull-off**, then **down–up**. Loop it in 16ths, then move it up the scale.',
    goal: 'The cell loops in 16ths with every stroke in place and the pull-off in time.',
    tempo: { start: 56, min: 40, max: 160, step: 4, unit: 'bpm' },
    metronome: { meter: '4/4', subdivision: 4, swing: 0, accent: true },
    hints: ['The strings here are one way to lay it out; the stroke pattern is the point.', 'The pull-off gives the picking hand a breath to reset.'],
    explain: 'Double-time bebop lines need a mix of sweeps, escape strokes and slurs. Practising one cell until the strokes are automatic is faster than trying to alternate-pick everything.',
    visual: { type: 'scale', root: '$key', scale: 'major', region: { strings: [3, 2], frets: [2, 9] } },
    demo: { type: 'rhythm', meter: '4/4', grid: 4, bars: 1, pick: '3 3 3 2 2 2 3 3 3 3 3 2 2 2 3 3', strokes: 'D U D D U - D U D U D D U - D U', accents: [0, 8] },
    concepts: ['economy-picking', 'subdivisions'], vary: ['key', 'tempo'], source: SRC(V.speed.title),
  },
  {
    id: 'mb-speed-6-note', mode: 'play', category: 'picking', tags: ['marbin', 'picking', 'sextuplets', 'legato'],
    title: 'The 6-note cell: four picks, two pull-offs',
    level: 5, length: 'short', minutes: 3,
    params: { key: 'minor' },
    prompt: 'A 6-note sextuplet cell in **{key}**, pick-pick-pull, pick-pick-pull: **down, up, (pull-off), down, up, (pull-off)**. Four picked notes and two slurs per beat. Loop, then move the cell up the scale.',
    goal: 'Even sextuplets; the slurred notes as loud as the picked ones.',
    tempo: { start: 50, min: 36, max: 140, step: 4, unit: 'bpm' },
    metronome: { meter: '4/4', subdivision: 6, swing: 0, accent: true },
    hints: ['The pull-off is a small sideways flick, not a lift.', 'Accent beat 1 of each cell to keep your place.'],
    explain: 'Replacing every third pick with a pull-off halves the work at the speed where alternate picking starts to tense up, while the cell still sounds even.',
    visual: { type: 'scale', root: '$key', scale: 'minor-pentatonic', region: { box: 1 } },
    demo: { type: 'rhythm', meter: '4/4', grid: 6, bars: 1, pick: '2 2 2 1 1 1 2 2 2 1 1 1 2 2 2 1 1 1 2 2 2 1 1 1', strokes: 'D U - D U - D U - D U - D U - D U - D U - D U -', accents: [0, 6, 12, 18] },
    concepts: ['tuplets', 'alternate-picking'], vary: ['key', 'tempo'], source: SRC(V.speed.title),
  },
  {
    id: 'mb-speed-muting', mode: 'play', category: 'picking', tags: ['marbin', 'picking', 'muting', 'palm-muting'],
    title: 'Muting check: palm + fretting fingers at speed',
    level: 4, length: 'short', minutes: 2,
    params: { root: ['A', 'G', 'C'], quality: ['min', 'maj'] },
    prompt: 'Pick across the strings of **{chord}** in 16ths. The **picking-hand palm** rests on the strings below the one you play; the **fretting fingers** lightly touch the strings above. Only one note may ring at a time.',
    goal: 'Stop picking at any moment: nothing should keep ringing.',
    tempo: { start: 60, min: 40, max: 160, step: 4, unit: 'bpm' },
    metronome: { meter: '4/4', subdivision: 4, swing: 0, accent: true },
    hints: ['Record yourself: ringing strings are easier to hear on playback.', 'The palm follows the pick across the strings.'],
    explain: 'Fast lines sound messy mostly because of noise, not wrong notes. Two-handed muting is what makes speed sound clean.',
    visual: { type: 'rhythm', meter: '4/4', grid: 4, bars: 1, pick: '5 4 3 2 1 2 3 4 5 4 3 2 1 2 3 4', strokes: 'D D D D D U U U D D D D D U U U', chord: { root: '$root', quality: '$quality' }, accents: [0, 4, 8, 12] },
    concepts: ['palm-muting', 'sweep-picking'], vary: ['root', 'quality', 'tempo'], source: SRC(V.speed.title),
  },

  // ===================== 7. Omitting the ii =====================
  {
    id: 'mb-omit-ii-rule', mode: 'theory', category: 'theory', tags: ['harmony', 'marbin', 'joe-pass', 'think-dominant', 'ii-v-i'],
    title: 'When can you forget the ii chord?',
    level: 4, length: 'short',
    prompt: 'Joe Pass often said he only thought of the V in a ii–V. Decide when that works.',
    quiz: { kind: 'choice', question: 'In which situation is it safest to play only over the V7 and ignore the ii?', choices: ['A plain ii–V–I cadence (Dm7 G7 | Cmaj7)', 'A cycle where the ii is itself the target of the previous chord (e.g. the Fly Me to the Moon-type sequence)', 'A minor ii–V where the ii is the only half-diminished chord', 'Never: the ii always has to be played'], answer: 0, explain: 'In a cadence the ii is a **suspension of the V** (Dm7 ≈ G9sus), so V-thinking covers it. In a cycle of 4ths, each chord is the resolution of the one before, so skipping it loses the target the line is aiming at.' },
    hints: ['Dm7 = G7sus4 with a 9th and no root.', 'In a cycle, every chord is both a target and a starting point.'],
    explain: 'Simplify where the harmony is functional, keep detail where a chord is a destination. Reducing a tune to its strong chords is a step toward hearing the form rather than reading it.',
    concepts: ['think-dominant', 'ii-v-i'], source: SRC(V.joe.title),
  },
  {
    id: 'mb-omit-ii-alice', mode: 'play', category: 'progressions', tags: ['marbin', 'joe-pass', 'blues', 'bird-blues', 'reduction', 'think-dominant'],
    title: 'Bird blues reduction: keep the strong chords ({key})',
    level: 6, length: 'medium', minutes: 4,
    params: { key: ['F', 'Bb', 'C', 'G'] },
    prompt: 'Comp the Blues for Alice-type (Bird) changes in **{key}**, then the **reduced** version: drop the ii of each ii–V and drop the weak V/V in bar 3, but **keep the vi** that bar 3 lands on. Solo over the reduced form, then go back to the full one and hear that your lines still fit.',
    goal: 'Lines built on the reduced chart that still sound right over the full one.',
    tempo: { start: 100, min: 70, max: 240, step: 5, unit: 'bpm' },
    metronome: SWING,
    hints: ['Bar 2: Eø7 A7 → just A7 (heading to Dm7).', 'Bar 3: Dm7 G7 → just Dm7 (the vi is the real target; G7 is a weak V/V).', 'The reduction shown is one reasonable version, not the only one.'],
    explain: 'The Bird blues is a chain of ii–Vs. Thinking of each pair as its V (and keeping the chords that are true destinations) cuts the chord count in half and leaves a form you can hear and improvise on more freely.',
    visual: { type: 'progression', key: '$key', chart: '| I:maj7 | III:7 | vi:m7 | I:7 | IV:7 | bVII:7 | VI:7 | bVI:7 | ii:m7 | V:7 | I:maj7 VI:7 | ii:m7 V:7 |', voiceLead: true },
    demo: [
      { type: 'progression', key: '$key', chart: '| I:maj7 | vii:m7b5 III:7 | vi:m7 II:7 | v:m7 I:7 | IV:7 | iv:m7 bVII:7 | iii:m7 VI:7 | biii:m7 bVI:7 | ii:m7 | V:7 | I:maj7 VI:7 | ii:m7 V:7 |', voiceLead: true, title: 'Full Bird-blues changes' },
      { type: 'progression', key: '$key', chart: '| I:maj7 | III:7 | vi:m7 | I:7 | IV:7 | bVII:7 | VI:7 | bVI:7 | ii:m7 | V:7 | I:maj7 VI:7 | ii:m7 V:7 |', voiceLead: true, title: 'Reduced: think the V, keep the vi' },
    ],
    concepts: ['think-dominant', 'blues-forms', 'ii-v-i'], vary: ['key'], source: SRC(V.joe.title),
  },

  // ===================== 8. Counterpoint =====================
  {
    id: 'mb-cp-contrary-6dim', mode: 'play', category: 'scales', tags: ['marbin', 'counterpoint', 'contrary-motion', 'sixth-diminished', 'barry-harris'],
    title: 'Contrary motion in the {root} 6th-diminished scale',
    level: 6, length: 'medium', minutes: 4,
    params: { key: 'major', caged: CAGED },
    prompt: 'Two voices in the **{root} major 6th-diminished** scale, in the **{p:caged}**: the low voice climbs from {root}, the high voice falls from the top. Move them **at the same time** (as dyads), one scale step each.\n\nListen to how the pairs alternate: chord-tone with chord-tone, then diminished with diminished. Because the scale alternates, the same moves keep repeating.',
    goal: 'Smooth two-voice contrary motion with both voices ringing.',
    tempo: { start: 50, min: 36, max: 140, step: 4, unit: 'bpm' },
    metronome: STRAIGHT,
    hints: ['Use two fingers (or pick + finger) so the dyads ring together.', 'Start with the outer voices an octave or two apart and stop when they meet.'],
    explain: `### Counterpoint the easy way
In an 8-note scale where chord tones and diminished tones alternate, two voices moving in contrary motion always land chord-tone against chord-tone, then diminished against diminished. So every second dyad is consonant tonic and every other one is "motion": counterpoint that never goes wrong. The demo plays the scale; combine the voices yourself.`,
    visual: { type: 'scale', root: '$key', tones: BH_SCALES[0].v, region: { caged: '$caged' } },
    demo: { type: 'scale', root: '$key', tones: BH_SCALES[0].v, region: { caged: '$caged' }, path: 'up-and-down', beatsPerNote: 0.5 },
    concepts: ['contrary-motion', 'sixth-diminished'], vary: ['key', 'caged'], source: SRC(V.cp.title),
  },
  {
    id: 'mb-cp-two-pianos', mode: 'play', category: 'voicings', tags: ['marbin', 'counterpoint', 'contrary-motion', 'triads', 'two-hands'],
    title: 'Two 3-string pianos: contrary triads in {key}',
    level: 6, length: 'medium', minutes: 4,
    params: { key: ['C', 'G', 'F', 'D', 'A'] },
    prompt: 'Treat the guitar as two little pianos: strings **3-2-1** (right hand) and **6-5-4** (left hand). On the top piano, walk **I → vii° → I → vii°…** upward through the inversions. On the bottom piano, walk the same alternation **downward**. Learn each piano alone, then play them as answering phrases, top then bottom.',
    goal: 'Both walks memorised; you can alternate top and bottom without hesitation.',
    tempo: { start: 60, min: 40, max: 140, step: 4, unit: 'bpm' },
    metronome: STRAIGHT,
    hints: ['vii° (the diminished triad on 7) is the motion chord between the tonic triads.', 'When a walk runs out of neck, the demo jumps an octave: carry on in the same direction.', 'Every move is the same kind of move, because tonic and diminished alternate.'],
    explain: 'Splitting the neck into two 3-string groups gives two independent voices with their own registers. Moving them in opposite directions is the simplest counterpoint on guitar, and the tonic/diminished alternation keeps every arrival consonant.',
    visual: { type: 'progression', key: '$key', chart: '| I:maj/1 vii:dim/b3 | I:maj/3 vii:dim/b5 | I:maj/5 vii:dim/1 | I:maj/1 |', voicing: 'close', stringSet: [3, 2, 1], voiceLead: true, startFret: 4 },
    demo: [
      { type: 'progression', key: '$key', chart: '| I:maj/1 vii:dim/b3 | I:maj/3 vii:dim/b5 | I:maj/5 vii:dim/1 | I:maj/1 |', voicing: 'close', stringSet: [3, 2, 1], voiceLead: true, startFret: 4, title: 'Top piano (3-2-1), climbing' },
      { type: 'progression', key: '$key', chart: '| I:maj/1 vii:dim/1 | I:maj/5 vii:dim/b5 | I:maj/3 vii:dim/b3 | I:maj/1 |', voicing: 'close', stringSet: [6, 5, 4], voiceLead: true, startFret: 12, title: 'Bottom piano (6-5-4), falling' },
    ],
    concepts: ['contrary-motion', 'close-triads'], vary: ['key'], source: SRC(V.cp.title),
  },

  // ===================== 9. Phrasing at three tempos =====================
  {
    id: 'mb-phrase-medium', mode: 'play', category: 'improv', tags: ['marbin', 'phrasing', 'swing', 'singing', 'medium-tempo'],
    title: 'Medium swing at 60: sing it, then play it ({key})',
    level: 3, length: 'medium', minutes: 4,
    params: { key: 'major' },
    prompt: 'Loop a ii–V–I in **{key}** at **60 bpm**, click on 2 and 4. **Sing** a two-bar line first, then play exactly what you sang. Slow enough to place every 8th note deliberately: long-short swing, accents on the off-beats.',
    goal: 'Your played line matches the sung one in rhythm and accents.',
    tempo: { start: 60, min: 50, max: 120, step: 5, unit: 'bpm' },
    metronome: SWING,
    hints: ['If you can’t sing it, it’s not a phrase yet.', 'Slow tempos expose time: lean on beats 2 and 4.'],
    explain: 'Medium tempos are where you build vocabulary and feel. At 60, every note is a choice; singing first makes the phrase musical before the fingers get involved.',
    visual: { type: 'progression', key: '$key', chart: '| ii:m7 | V:7 | I:maj7 | % |', voiceLead: true },
    demo: { type: 'progression', key: '$key', chart: '| ii:m7 | V:7 | I:maj7 | % |', voiceLead: true },
    concepts: ['swing', 'click-placement'], vary: ['key'], source: SRC(V.phrase.title),
  },
  {
    id: 'mb-phrase-uptempo', mode: 'play', category: 'improv', tags: ['marbin', 'phrasing', 'up-tempo', 'half-time'],
    title: 'Up-tempo: feel it in half time ({key})',
    level: 6, length: 'medium', minutes: 4,
    params: { key: 'major' },
    prompt: 'A ii–V–I in **{key}** at a fast tempo. Don’t count every beat: tap your **foot on 2 and 4 only** (the click), so it feels like a relaxed half-time groove. Phrase in long, simple shapes over that slow pulse.',
    goal: 'Relaxed lines at speed; the body moves at half the tempo.',
    tempo: { start: 200, min: 160, max: 320, step: 10, unit: 'bpm' },
    metronome: SWING,
    hints: ['At 240, the 2-and-4 foot is a comfortable 120.', 'Fewer notes, better placed: quarter notes and 8th-note bursts.'],
    explain: 'Fast tempos feel frantic if you try to feel every beat. Feeling them in half time calms the body and makes long phrases possible.',
    visual: { type: 'progression', key: '$key', chart: '| ii:m7 | V:7 | I:maj7 | % |', voiceLead: true },
    demo: { type: 'progression', key: '$key', chart: '| ii:m7 | V:7 | I:maj7 | % |', voiceLead: true },
    concepts: ['swing', 'click-placement'], vary: ['key'], source: SRC(V.phrase.title),
  },
  {
    id: 'mb-phrase-ballad', mode: 'play', category: 'improv', tags: ['marbin', 'phrasing', 'ballad', 'double-time'],
    title: 'Ballad: feel double-time 8ths ({key})',
    level: 5, length: 'medium', minutes: 4,
    params: { key: 'major' },
    prompt: 'A slow ii–V–I in **{key}** (50 bpm). Feel the space as **double-time swung 8ths** (swung 16ths at this tempo): it fills the long beats with a pulse to phrase against, so held notes and quick runs both sit in time.',
    goal: 'Long notes and fast fills both lock to the double-time pulse.',
    tempo: { start: 50, min: 40, max: 80, step: 2, unit: 'bpm' },
    metronome: { meter: '4/4', subdivision: 2, swing: 0, accent: true },
    hints: ['Count "1 e & a" with a swing lilt.', 'Double-time runs should land on a chord tone at the end of the beat.'],
    explain: 'At ballad tempos the beat is so long that time gets vague. Feeling double-time keeps a pulse under the line.',
    visual: { type: 'rhythm', meter: '4/4', grid: 4, bars: 1, swing: 0.67, pick: '1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1', strokes: 'D U D U D U D U D U D U D U D U', accents: [0, 4, 8, 12], title: 'The double-time pulse (swung 16ths)' },
    demo: [
      { type: 'rhythm', meter: '4/4', grid: 4, bars: 1, swing: 0.67, pick: '1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1', strokes: 'D U D U D U D U D U D U D U D U', accents: [0, 4, 8, 12], title: 'Feel this…' },
      { type: 'progression', key: '$key', chart: '| ii:m7 | V:7 | I:maj7 | % |', voiceLead: true, title: '…under the ballad changes' },
    ],
    concepts: ['swing', 'subdivisions'], vary: ['key'], source: SRC(V.phrase.title),
  },

  // ===================== 10. Funk mechanics =====================
  {
    id: 'mb-funk-shaker-drums', mode: 'play', category: 'styles', tags: ['marbin', 'funk', 'strumming', 'muting', 'forearm-rotation'],
    title: 'Funk hand: shaker vs three drums on {chord}',
    level: 4, length: 'medium', minutes: 4,
    params: { root: ['E', 'A', 'D'], quality: ['9', 'm7'] },
    prompt: 'Two right-hand settings, same 16th motion (rotate the **forearm**, don’t flap the wrist; hold the pick lightly):\n- **Shaker**: fingers straight, the hand brushes **all strings** on every stroke, muted, with accents on 2 and 4.\n- **Three drums**: make a loose fist and aim at three zones: **low** strings, **middle**, **high**, like a drummer’s kick, snare and hats.',
    goal: 'Even 16th motion in both settings; you can switch zone without losing the groove.',
    tempo: { start: 80, min: 60, max: 120, step: 2, unit: 'bpm' },
    metronome: { meter: '4/4', subdivision: 4, swing: 0, accent: true, clickOn: '2&4' },
    hints: ['Rotation = turning a doorknob; the elbow stays relaxed.', 'Light grip: the pick should give a little on every stroke.'],
    explain: 'Funk rhythm guitar is mechanics first: a forearm rotation that never stops, a loose pick, and control over **which strings** the stroke hits. The straight-finger "shaker" gives an even wash; the fist "three drums" lets you play a drum kit with one hand.',
    visual: { type: 'rhythm', meter: '4/4', grid: 4, bars: 1, pattern: 'dudu Dudu dudu Dudu', accents: [4, 12], chord: { root: '$root', quality: '$quality' } },
    demo: [
      { type: 'rhythm', meter: '4/4', grid: 4, bars: 1, pattern: 'dudu Dudu dudu Dudu', accents: [4, 12], chord: { root: '$root', quality: '$quality' }, title: 'Shaker: all strings, muted, backbeat accents' },
      { type: 'rhythm', meter: '4/4', grid: 4, bars: 1, pick: '6+5+4 - 2+1 - 4+3 - 2+1 - 6+5+4 - 2+1 - 4+3 2+1 - -', strokes: 'D - U - D - U - D - U - D U - -', chord: { root: '$root', quality: '$quality' }, title: 'Three drums: low, middle, high' },
    ],
    concepts: ['funk-16ths', 'constant-motion'], vary: ['root', 'quality', 'tempo'], source: SRC(V.funk.title),
  },
  {
    id: 'mb-funk-ddu', mode: 'play', category: 'rhythm', tags: ['marbin', 'funk', 'strumming', 'groupings', 'sixteenths'],
    title: 'Down–down–up threes across the bar on {chord}',
    level: 5, length: 'short', minutes: 3,
    params: { root: ['E', 'A', 'D', 'G'], quality: ['9', 'm7', '7'] },
    prompt: 'Strum groups of three 16ths, **down–down–up**, over and over. Sixteen groups take exactly three bars, so the accent drifts across the beat and comes home on bar 4. Accent the first down of each group.',
    goal: 'Three clean bars of threes that land back on beat 1.',
    tempo: { start: 66, min: 50, max: 110, step: 2, unit: 'bpm' },
    metronome: { meter: '4/4', subdivision: 4, swing: 0, accent: true },
    hints: ['Count 16ths aloud to see where each group starts.', 'Keep the two downs from becoming one strum: two separate strokes.'],
    explain: 'Groups of three against a four-based bar are the source of a lot of funk tension. Playing them with a fixed stroke shape (D D U) makes the cross-rhythm physical.',
    visual: { type: 'rhythm', meter: '4/4', grid: 4, bars: 3, pattern: 'DDUDDUDDUDDUDDUD DUDDUDDUDDUDDUDD UDDUDDUDDUDDUDDU', accents: [0, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 39, 42, 45], chord: { root: '$root', quality: '$quality' } },
    concepts: ['groupings', 'funk-16ths'], vary: ['root', 'quality', 'tempo'], source: SRC(V.funk.title),
  },
  {
    id: 'mb-funk-bursts', mode: 'play', category: 'rhythm', tags: ['marbin', 'funk', 'strumming', 'sextuplets', 'thirty-seconds'],
    title: 'Funk bursts: 6-strokes and 32nds on {chord}',
    level: 6, length: 'medium', minutes: 3,
    params: { root: ['E', 'A', 'D'], quality: ['9', 'm7'] },
    prompt: 'Short bursts from a relaxed hand: first **six-stroke** sextuplet bursts alternating with muted 8ths, then **32nd-note** bursts inside a muted 16th groove. The burst comes from the same forearm rotation, just faster and smaller.',
    goal: 'Bursts in time, no tension creeping into the rest of the groove.',
    tempo: { start: 60, min: 46, max: 100, step: 2, unit: 'bpm' },
    metronome: { meter: '4/4', subdivision: 2, swing: 0, accent: true },
    hints: ['Smaller motion = faster burst.', 'Land the beat after a burst exactly in time: that is what sells it.'],
    explain: 'Bursts are ornaments on top of the groove, like a drummer’s ruff. They only work if the main motion stays loose.',
    visual: { type: 'rhythm', meter: '4/4', grid: 6, bars: 1, pattern: 'DUDUDU d--u-- DUDUDU d--u--', chord: { root: '$root', quality: '$quality' }, accents: [0, 12] },
    demo: [
      { type: 'rhythm', meter: '4/4', grid: 6, bars: 1, pattern: 'DUDUDU d--u-- DUDUDU d--u--', chord: { root: '$root', quality: '$quality' }, accents: [0, 12], title: '6-stroke bursts' },
      { type: 'rhythm', meter: '4/4', grid: 8, bars: 1, pattern: 'd-u-d-u- DUDUDUDU d-u-d-u- d-u-DUDU', chord: { root: '$root', quality: '$quality' }, accents: [8, 28], title: '32nd bursts' },
    ],
    concepts: ['tuplets', 'funk-16ths'], vary: ['root', 'quality', 'tempo'], source: SRC(V.funk.title),
  },

  // ===================== 11. Outlining changes =====================
  {
    id: 'mb-lines-happy-birthday', mode: 'play', category: 'progressions', tags: ['marbin', 'outlining', 'chord-melody', 'public-domain', '3/4'],
    title: 'Outline the changes of Happy Birthday in {key}',
    level: 3, length: 'medium', minutes: 4,
    params: { key: ['C', 'F', 'G', 'D', 'Bb'] },
    prompt: 'Start simple: **Happy Birthday** in **{key}** (3/4). 1) Play the melody with the chords. 2) Sing the **bass line** (roots). 3) Improvise a line in quarter notes that hits a chord tone on every downbeat. 4) Same in 8th notes: a written-out étude through the form.',
    goal: 'An 8th-note étude through the form where every bar clearly spells its chord.',
    tempo: { start: 80, min: 60, max: 160, step: 4, unit: 'bpm' },
    metronome: { meter: '3/4', subdivision: 1, swing: 0, accent: true },
    hints: ['Chords: I, I, V7, V7, I, I7, IV, I–V7, I.', 'Downbeat = chord tone; the rest of the bar can travel.', 'Then use the same process on a slightly harder song, then on All of Me-type changes.'],
    explain: `### Outlining = making the chords audible in a single line
Begin with a tune everyone knows, where the harmony is obvious. Sing the roots, then build lines in units: half notes, quarter notes, 8th notes. Each step keeps the chord audible while adding motion. Chunk any tune 4 bars at a time this way.`,
    visual: { type: 'chordMelody', key: '$key', scale: 'major', meter: '3/4', melody: HAPPY_BDAY, chart: '| I:maj | I:maj | V:7 | V:7 | I:maj | I:7 | IV:maj | I:maj V:7 | I:maj |', style: 'triad-top' },
    demo: { type: 'chordMelody', key: '$key', scale: 'major', meter: '3/4', melody: HAPPY_BDAY, chart: '| I:maj | I:maj | V:7 | V:7 | I:maj | I:7 | IV:maj | I:maj V:7 | I:maj |', style: 'triad-top' },
    concepts: ['chord-tone-targeting', 'chord-melody'], vary: ['key'], source: SRC(V.lines.title) + '; melody: Hill sisters (1893), public domain',
  },
  {
    id: 'mb-lines-4bar-chunks', mode: 'play', category: 'improv', tags: ['marbin', 'outlining', 'all-of-me', 'chunking', 'bass-lines'],
    title: 'All of Me-type changes, 4 bars at a time: {p:chart}',
    level: 4, length: 'medium', minutes: 4,
    params: { key: ['C', 'F', 'G', 'Bb'], chart: ALL_OF_ME },
    prompt: 'Work on **{p:chart}** of an All of Me-type form in **{key}** only. Order: **sing the bass line** (roots, then a walking line), arpeggiate each chord, then write and play an 8th-note line that moves to the **nearest chord tone** at each change. When it is solid, add the next 4 bars.',
    goal: 'The 4-bar chunk outlined in 8th notes with smooth, step-wise changes.',
    tempo: { start: 80, min: 60, max: 200, step: 5, unit: 'bpm' },
    metronome: SWING,
    hints: ['The dominants (III7, VI7, II7) each lead a 5th down: aim at the 3rd of the next chord.', 'Approach a target from a half step below or a scale step above.'],
    explain: 'A form learned in 4-bar chunks is learned properly; a form played top-to-bottom every time is learned badly in the hard places. Each chunk gets bass line, arpeggios and an étude before you move on.',
    visual: { type: 'progression', key: '$key', chart: '$chart', voiceLead: true, walk: 'arpeggio' },
    demo: { type: 'progression', key: '$key', chart: '$chart', voiceLead: true, walk: 'arpeggio' },
    concepts: ['chord-tone-targeting', 'secondary-dominants'], vary: ['chart', 'key'], source: SRC(V.lines.title),
  },
  {
    id: 'mb-lines-triad-proximity', mode: 'play', category: 'voicings', tags: ['marbin', 'outlining', 'voice-leading', 'triads', 'all-of-me'],
    title: 'Voice-lead triads through the form ({key}, {stringSet})',
    level: 4, length: 'medium', minutes: 4,
    params: { key: ['C', 'F', 'G', 'Bb'], stringSet: [{ v: [3, 2, 1] }, { v: [4, 3, 2] }] },
    prompt: 'Reduce the All of Me-type changes in **{key}** to **triads** and play them on strings **{stringSet}**, always choosing the inversion **closest** to the last chord. Then use the top notes of those triads as the skeleton of a melody line.',
    goal: 'The whole 16 bars with no jumps; you can sing the top voice.',
    tempo: { start: 72, min: 50, max: 180, step: 5, unit: 'bpm' },
    metronome: SWING,
    hints: ['Dominants as plain major triads: III7 → III, VI7 → VI.', 'Common tones stay on the same fret.'],
    explain: 'Triads voice-led by proximity give a smooth line of guide tones through any form. That line is a ready-made melodic skeleton for improvising.',
    visual: { type: 'progression', key: '$key', chart: '| I:maj | % | III:maj | % | VI:maj | % | ii:min | % | III:maj | % | vi:min | % | II:maj | % | ii:min | V:maj |', voicing: 'close', stringSet: '$stringSet', voiceLead: true },
    demo: { type: 'progression', key: '$key', chart: '| I:maj | % | III:maj | % | VI:maj | % | ii:min | % | III:maj | % | vi:min | % | II:maj | % | ii:min | V:maj |', voicing: 'close', stringSet: '$stringSet', voiceLead: true },
    concepts: ['voice-leading-basics', 'close-triads', 'guide-tones'], vary: ['key', 'stringSet'], source: SRC(V.lines.title),
  },

  // ===================== 12. Diminished families =====================
  {
    id: 'mb-dim-three-families', mode: 'theory', category: 'theory', tags: ['harmony', 'marbin', 'diminished', 'substitution'],
    title: 'Three diminished families on {rn:I:maj}',
    level: 5, length: 'short',
    params: { key: 'major' },
    prompt: 'A diminished 7th chord can sit on three different groups of degrees of the chord you are on. Name the three families and what each does, then reveal.',
    quiz: { kind: 'reveal', question: 'Diminished chords related to **{rn:I:maj}**: which three families, and what does each do?', answer: '1. **On ♭2, 3, 5, ♭7** ({rn:iii:dim7}): it turns the chord into a **dominant** ({rn:I:7b9} without root), heading to {rn:IV:maj}.\n2. **On 2, 4, ♭6, 7** ({rn:vii:dim7}): the **V of the chord you are on** ({rn:V:7b9} without root): Barry Harris\' motion chord, resolving back to {rn:I:maj}.\n3. **On the root** ({rn:I:dim7}): a **tonic diminished suspension**: shares the root and returns to {rn:I:maj}.\n\nThere are only three diminished 7th chords in total, so every diminished chord you see belongs to one of these three.' },
    hints: ['Families 1 and 2 are rootless 7♭9 chords; family 3 is a common-tone chord.', 'Passing chords like ♯iv° and ♭iii° are family-2 or family-1 chords of the chord they lead into.'],
    explain: 'Instead of memorising a separate rule for every diminished chord, ask which family it is relative to the chord it decorates. That tells you whether it is pulling away (dominant), pulling back (V of here), or hovering (suspension).',
    concepts: ['passing-diminished', 'common-tone-diminished', 'dim7-rootless-dominant'], vary: ['key'], source: SRC(V.dim.title),
  },
  {
    id: 'mb-dim-families-play', mode: 'play', category: 'progressions', tags: ['marbin', 'diminished', 'passing-chords', 'drop2'],
    title: 'Diminished in action: {p:chart} in {key}',
    level: 5, length: 'short', minutes: 3,
    params: { key: 'major', chart: [
      { v: '| I:6 | iii:dim7 | IV:maj7 | % |', label: 'family 1: °7 on the 3rd makes I a dominant → IV' },
      { v: '| I:6 vii:dim7/b3 | I:6/3 vii:dim7/b5 | I:6/5 | % |', label: 'family 2: °7 on 2-4-♭6-7 = V of here (Barry Harris)' },
      { v: '| I:6 | I:dim7 | I:6 | % |', label: 'family 3: °7 on the root (suspension)' },
      { v: '| IV:6 | #iv:dim7 | I:6/5 | VI:7 |', label: '♯iv° passing (All of Me-type)', lvl: 1 },
      { v: '| iii:m7 | biii:dim7 | ii:m7 | V:7 |', label: '♭iii° passing down to ii', lvl: 1 },
    ], stringSet: [{ v: [4, 3, 2, 1] }, { v: [5, 4, 3, 2] }] },
    prompt: 'Play **{p:chart}** in **{key}** in drop 2 on strings {stringSet}. For the diminished chord, say which family it belongs to relative to the chord it **leads into**, and which voices move.',
    goal: 'Each diminished chord named by family, voice-led smoothly in and out.',
    tempo: { start: 66, min: 50, max: 180, step: 5, unit: 'bpm' },
    metronome: SWING,
    hints: ['Passing °7s are family 2 of their target: ♯iv° = vii° of V (the I/5).', 'Common-tone °7: one voice stays, the rest move a half step.'],
    explain: 'Same symmetrical chord, three jobs. Hearing which job it does in each example is what lets you insert diminished chords on purpose.',
    visual: { type: 'progression', key: '$key', chart: '$chart', voicing: 'drop2', stringSet: '$stringSet', voiceLead: true },
    demo: { type: 'progression', key: '$key', chart: '$chart', voicing: 'drop2', stringSet: '$stringSet', voiceLead: true },
    concepts: ['passing-diminished', 'common-tone-diminished', 'sixth-diminished'], vary: ['chart', 'key', 'stringSet'], source: SRC(V.dim.title),
  },

  // ===================== 13. Reharmonising with I IV V =====================
  {
    id: 'mb-reharm-which-chord', mode: 'theory', category: 'theory', tags: ['harmony', 'marbin', 'reharmonization', 'primary-chords'],
    title: 'Every note belongs to I, IV or V ({key})',
    level: 2, length: 'short',
    params: { key: 'major' },
    prompt: 'For each degree of **{key}** (1 to 7), say which of {rn:I:maj}, {rn:IV:maj} and {rn:V:7} contains it. Reveal to check.',
    quiz: { kind: 'reveal', question: 'Which primary chords hold each degree of {key}?', answer: '- **1**: I, IV\n- **2**: V\n- **3**: I\n- **4**: IV (and V7)\n- **5**: I, V\n- **6**: IV\n- **7**: V\n\nSo any melody note can be harmonised by at least one of three chords: the starting point for reharmonisation.' },
    hints: ['I = 1 3 5, IV = 4 6 1, V7 = 5 7 2 4.'],
    explain: 'The three primary chords cover the whole major scale between them. Harmonising a melody with only I, IV and V is the base you then colour with substitutes.',
    concepts: ['diatonic-harmony', 'reharmonization'], vary: ['key'], source: SRC(V.reharm.title),
  },
  {
    id: 'mb-reharm-systems', mode: 'theory', category: 'theory', tags: ['harmony', 'marbin', 'reharmonization', 'harmonic-major', 'minor-keys'],
    title: 'I–IV–V systems: major, harmonic major and the minors',
    level: 4, length: 'short',
    prompt: 'Name the three primary chords in each system, then reveal: major, harmonic major, natural minor, harmonic minor, melodic minor. And: what is the difference between a tonal and a modal analysis?',
    quiz: { kind: 'reveal', question: 'Primary chords per system, and tonal vs modal analysis?', answer: '- **Major:** I IV V\n- **Harmonic major:** I **iv** V (the ♭6 makes IV minor)\n- **Natural minor:** i iv v\n- **Harmonic minor:** i iv **V** (raised 7)\n- **Melodic minor:** i **IV** V (raised 6 and 7)\n\n**Tonal** analysis hears chords as functions pulling to a tonic (I–IV–V). **Modal** analysis hears a scale colour held over a centre, where the characteristic note matters more than the pull.' },
    hints: ['Only one note changes between each pair of systems.'],
    explain: 'Each system keeps the same three functions (tonic, subdominant, dominant) with different colours. Knowing all five lets you reharmonise one melody in five moods.',
    concepts: ['reharmonization', 'harmonic-major', 'harmonic-minor-harmony'], source: SRC(V.reharm.title),
  },
  {
    id: 'mb-reharm-silent-night', mode: 'play', category: 'progressions', tags: ['marbin', 'reharmonization', 'chord-melody', 'public-domain', '3/4'],
    title: 'Silent Night with only I, IV and V ({key})',
    level: 4, length: 'medium', minutes: 5,
    params: { key: ['C', 'G', 'F', 'D', 'Bb'] },
    prompt: 'Harmonise **Silent Night** in **{key}** using only **I, IV and V7**: for each bar, find the melody notes and pick the primary chord that holds them. Play it as chord melody (melody on top). Then try the second version, which adds a I7 to lead into the IV.',
    goal: 'Every bar harmonised by ear-checked I, IV or V; melody on top throughout.',
    tempo: { start: 72, min: 50, max: 120, step: 4, unit: 'bpm' },
    metronome: { meter: '3/4', subdivision: 1, swing: 0, accent: true },
    hints: ['Bars with 2 and 7 in the melody want V7.', 'Bars with 6 want IV.', 'Strong-beat notes decide; passing notes don’t.'],
    explain: 'A folk melody harmonised with three chords is the cleanest way to hear the tonal pull of I–IV–V. Every later reharmonisation is a substitution for one of these.',
    visual: { type: 'chordMelody', key: '$key', scale: 'major', meter: '3/4', melody: SILENT_NIGHT, chart: '| I:maj | % | % | % | V:7 | % | I:maj | % | IV:maj | % | I:maj | % | IV:maj | % | I:maj | % | V:7 | % | I:maj | % | I:maj | V:7 | I:maj | % |', style: 'triad-top' },
    demo: [
      { type: 'chordMelody', key: '$key', scale: 'major', meter: '3/4', melody: SILENT_NIGHT, chart: '| I:maj | % | % | % | V:7 | % | I:maj | % | IV:maj | % | I:maj | % | IV:maj | % | I:maj | % | V:7 | % | I:maj | % | I:maj | V:7 | I:maj | % |', style: 'triad-top', title: 'I, IV, V only' },
      { type: 'chordMelody', key: '$key', scale: 'major', meter: '3/4', melody: SILENT_NIGHT, chart: '| I:maj | % | % | % | V:7 | % | I:maj | I:7 | IV:maj | % | I:maj | % | IV:maj | % | I:maj | % | V:7 | % | I:maj | % | I:maj | V:7 | I:maj | % |', style: 'triad-top', title: 'With a I7 leading to IV' },
    ],
    concepts: ['reharmonization', 'chord-melody'], vary: ['key'], source: SRC(V.reharm.title) + '; melody: Franz Xaver Gruber (1818), public domain',
  },
  {
    id: 'mb-reharm-god-rest', mode: 'play', category: 'progressions', tags: ['marbin', 'reharmonization', 'minor-keys', 'chord-melody', 'public-domain'],
    title: 'God Rest Ye Merry Gentlemen in three minor systems ({key})',
    level: 5, length: 'medium', minutes: 5,
    params: { key: ['Em', 'Am', 'Dm', 'Gm'] },
    prompt: 'The opening phrase of **God Rest Ye Merry Gentlemen** in **{key}**, harmonised three ways: **natural minor** (i iv v), **harmonic minor** (i iv V) and **melodic minor** (i IV V). Play each as chord melody and listen to how the mood changes while the tune stays the same.',
    goal: 'All three versions played; you can describe what the major V and the major IV each add.',
    tempo: { start: 72, min: 50, max: 140, step: 4, unit: 'bpm' },
    metronome: STRAIGHT,
    hints: ['The melody’s ♭7 (bar 2) fits the minor v but clashes with a major V: keep i there in the harmonic version.', 'The phrase ends on 5: a half cadence on v or V.'],
    explain: 'Minor keys have three primary-chord systems because the 6th and 7th degrees vary. Same melody, three systems: the v is folk-like, the V is classical and strong, the IV adds a Dorian lift.',
    visual: { type: 'chordMelody', key: '$key', melody: GOD_REST, chart: '| i:min | i:min | i:min v:min | i:min iv:min | v:min | i:min | i:min v:min | i:min iv:min | v:min |', style: 'triad-top' },
    demo: [
      { type: 'chordMelody', key: '$key', melody: GOD_REST, chart: '| i:min | i:min | i:min v:min | i:min iv:min | v:min | i:min | i:min v:min | i:min iv:min | v:min |', style: 'triad-top', title: 'Natural minor: i iv v' },
      { type: 'chordMelody', key: '$key', melody: GOD_REST, chart: '| i:min | i:min | i:min iv:min | i:min iv:min | V:maj | i:min | i:min iv:min | i:min iv:min | V:maj |', style: 'triad-top', title: 'Harmonic minor: i iv V' },
      { type: 'chordMelody', key: '$key', melody: GOD_REST, chart: '| i:min | i:min | i:min IV:maj | i:min IV:maj | V:maj | i:min | i:min IV:maj | i:min IV:maj | V:maj |', style: 'triad-top', title: 'Melodic minor: i IV V' },
    ],
    concepts: ['reharmonization', 'harmonic-minor-harmony'], vary: ['key'], source: SRC(V.reharm.title) + '; melody: traditional English carol, public domain',
  },

  // ===================== 14. Diminished suspension (blues chord soloing) =====================
  {
    id: 'mb-dimsus-theory', mode: 'theory', category: 'theory', tags: ['harmony', 'marbin', 'diminished', 'suspension', 'blues', 'upper-structures'],
    title: 'A real diminished vs an upper structure (blues in {key})',
    level: 5, length: 'short',
    params: { key: ['G', 'F', 'C', 'Bb', 'A'] },
    prompt: 'Two ways a diminished chord shows up over a blues. Explain the difference, then reveal.',
    quiz: { kind: 'reveal', question: 'In {key}: what is {rn:vii:dim7} over a {rn:V:7} bass, and what is {rn:I:dim7} between two {rn:I:7} chords?', answer: '- A diminished chord over **another root** is usually an **upper structure**: e.g. F° over G = G7♭9, a dominant that wants to move up a 4th.\n- **{rn:I:7} → {rn:I:dim7} → {rn:I:7}** is a **real diminished used as a suspension**: the root stays, the 3rd, 5th and ♭7 each drop a half step and come back. It doesn’t go anywhere new; it hovers on the I.\n\nBonus: the whole-half diminished scale on I equals the half-whole scale on IV, so the same °7 chords over the IV root make a **plagal** sound (blues bars 2, 5–6, 10).' },
    hints: ['Count which notes move: in a suspension, only three of them, by a half step.'],
    explain: 'Telling a suspension from an upper structure decides where the chord goes. The suspension returns to the same chord, which is why it is so useful in a blues, where the I chord lasts for bars.',
    concepts: ['diminished-suspension', 'common-tone-diminished', 'upper-structure-triads'], vary: ['key'], source: SRC(V.hack.title),
  },
  {
    id: 'mb-dimsus-suspension', mode: 'play', category: 'voicings', tags: ['marbin', 'diminished', 'suspension', 'blues', 'drop2'],
    title: 'I7 → I°7 → I7 suspension in {key} on {stringSet}',
    level: 4, length: 'short', minutes: 3,
    params: { key: ['G', 'F', 'C', 'Bb', 'A', 'E'], stringSet: [{ v: [4, 3, 2, 1] }, { v: [5, 4, 3, 2] }, { v: [6, 5, 4, 3], lvl: 1 }] },
    prompt: 'In drop 2 on strings **{stringSet}**: {rn:I:7} → {rn:I:dim7} → {rn:I:7}. Keep the root where it is; drop the **3rd, 5th and ♭7 a half step** each, then bring them back. Do it in every inversion up the neck.',
    goal: 'The root never moves; the other three voices move together by a half step.',
    tempo: { start: 66, min: 50, max: 200, step: 5, unit: 'bpm' },
    metronome: SWING,
    hints: ['G7 (G B D F) → G°7 (G B♭ D♭ F♭/E).', 'Find the root in each grip first; that voice is your anchor.'],
    explain: 'The dominant-to-diminished suspension is a tiny, very vocal move: three voices sigh down a half step and rise again. It is the sound of 20s and 30s swing guitar and of gypsy jazz.',
    visual: { type: 'progression', key: '$key', chart: '| I:7 | I:dim7 | I:7 | % |', voicing: 'drop2', stringSet: '$stringSet', voiceLead: true },
    demo: { type: 'progression', key: '$key', chart: '| I:7 | I:dim7 | I:7 | % |', voicing: 'drop2', stringSet: '$stringSet', voiceLead: true },
    concepts: ['diminished-suspension', 'common-tone-diminished', 'drop2'], vary: ['key', 'stringSet'], source: SRC(V.hack.title),
  },
  {
    id: 'mb-dimsus-approach', mode: 'play', category: 'voicings', tags: ['marbin', 'diminished', 'suspension', 'chord-soloing', 'gypsy-jazz', 'drop2'],
    title: 'Approach I°7 from a half step below: top line {p:chart}',
    level: 5, length: 'medium', minutes: 4,
    params: { key: ['G', 'C', 'F', 'D', 'A'], chart: [
      { v: '| I:7 | I:dim7/bb7 vii:dim7/bb7 | I:dim7/bb7 | I:7 |', label: 'root – 7 – root' },
      { v: '| I:7 | I:dim7/1 vii:dim7/1 | I:dim7/1 | I:7 |', label: '♭3 – 2 – ♭3 (major-pentatonic blue note)' },
      { v: '| I:7 | I:dim7/b3 vii:dim7/b3 | I:dim7/b3 | I:7 |', label: '♭5 – 4 – ♭5 (minor-pentatonic blue note, Django)' },
      { v: '| I:7 | I:dim7/b5 vii:dim7/b5 | I:dim7/b5 | I:7 |', label: '6 – ♭6 – 6' },
    ], stringSet: [{ v: [4, 3, 2, 1], label: 'top four (pinky on the melody)' }, { v: [5, 4, 3, 2], label: 'middle four', lvl: 1 }, { v: [6, 5, 4, 3], label: 'bottom four (ring finger on the melody)', lvl: 1 }] },
    prompt: 'Over a {rn:I:7} vamp in **{key}**, suspend into {rn:I:dim7} and decorate it with the diminished chord a **half step below** ({rn:vii:dim7}), as drop-2 pairs on the **{p:stringSet}**. Lead with the **top note**: **{p:chart}**. Then back to {rn:I:7}.',
    goal: 'The top line sings clearly; every voice moves by a half step between the paired chords.',
    tempo: { start: 72, min: 50, max: 220, step: 5, unit: 'bpm' },
    metronome: SWING,
    hints: ['Diminished to diminished a half step down: all four voices move one fret.', 'The diminished chords come from the whole-half scale on the I.', 'Swing it: this is the 20s/30s and gypsy-jazz chord-solo sound.'],
    explain: `### Chord soloing with a suspension
Whole-half diminished on the I contains two diminished chords: the I°7 and the one a half step below. Alternating them (all voices moving one fret) creates melody in the top voice while the harmony stays a "hovering I". Four top-note figures cover the useful sounds: root–7–root, ♭3–2–♭3 (the major-pentatonic blue note), ♭5–4 (the minor-pentatonic blue note) and 6–♭6–6.`,
    visual: { type: 'progression', key: '$key', chart: '$chart', voicing: 'drop2', stringSet: '$stringSet', voiceLead: true },
    demo: { type: 'progression', key: '$key', chart: '$chart', voicing: 'drop2', stringSet: '$stringSet', voiceLead: true },
    concepts: ['diminished-suspension', 'diminished-scale', 'chord-melody'], vary: ['chart', 'stringSet', 'key'], source: SRC(V.hack.title),
  },
  {
    id: 'mb-dimsus-blues', mode: 'play', category: 'progressions', tags: ['marbin', 'diminished', 'suspension', 'blues', 'plagal', 'drop2'],
    title: 'Blues with diminished suspensions in {key}',
    level: 5, length: 'long', minutes: 6,
    params: { key: ['G', 'F', 'C', 'Bb', 'A'], stringSet: [{ v: [4, 3, 2, 1] }, { v: [5, 4, 3, 2] }] },
    prompt: 'A 12-bar blues in **{key}** with the I°7 suspension placed where the blues can take it: after the I chord, over the **IV bars** (2, 5–6, 10, where the same chords give a plagal sound), and in the turnaround, resolving into the I through the °7.',
    goal: 'Two choruses in time with the °7 colour in the right bars and smooth drop-2 voice leading.',
    tempo: { start: 90, min: 60, max: 200, step: 5, unit: 'bpm' },
    metronome: SWING,
    hints: ['I whole-half = IV half-whole: G°7 contains the ♭9, 3, 5 and ♭7 of C7.', 'Keep the voicings on one string set.'],
    explain: 'Once the suspension is in your hands, a blues has many places for it: every bar where the I or IV chord sits still. Over the IV it acts like a rootless IV7♭9 (plagal pull back to I).',
    visual: { type: 'progression', key: '$key', chart: '| I:7 I:dim7 | IV:7 I:dim7 | I:7 | % | IV:7 I:dim7 | IV:7 I:dim7 | I:7 | % | V:7 | IV:7 I:dim7 | I:7 I:dim7 | V:7 I:dim7 |', voicing: 'drop2', stringSet: '$stringSet', voiceLead: true },
    demo: { type: 'progression', key: '$key', chart: '| I:7 I:dim7 | IV:7 I:dim7 | I:7 | % | IV:7 I:dim7 | IV:7 I:dim7 | I:7 | % | V:7 | IV:7 I:dim7 | I:7 I:dim7 | V:7 I:dim7 |', voicing: 'drop2', stringSet: '$stringSet', voiceLead: true },
    concepts: ['diminished-suspension', 'blues-forms'], vary: ['key', 'stringSet'], source: SRC(V.hack.title),
  },
  {
    id: 'mb-dimmaj7-off-tones', mode: 'play', category: 'voicings', tags: ['marbin', 'diminished', 'dim-maj7', 'half-whole', 'blues', 'drop2'],
    title: '°(maj7) off the chord tones of {rn:I:7}: {p:chart}',
    level: 7, length: 'medium', minutes: 4,
    params: { key: ['G', 'F', 'C', 'Bb'], chart: [
      { v: '| I:7 | III:dim-maj7/1 | IV:7 | % |', label: 'off the 3rd (B bass + B♭ triad in G)' },
      { v: '| I:7 | V:dim-maj7/1 | IV:7 | % |', label: 'off the 5th (D bass + D♭ triad in G)' },
      { v: '| I:7 | bVII:dim-maj7/1 | IV:7 | % |', label: 'off the ♭7 (F bass + E triad in G)' },
      { v: '| I:7 | IV:7 | I:7 | III:dim-maj7/1 bVII:dim-maj7/1 | IV:7 | % |', label: 'bar 4 of a blues: pulling into the IV', lvl: 1 },
    ], stringSet: [{ v: [4, 3, 2, 1] }, { v: [5, 4, 3, 2] }] },
    prompt: 'When {rn:I:7} **pulls** to the IV (bar 4 of a blues), use half-whole diminished. Don’t think of the four dominants inside the scale from their roots; instead put a **major triad over a chord tone** of {rn:I:7}: that gives a diminished-major-7 sound. Play **{p:chart}** in drop 2 on {stringSet}.',
    goal: 'You can build each °(maj7) as "chord-tone bass + triad a half step below it", and hear it pull to IV.',
    tempo: { start: 66, min: 50, max: 180, step: 5, unit: 'bpm' },
    metronome: SWING,
    hints: ['In G: B + B♭ triad = B°(maj7); D + D♭ triad = D°(maj7); F + E triad = F°(maj7).', 'All their notes are in G half-whole diminished (G A♭ B♭ B C♯ D E F).', 'A similar sound appears in the All Blues turnaround: °(maj7) off the 3rd of the V.'],
    explain: `### Triads over chord tones
The half-whole scale on G contains the dominants G7, B♭7, D♭7 and E7. Seeing those as rootless upper structures is hard. It is easier to keep **G7's chord tones as bass notes** (B, D, F) and place the triad a half step below each on top. The result is a diminished-major-7 chord: dense, but every note belongs to G half-whole, so it pulls hard to C7.`,
    visual: { type: 'progression', key: '$key', chart: '$chart', voicing: 'drop2', stringSet: '$stringSet', voiceLead: true },
    demo: { type: 'progression', key: '$key', chart: '$chart', voicing: 'drop2', stringSet: '$stringSet', voiceLead: true },
    concepts: ['diminished-suspension', 'diminished-scale', 'upper-structure-triads'], vary: ['chart', 'key', 'stringSet'], source: SRC(V.hack.title),
  },
];

export const concepts = [
  { id: 'caged-root-areas', title: 'CAGED as root areas', tags: ['fretboard', 'harmony'],
    body: 'Each CAGED form names where a chord’s **root** sits and which **finger** frets it: E (6th string, index), G (6th string, ring/pinky), D (4th string, index), A (5th string, index, chord to the right), C (5th string, ring/pinky, chord to the left). So one hand position contains a root for every chord of a key, and a progression becomes a path of roots inside that area. Split the area into the low, middle and top four strings and you get 15 compact, self-voice-leading homes for any progression.',
    visual: { type: 'arpeggio', root: 'C', quality: 'maj', region: { connect: ['C', 'A', 'G', 'E', 'D'] } }, see: ['caged-system', 'voice-leading-basics'] },
  { id: 'root-motion-numbers', title: 'Tunes as root-motion numbers', tags: ['harmony'],
    body: 'Memorise a tune as the intervallic motion of its roots against the key: Autumn Leaves’ A section is **2 5 1 4 7 3 6**. Write it out, recite it like a phone number, then find it in time in every area of several keys. For modulating tunes, measure every new key from the **home** key (“a ii–V–I a major 3rd up”), not from the previous chord.',
    see: ['roman-numerals', 'modulation'] },
  { id: 'pentatonic-ladder', title: 'The pentatonic ladder', tags: ['scales', 'pentatonic'],
    body: 'The major pentatonic contains only whole steps and minor 3rds. Put the whole steps along a string and the minor 3rds across strings and the scale becomes a three-octave diagonal: the **3-2** shape from the root, the **2-3** shape from the 5th. Climbing it passes through the A, G, E, D and C chord forms of the key; the relative minor uses the same ladder.',
    visual: { type: 'scale', root: 'C', scale: 'major-pentatonic', region: { octaves: 3 } }, see: ['pentatonic-boxes'] },
  { id: 'triad-sub-vs-sus', title: 'Triads as substitutions or suspensions', tags: ['harmony'],
    body: 'Over a chord, a triad from its mode built on degree **1, 3, 5 or 6** (if the 6 is not an avoid note) is a **substitution**: it sounds like the chord. A triad built on **2, 4 or 7** is a **suspension**: it holds an avoid note or replaces the 3rd and wants to resolve. Triad pairs mix the two for movement inside one chord.',
    see: ['triad-pairs', 'avoid-notes'] },
  { id: 'diminished-suspension', title: 'The diminished suspension', tags: ['harmony'],
    body: 'I7 → I°7 → I7: the root stays, the 3rd, 5th and ♭7 drop a half step and return. Unlike a diminished chord over another root (an upper structure, e.g. F° over G = G7♭9), it doesn’t lead anywhere new; it hovers on the chord. Because I whole-half = IV half-whole, the same chords work over the IV bars of a blues.',
    see: ['common-tone-diminished', 'diminished-scale'] },
];

const step = (id, why, params) => (params ? { id, params, why } : { id, why });

export const routines = [
  {
    id: 'mb-caged-voice-leading', name: 'CAGED voice leading: 15 areas', video: V.caged.id, videoTitle: V.caged.title, minutes: 30, source: SRC(V.caged.title),
    concept: `### CAGED is about roots, not shapes
Most people learn CAGED as five chord pictures to stamp on the neck. The more useful reading is simpler: each form tells you **where the root is and which finger plays it**.
- **E form**: root on the 6th string, index finger.
- **G form**: root on the 6th string, ring or pinky.
- **D form**: root on the 4th string, index.
- **A form**: root on the 5th string, index, with the chord stretching to the right.
- **C form**: root on the 5th string, ring or pinky, with the chord stretching to the left.

Seen that way, CAGED stops being a set of grips and becomes a way of **tracking root motion inside one area of the neck**. In any hand position, every chord of a key has its root somewhere under your fingers, and the string and finger tell you which form the chord takes there. A progression is a path between roots; CAGED tells you how to grip each stop on the path without moving.

### Every quality fits every form
Because a form is "root here", it doesn’t care about quality. Flatten the 3rd for minor; flatten the 3rd and 5th for diminished; sharpen the 5th for augmented. So one area can hold a progression with a minor iv and a diminished chord in it.

### Why big grips fail, and the 15 areas
Six-string grips don’t connect well: changing chords means jumping. Split each form into its **low four, middle four and top four** strings (groups of four adjacent strings). Keep a part on one group and it voice-leads itself, because the nearest grip of the next chord is always a fret or two away. Five areas times three string groups gives **15 voice-led versions** of any progression.

### The example: a Michelle-type descent
In C: C – Fm – B♭ – A° – G – A° – G (I – iv – ♭VII – vi° – V). Map it in one area first as roots: say in the A-form area, C (A form) → Fm (D form) → B♭ (G form) → A° (G form) → G… Then triads on one string set, then 4-note grips on one string group. No open strings while you practise: they let you cheat the area.

### Learning vs practising
Split your time in two. **Learning** is prep cooking: slow, out of time, finding each grip and checking it against the root. **Practising** is cooking: in time, one area, a groove, humming the melody over the chords. The first builds the map; only the second makes it usable. Repeat with ii–V–I and I–vi–ii–V, then any tune you are learning.`,
    steps: [
      step('mb-caged-root-finger', 'The five forms as root string + finger, not shapes.'),
      step('mb-caged-quality-morph', 'Same root, four triad qualities: one area holds any chord.'),
      step('mb-roots-michelle', 'Map the Michelle-type descent as roots inside one area first.', { key: 'C' }),
      step('mb-caged-michelle-triads', 'Voice-led triads on one string set, out of time then in time.', { key: 'C' }),
      step('mb-caged-15-areas', 'The same descent as 4-note grips on one string group.', { key: 'C', chart: AREA_CHARTS[2].v }),
      step('mb-caged-15-areas', 'ii–V–I in a new area and string group.', { chart: AREA_CHARTS[0].v }),
      step('mb-caged-15-areas', 'I–vi–ii–V: keep it in time, hum a melody over it.', { chart: AREA_CHARTS[1].v }),
      step('voi-drop2-turnarounds', 'Cool-down: turnarounds on the drop-2 string sets.'),
    ],
  },
  {
    id: 'mb-never-forget-tune', name: 'Never forget a tune: root motion as numbers', video: V.tune.id, videoTitle: V.tune.title, minutes: 30, source: SRC(V.tune.title),
    concept: `### A tune is a number
When you memorise a tune as grips, you have memorised one key in one position, and it falls apart as soon as someone calls another key. What actually defines a tune is its **intervallic root motion against the key**. Autumn Leaves’ A section, numbered from the relative major, is ii – V – I – IV – vii(ø) – III7 – vi: **2 5 1 4 7 3 6**.

Memorise that like a phone number. It is boring on purpose: write it out twenty times, say it out loud, recite it before you go to sleep. A seven-digit number is easy to keep; seven chord names in one key are not, and they don’t transfer.

### Then find it in time, in every area
With the number memorised, take one key and one CAGED area and play the progression **in time** without leaving that area. In one area that might be C-form ii → E-form V → A-form I → D-form IV → A-form vii → III7 → vi. The roots tell you the forms; the forms tell you the grips. Then the next area, then another key. After a few keys the tune is no longer a chord chart; it is a shape you can find anywhere.

### Modulating tunes: measure from home
Tunes that change key are memorised the same way, with one rule: measure each new key **from the home key**, not from the last chord.
- **Blue Bossa** (home E♭, the relative major of C minor): vi – ii – viiø – V/vi – vi, then a ii–V–I a whole step down (D♭), then back.
- **All the Things You Are** (home A♭): 6-2-5-1-4 at home; a 2-5-1 a major 3rd up (C); the same 6-2-5-1-4 a 5th up (E♭); a 2-5-1 into G (a half step below home); a 2-5-1 a ♭6 away (E); then the V of vi back home; and a last A section of 6 2 5 1 4, iv, I, ♭iii°, ii V I.

Measured from home, each modulation is a single fact ("up a major 3rd"), and the whole tune collapses into a few reusable cells.

### How the routine works
Recite and spell first (no guitar), map the roots in an area, play the number in time on one string group, then the modulation drills, then the tunes.`,
    steps: [
      step('mb-tune-recite', 'Recite the A section as 2514736 before touching the guitar.'),
      step('mb-tune-numbers-to-chords', 'Turn the number into chords in a new key.'),
      step('mb-roots-autumn', 'Find the roots inside one CAGED area.'),
      step('mb-tune-autumn-areas', 'Play the number in time on one string group.'),
      step('mb-tune-map-blue-bossa', 'Map a modulating tune from the home key.'),
      step('har-song-blue-bossa', 'Play Blue Bossa-type changes, thinking in numbers.'),
      step('mb-tune-map-attya', 'All the Things You Are as a short list of key moves.'),
      step('mb-tune-key-jumps', 'Drill the key relationships one at a time.', { key: 'Ab' }),
      step('har-song-attya-A', 'Play the opening in time without a chart.', { key: 'Ab' }),
    ],
  },
  {
    id: 'mb-painful-practice', name: 'The painful practice: Barry Harris on the fretboard', video: V.pain.id, videoTitle: V.pain.title, minutes: 35, source: SRC(V.pain.title),
    concept: `### Start with the boring arpeggios
Before any Barry Harris scale makes sense, you need the chords it is built from, everywhere. Major and minor triad arpeggios in all five CAGED forms, then the same arpeggios turned into **C6, Cm6 and C7** by adding one note. Name every interval out loud while you play. That is the painful part, and the part most players skip.

### Chord + diminished = the Barry Harris scale
Barry Harris’ scales take a chord and add the **diminished 7th chord a half step below its root**:
- **C6 + B°** = C D E F G A♭ A B
- **Cm6 + B°** = C D E♭ F G A♭ A B
- **C7 + B°** = C D E F G A♭ B♭ B

Eight notes, alternating between the chord and the diminished chord. Played every other note, the scale becomes chord – motion – chord – motion.

### Chunks, not runs
Don’t practise two-octave sweeps. Practise **four-note chunks**: a tonic chunk (C E G A), then the diminished chunk a step higher (D F A♭ B), then the tonic again a step higher, and so on. A chunk is something you can drop into a line; a two-octave run isn’t.

### Think of the diminished from the tonic
The key move: stop naming the diminished chord from its own root. Name its notes as **degrees of the tonic**: B D F A♭ is the **2, 4, ♭6 and 7** of C. That is a rootless G7♭9, so every diminished chunk is a dominant pulling back to the tonic. Navigating tonic → diminished four notes at a time is navigating tonic → dominant → tonic.

### String groups
Map the same idea onto small string groups. On G-B-E, a chunk lies one note, one note, two notes per string: nearly a chord grip, so the scale doubles as a chord-melody tool.

### Application: "where am I going?"
In a Georgia on My Mind-type opening, C → E7 → Am, think of the E7 as the diminished on A’s 2-4-♭6-7 (G♯ B D F). You are not playing "E7 now"; you are playing "the diminished of where I am going". One scale (A minor 6th-diminished) covers both bars: diminished notes over E7, tonic notes over Am.`,
    steps: [
      step('mb-bh-caged-sixths', 'Triads, then 6, m6 and 7 arpeggios in every form, intervals named aloud.'),
      step('mb-bh-scale-chunks', 'The 6th-diminished scale in 4-note chord/diminished chunks.', { bh: BH_SCALES[0].v }),
      step('mb-bh-dim-on-tonic', 'Name the diminished as 2-4-♭6-7 of the key.'),
      step('mb-bh-scale-chunks', 'Same chunks in minor 6th-diminished.', { bh: BH_SCALES[1].v }),
      step('mb-bh-string-group', 'Chunks on G-B-E: one, one, two notes per string.'),
      step('har-dim-barry-harris-6', 'The scale harmonised: I6 and vii°7 in drop 2.'),
      step('mb-bh-georgia', 'Application: III7 as the diminished of vi.'),
    ],
  },
  {
    id: 'mb-pentatonic-ladder', name: 'The pentatonic ladder', video: V.ladder.id, videoTitle: V.ladder.title, minutes: 25, source: SRC(V.ladder.title),
    concept: `### Two intervals, one rule
The major pentatonic (1 2 3 5 6) contains only two kinds of step: **whole steps** (1→2, 2→3, 5→6) and **minor 3rds** (3→5, 6→1). The ladder idea is to give each a fixed place on the guitar: whole steps go **along a string**, minor 3rds go **across to the next string**. Follow that rule and the scale stops being five boxes and becomes a diagonal that climbs three octaves.

### The two shapes
- **3-2 shape**, from the root: three notes on a string (1 2 3), cross a minor 3rd, two notes on the next (5 6), cross, three again…
- **2-3 shape**, from the 5th: two notes (5 6), cross, three (1 2 3), cross, two…

Both run diagonally up the neck. Use the **ring finger to slide** from one group to the next instead of reaching with the pinky: the shift becomes part of the line.

### Linking it to chords
Climbing the 2-3 ladder from the low 5th, you pass through the major chord forms of the key in CAGED order: the **A form** at the bottom (it feels like a bass line), then **G, E, D and C** forms as you go up. So wherever you are on the ladder, the chord tones of the key are right there, which makes targeting easy.

### Relative minor and the blue note
The same five notes are the relative minor pentatonic (C major = A minor). Same ladder, different home: aim phrases at A instead of C. Add the **blue note**, E♭ in C: the ♭3 of the major and the ♭5 of the relative minor. It slots in between 2 and 3 on the three-note strings as a slide into the 3.

### Moving chords
Because the ladder crosses every chord shape, it follows changes well. Over C–Am (Hallelujah-style rocking) the notes stay the same and only the target changes. Over Am–G–F (6-5-4) you can stay on the ladder and land on each chord’s tones, or switch to each chord’s own pentatonic on the same strings.

### Practice order
3-2 ladder up and back, 2-3 ladder with the chord forms named, relative minor over a drone, the blue note, then real changes.`,
    steps: [
      step('mb-ladder-32', 'The 3-2 ladder from the root: whole steps along, minor 3rds across.'),
      step('mb-ladder-23', 'The 2-3 ladder from the 5th, naming the CAGED forms you pass.'),
      step('scl-pent-diagonal', 'Compare: the same notes as connected boxes.'),
      step('mb-ladder-relative-minor', 'Same ladder, minor home.'),
      step('mb-ladder-blue-note', 'Add the ♭3 as a slide into the 3.'),
      step('mb-ladder-moving-chords', 'I–vi: only the target changes.', { chart: '| I:maj | % | vi:min | % |' }),
      step('mb-ladder-moving-chords', 'vi–V–IV: land on each new chord.', { chart: '| vi:min | V:maj | IV:maj | % |' }),
    ],
  },
  {
    id: 'mb-triad-pairs', name: 'Triad pairs: altered, harmonic minor and modal', video: V.tpAlt.id, videoTitle: V.tpAlt.title, minutes: 25, source: `${SRC(V.tpAlt.title)}; ${SRC(V.tpComp.title)}`,
    concept: `### Why pairs
Two triads on adjacent degrees of a scale share no notes, so together they give **six different notes**: a hexatonic scale with a strong, clear sound, and two easy shapes to think in.

### Substitutions and suspensions
Over a chord, a triad from its mode is a **substitution** if it is built on 1, 3, 5 or 6 (when the 6 isn’t an avoid note): it sounds like the chord. Built on 2, 4 or 7 it is a **suspension**: it holds the avoid note or replaces the 3rd and wants to resolve. Pairs usually mix one of each, so the line moves inside a single chord. Examples: Ionian ii over I, Dorian IV → ♭III (So What-type comping), and the melodic-minor vi°/vii° pair over a minor 6 (heard in Summertime-type minor tunes).

### The altered pair
For V7 altered, take the **IV and V triads of the melodic minor a half step above V**. Over G7: A♭ melodic minor’s IV and V are D♭ and E♭. Over G, D♭ F A♭ = ♭5 ♭7 ♭9 and E♭ G B♭ = ♭13 1 ♯9: the altered tensions, as two major triads.

### The harmonic-minor pair
For V7 in a minor key, take the minor key’s **ii° and ♭III+**. In C minor over G7: D° (D F A♭ = 5 ♭7 ♭9) and E♭+ (E♭ G B = ♭13 1 3). The ♭9 and ♭13 with the real 3rd: the minor-key dominant sound.

### Practice
Classify first (theory), then arpeggiate each pair alternately in one CAGED area, then comp with it (one triad on the beat, the other on an off-beat), then use the altered and harmonic-minor pairs in ii–V–is.`,
    steps: [
      step('mb-tp-sub-vs-sus', 'Sort the triads of a mode into substitutions and suspensions.'),
      step('mb-tp-mode-pairs', 'Ionian ii + I: a suspension inside one chord.', { pair: ['1', '2', '3', '4', '5', '6'] }),
      step('mb-tp-mode-pairs', 'Dorian ♭III + IV: modal comping.', { pair: ['1', 'b3', '4', '5', '6', 'b7'] }),
      step('scl-arp-triad-pair-altered', 'The altered pair: IV and V of melodic minor a half step above V.'),
      step('har-imp-triad-pair-altered', 'Use the altered pair on a real ii–V–I.'),
      step('mb-tp-harmonic-minor-V', 'ii° + ♭III+ over the V of a minor key.'),
    ],
  },
  {
    id: 'mb-speed-picking', name: 'Speed practice for jazz lines', video: V.speed.id, videoTitle: V.speed.title, minutes: 20, source: SRC(V.speed.title),
    concept: `### Speed comes from mechanics
Fast bebop lines aren’t played with brute alternate picking. They use a small set of **stroke cells** that let the hand move with the line instead of against it.

**Joe Pass triplets.** Triads laid out one note on the lower string, two on the higher. Pick **down, down, up**: the first down sweeps straight into the second string (one motion), and a deliberately wide upstroke clears the strings so the next group can start with a down again.

**The 8-note double-time cell.** Three notes on one string and two on the next, then back: down–up–down, a sweep onto the next string, a big upstroke, a pull-off, then down–up. The pull-off gives the picking hand a moment to reset in the middle of the cell.

**The 6-note cell.** Four picks and two pull-offs per sextuplet: pick, pick, slur, pick, pick, slur. It halves the work at the speed where alternate picking tightens up.

**Muting.** Speed sounds messy mostly because of noise. The picking-hand palm rests on the strings below; the fretting fingers touch the strings above. Only one note should ring.

### How to practise
One cell at a time, slowly, until the strokes are automatic, then move it through a scale or arpeggio. Push the tempo in small steps and drop back when tension appears. Record yourself to catch ringing strings.`,
    steps: [
      step('rhy-pick-sweep-3', 'Warm-up: a controlled 3-string sweep.'),
      step('mb-speed-joe-pass-triplets', 'Down-down-up triplets: sweep plus a wide escape.'),
      step('mb-speed-8-note', 'The 8-note double-time cell.'),
      step('mb-speed-6-note', 'Four picks, two pull-offs.'),
      step('mb-speed-muting', 'Check the muting at speed.'),
    ],
  },
  {
    id: 'mb-omit-ii', name: 'Joe Pass: when to forget the ii chord', video: V.joe.id, videoTitle: V.joe.title, minutes: 20, source: SRC(V.joe.title),
    concept: `### "I only think of the V"
Joe Pass often said that in a ii–V he just thought of the V. That works because, in a cadence, the ii is really a **suspension of the V**: Dm7 is G7sus4 with a 9th and no root. Lines that work over G7 work over the bar of Dm7 too, and you have half as many chords to track.

### Where it breaks
It doesn’t work everywhere. In a **cycle** (the Fly Me to the Moon-type sequence of chords falling in 4ths), each chord is both the end of one move and the start of the next. The ii there is a destination; skip it and your line loses its target.

### Reducing a form
The same thinking can simplify a whole tune. In the Bird blues (Blues for Alice-type changes), most bars are ii–Vs. Thinking only the V of each pair cuts the chart in half. But keep the chords that are true destinations: in bar 3, the vi (Dm7 in F) is where the line is going, while the G7 after it is a weak V/V you can drop. The reduced chart is a better improvising map; play it against the full changes to check your lines still fit.

### Practice
Decide when it’s safe (theory card), play V-thinking lines over ii–Vs, check a cycle tune where it doesn’t work, then reduce the Bird blues.`,
    steps: [
      step('mb-omit-ii-rule', 'When the ii is a suspension, and when it is a target.'),
      step('har-imp-think-dominant', 'Play the ii–V as one dominant.'),
      step('har-song-fly-me-cycle', 'A cycle where every chord matters.'),
      step('mb-omit-ii-alice', 'Reduce the Bird blues and solo on the reduction.'),
    ],
  },
  {
    id: 'mb-counterpoint', name: 'Counterpoint on guitar: four patterns', video: V.cp.id, videoTitle: V.cp.title, minutes: 20, source: SRC(V.cp.title),
    concept: `### Why counterpoint is easier than it looks
Two lines moving against each other sound sophisticated, but on guitar you can make it almost automatic with the right scale. In Barry Harris’ **6th-diminished scale** (C D E F G A♭ A B), chord tones and diminished tones **alternate**. Move two voices in **contrary motion** and they land chord tone against chord tone, then diminished against diminished, over and over. Every second dyad is the tonic; every other one is "motion". It can’t go wrong, and because the alternation repeats, the moves repeat too.

### The guitar as two pianos
Split the neck into two 3-string groups: strings 3-2-1 and 6-5-4. Each is a little piano with its own register. Walk tonic and diminished triads (I and vii°) **up** on the top piano and **down** on the bottom. Learn each alone, then answer one with the other, then combine.

### Practice
Start with ordinary contrary motion in a major scale (outer voices meeting in the middle), then the 6th-diminished version as dyads, then the two-piano triad walks, then the harmonised scale in drop 2 to hear all four voices together.`,
    steps: [
      step('scl-seq-contrary-motion', 'Contrary motion in a plain mode.', { scale: 'ionian' }),
      step('mb-cp-contrary-6dim', 'Contrary dyads in the 6th-diminished scale.'),
      step('mb-cp-two-pianos', 'Two 3-string pianos moving in opposite directions.'),
      step('har-dim-barry-harris-6', 'The same alternation as four-voice chords.'),
    ],
  },
  {
    id: 'mb-phrasing-tempos', name: 'Jazz phrasing at three tempos', video: V.phrase.id, videoTitle: V.phrase.title, minutes: 20, source: SRC(V.phrase.title),
    concept: `### Each tempo needs its own feel
The same line can sound great at one tempo and stiff at another, because each tempo asks your body to feel the pulse differently.

**Medium.** Practise at 60 bpm and **sing your lines** before you play them. At that speed every 8th note is a decision: long-short swing, accents on the off-beats, the click on 2 and 4. If you can’t sing it, it isn’t a phrase yet.

**Up-tempo.** Don’t try to feel every beat at 240. Feel it **in half time**: your foot on 2 and 4 only, which is a relaxed 120. Phrase in longer, simpler shapes over that slow pulse; the fast tempo stops feeling frantic.

**Ballads.** The beats are so long that time gets vague. Feel **double-time 8ths** (swung 16ths at the ballad tempo) underneath. That gives you a grid for both long held notes and quick fills, and keeps the fills in time.

### Practice
One ii–V–I, three tempos, three ways of feeling the pulse. Then put the click on 2 and 4 on a tune you know.`,
    steps: [
      step('mb-phrase-medium', 'Medium: 60 bpm, sing first.'),
      step('mb-phrase-uptempo', 'Fast: feel it in half time.'),
      step('mb-phrase-ballad', 'Ballad: feel double-time underneath.'),
      step('rhy-click-2-4-swing', 'Lock the swing feel to a click on 2 & 4.'),
    ],
  },
  {
    id: 'mb-funk-mechanics', name: 'Funk guitar mechanics', video: V.funk.id, videoTitle: V.funk.title, minutes: 20, source: SRC(V.funk.title),
    concept: `### Mechanics first
Funk rhythm guitar is a physical skill before it is a musical one.
- **Rotate the forearm**, like turning a doorknob, rather than flapping the wrist. Rotation can run 16ths for a whole song without tiring.
- **Hold the pick lightly**, so it gives a little on every stroke.

### Two hand settings
- **Shaker.** Fingers straight, the hand brushes all the strings on every stroke: an even, muted wash with accents where you want them.
- **Three drums.** A loose fist that aims at three zones: low strings, middle, high, like kick, snare and hi-hat. One hand plays a drum kit.

### Patterns
- **Down–down–up groups of three 16ths**: three-note groups against a four-based bar. Sixteen groups fill three bars, so the accent drifts and comes home on bar 4.
- **Six-stroke bursts** (sextuplets) and **32nd-note bursts**: ornaments on the groove, like a drummer’s ruff. They come from the same rotation, just smaller.

### Practice
Get the motion first (scratch motion card), then the two hand settings, then the threes, then the bursts, then a real groove.`,
    steps: [
      step('rhy-funk-scratch-motion', 'The constant 16th scratch motion.'),
      step('mb-funk-shaker-drums', 'Shaker vs three drums: control which strings you hit.'),
      step('mb-funk-ddu', 'Down-down-up threes across the bar.'),
      step('mb-funk-bursts', '6-stroke and 32nd bursts on top of the groove.'),
      step('rhy-funk-chicken-scratch', 'Put it into a real groove.'),
    ],
  },
  {
    id: 'mb-outline-changes', name: 'Jazz lines: outlining a form', video: V.lines.id, videoTitle: V.lines.title, minutes: 30, source: SRC(V.lines.title),
    concept: `### Outlining = the chords audible in one line
A line outlines the changes when someone could hear the progression from the line alone. Build that skill in small, deliberate steps.

**Chunk the tune.** Four bars at a time. For each chunk: sing the bass line (roots, then a walking line), arpeggiate each chord, then write and play an **8th-note étude** through it. Only then add the next four bars.

**Voice-lead triads by proximity.** Reduce the form to triads and always take the closest inversion. The top notes of those triads form a smooth melodic skeleton through the form, a ready-made guide line.

**Approach and neighbour tones.** Chord tones on the strong beats; between them, approach notes (a half step below, a scale step above) and neighbour tones that circle a target. In a blues, you can "colour in" against a moving bass the same way.

**Start simple.** Happy Birthday first: the harmony is obvious, so you can focus on the process. Then simple songs, then a standard such as All of Me-type changes, still four bars at a time.`,
    steps: [
      step('mb-lines-happy-birthday', 'The process on a tune everyone knows.'),
      step('mb-lines-4bar-chunks', 'Bars 1–4: bass line, arpeggios, étude.', { chart: ALL_OF_ME[0].v }),
      step('mb-lines-4bar-chunks', 'Bars 5–8.', { chart: ALL_OF_ME[1].v }),
      step('mb-lines-triad-proximity', 'Voice-led triads through the whole form.'),
      step('scl-chr-approach-arpeggio', 'Approach notes into chord tones.'),
      step('har-imp-enclosures', 'Neighbour tones and enclosures on a ii–V–I.'),
      step('har-imp-blues-follow-changes', 'Colour in a blues while following the changes.'),
    ],
  },
  {
    id: 'mb-diminished-families', name: 'Diminished substitutions: three families', video: V.dim.id, videoTitle: V.dim.title, minutes: 25, source: SRC(V.dim.title),
    concept: `### One chord, three jobs
There are only three different diminished 7th chords. Relative to any chord you are on, each of them does one of three jobs.

**1. On ♭2, 3, 5, ♭7.** Over C, that is E°7 (E G B♭ D♭). It contains C7♭9 without its root, so it turns the chord into a **dominant** and points to F.

**2. On 2, 4, ♭6, 7.** Over C, B°7 (B D F A♭). It is the **V of the chord you are on** (G7♭9 without root), so it pulls straight back to C. This is Barry Harris’ motion chord, the one that alternates with the tonic in the 6th-diminished scale.

**3. On the root.** C°7 over C: a **tonic diminished suspension**. It shares the root and returns to the chord.

### Passing chords are the same families
The familiar passing diminished chords are just these families seen from the chord they lead into. In All of Me-type changes, the ♯iv°7 between IV and I/5 is family 2 of the I/5. The ♭iii°7 between iii and ii is family 2 of the ii.

### Practice
Name the families in a key (theory), play each family as a short progression, then the standard passing-diminished drills, saying the family name every time.`,
    steps: [
      step('mb-dim-three-families', 'The three families relative to one chord.'),
      step('mb-dim-families-play', 'Hear each family in a short progression.'),
      step('har-dim-rootless-7b9', 'Family 2 as a rootless V7♭9.'),
      step('har-dim-common-tone', 'Family 3: common-tone diminished.'),
      step('har-dim-passing-ascending', 'Passing diminished chords, named by family.'),
      step('voi-drop2-dim7', 'Drop-2 diminished grips on every string set.'),
    ],
  },
  {
    id: 'mb-reharm-i-iv-v', name: 'Reharmonising melodies with I, IV and V', video: V.reharm.id, videoTitle: V.reharm.title, minutes: 25, source: SRC(V.reharm.title),
    concept: `### Three chords hold every note
Every note of the major scale belongs to I, IV or V(7): 1 (I, IV), 2 (V), 3 (I), 4 (IV, V7), 5 (I, V), 6 (IV), 7 (V). So any diatonic melody can be harmonised with just the three primary chords. Look at the strong-beat notes of each bar and pick the chord that holds them; passing notes don’t decide.

### Tonal vs modal
A **tonal** analysis hears chords as functions pulling to a tonic: tonic, subdominant, dominant. A **modal** analysis hears a scale colour held over a centre, where the characteristic note matters more than the pull. I–IV–V harmonisation is tonal thinking at its simplest.

### Other systems, same functions
Change one scale note and the primary chords change colour:
- **Harmonic major**: I iv V (the ♭6 makes the IV minor).
- **Natural minor**: i iv v.
- **Harmonic minor**: i iv V.
- **Melodic minor**: i IV V.
Same melody, five moods.

### Practice
Learn which chord holds each degree, harmonise Silent Night with only I, IV and V as chord melody, then a minor carol (God Rest Ye Merry Gentlemen) in three minor systems. Both melodies are public domain.`,
    steps: [
      step('mb-reharm-which-chord', 'Which primary chord holds each scale degree.'),
      step('mb-reharm-systems', 'Primary chords in major, harmonic major and the minors.'),
      step('mb-reharm-silent-night', 'Silent Night with only I, IV and V.'),
      step('mb-reharm-god-rest', 'One minor melody, three minor systems.'),
      step('har-cm-step5-twinkle-reharm', 'Go further: substitutes for the primary chords.'),
    ],
  },
  {
    id: 'mb-dim-suspension-blues', name: 'Chord soloing on a blues: the diminished suspension', video: V.hack.id, videoTitle: V.hack.title, minutes: 30, source: SRC(V.hack.title),
    concept: `### A real diminished, not an upper structure
Most diminished chords you meet over a different root are **upper structures**: F° over G is just G7♭9, a dominant that wants to move up a 4th. This idea uses a **real** diminished chord as a **suspension**: G7 → G°7 → G7. The root stays; the 3rd, 5th and ♭7 each drop a half step and come back. It doesn’t go anywhere new; it hovers on the chord. That makes it perfect for a blues, where the I chord sits for bars at a time, and for the turnaround, where you can resolve into the I through G°7.

### The scale: whole-half on the I
G whole-half diminished contains two diminished chords: G°7 and F♯°7 (a half step below). Approach each G°7 inversion from the F♯°7 a half step below, as **drop-2 pairs**, and let the top voice lead:
- **root–7–root**,
- **♭3–2–♭3**: the major-pentatonic blue note,
- **♭5–4**: the minor-pentatonic blue note, a Django sound,
- **6–♭6–6**.
Do it on the top four strings (pinky on the melody), then the middle four, then the bottom four (ring finger on the melody). This is the 1920s/30s swing and gypsy-jazz chord-solo sound.

### I whole-half = IV half-whole
The same chords over the IV root (C in G) give a plagal sound: G°7 holds the ♭9, 3, 5 and ♭7 of C7. So they also work in the IV bars of the blues: bars 2, 5–6 and 10.

### When the dominant pulls: half-whole and °(maj7)
When I7 is heading somewhere (bar 4, going to IV), use half-whole diminished on G. It contains dominants a minor 3rd apart (G7, B♭7, D♭7, E7), but seeing those built on tensions is hard. Instead keep G7’s chord tones in the bass and put a triad a half step below each on top:
- off the 3rd: B bass + B♭ triad = B°(maj7),
- off the 5th: D bass + D♭ triad = D°(maj7),
- off the ♭7: F bass + E triad = F°(maj7).
Bar 4 is the place for it; Joe Pass-type voicings work on the IV. A similar °(maj7) sound off the 3rd of the V appears in the All Blues turnaround.`,
    steps: [
      step('mb-dimsus-theory', 'Suspension vs upper structure, and I whole-half = IV half-whole.'),
      step('voi-drop2-dim7', 'Drop-2 diminished grips on every string set.'),
      step('mb-dimsus-suspension', 'I7 → I°7 → I7: three voices down a half step and back.'),
      step('mb-dimsus-approach', 'Top line root–7–root on the top four strings.', { chart: '| I:7 | I:dim7/bb7 vii:dim7/bb7 | I:dim7/bb7 | I:7 |', stringSet: [4, 3, 2, 1] }),
      step('mb-dimsus-approach', 'The blue-note top lines (♭3–2 and ♭5–4).', { chart: '| I:7 | I:dim7/b3 vii:dim7/b3 | I:dim7/b3 | I:7 |' }),
      step('mb-dimsus-blues', 'Put the suspensions into the I and IV bars of a blues.'),
      step('mb-dimmaj7-off-tones', 'Bar 4: °(maj7) chords off the 3rd, 5th and ♭7.'),
      step('har-comp-chord-solo', 'Chord-solo a whole blues with the new sounds.'),
    ],
  },
];
