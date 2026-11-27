// Superimposition as one system: pentatonics, triad pairs, arpeggios and upper structures are all shapes pulled
// out of the chord's parent scale. Parent-scale cards, one card per chord type, and rating cards (titles work in Test).
const V = { // shells and grips to play the lines over
  Dm7: '=D3 C4 F4', G7: '=G2 F3 B3', C: '=C3 G3 C4 E4', Cmaj7: '=C3 G3 B3 E4', Bbmaj7: '=Bb2 F3 A3 D4', Ebmaj7: '=Eb3 Bb3 D4 G4',
  Cm6: '=C3 G3 A3 Eb4', A7: '=A2 G3 C#4', A7alt: '=A2 G3 C#4 F4', Dm: '=D3 C4 F4 A4', D: '=D3 A3 D4 F#4', Em7b5: '=E3 Bb3 D4 G4',
  E7: '=E2 D3 G#3', Am: '=A2 E3 A3 C4', C7s5: '=C3 G#3 Bb3 E4',
};
const L = (chord, line, then = '') => `${V[chord]} | ${line.split(' ').join(' | ')}${then ? ` | ${then.slice(1)}` : ''}`;

export const DECK = { id: 'superimp', name: 'Superimposition, one system', cards: [
  { t: 'One move, five devices', s: 'read this first', b: [
    'Pentatonics, triad pairs, arpeggio superimpositions and upper-structure triads are one move: take the chord’s scale and pull out a shape you already know. Built on another root, its notes land on the chord’s tensions.',
    '- <b>1. Pick the parent scale</b>: the chord’s tones, with the gaps filled from the key and the symbol (Dm7 in C: D Dorian; G7♯11: G Lydian dominant)',
    '- <b>2. Pull out a shape</b>: a pentatonic, a triad, a 7th-chord arpeggio or a pair of triads',
    '- <b>3. Name its notes over the chord’s root</b>, then ask two things: is an avoid note part of the shape, and which of the root, 3rd and 7th does it hold?',
    'If every note is in the parent scale, the shape fits. The second question chooses between shapes that all fit. The rest of the deck does it chord by chord, so you can work the entries out rather than memorise them.',
  ], ex: [['Fmaj7 over Dm7: ♭3 5 ♭7 9', L('Dm7', 'F4 A4 C5 E5')], ['E minor pentatonic over Dm7: 9 11 5 6 1', L('Dm7', 'E4 G4 A4 B4 D5')]] },

  { t: 'Grounded, coloured, floating', s: 'the root, 3rd and 7th', b: [
    'The more of the root, 3rd and 7th a shape holds, the more it sounds like the chord. A shape made only of tensions floats: the bass and the comping have to supply the chord.',
    '- <b>Grounded</b>: the 3rd and the 7th. Fmaj7 over Dm7 is ♭3 5 ♭7 9',
    '- <b>Coloured</b>: one of them, or only the root. A minor pentatonic over Dm7 is 5 ♭7 1 9 11: the ♭7, no ♭3',
    '- <b>Floating</b>: none of the three. An E minor triad over Dm7 is 9 11 6',
    'Neither end is better. Grounded lines say the chord when you’re alone or the comping is sparse. Floating lines sound modern over a busy band, but they leave the chord to everyone else.',
  ], ex: [['Grounded: Fmaj7 over Dm7', L('Dm7', 'F4 A4 C5 E5')], ['Coloured: A minor pentatonic over Dm7', L('Dm7', 'A4 C5 D5 E5 G5')], ['Floating: E minor over Dm7', L('Dm7', 'E4 G4 B4 E5')]] },

  { t: 'The five devices', s: 'how each shape is found', b: [
    '- <b>Pentatonic</b>: five neighbours on the cycle of 5ths. A major scale holds three minor pentatonics (on its 2nd, 3rd and 6th degrees), melodic minor one (on its 2nd), harmonic minor and diminished none',
    '- <b>Modified pentatonic</b>: one note changed, such as the minor 6 pentatonic (1 ♭3 4 5 6). It covers scales that have no standard pentatonic, or none with the note the chord needs',
    '- <b>Triad pair</b>: two triads with no note in common, alternated',
    '- <b>Arpeggio</b>: a 7th chord stacked in 3rds from another degree',
    '- <b>Upper-structure triad</b>: one triad made of tensions, played over the 3rd and 7th',
    'From grounded to floating: the arpeggio from the 3rd keeps the chord’s 3rd; the upper structure drops it. Pentatonics and pairs can sit anywhere between, depending on where you build them.',
  ], ex: [['D, E and A minor pentatonics: all in C major', '=D4 | F4 | G4 | A4 | C5 | E4 | G4 | A4 | B4 | D5 | A3 | C4 | D4 | E4 | G4'], ['Minor 6 pentatonic over Cm6: C E♭ F G A', L('Cm6', 'C4 Eb4 F4 G4 A4 C5')]] },

  { t: 'Arpeggios from 3, 5 and 7', s: 'the start decides the sound', b: [
    'Stack a 7th chord in 3rds from a note of the chord’s scale. The note you start on decides which four intervals you get:',
    '- From the <b>3rd</b>: 3 5 7 9. Over Cmaj7, Em7 is Cmaj9 without its root: grounded',
    '- From the <b>5th</b>: 5 7 9 11. Over Dm7, Am7 is fine; over Cmaj7, G7 brings F, the 4th, the avoid note',
    '- From the <b>7th</b>: 7 9 11 13. Over Cmaj7♯11, Bm7 is 7 9 ♯11 13: all colour',
    'The parent scale sets each arpeggio’s quality: from the 3rd of Dm7 you get Fmaj7, from the 3rd of G7 Bø7, from the 3rd of A7♭9 C♯°7.',
  ], ex: [['From the 3rd: Em7 over Cmaj7', L('Cmaj7', 'E4 G4 B4 D5')], ['From the 7th: Bm7 over Cmaj7♯11', L('Cmaj7', 'B3 D4 F#4 A4')]] },

  { t: 'Triad pairs: the missing note', s: 'neighbouring degrees', b: [
    'In a seven-note scale, triads on <b>neighbouring degrees</b> share no note, and together hold six of the seven. Choosing a pair is choosing which note to leave out: always the one a step below the lower triad’s root.',
    '- C major: F/G leaves out E; Dm/Em leaves out C; C/Dm leaves out B',
    '- Over G7, Dm/Em drops C, the avoid note: ideal. Over Cmaj7, F/G drops E, the 3rd: it floats',
    '- <b>Diminished</b> has eight notes: its pairs sit a tritone apart (C and F♯ in C half-whole) and leave out two',
    '- <b>Whole-tone</b> has six: two augmented triads a whole step apart (C+ and D+) use every note',
    'Check that neither triad holds an avoid note, and name the note the pair drops.',
  ], ex: [['Dm/Em over G7: no C', L('G7', 'D4 F4 A4 B4 E5 G5', '|C3 G3 C4 E4')], ['F/G over Cmaj7: no E, it floats', L('Cmaj7', 'F4 A4 C5 B4 D5 G5')]] },

  // ---------- parent scales ----------
  { t: 'Parent scale: major', s: 'C major, everything in it', b: [
    '- <b>Triads</b>: C Dm Em F G Am B°',
    '- <b>7th chords</b>: Cmaj7 Dm7 Em7 Fmaj7 G7 Am7 Bø7',
    '- <b>Minor pentatonics</b>: D, E and A (the same notes as F, G and C major pentatonic)',
    '- <b>Pairs</b>: C/Dm (no B) · Dm/Em (no C) · Em/F (no D) · F/G (no E) · G/Am (no F) · Am/B° (no G) · B°/C (no A)',
    'One set of shapes serves every mode: Dm7 Dorian, G7 Mixolydian, Fmaj7♯11 Lydian, Cmaj7 Ionian, Am7 Aeolian. What changes from chord to chord is which note is the avoid note, so which shapes to skip.',
  ], ex: [['Its seven 7th chords', 'C:maj7 D:m7 E:m7 F:maj7 G:7 A:m7 B:m7b5']] },

  { t: 'Parent scale: melodic minor', s: 'C D E♭ F G A B', b: [
    '- <b>Triads</b>: Cm Dm E♭+ F G A° B°',
    '- <b>7th chords</b>: Cm(maj7) Dm7 E♭maj7♯5 F7 G7 Aø7 Bø7',
    '- <b>Pentatonic</b>: one, D minor (the scale’s 2nd degree; the same notes as F major pentatonic). Also the minor 6 pentatonic on C',
    '- <b>Pairs</b>: Cm/Dm (no B) · Dm/E♭+ (no C) · E♭+/F (no D) · F/G (no E♭) · G/A° (no F) · A°/B° (no G) · B°/Cm (no A)',
    'It serves the modern chords: Cm6 or Cm(maj7) on its root, F7♯11 on its 4th (Lydian dominant), Aø7 on its 6th (Locrian ♮2), B7alt on its 7th (altered). For any of them, find the parent and its pentatonic is a whole step above the parent’s root.',
  ], ex: [['Four chords, one scale', 'C:mMaj7 F:7#11 A:m7b5 B:7alt']] },

  { t: 'Parent scale: harmonic minor', s: 'A B C D E F G♯', b: [
    '- <b>Triads</b>: Am B° C+ Dm E F G♯°',
    '- <b>7th chords</b>: Am(maj7) Bø7 Cmaj7♯5 Dm7 E7 Fmaj7 G♯°7',
    '- <b>Pentatonics</b>: none. Use arpeggios and triads',
    '- <b>Pairs</b>: Am/B° (no G♯) · B°/C+ (no A) · C+/Dm (no B) · Dm/E (no C) · E/F (no D) · F/G♯° (no E) · G♯°/Am (no F)',
    'Its main job is V7 in a minor key: E7♭9♭13 is E Phrygian dominant. Over E, <b>B°/C+</b> gives 5 ♭7 ♭9 / ♭13 1 3 and drops A, the 4th, the avoid note. G♯°7 gives 3 5 ♭7 ♭9, the rootless E7♭9.',
  ], ex: [['B° and C+ over E7, into Am', L('E7', 'B3 D4 F4 C4 E4 G#4', `|${V.Am.slice(1)}`)]] },

  { t: 'Parent scale: diminished', s: 'A half-whole: A B♭ C C♯ E♭ E F♯ G', b: [
    'Eight notes, and it repeats every minor 3rd: any shape moved up 3 frets is still in the scale.',
    '- <b>Triads</b>: major and minor on A, C, E♭ and F♯',
    '- <b>7th chords</b>: A7 C7 E♭7 F♯7, and two °7s (A C E♭ F♯ and B♭ C♯ E G)',
    '- <b>Pentatonics</b>: none',
    '- <b>Pairs</b>: a tritone apart, A/E♭ or C/F♯ (major, or both minor). Each leaves out two notes',
    'A half-whole fits A7♭9, C7♭9, E♭7♭9 and F♯7♭9 alike. Whole-half from C♯ is the same eight notes, so it fits the °7 chords on B♭, C♯, E and G.',
  ], ex: [['A and E♭ over A7♭9', L('A7', 'A3 C#4 E4 Eb4 G4 Bb4')], ['The same shape 3 frets up: C and F♯', L('A7', 'C4 E4 G4 F#4 A#4 C#5')]] },

  { t: 'Parent scale: whole-tone', s: 'C D E F♯ G♯ B♭', b: [
    'Six notes a whole step apart. There are only two whole-tone scales: move any shape 2 frets and it’s still in the scale.',
    '- <b>Triads</b>: only augmented ones: C+ (= E+ = G♯+) and D+ (= F♯+ = B♭+)',
    '- <b>7th chords</b>: a 7♯5 on every note (C E G♯ B♭)',
    '- <b>Pentatonics</b>: none',
    '- <b>Pair</b>: C+/D+ = 1 3 ♯5 / 9 ♯11 ♭7, the whole scale',
    'It fits C7♯5 and C9♯11. Against the altered scale: whole-tone has the natural 9, altered has ♭9 and ♯9.',
  ], ex: [['C+ and D+ over C7♯5', L('C7s5', 'C4 E4 G#4 Bb4 D5 F#5')]] },

  // ---------- chord types ----------
  { t: 'm7, Dorian: Dm7', s: 'parent: major, a whole step down', b: [
    'Parent: C major. No avoid note in practice (the 6, B, is the Dorian colour).',
    '- <b>Minor pentatonics</b> on 1, 5 and 2: D (1 ♭3 4 5 ♭7), A (5 ♭7 1 9 11), E (9 11 5 6 1)',
    '- <b>Arpeggio</b> from the ♭3: Fmaj7 = ♭3 5 ♭7 9, grounded',
    '- <b>Upper structure</b> on 2: Em = 9 11 6, floating',
    '- <b>Pair</b> F/G = ♭3 5 ♭7 / 11 6 1, drops E (the 9)',
  ], ex: [['A minor pentatonic over Dm7', L('Dm7', 'A4 C5 D5 E5 G5')], ['F/G over Dm7', L('Dm7', 'F4 A4 C5 B4 D5 G5')]] },

  { t: '7, Mixolydian: G7', s: 'parent: major, a 4th up', b: [
    'Parent: C major. The 4th, C, is the avoid note, so leave out any shape built around it.',
    '- <b>Minor pentatonic</b> on 6: E = 13 1 9 3 5. D (on 5) and A (on 2) both hold C: they sound sus',
    '- <b>Arpeggio</b> from the 3rd: Bø7 = 3 5 ♭7 9, grounded',
    '- <b>Upper structure</b> on 5: Dm = 5 ♭7 9, G9 without its 3rd',
    '- <b>Pair</b> Dm/Em = 5 ♭7 9 / 13 1 3, drops C: the textbook pair for a dominant',
  ], ex: [['E minor pentatonic over G7', L('G7', 'E4 G4 A4 B4 D5', '|C3 G3 C4 E4')], ['Bø7 over G7, into C', L('G7', 'B3 D4 F4 A4', '|C3 G3 C4 E4')]] },

  { t: 'maj7, Ionian: B♭maj7', s: 'parent: major on the root', b: [
    'Parent: B♭ major. The 4th, E♭, is the avoid note.',
    '- <b>Minor pentatonics</b> on 3 and 6: D (3 5 6 7 9), G (6 1 9 3 5). Skip C, the one on the 2nd: it holds E♭',
    '- <b>Arpeggio</b> from the 3rd: Dm7 = 3 5 7 9',
    '- <b>Upper structure</b> on 5: F = 5 7 9',
    '- <b>Pair</b> F/Gm = 5 7 9 / 6 1 3, drops E♭: the avoid note again',
  ], ex: [['D minor pentatonic over B♭maj7', L('Bbmaj7', 'D4 F4 G4 A4 C5')], ['F/Gm over B♭maj7', L('Bbmaj7', 'F4 A4 C5 Bb4 D5 G5')]] },

  { t: 'maj7♯11, Lydian: E♭maj7', s: 'parent: major, a 5th up', b: [
    'Parent: B♭ major. Lydian has no avoid note: the ♯11 replaces the 4th.',
    '- <b>Minor pentatonics</b> on 7, 3 and 6: D (7 9 3 ♯11 13), G (3 5 6 7 9), C (6 1 9 3 5)',
    '- <b>Arpeggio</b> from the 7th: Dm7 = 7 9 ♯11 13, floating',
    '- <b>Upper structure</b> on 2: F = 9 ♯11 13, the Lydian sound in three notes',
    '- <b>Pair</b> E♭/F = 1 3 5 / 9 ♯11 13, drops D (the 7)',
  ], ex: [['F over E♭maj7: E♭maj7♯11', L('Ebmaj7', 'F4 A4 C5')], ['E♭/F over E♭maj7', L('Ebmaj7', 'Eb4 G4 Bb4 A4 C5 F5')]] },

  { t: 'm6, melodic minor: Cm6', s: 'parent: melodic minor on the root', b: [
    'Parent: C melodic minor (C D E♭ F G A B), for a tonic minor, Cm6 or Cm(maj7).',
    '- <b>Pentatonic</b>: D minor only (the parent’s 2nd) = 9 11 5 6 1, floating. Or the minor 6 pentatonic on the root, C E♭ F G A: it holds the ♭3',
    '- <b>Arpeggio</b> from the ♭3: E♭maj7♯5 = ♭3 5 7 9',
    '- <b>Upper structure</b> on 5: G = 5 7 9',
    '- <b>Pair</b> F/G = 11 6 1 / 5 7 9 drops E♭, the ♭3: it floats. Cm/Dm (drops B) stays grounded',
  ], ex: [['Minor 6 pentatonic over Cm6', L('Cm6', 'C4 Eb4 F4 G4 A4')], ['F/G over Cm6', L('Cm6', 'F4 A4 C5 B4 D5 G5')]] },

  { t: '7♯11, Lydian dominant: G7', s: 'parent: melodic minor, a 5th up', b: [
    'Parent: D melodic minor, which from G is G A B C♯ D E F. No avoid note.',
    '- <b>Pentatonic</b>: E minor (the parent’s 2nd) = 13 1 9 3 5. The same one as over plain G7: it skips both C and C♯',
    '- <b>Arpeggio</b> from the 3rd: Bø7 = 3 5 ♭7 9',
    '- <b>Upper structure</b> on 2: A = 9 ♯11 13, the sound of the chord',
    '- <b>Pair</b> G/A = 1 3 5 / 9 ♯11 13, drops F (the ♭7)',
    'The 2nd-degree triad gives 9 ♯11 13 on both Lydian chords: F over E♭maj7, A over G7.',
  ], ex: [['A over G7: G13♯11', L('G7', 'A4 C#5 E5')], ['G/A over G7', L('G7', 'G4 B4 D5 C#5 E5 A5')]] },

  { t: '7alt, altered: A7alt', s: 'parent: melodic minor, a half step up', b: [
    'Parent: B♭ melodic minor, which from A is 1 ♭9 ♯9 3 ♭5 ♭13 ♭7 (A B♭ C C♯ E♭ F G). No avoid note.',
    '- <b>Pentatonic</b>: C minor (the parent’s 2nd, the chord’s ♭3) = ♯9 ♭5 ♭13 ♭7 ♭9: all tension. So G7alt takes B♭ minor pentatonic',
    '- <b>Arpeggio</b>: E♭7, the tritone sub = ♭5 ♭7 ♭9 3',
    '- <b>Upper structures</b>: F on the ♭6 = ♭13 1 ♯9; E♭ on the ♭5 = ♭5 ♭7 ♭9',
    '- <b>Pair</b> E♭/F drops C♯, the 3rd: floating and very tense. Land on a chord tone of the next chord',
  ], ex: [['C minor pentatonic over A7alt, into Dm7', L('A7alt', 'C4 Eb4 F4 G4 Bb4', `|${V.Dm.slice(1)}`)], ['E♭/F over A7alt', L('A7alt', 'Eb4 G4 Bb4 A4 C5 F5')]] },

  { t: '7♭9, diminished: A7♭9', s: 'parent: half-whole on the root', b: [
    'Parent: A half-whole (A B♭ C C♯ E♭ E F♯ G): the ♭9 and ♯9 with a natural 5 and 13. Use it for A13♭9, not for A7♭9♭13 (that’s harmonic minor or altered).',
    '- <b>Pentatonic</b>: none',
    '- <b>Arpeggio</b> from the 3rd: C♯°7 = 3 5 ♭7 ♭9, the same shape every 3 frets',
    '- <b>Upper structure</b> on 6: F♯ = 13 ♭9 3, A13♭9',
    '- <b>Pairs</b> a tritone apart: A/E♭ (1 3 5 / ♭5 ♭7 ♭9) or C/F♯ (♯9 5 ♭7 / 13 ♭9 3)',
    'A °7 chord is this row without the root: C♯°7 has the notes of A7♭9.',
  ], ex: [['F♯ over A7: A13♭9, into D', L('A7', 'F#4 A#4 C#5', `|${V.D.slice(1)}`)], ['C♯°7 over A7', L('A7', 'C#4 E4 G4 Bb4')]] },

  { t: 'm7♭5, Locrian ♮2: Eø7', s: 'parent: melodic minor, a minor 3rd up', b: [
    'Parent: G melodic minor, which from E is 1 9 ♭3 11 ♭5 ♭13 ♭7. Plain Locrian (F, the ♭9) is the diatonic choice in D minor; Locrian ♮2 is the brighter, modern one.',
    '- <b>Pentatonic</b>: A minor (the parent’s 2nd) = 11 ♭13 ♭7 1 ♭3. No ♭5 and no 9, so it fits either Locrian, but alone it sounds like Em7',
    '- <b>Arpeggio</b> from the ♭3: Gm(maj7) = ♭3 ♭5 ♭7 9',
    '- <b>Upper structure</b> on ♭7: D = ♭7 9 11',
    '- <b>Pair</b> C/D = ♭13 1 ♭3 / ♭7 9 11 drops B♭, the ♭5: the chord’s defining note. Let the comping play it',
  ], ex: [['A minor pentatonic over Eø7, into A7', L('Em7b5', 'A4 C5 D5 E5 G5', `|${V.A7alt.slice(1)}`)], ['Gm(maj7) over Eø7', L('Em7b5', 'G4 Bb4 D5 F#5')]] },

  // ---------- rating cards ----------
  { t: 'Rate it: A minor pent. over G7', s: 'rating card', b: [
    'A C D E G over G7 = 9 11 5 13 1.',
    '- Root: yes. 3rd: no. ♭7: no',
    '- Avoid note: C, the 11, is part of the shape',
    '- <b>Verdict</b>: it says G7sus4, not G7. Fine where the chord is sus; over G7 use E minor pentatonic (13 1 9 3 5), which has the 3rd and no C',
  ], ex: [['A minor pentatonic over G7: sus', L('G7', 'A4 C5 D5 E5 G5')], ['E minor pentatonic over G7: dominant', L('G7', 'E4 G4 A4 B4 D5')]] },

  { t: 'Rate it: Fmaj7 over Dm7', s: 'rating card', b: [
    'F A C E over Dm7 = ♭3 5 ♭7 9.',
    '- Root: no. 3rd: yes. ♭7: yes',
    '- Avoid note: none',
    '- <b>Verdict</b>: grounded. Dm9 without its root, the safest superimposition there is. It works on any m7 with a natural 9',
  ], ex: [['Fmaj7 over Dm7', L('Dm7', 'F4 A4 C5 E5')]] },

  { t: 'Rate it: C minor pent. over B♭maj7', s: 'rating card', b: [
    'C E♭ F G B♭ over B♭maj7 = 9 4 5 6 1.',
    '- Root: yes. 3rd: no. 7: no',
    '- Avoid note: E♭, the 4th, is part of the shape, and the 3rd is missing to correct it',
    '- <b>Verdict</b>: wrong for this chord, though every note is in B♭ major. Use D or G minor pentatonic. (Over Dm7 or Fsus, the same five notes are fine)',
  ], ex: [['C minor pentatonic over B♭maj7: the E♭ rubs', L('Bbmaj7', 'C4 Eb4 F4 G4 Bb4')], ['D minor pentatonic instead', L('Bbmaj7', 'D4 F4 G4 A4 C5')]] },

  { t: 'Rate it: a D triad over Cmaj7', s: 'rating card', b: [
    'D F♯ A over Cmaj7 = 9 ♯11 13.',
    '- Root, 3rd, 7: none of them. Floating',
    '- Avoid note: none, if the chord is Lydian. But F♯ isn’t in C major',
    '- <b>Verdict</b>: right only when the parent is G major: Cmaj7♯11, or a IV chord (Fmaj7 in C takes a G triad the same way). On a tonic Cmaj7 the F♯ will clash with any F in the tune. Check the parent first',
  ], ex: [['D over Cmaj7: Lydian', L('Cmaj7', 'D4 F#4 A4')]] },

  { t: 'Rate it: E♭/F over A7alt', s: 'rating card', b: [
    'E♭ G B♭ / F A C over A7alt = ♭5 ♭7 ♭9 / ♭13 1 ♯9.',
    '- Root: yes. 3rd: no. ♭7: yes',
    '- Avoid note: none (the altered scale has none)',
    '- <b>Verdict</b>: coloured and very tense, with the 3rd missing. Resolve to a chord tone of Dm. Bonus: the same pair is 1 3 5 / 9 ♯11 13 over E♭maj7♯11, so one shape covers two chords',
  ], ex: [['E♭/F over A7alt, into Dm', L('A7alt', 'Eb4 G4 Bb4 A4 C5 F5', `|${V.Dm.slice(1)}`)]] },

  { t: 'Rate it: Dm triad over G7', s: 'rating card', b: [
    'D F A over G7 = 5 ♭7 9.',
    '- Root: no. 3rd: no. ♭7: yes',
    '- Avoid note: none',
    '- <b>Verdict</b>: coloured. G9 without its 3rd, safe once the comping or bass has the B. Add Em (13 1 3) and you have the Dm/Em pair, which fills in the 3rd',
  ], ex: [['Dm over G7', L('G7', 'D4 F4 A4 D5')]] },

  // ---------- in a tune, and practice ----------
  { t: 'Through How Insensitive', s: 'one choice per chord', comp: { chart: 'D:m7 | % | C#:dim7 | % | C:m6 | % | G:7/3 | % | Bb:6 | % | Eb:maj7 | % | E:m7b5 | A:7b13 | D:m7 | %', bpm: 100 }, b: [
    'Every chord in the tune has a row in this deck. One choice each:',
    '- <b>Dm7</b>: Fmaj7 · <b>C♯°7</b>: itself, A7♭9 without A · <b>Cm6</b>: minor 6 pentatonic on C',
    '- <b>G7/B</b>: E minor pentatonic (13 1 9 3 5) · <b>B♭6</b>: D minor pentatonic (3 5 6 7 9)',
    '- <b>E♭maj7</b>: an F triad (9 ♯11 13) · <b>Eø7</b>: A minor pentatonic · <b>A7♭13</b>: E♭/F, or C minor pentatonic',
    'Look for shapes that carry over: the F triad over E♭maj7 comes back as half of E♭/F over A7alt. Only Eø7 breaks it (its parent has F♯), and A minor pentatonic has neither F nor F♯. Play along with the comp using one device all the way through, then mix them.',
  ] },

  { t: 'Drill: one pair up the neck', s: 'Dm/Em over a G drone', drill: { bpm: 60, sub: 3, from: 'triplets at 60', goal: 'triplets at 140', drone: 'G' },
    neck: { kind: 'play', key: 'G', play: '=D3 | F3 | A3 | B3 | E4 | G4 | D4 | F4 | A4 | B4 | E5 | G5 | E5 | B4 | A4 | F4 | D4 | G4 | E4 | B3 | A3 | F3 | D3' }, b: [
    'The dominant pair: Dm and Em, alternating up and back down, labelled from G. Together they are G Mixolydian without C.',
    '- Three notes of each, one triad per beat, the next triad in the inversion nearest the last note',
    '- Say the intervals as you play: 5 ♭7 9, 13 1 3',
    '- Then improvise with only these six notes, rhythm first: two triads can sound like a lot of different things',
    '<b>Harder</b>: the same drill with F/G over a D drone (Dorian), then A/E♭ over an A drone (diminished, a tritone apart).',
  ] },

  { t: 'Practise it chord by chord', s: 'a routine, in order', b: [
    '- <b>1.</b> Pick one chord. Play its parent scale in one position',
    '- <b>2.</b> Find every shape in its row in that position, saying the intervals over the root',
    '- <b>3.</b> Improvise with one shape for a minute over the chord or a drone, then the next',
    '- <b>4.</b> Rate each one: grounded, coloured or floating, and any avoid note',
    '- <b>5.</b> Put it in a ii–V–I, then round the cycle',
    'Order: Dorian and Mixolydian first (the major-scale logic is plainest there), then Ionian and Lydian, then melodic minor (m6, 7♯11, alt, ø7), then diminished and whole-tone.',
  ] },
] };

export const DECKS = [DECK];
