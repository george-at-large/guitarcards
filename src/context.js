// "Musical context" for help panels: what a chord quality / scale sounds like, what job it does,
// and a playable example built around the card's own chord or scale.
// Examples: `deg` = where the chord/scale sits in the example key, `chart` uses roman tokens in that key,
// `target` = the token that is "our" chord (scale runs are played over it).
import * as T from './theory.js';

export const QUALITY_INFO = {
  maj: { sound: 'Bright, stable, consonant.', use: 'Home chord (I) and the primary chords IV and V of a major key; also borrowed into minor (bIII, bVI, bVII).', deg: 'I', chart: '| I:maj | IV:maj | V:maj | I:maj |', target: 'I:maj' },
  min: { sound: 'Darker, sadder, still stable.', use: 'Tonic of a minor key, and ii, iii, vi of a major key.', deg: 'vi', chart: '| I:maj | vi:min | IV:maj | V:maj |', target: 'vi:min' },
  dim: { sound: 'Tense and unstable: two stacked minor 3rds.', use: 'vii° of a major key — a rootless V7 that pulls up a half step to the tonic. Also a passing chord between I and ii.', deg: 'vii', chart: '| IV:maj | vii:dim | I:maj | % |', target: 'vii:dim' },
  aug: { sound: 'Floating, unresolved, “dream-like”: two stacked major 3rds.', use: 'A chromatic passing chord: the 5th rises to #5 to lead somewhere (I → I+ → IV, or the line cliché I–I+–I6–I7).', deg: 'I', chart: '| I:maj | I:aug | IV:maj | % |', target: 'I:aug' },
  sus2: { sound: 'Open, ambiguous — no 3rd, so neither major nor minor.', use: 'Pop/rock colour on any major or minor chord; often resolves to the triad.', deg: 'I', chart: '| I:sus2 | I:maj | IV:sus2 | IV:maj |', target: 'I:sus2' },
  sus4: { sound: 'Suspended tension: the 4th wants to fall to the 3rd.', use: 'Classic “sus–resolve” on V (V sus4 → V → I) or on any chord as decoration.', deg: 'V', chart: '| I:maj | IV:maj | V:sus4 | V:maj |', target: 'V:sus4' },
  '5': { sound: 'Raw, neutral, powerful under distortion.', use: 'Rock and metal riffs — no 3rd, so it works over major or minor and stays clean with gain.', deg: 'i', chart: '| i:5 | bVI:5 | bVII:5 | i:5 |', target: 'i:5' },
  maj7: { sound: 'Lush, warm, a little bittersweet (the 7 is a half step below the root).', use: 'I and IV of a major key (IVmaj7 often takes the #11). The jazz/bossa/soul tonic.', deg: 'I', chart: '| ii:m7 | V:7 | I:maj7 | IV:maj7 |', target: 'I:maj7' },
  '7': { sound: 'Bluesy tension: the tritone between 3 and b7 wants to resolve.', use: 'The V chord — resolves down a 5th (V7 → I). In blues every chord is a dominant 7.', deg: 'V', chart: '| ii:m7 | V:7 | I:maj7 | % |', target: 'V:7', songs: 'Every 12-bar blues uses I7, IV7, V7.' },
  m7: { sound: 'Mellow, smooth minor.', use: 'The ii of a major ii–V–I (the most common chord function in jazz); also the minor tonic in Dorian funk and soul vamps.', deg: 'ii', chart: '| ii:m7 | V:7 | I:maj7 | % |', target: 'ii:m7', songs: '“So What” vamps on Dm7 (Dorian).' },
  m7b5: { sound: 'Dark, yearning, unstable (half-diminished).', use: 'The ii of a minor key: iiø7 – V7♭9 – i. Also vii of a major key.', deg: 'ii', minor: true, chart: '| ii:m7b5 | V:7b9 | i:m6 | % |', target: 'ii:m7b5', songs: 'The minor ii–V in “Autumn Leaves”; “Stella by Starlight” opens on one.' },
  dim7: { sound: 'Maximum symmetrical tension: four stacked minor 3rds, repeats every 3 frets.', use: 'Passing chord between diatonic chords (I – #I°7 – ii) and a rootless 7♭9: a dim7 a half step below a chord is its dominant.', deg: '#i', chart: '| I:maj | #i:dim7 | ii:m7 | V:7 |', target: '#i:dim7' },
  mMaj7: { sound: 'Mysterious, noir: minor triad with a major 7.', use: 'Minor tonic from melodic or harmonic minor; the middle chord of the minor line cliché (m – m(maj7) – m7 – m6).', deg: 'i', minor: true, chart: '| i:min | i:mMaj7 | i:m7 | i:m6 |', target: 'i:mMaj7', songs: 'The James Bond chord; “My Funny Valentine” opens with this line cliché.' },
  'maj7#5': { sound: 'Bright but strange — augmented with a major 7.', use: 'bIII+ of melodic or harmonic minor; a tonic substitute with a Lydian-augmented colour.', deg: 'I', chart: '| I:maj7 | I:maj7#5 | I:6 | % |', target: 'I:maj7#5' },
  '7#5': { sound: 'Dominant with a rising #5 (augmented 7).', use: 'A V7 whose 5th leans up to the 3rd of the next chord; whole-tone or altered sound.', deg: 'V', chart: '| ii:m7 | V:7#5 | I:maj7 | % |', target: 'V:7#5' },
  '7b5': { sound: 'Dominant with a flatted 5th — symmetrical, whole-tone flavoured.', use: 'V7♭5 or a tritone-sub (bII7♭5) — the same notes as its own tritone substitute.', deg: 'V', chart: '| ii:m7 | V:7b5 | I:maj7 | % |', target: 'V:7b5' },
  '7sus4': { sound: 'Open, modern, floating dominant (no 3rd).', use: 'A V that delays resolution (V7sus4 → V7 → I), or a modal vamp in its own right.', deg: 'V', chart: '| V:7sus4 | V:7 | I:maj7 | % |', target: 'V:7sus4', songs: 'Herbie Hancock’s “Maiden Voyage” is built on sus chords.' },
  '6': { sound: 'Sweet, vintage, settled major.', use: 'Tonic major in swing, bossa and Barry Harris harmony — more resolved than maj7.', deg: 'I', chart: '| ii:m7 | V:7 | I:6 | % |', target: 'I:6' },
  m6: { sound: 'Bittersweet Dorian minor.', use: 'Minor tonic (i6), and the minor iv in major (iv6 → I). Same notes as the m7♭5 a minor 3rd below.', deg: 'iv', chart: '| I:maj7 | IV:maj7 | iv:m6 | I:maj7 |', target: 'iv:m6' },
  add9: { sound: 'Shimmering, open major.', use: 'Pop/rock colour on I, IV, V — a triad with a 9 and no 7.', deg: 'I', chart: '| I:add9 | V:maj | vi:min | IV:add9 |', target: 'I:add9' },
  madd9: { sound: 'Wistful minor colour.', use: 'Minor tonic or vi chord with an added 9 (common in ballads and film).', deg: 'vi', chart: '| vi:madd9 | IV:maj | I:maj | V:maj |', target: 'vi:madd9' },
  '6/9': { sound: 'Full, warm, final-sounding major.', use: 'The ending chord in jazz and bossa; a tonic with both 6 and 9 and no leading tone.', deg: 'I', chart: '| ii:m7 | V:7 | I:6/9 | % |', target: 'I:6/9' },
  maj9: { sound: 'Lush, modern major tonic.', use: 'Imaj9 / IVmaj9 in neo-soul, jazz and R&B.', deg: 'I', chart: '| IV:maj9 | iii:m7 | ii:m9 | I:maj9 |', target: 'I:maj9' },
  '9': { sound: 'Funky, full dominant.', use: 'The funk/R&B dominant (one-chord vamps), or a V with a natural 9 (Mixolydian).', deg: 'I', chart: '| I:9 | % | IV:9 | I:9 |', target: 'I:9', songs: 'The James Brown funk chord (E9).' },
  m9: { sound: 'Smooth, sophisticated minor.', use: 'ii chords and minor tonics in jazz/neo-soul; Dorian or Aeolian colour.', deg: 'ii', chart: '| ii:m9 | V:13 | I:maj9 | % |', target: 'ii:m9' },
  m11: { sound: 'Wide, modal, quartal-sounding minor.', use: 'Dorian vamps — stacked 4ths (the “So What” voicing) imply m11.', deg: 'ii', chart: '| ii:m11 | % | bIII:m11 | ii:m11 |', target: 'ii:m11' },
  'maj7#11': { sound: 'Bright, floating, cinematic Lydian.', use: 'IVmaj7 (whose scale is naturally Lydian) or a tonic with a Lydian colour.', deg: 'IV', chart: '| I:maj7 | IV:maj7#11 | I:maj7 | IV:maj7#11 |', target: 'IV:maj7#11' },
  '13': { sound: 'Big-band, rich, inside dominant.', use: 'V13 with natural 9 and 13 — the Mixolydian dominant; blues and swing comping.', deg: 'V', chart: '| ii:m9 | V:13 | I:maj9 | % |', target: 'V:13' },
  m13: { sound: 'Deep, rich Dorian minor.', use: 'Dorian tonic or ii chord with the natural 13.', deg: 'ii', chart: '| ii:m13 | V:13 | I:maj9 | % |', target: 'ii:m13' },
  '9sus4': { sound: 'Gospel/fusion suspended dominant.', use: 'V9sus4 → I, or a static modal vamp. Also written as IV/V (F/G).', deg: 'V', chart: '| V:9sus4 | % | I:maj9 | % |', target: 'V:9sus4' },
  '7b9': { sound: 'Dark, dramatic, Spanish-flavoured dominant.', use: 'V7♭9 resolving to minor (or major for drama). Half-whole diminished or Phrygian dominant scale.', deg: 'V', minor: true, chart: '| ii:m7b5 | V:7b9 | i:m6 | % |', target: 'V:7b9' },
  '7#9': { sound: 'Gritty, bluesy, crunchy — major 3rd and “minor 3rd” (#9) together.', use: 'Rock/funk I chord, or a V7♯9 (altered) in jazz.', deg: 'I', chart: '| I:7#9 | % | IV:7 | I:7#9 |', target: 'I:7#9', songs: 'The “Hendrix chord” in “Purple Haze”.' },
  '7#11': { sound: 'Bright, open, unresolved dominant (Lydian dominant).', use: 'Non-resolving dominants: II7 in major, bVII7, or a tritone substitute (bII7#11).', deg: 'II', chart: '| I:maj7 | II:7#11 | ii:m7 | V:7 |', target: 'II:7#11', songs: 'The D7♯11 in bar 3 of “Take the ‘A’ Train”.' },
  '7b13': { sound: 'Dominant with a darker, sighing b13 (Mixolydian ♭6).', use: 'V7♭13 resolving to minor; the ♭13 falls to the 5th of the tonic.', deg: 'V', minor: true, chart: '| ii:m7b5 | V:7b13 | i:m7 | % |', target: 'V:7b13' },
  '7alt': { sound: 'Maximum tension: every available tension altered (♭9 ♯9 ♯11 ♭13).', use: 'The V of a ii–V–I when you want the strongest pull home. Altered scale = melodic minor a half step up.', deg: 'V', chart: '| ii:m7 | V:7alt | I:maj7 | % |', target: 'V:7alt' },
  '13b9': { sound: 'Dark ♭9 plus bright 13 — the diminished-scale dominant.', use: 'V13♭9 (half-whole diminished), often resolving to minor or as a blues turnaround colour.', deg: 'V', chart: '| ii:m7 | V:13b9 | I:maj7 | % |', target: 'V:13b9' },
  'dim-maj7': { sound: 'Eerie, tense diminished colour.', use: 'Harmonic-major / diminished-scale colour chord over a pedal.', deg: 'vii', chart: '| I:maj7 | vii:dim-maj7 | I:maj7 | % |', target: 'vii:dim-maj7' },
};

