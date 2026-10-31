# Analyses library: research notes

File: `content/analyses.js`, exporting `analyses` (60 pieces) and `concepts` (31, all prefixed `ana-`).

Every concept id referenced in `notes`, `subs` and `see` is defined in this file's own `concepts` export, so the file has **no dependencies on other domains' concept ids**. I checked for collisions against the current `harmony.js`, `voicings.js`, `scales.js`, `rhythm.js` and `ear.js`: there are none.

Charts only: no lyrics, and no melodies of copyrighted songs. Roman numerals are relative to the major scale on the key tonic (so minor keys use i, ii:m7b5, bIII, iv, V, bVI, bVII).

**How the charts were checked.** I wrote a resolver script (scratchpad `check.mjs`) that converts every token to chord names in its key. I compared every resolved chart against the verified absolute-chord charts below. The script also checks:
- quality ids against §9
- that slash basses are valid intervals
- that `notes` and `subs` bar and chord indices are in range
- that every compare `target` appears in its chart
- that scale ids exist and concept ids resolve

---------------------------------------------------------------------------------------

## Sources per piece

Each song was verified against at least two independent sources unless noted. Ultimate Guitar pages could not be fetched (403/empty), so I used Hooktheory, Wikipedia, Pollack's "Notes On" series and lesson sites instead. Where a beat split or bar count is inferred, the `source` field says so.

