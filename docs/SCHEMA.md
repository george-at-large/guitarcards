# Guitar Cards — Content Schema (the contract)

Every card is produced from a **template** + randomly/adaptively chosen **params**.
Content files live in `content/<domain>.js` and look like:

```js
export const templates = [ /* template objects */ ];
export const concepts  = [ /* glossary/lesson objects */ ];
```

Plain JS object literals only (no functions, no imports). The theory engine computes
all notes, frets, voicings, chord names and audio. **Never hand-write fret numbers or
note lists when the engine can compute them** — that is how we guarantee correctness.

Conventions
- Strings are numbered **1 = high e … 6 = low E** (standard tuning EADGBE, right-handed).
- Fretboard diagrams are drawn tab-style (string 1 on top). Frets 0–15 are in range.
- Intervals are written: `1 b2 2 #2 b3 3 4 #4 b5 5 #5 b6 6 bb7 b7 7 b9 9 #9 11 #11 b13 13`.
- Text fields support mini-markdown: paragraphs, `**bold**`, `*italic*`, `- ` lists,
  `### ` headings, `` `code` ``, and placeholders (see below).

---------------------------------------------------------------------------------------

## 1. Template object

```js
{
  id: "voi-drop2-inversions-1234",   // unique, kebab-case, domain prefix (voi-, scl-, rhy-, har-, ear-, thy-)
  mode: "play",                      // "play" (guitar in hand) | "ear" (headphones) | "theory" (quiz/concept)
  category: "voicings",              // see §2
  tags: ["drop2", "inversions", "maj7"],  // free-form, lowercase; used for search/focus/bias
  title: "Drop 2 inversions: {chord} on strings {stringSet}",
  level: 4,                          // base difficulty 1 (first week) … 10 (lifelong); see §6
  length: "short",                   // "short" (≤1 min) | "medium" (2–4 min) | "long" (5–10 min)
  minutes: 1,                        // rough duration, for timed sessions
  params: { ... },                   // §3 — what varies between instances
  prompt: "Play all four inversions of **{chord}** drop 2 on strings {stringSet}, ascending the neck, one chord per bar.",
  goal: "Clean, no buzz, chord changes on the downbeat.",   // optional success criterion
  tempo: { start: 60, min: 40, max: 160, step: 5, unit: "bpm" },  // optional; adaptive
  metronome: { meter: "4/4", subdivision: 1, swing: 0, accent: true }, // optional; §5
  drone: null,                       // optional; §5
  hints: ["Root position has the root on the lowest string.", "..."],  // help layer 1 (short, progressive)
  explain: "### What is drop 2?\nTake a close voicing ...",          // help layer 2 (markdown)
  visual: { type: "voicings", ... }, // help layer 3: diagrams (§4). Optional but strongly preferred.
  demo:   { type: "voicings", ... }, // "Watch it": animated neck + audio (§4). Usually same as visual.
  concepts: ["drop2", "inversions"], // links into glossary (§7)
  quiz: null,                        // theory/ear interaction (§8); null for play cards
  vary: ["tempo", "key", "stringSet"],  // which params the "same exercise, new twist" follow-up may change
  source: "Ted Greene, Chord Chemistry (1971), ch. 2",   // optional attribution of the idea
}
```

Required: `id, mode, category, title, level, length, prompt` (+ `quiz` for theory/ear objective cards).

---------------------------------------------------------------------------------------

## 2. Categories

| mode   | categories |
|--------|-----------|
| play   | `rhythm` (strumming, subdivisions, time feel, odd meters, displacement) · `picking` (alternate, economy, sweep, hybrid, fingerstyle, Travis, string skipping) · `scales` (positions, CAGED, 3nps, single-string, sequences, modes) · `pentatonic` · `arpeggios` (triads, 7ths, extended, upper structures, inversion arps) · `voicings` (triads, spread triads, drops, shells, quartal, chord scales, voice leading) · `progressions` (comping, passing chords, reharm, song progressions, chord melody) · `improv` (drone/modal soloing, targeting, chord-scale choices) · `fretboard` (note finding, intervals, octaves) · `styles` (funk, bossa, flamenco, blues, reggae, country, rock, jazz comping…) |
| ear    | `ear-intervals` · `ear-chords` · `ear-progressions` · `ear-melody` · `ear-functional` (scale degrees, modes, bass lines) |
| theory | `theory` (use tags to subdivide: `harmony`, `scales`, `voicings`, `heuristics`, `fretboard`, `rhythm`) |

