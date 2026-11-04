// Guitar Cards — rhythm, picking & styles content library (rhy-)
// Contract: docs/SCHEMA.md (§4.5 rhythm specs, §5 metronome). Plain object literals only.
// Conventions used in this file (see research/rhythm.md → "Engine requests" for open questions):
//  - `accents` are 0-based slot indices into the pattern (spaces and | ignored).
//  - In x/8 meters a "beat" = one eighth note: slots = numerator × grid × bars, and tempo counts eighths.
//  - Strum patterns on grid 2/4 follow constant motion: D/d/X/T on even slots, U/u on odd slots.
//  - In `pick` patterns, `fingers` tokens for pinches join fingers with "+" (e.g. "p+a" for "5+1").
//  - In hybrid-picking cards the `fingers` token `p` means "the pick" (it plays the thumb's role).

export const templates = [

// ─────────────────────────────────────────────────────────────────────────────
// A. SUBDIVISIONS & TIME (category: rhythm)
// ─────────────────────────────────────────────────────────────────────────────

{
  id: "rhy-quarter-pulse-muted",
  mode: "play", category: "rhythm", tags: ["subdivisions", "quarters", "time", "muted"],
  title: "Lock to the click: quarter notes",
  level: 1, length: "short", minutes: 1,
  prompt: "Lightly lay your fretting hand across all six strings to mute them. Strum **one downstroke per click** for 8 bars and count \"1 2 3 4\" out loud.",
  goal: "Your strum covers the click so well that it seems to disappear.",
  tempo: { start: 70, min: 40, max: 160, step: 5, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0, accent: true },
  hints: [
    "Listen for the click 'disappearing' under your strum. When you hear two sounds (click, then strum) you're late; when the strum comes first you're rushing.",
    "Move from the elbow and wrist and keep the motion small, about the width of the strings.",
    "Count out loud. Saying the numbers is the single best fix for drifting time."
  ],
  explain: `### Why start here?
Every subdivision drill in this deck is built on a steady quarter-note pulse. If the quarter note wobbles, so does everything on top of it.

The goal is **"burying" the click**: your attack and the metronome land at the same instant, so you hear one sound. Strumming muted strings is ideal for this because the sound is short and percussive, which makes errors easy to hear.`,
  visual: { type: "rhythm", meter: "4/4", grid: 1, bars: 1, pattern: "dddd", accents: [0], title: "Muted downstrokes on every beat" },
  demo: { type: "rhythm", meter: "4/4", grid: 1, bars: 1, pattern: "dddd", accents: [0] },
  concepts: ["subdivisions", "pocket"],
  vary: ["tempo"]
},

{
  id: "rhy-8ths-downs",
  mode: "play", category: "rhythm", tags: ["subdivisions", "eighths", "muted", "downstrokes"],
  title: "Eighth notes, all downstrokes",
  level: 1, length: "short", minutes: 1,
  prompt: "With the strings muted, strum **two even downstrokes per click** while counting \"1 & 2 & 3 & 4 &\". Accent the numbers a little.",
  goal: "The & falls exactly halfway between clicks for 8 bars.",
  tempo: { start: 70, min: 40, max: 140, step: 5, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 2, swing: 0, accent: true },
  hints: [
    "Turn the metronome subdivision on first so you can hear the &. Then switch it off and keep it in your head.",
    "All-downs means your hand has to come back up silently. Keep that return relaxed and the same size every time."
  ],
  explain: `### Counting eighths
Each beat splits into two: **1 &, 2 &, 3 &, 4 &**. The "&" sits exactly halfway between the clicks.

All-downstroke eighths build the stamina and consistency used in punk and metal rhythm, and they test whether your 8ths are really even when nothing (like the alternation of down and up) helps you along.`,
  visual: { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pattern: "dddddddd", accents: [0, 2, 4, 6], title: "1 & 2 & 3 & 4 &, all downs" },
  demo: { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pattern: "dddddddd", accents: [0, 2, 4, 6] },
  concepts: ["subdivisions"],
  vary: ["tempo"]
},

{
  id: "rhy-8ths-down-up",
  mode: "play", category: "rhythm", tags: ["subdivisions", "eighths", "strumming", "constant-motion"],
  title: "Eighth notes down-up on {chord}",
  level: 1, length: "short", minutes: 2,
  params: { root: ["G", "C", "D", "A", "E"], quality: ["maj", "min"] },
  prompt: "Hold **{chord}** and strum straight eighths: **down on the numbers, up on the &s**. Count out loud.",
  goal: "Even volume between down and up strums, and no drift for 8 bars.",
  tempo: { start: 70, min: 50, max: 160, step: 5, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 2, swing: 0, accent: true },
  hints: [
    "Downstrokes naturally hit the low strings harder. Aim the upstroke at the top 3–4 strings and let the downstroke cover all of them.",
    "Your hand should swing like a pendulum: down on the click, up halfway between."
  ],
  explain: `### The pendulum rule
In straight 8th-note strumming the hand moves **down on every beat and up on every &**, whether or not it touches the strings. This "constant motion" is the foundation of every strumming pattern in the deck: patterns are made by **skipping** strokes, never by changing the hand's rhythm.`,
  visual: { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pattern: "DUDUDUDU", accents: [0, 2, 4, 6], chord: { root: "$root", quality: "$quality" } },
  demo: { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pattern: "DUDUDUDU", accents: [0, 2, 4, 6], chord: { root: "$root", quality: "$quality" } },
  concepts: ["subdivisions", "constant-motion"],
  vary: ["tempo", "root", "quality"]
},

{
  id: "rhy-8ths-accent-offbeats",
  mode: "play", category: "rhythm", tags: ["eighths", "accents", "offbeats", "muted"],
  title: "Accent the &s",
  level: 3, length: "short", minutes: 2,
  prompt: "Keep muted down-up eighths going, but **accent only the upstrokes (the &s)**. Let the downstrokes become quiet ghosts.",
  goal: "Clear offbeat accents without the upstrokes getting early.",
  tempo: { start: 70, min: 50, max: 140, step: 5, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0, accent: true },
  hints: [
    "Players tend to rush the accented upstroke. Think 'late and loud'.",
    "Make the ghosted downstrokes really soft. Accents are about contrast, not just hitting harder.",
    "Here's a reggae/ska preview: the & is where the skank lives."
  ],
  explain: `### Feeling the offbeat
Most players accent the beat without thinking. Moving the weight onto the **&** makes the offbeat its own sound, and it's the first step toward syncopation, the reggae skank and funk.`,
  visual: { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pattern: "dUdUdUdU", accents: [1, 3, 5, 7], title: "Ghost the numbers, accent the &s" },
  demo: { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pattern: "dUdUdUdU", accents: [1, 3, 5, 7] },
  concepts: ["accents-ghosts", "subdivisions"],
  vary: ["tempo"]
},

{
  id: "rhy-quarter-to-8th",
  mode: "play", category: "rhythm", tags: ["subdivisions", "switching", "quarters", "eighths"],
  title: "Switch: quarters ↔ eighths on {chord}",
  level: 2, length: "medium", minutes: 3,
  params: { root: ["G", "C", "D", "A", "E"], quality: ["maj", "min", "7"] },
  prompt: "Alternate **one bar of quarter notes** (downs only) with **one bar of eighths** (down-up). Keep the hand swinging down-up in both bars; in the quarter-note bar the upstrokes just miss the strings.",
  goal: "The switch doesn't change the tempo, and the beat is identical in both bars.",
  tempo: { start: 70, min: 50, max: 140, step: 5, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0, accent: true },
  hints: [
    "The silent upstrokes in bar 1 (the `-` in the grid) keep your hand on the 8th-note grid.",
    "Count \"1 & 2 & ...\" through both bars. Only your strumming changes."
  ],
  explain: `### Switching subdivisions
Switching is a separate skill from playing each subdivision. The trick is to keep **one master pulse** (the beat) and treat the subdivision as a layer over it. Here your hand never stops its 8th-note motion. You just choose whether to touch the strings.`,
  visual: { type: "rhythm", meter: "4/4", grid: 2, bars: 2, pattern: "D-D-D-D- | DUDUDUDU", accents: [0, 8], chord: { root: "$root", quality: "$quality" } },
  demo: { type: "rhythm", meter: "4/4", grid: 2, bars: 2, pattern: "D-D-D-D- | DUDUDUDU", accents: [0, 8], chord: { root: "$root", quality: "$quality" } },
  concepts: ["subdivisions", "constant-motion"],
  vary: ["tempo", "root", "quality"]
},

{
  id: "rhy-triplets-intro",
  mode: "play", category: "rhythm", tags: ["triplets", "subdivisions", "muted"],
  title: "Eighth-note triplets: trip-o-let",
  level: 2, length: "short", minutes: 2,
  prompt: "With muted strings, strum **three even strokes per click**, alternating down-up the whole time. Say \"**trip**-o-let\" or \"**1**-trip-let 2-trip-let\" and accent each beat.",
  goal: "Three equal notes per beat, not 'long-short-short' and not swing.",
  tempo: { start: 60, min: 40, max: 120, step: 5, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 3, swing: 0, accent: true },
  hints: [
    "Strict alternation means beat 1 starts with a **downstroke**, beat 2 with an **upstroke**, beat 3 down, beat 4 up.",
    "If accenting an upstroke on beat 2 feels weird, that's normal. It's the whole point of the drill.",
    "Clap 3 per beat first, then strum."
  ],
  explain: `### Triplets
A triplet divides the beat into **three** equal parts. Count them "1-trip-let 2-trip-let" or "1-la-li 2-la-li".

With alternating strokes, an odd number per beat means **every other beat starts on an upstroke**. Most players find that awkward, which is exactly why triplets feel unstable. Training the accented upstroke is what fixes it.`,
  visual: { type: "rhythm", meter: "4/4", grid: 3, bars: 1, pattern: "dud udu dud udu", accents: [0, 3, 6, 9], title: "Accent each beat: D U D | U D U ..." },
  demo: { type: "rhythm", meter: "4/4", grid: 3, bars: 1, pattern: "dud udu dud udu", accents: [0, 3, 6, 9] },
  concepts: ["triplets", "subdivisions"],
  vary: ["tempo"]
},

{
  id: "rhy-triplet-accent-shift",
  mode: "play", category: "rhythm", tags: ["triplets", "accents"],
  title: "Triplets on {chord}: accent {p:target}",
  level: 3, length: "medium", minutes: 3,
  params: {
    root: ["A", "E", "D", "G"], quality: ["min", "maj", "7"],
    target: [
      { v: [0, 3, 6, 9], label: "each beat" },
      { v: [0, 6], label: "beats 1 and 3 only" },
      { v: [2, 5, 8, 11], label: "the last triplet ('let')", lvl: 2 },
      { v: [1, 4, 7, 10], label: "the middle triplet ('trip')", lvl: 2 }
    ]
  },
  prompt: "Strum continuous triplets on **{chord}** with strict alternation. Accent **{p:target}** and keep the other strokes soft.",
  goal: "Accent placement stays exact for 8 bars while the beat stays solid.",
  tempo: { start: 60, min: 40, max: 120, step: 5, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0, accent: true },
  hints: [
    "Say the triplet syllables and shout the accented one.",
    "Moving the accent off the beat often pulls the beat with it. Keep tapping your foot on the click.",
    "Accenting the last triplet is the start of a shuffle/swing feel."
  ],
  explain: `### Accent displacement inside triplets
Accenting different partials teaches you to *place* a note anywhere in the triplet grid, which is the skill behind shuffles (last partial), Afro-Cuban 6/8 bell patterns, and blues phrasing.`,
  visual: { type: "rhythm", meter: "4/4", grid: 3, bars: 1, pattern: "DUDUDUDUDUDU", accents: "$target", chord: { root: "$root", quality: "$quality" } },
  demo: { type: "rhythm", meter: "4/4", grid: 3, bars: 1, pattern: "DUDUDUDUDUDU", accents: "$target", chord: { root: "$root", quality: "$quality" } },
  concepts: ["triplets", "accents-ghosts"],
  vary: ["tempo", "target", "root"]
},

{
  id: "rhy-16ths-muted",
  mode: "play", category: "rhythm", tags: ["sixteenths", "subdivisions", "muted", "constant-motion"],
  title: "Sixteenths: 1-e-&-a",
  level: 3, length: "short", minutes: 2,
  prompt: "Muted strings, **four strokes per click**: down-up-down-up. Count \"**1** e & a **2** e & a\" and accent each beat.",
  goal: "Four even 16ths per beat for 8 bars, with no rushing on the e or a.",
  tempo: { start: 60, min: 40, max: 120, step: 4, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 4, swing: 0, accent: true },
  hints: [
    "Downstrokes land on the number and the &. Upstrokes land on the e and the a.",
    "Use a looser, smaller motion than for eighths. The wrist does most of the work.",
    "Start slow enough to *say* every syllable."
  ],
  explain: `### Counting sixteenths
Each beat splits into four: **1 e & a**. The & is the same & as in 8th notes, and the e and a are the new in-between notes.

With constant motion, 16th strumming is just 8th-note strumming at double speed: **D on 1 and &, U on e and a**. That stroke map never changes, which is what lets funk players place chords on any 16th without thinking.`,
  visual: { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pattern: "dudu dudu dudu dudu", accents: [0, 4, 8, 12], title: "1 e & a 2 e & a 3 e & a 4 e & a" },
  demo: { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pattern: "dudu dudu dudu dudu", accents: [0, 4, 8, 12] },
  concepts: ["subdivisions", "constant-motion"],
  vary: ["tempo"]
},

{
  id: "rhy-16th-accent-partial",
  mode: "play", category: "rhythm", tags: ["sixteenths", "accents"],
  title: "Sixteenths: accent {p:target}",
  level: 4, length: "medium", minutes: 3,
  params: {
    target: [
      { v: [2, 6, 10, 14], label: "every &" },
      { v: [1, 5, 9, 13], label: "every e", lvl: 1 },
      { v: [3, 7, 11, 15], label: "every a", lvl: 1 },
      { v: [0, 3, 6, 9, 12], label: "3+3+3+3+4 (a Chaffee grouping)", lvl: 2 }
    ]
  },
  prompt: "Continuous muted 16ths with the hand always moving. Accent **{p:target}** and keep everything else as quiet ghosts.",
  goal: "Accents in exactly the right place, with the beat still clear, for 8 bars.",
  tempo: { start: 60, min: 40, max: 110, step: 4, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0, accent: true },
  hints: [
    "Say the counts and say the accented syllable louder: \"1 e **&** a\".",
    "The e and a are upstrokes. An accented upstroke needs a slightly deeper dig into the strings.",
    "If the beat flips (the accent starts to feel like '1'), slow down and tap your foot."
  ],
  explain: `### Why accent drills?
Funk, samba and most modern grooves are **16th-note grids with selected accents**. Being able to accent any partial while the others ghost is the core skill, and the accented upstroke is the one most players lack.`,
  visual: { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pattern: "dudu dudu dudu dudu", accents: "$target" },
  demo: { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pattern: "dudu dudu dudu dudu", accents: "$target" },
  concepts: ["accents-ghosts", "subdivisions", "groupings"],
  vary: ["tempo", "target"]
},

{
  id: "rhy-16th-single-partial",
  mode: "play", category: "rhythm", tags: ["sixteenths", "placement", "constant-motion"],
  title: "Hit only {p:partial}",
  level: 4, length: "short", minutes: 2,
  params: {
    root: ["E", "A", "D"], quality: ["m7", "7", "9"],
    partial: [
      { v: "D---D---D---D---", label: "the beat (1)" },
      { v: "--D---D---D---D-", label: "the &", lvl: 1 },
      { v: "-U---U---U---U--", label: "the e", lvl: 2 },
      { v: "---U---U---U---U", label: "the a", lvl: 2 }
    ]
  },
  prompt: "Keep your strumming hand moving in 16ths (down-up-down-up) but **only touch the strings on {p:partial}** of every beat, holding **{chord}**. Every other stroke misses the strings.",
  goal: "One clean, perfectly placed chord per beat for 8 bars.",
  tempo: { start: 60, min: 40, max: 110, step: 4, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0, accent: true },
  hints: [
    "The `-` slots in the grid are 'air strums': the hand moves but doesn't touch the strings.",
    "The e and a are always upstrokes. If you're hitting them with a downstroke, your hand has lost the grid.",
    "Counting all four syllables out loud is non-negotiable here."
  ],
  explain: `### Placement, not speed
A 16th-note figure is just a choice of *which* of the four slots you hit. If your hand keeps the grid, every partial has a fixed stroke direction (D on 1 and &, U on e and a), so you'll always land in the right place. This is the core funk technique.`,
  visual: { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pattern: "$partial", chord: { root: "$root", quality: "$quality" } },
  demo: { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pattern: "$partial", chord: { root: "$root", quality: "$quality" } },
  concepts: ["constant-motion", "subdivisions"],
  vary: ["tempo", "partial"]
},

{
  id: "rhy-16th-two-partials",
  mode: "play", category: "rhythm", tags: ["sixteenths", "placement", "constant-motion"],
  title: "16th pairs: {p:pair}",
  level: 5, length: "medium", minutes: 3,
  params: {
    root: ["E", "A", "D", "G"], quality: ["m7", "7", "9"],
    pair: [
      { v: "D--UD--UD--UD--U", label: "1 + a" },
      { v: "DU--DU--DU--DU--", label: "1 + e" },
      { v: "--DU--DU--DU--DU", label: "& + a", lvl: 1 },
      { v: "-UD--UD--UD--UD-", label: "e + &", lvl: 1 },
      { v: "-U-U-U-U-U-U-U-U", label: "e + a (all upstrokes)", lvl: 2 }
    ]
  },
  prompt: "Constant 16th motion on **{chord}**. Hit only **{p:pair}** in every beat and let the rest be air strums.",
  goal: "Two clean, even hits per beat in the right places for 8 bars.",
  tempo: { start: 60, min: 40, max: 110, step: 4, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0, accent: true },
  hints: [
    "Hum the rhythm before you play it. Each pair has its own 'word' (e.g. 1 + a sounds like a gallop).",
    "\"e + a\" is all upstrokes, which shows how much the up-strum has to carry in funk."
  ],
  explain: `### Building a vocabulary
Each pair of partials is a rhythmic 'cell' you'll hear constantly in funk, R&B and Latin music. Once every pair feels natural you can read or improvise any 16th-note strum.`,
  visual: { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pattern: "$pair", chord: { root: "$root", quality: "$quality" } },
  demo: { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pattern: "$pair", chord: { root: "$root", quality: "$quality" } },
  concepts: ["constant-motion", "subdivisions"],
  vary: ["tempo", "pair", "root"]
},

{
  id: "rhy-8-to-16-switch",
  mode: "play", category: "rhythm", tags: ["switching", "eighths", "sixteenths"],
  title: "Switch: eighths ↔ sixteenths",
  level: 4, length: "medium", minutes: 3,
  params: { root: ["E", "A", "D", "G"], quality: ["min", "7", "maj"] },
  prompt: "Hold **{chord}**. Bar 1: **eighths**. Bar 2: **sixteenths**. Your hand keeps moving in 16ths the whole time, so the eighths come out as all downstrokes.",
  goal: "Bar 2 sits exactly twice as dense as bar 1, and the beat never moves.",
  tempo: { start: 60, min: 40, max: 110, step: 4, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0, accent: true },
  hints: [
    "Count \"1 e & a\" through both bars, even when you're only playing 1 and &.",
    "The classic error is rushing into the 16th bar. Lean back slightly on the downbeat of bar 2.",
    "Variation: play the eighths down-up at half the hand speed, then double it. That's harder, because now the motion itself changes."
  ],
  explain: `### Two ways to switch
1. **Constant 16th motion** (shown): the hand never changes speed, and you add or drop the e and a. This is easiest and most 'funk'.
2. **Changing hand speed**: eighths are D-U at one speed, then 16ths are D-U at twice the speed. This is harder, and it's what single-note lines require.

Master version 1 first.`,
  visual: { type: "rhythm", meter: "4/4", grid: 4, bars: 2, pattern: "D-D-D-D-D-D-D-D- | DUDUDUDUDUDUDUDU", accents: [0, 16], chord: { root: "$root", quality: "$quality" } },
  demo: { type: "rhythm", meter: "4/4", grid: 4, bars: 2, pattern: "D-D-D-D-D-D-D-D- | DUDUDUDUDUDUDUDU", accents: [0, 16], chord: { root: "$root", quality: "$quality" } },
  concepts: ["subdivisions", "constant-motion"],
  vary: ["tempo", "root", "quality"]
},

{
  id: "rhy-8-to-triplet-switch",
  mode: "play", category: "rhythm", tags: ["switching", "eighths", "triplets"],
  title: "Switch: eighths ↔ triplets",
  level: 4, length: "medium", minutes: 3,
  prompt: "Muted strings. Bar 1: **two per click** (eighths). Bar 2: **three per click** (triplets). Count \"1 & 2 & ...\" then \"1-trip-let 2-trip-let ...\".",
  goal: "Both bars are perfectly even and the change happens exactly on the downbeat.",
  tempo: { start: 60, min: 40, max: 110, step: 4, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0, accent: true },
  hints: [
    "The danger is that the triplets turn into a shuffle or the eighths turn into triplets. Listen for the 'square' versus 'round' feel.",
    "The grid is 6 slots per beat: eighths land on slots 1 and 4, triplets on 1, 3 and 5.",
    "Speak it while playing. Your voice is the reference."
  ],
  explain: `### Duple vs triple
Eighths split the beat into **2**, triplets into **3**. Both fit on a 6-slot grid (sextuplets), which is how the engine draws this exercise. The same 'common grid' idea is the key to every polyrhythm later on.

Switching between 2 and 3 is the subdivision weakness most often heard in intermediate players, so give this card real attention.`,
  visual: { type: "rhythm", meter: "4/4", grid: 6, bars: 2, pattern: "d--u--d--u--d--u--d--u-- | d-u-d-u-d-u-d-u-d-u-d-u-", accents: [0, 6, 12, 18, 24, 30, 36, 42], title: "2 per beat, then 3 per beat (6-slot grid)" },
  demo: { type: "rhythm", meter: "4/4", grid: 6, bars: 2, pattern: "d--u--d--u--d--u--d--u-- | d-u-d-u-d-u-d-u-d-u-d-u-", accents: [0, 6, 12, 18, 24, 30, 36, 42] },
  concepts: ["subdivisions", "triplets", "polyrhythm"],
  vary: ["tempo"]
},

{
  id: "rhy-16-to-triplet-switch",
  mode: "play", category: "rhythm", tags: ["switching", "sixteenths", "triplets"],
  title: "Switch: sixteenths ↔ triplets",
  level: 5, length: "medium", minutes: 4,
  prompt: "Muted strings. One bar of **16ths** (4 per click), then one bar of **8th-note triplets** (3 per click). Loop it. Count \"1 e & a\" → \"1-trip-let\".",
  goal: "Two clean cycles at the target tempo with no 'smear' at the bar line.",
  tempo: { start: 56, min: 40, max: 100, step: 4, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0, accent: true },
  hints: [
    "The triplets are *slower* notes than the 16ths. Players often rush them.",
    "Think of the beat as a doorway: both subdivisions must walk through it at the same moment.",
    "Next step: switch every 2 beats (see the 2/4 version of this card)."
  ],
  explain: `### The 4 ↔ 3 switch
This is the hardest common switch, because 4 and 3 share only the downbeat. Practise it with strong beat accents and counting out loud. Speed comes later.

The demo plays a bar of 16ths followed by a bar of triplets so you can hear both sides of the switch.`,
  visual: { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pattern: "dudu dudu dudu dudu", accents: [0, 4, 8, 12], title: "Bar A: 16ths (then Bar B: triplets — see demo)" },
  demo: [
    { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pattern: "dudu dudu dudu dudu", accents: [0, 4, 8, 12], title: "16ths" },
    { type: "rhythm", meter: "4/4", grid: 3, bars: 1, pattern: "dud udu dud udu", accents: [0, 3, 6, 9], title: "triplets" }
  ],
  concepts: ["subdivisions", "triplets"],
  vary: ["tempo"]
},

{
  id: "rhy-16-triplet-2beat-switch",
  mode: "play", category: "rhythm", tags: ["switching", "sixteenths", "triplets", "advanced"],
  title: "Switch every two beats: 16ths ↔ triplets",
  level: 7, length: "medium", minutes: 4,
  prompt: "Muted strings. **Two beats of 16ths, two beats of triplets**, continuously. Count it all out loud.",
  goal: "Clean switches every half bar at the target tempo for 8 bars.",
  tempo: { start: 56, min: 40, max: 96, step: 4, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0, accent: true },
  hints: [
    "Master the one-bar switch first.",
    "Triplet beat 3 starts on a downstroke and beat 4 on an upstroke, so the next 16th beat starts on a downstroke again.",
    "Record yourself. Smeared switches are easier to hear on playback."
  ],
  explain: `### Faster switching
Switching every two beats forces you to 'pre-hear' the next subdivision while still playing the current one. This is what makes switching sound natural in real solos.`,
  visual: { type: "rhythm", meter: "2/4", grid: 4, bars: 1, pattern: "dudu dudu", accents: [0, 4], title: "Beats 1–2: 16ths (beats 3–4: triplets — see demo)" },
  demo: [
    { type: "rhythm", meter: "2/4", grid: 4, bars: 1, pattern: "dudu dudu", accents: [0, 4], title: "Beats 1–2: 16ths (4 per click)" },
    { type: "rhythm", meter: "2/4", grid: 3, bars: 1, pattern: "dud udu", accents: [0, 3], title: "Beats 3–4: triplets (3 per click)" }
  ],
  concepts: ["subdivisions", "triplets"],
  vary: ["tempo"]
},

{
  id: "rhy-subdivision-ladder",
  mode: "play", category: "rhythm", tags: ["subdivisions", "ladder", "switching"],
  title: "The subdivision ladder: 1-2-3-4-6",
  level: 5, length: "long", minutes: 6,
  prompt: "Muted strings. One bar each of **quarters → 8ths → triplets → 16ths → sextuplets**, then back down. Loop for 5 minutes. Count every bar.",
  goal: "Every rung is even and the beat never moves, up or down the ladder.",
  tempo: { start: 60, min: 40, max: 90, step: 4, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0, accent: true },
  hints: [
    "Sextuplets are two triplets per beat (6 notes). Count \"1-la-li-&-la-li\" (the & lands exactly halfway through the beat).",
    "Coming down the ladder is harder than going up because players rush the slower subdivisions.",
    "Also try it at 50 bpm. Slow tempos expose uneven notes."
  ],
  explain: `### The ladder
This classic drummer's exercise builds the mental 'gearbox' for switching. Each rung adds notes per beat while the beat stays constant: **1, 2, 3, 4, 6**.

The demo plays the way up; mirror it on the way down.`,
  visual: { type: "rhythm", meter: "4/4", grid: 6, bars: 1, pattern: "dudu du dudu du dudu du dudu du", accents: [0, 6, 12, 18], title: "Top rung: sextuplets (6 per beat)" },
  demo: [
    { type: "rhythm", meter: "4/4", grid: 1, bars: 1, pattern: "dddd", accents: [0], title: "Rung 1: quarters (1 per click)" },
    { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pattern: "dudududu", accents: [0, 2, 4, 6], title: "Rung 2: 8ths (2 per click)" },
    { type: "rhythm", meter: "4/4", grid: 3, bars: 1, pattern: "dudududududu", accents: [0, 3, 6, 9], title: "Rung 3: triplets (3 per click)" },
    { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pattern: "dudu dudu dudu dudu", accents: [0, 4, 8, 12], title: "Rung 4: 16ths (4 per click)" },
    { type: "rhythm", meter: "4/4", grid: 6, bars: 1, pattern: "dududu dududu dududu dududu", accents: [0, 6, 12, 18], title: "Rung 5: sextuplets (6 per click)" }
  ],
  concepts: ["subdivisions", "tuplets"],
  vary: ["tempo"]
},

{
  id: "rhy-sextuplets",
  mode: "play", category: "rhythm", tags: ["sextuplets", "accents", "tuplets"],
  title: "Sextuplets: accent {p:target}",
  level: 5, length: "medium", minutes: 3,
  params: {
    target: [
      { v: [0, 6, 12, 18], label: "each beat" },
      { v: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22], label: "every 2nd note (you'll hear triplets)" },
      { v: [0, 3, 6, 9, 12, 15, 18, 21], label: "every 3rd note (you'll hear 8ths: 2 per beat)", lvl: 1 },
      { v: [0, 4, 8, 12, 16, 20], label: "every 4th note (quarter-note triplets: 3 accents per 2 beats)", lvl: 3 }
    ]
  },
  prompt: "Continuous muted **sextuplets** (6 per click, alternating). Accent **{p:target}**.",
  goal: "The accent pattern comes through clearly and the beat stays locked for 8 bars.",
  tempo: { start: 50, min: 36, max: 90, step: 4, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0, accent: true },
  hints: [
    "With 6 per beat (an even number), every beat starts with a downstroke again.",
    "Accenting every 2nd note gives triplets; every 3rd gives 'two per beat'. Sextuplets contain both.",
    "Every 4th note gives 3 accents over 2 beats, which is 3:2 hidden inside the sextuplet."
  ],
  explain: `### Six per beat
A sextuplet is **6 equal notes per beat**, which you can hear as 2 × 3 (two triplet groups) or as 3 × 2. Shifting the accent changes which you hear, and it's a great ear-and-hand bridge between duple and triple feels.`,
  visual: { type: "rhythm", meter: "4/4", grid: 6, bars: 1, pattern: "dududu dududu dududu dududu", accents: "$target" },
  demo: { type: "rhythm", meter: "4/4", grid: 6, bars: 1, pattern: "dududu dududu dududu dududu", accents: "$target" },
  concepts: ["tuplets", "accents-ghosts", "polyrhythm"],
  vary: ["tempo", "target"]
},

{
  id: "rhy-sextuplet-16th-switch",
  mode: "play", category: "rhythm", tags: ["switching", "sextuplets", "sixteenths"],
  title: "Switch: sixteenths ↔ sextuplets",
  level: 6, length: "medium", minutes: 3,
  prompt: "Muted strings. One bar of **16ths** (4 per click), one bar of **sextuplets** (6 per click).",
  goal: "A clean 'gear change' at each bar line for 8 bars.",
  tempo: { start: 50, min: 36, max: 84, step: 4, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0, accent: true },
  hints: [
    "Sextuplets are 1.5× as dense as 16ths. The hand speeds up noticeably.",
    "Accent the beat hard in the sextuplet bar or it smears into a blur."
  ],
  explain: `### 4 vs 6
Rock and metal players often play sextuplets when they 'shred'. Being able to switch cleanly between 4 and 6 is what separates controlled speed from runaway speed.`,
  visual: { type: "rhythm", meter: "4/4", grid: 6, bars: 1, pattern: "dududu dududu dududu dududu", accents: [0, 6, 12, 18], title: "Bar B: sextuplets (bar A: 16ths — see demo)" },
  demo: [
    { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pattern: "dudu dudu dudu dudu", accents: [0, 4, 8, 12], title: "Bar A: 16ths (4 per click)" },
    { type: "rhythm", meter: "4/4", grid: 6, bars: 1, pattern: "dududu dududu dududu dududu", accents: [0, 6, 12, 18], title: "Bar B: sextuplets (6 per click)" }
  ],
  concepts: ["tuplets", "subdivisions"],
  vary: ["tempo"]
},

{
  id: "rhy-quintuplets",
  mode: "play", category: "rhythm", tags: ["quintuplets", "tuplets", "advanced"],
  title: "Quintuplets: five per click",
  level: 6, length: "medium", minutes: 3,
  prompt: "Muted strings, **five even strokes per click**, alternating down-up. Count \"**1**-2-3-4-5\" or \"**un**-i-ver-si-ty\", with the accent on each beat.",
  goal: "Five equal notes, not 4+1 or a triplet plus two, for 8 bars.",
  tempo: { start: 50, min: 36, max: 80, step: 4, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0, accent: true },
  hints: [
    "Say 'hip-po-pot-a-mus' or 'u-ni-ver-si-ty' evenly, then strum along with your voice.",
    "Five is odd, so beats alternate between starting on a down- and an upstroke, just like triplets.",
    "Check yourself by switching to 16ths. The quintuplet should feel slightly 'crowded', not double."
  ],
  explain: `### Quintuplets
A quintuplet squeezes **5 equal notes into one beat**. It has no natural sub-grouping, so your body can't 'cheat' with a familiar feel. That makes it a great test of true evenness and a common colour in modern fusion lines.

Practise quintuplets slowly with speech syllables. The goal is feel, not speed.`,
  visual: { type: "rhythm", meter: "4/4", grid: 5, bars: 1, pattern: "dudud ududu dudud ududu", accents: [0, 5, 10, 15], title: "5 per beat: un-i-ver-si-ty" },
  demo: { type: "rhythm", meter: "4/4", grid: 5, bars: 1, pattern: "dudud ududu dudud ududu", accents: [0, 5, 10, 15] },
  concepts: ["tuplets"],
  vary: ["tempo"]
},

{
  id: "rhy-tuplet-ladder-456",
  mode: "play", category: "rhythm", tags: ["quintuplets", "sextuplets", "switching", "tuplets", "advanced"],
  title: "Tuplet ladder: 4 → 5 → 6 → 5 → 4",
  level: 8, length: "long", minutes: 6,
  prompt: "Muted strings or a single note. One bar each of **16ths → quintuplets → sextuplets → quintuplets → 16ths**, and loop.",
  goal: "Three clean round-trips at the target tempo.",
  tempo: { start: 50, min: 36, max: 80, step: 2, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0, accent: true },
  hints: [
    "The 5 is the 'odd one out'. Feel it as slightly faster than 4 and slightly slower than 6.",
    "Use speech: 'pine-ap-ple-tree', 'u-ni-ver-si-ty', 'hip-po-pot-a-mus-es'.",
    "Do this for a few minutes per session over weeks. It's a long-term card."
  ],
  explain: `### Why bother?
Players like Guthrie Govan and Allan Holdsworth move fluidly between 4, 5, 6 and 7 notes per beat, so their lines float over the bar. You don't need 7s to sound modern. Smooth 4–5–6 switching already frees your phrasing from the 16th-note grid.`,
  visual: { type: "rhythm", meter: "4/4", grid: 5, bars: 1, pattern: "dudud ududu dudud ududu", accents: [0, 5, 10, 15], title: "The middle rung: quintuplets" },
  demo: [
    { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pattern: "dudu dudu dudu dudu", accents: [0, 4, 8, 12], title: "Bar 1: 16ths (4 per click)" },
    { type: "rhythm", meter: "4/4", grid: 5, bars: 1, pattern: "dudud ududu dudud ududu", accents: [0, 5, 10, 15], title: "Bar 2: quintuplets (5 per click)" },
    { type: "rhythm", meter: "4/4", grid: 6, bars: 1, pattern: "dududu dududu dududu dududu", accents: [0, 6, 12, 18], title: "Bar 3: sextuplets (6 per click)" },
    { type: "rhythm", meter: "4/4", grid: 5, bars: 1, pattern: "dudud ududu dudud ududu", accents: [0, 5, 10, 15], title: "Bar 4: quintuplets again (then the loop returns to 16ths)" }
  ],
  concepts: ["tuplets", "subdivisions"],
  vary: ["tempo"]
},

{
  id: "rhy-gap-click-8ths",
  mode: "play", category: "rhythm", tags: ["gap-click", "time", "strumming"],
  title: "Gap click: {p:gap}",
  level: 3, length: "medium", minutes: 3,
  params: {
    root: ["G", "C", "D", "A", "E"], quality: ["maj", "min"],
    gap: [
      { v: { play: 2, mute: 2 }, label: "2 bars on, 2 bars silent" },
      { v: { play: 2, mute: 4 }, label: "2 bars on, 4 bars silent", lvl: 1 },
      { v: { play: 1, mute: 3 }, label: "1 bar on, 3 bars silent", lvl: 2 }
    ]
  },
  prompt: "Strum **{chord}** in steady down-up eighths with accents on 2 and 4. The click plays **{p:gap}**. Your job is to still be exactly on the click when it comes back.",
  goal: "When the click returns it lands right on your downbeat, 4 times in a row.",
  tempo: { start: 80, min: 60, max: 140, step: 5, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0, accent: true, gap: "$gap" },
  hints: [
    "Count bars out loud during the silence: \"ONE 2 3 4, TWO 2 3 4\".",
    "Most people rush in the gap. If you land early, relax and lean back.",
    "Tap your foot. It's your own internal click."
  ],
  explain: `### Gap click
A metronome can become a crutch: you follow it rather than *own* the time. Muting the click for a few bars shows how steady your internal clock really is. Drummers use this constantly, and it's the fastest way to make your time trustworthy.`,
  visual: { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pattern: "DUDUDUDU", accents: [2, 6], chord: { root: "$root", quality: "$quality" } },
  demo: { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pattern: "DUDUDUDU", accents: [2, 6], chord: { root: "$root", quality: "$quality" } },
  concepts: ["gap-click", "pocket"],
  vary: ["tempo", "gap", "root"]
},

{
  id: "rhy-gap-click-16ths",
  mode: "play", category: "rhythm", tags: ["gap-click", "sixteenths", "time"],
  title: "Gap click with 16ths: {p:gap}",
  level: 5, length: "medium", minutes: 3,
  params: {
    gap: [
      { v: { play: 2, mute: 2 }, label: "2 on / 2 off" },
      { v: { play: 1, mute: 3 }, label: "1 on / 3 off", lvl: 1 },
      { v: { play: 1, mute: 7 }, label: "1 on / 7 off", lvl: 3 }
    ]
  },
  prompt: "Muted 16th strumming with accents on 2 and 4. The click plays **{p:gap}**. Keep the 16ths even through the silence.",
  goal: "You land on the click every time it returns, and the 16ths never speed up.",
  tempo: { start: 70, min: 50, max: 110, step: 4, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0, accent: true, gap: "$gap" },
  hints: [
    "16ths tend to speed up in silence as the hand gets excited. Make them deliberately relaxed.",
    "Breathe. Holding your breath tightens the arm and speeds you up."
  ],
  explain: `### Internal time at the 16th level
At the 16th level, small tempo drifts add up fast. If you survive 7 silent bars at 90 bpm, your internal clock is studio-ready.`,
  visual: { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pattern: "dudu Dudu dudu Dudu", accents: [4, 12] },
  demo: { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pattern: "dudu Dudu dudu Dudu", accents: [4, 12] },
  concepts: ["gap-click", "subdivisions"],
  vary: ["tempo", "gap"]
},

