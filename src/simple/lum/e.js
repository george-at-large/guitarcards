// Guitar Luminary handout "Jobim Handout": four Jobim A sections compared, in their original keys and in A minor.
// Chord progressions only (the tunes are copyrighted); the analysis is our own.
const D = (bpm, sub, from, goal, drone) => ({ bpm, sub, from, goal, drone });
const SRC = 'From the Guitar Luminary handout “Jobim Handout” (Comparing 4 Jobim A-Sections).';

export const DECKS = [
{ id: 'lum-jobim', name: 'Luminary: four Jobim A sections', cards: [
  { t: 'Four Jobim A sections', s: 'one fingerprint, four tunes', comp: { chart: 'A:m7 | % | G#:dim7 | % | G:m6 | % | D:7/3 | % | F:6 | %', bpm: 100 }, b: [
    'The handout puts the A sections of four Jobim tunes side by side, first in their own keys, then all in A minor. In A minor you can see that they share an opening.',
    '- <b>Start on the minor tonic</b> (Am7 or Am6). Wave starts on C6, the relative major, and joins the others on the next chord',
    '- <b>Step the bass down a half step</b> to a diminished 7th, A♭°7 (or G♯°7). It’s E7♭9 with its 3rd in the bass: the dominant of A minor, in the wrong place',
    '- <b>Keep falling</b> to a G minor chord (Gm6 or Gm7), then on towards F, the ♭VI of A minor (or IV of C)',
    '- <b>End with the minor ii–V</b>, Bø7 – E7♭13, or with a surprise',
    'Learn all four in A minor, then in their original keys to play along with the records. ' + SRC,
  ], ex: [['The shared opening, as How Insensitive has it', 'A:m7 G#:dim7 G:m6 D:7/3 F:6'], ['A♭°7 is E7♭9 over G♯', 'E:7b9/3 Ab:dim7']] },

  { t: 'Retrato em Branco e Preto', s: 'original key B minor', comp: { chart: 'A:m7 | % | Ab:dim7 | % | G:m6 | Gb:7b5 | F:6 | % | D:m7 | Ab:dim7 | C:maj | % | B:m7b5 | % | E:maj | E:7b13', bpm: 90 }, b: [
    'In A minor (the handout’s second page): the bass falls A, A♭, G, G♭, F, then the second half heads to C and back home through the minor ii–V.',
    '- <b>Am7 – A♭°7(♭13)</b>: the ♭13 of A♭°7 is E, held over from Am7. A♭°7 with E is E7♭9 with G♯ in the bass',
    '- <b>Gm6 – G♭7♭5 – F6</b>: G♭7♭5 is the tritone sub of C7 (it has the same notes as C7♭5), so it’s a ii–V to F with the bass falling by half steps',
    '- <b>Dm7 – A♭°7 – C</b>: ii, then A♭°7 as a rootless G7♭9, then I of C',
    '- <b>Bø7 – E – E7♭13</b>: the minor ii–V back to Am7. The E major chord turns into E7♭13, its ♭13 (C) leaning back towards A minor',
    'In B minor, for the record: Bm7 – B♭°7(♭13) – Am6 – A♭7♭5 – G6 – Em7 – B♭°7 – D – C♯ø7 – F♯ – F♯7♭13. ' + SRC,
  ], ex: [['The falling bass', 'A:m7 Ab:dim7 G:m6 Gb:7b5 F:6'], ['G♭7♭5 has C7♭5’s notes', 'C:7b5 Gb:7b5 F:6'], ['In B minor: the opening', 'B:m7 Bb:dim7 A:m6 Ab:7b5 G:6']] },

  { t: 'Retrato: the opening, voiced', s: 'one voice falls at a time', drill: D(56, 1, 'a chord a beat at 56', 'a chord a beat at 100, then as half notes in a bossa', 'A'),
    neck: { kind: 'play', key: 'A', play: '=A2 G3 C4 E4 | G#2 F3 B3 E4 | G2 E3 A#3 D4 | F#2 E3 A#3 C4 | F2 D3 A3 C4 | D3 A3 C4 F4 | G#2 F3 B3 D4 | C3 G3 C4 E4 | B2 F3 A3 D4 | E2 D3 G#3 C4 | A2 G3 C4 E4' }, b: [
      'Four-note grips with the bass on the low strings, so you can hear the line falling under the chords.',
      '- Am7 (x0555x) → A♭°7(♭13) (the E on top held) → Gm6 → G♭7♭5 → F6: the bass falls a half step each time',
      '- On top: E, E, D, C, C. The top voice falls more slowly than the bass: two lines moving at different speeds',
      '- Then Dm7, A♭°7 (as G7♭9), C, Bø7, E7♭13, Am7',
      'Play each grip as a bossa: thumb on the bass on 1 and 3, fingers on the upper three in the syncopated pattern. ' + SRC,
    ] },

  { t: 'How Insensitive, side by side', s: 'original key B minor', comp: { chart: 'A:m7 | % | G#:dim7 | % | G:m6 | % | D:7/3 | % | F:6 | % | Bb:maj7 | % | B:m7b5 | E:7b13 | A:m7 | %', bpm: 100 }, b: [
    'Next to Retrato, How Insensitive is nearly the same tune for four bars and then goes its own way.',
    '- <b>Am7 – G♯°7</b>: the same as Retrato’s first four bars (G♯°7 and A♭°7 are one chord). Then Gm6 lasts two bars where Retrato moves on after one',
    '- <b>D7/F♯</b> where Retrato has G♭7♭5: the same bass note, F♯ = G♭, with a different chord on it. Jobim’s chords serve the bass line',
    '- <b>F6 – B♭maj7</b>: ♭VI, then ♭II, the Neapolitan, instead of Retrato’s turn to C',
    '- <b>Bø7 – E7♭13 – Am7</b>: the same minor ii–V home',
    'In B minor, for the record: Bm7 – A♯°7 – Am6 – E7/G♯ – G6 – Cmaj7 – C♯ø7 – F♯7♭13 – Bm7. The iReal Pro deck has it in D minor, and Progressions from the classics has the Chopin Prelude it comes from. ' + SRC,
  ], ex: [['F♯ under two different chords', 'G:m6 Gb:7b5 F:6 G:m6 D:7/3 F:6'], ['In B minor', 'B:m7 A#:dim7 A:m6 E:7/3 G:6 C:maj7 C#:m7b5 F#:7b13 B:m7']] },

  { t: 'Corcovado', s: 'original key A minor', comp: { chart: 'A:m6 | % | Ab:dim7 | % | G:m7 | C:7 | F:maj7 | % | F:m7 | Bb:7 | E:m7 | A:7b13 | D:7 | % | D:m7 | D:m7b5', bpm: 100 }, b: [
    'Already in A minor. The opening is the shared one; then it moves away by ii–Vs.',
    '- <b>Am6</b>: A C E F♯, the same notes as D9 without its root. That’s why Corcovado is often written as starting on D7/A or D9/A: it’s minor and dominant at once',
    '- <b>A♭°7 – Gm7 – C7 – Fmaj7</b>: the falling bass becomes a ii–V–I to F',
    '- <b>Fm7 – B♭7 – Em7</b>: a ii–V to E♭ that lands a half step higher, on Em7, instead. <b>Em7 – A7♭13</b> is then a ii–V to D',
    '- <b>D7 – Dm7 – Dø7</b>: on one root, the 3rd falls (F♯ to F), then the 5th (A to A♭): the falling inner line again, leading back to Am6',
    SRC,
  ], ex: [['The ii–V that slips', 'F:m7 Bb:7 E:m7 A:7b13'], ['One root, two notes falling', 'D:7 D:m7 D:m7b5 A:m6'], ['Am6 is D9 without D', 'D:9 A:m6']] },

  { t: 'Wave', s: 'original key D major', comp: { chart: 'D:6 | Bb:dim7 | A:m7 | D:7 | G:maj7 | G:m7 | F#:7 | B:7 | E:7 | Bb:7 A:7 | D:m7 | G:maj/5', bpm: 100 }, b: [
    'The only major tune of the four, but it takes the same path: in the A-minor layout it’s C6 – A♭°7 – Gm7, Corcovado’s opening from the relative major.',
    '- <b>D6 – B♭°7 – Am7</b>: B♭°7 is a rootless A7♭9 over B♭. The bass falls D, B♭, A',
    '- <b>Am7 – D7 – Gmaj7 – Gm7</b>: ii–V–I to IV, then IV turning minor (iv), the bossa’s favourite colour',
    '- <b>F♯7 – B7 – E7 – A7</b>: dominants round the cycle of 5ths (III7 VI7 II7 V7), with B♭7 slipped in before A7 as a half-step approach',
    '- <b>Dm7 – G/D</b>: the A section ends on D minor with G over a D pedal, D Dorian rather than D major',
    'In C, to compare with the others: C6 | A♭°7 | Gm7 | C7 | Fmaj7 | Fm7 | E7 | A7 | D7 | A♭7 G7 | Cm7 | F/C. (The handout’s A-minor page leaves the last two chords in D.) ' + SRC,
  ], ex: [['The opening, falling bass', 'D:6 Bb:dim7 A:m7 D:7 G:maj7 G:m7'], ['Dominants round the cycle', 'F#:7 B:7 E:7 Bb:7 A:7'], ['The ending: i to IV over D', 'D:m7 G:maj/5']] },

  { t: 'Practise the four together', s: 'one key, then their own', b: [
    '- <b>In A minor</b>: play the four A sections in a row, comping in half notes. Say each chord’s job as you go: tonic, falling bass, ii–V, minor ii–V',
    '- <b>Bass line only</b>: play just the bass notes of each tune. The four lines start almost the same and come apart around bar 5',
    '- <b>Guide tones</b>: 3rd and 7th of each chord on the D and G strings, moving as little as you can',
    '- <b>Then the originals</b>: Retrato and How Insensitive in B minor, Corcovado in A minor, Wave in D, with the records',
    '- <b>Write your own</b>: start on Am7, use the falling bass to G minor, then take your own route to F and back with Bø7 – E7♭13',
    SRC,
  ] },
] },
];