---------------------------------------------------------------------------------------

## 3. Params

`params` maps a name → a pool. The engine picks one value per instance (adaptively).

```js
params: {
  key: "major",                 // special pools: "major" | "minor" | "any" — engine picks a key name with known difficulty
  quality: ["maj7", "7", "m7", "m7b5"],             // plain list
  stringSet: [[4,3,2,1], [5,4,3,2], [6,5,4,3]],      // list of arrays (strings low→high or any order; engine sorts)
  caged: ["C","A","G","E","D"],
  scale: [ { v: "dorian", lvl: 2 }, { v: "lydian-dominant", lvl: 5 } ],  // weighted: lvl adds to template level
  direction: ["ascending", "descending", "up-and-down"],
}
```

- Values may be plain or `{ v, lvl, label }`. `lvl` (0–4) is extra difficulty; `label` is display text.
- Special param **`key`**: `"major"`, `"minor"`, `"any"`, or an explicit list like `["C","G","Bb"]` / `["Am","Em"]`.
  The engine knows key difficulty (C/G/Am/Em easiest … Gb/Db/Ebm hardest) and scales it adaptively.
- Special param **`root`**: same as key but just a note name (no major/minor implication). Pool `"any"` or list.
- Param values are referenced in other fields as `"$name"` (whole value) — e.g. `visual: { root: "$key", stringSet: "$stringSet" }`.

### Placeholders in text (`title`, `prompt`, `goal`, `hints`, `explain`, quiz text)
| placeholder | meaning |
|---|---|
| `{key}` | key name, e.g. "Bb major" / "G minor" |
| `{root}` | root note of the key/root param, e.g. "Bb" |
| `{chord}` | chord symbol built from `root`/`key` + `quality` params, e.g. "Bbmaj7" |
| `{scale}` | display name of the `scale` param with root, e.g. "Bb Lydian dominant" |
| `{scaleNotes}` | spelled notes of that scale, e.g. "Bb C D E F G Ab" |
| `{chordTones}` | spelled chord tones, e.g. "Bb D F A" |
| `{stringSet}` | e.g. "4-3-2-1" |
| `{tempo}` | current tempo, e.g. "72 bpm" |
| `{rn:V7/ii}` | roman numeral resolved in the current key → chord symbol (e.g. in C: "A7"). Format in §4.4 |
| `{p:name}` | display value of any param |
| `{parent:altered}` | for the current root, the parent scale statement, e.g. root G → "Ab melodic minor" |

---------------------------------------------------------------------------------------

## 4. Visual / demo specs (computed by the engine)

`visual` = static diagrams shown when you open help. `demo` = the same thing *performed*:
an animated neck that lights each note in order, plucks it with correct pitch, shows its
interval label, at the card's tempo, loopable. Use the same spec for both unless you want the
demo to be a specific path. `demo` may also be an array of specs played back to back.

Common optional fields on any spec: `labels: "interval" | "note" | "both" | "none"` (default interval),
`title` (caption), `beatsPerNote` / `beatsPerChord` (demo timing, default 1 note per beat / 4 beats per chord).