{
  id: "rhy-gap-click-triplets",
  mode: "play", category: "rhythm", tags: ["gap-click", "triplets", "time"],
  title: "Gap click with triplets",
  level: 5, length: "medium", minutes: 3,
  params: { root: ["A", "E", "D"], quality: ["7", "min"] },
  prompt: "Continuous triplets on **{chord}**, accenting each beat. Click is **2 bars on, 2 bars off**.",
  goal: "The triplets stay triplets (no drift toward 16ths or shuffle) and you return on the click.",
  tempo: { start: 60, min: 40, max: 110, step: 4, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0, accent: true, gap: { play: 2, mute: 2 } },
  hints: [
    "Say 'trip-o-let' through the gap.",
    "The accented upstroke on beats 2 and 4 is the usual place to lose it."
  ],
  explain: `### Triplets without support
Triplets drift more than any other subdivision, because 3 is 'round' and easily slides toward a shuffle (long-short) or speeds up. The gap shows you which way you drift.`,
  visual: { type: "rhythm", meter: "4/4", grid: 3, bars: 1, pattern: "DUDUDUDUDUDU", accents: [0, 3, 6, 9], chord: { root: "$root", quality: "$quality" } },
  demo: { type: "rhythm", meter: "4/4", grid: 3, bars: 1, pattern: "DUDUDUDUDUDU", accents: [0, 3, 6, 9], chord: { root: "$root", quality: "$quality" } },
  concepts: ["gap-click", "triplets"],
  vary: ["tempo"]
},

{
  id: "rhy-click-2-4-swing",
  mode: "play", category: "rhythm", tags: ["click-2-4", "swing", "time", "jazz"],
  title: "Click on 2 & 4: swing eighths",
  level: 3, length: "medium", minutes: 3,
  params: { root: ["F", "Bb", "C", "G"], quality: ["7", "m7", "6"] },
  prompt: "Set the click to sound **only on beats 2 and 4**. Strum swung eighths on **{chord}** and feel the click as the hi-hat/snare backbeat. *You* provide beats 1 and 3.",
  goal: "16 bars without the click 'flipping' onto 1 and 3.",
  tempo: { start: 80, min: 60, max: 180, step: 5, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0.67, accent: false, clickOn: "2&4", swingHint: false },
  hints: [
    "Before you play, count \"1 (click) 3 (click)\" for a bar or two, saying 'one' and 'three' out loud.",
    "If the click flips to 1 and 3, stop, recount and restart. That's normal at first.",
    "In jazz the hi-hat closes on 2 and 4. This is how swing feels from the inside."
  ],
  explain: `### Why click on 2 and 4?
Jazz and much pop/R&B are built on the **backbeat**. With the click on 2 and 4 you have to supply beats 1 and 3 internally, which is both more musical and a stronger test of time. It's one of the most widely recommended jazz time exercises.

### Check yourself
- Say "**1** (click) **3** (click)" out loud while you play. If the click starts to feel like "1" and "3", it has *flipped*: stop and recount.
- Your swung upstroke (the &) should land on the last third of the beat — "1-trip-**let**" — not halfway.
- Play 16 bars, then stop playing but keep counting: the click must still land on *your* 2 and 4.

Start at moderate tempos (100–140). Very slow and very fast are both harder.`,
  visual: { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pattern: "DUDUDUDU", accents: [2, 6], swing: 0.67, chord: { root: "$root", quality: "$quality" } },
  demo: { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pattern: "DUDUDUDU", accents: [2, 6], swing: 0.67, chord: { root: "$root", quality: "$quality" } },
  concepts: ["click-placement", "swing"],
  vary: ["tempo", "root"],
  source: "Common jazz pedagogy; e.g. Premier Guitar, 'Rhythm Rules: 6 Essential Exercises to Improve Your Groove' (click as the backbeat on 2 and 4)"
},

{
  id: "rhy-click-2-4-funk",
  mode: "play", category: "rhythm", tags: ["click-2-4", "sixteenths", "funk", "time"],
  title: "Click on 2 & 4: straight 16ths",
  level: 4, length: "medium", minutes: 3,
  params: { root: ["E", "A", "D"], quality: ["m7", "9"] },
  prompt: "Click on **2 and 4 only**. Strum muted 16ths and land a real **{chord}** strum on each click (the backbeat).",
  goal: "Your chord on 2 and 4 covers the click for 16 bars.",
  tempo: { start: 80, min: 60, max: 120, step: 4, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0, accent: false, clickOn: "2&4" },
  hints: [
    "The chord on 2 and 4 is a downstroke (it's a number).",
    "Keep the ghost strokes so quiet that the backbeat really pops."
  ],
  explain: `### The backbeat as an anchor
Funk and R&B guitarists often lock to the snare on 2 and 4 rather than to the kick. Hearing the click as the snare trains that orientation.`,
  visual: { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pattern: "dudu Dudu dudu Dudu", accents: [4, 12], chord: { root: "$root", quality: "$quality" } },
  demo: { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pattern: "dudu Dudu dudu Dudu", accents: [4, 12], chord: { root: "$root", quality: "$quality" } },
  concepts: ["click-placement", "accents-ghosts"],
  vary: ["tempo", "root"]
},

{
  id: "rhy-click-downbeat-only",
  mode: "play", category: "rhythm", tags: ["click-placement", "time", "sixteenths"],
  title: "One click per bar",
  level: 6, length: "medium", minutes: 3,
  prompt: "The click sounds **only on beat 1** of each bar. Strum muted 16ths with accents on every beat and land on the next downbeat exactly.",
  goal: "8 bars where every downbeat coincides with the click.",
  tempo: { start: 70, min: 50, max: 110, step: 4, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0, accent: true, clickOn: "1" },
  hints: [
    "This is a 'gap click' inside every bar. Count \"1 e & a 2 e & a ...\" all the way through.",
    "Next: combine it with the gap-click cards for even longer stretches without a reference."
  ],
  explain: `### Sparse clicks
The less often the click sounds, the more responsibility you take for the time. One click per bar is a big step toward playing without a metronome while staying honest.`,
  visual: { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pattern: "Dudu Dudu Dudu Dudu", accents: [0, 4, 8, 12] },
  demo: { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pattern: "Dudu Dudu Dudu Dudu", accents: [0, 4, 8, 12] },
  concepts: ["click-placement", "gap-click"],
  vary: ["tempo"]
},

{
  id: "rhy-tresillo-8ths",
  mode: "play", category: "rhythm", tags: ["cells", "tresillo", "3-3-2", "accents"],
  title: "3-3-2: the tresillo",
  level: 3, length: "short", minutes: 2,
  params: { root: ["E", "A", "D", "G"], quality: ["5", "min", "maj"] },
  prompt: "Hold **{chord}** and play the **3-3-2** rhythm: hits on **1, the & of 2, and 4**. Keep your hand moving in eighths; the in-between strokes are air strums.",
  goal: "The rhythm grooves and repeats evenly for 8 bars.",
  tempo: { start: 80, min: 60, max: 160, step: 5, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 2, swing: 0, accent: true },
  hints: [
    "Count eighths: **1** & 2 **&** 3 & **4** &. That's 3 + 3 + 2 eighths.",
    "The hit on the & of 2 is an **upstroke**.",
    "You know this rhythm from rock riffs, reggaeton, Latin music and rumba flamenca."
  ],
  explain: `### The tresillo
**3+3+2**: eight 8th notes grouped 3, 3, 2, with hits on **1, the & of 2, and 4**. *Tresillo* is the name used in Afro-Cuban music, and it's one of the most widespread rhythmic cells in popular music: it underlies rumba flamenca, reggaeton, many rock and rockabilly riffs and a lot of Latin American music. Add a hit on beat 3 and you get the **habanera** (1, &2, 3, 4), its close relative.

It doesn't divide the bar into equal halves, which is why it feels like it 'pulls' against the beat.

### Check yourself
- Clap it while saying all eight 8ths: "**1** & 2 **&** 3 & **4** &". The loud syllables are the hits.
- The gaps are long-long-short (3, 3, 2). If the middle hit drifts onto beat 2 or beat 3, you've lost the shape.
- Your hand keeps going down-up; the middle hit must come out as an **upstroke**. If it's a downstroke, your hand stopped.`,
  visual: { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pattern: "D--U--D-", accents: [0, 3, 6], chord: { root: "$root", quality: "$quality" } },
  demo: { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pattern: "D--U--D-", accents: [0, 3, 6], chord: { root: "$root", quality: "$quality" } },
  concepts: ["rhythmic-cells", "groupings"],
  vary: ["tempo", "root"]
},

{
  id: "rhy-cells-clave",
  mode: "play", category: "rhythm", tags: ["cells", "clave", "latin", "afro-cuban"],
  title: "Rhythmic cells: {p:cell}",
  level: 4, length: "medium", minutes: 3,
  params: {
    root: ["A", "D", "E", "G"], quality: ["min", "m7", "7"],
    cell: [
      { v: "D--U--D-D--U--D-", label: "tresillo (3-3-2)" },
      { v: "D--UD-D-D--UD-D-", label: "habanera" },
      { v: "D-DU-UD-D-DU-UD-", label: "cinquillo", lvl: 1 },
      { v: "D--U--D---D-D---", label: "son clave 3-2", lvl: 1 },
      { v: "--D-D---D--U--D-", label: "son clave 2-3", lvl: 1 },
      { v: "D--U---U--D-D---", label: "rumba clave 3-2", lvl: 2 },
      { v: "D--U--D---D--U--", label: "bossa nova clave", lvl: 2 }
    ]
  },
  prompt: "Hold **{chord}** and strum the **{p:cell}** pattern (two bars) with your hand moving in 8ths. Then clap it while counting.",
  goal: "You can play it, clap it and count it at the target tempo without looking.",
  tempo: { start: 80, min: 60, max: 140, step: 5, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 2, swing: 0, accent: true },
  hints: [
    "Notes on the & are upstrokes.",
    "Clave patterns are 2 bars long. The '3' side has three hits and the '2' side has two.",
    "Fun fact: the cinquillo pattern is the famous 'D-DU-UD' strum minus the last upstroke."
  ],
  explain: `### Cells and clave
A **rhythmic cell** is a short, recognisable rhythm that a whole style is built on. **Clave** (Spanish for 'key') is a 2-bar cell that organises Afro-Cuban music: every other part is phrased in relation to it.
- **Son clave 3-2**: 1, &2, 4 | 2, 3
- **Rumba clave**: the third note is pushed one 8th later (&4 instead of 4)
- **Bossa clave**: the last note is pushed (&3 instead of 3)

Notated here in 4/4 eighths (one 8th = one slot). Traditional notation often writes these in 2/2 or 2/4 with 16ths, which sounds the same.`,
  visual: { type: "rhythm", meter: "4/4", grid: 2, bars: 2, pattern: "$cell", chord: { root: "$root", quality: "$quality" } },
  demo: { type: "rhythm", meter: "4/4", grid: 2, bars: 2, pattern: "$cell", chord: { root: "$root", quality: "$quality" } },
  concepts: ["clave", "rhythmic-cells"],
  vary: ["tempo", "cell"]
},

{
  id: "rhy-afro-6-8-bell",
  mode: "play", category: "rhythm", tags: ["cells", "12-8", "bell", "afro-cuban", "triplets"],
  title: "The 12/8 bell pattern",
  level: 6, length: "medium", minutes: 3,
  params: { root: ["A", "E", "D"], quality: ["min", "m7"] },
  prompt: "Meter is 12/8, with one click per 8th note. Strum **{chord}** on the 7 strokes of the standard West African/Afro-Cuban **bell pattern**: x.x.xx.x.x.x. Then tap your foot on every 3rd eighth (the 4 big beats).",
  goal: "You can keep the bell going against a 4-beat foot tap for 8 cycles.",
  tempo: { start: 120, min: 90, max: 240, step: 10, unit: "bpm" },
  metronome: { meter: "12/8", subdivision: 1, swing: 0, accent: true, accentBeats: [0, 3, 6, 9] },
  hints: [
    "Group it as 2+2+1+2+2+2+1 eighths.",
    "The foot (every 3rd eighth) lines up with a bell stroke only on pulses 1 and 10. Elsewhere it falls between strokes, and that's the tension.",
    "Leave out two of the strokes and you get a 5-stroke '6/8 clave' (see the explanation)."
  ],
  explain: `### The standard bell
This 7-stroke, 12-pulse pattern (in Cuban music often called the *bembé* bell) is the timeline of much West African and Afro-Cuban 6/8 music. It is felt in **four big beats of three 8ths** (the grid counts them *1 & a 2 & a 3 & a 4 & a*), but its strokes also suggest groups of two, so it carries a built-in 3-against-2 tension.

It contains the strokes of both triple-pulse claves: drop pulses 6 and 12 and you get the son-type 6/8 clave (x.x.x..x.x..); drop 5 and 12 and you get the rumba-type, which is the form most often called '6/8 clave'.

### Check yourself
- Tap your foot on the four big beats (the louder clicks). Bell strokes coincide with your foot only on big beat 1 and big beat 4 ("4" = pulse 10).
- Say all twelve pulses while you play; a stroke falls on each bold syllable: **1** & **a** 2 **&** **a** 3 **&** a **4** & **a**.
- If it starts to feel like even 8ths in 4/4, your gaps have become equal. The pattern is 2-2-1-2-2-2-1.

Tempo note: each click is one 8th note (three clicks per big beat).`,
  visual: { type: "rhythm", meter: "12/8", grid: 1, bars: 1, pattern: "D.D.DU.U.U.U", accents: [0], count: "compound", chord: { root: "$root", quality: "$quality" } },
  demo: { type: "rhythm", meter: "12/8", grid: 1, bars: 1, pattern: "D.D.DU.U.U.U", accents: [0], count: "compound", clickAccents: [0, 3, 6, 9], chord: { root: "$root", quality: "$quality" } },
  concepts: ["clave", "polyrhythm", "rhythmic-cells"],
  vary: ["tempo"]
},

{
  id: "rhy-groupings-of-3",
  mode: "play", category: "rhythm", tags: ["groupings", "displacement", "sixteenths", "polyrhythm"],
  title: "16ths in groups of 3 (dotted-8th accents)",
  level: 6, length: "medium", minutes: 4,
  prompt: "Muted 16ths with an **accent every 3rd note**. The accent pattern takes **3 bars** to land on beat 1 again. Keep your foot on the beat.",
  goal: "Three full cycles (9 bars) where both the accents and the beat stay clear.",
  tempo: { start: 60, min: 40, max: 100, step: 4, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0, accent: true },
  hints: [
    "Count '1-2-3 1-2-3' for the groups *and* feel the click. That's the challenge.",
    "Accents alternate down/upstroke because 3 is odd.",
    "This is the 'dotted-8th delay' rhythm (The Edge) and a staple of Chaffee/Gadd-style drumming."
  ],
  explain: `### Groupings across the bar line
Gary Chaffee's *Patterns* books teach drummers to group a stream of notes in 3s, 5s and 7s regardless of the bar line. The groups 'rotate' against the beat until they come back around: 3 × 16 = 48 16ths = 3 bars.

On guitar this is how you build modern-sounding phrases that float over the time instead of sitting square on it.`,
  visual: { type: "rhythm", meter: "4/4", grid: 4, bars: 3, pattern: "dudu dudu dudu dudu | dudu dudu dudu dudu | dudu dudu dudu dudu", accents: [0, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 39, 42, 45] },
  demo: { type: "rhythm", meter: "4/4", grid: 4, bars: 3, pattern: "dudu dudu dudu dudu | dudu dudu dudu dudu | dudu dudu dudu dudu", accents: [0, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 39, 42, 45] },
  concepts: ["groupings", "displacement", "polyrhythm"],
  vary: ["tempo"],
  source: "Gary Chaffee, Patterns: Rhythm & Meter / Sticking Patterns (Alfred)"
},

{
  id: "rhy-groupings-of-5",
  mode: "play", category: "rhythm", tags: ["groupings", "sixteenths", "advanced"],
  title: "16ths in groups of 5",
  level: 7, length: "long", minutes: 5,
  prompt: "Muted 16ths, **accent every 5th note**. The cycle takes **5 bars** to resolve. Count '1-2-3-4-5' for the groups while feeling the beat.",
  goal: "Two full 5-bar cycles with the beat intact.",
  tempo: { start: 56, min: 40, max: 96, step: 4, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0, accent: true },
  hints: [
    "Master groups of 3 first.",
    "Check yourself: the accents land on 1, e of 2, & of 3, a of 4, then beat 2 of bar 2 (bar 2's beat 1 has no accent).",
    "Try a melodic version: a 5-note scale fragment repeated on 16ths."
  ],
  explain: `### Fives
Groups of 5 over a 16th grid are a hallmark of fusion phrasing. Each accent shifts by one 16th per beat, so the pattern sweeps through every partial before returning. It's an excellent displacement trainer.`,
  visual: { type: "rhythm", meter: "4/4", grid: 4, bars: 5, pattern: "dudu dudu dudu dudu | dudu dudu dudu dudu | dudu dudu dudu dudu | dudu dudu dudu dudu | dudu dudu dudu dudu", accents: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75] },
  demo: { type: "rhythm", meter: "4/4", grid: 4, bars: 5, pattern: "dudu dudu dudu dudu | dudu dudu dudu dudu | dudu dudu dudu dudu | dudu dudu dudu dudu | dudu dudu dudu dudu", accents: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75] },
  concepts: ["groupings", "displacement"],
  vary: ["tempo"],
  source: "Gary Chaffee, Patterns vol. III: Time Functioning Patterns (Alfred)"
},

{
  id: "rhy-displace-8th",
  mode: "play", category: "rhythm", tags: ["displacement", "eighths", "syncopation"],
  title: "Displacement by 8ths: {p:shift}",
  level: 5, length: "medium", minutes: 3,
  params: {
    root: ["E", "A", "D", "G"], quality: ["7", "m7", "maj"],
    shift: [
      { v: "D..U....", label: "original: 1 and &2" },
      { v: ".U..D...", label: "shifted one 8th later: &1 and 3", lvl: 1 },
      { v: "..D..U..", label: "shifted two 8ths: 2 and &3", lvl: 1 },
      { v: "...U..D.", label: "shifted three 8ths: &2 and 4", lvl: 2 }
    ]
  },
  prompt: "Play the short two-chord figure on **{chord}**, **{p:shift}**. Keep your hand moving in 8ths and choke the chord on the rests.",
  goal: "The displaced figure sounds intentional and the beat stays obvious, for 8 bars.",
  tempo: { start: 80, min: 60, max: 150, step: 5, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0, accent: true },
  hints: [
    "Learn the original first, then move it while keeping the same *shape* (long gap, short gap).",
    "Notes on the & are upstrokes.",
    "Release fretting-hand pressure for the rests (`.`). Short chords make displacement audible."
  ],
  explain: `### Rhythmic displacement
Displacement means moving the **same figure** to a different place in the bar. The notes don't change, only their relationship to the beat, and the result can sound completely new. It's a key improvising and comping device (think Charleston vs reverse Charleston).`,
  visual: { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pattern: "$shift", chord: { root: "$root", quality: "$quality" } },
  demo: { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pattern: "$shift", chord: { root: "$root", quality: "$quality" } },
  concepts: ["displacement", "syncopation"],
  vary: ["tempo", "shift"]
},

{
  id: "rhy-displace-16th",
  mode: "play", category: "rhythm", tags: ["displacement", "sixteenths", "syncopation", "funk"],
  title: "Displacement by 16ths: {p:shift}",
  level: 7, length: "medium", minutes: 4,
  params: {
    root: ["E", "A", "D"], quality: ["m7", "9", "7"],
    shift: [
      { v: "D--U--D-D--U--D-", label: "original (3-3-2 in 16ths)" },
      { v: "-U--D--U-U--D--U", label: "one 16th later", lvl: 1 },
      { v: "D-D--U--D-D--U--", label: "two 16ths later", lvl: 1 },
      { v: "-U-U--D--U-U--D-", label: "three 16ths later", lvl: 2 }
    ]
  },
  prompt: "16th-note 3-3-2 figure on **{chord}**, **{p:shift}**. Constant 16th motion; hit only the written slots.",
  goal: "Clean placement at the target tempo; the figure is recognisable in every displacement.",
  tempo: { start: 60, min: 40, max: 100, step: 4, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0, accent: true },
  hints: [
    "Count '1 e & a' aloud and say the hits louder.",
    "The 'two 16ths later' version starts on the beat but feels different — notice how the phrase seems to begin elsewhere.",
    "Pattern wraps around the bar line — the last hit of a displaced version may feel like a pickup."
  ],
  explain: `### Displacement at the 16th level
Shifting a figure by a 16th is how funk and fusion players create endless variations from one idea. The figure's internal spacing (3-3-2) stays; only its phase against the beat changes.`,
  visual: { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pattern: "$shift", chord: { root: "$root", quality: "$quality" } },
  demo: { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pattern: "$shift", chord: { root: "$root", quality: "$quality" } },
  concepts: ["displacement", "groupings"],
  vary: ["tempo", "shift"]
},

{
  id: "rhy-swing-ratio",
  mode: "play", category: "rhythm", tags: ["swing", "feel", "eighths"],
  title: "Swing ratio: {p:feel}",
  level: 3, length: "short", minutes: 2,
  params: {
    root: ["G", "C", "F", "A"], quality: ["7", "6", "m7"],
    feel: [
      { v: 0, label: "straight 8ths" },
      { v: 0.33, label: "light swing" },
      { v: 0.67, label: "triplet swing (shuffle)", lvl: 1 }
    ]
  },
  prompt: "Strum down-up eighths on **{chord}** with a **{p:feel}** feel. Listen to the demo first and match the long-short proportion exactly.",
  goal: "Your 8ths match the demo's ratio for 8 bars.",
  tempo: { start: 90, min: 60, max: 180, step: 5, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 2, swing: "$feel", accent: true },
  hints: [
    "Triplet swing: the downstroke lasts 2 triplets, the upstroke 1 ('**1**-trip-**let**' with the 'trip' silent).",
    "Light swing sits between straight and triplet: the & is a little late, but not as late as the triplet's 'let'.",
    "At fast tempos swing naturally straightens out; at slow and medium tempos it's usually close to (or even beyond) the triplet."
  ],
  explain: `### Swing is a ratio
Swing lengthens the on-beat 8th and shortens the off-beat 8th.
- **Straight** = 1:1: the & is exactly halfway between clicks (rock, pop, bossa, funk).
- **Triplet swing** = 2:1: the & sits on the last note of a triplet (blues shuffle, swing jazz). This is what "swung 8ths" means on most charts.
- **Light swing** ≈ 1.4:1 here: a lazier straight feel, common in some pop, R&B and fast jazz.

Measurements of jazz drummers' ride-cymbal patterns (Friberg & Sundström, 2002) found that the swing ratio **gets smaller as the tempo gets faster**, and that soloists tend to swing less than the drummer. So no single ratio is "correct", but you should be able to choose one on purpose.

### Check yourself
- Turn on the triplet metronome (subdivision 3): in triplet swing your upstroke lands exactly on the **third** click of each beat; in straight 8ths it falls between the 2nd and 3rd.
- Switch the **feel** param back and forth on the same chord. You should be able to hear and play all three on demand.`,
  visual: { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pattern: "DUDUDUDU", accents: [2, 6], swing: "$feel", chord: { root: "$root", quality: "$quality" } },
  demo: { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pattern: "DUDUDUDU", accents: [2, 6], swing: "$feel", chord: { root: "$root", quality: "$quality" } },
  concepts: ["swing"],
  vary: ["tempo", "feel"]
},

{
  id: "rhy-swing-16ths",
  mode: "play", category: "rhythm", tags: ["swing", "sixteenths", "neo-soul", "feel"],
  title: "Swung 16ths (neo-soul / hip-hop feel)",
  level: 6, length: "medium", minutes: 3,
  params: { root: ["E", "A", "D", "F"], quality: ["m9", "maj9", "m7"], feel: [{ v: 0.33, label: "light 16th swing" }, { v: 0.5, label: "heavier 16th swing", lvl: 1 }] },
  prompt: "Muted 16ths with **{p:feel}** on **{chord}**: the e and a arrive late. Accent 2 and 4.",
  goal: "Your swung 16ths match the demo and stay consistent for 8 bars.",
  tempo: { start: 76, min: 60, max: 100, step: 4, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0, accent: true },
  hints: [
    "Same idea as swung 8ths, one level down: the upstrokes (e, a) are delayed; the beat and the & don't move.",
    "Think of neo-soul and hip-hop grooves (D'Angelo, J Dilla's productions): lazy-sounding but consistent.",
    "The metronome clicks only the beat here, so the swing has to come from you; compare with the demo."
  ],
  explain: `### 16th-note swing
In funk, neo-soul and hip-hop, swing can apply at the **16th** level: the e and a are pushed late while the beat and & stay put. Small amounts make a groove feel human; larger amounts sound lazier. (The famous 'drunk' feel of J Dilla's beats comes from deliberately loose, unquantized placement, not just one swing setting.)

### Check yourself
- Your **&** must still land exactly halfway between clicks; only the e and a move.
- Play a bar straight, then a bar swung: the difference should be audible but the beat must not shift.`,
  visual: { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pattern: "dudu Dudu dudu Dudu", accents: [4, 12], swing: "$feel", chord: { root: "$root", quality: "$quality" } },
  demo: { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pattern: "dudu Dudu dudu Dudu", accents: [4, 12], swing: "$feel", chord: { root: "$root", quality: "$quality" } },
  concepts: ["swing", "pocket"],
  vary: ["tempo", "feel"]
},

{
  id: "rhy-odd-5-4",
  mode: "play", category: "rhythm", tags: ["odd-meter", "5-4"],
  title: "5/4 grouped {p:group}",
  level: 5, length: "medium", minutes: 3,
  params: {
    root: ["E", "A", "D"], quality: ["min", "m7"],
    group: [{ v: [0, 6], label: "3+2" }, { v: [0, 4], label: "2+3" }]
  },
  prompt: "5/4, down-up eighths on **{chord}**. Accent the start of each group (**{p:group}**) and count \"1 2 3 1 2\" (or \"1 2 1 2 3\").",
  goal: "16 bars of 5/4 without losing the 'one'.",
  tempo: { start: 100, min: 70, max: 180, step: 5, unit: "bpm" },
  metronome: { meter: "5/4", subdivision: 1, swing: 0, accent: true },
  hints: [
    "5/4 almost always splits into 3+2 or 2+3. Feel it as one 'long' and one 'short' step.",
    "Count group-numbers, not 1–5: 'ONE-two-three-ONE-two'."
  ],
  explain: `### Odd meters are groupings
An 'odd' meter is just a bar made of uneven groups of 2s and 3s. **5/4 = 3+2 or 2+3**. Once you feel the groups, odd meters stop being counting exercises and start to groove (think 'Take Five' or 'Mission: Impossible').`,
  visual: { type: "rhythm", meter: "5/4", grid: 2, bars: 1, pattern: "DUDUDUDUDU", accents: "$group", chord: { root: "$root", quality: "$quality" } },
  demo: { type: "rhythm", meter: "5/4", grid: 2, bars: 1, pattern: "DUDUDUDUDU", accents: "$group", chord: { root: "$root", quality: "$quality" } },
  concepts: ["odd-meters", "groupings"],
  vary: ["tempo", "group"]
},

{
  id: "rhy-odd-7-8",
  mode: "play", category: "rhythm", tags: ["odd-meter", "7-8", "balkan"],
  title: "7/8 grouped {p:group}",
  level: 6, length: "medium", minutes: 3,
  params: {
    root: ["E", "A", "D"], quality: ["min", "5"],
    group: [
      { v: [0, 2, 4, 7, 9, 11], label: "2+2+3" },
      { v: [0, 3, 5, 7, 10, 12], label: "3+2+2" },
      { v: [0, 2, 5, 7, 9, 12], label: "2+3+2", lvl: 1 }
    ]
  },
  prompt: "7/8, one strum per 8th note on **{chord}**, alternating down-up. Accent **{p:group}**. Because 7 is odd, bar 2 starts on an **upstroke**.",
  goal: "16 bars of 7/8 that groove, with the groupings clearly audible.",
  tempo: { start: 140, min: 100, max: 260, step: 10, unit: "bpm" },
  metronome: { meter: "7/8", subdivision: 1, swing: 0, accent: true, accentBeats: "$group" },
  hints: [
    "Tempo is per 8th note (each click = one strum).",
    "Count with syllables: 2 = 'ta-ka', 3 = 'ta-ki-ta'. So 2+2+3 = 'ta-ka ta-ka ta-ki-ta'.",
    "Variation: start every bar with a downstroke by adding a silent stroke — feel the difference."
  ],
  explain: `### 7/8
Seven 8th notes grouped as **2+2+3**, **3+2+2** or **2+3+2**. Balkan music uses these as dance rhythms (*rachenitsa* is 2+2+3), and prog rock loves them. The grid here shows two bars so you can see the stroke direction flip.`,
  visual: { type: "rhythm", meter: "7/8", grid: 1, bars: 2, pattern: "DUDUDUD | UDUDUDU", accents: "$group", chord: { root: "$root", quality: "$quality" } },
  demo: { type: "rhythm", meter: "7/8", grid: 1, bars: 2, pattern: "DUDUDUD | UDUDUDU", accents: "$group", chord: { root: "$root", quality: "$quality" } },
  concepts: ["odd-meters", "groupings"],
  vary: ["tempo", "group"]
},

{
  id: "rhy-odd-7-4",
  mode: "play", category: "rhythm", tags: ["odd-meter", "7-4"],
  title: "7/4 grouped {p:group}",
  level: 6, length: "medium", minutes: 3,
  params: {
    root: ["E", "A", "D", "G"], quality: ["min", "maj", "7"],
    group: [{ v: [0, 8], label: "4+3" }, { v: [0, 6], label: "3+4" }, { v: [0, 4, 8], label: "2+2+3", lvl: 1 }]
  },
  prompt: "7/4 down-up eighths on **{chord}**, accenting **{p:group}**.",
  goal: "16 bars without dropping or adding a beat.",
  tempo: { start: 90, min: 60, max: 160, step: 5, unit: "bpm" },
  metronome: { meter: "7/4", subdivision: 1, swing: 0, accent: true },
  hints: [
    "4+3 feels like a 4/4 bar that's 'cut short' — many rock songs use it (e.g. Pink Floyd's 'Money' is in 7/4).",
    "Count '1 2 3 4 1 2 3'."
  ],
  explain: `### 7/4
A longer odd meter, usually felt as **4+3**. Each group is beat-based (quarters), so it's more relaxed than 7/8.`,
  visual: { type: "rhythm", meter: "7/4", grid: 2, bars: 1, pattern: "DUDUDUDUDUDUDU", accents: "$group", chord: { root: "$root", quality: "$quality" } },
  demo: { type: "rhythm", meter: "7/4", grid: 2, bars: 1, pattern: "DUDUDUDUDUDUDU", accents: "$group", chord: { root: "$root", quality: "$quality" } },
  concepts: ["odd-meters", "groupings"],
  vary: ["tempo", "group"]
},

{
  id: "rhy-odd-9-8",
  mode: "play", category: "rhythm", tags: ["odd-meter", "9-8", "aksak", "balkan"],
  title: "9/8: {p:group}",
  level: 6, length: "medium", minutes: 3,
  params: {
    root: ["A", "D", "E"], quality: ["min", "7"],
    group: [
      { v: [0, 3, 6, 9, 12, 15], label: "3+3+3 (compound triple)" },
      { v: [0, 2, 4, 6, 9, 11, 13, 15], label: "2+2+2+3 (Turkish/Balkan aksak)", lvl: 1 }
    ]
  },
  prompt: "9/8 strummed in 8ths on **{chord}**, accenting **{p:group}**. Two bars shown — bar 2 starts on an upstroke.",
  goal: "Both groupings feel natural and you can switch on demand.",
  tempo: { start: 150, min: 100, max: 270, step: 10, unit: "bpm" },
  metronome: { meter: "9/8", subdivision: 1, swing: 0, accent: true, accentBeats: "$group" },
  hints: [
    "Tempo counts 8th notes.",
    "3+3+3 feels like slow triplets; 2+2+2+3 feels like a 4-beat bar with a limping last beat ('Blue Rondo à la Turk').",
    "Count 'ta-ka ta-ka ta-ka ta-ki-ta'."
  ],
  explain: `### Same meter, different music
9/8 can be **3+3+3** (an Irish slip jig) or **2+2+2+3** (Turkish *aksak*, Brubeck's 'Blue Rondo'). The meter signature doesn't tell you the feel; the **grouping** does.`,
  visual: { type: "rhythm", meter: "9/8", grid: 1, bars: 2, pattern: "DUDUDUDUD | UDUDUDUDU", accents: "$group", chord: { root: "$root", quality: "$quality" } },
  demo: { type: "rhythm", meter: "9/8", grid: 1, bars: 2, pattern: "DUDUDUDUD | UDUDUDUDU", accents: "$group", chord: { root: "$root", quality: "$quality" } },
  concepts: ["odd-meters", "groupings"],
  vary: ["tempo", "group"]
},

{
  id: "rhy-12-8-feel",
  mode: "play", category: "rhythm", tags: ["12-8", "compound", "blues", "ballad"],
  title: "12/8: four big beats of three",
  level: 3, length: "short", minutes: 2,
  params: { root: ["A", "E", "G", "C"], quality: ["7", "maj", "min"] },
  prompt: "12/8 on **{chord}**: one strum per 8th (alternating), accent each group of 3. Tap your foot on the accents — that's the 'real' beat.",
  goal: "Smooth, rolling triple feel for 8 bars.",
  tempo: { start: 150, min: 120, max: 240, step: 10, unit: "bpm" },
  metronome: { meter: "12/8", subdivision: 1, swing: 0, accent: true, accentBeats: [0, 3, 6, 9] },
  hints: [
    "Tempo counts 8th notes; the foot is at a third of that speed (the louder clicks).",
    "It sounds the same as 4/4 with triplets — slow blues and doo-wop/soul ballads live here."
  ],
  explain: `### Compound meter
In **12/8** each of the four beats divides into **three** 8ths: count *1 & a 2 & a 3 & a 4 & a*. It's the usual notation for slow blues, 1950s doo-wop and soul ballads, and 6/8-feel Afro-Cuban grooves. Feeling 12/8 as 4 beats of triplets is the bridge between 'counting 12' and grooving in 4.

### Check yourself
- Your foot taps 4 times per bar, on the louder clicks; three strums fit evenly into each tap.
- With strict down-up strumming, beats 2 and 4 start with an **upstroke**. If every beat starts with a down, you've added or dropped a stroke.`,
  visual: { type: "rhythm", meter: "12/8", grid: 1, bars: 1, pattern: "DUD UDU DUD UDU", accents: [0, 3, 6, 9], count: "compound", chord: { root: "$root", quality: "$quality" } },
  demo: { type: "rhythm", meter: "12/8", grid: 1, bars: 1, pattern: "DUD UDU DUD UDU", accents: [0, 3, 6, 9], count: "compound", chord: { root: "$root", quality: "$quality" } },
  concepts: ["triplets", "odd-meters"],
  vary: ["tempo", "root"]
},

{
  id: "rhy-poly-3-2-pick",
  mode: "play", category: "rhythm", tags: ["polyrhythm", "3-2", "fingerstyle", "independence"],
  title: "Polyrhythm 3:2 — thumb vs finger",
  level: 5, length: "medium", minutes: 3,
  prompt: "One bar = 2 clicks. Thumb plays **one note per click** (2 per bar) on string 6; index plays **3 evenly spaced notes per bar** on string 1. Both land together on beat 1. Say \"**not** dif-fi-cult\".",
  goal: "Hands stay independent and even for 8 bars; you can hear both layers.",
  tempo: { start: 40, min: 30, max: 90, step: 4, unit: "bpm" },
  metronome: { meter: "2/4", subdivision: 1, swing: 0, accent: true },
  hints: [
    "The grid has 3 slots per beat (6 per bar): thumb on slots 1 and 4, finger on slots 1, 3 and 5.",
    "'NOT dif-fi-cult': NOT = both, dif = finger, fi = thumb, cult = finger.",
    "Tap it on a table first (left hand 2, right hand 3)."
  ],
  explain: `### 3 against 2
Two even pulses sharing a start point: 3 notes in the time of 2. Line both up on a common grid (LCM = 6) and the composite rhythm is **long-short-short-long**. 3:2 underlies the 6/8 bell, hemiola in flamenco, and the 'quarter-note triplet' in jazz.

Grid: 2/4, 3 slots per beat = 6 slots. Thumb on slots 0 and 3, finger on 0, 2, 4.`,
  visual: { type: "rhythm", meter: "2/4", grid: 3, bars: 1, pick: "6+1 - 1 6 1 -", fingers: "p+i - i p i -", title: "Thumb = 2, index = 3" },
  demo: { type: "rhythm", meter: "2/4", grid: 3, bars: 1, pick: "6+1 - 1 6 1 -", fingers: "p+i - i p i -" },
  concepts: ["polyrhythm", "thumb-independence"],
  vary: ["tempo"]
},

