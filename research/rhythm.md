# Rhythm, picking & styles: research notes

Content file: `content/rhythm.js` (prefix `rhy-`). It has 171 templates (rhythm 65, picking 39, styles 51, theory 16) and 40 concepts.
Levels: L1 9 · L2 13 · L3 33 · L4 34 · L5 38 · L6 25 · L7 12 · L8 4 · L9 2 · L10 1. Lengths: short 63 · medium 96 · long 12.
Final difficulty also scales via the `tempo` ranges and param `lvl`s, so many L3–6 cards reach L7–9 at the top of their tempo range.

Validation (scratch script, not shipped) checks the following for every rhythm spec in visuals, demos (including arrays) and concept visuals:
- slot count = beats × grid × bars, with spaces and `|` ignored
- `$param` patterns, which are expanded to every pool value
- pick-token count = strokes count = fingers count
- accents in range
- valid tokens, meters, metronome fields and concept links
- `{p:…}` placeholders
- constant-motion stroke parity: D/d/X/T on even slots and U/u on odd slots for grid 2/4 and x/8 grid 1. Flamenco, jazz and all-downstroke cards are exempt by tag.

Result: 0 errors.

---

## 1. Authoring conventions used (please confirm, see Engine requests)

- **`accents` are 0-based slot indices** into the pattern, after removing spaces and `|`.
- **In x/8 meters a beat is one 8th note.** Slots = numerator × grid × bars, and `tempo` counts 8ths. So 12/8 with grid 1 has 12 slots, one per flamenco compás beat. For 7/8, 9/8 and 12/8 grooves the tempo ranges are written in 8th-note bpm (e.g. 120–240).
- **Constant motion** is the default for strum grids: down on even slots, up on odd slots. Non-alternating strokes appear only where they're idiomatic: all-downs rock, jazz stabs, flamenco and the swung-8th shuffle on a triplet grid.
- **`-` versus `.`**: `-` is an air strum and the chord keeps ringing. `.` is a rest and the chord is choked. Rest-heavy styles (skank, jazz stabs, "play the rests") depend on this difference.
- **Pick-form pinches** may contain more than 2 strings, e.g. `5+4+3+2` for a bossa thumb plus a three-finger pluck. In `fingers`, pinches join with `+` (`p+a`, `i+m+a`) to match the pick token.
- **Hybrid picking**: in hybrid cards the `fingers` token `p` means the pick.
- `quiz.answer` for `choice` is assumed to be a 0-based index, matching the schema example (`answer: 1`).
- Placeholders: `{key}` renders as e.g. "A minor", so prompts that need only the letter use `{root}` (e.g. "{root} minor pentatonic").
- **Chord changes** are bar-level only, done with `demo` arrays (one spec per bar). Mid-bar pushes and anticipations are therefore shown as **accents on a single chord** (see the engine requests).

---

## 2. Curriculum ladder

### A. Subdivisions & time (category `rhythm`)
| Level | Cards |
|---|---|
| 1 | quarter pulse (muted), 8ths all-downs, 8ths down-up |
| 2 | quarters↔8ths switch, triplets intro |
| 3 | accent the &s, triplet accent shift, 16ths muted, gap click (8ths), click on 2&4 (swing), tresillo 3-3-2, swing ratio, 12/8 feel, rests |
| 4 | 16th accent partials, single 16th partial, 8↔16 switch, 8↔triplet switch, click 2&4 (16ths), cells & clave |
| 5 | 16th pairs, 16↔triplet switch, subdivision ladder 1-2-3-4-6, sextuplets, gap click (16ths, triplets), 8th displacement, 5/4, 3:2 thumb vs finger, triplet partials, ghosts vs accents |
| 6 | 6↔16 switch, quintuplets, one click per bar, 12/8 bell, groups of 3, 16th swing, 7/8, 7/4, 9/8, quarter-note triplets |
| 7 | 16↔triplet every 2 beats, groups of 5, 16th displacement, 3:4, 4:3 thumb vs finger, pocket placement (ahead/on/behind) |
| 8 | tuplet ladder 4-5-6-5-4, 4:3 accents in 3/4, beat ↔ quarter-note triplets through the gap |
| 9 | 5:4, metric modulation |
| 10 | free subdivision improvisation (any of 2/3/4/5/6 per beat, click on 2&4) |

