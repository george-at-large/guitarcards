# Voicings domain: research notes, curriculum, engine requests

Deliverable: `content/voicings.js` has 112 templates and 28 concepts, all with the `voi-` prefix. It parses with `node -e "import(...)"` and all ids are unique.

| | count |
|---|---|
| templates | 112 (90 play, 22 theory) |
| lengths | 54 short, 46 medium, 12 long |
| base levels | L1: 2 · L2: 5 · L3: 10 · L4: 11 · L5: 20 · L6: 27 · L7: 22 · L8: 8 · L9: 6 · L10: 1 (param `lvl`s and key difficulty push many cards higher) |
| concepts | 28 mini-lessons, each with a `visual` |

The file was generated from a small authoring script (helpers for shared param pools), then written out as plain JSON-style object literals. It contains no functions, imports or shared consts. Every `$param` reference, `{p:…}` placeholder, concept link, quality id, voicing type, scale id and chart token was machine-checked against SCHEMA.md before writing.

---------------------------------------------------------------------------------------

## 1. How the theory was checked

Correctness came first, so every claim the cards make was recomputed with a script rather than written from memory:

1. **Drop formulas.** Each drop family was generated from close position (drop the Nth voice from the top an octave) for all four inversions.

   | family | root | 1st | 2nd | 3rd | top notes |
   |---|---|---|---|---|---|
   | close | 1-3-5-7 | 3-5-7-1 | 5-7-1-3 | 7-1-3-5 | 7 1 3 5 |
   | drop 2 | 1-5-7-3 | 3-7-1-5 | 5-1-3-7 | 7-3-5-1 | 3 5 7 1 |
   | drop 3 | 1-7-3-5 | 3-1-5-7 | 5-3-7-1 | 7-5-1-3 | 5 7 1 3 |
   | drop 2&4 | 1-5-3-7 | 3-7-5-1 | 5-1-7-3 | 7-3-1-5 | 7 1 3 5 |
   | drop 2&3 | 1-3-7-5 | 3-5-1-7 | 5-7-3-1 | 7-1-5-3 | 5 7 1 3 |
   | drop 4 | 1-3-5-7 (bass 8va down) | 3-5-7-1 | 5-7-1-3 | 7-1-3-5 | 7 1 3 5 |
   | spread triad | 1-5-3 | 3-1-5 | 5-3-1 | – | 3 5 1 |
   | close triad | 1-3-5 | 3-5-1 | 5-1-3 | – | 5 1 3 |

