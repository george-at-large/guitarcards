# Harmony domain (`har-`): research notes, sources, curriculum, engine requests

File: `content/harmony.js`. It exports `templates` (169), `concepts` (43) and `toolbox` (21 entries).
Categories: `progressions` (86), `improv` (41), `theory` (42, tagged `harmony` / `heuristics`).
Levels 1–10: 6 / 15 / 22 / 35 / 38 / 23 / 15 / 8 / 5 / 2. Lengths: short 88, medium 67, long 14.

The count is above the original 90–120 target because the coordinator added more topics mid-task:
diminished in every role, chromatic mediants, cadences, modal interchange, tips from the masters, graded
chord melody, and `compare` demos.

## 1. Conventions used (binding decisions)

- **Roman numerals are always counted on the major scale of the tonic**, in minor keys too (coordinator
  clarification). So in a minor key the chords are i:m7, ii:m7b5, bIII:maj7, iv:m7, V:7, bVI:maj7, bVII:7.
  Secondary dominants: `V/ii:7` is the dominant of the ii root.
- **Spelling over enharmonics.** Charts use the roman numeral that spells each chord correctly, so:
  - In Ab, Am7 is `#i:m7`, Dm7 is `#iv:m7` and the bridge's E is `#V`.
  - Giant Steps is charted around G (`III:maj7 V:7 | I:maj7 bIII:7 …`), so key = G gives the original
    B–G–Eb changes with correct letters.
- **Quality ids come only from §9.** `6/9` and `m6/9` were removed from all chart tokens because they
  clash with the slash-bass syntax (see Engine requests).
- **Slash bass** is written as an interval of the chord itself: `I:maj/3`, `V:maj/3`, `iii:min/5`,
  `I:6/5`, `iv:min/b3` (minor chord, its minor 3rd in the bass), `I:maj/7` (line cliché: the major 7th
  in the bass under a triad), `I:7/b7`.
- **Chart variants** use a `chart` param whose values are `{ v: "<chart>", label: "…", lvl }`. Specs
  reference `chart: "$chart"`, and `{p:chart}` shows the label.
- **Static `choice` quizzes use a 0-based `answer`**, and the correct answer is always written first
  (index 0). I assume the engine shuffles the choices. Please confirm both points.
- **Copyright.** Songs appear only as chord-chart drills. No lyrics, and no melodies of copyrighted
  songs. Chord-melody cards use public-domain melodies only: Mary Had a Little Lamb, Twinkle Twinkle,
  Ode to Joy (Beethoven), and Amazing Grace ('New Britain', traditional). Ode to Joy's rhythm is
  simplified (no dotted notes).
- **No full song walk-throughs.** Those belong to the analyses agent; song cards here are short drills
  (an A section, 8–16 bars, or a vamp). Standards included as drills: Autumn Leaves A, All the Things
  You Are bars 1–8, Blue Bossa, Ipanema A, Fly Me to the Moon, A Train A, Satin Doll A, So What /
  Cantaloupe forms, Take Five vamp, Minor Swing-type, Sweet Georgia Brown A, Solar, Stella bars 1–8,
  Giant Steps, and rhythm changes as a form.
- **Concept-id collisions were removed.** `mode-brightness` and `minor-conversion` (scales),
  `guide-tones` and `upper-structure-triads` (voicings) and `bebop-scales` (scales) are owned by other
  domains. My templates link to those ids, and I don't redefine them. I also link `altered-scale`,
  `characteristic-notes` and `chord-melody-basics` from my concepts' `see` lists. My concept ids that
  the analyses agent is likely to use: `ii-v-i`, `minor-ii-v-i`, `relative-major`, `tritone-sub`,
  `backdoor-ii-v`, `modal-interchange`, `secondary-dominants`, `related-ii`, `passing-diminished`,
  `common-tone-diminished`, `cadences`, `turnarounds`, `tadd-dameron-turnaround`, `coltrane-changes`,
  `rhythm-changes`, `blues-forms`, `minor-blues`, `chromatic-mediants`, `andalusian-cadence`,
  `lydian-dominant-usage`, `altered-dominant`, `reharmonization`.
- **Toolbox `from` and `lvl`.** `from` is the interval above the chord root where the option's scale is
  rooted. `lvl` is an absolute difficulty from 1 to 10.

## 2. Curriculum ladder