### 4.1 `scale` — a scale (or arpeggio) in a region
```js
{ type: "scale", root: "$key", scale: "dorian", region: { caged: "E" }, path: "ascending",
  sequence: null }   // optional sequence, §4.6
```
- `scale` ids: see §9. For an arpeggio use `type: "arpeggio"` with `quality` instead of `scale` (§9 chords), or `tones: ["1","3","5","7","9"]`.
- `region` (one of):
  - `{ caged: "C"|"A"|"G"|"E"|"D" }` — CAGED position relative to the root (E: root on 6th string; D: root on 4th; C & A: root on 5th; G: root on 6th, window below).
  - `{ nps3: 1..7 }` — 3-notes-per-string pattern starting on scale degree N on string 6.
  - `{ box: 1..5 }` — pentatonic box N (2 notes per string), box 1 = minor-pentatonic root on string 6.
  - `{ position: N }` — fixed hand position: frets N-1 … N+3.
  - `{ frets: [lo, hi] }` — every scale note in that fret window (all strings).
  - `{ string: n, frets?: [lo,hi] }` — single string (default frets 0–15).
  - `{ strings: [a, b], frets?: [lo,hi] }` — a group of strings along the neck.
  - `{ neck: true }` — whole neck 0–15 (diagram only; demos use a path within it).
  - `{ connect: ["E","D"] }` / `{ connect: [1,2,3] }` — consecutive CAGED shapes or pentatonic boxes, shown together; demo moves through them.
- `path`: `"ascending" | "descending" | "up-and-down"` (default up-and-down), from the lowest note of the region (or root if `fromRoot: true`).
- Region params can be params: `region: { caged: "$caged" }`.

### 4.2 `voicings` — a chord voiced on a string set
```js
{ type: "voicings", root: "$key", quality: "maj7", voicing: "drop2",
  stringSet: "$stringSet", inversion: "all" }
```
- `voicing`: `close` · `spread` (open/spread triad = drop 2 of a triad) · `drop2` · `drop3` · `drop24` (drop 2&4) · `drop23` (drop 2&3) · `drop4` · `shell` (1-3-7 or 1-7-3 type, 3 notes) · `quartal` (stacked 4ths from `tones[0]`) · `custom` (use `order`).
- `quality`: chord id (§9). For chords with >4 tones (9, 13, 7alt…) give `tones` (exactly 3 or 4 intervals) — e.g. `tones: ["3","b7","9","13"]`. Engine default otherwise: omit 5, then root.
- `order` (custom only): bottom→top intervals, e.g. So What chord `["1","4","b7","b3","5"]`.
- `inversion`: `"all"` (every inversion, ascending the neck) · `0`,`1`,`2`,`3` (0 = root in bass, then the next chord tone in stack order …) · or `bass: "3"` (a specific bass tone).
- `stringSet`: array of strings, e.g. `[4,3,2,1]`, `[6,4,3,2]`. Must have one string per note. Common sets:
  close triads `[3,2,1] [4,3,2] [5,4,3] [6,5,4]`; spread triads `[4,2,1] [5,3,2] [6,4,3] [5,4,2]`(engine searches);
  drop2 `[4,3,2,1] [5,4,3,2] [6,5,4,3]`; drop3 `[6,4,3,2] [5,3,2,1]`; drop24 `[6,5,3,2] [5,4,2,1]`; drop23 `[6,5,4,2] [5,4,3,1]`; shells `[6,4,3] [5,4,3]`.
- `"stringSet": "auto"` lets the engine pick every playable standard set.

### 4.3 `chordScale` — a scale harmonized in a voicing, walked up the string set
```js
{ type: "chordScale", root: "$key", scale: "melodic-minor", size: 4,   // 3 = triads, 4 = 7th chords
  voicing: "drop2", stringSet: [4,3,2,1], inversion: 0, path: "ascending" }
```
Engine stacks diatonic thirds on each degree, names each chord (symbol + roman numeral) and
keeps the same voicing/inversion family so it walks up the neck. `size: "quartal"` = diatonic 4ths.

### 4.4 `progression` — chords over time
```js
{ type: "progression", key: "$key", chart: "| ii:m7 V:7 | I:maj7 | % |",
  voicing: "drop2", stringSet: [4,3,2,1], voiceLead: true, beatsPerBar: 4 }
```
- `chart`: bars separated by `|`, chords by spaces (split the bar evenly), `%` = repeat previous bar.
- Chord token: `<roman>:<quality>` — roman `I..VII` with optional `b`/`#` prefix (case ignored; quality is explicit),
  e.g. `ii:m7`, `bVII:7`, `#iv:m7b5`, `bII:7`, secondary: `V/ii:7` (= dominant of ii), `ii/V:m7`.
  Slash bass: `I:maj/3` (3rd in bass). Absolute chords allowed when `key` is absent: `C:maj7`.
