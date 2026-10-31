// Chord deep dives (one chord, the whole routine), whole-neck interval tracking, arpeggio speed work,
// and one-note mode journeys (each step changes exactly one note by a half step — computed, not typed).
import { getScale, intervalSemis, prettyIv } from '../src/theory.js';
// Generated from small tables so every chord family gets the same complete routine.
const FAMILIES = [
  { q: 'maj7', name: 'major 7', ext: 'maj9', extName: 'maj9 (add the 9)', us: ['3', '5', '7', '9'], usName: 'Em7 arpeggio from the 3rd = 3 5 7 9',
    role: 'the **tonic** (I) or **subdominant** (IV) chord of a major key: Imaj7 is home, IVmaj7 the “warm side step”. Used for endings, bossa/ballad tonics, and IVmaj7 in ii–V–I–IV movements.',
    where: 'I in major (Ionian, natural 4 is an avoid note), IV in major (Lydian, ♯11 is the colour).', morph: 'voi-drop2-quality-morph' },
  { q: 'm7', name: 'minor 7', ext: 'm9', extName: 'm9 (add the 9)', us: ['b3', '5', 'b7', '9'], usName: 'the relative major 7th from the ♭3 = ♭3 5 ♭7 9',
    role: 'the **predominant** ii of a ii–V–I (the most common jazz chord function), also iii and vi in major, and the minor tonic in Dorian funk/soul vamps.',
    where: 'ii (Dorian), iii (Phrygian), vi (Aeolian) of a major key.', morph: 'voi-drop2-quality-morph' },
  { q: '7', name: 'dominant 7', ext: '13', extName: '13 (natural 9 and 13)', us: ['3', '5', 'b7', '9'], usName: 'the m7♭5 from the 3rd = 3 5 ♭7 9',
    role: 'the **dominant** V: the tritone between 3 and ♭7 wants to resolve down a 5th to I. In blues, every chord is a dominant 7.',
    where: 'V of a major or minor key (Mixolydian; altered or ♭9 sounds when resolving to minor), I7 and IV7 in blues.', morph: 'voi-drop2-quality-morph' },
  { q: 'm7b5', name: 'half-diminished (m7♭5)', ext: null, us: ['b3', 'b5', 'b7', '9'], usName: 'the minor 6 from the ♭3 = same notes (Bm7♭5 = Dm6)',
    role: 'the **predominant** iiø7 of a minor ii–V–i (iiø7 – V7♭9 – i), and vii of a major key.',
    where: 'ii of a minor key (Locrian, or Locrian ♮2 for a smoother natural 9), vii of major.', morph: 'voi-drop2-quality-morph' },
];
const ROUTE = `### How to use a deep dive
This is a whole practice session on **one chord**. Work through the demo parts in order — each one is a different view of the same four notes:
1. **Inversions on every string set** (drop 2 on 4-3-2-1, 5-4-3-2, 6-5-4-3): find every shape up the neck.
2. **Inversion arpeggios**: strum each inversion, then arpeggiate it — so the arpeggio starts on the 3rd, 5th or 7th, not just the root.
3. **The arpeggio in all five CAGED areas**, from the lowest note in each area.
4. **Extensions / upper structures**: what to add on top, and the arpeggio that gives it to you.
Say the interval of every note as you play it. When one part is easy, move to the next; when they’re all easy, do it in a hard key.`;

