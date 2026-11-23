# Fundamentals: plan v1

**Status (2026-11-23):** built as `fundamentals.html` with ten modes and tested at phone width.

A fast, game-like drill app for the things a guitarist should know cold. It's a separate installable page
(`fundamentals.html`), like `caged.html`, `ear.html` and `earium.html`. It's built on the existing engine:
- `src/theory.js` for chords, scales and spelling.
- `src/fretboard.js` for CAGED windows, drop voicings, string sets and region notes, so every reveal is correct by
  construction.
- `src/audio.js` for the click and the drone.

## 0. What every mode shares

- **A prompt, then two buttons: Got it / Reveal.** Reveal shows the answer (a neck map, the formula or the chords),
  and the drill carries on.
- **Sessions.** These are 10 prompts, 20 prompts, or 5 minutes. Scoring:
  - A clean answer (no reveal) scores points, with a speed bonus where the app can time it.
  - A reveal scores 0 and marks the item fuzzy.
  - A streak multiplier runs for consecutive clean answers.
  - The app keeps a best score per mode and per session length.
- **Fuzzy tracking.** Every item has a strength from 0 to 1.
  - A reveal or a wrong answer drops it.
  - A clean answer raises it, more when it's fast.
  - Strength fades slowly with time, so old items come back.
  - **Item** means the thing being learned, apart from the key. For example, "m7 drop 2, set 4-3-2-1" or "Lydian
    dominant formula". The **key** is tracked separately, so a weak key shows up too.
- **The Fuzzy section.** It lists everything below a threshold, grouped by mode, weakest first, and the weak keys.
  There's a "Work on fuzzy" session that draws only from that list. An item leaves the list after three clean answers
  on different days.
