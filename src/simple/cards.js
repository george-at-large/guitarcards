// The must-remember cards in Simple: tap for the next one. Each deck goes in teaching order. Examples are in C
// (the non-pulling dominants are in G, as in the original notes). A card's `play` is a short progression to hear, written
// as root:quality tokens; Simple voice-leads it in close position over the bass. `ex` gives several examples in
// context, each [caption, chords], each playable.
//   t: title  s: where it comes from / what it is  b: lines ('- ' starts a bullet)  eg: the example  play: chords
//   ex: [[caption, chords, label?], …]. Chords starting with '=' are exact voicings, low to high, one chord per '|'
//   (e.g. '=C3 B3 E4 G4 | …'), for when the top note matters; then the label names them.

import * as T from '../theory.js';

export const DECKS = [
  {
    id: 'borrowed', name: 'Borrowed chords', cards: [
      { t: 'Modal interchange', s: 'what borrowing is', b: [
        'A borrowed chord comes from a <b>parallel mode</b>: same tonic, different mode. Home doesn’t move; the chord just brings a darker or brighter note.',
        'Most borrowing is from the <b>parallel minor (Aeolian)</b>, which brings three notes: ♭3, ♭6 and ♭7. Each borrowed chord is really one of those notes, and the move is to hear which one.',
      ], eg: 'C major borrows E♭, A♭ and B♭ from C minor', ex: [
        ['The three notes, one at a time: E♭ in Cm, A♭ in Fm, B♭ in B♭7', 'C:maj7 C:m7 C:maj7 F:m6 C:maj7 Bb:9 C:maj7'],
        ['A plain I – IV – V – I, then the same with iv: one note (A → A♭) changes the mood', 'C:maj7 F:maj7 G:7 C:maj7 F:m6 G:7 C:maj7'],
      ] },
      { t: 'iv7 (m9, m6)', s: 'from Aeolian', b: [
        'The “sad IV”. Its ♭3 is the key’s ♭6 (A♭), which falls a half step to the 5th (G) as it goes home.',
        '- Play F Dorian over it: Aeolian’s notes on its 4th degree (the 2nd mode of E♭ major)',
        '- Fm6 has the same notes as Dø7, so iv6 and iiø7 are one sound',
      ], eg: 'In C: Fm7, Fm6, Fm9', ex: [
        ['IV → iv → I: the inner voice falls A → A♭ → G', 'C:maj7 F:maj7 F:m6 C:maj7'],
        ['I – III – IV – iv: “Creep”', 'C:maj E:maj F:maj F:min'],
        ['I – I7 – IV – iv – I: a move all over the standards', 'C:maj7 C:9 F:maj7 F:m6 C:maj7'],
        ['Over a tonic pedal: Fm/C – C, the minor plagal “amen”', 'C:maj F:min/5 C:maj'],
      ] },
      { t: '♭VImaj7♯11', s: 'from Aeolian', b: [
        'The lush, cinematic one: a major chord a major 3rd below home, sharing only C with it.',
        '- Its ♯11 is the key’s own 2nd (D), so it sits easily',
        '- Play Lydian over it: Aeolian’s notes on ♭6 are A♭ Lydian',
      ], eg: 'In C: A♭maj7♯11', ex: [
        ['I – ♭VI – ♭VII – I: the heroic ending, rising by whole steps into home', 'C:maj7 Ab:maj7#11 Bb:9 C:maj7'],
        ['♭VI – V – I: A♭ falls to G, E♭ to D. The minor-key approach used in major', 'C:maj7 Ab:maj7 G:7 C:maj7'],
        ['The deceptive cadence: you expect C after G7 and get A♭', 'D:m7 G:7 Ab:maj7#11'],
        ['I – ♭VI as a two-chord vamp: the film-score shimmer', 'C:maj7 Ab:maj7#11 C:maj7 Ab:maj7#11'],
      ] },
      { t: '♭VI7 (7♯11)', s: 'from Aeolian, made a dominant', b: [
        'The ♭6 with a ♭7 added: a dominant that doesn’t pull (see that deck). Its G♭ is really F♯, the leading tone to G.',
        '- Lydian dominant over it (E♭ melodic minor)',
      ], eg: 'In C: A♭7♯11', ex: [
        ['♭VI7 → V → I: the German 6th, and the tritone sub of D7', 'C:maj7 Ab:7#11 G:7 C:maj7'],
        ['I – vi – ♭VI7 – V: a turnaround where the bass walks down C, A, A♭, G', 'C:maj7 A:m7 Ab:7#11 G:7 C:maj7'],
        ['♭VI7 – ♭VII7 – I: the darker backdoor, rising by whole steps', 'Ab:7#11 Bb:9 C:maj7'],
      ] },
      { t: '♭VII7 (9, 13, ♯11)', s: 'from Aeolian: the backdoor dominant', b: [
        'Steps up a whole tone to I instead of falling a 5th. Its ♭7 (A♭) falls to G and its 3rd (D) moves to C or E.',
        '- Mixolydian (rootsy) or Lydian dominant (floaty) over it',
      ], eg: 'In C: B♭7 → C', ex: [
        ['iv7 – ♭VII7 – I: the backdoor ii–V, as in “Lady Bird”', 'F:m7 Bb:9 C:maj7'],
        ['IV – iv7 – ♭VII7 – I: one inner voice sinks A → A♭ → G', 'F:maj7 F:m7 Bb:9 C:maj7'],
        ['I – ♭VII7 – I: a soft dominant for a vamp or a final cadence', 'C:maj7 Bb:13 C:maj7'],
      ] },
      { t: '♭VIImaj7♯11', s: 'from Mixolydian', b: [
        'The rock ♭VII, made lush. Mixolydian’s notes on ♭7 are a Lydian scale, hence the ♯11.',
        '- No leading tone anywhere, so the cadence lands softly',
      ], eg: 'In C: B♭maj7♯11', ex: [
        ['♭VII – IV – I: the classic rock cadence', 'Bb:maj F:maj C:maj'],
        ['I – ♭VII – IV – I: the coda of “Hey Jude”', 'C:maj Bb:maj F:maj C:maj'],
        ['I – ♭VII vamp: Mixolydian, as in “Norwegian Wood”', 'C:maj Bb:maj C:maj Bb:maj'],
        ['♭VIImaj7 → Imaj7: planing up a whole step, jazz style', 'Bb:maj7#11 C:maj7'],
      ] },
      { t: '♭IIImaj7 (9, 13)', s: 'from Aeolian', b: [
        'The relative major of the parallel minor. Bright but foreign: it swaps E for E♭.',
        '- Play E♭ major (Ionian) over it',
      ], eg: 'In C: E♭maj7', ex: [
        ['I – ♭III – IV: the rock riff move (“Smoke on the Water”)', 'C:maj Eb:maj F:maj'],
        ['I – ♭III – ♭VI – V: all three borrowed notes, then home', 'C:maj7 Eb:maj7 Ab:maj7 G:7 C:maj7'],
        ['Reached by its own ii–V, a quick trip to E♭ and back', 'C:maj7 F:m7 Bb:7 Eb:maj7 D:m7 G:7 C:maj7'],
      ] },
      { t: 'iiø7 (♭9, 11, ♭13)', s: 'from Aeolian', b: [
        'The minor ii, used in a major key. Its ♭5 is the key’s ♭6 (A♭), which falls to G in the V chord.',
        '- Locrian over it, or Locrian ♮2 for a sweeter 9',
        '- Same notes as Fm6: borrowed iv6 with D in the bass',
      ], eg: 'In C: Dm7♭5', ex: [
        ['iiø7 – V7♭9 – Imaj7: a minor ii–V landing on major', 'D:m7b5 G:7b9 C:maj7'],
        ['ii – iiø – V – I: the 5th of the ii sinks A → A♭ → G', 'D:m7 D:m7b5 G:7b9 C:maj7'],
        ['The same sound as iv6: Fm6 – G7 – C', 'F:m6 G:7 C:maj7'],
      ] },
      { t: 'i7 or i6', s: 'from Aeolian (m7) or Dorian (m6)', b: [
        'The tonic turned minor: E → E♭. The most direct darkening there is.',
        '- m6 has Dorian’s major 6th: the film-noir ending',
        '- i7 is also the ii of ♭VII, so it can open a door to a new key',
      ], eg: 'In C: Cm7, Cm6', ex: [
        ['I – i6 – I: a shadow passing over home', 'C:maj7 C:m6 C:maj7'],
        ['i7 as a pivot: Cm7 – F7 is a ii–V to B♭', 'C:maj7 C:m7 F:7 Bb:maj7'],
        ['Same root, new mood: I – IV, then i – iv', 'C:maj7 F:maj7 C:m7 F:m7'],
      ] },
      { t: 'v7 (m9)', s: 'from Mixolydian', b: [
        'The dominant without its leading tone (B♭ instead of B): no pull at all.',
        '- Dorian over it (Mixolydian’s notes on its 5th)',
      ], eg: 'In C: Gm7', ex: [
        ['v7 – I7 – IV: a ii–V into IV', 'C:maj7 G:m7 C:7 F:maj7'],
        ['I – v – IV – I: the folk/modal soft dominant', 'C:maj G:m7 F:maj C:maj'],
        ['v in place of V: a cadence with no leading tone lands softly', 'F:maj7 G:m9 C:maj7'],
      ] },
      { t: 'II7 (9, 13)', s: 'from Lydian', b: [
        'Lydian’s ♯4 (F♯) becomes the 3rd of II. Going to V, it’s a secondary dominant; going anywhere else, it’s pure Lydian colour.',
        '- Mixolydian over it (Lydian’s notes on its 2nd)',
      ], eg: 'In C: D7', ex: [
        ['I – II7 – IV – I: “Eight Days a Week”', 'C:maj D:7 F:maj C:maj'],
        ['C – D/C: the Lydian vamp itself (F♯ is the ♯4 of C)', 'C:maj7 D:maj/b7 C:maj7 D:maj/b7'],
        ['II7 – ii7 – V7 – I: the 3rd sinks F♯ → F', 'C:maj7 D:9 D:m7 G:7 C:maj7'],
      ] },
      { t: '♭IImaj7♯11', s: 'from Phrygian: the Neapolitan', b: [
        'A half step above home. It slides down to I like a tritone sub without the tritone.',
        '- Lydian over it (Phrygian’s notes on ♭2)',
      ], eg: 'In C: D♭maj7♯11', ex: [
        ['ii – ♭IImaj7 – I: the side-slip home', 'D:m7 Db:maj7#11 C:maj7'],
        ['♭II6 – V – i: the classical Neapolitan, in C minor', 'Db:maj/3 G:7 C:min'],
        ['i – ♭II – i: the Phrygian (flamenco) vamp', 'C:min Db:maj C:min Db:maj'],
      ] },
      { t: 'The backdoor ii–V', s: 'iv7 → ♭VII7 → I', b: [
        'Both chords come from the parallel minor. It lands on I from below (a whole step) instead of from V (a 5th).',
        '- Voice-lead: A♭ falls to G, E♭ to D or E',
      ], eg: 'In C: Fm7 – B♭7 – Cmaj7', ex: [
        ['The backdoor alone: “Lady Bird” bars 3–5', 'F:m7 Bb:7 C:maj7'],
        ['Front door, then back door', 'D:m7 G:7 C:maj7 F:m7 Bb:7 C:maj7'],
        ['As a turnaround: I – iv7 – ♭VII7 – I', 'C:maj7 F:m7 Bb:9 C:maj7'],
      ] },
      { t: 'Borrowing the other way', s: 'minor keys borrow too', b: [
        '- <b>IV7</b> from Dorian: the major 6th makes a bright IV',
        '- <b>V7</b> from harmonic minor: the leading tone, for a real pull home',
        '- <b>Picardy</b>: a minor piece ending on a major I',
      ], eg: 'In A minor: D7, E7, and an A major ending', ex: [
        ['i7 – IV7 vamp (Dorian): “Oye Como Va”', 'A:m7 D:9 A:m7 D:9'],
        ['i – ♭VII – ♭VI – V7: the Andalusian cadence, with a harmonic-minor V', 'A:min G:maj F:maj E:7'],
        ['i – iv – V7 – I: a Picardy ending', 'A:min D:min E:7b9 A:maj'],
      ] },
    ],
  },
  {
    id: 'melmin', name: 'Melodic minor chords', cards: [
      { t: 'Where they come from', s: 'the modes of melodic minor', b: [
        'Melodic minor is a major scale with a ♭3. Its modes give the chords that define modern jazz:',
        '- 1 melodic minor: m(maj7)',
        '- 2 Dorian ♭2: sus♭9',
        '- 3 Lydian augmented: maj7♯5',
        '- 4 Lydian dominant: 7♯11',
        '- 5 Mixolydian ♭6: 7♭13',
        '- 6 Locrian ♮2: ø9',
        '- 7 altered: 7alt',
      ], eg: 'C melodic minor: C D E♭ F G A B' },
      { t: 'm(maj7)', s: '1st mode: melodic minor', b: [
        'The minor tonic with a major 7th: dark and suspended.',
        '- i(maj7) as a home chord, especially at the end',
        '- The line cliché: i – i(maj7) – i7 – i6',
        '- Scale: melodic minor on the same root',
      ], eg: 'In C minor: Cm(maj7)', play: 'D:m7b5 G:7alt C:mMaj7' },
      { t: '7♯11', s: '4th mode: Lydian dominant', b: [
        'The dominant that floats. Use it on any dominant that doesn’t pull, and on tritone subs.',
        '- Scale: melodic minor a 5th above the root',
      ], eg: 'D7♯11 uses A melodic minor', play: 'C:maj7 D:7#11 C:maj7' },
      { t: '7alt', s: '7th mode: altered', b: [
        'Every tension altered: ♭9, ♯9, ♯11, ♭13. For any V7 that resolves, especially to minor.',
        '- Scale: melodic minor a half step above the root',
        '- G7alt is A♭ melodic minor, the same notes as D♭7♯11 (its tritone sub)',
      ], eg: 'G7alt → Cm', play: 'D:m7b5 G:7alt C:m6' },
      { t: 'ø9', s: '6th mode: Locrian ♮2', b: [
        'A sweeter iiø: plain Locrian has a ♭9, this has a natural 9.',
        '- The ii of a minor ii–V–i',
        '- Scale: melodic minor a minor 3rd above the root',
      ], eg: 'Dø9 uses F melodic minor', play: 'D:m7b5 G:7b9 C:m6' },
      { t: 'maj7♯5', s: '3rd mode: Lydian augmented', b: [
        'Bright, unstable, glassy. In a minor key it’s ♭III+, straight from melodic minor.',
        '- Also a tense Imaj7 that wants to settle',
        '- Scale: melodic minor a minor 3rd below the root',
      ], eg: 'In C minor: E♭maj7♯5', play: 'C:mMaj7 Eb:maj7#5 F:m7 G:7alt C:m6' },
      { t: '7♭13', s: '5th mode: Mixolydian ♭6', b: [
        'A V7 going to minor, with a natural 9 and a ♭13. Darker than Mixolydian, softer than altered.',
        '- Scale: melodic minor a 4th above the root',
      ], eg: 'G7♭13 → Cm uses C melodic minor', play: 'D:m7b5 G:7b13 C:m6' },
      { t: 'Find the scale fast', s: 'melodic minor, from the chord', b: [
        '- m(maj7): on the root',
        '- 7♯11: up a 5th',
        '- 7alt: up a half step',
        '- ø9: up a minor 3rd',
        '- 7♭13: up a 4th',
        '- maj7♯5: down a minor 3rd',
      ], eg: 'One scale, seven chords: learn its shapes once' },
    ],
  },
  {
    id: 'nopull', name: 'Dominants that don’t pull', cards: [
      { t: 'Pull or colour?', s: 'the rule', b: [
        'A dominant <b>pulls</b> when its root falls a 5th to the next chord, like V → I. Every other dominant is mainly <b>colour</b>: bluesy, bright, floating.',
        '- Use 9, ♯11 and 13 (Lydian dominant), or Mixolydian for a rootsier sound',
        '- Avoid ♭9 and ♭13: they say “resolve now”',
      ], eg: 'All the examples in this deck are in G' },
      { t: 'I7', s: 'G7 in G', b: [
        'A blues tonic, or a static vamp: a colour, not a function.',
        '- In bar 4 of a blues it does pull, to IV7',
      ], eg: 'G7 as home', play: 'G:7 C:9 G:7' },
      { t: 'IV7', s: 'C7 in G', b: [
        'Blues, or IV7 → I, a plagal move.',
        '- Its ♯11 is F♯, the key’s leading tone, so it sounds right at home',
      ], eg: 'G – C7 – G', play: 'G:maj7 C:7#11 G:maj7' },
      { t: '♭VII7', s: 'F7 in G: the backdoor', b: [
        'Steps up a whole tone to I, often after iv7.',
      ], eg: 'Cm7 – F7 – G', play: 'C:m7 F:9 G:maj7' },
      { t: '♭VI7 → V', s: 'E♭7 → D7 in G', b: [
        'Down a half step. It’s the tritone sub of V/V, and in classical theory the <b>German augmented sixth</b>.',
        '- Its D♭ is really C♯, which pushes up to D',
      ], eg: 'E♭7 → D7 → G', play: 'G:maj7 Eb:7#11 D:7 G:maj7' },
      { t: '♭VI7 → I', s: 'E♭7 → G', b: [
        'A darker backdoor resolution.',
        '- ♭VI7 – ♭VII7 – I, or ♭VI7 straight to I at the end',
      ], eg: 'E♭7 – F7 – G', play: 'Eb:7#11 F:9 G:maj7' },
      { t: '♭II7', s: 'A♭7 in G', b: [
        'The tritone sub of V: it slides down a half step to I.',
      ], eg: 'Am7 – A♭7 – G', play: 'A:m7 Ab:7#11 G:maj7' },
      { t: 'II7 not going to V', s: 'A7 in G', b: [
        'Lydian colour rather than V/V.',
        '- I – II7 – ii7 – ♭II7 – I: “The Girl from Ipanema”',
        '- II7♭5: bar 3 of “Take the A Train”',
      ], eg: 'G – A7 – Am7 – A♭7 – G', play: 'G:maj7 A:7#11 A:m7 Ab:7#11 G:maj7' },
      { t: 'How they move', s: 'four ways', b: [
        '- <b>Down a half step</b>: ♭II7 → I, ♭VI7 → V. Approach any chord with a 7♯11 a half step above',
        '- <b>Up a whole step</b>: ♭VII7 → I, ♭VI7 → ♭VII7',
        '- <b>Plagal</b> (root down a 4th): IV7 → I',
        '- <b>Staying put</b>: vamp on one dominant (funk, blues, modal tunes)',
      ] },
      { t: 'Follow the guide tones', s: 'even without pull', b: [
        'The 3rd and ♭7 should move by half step or hold.',
        '- E♭7 → D7: G → F♯, D♭ → C (both down a half step)',
        '- A♭7 → G: C → B; G♭ is F♯, so it holds',
        '- C7 → G: E → D, B♭ → B',
      ] },
      { t: 'Practise it', s: 'over a G drone', b: [
        'G → C7 → G, then G → F7 → G, G → E♭7 → G, G → A♭7 → G.',
        'Sing the ♯11 on each one until you can hear the colour.',
      ], play: 'G:maj7 C:7#11 G:maj7 F:7#11 G:maj7' },
    ],
  },
  {
    id: 'secdom', name: 'Secondary dominants', cards: [
      { t: 'V of something else', s: 'what they are', b: [
        'Any diatonic chord (not vii°) can have its own V7. It borrows that chord’s leading tone, and these <b>do pull</b>: the root falls a 5th.',
        '- V7/ii = VI7, V7/iii = VII7, V7/IV = I7, V7/V = II7, V7/vi = III7',
      ], eg: 'In C: A7, B7, C7, D7, E7' },
      { t: 'Which tensions?', s: 'it depends on the target', b: [
        '- Going to a <b>minor</b> chord: 7♭9, ♭13 (Phrygian dominant, from the target’s harmonic minor)',
        '- Going to a <b>major</b> chord: 9, 13 (Mixolydian)',
        'The target’s key decides the scale.',
      ] },
      { t: 'V7/ii', s: 'VI7', b: [
        'C♯, its 3rd, leads up to D.',
        '- I – VI7 – ii – V: the most common turnaround in jazz',
      ], eg: 'In C: A7♭9 → Dm7', play: 'C:maj7 A:7b9 D:m7 G:7 C:maj7' },
      { t: 'V7/iii', s: 'VII7', b: [
        'The most outside-sounding one: D♯ and F♯ are both foreign to C.',
      ], eg: 'In C: B7♭9 → Em7', play: 'C:maj7 B:7b9 E:m7' },
      { t: 'V7/IV', s: 'I7', b: [
        'The tonic grows a ♭7, and B♭ leads down to A.',
        '- Bar 4 of the blues',
      ], eg: 'In C: C7 → Fmaj7', play: 'C:maj7 C:9 F:maj7' },
      { t: 'V7/V', s: 'II7', b: [
        'F♯ leads up to G.',
        '- II7 – V7 – I',
      ], eg: 'In C: D9 → G7 → C', play: 'C:maj7 D:9 G:13 C:maj7' },
      { t: 'V7/vi', s: 'III7', b: [
        'G♯ leads up to A.',
        '- “All of Me” is the textbook: I – III7 – VI7 – ii',
      ], eg: 'In C: E7♭9 → Am7', play: 'C:maj7 E:7b9 A:m7' },
      { t: 'Add its ii', s: 'the related ii', b: [
        'Put a ii in front of a secondary dominant and you get a ii–V into that chord.',
        '- Before major: iim7 – V7 (Am7 – D7 → G)',
        '- Before minor: iiø7 – V7♭9 (Bø7 – E7♭9 → Am)',
      ], play: 'B:m7b5 E:7b9 A:m7 D:m7 G:7 C:maj7' },
      { t: 'Extended dominants', s: 'dominants into dominants', b: [
        'III7 – VI7 – II7 – V7 – I: each one resolves to another dominant, roots falling in 5ths.',
        '- “Sweet Georgia Brown”, and the bridge of rhythm changes',
      ], eg: 'In C: E7 – A7 – D7 – G7 – C', play: 'E:7 A:7 D:7 G:7 C:maj7' },
      { t: 'The guide-tone chain', s: 'why extended dominants sound smooth', b: [
        'The 3rd and 7th take turns falling a half step:',
        '- E7 (G♯, D) → A7 (G, C♯)',
        '- → D7 (F♯, C) → G7 (F, B)',
        'Two notes, each moving a fret at a time. Play just those on two strings.',
      ], play: 'E:7 A:7 D:7 G:7 C:maj7' },
    ],
  },
  {
    id: 'tritone', name: 'Tritone substitutions', cards: [
      { t: 'Why it works', s: 'one tritone, two dominants', b: [
        'Two dominants a tritone apart share the same 3rd and 7th, with the roles swapped.',
        '- G7: B and F',
        '- D♭7: F and C♭ (= B)',
        'Swap one for the other and the bass slides down a half step instead of falling a 5th.',
      ], play: 'D:m7 G:7 C:maj7 D:m7 Db:7#11 C:maj7' },
      { t: 'Play 7♯11 on them', s: 'Lydian dominant', b: [
        'A tritone sub’s ♯11 is the original V’s root, so 7♯11 is the natural colour.',
        '- D♭7♯11 uses A♭ melodic minor, the same notes as G7alt',
      ] },
      { t: '♭II7 → I', s: 'subs for V7', eg: 'In C: D♭7 → C', play: 'D:m7 Db:7#11 C:maj7' },
      { t: '♭III7 → ii', s: 'subs for V7/ii (VI7)', eg: 'In C: E♭7 → Dm7', play: 'C:maj7 Eb:7#11 D:m7' },
      { t: '♭VI7 → V', s: 'subs for V7/V (II7)', eg: 'In C: A♭7 → G7', play: 'C:maj7 Ab:7#11 G:7 C:maj7' },
      { t: '♭VII7 → vi', s: 'subs for V7/vi (III7)', b: [
        'The same chord as the backdoor dominant, but a different job: the backdoor goes up to I, this one goes down to vi.',
      ], eg: 'In C: B♭7 → Am7', play: 'C:maj7 Bb:7#11 A:m7' },
      { t: 'IV7 → iii', s: 'subs for V7/iii (VII7)', eg: 'In C: F7 → Em7', play: 'C:maj7 F:7#11 E:m7' },
      { t: '♭V7 → IV', s: 'subs for V7/IV (I7)', eg: 'In C: G♭7 → Fmaj7', play: 'C:maj7 Gb:7#11 F:maj7' },
      { t: 'Sub the ii as well', s: 'the tritone ii–V', b: [
        '- ii – ♭II7 – I: only the V is subbed',
        '- ♭vi7 – ♭II7 – I: the whole ii–V moved a tritone',
      ], eg: 'In C: Dm7 – D♭7 – C, or A♭m7 – D♭7 – C', play: 'Ab:m7 Db:7 C:maj7' },
      { t: 'Chromatic chains', s: 'alternate subs in a dominant chain', b: [
        'Sub every other dominant in III7 – VI7 – II7 – V7 and the bass walks down by half steps.',
      ], eg: 'E7 – E♭7 – D7 – D♭7 – C', play: 'E:7 Eb:7#11 D:7 Db:7#11 C:maj7' },
    ],
  },
  {
    id: 'dim', name: 'Diminished chords', cards: [
      { t: 'It repeats every 3 frets', s: 'symmetry', b: [
        'A °7 is stacked minor 3rds, so moving it 3 frets gives the same notes in a new inversion.',
        '- There are only three different °7 chords: C°7, C♯°7, D°7',
        '- On guitar: one shape, slid up in 3-fret jumps',
      ] },
      { t: 'Four dominants in one', s: 'a °7 is a rootless 7♭9', b: [
        'Put a root a major 3rd below any note of a °7 and you get a 7♭9.',
        '- C♯°7 (C♯ E G B♭) = A7♭9, C7♭9, E♭7♭9 or F♯7♭9 without the root',
        '- So C♯°7 can lead to Dm, F, A♭ or B',
      ] },
      { t: 'Rising diminished', s: '♯I°7 → ii, ♯II°7 → iii, ♯IV°7 → V, ♯V°7 → vi', b: [
        'A °7 a half step under its target: each one is the rootless V7♭9 of the chord it leads to.',
        '- C♯°7 = A7♭9 → Dm7',
      ], eg: 'In C: C – C♯°7 – Dm7 – D♯°7 – Em7', play: 'C:maj7 C#:dim7 D:m7 D#:dim7 E:m7' },
      { t: 'Descending diminished', s: '♭III°7 → ii', b: [
        'A chromatic passing chord on the way down.',
        '- iii – ♭iii°7 – ii – V',
      ], eg: 'In C: Em7 – E♭°7 – Dm7 – G7', play: 'E:m7 Eb:dim7 D:m7 G:7 C:maj7' },
      { t: 'Common-tone diminished', s: 'I°7 → I', b: [
        'A neighbour chord that shares the root and has no pull. Over a C pedal, D♯ rises to E, F♯ rises to G, and A stays as the 6th.',
        '- Also on V: G°7 → G7',
      ], eg: 'In C: C – C°7 – C', play: 'C:6 C:dim7 C:6' },
      { t: 'vii°7 → I', s: 'the leading-tone chord', b: [
        'A rootless V7♭9. In major its ♭6 (A♭) is borrowed from harmonic minor.',
        '- B → C, F → E, A♭ → G',
      ], eg: 'In C: B°7 → C', play: 'B:dim7 C:maj7' },
      { t: 'The scales', s: 'two sides of one scale', b: [
        '- <b>Whole-half</b> over °7: C D E♭ F G♭ A♭ A B',
        '- <b>Half-whole</b> over 7♭9: G A♭ B♭ B C♯ D E F',
        'Same eight-note family, starting on a different step.',
      ] },
      { t: '°7 vs ø7', s: "don't mix them up", b: [
        '- <b>°7</b> (diminished 7th): 1 ♭3 ♭5 𝄫7. Symmetrical, passing, a rootless 7♭9',
        '- <b>ø7</b> (half-diminished, m7♭5): 1 ♭3 ♭5 ♭7. A real chord: iiø in minor, viiø in major',
        '- Locrian (or Locrian ♮2) over ø7, whole-half over °7',
      ], eg: 'C°7 has A; Cø7 has B♭' },
    ],
  },
  {
    id: 'twofive', name: 'ii–V–I', cards: [
      { t: 'The engine', s: 'ii – V – I', b: [
        'Predominant → dominant → tonic, roots falling in 5ths. Most jazz tunes are chains of these.',
      ], eg: 'In C: Dm7 – G7 – Cmaj7', play: 'D:m7 G:7 C:maj7' },
      { t: 'Guide tones', s: '3rds and 7ths', b: [
        'The 7th of each chord falls a half step to the 3rd of the next. The 3rd holds and becomes the next 7th.',
        '- Dm7 (F, C) → G7 (F, B) → Cmaj7 (E, B)',
        '- C → B, then F → E',
      ], play: 'D:m7 G:7 C:maj7' },
      { t: 'Voice-lead it', s: 'move as little as possible', b: [
        '- Dm7 → G7: two notes move (A → G, C → B); D and F stay',
        '- G7 → Cmaj7: F → E and D → C (or keep D as the 9); G and B stay',
        'Learn it in drop 2 on the top four strings, in every area of the neck.',
      ], play: 'D:m9 G:13 C:maj9' },
      { t: 'Minor ii–V–i', s: 'iiø7 – V7♭9 – i', b: [
        '- Dø7: D Locrian ♮2 (F melodic minor)',
        '- G7♭9 or G7alt: Phrygian dominant or altered',
        '- Cm6 or Cm(maj7): C melodic minor',
      ], eg: 'In C minor: Dm7♭5 – G7alt – Cm6', play: 'D:m7b5 G:7alt C:m6' },
      { t: 'A ii–V to anything', s: 'tonicising', b: [
        'Any diatonic chord can be approached by its own ii–V:',
        '- To Dm: Eø7 – A7♭9',
        '- To Em: F♯ø7 – B7♭9',
        '- To F: Gm7 – C7',
        '- To G: Am7 – D7',
        '- To Am: Bø7 – E7♭9',
      ] },
      { t: 'Three ways home', s: 'front door, back door, side door', b: [
        '- <b>ii–V</b>: Dm7 – G7 – C',
        '- <b>Backdoor</b>: Fm7 – B♭7 – C',
        '- <b>Tritone</b>: A♭m7 – D♭7 – C',
      ], play: 'D:m7 G:7 C:maj7 F:m7 Bb:7 C:maj7' },
      { t: 'Turnarounds', s: 'getting back to the top', b: [
        '- I – vi – ii – V: Cmaj7 – Am7 – Dm7 – G7',
        '- I – VI7 – ii – V: Cmaj7 – A7 – Dm7 – G7',
        '- iii – VI7 – ii – V: Em7 – A7 – Dm7 – G7',
        '- Tadd Dameron: Cmaj7 – E♭7 – A♭7 – D♭7 (all tritone subs)',
      ], play: 'C:maj7 Eb:7#11 Ab:7#11 Db:7#11 C:maj7' },
      { t: 'ii–V chains', s: 'back to back', b: [
        '- Down by 5ths: Em7 A7 | Dm7 G7 | C',
        '- Down by half steps: Em7 A7 | E♭m7 A♭7 | Dm7 G7 | C',
        '- “Satin Doll” is built from them',
      ], play: 'E:m7 A:7 Eb:m7 Ab:7 D:m7 G:7 C:maj7' },
      { t: 'Deceptive endings', s: 'when V doesn’t go to I', b: [
        '- V → vi: G7 → Am7',
        '- V → ♭VI: G7 → A♭maj7',
        'Set up the ear, then land somewhere else.',
      ], play: 'D:m7 G:7 A:m7 D:m7 G:7 Ab:maj7' },
      { t: 'Drill it round the cycle', s: 'all 12 keys', b: [
        'Play Dm7 – G7 – Cmaj7, then turn the Cmaj7 into Cm7: it’s the ii of B♭. Cm7 – F7 – B♭maj7, then B♭m7, and so on through all 12 keys.',
      ], play: 'D:m7 G:7 C:maj7 C:m7 F:7 Bb:maj7' },
    ],
  },
  {
    id: 'mediants', name: 'Chromatic mediants', cards: [
      { t: 'What they are', s: 'thirds apart, same quality', b: [
        'Two chords of the same quality with roots a major or minor 3rd apart, where one is outside the key. They share only one note.',
        '- From C: E, A♭, A and E♭ major',
        '- (Em and Am are the diatonic mediants: they share two notes)',
      ] },
      { t: 'I → III', s: 'up a major 3rd', b: [
        'E is the common tone; G rises to G♯ and C falls to B. Bright and lifting.',
      ], eg: 'C → E', play: 'C:maj E:maj C:maj' },
      { t: 'I → ♭VI', s: 'down a major 3rd', b: [
        'C is the common tone; E falls to E♭ and G rises to A♭. Dark and epic: the film-score move.',
      ], eg: 'C → A♭', play: 'C:maj Ab:maj C:maj' },
      { t: 'I → VI', s: 'down a minor 3rd', b: [
        'E is the common tone; C rises to C♯ and G rises to A. Warm.',
      ], eg: 'C → A', play: 'C:maj A:maj C:maj' },
      { t: 'I → ♭III', s: 'up a minor 3rd', b: [
        'G is the common tone; E falls to E♭ and C falls to B♭. Bold and sudden.',
      ], eg: 'C → E♭', play: 'C:maj Eb:maj C:maj' },
      { t: 'Doubly chromatic', s: 'no common tone', b: [
        'Change the quality as well and nothing is shared: every voice moves by a half or whole step.',
        '- C → A♭m: eerie, ominous',
        '- C → E♭m',
      ], play: 'C:maj Ab:min C:maj' },
      { t: 'How they work', s: 'voice leading, not function', b: [
        'Hold the common tone and move the other voices by step. They don’t pull anywhere; they shift the light.',
        '- Modulate to a far key in one move',
        '- Surprise before going home: I – ♭VI – I',
        '- Over each chord, play its own key (E Lydian over E in C, say)',
      ] },
      { t: 'Major-3rd cycles', s: 'Coltrane changes', b: [
        'Split the octave into three major 3rds and reach each key with its own V7.',
        '- B – D7 – G – B♭7 – E♭: the start of “Giant Steps”',
        '- The bridge of “Have You Met Miss Jones” moves through major 3rds too',
      ], play: 'B:maj7 D:7 G:maj7 Bb:7 Eb:maj7' },
    ],
  },
  {
    id: 'voicelead', name: 'Harmony and voice leading', cards: [
      { t: 'Three jobs', s: 'function', b: [
        '- <b>Tonic</b> (I, iii, vi): home',
        '- <b>Predominant</b> (ii, IV): leaving home',
        '- <b>Dominant</b> (V, vii°): the pull back',
        'Most progressions go tonic → predominant → dominant → tonic.',
      ], play: 'C:maj7 F:maj7 G:7 C:maj7' },
      { t: 'Root motion', s: 'how the bass moves', b: [
        '- <b>Down a 5th</b>: the strongest (ii – V – I)',
        '- <b>Down a 3rd</b>: soft, two notes shared (I – vi – IV – ii)',
        '- <b>Up a step</b>: bold (IV – V, ♭VI – ♭VII – I)',
        '- <b>Down a step</b>: rock and modal (I – ♭VII – ♭VI)',
      ] },
      { t: 'The tritone in V7', s: 'where the pull comes from', b: [
        'G7’s 3rd and 7th, B and F, are a tritone apart. B rises to C and F falls to E. That one move is the whole engine of the dominant.',
      ], play: 'G:7 C:maj' },
      { t: 'Guide tones and shells', s: '3rds and 7ths', b: [
        'The 3rd and 7th tell you what the chord is. Root and 5th can go, since the bass has the root.',
        '- Root, 3rd and 7th is a shell voicing: the jazz comping skeleton',
      ] },
      { t: 'Common tones', s: 'move like a choir', b: [
        'Keep the notes two chords share. Move the others by the smallest step.',
        'Pros voice-lead from chord to chord instead of jumping from grip to grip.',
      ] },
      { t: 'The top line', s: 'the melody your chords make', b: [
        'The highest note is what people hear as the tune. Choose voicings so the top voice moves by step, and use contrary motion against the bass.',
      ] },
      { t: 'Pedal point', s: 'one note held under moving chords', b: [
        'Hold the bass (often 5 or 1) while the chords change above it: tension that resolves when the bass finally moves.',
      ], eg: 'Over a G bass: C/G – F/G – G7 – C', play: 'C:maj/5 G:9sus4 G:7 C:maj7' },
      { t: 'Upper-structure triads', s: 'a triad over a 3–7 shell', b: [
        'Over G7 (B and F):',
        '- A triad: 9, ♯11, 13 (Lydian dominant)',
        '- E triad: 13, ♭9, 3 (13♭9)',
        '- E♭ triad: ♭13, root, ♯9 (altered)',
        '- D♭ triad: ♭5, ♭7, ♭9',
      ], play: 'G:13 G:13b9 G:7alt C:maj7' },
      { t: 'IV/V', s: 'the sus dominant', b: [
        'F/G = G9sus4: a dominant with no tritone, so no pull. Soft and open.',
        '- “Maiden Voyage” is built on sus chords',
      ], play: 'G:9sus4 G:7 C:maj7' },
      { t: 'Quartal voicings', s: 'stacked 4ths', b: [
        'Open and modal, with no strong 3rd.',
        '- The “So What” voicing: three 4ths and a major 3rd, e.g. D G C F A for Dm11',
      ] },
      { t: 'Cadences', s: 'how a phrase ends', b: [
        '- <b>Authentic</b>: V → I',
        '- <b>Plagal</b>: IV → I or iv → I (the “amen”)',
        '- <b>Half</b>: stop on V',
        '- <b>Deceptive</b>: V → vi',
      ] },
    ],
  },
  {
    id: 'other', name: 'Other chords worth knowing', cards: [
      { t: 'V7♯5 / V+', s: 'passing into I', b: [
        'The ♯5 (D♯) rises to the 3rd of I (E).',
        '- Whole-tone or altered scale over it',
      ], eg: 'In C: G7♯5 → C', play: 'D:m7 G:7#5 C:maj7' },
      { t: 'Line clichés', s: 'one voice moving inside a chord', b: [
        '- Major: I – I+ – I6 – I7 (G – G♯ – A – B♭ in C), often into IV',
        '- Minor: i – i(maj7) – i7 – i6 (C – B – B♭ – A in Cm)',
        '- “My Funny Valentine” opens on the minor one',
      ], play: 'C:m C:mMaj7 C:m7 C:m6' },
      { t: 'V7sus4', s: 'IV/V', b: [
        'A soft dominant with no pull. It often goes to V7 and then I, or straight to I.',
      ], eg: 'In C: G7sus4 = F/G', play: 'G:7sus4 G:7 C:maj7' },
      { t: 'Picardy third', s: 'a major I in a minor key', b: [
        'End a minor-key piece on a major tonic: sudden light.',
      ], eg: 'In A minor: … E7 → A major', play: 'A:min D:m7 E:7 A:maj' },
      { t: 'IV7 in minor', s: 'from Dorian', b: [
        'Dorian’s major 6th gives the minor key a major IV.',
        '- i7 – IV7 vamp: “Oye Como Va”',
      ], eg: 'In A minor: Am7 – D7', play: 'A:m7 D:9 A:m7 D:9' },
      { t: 'V7♭9 in minor', s: 'from harmonic minor', b: [
        'The raised 7th (G♯ in A minor) gives the minor key a real dominant.',
        '- Phrygian dominant over it',
      ], eg: 'In A minor: E7♭9 → Am', play: 'A:m7 B:m7b5 E:7b9 A:m7' },
      { t: 'Augmented sixths', s: '♭VI → V, classical names', b: [
        'In C, going to G. Each has A♭ and F♯, which open out to the G octave:',
        '- Italian: A♭ C F♯',
        '- French: A♭ C D F♯',
        '- German: A♭ C E♭ F♯ (sounds like A♭7: the tritone sub of D7)',
      ], play: 'Ab:7 G:maj C:maj' },
      { t: 'The Neapolitan', s: '♭II, usually in first inversion', b: [
        'A predominant from Phrygian: ♭II → V → i. Its ♭2 falls through the leading tone to the tonic.',
      ], eg: 'In C minor: D♭/F – G7 – Cm', play: 'Db:maj/3 G:7 C:min' },
      { t: 'Tonic colours', s: 'what jazz players end on', b: [
        '- Major: maj7, 6, 6/9, maj9 (not the 11)',
        '- Minor: m6, m(maj7), m9 (Dorian or melodic minor)',
      ], play: 'D:m7 G:13 C:6/9' },
      { t: '7♯9', s: 'the blues dominant', b: [
        'Major and minor 3rd at once: the ♯9 is the blue note against the 3rd.',
        '- Over a I7 in a blues, or a V7 going to minor',
      ], eg: 'E7♯9', play: 'E:7#9 A:7 E:7#9' },
    ],
  },
  {
    id: 'map', name: 'Chord-scale map', cards: [
      { t: 'maj7', s: 'Ionian or Lydian', b: [
        '- Ionian on I',
        '- Lydian on IV, ♭VI, ♭II and ♭VII',
        '- Avoid the 4th on I: it clashes with the 3rd',
      ] },
      { t: 'm7', s: 'Dorian, Aeolian or Phrygian', b: [
        '- Dorian on ii, on borrowed iv, on v',
        '- Aeolian on vi',
        '- Phrygian on iii',
      ] },
      { t: 'Dominant 7', s: 'it depends where it goes', b: [
        '- Pulling to major: Mixolydian',
        '- Pulling to minor: Phrygian dominant, altered or half-whole',
        '- Not pulling: Lydian dominant',
      ] },
      { t: 'ø7, °7, m(maj7)', s: 'the rest', b: [
        '- ø7: Locrian, or Locrian ♮2',
        '- °7: whole-half',
        '- m(maj7): melodic minor',
      ] },
      { t: 'The modes of major', s: 'where they come from', b: [
        'Each mode is the major scale started on one of its degrees. From brightest to darkest, with the note that defines each:',
        '- Lydian (4th): ♯4',
        '- Ionian (1st)',
        '- Mixolydian (5th): ♭7',
        '- Dorian (2nd): ♮6 in a minor mode',
        '- Aeolian (6th): ♭6',
        '- Phrygian (3rd): ♭2',
        '- Locrian (7th): ♭5',
      ] },
      { t: 'Harmonic minor’s 5th mode', s: 'Phrygian dominant', b: [
        'The one harmonic-minor mode you need: 1 ♭2 3 4 5 ♭6 ♭7. It’s the V7♭9 of a minor key.',
      ], eg: 'E Phrygian dominant over E7♭9 → Am' },
      { t: 'Avoid notes', s: 'pass through, don’t land', b: [
        'A note a half step above a chord tone clashes when held:',
        '- The 4th over a major chord (above the 3rd)',
        '- The ♭6 over an Aeolian m7 (above the 5th), which is why Dorian is the default minor',
        '- The 4th over a dominant 7, unless it’s sus',
      ] },
    ],
  },
];