const deepDives = FAMILIES.map((f, i) => ({
  id: `dd-${f.q.replace(/[^a-z0-9]/gi, '')}`,
  mode: 'play', category: 'voicings', tags: ['deep-dive', 'inversions', 'arpeggios', 'drop2', f.q, 'routine'],
  title: `Deep dive: {chord} — the whole ${f.name} routine`,
  level: 4 + Math.min(i, 2), length: 'long', minutes: 15,
  params: { key: 'major', quality: [f.q] },
  prompt: `A full session on **{chord}** (${f.name}: {chordTones}).\n\n1. Drop-2 inversions on strings 4-3-2-1, then 5-4-3-2, then 6-5-4-3, up the neck.\n2. For each inversion: strum it, then arpeggiate it up and back.\n3. The {chord} arpeggio in all five CAGED areas.\n4. Add the extensions: ${f.ext ? `play the ${f.extName} arpeggio, then ` : ''}${f.usName}.\n\nName every note’s interval as you go.`,
  goal: 'Every inversion, on every string set, without stopping to think — and you can name every note.',
  tempo: { start: 60, min: 40, max: 200, step: 4 }, metronome: { meter: '4/4' },
  hints: ['Root position has the root in the bass; each inversion moves every voice up to the next chord tone.', 'Arpeggiate each grip before moving on — that’s an inverted arpeggio (starting on 3, 5 or 7).', 'The extension arpeggio sits right on top of the chord shape you already know.'],
  explain: `### What this chord does\n{chord} is ${f.role}\n\n**Where it lives:** ${f.where}\n\n${ROUTE}`,
  visual: { type: 'voicings', root: '$key', quality: '$quality', voicing: 'drop2', stringSet: [4, 3, 2, 1], inversion: 'all' },
  demo: [
    { type: 'voicings', root: '$key', quality: '$quality', voicing: 'drop2', stringSet: [4, 3, 2, 1], inversion: 'all', title: '1. Drop 2 on 4-3-2-1 (strum, then arpeggiate)' },
    { type: 'voicings', root: '$key', quality: '$quality', voicing: 'drop2', stringSet: [5, 4, 3, 2], inversion: 'all', title: '1b. Drop 2 on 5-4-3-2' },
    { type: 'voicings', root: '$key', quality: '$quality', voicing: 'drop2', stringSet: [6, 5, 4, 3], inversion: 'all', title: '1c. Drop 2 on 6-5-4-3' },
    ...['E', 'D', 'C', 'A', 'G'].map((c) => ({ type: 'arpeggio', root: '$key', quality: '$quality', region: { caged: c }, path: 'up-and-down', beatsPerNote: 0.5, title: `3. Arpeggio — ${c} shape` })),
    ...(f.ext ? [{ type: 'arpeggio', root: '$key', quality: f.ext, region: { caged: 'E' }, path: 'up-and-down', beatsPerNote: 0.5, title: `4. ${f.extName} arpeggio` }] : []),
    { type: 'arpeggio', root: '$key', tones: f.us, region: { caged: 'A' }, path: 'up-and-down', beatsPerNote: 0.5, title: `4. Upper structure: ${f.usName}` },
  ],
  vary: ['key'], concepts: ['inversions', 'drop2'],
}));

const TRIAD_DIVE = {
  id: 'dd-triads', mode: 'play', category: 'voicings', tags: ['deep-dive', 'triads', 'inversions', 'arpeggios', 'routine'],
  title: 'Deep dive: {chord} triad — every inversion on every string set',
  level: 3, length: 'long', minutes: 12,
  params: { key: 'major', quality: [{ v: 'maj', label: 'major' }, { v: 'min', label: 'minor' }] },
  prompt: 'All three inversions of **{chord}** ({chordTones}) on strings 3-2-1, 4-3-2, 5-4-3 and 6-5-4, walking up the neck; then the same as spread triads; then the arpeggio in all five CAGED areas.',
  goal: 'You can find {chord} in any inversion anywhere between frets 0 and 15.',
  tempo: { start: 66, min: 40, max: 200, step: 4 }, metronome: { meter: '4/4' },
  hints: ['On each string set the order up the neck is always root position → 1st inversion → 2nd inversion → root position…', 'On strings 3-2-1 and 4-3-2 the B string bends the shapes — learn those two sets separately.'],
  explain: `### Why triads first
Triads are the skeleton of every bigger chord: a maj7 is a triad plus a 7th, a 9 chord contains a triad built on the 3rd, and so on. Knowing every triad inversion everywhere is what makes drop-2 shapes, upper structures and chord melody easy later.

${ROUTE}`,
  visual: { type: 'voicings', root: '$key', quality: '$quality', voicing: 'close', stringSet: [3, 2, 1], inversion: 'all' },
  demo: [
    ...[[3, 2, 1], [4, 3, 2], [5, 4, 3], [6, 5, 4]].map((ss) => ({ type: 'voicings', root: '$key', quality: '$quality', voicing: 'close', stringSet: ss, inversion: 'all', title: `Close triads on ${ss.join('-')}` })),
    { type: 'voicings', root: '$key', quality: '$quality', voicing: 'spread', stringSet: [6, 4, 3], inversion: 'all', title: 'Spread triads on 6-4-3' },
    ...['E', 'A', 'C'].map((c) => ({ type: 'arpeggio', root: '$key', quality: '$quality', region: { caged: c }, path: 'up-and-down', beatsPerNote: 0.5, title: `Arpeggio — ${c} shape` })),
  ],
  vary: ['key', 'quality'], concepts: ['inversions'],
};