{
  id: "rhy-poly-3-2-strum",
  mode: "play", category: "rhythm", tags: ["polyrhythm", "3-2", "triplets", "quarter-note-triplets"],
  title: "Quarter-note triplets (3:2) on {chord}",
  level: 6, length: "medium", minutes: 3,
  params: { root: ["E", "A", "D", "G"], quality: ["min", "7", "maj7"] },
  prompt: "Continuous 8th-note triplets on **{chord}**, accent **every other triplet**. The accents form **quarter-note triplets**: 3 evenly spaced hits per 2 beats.",
  goal: "Accents are even and the click stays solid underneath for 8 bars.",
  tempo: { start: 60, min: 40, max: 110, step: 4, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0, accent: true },
  hints: [
    "Every accent is a downstroke: in strict D-U-D-U alternation, every 2nd stroke is a down.",
    "Then try playing ONLY the accents (silent air strokes in between).",
    "Jazz soloists and drummers use quarter-note triplets constantly to 'stretch' time."
  ],
  explain: `### Quarter-note triplets
Three equal notes spanning two beats. Building them from 8th-note triplets (accent every 2nd) is the reliable way to learn them; guessing them by feel usually produces something uneven.`,
  visual: { type: "rhythm", meter: "4/4", grid: 3, bars: 1, pattern: "DUDUDUDUDUDU", accents: [0, 2, 4, 6, 8, 10], chord: { root: "$root", quality: "$quality" } },
  demo: { type: "rhythm", meter: "4/4", grid: 3, bars: 1, pattern: "DuDuDuDuDuDu", accents: [0, 2, 4, 6, 8, 10], chord: { root: "$root", quality: "$quality" } },
  concepts: ["polyrhythm", "triplets"],
  vary: ["tempo", "root"]
},

{
  id: "rhy-poly-3-4",
  mode: "play", category: "rhythm", tags: ["polyrhythm", "3-4", "half-note-triplets"],
  title: "Polyrhythm 3:4 — half-note triplets",
  level: 7, length: "medium", minutes: 3,
  params: { root: ["E", "A", "D"], quality: ["min", "7"] },
  prompt: "Triplets on **{chord}**, accent **every 4th triplet**: 3 evenly spaced accents per 4/4 bar, against the 4 clicks.",
  goal: "The 3 accents are even and the 4 beats remain clear for 8 bars.",
  tempo: { start: 60, min: 40, max: 110, step: 4, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0, accent: true },
  hints: [
    "Accents land on 1, the 'trip' (middle triplet) of 2, and the 'let' (last triplet) of 3.",
    "All three accents happen to be downstrokes, since every 4th stroke in strict alternation is a down."
  ],
  explain: `### 3 against 4
Three notes in the time of four beats (half-note triplets). On a common grid of 12, the 3-stream is every 4th slot and the 4-stream is every 3rd. Great for 'over the bar-line' comping and soloing.`,
  visual: { type: "rhythm", meter: "4/4", grid: 3, bars: 1, pattern: "DUDUDUDUDUDU", accents: [0, 4, 8], chord: { root: "$root", quality: "$quality" } },
  demo: { type: "rhythm", meter: "4/4", grid: 3, bars: 1, pattern: "DuduDuduDudu", accents: [0, 4, 8], chord: { root: "$root", quality: "$quality" } },
  concepts: ["polyrhythm", "triplets"],
  vary: ["tempo"]
},

{
  id: "rhy-poly-4-3-pick",
  mode: "play", category: "rhythm", tags: ["polyrhythm", "4-3", "fingerstyle", "independence"],
  title: "Polyrhythm 4:3 — thumb vs finger",
  level: 7, length: "medium", minutes: 4,
  prompt: "In 3/4: thumb plays the **3 beats** on string 6; index plays **4 evenly spaced notes** per bar on string 1. Say \"**pass** the gold-en but-ter\".",
  goal: "Both layers even and independent for 8 bars.",
  tempo: { start: 40, min: 30, max: 80, step: 4, unit: "bpm" },
  metronome: { meter: "3/4", subdivision: 1, swing: 0, accent: true },
  hints: [
    "Common grid = 12 slots (3 beats × 4 sixteenths). Thumb: slots 1, 5, 9. Finger: slots 1, 4, 7, 10.",
    "'PASS (both) the (finger) GOLD (thumb) en (finger) BUT (thumb) ter (finger)'.",
    "Tap it on your legs before playing."
  ],
  explain: `### 4 against 3
The finger plays dotted 8ths (every 3rd 16th) over the 3/4 bar: four evenly spaced notes against three beats. A famous piano example is Chopin's *Fantaisie-Impromptu* (four notes in one hand against three in the other). It's the harder sibling of 3:2.

### Check yourself
- Say the mnemonic in strict rhythm first; only "PASS" lands with the thumb *and* finger together.
- The thumb notes must stay exactly on the clicks. If the thumb starts following the finger, slow down.`,
  visual: { type: "rhythm", meter: "3/4", grid: 4, bars: 1, pick: "6+1 - - 1 6 - 1 - 6 1 - -", fingers: "p+i - - i p - i - p i - -", title: "Thumb = 3, index = 4" },
  demo: { type: "rhythm", meter: "3/4", grid: 4, bars: 1, pick: "6+1 - - 1 6 - 1 - 6 1 - -", fingers: "p+i - - i p - i - p i - -" },
  concepts: ["polyrhythm", "thumb-independence"],
  vary: ["tempo"]
},

{
  id: "rhy-poly-4-3-strum",
  mode: "play", category: "rhythm", tags: ["polyrhythm", "4-3", "sixteenths", "dotted-eighths"],
  title: "4:3 accents in 3/4",
  level: 8, length: "medium", minutes: 3,
  params: { root: ["E", "A", "D"], quality: ["min", "m7"] },
  prompt: "Muted 16ths in 3/4 on **{chord}**, accent **every 3rd 16th**: four accents per bar against the three beats.",
  goal: "Even accents and audible beats for 8 bars.",
  tempo: { start: 60, min: 40, max: 100, step: 4, unit: "bpm" },
  metronome: { meter: "3/4", subdivision: 1, swing: 0, accent: true },
  hints: [
    "Accents fall on 1, a(1), &(2), e(3).",
    "Accents alternate D/U/D/U."
  ],
  explain: `### Dotted 8ths in 3/4
Same 4:3 as the fingerstyle card, but felt as accents in a 16th stream. Switch between this and plain beat accents to feel the 'gear change' between 3 and 4.`,
  visual: { type: "rhythm", meter: "3/4", grid: 4, bars: 1, pattern: "dudu dudu dudu", accents: [0, 3, 6, 9], chord: { root: "$root", quality: "$quality" } },
  demo: { type: "rhythm", meter: "3/4", grid: 4, bars: 1, pattern: "dudu dudu dudu", accents: [0, 3, 6, 9], chord: { root: "$root", quality: "$quality" } },
  concepts: ["polyrhythm", "groupings"],
  vary: ["tempo"]
},

{
  id: "rhy-poly-5-4",
  mode: "play", category: "rhythm", tags: ["polyrhythm", "5-4", "quintuplets", "master"],
  title: "5:4 — quintuplets accented every 4",
  level: 9, length: "long", minutes: 5,
  prompt: "Muted quintuplets (5 per click), **accent every 4th note**: five accents per bar against four beats.",
  goal: "Even 5-against-4 for 8 bars with the click audible underneath.",
  tempo: { start: 44, min: 30, max: 72, step: 2, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0, accent: true },
  hints: [
    "Get the quintuplet card solid first.",
    "Count 1-2-3-4-5 in every beat. The accents fall on notes 1 and 5 of beat 1, note 4 of beat 2, note 3 of beat 3 and note 2 of beat 4.",
    "Long-term card: a few minutes per week."
  ],
  explain: `### 5 against 4
A master-level polyrhythm: 5 evenly spaced notes in a 4/4 bar. Building it from quintuplets with an accent every 4th note (a 20-slot grid) is the reliable way to learn it; guessing it by feel usually produces something uneven.`,
  visual: { type: "rhythm", meter: "4/4", grid: 5, bars: 1, pattern: "dudud ududu dudud ududu", accents: [0, 4, 8, 12, 16] },
  demo: { type: "rhythm", meter: "4/4", grid: 5, bars: 1, pattern: "dudud ududu dudud ududu", accents: [0, 4, 8, 12, 16] },
  concepts: ["polyrhythm", "tuplets"],
  vary: ["tempo"]
},

{
  id: "rhy-metric-modulation",
  mode: "play", category: "rhythm", tags: ["metric-modulation", "quarter-note-triplets", "master"],
  title: "Metric modulation: triplets become the new beat",
  level: 9, length: "long", minutes: 5,
  prompt: "At {tempo}, play 4 bars of **quarter-note triplets** (accent every other 8th-note triplet). Then *hear those accents as the new quarter note* and play 4 bars of plain 8ths at the new tempo (×1.5). Return.",
  goal: "The new tempo is exactly 1.5× the old one and you can go back and forth.",
  tempo: { start: 60, min: 40, max: 90, step: 4, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0, accent: true },
  hints: [
    "Check: at 60 bpm the new tempo is 90 bpm. Set a second metronome to verify.",
    "The link is the quarter-note triplet — it's shared by both tempos.",
    "The term is closely associated with the composer Elliott Carter; it's also great for clean 'tempo shifts' in a band."
  ],
  explain: `### Metric modulation
A rhythm in the old tempo becomes the pulse of the new tempo. Quarter-note triplets (3 per 2 beats) as the new beat → tempo × 3/2. It trains rock-solid proportional time.`,
  visual: { type: "rhythm", meter: "4/4", grid: 3, bars: 1, pattern: "DuDuDuDuDuDu", accents: [0, 2, 4, 6, 8, 10], title: "The pivot: quarter-note triplets" },
  demo: { type: "rhythm", meter: "4/4", grid: 3, bars: 1, pattern: "DuDuDuDuDuDu", accents: [0, 2, 4, 6, 8, 10] },
  concepts: ["polyrhythm", "triplets"],
  vary: ["tempo"]
},

{
  id: "rhy-poly-switch-gap",
  mode: "play", category: "rhythm", tags: ["polyrhythm", "switching", "gap-click", "advanced"],
  title: "Beat ↔ quarter-note triplets through the gap",
  level: 8, length: "long", minutes: 5,
  params: { root: ["E", "A", "D", "G"], quality: ["m7", "7", "maj7"] },
  prompt: "Hold **{chord}**. Alternate **one bar of quarter notes** with **one bar of quarter-note triplets**, with no 8th-note triplet 'scaffolding' this time. The click is **2 bars on, 2 bars off**.",
  goal: "The triplet bar is exactly 3 even hits per 2 beats, and you land on the returning click every time.",
  tempo: { start: 66, min: 50, max: 120, step: 4, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0, accent: true, gap: { play: 2, mute: 2 } },
  hints: [
    "First do the 3:2 strum card until the quarter-note triplet is in your ear.",
    "Feel the triplet bar as two groups of three even hits, one group per half bar (each hit lasts 2/3 of a beat).",
    "Record yourself. Uneven triplets are obvious on playback."
  ],
  explain: `### Polyrhythm without a net
Playing quarter-note triplets *without* first subdividing into 8th-note triplets proves the 3:2 feel is internalised. Doing it through a gap click proves the underlying pulse is too. Jazz soloists, drummers and Brazilian players switch between these two layers constantly.`,
  visual: { type: "rhythm", meter: "4/4", grid: 3, bars: 2, pattern: "D--U--D--U-- | D-D-D-D-D-D-", accents: [0, 3, 6, 9, 12, 14, 16, 18, 20, 22], chord: { root: "$root", quality: "$quality" }, title: "Quarters, then quarter-note triplets" },
  demo: { type: "rhythm", meter: "4/4", grid: 3, bars: 2, pattern: "D--U--D--U-- | D-D-D-D-D-D-", accents: [0, 3, 6, 9, 12, 14, 16, 18, 20, 22], chord: { root: "$root", quality: "$quality" } },
  concepts: ["polyrhythm", "gap-click", "triplets"],
  vary: ["tempo", "root"]
},

{
  id: "rhy-tuplet-improv",
  mode: "play", category: "rhythm", tags: ["tuplets", "improvisation", "switching", "master"],
  title: "Free subdivision improvisation",
  level: 10, length: "long", minutes: 8,
  params: { key: ["Am", "Em", "Dm", "Gm", "Cm"] },
  prompt: "Improvise single-note lines in **{root}** minor pentatonic over a click on **2 and 4**. Choose a new subdivision **every beat** from 2, 3, 4, 5 and 6 notes per beat, and say each number in your head before the beat arrives.",
  goal: "Every beat contains exactly the subdivision you chose, with the backbeat locked, for 8 minutes.",
  tempo: { start: 60, min: 44, max: 96, step: 4, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0, accent: false, clickOn: "2&4" },
  hints: [
    "Start by changing every bar, then every 2 beats, then every beat.",
    "Accent the first note of each beat so you (and a listener) can hear the grid.",
    "This is the lifelong 'rhythmic freedom' card. Revisit it monthly."
  ],
  explain: `### Rhythmic freedom
The end goal of all the subdivision, tuplet and switching cards is that **any** subdivision is available to you at any moment while the time stays rock solid. Players like Allan Holdsworth and Guthrie Govan move between 4, 5, 6 and 7 per beat as phrasing choices. The demo cycles 4 → 3 → 5 → 6 per beat as an example.`,
  visual: { type: "rhythm", meter: "4/4", grid: 5, bars: 1, pattern: "dudud ududu dudud ududu", accents: [0, 5, 10, 15], title: "One possibility: quintuplets" },
  demo: [
    { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pattern: "dudu dudu dudu dudu", accents: [0, 4, 8, 12] },
    { type: "rhythm", meter: "4/4", grid: 3, bars: 1, pattern: "dud udu dud udu", accents: [0, 3, 6, 9] },
    { type: "rhythm", meter: "4/4", grid: 5, bars: 1, pattern: "dudud ududu dudud ududu", accents: [0, 5, 10, 15] },
    { type: "rhythm", meter: "4/4", grid: 6, bars: 1, pattern: "dududu dududu dududu dududu", accents: [0, 6, 12, 18] }
  ],
  concepts: ["tuplets", "subdivisions", "click-placement"],
  vary: ["tempo", "key"]
},

{
  id: "rhy-triplet-partials",
  mode: "play", category: "rhythm", tags: ["triplets", "placement"],
  title: "Triplet placement: only {p:partial}",
  level: 5, length: "short", minutes: 2,
  params: {
    root: ["A", "E", "D"], quality: ["7", "min"],
    partial: [
      { v: "D--U--D--U--", label: "the first triplet (the beat)" },
      { v: "--D--U--D--U", label: "the last triplet ('let')", lvl: 1 },
      { v: "-U--D--U--D-", label: "the middle triplet ('trip')", lvl: 2 }
    ]
  },
  prompt: "Keep strict triplet motion on **{chord}** but only touch the strings on **{p:partial}**. Stroke direction alternates each beat!",
  goal: "One clean hit per beat, perfectly placed, for 8 bars.",
  tempo: { start: 60, min: 40, max: 110, step: 4, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0, accent: true },
  hints: [
    "Say 'trip-o-let' and play only the right syllable.",
    "The 'let' only version is the off-beat of a shuffle.",
    "The middle triplet is rare and very hard — a true placement test."
  ],
  explain: `### Placement in the triplet grid
Same idea as the 16th placement card, in a 3-grid. Since 3 is odd, the stroke direction of each partial flips every beat, so it can't be solved by 'muscle memory of direction' — you need to hear it.`,
  visual: { type: "rhythm", meter: "4/4", grid: 3, bars: 1, pattern: "$partial", chord: { root: "$root", quality: "$quality" } },
  demo: { type: "rhythm", meter: "4/4", grid: 3, bars: 1, pattern: "$partial", chord: { root: "$root", quality: "$quality" } },
  concepts: ["triplets", "constant-motion"],
  vary: ["tempo", "partial"]
},

{
  id: "rhy-ghost-vs-accent",
  mode: "play", category: "rhythm", tags: ["sixteenths", "accents", "ghost-notes", "funk"],
  title: "Accents over ghosts (16th syncopation)",
  level: 5, length: "medium", minutes: 3,
  params: { root: ["E", "A", "D"], quality: ["m7", "9", "7#9"] },
  prompt: "Continuous muted 16ths. Hold **{chord}** and let it ring only on the capital letters (a of 1, 3, & of 4) — squeeze the chord on those strokes, release on the ghosts.",
  goal: "Big contrast between accents and ghosts; perfectly placed accents for 8 bars.",
  tempo: { start: 70, min: 50, max: 110, step: 4, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0, accent: true },
  hints: [
    "Accent volume comes from the *fretting hand* (press = sound, release = mute), not from hitting harder.",
    "The 'a' of 1 is an upstroke chord — the funkiest stroke there is."
  ],
  explain: `### Fret-hand muting
In funk, the strumming hand never stops; the **fretting hand** decides what sounds by pressing (chord) or relaxing (ghost). This splits the job: right hand = time, left hand = rhythm.`,
  visual: { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pattern: "dudU dudu Dudu duDu", accents: [3, 8, 14], chord: { root: "$root", quality: "$quality" } },
  demo: { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pattern: "dudU dudu Dudu duDu", accents: [3, 8, 14], chord: { root: "$root", quality: "$quality" } },
  concepts: ["accents-ghosts", "funk-16ths"],
  vary: ["tempo", "root"]
},

{
  id: "rhy-rests-stops",
  mode: "play", category: "rhythm", tags: ["rests", "staccato", "strumming"],
  title: "Play the rests",
  level: 3, length: "short", minutes: 2,
  params: { root: ["G", "C", "D", "A", "E"], quality: ["maj", "7", "min"] },
  prompt: "Strum **{chord}** on the written strokes and **stop the sound** on every rest (`.`) by releasing fretting pressure. Silence is part of the rhythm.",
  goal: "Rests are truly silent and exactly as long as written.",
  tempo: { start: 80, min: 60, max: 140, step: 5, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 2, swing: 0, accent: true },
  hints: [
    "Lift the fretting fingers just off the frets (keep touching the strings).",
    "For open chords, touch the strings with the side of the strumming hand."
  ],
  explain: `### Note length
Rhythm isn't only *when* a note starts — it's also *when it stops*. Controlling note length (staccato vs legato) is the difference between a mushy strum and a tight groove.`,
  visual: { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pattern: "D.D.DUD.", chord: { root: "$root", quality: "$quality" } },
  demo: { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pattern: "D.D.DUD.", chord: { root: "$root", quality: "$quality" } },
  concepts: ["accents-ghosts", "pocket"],
  vary: ["tempo", "root"]
},

{
  id: "rhy-pocket-placement",
  mode: "play", category: "rhythm", tags: ["pocket", "feel", "time"],
  title: "Ahead, on, behind: {p:place}",
  level: 7, length: "medium", minutes: 3,
  params: {
    root: ["E", "A", "D", "G"], quality: ["7", "m7"],
    place: [{ v: "on", label: "dead on the click" }, { v: "behind", label: "slightly behind the click (laid back)", lvl: 1 }, { v: "ahead", label: "slightly ahead of the click (pushing)", lvl: 1 }]
  },
  prompt: "Strum quarter notes on **{chord}** and place them **{p:place}** — consistently, for 16 bars. Then switch.",
  goal: "You can hold each placement deliberately and hear the difference.",
  tempo: { start: 80, min: 60, max: 120, step: 5, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0, accent: true },
  hints: [
    "'Behind' should still be the same tempo — just a constant tiny delay. It feels heavy, bluesy.",
    "'Ahead' feels urgent (punk, some bebop comping).",
    "Record and look at the waveform if you want to check."
  ],
  explain: `### The pocket
Great players don't just play 'in time' — they choose *where* on the beat to sit. Laid-back (behind) is the blues/R&B/hip-hop pocket; pushing (ahead) adds urgency. Consistency is what matters: a constant offset is a feel, a varying one is just bad time.

Note: the demo always plays **dead on** the click; 'behind' and 'ahead' are tiny offsets (a few hundredths of a second) that you add yourself.

### Check yourself
- **On**: you hear one sound (strum and click fused). **Behind**: click, then strum, every time by the same tiny amount. **Ahead**: strum, then click.
- Record 16 bars and look at the waveform: the gap between click and strum should be the same in every bar.`,
  visual: { type: "rhythm", meter: "4/4", grid: 1, bars: 1, pattern: "DDDD", chord: { root: "$root", quality: "$quality" } },
  demo: { type: "rhythm", meter: "4/4", grid: 1, bars: 1, pattern: "DDDD", chord: { root: "$root", quality: "$quality" } },
  concepts: ["pocket"],
  vary: ["tempo", "place"]
},

// ─────────────────────────────────────────────────────────────────────────────
// B. STRUMMING (category: rhythm, tag: strumming)
// ─────────────────────────────────────────────────────────────────────────────

{
  id: "rhy-strum-quarters-chords",
  mode: "play", category: "rhythm", tags: ["strumming", "quarters", "beginner", "chord-changes"],
  title: "Quarter-note strums: G → C → D → G",
  level: 1, length: "short", minutes: 2,
  prompt: "One downstroke per click, **one bar per chord**: G, C, D, G. Change chords *on time* even if the first strum of the new chord is imperfect.",
  goal: "No gaps or hesitation at the chord changes for 4 loops.",
  tempo: { start: 60, min: 40, max: 140, step: 5, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0, accent: true },
  hints: [
    "Start moving to the next chord on beat 4 — let the last strum of the bar be a bit short.",
    "Time beats accuracy: a late perfect chord is worse than an on-time slightly buzzy one."
  ],
  explain: `### Chord changes in time
The first rhythm skill for chords is **changing without stopping the beat**. Practising with a click forces you to plan the change ahead.`,
  visual: { type: "rhythm", meter: "4/4", grid: 1, bars: 1, pattern: "DDDD", accents: [0], chord: { root: "G", quality: "maj" } },
  demo: [
    { type: "rhythm", meter: "4/4", grid: 1, bars: 1, pattern: "DDDD", accents: [0], chord: { root: "G", quality: "maj" } },
    { type: "rhythm", meter: "4/4", grid: 1, bars: 1, pattern: "DDDD", accents: [0], chord: { root: "C", quality: "maj" } },
    { type: "rhythm", meter: "4/4", grid: 1, bars: 1, pattern: "DDDD", accents: [0], chord: { root: "D", quality: "maj" } },
    { type: "rhythm", meter: "4/4", grid: 1, bars: 1, pattern: "DDDD", accents: [0], chord: { root: "G", quality: "maj" } }
  ],
  concepts: ["constant-motion"],
  vary: ["tempo"]
},

{
  id: "rhy-strum-8th-ladder",
  mode: "play", category: "rhythm", tags: ["strumming", "eighths", "patterns"],
  title: "8th-note strum: {p:strum}",
  level: 2, length: "short", minutes: 2,
  params: {
    root: ["G", "C", "D", "A", "E"], quality: ["maj", "min", "7"],
    strum: [
      { v: "D-D-DUDU", label: "D D DUDU" },
      { v: "D-DUD-DU", label: "D DU D DU" },
      { v: "D-DU-UDU", label: "D DU UDU (the 'Old Faithful')", lvl: 1 },
      { v: "D-DU-UD-", label: "D DU UD (cinquillo strum)", lvl: 1 },
      { v: "D--U-UDU", label: "D U UDU", lvl: 2 },
      { v: "DU-U-UDU", label: "DU U UDU", lvl: 2 },
      { v: "--DU-UDU", label: "– DU UDU (start on beat 2)", lvl: 3 }
    ]
  },
  prompt: "Hold **{chord}** and loop **{p:strum}**. Hand moves down-up in 8ths constantly; skip the strokes shown as `-`.",
  goal: "Pattern flows for 8 bars at the target tempo with no hiccups.",
  tempo: { start: 70, min: 50, max: 150, step: 5, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0, accent: true },
  hints: [
    "Say the pattern: '1, 2 &, & 4 &' for D-DU-UDU.",
    "A missed downstroke on beat 3 is the classic 'Old Faithful' trap: keep the hand moving down past the strings.",
    "Once solid, move it up the tempo ladder — this card comes back at higher tempos."
  ],
  explain: `### Strum patterns = constant motion + skipped strokes
Every 8th-note strum is the D-U-D-U motion with some strokes in the air. Downs are always on numbers, ups always on &s. Learn a pattern by **saying** it in counts, then let the hand fill it in.`,
  visual: { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pattern: "$strum", chord: { root: "$root", quality: "$quality" } },
  demo: { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pattern: "$strum", chord: { root: "$root", quality: "$quality" } },
  concepts: ["constant-motion"],
  vary: ["tempo", "strum", "root"]
},

{
  id: "rhy-strum-8th-tempo-ladder",
  mode: "play", category: "rhythm", tags: ["strumming", "tempo-ladder", "endurance"],
  title: "Tempo ladder: D-DU-UDU at {tempo}",
  level: 3, length: "long", minutes: 6,
  params: { root: ["G", "C", "D", "A", "E"], quality: ["maj", "min"] },
  prompt: "Play **D-DU-UDU** on **{chord}** for 8 clean bars at {tempo}. If clean, go up 10 bpm and repeat. Stop at the first tempo where it gets tense — that's today's edge.",
  goal: "Find and log your clean maximum; next session start 20 bpm below it.",
  tempo: { start: 70, min: 50, max: 200, step: 10, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0, accent: true },
  hints: [
    "At high tempos the hand motion gets *smaller*, not harder.",
    "If your shoulder rises, you've gone past your relaxed max."
  ],
  explain: `### Tempo ladders
Pushing tempo in small steps from a comfortable start ('the ladder') is the standard way to build speed without tension. Always end a session slightly *below* your max, cleanly.`,
  visual: { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pattern: "D-DU-UDU", chord: { root: "$root", quality: "$quality" } },
  demo: { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pattern: "D-DU-UDU", chord: { root: "$root", quality: "$quality" } },
  concepts: ["constant-motion"],
  vary: ["tempo"]
},

{
  id: "rhy-strum-16th-ladder",
  mode: "play", category: "rhythm", tags: ["strumming", "sixteenths", "patterns"],
  title: "16th-note strum: {p:strum}",
  level: 4, length: "medium", minutes: 3,
  params: {
    root: ["G", "C", "D", "A", "E"], quality: ["maj", "min", "7"],
    strum: [
      { v: "D-D-D-DUD-D-D-DU", label: "8ths with a pickup (D D D DU ×2)" },
      { v: "D-DUD-DUD-DUD-DU", label: "gallop (D DU) ×4" },
      { v: "DUD-DUD-DUD-DUD-", label: "reverse gallop (DUD) ×4", lvl: 1 },
      { v: "D-DU-UD-D-DU-UD-", label: "16th cinquillo ×2", lvl: 1 },
      { v: "D--UD--UD--UD--U", label: "1 + a each beat", lvl: 1 },
      { v: "D-DU-U-UD-DU-U-U", label: "syncopated pop strum", lvl: 2 },
      { v: "D--U--D--U--D-DU", label: "3+3+3+3+4 grouping", lvl: 3 }
    ]
  },
  prompt: "Hold **{chord}**. Constant 16th motion (down on 1 and &, up on e and a). Loop **{p:strum}**.",
  goal: "8 bars clean and grooving.",
  tempo: { start: 60, min: 40, max: 120, step: 4, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0, accent: true },
  hints: [
    "Count 1 e & a out loud — at least the first few times.",
    "16th patterns at 60 bpm feel like 8th patterns at 120. Same skill, different counting."
  ],
  explain: `### 16th strumming
Pop, funk and acoustic rock patterns are mostly 16th-note patterns. With the hand locked in 16ths, every pattern is just a different set of 'touches'.`,
  visual: { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pattern: "$strum", chord: { root: "$root", quality: "$quality" } },
  demo: { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pattern: "$strum", chord: { root: "$root", quality: "$quality" } },
  concepts: ["constant-motion", "subdivisions"],
  vary: ["tempo", "strum", "root"]
},

{
  id: "rhy-strum-chuck",
  mode: "play", category: "rhythm", tags: ["strumming", "percussive", "chuck", "backbeat"],
  title: "Strum with a chuck on 2 & 4",
  level: 3, length: "short", minutes: 2,
  params: { root: ["G", "C", "D", "A", "E"], quality: ["maj", "min", "7"] },
  prompt: "Pattern **D chuck-U D chuck-U** on **{chord}**: on beats 2 and 4 slap the strings with the strumming hand's palm/side while it moves down (the `X`).",
  goal: "The chuck sounds like a snare and lands exactly on 2 and 4.",
  tempo: { start: 80, min: 60, max: 150, step: 5, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0, accent: true },
  hints: [
    "The chuck *is* the downstroke — it just mutes as it hits.",
    "Alternative: release fretting-hand pressure exactly as you strum (a fret-hand chuck)."
  ],
  explain: `### The chuck
A percussive muted strum on the backbeat turns one acoustic guitar into guitar + snare drum. It's the base of countless singer-songwriter grooves.`,
  visual: { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pattern: "D-XUD-XU", accents: [2, 6], chord: { root: "$root", quality: "$quality" } },
  demo: { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pattern: "D-XUD-XU", accents: [2, 6], chord: { root: "$root", quality: "$quality" } },
  concepts: ["accents-ghosts", "constant-motion"],
  vary: ["tempo", "root"]
},

{
  id: "rhy-strum-chuck-16",
  mode: "play", category: "rhythm", tags: ["strumming", "percussive", "chuck", "sixteenths"],
  title: "16th groove with chucks",
  level: 4, length: "medium", minutes: 3,
  params: { root: ["G", "C", "D", "A", "E"], quality: ["maj", "min", "7", "sus4"] },
  prompt: "16th motion on **{chord}**: **D – DU X – DU** twice per bar (chuck on 2 and 4).",
  goal: "Groove sits in the pocket for 8 bars; chucks are crisp.",
  tempo: { start: 66, min: 50, max: 110, step: 4, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0, accent: true },
  hints: [
    "This is the classic modern acoustic 'percussive pop' strum.",
    "Keep the chuck short and the strums open — contrast is the groove."
  ],
  explain: `### Percussive 16ths
Combining the 16th grid with a backbeat chuck gives a full 'band' sound from one guitar.`,
  visual: { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pattern: "D-DUX-DUD-DUX-DU", accents: [4, 12], chord: { root: "$root", quality: "$quality" } },
  demo: { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pattern: "D-DUX-DUD-DUX-DU", accents: [4, 12], chord: { root: "$root", quality: "$quality" } },
  concepts: ["constant-motion", "accents-ghosts"],
  vary: ["tempo", "root"]
},

{
  id: "rhy-strum-backbeat-accents",
  mode: "play", category: "rhythm", tags: ["strumming", "accents", "backbeat"],
  title: "Backbeat accents on {chord}",
  level: 2, length: "short", minutes: 2,
  params: { root: ["G", "C", "D", "A", "E"], quality: ["maj", "min"] },
  prompt: "Straight down-up 8ths on **{chord}**; **accent beats 2 and 4** (dig in), keep the rest softer.",
  goal: "Audible backbeat for 8 bars without the accents rushing.",
  tempo: { start: 80, min: 60, max: 150, step: 5, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0, accent: true },
  hints: ["Accents are about relative volume — play the unaccented strokes quieter.", "Rock, pop and country all lean on 2 and 4."],
  explain: `### Dynamics in strumming
Accents turn a wall of strums into a groove. The backbeat accent mimics the snare drum.`,
  visual: { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pattern: "DUDUDUDU", accents: [2, 6], chord: { root: "$root", quality: "$quality" } },
  demo: { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pattern: "DUDUDUDU", accents: [2, 6], chord: { root: "$root", quality: "$quality" } },
  concepts: ["accents-ghosts"],
  vary: ["tempo", "root"]
},

{
  id: "rhy-strum-waltz",
  mode: "play", category: "rhythm", tags: ["strumming", "3-4", "waltz", "bass-strum"],
  title: "Waltz: bass – strum – strum on {chord}",
  level: 1, length: "short", minutes: 2,
  params: { root: ["G", "C", "D", "A", "E"], quality: ["maj", "min"] },
  prompt: "3/4 time on **{chord}**: pick the **bass note on 1**, then **strum the upper strings on 2 and 3**.",
  goal: "Smooth 'OOM-pah-pah' for 8 bars.",
  tempo: { start: 90, min: 60, max: 180, step: 5, unit: "bpm" },
  metronome: { meter: "3/4", subdivision: 1, swing: 0, accent: true },
  hints: ["The bass note is the chord's root (lowest note of the shape).", "Keep 2 and 3 lighter than 1."],
  explain: `### 3/4
Three beats per bar, strong-weak-weak. The bass-strum-strum pattern is the simplest way to make it dance.`,
  visual: { type: "rhythm", meter: "3/4", grid: 1, bars: 1, pattern: "TDD", accents: [0], chord: { root: "$root", quality: "$quality" } },
  demo: { type: "rhythm", meter: "3/4", grid: 1, bars: 1, pattern: "TDD", accents: [0], chord: { root: "$root", quality: "$quality" } },
  concepts: ["boom-chick"],
  vary: ["tempo", "root"]
},

{
  id: "rhy-strum-6-8",
  mode: "play", category: "rhythm", tags: ["strumming", "6-8", "compound"],
  title: "6/8 strum: {p:strum}",
  level: 2, length: "short", minutes: 2,
  params: {
    root: ["G", "C", "D", "A", "E"], quality: ["maj", "min"],
    strum: [{ v: "D-D-D-", label: "D D D" }, { v: "D-DUD-", label: "D DU D" }, { v: "D-DUDU", label: "D DUDU", lvl: 1 }, { v: "D--UDU", label: "D UDU", lvl: 1 }]
  },
  prompt: "6/8 on **{chord}** with two big beats per bar (on 1 and 4). Strum **{p:strum}** — one slot per 8th note.",
  goal: "Lilting two-beat feel, not six equal beats.",
  tempo: { start: 120, min: 90, max: 200, step: 10, unit: "bpm" },
  metronome: { meter: "6/8", subdivision: 1, swing: 0, accent: true, accentBeats: [0, 3] },
  hints: ["Tempo counts 8ths (6 clicks per bar); the two louder clicks are the big beats. Tap your foot only on those.", "The traditional song 'House of the Rising Sun' is usually played in 6/8 (the well-known 1960s arrangement is arpeggiated)."],
  explain: `### 6/8
Six 8th notes grouped **3+3**: two big (dotted-quarter) beats, each divided in three. Count *1 & a 2 & a*. It feels like a slow 2 with a triplet lilt, used in folk ballads, waltz-like pop songs and Irish jigs.

### Check yourself
- Your foot taps **twice** per bar. If you feel three beats per bar (1 2 3 4 5 6 grouped in pairs), that's 3/4, not 6/8.
- With one stroke per 8th and the hand going down-up, big beat 2 can come out as an upstroke in some patterns. That's fine; keep it as loud as the downstroke on 1.`,
  visual: { type: "rhythm", meter: "6/8", grid: 1, bars: 1, pattern: "$strum", accents: [0, 3], count: "compound", chord: { root: "$root", quality: "$quality" } },
  demo: { type: "rhythm", meter: "6/8", grid: 1, bars: 1, pattern: "$strum", accents: [0, 3], count: "compound", chord: { root: "$root", quality: "$quality" } },
  concepts: ["triplets", "hemiola"],
  vary: ["tempo", "strum"]
},

{
  id: "rhy-strum-open-muted",
  mode: "play", category: "rhythm", tags: ["strumming", "muting", "sixteenths"],
  title: "Open bar / muted bar",
  level: 3, length: "short", minutes: 2,
  params: { root: ["E", "A", "D", "G"], quality: ["min", "7", "m7"] },
  prompt: "16ths on **{chord}**: **one bar ringing, one bar fully muted** (release the fretting pressure, keep fingers on the strings). The strumming hand doesn't change at all.",
  goal: "Instant on/off switches at the bar line, no ringing in muted bars.",
  tempo: { start: 66, min: 50, max: 110, step: 4, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0, accent: true },
  hints: ["For open chords, use spare fretting fingers or the palm edge to mute.", "This is the prerequisite for all funk 'scratch' playing."],
  explain: `### Separating the hands
Right hand = time, left hand = sound/no sound. Getting the fretting hand to mute independently is the key that unlocks funk.`,
  visual: { type: "rhythm", meter: "4/4", grid: 4, bars: 2, pattern: "DUDUDUDUDUDUDUDU | dudududududududu", accents: [0, 16], chord: { root: "$root", quality: "$quality" } },
  demo: { type: "rhythm", meter: "4/4", grid: 4, bars: 2, pattern: "DUDUDUDUDUDUDUDU | dudududududududu", accents: [0, 16], chord: { root: "$root", quality: "$quality" } },
  concepts: ["funk-16ths", "accents-ghosts"],
  vary: ["tempo", "root"]
},

{
  id: "rhy-strum-push",
  mode: "play", category: "rhythm", tags: ["strumming", "anticipation", "syncopation"],
  title: "The push: change chords on the & of 4",
  level: 4, length: "medium", minutes: 3,
  prompt: "Alternate **G** and **C** every bar with **D-DU-UDU**, but change chord on the **last upstroke** (the & of 4) and let it ring through the next downbeat (no strum on beat 1). In a loop that means *every* bar starts with an air strum.",
  goal: "The new chord clearly arrives early, and the time doesn't wobble.",
  tempo: { start: 70, min: 50, max: 140, step: 5, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0, accent: true },
  hints: [
    "Each bar starts with an air strum (the `-`): the chord pushed in on the & of 4 is still ringing.",
    "Move the fretting hand on the 4 so it's ready for the &.",
    "Check yourself: beat 1 is silent but you still *feel* it; the click on 1 should not catch you strumming."
  ],
  explain: `### Anticipation ('the push')
Arriving at the next chord an 8th early — and tying over the bar line — is the most common syncopation in pop and rock. It gives forward motion.`,
  visual: { type: "rhythm", meter: "4/4", grid: 2, bars: 2, pattern: "--DU-UDU | --DU-UDU", accents: [7, 15], chord: { root: "G", quality: "maj" }, title: "The & of 4 belongs to the next chord" },
  demo: { type: "rhythm", meter: "4/4", grid: 2, bars: 2, pattern: "--DU-UDU | --DU-UDU", accents: [7, 15], chord: { root: "G", quality: "maj" }, title: "Rhythm only, on one chord: the accented & of 4 is where the next chord arrives" },
  concepts: ["rhythmic-anticipation", "syncopation"],
  vary: ["tempo"]
},

