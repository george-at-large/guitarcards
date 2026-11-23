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
    id: 'progs', name: 'Common progressions', cards: [
      { t: 'I – V – vi – IV', s: 'the pop progression', b: [
        'Four chords behind thousands of songs. Start it on a different chord and the mood changes, though the chords are the same.',
      ], eg: 'In C: C – G – Am – F', ex: [
        ['From I: bright and anthemic', 'C:maj G:maj A:min F:maj'],
        ['From vi: the same four, sadder (vi – IV – I – V)', 'A:min F:maj C:maj G:maj'],
        ['From IV: lifting (IV – I – V – vi)', 'F:maj C:maj G:maj A:min'],
      ] },
      { t: 'I – vi – IV – V', s: 'the ’50s progression', b: [
        'Doo-wop’s engine (“Stand by Me”). Swap the IV for ii and it becomes the jazz turnaround.',
      ], eg: 'In C: C – Am – F – G', ex: [
        ['I – vi – IV – V', 'C:maj A:min F:maj G:maj'],
        ['I – vi – ii – V: the same idea, jazzier', 'C:maj7 A:m7 D:m7 G:7'],
      ] },
      { t: 'I – IV – V', s: 'the three-chord trick', b: [
        'Tonic, predominant, dominant: all a folk, rock or blues tune needs. Each chord holds two of the scale’s seven notes in common with one of the others.',
      ], eg: 'In C: C – F – G', ex: [
        ['I – IV – V – I', 'C:maj F:maj G:maj C:maj'],
        ['I – IV – I – V – I: the folk way round', 'C:maj F:maj C:maj G:maj C:maj'],
      ] },
      { t: 'The diatonic cycle', s: 'every chord, roots falling in 5ths', b: [
        'vi – ii – V – I – IV – viiø – III7 – vi walks through the whole key in 5ths, with III7 borrowed to lead back to vi.',
        '- “Fly Me to the Moon” is built on it',
      ], eg: 'In C: Am7 – Dm7 – G7 – Cmaj7 – Fmaj7 – Bø7 – E7 – Am7', ex: [
        ['The whole cycle', 'A:m7 D:m7 G:7 C:maj7 F:maj7 B:m7b5 E:7 A:m7'],
      ] },
      { t: 'Major ii–V–I, then minor', s: 'the “Autumn Leaves” pair', b: [
        'A ii–V–I in the relative major, then a ii–V–i in the minor key. The two keys share their notes, so it flows.',
      ], eg: 'In E minor: Am7 – D7 – Gmaj7 – Cmaj7 – F♯ø7 – B7 – Em', ex: [
        ['The whole A section', 'A:m7 D:7 G:maj7 C:maj7 F#:m7b5 B:7b9 E:m7'],
      ] },
      { t: 'The Andalusian cadence', s: 'i – ♭VII – ♭VI – V', b: [
        'The bass walks down the minor scale to a major V (from harmonic minor). Flamenco, and “Hit the Road Jack”.',
      ], eg: 'In A minor: Am – G – F – E', ex: [
        ['i – ♭VII – ♭VI – V', 'A:min G:maj F:maj E:7'],
      ] },
      { t: 'The Canon', s: 'I – V – vi – iii – IV – I – IV – V', b: [
        'Pachelbel’s Canon. The bass steps down a 4th then up a 2nd, over and over; countless pop songs borrow a stretch of it.',
      ], eg: 'In C: C – G – Am – Em – F – C – F – G', ex: [
        ['The whole progression', 'C:maj G:maj A:min E:min F:maj C:maj F:maj G:maj'],
      ] },
      { t: 'i – ♭VI – ♭III – ♭VII', s: 'the minor-key anthem', b: [
        'The minor pop loop: big and dramatic. Its chords are the same as vi – IV – I – V in the relative major.',
      ], eg: 'In A minor: Am – F – C – G', ex: [
        ['i – ♭VI – ♭III – ♭VII', 'A:min F:maj C:maj G:maj'],
      ] },
      { t: 'IV – V – iii – vi', s: 'the “royal road”', b: [
        'The backbone of Japanese pop (ōdō shinkō). It rises to V, then falls by 5ths to vi, so it never quite lands on I.',
      ], eg: 'In C: Fmaj7 – G7 – Em7 – Am', ex: [
        ['IV – V – iii – vi', 'F:maj7 G:7 E:m7 A:m7'],
        ['With a secondary dominant: IV – V – III7 – vi', 'F:maj7 G:7 E:7 A:m7'],
      ] },
    ],
  },
  {
    id: 'blues', name: 'The blues', cards: [
      { t: 'The 12-bar blues', s: 'the form', b: [
        '- Bars 1–4: I7',
        '- Bars 5–8: IV7, IV7, I7, I7',
        '- Bars 9–12: V7, IV7, I7, V7 (the turnaround)',
        'Every chord is a dominant 7: the blues ignores the major key’s rules.',
      ], eg: 'In C: C7 – F7 – C7 – G7 – F7 – C7 – G7', ex: [
        ['All 12 bars', 'C:7 C:7 C:7 C:7 F:7 F:7 C:7 C:7 G:7 F:7 C:7 G:7'],
      ] },
      { t: 'The quick change', s: 'IV7 in bar 2', b: [
        'Go to IV7 in bar 2 and back to I7 in bar 3. Most blues players do it most of the time.',
      ], ex: [
        ['Bars 1–4 with the quick change', 'C:7 F:7 C:7 C:7'],
      ] },
      { t: 'Blue notes', s: 'minor against major', b: [
        'The melody uses the ♭3, ♭5 and ♭7 against major and dominant chords. The ♭3 rubbing on the chord’s major 3rd is the blues sound.',
        '- Bend the ♭3 a little toward the 3rd',
        '- The 7♯9 chord puts both 3rds in the harmony',
      ], ex: [
        ['The ♭3 against C7: E♭ then E', '=C3 E3 Bb3 | Eb4 | E4 | G4 | Bb4 | C5'],
        ['C7♯9: both 3rds in one chord', 'C:7#9 F:9 C:7#9'],
      ] },
      { t: 'What to play over it', s: 'scales', b: [
        '- <b>Minor pentatonic or blues scale</b> of the key over all 12 bars',
        '- <b>Major pentatonic</b> over I7 for a sweeter sound',
        '- <b>Mix them</b>: the ♭3 and 3 together is the blues',
        '- Jazz players outline each chord: Mixolydian on each dominant, and the 3rds of each chord',
      ], ex: [
        ['C blues scale over C7', '=C3 E3 Bb3 | C4 | Eb4 | F4 | Gb4 | G4 | Bb4 | C5'],
      ] },
      { t: 'The jazz blues', s: 'more changes, same form', b: [
        '- Bar 4: a ii–V into IV (Gm7 – C7)',
        '- Bar 6: ♯iv°7 (F♯°7)',
        '- Bar 8: VI7, the V of ii',
        '- Bars 9–10: ii – V instead of V – IV',
        '- Bars 11–12: a I – VI7 – ii – V turnaround',
      ], eg: 'In C: C7 F7 C7 Gm7 C7 | F7 F♯°7 C7 A7 | Dm7 G7 C7 A7 Dm7 G7', ex: [
        ['All 12 bars', 'C:7 F:7 C:7 G:m7 C:7 F:7 F#:dim7 C:7 A:7 D:m7 G:7 C:7 A:7 D:m7 G:7'],
      ] },
      { t: 'The minor blues', s: 'i, iv and a ♭VI7', b: [
        '- Bars 1–4: im7',
        '- Bars 5–8: ivm7, ivm7, im7, im7',
        '- Bars 9–12: ♭VI7, V7, im7, V7',
        'The ♭VI7 → V7 in bars 9–10 is the sound of it.',
      ], eg: 'In C minor: Cm7 – Fm7 – Cm7 – A♭7 – G7 – Cm7', ex: [
        ['All 12 bars', 'C:m7 C:m7 C:m7 C:m7 F:m7 F:m7 C:m7 C:m7 Ab:7 G:7alt C:m7 G:7alt'],
      ] },
      { t: 'The Bird blues', s: '“Blues for Alice”', b: [
        'Charlie Parker’s blues: ii–Vs falling through the form, landing on IV7 in bar 5.',
      ], eg: 'In C: Cmaj7 | Bø7 E7 | Am7 D7 | Gm7 C7 | F7 | Fm7 B♭7 | Em7 A7 | E♭m7 A♭7 | Dm7 | G7 | C A7 | Dm7 G7', ex: [
        ['Bars 1–9', 'C:maj7 B:m7b5 E:7 A:m7 D:7 G:m7 C:7 F:7 F:m7 Bb:7 E:m7 A:7 Eb:m7 Ab:7 D:m7'],
      ] },
      { t: 'Blues turnarounds', s: 'the last two bars', b: [
        'Bars 11–12 send you back to the top.',
      ], ex: [
        ['I – V7: the plain one', 'C:7 G:7 C:7'],
        ['I – VI7 – ii – V', 'C:7 A:7 D:m7 G:7 C:7'],
        ['I – ♭III7 – ♭VI7 – ♭II7: all tritone subs', 'C:7 Eb:7 Ab:7 Db:7 C:7'],
      ] },
      { t: 'The 8-bar blues', s: 'a shorter form', b: [
        'I – V – IV – IV – I – V – I – V. “Key to the Highway” is the classic.',
      ], ex: [
        ['All 8 bars', 'C:7 G:7 F:7 F:7 C:7 G:7 C:7 G:7'],
      ] },
    ],
  },
  {
    id: 'forms', name: 'Song forms', cards: [
      { t: 'AABA', s: 'the 32-bar standard', b: [
        'Four 8-bar sections: a tune (A), the tune again (A), a contrasting bridge (B), and the tune once more (A).',
        '- “I Got Rhythm”, “Take the A Train”, “Satin Doll”',
      ] },
      { t: 'ABAC', s: 'the other 32-bar form', b: [
        'Two halves that start the same and end differently: the second half (A again, then C) heads for the final cadence.',
        '- “All of Me”',
      ] },
      { t: 'Rhythm changes: the A section', s: '“I Got Rhythm”', b: [
        'The most played chords in jazz after the blues:',
        '- I vi | ii V | I vi | ii V',
        '- I I7 | IV iv | I V | I',
      ], ex: [
        ['The A section, in C', 'C:maj7 A:7 D:m7 G:7 C:maj7 A:7 D:m7 G:7 C:maj7 C:7 F:maj7 F:m7 C:maj7 G:7 C:maj7'],
      ] },
      { t: 'Rhythm changes: the bridge', s: 'extended dominants', b: [
        'III7 – VI7 – II7 – V7, two bars each: dominants falling in 5ths back to the A section.',
      ], ex: [
        ['The bridge, in C', 'E:7 A:7 D:7 G:7 C:maj7'],
      ] },
      { t: 'The bridge', s: 'contrast', b: [
        'A bridge goes somewhere new: often to IV, or to a key a 3rd away, and comes back through a dominant.',
        '- Knowing where the bridge goes is half of learning a tune',
      ] },
      { t: 'Verse and chorus', s: 'the pop form', b: [
        'Intro, verse, pre-chorus, chorus, verse, pre-chorus, chorus, bridge, chorus.',
        '- The chorus has the title and the hook; the verse tells the story',
        '- The pre-chorus builds tension, often ending on V or IV',
      ] },
      { t: 'How a jazz tune runs', s: 'head, solos, head', b: [
        'One time through the form is a <b>chorus</b>.',
        '- The head (the melody), then solos over the same form, then the head again',
        '- Often trading fours before the last head',
        '- A tag or vamp at the end',
      ] },
      { t: 'Learn the form, not just the chords', s: 'how pros memorise tunes', b: [
        '- Know the form (AABA, 12-bar…) and where each section starts',
        '- Learn the chords as functions in the key (ii–V to IV, backdoor home), not as a list of names',
        '- Sing the melody while you play the changes',
      ] },
    ],
  },
  {
    id: 'modes', name: 'Modes in action', cards: [
      { t: 'How a mode becomes the key', s: 'vamp on its sound', b: [
        'A modal tune keeps the mode’s characteristic note in the chords and avoids V–I, which would pull you back to major or minor.',
        '- Dorian: the ♮6 (a major IV)',
        '- Mixolydian: the ♭7 (a ♭VII)',
        '- Lydian: the ♯4 (a major II)',
        '- Phrygian: the ♭2 (a ♭II)',
        '- Aeolian: the ♭6 (a ♭VI)',
      ] },
      { t: 'Dorian', s: 'i – IV', b: [
        'Minor with a bright 6th: the IV chord is major.',
        '- “So What”, “Oye Como Va”, “Moondance”',
      ], eg: 'D Dorian: Dm7 – G7', ex: [
        ['i – IV vamp', 'D:m7 G:9 D:m7 G:9'],
        ['i – ii: the “Moondance” move', 'A:m7 B:m7 A:m7 B:m7'],
        ['D Dorian over Dm7', '=D3 A3 C4 F4 | D4 | E4 | F4 | G4 | A4 | B4 | C5 | D5'],
      ] },
      { t: 'Mixolydian', s: 'I – ♭VII – IV', b: [
        'Major with a ♭7: a I chord that’s a dominant but never resolves.',
        '- “Sweet Home Alabama”, “Norwegian Wood”',
      ], eg: 'G Mixolydian: G – F – C', ex: [
        ['I – ♭VII – IV', 'G:maj F:maj C:maj G:maj'],
        ['A I7 vamp', 'G:9 G:13 G:9 G:13'],
      ] },
      { t: 'Lydian', s: 'I – II', b: [
        'Major with a ♯4: floating and bright. The major II chord carries the ♯4.',
        '- Joe Satriani’s “Flying in a Blue Dream”, a lot of film music',
      ], eg: 'C Lydian: C – D/C', ex: [
        ['I – II over a pedal', 'C:maj7 D:maj/b7 C:maj7 D:maj/b7'],
        ['C Lydian over Cmaj7', '=C3 G3 B3 E4 | C4 | D4 | E4 | F#4 | G4 | A4 | B4 | C5'],
      ] },
      { t: 'Aeolian', s: 'i – ♭VI – ♭VII', b: [
        'Natural minor, with no major V. Rock’s minor.',
        '- “All Along the Watchtower” (i – ♭VII – ♭VI – ♭VII)',
      ], eg: 'A Aeolian: Am – F – G', ex: [
        ['i – ♭VI – ♭VII – i', 'A:min F:maj G:maj A:min'],
        ['i – ♭VII – ♭VI – ♭VII', 'A:min G:maj F:maj G:maj'],
      ] },
      { t: 'Phrygian', s: 'i – ♭II', b: [
        'Minor with a ♭2: dark and Spanish. Flamenco and metal.',
      ], eg: 'E Phrygian: Em – F', ex: [
        ['i – ♭II vamp', 'E:min F:maj E:min F:maj'],
        ['Phrygian dominant: E – F – G – F – E, the flamenco cadence', 'E:maj F:maj G:maj F:maj E:maj'],
      ] },
      { t: 'Ionian and Locrian', s: 'the two you don’t vamp', b: [
        '- <b>Ionian</b> is plain major: it’s the reference, and its 4th clashes over the I chord',
        '- <b>Locrian</b> can’t really be a key: its tonic chord has a ♭5 and won’t settle. You use it over ø7 chords',
      ] },
      { t: 'Lydian dominant', s: 'I7♯11', b: [
        'Mixolydian with a ♯4, or Lydian with a ♭7: a bright, fusion dominant to vamp on.',
      ], ex: [
        ['A I7♯11 vamp', 'C:7#11 C:9 C:7#11 C:9'],
      ] },
      { t: 'Comping modally', s: 'how to accompany a modal tune', b: [
        '- Keep the characteristic note audible in the voicings',
        '- Use 4ths (So What voicings) and a pedal in the bass',
        '- Move voicings up and down the mode over one bass note',
      ], ex: [
        ['Quartal voicings moving up D Dorian over a D pedal', '=D2 E3 A3 D4 G4 | D2 F3 B3 E4 A4 | D2 G3 C4 F4 B4 | D2 F3 B3 E4 A4', 'Dm11 in 4ths, up and back'],
      ] },
    ],
  },
  {
    id: 'bass', name: 'Bass lines and slash chords', cards: [
      { t: 'Slash chords', s: 'chord over bass', b: [
        'C/E means a C chord with E in the bass. Two kinds:',
        '- <b>Inversions</b>: the bass is in the chord (C/E, C/G)',
        '- <b>Upper structures</b>: the bass isn’t (D/C, B♭/C), which makes a new, richer chord',
      ] },
      { t: 'The descending bass', s: 'I – V/7 – vi – I/5 – IV – I/3 – ii – V', b: [
        'The bass walks down the scale while the chords barely move. The idea behind “A Whiter Shade of Pale”.',
      ], eg: 'In C: C – G/B – Am – C/G – F – C/E – Dm – G', ex: [
        ['The whole line', 'C:maj G:maj/3 A:min C:maj/5 F:maj C:maj/3 D:m7 G:7'],
      ] },
      { t: 'Walking up to IV', s: 'I – I/3 – IV', b: [
        'Put the 3rd in the bass and the bass climbs into IV.',
        '- Keep going: IV – ♯iv°7 – I/5 – V – I',
      ], ex: [
        ['I – I/3 – IV', 'C:maj C:maj/3 F:maj'],
        ['All the way: C – C/E – F – F♯°7 – C/G – G7 – C', 'C:maj C:maj/3 F:maj F#:dim7 C:maj/5 G:7 C:maj'],
      ] },
      { t: 'The minor bass line', s: 'i – i/♭7 – i/6 – ♭VI', b: [
        'A minor chord over a bass falling by half steps. The top stays; the bass does the work.',
      ], eg: 'In A minor: Am – Am/G – Am/F♯ – Fmaj7', ex: [
        ['Am – Am/G – Am/F♯ – Fmaj7', 'A:min A:min/b7 A:min/6 F:maj7'],
      ] },
      { t: 'Pedal points', s: 'one bass note, moving chords', b: [
        '- <b>Tonic pedal</b>: C – F/C – G/C – C. Gospel, rock, ballads',
        '- <b>Dominant pedal</b>: hold G under C/G, F/G and G7 before going home',
      ], ex: [
        ['Tonic pedal', 'C:maj F:maj/5 G:maj/4 C:maj'],
        ['Dominant pedal', 'C:maj/5 F:maj/2 G:7 C:maj'],
      ] },
      { t: 'Upper-structure slash chords', s: 'a triad over a foreign bass', b: [
        '- <b>D/C</b>: 9, ♯11, 13 over C. Lydian',
        '- <b>B♭/C</b>: ♭7, 9, 11 over C. C9sus4',
        '- <b>E/C</b>: 3, ♯5, 7 over C. Cmaj7♯5',
        '- <b>F/G</b>: G9sus4, the soft dominant',
      ], ex: [
        ['D/C, B♭/C, E/C', 'D:maj/b7 Bb:maj/2 E:maj/b6'],
      ] },
      { t: 'Walking bass', s: 'four beats a bar', b: [
        '- Beat 1: the root',
        '- Beats 2 and 3: chord tones or scale steps',
        '- Beat 4: a note a half step (or a step) from the next root',
      ], ex: [
        ['Cmaj7 – Dm7 – G7 – C with chromatic approaches', '=C3 | E3 | G3 | C#3 | D3 | F3 | A3 | Ab3 | G3 | F3 | D3 | Db3 | C3'],
      ] },
      { t: 'Chromatic approach', s: 'into any root', b: [
        'Approach each new root from a half step below or above, on the beat before. It makes any bass line, or any chord change, sound inevitable.',
      ] },
    ],
  },
  {
    id: 'reharm', name: 'Reharmonisation toolkit', cards: [
      { t: 'Start from the melody', s: 'the rule', b: [
        'Any new chord has to fit the melody note: as a chord tone, or as a good tension (9, 11, 13). Then judge it by ear.',
      ] },
      { t: 'Diatonic substitution', s: 'I, iii and vi share two notes', b: [
        '- I can become iii or vi',
        '- IV can become ii',
        '- V can become vii°',
      ], ex: [
        ['C – F – G – C, then Em – Dm – B°7 – Am', 'C:maj7 F:maj7 G:7 C:maj7 E:m7 D:m7 B:dim7 A:m7'],
      ] },
      { t: 'Add a ii', s: 'every V gets its ii', b: [
        'Split a bar of V7 into ii – V.',
      ], ex: [
        ['G7 → Dm7 G7', 'C:maj7 G:7 C:maj7 D:m7 G:7 C:maj7'],
      ] },
      { t: 'Add a V', s: 'secondary dominants', b: [
        'Before any chord, put its V7 (and its ii if there’s room).',
      ], ex: [
        ['C – Dm becomes C – A7 – Dm', 'C:maj7 D:m7 C:maj7 A:7b9 D:m7'],
        ['C – F becomes C – C7 – F', 'C:maj7 F:maj7 C:maj7 C:9 F:maj7'],
      ] },
      { t: 'Tritone sub', s: 'any dominant', b: [
        'Replace a V7 with the dominant a tritone away: the bass slides down by half step.',
      ], ex: [
        ['Dm7 – G7 – C becomes Dm7 – D♭7 – C', 'D:m7 G:7 C:maj7 D:m7 Db:7#11 C:maj7'],
      ] },
      { t: 'Backdoor', s: 'iv7 – ♭VII7 instead of ii – V', ex: [
        ['Dm7 – G7 – C becomes Fm7 – B♭7 – C', 'D:m7 G:7 C:maj7 F:m7 Bb:7 C:maj7'],
      ] },
      { t: 'Passing diminished', s: 'between chords a step apart', b: [
        'Fill the gap with a °7 a half step below the next chord.',
      ], ex: [
        ['C – Dm becomes C – C♯°7 – Dm', 'C:maj7 C#:dim7 D:m7'],
        ['F – C/G becomes F – F♯°7 – C/G', 'F:maj7 F#:dim7 C:maj/5'],
      ] },
      { t: 'Side-slipping', s: 'the same chord a half step away', b: [
        'Approach any chord from a half step above or below with the same quality. Planing, in jazz terms.',
      ], ex: [
        ['E♭m7 → Dm7, D♭maj7 → Cmaj7', 'Eb:m7 D:m7 G:7 Db:maj7 C:maj7'],
      ] },
      { t: 'Borrow from minor', s: 'modal interchange as a reharm', b: [
        'Darken a diatonic chord with its parallel-minor version: IV → iv, vi → ♭VI, V → ♭VII7.',
      ], ex: [
        ['C – F – C becomes C – Fm6 – C', 'C:maj7 F:maj7 C:maj7 F:m6 C:maj7'],
        ['Am becomes A♭maj7', 'C:maj7 A:m7 C:maj7 Ab:maj7'],
      ] },
      { t: 'Before and after', s: 'putting it together', b: [
        'One plain turnaround, then three reharmonisations of it.',
      ], ex: [
        ['Plain: I – vi – ii – V', 'C:maj7 A:m7 D:m7 G:7 C:maj7'],
        ['Secondary dominants: I – VI7 – II7 – V7', 'C:maj7 A:7 D:7 G:7 C:maj7'],
        ['Tritone subs: I – ♭III7 – ♭VI7 – ♭II7', 'C:maj7 Eb:7 Ab:7 Db:7 C:maj7'],
        ['Mixed: iii – VI7♭9 – ii – ♭II7♯11', 'E:m7 A:7b9 D:m9 Db:7#11 C:maj9'],
      ] },
    ],
  },
  {
    id: 'gospel', name: 'Gospel and soul moves', cards: [
      { t: '3 – 6 – 2 – 5 – 1', s: 'the gospel cycle', b: [
        'iii – vi – ii – V – I with every chord made a dominant or a rich minor: roots falling in 5ths all the way home.',
      ], ex: [
        ['Em7 – A7 – Dm7 – G7 – C', 'E:m7 A:7 D:m7 G:13 C:maj9'],
        ['All dominants: E7 – A7 – D7 – G7 – C', 'E:7#9 A:13 D:9 G:7b9 C:6/9'],
      ] },
      { t: '7 – 3 – 6', s: 'into the relative minor', b: [
        'viiø7 – III7 – vi: a minor ii–V–i into vi. A staple of gospel and soul ballads.',
      ], ex: [
        ['Bø7 – E7 – Am', 'B:m7b5 E:7b9 A:m9'],
      ] },
      { t: 'The 4 with a ♯4°', s: 'IV – ♯iv°7 – I/5', b: [
        'The bass climbs F – F♯ – G under the change from IV back to I.',
      ], ex: [
        ['F – F♯°7 – C/G', 'F:maj7 F#:dim7 C:maj/5'],
      ] },
      { t: 'The 1 to the 4', s: 'I – I7 – IV', b: [
        'Turn I into V7 of IV on the way: often with a ♯9 or ♭9 for grit.',
      ], ex: [
        ['C – C7♯9 – F', 'C:6/9 C:7#9 F:9'],
      ] },
      { t: 'The minor plagal “amen”', s: 'IV – iv – I', b: [
        'Church harmony: the IV turns minor before going home.',
      ], ex: [
        ['F – Fm6 – C', 'F:maj7 F:m6 C:6/9'],
      ] },
      { t: 'The gospel turnaround', s: 'one bass line, many chords', b: [
        'I – I7/3 – IV – ♯iv°7 – I/5 – VI7 – ii – V.',
      ], ex: [
        ['The whole turnaround', 'C:maj C:7/3 F:maj7 F#:dim7 C:maj/5 A:7 D:m7 G:7'],
      ] },
      { t: 'Neo-soul colours', s: 'rich chords, moving slowly', b: [
        '- maj9 and m9 and m11 chords instead of triads',
        '- Diatonic 9ths falling by step: IVmaj9 – iii7 – ii9 – Imaj9',
        '- Long Dorian vamps on a m9 or m11',
      ], ex: [
        ['IVmaj9 – iii7 – ii9 – Imaj9', 'F:maj9 E:m7 D:m9 C:maj9'],
        ['A Dorian vamp: Dm11 – G13', 'D:m11 G:13 D:m11 G:13'],
      ] },
    ],
  },
  {
    id: 'solo', name: 'Soloing over changes', cards: [
      { t: 'Chord tones on the beat', s: 'the first rule', b: [
        'Put chord tones (1, 3, 5, 7) on the strong beats, especially beat 1 of a new chord. Everything else can pass between them.',
      ], ex: [
        ['Arpeggios through Dm7 – G7 – Cmaj7', '=D3 C4 | D4 | F4 | A4 | C5 | G2 F3 | B4 | G4 | F4 | D4 | C3 B3 | E4 | G4 | B4 | C5', 'Dm7 – G7 – Cmaj7, chord tones only'],
      ] },
      { t: 'Guide-tone lines', s: '3rds and 7ths', b: [
        'Sing a line that moves only between the chords’ 3rds and 7ths, by half step or not at all. Then decorate it. It spells the changes without a band.',
      ], ex: [
        ['Dm7 – G7 – Cmaj7: F, F, E', '=D3 A3 | F4 | G2 D3 | F4 | C3 G3 | E4', 'Dm7 (F) – G7 (F) – Cmaj7 (E)'],
        ['The other line: C, B, B', '=D3 A3 | C5 | G2 D3 | B4 | C3 G3 | B4', 'Dm7 (C) – G7 (B) – Cmaj7 (B)'],
      ] },
      { t: 'Arpeggios from the 3rd', s: '3 – 5 – 7 – 9', b: [
        'Start an arpeggio on the chord’s 3rd and you get its upper colours: a 7th chord a 3rd up.',
        '- Over Dm7, play Fmaj7',
        '- Over G7, play Bø7',
        '- Over Cmaj7, play Em7',
      ], ex: [
        ['Fmaj7 over Dm7, Bø7 over G7, Em7 over Cmaj7', '=D3 A3 | F4 | A4 | C5 | E5 | G2 F3 | D5 | B4 | A4 | F4 | C3 B3 | E4 | G4 | B4 | D5', 'Dm9 – G9 – Cmaj9 sounds'],
      ] },
      { t: 'Approach notes and enclosures', s: 'aim at a target', b: [
        '- Approach a chord tone from a half step below',
        '- Or from the scale step above',
        '- Enclose it: above, below, then the target',
      ], ex: [
        ['Enclosing E (the 3rd of C): F – D♯ – E', '=G2 F3 B3 | D4 | F4 | D#4 | E4 | C3 B3 E4', 'G7 → Cmaj7, landing on E'],
      ] },
      { t: 'The bebop scale', s: 'Mixolydian plus a passing ♮7', b: [
        'Add the major 7th to Mixolydian and, running in eighths from a chord tone on the beat, the chord tones keep landing on the beats.',
      ], ex: [
        ['G bebop dominant, down from G', '=G2 F3 B3 | G4 | F#4 | F4 | E4 | D4 | C4 | B3 | A3 | G3'],
      ] },
      { t: 'Pentatonics over changes', s: 'superimposition', b: [
        '- Over <b>Cmaj7</b>: E minor pentatonic (3 5 6 7 9)',
        '- Over <b>Cmaj7♯11</b>: B minor pentatonic (Lydian)',
        '- Over <b>Dm7</b>: A minor pentatonic (5 ♭7 1 9 11)',
        '- Over <b>G7alt</b>: B♭ minor pentatonic (♯9 ♭5 ♭13 ♭7 ♭9)',
      ], ex: [
        ['E minor pentatonic over Cmaj7', '=C3 G3 B3 | E4 | G4 | A4 | B4 | D5 | E5'],
        ['B♭ minor pentatonic over G7alt', '=G2 F3 B3 | Bb4 | Db5 | Eb5 | F5 | Ab5 | Bb5'],
      ] },
      { t: 'The ♭9 sound on V7', s: 'a °7 from the 3rd', b: [
        'Over G7, a B°7 arpeggio gives 3, 5, ♭7, ♭9: the leading tone and the ♭9 both pull into C.',
      ], ex: [
        ['B°7 over G7, resolving to C', '=G2 F3 B3 | B4 | D5 | F5 | Ab5 | G5 | C3 B3 E4 G4'],
      ] },
      { t: 'Triad pairs', s: 'two triads, one scale', b: [
        'Alternate two neighbouring triads from the scale: six notes, no clashes, a modern sound.',
        '- C and D over Cmaj7: Lydian',
        '- F and G over Dm7: Dorian',
      ], ex: [
        ['C and D triads over Cmaj7', '=C3 G3 B3 | C4 | E4 | G4 | D4 | F#4 | A4 | C5 | E5 | G5 | D5 | F#5 | A5'],
      ] },
      { t: 'Motifs and space', s: 'say less', b: [
        '- Take a short idea and move it through the changes, adjusting it to each chord',
        '- Leave rests: phrases need breaths',
        '- Repeat yourself on purpose',
      ] },
      { t: 'Sing it first', s: 'hear before you play', b: [
        'If you can sing a line over the changes, your hands will find it. That’s what the Sing drill is for.',
      ] },
    ],
  },
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