export const SCALE_INFO = {
  ionian: { sound: 'Bright, resolved major.', colour: '7 (the leading tone) and natural 4', use: 'Major tonic chords (Imaj7). Treat the 4 as an avoid note over maj7.', deg: 'I', chart: '| ii:m7 | V:7 | I:maj7 | % |', target: 'I:maj7' },
  dorian: { sound: 'Minor with a bright, soulful natural 6.', colour: 'natural 6', use: 'm7 chords — especially the ii of a ii–V and minor funk/jazz vamps.', deg: 'ii', chart: '| ii:m7 | V:7 | I:maj7 | % |', target: 'ii:m7', songs: '“So What”, “Oye Como Va”, “Scarborough Fair” (trad.).' },
  phrygian: { sound: 'Dark, Spanish/metal minor.', colour: '♭2', use: 'Minor chords where the ♭2 adds menace (iii of a major key, sus♭9 chords, metal riffs).', deg: 'iii', chart: '| iii:m7 | % | IV:maj7 | iii:m7 |', target: 'iii:m7' },
  lydian: { sound: 'Bright, floating, dreamy major.', colour: '♯4', use: 'maj7 chords that are not the tonic (IVmaj7) or any maj7♯11; film and fusion.', deg: 'IV', chart: '| I:maj7 | IV:maj7#11 | I:maj7 | IV:maj7#11 |', target: 'IV:maj7#11', songs: 'The Simpsons theme; Satriani’s “Flying in a Blue Dream”.' },
  mixolydian: { sound: 'Major but bluesy and relaxed.', colour: '♭7', use: 'Dominant 7/9/13 chords that sound “inside”; rock I–bVII–IV vamps.', deg: 'V', chart: '| ii:m7 | V:7 | I:maj7 | % |', target: 'V:7', songs: '“Norwegian Wood”, “Sweet Home Alabama” (I–bVII–IV).' },
  aeolian: { sound: 'Natural minor — sad, serious.', colour: '♭6', use: 'Minor tonics (i), vi of a major key; rock i–bVI–bVII progressions.', deg: 'i', minor: true, chart: '| i:m7 | bVI:maj7 | bVII:7 | i:m7 |', target: 'i:m7', songs: '“All Along the Watchtower” (i–bVII–bVI).' },
  locrian: { sound: 'Unstable, hollow — the ♭5 undermines the tonic.', colour: '♭5 (and ♭2)', use: 'Over m7♭5 chords (vii of major, ii of minor). Rarely a home key.', deg: 'vii', chart: '| vii:m7b5 | III:7 | vi:m7 | % |', target: 'vii:m7b5' },
  'melodic-minor': { sound: 'Minor with a major-scale top: noir, modern jazz.', colour: 'natural 6 and 7 over a minor 3rd', use: 'm(maj7) and m6 tonics; parent of altered, Lydian dominant, Locrian ♮2.', deg: 'i', minor: true, chart: '| i:mMaj7 | % | i:m6 | % |', target: 'i:mMaj7' },
  'dorian-b2': { sound: 'Phrygian with a natural 6 — exotic sus colour.', colour: '♭2 and natural 6', use: 'sus4♭9 chords (e.g. E7sus4♭9 / Phrygian-sounding vamps).', deg: 'V', chart: '| V:7sus4 | % | i:m6 | % |', target: 'V:7sus4' },
  'lydian-augmented': { sound: 'Bright and strange: Lydian with a ♯5.', colour: '♯4 and ♯5', use: 'maj7♯5 chords (bIII+ of melodic minor).', deg: 'I', chart: '| I:maj7#5 | % | I:maj7 | % |', target: 'I:maj7#5' },
  'lydian-dominant': { sound: 'Bright dominant — Mixolydian with a ♯4.', colour: '♯11 over a dominant', use: '7♯11 chords: non-resolving dominants (II7, bVII7) and tritone subs. Melodic minor from the 5th.', deg: 'II', chart: '| I:maj7 | II:7#11 | ii:m7 | V:7 |', target: 'II:7#11', songs: 'The II7♯11 in “Take the ‘A’ Train”.' },
  'mixolydian-b6': { sound: 'Dominant that leans to minor (Hindu / Aeolian dominant).', colour: '♭13 over a major 3rd', use: 'V7♭13 resolving to a minor tonic.', deg: 'V', minor: true, chart: '| ii:m7b5 | V:7b13 | i:m7 | % |', target: 'V:7b13' },
  'locrian-nat2': { sound: 'Half-diminished with a smoother natural 9.', colour: 'natural 9 over m7♭5', use: 'm7♭5 chords where the ♭2 of Locrian sounds too harsh — the iiø7 of a minor ii–V.', deg: 'ii', minor: true, chart: '| ii:m7b5 | V:7alt | i:mMaj7 | % |', target: 'ii:m7b5' },
  altered: { sound: 'Maximum tension: ♭9 ♯9 ♯11 ♭13 — everything that can be altered is.', colour: '♭9, ♯9, ♯11, ♭13 together', use: 'V7alt resolving to I or i. Same notes as melodic minor a half step above the root.', deg: 'V', chart: '| ii:m7 | V:7alt | I:maj7 | % |', target: 'V:7alt' },
  'harmonic-minor': { sound: 'Classical, Middle-Eastern, neoclassical minor.', colour: 'the augmented 2nd between ♭6 and 7', use: 'Minor tonic with a leading tone (i(maj7)); parent of Phrygian dominant.', deg: 'i', minor: true, chart: '| i:mMaj7 | iv:m7 | V:7b9 | i:mMaj7 |', target: 'i:mMaj7' },
  'locrian-nat6': { sound: 'Locrian with a brighter natural 6.', colour: 'natural 6 over m7♭5', use: 'iiø7 of a minor key, harmonic-minor flavour.', deg: 'ii', minor: true, chart: '| ii:m7b5 | V:7b9 | i:mMaj7 | % |', target: 'ii:m7b5' },
  'ionian-sharp5': { sound: 'Major with a raised 5 — augmented shimmer.', colour: '♯5 in a major scale', use: 'bIII+maj7 of harmonic minor.', deg: 'I', chart: '| I:maj7#5 | % | I:maj7 | % |', target: 'I:maj7#5' },
  'dorian-sharp4': { sound: 'Dorian with a ♯4 — Ukrainian/Romanian minor.', colour: '♯4 in a minor scale', use: 'iv chord of harmonic minor; exotic minor vamps.', deg: 'iv', minor: true, chart: '| iv:m7 | % | i:min | % |', target: 'iv:m7' },
  'phrygian-dominant': { sound: 'Spanish, flamenco, klezmer, metal dominant.', colour: '♭9 and ♭13 with a major 3rd', use: 'V7♭9 in a minor key (the V of harmonic minor); the flamenco I chord (E–F–G–F–E).', deg: 'V', minor: true, chart: '| iv:m7 | V:7b9 | i:min | % |', target: 'V:7b9', songs: '“Misirlou”, “Hava Nagila”, flamenco.' },
  'lydian-sharp2': { sound: 'Bright and exotic: Lydian with ♯2.', colour: '♯9 and ♯11 over a major chord', use: 'bVImaj7 of harmonic minor.', deg: 'bVI', minor: true, chart: '| bVI:maj7 | % | i:min | % |', target: 'bVI:maj7' },
  'altered-dim': { sound: 'Ultra-dark diminished dominant (superlocrian ♭♭7).', colour: '♭♭7 (= 6)', use: 'vii°7 of harmonic minor.', deg: 'vii', minor: true, chart: '| vii:dim7 | % | i:mMaj7 | % |', target: 'vii:dim7' },
  'harmonic-major': { sound: 'Major with a dark ♭6 — romantic, filmic.', colour: '♭6 in a major scale', use: 'Major tonic that borrows the iv; sets up iv–I and V7♭9 to major.', deg: 'I', chart: '| I:maj7 | iv:mMaj7 | I:maj7 | % |', target: 'I:maj7' },
  'major-pentatonic': { sound: 'Open, sweet, country/soul major.', colour: 'no 4 or 7 — no half steps, nothing clashes', use: 'Major and dominant chords, country licks, soul melodies.', deg: 'I', chart: '| I:maj | IV:maj | I:maj | V:maj |', target: 'I:maj', songs: 'The riff of “My Girl”.' },
  'minor-pentatonic': { sound: 'The rock/blues voice — strong and vocal.', colour: 'b3 and b7, no half steps', use: 'Minor chords, and over dominant 7 chords for a blues sound.', deg: 'i', minor: true, chart: '| i:m7 | iv:m7 | i:m7 | V:7 |', target: 'i:m7' },
  blues: { sound: 'Minor pentatonic + the “blue” ♭5.', colour: '♭5 passing tone', use: 'Over blues forms (I7–IV7–V7) and minor chords; bend or slide through the ♭5.', deg: 'I', chart: '| I:7 | IV:7 | I:7 | V:7 |', target: 'I:7' },
  'major-blues': { sound: 'Major pentatonic + ♭3 — sweet with a bluesy slide.', colour: '♭3 sliding to 3', use: 'Over major blues / dominant chords (country, Allman-Brothers-style).', deg: 'I', chart: '| I:7 | IV:7 | I:7 | V:7 |', target: 'I:7' },
  'whole-tone': { sound: 'Dreamy, ambiguous, symmetric — no strong pull.', colour: '♯4 and ♯5 together, all whole steps', use: '7♯5 and 7♭5 dominants; dream sequences, Debussy, Monk.', deg: 'V', chart: '| ii:m7 | V:7#5 | I:maj7 | % |', target: 'V:7#5' },
  'diminished-hw': { sound: 'Sophisticated dominant tension: ♭9, ♯9, ♯11 with a natural 13.', colour: 'natural 13 with ♭9', use: '7♭9 and 13♭9 chords. Symmetric: repeats every minor 3rd (3 frets).', deg: 'V', chart: '| ii:m7 | V:13b9 | I:maj7 | % |', target: 'V:13b9' },
  'diminished-wh': { sound: 'Dense, symmetric diminished colour.', colour: 'all four dim7 tones plus a note a whole step above each', use: 'dim7 chords (passing or leading-tone diminished).', deg: '#i', chart: '| I:maj | #i:dim7 | ii:m7 | V:7 |', target: '#i:dim7' },
  'bebop-dominant': { sound: 'Mixolydian with a chromatic passing 7.', colour: 'added major 7 as a passing tone', use: 'Running 8th-note lines over dominant chords so chord tones land on the beat.', deg: 'V', chart: '| ii:m7 | V:7 | I:maj7 | % |', target: 'V:7' },
  'bebop-major': { sound: 'Major with a passing ♯5.', colour: 'added ♯5 passing tone', use: 'Bebop lines over major 6 / maj7 chords.', deg: 'I', chart: '| ii:m7 | V:7 | I:6 | % |', target: 'I:6' },
  'bebop-dorian': { sound: 'Dorian with a passing major 3rd.', colour: 'added 3 between ♭3 and 4', use: 'Bebop lines over m7 chords.', deg: 'ii', chart: '| ii:m7 | V:7 | I:maj7 | % |', target: 'ii:m7' },
  'bebop-melodic-minor': { sound: 'Melodic minor with a passing ♯5.', colour: 'added ♯5', use: 'Bebop lines over minor 6 tonics.', deg: 'i', minor: true, chart: '| i:m6 | % | V:7 | i:m6 |', target: 'i:m6' },
  augmented: { sound: 'Symmetric, glassy, modern (two augmented triads).', colour: 'alternating minor 3rds and half steps', use: 'maj7♯5 colours, Coltrane-style major-3rd cycles.', deg: 'I', chart: '| I:maj7#5 | % | I:maj7 | % |', target: 'I:maj7#5' },
  'double-harmonic': { sound: 'Intensely “Eastern” (Byzantine).', colour: '♭2 and 7 around a major 3rd', use: 'Exotic tonic colour over a major chord with a ♭2 pull.', deg: 'I', chart: '| I:maj | bII:maj | I:maj | % |', target: 'I:maj' },
  'gypsy-minor': { sound: 'Hungarian / gypsy-jazz minor.', colour: '♯4 and 7 in a minor scale', use: 'Minor tonics in gypsy jazz and Eastern European styles.', deg: 'i', minor: true, chart: '| i:mMaj7 | % | V:7 | i:mMaj7 |', target: 'i:mMaj7' },
  'dominant-pentatonic': { sound: 'A compact dominant: 1 2 3 5 ♭7.', colour: '3 and ♭7 together', use: 'Clean, inside lines over dominant 7 chords.', deg: 'V', chart: '| ii:m7 | V:7 | I:maj7 | % |', target: 'V:7' },
  'minor6-pentatonic': { sound: 'Dorian-flavoured pentatonic (1 ♭3 4 5 6).', colour: 'natural 6', use: 'm6 / m7 chords and Dorian vamps.', deg: 'ii', chart: '| ii:m7 | % | V:7 | ii:m7 |', target: 'ii:m7' },
  'in-sen': { sound: 'Japanese, sparse and haunting.', colour: '♭2 and ♭7, no 3rd', use: 'Over sus/minor colours and quartal vamps.', deg: 'i', minor: true, chart: '| i:7sus4 | % | i:min | % |', target: 'i:7sus4' },
  hirajoshi: { sound: 'Japanese koto colour, minor with ♭6.', colour: '♭6 with a natural 2', use: 'Minor tonics with an exotic flavour.', deg: 'i', minor: true, chart: '| i:min | % | bVI:maj | % |', target: 'i:min' },
  chromatic: { sound: 'All twelve notes.', colour: 'every half step', use: 'Passing tones, enclosures and technical drills — not a key centre.', deg: 'I', chart: '| I:maj7 | % | % | % |', target: 'I:maj7' },
};
for (const [a, b] of [['major', 'ionian'], ['natural-minor', 'aeolian'], ['spanish-phrygian', 'phrygian-dominant'], ['super-locrian', 'altered'], ['minor', 'aeolian']]) SCALE_INFO[a] = SCALE_INFO[b];
const ALIAS_Q = { 'm6/9': '6/9', '7b9b13': '7b9', '7#9b13': '7alt', '7#9#5': '7alt', '13#11': '7#11', maj13: 'maj9', mMaj9: 'mMaj7', 'maj9#11': 'maj7#11', '11': '9sus4', '13sus4': '9sus4', 'm7#5': 'min', '7sus2': '7sus4' };