- `voicing`/`stringSet` optional; with `voiceLead: true` the engine chooses inversions with smallest movement
  (Goodrick/Greene style). Without, it shows a compact voicing per chord.
- `walk`: optional `"arpeggio"` → demo arpeggiates each chord instead of strumming.
- `scales`: optional map for the demo/diagram of a chord-scale per chord, e.g.
  `scales: { "V:7": "altered", "ii:m7": "dorian", "I:maj7": "lydian" }` (keys match chord tokens) — for "move between modes over the progression" cards.

### 4.5 `rhythm` — strum / picking patterns on a grid
```js
{ type: "rhythm", meter: "4/4", grid: 4, bars: 1,      // grid = slots per beat: 2=8ths, 3=triplets, 4=16ths, 6=sextuplets
  pattern: "D-DU-UDU", accents: [0, 4], swing: 0,
  chord: { root: "$key", quality: "min" } }          // optional: what is held while strumming
```
Strum tokens (one char per slot): `D` down strum · `U` up strum · `d`/`u` muted (scratch/ghost) strum ·
`X` percussive chuck/slap · `-` hand moves, no contact (silent) · `.` rest · `R` rasgueado flick (flamenco) · `T` thumb (bass note).
Picking form (instead of `pattern`): `pick: "6 3 2 3 | 5 3 2 3"` — one token per slot = string number,
`2+1` = pinch, `-` = rest; optional `strokes: "DUDU DUDU"` (pick direction) or `fingers: "p i m i"`; optional `chord`/`frets` held.
Spaces and `|` in patterns are ignored (readability). Patterns longer than one bar span multiple bars.
Demo plays it as audio (strums use the held chord) with a moving cursor.

### 4.6 `sequence` (inside `scale` specs)
```js
sequence: { kind: "intervals", step: 3 }   // diatonic 3rds: 1-3, 2-4, 3-5 …   (step 4 = 4ths, 6 = 6ths …)
sequence: { kind: "groups", size: 4 }      // 1234 2345 3456 …
sequence: { kind: "triads" }               // 135 246 357 …   ("sevenths" = 1357 2461 …)
sequence: { kind: "pattern", degrees: [1,3,2,4] }   // custom cell moved up the scale
```
Options: `direction`, `alternate: true` (alternate up/down cells, e.g. 1-3 then 4-2).

### 4.7 `fretboard` — arbitrary highlighted notes
```js
{ type: "fretboard", root: "$root", tones: ["1","3","5"], region: { frets: [0, 12] } }
{ type: "fretboard", notes: ["C"], region: { string: 5 } }
```

### 4.7b `chordMelody` — a melody harmonized with the melody note on top
```js
{ type: "chordMelody", key: "$key", scale: "major",
  melody: "3 2 1 2 | 3 3 3- | 2 2 2- | 3 5 5- |",      // melody tokens as in §8.3 (bars by |)
  chart:  "| I:maj | V:7 | V:7 | I:maj |",               // one chart bar per melody bar
  style: "drop2-top" }     // "triad-top" | "drop2-top" | "drop3-top" | "shell-under" | "melody-only"
```
Engine voices each chord so the melody note sounding at the chord change is the TOP voice
(melody on strings 1–2 where possible); notes between changes are played as single notes.
Use for the "here's one way of doing it" reveal of chord-melody exercises (several demos = several ways).
Melodies must follow the copyright rule in §8.3 (public-domain tunes or original melodies only).

### 4.8 `text` — no diagram; just a big formatted panel (e.g. formulas, a table)
```js
{ type: "text", body: "| Chord | Scale |\n|---|---|\n| ..." }   // simple pipe tables allowed
```

---------------------------------------------------------------------------------------

## 5. Metronome & drone

