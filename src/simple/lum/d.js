// Guitar Luminary handouts, decks D: Bach and classical / rhythm and reading / tunes.
const D = (bpm, sub, from, goal, drone) => ({ bpm, sub, from, goal, drone });

// ---------- shared event helpers ----------
// A six-step grid per beat for 3:2 (sub 3, the click = the lower voice's 8th):
// upper triplet on steps 1, 3, 5; lower 8ths on steps 1 and 4.
const g6 = (both, t2, low2, t3) => [both, [], t2, low2, t3, []];

// BWV 999, bars 1, 3, 5, 7 (Segovia's fingering), labels in D minor
const bwvPattern = [
  [4, 0, '1'], [3, 7, '1'], [2, 6, 'b3'], [1, 5, '5'], [2, 6, 'b3'], [3, 7, '1'], [2, 6, 'b3'], [3, 7, '1'], [4, 7, '5'], [3, 7, '1'], [4, 3, 'b3'], [3, 7, '1'],
  [4, 0, '1'], [3, 7, '1'], [2, 8, '4'], [1, 6, 'b6'], [2, 8, '4'], [3, 7, '1'], [2, 8, '4'], [3, 7, '1'], [4, 8, 'b6'], [3, 7, '1'], [4, 5, '4'], [3, 7, '1'],
  [4, 0, '1'], [2, 2, '7'], [1, 0, '2'], [1, 3, '4'], [1, 0, '2'], [2, 2, '7'], [1, 0, '2'], [2, 2, '7'], [3, 3, 'b6'], [2, 2, '7'], [3, 0, '4'], [2, 2, '7'],
  [4, 0, '1'], [3, 2, '5'], [2, 3, '1'], [1, 1, 'b3'], [2, 3, '1'], [3, 2, '5'], [2, 3, '1'], [3, 2, '5'], [4, 3, 'b3'], [3, 2, '5'], [4, 0, '1'], [3, 2, '5'],
];

// Bach's Diminished Lesson, labels in A minor, open E bass
const arp6 = (lo, mid, top) => [[6, 0, '5'], lo, mid, top, mid, lo];
const dimLesson1 = [
  ...arp6([3, 1, '7'], [2, 3, '4'], [1, 0, '5']),
  ...arp6([3, 2, '1'], [2, 1, 'b3'], [1, 0, '5']),
  ...arp6([3, 4, '2'], [2, 3, '4'], [1, 4, '7']),
  ...arp6([3, 5, 'b3'], [2, 5, '5'], [1, 5, '1']),
  ...arp6([3, 7, '4'], [2, 9, '7'], [1, 7, '2']),
  ...arp6([3, 9, '5'], [2, 10, '1'], [1, 8, 'b3']),
  ...arp6([3, 9, '5'], [2, 9, '7'], [1, 10, '4']),
  ...arp6([3, 14, '1'], [2, 13, 'b3'], [1, 12, '5']),
];
const dimLesson2 = [
  ...arp6([3, 14, '1'], [2, 13, 'b3'], [1, 11, 'b5']),
  ...arp6([3, 13, '7'], [2, 12, '2'], [1, 10, '4']),
  ...arp6([3, 8, 'b5'], [2, 10, '1'], [1, 8, 'b3']),
  ...arp6([3, 7, '4'], [2, 9, '7'], [1, 7, '2']),
  ...arp6([3, 5, 'b3'], [2, 4, 'b5'], [1, 5, '1']),
  ...arp6([3, 4, '2'], [2, 3, '4'], [1, 4, '7']),
  ...arp6([4, 7, '1'], [3, 5, 'b3'], [2, 4, 'b5']),
  ...arp6([4, 6, '7'], [3, 4, '2'], [2, 3, '4']),
];
const arp8 = (a, b, c, d) => [[6, 0, '5'], a, b, c, d, c, b, a];
const dimLesson3 = [
  ...arp8([4, 7, '1'], [3, 8, 'b5'], [2, 7, '6'], [1, 8, 'b3']),
  ...arp8([4, 6, '7'], [3, 7, '4'], [2, 6, 'b6'], [1, 7, '2']),
  ...arp8([4, 4, '6'], [3, 5, 'b3'], [2, 4, 'b5'], [1, 5, '1']),
  ...arp8([4, 3, 'b6'], [3, 4, '2'], [2, 3, '4'], [1, 4, '7']),
  ...arp8([5, 6, 'b5'], [4, 7, '1'], [3, 5, 'b3'], [2, 7, '6']),
];

// Fake Bach Prelude (BWV 999 + Barry Harris), bars 2-5, labels in D minor
const fakeBachArp = [
  [5, 5, '1'], [4, 7, '5'], [3, 7, '1'], [2, 6, 'b3'], [3, 7, '1'], [4, 7, '5'], [3, 7, '1'], [4, 7, '5'], [4, 8, 'b6'], [3, 6, '7'], [5, 7, '2'], [3, 6, '7'],
  [6, 9, '7'], [4, 8, 'b6'], [3, 9, '2'], [2, 8, '4'], [3, 9, '2'], [4, 8, 'b6'], [3, 9, '2'], [4, 8, 'b6'], [4, 7, '5'], [3, 7, '1'], [5, 8, 'b3'], [3, 7, '1'],
  [6, 6, 'b6'], [4, 7, '5'], [3, 7, '1'], [2, 6, 'b3'], [3, 7, '1'], [4, 7, '5'], [3, 7, '1'], [4, 7, '5'], [4, 5, '4'], [3, 3, 'b6'], [5, 5, '1'], [3, 3, 'b6'],
  [5, 4, '7'], [4, 5, '4'], [3, 3, 'b6'], [2, 5, '2'], [3, 3, 'b6'], [4, 5, '4'], [3, 3, 'b6'], [4, 5, '4'], [4, 3, 'b3'], [3, 2, '5'], [4, 0, '1'], [3, 2, '5'],
];