{
  id: "rhy-strum-half-double",
  mode: "play", category: "rhythm", tags: ["strumming", "half-time", "double-time", "switching"],
  title: "Same pattern: half-time ↔ double-time",
  level: 5, length: "medium", minutes: 3,
  params: { root: ["G", "C", "D", "A", "E"], quality: ["maj", "min"] },
  prompt: "Play **D-DU-UDU** as **8ths** for one bar, then as **16ths** (twice per bar) for one bar on **{chord}**. Same click.",
  goal: "The pattern is identical in shape, exactly twice as fast in bar 2.",
  tempo: { start: 66, min: 50, max: 110, step: 4, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0, accent: true },
  hints: ["Your hand switches from 8th motion to 16th motion — a speed change, not just a choice of touches.", "Count the 8th bar '1 & 2 &', the 16th bar '1 e & a'."],
  explain: `### Rhythmic augmentation/diminution
Playing a figure at double or half speed against the same pulse is a classic arranging trick (half-time choruses!) and a good switching drill.`,
  visual: { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pattern: "D-DU-UDUD-DU-UDU", chord: { root: "$root", quality: "$quality" }, title: "Double-time bar (see demo for the 8th version first)" },
  demo: [
    { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pattern: "D-DU-UDU", chord: { root: "$root", quality: "$quality" }, title: "Bar 1: as 8ths (once per bar)" },
    { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pattern: "D-DU-UDUD-DU-UDU", chord: { root: "$root", quality: "$quality" }, title: "Bar 2: as 16ths (twice per bar)" }
  ],
  concepts: ["subdivisions", "constant-motion"],
  vary: ["tempo"]
},

// ─────────────────────────────────────────────────────────────────────────────
// C. PLECTRUM TECHNIQUE (category: picking)
// ─────────────────────────────────────────────────────────────────────────────

{
  id: "rhy-pick-alt-8ths",
  mode: "play", category: "picking", tags: ["alternate-picking", "eighths", "single-string"],
  title: "Alternate picking: 8ths on one string",
  level: 1, length: "short", minutes: 2,
  prompt: "Pick the open high E (or any fretted note) in **8ths, strictly down-up**. Downs on the numbers, ups on the &s.",
  goal: "Down and up strokes sound identical in volume and tone.",
  tempo: { start: 70, min: 50, max: 180, step: 5, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 2, swing: 0, accent: true },
  hints: ["Small motion, pick tip barely past the string.", "Grip the pick just firmly enough not to drop it."],
  explain: `### Alternate picking
Strict down-up picking ties stroke direction to rhythm. In 8ths: downs on the numbers, ups on the &s. (In 16ths it becomes downs on the numbers and &s, ups on the e's and a's.) It's the most rhythmically reliable technique and the base for everything that follows.`,
  visual: { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pick: "1 1 1 1 1 1 1 1", strokes: "D U D U D U D U" },
  demo: { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pick: "1 1 1 1 1 1 1 1", strokes: "D U D U D U D U" },
  concepts: ["alternate-picking"],
  vary: ["tempo"]
},

{
  id: "rhy-pick-alt-16ths",
  mode: "play", category: "picking", tags: ["alternate-picking", "sixteenths", "single-string"],
  title: "Alternate picking: 16ths on one string",
  level: 3, length: "short", minutes: 2,
  prompt: "16ths on string 3 (any fret), strict alternate picking, accent each beat.",
  goal: "Even 16ths for 8 bars; accents on the downstroke of each beat.",
  tempo: { start: 70, min: 50, max: 160, step: 5, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 4, swing: 0, accent: true },
  hints: ["Let the wrist (or forearm rotation) drive the motion — whichever feels lighter.", "Above ~120 bpm 16ths, notice whether your motion changes. That's normal."],
  explain: `### 16th-note picking
At the 16th level, picking efficiency matters. Keep the motion small and let the accent come from a slightly deeper downstroke.`,
  visual: { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pick: "3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3", strokes: "D U D U D U D U D U D U D U D U", accents: [0, 4, 8, 12] },
  demo: { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pick: "3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3", strokes: "D U D U D U D U D U D U D U D U", accents: [0, 4, 8, 12] },
  concepts: ["alternate-picking", "subdivisions"],
  vary: ["tempo"]
},

{
  id: "rhy-pick-alt-triplets",
  mode: "play", category: "picking", tags: ["alternate-picking", "triplets", "single-string"],
  title: "Alternate picking: triplets",
  level: 3, length: "short", minutes: 2,
  prompt: "8th-note triplets on string 2, **strict alternate picking**, accent each beat. Beat 2 and 4 start on an **upstroke**.",
  goal: "Clear accents on both the down- and up-stroke beats.",
  tempo: { start: 60, min: 40, max: 140, step: 5, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 3, swing: 0, accent: true },
  hints: ["Accented upstrokes need a deliberate dig.", "Don't 'fix' it with down-down — the point is the alternation."],
  explain: `### Odd groupings in alternate picking
With 3 per beat, the stroke on the beat alternates D, U, D, U. Owning that accented upstroke makes triplets — and later 5s and 7s — reliable.`,
  visual: { type: "rhythm", meter: "4/4", grid: 3, bars: 1, pick: "2 2 2 2 2 2 2 2 2 2 2 2", strokes: "D U D U D U D U D U D U", accents: [0, 3, 6, 9] },
  demo: { type: "rhythm", meter: "4/4", grid: 3, bars: 1, pick: "2 2 2 2 2 2 2 2 2 2 2 2", strokes: "D U D U D U D U D U D U", accents: [0, 3, 6, 9] },
  concepts: ["alternate-picking", "triplets"],
  vary: ["tempo"]
},

{
  id: "rhy-pick-alt-sextuplets",
  mode: "play", category: "picking", tags: ["alternate-picking", "sextuplets", "speed"],
  title: "Alternate picking: sextuplets",
  level: 5, length: "short", minutes: 2,
  prompt: "Sextuplets (6 per click) on one string, strict alternate picking, accent each beat.",
  goal: "Clean sextuplets for 4 bars at the target tempo, relaxed.",
  tempo: { start: 60, min: 40, max: 120, step: 4, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0, accent: true },
  hints: ["6 = even, so every beat starts with a downstroke.", "If you tense up, drop 8 bpm."],
  explain: `### Sextuplets in picking
The 'shred' subdivision: six per beat. At 100 bpm that's 10 notes per second. Clean sextuplets at 120+ are an advanced benchmark.`,
  visual: { type: "rhythm", meter: "4/4", grid: 6, bars: 1, pick: "1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1", strokes: "D U D U D U D U D U D U D U D U D U D U D U D U", accents: [0, 6, 12, 18] },
  demo: { type: "rhythm", meter: "4/4", grid: 6, bars: 1, pick: "1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1", strokes: "D U D U D U D U D U D U D U D U D U D U D U D U", accents: [0, 6, 12, 18] },
  concepts: ["alternate-picking", "tuplets"],
  vary: ["tempo"]
},

{
  id: "rhy-pick-alt-quintuplets", retired: true,
  mode: "play", category: "picking", tags: ["alternate-picking", "quintuplets", "advanced"],
  title: "Alternate picking: quintuplets",
  level: 7, length: "short", minutes: 2,
  prompt: "Quintuplets (5 per click) on one string, strict alternate picking, accent each beat (alternating D/U).",
  goal: "Five even notes per beat for 4 bars.",
  tempo: { start: 50, min: 36, max: 100, step: 4, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0, accent: true },
  hints: ["Say 'u-ni-ver-si-ty'.", "Accents alternate down/up like triplets."],
  explain: `### Quintuplets in picking
5 per beat with alternating accent direction — great for evenness and for modern 'over the bar' phrasing.`,
  visual: { type: "rhythm", meter: "4/4", grid: 5, bars: 1, pick: "1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1", strokes: "D U D U D U D U D U D U D U D U D U D U", accents: [0, 5, 10, 15] },
  demo: { type: "rhythm", meter: "4/4", grid: 5, bars: 1, pick: "1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1", strokes: "D U D U D U D U D U D U D U D U D U D U", accents: [0, 5, 10, 15] },
  concepts: ["alternate-picking", "tuplets"],
  vary: ["tempo"]
},

{
  id: "rhy-pick-bursts",
  mode: "play", category: "picking", tags: ["alternate-picking", "speed", "bursts", "picking-motion"],
  title: "Speed bursts: 5 notes and stop",
  level: 4, length: "short", minutes: 2,
  prompt: "On one string: a **burst of 5 fast 16ths** (D U D U D) landing on the next beat, then rest. Twice per bar. Push the tempo — bursts are short, so you can go faster than you can sustain.",
  goal: "Bursts are even and the landing note is exactly on the beat.",
  tempo: { start: 80, min: 60, max: 180, step: 5, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0, accent: true },
  hints: [
    "Bursts let you feel a fast, relaxed motion before you can sustain it.",
    "If the motion feels smooth and effortless at speed, that's the motion to keep. If it 'jams', try a different arm joint (wrist vs forearm vs elbow)."
  ],
  explain: `### Burst training
Troy Grady's research emphasises finding an *efficient motion at speed first*, then building accuracy, rather than slowly accelerating a motion that may not scale. Short bursts at high tempo are a practical way to test which motion works for you.`,
  visual: { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pick: "2 2 2 2 2 - - - 2 2 2 2 2 - - -", strokes: "D U D U D - - - D U D U D - - -", accents: [0, 4, 8, 12] },
  demo: { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pick: "2 2 2 2 2 - - - 2 2 2 2 2 - - -", strokes: "D U D U D - - - D U D U D - - -", accents: [0, 4, 8, 12] },
  concepts: ["alternate-picking", "pick-escape"],
  vary: ["tempo"],
  source: "Troy Grady, Cracking the Code (troygrady.com) — 'speed first' / burst practice"
},

{
  id: "rhy-pick-tremolo",
  mode: "play", category: "picking", tags: ["tremolo", "speed", "single-string", "endurance"],
  title: "Tremolo picking endurance",
  level: 4, length: "medium", minutes: 3,
  prompt: "Continuous **16th-note tremolo** on one string for 4 bars, then 4 bars of **sextuplets**. Keep the wrist loose and the pick shallow.",
  goal: "8 bars without tension creep or dropping the subdivision.",
  tempo: { start: 80, min: 60, max: 180, step: 5, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0, accent: true },
  hints: ["Anchor lightly (or not at all) — gripping the bridge creates tension.", "Next card: move the fretting hand while keeping the tremolo (melody on one string)."],
  explain: `### Tremolo
Fast, continuous picking of one note — surf, metal, Mandolin-style melodies, and Dick Dale's 'Misirlou' style. The challenge is endurance and keeping the subdivision metric (not just 'fast').`,
  visual: { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pick: "1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1", strokes: "D U D U D U D U D U D U D U D U", accents: [0, 4, 8, 12] },
  demo: [
    { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pick: "1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1", strokes: "D U D U D U D U D U D U D U D U", accents: [0, 4, 8, 12] },
    { type: "rhythm", meter: "4/4", grid: 6, bars: 1, pick: "1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1", strokes: "D U D U D U D U D U D U D U D U D U D U D U D U", accents: [0, 6, 12, 18] }
  ],
  concepts: ["tremolo-picking", "alternate-picking"],
  vary: ["tempo"]
},

{
  id: "rhy-pick-tremolo-melody",
  mode: "play", category: "picking", tags: ["tremolo", "melody", "single-string"],
  title: "Tremolo melody on one string",
  level: 6, length: "medium", minutes: 3,
  params: { key: ["Am", "Em", "Dm"] },
  prompt: "Tremolo-pick 16ths on string 2 while playing the **{key}** scale up and down that string, **one scale note per beat**. Pitch changes must land exactly on the beat.",
  goal: "Seamless tremolo with clean, on-the-beat note changes.",
  tempo: { start: 60, min: 40, max: 120, step: 4, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0, accent: true },
  hints: ["The fretting hand moves on the beat, the picking hand never stops.", "Then try 2 notes per beat (change on 1 and &)."],
  explain: `### Hand sync in tremolo
Coordinating fretting-hand changes with a non-stop picking hand is the core of tremolo melody playing (and of synchronising fast lines in general).`,
  visual: { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pick: "2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2", strokes: "D U D U D U D U D U D U D U D U", accents: [0, 4, 8, 12] },
  demo: { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pick: "2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2", strokes: "D U D U D U D U D U D U D U D U", accents: [0, 4, 8, 12] },
  concepts: ["tremolo-picking"],
  vary: ["tempo", "key"]
},

{
  id: "rhy-pick-downpicking",
  mode: "play", category: "picking", tags: ["downpicking", "eighths", "rock", "endurance"],
  title: "Downpicking endurance",
  level: 3, length: "medium", minutes: 3,
  prompt: "Palm-muted low E in **8ths, all downstrokes**, for 16 bars. Climb the tempo ladder.",
  goal: "Even, punchy 8ths for 16 bars at the target tempo without fatigue.",
  tempo: { start: 100, min: 80, max: 220, step: 10, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0, accent: true },
  hints: ["Small circular motion: down through the string, up *around* it.", "Ramones/Metallica-style downpicking — 180+ bpm is a serious benchmark."],
  explain: `### All-downs
Downstrokes sound heavier and more uniform than alternate picking, which is why punk and thrash players use them. It's a stamina technique: efficient return motion is everything.`,
  visual: { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pick: "6 6 6 6 6 6 6 6", strokes: "D D D D D D D D", accents: [0, 2, 4, 6] },
  demo: { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pick: "6 6 6 6 6 6 6 6", strokes: "D D D D D D D D", accents: [0, 2, 4, 6] },
  concepts: ["palm-muting", "alternate-picking"],
  vary: ["tempo"]
},

{
  id: "rhy-pick-inside-outside",
  mode: "play", category: "picking", tags: ["alternate-picking", "string-crossing", "inside-outside"],
  title: "String crossing: {p:kind} picking",
  level: 4, length: "short", minutes: 2,
  params: {
    kind: [
      { v: "2 1 2 1 2 1 2 1 2 1 2 1 2 1 2 1", label: "outside" },
      { v: "1 2 1 2 1 2 1 2 1 2 1 2 1 2 1 2", label: "inside", lvl: 1 }
    ]
  },
  prompt: "Alternate 16ths between strings 2 and 1 (any frets), strict down-up: **{p:kind}** picking. Watch what the pick has to jump over.",
  goal: "Even, clean string changes at the target tempo for 4 bars.",
  tempo: { start: 60, min: 40, max: 140, step: 4, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0, accent: true },
  hints: [
    "Outside: downstroke on the thicker string, upstroke on the thinner — the pick travels *around* the outside of the pair.",
    "Inside: upstroke on the thicker string, downstroke on the thinner — the pick works *between* them.",
    "Most players find one much easier. Your easier one hints at your natural escape motion."
  ],
  explain: `### Inside vs outside
Two-string alternation has two forms. **Outside picking** (D on the thicker string) and **inside picking** (U on the thicker string) need different pick paths. Many players are fast at one and stuck at the other — that asymmetry is what Troy Grady's escape-motion research explains.`,
  visual: { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pick: "$kind", strokes: "D U D U D U D U D U D U D U D U" },
  demo: { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pick: "$kind", strokes: "D U D U D U D U D U D U D U D U" },
  concepts: ["alternate-picking", "pick-escape"],
  vary: ["tempo", "kind"]
},

{
  id: "rhy-pick-usx-2nps",
  mode: "play", category: "picking", tags: ["picking-motion", "upstroke-escape", "two-notes-per-string", "troy-grady"],
  title: "Upstroke escape: 2 notes per string",
  level: 4, length: "medium", minutes: 3,
  prompt: "Two notes per string, alternating strings 3 and 2 (e.g. a pentatonic fragment), **starting on a downstroke**. Every string change happens **after an upstroke** — let the upstroke 'escape' outward, away from the body.",
  goal: "Smooth string changes at the target tempo; no 'hitting' the next string.",
  tempo: { start: 70, min: 50, max: 160, step: 5, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0, accent: true },
  hints: [
    "The downstroke stays 'trapped' between the strings; the upstroke lifts out (an 'upstroke escape', a.k.a. downward pickslanting).",
    "Many players do this naturally with a slight downward pick slant or wrist motion.",
    "If it feels effortless, this is likely your 'primary' escape."
  ],
  explain: `### Upstroke escape (USX)
Troy Grady's *Cracking the Code* reframed picking around **escape motion**: which stroke leaves the string plane so the pick can switch strings without hitting anything. With 2 notes per string starting on a down, all string changes follow an upstroke, so a **USX** motion handles everything. Older term: downward pickslanting.`,
  visual: { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pick: "3 3 2 2 3 3 2 2 3 3 2 2 3 3 2 2", strokes: "D U D U D U D U D U D U D U D U", accents: [0, 4, 8, 12] },
  demo: { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pick: "3 3 2 2 3 3 2 2 3 3 2 2 3 3 2 2", strokes: "D U D U D U D U D U D U D U D U", accents: [0, 4, 8, 12] },
  concepts: ["pick-escape", "alternate-picking"],
  vary: ["tempo"],
  source: "Troy Grady, Cracking the Code — 'Pickslanting Primer' (troygrady.com)"
},

{
  id: "rhy-pick-dsx-2nps",
  mode: "play", category: "picking", tags: ["picking-motion", "downstroke-escape", "two-notes-per-string", "troy-grady"],
  title: "Downstroke escape: 2 notes per string, offset",
  level: 5, length: "medium", minutes: 3,
  prompt: "Same 2-notes-per-string idea, but **start the pair on an upstroke** (pattern: 3 | 2 2 | 3 3 | 2 2 ...). Now every string change happens **after a downstroke** — let the downstroke escape outward.",
  goal: "Smooth string changes at the target tempo.",
  tempo: { start: 60, min: 40, max: 150, step: 5, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0, accent: true },
  hints: [
    "Downstroke escape = the pick lifts away from the body after a downstroke (a.k.a. upward pickslanting, Yngwie's main motion).",
    "Compare with the USX card: which is easier for you?",
    "Play it ascending through a scale with 2 notes per string to make it musical."
  ],
  explain: `### Downstroke escape (DSX)
Shift a two-note-per-string pattern by one note and the string changes move to the downstrokes. Now a **DSX** motion (upward pickslant) is needed. Learning both escapes — or a 'double escape' motion that leaves the strings on both strokes — is what lets you alternate-pick any line.`,
  visual: { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pick: "3 2 2 3 3 2 2 3 3 2 2 3 3 2 2 3", strokes: "D U D U D U D U D U D U D U D U", accents: [0, 4, 8, 12] },
  demo: { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pick: "3 2 2 3 3 2 2 3 3 2 2 3 3 2 2 3", strokes: "D U D U D U D U D U D U D U D U", accents: [0, 4, 8, 12] },
  concepts: ["pick-escape", "alternate-picking"],
  vary: ["tempo"],
  source: "Troy Grady, Cracking the Code (troygrady.com)"
},

{
  id: "rhy-pick-3nps-alternate",
  mode: "play", category: "picking", tags: ["picking-motion", "two-way-pickslanting", "three-notes-per-string", "alternate-picking"],
  title: "3 notes per string, strict alternate",
  level: 6, length: "medium", minutes: 4,
  params: { key: "major" },
  prompt: "Play a 3-notes-per-string **{key}** scale fragment across strings 6→3 in triplets, **strict alternate picking**. The string changes alternate: after a down, after an up, after a down... — you need both escapes.",
  goal: "Clean string changes in both directions at the target tempo.",
  tempo: { start: 60, min: 40, max: 140, step: 4, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0, accent: true },
  hints: [
    "String 6: D U D → change after D (DSX). String 5: U D U → change after U (USX).",
    "Two-way pickslanting (switching slant per string) or a double-escape motion both solve this.",
    "Compare with the economy-picking card, which avoids the problem."
  ],
  explain: `### Why 3nps alternate is hard
With an odd number of notes per string, string changes alternate between upstrokes and downstrokes. That's exactly the problem Grady's 'two-way pickslanting' / 'double escape' concepts address. Many famous alternate pickers (e.g. Paul Gilbert, John Petrucci) handle it in different ways.`,
  visual: { type: "rhythm", meter: "4/4", grid: 3, bars: 1, pick: "6 6 6 5 5 5 4 4 4 3 3 3", strokes: "D U D U D U D U D U D U", accents: [0, 3, 6, 9] },
  demo: { type: "rhythm", meter: "4/4", grid: 3, bars: 1, pick: "6 6 6 5 5 5 4 4 4 3 3 3", strokes: "D U D U D U D U D U D U", accents: [0, 3, 6, 9] },
  concepts: ["pick-escape", "alternate-picking", "economy-picking"],
  vary: ["tempo", "key"],
  source: "Troy Grady, Cracking the Code — two-way pickslanting"
},

{
  id: "rhy-pick-economy-up",
  mode: "play", category: "picking", tags: ["economy-picking", "three-notes-per-string", "sweep"],
  title: "Economy picking: 3nps ascending",
  level: 5, length: "medium", minutes: 3,
  params: { key: "major" },
  prompt: "3-notes-per-string **{key}** fragment, strings 6→3, in triplets. Alternate on each string, but **sweep the string change with a downstroke**: D U D | D U D | D U D ...",
  goal: "The string-change 'double down' sounds as even as everything else.",
  tempo: { start: 60, min: 40, max: 150, step: 4, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0, accent: true },
  hints: [
    "The sweep is one continuous push through two strings — not two separate downstrokes.",
    "The danger is rushing the sweep. Keep it in time with the triplet.",
    "Descending, the mirror is U D U | U D U."
  ],
  explain: `### Economy picking
**Economy** = alternate picking on a string, but when you move to the next string in the same direction the pick is already travelling, you continue that stroke (a mini-sweep). Ascending 3nps → every string change is a down-down. It's efficient but can rush if you aren't careful about time.`,
  visual: { type: "rhythm", meter: "4/4", grid: 3, bars: 1, pick: "6 6 6 5 5 5 4 4 4 3 3 3", strokes: "D U D D U D D U D D U D", accents: [0, 3, 6, 9] },
  demo: { type: "rhythm", meter: "4/4", grid: 3, bars: 1, pick: "6 6 6 5 5 5 4 4 4 3 3 3", strokes: "D U D D U D D U D D U D", accents: [0, 3, 6, 9] },
  concepts: ["economy-picking", "sweep-picking"],
  vary: ["tempo", "key"]
},

{
  id: "rhy-pick-economy-down",
  mode: "play", category: "picking", tags: ["economy-picking", "three-notes-per-string", "descending"],
  title: "Economy picking: 3nps descending",
  level: 6, length: "medium", minutes: 3,
  params: { key: "major" },
  prompt: "Descend a 3nps **{key}** fragment, strings 1→4, triplets: **U D U | U D U ...** — sweep each string change with an upstroke.",
  goal: "Even triplets with smooth upward sweeps.",
  tempo: { start: 60, min: 40, max: 150, step: 4, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0, accent: true },
  hints: ["Starting a phrase on an upstroke feels strange at first — that's the main hurdle.", "Combine with the ascending card for a full up-and-down run."],
  explain: `### Economy descending
The mirror image: an upward sweep at every string change. Frank Gambale built his style around strict economy picking in both directions.`,
  visual: { type: "rhythm", meter: "4/4", grid: 3, bars: 1, pick: "1 1 1 2 2 2 3 3 3 4 4 4", strokes: "U D U U D U U D U U D U", accents: [0, 3, 6, 9] },
  demo: { type: "rhythm", meter: "4/4", grid: 3, bars: 1, pick: "1 1 1 2 2 2 3 3 3 4 4 4", strokes: "U D U U D U U D U U D U", accents: [0, 3, 6, 9] },
  concepts: ["economy-picking"],
  vary: ["tempo", "key"],
  source: "Frank Gambale, Speed Picking (REH, 1994)"
},

{
  id: "rhy-pick-sweep-3",
  mode: "play", category: "picking", tags: ["sweep-picking", "arpeggios", "triads"],
  title: "Sweep picking: 3-string triad",
  level: 5, length: "medium", minutes: 3,
  params: { root: ["A", "G", "D", "C"], quality: ["min", "maj"] },
  prompt: "Sweep a **{chord}** triad on strings 3-2-1 in triplets: **down-down-down** up the strings, two notes on string 1 (pull-off or alternate), **up-up-up** back down.",
  goal: "Each note separate (no strum), perfectly in triplet time.",
  tempo: { start: 50, min: 36, max: 120, step: 4, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0, accent: true },
  hints: [
    "Mute each note as you leave it (fretting-hand roll / lift), or it becomes a strummed chord.",
    "The pick 'falls' through the strings in one motion, but the rhythm must stay metric.",
    "Arpeggio shapes are on the arpeggio cards — focus on the picking hand here."
  ],
  explain: `### Sweep picking
One continuous pick motion through several strings, one note per string, like a slow controlled strum. The keys are **muting** (only one note rings) and **rhythm** (each note on its slot, not a rushed 'rake').`,
  visual: { type: "rhythm", meter: "4/4", grid: 3, bars: 1, pick: "3 2 1 1 2 3 3 2 1 1 2 3", strokes: "D D D U U U D D D U U U", chord: { root: "$root", quality: "$quality" }, accents: [0, 3, 6, 9] },
  demo: { type: "rhythm", meter: "4/4", grid: 3, bars: 1, pick: "3 2 1 1 2 3 3 2 1 1 2 3", strokes: "D D D U U U D D D U U U", chord: { root: "$root", quality: "$quality" }, accents: [0, 3, 6, 9] },
  concepts: ["sweep-picking", "economy-picking"],
  vary: ["tempo", "root", "quality"]
},

{
  id: "rhy-pick-sweep-5",
  mode: "play", category: "picking", tags: ["sweep-picking", "arpeggios", "five-string"],
  title: "Sweep picking: 5-string arpeggio",
  level: 7, length: "medium", minutes: 4,
  params: { root: ["A", "C", "D"], quality: ["min", "maj"] },
  prompt: "**{chord}** arpeggio on strings 5→1 and back, in 16ths: sweep down through 5-4-3-2-1, turn around on string 1, sweep up 2-3-4 and continue up to 5.",
  goal: "Clean, separated notes with the turnarounds in time.",
  tempo: { start: 50, min: 36, max: 120, step: 4, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0, accent: true },
  hints: [
    "The loop: the low note ends the upward sweep (U), the next note starts the downward sweep (D).",
    "16ths don't line up with the 8-note cycle the way triplets would — it's fine, it repeats every 2 beats.",
    "Slow is smooth. Muting is the whole game."
  ],
  explain: `### Larger sweeps
5-string sweeps are the classic neo-classical/fusion arpeggio technique. Practise in strict rhythm with a click — sweeps rushed into a blur are the most common fault.`,
  visual: { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pick: "5 4 3 2 1 2 3 4 5 4 3 2 1 2 3 4", strokes: "U D D D D U U U U D D D D U U U", chord: { root: "$root", quality: "$quality" }, accents: [0, 4, 8, 12] },
  demo: { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pick: "5 4 3 2 1 2 3 4 5 4 3 2 1 2 3 4", strokes: "U D D D D U U U U D D D D U U U", chord: { root: "$root", quality: "$quality" }, accents: [0, 4, 8, 12] },
  concepts: ["sweep-picking"],
  vary: ["tempo", "root", "quality"]
},

{
  id: "rhy-pick-sweep-6",
  mode: "play", category: "picking", tags: ["sweep-picking", "arpeggios", "six-string", "sextuplets"],
  title: "Sweep picking: 6-string sextuplets",
  level: 8, length: "medium", minutes: 4,
  params: { root: ["E", "A", "G"], quality: ["maj", "min"] },
  prompt: "**{chord}** arpeggio across all six strings as **sextuplets**: down-sweep 6→1 in one beat, up-sweep 1→6 in the next.",
  goal: "Even sextuplets, one clear note per string, at the target tempo.",
  tempo: { start: 50, min: 36, max: 110, step: 4, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0, accent: true },
  hints: ["Each beat = one full sweep.", "Repeat the low note with a down after the up-sweep (same string, alternate)."],
  explain: `### Full sweeps
Six-string sweeps put the most strain on muting and time. Sextuplets give exactly one note per string per beat — an elegant rhythmic frame.`,
  visual: { type: "rhythm", meter: "4/4", grid: 6, bars: 1, pick: "6 5 4 3 2 1 1 2 3 4 5 6 6 5 4 3 2 1 1 2 3 4 5 6", strokes: "D D D D D D U U U U U U D D D D D D U U U U U U", chord: { root: "$root", quality: "$quality" }, accents: [0, 6, 12, 18] },
  demo: { type: "rhythm", meter: "4/4", grid: 6, bars: 1, pick: "6 5 4 3 2 1 1 2 3 4 5 6 6 5 4 3 2 1 1 2 3 4 5 6", strokes: "D D D D D D U U U U U U D D D D D D U U U U U U", chord: { root: "$root", quality: "$quality" }, accents: [0, 6, 12, 18] },
  concepts: ["sweep-picking", "tuplets"],
  vary: ["tempo", "root"]
},

{
  id: "rhy-pick-crosspicking",
  mode: "play", category: "picking", tags: ["crosspicking", "bluegrass", "rolls", "3-over-8"],
  title: "Crosspicking roll (3 over 8)",
  level: 6, length: "medium", minutes: 3,
  params: { root: ["G", "C", "D", "A"], quality: ["maj"] },
  prompt: "Hold **{chord}** and crosspick strings 3-2-1 in a repeating 3-note cycle with **strict alternate picking** in 8ths. The 3-note shape against 8 notes per bar creates a rolling 3-3-2 accent.",
  goal: "Smooth, banjo-like roll for 8 bars; all notes even.",
  tempo: { start: 80, min: 60, max: 180, step: 5, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 2, swing: 0, accent: true },
  hints: [
    "Every string change needs an escape on *both* strokes — a 'double escape' motion.",
    "Tony Rice and Clarence White are the reference sound.",
    "Let the notes ring into each other like a harp."
  ],
  explain: `### Crosspicking
A bluegrass technique that imitates banjo rolls with a flatpick: one note per string, cycling across 3 strings. Because a new string comes every note, the picking motion must escape the strings on both downs and ups (Grady's 'double escape'), often from the elbow or a curved wrist motion.`,
  visual: { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pick: "3 2 1 3 2 1 3 2", strokes: "D U D U D U D U", accents: [0, 3, 6], chord: { root: "$root", quality: "$quality" } },
  demo: { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pick: "3 2 1 3 2 1 3 2", strokes: "D U D U D U D U", accents: [0, 3, 6], chord: { root: "$root", quality: "$quality" } },
  concepts: ["crosspicking", "pick-escape", "groupings"],
  vary: ["tempo", "root"]
},

{
  id: "rhy-pick-skip-octaves",
  mode: "play", category: "picking", tags: ["string-skipping", "octaves", "alternate-picking"],
  title: "String skipping: octaves 6 & 4",
  level: 3, length: "short", minutes: 2,
  params: { root: ["A", "G", "C", "E"] },
  prompt: "Play **{root}** on string 6 and its octave on string 4 in alternating 8ths, alternate picking. Skip string 5 cleanly.",
  goal: "No accidental string-5 noise; even 8ths for 8 bars.",
  tempo: { start: 70, min: 50, max: 160, step: 5, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 2, swing: 0, accent: true },
  hints: ["The skipped string must be muted (fretting finger underside or picking palm).", "Then try 16ths and strings 5 & 3."],
  explain: `### String skipping
Jumping over a string while alternate picking demands a slightly bigger, accurate motion. Octave lines (disco/funk, Wes-style) are the friendliest place to start.`,
  visual: { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pick: "6 4 6 4 6 4 6 4", strokes: "D U D U D U D U" },
  demo: { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pick: "6 4 6 4 6 4 6 4", strokes: "D U D U D U D U" },
  concepts: ["alternate-picking", "pick-escape"],
  vary: ["tempo", "root"]
},

{
  id: "rhy-pick-skip-arps",
  mode: "play", category: "picking", tags: ["string-skipping", "arpeggios", "alternate-picking", "advanced"],
  title: "String skipping arpeggio pattern",
  level: 6, length: "medium", minutes: 3,
  params: { root: ["A", "C", "D", "G"], quality: ["min", "maj", "m7", "maj7"] },
  prompt: "Hold a **{chord}** shape and pick strings **5-3-4-2** repeatedly in 16ths, strict alternate picking.",
  goal: "Clean skips at the target tempo, every note even.",
  tempo: { start: 60, min: 40, max: 130, step: 4, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0, accent: true },
  hints: ["Every change is a skip or a step back — notice which ones are 'inside' vs 'outside'.", "Paul Gilbert-style skipping licks build from exactly this kind of cell."],
  explain: `### Skipping in alternation
Skipping patterns mix inside and outside string changes, so they test whether your picking motion can escape in both directions — or whether you'll need to adjust.`,
  visual: { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pick: "5 3 4 2 5 3 4 2 5 3 4 2 5 3 4 2", strokes: "D U D U D U D U D U D U D U D U", chord: { root: "$root", quality: "$quality" }, accents: [0, 4, 8, 12] },
  demo: { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pick: "5 3 4 2 5 3 4 2 5 3 4 2 5 3 4 2", strokes: "D U D U D U D U D U D U D U D U", chord: { root: "$root", quality: "$quality" }, accents: [0, 4, 8, 12] },
  concepts: ["alternate-picking", "pick-escape"],
  vary: ["tempo", "root", "quality"]
},

{
  id: "rhy-pick-accent-groups",
  mode: "play", category: "picking", tags: ["alternate-picking", "accents", "groupings", "sixteenths"],
  title: "Picking accents: {p:group}",
  level: 5, length: "medium", minutes: 3,
  params: {
    group: [
      { v: [0, 4, 8, 12], label: "every beat" },
      { v: [0, 3, 6, 9, 12], label: "3+3+3+3+4" },
      { v: [0, 3, 6, 8, 11, 14], label: "3+3+2 | 3+3+2", lvl: 1 },
      { v: [0, 5, 10], label: "5+5+6", lvl: 2 }
    ]
  },
  prompt: "Alternate-pick 16ths on one string; **accent {p:group}**. The accents fall on both down- and upstrokes.",
  goal: "Accents clear, everything else even, for 8 bars.",
  tempo: { start: 60, min: 40, max: 130, step: 4, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0, accent: true },
  hints: ["Then do it with a scale: accented notes become the 'melody'.", "This is Chaffee-style grouping applied to the picking hand."],
  explain: `### Accented alternate picking
Being able to accent any note in a stream (not just downstrokes) gives your lines shape and lets you superimpose groupings over the bar.`,
  visual: { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pick: "1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1", strokes: "D U D U D U D U D U D U D U D U", accents: "$group" },
  demo: { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pick: "1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1", strokes: "D U D U D U D U D U D U D U D U", accents: "$group" },
  concepts: ["alternate-picking", "groupings", "accents-ghosts"],
  vary: ["tempo", "group"]
},

{
  id: "rhy-pick-hybrid-intro",
  mode: "play", category: "picking", tags: ["hybrid-picking", "arpeggios"],
  title: "Hybrid picking: pick + m + a",
  level: 3, length: "short", minutes: 2,
  params: { root: ["C", "A", "D"], quality: ["maj", "min", "maj7"] },
  prompt: "Hold **{chord}**. **Pick** plays strings 4 and 3; **middle finger (m)** plucks string 2, **ring finger (a)** plucks string 1: pick-m-pick-a in 8ths.",
  goal: "Pick and finger notes match in volume and timing for 8 bars.",
  tempo: { start: 70, min: 50, max: 150, step: 5, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 2, swing: 0, accent: true },
  hints: [
    "In this card `p` in the finger row means *the pick*.",
    "Curl m and a lightly under the string and snap upward-outward.",
    "Use downstrokes with the pick at first; try down-up once it's even."
  ],
  explain: `### Hybrid picking
Holding a pick between thumb and index while plucking with middle and ring (sometimes pinky) gives piano-like string skips and pinches without abandoning the plectrum. Country, jazz and fusion players (Brent Mason, Greg Howe, Eric Johnson) rely on it.`,
  visual: { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pick: "4 2 3 1 4 2 3 1", strokes: "D - D - D - D -", fingers: "p m p a p m p a", chord: { root: "$root", quality: "$quality" } },
  demo: { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pick: "4 2 3 1 4 2 3 1", strokes: "D - D - D - D -", fingers: "p m p a p m p a", chord: { root: "$root", quality: "$quality" } },
  concepts: ["hybrid-picking"],
  vary: ["tempo", "root", "quality"]
},

{
  id: "rhy-pick-hybrid-pinch",
  mode: "play", category: "picking", tags: ["hybrid-picking", "pinch", "country"],
  title: "Hybrid pinches: bass + double-stop",
  level: 4, length: "short", minutes: 2,
  params: { root: ["A", "C", "D"], quality: ["maj", "7"] },
  prompt: "On **{chord}**: pick a bass note (string 5, then 4) on each beat, and pluck strings 2+1 together with **m+a** on each &.",
  goal: "Even bass, crisp double-stops, steady time for 8 bars.",
  tempo: { start: 80, min: 60, max: 160, step: 5, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 2, swing: 0, accent: true },
  hints: ["`p` in the finger row = the pick.", "This is a hybrid 'boom-chick' — the country picker's basic accompaniment."],
  explain: `### Hybrid boom-chick
The pick takes the bass role, the fingers the chord 'chick'. Much cleaner than strumming the chick, and it frees you to add melody notes.`,
  visual: { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pick: "5 2+1 4 2+1 5 2+1 4 2+1", strokes: "D - D - D - D -", fingers: "p m+a p m+a p m+a p m+a", chord: { root: "$root", quality: "$quality" } },
  demo: { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pick: "5 2+1 4 2+1 5 2+1 4 2+1", strokes: "D - D - D - D -", fingers: "p m+a p m+a p m+a p m+a", chord: { root: "$root", quality: "$quality" } },
  concepts: ["hybrid-picking", "boom-chick"],
  vary: ["tempo", "root"]
},