```js
metronome: { meter: "4/4", subdivision: 1, swing: 0, accent: true,
             gap: { play: 2, mute: 2 },       // optional "gap click": 2 bars on, 2 bars silent
             clickOn: "all" }                  // "all" | "2&4" | "1" (downbeat only)
drone: { note: "$key", fifth: true }           // or drone: { note: "D" } ; null/absent = no drone
```
meters: `2/4 3/4 4/4 5/4 6/8 7/8 9/8 12/8 7/4`. `subdivision`: 1,2,3,4,6. `swing` 0…0.67 (0.33 ≈ light, 0.67 = triplet swing).
The user toggles metronome/drone globally; these specs set the defaults when present.

---------------------------------------------------------------------------------------

## 6. Levels (base difficulty)

1–2 beginner · 3–4 solid intermediate · 5–6 advanced intermediate · 7–8 advanced · 9–10 master.
The user already knows CAGED, pentatonic boxes, the 7 major-mode boxes and diatonic movement up the neck;
is shaky on melodic/harmonic minor across the whole neck, 16ths/triplets, drop voicings, spread triads.
Author at all levels anyway — the adaptive engine places them.
Final difficulty = template level + param `lvl`s + key difficulty + tempo position.

---------------------------------------------------------------------------------------

## 7. Concepts (glossary / mini-lessons)

```js
export const concepts = [
  { id: "drop2", title: "Drop 2 voicings", tags: ["voicings"],
    body: "markdown lesson …",
    visual: { type: "voicings", root: "C", quality: "maj7", voicing: "drop2", stringSet: [4,3,2,1], inversion: "all" },
    see: ["drop3", "inversions"] },
];
```
Concept ids are global (prefix not required, but don't collide: check other domains' lists in §10).
Write concepts as if explaining to a strong intermediate player. These power the "I'm not clear on this" button.

---------------------------------------------------------------------------------------

## 8. Quiz (objective cards: ear + theory)

Objective cards are auto-scored — no self-rating needed. Set `quiz`:

