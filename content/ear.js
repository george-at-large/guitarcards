// Guitar Cards — ear-training curriculum (mode: "ear").
// Plain object literals only. See docs/SCHEMA.md §8.3 and research/ear.md.
//
// Conventions used in this file (see research/ear.md, "Engine requests"):
// - Melody / degree tokens are intervals from the tonic measured against the MAJOR scale
//   (so Aeolian's 3rd is written b3, its 6th b6), the same convention as roman numerals in charts.
//   `scale` sets the key context (cadence/drone) only.
// - In melodies `-_` = hold half a beat more (dotted rhythms) and `._` = half-beat rest.
// - Each `listen` melody states its beat unit in the explain text when the beat is an 8th note.

export const templates = [

  // =====================================================================================
  // EAR-INTERVALS — quizzes. Ladder: melodic ascending → descending → harmonic → mixed → compound.
  // Small, contrasting sets first; then neighbours that are easily confused; then everything.
  // =====================================================================================

  {
    id: "ear-int-up-3-5",
    mode: "ear", category: "ear-intervals",
    tags: ["intervals", "ascending", "beginner"],
    title: "Ascending: major 3rd or perfect 5th?",
    level: 1, length: "short", minutes: 1,
    params: { root: "any" },
    prompt: "Two notes, low then high. Is the leap a **major 3rd** or a **perfect 5th**?",
    hints: [
      "Sing the first note, then climb the major scale until you hit the second: 3 steps (do-re-mi) or 5 (do-re-mi-fa-sol)?",
      "The 3rd sounds sweet and close; the 5th sounds open and hollow, like a power chord.",
      "Song anchors: When the Saints starts 1 → 3; Twinkle Twinkle leaps 1 → 5 on the second 'twinkle'."
    ],
    explain: "### What to listen for\nThe **major 3rd** is the first 'colour' interval: it sounds bright and full. The **perfect 5th** is the most stable interval after the octave, open and a bit empty; it is the sound of a power chord.\n\n- Hum the low note; if the top note feels like the *middle* of a major chord, it's a 3rd. If it feels like the *top* of a power chord, it's a 5th.\n- Two very different sizes go first because they build the habit of hearing *distance*, not single pitches.",
    visual: { type: "text", body: "| Interval | Semitones | Frets on one string | Up: anchor |\n|---|---|---|---|\n| M3 | 4 | 4 | When the Saints (1 → 3) |\n| P5 | 7 | 7 | Twinkle Twinkle (2nd → 3rd note) |" },
    concepts: ["ear-interval-songs", "ear-harmonic-vs-melodic"],
    quiz: { kind: "ear-interval", intervals: ["3", "5"], direction: "up" },
    vary: ["root"]
  },

  {
    id: "ear-int-up-b3-3",
    mode: "ear", category: "ear-intervals",
    tags: ["intervals", "ascending", "thirds", "major-minor"],
    title: "Ascending: minor 3rd or major 3rd?",
    level: 1, length: "short", minutes: 1,
    params: { root: "any" },
    prompt: "Low note, then high note. **Minor 3rd** or **major 3rd**?",
    hints: [
      "Minor 3rd = 3 frets, major 3rd = 4 frets. Which one sounds darker?",
      "Minor 3rd: the first leap of Greensleeves. Major 3rd: the first leap of When the Saints.",
      "Imagine the two notes as the bottom of a chord: sad (minor) or happy (major)?"
    ],
    explain: "### What to listen for\nThese two intervals are the core of major vs minor. The **major 3rd** is bright and settled; the **minor 3rd** is darker and slightly 'leaning'. One semitone apart, but the colour is very different.\n\nLearn it melodically first. Once you can hear it here, chord quality (major vs minor triad) gets much easier, because a triad's quality *is* its bottom 3rd.",
    concepts: ["ear-interval-songs", "ear-chord-qualities"],
    quiz: { kind: "ear-interval", intervals: ["b3", "3"], direction: "up" },
    vary: ["root"]
  },

  {
    id: "ear-int-up-2-3-4-5",
    mode: "ear", category: "ear-intervals",
    tags: ["intervals", "ascending"],
    title: "Ascending: 2nd, 3rd, 4th or 5th",
    level: 2, length: "short", minutes: 1,
    params: { root: "any" },
    prompt: "Name the ascending interval: **M2, M3, P4 or P5**.",
    hints: [
      "M2 = Frère Jacques (1 → 2). M3 = When the Saints. P4 = Here Comes the Bride / Amazing Grace. P5 = Twinkle's leap.",
      "The 4th wants to fall back down a step to the 3rd; the 5th feels finished.",
      "If unsure, sing up the major scale from the low note and count."
    ],
    explain: "### What to listen for\nThese are the first four notes of the major scale measured from the root, the intervals you meet in every melody.\n\n- **M2**: a step, it just *moves*.\n- **M3**: bright, chordal.\n- **P4**: the 'bugle call' or 'here comes…' leap, open but restless.\n- **P5**: open and stable.\n\nTell **4 vs 5** apart by tension: the 4th leans, the 5th rests.",
    concepts: ["ear-interval-songs"],
    quiz: { kind: "ear-interval", intervals: ["2", "3", "4", "5"], direction: "up" },
    vary: ["root"]
  },

  {
    id: "ear-int-up-steps-thirds",
    mode: "ear", category: "ear-intervals",
    tags: ["intervals", "ascending", "seconds", "thirds"],
    title: "Ascending: small intervals (m2, M2, m3, M3)",
    level: 3, length: "short", minutes: 1,
    params: { root: "any" },
    prompt: "Small leap up: **m2, M2, m3 or M3**?",
    hints: [
      "m2 is the tightest rub (Jaws, first two notes). M2 is a plain step.",
      "m3 vs M3: dark vs bright. Greensleeves vs When the Saints.",
      "Count frets in your head: 1, 2, 3, 4."
    ],
    explain: "### What to listen for\nThe four smallest intervals are what melodies are mostly made of. Steps (**m2/M2**) sound like *motion*; thirds (**m3/M3**) sound like *skips* that outline chords.\n\nThe m2 is the most tense of the four: two notes almost the same pitch. The M2 is neutral. Compare the 3rds by colour, not size.",
    concepts: ["ear-interval-songs"],
    quiz: { kind: "ear-interval", intervals: ["b2", "2", "b3", "3"], direction: "up" },
    vary: ["root"]
  },

  {
    id: "ear-int-up-4-tt-5",
    mode: "ear", category: "ear-intervals",
    tags: ["intervals", "ascending", "tritone"],
    title: "Ascending: P4, tritone or P5?",
    level: 3, length: "short", minutes: 1,
    params: { root: "any" },
    prompt: "**P4, tritone (#4/b5) or P5**? Three neighbours, one semitone apart.",
    hints: [
      "The tritone is the 'unresolved' one: it wants to slip up a half step to the 5th.",
      "Tritone anchor: Maria (West Side Story), first two notes.",
      "P4 leans down, P5 rests, tritone hangs in the air."
    ],
    explain: "### What to listen for\nThe tritone sits exactly half-way through the octave. Unlike the 4th and 5th, it doesn't feel like a stable 'place'. It sounds suspended and unresolved: the devil's interval, the sound inside every dominant 7th (3 and b7).\n\nSing the top note and try to move it a half step up: if that sounds like arriving home on the 5th, you just heard a tritone.",
    concepts: ["ear-interval-songs"],
    quiz: { kind: "ear-interval", intervals: ["4", "#4", "5"], direction: "up" },
    vary: ["root"]
  },

  {
    id: "ear-int-up-6ths-7ths",
    mode: "ear", category: "ear-intervals",
    tags: ["intervals", "ascending", "sixths", "sevenths"],
    title: "Ascending: big leaps (m6, M6, m7, M7)",
    level: 4, length: "short", minutes: 1,
    params: { root: "any" },
    prompt: "Wide leap up: **m6, M6, m7 or M7**?",
    hints: [
      "Measure from the octave: M7 is an octave minus a half step; m7 is an octave minus a whole step.",
      "M6 anchor: My Bonnie / Dashing through the snow (5 → 3). m7: Star Trek theme, first two notes.",
      "m6 sounds like a minor-ish yearning; M6 sounds sweet and open."
    ],
    explain: "### What to listen for\nResearch on aural skills consistently finds the **6ths and 7ths** (with the tritone) are the hardest intervals. Two tricks help:\n\n- **Invert**: a 6th up is a 3rd down from the octave. m6 up ↔ M3 down from the octave; M6 up ↔ m3 down.\n- **Octave reference**: the 7ths sound like a note that *just missed* the octave. The M7 nearly gets there (tense, wants to go up); the m7 is a bluesy 'dominant' sound.",
    concepts: ["ear-interval-songs"],
    quiz: { kind: "ear-interval", intervals: ["b6", "6", "b7", "7"], direction: "up" },
    vary: ["root"]
  },

  {
    id: "ear-int-up-all",
    mode: "ear", category: "ear-intervals",
    tags: ["intervals", "ascending", "all"],
    title: "Ascending: any interval in the octave",
    level: 5, length: "short", minutes: 2,
    params: { root: "any" },
    prompt: "Any ascending interval from m2 to M7. Name it.",
    hints: [
      "First decide: small (2nds/3rds), middle (4/tritone/5) or large (6ths/7ths)?",
      "Then pick by colour: major/perfect intervals sound bright or open; minor ones darker.",
      "Use your song anchor only if you're stuck. The goal is to recognise the colour directly."
    ],
    explain: "### What to listen for\nSort in two passes: **size** first (small, middle, large), then **quality** (major/minor, or perfect/tritone). Two quick decisions are faster and more accurate than choosing from eleven at once.",
    concepts: ["ear-interval-songs"],
    quiz: { kind: "ear-interval", intervals: ["b2", "2", "b3", "3", "4", "#4", "5", "b6", "6", "b7", "7"], direction: "up" },
    vary: ["root"]
  },

  {
    id: "ear-int-down-3-5",
    mode: "ear", category: "ear-intervals",
    tags: ["intervals", "descending"],
    title: "Descending: 3rds and 5th",
    level: 2, length: "short", minutes: 1,
    params: { root: "any" },
    prompt: "High note, then low note. **m3, M3 or P5** down?",
    hints: [
      "m3 down: Star-Spangled Banner (5 → 3) and the first two notes of Hey Jude.",
      "M3 down: Swing Low (3 → 1); Beethoven's 5th (5 → b3).",
      "P5 down: the Flintstones theme, first two notes."
    ],
    explain: "### What to listen for\nDescending intervals are measurably harder than ascending ones, so they come after the ascending basics. Hold the **lower** note as the reference: try to hear it as the *root* and ask what the top note was above it.\n\nA descending M3 sounds like the top of a major triad falling to its root; a descending m3 like 5 falling to 3 in a major chord.",
    concepts: ["ear-interval-songs", "ear-harmonic-vs-melodic"],
    quiz: { kind: "ear-interval", intervals: ["b3", "3", "5"], direction: "down" },
    vary: ["root"]
  },

  {
    id: "ear-int-down-small",
    mode: "ear", category: "ear-intervals",
    tags: ["intervals", "descending", "seconds", "thirds"],
    title: "Descending: m2, M2, m3, M3",
    level: 3, length: "short", minutes: 1,
    params: { root: "any" },
    prompt: "Falling small interval: **m2, M2, m3 or M3**?",
    hints: [
      "m2 down: Joy to the World (1' → 7), Für Elise (5 → #4).",
      "M2 down: Mary Had a Little Lamb (3 → 2), the first two notes of Yesterday.",
      "Thirds down: Star-Spangled Banner (m3) vs Swing Low (M3)."
    ],
    explain: "### What to listen for\nFalling steps are the 'resolution' sounds of melody: 4 → 3, 1' → 7, 2 → 1. A falling **m2** feels like a sigh; a falling **M2** feels like ordinary walking.",
    concepts: ["ear-interval-songs"],
    quiz: { kind: "ear-interval", intervals: ["b2", "2", "b3", "3"], direction: "down" },
    vary: ["root"]
  },

  {
    id: "ear-int-down-middle-large",
    mode: "ear", category: "ear-intervals",
    tags: ["intervals", "descending", "tritone", "sixths", "sevenths"],
    title: "Descending: 4th through 7th",
    level: 4, length: "short", minutes: 1,
    params: { root: "any" },
    prompt: "Big drop: **P4, tritone, P5, m6, M6, m7 or M7**?",
    hints: [
      "P4 down: Eine kleine Nachtmusik (1 → 5,).",
      "For 6ths and 7ths, think of the inversion: a M6 down lands where a m3 up would from the octave below.",
      "Tritone down sounds just as unstable as tritone up."
    ],
    explain: "### What to listen for\nFor large descending intervals, sing the low note and **go up an octave** in your head. Then compare: a M7 down is the octave minus a half step; a m6 down is the octave minus a M3. Turning big intervals into small ones is a reliable fallback.",
    concepts: ["ear-interval-songs"],
    quiz: { kind: "ear-interval", intervals: ["4", "#4", "5", "b6", "6", "b7", "7"], direction: "down" },
    vary: ["root"]
  },

  {
    id: "ear-int-harm-3rds-5th",
    mode: "ear", category: "ear-intervals",
    tags: ["intervals", "harmonic", "dyads"],
    title: "Harmonic: m3, M3 or P5 (both notes together)",
    level: 2, length: "short", minutes: 1,
    params: { root: "any" },
    prompt: "Two notes struck **together**. **m3, M3 or P5**?",
    hints: [
      "Try to pick out the lower note and hum it, then the top.",
      "A P5 dyad is the power chord: fused, almost one sound.",
      "M3 = bright double-stop; m3 = darker."
    ],
    explain: "### What to listen for\nHarmonic intervals are heard as a single **colour** rather than as a distance. That is the skill you need for chords. Studies of college musicians find harmonic intervals harder than melodic ones, so here they come after the melodic basics, and with the most contrasting dyads first.\n\nIf the colour doesn't jump out, **arpeggiate it in your head**: imagine the bottom note, then the top, and use your melodic skill.",
    concepts: ["ear-harmonic-vs-melodic"],
    quiz: { kind: "ear-interval", intervals: ["b3", "3", "5"], direction: "harmonic" },
    vary: ["root"]
  },

  {
    id: "ear-int-harm-dissonances",
    mode: "ear", category: "ear-intervals",
    tags: ["intervals", "harmonic", "dissonance"],
    title: "Harmonic: the rubs (m2, M2, m7, M7)",
    level: 3, length: "short", minutes: 1,
    params: { root: "any" },
    prompt: "A dissonant dyad. **m2, M2, m7 or M7**?",
    hints: [
      "Seconds are close (beating, buzzing); sevenths are wide and spread out.",
      "M7 harmonic = the 'maj7 shimmer' between root and 7. m2 = the harshest crunch.",
      "m7 = the soft, bluesy dominant 7th colour."
    ],
    explain: "### What to listen for\nAs dyads, **m2 and M7** are both the harsh ones (they're inversions); **M2 and m7** are the mild ones. So decide **harsh vs mild** first, then **close vs wide**. Two yes/no questions instead of one four-way guess.",
    concepts: ["ear-harmonic-vs-melodic"],
    quiz: { kind: "ear-interval", intervals: ["b2", "2", "b7", "7"], direction: "harmonic" },
    vary: ["root"]
  },

  {
    id: "ear-int-harm-3rds-6ths",
    mode: "ear", category: "ear-intervals",
    tags: ["intervals", "harmonic", "thirds", "sixths"],
    title: "Harmonic: 3rds vs 6ths",
    level: 4, length: "short", minutes: 1,
    params: { root: "any" },
    prompt: "Sweet dyad: **m3, M3, m6 or M6**?",
    hints: [
      "3rds are close; 6ths are wide. These are the 'sweet' consonances.",
      "m6 sounds like the top of a major chord in 1st inversion (3 up to 1').",
      "M6 is the 'country double-stop' sound."
    ],
    explain: "### What to listen for\n3rds and 6ths are inversions of each other (m3 ↔ M6, M3 ↔ m6), so the colours are related. Guitarists know these as the double-stops of Motown, country and soul. Size first (close or wide), then colour.",
    concepts: ["ear-harmonic-vs-melodic"],
    quiz: { kind: "ear-interval", intervals: ["b3", "3", "b6", "6"], direction: "harmonic" },
    vary: ["root"]
  },

  {
    id: "ear-int-harm-all",
    mode: "ear", category: "ear-intervals",
    tags: ["intervals", "harmonic", "all"],
    title: "Harmonic: any interval in the octave",
    level: 5, length: "short", minutes: 2,
    params: { root: "any" },
    prompt: "Any dyad from m2 to M7. Name it.",
    hints: [
      "Sort: consonant (3rds, 6ths, 4/5), mild dissonance (M2, m7), harsh (m2, M7), or ambiguous (tritone)?",
      "Then size: close or wide.",
      "The tritone is the only one that sounds equally restless in both inversions."
    ],
    explain: "### What to listen for\nUse the consonance ladder: **perfect** (4, 5) → **sweet** (3rds, 6ths) → **mild** (M2, m7) → **harsh** (m2, M7) → **tritone**. Once you've got the family, size settles the rest.",
    concepts: ["ear-harmonic-vs-melodic"],
    quiz: { kind: "ear-interval", intervals: ["b2", "2", "b3", "3", "4", "#4", "5", "b6", "6", "b7", "7"], direction: "harmonic" },
    vary: ["root"]
  },

  {
    id: "ear-int-mixed-drill",
    mode: "ear", category: "ear-intervals",
    tags: ["intervals", "mixed", "drill"],
    title: "Interval drill block: up, down and together",
    level: 6, length: "medium", minutes: 3,
    params: { root: "any" },
    prompt: "A block of mixed intervals: ascending, descending and harmonic, all within the octave. Answer fast; trust your first impression.",
    goal: "85% or better at a gut-reaction pace.",
    hints: [
      "Don't sing up the scale anymore; aim to recognise the colour directly.",
      "Descending: hear the low note as 'home'.",
      "Harmonic: consonance family first, then size."
    ],
    explain: "### Why a mixed block\nPractising one direction at a time builds the skill; **mixing directions** tests whether you've learned the interval itself or only one way of hearing it. Expect your score to dip at first. That dip is normal, and it shows the block is testing something new.",
    concepts: ["ear-interval-songs", "ear-harmonic-vs-melodic"],
    quiz: { kind: "ear-interval", intervals: ["b2", "2", "b3", "3", "4", "#4", "5", "b6", "6", "b7", "7"], direction: "mixed" },
    vary: ["root"]
  },

  {
    id: "ear-int-compound-9ths",
    mode: "ear", category: "ear-intervals",
    tags: ["intervals", "compound", "tensions", "ninths"],
    title: "Compound: b9, 9 or #9?",
    level: 6, length: "short", minutes: 1,
    params: { root: "any" },
    prompt: "A leap of more than an octave, as **9ths**. Name it: **b9, 9 or #9**.",
    hints: [
      "Collapse it: drop the top note an octave in your head. b9 → m2, 9 → M2, #9 → m3.",
      "b9 is dark and tense; 9 is lush; #9 is the bluesy 'Hendrix chord' note.",
      "On guitar: root on string 5, 9th = 2 frets up on string 3... or 14 frets up the same string."
    ],
    explain: "### What to listen for\nA compound interval is a simple interval plus an octave. The skill: **fold it down** mentally and name the small interval, then add 7 (2 → 9). The 9ths are the tensions you'll hear in extended and altered chords, so this connects intervals to harmony.\n\nThe **#9** is enharmonically a minor 10th; we call it #9 because that's its job over a dominant chord.",
    concepts: ["ear-compound-intervals", "ear-extensions"],
    quiz: { kind: "ear-interval", intervals: ["b9", "9", "#9"], direction: "up" },
    vary: ["root"]
  },

  {
    id: "ear-int-compound-tensions-harm",
    mode: "ear", category: "ear-intervals",
    tags: ["intervals", "compound", "harmonic", "tensions"],
    title: "Harmonic tensions over a root: 9, 11, #11, 13",
    level: 7, length: "short", minutes: 1,
    params: { root: "any" },
    prompt: "A bass note with a high tension above it, struck together. **9, 11, #11 or 13**?",
    hints: [
      "9 = lush; 11 = suspended, rubs against any 3rd; #11 = shimmering Lydian; 13 = sweet, like a 6th.",
      "Fold it: 9 → 2, 11 → 4, #11 → #4, 13 → 6.",
      "#11 is the tritone above the root, an octave up, but sounds much less harsh because of the spacing."
    ],
    explain: "### What to listen for\nWide spacing softens dissonance. That's why a #11 or b9 sounds usable at the top of a chord but harsh as a close dyad. Hearing tensions against a root is the bridge to hearing extended chords: a maj7#11 is just a maj7 with this Lydian shimmer on top.",
    concepts: ["ear-compound-intervals", "ear-extensions"],
    quiz: { kind: "ear-interval", intervals: ["9", "11", "#11", "13"], direction: "harmonic" },
    vary: ["root"]
  },

  {
    id: "ear-int-compound-all",
    mode: "ear", category: "ear-intervals",
    tags: ["intervals", "compound", "mixed", "tensions"],
    title: "All tensions, any direction",
    level: 8, length: "short", minutes: 2,
    params: { root: "any" },
    prompt: "Any of the seven tensions (b9, 9, #9, 11, #11, b13, 13), up, down or together.",
    hints: [
      "Fold to the simple interval, then add 7.",
      "b13 vs 13: dark (augmented-5th colour) vs sweet (6th colour).",
      "Altered tensions (b9, #9, #11, b13) all sound 'outside'; natural ones (9, 11, 13) sound 'inside'."
    ],
    explain: "### What to listen for\nTwo families: **natural tensions** (9, 11, 13), consonant colours from the major scale; and **altered tensions** (b9, #9, #11, b13), the dominant-chord spice from melodic minor's altered mode. Telling the family first halves the choice.",
    concepts: ["ear-compound-intervals", "ear-altered-dominants"],
    quiz: { kind: "ear-interval", intervals: ["b9", "9", "#9", "11", "#11", "b13", "13"], direction: "mixed" },
    vary: ["root"]
  },

  {
    id: "ear-int-simple-vs-compound",
    mode: "ear", category: "ear-intervals",
    tags: ["intervals", "compound", "harmonic", "voicing"],
    title: "Close or spread? 2 vs 9, 4 vs 11, 6 vs 13",
    level: 9, length: "short", minutes: 2,
    params: { root: "any" },
    prompt: "Dyads in **close** or **wide** spacing. Name the exact interval: b2/b9, 2/9, 4/11, 6/13.",
    hints: [
      "Close spacing beats and rubs; wide spacing floats.",
      "Listen for the register gap: is there 'room' for a whole octave between the notes?",
      "This is the difference between a cluster voicing and a spread drop voicing."
    ],
    explain: "### What to listen for\nSame pitch class, different octave, different sound. Arrangers and guitarists choose voicings for exactly this: a 9 above the root sounds lush; a 2 right next to it is a cluster. Hearing the difference tells you how a recorded chord is voiced, which is half the battle when transcribing guitar parts.",
    concepts: ["ear-compound-intervals"],
    quiz: { kind: "ear-interval", intervals: ["b2", "b9", "2", "9", "4", "11", "6", "13"], direction: "harmonic" },
    vary: ["root"]
  },

  // =====================================================================================
  // EAR-INTERVALS — song-reference lessons (kind: "listen").
  // Copyright rule: copyrighted songs are referenced by name + first interval only (2 notes);
  // the melody played is just those two notes. Public-domain tunes may be quoted at length.
  // =====================================================================================

  {
    id: "ear-song-octave-up",
    mode: "ear", category: "ear-intervals",
    tags: ["song-reference", "octave", "ascending"],
    title: "Octave up: Somewhere Over the Rainbow",
    level: 1, length: "short", minutes: 1,
    params: { key: "major" },
    prompt: "Listen: **1 → 1'**, an octave up. It's the first leap of *Over the Rainbow* (Arlen/Harburg) and of *The Christmas Song* ('Chestnuts roasting…').",
    hints: [
      "Same note name, twice as fast a vibration: the two notes almost merge.",
      "On guitar: 12 frets up the same string, or 2 strings up and 2 frets up (strings 6→4, 5→3)."
    ],
    explain: "### The octave\nThe most consonant interval after the unison. The top note sounds like the *same* note, only higher. Song reference: the first two notes of *Somewhere Over the Rainbow* jump an octave (1 → 1'). That's the only part of the tune played here; the song is under copyright.",
    concepts: ["ear-interval-songs"],
    quiz: { kind: "listen", melody: "1 - 1' - - -", scale: "major", tempo: 80, explain: "Octave up: the first two notes of Over the Rainbow (copyrighted: two notes only)." },
    vary: ["key"]
  },

  {
    id: "ear-song-p5-up",
    mode: "ear", category: "ear-intervals",
    tags: ["song-reference", "fifth", "ascending", "public-domain"],
    title: "Perfect 5th up: Twinkle Twinkle and Also sprach Zarathustra",
    level: 1, length: "short", minutes: 1,
    params: { key: "major" },
    prompt: "Listen to the **P5** leap: Twinkle Twinkle (1 1 **5** 5) and the opening of Strauss's *Also sprach Zarathustra* (1 → 5 → 1').",
    hints: [
      "Twinkle's first interval is a unison. The 5th is the jump between 'twin-kle' and 'twin-kle'.",
      "Also heard as the first two long notes of the Star Wars main theme, and the first two notes of My Favorite Things and Can't Help Falling in Love."
    ],
    explain: "### The perfect 5th\nOpen, strong, the power-chord sound. Public-domain examples are quoted in full: *Twinkle Twinkle* (trad., 1 1 5 5 6 6 5) and the sunrise motif of *Also sprach Zarathustra* (Strauss, 1896: 1, 5, 1'). For the copyrighted references (Star Wars, My Favorite Things, Can't Help Falling in Love) only the name of the leap is given.",
    concepts: ["ear-interval-songs"],
    quiz: { kind: "listen", melody: "1 1 5 5 | 6 6 5 - | . . . . | 1 - 5 - | 1' - - - |", scale: "major", tempo: 90, explain: "Twinkle Twinkle (trad.), then Zarathustra's 1 – 5 – 1'." },
    vary: ["key"]
  },

  {
    id: "ear-song-p4-up",
    mode: "ear", category: "ear-intervals",
    tags: ["song-reference", "fourth", "ascending", "public-domain"],
    title: "Perfect 4th up: Here Comes the Bride, Amazing Grace, Auld Lang Syne",
    level: 2, length: "short", minutes: 1,
    params: { key: "major" },
    prompt: "Listen: **5, → 1**, a perfect 4th up from the 5th below. That's the pickup into the tonic in Wagner's *Bridal Chorus*, *Amazing Grace* and *Auld Lang Syne*.",
    hints: [
      "All three start on the low 5 and leap up to 1: the classic pickup.",
      "Beat unit in this demo is an 8th note."
    ],
    explain: "### The perfect 4th\nThe most common pickup in folk and hymn tunes: **5 below → 1**. Because it lands on the tonic, the 4th up feels like 'arriving'. Heard from the root (1 → 4) it feels restless instead, a good example of why *function* matters as much as interval size.\n\nDemo: Wagner's Bridal Chorus (1850, public domain), first four notes: 5, 1 1 1.",
    concepts: ["ear-interval-songs", "ear-functional-hearing"],
    quiz: { kind: "listen", melody: "5, - 1 -_ 1_ 1 - - - |", scale: "major", tempo: 120, explain: "Bridal Chorus (Wagner): 5, → 1 is a P4 up. Beat = 8th note." },
    vary: ["key"]
  },

  {
    id: "ear-song-M3-up",
    mode: "ear", category: "ear-intervals",
    tags: ["song-reference", "third", "ascending", "public-domain"],
    title: "Major 3rd up: When the Saints",
    level: 1, length: "short", minutes: 1,
    params: { key: "major" },
    prompt: "*When the Saints* (trad.) opens **1 → 3 → 4 → 5**. The first leap is a **major 3rd**.",
    hints: ["The rest of the phrase walks up by step to the 5th: you hear the M3 inside a major-triad outline."],
    explain: "### The major 3rd\nBright, the defining interval of the major triad. *When the Saints* (traditional, public domain) starts on the root and jumps to the 3rd. Hear how the 1 and 3 together already 'sound major'.",
    concepts: ["ear-interval-songs"],
    quiz: { kind: "listen", melody: "1 3 4 5 - - - |", scale: "major", tempo: 110, explain: "When the Saints (trad.): 1 → 3 is a major 3rd." },
    vary: ["key"]
  },

  {
    id: "ear-song-M3-down",
    mode: "ear", category: "ear-intervals",
    tags: ["song-reference", "third", "descending", "public-domain"],
    title: "Major 3rd down: Swing Low and Beethoven's 5th",
    level: 2, length: "short", minutes: 1,
    params: { key: "major" },
    prompt: "*Swing Low, Sweet Chariot* (trad.) opens **3 → 1**, a major 3rd down. Beethoven's 5th Symphony motif (G G G E♭) is the same interval: 5 → b3 in minor.",
    hints: ["Same interval, different function: in Swing Low it falls to the tonic; in Beethoven it falls from 5 to the minor 3rd."],
    explain: "### The major 3rd, descending\nPublic-domain anchors: *Swing Low* (trad.) and Beethoven's Symphony No. 5 (1808). Both quoted.",
    concepts: ["ear-interval-songs"],
    quiz: { kind: "listen", melody: "3 1 - 3 | 1 -_ 1_ 6,_ 5, -_ |", scale: "major", tempo: 80, explain: "Swing Low (trad.), first bar and a half: 3 → 1 is a M3 down." },
    vary: ["key"]
  },

  {
    id: "ear-song-m3-up",
    mode: "ear", category: "ear-intervals",
    tags: ["song-reference", "third", "ascending", "minor", "public-domain"],
    title: "Minor 3rd up: Greensleeves",
    level: 2, length: "short", minutes: 1,
    params: { key: "minor" },
    prompt: "*Greensleeves* (trad.) opens **1 → b3**, a minor 3rd up, then climbs 4, 5, b6, 5.",
    hints: ["Beat unit here = 8th note (the tune is in 6/8).", "Hear the b3: it makes the whole phrase minor."],
    explain: "### The minor 3rd\nDarker than the major 3rd by one semitone. *Greensleeves* (16th-century English tune, public domain) is a perfect anchor because the m3 is also its key-defining note.",
    concepts: ["ear-interval-songs"],
    quiz: { kind: "listen", melody: "1 | b3 - 4 5 -_ b6_ 5 | 4 - - |", scale: "aeolian", tempo: 180, explain: "Greensleeves (trad.), first bar: 1 → b3 is a minor 3rd. Beat = 8th note." },
    vary: ["key"]
  },

  {
    id: "ear-song-m3-down",
    mode: "ear", category: "ear-intervals",
    tags: ["song-reference", "third", "descending", "public-domain"],
    title: "Minor 3rd down: The Star-Spangled Banner",
    level: 2, length: "short", minutes: 1,
    params: { key: "major" },
    prompt: "The anthem opens **5 → 3 → 1**: the first interval is a **minor 3rd down**. (*Hey Jude* also begins with a falling minor 3rd, its first two notes.)",
    hints: ["Beat unit = 8th note.", "Listen for the #4 on 'early': 3 #4 5. A chromatic approach to the 5th."],
    explain: "### The minor 3rd, descending\n5 → 3 inside a major chord. The tune (John Stafford Smith, 18th c.) is public domain, so the whole first phrase is quoted: 5 3 1 3 5 1' 3' 2' 1' 3 #4 5.",
    concepts: ["ear-interval-songs"],
    quiz: { kind: "listen", melody: "5 -_ 3_ | 1 - 3 - 5 - | 1' - - - 3' -_ 2'_ | 1' - 3 - #4 - | 5 - - - |", scale: "major", tempo: 180, explain: "Star-Spangled Banner, first phrase. Beat = 8th note." },
    vary: ["key"]
  },

  {
    id: "ear-song-M2",
    mode: "ear", category: "ear-intervals",
    tags: ["song-reference", "second", "public-domain"],
    title: "Major 2nd up and down: Frère Jacques and Mary Had a Little Lamb",
    level: 1, length: "short", minutes: 1,
    params: { key: "major" },
    prompt: "**Up**: Frère Jacques (1 → 2). **Down**: Mary Had a Little Lamb (3 → 2). Also: *Yesterday* starts with a falling whole step (first two notes).",
    hints: ["The M2 is the basic step of melody: neither bright nor dark."],
    explain: "### The major 2nd\nBoth tunes are traditional. Frère Jacques climbs 1 2 3 1; Mary walks down 3 2 1 2 3 3 3.",
    concepts: ["ear-interval-songs"],
    quiz: { kind: "listen", melody: "1 2 3 1 | 1 2 3 1 | . . . . | 3 2 1 2 | 3 3 3 - |", scale: "major", tempo: 110, explain: "Frère Jacques (M2 up), then Mary Had a Little Lamb (M2 down)." },
    vary: ["key"]
  },

  {
    id: "ear-song-m2",
    mode: "ear", category: "ear-intervals",
    tags: ["song-reference", "second", "chromatic", "public-domain"],
    title: "Minor 2nd: Joy to the World, Für Elise, Jaws",
    level: 2, length: "short", minutes: 1,
    params: { key: "major" },
    prompt: "**Down**: *Joy to the World* starts 1' → 7 and walks the whole major scale down. **Up**: the *Jaws* theme is two notes a minor 2nd apart (first two notes only, copyrighted).",
    hints: ["Beat = 8th note.", "Für Elise (Beethoven) rocks between 5 and #4: m2 down, m2 up."],
    explain: "### The minor 2nd\nThe tightest interval. Descending, it's the 'leading tone' in reverse (1' → 7). *Joy to the World* (Lowell Mason after Handel, public domain) is also the clearest major-scale reference there is: 1' 7 6 5 4 3 2 1.",
    concepts: ["ear-interval-songs"],
    quiz: { kind: "listen", melody: "1' - 7 -_ 6_ | 5 - - 4 | 3 - 2 - | 1 - - - |", scale: "major", tempo: 150, explain: "Joy to the World, first phrase: the major scale descending. Beat = 8th note." },
    vary: ["key"]
  },

  {
    id: "ear-song-p4-down",
    mode: "ear", category: "ear-intervals",
    tags: ["song-reference", "fourth", "descending", "public-domain"],
    title: "Perfect 4th down: Eine kleine Nachtmusik",
    level: 3, length: "short", minutes: 1,
    params: { key: "major" },
    prompt: "Mozart's *Eine kleine Nachtmusik* opens **1 → 5,** (a 4th down), twice, then runs up the triad 1 5, 1 3 5.",
    hints: ["A falling 4th from the root lands on the 5th below. Think 'bugle call'."],
    explain: "### The perfect 4th, descending\nMozart (1787) is public domain. The descending 4th 1 → 5, is the same pair of notes as the 'pickup' 5, → 1 in reverse.",
    concepts: ["ear-interval-songs"],
    quiz: { kind: "listen", melody: "1 ._ 5,_ 1 ._ 5,_ | 1_ 5,_ 1_ 3_ 5 - |", scale: "major", tempo: 100, explain: "Eine kleine Nachtmusik (Mozart), opening." },
    vary: ["key"]
  },

  {
    id: "ear-song-M6-up",
    mode: "ear", category: "ear-intervals",
    tags: ["song-reference", "sixth", "ascending", "public-domain"],
    title: "Major 6th up: My Bonnie and Jingle Bells (verse)",
    level: 3, length: "short", minutes: 1,
    params: { key: "major" },
    prompt: "*My Bonnie Lies Over the Ocean* opens **5, → 3**, a major 6th up. So does the verse of *Jingle Bells* ('Dashing through the snow': 5, 3 2 1 5,).",
    hints: ["Both start on the low 5 and leap to the 3rd above the tonic.", "The NBC chimes are the same leap."],
    explain: "### The major 6th\nSweet and wide. Both tunes are public domain (My Bonnie: trad.; Jingle Bells: Pierpont, 1857). Melody here: My Bonnie's first notes, then Jingle Bells' verse opening.",
    concepts: ["ear-interval-songs"],
    quiz: { kind: "listen", melody: "5, | 3 -_ 2_ 1 | - - . | 5, 3 2 1 | 5, - - |", scale: "major", tempo: 110, explain: "My Bonnie (trad.), then Jingle Bells verse (Pierpont 1857)." },
    vary: ["key"]
  },

  {
    id: "ear-song-m6-up",
    mode: "ear", category: "ear-intervals",
    tags: ["song-reference", "sixth", "ascending", "public-domain", "ragtime"],
    title: "Minor 6th up: The Entertainer",
    level: 4, length: "short", minutes: 1,
    params: { key: "major" },
    prompt: "Joplin's *The Entertainer* (1902): after the chromatic pickup 2 #2 3, the melody leaps **3 → 1'**, a **minor 6th** up, and keeps bouncing between them.",
    hints: ["Not the first interval: it's the leap from the 3rd to the 4th note.", "m6 up = an octave minus a major 3rd."],
    explain: "### The minor 6th\nA leap from the 3rd up to the octave root: bittersweet, wide. Ragtime is public domain, so the opening is quoted in full.",
    concepts: ["ear-interval-songs"],
    quiz: { kind: "listen", melody: "2_ #2_ 3_ 1' 3_ 1' 3_ 1' - - |", scale: "major", tempo: 80, explain: "The Entertainer (Joplin, 1902), main theme opening." },
    vary: ["key"]
  },

  {
    id: "ear-song-tritone-m7",
    mode: "ear", category: "ear-intervals",
    tags: ["song-reference", "tritone", "seventh", "ascending"],
    title: "Tritone and minor 7th up: Maria, Star Trek, Somewhere",
    level: 3, length: "short", minutes: 1,
    params: { key: "major" },
    prompt: "**Tritone up**: the first two notes of *Maria* (West Side Story). **Minor 7th up**: the first two notes of the original *Star Trek* theme, and of *Somewhere* (West Side Story). Two-note references only: these songs are copyrighted.",
    hints: ["Tritone: unresolved, it wants to go up a half step.", "m7: the 'dominant 7th' leap. Bluesy, expectant."],
    explain: "### Two restless leaps\nThe demo plays the tritone (1 → #4), a pause, then the minor 7th (1 → b7): only the bare intervals, nothing more of either song.",
    concepts: ["ear-interval-songs"],
    quiz: { kind: "listen", melody: "1 - #4 - - - | . . . . | 1 - b7 - - - |", scale: "major", tempo: 80, explain: "Tritone up (Maria, first two notes); minor 7th up (Star Trek / Somewhere, first two notes)." },
    vary: ["key"]
  },

  // =====================================================================================
  // EAR-CHORDS — triads → inversions → 7ths → extensions → altered dominants → upper structures.
  // =====================================================================================

  {
    id: "ear-chd-maj-min",
    mode: "ear", category: "ear-chords",
    tags: ["chords", "triads", "major-minor", "beginner"],
    title: "Major or minor triad?",
    level: 1, length: "short", minutes: 1,
    params: { root: "any" },
    prompt: "One chord. **Major** or **minor**?",
    hints: [
      "Hum the middle note: is it the bright 3rd or the dark b3?",
      "Major = happy/bright, minor = sad/dark. Crude, but true for triads in isolation.",
      "If it's hard, the engine can arpeggiate it: try the arpeggiated card first."
    ],
    explain: "### What to listen for\nThe only difference is the 3rd: **1 3 5** vs **1 b3 5**. Everything you learned about M3 vs m3 applies. Listen *inside* the chord for the middle voice.",
    concepts: ["ear-chord-qualities"],
    quiz: { kind: "ear-chord", qualities: ["maj", "min"], voicing: "close", inversions: false, arpeggiate: false },
    vary: ["root"]
  },

  {
    id: "ear-chd-maj-min-arp",
    mode: "ear", category: "ear-chords",
    tags: ["chords", "triads", "arpeggio", "beginner"],
    title: "Major or minor, arpeggiated",
    level: 1, length: "short", minutes: 1,
    params: { root: "any" },
    prompt: "The chord is played one note at a time (1, 3, 5). **Major** or **minor**?",
    hints: ["Listen to the first leap: M3 (major) or m3 (minor)?", "Then the second: m3 (major triad) or M3 (minor triad)."],
    explain: "### Why arpeggiated first\nBroken chords turn a harmonic problem into a melodic one, which beginners solve more easily. A major triad stacks **M3 + m3**; a minor triad stacks **m3 + M3**. Once this is automatic, go back to the block-chord card.",
    concepts: ["ear-chord-qualities", "ear-harmonic-vs-melodic"],
    quiz: { kind: "ear-chord", qualities: ["maj", "min"], voicing: "close", inversions: false, arpeggiate: true },
    vary: ["root"]
  },

  {
    id: "ear-chd-maj-min-dim",
    mode: "ear", category: "ear-chords",
    tags: ["chords", "triads", "diminished"],
    title: "Major, minor or diminished?",
    level: 2, length: "short", minutes: 1,
    params: { root: "any" },
    prompt: "**Major, minor or diminished** triad?",
    hints: ["Diminished = two minor 3rds stacked: small, tight, tense.", "It contains a tritone (1 to b5), so it never sounds at rest."],
    explain: "### The diminished triad\n**1 b3 b5**. Compared with minor, the top note drops a half step and the chord loses its stable 5th. It sounds compressed and unstable, wanting to move. In major keys it lives on vii°.",
    concepts: ["ear-chord-qualities", "ear-diminished-family"],
    quiz: { kind: "ear-chord", qualities: ["maj", "min", "dim"], voicing: "close", inversions: false, arpeggiate: false },
    vary: ["root"]
  },

  {
    id: "ear-chd-four-triads",
    mode: "ear", category: "ear-chords",
    tags: ["chords", "triads", "augmented", "diminished"],
    title: "All four triads: maj, min, dim, aug",
    level: 3, length: "short", minutes: 1,
    params: { root: "any" },
    prompt: "**Major, minor, diminished or augmented**?",
    hints: [
      "Aug = two major 3rds: bright but unsettled, dreamy, 'question mark'.",
      "Dim = two minor 3rds: dark and tense.",
      "Maj and min have a perfect 5th: they sound stable."
    ],
    explain: "### Stable vs unstable\nFirst sort by the 5th: **perfect 5th** (maj, min) sounds stable; **altered 5th** (dim b5, aug #5) does not. Then sort by 3rd. The augmented triad is symmetrical (three M3s divide the octave), so it has no clear root by ear; that 'floating' quality is the giveaway.",
    concepts: ["ear-chord-qualities"],
    quiz: { kind: "ear-chord", qualities: ["maj", "min", "dim", "aug"], voicing: "close", inversions: false, arpeggiate: false },
    vary: ["root"]
  },

  {
    id: "ear-chd-sus",
    mode: "ear", category: "ear-chords",
    tags: ["chords", "triads", "sus"],
    title: "Sus2, sus4, major or minor?",
    level: 3, length: "short", minutes: 1,
    params: { root: "any" },
    prompt: "**sus2, sus4, maj or min**?",
    hints: ["Sus chords have no 3rd: neither happy nor sad, just open.", "sus4 pulls down to the 3rd; sus2 feels airy and doesn't pull much."],
    explain: "### Suspensions\nReplace the 3rd with the 2 or the 4 and the chord loses its major/minor identity. **sus4** has a strong pull (4 → 3); **sus2** is static and open, the sound of a lot of modern rock and worship guitar.",
    concepts: ["ear-chord-qualities"],
    quiz: { kind: "ear-chord", qualities: ["sus2", "sus4", "maj", "min"], voicing: "close", inversions: false, arpeggiate: false },
    vary: ["root"]
  },

  {
    id: "ear-chd-inv-maj-close",
    mode: "ear", category: "ear-chords",
    tags: ["chords", "inversions", "triads", "bass"],
    title: "Which inversion? Major triad (close)",
    level: 3, length: "short", minutes: 1,
    params: { root: "any" },
    prompt: "A major triad in close position. **Root position, 1st inversion or 2nd inversion**?",
    hints: [
      "Listen to the **bass** (lowest note) and hum it.",
      "Root position: bass = root, the most solid. 1st inv (3rd in bass): lighter, less grounded. 2nd inv (5th in bass): floating, wants to move (cadential 6/4).",
      "Top note helps too: root position has the 5th on top, 1st inv the root, 2nd inv the 3rd."
    ],
    explain: "### How to hear inversions\nYou're not identifying the quality (it's always major here). You're identifying **what's in the bass**. Hum the lowest note, then hum the chord's root: same note → root position; root is a 6th above or a 3rd below the bass → 1st inversion; root is a 4th above → 2nd inversion.",
    concepts: ["ear-inversions-bass"],
    quiz: { kind: "ear-inversion", quality: "maj", voicing: "close" },
    vary: ["root"]
  },

  {
    id: "ear-chd-inv-min-close",
    mode: "ear", category: "ear-chords",
    tags: ["chords", "inversions", "triads", "bass"],
    title: "Which inversion? Minor triad (close)",
    level: 4, length: "short", minutes: 1,
    params: { root: "any" },
    prompt: "Minor triad: **root position, 1st or 2nd inversion**?",
    hints: ["Bass first. Then top note: 5 on top = root position, 1 on top = 1st inv, b3 on top = 2nd inv.", "Minor 1st inversion has the b3 in the bass: it sounds surprisingly 'major-ish' because the bass to top is a M6."],
    explain: "### Same method, darker colour\nInversions of minor triads are harder because the intervals against the bass change: 1st inversion (b3 in bass) contains M3 + P4 above the bass, which can fool you into hearing a major chord. Trust the bass.",
    concepts: ["ear-inversions-bass"],
    quiz: { kind: "ear-inversion", quality: "min", voicing: "close" },
    vary: ["root"]
  },

  {
    id: "ear-chd-inv-maj-spread",
    mode: "ear", category: "ear-chords",
    tags: ["chords", "inversions", "spread-triads", "bass"],
    title: "Which inversion? Spread major triad",
    level: 5, length: "short", minutes: 1,
    params: { root: "any" },
    prompt: "Spread (open) major triad. **Root, 1st or 2nd inversion**?",
    hints: ["Spread voicings put a 10th or 6th between bass and the next voice: the bass stands out more, so use it.", "Root position spread = 1 5 3: very wide, orchestral."],
    explain: "### Open voicings\nSpread triads (drop 2 of a triad) are how pianists and orchestrators voice chords. They also sound great on guitar. The extra space makes the bass easier to isolate, but the top voice is far from the bass, so don't rely on intervals from the bottom.",
    concepts: ["ear-inversions-bass"],
    quiz: { kind: "ear-inversion", quality: "maj", voicing: "spread" },
    vary: ["root"]
  },

  {
    id: "ear-chd-triads-inverted",
    mode: "ear", category: "ear-chords",
    tags: ["chords", "triads", "inversions", "spread-triads"],
    title: "Triad quality in any inversion",
    level: 4, length: "short", minutes: 1,
    params: { root: "any" },
    prompt: "Name the quality (**maj, min, dim, aug**). The chord may be inverted and spread.",
    hints: ["Inversion changes the intervals against the bass but not the colour of the whole chord.", "Find the root first if you can: it's usually the note the others 'belong to'."],
    explain: "### Quality survives inversion\nThis is the real-world version: on records, chords are rarely in root position close voicing. Ignore the bass this time and listen to the overall colour.",
    concepts: ["ear-chord-qualities", "ear-inversions-bass"],
    quiz: { kind: "ear-chord", qualities: ["maj", "min", "dim", "aug"], voicing: "spread", inversions: true, arpeggiate: false },
    vary: ["root"]
  },

  {
    id: "ear-chd-maj7-dom7",
    mode: "ear", category: "ear-chords",
    tags: ["chords", "sevenths", "maj7", "dominant"],
    title: "maj7 or dominant 7?",
    level: 4, length: "short", minutes: 1,
    params: { root: "any" },
    prompt: "Both have a major triad. Is the 7th **major (maj7)** or **flat (7)**?",
    hints: [
      "maj7: dreamy, soft, at rest. The 7 sits a half step under the octave root.",
      "7: bluesy, restless, wants to resolve (it contains a tritone between 3 and b7).",
      "Hum the top note and go up: a half step to the root = maj7, a whole step = 7."
    ],
    explain: "### Two kinds of major 7th chord\nmaj7 is a **resting** chord (I, IV). Dominant 7 is a **moving** chord (V). The 3–b7 tritone is what makes the dominant sound like it needs to go somewhere.",
    concepts: ["ear-chord-qualities"],
    quiz: { kind: "ear-chord", qualities: ["maj7", "7"], voicing: "drop2", inversions: false, arpeggiate: false },
    vary: ["root"]
  },

  {
    id: "ear-chd-dom7-m7",
    mode: "ear", category: "ear-chords",
    tags: ["chords", "sevenths", "dominant", "minor"],
    title: "Dominant 7 or minor 7?",
    level: 4, length: "short", minutes: 1,
    params: { root: "any" },
    prompt: "Both have a b7. Is the 3rd **major (7)** or **minor (m7)**?",
    hints: ["m7 is mellow and stable: no tritone.", "7 is tense: the 3 and b7 grind."],
    explain: "### The 3rd decides\n**7** = 1 3 5 b7 (tense, has a tritone). **m7** = 1 b3 5 b7 (smooth; the ii chord, the Dorian vamp). Many beginners confuse these because both 'sound bluesy'. Listen for tension, not darkness.",
    concepts: ["ear-chord-qualities"],
    quiz: { kind: "ear-chord", qualities: ["7", "m7"], voicing: "drop2", inversions: false, arpeggiate: false },
    vary: ["root"]
  },

  {
    id: "ear-chd-three-7ths",
    mode: "ear", category: "ear-chords",
    tags: ["chords", "sevenths", "ii-v-i"],
    title: "maj7, 7 or m7?",
    level: 5, length: "short", minutes: 1,
    params: { root: "any" },
    prompt: "The three chords of the major ii–V–I. **maj7, 7 or m7**?",
    hints: ["Rest + bright = maj7. Tense = 7. Rest + mellow = m7.", "Root position drop 2 throughout."],
    explain: "### The ii–V–I family\nThese three account for the vast majority of chords in jazz standards and much of soul and R&B. Two questions: *is there a tritone?* (7) If not, *bright or mellow?* (maj7 / m7).",
    concepts: ["ear-chord-qualities"],
    quiz: { kind: "ear-chord", qualities: ["maj7", "7", "m7"], voicing: "drop2", inversions: false, arpeggiate: false },
    vary: ["root"]
  },

  {
    id: "ear-chd-diminished-family",
    mode: "ear", category: "ear-chords",
    tags: ["chords", "diminished", "half-diminished", "sevenths"],
    title: "Diminished sounds: dim triad, m7b5 or dim7?",
    level: 5, length: "short", minutes: 1,
    params: { root: "any" },
    prompt: "Three diminished-family chords. **dim** (triad), **m7b5** (half-diminished) or **dim7** (fully diminished)?",
    hints: [
      "dim triad: 3 notes, tight and small.",
      "m7b5: has a b7. Darker but 'softer', more yearning. The ii chord in minor.",
      "dim7: perfectly symmetrical (all minor 3rds). Spooky, silent-movie villain, totally rootless."
    ],
    explain: "### The diminished family\n- **dim** = 1 b3 b5\n- **m7b5** = 1 b3 b5 **b7**: a minor 3rd on top of the dim triad.\n- **dim7** = 1 b3 b5 **bb7**: another minor 3rd, so the octave is split into four equal parts.\n\nThe dim7's symmetry is the giveaway: it sounds the same in every inversion, so it seems to have no root. The m7b5 sounds like a minor chord with a darkened 5th, *Tristan*-chord territory.",
    concepts: ["ear-diminished-family"],
    quiz: { kind: "ear-chord", qualities: ["dim", "m7b5", "dim7"], voicing: "drop2", inversions: false, arpeggiate: false },
    vary: ["root"]
  },

  {
    id: "ear-chd-five-7ths",
    mode: "ear", category: "ear-chords",
    tags: ["chords", "sevenths", "drill"],
    title: "Seventh-chord drill block: the five diatonic 7ths",
    level: 6, length: "medium", minutes: 3,
    params: { root: "any" },
    prompt: "A block of seventh chords: **maj7, 7, m7, m7b5, dim7**. Answer quickly.",
    goal: "Steady 85%+, then let the engine add inversions.",
    hints: ["Tritone present? → 7, m7b5 or dim7. Then: major 3rd (7), one tritone with minor 3rd (m7b5), two tritones (dim7).", "No tritone → maj7 (bright) or m7 (mellow)."],
    explain: "### Sorting by tritones\nA quick decision tree that works by ear:\n- **No tritone**: maj7 or m7.\n- **One tritone**: 7 (between 3 and b7) or m7b5 (between 1 and b5).\n- **Two tritones**: dim7.\n\nTension level climbs in that order.",
    concepts: ["ear-chord-qualities", "ear-diminished-family"],
    quiz: { kind: "ear-chord", qualities: ["maj7", "7", "m7", "m7b5", "dim7"], voicing: "drop2", inversions: false, arpeggiate: false },
    vary: ["root"]
  },

  {
    id: "ear-chd-minor-colours",
    mode: "ear", category: "ear-chords",
    tags: ["chords", "minor", "sevenths", "melodic-minor"],
    title: "Minor colours: m7, mMaj7 or m6?",
    level: 6, length: "short", minutes: 1,
    params: { root: "any" },
    prompt: "All three are minor chords. Which top colour: **b7 (m7)**, **7 (mMaj7)** or **6 (m6)**?",
    hints: ["mMaj7: the spy-movie / film-noir chord. A minor chord with a maj7 rub.", "m6: bittersweet, Dorian/melodic-minor tonic. m7: smooth and familiar."],
    explain: "### Three kinds of minor tonic\n- **m7**: Dorian/Aeolian, the default.\n- **m6**: melodic-minor or Dorian tonic, a bossa and gypsy-jazz favourite.\n- **mMaj7**: melodic or harmonic minor tonic, the most tense of the three (the 7 rubs against the root).\n\nThe 'line cliché' (1 → 7 → b7 → 6 over a minor chord) passes through all three.",
    concepts: ["ear-chord-qualities", "ear-mode-colors"],
    quiz: { kind: "ear-chord", qualities: ["m7", "mMaj7", "m6"], voicing: "drop2", inversions: false, arpeggiate: false },
    vary: ["root"]
  },

  {
    id: "ear-chd-major-sixes-sus",
    mode: "ear", category: "ear-chords",
    tags: ["chords", "sixth", "sus", "dominant"],
    title: "maj7, 6, 7 or 7sus4?",
    level: 6, length: "short", minutes: 1,
    params: { root: "any" },
    prompt: "**maj7, 6, 7 or 7sus4**?",
    hints: ["6 = sweet, vintage, at rest (no 7th at all).", "7sus4 = a dominant without its 3rd: open, modal, 'Herbie Hancock'.", "maj7 vs 6: shimmer vs sweetness."],
    explain: "### Major-ish colours\nThe **6** chord is the swing-era tonic and sounds more resolved than maj7. **7sus4** keeps the dominant's b7 but replaces the 3rd with 4, so the tritone disappears. It floats instead of pulling.",
    concepts: ["ear-chord-qualities"],
    quiz: { kind: "ear-chord", qualities: ["maj7", "6", "7", "7sus4"], voicing: "drop2", inversions: false, arpeggiate: false },
    vary: ["root"]
  },

  {
    id: "ear-chd-inv-maj7-drop2",
    mode: "ear", category: "ear-chords",
    tags: ["chords", "inversions", "drop2", "maj7"],
    title: "Which inversion? maj7 drop 2",
    level: 6, length: "short", minutes: 1,
    params: { root: "any" },
    prompt: "A maj7 drop 2 voicing. **Root position, 1st, 2nd or 3rd inversion** (7 in the bass)?",
    hints: ["3rd inversion (7 in bass) is the most dissonant: bass and next voice form a m2 or M7 rub.", "Root position: root in bass, 3 on top."],
    explain: "### Seventh-chord inversions\nSame method as triads: hum the bass, then find the root. With 7th chords you have four options; the 3rd inversion (7th in the bass) is the easiest to spot because of the crunch at the bottom.",
    concepts: ["ear-inversions-bass"],
    quiz: { kind: "ear-inversion", quality: "maj7", voicing: "drop2" },
    vary: ["root"]
  },

  {
    id: "ear-chd-inv-dom7-drop2",
    mode: "ear", category: "ear-chords",
    tags: ["chords", "inversions", "drop2", "dominant"],
    title: "Which inversion? Dominant 7 drop 2",
    level: 7, length: "short", minutes: 1,
    params: { root: "any" },
    prompt: "Dominant 7 drop 2. Which chord tone is in the bass: **1, 3, 5 or b7**?",
    hints: ["3 in the bass (1st inv.) sounds like it wants to step up a half step.", "b7 in the bass (3rd inv.) wants to step down to the 3rd of the next chord: V/b7 → I/3."],
    explain: "### Bass tells function\nInverted dominants are voice-leading devices: **V7/3** leads up to I, **V7/b7** leads down to I/3. Hearing the bass tells you where the line is going, which is why bass-line cards follow this one.",
    concepts: ["ear-inversions-bass"],
    quiz: { kind: "ear-inversion", quality: "7", voicing: "drop2" },
    vary: ["root"]
  },

  {
    id: "ear-chd-7ths-inverted",
    mode: "ear", category: "ear-chords",
    tags: ["chords", "sevenths", "inversions", "drop2"],
    title: "Seventh-chord quality in any inversion",
    level: 7, length: "short", minutes: 2,
    params: { root: "any" },
    prompt: "**maj7, 7, m7, m7b5 or dim7**. Voiced as drop 2, in any inversion.",
    hints: ["Ignore the bass; listen for the tritone count and the brightness.", "An inverted m7 can sound like a 6 chord (Am7/C = C6). That ambiguity is real."],
    explain: "### Real-world voicings\nRecorded guitar parts are rarely in root position. Note: some inverted chords are genuinely ambiguous: **Am7/C = C6**, **Bm7b5 = Dm6/B**. The engine names them by the chord it built; if you hear the other one, you're not wrong about the sound.",
    concepts: ["ear-chord-qualities", "ear-inversions-bass"],
    quiz: { kind: "ear-chord", qualities: ["maj7", "7", "m7", "m7b5", "dim7"], voicing: "drop2", inversions: true, arpeggiate: false },
    vary: ["root"]
  },

  {
    id: "ear-chd-ninths",
    mode: "ear", category: "ear-chords",
    tags: ["chords", "extended", "ninths"],
    title: "Extended: maj9, 9 or m9?",
    level: 6, length: "short", minutes: 1,
    params: { root: "any" },
    prompt: "Ninth chords: **maj9, 9 or m9**?",
    hints: ["Strip the 9 off in your head: what's underneath, maj7, 7 or m7?", "The 9 adds lushness but doesn't change the quality."],
    explain: "### Extensions sit on top\nA 9th chord is a 7th chord plus a 9. Identify the **7th chord underneath** first; the extension is just colour. maj9 = the neo-soul tonic, m9 = the lush ii, 9 = the funk dominant.",
    concepts: ["ear-extensions"],
    quiz: { kind: "ear-chord", qualities: ["maj9", "9", "m9"], inversions: false, arpeggiate: false },
    vary: ["root"]
  },

  {
    id: "ear-chd-major-extensions",
    mode: "ear", category: "ear-chords",
    tags: ["chords", "extended", "lydian", "major"],
    title: "Major colours: maj7, maj9, maj7#11 or 6/9?",
    level: 7, length: "short", minutes: 1,
    params: { root: "any" },
    prompt: "Four tonic-major colours. **maj7, maj9, maj7#11 or 6/9**?",
    hints: ["#11 = Lydian shimmer: bright, a bit floating.", "6/9: no 7th at all. Pentatonic, open, very consonant.", "maj9 vs maj7: the 9 adds a lush 'cloud' on top."],
    explain: "### Tonic colours\nAll of these can replace a plain major chord. **6/9** is built entirely from the major pentatonic (1 2 3 5 6), so it's the most consonant. **maj7#11** is the Lydian sound, common for IV chords and for modern tonic endings.",
    concepts: ["ear-extensions", "ear-mode-colors"],
    quiz: { kind: "ear-chord", qualities: ["maj7", "maj9", "maj7#11", "6/9"], inversions: false, arpeggiate: false },
    vary: ["root"]
  },

  {
    id: "ear-chd-dominant-extensions",
    mode: "ear", category: "ear-chords",
    tags: ["chords", "extended", "dominant", "sus"],
    title: "Dominant colours: 9, 13, 7sus4 or 9sus4?",
    level: 7, length: "short", minutes: 1,
    params: { root: "any" },
    prompt: "**9, 13, 7sus4 or 9sus4**?",
    hints: ["13 has a sweet 6th-like note on top, the classic big-band/blues dominant.", "Sus chords: no 3rd, no tritone, they float.", "9sus4 = the 'Maiden Voyage' sound: like a IV triad over the V bass."],
    explain: "### Unaltered dominants\nThe **natural** extensions (9, 13) keep the dominant 'inside'. The **sus** versions remove the 3rd, so the chord stops pulling and becomes modal. A 9sus4 is the same as a ii chord over the V bass (Dm7/G = G9sus4), which is why it sounds like ii and V at once.",
    concepts: ["ear-extensions"],
    quiz: { kind: "ear-chord", qualities: ["9", "13", "7sus4", "9sus4"], inversions: false, arpeggiate: false },
    vary: ["root"]
  },

  {
    id: "ear-chd-minor-extensions",
    mode: "ear", category: "ear-chords",
    tags: ["chords", "extended", "minor"],
    title: "Minor colours: m7, m9, m11 or m6/9?",
    level: 8, length: "short", minutes: 1,
    params: { root: "any" },
    prompt: "**m7, m9, m11 or m6/9**?",
    hints: ["m11: stacked 4ths on top, the 'So What' sound.", "m6/9: Dorian with a bright 6, no b7.", "m9 vs m7: listen for the extra lush note at the top."],
    explain: "### Minor extensions\nOn a minor chord, 9 and 11 are both available tensions (no avoid-notes). The m11 has a quartal, open-fifths feel. m6/9 replaces the b7 with the 6, making it the brighter Dorian/melodic-minor sound.",
    concepts: ["ear-extensions"],
    quiz: { kind: "ear-chord", qualities: ["m7", "m9", "m11", "m6/9"], inversions: false, arpeggiate: false },
    vary: ["root"]
  },

  {
    id: "ear-chd-altered-b9-s9",
    mode: "ear", category: "ear-chords",
    tags: ["chords", "altered", "dominant"],
    title: "Altered dominants: 7, 7b9 or 7#9?",
    level: 7, length: "short", minutes: 1,
    params: { root: "any" },
    prompt: "**7, 7b9 or 7#9**?",
    hints: ["7b9: dark, Spanish/klezmer, a dim7 sitting on the root. Classic V of minor.", "7#9: the Hendrix chord. Major 3rd and 'minor 3rd' at once, gritty.", "Plain 7: no extra spice."],
    explain: "### First alterations\nThe b9 and #9 are the most common altered tensions. **7b9** contains a diminished 7th chord (3 5 b7 b9), so it sounds dark and pulls strongly to minor. **7#9** sounds bluesy because the #9 is enharmonically a b3 clashing with the major 3rd.",
    concepts: ["ear-altered-dominants"],
    quiz: { kind: "ear-chord", qualities: ["7", "7b9", "7#9"], inversions: false, arpeggiate: false },
    vary: ["root"]
  },

  {
    id: "ear-chd-altered-single",
    mode: "ear", category: "ear-chords",
    tags: ["chords", "altered", "dominant", "tensions"],
    title: "One alteration: 7b9, 7#9, 7#11 or 7b13?",
    level: 8, length: "short", minutes: 2,
    params: { root: "any" },
    prompt: "Each dominant has **one** altered colour. **b9, #9, #11 or b13**?",
    hints: ["#11 = Lydian-dominant: bright and floating, the 'Simpsons'/fusion sound.", "b13 = dark and heavy, Mixolydian b6.", "b9 dark/dim, #9 bluesy/gritty."],
    explain: "### Each tension has a parent scale\n- **7b9** → half-whole diminished or Phrygian dominant\n- **7#9** → altered or diminished\n- **7#11** → Lydian dominant (melodic minor from the 5th)\n- **7b13** → Mixolydian b6 / altered\n\nHearing the tension tells you which scale to play, which is the practical reason to train this.",
    concepts: ["ear-altered-dominants", "ear-mode-colors"],
    quiz: { kind: "ear-chord", qualities: ["7b9", "7#9", "7#11", "7b13"], inversions: false, arpeggiate: false },
    vary: ["root"]
  },

  {
    id: "ear-chd-dominant-spectrum",
    mode: "ear", category: "ear-chords",
    tags: ["chords", "altered", "dominant", "upper-structures"],
    title: "Inside or outside? 13, 13b9, 7#9b13 or 7alt",
    level: 9, length: "short", minutes: 2,
    params: { root: "any" },
    prompt: "From inside to fully outside: **13, 13b9, 7#9b13 or 7alt**?",
    hints: ["13 = all natural tensions: sweet.", "13b9 = sweet 13 on top with a dark b9: diminished-scale sound.", "7#9b13 and 7alt: no natural tensions at all; alt is the densest."],
    explain: "### The dominant spectrum\nDominants can be coloured from fully 'inside' (Mixolydian: 9, 13) through diminished (b9 + 13) to fully 'outside' (altered: b9 #9 #11 b13). Hearing where a dominant sits on that spectrum is how you pick a scale over it in real time.",
    concepts: ["ear-altered-dominants", "ear-upper-structures"],
    quiz: { kind: "ear-chord", qualities: ["13", "13b9", "7#9b13", "7alt"], inversions: false, arpeggiate: false },
    vary: ["root"]
  },

  {
    id: "ear-chd-upper-structures",
    mode: "ear", category: "ear-chords",
    tags: ["chords", "upper-structures", "altered", "dominant"],
    title: "Upper-structure triads over a dominant",
    level: 10, length: "short", minutes: 2,
    params: { root: "any" },
    prompt: "A triad floats above a 3–b7 shell. Name the result: **13#11** (UST II), **13b9** (UST VI), **7#9** (UST bIII) or **7#9b13** (UST bVI).",
    hints: [
      "Hear the top triad on its own: is it major? Where is its root relative to the bass?",
      "UST II (D/C7) = bright Lydian dominant. UST VI (A/C7) = diminished sound. UST bVI (Ab/C7) = dark altered. UST bIII (Eb/C7) = bluesy #9.",
      "The top note of the triad is usually the melody note, so listen to it."
    ],
    explain: "### Hearing upper structures\nAn upper-structure triad (UST) is a major triad played over the tritone shell (3 and b7) of a dominant. Over C7:\n- **D triad** (UST II) → 9 #11 13 → *13#11*\n- **A triad** (UST VI) → 13 b9 3 → *13b9*\n- **Eb triad** (UST bIII) → #9 5 b7 → *7#9*\n- **Ab triad** (UST bVI) → b13 1 #9 → *7#9b13*\n\nYour ear hears two layers: a tense shell and a consonant triad on top. Name the triad, work out its distance from the bass, and the chord name follows.",
    concepts: ["ear-upper-structures", "ear-altered-dominants"],
    quiz: { kind: "ear-chord", qualities: ["13#11", "13b9", "7#9", "7#9b13"], inversions: false, arpeggiate: false },
    vary: ["root"]
  },

  // =====================================================================================
  // EAR-PROGRESSIONS — the user's favourite mode: headphones on, name the progression.
  // Romans are relative to the MAJOR scale on the key's tonic (also in minor keys).
  // Each option list holds 3–8 progressions that are confusable at that level.
  // Tempo climbs adaptively inside the quiz's tempo range.
  // =====================================================================================

  {
    id: "ear-prog-two-chord",
    mode: "ear", category: "ear-progressions",
    tags: ["progressions", "diatonic", "beginner"],
    title: "Two-chord vamps: I–IV, I–V or I–vi?",
    level: 1, length: "short", minutes: 1,
    params: { key: "major" },
    prompt: "A two-chord vamp in **{key}**. Which one?",
    tempo: { start: 70, min: 60, max: 110, step: 5, unit: "bpm" },
    hints: [
      "Hum the bass. From 1 it goes up a 4th (IV), up a 5th / down a 4th (V), or down a 3rd (vi).",
      "vi is the only minor chord here: listen for the darkening.",
      "IV feels like 'lifting'; V feels like a question that wants I back."
    ],
    explain: "### Listen to the bass first\nIn most progressions the **bass note** carries the root, so hum it and hear its distance from home. Then confirm with the **quality**: I, IV and V are major; vi is minor.\n\n- **I–IV**: open, gospel/folk 'Amen' lift.\n- **I–V**: tension and release, back and forth.\n- **I–vi**: same two notes in common, darker colour.",
    concepts: ["ear-progression-strategy", "ear-functional-hearing"],
    quiz: { kind: "ear-progression", options: [
      { chart: "| I:maj | IV:maj | I:maj | IV:maj |", name: "I–IV" },
      { chart: "| I:maj | V:maj | I:maj | V:maj |", name: "I–V" },
      { chart: "| I:maj | vi:min | I:maj | vi:min |", name: "I–vi" }
    ], tempo: [60, 110] },
    vary: ["key", "tempo"]
  },

  {
    id: "ear-prog-three-chord",
    mode: "ear", category: "ear-progressions",
    tags: ["progressions", "diatonic", "I-IV-V"],
    title: "Three-chord tricks: I, IV, V (and ii)",
    level: 2, length: "short", minutes: 1,
    params: { key: "major" },
    prompt: "Four bars in **{key}**. Which order?",
    tempo: { start: 75, min: 60, max: 130, step: 5, unit: "bpm" },
    hints: [
      "Bar 2 and bar 3 are what change: hum the bass of each.",
      "V → I is the strongest arrival; IV → I is softer ('Amen').",
      "ii is minor and sits a step above I: a softer substitute for IV."
    ],
    explain: "### What to listen for\nAll four options start on I. Track the bass through bars 2–4. The cadence at the end tells you a lot: **V–I** (authentic) vs **IV–I** (plagal) vs ending *on* V (half cadence).",
    concepts: ["ear-progression-strategy", "ear-cadences"],
    quiz: { kind: "ear-progression", options: [
      { chart: "| I:maj | IV:maj | V:maj | I:maj |", name: "I–IV–V–I" },
      { chart: "| I:maj | V:maj | IV:maj | I:maj |", name: "I–V–IV–I" },
      { chart: "| I:maj | IV:maj | I:maj | V:maj |", name: "I–IV–I–V" },
      { chart: "| I:maj | ii:min | V:maj | I:maj |", name: "I–ii–V–I" }
    ], tempo: [60, 130] },
    vary: ["key", "tempo"]
  },

  {
    id: "ear-prog-pop-loops",
    mode: "ear", category: "ear-progressions",
    tags: ["progressions", "pop", "diatonic", "loops"],
    title: "Pop loops: which four-chord loop?",
    level: 2, length: "short", minutes: 1,
    params: { key: "major" },
    prompt: "A looping four-chord progression in **{key}**. Name it.",
    tempo: { start: 80, min: 70, max: 140, step: 5, unit: "bpm" },
    hints: [
      "Does it start on I or on vi? A minor first chord means vi.",
      "Where does the minor chord fall: bar 2 or bar 3?",
      "I–V–vi–IV: the bass goes 1, 5 (down a 4th), 6 (up a step), 4 (down a 3rd)."
    ],
    explain: "### The loops behind thousands of songs\n- **I–V–vi–IV**: the 'four chords' of modern pop.\n- **I–vi–IV–V**: the 50s/doo-wop loop.\n- **vi–IV–I–V**: the same chords as I–V–vi–IV, started from vi: sounds minor-ish and anthemic.\n- **I–IV–vi–V** and **I–iii–IV–V**: less common cousins.\n\nStrategy: find the minor chord(s), then use the bass to fill in the rest.",
    concepts: ["ear-progression-strategy"],
    quiz: { kind: "ear-progression", options: [
      { chart: "| I:maj | V:maj | vi:min | IV:maj |", name: "I–V–vi–IV" },
      { chart: "| I:maj | vi:min | IV:maj | V:maj |", name: "I–vi–IV–V (doo-wop)" },
      { chart: "| vi:min | IV:maj | I:maj | V:maj |", name: "vi–IV–I–V" },
      { chart: "| I:maj | IV:maj | vi:min | V:maj |", name: "I–IV–vi–V" },
      { chart: "| I:maj | iii:min | IV:maj | V:maj |", name: "I–iii–IV–V" }
    ], tempo: [70, 140] },
    vary: ["key", "tempo"]
  },

  {
    id: "ear-prog-drill-diatonic",
    mode: "ear", category: "ear-progressions",
    tags: ["progressions", "drill", "diatonic", "pop"],
    title: "Progression drill block: diatonic loops at rising tempo",
    level: 3, length: "medium", minutes: 4,
    params: { key: "major" },
    prompt: "Headphones on. A run of diatonic progressions in **{key}**, getting faster as you get them right. Name each one.",
    goal: "Name 8 in a row at 120 bpm or faster.",
    tempo: { start: 70, min: 60, max: 160, step: 5, unit: "bpm" },
    hints: [
      "At high tempos, stop tracking every chord: listen for the shape (where's the minor chord? where's V?).",
      "Hum the bass line under your breath."
    ],
    explain: "### Drill block\nA longer block to build speed. As tempo rises you lose time to work chord-by-chord, so you're forced to hear the progression as a **shape**, which is how experienced players hear.",
    concepts: ["ear-progression-strategy"],
    quiz: { kind: "ear-progression", options: [
      { chart: "| I:maj | IV:maj | V:maj | I:maj |", name: "I–IV–V–I" },
      { chart: "| I:maj | V:maj | vi:min | IV:maj |", name: "I–V–vi–IV" },
      { chart: "| I:maj | vi:min | IV:maj | V:maj |", name: "I–vi–IV–V" },
      { chart: "| vi:min | IV:maj | I:maj | V:maj |", name: "vi–IV–I–V" },
      { chart: "| I:maj | vi:min | ii:min | V:maj |", name: "I–vi–ii–V" },
      { chart: "| I:maj | iii:min | vi:min | IV:maj |", name: "I–iii–vi–IV" },
      { chart: "| ii:min | V:maj | I:maj | % |", name: "ii–V–I" },
      { chart: "| I:maj | IV:maj | ii:min | V:maj |", name: "I–IV–ii–V" }
    ], tempo: [60, 160] },
    vary: ["key", "tempo"]
  },

  {
    id: "ear-prog-cadences-major",
    mode: "ear", category: "ear-progressions",
    tags: ["progressions", "cadences"],
    title: "Cadences in major: authentic, plagal, half or deceptive?",
    level: 3, length: "short", minutes: 1,
    params: { key: "major" },
    prompt: "Listen to how the phrase **ends**. Which cadence?",
    tempo: { start: 70, min: 60, max: 120, step: 5, unit: "bpm" },
    hints: [
      "Authentic: V7 → I, a full stop.",
      "Plagal: IV → I, the 'Amen'.",
      "Half: ends ON V, a question mark. Deceptive: V7 → vi, the 'surprise' minor chord instead of home."
    ],
    explain: "### The four basic cadences\n- **Authentic (V–I)**: the strongest close. Leading tone 7 rises to 1.\n- **Plagal (IV–I)**: softer, churchy. No leading tone.\n- **Half (… –V)**: the phrase stops on the dominant, unresolved.\n- **Deceptive (V–vi)**: sets up V–I and dodges to vi. The bass rises a step (5 → 6) instead of falling to 1.\n\nFocus on the **last two chords** and the bass.",
    concepts: ["ear-cadences"],
    quiz: { kind: "ear-progression", options: [
      { chart: "| I:maj | IV:maj | V:7 | I:maj |", name: "Authentic (V7–I)" },
      { chart: "| I:maj | vi:min | IV:maj | I:maj |", name: "Plagal (IV–I)" },
      { chart: "| I:maj | vi:min | ii:min | V:maj |", name: "Half (ends on V)" },
      { chart: "| I:maj | IV:maj | V:7 | vi:min |", name: "Deceptive (V7–vi)" }
    ], tempo: [60, 120] },
    vary: ["key", "tempo"]
  },

  {
    id: "ear-prog-cadences-minor",
    mode: "ear", category: "ear-progressions",
    tags: ["progressions", "cadences", "minor", "phrygian"],
    title: "Cadences in minor, including the Phrygian half cadence",
    level: 5, length: "short", minutes: 2,
    params: { key: "minor" },
    prompt: "A phrase in **{key}**. How does it end?",
    tempo: { start: 66, min: 56, max: 110, step: 4, unit: "bpm" },
    hints: [
      "Ends on i: authentic (V7–i) or plagal (iv–i)?",
      "Ends on V: listen to the bass into it. A half-step fall b6 → 5 = Phrygian half cadence (the iv chord has its 3rd, the key's b6, in the bass).",
      "Deceptive in minor: V7 → bVI, a warm major chord instead of i."
    ],
    explain: "### Minor-key cadences\n- **Authentic**: V7 (from harmonic minor) → i.\n- **Plagal**: iv → i.\n- **Half**: ends on V.\n- **Phrygian half**: iv in 1st inversion → V. The bass falls by **half step b6 → 5** while the top voice rises. The baroque 'question' cadence, also the end of every Andalusian/flamenco descent.\n- **Deceptive**: V7 → bVI.\n\nThe Phrygian and plain half cadences differ only in the **bass** of the iv chord. Hum the bass.",
    concepts: ["ear-cadences", "ear-inversions-bass"],
    quiz: { kind: "ear-progression", options: [
      { chart: "| i:min | iv:min | V:7 | i:min |", name: "Authentic (V7–i)" },
      { chart: "| i:min | bVI:maj | iv:min | i:min |", name: "Plagal (iv–i)" },
      { chart: "| i:min | bVI:maj | iv:min | V:maj |", name: "Half (iv–V)" },
      { chart: "| i:min | bVI:maj | iv:min/b3 | V:maj |", name: "Phrygian half (iv6–V)" },
      { chart: "| i:min | iv:min | V:7 | bVI:maj |", name: "Deceptive (V7–bVI)" }
    ], tempo: [56, 110] },
    vary: ["key", "tempo"]
  },

  {
    id: "ear-prog-cadence-spectrum",
    mode: "ear", category: "ear-progressions",
    tags: ["progressions", "cadences", "jazz", "backdoor", "tritone-sub"],
    title: "Jazz cadences: ii–V, backdoor, tritone sub, minor plagal…",
    level: 6, length: "short", minutes: 2,
    params: { key: "major" },
    prompt: "Bars 1–2 set up **{key}**. How does bar 3 lead into bar 4?",
    tempo: { start: 70, min: 60, max: 140, step: 5, unit: "bpm" },
    hints: [
      "Bass into the last bar: 5 → 1 (ii–V), b2 → 1 (tritone sub), b7 → 1 (backdoor), 4 → 1 (plagal).",
      "Minor plagal (IV–iv–I): you hear a major chord darken to minor on the same bass note.",
      "Deceptive: the last chord is minor (vi), not home."
    ],
    explain: "### Many ways home\n- **ii–V–I**: bass falls in 5ths.\n- **ii–bII7–I**: tritone sub. Bass slides down chromatically 2 → b2 → 1.\n- **iv–bVII7–I (backdoor)**: borrowed from minor. Bass b7 → 1 rises a whole step; warm and nostalgic.\n- **IV–iv–I (minor plagal)**: the 'tearjerker' cadence; the 3rd of IV drops a half step.\n- **ii–V–vi**: deceptive.\n- **ending on V**: half cadence.",
    concepts: ["ear-cadences", "ear-tritone-sub", "ear-modal-interchange"],
    quiz: { kind: "ear-progression", options: [
      { chart: "| I:maj7 | vi:m7 | ii:m7 V:7 | I:maj7 |", name: "ii–V–I (authentic)" },
      { chart: "| I:maj7 | vi:m7 | ii:m7 bII:7 | I:maj7 |", name: "ii–bII7–I (tritone sub)" },
      { chart: "| I:maj7 | vi:m7 | iv:m7 bVII:7 | I:maj7 |", name: "iv–bVII7–I (backdoor)" },
      { chart: "| I:maj7 | vi:m7 | IV:maj7 iv:m6 | I:maj7 |", name: "IV–iv–I (minor plagal)" },
      { chart: "| I:maj7 | vi:m7 | ii:m7 V:7 | vi:m7 |", name: "ii–V–vi (deceptive)" },
      { chart: "| I:maj7 | vi:m7 | ii:m7 | V:7 |", name: "Half cadence (ends on V7)" }
    ], tempo: [60, 140] },
    vary: ["key", "tempo"]
  },

  {
    id: "ear-prog-minor-loops",
    mode: "ear", category: "ear-progressions",
    tags: ["progressions", "minor", "loops", "andalusian", "dorian"],
    title: "Minor-key loops: Andalusian, Aeolian, Dorian…",
    level: 3, length: "short", minutes: 1,
    params: { key: "minor" },
    prompt: "A minor-key progression in **{key}**. Which one?",
    tempo: { start: 75, min: 60, max: 140, step: 5, unit: "bpm" },
    hints: [
      "Andalusian: the bass walks straight down 1 – b7 – b6 – 5.",
      "Dorian vamp: i to a MAJOR IV. Bright, Santana/'Oye Como Va' world.",
      "Harmonic-minor V: a major chord on 5 with a leading tone that screams back to i."
    ],
    explain: "### Minor colours\n- **i–bVII–bVI–V** (Andalusian): flamenco, surf, 'Hit the Road Jack'-type descents.\n- **i–bVI–bIII–bVII**: modern minor pop.\n- **i–iv–v–i**: pure Aeolian, folky (minor v, no leading tone).\n- **i–iv–V–i**: harmonic minor, classical.\n- **i–IV**: Dorian vamp (major IV = the raised 6th).\n- **i–bIII–IV–bVI**: the House of the Rising Sun opening (trad. progression).\n\nThe key distinctions are **major or minor IV** (Dorian vs Aeolian) and **major or minor V** (harmonic vs natural minor).",
    concepts: ["ear-progression-strategy", "ear-mode-colors"],
    quiz: { kind: "ear-progression", options: [
      { chart: "| i:min | bVII:maj | bVI:maj | V:maj |", name: "i–bVII–bVI–V (Andalusian)" },
      { chart: "| i:min | bVI:maj | bIII:maj | bVII:maj |", name: "i–bVI–bIII–bVII" },
      { chart: "| i:min | iv:min | v:min | i:min |", name: "i–iv–v–i (Aeolian)" },
      { chart: "| i:min | iv:min | V:maj | i:min |", name: "i–iv–V–i (harmonic minor)" },
      { chart: "| i:min | IV:maj | i:min | IV:maj |", name: "i–IV (Dorian vamp)" },
      { chart: "| i:min | bIII:maj | IV:maj | bVI:maj |", name: "i–bIII–IV–bVI (Rising Sun)" }
    ], tempo: [60, 140] },
    vary: ["key", "tempo"]
  },

  {
    id: "ear-prog-blues-forms",
    mode: "ear", category: "ear-progressions",
    tags: ["progressions", "blues", "12-bar", "form"],
    title: "Which 12-bar blues?",
    level: 4, length: "medium", minutes: 3,
    params: { key: "major" },
    prompt: "A full 12-bar chorus in **{key}**. Which version of the blues?",
    tempo: { start: 90, min: 70, max: 160, step: 5, unit: "bpm" },
    hints: [
      "Bar 2: does it go to IV (quick change) or stay on I?",
      "Bars 8–10: V–IV (basic) or VI7–ii–V (jazzier)?",
      "Minor blues: the I chord is minor and bar 9 is bVI7, not V."
    ],
    explain: "### Blues landmarks\nListen at the **landmark bars**: bar 2 (quick change?), bar 5 (IV), bar 6 (#iv°7 in jazz blues), bars 8–10 (turnaround into V or via VI7–ii–V) and bars 11–12 (turnaround).",
    concepts: ["ear-progression-strategy", "ear-secondary-dominants"],
    quiz: { kind: "ear-progression", options: [
      { chart: "| I:7 | % | % | % | IV:7 | % | I:7 | % | V:7 | IV:7 | I:7 | V:7 |", name: "Basic 12-bar" },
      { chart: "| I:7 | IV:7 | I:7 | % | IV:7 | % | I:7 | % | V:7 | IV:7 | I:7 | V:7 |", name: "Quick-change 12-bar" },
      { chart: "| I:7 | IV:7 | I:7 | % | IV:7 | % | I:7 | VI:7 | ii:m7 | V:7 | I:7 | V:7 |", name: "12-bar with ii–V turnaround" },
      { chart: "| I:7 | IV:7 | I:7 | v:m7 I:7 | IV:7 | #iv:dim7 | I:7 | VI:7 | ii:m7 | V:7 | I:7 VI:7 | ii:m7 V:7 |", name: "Jazz blues" },
      { chart: "| i:m7 | % | % | % | iv:m7 | % | i:m7 | % | bVI:7 | V:7 | i:m7 | V:7 |", name: "Minor blues" }
    ], tempo: [70, 160] },
    vary: ["key", "tempo"]
  },

  {
    id: "ear-prog-ii-V-I",
    mode: "ear", category: "ear-progressions",
    tags: ["progressions", "ii-v-i", "jazz"],
    title: "Hearing ii–V–I and its neighbours",
    level: 4, length: "short", minutes: 1,
    params: { key: "major" },
    prompt: "Seventh-chord progression in **{key}**. Which one?",
    tempo: { start: 70, min: 60, max: 140, step: 5, unit: "bpm" },
    hints: [
      "ii–V–I: bass falls in 5ths (2 → 5 → 1); chord qualities m7 → 7 → maj7.",
      "IV–V–I: first chord is a bright maj7, not a mellow m7.",
      "ii–V–vi: the V resolves to a minor chord: deceptive."
    ],
    explain: "### The ii–V–I sound\nThe engine of jazz harmony. Two things identify it: the **bass moving in 5ths** and the **quality sequence m7 → 7 → maj7**. Compare with IV–V–I (pop/rock) and the deceptive ii–V–vi.",
    concepts: ["ear-progression-strategy", "ear-cadences"],
    quiz: { kind: "ear-progression", options: [
      { chart: "| ii:m7 | V:7 | I:maj7 | % |", name: "ii–V–I" },
      { chart: "| IV:maj7 | V:7 | I:maj7 | % |", name: "IV–V–I" },
      { chart: "| ii:m7 | V:7 | vi:m7 | % |", name: "ii–V–vi (deceptive)" },
      { chart: "| vi:m7 | ii:m7 | V:7 | I:maj7 |", name: "vi–ii–V–I" }
    ], tempo: [60, 140] },
    vary: ["key", "tempo"]
  },

  {
    id: "ear-prog-major-minor-ii-V",
    mode: "ear", category: "ear-progressions",
    tags: ["progressions", "ii-v-i", "minor", "jazz"],
    title: "Major or minor ii–V? And where does it land?",
    level: 5, length: "short", minutes: 1,
    params: { key: "major" },
    prompt: "A ii–V and its resolution. Is the ii–V **major or minor**, and is the target **major or minor**?",
    tempo: { start: 70, min: 60, max: 150, step: 5, unit: "bpm" },
    hints: [
      "Minor ii–V: ii is half-diminished (dark, tense) and V7 has a b9.",
      "Major ii–V: ii is a smooth m7, V is a plain 7.",
      "Then listen to the target: bright maj7 or dark m7?"
    ],
    explain: "### Two independent questions\n1. **The approach**: m7–7 (major) or m7b5–7b9 (minor)? The m7b5's darkened 5th and the V's b9 are the tells.\n2. **The arrival**: maj7 or m7?\n\nThe mixed versions (minor ii–V to major I, major ii–V to minor i) are everywhere in standards. Hearing them separately is what lets you follow tunes that tonicise new keys.",
    concepts: ["ear-progression-strategy", "ear-diminished-family"],
    quiz: { kind: "ear-progression", options: [
      { chart: "| ii:m7 V:7 | I:maj7 | % |", name: "Major ii–V → major I" },
      { chart: "| ii:m7b5 V:7b9 | i:m7 | % |", name: "Minor ii–V → minor i" },
      { chart: "| ii:m7 V:7 | i:m7 | % |", name: "Major ii–V → minor i" },
      { chart: "| ii:m7b5 V:7b9 | I:maj7 | % |", name: "Minor ii–V → major I" }
    ], tempo: [60, 150] },
    vary: ["key", "tempo"]
  },

  {
    id: "ear-prog-turnarounds",
    mode: "ear", category: "ear-progressions",
    tags: ["progressions", "turnarounds", "rhythm-changes", "jazz"],
    title: "Two-bar turnarounds",
    level: 5, length: "short", minutes: 1,
    params: { key: "major" },
    prompt: "A two-bar turnaround in **{key}**, looped. Which one?",
    tempo: { start: 80, min: 60, max: 180, step: 5, unit: "bpm" },
    hints: [
      "Chord 2 decides most of these: vi (minor), VI7 (dominant), #i°7 (diminished) or bIII7 (chromatic).",
      "If chord 1 is minor, it's iii, not I.",
      "bIII7 → ii and bII7 → I: everything slides down by half steps."
    ],
    explain: "### Turnarounds\nThe I–vi–ii–V family in its common disguises:\n- **I–vi–ii–V**: diatonic.\n- **I–VI7–ii–V**: VI7 is V7/ii: same root as vi, but with a major 3rd that pulls to ii.\n- **iii–VI7–ii–V**: iii replaces I (same function).\n- **I–#i°7–ii–V**: passing diminished, bass climbs chromatically 1 → #1 → 2.\n- **I–bIII7–ii–bII7**: tritone subs, chromatic descent (the 'Lady Bird' turnaround).",
    concepts: ["ear-secondary-dominants", "ear-tritone-sub", "ear-diminished-family"],
    quiz: { kind: "ear-progression", options: [
      { chart: "| I:maj7 vi:m7 | ii:m7 V:7 |", name: "I–vi–ii–V" },
      { chart: "| I:maj7 VI:7 | ii:m7 V:7 |", name: "I–VI7–ii–V" },
      { chart: "| iii:m7 VI:7 | ii:m7 V:7 |", name: "iii–VI7–ii–V" },
      { chart: "| I:maj7 #i:dim7 | ii:m7 V:7 |", name: "I–#i°7–ii–V" },
      { chart: "| I:maj7 bIII:7 | ii:m7 bII:7 |", name: "I–bIII7–ii–bII7" }
    ], tempo: [60, 180] },
    vary: ["key", "tempo"]
  },

  {
    id: "ear-prog-secondary-dominants",
    mode: "ear", category: "ear-progressions",
    tags: ["progressions", "secondary-dominants"],
    title: "Secondary dominants: which chord is being tonicised?",
    level: 5, length: "short", minutes: 2,
    params: { key: "major" },
    prompt: "Bar 2 may be a **secondary dominant**. Which progression?",
    tempo: { start: 70, min: 60, max: 140, step: 5, unit: "bpm" },
    hints: [
      "A secondary dominant is a major-3rd surprise: a chord you expect to be minor (or major 7) turns into a dominant 7.",
      "Find its root, then ask: what chord is a 5th below it? That's the target.",
      "V7/IV = I7 (the tonic grows a b7). V7/V = II7 (a major II chord)."
    ],
    explain: "### What to listen for\nA secondary dominant brings a **non-diatonic note** (usually a raised note acting as a temporary leading tone): VI7 contains #1, II7 contains #4, III7 contains #5, I7 contains b7. That chromatic note is the thing to listen for, along with the bass falling a 5th into the target.",
    concepts: ["ear-secondary-dominants"],
    quiz: { kind: "ear-progression", options: [
      { chart: "| I:maj7 | vi:m7 | ii:m7 | V:7 |", name: "I–vi–ii–V (diatonic)" },
      { chart: "| I:maj7 | V/ii:7 | ii:m7 | V:7 |", name: "I–V7/ii–ii–V" },
      { chart: "| I:maj7 | V/IV:7 | IV:maj7 | V:7 |", name: "I–V7/IV–IV–V" },
      { chart: "| I:maj7 | V/V:7 | V:7 | I:maj7 |", name: "I–V7/V–V–I" },
      { chart: "| I:maj7 | V/vi:7 | vi:m7 | V:7 |", name: "I–V7/vi–vi–V" }
    ], tempo: [60, 140] },
    vary: ["key", "tempo"]
  },

  {
    id: "ear-prog-dominant-chains",
    mode: "ear", category: "ear-progressions",
    tags: ["progressions", "secondary-dominants", "cycle", "rhythm-changes"],
    title: "Cycle of 5ths: dominants or minor 7ths?",
    level: 6, length: "short", minutes: 2,
    params: { key: "major" },
    prompt: "Roots move III → VI → II → V → I. Which chords are **dominant 7ths** and which are **minor 7ths**?",
    tempo: { start: 70, min: 60, max: 160, step: 5, unit: "bpm" },
    hints: [
      "The roots are identical in every option: only the 3rds change.",
      "Listen to each chord's 3rd: dominant = bright and pulling, m7 = mellow.",
      "All-dominant = the rhythm-changes bridge sound."
    ],
    explain: "### Same roots, different qualities\nWhen roots move in 5ths, each chord can be diatonic (m7) or a secondary dominant (7). The all-dominant version is the sound of the rhythm-changes bridge and of many ragtime/swing tunes. This card trains you to hear the 3rd of each chord as it goes by.",
    concepts: ["ear-secondary-dominants"],
    quiz: { kind: "ear-progression", options: [
      { chart: "| III:7 | VI:7 | II:7 | V:7 | I:maj7 |", name: "III7–VI7–II7–V7–I (all dominants)" },
      { chart: "| iii:m7 | vi:m7 | ii:m7 | V:7 | I:maj7 |", name: "iii–vi–ii–V–I (diatonic)" },
      { chart: "| iii:m7 | VI:7 | ii:m7 | V:7 | I:maj7 |", name: "iii–VI7–ii–V–I" },
      { chart: "| III:7 | vi:m7 | II:7 | V:7 | I:maj7 |", name: "III7–vi–II7–V–I" }
    ], tempo: [60, 160] },
    vary: ["key", "tempo"]
  },

  {
    id: "ear-prog-tritone-subs",
    mode: "ear", category: "ear-progressions",
    tags: ["progressions", "tritone-sub", "backdoor", "jazz"],
    title: "Tritone subs vs backdoor vs straight ii–V",
    level: 6, length: "short", minutes: 1,
    params: { key: "major" },
    prompt: "A cadence into **{key}**. Which approach?",
    tempo: { start: 70, min: 60, max: 150, step: 5, unit: "bpm" },
    hints: [
      "Straight: bass 2 → 5 → 1.",
      "Tritone sub: bass 2 → b2 → 1 (chromatic descent). Subbed ii–V: b6 → b2 → 1.",
      "Backdoor: bass 4 → b7 → 1. The last step RISES a whole step."
    ],
    explain: "### Three dominant functions\nA tritone sub (bII7) shares the 3rd and b7 of V7 (swapped), so it resolves the same way, but the bass slides by half step. The backdoor bVII7 comes from the parallel minor and resolves up a whole step: softer, gospel/Beatles-ish. **The bass tells you which one.**",
    concepts: ["ear-tritone-sub", "ear-modal-interchange"],
    quiz: { kind: "ear-progression", options: [
      { chart: "| ii:m7 | V:7 | I:maj7 | % |", name: "ii–V–I" },
      { chart: "| ii:m7 | bII:7 | I:maj7 | % |", name: "ii–bII7–I (tritone sub)" },
      { chart: "| bvi:m7 | bII:7 | I:maj7 | % |", name: "bvi–bII7–I (subbed ii–V)" },
      { chart: "| iv:m7 | bVII:7 | I:maj7 | % |", name: "iv–bVII7–I (backdoor)" }
    ], tempo: [60, 150] },
    vary: ["key", "tempo"]
  },

  {
    id: "ear-prog-borrowed-basic",
    mode: "ear", category: "ear-progressions",
    tags: ["progressions", "modal-interchange", "borrowed"],
    title: "Borrowed chords: IV, iv, bVII or bVI?",
    level: 4, length: "short", minutes: 1,
    params: { key: "major" },
    prompt: "I → ? → I. Is the middle chord **IV, iv, bVII or bVI**?",
    tempo: { start: 70, min: 60, max: 120, step: 5, unit: "bpm" },
    hints: [
      "iv: same bass as IV but the chord turns minor. Bittersweet.",
      "bVII: bass goes DOWN a whole step. Rock/Mixolydian swagger.",
      "bVI: bass goes down a major 3rd to a big, dark major chord. Epic/film."
    ],
    explain: "### Modal interchange\nBorrowed chords come from the **parallel minor** (or another mode on the same tonic). Each one brings a 'dark' note into the major key: iv brings **b6**, bVII brings **b7**, bVI brings **b6 and b3**. Listen for the moment the colour darkens without the key changing.",
    concepts: ["ear-modal-interchange"],
    quiz: { kind: "ear-progression", options: [
      { chart: "| I:maj | IV:maj | I:maj | % |", name: "I–IV–I (diatonic)" },
      { chart: "| I:maj | iv:min | I:maj | % |", name: "I–iv–I (minor iv)" },
      { chart: "| I:maj | bVII:maj | I:maj | % |", name: "I–bVII–I" },
      { chart: "| I:maj | bVI:maj | I:maj | % |", name: "I–bVI–I" }
    ], tempo: [60, 120] },
    vary: ["key", "tempo"]
  },

  {
    id: "ear-prog-borrowed-loops",
    mode: "ear", category: "ear-progressions",
    tags: ["progressions", "modal-interchange", "borrowed", "rock"],
    title: "Borrowed-chord progressions: Mixolydian, Aeolian, Phrygian colours",
    level: 5, length: "short", minutes: 1,
    params: { key: "major" },
    prompt: "A major-key progression in **{key}** with (maybe) a borrowed chord. Which one?",
    tempo: { start: 75, min: 60, max: 140, step: 5, unit: "bpm" },
    hints: [
      "bII: the bass slips down only a half step to a major chord. Exotic, Phrygian.",
      "bVI–bVII–I: the 'heroic' rising cadence, bass b6 → b7 → 1.",
      "bIII: a major chord a minor 3rd up. Bluesy rock."
    ],
    explain: "### Borrowed-chord vocabulary\n- **I–bVII–IV–I**: Mixolydian rock (double plagal).\n- **I–IV–iv–I**: the minor-plagal tearjerker.\n- **I–bVI–bVII–I**: Aeolian 'victory' cadence.\n- **I–bII–I**: Phrygian, flamenco/metal.\n- **I–bIII–IV–I**: blues-rock.\n- **I–ii–IV–I**: all diatonic (the control).",
    concepts: ["ear-modal-interchange"],
    quiz: { kind: "ear-progression", options: [
      { chart: "| I:maj | bVII:maj | IV:maj | I:maj |", name: "I–bVII–IV–I (Mixolydian)" },
      { chart: "| I:maj | IV:maj | iv:min | I:maj |", name: "I–IV–iv–I (minor plagal)" },
      { chart: "| I:maj | bVI:maj | bVII:maj | I:maj |", name: "I–bVI–bVII–I (Aeolian cadence)" },
      { chart: "| I:maj | bII:maj | I:maj | % |", name: "I–bII–I (Phrygian)" },
      { chart: "| I:maj | bIII:maj | IV:maj | I:maj |", name: "I–bIII–IV–I" },
      { chart: "| I:maj | ii:min | IV:maj | I:maj |", name: "I–ii–IV–I (diatonic)" }
    ], tempo: [60, 140] },
    vary: ["key", "tempo"]
  },

  {
    id: "ear-prog-borrowed-jazz",
    mode: "ear", category: "ear-progressions",
    tags: ["progressions", "modal-interchange", "jazz", "backdoor"],
    title: "Modal interchange with 7th chords",
    level: 7, length: "short", minutes: 2,
    params: { key: "major" },
    prompt: "Seventh-chord progressions in **{key}** that borrow from minor (or further). Which one?",
    tempo: { start: 70, min: 60, max: 140, step: 5, unit: "bpm" },
    hints: [
      "Count chromatic notes: iv:m6 brings b6; bVImaj7 brings b6 and b3; bIImaj7 brings b2 and b6.",
      "Minor ii–V into a MAJOR I: dark approach, bright arrival.",
      "Chromatic planing (I–bIII–bVI–bII): every chord is a maj7."
    ],
    explain: "### Advanced interchange\nJazz uses the whole parallel minor (and Phrygian) as a chord source. A useful habit: name the **borrowed note** each chord adds. bVI maj7 and the backdoor are close cousins (both lead to I by stepwise bass), but bVImaj7 sounds dreamy, the backdoor bluesy.",
    concepts: ["ear-modal-interchange", "ear-cadences"],
    quiz: { kind: "ear-progression", options: [
      { chart: "| I:maj7 | bVI:maj7 | bVII:7 | I:maj7 |", name: "I–bVImaj7–bVII7–I" },
      { chart: "| I:maj7 | iv:m7 | bVII:7 | I:maj7 |", name: "I–iv7–bVII7–I (backdoor)" },
      { chart: "| I:maj7 | IV:maj7 | iv:m6 | I:maj7 |", name: "I–IV–iv6–I" },
      { chart: "| I:maj7 | bII:maj7 | I:maj7 | % |", name: "I–bIImaj7–I (Phrygian/Neapolitan)" },
      { chart: "| I:maj7 | ii:m7b5 | V:7b9 | I:maj7 |", name: "I–iiø–V7b9–I (minor ii–V to major)" },
      { chart: "| I:maj7 | bIII:maj7 | bVI:maj7 | bII:maj7 |", name: "I–bIII–bVI–bII (maj7 planing)" }
    ], tempo: [60, 140] },
    vary: ["key", "tempo"]
  },

  {
    id: "ear-prog-passing-diminished",
    mode: "ear", category: "ear-progressions",
    tags: ["progressions", "diminished", "passing-chords"],
    title: "Passing diminished chords",
    level: 6, length: "short", minutes: 1,
    params: { key: "major" },
    prompt: "Listen for the diminished 7th (or its stand-in). Which progression?",
    tempo: { start: 70, min: 60, max: 140, step: 5, unit: "bpm" },
    hints: [
      "Ascending passing dim: bass rises by half step into the next chord (1 → #1 → 2).",
      "Descending passing dim: bass falls by half step (3 → b3 → 2).",
      "Common-tone dim: the bass doesn't move at all; the chord just flickers and returns."
    ],
    explain: "### Three jobs for dim7\n- **Ascending passing** (#i°7 → ii): a rootless VI7b9, i.e. V7/ii in disguise.\n- **Descending passing** (biii°7 → ii): chromatic bass walking down.\n- **#iv°7 → I/5**: the gospel/classic 'lift' back into the tonic.\n- **Common-tone** (I°7 → I): ornaments the tonic over a static bass.\n\nHear the dim7 by its **symmetry** (all minor 3rds), then use the **bass** to tell which job it's doing.",
    concepts: ["ear-diminished-family", "ear-secondary-dominants"],
    quiz: { kind: "ear-progression", options: [
      { chart: "| I:maj7 | #i:dim7 | ii:m7 | V:7 |", name: "I–#i°7–ii–V (ascending)" },
      { chart: "| I:maj7 | VI:7 | ii:m7 | V:7 |", name: "I–VI7–ii–V (no dim)" },
      { chart: "| iii:m7 | biii:dim7 | ii:m7 | V:7 |", name: "iii–biii°7–ii–V (descending)" },
      { chart: "| IV:maj7 | #iv:dim7 | I:maj/5 | V:7 |", name: "IV–#iv°7–I/5–V" },
      { chart: "| I:maj7 | I:dim7 | I:maj7 | % |", name: "I–I°7–I (common-tone)" }
    ], tempo: [60, 140] },
    vary: ["key", "tempo"]
  },

  {
    id: "ear-prog-chromatic-mediants",
    mode: "ear", category: "ear-progressions",
    tags: ["progressions", "chromatic-mediants", "film"],
    title: "Chromatic mediants: the film-score sound",
    level: 7, length: "short", minutes: 1,
    params: { key: "major" },
    prompt: "I → a major chord a 3rd away → I. Which one: **bVI, III, bIII or VI**? (Or plain vi?)",
    tempo: { start: 60, min: 50, max: 100, step: 5, unit: "bpm" },
    hints: [
      "Bass down a M3 = bVI; up a M3 = III; up a m3 = bIII; down a m3 = VI or vi.",
      "VI vs vi: same root, but VI is major: listen for the #1 in it.",
      "Mediants share one common tone with I; listen for the note that stays."
    ],
    explain: "### Chromatic mediants\nMajor chords whose roots are a 3rd from the tonic. They share one note with I and shift the others by half steps: magical, cinematic (John Williams, Hans Zimmer and 19th-century Romantics). The skill is hearing **bass distance** (M3 vs m3, up vs down) plus **quality**.",
    concepts: ["ear-modal-interchange", "ear-progression-strategy"],
    quiz: { kind: "ear-progression", options: [
      { chart: "| I:maj | bVI:maj | I:maj | % |", name: "I–bVI–I" },
      { chart: "| I:maj | III:maj | I:maj | % |", name: "I–III–I" },
      { chart: "| I:maj | bIII:maj | I:maj | % |", name: "I–bIII–I" },
      { chart: "| I:maj | VI:maj | I:maj | % |", name: "I–VI–I" },
      { chart: "| I:maj | vi:min | I:maj | % |", name: "I–vi–I (diatonic)" }
    ], tempo: [50, 100] },
    vary: ["key", "tempo"]
  },

  {
    id: "ear-prog-relative-ii-Vs",
    mode: "ear", category: "ear-progressions",
    tags: ["progressions", "ii-v-i", "minor", "standards", "form"],
    title: "Relative major and minor ii–Vs (Autumn Leaves type)",
    level: 7, length: "medium", minutes: 3,
    params: { key: "major" },
    prompt: "Eight bars in **{key}**, mixing ii–Vs to I and to its relative minor vi. Which form?",
    tempo: { start: 80, min: 60, max: 180, step: 5, unit: "bpm" },
    hints: [
      "Listen for the half-diminished chord: it marks the minor ii–V to vi.",
      "Bar 4: IVmaj7 (bright) or vi (minor)?",
      "Does the progression start with the major or the minor ii–V?"
    ],
    explain: "### Two key centres, one key signature\nMany standards (Autumn Leaves, Fly Me to the Moon-type progressions) alternate a **major ii–V–I** (to I) with a **minor ii–V–i** (to vi). The tell is the **m7b5 → 7** pair: that's the minor ii–V. Track which centre each four-bar phrase lands on.",
    concepts: ["ear-progression-strategy", "ear-diminished-family"],
    quiz: { kind: "ear-progression", options: [
      { chart: "| ii:m7 | V:7 | I:maj7 | IV:maj7 | vii:m7b5 | III:7 | vi:m7 | % |", name: "ii–V–I–IV | viiø–III7–vi (Autumn Leaves type)" },
      { chart: "| ii:m7 | V:7 | I:maj7 | IV:maj7 | ii:m7 | V:7 | I:maj7 | % |", name: "ii–V–I–IV | ii–V–I" },
      { chart: "| ii:m7 | V:7 | I:maj7 | vi:m7 | vii:m7b5 | III:7 | vi:m7 | % |", name: "ii–V–I–vi | viiø–III7–vi" },
      { chart: "| vii:m7b5 | III:7 | vi:m7 | % | ii:m7 | V:7 | I:maj7 | % |", name: "viiø–III7–vi | ii–V–I (minor first)" }
    ], tempo: [60, 180] },
    vary: ["key", "tempo"]
  },

  {
    id: "ear-prog-dominant-colours",
    mode: "ear", category: "ear-progressions",
    tags: ["progressions", "altered", "dominant", "extensions"],
    title: "Same ii–V–I, different dominant colour",
    level: 8, length: "short", minutes: 2,
    params: { key: "major" },
    prompt: "ii9 → **V?** → Imaj9. What colour is the dominant?",
    tempo: { start: 66, min: 56, max: 120, step: 4, unit: "bpm" },
    hints: [
      "13: sweet, inside. 13b9: sweet top with a dark rub. 7#9b13: fully altered, bluesy-dark.",
      "bII7#11: the bass slides down a half step: it's a tritone sub, and its #11 is the V's root.",
      "9sus4: no 3rd: the V floats and the resolution is soft."
    ],
    explain: "### Hearing tensions in context\nIn isolation altered chords can blur; in a ii–V–I the dominant's colour stands out against the consonant ii and I. Each colour implies a scale: **13** → Mixolydian, **13b9** → half-whole diminished, **7#9b13** → altered, **bII7#11** → Lydian dominant on bII (= altered on V), **9sus4** → Mixolydian sus.",
    concepts: ["ear-altered-dominants", "ear-tritone-sub", "ear-upper-structures"],
    quiz: { kind: "ear-progression", options: [
      { chart: "| ii:m9 | V:13 | I:maj9 | % |", name: "V13 (Mixolydian)" },
      { chart: "| ii:m9 | V:13b9 | I:maj9 | % |", name: "V13b9 (diminished)" },
      { chart: "| ii:m9 | V:7#9b13 | I:maj9 | % |", name: "V7#9b13 (altered)" },
      { chart: "| ii:m9 | bII:7#11 | I:maj9 | % |", name: "bII7#11 (tritone sub)" },
      { chart: "| ii:m9 | V:9sus4 | I:maj9 | % |", name: "V9sus4" }
    ], tempo: [56, 120] },
    vary: ["key", "tempo"]
  },

  {
    id: "ear-prog-coltrane-subs",
    mode: "ear", category: "ear-progressions",
    tags: ["progressions", "coltrane", "jazz", "reharmonisation"],
    title: "Reharmonised ii–V–I: Coltrane, tritone or backdoor?",
    level: 8, length: "short", minutes: 2,
    params: { key: "major" },
    prompt: "Four bars that end on I in **{key}**. Plain ii–V–I, or one of its reharmonisations?",
    tempo: { start: 66, min: 56, max: 160, step: 4, unit: "bpm" },
    hints: [
      "Coltrane sub: you hear three bright maj7 'arrivals' in quick succession, each a major 3rd apart.",
      "Count dominant 7ths: Coltrane sub has three (bIII7, VII7, V7).",
      "Backdoor ends with a whole-step rise in the bass; tritone sub with a half-step fall."
    ],
    explain: "### The Coltrane substitution\nColtrane ('Countdown', 'Tune Up' reharmonised) fills a ii–V–I with **three key centres a major 3rd apart** (I, bVI, III), each approached by its own V7. By ear it sounds like the harmony is spinning, then snapping back home. The tells: **bright maj7 arrivals** and **bass leaps** instead of steps or 5ths.",
    concepts: ["ear-coltrane-changes", "ear-tritone-sub"],
    quiz: { kind: "ear-progression", options: [
      { chart: "| ii:m7 | % | V:7 | I:maj7 |", name: "Plain ii–V–I" },
      { chart: "| ii:m7 bIII:7 | bVI:maj7 VII:7 | III:maj7 V:7 | I:maj7 |", name: "Coltrane substitution (Countdown type)" },
      { chart: "| ii:m7 | % | bII:7 | I:maj7 |", name: "ii–bII7–I (tritone sub)" },
      { chart: "| iv:m7 | % | bVII:7 | I:maj7 |", name: "iv–bVII7–I (backdoor)" },
      { chart: "| ii:m7 V:7 | iii:m7 VI:7 | ii:m7 V:7 | I:maj7 |", name: "Extended turnaround" }
    ], tempo: [56, 160] },
    vary: ["key", "tempo"]
  },

  {
    id: "ear-prog-giant-steps",
    mode: "ear", category: "ear-progressions",
    tags: ["progressions", "coltrane", "giant-steps", "major-thirds"],
    title: "Major-third cycles: Giant Steps and friends",
    level: 9, length: "medium", minutes: 3,
    params: { key: "major" },
    prompt: "Key centres moving by **major 3rds**, or not. Which progression?",
    tempo: { start: 60, min: 50, max: 240, step: 5, unit: "bpm" },
    hints: [
      "Giant Steps opening: I → bIII7 → bVI → VII7 → III: arrivals keep dropping a major 3rd.",
      "With ii–Vs: each new key is approached by a m7–7 pair, so it sounds smoother.",
      "The plain turnaround never leaves the key: all roots move in 5ths."
    ],
    explain: "### Hearing Coltrane changes\nThe octave divided into three equal parts (augmented triad of key centres: e.g. B, G, Eb). By ear: **every arrival is a bright maj7, and they don't relate by 5ths**. The V7 chords between them make each move feel like a mini-cadence. Start slow; the real tune is played at 240+ bpm.",
    concepts: ["ear-coltrane-changes"],
    quiz: { kind: "ear-progression", options: [
      { chart: "| I:maj7 bIII:7 | bVI:maj7 VII:7 | III:maj7 | % |", name: "Giant Steps opening (I–bIII7–bVI–VII7–III)" },
      { chart: "| I:maj7 bIII:7 | bVI:maj7 VII:7 | III:maj7 V:7 | I:maj7 |", name: "Full Coltrane cycle back to I" },
      { chart: "| I:maj7 | bVII:m7 bIII:7 | bVI:maj7 | #iv:m7 VII:7 | III:maj7 | ii:m7 V:7 | I:maj7 | % |", name: "Major-third keys via ii–Vs" },
      { chart: "| I:maj7 VI:7 | ii:m7 V:7 | iii:m7 VI:7 | ii:m7 V:7 |", name: "Plain turnaround (control)" }
    ], tempo: [50, 240] },
    vary: ["key", "tempo"]
  },

  {
    id: "ear-prog-drill-jazz",
    mode: "ear", category: "ear-progressions",
    tags: ["progressions", "drill", "jazz", "reharmonisation"],
    title: "Progression drill block: jazz harmony marathon",
    level: 8, length: "medium", minutes: 5,
    params: { key: "major" },
    prompt: "Headphones on. A long run of jazz progressions in **{key}**, faster as you succeed: secondary dominants, tritone subs, backdoor, minor ii–Vs, passing diminished.",
    goal: "Name 10 in a row at 160 bpm or faster.",
    tempo: { start: 70, min: 60, max: 200, step: 5, unit: "bpm" },
    hints: [
      "Listen in layers: bass motion (5ths, half steps, whole steps), then the quality of the chord before the arrival.",
      "Chromatic bass descent → tritone sub. Whole-step rise into I → backdoor. Half-step rise → passing dim."
    ],
    explain: "### Drill block\nEverything from the jazz cards in one pool. Keys are random. The aim is fluency: hearing a progression once, at tempo, and knowing it.",
    concepts: ["ear-progression-strategy", "ear-secondary-dominants", "ear-tritone-sub", "ear-modal-interchange"],
    quiz: { kind: "ear-progression", options: [
      { chart: "| ii:m7 | V:7 | I:maj7 | % |", name: "ii–V–I" },
      { chart: "| ii:m7 | bII:7 | I:maj7 | % |", name: "ii–bII7–I" },
      { chart: "| iv:m7 | bVII:7 | I:maj7 | % |", name: "Backdoor" },
      { chart: "| ii:m7b5 | V:7b9 | i:m7 | % |", name: "Minor ii–V–i" },
      { chart: "| I:maj7 VI:7 | ii:m7 V:7 |", name: "I–VI7–ii–V" },
      { chart: "| I:maj7 #i:dim7 | ii:m7 V:7 |", name: "I–#i°7–ii–V" },
      { chart: "| I:maj7 | V/IV:7 | IV:maj7 | iv:m6 |", name: "I–I7–IV–iv" },
      { chart: "| I:maj7 bIII:7 | ii:m7 bII:7 |", name: "I–bIII7–ii–bII7" }
    ], tempo: [60, 200] },
    vary: ["key", "tempo"]
  },

  // =====================================================================================
  // EAR-FUNCTIONAL — scale degrees over a cadence (Benbassat / Arnold "one note" method),
  // modes by characteristic note, and bass lines.
  // Degree order: 1 3 5 → lower tetrachord → upper tetrachord → all diatonic → minor →
  // chromatic in the order b3, b7, b6, #4, b2 (functional-ear-training order).
  // =====================================================================================

  {
    id: "ear-deg-135",
    mode: "ear", category: "ear-functional",
    tags: ["functional", "scale-degrees", "cadence", "beginner"],
    title: "Scale degrees: 1, 3 or 5?",
    level: 1, length: "short", minutes: 1,
    params: { key: "major" },
    prompt: "A cadence sets up **{key}**, then one note sounds. Is it **1, 3 or 5**?",
    hints: [
      "Sing the note, then sing down the scale to the tonic. How many steps?",
      "1 = total rest. 3 = sweet, settled but not 'final'. 5 = strong, open, could go anywhere.",
      "Wait for the cadence to fade before answering. Let the key sink in."
    ],
    explain: "### Functional hearing\nInstead of measuring distance from the previous note, you hear **each note's role in the key**. After a cadence, every degree has a personality: 1 is home, 5 is stable but 'up in the air', 3 is the sweet middle of the tonic chord.\n\nThe Benbassat method: hear the cadence, hear the note, then **sing it home to 1** (5-4-3-2-1 or 3-2-1). The resolution is what trains the ear.",
    concepts: ["ear-functional-hearing"],
    quiz: { kind: "ear-degree", degrees: ["1", "3", "5"], scale: "major", cadence: true },
    vary: ["key"]
  },

  {
    id: "ear-deg-lower-tetrachord",
    mode: "ear", category: "ear-functional",
    tags: ["functional", "scale-degrees", "cadence"],
    title: "Scale degrees: the lower tetrachord (1 2 3 4)",
    level: 2, length: "short", minutes: 1,
    params: { key: "major" },
    prompt: "Cadence in **{key}**, then a note. **1, 2, 3 or 4**?",
    hints: [
      "4 leans heavily down onto 3; it's the most 'unhappy' of the four.",
      "2 wants to fall to 1 (or rise to 3); it sounds unfinished but not tense.",
      "Sing it home: 4-3-2-1, 3-2-1, 2-1."
    ],
    explain: "### One region at a time\nFunctional ear-training programmes introduce the scale in chunks: first the **lower tetrachord** (1 2 3 4), to near-100% accuracy, then the upper one. Within this chunk, contrast the **stable** degree (3) with the **active** ones (2 pulls to 1, 4 pulls to 3).",
    concepts: ["ear-functional-hearing"],
    quiz: { kind: "ear-degree", degrees: ["1", "2", "3", "4"], scale: "major", cadence: true },
    vary: ["key"]
  },

  {
    id: "ear-deg-upper-tetrachord",
    mode: "ear", category: "ear-functional",
    tags: ["functional", "scale-degrees", "cadence", "leading-tone"],
    title: "Scale degrees: the upper tetrachord (5 6 7 1)",
    level: 2, length: "short", minutes: 1,
    params: { key: "major" },
    prompt: "Cadence in **{key}**, then a note. **5, 6, 7 or 1**?",
    hints: [
      "7 is the leading tone: it practically begs to rise a half step to 1.",
      "6 drifts down to 5. Wistful, a little sad even in major.",
      "Sing upward to the octave: 7-1, 6-7-1, or down: 6-5."
    ],
    explain: "### The top of the scale\n**7** is the most active note in a major key. Its half-step pull up to 1 is the engine of the V–I cadence. **6** is softer; it resolves down to 5. Many players hear 6 as 'the pentatonic note'. It's the sweet note in major pentatonic.",
    concepts: ["ear-functional-hearing"],
    quiz: { kind: "ear-degree", degrees: ["5", "6", "7", "1"], scale: "major", cadence: true },
    vary: ["key"]
  },

  {
    id: "ear-deg-major-all",
    mode: "ear", category: "ear-functional",
    tags: ["functional", "scale-degrees", "cadence", "major"],
    title: "Scale degrees: all seven in major",
    level: 3, length: "short", minutes: 2,
    params: { key: "major" },
    prompt: "Cadence in **{key}**, then any diatonic note. Which degree?",
    hints: ["Stable notes (1 3 5) sound like they belong to the tonic chord; active notes (2 4 6 7) want to move.", "If unsure, resolve it in your head and count the steps."],
    explain: "### All seven\nOnce you know each tetrachord, combine them. Classify first (**stable**: 1 3 5, or **active**: 2 4 6 7), then name it. Answering at a gut-reaction pace builds instant recognition; the resolution-singing is for when you miss.",
    concepts: ["ear-functional-hearing"],
    quiz: { kind: "ear-degree", degrees: ["1", "2", "3", "4", "5", "6", "7"], scale: "major", cadence: true },
    vary: ["key"]
  },

  {
    id: "ear-deg-major-drill",
    mode: "ear", category: "ear-functional",
    tags: ["functional", "scale-degrees", "drill", "key-retention"],
    title: "Degree drill block: keep the key in your head",
    level: 4, length: "medium", minutes: 3,
    params: { key: "major" },
    prompt: "One cadence in **{key}** at the start, then a long run of single notes. Name each degree without hearing the cadence again.",
    goal: "20 notes, 90% accuracy, gut-reaction speed.",
    hints: ["Keep the tonic humming quietly in your head.", "If you lose the key, sing 1 3 5 1' from memory, but don't ask for the cadence."],
    explain: "### Key retention\nBruce Arnold calls this **key retention**: hearing one cadence and holding the tonal centre across many notes. That is what happens in real music, where nobody replays the cadence for you.",
    concepts: ["ear-functional-hearing"],
    quiz: { kind: "ear-degree", degrees: ["1", "2", "3", "4", "5", "6", "7"], scale: "major", cadence: true },
    vary: ["key"]
  },

  {
    id: "ear-deg-minor-all",
    mode: "ear", category: "ear-functional",
    tags: ["functional", "scale-degrees", "cadence", "minor"],
    title: "Scale degrees in natural minor",
    level: 4, length: "short", minutes: 2,
    params: { key: "minor" },
    prompt: "A minor cadence in **{key}**, then a note. Which degree: **1, 2, b3, 4, 5, b6, b7**?",
    hints: ["b6 is the heavy, sighing note: it falls to 5.", "b7 is relaxed in minor (no leading-tone pull); it often goes up to 1 or down to b6.", "b3 is stable: it's the 3rd of the tonic chord."],
    explain: "### Minor-key functions\nSame method, new personalities. In natural minor the 7th is **b7** (no leading tone, so no strong pull up), while **b6 → 5** becomes the strongest resolution. Hearing minor degrees as their own thing, not as 'lowered major', is the goal.",
    concepts: ["ear-functional-hearing", "ear-mode-colors"],
    quiz: { kind: "ear-degree", degrees: ["1", "2", "b3", "4", "5", "b6", "b7"], scale: "aeolian", cadence: true },
    vary: ["key"]
  },

  {
    id: "ear-deg-chromatic-blue",
    mode: "ear", category: "ear-functional",
    tags: ["functional", "scale-degrees", "chromatic", "blue-notes"],
    title: "Chromatic degrees, step 1: b3 and b7 in a major key",
    level: 5, length: "short", minutes: 2,
    params: { key: "major" },
    prompt: "Major cadence in **{key}**, then a note: any diatonic degree, or the bluesy **b3** or **b7**.",
    hints: ["b3 in major = the blue note: it wants to bend up into 3.", "b7 in major = Mixolydian: it sounds like a dominant 7th on the tonic, and tends to fall to 6."],
    explain: "### Adding chromatic notes\nIntroduce chromatic degrees one family at a time, starting with the most familiar: **b3** and **b7**, the blues notes. They're the most common 'outside' notes in rock, blues and jazz. Hear each against the major key: b3 rubs against the 3 you expect; b7 pulls down to 6.",
    concepts: ["ear-functional-hearing", "ear-mode-colors"],
    quiz: { kind: "ear-degree", degrees: ["1", "2", "b3", "3", "4", "5", "6", "b7", "7"], scale: "major", cadence: true },
    vary: ["key"]
  },

  {
    id: "ear-deg-chromatic-b6-s4",
    mode: "ear", category: "ear-functional",
    tags: ["functional", "scale-degrees", "chromatic"],
    title: "Chromatic degrees, step 2: add b6 and #4",
    level: 6, length: "short", minutes: 2,
    params: { key: "major" },
    prompt: "Major cadence in **{key}**. Diatonic degrees plus **b3, b7, b6, #4**. Which one?",
    hints: ["b6 in major = the borrowed 'minor iv' note: dark, falls to 5.", "#4 = Lydian / leading tone to 5: it pushes UP to 5.", "b6 and #4 both resolve to 5, but from opposite sides."],
    explain: "### Chromatic notes resolve by half step\n**#4** leans up to 5 (it's the leading tone of the dominant: V/V). **b6** leans down to 5 (the minor iv note). Telling them apart is about direction of pull, which you can feel even without naming the pitch.",
    concepts: ["ear-functional-hearing", "ear-modal-interchange"],
    quiz: { kind: "ear-degree", degrees: ["1", "2", "b3", "3", "4", "#4", "5", "b6", "6", "b7", "7"], scale: "major", cadence: true },
    vary: ["key"]
  },

  {
    id: "ear-deg-chromatic-all",
    mode: "ear", category: "ear-functional",
    tags: ["functional", "scale-degrees", "chromatic", "all"],
    title: "All 12 degrees over a major cadence",
    level: 7, length: "short", minutes: 2,
    params: { key: "major" },
    prompt: "Major cadence in **{key}**, then any of the 12 chromatic notes. Name the degree.",
    hints: ["b2 is the last to learn: the Phrygian/Neapolitan note, it falls hard to 1.", "Group them: stable (1 3 5), diatonic active (2 4 6 7), blue (b3 b7), borrowed (b6 b2), Lydian (#4)."],
    explain: "### The full chromatic map\nEvery chromatic note has a function in a key. Ordered by how often they turn up: b3, b7, b6, #4/b5, b2. Hearing all 12 functionally is what lets you transcribe solos: you hear 'that's the b9 over the V' rather than 'that's a C#'.",
    concepts: ["ear-functional-hearing"],
    quiz: { kind: "ear-degree", degrees: ["1", "b2", "2", "b3", "3", "4", "#4", "5", "b6", "6", "b7", "7"], scale: "major", cadence: true },
    vary: ["key"]
  },

  {
    id: "ear-deg-minor-chromatic",
    mode: "ear", category: "ear-functional",
    tags: ["functional", "scale-degrees", "chromatic", "minor", "harmonic-minor"],
    title: "All 12 degrees over a minor cadence",
    level: 8, length: "short", minutes: 2,
    params: { key: "minor" },
    prompt: "Minor cadence in **{key}**, then any of the 12 notes. Which degree? (The raised 6 and 7 of melodic/harmonic minor are now in play.)",
    hints: ["In minor, natural 7 is the leading tone (harmonic minor): it pulls up hard.", "Natural 6 in minor = the Dorian note: brighter, lifts the minor colour."],
    explain: "### Chromatic minor\nIn minor, 6 and 7 are variable: b6/b7 (Aeolian), 6 (Dorian/melodic minor), 7 (harmonic/melodic minor). Learning to hear which version you're in is learning to hear which *minor* you're in.",
    concepts: ["ear-functional-hearing", "ear-mode-colors"],
    quiz: { kind: "ear-degree", degrees: ["1", "b2", "2", "b3", "3", "4", "#4", "5", "b6", "6", "b7", "7"], scale: "aeolian", cadence: true },
    vary: ["key"]
  },

  // ---------------------------------------------------------------- modes by ear

  {
    id: "ear-mode-major-minor",
    mode: "ear", category: "ear-functional",
    tags: ["modes", "ionian", "aeolian"],
    title: "Mode: major or natural minor?",
    level: 2, length: "short", minutes: 1,
    params: { root: "any" },
    prompt: "A scale is played from its root. **Ionian (major)** or **Aeolian (natural minor)**?",
    hints: ["Listen to the 3rd note: bright 3 or dark b3?", "Aeolian also has b6 and b7: three dark notes."],
    explain: "### Parallel major and minor\nSame root, different colour. Aeolian lowers three degrees of major (3, 6, 7). This is the base comparison every other mode card builds on.",
    concepts: ["ear-mode-colors"],
    quiz: { kind: "ear-mode", scales: ["ionian", "aeolian"], playback: "scale" },
    vary: ["root"]
  },

  {
    id: "ear-mode-bright-family",
    mode: "ear", category: "ear-functional",
    tags: ["modes", "ionian", "lydian", "mixolydian", "parallel-modes"],
    title: "One note changes: Lydian, Ionian or Mixolydian?",
    level: 4, length: "short", minutes: 1,
    params: { root: "any" },
    prompt: "A melody over a drone. **Lydian (#4)**, **Ionian** or **Mixolydian (b7)**?",
    hints: [
      "Lydian: the 4th is raised. Floating, dreamy, sci-fi.",
      "Mixolydian: the 7th is lowered. Bluesy, rock, Celtic.",
      "Ionian: plain major with a strong leading tone (7 → 1)."
    ],
    explain: "### Parallel major modes\nThese three are identical except for **one note**:\n- **Lydian** = Ionian with **#4**\n- **Mixolydian** = Ionian with **b7**\n\nOver a drone you can't lean on chord changes, so listen for the **characteristic note**: does the 4th rub against the drone (Ionian: 4 a half step above 3, a slight clash) or float (Lydian #4)? Does the 7th lead up to the root (Ionian) or sit a whole step below (Mixolydian)?",
    concepts: ["ear-mode-colors"],
    quiz: { kind: "ear-mode", scales: ["lydian", "ionian", "mixolydian"], playback: "drone-melody" },
    vary: ["root"]
  },

  {
    id: "ear-mode-dark-family",
    mode: "ear", category: "ear-functional",
    tags: ["modes", "dorian", "aeolian", "phrygian", "parallel-modes"],
    title: "One note changes: Dorian, Aeolian or Phrygian?",
    level: 4, length: "short", minutes: 1,
    params: { root: "any" },
    prompt: "A melody over a drone. **Dorian (6)**, **Aeolian (b6)** or **Phrygian (b2)**?",
    hints: [
      "Dorian: minor but with a bright natural 6 (Santana, 'So What', Scarborough Fair).",
      "Phrygian: the 2nd is a half step above the root. Spanish, metal, dark.",
      "Aeolian: the plain sad minor, with b6."
    ],
    explain: "### Parallel minor modes\nAgain one note at a time:\n- **Dorian** = Aeolian with **natural 6**\n- **Phrygian** = Aeolian with **b2**\n\nListen for the note just above the root (b2 = Phrygian) and the note just above the 5th (6 vs b6).",
    concepts: ["ear-mode-colors"],
    quiz: { kind: "ear-mode", scales: ["dorian", "aeolian", "phrygian"], playback: "drone-melody" },
    vary: ["root"]
  },

  {
    id: "ear-mode-all-seven",
    mode: "ear", category: "ear-functional",
    tags: ["modes", "major-modes", "parallel-modes"],
    title: "Which of the seven modes?",
    level: 5, length: "short", minutes: 2,
    params: { root: "any" },
    prompt: "A scale from the root. Which mode: **Lydian, Ionian, Mixolydian, Dorian, Aeolian, Phrygian or Locrian**?",
    hints: [
      "First: major or minor 3rd? That splits it 3 / 4.",
      "Then find the characteristic note: #4 (Lyd), b7 (Mix), 6 (Dor), b6 (Aeo), b2 (Phr), b2 + b5 (Loc).",
      "Brightest to darkest: Lyd – Ion – Mix – Dor – Aeo – Phr – Loc. Each step lowers one note."
    ],
    explain: "### The brightness ladder\nOrder the modes by brightness and each one differs from its neighbour by **one note**: Lydian → (lower #4) Ionian → (lower 7) Mixolydian → (lower 3) Dorian → (lower 6) Aeolian → (lower 2) Phrygian → (lower 5) Locrian. Place what you hear on the ladder.",
    concepts: ["ear-mode-colors"],
    quiz: { kind: "ear-mode", scales: ["lydian", "ionian", "mixolydian", "dorian", "aeolian", "phrygian", "locrian"], playback: "scale" },
    vary: ["root"]
  },

  {
    id: "ear-mode-all-seven-drone",
    mode: "ear", category: "ear-functional",
    tags: ["modes", "drone", "drill"],
    title: "Mode drill block: seven modes over a drone",
    level: 6, length: "medium", minutes: 3,
    params: { root: "any" },
    prompt: "Improvised-sounding melodies over a drone. Name the mode, again and again.",
    goal: "85%+ across a 3-minute block.",
    hints: ["Melodies won't always play the characteristic note early: wait for it.", "Sing along with the drone and hum the root; the characteristic note will rub or ring against it."],
    explain: "### Why drone-melody\nA scale played straight up is easy to analyse step by step. A **melody** over a drone is how modes really appear, in modal jazz, Indian music, folk and film. You have to hear the **colour** rather than count steps.",
    concepts: ["ear-mode-colors"],
    quiz: { kind: "ear-mode", scales: ["lydian", "ionian", "mixolydian", "dorian", "aeolian", "phrygian", "locrian"], playback: "drone-melody" },
    vary: ["root"]
  },

  {
    id: "ear-mode-minor-types",
    mode: "ear", category: "ear-functional",
    tags: ["modes", "melodic-minor", "harmonic-minor", "dorian", "aeolian"],
    title: "Which minor? Aeolian, Dorian, harmonic or melodic minor",
    level: 6, length: "short", minutes: 1,
    params: { root: "any" },
    prompt: "Four minor scales. **Aeolian, Dorian, harmonic minor or melodic minor**?",
    hints: ["Look at degrees 6 and 7: b6 b7 (Aeolian), 6 b7 (Dorian), b6 7 (harmonic: the exotic augmented-2nd gap), 6 7 (melodic: 'major with a b3').", "Harmonic minor's b6 → 7 leap is the giveaway."],
    explain: "### Variable 6th and 7th\nAll four share 1 2 b3 4 5. The top tetrachord decides:\n- **Aeolian**: b6 b7\n- **Dorian**: 6 b7\n- **Harmonic minor**: b6 7 (the 1½-step gap sounds 'Middle Eastern')\n- **Melodic minor**: 6 7 (the jazz minor)",
    concepts: ["ear-mode-colors"],
    quiz: { kind: "ear-mode", scales: ["aeolian", "dorian", "harmonic-minor", "melodic-minor"], playback: "scale" },
    vary: ["root"]
  },

  {
    id: "ear-mode-dominant-scales",
    mode: "ear", category: "ear-functional",
    tags: ["modes", "dominant", "melodic-minor", "harmonic-minor"],
    title: "Dominant scales: Mixolydian, Lydian dominant, Mixolydian b6, Phrygian dominant",
    level: 7, length: "short", minutes: 2,
    params: { root: "any" },
    prompt: "Four scales that all fit a dominant 7th chord. Which one?",
    hints: [
      "Lydian dominant: Mixolydian with #4. Bright, fusion.",
      "Mixolydian b6: Mixolydian with b6. Bittersweet.",
      "Phrygian dominant: b2 and b6 with a major 3rd. Flamenco, klezmer, metal."
    ],
    explain: "### Same chord, four scales\nAll contain 1 3 5 b7. The **tensions** differ: Mixolydian (9, 11, 13), Lydian dominant (9, #11, 13), Mixolydian b6 (9, 11, b13), Phrygian dominant (b9, 11, b13). Hearing these lets you match a soloist's choice over a V7.",
    concepts: ["ear-mode-colors", "ear-altered-dominants"],
    quiz: { kind: "ear-mode", scales: ["mixolydian", "lydian-dominant", "mixolydian-b6", "phrygian-dominant"], playback: "drone-melody" },
    vary: ["root"]
  },

  {
    id: "ear-mode-tension-scales",
    mode: "ear", category: "ear-functional",
    tags: ["modes", "altered", "diminished", "whole-tone", "symmetric"],
    title: "Tension scales: altered, half-whole diminished, whole-tone or Lydian dominant?",
    level: 8, length: "short", minutes: 2,
    params: { root: "any" },
    prompt: "Over a dominant drone: **altered, diminished (half-whole), whole-tone or Lydian dominant**?",
    hints: [
      "Whole-tone: only whole steps, six notes, dreamy and directionless.",
      "Half-whole diminished: alternating half and whole steps, symmetric, has a natural 13 and 5.",
      "Altered: b9 #9 3 #11 b13 b7, no natural 5. The 'outside' sound."
    ],
    explain: "### Outside colours\nThe symmetric scales (whole-tone, diminished) have a mechanical, repeating feel. Altered is the darkest and densest. Lydian dominant sounds almost inside: it's the bridge between Mixolydian and the outside sounds.",
    concepts: ["ear-mode-colors", "ear-altered-dominants"],
    quiz: { kind: "ear-mode", scales: ["altered", "diminished-hw", "whole-tone", "lydian-dominant"], playback: "drone-melody" },
    vary: ["root"]
  },

  {
    id: "ear-mode-melodic-minor-modes",
    mode: "ear", category: "ear-functional",
    tags: ["modes", "melodic-minor"],
    title: "The melodic-minor modes",
    level: 9, length: "short", minutes: 2,
    params: { root: "any" },
    prompt: "Which melodic-minor mode: **melodic minor, Dorian b2, Lydian augmented, Lydian dominant, Mixolydian b6, Locrian nat2 or altered**?",
    hints: [
      "Major 3rd? → Lydian augmented (#5), Lydian dominant (#4 b7) or Mixolydian b6.",
      "Minor 3rd + perfect 5th? → melodic minor (7) or Dorian b2 (b2 b7).",
      "Diminished 5th? → Locrian nat2 (natural 2) or altered (b2 and b4 = the 3rd)."
    ],
    explain: "### Jazz's second toolbox\nEach mode of melodic minor fits a different chord: mMaj7, sus(b9), maj7#5, 7#11, 7b13, m7b5, 7alt. Sort by 3rd and 5th first, then look for the one characteristic note.",
    concepts: ["ear-mode-colors"],
    quiz: { kind: "ear-mode", scales: ["melodic-minor", "dorian-b2", "lydian-augmented", "lydian-dominant", "mixolydian-b6", "locrian-nat2", "altered"], playback: "scale" },
    vary: ["root"]
  },

  // ---------------------------------------------------------------- bass lines

  {
    id: "ear-bass-I-IV-V",
    mode: "ear", category: "ear-functional",
    tags: ["bass", "scale-degrees", "progressions"],
    title: "Bass line: I – IV – V – I",
    level: 2, length: "short", minutes: 1,
    params: { key: "major" },
    prompt: "Chords in **{key}**. Tap the **bass note** of each bar as a scale degree.",
    tempo: { start: 70, min: 60, max: 120, step: 5, unit: "bpm" },
    hints: ["Hum the lowest note under the chord.", "Root position throughout: the bass is the chord root."],
    explain: "### Bass first\nThe bass line is the backbone of a progression. Learning to pull it out of the full sound is the most useful transcription skill you can build. Hum the bottom note; ignore the rest.",
    concepts: ["ear-inversions-bass", "ear-progression-strategy"],
    quiz: { kind: "ear-bass", chart: "| I:maj | IV:maj | V:maj | I:maj |", ask: "bass-degrees" },
    vary: ["key", "tempo"]
  },

  {
    id: "ear-bass-doo-wop",
    mode: "ear", category: "ear-functional",
    tags: ["bass", "scale-degrees", "progressions"],
    title: "Bass line: I – vi – IV – V",
    level: 3, length: "short", minutes: 1,
    params: { key: "major" },
    prompt: "Tap the bass degrees, bar by bar, in **{key}**.",
    tempo: { start: 75, min: 60, max: 130, step: 5, unit: "bpm" },
    hints: ["The bass falls a 3rd (1 → 6), falls another 3rd (6 → 4), then steps up (4 → 5)."],
    explain: "### Bass motion types\nRoots move by **step** (2nds), **skip** (3rds) or **leap** (4ths/5ths). The doo-wop loop uses skips down then a step up. Naming the motion type is half the battle.",
    concepts: ["ear-inversions-bass", "ear-progression-strategy"],
    quiz: { kind: "ear-bass", chart: "| I:maj | vi:min | IV:maj | V:maj |", ask: "bass-degrees" },
    vary: ["key", "tempo"]
  },

  {
    id: "ear-bass-descending-inversions",
    mode: "ear", category: "ear-functional",
    tags: ["bass", "inversions", "slash-chords", "descending-bass"],
    title: "Bass line: descending stepwise bass with inversions",
    level: 4, length: "short", minutes: 2,
    params: { key: "major" },
    prompt: "Eight chords in **{key}** with a stepwise falling bass. Tap the bass degree of each.",
    tempo: { start: 66, min: 56, max: 120, step: 4, unit: "bpm" },
    hints: ["It starts on 1 and walks down the scale: but check every note, it ends with a leap.", "Inversions (V/3, I/5, I/3) keep the bass moving by step."],
    explain: "### Why inversions\nThe chords are mostly diatonic, but **slash chords** let the bass walk down by step: 1 7 6 5 4 3 2 5. This is the Pachelbel / 'A Whiter Shade of Pale'-type descending bass. Hearing the bass as a melody, separate from the chords, is the skill.",
    concepts: ["ear-inversions-bass"],
    quiz: { kind: "ear-bass", chart: "| I:maj | V:maj/3 | vi:min | I:maj/5 | IV:maj | I:maj/3 | ii:min | V:maj |", ask: "bass-degrees" },
    vary: ["key", "tempo"]
  },

  {
    id: "ear-bass-andalusian-cliche",
    mode: "ear", category: "ear-functional",
    tags: ["bass", "minor", "line-cliche", "andalusian"],
    title: "Bass line: the minor line cliché",
    level: 6, length: "short", minutes: 1,
    params: { key: "minor" },
    prompt: "A minor chord in **{key}** with a moving bass. Tap the bass degree of each bar.",
    tempo: { start: 66, min: 56, max: 110, step: 4, unit: "bpm" },
    hints: ["The upper chord barely moves; only the bass descends by half steps.", "1 → 7 → b7 → 6: two half steps then another half step."],
    explain: "### The line cliché\ni → i(maj7) → i7 → i6, here with the moving line in the **bass**. The chromatic descent 1 7 b7 6 is a famous device (the James Bond theme, *My Funny Valentine*, the *Stairway to Heaven* intro), heard in the bass or in an inner voice. It turns m, mMaj7, m7 and m6 into one gesture.",
    concepts: ["ear-inversions-bass", "ear-chord-qualities"],
    quiz: { kind: "ear-bass", chart: "| i:min | i:mMaj7/7 | i:m7/b7 | i:m6/6 |", ask: "bass-degrees" },
    vary: ["key", "tempo"]
  },

  {
    id: "ear-bass-chromatic-walkup",
    mode: "ear", category: "ear-functional",
    tags: ["bass", "chromatic", "diminished", "gospel"],
    title: "Bass line: walk-up with a passing diminished",
    level: 6, length: "short", minutes: 2,
    params: { key: "major" },
    prompt: "Eight bars in **{key}**. Tap the bass degrees; one of them is chromatic.",
    tempo: { start: 70, min: 56, max: 120, step: 4, unit: "bpm" },
    hints: ["The bass climbs 1 3 4 #4 5: the #4 is the passing diminished chord.", "Then 5 down to 1 with V7 → I."],
    explain: "### Chromatic bass\nI – I/3 – IV – #iv°7 – I/5 – V7 – I. A classic gospel and Tin Pan Alley walk-up. The #iv°7 isn't a 'new key'; it's a chromatic passing chord that pushes the bass into I/5.",
    concepts: ["ear-inversions-bass", "ear-diminished-family"],
    quiz: { kind: "ear-bass", chart: "| I:maj | I:maj/3 | IV:maj | #iv:dim7 | I:maj/5 | V:7 | I:maj | % |", ask: "bass-degrees" },
    vary: ["key", "tempo"]
  },

  {
    id: "ear-bass-jazz-cycle",
    mode: "ear", category: "ear-functional",
    tags: ["bass", "jazz", "tritone-sub", "turnarounds"],
    title: "Bass line: jazz turnarounds with a tritone sub",
    level: 7, length: "short", minutes: 2,
    params: { key: "major" },
    prompt: "Eight bars of jazz harmony in **{key}**. Tap the bass degree of each bar.",
    tempo: { start: 80, min: 60, max: 180, step: 5, unit: "bpm" },
    hints: ["Mostly falling 5ths: 1 6 2 5, 3 6 2 …", "The last bar is a half step above 1 (tritone sub)."],
    explain: "### Root motion in jazz\nI vi ii V | iii VI7 ii bII7. The bass falls in 5ths except at the end, where **bII7** substitutes for V7 and slides into the next I. Hearing 5ths vs half steps in the bass is how you spot tritone subs on records.",
    concepts: ["ear-inversions-bass", "ear-tritone-sub"],
    quiz: { kind: "ear-bass", chart: "| I:maj7 | vi:m7 | ii:m7 | V:7 | iii:m7 | VI:7 | ii:m7 | bII:7 |", ask: "bass-degrees" },
    vary: ["key", "tempo"]
  },

  // =====================================================================================
  // EAR-MELODY — melodic dictation (tap degrees), audiation (sing in your head),
  // and public-domain melody lessons. Every quoted melody was checked against published
  // notation (see research/ear.md); all are public domain / traditional.
  // =====================================================================================

  // ---------------------------------------------------------------- dictation

  {
    id: "ear-mel-dict-3-step",
    mode: "ear", category: "ear-melody",
    tags: ["dictation", "melody", "scale-degrees", "beginner"],
    title: "Melodic dictation: three notes within 1–3",
    level: 2, length: "short", minutes: 1,
    params: { key: "major" },
    prompt: "Cadence in **{key}**, then a three-note melody using only 1, 2 and 3. Tap the degrees in order.",
    hints: ["Hear the first note functionally (is it home?), then follow the steps.", "Sing it back before you tap."],
    explain: "### Dictation = degrees in a row\nBruce Arnold's sequence goes from one note to two notes to three: each note is still heard against the key, not just against the previous note. Start in a tiny range so every note is a step away.",
    concepts: ["ear-melodic-dictation", "ear-functional-hearing"],
    quiz: { kind: "ear-melody", scale: "major", length: 3, range: ["1", "3"], cadence: true },
    vary: ["key"]
  },

  {
    id: "ear-mel-dict-4-pentachord",
    mode: "ear", category: "ear-melody",
    tags: ["dictation", "melody", "scale-degrees"],
    title: "Melodic dictation: four notes within 1–5",
    level: 3, length: "short", minutes: 1,
    params: { key: "major" },
    prompt: "Four notes between 1 and 5 in **{key}**. Tap them.",
    hints: ["Anchor on any 1, 3 or 5 you hear: they're the easiest to place.", "Skips (1–3, 3–5) outline the tonic chord."],
    explain: "### What to listen for\nFind the **anchors** first (1, 3, 5) and fill in the passing notes. Sing the melody back once before answering; if you can sing it, you can almost always work out the degrees.",
    concepts: ["ear-melodic-dictation"],
    quiz: { kind: "ear-melody", scale: "major", length: 4, range: ["1", "5"], cadence: true },
    vary: ["key"]
  },

  {
    id: "ear-mel-dict-5-octave",
    mode: "ear", category: "ear-melody",
    tags: ["dictation", "melody", "scale-degrees"],
    title: "Melodic dictation: five notes across the octave",
    level: 4, length: "short", minutes: 1,
    params: { key: "major" },
    prompt: "Five notes between 1 and 1' in **{key}**.",
    hints: ["7 almost always goes to 1'; 4 to 3; 6 to 5.", "Large leaps usually land on chord tones."],
    explain: "### Tendencies help\nUse what you know from the degree cards: **active notes resolve**. If you hear a note that wants to move, guess the tendency (7 → 1, 4 → 3, 2 → 1, 6 → 5) and check.",
    concepts: ["ear-melodic-dictation", "ear-functional-hearing"],
    quiz: { kind: "ear-melody", scale: "major", length: 5, range: ["1", "1'"], cadence: true },
    vary: ["key"]
  },

  {
    id: "ear-mel-dict-minor",
    mode: "ear", category: "ear-melody",
    tags: ["dictation", "melody", "minor"],
    title: "Melodic dictation in minor",
    level: 5, length: "short", minutes: 2,
    params: { key: "minor" },
    prompt: "A minor cadence in **{key}**, then five notes from the 5 below up to the 5 above. Tap the degrees.",
    hints: ["b3 is the most stable note after 1 and 5.", "b6 → 5 is the strongest pull in minor."],
    explain: "### Minor dictation\nSame process. Minor melodies often sit around **5–b6–5** and **b3–2–1**; spot those cells.",
    concepts: ["ear-melodic-dictation"],
    quiz: { kind: "ear-melody", scale: "aeolian", length: 5, range: ["5,", "5"], cadence: true },
    vary: ["key"]
  },

  {
    id: "ear-mel-dict-6-wide",
    mode: "ear", category: "ear-melody",
    tags: ["dictation", "melody", "range"],
    title: "Melodic dictation: six notes, wide range",
    level: 6, length: "short", minutes: 2,
    params: { key: "major" },
    prompt: "Six notes from 5, up to 5' in **{key}**.",
    hints: ["Mark the register: below the tonic, middle, or above the octave?", "Write it as contour first (up, down, leap), then name the degrees."],
    explain: "### Contour first\nWith a wider range, start by sketching the **shape**: up/down, step/leap. Then put the anchors in, then the rest. Experienced transcribers work this way.",
    concepts: ["ear-melodic-dictation"],
    quiz: { kind: "ear-melody", scale: "major", length: 6, range: ["5,", "5'"], cadence: true },
    vary: ["key"]
  },

  {
    id: "ear-mel-dict-modal",
    mode: "ear", category: "ear-melody",
    tags: ["dictation", "melody", "dorian", "mixolydian", "modes"],
    title: "Melodic dictation in Dorian",
    level: 7, length: "short", minutes: 2,
    params: { key: "minor" },
    prompt: "Dorian melody on **{root}**, six notes. Tap the degrees (watch for the natural 6).",
    hints: ["The 6 is the Dorian colour: it often comes as 5–6–5 or 6–b7–1'."],
    explain: "### Modal dictation\nThe characteristic note (natural 6 in Dorian) is what to listen for; everything else is just minor.",
    concepts: ["ear-melodic-dictation", "ear-mode-colors"],
    quiz: { kind: "ear-melody", scale: "dorian", length: 6, range: ["1", "1'"], cadence: true },
    vary: ["key"]
  },

  {
    id: "ear-mel-dict-8-harmonic-minor",
    mode: "ear", category: "ear-melody",
    tags: ["dictation", "melody", "harmonic-minor"],
    title: "Melodic dictation: eight notes in harmonic minor",
    level: 8, length: "medium", minutes: 3,
    params: { key: "minor" },
    prompt: "Eight notes in **{key}** harmonic minor, from 5, to 5. Tap them.",
    hints: ["The b6 → 7 augmented 2nd is a dead giveaway: a step-sized gap that sounds too big.", "7 → 1 leading-tone resolutions are frequent."],
    explain: "### Longer phrases\nAt eight notes you can no longer hold the melody note-by-note. **Chunk** it into two four-note cells and solve each one.",
    concepts: ["ear-melodic-dictation"],
    quiz: { kind: "ear-melody", scale: "harmonic-minor", length: 8, range: ["5,", "5"], cadence: true },
    vary: ["key"]
  },

  // ---------------------------------------------------------------- audiation (sing in your head)

  {
    id: "ear-aud-three-steps",
    mode: "ear", category: "ear-melody",
    tags: ["audiation", "inner-hearing", "beginner"],
    title: "Audiate: 1 – 2 – 3",
    level: 1, length: "short", minutes: 1,
    params: { key: "major" },
    prompt: "You'll hear the starting note. Then watch the notes light up on the neck **in silence** and sing them in your head. Reveal and compare.",
    hints: ["Hear the first pitch clearly in your head before moving on.", "Imagine your own voice singing 'do re mi'."],
    explain: "### Audiation\nAudiation (Edwin Gordon's term) is hearing music in your head with nothing sounding. It's the skill under sight-singing, composing and improvising what you mean. Start tiny: three stepwise notes.",
    concepts: ["ear-audiation"],
    quiz: { kind: "audiate", melody: "1 2 3 - |", scale: "major", show: "neck", cadence: true },
    vary: ["key"]
  },

  {
    id: "ear-aud-random-3",
    mode: "ear", category: "ear-melody",
    tags: ["audiation", "inner-hearing", "random"],
    title: "Audiate: three random degrees (1–3)",
    level: 2, length: "short", minutes: 1,
    params: { key: "major" },
    prompt: "Starting note played. Read the three **scale degrees**, sing them silently, then reveal.",
    hints: ["Sing the tonic first in your head, then the melody."],
    explain: "### Degrees, not pitches\nReading degrees and imagining them builds the same map as the functional cards, in reverse: degree → sound instead of sound → degree.",
    concepts: ["ear-audiation", "ear-functional-hearing"],
    quiz: { kind: "audiate", melody: null, length: 3, range: ["1", "3"], scale: "major", show: "degrees", cadence: true },
    vary: ["key"]
  },

  {
    id: "ear-aud-frere-jacques",
    mode: "ear", category: "ear-melody",
    tags: ["audiation", "public-domain", "song"],
    title: "Audiate: Frère Jacques from the neck",
    level: 2, length: "short", minutes: 1,
    params: { key: "major" },
    prompt: "Watch the neck silently and sing along in your head. Which tune is it? Reveal to check: *Frère Jacques* (trad.).",
    hints: ["The first four notes climb 1 2 3 and return to 1."],
    explain: "### Known melody, new way in\nA familiar tune lets you check yourself: if the tune in your head stays recognisable, your audiation is on track. The neck view links the sound to fretboard shapes.",
    concepts: ["ear-audiation"],
    quiz: { kind: "audiate", melody: "1 2 3 1 | 1 2 3 1 | 3 4 5 - | 3 4 5 - | 5_ 6_ 5_ 4_ 3 1 | 5_ 6_ 5_ 4_ 3 1 | 1 5, 1 - | 1 5, 1 - |", scale: "major", show: "neck" },
    vary: ["key"]
  },

  {
    id: "ear-aud-random-5",
    mode: "ear", category: "ear-melody",
    tags: ["audiation", "inner-hearing", "random"],
    title: "Audiate: five notes within 1–5, on the neck",
    level: 3, length: "short", minutes: 1,
    params: { key: "major" },
    prompt: "Starting note, then five notes light up on the neck in silence. Sing them in your head; reveal and rate yourself.",
    hints: ["Relate every note to the starting tonic, not just to the previous note."],
    explain: "### Neck → ear\nGuitarists often know shapes better than sounds. Linking each fretboard position to an imagined pitch closes that gap.",
    concepts: ["ear-audiation"],
    quiz: { kind: "audiate", melody: null, length: 5, range: ["1", "5"], scale: "major", show: "neck", cadence: true },
    vary: ["key"]
  },

  {
    id: "ear-aud-ode-to-joy",
    mode: "ear", category: "ear-melody",
    tags: ["audiation", "public-domain", "song"],
    title: "Audiate: Ode to Joy from note names",
    level: 3, length: "short", minutes: 1,
    params: { key: "major" },
    prompt: "You'll see **note names** in {key}. Sing them in your head, then reveal. (Beethoven, *Ode to Joy*.)",
    hints: ["No leaps at all: only steps and repeated notes.", "The 3rd bar starts on the tonic; phrase 1 ends on 2, phrase 2 on 1."],
    explain: "### Note names\nReading letter names and hearing them is a step towards sight-singing standard notation.",
    concepts: ["ear-audiation"],
    quiz: { kind: "audiate", melody: "3 3 4 5 | 5 4 3 2 | 1 1 2 3 | 3 -_ 2_ 2 - | 3 3 4 5 | 5 4 3 2 | 1 1 2 3 | 2 -_ 1_ 1 - |", scale: "major", show: "notes" },
    vary: ["key"]
  },

  {
    id: "ear-aud-leaps",
    mode: "ear", category: "ear-melody",
    tags: ["audiation", "inner-hearing", "leaps"],
    title: "Audiate: leaps across the octave",
    level: 4, length: "short", minutes: 1,
    params: { key: "major" },
    prompt: "Five scale degrees with **leaps**, from 1 to 1'. Sing them silently, then reveal.",
    hints: ["Hear leaps as chord tones: 1 3 5 1' are your stepping stones.", "For a leap to an active note (2, 4, 6, 7), find the nearest chord tone first."],
    explain: "### Leaps\nLeaps are harder to audiate than steps because you can't 'slide' to the next note. Keep the **tonic triad** in mind as a scaffold.",
    concepts: ["ear-audiation", "ear-functional-hearing"],
    quiz: { kind: "audiate", melody: null, length: 5, range: ["1", "1'"], scale: "major", show: "degrees", leaps: true, cadence: true },
    vary: ["key"]
  },

  {
    id: "ear-aud-amazing-grace",
    mode: "ear", category: "ear-melody",
    tags: ["audiation", "public-domain", "song", "3/4"],
    title: "Audiate: Amazing Grace on the neck",
    level: 4, length: "short", minutes: 2,
    params: { key: "major" },
    prompt: "Watch the neck and sing the melody in your head (it's in 3/4). Then reveal: *Amazing Grace* (New Britain, 1831).",
    hints: ["It starts on the 5 below the tonic: a 4th up to 1.", "The high point is the 5 above the tonic, held."],
    explain: "### Pentatonic tune\n*Amazing Grace* uses only 1 2 3 5 6, the major pentatonic, so every leap lands somewhere consonant. Good for practising wider leaps in your head.",
    concepts: ["ear-audiation"],
    quiz: { kind: "audiate", melody: "5, | 1 - 3_ 1_ | 3 - 2 | 1 - 6, | 5, - 5, | 1 - 3_ 1_ | 3 - 2 | 5 - - | - - 3 | 5 - 3_ 1_ | 3 - 2 | 1 - 6, | 5, - 5, | 1 - 3_ 1_ | 3 - 2 | 1 - - | - - |", scale: "major", show: "neck" },
    vary: ["key"]
  },

  {
    id: "ear-aud-minor-random",
    mode: "ear", category: "ear-melody",
    tags: ["audiation", "minor", "random"],
    title: "Audiate: six notes in minor",
    level: 5, length: "short", minutes: 1,
    params: { key: "minor" },
    prompt: "Minor key. Six degrees from 5, to 5. Sing silently, reveal, rate.",
    hints: ["Imagine the minor tonic chord (1 b3 5) before you start."],
    explain: "### Minor inner hearing\nb3, b6 and b7 have to feel 'normal' in your head, not like altered major notes.",
    concepts: ["ear-audiation"],
    quiz: { kind: "audiate", melody: null, length: 6, range: ["5,", "5"], scale: "aeolian", show: "degrees", cadence: true },
    vary: ["key"]
  },

  {
    id: "ear-aud-greensleeves",
    mode: "ear", category: "ear-melody",
    tags: ["audiation", "public-domain", "song", "minor", "6/8"],
    title: "Audiate: Greensleeves on the neck",
    level: 5, length: "short", minutes: 2,
    params: { key: "minor" },
    prompt: "A minor tune in 6/8 lights up on the neck. Sing it in your head, then reveal: *Greensleeves* (trad.).",
    hints: ["Watch for the raised 7 (leading tone) and raised 6 at the cadences: melodic minor going up.", "Beat = 8th note."],
    explain: "### Mixed minor\nGreensleeves uses b6 and b7 in the middle of phrases but **7** (and 6 → 7) at cadences. Audiating it trains the flexible 6th and 7th degrees of minor.",
    concepts: ["ear-audiation", "ear-mode-colors"],
    quiz: { kind: "audiate", melody: "1 | b3 - 4 5 -_ b6_ 5 | 4 - 2 b7, -_ 1_ 2 | b3 - 1 1 -_ 7,_ 1 | 2 - 7, 5, - 1 | b3 - 4 5 -_ b6_ 5 | 4 - 2 b7, -_ 1_ 2 | b3 -_ 2_ 1 7, -_ 6,_ 7, | 1 - - - - - |", scale: "aeolian", show: "neck" },
    vary: ["key"]
  },

  {
    id: "ear-aud-long-leaps",
    mode: "ear", category: "ear-melody",
    tags: ["audiation", "leaps", "random", "range"],
    title: "Audiate: eight notes, wide leaps",
    level: 6, length: "short", minutes: 2,
    params: { key: "major" },
    prompt: "Eight notes with leaps, from 5, to 5', shown on the neck. Sing silently, reveal, rate.",
    hints: ["Break it into 4 + 4.", "Leaps of a 6th or more: hear the octave first, then adjust."],
    explain: "### Range and memory\nLonger, wider melodies test memory as much as pitch. Chunk into cells and keep the tonic in mind.",
    concepts: ["ear-audiation"],
    quiz: { kind: "audiate", melody: null, length: 8, range: ["5,", "5'"], scale: "major", show: "neck", leaps: true, cadence: true },
    vary: ["key"]
  },

  {
    id: "ear-aud-chromatic-neighbours",
    mode: "ear", category: "ear-melody",
    tags: ["audiation", "chromatic", "neighbour-tones"],
    title: "Audiate: chromatic neighbour tones",
    level: 6, length: "short", minutes: 1,
    params: { key: "major" },
    prompt: "Degrees with chromatic lower neighbours and passing notes. Sing silently, reveal.",
    hints: ["A chromatic note a half step below a chord tone always 'leans in': #2 → 3, #4 → 5.", "b6 → 5 and b2 → 1 lean down."],
    explain: "### Chromatic approach notes\nJazz and classical melody decorate chord tones from a half step away. Audiating them trains the 'leading-tone' feeling for every degree.",
    concepts: ["ear-audiation", "ear-functional-hearing"],
    quiz: { kind: "audiate", melody: "3 #2 3 5 | 4 #4 5 - | 6 b6 5 3 | 2 b2 1 - |", scale: "major", show: "degrees", cadence: true },
    vary: ["key"]
  },

  {
    id: "ear-aud-danny-boy",
    mode: "ear", category: "ear-melody",
    tags: ["audiation", "public-domain", "song", "range"],
    title: "Audiate: the Londonderry Air from note names",
    level: 7, length: "medium", minutes: 2,
    params: { key: "major" },
    prompt: "Note names only. Sing it in your head: a long, wide traditional melody. Reveal: the *Londonderry Air* (Danny Boy), first half.",
    hints: ["It starts on the leading tone below: 7, 1 2 | 3 …", "Bar 2 dips to the low 6 (6,)."],
    explain: "### Long-line audiation\nWide range (6, up to 6) and long held notes. Keep the tonic in mind across the long notes.",
    concepts: ["ear-audiation"],
    quiz: { kind: "audiate", melody: "7,_ 1_ 2_ | 3 -_ 2_ 3_ 6_ 5_ 3_ | 2_ 1_ 6, ._ 1_ 3_ 4_ | 5 -_ 6_ 5_ 3_ 1_ 3_ | 2 - ._ 7,_ 1_ 2_ | 3 -_ 2_ 3_ 6_ 5_ 3_ | 2_ 1_ 6, ._ 7,_ 1_ 2_ | 3 -_ 4_ 3_ 2_ 1_ 2_ | 1 - - - |", scale: "major", show: "notes" },
    vary: ["key"]
  },

  {
    id: "ear-aud-chromatic-lines",
    mode: "ear", category: "ear-melody",
    tags: ["audiation", "chromatic"],
    title: "Audiate: chromatic lines",
    level: 8, length: "short", minutes: 1,
    params: { key: "major" },
    prompt: "A chromatic descent and ascent on the neck. Sing every half step in your head, then reveal.",
    hints: ["Keep the tonic as a 'ghost drone' so each half step has a function: 7, b7, 6, b6, 5 …"],
    explain: "### Pure chromatic motion\nHardest of all to audiate in tune, because there's no scale to lean on. Functional naming helps: you're not singing 'half step, half step'; you're singing 1 → 7 → b7 → 6 → b6 → 5.",
    concepts: ["ear-audiation"],
    quiz: { kind: "audiate", melody: "1 7, b7, 6, | b6, - 5, - | 5, #5, 6, b7, | 7, - 1 - |", scale: "major", show: "neck", cadence: true },
    vary: ["key"]
  },

  {
    id: "ear-aud-bebop-line",
    mode: "ear", category: "ear-melody",
    tags: ["audiation", "bebop", "chromatic", "jazz"],
    title: "Audiate: a bebop line with an enclosure",
    level: 9, length: "short", minutes: 1,
    params: { key: "major" },
    prompt: "A bebop-dominant run, an arpeggio and an enclosure, shown as degrees. Sing it silently, reveal.",
    hints: ["The run descends from 1' with the extra chromatic 7 between 1' and b7.", "The enclosure surrounds 1' from above (b2') and below (7)."],
    explain: "### Bebop vocabulary\nThe bebop dominant scale adds a passing 7 so chord tones fall on the beat. Enclosures target a note from both sides. Audiating these lines is how you learn to *hear* bebop vocabulary rather than just play the fingerings.",
    concepts: ["ear-audiation"],
    quiz: { kind: "audiate", melody: "1'_ 7_ b7_ 6_ 5_ 4_ 3_ 2_ | 1 3 5 b7 | b2' 7 1' - |", scale: "major", show: "degrees" },
    vary: ["key"]
  },

  {
    id: "ear-aud-chromatic-leaps",
    mode: "ear", category: "ear-melody",
    tags: ["audiation", "chromatic", "leaps", "advanced"],
    title: "Audiate: long, leapy and chromatic",
    level: 10, length: "medium", minutes: 2,
    params: { key: "major" },
    prompt: "A long line full of leaps to chromatic notes. Sing silently, reveal, and be honest when you rate.",
    hints: ["Before each leap, name the target degree's function (e.g. b6 = minor iv note) and imagine its pull.", "Chunk into the five bars."],
    explain: "### The top of the ladder\nLeaps *to* chromatic notes, with no stepwise lead-in, are the hardest thing to audiate. Each chromatic note here resolves by half step on the next note, so you can hear where it's going.",
    concepts: ["ear-audiation", "ear-functional-hearing"],
    quiz: { kind: "audiate", melody: "1 b6 5 #4 | 5 b3' 2' b2' | 1' 6 b7 5 | #4 4 3 - | b3 2 b2 1 |", scale: "major", show: "neck", cadence: true },
    vary: ["key"]
  },

  // ---------------------------------------------------------------- public-domain melody lessons

  {
    id: "ear-tune-ode-to-joy",
    mode: "ear", category: "ear-melody",
    tags: ["song-reference", "public-domain", "stepwise"],
    title: "Ode to Joy: melody as scale degrees",
    level: 1, length: "short", minutes: 1,
    params: { key: "major" },
    prompt: "Listen and follow along: **3 3 4 5 | 5 4 3 2 | 1 1 2 3 | 3 2 2**. Beethoven's Ninth (1824).",
    hints: ["It starts on 3, not on 1.", "Phrase 1 ends on 2 (a question); phrase 2 ends on 1 (the answer)."],
    explain: "### A stepwise melody\nOde to Joy moves almost entirely by step within 1–5. It's a good first 'map' of the lower pentachord. Note the **question/answer** phrasing: same opening, but phrase 1 ends on 2, phrase 2 on 1.",
    concepts: ["ear-interval-songs", "ear-functional-hearing"],
    quiz: { kind: "listen", melody: "3 3 4 5 | 5 4 3 2 | 1 1 2 3 | 3 -_ 2_ 2 - | 3 3 4 5 | 5 4 3 2 | 1 1 2 3 | 2 -_ 1_ 1 - |", scale: "major", tempo: 100, explain: "Ode to Joy (Beethoven, 1824)." },
    vary: ["key"]
  },

  {
    id: "ear-tune-twinkle",
    mode: "ear", category: "ear-melody",
    tags: ["song-reference", "public-domain"],
    title: "Twinkle Twinkle: 1 1 5 5 6 6 5",
    level: 1, length: "short", minutes: 1,
    params: { key: "major" },
    prompt: "Listen: **1 1 5 5 6 6 5 | 4 4 3 3 2 2 1**. Every degree of the major scale except 7.",
    hints: ["The leap is a perfect 5th; after that it's all steps down."],
    explain: "### Twinkle Twinkle (trad.)\nLeap up 1 → 5, step to 6, then descend 5 4 3 2 1. The middle section repeats 5 4 3 2 twice. Singing it on degrees is a quick way to make every diatonic degree familiar.",
    concepts: ["ear-interval-songs"],
    quiz: { kind: "listen", melody: "1 1 5 5 | 6 6 5 - | 4 4 3 3 | 2 2 1 - | 5 5 4 4 | 3 3 2 - | 5 5 4 4 | 3 3 2 - | 1 1 5 5 | 6 6 5 - | 4 4 3 3 | 2 2 1 - |", scale: "major", tempo: 100, explain: "Twinkle Twinkle Little Star (trad.)." },
    vary: ["key"]
  },

  {
    id: "ear-tune-saints",
    mode: "ear", category: "ear-melody",
    tags: ["song-reference", "public-domain"],
    title: "When the Saints: full chorus in degrees",
    level: 2, length: "short", minutes: 1,
    params: { key: "major" },
    prompt: "Listen: **1 3 4 5** three times, then down to 2, and the answer phrase home to 1.",
    hints: ["The phrase 'climbs' 1 3 4 5 and leaves a rest before repeating."],
    explain: "### When the Saints Go Marching In (trad.)\n1 3 4 5 | 1 3 4 5 | 1 3 4 5 3 1 3 2 | 3 3 2 1 1 3 5 5 4 | 3 4 5 3 1 2 1. Uses only 1 2 3 4 5: a pentachord tune.",
    concepts: ["ear-interval-songs"],
    quiz: { kind: "listen", melody: "1 3 4 | 5 - - - | . 1 3 4 | 5 - - - | . 1 3 4 | 5 - 3 - | 1 - 3 - | 2 - - - | . 3 3 2 | 1 - - - | 3 - 5 - | 5 4 - - | . . 3 4 | 5 - 3 - | 1 - 2 - | 1 - - - |", scale: "major", tempo: 120, explain: "When the Saints Go Marching In (trad.)." },
    vary: ["key"]
  },

  {
    id: "ear-tune-happy-birthday",
    mode: "ear", category: "ear-melody",
    tags: ["song-reference", "public-domain", "3/4"],
    title: "Happy Birthday: degrees and the octave leap",
    level: 2, length: "short", minutes: 1,
    params: { key: "major" },
    prompt: "Listen: it starts on the **5 below** the tonic: 5, 5, 6, 5, 1 7, … The third phrase leaps a full **octave** (5, → 5).",
    hints: ["First interval: unison, then M2 up (5, → 6,).", "Phrase 3 jumps 5, → 5: an octave."],
    explain: "### Happy Birthday\nThe melody (Hill sisters, 1893) is public domain: in the US a 2016 court settlement ended the copyright claim, and in the EU it expired at the end of 2016. It's a great **octave** reference (start of phrase 3) and a 3/4 example.",
    concepts: ["ear-interval-songs"],
    quiz: { kind: "listen", melody: "5,_ 5,_ | 6, 5, 1 | 7, - 5,_ 5,_ | 6, 5, 2 | 1 - 5,_ 5,_ | 5 3 1 | 7, 6, 4_ 4_ | 3 1 2 | 1 - - |", scale: "major", tempo: 100, explain: "Happy Birthday to You (Hill, 1893; public domain)." },
    vary: ["key"]
  },

  {
    id: "ear-tune-auld-lang-syne",
    mode: "ear", category: "ear-melody",
    tags: ["song-reference", "public-domain", "pentatonic"],
    title: "Auld Lang Syne: a pentatonic tune",
    level: 3, length: "short", minutes: 1,
    params: { key: "major" },
    prompt: "Listen: **5, | 1 1 1 3 | 2 1 2 3 | 1 1 3 5 | 6 …** The verse uses only 1 2 3 5 6.",
    hints: ["The pickup is a 4th up into the tonic (5, → 1).", "The high point is 6, then the second half answers from 5 down."],
    explain: "### Auld Lang Syne (trad. Scottish)\nThe whole verse is **major pentatonic**, so there are no half steps at all, which is why it sounds so open. The sung version is quoted (verse only).",
    concepts: ["ear-interval-songs"],
    quiz: { kind: "listen", melody: "5, | 1 -_ 1_ 1 3 | 2 -_ 1_ 2 3 | 1 -_ 1_ 3 5 | 6 - - 6 | 5 -_ 3_ 3 1 | 2 -_ 1_ 2 3 | 1 -_ 6,_ 6, 5, | 1 - - |", scale: "major", tempo: 90, explain: "Auld Lang Syne (trad.), verse." },
    vary: ["key"]
  },

  {
    id: "ear-tune-swing-low",
    mode: "ear", category: "ear-melody",
    tags: ["song-reference", "public-domain", "pentatonic", "spiritual"],
    title: "Swing Low, Sweet Chariot: chorus",
    level: 3, length: "short", minutes: 1,
    params: { key: "major" },
    prompt: "Listen: **3 1 3 | 1 1 6, 5,** … a falling major 3rd, then down to the low 5.",
    hints: ["All pentatonic: 1 2 3 5 6.", "The second phrase starts with 6 5 3 instead of 3 1."],
    explain: "### Swing Low, Sweet Chariot (trad. spiritual)\nAnother major-pentatonic tune. The falling 3 → 1 is its signature, and the low 6, → 5, at the end of each line.",
    concepts: ["ear-interval-songs"],
    quiz: { kind: "listen", melody: "3 1 - 3 | 1 -_ 1_ 6,_ 5, -_ | 1_ 1_ 1_ 1_ 3_ 3_ 5 | 5 - - - | 6_ 5_ 3 - 5 | 1 -_ 1_ 6,_ 5, -_ | 1_ 1_ 1_ 1_ 3_ 3_ 2 | 1 - - - |", scale: "major", tempo: 76, explain: "Swing Low, Sweet Chariot (trad.), chorus." },
    vary: ["key"]
  },

  {
    id: "ear-tune-silent-night",
    mode: "ear", category: "ear-melody",
    tags: ["song-reference", "public-domain", "3/4"],
    title: "Silent Night: 5 6 5 3",
    level: 3, length: "short", minutes: 2,
    params: { key: "major" },
    prompt: "Listen: **5 6 5 3** (twice), then **2' 2' 7**, **1' 1' 5** … ending 1' 5 3 5 4 2 1.",
    hints: ["The high point (3') comes near the end.", "'All is calm' = 2' 2' 7: the leading tone."],
    explain: "### Silent Night (Gruber, 1818)\nGood for hearing the **upper register**: 2', 4' and 3' above the tonic octave, and for the 5 → 3 (minor 3rd down) motif.",
    concepts: ["ear-interval-songs"],
    quiz: { kind: "listen", melody: "5 -_ 6_ 5 | 3 - - | 5 -_ 6_ 5 | 3 - - | 2' - 2' | 7 - - | 1' - 1' | 5 - - | 6 - 6 | 1' -_ 7_ 6 | 5 -_ 6_ 5 | 3 - - | 6 - 6 | 1' -_ 7_ 6 | 5 -_ 6_ 5 | 3 - - | 2' - 2' | 4' -_ 2'_ 7 | 1' - - | 3' - - | 1' -_ 5_ 3 | 5 4 2 | 1 - - | - - - |", scale: "major", tempo: 80, explain: "Silent Night (Franz Xaver Gruber, 1818)." },
    vary: ["key"]
  },

  {
    id: "ear-tune-scarborough-fair",
    mode: "ear", category: "ear-melody",
    tags: ["song-reference", "public-domain", "dorian", "modes", "3/4"],
    title: "Scarborough Fair: hear the Dorian 6",
    level: 4, length: "short", minutes: 2,
    params: { key: "minor" },
    prompt: "A traditional Dorian melody. Listen for the **natural 6** in the second phrase (5 6 4 5).",
    hints: ["Opening: 1 1 5 5 5 2 b3 2 1.", "The 6 appears in the middle of phrase 2: that's what makes it Dorian, not Aeolian."],
    explain: "### Scarborough Fair (trad. English)\nThe traditional tune is in **Dorian**: minor with a raised 6th. The melody quoted here is the traditional one; later arrangements are separate, copyrighted works and aren't used. Listen for how the 6 brightens the minor sound for a moment.",
    concepts: ["ear-mode-colors", "ear-interval-songs"],
    quiz: { kind: "listen", melody: "1 - 1 | 5 5 5 | 2 -_ b3_ 2 | 1 - - | . 5 b7 | 1' - b7 | 5 6 4 | 5 - - | - . 1' | 1' - 1' | b7 - 5_ 5_ | 5 4 b3 | 2 b7, - | - - . | 1 - 5 | 4 - b3 | 2 1 b7, | 1 - - | - - . |", scale: "dorian", tempo: 100, explain: "Scarborough Fair (trad.), Dorian." },
    vary: ["key"]
  },

]; // end templates