const WHOLE_NECK = [
  {
    id: 'scl-neck-interval-tracking', mode: 'play', category: 'scales', tags: ['whole-neck', 'intervals', 'fretboard', '3nps'],
    title: 'Whole neck, every interval named: {scale}',
    level: 4, length: 'long', minutes: 8,
    params: { root: 'any', scale: [{ v: 'ionian', label: 'major' }, { v: 'dorian' }, { v: 'mixolydian' }, { v: 'aeolian', label: 'natural minor' }, { v: 'melodic-minor', lvl: 1 }, { v: 'harmonic-minor', lvl: 1 }, { v: 'lydian-dominant', lvl: 2 }, { v: 'altered', lvl: 2 }] },
    prompt: 'Play **{scale}** ({scaleNotes}) through all seven 3-notes-per-string positions, climbing the neck. **Say the interval of every note out loud** as you play it — "1, 2, 3, 4…" — never the note name.',
    goal: 'You can name the interval of any note instantly, in every position.',
    tempo: { start: 50, min: 30, max: 200, step: 4 }, metronome: { meter: '4/4' },
    hints: ['Find every root (1) first; the other numbers are counted from it.', 'Start slowly — the point is the naming, not the speed.', 'Each new position starts one scale degree higher on the low E string.'],
    explain: '### Why name intervals instead of notes\nIntervals are what make a scale sound like itself: in any key, Dorian’s natural 6 and Lydian’s ♯4 are always in the same place relative to the root. When you know that every note you play is "the ♭7" or "the 9", you can target chord tones, see arpeggios inside the scale, and move ideas to any key.',
    visual: { type: 'scale', root: '$root', scale: '$scale', region: { nps3: 1 } },
    demo: [1, 2, 3, 4, 5, 6, 7].map((n) => ({ type: 'scale', root: '$root', scale: '$scale', region: { nps3: n }, path: 'ascending', beatsPerNote: 0.5, title: `Position ${n}` })),
    vary: ['root', 'scale'], concepts: [],
  },
  {
    id: 'scl-neck-interval-one-string', mode: 'play', category: 'scales', tags: ['whole-neck', 'intervals', 'single-string', 'fretboard'],
    title: '{scale} along every string, naming intervals',
    level: 3, length: 'medium', minutes: 5,
    params: { root: 'any', scale: [{ v: 'ionian', label: 'major' }, { v: 'dorian' }, { v: 'mixolydian' }, { v: 'aeolian', label: 'natural minor' }, { v: 'melodic-minor', lvl: 1 }], string: [6, 5, 4, 3, 2, 1] },
    prompt: 'Play **{scale}** up and down **string {p:string}** from the open string to fret 15, naming the interval of every note out loud.',
    goal: 'No hesitation on any note, and you know every interval.',
    tempo: { start: 60, min: 30, max: 200, step: 4 }, metronome: { meter: '4/4' },
    hints: ['The whole steps are 2 frets, the half steps 1 — memorise the step pattern of the scale.'],
    explain: 'Playing a scale along one string (Mick Goodrick’s “unitar” idea) shows the scale as a pattern of distances rather than boxes, and connects every position on the neck.',
    visual: { type: 'scale', root: '$root', scale: '$scale', region: { string: '$string', frets: [0, 15] } },
    demo: { type: 'scale', root: '$root', scale: '$scale', region: { string: '$string', frets: [0, 15] }, path: 'up-and-down', beatsPerNote: 0.5 },
    vary: ['root', 'string'], concepts: [],
  },
];