2. **Playability.** A fret-search script (standard tuning, frets 0–15, all 12 roots) found the worst-case fret span of every voicing on every candidate string set. Results that shaped the content:
   - Drop 2 (4-3-2-1, 5-4-3-2, 6-5-4-3), drop 3 (6-4-3-2, 5-3-2-1), drop 2&4 (6-5-3-2, 5-4-2-1) and drop 2&3 (6-5-4-2, 5-4-3-1) are all playable within a 4-fret span for maj7, 7, m7, m7b5, dim7, mMaj7, 6, m6 and maj7#5.
   - **Drop 4 only fits 6-3-2-1.** No other 4-string set works, so drop-4 cards hard-code that set.
   - **Spread triads:** comfortable on 6-4-3, 4-2-1, 6-5-3 and 5-4-2. Root position on **5-3-2** needs a 5-fret stretch for most roots, so 5-3-2 is left out of the spread pools and noted in the concept.
   - Close 7th chords on 4-3-2-1 are mostly unplayable, which is the reason drop voicings exist (said in the `close-voicing` concept).
   - Custom orders used in the cards were all checked at span ≤ 3, apart from a few at 4. They include the shells (1-7-3 on 6-4-3, 1-3-7 on 5-4-3), shell + tension (1-3-b7-9/b9/#9 on 5-4-3-2, 1-b7-3-13 on 6-4-3-2), rootless forms (b7-3-13-9 on 4-3-2-1, 3-b7-9-13 and 3-b7-#9-b13 on 5-4-3-2, etc.), the So What chord (span 0 on 6-5-4-3-2, because the open strings E-A-D-G-B *are* Em11 So What), quartal stacks, and the upper structures (b7-3-13-9-#11 on 6-5-4-3-2 is span 1, and the 3-b7 + triad family on 6-5-4-3-2 is span 1–3).
3. **Upper-structure spellings**, computed over C7:
   - D = 9 #11 13
   - E♭ = #9 5 b7
   - F♯ = #11 b7 b9
   - A♭ = b13 1 #9
   - A = 13 b9 3
   - B♭ = b7 9 11
   - D♭ = b9 11 b13 (rejected: the 11 clashes with the 3)
   - E = 3 #5 7 (rejected: it's maj7#5)
   - Em = 3 5 7 (rejected: plain maj7 tones)

   Over maj7: G = 5 7 9, Bm = 7 9 #11, D = 9 #11 13, E = 3 #5 7.
   - E♭/C7 keeps the natural 5, so it belongs to the **half-whole diminished** scale (C D♭ E♭ E F♯ G A B♭, whose major triads sit on 1, b3, #4 and 6), *not* the altered scale. The cards say so.
4. **Diatonic 7ths and triads** of major, melodic minor, harmonic minor and harmonic major, computed by stacking 3rds:
   - major: maj7 m7 m7 maj7 7 m7 m7b5
   - melodic minor: mMaj7 m7 maj7#5 7 7 m7b5 m7b5 (triads: min min aug maj maj dim dim)
   - harmonic minor: mMaj7 m7b5 maj7#5 m7 7 maj7 dim7 (triads: min dim aug min maj maj dim)
   - harmonic major: maj7 m7b5 m7 mMaj7 7 maj7#5 dim7 (triads: maj dim min min maj aug dim)
   - Diatonic 4ths: a major scale has one augmented 4th (4→7). Melodic minor, harmonic minor and harmonic major each have **two** augmented 4ths and **one diminished 4th**.
5. **Voice-leading cycles.** Smallest-motion bijections between consecutive diatonic chords were worked out by hand and cross-checked:

   | cycle (roots up a diatonic…) | 7th chords: common / motion / tone map | inversion path | triads |
   |---|---|---|---|
   | 2 (2nd) | 1 common, 3 voices **down** · 1→7 3→1 5→3 7→5 | root→3rd→2nd→1st | 0 common, parallel |
   | 7 (7th = down a 2nd) | 1 common, 3 **up** · 1→3 3→5 5→7 7→1 | root→1st→2nd→3rd | 0 common, parallel |
   | 3 (3rd) | 3 common, 1 voice **up** · 1→7… | root→3rd→2nd→1st | 2 common, 1 voice **down** |
   | 6 (6th = down a 3rd) | 3 common, 1 **down** · 1→3… | root→1st→2nd→3rd | 2 common, 1 **up** |
   | 4 (4th) | 2 common, 2 **down** · 1→5 3→7 5→1 7→3 | root↔2nd, 1st↔3rd | 1 common, 2 **up** |
   | 5 (5th) | 2 common, 2 **up** · same map | root↔2nd, 1st↔3rd | 1 common, 2 **down** |

   - For 7th chords the even cycles move the voices down and the odd cycles move them up. For triads the direction is reversed. This agrees with one reply in the jazzguitar.be Almanac thread ("cycle 2, 4 and 6 descending; 7, 5 and 3 ascending"). Another post in that thread contradicts it, which is why I derived it independently.
   - One lap is 7 changes. Cycles 4/5 return to the starting inversion after **2 laps**, cycles 2/3/6/7 after **4 laps**, and triad cycles 3/4/5/6 after 3 laps.
   - The common-tone counts come from stacking 3rds, so they hold in all four modalities. In harmonic minor and harmonic major a "step" can be an augmented 2nd (b6↔7).
   - Dominant cycle (C7→F7, chromatic rather than diatonic): **one** common tone, three voices fall (3 and b7 by a half step, 5 by a whole step), inversions still pair root↔2nd.
6. **Relatives.**
   - 6 = m7 a minor 3rd down (C6 = Am7). m6 = m7b5 a minor 3rd down (Cm6 = Am7b5).
   - Rootless 9 (3 5 b7 9) = m7b5 on the 3rd = m6 on the 5th (C9 → Em7b5 = Gm6). This is the voicing side of Martino's minor conversion.
   - Rootless maj9 = m7 on the 3rd. Rootless m9 = maj7 on the b3.
   - Bdim7 = rootless G7b9 (also B♭, D♭, E 7b9).
   - Lowering any note of a dim7 a half step gives a dominant 7 on that note (Cdim7 → B7, D7, F7, A♭7).
   - There are 4 augmented triads and 3 dim7 chords.
7. **V-System mapping.** V-1 = close, V-2 = drop 2, V-3 = drop 2&3 (drop the alto of V-2 again), V-4 = drop 3 (V-2 with bass and alto swapped, soprano unchanged). The last two were checked on note lists: from 1-5-7-3, dropping the alto gives 7-1-5-3 (drop 2&3) and swapping bass/alto gives 7-5-1-3 (drop 3). Raising the alto of drop 2 gives drop 2&4 (1-5-7-3 → 1-5-3-7).

---------------------------------------------------------------------------------------

## 2. Sources

Read or consulted directly:
- **Ted Greene / James Hober, V-System** on tedgreene.com:
  - index: https://tedgreene.com/teaching/v_system.asp
  - "V-System Introduction": https://tedgreene.com/images/lessons/v_system/02_V-System_Introduction.pdf
  - "Method 1 – How to Recognize": https://tedgreene.com/images/lessons/v_system/03_Method1_HowToRecognize.pdf
  - "Conversion" / "V-System Conversion Methods 1989 & 2003": https://tedgreene.com/images/lessons/v_system/20_Conversion_.pdf
  - "The Fixed Soprano Tour" (V-2→V-4 by swapping bass and alto, V-3→V-4 by raising the tenor)

  Key points: 14 groups classified by spacing, not string set. Hober cautions that his write-up is his interpretation of Greene's notes.
- **Goodrick & Miller, *Mr. Goodchord's Almanac of Guitar Voice-Leading for the Year 2001 and Beyond*** (Mr. Goodchord Publications). The book itself wasn't available, so I relied on forum discussion: the jazzguitar.be thread "anybody use goodchord voice leading books" and the hubguitar.com "voice leading cycles" page. The cycle numbering (cycle N = diatonic root motion up an Nth) and the common-tone facts (1 for cycle 2, 2 for cycle 4) are confirmed there. The voice-motion directions were derived (see §1.5) because the forum posts disagree. A 2004 *Keyboard* magazine excerpt reprinted from the Almanac shows cycles 2, 4 and 6 on a C melodic minor quartal voicing. That is the basis for the quartal-cycle wording; I only saw it via search snippets.
- **Goodrick & Miller, *Creative Chordal Harmony for Guitar: Using Generic Modality Compression*** (Berklee Press, 2012): the four seven-note modalities (major, melodic minor, harmonic minor, harmonic major) treated as one family. **To verify:** I'm confident about the four-modality framing but not about the book's internal terminology. The cards only state the four-modality idea.
- **Mick Goodrick, *The Advancing Guitarist*** (Hal Leonard, 1987): triads in every inversion on every string set, and learning one string set completely at a time.
- **Ted Greene, *Chord Chemistry*** (Dale Zdenek, 1971): chord-quality changes by moving one voice, voicing families, relative chords. **Ted Greene, *Modern Chord Progressions*** (1976): voice-led progressions (background; no card claims anything specific from it). Greene's harmonized-scale lesson sheets on tedgreene.com are the model for the chord-scale cards.
- **Upper structures:** jazz-guitar-licks.com "Upper Structure Triads for Guitar"; Jason Lyon's handout (bIII, #IV and VI triads for 7b9; #IV and bVI for 7alt); Mark Levine, *The Jazz Theory Book* (Sher, 1995) for the general UST approach. All spellings were recomputed (§1.3). The Lyon table agrees: bIII, #IV and VI all come from half-whole diminished.
- **Jens Larsen** (jenslarsen.nl / YouTube): drop 2 and drop 3 lessons, spread-triad lessons. Used as a pedagogical reference for the drop 2 → drop 3 order and for presenting spread triads to guitarists, not for specific claims.
- **Barry Galbraith, *Guitar Comping***: drop 2 / drop 3 voice-led comping (attribution only).
- **Pat Martino, *Linear Expressions*** (1983): minor conversion. The card only says "think the minor chord a 5th above a dominant", and the voicing equivalence is computed.
- Historical facts used: the So What voicing (Bill Evans on Miles Davis, *So What*, 1959), McCoy Tyner quartal comping, Freddie Green three-note shells, and *Maiden Voyage* as the 9sus4 sound. All are general knowledge, and no melodies or lyrics are reproduced.

---------------------------------------------------------------------------------------

## 3. Curriculum ladder (what comes before what)

Arrows mean "learn this first". Base levels are shown. The adaptive engine adds param `lvl`s: lower string sets, rarer qualities (m7b5, dim7, mMaj7, maj7#5), the 2nd and 3rd inversions, and the minor modalities.

```
L1  Close triad shapes (maj/min, any inversion, one set)      Shell shapes (1-3-7 / 1-7-3)
       │                                                         │
L2  Triad inversions up one set · I–IV–V nearest-voicing      Shells ii–V–I · why shells drop the 5th
       │                                                         │
L3  Triad quality morph, dim/aug, sus · I–vi–ii–V · major      Guide-tone lines · dominant shell cycle
    triad chord scale · DROP 2 intro (build, single shapes)
       │
L4  Drop 2 inversions up the neck · drop 2 quality morph · voice-led triads in 12 keys
    Spread-triad shapes · Drop 3 intro · harmonizing a melody with triads · formula/symmetry quizzes
       │
L5  Drop 2: ii–V–I, turnarounds, top-note, 6/m6, dim7, line cliché, inversion arpeggios
    Drop 3: inversions, ii–V–I · spread inversions · major drop 2 chord scale
    Triad chord scales in the minor modalities · triad neck map (long) · quartal stacks · bVII sus UST
       │
L6  Melodic-minor drop 2 chord scale · drop 3 chord scale · Almanac cycles 4/5 · triad cycles
    Drop 2 mMaj7/maj7#5 · minor ii–V–i · dominant cycle voice-led · 12 keys fixed inversion
    Rootless 9ths + relatives (Martino) · So What · quartal chord scales · UST II and bIII
    Drop 2 ↔ drop 3 same melody · chord melody with drop 2 · spread progressions/chord scales
       │
L7  Harmonic-minor chord scale · cycles 2/7 and 3/6 · rootless 13/alt and rootless ii–V–I
    USTs bVI, VI, bV, Lydian maj · drop 2&4 shapes · neck maps (drop 2, drop 3, spread; long)
    Chord-scale marathon (long) · drop 3 bass+melody · modal quartal comping (long)
       │
L8  Harmonic-major chord scale · drop 3 minor-modality chord scales · minor-modality cycles
    Drop 2&3, drop 4 · drop 2&4 ii–V–I · Greene quality grid (long) · UST tour over a held tritone (long)
       │
L9  Four modalities back to back (long) · every drop family on one chord (long)
    V-System conversions · drop 2&4 chord scales · harmonic-major cycles · UST ii–V–I
       │
L10 Almanac marathon: any cycle × drop 2/3/2&4 × every set × every starting inversion (long)
```

Design principles:
- **Triads before 7ths, close before spread, drop 2 before drop 3 before the rare drops.** This matches the user's gap: good with triads, never drilled at graded difficulty, and no drop or spread knowledge yet.
- Every voicing family follows the same four-stage arc: **build it** (theory reveal) → **one shape** (short) → **all inversions up the neck** (medium) → **inversion arpeggio / top note / progression** (medium) → **neck map** (long).
- **Chord scales before cycles.** The chord scale (parallel motion, cycle 2 "parallel") teaches the diatonic qualities. The Almanac cycles then teach voice-led motion between them.
- **Melodic minor before harmonic minor before harmonic major**, matching how often each is used and the user's shaky minor-scale knowledge. Each minor-modality card spells out the qualities in its hints.
- **Guide tones → shells → shell + tension → rootless → upper structures.** Each layer adds color above the same 3–7 skeleton.
- Short cards answer one specific question ("Bbmaj7 drop 2, 1st inversion, 4-3-2-1"). Long cards (12 of them) are the "every inversion on every string set, then arpeggiate" marathons.

Domain boundaries respected: progressions are used only as voicing vehicles; standalone comping or harmony drills belong to `har-`. The jazz-blues shell card was cut because harmony owns song forms and comping. Inversion arpeggios appear only as "play the voicing, then arpeggiate it"; scale-position arpeggios belong to `scl-`. No ear cards.

Concept ids (28): `close-triads, inversions, string-sets, spread-triads, close-voicing, drop2, drop3, drop24, drop23, drop4, v-system, voicing-top-notes, quality-morphing, relative-chords, symmetric-chords, shells, guide-tones, rootless-voicings, quartal-voicings, chord-scales, melodic-minor-harmony, harmonic-minor-harmony, harmonic-major-harmony, voice-leading-basics, voice-leading-cycles, upper-structure-triads, inversion-arpeggios, chord-melody-basics`. The ids are specific on purpose (for example `melodic-minor-harmony`, not `melodic-minor`) to avoid collisions with `scl-`/`har-` concepts. `inversions` and `guide-tones` are generic. If another domain also defines them, keep one and merge.

---------------------------------------------------------------------------------------

## 4. Engine requests

Everything below is authored in a schema-supported way today. These are features that would make the cards more exact.

1. **Arpeggiated voicing demos.** Add `arpeggiate: "up" | "up-down" | "strum-then-up-down"` on `voicings` and `chordScale` specs, so the demo plays the voicing's own notes string by string. Used by `voi-drop2-inversion-arpeggio`, `voi-drop3-inversion-arpeggio`, `voi-spread-inversions-neck`, `voi-cs-play-and-arpeggiate` and `voi-drop2-arpeggio-neck-tour`. They currently use `beatsPerChord: 8` and describe the arpeggio in the prompt.
2. **Per-chord tones in progressions.** Allow something like `ii:m9[b3,b7,9,5]`, or a `tones` map keyed by chord token, plus a 2-note `voicing: "guide"` (3 & 7 only). This is needed for exact rootless ii–V–I (`voi-rootless-ii-V-I`), guide-tone lines (`voi-guide-tones-ii-V-I`, which currently shows shells) and the upper-structure V chord (`voi-ust-ii-V-I`).
3. **Starting / locked inversion in progressions.** `startInversion: 0..3` with `voiceLead: true` (Almanac cycles start the tonic in a given inversion; the cards pass `{p:inversion}` only in text), and `inversion: n` with `voiceLead: false` to hold one inversion through a key cycle (`voi-drop2-key-cycle-fixed`).
4. **`stringSet: "auto"` in `chordScale` and `progression` specs**, resolving to the standard sets of the given voicing. Needed where the voicing itself is a param (`voi-cs-all-inversions`, `voi-cycle-harmonic-major`, `voi-almanac-marathon`).
5. **Quality ids:** `7b9#11` (the bV upper structure; currently `7alt` plus an explicit `custom` order) and `maj13#11` (currently `maj7#11` with 9 and 13 in the order).
6. **Inversion semantics with `tones`:** please confirm that for a `voicings` spec with `tones`, the tones are a close stack in the given order and inversion n puts `tones[n]` in the bass. The rootless cards (`tones: ["3","5","b7","9"]` with `drop2`) rely on this. Please also clarify whether the specific-bass option is `inversion: { bass: "3" }` or a sibling `bass: "3"` field. It isn't used here.
7. **Roman numerals in minor keys:** I assumed numerals are relative to the tonic's *major* scale (in C minor, `vi` = A natural and `bVI` = A♭), so melodic-minor charts use `vi:m7b5`/`vii:m7b5` and harmonic-minor charts use `bVI:maj7`. Please confirm.
8. **Generated voicing quizzes.** A `quiz: { kind: "voicing-id", voicings: ["drop2","drop3"], ask: "inversion" | "notes" | "top-note" | "frets" }` kind: the engine renders a computed voicing (or names one) and auto-scores "which inversion is this?", "tap Bbmaj7 drop 2 1st inversion on 4-3-2-1", or "what's the top note?". This would turn the many short "what's the X inversion of Y" cards into objective cards. Today they are self-rated play cards plus reveal quizzes.
9. **Placeholders in spec `title` strings** (demo captions like `"{root}13#11"`). Many demo arrays use them to caption each step.
10. **Dependent params / tuples.** One param value that sets several fields together (for example `{ order, stringSet, quality }` for an upper structure, or `{ quality, tones }` for rootless families). Today each family is a demo array or its own template.
11. **Playability filter for `custom` orders and spread voicings:** choose the octave and position with the smallest span, and skip combinations wider than about 4 frets (for example spread root position on 5-3-2).
12. **`chordScale` with `size: "quartal"`:** please confirm the number of voices = `stringSet.length` (cards use 3- and 4-string sets).
13. **`custom` voicing naming:** derive the chord name from `order` when it doesn't match `quality` exactly (So What uses `quality: "m11"` though the 9 is absent; the 9sus4 forms omit the 5).
14. **Drone with fifth for modal cards.** It's already supported. Just note that the quartal and So What cards set `drone` and rely on it.

---------------------------------------------------------------------------------------

## 5. Known simplifications

- Fixed-inversion key cycles: the diagram shows the cycle with the engine's compact voicing, and the *prompt* asks for the fixed inversion (see request 3). The triad version of this card was dropped for that reason. The drop 2 version stays because the drill is valuable even with an imperfect diagram.
- `voi-ust-ii-V-I` lets the engine pick a compact voicing for the altered V, because chart tokens can't carry a custom order (request 2).
- Upper-structure cards use `key: "major"` so `{rn:…}` can name the triads (`{rn:bVI:maj}`). The dominant is treated as `{root}7` on the key tonic and resolves to `{rn:IV:maj7}`.
