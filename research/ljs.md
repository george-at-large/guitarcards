# LearnJazzStandards.com guitar blog: source survey

Source: category "Guitar" (id 54, slug `guitar-blog`), enumerated via
`/wp-json/wp/v2/posts?categories=54&per_page=100` on 2026-11-03. The API returned 30 posts.
Cards live in `content/ljs.js` (`ljs-` prefix). Shapes were read off the posts' diagram images and PDFs
(not from the prose). All explanations in the cards are paraphrased. No licks or melodies are transcribed.

| id | date | post | what it teaches | app coverage |
|---|---|---|---|---|
| 22701 | 2025-05-27 | [Diminished Chords Workshop](https://www.learnjazzstandards.com/blog/diminished-chords/) | dim triad vs maj/min/aug, dim7, half-dim, where dim chords occur (major, minor, harm. minor, mel. minor, dim scales), Gdim7 drop 2 on 3 sets | drop-2 dim7 and dim theory already covered. New: `ljs-dim-where-from` |
| 1184 | 2025-02-25 | [Easy Jazz Chords! 20 Jazz Guitar Chords](https://www.learnjazzstandards.com/blog/essential-jazz-guitar-chords/) | 20 stock grips (drop 3 on E-D-G-B, drop 2 on A-D-G-B / D-G-B-E, plus maj9, 6, m9, m11, 9, 13, 13b9, m11b5), relative-minor shapes, ii-V-I with a common top note, minor ii-V device | drop 2/3 inversions covered. New: `ljs-20-extended-grips`, `ljs-relative-shapes`, `ljs-ii-v-i-common-top`, `ljs-minor-ii-v-shift` |
| 192000 | 2024-05-30 | [Beginner Jazz Guitar](https://www.learnjazzstandards.com/blog/beginner-jazz-guitar/) | qualities, maj7→7→m7→m7b5 conversion, ii-V-I major/minor, ATTYA, comping rhythms, modes, chord tones, guide tones, shells, scale maps | all covered (quality morph, shells, guide tones, ii-V-I, ATTYA analysis, Charleston, modes) |
| 194835 | 2024-03-12 | [Jazz Scales Guitar Workshop: 20 scales](https://www.learnjazzstandards.com/blog/jazz-scales-guitar/) | 7 major modes, melodic minor, lydian dominant, altered, H-W / W-H dim, 4 bebop scales, whole tone, pentatonics, blues, harmonic minor | all covered in scales.js |
| 1499 | 2024-02-02 | [CAGED System Scales](https://www.learnjazzstandards.com/blog/caged-system-scales-for-guitar/) | 5 CAGED chord shapes + scale shapes; each shape read from its lowest note is a different mode | CAGED scales covered. New: `ljs-caged-shapes-as-modes` |
| 194429 | 2024-01-19 | [10 Jazz Guitar Licks](https://www.learnjazzstandards.com/blog/jazz-guitar-licks/) | bebop passing tones, chromatic approach, enclosures, chord outlines, rhythmic groupings vs meter, bII triad over V, triad pairs over V, chromatic pentatonic shifting, augmented-triad sweeps over minor V, double stops, blues + mixolydian, modifying licks | enclosures, bebop, triad pairs (bV+bVI), sidestepping, blues/mixolydian covered. New (concepts only, no licks transcribed): `ljs-bII-triad-over-V`, `ljs-aug-triad-minor-V`, `ljs-groups-of-four-in-three`, `ljs-bluesy-double-stops`, `ljs-lick-mutation-routine` |
| 188117 | 2024-01-11 | [Chord Melody in 3 Steps](https://www.learnjazzstandards.com/blog/guitar-chord-melody/) | melody+roots → +5ths → +3rds/7ths, triads under the melody, 7th chords; triad chord scales in inversions | covered by har-cm-* and voi-cm-* / triad chord scales. Tune used is copyrighted, so not transcribed |
| 21124 | 2023-12-22 | [Diminished Triad](https://www.learnjazzstandards.com/blog/diminished-triad-shapes-guitar/) | close dim triads on 4 groups; vii°, rootless dominant, dim cycling over V | shapes covered (voi-triad-dim-aug, scl-dim-triads-tour). New: `ljs-vii-dim-for-V` |
| 20704 | 2023-11-16 | [Major Triads](https://www.learnjazzstandards.com/blog/major-triads-guitar/) | close triads, inversions on 4 groups, 3-step routine (one key all groups → 12 keys → tunes) | shapes covered. New: `ljs-triads-all-groups-routine` |
| 20905 | 2023-11-16 | [Minor Triads](https://www.learnjazzstandards.com/blog/minor-triads-guitar/) | minor triads on 4 groups, applied to a minor blues | shapes covered. New: `ljs-minor-triads-minor-blues` |
| 21292 | 2023-11-15 | [Major 7th Chord](https://www.learnjazzstandards.com/blog/major-7th-chord-guitar/) | 7th-chord theory, Gmaj7 drop 2 all inversions on E-A-D-G / A-D-G-B / D-G-B-E | covered (voi-drop2-*) |
| 193455 | 2023-10-25 | [Half-Diminished Chord](https://www.learnjazzstandards.com/blog/half-diminished-chord-guitar/) | Gm7b5 drop 2 on 3 sets, iiø-V-i, scale menu (Locrian, Locrian ♮2, Locrian ♮6, "minor pentatonic b5", Locrian bebop) | voicings covered. New: `ljs-m7b5-scale-menu` |
| 62001 | 2018-05-11 | [Memorizing Dominant Chords](https://www.learnjazzstandards.com/blog/learning-jazz/guitar-blog/memorizing-dominant-chords-for-jazz-guitar-beginners/) | intervals in semitones, C7 barre shapes, drop 2 on 3 sets, shells from 5th/6th string | drop 2 + shells covered. New: `ljs-dominant-map` |
| 30936 | 2016-05-26 | [How Jazz Pianists and Guitarists Can Play Together](https://www.learnjazzstandards.com/blog/learning-jazz/jazz-advice/jazz-pianists-guitarists-can-play-together/) | comping etiquette | New: `ljs-comping-with-piano` (+ concept) |
| 29081 | 2016-02-16 | [12 Beginning Jazz Guitar Voicings](https://www.learnjazzstandards.com/blog/12-beginning-jazz-guitar-voicings-2/) (PDF) | 6 qualities × root on 6 / root on 5 | New: `ljs-12-voicings-root6`, `ljs-12-voicings-root5`, `ljs-12-voicings-ii-v-i` |
| 29073 | 2016-01-28 | The 3 Most Important Jazz Guitarists | Charlie Christian, Wes Montgomery, Jim Hall (listening) | concept `ljs-guitar-lineage` |
| 29057 | 2015-12-04 | Jazz Etude: Waltz For Snow White | etude on Someday My Prince Will Come (image only) | skipped: original etude melody, not transcribable |
| 29049 | 2015-11-12 | Read Notes in 1st and 5th Position | position reading | New: `ljs-read-position-1`, `ljs-read-position-5` |
| 24659 | 2015-11-08 | [Learning Weekly Jazz Voicings](https://www.learnjazzstandards.com/blog/learning-weekly-jazz-voicings/) | one voicing a week in 12 keys; same voicing on two string sets (Fmaj7 x-8-10-9-10-x = x-x-3-5-5-5) | New: `ljs-voicing-of-the-week` |
| 23717 | 2015-09-22 | Mastering The Fretboard (series index) | method: every inversion on every string set, forwards and backwards | New: `ljs-mtf-three-sets` |
| 23541 | 2015-09-14 | MTF: Dominant 7(#11) | 1-3-#11-b7 drop 2, all sets; 2 shapes only (tritone symmetry) | New: `ljs-drop2-7b5` |
| 22795 | 2015-08-11 | MTF: Major 7(b5) | 1-3-b5-7 drop 2, all sets | New: `ljs-drop2-maj7b5` |
| 22630 | 2015-07-30 | MTF: Half Diminished | Gm7b5 drop 2 | covered |
| 22544 | 2015-07-24 | MTF: Dominant 7th | G7 drop 2 | covered |
| 21889 | 2015-07-14 | MTF: Minor 7th | Gm7 drop 2 (images checked) | covered |
| 21049 | 2015-06-23 | MTF: Augmented Triads | close aug triads on 4 groups, one shape per group | covered (voi-triad-dim-aug) |
| 1525 | 2010-11-03 | St. Thomas for Guitar: Chords (PDF) | 9 grips + 16-bar form | New: `ljs-st-thomas-comp` |
| 1325 | 2010-09-13 | Great Resource for Technique and Sight Reading | a book recommendation | nothing to card |
| 1220 | 2010-09-02 | 15 Most Common Guitar Chords (PDF) | open chords | New: `ljs-open-chords` |
| 1197 | 2010-08-31 | Learning the Notes on the Fretboard | natural notes as "white keys" | covered (scl-fb-*) |

Not accessible: some inline images on the Major 7th post's practice section timed out. The text describes the same drop-2 inversion drill that is already in the app.

## Shapes read from images (string 6 → 1)
- 12 voicings PDF (C): root 6: Cmaj7 8x998x · C13 8x8910x · Cm7 8x888x · Cm7b5 8x887x · Cdim7 8x787x · C7b13 8x899x. Root 5: Cmaj9 x3243x · C9 x32333 · Cm9 x3133x · Cm7b5 x3434x · Cdim7 x3424x · C7#9 x3234x.
- 20 chords: Gmaj7 3x443x (drop 3), Cmaj9 x3243x, rootless Cmaj9 x7978x (= Em7), G6 3x243x (= Em7/G), Cm9 x3133x, F13 1x123x, Bbmaj7 x1323x, Am9/G xx5557 (= Cmaj7/G), Cm11 8x886x, D9 x5455x, G13b9 xx3454, Dm11b5 x5658x → G7alt/F x8989(11)x → Cmaj7/E 12x(10)(12)(12)x.
- St. Thomas (C): Cmaj9 x3243x · Em11 x77787 · A7b13 5x566x · Dm9 (drawn as Dm11) x55565 · G13 3x345x · Bb13 6x678x · C/E x7x58x · Fmaj7 1x221x · F#dim7 2x121x.
- MTF G7(#11) E-A-D-G root: 3 4 3 4 (G C# F B) and Gmaj7(b5) 3 4 4 4 (G C# F# B), both drop 2.
- Memorizing dominants Set-1: C7 E-shape barre 8 10 8 9 8 8, A-shape x35353.