// ---------- more examples in context for the chord cards ----------
// [deck, card title, examples]: each card's own example comes first, then how else it's used.
const MORE = [
  ['melmin', 'm(maj7)', [
    ['Minor ii–V–i landing on m(maj7)', 'D:m7b5 G:7alt C:mMaj7'],
    ['The line cliché: one voice falls C → B → B♭ → A', 'C:min C:mMaj7 C:m7 C:m6'],
    ['The last chord of a minor tune, with a sting', 'F:m7 G:7b9 C:mMaj7'],
  ]],
  ['melmin', '7♯11', [
    ['II7♯11 in major: Lydian colour on the II', 'C:maj7 D:7#11 C:maj7'],
    ['As a tritone sub: ♭II7♯11 → I', 'D:m7 Db:7#11 C:maj7'],
    ['IV7♯11 in a blues: its ♯11 is the key’s 7th (B)', 'C:7 F:7#11 C:7'],
    ['♭VI7♯11 → V: the German 6th', 'Ab:7#11 G:7 C:maj7'],
  ]],
  ['melmin', '7alt', [
    ['Minor ii–V–i', 'D:m7b5 G:7alt C:m6'],
    ['Into major as well: the altered V makes I sound brighter', 'D:m7 G:7alt C:maj7'],
    ['VI7alt → ii in a turnaround', 'C:maj7 A:7alt D:m7 G:7alt C:maj7'],
  ]],
  ['melmin', 'ø9', [
    ['Minor ii–V–i', 'D:m7b5 G:7b9 C:m6'],
    ['viiø in major, as the ii of vi: Bø7 – E7 – Am', 'B:m7b5 E:7b9 A:m7'],
    ['♯ivø in major, as the ii of iii: F♯ø7 – B7 – Em', 'C:maj7 F#:m7b5 B:7b9 E:m7'],
  ]],
  ['melmin', 'maj7♯5', [
    ['♭III+ in C minor', 'C:mMaj7 Eb:maj7#5 F:m7 G:7alt C:m6'],
    ['Imaj7♯5 → Imaj7: the ♯5 settles down to the 5th (G♯ → G)', 'C:maj7#5 C:maj7'],
    ['A rising line: the 5th climbs G → G♯ → A', 'C:maj7 C:maj7#5 C:6'],
  ]],
  ['melmin', '7♭13', [
    ['V7♭13 → i', 'D:m7b5 G:7b13 C:m6'],
    ['A darker V into major: G7♭13 → Cmaj7', 'D:m7 G:7b13 C:maj7'],
    ['III7♭13 → vi: E7’s ♭13 (C) holds into Am', 'C:maj7 E:7b13 A:m7'],
  ]],
  ['nopull', 'I7', [
    ['Blues tonic: I7 – IV7 – I7', 'G:7 C:9 G:7'],
    ['Funk vamp: one dominant, no resolution', 'G:9 G:13 G:9 G:13'],
    ['Bar 4 of a blues: here I7 does pull, to IV7', 'G:7 C:7 G:7 G:7b9 C:9'],
  ]],
  ['nopull', 'IV7', [
    ['G – C7 – G: plagal', 'G:maj7 C:7#11 G:maj7'],
    ['IV7 – iv6 – I: the 3rd sinks E → E♭ → D', 'C:9 C:m6 G:maj7'],
    ['The blues: I7 – IV7 – I7', 'G:7 C:9 G:7'],
  ]],
  ['nopull', '♭VII7', [
    ['Cm7 – F7 – G: the backdoor', 'C:m7 F:9 G:maj7'],
    ['IV – iv – ♭VII7 – I', 'C:maj7 C:m7 F:9 G:maj7'],
    ['G – F7 – G: a vamp', 'G:maj7 F:9 G:maj7'],
  ]],
  ['nopull', '♭VI7 → V', [
    ['E♭7 → D7 → G', 'G:maj7 Eb:7#11 D:7 G:maj7'],
    ['ii – ♭VI7 – V – I', 'A:m7 Eb:7#11 D:7 G:maj7'],
    ['A turnaround with the bass walking down G, E, E♭, D', 'G:maj7 E:m7 Eb:7#11 D:7 G:maj7'],
  ]],
  ['nopull', '♭VI7 → I', [
    ['E♭7 – F7 – G', 'Eb:7#11 F:9 G:maj7'],
    ['iv – ♭VI7 – I: Cm7 – E♭7 – G', 'C:m7 Eb:7#11 G:maj7'],
  ]],
  ['nopull', '♭II7', [
    ['Am7 – A♭7 – G', 'A:m7 Ab:7#11 G:maj7'],
    ['ii – V – ♭II7 – I: the V slides down before landing', 'A:m7 D:7 Ab:7#11 G:maj7'],
    ['E♭m7 – A♭7 – G: the whole tritone ii–V', 'Eb:m7 Ab:7 G:maj7'],
  ]],
  ['nopull', 'II7 not going to V', [
    ['G – A7 – Am7 – A♭7 – G (“Ipanema”)', 'G:maj7 A:7#11 A:m7 Ab:7#11 G:maj7'],
    ['I – II7 – IV – I', 'G:maj A:7 C:maj G:maj'],
    ['G – A7♯11 vamp: the sound of Lydian', 'G:maj7 A:7#11 G:maj7 A:7#11'],
  ]],
  ['secdom', 'V7/ii', [
    ['I – VI7 – ii – V', 'C:maj7 A:7b9 D:m7 G:7 C:maj7'],
    ['iii – VI7 – ii – V', 'E:m7 A:7b9 D:m7 G:7 C:maj7'],
    ['With its own ii: Eø7 – A7♭9 – Dm7', 'E:m7b5 A:7b9 D:m7'],
  ]],
  ['secdom', 'V7/iii', [
    ['B7♭9 → Em7', 'C:maj7 B:7b9 E:m7'],
    ['With its own ii: F♯ø7 – B7♭9 – Em7', 'F#:m7b5 B:7b9 E:m7'],
    ['VII7 – iii – VI7 – ii – V – I: the long way home', 'B:7b9 E:m7 A:7 D:m7 G:7 C:maj7'],
  ]],
  ['secdom', 'V7/IV', [
    ['C – C9 – F', 'C:maj7 C:9 F:maj7'],
    ['With its own ii (the borrowed v): Gm7 – C7 – F', 'G:m7 C:7 F:maj7'],
    ['I – I7 – IV – iv – I', 'C:maj7 C:9 F:maj7 F:m6 C:maj7'],
  ]],
  ['secdom', 'V7/V', [
    ['II7 – V7 – I', 'C:maj7 D:9 G:13 C:maj7'],
    ['With its own ii: Am7 – D7 – G7 – C', 'A:m7 D:9 G:7 C:maj7'],
  ]],
  ['secdom', 'V7/vi', [
    ['E7♭9 → Am7', 'C:maj7 E:7b9 A:m7'],
    ['The “All of Me” shape: I – III7 – VI7 – ii', 'C:6 E:7 A:7 D:m7'],
    ['With its own ii: Bø7 – E7♭9 – Am', 'B:m7b5 E:7b9 A:m7'],
  ]],
  ['tritone', '♭II7 → I', [
    ['Dm7 – D♭7 – C', 'D:m7 Db:7#11 C:maj7'],
    ['A♭m7 – D♭7 – C: the whole ii–V moved a tritone', 'Ab:m7 Db:7 C:maj7'],
    ['In a turnaround: C – A7 – Dm7 – D♭7', 'C:maj7 A:7 D:m7 Db:7#11 C:maj7'],
  ]],
  ['tritone', '♭III7 → ii', [
    ['C – E♭7 – Dm7 – G7', 'C:maj7 Eb:7#11 D:m7 G:7 C:maj7'],
    ['iii – ♭III7 – ii – V: the bass walks E, E♭, D, then G', 'E:m7 Eb:7#11 D:m7 G:7 C:maj7'],
  ]],
  ['tritone', '♭VI7 → V', [
    ['C – A♭7 – G7 – C', 'C:maj7 Ab:7#11 G:7 C:maj7'],
    ['ii – ♭VI7 – V – I', 'D:m7 Ab:7#11 G:7 C:maj7'],
  ]],
  ['tritone', '♭VII7 → vi', [
    ['B♭7 → Am7', 'C:maj7 Bb:7#11 A:m7'],
    ['Same chord, two jobs: B♭7 → C (backdoor), then B♭7 → Am (tritone sub)', 'Bb:9 C:maj7 Bb:7#11 A:m7'],
  ]],
  ['tritone', 'IV7 → iii', [
    ['F7 → Em7', 'C:maj7 F:7#11 E:m7'],
    ['F7 – Em7 – A7 – Dm7 – G7: stepping down into a turnaround', 'F:7#11 E:m7 A:7 D:m7 G:7 C:maj7'],
  ]],
  ['tritone', '♭V7 → IV', [
    ['G♭7 → Fmaj7', 'C:maj7 Gb:7#11 F:maj7'],
    ['Compare: C7 → F, then G♭7 → F', 'C:maj7 C:7 F:maj7 C:maj7 Gb:7#11 F:maj7'],
  ]],
  ['dim', 'Four dominants in one', [
    ['One °7, two places to go: C♯°7 → Dm, then C♯°7 → F', 'C#:dim7 D:m7 C#:dim7 F:maj7'],
  ]],
  ['dim', 'Rising diminished', [
    ['C – C♯°7 – Dm7 – D♯°7 – Em7', 'C:maj7 C#:dim7 D:m7 D#:dim7 E:m7'],
    ['♯IV°7: F – F♯°7 – C/G – G7 – C', 'F:maj7 F#:dim7 C:maj/5 G:7 C:maj7'],
    ['♯V°7 → vi: G7 – G♯°7 – Am', 'G:7 G#:dim7 A:m7'],
  ]],
  ['dim', 'Descending diminished', [
    ['Em7 – E♭°7 – Dm7 – G7', 'E:m7 Eb:dim7 D:m7 G:7 C:maj7'],
    ['Up and back: Dm7 – D♯°7 – Em7 – E♭°7 – Dm7', 'D:m7 D#:dim7 E:m7 Eb:dim7 D:m7'],
  ]],
  ['dim', 'Common-tone diminished', [
    ['C – C°7 – C', 'C:6 C:dim7 C:6'],
    ['On the V: G7 – G°7 – G7 – C', 'G:7 G:dim7 G:7 C:maj7'],
  ]],
  ['dim', 'vii°7 → I', [
    ['B°7 → C', 'B:dim7 C:maj7'],
    ['Next to the chord it stands for: G7♭9 → C, then B°7 → C', 'G:7b9 C:maj7 B:dim7 C:maj7'],
    ['In minor: B°7 → Cm', 'B:dim7 C:m6'],
  ]],
  ['mediants', 'I → III', [
    ['C – E – C', 'C:maj E:maj C:maj'],
    ['C – E – F – C: E as pure colour, not as V of vi', 'C:maj E:maj F:maj C:maj'],
  ]],
  ['mediants', 'I → ♭VI', [
    ['C – A♭ – C', 'C:maj Ab:maj C:maj'],
    ['C – A♭ – E – C: three major 3rds split the octave', 'C:maj Ab:maj E:maj C:maj'],
  ]],
  ['mediants', 'I → VI', [
    ['C – A – C', 'C:maj A:maj C:maj'],
    ['C – A – F – C: the A’s C♯ slides back to C', 'C:maj A:maj F:maj C:maj'],
  ]],
  ['mediants', 'I → ♭III', [
    ['C – E♭ – C', 'C:maj Eb:maj C:maj'],
    ['The minor-3rd cycle: C – E♭ – G♭ – A – C', 'C:maj Eb:maj Gb:maj A:maj C:maj'],
  ]],
  ['other', 'V7♯5 / V+', [
    ['G7♯5 → C', 'D:m7 G:7#5 C:maj7'],
    ['In minor: the ♯5 (D♯, really E♭) is the 3rd of Cm', 'D:m7b5 G:7#5 C:m6'],
  ]],
  ['other', 'Line clichés', [
    ['Minor: Cm – Cm(maj7) – Cm7 – Cm6', 'C:min C:mMaj7 C:m7 C:m6'],
    ['Major: C – C+ – C6 – C7 → F', 'C:maj C:aug C:6 C:7 F:maj7'],
    ['In the bass: Am – Am/G♯ – Am/G – Am/F♯', 'A:min A:min/7 A:min/b7 A:min/6'],
  ]],
  ['other', 'V7sus4', [
    ['G7sus4 – G7 – C', 'G:7sus4 G:7 C:maj7'],
    ['Instead of ii–V: Dm7 – G9sus4 – C', 'D:m7 G:9sus4 C:maj7'],
  ]],
  ['other', 'IV7 in minor', [
    ['Am7 – D7 vamp', 'A:m7 D:9 A:m7 D:9'],
    ['A Dorian groove: i – IV7 – i – ♭VII', 'A:m7 D:9 A:m7 G:maj'],
  ]],
  ['other', 'V7♭9 in minor', [
    ['iiø – V7♭9 – i', 'A:m7 B:m7b5 E:7b9 A:m7'],
    ['i – iv – V7♭9 – i', 'A:m7 D:m7 E:7b9 A:m7'],
  ]],
  ['other', 'The Neapolitan', [
    ['D♭/F – G7 – Cm', 'Db:maj/3 G:7 C:min'],
    ['In major, the jazz version: D♭maj7 slides to C', 'D:m7 Db:maj7 C:maj7'],
  ]],
  ['other', '7♯9', [
    ['E7♯9 – A7 – E7♯9', 'E:7#9 A:7 E:7#9'],
    ['As a V going to minor: E7♯9 → Am', 'B:m7b5 E:7#9 A:m7'],
  ]],
];
for (const [deck, title, ex] of MORE) {
  const c = DECKS.find((d) => d.id === deck)?.cards.find((x) => x.t === title);
  if (!c) { console.warn('no card', deck, title); continue; }
  c.ex = ex; delete c.play;
}