// key tonic such that `root` sits on roman degree `deg` of that key
function keyFor(root, deg) {
  const tok = T.parseChordToken(`${deg}:maj`, T.parseNote('C'));
  const off = (T.notePc(tok.root) + 12) % 12; // semitones above C
  return T.transposeSemis(root, -off);
}

export function contextFor(card) {
  const out = [];
  const { ctx } = card;
  const tpl = card.tpl;
  const v = card.visual && !Array.isArray(card.visual) ? card.visual : {};
  const quality = ctx.quality || v.quality;
  const scale = ctx.scale || v.scale;
  const root = ctx.root;
  if (quality && (QUALITY_INFO[quality] || QUALITY_INFO[ALIAS_Q[quality]]) && v.type !== 'scale') {
    const info = QUALITY_INFO[quality] || QUALITY_INFO[ALIAS_Q[quality]];
    out.push(build('chord', `${T.chordSymbol(root, quality)} — ${T.getChord(quality).name}`, info, root, null));
  }
  if (scale && SCALE_INFO[scale]) {
    const info = SCALE_INFO[scale];
    out.push(build('scale', `${T.noteName(root, true)} ${T.getScale(scale).name}`, info, root, scale));
  }
  return out;
}
function build(kind, heading, info, root, scale) {
  let example = null;
  try {
    const tonic = keyFor(root, info.deg);
    const keyName = T.noteName(tonic) + (info.minor ? 'm' : '');
    const k = T.parseKey(keyName);
    const chords = T.parseChart(info.chart, k.tonic).flat();
    const names = chords.map((c) => T.chordSymbol(c.root, c.quality)).join(' – ');
    example = { key: keyName, keyLabel: k.name, chart: info.chart, names, target: info.target, scale, deg: info.deg };
  } catch (e) { /* no example */ }
  return { kind, heading, info, example };
}