| Level | Focus | Representative cards |
|---|---|---|
| 1 | Diatonic triads in one CAGED window; I–IV–V in all five shapes; basic 12-bar blues; pop axis; first drone modes | har-diatonic-triads-caged, har-I-IV-V-all-caged, har-blues-basic, har-song-pop-axis, har-imp-drone-major-modes |
| 2 | Diatonic 7ths; ii–V–I with shells; cadences; turnarounds; first passing °7; pop/rock modal loops; Andalusian, Pachelbel; blues major/minor pentatonic mix | har-ii-V-I-major, har-cadence-tour-major, har-dim-passing-ascending, har-imp-blues-pent-mix |
| 3 | Cycle of 4ths in drop 2; minor ii–V–i; minor iv; line clichés; Autumn Leaves A; modal vamps; guide-tone comping; targeting 3rds; chord melody step 1–2 | har-diatonic-cycle-4ths, har-ii-V-i-minor, har-borrowed-minor-iv, har-imp-target-3rds, har-cm-step1-mary |
| 4 | Jazz and minor blues; tritone sub; secondary dominants; rootless 7b9 = dim7; chromatic mediant pairs; relative-minor modulation; pentatonic subs (maj7, m7); chord melody with triads | har-blues-jazz, har-tritone-sub, har-secondary-dominants, har-imp-pent-sub-maj7, har-cm-step3-twinkle |
| 5 | Backdoor; related ii; modal-interchange menu; common-tone and descending °7; rhythm changes A; ATTYA / Ipanema / Satin Doll drills; throw-in compares; Martino and Barry Harris heuristics; enclosures, bebop scale; drop-2 chord melody | har-backdoor, har-modal-interchange-menu, har-imp-throwin-maj7, har-imp-think-minor, har-cm-step4-ode |
| 6 | Chromatic ii–V chains; tritone-sub turnarounds; mediant cycles; modulation menu; comping with tensions; V7 throw-in menu (6 scales); three pentatonics over ii–V–I; Wes three stages; forward motion | har-tritone-chain, har-imp-throwin-V7, har-imp-three-pents-ii-V-I, har-cm-amazing-grace |
| 7 | ii–V–I in 12 keys; Bird blues; full rhythm changes; Barry Harris 6th-diminished; planing; Solar; walking bass + chords; reharmonized chord melody; upper-structure lines | har-blues-bird, har-dim-barry-harris-6, har-song-solar, har-cm-step5-twinkle-reharm |
| 8 | Coltrane cycle and Countdown sub; minor 6th-diminished; doubly-chromatic mediants; Stella backcycling; upper-structure comping; side-stepping | har-coltrane-cycle, har-mediants-doubly-chromatic, har-song-stella-opening, har-imp-sidestep |
| 9 | Giant Steps drill; Coltrane superimposition; altered triad pair; side-slipped ii–V; chord soloing | har-giant-steps-drill, har-imp-triad-pair-altered, har-comp-chord-solo |
| 10 | 1-2-3-5 cells through Giant Steps; live reharmonization with five devices | har-imp-giant-steps-cells, har-reharm-on-the-fly |

**Chord-melody ladder** (coordinator request), all with `chordMelody` demo arrays showing "one way /
another way":

| Card | Level | What it adds |
|---|---|---|
| har-cm-step1-mary | 3 | melody only, then bass on the downbeats |
| har-cm-harmonize-scale | 4 | one chord per note, plus alternatives |
| har-cm-step3-twinkle | 4 | triads under the melody |
| har-cm-step4-ode | 5 | drop 2 and drop 3 under the melody |
| har-cm-amazing-grace | 6 | 3/4 arranging |
| har-cm-tenths | 6 | Martin Taylor's 10ths |
| har-cm-step5-twinkle-reharm | 7 | reharmonization |
| har-cm-one-note-many-chords | 7 | eight chords under one melody note |
| har-cm-amazing-grace-reharm | 8 | reharmonized ballad |
| har-comp-chord-solo | 9 | improvising in chords |

**Diminished in every role:**

| Role | Cards |
|---|---|
| Passing, ascending | har-dim-passing-ascending, har-turnarounds |
| Passing, descending | har-dim-descending |
| Common-tone | har-dim-common-tone, har-thy-common-tone-dim |
| Rootless 7b9 | har-dim-rootless-7b9, har-thy-dim-four-dominants, har-imp-throwin-dim7 |
| Barry Harris 6th-diminished | har-dim-barry-harris-6, har-dim-barry-harris-minor6, har-thy-sixth-diminished |

The diminished scales themselves are left to scales.js.