### 8.1 Generated theory quizzes (engine computes question + answer)
```js
quiz: { kind: "note-on-fret", strings: [5,6], frets: [0, 12] }            // "What note is string 5, fret 7?"
quiz: { kind: "find-note", region: { string: 3 } }                         // tap every C on string 3
quiz: { kind: "interval-shape", intervals: ["3","b3","5","b7","7"] }       // two dots shown → name interval
quiz: { kind: "chord-spelling", qualities: ["m7b5","7#9"] }                // spell {chord} → tap notes
quiz: { kind: "scale-spelling", scales: ["melodic-minor","altered"] }      // spell {scale}
quiz: { kind: "diatonic-chord", scales: ["major","melodic-minor"], size: 4 } // "iii7 in A major?" → chord name
quiz: { kind: "roman", tokens: ["V/ii:7","bVII:7","ii/V:m7"] }             // "In Eb, V7/ii is?" 
quiz: { kind: "parent-scale", modes: ["altered","lydian-dominant","locrian-nat2"] } // "G altered = which melodic minor?"
quiz: { kind: "mode-of", scales: ["major","melodic-minor","harmonic-minor"] }      // "D–D in C major = ?"
quiz: { kind: "chord-scale-choice", map: "toolbox" }                       // "Over A7alt, which scale?" (uses toolbox data, §10)
```
### 8.2 Static quizzes (author writes the answer; no key-dependent content unless via placeholders)
```js
quiz: { kind: "choice", question: "Drop 2 is formed by…", choices: ["…","…","…","…"], answer: 1, explain: "…" }
quiz: { kind: "reveal", question: "Name the chord tones of {rn:V:7alt} …", answer: "…" }   // think, then reveal (self-rated)
```
### 8.3 Ear quizzes (engine synthesizes audio)
```js
quiz: { kind: "ear-interval", intervals: ["3","b3","4","5"], direction: "up" }   // up | down | harmonic | mixed
quiz: { kind: "ear-chord", qualities: ["maj","min","dim","aug"], voicing: "close", inversions: false, arpeggiate: false }
quiz: { kind: "ear-chord", qualities: ["maj7","7","m7"], tones: null, inversions: true }
quiz: { kind: "ear-inversion", quality: "maj", voicing: "close" }               // which inversion?
quiz: { kind: "ear-progression", options: [ { chart: "| I | IV | V | I |", name: "I–IV–V–I" }, … ], tempo: [60,120] }
quiz: { kind: "ear-degree", degrees: ["1","3","5"], scale: "major", cadence: true }   // cadence then a note → degree
quiz: { kind: "ear-mode", scales: ["ionian","dorian","mixolydian"], playback: "scale" | "drone-melody" }
quiz: { kind: "ear-melody", scale: "major", length: 4, range: ["1","5"], cadence: true }   // tap degrees in order
quiz: { kind: "ear-bass", chart: "| I | vi | IV | V |", ask: "bass-degrees" }
quiz: { kind: "audiate", melody: "1 2 3 5 | 3-", scale: "major", show: "neck" }  // see below
quiz: { kind: "audiate", melody: null, length: 5, range: ["1","5"], scale: "major", show: "degrees" }  // random melody
```
`audiate` (sing-in-your-head, no guitar needed): engine plays the starting note (and optionally a
cadence), then SILENTLY animates the melody on a virtual neck (`show: "neck"`) or as scale degrees
(`show: "degrees"`) or note names (`show: "notes"`). The user sings it in their head, then taps
Reveal to hear it and self-rates. `melody: null` = engine generates a random diatonic melody of
`length` notes within `range` (add `leaps: true` for larger intervals). Use `mode: "ear"`, category `ear-melody`.
```js
```
Song references (lessons, not quizzes — `mode: "ear"`, `category: "ear-intervals"` or `"ear-melody"`):
```js
quiz: { kind: "listen", melody: "1 5 6 5 | 1' 7 ...", tempo: 90, explain: "…" }
```
- `melody` tokens: scale degree (`1..7`, with `b`/`#`), `'` = octave up, `,` = octave down, `-` = hold one more beat,
  `.` = rest, `_` suffix = half-beat (e.g. `3_ 4_`). Scale context via `scale`.
- **Copyright rule:** full melodies ONLY for public-domain / traditional tunes (Ode to Joy, Greensleeves,
  Amazing Grace, Twinkle Twinkle, Frère Jacques, Scarborough Fair, When the Saints, Auld Lang Syne, Happy Birthday,
  Swing Low, House of the Rising Sun (trad.), Danny Boy (trad.), etc.). For copyrighted songs (Over the Rainbow,
  Star Wars, Jaws, My Favorite Things …) reference only the **first interval (2 notes)** by name — never more
  of the melody, and never lyrics. Chord progressions of any song are fine to describe.

---------------------------------------------------------------------------------------

## 9. Engine vocabulary