### B. Strumming
L1 quarter-note chord changes (G-C-D-G), waltz → L2 8th-pattern ladder (7 patterns, weighted), 6/8, backbeat accents → L3 tempo ladder for "Old Faithful", chuck on 2&4, open/muted bars → L4 16th-pattern ladder (7 patterns), 16th chuck groove, the push → L5 half-time ↔ double-time.

### C. Plectrum technique (`picking`)
- **Alternate:** 8ths (L1) → 16ths and triplets (L3) → sextuplets (L5) → quintuplets (L7). Accent groupings at L5.
- **Motion:** speed bursts (L4); inside/outside (L4); **USX** with 2 notes per string (L4); **DSX** with offset 2 notes per string (L5); 3nps strict alternate needing both escapes (L6); crosspicking (L6).
- **Economy:** 3nps ascending (L5), descending (L6).
- **Sweep:** 3-string (L5), 5-string (L7), 6-string sextuplets (L8).
- **Skipping:** octaves (L3), arpeggio skips (L6).
- **Tremolo:** endurance (L4), melody on one string (L6). Downpicking endurance at L3.
- **Hybrid:** pick+m+a (L3), pinches (L4), chicken pickin' (L5), Travis with a pick (L5).

### D. Fingerstyle
p-i-m-a (L2) → arpeggio patterns, steady thumb (L3) → Giuliani triplets (L4) → syncopation over the thumb, forward roll (L5) → percussive (L6) → classical tremolo p-a-m-i (L7).

**Travis ladder:** thumb alone (L2) → fingers on &s (L3) → pinch (L4) → syncopated melody note, progression C-Am-G-C, hybrid (L5).

Polyrhythm thumb-vs-finger cards (3:2 at L5, 4:3 at L7) live in section A.

### E. Styles (each starts very easy)
- **Funk:** scratch motion (L2) → chord hits on chosen 16ths (L3) → Nolen-style chicken scratch on E9 (L4) → Rodgers-style comping, Em7–A9 vamp (L5) → gap-click funk, single-note 16th line (L6) → swung-16th funk (L7).
- **Bossa / samba:** thumb on 1 & 3 (L2) → one-bar pattern 1, 2, &3 (L3) → two-bar bossa-clave pattern (L4) → ii–V–I (L5) → anticipations (L6). Samba: thumb with the surdo accent on 2 (L3) → batida (L4) → partido alto (L5).
- **Flamenco:** rumba (L3) → four-finger rasgueado, tangos, soleá count & palmas (L4) → triplet rasgueado/abanico, soleá with E–F, soleá al golpe (L5) → rasgueado landing, bulerías from 12, bulerías as 6/8 + 3/4, picado (L6) → alzapúa (L7).
- **Reggae / ska:** skank on 2 & 4 (L2) → ska upstrokes (L3) → double skank (L4).
- **Blues:** shuffle strum (L2) → shuffle on the triplet grid, boogie 5-6 (L3) → slow-blues triplets (L4).
- **Country / bluegrass:** boom-chick (L1) → boom-chicka (L2) → train beat (L3) → Carter scratch (L4) → bluegrass at speed with the click on 2&4 (L5).
- **Rock:** palm-muted 8ths (L1) → 3-3-2 open accents, riff with pushes (L3) → gallop (L4) → alternate-picked 16th chug (L5).
- **Jazz comping:** Freddie Green four-to-the-bar (L3) → over ii–V–I, Charleston (L4) → reverse Charleston, anticipations (L5) → comping-vocabulary mixer (L6).

### F. Theory cards (`mode: theory`, tag `rhythm`)
Counting 16ths, stroke direction, triplet alternation, swing ratio, soleá accents, the bulerías start beat, seguiriya grouping, tangos, hemiola (6/8 vs 3/4), common grid for 4:3, clave 3-2 (reveal), which stroke escapes, inside vs outside, the economy rule, counting quintuplets (reveal), odd-meter groupings.