{
  id: "rhy-pick-hybrid-chicken",
  mode: "play", category: "picking", tags: ["hybrid-picking", "chicken-pickin", "country", "sixteenths"],
  title: "Chicken pickin': pick + snapped m",
  level: 5, length: "medium", minutes: 3,
  prompt: "16ths alternating **pick on string 3** and a **snapped middle finger on string 2** (pull the string slightly and let it slap the fretboard). Fretting hand half-mutes for the 'cluck'.",
  goal: "Percussive, even 16ths for 8 bars.",
  tempo: { start: 60, min: 40, max: 140, step: 4, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0, accent: true },
  hints: ["`p` = pick.", "The snap is a little 'pop' — let the string bounce off the frets.", "Think Albert Lee, Brent Mason, Danny Gatton."],
  explain: `### Chicken pickin'
Country hybrid technique: muted, snapped notes alternating pick and finger, sounding like clucking. Rhythmically it's a strict 16th grid split between two 'drivers'.`,
  visual: { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pick: "3 2 3 2 3 2 3 2 3 2 3 2 3 2 3 2", strokes: "D - D - D - D - D - D - D - D -", fingers: "p m p m p m p m p m p m p m p m", accents: [0, 4, 8, 12] },
  demo: { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pick: "3 2 3 2 3 2 3 2 3 2 3 2 3 2 3 2", strokes: "D - D - D - D - D - D - D - D -", fingers: "p m p m p m p m p m p m p m p m", accents: [0, 4, 8, 12] },
  concepts: ["hybrid-picking"],
  vary: ["tempo"]
},

// ─────────────────────────────────────────────────────────────────────────────
// D. FINGERSTYLE (category: picking, tag: fingerstyle)
// ─────────────────────────────────────────────────────────────────────────────

{
  id: "rhy-fs-pima-basic",
  mode: "play", category: "picking", tags: ["fingerstyle", "pima", "arpeggios", "classical"],
  title: "p-i-m-a arpeggio on {chord}",
  level: 2, length: "short", minutes: 2,
  params: { root: ["A", "C"], quality: ["maj", "min", "7"] },
  prompt: "Hold **{chord}**. Thumb (**p**) plays string 5, then **i** string 3, **m** string 2, **a** string 1 — in 8ths, twice per bar.",
  goal: "Every finger equally loud, notes ringing, time steady for 8 bars.",
  tempo: { start: 60, min: 40, max: 140, step: 5, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 2, swing: 0, accent: true },
  hints: ["Classical default: thumb owns strings 4-6, i=3, m=2, a=1.", "Fingers move from the knuckle; thumb from its base joint, pushing forward (not up)."],
  explain: `### p-i-m-a
Classical names for the picking-hand digits: **p** (pulgar, thumb), **i** (índice), **m** (medio), **a** (anular). Assigning one finger per string is the foundation of fingerstyle arpeggios.`,
  visual: { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pick: "5 3 2 1 5 3 2 1", fingers: "p i m a p i m a", chord: { root: "$root", quality: "$quality" } },
  demo: { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pick: "5 3 2 1 5 3 2 1", fingers: "p i m a p i m a", chord: { root: "$root", quality: "$quality" } },
  concepts: ["pima"],
  vary: ["tempo", "root", "quality"]
},

{
  id: "rhy-fs-arpeggio-patterns",
  mode: "play", category: "picking", tags: ["fingerstyle", "pima", "arpeggios"],
  title: "Arpeggio pattern: {p:arp}",
  level: 3, length: "medium", minutes: 3,
  params: {
    root: ["A", "C"], quality: ["maj", "min", "maj7", "m7"],
    arp: [
      { v: "5 3 2 1 2 3 2 1", label: "p i m a m i m a" },
      { v: "5 3 2 3 1 3 2 3", label: "p i m i a i m i", lvl: 1 },
      { v: "5 1 2 3 5 1 2 3", label: "p a m i (descending)", lvl: 1 },
      { v: "5 2+1 3 2+1 4 2+1 3 2+1", label: "p (m+a) i (m+a) with moving bass", lvl: 2 }
    ]
  },
  prompt: "Hold **{chord}** and play **{p:arp}** in 8ths using the classical finger assignment (p on bass strings, i=3, m=2, a=1).",
  goal: "Smooth, even arpeggio for 8 bars.",
  tempo: { start: 60, min: 40, max: 140, step: 5, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 2, swing: 0, accent: true },
  hints: ["Plant fingers on their strings before you play (the 'prepared' stroke) at first.", "Listen for the weakest finger (usually a) and match the others to it."],
  explain: `### Arpeggio vocabulary
Giuliani's *120 Right-Hand Studies* is the classic source of these patterns. A handful of patterns covers most folk/pop fingerpicking accompaniments.`,
  visual: { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pick: "$arp", chord: { root: "$root", quality: "$quality" } },
  demo: { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pick: "$arp", chord: { root: "$root", quality: "$quality" } },
  concepts: ["pima"],
  vary: ["tempo", "arp", "root"],
  source: "Mauro Giuliani, 120 Studies for Right Hand, Op. 1 (1812)"
},

{
  id: "rhy-fs-giuliani-triplets",
  mode: "play", category: "picking", tags: ["fingerstyle", "pima", "triplets", "classical"],
  title: "Triplet arpeggio: p-i-m-a-m-i",
  level: 4, length: "medium", minutes: 3,
  params: { root: ["A", "C", "E"], quality: ["min", "maj"] },
  prompt: "On **{chord}**: **p-i-m-a-m-i** as 8th-note triplets (two beats per cycle), bass alternating between strings 5 and 4.",
  goal: "Rolling, even triplets for 8 bars; bass slightly louder.",
  tempo: { start: 50, min: 36, max: 120, step: 4, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 3, swing: 0, accent: true },
  hints: ["Accent each beat lightly: p on beat 1, a on beat 2 (!), p on beat 3, a on beat 4.", "The accent landing on 'a' is the tricky part."],
  explain: `### Arpeggios in triplets
A 6-note pattern in triplets puts the beat on alternating fingers (p, then a), which is great for evenness. Rolling triplet arpeggios like this run through Giuliani's right-hand studies and much 19th-century guitar music.`,
  visual: { type: "rhythm", meter: "4/4", grid: 3, bars: 1, pick: "5 3 2 1 2 3 4 3 2 1 2 3", fingers: "p i m a m i p i m a m i", chord: { root: "$root", quality: "$quality" }, accents: [0, 3, 6, 9] },
  demo: { type: "rhythm", meter: "4/4", grid: 3, bars: 1, pick: "5 3 2 1 2 3 4 3 2 1 2 3", fingers: "p i m a m i p i m a m i", chord: { root: "$root", quality: "$quality" }, accents: [0, 3, 6, 9] },
  concepts: ["pima", "triplets"],
  vary: ["tempo", "root"]
},

{
  id: "rhy-fs-thumb-steady",
  mode: "play", category: "picking", tags: ["fingerstyle", "thumb-independence"],
  title: "Steady thumb, fingers on the &",
  level: 3, length: "short", minutes: 2,
  params: { root: ["A", "C"], quality: ["maj", "min", "7"] },
  prompt: "On **{chord}**: thumb plays string 5 on **every beat**; i and m alternate on strings 3 and 2 on the **&s**.",
  goal: "Thumb is a metronome; fingers are perfectly in between, for 8 bars.",
  tempo: { start: 70, min: 50, max: 150, step: 5, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0, accent: true },
  hints: ["Thumb should land *on* the click.", "Mute the thumb notes slightly with the palm for a 'chunky' bass."],
  explain: `### Thumb independence, step 1
In fingerstyle the thumb is the rhythm section. Making it automatic (so it doesn't follow the fingers) is the foundation of Travis picking, blues fingerpicking and bossa.`,
  visual: { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pick: "5 3 5 2 5 3 5 2", fingers: "p i p m p i p m", chord: { root: "$root", quality: "$quality" }, accents: [0, 2, 4, 6] },
  demo: { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pick: "5 3 5 2 5 3 5 2", fingers: "p i p m p i p m", chord: { root: "$root", quality: "$quality" }, accents: [0, 2, 4, 6] },
  concepts: ["thumb-independence", "pima"],
  vary: ["tempo", "root"]
},

{
  id: "rhy-fs-thumb-syncopation",
  mode: "play", category: "picking", tags: ["fingerstyle", "thumb-independence", "syncopation", "sixteenths"],
  title: "Steady thumb vs syncopated fingers",
  level: 5, length: "medium", minutes: 3,
  params: { root: ["A", "C", "E"], quality: ["maj", "7", "min"] },
  prompt: "On **{chord}**: thumb alternates strings 5/4 (6/4 for E) in **quarters**; fingers play the syncopated 16th melody notes shown.",
  goal: "Thumb never budges while the fingers syncopate, for 8 bars.",
  tempo: { start: 56, min: 40, max: 110, step: 4, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0, accent: true },
  hints: ["Learn the finger rhythm alone first (clap it), then add the thumb.", "When it breaks, it's almost always the thumb following the fingers."],
  explain: `### Independence, step 2
Syncopated fingers against a steady thumb is the essence of ragtime guitar, country-blues fingerpicking (Mississippi John Hurt, Rev. Gary Davis) and Chet Atkins-style playing.

### Check yourself
- Play the thumb alone with the click first: the thumb notes are on 1, 2, 3, 4 and nowhere else.
- Add the fingers: the thumb notes must sound exactly as before. Record both and compare.`,
  visual: { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pick: "5 - - 2 4 - 1 - 5 - 2 - 4 1 - -", fingers: "p - - m p - a - p - m - p a - -", chord: { root: "$root", quality: "$quality" }, accents: [0, 4, 8, 12] },
  demo: { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pick: "5 - - 2 4 - 1 - 5 - 2 - 4 1 - -", fingers: "p - - m p - a - p - m - p a - -", chord: { root: "$root", quality: "$quality" }, accents: [0, 4, 8, 12] },
  concepts: ["thumb-independence", "syncopation"],
  vary: ["tempo", "root"]
},

{
  id: "rhy-travis-thumb",
  mode: "play", category: "picking", tags: ["travis-picking", "fingerstyle", "alternating-bass"],
  title: "Travis step 1: alternating thumb on A",
  level: 2, length: "short", minutes: 2,
  prompt: "Hold an open **A** chord. Thumb only, quarter notes: **string 5 → 4 → 6 → 4** (A, E, low E, E). Palm-mute lightly. Once it's automatic, try the same on an open C (5 → 4 → 6 → 4, with your ring finger hopping to the G on string 6 for beat 3).",
  goal: "Rock-steady, automatic thumb for 16 bars while you look away.",
  tempo: { start: 70, min: 50, max: 160, step: 5, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0, accent: true },
  hints: ["The thumb should feel like walking — no thought.", "Light palm mute keeps the bass 'thumpy' like Merle Travis."],
  explain: `### Travis picking
Named after Merle Travis and developed by Chet Atkins and many others: the **thumb alternates bass notes on every beat** while fingers add chord and melody notes between. You hear it in country, folk and fingerstyle pop from the 1940s on. Step 1 is an autopilot thumb.

### Check yourself
- Talk, or look away, while the thumb keeps going. If it stops or stumbles, it isn't automatic yet.
- Every thumb note lands on a click, with the same volume. Beat 1 can be slightly stronger.`,
  visual: { type: "rhythm", meter: "4/4", grid: 1, bars: 1, pick: "5 4 6 4", fingers: "p p p p", chord: { root: "A", quality: "maj" } },
  demo: { type: "rhythm", meter: "4/4", grid: 1, bars: 1, pick: "5 4 6 4", fingers: "p p p p", chord: { root: "A", quality: "maj" } },
  concepts: ["travis-picking", "thumb-independence"],
  vary: ["tempo"],
  source: "Merle Travis / Chet Atkins tradition; standard Travis-picking pedagogy (alternate thumb first, then add fingers)"
},

{
  id: "rhy-travis-basic",
  mode: "play", category: "picking", tags: ["travis-picking", "fingerstyle"],
  title: "Travis step 2: thumb + fingers on the &s",
  level: 3, length: "medium", minutes: 3,
  prompt: "Open A chord. Thumb **5-4-6-4** on the beats; **m** on string 2 after beats 1 and 3, **i** on string 3 after beats 2 and 4.",
  goal: "The classic Travis 'rolling' pattern, steady for 16 bars.",
  tempo: { start: 60, min: 40, max: 150, step: 5, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 2, swing: 0, accent: true },
  hints: ["Count '1 & 2 & ...': thumb on numbers, fingers on &s.", "If it falls apart, go back to thumb alone for 4 bars and fade the fingers in."],
  explain: `### The basic Travis pattern
Thumb on every beat, fingers on every &: the fingers 'answer' the thumb. The result sounds busier than it is — and it works on almost any chord.

### Check yourself
- Count "1 & 2 & 3 & 4 &": every number is a thumb note, every & a finger note. Nothing is ever played together in this step.
- Mute the fingers' strings for a bar: the thumb part must sound exactly the same as in step 1.`,
  visual: { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pick: "5 2 4 3 6 2 4 3", fingers: "p m p i p m p i", chord: { root: "A", quality: "maj" } },
  demo: { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pick: "5 2 4 3 6 2 4 3", fingers: "p m p i p m p i", chord: { root: "A", quality: "maj" } },
  concepts: ["travis-picking", "thumb-independence"],
  vary: ["tempo"]
},

{
  id: "rhy-travis-pinch",
  mode: "play", category: "picking", tags: ["travis-picking", "fingerstyle", "pinch"],
  title: "Travis step 3: add the pinch",
  level: 4, length: "medium", minutes: 3,
  prompt: "Same Travis pattern on open A, but on beats 1 and 3 **pinch** the bass with a top-string note (**p + a** on string 1).",
  goal: "Pinches land together, pattern flows for 16 bars.",
  tempo: { start: 60, min: 40, max: 150, step: 5, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 2, swing: 0, accent: true },
  hints: ["A pinch is thumb and finger squeezing toward each other at the same instant.", "The top note of the pinch is where a melody will go later."],
  explain: `### The pinch
Thumb + finger together. Pinches mark the strong beats and carry melody notes on top of the alternating bass.`,
  visual: { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pick: "5+1 2 4 3 6+1 2 4 3", fingers: "p+a m p i p+a m p i", chord: { root: "A", quality: "maj" } },
  demo: { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pick: "5+1 2 4 3 6+1 2 4 3", fingers: "p+a m p i p+a m p i", chord: { root: "A", quality: "maj" } },
  concepts: ["travis-picking"],
  vary: ["tempo"]
},

{
  id: "rhy-travis-syncopated",
  mode: "play", category: "picking", tags: ["travis-picking", "fingerstyle", "syncopation"],
  title: "Travis step 4: syncopated melody note",
  level: 5, length: "medium", minutes: 3,
  prompt: "Open A chord, thumb 5-4-6-4. Pinch on beat 1, then let a melody note on string 1 land on **the & of 3** (an offbeat between thumb notes).",
  goal: "The offbeat melody note pops without disturbing the thumb, for 16 bars.",
  tempo: { start: 60, min: 40, max: 140, step: 5, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 2, swing: 0, accent: true },
  hints: ["The thumb never stops or shifts — the melody is 'over' it.", "Syncopated top notes are the essence of the Travis sound."],
  explain: `### Syncopation over the thumb
Once the thumb is automatic, melody notes can land on any &. That push-pull between steady bass and syncopated melody is the Travis/Atkins style.`,
  visual: { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pick: "5+1 - 4 2 6 1 4 2", fingers: "p+a - p m p a p m", chord: { root: "A", quality: "maj" } },
  demo: { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pick: "5+1 - 4 2 6 1 4 2", fingers: "p+a - p m p a p m", chord: { root: "A", quality: "maj" } },
  concepts: ["travis-picking", "syncopation", "thumb-independence"],
  vary: ["tempo"]
},

{
  id: "rhy-travis-progression",
  mode: "play", category: "picking", tags: ["travis-picking", "fingerstyle", "chord-changes"],
  title: "Travis picking through A – D – E – A",
  level: 5, length: "long", minutes: 5,
  prompt: "Basic Travis pattern, one bar per chord: **A → D → E → A**, using the shapes in the diagrams (open A, D barred at the 5th fret, open E). The thumb follows each root: **A: 5-4-6-4 · D: 5-4-5-4 · E: 6-4-5-4**.",
  goal: "Changes without the thumb hesitating, 4 loops.",
  tempo: { start: 60, min: 40, max: 140, step: 5, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0, accent: true },
  hints: ["The thumb's first note is always the root: A and D (barred) have the root on string 5, E has it on string 6.", "Change chords during beat 4 so you're ready on 1.", "Check yourself: beat 1 of every bar is the new chord's root."],
  explain: `### Following the roots
In Travis picking the thumb usually alternates the **root** with another chord tone (often the fifth) on a neighbouring string. Moving between chords means moving the thumb's 'home' string, while the fingers keep exactly the same rhythm.

(With an open D you'd play the root on string 4 instead; the barred D in the demo keeps the thumb on the same strings as the A.)`,
  visual: { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pick: "5 2 4 3 6 2 4 3", fingers: "p m p i p m p i", chord: { root: "A", quality: "maj" } },
  demo: [
    { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pick: "5 2 4 3 6 2 4 3", fingers: "p m p i p m p i", chord: { root: "A", quality: "maj" }, title: "Bar 1: A — thumb 5-4-6-4" },
    { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pick: "5 2 4 3 5 2 4 3", fingers: "p m p i p m p i", chord: { root: "D", quality: "maj" }, title: "Bar 2: D (5th-fret barre) — thumb 5-4-5-4" },
    { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pick: "6 2 4 3 5 2 4 3", fingers: "p m p i p m p i", chord: { root: "E", quality: "maj" }, title: "Bar 3: E — thumb 6-4-5-4" },
    { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pick: "5 2 4 3 6 2 4 3", fingers: "p m p i p m p i", chord: { root: "A", quality: "maj" }, title: "Bar 4: A — thumb 5-4-6-4" }
  ],
  concepts: ["travis-picking"],
  vary: ["tempo"]
},

{
  id: "rhy-travis-hybrid",
  mode: "play", category: "picking", tags: ["travis-picking", "hybrid-picking"],
  title: "Travis picking with a pick (hybrid)",
  level: 5, length: "medium", minutes: 3,
  prompt: "Basic Travis pattern on open A, but the **pick** plays the thumb's bass notes (downstrokes) and **m/a** pluck the treble notes on the &s.",
  goal: "Sounds as smooth as fingerstyle, 16 bars.",
  tempo: { start: 60, min: 40, max: 150, step: 5, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 2, swing: 0, accent: true },
  hints: ["`p` in the finger row = the pick (downstrokes).", "Useful when a gig needs both strumming and fingerpicking on one song."],
  explain: `### Travis with a pick
Many electric country players do Travis patterns hybrid-style (pick + m + a). It's louder and punchier than flesh, and it lets you switch to strumming instantly.`,
  visual: { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pick: "5 2 4 1 6 2 4 1", strokes: "D - D - D - D -", fingers: "p m p a p m p a", chord: { root: "A", quality: "maj" } },
  demo: { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pick: "5 2 4 1 6 2 4 1", strokes: "D - D - D - D -", fingers: "p m p a p m p a", chord: { root: "A", quality: "maj" } },
  concepts: ["travis-picking", "hybrid-picking"],
  vary: ["tempo"]
},

{
  id: "rhy-fs-forward-roll",
  mode: "play", category: "picking", tags: ["fingerstyle", "rolls", "banjo", "3-over-8"],
  title: "Forward roll (banjo-style)",
  level: 5, length: "medium", minutes: 3,
  params: { root: ["G", "C", "D"], quality: ["maj"] },
  prompt: "Hold **{chord}** and play a **forward roll**: p-i-m, p-i-m, p-m in 8ths (strings 4-2-1, 4-2-1, 4-1). The 3-note groups create a 3+3+2 accent.",
  goal: "Even rolling 8ths for 8 bars with an audible 3-3-2.",
  tempo: { start: 70, min: 50, max: 160, step: 5, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 2, swing: 0, accent: true },
  hints: ["Accent the thumb lightly; the 3-3-2 should emerge on its own.", "Banjo rolls are the fingerstyle version of crosspicking."],
  explain: `### Rolls
Scruggs-style banjo rolls apply groups of 3 to an 8-note bar, creating the propulsive 3-3-2 feel. They translate beautifully to guitar.`,
  visual: { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pick: "4 2 1 4 2 1 4 1", fingers: "p i m p i m p m", accents: [0, 3, 6], chord: { root: "$root", quality: "$quality" } },
  demo: { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pick: "4 2 1 4 2 1 4 1", fingers: "p i m p i m p m", accents: [0, 3, 6], chord: { root: "$root", quality: "$quality" } },
  concepts: ["crosspicking", "groupings", "pima"],
  vary: ["tempo", "root"]
},

{
  id: "rhy-fs-tremolo-pami",
  mode: "play", category: "picking", tags: ["fingerstyle", "classical", "tremolo", "advanced"],
  title: "Classical tremolo: p-a-m-i",
  level: 7, length: "medium", minutes: 4,
  params: { root: ["A", "E"], quality: ["min"] },
  prompt: "On **{chord}**: thumb plays a bass note on each beat, then **a-m-i** repeat one note on string 1: **p a m i** as 16ths.",
  goal: "The three treble notes are perfectly even (no 'gallop') for 8 bars.",
  tempo: { start: 50, min: 36, max: 110, step: 4, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 4, swing: 0, accent: true },
  hints: ["The gap between i and the next p is where unevenness hides.", "Practise with accents shifted to a, then m, then i to even them out.", "'Recuerdos de la Alhambra' (Tárrega, public domain) is the reference piece."],
  explain: `### Tremolo (classical)
A single treble note repeated by a-m-i over a thumb bass line creates the illusion of a sustained melody. Evenness — not speed — is the goal.`,
  visual: { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pick: "5 1 1 1 4 1 1 1 5 1 1 1 4 1 1 1", fingers: "p a m i p a m i p a m i p a m i", chord: { root: "$root", quality: "$quality" }, accents: [0, 4, 8, 12] },
  demo: { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pick: "5 1 1 1 4 1 1 1 5 1 1 1 4 1 1 1", fingers: "p a m i p a m i p a m i p a m i", chord: { root: "$root", quality: "$quality" }, accents: [0, 4, 8, 12] },
  concepts: ["pima", "tremolo-picking"],
  vary: ["tempo"],
  source: "Francisco Tárrega tremolo technique"
},

{
  id: "rhy-fs-percussive",
  mode: "play", category: "picking", tags: ["fingerstyle", "percussive", "slap"],
  title: "Percussive fingerstyle: thumb, slap, brush",
  level: 6, length: "medium", minutes: 3,
  params: { root: ["E", "A", "D"], quality: ["min", "7", "sus4"] },
  prompt: "On **{chord}**: thumb bass on 1 and 3, **palm/thumb slap on the strings (X) on 2 and 4**, index-finger up-brushes on the 'a' of every beat.",
  goal: "Sounds like kick-snare-hat on one guitar, steady for 8 bars.",
  tempo: { start: 70, min: 50, max: 110, step: 4, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0, accent: true },
  hints: ["The slap is the side of the thumb/palm hitting the strings near the soundhole.", "Keep the up-brush light — it's a hi-hat."],
  explain: `### Percussive acoustic
Modern acoustic players (Andy McKee and many others) layer drum parts into fingerstyle. Rhythmically it's a 16th grid with assigned voices: thumb = kick (1, 3), slap = snare (2, 4), up-brush = hi-hat (the 'a' of every beat).

### Check yourself
- Say "kick – snare – kick – snare" with the click: your thumb and slap must match it exactly.
- The up-brush is the *last* 16th before each beat, quiet and short.`,
  visual: { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pattern: "T--UX--UT--UX--U", accents: [4, 12], chord: { root: "$root", quality: "$quality" } },
  demo: { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pattern: "T--UX--UT--UX--U", accents: [4, 12], chord: { root: "$root", quality: "$quality" } },
  concepts: ["thumb-independence"],
  vary: ["tempo", "root"]
},

// ─────────────────────────────────────────────────────────────────────────────
// E. STYLES (category: styles)
// ─────────────────────────────────────────────────────────────────────────────

// ── Funk ────────────────────────────────────────────────────────────────────

{
  id: "rhy-funk-scratch-motion",
  mode: "play", category: "styles", tags: ["funk", "scratch", "sixteenths", "muted"],
  title: "Funk 1: the scratch motion",
  level: 2, length: "short", minutes: 2,
  params: { root: ["E", "A", "D"], quality: ["9", "m7"] },
  prompt: "Fret a **{chord}** shape on the top 4 strings but **don't press** — just rest the fingers so everything is muted. Strum non-stop 16ths: a dry 'chk-chk-chk-chk'. Accent beat 1.",
  goal: "Even, totally dead 'scratch' for 8 bars; strumming hand relaxed.",
  tempo: { start: 80, min: 60, max: 120, step: 4, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0, accent: true },
  hints: [
    "Strum mostly the top 3–4 strings with a loose wrist — funk is small and light.",
    "Fret hand: fingers touching the strings, zero pressure. No pitches, no harmonics.",
    "This is the engine of every funk card that follows."
  ],
  explain: `### The scratch (chank) motion
Funk rhythm guitar starts with a **non-stop 16th-note strumming hand** and a fretting hand that decides when the chord sounds. Jimmy Nolen (James Brown) and Nile Rodgers (Chic) both play from a continuous down-up 16th motion; the notes you *don't* hear are as important as the ones you do.`,
  visual: { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pattern: "dudu dudu dudu dudu", accents: [0], chord: { root: "$root", quality: "$quality" } },
  demo: { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pattern: "dudu dudu dudu dudu", accents: [0], chord: { root: "$root", quality: "$quality" } },
  concepts: ["funk-16ths", "constant-motion"],
  vary: ["tempo"]
},

{
  id: "rhy-funk-hits",
  mode: "play", category: "styles", tags: ["funk", "scratch", "sixteenths", "placement"],
  title: "Funk 2: chord hits {p:hits}",
  level: 3, length: "medium", minutes: 3,
  params: {
    root: ["E", "A", "D"], quality: ["9", "m7", "7#9"],
    hits: [
      { v: "Dudu dudu dudu dudu", label: "on the One" },
      { v: "dudu Dudu dudu Dudu", label: "on 2 and 4" },
      { v: "duDu duDu duDu duDu", label: "on every &", lvl: 1 },
      { v: "dudU dudu dudU dudu", label: "on the a of 1 and 3", lvl: 1 },
      { v: "dUdu dUdu dUdu dUdu", label: "on every e", lvl: 2 },
      { v: "Dudu DudU duDu dUdu", label: "mixed (1, 2, a2, &3, e4)", lvl: 2 }
    ]
  },
  prompt: "Scratch 16ths on **{chord}** and squeeze the chord so it rings only {p:hits} (capital letters). Release instantly after each hit.",
  goal: "Hits pop out clearly against dead scratches for 8 bars.",
  tempo: { start: 80, min: 60, max: 116, step: 4, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0, accent: true },
  hints: [
    "The strumming hand doesn't change at all — only the fretting hand squeezes.",
    "Upstroke hits (e and a) are the essence of funk. Make them as loud as the downs.",
    "Keep chords short — 'stab', don't 'ring'."
  ],
  explain: `### Squeeze and release
Funk chords are **short** and placed exactly. The fretting hand pulses on and off while the strumming hand keeps time. A few chords — e.g. **E9** (the 'James Brown chord'), **Em7**, **A9**, **D9**, **E7#9** — on the top strings cover most of the style.`,
  visual: { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pattern: "$hits", chord: { root: "$root", quality: "$quality" } },
  demo: { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pattern: "$hits", chord: { root: "$root", quality: "$quality" } },
  concepts: ["funk-16ths", "accents-ghosts"],
  vary: ["tempo", "hits", "root"]
},

{
  id: "rhy-funk-chicken-scratch",
  mode: "play", category: "styles", tags: ["funk", "chicken-scratch", "james-brown", "sixteenths"],
  title: "Funk 3: chicken scratch on E9 (Nolen-style)",
  level: 4, length: "medium", minutes: 3,
  prompt: "**E9** on the top strings. Continuous 16ths; chord rings on **&1, e2, &3, e4, &4**, everything else scratched.",
  goal: "Tight, percussive groove for 16 bars at the target tempo.",
  tempo: { start: 84, min: 66, max: 120, step: 4, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0, accent: true, clickOn: "2&4" },
  hints: [
    "Small voicings on strings 1–4 are essential: they cut through and stay out of the bass player's way.",
    "Click is on 2 and 4 — feel it as the snare.",
    "Light, quick squeezes: the chicken-scratch sound is mostly muted strings with sharp 'pops'."
  ],
  explain: `### Jimmy Nolen's chicken scratch
With James Brown, Jimmy Nolen played straight 16ths with compact voicings on the high strings, the fretting hand lightly muting and releasing — the 'chicken scratch'. The groove comes from the interplay of exact chord placement and the dead strokes around it.`,
  visual: { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pattern: "duDu dUdu duDu dUDu", chord: { root: "E", quality: "9" } },
  demo: { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pattern: "duDu dUdu duDu dUDu", chord: { root: "E", quality: "9" } },
  concepts: ["funk-16ths", "accents-ghosts"],
  vary: ["tempo"],
  source: "Jimmy Nolen with James Brown, mid-1960s; cf. Guitar World, 'Chunking funk guitar' lesson"
},

{
  id: "rhy-funk-nile",
  mode: "play", category: "styles", tags: ["funk", "disco", "nile-rodgers", "sixteenths"],
  title: "Funk 4: disco-funk comping (Rodgers-style) on {chord}",
  level: 5, length: "medium", minutes: 4,
  params: { root: ["E", "A", "D", "B"], quality: ["m7", "9", "m9"] },
  prompt: "Constant 16th motion on **{chord}** with a mix of open hits, ghost scratches and air strokes, as written. Keep it bright and light.",
  goal: "Effortless, 'dancing' feel for 16 bars — no stiffness at the target tempo.",
  tempo: { start: 100, min: 80, max: 124, step: 4, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0, accent: true },
  hints: [
    "Air strokes (`-`) still move — the hand never stops.",
    "Nile Rodgers' sound: bright single-coil, chords on the top strings, continuous 16th motion.",
    "Disco tempos (~110–120) are faster than they feel. Stay loose."
  ],
  explain: `### Continuous motion, choose the touches
Nile Rodgers describes his right hand as constantly strumming 16ths; the rhythm is created by which strokes touch the strings and which are muted. Pattern written in his spirit (not a transcription).`,
  visual: { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pattern: "D-dU-uDu-uD-dUdu", chord: { root: "$root", quality: "$quality" } },
  demo: { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pattern: "D-dU-uDu-uD-dUdu", chord: { root: "$root", quality: "$quality" } },
  concepts: ["funk-16ths", "constant-motion"],
  vary: ["tempo", "root"]
},

{
  id: "rhy-funk-two-chord",
  mode: "play", category: "styles", tags: ["funk", "chord-changes", "vamp"],
  title: "Funk 5: two-chord vamp Em7 → A9",
  level: 5, length: "medium", minutes: 4,
  prompt: "Classic funk vamp: **Em7** for one bar, **A9** for one bar, both with the same hit pattern (1, & of 2, a of 2, 4) over constant 16th scratching.",
  goal: "Smooth vamp for 16 bars; the chord change never disturbs the strumming hand.",
  tempo: { start: 92, min: 76, max: 120, step: 4, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0, accent: true },
  hints: ["Use compact top-string voicings so the hand barely moves between chords.", "Change shapes during the scratched strokes after beat 4. The strumming hand never stops.", "Advanced: push the change a 16th early (on the a of 4)."],
  explain: `### i–IV vamp
Minor 7 to a dominant 9 a 4th up (the Dorian i–IV) is *the* funk vamp. With top-string voicings the change is a tiny hand movement, so the groove never breaks.`,
  visual: { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pattern: "Dudu duDU dudu Dudu", chord: { root: "E", quality: "m7" } },
  demo: [
    { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pattern: "Dudu duDU dudu Dudu", chord: { root: "E", quality: "m7" } },
    { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pattern: "Dudu duDU dudu Dudu", chord: { root: "A", quality: "9" } }
  ],
  concepts: ["funk-16ths", "constant-motion"],
  vary: ["tempo"]
},

{
  id: "rhy-funk-gap",
  mode: "play", category: "styles", tags: ["funk", "gap-click", "sixteenths"],
  title: "Funk 6: groove through the gap",
  level: 6, length: "medium", minutes: 3,
  params: { root: ["E", "A", "D"], quality: ["9", "m7"] },
  prompt: "Play the chicken-scratch pattern on **{chord}**. Click: **1 bar on, 3 bars off**. Stay in the pocket during the silence.",
  goal: "Land perfectly on the returning click 4 times in a row.",
  tempo: { start: 90, min: 70, max: 116, step: 4, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0, accent: true, gap: { play: 1, mute: 3 } },
  hints: ["Funk at 100 bpm rushes easily — think 'heavy and behind'.", "Nod your head on 2 and 4."],
  explain: `### Owning the groove
Funk depends on the guitarist being a reliable 16th-note clock. The gap click proves it.`,
  visual: { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pattern: "duDu dUdu duDu dUDu", chord: { root: "$root", quality: "$quality" } },
  demo: { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pattern: "duDu dUdu duDu dUDu", chord: { root: "$root", quality: "$quality" } },
  concepts: ["funk-16ths", "gap-click"],
  vary: ["tempo"]
},

{
  id: "rhy-funk-single-note",
  mode: "play", category: "styles", tags: ["funk", "single-note", "sixteenths", "alternate-picking"],
  title: "Funk 7: single-note 16th line",
  level: 6, length: "medium", minutes: 3,
  params: { key: ["Em", "Am", "Dm"] },
  prompt: "Using notes from **{root}** minor pentatonic on strings 4–3, play the 16th rhythm shown with **strict 16th picking motion** (strokes follow the grid). Mute between notes with the fretting hand.",
  goal: "Tight, percussive line; stroke directions always match the grid.",
  tempo: { start: 80, min: 60, max: 112, step: 4, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0, accent: true },
  hints: ["Notes on e and a are upstrokes even in single-note funk.", "Ghost the rests with muted 'dead notes' if you like — same motion."],
  explain: `### Single-note funk
Funk lines (think 'Get Up (I Feel Like Being a) Sex Machine'-era Catfish Collins or Cory Wong today) use the same 16th motion as strumming, so placement stays automatic.`,
  visual: { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pick: "4 - 4 4 - - 3 - 4 4 - 3 - - 4 -", strokes: "D - D U - - D - D U - U - - D -" },
  demo: { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pick: "4 - 4 4 - - 3 - 4 4 - 3 - - 4 -", strokes: "D - D U - - D - D U - U - - D -" },
  concepts: ["funk-16ths", "constant-motion", "alternate-picking"],
  vary: ["tempo", "key"]
},

{
  id: "rhy-funk-16th-swing",
  mode: "play", category: "styles", tags: ["funk", "swing", "neo-soul", "sixteenths"],
  title: "Funk 8: swung-16th funk",
  level: 7, length: "medium", minutes: 3,
  params: { root: ["E", "A", "F"], quality: ["m9", "9"] },
  prompt: "Chicken-scratch pattern on **{chord}** with **light 16th swing** (e and a arrive late). Think New Orleans funk / neo-soul.",
  goal: "Consistent swing amount for 16 bars; you can switch to straight and back.",
  tempo: { start: 84, min: 66, max: 104, step: 4, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0, accent: true },
  hints: ["New Orleans funk (The Meters), D'Angelo-style neo-soul and many hip-hop grooves use a lightly swung 16th feel.", "Swing the upstrokes (e, a), not the beat or the &.", "The click marks only the beat; the swing is yours. Compare with the demo."],
  explain: `### Swung funk
Not all funk is straight. A slight 16th-note swing changes the whole feel — choosing it deliberately is a mark of a mature rhythm player.

### Check yourself
- Alternate 4 bars straight and 4 bars swung. Only the e and a should move; the hits on & stay exactly halfway between clicks.
- The swing amount must be the same in every beat; record yourself and listen for beats that suddenly go straight.`,
  visual: { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pattern: "duDu dUdu duDu dUDu", swing: 0.33, chord: { root: "$root", quality: "$quality" } },
  demo: { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pattern: "duDu dUdu duDu dUDu", swing: 0.33, chord: { root: "$root", quality: "$quality" } },
  concepts: ["funk-16ths", "swing"],
  vary: ["tempo"]
},

// ── Bossa nova & samba ──────────────────────────────────────────────────────

{
  id: "rhy-bossa-thumb",
  mode: "play", category: "styles", tags: ["bossa-nova", "brazilian", "thumb", "fingerstyle"],
  title: "Bossa 1: the thumb on 1 and 3",
  level: 2, length: "short", minutes: 2,
  params: { root: ["A"], quality: ["m7", "maj7", "7", "6"] },
  prompt: "Hold **{chord}** (open shape, root on string 5). Thumb only: **root (string 5) on beat 1, the fifth below it (open low E, string 6) on beat 3**. Soft, even, slightly muted — like a bass drum heard from the next room.",
  goal: "A relaxed, steady thumb you don't have to think about, 16 bars.",
  tempo: { start: 70, min: 50, max: 200, step: 5, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0, accent: false },
  hints: [
    "Bossa is soft — the thumb is a heartbeat, not a punch.",
    "Many players think of bossa in 2 (cut time): the thumb is then on every beat.",
    "Bossa 8ths are **straight**, never swung."
  ],
  explain: `### What bossa nova is
Bossa nova ('new trend') is Brazilian music from Rio de Janeiro in the late 1950s: samba slowed down and made intimate, with jazz-influenced harmony. The guitar style comes from **João Gilberto** (his 1958 recording of 'Chega de Saudade', the album *Getz/Gilberto*, 1964), playing songs by **Antônio Carlos Jobim** such as 'The Girl from Ipanema', 'Desafinado' and 'Corcovado'. It's now a standard part of jazz.

### João Gilberto's split
Gilberto separated each chord into a **thumb bass** (on the beat) and **upper voices plucked by the fingers** (the syncopation). The thumb usually alternates the root and the **fifth below it**, like the samba surdo drum, and never stops. Get it automatic before adding fingers.

### Check yourself
- The thumb lands exactly on clicks 1 and 3, at the same soft volume, for 16 bars.
- Count "1 & 2 & 3 & 4 &" out loud while the thumb plays only on 1 and 3.`,
  visual: { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pick: "5 - - - 6 - - -", fingers: "p - - - p - - -", chord: { root: "$root", quality: "$quality" } },
  demo: { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pick: "5 - - - 6 - - -", fingers: "p - - - p - - -", chord: { root: "$root", quality: "$quality" } },
  concepts: ["bossa-nova", "thumb-independence"],
  vary: ["tempo", "quality"],
  source: "Wikipedia, 'Bossa nova' (thumb as stylized surdo); Nelson Faria, The Brazilian Guitar Book (bass alternates root and the fifth below)"
},

