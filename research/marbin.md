# Marbin (Dani Rabin) routines: research notes (`content/marbin.js`, prefix `mb-`)

Output: **53 templates, 5 concepts, 14 routines**. Validated with a temporary loader copy
(`validate.mjs marbin --n 10` → 0 problems). A separate check confirmed every routine step id exists and every
pinned param value is in that card's pool. `marbin` is NOT yet in `src/library.js` (the coordinator wires it).

All prose is a paraphrase of the ideas as summarised from the transcripts the user supplied; nothing is
quoted. Melodies appear only for public-domain tunes (Happy Birthday, Silent Night, God Rest Ye Merry
Gentlemen). Michelle, Georgia, Hallelujah, Autumn Leaves, Blue Bossa, All the Things You Are, All of Me, So
What, Summertime, Blues for Alice and All Blues appear as chord progressions / key maps only.

---

## 1. Video ids

Found by paging the channel's video list (youtube.com/@marbinmusic/videos) and matching titles. Confidence:
**exact** = the title the user gave; **likely** = best title match for the summarised content.

| routine | video id | YouTube title | confidence |
|---|---|---|---|
| mb-caged-voice-leading | `4ifrANK6u4s` | This BORING Practice Routine Will Teach You Harmony in WEEKS | likely (no "15 areas" title exists; this is the recent practice-routine video in the same "boring" series; alternatives: `Xh5Yq4l1nBQ` "CAGED for Jazz", `dIh5T-var6M` "Forget Shapes, How Chord Voicings Actually Work on Guitar") |
| mb-never-forget-tune | `wotd2Y3Ck14` | Boring, But You’ll Never Forget a Tune Again | exact |
| mb-painful-practice | `omjeZgrwJgA` | The Painful Practice You're Not Doing (is why you suck at jazz) | exact |
| mb-pentatonic-ladder | `Mc_hTD_TxVc` | The Pentatonic Ladder - How It Works | exact |
| mb-triad-pairs | `QNB0HAkTBZ0` (+ `u74vroeYp48`) | Master Altered Triad Pairs in One BORING Lesson / Triad Pairs: Stop Comping Like a Child | likely |
| mb-speed-picking | `8C56xRK2SB4` | Speed Practice For Jazz Guitar | likely |
| mb-omit-ii | `Nvs12G30emw` | Joe Pass LIED?? | likely |
| mb-counterpoint | `AZMZaFKZo58` | How to Play Counterpoint on Guitar in 10 minutes | likely |
| mb-phrasing-tempos | `j2IY4_Tiaas` | Give Me 15 MINUTES & I'll Completely RESET Your Phrasing | likely (alt `4WYPbDBCyDE` "Jazz Phrasing For Basic B*tches") |
| mb-funk-mechanics | `Q6WlweC9qlk` | Funk Guitar Mechanics That Actually Work | likely |
| mb-outline-changes | `rpn8ulsRgD4` | How to Outline Chord Changes | likely (its chapters list Happy Birthday and 8th-note études; approach/neighbour material is also in `t5JnUwmx3xg` "How Jazz Lines Work") |
| mb-diminished-families | `iej28qSkB5c` | Diminished Can Fit Into Your Jazz Baby Brain | likely (alt `g9OAxfy1eGA` "Barry Harris Theory vs. Reality: Diminished Explained") |
| mb-reharm-i-iv-v | `AAWWbHh9Gj0` | Harmonize Any Melody Like a Genius (even if you're stupid) | likely (alt `LbKDJkQpbMs` "How Reharmonization Works") |
| mb-dim-suspension-blues | `shf6dOSx96o` | #1 Chord Soloing Hack Nobody Taught You for Blues | exact (its chapters: diminished suspension, turnaround, drop 2s, inner/lower strings, the IV chord, chords moving in minor 3rds, diminished major 7) |

Transcripts could not be fetched automatically, so the "likely" matches rest on titles, dates and chapter lists.
Check them before publishing; changing one only means editing the `V` table at the top of `marbin.js`.

---

## 2. Routines and their cards

1. **CAGED voice leading: 15 areas.** `mb-caged-root-finger` (five forms as root string + finger), `mb-caged-quality-morph` (maj/min/dim/aug in one form), `mb-roots-michelle` (root map of I–iv–♭VII–vi°–V in a CAGED area), `mb-caged-michelle-triads` (close triads on a 3-string set, area via `startFret`), `mb-caged-15-areas` (drop-2 grips on the low/middle/top four strings; ii–V–I, I–vi–ii–V, Michelle-type), then `voi-drop2-turnarounds`.
2. **Never forget a tune.** `mb-tune-recite` (2514736), `mb-tune-numbers-to-chords`, `mb-roots-autumn`, `mb-tune-autumn-areas`, `mb-tune-map-blue-bossa`, `har-song-blue-bossa`, `mb-tune-map-attya`, `mb-tune-key-jumps`, `har-song-attya-A`.
3. **Painful practice (Barry Harris).** `mb-bh-caged-sixths`, `mb-bh-scale-chunks` (6-dim / m6-dim / 7-dim in 4-note chord/dim chunks via `sequence: pattern [1,3,5,7]`), `mb-bh-dim-on-tonic`, `mb-bh-string-group` (G-B-E), `har-dim-barry-harris-6`, `mb-bh-georgia` (I6 → III7 vs I6 → ♯v°7 → vi6).
4. **Pentatonic ladder.** `mb-ladder-32`, `mb-ladder-23`, `scl-pent-diagonal`, `mb-ladder-relative-minor`, `mb-ladder-blue-note`, `mb-ladder-moving-chords` (I–vi, vi–V–IV).
5. **Triad pairs.** `mb-tp-sub-vs-sus`, `mb-tp-mode-pairs` (Ionian I+ii, Dorian ♭III+IV, melodic-minor vi°+vii°, Lydian I+II), `scl-arp-triad-pair-altered`, `har-imp-triad-pair-altered`, `mb-tp-harmonic-minor-V` (ii° + ♭III+ over V7).
6. **Speed practice.** `rhy-pick-sweep-3`, `mb-speed-joe-pass-triplets`, `mb-speed-8-note`, `mb-speed-6-note`, `mb-speed-muting`.
7. **Omitting the ii.** `mb-omit-ii-rule`, `har-imp-think-dominant`, `har-song-fly-me-cycle`, `mb-omit-ii-alice`.
8. **Counterpoint.** `scl-seq-contrary-motion`, `mb-cp-contrary-6dim`, `mb-cp-two-pianos`, `har-dim-barry-harris-6`.
9. **Phrasing at three tempos.** `mb-phrase-medium`, `mb-phrase-uptempo`, `mb-phrase-ballad`, `rhy-click-2-4-swing`.
10. **Funk mechanics.** `rhy-funk-scratch-motion`, `mb-funk-shaker-drums`, `mb-funk-ddu`, `mb-funk-bursts`, `rhy-funk-chicken-scratch`.
11. **Outlining a form.** `mb-lines-happy-birthday`, `mb-lines-4bar-chunks` ×2, `mb-lines-triad-proximity`, `scl-chr-approach-arpeggio`, `har-imp-enclosures`, `har-imp-blues-follow-changes`.
12. **Diminished families.** `mb-dim-three-families`, `mb-dim-families-play`, `har-dim-rootless-7b9`, `har-dim-common-tone`, `har-dim-passing-ascending`, `voi-drop2-dim7`.
13. **Reharm with I, IV, V.** `mb-reharm-which-chord`, `mb-reharm-systems`, `mb-reharm-silent-night`, `mb-reharm-god-rest`, `har-cm-step5-twinkle-reharm`.
14. **Diminished suspension on a blues.** `mb-dimsus-theory`, `voi-drop2-dim7`, `mb-dimsus-suspension`, `mb-dimsus-approach` ×2, `mb-dimsus-blues`, `mb-dimmaj7-off-tones`, `har-comp-chord-solo`.

New concepts: `caged-root-areas`, `root-motion-numbers`, `pentatonic-ladder`, `triad-sub-vs-sus`, `diminished-suspension`.

---

## 3. Theory checks (dump-demo)

- **Root maps** (`mb-roots-*`): one arpeggio spec per chord with `tones: [degree]` in `region: { caged }`, so the area follows the key. In C, A-form area: C 5:3, F 4:3, B♭ 6:6/3:3, A 6:5/3:2, G 6:3/4:5. ✓
- **Barry Harris chunks**: `pattern [1,3,5,7]` over the 8-note scale alternates C6 chord tones and B°7 tones (C A form: G A C E | A♭ B D F | A C E G …). ✓
- **Diminished = 2 4 ♭6 7** of the tonic; C7 + B° = 1 2 3 4 5 ♭6 ♭7 7; Cm6 + B° = 1 2 ♭3 4 5 ♭6 6 7. ✓
- **Georgia-type move**: ♯v°7 in C = G♯°7 = rootless E7♭9 → Am6. ✓
- **Ladder**: C major pentatonic `{octaves: 3}` from string 6 gives a clean 3-2 diagonal (6: 8 10 12 | 5: 10 12 | 4: 10 12 14 | 3: 12 14 | 2: 13 15 17 | 1: 15 17 20). The 2-3 ladder from G (tones 1 2 4 5 6 relative to G, note labels) is exact on strings 6–3; the engine's path takes a minor 3rd along string 2 near the top, because a strict 2-3 ladder runs out of strings just short of three octaves.
- **Blue note**: `major-blues` cannot fit 3 octaves at ≤3 notes per string, so that card shows the ladder plus a ♭3/3 map, and a 2-octave major-blues fingering.
- **Harmonic-minor pair** over G7: D° (D F A♭) + E♭+ (E♭ G B); `sequence: triads` on the hexatonic alternates the two triads. ✓
- **Diminished-suspension approach pairs** (key G, top four): top voice G–F♯–G (`/bb7` bass), B♭–A–B♭ (`/1`), D♭–C–D♭ (`/b3`), E–E♭–E (`/b5`). Slash basses fix the inversion, so the requested top note is guaranteed. ✓
- **°(maj7) off G7's chord tones**: `/1` forces the chord-tone bass: B + F B♭ D (B♭ triad), D + A♭ D♭ F (D♭ triad), F + B E A♭ (E triad). All notes are in G half-whole. ✓
- **Bird blues reduction**: full = Fmaj7 | Eø A7 | Dm7 G7 | Cm7 F7 | B♭7 | B♭m7 E♭7 | Am7 D7 | A♭m7 D♭7 | Gm7 | C7 | F D7 | Gm7 C7; reduced drops each ii and the G7 (V/V) in bar 3, keeping the Dm7 (vi). The reduction is ours, built from the rule as summarised.

## 4. Interpretation choices (flag for review)

- **"15 areas"**: the engine can't pin a CAGED area for a voiced progression, so the area param is a `startFret` target (frets 4, 6, 8, 10, 12) and the prompt asks the player to name the form of each root. The root-map cards *are* exact CAGED areas.
- **Triads on 4-string groups**: progressions can't voice a 3-note chord with a doubled note on 4 strings, so triads use 3-string sets inside each group and the 4-string drill uses 4-note grips (6ths, 7ths, °7). The Michelle-type 4-note version (I6 iv7 ♭VII6 vi°7 V7) is labelled as such.
- **All the Things You Are**: the summary said the 2-5-1 after the second 6-2-5-1-4 is "a ♭7 away". The target is G, which is a major 7th above A♭ (a half step below home), so the card says "the 7 / a half step below home".
- **8-note speed cell**: the stroke recipe is as summarised; the string layout in the rhythm demo (3 3 3 2 2 2 3 3) is one plausible layout, and the hint says so.
- **♭5–4 top line**: written as ♭5–4–♭5 to match the other three figures.
- **Happy Birthday** chart: bar 6 uses IV under the 7 (the usual harmonisation; the engine puts a shell under the non-chord-tone melody note).