### "Same pattern, new tempo" design
Almost every play card has `tempo {start, min, max, step}` and `vary: ["tempo", …]`. The follow-up card can then re-serve the same pattern at a new tempo, or with a new chord or pattern from the pool. Pattern pools (`strum`, `hits`, `cell`, `shift`, `comp`, `partial`, `pair`, `target`, `group`) carry `lvl` weights so the adaptive engine walks through them.

---

## 3. Research notes & key facts (with sources)

### Flamenco compás
- **Soleá:** 12 beats with accents on **3, 6, 8, 10, 12**. Tension starts on 3, increases on 6, peaks on 8 and resolves on 10. It can be counted as 12, as 3+3+2+2+2, or as 4×3 (most transcriptions use 3/4). Source: Canteytoque, *Compás explained*, https://canteytoque.es/compexp.htm
- **Siguiriya:** the same accent intervals, but it starts on soleá's beat 8. It's felt as 5 uneven beats where beats 1, 2 and 5 are equal and beats 3 and 4 last 1.5× as long, i.e. **2+2+3+3+2**. Source: Canteytoque (as above).
- **Bulerías:** essentially a double-time soleá. **Beat 12 becomes the downbeat**, with accents usually taught as **12, 3, 6 (or 7), 8, 10**. It's often felt in halves of 6. Teachers warn that 12-3-6-8-10 is an oversimplification but a correct starting map. Sources:
  - Richter Guitar, https://richterguitar.com/flamenco-guitar/flamenco-guitar-toques-and-palos/bulerias
  - StudioFlamenco, https://studioflamenco.com/soleares
  - Lessonface, *Compás and accents for flamenco guitarists*, https://www.lessonface.com/node/113372 (seen via search snippet; the page returned 403)
  - Wikipedia, *Soleá por bulerías*
- **Alegrías / soleá por bulerías:** the same 12-beat pattern counted from 12 (Wikipedia, *Soleá por bulerías*).
- **Tangos:** a 4-beat cycle, often paired into 8 to complete the chord cycle. Beat 1 is subdued (often silent) and **2, 3, 4 are heavily marked**, with sharply defined rasgueado. Rumba is looser and more syncopated. Sources: Wikipedia, *Tango (flamenco)*; Ravenna Flamenco, https://ravennaflamenco.com/palos/tango
- **Rasgueado:**
  - Four-finger rasgueado (c-a-m-i). Ravenna suggests starting it from the index.
  - The triplet rasgueado is driven by wrist rotation.
  - **Abanico** is a triplet rasgueado whose fingering varies by source: m+a then p (Richter), p-i-m, or "thumb down, little and index up" (LilyPond docs).
  - A continuous/redondo roll chains 4–5-stroke rasgueados (Douglas Niedt).

  Because sources disagree on abanico fingering, the cards tell the user to "pick one and stay consistent". Sources:
  - https://ravennaflamenco.com/fundamentals/flamenco-rasgueado
  - https://richterguitar.com/flamenco-guitar/flamenco-guitar-techniques-and-definitions/
  - https://douglasniedt.com/rasgueadospart3.html
  - https://en.wikipedia.org/wiki/Rasgueado
- **Alzapúa:** a thumb-only technique. The common cell is p down on one string, p down across 2–3 strings, p up across the same strings. Paco de Lucía used it as a "launch pad" for intensity in *Entre dos aguas*. Canteytoque's history page suggests a p-i-p mechanism as its antecedent. Sources: https://canteytoque.es/alzahist.htm, https://richterguitar.com/…/flamenco-guitar-techniques-and-definitions/, The Flamenco Guitar Podcast (libsyn).
- **Al golpe:** in al-golpe rhythm, beats 3, 6, 9 and 12 are often played as a quickly muted upstroke (StudioFlamenco). The golpe card uses the simpler "golpe on the accents" exercise.