**Scales** (`scale` ids):
- major modes: `ionian` (alias `major`), `dorian`, `phrygian`, `lydian`, `mixolydian`, `aeolian` (alias `natural-minor`), `locrian`
- melodic minor modes: `melodic-minor`, `dorian-b2`, `lydian-augmented`, `lydian-dominant`, `mixolydian-b6`, `locrian-nat2`, `altered`
- harmonic minor modes: `harmonic-minor`, `locrian-nat6`, `ionian-sharp5`, `dorian-sharp4`, `phrygian-dominant`, `lydian-sharp2`, `altered-dim`
- harmonic major: `harmonic-major`; double harmonic: `double-harmonic`
- pentatonic/blues: `major-pentatonic`, `minor-pentatonic`, `blues` (minor blues, 6 notes), `major-blues`, `dominant-pentatonic` (1 2 3 5 b7), `minor6-pentatonic` (1 b3 4 5 6), `in-sen`, `hirajoshi`
- symmetric: `whole-tone`, `diminished-hw` (half-whole, dominant), `diminished-wh` (whole-half), `augmented` (1 b3 3 5 #5 7), `chromatic`
- bebop: `bebop-dominant`, `bebop-major`, `bebop-dorian`, `bebop-melodic-minor`
- other: `spanish-phrygian` (alias of phrygian-dominant), `gypsy-minor` (alias double-harmonic minor: 1 2 b3 #4 5 b6 7)

**Chord qualities** (`quality` ids → formula):
`maj` 1 3 5 · `min` 1 b3 5 · `dim` 1 b3 b5 · `aug` 1 3 #5 · `sus2` 1 2 5 · `sus4` 1 4 5 · `5` 1 5 ·
`maj7` 1 3 5 7 · `7` 1 3 5 b7 · `m7` 1 b3 5 b7 · `m7b5` 1 b3 b5 b7 · `dim7` 1 b3 b5 bb7 · `mMaj7` 1 b3 5 7 ·
`maj7#5` 1 3 #5 7 · `7#5` 1 3 #5 b7 · `7b5` 1 3 b5 b7 · `7sus4` 1 4 5 b7 · `6` 1 3 5 6 · `m6` 1 b3 5 6 ·
`add9` 1 3 5 9 · `madd9` 1 b3 5 9 · `6/9` 1 3 5 6 9 · `m6/9` 1 b3 5 6 9 ·
`maj9` 1 3 5 7 9 · `9` 1 3 5 b7 9 · `m9` 1 b3 5 b7 9 · `mMaj9` · `11` 1 5 b7 9 11 · `m11` 1 b3 5 b7 9 11 ·
`maj7#11` 1 3 5 7 #11 · `maj9#11` · `13` 1 3 5 b7 9 13 · `m13` · `maj13` · `9sus4` 1 4 5 b7 9 · `13sus4` ·
`7b9` 1 3 5 b7 b9 · `7#9` 1 3 5 b7 #9 · `7#11` 1 3 5 b7 9 #11 · `7b13` 1 3 5 b7 b13 · `7b9b13` · `7#9b13` · `7#9#5` ·
`13b9` 1 3 b7 b9 13 · `13#11` · `7alt` 1 3 b7 b9 #9 #11 b13 (always give `tones` for voicings) · `dim-maj7` 1 b3 b5 7 · `m7#5`.

**Keys**: major `C G D A E B F# F Bb Eb Ab Db Gb` · minor `Am Em Bm F#m C#m G#m Dm Gm Cm Fm Bbm Ebm`.

---------------------------------------------------------------------------------------

## 10. Domain ownership (to avoid duplicates)

| file | owns | id prefix |
|---|---|---|
| `content/voicings.js` | triads (close/spread), inversions, drop 2/3/2&4/2&3/4, shells, quartal, chord scales (Greene), voice-leading cycles (Goodrick/Miller Almanac), upper structures as voicings, chord-melody voicing basics; theory cards about voicings | `voi-` |
| `content/scales.js` | scale positions, CAGED, 3nps, pentatonic boxes & connecting, all modes of major/mel-min/harm-min/harm-major, symmetric & bebop, single-string/Goodrick "unitar", sequences (3rds/4ths/6ths/groups/triads/contrary motion), arpeggios incl. extended & inversion arpeggios, Martino (minor conversion, geometry), fretboard knowledge drills; theory cards about scales/fretboard | `scl-` |
| `content/rhythm.js` | subdivisions (8ths, triplets, 16ths, sextuplets, quintuplets), strumming patterns beginner→advanced, swing/shuffle, displacement, odd meters, polyrhythms, gap-click, alternate/economy/sweep/hybrid picking, fingerstyle (Travis, arpeggio patterns, classical p-i-m-a), plectrum technique, and styles: funk, bossa nova, samba, flamenco (rasgueado, compás: rumba, tangos, soleá, bulerías basics), reggae/ska, blues shuffle, country/bluegrass, rock, jazz comping (Freddie Green, Charleston) | `rhy-` |
| `content/harmony.js` | progressions (diatonic, ii-V-I major/minor, blues forms, rhythm changes, Coltrane changes), passing chords (diminished, chromatic, tritone subs, backdoor), modulation & major↔minor, song progressions (described, not lyrics), comping exercises, chord melody exercises, improvisation over drone / modal / over changes, the **toolbox** heuristics ("over chord X you can play …", e.g. altered = melodic minor ½ step up; pentatonic substitutions), theory cards on harmony | `har-` |
| `content/ear.js` | all `mode: "ear"` cards: intervals, chord qualities (triads → upper structures), inversions, progressions, functional degrees, modes, melodic dictation, bass lines, song references | `ear-` |

`content/harmony.js` additionally exports `toolbox`:
```js
export const toolbox = [
  { chord: "7alt", label: "Altered dominant", options: [
      { scale: "altered", relation: "melodic minor a half step above the root", why: "…", lvl: 5 },
      { scale: "minor-pentatonic", from: "b3", why: "e.g. over G7alt play Bb minor pentatonic → b3 4 5 b7 1 …", lvl: 4 } ] },
];
```
`from` = interval above the chord root where the option scale is rooted. Used for the browsable "toolbox"
reference and the `chord-scale-choice` quiz.

---------------------------------------------------------------------------------------

## 4.9 `compare` — hear the difference between choices over the same progression
```js
{ type: "compare", key: "$key", chart: "| ii:m7 | V:7 | I:maj7 | I:maj7 |", target: "V:7",
  options: [ { scale: "mixolydian", label: "Mixolydian — inside, consonant" },
             { scale: "altered", label: "Altered — maximum tension → resolution" },
             { scale: "diminished-hw", label: "Half-whole — symmetric, b9 #9 13" } ],
  // or substitute chords instead of scales:
  // options: [ { token: "V:7" , label: "Plain V7" }, { token: "bII:7", label: "Tritone sub" } ]
  explain: "markdown on what to listen for" }
```
Demo plays the chart once per option; over the `target` chord the engine plays a run of that option's
scale (or swaps the chord for `token`), so the user hears A vs B vs C. The user can then play it themselves.

## 11. Analyses (read-only annotated pieces) — `content/analyses.js`

```js
export const analyses = [
  { id: "ana-autumn-leaves", title: "Autumn Leaves (A section)", artist: "Joseph Kosma (jazz standard)",
    genre: "jazz", level: 3, key: "Gm", tempo: 120, meter: "4/4", tags: ["ii-v-i", "relative-major"],
    strum: "D-D-D-D-",          // optional playback rhythm per bar, §4.5 tokens on an 8th grid (default: whole-bar hits)
    summary: "markdown overview: what makes this progression work",
    sections: [
      { name: "A", chart: "| iv:m7 | bVII:7 | bIII:maj7 | bVI:maj7 | ii:m7b5 | V:7 | i:m7 | % |",
        notes: [   // bar-by-bar annotations; bar is 1-based within the section, chord = index within bar (default 0)
          { bar: 1, text: "ii–V–I in the relative major (Bb) begins: Cm7 is ii of Bb …", concepts: ["ii-v-i", "relative-major"] },
          { bar: 5, text: "…and now the minor ii–V–I back to G minor.", concepts: ["minor-ii-v-i"] } ],
        subs: [    // the "menu": what else could go here, by function
          { bar: 6, options: [
              { token: "bII:7", label: "Tritone sub (Ab7)", why: "shares the tritone C–F#…", concepts: ["tritone-sub"] },
              { token: "V:7alt", label: "Altered V", why: "…", concepts: ["altered-scale"] } ] } ] } ],
    compare: [ /* optional §4.9 compare specs tied to this piece */ ],
    source: "where the chord chart was verified" }
];
```
Rules: chord charts only — NEVER lyrics or melody of copyrighted songs. Only include progressions you
have verified (state the source); prefer well-documented charts. `concepts` must reference concept ids
that exist (any domain's `concepts`) — list new ones you need in your own `concepts` export.
The app ALSO generates a generic substitution menu for any chord by function (tritone sub, relative ii,
backdoor, modal interchange, diatonic substitutes, secondary dominants, passing diminished), so curated
`subs` should focus on the musically interesting, piece-specific choices.