// ---------- chord-scale / modal-interchange context ----------
// function of each chord, keyed by major-relative roman head + triad type (M m d a)
const FUNC = {
  'I:M': 'Tonic — home.',
  'I:a': 'Augmented tonic: unstable home, pushes onward (line cliché).',
  'i:m': 'Borrowed tonic minor: same root, the 3rd drops to ♭3 — instant darkening.',
  'ii:m': 'Predominant (ii): sets up V.',
  'ii:d': 'iiø/ii° — the minor-key predominant: sets up V7♭9. Borrowed into major it darkens the ii–V.',
  'II:M': 'Lydian major II: sounds like V/V without its 7th — a bright lift back to I or on to V.',
  'bII:M': 'Neapolitan / Phrygian ♭II: predominant (♭II→V) or straight home (♭II→i, the Phrygian/flamenco cadence). ♭II7 = tritone sub of V7.',
  'iii:m': 'Mediant (iii): weak tonic substitute, shares two notes with I.',
  'bIII:M': '♭III: the relative major of the minor key — tonic-family colour; I–♭III is a rock staple, ♭III also leads to ♭VI or iv.',
  'bIII:a': '♭III+ (melodic/harmonic minor): augmented mediant; a tonic substitute that leans to iv or ♭VI.',
  'III:M': 'Major III: sounds like V/vi — pulls to vi.',
  'IV:M': 'Subdominant IV (predominant). Over a minor i (Dorian) the major IV is the signature modal sound.',
  'iv:m': 'Minor subdominant iv — the most-used borrowed chord: IV→iv→I, the ♭6 sighs down to 5.',
  '#iv:d': '♯iv° / ♯ivø7 (Lydian): raised-4 predominant, walks up to V or I/5.',
  'V:M': 'Dominant V: the leading tone (7) pulls to the tonic. Harmonic minor’s major V gives minor keys a real cadence.',
  'v:m': 'Minor v: a soft modal "dominant" with no leading tone (Mixolydian, Dorian, Aeolian sound).',
  'bv:d': '♭v°: unstable Locrian chord, rarely functional.',
  'v:d': 'v°: unstable diminished v.',
  'vi:m': 'Submediant vi: tonic substitute; the target of the deceptive cadence V→vi.',
  'vi:d': 'viø: predominant, leads to V or ii.',
  'bVI:M': '♭VI: predominant/deceptive — V→♭VI is the dramatic deceptive cadence; ♭VI→♭VII→I is the "Mario"/rock cadence; ♭VI→V is the Andalusian/minor half cadence.',
  'bVI:a': '♭VI+ : augmented colour chord.',
  'VI:M': 'Major VI: sounds like V/ii — pulls to ii.',
  'vii:d': 'vii° (leading-tone chord): dominant function — a rootless V7 resolving up a half step.',
  'vii:m': 'vii (minor): Lydian colour chord, rarely functional.',
  'bVII:M': 'Subtonic ♭VII: the backdoor dominant (♭VII7→I) and the rock I–♭VII–IV; in minor, ♭VII→i is the "Aeolian cadence".',
  'bvii:m': '♭vii (minor): modal subtonic (Dorian/Phrygian colour), leads to i.',
  'bvii:d': '♭vii°: diminished subtonic.',
  'VII:M': 'Major VII: sounds like V/iii.',
};
const FUNC_Q = {
  'I:7': 'Mixolydian tonic: a dominant 7 that is home and never resolves — the blues/rock/funk tonic.',
  'IV:7': 'IV7 (Dorian/blues): a dominant-quality IV that doesn’t need to resolve — the Dorian “bright” chord.',
  'V:maj7': 'Vmaj7 (Lydian): the V has lost its tritone (no ♮4), so it floats instead of cadencing.',
  'V:7': 'V7: the dominant — 3 and ♭7 form the tritone that resolves to the tonic.',
  'iii:m7b5': 'iiiø (Mixolydian): the ♭7 turns iii into a half-diminished chord; rarely functional.',
  'bIII:7': '♭III7 (Phrygian): a dominant on ♭III — often heard as V7/♭VI.',
  'bVII:7': '♭VII7: the backdoor dominant — ♭VII7→I (or iv–♭VII7–I).',
  'bVII:maj7': '♭VIImaj7: subtonic colour chord (Dorian/Mixolydian) — I–♭VII–IV rock sound, softer than V.',
  'i:mMaj7': 'i(maj7): minor tonic with a leading tone (melodic/harmonic minor) — the noir/Bond tonic.',
  'i:m7': 'Borrowed i7: same root, ♭3 and ♭7 — the tonic darkens.',
  'IV:7#11': '',
};
const TRIAD_CLASS = (ivs) => (ivs[1] === 'b3' ? (ivs[2] === 'b5' ? 'd' : 'm') : ivs[2] === '#5' ? 'a' : 'M');
const headOf = (roman) => roman.replace(/[°ø+]/g, '');