### Bossa nova & samba
- **João Gilberto's approach:** the thumb plays bass on strings 6/5 on the beat, alternating root and fifth, while the fingers pluck the upper voices together as the syncopation. Sources: MasterClass *Bossa nova chords*; jazz.com encyclopedia; Riffhard *How to play bossa nova*.
- **Basic one-bar pattern:** "3 hits: one, two and the & of three, over half notes in the thumb". Source: Illinois Jazz Guitar, https://publish.illinois.edu/illinoisjazzguitar/2017/10/22/bossa-nova-guitar/
- **Teaching sequence used in the cards:** clave (3-2) → basic bossa → syncopated bossa (2nd and 3rd beats anticipated every other bar) → samba groove → partido alto (two common interpretations) → syncopated-bass samba → baião. Source: Premier Guitar, *Rhythm Rules: Brazilian Guitar 101*, https://www.premierguitar.com/rhythm-rules-brazilian-guitar-101
- **Partido alto:** a two-bar figure felt in 16ths, a bit slower than samba, and it can start in either bar. Its hallmark is the "high tone on the second sixteenth". João Bosco is the reference. Sources: bossanova-gitarre.de *Partido alto 2*; jazzguitar.be forum thread on Chico Pinheiro's Brazilian rhythms; cruiseshipdrummer.com *Partido alto variations*.
  **Caveat:** none of the fetched pages gave the exact 16th positions as text, because the notation was in images. The cards use the widely taught version (bar A `. x . x . . x .`, bar B `x . . x . . x .`) and say that interpretations vary. **Verify against Nelson Faria, *The Brazilian Guitar Book*, before release.**
- **Samba:** felt in 2. The surdo's strong note on beat 2 is imitated by the thumb. The samba batida card is labelled "one common teaching pattern".

### Funk
- **Jimmy Nolen (James Brown):** straight 16th strumming, small voicings on the high strings, and the fretting hand lightly squeezing and then releasing (the "chicken scratch"). Sources:
  - Wikipedia, *Jimmy Nolen*; Wikipedia, *Chanking*
  - Guitar World, *Chunking funk guitar (Jimmy Nolen / James Brown)*
  - Guitar World feature on Nolen (Steve Allsworth)
- **Pedagogy:** the right hand stays in constant down/up 16ths; practise with a fixed beat; at speed, a stray open string on one 16th won't ruin the groove. Source: Premier Guitar, *How to play funk guitar*.
- **Nile Rodgers:** sources only confirm "alternating strumming on almost everything", with no detailed mechanics. The Rodgers card is labelled "in the spirit of", not a transcription.

### Picking motion (Troy Grady, *Cracking the Code*)
- Current terms: **USX** (upstroke escape, formerly "downward pickslanting"), **DSX** (downstroke escape, formerly "upward pickslanting"), and **double escape** (no slant needed; crosspicking). Two-way pickslanting switches between them.
- With odd notes per string, string changes alternate between downstrokes and upstrokes. "Pop Tarts"-type licks are USX.
- Sources: forum.troygrady.com threads; https://www.fachords.com/pickslanting/; Guitar World *Cracking the Code* columns; troygrady.com Pickslanting Primer.
- **Derived results, verified by hand:**
  - 2 notes per string starting on a down (`3 3 2 2`) gives pure USX.
  - The same pattern shifted by one note (`3 2 2 3`) gives pure DSX.
  - 3nps strict alternate needs both escapes.
  - Outside picking is a downstroke on the thicker string of the pair; inside picking is an upstroke on the thicker string.
- **Burst / "speed first" practice:** this is a recurring Grady theme. The burst card cites it generally.

### Travis / Carter / boom-chick
- **Travis pedagogy:** thumb alternation alone first (C: strings 5 → 4, then 6 → 4), then add the middle finger, then "thumb vs fingers", then follow the roots, then melody notes. Sources: Fender *Travis picking on guitar*; guitarlessons.com *5 essential steps*; Premier Guitar *Twang 101*; goodguitarist.com.
- **Carter style** (thumb brush, Carter lick, church lick, Carter scratch): Maybelle Carter played the melody on the bass strings and "stirred the other strings". Its motion is thumb – frail – thumb – frail, and Bill Monroe adapted it for bluegrass. Sources: Wikipedia, *Carter Family picking*; Peghead Nation, *Maybelle Carter–Style Guitar* (Cathy Fink).

