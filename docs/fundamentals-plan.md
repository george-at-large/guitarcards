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

### 1a. Inversions: the core chords only (changed 2026-11-23)
Inversions are drilled where they're taught: on major and minor triads (diminished optional), and on maj7, 7, m7 and
m7♭5. Augmented triads and °7s are symmetrical, so their "inversions" are one shape moved up the neck. They, and the
other colours, are reached by **morphing**.
- **Triads:** close on 6-5-4, 5-4-3, 4-3-2, 3-2-1, and spread on 6-4-3, 5-3-2, 4-2-1. Up one set, or every inversion
  in one CAGED area.
- **7th chords:** drop 2 on 6-5-4-3, 5-4-3-2, 4-3-2-1, drop 3 on 6-4-3-2, 5-3-2-1 (drop 2 & 4 optional), up one set
  or in one area. Shells use the same four chords.

### 1b. Morphs on every inversion (sometimes)
Sometimes (an option: never, sometimes about 1 in 3, or often about 2 in 3), the prompt adds: "On every inversion:
Gmaj7 → Gmaj7♯5 and back: raise the 5th." Each one moves a single note:
- maj → aug, sus4, sus2, min
- min → dim, maj, sus4
- dim → min
- maj7 → 7, maj7♯5, 6, m(maj7)
- 7 → 7sus4, 7♯5, 7♭5, m7
- m7 → m7♭5, m(maj7), m6, 7
- m7♭5 → °7, m7

The reveal pairs each shape with its morph on the same grid, rings the note that moved, and says which degree moves
and by how much. The morphed shape is built from the shape itself, so it's always a one-note move. A check confirmed
this on every inversion, set and key; at the neck's edge a morph that would fall below the nut is left out. Fuzzy items
from retired drills (inversions of G+ or °7) are retired. The morph chain (maj7 → 7 → m7 → m7♭5 → °7 on one shape)
stays as its own task.

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

## 1z. Inversions Game (added 2026-11-23)

There's nothing to set: the big Play card on Home starts it. It tells you which inversions to play, in a teacher's
order:
1. Close triads on the top sets.
2. Close triads on every set and in CAGED areas.
3. Spread triads.
4. Drop 2 7ths on the top sets.
5. Drop 2 everywhere, and drop 3.
6. Everything, with morph chains.

Morphs come in gradually: none at level 1, about 1 in 5 from level 2, about 1 in 3 from level 5. Clean on 8 of the
last 10 prompts at your level opens the next. About a third of prompts are review from earlier levels, weighted to
fuzzy ones. Answers go to Shapes' fuzzy items.

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

## 4h. Mastery: borrowed chords and chromatic chords (added 2026-11-23)

These are phone only, and they teach one chord at a time until it's known cold:
- **Borrowed chords:** the 17 single-chord topics in `src/caged/borrowdata.js`.
- **Chromatic chords:** the 18 topics in `chromdata.js` (secondary dominants, tritone subs, diminished, augmented and
  line clichés, chromatic mediants).

The cycle:
- **Learn.** A card shows the chord, where it comes from, how it's used and how it sounds, with two of its progressions
  in your key, the chord picked out, and tap to hear. It isn't scored.
- **Practice.** One of its progressions in a weighted key, chord names only: "which borrowed chord does this use?" The
  wrong answers are chords of the track that aren't in the progression and aren't this chord in another form. The
  reveal shows the numerals, the chord, the explanation and the sound.
- **Mastered.** Three clean in a row, then the next chord comes in. At most two are being learned at once. Mastered
  chords come back as review, and a miss sends one back to learning.

The topic chord of a chromatic pair is the one outside the key. Chords in a progression match it by root and family,
so iv7 counts as iv and V7♭9 as V7. A check confirmed every topic makes a Learn card and a Practice card (with four
distinct choices) in all twelve keys. A learner who answers everything right masters a track in about 70 prompts.

A third track, **Common Progressions: Mastery**, has 33 progressions in teaching order, from I–IV–V and ii–V–I
through the axis, the blues, the minor cadences, the backdoor, the turnarounds, rhythm changes and the Royal Road.
Learn shows a progression in two keys. Practice shows its chord names in a third key and asks which progression it
is. The choices give each one's name and numerals, and look-alikes with the same triad shape are kept out.

Home is now split into **With your guitar** and **Phone only**. Phone only holds the two mastery tracks, the Modal
Interchange Quiz, Chord Finder, Scale Formulas and Interval Finder.

## 4i. On the neck and in theory (added 2026-11-23)

The Mastery tracks, Chords in Context and the MI Player show each progression on the neck and in theory
(`src/fundamentals/theorycard.js`).
- **Voicings, as a player would choose them.** 7th-chord progressions are in drop 2, voice-led inside one CAGED area,
  each chord the smallest move from the last (`caged/grips.js` voiceLeadPick). Triad and pop progressions use CAGED
  grips in one position. The top-voice line is named.
- **Chord by chord.** Each chord gets:
  - its numeral;
  - its job (tonic, predominant, dominant, and their substitutes);
  - the mode to play over it, with where that mode comes from ("F Dorian, the 2nd mode of E♭ major").
- **Chords outside the key, in more depth.** Each one also gets:
  - which notes leave the key, and their degrees;
  - what it is:
    - borrowed, with its source parallel mode and what that mode is a mode of (`caged/borrowed.js` sourcesOf);
    - a secondary dominant, with Mixolydian or Mixolydian ♭6 over it;
    - a tritone sub, with Lydian dominant over it;
    - passing, leading-tone or common-tone °7, with whole-half diminished over it;
    - augmented;
  - how its 3rd and 7th move into the next chord.
- **Checked.** Every panel builds in all twelve keys: 1,224 in Mastery and 2,424 in Chords in Context.

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