// ---------- the keys: every note of every key, numbered, most useful first ----------
// Built from the theory engine so the spelling is always right; the tips are hand-written.
const SHARPS = ['F#', 'C#', 'G#', 'D#', 'A#', 'E#', 'B#'], FLATS = ['Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb', 'Fb'];
const P = (x) => T.pretty(x);
function signature(names) {
  const sh = SHARPS.filter((n) => names.includes(n)), fl = FLATS.filter((n) => names.includes(n));
  if (!sh.length && !fl.length) return 'No sharps or flats';
  const l = sh.length ? sh : fl;
  return `${l.length} ${sh.length ? 'sharp' : 'flat'}${l.length > 1 ? 's' : ''}: ${l.map(P).join(' ')}`;
}
function keyCard(root, minor, tips) {
  const notes = T.scaleNotes(root, minor ? 'aeolian' : 'major').map((n) => T.noteName(n));
  return { t: `${P(root)} ${minor ? 'minor' : 'major'}`, s: signature(notes), key: { root, minor, notes }, b: tips };
}
const MAJORS = [
  ['C', ['All natural notes: the white keys.', '- Relative minor: A minor']],
  ['G', ['One sharp, F♯: the 7th. Each new sharp key gets its new sharp on its 7th, a half step below the root.', '- Relative minor: E minor']],
  ['F', ['One flat, B♭: the 4th. Each new flat key gets its new flat on its 4th.', '- Relative minor: D minor']],
  ['D', ['F♯ and C♯: the 3rd and the 7th.', '- Relative minor: B minor']],
  ['Bb', ['B♭ and E♭: the root and the 4th. In a flat key the second-to-last flat names the key.', '- Relative minor: G minor']],
  ['A', ['F♯, C♯ and G♯: the 6th, the 3rd and the 7th. The 3rd of A is C♯, 4 frets above A.', '- Relative minor: F♯ minor']],
  ['Eb', ['B♭, E♭ and A♭: the 5th, the root and the 4th. The jazz horn key.', '- Relative minor: C minor']],
  ['E', ['Four sharps: only E, A and B are natural. The guitar’s home key: its open strings are all in it.', '- Relative minor: C♯ minor']],
  ['Ab', ['Four flats: only C, F and G are natural.', '- Relative minor: F minor']],
  ['Db', ['Five flats: only F and C are natural. Same sounds as C♯ major (seven sharps), which almost nobody writes.', '- Relative minor: B♭ minor']],
  ['B', ['Five sharps: only E and B are natural. Same sounds as C♭ major.', '- Relative minor: G♯ minor']],
  ['F#', ['Six sharps, including E♯ (the 7th, the same note as F). Same sounds as G♭ major, which has six flats including C♭.', '- Relative minor: D♯ minor']],
];
const MINORS = ['A', 'E', 'D', 'B', 'G', 'F#', 'C', 'C#', 'F', 'G#', 'Bb', 'Eb'];
function minorTips(root) {
  const r = T.parseNote(root);
  const rel = T.noteName(T.transpose(r, 'b3'));
  const same = (n) => { const x = T.parseNote(n); return Math.abs(x.acc) > 1 || ['E#', 'B#', 'Cb', 'Fb'].includes(n) ? ` (the same note as ${P(T.noteName(T.enharmonic(x)))})` : ''; };
  const lt = T.noteName(T.transpose(r, '7')), b6 = T.noteName(T.transpose(r, 'b6')), six = T.noteName(T.transpose(r, '6'));
  return [
    `Same notes as ${P(rel)} major (a minor 3rd up), starting on ${P(root)}.`,
    `- Harmonic minor raises the 7th to ${P(lt)}${same(lt)}: that’s the leading tone in the V7 chord`,
    `- Melodic minor raises the 6th too: ${P(six)} instead of ${P(b6)}`,
  ];
}
const majorThirds = [...MAJORS.map(([r]) => r)].map((r) => `${P(r)} → ${P(T.noteName(T.transpose(T.parseNote(r), '3')))}`);