### Jazz comping
- **Four-to-the-bar** is the best-known jazz guitar rhythm. Source: jazzguitar.be, *10 essential jazz guitar chord rhythms* (403 on fetch; search snippet).
- **Tim Berens (freddiegreen.org):** "concentrate on time" first and don't obsess over voicings. Musicians who played with Green say he played an **even four** without accenting 2 & 4. The "standard 3-note voicings on strings 6, 4, 3" view is called a partial myth (Green often sounded fewer notes). Sources: https://www.freddiegreen.org/technique/berens.html, freddiegreen.org interviews, *Freddie Green Style: Other Resources*.
- **Charleston and reverse Charleston:** standard comping cells, written from common jazz pedagogy because the jazzguitar.be page was blocked. The rhythms are standard: Charleston = 1, &2; reverse = &1, 3.

### Polyrhythm, groupings, time
- **Gary Chaffee, *Patterns* (Alfred):** sticking and linear groupings of 3–8 notes; *Odd Time Stickings* has 3/4, 5/8 and 7/8 material and polyrhythm sections (4:3, 3:5). Sources: Tiger Bill review; cruiseshipdrummer.com, *Chaffee stickings revisited*. The cards apply the grouping idea (accents every 3 or 5 16ths, cycling over 3 or 5 bars).
- **Mick Goodrick, *The Advancing Guitarist* (Hal Leonard, 1987):** the book's "time" material is widely recommended (one lesson points to pp. 101–104). **Not verified first-hand**, so the 2&4 card cites it only as "cf.".
- **Click on 2 & 4:** a standard exercise in which you supply 1 & 3 yourself (Guitar Techniques/PressReader, Premier Guitar *Rhythm Rules: 6 essential exercises*).
- **Ralph Towner:** I found no sourced rhythm-practice advice. He is mentioned only as an example of 4:3/polyrhythmic fingerstyle (general knowledge), with no attributed quote.
- **Mnemonics:**
  - 3:2: "**not** dif-fi-cult" (slots 0, 2, 3, 4 of 6).
  - 4:3: "**pass** the gold-en but-ter" (slots 0, 3, 4, 6, 8, 9 of 12). Both checked against the grid.
- **12/8 bell (bembé):** x.x.xx.x.x.x, standard West African / Afro-Cuban timeline, from general ethnomusicology knowledge.

### Not verified, flagged for a human pass
1. Partido alto exact positions (see above).
2. The samba batida pattern (labelled "one common pattern").
3. The two-bar bossa pattern is clave-derived (bar 1: 1, &2, 4; bar 2: 2, &3). It's a reasonable teaching pattern, not a Gilberto transcription.
4. The soleá E–F harmony map (E on 1–6, F on 7–9, E on 10–12) is the common basic accompaniment, but it simplifies real playing.
5. The rumba "chuck on 2 & 4" pattern is a common teaching strum, not a canonical figure.

---

## 4. Engine requests

These are things the content needs that `SCHEMA.md` doesn't define. Where it matters, cards were authored with a supported workaround.

1. **Beat unit in compound/odd x/8 meters.** I assumed beat = 8th note, so slots = numerator × grid × bars and `tempo` = 8th-note bpm. Please confirm, or add `pulse: "8" | "dotted-4"` so 6/8 and 12/8 can be shown and clicked as 2 or 4 big beats. Used in 7/8, 9/8, 12/8, 6/8 cards and all 12-beat flamenco.
2. **`grid: 5` (quintuplets)** is used in 6 templates and 1 concept (rhy-quintuplets, rhy-tuplet-ladder-456, rhy-poly-5-4, rhy-pick-alt-quintuplets, rhy-tuplet-improv, rhy-thy-quintuplet-count, concept `tuplets`). Also requested:
   - **`grid: 7`** (septuplets) and **`grid: 8`** (32nds)
   - **metronome `subdivision: 5`**