export function chordScaleContext(spec) {
  if (!spec || spec.type !== 'chordScale' || spec.size === 'quartal') return null;
  const root = typeof spec.root === 'string' ? (() => { try { return T.parseNote(spec.root); } catch (e) { return T.parseKey(spec.root).tonic; } })() : spec.root;
  const scaleId = spec.scale === 'minor' ? 'aeolian' : spec.scale;
  const size = spec.size || 4;
  const sc = T.getScale(scaleId);
  if (sc.ivs.length !== 7) return null;
  const rows = [];
  for (let i = 0; i < 7; i++) {
    const c = T.diatonicChord(root, scaleId, i, size);
    const d = T.diatonicChord(root, 'major', i, size);
    const roman = romanMajorRel(root, c);
    const droman = romanMajorRel(root, d);
    const cls = TRIAD_CLASS(c.ivs);
    const fn = FUNC_Q[`${headOf(roman)}:${c.quality}`] || FUNC[`${headOf(roman)}:${cls}`] || FUNC[`${headOf(roman).replace(/^[b#]/, '')}:${cls}`] || '';
    const dPcs = new Set(d.tones.map(T.notePc));
    const changed = c.tones.filter((n) => !dPcs.has(T.notePc(n))).map((n) => T.noteName(n, true));
    rows.push({
      roman, chord: T.chordSymbol(c.root, c.quality || 'maj'), diatonic: T.chordSymbol(d.root, d.quality || 'maj'), droman,
      same: changed.length === 0, changed, fn,
    });
  }
  const changedScale = sc.ivs.filter((iv, i) => iv !== T.getScale('major').ivs[i]);
  return { title: `${T.noteName(root, true)} ${sc.name} vs ${T.noteName(root, true)} major`, scaleChange: changedScale, rows };
}
function romanMajorRel(tonic, c) {
  const iv = T.intervalBetween(tonic, c.root);
  const R = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
  const deg = (T.INTERVALS[iv] || [1])[0] - 1;
  const acc = iv.startsWith('bb') ? 'bb' : iv.startsWith('b') ? 'b' : iv.startsWith('#') ? '#' : '';
  let r = R[deg % 7];
  if (c.ivs[1] === 'b3') r = r.toLowerCase();
  if (c.ivs[1] === 'b3' && c.ivs[2] === 'b5') r += c.ivs[3] === 'b7' ? 'ø' : '°';
  if (c.ivs[1] === '3' && c.ivs[2] === '#5') r += '+';
  return acc + r;
}