- **Key weighting.** Random keys are drawn by weight, raised for keys that are fuzzy. The defaults follow the drone
  order in Guitarnautics, and the weights are editable in Settings.

  | Key | E | A | G | D | C | F | B♭ | E♭ | A♭ | B | D♭ | F♯/G♭ |
  |---|---|---|---|---|---|---|---|---|---|---|---|---|
  | Weight | 5 | 5 | 5 | 5 | 5 | 5 | 5 | 5 | 3 | 3 | 3 | 2 |

  The jazz keys (F, B♭, E♭, A♭, D♭) are bumped (owner's decision, 2026-11-23).

  Minor keys use the weight of their relative major. Spelling follows the key: A♯ as a chord root appears only where
  the key calls for it (F♯ major's III); otherwise it's B♭.
- **Settings filter.** Settings turns families, qualities and string sets on and off, so a session can be just
  "drop 2 sevenths" or just "melodic minor modes".

## 1. Shapes (chord and arpeggio drill)

A prompt such as **"All inversions of B♭m7, drop 2, strings 4-3-2-1, up the neck"**. You play it on the guitar, then
press Got it or Reveal. Reveal shows every shape on the neck with the bass degree labelled. A timer runs from the
prompt to Got it, for the speed bonus.

There's an **optional metronome** (BPM −/+ and tap) with a target such as "one inversion per bar". An optional rule
raises the BPM by 4 after a clean answer at tempo. There's also an **optional drone** on the key, useful for
arpeggios.

### 1a. Triads
- **Qualities:** maj, min, dim, aug. sus2 and sus4 are off by default.
- **Close voicings:** strings 6-5-4, 5-4-3, 4-3-2, 3-2-1.
- **Spread voicings:** strings 6-4-3, 5-3-2, 4-2-1.
- **Tasks:**
  - **Horizontal.** One string set, every inversion up the neck: root, 1st, 2nd, root.
  - **Vertical.** Every inversion inside one CAGED area, across all sets.
  - **Morph.** One inversion going maj → min → dim → aug, then the next inversion.

### 1b. Seventh chords
- **Core qualities:** maj7, 7, m7, m7♭5, °7.
- **More qualities:** m(maj7), 6, m6, 7sus4, maj7♯5, 7♯5, 7♭5.
- **Voicings:**
  - Drop 2: strings 6-5-4-3, 5-4-3-2, 4-3-2-1.
  - Drop 3: strings 6-4-3-2, 5-3-2-1.
  - Drop 2 & 4 (later level): strings 6-5-3-2, 5-4-2-1.
  - Shells (1-3-7 and 1-7-3 with the root on the 6th and 5th strings): maj7, 7, m7, m7♭5, °7, 6, m6.
- **Tasks:**
  - All four inversions on one set, up the neck.
  - Every inversion on every set, across the whole neck.
  - Morph one inversion: maj7 → 7 → m7 → m7♭5 → °7.

### 1c. Extensions on four-note shapes (later level)
- **What changes:** a 9 in place of the root, a 13 in place of the 5th, and alterations (♭9, ♯9, ♯11, ♭13) as
  one-fret moves.
- **Where:** drop 2 on strings 4-3-2-1 and 5-4-3-2.
- **Chords:** maj9, 9, m9, 13, 7♭9, 7♯9, 7alt, m11, maj7♯11.

### 1d. Arpeggios
- **Types:**
  - Triads: maj, min, dim, aug.
  - Sevenths: maj7, 7, m7, m7♭5, °7, m(maj7), 6, m6.
  - Ninths (later level): maj9, 9, m9.
- **Positions:** a CAGED area (C, A, G, E or D shape of that key). Play from the lowest chord tone in the area to the
  highest and back.
- **Starting note:** the root, 3rd, 5th or 7th. For example, "start on the 3rd and climb two octaves to the 3rd".
- **Variations:**
  - **3-to-9.** Play the arpeggio from the 3rd: Bm7 over G = Gmaj9.
  - **Whole neck.** One arpeggio through all five areas in order.
  - **In 3rds.** The arpeggio as broken pairs.

### 1e. Diatonic sequences
The diatonic triads or 7ths of a key on one string set, climbing the key. For example, "E♭ major, diatonic 7ths, drop
2, set 4-3-2-1, start in 1st inversion". There's also a sequence task: "the CAGED forms of A, all five, in order up
the neck".

(Scales played on the neck are mode 5, the Mode Tester.)

## 2. Chord Finder (diatonic chords, against the clock)

A key comes up, such as **"A♭ major"**. You build its seven chords as fast as you can. For each degree, tap a root
(letters A–G plus ♭/♮/♯, so the spelling has to be right) and a quality. The clock runs until all seven are in, and a
wrong chord costs time. Reveal shows the remaining chords with Roman numerals.

- **Chord sizes:** triads, 7ths, or both.
- **Scales:**
  - Major and natural minor are on by default.
  - Harmonic minor and melodic minor are later levels.
  - Harmonic major is optional.
- **Quick-fire variant.** One question at a time, such as "vi of A♭?" or "iiø7 in C minor?". Every degree is tracked
  for fuzziness: "you're slow on iii and vii°".
- The app keeps a best time per key and scale.

## 3. Scale Formulas

A scale name comes up, such as **"Lydian dominant"**. You tap its degrees on a 12-button grid
(1 ♭2 2 ♭3 3 4 ♯4 5 ♭6 6 ♭7 7), then Check. Reveal or a wrong answer shows:
- The formula.
- The steps (W W W H W H W).
- The parent scale ("4th mode of melodic minor").
- The colour note.

Then the quiz carries on.

**Reverse variant.** A formula is shown and you name the scale from a short list.

### The scales, in three tiers
1. **Core.**
   - The seven major modes.
   - Major and minor pentatonic.
   - The blues scale and the major blues scale.
   - Harmonic minor and melodic minor.
2. **Jazz.**
   - The rest of the melodic minor modes: Dorian ♭2, Lydian augmented, Lydian dominant, Mixolydian ♭6, Locrian ♮2,
     altered.
   - Phrygian dominant.
   - Half-whole and whole-half diminished, whole tone.
   - The bebop scales: dominant, major, Dorian, melodic minor. Bebop major is the Barry Harris 6th-diminished scale.
   - Dominant pentatonic and minor 6 pentatonic.
3. **Colour.**
   - The rest of the harmonic minor modes: Locrian ♮6, Ionian ♯5, Dorian ♯4, Lydian ♯2, altered ♭♭7.
   - The harmonic major modes: harmonic major, Dorian ♭5, Phrygian ♭4, Lydian ♭3, Mixolydian ♭2, Lydian augmented ♯2,
     Locrian ♭♭7.
   - Double harmonic major, Hungarian minor.
   - In-sen, Hirajoshi.
   - The augmented (hexatonic) scale.

That's 46 scales in all (13 core, 16 jazz, 17 colour): every scale in `src/theory.js` except chromatic.

## 4. Interval Finder (on the neck)

A key and an area come up, such as **"Key of A, E-shape area (frets 4–8): find every ♭3"**. You **tap** them on the
on-screen neck before a countdown runs out, then Check (decided 2026-11-23).

- **Scope.** One CAGED area or the entire neck.
- **How many to find.** All of them, or any one of them.
- **One or two intervals at a time.** For example, "every ♭3 and ♭7", with each tap counted for whichever interval
  it is. Misses and wrong taps are shown, then the next interval comes.
The roots can be shown (easier) or hidden (harder).

- **Stay.** Same key and area for 8–12 questions, cycling through the intervals. Then the next area in the same key,
  and after all five areas, a new key.
- **Roam.** A new key and area every question.
- **Whole neck (later level).** "Every ♭7 of D, frets 0–15."
- **Name it.** One dot lights up and you name its interval from the 12 buttons. It's the fastest drill of the four.
- **Intervals:** 1, ♭2, 2, ♭3, 3, 4, ♯4/♭5, 5, ♭6, 6, ♭7, 7. As an option, they're named as tensions (♭9, 9, ♯9, 11,
  ♯11, ♭13, 13).
- **What's tracked:** fuzziness by interval and by CAGED area. For example, "♭6 in the D shape is weak".

## 4b. Mode Tester (play it)

A key and a mode come up, such as **"F♯ Dorian"**, and you play it on the guitar. Then you press Got it or Reveal.

- **Reveal in two steps.**
  1. The interval structure: the formula (1 2 ♭3 4 5 6 ♭7), the steps (W H W W W H W), and the colour note against
     plain major or minor ("♮6: Dorian's colour").
  2. A second tap shows it on the neck in the asked position, labelled by degree.
- **Position setting.**
  - **Anywhere.** No position is given.
  - **Root string.** The prompt names the string the key starts on: "F♯ Dorian, start on the 5th string". You start
    on the lowest root on that string and play through the position. The strings are 6, 5, 4, 3 and 2.
  - **CAGED shape.** The prompt names the shape and its root string: "F♯ Dorian, A shape (root on the 5th string)".
  - **Whole neck.** Root to root through all five areas.
- **The modes.** The default set is the modes the drill videos teach:
  - The 7 major modes.
  - Melodic minor, Lydian dominant, altered and Locrian ♮2.
  - Harmonic minor and Phrygian dominant.

  The same three tiers as Scale Formulas turn the rest on.
- **Optional drone and metronome.** The drone is on the key, with or without the 5th. The metronome has a target such
  as "eighth notes at 80".
- **Fuzziness** is tracked by mode, by root string or shape, and by key. Reveal step 1 alone counts as half fuzzy,
  step 2 as fully fuzzy.
- **A "Same key, next mode" option** runs the modes down the brightness ladder on one root (Lydian → Locrian), so the
  differences stand out.

## 4c. Modal Interchange Quiz (multiple choice)

The chords that leave the key, and the job of each, asked in random keys (added 2026-11-23).

- **The essential 16.**
  - Borrowed in a major key: iv, iv6, ♭VII, ♭VI, ♭III, ♭VII7 (backdoor), iiø7, v, II (Lydian).
  - Borrowed in a minor key: ♭II (Neapolitan), V7 (harmonic minor), the Picardy I.
  - Chromatic: ♭II7 (tritone sub), ♯i°7 (passing diminished), II7 (V of V), III7 (V of vi).
- **Four more:** I°7 (common tone), ♭VI7, Dorian IV in minor, vii°7 in minor.
- **Five kinds of question:**
  - **What it does.** A job description, then which chord it is.
  - **Where it comes from.** Wrong sources are only parallel scales that don't hold the chord, so exactly one answer is
    right.
  - **Spell it in a key.**
  - **Spot it in a progression.** The progression in the key, and one fully right reading (chord, numeral, source)
    among near misses. This replaced a fill-the-gap question, where more than one chord could fit.
  - **The notes it borrows.**
- **Every answer ends on a memory card.** It shows where the chord comes from, its job, the notes outside the key, and
  an example progression in the key that you can hear.

## 4d. Modal Interchange Player (skippable cards)

There are no points. Each card has:
- A key (weighted) and a CAGED position.
- A progression from the CAGED app's data (`src/caged/borrowdata.js`, `chromdata.js`). These are composed charts and
  song charts moved to the key.
- The outside chords tinted.
- Every chord voiced in that position, near the one before (`src/caged/grips.js`).
- What the chord is, how to use it, and how it sounds. The text's examples are in C major, or A minor for minor-key
  topics.

Play loops the progression and highlights the bar that's sounding. The drone and click switch on. "Everything" uses
all 46 borrowed and chromatic topics, including the mediants.

## 4e. Chord Scales (added 2026-11-23)

A play-it mode with a reveal.
- **Scales:** major, melodic minor, harmonic minor, harmonic major, natural minor, and Barry Harris's 6th-diminished
  (the 6th chord and its °7 alternating).
- **Tasks:**
  - Chords up a string set. Drop 2 or drop 3 7ths, or close triads, in one inversion, I to I. The app picks an
    inversion whose whole climb fits below the 17th fret. The rare runs that can't fit say "drop an octave".
  - Chords in a CAGED area. Triads, 7ths, or 7ths with extensions (with the reason for each extension, from
    `src/caged/cscale.js`), voice-led in position.
  - The scale in intervals. 3rds, 4ths, 6ths, triads, 7th arpeggios or groups of 4, in an area, up and back.

## 4f. Chords in Context (added 2026-11-23)

Skippable cards. Each card is one functional chord with its explanation and five or six progressions that use it, in
a key. Each progression is playable, with grips in one CAGED position.
- **Chord-type topics written for this mode:** °7, ø7, 7♭5, 7sus4, plus augmented and m(maj7) drawn from the data.
- **Topics from the CAGED app's data:** every single-chord borrowed and chromatic topic.

## 4g. Progressions (added 2026-11-23)

A progression from the CAGED app's library: about 340 of them, from cadences and pop to standards.
- **Hide and peek.** Names, numerals or both can be hidden for memorising; tap a chord to peek.
- **The spider under each chord** opens its substitutes from `src/subs.js`.
- **A + in each gap** adds an approach chord: its V7, a ii–V, ♭II7, a passing °7, a chromatic approach, or the
  backdoor ♭VII7. An added chord takes half the time of the chord before it, so bars keep their length and the loop
  stays on the click.
- **Changes** show in violet. Reset restores the original.
- **Loop** plays it in time, with an optional click and adjustable tempo.

## 5. Screens

1. **Home.** The ten modes, a Fuzzy button with a count, today's points and the best scores.
2. **Mode setup.** What's in, session length, metronome and drone. The last choice is remembered.
3. **Drill.** The prompt, the neck or answer pad, Got it / Reveal, the score, the streak, and the clock or countdown.
4. **Session summary.** Points, clean rate, newly fuzzy items and items cleared.
5. **Fuzzy.** Weakest first, grouped by mode, the weak keys, and "Work on fuzzy".
6. **Settings.** Key weights, filters, countdown length, reset and backup.

## 6. Build

- **Files:** `fundamentals.html`, `fundamentals.css`, `fundamentals.webmanifest`, and `src/fundamentals/`:
  - `app.js`: the screens.
  - `items.js`: the item catalogue and prompt generator.
  - `store.js`: scores, fuzziness and key weights in localStorage.
  - `pads.js`: the answer pads.
  - `neckquiz.js`: the interval neck.
- **Add to the service worker**, then test at phone width with the preview.
- **Order:** the whole app is built at once. Shapes (inversions up the neck and in a CAGED area) is the home screen's
  first mode.
