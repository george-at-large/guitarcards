# Scales / arpeggios / fretboard — research notes (`content/scales.js`, prefix `scl-`)

Output: **200 templates, 37 concepts** (all ids unique, parse-checked). The file is generated from a validating
generator (kept outside the repo) that checks every scale id, quality id, interval, region key, sequence kind,
quiz kind, `$param` reference, `{p:…}` placeholder, concept link and `vary` entry against `docs/SCHEMA.md`.

Level spread: L1 6 · L2 13 · L3 32 · L4 39 · L5 52 · L6 36 · L7 12 · L8 4 · L9 4 · L10 2.
Lengths: short 85 · medium 101 · long 14. Categories: scales 105 · theory 40 · arpeggios 35 · pentatonic 14 · fretboard 5 · improv 1.

The count is above the 100–130 target because the coordinator added three topics mid-task:
both diminished scales (12 cards), chromatic drills (6) and the "one note changes" parallel-mode series
(25 step cards + 5 full-ladder cards).

---

## 1. Sources

Books (primary):
- Mick Goodrick, *The Advancing Guitarist* (Hal Leonard, 1987): the "unitar" (one-string) chapter, playing in position, intervals along one string and on string pairs, and the warning against mindless position playing. Also *Mr. Goodchord's Almanac of Guitar Voice-Leading* (contrary motion / voice-leading cycles).
- Pat Martino, *Linear Expressions* (REH/Hal Leonard, 1983): minor conversion. *The Nature of the Guitar* (video): augmented/diminished "parent" geometry.
- Guy Capuzzo, "Pat Martino's *The Nature of the Guitar*: An Intersection of Jazz Theory and Neo-Riemannian Theory", *Music Theory Online* 12.1 (2006). https://mtosmt.org/classic/mto.06.12.1/mto.06.12.1.capuzzo.pdf
- Mark Levine, *The Jazz Theory Book* (Sher, 1995): melodic/harmonic minor mode names and chord uses.
- William Leavitt, *A Modern Method for Guitar* (Berklee): position playing, sequences in every position.
- Ted Greene, *Jazz Guitar Single Note Soloing* Vols. 1–2: diatonic arpeggio/sequence drills in position.
- Bert Ligon, *Connecting Chords with Linear Harmony* (Hal Leonard): arpeggio "outlines" resolving through ii–V–I.
- David Baker, *How to Play Bebop*: bebop scales (dominant, major; Dorian version attributed to Baker by most sources).
- Troy Grady, *Cracking the Code*: picking-path analysis (inside/outside string changes in 3nps).