export const DECKS = [
// =====================================================================
{ id: 'lum-bach', name: 'Luminary: Bach and classical', cards: [

  { t: 'BWV 999: why study it', s: 'one pattern, one chord a bar', b: [
    'Bach’s little Prelude BWV 999 (a lute piece in C minor, played on guitar in D minor) runs a single right-hand pattern through 43 bars and changes chord once a bar. Nothing distracts from the harmony, so it is a harmony lesson you can hear and play.',
    '- Bars 1–10: D minor. A tonic pedal under i – iv – V, then the bass walks down the scale under a held D minor triad',
    '- Bars 11–16: G♯°7 turns the music to A minor, the minor dominant key',
    '- Bars 17–32: a long E pedal: the dominant of A minor, stretched with more and more diminished colour',
    '- Bars 33–43: an A pedal, A major arrives, and the piece stops there, on the dominant of D, never going home',
    'Learn it as chord shapes first (the next cards), then let the pattern play them. From the Guitar Luminary handouts “BWV 999 Prelude in D Minor” and “BWV999 Harmonic Analysis & Segovia”.',
  ] },

  { t: 'BWV 999: the right-hand pattern', s: 'bars 1, 3, 5, 7, Segovia’s fingering',
    drill: D(50, 4, '16ths at 50', '16ths at 90', 'D'), neck: { kind: 'list', events: bwvPattern }, b: [
    'Every bar is the same twelve 16ths: the bass, three chord tones rising, a rocking figure on the top two, then a lower voice in 8ths answered by the middle note. The neck plays bars 1, 3, 5 and 7: Dm, Gm/D, C♯°/D (a rootless A7 over the pedal), Dm.',
    '- Thumb on the bass and the lower 8ths, fingers on the rest; let the bass ring through the bar',
    '- Hold each bar as one grip: the fingering keeps every bar inside one hand position',
    '- Bring out the bass and the lower 8ths slightly: that is Bach’s second line, hidden in the pattern',
    '- Learn each bar as a block chord first, then pattern it',
    '<b>Harder</b>: the whole piece at 16ths = 90, changing grip on the bar line with no gap. From the Guitar Luminary handout “BWV999 Harmonic Analysis & Segovia”.',
  ] },

  { t: 'BWV 999: the harmonic map', s: 'bars 1–19 as block chords', b: [
    'Reduce every bar to its bass and the three upper notes and play the bars as chords, one per bar. This is the skeleton the pattern decorates; name each chord aloud as you play it.',
    '- Bars 1–6: Dm, Gm/D, C♯°/D over a D pedal: i – iv – V with the tonic held in the bass',
    '- Bars 7–10: the D minor triad stays put while the bass steps down D – C – B♭ – A',
    '- Bars 11–14: G♯°7 (E7♭9 over its 3rd) leads to A minor; in bar 13 a B over A falls to A in bar 14',
    '- Bars 15–19: Fmaj7 (VI of A minor), Dm6 (iv), E7 (V), Am/E: the same iv6 – V7 – i as Django’s Minor Swing',
    'From the Guitar Luminary handout “BWV999 Harmonic Analysis & Segovia”.',
  ], ex: [
    ['Bars 1–7: i – iv – V – i over D', '=D3 D4 F4 A4 | D3 D4 G4 Bb4 | D3 C#4 E4 G4 | D3 A3 D4 F4'],
    ['Bars 8–14: the bass walks down, G♯°7, A minor', '=C3 A3 D4 F4 | Bb2 A3 D4 F4 | A2 A3 D4 F4 | G#2 B3 D4 F4 | A2 B3 C4 E4 | A2 A3 C4 E4'],
    ['Bars 15–19: Fmaj7 – Dm6 – E7 – Am/E', '=F2 C4 E4 A4 | D3 B3 F4 A4 | E2 B3 D4 G#4 | E2 C4 E4 A4'],
  ] },

  { t: 'BWV 999: the long dominant', s: 'bars 17–30 over an E pedal', b: [
    'Once A minor is reached, Bach holds E in the bass for fourteen bars and keeps changing what sits above it. Each new chord brings one chromatic note, so the tension rises while the bass stands still.',
    '- First E7 and Am/E alternate: dominant, tonic, dominant',
    '- Then Am(♭5)/E (E♭ for E), E7♭9 (F appears), C°7/E, E7sus, Am6(♭5)/E: more and more diminished sound',
    '- The upper voices move by half steps; play slowly and follow each one',
    '- It settles on Am/E in bar 30, still over the E',
    'The next four cards turn this passage into exercises. From the Guitar Luminary handout “BWV999 Harmonic Analysis & Segovia”.',
  ], ex: [
    ['Bars 17–21: E7 and Am over E', '=E2 B3 D4 G#4 | E2 C4 E4 A4 | E2 D4 G#4 B4 | E2 E4 A4 C5'],
    ['Bars 22–25: E7, Am(♭5), E7♭9, C°7', '=E2 E4 G#4 D5 | E2 Eb4 A4 C5 | E2 G#3 D4 F4 B4 | E2 D#3 C4 F#4 A4'],
    ['Bars 26–30: E7sus, E7, Am6(♭5), E7♭9, Am', '=E2 B3 D4 A4 | E2 B3 D4 G#4 | E2 D#3 A3 C4 F#4 | E2 G#3 B3 F4 | E2 A3 C4 E4'],
  ] },

  { t: 'Bach’s diminished lesson', s: 'what the next three cards are for', b: [
    'The handout takes the long E pedal of BWV 999 (from bar 17) and swaps the picking pattern for plain 8th-note arpeggios, so you can hear how Bach builds tension over a dominant.',
    '- Step 1: just E7 and Am/E, alternating up the neck',
    '- Step 2: Am gets a flattened 5th (E♭), and every voice now moves by a half step into E7',
    '- Step 3: add E7’s ♭9 (F) and Am’s 6th (F♯). Am6(♭5) is F♯°7; E7♭9 holds G♯°7. Two diminished 7ths a half step apart: a diminished scale of chords',
    'It is Barry Harris’s family of dominants, found in Bach: a dominant 7th is a diminished 7th with one note lowered, and moving between the two diminished chords spins out its tension. Bach adds the notes one at a time, so you hardly notice. From the Guitar Luminary handout “Bach’s Diminished Lesson”.',
  ] },

  { t: 'Dim lesson 1: E7 and Am/E', s: 'up the neck over the open E',
    drill: D(60, 2, '8ths at 60', '8ths at 120', 'E'), neck: { kind: 'list', events: dimLesson1 }, b: [
    'Over the open low E, alternate E7 and Am/E as three-note arpeggios on the top three strings, one inversion higher each bar: bass, then low, middle, top, middle, low.',
    '- E7 with no root on the top strings: G♯–D–E, B–D–G♯, D–G♯–B, E–G♯–D',
    '- Am/E: A–C–E, C–E–A, E–A–C, then A–C–E an octave up at frets 12–14',
    '- Hear how little moves: G♯ to A, D to C or E, the rest holds',
    '- Let the bass ring for the whole bar. Labels are A minor degrees',
    '<b>Harder</b>: block chords on the beat, then the BWV 999 pattern on each shape. From the Guitar Luminary handout “Bach’s Diminished Lesson”.',
  ] },

  { t: 'Dim lesson 2: flatten the 5th', s: 'Am(♭5) and E7, coming down',
    drill: D(60, 2, '8ths at 60', '8ths at 120', 'E'), neck: { kind: 'list', events: dimLesson2 }, b: [
    'The same idea down the neck, but Am now has E♭ for its 5th: Am(♭5)/E. Against the E bass that E♭ is pure tension, and it slides to D as the chord changes to E7.',
    '- Every voice moves by a half step or holds: A→G♯, C→B, E♭→D',
    '- A–C–E♭ is a diminished triad: F♯°7 without its F♯',
    '- From fret 14 down to fret 3, the last two bars on the middle strings',
    '- Sing the voice that moves while you play',
    '<b>Harder</b>: play each bar as a block chord with the bass on every beat, moving one finger at a time. From the Guitar Luminary handout “Bach’s Diminished Lesson”.',
  ] },

  { t: 'Dim lesson 3: two diminished 7ths', s: 'F♯°7 and G♯°7 over E',
    drill: D(60, 2, '8ths at 60', '8ths at 120', 'E'), neck: { kind: 'list', events: dimLesson3 }, b: [
    'Both new notes are in: E7 has its ♭9 (F) and Am its 6th (F♯). Am6(♭5) is F♯°7, and E7♭9 without its root is G♯°7. Alternate the two down the neck over the E bass, each shape a half step below the last.',
    '- Drop-2 shapes on the top four strings at frets 7, 6, 4, 3, then the same kind of shape on strings 5–2',
    '- Each change moves all four voices a half step: A→G♯, E♭→D, F♯→F, C→B',
    '- Together the two chords spell the whole diminished scale (F♯ G♯ A B C D E♭ F)',
    '- Finish by resolving to A, and hear how much tension has built up',
    'Bach never states it this plainly; the exercise exaggerates what he does one note at a time. From the Guitar Luminary handout “Bach’s Diminished Lesson”.',
  ] },

  { t: 'Fake Bach: 6th-diminished blocks', s: 'BWV 999 heard through Barry Harris',
    drill: D(60, 1, 'quarters at 60', 'quarters at 100', 'D'), neck: { kind: 'list', events: [
      [[5, 5, '1'], [4, 7, '5'], [3, 7, '1'], [2, 6, 'b3']], [], [[5, 7, '2'], [4, 8, 'b6'], [3, 6, '7']],
      [[6, 9, '7'], [4, 8, 'b6'], [3, 9, '2'], [2, 8, '4']], [], [[5, 8, 'b3'], [4, 7, '5'], [3, 7, '1']],
      [[6, 6, 'b6'], [4, 7, '5'], [3, 7, '1'], [2, 6, 'b3']], [], [[5, 5, '1'], [4, 5, '4'], [3, 3, 'b6']],
      [[5, 4, '7'], [4, 5, '4'], [3, 3, 'b6'], [2, 5, '2']], [], [[5, 5, '1'], [4, 3, 'b3'], [3, 2, '5']],
    ] }, b: [
    'Two handouts recompose BWV 999 with Barry Harris’s minor 6th-diminished idea: D minor chords alternate with C♯°7 (C♯ E G B♭), in drop-2 and drop-3 voicings. First as block chords: a half note, then a quarter, in each 3/4 bar.',
    '- Bar 1: Dm (D–A–D–F), then E–B♭–C♯. Bar 2: C♯°7 (drop 3), then Dm/F',
    '- Bar 3: B♭maj7, then Gm/D. Bar 4: C♯°7 again, then Dm',
    '- Each note of C♯°7 steps up to the nearest Dm6 note (C♯→D, E→F, G→A, B♭→B): that pull is why it resolves',
    '- Hold the half note its full length; play the quarter lighter',
    'The later bars treat the dominant section the same way (Am6/E, E7, D°7 shapes). From the Guitar Luminary handouts “Fake Bach Prelude - Half Quater Rhythm” and “BVW999 + Barry Harris”.',
  ] },

  { t: 'Fake Bach: into Bach’s pattern', s: 'the same chords, arpeggiated',
    drill: D(50, 4, '16ths at 50', '16ths at 90', 'D'), neck: { kind: 'list', events: fakeBachArp }, b: [
    'Now the same chords in the BWV 999 figure: bass, three notes up, the rocking pair, then the lower 8ths. In this version the lower 8ths carry the passing chord, so each bar moves between two harmonies.',
    '- Bar 1: Dm (D–A–D–F), then B♭, C♯, E: the diminished chord in the last beat',
    '- Bar 2: C♯°7 as a drop 3 (C♯–B♭–E–G), resolving to Dm/F',
    '- Bar 3: B♭maj7, then Gm/D; bar 4: C♯°7 (C♯–G–B♭–E), then Dm',
    '- Learn each bar as two grips, the second a quick change on beat 3',
    '<b>Harder</b>: write your own bars the same way over BWV 999’s chords from the harmonic map. From the Guitar Luminary handout “BVW999 + Barry Harris”.',
  ] },

  { t: 'Schubert’s Ständchen: the chart', s: 'the harmony before the notes', b: [
    'Two one-page charts of the main theme of Schubert’s Ständchen (“Serenade”): in D minor, and in A minor, the key of Johann Kaspar Mertz’s guitar version. Learn the harmony first, then the melody sits on it.',
    '- Opening: i – VI – iv6 – V7 (Am – F – Dm6 – E7). Dm6 is also Bø7, the iiø7, over D',
    '- The theme then visits the relative major: Dm/F – G7 – C (iv6, V7 of III, III)',
    '- Back through E7 to Am, out to C again, and at last E7 resolves to A <b>major</b>: minor, relative major, tonic major',
    '- The closing tag: D – A – E7 – A (IV – I – V7 – I)',
    'Play the chart as bass and chord on each beat and sing the tune over it. From the Guitar Luminary handouts “A Minor Reduction” and “D Minor Reduction”.',
  ], ex: [
    ['Opening, A minor', 'A:min F:maj D:m6 E:7'],
    ['Into C major', 'A:min D:min/b3 G:7 C:maj E:7 A:min'],
    ['To A major and the tag', 'G:7 C:maj E:7 A:maj D:maj A:maj E:7 A:maj'],
    ['Opening, D minor', 'D:min Bb:maj G:m6 A:7'],
  ] },

  { t: 'Sarabande BWV 996: the opening', s: 'a fingering that keeps the chord ringing',
    drill: D(60, 2, 'even 8ths at 60', 'even 8ths at 100, legato', 'E'), neck: { kind: 'list', events: [
      [[6, 0, '1'], [4, 2, '1'], [3, 0, 'b3'], [2, 0, '5']], [], [],
      [4, 10, 'b6'], [4, 9, '5'], [4, 7, '4'], [4, 5, 'b3'], [4, 7, '4'], [4, 5, 'b3'], [4, 4, '2'], [4, 2, '1'], [],
    ] }, b: [
    'A sarabande is a slow dance in three with weight on the second beat; this one, from Bach’s E minor lute suite, is in 3/2. The handouts give two fingerings for the first bar’s run: one on open strings, and one that plays the whole run on the 4th string so the open G and B of the opening chord keep sounding under it.',
    '- The neck shows the ringing fingering in even 8ths: the chord, then C–B–A–G–A–G–F♯–E on the D string, frets 10 down to 2',
    '- The run is a melody over a held E minor chord, not a scale: let the chord ring',
    '- Shift on the same finger between frets 7 and 5, and 5 and 4, so the line stays joined',
    '- Then bars 2–4: C over the E pedal, B7 without its root (D♯–F♯–A), and the cadence on E minor',
    'Lean on beat 2 to make it dance. From the Guitar Luminary handouts “Sarabande Suite E Minor BWV996” and “Sarabande BWV996”.',
  ], ex: [
    ['Bar 1: E minor, then the run', '=E2 E3 G3 B3 | C4 | B3 | A3 | G3 | A3 | G3 | F#3 | E3'],
    ['Bars 2–3: C over E, then rootless B7', '=E2 G3 C4 | B3 | F#3 A3 | E3 | D#3 F#3 A3 | A3 | B3 | C4 | B3 | A3'],
    ['Bar 4: the cadence', '=E3 G3 | A3 | G3 | B2 | F#3 | E2 B2 E3'],
  ] },

  { t: 'Sarabande in A minor', s: 'leading notes that rise', b: [
    'The other sarabande handout (Bach, A minor, 3/4) is built from one gesture: two chord tones falling, then a slurred leading note rising a half step, G♯→A or C♯→D. The bass comes in late, on beat 3, under a rest in the top voice.',
    '- Bar 1: E–C, then G♯→A; bass F',
    '- Bar 2: A–F, then C♯→D; bass G♯ (a diminished sound under F and D)',
    '- Bar 3: B–F, C♯→D, then E; bass E, the dominant',
    '- Bar 4: D–C, G♯→A; bass A, home',
    'Play each slurred pair as a real slur and let the leading note lean into its resolution. From the Guitar Luminary handout “Sarabande (Bach)”.',
  ], ex: [
    ['Bars 1–2', '=E4 | C4 | G#3 | A3 | F2 | A4 | F4 | C#4 | D4 | G#2'],
    ['Bars 3–4', '=B4 | F4 | C#4 | D4 | E2 | E4 | D4 | C4 | G#3 | A3 | A2'],
  ] },

  { t: 'Barrios turnaround', s: 'I – I°7 – iii – VI7 – ii – V – I',
    drill: D(60, 1, 'a chord every 2 beats at 60', 'at 100, no gaps', 'C'), neck: { kind: 'list', events: [
      [[5, 7, '3'], [3, 5, '1'], [2, 8, '5'], [1, 8, '1']], [],
      [[5, 7, '3'], [3, 5, '1'], [2, 8, '5'], [1, 7, '7']], [[5, 6, '#2'], [3, 5, '1'], [2, 7, '#4'], [1, 5, '6']],
      [[6, 7, '7'], [4, 9, '7'], [3, 9, '3'], [2, 8, '5']], [],
      [[6, 6, 'b7'], [4, 5, '5'], [3, 6, '#1'], [2, 6, '4']], [],
      [[6, 5, '6'], [4, 4, '#4'], [3, 5, '1'], [2, 5, '3']], [],
      [[6, 3, '5'], [4, 5, '5'], [3, 4, '7'], [2, 3, '2']], [],
      [[6, 8, '1'], [5, 7, '3'], [4, 5, '5'], [3, 5, '1']], [],
    ] }, b: [
    'From Barrios’s Estudio de Concierto in A: a turnaround that dresses up VI7 – ii – V7 – I with chromatic bass motion. The handout transposes it to C and F; the neck plays the C version as block chords (labels are C major degrees).',
    '- C/E – Cmaj7/E – D♯°7 (I°7 with its ♭3 in the bass) – Em/B: the bass falls E – D♯ – B',
    '- A7 with its ♭9 in the bass (B♭–G–C♯–F) – Am6 over A (D9 without its root, standing in for ii) – G – C',
    '- The whole bass line: E E D♯ B B♭ A G C',
    '- In the étude each chord is broken into 16ths, from the top note down to the bass and back up',
    '<b>Harder</b>: play it in A, where Barrios wrote it, and in F, then add the 16th arpeggio. From the Guitar Luminary handouts “Barrios Turnaround” and “Barrios 3 Main Themes”.',
  ], ex: [
    ['In C', '=E3 C4 G4 C5 | E3 C4 G4 B4 | D#3 C4 F#4 A4 | B2 B3 E4 G4 | Bb2 G3 C#4 F4 | A2 F#3 C4 E4 | G2 G3 B3 D4 | C3 E3 G3 C4'],
    ['In A, the original key', '=C#3 A3 E4 A4 | C#3 A3 E4 G#4 | C3 A3 D#4 F#4 | G#2 G#3 C#4 E4 | G2 E3 A#3 D4 | F#2 D#3 A3 C#4 | E2 E3 G#3 B3 | A2 C#3 E3 A3'],
  ] },

  { t: 'Barrios: Una Limosna tremolo', s: 'the harmony and p-a-m-i',
    drill: D(60, 4, '16ths at 60', '16ths at 110, even', 'E'), neck: { kind: 'list', events: [
      [6, 0, 'p'], [1, 0, 'a'], [1, 0, 'm'], [1, 0, 'i'], [4, 2, 'p'], [1, 0, 'a'], [1, 0, 'm'], [1, 0, 'i'],
      [3, 0, 'p'], [1, 0, 'a'], [1, 0, 'm'], [1, 0, 'i'], [4, 2, 'p'], [1, 0, 'a'], [1, 0, 'm'], [1, 0, 'i'],
    ] }, b: [
    'Una Limosna por el Amor de Dios is a tremolo piece: the thumb plays a bass and arpeggio line, and after each thumb stroke a-m-i repeat the melody note three times. The handout’s excerpt, in E minor, runs through a classic minor progression.',
    '- Em – Em/G – Am7 – Am6 – Am6/C (= F♯ø7/C) – B7 with the bass walking B – C♯ – D♯ – Am6/E – Em',
    '- The neck drills the motion on open strings: p on an E minor bass line, a-m-i on the top E',
    '- Aim for three equal repeats: a tends to be loud and i late',
    '- Plant the thumb stroke firmly; the tremolo hangs off it',
    '<b>Harder</b>: the progression under it, thumb on each chord’s bass and inner notes, tremolo on a chord tone on top. From the Guitar Luminary handout “Barrios 3 Main Themes”.',
  ], ex: [
    ['The excerpt’s chords', 'E:min E:min/b3 A:m7 A:m6 A:m6/b3 B:7 A:m6/5 E:min'],
  ] },

  { t: 'Barrios: La Catedral in tenths', s: 'Allegro solemne, the harmony',
    drill: D(50, 1, 'a shape a beat at 50', 'then the 16th arpeggio', 'B'), neck: { kind: 'list', events: [
      [[5, 5, 'b3'], [4, 4, '5'], [1, 2, '5']], [],
      [[5, 4, '2'], [4, 2, '4'], [2, 5, '4']], [],
      [[5, 2, '1'], [4, 0, 'b3'], [2, 3, 'b3']], [],
      [[6, 5, 'b7'], [5, 4, '2'], [2, 2, '2']], [],
      [[6, 3, 'b6'], [5, 2, '1'], [2, 0, '1']], [],
      [[6, 2, '5'], [5, 4, '2'], [3, 3, '7']], [],
    ] }, b: [
    'The handout’s passage from the last movement of La Catedral (B minor, 6/8) is a scale coming down in tenths: a bass note, the note a tenth above it on top, and that top note doubled an octave lower in the middle.',
    '- The tenths step down D/F♯, C♯/E, B/D, A/C♯, G/B, and land on F♯/A♯, the dominant',
    '- Each tenth lasts two bars while the bass rocks down to a neighbour note and back',
    '- Right hand in each half bar of 16ths: bass, middle, top, middle, second bass, middle (p–i–a–i–p–i, for example)',
    '- Keep the top note soft and even: it should sound like one wash of harmony',
    'Learn the shapes as blocks (the neck), then add the arpeggio. Labels are B minor degrees. From the Guitar Luminary handout “Barrios 3 Main Themes”.',
  ] },
] },

// =====================================================================
{ id: 'lum-rhythm', name: 'Luminary: rhythm and reading', cards: [

  { t: 'Reading: how to start', s: 'staff to fretboard, first position', b: [
    'The handout is a first-steps reading method in C: learn where the natural notes live, then read by interval and by shape rather than note by note.',
    '- FACE for the spaces is fine; skip the rhymes, they slow you down',
    '- Stay on the “white keys” (C D E F G A B) until staff-to-fret is automatic',
    '- Read steps and skips: “up a step, down a third” is faster than naming each note',
    '- Guitar music sounds an octave lower than written (the small 8 under the clef)',
    'From the Guitar Luminary handout “The Reading Guitarist”.',
  ], ex: [
    ['The natural notes, low E to high F', '=E2 | F2 | G2 | A2 | B2 | C3 | D3 | E3 | F3 | G3 | A3 | B3 | C4 | D4 | E4 | F4'],
  ] },

  { t: 'Reading: one phrase, four places', s: 'the same notes in four positions',
    drill: D(60, 2, '8ths at 60', '8ths at 110, reading ahead', 'C'), neck: { kind: 'list', events: [
      [1, 0, '3'], [1, 1, '4'], [1, 0, '3'], [2, 3, '2'], [2, 1, '1'], [2, 0, '7'], [3, 2, '6'], [2, 0, '7'], [2, 1, '1'], [],
      [2, 5, '3'], [2, 6, '4'], [2, 5, '3'], [3, 7, '2'], [3, 5, '1'], [3, 4, '7'], [4, 7, '6'], [3, 4, '7'], [3, 5, '1'], [],
      [3, 9, '3'], [3, 10, '4'], [3, 9, '3'], [3, 7, '2'], [4, 10, '1'], [4, 9, '7'], [4, 7, '6'], [4, 9, '7'], [4, 10, '1'], [],
      [3, 9, '3'], [3, 10, '4'], [3, 9, '3'], [4, 12, '2'], [4, 10, '1'], [4, 9, '7'], [5, 12, '6'], [4, 9, '7'], [4, 10, '1'], [],
    ] }, b: [
    'One short phrase, E F E D C B A B C, played at the same pitch in four places: open position, fifth, seventh and ninth. Same notes on the staff, four different maps on the neck.',
    '- Write the phrase out (or picture it) and read it each time; don’t play from memory',
    '- Notice which notes move string between positions: E sits on string 1, 2, 3 and then 3 again',
    '- Say the position before you start, and keep one finger per fret inside it',
    '<b>Harder</b>: other short phrases from the handout in all five positions, then reading new music in fifth position only. From the Guitar Luminary handout “The Reading Guitarist”.',
  ] },

  { t: 'Reading: rows of three', s: 'a scale pattern to read, not memorise',
    drill: D(60, 2, '8ths at 60', '8ths at 120', 'C'), neck: { kind: 'list', events: [
      [2, 1, '1'], [2, 3, '2'], [1, 0, '3'], [2, 1, '1'], [2, 3, '2'], [1, 0, '3'], [1, 1, '4'], [2, 3, '2'],
      [2, 0, '7'], [2, 1, '1'], [2, 3, '2'], [2, 0, '7'], [2, 1, '1'], [2, 3, '2'], [1, 0, '3'], [2, 1, '1'],
    ] }, b: [
    'Three notes up the scale and back to the first: C D E C, D E F D, then B C D B, C D E C. In first position, then in every position you know.',
    '- On the staff the shape repeats one step higher or lower: read the shape, not the notes',
    '- Keep strict 8ths and don’t stop on mistakes; reading is about keeping going',
    '- Continue the rows up the scale to the top of the position and back down',
    '<b>Harder</b>: rows of four (C D E F C), and the same rows in fifth position. From the Guitar Luminary handout “The Reading Guitarist”.',
  ] },

  { t: 'Reading triads by shape', s: 'see the chord, not three notes', b: [
    'Triads are harder to read than scale steps, so learn their look: root position is three notes stacked line-line-line or space-space-space. Recognise the shape the way you read a word without spelling it.',
    '- The handout’s set: C, Am, F, Dm, G, Em, Am, B°, C (all the white-key triads), each arpeggiated then struck',
    '- First inversion: the gap (a 4th) is at the top; second inversion: the gap is at the bottom',
    '- Name each one aloud before you play it',
    'From the Guitar Luminary handout “The Reading Guitarist”.',
  ], ex: [
    ['Root position, the white-key triads', '=C4 E4 G4 | A3 C4 E4 | F3 A3 C4 | D3 F3 A3 | G3 B3 D4 | E3 G3 B3 | A2 C3 E3 | B2 D3 F3 | C3 E3 G3'],
    ['First inversions: C/E, G/B', '=E3 G3 C4 | B3 D4 G4'],
    ['Second inversions: C/G, G/D', '=G3 C4 E4 | D4 G4 B4'],
  ] },

  { t: 'Reading a melody: Sor', s: 'a study in C, first position', b: [
    'The handout ends with the opening of a Fernando Sor study in C: a real melody to read in first position, with half notes as the only new rhythm.',
    '- Read a bar ahead of where you are playing',
    '- Find a fingering in first position and keep it; don’t look at the neck',
    '- Count half notes for their full two beats',
    'From the Guitar Luminary handout “The Reading Guitarist”.',
  ], ex: [
    ['Bars 1–4', '=C4 | B3 | G3 | C4 | B3 | G3 | C4 | D4 | E4 | G4 | F4 | E4 | D4 | G3'],
  ] },

  { t: '2-voice rhythm test: why', s: 'two rhythms in one hand', b: [
    'Four short exercises in C major, all on the same notes: an upper voice climbing the scale from D and a lower voice falling from C. Only the rhythm changes, so any stumble is a rhythm problem, not a notes problem.',
    '- Test 1: both voices in 8ths together',
    '- Test 2: the voices take turns: one moves while the other holds',
    '- Test 3: 8ths on top over quarters in the bass',
    '- Test 4: triplets on top over 8ths in the bass (3 against 2)',
    'Fingerstyle (p on the lower voice, i-m on the upper) or pick and fingers. Count aloud, and go slowly enough to be right first time. From the Guitar Luminary handout “The 2-Voice Rhythm Test - C Major”.',
  ] },

  { t: 'Test 1: contrary motion, offset', s: 'both voices in 8ths',
    drill: D(60, 2, '8ths at 60', '8ths at 140', 'C'), neck: { kind: 'list', events: [
      [[2, 3, '2'], [3, 5, '1']], [[2, 5, '3'], [3, 4, '7']], [[2, 6, '4'], [4, 7, '6']], [[2, 8, '5'], [4, 5, '5']],
      [[2, 10, '6'], [5, 8, '4']], [[1, 7, '7'], [5, 7, '3']], [[1, 8, '1'], [5, 5, '2']], [[1, 10, '2'], [6, 8, '1']],
    ] }, b: [
    'The upper voice climbs from D, the lower falls from C: they start a step apart (the one-note offset) and spread to two octaves and a step.',
    '- Every 8th is a pair: pinch it with p and i or m',
    '- The voices cross nothing and meet nowhere: a clean test of hand independence across the strings',
    '- The neck uses the handout’s frets: up to fret 10 for the top, down to the 6th string for the bass',
    '<b>Harder</b>: start the lower voice on E or G for different intervals. From the Guitar Luminary handout “The 2-Voice Rhythm Test - C Major”.',
  ] },

  { t: 'Test 2: alternating voices', s: 'one moves, the other holds',
    drill: D(60, 2, '8ths at 60', '8ths at 120', 'C'), neck: { kind: 'list', events: [
      [[2, 3, '2'], [3, 5, '1']], [2, 5, '3'], [2, 6, '4'], [3, 4, '7'], [4, 7, '6'], [2, 8, '5'], [1, 5, '6'], [4, 5, '5'],
      [5, 8, '4'], [1, 7, '7'], [1, 8, '1'], [5, 7, '3'], [6, 10, '2'], [1, 10, '2'], [[1, 12, '3'], [6, 8, '1']], [],
    ] }, b: [
    'The same scales, but the voices take turns: two quick notes in one voice while the other holds a longer note, then the reverse. The neck shows only the attacks; hold every note until that voice moves again.',
    '- Upper: D E F G A | (A held) B C D E. Lower: C B A G | F E D C',
    '- Most beats have only one voice moving: listen for the held note still sounding',
    '- Count 8ths aloud: “1 & 2 & 3 & 4 &”',
    '<b>Harder</b>: swap which voice moves first. From the Guitar Luminary handout “The 2-Voice Rhythm Test - C Major”.',
  ] },

  { t: 'Test 3: 8ths over quarters', s: 'a walking bass under a line',
    drill: D(60, 2, '8ths at 60', '8ths at 140', 'C'), neck: { kind: 'list', events: [
      [3, 5, '1'], [2, 3, '2'], [[2, 5, '3'], [3, 4, '7']], [2, 6, '4'], [[2, 8, '5'], [4, 7, '6']], [1, 5, '6'], [[1, 7, '7'], [4, 5, '5']], [1, 8, '1'],
      [[1, 10, '2'], [5, 8, '4']], [1, 12, '3'], [[1, 13, '4'], [6, 12, '3']], [1, 15, '5'], [[1, 17, '6'], [6, 10, '2']], [], [], [],
    ] }, b: [
    'The bass walks down in quarters (C B A G F E D) while the top runs up the scale in 8ths from D, starting an 8th late, to A at fret 17.',
    '- The thumb plays on the beat, the fingers on and between: like a walking bass under a solo',
    '- The top shifts up the first string from fret 5: plan the slides',
    '- Keep the bass legato; don’t let it stop when the top shifts',
    '<b>Harder</b>: the top in 8th-note triplets against the same quarters. From the Guitar Luminary handout “The 2-Voice Rhythm Test - C Major”.',
  ] },

  { t: 'Test 4: three against two', s: 'triplets over 8ths',
    drill: D(80, 3, 'the 8th click at 80', 'the 8th click at 160', 'C'), neck: { kind: 'list', events: [
      ...g6([[2, 3, '2'], [3, 5, '1']], [2, 5, '3'], [3, 4, '7'], [2, 6, '4']),
      ...g6([[2, 8, '5'], [4, 7, '6']], [1, 5, '6'], [4, 5, '5'], [1, 7, '7']),
      ...g6([[1, 8, '1'], [5, 8, '4']], [1, 10, '2'], [5, 7, '3'], [1, 12, '3']),
      [[1, 13, '4'], [6, 10, '2']], [], [], [], [], [],
    ] }, b: [
    'The top climbs in 8th-note triplets (D E F, G A B, C D E, then F) while the bass falls in straight 8ths (C B, A G, F E, then D). Three against two on every beat.',
    '- Count each beat as six: the triplets fall on 1, 3 and 5, the 8ths on 1 and 4',
    '- The neck uses that six-step grid: the click is the bass’s 8th note, the triplet notes land between',
    '- Say “nice cup of tea” across each beat if counting six is too fast: the 3:2 rhythm exactly',
    '<b>Harder</b>: swap them, triplets in the bass and 8ths on top. From the Guitar Luminary handout “The 2-Voice Rhythm Test - C Major”.',
  ] },

  { t: 'Debussy’s polyrhythm: why', s: '3 against 2 in one hand', b: [
    'Debussy liked to set a triplet line against straight 8ths (the first Arabesque is the famous case). On guitar both lines come from one right hand, which makes it a real independence test.',
    '- Thumb and i in 8ths below, m and a in triplets above; they meet only on the beat',
    '- Count six per beat: 8ths on 1 and 4, triplets on 1, 3 and 5',
    '- The notes come from a major pentatonic (with the 7th added in F), so all attention goes to rhythm',
    '- No open strings and no drop D, so the shapes move to any key',
    'The handouts also apply the figure to a ii–V–I and to a Barney Kessel–style chord-melody of a standard. From the Guitar Luminary handouts “Debussy’s Polyrhythm for Guitar” and “Polyrhythm”.',
  ] },

  { t: 'Gm7 as B♭6 diminished', s: 'the chord shapes behind the figure',
    drill: D(50, 1, 'a chord a beat at 50', 'at 100, smooth', 'Bb'), neck: { kind: 'list', events: [
      [[6, 2, 'b6'], [4, 1, '4'], [3, 2, '7'], [2, 1, '2']], [[6, 3, '6'], [4, 3, '5'], [3, 3, '1'], [2, 3, '3']],
      [[6, 5, '7'], [4, 4, 'b6'], [3, 5, '2'], [2, 4, '4']], [[6, 6, '1'], [4, 5, '6'], [3, 7, '3'], [2, 6, '5']],
      [[5, 6, '4'], [4, 7, '7'], [3, 5, '2'], [2, 7, 'b6']], [[5, 8, '5'], [4, 8, '1'], [3, 7, '3'], [2, 8, '6']],
      [[5, 9, 'b6'], [4, 10, '2'], [3, 8, '4'], [2, 10, '7']], [[5, 10, '6'], [4, 12, '3'], [3, 10, '5'], [2, 11, '1']],
    ] }, b: [
    'Barry Harris hears Gm7 as B♭6 (the same notes, G B♭ D F) and puts a diminished 7th between its inversions: the B♭6-diminished scale (B♭ C D E♭ F F♯ G A) as chords. The handout climbs it in drop-3 shapes on strings 6-4-3-2, then drop 2 on strings 5–2. Labels are B♭ degrees.',
    '- °7 – Gm7 – °7 – B♭6 at frets 1–7, then °7 – B♭6/F – °7 – Gm7 at frets 5–12',
    '- Each diminished chord resolves up into the next 6th chord: two voices by a half step, two by a whole step',
    '- The diminished chords get no root name: any of their four notes can be the root',
    '- Use the handout’s fingerings: a finger often stays on its string into the next chord',
    'The C7 grips in the examples (C7 at fret 8, Em7♭5 as a rootless C9, open C7 and C7♭9) come from the same page. From the Guitar Luminary handout “Debussy’s Polyrhythm for Guitar”.',
  ], ex: [
    ['C7 at fret 8, Em7♭5 (C9 without its root)', '=C3 Bb3 E4 G4 | E3 Bb3 D4 G4'],
    ['Open C7, then C7♭9', '=C3 E3 Bb3 C4 | C3 E3 Bb3 Db4'],
  ] },

  { t: 'Debussy’s figure in C', s: 'pentatonic triplets over 8ths',
    drill: D(90, 3, 'the 8th click at 90', 'the 8th click at 160', 'C'), neck: { kind: 'list', events: [
      [5, 3, '1'], [], [], [4, 5, '5'], [], [],
      ...g6([[1, 8, '1'], [4, 10, '1']], [1, 10, '2'], [3, 9, '3'], [2, 10, '6']),
      ...g6([[1, 8, '1'], [2, 8, '5']], [2, 8, '5'], [3, 9, '3'], [2, 10, '6']),
      ...g6([[2, 5, '3'], [3, 5, '1']], [2, 8, '5'], [4, 5, '5'], [3, 7, '2']),
      ...g6([[5, 3, '1'], [2, 5, '3']], [3, 5, '1'], [4, 7, '6'], [2, 5, '3']),
      [[3, 5, '1'], [4, 9, '7']], [], [], [2, 5, '3'], [], [],
      [1, 5, '6'], [], [], [2, 5, '3'], [], [],
      [[3, 5, '1'], [4, 7, '6']], [], [], [4, 7, '6'], [], [],
    ] }, b: [
    'Two bars in C on the C major pentatonic (C D E G A): the lower voice in straight 8ths, the upper in triplets from beat 2.',
    '- Bar 1: the bass alone on beat 1 (C, G), then triplets C D A, C G A, E G D over 8ths C E, G E, C G',
    '- Bar 2 relaxes: triplets over A minor, a held B rubbing against C, then plain 8ths',
    '- The neck uses a six-step grid per beat: the click is the lower voice’s 8th, the triplet notes land on steps 1, 3 and 5',
    '- Practise one beat alone, then two, then the bar',
    '<b>Harder</b>: the same in F (from fret 1, or the handout’s seventh-position option), and with the 8th-fret barre that lets the low C ring. From the Guitar Luminary handout “Debussy’s Polyrhythm for Guitar”.',
  ] },

  { t: 'Debussy’s ii–V–I in F', s: 'Barry Harris moves, then the figure',
    drill: D(60, 2, '8ths at 60', '8ths at 120', 'F'), neck: { kind: 'list', events: [
      [[2, 6, '1'], [3, 7, '6']], [[2, 7, 'b2'], [4, 10, '5']], [[2, 8, '2'], [4, 8, '4']], [[2, 10, '3'], [4, 7, '3']],
      [[5, 10, '2'], [4, 12, '6'], [3, 10, '1'], [2, 11, '4']], [[5, 9, 'b2'], [4, 11, 'b6'], [3, 9, '7'], [2, 10, '3']],
      [[5, 10, '2'], [4, 12, '6'], [3, 10, '1'], [2, 11, '4']], [1, 10, '6'],
      [[5, 7, '7'], [4, 8, '4'], [3, 7, '6'], [2, 8, '2']], [], [], [],
      [[5, 3, '5'], [4, 2, '7'], [3, 3, '4'], [2, 2, 'b6']], [], [], [],
    ] }, b: [
    'The handout puts the figure at the end of a ii–V–I in F and dresses the ii and the V with Barry Harris moves. The neck plays the first two bars in 8ths; labels are F major degrees.',
    '- Gm7 as B♭6: two voices in contrary motion through the B♭6-diminished scale (F G♭ G A on top, D C B♭ A below)',
    '- Gm7 – G♭m7 – Gm7: a lower chromatic neighbour chord, every voice down a half step and back',
    '- Em7♭5 (C9 without its root) then C7♭9: the V in two colours',
    '- Then Fmaj7 with the polyrhythm on F major pentatonic plus E, the major 7th',
    'From the Guitar Luminary handouts “Debussy’s Polyrhythm for Guitar” and “Polyrhythm”.',
  ] },

  { t: 'Harmonic minor: rows of four', s: '4-note runs as triplets over a pedal',
    drill: D(80, 3, 'the 8th click at 80', 'the 8th click at 150', 'A'), neck: { kind: 'list', events: [
      ...g6([[3, 4, '2'], [4, 7, '1']], [3, 5, 'b3'], [4, 7, '1'], [3, 7, '4']),
      ...g6([[2, 5, '5'], [4, 7, '1']], [3, 5, 'b3'], [4, 7, '1'], [3, 7, '4']),
      ...g6([[2, 5, '5'], [4, 7, '1']], [2, 6, 'b6'], [4, 7, '1'], [3, 7, '4']),
      ...g6([[2, 5, '5'], [4, 7, '1']], [2, 6, 'b6'], [4, 7, '1'], [1, 4, '7']),
      ...g6([[4, 6, '7'], [5, 8, 'b6']], [4, 7, '1'], [5, 8, 'b6'], [3, 4, '2']),
      ...g6([[3, 5, 'b3'], [5, 8, 'b6']], [4, 7, '1'], [5, 8, 'b6'], [3, 4, '2']),
      ...g6([[3, 5, 'b3'], [5, 8, 'b6']], [3, 7, '4'], [5, 8, 'b6'], [3, 4, '2']),
      ...g6([[3, 5, 'b3'], [5, 8, 'b6']], [3, 7, '4'], [5, 8, 'b6'], [2, 5, '5']),
      ...g6([[4, 6, '7'], [5, 7, '5']], [4, 7, '1'], [5, 7, '5'], [3, 4, '2']),
      ...g6([[3, 5, 'b3'], [5, 7, '5']], [4, 7, '1'], [5, 7, '5'], [3, 4, '2']),
      ...g6([[3, 5, 'b3'], [5, 7, '5']], [3, 7, '4'], [5, 7, '5'], [3, 4, '2']),
      ...g6([[3, 5, 'b3'], [5, 7, '5']], [3, 7, '4'], [5, 7, '5'], [2, 5, '5']),
    ] }, b: [
    'A harmonic minor (A B C D E F G♯) in “rows of four”: four-note runs, each starting a step higher (B C D E, C D E F, D E F G♯), played as 8th-note triplets. Fours grouped in threes cross the beat, and a pedal in straight 8ths below makes it 3 against 2.',
    '- The pedal steps down A – G♯ – F – E, a bar each (i, V, VI, V); the neck plays the A, F and E bars',
    '- Six-step grid again: the click is the pedal’s 8th, the triplet notes land on steps 1, 3 and 5',
    '- Accent the first note of each row lightly so the 4-against-3 is audible',
    '- Each row starts on a different degree, a taste of each mode of the scale',
    '<b>Harder</b>: the rows descending, and over a D pedal. From the Guitar Luminary handout “Harmonic Minor 3:2 Polyrhythm”.',
  ] },

  { t: 'Harmonic minor: contrary 3:2', s: 'triplets up, 8ths down',
    drill: D(80, 3, 'the 8th click at 80', 'the 8th click at 150', 'A'), neck: { kind: 'list', events: [
      ...g6([[2, 0, '2'], [3, 2, '1']], [2, 1, 'b3'], [3, 1, '7'], [2, 3, '4']),
      ...g6([[2, 5, '5'], [4, 3, 'b6']], [2, 6, 'b6'], [4, 2, '5'], [1, 4, '7']),
      ...g6([[1, 5, '1'], [5, 5, '4']], [1, 7, '2'], [6, 8, 'b3'], [1, 8, 'b3']),
      [[1, 10, '4'], [2, 10, '1'], [3, 10, 'b6'], [6, 7, '2']], [], [], [], [], [],
    ] }, b: [
    'Two lines of A harmonic minor moving apart: the upper climbs in triplets from B, the lower falls in 8ths from A (A G♯ F E D C), and both land on Bø7 (iiø) over B.',
    '- Nine notes on top against six below across three beats: 3 against 2 the whole way',
    '- Triplets on the top strings, the thumb walking down strings 3 to 6',
    '- Watch the two G♯s: the lower voice’s on beat 1, the upper voice’s on beat 2',
    '- In the handout the line goes on in 16ths and resolves to E',
    'From the Guitar Luminary handout “Harmonic Minor 3:2 Polyrhythm”.',
  ] },

  { t: 'Melody focus: what it’s for', s: 'harmonise a tune with Barry’s scales', b: [
    'The handout takes an eight-bar melody over Dm7 – G7 – C6 – F6 – Bm7♭5 – E7 – Am6 (ii–V–I–IV in C, then iiø–V–i in A minor) and plays it three ways: over plain chords, in thirds, and against a second line in contrary motion.',
    '- Each chord gets its own Barry Harris scale: C6-dim, F6-dim, Dm6-dim, Am6-dim, and the dominant-diminished scale for G7 and E7',
    '- The thirds come from that scale, so they always sound like the chord, with chromatic passing notes built in',
    '- Learn the chord grips first (the example), then the scales in thirds (the next three cards)',
    'From the Guitar Luminary handout “Melody Focus”.',
  ], ex: [
    ['The chords as the handout voices them', '=D3 C4 F4 | G2 F3 B3 | C3 A3 E4 | F3 A3 D4 | B3 F4 A4 D5 | E3 G#3 D4 E4 | A3 E4 F#4 C5'],
  ] },

  { t: 'Barry’s 6th-dim scales in 3rds', s: 'C6 and F6, major',
    drill: D(60, 2, '8ths at 60', '8ths at 140', 'C'), neck: { kind: 'list', events: [
      [[5, 3, '1'], [4, 2, '3']], [[5, 5, '2'], [4, 3, '4']], [[5, 7, '3'], [4, 5, '5']], [[4, 3, '4'], [3, 1, 'b6']],
      [[4, 5, '5'], [3, 2, '6']], [[4, 6, 'b6'], [3, 4, '7']], [[4, 7, '6'], [3, 5, '1']], [[3, 4, '7'], [2, 3, '2']],
      [[3, 4, '7'], [2, 3, '2']], [[4, 7, '6'], [3, 5, '1']], [[4, 6, 'b6'], [3, 4, '7']], [[4, 5, '5'], [3, 2, '6']],
      [[4, 3, '4'], [3, 1, 'b6']], [[5, 7, '3'], [4, 5, '5']], [[5, 5, '2'], [4, 3, '4']], [[5, 3, '1'], [4, 2, '3']],
    ] }, b: [
    'C6-diminished is C major with a G♯/A♭ added: C D E F G A♭ A B. Its 6th chord (C E G A) alternates with a diminished 7th (D F A♭ B). In 3rds, each note pairs with the note two steps up the eight-note scale.',
    '- C/E, D/F, E/G, F/A♭, G/A, A♭/B, A/C, B/D: two pairs aren’t thirds at all (G–A a 2nd, A♭–B an augmented 2nd). That’s the scale, and it sounds right',
    '- The neck goes up and back on strings 5-4-3, as in the handout',
    '- F6-dim is the same in F: F G A B♭ C D♭ D E (example)',
    '<b>Harder</b>: the same in 6ths (invert each pair). From the Guitar Luminary handout “Melody Focus”.',
  ], ex: [
    ['F6-diminished in 3rds', '=F3 A3 | G3 Bb3 | A3 C4 | Bb3 Db4 | C4 D4 | Db4 E4 | D4 F4 | E4 G4'],
  ] },

  { t: 'Barry’s dominant-dim in 3rds', s: 'G7 and E7',
    drill: D(60, 2, '8ths at 60', '8ths at 140', 'G'), neck: { kind: 'list', events: [
      [[6, 3, '1'], [5, 2, '3']], [[6, 5, '2'], [5, 3, '4']], [[6, 7, '3'], [5, 5, '5']], [[5, 3, '4'], [4, 1, 'b6']],
      [[5, 5, '5'], [4, 3, 'b7']], [[5, 6, 'b6'], [4, 4, '7']], [[5, 8, 'b7'], [4, 5, '1']], [[4, 4, '7'], [3, 2, '2']],
      [[4, 4, '7'], [3, 2, '2']], [[5, 8, 'b7'], [4, 5, '1']], [[5, 6, 'b6'], [4, 4, '7']], [[5, 5, '5'], [4, 3, 'b7']],
      [[5, 3, '4'], [4, 1, 'b6']], [[6, 7, '3'], [5, 5, '5']], [[6, 5, '2'], [5, 3, '4']], [[6, 3, '1'], [5, 2, '3']],
    ] }, b: [
    'Barry’s scale for a dominant: the chord’s own notes (G B D F) with a diminished 7th between them (A C E♭ F♯): G A B C D E♭ F F♯. In 3rds it gives G/B, A/C, B/D, C/E♭, D/F, E♭/F♯, F/G, F♯/A.',
    '- E♭ is the ♭13 and F♯ the major 7th as a passing note: both sound right because they sit between chord tones',
    '- The neck goes up and back on strings 6-5-4, the handout’s position',
    '- E7 the same way: E F♯ G♯ A B C D D♯ (example)',
    '<b>Harder</b>: play the thirds against a G7 or E7 drone and stop on chord-tone pairs only. From the Guitar Luminary handout “Melody Focus”.',
  ], ex: [
    ['E7-diminished in 3rds', '=E3 G#3 | F#3 A3 | G#3 B3 | A3 C4 | B3 D4 | C4 D#4 | D4 E4 | D#4 F#4'],
  ] },

  { t: 'Barry’s minor 6th-dim in 3rds', s: 'Am6 and Dm6',
    drill: D(60, 2, '8ths at 60', '8ths at 140', 'A'), neck: { kind: 'list', events: [
      [[4, 7, '1'], [3, 5, 'b3']], [[4, 9, '2'], [3, 7, '4']], [[3, 5, 'b3'], [2, 5, '5']], [[3, 7, '4'], [2, 6, 'b6']],
      [[3, 9, '5'], [2, 7, '6']], [[2, 6, 'b6'], [1, 4, '7']], [[2, 7, '6'], [1, 5, '1']], [[2, 9, '7'], [1, 7, '2']],
      [[2, 9, '7'], [1, 7, '2']], [[2, 7, '6'], [1, 5, '1']], [[2, 6, 'b6'], [1, 4, '7']], [[3, 9, '5'], [2, 7, '6']],
      [[3, 7, '4'], [2, 6, 'b6']], [[3, 5, 'b3'], [2, 5, '5']], [[4, 9, '2'], [3, 7, '4']], [[4, 7, '1'], [3, 5, 'b3']],
    ] }, b: [
    'A minor 6th-diminished: Am6 (A C E F♯) with the diminished 7th between (B D F G♯): A B C D E F F♯ G♯. In 3rds: A/C, B/D, C/E, D/F, E/F♯, F/G♯, F♯/A, G♯/B.',
    '- It is melodic minor with an F added: the F is the passing note that makes the 6th chord and diminished chord alternate',
    '- Seventh position on strings 4 down to 1, as in the handout',
    '- D minor 6th-dim: D E F G A B♭ B C♯ (example)',
    '<b>Harder</b>: 4-note chords from the scale (Am6 and its diminished partner) instead of 3rds. From the Guitar Luminary handout “Melody Focus”.',
  ], ex: [
    ['D minor 6th-diminished in 3rds', '=D3 F3 | E3 G3 | F3 A3 | G3 Bb3 | A3 B3 | Bb3 C#4 | B3 D4 | C#4 E4'],
  ] },

  { t: 'Melody in 3rds, then contrary', s: 'the handout’s two arrangements', b: [
    'With the scales in your hands, the handout harmonises its melody twice. In thirds: every melody note gets the note two steps below it in the current chord’s scale, so pickup notes become little chromatic pairs and the long notes land on full chord grips. In contrary motion: as the melody climbs, a second voice falls through the same scale.',
    '- Find the melody on the top two strings first, then add the third below on the next string down',
    '- Change scale exactly where the chord changes: C6-dim to F6-dim to G7-dim and so on',
    '- For contrary motion keep the lower line stepwise and let it pass through a chord tone on each beat',
    'Try it on any tune you know over these chords. The example is contrary motion in C6-dim from a unison. From the Guitar Luminary handout “Melody Focus”.',
  ], ex: [
    ['Contrary motion in C6-diminished, out from C', '=B3 D4 | A3 E4 | Ab3 F4 | G3 G4'],
  ] },
] },

// =====================================================================
{ id: 'lum-tunes', name: 'Luminary: tunes', cards: [

  { t: 'Arranging tunes: five methods', s: 'what the tune handouts show', b: [
    'Five tune handouts, five ways of putting a song on the guitar. For the copyrighted songs this deck gives only the chords and the method; Danny Boy, a traditional air, is written out.',
    '- Danny Boy: melody on top, an inner voice, and a bass a tenth below the melody: a three-voice chord melody that changes on every beat',
    '- All of Me: the chart alone, a chain of dominants to own before you arrange it',
    '- When You Wish Upon a Star: chord melody with diminished passing chords and altered dominants',
    '- Blue Monk: the chromatic line doubled a tenth below, with three-note shells',
    '- Plug In Baby: two-voice counterpoint from Barry Harris’s F6-diminished scale over A7',
    'From the Guitar Luminary handouts “Danny Boy”, “All Of Me”, “When You Wish Upon a Star”, “Blue Monk” and “Plug In Baby - Counterpoint Arrangement”.',
  ] },

  { t: 'Danny Boy: the first phrase', s: 'three voices, melody on top',
    drill: D(60, 1, 'quarters at 60', 'quarters at 90, melody singing', 'D'), neck: { kind: 'list', events: [
      [], [[3, 6, '7'], [4, 5, '4']], [[6, 7, '6'], [4, 5, '4'], [3, 7, '1']], [[6, 9, '7'], [4, 7, '5'], [3, 9, '2']],
      [[6, 10, '1'], [4, 9, '6'], [3, 11, '3']], [], [], [[6, 9, '7'], [4, 7, '5'], [3, 9, '2']],
      [[6, 10, '1'], [4, 9, '6'], [3, 11, '3']], [[5, 10, '4'], [3, 9, '2'], [2, 12, '6']], [[5, 9, '3'], [3, 7, '1'], [2, 10, '5']], [[5, 5, '1'], [3, 4, '6'], [2, 7, '3']],
      [[6, 9, '7'], [4, 7, '5'], [3, 9, '2']], [[6, 7, '6'], [4, 5, '4'], [3, 7, '1']], [[6, 3, '4'], [4, 2, '2'], [3, 4, '6']], [],
    ] }, b: [
    'The arrangement, in D, sets the traditional melody on top of three-note chords, a new chord for each melody note: the tune, an inner voice, and a bass a tenth below the tune. Labels are D major degrees.',
    '- Pickup: A7 as just C♯ and G, then G/B and A/C♯, the bass climbing B – C♯ – D',
    '- Bar 2: Bm/D under the long F♯, then A/C♯',
    '- Bar 3: Bm/D – Em/G – D/F♯ – Bm/D; bar 4: A/C♯ – G/B – Em/G',
    '- Make the melody louder than the rest: rest-stroke with a, or simply more weight on that finger',
    '<b>Harder</b>: the rest of the tune in the same texture, including the high climax at frets 10–14. From the Guitar Luminary handout “Danny Boy”.',
  ] },

  { t: 'All of Me: the changes', s: 'a chain of dominants',
    drill: D(60, 1, 'a chord every 2 beats at 60', 'at 120, with swing', 'C'), neck: { kind: 'list', events: [
      [[5, 3, 'R'], [3, 2, '6'], [2, 5, '3']], [],
      [[6, 0, 'R'], [4, 0, 'b7'], [3, 1, '3']], [],
      [[6, 5, 'R'], [4, 5, 'b7'], [3, 6, '3']], [],
      [[5, 5, 'R'], [3, 5, 'b7'], [2, 6, 'b3']], [],
      [[6, 3, 'R'], [4, 3, 'b7'], [3, 4, '3']], [],
      [[5, 3, 'R'], [3, 2, '6'], [2, 5, '3']], [],
    ] }, b: [
    'The handout is the chart in C, two 16-bar halves. Before arranging it, own the chain of secondary dominants: E7 (V of Am), A7 (V of Dm), D7 (V of G), mostly two bars each.',
    '- First half: C6 – E7 – A7 – Dm7 – E7 – Am7 – D7 – Dm7 G7(13)',
    '- Second half starts the same, then Fmaj7 – Fm7 (the minor iv) – C6 – A7 – Dm7 – G7(13) – C6/9 – Cmaj9',
    '- The neck plays shells (root, 7th, 3rd; root, 6th, 3rd for C6) for C6 – E7 – A7 – Dm7 – G7 – C6. Labels are chord degrees',
    '- Guide tones fall by half steps: C6’s A, E7’s G♯, A7’s G, Dm7’s F',
    'Then build the melody on top of these grips. From the Guitar Luminary handout “All Of Me”.',
  ], ex: [
    ['Bars 1–16', 'C:6 E:7 A:7 D:m7 E:7 A:m7 D:7 D:m7 G:13'],
    ['Bars 17–32', 'C:6 E:7 A:7 D:m7 F:maj7 F:m7 C:6 A:7 D:m7 G:13 C:6/9 C:maj9'],
  ] },

  { t: 'When You Wish: the opening', s: 'chord melody with passing chords', b: [
    'The handout is a chord-melody arrangement in C with the melody on top of every chord. The harmony of the first phrase, read from its voicings:',
    '- Cmaj7 – A7(♭9 ♭13) with C♯ in the bass – Dm – G7 – D♯°7 – C6/E',
    '- The bass climbs C – C♯ – D, and later D♯ – E: chromatic lines under the tune',
    '- A7 has no root: 3rd in the bass, ♭9 and ♭13 above, which leads smoothly into Dm',
    '- D♯°7 is a passing chord between G7 and C/E: one diminished chord, one chromatic step in the bass',
    'The method: find each melody note on the top strings, hang the chord under it, and pick the inversion that keeps the bass moving by step. The arrangement shifts position a lot (III, VIII, X, V): practise the shifts on their own. From the Guitar Luminary handout “When You Wish Upon a Star”.',
  ], ex: [
    ['Bars 1–4 (the arrangement’s A7 also has the ♭13)', 'C:maj7 A:7b9/3 D:min G:7 D#:dim7 C:6/3'],
  ] },

  { t: 'Blue Monk: tenths and shells', s: 'chromatic lines, half-step approaches',
    drill: D(60, 1, 'quarters at 60', 'quarters at 120, swung', 'Bb'), neck: { kind: 'list', events: [
      [[6, 8, 'C'], [3, 8, 'E♭']], [[6, 9, 'C♯'], [3, 9, 'E']], [[6, 10, 'D'], [4, 8, 'B♭'], [3, 10, 'F']], [],
      [[6, 5, 'A'], [4, 5, 'G'], [3, 6, 'C♯']], [[6, 6, 'B♭'], [4, 6, 'A♭'], [3, 7, 'D']], [], [],
    ] }, b: [
    'Monk’s blues in B♭ moves by half steps, so the arrangement doubles the chromatic line a tenth below (bass on the 6th string, top on the 3rd, the same fret) and fills in the changes with three-note shells.',
    '- Minor tenths on strings 6 and 3 share a fret: slide the shape and both voices move a half step together',
    '- Shells are root, 7th and 3rd: B♭7 = B♭–A♭–D, E♭7 = E♭–D♭–G, F7 = F–E♭–A',
    '- At the cadence the arrangement reaches B♭7 from A7, the same shell a fret lower',
    '- Swing the 8ths and let held chords ring under the next notes',
    'The tune is copyrighted, so only the method is here: apply it to the melody yourself. From the Guitar Luminary handout “Blue Monk”.',
  ], ex: [
    ['Shells: B♭7, E♭7, F7', '=Bb2 Ab3 D4 | Eb3 Db4 G4 | F2 Eb3 A3'],
    ['Chromatic tenths into B♭/D', '=C3 Eb4 | C#3 E4 | D3 Bb3 F4'],
    ['Half-step approach: A7 to B♭7', '=A2 G3 C#4 | Bb2 Ab3 D4'],
  ] },

  { t: 'Plug In Baby: F6-dim over A7', s: 'the chords and the scale', b: [
    'The handout turns the Muse song into a short two-voice counterpoint study in D minor. Its chords: A7 – B♭maj7 – F – F°7 – B♭m6 – A7 – C♯°7 – Dm6.',
    '- The lines come from Barry Harris’s F major 6th-diminished scale: F G A B♭ C D♭ D E',
    '- Over A7 that is A Phrygian dominant (A B♭ C♯ D E F G) plus C: it holds A7’s A, C♯ (as D♭), E and G, with B♭ (♭9), F (♭13) and C (a ♯9 colour)',
    '- So one F6-dim fingering covers the F chord and A7, the V of D minor',
    '- C♯°7 near the end is A7♭9 without its root, resolving to Dm6',
    'From the Guitar Luminary handout “Plug In Baby - Counterpoint Arrangement”.',
  ], ex: [
    ['The changes', 'A:7 Bb:maj7 F:maj F:dim7 Bb:m6 A:7 C#:dim7 D:m6'],
    ['F6-diminished', '=F3 | G3 | A3 | Bb3 | C4 | Db4 | D4 | E4 | F4'],
    ['A Phrygian dominant', '=A2 | Bb2 | C#3 | D3 | E3 | F3 | G3 | A3'],
  ] },

  { t: 'Plug In Baby: contrary motion', s: 'F6-dim, apart and back',
    drill: D(60, 2, '8ths at 60', '8ths at 130', 'A'), neck: { kind: 'list', events: [
      [[2, 1, 'C'], [3, 2, 'A']], [[2, 2, 'D♭'], [4, 5, 'G']], [[2, 3, 'D'], [4, 3, 'F']], [[2, 5, 'E'], [4, 2, 'E']],
      [[2, 6, 'F'], [5, 5, 'D']], [[1, 3, 'G'], [5, 4, 'D♭']], [[1, 5, 'A'], [5, 3, 'C']], [[1, 6, 'B♭'], [6, 6, 'B♭']],
      [[1, 8, 'C'], [6, 5, 'A']], [[1, 6, 'B♭'], [6, 6, 'B♭']], [[1, 5, 'A'], [5, 3, 'C']], [[1, 3, 'G'], [5, 4, 'D♭']],
      [[2, 6, 'F'], [5, 5, 'D']], [[2, 5, 'E'], [4, 2, 'E']], [[2, 3, 'D'], [4, 3, 'F']], [[2, 2, 'D♭'], [4, 5, 'G']],
      [[2, 1, 'C'], [3, 2, 'A']], [],
    ] }, b: [
    'The heart of the study: start on A and C (the 3rd and 5th of F) and move the two voices apart through F6-diminished, then back together. Over an A bass it is all A7 sound, pulling to D minor.',
    '- Upper voice from C: C D♭ D E F G A B♭ C. Lower voice from A: A G F E D D♭ C B♭ A',
    '- They pass through E (an octave apart) and B♭ (two octaves): the scale’s symmetry',
    '- Fingerstyle, p on the lower line and m on the upper, or pick plus a finger',
    '- Then reverse it, closing back to A and C',
    '<b>Harder</b>: the handout’s second fingering in fifth to tenth position. From the Guitar Luminary handout “Plug In Baby - Counterpoint Arrangement”.',
  ] },
] },
];