// ---------- where a mode comes from, and its one-note neighbours ----------
const NEIGHBOUR_POOL = ['ionian', 'dorian', 'phrygian', 'lydian', 'mixolydian', 'aeolian', 'locrian',
  'melodic-minor', 'dorian-b2', 'lydian-augmented', 'lydian-dominant', 'mixolydian-b6', 'locrian-nat2', 'altered',
  'harmonic-minor', 'locrian-nat6', 'ionian-sharp5', 'dorian-sharp4', 'phrygian-dominant', 'lydian-sharp2', 'altered-dim', 'harmonic-major'];
const ORD = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th'];
export function modeOrigin(root, scaleId) {
  const s = T.getScale(scaleId);
  const out = {};
  const p = T.parentOf(root, scaleId);
  if (p && s.family) {
    const parent = T.getScale(p.scaleId);
    out.parent = p.degree === 1
      ? `${T.noteName(root, true)} ${s.name} is the parent scale itself (mode 1 of its family).`
      : `${T.noteName(root, true)} ${s.name} = the ${ORD[p.degree - 1]} mode of **${T.noteName(p.root, true)} ${parent.name.toLowerCase()}** — same notes, starting on its ${ORD[p.degree - 1]} degree.`;
  }
  // scales with the same root that differ by exactly one note moved a half step
  if (s.ivs.length === 7) {
    const semis = s.ivs.map(T.intervalSemis);
    const near = [];
    for (const id of NEIGHBOUR_POOL) {
      if (id === scaleId || T.getScale(id).alias) continue;
      const o = T.getScale(id);
      if (o.ivs.length !== 7) continue;
      const os = o.ivs.map(T.intervalSemis);
      const diff = [];
      for (let i = 0; i < 7; i++) if (semis[i] !== os[i]) diff.push(i);
      if (diff.length === 1 && Math.abs(semis[diff[0]] - os[diff[0]]) === 1) {
        const i = diff[0];
        near.push({ id, name: o.name, from: (s.labels || s.ivs)[i], to: (o.labels || o.ivs)[i], up: os[i] > semis[i] });
      }
    }
    out.neighbours = near;
  }
  return out;
}