DECKS.push(
  {
    id: 'chordmelody', name: 'Chord melody', cards: [
      { t: 'What it is', s: 'one guitar playing the whole tune', b: [
        'The melody on top, the harmony underneath, the bass at the bottom.',
        'The melody is the boss. Every chord, bass note and fill is there to serve it, and anything that hides it goes.',
      ] },
      { t: 'Learn the melody first', s: 'before any chords', b: [
        'Sing it. Learn the words, since they tell you the phrasing and where to breathe.',
        '- Play it single-note in two or three positions',
        '- Then learn the changes and the bass line on their own',
        'Only then put them together.',
      ] },
      { t: 'Put the melody up high', s: 'room underneath', b: [
        'The melody wants the top two strings, roughly from open E up to the 12th fret, so the chords fit under it.',
        '- Usually that means playing the lead sheet’s melody an octave up',
        '- Pick a key where the melody fits and the bass notes fall on the low strings. Change the key if you need to',
        '- C, F, G, D and B♭ tend to sit well; open E, A and D basses help a lot',
      ] },
      { t: 'The melody is always the top note', s: 'the one rule', b: [
        'Build each chord down from the melody note. If a voicing puts any note above the melody, it’s the wrong voicing: find another or drop that note.',
      ] },
      { t: 'Every chord, every top note', s: 'the vocabulary you need', b: [
        'For each chord type, know a voicing with the 1, 3, 5 and 7 (and 9 and 13) on the top string. Then any melody note has a home.',
        '- Drop 2 on strings 4-3-2-1: melody on the high E',
        '- Drop 3 with the root on the 6th string: melody on the B string',
      ], ex: [
        ['One chord, four melody notes: each voicing built down from the top', '=C3 G3 B3 E4 | C3 B3 E4 G4 | C3 E4 G4 B4 | C3 E4 B4 D5', 'Cmaj7: E, G, B, D on top'],
      ] },
      { t: 'A melody note outside the chord', s: 'it’s a tension, or it’s passing', b: [
        'Hear it as a colour and pick the voicing with it on top: D over C is Cmaj9, A over G7 is G9, E♭ over G7 is G7♭13.',
        '- If it clashes (the 4th over a major chord, say), treat it as a passing note and play it alone, or reharmonise it',
      ], ex: [
        ['Melody E, then E♭ over G7, landing on D over C', '=G2 F3 B3 E4 | G2 F3 B3 Eb4 | C3 E3 B3 D4', 'G13 – G7♭13 – Cmaj9'],
      ] },
      { t: 'One note, many chords', s: 'where reharmonising starts', b: [
        'A melody note fits many chords. G can be the 5th of C, the ♭3 of Em, the 3rd of E♭, the 7th of A♭maj7. The melody stays put and the harmony changes colour underneath.',
      ], ex: [
        ['G stays on top while the chord under it changes', '=C3 B3 E4 G4 | E2 B3 D4 G4 | Eb3 Bb3 D4 G4 | Ab2 Eb3 C4 G4', 'Cmaj7 – Em7 – E♭maj7 – A♭maj7'],
      ] },
      { t: 'Three voices are enough', s: 'bass, guide tone, melody', b: [
        'The cleanest texture is the root in the bass, one guide tone (the 3rd or 7th) in the middle, and the melody on top. It’s easy to finger and it leaves the melody clear.',
        'Add notes only where the arrangement needs more weight.',
      ], ex: [
        ['Bass, one guide tone, and the melody E – F – D – E', '=C3 B3 E4 | D3 C4 F4 | G2 B3 D4 | C3 B3 E4', 'Cmaj7 – Dm7 – G7 – Cmaj7'],
      ] },
      { t: 'Not every note gets a chord', s: 'harmonise the strong ones', b: [
        'Put chords under the long notes and the notes on strong beats. Let the quick notes in between ring on their own.',
        '- Change chord where the harmony changes, usually on beat 1',
        '- Too many chords sound busy and slow the tune down',
      ] },
      { t: 'Bass on the downbeat', s: 'the bass carries the harmony', b: [
        'When the chord changes, put its root (or the bass note the chart asks for) on beat 1. Then the inner voices can be sparse and the ear still hears the changes.',
        '- Open E, A and D strings let you play the bass while your hand is high up the neck',
      ] },
      { t: 'Let the melody sing', s: 'sound and touch', b: [
        '- The melody should be louder than the chord under it',
        '- Fingerstyle: thumb on the bass, fingers on the chord, the ring or middle finger on the melody. Or hybrid picking',
        '- Hold each melody note for its full length: don’t cut it short to reach the next chord',
        '- Roll the chord a little so the top note comes last',
      ] },
      { t: 'Fill the long notes', s: 'when the melody holds', b: [
        'Under a held melody note, keep something moving:',
        '- An inner voice (a line cliché)',
        '- A walking bass',
        '- A passing chord: a secondary dominant, a tritone sub or a °7',
        '- A short lick in the gap, then back to the melody',
      ], ex: [
        ['E held on top while an inner voice falls B → B♭ → A', '=C3 B3 E4 | C3 Bb3 E4 | C3 A3 E4 | F2 A3 E4', 'Cmaj7 – C7 – C6 – Fmaj7'],
      ] },
      { t: 'Approach chords', s: 'harmonising the passing notes', b: [
        'A melody note just before a chord change can take its own chord leading into the next one:',
        '- The same shape a fret above, sliding down',
        '- The V7 of the next chord',
        '- A °7 a half step below the next chord’s root',
      ], ex: [
        ['The same shape a fret above, sliding down', '=Db3 C4 F4 | C3 B3 E4', 'D♭maj7 → Cmaj7'],
        ['The target’s own V7, with the melody E → F', '=A2 G3 C#4 E4 | D3 A3 C4 F4', 'A7 → Dm7'],
        ['A °7 a half step below, with the melody E → F', '=C#3 G3 Bb3 E4 | D3 A3 C4 F4', 'C♯°7 → Dm7'],
      ] },
      { t: 'Plan the fingering', s: 'a position per phrase', b: [
        '- Work each phrase out in one position before you move',
        '- Shift during a single note, a rest, or an open string',
        '- Look for a finger that stays on its string from chord to chord, and slide on it',
        '- If a grip is too hard, leave a note out. The melody matters more than the full chord',
      ] },
      { t: 'Arrange in passes', s: 'a working order', b: [
        '- 1. The melody alone, up an octave',
        '- 2. The bass notes on the chord changes',
        '- 3. A guide tone under each chord',
        '- 4. Fills, approach chords, reharmonisation',
        '- 5. An intro and an ending',
        'Then play it slowly and take out anything that gets in the melody’s way.',
      ] },
      { t: 'Intros and endings', s: 'framing the tune', b: [
        '- <b>Intro</b>: the last four bars of the tune, or a I – vi – ii – V vamp',
        '- <b>Ending</b>: tag the last ii–V two or three times, or land via ♭IImaj7 or ♭VImaj7',
        '- A final chord with a 6 or 9 on top rings beautifully',
      ], ex: [
        ['Ending on ♭VI → I, with G held on top', '=Ab2 Eb3 C4 G4 | C3 B3 E4 G4', 'A♭maj7 → Cmaj7'],
        ['Ending on ♭II → I: the same shape a fret down', '=Db3 C4 F4 Ab4 | C3 B3 E4 G4', 'D♭maj7 → Cmaj7'],
      ] },
      { t: 'The second time through', s: 'vary it', b: [
        'The first chorus states the melody plainly. After that:',
        '- Reharmonise',
        '- Change register',
        '- Add a walking bass under the melody (Martin Taylor does this)',
        '- Or go to single-note soloing and come back for the last chorus',
      ] },
      { t: 'Listen and steal', s: 'who to learn from', b: [
        '- Joe Pass, <i>Virtuoso</i>',
        '- Ted Greene, <i>Solo Guitar</i>',
        '- Lenny Breau, George Van Eps, Martin Taylor',
        'Good first tunes: “Autumn Leaves”, “Fly Me to the Moon”, “Misty”.',
      ] },
    ],
  },
  {
    id: 'majkeys', name: 'Major keys', cards: [
      { t: 'Every letter once', s: 'the rule that spells every key', b: [
        'A major or minor scale uses each letter A to G exactly once, in order. So the 3rd of A is some kind of C (it’s C♯), never a D♭.',
        'To find any degree, count letters first (A, B, C: the 3rd is a C), then add the sharp or flat the key needs.',
      ] },
      { t: 'Sharps and flats, in order', s: 'they always come in the same order', b: [
        '- <b>Sharps</b>: F C G D A E B (“Father Charles Goes Down And Ends Battle”)',
        '- <b>Flats</b>: B E A D G C F, the same list backwards',
        'Three sharps is always F♯, C♯ and G♯; three flats is always B♭, E♭ and A♭.',
      ] },
      { t: 'Name the key', s: 'from its sharps or flats', b: [
        '- <b>Sharps</b>: the last sharp is the 7th, so go up a half step. F♯ C♯ G♯ → A major',
        '- <b>Flats</b>: the second-to-last flat is the key. B♭ E♭ A♭ → E♭ major',
        '- One flat is F major',
      ] },
      { t: 'The 3rd on the neck', s: 'where it is from any root', b: [
        'A major 3rd is 4 frets up the same string.',
        '- On the next string up: one fret back (on the G to B strings, the same fret)',
        '- A minor 3rd: two frets back (on G to B, one fret back)',
      ] },
      { t: 'Major 3rds, all 12', s: 'the 3rd of each key', b: majorThirds.map((x) => '- ' + x) },
      ...MAJORS.map(([r, tips]) => keyCard(r, false, tips)),
    ],
  },
  {
    id: 'minkeys', name: 'Minor keys', cards: [
      { t: 'Minor keys', s: 'the relative major’s notes', b: [
        'A minor key has the same sharps and flats as the major key a minor 3rd above it, its relative major: A minor and C major, E minor and G major.',
        '- Its 3rd, 6th and 7th are flat compared with the major on the same root',
        '- In practice the 7th is often raised (harmonic minor), which gives V7 its leading tone',
      ] },
      ...MINORS.map((r) => keyCard(r, true, minorTips(r))),
    ],
  },
);