const SPEED = {
  id: 'arp-speed-ladder', mode: 'play', category: 'arpeggios', tags: ['speed', 'arpeggios', 'sweep', 'economy', 'technique'],
  title: 'Arpeggio speed ladder: {chord}, {p:shape} shape',
  level: 5, length: 'medium', minutes: 6,
  params: { key: 'major', quality: [{ v: 'maj7' }, { v: 'm7' }, { v: '7' }, { v: 'm7b5', lvl: 1 }, { v: 'dim7', lvl: 1 }], shape: ['E', 'A', 'C', 'D', 'G'] },
  prompt: 'Play the **{chord}** arpeggio in the {p:shape} shape up and down, without stopping, in 8ths → triplets → 16ths at the same click. When a rung is clean four times in a row, go up 4 bpm.',
  goal: 'Clean, even 16ths with every note the same volume — then raise the click.',
  tempo: { start: 60, min: 40, max: 200, step: 4 }, metronome: { meter: '4/4', subdivision: 1 },
  hints: ['One note per string: let the pick fall through the strings in one motion (economy/sweep) instead of alternate picking.', 'Two notes on a string: down–up on that string, then keep the direction going onto the next.', 'Mute behind you: the fretting finger lifts as the next note sounds, so notes don’t ring together.'],
  explain: `### Speed tips
- **Bursts beat marathons:** play one beat fast, then rest a beat. Grow the burst to two beats, then a bar.
- **Push and pull the tempo:** practise 10 bpm faster than your goal for a minute, then drop back — the goal tempo will feel easy.
- **Economy of motion:** keep the pick close to the strings and the fretting fingers hovering just above the fretboard.
- **Pick direction:** on one-note-per-string runs, sweep (one push of the pick across the strings); don’t force strict alternate picking.
- **Stay relaxed:** tension caps speed. If your forearm burns, stop and shake it out.
- **Accuracy first:** if you miss notes, you’re too fast — drop 8 bpm. Speed comes from clean repetitions, not from forcing it.

### Musical role
{chord} arpeggios outline the chord’s function when you solo: land the 3rd or 7th on the beat when the chord changes and the harmony is audible even without accompaniment.`,
  visual: { type: 'arpeggio', root: '$key', quality: '$quality', region: { caged: '$shape' } },
  demo: { type: 'arpeggio', root: '$key', quality: '$quality', region: { caged: '$shape' }, path: 'up-and-down', beatsPerNote: 0.25 },
  vary: ['tempo', 'key', 'shape'], concepts: [],
};