// a scale run over a chord, for the chord-scale cards: '=<chord> | <scale, an octave up from `from`>'
const NM = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
const midiOf = (x) => { const m = /^([A-G](?:#|b)?)(-?\d)$/.exec(x); return T.notePc(T.parseNote(m[1])) + (Number(m[2]) + 1) * 12; };
const nmOf = (m) => NM[m % 12] + (Math.floor(m / 12) - 1);
const run = (chord, from, id) => { const r = midiOf(from); return '=' + chord + ' | ' + [...T.getScale(id).ivs.map((iv) => r + (T.intervalSemis(iv) % 12)), r + 12].map(nmOf).join(' | '); };
const MORE2 = [
  ['twofive', 'The engine', [
    ['Dm7 – G7 – Cmaj7', 'D:m7 G:7 C:maj7'],
    ['With colour: Dm9 – G13 – Cmaj9', 'D:m9 G:13 C:maj9'],
    ['Into minor: Dø7 – G7♭9 – Cm6', 'D:m7b5 G:7b9 C:m6'],
  ]],
  ['twofive', 'Guide tones', [
    ['Just the root, 3rd and 7th of each chord', '=D3 F3 C4 | G2 F3 B3 | C3 E3 B3', 'Dm7 – G7 – Cmaj7 as shells'],
    ['The full chords', 'D:m7 G:7 C:maj7'],
  ]],
  ['twofive', 'Voice-lead it', [
    ['Dm9 – G13 – Cmaj9', 'D:m9 G:13 C:maj9'],
    ['Rootless, as a pianist plays it: each voice moves a step or holds', '=F3 A3 C4 E4 | F3 A3 B3 E4 | E3 G3 B3 D4', 'Dm9 – G13 – Cmaj9, no roots'],
  ]],
  ['twofive', 'Minor ii–V–i', [
    ['Dø7 – G7alt – Cm6', 'D:m7b5 G:7alt C:m6'],
    ['Dø7 – G7♭9 – Cm(maj7)', 'D:m7b5 G:7b9 C:mMaj7'],
    ['In E minor, as in “Autumn Leaves”: F♯ø7 – B7 – Em', 'F#:m7b5 B:7b9 E:m7'],
  ]],
  ['twofive', 'A ii–V to anything', [
    ['To ii: Eø7 – A7♭9 – Dm7', 'C:maj7 E:m7b5 A:7b9 D:m7'],
    ['To IV: Gm7 – C7 – Fmaj7', 'C:maj7 G:m7 C:7 F:maj7'],
    ['To vi: Bø7 – E7♭9 – Am7', 'C:maj7 B:m7b5 E:7b9 A:m7'],
  ]],
  ['twofive', 'Three ways home', [
    ['Front door: Dm7 – G7 – C', 'D:m7 G:7 C:maj7'],
    ['Back door: Fm7 – B♭7 – C', 'F:m7 Bb:7 C:maj7'],
    ['Side door: A♭m7 – D♭7 – C', 'Ab:m7 Db:7 C:maj7'],
  ]],
  ['twofive', 'Turnarounds', [
    ['I – vi – ii – V', 'C:maj7 A:m7 D:m7 G:7 C:maj7'],
    ['I – VI7 – ii – V', 'C:maj7 A:7 D:m7 G:7 C:maj7'],
    ['iii – VI7 – ii – V', 'E:m7 A:7 D:m7 G:7 C:maj7'],
    ['Tadd Dameron’s: I – ♭III7 – ♭VI7 – ♭II7', 'C:maj7 Eb:7#11 Ab:7#11 Db:7#11 C:maj7'],
  ]],
  ['twofive', 'ii–V chains', [
    ['Down by 5ths', 'E:m7 A:7 D:m7 G:7 C:maj7'],
    ['Down by half steps', 'E:m7 A:7 Eb:m7 Ab:7 D:m7 G:7 C:maj7'],
  ]],
  ['twofive', 'Deceptive endings', [
    ['V → vi', 'D:m7 G:7 A:m7'],
    ['V → ♭VI', 'D:m7 G:7 Ab:maj7'],
    ['Or into a ii–V somewhere else: Dm7 – G7 – Em7 – A7', 'D:m7 G:7 E:m7 A:7 D:m7'],
  ]],
  ['voicelead', 'Three jobs', [
    ['Tonic – predominant – dominant – tonic', 'C:maj7 F:maj7 G:7 C:maj7'],
    ['Each job with a substitute: Am7 – Dm7 – B°7 – C', 'A:m7 D:m7 B:dim7 C:maj7'],
  ]],
  ['voicelead', 'Root motion', [
    ['Down in 5ths', 'E:m7 A:m7 D:m7 G:7 C:maj7'],
    ['Down in 3rds', 'C:maj7 A:m7 F:maj7 D:m7'],
    ['Up by steps', 'Ab:maj Bb:maj C:maj'],
    ['Down by steps', 'C:maj Bb:maj Ab:maj G:maj'],
  ]],
  ['voicelead', 'The tritone in V7', [
    ['Just the tritone: B rises to C, F falls to E', '=B3 F4 | C4 E4', 'B and F → C and E'],
    ['The full chords', 'G:7 C:maj'],
  ]],
  ['voicelead', 'Guide tones and shells', [
    ['Shells: root, 7th, 3rd', '=D3 C4 F4 | G2 F3 B3 | C3 B3 E4', 'Dm7 – G7 – Cmaj7 as shells'],
  ]],
  ['voicelead', 'Common tones', [
    ['C – Am – F – Dm: two notes held at every change', 'C:maj A:min F:maj D:min'],
  ]],
  ['voicelead', 'The top line', [
    ['Voicings chosen so the top falls F – E – D', '=D3 A3 C4 F4 | G2 F3 B3 E4 | C3 E3 B3 D4', 'Dm7 – G13 – Cmaj9'],
  ]],
  ['voicelead', 'Pedal point', [
    ['Over a G bass: C/G – G9sus4 – G7 – C', 'C:maj/5 G:9sus4 G:7 C:maj7'],
    ['Tonic pedal: C – F/C – G/C – C', 'C:maj F:maj/5 G:maj/4 C:maj'],
  ]],
  ['voicelead', 'IV/V', [
    ['G9sus4 – G7 – C', 'G:9sus4 G:7 C:maj7'],
    ['F/G straight to C', 'F:maj/2 C:maj7'],
  ]],
  ['voicelead', 'Quartal voicings', [
    ['The “So What” chords: D Dorian, then up a half step', '=D3 G3 C4 F4 A4 | Eb3 Ab3 Db4 Gb4 Bb4', 'Dm11 – E♭m11 in 4ths'],
  ]],
  ['voicelead', 'Cadences', [
    ['Authentic: V → I', 'D:m7 G:7 C:maj'],
    ['Plagal: IV → I', 'C:maj F:maj C:maj'],
    ['Half: stopping on V', 'C:maj A:min D:min G:maj'],
    ['Deceptive: V → vi', 'D:m7 G:7 A:min'],
  ]],
  ['map', 'maj7', [
    ['Ionian over Cmaj7 (I)', run('C3 G3 B3 E4', 'C4', 'ionian'), 'C Ionian over Cmaj7'],
    ['Lydian over Fmaj7 (IV)', run('F2 C3 E3 A3', 'F3', 'lydian'), 'F Lydian over Fmaj7'],
  ]],
  ['map', 'm7', [
    ['Dorian over Dm7 (ii)', run('D3 A3 C4 F4', 'D4', 'dorian'), 'D Dorian over Dm7'],
    ['Phrygian over Em7 (iii)', run('E2 B2 D3 G3', 'E3', 'phrygian'), 'E Phrygian over Em7'],
    ['Aeolian over Am7 (vi)', run('A2 E3 G3 C4', 'A3', 'aeolian'), 'A Aeolian over Am7'],
  ]],
  ['map', 'Dominant 7', [
    ['Mixolydian over G7 → C', run('G2 F3 B3', 'G3', 'mixolydian'), 'G Mixolydian over G7'],
    ['Phrygian dominant over E7 → Am', run('E2 D3 G#3', 'E3', 'phrygian-dominant'), 'E Phrygian dominant over E7'],
    ['Lydian dominant over D7 that doesn’t go to G', run('D3 C4 F#4', 'D4', 'lydian-dominant'), 'D Lydian dominant over D7'],
  ]],
  ['map', 'ø7, °7, m(maj7)', [
    ['Locrian ♮2 over Dø7', run('D3 Ab3 C4 F4', 'D4', 'locrian-nat2'), 'D Locrian ♮2 over Dø7'],
    ['Whole-half over B°7', run('B2 F3 Ab3 D4', 'B3', 'diminished-wh'), 'B whole-half over B°7'],
    ['Melodic minor over Cm(maj7)', run('C3 G3 B3 Eb4', 'C4', 'melodic-minor'), 'C melodic minor over Cm(maj7)'],
  ]],
  ['map', 'The modes of major', [
    ['C Ionian, then C Lydian: one note (F → F♯) changes', run('C3 G3 B3 E4', 'C4', 'ionian') + ' | ' + run('C3 G3 B3 E4', 'C4', 'lydian').slice(1), 'C Ionian, then C Lydian'],
    ['C Dorian, then C Aeolian: one note (A → A♭) changes', run('C3 G3 Bb3 Eb4', 'C4', 'dorian') + ' | ' + run('C3 G3 Bb3 Eb4', 'C4', 'aeolian').slice(1), 'C Dorian, then C Aeolian'],
  ]],
  ['map', 'Harmonic minor’s 5th mode', [
    ['E Phrygian dominant over E7♭9, resolving to Am', run('E2 D3 G#3 F4', 'E3', 'phrygian-dominant') + ' | A2 E3 G3 C4', 'E Phrygian dominant → Am7'],
  ]],
  ['chordmelody', 'Bass on the downbeat', [
    ['Open-string bass under a high voicing: A, then D', '=A2 G4 C#5 E5 | D3 F4 C5 A5', 'A7 → Dm7, bass on open strings'],
  ]],
  ['other', 'Picardy third', [
    ['In A minor: … E7 → A major', 'A:min D:m7 E:7 A:maj'],
    ['With a ii–V: Bø7 – E7♭9 – A major', 'B:m7b5 E:7b9 A:maj'],
  ]],
];
for (const [deck, title, ex] of MORE2) {
  const c = DECKS.find((d) => d.id === deck)?.cards.find((x) => x.t === title);
  if (!c) { console.warn('no card', deck, title); continue; }
  c.ex = [...(c.ex || []), ...ex.filter(([, p]) => !(c.ex || []).some(([, q]) => q === p))]; delete c.play;
}

// ---------- the foundations, first in the contents: reading symbols, the diatonic chords, and every chord type ----------
// `chord` puts the chord's notes and intervals on the card (in C, from the engine); `row` puts a row of chords.
const ROW = (ids) => ids.map(([n, tok]) => { const c = T.parseChordToken(tok); return [n, T.pretty(T.chordSymbol(c.root, c.quality))]; });
DECKS.unshift(
  {
    id: 'symbols', name: 'Reading chord symbols', cards: [
      { t: 'How a symbol is built', s: 'read it left to right', b: [
        'Root → quality → 7th → extensions → alterations → /bass.',
        '- <b>C</b>m7♭5: root C, minor, ♭7, ♭5',
        '- <b>G</b>7♯9: root G, dominant 7, raised 9th',
        '- <b>F</b>maj7♯11/A: F major 7 with a ♯11, A in the bass',
      ] },
      { t: 'The triad', s: 'major, minor, diminished, augmented', b: [
        '- No mark: <b>major</b> (C)',
        '- m, min, mi or –: <b>minor</b> (Cm, C–)',
        '- ° or dim: <b>diminished</b> (C°): ♭3 and ♭5',
        '- + or aug: <b>augmented</b> (C+): 3 and ♯5',
      ], ex: [['Major, minor, diminished, augmented', 'C:maj C:min C:dim C:aug']] },
      { t: 'The bare 7 is always ♭7', s: 'three kinds of 7th', b: [
        '- <b>7</b> alone means ♭7: C7 is a dominant 7th (C E G B♭)',
        '- <b>maj7</b>, M7 or Δ means the major 7th: Cmaj7 (C E G B)',
        '- On a minor chord too: Cm7 has ♭7, Cm(maj7) has the major 7th',
        '- <b>°7</b> has a 𝄫7 (the same note as 6): C°7 is C E♭ G♭ B𝄫 (A)',
      ], ex: [['C7, Cmaj7, Cm7, Cm(maj7), C°7', 'C:7 C:maj7 C:m7 C:mMaj7 C:dim7']] },
      { t: 'Every way to write it', s: 'the same chord, different books', b: [
        '- <b>Major 7</b>: Cmaj7, CM7, CΔ, CΔ7, Cma7',
        '- <b>Minor 7</b>: Cm7, Cmin7, Cmi7, C–7',
        '- <b>Half-diminished</b>: Cø7, Cø, Cm7♭5, C–7♭5',
        '- <b>Diminished 7</b>: C°7, Cdim7 (often just C°)',
        '- <b>Minor-major 7</b>: Cm(maj7), CmΔ7, C–Δ7',
        '- <b>Augmented 7</b>: C7♯5, C+7, Caug7',
        '- <b>Minor 6</b>: Cm6, C–6',
      ] },
      { t: 'Extensions bring the 7th', s: '9, 11 and 13', b: [
        'A 9, 11 or 13 means the 7th is in the chord too; the rest of the symbol says which 7th.',
        '- <b>C9</b>: dominant (C7 + 9)',
        '- <b>Cmaj9</b>: maj7 + 9',
        '- <b>Cm9</b>: m7 + 9',
        '- <b>C13</b>: C7 + 9 + 13, with the 11 left out (it clashes with the 3rd)',
        '- <b>C11</b>: usually played as a sus chord, B♭/C',
      ], ex: [['C9, Cmaj9, Cm9, C13', 'C:9 C:maj9 C:m9 C:13']] },
      { t: 'add, 6 and 6/9', s: 'colours with no 7th', b: [
        '- <b>Cadd9</b>: the triad plus 9, no 7th (C E G D)',
        '- <b>C6</b>: the triad plus 6 (C E G A)',
        '- <b>C6/9</b>: plus 6 and 9, no 7th (C E G A D)',
        '- <b>Cm6</b>: the minor triad plus the major 6th (C E♭ G A)',
      ], ex: [['Cadd9, C6, C6/9, Cm6', 'C:add9 C:6 C:6/9 C:m6']] },
      { t: 'sus', s: 'the 3rd replaced', b: [
        '- <b>Csus4</b> (or Csus): the 4th instead of the 3rd',
        '- <b>Csus2</b>: the 2nd instead of the 3rd',
        '- <b>C7sus4, C9sus4, C13sus</b>: dominants without a 3rd (C9sus4 = B♭/C)',
        'Cadd9 keeps the 3rd; Csus2 doesn’t.',
      ], ex: [['Csus4 → C, Csus2 → C', 'C:sus4 C:maj C:sus2 C:maj']] },
      { t: 'Alterations', s: '♭9, ♯9, ♯11, ♭13', b: [
        'Written after the chord, with or without brackets: C7♭9 = C7(♭9).',
        '- ♯11 is the same note as ♭5; ♭13 is the same as ♯5',
        '- <b>alt</b>: any of ♭9, ♯9, ♯11, ♭13, usually with no 5th',
        '- Older charts write – for ♭ and + for ♯: C7–9 is C7♭9, and C7+ often means C7♯5',
      ], ex: [['C7♭9, C7♯9, C7♯11, C7♭13, C7alt', 'C:7b9 C:7#9 C:7#11 C:7b13 C:7alt']] },
      { t: 'Slash chords', s: 'the bass note', b: [
        '- <b>C/E</b>: C with E in the bass (an inversion)',
        '- <b>D/C</b>: a D triad over a C bass. The bass isn’t in the chord, so it makes a new one (C Lydian)',
        '- A chord written over another with a line (D over C7) is a polychord: both at once',
      ], ex: [['C/E, C/G, D/C', 'C:maj/3 C:maj/5 D:maj/b7']] },
      { t: 'Omissions', s: 'what you can leave out', b: [
        '- <b>C5</b>: a power chord, root and 5th, no 3rd',
        '- <b>C(no3)</b>, <b>omit5</b>: say what’s missing',
        'In practice: the 5th goes first (unless it’s altered), the root goes if someone else plays bass. The 3rd and 7th stay, since they define the chord.',
      ] },
      { t: 'Roman numerals', s: 'chords by their place in the key', b: [
        '- Upper case is major (V), lower case is minor (ii)',
        '- ° is diminished (vii°), ø is half-diminished (viiø7), + is augmented',
        '- ♭ or ♯ moves the root against the major scale: ♭VII in C is B♭',
        '- V/V means “the V of V”: D7 in C',
        '- I/3 is I with its 3rd in the bass',
      ] },
      { t: 'Spell any chord', s: 'every other letter, then the accidentals', b: [
        'Stack letters in 3rds from the root (C E G B D F A), then fix each one to the formula.',
        '- Cm7♭5: C E G B → C E♭ G♭ B♭',
        '- A♭13: A♭ C E♭ G♭, plus B♭ (9) and F (13)',
        '- E7♯9: E G♯ B D, plus F𝄪 (= G), the “Hendrix chord”',
      ] },
    ],
  },
  {
    id: 'diatonic', name: 'Diatonic harmony', cards: [
      { t: 'The major key in 7ths', s: 'stack 3rds on every note', b: [
        'Imaj7, ii7, iii7, IVmaj7, V7, vi7, viiø7. Two maj7s, three m7s, one dominant and one ø7: every major key, the same pattern.',
        '- As triads: I, ii, iii, IV, V, vi, vii°',
      ], row: ROW([['I', 'C:maj7'], ['ii', 'D:m7'], ['iii', 'E:m7'], ['IV', 'F:maj7'], ['V', 'G:7'], ['vi', 'A:m7'], ['viiø', 'B:m7b5']]),
        ex: [['Up the key', 'C:maj7 D:m7 E:m7 F:maj7 G:7 A:m7 B:m7b5 C:maj7']] },
      { t: 'Three families', s: 'what each chord does', b: [
        '- <b>Tonic</b>: I, iii, vi (home)',
        '- <b>Predominant</b>: ii, IV (moving away)',
        '- <b>Dominant</b>: V, vii (pulling back)',
        'Chords in the same family share notes, so they can stand in for each other.',
      ], ex: [['One family member for another: I – IV – V – I, then vi – ii – vii – iii', 'C:maj7 F:maj7 G:7 C:maj7 A:m7 D:m7 B:m7b5 E:m7']] },
      { t: 'I', s: 'tonic: home', b: [
        'Stable and final.',
        '- <b>Colours</b>: maj7, 6, 6/9, maj9',
        '- <b>Swaps</b>: iii or vi (the deceptive move), i (borrowed), I7 (to head for IV)',
      ], ex: [
        ['V → I, then V → vi: the deceptive swap', 'D:m7 G:7 C:maj7 D:m7 G:7 A:m7'],
        ['I as 6/9, the jazz ending', 'D:m9 G:13 C:6/9'],
      ] },
      { t: 'ii', s: 'predominant', b: [
        'The usual way into V: ii – V – I.',
        '- <b>Swaps</b>: IV (the same job), iiø7 (borrowed, darker), II7 (V of V, brighter)',
        '- Or ii – ♭II7 – I',
      ], ex: [
        ['ii, then IV, then iiø, then II7, each into V', 'D:m7 G:7 C:maj7 F:maj7 G:7 C:maj7 D:m7b5 G:7 C:maj7 D:7 G:7 C:maj7'],
      ] },
      { t: 'iii', s: 'a weak tonic', b: [
        'Shares three notes with Imaj7, so it often stands in for I or starts a cycle: iii – vi – ii – V.',
        '- <b>Swaps</b>: I; III7 (V of vi) to push on; ♭IIImaj7 (borrowed)',
      ], ex: [
        ['iii – vi – ii – V – I', 'E:m7 A:m7 D:m7 G:7 C:maj7'],
        ['iii becomes III7 to push into vi', 'C:maj7 E:7 A:m7'],
      ] },
      { t: 'IV', s: 'predominant', b: [
        'The bright move away from home; IV → I is the plagal (“amen”) cadence.',
        '- <b>Swaps</b>: ii; iv (borrowed); IVmaj7♯11 for Lydian colour; IV7 in a blues; ♭VII as rock’s IV',
      ], ex: [
        ['IV, then iv, on the way home', 'C:maj7 F:maj7 C:maj7 F:m6 C:maj7'],
        ['IVmaj7♯11', 'C:maj7 F:maj7#11 C:maj7'],
      ] },
      { t: 'V', s: 'dominant: the pull', b: [
        'The only diatonic dominant 7. Its 3rd (the leading tone) and 7th make the tritone that resolves to I.',
        '- <b>Swaps</b>: vii° (rootless V), ♭II7 (tritone sub), V7sus4 (soft), ♭VII7 (backdoor), V7alt (tense), or ii–V instead of V',
      ], ex: [
        ['V7, ♭II7, ♭VII7, V7sus4: four ways into C', 'G:7 C:maj7 Db:7#11 C:maj7 Bb:9 C:maj7 G:9sus4 C:maj7'],
      ] },
      { t: 'vi', s: 'the relative minor', b: [
        'A tonic substitute with a sadder colour, and the target of the deceptive cadence.',
        '- <b>Swaps</b>: I; ♭VI (borrowed); VI7 (V of ii) to push on',
      ], ex: [
        ['I – vi – ii – V, then I – VI7 – ii – V', 'C:maj7 A:m7 D:m7 G:7 C:maj7 A:7 D:m7 G:7'],
      ] },
      { t: 'viiø', s: 'a dominant without its root', b: [
        'Bø7 is G9 without the G, so it works as V. More often it’s the ii of a ii–V into vi.',
        '- <b>Swaps</b>: V7, V9; vii°7 (from harmonic minor) for more pull',
      ], ex: [
        ['As the ii of vi: Bø7 – E7 – Am7', 'B:m7b5 E:7b9 A:m7'],
        ['As a soft V: Fmaj7 – Bø7 – Cmaj7', 'F:maj7 B:m7b5 C:maj7'],
      ] },
      { t: 'The minor key in 7ths', s: 'natural minor', b: [
        'im7, iiø7, ♭IIImaj7, ivm7, vm7, ♭VImaj7, ♭VII7: the major key’s chords from its 6th degree.',
        '- In practice the v becomes V7 (from harmonic minor) to get a real pull home',
      ], row: ROW([['i', 'C:m7'], ['iiø', 'D:m7b5'], ['♭III', 'Eb:maj7'], ['iv', 'F:m7'], ['v', 'G:m7'], ['♭VI', 'Ab:maj7'], ['♭VII', 'Bb:7']]),
        ex: [['Up the key', 'C:m7 D:m7b5 Eb:maj7 F:m7 G:m7 Ab:maj7 Bb:7 C:m7']] },
      { t: 'Harmonic minor’s 7ths', s: 'the raised 7th', b: [
        'Raising the 7th gives a real V7 and a vii°7, plus two unusual chords: i(maj7) and ♭IIImaj7♯5.',
      ], row: ROW([['i', 'C:mMaj7'], ['iiø', 'D:m7b5'], ['♭III+', 'Eb:maj7#5'], ['iv', 'F:m7'], ['V', 'G:7'], ['♭VI', 'Ab:maj7'], ['vii°', 'B:dim7']]),
        ex: [['iiø – V7 – i, then vii°7 – i', 'D:m7b5 G:7b9 C:mMaj7 B:dim7 C:mMaj7']] },
      { t: 'Melodic minor’s 7ths', s: 'raised 6th and 7th', b: [
        'A major IV7 (Lydian dominant), a V7, and two ø7s. The vii chord is where the altered scale comes from.',
      ], row: ROW([['i', 'C:mMaj7'], ['ii', 'D:m7'], ['♭III+', 'Eb:maj7#5'], ['IV', 'F:7'], ['V', 'G:7'], ['viø', 'A:m7b5'], ['viiø', 'B:m7b5']]),
        ex: [['i – IV7 – i: the bright minor', 'C:mMaj7 F:9 C:m6 F:9']] },
      { t: 'Minor keys mix all three', s: 'what players actually use', b: [
        '- <b>i</b>: m7, m6 or m(maj7)',
        '- <b>iiø7</b> and <b>V7</b> (harmonic minor) for the cadence',
        '- <b>iv7</b>, or <b>IV7</b> (Dorian or melodic minor)',
        '- <b>♭III</b>, <b>♭VI</b>, <b>♭VII</b> from natural minor',
        '- <b>vii°7</b> as another dominant',
      ], ex: [['i – ♭VI – iiø – V7 – i', 'C:m7 Ab:maj7 D:m7b5 G:7b9 C:m6']] },
    ],
  },
  {
    id: 'types', name: 'Chord types and their jobs', cards: [
      { t: 'Major', s: 'C', chord: 'C:maj', b: [
        '<b>Lives on</b>: I, IV, V in major; ♭III, ♭VI, ♭VII in minor.',
        '<b>Job</b>: home, or a bright pillar.',
        '<b>Swap for</b>: maj7, 6 or add9 on I and IV; V7 on V.',
      ], ex: [['I – IV – V – I', 'C:maj F:maj G:maj C:maj']] },
      { t: 'Minor', s: 'Cm', chord: 'C:min', b: [
        '<b>Lives on</b>: ii, iii, vi in major; i, iv, v in minor.',
        '<b>Job</b>: predominant (ii), tonic substitute (iii, vi), or the minor home.',
        '<b>Swap for</b>: m7, m9, m6 or madd9.',
      ], ex: [['vi – IV – I – V', 'A:min F:maj C:maj G:maj']] },
      { t: 'Diminished triad', s: 'C°', chord: 'C:dim', b: [
        '<b>Lives on</b>: vii° in major, ii° in minor.',
        '<b>Job</b>: a dominant without its root (B° is G7 without G), or a passing chord.',
        '<b>Swap for</b>: V7; °7 or ø7.',
      ], ex: [['IV – vii° – I', 'F:maj B:dim C:maj'], ['ii° – V – i in minor', 'D:dim G:7 C:min']] },
      { t: 'Augmented', s: 'C+', chord: 'C:aug', b: [
        '<b>Lives on</b>: ♭III+ in harmonic and melodic minor. Symmetrical: it repeats every 4 frets.',
        '<b>Job</b>: passing tension; its ♯5 rises.',
        '<b>Swap for</b>: V+ or V7♯5 instead of V; I+ in a line cliché.',
      ], ex: [['V+ → I', 'G:aug C:maj'], ['I – I+ – I6 – I7 → IV', 'C:maj C:aug C:6 C:7 F:maj']] },
      { t: 'sus4 and sus2', s: 'Csus4, Csus2', chord: 'C:sus4', b: [
        '<b>Job</b>: hold back the 3rd. sus4 wants to fall to the 3rd; sus2 is an open colour that doesn’t need to resolve.',
        '<b>Swap for</b>: any major triad (and sus2 for minor too, since it has no 3rd); V7sus4 for V.',
      ], ex: [['Csus4 → C, then Gsus4 → G', 'C:sus4 C:maj G:sus4 G:maj C:maj'], ['Open sus2 colours', 'C:sus2 F:sus2 G:sus2 C:sus2']] },
      { t: 'Power chord', s: 'C5', chord: 'C:5', b: [
        '<b>Job</b>: rock and metal riffs. With no 3rd it’s neither major nor minor, so distortion stays clean and it fits either kind of key.',
      ], ex: [['I – ♭III – IV', 'C:5 Eb:5 F:5 C:5']] },
      { t: 'maj7', s: 'Cmaj7', chord: 'C:maj7', b: [
        '<b>Lives on</b>: I and IV in major; ♭III and ♭VI in minor.',
        '<b>Job</b>: a soft tonic (I) or predominant (IV).',
        '<b>Swap for</b>: on I: 6, 6/9, maj9, iii7, vi7. On IV: ii7, iv7, maj7♯11.',
      ], ex: [['Imaj7 – IVmaj7', 'C:maj7 F:maj7 C:maj7 F:maj7'], ['IVmaj7 → IVmaj7♯11', 'F:maj7 F:maj7#11 C:maj7']] },
      { t: '6', s: 'C6', chord: 'C:6', b: [
        '<b>Lives on</b>: I and IV.',
        '<b>Job</b>: the swing-era tonic. Same notes as vi7 with I in the bass (C6 = Am7/C).',
        '<b>Swap for</b>: maj7 or 6/9 on I.',
      ], ex: [['ii – V – I6', 'D:m7 G:7 C:6']] },
      { t: '6/9', s: 'C6/9', chord: 'C:6/9', b: [
        '<b>Job</b>: the richest major tonic without a 7th: no clashes, rings forever. A favourite final chord.',
        '<b>Swap for</b>: maj7 or 6 on I or IV.',
      ], ex: [['Ending on 6/9', 'D:m9 G:13 C:6/9']] },
      { t: 'add9', s: 'Cadd9', chord: 'C:add9', b: [
        '<b>Job</b>: pop and rock colour on any major chord, with no jazz 7th.',
        '<b>Swap for</b>: a plain triad; sus2 if you want it more open.',
      ], ex: [['I – V – vi – IV with add9s', 'C:add9 G:maj A:min F:add9']] },
      { t: 'Dominant 7', s: 'C7', chord: 'C:7', b: [
        '<b>Lives on</b>: V in major (the only one), V in harmonic minor, IV and V in melodic minor. Every other dominant is borrowed or secondary.',
        '<b>Job</b>: pull to the chord a 5th down; or blues colour (I7, IV7); or a floating colour.',
        '<b>Swap for</b>: ♭II7, vii°7, V7sus4, ♭VII7 (backdoor), V7alt, or ii–V in place of V.',
      ], ex: [['V7 → I, then the tritone sub', 'D:m7 G:7 C:maj7 D:m7 Db:7 C:maj7'], ['Blues: I7 – IV7', 'C:7 F:7 C:7']] },
      { t: 'm7', s: 'Cm7', chord: 'C:m7', b: [
        '<b>Lives on</b>: ii, iii, vi in major; i, iv, v in natural minor; ii in melodic minor.',
        '<b>Job</b>: ii is predominant; iii and vi are tonic substitutes; i is the minor home.',
        '<b>Swap for</b>: on ii: IV, iiø7, II7. On vi: I, ♭VI, VI7. On iii: I, III7.',
      ], ex: [['iii – vi – ii – V', 'E:m7 A:m7 D:m7 G:7 C:maj7']] },
      { t: 'm6', s: 'Cm6', chord: 'C:m6', b: [
        '<b>Lives on</b>: i in Dorian and melodic minor; borrowed iv6 in major.',
        '<b>Job</b>: the jazz minor tonic. Same notes as a ø7 a minor 3rd down (Cm6 = Aø7).',
        '<b>Swap for</b>: m(maj7), m7 or m9 on i; iiø7 for iv6.',
      ], ex: [['iiø – V – i6', 'D:m7b5 G:7b9 C:m6'], ['IV – iv6 – I in major', 'F:maj7 F:m6 C:maj7']] },
      { t: 'm(maj7)', s: 'Cm(maj7)', chord: 'C:mMaj7', b: [
        '<b>Lives on</b>: i in harmonic and melodic minor.',
        '<b>Job</b>: a minor tonic with a sting, and the second chord of the minor line cliché.',
        '<b>Swap for</b>: m6, m7, m9 on i.',
      ], ex: [['The minor line cliché', 'C:min C:mMaj7 C:m7 C:m6']] },
      { t: 'ø7 (m7♭5)', s: 'Cø7', chord: 'C:m7b5', b: [
        '<b>Lives on</b>: vii in major; ii in natural and harmonic minor; vi and vii in melodic minor.',
        '<b>Job</b>: the ii of a minor ii–V; in major, a V9 without its root.',
        '<b>Swap for</b>: iv6 (the same notes: Dø7 = Fm6); m7 for a brighter ii.',
      ], ex: [['iiø – V7♭9 – i', 'D:m7b5 G:7b9 C:m6'], ['viiø – III7 – vi in major', 'B:m7b5 E:7b9 A:m7']] },
      { t: '°7', s: 'C°7', chord: 'C:dim7', b: [
        '<b>Lives on</b>: vii°7 in harmonic minor. Elsewhere it’s passing or borrowed.',
        '<b>Job</b>: a rootless 7♭9 (four of them, a minor 3rd apart); passing between chords a step apart; common-tone neighbour.',
        '<b>Swap for</b>: any of its four 7♭9s (C♯°7 for A7♭9).',
      ], ex: [['C♯°7 or A7♭9 into Dm7', 'C:maj7 C#:dim7 D:m7 C:maj7 A:7b9 D:m7']] },
      { t: 'maj7♯5', s: 'Cmaj7♯5', chord: 'C:maj7#5', b: [
        '<b>Lives on</b>: ♭III in harmonic and melodic minor.',
        '<b>Job</b>: a tense, glassy major chord; the ♯5 wants to fall to the 5th or rise to the 6th.',
        '<b>Swap for</b>: maj7 when you want tension; E/C is the same sound.',
      ], ex: [['Imaj7♯5 → I6', 'C:maj7 C:maj7#5 C:6']] },
      { t: '9 and 13', s: 'C9, C13', chord: 'C:13', b: [
        '<b>Job</b>: dominants with colour: V going to major, blues I7 and IV7, funk vamps. 13 usually includes the 9 and leaves out the 11.',
        '<b>Scale</b>: Mixolydian.',
        '<b>Swap for</b>: plain 7; 7sus4; 13♭9 or 7alt when the target is minor.',
      ], ex: [['ii9 – V13 – Imaj9', 'D:m9 G:13 C:maj9'], ['A funk vamp', 'C:9 C:13 C:9 C:13']] },
      { t: 'maj9, m9, m11', s: 'Cmaj9, Cm9, Cm11', chord: 'C:m11', b: [
        '<b>Job</b>: richer tonics and predominants. maj9 on I and IV; m9 on ii, vi and a minor i; m11 on ii and on Dorian i.',
        '- No natural 11 on a major chord: use ♯11 instead',
      ], ex: [['iim11 – V13 – Imaj9', 'D:m11 G:13 C:maj9'], ['A Dorian vamp on m11', 'C:m11 F:13 C:m11 F:13']] },
      { t: '7sus4 and 9sus4', s: 'C7sus4, C9sus4', chord: 'C:9sus4', b: [
        '<b>Job</b>: a V with no 3rd, so no tritone and no pull. Same notes as ii over V’s root: Gm7/C = C9sus4.',
        '<b>Swap for</b>: a whole ii–V (Dm7 – G7 becomes G9sus4); or V7 before it resolves.',
      ], ex: [['V9sus4 → V7 → I', 'G:9sus4 G:7 C:maj7'], ['A ii–V squeezed into one sus chord', 'G:9sus4 C:maj7']] },
      { t: 'maj7♯11', s: 'Cmaj7♯11', chord: 'C:maj7#11', b: [
        '<b>Lives on</b>: IV in major (Lydian); borrowed ♭VI, ♭II and ♭VII.',
        '<b>Job</b>: a bright major chord without the clashing 4th.',
        '<b>Swap for</b>: maj7 on IV, or on I for a Lydian tonic.',
      ], ex: [['IVmaj7♯11 – I', 'F:maj7#11 C:maj7'], ['♭VImaj7♯11 – I', 'Ab:maj7#11 C:maj7']] },
      { t: '7♯11', s: 'C7♯11', chord: 'C:7#11', b: [
        '<b>Lives on</b>: IV in melodic minor (Lydian dominant).',
        '<b>Job</b>: dominants that don’t resolve down a 5th: tritone subs, II7, ♭VI7, ♭VII7, IV7.',
        '<b>Swap for</b>: 9 or 13 on any non-pulling dominant.',
      ], ex: [['♭II7♯11 → I', 'D:m7 Db:7#11 C:maj7'], ['II7♯11 – I', 'C:maj7 D:7#11 C:maj7']] },
      { t: '7♭9, 7♯9, 7♭13, 7alt', s: 'dominants with altered tensions', chord: 'C:7alt', b: [
        '<b>Lives on</b>: V in harmonic minor (7♭9 ♭13); the altered scale is melodic minor’s 7th mode.',
        '<b>Job</b>: V7 going to a minor chord, or any V7 that should sound tense.',
        '<b>Swap for</b>: plain V7; a °7 for 7♭9; the tritone sub (its 7♯11 has the same notes as V7alt).',
      ], ex: [['V7♭9 → i, then V7alt → i', 'D:m7b5 G:7b9 C:m6 D:m7b5 G:7alt C:m6'], ['V7♯9 in a minor blues', 'C:m7 G:7#9 C:m7']] },
      { t: '13♭9', s: 'C13♭9', chord: 'C:13b9', b: [
        '<b>Job</b>: a dominant with both a sweet 13 and a dark ♭9. The half-whole diminished scale.',
        '<b>Swap for</b>: 7♭9; or 13 when you want it sweeter.',
      ], ex: [['V13♭9 → I', 'D:m7 G:13b9 C:maj7']] },
      { t: '7♯5', s: 'C7♯5 (C+7)', chord: 'C:7#5', b: [
        '<b>Job</b>: V7 with a rising ♯5 that becomes the 3rd of I. The whole-tone scale.',
        '<b>Swap for</b>: V7 or V+.',
      ], ex: [['V7♯5 → I', 'D:m7 G:7#5 C:maj7']] },
    ],
  },
);

// ---------- comping and soloing: a progression loops (Play), you follow the card. Easiest first. ----------
// comp.chart: bars split by '|', one or two chords a bar, '%' repeats the bar; comp.bpm: where it starts.
DECKS.splice(DECKS.findIndex((d) => d.id === 'chordmelody'), 0, {
  id: 'comping', name: 'Comping and soloing', cards: [
    { t: 'One chord: Dorian', s: 'level 1 · a Dm7 vamp', comp: { chart: 'D:m7 | % | % | %', bpm: 80 }, b: [
      '<b>Comp</b>: a Dm7 shell (D, C, F: root, ♭7, ♭3) on beat 1 of each bar. Then move it to beats 2 and 4.',
      '<b>Solo</b>: D Dorian (the notes of C major from D). Land on F (♭3) or C (♭7) at the start of each bar.',
    ] },
    { t: 'i – IV: the Dorian vamp', s: 'level 1 · one note moves', comp: { chart: 'D:m7 | G:7 | D:m7 | G:7', bpm: 80 }, b: [
      '<b>Comp</b>: just two notes. F and C on Dm7, then F and B on G7: only C → B moves. Hold each for the whole bar.',
      '<b>Solo</b>: D Dorian over both. On G7, aim for B: it’s the note that makes it Dorian.',
    ] },
    { t: 'ii – V – I', s: 'level 2 · guide tones', comp: { chart: 'D:m7 | G:7 | C:maj7 | %', bpm: 80 }, b: [
      '<b>Comp</b>: 3rds and 7ths only, on beats 1 and 3: F–C → F–B → E–B. Each change moves one note a half step.',
      '<b>Solo</b>: arpeggios. D F A C, then G B D F, then C E G B, with a chord tone on beat 1 of every bar.',
    ] },
    { t: 'ii – V – I with colour', s: 'level 2 · Charleston rhythm', comp: { chart: 'D:m9 | G:13 | C:maj9 | %', bpm: 90 }, b: [
      '<b>Comp</b>: rootless voicings (F A C E → F A B E → E G B D). Play them on beat 1 and the “and” of 2: the Charleston.',
      '<b>Solo</b>: C major over all three, but start each bar on the chord’s 3rd: F, B, E.',
    ] },
    { t: 'Minor ii – V – i', s: 'level 3 · the ♭9', comp: { chart: 'B:m7b5 | E:7b9 | A:m6 | %', bpm: 80 }, b: [
      '<b>Comp</b>: shells, and put the ♭9 (F) on top of E7.',
      '<b>Solo</b>: A harmonic minor over Bø7 and E7 (on E7 that’s E Phrygian dominant), then A melodic minor (A B C D E F♯ G♯) on Am6. Hear the F → F♯ change.',
    ] },
    { t: 'I – vi – ii – V', s: 'level 3 · two chords a bar', comp: { chart: 'C:maj7 A:m7 | D:m7 G:7 | C:maj7 A:m7 | D:m7 G:7', bpm: 90 }, b: [
      '<b>Comp</b>: one guide-tone pair per chord, half notes, always the smallest move.',
      '<b>Solo</b>: C major pentatonic over everything first. Then play the 3rd of each chord as it arrives: E, C, F, B.',
    ] },
    { t: 'I – VI7 – ii – V', s: 'level 3 · a secondary dominant', comp: { chart: 'C:maj7 A:7b9 | D:m7 G:7 | C:maj7 A:7b9 | D:m7 G:7', bpm: 90 }, b: [
      '<b>Comp</b>: on A7, make C♯ the top note; it rises to D on Dm7.',
      '<b>Solo</b>: C major, but over A7 play D harmonic minor (A Phrygian dominant): C becomes C♯, with B♭ as the ♭9.',
    ] },
    { t: 'Dominant chain', s: 'level 4 · the rhythm-changes bridge', comp: { chart: 'E:7 | A:7 | D:7 | G:7', bpm: 90 }, b: [
      '<b>Comp</b>: the 3rd and 7th of each chord; they take turns falling a half step (G♯ D → G C♯ → F♯ C → F B).',
      '<b>Solo</b>: Mixolydian on each chord, and play its 3rd on beat 1: G♯, C♯, F♯, B.',
    ] },
    { t: 'The blues', s: 'level 4 · 12 bars in C', comp: { chart: 'C:7 | F:7 | C:7 | C:7 | F:7 | F:7 | C:7 | A:7 | D:m7 | G:7 | C:7 A:7 | D:m7 G:7', bpm: 100 }, b: [
      '<b>Comp</b>: 3–7 shells (E–B♭ on C7, A–E♭ on F7) on beats 2 and 4, like a hi-hat.',
      '<b>Solo</b>: the C blues scale for one chorus. Next chorus, hit E on every C7 and A on every F7.',
    ] },
    { t: 'The minor blues', s: 'level 5 · ♭VI7 to V7', comp: { chart: 'C:m9 | % | % | % | F:m9 | % | C:m9 | % | Ab:7#11 | G:7alt | C:m9 | G:7alt', bpm: 90 }, b: [
      '<b>Comp</b>: m9 voicings; in bars 9–10, slide A♭7 down a half step to G7.',
      '<b>Solo</b>: C minor pentatonic over the i and iv. Then A♭ Lydian dominant (E♭ melodic minor) on A♭7, and G altered (A♭ melodic minor) on G7alt.',
    ] },
    { t: 'Three ways home', s: 'level 5 · front, back and side door', comp: { chart: 'D:m7 G:7 | C:maj7 | F:m7 Bb:7 | C:maj7 | D:m7 Db:7#11 | C:maj7', bpm: 90 }, b: [
      '<b>Comp</b>: keep a common tone on top through each cadence.',
      '<b>Solo</b>: C major for the ii–V; F Dorian into B♭ Mixolydian for the backdoor; D♭ Lydian dominant (A♭ melodic minor) for the tritone sub.',
    ] },
    { t: 'Borrowed chords', s: 'level 5 · modal interchange', comp: { chart: 'C:maj7 | F:maj7 | F:m6 | C:maj7 | C:maj7 | Ab:maj7 | Bb:7 | C:maj7', bpm: 80 }, b: [
      '<b>Comp</b>: let the inner voice sing A → A♭ → G through F – Fm6 – C.',
      '<b>Solo</b>: C Ionian, F Lydian, F melodic minor on Fm6, then A♭ Lydian and B♭ Mixolydian. Lean on the borrowed notes (A♭, E♭, B♭) when they arrive.',
    ] },
    { t: 'Secondary dominants', s: 'level 6 · the “All of Me” shape', comp: { chart: 'C:6 | % | E:7 | % | A:7 | % | D:m7 | G:7', bpm: 110 }, b: [
      '<b>Comp</b>: follow the 3rds as the chords move: E (C6) → G♯ (E7) → C♯ (A7) → F (Dm7) → B (G7).',
      '<b>Solo</b>: C major, then A harmonic minor over E7, D harmonic minor over A7, D Dorian, G Mixolydian.',
    ] },
    { t: 'Rhythm changes', s: 'level 6 · the A section in B♭', comp: { chart: 'Bb:6 G:7 | C:m7 F:7 | Bb:6 G:7 | C:m7 F:7 | Bb:6 Bb:7 | Eb:6 Eb:m6 | Bb:6 F:7 | Bb:6', bpm: 120 }, b: [
      '<b>Comp</b>: two shells a bar, short and on the beat. Fast, so keep the moves tiny.',
      '<b>Solo</b>: the B♭ blues scale works over the first four bars. Then outline bars 5–6: B♭7 into E♭, and E♭ melodic minor on E♭m6.',
    ] },
    { t: 'Autumn Leaves, A section', s: 'level 6 · relative major and minor', comp: { chart: 'A:m7 | D:7 | G:maj7 | C:maj7 | F#:m7b5 | B:7b9 | E:m7 | %', bpm: 100 }, b: [
      '<b>Comp</b>: drop 2, voice-led in one area of the neck.',
      '<b>Solo</b>: G major (E natural minor) for bars 1–4. Then E harmonic minor for F♯ø7 – B7 (the D♯), and E Dorian on Em.',
    ] },
    { t: 'The diatonic cycle', s: 'level 7 · “Fly Me to the Moon”', comp: { chart: 'A:m7 | D:m7 | G:7 | C:maj7 | F:maj7 | B:m7b5 | E:7b9 | A:m7', bpm: 110 }, b: [
      '<b>Comp</b>: the guide-tone line through all eight: C/G → F/C → F/B → E/B → E/A → D/A → D/G♯ → C/G.',
      '<b>Solo</b>: C major everywhere except E7: there, A harmonic minor, with the G♯ leading back to A.',
    ] },
    { t: 'The Bird blues', s: 'level 8 · falling ii–Vs', comp: { chart: 'C:maj7 | B:m7b5 E:7 | A:m7 D:7 | G:m7 C:7 | F:7 | F:m7 Bb:7 | E:m7 A:7 | Eb:m7 Ab:7 | D:m7 | G:7 | C:maj7 A:7 | D:m7 G:7', bpm: 100 }, b: [
      '<b>Comp</b>: shells, two a bar; each ii–V is a half step or a whole step lower than the last.',
      '<b>Solo</b>: treat every ii–V as its own key. Guide tones first: the 3rd of each chord on its first beat.',
    ] },
    { t: 'Major-3rd cycle', s: 'level 9 · Coltrane changes', comp: { chart: 'B:maj7 D:7 | G:maj7 Bb:7 | Eb:maj7 | % | A:m7 D:7 | G:maj7 Bb:7 | Eb:maj7 | %', bpm: 70 }, b: [
      '<b>Comp</b>: find the three tonics (B, G, E♭) first, then add each V7.',
      '<b>Solo</b>: 1 – 2 – 3 – 5 in each key (B C♯ D♯ F♯, G A B D, E♭ F G B♭), switching exactly on the chord. Slow is fine.',
    ] },
    { t: 'Modal', s: 'level 9 · “So What” form, half size', comp: { chart: 'D:m11 | % | % | % | Eb:m11 | % | % | %', bpm: 120 }, b: [
      '<b>Comp</b>: So What voicings (stacks of 4ths) moving up and down D Dorian, then the same a half step up.',
      '<b>Solo</b>: D Dorian, then E♭ Dorian. Make the jump on bar 5 obvious: play E♭ Dorian’s B♭ and E♭ right away.',
    ] },
    { t: 'Ballad: rich colours', s: 'level 10 · tensions on top', comp: { chart: 'C:maj9 | A:7b9 | D:m9 | G:13b9 | E:m7 | A:7alt | D:m9 | Db:7#11', bpm: 60 }, b: [
      '<b>Comp</b>: rootless voicings with the colour tone on top: the 9 on Cmaj9, the ♭9 on A7, the 9 on Dm9, the 13 on G13♭9, the ♯11 on D♭7.',
      '<b>Solo</b>: aim for the same tensions. Half-whole on G13♭9, altered on A7alt, Lydian dominant on D♭7♯11. Leave lots of space.',
    ] },
  ],
});