export const concepts = [

  {
    id: "ear-functional-hearing",
    title: "Functional ear training: hearing notes in a key",
    tags: ["ear", "functional", "scale-degrees"],
    body: "### The idea\nA note has no meaning on its own: a C sounds like home after a C major cadence and like a tense leading tone after a Db major one. **Functional ear training** (Alain Benbassat's method, used by the *Functional Ear Trainer* apps, and close to Bruce Arnold's 'one note' contextual method) trains you to hear each note's **role in the key**.\n\n### The routine\n1. A cadence establishes the key.\n2. One note sounds.\n3. Name its degree, then **sing it home** to 1 by step (6 → 5 → 4 → 3 → 2 → 1, or 7 → 1).\n\nThe resolution is the important part: you are learning each degree's *pull*.\n\n### Order of learning\n- 1 3 5 (tonic chord tones)\n- lower tetrachord 1 2 3 4, then upper 5 6 7 1, to near-100%\n- all seven, then minor\n- chromatic degrees, most common first: **b3, b7, b6, #4/b5, b2**\n\n### Why it matters more than intervals\nIntervals tell you the distance between two notes; function tells you what a note *does*. Transcribing, playing by ear and improvising all depend on function. Interval skill is still useful for leaps and for checking yourself.",
    visual: { type: "text", body: "| Degree | Feel in major | Tends to go |\n|---|---|---|\n| 1 | home, rest | stays |\n| 2 | unfinished | 1 (or 3) |\n| 3 | sweet, stable | stays / 2 |\n| 4 | heavy lean | 3 |\n| 5 | strong, open | 1 or stays |\n| 6 | wistful | 5 |\n| 7 | leading tone, urgent | 1 |" },
    see: ["ear-melodic-dictation", "ear-audiation", "ear-interval-songs"]
  },

  {
    id: "ear-harmonic-vs-melodic",
    title: "Melodic vs harmonic hearing (and why the order matters)",
    tags: ["ear", "intervals", "pedagogy"],
    body: "### Two different skills\n- **Melodic** intervals (one note after the other) are heard as a *distance* or a *motion*.\n- **Harmonic** intervals (together) are heard as a *colour*: consonant, sweet, rough or ambiguous.\n\nAural-skills studies (Buttram 1969; Balzano & Liesch 1982; Wuthrich & Tunks 1989, reviewed in Stambaugh & Nichols 2019) report that students identify **melodic intervals more easily than harmonic ones**, and **ascending more easily than descending**. The hardest harmonic intervals are the tritone, the 6ths and the 7ths.\n\n### How this curriculum uses that\n1. Ascending melodic → descending melodic → harmonic → mixed.\n2. For chords: **arpeggiated before block**, so a harmonic problem becomes a melodic one while you learn.\n3. When a harmonic sound confuses you, **arpeggiate it in your head**.\n\n### The consonance ladder (for harmonic dyads)\nperfect (4, 5, 8) → sweet (3rds, 6ths) → mild (M2, m7) → harsh (m2, M7) → tritone.",
    see: ["ear-interval-songs", "ear-chord-qualities"]
  },

  {
    id: "ear-interval-songs",
    title: "Interval reference songs",
    tags: ["ear", "intervals", "songs"],
    body: "### How to use song anchors\nA reference song is a **crutch for the first weeks**: when you hear an interval, recall the song and compare. The aim is to drop the crutch and recognise the interval's colour directly. Pick songs you *really* know; a half-remembered song is worse than none.\n\n### Copyright note\nPublic-domain and traditional tunes are quoted in the lessons. Copyrighted songs are named only with their first interval: the app never plays more than those two notes, and never shows lyrics.\n\nA few references are not the *first* interval of the song (Twinkle Twinkle's P5 is between the 2nd and 3rd notes, because the song starts with a repeated note). The table says so where that applies.",
    visual: { type: "text", body: "| Interval | Ascending | Descending |\n|---|---|---|\n| m2 | Jaws (first 2 notes) · Ode to Joy (3→4, notes 2–3) | Joy to the World · Für Elise |\n| M2 | Frère Jacques · Happy Birthday (notes 2–3) | Mary Had a Little Lamb · Yesterday (first 2) |\n| m3 | Greensleeves | Star-Spangled Banner · Hey Jude (first 2) |\n| M3 | When the Saints | Swing Low · Beethoven 5 (G→E♭) |\n| P4 | Here Comes the Bride · Amazing Grace · Auld Lang Syne | Eine kleine Nachtmusik |\n| TT | Maria (first 2) | — |\n| P5 | Twinkle Twinkle (notes 2–3) · Star Wars (first 2 long notes) | Flintstones (first 2) |\n| m6 | The Entertainer (notes 3–4 of the theme) | — |\n| M6 | My Bonnie · Jingle Bells (verse) · NBC chimes | — |\n| m7 | Star Trek original theme · Somewhere (first 2) | — |\n| M7 | think 'octave minus a half step' | — |\n| 8ve | Over the Rainbow · The Christmas Song (first 2) | — |" },
    see: ["ear-functional-hearing", "ear-harmonic-vs-melodic"]
  },

  {
    id: "ear-compound-intervals",
    title: "Compound intervals and tensions",
    tags: ["ear", "intervals", "tensions"],
    body: "### Fold, then add 7\nA compound interval is a simple interval plus an octave: 9 = 2 + octave, 11 = 4 + octave, 13 = 6 + octave. By ear, **mentally drop the top note an octave**, name the simple interval, and add 7.\n\n### Spacing changes the sound\nThe same pitch classes sound very different close and spread: a b2 is a harsh cluster; a b9 an octave up is tense but usable. That's why voicings matter: guitarists spread tensions out (drop 2, drop 3) to keep them sweet.\n\n### Natural vs altered tensions\n- natural: **9, 11, 13**, inside colours\n- altered: **b9, #9, #11, b13**, the dominant-chord spice",
    see: ["ear-extensions", "ear-altered-dominants"]
  },

  {
    id: "ear-chord-qualities",
    title: "Hearing chord quality: the learning ladder",
    tags: ["ear", "chords", "pedagogy"],
    body: "### The ladder\n1. **maj vs min**: the 3rd decides.\n2. **+ dim, + aug**: is the 5th perfect (stable) or altered (unstable)?\n3. **sus2/sus4**: no 3rd at all.\n4. **Inversions**: same quality, different bass.\n5. **7th chords**: maj7 vs 7 vs m7 first (the ii–V–I family), then m7b5 and dim7, then m6/mMaj7/6/7sus4.\n6. **Extensions**: identify the 7th chord *underneath*, then the colour on top.\n7. **Altered dominants**: b9, #9, #11, b13, then combinations.\n8. **Upper structures**: two layers, shell + triad.\n\n### The tritone test for 7th chords\n- no tritone → **maj7** (bright) or **m7** (mellow)\n- one tritone → **7** (between 3 and b7) or **m7b5** (between 1 and b5)\n- two tritones → **dim7**\n\nTension rises in that order, and you can learn to feel it directly.",
    see: ["ear-inversions-bass", "ear-diminished-family", "ear-extensions"]
  },

  {
    id: "ear-inversions-bass",
    title: "How to hear inversions: listen to the bass",
    tags: ["ear", "chords", "inversions", "bass"],
    body: "### Separate the bass from the chord\nAn inversion doesn't change *what* the chord is, only *which note is lowest*. So:\n1. **Hum the lowest note.** Ignore everything above it.\n2. **Find the root** (the note the chord 'belongs to').\n3. Compare: bass = root → root position; bass = 3rd → 1st inv; bass = 5th → 2nd inv; bass = 7th → 3rd inv.\n\n### Character of each inversion\n- **Root position**: grounded, final.\n- **1st inversion** (3rd in bass): lighter, mobile, often a passing chord in a stepwise bass line.\n- **2nd inversion** (5th in bass): floating, unstable, the classical 'cadential 6/4' before V.\n- **3rd inversion** (7th in bass): crunchy at the bottom (7 against 1), wants to step down.\n\n### Top note as a second clue\nIn close position the **top note** also tells you: a triad with the 5th on top is in root position, the root on top means 1st inversion, the 3rd on top means 2nd inversion.\n\n### Ambiguity is real\nAm7/C contains exactly the notes of C6. When a chord is inverted, a different root can become the most natural hearing. That's not you being wrong; it's how harmony works.",
    visual: { type: "voicings", root: "C", quality: "maj", voicing: "close", stringSet: [3, 2, 1], inversion: "all" },
    see: ["ear-chord-qualities", "ear-progression-strategy"]
  },

  {
    id: "ear-diminished-family",
    title: "Diminished sounds: dim, m7b5, dim7",
    tags: ["ear", "chords", "diminished"],
    body: "### Three related chords\n- **dim** (1 b3 b5): small, tense triad. vii° in major.\n- **m7b5** (1 b3 b5 b7): 'half-diminished'. Darker than m7, but softer than dim7. ii in minor; vii in major.\n- **dim7** (1 b3 b5 bb7): fully symmetrical, all minor 3rds. Any note can be the root; it sounds identical in every inversion.\n\n### By ear\nThe dim7's **rootless, symmetrical** quality is the tell: spooky, silent-film, 'something is about to happen'. The m7b5 sounds like a **minor chord with a sinking 5th**, yearning rather than spooky.\n\n### Jobs in a progression\n- **Passing** dim7: bass moves by half step (I–#i°7–ii; iii–biii°7–ii).\n- **Common-tone** dim7: over a static bass, ornamenting I.\n- **Rootless V7b9**: a dim7 a half step above the root is a dominant 7b9 without its root (B°7 = G7b9).\n- **Minor ii–V**: iiø–V7b9–i.",
    see: ["ear-chord-qualities", "ear-secondary-dominants"]
  },

  {
    id: "ear-extensions",
    title: "Hearing extended chords",
    tags: ["ear", "chords", "extensions"],
    body: "### Underneath first\nExtensions (9, 11, 13) sit **on top** of a 7th chord and don't change its function. By ear: strip the top off in your imagination and name the maj7 / 7 / m7 underneath. Then name the colour.\n\n### Colours\n- **9**: lush, 'cloud' on top. On any chord.\n- **11**: suspended, quartal. Great on minor chords; clashes with a major 3rd, so major chords use **#11** (Lydian shimmer).\n- **13**: sweet, like a 6th an octave up. The big-band dominant.\n- **6/9**: no 7th at all, built from the pentatonic; very consonant.\n- **sus** chords: no 3rd, so no tritone in a dominant. 9sus4 = ii over the V bass.",
    see: ["ear-compound-intervals", "ear-altered-dominants"]
  },

  {
    id: "ear-altered-dominants",
    title: "Hearing altered dominants",
    tags: ["ear", "chords", "altered", "dominant"],
    body: "### The spectrum\nA dominant 7th can be coloured from **inside** to **outside**:\n- 9, 13 → Mixolydian (inside)\n- #11 with 9, 13 → Lydian dominant (bright, floating)\n- b9 with 13 → half-whole diminished (sweet-and-dark)\n- b9, b13 → Phrygian dominant / Mixolydian b6 (dark, Spanish)\n- b9 #9 #11 b13 → altered (fully outside)\n\n### By ear\n- **b9**: dark rub, a diminished chord inside the dominant.\n- **#9**: the 'Hendrix' grit: a minor 3rd against the major 3rd.\n- **#11**: bright and floating.\n- **b13**: heavy, dark.\n\nHearing the colour tells you the **scale** the soloist or comper is using, and lets you match it.",
    see: ["ear-upper-structures", "ear-mode-colors", "ear-compound-intervals"]
  },

  {
    id: "ear-upper-structures",
    title: "Hearing upper structures",
    tags: ["ear", "chords", "upper-structures", "dominant"],
    body: "### Two layers\nAn **upper-structure triad** (UST) is a consonant major triad played above a dominant's tritone shell (3 and b7). The ear hears **two layers**: a tense bottom and a bright triad on top. That's why USTs sound rich but clear.\n\n### The four common ones over C7\n| triad | tensions | name |\n|---|---|---|\n| D (II) | 9 #11 13 | C13#11 |\n| A (VI) | 13 b9 3 | C13b9 |\n| Eb (bIII) | #9 5 b7 | C7#9 |\n| Ab (bVI) | b13 1 #9 | C7#9b13 |\n\n### Ear strategy\n1. Hear the **top triad** as if it were alone: major triad, and its top note.\n2. Hear the **bass** (the dominant's root).\n3. Measure triad root → bass: a whole step up (II), a major 6th up (VI), a minor 3rd up (bIII), a minor 6th up (bVI).\n\nNatural tensions (II, VI) sound brighter; altered ones (bIII, bVI) darker.",
    see: ["ear-altered-dominants", "ear-extensions"]
  },

  {
    id: "ear-cadences",
    title: "Cadences by ear",
    tags: ["ear", "progressions", "cadences"],
    body: "### Listen to the last two chords and the bass\n| cadence | chords | bass into the end | feel |\n|---|---|---|---|\n| authentic | V(7) – I | 5 → 1 | full stop |\n| plagal | IV – I | 4 → 1 | 'Amen', soft |\n| minor plagal | IV – iv – I | 4 → 4 → 1 | bittersweet |\n| half | … – V | ends on 5 | question mark |\n| Phrygian half (minor) | iv6 – V | b6 → 5 | baroque question / Andalusian close |\n| deceptive | V – vi (minor key: V – bVI) | 5 → 6 (b6) | surprise |\n| backdoor | iv7 – bVII7 – I | b7 → 1 (rising) | warm, nostalgic |\n| tritone sub | ii – bII7 – I | b2 → 1 (falling) | slippery, smooth |\n\nThe **bass motion into the final chord** separates almost all of them: falling 5th, falling 4th, rising step, falling half step, rising whole step.",
    see: ["ear-progression-strategy", "ear-tritone-sub", "ear-modal-interchange"]
  },

  {
    id: "ear-progression-strategy",
    title: "How to hear a progression",
    tags: ["ear", "progressions", "strategy"],
    body: "### Listen in layers\n1. **Find home.** Which chord sounds like I (or i)?\n2. **Track the bass.** Hum it. Classify each move: step, skip (3rd) or leap (4th/5th), and up or down.\n3. **Qualities.** Major, minor, dominant, diminished? A *surprise* quality is the clue to secondary dominants or borrowed chords.\n4. **Confirm with the cadence.** How does the phrase end?\n\n### At tempo\nWhen the tempo rises you can't work chord by chord. Listen for the **shape**: where's the minor chord, where's the dominant, where does the bass move chromatically? Experienced players recognise progressions as whole gestures, the way you recognise a word without spelling it.\n\n### Practice tip\nDrill blocks raise the tempo as you succeed. If your accuracy drops at a new tempo, that's the point where you're switching from analysing to recognising.",
    see: ["ear-cadences", "ear-inversions-bass", "ear-functional-hearing"]
  },

  {
    id: "ear-secondary-dominants",
    title: "Hearing secondary dominants",
    tags: ["ear", "progressions", "secondary-dominants"],
    body: "### What changes\nA secondary dominant (V7/x) is a diatonic chord with its 3rd raised (or a b7 added) so it points at a new target a 5th below. Each brings a **chromatic note** that acts as a temporary leading tone:\n- **V7/ii** (VI7): #1 → 2\n- **V7/iii** (VII7): #2 → 3\n- **V7/IV** (I7): b7 → 6\n- **V7/V** (II7): #4 → 5\n- **V7/vi** (III7): #5 → 6\n\n### By ear\nListen for the chord that you *expected* to be minor turning **major/dominant** (vi → VI7, iii → III7, ii → II7), and the bass then falling a 5th. Chains of them (III7–VI7–II7–V7) give the ragtime/rhythm-changes-bridge sound.",
    see: ["ear-progression-strategy", "ear-tritone-sub", "ear-diminished-family"]
  },

  {
    id: "ear-tritone-sub",
    title: "Hearing tritone substitutions",
    tags: ["ear", "progressions", "tritone-sub", "jazz"],
    body: "### The idea\nG7 (B and F) and Db7 (F and Cb=B) share the same tritone, so Db7 can replace G7 and resolve the same way. By ear, the upper voices behave like a normal V–I; **the bass is what gives it away**:\n- ii – V – I: bass 2 → 5 → 1 (falling 5ths)\n- ii – bII7 – I: bass 2 → b2 → 1 (chromatic slide)\n\nSubbed ii–Vs (bvi–bII7–I) and chromatic turnarounds (I–bIII7–ii–bII7) sound like everything is **sliding down by half steps**.\n\n### Compare\nThe **backdoor** (iv7–bVII7–I) is also 'not V', but its bass *rises* a whole step into I. Half step down = tritone sub; whole step up = backdoor.",
    see: ["ear-cadences", "ear-secondary-dominants", "ear-coltrane-changes"]
  },

  {
    id: "ear-modal-interchange",
    title: "Hearing modal interchange (borrowed chords)",
    tags: ["ear", "progressions", "modal-interchange", "borrowed"],
    body: "### Borrowing from the parallel minor\nIn a major key you can borrow chords from C minor (or other C modes) without changing key. Each borrowed chord brings a **dark note**:\n| chord | borrowed from | dark note(s) | feel |\n|---|---|---|---|\n| iv | Aeolian | b6 | bittersweet, tearjerker |\n| bVII | Mixolydian/Aeolian | b7 | rock swagger, backdoor |\n| bVI | Aeolian | b6, b3 | big, epic, film |\n| bIII | Aeolian | b3, b7 | bluesy rock |\n| bII | Phrygian | b2, b6 | exotic, Spanish, metal |\n| iiø | Aeolian | b6 (as b5 of ii) | dark approach to I |\n\n### By ear\nThe tonic stays the same, but the **colour darkens for one chord**. Listen for which scale degree changed. Combined with a bass line: bVI–bVII–I rises by whole steps into the tonic (the Aeolian 'victory' cadence).",
    see: ["ear-cadences", "ear-mode-colors", "ear-tritone-sub"]
  },

  {
    id: "ear-coltrane-changes",
    title: "Hearing Coltrane changes",
    tags: ["ear", "progressions", "coltrane", "jazz"],
    body: "### Major-third cycles\nColtrane's harmony in *Giant Steps* and *Countdown* moves key centres by **major 3rds**, three keys that divide the octave equally (e.g. B – G – Eb), each approached by its own V7.\n\nGiant Steps opens: **Bmaj7 D7 | Gmaj7 Bb7 | Ebmaj7** = I – bIII7 – bVI – VII7 – III (in B).\n\nThe 'Coltrane substitution' for a ii–V–I (C major): **Dm7 Eb7 | Abmaj7 B7 | Emaj7 G7 | Cmaj7**.\n\n### By ear\n- **Bright maj7 arrivals** come thick and fast, each one a new key.\n- Roots move by **3rds**, not 5ths or steps.\n- Each arrival is preceded by a dominant, so it sounds like a chain of tiny cadences.\n\nStart at a slow tempo; the drill raises it as you improve.",
    visual: { type: "progression", key: "B", chart: "| I:maj7 bIII:7 | bVI:maj7 VII:7 | III:maj7 | % |" },
    see: ["ear-tritone-sub", "ear-progression-strategy"]
  },

  {
    id: "ear-mode-colors",
    title: "The sound of each mode: characteristic notes",
    tags: ["ear", "modes", "scales"],
    body: "### One note makes the mode\nCompare each mode with the nearest major or minor scale and one note stands out, the **characteristic note**:\n| mode | vs | characteristic note | sound |\n|---|---|---|---|\n| Lydian | Ionian | #4 | floating, dreamy |\n| Ionian | — | 7 + 4 | plain major, strong leading tone |\n| Mixolydian | Ionian | b7 | bluesy, rock, Celtic |\n| Dorian | Aeolian | 6 | hopeful minor, funk, Santana |\n| Aeolian | — | b6 | sad, plain minor |\n| Phrygian | Aeolian | b2 | Spanish, metal |\n| Locrian | Phrygian | b5 | unstable, no real tonic |\n\n### Brightness ladder\nLydian → Ionian → Mixolydian → Dorian → Aeolian → Phrygian → Locrian: each step lowers **one** note (#4→4, 7→b7, 3→b3, 6→b6, 2→b2, 5→b5).\n\n### Practice\nOver a drone, the characteristic note **rings or rubs** against the root. Composers who write modally lean on that note so the mode is unmistakable, which is what the drone-melody cards imitate.\n\n### Beyond the major modes\nMelodic minor (6 + 7 in minor), harmonic minor (b6 + 7, the augmented 2nd), Lydian dominant (#4 + b7), Phrygian dominant (b2 + 3), altered (everything flattened except 1, 3, b7).",
    see: ["ear-modal-interchange", "ear-altered-dominants", "ear-functional-hearing"]
  },

  {
    id: "ear-melodic-dictation",
    title: "Melodic dictation: a method",
    tags: ["ear", "melody", "dictation"],
    body: "### Steps\n1. **Hear the key.** Let the cadence finish; keep the tonic in mind.\n2. **Sing it back** once (out loud or in your head). If you can't sing it, listen again before analysing.\n3. **Contour.** Up, down, steps, leaps.\n4. **Anchors.** Place any 1, 3, 5 first. They are the easiest to recognise functionally.\n5. **Fill in** the passing and neighbour notes using tendencies (7 → 1, 4 → 3, 6 → 5, b6 → 5).\n6. **Chunk** long melodies into 3–4 note cells.\n\n### Progression of difficulty\nlength 3 → 8, range 1–3 → 5,–5', major → minor → modes → harmonic minor → chromatic.\n\nBruce Arnold's sequence (one note → two notes → three notes in a key) is the same idea: every note is still heard against the tonic, not just against the note before.",
    see: ["ear-functional-hearing", "ear-audiation"]
  },

  {
    id: "ear-audiation",
    title: "Audiation: hearing music in your head",
    tags: ["ear", "melody", "audiation", "inner-hearing"],
    body: "### What it is\n**Audiation** (Edwin Gordon's term) is hearing and understanding music that isn't sounding. It's the inner ear you use to sight-sing, compose, transcribe from memory, and improvise *what you mean* rather than what your fingers know.\n\n### How the cards work\n1. The app plays the **starting note** (and often a cadence).\n2. The melody appears **silently**: on the neck, as degrees, or as note names.\n3. You sing it **in your head**, as vividly as you can.\n4. Reveal the audio and **rate yourself honestly**: did your inner version match in pitch and rhythm?\n\n### Tips\n- Imagine your own voice; vowels help ('lah').\n- Keep the tonic as a quiet 'ghost drone'.\n- For leaps, imagine the chord tone first, then the target.\n- For chromatic notes, feel their pull (a half step below a target leans *up* into it).\n\nThe ladder runs from 3 stepwise notes to long, leapy, chromatic lines.",
    see: ["ear-functional-hearing", "ear-melodic-dictation"]
  },

];