3. **Mixed grids in one spec.** Either `grid: 12` (so 16ths and triplets share one bar) or per-bar grids (`grids: [4, 3]`). Switching cards currently use **demo arrays**; this needs:
   - **`visual` arrays** (or a multi-bar visual) so the diagram shows both sides of the switch
   - per-spec `tempo` in demo arrays (metric modulation)
4. **Metronome accent maps.** For example `metronome.accents: [3,6,8,10,12]` (1-based beats) or `grouping: [2,2,3]`. This would cover flamenco compás, odd-meter groupings and clave. The workaround is `accent: false` with accents shown only in the visual.
5. **More `clickOn` options:**
   - `"&"` (offbeats only)
   - a beat list (e.g. `[3]` for reggae one-drop)
   - "every other bar"
   - a half/double-time click
6. **Per-slot pitches for single-note pick patterns.** For example `frets: "5 7 5 7 …"` parallel to `pick`, or scale-degree tokens. Chromatic, scale-fragment, boogie (5 ↔ 6), 3nps, picado and tremolo-melody cards currently sound the held chord or open strings. The meaning of the existing `frets` ("held") field is undefined, so I didn't use it.
7. **Mid-pattern chord changes.** For example `chords: [{ at: 7, root, quality }]` or a `chart` on rhythm specs. This is needed for pushes and anticipations (rhy-strum-push, rhy-rock-riff-push, rhy-bossa-anticipation, rhy-jazz-anticipation). Their demos currently play the rhythm on one chord with the pushes accented.
8. **Fingers tokens:**
   - confirm `+`-joined pinch tokens (`p+a`, `i+m+a`)
   - add `c` for the little finger (rasgueado)
   - allow `fingers` on **strum** patterns (rasgueado c-a-m-i, thumb-down/up strums)
   - add a dedicated hybrid "pick" token, since `p` = pick is only a convention in hybrid cards
9. **Pinches of more than 2 strings** (`5+4+3+2`, `3+2+1`). Please confirm. They're used for bossa/samba plucks, the Carter brush and alzapúa thumb strums.
10. **Bass-string control for `T`.** For example `T` = root and `t` = alternate bass (5th), so boom-chick and Travis-in-strum-form can alternate root/fifth. Currently the alternation is described in text only.
11. **16th-level swing.** Confirm that `swing` on a grid-4 spec delays the e/a, and that metronome swing with subdivision 4 does the same. Used in rhy-swing-16ths and rhy-funk-16th-swing.
12. **Dedicated tokens:**
    - **golpe** (tap on the guitar top), distinct from `X` (palm chuck); currently `X` covers both
    - a **palm-mute** flag/token for pick patterns (rock chugs, train beat)
    - a **dead-note** token in pick form (single-note funk)
13. **Confirm `.` vs `-` semantics.** `.` = choke/rest and `-` = no contact, chord rings. Several style cards depend on it.
14. **Param bundles.** A param value that sets several spec fields together, e.g. `{ v: { pick: "…", strokes: "…" } }` or `"$p.pick"`. This would allow direction-dependent variants (gallop vs reverse gallop, ascending vs descending economy) in one card. The workaround is separate cards.
15. **More meters:** `3/8`, `5/8`, `10/8`, `11/8` (and maybe `12/4` for a flamenco "12" display).
16. **Polyrhythm lane view.** Draw thumb and finger streams of a `pick` pattern as two lanes (3:2, 4:3 cards).
17. **Schema example inconsistency.** In §4.5 the example has `grid: 4` with `pattern: "D-DU-UDU"`: that's 8 slots, but 4/4 × 4 = 16. It probably should read `grid: 2`. Content follows the rule (slots = beats × grid × bars), not the example.
18. **Concept-id collisions.** I avoided generic ids (e.g. `rhythmic-anticipation`, not `anticipation`). Ids used: subdivisions, constant-motion, triplets, tuplets, swing, shuffle, accents-ghosts, gap-click, click-placement, pocket, groupings, displacement, syncopation, rhythmic-anticipation, odd-meters, polyrhythm, hemiola, rhythmic-cells, clave, funk-16ths, bossa-nova, partido-alto, rasgueado, flamenco-compas, alzapua, skank, boom-chick, palm-muting, four-to-the-bar, charleston, alternate-picking, pick-escape, economy-picking, sweep-picking, hybrid-picking, crosspicking, tremolo-picking, travis-picking, thumb-independence, pima.