Web (checked during research):
- TrueFire, "Pat Martino Guitar Lesson: Sacred Geometry". Confirms: lowering any note of C+ gives E, G#(Ab), C major; raising gives C#m, Fm, Am; Edim7 lowered → Gb7, C7, Eb7, A7; triangle/square; 3 × 4 vs 7 + 5. https://blog.truefire.com/guitar-lessons/pat-martino-guitar-lesson-sacred-geometry/
- jazzguitar.be forum, "Pat Martino's book Linear Expressions — in other words convert everything to minor": dominant → minor a 5th up; half-diminished → minor on the b3. https://www.jazzguitar.be/forum/improvisation/9984-pat-martinos-book-linear-expressions-other-words-convert-everything-minor.html
- rec.music.makers.guitar.jazz threads on Martino minor conversion (e.g. Cm7 over F13). https://groups.google.com/g/rec.music.makers.guitar.jazz/c/rvPGzUHzk8U
- jazzguitar.be, "Mick Goodrick advice/opinions" (unitar = "pretend your guitar only has one string"; the Stella example on two strings). https://www.jazzguitar.be/forum/improvisation/36252-mick-goodrick-advice-opinions-please.html
- Brent Baldwin, "Mick Goodrick and The Advancing Guitarist" ("ice skating" up and down one string). https://www.brentbaldwinmusic.com/black-market-measures/mick-goodrick-and-the-advancing-guitarist
- Wikipedia, "Bebop scale" (Baker's definitions; Bebop Dorian = Dorian + major 3rd, alternative + natural 7). https://en.wikipedia.org/wiki/Bebop_scale
- jazz-guitar-licks.com, Dorian bebop (D E F F# G A B C). https://jazz-guitar-licks.com/pages/guitar-scales-modes/bebop-scales/dorian-bebop-scale-guitar-fretboard-diagrams-and-formula.html
- Groove3 / jazzguitar.be on Ligon's three outlines. https://www.jazzguitar.be/forum/improvisation/29618-bert-ligon-connecting-comprehensive-book-difference.html

### What the sources do and don't support (honesty notes)
- **Martino minor conversion.** "Dominant → minor a 5th above" is well attested. "m7b5 → minor on the b3" is a forum summary, but it is arithmetically exact (Bm7b5 = Dm6), so the cards present it as a core rule. "7alt → minor ½ step up" and "maj7 → minor on 3" are labelled in the text as *common extensions taught alongside his approach*, not as Martino's own words. One forum commenter notes Martino calls the system a way to organise the fretboard rather than a change of harmonic function. The concept says so.
- **Goodrick.** I could not get a table of contents online. Cards cite the unitar, two-string and position ideas (all confirmed by several secondary sources). They don't cite page numbers or claim a specific "12 positions" chapter layout. "Positions" follows the schema's `{ position: N }` = frets N−1…N+3.
- **Ligon.** Cited only for the general idea (arpeggio outlines resolving by step). The specific "3-to-9" teaching is credited to general jazz pedagogy / Jens Larsen.

---

## 2. Theory reference (double-checked)

Major modes, parallel: Ionian 1 2 3 4 5 6 7 · Dorian b3 b7 · Phrygian b2 b3 b6 b7 · Lydian #4 · Mixolydian b7 · Aeolian b3 b6 b7 · Locrian b2 b3 b5 b6 b7.

Melodic minor modes (Levine):
| # | id | formula | chord |
|---|---|---|---|
| 1 | melodic-minor | 1 2 b3 4 5 6 7 | mMaj7, m6 |
| 2 | dorian-b2 | 1 b2 b3 4 5 6 b7 | sus4(b9) |
| 3 | lydian-augmented | 1 2 3 #4 #5 6 7 | maj7#5 |
| 4 | lydian-dominant | 1 2 3 #4 5 6 b7 | 7#11 |
| 5 | mixolydian-b6 | 1 2 3 4 5 b6 b7 | 7b13 |
| 6 | locrian-nat2 | 1 2 b3 4 b5 b6 b7 | m7b5(9) |
| 7 | altered | 1 b9 #9 3 #11 b13 b7 | 7alt |
Diatonic 7ths: mMaj7 m7 maj7#5 7 7 m7b5 m7b5. Parent offsets: altered +½, Lydian dominant +5th, Locrian nat2 +m3, Mixolydian b6 +4th, Lydian aug −m3, Dorian b2 −whole step.

Harmonic minor modes: harmonic-minor (mMaj7) · locrian-nat6 (m7b5) · ionian-sharp5 (maj7#5) · dorian-sharp4 (m7#11) · phrygian-dominant (7b9b13) · lydian-sharp2 (maj7#9#11) · altered-dim 1 b2 b3 b4 b5 b6 bb7 (dim7).
Diatonic 7ths: mMaj7 m7b5 maj7#5 m7 7 maj7 dim7.
Harmonic major diatonic 7ths: maj7 m7b5 m7 mMaj7 7 maj7#5 dim7.

**One-note ladders** (each step verified note by note):
- Major: Lydian →(#4→4) Ionian →(7→b7) Mixolydian →(3→b3) Dorian →(6→b6) Aeolian →(2→b2) Phrygian →(5→b5) Locrian →(lower the root) Lydian a half step down.
- Melodic minor modes on one root are always **2** notes apart, so there is no one-note ladder inside the family. Interleaving it with the major modes does give one:
  Lydian aug →(#5→5) Lydian →(7→b7) Lydian dom →(#4→4) Mixolydian →(6→b6) Mixolydian b6 →(3→b3) Aeolian →(5→b5) Locrian nat2 →(2→b2) Locrian →(4→b4) Altered;
  and Ionian →(3→b3) Melodic minor →(7→b7) Dorian →(2→b2) Dorian b2 →(6→b6) Phrygian.
- Harmonic minor neighbours: Aeolian→HM (b7→7), Phrygian→Phrygian dominant (b3→3), Locrian→Locrian nat6 (b6→6), Ionian→Ionian #5 (5→#5), Dorian→Dorian #4 (4→#4), Lydian→Lydian #2 (2→#2), Altered→Altered-dim (b7→bb7).
- Four parents in one shape: major →(6→b6) harmonic major →(3→b3) harmonic minor →(b6→6) melodic minor →(b3→3) major.

Symmetry: whole tone 2 collections; diminished 3 collections (I: HW on C Eb F# A = WH on C# E G Bb; II: HW C# E G Bb = WH D F Ab B; III: HW D F Ab B = WH Eb F# A C); augmented triads 4; dim7 chords 3. C half-whole contains C7 Eb7 F#7 A7 and the major triads C Eb F# A (over C7: 1-3-5, #9-5-b7, #11-b7-b9, 13-b9-3).

Martino transformations (verified): C+ lowered → E (lower C), Ab (lower E), C (lower G#); raised → C#m, Fm, Am. Cdim7 lowered → B7, D7, F7, Ab7 (the lowered note becomes the root).

Arpeggio substitution: maj7 → m7 on 3 (3 5 7 9); m7 → maj7 on b3 (b3 5 b7 9); 7 → m7b5 on 3 (3 5 b7 9); m7b5 → mMaj7 on b3 (b3 b5 b7 9, Locrian nat2) or m7 on b3 (b9, Locrian). Stacks: Cmaj7–Em7–Gmaj7–Bm7 (Lydian 13), Dm7–Fmaj7–Am7–Cmaj7 (Dorian 13), G7–Bm7b5–DmMaj7–Fmaj7#5 (Lydian dominant 13). Altered palette over G7alt (Ab melodic minor): AbmMaj7 (b9 3 b13 1), Cbmaj7#5 (3 b13 1 #9), Db7 (#11 b7 b9 3), Fm7b5 (b7 b9 3 b13). Triad pairs: I+II (Lydian), bIII+IV over m7 (Dorian), bV+bVI over 7alt.

Interval shapes on adjacent strings a 4th apart: −2 b3, −1 3, 0 4, +1 tritone, +2 5, +4 6, +5 b7 (one fret higher across G–B). Octaves: +2 frets two strings up (+3 across B). Toward the nut: 6→3 −3, 5→2 and 4→1 −2.
6ths on skip-one string pairs: strings 1&3 and 2&4 (spanning G–B) same fret = M6, −1 = m6; strings 3&5 and 4&6 −1 = M6, −2 = m6.

---

## 3. Curriculum ladder

| level | focus | representative cards |
|---|---|---|
| 1 | note names on strings 6/5, chromatic on one string, the G–B major 3rd, minor pentatonic boxes | `scl-fb-note-on-fret-low`, `scl-fb-name-one-string`, `scl-chr-one-string`, `scl-pent-minor-boxes` |
| 2 | middle-string notes, octave shapes, core interval shapes, major modes in CAGED (review), connecting two boxes, chromatic in position | `scl-fb-root-every-string`, `scl-pos-major-modes-caged`, `scl-pent-connect-pairs`, `scl-gdk-unitar-mode` |
| 3 | major modes as 3nps, the **major brightness ladder** (6 step cards + full walk), melodic minor = major with b3, sequences in 3rds/groups, two-string Goodrick, "what's the b6 in this position?" | `scl-par-major-ladder`, `scl-par-ionian-melmin`, `scl-seq-3rds-caged`, `scl-fb-degree-in-position` |
| 4 | melodic & harmonic minor in CAGED and 3nps, Phrygian dominant, 4ths, diatonic triads, whole tone, diminished on one string, arpeggio morph, 7th arpeggios across the neck, chord tones in a position | `scl-mm-caged`, `scl-hm-caged`, `scl-par-locrian-*`, `scl-arp-7th-morph`, `scl-gdk-12-positions` |
| 5 | melodic-minor modes in position, minor families in any position, both diminished scales and their 3 collections, bebop dominant, enclosures, 3-to-9 arpeggio substitution, Martino geometry (aug/dim), 9th arpeggios, inversion arpeggios | `scl-mm-modes-caged`, `scl-dim-hw-position`, `scl-dim-three-collections`, `scl-arp-sub-maj7-from-3`, `scl-mart-aug-geometry` |
| 6 | all seven 3nps positions of melodic/harmonic minor, harmonic-minor modes, melodic-minor ladder A, stacked 3rds (Lydian/Dorian 13), Martino minor conversion, diminished sequences and dominant arps, contrary motion, any scale in any position | `scl-mm-all-positions`, `scl-par-melodic-ladder-a`, `scl-arp-stack-maj`, `scl-mart-minor-conv-dom`, `scl-pos-any-scale-any-position` |
| 7 | melodic minor in 3rds across all positions, altered in 4ths, intervallic cells, triad pairs, Lydian dominant stack, Martino ii–V–I and dim7→dom7 transformation, augmented scale, diminished cells/triads | `scl-seq-mm-3rds-all-positions`, `scl-arp-triad-pair-lydian`, `scl-mart-ii-v-i`, `scl-mart-dim-to-dom7` |
| 8 | altered arpeggio palette, altered triad pair, harmonic minor groups of 4 across the neck, diminished speed run | `scl-arp-altered-palette`, `scl-seq-hm-groups4-all-positions`, `scl-dim-speed` |
| 9 | sight-sequencing any scale in any position, altered 4ths over the whole neck, minor ii–V–i in one position, unitar triads in exotic families | `scl-master-*` |
| 10 | any scale in 3rds as 16ths over the whole neck with gap click, diminished triad cycle at speed | `scl-master-whole-neck-3rds-16ths`, `scl-master-dim-triad-cycle` |

The final difficulty also depends on param `lvl`s (e.g. Lydian augmented +3 over melodic minor), key difficulty and tempo, as the schema describes.

Pedagogical spine: (1) know every note → (2) intervals as shapes → (3) one string (Goodrick) → (4) two strings →
(5) positions (Goodrick) and shapes (CAGED/3nps/boxes) → (6) connecting them → (7) sequences →
(8) arpeggios and substitutions → (9) symmetric geometry (Martino) → (10) any scale, anywhere, at tempo.
The minor families get the same full treatment the user already has for major (CAGED, 3nps, all 7 positions,
modes, one-note-change ladders, one string, two strings, sequences, diatonic arpeggios).

---

## 4. Engine requests

These are things I needed but the schema doesn't define. For each one I wrote the card a supported way and note the workaround.

1. **`$param` references nested inside specs.** I rely on `sequence: { kind: "intervals", step: "$step", alternate: "$alt" }`, `sequence: { kind: "pattern", degrees: "$cell" }`, `region: { strings: "$pair" }`, `region: { connect: "$pair" }` and `stringSet: "$set"`. Please confirm these resolve at any depth, and that array-valued (`[1,2,3,5]`) and boolean-valued params work.
2. **`connect` for 3nps patterns** (e.g. `{ connect: { nps3: [1,2,3] } }`). Workaround: demo arrays of `{ nps3: n }` specs.
3. **Contrary-motion sequence**: `sequence: { kind: "contrary", from: "outside" | "inside" }`, interleaving an ascending and a descending voice. Workaround: a demo array with the two voices played one after the other, plus text instructions.
4. **Harmonic dyads**: `sequence: { kind: "intervals", step: 3, harmonic: true }`, so 3rds/6ths can be played as double-stops.
5. **Cell transposition by interval** (`sequence: { kind: "pattern", degrees, moveBy: "b3" }`), for symmetric diminished/whole-tone/augmented cycles. Workaround: diatonic movement of the cell, with prompt text pointing out every other start.
6. **Enclosure / approach-tone sequences**: `{ kind: "enclosure", targets: "chord-tones", above: "diatonic", below: "chromatic" }` and `{ kind: "approach", from: "below" }`. Workaround: arpeggio demo plus the chromatic notes in the shape, with text instructions.
7. **Linear arpeggio start tone / inversion**: `type: "arpeggio", startOn: "3"` or `inversion: 1` within a string-set region. Workaround: a `voicings` visual for the inversions, with the arpeggio demo over the string set.
8. **Relative roots on scale specs**: `from: "b3"` (as in the toolbox) so a spec can be rooted on a degree of the param root, e.g. "Dorian on the 2nd of {key}" or "the minor a 5th above {root}7". A matching **`drone.from`** is needed too. Workaround: `type: "arpeggio"` with `tones` relative to the param root, and derived-mode drills done through `mode-of` / `parent-scale` quizzes.
9. **`region: { strings: [...] }` with 3 or more strings** (I use `[3,2,1]`, `[4,3,2]`, …). Please confirm; the schema only shows `[a, b]`.
10. **Box numbering for other pentatonic-type scales**: what does `{ box: n }` mean for `major-pentatonic`, `blues`, `major-blues`? I assumed the same five boxes as the relative minor. Prompts only say "box n".
11. **`nps3` for 6- and 8-note scales** (whole tone, diminished, bebop): undefined. I avoided it and used `position` / `string` / `strings`.
12. **`{scale}` / `{scaleNotes}` with a fixed scale id**: the generator adds a single-value `scale` param (e.g. `scale: ["melodic-minor"]`). It would be simpler if those placeholders fell back to the visual's scale.
13. **Generalised `{parent:<mode>}`** for every mode id (I only use `{parent:altered}`).
14. **Multiple static diagrams** (`visual` as an array, like `demo`). Workaround: one visual plus a demo array.
15. **Labels relative to another root** (`labelsRoot: "5"`), so a Dm7 arpeggio over G7 can show both 5-b7-9-11 and 1-b3-5-b7.
16. **Chord drones** (`drone: { note: "$root", chord: "m7b5" }` or `quality`): altered, half-diminished and 13b9 cards would sound much clearer over a chord pad than a root+5th. A 5th drone also clashes with b5/#5 scales. The one-note-change cards and ladders that pass through Locrian, Locrian nat2/nat6, altered, altered-dim, Lydian augmented or Ionian #5 already use `fifth: false`. Cards whose `scale` param mixes families can't switch per value, so a per-scale "auto" fifth would help.
17. **Diagonal runs**: e.g. `{ diagonal: { strings: [6, 1], notesPerString: 5 } }` for shifting chromatic or 3nps runs. Workaround: demo arrays of consecutive positions.
18. **Scale definitions to confirm**: `bebop-dorian` should be Baker's (Dorian + major 3rd: 1 2 b3 3 4 5 6 b7); `hirajoshi` has several published forms (I describe 1 2 b3 5 b6); `gypsy-minor` is 1 2 b3 #4 5 b6 7 as per the schema.
19. **Arpeggio `tones` below the root**: the dim7→dom7 card uses `tones: ["7","b3","b5","bb7"]` (B7 out of Cdim7). Please confirm that tones are treated as pitch classes placed wherever they fall in the region.
20. **Roman tokens in minor keys**: `{rn:ii:m7b5}`, `{rn:V:7alt}` and `{rn:i:mMaj7}` with `key: "minor"`. Please confirm that degrees are counted from the minor tonic.
21. **Paired param values** (e.g. `pair: { from: "lydian", to: "ionian" }` referenced as `$pair.from`). This would collapse the 25 one-note-change cards into 3 templates. For now each step is its own card (generated from a table, so they're consistent).

---

## 5. Notes for other domains / integration

- Concept ids I defined (check for collisions): fretboard-note-names, octave-shapes, interval-shapes, playing-in-position, unitar, two-string-playing, caged-system, three-nps, picking-paths-3nps, pentatonic-boxes, connecting-positions, position-shifting, scale-sequences, diatonic-intervals-sequences, contrary-motion, parent-scale-thinking, parallel-vs-derived-modes, mode-brightness, characteristic-notes, melodic-minor-modes, altered-scale, locrian-nat2, harmonic-minor-modes, harmonic-major, symmetric-scales, diminished-scale, whole-tone-scale, bebop-scales, chromatic-passing-tones, extended-arpeggios, arpeggio-superimposition, triad-pairs, minor-conversion, martino-geometry, augmented-triad-cycles, diminished-cycles, guide-tones-in-position. Likely overlaps: `altered-scale` / `minor-conversion` (harmony toolbox) and `triad-pairs` (voicings). Rename on merge if needed.
- `chord-scale-choice` quizzes belong to harmony (toolbox). My choice cards ask "which scale has these exact chord tones", a scale-knowledge question, so they don't duplicate the toolbox.
- `scl-mart-ii-v-i` and `scl-master-minor-ii-v-i-one-position` use `progression` specs (harmony vocabulary), framed as Martino / position-mastery drills.
- Two `voicings` specs appear as *visuals* (`scl-arp-inversions-string-sets`, `scl-mart-*-geometry`). Voicings stays the owner of those drills.
