# Ear training: research notes, curriculum ladder, engine requests

Domain: `content/ear.js` (prefix `ear-`). Deliverable status: **139 templates, 19 concepts**, all ids unique,
file parses (`node -e "import(...)"` check passes). A local validator also confirmed that every quiz kind,
interval, quality, scale id, chart token, slash bass and concept link is in the SCHEMA vocabulary. It also checked
that every melody's bars add up to whole bars.

The count is above the original "70–100" target because the coordinator added five topic areas mid-task:
audiation, cadences, modal interchange, diminished sounds and parallel modes. Roughly 21 of the 139 are
`listen` lessons, not quizzes.

| category | templates | of which |
|---|---|---|
| ear-intervals | 32 | 19 quizzes, 13 song-reference lessons |
| ear-chords | 27 | 22 quality, 5 inversion |
| ear-progressions | 25 | 2 medium drill blocks (diatonic, jazz) + 3 other medium cards (12-bar forms, Autumn-Leaves type, Giant Steps) |
| ear-functional | 25 | 10 scale-degree, 9 mode, 6 bass-line |
| ear-melody | 30 | 7 dictation, 15 audiate, 8 public-domain tune lessons |

Levels used: 1 (13) · 2 (20) · 3 (21) · 4 (20) · 5 (15) · 6 (19) · 7 (14) · 8 (10) · 9 (5) · 10 (2).

---

## 1. Research findings

### Functional ear training (Alain Benbassat / "Functional Ear Trainer")
- Benbassat's method (free software from miles.be since 2002; now the *Functional Ear Trainer* apps by Kaizen9,
  "based on" his method) trains you to **identify tones in the context of a key** rather than as isolated intervals:
  a cadence is played, then a note, and you identify its degree.
- The method's core habit: after hearing the note, **sing it and resolve it to the tonic**. The resolution trains
  each degree's pull.
- Sequencing advice from practitioners: master the **lower tetrachord (1–4)** to ~90–100%, then the **upper
  tetrachord**, then the full octave; about 10 min/day. Suggested order for chromatic degrees: **b3, b7, b6, b5 (#4), b2**.
  Contrasting pairs (M/m 2nd, 3rd, 6th, 7th; tritone vs P4/P5) are good drill sets.
- Practice styles: a "perfection drill" (repeats allowed, sing and resolve), a no-repeats drill, and a fast
  gut-reaction test. These map onto our short cards (perfection) and medium drill blocks (speed).

### Bruce Arnold, Contextual Ear Training (Muse Eek)
- Sequence: **One Note** (cadence → one note → name it, then sing it) → at ~50% move to Direct Application
  (the same notes inside real music) and **Two Note** (two notes in succession) → Fanatic's Guide and **Secondary
  Dominants** (progressions within one key) at ~80% → **Key Note Recognition / Key Retention** → Three-Note
  and Four-Note volumes (chords, melodies, modulation).
- Takeaways used here: (a) every note is heard against the key, so even dictation is "degrees in a row";
  (b) **key retention** (one cadence, then many notes) is a separate skill, the basis of `ear-deg-major-drill`;
  (c) secondary dominants are heard *within* a key.
- (Forum claims that Arnold's method derives from Charlie Banacos's teaching are unverified.)

### Berklee ear-training sequencing
- ET1: melodies, intervals, harmony and solfège in **major**. ET2: **minor** keys. ET3: **Mixolydian, Dorian,
  Phrygian** modes. ET4: modulation, relative keys, **V7 with altered chords, secondary dominants**, modulating
  progressions. Electives: Harmonic Ear Training (progressions), Advanced Ear Training (atonal intervals). Later
  catalog text adds melodic and harmonic minor and Lydian.
- Berklee's Coursera "Develop Your Musicianship" builds intervals (M2, M3, P4, P5, M6, M7 first, i.e. the
  major-scale intervals from the root), then triads, then 7th chords, then I–IV–V.
- Takeaway: major → minor → modes → altered dominants and secondary dominants. Our ladder follows this
  order for degrees, modes and progressions.