// ---------- one-note journeys ----------
function step(a, b) {
  const A = getScale(a), B = getScale(b);
  const i = A.ivs.findIndex((iv, k) => intervalSemis(iv) !== intervalSemis(B.ivs[k]));
  if (i < 0 || A.ivs.filter((iv, k) => intervalSemis(iv) !== intervalSemis(B.ivs[k])).length !== 1) throw new Error(`journey step ${a} → ${b} is not a one-note change`);
  const from = (A.labels || A.ivs)[i], to = (B.labels || B.ivs)[i];
  const up = intervalSemis(B.ivs[i]) > intervalSemis(A.ivs[i]);
  return `${prettyIv(from)} ${up ? 'rises' : 'drops'} to ${prettyIv(to)}`;
}
const JOURNEYS = [
  { id: 'light-to-dark', name: 'Light to dark, the whole way', lvl: 4, path: ['lydian-augmented', 'lydian', 'ionian', 'mixolydian', 'dorian', 'aeolian', 'phrygian', 'locrian', 'altered', 'altered-dim'],
    why: 'Every step lowers one note by a half step, so the sound gets one shade darker each time — from the brightest mode (Lydian ♯5) to the darkest (Altered ♭♭7). The middle seven are the modes of the major scale in "brightness order".' },
  { id: 'dark-to-light', name: 'Dark to light, the whole way', lvl: 4, path: ['altered-dim', 'altered', 'locrian', 'phrygian', 'aeolian', 'dorian', 'mixolydian', 'ionian', 'lydian', 'lydian-augmented'],
    why: 'The same ladder climbed upward: each step raises one note a half step and the colour brightens.' },
  { id: 'parent-loop', name: 'The four parent scales in a loop', lvl: 5, path: ['aeolian', 'harmonic-minor', 'harmonic-major', 'ionian', 'melodic-minor', 'dorian', 'aeolian'],
    why: 'Natural minor, harmonic minor, harmonic major, major and melodic minor (plus Dorian) are all one note apart in a circle. Raise the 7 of natural minor and you are in harmonic minor; raise its ♭3 and you have harmonic major; raise the ♭6 and you reach major; lower the 3 for melodic minor; lower the 7 for Dorian; lower the 6 and you are home.' },
  { id: 'dominants', name: 'Dominant colours, bright to dark', lvl: 5, path: ['lydian-dominant', 'mixolydian', 'mixolydian-b6', 'phrygian-dominant'],
    why: 'All four keep the major 3rd and ♭7 — they are all dominant-7th scales — but each step darkens one tension: ♯11 → 11, 13 → ♭13, 9 → ♭9. Lydian dominant suits non-resolving II7/♭VII7; Mixolydian the plain V7; Mixolydian ♭6 and Phrygian dominant a V7 resolving to minor.' },
  { id: 'grand-tour', name: 'Grand tour through all four harmonic systems', lvl: 7, path: ['lydian', 'lydian-augmented', 'ionian-sharp5', 'ionian', 'mixolydian', 'lydian-dominant', 'dorian-sharp4', 'dorian', 'aeolian', 'locrian-nat2', 'locrian', 'locrian-nat6', 'dorian-b2', 'phrygian', 'phrygian-dominant', 'mixolydian-b6', 'harmonic-major', 'harmonic-minor', 'melodic-minor'],
    why: 'Nineteen modes — from the major, melodic-minor, harmonic-minor and harmonic-major families — chained so every step changes exactly one note. It shows that the "exotic" modes are just one note away from ones you already know.' },
];
const journeys = JOURNEYS.map((j) => {
  const steps = j.path.slice(1).map((b, k) => step(j.path[k], b));
  const names = j.path.map((id) => getScale(id).name);
  return {
    id: `scl-journey-${j.id}`, mode: 'play', category: 'scales', tags: ['one-note-change', 'modes', 'parallel-modes', 'drone', 'mode-brightness'],
    title: `One-note journey: ${j.name} on {root}`,
    level: j.lvl, length: j.path.length > 8 ? 'long' : 'medium', minutes: Math.max(4, Math.round(j.path.length * 0.8)),
    params: { root: 'any' },
    prompt: `Over a **{root} drone**, play each scale up and down in the same position (E shape), then change **one note** and play the next:\n\n` +
      names.map((n, k) => `${k + 1}. **{root} ${n}**${k ? ` — ${steps[k - 1]}` : ''}`).join('\n') +
      '\n\nLean on the note that just changed every time it comes round, and listen to the colour shift.',
    goal: 'You can say which note changes before you play each step, and hear the shift against the drone.',
    tempo: { start: 70, min: 40, max: 200, step: 4 }, metronome: { meter: '4/4', subdivision: 2 },
    drone: { note: '$root', fifth: true },
    hints: ['Only one finger moves between scales — find it before you start the next one.', 'Hold the changed note against the drone for a moment: that is the sound of the new mode.'],
    explain: `### Why this works\n${j.why}\n\nPlaying over a drone keeps the root fixed, so the only thing your ear tracks is the single note that moves.`,
    visual: { type: 'scale', root: '$root', scale: j.path[0], region: { caged: 'E' } },
    demo: j.path.map((id, k) => ({ type: 'scale', root: '$root', scale: id, region: { caged: 'E' }, path: 'up-and-down', beatsPerNote: 0.5, title: `${k + 1}. ${getScale(id).name}${k ? ' — ' + steps[k - 1] : ''}` })),
    vary: ['root'], concepts: ['mode-brightness'],
  };
});