**Cadences:** perfect and imperfect authentic, plagal, minor plagal, half, deceptive, Phrygian half,
backdoor, Picardy and Andalusian. Covered by play cards (har-cadence-tour-major / -minor,
har-deceptive-menu) and theory cards (har-thy-cadence-identify, -spell, -phrygian-cadence, -backdoor).

**Modal interchange:** a source-mode table appears in the explain of har-modal-interchange-menu and in
the `modal-interchange` concept:

| Source mode | Borrowed chords |
|---|---|
| Aeolian | iv, bVI, bVII7, bIII, iiø, v |
| Dorian / melodic minor | IV7 |
| Phrygian | bIImaj7, bvii7, bIII7 |
| Mixolydian | bVII, v |
| Lydian | II7 |
| Harmonic minor / harmonic major | vii°7, iv(maj7), iv6 |
| Locrian | bVmaj7 |

Also: har-borrowed-minor-iv, har-borrowed-mario-cadence, har-thy-borrowed-source, har-thy-borrowed-list.

**Tips from the masters** (tag `masters`; paraphrased and attributed in `source`):

| Master | Tip | Card |
|---|---|---|
| Ted Greene | make the top voice a melody | har-comp-top-voice-melody |
| Barry Harris | 6th-diminished; think dominant | har-dim-barry-harris-*, har-imp-think-dominant |
| Pat Martino | minor conversion | har-imp-think-minor |
| Wes Montgomery | single notes → octaves → chords | har-imp-wes-three-stages |
| Joe Pass | three chord families; walking bass + chords | har-tip-joe-pass-families, har-comp-bass-and-chords |
| Mick Goodrick | one string only; all keys | har-imp-goodrick-one-string, har-ii-V-I-twelve-keys |
| Jim Hall | motif development | har-imp-motif-development |
| Hal Galper | forward motion | har-imp-forward-motion |
| John Scofield (and others) | side-stepping | har-imp-sidestep |
| Martin Taylor | 10ths | har-cm-tenths |
| Charlie Parker | upper intervals | har-tip-parker-extensions |
| Frank Gambale | many parent scales | har-tip-gambale-parents |
| Mark Levine | tensions by target quality | har-tip-levine-tension-rule |
| Jerry Bergonzi / Gary Campbell | pentatonics and triad pairs | har-imp-three-pents-ii-V-I, har-imp-triad-pair-altered |

## 3. Toolbox summary (21 entries)

**Chord types:** maj7, maj7#11, 6, 7, 7sus4, 7b9, 7#9, 7alt, 7#11, 13, m7, m6, mMaj7, m7b5, dim7,
maj7#5, plus three extras (7#5, 7b13, 7b9b13).

**Contexts:** `minor-blues` and `major-blues`. Their `from` is measured from the **key root**, not a
chord root.

Each entry has 3–8 options, each with `scale`, `from`, `relation`, `why` and `lvl`.

**Heuristics checked note by note** (G7 and C chords as examples):

| Heuristic | Result |
|---|---|
| Altered = melodic minor ½ step up | G alt = Ab mm |
| Altered = Lydian dominant of the tritone sub | G alt = Db Lyd dom |
| Minor pentatonic from b3 over 7alt | Bb: #9 b5 b13 b7 b9 |
| m6 pentatonic from b2 over 7alt | Ab: b9 3 b5 b13 b7 |
| Lydian dominant = melodic minor from the 5th | G7#11 = D mm |
| Dominant pentatonic from 2 over 7#11 | A: 9 3 #11 13 1 |
| Over maj7: minor pentatonic from 3 = major pentatonic from 5 | 3 5 6 7 9 |
| Over maj7: minor pentatonic from 7 = major pentatonic from 2 | Lydian: 7 9 3 #11 13 |
| Over m7: minor pentatonic from 1 / 5 / 9 | the three minor pents of Dorian |
| Over Dm7: think C major | Dorian = 2nd mode |
| m7b5 = m6 of the b3; Locrian ♮2 = melodic minor from the b3 | Bø = Dm6 = D mm |
| m7b5 = 9th chord a major 3rd below | Bø = G9 without root |
| dim7 = rootless 7b9 of the dominant a major 3rd below | B°7 = G7b9 |
| dim7 = vii° of the harmonic minor a half step up | B°7 in C harmonic minor |
| dim7 = movement half of the 6th-diminished scale a half step up | B°7 in C6-dim |
| Mixolydian b6 = melodic minor from the 4th | G7b13 = C mm |
| Lydian augmented = melodic minor from the 6th | Cmaj7#5 = A mm |
| Ionian #5 = harmonic minor from the 6th | Cmaj7#5 = A hm |
| Lydian #2 = harmonic minor a major 3rd up | Cmaj7#11 = E hm |
| Dorian b2 = melodic minor a whole step down | for sus(b9) |
| Lydian dominant from 4 over m6 | Dm6 = G9 without root |
| Dominant pentatonic from 5 over mMaj7 | A over D: 5 6 7 9 11 |