### Order of chord qualities and harmonic vs melodic
- Course outlines (Sierra College *Equipping the Musical Ear*, Baylor ETC) go **intervals → triads → seventh chords**,
  and build 7th-chord recognition on triad cores (major triad under maj7 and 7; minor triad under m7).
- Melodic vs harmonic: a literature review in Stambaugh & Nichols (2019) cites Buttram 1969, Balzano & Liesch 1982,
  and Wuthrich & Tunks 1989: college students identify **melodic intervals more easily than harmonic**, and
  **ascending more easily than descending**. A Girona conservatory study found the hardest **harmonic** intervals
  are the tritone, m6, M6, m7 and M7. Interval identification also predicted melodic-dictation scores (~29% of variance).
- **Decision**: melodic ascending → melodic descending → harmonic → mixed → compound; chords are offered
  **arpeggiated before block**. The 6ths, 7ths and tritone come later and are taught with inversion and octave-reference tricks.

### Interval reference songs
- Wikipedia's *Interval recognition* article compiles common reference songs per interval. We used it as a pool,
  then applied the copyright rule:
  - **Public domain / traditional, quoted in full or in part**: Frère Jacques, Mary Had a Little Lamb, Twinkle Twinkle,
    Ode to Joy, Joy to the World, Für Elise (named only), When the Saints, Swing Low, Greensleeves, Star-Spangled Banner,
    Bridal Chorus (Wagner), Amazing Grace, Auld Lang Syne, Eine kleine Nachtmusik, Also sprach Zarathustra (Strauss 1896;
    PD in the US as a pre-1929 publication and in the EU since 2020), My Bonnie, Jingle Bells (1857), The Entertainer (1902),
    Happy Birthday (PD: copyright claim ended by the 2015 ruling and 2016 settlement in the US; expired in the EU end of 2016),
    Silent Night (1818), Scarborough Fair (traditional tune), Londonderry Air (Danny Boy; trad. melody).
  - **Copyrighted, name + first interval only (the demo plays exactly 2 notes or none)**: Over the Rainbow, The Christmas Song,
    Jaws, Yesterday, Hey Jude, Maria, Star Trek (original series), Somewhere, Star Wars main theme (first two long notes),
    My Favorite Things, Can't Help Falling in Love, Flintstones. No lyrics anywhere.
  - Where the famous interval is **not** the first interval (Twinkle's P5, Happy Birthday's M2, Ode to Joy's m2, the Entertainer's m6),
    the text says which notes; those tunes are PD.
  - Dropped as unverified: M7 song references (Take On Me, Superman, Bali Ha'i), descending m6/M6/m7 references.
    The M7 is taught as "octave minus a half step".
- *House of the Rising Sun*: the many traditional melodic variants differ substantially (and the best-known version is the Animals'
  arrangement), so **no melody was encoded**. The traditional progression i–bIII–IV–bVI is used as a named option in
  `ear-prog-minor-loops`.

### Audiation
- "Audiation" is Edwin Gordon's term for hearing and understanding music that is not sounding (background knowledge, not fetched).
  Cards go from 3 stepwise notes → random diatonic (narrow → wide) → leaps → PD melodies shown silently → chromatic neighbour
  and passing tones → bebop line with enclosure → long, leapy, chromatic line (level 10).

### Upper structures / altered dominants
- UST table over C7 (standard jazz theory, e.g. Levine's *Jazz Piano Book*): D/C7 = 9 #11 13 (13#11); A/C7 = 13 b9 3 (13b9);
  Eb/C7 = #9 5 b7 (7#9); Ab/C7 = b13 1 #9 (7#9b13). We map USTs to existing quality ids (see engine requests for a voicing mode).

---

## 2. Melody verification (every encoded melody)

Degree tokens use the **major-scale reference** (b3, b6, b7 written explicitly in minor/modal tunes; see engine request E1).
ABC files were downloaded from abcnotation.com and transcribed note-by-note; bar lengths were machine-checked.

| tune | source checked | notes |
|---|---|---|
| Amazing Grace (New Britain) | Colin Hume ABC (abcnotation `colinhume.com/ABC.txt/0030`), 3/4 in G | `5, | 1 - 3_ 1_ | 3 - 2 | 1 - 6, | 5, - 5, | …` exact |
| Greensleeves (A section) | Bruce Olson BM1 #168 (Gm, modern familiar version), cross-checked with BM1 #169/#170, Village Music Project | b6 in phrase body, raised 6/7 at the cadence (`b3 -_ 2_ 1 7, -_ 6,_ 7,`); beat = 8th; final bar simplified to a held tonic |
| Scarborough Fair | dmc.lizmilner.com ABC (E Dorian, 3/4) | exact; trad. tune, not the Simon & Garfunkel arrangement |
| Danny Boy / Londonderry Air (first half) | Paul Hardy session & songs tunebooks (C), cross-checked with 5 more ABCs in G and F (trillian.mit.edu) | all agree: pickup `7, 1 2 | 3 …` |
| Auld Lang Syne (verse) | Paul Hardy songs tunebook (sung version with lyrics, D), cross-checked with Thomas Wilson 1816 (Colin Hume) | Wilson's dance version adds a high-octave ornament; the sung version is used |
| When the Saints | Musica Viva ABC (C), cross-checked with Lester Bailey ABC (G) | exact |
| Swing Low (chorus) | John C. Campbell Folk School Song Book ABC (G), cross-checked with Digital Tradition ABC (E) | exact |
| Silent Night | Paul Hardy Xmas tunebook (C, 3/4) | exact; last-phrase `5 4 2 | 1` per source |
| Ode to Joy, Twinkle, Frère Jacques, Mary Had a Little Lamb, Happy Birthday, Joy to the World, Eine kleine Nachtmusik (opening), Star-Spangled Banner (first phrase), Bridal Chorus (4 notes), My Bonnie (4 notes), Jingle Bells (verse, 5 notes), The Entertainer (opening), Zarathustra (3 notes) | standard, well-attested melodies; pitches checked against memory of standard notation and interval lists | Happy Birthday pickup "Hap-py" simplified to two 8ths (dotted rhythm not representable at quarter-beat) |

---

## 3. Curriculum ladder

**Intervals** (ear-intervals)
- L1: M3 vs P5 up; m3 vs M3 up (song lessons: octave, P5, M3, M2)
- L2: M2/M3/P4/P5 up; m3/M3/P5 down; harmonic m3/M3/P5 (lessons: P4, M3↓, m3↑, m3↓, m2)
- L3: m2–M3 up; P4/TT/P5 up; small intervals down; harmonic rubs (m2/M2/m7/M7) (lessons: P4↓, M6, TT & m7)
- L4: 6ths/7ths up; P4–M7 down; harmonic 3rds vs 6ths (lesson: m6)
- L5: all up; all harmonic · L6: mixed-direction **drill block**; b9/9/#9 · L7: harmonic 9/11/#11/13
- L8: all 7 tensions, mixed · L9: close vs spread (2/9, 4/11, 6/13)

**Chords** (ear-chords)
- L1 maj/min (block, arpeggiated) → L2 +dim → L3 four triads, sus2/sus4, inversion (maj close)
- L4 triads inverted & spread, minor inversions, maj7 vs 7, 7 vs m7 → L5 maj7/7/m7, **dim/m7b5/dim7**, spread-triad inversion
- L6 five 7ths (**drill block**), minor colours (m7/mMaj7/m6), maj7/6/7/7sus4, maj7 drop-2 inversions, 9ths
- L7 7ths inverted, dom7 inversions, major extensions (#11, 6/9), dominant extensions & sus, 7/7b9/7#9
- L8 minor extensions, single alterations (b9 #9 #11 b13) → L9 dominant spectrum (13 → 13b9 → 7#9b13 → alt) → L10 upper-structure triads

**Progressions** (ear-progressions). Every card has an adaptive tempo range (typically 60 → 140–240 bpm).
- L1 two-chord vamps · L2 three-chord tricks, pop loops · L3 **diatonic drill block**, major cadences, minor loops (Andalusian, Dorian, Rising Sun)
- L4 12-bar blues forms, ii–V–I vs neighbours, borrowed IV/iv/bVII/bVI
- L5 minor cadences incl. **Phrygian half**, major vs minor ii–V, turnarounds, secondary dominants, borrowed loops (bII, bVI–bVII–I, bIII)
- L6 jazz cadence spectrum (**backdoor**, tritone sub, minor plagal, deceptive, half), dominant chains, tritone subs, passing diminished
- L7 modal interchange with 7ths, chromatic mediants, relative major/minor ii–Vs (Autumn-Leaves type)
- L8 dominant colours in a ii–V–I, **Coltrane substitution**, **jazz drill block** · L9 major-third cycles (Giant Steps)

**Functional** (ear-functional)
- Degrees: L1 1-3-5 → L2 lower / upper tetrachord → L3 all major → L4 key-retention **drill block**, natural minor
  → L5 +b3/b7 → L6 +b6/#4 → L7 all 12 (major) → L8 all 12 (minor)
- Modes: L2 Ionian/Aeolian → L4 **one-note-changes** bright family (Lyd/Ion/Mix) and dark family (Dor/Aeo/Phr)
  → L5 all seven → L6 seven over drone (**drill block**), minor types → L7 dominant scales → L8 tension scales → L9 melodic-minor modes
- Bass: L2 I–IV–V–I → L3 I–vi–IV–V → L4 stepwise descending bass with inversions → L6 minor line cliché, walk-up with #iv°7 → L7 jazz turnaround with bII7

**Melody** (ear-melody)
- Dictation: L2 3 notes (1–3) → L3 4 (1–5) → L4 5 (1–1') → L5 minor → L6 6 notes wide → L7 Dorian → L8 8 notes harmonic minor
- Audiation: L1 1-2-3 → L2 random 3, Frère Jacques → L3 random 5 on neck, Ode to Joy (note names) → L4 leaps, Amazing Grace
  → L5 minor random, Greensleeves → L6 8 notes leapy, chromatic neighbours → L7 Londonderry Air → L8 chromatic lines → L9 bebop line → L10 leapy chromatic
- PD tune lessons (L1–4): Ode to Joy, Twinkle, Saints, Happy Birthday, Auld Lang Syne, Swing Low, Silent Night, Scarborough Fair (Dorian)

---

## 4. Engine requests

E1. **Degree-token convention (please confirm).** All `melody`, `degrees`, `range` tokens in ear.js are intervals from the tonic
    against the **major scale** (Aeolian's 3rd = `b3`, Dorian's 6th = `6`), the same convention as chart romans. `scale` only sets
    the key context (cadence, drone, generated-melody pool). If the engine instead reads degrees relative to `scale`, every minor/modal
    melody (Greensleeves, Scarborough Fair, minor degree cards) would be wrong. Please confirm or tell us to rewrite.

E2. **Dotted rhythms and short rests in melodies**: we use `-_` (hold half a beat more) and `._` (half-beat rest). These follow the
    stated grammar (`_` = half-beat suffix applied to `-` and `.`), but please support them explicitly.

E3. **Beat unit / meter for `listen` and `audiate`**: 6/8 tunes and 16th-note figures are encoded with **beat = 8th note** at a doubled
    `tempo` (e.g. Greensleeves at 180). A `beat: "8th"` or `meter: "6/8"` field on these quizzes would make tempo honest and allow
    a metronome. Bar lines (`|`) are used throughout and are assumed to be purely visual.

E4. **Octave and compound 3rds/5ths/7ths are missing from the interval vocabulary.** Please add `8`, `b10`, `10`, `12`, `b14`, `14`, `15`.
    Ready-to-add pools once supported: octave card `["5","8"]` up L2; `["b10","10"]` harmonic L6 (guitar "tenths");
    `["8","12","15"]` mixed L6; full compound `["b9","9","b10","10","11","#11","12","b13","13","b14","14","15"]` mixed L9.

E5. **`audiate` cadence field**: SCHEMA says the engine plays the starting note "and optionally a cadence" but names no field. We used
    `cadence: true` (same name as `ear-degree`/`ear-melody`). Please adopt it or rename.

E6. **Random chromatic audiation**: `melody: null` generates diatonic melodies only. Please add `chromatic: true` (chromatic neighbour or
    passing tones resolving by half step) so the top levels can be random; for now they use fixed authored lines.

E7. **Ranges with octave marks**: `range: ["5,", "5'"]` and `["1", "1'"]` are used in `ear-melody`/`audiate`. Please accept melody-token syntax in `range`.

E8. **Voicing for extended/altered `ear-chord` qualities**: cards with 9ths, 13ths, altered and UST qualities omit `voicing` (engine default).
    Requests: (a) a sensible default for 5+-note chords (e.g. rootless or 3-7-tension guitar voicing over a bass root);
    (b) `voicing: "upper-structure"`: triad on top of a 3–b7 shell, with the triad derived from the quality
    (13#11 → II, 13b9 → VI, 7#9 → bIII, 7#9b13 → bVI); (c) `7alt` needs fixed `tones` in ear-chord: suggest `["3","b7","#9","b13"]`.

E9. **Ambiguous answers**: inverted chords can be heard as another chord with the same notes (Am7/C = C6, m7b5 = m6 over another
    root; dim7 and aug are symmetrical). Please either accept equivalent answers or avoid generating the ambiguous inversions;
    never use `inversions: true` with `dim7`/`aug` as single answers.

E10. **Progression playback**: for `ear-progression` and `ear-bass`, please keep the **bass audible and separate** (a bass voice
    playing the root or slash bass) and voice-lead the upper parts. Several cards (Phrygian vs plain half cadence, passing diminished,
    inversions) differ only in the bass. A per-quiz `voicing`/`voiceLead` option would help.

E11. **Tempo adaptivity**: progression cards give both a template `tempo` {start,min,max,step} and `quiz.tempo: [min,max]`. Please climb
    tempo on success within that range (the user's favourite mode is "same progressions, faster"). Also helpful: a "replay slower" button.

E12. **Drill blocks** (`length: "medium"`): please run a sequence of trials for `minutes` and report accuracy/streak.
    `ear-deg-major-drill` needs a **cadence-once** option (cadence only at the start of the block, for key retention): e.g. `cadence: "once"`.

E13. **`ear-bass` variety**: each template has one fixed chart. Please allow a pool (`charts: [...]` or a `$param` resolved inside `quiz`)
    so one template can rotate several bass lines. Answer buttons must include chromatic degrees (#4, b7, 7, 6, b2), which the
    walk-up, line-cliché and tritone-sub cards need.

E14. **`ear-mode` drone-melody generation**: generated melodies should feature each mode's **characteristic note** (#4 Lydian, b7 Mixolydian,
    6 Dorian, b6 Aeolian, b2 Phrygian, b5 Locrian, etc.) at least twice and on strong beats, or the parallel-mode cards can't be answered.

E15. **Minor cadence for `ear-degree`/`ear-melody` with `scale: "aeolian"`**: suggest i–iv–V7–i (harmonic-minor V for a clear tonic) while the
    test notes come from the stated scale; for `scale: "dorian"` use i–IV–i.

E16. **`ear-interval` spacing/register**: `ear-int-simple-vs-compound` relies on the engine generating both close (2, 4, 6, b2) and
    spread (9, 11, 13, b9) dyads; please keep harmonic dyads in a mid register (avoid muddy low m2/M2).

E17. Nice to have: `listen` with an optional accompaniment `chart` under the melody (hearing degrees against harmony), and an
    optional `visual` of the melody on the neck after a `listen` card.

---

## 5. Sources

- Functional Ear Trainer (Benbassat-based app): https://apps.apple.com/app/id1088761926 · https://sourceforge.net/app/functional-ear-trainer/
- Advancing Musician, "Functional ear training": https://advancingmusician.com/functional-ear-training
- Advancing Musician, "2 strategies to master chromatic notes with functional ear training": https://advancingmusician.com/2-strategies-to-master-chromatic-notes-with-functional-ear-training
- Benny Sutton glossary, functional ear trainer: https://bennysutton.com/glossary/functional-ear-trainer
- Pearltrees capture of miles.be ("Since 2002 Miles.be offers… Functional Ear Trainer"): https://www.pearltrees.com/u/9126946-free-training-tools-musicians
- Bruce Arnold, Ear Training Guided Tour: https://brucearnold.com/?p=794 · Backstage interview: https://www.backstage.com/magazine/article/ear-training-bruce-arnold-64217/ · Minor key ear training: https://brucearnold.com/?p=1576
- Berklee: Ear Training 1 https://college.berklee.edu/node/2270561 · ET2 https://college.berklee.edu/node/2270566 · ET3 https://college.berklee.edu/node/2473251 · Ear Training Core https://college.berklee.edu/node/2464596 · catalog https://www.berklee.edu/node/2210051 · ET4 syllabus (Scribd) https://www.scribd.com/document/447701987/336412781-Ear-Training-4-pdf
- Berklee/Coursera, Develop Your Musicianship: https://www.coursera.org/learn/develop-your-musicianship/home/welcome
- Sierra College, *Equipping the Musical Ear*: https://human.libretexts.org/Courses/Sierra_College/Equipping_the_Musical_Ear
- Baylor, ETC detailed TOC: https://openbooks.library.baylor.edu/app/uploads/sites/40/2024/05/ETC-detailed-TOC.pdf
- Stambaugh & Nichols (2019), interval identification, error detection and timbre: https://digitalcollections.ric.edu/record/1995/files/stambaugh_nichols_2019_the_relationships_among_interval_identification_pitch_error_detection_and_stimulus_timbre_by.pdf
- Girona conservatory harmonic-interval study (CLACSO repository): https://biblioteca-repositorio.clacso.edu.ar/xmlui/handle/CLACSO/128594?show=full
- Killam, Lorton & Schubert (1975), "Interval Recognition: Identification of Harmonic and Melodic Intervals", *Journal of Music Theory* (citation only)
- Wikipedia, Interval recognition (reference-song lists): https://en.wikipedia.org/wiki/Interval_recognition
- abcnotation.com tune sources (downloaded ABC): Amazing Grace `colinhume.com/ABC.txt/0030`; Greensleeves `trillian.mit.edu/~jc/music/abc/mirror/BruceOlson/BM1/0069–0073`, `gitlab.com/chrisspen/abc-music/.../greensleeves_gm`, `richardrobinson.tunebook.org.uk/static/tunebook/07451`; Scarborough Fair `dmc.lizmilner.com/viewabc.vbhtml?file=Scarborough+Fair/0002`; Danny Boy `pghardy.net/tunebooks/pgh_session_tunebook/0141`, `pgh_songs_tunebook/0006`, `trillian.mit.edu/~jc/music/abc/Ireland/song/0016`, `/0018`, `/air/Danny_Boy_F/0000`; Auld Lang Syne `pghardy.net/tunebooks/pgh_songs_tunebook/0001`, `colinhume.com/ABC.txt/0061`; When the Saints `trillian.mit.edu/~jc/music/abc/demo/Tunes/WhenTheSaintsGoMarchingIn/0000`, LesterBailey mirror; Swing Low `trillian.mit.edu/~jc/music/abc/mirror/mindspring.com/~thornton.rose/SwingLowSweetChariot/0001`, `sniff.numachi.com/.../SWINGLOW`; Silent Night `pghardy.net/tunebooks/pgh_xmas_parts_tunebook/0009`. (Search: https://abcnotation.com/searchTunes)
- Background knowledge (not fetched): Edwin Gordon on audiation; Mark Levine, *The Jazz Piano Book* (upper structures); Happy Birthday copyright history (Marya v. Warner/Chappell, 2015; settlement 2016).