{
  id: "rhy-bossa-basic",
  mode: "play", category: "styles", tags: ["bossa-nova", "brazilian", "fingerstyle", "syncopation"],
  title: "Bossa 2: one-bar pattern on {chord}",
  level: 3, length: "medium", minutes: 3,
  params: { root: ["A"], quality: ["m7", "maj7", "7", "6"] },
  prompt: "Thumb on **1 and 3** (root, then the fifth below). Fingers (i-m-a together) pluck the upper strings on **1, 2 and the & of 3**. Loop it.",
  goal: "Gentle, swaying groove for 16 bars without the thumb wavering.",
  tempo: { start: 70, min: 50, max: 200, step: 5, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 2, swing: 0, accent: false },
  hints: [
    "Count '1 & 2 & 3 & 4 &': fingers on 1, 2, & of 3. Thumb on 1 and 3.",
    "The & of 3 is the first syncopation — it should feel like a gentle push, exactly halfway between clicks 3 and 4.",
    "Keep finger notes short-ish and soft."
  ],
  explain: `### The basic bossa pattern
The most widely taught bossa pattern, used by Gilberto (e.g. on 'The Girl from Ipanema'): thumb in half notes, fingers on **1, 2 and the & of 3**. Written in 2/4 (as most Brazilian sources do), that's fingers on the first two 8ths of beat 1 and the second 16th of beat 2; the app writes it in 4/4 8ths, which sounds identical.

### Feel and common mistakes
- **Straight, not swung**: the & of 3 is exactly halfway between clicks 3 and 4.
- **Soft**: bossa is quiet music; the fingers and thumb should be about equally loud.
- The usual mistake is the thumb moving to the & of 3 with the fingers. The thumb never plays there.

### Check yourself
- Clap the finger rhythm while saying "**1** & **2** & 3 **&** 4 &", then play it.
- Then thumb alone, then both. On beat 1, thumb and fingers sound together; on beat 3, only the thumb.`,
  visual: { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pick: "5+4+3+2 - 4+3+2 - 6 4+3+2 - -", fingers: "p+i+m+a - i+m+a - p i+m+a - -", chord: { root: "$root", quality: "$quality" } },
  demo: { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pick: "5+4+3+2 - 4+3+2 - 6 4+3+2 - -", fingers: "p+i+m+a - i+m+a - p i+m+a - -", chord: { root: "$root", quality: "$quality" } },
  concepts: ["bossa-nova", "thumb-independence", "syncopation"],
  vary: ["tempo", "quality"],
  source: "Illinois Jazz Guitar, 'Bossa Nova Guitar' (2017): basic one-bar pattern '1, 2 and the & of 3' over half notes; Wikipedia, 'Bossa nova'"
},

{
  id: "rhy-bossa-two-bar",
  mode: "play", category: "styles", tags: ["bossa-nova", "brazilian", "clave", "fingerstyle"],
  title: "Bossa 3: a clave-based two-bar variation",
  level: 4, length: "medium", minutes: 4,
  params: { root: ["A"], quality: ["m7", "maj7", "6"] },
  prompt: "Thumb on 1 and 3 in both bars. Fingers follow the **bossa nova clave**: bar 1 → **1, & of 2, 4**; bar 2 → **2, & of 3**. Chord: **{chord}**.",
  goal: "16 bars where the thumb stays steady and the finger rhythm floats.",
  tempo: { start: 70, min: 50, max: 200, step: 5, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 2, swing: 0, accent: false },
  hints: [
    "Learn the clave by clapping it while counting 8ths.",
    "Then add the thumb, then put the clap into the fingers.",
    "Gilberto constantly varied the finger rhythm — this is one framework, not *the* pattern."
  ],
  explain: `### Clave-based bossa
Nelson Faria's *Brazilian Guitar Book* explains that bossa right-hand patterns are based on the **bossa nova clave**: x..x..x...x..x.. (in 4/4 8ths: **1, &2, 4 | 2, &3**). It's the son clave with one note of the 'two' side delayed by one 8th. Here the fingers play the clave exactly, over the steady thumb. Real accompaniments vary it constantly, so treat this as a framework.

### Check yourself
- In bar 1 the fingers play together with the thumb on beat 1 only; in bar 2 they never coincide with the thumb.
- Every finger note on an & is exactly halfway between clicks (straight 8ths, no swing).
- Loop it: it should feel like one long 2-bar phrase, not two separate bars.`,
  visual: { type: "rhythm", meter: "4/4", grid: 2, bars: 2, pick: "5+4+3+2 - - 4+3+2 6 - 4+3+2 - | 5 - 4+3+2 - 6 4+3+2 - -", fingers: "p+i+m+a - - i+m+a p - i+m+a - | p - i+m+a - p i+m+a - -", chord: { root: "$root", quality: "$quality" } },
  demo: { type: "rhythm", meter: "4/4", grid: 2, bars: 2, pick: "5+4+3+2 - - 4+3+2 6 - 4+3+2 - | 5 - 4+3+2 - 6 4+3+2 - -", fingers: "p+i+m+a - - i+m+a p - i+m+a - | p - i+m+a - p i+m+a - -", chord: { root: "$root", quality: "$quality" } },
  concepts: ["bossa-nova", "clave"],
  vary: ["tempo", "quality"],
  source: "Nelson Faria, The Brazilian Guitar Book (patterns based on the clave figure); Wikipedia, 'Clave (rhythm)' (bossa nova clave)"
},

{
  id: "rhy-bossa-ii-v-i",
  mode: "play", category: "styles", tags: ["bossa-nova", "brazilian", "ii-v-i", "chord-changes"],
  title: "Bossa 4: ii–V–I in C (Dm7 – G7 – Cmaj7)",
  level: 5, length: "long", minutes: 5,
  prompt: "One-bar bossa pattern through **Dm7 | G7 | Cmaj7 | Cmaj7**, using the barre shapes in the diagrams. Here the thumb simply plays each chord's **root** on 1 and 3: Dm7 and Cmaj7 root on string 5, G7 root on string 6.",
  goal: "Seamless changes, constant thumb, 4 loops.",
  tempo: { start: 70, min: 50, max: 200, step: 5, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0, accent: false },
  hints: ["Use voicings that keep the top notes close (voice leading) so the fingers barely move.", "Once it flows, alternate the thumb root → fifth below on beat 3 (on string 6 for Dm7 and Cmaj7).", "Then apply the 2-bar clave pattern to the same changes."],
  explain: `### Bossa over changes
Real bossa tunes move constantly through ii–V's. The thumb's string-switching (root on 5 vs 6) is the main coordination challenge, so this card starts with the root on both thumb notes (a simplification that Faria's book also allows when the root is on string 6).

### Check yourself
- On every bar line the new root sounds exactly on beat 1, with the fingers.
- The finger rhythm (1, 2, &3) never changes, whatever the chord.`,
  visual: { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pick: "5+4+3+2 - 4+3+2 - 5 4+3+2 - -", chord: { root: "D", quality: "m7" } },
  demo: [
    { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pick: "5+4+3+2 - 4+3+2 - 5 4+3+2 - -", chord: { root: "D", quality: "m7" }, title: "Bar 1: Dm7 (root on string 5)" },
    { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pick: "6+4+3+2 - 4+3+2 - 6 4+3+2 - -", chord: { root: "G", quality: "7" }, title: "Bar 2: G7 (root on string 6)" },
    { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pick: "5+4+3+2 - 4+3+2 - 5 4+3+2 - -", chord: { root: "C", quality: "maj7" }, title: "Bar 3: Cmaj7 (root on string 5)" },
    { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pick: "5+4+3+2 - 4+3+2 - 5 4+3+2 - -", chord: { root: "C", quality: "maj7" }, title: "Bar 4: Cmaj7" }
  ],
  concepts: ["bossa-nova"],
  vary: ["tempo"]
},

{
  id: "rhy-bossa-anticipation",
  mode: "play", category: "styles", tags: ["bossa-nova", "anticipation", "syncopation"],
  title: "Bossa 5: anticipating the next chord",
  level: 6, length: "medium", minutes: 4,
  params: { root: ["A"], quality: ["m7", "maj7", "7"] },
  prompt: "Two-bar loop on **{chord}**, thumb on 1 and 3 throughout. Bar 2: fingers on **2** and the **& of 4**, which anticipates the next bar. Bar 1: fingers on **2** and the **& of 3** only — no finger pluck on beat 1, because the & of 4 already played it.",
  goal: "The push on the & of 4 sounds natural and the thumb never moves, 16 bars.",
  tempo: { start: 70, min: 50, max: 200, step: 5, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 2, swing: 0, accent: false },
  hints: ["In real tunes the & of 4 is usually the *next* chord arriving early.", "Let the anticipated chord ring over the bar line.", "Check yourself: in a loop, bar 1's beat 1 has only the thumb, because the fingers already played on the & of 4."],
  explain: `### Anticipations in bossa
Chord changes that arrive an 8th early are everywhere in Brazilian accompaniment — they make the harmony 'lean forward' over the steady thumb. (The demo stays on one chord, so you hear the rhythm; in a song the & of 4 would already be the next chord.)`,
  visual: { type: "rhythm", meter: "4/4", grid: 2, bars: 2, pick: "5 - 4+3+2 - 6 4+3+2 - - | 5 - 4+3+2 - 6 - - 4+3+2", chord: { root: "$root", quality: "$quality" } },
  demo: { type: "rhythm", meter: "4/4", grid: 2, bars: 2, pick: "5 - 4+3+2 - 6 4+3+2 - - | 5 - 4+3+2 - 6 - - 4+3+2", chord: { root: "$root", quality: "$quality" } },
  concepts: ["bossa-nova", "rhythmic-anticipation"],
  vary: ["tempo"]
},

{
  id: "rhy-samba-thumb",
  mode: "play", category: "styles", tags: ["samba", "brazilian", "thumb", "2-4"],
  title: "Samba 1: thumb with the surdo accent on 2",
  level: 3, length: "short", minutes: 2,
  params: { root: ["A"], quality: ["7", "m7", "6"] },
  prompt: "Samba is felt **in 2**. Thumb on **both beats** of a 2/4 bar (root on string 5, then the fifth below on string 6), with the **accent on beat 2** like the low surdo drum.",
  goal: "A driving, steady 2-feel with a clear beat-2 accent, 16 bars.",
  tempo: { start: 70, min: 50, max: 200, step: 5, unit: "bpm" },
  metronome: { meter: "2/4", subdivision: 1, swing: 0, accent: true },
  hints: ["The beat-2 accent comes from the samba's big surdo drum.", "Samba is usually much faster and more percussive than bossa; start slow."],
  explain: `### The samba pulse
Samba is Brazil's best-known popular rhythm (Rio de Janeiro, from the early 20th century; carnival samba schools). It's felt in **2**, and the big surdo drum gives **beat 2** the strongest note of each 2/4 bar. Bossa nova inherited this emphasis. The guitarist's thumb imitates the surdo, while the fingers add syncopations above it.

### Check yourself
- Beat 2 is clearly louder than beat 1, every bar.
- Say "one-TWO, one-TWO" with the clicks; the loud syllable is your thumb on string 6.`,
  visual: { type: "rhythm", meter: "2/4", grid: 4, bars: 1, pick: "5 - - - 6 - - -", fingers: "p - - - p - - -", accents: [4], chord: { root: "$root", quality: "$quality" } },
  demo: { type: "rhythm", meter: "2/4", grid: 4, bars: 1, pick: "5 - - - 6 - - -", fingers: "p - - - p - - -", accents: [4], chord: { root: "$root", quality: "$quality" } },
  concepts: ["bossa-nova", "thumb-independence"],
  vary: ["tempo", "quality"],
  source: "Wikipedia, 'Bossa nova' (samba's emphasis on the second beat; surdo)"
},

// ── Flamenco ────────────────────────────────────────────────────────────────

{
  id: "rhy-flam-rumba",
  mode: "play", category: "styles", tags: ["flamenco", "rumba", "strumming", "golpe"],
  title: "Flamenco 1: rumba strum ({p:var})",
  level: 3, length: "medium", minutes: 3,
  params: {
    root: ["A", "E", "D"], quality: ["min", "maj"],
    var: [
      { v: "D-DUX-DUD-DUX-DU", label: "chuck on 2 and 4" },
      { v: "D--UX-DUD--UX-DU", label: "with 3-3-2 push", lvl: 1 }
    ]
  },
  prompt: "Rumba flamenca on **{chord}**: 16th motion, open strums plus a **muted slap (X)** on beats 2 and 4 ({p:var}).",
  goal: "Driving, joyful groove for 16 bars; chucks are sharp.",
  tempo: { start: 90, min: 70, max: 130, step: 4, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0, accent: true },
  hints: [
    "The X is the strumming hand's palm/fingers hitting the strings to mute them — the 'chasquido'.",
    "Rumba is looser and more syncopated than tangos — think Gipsy Kings.",
    "Accent the open strum right after each chuck."
  ],
  explain: `### Rumba flamenca
A 4-beat, Cuban-influenced palo. The guitar plays a flowing, syncopated strum with a percussive muted hit on 2 and 4. It's often the friendliest entry into flamenco rhythm.`,
  visual: { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pattern: "$var", accents: [4, 12], chord: { root: "$root", quality: "$quality" } },
  demo: { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pattern: "$var", accents: [4, 12], chord: { root: "$root", quality: "$quality" } },
  concepts: ["flamenco-compas", "rasgueado"],
  vary: ["tempo", "var", "root"]
},

{
  id: "rhy-flam-rasgueado-4",
  mode: "play", category: "styles", tags: ["flamenco", "rasgueado", "sixteenths", "technique"],
  title: "Flamenco 2: four-finger rasgueado",
  level: 4, length: "medium", minutes: 3,
  params: { root: ["E", "A"], quality: ["maj", "min"] },
  prompt: "On **{chord}**: curl the fingers into the palm and flick them out one at a time — **little (c), ring (a), middle (m), index (i)** — as continuous 16ths. Accent the first flick of each beat.",
  goal: "Four distinct, even strokes per beat (not a smear) for 8 bars.",
  tempo: { start: 50, min: 36, max: 110, step: 4, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 4, swing: 0, accent: true },
  hints: [
    "Each finger is a separate downstroke, released like flicking a crumb off a table.",
    "Anchor the thumb on string 6 or the top of the guitar.",
    "Some teachers start the roll with the index; whatever order you use, evenness is the goal."
  ],
  explain: `### Rasgueado
Flamenco's signature strum: individual finger flicks in rapid succession. The **four-stroke rasgueado** (c-a-m-i) played continuously gives a roll of 16ths (or faster). Each \`R\` in the grid = one finger flick.`,
  visual: { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pattern: "RRRR RRRR RRRR RRRR", accents: [0, 4, 8, 12], chord: { root: "$root", quality: "$quality" } },
  demo: { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pattern: "RRRR RRRR RRRR RRRR", accents: [0, 4, 8, 12], chord: { root: "$root", quality: "$quality" } },
  concepts: ["rasgueado"],
  vary: ["tempo"],
  source: "Ravenna Flamenco, 'Flamenco rasgueado' fundamentals; Douglas Niedt, Rasgueado technique tips"
},

{
  id: "rhy-flam-rasgueado-triplet",
  mode: "play", category: "styles", tags: ["flamenco", "rasgueado", "abanico", "triplets", "technique"],
  title: "Flamenco 3: triplet rasgueado (abanico)",
  level: 5, length: "medium", minutes: 3,
  params: { root: ["E", "A"], quality: ["maj"] },
  prompt: "On **{chord}**: a **3-stroke rasgueado** driven by wrist/forearm rotation, as continuous triplets. Accent each beat.",
  goal: "Three even strokes per beat, continuous for 8 bars.",
  tempo: { start: 50, min: 36, max: 120, step: 4, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 3, swing: 0, accent: true },
  hints: [
    "Fingerings vary by school — e.g. thumb down, m+a down, index up; or p-i-m. Pick one and stay consistent.",
    "The motion comes from rotating the forearm like turning a doorknob, not from flicking fingers.",
    "Rotation-based rasgueados can go very fast with little effort once learned."
  ],
  explain: `### Abanico (the fan)
A triplet rasgueado that uses wrist rotation: one cycle = three strokes. It's how flamenco guitarists produce long, smooth, triplet-based rolls (common in soleá and alegrías).`,
  visual: { type: "rhythm", meter: "4/4", grid: 3, bars: 1, pattern: "RRR RRR RRR RRR", accents: [0, 3, 6, 9], chord: { root: "$root", quality: "$quality" } },
  demo: { type: "rhythm", meter: "4/4", grid: 3, bars: 1, pattern: "RRR RRR RRR RRR", accents: [0, 3, 6, 9], chord: { root: "$root", quality: "$quality" } },
  concepts: ["rasgueado"],
  vary: ["tempo"],
  source: "Richter Guitar, 'Flamenco guitar techniques and definitions' (abanico); Ravenna Flamenco"
},

{
  id: "rhy-flam-rasgueado-landing",
  mode: "play", category: "styles", tags: ["flamenco", "rasgueado", "placement"],
  title: "Flamenco 4: rasgueado landing on the beat",
  level: 6, length: "medium", minutes: 3,
  params: { root: ["E", "A"], quality: ["maj"] },
  prompt: "On **{chord}**: single strums on beats 1, 2, 3; on beat 4 play a quick **3-flick rasgueado (e, &, a)** that *lands* on the next beat 1.",
  goal: "The rasgueado finishes exactly on beat 1 every time, 8 bars.",
  tempo: { start: 60, min: 44, max: 120, step: 4, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0, accent: true },
  hints: ["In flamenco, a rasgueado is an ornament leading *into* an accent.", "Think of the roll as a pickup — the accent is the destination."],
  explain: `### Rasgueado as ornament
Rasgueados usually decorate the approach to an accented beat. Placing them so the final stroke hits the accent precisely is what makes them sound flamenco rather than random.`,
  visual: { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pattern: "D---D---D----RRR", accents: [0], chord: { root: "$root", quality: "$quality" } },
  demo: { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pattern: "D---D---D----RRR", accents: [0], chord: { root: "$root", quality: "$quality" } },
  concepts: ["rasgueado", "flamenco-compas"],
  vary: ["tempo"]
},

{
  id: "rhy-flam-tangos",
  mode: "play", category: "styles", tags: ["flamenco", "tangos", "compas"],
  title: "Flamenco 5: tangos compás",
  level: 4, length: "medium", minutes: 4,
  params: { root: ["A", "E"], quality: ["maj"] },
  prompt: "Tangos is a **4-beat compás**, usually counted in pairs of bars. Beat 1 is subdued (a rest or a golpe tap), **beats 2, 3, 4 are strongly marked**. Play it on **{chord}**.",
  goal: "Strong, crisp 2-3-4 accents with a 'breath' on 1, for 8 compases.",
  tempo: { start: 100, min: 80, max: 140, step: 4, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0, accent: false },
  hints: [
    "The X on beat 1 of bar 2 is a golpe (ring-finger tap on the top of the guitar).",
    "Tangos is often played 'por medio' (A Phrygian: A–Bb) or 'por arriba' (E Phrygian: E–F).",
    "More marked and less 'swaying' than rumba."
  ],
  explain: `### Tangos
A lively 4-count cante chico palo with clear, sharply defined rasgueado. One 'compás' often means two 4-beat cycles, to complete the chord cycle. The guitar marks beats 2, 3 and 4 and lets beat 1 breathe — a feel that surprises players used to a strong 'one'.`,
  visual: { type: "rhythm", meter: "4/4", grid: 2, bars: 2, pattern: ".-D-DUD- | X-D-DUD-", accents: [2, 4, 6, 10, 12, 14], chord: { root: "$root", quality: "$quality" } },
  demo: { type: "rhythm", meter: "4/4", grid: 2, bars: 2, pattern: ".-D-DUD- | X-D-DUD-", accents: [2, 4, 6, 10, 12, 14], chord: { root: "$root", quality: "$quality" } },
  concepts: ["flamenco-compas", "rasgueado"],
  vary: ["tempo"],
  source: "Ravenna Flamenco, 'Tango' palo page; Wikipedia, 'Tango (flamenco)'"
},

{
  id: "rhy-flam-solea-count",
  mode: "play", category: "styles", tags: ["flamenco", "solea", "compas", "12-beat"],
  title: "Flamenco 6: soleá compás — count and mark the accents",
  level: 4, length: "medium", minutes: 4,
  params: { root: ["E"], quality: ["maj"] },
  prompt: "Count the 12-beat **soleá** compás out loud: \"1 2 **3** 4 5 **6** 7 **8** 9 **10** 11 **12**\". Strum muted strokes on every beat and an open, loud **E** strum on **3, 6, 8, 10, 12**. Clap it too.",
  goal: "4 full compases in a row with the accents exactly right, without looking.",
  tempo: { start: 90, min: 60, max: 170, step: 5, unit: "bpm" },
  metronome: { meter: "12/8", subdivision: 1, swing: 0, accent: false },
  hints: [
    "Group it **3+3+2+2+2**: the first half feels like 6/8, the second half like 3/4.",
    "Tension builds on 3, increases on 6, peaks on 8 and resolves on 10.",
    "Each click = one compás beat (tempo counts the 12 beats)."
  ],
  explain: `### Soleá
The 'mother' of the 12-beat palos. Accents fall on **3, 6, 8, 10, 12**, grouping the cycle 3+3+2+2+2 — a 6/8 bar followed by a 3/4 bar (hemiola). Alegrías, soleá por bulerías and bulerías share this accent pattern with different starting points and tempos. (Teachers note that 3-6-8-10-12 is a simplification — real playing ornaments around it — but it's the right map to start with.)`,
  visual: { type: "rhythm", meter: "12/8", grid: 1, bars: 1, pattern: "ddDddDdDdDdD", accents: [2, 5, 7, 9, 11], chord: { root: "$root", quality: "$quality" }, title: "1 2 [3] 4 5 [6] 7 [8] 9 [10] 11 [12]" },
  demo: { type: "rhythm", meter: "12/8", grid: 1, bars: 1, pattern: "ddDddDdDdDdD", accents: [2, 5, 7, 9, 11], chord: { root: "$root", quality: "$quality" } },
  concepts: ["flamenco-compas", "hemiola"],
  vary: ["tempo"],
  source: "Canteytoque, 'Compás explained' (canteytoque.es/compexp.htm); StudioFlamenco 'Soleares'"
},

{
  id: "rhy-flam-solea-chords",
  mode: "play", category: "styles", tags: ["flamenco", "solea", "compas", "phrygian"],
  title: "Flamenco 7: soleá compás with E and F",
  level: 5, length: "long", minutes: 5,
  prompt: "Soleá compás 'por arriba': **E** on beats 1–6 (accents 3, 6), **F** on 7–9 (accent 8), back to **E** on 10–12 (accents 10, 12). Loop for 4+ compases.",
  goal: "Chord changes land with the accents; the compás never loses a beat.",
  tempo: { start: 80, min: 60, max: 160, step: 5, unit: "bpm" },
  metronome: { meter: "12/8", subdivision: 1, swing: 0, accent: false },
  hints: [
    "F (with open top strings in flamenco, often F with an open E) is the bII of E Phrygian — the 'flamenco cadence' F → E.",
    "Use a small rasgueado to decorate the accents once the basic version is solid.",
    "Count out loud through every change."
  ],
  explain: `### Harmony on the compás
In a basic soleá accompaniment, the bII chord (F) sits on the tension peak (beat 8) and resolves to E on 10. Hearing the compás as harmony moving over accents is what makes it musical rather than arithmetic.`,
  visual: { type: "rhythm", meter: "12/8", grid: 1, bars: 1, pattern: "ddDddDdDdDdD", accents: [2, 5, 7, 9, 11], chord: { root: "E", quality: "maj" } },
  demo: [
    { type: "rhythm", meter: "6/8", grid: 1, bars: 1, pattern: "ddDddD", accents: [2, 5], chord: { root: "E", quality: "maj" } },
    { type: "rhythm", meter: "3/4", grid: 1, bars: 1, pattern: "dDd", accents: [1], chord: { root: "F", quality: "maj" } },
    { type: "rhythm", meter: "3/4", grid: 1, bars: 1, pattern: "DdD", accents: [0, 2], chord: { root: "E", quality: "maj" } }
  ],
  concepts: ["flamenco-compas", "hemiola"],
  vary: ["tempo"]
},

{
  id: "rhy-flam-golpe",
  mode: "play", category: "styles", tags: ["flamenco", "golpe", "solea"],
  title: "Flamenco 8: soleá al golpe",
  level: 5, length: "medium", minutes: 3,
  params: { root: ["E"], quality: ["maj"] },
  prompt: "Soleá compás on **E**: **thumb** plays bass notes on unaccented beats; on the accents (3, 6, 8, 10, 12) **strum down and tap a golpe** (ring finger on the top) at the same time.",
  goal: "Golpes land exactly with the accents for 4 compases.",
  tempo: { start: 80, min: 60, max: 150, step: 5, unit: "bpm" },
  metronome: { meter: "12/8", subdivision: 1, swing: 0, accent: false },
  hints: ["The golpe is a percussive tap with the ring finger (or a+m) near the bridge, often together with a strum.", "Keep the thumb notes soft so the golpes stand out."],
  explain: `### Golpe
The golpe (tap on the golpeador / tap plate) is flamenco's built-in percussion, typically marking compás accents. Playing 'al golpe' trains the accent pattern into your body.`,
  visual: { type: "rhythm", meter: "12/8", grid: 1, bars: 1, pattern: "TTXTTXTXTXTX", accents: [2, 5, 7, 9, 11], chord: { root: "$root", quality: "$quality" } },
  demo: { type: "rhythm", meter: "12/8", grid: 1, bars: 1, pattern: "TTXTTXTXTXTX", accents: [2, 5, 7, 9, 11], chord: { root: "$root", quality: "$quality" } },
  concepts: ["flamenco-compas"],
  vary: ["tempo"]
},

{
  id: "rhy-flam-bulerias",
  mode: "play", category: "styles", tags: ["flamenco", "bulerias", "compas", "12-beat"],
  title: "Flamenco 9: bulerías — counting from 12",
  level: 6, length: "medium", minutes: 4,
  params: { root: ["A", "E"], quality: ["maj"] },
  prompt: "Bulerías uses the same accents as soleá but **starts on 12** and moves fast. Count \"**12** 1 2 **3** 4 5 **6** 7 **8** 9 **10** 11\" and strum open on the bold counts on **{chord}**.",
  goal: "4 compases at the target tempo, starting and ending on 12.",
  tempo: { start: 120, min: 90, max: 240, step: 10, unit: "bpm" },
  metronome: { meter: "12/8", subdivision: 1, swing: 0, accent: false },
  hints: [
    "The first slot in the grid is beat **12** — it becomes the 'downbeat'.",
    "Many teachers suggest getting soleá solid first, then speeding up and shifting the start.",
    "Some players also feel 'bulerías in 6' — see the next card."
  ],
  explain: `### Bulerías
Basically a double-time soleá that **starts on beat 12**. Accents are usually taught as **12, 3, 6, 8, 10** (with 7 sometimes replacing 6). It's the most playful, improvisational palo — and the one where losing count is most obvious.`,
  visual: { type: "rhythm", meter: "12/8", grid: 1, bars: 1, pattern: "DddDddDdDdDd", accents: [0, 3, 6, 8, 10], chord: { root: "$root", quality: "$quality" }, title: "[12] 1 2 [3] 4 5 [6] 7 [8] 9 [10] 11" },
  demo: { type: "rhythm", meter: "12/8", grid: 1, bars: 1, pattern: "DddDddDdDdDd", accents: [0, 3, 6, 8, 10], chord: { root: "$root", quality: "$quality" } },
  concepts: ["flamenco-compas", "hemiola"],
  vary: ["tempo"],
  source: "Richter Guitar, 'Bulerías'; StudioFlamenco; Canteytoque compás notes"
},

{
  id: "rhy-flam-bulerias-halves",
  mode: "play", category: "styles", tags: ["flamenco", "bulerias", "hemiola"],
  title: "Flamenco 10: bulerías as 6/8 + 3/4",
  level: 6, length: "medium", minutes: 3,
  params: { root: ["A", "E"], quality: ["maj"] },
  prompt: "Feel bulerías as two halves: **12-1-2-3-4-5** in 6/8 (accents 12, 3) then **6-7-8-9-10-11** in 3/4 (accents 6, 8, 10). Alternate them on **{chord}**.",
  goal: "Both halves feel distinct — the switch from 'two big beats' to 'three' is clear.",
  tempo: { start: 120, min: 90, max: 220, step: 10, unit: "bpm" },
  metronome: { meter: "12/8", subdivision: 1, swing: 0, accent: false },
  hints: ["6/8 half: ONE-two-three-FOUR-five-six. 3/4 half: ONE-two-THREE-four-FIVE-six.", "This hemiola is the 'secret' of all the 12-beat palos."],
  explain: `### Hemiola
Six beats can be grouped **3+3** (two beats) or **2+2+2** (three beats). The 12-beat flamenco compás puts one of each side by side, which is why it feels like it 'turns around' in the middle.`,
  visual: { type: "rhythm", meter: "12/8", grid: 1, bars: 1, pattern: "DddDddDdDdDd", accents: [0, 3, 6, 8, 10], chord: { root: "$root", quality: "$quality" } },
  demo: [
    { type: "rhythm", meter: "6/8", grid: 1, bars: 1, pattern: "DddDdd", accents: [0, 3], chord: { root: "$root", quality: "$quality" } },
    { type: "rhythm", meter: "6/8", grid: 1, bars: 1, pattern: "DdDdDd", accents: [0, 2, 4], chord: { root: "$root", quality: "$quality" } }
  ],
  concepts: ["hemiola", "flamenco-compas"],
  vary: ["tempo"]
},

{
  id: "rhy-flam-alzapua",
  mode: "play", category: "styles", tags: ["flamenco", "alzapua", "thumb", "triplets", "advanced"],
  title: "Flamenco 11: alzapúa intro",
  level: 7, length: "medium", minutes: 4,
  params: { root: ["E", "A"], quality: ["maj"] },
  prompt: "**Thumb only**, in triplets on **{chord}**: (1) **down** on a single bass note, (2) **down** across 2–3 treble strings, (3) **up** across the same strings. Repeat.",
  goal: "Even, punchy triplets for 8 bars using only the thumb.",
  tempo: { start: 50, min: 36, max: 120, step: 4, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 3, swing: 0, accent: true },
  hints: [
    "The thumb works like a pick: rest it on the next string after the downstroke.",
    "The upstroke uses the thumbnail's back edge — keep it light.",
    "It's one of the hardest flamenco techniques; build it slowly over weeks."
  ],
  explain: `### Alzapúa
A thumb technique that alternates single bass notes with down-up thumb strums, giving a driving, syncopated melodic line. Paco de Lucía used it as a 'launch pad' to raise intensity (e.g. in 'Entre dos aguas'). The basic cell: **down (1 string), down (2–3 strings), up (2–3 strings)**.`,
  visual: { type: "rhythm", meter: "4/4", grid: 3, bars: 1, pick: "5 3+2+1 3+2+1 5 3+2+1 3+2+1 5 3+2+1 3+2+1 5 3+2+1 3+2+1", strokes: "D D U D D U D D U D D U", fingers: "p p p p p p p p p p p p", accents: [0, 3, 6, 9], chord: { root: "$root", quality: "$quality" } },
  demo: { type: "rhythm", meter: "4/4", grid: 3, bars: 1, pick: "5 3+2+1 3+2+1 5 3+2+1 3+2+1 5 3+2+1 3+2+1 5 3+2+1 3+2+1", strokes: "D D U D D U D D U D D U", fingers: "p p p p p p p p p p p p", accents: [0, 3, 6, 9], chord: { root: "$root", quality: "$quality" } },
  concepts: ["alzapua", "flamenco-compas"],
  vary: ["tempo"],
  source: "Canteytoque, alzapúa history; The Flamenco Guitar Podcast, alzapúa lessons"
},

{
  id: "rhy-flam-picado",
  mode: "play", category: "styles", tags: ["flamenco", "picado", "fingerstyle", "sixteenths"],
  title: "Flamenco 12: picado (i-m rest strokes)",
  level: 6, length: "medium", minutes: 3,
  params: { key: ["Am", "Em"] },
  prompt: "Single-note scale runs in **{key}** (Phrygian colour welcome) with **alternating i-m rest strokes** in 16ths, accenting each beat.",
  goal: "Loud, even, articulate 16ths for 4 bars at the target tempo.",
  tempo: { start: 60, min: 40, max: 140, step: 4, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0, accent: true },
  hints: ["Rest stroke (apoyando): the finger comes to rest on the next string after playing.", "Alternate strictly — never i-i or m-m."],
  explain: `### Picado
Flamenco's scale technique: strict i-m alternation with rest strokes for a loud, crisp attack. Rhythmically it's identical to alternate picking — the i/m pair plays the role of down/up.`,
  visual: { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pick: "1 1 1 1 2 2 2 2 2 2 2 2 3 3 3 3", fingers: "i m i m i m i m i m i m i m i m", accents: [0, 4, 8, 12] },
  demo: { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pick: "1 1 1 1 2 2 2 2 2 2 2 2 3 3 3 3", fingers: "i m i m i m i m i m i m i m i m", accents: [0, 4, 8, 12] },
  concepts: ["pima", "alternate-picking"],
  vary: ["tempo", "key"]
},

// ── Reggae / ska ────────────────────────────────────────────────────────────

{
  id: "rhy-reggae-skank",
  mode: "play", category: "styles", tags: ["reggae", "skank", "offbeat", "backbeat"],
  title: "Reggae 1: the skank on 2 and 4",
  level: 2, length: "short", minutes: 2,
  params: { root: ["A", "G", "C", "D"], quality: ["min", "maj"] },
  prompt: "Small **{chord}** voicing on the top strings. Play a **short, choked chord on beats 2 and 4 only** — silence everywhere else.",
  goal: "Crisp, short 'chk' on 2 and 4 for 16 bars; nothing rings.",
  tempo: { start: 72, min: 60, max: 100, step: 4, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0, accent: true },
  hints: ["Release the chord immediately after the strum — the 'skank' is mostly silence.", "Reggae tempos feel slow; keep the time very steady."],
  explain: `### The skank
In reggae the guitar is a percussion instrument: a very short chord on the backbeat (2 and 4), often doubled by the keyboard. The drums' 'one drop' puts the kick on 3, so the guitar's backbeat locks with it.`,
  visual: { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pattern: "--D.--D.", accents: [2, 6], chord: { root: "$root", quality: "$quality" } },
  demo: { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pattern: "--D.--D.", accents: [2, 6], chord: { root: "$root", quality: "$quality" } },
  concepts: ["skank"],
  vary: ["tempo", "root"]
},

{
  id: "rhy-reggae-double-skank",
  mode: "play", category: "styles", tags: ["reggae", "skank", "sixteenths"],
  title: "Reggae 2: the double skank",
  level: 4, length: "short", minutes: 2,
  params: { root: ["A", "G", "C", "D"], quality: ["min", "maj", "m7"] },
  prompt: "On **{chord}**: on beats 2 and 4 play **two quick 16th chops** (down-up) and choke immediately.",
  goal: "Even, tight double chops, nothing ringing, for 16 bars.",
  tempo: { start: 72, min: 60, max: 100, step: 4, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0, accent: true },
  hints: ["The hand moves in 16ths; touch the strings only on 2-e and 4-e.", "Roots-reggae and dub use this a lot."],
  explain: `### Double skank
A 16th-note variant: 'chk-chk' on the backbeat. It adds bounce without cluttering the groove.`,
  visual: { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pattern: "----DU.-----DU.-", accents: [4, 12], chord: { root: "$root", quality: "$quality" } },
  demo: { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pattern: "----DU.-----DU.-", accents: [4, 12], chord: { root: "$root", quality: "$quality" } },
  concepts: ["skank", "constant-motion"],
  vary: ["tempo", "root"]
},

{
  id: "rhy-ska-upstrokes",
  mode: "play", category: "styles", tags: ["ska", "offbeat", "upstrokes"],
  title: "Ska: upstrokes on every &",
  level: 3, length: "short", minutes: 2,
  params: { root: ["C", "G", "D", "A", "F"], quality: ["maj", "7"] },
  prompt: "Fast ska on **{chord}**: hand moves in 8ths, **upstroke chord on every &**, choked short. Downstrokes are air strums.",
  goal: "Bright, bouncy offbeats for 16 bars at the target tempo.",
  tempo: { start: 120, min: 90, max: 200, step: 5, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0, accent: true },
  hints: ["Ska is the fast, upbeat ancestor of reggae — same offbeat idea, double the speed.", "Choke each chord to keep it staccato."],
  explain: `### Ska offbeats
Jamaican ska (and its punk revival) puts a short chord on every 8th-note offbeat. Upstrokes give it its bright, light attack.`,
  visual: { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pattern: "-U-U-U-U", accents: [1, 3, 5, 7], chord: { root: "$root", quality: "$quality" } },
  demo: { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pattern: "-U-U-U-U", accents: [1, 3, 5, 7], chord: { root: "$root", quality: "$quality" } },
  concepts: ["skank"],
  vary: ["tempo", "root"]
},

// ── Blues ───────────────────────────────────────────────────────────────────

{
  id: "rhy-blues-shuffle-strum",
  mode: "play", category: "styles", tags: ["blues", "shuffle", "swing"],
  title: "Blues 1: shuffle strum on {chord}",
  level: 2, length: "short", minutes: 2,
  params: { root: ["A", "E", "D", "G"], quality: ["7", "9"] },
  prompt: "Down-up 8ths on **{chord}** with a full **triplet shuffle** (long-short). Accent 2 and 4.",
  goal: "Rolling shuffle for 12 bars that matches the demo's swing.",
  tempo: { start: 80, min: 60, max: 160, step: 5, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0.67, accent: true },
  hints: ["Shuffle = triplets with the middle note left out.", "Then run it through a 12-bar blues (I7–IV7–V7)."],
  explain: `### Shuffle
The shuffle is the triplet-based long-short 8th that defines blues and early rock 'n' roll. Mathematically it's triplet swing (2:1).`,
  visual: { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pattern: "DUDUDUDU", accents: [2, 6], swing: 0.67, chord: { root: "$root", quality: "$quality" } },
  demo: { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pattern: "DUDUDUDU", accents: [2, 6], swing: 0.67, chord: { root: "$root", quality: "$quality" } },
  concepts: ["swing", "shuffle"],
  vary: ["tempo", "root"]
},