---

## 5. Sources (consolidated)

- Canteytoque, Compás explained: https://canteytoque.es/compexp.htm · Alzapúa history: https://canteytoque.es/alzahist.htm
- StudioFlamenco, Soleares: https://studioflamenco.com/soleares · Soleá por bulerías: https://www.studioflamenco.com/solea-por-bulerias
- Richter Guitar, Bulerías: https://richterguitar.com/flamenco-guitar/flamenco-guitar-toques-and-palos/bulerias · Techniques & definitions: https://richterguitar.com/flamenco-guitar/flamenco-guitar-techniques-and-definitions/
- Ravenna Flamenco, Rasgueado: https://ravennaflamenco.com/fundamentals/flamenco-rasgueado · Tango: https://ravennaflamenco.com/palos/tango
- Douglas Niedt, Rasgueados: https://douglasniedt.com/rasgueadospart3.html
- Wikipedia: Soleá; Soleá por bulerías; Tango (flamenco); Rasgueado; Jimmy Nolen; Chanking; Carter Family picking; Partido alto
- Lessonface, Compás and accents for flamenco guitarists: https://www.lessonface.com/node/113372 (search snippet only)
- The Flamenco Guitar Podcast (alzapúa lessons): https://theflamencoguitarpodcast.libsyn.com/
- Premier Guitar, Rhythm Rules: Brazilian Guitar 101: https://www.premierguitar.com/rhythm-rules-brazilian-guitar-101
- Premier Guitar, How to play funk guitar: https://www.premierguitar.com/lessons/rhythm/how-to-play-funk-guitar
- Premier Guitar, Rhythm Rules: 6 essential exercises: https://www.premierguitar.com/articles/Rhythm_Rules_6_Essential_Exercises_to_Improve_Your_Groove
- Illinois Jazz Guitar, Bossa Nova Guitar: https://publish.illinois.edu/illinoisjazzguitar/2017/10/22/bossa-nova-guitar/
- Riffhard, How to play bossa nova: https://www.riffhard.com/how-to-play-bossa-nova-on-the-guitar
- bossanova-gitarre.de, Partido alto 2: https://www.bossanova-gitarre.de/en/partido-alto-2/
- jazzguitar.be forum, Chico Pinheiro Brazilian rhythms: https://www.jazzguitar.be/forum/comping-chords-chord-progressions/61967-chico-pinheiro-brazilian-rhythms-guitar.html
- cruiseshipdrummer.com, Partido alto variations / Chaffee stickings revisited
- Guitar World, Chunking funk guitar (Nolen): https://guitarworld.com/lessons/chunking-funk-guitar-jimmy-nolen-james-brown
- Troy Grady forum and site: https://forum.troygrady.com/ · https://troygrady.com/ · Fachords, Pickslanting: https://www.fachords.com/pickslanting/
- Frank Gambale, *Speed Picking* (REH, 1994)
- Fender, Travis picking: https://www.fender.com/articles/how-to/travis-picking-on-guitar · guitarlessons.com, 5 steps to Travis picking · Premier Guitar, Twang 101: Travis picking essentials
- Peghead Nation, Maybelle Carter–Style Guitar: https://pegheadnation.com/string-school/courses/maybelle-carter-style-guitar
- freddiegreen.org, Basics of Freddie Green Comping (Tim Berens): https://www.freddiegreen.org/technique/berens.html
- jazzguitar.be, 10 essential jazz guitar chord rhythms (search snippet only)
- Gary Chaffee, *Patterns* series (Alfred); review: https://www.tigerbill.com/drumreviews/Chaffee_odd_time_stickings.htm
- Mick Goodrick, *The Advancing Guitarist* (Hal Leonard, 1987)
- Mauro Giuliani, *120 Studies for the Right Hand*, Op. 1
- Guitar Techniques (PressReader), "Rocco's tips for developing good time keeping"