### Pop / rock
| Piece | Sources | Confidence / caveats |
|---|---|---|
| Talk Talk – It's My Life | MusicRadar (Roland Schmidt), "the surprising music theory that underpinned a Talk Talk classic"; Hooktheory TheoryTab; guitartabs.cc / guitartabsexplorer (fan charts) | Medium. Verse Eb – Db/F – Ab6, then a 2-bar E pivot. Pre-chorus Am F/A G C, then F (6 beats) G. Chorus Am Dm \| G C, then Fm ×2. The two analytical sources agree. Fan charts give a different verse (Eb Bbm Db), noted as a sub. Exact repeat counts not verified. |
| Radiohead – Creep | Wikipedia; Hooktheory | High (2 bars per chord inferred) |
| Beatles – In My Life | Pollack "Notes on In My Life"; Hooktheory | High |
| Beatles – Yesterday | Pollack; Hooktheory; UG chart via search snippet; guitartabs.cc | High; slash placement medium |
| Beatles – Here Comes the Sun | Pollack; Wikipedia (bridge bIII–bVII–IV–I–V7; 11/8–4/4–7/8); Hooktheory | High; the app plays the bridge in 4/4 (see engine requests) |
| Beatles – Hey Jude | Wikipedia; Hooktheory; chordband.com | High; bridge bar placement medium |
| Beatles – Something | Pollack; signalsmusic.studio; Hooktheory; Wikipedia | High; half-bar lengths medium |
| Beatles – While My Guitar Gently Weeps | Pollack; Wikipedia; Hooktheory | High |
| Beatles – Let It Be | Pollack; Hooktheory; UG mirror | High |
| Oasis – Don't Look Back in Anger | Hooktheory; guitartabs.cc; Far Out Magazine (E7/G# "mystery chord") | High; durations medium |
| Oasis – Wonderwall | Hooktheory; guitartabs.cc; UG mirror | High; durations medium |
| Coldplay – Clocks | Wikipedia (Eb Mixolydian, alternative Ab reading); Hooktheory | High; bar split inferred |
| Coldplay – Viva la Vida | Wikipedia (Absus4/Eb); Hooktheory | High |
| David Bowie – Space Oddity | Hooktheory; Wikipedia (citing Chris O'Leary); Heartwood Guitar | Medium-high; half-bar splits medium |
| Steely Dan – Peg (chorus) | hakwright.co.uk (mu-major page and Peg tab); Jon MacLennan lesson; Wikipedia "Mu major chord" | Chord order high; **bar grouping not verified** (flagged in `source`) |
| Stevie Wonder – Isn't She Lovely | Hooktheory; NYU Theory Anthology (search snippet); Jon MacLennan | High; extensions vary |
| Prince – Purple Rain | Hooktheory; Wikipedia; Heartwood; guitartabs.cc | High; bar counts medium |
| Nirvana – Smells Like Teen Spirit | Wikipedia; Hooktheory | High |
| U2 – With or Without You | Wikipedia; Hooktheory | High |
| Eagles – Hotel California | Wikipedia; Hooktheory; Guitar World (Felder) | High |
| Daft Punk – Get Lucky | Hooktheory; MusicTech; UG (search snippet) | High |
| Lynyrd Skynyrd – Sweet Home Alabama | Hooktheory; laurenbateman.com; songnotes.net; Straight Dope thread (key debate); fretjam | High; durations medium. The Sweet Child O' Mine verse (Hooktheory, I–VII–IV in C# Mixolydian) is mentioned in the text only. |
| Ben E. King – Stand By Me | Wikipedia; Hooktheory; Jon MacLennan | High |

### Soul / funk / blues
| Piece | Sources | Confidence |
|---|---|---|
| Just the Two of Us | Wikipedia (double-time reordering of "Sunny"); Hooktheory; Japanese sources on 丸サ進行 | High; beat split inferred |
| What's Going On | Ethan Hein analysis; Hooktheory; guitartabs.cc | Medium-high; bar lengths approximate |
| Herbie Hancock – Chameleon (main vamp) | Wikipedia; Ethan Hein; Hooktheory | High |
| B.B. King – The Thrill Is Gone | Jon MacLennan; bluesharmonica.com; JustinGuitar community; pianowithjonny; Hooktheory | Medium-high (Gmaj7 vs G7 in bar 9, noted as a sub) |
| Charlie Parker – Blues for Alice | Wikipedia "Bird changes" and "Blues for Alice"; guitarthinker.com | High; bar 11 disputed (noted as a sub) |

### Bossa / classical / jazz
| Piece | Sources | Confidence |
|---|---|---|
| Blue Bossa | learnjazzstandards; guitarcomposerstoolbox (GCT); jazzadvice | High |
| The Girl from Ipanema | pianowithjonny; GCT; lydiandominant.blogspot | High |
| Pachelbel – Canon in D | Wikipedia; piano-composer-teacher-london | High. The stepwise-bass section is labelled as an arranger's variant. |
| Bach – Prelude in C, BWV 846 | bzoennchen.github.io; practicing-guitar.readthedocs.io; teoria.com; researchcatalogue.net; Wikipedia | Medium-high. Bars 26 and 28 are approximations of the figuration (stated in `source`). |
| Beethoven – Moonlight, bars 1–5 | Bernd Hamann's notes (UC Davis); good-music-guide forum; SMT symposium article on Neapolitans | High. Bar 4 is simplified to V7; the cadential 6/4 is described in a note. |
| Autumn Leaves | GCT; jazzstandards.com; Mike Hayes; learnjazzstandards | High |
| All the Things You Are | Wikipedia; GCT | High |
| Giant Steps | Wikipedia; guitartabs.cc; talkbass; GCT | High |
| Rhythm Changes | Wikipedia; thejazzpianosite.com | High |
| So What | Wikipedia; brunojazz.com; musicplayer.com forum (citing Marc Sabatella) | High |
| Stella by Starlight | learnjazzstandards (bar positions); GCT; jazzstandards.com | High |
| Body and Soul | jazz-library.com; jazzstandards.com; GCT; Wikipedia; Faber excerpt | A sections medium-high; **bridge medium** (sources disagree on details) |
| Lady Bird | Wikipedia ("Lady Bird", "Tadd Dameron turnaround"); GCT | High |
| Solar | Wikipedia; GCT | High |
| Take the "A" Train | jazz-guitar-licks.com; GCT; antonjazz; Wikipedia | High |

### Original illustrations (no song verification needed)
- Cadences: authentic, plagal and minor plagal, half and Phrygian half, deceptive, backdoor.
- Single-idea pieces: modal interchange tour, secondary dominants tour, film harmony (chromatic mediants and the Lydian lift), line clichés, pedal points, tritone subs, Coltrane changes, the "increasing darkness" mode ladder (including the epic Aeolian loop), neo-soul colours.
- Traditional forms: Andalusian cadence, 12-bar blues, jazz blues in F.

Terminology follows Open Music Theory, Levine's *The Jazz Theory Book*, and Lehman's *Hollywood Harmony* (paraphrased; nothing quoted).

### Considered and left out
- **Queen – Bohemian Rhapsody**: no bar-level chart could be verified from two sources.
- **Green Day – Basket Case** and **Guns N' Roses – Sweet Child O' Mine**: verified, but only mentioned in the Canon and Sweet Home Alabama texts, to stay within about 60 pieces.
- **Bill Withers – Ain't No Sunshine**: verified (Am7 Em7 G7 | Am7 ..., MacLennan / Hooktheory) but not included. It is an easy candidate to add.

---------------------------------------------------------------------------------------

## Concept ids expected from other domains

**None required.** All 31 referenced concepts are defined locally with the `ana-` prefix.

Several topics overlap with concepts that other domains now define. A future `see` cross-link or alias table could join them:

| analyses.js | likely counterpart |
|---|---|
| ana-ii-v-i | harmony: `ii-v-i`, `minor-ii-v-i` |
| ana-tritone-sub | harmony: `tritone-sub`; ear: `ear-tritone-sub` |
| ana-secondary-dominant | harmony: `secondary-dominants`; ear: `ear-secondary-dominants` |
| ana-modal-interchange | harmony: `modal-interchange`; ear: `ear-modal-interchange` |
| ana-backdoor | harmony: `backdoor-ii-v` |
| ana-chromatic-mediant | harmony: `chromatic-mediants` |
| ana-line-cliche | harmony: `line-cliche` |
| ana-coltrane-changes | harmony: `coltrane-changes`; ear: `ear-coltrane-changes` |
| ana-andalusian | harmony: `andalusian-cadence` |
| ana-modulation | harmony: `modulation` |
| ana-blues-harmony | harmony: `blues-forms`, `minor-blues` |
| ana-dominant-colors | harmony: `altered-dominant`; scales: `altered-scale` |
| ana-lydian-dominant | harmony: `lydian-dominant-usage` |
| ana-authentic-cadence / ana-plagal-cadence / ana-half-cadence / ana-deceptive-cadence | harmony: `cadences`; ear: `ear-cadences` |
| ana-mode-brightness | scales: `mode-brightness`; ear: `ear-mode-colors` |
| ana-quartal | voicings: `quartal-voicings` |

---------------------------------------------------------------------------------------

## Engine requests

1. **Section-level `key` (and `meter`).** Modulating pieces must currently use one key for all numerals, which gives unusual-looking tokens: `#iv:min` for Am in the Eb song "It's My Life", `#I:maj7` / `#ii:m7` for the D-major bridge of Body and Soul, `#i:m7` / `#V:maj7` in All the Things You Are, and so on. Section keys would make the numerals pedagogically right.

   The same applies to meter. "Here Comes the Sun" has bridge bars in 11/8 and 7/8; 11/8 isn't in the meter list. It is currently played as 4/4 and flagged in the text. Ideally the engine would also support per-bar meter overrides.

2. **Uneven chord durations within a bar.** Bars split evenly, so I used repeated tokens as a workaround, e.g. `| i:m7 i:m7 bvii:m7 bIII:7 |` for Fm7 (2 beats) – Ebm7 (1) – Ab7 (1). The engine should treat a repeated identical token as a held chord, not a restrike. Better still, add explicit durations, e.g. `Fm7*2`. Some 3-chord bars (Here Comes the Sun refrain, Body and Soul bridge) are split evenly into thirds as an approximation.

3. **`chord` index on `subs` entries.** I used `{ bar, chord, options }`, mirroring `notes`, wherever the target is not the first chord in its bar (about 25 cases). Please support this, defaulting to 0.

4. **Slash basses on any interval, including non-chord tones**, e.g.:
   - `V:maj/4` (G/C)
   - `bVII:maj/2` (Bb/C)
   - `II:maj/b7` (D/C)
   - `bVII:sus4/3` (Esus4/G#; the sus chord has no 3rd)
   - `#iv:dim7/b2` (F#°7/G)
   - `vii:dim7/bb7` (B°7/Ab)
   - `i:min/6` (Am/F#)

   Spell the bass by interval from the chord root, as my resolver does.

5. **Quality ids containing "/"** (`6/9`, `m6/9`) are ambiguous with slash-bass syntax. I avoided them entirely (used `6`, `add9`, `maj9`). I suggest aliases `69` / `m69`.

6. **`7alt` playback**: §9 says to always give `tones`, but chart tokens have no `tones` field. I used `7#9b13` instead. Either give chart tokens a default 7alt voicing or allow `V:7alt(3,b7,#9,b13)`.

7. **Playback hints on analyses/sections**: `walk: "arpeggio"` (Bach Prelude, Moonlight Sonata), `swing` (blues, jazz standards, Isn't She Lovely shuffle), and a 16th-note strum grid for funk. Currently `strum` is an 8th grid only.

8. **Compare options rooted off the chord**: allow `from` (as in the toolbox) on compare options, e.g. "B minor pentatonic over F#7" in The Thrill Is Gone, or "Bb melodic minor over A7". Currently every compare scale is rooted on the target chord's root.

9. **Compare targets appearing more than once.** I wrote compare charts so that the target token is unique, or repeated identically via `%`. Please define the behaviour: swap or run over every occurrence?

10. **Enharmonic spelling**: in Giant Steps (key B) the engine will spell Bb7 as A#7 and Ebmaj7 as D#maj7. In Ipanema's bridge, B7 / F#m7 come from `#IV` / `#i` against F. A per-token spelling hint (or section keys, request 1) would fix this. The summaries warn the user where it happens.

11. **Roman prefixes used** that the parser must accept: `#I #i #ii #iii #iv #IV #V #VI #vi #II`, plus flats on every degree (`bii`, `biii`, `bv`, `bvi`, `bvii`). Secondary dominants are used only without slash basses (`V/ii:7`, `V/V:7`, `ii/IV:m7`, `ii/ii:m7b5`). With a slash bass I used plain chromatic numerals (`II:7/b7`) to avoid `V/V:7/b7` parse ambiguity.

12. **Concept aliasing / cross-domain `see`**: a small alias table, as in the table above, would let `ana-*` lessons link to the deeper harmony, scales and ear lessons without hard dependencies.