## 4. Chart verification notes

- **Solar:** confirmed against Wikipedia 'Solar (composition)'. Changes: Cm(maj7) | % | Gm7 | C7 |
  Fmaj7 | % | Fm7 | Bb7 | Ebmaj7 | Ebm7 Ab7 | Dbmaj7 | Dm7b5 G7.
- **Stella by Starlight, bars 1–8:** Em7b5 A7(b9) Cm7 F7 Fm7 Bb7 Ebmaj7 Ab7. Confirmed by the NIU
  jazz-camp chart and the jazzguitar.be / learnjazzstandards analyses (unresolved minor ii–V; backcycling).
- **Autumn Leaves A:** iv7 bVII7 bIIImaj7 bVImaj7 iiø7 V7 i (Cm7 F7 Bbmaj7 Ebmaj7 Am7b5 D7 Gm). This is
  universal. The disputed last 8 bars (Gm7–Gb7–Fm7–E7 vs Gm7–C7–Fm7–Bb7) are not used; that belongs to
  analyses.js.
- **Take the A Train A:** I (2) | II7#11 (2) | ii7 V7 | I. Bridge not used. Sources: jazzadvice,
  jazzguitar.be (D7#11 read as V7/V; Lydian dominant).
- **Cantaloupe Island:** Fm7 (4) Db7 (4) Dm7 (4) Fm7 (4). Bruno Jazz and Guitar World (Jimmy Brown)
  agree. Db7 is played as Mixolydian or Lydian dominant.
- **Tadd Dameron turnaround / Lady Bird:** Cmaj7 Eb7 Abmaj7 Db7 (Wikipedia 'Tadd Dameron turnaround';
  Learn Jazz Standards). The full Lady Bird chart could not be confirmed online, so only the turnaround
  is used.
- **From standard knowledge, cross-checked against common lead-sheet analyses** (not taken from iReal
  files):

  | Tune | Changes used |
  |---|---|
  | All the Things You Are, bars 1–8 | Fm7 Bbm7 Eb7 Abmaj7 Dbmaj7 Dm7–G7 Cmaj7 |
  | Blue Bossa | Cm7 Fm7 Dm7b5 G7 Cm7 Ebm7 Ab7 Dbmaj7 Dm7b5 G7 Cm7 |
  | Girl from Ipanema A | Fmaj7 (2) G7 (2) Gm7 Gb7 Fmaj7 Gb7 |
  | Satin Doll A | Dm7 G7 ×2, Em7 A7 ×2, Am7 D7, Abm7 Db7, C |
  | Fly Me to the Moon | Am7 Dm7 G7 Cmaj7 (C7) Fmaj7 Bm7b5 E7 Am7 (A7) |
  | Sweet Georgia Brown A | VI7 II7 V7 I, 4 bars each |
  | So What | D Dorian 16 bars, Eb Dorian 8, D Dorian 8 (compressed to 8 + 8 in the drill) |
  | Take Five | Ebm / Bbm7 vamp in 5/4 |
  | Giant Steps | the standard 16 bars |
  | Rhythm changes | the standard A section and III7–VI7–II7–V7 bridge |
  | Bird blues | Blues for Alice-type changes |

- **Minor Swing:** labelled "Minor Swing type" (im6 – ivm6 – V7), because the exact bar order varies
  between sources.
- **Public-domain melodies,** as scale degrees (major), written from knowledge. Each bar's beat total
  was checked by script against its meter.

## 5. Sources

**Books (paraphrased; no quotes beyond a few words)**

| Author | Work | Used for |
|---|---|---|
| Mark Levine | *The Jazz Theory Book* (1995); *The Jazz Piano Book* (1989) | chord-scale theory, related ii, tensions by target quality, upper-structure triads (II, bIII, bV, bVI, VI, bii) |
| Ted Greene | *Chord Chemistry* (1971); *Modern Chord Progressions* (1976) | top-voice voice leading, harmonizing melodies |
| Mick Goodrick | *The Advancing Guitarist* (1987) | unitar / one string, limits, all keys |
| Pat Martino | *Linear Expressions* (1983) | minor conversion |
| Alan Kingstone | *The Barry Harris Harmonic Method for Guitar* | Barry Harris workshop material |
| Hal Galper | *Forward Motion* (2005) | phrasing toward the downbeat |
| Jerry Bergonzi | *Inside Improvisation* vol. 2 *Pentatonics*; vol. 7 *Hexatonics* | pentatonics, triad pairs |
| Gary Campbell | *Triad Pairs for Jazz* | triad pairs |
| David Baker | *How to Play Bebop* | bebop scales |
| Martin Taylor | *Beyond Chord Melody* (Fundamental Changes) | 10ths, bass + melody |
| Jim Hall | *Exploring Jazz Guitar* (1990) | motivic approach |
| Joe Pass | *Joe Pass Guitar Style* (1970) | chord families, walking bass with chords |
| Shapiro & Hentoff | *Hear Me Talkin' to Ya* (1955) | Parker's 'higher intervals' account |
| Frank Gambale | *Modes: No More Mystery* (video) | multiple parent scales |

**Web (accessed for verification)**

- Solar: https://www.Wikipedia.org/wiki/Solar_(composition)
- Stella:
  - https://www.jazzguitar.be/blog/stella-by-starlight/
  - https://www.learnjazzstandards.com/video/learn-jazz-standards-video/stella-by-starlight-chords-analysis/
  - https://csa.niu.edu/external-programs/_pdf/jazz-camp-music/stella-by-starlight-c.pdf
- Autumn Leaves:
  - https://crj-online.org/v4/CRJ-AutumnLeaves.php
  - https://www.learnjazzstandards.com/blog/learning-jazz/jazz-advice/navigate-autumn-leaves/
- Barry Harris 6th-diminished:
  - https://www.jazz-guitar-licks.com/blog/lessons/major-sixth-diminished-jazz-guitar-lesson-around-the-barry-harris-concept.html
  - https://medium.com/beyond-music-theory/the-barry-harriss-6th-diminished-scale-74e18e9b918d
  - https://irfu.cea.fr/Pisp/frederic.galliano/Zique/barry_harris.html
- Tadd Dameron turnaround / Lady Bird:
  - https://Www.Wikipedia.org/wiki/Tadd_Dameron_turnaround
  - https://www.learnjazzstandards.com/blog/tadd-dameron-turnaround-chord-progression-workout/
- Take the A Train:
  - https://www.jazzadvice.com/jazz-standards/take-the-a-train/
  - https://www.jazzguitar.be/forum/theory/20159-when-employ-dominant-7-sharp-11-a-3.html
- Cantaloupe Island:
  - https://www.brunojazz.com/vt-CantaloupeIsland.htm
  - https://guitarworld.com/uncategorized/string-theory-jimmy-brown-jamming-changes-three-chord-modal-jazz-gem-cantaloupe-island
- Martino minor conversion (forum summaries: dominant → m7 a 5th up; m7b5 → minor on b3; alt → minor ½ step up):
  - https://www.jazzguitar.be/forum/theory/336-minor-conversions.html
  - https://www.jazzguitar.be/forum/improvisation/13166-pat-martino-minor-scale-thinking.html
- Pentatonic substitution:
  - https://www.premierguitar.com/articles/pentatonics-gone-wild-1
  - https://www.learnjazzstandards.com/blog/cool-and-unusual-applications-of-the-minor-pentatonic-scale/
  - https://www.brunojazz.com/vt-AlteredPentas.htm
  - https://www.jazzguitar.be/forum/improvisation/92045-minor-pentatonic-over-maj7.html
- Martin Taylor:
  - https://www.fundamental-changes.com/learn-chord-melody-with-martin-taylor-part-1/
  - https://guitarworld.com/lessons/how-to-combine-chords-and-walking-basslines-on-guitar
- Upper structures (Levine list via secondary sources): https://www.scribd.com/document/455156971/Upper-structure

**Caveats.** The Martino and Barry Harris specifics come from secondary sources: forums, Kingstone's
book and lesson sites. They are phrased as "taught", not as quotes. A Jens Larsen chord-melody search
returned nothing specific, so his name is used only as a general reference for "melody on top, drop 2"
pedagogy. That pedagogy is also documented by Martin Taylor and Ted Greene.

## 6. Engine requests

1. **CAGED-constrained progression voicings.** CAGED chord-series cards (har-diatonic-*-caged,
   har-I-IV-V-all-caged) need the diagram to stay inside one CAGED window. I'd like `region: { caged }`
   or `region: { frets: [lo, hi] }` on `progression` specs. For now the prompt says where to play and the
   engine shows compact voicings.
2. **Rooting a scale away from the chord root.** Pentatonic substitutions (e.g. minor pent from the 3rd
   over maj7, from the b3 over 7alt) can't be expressed in a `scales` map or in `compare` options. I'd
   like `{ scale, from }` objects as `scales` map values and as `compare` options. For now I use
   `fretboard` specs with `tones` relative to the root, in `demo` arrays.
3. **`compare` with a param chart.** `compare` with `chart: "$chart"` needs the `target` to exist in
   every variant. I'd like `target` to accept a list, or a variant object that carries its own target.
   For now compare specs use fixed charts.
4. **Variant objects that set several fields.** A param value should be able to set the chart, the
   `scales` map and the `target` together. For now `$chart` cards share one `scales` map that contains
   keys for all variants; unused keys are harmless.
5. **Guide-tone voicing.** I'd like a `voicing: "guide-tones"` (3rd + 7th only, 2 notes) for progression
   specs. For now har-comp-guide-tones shows shells, with a caption telling the user to play the top two.
6. **Uneven chord durations within a bar.** Needed for 3+2 in 5/4, 2+1 in 3/4, and chords that
   anticipate. Suggested syntax: `i:min*3 v:m7*2`. For now I repeat tokens (`| i:min i:min i:min v:m7
   v:m7 |`, beatsPerBar 5).
7. **`6/9` and `m6/9` collide with slash-bass syntax.** `I:6/9` reads as "I6 with the 9th in the bass".
   Please add the aliases `69` and `m69`, or define the parse order. I avoided both everywhere.
8. **Slash-bass semantics to confirm:**
   - `/b3` on minor chords (`iv:min/b3`, `i:m6/b3`)
   - non-chord-tone basses (`I:maj/7`, `I:maj7/5`)
   - `I:6/6` and `i:m6/6`
9. **Spelling by roman letter.** The engine must spell by the roman letter, not by semitones:
   - `#i` in Ab = A (not Bbb)
   - `#iv` in Ab = D
   - `VII` in D = C#
   - `bV` in C = Gb, and `bV` in F = Cb
   - `bI` is never used
10. **`chordMelody` additions:**
    - a `style: "bass-under"` (melody + bass only, or 10ths) for the Martin Taylor steps. For now
      `shell-under` is used.
    - pickups are written as a first bar beginning with rests (`. . 5,`). Please render the bar as a
      pickup and don't voice its chord until the first melody note.
    - when the melody note at a change is a tension (e.g. a 13 over V7), the engine must still put it on
      top. I used `V:13` where possible.
11. **Melody rhythms.** Dotted rhythms are simplified. The ear agent uses `-_` for dotted values; please
    standardize it, and I'll update Ode to Joy and Amazing Grace.
12. **Dynamic `{parent:…}`.** Allow `{parent:$scale}`, i.e. the parent of the current `scale` param.
    Mode cards currently say "see hints" instead.
13. **`chord-scale-choice` quiz:**
    - a filter, e.g. `chords: ["7alt", "m7b5"]` or `maxLvl`, so easy and hard decks can exist.
    - Toolbox entries `minor-blues` and `major-blues` are **contexts, not chord-quality ids**. Render the
      label, and in the quiz either skip them or ask "over a C minor blues, which scale…".
14. **Toolbox visual.** A `{ type: "toolbox", chord: "7alt" }` spec (or `"$quality"`) so improv cards can
    show the toolbox entry inline.
15. **Param arrays as values.** `fretboard.tones: "$tones"` where the param values are interval arrays
    (`{ v: ["9", "#11", "13"], label }`), and `region: { string: "$string" }`. Please confirm both are
    supported.
16. **`walk: "arpeggio"` with `scales`.** Arpeggiate the chord, then run its scale, so improv cards can
    'show the chord, then the colour'.
17. **`choice` quizzes.** Confirm the 0-based `answer` index and that choices are shuffled; every correct
    answer is authored at index 0.
18. **Per-spec `title` inside `demo` arrays.** I use it to label "one way / another way". Please render
    it as the variant name.