{
  id: "rhy-blues-shuffle-triplet-grid",
  mode: "play", category: "styles", tags: ["blues", "shuffle", "triplets"],
  title: "Blues 2: the shuffle on a triplet grid",
  level: 3, length: "short", minutes: 2,
  params: { root: ["A", "E"], quality: ["7"] },
  prompt: "Play triplets on **{chord}** for 2 bars, then **drop the middle triplet** for 2 bars. The second version *is* the shuffle.",
  goal: "Your shuffle sits exactly on the triplet grid.",
  tempo: { start: 70, min: 50, max: 140, step: 5, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 3, swing: 0, accent: true },
  hints: ["Keep thinking 'trip-o-let' and simply skip the 'o'.", "Here the strokes are D on the beat and U on the 'let' — swung 8th-note motion."],
  explain: `### Seeing swing
Writing the shuffle on a triplet grid shows exactly where the off-beat lives: on the **third** triplet. This kills the vague 'somewhere late' feel.`,
  visual: { type: "rhythm", meter: "4/4", grid: 3, bars: 1, pattern: "D-UD-UD-UD-U", accents: [0, 3, 6, 9], chord: { root: "$root", quality: "$quality" } },
  demo: [
    { type: "rhythm", meter: "4/4", grid: 3, bars: 1, pattern: "DUDUDUDUDUDU", accents: [0, 3, 6, 9], chord: { root: "$root", quality: "$quality" } },
    { type: "rhythm", meter: "4/4", grid: 3, bars: 1, pattern: "D-UD-UD-UD-U", accents: [0, 3, 6, 9], chord: { root: "$root", quality: "$quality" } }
  ],
  concepts: ["shuffle", "triplets", "swing"],
  vary: ["tempo"]
},

{
  id: "rhy-blues-boogie",
  mode: "play", category: "styles", tags: ["blues", "boogie", "shuffle", "riff", "power-chords"],
  title: "Blues 3: boogie shuffle (root–5 / root–6)",
  level: 3, length: "medium", minutes: 3,
  params: { root: ["A", "E"], quality: ["5"] },
  prompt: "Shuffled 8ths, all downstrokes on strings 5+4 (**{root}5**). Alternate the top note: **two 8ths on the 5th, two on the 6th** (stretch with the ring/pinky). Palm-mute lightly.",
  goal: "Steady, rolling boogie for 12 bars, the stretch in time.",
  tempo: { start: 80, min: 60, max: 160, step: 5, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0.67, accent: true },
  hints: ["The 'Jimmy Reed' boogie: 5-5-6-6 on top of the root.", "Move it to strings 6+5 for the IV/V chords in E, or 5+4 / 4+3 in A."],
  explain: `### The boogie shuffle
The two-string boogie (root + 5th alternating with root + 6th) is the backbone of Chicago blues and early rock 'n' roll. All downstrokes + shuffle swing = the classic sound.`,
  visual: { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pick: "5+4 5+4 5+4 5+4 5+4 5+4 5+4 5+4", strokes: "D D D D D D D D", swing: 0.67, chord: { root: "$root", quality: "$quality" } },
  demo: { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pick: "5+4 5+4 5+4 5+4 5+4 5+4 5+4 5+4", strokes: "D D D D D D D D", swing: 0.67, chord: { root: "$root", quality: "$quality" } },
  concepts: ["shuffle", "palm-muting"],
  vary: ["tempo", "root"]
},

{
  id: "rhy-blues-slow-12-8",
  mode: "play", category: "styles", tags: ["blues", "slow-blues", "triplets", "12-8"],
  title: "Blues 4: slow blues triplets",
  level: 4, length: "medium", minutes: 4,
  params: { root: ["A", "E", "G", "C"], quality: ["7", "9"] },
  prompt: "Slow blues on **{chord}**: continuous triplets (alternate strumming), with heavier accents on **beats 2 and 4**.",
  goal: "Triplets stay even at a slow tempo — no rushing — for 12 bars.",
  tempo: { start: 56, min: 40, max: 80, step: 2, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 3, swing: 0, accent: true },
  hints: ["Slow tempos are harder: the space between notes tempts you to rush.", "Beat 2 and 4 start on an upstroke — dig in."],
  explain: `### Slow blues
Slow blues is felt in 12/8: four beats each divided into three. The rhythm guitar's job is a hypnotic, unhurried triplet pulse.`,
  visual: { type: "rhythm", meter: "4/4", grid: 3, bars: 1, pattern: "DUDUDUDUDUDU", accents: [3, 9], chord: { root: "$root", quality: "$quality" } },
  demo: { type: "rhythm", meter: "4/4", grid: 3, bars: 1, pattern: "DUDUDUDUDUDU", accents: [3, 9], chord: { root: "$root", quality: "$quality" } },
  concepts: ["triplets", "shuffle"],
  vary: ["tempo", "root"]
},

// ── Country / bluegrass ─────────────────────────────────────────────────────

{
  id: "rhy-country-boom-chick",
  mode: "play", category: "styles", tags: ["country", "boom-chick", "alternating-bass"],
  title: "Country 1: boom-chick on {chord}",
  level: 1, length: "short", minutes: 2,
  params: { root: ["G", "C", "D", "A", "E"], quality: ["maj", "7"] },
  prompt: "On **{chord}**: pick the **root** on beat 1, strum the upper strings on 2, pick the **fifth** (alternate bass) on 3, strum on 4.",
  goal: "A bouncing 'boom-chick' for 16 bars with a clean alternating bass.",
  tempo: { start: 80, min: 60, max: 160, step: 5, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0, accent: true },
  hints: ["Root first, then the next-string-down note (usually the fifth).", "Keep the 'chick' short and bright, on the top 3–4 strings."],
  explain: `### Boom-chick
Bass note on 1 and 3, strum on 2 and 4: the foundational country/folk rhythm. Alternating the bass (root → fifth) makes it walk.`,
  visual: { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pattern: "T-D-T-D-", accents: [0, 4], chord: { root: "$root", quality: "$quality" } },
  demo: { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pattern: "T-D-T-D-", accents: [0, 4], chord: { root: "$root", quality: "$quality" } },
  concepts: ["boom-chick"],
  vary: ["tempo", "root"]
},

{
  id: "rhy-country-boom-chicka",
  mode: "play", category: "styles", tags: ["country", "boom-chick", "alternating-bass"],
  title: "Country 2: boom-chicka on {chord}",
  level: 2, length: "short", minutes: 2,
  params: { root: ["G", "C", "D", "A", "E"], quality: ["maj", "7"] },
  prompt: "Like boom-chick, but the strum becomes **down-up** ('chick-a') on 2 and 4.",
  goal: "Smooth, driving 'boom-chicka' for 16 bars.",
  tempo: { start: 80, min: 60, max: 160, step: 5, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0, accent: true },
  hints: ["The upstroke is light — just the top 2–3 strings.", "Johnny Cash's 'boom-chicka-boom' train beat starts here."],
  explain: `### Adding the up-strum
The upstroke on the & of 2 and 4 adds forward motion — the foundation of the country 'train beat'.`,
  visual: { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pattern: "T-DUT-DU", accents: [0, 4], chord: { root: "$root", quality: "$quality" } },
  demo: { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pattern: "T-DUT-DU", accents: [0, 4], chord: { root: "$root", quality: "$quality" } },
  concepts: ["boom-chick"],
  vary: ["tempo", "root"]
},

{
  id: "rhy-country-train",
  mode: "play", category: "styles", tags: ["country", "train-beat", "sixteenths", "muted"],
  title: "Country 3: train beat",
  level: 3, length: "medium", minutes: 3,
  params: { root: ["E", "A", "G"], quality: ["maj", "7"] },
  prompt: "Palm-muted 16th strums on **{chord}**: bass note on 1 and 3, **accented muted strum on 2 and 4**, ghosts everywhere else. Think freight train.",
  goal: "Chugging, even 16ths for 16 bars with a clear backbeat.",
  tempo: { start: 80, min: 60, max: 140, step: 4, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0, accent: true },
  hints: ["Palm-mute heavily for the 'chug'; let the 2 and 4 open up a little.", "Luther Perkins / Johnny Cash's sound is the reference."],
  explain: `### Train beat
A muted 16th strum imitating a snare 'train' groove. Rhythm guitar as drum kit — essential in rockabilly and classic country.`,
  visual: { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pattern: "TuduDuduTuduDudu", accents: [4, 12], chord: { root: "$root", quality: "$quality" } },
  demo: { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pattern: "TuduDuduTuduDudu", accents: [4, 12], chord: { root: "$root", quality: "$quality" } },
  concepts: ["boom-chick", "palm-muting"],
  vary: ["tempo", "root"]
},

{
  id: "rhy-carter-scratch",
  mode: "play", category: "styles", tags: ["country", "carter-style", "fingerstyle", "thumb-brush"],
  title: "Country 4: Carter scratch (thumb-brush)",
  level: 4, length: "medium", minutes: 3,
  params: { root: ["C", "G"], quality: ["maj"] },
  prompt: "On **{chord}**: **thumb** plays a bass note on 1 and 3; the **index finger brushes** the treble strings down on 2 and 4 and back up on the &. Then put a simple melody into the thumb notes.",
  goal: "Even thumb–brush–brush pattern for 16 bars; the bass line stands out.",
  tempo: { start: 80, min: 60, max: 160, step: 5, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0, accent: true },
  hints: ["Maybelle Carter played the *melody* on the bass strings and 'stirred the other strings' with her fingers.", "With a pick, the same idea = 'church lick' / Carter lick."],
  explain: `### Carter style
Named after Maybelle Carter (also called the thumb brush, church lick or Carter scratch): melody in the bass with the thumb, rhythmic brushes on the treble. Bill Monroe-era bluegrass rhythm grew out of it.`,
  visual: { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pick: "5 - 3+2+1 3+2+1 4 - 3+2+1 3+2+1", strokes: "D - D U D - D U", fingers: "p - i i p - i i", chord: { root: "$root", quality: "$quality" } },
  demo: { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pick: "5 - 3+2+1 3+2+1 4 - 3+2+1 3+2+1", strokes: "D - D U D - D U", fingers: "p - i i p - i i", chord: { root: "$root", quality: "$quality" } },
  concepts: ["boom-chick", "thumb-independence"],
  vary: ["tempo", "root"],
  source: "Peghead Nation, 'Maybelle Carter–Style Guitar' (Cathy Fink); Wikipedia, 'Carter Family picking'"
},

{
  id: "rhy-bluegrass-drive",
  mode: "play", category: "styles", tags: ["bluegrass", "boom-chick", "speed", "alternating-bass"],
  title: "Bluegrass rhythm at speed",
  level: 5, length: "medium", minutes: 3,
  params: { root: ["G", "C", "D"], quality: ["maj"] },
  prompt: "Boom-chick on **{chord}** at bluegrass tempos: alternating bass on 1 and 3, a **short, punchy strum on 2 and 4** (the 'chop'). Climb the tempo ladder.",
  goal: "Driving, even rhythm at the target tempo for 16 bars.",
  tempo: { start: 110, min: 90, max: 220, step: 10, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0, accent: false, clickOn: "2&4" },
  hints: ["At high tempos, keep the motion compact and the strum short.", "Click on 2 and 4 = the mandolin chop."],
  explain: `### Bluegrass time
In a bluegrass band the guitar's bass notes lock with the bass and the strums lock with the mandolin chop on 2 and 4. Fast tempos demand total relaxation.`,
  visual: { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pattern: "T-D.T-D.", accents: [2, 6], chord: { root: "$root", quality: "$quality" } },
  demo: { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pattern: "T-D.T-D.", accents: [2, 6], chord: { root: "$root", quality: "$quality" } },
  concepts: ["boom-chick", "click-placement"],
  vary: ["tempo", "root"]
},

// ── Rock ────────────────────────────────────────────────────────────────────

{
  id: "rhy-rock-pm-8ths",
  mode: "play", category: "styles", tags: ["rock", "palm-mute", "power-chords", "downpicking"],
  title: "Rock 1: palm-muted 8ths on {root}5",
  level: 1, length: "short", minutes: 2,
  params: { root: ["E", "A", "D", "G"], quality: ["5"] },
  prompt: "Power chord **{root}5**, palm resting on the strings at the bridge, **all downstrokes in 8ths**.",
  goal: "Tight, even chug for 16 bars.",
  tempo: { start: 90, min: 60, max: 200, step: 5, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 2, swing: 0, accent: true },
  hints: ["Palm too far forward = no pitch; too far back = no mute. Find the edge.", "Every rock card builds on this."],
  explain: `### Palm-muted 8ths
The side of the picking hand lightly damps the strings near the bridge, giving the tight 'chug' of rock and metal. All downstrokes for punch.`,
  visual: { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pick: "6+5 6+5 6+5 6+5 6+5 6+5 6+5 6+5", strokes: "D D D D D D D D", chord: { root: "$root", quality: "$quality" } },
  demo: { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pick: "6+5 6+5 6+5 6+5 6+5 6+5 6+5 6+5", strokes: "D D D D D D D D", chord: { root: "$root", quality: "$quality" } },
  concepts: ["palm-muting"],
  vary: ["tempo", "root"]
},

{
  id: "rhy-rock-accent-riff",
  mode: "play", category: "styles", tags: ["rock", "palm-mute", "accents", "3-3-2"],
  title: "Rock 2: palm-mute with open accents (3-3-2)",
  level: 3, length: "short", minutes: 2,
  params: { root: ["E", "A", "D"], quality: ["5"] },
  prompt: "Palm-muted downpicked 8ths on **{root}5**; **lift the palm** for open, accented hits on 1, the & of 2 and 4 (3-3-2).",
  goal: "Big contrast between chug and open hits, steady for 16 bars.",
  tempo: { start: 100, min: 70, max: 180, step: 5, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0, accent: true },
  hints: ["The accent = palm off + slightly harder pick.", "This 3-3-2 shape drives countless rock riffs."],
  explain: `### Mute vs open
Switching between palm-muted and open strokes is how rock guitarists create riffs from a single chord. Here the accents form the tresillo (3-3-2).`,
  visual: { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pick: "6+5 6+5 6+5 6+5 6+5 6+5 6+5 6+5", strokes: "D D D D D D D D", accents: [0, 3, 6], chord: { root: "$root", quality: "$quality" } },
  demo: { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pick: "6+5 6+5 6+5 6+5 6+5 6+5 6+5 6+5", strokes: "D D D D D D D D", accents: [0, 3, 6], chord: { root: "$root", quality: "$quality" } },
  concepts: ["palm-muting", "rhythmic-cells"],
  vary: ["tempo", "root"]
},

{
  id: "rhy-rock-gallop",
  mode: "play", category: "styles", tags: ["rock", "metal", "gallop", "sixteenths"],
  title: "Rock 3: the gallop",
  level: 4, length: "short", minutes: 2,
  prompt: "Palm-muted low E: **8th + two 16ths** ('da-da-dum'), repeated on every beat. Strokes D – D U.",
  goal: "Clean, even gallop for 8 bars; the two 16ths aren't rushed.",
  tempo: { start: 90, min: 60, max: 180, step: 5, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0, accent: true },
  hints: ["Classic metal (Iron Maiden) gallop.", "Reverse gallop: two 16ths + an 8th (D U D –). Try it next."],
  explain: `### Gallop
A 16th-grid figure (slots 1, 3, 4 of each beat) that sounds like horse hooves. Its stroke directions follow the 16th grid: D (1), D (&), U (a).`,
  visual: { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pick: "6 - 6 6 6 - 6 6 6 - 6 6 6 - 6 6", strokes: "D - D U D - D U D - D U D - D U", accents: [0, 4, 8, 12] },
  demo: { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pick: "6 - 6 6 6 - 6 6 6 - 6 6 6 - 6 6", strokes: "D - D U D - D U D - D U D - D U", accents: [0, 4, 8, 12] },
  concepts: ["palm-muting", "constant-motion"],
  vary: ["tempo"]
},

{
  id: "rhy-rock-16th-chug",
  mode: "play", category: "styles", tags: ["rock", "metal", "sixteenths", "palm-mute", "alternate-picking"],
  title: "Rock 4: alternate-picked 16th chug",
  level: 5, length: "medium", minutes: 3,
  prompt: "Palm-muted low E in **continuous alternate-picked 16ths**, accenting each beat. Climb the tempo ladder.",
  goal: "Even, tight 16ths for 16 bars at the target tempo.",
  tempo: { start: 90, min: 60, max: 200, step: 5, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0, accent: true },
  hints: ["Upstrokes must be as heavy as downstrokes — check by recording.", "Above ~160 bpm, efficient motion matters more than strength."],
  explain: `### 16th chug
The engine of modern metal rhythm: relentless alternate-picked 16ths. Even dynamics between down and up are the hallmark of a tight player.`,
  visual: { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pick: "6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6", strokes: "D U D U D U D U D U D U D U D U", accents: [0, 4, 8, 12] },
  demo: { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pick: "6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6", strokes: "D U D U D U D U D U D U D U D U", accents: [0, 4, 8, 12] },
  concepts: ["palm-muting", "alternate-picking"],
  vary: ["tempo"]
},

{
  id: "rhy-rock-riff-push",
  mode: "play", category: "styles", tags: ["rock", "power-chords", "anticipation", "riff"],
  title: "Rock 5: power-chord riff with pushes",
  level: 3, length: "medium", minutes: 3,
  prompt: "Two-bar riff: **E5** (palm-muted 8ths) for bar 1, then **G5 on the & of 4 pushed into bar 2**, then **A5** pushed on the & of 4 back into E5. Open accents on the pushes.",
  goal: "Pushes land exactly on the & and ring over the bar line, 8 loops.",
  tempo: { start: 100, min: 70, max: 170, step: 5, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0, accent: true },
  hints: ["The pushed chord is a downstroke in all-down picking — it's the 8th after beat 4.", "Let it ring: no restrike on the next 1."],
  explain: `### The rock push
Anticipating the chord change by an 8th note is the single most common rock rhythm device ('the push'). It makes riffs lean forward.`,
  visual: { type: "rhythm", meter: "4/4", grid: 2, bars: 2, pick: "6+5 6+5 6+5 6+5 6+5 6+5 6+5 6+5 | - 6+5 6+5 6+5 6+5 6+5 6+5 6+5", strokes: "D D D D D D D D | - D D D D D D D", accents: [7, 15], chord: { root: "E", quality: "5" } },
  demo: { type: "rhythm", meter: "4/4", grid: 2, bars: 2, pick: "6+5 6+5 6+5 6+5 6+5 6+5 6+5 6+5 | - 6+5 6+5 6+5 6+5 6+5 6+5 6+5", strokes: "D D D D D D D D | - D D D D D D D", accents: [7, 15], chord: { root: "E", quality: "5" }, title: "Rhythm only, on E5 (the pushes are the accents)" },
  concepts: ["rhythmic-anticipation", "palm-muting"],
  vary: ["tempo"]
},

// ── Jazz comping ────────────────────────────────────────────────────────────

{
  id: "rhy-jazz-four",
  mode: "play", category: "styles", tags: ["jazz", "four-to-the-bar", "freddie-green", "comping"],
  title: "Jazz 1: four-to-the-bar on {chord}",
  level: 3, length: "medium", minutes: 3,
  params: { root: ["F", "Bb", "C", "G"], quality: ["7", "maj7", "m7", "6"] },
  prompt: "A 3-note shell of **{chord}** on the lower strings. **Even downstroke quarter notes**, short-ish, every beat equal. Click on 2 and 4.",
  goal: "16 bars of a relaxed, even, swinging pulse.",
  tempo: { start: 110, min: 80, max: 220, step: 5, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0.67, accent: false, clickOn: "2&4" },
  hints: [
    "Release the chord slightly before the next beat — a 'tick-tock' rather than a sustained wash.",
    "Time first, voicings second: Freddie Green's whole art was time.",
    "Shells (root-3-7 or root-7-3) keep you out of the piano's way."
  ],
  explain: `### Freddie Green
Count Basie's guitarist for ~50 years played **four-to-the-bar**: an even quarter-note pulse locking with the bass, in small voicings on the low-middle strings. Bassists and drummers who played with him describe an *even four* rather than heavy 2 and 4 accents. Tim Berens (freddiegreen.org) argues: learn the **time** first, then worry about voicings.`,
  visual: { type: "rhythm", meter: "4/4", grid: 1, bars: 1, pattern: "DDDD", chord: { root: "$root", quality: "$quality" } },
  demo: { type: "rhythm", meter: "4/4", grid: 1, bars: 1, pattern: "DDDD", chord: { root: "$root", quality: "$quality" } },
  concepts: ["four-to-the-bar", "click-placement"],
  vary: ["tempo", "root", "quality"],
  source: "freddiegreen.org — Tim Berens, 'Basics of Freddie Green Comping'"
},

{
  id: "rhy-jazz-four-ii-v-i",
  mode: "play", category: "styles", tags: ["jazz", "four-to-the-bar", "ii-v-i", "comping"],
  title: "Jazz 2: four-to-the-bar through ii–V–I in Bb",
  level: 4, length: "long", minutes: 5,
  prompt: "Four-to-the-bar through **Cm7 | F7 | Bbmaj7 | Bbmaj7** with 3-note shells, voice-leading to the nearest shape.",
  goal: "Changes don't disturb the pulse for 8 loops at the target tempo.",
  tempo: { start: 110, min: 80, max: 220, step: 5, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0.67, accent: false, clickOn: "2&4" },
  hints: ["Shells: root on 6 (R-7-3) alternates with root on 5 (R-3-7) for minimal movement.", "See the voicing cards for the shapes."],
  explain: `### Pulse over changes
Four-to-the-bar is only useful if the changes are seamless. Small shell voicings make the motion tiny.`,
  visual: { type: "rhythm", meter: "4/4", grid: 1, bars: 1, pattern: "DDDD", chord: { root: "C", quality: "m7" } },
  demo: [
    { type: "rhythm", meter: "4/4", grid: 1, bars: 1, pattern: "DDDD", chord: { root: "C", quality: "m7" } },
    { type: "rhythm", meter: "4/4", grid: 1, bars: 1, pattern: "DDDD", chord: { root: "F", quality: "7" } },
    { type: "rhythm", meter: "4/4", grid: 1, bars: 1, pattern: "DDDD", chord: { root: "Bb", quality: "maj7" } },
    { type: "rhythm", meter: "4/4", grid: 1, bars: 1, pattern: "DDDD", chord: { root: "Bb", quality: "maj7" } }
  ],
  concepts: ["four-to-the-bar"],
  vary: ["tempo"]
},

{
  id: "rhy-jazz-charleston",
  mode: "play", category: "styles", tags: ["jazz", "charleston", "comping"],
  title: "Jazz 3: the Charleston rhythm",
  level: 4, length: "short", minutes: 2,
  params: { root: ["F", "Bb", "C", "G", "D"], quality: ["7", "m7", "maj7", "6"] },
  prompt: "Comp **{chord}** with the Charleston: a short chord on **beat 1** and the **& of 2**, swung. Silence the rest.",
  goal: "Crisp, swinging Charleston for 16 bars.",
  tempo: { start: 110, min: 80, max: 220, step: 5, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0.67, accent: false, clickOn: "2&4" },
  hints: ["The & of 2 is the swung (late) 8th — on the 'let' of the triplet.", "Short chords: release pressure to stop them."],
  explain: `### The Charleston
Named after the 1920s dance, this two-note figure (1, &2) is the most common jazz comping rhythm after four-to-the-bar. It's the 'dotted quarter + 8th' feel.`,
  visual: { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pattern: "D..D....", swing: 0.67, chord: { root: "$root", quality: "$quality" } },
  demo: { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pattern: "D..D....", swing: 0.67, chord: { root: "$root", quality: "$quality" } },
  concepts: ["charleston", "swing"],
  vary: ["tempo", "root", "quality"]
},

{
  id: "rhy-jazz-reverse-charleston",
  mode: "play", category: "styles", tags: ["jazz", "charleston", "comping", "displacement"],
  title: "Jazz 4: reverse Charleston",
  level: 5, length: "short", minutes: 2,
  params: { root: ["F", "Bb", "C", "G", "D"], quality: ["7", "m7", "maj7", "6"] },
  prompt: "Comp **{chord}** with the **reverse Charleston**: short chords on the **& of 1** and **beat 3**, swung.",
  goal: "Relaxed and swinging for 16 bars — no rushing the & of 1.",
  tempo: { start: 110, min: 80, max: 220, step: 5, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0.67, accent: false, clickOn: "2&4" },
  hints: ["It's the Charleston displaced one 8th note later.", "Feel beat 1 strongly even though you don't play it."],
  explain: `### Reverse Charleston
The Charleston moved one 8th later. More syncopated and 'floating' — a great example of rhythmic displacement in comping.`,
  visual: { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pattern: ".D..D...", swing: 0.67, chord: { root: "$root", quality: "$quality" } },
  demo: { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pattern: ".D..D...", swing: 0.67, chord: { root: "$root", quality: "$quality" } },
  concepts: ["charleston", "displacement"],
  vary: ["tempo", "root", "quality"]
},

{
  id: "rhy-jazz-anticipation",
  mode: "play", category: "styles", tags: ["jazz", "anticipation", "comping"],
  title: "Jazz 5: comping with anticipations",
  level: 5, length: "medium", minutes: 3,
  params: { root: ["F", "Bb", "C", "G"], quality: ["7", "m7", "maj7"] },
  prompt: "Two-bar comp on **{chord}**: bar 1 → chord on the **& of 2** only (beat 1 is still ringing from the anticipation); bar 2 → chord on **3** and the **& of 4**, which anticipates bar 1.",
  goal: "The & of 4 feels like the 'real' downbeat of the next bar, 16 bars.",
  tempo: { start: 120, min: 80, max: 220, step: 5, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0.67, accent: false, clickOn: "2&4" },
  hints: ["In a tune, the & of 4 is the *next* chord played early.", "Don't restrike beat 1 — let the anticipation hold through it."],
  explain: `### Anticipations in jazz
Jazz comping constantly places chords on the & of 4 (and & of 2) before the bar where they 'belong'. It creates forward motion and interacts with the soloist.`,
  visual: { type: "rhythm", meter: "4/4", grid: 2, bars: 2, pattern: "-..D.... | ....D..D", swing: 0.67, chord: { root: "$root", quality: "$quality" } },
  demo: { type: "rhythm", meter: "4/4", grid: 2, bars: 2, pattern: "-..D.... | ....D..D", swing: 0.67, chord: { root: "$root", quality: "$quality" } },
  concepts: ["rhythmic-anticipation", "charleston"],
  vary: ["tempo", "root"]
},

{
  id: "rhy-jazz-comping-mix",
  mode: "play", category: "styles", tags: ["jazz", "comping", "vocabulary"],
  title: "Jazz 6: comping vocabulary — {p:comp}",
  level: 6, length: "medium", minutes: 4,
  params: {
    root: ["F", "Bb", "C", "G", "D"], quality: ["7", "m7", "maj7", "6", "9"],
    comp: [
      { v: "D..D.... | D..D....", label: "Charleston ×2" },
      { v: ".D..D... | .D..D...", label: "reverse Charleston ×2" },
      { v: "D..D.... | .D..D...", label: "Charleston → reverse", lvl: 1 },
      { v: "..D..D.. | ......D.", label: "2, &3 | 4", lvl: 1 },
      { v: "...D...D | ...D....", label: "&2, &4 | &2", lvl: 2 },
      { v: "D.D.D.D. | ..D...DD", label: "four-to-the-bar → 2, 4, &4", lvl: 2 }
    ]
  },
  prompt: "Comp **{chord}** for 2-bar phrases using **{p:comp}**. Then improvise your own 2-bar rhythms in the same spirit.",
  goal: "Each figure swings, chords are short, and the pulse stays clear.",
  tempo: { start: 120, min: 80, max: 220, step: 5, unit: "bpm" },
  metronome: { meter: "4/4", subdivision: 1, swing: 0.67, accent: false, clickOn: "2&4" },
  hints: ["Leave space — comping is conversation, not continuous strumming.", "Sing a melody (or play a record) and comp around it."],
  explain: `### Building comping vocabulary
Jazz comping is a library of small rhythmic figures — Charleston, reverse Charleston, anticipations, 2-and-4 stabs — mixed in response to the soloist. Practise each figure until it's automatic, then combine them freely.`,
  visual: { type: "rhythm", meter: "4/4", grid: 2, bars: 2, pattern: "$comp", swing: 0.67, chord: { root: "$root", quality: "$quality" } },
  demo: { type: "rhythm", meter: "4/4", grid: 2, bars: 2, pattern: "$comp", swing: 0.67, chord: { root: "$root", quality: "$quality" } },
  concepts: ["charleston", "rhythmic-anticipation", "displacement"],
  vary: ["tempo", "comp", "root"]
},

// ─────────────────────────────────────────────────────────────────────────────
// F. THEORY CARDS ABOUT RHYTHM (mode: theory, category: theory, tag: rhythm)
// ─────────────────────────────────────────────────────────────────────────────

{
  id: "rhy-thy-count-16ths",
  mode: "theory", category: "theory", tags: ["rhythm", "counting", "sixteenths"],
  title: "Counting 16ths",
  level: 1, length: "short", minutes: 1,
  prompt: "Using 1-e-&-a counting, what is the **third 16th note of beat 2** called?",
  hints: ["Each beat: number, e, &, a.", "The third syllable is also the 8th-note offbeat."],
  explain: `Each beat splits into **1 e & a**. The third 16th is the **&** — the same spot as the 8th-note offbeat.`,
  visual: { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pattern: "dudu duDu dudu dudu", accents: [6], title: "Beat 2's third 16th" },
  concepts: ["subdivisions"],
  quiz: { kind: "choice", question: "Third 16th of beat 2 =", choices: ["2", "e", "&", "a"], answer: 2, explain: "1 e & a — the third syllable is the &." }
},

{
  id: "rhy-thy-strum-direction",
  mode: "theory", category: "theory", tags: ["rhythm", "strumming", "constant-motion"],
  title: "Stroke direction in 16th strumming",
  level: 2, length: "short", minutes: 1,
  prompt: "With constant-motion 16th strumming, which partials are always **upstrokes**?",
  hints: ["The hand goes down on the beat.", "Down-up-down-up per beat."],
  explain: `D on **1** and **&**, U on **e** and **a**. This fixed map lets you place a chord on any 16th without thinking about direction.`,
  visual: { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pattern: "dUdU dUdU dUdU dUdU", accents: [1, 3, 5, 7, 9, 11, 13, 15] },
  concepts: ["constant-motion"],
  quiz: { kind: "choice", question: "Upstrokes fall on…", choices: ["1 and &", "e and a", "& and a", "only the a"], answer: 1, explain: "Downs on 1 and &, ups on e and a." }
},

{
  id: "rhy-thy-triplet-direction",
  mode: "theory", category: "theory", tags: ["rhythm", "triplets", "alternate-picking"],
  title: "Triplets and alternation",
  level: 3, length: "short", minutes: 1,
  prompt: "Strictly alternating 8th-note triplets, starting with a downstroke on beat 1. Beat 2 starts with a…",
  hints: ["Three strokes: D U D — what comes next?"],
  explain: `D U D | **U** D U | D U D | U D U. With an odd number per beat, the stroke on the beat alternates.`,
  visual: { type: "rhythm", meter: "4/4", grid: 3, bars: 1, pattern: "DUD UDU DUD UDU", accents: [0, 3, 6, 9] },
  concepts: ["triplets", "alternate-picking"],
  quiz: { kind: "choice", question: "Beat 2 starts with…", choices: ["a downstroke", "an upstroke", "either, it doesn't matter", "a rest"], answer: 1, explain: "D U D, then U — odd groupings flip direction every beat." }
},

{
  id: "rhy-thy-swing-ratio",
  mode: "theory", category: "theory", tags: ["rhythm", "swing", "triplets"],
  title: "Where does the swung 8th fall?",
  level: 3, length: "short", minutes: 1,
  prompt: "In **triplet swing**, the off-beat 8th note sits on which triplet partial?",
  hints: ["Swing = long-short.", "Count trip-o-let."],
  explain: `On the **third** triplet ('let'). The on-beat note lasts 2 triplets, the off-beat 1 → ratio **2:1**.`,
  visual: { type: "rhythm", meter: "4/4", grid: 3, bars: 1, pattern: "D-UD-UD-UD-U", accents: [0, 3, 6, 9] },
  concepts: ["swing", "shuffle"],
  quiz: { kind: "choice", question: "The swung off-beat falls on…", choices: ["the 1st triplet", "the 2nd triplet", "the 3rd triplet", "exactly halfway"], answer: 2, explain: "Long (2 triplets) + short (1 triplet) = 2:1." }
},

{
  id: "rhy-thy-solea-accents",
  mode: "theory", category: "theory", tags: ["rhythm", "flamenco", "solea", "compas"],
  title: "Soleá accents",
  level: 4, length: "short", minutes: 1,
  prompt: "Which beats are accented in the 12-beat **soleá** compás?",
  hints: ["Five accents.", "Grouping 3+3+2+2+2."],
  explain: `**3, 6, 8, 10, 12** — grouping 3+3+2+2+2 (a 6/8 half and a 3/4 half).`,
  visual: { type: "rhythm", meter: "12/8", grid: 1, bars: 1, pattern: "ddDddDdDdDdD", accents: [2, 5, 7, 9, 11] },
  concepts: ["flamenco-compas", "hemiola"],
  quiz: { kind: "choice", question: "Soleá accents:", choices: ["1, 4, 7, 10", "3, 6, 8, 10, 12", "1, 3, 5, 7, 9, 11", "12, 3, 6, 9"], answer: 1, explain: "3, 6, 8, 10, 12 — tension builds on 3, increases on 6, peaks on 8, resolves on 10." },
  source: "Canteytoque, 'Compás explained'"
},

{
  id: "rhy-thy-bulerias-start",
  mode: "theory", category: "theory", tags: ["rhythm", "flamenco", "bulerias", "compas"],
  title: "Where does bulerías start?",
  level: 5, length: "short", minutes: 1,
  prompt: "Bulerías uses the soleá accent pattern, but the compás is usually counted starting from which beat?",
  hints: ["It's the last accent of soleá."],
  explain: `Bulerías (and alegrías, soleá por bulerías) start on **12**: 12 1 2 **3** 4 5 **6** 7 **8** 9 **10** 11 — accents 12, 3, 6, 8, 10.`,
  visual: { type: "rhythm", meter: "12/8", grid: 1, bars: 1, pattern: "DddDddDdDdDd", accents: [0, 3, 6, 8, 10] },
  concepts: ["flamenco-compas"],
  quiz: { kind: "choice", question: "Bulerías is counted from…", choices: ["1", "3", "8", "12"], answer: 3, explain: "Beat 12 becomes the strong 'downbeat' and start of the compás." }
},

{
  id: "rhy-thy-seguiriya",
  mode: "theory", category: "theory", tags: ["rhythm", "flamenco", "seguiriya", "compas"],
  title: "Seguiriya's uneven five",
  level: 7, length: "short", minutes: 1,
  prompt: "Seguiriya is felt as **five uneven beats** within 12 pulses. Which grouping is it?",
  hints: ["Beats 3 and 4 are 1.5× as long as the others.", "Same accent intervals as soleá, starting from soleá's beat 8."],
  explain: `**2+2+3+3+2** (short-short-long-long-short). Beats 1, 2 and 5 are equal; beats 3 and 4 last 1.5× as long. Counted against soleá's 12, it starts on beat 8.`,
  visual: { type: "rhythm", meter: "12/8", grid: 1, bars: 1, pattern: "DdDdDddDddDd", accents: [0, 2, 4, 7, 10] },
  concepts: ["flamenco-compas", "odd-meters"],
  quiz: { kind: "choice", question: "Seguiriya grouping:", choices: ["3+3+2+2+2", "2+2+3+3+2", "3+3+3+3", "2+2+2+3+3"], answer: 1, explain: "Short-short-long-long-short." },
  source: "Canteytoque, 'Compás explained' (siguiriya section)"
},

{
  id: "rhy-thy-tangos",
  mode: "theory", category: "theory", tags: ["rhythm", "flamenco", "tangos", "compas"],
  title: "Tangos compás",
  level: 4, length: "short", minutes: 1,
  prompt: "Tangos is based on a cycle of how many beats — and which beat is typically *subdued* by the guitar?",
  hints: ["It's a 'binary' palo, like rumba."],
  explain: `A **4-beat** cycle (often paired into 8), with **beat 1** subdued and 2, 3, 4 strongly marked.`,
  visual: { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pattern: ".-D-DUD-", accents: [2, 4, 6] },
  concepts: ["flamenco-compas"],
  quiz: { kind: "choice", question: "Tangos:", choices: ["12 beats, accent on 12", "4 beats, beat 1 subdued", "3 beats, accent on 1", "5 beats, 2+3"], answer: 1, explain: "4 beats; the guitar marks 2-3-4 and lets 1 breathe." }
},

{
  id: "rhy-thy-hemiola",
  mode: "theory", category: "theory", tags: ["rhythm", "hemiola", "meter"],
  title: "6/8 vs 3/4",
  level: 4, length: "short", minutes: 1,
  prompt: "6/8 and 3/4 both contain six 8th notes. What actually distinguishes them?",
  hints: ["Think about grouping."],
  explain: `**Grouping**: 6/8 = 3+3 (two beats of three), 3/4 = 2+2+2 (three beats of two). Alternating them is **hemiola** — the heart of the flamenco 12-beat compás and much Latin American music.`,
  visual: { type: "rhythm", meter: "6/8", grid: 1, bars: 1, pattern: "DUDUDU", accents: [0, 3] },
  concepts: ["hemiola"],
  quiz: { kind: "choice", question: "6/8 vs 3/4 differ in…", choices: ["number of 8ths", "grouping: 3+3 vs 2+2+2", "tempo only", "nothing"], answer: 1, explain: "Same six 8ths, different grouping." }
},