// ---------- cycle of fourths ----------
const C4 = ['C', 'F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'B', 'E', 'A', 'D', 'G'];
const cyc = (fn) => '| ' + C4.map(fn).join(' | ') + ' |';
const C4_EXPLAIN = `### What the cycle of fourths is
Start on C and keep going **up a perfect 4th** (= down a perfect 5th): **C F B♭ E♭ A♭ D♭ G♭ B E A D G** — then you are back at C. All twelve keys, each exactly once.

### Why it matters
- **It is the strongest root movement in music.** V → I is a root falling a 5th (rising a 4th). Each step of the cycle is a small V → I: the previous chord is the dominant of the next.
- **Most jazz and lots of pop moves this way.** ii–V–I is two steps of the cycle (D → G → C). *Autumn Leaves* and *Fly Me to the Moon* walk diatonically round it; the bridge of *Rhythm Changes* and *Sweet Georgia Brown* chain dominants round it (E7 → A7 → D7 → G7).
- **Keys:** each step adds one flat (or removes one sharp): C (none) → F (1♭) → B♭ (2♭) …
- **On guitar it’s easy to see:** a 4th is the next string over at the same fret (except crossing G → B, where you go up a fret). So the roots zig-zag across two adjacent strings.

### How to practise it
Play one chord type through all 12 roots in this order, staying in one area of the neck (move each shape only a fret or two — voice-lead). When you can do that without stopping, do ii–V–I in every key around the cycle.`;
const cycleTpl = [
  {
    id: 'cyc4-intro', mode: 'theory', category: 'theory', tags: ['cycle-of-fourths', 'harmony', 'keys'],
    title: 'The cycle of fourths: what it is and why it matters', level: 2, length: 'short',
    prompt: 'Say the cycle of fourths from C out loud, then reveal. Can you say why ii–V–I is "part of the cycle"?',
    quiz: { kind: 'reveal', question: 'Name the 12 keys in cycle-of-fourths order starting from C. Which step of the cycle is ii → V → I in C major?', answer: '**C F B♭ E♭ A♭ D♭ G♭ B E A D G** (then C again).\n\nIn C major, ii–V–I is **D → G → C**: two steps of the cycle (D up a 4th to G, G up a 4th to C). That is why ii–V–I is the most common progression in jazz: it is the strongest root motion, twice.' },
    explain: C4_EXPLAIN, concepts: ['cycle-of-fourths'],
  },
  {
    id: 'cyc4-chords', mode: 'play', category: 'progressions', tags: ['cycle-of-fourths', 'voice-leading', 'all-keys'],
    title: 'Cycle of fourths: {p:type} through all 12 keys',
    level: 3, length: 'medium', minutes: 5,
    params: { type: [
      { v: cyc((r) => `${r}:maj`), label: 'major triads' },
      { v: cyc((r) => `${r}:7`), label: 'dominant 7ths', lvl: 0.5 },
      { v: cyc((r) => `${r}:maj7`), label: 'major 7ths', lvl: 1 },
      { v: cyc((r) => `${r}:m7`), label: 'minor 7ths', lvl: 1 },
    ] },
    prompt: 'Play **{p:type}** round the cycle — C F B♭ E♭ A♭ D♭ G♭ B E A D G — one per bar, staying in one area of the neck (move each shape by the smallest amount). Say each root as you play it.',
    goal: 'All 12 without stopping, at a steady tempo, in one position.',
    tempo: { start: 60, min: 40, max: 200, step: 4 }, metronome: { meter: '4/4' },
    hints: ['The next root is on the next string at the same fret (one fret higher when crossing G → B).', 'Use different inversions so your hand barely moves — watch the demo’s voice leading.'],
    explain: C4_EXPLAIN,
    visual: { type: 'progression', chart: '$type', voiceLead: true, voicing: 'drop2' },
    vary: ['type', 'tempo'], concepts: ['cycle-of-fourths'],
  },
  {
    id: 'cyc4-ii-v-i', mode: 'play', category: 'progressions', tags: ['cycle-of-fourths', 'ii-v-i', 'all-keys'],
    title: 'ii–V–I in all 12 keys, around the cycle',
    level: 5, length: 'long', minutes: 8,
    prompt: 'Play **ii7 – V7 – Imaj7** in C, then F, B♭, E♭ … all the way round the cycle (two bars per key: ii–V, then I). Keep it in one area of the neck with drop-2 or shell voicings.',
    goal: 'Every key without stopping — you know the ii and V of every key instantly.',
    tempo: { start: 66, min: 40, max: 200, step: 4 }, metronome: { meter: '4/4' },
    hints: ['ii is a whole step above the key, V a 5th above it: in F, ii = Gm7, V = C7.', 'The 7th of each chord falls a half step to the 3rd of the next — that is the voice leading to listen for.'],
    explain: C4_EXPLAIN + '\n\n### The ii–V–I inside the cycle\nii → V → I is itself three consecutive steps of the cycle (D → G → C). Practising it in every key, in cycle order, means every key change is also a strong cycle move.',
    visual: { type: 'progression', chart: '| ' + C4.map((r) => { const i = C4.indexOf(r); const two = C4[(i + 10) % 12], five = C4[(i + 11) % 12]; return `${two}:m7 ${five}:7 | ${r}:maj7`; }).join(' | ') + ' |', voiceLead: true, voicing: 'drop2' },
    vary: ['tempo'], concepts: ['cycle-of-fourths', 'ii-v-i'],
  },
  {
    id: 'cyc4-dominant-chain', mode: 'play', category: 'progressions', tags: ['cycle-of-fourths', 'secondary-dominants', 'dominant-chain'],
    title: 'Dominant chain round the cycle: E7 → A7 → D7 → G7 → C',
    level: 4, length: 'short', minutes: 3,
    prompt: 'Play the chain of dominants **E7 → A7 → D7 → G7 → C**: each chord is the V7 of the next (the bridge of *Rhythm Changes* and *Sweet Georgia Brown* work like this). Two bars each, voice-led.',
    goal: 'Hear each dominant "pull" into the next one.',
    tempo: { start: 72, min: 40, max: 200, step: 4 }, metronome: { meter: '4/4' },
    hints: ['Each dominant’s 3rd moves a half step down to the next chord’s 7th.', 'This is a run of secondary dominants: V/V/V/V → V/V/V → V/V → V → I.'],
    explain: C4_EXPLAIN,
    visual: { type: 'progression', chart: '| E:7 | % | A:7 | % | D:7 | % | G:7 | % | C:maj7 | % |', voiceLead: true, voicing: 'drop2' },
    vary: ['tempo'], concepts: ['cycle-of-fourths', 'secondary-dominants'],
  },
];

// ---------- rip it: free improvisation over a drone with the whole neck mapped ----------
const RIP = {
  id: 'improv-rip-it', mode: 'play', category: 'improv', tags: ['improvisation', 'drone', 'whole-neck', 'modes', 'rip-it'],
  title: 'Rip it: {scale} over a {root} drone',
  level: 3, length: 'medium', minutes: 5,
  params: { root: 'any', scale: [
    { v: 'dorian' }, { v: 'mixolydian' }, { v: 'lydian' }, { v: 'aeolian', label: 'natural minor' }, { v: 'ionian', label: 'major' },
    { v: 'phrygian', lvl: 1 }, { v: 'minor-pentatonic' }, { v: 'blues' }, { v: 'major-pentatonic' },
    { v: 'melodic-minor', lvl: 1 }, { v: 'lydian-dominant', lvl: 1 }, { v: 'harmonic-minor', lvl: 1 }, { v: 'phrygian-dominant', lvl: 2 },
    { v: 'mixolydian-b6', lvl: 2 }, { v: 'dorian-b2', lvl: 3 }, { v: 'altered', lvl: 3 }, { v: 'diminished-hw', lvl: 3 }, { v: 'whole-tone', lvl: 2 },
  ] },
  prompt: 'Drone on. The whole neck of **{scale}** ({scaleNotes}) is mapped below, every note labelled with its interval. **Just play** — anywhere on the neck, for a few minutes. Move between positions, slide along strings, and keep landing on the notes that give the mode its colour.',
  goal: 'Five minutes of free playing where you always know which interval you’re on.',
  drone: { note: '$root', fifth: true },
  hints: ['Start on the root, then find the colour note (the one that makes this mode different) and lean on it.', 'Try one string only for a minute, then two, then the whole neck.', 'Leave space: play a phrase, rest, answer it.'],
  explain: 'Improvising over a drone with the whole fretboard mapped trains your ear and your neck knowledge at once: the drone fixes the root, so every note you play is heard as an interval against it. Help shows where the mode comes from, its one-note neighbours and what it is used for.',
  visual: { type: 'scale', root: '$root', scale: '$scale', region: { neck: true }, labels: 'interval' },
  demo: { type: 'scale', root: '$root', scale: '$scale', region: { neck: true }, path: 'up-and-down', beatsPerNote: 0.5 },
  vary: ['root', 'scale'], concepts: ['mode-brightness'],
};

export const templates = [...deepDives, TRIAD_DIVE, ...WHOLE_NECK, SPEED, ...journeys, ...cycleTpl, RIP];
export const concepts = [
  { id: 'cycle-of-fourths', title: 'The cycle of fourths (cycle of fifths)', tags: ['harmony', 'keys'],
    body: C4_EXPLAIN,
    visual: { type: 'progression', chart: cyc((r) => `${r}:7`), voiceLead: true, voicing: 'drop2' },
    see: ['ii-v-i', 'secondary-dominants'] },
];