{
  id: "rhy-thy-polyrhythm-grid",
  mode: "theory", category: "theory", tags: ["rhythm", "polyrhythm"],
  title: "Common grid for 4:3",
  level: 5, length: "short", minutes: 1,
  prompt: "To line up **4 against 3** on one grid, how many slots per cycle do you need?",
  hints: ["Least common multiple."],
  explain: `**12** (LCM of 3 and 4). The 4-stream hits every 3rd slot, the 3-stream every 4th.`,
  visual: { type: "rhythm", meter: "3/4", grid: 4, bars: 1, pick: "6+1 - - 1 6 - 1 - 6 1 - -" },
  concepts: ["polyrhythm"],
  quiz: { kind: "choice", question: "4:3 needs a grid of…", choices: ["7", "8", "12", "24"], answer: 2, explain: "LCM(3,4) = 12." }
},

{
  id: "rhy-thy-clave",
  mode: "theory", category: "theory", tags: ["rhythm", "clave", "afro-cuban"],
  title: "3-2 vs 2-3 clave",
  level: 4, length: "short", minutes: 1,
  prompt: "In **son clave 3-2**, which bar has three notes, and where do the notes fall (in 8ths, 4/4)?",
  hints: ["The '3' side comes first in 3-2."],
  explain: `Bar 1 (the '3' side): **1, & of 2, 4**. Bar 2 (the '2' side): **2, 3**. In 2-3 clave the bars are swapped. Rumba clave delays the third note to the & of 4; bossa clave delays the last note to the & of 3.`,
  visual: { type: "rhythm", meter: "4/4", grid: 2, bars: 2, pattern: "D--U--D---D-D---" },
  concepts: ["clave"],
  quiz: { kind: "reveal", question: "Son clave 3-2: name the hit positions in both bars.", answer: "Bar 1: 1, &2, 4. Bar 2: 2, 3." }
},

{
  id: "rhy-thy-escape",
  mode: "theory", category: "theory", tags: ["rhythm", "picking-motion", "troy-grady"],
  title: "Which stroke escapes?",
  level: 6, length: "short", minutes: 1,
  prompt: "Two notes per string, alternate picking, **starting on a downstroke**. Every string change happens after a…",
  hints: ["D U | D U | ..."],
  explain: `After an **upstroke** → an **upstroke-escape** (USX) motion (older name: downward pickslanting) handles it. Start the pair on an upstroke and the changes move to the downstrokes (DSX).`,
  visual: { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pick: "3 3 2 2 3 3 2 2 3 3 2 2 3 3 2 2", strokes: "D U D U D U D U D U D U D U D U" },
  concepts: ["pick-escape"],
  quiz: { kind: "choice", question: "String changes follow…", choices: ["downstrokes", "upstrokes", "alternately down and up", "sweeps"], answer: 1, explain: "D U on each string → the U is the last stroke before every change." },
  source: "Troy Grady, Cracking the Code"
},

{
  id: "rhy-thy-inside-outside",
  mode: "theory", category: "theory", tags: ["rhythm", "picking-motion", "string-crossing"],
  title: "Inside or outside?",
  level: 5, length: "short", minutes: 1,
  prompt: "Alternating between string 2 and string 1, playing **string 2 with a downstroke** and string 1 with an upstroke. Is that inside or outside picking?",
  hints: ["Where does the pick travel between notes — between the strings, or around them?"],
  explain: `**Outside picking**: the downstroke on the thicker string ends between the strings, and the pick has to travel around the outside of string 1 to upstroke it. Inside picking reverses this (upstroke on the thicker string).`,
  visual: { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pick: "2 1 2 1 2 1 2 1 2 1 2 1 2 1 2 1", strokes: "D U D U D U D U D U D U D U D U" },
  concepts: ["alternate-picking", "pick-escape"],
  quiz: { kind: "choice", question: "D on string 2, U on string 1 =", choices: ["inside picking", "outside picking", "economy picking", "sweep picking"], answer: 1, explain: "The pick circles the outside of the string pair." }
},

{
  id: "rhy-thy-economy",
  mode: "theory", category: "theory", tags: ["rhythm", "economy-picking"],
  title: "Economy picking rule",
  level: 4, length: "short", minutes: 1,
  prompt: "Ascending a 3-notes-per-string scale with **economy picking** (strings 6 → 1). The first note on each new string is played with a…",
  hints: ["3 notes: D U D — and then you're moving toward the floor…"],
  explain: `A **downstroke**: D U **D** → **D** U D. The pick continues through to the next string (a mini-sweep). Descending, it's the mirror: upstrokes at each string change.`,
  visual: { type: "rhythm", meter: "4/4", grid: 3, bars: 1, pick: "6 6 6 5 5 5 4 4 4 3 3 3", strokes: "D U D D U D D U D D U D" },
  concepts: ["economy-picking"],
  quiz: { kind: "choice", question: "First note on each new string (ascending):", choices: ["downstroke", "upstroke", "alternates", "hammer-on"], answer: 0, explain: "Economy continues the stroke direction across the string change." }
},

{
  id: "rhy-thy-quintuplet-count",
  mode: "theory", category: "theory", tags: ["rhythm", "quintuplets", "counting"],
  title: "Counting quintuplets",
  level: 5, length: "short", minutes: 1,
  prompt: "How can you count or speak **quintuplets** so the five notes stay even?",
  hints: ["Five-syllable words work well."],
  explain: `Count **1-2-3-4-5** per beat, or use even five-syllable words: **'un-i-ver-si-ty'**, **'hip-po-pot-a-mus'**. In Carnatic solkattu: **ta-di-gi-na-tom**. The key is equal syllables — no natural sub-grouping.`,
  visual: { type: "rhythm", meter: "4/4", grid: 5, bars: 1, pattern: "dudud ududu dudud ududu", accents: [0, 5, 10, 15] },
  concepts: ["tuplets"],
  quiz: { kind: "reveal", question: "Speak one bar of quintuplets.", answer: "'1-2-3-4-5' per beat, or 'un-i-ver-si-ty' / 'ta-di-gi-na-tom', all syllables equal." }
},

{
  id: "rhy-thy-odd-meter-grouping",
  mode: "theory", category: "theory", tags: ["rhythm", "odd-meter", "groupings"],
  title: "Odd-meter groupings",
  level: 4, length: "short", minutes: 1,
  prompt: "Which of these is **not** a valid grouping of 7/8?",
  hints: ["Add them up."],
  explain: `2+2+3, 3+2+2 and 2+3+2 all sum to 7. **3+3+2** sums to 8 — that's the tresillo in 4/4 (or 8/8).`,
  visual: { type: "rhythm", meter: "7/8", grid: 1, bars: 1, pattern: "DUDUDUD", accents: [0, 2, 4] },
  concepts: ["odd-meters", "groupings"],
  quiz: { kind: "choice", question: "Not a 7/8 grouping:", choices: ["2+2+3", "3+2+2", "3+3+2", "2+3+2"], answer: 2, explain: "3+3+2 = 8." }
}

];

// ─────────────────────────────────────────────────────────────────────────────
// CONCEPTS (glossary / mini-lessons)
// ─────────────────────────────────────────────────────────────────────────────

export const concepts = [

{
  id: "subdivisions", title: "Subdivisions & counting (1-e-&-a)", tags: ["rhythm", "counting"],
  body: `### Splitting the beat
- **Quarters**: 1 2 3 4
- **8ths**: 1 & 2 & — the & is exactly halfway
- **8th-note triplets**: 1-trip-let (or 1-la-li) — three equal parts
- **16ths**: 1 e & a — four equal parts; the & is shared with 8ths
- **Sextuplets**: 6 per beat (two triplets) — 1-la-li-&-la-li
- **Quintuplets**: 5 per beat — 'un-i-ver-si-ty'

### How to practise
1. **Count out loud**, always — the voice is the most honest metronome.
2. Hear the subdivision before you play it (turn on the metronome's subdivision, then remove it).
3. Keep one master pulse (foot/head) and layer the subdivision over it.
4. Switching (2↔3, 4↔3, 4↔6, 4↔5) is a separate skill: practise the *switch*, not just each subdivision.`,
  visual: { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pattern: "dudu dudu dudu dudu", accents: [0, 4, 8, 12] },
  see: ["constant-motion", "triplets", "tuplets"]
},

{
  id: "constant-motion", title: "Constant motion (the pendulum)", tags: ["rhythm", "strumming"],
  body: `The strumming hand moves **down on the beat and up in between, all the time**, whether or not it touches the strings.
- In **8th** strumming: D on numbers, U on &s.
- In **16th** strumming: D on 1 and &, U on e and a.

Patterns are created by **skipping** strokes (air strums, \`-\` in the grid), never by changing the hand's rhythm. This makes placement automatic: a note on the 'a' is *always* an upstroke. Funk (Nolen, Rodgers), pop and reggae all rely on it.

Exceptions on purpose: all-downstroke rock/punk, jazz comping stabs, flamenco (rasgueado, thumb), and swung 8ths — where the hand moves D-U per beat in long-short proportion.`,
  visual: { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pattern: "D-DU-UDU" },
  see: ["subdivisions", "funk-16ths"]
},

{
  id: "triplets", title: "Triplets", tags: ["rhythm"],
  body: `Three equal notes per beat ('1-trip-let'). Key facts:
- With alternate strokes, triplets **flip direction every beat** (D U D | U D U).
- **Quarter-note triplets** = every other 8th-note triplet (3 notes across 2 beats).
- **Half-note triplets** = every 4th 8th-note triplet (3 across 4 beats).
- Triplets underlie swing, shuffle, 12/8 slow blues and 6/8 Afro-Cuban grooves.

Common faults: triplets turning into 'long-short-short' (a rushed first note) or drifting toward a shuffle. Speak the syllables to fix it.`,
  visual: { type: "rhythm", meter: "4/4", grid: 3, bars: 1, pattern: "DUD UDU DUD UDU", accents: [0, 3, 6, 9] },
  see: ["swing", "polyrhythm", "subdivisions"]
},

{
  id: "tuplets", title: "Tuplets: quintuplets, sextuplets & beyond", tags: ["rhythm"],
  body: `A **tuplet** squeezes N equal notes into one beat (or other span).
- **Sextuplet (6)**: two triplets per beat. Accent every 2nd → triplets; every 3rd → 8th-note pairs.
- **Quintuplet (5)**: no natural sub-grouping — the purest evenness test. Count 'un-i-ver-si-ty' or *ta-di-gi-na-tom*.
- **Septuplet (7)**: 'ta-ka-di-mi-ta-ki-ta'.

Modern players (Holdsworth, Govan) move fluidly between 4, 5, 6 and 7 per beat so that lines float over the bar. Practise tuplet ladders (4→5→6→5→4) with strong beat accents.`,
  visual: { type: "rhythm", meter: "4/4", grid: 5, bars: 1, pattern: "dudud ududu dudud ududu", accents: [0, 5, 10, 15] },
  see: ["subdivisions", "polyrhythm"]
},

{
  id: "swing", title: "Swing & the swing ratio", tags: ["rhythm", "feel"],
  body: `Swing lengthens the on-beat 8th and shortens the off-beat.
- **Straight** = 1:1
- **Triplet swing** = 2:1 (the off-beat on the 3rd triplet) — classic shuffle
- Real players float between, usually **lighter at fast tempos** and heavier at medium/slow.

Swing can also apply at the **16th level** (New Orleans funk, neo-soul, hip-hop): the e and a arrive late.

In the metronome, \`swing\` 0 = straight, ~0.33 = light, 0.67 = triplet swing.`,
  visual: { type: "rhythm", meter: "4/4", grid: 3, bars: 1, pattern: "D-UD-UD-UD-U" },
  see: ["shuffle", "triplets", "pocket"]
},

{
  id: "shuffle", title: "Shuffle", tags: ["rhythm", "blues"],
  body: `A shuffle is a **triplet-swung 8th-note feel** — triplets with the middle note left out ('**trip**-o-**let**'). It's the default feel of blues, early rock 'n' roll and boogie.

On guitar: swung down-up strums, or the **boogie** (root + 5th / root + 6th alternating, all downstrokes). In 12/8 notation a shuffle is quarter + 8th per beat.`,
  visual: { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pattern: "DUDUDUDU", swing: 0.67, accents: [2, 6] },
  see: ["swing", "triplets"]
},

{
  id: "accents-ghosts", title: "Accents & ghost notes", tags: ["rhythm", "dynamics"],
  body: `Groove comes from **contrast**. Accented strokes are louder/open; ghost strokes are quiet or muted (\`d\`/\`u\` in the grid).
- In strumming, accents come mostly from the **fretting hand** (press = sound, release = scratch).
- Accent drills on every partial (1, e, &, a) build placement and evenness.
- Rests (\`.\`) are as important: stop the strings so note length is controlled.`,
  visual: { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pattern: "dudU dudu Dudu duDu", accents: [3, 8, 14] },
  see: ["funk-16ths", "constant-motion"]
},

{
  id: "gap-click", title: "Gap click (metronome drop-out)", tags: ["rhythm", "time", "practice"],
  body: `The metronome plays for N bars, then is silent for M bars. You keep time; when the click returns you see whether you rushed or dragged.
- Start: 2 on / 2 off. Advanced: 1 on / 7 off.
- Count bars out loud during the silence.
- Most players **rush**; the fix is breathing, relaxing, and leaning back.

It's the fastest route from 'following the click' to **owning** the time.`,
  see: ["click-placement", "pocket"]
},

{
  id: "click-placement", title: "Moving the click (2 & 4, downbeat only)", tags: ["rhythm", "time", "practice"],
  body: `Change *what* the click represents:
- **Click on 2 & 4** = hi-hat/snare backbeat. You supply 1 and 3. Essential for jazz, funk, R&B. If the click 'flips' onto 1 and 3, stop and recount.
- **Click on 1 only** = one reference per bar.
- **Fewer clicks** = more internal responsibility.

Mick Goodrick's *The Advancing Guitarist* and countless jazz teachers recommend backbeat clicking as a core time exercise.`,
  see: ["gap-click", "swing"]
},

{
  id: "pocket", title: "Time feel & the pocket", tags: ["rhythm", "feel"],
  body: `Beyond 'in time' is **where** on the beat you sit:
- **On top / ahead**: urgent, driving (punk, some bebop).
- **Dead on**: neutral, machine-like.
- **Behind / laid back**: heavy, relaxed (blues, R&B, hip-hop).

The pocket is a **consistent** offset that locks with the band (especially bass and drums). Practise each placement deliberately against a click, and record yourself.`,
  see: ["swing", "gap-click"]
},

{
  id: "groupings", title: "Groupings (3s, 5s, 7s over the beat)", tags: ["rhythm", "phrasing"],
  body: `Take a stream of 16ths (or 8ths/triplets) and **accent it in groups** that don't match the beat — e.g. every 3rd 16th. The accents rotate against the bar line until they realign (groups of 3 over 16ths: 3 bars; groups of 5: 5 bars).

This is the core idea of **Gary Chaffee's** *Patterns* books for drummers and of modern 'over the bar' phrasing on guitar. Short groupings like **3+3+2** (tresillo) or **3+3+3+3+4** fit inside one bar.

Practise: accent-only, then melodic (a 3- or 5-note scale cell repeated over 16ths).`,
  visual: { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pattern: "dudu dudu dudu dudu", accents: [0, 3, 6, 9, 12] },
  see: ["displacement", "polyrhythm", "rhythmic-cells"]
},

{
  id: "displacement", title: "Rhythmic displacement", tags: ["rhythm", "phrasing"],
  body: `Move the **same rhythmic figure** to a different place in the bar — by an 8th, a 16th, a triplet partial. The notes stay the same; their relationship to the beat changes, often making a figure sound completely new.

Examples: Charleston (1, &2) displaced by an 8th = reverse Charleston (&1, 3). Funk players shift 16th figures by a 16th to create variations.

Practise each displacement slowly, counting out loud, with the beat in your foot.`,
  visual: { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pattern: ".U..D..." },
  see: ["groupings", "charleston", "syncopation"]
},

{
  id: "syncopation", title: "Syncopation", tags: ["rhythm"],
  body: `Emphasis on a normally weak part of the beat or bar — an &, an e/a, or a note tied over a strong beat. The listener's expectation of the beat makes syncopation feel like 'push and pull'.

Requires a **strong internal pulse**: the syncopated note only works if the beat it avoids is still felt.`,
  see: ["rhythmic-anticipation", "displacement"]
},

{
  id: "rhythmic-anticipation", title: "Anticipation ('the push')", tags: ["rhythm", "comping"],
  body: `Playing a chord (or note) an 8th or 16th **early** and tying it over the next downbeat. The most common syncopation in rock, pop, bossa and jazz comping. The next bar's beat 1 is then *not* restruck — the pushed chord is still ringing.

On guitar: in 8th-note strumming the push is the **upstroke on the & of 4**; in all-downs rock it's an extra downstroke.`,
  visual: { type: "rhythm", meter: "4/4", grid: 2, bars: 2, pattern: "D-DU-UDU | --DU-UDU" },
  see: ["syncopation", "charleston"]
},

{
  id: "odd-meters", title: "Odd meters", tags: ["rhythm", "meter"],
  body: `An odd meter is a bar built from **uneven groups of 2s and 3s**:
- **5/4** = 3+2 or 2+3
- **7/8** = 2+2+3, 3+2+2, 2+3+2 (Balkan dances)
- **7/4** = 4+3
- **9/8** = 3+3+3 (slip jig) or 2+2+2+3 (Turkish aksak)

Count the **groups** ('ta-ka ta-ka ta-ki-ta'), not 1-to-7. Once the grouping is in your body, odd meters groove. Note: with alternate strumming in 7/8 or 9/8, every other bar starts on an upstroke.`,
  visual: { type: "rhythm", meter: "7/8", grid: 1, bars: 1, pattern: "DUDUDUD", accents: [0, 2, 4] },
  see: ["groupings", "hemiola"]
},

{
  id: "polyrhythm", title: "Polyrhythm (3:2, 4:3 …)", tags: ["rhythm"],
  body: `Two even pulses running together, sharing a start point:
- **3:2** — composite 'long-short-short-long' ('**not** dif-fi-cult'). Grid: 6.
- **4:3** — 'pass the gold-en but-ter'. Grid: 12.
- **3:4** — half-note triplets over 4/4.
- **5:4** — quintuplets accented every 4th.

Method: find the **common grid** (least common multiple), place both streams on it, play them slowly (thumb vs fingers is perfect for this), then let your ear take over. Polyrhythms are everywhere in Afro-Cuban music, flamenco hemiola, Chopin and Ralph Towner's / Pat Metheny's fingerstyle writing.`,
  visual: { type: "rhythm", meter: "2/4", grid: 3, bars: 1, pick: "6+1 - 1 6 1 -" },
  see: ["hemiola", "triplets", "groupings"]
},

{
  id: "hemiola", title: "Hemiola (3+3 vs 2+2+2)", tags: ["rhythm", "meter", "flamenco"],
  body: `Six pulses can be heard as **two groups of three** (6/8) or **three groups of two** (3/4). Alternating or superimposing them is **hemiola**.

It's the secret of the flamenco 12-beat compás (soleá: 3+3 | 2+2+2), of much Latin American music (e.g. Venezuelan joropo, Mexican son) and of Baroque cadences.`,
  visual: { type: "rhythm", meter: "12/8", grid: 1, bars: 1, pattern: "ddDddDdDdDdD", accents: [2, 5, 7, 9, 11] },
  see: ["flamenco-compas", "polyrhythm", "odd-meters"]
},

{
  id: "rhythmic-cells", title: "Rhythmic cells (tresillo, habanera, cinquillo)", tags: ["rhythm", "latin"],
  body: `Short, named rhythms that whole styles are built on (in 8ths, one bar of 4/4):
- **Tresillo** (3+3+2): 1, &2, 4 — rock riffs, rumba flamenca, reggaeton, Afro-Cuban music.
- **Habanera**: 1, &2, 3, 4 — tresillo plus beat 3.
- **Cinquillo**: 1, 2, &2, &3, 4 — Cuban danzón.

Learn them by clapping and counting, then strumming with constant motion.`,
  visual: { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pattern: "D--U--D-", accents: [0, 3, 6] },
  see: ["clave", "groupings"]
},

{
  id: "clave", title: "The clave", tags: ["rhythm", "latin", "afro-cuban", "brazilian"],
  body: `**Clave** ('key') is a 2-bar rhythmic pattern that organises Afro-Cuban (and, as the bossa clave, Brazilian) music. Every other part — bass, piano montuno, guitar — is phrased relative to it.
- **Son clave 3-2**: 1, &2, 4 | 2, 3
- **2-3**: bars swapped
- **Rumba clave**: third note delayed to the & of 4
- **Bossa clave**: last note delayed to the & of 3
- **12/8 bell** (bembé): x.x.xx.x.x.x — the 'mother' timeline

Playing 'against' the clave (crossing it) is a real musical error in those styles, so learn to hear which side you're on.`,
  visual: { type: "rhythm", meter: "4/4", grid: 2, bars: 2, pattern: "D--U--D---D-D---" },
  see: ["rhythmic-cells", "bossa-nova"]
},

{
  id: "funk-16ths", title: "Funk 16th strumming (scratch & ghost strums)", tags: ["rhythm", "funk", "styles"],
  body: `### The recipe
1. **Strumming hand**: non-stop 16ths, loose wrist, mostly the top 3–4 strings.
2. **Fretting hand**: rests on a chord shape. **Squeeze** = chord sounds; **release** = dead 'scratch' (chicken scratch).
3. **Small voicings** on the high strings (E9, Em7, A9, D9, E7#9) so you stay out of the bass player's register.
4. **Short notes**: stab and release.

Jimmy Nolen (James Brown) built this sound with straight 16ths and compact high-string chords; Nile Rodgers (Chic) describes a constantly moving 16th-note right hand where the rhythm is chosen by what touches the strings. Learn it at 80–100 bpm, with the click on 2 & 4.`,
  visual: { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pattern: "duDu dUdu duDu dUDu", chord: { root: "E", quality: "9" } },
  see: ["constant-motion", "accents-ghosts"]
},

{
  id: "bossa-nova", title: "Bossa nova & samba guitar", tags: ["styles", "brazilian"],
  body: `### João Gilberto's split
Each chord is split into a **thumb bass** (strings 6/5, on the beat, alternating root and fifth) and **upper voices** plucked together by i-m-a, which carry the syncopation. The thumb is the surdo drum; the fingers are the tamborim/clave.

### Ladder
1. Thumb alone (1 and 3 in 4/4 — or every beat thinking in 2).
2. One-bar pattern: fingers on 1, 2, &3.
3. Two-bar bossa-clave pattern.
4. Over ii–V–I changes, with anticipations.
5. **Samba**: faster, in 2/4 with 16ths, surdo accent on beat 2.
6. **Partido alto**: two-bar 16th figure (e, a, &2 | 1, a, &2).

Bossa is soft and intimate; samba is percussive. Sources notate both in 2/4 or cut time; the app writes them in 4/4 8ths or 2/4 16ths (same sound).`,
  visual: { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pick: "5+4+3+2 - 4+3+2 - 6 4+3+2 - -", chord: { root: "A", quality: "m7" } },
  see: ["partido-alto", "clave", "thumb-independence"]
},

{
  id: "partido-alto", title: "Partido alto", tags: ["styles", "brazilian", "samba"],
  body: `A two-bar samba rhythm (originally a samba sub-genre and pandeiro pattern) felt in 16ths, a little slower than standard samba. Characteristic: the high note on the **2nd 16th** of the figure and a run of offbeats crossing the bar line. It can start on either bar — the song's melody decides.

Guitar: thumb on the beats, fingers on the partido-alto figure. João Bosco is the reference guitarist. Transcriptions differ slightly — compare a couple.`,
  visual: { type: "rhythm", meter: "2/4", grid: 4, bars: 2, pick: "5 4+3+2 - 4+3+2 6 - 4+3+2 - | 5+4+3+2 - - 4+3+2 6 - 4+3+2 -" },
  see: ["bossa-nova", "syncopation"]
},

{
  id: "rasgueado", title: "Rasgueado", tags: ["styles", "flamenco", "technique"],
  body: `Flamenco's strumming technique: fingers flicked out from the palm **one at a time**, each a separate stroke.

### Main types
- **Four-stroke** (c-a-m-i: little, ring, middle, index) — continuous = 16ths or faster. Some teachers start from the index.
- **Three-stroke / triplet** — e.g. a-m-i, or thumb-based.
- **Abanico** ('fan') — a triplet rasgueado driven by **wrist/forearm rotation**; fingerings vary by school (e.g. thumb down, m+a down, index up).
- **Continuous (redondo)** — chained rasgueados for an unbroken roll.
- **Single strokes**: index down/up, thumb down/up.

Rasgueados usually **lead into** an accent of the compás. Evenness and placement matter more than speed.`,
  visual: { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pattern: "RRRR RRRR RRRR RRRR", accents: [0, 4, 8, 12], chord: { root: "E", quality: "maj" } },
  see: ["flamenco-compas", "alzapua"]
},

{
  id: "flamenco-compas", title: "Flamenco compás", tags: ["styles", "flamenco", "meter"],
  body: `**Compás** = the rhythmic cycle of a *palo* (flamenco form).

| Palo | Beats | Accents |
|---|---|---|
| Rumba | 4 | flowing, syncopated; chuck on 2 & 4 |
| Tangos / tientos | 4 (paired) | 2, 3, 4 strong; 1 subdued |
| Soleá | 12 | **3, 6, 8, 10, 12** (3+3+2+2+2) |
| Alegrías / soleá por bulerías | 12 | from 12: 12, 3, 6, 8, 10 |
| Bulerías | 12 (fast) | **12, 3, 6, 8, 10** (start on 12) |
| Seguiriya | 12 → 5 uneven beats | 2+2+3+3+2 |

The 12-beat palos combine a 6/8 half and a 3/4 half (**hemiola**). Teachers stress that the 12-3-6-8-10 map is a simplification — but it's the right starting point. Learn by **counting out loud and clapping (palmas)** before playing.`,
  visual: { type: "rhythm", meter: "12/8", grid: 1, bars: 1, pattern: "ddDddDdDdDdD", accents: [2, 5, 7, 9, 11], chord: { root: "E", quality: "maj" } },
  see: ["hemiola", "rasgueado", "alzapua"]
},

{
  id: "alzapua", title: "Alzapúa", tags: ["styles", "flamenco", "technique"],
  body: `A flamenco **thumb technique**: the thumb plays a single bass note (down), then strums down and back up across 2–3 strings, in quick succession — typically a triplet cell. It gives melodic bass lines a pulsing, syncopated drive; Paco de Lucía used it to raise intensity (e.g. 'Entre dos aguas').

Tips: use the thumb like a pick, rest it on the next string after the downstroke, keep the upstroke light (back of the nail). It's one of the hardest flamenco techniques — build it over weeks.`,
  visual: { type: "rhythm", meter: "4/4", grid: 3, bars: 1, pick: "5 3+2+1 3+2+1 5 3+2+1 3+2+1 5 3+2+1 3+2+1 5 3+2+1 3+2+1", strokes: "D D U D D U D D U D D U" },
  see: ["rasgueado", "flamenco-compas"]
},

{
  id: "skank", title: "The skank (reggae & ska)", tags: ["styles", "reggae", "ska"],
  body: `A **short, choked chord on the offbeat**:
- **Reggae**: on beats 2 and 4 (with the drums' one-drop kick/snare on 3). Often a 'double skank' (two 16ths).
- **Ska**: on every 8th-note '&', faster and brighter, usually upstrokes.

Small voicings on the top strings; the skank is mostly **silence** — release the chord immediately.`,
  visual: { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pattern: "--D.--D.", accents: [2, 6] },
  see: ["accents-ghosts", "constant-motion"]
},

{
  id: "boom-chick", title: "Boom-chick & Carter style", tags: ["styles", "country", "bluegrass"],
  body: `- **Boom-chick**: bass note on 1 and 3 (alternating root and fifth), strum on 2 and 4. With an up-strum: 'boom-chicka'.
- **Train beat**: muted 16ths with backbeat accents (Johnny Cash).
- **Carter style** (thumb brush, church lick, Carter scratch): Maybelle Carter played the **melody on the bass strings with the thumb** and brushed the treble strings with her fingers. Bluegrass rhythm guitar grew out of it.
- **Bluegrass**: boom-chick at speed, locking the strums with the mandolin chop on 2 and 4.`,
  visual: { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pattern: "T-DUT-DU", accents: [0, 4] },
  see: ["travis-picking", "palm-muting"]
},

{
  id: "palm-muting", title: "Palm muting", tags: ["technique", "rock"],
  body: `Rest the outer edge of the picking hand lightly on the strings **right at the bridge saddles**. Too far forward = no pitch (thud); too far back = no mute. Lift the palm for open accents.

Core of rock/metal rhythm (chugs, gallops), country train beats and boogie shuffles.`,
  see: ["alternate-picking"]
},

{
  id: "four-to-the-bar", title: "Four-to-the-bar (Freddie Green)", tags: ["styles", "jazz", "comping"],
  body: `Even quarter-note chords on every beat, locking with the walking bass — the rhythm-guitar foundation of big-band swing. **Freddie Green** (Count Basie, ~1937–1987) is the model.

- **Time first**: an even, relaxed, swinging pulse. Musicians who played with Green describe an *even four*, not heavy 2&4 accents.
- **Short-ish chords**, mostly downstrokes, on the low-middle strings.
- **Small voicings** (3-note shells; Green often used even fewer sounding notes) — stay out of the piano's way.
- Practise with the click on 2 and 4.`,
  visual: { type: "rhythm", meter: "4/4", grid: 1, bars: 1, pattern: "DDDD", chord: { root: "Bb", quality: "7" } },
  see: ["charleston", "click-placement"]
},

{
  id: "charleston", title: "Charleston & comping rhythms", tags: ["styles", "jazz", "comping"],
  body: `Core jazz comping figures (swung 8ths):
- **Charleston**: 1, &2 (dotted quarter + 8th)
- **Reverse Charleston**: &1, 3 — the Charleston displaced by an 8th
- **Anticipations**: chords on the & of 4 (or & of 2) tied into the next beat
- **2 and 4 stabs**, **& of 2 / & of 4** pushes

Good comping mixes these in response to the soloist, leaves space, and keeps chords short.`,
  visual: { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pattern: "D..D....", swing: 0.67 },
  see: ["four-to-the-bar", "displacement", "rhythmic-anticipation"]
},

{
  id: "alternate-picking", title: "Alternate picking", tags: ["technique", "picking"],
  body: `Strict down-up picking, with stroke direction tied to the rhythmic grid (down on the beat/&, up between). Pros: rock-solid rhythm, predictable accents. Cons: string changes after the 'wrong' stroke need a matching **escape motion**.

Key sub-skills: single-string evenness (8ths → 16ths → sextuplets), **inside vs outside** string crossing, string skipping, accented upstrokes, odd groupings (triplets, quintuplets flip direction each beat).`,
  visual: { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pick: "3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3", strokes: "D U D U D U D U D U D U D U D U" },
  see: ["pick-escape", "economy-picking", "tremolo-picking"]
},

{
  id: "pick-escape", title: "Picking motion & escape (Troy Grady)", tags: ["technique", "picking"],
  body: `Troy Grady's **Cracking the Code** research reframes picking around **escape motion**: to change strings, the pick must leave the plane of the strings so it doesn't hit the next one.
- **Upstroke escape (USX)**: upstrokes leave the strings; downstrokes stay 'trapped'. Older name: *downward pickslanting*. Handles lines whose string changes follow upstrokes (e.g. 2 notes per string starting on a down).
- **Downstroke escape (DSX)**: the reverse; older name: *upward pickslanting* (Yngwie's main motion). Pairs naturally with downward sweeps (economy) ascending.
- **Double escape**: both strokes leave the strings — needed for crosspicking and one-note-per-string lines.
- **Two-way pickslanting**: switching between USX and DSX as needed (3nps alternate picking).

Practical advice from this approach: find a motion that feels smooth **at speed** first (short bursts), then build accuracy; choose fingerings that match your escape.`,
  visual: { type: "rhythm", meter: "4/4", grid: 4, bars: 1, pick: "3 3 2 2 3 3 2 2 3 3 2 2 3 3 2 2", strokes: "D U D U D U D U D U D U D U D U" },
  see: ["alternate-picking", "economy-picking", "crosspicking"]
},

{
  id: "economy-picking", title: "Economy picking", tags: ["technique", "picking"],
  body: `Alternate picking on each string, but when changing to the next string in the **same direction the pick is already moving**, continue the stroke (a mini-sweep):
- Ascending 3nps: D U D | **D** U D | **D** U D
- Descending 3nps: U D U | **U** D U | …

Efficient (fewer direction changes) but can **rush** at the sweeps — practise with a click. Frank Gambale's *Speed Picking* is the classic method.`,
  visual: { type: "rhythm", meter: "4/4", grid: 3, bars: 1, pick: "6 6 6 5 5 5 4 4 4 3 3 3", strokes: "D U D D U D D U D D U D" },
  see: ["sweep-picking", "pick-escape"]
},

{
  id: "sweep-picking", title: "Sweep picking", tags: ["technique", "picking"],
  body: `One continuous pick motion across several strings, **one note per string**, like a slow, controlled strum — used for arpeggios.
- **Muting** is everything: only one note may ring (fretting-hand roll + picking-hand palm).
- **Rhythm**: each note on its grid slot (triplets, 16ths, sextuplets), not a rushed rake.
- Turnarounds (changing direction on the top/bottom string) usually use a pull-off/hammer or a direction change.`,
  visual: { type: "rhythm", meter: "4/4", grid: 3, bars: 1, pick: "3 2 1 1 2 3 3 2 1 1 2 3", strokes: "D D D U U U D D D U U U" },
  see: ["economy-picking"]
},

{
  id: "hybrid-picking", title: "Hybrid picking", tags: ["technique", "picking"],
  body: `Pick held between thumb and index; **middle (m), ring (a)** and sometimes pinky pluck additional strings. Enables string skips, pinches and banjo-like rolls without dropping the pick.

Uses: country (chicken pickin', double-stops), jazz (piano-style voicings), rock/fusion (wide-interval lines). In this app's hybrid cards, the finger token \`p\` stands for the pick.`,
  visual: { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pick: "4 2 3 1 4 2 3 1", fingers: "p m p a p m p a" },
  see: ["travis-picking", "alternate-picking"]
},

{
  id: "crosspicking", title: "Crosspicking & rolls", tags: ["technique", "picking", "bluegrass"],
  body: `Cycling across 3 strings, one note per string, usually in a 3-note shape against 8ths — giving a 3+3+2 'roll'. With a flatpick (Tony Rice, Clarence White, Jesse McReynolds) it needs a **double-escape** motion; with fingers it's the banjo **forward roll** (p-i-m).`,
  visual: { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pick: "3 2 1 3 2 1 3 2", strokes: "D U D U D U D U", accents: [0, 3, 6] },
  see: ["pick-escape", "groupings"]
},

{
  id: "tremolo-picking", title: "Tremolo picking", tags: ["technique", "picking"],
  body: `Rapid, continuous alternate picking of one note (or a melody on one string). Keys: loose wrist/forearm, shallow pick depth, no death-grip anchoring, and keeping the subdivision **metric** (16ths, sextuplets) rather than just 'fast'.

Classical guitar 'tremolo' is different: p-a-m-i, a thumb bass note plus three repeated treble notes (Tárrega).`,
  see: ["alternate-picking", "pima"]
},

{
  id: "travis-picking", title: "Travis picking", tags: ["technique", "fingerstyle"],
  body: `Thumb **alternates bass notes on every beat** (e.g. on C: strings 5-4-6-4) while fingers add notes on the &s and melody on top. Named after Merle Travis; developed by Chet Atkins, Doc Watson and many others.

### Learning ladder
1. Thumb alone until automatic (look away, talk).
2. Fingers on the &s ('p m p i').
3. Pinches on 1 and 3 (thumb + finger together).
4. Syncopated melody notes on the &s.
5. Through chord progressions (thumb follows the roots: root on 5 vs 6).
6. With a pick (hybrid).`,
  visual: { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pick: "5 2 4 3 6 2 4 3", fingers: "p m p i p m p i", chord: { root: "C", quality: "maj" } },
  see: ["thumb-independence", "pima", "boom-chick"]
},

{
  id: "thumb-independence", title: "Thumb independence", tags: ["technique", "fingerstyle", "rhythm"],
  body: `In fingerstyle, the thumb is the rhythm section. It must run on **autopilot** while the fingers play syncopations. Typical failure: the thumb drifts toward the fingers' rhythm.

Drills: thumb alone while speaking or reading; thumb quarters + fingers on &s; thumb quarters + syncopated 16th fingers; polyrhythms (3:2, 4:3) between thumb and fingers. Essential for Travis picking, Delta blues, bossa nova and classical.`,
  visual: { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pick: "5 3 5 2 5 3 5 2", fingers: "p i p m p i p m" },
  see: ["travis-picking", "polyrhythm", "bossa-nova"]
},

{
  id: "pima", title: "p-i-m-a (classical right hand)", tags: ["technique", "fingerstyle", "classical"],
  body: `**p** = thumb (pulgar), **i** = index, **m** = middle, **a** = ring (anular); (**c**/**e** = little finger, used in rasgueado).
- Default assignment: p on strings 4–6, i = 3, m = 2, a = 1.
- **Free stroke** (tirando): finger clears the next string — arpeggios.
- **Rest stroke** (apoyando): finger lands on the next string — louder, for melody and flamenco picado.
- Never repeat the same finger on consecutive notes in scales (i-m, m-a alternation).

Giuliani's *120 Right-Hand Studies* is the classic arpeggio method.`,
  visual: { type: "rhythm", meter: "4/4", grid: 2, bars: 1, pick: "5 3 2 1 5 3 2 1", fingers: "p i m a p i m a" },
  see: ["travis-picking", "thumb-independence"]
}

];
