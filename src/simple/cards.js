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
      { t: 'iv7 (m9, m6)', s: 'from Aeolian', chord: 'F:m7', b: [
        'The “sad IV”. Its ♭3 is the key’s ♭6 (A♭), which falls a half step to the 5th (G) as it goes home.',
        '<b>Function</b>: predominant: a darker IV, going to I or on to V.',
        '- Play F Dorian over it: Aeolian’s notes on its 4th degree (the 2nd mode of E♭ major)',
        '- Fm6 has the same notes as Dø7, so iv6 and iiø7 are one sound',
      ], eg: 'In C: Fm7, Fm6, Fm9', ex: [
        ['IV → iv → I: the inner voice falls A → A♭ → G', 'C:maj7 F:maj7 F:m6 C:maj7'],
        ['I – III – IV – iv: “Creep”', 'C:maj E:maj F:maj F:min'],
        ['I – I7 – IV – iv – I: a move all over the standards', 'C:maj7 C:9 F:maj7 F:m6 C:maj7'],
        ['Over a tonic pedal: Fm/C – C, the minor plagal “amen”', 'C:maj F:min/5 C:maj'],
      ] },
      { t: '♭VImaj7♯11', s: 'from Aeolian', chord: 'Ab:maj7#11', b: [
        'The lush, cinematic one: a major chord a major 3rd below home, sharing only C with it.',
        '<b>Function</b>: predominant (on to V, ♭VII or iv), or a soft deceptive landing in place of I.',
        '- Its ♯11 is the key’s own 2nd (D), so it sits easily',
        '- Play Lydian over it: Aeolian’s notes on ♭6 are A♭ Lydian',
      ], eg: 'In C: A♭maj7♯11', ex: [
        ['I – ♭VI – ♭VII – I: the heroic ending, rising by whole steps into home', 'C:maj7 Ab:maj7#11 Bb:9 C:maj7'],
        ['♭VI – V – I: A♭ falls to G, E♭ to D. The minor-key approach used in major', 'C:maj7 Ab:maj7 G:7 C:maj7'],
        ['The deceptive cadence: you expect C after G7 and get A♭', 'D:m7 G:7 Ab:maj7#11'],
        ['I – ♭VI as a two-chord vamp: the film-score shimmer', 'C:maj7 Ab:maj7#11 C:maj7 Ab:maj7#11'],
      ] },
      { t: '♭VI7 (7♯11)', s: 'from Aeolian, made a dominant', chord: 'Ab:7#11', b: [
        'The ♭6 with a ♭7 added: a dominant that doesn’t pull (see that deck). Its G♭ is really F♯, the leading tone to G.',
        '<b>Function</b>: a dominant that doesn’t pull: into V (the German 6th) or straight to I.',
        '- Lydian dominant over it (E♭ melodic minor)',
      ], eg: 'In C: A♭7♯11', ex: [
        ['♭VI7 → V → I: the German 6th, and the tritone sub of D7', 'C:maj7 Ab:7#11 G:7 C:maj7'],
        ['I – vi – ♭VI7 – V: a turnaround where the bass walks down C, A, A♭, G', 'C:maj7 A:m7 Ab:7#11 G:7 C:maj7'],
        ['♭VI7 – ♭VII7 – I: the darker backdoor, rising by whole steps', 'Ab:7#11 Bb:9 C:maj7'],
      ] },
      { t: '♭VII7 (9, 13, ♯11)', s: 'from Aeolian: the backdoor dominant', chord: 'Bb:9', b: [
        'Steps up a whole tone to I instead of falling a 5th. Its ♭7 (A♭) falls to G and its 3rd (D) moves to C or E.',
        '<b>Function</b>: dominant: it does V’s job, from a whole step below.',
        '- Mixolydian (rootsy) or Lydian dominant (floaty) over it',
      ], eg: 'In C: B♭7 → C', ex: [
        ['iv7 – ♭VII7 – I: the backdoor ii–V, as in “Lady Bird”', 'F:m7 Bb:9 C:maj7'],
        ['IV – iv7 – ♭VII7 – I: one inner voice sinks A → A♭ → G', 'F:maj7 F:m7 Bb:9 C:maj7'],
        ['I – ♭VII7 – I: a soft dominant for a vamp or a final cadence', 'C:maj7 Bb:13 C:maj7'],
      ] },
      { t: '♭VIImaj7♯11', s: 'from Mixolydian', chord: 'Bb:maj7#11', b: [
        'The rock ♭VII, made lush. Mixolydian’s notes on ♭7 are a Lydian scale, hence the ♯11.',
        '<b>Function</b>: a soft dominant substitute (♭VII → I), or a colour chord in a vamp.',
        '- No leading tone anywhere, so the cadence lands softly',
      ], eg: 'In C: B♭maj7♯11', ex: [
        ['♭VII – IV – I: the classic rock cadence', 'Bb:maj F:maj C:maj'],
        ['I – ♭VII – IV – I: the coda of “Hey Jude”', 'C:maj Bb:maj F:maj C:maj'],
        ['I – ♭VII vamp: Mixolydian, as in “Norwegian Wood”', 'C:maj Bb:maj C:maj Bb:maj'],
        ['♭VIImaj7 → Imaj7: planing up a whole step, jazz style', 'Bb:maj7#11 C:maj7'],
      ] },
      { t: '♭IIImaj7 (9, 13)', s: 'from Aeolian', chord: 'Eb:maj7', b: [
        'The relative major of the parallel minor. Bright but foreign: it swaps E for E♭.',
        '<b>Function</b>: a tonic substitute (the parallel minor’s relative major) that usually moves on to iv, ♭VI or ii.',
        '- Play E♭ major (Ionian) over it',
      ], eg: 'In C: E♭maj7', ex: [
        ['I – ♭III – IV: the rock riff move (“Smoke on the Water”)', 'C:maj Eb:maj F:maj'],
        ['I – ♭III – ♭VI – V: all three borrowed notes, then home', 'C:maj7 Eb:maj7 Ab:maj7 G:7 C:maj7'],
        ['Reached by its own ii–V, a quick trip to E♭ and back', 'C:maj7 F:m7 Bb:7 Eb:maj7 D:m7 G:7 C:maj7'],
      ] },
      { t: 'iiø7 (♭9, 11, ♭13)', s: 'from Aeolian', chord: 'D:m7b5', b: [
        'The minor ii, used in a major key. Its ♭5 is the key’s ♭6 (A♭), which falls to G in the V chord.',
        '<b>Function</b>: predominant, into V7 (often V7♭9).',
        '- Locrian over it, or Locrian ♮2 for a sweeter 9',
        '- Same notes as Fm6: borrowed iv6 with D in the bass',
      ], eg: 'In C: Dm7♭5', ex: [
        ['iiø7 – V7♭9 – Imaj7: a minor ii–V landing on major', 'D:m7b5 G:7b9 C:maj7'],
        ['ii – iiø – V – I: the 5th of the ii sinks A → A♭ → G', 'D:m7 D:m7b5 G:7b9 C:maj7'],
        ['The same sound as iv6: Fm6 – G7 – C', 'F:m6 G:7 C:maj7'],
      ] },
      { t: 'i7 or i6', s: 'from Aeolian (m7) or Dorian (m6)', chord: 'C:m6', b: [
        'The tonic turned minor: E → E♭. The most direct darkening there is.',
        '<b>Function</b>: tonic, darkened.',
        '- m6 has Dorian’s major 6th: the film-noir ending',
        '- i7 is also the ii of ♭VII, so it can open a door to a new key',
      ], eg: 'In C: Cm7, Cm6', ex: [
        ['I – i6 – I: a shadow passing over home', 'C:maj7 C:m6 C:maj7'],
        ['i7 as a pivot: Cm7 – F7 is a ii–V to B♭', 'C:maj7 C:m7 F:7 Bb:maj7'],
        ['Same root, new mood: I – IV, then i – iv', 'C:maj7 F:maj7 C:m7 F:m7'],
      ] },
      { t: 'v7 (m9)', s: 'from Mixolydian', chord: 'G:m7', b: [
        'The dominant without its leading tone (B♭ instead of B): no pull at all.',
        '<b>Function</b>: a weak dominant, or the ii of IV (Gm7 – C7 – F).',
        '- Dorian over it (Mixolydian’s notes on its 5th)',
      ], eg: 'In C: Gm7', ex: [
        ['v7 – I7 – IV: a ii–V into IV', 'C:maj7 G:m7 C:7 F:maj7'],
        ['I – v – IV – I: the folk/modal soft dominant', 'C:maj G:m7 F:maj C:maj'],
        ['v in place of V: a cadence with no leading tone lands softly', 'F:maj7 G:m9 C:maj7'],
      ] },
      { t: 'II7 (9, 13)', s: 'from Lydian', chord: 'D:9', b: [
        'Lydian’s ♯4 (F♯) becomes the 3rd of II. Going to V, it’s a secondary dominant; going anywhere else, it’s pure Lydian colour.',
        '- Mixolydian over it (Lydian’s notes on its 2nd)',
      ], eg: 'In C: D7', ex: [
        ['I – II7 – IV – I: “Eight Days a Week”', 'C:maj D:7 F:maj C:maj'],
        ['C – D/C: the Lydian vamp itself (F♯ is the ♯4 of C)', 'C:maj7 D:maj/b7 C:maj7 D:maj/b7'],
        ['II7 – ii7 – V7 – I: the 3rd sinks F♯ → F', 'C:maj7 D:9 D:m7 G:7 C:maj7'],
      ] },
      { t: '♭IImaj7♯11', s: 'from Phrygian: the Neapolitan', chord: 'Db:maj7#11', b: [
        'A half step above home. It slides down to I like a tritone sub without the tritone.',
        '<b>Function</b>: a dominant substitute: it slides down to I like ♭II7.',
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
      { t: 'm(maj7)', s: '1st mode: melodic minor', chord: 'C:mMaj7', b: [
        'The minor tonic with a major 7th: dark and suspended.',
        '<b>Built</b>: a minor triad (C E♭ G) with a major 7th (B) on top. The ♭3, 5 and 7 form an augmented triad (E♭ G B), which is where the tension comes from.',
        '<b>Function</b>: the minor tonic (i). Its B is a leading tone that doesn’t need to resolve.',
        '- i(maj7) as a home chord, especially at the end',
        '- The line cliché: i – i(maj7) – i7 – i6',
        '- Scale: melodic minor on the same root',
      ], eg: 'In C minor: Cm(maj7)', play: 'D:m7b5 G:7alt C:mMaj7' },
      { t: '7♯11', s: '4th mode: Lydian dominant', chord: 'D:7#11', b: [
        'The dominant that floats. Use it on any dominant that doesn’t pull, and on tritone subs.',
        '<b>Built</b>: a dominant 7th (D F♯ A C) with the 9 (E) and ♯11 (G♯). The ♯11 is a tritone above the root, so the chord holds two tritones: D–G♯ and F♯–C.',
        '<b>Function</b>: here D7 is II7 in C: it colours the I instead of pulling on to G.',
        '- Scale: melodic minor a 5th above the root',
      ], eg: 'D7♯11 uses A melodic minor', play: 'C:maj7 D:7#11 C:maj7' },
      { t: '7alt', s: '7th mode: altered', chord: 'G:7alt', b: [
        'Every tension altered: ♭9, ♯9, ♯11, ♭13. For any V7 that resolves, especially to minor.',
        '<b>Built</b>: the dominant’s core (root, 3rd, ♭7: G B F; B–F is the tritone that pulls) plus all four altered tensions: ♭9 A♭, ♯9 A♯ (= B♭), ♯11 C♯ (= D♭), ♭13 E♭. No 5th, and no natural 9 or 13.',
        '<b>Function</b>: a dominant (V7). Each altered note sits a half step from the next chord: A♭ → G, C♯ (D♭) → C, and E♭ holds as the 3rd of Cm.',
        '- Scale: melodic minor a half step above the root',
        '- G7alt is A♭ melodic minor, the same notes as D♭7♯11 (its tritone sub)',
      ], eg: 'G7alt → Cm', play: 'D:m7b5 G:7alt C:m6' },
      { t: 'ø9', s: '6th mode: Locrian ♮2', chord: 'D:m7b5', b: [
        'A sweeter iiø: plain Locrian has a ♭9, this has a natural 9.',
        '<b>Built</b>: a ø7 (D F A♭ C: a diminished triad with a ♭7) plus the natural 9 (E). The 9 is what melodic minor adds; plain Locrian would give E♭.',
        '<b>Function</b>: predominant: the ii of a minor ii–V–i. Its ♭5 (A♭) falls to G in the V.',
        '- The ii of a minor ii–V–i',
        '- Scale: melodic minor a minor 3rd above the root',
      ], eg: 'Dø9 uses F melodic minor', play: 'D:m7b5 G:7b9 C:m6' },
      { t: 'maj7♯5', s: '3rd mode: Lydian augmented', chord: 'Eb:maj7#5', b: [
        'Bright, unstable, glassy. In a minor key it’s ♭III+, straight from melodic minor.',
        '<b>Built</b>: an augmented triad (two major 3rds: E♭ G B) plus a major 7th (D).',
        '<b>Function</b>: ♭III+ in a minor key, moving on to iv or ii; or a tense Imaj7. In C minor its ♯5 (B) is the leading tone and rises to C.',
        '- Also a tense Imaj7 that wants to settle',
        '- Scale: melodic minor a minor 3rd below the root',
      ], eg: 'In C minor: E♭maj7♯5', play: 'C:mMaj7 Eb:maj7#5 F:m7 G:7alt C:m6' },
      { t: '7♭13', s: '5th mode: Mixolydian ♭6', chord: 'G:7b13', b: [
        'A V7 going to minor, with a natural 9 and a ♭13. Darker than Mixolydian, softer than altered.',
        '<b>Built</b>: a dominant 7th (G B D F) plus the ♭13 (E♭), a half step above the 5th. The 9 stays natural (A).',
        '<b>Function</b>: a dominant (V7) into minor: the ♭13 is the tonic’s ♭3, so it holds into Cm.',
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
        '<b>Spot one</b>: a dominant 7th on any degree but the 5th. Its giveaway is a note from outside the key. Usually that’s the 3rd (C♯, D♯, F♯, G♯), the target’s leading tone, which rises to the target’s root. For I7 it’s the ♭7 (B♭), which falls to the target’s 3rd.',
      ], eg: 'In C: A7, B7, C7, D7, E7', ex: [
        ['A7 → Dm7, then E7 → Am7, then D7 → G7', 'C:maj7 A:7 D:m7 E:7 A:m7 D:7 G:7 C:maj7'],
        ['C7 → F: the one whose new note falls', 'C:maj7 C:7 F:maj7'],
      ] },
      { t: 'Which chords get one', s: 'in major and in minor', b: [
        '<b>Major</b> has five: of ii, iii, IV, V and vi. The I already has the real V7, and vii° can’t be a target: a diminished chord can’t feel like home.',
        '<b>Minor</b> has five too. In A minor:',
        '- V7/III = G7 (→ C), V7/iv = A7 (→ Dm), V7/V = B7 (→ E)',
        '- V7/VI = C7 (→ F), V7/♭VII = D7 (→ G)',
        'G7 → C is just ♭VII7 → III: the minor key’s trip to its relative major.',
      ], ex: [
        ['In A minor: i – V7/iv – iv', 'A:m7 A:7 D:m7 E:7b9 A:m7'],
        ['In A minor: V7/III → III, the relative major', 'A:m7 D:m7 G:7 C:maj7'],
        ['In A minor: V7/V → V7 → i', 'A:m7 B:7 E:7 A:m7'],
      ] },
      { t: 'Which tensions?', s: 'it depends on the target', b: [
        '- Going to a <b>minor</b> chord: 7♭9, ♭13 (Phrygian dominant, from the target’s harmonic minor)',
        '- Going to a <b>major</b> chord: 9, 13 (Mixolydian)',
        'The target’s key decides the scale.',
        '<b>The pro shortcut</b>: take the tensions from the key you’re in. In C:',
        '- A7: 9 (B), ♭13 (F); ♭9 (B♭) for the darker pull into Dm',
        '- B7: ♭9 (C), ♭13 (G)',
        '- C7 and D7: 9 and 13 (D, A; E, B)',
        '- E7: ♭9 (F), ♯9 (G), ♭13 (C): all three are C-major notes',
      ], ex: [
        ['Into minor targets: A7♭9 → Dm7, E7♭9 → Am7', 'C:maj7 A:7b9 D:m7 E:7b9 A:m7'],
        ['Into major targets: C9 → F, D13 → G', 'C:maj7 C:9 F:maj7 D:13 G:13 C:maj7'],
        ['E7 with the key’s own tensions (♯9 ♭13) → Am', 'C:maj7 E:7#9b13 A:m7'],
      ] },
      { t: 'V7/ii', s: 'VI7', chord: 'A:7b9', b: [
        'C♯, its 3rd, leads up to D. Its ♭9 (B♭) falls to A, the 5th of Dm, and its 7th (G) falls to F, Dm’s 3rd.',
        '- I – VI7 – ii – V: the most common turnaround in jazz, and bars 1–2 of rhythm changes',
        '- Swap it for C♯°7 (A7♭9 without the A) or E♭7 (its tritone sub)',
        '- It can be a whole bar or just beat 3 of the I bar',
      ], eg: 'In C: A7♭9 → Dm7', ex: [
        ['I – VI7 – ii – V', 'C:maj7 A:7b9 D:m7 G:7 C:maj7'],
        ['iii – VI7 – ii – V', 'E:m7 A:7b9 D:m7 G:7 C:maj7'],
        ['With its own ii: Eø7 – A7♭9 – Dm7', 'E:m7b5 A:7b9 D:m7'],
        ['C♯°7 in place of A7: the bass climbs C – C♯ – D', 'C:maj7 C#:dim7 D:m7 G:7 C:maj7'],
        ['E♭7, its tritone sub: the bass falls E – E♭ – D', 'E:m7 Eb:7#11 D:m7 G:7 C:maj7'],
      ] },
      { t: 'V7/iii', s: 'VII7', chord: 'B:7b9', b: [
        'The most outside-sounding one: D♯ and F♯ are both foreign to C.',
        'Its root (B) is in the key, so the bass doesn’t leave home; only the harmony above does.',
        '- Its ♭9 is C, the tonic: hold C on top as the chord changes under it',
        '- Since iii is a weak target, it usually keeps going: VII7 – iii – VI7 – ii – V – I',
        '- In a minor key it’s simply V7/V (B7 → E7 → Am)',
      ], eg: 'In C: B7♭9 → Em7', ex: [
        ['B7♭9 → Em7', 'C:maj7 B:7b9 E:m7'],
        ['With its own ii: F♯ø7 – B7♭9 – Em7', 'F#:m7b5 B:7b9 E:m7'],
        ['VII7 – iii – VI7 – ii – V – I: the long way home', 'B:7b9 E:m7 A:7 D:m7 G:7 C:maj7'],
        ['IV – VII7 – iii – vi', 'F:maj7 B:7b9 E:m7 A:m7'],
      ] },
      { t: 'V7/IV', s: 'I7', chord: 'C:9', b: [
        'The tonic grows a ♭7, and B♭ leads down to A.',
        '- Bar 4 of the blues',
        '<b>Special</b>: it’s the I chord with one note changed (B → B♭). That makes it the easiest way to leave home for IV.',
        '- Its ii is the borrowed v (Gm7): Gm7 – C7 – F',
        '- Gospel gives it a ♯9 or ♭9 for grit',
        '- Watch the melody: a B in the tune clashes with C7’s B♭',
      ], eg: 'In C: C7 → Fmaj7', ex: [
        ['C – C9 – F', 'C:maj7 C:9 F:maj7'],
        ['With its own ii (the borrowed v): Gm7 – C7 – F', 'G:m7 C:7 F:maj7'],
        ['I – I7 – IV – iv – I', 'C:maj7 C:9 F:maj7 F:m6 C:maj7'],
        ['With the 3rd in the bass: C – C7/E – F', 'C:maj C:7/3 F:maj'],
        ['Gospel grit: C – C7♯9 – F9', 'C:6/9 C:7#9 F:9'],
      ] },
      { t: 'V7/V', s: 'II7', chord: 'D:9', b: [
        'F♯ leads up to G.',
        '- II7 – V7 – I',
        'The most common one of all: the classical “V of V” before almost every big cadence.',
        '<b>Special</b>: it can go to ii instead of V. The 3rd sinks F♯ → F and you get ii – V – I, a delayed resolution. In jazz tunes, II7 often holds for two bars before that happens.',
        '- In first inversion (D7/F♯) the bass climbs F – F♯ – G: IV – II7/3 – V',
      ], eg: 'In C: D9 → G7 → C', ex: [
        ['II7 – V7 – I', 'C:maj7 D:9 G:13 C:maj7'],
        ['With its own ii: Am7 – D7 – G7 – C', 'A:m7 D:9 G:7 C:maj7'],
        ['Two bars of II7, then ii – V: F♯ sinks to F', 'C:maj7 C:maj7 D:9 D:9 D:m7 G:7 C:maj7'],
        ['IV – II7/F♯ – V: the bass climbs a half step at a time', 'F:maj D:7/3 G:7 C:maj'],
      ] },
      { t: 'V7/vi', s: 'III7', chord: 'E:7b9', b: [
        'G♯ leads up to A.',
        '- “All of Me” is the textbook: I – III7 – VI7 – ii',
        '<b>Pop’s favourite</b>: IV – III7 – vi (F – E7 – Am). The G♯ makes the vi feel like an arrival.',
        '- All its altered tensions are in the key (♭9 F, ♯9 G, ♭13 C), so E7♭9, E7♯9 and E7alt all sound natural here',
        '- Deceptive: E7 can go to F instead of Am, and the G♯ still rises, to A',
      ], eg: 'In C: E7♭9 → Am7', ex: [
        ['E7♭9 → Am7', 'C:maj7 E:7b9 A:m7'],
        ['The “All of Me” shape: I – III7 – VI7 – ii', 'C:6 E:7 A:7 D:m7'],
        ['With its own ii: Bø7 – E7♭9 – Am', 'B:m7b5 E:7b9 A:m7'],
        ['IV – III7 – vi', 'F:maj7 E:7b9 A:m7 A:m7'],
        ['Deceptive: E7 → F instead of Am', 'C:maj7 E:7b9 F:maj7'],
      ] },
      { t: 'The rules', s: 'how they behave', b: [
        '- <b>The 3rd rises</b> a half step to the target’s root (C♯ → D)',
        '- <b>The 7th falls</b> a step to the target’s 3rd (G → F)',
        '- <b>Harmonic rhythm</b>: the dominant goes on a weak beat or the second half of the bar, and the target lands on the downbeat',
        '- <b>Check the melody</b>: if the tune holds the note the dominant raises (C while you play A7), you get a ♯9. Make that A7♯9 on purpose, or stay diatonic (Am7)',
        '- <b>Don’t stack too many</b>: one or two in a phrase sound like colour; one on every chord sounds like a new key',
      ], ex: [
        ['The two moving voices: A7 → Dm', '=A2 G3 C#4 | D3 F3 D4', 'A7 → Dm'],
        ['The same two voices, E7 → Am', '=E2 D3 G#3 | A2 C3 A3', 'E7 → Am'],
      ] },
      { t: 'Add its ii', s: 'the related ii', b: [
        'Put a ii in front of a secondary dominant and you get a ii–V into that chord.',
        '- Before major: iim7 – V7 (Am7 – D7 → G)',
        '- Before minor: iiø7 – V7♭9 (Bø7 – E7♭9 → Am)',
        'Each pair is a short trip to another key. Solo over Eø7 – A7♭9 as “a bar of D minor”, and over Am7 – D7 as “a bar of G”.',
        '- Often the ii is already there: in C – Em7 – A7 – Dm7, the Em7 becomes Eø7 or stays',
      ], ex: [
        ['Into Am: Bø7 – E7♭9 – Am7, then home', 'B:m7b5 E:7b9 A:m7 D:m7 G:7 C:maj7'],
        ['Into G: Am7 – D7 – G7 – C', 'C:maj7 A:m7 D:7 G:7 C:maj7'],
        ['Into F: Gm7 – C7 – Fmaj7', 'C:maj7 G:m7 C:7 F:maj7'],
        ['Into Em: F♯ø7 – B7♭9 – Em7', 'C:maj7 F#:m7b5 B:7b9 E:m7'],
      ] },
      { t: 'Deceptive resolutions', s: 'when they don’t land where expected', b: [
        'A secondary dominant can surprise. The leading tone still resolves, just inside a different chord:',
        '- <b>E7 → F</b> (V/vi → IV): G♯ rises to A, the 3rd of F',
        '- <b>A7 → B♭</b> (V/ii → ♭VII): C♯ rises to D, the 3rd of B♭',
        '- <b>D7 → Dm7</b> (V/V → ii): the 3rd sinks instead and the ii–V carries on',
        '- <b>E7 → A7 → D7</b>: one dominant into another (next card)',
      ], ex: [
        ['E7 → Fmaj7', 'C:maj7 E:7b9 F:maj7 G:7 C:maj7'],
        ['A7 → B♭maj7 → C', 'C:maj7 A:7b9 Bb:maj7 C:maj7'],
        ['D7 → Dm7 – G7 – C', 'C:maj7 D:7 D:m7 G:7 C:maj7'],
      ] },
      { t: 'Extended dominants', s: 'dominants into dominants', b: [
        'III7 – VI7 – II7 – V7 – I: each one resolves to another dominant, roots falling in 5ths, so nothing settles until I.',
        '- “Sweet Georgia Brown”, and the bridge of rhythm changes',
        '- The ragtime progression: I – III7 – VI7 – II7 – V7 – I',
        '- Start anywhere in the chain: VI7 – II7 – V7 – I is just the last three links',
        '- Put the ii in front of any of them: E7 – Em7 A7 – Am7 D7 – Dm7 G7 – C',
      ], eg: 'In C: E7 – A7 – D7 – G7 – C', ex: [
        ['III7 – VI7 – II7 – V7 – I', 'E:7 A:7 D:7 G:7 C:maj7'],
        ['The ragtime progression', 'C:maj E:7 A:7 D:7 G:7 C:maj'],
        ['VI7 – II7 – V7 – I, one chord a bar, two bars each', 'A:7 A:7 D:7 D:7 G:7 G:7 C:maj7 C:maj7'],
        ['With each ii added', 'B:m7 E:7 E:m7 A:7 A:m7 D:7 D:m7 G:7 C:maj7'],
        ['With every other one tritone-subbed', 'E:7 Eb:7#11 D:7 Db:7#11 C:maj7'],
      ] },
      { t: 'The guide-tone chain', s: 'why extended dominants sound smooth', b: [
        'Between two dominants a 5th apart, <b>both</b> guide tones fall a half step at once. The 3rd becomes the next chord’s 7th, and the 7th becomes the next 3rd:',
        '- E7 (G♯, D) → A7 (G, C♯)',
        '- → D7 (F♯, C) → G7 (F, B)',
        '- → Cmaj7 (E, B): into a major I the 7th falls and the 3rd holds',
        '<b>On the guitar</b>: D on the G string (7th fret) and G♯ on the B string (9th fret). Then move both down one fret per chord: 6/8, 5/7, 4/6. It’s one tritone shape sliding down the neck.',
        '- Add the root on the low strings and you have shell voicings, a complete comping part',
        '- As a solo line, play one voice: G♯ – G – F♯ – F – E, one note per chord, on the downbeat',
        'In a ii–V–I it’s different: one voice holds while the other falls (Dm7 F C → G7 F B → Cmaj7 E B).',
      ], ex: [
        ['Just the guide tones, one fret at a time', '=D4 G#4 | C#4 G4 | C4 F#4 | B3 F4 | B3 E4', 'E7 · A7 · D7 · G7 · Cmaj7'],
        ['With the roots: shells', '=E2 D4 G#4 | A2 C#4 G4 | D3 C4 F#4 | G2 B3 F4 | C3 B3 E4', 'E7 · A7 · D7 · G7 · Cmaj7'],
        ['ii – V – I: one holds, one falls', '=D3 C4 F4 | G2 B3 F4 | C3 B3 E4', 'Dm7 · G7 · Cmaj7'],
        ['The whole chain, full chords', 'E:7 A:7 D:7 G:7 C:maj7'],
      ] },
      { t: 'Their °7s', s: 'the leading-tone version', b: [
        'Every secondary dominant has a °7 that does the same job: its 3rd, 5th, 7th and ♭9, built a half step below the target.',
        '- C♯°7 → Dm, D♯°7 → Em, E°7 → F, F♯°7 → G, G♯°7 → Am',
        'Use the °7 when you want the bass to climb by half steps (C – C♯ – D), the dominant when you want it to fall in 5ths.',
      ], ex: [
        ['C – C♯°7 – Dm7 – D♯°7 – Em7', 'C:maj7 C#:dim7 D:m7 D#:dim7 E:m7'],
        ['F – F♯°7 – C/G: the gospel climb', 'F:maj7 F#:dim7 C:maj/5 G:7 C:maj7'],
        ['G7 – G♯°7 – Am7: the bass climbs G – G♯ – A', 'C:maj7 G:7 G#:dim7 A:m7'],
      ] },
      { t: 'Soloing over them', s: 'change one note', b: [
        'Keep playing the key, and change the note the chord changes. In C:',
        '- <b>A7</b>: C → C♯ (D harmonic minor from A)',
        '- <b>B7</b>: D → D♯ and F → F♯ (E harmonic minor from B)',
        '- <b>C7</b>: B → B♭ (F major)',
        '- <b>D7</b>: F → F♯ (G major)',
        '- <b>E7</b>: G → G♯ (A harmonic minor from E)',
        'Land the changed note on the chord, then resolve it on the target: C♯ → D, G♯ → A, B♭ → A.',
      ], ex: [
        ['The changed note, resolving: C♯ over A7 → D over Dm', '=A2 G3 C#4 E4 | E5 | C#5 | D3 F3 A3 | D5', 'A7 → Dm'],
        ['G♯ over E7 → A over Am', '=E2 D3 G#3 B3 | B4 | G#4 | A2 E3 C4 | A4', 'E7 → Am'],
      ] },
      { t: 'Killer examples', s: 'where you’ll hear them', b: [
        '- <b>“All of Me”</b>: I – III7 – VI7 – ii, two bars each',
        '- <b>Rhythm changes bridge</b>: III7 – VI7 – II7 – V7, two bars each',
        '- <b>“Sweet Georgia Brown”</b>: VI7 – II7 – V7 – I, four bars each',
        '- <b>“Take the A Train”</b>: I – II7 – ii – V, the II7 held for two bars',
        '- <b>The blues</b>: I7 in bar 4 is V7/IV',
        '- <b>Pop ballads</b>: IV – III7 – vi',
      ], ex: [
        ['“All of Me” shape', 'C:6 C:6 E:7 E:7 A:7 A:7 D:m7 D:m7'],
        ['Rhythm changes bridge', 'E:7 E:7 A:7 A:7 D:7 D:7 G:7 G:7'],
        ['“Sweet Georgia Brown” shape', 'A:7 D:7 G:7 C:maj7'],
        ['“Take the A Train” shape', 'C:6 C:6 D:7#11 D:7#11 D:m7 G:7 C:6'],
        ['IV – III7 – vi', 'F:maj7 E:7 A:m7'],
      ] },
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
      { t: '♭II7 → I', s: 'subs for V7', chord: 'Db:7#11', b: ['<b>Function</b>: dominant of I, standing in for G7. Its 3rd and 7th (F, C♭) are G7’s 7th and 3rd (F, B), and its ♯11 (G) is G7’s root.'], eg: 'In C: D♭7 → C', play: 'D:m7 Db:7#11 C:maj7' },
      { t: '♭III7 → ii', s: 'subs for V7/ii (VI7)', chord: 'Eb:7#11', b: ['<b>Function</b>: dominant of Dm7, standing in for A7 (VI7). It shares A7’s 3rd and 7th (G and D♭ = C♯), and its ♯11 (A) is A7’s root.'], eg: 'In C: E♭7 → Dm7', play: 'C:maj7 Eb:7#11 D:m7' },
      { t: '♭VI7 → V', s: 'subs for V7/V (II7)', chord: 'Ab:7#11', b: ['<b>Function</b>: dominant of G7, standing in for D7 (II7). It shares D7’s 3rd and 7th (C and G♭ = F♯), and its ♯11 (D) is D7’s root.'], eg: 'In C: A♭7 → G7', play: 'C:maj7 Ab:7#11 G:7 C:maj7' },
      { t: '♭VII7 → vi', s: 'subs for V7/vi (III7)', chord: 'Bb:7#11', b: [
        'The same chord as the backdoor dominant, but a different job: the backdoor goes up to I, this one goes down to vi.',
        '<b>Function</b>: dominant of Am7, standing in for E7 (III7). It shares E7’s 3rd and 7th (D and A♭ = G♯), and its ♯11 (E) is E7’s root.',
      ], eg: 'In C: B♭7 → Am7', play: 'C:maj7 Bb:7#11 A:m7' },
      { t: 'IV7 → iii', s: 'subs for V7/iii (VII7)', chord: 'F:7#11', b: ['<b>Function</b>: dominant of Em7, standing in for B7 (VII7). It shares B7’s 3rd and 7th (A and E♭ = D♯), and its ♯11 (B) is B7’s root.'], eg: 'In C: F7 → Em7', play: 'C:maj7 F:7#11 E:m7' },
      { t: '♭V7 → IV', s: 'subs for V7/IV (I7)', chord: 'Gb:7#11', b: ['<b>Function</b>: dominant of Fmaj7, standing in for C7 (I7). It shares C7’s 3rd and 7th (B♭ and F♭ = E), and its ♯11 (C) is C7’s root.'], eg: 'In C: G♭7 → Fmaj7', play: 'C:maj7 Gb:7#11 F:maj7' },
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
      { t: 'A °7 is a rootless 7♭9', s: 'the core idea · examples in G', chord: 'B:dim7', b: [
        'Take G7♭9 (G B D F A♭) and drop the root: B D F A♭ is <b>B°7</b>. So a °7 can stand in for a dominant, but specifically a 7♭9, not a plain 7.',
        'That’s why it pulls so hard: it has the dominant’s 3rd (the leading tone) and 7th, plus the ♭9.',
      ], ex: [['G7♭9 → C, then B°7 → C: the same pull', 'G:7b9 C:maj7 B:dim7 C:maj7']] },
      { t: 'Finding it', s: 'from any dominant', b: [
        'Build the °7 on the dominant’s <b>3rd</b>, or a <b>half step above its root</b>. Both give the same chord.',
        '- G7 → B°7 (on the 3rd) = A♭°7 (a half step above G)',
        '- D7 → F♯°7 = E♭°7',
        '- E7 → G♯°7 = F°7',
      ], ex: [['D7 → G, then F♯°7 → G', 'D:7 G:maj7 F#:dim7 G:maj7']] },
      { t: 'Only three exist', s: 'symmetry', b: [
        'A °7 is stacked minor 3rds, so any of its notes can be the root: B°7 = D°7 = F°7 = A♭°7. There are only three different °7 chords.',
        '- On guitar, slide any °7 shape 3 frets and it’s the same chord in a new voicing',
      ], ex: [['One grip at frets 3, 6, 9 and 12: the same four notes each time', '=F3 B3 D4 G#4 | Ab3 D4 F4 B4 | B3 F4 Ab4 D5 | D4 Ab4 B4 F5', 'B°7, four voicings']] },
      { t: 'One °7, four dominants', s: 'the flip side', b: [
        'Put a root a major 3rd below any of its notes and you get a 7♭9. So B°7 is rootless G7♭9, B♭7♭9, D♭7♭9 or E7♭9.',
        'The bass and the next chord decide which one you hear.',
      ], ex: [
        ['B°7 → C (as G7♭9)', 'B:dim7 C:maj7'],
        ['B°7 → Am (as E7♭9)', 'B:dim7 A:m7'],
        ['B°7 → E♭ (as B♭7♭9)', 'B:dim7 Eb:maj7'],
        ['B°7 → G♭ (as D♭7♭9)', 'B:dim7 Gb:maj7'],
      ] },
      { t: 'The dominants of G, swapped', s: 'every secondary dominant has its °7', b: [
        '- D7 (V → G): F♯°7',
        '- E7 (→ Am): G♯°7',
        '- A7 (→ D): C♯°7',
        '- B7 (→ Em): D♯°7',
        '- G7 (→ C): B°7',
        '- F♯7 (→ Bm): A♯°7 (rarer)',
      ], ex: [
        ['G – G♯°7 – Am7 (E7♭9 in disguise)', 'G:maj7 G#:dim7 A:m7'],
        ['C – C♯°7 – D (A7♭9 in disguise)', 'C:maj7 C#:dim7 D:7'],
        ['D – D♯°7 – Em (B7♭9 in disguise)', 'D:maj D#:dim7 E:m7'],
      ] },
      { t: 'They collapse to three', s: 'the three °7 families in G', b: [
        '- D7 and B7 share <b>F♯°7</b> (= A°7 = C°7 = D♯°7)',
        '- E7 and G7 share <b>G♯°7</b> (= B°7 = D°7 = F°7)',
        '- A7 and F♯7 share <b>C♯°7</b> (= E°7 = G°7 = B♭°7)',
        'Learn three grips and you have every dominant in the key.',
      ] },
      { t: 'When the swap doesn’t work', s: 'three warnings', b: [
        '- On a <b>non-pulling dominant</b> (G7 as home in a blues) it just sounds unstable',
        '- When the melody is on the <b>natural 9</b> (E over D7), it clashes with the °7’s ♭9 (E♭)',
        '- It sounds most natural <b>resolving to minor</b>. Into a major chord it works, but darker and jazzier',
      ], ex: [['Into minor: G♯°7 → Am', 'G#:dim7 A:m7'], ['Into major: F♯°7 → G, darker', 'F#:dim7 G:maj7']] },
      { t: 'Common-tone diminished', s: 'out and back, no pull', b: [
        'The °7 contains the root of the chord it decorates. You leave and come straight back: a neighbour chord, not a dominant.',
        '- G – A♯°7 – G: A♯ and C♯ rise by step, E falls to D, G holds',
        '- D – G♯°7 – D',
        'It works on major and dominant chords, not on minor ones.',
      ], ex: [['G – A♯°7 – G', 'G:maj A#:dim7 G:maj'], ['D – G♯°7 – D', 'D:maj G#:dim7 D:maj']] },
      { t: 'Descending passing', s: 'a chromatic slide', b: [
        'Between two chords a whole step apart going down, usually on ♭iii: the °7 fills the gap. Common in jazz and Brazilian music.',
      ], eg: 'In G: Bm7 – B♭°7 – Am7 – D7 – G', ex: [['iii – ♭iii°7 – ii – V – I', 'B:m7 Bb:dim7 A:m7 D:7 G:maj7']] },
      { t: '♯iv°7 back to the tonic', s: 'the gospel and stride move', b: [
        'IV – ♯iv°7 – I/5: the bass climbs C – C♯ – D into G over D, usually followed by D7.',
      ], eg: 'In G: C – C♯°7 – G/D – D7 – G', ex: [['C – C♯°7 – G/D – D7 – G', 'C:maj7 C#:dim7 G:maj/5 D:7 G:maj7']] },
      { t: 'A pivot to far keys', s: 'modulation', b: [
        'Any of a °7’s four notes can act as the leading tone, so one chord opens four keys.',
        '- F♯°7 → G',
        '- respelled D♯°7 → Em',
        '- as A°7 → B♭',
        '- as C°7 → D♭',
      ], ex: [
        ['F♯°7 → G', 'F#:dim7 G:maj7'],
        ['the same chord as D♯°7 → Em', 'D#:dim7 E:m7'],
        ['as A°7 → B♭', 'A:dim7 Bb:maj7'],
        ['as C°7 → D♭', 'C:dim7 Db:maj7'],
      ] },
      { t: 'Rule of thumb', s: 'which job is it doing?', b: [
        '- If the next chord is <b>a half step above one of its notes</b>, it’s a dominant (a rootless 7♭9)',
        '- The common rising move G – G♯°7 – Am7 is the dominant swap in disguise (E7♭9)',
        '- If it <b>shares a root</b> with the chords around it, it’s common-tone',
        '- If it <b>slides down by step</b>, it’s passing',
      ] },
      { t: 'The scales', s: 'two sides of one scale', b: [
        '- <b>Whole-half</b> over a °7 heard as its own chord: G♯ A♯ B C♯ D E F G',
        '- <b>Half-whole</b> over the 7♭9 it stands for: E F G G♯ A♯ B C♯ D',
        'Same eight notes; it depends which chord you hear.',
      ] },
      { t: '°7 vs ø7', s: 'don’t mix them up', b: [
        '- <b>°7</b> (diminished 7th): 1 ♭3 ♭5 𝄫7. Symmetrical; a rootless 7♭9, passing or common-tone',
        '- <b>ø7</b> (half-diminished, m7♭5): 1 ♭3 ♭5 ♭7. A real chord: iiø in minor, viiø in major (a rootless 9, not 7♭9)',
        '- Locrian (or Locrian ♮2) over ø7, whole-half over °7',
      ], eg: 'A°7 has G♭ (F♯); Aø7 has G' },
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
      { t: 'V7♯5 / V+', s: 'passing into I', chord: 'G:7#5', b: [
        'The ♯5 (D♯) rises to the 3rd of I (E).',
        '<b>Built</b>: an augmented triad (G B D♯) plus the ♭7 (F).',
        '<b>Function</b>: dominant (V7) into major: B → C, F → E, and D♯ → E.',
        '- Whole-tone or altered scale over it',
      ], eg: 'In C: G7♯5 → C', play: 'D:m7 G:7#5 C:maj7' },
      { t: 'Line clichés', s: 'one voice moving inside a chord', b: [
        '- Major: I – I+ – I6 – I7 (G – G♯ – A – B♭ in C), often into IV',
        '- Minor: i – i(maj7) – i7 – i6 (C – B – B♭ – A in Cm)',
        '- “My Funny Valentine” opens on the minor one',
      ], play: 'C:m C:mMaj7 C:m7 C:m6' },
      { t: 'V7sus4', s: 'IV/V', chord: 'G:7sus4', b: [
        'A soft dominant with no pull. It often goes to V7 and then I, or straight to I.',
        '<b>Built</b>: the 3rd replaced by the 4th: G C D F, which is an F triad over G. With no B there’s no tritone.',
        '<b>Function</b>: a dominant that suspends instead of pulling.',
      ], eg: 'In C: G7sus4 = F/G', play: 'G:7sus4 G:7 C:maj7' },
      { t: 'Picardy third', s: 'a major I in a minor key', b: [
        'End a minor-key piece on a major tonic: sudden light.',
      ], eg: 'In A minor: … E7 → A major', play: 'A:min D:m7 E:7 A:maj' },
      { t: 'IV7 in minor', s: 'from Dorian', chord: 'D:7', b: [
        'Dorian’s major 6th gives the minor key a major IV.',
        '<b>Function</b>: subdominant colour, not a pull to G. Its 3rd (F♯) is Dorian’s major 6th.',
        '- i7 – IV7 vamp: “Oye Como Va”',
      ], eg: 'In A minor: Am7 – D7', play: 'A:m7 D:9 A:m7 D:9' },
      { t: 'V7♭9 in minor', s: 'from harmonic minor', chord: 'E:7b9', b: [
        'The raised 7th (G♯ in A minor) gives the minor key a real dominant.',
        '<b>Built</b>: a dominant 7th (E G♯ B D) plus the ♭9 (F). The top four notes are G♯°7.',
        '<b>Function</b>: dominant of A minor: G♯ → A, D → C, F → E.',
        '- Phrygian dominant over it',
      ], eg: 'In A minor: E7♭9 → Am', play: 'A:m7 B:m7b5 E:7b9 A:m7' },
      { t: 'Augmented sixths', s: '♭VI → V, classical names', b: [
        'In C, going to G. Each has A♭ and F♯, which open out to the G octave:',
        '- Italian: A♭ C F♯',
        '- French: A♭ C D F♯',
        '- German: A♭ C E♭ F♯ (sounds like A♭7: the tritone sub of D7)',
      ], play: 'Ab:7 G:maj C:maj' },
      { t: 'The Neapolitan', s: '♭II, usually in first inversion', chord: 'Db:maj', b: [
        'A predominant from Phrygian: ♭II → V → i. Its ♭2 falls through the leading tone to the tonic.',
        '<b>Built</b>: a major triad on ♭2 (D♭ F A♭). In first inversion F is in the bass, the same bass as iv.',
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
        ['Quartal voicings moving up D Dorian over a D pedal', '=D3 E3 A3 D4 G4 | D3 F3 B3 E4 A4 | D3 G3 C4 F4 B4 | D3 F3 B3 E4 A4', 'Dm11 in 4ths, up and back'],
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
    ['Open-string bass under a high voicing: A, then D', '=A2 G4 C#5 E5 | D3 F4 A4 C5', 'A7 → Dm7, bass on open strings'],
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
      { t: 'Why ♯11, not 11', s: '7♯11 unpacked · 1 of 3', chord: 'C:13#11', b: [
        'On C7 the natural 11 (F) sits a ♭9 above the 3rd (E) and rubs against it. Raise it a half step to F♯ and it rings.',
        '<b>The scale</b> is Lydian dominant: Mixolydian with a ♯4. C D E F♯ G A B♭ is G melodic minor, from its 4th note.',
        '<b>Natural tensions only</b>: 9, ♯11, 13. No ♭9 or ♭13, because this dominant isn’t heading for a minor chord.',
        '- 7♯11, 9♯11 and 13♯11 are the same idea with more or fewer colours; 7♭5 is its bare form',
      ], ex: [
        ['C7 with the 11 (F) on top, then the ♯11 (F♯): hear the rub go', '=C3 Bb3 E4 F4 | C3 Bb3 E4 F#4', 'C7(11) → C7♯11'],
        ['C9 – C13♯11 as a vamp: Lydian dominant', 'C:9 C:13#11 C:9 C:13#11'],
      ] },
      { t: 'The ♯11 is the next chord’s note', s: '7♯11 unpacked · 2 of 3', b: [
        'A dominant that doesn’t fall a 5th has no leading note to resolve, so its ♯11 does the tying instead: it’s usually a note of the chord it goes to.',
        '- <b>D♭7 → C</b>: the ♯11 is G, the 5th of C (and the root of the G7 it replaces)',
        '- <b>B♭7 → C</b>: the ♯11 is E, the 3rd of C',
        '- <b>A♭7 → G7</b>: the ♯11 is D, the 5th of G',
        'Put the ♯11 on top and hold it while the bass moves.',
      ], ex: [
        ['G on top, held', '=Db3 B3 F4 G4 | C3 B3 E4 G4', 'D♭7♯11 → Cmaj7'],
        ['E on top, held: the backdoor', '=Bb2 Ab3 D4 E4 | C3 G3 B3 E4', 'B♭7♯11 → Cmaj7'],
        ['D on top, held, then home', '=Ab2 Gb3 C4 D4 | G2 F3 B3 D4 | C3 G3 B3 E4', 'A♭7♯11 → G7 → Cmaj7'],
      ] },
      { t: 'Where 7♯11 turns up', s: '7♯11 unpacked · 3 of 3', b: [
        'The rule: a dominant that <b>doesn’t resolve down a 5th</b>. In C:',
        '- <b>♭II7</b> (D♭7): the tritone sub of G7, sliding down to I',
        '- <b>♭VII7</b> (B♭7): the backdoor dominant, borrowed from C minor',
        '- <b>♭VI7</b> (A♭7): into V, or straight home',
        '- <b>II7</b> (D7) when it’s held before the ii–V, as in “Take the A Train”',
        '- <b>IV7</b> in a blues (F7)',
        'A V7 that does fall a 5th gets 9 and 13 (to major) or ♭9 and ♭13 (to minor) instead.',
      ], ex: [
        ['♭II7: ii – ♭II7 – I', 'D:m7 Db:7#11 C:maj7'],
        ['♭VII7: the backdoor, iv – ♭VII7 – I', 'F:m7 Bb:7#11 C:maj7'],
        ['♭VI7 → V7 → I', 'C:maj7 Ab:7#11 G:7 C:maj7'],
        ['II7 held, then ii – V – I', 'C:maj7 C:maj7 D:7#11 D:7#11 D:m7 G:7 C:maj7'],
        ['IV7 in a blues', 'C:7 F:7#11 C:7 C:7'],
        ['In minor: ♭VI7 – V7 – i', 'C:m7 Ab:7#11 G:7b9 C:m6'],
      ] },
      { t: '7♭9, 7♯9, 7♭13, 7alt', s: 'dominants with altered tensions', chord: 'C:7alt', b: [
        '<b>Lives on</b>: V in harmonic minor (7♭9 ♭13); the altered scale is melodic minor’s 7th mode.',
        '<b>Job</b>: V7 going to a minor chord, or any V7 that should sound tense.',
        '<b>Swap for</b>: plain V7; a °7 for 7♭9; the tritone sub (its 7♯11 has the same notes as V7alt).',
      ], ex: [['V7♭9 → i, then V7alt → i', 'D:m7b5 G:7b9 C:m6 D:m7b5 G:7alt C:m6'], ['V7♯9 in a minor blues', 'C:m7 G:7#9 C:m7']] },
      { t: 'Why alter a dominant?', s: 'altered dominants unpacked · 1 of 8', chord: 'G:7b9b13', b: [
        'In C minor the key has A♭ and E♭, not A and E. On G7 those two notes are the <b>♭9</b> and the <b>♭13</b>.',
        'So G7♭9♭13 is simply the minor key’s V7 with its own tensions: C harmonic minor played from G.',
        'And each altered tension is a half step from a note of the next chord, so it has somewhere to go. That’s the extra pull.',
      ], ex: [
        ['G9 → Cm: the natural 9 (A) fights the A♭ just heard in Dø7','D:m7b5 G:9 C:m6'],
        ['G7♭9♭13 → Cm: the key’s own notes', 'D:m7b5 G:7b9b13 C:m6'],
        ['To major, the plain 9 and 13 sound at home', 'D:m7 G:13 C:maj7'],
      ] },
      { t: '7♭9', s: 'altered dominants unpacked · 2 of 8', chord: 'G:7b9', b: [
        '<b>Sound</b>: dark, Spanish, classical. It’s V in harmonic minor; the scale is Phrygian dominant (G A♭ B C D E♭ F).',
        '<b>The ♭9 falls</b> a half step to the 5th of the next chord: A♭ → G.',
        '<b>Use it</b> on any dominant going to a minor chord: V of a minor key, and the secondary dominants of ii, iii and vi.',
        'Leave out the root and it’s a °7: G7♭9 without G is B°7.',
      ], ex: [
        ['The ♭9 on top, falling to the 5th of Cm', '=G2 F3 B3 Ab4 | C3 G3 Eb4 G4', 'G7♭9 → Cm'],
        ['V7♭9 → i in A minor', 'A:m7 D:m7 E:7b9 A:m7'],
        ['VI7♭9 → ii: A7♭9 → Dm7', 'C:maj7 A:7b9 D:m7 G:7 C:maj7'],
        ['III7♭9 → vi: E7♭9 → Am7', 'C:maj7 E:7b9 A:m7'],
        ['A minor ii–V into iii: F♯ø7 – B7♭9 – Em7', 'C:maj7 F#:m7b5 B:7b9 E:m7'],
      ] },
      { t: '7♯9', s: 'altered dominants unpacked · 3 of 8', chord: 'G:7#9', b: [
        '<b>Sound</b>: the blues. A minor 3rd (the ♯9) over the major 3rd: on G7♯9 that’s B♭ over B.',
        '<b>On the guitar</b> it’s the rock and funk tonic (E7♯9 is “the Hendrix chord”), and the V7 of a minor blues.',
        'It’s called ♯9 rather than a minor 3rd because the major 3rd is still there; the ♯9 is a colour on top.',
        '<b>Into Cm7</b> the ♯9 (B♭) doesn’t move at all: it’s Cm7’s 7th.',
      ], ex: [
        ['The ♯9 on top, held into Cm7', '=G3 B3 F4 Bb4 | C3 G3 Eb4 Bb4', 'G7♯9 → Cm7'],
        ['A funk tonic: E7♯9 with A7', 'E:7#9 E:7#9 A:7 E:7#9'],
        ['Minor blues, last line: A♭7 – G7♯9 – Cm7', 'C:m7 Ab:7 G:7#9 C:m7'],
      ] },
      { t: '7♭13', s: 'altered dominants unpacked · 4 of 8', chord: 'G:7b13', b: [
        '<b>Sound</b>: soft and sad, the most singable altered note. On G7 it’s E♭.',
        '<b>Into minor</b> it holds: E♭ is the 3rd of Cm.',
        '<b>Into major</b> it falls to the 9th of I (E♭ → D). If it rises to the 3rd instead (D♯ → E), call it ♯5: G7♯5, the whole-tone sound.',
        'It’s often paired with the ♭9 (G7♭9♭13): the two notes of the minor key.',
      ], ex: [
        ['The ♭13 on top, held into Cm', '=G2 F3 B3 Eb4 | C3 G3 C4 Eb4', 'G7♭13 → Cm'],
        ['Into major, the ♭13 falls to the 9th', '=G2 F3 B3 Eb4 | C3 E3 B3 D4', 'G7♭13 → Cmaj9'],
        ['As ♯5, rising to the 3rd: D♯ → E', 'D:m7 G:7#5 C:maj7'],
        ['Minor ii–V–i with ♭9 and ♭13', 'D:m7b5 G:7b9b13 C:m6'],
      ] },
      { t: '7alt and the altered scale', s: 'altered dominants unpacked · 5 of 8', chord: 'G:7alt', b: [
        '<b>7alt</b> means root, 3rd, ♭7 and only altered tensions: ♭9, ♯9, ♯11 (♭5), ♭13 (♯5). No natural 5th, 9th or 13th.',
        '<b>The scale</b>: melodic minor from a half step above the root. G altered is A♭ melodic minor from G: G A♭ B♭ B D♭ E♭ F.',
        '<b>On the guitar</b> you don’t play all four. Pick two, usually ♯9 and ♭13, and let the soloist play the rest.',
        'Use it on a V going to minor, or on the last V before home when you want the strongest pull.',
      ], ex: [
        ['The grip (3 x 3 4 4 6), resolving', '=G2 F3 B3 Eb4 Bb4 | C3 E3 B3 D4 G4', 'G7♯9♭13 → Cmaj9'],
        ['ii – V7alt – I in major', 'D:m7 G:7alt C:maj7'],
        ['Minor ii – V7alt – i', 'D:m7b5 G:7alt C:m6'],
        ['I – VI7alt – ii – V7alt – I', 'C:maj7 A:7alt D:m7 G:7alt C:maj7'],
      ] },
      { t: 'Altered = the tritone sub', s: 'altered dominants unpacked · 6 of 8', b: [
        'G altered and D♭ Lydian dominant are the <b>same seven notes</b>: both are A♭ melodic minor.',
        'So G7alt and D♭7♯11 are one sound with two basses. The top of G7♯9♭13 (B F B♭ E♭) is a D♭13 without its root.',
        'They share the guide tones B and F, so either one pulls to C.',
        '<b>Soloing</b>: over G7alt or D♭7♯11, play A♭ melodic minor.',
      ], ex: [
        ['The same top notes over two basses, then home', '=G2 F3 B3 Eb4 Bb4 | Db3 F3 B3 Eb4 Bb4 | C3 E3 B3 D4 G4', 'G7♯9♭13 · D♭13 · Cmaj9'],
        ['ii – V7alt – I, then ii – ♭II13♯11 – I', 'D:m7 G:7alt C:maj7 D:m7 Db:13#11 C:maj7'],
        ['In minor: Dø7 – D♭7♯11 – Cm6', 'D:m7b5 Db:7#11 C:m6'],
      ] },
      { t: 'Every altered note falls', s: 'altered dominants unpacked · 7 of 8', b: [
        'Over G7 going to C, each altered tension is a half step above a note of the next chord:',
        '- <b>♭9</b> (A♭) → G, the 5th',
        '- <b>♯9</b> (B♭) → A, the 6th; into Cm7 it stays as the ♭7',
        '- <b>♭5 / ♯11</b> (D♭) → C, the root',
        '- <b>♭13</b> (E♭) → D, the 9th; into Cm it stays as the ♭3',
        'Meanwhile the 3rd (B) rises to C and the 7th (F) falls to E, as in any V–I.',
      ], ex: [
        ['The ♭9 and ♭13 each fall a half step', '=G2 F3 B3 Eb4 Ab4 | C3 E3 B3 D4 G4', 'G7♭9♭13 → Cmaj9'],
        ['Into minor, the ♭13 holds', '=G2 F3 B3 Eb4 Ab4 | C3 G3 C4 Eb4 G4', 'G7♭9♭13 → Cm'],
        ['The ♭5 falls to the root', '=G2 F3 B3 Db4 | C3 E3 B3 C4', 'G7♭5 → Cmaj7'],
      ] },
      { t: 'Which tensions, when', s: 'altered dominants unpacked · 8 of 8', b: [
        '- <b>Falling a 5th to major</b>: 9 and 13 (G13 → C). Mixolydian. Alt only for a deliberate dark pull',
        '- <b>Falling a 5th to minor</b>: ♭9 and ♭13 (G7♭9♭13 → Cm). Phrygian dominant, or altered. ♯9 for the blues',
        '- <b>Not falling a 5th</b>: 9, ♯11, 13 (D♭7♯11 → C). Lydian dominant',
        '- <b>The melody wins</b>: if the tune has an A over G7, it can’t be ♭9 or ♯9',
      ], ex: [
        ['Every rule once, in C', 'C:maj7 A:7b9 D:m7 G:13 C:maj7 Ab:7#11 G:7alt C:maj7'],
        ['In A minor', 'A:m7 F:7#11 E:7b9b13 A:m6'],
        ['A blues in G: G7 – C9 – G7 – E7♭9 – Am7 – D7alt – G7', 'G:7 C:9 G:7 E:7b9 A:m7 D:7alt G:7'],
      ] },
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
      '<b>Comp</b>: a Dm7 shell, x5x56x (D, C, F: root, ♭7, ♭3), on beat 1 of each bar; let it ring. Then short stabs on 2 and 4, like a hi-hat. Then colour it: Dm9, x5355x, puts E on top.',
      '<b>Solo, step 1</b>: the arpeggio only, D F A C, in quarter notes: one octave, then two. Every note is a chord tone, so nothing can sound wrong.',
      '<b>Step 2</b>: D Dorian (C major from D) in 8ths, with a chord tone on every beat 1. Hold the B (the natural 6) and hear what makes it Dorian rather than plain minor.',
      '<b>Step 3</b>: two bars of playing, two of rest. Then repeat your phrase a scale step higher. Space is part of the line.',
      '<b>Harder</b>: superimpose E minor pentatonic (E G A B D: 9, 11, 5, 6, 1 over D). It sounds modern because it avoids the root and the ♭3.',
    ] },
    { t: 'i – IV: the Dorian vamp', s: 'level 1 · one note moves', comp: { chart: 'D:m7 | G:7 | D:m7 | G:7', bpm: 80 }, b: [
      '<b>Comp</b>: two notes. F and C on Dm7 (D string 3rd fret, G string 5th), then F and B on G7 (D string 3rd, G string 4th): one finger moves one fret. That half step C → B is the whole progression.',
      '<b>Then</b> full grips: Dm7 x5x565 and G7 3x343x. Play it as funk: short, muted 16th-note chops, the chord landing on the “and” of 2.',
      '<b>Solo, step 1</b>: B on beat 1 of every G7 bar, F or C on every Dm7 bar. Fill in between with D Dorian.',
      '<b>Step 2</b>: start from D minor pentatonic (the blues side), then add B and E to make it Dorian. Hear the difference the B makes over G7.',
      '<b>Harder</b>: a triad pair. An F triad (F A C) over Dm7 and a G triad (G B D) over G7, alternating three notes of each. It’s the same vamp as “Oye Como Va” (Am7 – D7).',
    ] },
    { t: 'ii – V – I', s: 'level 2 · guide tones', comp: { chart: 'D:m7 | G:7 | C:maj7 | %', bpm: 80 }, b: [
      '<b>Comp</b>: shells, Dm7 x535xx → G7 3x34xx → Cmaj7 x324xx. Watch the top two notes: F–C, F–B, E–B. Each change moves one note a half step.',
      '<b>Rhythm</b>: half notes first. Then Freddie Green style: all four beats, short and quiet, the chord just touched.',
      '<b>Solo, step 1</b>: each arpeggio from its root, up and down: D F A C, G B D F, C E G B.',
      '<b>Step 2</b>: each arpeggio from its 3rd: F A C E over Dm7, B D F A over G7, E G B D over Cmaj7. These are the 3–5–7–9 arpeggios, and they sound richer.',
      '<b>Step 3</b>: never jump to a root. When the chord changes, move to the nearest chord tone of the new chord and carry on.',
      '<b>Harder</b>: make bar 2 G7♭9 by playing B°7 (B D F A♭) over it, and resolve A♭ to G on Cmaj7.',
    ] },
    { t: 'ii – V – I with colour', s: 'level 2 · Charleston rhythm', comp: { chart: 'D:m9 | G:13 | C:maj9 | %', bpm: 90 }, b: [
      '<b>Comp</b>: Dm9 x5355x → G13 3x345x → Cmaj9 x3243x. The top note E holds through Dm9 and G13, then falls to D: a melody on top of the changes.',
      '<b>Rhythm</b>: the Charleston, chord on beat 1 and the “and” of 2. Then anticipate: play each new chord on the “and” of 4, before the bar.',
      '<b>Solo, step 1</b>: C major over all three, starting each bar on the chord’s 3rd: F, B, E.',
      '<b>Step 2</b>: aim at the colour notes instead: E (the 9) on Dm9, E (the 13) on G13, D (the 9) on Cmaj9.',
      '<b>Harder</b>: one minor pentatonic per chord. A minor over Dm9 (5 ♭7 1 9 11), D minor over G13 (5 ♭7 1 9 11), E minor over Cmaj9 (3 5 6 7 9). The same shape moves with the chord.',
    ] },
    { t: 'Minor ii – V – i', s: 'level 3 · the ♭9', comp: { chart: 'B:m7b5 | E:7b9 | A:m6 | %', bpm: 80 }, b: [
      '<b>Comp</b>: Bø7 x2323x → E7♭9 xx2131 → Am6 x02212. The ♭9 (F) is on top of E7 and falls to E, the 5th of Am.',
      '<b>Solo, step 1</b>: the three arpeggios: B D F A, E G♯ B D (or G♯ B D F, its °7), A C E F♯.',
      '<b>Step 2</b>: A harmonic minor over Bø7 and E7 (on E7 it’s E Phrygian dominant), then A melodic minor (A B C D E F♯ G♯) on Am6. Hear F turn into F♯.',
      '<b>Step 3</b>: practise the resolution on its own: F → E, G♯ → A, D → C. Every minor ii–V–i turns on those three moves.',
      '<b>Harder</b>: B Locrian ♮2 (D melodic minor) on Bø7, E altered (F melodic minor) on E7. Three different melodic minor scales in four bars.',
    ] },
    { t: 'I – vi – ii – V', s: 'level 3 · two chords a bar', comp: { chart: 'C:maj7 A:m7 | D:m7 G:7 | C:maj7 A:m7 | D:m7 G:7', bpm: 90 }, b: [
      '<b>Comp</b>: one area of the neck: Cmaj7 x3545x, Am7 5x555x, Dm7 x5x565, G7 3x343x. Two beats each; then anticipate the second chord of each bar on the “and” of 2.',
      '<b>Solo, step 1</b>: C major pentatonic over everything. It never clashes, so concentrate on rhythm.',
      '<b>Step 2</b>: the 3rd of each chord as it arrives: E, C, F, B.',
      '<b>Step 3</b>: 7th to 3rd. Hold each chord’s 7th and let it fall into the next chord’s 3rd: B → C, G → F, C → B, F → E. That’s a melody written by the changes.',
      '<b>Harder</b>: the same at 200 bpm. It’s the turnaround of every rhythm-changes tune.',
    ] },
    { t: 'I – VI7 – ii – V', s: 'level 3 · a secondary dominant', comp: { chart: 'C:maj7 A:7b9 | D:m7 G:7 | C:maj7 A:7b9 | D:m7 G:7', bpm: 90 }, b: [
      '<b>Comp</b>: on A7, voice C♯ (its 3rd) on top and let it rise to D on Dm7; its G (the 7th) falls to F. Two voices, two half steps.',
      '<b>Solo, step 1</b>: C major, changing just one note over A7: C becomes C♯.',
      '<b>Step 2</b>: over A7 play D harmonic minor (A Phrygian dominant): C♯ and the ♭9, B♭. Resolve B♭ → A and C♯ → D as Dm7 arrives.',
      '<b>Step 3</b>: an E°7 or C♯°7 arpeggio over A7 gives you the ♭9 sound with no thinking: same notes, rootless.',
      '<b>Harder</b>: A altered (B♭ melodic minor) over A7, then G altered (A♭ melodic minor) over G7: two altered dominants a bar apart.',
    ] },
    { t: 'Dominant chain', s: 'level 4 · the rhythm-changes bridge', comp: { chart: 'E:7 | A:7 | D:7 | G:7', bpm: 90 }, b: [
      '<b>Comp</b>: the 3rd and 7th of each chord; both fall a half step at every change, swapping roles (G♯ D → G C♯ → F♯ C → F B). As shells: E7 x767xx, A7 545xxx, D7 x545xx, G7 3x34xx.',
      '<b>Solo, step 1</b>: Mixolydian on each chord, with its 3rd on beat 1: G♯, C♯, F♯, B.',
      '<b>Step 2</b>: the guide-tone line as half notes, G♯ – G – F♯ – F. Then decorate it with approach notes, keeping the guide tone on the beat.',
      '<b>Step 3</b>: add the ♭9 on beat 4 of each bar, the note that points to the next chord: F over E7, B♭ over A7, E♭ over D7, A♭ over G7.',
      '<b>Harder</b>: altered on E7 and A7, Mixolydian on D7 and G7. Tension, then release, inside four bars.',
    ] },
    { t: 'The blues', s: 'level 4 · 12 bars in C', comp: { chart: 'C:7 | F:7 | C:7 | C:7 | F:7 | F:7 | C:7 | A:7 | D:m7 | G:7 | C:7 A:7 | D:m7 G:7', bpm: 100 }, b: [
      '<b>Comp</b>: 3–7 shells on beats 2 and 4, like a hi-hat: C7 x3x35x (C B♭ E), F7 1x12xx (F E♭ A). From C7 to F7, E falls to E♭ and B♭ falls to A.',
      '<b>Solo, step 1</b>: one chorus on the C blues scale. Then one chorus on just three notes. Make the rhythm do the work.',
      '<b>Step 2</b>: mix the colours. C major pentatonic over C7 (its E), C minor pentatonic over F7 (E♭ is F7’s 7th). That switch is the sound of the blues.',
      '<b>Step 3</b>: chord tones. Hit E on every C7, A on every F7, C♯ on A7 (bar 8), F on Dm7, B on G7.',
      '<b>Harder</b>: one riff, re-pitched to fit each chord: E becomes E♭ on F7. B.B. King and Charlie Parker both do this.',
    ] },
    { t: 'The minor blues', s: 'level 5 · ♭VI7 to V7', comp: { chart: 'C:m9 | % | % | % | F:m9 | % | C:m9 | % | Ab:7#11 | G:7alt | C:m9 | G:7alt', bpm: 90 }, b: [
      '<b>Comp</b>: Cm9 x3133x; Fm9 is the same shape at the 8th fret. In bars 9–10, A♭7♯11 slides down a half step into G7alt: every voice moves a fret.',
      '<b>Solo, step 1</b>: C minor pentatonic everywhere. Then C Dorian on Cm9 and F Dorian (E♭ major) on Fm9.',
      '<b>Step 2</b>: bars 9–10. A♭ Lydian dominant (E♭ melodic minor) on A♭7, then G altered (A♭ melodic minor) on G7alt. The scales are a half step apart, like the chords.',
      '<b>Step 3</b>: resolve into bar 11: A♭ (♭9 of G) → G, B → C, E♭ stays as the ♭3 of Cm.',
      '<b>Harder</b>: the same four-note motif through the form, moved to fit each chord. Think “Mr. P.C.”.',
    ] },
    { t: 'Three ways home', s: 'level 5 · front, back and side door', comp: { chart: 'D:m7 G:7 | C:maj7 | F:m7 Bb:7 | C:maj7 | D:m7 Db:7#11 | C:maj7', bpm: 90 }, b: [
      '<b>Comp</b>: keep a common tone on top through each cadence. E on top of Cmaj7 can be approached from F (G7’s 7th), from F again (B♭7’s 5th) and from F (D♭7’s 3rd): the same top note, three different basses.',
      '<b>Solo, step 1</b>: C major for the ii–V; F Dorian into B♭ Mixolydian for the backdoor (all E♭ major); D♭ Lydian dominant (A♭ melodic minor) for the tritone sub.',
      '<b>Step 2</b>: hear the arrivals. Play the same phrase into each Cmaj7: B → C after G7, A♭ → G after B♭7, and C♭ (= B) → C after D♭7.',
      '<b>Harder</b>: play G altered over the side door. It’s the same notes as D♭ Lydian dominant: one scale, two names.',
    ] },
    { t: 'Borrowed chords', s: 'level 5 · modal interchange', comp: { chart: 'C:maj7 | F:maj7 | F:m6 | C:maj7 | C:maj7 | Ab:maj7 | Bb:7 | C:maj7', bpm: 80 }, b: [
      '<b>Comp</b>: let one inner voice sing A → A♭ → G through F – Fm6 – C. In bars 6–7, A♭maj7 to B♭7 is the backdoor into C.',
      '<b>Solo, step 1</b>: C Ionian, F Lydian, F melodic minor on Fm6, C Ionian.',
      '<b>Step 2</b>: A♭ Lydian (with D) on A♭maj7, B♭ Mixolydian on B♭7. The borrowed notes are A♭, E♭ and B♭: put them on the beat when they arrive.',
      '<b>Step 3</b>: a single line through the whole form: A (bar 2), A♭ (bar 3), G (bar 4), then E♭ (bar 6), D (bar 7), E (bar 8).',
      '<b>Harder</b>: keep the same rhythm pattern for all eight bars and change only the notes the chords force you to change.',
    ] },
    { t: 'Secondary dominants', s: 'level 6 · the “All of Me” shape', comp: { chart: 'C:6 | % | E:7 | % | A:7 | % | D:m7 | G:7', bpm: 110 }, b: [
      '<b>Comp</b>: follow the 3rds as the chords move: E (C6) → G♯ (E7) → C♯ (A7) → F (Dm7) → B (G7). Each new chord changes one note of the key.',
      '<b>Solo, step 1</b>: C major, then A harmonic minor over E7, D harmonic minor over A7, D Dorian, G Mixolydian.',
      '<b>Step 2</b>: “change one note” instead. G becomes G♯ on E7; C becomes C♯ on A7. Land the new note on beat 1 and resolve it up a half step.',
      '<b>Step 3</b>: arpeggios from the 3rd: G♯ B D F over E7 (a °7, so the ♭9 comes free), C♯ E G B♭ over A7.',
      '<b>Harder</b>: E7 and A7 altered. With two bars each, there’s time to build tension and resolve it.',
    ] },
    { t: 'Rhythm changes', s: 'level 6 · the A section in B♭', comp: { chart: 'Bb:6 G:7 | C:m7 F:7 | Bb:6 G:7 | C:m7 F:7 | Bb:6 Bb:7 | Eb:6 Eb:m6 | Bb:6 F:7 | Bb:6', bpm: 120 }, b: [
      '<b>Comp</b>: two shells a bar, short and on the beat. At this tempo the moves must be tiny: alternate 6th- and 5th-string roots so each chord is a fret or two from the last.',
      '<b>Solo, step 1</b>: the B♭ blues scale over bars 1–4. It works over the whole turnaround because the chords move so fast.',
      '<b>Step 2</b>: outline bars 5–6. A♭ on B♭7 (its 7th, pointing to E♭), then G♭ on E♭m6 (its ♭3). Those two notes are bars 5–6.',
      '<b>Step 3</b>: bebop: the B♭ bebop scale descending from a chord tone on the beat, so chord tones keep landing on the beat.',
      '<b>Harder</b>: 200 bpm and above, which is where these tunes live (“Oleo”, “Anthropology”).',
    ] },
    { t: 'Autumn Leaves, A section', s: 'level 6 · relative major and minor', comp: { chart: 'A:m7 | D:7 | G:maj7 | C:maj7 | F#:m7b5 | B:7b9 | E:m7 | %', bpm: 100 }, b: [
      '<b>Comp</b>: drop 2, voice-led in one area of the neck. The guide tones fall step by step: C – C – B – B – A – A – G.',
      '<b>Solo, step 1</b>: G major (E natural minor) for bars 1–4. Then E harmonic minor for F♯ø7 – B7 (the D♯), and E Dorian on Em7.',
      '<b>Step 2</b>: sing and play that guide-tone line as whole notes, then fill in with scale notes, keeping the guide tone on beat 1.',
      '<b>Step 3</b>: the same phrase twice: once over Am7 – D7 – G, then a tone lower over F♯ø7 – B7 – Em. The tune is built this way.',
      '<b>Harder</b>: B altered (C melodic minor) on B7, and E melodic minor on Em7 for a darker landing.',
    ] },
    { t: 'Funk on one chord', s: 'level 6 · sixteenths', comp: { chart: 'E:9 | % | % | % | A:9 | % | E:9 | %', bpm: 96 }, b: [
      '<b>Comp</b>: E9 x7677x; A9 is the same grip at the 12th fret. Keep the strumming hand moving in 16ths all the time and let the chord sound only on a few of them. Mute the rest with the fretting hand.',
      '<b>Rhythm</b>: start with the chord on the “and” of 1 and on beat 3. Then add 16th-note ghosts in between. Never stop the hand.',
      '<b>Solo, step 1</b>: E minor pentatonic, short and percussive. Double stops (two notes at once) sound right here.',
      '<b>Step 2</b>: hit G♯ (the 3rd) on E9 and C♯ on A9. The major 3rd against the minor pentatonic is the funk sound.',
      '<b>Harder</b>: E Dorian with the 9 and 13 (F♯ and C♯), and 16th-note lines that start off the beat.',
    ] },
    { t: 'The diatonic cycle', s: 'level 7 · “Fly Me to the Moon”', comp: { chart: 'A:m7 | D:m7 | G:7 | C:maj7 | F:maj7 | B:m7b5 | E:7b9 | A:m7', bpm: 110 }, b: [
      '<b>Comp</b>: the guide-tone line through all eight: C/G → F/C → F/B → E/B → E/A → D/A → D/G♯ → C/G. Alternate 6th- and 5th-string roots and the cycle walks down the neck.',
      '<b>Solo, step 1</b>: C major everywhere except E7: there, A harmonic minor, with G♯ leading back to A.',
      '<b>Step 2</b>: one arpeggio per bar, each from the nearest chord tone. The line should fall gently through the cycle.',
      '<b>Step 3</b>: a sequence: the same four-note shape down a 5th each bar, adjusted to each chord.',
      '<b>Harder</b>: E altered on bar 7, or a G♯°7 arpeggio, and resolve into Am7.',
    ] },
    { t: 'The jazz blues in F', s: 'level 7 · bebop changes', comp: { chart: 'F:7 | Bb:7 | F:7 | C:m7 F:7 | Bb:7 | B:dim7 | F:7 | D:7alt | G:m7 | C:7 | F:7 D:7 | G:m7 C:7', bpm: 120 }, b: [
      '<b>Comp</b>: shells, F7 1x12xx, B♭7 x1x13x, B°7 x2313x. Freddie Green style: all four beats, short. Bar 6’s B°7 is the ♯iv°7 climbing back to F.',
      '<b>Solo, step 1</b>: F blues scale for a chorus, then chord tones only: A on F7, D on B♭7, F♯ on D7, B♭ on Gm7, E on C7.',
      '<b>Step 2</b>: bebop dominant on F7 and B♭7 (add the major 7 as a passing note), so 8th-note runs put chord tones on the beat.',
      '<b>Step 3</b>: enclosures. Approach each new 3rd from a half step above and below: B♭ and G♯ around A on F7.',
      '<b>Harder</b>: D7alt in bar 8 (E♭ melodic minor) into Gm7, and the same altered sound on C7 in bar 10. This is “Billie’s Bounce” and “Now’s the Time” territory.',
    ] },
    { t: 'The rhythm-changes bridge', s: 'level 7 · dominants, two bars each', comp: { chart: 'D:7 | % | G:7 | % | C:7 | % | F:7 | %', bpm: 150 }, b: [
      '<b>Comp</b>: shells D7 x545xx, G7 3x34xx, C7 x3x35x, F7 1x12xx. Or approach each chord from a half step above on beat 4 (E♭7 into D7): the bridge sounds hipper and the hand barely moves.',
      '<b>Solo, step 1</b>: Mixolydian on each chord, 3rd on beat 1: F♯, B, E, A.',
      '<b>Step 2</b>: in the second bar of each chord, go altered (D altered is E♭ melodic minor), then resolve into the next chord’s 3rd. Two bars give you time for in, then out, then in.',
      '<b>Step 3</b>: the guide-tone line, F♯ – F – E – E♭ (one voice), as the backbone of your phrases.',
      '<b>Harder</b>: add the ii before each dominant (Am7 – D7, Dm7 – G7, Gm7 – C7, Cm7 – F7) and play it at 200.',
    ] },
    { t: 'Bossa', s: 'level 7 · the “Ipanema” shape in F', comp: { chart: 'F:maj7 | % | G:7#11 | % | G:m7 | Gb:7#11 | F:maj7 | Gb:7#11', bpm: 120 }, b: [
      '<b>Comp</b>: Fmaj7 1x221x, G7♯11 3x342x, Gm7 3x333x, G♭7♯11 2x231x. The thumb plays the root on 1 and 3; the fingers play the chord on the syncopations.',
      '<b>Rhythm</b>: the bossa pattern over two bars: chord on 1, the “and” of 2, then 4 of bar one; the “and” of 1 and 3 of bar two. Keep the bass steady underneath.',
      '<b>Solo, step 1</b>: F major on Fmaj7; G Lydian dominant (D melodic minor) on G7♯11: B and C♯ are the new notes.',
      '<b>Step 2</b>: G♭7♯11 (D♭ melodic minor) slides into Fmaj7: its C stays, its B♭ falls to A.',
      '<b>Harder</b>: play the line softly and behind the beat, as Getz and Jobim did. Let the guitar carry the pulse.',
    ] },
    { t: 'The Bird blues', s: 'level 8 · falling ii–Vs', comp: { chart: 'C:maj7 | B:m7b5 E:7 | A:m7 D:7 | G:m7 C:7 | F:7 | F:m7 Bb:7 | E:m7 A:7 | Eb:m7 Ab:7 | D:m7 | G:7 | C:maj7 A:7 | D:m7 G:7', bpm: 100 }, b: [
      '<b>Comp</b>: shells, two a bar; each ii–V is a half step or a whole step lower than the last, so the hand slides down the neck with the same pair of shapes.',
      '<b>Solo, step 1</b>: the 3rd of each chord on its first beat. Just that, as half notes, for a whole chorus.',
      '<b>Step 2</b>: treat every ii–V as its own key: B Locrian into E Phrygian dominant, then A Dorian into D Mixolydian, and so on.',
      '<b>Step 3</b>: one bebop phrase shape for every ii–V, transposed down the form.',
      '<b>Harder</b>: tritone-sub the V in your line (play over E7 as if it were B♭7). The bass stays, your line slides.',
    ] },
    { t: 'The chain of minor ii–Vs', s: 'level 8 · every target turns', comp: { chart: 'E:m7b5 | A:7b9 | D:m7b5 | G:7b9 | C:m7b5 | F:7b9 | Bb:m6 | %', bpm: 100 }, b: [
      '<b>Comp</b>: ø7 and 7♭9 shells, a whole step lower each time. Eø7 – A7 promises D minor; Dø7 – G7 promises C minor; only B♭m6 arrives.',
      '<b>Solo, step 1</b>: harmonic minor of each target over each pair: D harmonic minor, C harmonic minor, B♭ harmonic minor.',
      '<b>Step 2</b>: the ♭9 of each dominant on beat 4, falling into the next chord: B♭ → A♭ (the ♭5 of Dø7), A♭ → G♭ (the ♭5 of Cø7), G♭ → F (the 5th of B♭m6).',
      '<b>Step 3</b>: one phrase shape for a ii–V, moved down a tone twice. Sequences make long forms easy to hear.',
      '<b>Harder</b>: Locrian ♮2 on the ø7s and altered on the dominants: six different melodic minor scales in six bars.',
    ] },
    { t: '“Stella”, bars 1–8', s: 'level 9 · ii–Vs that don’t resolve', comp: { chart: 'E:m7b5 | A:7b9 | C:m7 | F:7 | F:m7 | Bb:7 | Eb:maj7 | Ab:7#11', bpm: 110 }, b: [
      '<b>Comp</b>: Eø7 – A7 points at D minor but goes to Cm7; Cm7 – F7 points at B♭ but goes to Fm7; only Fm7 – B♭7 – E♭maj7 resolves. Voice-lead every chord to the nearest grip.',
      '<b>Solo, step 1</b>: the 3rd of each chord on beat 1: G, C♯, E♭, A, A♭, D, G, C.',
      '<b>Step 2</b>: E Locrian ♮2 (G melodic minor), A altered, C Dorian, F Mixolydian, F Dorian, B♭ Mixolydian, E♭ major, A♭ Lydian dominant.',
      '<b>Step 3</b>: find the note each chord hands to the next: B♭ (Eø7 → A7♭9 → Cm7), E♭ (Cm7 → F7 → Fm7), A♭ (Fm7 → B♭7). Phrases built on them glue the line together.',
      '<b>Harder</b>: the whole tune is like this. Learn these eight bars in all twelve keys and the rest gets easier.',
    ] },
    { t: 'Altered ii–Vs', s: 'level 9 · melodic minor a half step up', comp: { chart: 'D:m7 | G:7alt | C:maj7 | % | C:m7 | F:7alt | Bb:maj7 | %', bpm: 110 }, b: [
      '<b>Comp</b>: G7alt 3x3444 (G F B E♭ A♭) and F7alt 1x1222 (F E♭ A D♭ G♭): root, ♭7, 3rd, then two altered notes on top. Resolve the top voices down by half steps.',
      '<b>Solo, step 1</b>: on G7alt, A♭ melodic minor; on F7alt, G♭ melodic minor. Start on the ♭9 or ♯9 and resolve to the 5th or 3rd of the next chord.',
      '<b>Step 2</b>: triads from the altered scale. Over G7alt, an E♭ triad (E♭ G B♭: ♭13, 1, ♯9) and a D♭ triad (D♭ F A♭: ♭5, ♭7, ♭9); they share no notes, so alternate them in groups of three.',
      '<b>Step 3</b>: practise the landing. Every altered note is a half step from a chord tone of I: A♭ → G, D♭ → C, E♭ → E or D.',
      '<b>Harder</b>: keep going down in tones (A♭, G♭, E…) through all six keys of that cycle.',
    ] },
    { t: 'Major-3rd cycle', s: 'level 9 · Coltrane’s three tonics', comp: { chart: 'B:maj7 D:7 | G:maj7 Bb:7 | Eb:maj7 | % | A:m7 D:7 | G:maj7 Bb:7 | Eb:maj7 | %', bpm: 70 }, b: [
      '<b>Comp</b>: find the three tonics first (B, G, E♭, a major 3rd apart), then add each V7 just before its tonic.',
      '<b>Solo, step 1</b>: 1 – 2 – 3 – 5 in each key (B C♯ D♯ F♯, G A B D, E♭ F G B♭), switching exactly on the chord.',
      '<b>Step 2</b>: guide tones only. The 3rds alone, D♯ – F♯ – B – D – G, show how close the keys really are.',
      '<b>Step 3</b>: find common tones: D (5th of G, 3rd of B♭7) carries across; so does B♭ into E♭.',
      '<b>Harder</b>: 8th notes at 120, then the full “Giant Steps” form.',
    ] },
    { t: 'Modal', s: 'level 9 · “So What” form, half size', comp: { chart: 'D:m11 | % | % | % | Eb:m11 | % | % | %', bpm: 120 }, b: [
      '<b>Comp</b>: So What voicings (three 4ths and a major 3rd) moving up and down D Dorian, then the same a half step up. Short stabs with lots of space.',
      '<b>Solo, step 1</b>: D Dorian, then E♭ Dorian. Make the jump on bar 5 obvious: play E♭ Dorian’s B♭ and E♭ right away.',
      '<b>Step 2</b>: quartal lines: stacks of 4ths (D G C, E A D) from the mode, moved up and down it.',
      '<b>Step 3</b>: pentatonics inside the mode: D minor, E minor and A minor pentatonic all live in D Dorian. Switch between them.',
      '<b>Harder</b>: play E♭ Dorian over the D bars for a beat or two and come back. That’s the next card, done deliberately.',
    ] },
    { t: 'Ballad: rich colours', s: 'level 10 · tensions on top', comp: { chart: 'C:maj9 | A:7b9 | D:m9 | G:13b9 | E:m7 | A:7alt | D:m9 | Db:7#11', bpm: 60 }, b: [
      '<b>Comp</b>: rootless voicings with the colour tone on top: the 9 on Cmaj9, the ♭9 on A7, the 9 on Dm9, the 13 on G13♭9, the ♯11 on D♭7. Make the top notes a melody.',
      '<b>Solo, step 1</b>: aim for the same tensions the comping puts on top. Half-whole on G13♭9, altered on A7alt, Lydian dominant on D♭7♯11.',
      '<b>Step 2</b>: double-time. The ballad is slow, so 16th-note runs fit, but always land on a long note at the end of a phrase.',
      '<b>Step 3</b>: leave space. A ballad solo is mostly long notes and silence.',
      '<b>Harder</b>: play it solo, comping yourself: bass note on beat 1, the chord, then a melody note on top.',
    ] },
    { t: 'Upper-structure comping', s: 'level 10 · triads over shells', comp: { chart: 'D:m9 | G:13 | D:m9 | G:7alt | C:maj9 | A:7alt | D:m9 G:13 | C:maj9', bpm: 90 }, b: [
      '<b>Comp</b>: a 3–7 shell low, a triad on top. Over G7: an E triad gives 13♭9 (3x3454), an E♭ triad gives ♯9♭13 (3x3446), an A triad gives 9♯11 13.',
      '<b>Rhythm</b>: sparse. One chord every bar or two, anticipated on the “and” of 4.',
      '<b>Solo, step 1</b>: play the comping triads as arpeggios. Over G7alt, E♭ and D♭ triads; over A7alt, F and E♭ triads (♭13 1 ♯9 and ♭5 ♭7 ♭9).',
      '<b>Step 2</b>: triad pairs: two triads from the same scale, alternated in groups of three.',
      '<b>Harder</b>: the same idea across all twelve keys. The triads move with the root, so it’s one idea learned twelve times.',
    ] },
    { t: 'Outside and back in', s: 'level 11 · side-slipping on purpose', comp: { chart: 'D:m7 | % | % | % | % | % | % | %', bpm: 120 }, b: [
      '<b>Comp</b>: Dm11 voicings; now and then slip the voicing up a half step (E♭m11) for a beat and back. The band has to hear you return.',
      '<b>Solo, step 1</b>: play a phrase in D Dorian, then the same phrase a half step up (E♭ Dorian), then the same phrase back in D. In, out, in.',
      '<b>Step 2</b>: go out only on weak beats or for half a bar, and always land in on a strong beat with a chord tone (F or A).',
      '<b>Step 3</b>: pentatonic side-slips: D minor pentatonic, then E♭ minor pentatonic, then back. The shape stays the same, so the hand knows where it is.',
      '<b>Harder</b>: move out by other intervals (a tritone: A♭ Dorian) and by sequence: a motif moved up in half steps until it comes back in.',
    ] },
    { t: 'Coltrane changes', s: 'level 12 · ii–V–I through three keys', comp: { chart: 'D:m7 Eb:7 | Ab:maj7 B:7 | E:maj7 G:7 | C:maj7 | D:m7 Eb:7 | Ab:maj7 B:7 | E:maj7 G:7 | C:maj7', bpm: 70 }, b: [
      '<b>Comp</b>: shells, and memorise the roots first: D E♭ A♭ B E G C. After the first half step (D – E♭), the roots alternate up a 4th and up a minor 3rd.',
      '<b>Solo, step 1</b>: 1 – 2 – 3 – 5 cells on every chord: E♭ F G B♭ on E♭7, A♭ B♭ C E♭ on A♭maj7, and so on.',
      '<b>Step 2</b>: guide tones through the whole thing: C (Dm7) → D♭ (E♭7) → C (A♭maj7) → D♯ (B7) → G♯ (Emaj7) → F (G7) → E (Cmaj7).',
      '<b>Step 3</b>: one octave of each key’s major scale, joined at the nearest note. Slowly; speed comes from knowing where every key starts.',
      '<b>Harder</b>: this is what Coltrane laid over “Tune Up” to make “Countdown”. Take it to 120, then into the full form.',
    ] },
  ],
});

// ---------- at the end: fluency drills (with a click and a drone), and the Menu System from the Guitar Routine ----------
DECKS.push(
  {
    id: 'fluency', name: 'Fluency drills', cards: [
      { t: 'How to build speed', s: 'read this first', b: [
        '- Start where it’s clean, not where it’s hard. Clean means even, in time, no buzz',
        '- Up 5 bpm only after three clean repetitions in a row',
        '- If it falls apart, drop back 10 and climb again',
        '- Practise bursts: one beat of fast notes, then rest. Then two beats',
        '- Play with the drone so your ear keeps up with your hands, and say the degrees',
        'The goals on these cards are good targets for a fluent player; take weeks, not days.',
      ] },
      { t: 'Chromatic warm-up', s: '1-2-3-4 on every string', drill: { bpm: 60, sub: 4, goal: '16ths at 120', from: '16ths at 60', drone: 'E' }, b: [
        'Frets 1-2-3-4 on the low E, one finger per fret, across all six strings and back; then move up a fret and repeat.',
        '- Keep fingers close to the strings; alternate pick strictly',
        '- Variation: 1-3-2-4, 4-3-2-1',
      ] },
      { t: 'Major scale in position', s: 'two octaves, from the root', drill: { bpm: 70, sub: 4, goal: '16ths at 110', from: '8ths at 80', drone: 'G' }, b: [
        'G major from the 6th-string root (fret 3), two octaves up and back, staying in one position.',
        '- Then the other four CAGED positions of G',
        '- Say the degree of the first note of every beat',
      ] },
      { t: 'Three notes per string, diagonal', s: 'three octaves', drill: { bpm: 60, sub: 4, goal: '16ths at 120', from: '8ths at 80', drone: 'G' }, b: [
        'G major, three notes on every string, from G on the 6th string (fret 3) up to G at the 15th fret of the high E. Shift up every string or two.',
        '- Always shift with the same finger (the index sliding up)',
        '- Then come back down',
        '- This is the fingering for speed: every string the same picking',
      ] },
      { t: 'The pentatonic ladder', s: 'all five boxes, up the neck', drill: { bpm: 70, sub: 2, goal: '8ths at 180', from: '8ths at 90', drone: 'A' }, b: [
        'A minor pentatonic. Climb box 1 (5th fret) to the top string, then slide up into box 2 and come down it; up box 3, down box 4, up box 5. Then all the way back.',
        '- Each box shares its edge notes with the next: the slide is the rung of the ladder',
        '- Then go diagonally: two notes a string, shifting up a box every two strings, from the low A to the top',
      ] },
      { t: 'Pentatonic in fours', s: 'a sequence', drill: { bpm: 70, sub: 4, goal: '16ths at 110', from: '16ths at 70', drone: 'A' }, b: [
        'In box 1 of A minor pentatonic: four notes up from each note in turn (A C D E, C D E G, D E G A…), then the same coming down.',
        '- Then groups of three, then fives (count “u-ni-ver-si-ty” against the click)',
      ] },
      { t: 'Scale in 3rds', s: 'diatonic intervals', drill: { bpm: 70, sub: 2, goal: '8ths at 180', from: '8ths at 100', drone: 'C' }, b: [
        'C major in one position: C E, D F, E G, F A… up, then the same down (C A, B G, A F…).',
        '- Then 4ths, then 6ths',
        '- Alternate direction (up a 3rd, down the next) once it’s easy',
      ] },
      { t: 'Single-string scale', s: 'the Goodrick drill', drill: { bpm: 60, sub: 2, goal: '8ths at 140', from: '8ths at 80', drone: 'A' }, b: [
        'A Dorian up and down the G string only, from the open string to the 14th fret. Then improvise on that one string.',
        '- Rotate to every string',
        '- It cures box thinking: you see the scale as a line along the neck',
      ] },
      { t: 'maj7 arpeggio, three octaves', s: '1 3 5 7, up and back', drill: { bpm: 60, sub: 2, goal: '8ths at 160', from: 'quarters at 80', drone: 'G' }, b: [
        'Gmaj7 (G B D F♯) from G on the 6th string, fret 3, up three octaves to the 15th fret of the high E, two notes a string, sliding up as you go. Then back down.',
        '- Say the degree on every beat',
        '- Then start on the 3rd, the 5th and the 7th',
      ] },
      { t: 'm7 arpeggio, three octaves', s: '1 ♭3 5 ♭7', drill: { bpm: 60, sub: 2, goal: '8ths at 160', from: 'quarters at 80', drone: 'F' }, b: [
        'Fm7 (F A♭ C E♭) from F at the 1st fret of the low E, three octaves up to the 13th fret of the high E, and back.',
        '- Then the same shape from G and from A (it moves; the fingering doesn’t)',
      ] },
      { t: 'Dominant 7 arpeggio, three octaves', s: '1 3 5 ♭7', drill: { bpm: 60, sub: 2, goal: '8ths at 160', from: 'quarters at 80', drone: 'G' }, b: [
        'G7 (G B D F) from the 3rd fret of the low E, three octaves up and back.',
        '- Then land each octave’s top note on the beat',
        '- Then add the 9 (A): G B D F A, the 9th-chord arpeggio',
      ] },
      { t: 'ø7 arpeggio: the ♭5', s: '1 ♭3 ♭5 ♭7', drill: { bpm: 60, sub: 2, goal: '8ths at 150', from: 'quarters at 70', drone: 'A' }, b: [
        'Aø7 (A C E♭ G) from the 5th fret of the low E, two octaves up and back; then three octaves once it’s clean.',
        '- Hear the ♭5 against the drone: that’s the sound of iiø in a minor key',
        '- Then play Cm6 (C E♭ G A): the same four notes',
      ] },
      { t: '°7 arpeggio', s: 'minor 3rds all the way', drill: { bpm: 60, sub: 3, goal: 'triplets at 140', from: 'triplets at 70', drone: 'G' }, b: [
        'G°7 (G B♭ D♭ E) from the low G, three octaves. The shape repeats every 3 frets, so the same fingering climbs the neck.',
        '- Then on one string: each note three frets up',
        '- It’s four rootless 7♭9 chords at once: E♭7♭9, G♭7♭9, A7♭9 and C7♭9 (a root a major 3rd below any note)',
      ] },
      { t: 'Augmented arpeggio', s: 'major 3rds, every 4 frets', drill: { bpm: 60, sub: 3, goal: 'triplets at 140', from: 'triplets at 70', drone: 'C' }, b: [
        'C+ (C E G♯) up two octaves, then three once it’s clean. Symmetrical again: the shape repeats every 4 frets.',
        '- Then two augmented triads a whole step apart (C+ and D+): the whole-tone scale',
      ] },
      { t: 'Arpeggio from any chord tone', s: 'start and end anywhere', drill: { bpm: 60, sub: 2, goal: '8ths at 160', from: '8ths at 80', drone: 'C' }, b: [
        'Cmaj7 in one position: up from the root, then from the 3rd, the 5th and the 7th; each time end on a different chord tone.',
        '- It breaks the “always from the root” habit, which is what solos need',
      ] },
      { t: 'Diatonic 7ths, alternating', s: 'through the key', drill: { bpm: 60, sub: 2, goal: '8ths at 160', from: '8ths at 80', drone: 'C' }, b: [
        'In one position of C major: Cmaj7 up, Dm7 down, Em7 up, Fmaj7 down, G7 up, Am7 down, Bø7 up, Cmaj7 down.',
        '- Name each chord as you start it',
      ] },
      { t: 'Triads up one string set', s: 'all inversions', drill: { bpm: 60, sub: 1, goal: 'a shape per beat at 120', from: 'a shape per beat at 50', drone: 'C' }, b: [
        'C major on strings 3-2-1: root position, 1st, 2nd inversion and up again to the 12th fret, one shape per click. Then minor, then the other string sets.',
        '- Name the top note’s degree as you land each shape',
      ] },
      { t: 'Digital patterns through the key', s: '1-2-3-5', drill: { bpm: 60, sub: 4, goal: '16ths at 110', from: '16ths at 60', drone: 'C' }, b: [
        '1-2-3-5 on every degree of C major (C D E G, D E F A, E F G B…), up the key and back. Coltrane’s favourite cell.',
        '- Then 1-3-5-7 and 3-5-7-9 (arpeggios from the 3rd)',
      ] },
      { t: 'Enclosures', s: 'surround the target', drill: { bpm: 70, sub: 2, goal: '8ths at 200', from: '8ths at 100', drone: 'C' }, b: [
        'Target each chord tone of Cmaj7 (C, E, G, B) with the scale note above, the half step below, then the target on the beat.',
        '- Then below–above–target, and the chromatic double approach',
        '- The target always lands on the beat',
      ] },
      { t: 'Bebop scale down', s: 'chord tones on the beats', drill: { bpm: 80, sub: 2, goal: '8ths at 220', from: '8ths at 120', drone: 'G' }, b: [
        'G bebop dominant (G F♯ F E D C B A) down two octaves in 8ths from a chord tone on the beat. The passing F♯ keeps G, F, D and B on the beats.',
        '- Then start from B, D and F',
        '- 8ths at 200+ is bebop tempo',
      ] },
      { t: 'One position, 12 keys', s: 'by 4ths', drill: { bpm: 60, sub: 2, goal: '8ths at 160, two bars a key', from: '8ths at 80', drone: 'C' }, b: [
        'Stay between the 4th and 8th frets and play the major scale in C, F, B♭, E♭… round all 12 keys without leaving the window.',
        '- Each key changes only one note from the last: find it before you play',
      ] },
    ],
  },
  {
    id: 'menu', name: 'The Menu System', cards: [
      { t: 'The Menu System', s: 'superimposition, room by room', b: [
        'Each <b>room</b> is a chord and its scale. Each room has a few <b>superimpositions</b>: a shape you already own (a maj7, a triad, a pentatonic, a °7) played from another degree, so its notes land on the room’s tensions.',
        '- <b>Relative address</b>: the offset from the chord you’re on (“maj7 on the ♭3”)',
        '- <b>Absolute address</b>: where it sits in the key (“IVmaj7 of C”)',
        'Per room: arpeggio in three positions saying the resulting degrees; improvise with only that shape; take it round the cycle; then camp on the key.',
      ] },
      { t: 'Tier-one order', s: 'learn these first', b: [
        '- 1. maj7 on the ♭3 (m7 rooms)',
        '- 2. maj7 on the ♭7',
        '- 3. m7 on the 3 (maj7 rooms)',
        '- 4. maj7 on the 5 (Lydian)',
        '- 5. The destination’s harmonic minor, and the °7 grip (Phrygian dominant)',
        '- 6. dom7 on the ♭5 over 7alt, melodic minor on the ♭2, plus the catches and aliases',
        'Then tier two, then tier three as tunes call for them. ★ marks how much each one is worth.',
      ] },
      { t: 'Dorian', s: 'Dm7 in C · ii', b: [
        '- <b>maj7 on the ♭3</b> (Fmaj7): ♭3 5 ♭7 9 = Dm9 ★★★',
        '- <b>maj7 on the ♭7</b> (Cmaj7): ♭7 9 11 13 = Dm13 ★★★',
        '- <b>min pent on the 5</b> (A minor pent.): 5 ♭7 1 9 11 ★★',
        '<b>Catch</b>: none. A free room with no avoid notes; the ♭3 shape works on any m7 with a natural 9.',
      ], ex: [
        ['Fmaj7 over Dm7: Dm9', '=D3 C4 F4 | F4 | A4 | C5 | E5'],
        ['Cmaj7 over Dm7: Dm13', '=D3 C4 F4 | C4 | E4 | G4 | B4'],
      ] },
      { t: 'Ionian', s: 'Cmaj7 · I', b: [
        '- <b>m7 on the 3</b> (Em7): 3 5 7 9 = Cmaj9 ★★★',
        '<b>Catch</b>: the 4 is the avoid note over a held maj7. Lydian sidesteps it.',
      ], ex: [['Em7 over Cmaj7: Cmaj9', '=C3 B3 E4 | E4 | G4 | B4 | D5']] },
      { t: 'Lydian', s: 'Fmaj7 in C · IV', b: [
        '- <b>maj7 on the 5</b> (Cmaj7): 5 7 9 ♯11 = Fmaj9♯11 ★★★',
        '- <b>triad on the 2</b> (G): 9 ♯11 13 ★★',
        '- <b>min pent on the 7</b> (E minor pent.): 7 9 3 ♯11 13 ★★',
        '<b>Catch</b>: none. A free room.',
      ], ex: [['Cmaj7 over Fmaj7: Fmaj9♯11', '=F2 E3 A3 | C4 | E4 | G4 | B4'], ['G triad over Fmaj7', '=F2 E3 A3 | G4 | B4 | D5']] },
      { t: 'Mixolydian', s: 'G7 in C · V', b: [
        '- <b>maj7 on the ♭7</b> (Fmaj7): ♭7 9 11 13 = G13sus ★★',
        '- <b>triad on the ♭7</b> (F): ♭7 9 11 = G9sus ★★',
        '<b>Catch</b>: these carry the 11, which clashes with a comper’s 3rd. Free when you’re alone or the comper is listening.',
      ], ex: [['F triad over G: G9sus', '=G2 F3 C4 | F4 | A4 | C5']] },
      { t: 'Aeolian', s: 'Am7 in C · vi', b: [
        '- <b>maj7 on the ♭3</b> (Cmaj7): ♭3 5 ♭7 9 = Am9 ★★★',
        '- <b>maj7 on the ♭6</b> (Fmaj7): ♭6 1 ♭3 5 ★★',
        '<b>Catch</b>: maj7 on the ♭7 (Gmaj7) brings Dorian’s 6: wrong in a functional minor key, a deliberate colour on a vamp.',
      ], ex: [['Cmaj7 over Am7: Am9', '=A2 G3 C4 | C4 | E4 | G4 | B4']] },
      { t: 'Phrygian', s: 'Em7 in C · iii', b: [
        '- <b>maj7 on the ♭2</b> (Fmaj7): ♭9 11 ♭13 1 ★',
        '<b>Catch</b>: that’s four of the mode’s seven notes, not the whole mode. The ♭3 shape (Gmaj7) clashes here: its F♯ is a natural 9.',
      ], ex: [['Fmaj7 over Em7', '=E2 D3 G3 | F4 | A4 | C5 | E5']] },
      { t: 'Phrygian dominant', s: 'G7♭9 → Cm · V of minor', b: [
        '- <b>The destination’s harmonic minor</b> (C harmonic minor) ★★★',
        '- <b>°7 on the 3</b> (B°7 = the vii°7 of the target): 3 5 ♭7 ♭9 ★★★',
        '<b>Catch</b>: it’s the V of every minor key. Always land it on the minor tonic.',
      ], ex: [['B°7 over G7, landing on Cm6', '=G2 F3 B3 | B3 | D4 | F4 | Ab4 | C3 A3 Eb4 G4']] },
      { t: 'Locrian ♮2', s: 'Dø7 → G7alt → Cm · iiø', b: [
        '- <b>m6 on the ♭3</b> (Fm6): the same four notes as Dø7 ★★★',
        'Its parent is the melodic minor a minor 3rd up (F melodic minor).',
      ], ex: [['Fm6 over Dø7', '=D3 Ab3 C4 | F4 | Ab4 | C5 | D5']] },
      { t: 'Altered', s: 'G7alt → C', b: [
        '- <b>dom7 on the ♭5</b> (D♭7): ♯11 ♭7 ♭9 3 ★★★',
        '- <b>melodic minor on the ♭2</b> (A♭ melodic minor) ★★★',
        '- <b>major triad on the ♭6</b> (E♭): ♭13 1 ♯9 ★★',
        '- <b>minor triad on the ♭2</b> (A♭m): ♭9 3 ♭13 ★',
        '<b>Catch</b>: everything leans and nothing lands. Practise only with the target attached; each altered note resolves by half step on the downbeat.',
      ], ex: [['D♭7 over G7, resolving to Cmaj7', '=G2 F3 B3 | Db4 | F4 | Ab4 | B4 | C3 B3 E4 G4']] },
      { t: 'Lydian dominant', s: 'D♭7♯11 → C · the tritone sub', b: [
        '- <b>triad on the 2</b> (E♭): 9 ♯11 13 ★★',
        '- <b>Alias</b>: X7♯11 = the altered dominant a tritone away (D♭7♯11 = G7alt, same seven notes) ★★★',
        'Use it on tritone subs, ♭VII7 and II7. Parent: A♭ melodic minor.',
      ], ex: [['E♭ triad over D♭7', '=Db3 B3 F4 | Eb4 | G4 | Bb4']] },
      { t: 'Melodic minor tonic', s: 'Cm6 · i', b: [
        '- <b>triad on the 5</b> (G): 5 7 9 ★★',
        '- <b>Alias</b>: m6 = m7♭5 on the 6 (Cm6 = Aø7) ★',
        '<b>Catch</b>: the major 7 wants length or resolution. Don’t noodle through it.',
      ], ex: [['G triad over Cm6', '=C3 A3 Eb4 | G4 | B4 | D5']] },
      { t: 'Half-whole', s: 'G13♭9 → C', b: [
        '- <b>°7 on the ♭9</b> (A♭°7): ♭9 3 5 ♭7 ★★★',
        '- <b>Major triads on 1, ♭3, ♭5 and 6</b> (G, B♭, D♭, E) ★★',
        '- <b>Two dom7 arpeggios</b>, on 1 and ♭5 (G7 and D♭7) ★',
        '<b>Catch</b>: symmetric, so no gravity. Sequences in minor 3rds must land somewhere or they sound mechanical.',
      ], ex: [['E triad then B♭ triad over G7', '=G2 F3 B3 | E4 | G#4 | B4 | Bb4 | D5 | F5']] },
      { t: 'Whole tone', s: 'G7♯5 → C', b: [
        '- <b>Augmented triads on 1 and 2</b> (G+ and A+): together, the whole-tone scale ★',
        '<b>Catch</b>: two bars at most, then resolve.',
      ], ex: [['G+ then A+ over G7♯5, into C', '=G2 F3 B3 | G4 | B4 | D#5 | A4 | C#5 | F5 | C3 B3 E4 G4']] },
    ],
  },
);

// ---------- slash chords, unpacked: ten cards, placed right after the bass-line deck ----------
DECKS.splice(DECKS.findIndex((d) => d.id === 'bass') + 1, 0, {
  id: 'slash', name: 'Slash chords, unpacked', cards: [
    { t: 'Two different things', s: 'the question to ask', b: [
      'A slash chord is a chord over a bass note. Ask one question: <b>is the bass note in the chord?</b>',
      '- <b>Yes</b> (C/E, C/G): an <b>inversion</b>. Same chord, same job; only the bass line changes',
      '- <b>No</b> (D/C, F/G): a <b>new chord</b>. The triad on top and the bass make something richer than either',
      'Most confusion comes from treating these as the same thing.',
    ], ex: [['C/E (an inversion), then D/C (a new chord)', 'C:maj C:maj/3 C:maj D:maj/b7']] },
    { t: 'How to read any slash chord', s: 'three steps', b: [
      '- 1. Treat the bass as the root',
      '- 2. Name each note of the top chord as an interval over that bass',
      '- 3. Name the result',
      '<b>D/C</b>: over C, D is the 9, F♯ the ♯11, A the 13. So it’s C with 9, ♯11 and 13: a C Lydian sound.',
      'The bass gives the function; the triad gives the colour.',
    ], ex: [['C, then D/C, then C', 'C:maj D:maj/b7 C:maj']] },
    { t: 'Inversions make bass lines', s: '3rd, 5th or 7th in the bass', b: [
      '- <b>3rd in the bass</b> (C/E): light, moving; great for walking up or down by step',
      '- <b>5th in the bass</b> (C/G): unstable; a passing chord or a pedal',
      '- <b>7th in the bass</b> (C7/B♭): very unstable; the bass must fall a step',
      'Write the bass line first, then put the chords over it.',
    ], ex: [['C – G/B – Am: the bass walks down C, B, A', 'C:maj G:maj/3 A:min'], ['C – C/E – F: the bass walks up', 'C:maj C:maj/3 F:maj']] },
    { t: 'The cadential 6/4', s: 'I/5 is really a V', b: [
      'C/G before G7 isn’t really a C chord: it’s G with two suspensions (C and E) that fall to B and D. That’s why it sounds like an arrival at V, not at home.',
      'In classical theory it’s called I6/4. You hear it at the end of countless hymns and ballads.',
    ], ex: [['F – C/G – G7 – C', 'F:maj C:maj/5 G:7 C:maj']] },
    { t: 'The 7th in the bass', s: 'it has to fall', b: [
      'Put a dominant’s 7th in the bass and it wants to step down to the 3rd of the next chord.',
      '- G7/F → C/E',
      '- C7/B♭ → F/A',
      'It’s the smoothest way into a first-inversion chord.',
    ], ex: [['G7/F → C/E', 'G:7/b7 C:maj/3'], ['C – C7/B♭ – F/A', 'C:maj C:7/b7 F:maj/3']] },
    { t: 'The sus slash chords', s: 'a triad a whole step below the bass', b: [
      'A major triad a whole step below its bass is a 9sus4 chord: ♭7, 9 and 11 over the root, with no 3rd.',
      '- F/G = G9sus4',
      '- B♭/C = C9sus4',
      '- D/E = E9sus4',
      'That’s IV/V: a soft dominant, used everywhere from gospel to film to modal jazz.',
    ], ex: [['F/G → C', 'F:maj/2 C:maj'], ['B♭/C → F', 'Bb:maj/2 F:maj'], ['D/E → A', 'D:maj/2 A:maj']] },
    { t: 'The Lydian slash chords', s: 'a triad a whole step above the bass', b: [
      'A major triad a whole step above its bass gives 9, ♯11 and 13: the Lydian colour, bright and floating.',
      '- D/C over a C tonic',
      '- G/F on IV (it’s Fmaj7♯11 without the 3rd and 7th)',
      '- B♭/A♭ on a borrowed ♭VI',
    ], ex: [['C – D/C – C', 'C:maj D:maj/b7 C:maj'], ['F – G/F – C', 'F:maj G:maj/b7 C:maj']] },
    { t: 'Minor triads over a bass', s: 'three to know', b: [
      '- <b>A minor triad on the 6th</b>: Am/C = C6',
      '- <b>on the 3rd</b>: Em/C = Cmaj7',
      '- <b>on the 5th</b>: Gm/C = C9 with no 3rd, a suspended sound (Gm7/C adds the F: C9sus4, also called C11)',
      'So the chords you already know, played over a different bass, are the extended chords you’re trying to learn.',
    ], ex: [['Am/C, Em/C, Gm/C', 'A:min/b3 E:min/b6 G:min/4']] },
    { t: 'Slash chord or polychord?', s: 'over a bass note vs over a chord', b: [
      '<b>D/C</b> means a D triad over a C <i>bass note</i>. <b>D over C7</b> (written with a horizontal line) means a D triad over a whole C7 chord: C13♯11. These are the upper-structure triads, five worth knowing over any dominant:',
      '- <b>II</b> (D): 9 ♯11 13',
      '- <b>VI</b> (A): 13 ♭9 3',
      '- <b>♭III</b> (E♭): ♯9 5 ♭7',
      '- <b>♭VI</b> (A♭): ♭13 1 ♯9',
      '- <b>♭V</b> (G♭): ♯11 ♭7 ♭9',
    ], ex: [
      ['D over C7 (C13♯11), resolving to F', '=C3 E3 Bb3 D4 F#4 A4 | F2 C3 A3 F4', 'D/C7 → F'],
      ['A over C7 (C13♭9), resolving to F', '=C3 E3 Bb3 C#4 A4 | F2 C3 A3 F4', 'A/C7 → F'],
      ['A♭ over C7 (C7♯9♭13), resolving to Fm', '=C3 E3 Bb3 Eb4 Ab4 | F2 C3 Ab3 F4', 'A♭/C7 → Fm'],
    ] },
    { t: 'On the guitar', s: 'bass low, triad on top', b: [
      'Put the bass on the 6th or 5th string and the triad on three of the top four strings. Skip a string if you need to.',
      '- <b>D/C</b>: x3x232 (C on the 5th string, D triad on strings 3-2-1)',
      '- <b>F/G</b>: 3x3211 (G on the 6th string, F triad above)',
      '- <b>C/E</b>: 032010 (open C with E in the bass)',
      'Once you see “triad plus bass”, every upper-structure chord is a grip you already know.',
    ], ex: [['D/C, F/G, C/E as played', '=C3 A3 D4 F#4 | G2 F3 A3 C4 F4 | E2 C3 E3 G3 C4 E4', 'x3x232 – 3x3211 – 032010']] },
  ],
});

// ---------- modulation: the ways to change key, after the chromatic mediants ----------
DECKS.splice(DECKS.findIndex((d) => d.id === 'voicelead'), 0, {
  id: 'modulation', name: 'Changing key', cards: [
    { t: 'Visit or move?', s: 'tonicisation vs modulation', b: [
      'A secondary dominant <b>visits</b> a chord for a moment, and home doesn’t change. That’s tonicisation.',
      'A modulation <b>moves</b> home: the new tonic is confirmed with a cadence (ii–V–I or V–I), and you stay long enough to feel it.',
      '- One V–I is a visit; a ii–V–I and a few bars there is a move',
      '- The melody helps: once it uses the new key’s notes (F♯ for G), the ear accepts the move',
    ], ex: [
      ['A visit: C – A7 – Dm7 – G7 – C', 'C:maj7 A:7 D:m7 G:7 C:maj7'],
      ['A move to G, confirmed', 'C:maj7 F:maj7 A:m7 D:7 G:maj7 C:maj7 A:m7 D:7 G:maj7'],
    ] },
    { t: 'Closely related keys', s: 'one note away', b: [
      'Keys a sharp or flat apart, and their relative minors, share six of their seven notes. From C:',
      '- <b>Am</b>: no new notes',
      '- <b>G</b> and <b>Em</b>: F♯',
      '- <b>F</b> and <b>Dm</b>: B♭',
      'Moves to them sound smooth, almost like nothing happened. Bridges and second themes often go to IV, V or vi.',
    ], ex: [
      ['C → G, through D7', 'C:maj7 A:m7 D:7 G:maj7'],
      ['C → F, through C7', 'C:maj7 G:m7 C:7 F:maj7'],
      ['C → Em, through B7', 'C:maj7 F#:m7b5 B:7b9 E:m7'],
    ] },
    { t: 'The pivot chord', s: 'one chord, two keys', b: [
      'Find a chord that belongs to both keys. The ear hears it in the old key, and the next chord reveals it in the new one.',
      '- <b>C → G</b>: Am is vi in C and ii in G',
      '- <b>C → F</b>: Dm is ii in C and vi in F',
      '- <b>C → Am</b>: Dm is ii in C and iv in Am',
      'The recipe: old key, pivot, the new key’s V7, land and stay. Choose a pivot that’s a predominant (ii or IV) in the new key, so its V follows naturally.',
    ], ex: [
      ['C → G: C – F – Am (pivot) – D7 – G', 'C:maj7 F:maj7 A:m7 D:7 G:maj7'],
      ['C → F: C – Dm (pivot) – Gm7 – C7 – F', 'C:maj7 D:m7 G:m7 C:7 F:maj7'],
      ['C → Am: C – F – Dm (pivot) – E7 – Am', 'C:maj7 F:maj7 D:m7 E:7b9 A:m7'],
    ] },
    { t: 'Straight to the new ii–V', s: 'the jazz way', b: [
      'No pivot needed: the new key’s ii–V is strong enough to sell it by itself. Standards do this all the time.',
      '- The ii–V doesn’t have to relate to the old key at all',
      '- The further the key, the more you rely on the ii–V and the melody to make it convincing',
      '- To minor keys, use iiø7 – V7♭9',
    ], ex: [
      ['C → E♭: Fm7 – B♭7 – E♭', 'C:maj7 F:m7 Bb:7 Eb:maj7'],
      ['C → A: Bm7 – E7 – A', 'C:maj7 B:m7 E:7 A:maj7'],
      ['C → D♭: E♭m7 – A♭7 – D♭', 'C:maj7 Eb:m7 Ab:7 Db:maj7'],
      ['C → F♯m: G♯ø7 – C♯7♭9 – F♯m', 'C:maj7 G#:m7b5 C#:7b9 F#:m7'],
    ] },
    { t: 'The truck-driver’s change', s: 'up a step for the last chorus', b: [
      'Pop’s favourite lift: the whole song moves up a half or whole step for the final chorus.',
      '- <b>The blunt way</b>: just jump. It works because the listener knows the tune',
      '- <b>The smooth way</b>: end the old section on the new key’s V7 (A♭7 before D♭, A7 before D)',
    ], ex: [
      ['Straight up a whole step', 'C:maj F:maj G:maj C:maj D:maj G:maj A:maj D:maj'],
      ['Up a half step, through A♭7', 'C:maj F:maj G:maj C:maj Ab:7 Db:maj Gb:maj Ab:maj Db:maj'],
      ['Up a whole step, through A7', 'C:maj F:maj G:maj A:7 D:maj G:maj A:maj D:maj'],
    ] },
    { t: 'Common-tone modulation', s: 'hold one note, move the rest', b: [
      'Keep one note sounding while the harmony shifts under it. The held note makes even a distant key feel connected.',
      '- C → E♭ keeps G; C → A♭ keeps C',
      '- C → E keeps E; C → A keeps E',
      'These are the chromatic mediants. Hold the note on top, then confirm the new key with a cadence.',
    ], ex: [
      ['C → E♭, G held on top', '=C3 G3 E4 G4 | Eb3 Bb3 Eb4 G4', 'C → E♭'],
      ['C → A♭, C held on top', '=C3 E3 G3 C4 | Ab2 Eb3 Ab3 C4', 'C → A♭'],
      ['Then confirm A♭: C – A♭ – D♭ – E♭7 – A♭', 'C:maj Ab:maj Db:maj Eb:7 Ab:maj'],
    ] },
    { t: 'Parallel: major ↔ minor', s: 'same tonic, new mode', b: [
      'Keep the tonic and switch the mode: C major → C minor. E, A and B become E♭, A♭ and B♭.',
      '- A bar of it is modal interchange; staying there is a modulation',
      '- Minor → major is the brighter turn, the Picardy third stretched into a whole section',
    ], ex: [
      ['C major, then C minor', 'C:maj7 F:maj7 G:7 C:maj7 C:m7 F:m7 G:7b9 C:m6'],
      ['A minor, then A major', 'A:m7 D:m7 E:7 A:m7 A:maj7 D:maj7 E:7 A:maj7'],
    ] },
    { t: 'Relative: major ↔ minor', s: 'same notes, new home', b: [
      'C major and A minor share every note, so the move is about which chord feels like home.',
      '- <b>To the minor</b>: you need its V7 with the raised 7th (E7, with G♯). Without it, Am just sounds like vi',
      '- <b>To the major</b>: G7 → C does it; the minor’s ♭III becomes I',
    ], ex: [
      ['C → Am: E7 makes it real', 'C:maj7 F:maj7 B:m7b5 E:7b9 A:m7'],
      ['Am → C: G7 does it', 'A:m7 D:m7 G:7 C:maj7'],
      ['Without E7, Am is just vi', 'C:maj7 F:maj7 G:7 A:m7'],
    ] },
    { t: 'The °7 pivot', s: 'one chord, four keys', b: [
      'Any note of a °7 can be the leading tone, so one °7 leads to four keys a minor 3rd apart.',
      '- B°7 (B D F A♭) → C (B leads), E♭ (D leads), G♭ (F leads), A (A♭ = G♯ leads)',
      'Arrive in the old key, play the °7, and resolve it into whichever key you want. Then confirm with a cadence.',
    ], ex: [
      ['B°7 → C: home', 'C:maj7 B:dim7 C:maj7'],
      ['B°7 → E♭, confirmed', 'C:maj7 B:dim7 Eb:maj7 F:m7 Bb:7 Eb:maj7'],
      ['B°7 → A, confirmed', 'C:maj7 B:dim7 A:maj7 B:m7 E:7 A:maj7'],
    ] },
    { t: 'The German-sixth pivot', s: 'a dominant in disguise', b: [
      'A♭7 is V7 of D♭. Respell its G♭ as F♯ and it’s a German sixth in C: A♭ falls to G, F♯ rises to G.',
      '- <b>D♭ → C</b>: in D♭, A♭7 is V7; heard as a German sixth, it goes to C/G – G7 – C',
      '- <b>C → D♭</b>: in C, ♭VI7 (A♭7) can turn out to be D♭’s V7',
      'It’s a half-step modulation that sounds inevitable, because the chord is the same.',
    ], ex: [
      ['D♭ → C: A♭7 as a German sixth', 'Db:maj Gb:maj Ab:7 C:maj/5 G:7 C:maj'],
      ['C → D♭: A♭7 as V7 of D♭', 'C:maj F:maj Ab:7 Db:maj'],
    ] },
    { t: 'Sequences', s: 'the same phrase in a new key', b: [
      'Play a phrase, then play it again a step lower (or higher). The repetition is the preparation: the ear expects the pattern.',
      '- <b>“Tune Up”</b>: ii–V–I in D, then C, then B♭',
      '- <b>“How High the Moon”</b>: G, then F, then E♭, each reached with a ii–V',
      '- The ii–V chain drill (round the cycle) is the same idea',
    ], ex: [
      ['“Tune Up” shape: D, C, B♭', 'E:m7 A:7 D:maj7 D:maj7 D:m7 G:7 C:maj7 C:maj7 C:m7 F:7 Bb:maj7 Bb:maj7'],
      ['“How High the Moon” shape: G, F, E♭', 'G:maj7 G:m7 C:7 F:maj7 F:m7 Bb:7 Eb:maj7'],
    ] },
    { t: 'Where tunes go', s: 'common destinations', b: [
      '- <b>To IV</b> for the bridge: I7 → IV, or a ii–V into IV (“Satin Doll”)',
      '- <b>Up a half step</b>: the bridge of “Body and Soul” (D♭ → D)',
      '- <b>By major 3rds</b>: the bridge of “Have You Met Miss Jones” (B♭ → G♭ → D), and “Giant Steps”',
      '- <b>Down a whole step</b>: sequences (“Tune Up”)',
      '- <b>To the relative or parallel minor</b>, for a darker middle section',
    ], ex: [
      ['To IV and on: Gm7 – C7 – F, Am7 – D7 – G', 'C:maj7 G:m7 C:7 F:maj7 A:m7 D:7 G:7'],
      ['Up a half step: D♭ → D', 'Eb:m7 Ab:7 Db:maj7 E:m7 A:7 D:maj7'],
      ['By major 3rds: B♭ → G♭ → D, then back', 'Bb:maj7 Ab:m7 Db:7 Gb:maj7 E:m7 A:7 D:maj7 G:m7 C:7'],
    ] },
    { t: 'Getting back', s: 'make it stick, then come home', b: [
      'A new key only feels real after a cadence and a few bars. Getting home uses the same tools in reverse.',
      '- The commonest way home: the old key’s ii–V, however far away you went',
      '- Or reverse the pivot: a chord the two keys share, then home’s V7',
      '- A °7 or a common tone works just as well on the way back',
    ], ex: [
      ['Out to E♭ and back', 'C:maj7 F:m7 Bb:7 Eb:maj7 Eb:maj7 D:m7 G:7 C:maj7'],
      ['Out to G and back, Am7 pivoting both ways', 'C:maj7 A:m7 D:7 G:maj7 A:m7 D:m7 G:7 C:maj7'],
    ] },
  ],
});

// ---------- extra body lines and examples for the cards that were too thin ----------
// [deck, title, { b: lines appended, ex: examples appended, cap: a caption for the card's own play when ex is added }]
const SPRUCE = [
  ['reharm', 'Backdoor', { b: [
    'Swap ii – V for iv7 – ♭VII7. Both come from the parallel minor, and they land on I from a whole step below instead of a 5th above.',
    '- Fm7 → B♭7: A♭ holds (it becomes B♭7’s 7th), E♭ falls to D',
    '- B♭7 → C: A♭ falls to G, D rises to E',
    '- Check the melody: a B or an A clashes with these chords',
  ], ex: [['As a turnaround: C – Fm7 – B♭7 – C', 'C:maj7 F:m7 Bb:9 C:maj7'], ['Just the ♭VII7: Dm7 – B♭7 – C', 'D:m7 Bb:7 C:maj7']] }],
  ['tritone', 'Sub the ii as well', { b: [
    'A♭m7 – D♭7 is the ii–V of G♭; it just sidesteps to C instead.',
    '- In a row, the subbed ii–Vs walk down by half steps: Em7 A7 | E♭m7 A♭7 | Dm7 D♭7 | C',
  ], cap: 'A♭m7 – D♭7 – C', ex: [['A ii–V, then the same a half step down', 'A:m7 D:7 Ab:m7 Db:7 C:maj7'], ['Chromatic ii–Vs down to C', 'E:m7 A:7 Eb:m7 Ab:7 D:m7 Db:7 C:maj7']] }],
  ['tritone', 'Chromatic chains', { b: [
    '- Or sub the other half: B♭7 – A7 – A♭7 – G7 – C',
    '- Or all of them: B♭7 – E♭7 – A♭7 – D♭7 – C (roots still falling in 5ths)',
    'The guide tones are the same either way, so a guitarist can keep comping the original chain while the bass plays the subs.',
  ], cap: 'E7 – E♭7 – D7 – D♭7 – C', ex: [['The other half: B♭7 – A7 – A♭7 – G7', 'Bb:7#11 A:7 Ab:7#11 G:7 C:maj7'], ['All four subbed', 'Bb:7 Eb:7 Ab:7 Db:7 C:maj7']] }],
  ['reharm', 'Add a ii', { b: [
    'The ii is a 5th above its V: Dm7 before G7, Am7 before D7, Bø7 before E7 (into a minor chord).',
    '- Split a long V7 into two beats of ii and two of V, or a bar of each',
    '- Secondary dominants take one too: C – A7 becomes C – Em7 A7',
  ], ex: [['A chain of dominants, each given its ii', 'C:maj7 A:7 D:7 G:7 C:maj7 E:m7 A:7 A:m7 D:7 D:m7 G:7 C:maj7']] }],
  ['other', 'Tonic colours', { b: [
    'No natural 11 on a major I: F sits a ♭9 above the 3rd (E) and rubs. Use ♯11 for a Lydian tonic.',
    'In minor, m7 works mid-tune, but m6 and m(maj7) sound more final.',
  ], cap: 'Dm7 – G13 – C6/9', ex: [['Major endings: C6/9, Cmaj9, Cmaj7♯11', 'C:6/9 C:maj9 C:maj7#11'], ['Minor endings: Cm6, Cm(maj7), Cm9', 'C:m6 C:mMaj7 C:m9']] }],
  ['solo', 'Sing it first', { b: [
    '- Sing each chord’s root as it goes by, then its 3rd',
    '- Then a guide-tone line: one note per chord, moving by step',
    '- Then sing a short phrase and find it on the neck without hunting',
  ] }],
  ['gospel', 'The gospel turnaround', { b: [
    'The bass walks C – E – F – F♯ – G, then falls in 5ths: A – D – G.',
    '- I7/3 points to IV, ♯iv°7 climbs to I/5, VI7 pulls to ii',
  ], ex: [['With gospel colours', 'C:6/9 C:7/3 F:maj9 F#:dim7 C:maj/5 A:7b9 D:m9 G:13']] }],
  ['nopull', 'Practise it', { b: [
    '- Then over a C drone, an F drone, and on round the keys',
  ], cap: 'G → C7 → G → F7 → G', ex: [['G → E♭7 → G → A♭7 → G', 'G:maj7 Eb:7#11 G:maj7 Ab:7#11 G:maj7'], ['All four, back to back', 'G:maj7 C:7#11 G:maj7 F:7#11 G:maj7 Eb:7#11 G:maj7 Ab:7#11 G:maj7']] }],
  ['gospel', 'The minor plagal “amen”', { b: [
    'The A in F becomes A♭ in Fm, and A♭ falls to G as you land on C: the ♭6 sighing down to the 5th.',
    '- Often over a C pedal: F/C – Fm/C – C',
  ], ex: [['Over a C pedal', 'F:maj/5 F:min/5 C:maj']] }],
  ['reharm', 'Start from the melody', { b: [
    '- Melody on a chord tone: always safe',
    '- On a 9, ♯11 or 13 (11 on a minor chord): colour',
    '- A half step above a chord tone (F over E): a clash, unless it’s a dominant’s ♭9',
    'Practise: take one melody note and find every chord that can hold it.',
  ], ex: [['One melody note (E), six chords under it', '=C3 G3 B3 E4 | A2 G3 C4 E4 | F2 C3 A3 E4 | D3 F#3 C4 E4 | G2 F3 B3 E4 | Bb2 Ab3 D4 E4', 'Cmaj7 · Am7 · Fmaj7 · D9 · G13 · B♭7♯11']] }],
  ['gospel', 'The 4 with a ♯4°', { b: [
    'F♯°7 is a rootless D7♭9: V7/V in disguise. It resolves to C/G, which is really V with two suspended notes (the cadential 6/4), so G7 follows.',
  ], ex: [['The full cadence: F – F♯°7 – C/G – G7 – C', 'F:maj7 F#:dim7 C:maj/5 G:7 C:maj'], ['From I7: C – C7 – F – F♯°7 – C/G', 'C:maj C:7 F:maj F#:dim7 C:maj/5']] }],
  ['reharm', 'Diatonic substitution', { b: [
    'Why it works: Cmaj7 (C E G B), Em7 (E G B D) and Am7 (A C E G) share most of their notes.',
    '- Check the melody: a C in the tune rubs against Em7, but sits fine in Am7',
  ], ex: [['I → vi on the second bar', 'C:maj7 A:m7 D:m7 G:7'], ['IV → ii', 'C:maj7 D:m7 G:7 C:maj7']] }],
  ['gospel', 'The 1 to the 4', { b: [
    'It’s V7/IV: B → B♭ turns home into a dominant for a beat.',
    '- The bass often walks C – E – F: I – I7/3 – IV',
  ], ex: [['With the 3rd in the bass: C – C7/E – F', 'C:maj C:7/3 F:maj'], ['There and back: C – C7 – F – Fm – C', 'C:maj C:7 F:maj F:min C:maj']] }],
  ['melmin', 'Find the scale fast', { b: [
    '- sus♭9: down a whole step',
    'Learn melodic minor in a few shapes and you have seven chords. The most used trick: 7alt is melodic minor a half step up.',
  ] }],
  ['mediants', 'Doubly chromatic', { b: [
    'C → A♭m: C falls to C♭ (B), E falls to E♭, G rises to A♭. Every voice moves by a half step.',
  ], cap: 'C → A♭m → C', ex: [['C → E♭m → C', 'C:maj Eb:min C:maj'], ['Both, back to back', 'C:maj Ab:min C:maj Eb:min C:maj']] }],
  ['forms', 'ABAC', { b: [
    '- 8 bars each: A, B, A again (bar 17 is bar 1), then C heads for the final cadence',
    '- Also “On Green Dolphin Street”, “There Will Never Be Another You”, “Out of Nowhere”',
  ] }],
  ['blues', 'The 8-bar blues', { b: [
    'There’s a gospel version too: I – I7 – IV – ♯iv°7 – I/5 – VI7 – II7 V7 – I.',
  ], ex: [['The gospel 8-bar', 'C:7 C:7 F:7 F#:dim7 C:maj/5 A:7 D:7 G:7 C:7']] }],
  ['tritone', 'Play 7♯11 on them', { b: [
    '- Never the natural 11 (G♭ over D♭7): it rubs against the 3rd',
    '- The ♯11 (G) on top holds right into C',
  ], ex: [['G held on top: D♭7♯11 → C', '=Db3 B3 F4 G4 | C3 B3 E4 G4', 'D♭7♯11 → Cmaj7'], ['ii – ♭II7♯11 – I', 'D:m7 Db:7#11 C:maj7']] }],
  ['twofive', 'Drill it round the cycle', { b: [
    '- Also down in whole steps: C, B♭, A♭… (two cycles of six)',
    '- And in minor: Dø7 – G7♭9 – Cm6, then Cø7 – F7♭9 – B♭m6',
  ], cap: 'Dm7 – G7 – Cmaj7, then Cm7 – F7 – B♭maj7', ex: [['Down in whole steps', 'D:m7 G:7 C:maj7 C:m7 F:7 Bb:maj7 Bb:m7 Eb:7 Ab:maj7'], ['Minor round the cycle', 'D:m7b5 G:7b9 C:m6 C:m7b5 F:7b9 Bb:m6']] }],
  ['bass', 'Chromatic approach', { b: [
    '- From below sounds like a leading tone; from above, like a tritone sub. Mix them',
    '- Or approach by the next root’s 5th: G before C, A before D',
  ], ex: [['A walking line, each root approached from a half step away', '=C3 | E3 | G3 | C#3 | D3 | F3 | A3 | Ab3 | G3 | F3 | D3 | Db3 | C3']] }],
  ['gospel', '7 – 3 – 6', { b: [
    'Bø7 – E7 – Am is a minor ii–V–i into the vi. Gospel keeps it going: 7 – 3 – 6 – 2 – 5 – 1.',
  ], ex: [['7 – 3 – 6 – 2 – 5 – 1', 'B:m7b5 E:7b9 A:m9 D:m9 G:13 C:maj9']] }],
  ['blues', 'The Bird blues', { b: [
    '- Bar 1 is Imaj7, not I7, then ii–Vs fall from Bø7 – E7 to Gm7 – C7 (the V of IV)',
    '- Bars 6–8 fall by half steps: Fm7 B♭7 | Em7 A7 | E♭m7 A♭7, into Dm7',
  ], ex: [['Bars 9–12', 'D:m7 G:7 C:maj7 A:7 D:m7 G:7']] }],
  ['modes', 'Lydian dominant', { b: [
    'Put the ♯11 (F♯ over C7) on top: it’s the note that makes it Lydian dominant.',
    '- A D triad over C (D/C) gives the 9, ♯11 and 13 in one grip',
  ], ex: [['C9 – D/C: the triad on top', 'C:9 D:maj/b7 C:9 D:maj/b7']] }],
  ['reharm', 'Tritone sub', { b: [
    'Check the melody: a G over G7 becomes the ♯11 of D♭7 (fine); a D becomes D♭7’s ♭9 (harsh).',
    '- Secondary dominants can be subbed too: A7 → E♭7',
  ], ex: [['Subbing a secondary dominant too', 'C:maj7 Eb:7#11 D:m7 Db:7#11 C:maj7']] }],
  ['dim', '♯iv°7 back to the tonic', { b: [
    'C♯°7 is a rootless A7♭9, the V of V. Instead of going to D, it goes to G/D (the cadential 6/4), which is really D on the way to G.',
  ], ex: [['Same move, carrying on: C – C♯°7 – G/D – E7 – Am7 – D7 – G', 'C:maj7 C#:dim7 G:maj/5 E:7b9 A:m7 D:7 G:maj7']] }],
  ['solo', 'Motifs and space', { b: [
    '- Keep the rhythm, change the notes',
    '- Ask and answer: a phrase, then a reply to it',
  ] }],
  ['voicelead', 'Upper-structure triads', { b: [
    'Play the shell (3rd and ♭7) low and the triad on top. The triad’s root names the colour: II (A) is Lydian dominant, VI (E) is 13♭9, ♭VI (E♭) and ♭V (D♭) are altered.',
  ] }],
  ['map', 'Harmonic minor’s 5th mode', { b: [
    'Its ♭2 and 3 are an augmented 2nd apart (F to G♯ on E): that gap is the Spanish sound.',
  ] }],
  ['blues', 'The quick change', { b: [
    '- Bar 4 often becomes I7♯9 to push into IV7 in bar 5',
  ], ex: [['The whole 12 with the quick change', 'C:7 F:7 C:7 C:7 F:7 F:7 C:7 C:7 G:7 F:7 C:7 G:7']] }],
  ['forms', 'Rhythm changes: the bridge', { b: [
    '- Players often add the ii to each: Bm7 E7 | Em7 A7 | Am7 D7 | Dm7 G7',
    '- Or tritone-sub every other one: E7 E♭7 D7 D♭7',
  ], ex: [['With each ii added', 'B:m7 E:7 E:m7 A:7 A:m7 D:7 D:m7 G:7 C:maj7'], ['With tritone subs', 'E:7 Eb:7#11 D:7 Db:7#11 C:maj7']] }],
  ['bass', 'The minor bass line', { b: [
    'The bass falls A – G – F♯ – F: a line cliché moved to the bottom. It usually carries on to E7.',
  ], ex: [['On to E7 and home', 'A:min A:min/b7 A:min/6 F:maj7 E:7 A:min']] }],
  ['diatonic', 'Harmonic minor’s 7ths', { b: [
    'In C: Cm(maj7) – Dø7 – E♭maj7♯5 – Fm7 – G7 – A♭maj7 – B°7. The gap from A♭ up to B (an augmented 2nd) gives the scale its sound.',
  ] }],
  ['diatonic', 'Melodic minor’s 7ths', { b: [
    'In C: Cm(maj7) – Dm7 – E♭maj7♯5 – F7 – G7 – Aø7 – Bø7.',
  ] }],
  ['types', '7♯5', { b: [
    '<b>Built</b>: an augmented triad plus a ♭7. Call it ♯5 when it rises to the next chord’s 3rd, ♭13 when the 5th is there too.',
  ], ex: [['Into minor, the ♯5 (D♯ = E♭) holds as Cm’s 3rd', 'D:m7b5 G:7#5 C:m6']] }],
  ['forms', 'AABA', { b: [
    '- The second A ends with a cadence home; the bridge goes elsewhere, often to IV or a key a 3rd away',
  ] }],
  ['reharm', 'Side-slipping', { b: [
    'It works because every voice, bass included, moves a half step. It’s especially common into V: A♭7 → G7.',
  ] }],
  ['forms', 'The bridge', { b: [
    '- To IV (“Satin Doll”), up a half step (“Body and Soul”), by major 3rds (“Have You Met Miss Jones”), or through dominants (rhythm changes)',
  ], ex: [['A bridge to IV, then V', 'G:m7 C:7 F:maj7 F:maj7 A:m7 D:7 G:7 G:7']] }],
  ['nopull', 'Follow the guide tones', { ex: [['E♭7 → D7 → G: both guide tones fall', 'G:maj7 Eb:7#11 D:7 G:maj7'], ['A♭7 → G: C falls to B, G♭ (= F♯) holds', 'A:m7 Ab:7#11 G:maj7']] }],
];
for (const [deck, title, add] of SPRUCE) {
  const c = DECKS.find((d) => d.id === deck)?.cards.find((x) => x.t === title);
  if (!c) { console.warn('no card', deck, title); continue; }
  if (add.b) c.b = [...(c.b || []), ...add.b];
  if (add.ex) {
    const own = c.play ? [[add.cap || 'The example', c.play]] : [];
    c.ex = [...(c.ex || []), ...own, ...add.ex]; delete c.play;
  }
}

// cards about guide tones show their examples as shells (root, 3rd, 7th) on the neck
for (const [deck, title] of [['twofive', 'Guide tones'], ['voicelead', 'Guide tones and shells'], ['voicelead', 'The tritone in V7'], ['nopull', 'Follow the guide tones'], ['solo', 'Guide-tone lines'], ['twofive', 'Voice-lead it']]) {
  const c = DECKS.find((d) => d.id === deck)?.cards.find((x) => x.t === title);
  if (c) c.grip = 'shell'; else console.warn('no card', deck, title);
}

// ---------- fuller cards: on a phone most cards had room for much more, so each thin one gets what a teacher would add
// (chord by chord, why it works, how to play it and solo over it, where you hear it). Appended like SPRUCE. ----------
const SPRUCE2 = [
['blues', 'Blues turnarounds', { b: [
    'VI7 is V7 of ii, so I – VI7 – ii – V is a chain of chords falling in 5ths back to I.',
    'In the tritone version each chord is a tritone from the one it replaces: E♭7 for A7, A♭7 for D7, D♭7 for G7. D♭7 then slides down a half step into C.',
    '- <b>Guitar</b>: the classic Delta turnaround is a chromatic line falling on the top strings against the tonic, landing on V7',
    '- <b>Solo</b>: aim for each chord’s 3rd on beat 1: E over C7, C♯ over A7, F over Dm7, B over G7',
    'The mistake to avoid: ending bar 12 on I7 when the tune repeats. The V7 (or its substitute) sends you back to bar 1; save I7 for the last chorus.',
  ], ex: [
    ['I – IV7 – I – V7: the blues player’s version', 'C:7 F:7 C:7 G:7'],
    ['I – VI7 – II7 – V7: all dominants', 'C:7 A:7 D:7 G:7 C:7'],
  ] }],

  ['progs', 'I – vi – IV – V', { b: [
    'Chord by chord: I is home; vi shares two notes with it (C and E), so the colour darkens without moving far; IV is the predominant; V pulls back to I.',
    'The bass C – A – F – G falls in 3rds, then steps up to V.',
    '- <b>Play</b>: open C, Am, F, G. In doo-wop each chord often gets two beats, with a slow triplet feel',
    '- <b>Solo</b>: the major pentatonic fits the whole loop; for a melody, land on each chord’s 3rd as it arrives (E, C, A, B)',
    '- <b>Hear it</b>: “Earth Angel” and countless ’50s ballads',
    'Variation: make vi an A7 (VI7) and it points harder at the next chord.',
  ] }],

  ['bass', 'Walking up to IV', { b: [
    'Why it works: C/E puts E in the bass, a half step under F, so the step E – F leads into IV like a leading tone.',
    'C/E is also less stable than root-position C, so the ear hears it as passing, not as a new arrival.',
    '- <b>Play</b>: the open C chord with the open low E string added is C/E, and F at the 1st fret is one fret away',
    '- Make it C7/E (add the B♭) and it points even harder at F: that’s V7 of IV with its 3rd in the bass',
    'A staple of country, gospel and hymns. Keep the top voices still and let the bass move; if every voice jumps, the walk disappears.',
  ], ex: [
    ['With C7/E: a stronger pull', 'C:maj C:7/3 F:maj'],
  ] }],

  ['forms', 'Rhythm changes: the A section', { b: [
    '- <b>Bars 1–4</b>: two I – vi – ii – V turnarounds, two beats per chord. VI7 (A7) often replaces vi to point at ii',
    '- <b>Bars 5–6</b>: I7 is V7 of IV; then IV turns minor (iv), or goes to ♯iv°7 (F♯°7) instead',
    '- <b>Bars 7–8</b>: back to I (or I/5 after ♯iv°7), then V – I; the first A turns round, the second ends on I for the bridge',
    '<b>Comp</b>: at bebop tempos, three-note shells (root, 3rd, 7th) on strings 6, 4, 3 and 5, 4, 3 keep up.',
    '<b>Solo</b>: treat bars 1–4 as one key and play through them, then mark bars 5–6 with B♭ over C7 and A♭ over Fm7.',
    'Usually in B♭: “Oleo” and “Anthropology” are rhythm changes.',
  ] }],

  ['bass', 'The descending bass', { b: [
    'Bass: C – B – A – G – F – E – D, then G. Each chord takes the bass as its root (Am, F, Dm) or as an inversion: G/B has G’s 3rd under it, C/G and C/E have C’s 5th and 3rd.',
    'Why it works: the stepwise bass is a melody of its own, and the upper voices hold common tones, so it sounds like one long line.',
    '- <b>Play</b>: keep the bass on the 6th and 5th strings and move as few top notes as you can between grips',
    '- <b>Variation</b>: C – Cmaj7/B – Am holds the C chord over the B instead of using G/B',
    '- <b>Shorter</b>: stop at IV (C – G/B – Am – G – F), then G – C to finish',
  ], ex: [
    ['The short version, down to IV', 'C:maj G:maj/3 A:min G:maj F:maj G:maj C:maj'],
  ] }],

  ['progs', 'i – ♭VI – ♭III – ♭VII', { b: [
    'Chord by chord in A minor: Am (i) is home; F (♭VI) keeps A and C; C (♭III) is the relative major; G (♭VII) leads back up a whole step.',
    'Why it sounds modal: ♭VII – i has no G♯ leading tone, so it pulls more softly than E7 – Am. That’s the rock sound rather than the classical one.',
    '- <b>Play</b>: open Am, F (or Fmaj7 for an easier grip), C, G; or power chords A5 – F5 – C5 – G5',
    '- <b>Solo</b>: A natural minor or A minor pentatonic covers all four. Target each chord’s 3rd: C over Am, A over F, E over C, B over G',
    '- <b>Hear it</b>: “Zombie” by The Cranberries uses the same loop in E minor',
  ] }],

  ['progs', 'The Andalusian cadence', { b: [
    'The bass A – G – F – E falls a 4th in steps, and the last step, F – E, is a half step.',
    'E major borrows G♯ from harmonic minor; G♯ – A is what pulls back to i.',
    'In flamenco the E chord is heard as home: the cadence lands on E, in E Phrygian.',
    '- <b>Solo</b>: A natural minor over Am – G – F, then A harmonic minor over E (the same notes as E Phrygian dominant)',
    '- <b>Hear it</b>: “Runaway” (Del Shannon) and “Walk, Don’t Run”',
  ] }],

  ['progs', 'Major ii–V–I, then minor', { b: [
    'Chord by chord: Am7 – D7 – Gmaj7 is ii – V – I in G; Cmaj7 is IV of G (and ♭VI of E minor); F♯ø7 – B7 – Em is iiø – V7 – i in E minor.',
    'Cmaj7 to F♯ø7 is the hinge: the one root move that’s a tritone, not a 5th, and it turns the music toward the minor key.',
    '- <b>Guide tones</b>: C – C – B – B – A – A – G, the 3rd or 7th of each chord in turn, falling by step through all seven',
    '- <b>Comp</b>: with shells the roots alternate 6th and 5th strings, so the whole sequence stays around frets 2–5',
    '- <b>Solo</b>: G major (E natural minor, same notes) over the first five chords; E harmonic minor over B7 for the D♯',
  ] }],

  ['gospel', '3 – 6 – 2 – 5 – 1', { b: [
    'Each dominant is V7 of the next root: E7 points to A, A7 to D, D7 to G, G7 to C.',
    'Two inner lines fall by half steps: G♯ – G – F♯ – F – E and D – C♯ – C – B. Each chord’s 3rd becomes the next one’s 7th.',
    '- <b>Comp</b>: alternate 5th- and 6th-string roots and you hardly move: E7 (5th string, 7th fret), A7 (6th, 5th), D7 (5th, 5th), G7 (6th, 3rd), C (5th, 3rd)',
    '- <b>Colour</b>: ♭9 and ♯9 add grit on the dominants; 9ths and 13ths smooth them',
    'In ragtime and early jazz the all-dominant version is called the ragtime progression.',
  ] }],

  ['progs', 'IV – V – iii – vi', { b: [
    'Chord by chord in C: Fmaj7 (IV) and G7 (V) build tension; Em7 (iii) is a soft, deceptive landing that shares G, B and D with G7; Am (vi) is the minor resolution.',
    'Em7 – Am is a falling 5th, the same motion as V – I, which is why vi feels like a landing.',
    '- <b>With E7</b>: G♯ leads up to A, a stronger, more dramatic pull to vi',
    '- <b>Solo</b>: C major or A minor pentatonic over all four; over E7 add G♯ (A harmonic minor)',
    '- <b>Variation</b>: keep going, IV – V – iii – vi – ii – V – I, to finally land home',
  ] }],

  ['progs', 'The Canon', { b: [
    'The bass works in pairs: C – G, A – E, F – C, each falling a 4th, and each pair starting a 3rd lower. F – G closes it.',
    'Every chord is diatonic, so nothing jars; the pull comes from the repeating bass pattern.',
    '- <b>With inversions</b>: C – G/B – Am – Em/G – F – C/E – F – G lets the bass fall by step',
    '- <b>Over it</b>: a line falling down the scale fits, E – D – C – B – A – G – A – B, each note a 3rd or 5th of its chord',
    'The original, in D, is a ground bass: the same eight notes repeat while the upper parts vary.',
  ], ex: [
    ['With a stepwise bass', 'C:maj G:maj/3 A:min E:min/b3 F:maj C:maj/3 F:maj G:maj'],
  ] }],

  ['bass', 'Pedal points', { b: [
    'Why it works: the bass is a fixed reference, so chords above it are heard as tension over home, not as new keys. G/C is G B D over C: the 5th, 7th and 9th of C.',
    'A dominant pedal builds expectation: everything over G sounds unresolved until the bass finally moves to C.',
    '- <b>Play</b>: in A or E the open 5th or 6th string makes an easy pedal; in C, hold C on the 5th string, 3rd fret, and move triads on the top three strings',
    '- <b>Hear it</b>: intros and endings, gospel vamps, and the long dominant pedal before a ballad’s last chorus',
    'The effect depends on the bass staying put, so don’t let it walk.',
  ] }],

  ['progs', 'I – V – vi – IV', { b: [
    'Chord by chord: I home; V moves away; vi is the relative minor; IV is the predominant, and IV – I closes the loop with a plagal move.',
    'The bass C – G – A – F: down a 4th, up a step, down a 3rd.',
    '- <b>Play</b>: open C, G, Am, F; or G – D – Em – C, the same progression in G and the easiest on guitar',
    '- <b>Solo</b>: C major pentatonic (A minor pentatonic) fits every chord; end phrases on C over I and on A over vi',
    '- <b>Hear it</b>: “Let It Be”, “With or Without You”, “No Woman, No Cry”',
  ] }],

  ['bass', 'Walking bass', { b: [
    'In the example: C – E – G – C♯ walks up Cmaj7 and steps a half step into D; D – F – A – A♭ does the same on Dm7 into G; G – F – D – D♭ falls through G7 into C.',
    'Why beat 4 matters: the approach note makes the next root sound inevitable, so the change is heard even with no chords on top.',
    '- <b>Feel</b>: even quarter notes, slightly long, with beat 1 a touch stronger',
    '- <b>Play</b>: stay in one position (C on the 5th string, 3rd fret) with one finger per fret so the line never jumps',
    '- <b>Start</b> with a two-feel (half notes on root and 5th), then go to four once it’s steady',
  ] }],

  ['blues', 'The minor blues', { b: [
    'A♭7 is the tritone sub of D7 (V7 of V), so it slides down a half step into G7.',
    '- <b>Guide tones</b>: over A♭7 play G♭ (its 7th) and resolve it to F, the 7th of G7; C (3rd of A♭7) falls to B (3rd of G7)',
    '- <b>Solo</b>: C minor pentatonic or the blues scale over all of it; C Dorian over Cm7, C natural minor over Fm7, C harmonic minor over G7',
    '- <b>Comp</b>: Cm7 at the 3rd fret (5th-string root), Fm7 at the 1st fret (6th-string root); A♭7 and G7 sit at the 4th and 3rd frets on the 6th string, one fret apart',
    '- <b>Hear it</b>: “The Thrill Is Gone” (B.B. King) and “Mr. P.C.” (John Coltrane)',
  ] }],

  ['bass', 'Upper-structure slash chords', { b: [
    'Read the triad’s notes as intervals from the bass. D/C is D, F♯ and A over C: the 9, ♯11 and 13.',
    'Why players use them: a triad is easy to grip and to hear, and the bass supplies the root, so a small shape gives a rich sound.',
    '- <b>Play</b>: D/C is the open D chord with C (5th string, 3rd fret) underneath',
    '- <b>Practise</b>: hold C in the bass and cycle C, D, E and B♭ triads above it to hear each colour against the same root',
    'The bass must sit clearly below the triad. If C ends up in the middle, D/C just sounds like a messy D7.',
  ] }],

  ['blues', 'The quick change', { b: [
    'Bar 2’s F7 lifts the first line; bars 3–4 settle back on I7 before IV7 arrives properly in bar 5.',
    'F7’s 7th is E♭, the blue ♭3 of the key, so the quick change brings the blue note into the chords right at the start.',
    '- <b>Voice leading</b>: from C7 to F7, E falls to E♭ and B♭ falls to A. The 3rd and 7th swap places by half steps',
    '- Standard in Chicago and Texas shuffles, and in the jazz blues',
    'The mistake to avoid: staying on IV7 for bars 2–4. It’s one bar, then back to I7.',
  ] }],

  ['gospel', 'Neo-soul colours', { b: [
    'In C: Fmaj9 is F A C E G, Em7 is E G B D, Dm9 is D F A C E, Cmaj9 is C E G B D. Several notes carry over each time, so the change feels like a shift of light rather than a move.',
    'Dm11 – G13 is ii – V in C that never resolves: both come from D Dorian, so it stays modal.',
    '- <b>Comp</b>: leave the root to the bass and play 3rd, 7th and 9th on the middle strings; slide into chords from a half step below, and add small hammer-on fills',
    '- <b>Feel</b>: sit slightly behind the beat and let chords ring for two or four beats',
    '- <b>Hear it</b>: D’Angelo and Erykah Badu',
  ] }],

  ['blues', 'The 8-bar blues', { b: [
    'It reaches IV in bar 3 instead of bar 5, so it moves faster than the 12-bar. The V7 in bar 2 is the surprise.',
    '- <b>Comp</b>: the shuffle on the two bass strings, root–5th then root–6th, works for every chord',
    '- <b>Solo</b>: the same scales as the 12-bar, but in shorter phrases: two-bar ideas fit the form',
    '- <b>Hear it</b>: “Heartbreak Hotel” is an 8-bar blues too',
    'Count it: players used to 12 bars sit on I too long. The change to V comes in bar 2.',
  ] }],

  ['progs', 'I – IV – V', { b: [
    'Between them the three chords hold every note of the major scale: C E G, F A C, G B D. So any melody in the key can be harmonised with them.',
    'Function: I is rest; IV moves away and softens; V has the leading tone B, which pulls up to C.',
    '- <b>Play</b>: in G, D and A all three are open chords; in E use B7. For rock, use power chords on the 6th and 5th strings',
    '- <b>Hear it</b>: “Twist and Shout”, “La Bamba” and “Wild Thing” loop I – IV – V – IV',
    '- <b>Try</b> V – IV – I, the rock cadence, against IV – V – I: the same chords, a different pull',
  ], ex: [
    ['I – IV – V – IV: the rock loop', 'C:maj F:maj G:maj F:maj'],
  ] }],

  ['progs', 'The diatonic cycle', { b: [
    'Every root falls a perfect 5th except F to B, which is a tritone. That’s where the key forces it, and Bø7 smooths it over.',
    '- <b>Guide tones</b>: the 7th of each chord falls by step to the 3rd of the next: G – F, C – B, F – E, B – A, E – D, A – G♯, D – C',
    '- <b>Comp</b>: alternate 6th- and 5th-string roots and the cycle walks down the neck: Am7 and Dm7 at the 5th fret, G7 and Cmaj7 at the 3rd, Fmaj7 at the 1st',
    '- <b>Solo</b>: C major (A natural minor) over everything but E7; A harmonic minor there for the G♯',
    '- <b>Hear it</b>: “I Will Survive” runs the cycle from Am',
  ] }],

  ['blues', 'The 12-bar blues', { b: [
    'Each four-bar line has a job: bars 1–4 state it, bars 5–8 go to IV and back, bars 9–12 go to V and turn round. Sung blues fits it as AAB: a line, the line again, an answer.',
    'Why it works: I7 is also V7 of IV, so the move to IV in bar 5 is pulled, and V7 – IV7 – I7 falls back home.',
    '- <b>Comp</b>: the shuffle on the bass strings, easiest in A (open 5th string) or E (open 6th)',
    '- <b>Mark the change</b>: play E (3rd of C7) in bar 4 and E♭ (7th of F7) in bar 5',
    '- <b>Hear it</b>: “Johnny B. Goode”, “Hound Dog”, “Pride and Joy”',
  ] }],

  ['blues', 'The jazz blues', { b: [
    'F♯°7 (F♯ A C E♭) is a rootless D7♭9, so it pulls to C/G in bar 7, and the bass climbs F – F♯ – G.',
    'Bar 8 is often Em7 – A7, a ii – V into Dm7.',
    '- <b>Guide tones</b> in bars 9–11: C – B – B♭, the 7th of Dm7, the 3rd of G7, the 7th of C7',
    '- <b>Comp</b>: three-note shells in quarter notes, or 9th and 13th grips on the dominants',
    '- <b>Solo</b>: Mixolydian on each dominant, Dorian on the ii chords, with the blues scale over it all',
    '- <b>Hear it</b>: “Billie’s Bounce”, “Now’s the Time”, “Tenor Madness”',
  ] }],

  ['gospel', 'The gospel turnaround', { b: [
    'Chord by chord: C7/E is V7 of IV; F♯°7 is a rootless D7♭9 (V7 of V); C/G is the cadential 6/4; A7 is V7 of ii; Dm7 – G7 is ii – V home.',
    'After the first leap to E the bass climbs by half steps (E – F – F♯ – G), then a whole step to A.',
    '- <b>Play</b>: put C on top and it holds through the first five chords while the bass moves underneath',
    '- <b>Variations</b>: D7 – G7 (II7 – V7) for the ii – V, or E♭7 as a tritone sub for A7, sliding into Dm7',
    'You hear it at the end of gospel 8-bar and 12-bar forms and in soul ballads.',
  ] }],

  ['slash', 'The 7th in the bass', { b: [
    'Why it falls: a dominant’s 7th is a dissonance that resolves down by step. In the bass that resolution is exposed, so the ear waits for it.',
    'In G7/F the F falls to E while B rises to C: two half steps that land on C/E.',
    'Classical theory calls it V4/2, and it resolves to I6, the tonic in first inversion.',
    '- <b>Play</b>: G7/F is F on the 6th string, 1st fret, under the open D, G and B strings; then the open C chord with the open low E',
    '- <b>In a line</b>: C – C7/B♭ – F/A – Fm/A♭ – C/G, the bass falling C – B♭ – A – A♭ – G',
  ], ex: [
    ['The falling line', 'C:maj C:7/b7 F:maj/3 F:min/b3 C:maj/5 G:7 C:maj'],
  ] }],

  ['gospel', '7 – 3 – 6', { b: [
    'All of Bø7’s notes (B D F A) are in C major, so the turn toward A minor costs nothing until E7 brings in G♯.',
    '- <b>Guide tones</b>: A (7th of Bø7) falls to G♯ (3rd of E7), which rises to A; D (7th of E7) falls to C (3rd of Am)',
    '- <b>Play</b>: E7♭9 is E G♯ B D F; without the root it’s G♯°7, an easy movable grip',
    '- <b>Solo</b>: A harmonic minor over Bø7 – E7, then A natural minor over Am',
    'Why gospel likes it: it delays I. You head for the relative minor first, then 2 – 5 – 1 brings you home.',
  ] }],

  ['gospel', 'The 1 to the 4', { b: [
    'Voice leading: in C7, E (the 3rd) rises to F and B♭ (the 7th) falls to A, the 3rd of F.',
    '- C7♯9 adds E♭ for grit; C7♭9 adds D♭, which falls to C, the 5th of F',
    '- <b>Play</b>: C7♯9 is the “Hendrix chord” grip with its root on the 5th string, 3rd fret',
    '- Add ♯iv°7 after IV and you have the start of the gospel turnaround',
    'In a 12-bar blues, bar 4 makes the same move into IV7.',
  ] }],

  ['bass', 'Slash chords', { b: [
    'The letter after the slash is only the lowest note; the chord above stays as written.',
    'Inversions smooth the bass: C – G/B – Am lets it step down instead of jumping. Upper structures name a rich chord quickly: D/C gives C a Lydian colour with four notes.',
    '- <b>Play</b>: the bass usually goes on the 6th or 5th string; mute anything lower so the named bass really is the lowest note',
    'Not a polychord: C/E is one chord over one bass note; a polychord stacks two full chords, written one above the other with a line.',
  ], ex: [
    ['An inversion: C – G/B – Am', 'C:maj G:maj/3 A:min'],
    ['An upper structure: D/C – C', 'D:maj/b7 C:maj7'],
  ] }],

  ['bass', 'The minor bass line', { b: [
    'Spelled out: Am/G is Am7 with its 7th in the bass; Am/F♯ is F♯ A C E, an F♯ø7; Fmaj7 is F A C E. A, C and E stay through all four chords.',
    '- <b>Play</b>: in the open position keep the Am grip and walk the bass down the 6th string, 3rd fret to 1st',
    '- <b>Variation</b>: D/F♯ in place of Am/F♯, a major IV with a Dorian colour. “While My Guitar Gently Weeps” goes that way',
    '- <b>Solo</b>: A natural minor, except over Am/F♯, where the F♯ makes it A Dorian',
  ] }],

  ['forms', 'How a jazz tune runs', { b: [
    '- <b>Intro</b>: often the last 4 or 8 bars of the tune, or a I – vi – ii – V vamp, so everyone hears the key and tempo',
    '- <b>Solo order</b>: usually horns first, then piano or guitar, then bass',
    '- <b>Trading fours</b>: soloists and drummer take four bars each in turn, keeping the form',
    '- <b>Endings</b>: repeat the last turnaround two or three times (a tag), or slow down into the last chord',
    'Keep your place: count choruses, and mark the top of the form clearly. Tapping your head is the usual signal to go to the head.',
  ], ex: [
    ['An intro vamp', 'C:maj7 A:7 D:m7 G:7 C:maj7 A:7 D:m7 G:7'],
    ['A chromatic ending: iii – ♭III7 – ii – ♭II7 – I', 'E:m7 Eb:7 D:m7 Db:7 C:maj7'],
  ] }],

  ['gospel', 'The minor plagal “amen”', { b: [
    'Chord by chord in C: F holds F, A and C; Fm moves only A to A♭; C lands with A♭ falling to G and F falling to E.',
    'iv is borrowed from C minor: a touch of darkness right before home.',
    '- <b>Play</b>: in the E-shape barre at the 1st fret, lift the finger on the 3rd string and F becomes Fm',
    '- <b>Solo</b>: play A♭ over iv and let it fall to G as C arrives; that sigh is the whole effect',
    '- <b>Hear it</b>: “In My Life” and “Creep” both use IV – iv – I',
  ] }],

  ['forms', 'Verse and chorus', { b: [
    '- <b>Contrast</b>: verses often sit on vi or a smaller loop; choruses land on I or lift to IV. Changing the chord a section starts on is the quickest way to make it feel new',
    '- <b>Pre-chorus</b>: often starts on IV or ii and ends on V, so the chorus’s I is a release',
    '- <b>Bridge</b>: new chords, often starting on IV or vi, to freshen the ear before the last chorus',
    '- <b>On guitar</b>: mark sections with texture: arpeggios or palm-muting in the verse, open strumming in the chorus',
  ], ex: [
    ['Pre-chorus into chorus: ii – IV – V, then I', 'D:min F:maj G:sus4 G:maj C:maj'],
  ] }],

  ['forms', 'Learn the form, not just the chords', { b: [
    'Chunk the tune into patterns: “bars 1–4 are I – vi – ii – V twice, bar 5 is a ii – V to IV”. A few patterns are easier to hold than thirty chord names.',
    'In Roman numerals you can play it in any key, which is what singers will ask for.',
    '- <b>Practise in layers</b>: roots only, then guide tones (3rds and 7ths), then full voicings',
    '- <b>Test yourself</b>: play it with no chart, start from the bridge or bar 9, and say where you are as you go',
    '- <b>Listen</b> to several recordings: the form stays fixed, but each band changes details',
  ] }],

  ['slash', 'The Lydian slash chords', { b: [
    'The triad sits on the 9th of the bass: in D/C, D is the 9, F♯ the ♯11, A the 13. The ♯11 avoids the clash a natural 11 (F) would make with the 3rd, E.',
    'B♭/A♭ works the same way: B♭, D and F are the 9, ♯11 and 13 of A♭.',
    '- <b>Play</b>: D/C is the open D grip with C on the 5th string, 3rd fret. G/F is F on the 6th string, 1st fret, with the open D, G and B strings',
    '- <b>Solo</b>: C Lydian over D/C (the notes of G major over C), and lean on the F♯',
    'The Lydian colour is common in film scores; “The Simpsons” theme is in Lydian.',
  ] }],

  ['forms', 'Rhythm changes: the bridge', { b: [
    'Each dominant is V7 of the next, and G7 is V7 of I for the last A. In the usual key, B♭, it’s D7 – G7 – C7 – F7.',
    '- <b>Guide tones</b>: each 3rd falls a half step to the next chord’s 7th: G♯ – G, C♯ – C, F♯ – F, then B rises to C',
    '- <b>Comp</b>: alternate 5th- and 6th-string roots and it stays in one area: E7 (5th string, 7th fret), A7 (6th, 5th), D7 (5th, 5th), G7 (6th, 3rd)',
    '- <b>Solo</b>: Mixolydian on each, or arpeggios landing on each new 3rd; altered sounds on E7 and A7 add tension',
  ] }],

  ['gospel', 'The 4 with a ♯4°', { b: [
    'From Fmaj7 (F A C E) to F♯°7 (F♯ A C E♭), two notes move by half step (F up to F♯, E down to E♭) and two stay. Then F♯ and A go to G, and E♭ rises to E.',
    '- <b>Play</b>: keep the bass on the 6th string and it climbs frets 1, 2, 3: F, F♯°7, C/G',
    '- <b>Solo</b>: any note of the diminished arpeggio works over F♯°7; resolve E♭ up to E as C/G arrives',
    'It’s bar 6 of the jazz blues, and a common bar 6 in rhythm changes.',
  ] }],

  ['blues', 'Blue notes', { b: [
    'In C they’re E♭ (♭3), G♭ (♭5) and B♭ (♭7). B♭ is already in C7; E♭ and G♭ are the ones that rub.',
    'Over IV7 (F7), E♭ is the chord’s 7th, so the same note sounds at home there.',
    '- <b>♭5</b> is a passing note: use it between F and G, don’t sit on it',
    '- <b>Bend</b>: in the C box at the 8th fret, E♭ is on the 3rd string, 8th fret. Push it slightly sharp, short of E',
    'B.B. King’s small bends and vibrato on these notes are the model.',
  ] }],

  ['slash', 'Minor triads over a bass', { b: [
    'The rule: a minor triad a major 6th above the bass gives a 6 chord; a major 3rd above gives maj7; a 5th above gives a dominant sound with no 3rd.',
    'Dm7/G is the same trick as Gm7/C: G9sus4, the soft V in C.',
    '- <b>Play</b>: the minor triad on the top three strings, the bass on the 5th or 6th string: shapes you already know',
    '- <b>Hear the difference</b>: Am/C is sweet and old-fashioned, Em/C soft and open, Gm/C suspended and unresolved',
    'If the bass is weak or missing you just hear Am, Em or Gm, so make it clear.',
  ] }],

  ['slash', 'The sus slash chords', { b: [
    'F/G spelled: F, A and C over G are the ♭7, 9 and 11. Add D (the 5th) and it’s a full G9sus4.',
    'It resolves softly because there’s no leading tone: C (the 11) can fall to B for G7 first, or the chord can go straight to C.',
    '- <b>Play</b>: G on the 6th string, 3rd fret, under the small F shape on the top four strings',
    '- <b>Hear it</b>: the last chord before a pop or gospel chorus; Herbie Hancock’s “Maiden Voyage” is built on sus chords',
  ], ex: [
    ['F/G – G7 – C: the 11 falls to the 3rd first', 'F:maj/2 G:7 C:maj'],
  ] }],

  ['blues', 'The Bird blues', { b: [
    'Each ii – V’s target becomes the next ii: Bø7 – E7 points to Am7, which becomes the ii of G; G turns minor and becomes the ii of F.',
    'Bar 6’s Fm7 – B♭7 is also iv – ♭VII7 in C, the backdoor sound after F7.',
    '- <b>Guide tones</b> in bars 6–10: the 7th of each ii falls to the 3rd of its V: E♭ – D, D – C♯, D♭ – C, then C – B',
    '- <b>Solo</b>: chord tones through the ii – Vs, blues phrases where the harmony slows (bars 5 and 9–10)',
    '“Blues for Alice” is usually played in F.',
  ] }],

  ['blues', 'What to play over it', { b: [
    'In C: minor pentatonic is C E♭ F G B♭ (add G♭ for the blues scale); major pentatonic is C D E G A.',
    '- <b>Follow the chords</b>: C major pentatonic over C7, F major pentatonic over F7, G major pentatonic over G7. Land on each new 3rd: E, A, B',
    '- <b>On guitar</b>: C minor pentatonic at the 8th fret, C major pentatonic at the 5th (the A minor box); slide between them',
    'The mistake to avoid: holding E over F7. It clashes with the chord’s E♭; switch to E♭ there.',
  ] }],

  ['slash', 'The cadential 6/4', { b: [
    'Some analysts write it V6/4 – 5/3 to show it belongs to the V.',
    'It falls on a strong beat, with V7 on a weaker one.',
    '- <b>Play</b>: keep G on the 6th string, 3rd fret: the open C chord over it is C/G, then change the top to G7',
    '- <b>Solo</b>: on C/G don’t play as if you’ve arrived. Treat it as V and resolve on the next I',
    'In classical concertos the orchestra stops on this chord and the soloist plays the cadenza before V7 – I.',
  ] }],

  ['forms', 'AABA', { b: [
    'Bars 1–8 A, 9–16 A, 17–24 B, 25–32 A: one chorus is 32 bars.',
    '- In “I Got Rhythm” the bridge is III7 – VI7 – II7 – V7; in “Satin Doll” it goes to IV through its ii – V',
    '- Count in eights: the band that loses the form usually goes wrong at bar 17 or bar 25',
    '- The last A may add a tag or a different ending',
    'Other forms to know: ABAC (“All of Me”), with no bridge, just a second half that starts like the first.',
  ], ex: [
    ['A bridge to IV: I7 – IV – II7 – V7', 'C:7 C:7 F:maj7 F:maj7 D:7 D:7 G:7 G:7'],
  ] }],
['modes', 'Phrygian', { b: [
    'E Phrygian is the white notes from E: E F G A B C D. The F, a half step above the root, is the colour note.',
    '- Its chords: Em – F – G – Am – B° – C – Dm. The moves that say Phrygian are i – ♭II (Em – F) and i – ♭vii (Em – Dm).',
    '- Raise the 3rd and you get Phrygian dominant (E F G♯ A B C D), the 5th mode of A harmonic minor: the flamenco sound.',
    '<b>Play</b>: on guitar it sits on the open strings. Vamp Em and F (or Fmaj7) and let the F rub against the open E.',
    '<b>Solo</b>: E minor pentatonic plus F and C. Make the F → E half step the hook; the mistake is playing F♯ out of habit.',
  ] }],

  ['reharm', 'Passing diminished', { b: [
    'The °7 is a rootless 7♭9 in disguise: C♯°7 (C♯ E G B♭) is A7♭9 without its A, and A7 is the V of Dm. So it’s a secondary dominant with a chromatic bass.',
    'Why it works: the bass climbs by half step (C – C♯ – D) and the upper voices move by step or hold.',
    '- Up the scale: C – C♯°7 – Dm7 – D♯°7 – Em7. D♯°7 is B7♭9 without its root, the V of Em.',
    '- Down works too, as pure chromatic passing: Em7 – E♭°7 – Dm7.',
    '<b>Play</b>: one °7 grip covers it; any note of it can be the root. <b>Solo</b>: play the °7 arpeggio, then land on the next chord’s 3rd.',
  ], ex: [['Up the scale: C – C♯°7 – Dm7 – D♯°7 – Em7', 'C:maj7 C#:dim7 D:m7 D#:dim7 E:m7']] }],

  ['reharm', 'Before and after', { b: [
    '<b>Plain</b>: all diatonic. Every chord comes from C major, and the ear knows where it’s going.',
    '<b>Secondary dominants</b>: A7 and D7 replace Am7 and Dm7. Each chord is now the V of the next, so the pull is stronger. C♯ and F♯ are the new notes.',
    '<b>Tritone subs</b>: E♭7, A♭7 and D♭7 replace A7, D7 and G7. They keep the same 3rds and 7ths (A7 has C♯ and G; E♭7 has G and D♭), so only the bass changes.',
    '<b>Mixed</b>: Em7 for Cmaj7 (a diatonic sub), A7♭9, Dm9, then D♭7♯11 sliding down to C. Mixing keeps the bass and the colours varied.',
    'Whichever you choose, check it against the melody: a reharm that fights the tune is wrong however clever it sounds.',
  ] }],

  ['reharm', 'Add a V', { b: [
    'Every diatonic chord except vii° can take its own V7: A7 → Dm, B7 → Em, C7 → F, D7 → G, E7 → Am.',
    'Why it works: the dominant’s 3rd is a half step below the target’s root (C♯ → D in A7 → Dm), and its 7th falls by step to the target’s 3rd (G → F).',
    '- Into a minor chord, add a ♭9 (A7♭9 → Dm): the B♭ belongs to D minor, so it sounds right.',
    '<b>Play</b>: an E-shape 7th chord resolves to an A-shape chord at the same fret: A7 at the 5th fret to Dm7 at the 5th fret.',
    '<b>Solo</b>: hit the new note and resolve it: over A7, C♯ up to D; over C7, B♭ down to A. Check the melody: a C held over A7 rubs against its C♯.',
  ] }],

  ['mediants', 'I → VI', { b: [
    'A major is the V of D minor, so it often leads on to Dm as V/ii. Used as a mediant it needs no resolution: it just brightens and returns.',
    'The two rising voices make it feel lifted rather than shadowed, the mirror of C → A♭, where voices fall.',
    '<b>Play</b>: open C to open A, letting the open E strings ring as the common tone. Or barre C at the 8th fret and A at the 5th: the same E shape, three frets down.',
    '<b>Solo</b>: switch from C major pentatonic to A major pentatonic (A B C♯ E F♯) and make C → C♯ the change you hear.',
    '- Keep going down in minor 3rds and you get the cycle C – A – F♯ – E♭ – C.',
  ] }],

  ['mediants', 'I → ♭III', { b: [
    'E♭ is the ♭III of C minor, so it doubles as a borrowed chord. Rock riffs live on I – ♭III – IV, usually as power chords.',
    'The two falling voices give the shadow; the held G keeps it joined to C.',
    '<b>Play</b>: C at the 8th fret (E shape) to E♭ at the 6th fret (A shape). The G on the 2nd string, 8th fret, stays put.',
    '<b>Solo</b>: C major pentatonic over C, E♭ major pentatonic (E♭ F G B♭ C) over E♭. G and C are in both, so land on them across the change.',
  ], ex: [['I – ♭III – IV – I', 'C:maj Eb:maj F:maj C:maj']] }],

  ['twofive', 'Three ways home', { b: [
    'All three land on C; the dominant comes from a different place each time.',
    '<b>Front door</b>: G7’s B and F fall to C and E. The strongest pull.',
    '<b>Back door</b>: B♭7 is ♭VII7, borrowed from C minor, with Fm7 (iv) as its ii. Its A♭ falls to G and its F to E: a softer arrival. Tadd Dameron’s “Lady Bird” uses it.',
    '<b>Side door</b>: D♭7 is the tritone sub of G7, with the same 3rd and 7th (F and C♭), so the bass slides down a half step into C.',
    '<b>Solo</b>: B♭ Mixolydian over B♭7; D♭ Lydian dominant over D♭7. Play all three into the same Cmaj7 and hear the arrival change.',
  ] }],

  ['mediants', 'I → III', { b: [
    'E major is the V of A minor, so in C it can be heard as V/vi. Here it’s colour: go back to C, or on to F.',
    'The G♯ is the one new note and the source of the lift. Make it audible.',
    '<b>Play</b>: C at the 8th fret (E shape) to E at the 7th fret (A shape). The E on the 3rd string, 9th fret, holds.',
    '<b>Solo</b>: E major pentatonic (E F♯ G♯ B C♯) over E, or A harmonic minor if it’s heading to Am. Target G♯.',
    '- Radiohead’s “Creep” runs I – III – IV – iv (G – B – C – Cm).',
  ], ex: [['I – III – IV – iv, the “Creep” move', 'C:maj E:maj F:maj F:min']] }],

  ['twofive', 'Deceptive endings', { b: [
    '<b>V → vi</b> works because Am shares C and E with C: G7’s B still rises to C and its F still falls to E. Only the bass surprises, stepping up to A instead of down to C.',
    '<b>V → ♭VI</b> borrows from C minor: A♭maj7 keeps G (now the 7th), B rises to C, D and F close in on E♭, and the bass steps up a half step.',
    '- Use it to extend a phrase: a deceptive cadence at bar 8 buys another four bars before the real V – I.',
    '<b>Solo</b>: play the V as if it will resolve, then land on the 3rd of the surprise chord: C works for both Am7 and A♭maj7.',
  ] }],

  ['reharm', 'Borrow from minor', { b: [
    'Each borrowed chord brings a darker note from C minor: Fm has A♭; A♭maj7 has A♭ and E♭; B♭7 has B♭ and A♭.',
    'Why it works: A♭ falls a half step to G, a strong pull home. That’s why IV – iv – I (F – Fm – C) is all over ballads and 1960s pop.',
    '- iv can be Fm6, Fm7 or Dø7. Dø7 (D F A♭ C) is Fm6 with D in the bass.',
    '<b>Solo</b>: over Fm6 play F melodic minor or C minor’s notes; hold A♭ and resolve it to G as C returns.',
    'The mistake to avoid: borrowing while the melody holds A or E, which clash with A♭ and E♭.',
  ] }],

  ['modes', 'Dorian', { b: [
    'D Dorian is the white notes from D: D E F G A B C. The B, a major 6th above D, is the colour note; it’s the 3rd of the G chord.',
    '- Its chords: Dm7 – Em7 – Fmaj7 – G7 – Am7 – Bø7 – Cmaj7. i – IV and i – ii carry the sound.',
    '<b>Play</b>: comp Dm7 and a G triad over a D bass (G/D). It’s the B in the voicing that says Dorian.',
    '<b>Solo</b>: D minor pentatonic plus E and B. Let B ring over Dm7; over G it’s the 3rd. The mistake is B♭ (Aeolian), which clashes with the G chord.',
  ] }],

  ['solo', 'The ♭9 sound on V7', { b: [
    'B°7 is B D F A♭: G7♭9 without its root. °7 chords repeat every minor 3rd, so D°7, F°7 and A♭°7 are the same notes and the same shape three frets apart.',
    'Resolution into C: B → C, A♭ → G, F → E, D → C. Its true home is C minor, where A♭ belongs; into Cmaj7, resolve the A♭ quickly.',
    '- For the full sound, the half–whole diminished scale from G (G A♭ B♭ B C♯ D E F) adds ♯9, ♯11 and 13.',
    '<b>Drill</b>: in a bar of G7, run B°7 up from B, then land on E or C on beat 1 of Cmaj7. Then start from D, F and A♭.',
  ] }],

  ['mediants', 'I → ♭VI', { b: [
    'A♭ is ♭VI, borrowed from C minor, so it’s both a mediant and modal interchange. The falling E → E♭ gives the shadow; the rising G → A♭ gives the lift.',
    '- I – ♭VI – ♭VII – I (C – A♭ – B♭ – C) is the heroic cadence of film and game scores.',
    '<b>Play</b>: on the top three strings, C (G C E at frets 12–13–12) to A♭ (A♭ C E♭ at 13–13–11). One voice up, one held, one down.',
    '<b>Solo</b>: A♭ major pentatonic (A♭ B♭ C E♭ F) or A♭ Lydian over A♭; land on C, the shared note.',
  ], ex: [['I – ♭VI – ♭VII – I', 'C:maj Ab:maj Bb:maj C:maj']] }],

  ['twofive', 'The engine', { b: [
    'Chord by chord: Dm7 (ii) prepares; G7 (V) adds tension with its tritone, B and F; Cmaj7 (I) releases it as B rises to C and F falls to E.',
    'In tunes it’s usually a bar each of ii and V, then I, or ii and V two beats each.',
    '<b>Play</b>: in one position, Dm7 on the 5th string at the 5th fret, G7 on the 6th string at the 3rd, Cmaj7 on the 5th string at the 3rd. Then the mirror: Dm7 on the 6th string at the 10th.',
    '<b>Solo</b>: C major covers all three, but aim for each chord’s 3rd on the change: F, B, E.',
    '- Hear it everywhere in “Autumn Leaves”, “All the Things You Are” and “Tune Up”.',
  ] }],

  ['modes', 'Aeolian', { b: [
    'A Aeolian is the white notes from A: A B C D E F G. The ♭6 (F) sets it apart from Dorian; the ♭7 (G) makes the v chord minor.',
    '- Its chords: Am – B° – C – Dm – Em – F – G. The rock moves are i – ♭VI – ♭VII and i – ♭VII – ♭VI.',
    '- Raise G to G♯ and you have harmonic minor’s E7. That one note turns it classical or jazz.',
    '<b>Play</b>: open or barre Am, F and G, or power chords. <b>Solo</b>: A minor pentatonic, adding B and F; lean on F over the F chord.',
  ] }],

  ['modes', 'Mixolydian', { b: [
    'G Mixolydian is the white notes from G: G A B C D E F. The F (♭7) is the colour note; it’s the root of the ♭VII chord.',
    '- Its chords: G7 – Am – B° – C – Dm – Em – F. The v is minor, so nothing pulls hard back to G: it just vamps.',
    '<b>Play</b>: open G, F and C. ♭VII – IV – I (F – C – G), the “double plagal” cadence, is a classic rock ending.',
    '<b>Solo</b>: G major pentatonic plus F, or mix G major and G minor pentatonic, the blues-rock way. The mistake is F♯ over the F chord.',
  ] }],

  ['twofive', 'Minor ii–V–i', { b: [
    'Why the chords change in minor: in C minor, D’s triad is D F A♭, diminished, so ii becomes Dø7. V takes B♮ from harmonic minor to be a dominant, and its ♭9 (A♭) comes from the key.',
    'Guide tones: Dø7’s C falls to G7’s B; G7’s F falls a whole step to Cm’s E♭.',
    '<b>Play</b>: Dø7 on the 5th string at the 5th fret, G7♭9 on the 6th string at the 3rd, Cm6 on the 5th string at the 3rd.',
    '<b>Solo</b>: start with C harmonic minor over all three; A♭ and B make the sound. Practise it on “Blue Bossa”, which is in C minor.',
  ] }],

  ['solo', 'Approach notes and enclosures', { b: [
    'Why it works: a note a half step away creates tension the target releases. Put the target on the beat and the approach just before it.',
    '- Double chromatic: two half steps in a row, from below (D, D♯, E) or above (F♯, F, E)',
    '<b>Drill</b>: over a Cmaj7 vamp, target only E every bar, approaching it a different way each time. Then G, then C. Then over Dm7 – G7 – Cmaj7, aiming at F, B and E.',
    'The mistake to avoid: the approach note on the beat and the target off it. Then it sounds wrong instead of leading.',
    'Bebop lines, Charlie Parker’s above all, are full of these.',
  ] }],

  ['twofive', 'ii–V chains', { b: [
    'Each pair sets up a key that never arrives: Em7 – A7 points at D, but D turns into Dm7, the next ii.',
    'In the half-step chain the guide tones still move by half step or hold: A7 (C♯, G) → E♭m7 (D♭, G♭).',
    '<b>Play</b>: ii on the 6th string, V on the 5th at the same fret (Em7 and A7 at the 12th), then down two frets for the next pair (Dm7 and G7 at the 10th).',
    '<b>Solo</b>: treat each pair as one key (Em7 – A7: D major; Dm7 – G7: C major) and land on the 3rd of each new ii.',
  ] }],

  ['solo', 'Chord tones on the beat', { b: [
    'The ear judges a line by what lands on the beat. Chord tones there make even a simple line sound right.',
    '- In eighth notes, chord tones on the beats, scale or chromatic notes on the off-beats',
    '- Strongest of all: the 3rd or 7th on beat 1 of a new chord, the notes that change between chords',
    '<b>Drill</b>: loop Dm7 – G7 – Cmaj7 slowly and play quarter notes from the arpeggios only, moving to the nearest chord tone at each change. Then add one passing note between each pair.',
    'The mistake to avoid: running every chord from its root. Start from the nearest chord tone instead.',
  ] }],

  ['solo', 'The bebop scale', { b: [
    'G bebop dominant is G A B C D E F F♯. Descend in eighths from G on the beat and the beats fall on G, F, D and B: G7’s four notes.',
    'Why it’s needed: with seven notes, chord tones drift on and off the beat; the extra half step puts them back.',
    '- Change direction or start on a non-chord tone and you’ll need to add or skip a note to stay in phase.',
    '- The same notes work over Dm7, so one bebop line covers the whole ii–V.',
    '- Major bebop adds ♯5 instead: C D E F G G♯ A B.',
    'It’s the sound of Charlie Parker’s lines and of bebop ever since.',
  ] }],

  ['modes', 'Lydian', { b: [
    'C Lydian is C D E F♯ G A B: the white notes from F, moved to C. F♯ is the colour note.',
    '- Its chords: Cmaj7 – D7 – Em7 – F♯ø7 – Gmaj7 – Am7 – Bm7. I – II and I – vii (Cmaj7 – Bm7) carry it.',
    '<b>Play</b>: Cmaj7♯11, or a D triad on the top strings over a C bass.',
    '<b>Solo</b>: B minor pentatonic over C (7 9 3 ♯11 13), or arpeggiate D major. The mistake is a long F, the note Lydian exists to avoid.',
  ] }],

  ['solo', 'Triad pairs', { b: [
    'Why it works: two triads a whole step apart share no notes, so together they make a six-note scale with no half-step rubs. C and D give C D E F♯ G A.',
    '<b>Practise</b>: alternate three notes of each: C triad up, D triad up, then try inversions so the line moves by step between them.',
    '- Play them in groups of three against 4/4: the accents shift across the bar line, the modern sound.',
    '- Find pairs for any chord: take two neighbouring triads whose six notes all fit the chord’s scale.',
  ] }],

  ['solo', 'Guide-tone lines', { b: [
    'Why it works: the 3rd and 7th fix the chord’s quality; root and 5th are shared by many chords. Two notes name the chord.',
    '<b>On guitar</b>: play both lines at once on the 4th and 3rd strings: F–C, F–B, E–B (frets 3–5, 3–4, 2–4).',
    '<b>Drill</b>: through a whole tune, play only a guide-tone line in long notes. Then add an approach note before each. Then fill the bar.',
    '“Autumn Leaves” is a good first tune: it’s nearly all ii–V–Is.',
  ] }],

  ['twofive', 'A ii–V to anything', { b: [
    'Why it works: a ii–V names a key in two chords, so the target sounds like a brief tonic, then the tune carries on.',
    '- Some come almost free: before G, Am7 is already in the key, so only D7 adds a note (F♯).',
    '<b>Play</b>: the grips are the home ii–V, moved. Learn one set and slide it to each target.',
    '<b>Solo</b>: change scale with the ii–V, then back. Over Eø7 – A7♭9 into Dm, the new notes are B♭ and C♯ (D harmonic minor).',
    'Most standards enter each key area this way: “All the Things You Are” is built on it.',
  ] }],

  ['solo', 'Arpeggios from the 3rd', { b: [
    'Why it works: you keep the 3rd and 7th, drop the root and gain the 9th. It sounds like the chord, only richer.',
    '- Fmaj7 over Dm7: ♭3 5 ♭7 9. Bø7 over G7: 3 5 ♭7 9. Em7 over Cmaj7: 3 5 7 9.',
    '- Go further, from the 5th: Am7 over Dm7 (5 ♭7 9 11), Gmaj7 over Cmaj7 (5 7 9 ♯11, Lydian).',
    '<b>Drill</b>: through a ii–V–I, play each 3rd-up arpeggio ascending, then descending, changing chord on the nearest note. The shapes are ones you already know.',
  ] }],

  ['twofive', 'Guide tones', { b: [
    'Why it matters: the roots and 5ths barely say anything; the 3rds and 7ths are what the ear follows.',
    '<b>On guitar</b>: shells on three strings: Dm7 x535xx, G7 3x34xx, Cmaj7 x324xx. Only the top two notes move, one fret at a time.',
    '- In minor, G7’s F falls a whole step to Cm’s E♭: the 7th still resolves down.',
    '<b>Solo</b>: put a guide tone on beat 1 of each chord and the line spells the changes on its own.',
  ] }],

  ['modes', 'Comping modally', { b: [
    'A modal tune doesn’t move by function, so the comping has to keep the mode clear and still give motion.',
    '- The “So What” voicing: three 4ths and a major 3rd, E A D G B over D (9, 5, 1, 11, 13)',
    '- Avoid anything that sounds like V – I: in D Dorian, A7 (with C♯) pulls it into D minor and breaks the mode',
    'Rhythm: short stabs with space, or long held chords, rather than a steady strum. Let bass and drums carry the pulse.',
    'Hear it in the piano on “So What” and in McCoy Tyner’s playing on “Impressions”.',
  ] }],

  ['modes', 'Ionian and Locrian', { b: [
    '<b>Ionian</b> lives in motion: you hear it as ii–V–I, not as a one-chord vamp. Over a long Cmaj7, players reach for Lydian (F♯) instead of F.',
    '<b>Locrian</b> is B C D E F G A over Bø7. Its ♭2 (C) is awkward over the chord, so many prefer Locrian ♮2 (B C♯ D E F G A), the 6th mode of D melodic minor.',
    '- Locrian’s home is the iiø7 of a minor ii–V: Bø7 – E7 – Am',
  ], ex: [['Locrian at work: Bø7 – E7♭9 – Am7', 'B:m7b5 E:7b9 A:m7'], ['Cmaj7 to Cmaj7♯11: the same chord, Ionian then Lydian', 'C:maj7 C:maj7#11 C:maj7 C:maj7#11']] }],

  ['twofive', 'Turnarounds', { b: [
    'A turnaround fills the last two bars and leads back to I. The versions keep the same root path or a sub of it, and change the colour.',
    '- VI7 for vi: A7 is the V of Dm, so each chord now points at the next. C♯ is the new note.',
    '- iii for I: Em7 shares E, G and B with Cmaj7, so it stands in while giving the bass a new note.',
    '- Dameron’s chords are tritone subs of A7, D7 and G7: the same guide tones, a chromatic bass.',
    'I – vi – ii – V opens “I Got Rhythm” and all the rhythm-changes tunes built on it.',
  ] }],

  ['solo', 'Pentatonics over changes', { b: [
    'Why it works: a pentatonic has no half steps, so it never clashes. Built on the right root, all five notes become the chord’s upper colours.',
    '- Over <b>Dm7</b>, E minor pentatonic adds the 6th: 9 11 5 6 1, a Dorian sound',
    '- Over <b>G7</b>, D minor pentatonic: 5 ♭7 1 9 11',
    '<b>Drill</b>: a ii–V–I with one pentatonic per chord: A minor over Dm7, B♭ minor over G7alt, E minor over Cmaj7. On guitar, use the shapes you know; only the root moves.',
  ] }],

  ['twofive', 'Voice-lead it', { b: [
    'Why: with common tones held and the rest moving by step, the chords sound connected, like a choir, instead of jumping as blocks.',
    '- In one spot on the top four strings: Dm7 (C F A D, all at the 10th fret) → G7 (B F G D) → Cmaj7 (B E G C)',
    '- The top voice is a melody: D, D, C. Sing it as you play.',
    'Then start from each other inversion of Dm7 and find the nearest G7 and Cmaj7. The mistake is the same barre shape for every chord: the roots jump, the hand shouldn’t.',
  ], ex: [['Drop 2 on the top four strings, at the 10th fret', '=C4 F4 A4 D5 | B3 F4 G4 D5 | B3 E4 G4 C5']] }],

  ['mediants', 'Major-3rd cycles', { b: [
    'The tonics B, G and E♭ are a major 3rd apart and split the octave into three equal parts, an augmented triad.',
    'Each key gets its V7 just before it: D7 → G, B♭7 → E♭, F♯7 → B. Each arrival is a mediant away from the last tonic.',
    '- Over a ii–V–I in C: Dm7 – E♭7 – A♭maj7 – B7 – Emaj7 – G7 – Cmaj7. Coltrane did this to “Tune Up” and called it “Countdown”.',
    '<b>Practise</b>: arpeggiate 1 2 3 5 on each chord, slowly. Each key lasts only two beats.',
  ], ex: [['Coltrane changes in C', 'D:m7 Eb:7 Ab:maj7 B:7 E:maj7 G:7 C:maj7'], ['The opening of “Giant Steps”', 'B:maj7 D:7 G:maj7 Bb:7 Eb:maj7']] }],

  ['reharm', 'Side-slipping', { b: [
    '- A♭7 → G7 is also the tritone sub of D7 (V of V), so it doubles as a secondary dominant.',
    '- From below: C♯m7 → Dm7, Bmaj7 → Cmaj7, a lift rather than a sag',
    '- Slip a whole ii–V: E♭m7 – A♭7 → Dm7 – G7',
    '<b>Play</b>: the easiest reharm on guitar: keep the grip and move it one fret. Put the slipped chord on the last beat so it lands into the target.',
    '<b>Solo</b>: slip the line with it: a phrase a half step up, then resolve into the real chord. Outside, then in.',
  ] }],

  ['mediants', 'What they are', { b: [
    'The common tones: C and E share E; C and A share E; C and A♭ share C; C and E♭ share G.',
    'The out-of-key notes are what you hear: G♯ in E; C♯ in A; A♭ and E♭ in A♭; E♭ and B♭ in E♭.',
    '- From Am the same idea gives C♯m, Fm, F♯m and Cm',
    'Schubert used them constantly; so does film music. To learn them, play C and each of the four slowly, and name the note that stays.',
  ], ex: [['All four from C', 'C:maj E:maj C:maj A:maj C:maj Ab:maj C:maj Eb:maj C:maj']] }],

  ['modes', 'Lydian dominant', { b: [
    'C Lydian dominant is C D E F♯ G A B♭: the 4th mode of G melodic minor.',
    '- Use it on dominants that don’t resolve down a 5th: tritone subs (D♭7 in Dm7 – D♭7 – C) and the backdoor B♭7 in C',
    '<b>Solo</b>: play G melodic minor’s notes over C7, or the D triad from the card. The mistake is a long F (Mixolydian), which sits a half step above E.',
  ] }],

  ['mediants', 'Doubly chromatic', { b: [
    'Doubly chromatic means both: roots a 3rd apart and the quality changed. From Cm the pairs are A and E major.',
    'Why it’s strange: there’s no note to anchor the ear, so the shift is total, yet the smooth voices keep it from sounding random.',
    '<b>Play</b>: as triads on the top three strings so the half steps are heard: C (G C E at frets 12–13–12) to A♭m (A♭ C♭ E♭ at 13–12–11).',
    '<b>Solo</b>: don’t bridge the scales; move to the chord tone a half step from where you are.',
  ] }],

  ['reharm', 'Tritone sub', { b: [
    'Why it works: G7 (G B D F) and D♭7 (D♭ F A♭ C♭) share their 3rd and 7th, B and F. The tritone that drives the resolution stays; only the root changes.',
    '<b>On guitar</b>: G7 3x34xx and D♭7 x434xx have the same top two notes. Only the bass moves.',
    '<b>Solo</b>: D♭ Lydian dominant over D♭7. It’s the same notes as G altered.',
    '- Sub the ii as well: A♭m7 – D♭7 – C',
  ] }],

  ['solo', 'Motifs and space', { b: [
    'Why it works: a listener follows a soloist by recognising ideas. Repetition and development make a solo sound like it means something.',
    '- Ways to develop a motif: move it to the next chord’s tones, start it on a different beat, stretch its rhythm, change one interval, play it backwards',
    '<b>Drill</b>: over a blues or a ii–V–I, keep one three- or four-note idea for a whole chorus, changing only the notes the chords force you to.',
    'Sonny Rollins’s “Blue 7” is the famous case of building a solo from one motif. Miles Davis and B.B. King are the masters of space.',
  ] }],

  ['reharm', 'Diatonic substitution', { b: [
    'The families: tonic (I, iii, vi), predominant (ii, IV), dominant (V, vii°). Swapping within a family keeps the function and changes the bass.',
    '- Cmaj7 to Em7: keep E, G and B, move C up to D',
    '- Cmaj7 to Am7: keep C, E and G, move B down to A',
    'Use it to vary repeats: the second time through the same bars, swap I for vi or iii. The scale over it stays C major.',
  ] }],

  ['modulation', 'Parallel: major ↔ minor', { b: [
    'Three notes change, all lowered, so the mood changes without the key centre moving.',
    'The pivot is the shared V: G7 is V in both keys, so V – i lands straight in minor. A ♭9 on it (A♭) leans towards the minor.',
    '<b>Solo</b>: same root, new scale. C major pentatonic to C minor pentatonic is the simplest switch; target E, then E♭, so the change is heard.',
    'Schubert moves between major and minor on the same tonic all the time.',
  ] }],

  ['mediants', 'How they work', { b: [
    'They sit outside the ii–V–I system: no leading tone, no tritone resolving. The effect is the held note while the other two voices move by half or whole step.',
    '- To leave for good: treat the new chord as I and give it its own ii–V',
    '- To come home: retrace the step, or make the mediant a dominant: E → E7 → Am, A → A7 → Dm',
    '<b>Play</b>: on the top three strings, keep the common tone on the same fret. No voice moves more than two frets.',
    'John Williams’s film scores use them constantly.',
  ], ex: [['From C to each mediant and back, common tone held', '=G4 C5 E5 | G#4 B4 E5 | G4 C5 E5 | A4 C#5 E5 | G4 C5 E5 | Ab4 C5 Eb5 | G4 C5 E5 | G4 Bb4 Eb5 | G4 C5 E5', 'C · E · C · A · C · A♭ · C · E♭ · C']] }],

  ['twofive', 'Drill it round the cycle', { b: [
    'Why the trick works: Cm7 is Cmaj7 with E and B lowered a half step, so each new ii is two small changes away.',
    '<b>On guitar</b>: alternate root strings: Dm7 (5th string) – G7 (6th) – Cmaj7 (5th), then Cm7 – F7 – B♭maj7 the same way, two frets lower. When you run out of neck, swap: ii on the 6th string, V on the 5th.',
    '<b>Drill</b>: metronome at 60, a bar per chord, naming each chord before you play it. Then guide tones only, then a short line landing on each 3rd.',
    '- “Tune Up” goes down in whole steps: D, C, B♭.',
  ] }],

  ['modulation', 'The truck-driver’s change', { b: [
    'Why it works: everything goes up, voice included, so the last chorus feels more intense though nothing else changes.',
    'The smooth way costs one chord: replace the last V of the old key (G in C) with the new key’s V7 (A7 into D).',
    '<b>Practise</b>: loop I – IV – V – I, then make the change both ways. On guitar, barre shapes just move up one or two frets.',
    'Hear it in “My Girl” and “Man in the Mirror”. Overused, it sounds cheap, which is where the nickname comes from.',
  ] }],

  ['modulation', 'Relative: major ↔ minor', { b: [
    'The leading tone decides the key: G♯ points to A, B points to C. Whichever V7 is sounding sets the home.',
    'Pivot chords: Dm7 and F are in both keys, so ii or IV can lead either way: Dm7 – E7 – Am or Dm7 – G7 – C.',
    '<b>Solo</b>: in A minor, use A harmonic minor over E7 (G♯ is the note), then natural minor again.',
    '“Autumn Leaves” moves back and forth between G major and E minor.',
  ] }],

  ['modulation', 'Closely related keys', { b: [
    'Each move needs one new note and a cadence: F♯ in D7 → G, B♭ in C7 → F, D♯ in B7 → Em.',
    'Pivot chords make it seamless: Am7 is vi in C and ii in G, so C – Am7 – D7 – G slides across.',
    '<b>Solo</b>: change one note. In the G section F becomes F♯; in the F section B becomes B♭.',
    'Classical sonata form puts its second theme here: in the dominant, or the relative major from a minor key.',
  ] }],

  ['reharm', 'Add a ii', { b: [
    'Why it works: the ii’s 7th falls to the V’s 3rd (C → B in Dm7 – G7), so it adds motion without changing where you land.',
    '<b>Play</b>: ii and V share a fret: ii on the 6th string, V on the 5th (Am7 and D7 at the 5th fret).',
    '<b>Solo</b>: ii and V share a scale (Dm7 – G7: C major), so one line covers both. Aim at the 3rd of each.',
    '- A minor-key ii before a major tonic is a colour too: Dø7 – G7 – C',
  ] }],
['nopull', '♭VII7', { b: [
    'F7 is F A C E♭, borrowed from G minor. E♭ falls a half step to D, the 5th of G, and A rises a whole step to B, the 3rd.',
    'Cm7 – F7 is the ii–V of B♭, so the backdoor is a ii–V that lands a minor 3rd below where it points.',
    '<b>Play</b>: F9 with the root on the 5th string at fret 8, then Gmaj7 with the root at fret 10.',
    '<b>Solo</b>: F Mixolydian (the notes of B♭ major). For a brighter sound, F Lydian dominant: its ♯11 is B, the 3rd of the G to come.',
    '- “Misty” has it in E♭: A♭m7 – D♭7 – E♭maj7',
  ] }],

  ['other', 'Picardy third', { b: [
    'In A minor only one note changes: C becomes C♯. E7’s G♯ still rises to A, but the 3rd of the last chord is a half step higher than the ear expects.',
    'Standard in Baroque music: Bach ends many minor-key chorales on a major chord.',
    '<b>Play</b>: open Am to open A is one finger on the 2nd string, fret 1 (C) to fret 2 (C♯).',
    '<b>Solo</b>: A harmonic minor up to the last chord, then land on C♯ so the change is heard.',
    '- Use it only at the very end. Mid-piece, A major in A minor sounds like V of iv, heading for Dm',
  ] }],

  ['nopull', '♭II7', { b: [
    'A♭7 is A♭ C E♭ G♭. Its 3rd and 7th (C and G♭) are D7’s 7th and 3rd (C and F♯), swapped.',
    'Into G: C falls to B, G♭ holds as F♯ (the maj7 of G), and the bass slides A♭ → G.',
    'Its ♯11 is D, the root of D7 and the 5th of G, so it can hold over the change.',
    '<b>Play</b>: A♭9 with the root on the 5th string at fret 11, then down one fret into G.',
    '<b>Solo</b>: A♭ Lydian dominant, which is E♭ melodic minor (E♭ F G♭ A♭ B♭ C D): the same notes as D7alt.',
    '- “The Girl from Ipanema” uses it: G♭7 → Fmaj7 in F',
  ] }],

  ['map', 'm7', { b: [
    'The three differ only in the 2nd and 6th. Dorian has a major 6th; Aeolian a ♭6; Phrygian a ♭6 and a ♭2.',
    'In C: D Dorian over Dm7, with B as its colour note; A Aeolian over Am7, passing through F; E Phrygian over Em7, where F (a half step above the root) is the note to avoid.',
    'On a minor tonic or a modal vamp, Dorian is the usual choice: “So What” and “Oye Como Va” are Dorian.',
    '<b>Safe for all three</b>: the minor pentatonic on the chord’s root (D F G A C over Dm7). Add the 2nd and 6th once you know which mode you’re in.',
  ] }],

  ['map', 'ø7, °7, m(maj7)', { b: [
    'In C, the ø7 is Bø7 (B D F A): B Locrian is just C major from B.',
    'Locrian ♮2 raises the 2nd (C to C♯ over Bø7), removing the ♭9 rub with the root. It’s melodic minor from a minor 3rd up: D melodic minor for Bø7.',
    'Whole-half over B°7: B C♯ D E F G A♭ B♭. Each note not in the chord sits a whole step above a chord tone, so all four are usable tensions.',
    'm(maj7) is the minor tonic of a minor ii–V–i: Dø7 – G7alt – Cm(maj7). C melodic minor (C D E♭ F G A B) gives it a 9 and 13 with no clash.',
  ] }],

  ['nopull', '♭VI7 → I', { b: [
    'E♭7 is E♭ G B♭ D♭. Into G, every note is close: E♭ falls to D, D♭ rises to D, B♭ rises to B, and G holds.',
    'Its root and 5th (E♭, B♭) come from G minor; its 7th (D♭) is the ♭5 blue note of G.',
    '<b>Play</b>: E♭9 with the root on the 5th string at fret 6, then G at fret 10.',
    '<b>Solo</b>: E♭ Lydian dominant, which is B♭ melodic minor (B♭ C D♭ E♭ F G A). Its ♯11, A, steps up to B or down to G.',
    '- Don’t confuse it with ♭VI7 → V (E♭7 → D7): same chord, different target',
  ], ex: [['E♭7 – A♭7 – G: two dark colours in a row', 'Eb:9 Ab:7#11 G:maj7']] }],

  ['map', 'maj7', { b: [
    'The two differ by one note: over Cmaj7, Ionian has F and Lydian has F♯.',
    'On IV in C, F Lydian is just C major from F, so the ♯4 (B) comes free.',
    'On the borrowed chords, the ♯4 is often a note of the home key: D over A♭maj7, E over B♭maj7, G over D♭maj7.',
    '<b>Play</b>: Fmaj7♯11 in open position is x x 3 2 0 0 (F A B E).',
    '<b>Solo</b>: on I, land on E, G, B or D and pass through F. A Lydian I (Cmaj7♯11) floats instead of settling.',
  ] }],

  ['voicelead', 'Cadences', { b: [
    '<b>Perfect</b> authentic: both chords in root position with the tonic on top. Anything else is imperfect.',
    'Plagal with the minor iv (Fm → C): A♭ falls a half step to G.',
    'Deceptive (G7 → Am): B still rises to C, so only the bass is surprised, rising G → A.',
    'Phrases often come in pairs: a half cadence as the question, an authentic cadence as the answer.',
    '- In minor there’s also the Phrygian half cadence: Dm/F → E in A minor, the bass falling F → E',
  ] }],

  ['nopull', 'I7', { b: [
    'G7 is G B D F. The F (♭7) comes from G Mixolydian: it makes G sound bluesy rather than like the V of C.',
    'In a blues all three chords are dominants (G7, C7, D7), and none of them needs to resolve.',
    '<b>Play</b>: G7 from the 6th string at fret 3; for funk, G9 rooted on the 5th string at fret 10 (x 10 9 10 10 x), short and percussive.',
    '<b>Solo</b>: G Mixolydian, or G minor pentatonic with B added. Bend B♭ up towards B for the blue 3rd.',
    '- Avoid the ♭9 on a static I7: it says “go to C”',
  ] }],

  ['nopull', 'IV7', { b: [
    'C7 is C E G B♭. B♭ is the blue ♭3 of G; E is G’s 6th.',
    'Back to G: E falls to D, B♭ rises to B, C falls to B, and G holds.',
    '<b>Play</b>: C9 rooted on the 5th string (x 3 2 3 3 3), then G at the 3rd fret.',
    '<b>Solo</b>: C Lydian dominant, which is G melodic minor (G A B♭ C D E F♯). Or the G blues scale: its B♭ is C7’s 7th.',
    '- In a 12-bar blues it’s bars 5–6, and bar 2 in a quick change',
  ] }],

  ['voicelead', 'IV/V', { b: [
    'F/G is F A C over G: the 7th, 9th and 11th (sus4) of G. No B, so no tritone.',
    'It can go straight to C, or to G7 first, with C falling to B.',
    '<b>Play</b>: 3 x 3 2 1 x, an F triad over a 6th-string G.',
    '<b>Solo</b>: G Mixolydian, where C is no longer an avoid note. F major pentatonic (F G A C D) sits right on it.',
    '- The same trick on any dominant: a major triad a whole step below the bass (B♭/C = C9sus4)',
    '- Pop charts often call it G11',
  ] }],

  ['voicelead', 'Quartal voicings', { b: [
    'In C, D G C F fits Dm11, G7sus4 and F6/9: one shape, three chords, depending on the bass.',
    '<b>Play</b>: the low four strings are tuned in 4ths, so one barre across E A D G is a quartal chord. The B string breaks the pattern, so go up a fret there.',
    'Move a quartal shape up and down the scale (planing): McCoy Tyner’s sound with Coltrane.',
    '<b>Solo</b>: minor pentatonic fits them well: D F G A C contains D G C F.',
    '- “So What” and “Impressions” are the classic examples',
  ] }],

  ['voicelead', 'Pedal point', { b: [
    '<b>Dominant pedal</b> (G under C/G, F/G, G7): builds tension before the tonic. <b>Tonic pedal</b> (C under F/C, G/C): settles, often at the end.',
    'Chords above may clash with the bass. That’s fine: the ear hears the pedal as its own layer.',
    '<b>Play</b>: let an open string ring as the pedal, like the open D or A under chords moving on the higher strings.',
    'An inverted pedal holds the note on top instead, like a high open E ringing over moving chords.',
    '<b>Solo</b>: over a long pedal, play the scale of the pedal’s key rather than chasing each chord.',
  ] }],

  ['dim', 'The dominants of G, swapped', { b: [
    'Each °7 sits on its dominant’s 3rd. F♯°7 (F♯ A C E♭) keeps D7’s 3rd, 5th and 7th and swaps the root D for the ♭9, E♭.',
    'So the bass rises a half step into the target: F♯ → G, G♯ → A, C♯ → D, D♯ → E.',
    '<b>Play</b>: one four-string grip moved to the right fret: x x 4 5 4 5 is F♯°7.',
    '<b>Solo</b>: half-whole from the dominant’s root (D half-whole over F♯°7 → G), or just the °7 arpeggio.',
    '- Gospel, stride and older standards are full of these',
  ] }],

  ['other', '7♯9', { b: [
    'E7♯9 is E G♯ B D with F𝄪 on top, written G: that’s why it sounds like both 3rds.',
    'Called the Hendrix chord after “Purple Haze”.',
    '<b>Play</b>: x 7 6 7 8 x (E G♯ D G). Keep the 3rd below the ♯9; the other way round sounds like a wrong minor chord.',
    '<b>Solo</b>: E minor pentatonic or the E blues scale. Its G is the ♯9, so the clash is the point.',
    'Into Am7, the ♯9 (G) holds as the 7th of Am7, while G♯ rises to A.',
  ] }],

  ['nopull', 'II7 not going to V', { b: [
    'A7 is A C♯ E G. Its C♯ is G’s ♯4: the Lydian note.',
    'C♯ usually slips back to C (A7 → Am7, or into C) or rises to D.',
    'A9 and A13 sound smooth here: the 9th (B) and 13th (F♯) are G’s 3rd and 7th.',
    '<b>Play</b>: open A7 (x 0 2 0 2 0) after open G is the easiest pair.',
    '<b>Solo</b>: A Mixolydian, which is G Lydian: G major with C♯.',
    '- If it goes to D7, it’s V/V and pulls; that’s a different job',
  ] }],

  ['map', 'Dominant 7', { b: [
    'G7 → C: G Mixolydian is C major from G. Land on B and F, and resolve them (B → C, F → E).',
    'E7 → Am: E Phrygian dominant is A harmonic minor from E (E F G♯ A B C D).',
    'For more tension, E altered is F melodic minor (F G A♭ B♭ C D E): ♭9, ♯9, ♭5 and ♯5 at once.',
    'Half-whole (E F G G♯ A♯ B C♯ D) gives ♭9, ♯9, ♯11 and a natural 13: it fits 13♭9.',
    'Lydian dominant over D7 is A melodic minor (A B C D E F♯ G♯): the ♯11 is G♯.',
  ] }],

  ['dim', 'Descending passing', { b: [
    'B♭°7 is B♭ D♭ E G. From Bm7, B and D slip down a half step; into Am7, B♭ falls to A and D♭ to C, while E and G hold.',
    '<b>Play</b>: with the root on the 5th string, Bm7 at fret 2 (x 2 4 2 3 2), B♭°7 at fret 1 (x 1 2 0 2 x), then open Am7 (x 0 2 0 1 0).',
    '<b>Solo</b>: it lasts two beats at most. Play its arpeggio, or pass through it on chord tones.',
    '- The rising version goes the other way: G – G♯°7 – Am7',
  ] }],

  ['voicelead', 'The tritone in V7', { b: [
    'A tritone is half an octave, so it’s the same interval upside down: B up to F, or F up to B. That’s why D♭7 (F and C♭) can stand in for G7.',
    'In C minor it works the same: B rises to C, and F falls to E♭.',
    '<b>Play</b>: B on the 3rd string at fret 4 and F on the 2nd string at fret 6, then fret 5 on both (C and E). Each note moves one fret, in opposite directions.',
    '<b>Solo</b>: play B and F on G7 and resolve them on the downbeat of C. That alone outlines the change.',
  ] }],

  ['voicelead', 'The top line', { b: [
    'Start from the melody note and build the chord under it: that’s how chord-melody players think.',
    'On guitar, keep the top note on the 1st or 2nd string and change the notes below. A move of one or two frets is enough.',
    'When the bass falls a 5th (D → G), let the top hold or step the other way.',
    'Avoid parallel 5ths and octaves between top and bass: they merge the two lines into one.',
    '- Practise: C – Am – Dm – G – C with the top note held as long as it fits, then moving by step',
  ] }],

  ['nopull', '♭VI7 → V', { b: [
    'E♭7 is E♭ G B♭ D♭. As a German sixth, E♭ and C♯ (D♭) are an augmented 6th apart and open out to the D octave.',
    'Into D7, every voice falls a half step: E♭ → D, G → F♯, B♭ → A, D♭ → C.',
    'It shares A7’s 3rd and 7th (C♯ and G), so it can replace A7 anywhere it goes to D.',
    '<b>Play</b>: any 7th grip slid down a fret: E♭9 rooted on the 5th string at fret 6, then D9 at fret 5.',
    '<b>Solo</b>: E♭ Lydian dominant (B♭ melodic minor). Its ♯11, A, holds as the 5th of D7.',
  ] }],

  ['dim', 'A pivot to far keys', { b: [
    'F♯°7 is F♯ A C E♭. Each note can rise a half step as a leading tone: F♯ → G, A → B♭, C → D♭, E♭ (D♯) → E.',
    'So the four targets are a minor 3rd apart, and each can be major or minor.',
    'Spell it for where it goes: A°7 is A C E♭ G♭; D♯°7 is D♯ F♯ A C.',
    'To make the new key stick, follow the arrival with a ii–V or a cadence in that key.',
    '- A stock move in Romantic-era music for sudden key changes',
  ] }],

  ['voicelead', 'Common tones', { b: [
    'C (C E G) → Am (A C E): C and E stay, G rises to A.',
    'Am → F (F A C): A and C stay, E rises a half step to F. F → Dm (D F A): F and A stay, C rises to D.',
    'Chords a 3rd apart share two notes; a 5th apart, one; a step apart, none. With none, move all the voices by step against the bass.',
    '<b>Play</b>: on the top three strings, find the next triad in the nearest inversion instead of going back to an open shape.',
  ] }],

  ['borrowed', 'The backdoor ii–V', { b: [
    'Fm7 is F A♭ C E♭; B♭7 is B♭ D F A♭. A♭, E♭ and B♭ all come from C minor.',
    'Fm7 – B♭7 is the ii–V of E♭, so landing on C is the surprise.',
    '<b>Play</b>: Fm7 at fret 1 (6th string), B♭7 at fret 1 (5th string), Cmaj7 at fret 3 (5th string): the hand barely moves.',
    '<b>Solo</b>: F Dorian into B♭ Mixolydian (both are E♭ major), then C major.',
    '- Also in “Misty”, in E♭: A♭m7 – D♭7 – E♭maj7',
  ] }],

  ['voicelead', 'Guide tones and shells', { b: [
    'Through a ii–V–I, each 7th falls a half step to the next 3rd: Dm7’s C to G7’s B, G7’s F to Cmaj7’s E.',
    '<b>Play</b>: two grips cover it. G7 as 3 x 3 4 x x (root, 7th, 3rd); Cmaj7 as x 3 2 4 x x (root, 3rd, 7th).',
    'Add one note on top (a 9, 13 or 5) and a shell becomes a full jazz voicing.',
    '<b>Solo</b>: a line of guide tones, one per chord, already outlines the changes.',
    '- Don’t double the root on top: the bass has it',
  ] }],

  ['borrowed', 'Borrowing the other way', { b: [
    'In A minor, D7 is D F♯ A C: F♯ comes from A Dorian. E7 is E G♯ B D: G♯ comes from harmonic minor. Without it, Em barely pulls.',
    'Also the Neapolitan: B♭ from A Phrygian, usually in first inversion. B♭/D → E7 → Am.',
    '<b>Solo</b>: change the scale with the chord: A Dorian on D7, A harmonic minor on E7.',
    '- “Hit the Road Jack” is the Andalusian cadence on repeat',
  ] }],

  ['voicelead', 'Three jobs', { b: [
    'In C: tonic C, Em, Am; predominant Dm, F; dominant G7, B°.',
    'Dominants hold the tritone B–F. Predominants have F but not B. Tonic chords have no F.',
    'Substitutes share two notes: vi for I, ii for IV, vii° for V7.',
    'iii is the weak one: it shares two notes with I and two with V, so it leans either way.',
    '- I – vi – IV – V is tonic, tonic, predominant, dominant',
    '- V → IV is the rock reversal, a “retrogression”: it works, but it doesn’t pull',
  ] }],

  ['nopull', 'Follow the guide tones', { b: [
    'F7 → G: A rises to B, E♭ falls to D.',
    'A7 → Am7: C♯ slips to C, G holds.',
    '<b>Play</b>: practise the 3rd and 7th alone, two notes on adjacent strings, moving a fret or holding at each change.',
    '<b>Solo</b>: start each bar on a guide tone. The line will sound like the changes even with no band.',
    '- The mistake: jumping to the root of every chord, which hides the voice leading',
  ] }],

  ['other', 'Line clichés', { b: [
    'The chord stays put; only one voice moves, by half steps. Everything else is held.',
    'In major it’s the 5th rising (G – G♯ – A – B♭ in C); in minor, the root falling (C – B – B♭ – A in Cm).',
    '<b>Play</b>: with open Am, the moving note is on the 3rd string: fret 2, 1, 0 (A, G♯, G), then Am6 with F♯ on the 1st string at fret 2.',
    '<b>Solo</b>: put the moving note in the melody too; doubled, the line comes forward.',
    '- “Something” (the Beatles) opens on C – Cmaj7 – C7; “Stairway to Heaven” has the chromatic line falling under A minor',
  ] }],

  ['dim', 'One °7, four dominants', { b: [
    'B°7 is B D F A♭. Under it: G gives G7♭9, B♭ gives B♭7♭9, D♭ gives D♭7♭9, E gives E7♭9.',
    'The four roots, G B♭ D♭ E, are themselves a °7 chord (G°7).',
    'So one grip leads to four targets a minor 3rd apart: C, E♭, G♭ and A.',
    '<b>Play</b>: add the root on the 6th string: 3 x 3 4 3 4 is G7♭9.',
    '<b>Solo</b>: half-whole from any of the four roots: it’s the same eight notes.',
  ] }],

  ['nopull', 'Practise it', { b: [
    'The ♯11s: C7 has F♯, F7 has B, E♭7 has A, A♭7 has D.',
    'All four are notes of G major, which is why 7♯11 sounds at home here.',
    '<b>Grip</b>: 6th-string root, then ♭7, 3rd and ♯11 on the D, G and B strings: 8 x 8 9 7 x is C7♯11. Move it to each root.',
    'Next, sing the 3rd and ♭7 of each chord and move them to the nearest note of G.',
    '- Keep the drone going, so you hear each note against G, not just against the chord',
  ] }],

  ['other', 'Augmented sixths', { b: [
    'The name is the interval from A♭ up to F♯: an augmented 6th. A♭ falls and F♯ rises, a half step each.',
    'They go to V, or to I6/4 (C/G) and then V. The German usually takes the C/G route, which avoids parallel 5ths.',
    'The French is a whole-tone sound: its notes are both A♭7♭5 and D7♭5.',
    '<b>Play</b>: the Italian on guitar is A♭7 with no 5th: 4 x 4 5 x x (A♭, G♭, C).',
    '- Common in Classical and Romantic cadences, from Mozart and Beethoven on',
  ], ex: [['German sixth – C/G – G7 – C', 'Ab:7 C:maj/5 G:7 C:maj'], ['French sixth → G', 'Ab:7b5 G:maj']] }],

  ['map', 'Harmonic minor’s 5th mode', { b: [
    'On E: chord tones E G♯ B D, tensions F (♭9) and C (♭13). A is the sus4: pass through it.',
    'Into Am: G♯ rises to A, F falls to E, D falls to C.',
    'It also fits G♯°7 (G♯ B D F): the same chord without the E.',
    '<b>Play</b>: the E7 arpeggio, with F and C as neighbours. In open position on the low strings it’s the flamenco sound.',
    '- Flamenco, klezmer and neo-classical metal all lean on it',
  ] }],

  ['dim', 'The scales', { b: [
    'It’s symmetrical: it repeats every minor 3rd, so there are only three different ones.',
    'Over G♯°7, the four notes not in the chord (A♯, C♯, E, G) each sit a whole step above a chord tone.',
    'Over E7♭9, the same notes give ♭9 (F), ♯9 (G), ♯11 (A♯) and a natural 13 (C♯).',
    '<b>Play</b>: the pattern repeats every three frets, so one fingering moves up the neck unchanged.',
    '- It doesn’t fit 7♭13 or 7alt: it has a natural 5th and 13th',
  ], ex: [['Whole-half from G♯ over G♯°7', '=G#2 D3 F3 B3 | G#3 | A#3 | B3 | C#4 | D4 | E4 | F4 | G4 | G#4']] }],

  ['dim', 'Finding it', { b: [
    'Why both work: the °7 on the 3rd is the dominant’s 3rd, 5th, ♭7 and ♭9, and the ♭9 is a half step above the root.',
    'In G, A7 → C♯°7 (= B♭°7), B7 → D♯°7 (= C°7).',
    '<b>Play</b>: raise a dominant grip’s root one fret. G7 (3 x 3 4 3 x) becomes A♭°7 (4 x 3 4 3 x).',
    '<b>Solo</b>: half-whole from the dominant’s root.',
  ] }],

  ['voicelead', 'Root motion', { b: [
    'Down a 5th, one note holds: G7 → C keeps G, while B rises to C.',
    'Up a 5th (I → V, IV → I) is softer. Rock chains it: C – G – D – A – E in “Hey Joe”.',
    'Down a 3rd shares two notes, so it feels like a recolouring: C → Am.',
    'Steps share no notes: move the upper voices against the bass to avoid parallel 5ths.',
    '- I – vi – IV – V (doo-wop) is two 3rds and a step',
  ] }],

  ['dim', 'They collapse to three', { b: [
    'Each family is one grip moved in minor 3rds: on the 4th string, F♯°7 at fret 4, A°7 at 7, C°7 at 10.',
    'F♯°7 is a rootless D7♭9, F7♭9, A♭7♭9 or B7♭9. In G, three of those go home: V, the backdoor and the tritone sub.',
    'G♯°7 covers E7, G7, B♭7 and D♭7; C♯°7 covers A7, C7, E♭7 and F♯7.',
    '- Practise each family at four positions on the same strings',
  ] }],

  ['tritone', 'Why it works', { b: [
    'In C: G7 is G B D F; D♭7 is D♭ F A♭ C♭. Root and 5th change; the guide tones don’t.',
    'G7’s altered notes, ♭5 (D♭) and ♭9 (A♭), are the root and 5th of D♭7: the sub is the altered sound over a new bass.',
    'The bass becomes chromatic: D – D♭ – C instead of D – G – C.',
    '<b>Play</b>: hold F and B on the D and G strings (frets 3 and 4). Put G under them (6th string, fret 3) for G7, or D♭ (5th string, fret 4) for D♭7.',
  ], ex: [['Same 3rd and 7th: G7, then D♭7, into C', 'G:7 Db:7 C:maj7'], ['ii – V – I, then ii – ♭II – I', 'D:m7 G:7 C:maj7 D:m7 Db:7 C:maj7']] }],

  ['tritone', '♭VI7 → V', { b: [
    'A♭7 is A♭ C E♭ G♭. Into G7, every voice falls a half step: A♭ → G, C → B, E♭ → D, G♭ → F.',
    'G7 still has to resolve, so this is a chain of two dominants: A♭7 → G7 → C. The bass walks A♭ – G – C.',
    '<b>Play</b>: any A♭7 grip slid down one fret: A♭9 rooted on the 5th string at fret 11, then G9 at fret 10.',
    '<b>Solo</b>: A♭ Lydian dominant, which is E♭ melodic minor (E♭ F G♭ A♭ B♭ C D): the same notes as D7alt. Its ♯11, D, holds as the 5th of G7.',
    '- A common jazz ending: C – A♭7 – G7 – C',
  ] }],

  ['tritone', '♭III7 → ii', { b: [
    'E♭7 is E♭ G B♭ D♭. Into Dm7, every voice falls a half step: E♭ → D, G → F, B♭ → A, D♭ → C.',
    'E♭9 sounds good too: its 9th, F, is the 3rd of Dm7.',
    'You can sub just one dominant in a turnaround and keep the rest: the bass line changes without the harmony getting busy.',
    '<b>Play</b>: E♭7 rooted on the 5th string at fret 6, then Dm7 at fret 5.',
    '<b>Solo</b>: E♭ Lydian dominant, which is B♭ melodic minor (B♭ C D♭ E♭ F G A): the same notes as A7alt.',
  ] }],

  ['tritone', '♭II7 → I', { b: [
    'D♭7 is D♭ F A♭ C♭. Into C: D♭ → C, F → E, C♭ (B) → C, A♭ → G.',
    '<b>Play</b>: D♭9 (x 4 3 4 4 x) to C6/9 (x 3 2 2 3 3).',
    '<b>Solo</b>: D♭ Lydian dominant, which is A♭ melodic minor: the same notes as G7alt.',
    '- “The Girl from Ipanema” has it in F: G♭7 → Fmaj7',
    '- The target can be a dominant: D♭7 → C7 works in a blues',
    '- Most common at the end of a tune or a section, in place of the last G7',
  ] }],

  ['tritone', 'IV7 → iii', { b: [
    'F7 is F A C E♭. Into Em7: F → E, C → B and E♭ → D fall a half step; A falls to G.',
    'Rarer than the other subs. F7 is more often the backdoor or a blues IV, so the next chord tells you which.',
    '<b>Solo</b>: F Lydian dominant, which is C melodic minor (C D E♭ F G A B). Its ♯11, B, is the 5th of Em7.',
    'Chain the subs and the bass falls by half steps all the way to C.',
  ], ex: [['Subs into iii, ii and I: F – E – E♭ – D – D♭ – C', 'F:7#11 E:m7 Eb:7#11 D:m7 Db:7#11 C:maj7']] }],

  ['tritone', '♭V7 → IV', { b: [
    'G♭7 is G♭ B♭ D♭ F♭. Into Fmaj7: G♭ → F, B♭ → A, D♭ → C, and F♭ holds as E.',
    'In a jazz blues, bar 4 can use it: G♭7 → F7 instead of C7 → F7. It sounds most natural when IV is a goal, as in bar 5 of a blues.',
    '<b>Play</b>: G♭9 rooted on the 5th string at fret 9, then F at fret 8.',
    '<b>Solo</b>: G♭ Lydian dominant, which is D♭ melodic minor (D♭ E♭ F♭ G♭ A♭ B♭ C): the same notes as C7alt.',
  ], ex: [['C blues, bar 4: G♭7 into F7', 'C:7 Gb:9 F:9']] }],

  ['dim', 'Only three exist', { b: [
    'Spelling still matters: B°7 is B D F A♭, but as D°7 it’s D F A♭ C♭. The name tells you which note leads where.',
    'The three families: C°7, C♯°7 and D°7. Each covers four of the twelve notes.',
    '<b>Grips</b>: x x 4 5 4 5 (F♯°7), x 3 4 2 4 x (C°7), 3 x 2 3 2 x (G°7).',
    '- The augmented triad is the same idea in major 3rds: only four exist',
  ] }],

  ['dim', '♯iv°7 back to the tonic', { b: [
    'C♯°7 is C♯ E G B♭. Into G/D: C♯ rises to D, E falls to D, G holds, B♭ rises to B.',
    '<b>Play</b>: Cmaj7 (x 3 5 4 5 x), C♯°7 (x 4 5 3 5 x), G/D (x 5 5 4 3 x): the bass climbs one fret at a time on the 5th string.',
    '<b>Solo</b>: A half-whole over C♯°7, landing on D or B over G/D.',
    '- In a jazz blues it’s bar 6: C7 – C♯°7 – G/D',
  ] }],

  ['nopull', 'How they move', { b: [
    'In G: ♭II7 is A♭7, ♭VI7 is E♭7, ♭VII7 is F7, IV7 is C7.',
    'In each, a guide tone holds or moves by half step into the next chord.',
    '<b>Hear them</b>: down a half step in “The Girl from Ipanema”; up a whole step in the backdoor of “Misty”; plagal in every blues; staying put in funk vamps.',
    '<b>Solo</b>: Lydian dominant on the first three; Mixolydian or the blues scale on the plagal and vamp ones.',
  ], ex: [['Four ways home to G', 'Ab:7#11 G:maj7 F:9 G:maj7 C:7 G:maj7 G:9 G:13']] }],

  ['map', 'Avoid notes', { b: [
    'In C: F over Cmaj7, F over Am7, C over G7.',
    'Phrygian’s ♭2 over iii (F over Em7) is the strongest clash: a half step above the root.',
    'The 11 is fine on minor chords (G over Dm7): it’s a whole step above the ♭3.',
    '<b>Fix it</b>: raise the 4th to ♯11 over major, or play a 7sus4 when the 4th is in the melody.',
    '- Practise: hold each scale note over a drone and hear which ones want to move',
  ] }],

  ['tritone', 'Play 7♯11 on them', { b: [
    'D♭7♯11 is D♭ F A♭ C♭ G. A♭ melodic minor from D♭: D♭ E♭ F G A♭ B♭ C♭.',
    'The 9th (E♭) and 13th (B♭) work too: D♭13♯11 is the full sound.',
    '<b>Play</b>: 9 x 9 10 8 x is D♭7♯11.',
    'The other subs work the same way: A♭7♯11 (♯11 D), E♭7♯11 (A), G♭7♯11 (C). Each time the ♯11 is the original dominant’s root.',
  ] }],

  ['tritone', 'Sub the ii as well', { b: [
    'The guide tones still line up: G♭ falls to F then E, C♭ holds and rises to C.',
    '<b>Solo</b>: A♭ Dorian (the notes of G♭ major) on A♭m7, then change G♭ to G for D♭7♯11.',
    '<b>Play</b>: the same grips as the plain ii–V, six frets away.',
    '- “Satin Doll” has it: Am7 – D7 – A♭m7 – D♭7 – Cmaj7',
  ] }],

  ['other', 'IV7 in minor', { b: [
    'Am7 is A C E G; D7 is D F♯ A C. A and C hold, G falls to F♯, E falls to D.',
    'It doesn’t go on to G: it usually swings straight back to Am.',
    '<b>Play</b>: Am7 at fret 5 on the 6th string, D9 at fret 5 on the 5th string (x 5 4 5 5 x): the hand barely moves.',
    '<b>Solo</b>: A Dorian (the notes of G major) over both. Target F♯ on the D7.',
    '- Also “Evil Ways”: a Gm7 – C7 vamp in G Dorian',
  ] }],

  ['dim', '°7 vs ø7', { b: [
    'In C, Bø7 (B D F A) comes from the scale; B°7 (B D F A♭) borrows A♭ from C minor.',
    'Bø7 is a rootless G9; B°7 is a rootless G7♭9.',
    'Bø7 has the same notes as Dm6 (D F A B): only the bass differs.',
    '<b>Play</b>: Bø7 is x 2 3 2 3 x; B°7 is x 2 3 1 3 x. One finger apart.',
  ], ex: [['Bø7 – E7 – Am, then B°7 – C', 'B:m7b5 E:7 A:m7 B:dim7 C:maj7']] }],

  ['borrowed', 'II7 (9, 13)', { b: [
    'D7 is D F♯ A C. Against C, only F♯ is new: the other three notes are in the key.',
    'It usually goes to Dm7, to F, or straight back to C.',
    '<b>Play</b>: open D7 (x x 0 2 1 2) after open C.',
    'Its 9th and 13th (E and B) are in C major too. Avoid the ♭9 (E♭): it makes D7 sound like V/V again.',
    '- Also “Take the A Train”, bars 3–4: D7♭5 after Cmaj7',
  ] }],

  ['other', 'Tonic colours', { b: [
    '<b>Play</b>: C6/9 is x 3 2 2 3 3; Cmaj9 is x 3 2 4 3 x.',
    'Match the colour to the melody’s last note: on A use 6 or 6/9; on B, maj7 or maj9; on D, 6/9 or maj9.',
    'Pop often ends on add9 (C E G D) instead, and rock on a plain triad or a power chord.',
  ] }],

  ['nopull', 'Pull or colour?', { b: [
    'In G, D7 is the only dominant that pulls home. Secondary dominants (A7 → D, E7 → Am, B7 → Em) pull to their own targets.',
    'Why: the 3rd and ♭7 resolve by half step to a chord a 5th below. Take that target away and it’s just a rich sound.',
    '- The mistake: treating every 7 chord as a V and adding altered notes',
  ], ex: [['Pull, then colour: D7 → G, F7 → G', 'D:7 G:maj7 F:9 G:maj7']] }],

  ['dim', 'Common-tone diminished', { b: [
    'It’s the °7 built on the chord’s own root: G°7 (G B♭ D♭ E) is A♯°7 respelled, and D°7 is G♯°7.',
    'In jazz it often decorates I6: G6 – G°7 – G6.',
    '<b>Play</b>: G6 (3 x 2 4 3 x) to G°7 (3 x 2 3 2 x): two fingers drop a fret, B to B♭ and D to C♯.',
    '<b>Solo</b>: G major, with B♭ and C♯ as chromatic neighbours, or just the °7 arpeggio.',
  ] }],

  ['melmin', 'Where they come from', { b: [
    'In C: Cm(maj7), D7sus4♭9, E♭maj7♯5, F7♯11, G7♭13, Aø9, B7alt.',
    'The three you’ll use most: 7♯11 for tritone subs and non-pulling dominants, 7alt for V7, ø9 for iiø in minor.',
    '<b>Shortcut</b>: over X7alt, melodic minor a half step up; over X7♯11, a 5th up; over Xø7, a minor 3rd up.',
    'F7♯11 and B7alt, a tritone apart, share one scale: the tritone sub in scale form.',
  ], ex: [['F7♯11 – B7alt: one scale for both', 'F:7#11 B:7alt F:7#11 B:7alt']] }],

  ['dim', 'When the swap doesn’t work', { b: [
    'Fix for the natural 9: play D9 or D13 instead of the °7.',
    'Into major, D7♭9 with its root keeps the bass falling a 5th, which sounds firmer than F♯°7.',
    'Test: if the melody note is in the °7, or a whole step above one of its notes, the swap works.',
    '- The °7 needs the bass to rise a half step to land well. If the bass must fall a 5th, keep the dominant',
  ] }],
['diatonic', 'I', { b: [
    'In C: C E G, with B added for Cmaj7. Most songs start here and nearly all end here.',
    '<b>On the guitar</b>: open C (x32010) or Cmaj7 (x32000); up the neck, the A-string barre at the 3rd fret.',
    '- A plain triad with the root on top sounds most final; maj7 sounds softer and less finished',
    '- Root in the bass for a full stop; C/E or C/G keeps the music moving',
  ] }],
  ['diatonic', 'ii', { b: [
    'In C: Dm7, D F A C. Its root is a 5th above V, so ii – V – I is two steps round the cycle of 5ths.',
    'Guide tones: Dm7’s 7th (C) falls a half step to B, G7’s 3rd, and its 3rd (F) holds as G7’s 7th.',
    '<b>On the guitar</b>: Dm7 xx0211 open, or x57565 as a barre at the 5th fret.',
    'Chains of ii – V – I run through standards like “Autumn Leaves” and “Satin Doll”. In pop it’s often a plain triad: C – Dm – G – C.',
  ] }],
  ['symbols', 'The triad', { b: [
    'Each is two stacked 3rds: major is a major 3rd then a minor 3rd; minor is the reverse; diminished is two minor 3rds; augmented is two major 3rds.',
    'In C: C E G, C E♭ G, C E♭ G♭, C E G♯.',
    'A triad symbol never asks for a 7th. Jazz players may add a 6 or maj7 to a plain C as colour; in pop, play what’s written.',
    '<b>On the guitar</b>: C x32010, Cm x35543, C° x3454x, C+ x3211x.',
  ] }],
  ['diatonic', 'vi', { b: [
    'In C: Am, A C E, with G added for Am7. It shares C and E with the I chord, so it can replace I almost anywhere.',
    'The deceptive cadence: G7 – Am instead of G7 – C. The leading tone still rises to C, but the bass steps up to A.',
    '<b>On the guitar</b>: Am x02210, Am7 x02010.',
    'Heard in the 1950s progression I – vi – IV – V (C – Am – F – G) and the pop loop I – V – vi – IV.',
  ] }],
  ['diatonic', 'viiø', { b: [
    'In C: Bø7 is B D F A. Read it as Bm7♭5: minor 3rd, ♭5, ♭7.',
    'Its B and F are the same tritone that sits inside G7, which is why it pulls to C: B rises to C, F falls to E.',
    '<b>On the guitar</b>: x2323x (B F A D), the standard ø7 grip with the root on the A string.',
    'As a plain triad (B°) it’s mostly a quick passing chord; as Bø7 it’s the usual bridge from C major into A minor.',
  ] }],
  ['chordmelody', 'The melody is always the top note', { b: [
    '<b>How to do it</b>: find the melody note on the top two strings first, then hang the chord under it.',
    'Most tunes are written too low for this. Move the melody up an octave so there’s room for the chord underneath.',
    'Worked: melody E over C. Put E on the B string, 5th fret, then add C on the A string (3rd fret) and the open G between.',
    '- The common mistake: grabbing a familiar open chord whose top note is a different pitch. The tune gets lost',
    '- Pluck the top string a little harder than the rest so the melody sings',
  ], ex: [['Melody C – D – E, each on top', '=C3 E3 G3 C4 | G2 F3 B3 D4 | C3 E3 G3 E4', 'C → G7 → C']] }],
  ['diatonic', 'iii', { b: [
    'In C: Em7, E G B D. Over a C bass it becomes Cmaj9.',
    'It’s the weakest-sounding chord in a major key, so pop songs use it sparingly, usually on the way to vi or IV.',
    '<b>On the guitar</b>: Em 022000, Em7 020000 or 022030.',
    '- Common moves: I – iii – IV (C – Em – F), and IV – iii – ii – I stepping down',
    '- A melody on B (the 7th degree) often takes iii instead of I',
  ] }],
  ['chordmelody', 'Listen and steal', { b: [
    '<b>How to do it</b>: pick one short recording and learn eight bars by ear, slowly. Note where the bass moves and how few notes sit under the melody.',
    '- Joe Pass: a whole band implied with very few notes',
    '- Ted Greene: voice-leading and moving inner voices',
    '- Lenny Breau: chords mixed with harmonics; Martin Taylor: walking bass under the tune',
    'Those first tunes have slow melodies, long notes to fill and standard ii–V–I changes. Work voicings out yourself; the ones you find by ear are the ones you keep.',
  ] }],
  ['diatonic', 'IV', { b: [
    'In C: F A C, with E added for Fmaj7. It shares only C with the I chord, which is why it sounds like a step away.',
    '<b>On the guitar</b>: F barre 133211, or Fmaj7 xx3210, easier and often prettier in C.',
    '- I – IV – I is the commonest back-and-forth in pop, folk and gospel; the 12-bar blues is built on I, IV and V',
    '- IV – V – I is the full cadence; IV – I alone is gentler',
    '- In a melody, IV harmonises F, A and C',
  ] }],
  ['chordmelody', 'One note, many chords', { b: [
    '<b>How to do it</b>: list the jobs the melody note can do (root, 3rd, 5th, 7th, 9th, 13th) and find the chord for each.',
    'Worked, with G on top: root (G), ♭3 (Em), 3rd (E♭), 5th (C), ♭7 (A7 or Am7), maj7 (A♭maj7), 9th (Fmaj9), 13th (B♭13).',
    'Choose the one whose bass moves well from the chord before and into the next.',
    '- The common mistake: a colourful chord that fights the key or the bass line. Save the bold ones for the second chorus',
  ] }],
  ['symbols', 'add, 6 and 6/9', { b: [
    'Read “add” literally: only the named note joins the triad. C9 would bring B♭ as well; Cadd9 doesn’t.',
    'Cadd2 is the same notes as Cadd9, written to show the D sitting close to C.',
    'C6 and Am7 share all four notes (C E G A); the bass decides which you hear.',
    '<b>On the guitar</b>: Cadd9 x32033, C6 x32210, C6/9 x32233. Minor 6 chords are a gypsy-jazz staple.',
  ] }],
  ['diatonic', 'Three families', { b: [
    'In C: tonic C, Em, Am; predominant Dm, F; dominant G, B°.',
    '- C and Am share C and E; Dm and F share F and A; G and B° share B and D',
    '- iii is the loosest member: Em shares E and G with C, and G and B with G',
    'The usual order is tonic → predominant → dominant → tonic. Going backwards (V – IV – I) is a rock sound.',
    'When reharmonising, swap a chord for another in its family as long as the melody note fits.',
  ] }],
  ['diatonic', 'Minor keys mix all three', { b: [
    'In C minor: Cm7, Dø7, E♭maj7, Fm7 or F7, G7, A♭maj7, B♭7, B°7.',
    'Natural minor gives the colours; harmonic minor gives the leading tone B for V7 and vii°7; melodic minor gives the bright IV7 and the m6 or m(maj7) tonic.',
    'The minor ii–V–i (iiø7 – V7 – i) is all over “Autumn Leaves”, in its relative minor.',
    '<b>On the guitar</b>: Cm6 x3121x (C E♭ A C), Dø7 x5656x, G7 353433.',
  ] }],
  ['symbols', 'How a symbol is built', { b: [
    'Quality: no letter is major, m minor, ° diminished, + augmented, ø half-diminished; sus replaces the 3rd.',
    'Then the 7th: 7 alone is ♭7, maj7 is the major 7th. A 9, 11 or 13 includes the 7th below it.',
    'Alterations change one note each; everything not mentioned stays as it is in the base chord.',
    'Worked: Bø7/F is half-diminished B (B D F A) with F, its ♭5, in the bass.',
    'If a symbol is unclear, find the 3rd and 7th first. They tell you almost everything.',
  ] }],
  ['chordmelody', 'What it is', { b: [
    'There’s no singer or soloist: you carry the tune, so you can’t hide behind the chords.',
    '- Melody on the top strings, one or two inner notes, bass on the low strings. You rarely need all six strings',
    '- Fingerstyle is easiest, since you can pluck bass and melody together; hybrid picking works too',
    'Start with a ballad. Fast tunes leave no time for chords under each note.',
    'Good arrangements breathe: some melody notes alone, some with full chords.',
  ] }],
  ['symbols', 'sus', { b: [
    'In C: Csus4 is C F G, Csus2 is C D G. With no 3rd they’re neither major nor minor.',
    'Sus4 wants to resolve, F falling to E; sus2 is happy to stay as an open colour.',
    'Csus2 and Gsus4 are the same notes (C D G); the bass decides which you hear.',
    '<b>On the guitar</b>: Dsus4 xx0233, Dsus2 xx0230, Asus4 x02230, Asus2 x02200. Adding and lifting one finger on open D and A is a folk-rock staple.',
  ] }],
  ['types', 'add9', { b: [
    'In C: C E G D. The 9 sits a whole step above the root; voiced close (C D E) it gives a warm crunch.',
    'Lives on I and IV in major, and on V in pop. On a minor chord it becomes madd9 (C E♭ G D).',
    '<b>On the guitar</b>: Cadd9 x32033. Between G (320033), Em7 (022033) and Cadd9, the top two fingers never move: a staple of acoustic pop.',
    '- Keep the 3rd: without it the chord is sus2, which is vaguer',
    '- Not C9, which adds B♭ and acts as a dominant',
  ] }],
  ['chordmelody', 'Intros and endings', { b: [
    '<b>How to do it</b>: for an intro, play the last four bars of the tune in chord melody and stop on V, so the melody can start.',
    'Worked in C: reach Cmaj7, then tag Em7 – A7 – Dm7 – G7 (iii – VI – ii – V) twice before landing on C6/9.',
    'Slow the last line freely and let the final chord ring.',
    '- The common mistake: an intro so long or busy that the tune sounds like an afterthought',
  ] }],
  ['types', '6', { b: [
    'In C: C E G A. Use it instead of maj7 when the melody sits on the root, since B under C rubs.',
    '<b>On the guitar</b>: C6 x32210, or x35555 as a barre at the 5th fret.',
    'It doesn’t need to resolve: a stable colour, the home chord of swing, western swing and early rock’n’roll.',
    'Cm6 (C E♭ G A) is a separate sound: the minor tonic of gypsy jazz and Dorian tunes.',
  ] }],
  ['types', 'Power chord', { b: [
    'In C: C and G, often with C doubled an octave up. A root and a 5th, not a full chord.',
    '<b>On the guitar</b>: x355xx with the root on the A string, or 8 10 10 on the bottom three strings with the root on the low E. The shape moves anywhere.',
    '- Palm-mute the low strings for the chug of punk and metal',
    '- ♭III and ♭VII (E♭5, B♭5) come from minor and blues, and power chords make them easy to borrow',
    'Heard in “You Really Got Me”, “Smells Like Teen Spirit” and most punk rhythm guitar.',
  ] }],
  ['types', '6/9', { b: [
    'In C: C E G A D. The 5th is the first note to drop.',
    '<b>On the guitar</b>: x32233 (C E A D G). Above the root, E A D G stack in 4ths, which is why it sounds open and modern.',
    'It holds all of C major pentatonic (C D E G A), so almost any melody note in the key sits on it happily.',
    'Works on IV too (F6/9). The minor version, Cm6/9 (C E♭ G A D), is a rich Dorian tonic.',
  ] }],
  ['chordmelody', 'Approach chords', { b: [
    '<b>How to do it</b>: find melody notes that fall just before a chord change, usually on beat 4 or the “and” of 4.',
    'Worked: melody B then C over G7 → C. Play D♭7, the tritone sub, under the B (B is its 7th), then C.',
    'Keep the approach chord short and lighter than its target, so it sounds like a lead-in.',
    '- The common mistake: approaching every chord. Save it for phrase ends and half-step melody moves',
  ] }],
  ['types', '13♭9', { b: [
    'In C: C E G B♭ D♭ A. The 5th goes first, and the root too if someone else has the bass.',
    'Lives on V of a major key (G13♭9 → C) and on secondary dominants heading to a major chord.',
    '<b>On the guitar</b>: in C, G13♭9 is 3x3454 (G F B E A♭).',
    'Over it, play the half-whole diminished scale: G A♭ B♭ B C♯ D E F. A bebop and big-band sound.',
  ] }],
  ['chordmelody', 'Fill the long notes', { b: [
    '<b>How to do it</b>: count the beats. One beat, leave it. Two or more, add one moving line, not three.',
    'Worked: melody C held for a bar over Am. Move an inner voice A – G♯ – G – F♯ under it: Am – Am(maj7) – Am7 – Am6.',
    'Keep the fill below the melody note and quieter than it.',
    '- The common mistake: a busy fill that crowds the next melody note. Finish before the melody moves',
  ] }],
  ['symbols', 'Spell any chord', { b: [
    'Count from the root’s major scale: 3, 5 and 7 are its notes; ♭ lowers one, ♯ raises one.',
    'Worked: F♯m7. F♯ major is F♯ G♯ A♯ B C♯ D♯ E♯; take 1 3 5 7 (F♯ A♯ C♯ E♯), then flatten 3 and 7: F♯ A C♯ E.',
    '- Gmaj7: G B D F♯. B♭7: B♭ D F A♭',
    '- Keep the letters in order even when the name looks odd: E♭m has G♭, not F♯',
  ] }],
  ['types', 'Major', { b: [
    'In C: C E G. A major 3rd (4 frets) then a minor 3rd (3 frets).',
    '<b>On the guitar</b>: C x32010, G 320003, D xx0232, A x02220, E 022100. The E and A shapes barre anywhere.',
    'In C, the three chords C, F and G between them harmonise every note of the scale. Most folk, country and early rock’n’roll uses little else.',
    'The 3rd on top sounds sweetest; the root on top sounds most final.',
  ] }],
  ['chordmelody', 'Learn the melody first', { b: [
    '<b>How to do it</b>: learn from a vocal recording rather than an instrumental, and copy the singer’s phrasing.',
    'Then play it on the top two strings, an octave above where it’s written, so it sits over the chords.',
    'Note the highest and lowest melody notes: they decide the key and the position.',
    '- The common mistake: learning the chords first and fitting a vague melody on top',
    '- Test: if you can’t sing it without the guitar, you don’t know it yet',
  ] }],
  ['chordmelody', 'The second time through', { b: [
    '<b>How to do it</b>: change one thing per chorus, so the listener can still follow the tune.',
    'Worked: chorus 1 in block chords mid-neck; chorus 2 with the melody an octave up and tritone subs on the V chords; last chorus plain again, with a tag ending.',
    'Other options: change the feel (ballad to bossa or swing), or put the melody in the bass with chords above.',
    '- The common mistake: changing everything at once. Keep the melody clear even when the harmony is new',
  ] }],
  ['types', 'Diminished triad', { b: [
    'In C: C E♭ G♭, two minor 3rds. Its outer interval is a tritone (C to G♭).',
    '<b>On the guitar</b>: B° x2343x (B F B D), or xxx431 on the top three strings (B D F).',
    'B° in C resolves inward: B rises to C, F falls to E.',
    'Add a ♭7 and it becomes Bø7; add a 𝄫7 for B°7. As a held chord it’s rare in pop: you mostly hear it in passing.',
  ] }],
  ['diatonic', 'V', { b: [
    'In C: G7, G B D F. B rises to C and F falls to E: that’s the resolution.',
    '<b>On the guitar</b>: open G7 320001, barre 353433.',
    '- A plain G triad still works; the 7th adds pull',
    '- In minor keys V is still major: G7 in C minor, borrowed from harmonic minor',
    '- A phrase that stops on V (a half cadence) asks a question; the next phrase answers on I',
  ] }],
  ['symbols', 'Slash chords', { b: [
    'The letter after the slash is only the lowest note. The chord above stays the same.',
    '- Bass lines: C – C/B – Am – Am/G walks the bass down C B A G',
    '- F/G is a soft, sus-sounding V (G F A C)',
    '<b>On the guitar</b>: C/E 032010, C/G 332010, D/F♯ 2x0232 (thumb on the F♯).',
    'If the bass note is in the chord, it’s an inversion; if not, read the whole thing as a new chord.',
  ], ex: [['The falling bass: C – C/B – Am – Am/G – F', 'C:maj C:maj/7 A:min A:min/b7 F:maj']] }],
  ['chordmelody', 'Three voices are enough', { b: [
    '<b>How to do it</b>: play the root on the 6th or 5th string, then whichever of the 3rd or 7th sits closest below the melody.',
    'Worked: G7 with D on top. Root G on the low E, F (the 7th) or B (the 3rd) under the D.',
    'Moving the guide tone by a half step (C → B from Dm7 to G7) makes the harmony sound complete with very few notes.',
    '- The common mistake: full grips everywhere, which bury the melody and slow the changes',
  ] }],
  ['chordmelody', 'Not every note gets a chord', { b: [
    '<b>How to do it</b>: mark the notes on beats 1 and 3 and any longer than a beat. Those get chords; the rest are played alone.',
    'Worked: four quarter notes over C. Chord on beat 1, single notes on 2 and 4, a lighter two-note chord on 3 if it needs it.',
    'Let the bass and chord ring while the single notes move above them.',
    '- The common mistake: a chord on every note, which makes the tune heavy and slow',
  ] }],
  ['symbols', 'Omissions', { b: [
    'The 5th goes first because it adds little colour and is already strong in the root’s overtones.',
    '- C13 on guitar: C, B♭, E, A (x3x355), no 5th, 9th or 11th',
    '- C7♯9: C, E, B♭, D♯ (x3234x), no 5th',
    '(no3) or omit3 tells you a sus or power-chord sound is wanted. In a band, guitarists often play just the 3rd and 7th.',
  ] }],
  ['symbols', 'The bare 7 is always ♭7', { b: [
    'The ♭7 makes a tritone with the 3rd (E to B♭ in C7), which is what makes a dominant want to resolve.',
    'Cø7 (Cm7♭5) has ♭7 too: C E♭ G♭ B♭. Only °7 lowers it further.',
    '<b>On the guitar</b>: C7 x32310, Cmaj7 x32000 or x35453, Cm7 x35343.',
    '- The common misreading: Cmaj7 for C7 or the reverse. They do opposite jobs: one rests, one pulls',
  ] }],
  ['chordmelody', 'A melody note outside the chord', { b: [
    '<b>How to do it</b>: name the note’s interval above the chord root. 9, ♯11 and 13 are safe colours; ♭9, ♯9 and ♭13 belong on dominants.',
    'Worked: melody F over C. F is the 4th, so play it as a passing note, or change the chord to one that has F: Dm7, F or G7.',
    '- The common mistake: changing the melody note to fit the chord. Change the chord, never the tune',
  ] }],
  ['types', 'm(maj7)', { b: [
    'In C: C E♭ G B. A minor triad with the leading tone; the major 7th rubs against the root.',
    '<b>On the guitar</b>: x35443 (C G B E♭ G). In A minor with open strings: Am x02210, Am(maj7) x02110, Am7 x02010, Am6 x02212.',
    'Heard in the line cliché of “My Funny Valentine”. The “James Bond chord”, Em(maj9), is its richer cousin.',
  ] }],
  ['types', 'Minor', { b: [
    'In C: C E♭ G. A minor 3rd (3 frets) then a major 3rd (4 frets).',
    '<b>On the guitar</b>: Am x02210, Em 022000, Dm xx0231. The Em and Am shapes barre anywhere: Cm x35543.',
    'Only the 3rd differs from major, so Cm and C are one fret apart on one string (the B string in the x35543 shape).',
    'A minor chord isn’t sad on its own: in a major key, ii and vi are just softer colours.',
  ] }],
  ['diatonic', 'Melodic minor’s 7ths', { b: [
    'The scale: C D E♭ F G A B. C major with a ♭3, so it’s minor and bright at once.',
    '- 4th mode: F Lydian dominant, over F7♯11',
    '- 6th mode: A Locrian ♮2, over Aø7',
    '- 7th mode: B altered, over B7alt',
    'Classical writers raise the 6th and 7th only going up; jazz keeps them both ways. Cm(maj7) and Cm6 are the two tonic colours.',
  ] }],
  ['types', 'maj9, m9, m11', { b: [
    'In C: Cmaj9 is C E G B D; Cm9 is C E♭ G B♭ D; Cm11 is C E♭ G B♭ D F.',
    '<b>On the guitar</b>: Cmaj9 x3243x, Cm9 x3133x, Cm11 x3334x. Drop the 5th first.',
    'The 11 sits well on a minor chord, a whole step above the ♭3; on a major chord it’s a half step above the 3rd and clashes.',
    'Neo-soul and R&B lean on m9 and m11; the “So What” voicing is a stacked-4ths m11 sound.',
  ] }],
  ['chordmelody', 'Every chord, every top note', { b: [
    '<b>How to do it</b>: take one chord, say G7, and find a voicing with each chord tone on the high E string. Then do Cmaj7, Dm7 and Am7.',
    'Worked, drop 2 G7 on the top four strings: G on top is xx3433 (F B D G); B on top is xx5767 (G D F B).',
    'Four voicings per chord on one string set is plenty to start.',
    '- The common mistake: knowing only root-position grips, then bending the melody to fit them',
  ] }],
  ['types', 'maj7', { b: [
    'In C: C E G B. The 7th sits a half step below the root: a soft rub that sounds dreamy, not tense.',
    '<b>On the guitar</b>: Cmaj7 x32000, Fmaj7 xx3210, Cmaj7 barre x35453.',
    'It doesn’t need to resolve, so it’s a resting chord. When the melody sits on the root, use a 6 instead.',
    'A staple of bossa nova, soft rock and ballads.',
  ] }],
  ['types', 'maj7♯11', { b: [
    'In C: C E G B F♯. The ♯11 is the raised 4th, the Lydian mode’s note.',
    'It lives on IV because F Lydian (F G A B C D E) is just C major from F: the ♯11 of F, B, is already in the key.',
    '<b>On the guitar</b>: in C, Fmaj7♯11 is 1x2200 (F E A B E), with the open B and E ringing.',
    'Leave out the 5th; the maj7 and ♯11 carry the colour. The Simpsons theme is in Lydian.',
  ] }],
  ['chordmelody', 'Bass on the downbeat', { b: [
    '<b>How to do it</b>: play just melody and bass first, one bass note per chord. Add a guide tone only after that sounds right.',
    'Worked: Dm7 – G7 – C under the melody A – B – C. Bass D, G, C on each beat 1; the melody on top is already the tune with its harmony.',
    'If the melody is too far above the bass, use an inversion: C/E puts the bass closer and still sounds clear.',
    '- The common mistake: bass on every beat of a ballad, blurring the melody',
  ] }],
  ['symbols', 'Every way to write it', { b: [
    'Sus and add are written the same almost everywhere; 7th chords are where books differ most.',
    '- In handwriting, a capital M (major) and a small m (minor) can look alike. Check the 3rd against the melody',
    '- CΔ usually means Cmaj7, though many players treat it as any major tonic and play a 6 or 6/9',
    '- C+ means augmented, not “C plus something”',
    'When in doubt, play the 3rd and 7th: they settle every one of these.',
  ] }],
  ['diatonic', 'The major key in 7ths', { b: [
    'In C: Cmaj7 (C E G B), Dm7 (D F A C), Em7 (E G B D), Fmaj7 (F A C E), G7 (G B D F), Am7 (A C E G), Bø7 (B D F A).',
    'Each chord takes every other note of the scale, starting on its own degree.',
    '<b>On the guitar</b>: play them all with the root on the A string, moving up the neck by scale steps.',
    'Because the pattern never changes, one ii – V – I shape works in every key.',
  ] }],
  ['diatonic', 'The minor key in 7ths', { b: [
    'In C minor: Cm7 (C E♭ G B♭), Dø7 (D F A♭ C), E♭maj7 (E♭ G B♭ D), Fm7 (F A♭ C E♭), Gm7 (G B♭ D F), A♭maj7 (A♭ C E♭ G), B♭7 (B♭ D F A♭).',
    'The same set as E♭ major, the relative major.',
    'With harmonic minor’s B: G7 instead of Gm7, and B°7 (B D F A♭) on the 7th degree.',
    'A common rock loop: i – ♭VII – ♭VI – ♭VII (Cm – B♭ – A♭ – B♭).',
  ], ex: [['i – ♭VII – ♭VI – ♭VII', 'C:min Bb:maj Ab:maj Bb:maj C:min']] }],
  ['symbols', 'Alterations', { b: [
    'In C7: ♭9 is D♭, ♯9 is D♯, ♯11 is F♯, ♭13 is A♭.',
    'They belong on dominants, mostly a V7 going home; ♭9 and ♭13 point especially well to a minor chord.',
    'They resolve by half step or hold: in C7♭9 → F, D♭ falls to C; in C7♭13 → Fm, A♭ stays as Fm’s 3rd.',
    '<b>On the guitar</b>: C7♭9 x3232x, C7♯9 x3234x.',
  ] }],
  ['types', '7sus4 and 9sus4', { b: [
    'In C: C7sus4 is C F G B♭; C9sus4 is C F G B♭ D.',
    '<b>On the guitar</b>: C9sus4 x3333x (C F B♭ D), one barre; G7sus4 353533.',
    'The 4th falling to the 3rd (C → B in G7sus4 → G7) is the old suspension that gives the chord its name.',
    'Herbie Hancock’s “Maiden Voyage” is built almost entirely on these chords.',
  ] }],
  ['symbols', 'Extensions bring the 7th', { b: [
    'In C: C9 is C E G B♭ D; Cmaj9 C E G B D; Cm9 C E♭ G B♭ D; C13 C E G B♭ D A.',
    'If there’s no 7th, the symbol says “add”: Cadd9 has no B♭.',
    '<b>On the guitar</b>: C9 x32333, Cm9 x3133x, C13 x3x355.',
    'A plain 7th is never wrong for an extended chord: C7 for C13 is just plainer.',
  ] }],
  ['symbols', 'Roman numerals', { b: [
    'In C: I C, ii Dm, iii Em, IV F, V G, vi Am, vii° B°.',
    'The numerals work in any key, so ii – V – I is Dm – G – C in C and Gm – C – F in F.',
    'Add the chord type after the numeral: Imaj7, ii7, V7, viiø7.',
    'Nashville numbers use plain digits (1 – 4 – 5) for the same idea.',
  ], ex: [['ii – V – I in C, then in F', 'D:m7 G:7 C:maj7 G:m7 C:7 F:maj7']] }],
  ['types', 'Augmented', { b: [
    'In C: C E G♯, two major 3rds. C+, E+ and G♯+ share the same three notes.',
    '<b>On the guitar</b>: x3211x (C E G♯ C). Slide it up four frets and the notes stay the same.',
    'The ♯5 rises a half step: in G+ → C, D♯ goes to E.',
    'Spell it with ♯5, not ♭6: C+ is C E G♯, not C E A♭.',
    'In C – C+ – C6 – C7, one inner voice climbs G – G♯ – A – B♭ while the rest stays put.',
  ] }],
  ['chordmelody', 'Arrange in passes', { b: [
    '<b>Key choice</b>: pick a key that puts the melody on the top two strings and the main bass notes on open E, A or D.',
    'Worked: in pass 2, one bass note per chord; in pass 3, only the 3rd or 7th. Play it at that stage: often it’s already enough.',
    'Write it down in tab or record each pass as you go.',
    '- The common mistake: trying to do it all at once from the chart, which leads to unplayable grips',
  ] }],
  ['types', '7♯11', { b: [
    'In C: C E G B♭ F♯. The ♯11 avoids the clash between the 3rd and a natural 11.',
    '<b>On the guitar</b>: x3435x (C F♯ B♭ E).',
    'In C, D♭7♯11 puts G, the root of V, on top as its ♯11.',
    'Over it, play Lydian dominant (C D E F♯ G A B♭), the 4th mode of G melodic minor. “Take the ‘A’ Train” has its II7 (D7♭5) in this colour.',
  ] }]
];
for (const [deck, title, add] of SPRUCE2) {
  const c = DECKS.find((d) => d.id === deck)?.cards.find((x) => x.t === title);
  if (!c) { console.warn('no card', deck, title); continue; }
  if (add.b) c.b = [...(c.b || []), ...add.b];
  if (add.ex) { const own = c.play ? [['The example', c.play]] : []; c.ex = [...(c.ex || []), ...own, ...add.ex]; delete c.play; }
}

// ---------- the key cards play their key: the three progressions you'd use to learn a key ----------
for (const id of ['majkeys', 'minkeys']) {
  for (const c of DECKS.find((d) => d.id === id).cards) {
    if (!c.key) continue;
    const n = c.key.notes, k = `${P(n[0])}${c.key.minor ? ' minor' : ''}`;
    c.ex = c.key.minor
      ? [[`i – iv – V7 – i in ${k}`, `${n[0]}:min ${n[3]}:min ${n[4]}:7 ${n[0]}:min`],
        [`The minor ii–V–i: iiø7 – V7♭9 – i6`, `${n[1]}:m7b5 ${n[4]}:7b9 ${n[0]}:m6`],
        [`i – ♭VI – ♭III – ♭VII: the minor anthem`, `${n[0]}:min ${n[5]}:maj ${n[2]}:maj ${n[6]}:maj ${n[0]}:min`]]
      : [[`I – IV – V – I in ${k}`, `${n[0]}:maj ${n[3]}:maj ${n[4]}:maj ${n[0]}:maj`],
        [`I – vi – IV – V`, `${n[0]}:maj ${n[5]}:min ${n[3]}:maj ${n[4]}:maj ${n[0]}:maj`],
        [`ii – V – I with 7ths`, `${n[1]}:m7 ${n[4]}:7 ${n[0]}:maj7`]];
  }
}

// ---------- learning the keys: how to remember them, and how to play in one without knowing the names ----------
DECKS.splice(DECKS.findIndex((d) => d.id === 'majkeys'), 0, {
  id: 'learnkeys', name: 'Learning the keys', cards: [
    { t: 'You don’t learn 12 lists', s: 'two orders and two rules', b: [
      'Nobody memorises twelve sets of seven notes. Players remember two short orders and two rules, and work the rest out in a second or two:',
      '- the order of sharps, and the order of flats',
      '- how many each key has',
      '- which letters they land on',
      'With those, “what’s in E♭?” becomes a three-step answer instead of a memory test. The next cards give each piece; the Test button turns them into a two-minute daily drill on your phone.',
    ] },
    { t: 'The order of sharps', s: 'F C G D A E B', b: [
      'Sharps are always added in this order: <b>F C G D A E B</b>. Say it like a word, or use “Father Charles Goes Down And Ends Battle”.',
      'Each one is a 5th above the last: F → C → G → D… the circle of 5ths.',
      '- A key with 1 sharp has F♯; 2 sharps, F♯ C♯; 3 sharps, F♯ C♯ G♯; and so on',
      '- The sharps never come in any other combination: a key can’t have C♯ without F♯',
    ] },
    { t: 'The order of flats', s: 'B E A D G C F', b: [
      'Flats are the sharps backwards: <b>B E A D G C F</b>. “BEAD” then G C F: “Battle Ends And Down Goes Charles’ Father”.',
      'Each one is a 4th above the last: B → E → A → D…',
      '- 1 flat: B♭. 2 flats: B♭ E♭. 3 flats: B♭ E♭ A♭',
      '- Learn one order and you have both',
    ] },
    { t: 'How many sharps or flats', s: 'count round the circle', b: [
      'Sharp keys, going up in 5ths from C: <b>C 0, G 1, D 2, A 3, E 4, B 5, F♯ 6, C♯ 7</b>.',
      'Flat keys, going up in 4ths from C: <b>F 1, B♭ 2, E♭ 3, A♭ 4, D♭ 5, G♭ 6, C♭ 7</b>.',
      '- On guitar, the sharp list is the open strings’ keys in order: G, D, A, E, B',
      '- Each step round the circle changes just one note, which is why neighbouring keys sound related',
    ], ex: [['Round the circle in 5ths: C – G – D – A – E', 'C:maj G:maj D:maj A:maj E:maj']] },
    { t: 'The add-to-7 trick', s: 'one list gives you the other', b: [
      'A sharp key and the flat key on the same letter always add up to 7:',
      '- G has 1 sharp, so G♭ has 6 flats. D has 2, so D♭ has 5',
      '- A has 3, so A♭ has 4. E has 4, so E♭ has 3. B has 5, so B♭ has 2',
      '- C has 0, so C♭ has 7. And F♯ (6 sharps) pairs with F (1 flat)',
      'So learn the sharp counts (G 1, D 2, A 3, E 4, B 5) and the flats come free.',
    ] },
    { t: 'Name the key from the signature', s: 'two quick rules', b: [
      '<b>Sharps</b>: the last sharp is the 7th of the key. Go up a half step and you have the key. Last sharp G♯ → A major.',
      '<b>Flats</b>: the second-to-last flat is the key. Flats B♭ E♭ A♭ → E♭ major. (One flat is F major: learn that one.)',
      '<b>Minor</b>: the relative minor is a minor 3rd below the major key: 3 frets down. Two sharps = D major or B minor.',
      'The music decides which: a tune in B minor will lean on B and use A♯ (V7 is F♯7).',
    ] },
    { t: 'Spell any key in three steps', s: 'letters, then sharps or flats', b: [
      '1. Write the seven letters from the key name: A B C D E F G.',
      '2. Count the sharps or flats: A has 3.',
      '3. Apply them in order: F♯ C♯ G♯. So A major is <b>A B C♯ D E F♯ G♯</b>.',
      'Every letter is used once, so it’s never “A♭ and G♯” in the same key. B♭ major: B♭ C D E♭ F G A (2 flats: B♭ E♭).',
      '- Daily drill: pick one key, spell it out loud, then play its scale saying the names',
    ], ex: [['A major, then B♭ major', 'A:maj D:maj E:7 A:maj Bb:maj Eb:maj F:7 Bb:maj']] },
    { t: 'Play in any key without the names', s: 'the shape does it', b: [
      'On guitar you can play in a key before you can spell it, because every major scale is the same shape moved.',
      '- Find the root on the 6th string. G is fret 3, A fret 5, C fret 8',
      '- Play the major scale pattern from there (the Scales page shows it on the neck). The shape doesn’t change; only the starting fret does',
      'Learn the shape with its degree numbers (1 2 3 4 5 6 7) rather than letters. Numbers work in every key; letters work in one.',
      'Then learn the letters one key at a time, starting with the keys you actually play in.',
    ] },
    { t: 'The chord box', s: 'all six chords on two strings', b: [
      'Put the I chord’s root on the 6th string, fret n. Then, without naming a note:',
      '- <b>ii</b> is the 6th string, fret n+2 (minor); <b>iii</b> is fret n+4 (minor)',
      '- <b>IV</b> is the 5th string, fret n (major); <b>V</b> is fret n+2 (major); <b>vi</b> is fret n+4 (minor)',
      'In G (n = 3): G, Am at 5, Bm at 7, C at the 5th string 3rd fret, D at 5, Em at 7. The same box works in every key; slide it to the new root.',
      '- The relative minor is the 6th string, 3 frets below the root (Em under G, F♯m under A)',
    ], ex: [['In G: I – vi – ii – V – I, all from the box', 'G:maj E:min A:min D:maj G:maj'], ['The same box moved to A', 'A:maj F#:min B:min E:maj A:maj']] },
    { t: 'Learn the keys you play first', s: 'a two-minute daily routine', b: [
      '<b>Week 1</b>: the guitar keys, E A D G C, and their relative minors.',
      '<b>Week 2</b>: F, B♭ and E♭, the horn keys of jazz standards.',
      '<b>Then</b> the rest, one a day.',
      'Each day, on your phone: tap Test on the Major keys deck. For each key, say the signature, spell the notes, then reveal and check. Then play its I – IV – V – I with the chord box over a drone.',
      'Spaced and spoken works better than staring at a chart: two minutes daily beats twenty once a week.',
    ] },
  ],
});

// ---------- fluency drills: the pattern on the neck, and more sequences like 1-3-2-4-3-5 ----------
{
  const fl = DECKS.find((d) => d.id === 'fluency');
  const seqCard = (t, s, seq, body, bpm, sub, goal) => ({ t, s, drill: { bpm, sub, goal, from: `${sub === 3 ? 'triplets' : sub === 4 ? '16ths' : '8ths'} at ${bpm}`, drone: 'G' }, neck: { kind: 'scale', id: 'ionian', key: 'G', fam: 'nps3', near: 3, seq }, b: body });
  const extra = [
    seqCard('Groups of 3', '1-2-3, 2-3-4, 3-4-5', 'g3', [
      'G major, three notes a string from G at the 3rd fret: play three notes up from each note in turn, then the same coming down (G A B, A B C, B C D…).',
      '- In 8th notes the groups of three cross the beat: the accent moves. Then play them in triplets, where they line up',
      '- Alternate picking throughout; the pattern turns the pick direction over every group',
    ], 70, 3, 'triplets at 140'),
    seqCard('Groups of 4', '1-2-3-4, 2-3-4-5', 'g4', [
      'Four up from each note in turn: G A B C, A B C D, B C D E… then four down from the top.',
      '- In 16ths each group fills a beat, so every beat starts on a new scale note: say it as you play',
      '- The most common sequence in rock and fusion runs',
    ], 60, 4, '16ths at 120'),
    seqCard('Broken 3rds', '1-3, 4-2, 3-5, 6-4', 'broken3', [
      'Like 3rds, but every other pair turns round: up a 3rd, then down a 3rd from the next note (G B, C A, B D, E C…).',
      '- It forces the hand to change direction every two notes, so picking has to be exact',
      '- A violinist’s and cellist’s staple, and it sounds more melodic than straight 3rds',
    ], 70, 2, '8ths at 180'),
    seqCard('4ths', '1-4, 2-5, 3-6', 'fourths', [
      'Each note and the note a 4th above it: G C, A D, B E, C F♯, D G… then back down.',
      '- Many of these pairs fall on neighbouring strings at the same fret: roll one finger across instead of lifting it',
      '- The sound of modern, quartal lines',
    ], 70, 2, '8ths at 160'),
    seqCard('6ths', '1-6, 2-7, 3-8', 'sixths', [
      'Each note and the note a 6th above: G E, A F♯, B G, C A… A wide, singing interval.',
      '- Play the pairs on strings two apart (6th and 4th, 5th and 3rd), skipping the string between',
      '- 6ths in pairs are a soul and country lick: Steve Cropper’s sound',
    ], 60, 2, '8ths at 140'),
    seqCard('The sawtooth', '1-3-4-2, 3-5-6-4', 'saw', [
      'Up a 3rd, up a step, back down a 3rd, then start from the next 3rd: G B C A, B D E C… A zig-zag that climbs.',
      '- It mixes 3rds and steps, so it sounds like a melody rather than an exercise',
      '- Then reverse it coming down',
    ], 60, 4, '16ths at 110'),
    seqCard('1-3-2', 'up a 3rd, back a step', 'up3down', [
      'A three-note cell: G B A, A C B, B D C… up the scale and back.',
      '- In triplets it sits on the beat; in 8ths it crosses the bar, which is the point',
      '- A bebop favourite for getting into a target from above',
    ], 70, 3, 'triplets at 150'),
    seqCard('Triads through the key', '1-3-5, 2-4-6, 3-5-7', 'triads', [
      'The diatonic triads, one after another: G B D, A C E, B D F♯, C E G… Each is a chord of G major.',
      '- Name each triad as you play it: G, Am, Bm, C, D, Em, F♯°',
      '- Then 7ths (1-3-5-7, 2-4-6-8), which are the arpeggios you’ll use over the chords',
    ], 60, 3, 'triplets at 140'),
  ];
  // keep the existing order, put the new sequences after “Scale in 3rds”
  const at = fl.cards.findIndex((c) => c.t === 'Scale in 3rds');
  fl.cards.splice(at + 1, 0, ...extra);
  const NECK = {
    'Chromatic warm-up': { kind: 'chromatic', from: 1 },
    'Major scale in position': { kind: 'scale', id: 'ionian', key: 'G', fam: 'caged', near: 2, fromRoot: true },
    'Three notes per string, diagonal': { kind: 'scale', id: 'ionian', key: 'G', fam: 'nps3', near: 3 },
    'The pentatonic ladder': { kind: 'ladder', id: 'min-pent', key: 'A', from: 4 },
    'Pentatonic in fours': { kind: 'scale', id: 'min-pent', key: 'A', fam: 'box', near: 5, seq: 'g4' },
    'Scale in 3rds': { kind: 'scale', id: 'ionian', key: 'C', fam: 'caged', near: 2, seq: 'thirds', fromRoot: true },
    'Single-string scale': { kind: 'scale', id: 'dorian', key: 'A', fam: 'one', pos: 3 },
    'maj7 arpeggio, three octaves': { kind: 'arp', ivs: ['1', '3', '5', '7'], key: 'G' },
    'm7 arpeggio, three octaves': { kind: 'arp', ivs: ['1', 'b3', '5', 'b7'], key: 'F' },
    'Dominant 7 arpeggio, three octaves': { kind: 'arp', ivs: ['1', '3', '5', 'b7'], key: 'G' },
    'ø7 arpeggio: the ♭5': { kind: 'arp', ivs: ['1', 'b3', 'b5', 'b7'], key: 'A', count: 9 },
    '°7 arpeggio': { kind: 'arp', ivs: ['1', 'b3', 'b5', 'bb7'], key: 'G' },
    'Augmented arpeggio': { kind: 'arp', ivs: ['1', '3', '#5'], key: 'C', count: 7 },
    'Arpeggio from any chord tone': { kind: 'arpstarts', id: 'ionian', key: 'C', near: 2, ct: ['1', '3', '5', '7'] },
    'Diatonic 7ths, alternating': { kind: 'scale', id: 'ionian', key: 'C', fam: 'pair', near: 2, seq: 'sevalt', back: false, fromRoot: true },
    'Triads up one string set': { kind: 'triads', key: 'C', set: [3, 2, 1] },
    'Digital patterns through the key': { kind: 'scale', id: 'ionian', key: 'C', fam: 'caged', near: 2, seq: 'digital', fromRoot: true },
    'Enclosures': { kind: 'enclose', id: 'ionian', key: 'C', near: 2, ct: ['1', '3', '5', '7'] },
    'Bebop scale down': { kind: 'scale', id: 'bebop-dom', key: 'G', fam: 'pair', near: 2, from: 'top', ct: ['1', '3', '5', 'b7'] },
    'One position, 12 keys': { kind: 'keys', lo: 4, hi: 8, keys: ['C', 'F', 'Bb', 'Eb', 'Ab', 'Db', 'F#', 'B', 'E', 'A', 'D', 'G'] },
  };
  for (const c of fl.cards) if (NECK[c.t]) c.neck = NECK[c.t];
  const missing = fl.cards.filter((c) => c.drill && !c.neck).map((c) => c.t);
  if (missing.length) console.warn('drill without a neck', missing);
}

// ---------- more examples: every card gets at least three, each checked to play on the neck ----------
const MOREEX = [
['symbols', 'How a symbol is built', { ex: [
    ['Cm7♭5 – F7♯9 – B♭m7: a minor ii–V–i, read one symbol at a time', 'C:m7b5 F:7#9 Bb:m7'],
    ['The worked example in a line: Bø7/F – E7 – Am, the bass falling F to E', 'B:m7b5/b5 E:7 A:min'],
    ['Dm7 – G7♯9 – Cmaj7: one alteration, everything else as written', 'D:m7 G:7#9 C:maj7'],
  ] }],
  ['symbols', 'The triad', { ex: [
    ['C – C+ – F: the augmented 5th rises G → G♯ → A', 'C:maj C:aug F:maj'],
    ['C – C♯° – Dm – G – C: the diminished triad passing between two chords', 'C:maj C#:dim D:min G:maj C:maj'],
    ['In A minor: Am – Dm – E – Am, both kinds of triad in one key', 'A:min D:min E:maj A:min'],
  ] }],
  ['symbols', 'The bare 7 is always ♭7', { ex: [
    ['Cmaj7 rests, C7 pulls: Cmaj7 – C7 – Fmaj7', 'C:maj7 C:7 F:maj7'],
    ['In G: Am7 – D7 – Gmaj7, all three kinds of 7th in one ii–V–I', 'A:m7 D:7 G:maj7'],
    ['A blues: every chord a bare 7, C7 – F7 – C7 – G7 – C7', 'C:7 F:7 C:7 G:7 C:7'],
  ] }],
  ['symbols', 'Every way to write it', { ex: [
    ['CΔ – A–7 – D–7 – G7 in one book, Cmaj7 – Am7 – Dm7 – G7 in another', 'C:maj7 A:m7 D:m7 G:7'],
    ['Dø7 (Dm7♭5, D–7♭5) – G7 – Cm6 (C–6): one minor ii–V–i, however it’s spelt', 'D:m7b5 G:7 C:m6'],
    ['C – C+7 (C7♯5, Caug7) – Fmaj7: the raised 5th rising to A', 'C:maj C:7#5 F:maj7'],
  ] }],
  ['symbols', 'Extensions bring the 7th', { ex: [
    ['Plain 7ths, then the same ii–V–I extended: same jobs, richer sound', 'D:m7 G:7 C:maj7 D:m9 G:13 C:maj9'],
    ['A blues in 9ths: A9 – D9 – A9 – E9 – A9', 'A:9 D:9 A:9 E:9 A:9'],
  ] }],
  ['symbols', 'add, 6 and 6/9', { ex: [
    ['Acoustic pop: G – Cadd9 – Em7 – D', 'G:maj C:add9 E:m7 D:maj'],
    ['A swing ending: C6 – A7 – Dm7 – G7 – C6/9', 'C:6 A:7 D:m7 G:7 C:6/9'],
    ['Gypsy jazz in A minor: Am6 – Dm6 – E7 – Am6', 'A:m6 D:m6 E:7 A:m6'],
  ] }],
  ['symbols', 'sus', { ex: [
    ['The folk-rock lift: D – Dsus4 – D – Dsus2 – D', 'D:maj D:sus4 D:maj D:sus2 D:maj'],
    ['In A: Esus4 – E before home, the 4th (A) falling to G♯', 'A:maj D:maj E:sus4 E:maj A:maj'],
    ['V7sus4 → V7 → I: G7sus4 – G7 – C, the 4th (C) falling to B before home', 'D:m7 G:7sus4 G:7 C:maj7'],
  ] }],
  ['symbols', 'Alterations', { ex: [
    ['In F: Gm7 – C7♭9 – Fmaj7, D♭ falling to C', 'G:m7 C:7b9 F:maj7'],
    ['In F minor: Gø7 – C7♭13 – Fm7, A♭ staying as Fm’s 3rd', 'G:m7b5 C:7b13 F:m7'],
    ['In G: Am7 – D7alt – Gmaj7, the altered V going home', 'A:m7 D:7alt G:maj7'],
  ] }],
  ['symbols', 'Omissions', { ex: [
    ['Power chords: C5 – A♭5 – B♭5 – C5, no 3rds at all', 'C:5 Ab:5 Bb:5 C:5'],
    ['Blues grips with no 5th: C13 – F13 – C7♯9', '=C3 Bb3 E4 A4 | F2 Eb3 A3 D4 | C3 E3 Bb3 D#4', 'C13 · F13 · C7♯9'],
    ['No roots at all: 3rds, 7ths and colours, for when the bass has it', '=F3 C4 E4 A4 | F3 B3 E4 A4 | E3 B3 D4 G4', 'Dm9 · G13 · Cmaj9'],
  ] }],
  ['symbols', 'Roman numerals', { ex: [
    ['I – vi – IV – V in G: G – Em – C – D', 'G:maj E:min C:maj D:maj'],
    ['In C: I – V/V – V – I, then I – ♭VII – IV – I', 'C:maj D:7 G:7 C:maj Bb:maj F:maj C:maj'],
    ['I – I/3 – IV – V: C – C/E – F – G, the bass climbing', 'C:maj C:maj/3 F:maj G:maj'],
  ] }],
  ['symbols', 'Spell any chord', { ex: [
    ['The worked F♯m7 (F♯ A C♯ E) as vi in A: A – F♯m7 – Bm7 – E7', 'A:maj F#:m7 B:m7 E:7 A:maj'],
    ['E7♯9 (E G♯ B D F𝄪), the “Hendrix chord”, in a rock riff: E7♯9 – G – A', 'E:7#9 G:maj A:maj E:7#9'],
    ['A♭13 (A♭ C E♭ G♭ B♭ F) as a tritone sub in G: Am7 – A♭13 – Gmaj7', 'A:m7 Ab:13 G:maj7'],
  ] }],
  ['diatonic', 'The major key in 7ths', { ex: [
    ['In G, down the key a step at a time', 'G:maj7 F#:m7b5 E:m7 D:7 C:maj7 B:m7 A:m7 G:maj7'],
    ['In F: round the key in 5ths, every chord diatonic', 'F:maj7 Bb:maj7 E:m7b5 A:m7 D:m7 G:m7 C:7 F:maj7'],
    ['In D: I – vi – ii – V in 7ths', 'D:maj7 B:m7 E:m7 A:7 D:maj7'],
  ] }],
  ['diatonic', 'Three families', { ex: [
    ['In G: I – IV – V – I, then vi for I and ii for IV', 'G:maj C:maj D:maj G:maj E:min A:min D:maj G:maj'],
    ['In C: I – IV – vii° – I, B° doing V’s job', 'C:maj F:maj B:dim C:maj'],
    ['Backwards, for rock: V – IV – I in A', 'A:maj E:maj D:maj A:maj'],
  ] }],
  ['diatonic', 'ii', { ex: [
    ['In pop, a plain triad: C – Dm – G – C', 'C:maj D:min G:maj C:maj'],
    ['In F: ii – ♭II7 – I, Gm7 – G♭7 – Fmaj7', 'G:m7 Gb:7#11 F:maj7'],
    ['A ii–V–I in C, then one a whole step down in B♭', 'D:m7 G:7 C:maj7 C:m7 F:7 Bb:maj7'],
  ] }],
  ['diatonic', 'V', { ex: [
    ['A question ending on V, then the answer on I', 'C:maj F:maj C:maj G:maj C:maj F:maj G:7 C:maj'],
    ['In A minor, V is still major: Am – Dm – E7 – Am', 'A:min D:min E:7 A:min'],
    ['V7alt, the tense one: Dm7 – G7alt – Cmaj7', 'D:m7 G:7alt C:maj7'],
  ] }],
  ['diatonic', 'vi', { ex: [
    ['In C: the deceptive cadence, G7 – Am, then the real one', 'C:maj F:maj G:7 A:min F:maj G:7 C:maj'],
    ['The 1950s progression: C – Am – F – G', 'C:maj A:min F:maj G:maj'],
    ['The pop loop in D: D – A – Bm – G', 'D:maj A:maj B:min G:maj'],
  ] }],
  ['diatonic', 'Harmonic minor’s 7ths', { ex: [
    ['In C minor: the augmented ♭III, Cm – E♭maj7♯5 – Fm7 – G7 – Cm', 'C:min Eb:maj7#5 F:m7 G:7 C:min'],
    ['In A minor: Fmaj7 – E7 – Am(maj7), F falling to E and G♯ rising to A', 'F:maj7 E:7 A:mMaj7'],
    ['In E minor: F♯ø7 – B7 – Em, then D♯°7 – Em', 'F#:m7b5 B:7 E:min D#:dim7 E:min'],
  ] }],
  ['diatonic', 'Melodic minor’s 7ths', { ex: [
    ['In D minor: the two tonic colours, Dm(maj7) and Dm6, around A7', 'D:mMaj7 A:7 D:m6 A:7 D:mMaj7'],
    ['F♯ø7 – B7alt – Em7: the altered dominant is C melodic minor from its 7th note', 'F#:m7b5 B:7alt E:m7'],
  ] }],
  ['diatonic', 'Minor keys mix all three', { ex: [
    ['In A minor: natural-minor colours, then the harmonic-minor cadence', 'A:min F:maj G:maj E:7 A:min'],
    ['In G minor: the “Autumn Leaves” shape, relative major then the minor ii–V–i', 'C:m7 F:7 Bb:maj7 Eb:maj7 A:m7b5 D:7 G:m6'],
    ['In D minor: the bright IV7 of Dorian, Dm7 – G7 – Dm7 – G7', 'D:m7 G:7 D:m7 G:7'],
  ] }],
  ['types', 'Major', { ex: [
    ['I – IV – V – I in G, all open chords', 'G:maj C:maj D:maj G:maj'],
    ['In E minor: Em – C – D – Em, major chords on ♭VI and ♭VII', 'E:min C:maj D:maj E:min'],
    ['A three-chord twelve-bar in A', 'A:maj A:maj A:maj A:maj D:maj D:maj A:maj A:maj E:maj D:maj A:maj E:maj'],
  ] }],
  ['types', 'Minor', { ex: [
    ['In G: ii and vi as softer colours, G – Em – Am – D', 'G:maj E:min A:min D:maj'],
    ['The minor home: i – iv – v – i in A minor', 'A:min D:min E:min A:min'],
  ] }],
  ['types', 'Power chord', { ex: [
    ['E5 – G5 – A5 – E5: the ♭III borrowed', 'E:5 G:5 A:5 E:5'],
    ['Down by steps from A: A5 – G5 – F5 – G5 – A5', 'A:5 G:5 F:5 G:5 A:5'],
    ['I – ♭VII – IV in D: D5 – C5 – G5 – D5', 'D:5 C:5 G:5 D:5'],
  ] }],
  ['types', '6', { ex: [
    ['The swing tonic: C6 – Am7 – Dm7 – G7 – C6, C6 and Am7 nearly the same chord', 'C:6 A:m7 D:m7 G:7 C:6'],
    ['Early rock’n’roll: A – A6 – A7 – A6, the 5th climbing to 6 and ♭7', 'A:maj A:6 A:7 A:6'],
    ['In G: G6 – E7 – Am7 – D7 – G6', 'G:6 E:7 A:m7 D:7 G:6'],
  ] }],
  ['types', '6/9', { ex: [
    ['In G: I6/9 and IV6/9, then V9 home', 'G:6/9 C:6/9 G:6/9 D:9 G:6/9'],
    ['The minor version as a Dorian tonic: Dm6/9 – G13', 'D:m6/9 G:13 D:m6/9 G:13'],
    ['The same cadence twice, the second time ending on 6/9', 'F:maj G:maj C:maj F:maj G:maj C:6/9'],
  ] }],
  ['types', 'add9', { ex: [
    ['The acoustic-pop staple: G – Cadd9 – Em7 – Dsus4', 'G:maj C:add9 E:m7 D:sus4'],
    ['In A minor: Amadd9 – Fadd9 – C – G', 'A:madd9 F:add9 C:maj G:maj'],
  ] }],
  ['types', 'm7', { ex: [
    ['vi as a tonic substitute in G: Gmaj7 – Em7 – Am7 – D7', 'G:maj7 E:m7 A:m7 D:7 G:maj7'],
    ['The minor home: i – iv – v in A minor, all m7', 'A:m7 D:m7 E:m7 A:m7'],
    ['In C: Em7 – Am7, then III7 swapped in, E7 – Am7', 'C:maj7 E:m7 A:m7 C:maj7 E:7 A:m7'],
  ] }],
  ['types', 'm(maj7)', { ex: [
    ['The line cliché in open A minor: Am – Am(maj7) – Am7 – Am6', 'A:min A:mMaj7 A:m7 A:m6'],
    ['In E minor: F♯ø7 – B7 – Em(maj9), the spy-film ending', 'F#:m7b5 B:7 E:mMaj9'],
  ] }],
  ['types', '°7', { ex: [
    ['In G: G♯°7 passing up from G to Am7', 'G:maj7 G#:dim7 A:m7 D:7 G:maj7'],
    ['vii°7 in A minor: Am – Dm – G♯°7 – Am', 'A:min D:min G#:dim7 A:min'],
    ['Common tone: C – C°7 – C, the C held while the others move', 'C:maj7 C:dim7 C:maj7'],
  ] }],
  ['types', 'maj7♯5', { ex: [
    ['In A minor: Am(maj7) – Cmaj7♯5 – Dm7 – E7 – Am, ♭III from harmonic minor', 'A:mMaj7 C:maj7#5 D:m7 E:7 A:min'],
    ['In F: Gm7 – C7 – Fmaj7♯5 – Fmaj7, the ♯5 falling back to the 5th', 'G:m7 C:7 F:maj7#5 F:maj7'],
  ] }],
  ['types', '13♭9', { ex: [
    ['Plain 13, then 13♭9: the same V, sweet then dark', 'D:m7 G:13 C:maj7 D:m7 G:13b9 C:maj7'],
    ['In F: Gm7 – C13♭9 – Fmaj7', 'G:m7 C:13b9 F:maj7'],
    ['In C: I – I13♭9 – IV, a secondary dominant into a major chord', 'C:maj7 C:13b9 F:maj7'],
  ] }],
  ['melmin', 'Where they come from', { ex: [
    ['In C minor: Dø7 – G7♭13 – Cm(maj7), three melodic-minor chords', 'D:m7b5 G:7b13 C:mMaj7'],
    ['The tritone sub as 7♯11: Dm7 – D♭7♯11 – Cmaj7', 'D:m7 Db:7#11 C:maj7'],
    ['In F: Gm7 – C7alt – Fmaj7', 'G:m7 C:7alt F:maj7'],
  ] }],
  ['melmin', 'Find the scale fast', { ex: [
    ['Bø7 – E7alt – Am(maj7): D, F, then A melodic minor', 'B:m7b5 E:7alt A:mMaj7'],
    ['Dø7 – G7♭13 – Cm6: F, C, then C melodic minor', 'D:m7b5 G:7b13 C:m6'],
    ['In G: Am7 – A♭7♯11 – Gmaj7, E♭ melodic minor on the 7♯11', 'A:m7 Ab:7#11 G:maj7'],
  ] }],
  ['nopull', 'Pull or colour?', { ex: [
    ['In G: C9 → G is colour, then D7 → G pulls', 'G:maj7 C:9 G:maj7 D:7 G:maj7'],
    ['In G: E7 pulls to Am7, A7 to D7, D7 home', 'G:maj7 E:7b9 A:m7 A:7 D:7 G:maj7'],
    ['In G: E♭9 – D7 – G, the ♭VI9 floats and D7 pulls', 'Eb:9 D:7 G:maj7'],
  ] }],
  ['nopull', 'How they move', { ex: [
    ['In G: 7♯11s a half step above Am7 and G', 'G:maj7 Bb:7#11 A:m7 Ab:7#11 G:maj7'],
    ['In G: ♭VI9 – ♭VII9 – I, up a whole step twice', 'Eb:9 F:9 G:maj7'],
    ['A twelve-bar in G: IV9 – I7 is the plagal move', 'G:7 C:9 G:7 G:7 C:9 C:9 G:7 G:7 D:9 C:9 G:7 D:9'],
  ] }],
  ['dim', 'A °7 is a rootless 7♭9', { ex: [
    ['E7♭9 → Am7, then G♯°7 → Am7: the same pull without the E', 'E:7b9 A:m7 G#:dim7 A:m7'],
    ['B7♭9 → Em7, then D♯°7 → Em7: the same pull without the B', 'B:7b9 E:m7 D#:dim7 E:m7'],
  ] }],
  ['dim', 'Finding it', { ex: [
    ['A7 → D7, then C♯°7 → D7: on A7’s 3rd', 'A:7 D:7 C#:dim7 D:7 G:maj7'],
    ['E7 → Am7, then F°7 → Am7: a half step above E, the same chord as G♯°7', 'E:7 A:m7 F:dim7 A:m7'],
  ] }],
  ['dim', 'Only three exist', { ex: [
    ['The same chord under four names: C♯°7 – E°7 – G°7 – B♭°7, then Dm', 'C#:dim7 E:dim7 G:dim7 Bb:dim7 D:min'],
    ['The top-four-string grip at frets 4, 7 and 10: one chord, three voicings', '=F#3 C4 D#4 A4 | A3 D#4 F#4 C5 | C4 F#4 A4 D#5', 'F♯°7 · A°7 · C°7'],
  ] }],
  ['dim', 'They collapse to three', { ex: [
    ['F♯°7 → Gmaj7, then D♯°7 → Em7: one family, D7 and B7', 'F#:dim7 G:maj7 D#:dim7 E:m7'],
    ['G♯°7 → Am7, then B°7 → Cmaj7: one family, E7 and G7', 'G#:dim7 A:m7 B:dim7 C:maj7'],
    ['C♯°7 → D7, then A♯°7 → Bm7: one family, A7 and F♯7', 'C#:dim7 D:7 A#:dim7 B:m7'],
  ] }],
  ['dim', 'Descending passing', { ex: [
    ['vi – ♭vi°7 – V – I: Em7 slides down to D7', 'E:m7 Eb:dim7 D:7 G:maj7'],
    ['The rising version, for contrast: G – G♯°7 – Am7 – D7 – G', 'G:maj7 G#:dim7 A:m7 D:7 G:maj7'],
  ] }],
  ['dim', 'Rule of thumb', { ex: [
    ['Dominant: G – G♯°7 – Am7, an E7♭9 in disguise', 'G:maj7 G#:dim7 A:m7 D:7'],
    ['Common tone: G – G°7 – G, the root shared', 'G:maj7 G:dim7 G:maj7'],
    ['Passing: Am7 – A♭°7 – Gmaj7, sliding down by step', 'C:maj7 A:m7 Ab:dim7 G:maj7'],
  ] }],
  ['dim', 'The scales', { ex: [
    ['Half-whole from E over E7♭9, then Am', '=E2 D3 G#3 B3 F4 | E3 | F3 | G3 | G#3 | A#3 | B3 | C#4 | D4 | E4 | A2 E3 A3 C4 E4', 'E7♭9 → Am'],
    ['Half-whole from D over D7♭9, then G', '=D3 F#3 C4 D#4 | D3 | D#3 | F3 | F#3 | G#3 | A3 | B3 | C4 | D4 | G2 D3 G3 B3', 'D7♭9 → G'],
  ] }],
  ['dim', '°7 vs ø7', { ex: [
    ['F♯ø7 → G, then F♯°7 → G: E becomes E♭', 'F#:m7b5 G:maj7 F#:dim7 G:maj7'],
    ['In E minor: F♯ø7 – B7 – Em7 (iiø), then D♯°7 – Em7 (vii°7)', 'F#:m7b5 B:7 E:m7 D#:dim7 E:m7'],
  ] }],
  ['mediants', 'What they are', { ex: [
    ['All four from Am: C♯m, Fm, F♯m and Cm', 'A:min C#:min A:min F:min A:min F#:min A:min C:min A:min'],
    ['C – E – A♭ – C: major 3rds round the octave', 'C:maj E:maj Ab:maj C:maj'],
    ['In G: G – B – G – E♭ – G', 'G:maj B:maj G:maj Eb:maj G:maj'],
  ] }],
  ['mediants', 'How they work', { ex: [
    ['To leave for good: C – E, then E’s own ii–V', 'C:maj E:maj F#:m7 B:7 E:maj7'],
    ['To come home: A becomes A7, then Dm – G7 – C', 'C:maj A:maj A:7 D:min G:7 C:maj'],
    ['A surprise before going home: C – F – C – A♭ – C', 'C:maj F:maj C:maj Ab:maj C:maj'],
  ] }],
  ['voicelead', 'Guide tones and shells', { ex: [
    ['In F: Gm7 – C7 – Fmaj7, F falling to E and B♭ to A', '=G2 F3 Bb3 | C3 E3 Bb3 | F2 E3 A3', 'Gm7 · C7 · Fmaj7'],
    ['A blues in G with shells: B falls to B♭ and F to E', '=G2 F3 B3 | C3 E3 Bb3 | G2 F3 B3 | D3 F#3 C4 | G2 F3 B3', 'G7 · C7 · G7 · D7 · G7'],
    ['In A minor: Bø7 – E7 – Am7 as shells', '=B2 A3 D4 | E2 D3 G#3 | A2 G3 C4', 'Bø7 · E7 · Am7'],
  ] }],
  ['voicelead', 'Common tones', { ex: [
    ['The same chords on the top three strings: one note moves at each change', '=G3 C4 E4 | A3 C4 E4 | A3 C4 F4 | A3 D4 F4', 'C · Am · F · Dm'],
    ['In G: G – Em – C – Am, two notes held at every change', 'G:maj E:min C:maj A:min'],
    ['vi – IV – I – V: Am and F share A and C, F and C share C, C and G share G', 'A:min F:maj C:maj G:maj'],
  ] }],
  ['voicelead', 'The top line', { ex: [
    ['E held on top through ii – V – I', '=D3 F3 C4 E4 | G2 F3 B3 E4 | C3 G3 B3 E4', 'Dm9 · G13 · Cmaj7'],
    ['The practice line in open chords: top E – E – F – F – E', '=C3 E3 G3 C4 E4 | A2 E3 A3 C4 E4 | D3 A3 D4 F4 | G2 B2 D3 G3 B3 F4 | C3 E3 G3 C4 E4', 'C · Am · Dm · G7 · C'],
  ] }],
  ['voicelead', 'Upper-structure triads', { ex: [
    ['G7’s B and F low, then A, E, E♭ and D♭ triads on top', '=B2 F3 A3 C#4 E4 | B2 F3 G#3 B3 E4 | B2 F3 Bb3 Eb4 G4 | B2 F3 Ab3 Db4 F4', 'G13♯11 · G13♭9 · G7♯9♭13 · G7♭9♭5'],
    ['E♭ over G7, then Cm: E♭ and G hold, the rest step up', '=B2 F3 Bb3 Eb4 G4 | C3 G3 C4 Eb4 G4', 'G7♯9♭13 → Cm'],
  ] }],
  ['voicelead', 'Quartal voicings', { ex: [
    ['One shape, three chords: D G C F over D, then G, then F in the bass', '=D3 G3 C4 F4 | G2 D3 G3 C4 F4 | F2 D3 G3 C4 F4', 'Dm11 · G7sus4 · F6/9'],
    ['Stacked 4ths planed up D Dorian on the low four strings', '=E2 A2 D3 G3 | F2 B2 E3 A3 | G2 C3 F3 B3 | A2 D3 G3 C4 | G2 C3 F3 B3 | F2 B2 E3 A3 | E2 A2 D3 G3', 'Quartal stacks on E, F, G, A'],
  ] }],
  ['map', 'Harmonic minor’s 5th mode', { ex: [
    ['The flamenco descent: Am – G – F – E, E Phrygian dominant on the last chord', 'A:min G:maj F:maj E:maj'],
    ['In D minor: Eø7 – A7♭9 – Dm7, A Phrygian dominant on the V', 'E:m7b5 A:7b9 D:m7'],
    ['E7♭9 → Am, then G♯°7 → Am: the same scale, with and without the E', 'E:7b9 A:min G#:dim7 A:min'],
  ] }],
  ['map', 'Avoid notes', { ex: [
    ['Over Cmaj7, F only passes: G – F – E, landing on the 3rd', '=C3 G3 B3 E4 | G4 | F4 | E4', 'Cmaj7'],
    ['The 4th over a dominant: sus it first, G7sus4 – G7 – C', 'D:m7 G:7sus4 G:7 C:maj7'],
    ['The 11 is fine on a minor chord: Dm11 – G7 – Cmaj7', 'D:m11 G:7 C:maj7'],
  ] }],
  ['modes', 'How a mode becomes the key', { ex: [
    ['Dorian: Dm7 – G, the major IV carries the ♮6 (B)', 'D:m7 G:maj D:m7 G:maj'],
    ['Mixolydian: G – F – C – G, the ♭VII carries the ♭7 (F)', 'G:maj F:maj C:maj G:maj'],
    ['Lydian: C – D/C over a pedal, the major II carries the ♯4 (F♯)', 'C:maj D:maj/b7 C:maj D:maj/b7'],
  ] }],
  ['modes', 'Comping modally', { ex: [
    ['Breaking the mode, then keeping it: Dm7 – A7 – Dm7, then Dm7 – Em7 – Dm7', 'D:m7 A:7 D:m7 D:m7 E:m7 D:m7'],
    ['G Mixolydian over a G pedal: G – F/G – C/G – G', 'G:maj F:maj/2 C:maj/5 G:maj'],
  ] }],
  ['reharm', 'Start from the melody', { ex: [
    ['G on top of six chords: as 5th, ♭3, ♭7, 9, 3 and root', '=C3 E3 G3 C4 G4 | E2 B2 E3 G3 D4 G4 | A2 E3 A3 C4 G4 | F2 C3 E3 A3 G4 | Eb3 Bb3 D4 G4 | G2 B2 D3 G3 B3 G4', 'C · Em7 · Am7 · Fmaj9 · E♭maj7 · G'],
    ['A half step above a chord tone, made a ♭9: F over E7 resolves to E on Am', '=E2 D3 G#3 B3 F4 | A2 E3 A3 C4 E4', 'E7♭9 → Am'],
  ] }],
  ['reharm', 'Side-slipping', { ex: [
    ['A♭7 → G7: the slip into V, which is also the tritone sub of D7', 'D:m7 Ab:7 G:7 C:maj7'],
    ['From below: C♯m7 → Dm7, a lift rather than a sag', 'C#:m7 D:m7 G:7 C:maj7'],
    ['In G: B♭m7 – E♭7 slips down into Am7 – D7', 'Bb:m7 Eb:7 A:m7 D:7 G:maj7'],
  ] }],
['progs', 'The diatonic cycle', { ex: [
    ['In E minor: Em7 – Am7 – D7 – Gmaj7 – Cmaj7 – F♯ø7 – B7 – Em7', 'E:m7 A:m7 D:7 G:maj7 C:maj7 F#:m7b5 B:7 E:m7'],
    ['The same cycle started from I, in C', 'C:maj7 F:maj7 B:m7b5 E:7 A:m7 D:m7 G:7 C:maj7'],
    ['Triads only, in D minor: Dm – Gm – C – F – B♭ – E° – A7 – Dm', 'D:min G:min C:maj F:maj Bb:maj E:dim A:7 D:min'],
  ] }],
  ['progs', 'Major ii–V–I, then minor', { ex: [
    ['The usual jazz key: B♭ major, then G minor', 'C:m7 F:7 Bb:maj7 Eb:maj7 A:m7b5 D:7b9 G:m7'],
    ['In C, landing on A minor', 'D:m7 G:7 C:maj7 F:maj7 B:m7b5 E:7b9 A:m7'],
    ['Reversed: the minor cadence first, then the major one', 'B:m7b5 E:7b9 A:m7 D:m7 G:7 C:maj7'],
  ] }],
  ['progs', 'The Andalusian cadence', { ex: [
    ['In E minor: Em – D – C – B7', 'E:min D:maj C:maj B:7'],
    ['In D minor, back home: Dm – C – B♭ – A7 – Dm', 'D:min C:maj Bb:maj A:7 D:min'],
    ['Flamenco: resting on E, with F – E to finish', 'A:min G:maj F:maj E:maj F:maj E:maj'],
  ] }],
  ['progs', 'i – ♭VI – ♭III – ♭VII', { ex: [
    ['In E minor: Em – C – G – D', 'E:min C:maj G:maj D:maj'],
    ['Power chords in D minor: D5 – B♭5 – F5 – C5', 'D:5 Bb:5 F:5 C:5'],
    ['With E7 for G: the classical pull back to Am', 'A:min F:maj C:maj E:7 A:min'],
  ] }],
  ['blues', 'The 12-bar blues', { ex: [
    ['A blues in A, with the quick change (D7 in bar 2)', 'A:7 D:7 A:7 A:7 D:7 D:7 A:7 A:7 E:7 D:7 A:7 E:7'],
    ['All 12 bars in E, the guitar key', 'E:7 E:7 E:7 E:7 A:7 A:7 E:7 E:7 B:7 A:7 E:7 B:7'],
  ] }],
  ['blues', 'What to play over it', { ex: [
    ['C major pentatonic over C7: the sweeter sound', '=C3 E3 Bb3 | C4 | D4 | E4 | G4 | A4 | C5', 'C7, C major pentatonic'],
    ['Change with the chords: E over C7, E♭ over F7', '=C3 E3 Bb3 | G4 | E4 | F2 Eb3 A3 | C4 | Eb4 | C3 E3 Bb3 | E4', 'C7 → F7 → C7'],
    ['In A: the ♭3 slides into the 3', '=A2 G3 C#4 | C4 | C#4 | E4 | G4 | A4', 'A7, C to C♯'],
  ] }],
  ['blues', 'The jazz blues', { ex: [
    ['All 12 bars in F, the usual key', 'F:7 Bb:7 F:7 C:m7 F:7 Bb:7 B:dim7 F:7 D:7 G:m7 C:7 F:7 D:7 G:m7 C:7'],
    ['Bars 4–7 in C: Gm7 – C7 – F7 – F♯°7 – C/G, the bass climbing', 'C:7 G:m7 C:7 F:7 F#:dim7 C:maj/5'],
    ['Bars 7–10 in C: Em7 – A7 into Dm7, then G7', 'C:7 E:m7 A:7 D:m7 G:7 C:7'],
  ] }],
  ['blues', 'The minor blues', { ex: [
    ['All 12 bars in A minor, the guitar key', 'A:m7 A:m7 A:m7 A:m7 D:m7 D:m7 A:m7 A:m7 F:7 E:7 A:m7 E:7'],
    ['Bars 8–11 in C minor: A♭7 slides down to G7', 'C:m7 Ab:7 G:7 C:m7'],
    ['Before and after: Dø7 – G7, then A♭7 – G7', 'C:m7 D:m7b5 G:7 C:m7 Ab:7 G:7 C:m7'],
  ] }],
  ['forms', 'AABA', { ex: [
    ['First A in C: it ends turning round to bar 1', 'C:maj7 A:m7 D:m7 G:7 E:m7 A:7 D:m7 G:7'],
    ['Second A: same start, a cadence home for the bridge', 'C:maj7 A:m7 D:m7 G:7 D:m7 G:7 C:6 C:6'],
    ['The “I Got Rhythm” bridge in C: E7 – A7 – D7 – G7', 'E:7 E:7 A:7 A:7 D:7 D:7 G:7 G:7'],
  ] }],
  ['forms', 'ABAC', { ex: [
    ['The “All of Me” shape, A (bars 1–8)', 'C:6 C:6 E:7 E:7 A:7 A:7 D:m7 D:m7'],
    ['B (bars 9–16): to vi, then a ii–V', 'E:7 E:7 A:m7 A:m7 D:7 D:7 D:m7 G:7'],
    ['C (bars 25–32): the new ending, IV – iv to home', 'F:6 F:m6 E:m7 A:7 D:m7 G:7 C:6 C:6'],
  ] }],
  ['forms', 'Rhythm changes: the A section', { ex: [
    ['The A section in B♭, the usual key', 'Bb:maj7 G:m7 C:m7 F:7 Bb:maj7 G:m7 C:m7 F:7 Bb:maj7 Bb:7 Eb:maj7 Eb:m7 Bb:maj7 F:7 Bb:maj7'],
    ['Bars 5–8 with ♯iv°7 instead of iv: B♭7 – E♭ – E°7 – B♭/F – F7 – B♭', 'Bb:7 Eb:maj7 E:dim7 Bb:maj/5 F:7 Bb:maj7'],
    ['Bars 1–4 with VI7, then iii for I', 'Bb:maj7 G:7 C:m7 F:7 D:m7 G:7 C:m7 F:7'],
  ] }],
  ['forms', 'The bridge', { ex: [
    ['Through dominants: the rhythm-changes bridge in B♭', 'D:7 D:7 G:7 G:7 C:7 C:7 F:7 F:7'],
    ['Up a half step: a bridge in D for a tune in D♭, back via E♭m7 – A♭7', 'E:m7 A:7 D:maj7 D:maj7 Eb:m7 Ab:7 Db:maj7'],
    ['A key a major 3rd down: a ii–V to A♭, then back to C', 'Bb:m7 Eb:7 Ab:maj7 Ab:maj7 D:m7 G:7 C:maj7'],
  ] }],
  ['forms', 'Verse and chorus', { ex: [
    ['A verse loop on vi, then the chorus lands on I', 'A:min F:maj A:min F:maj C:maj G:maj F:maj G:maj'],
    ['A bridge from IV, ending on V for the last chorus', 'F:maj G:maj E:min A:min F:maj G:sus4 G:maj'],
    ['In G: verse on Em – C, pre-chorus Am – D, chorus from G', 'E:min C:maj A:min D:maj G:maj D:maj E:min C:maj'],
  ] }],
  ['forms', 'Learn the form, not just the chords', { ex: [
    ['Pattern: I – vi – ii – V, here in F', 'F:maj7 D:m7 G:m7 C:7'],
    ['Pattern: a ii–V into IV (Gm7 – C7 – F)', 'C:maj7 G:m7 C:7 F:maj7'],
    ['Pattern: backdoor home (Fm7 – B♭7 – C)', 'C:maj7 F:m7 Bb:7 C:maj7'],
  ] }],
  ['bass', 'Upper-structure slash chords', { ex: [
    ['C/D as the soft V in G: Am7 – C/D – Gmaj7', 'A:m7 C:maj/2 G:maj7'],
    ['D/C as a Lydian IV in G, landing on G/B', 'C:maj7 D:maj/b7 G:maj/3'],
    ['One bass, four colours: C, D, E and B♭ over C', 'C:maj D:maj/b7 E:maj/b6 Bb:maj/2'],
  ] }],
  ['bass', 'Walking bass', { ex: [
    ['Two-feel first: root and 5th, Cmaj7 – Am7 – Dm7 – G7 – C', '=C3 | G2 | A2 | E2 | D3 | A2 | G2 | D3 | C3', 'Cmaj7 – Am7 – Dm7 – G7 – C, half notes'],
    ['A blues in F, bars 1–3: F7 – B♭7 – F7', '=F2 | A2 | C3 | B2 | Bb2 | D3 | F3 | E3 | F3', 'F7 – B♭7 – F7'],
    ['In A minor: Bø7 – E7 – Am, each root approached from above', '=B2 | D3 | F3 | F2 | E2 | G#2 | B2 | Bb2 | A2', 'Bø7 – E7 – Am'],
  ] }],
  ['bass', 'Chromatic approach', { ex: [
    ['All from above, the tritone-sub sound: A7 – D7 – E7 – A', '=A2 | C#3 | E3 | Eb3 | D3 | F#3 | A3 | F3 | E3 | G#3 | B3 | Bb3 | A3', 'A7 – D7 – E7 – A'],
    ['By the 5th instead: A before D, D before G, G before C', '=C3 | E3 | G3 | A2 | D3 | F3 | A3 | D3 | G2 | B2 | D3 | G3 | C3', 'Cmaj7 – Dm7 – G7 – C'],
    ['The same idea in chords: C – C♯°7 – Dm7 – D♯°7 – Em7', 'C:maj7 C#:dim7 D:m7 D#:dim7 E:m7'],
  ] }],
  ['slash', 'Two different things', { ex: [
    ['In G: G/B (still G), then A/G (a new chord: G Lydian)', 'G:maj G:maj/3 G:maj A:maj/b7 G:maj'],
    ['C – G/B – Am – F/G – C: an inversion, then a new chord', 'C:maj G:maj/3 A:min F:maj/2 C:maj'],
    ['Am/C is still Am; Am/F♯ is F♯ø7', 'A:min A:min/b3 A:min A:min/6'],
  ] }],
  ['slash', 'How to read any slash chord', { ex: [
    ['B♭/C: ♭7, 9, 11 over C, so C9sus4, resolving to F', 'Bb:maj/2 F:maj7'],
    ['E/C, then Cmaj7♯5: the same sound named two ways', 'E:maj/b6 C:maj7#5'],
    ['G/F: 9, ♯11, 13 over F, so F Lydian', 'F:maj7 G:maj/b7 F:maj7'],
  ] }],
  ['slash', 'The cadential 6/4', { ex: [
    ['In G: C – G/D – D7 – G', 'C:maj G:maj/5 D:7 G:maj'],
    ['In D, a hymn ending: G – D/A – A7 – D', 'G:maj D:maj/5 A:7 D:maj'],
    ['In A minor: Dm – Am/E – E7 – Am', 'D:min A:min/5 E:7 A:min'],
  ] }],
  ['slash', 'Minor triads over a bass', { ex: [
    ['Dm7/G – Cmaj7: G9sus4, the soft V', 'D:m7/4 C:maj7'],
    ['In G: Bm/G (Gmaj7), then Em/G (G6)', 'G:maj B:min/b6 E:min/b3 G:maj'],
    ['In F: Dm/F (F6), Am/F (Fmaj7), Cm/F (F9 with no 3rd)', 'D:min/b3 A:min/b6 C:min/4'],
  ] }],
  ['slash', 'On the guitar', { ex: [
    ['B♭/C → F: C on the 5th string, B♭ triad on the top three', '=C3 Bb3 D4 F4 | F2 C3 F3 A3 C4 F4', 'B♭/C → F'],
    ['G/F → C/E: the bass steps down F – E', '=F2 G3 B3 G4 | E2 C3 E3 G3 C4 E4', 'G/F → C/E'],
    ['A/G → G: low G with an A triad on strings 4-3-2', '=G2 E3 A3 C#4 | G2 B2 D3 G3 B3 G4', 'A/G → G'],
  ] }],
  ['solo', 'Chord tones on the beat', { ex: [
    ['Eighth notes: chord tones on every beat, scale notes between', '=D3 C4 | C5 | B4 | A4 | G4 | F4 | E4 | D4 | C4 | G2 F3 | B3 | C4 | D4 | E4 | F4 | A4 | G4 | F4 | C3 B3 | E4', 'Dm7 – G7 – Cmaj7, chord tones on the beats'],
    ['Quarter notes over A7 – D7 – A7: the 3rd on each beat 1', '=A2 G3 C#4 | C#4 | E4 | A4 | G4 | D3 C4 F#4 | F#4 | A4 | D5 | C5 | A2 G3 C#4 | C#5', 'A7 – D7 – A7'],
    ['In A minor: chord tones only, stepping into each change', '=B2 A3 D4 | D4 | F4 | A4 | F4 | E2 D3 G#3 | E4 | D4 | B3 | G#3 | A2 G3 C4 | A3', 'Bø7 – E7 – Am7'],
  ] }],
  ['solo', 'Arpeggios from the 3rd', { ex: [
    ['In B♭: E♭maj7 over Cm7, Aø7 over F7, Dm7 over B♭maj7', '=C3 Bb3 | Eb4 | G4 | Bb4 | D5 | F2 Eb3 | C5 | A4 | G4 | Eb4 | Bb2 A3 | D4 | F4 | A4 | C5', 'Cm9 – F9 – B♭maj9 sounds'],
    ['In D minor: C♯ø7 over A7, Fmaj7 over Dm7', '=A2 G3 | C#4 | E4 | G4 | B4 | D3 C4 | A4 | F4 | E4 | C4', 'A9 → Dm9 sounds'],
    ['Further up, from the 5th: Am7 over Dm7, Gmaj7 over Cmaj7', '=D3 C4 | A4 | C5 | E5 | G5 | G2 F3 | F5 | D5 | B4 | A4 | C3 B3 | G4 | B4 | D5 | F#5', 'Dm11 – G9 – Cmaj9♯11 sounds'],
  ] }],
  ['solo', 'Approach notes and enclosures', { ex: [
    ['From a half step below: D♯ – E, F♯ – G, A♯ – B over Cmaj7', '=C3 B3 | C4 | D#4 | E4 | F#4 | G4 | A#4 | B4', 'Cmaj7, chord tones approached from below'],
    ['Through Dm7 – G7 – Cmaj7: enclosing B, then E', '=D3 C4 | F4 | G4 | A4 | F4 | D4 | E4 | C5 | A#4 | G2 F3 | B4 | D5 | F5 | D5 | B4 | A4 | F4 | D#4 | C3 B3 | E4', 'Dm7 – G7 – Cmaj7'],
    ['Double chromatic: B – C – C♯ into the 3rd of A7', '=E2 D3 G#3 | E4 | D4 | B3 | A3 | G#3 | A3 | B3 | C4 | A2 G3 | C#4 | E4 | G4', 'E7 → A7'],
  ] }],
  ['solo', 'The bebop scale', { ex: [
    ['One line through the ii–V: G bebop down from F, into C', '=D3 C4 | F5 | E5 | D5 | C5 | B4 | A4 | G4 | F#4 | G2 F3 | F4 | E4 | D4 | C4 | B3 | A3 | G3 | B3 | C3 B3 | C4', 'Dm7 – G7 – Cmaj7'],
    ['Major bebop over C6: down from C, the G♯ keeping C, A, G, E on the beats', '=C3 E3 A3 | C5 | B4 | A4 | G#4 | G4 | F4 | E4 | D4 | C4', 'C6, C major bebop'],
    ['In F: C bebop dominant down from C, into F', '=C3 Bb3 E4 | C5 | B4 | Bb4 | A4 | G4 | F4 | E4 | D4 | F2 C3 F3 A3 | C4', 'C7 → F'],
  ] }],
  ['solo', 'The ♭9 sound on V7', { ex: [
    ['In A minor, its true home: G♯°7 over E7', '=E2 D3 G#3 | G#4 | B4 | D5 | F5 | E5 | A2 E3 A3 C4', 'E7♭9 → Am'],
    ['The same shape three frets up: D°7 over G7, into C', '=G2 F3 B3 | D4 | F4 | Ab4 | B4 | C3 E3 G3 C4 | C5', 'G7♭9 → C'],
    ['Down from A♭ into C minor: B lands on C', '=G2 F3 B3 | Ab4 | F4 | D4 | B3 | C3 G3 Eb4 | C4', 'G7♭9 → Cm'],
  ] }],
  ['solo', 'Triad pairs', { ex: [
    ['F and G over Dm7: Dorian', '=D3 A3 C4 F4 | F4 | A4 | C5 | G4 | B4 | D5 | C5 | A4 | F4 | D5 | B4 | G4', 'Dm7, F and G triads'],
    ['The same pair over Am7: the ♭VI – ♭VII sound', '=A2 G3 C4 E4 | F4 | A4 | C5 | G4 | B4 | D5 | F5 | C5 | A4 | D5 | B4 | G4 | A4', 'Am7, F and G triads'],
    ['E♭ and F over Cm7, downwards: C Dorian', '=C3 G3 Bb3 Eb4 | Bb4 | G4 | Eb4 | C5 | A4 | F4 | G4 | Eb4 | Bb3 | A4 | F4 | C4', 'Cm7, E♭ and F triads'],
  ] }],
  ['solo', 'Motifs and space', { ex: [
    ['One idea through a ii–V–I: only the last note moves', '=D3 C4 | A4 | G4 | F4 | G2 F3 | A4 | G4 | F4 | C3 B3 | A4 | G4 | E4', 'Dm7 – G7 – Cmaj7, one motif'],
    ['♭3 – 3 – 5 on A7, moved to D7 and back', '=A2 G3 | C4 | C#4 | E4 | G4 | E4 | D3 C4 | F4 | F#4 | A4 | C5 | A4 | A2 G3 | C4 | C#4 | A3', 'A7 – D7 – A7'],
    ['Ask and answer: two phrases up, two phrases down', '=C3 E3 G3 C4 | E4 | G4 | A4 | G4 | A2 E3 A3 C4 | E4 | G4 | A4 | C5 | F2 C3 F3 A3 | C5 | A4 | G4 | F4 | G2 B2 D3 G3 | G4 | F4 | D4 | C3 E3 G3 C4 | E4', 'C – Am – F – G – C'],
  ] }],
  ['solo', 'Sing it first', { ex: [
    ['Sing the root of each chord: C, A, D, G', '=C3 E3 G3 C4 | C4 | A2 E3 A3 C4 | A3 | D3 A3 D4 F4 | D4 | G2 B2 D3 G3 B3 F4 | G3', 'C – Am – Dm – G7'],
    ['Then the 3rds: E, C, F, B', '=C3 E3 G3 C4 | E4 | A2 E3 A3 C4 | C4 | D3 A3 D4 F4 | F4 | G2 B2 D3 G3 B3 F4 | B3', 'C – Am – Dm – G7'],
    ['A guide-tone line to sing over roots and 5ths: C – B – B♭ – A', '=D3 A3 | C4 | G2 D3 | B3 | C3 G3 | Bb3 | F2 C3 | A3', 'Dm7 – G7 – C7 – Fmaj7'],
  ] }],
  ['chordmelody', 'What it is', { ex: [
    ['Melody and bass only: E – D – C over C – G – C', '=C3 E4 | G2 D4 | C3 C4', 'C – G – C'],
    ['Add one inner note under the tune', '=C3 G3 E4 | G2 F3 D4 | C3 E3 C4', 'C – G7 – C'],
    ['Full chords under the same tune', '=C3 E3 G3 C4 E4 | G2 B2 D3 G3 D4 | C3 E3 G3 C4', 'C – G – C'],
  ] }],
  ['chordmelody', 'Learn the melody first', { ex: [
    ['Step 1: the tune alone (“Mary Had a Little Lamb”, in D)', '=F#4 | E4 | D4 | E4 | F#4 | F#4 | F#4 | E4 | E4 | E4 | F#4 | A4 | A4', 'Melody alone'],
    ['Step 2: the changes on their own', 'D:maj D:maj A:7 D:maj'],
    ['Step 3: together, open-string bass under the tune', '=D3 F#4 | E4 | D4 | E4 | D3 F#4 | F#4 | F#4 | A2 E4 | E4 | E4 | D3 F#4 | A4 | A4', 'D – D – A – D'],
  ] }],
  ['chordmelody', 'Put the melody up high', { ex: [
    ['In C: the melody E – E – F – D on top, chords under it', '=C3 E3 G3 C4 E4 | A2 E3 A3 C4 E4 | F2 C3 F3 A3 C4 F4 | G2 B2 D3 G3 D4', 'C – Am – F – G'],
    ['In F: A – G – F on the top string', '=F3 A3 C4 F4 A4 | C3 G3 Bb3 E4 G4 | F2 C3 F3 A3 C4 F4', 'F – C7 – F'],
    ['High up in A, the bass on open A, D and E', '=A2 C#4 E4 A4 | D3 F#4 A4 | E2 D4 G#4 B4', 'A – D – E7'],
  ] }],
  ['chordmelody', 'The melody is always the top note', { ex: [
    ['The common mistake: open G has G on top; for melody B, drop it', '=G2 B2 D3 G3 B3 G4 | G2 B2 D3 G3 B3', 'G (G on top) → G (B on top)'],
    ['Melody G – A – B – C: each chord built down from its note', '=C3 E3 G3 C4 G4 | D3 A3 C4 F4 A4 | G3 D4 F4 B4 | G3 C4 E4 C5', 'C – Dm7 – G7 – C'],
    ['In A minor: C – B – A on top, open chords trimmed to fit', '=A2 E3 A3 C4 | E2 B2 D3 G#3 B3 | A2 E3 A3', 'Am – E7 – Am'],
  ] }],
  ['chordmelody', 'Every chord, every top note', { ex: [
    ['G7, drop 2: G, B, D and F on top', '=F3 B3 D4 G4 | G3 D4 F4 B4 | B3 F4 G4 D5 | D4 G4 B4 F5', 'G7: G, B, D, F on top'],
    ['Dm7, drop 2: F, A, C and D on top', '=D3 A3 C4 F4 | F3 C4 D4 A4 | A3 D4 F4 C5 | C4 F4 A4 D5', 'Dm7: F, A, C, D on top'],
    ['Drop 3, root on the 6th: melody on the B string', '=A2 G3 C4 E4 | G2 F3 B3 D4 | F2 E3 A3 C4', 'Am7 – G7 – Fmaj7'],
  ] }],
  ['chordmelody', 'A melody note outside the chord', { ex: [
    ['D over C: a passing note alone, a colour on top of Cmaj9', '=C3 E3 G3 C4 | D4 | C3 E3 B3 D4', 'C, then Cmaj9'],
    ['A over G7: play G9, then fall to G over C', '=G2 F3 B3 A4 | C3 E3 G3 C4 G4', 'G9 → C'],
    ['E – F – E: F becomes the 7th of G7, not a clash over C', '=C3 E3 G3 C4 E4 | G2 B2 D3 G3 B3 F4 | C3 E3 G3 C4 E4', 'C – G7 – C'],
  ] }],
  ['chordmelody', 'One note, many chords', { ex: [
    ['E on top: the 3rd, 5th, 7th, 9th, then the root', '=C3 E3 G3 C4 E4 | A2 E3 A3 C4 E4 | F3 A3 C4 E4 | D3 F3 C4 E4 | E2 B2 D3 G#3 B3 E4', 'C – Am – Fmaj7 – Dm9 – E7'],
    ['In F: A on top all the way, the chords moving under it', '=F3 A3 C4 F4 A4 | D3 A3 D4 F4 A4 | Bb2 D4 F4 A4 | G2 F3 B3 A4 | C3 Bb3 E4 A4 | F3 A3 C4 F4 A4', 'F – Dm – B♭maj7 – G9 – C13 – F'],
    ['Plain, then bold: C on top over Am, then over A♭maj7', '=A2 E3 A3 C4 | G2 F3 B3 | C3 E3 G3 C4 | Ab2 Eb3 G3 C4 | G2 F3 B3 | C3 E3 G3 C4', 'Am – G7 – C, then A♭maj7 – G7 – C'],
  ] }],
  ['chordmelody', 'Three voices are enough', { ex: [
    ['Dm7 – G7 – Cmaj7: C falls to B under the melody F – F – E', '=D3 C4 F4 | G2 B3 F4 | C3 B3 E4', 'Dm7 – G7 – Cmaj7'],
    ['In F: guide tones F – E – E under the melody B♭ – B♭ – A', '=G2 F3 Bb3 | C3 E3 Bb3 | F2 E3 A3', 'Gm7 – C7 – Fmaj7'],
    ['In A minor: guide tones A – G♯ – G under the melody D – D – C', '=B2 A3 D4 | E2 G#3 D4 | A2 G3 C4', 'Bø7 – E7 – Am7'],
  ] }],
  ['chordmelody', 'Not every note gets a chord', { ex: [
    ['Four quarters over C: a chord on 1, two notes on 3, single notes between', '=C3 E3 G3 C4 E4 | F4 | C4 G4 | E4', 'C'],
    ['“Mary Had a Little Lamb” in C: a chord on each bar’s first note only', '=C3 E3 G3 C4 E4 | D4 | C4 | D4 | C3 G3 E4 | E4 | E4 | G2 B2 D3 G3 D4 | D4 | D4 | C3 G3 E4 | G4 | G4', 'C – C – G – C'],
    ['A pickup played alone, then chords only where the melody lands', '=E4 | F4 | C3 E3 G3 C4 G4 | A4 | G4 | E4 | F2 C3 F3 A3 C4 F4 | E4 | D4 | G2 F3 B3 D4 | C3 E3 G3 C4', 'C – F – G7 – C'],
  ] }],
  ['chordmelody', 'Bass on the downbeat', { ex: [
    ['In G: just the bass and the tune, E – F♯ – G', '=A2 E4 | D3 F#4 | G2 G4', 'Am7 – D7 – G'],
    ['Then one guide tone inside: G, C, B', '=A2 G3 E4 | D3 C4 F#4 | G2 B3 G4', 'Am7 – D7 – G'],
    ['C/E on beat 1: the bass climbs C – E – F under the tune', '=C3 E3 G3 C4 E4 | E2 C3 E3 G3 C4 E4 | F2 C3 F3 A3 C4 F4', 'C – C/E – F'],
  ] }],
  ['chordmelody', 'Let the melody sing', { ex: [
    ['Roll it: the bass first, the melody note last, then strike it', '=C3 | G3 | B3 | E4 | C3 G3 B3 E4', 'Cmaj7, rolled then struck'],
    ['Thumb low, fingers high: open-string bass under a high tune in A', '=A2 E4 A4 | B4 | C#5 | D3 F#4 D5 | C#5 | B4 | E2 D4 G#4 B4 | A2 C#4 E4 A4', 'A – D – E7 – A'],
    ['E held on the open top string while the bass walks down C – B – A – G', '=C3 E3 G3 C4 E4 | B2 E3 G3 C4 E4 | A2 E3 A3 C4 E4 | G2 E3 A3 C4 E4', 'C – C/B – Am – Am/G'],
  ] }],
  ['chordmelody', 'Fill the long notes', { ex: [
    ['E held on top while the inner voice falls A – G♯ – G – F♯', '=A2 A3 C4 E4 | A2 G#3 C4 E4 | A2 G3 C4 E4 | A2 F#3 C4 E4', 'Am – Am(maj7) – Am7 – Am6'],
    ['G held on top while the bass walks down into F', '=C3 E3 G3 C4 G4 | B2 | A2 | G2 | F2 C3 F3 A3 C4 F4', 'C (bass B – A – G) → F'],
    ['E held over a passing °7: C – C♯°7 – Dm9', '=C3 G3 C4 E4 | C#3 G3 Bb3 E4 | D3 F3 C4 E4', 'C – C♯°7 – Dm9'],
  ] }],
  ['chordmelody', 'Plan the fingering', { ex: [
    ['A phrase in one position, frets 3–6: no shifts', '=C3 G3 C4 E4 | G2 F3 B3 D4 | A2 G3 C4 E4 | D3 C4 F4', 'C – G7 – Am7 – Dm7'],
    ['Shift during an open string: open A, then A at the 5th fret', '=A2 E3 A3 C#4 E4 | E4 | A2 C#4 E4 A4', 'A (open) → A (5th fret)'],
    ['Fingers that stay: C and E hold from Am7 to D9', '=A2 G3 C4 E4 | D3 F#3 C4 E4 | G2 F#3 B3 D4', 'Am7 – D9 – Gmaj7'],
  ] }],
  ['chordmelody', 'Arrange in passes', { ex: [
    ['Pass 1: the melody alone, on the top strings', '=E4 | F#4 | G4 | C5 | D4 | E4 | F#4 | B4', 'Melody over Am7 – D7 – Gmaj7'],
    ['Pass 2: a bass note on each change', '=E4 | F#4 | G4 | A2 C5 | D3 D4 | E4 | F#4 | G3 B4', 'Am7 – D7 – Gmaj7, bass only'],
    ['Pass 3: one guide tone under each: G, C, F♯', '=E4 | F#4 | G4 | A2 G3 C5 | D3 C4 D4 | E4 | F#4 | G3 F#4 B4', 'Am7 – D7 – Gmaj7, with guide tones'],
  ] }],
  ['chordmelody', 'The second time through', { ex: [
    ['First chorus, plain: the melody F – F – E on top', '=D3 C4 F4 | G2 B3 F4 | C3 B3 E4', 'Dm7 – G7 – Cmaj7'],
    ['Second chorus: D♭7 for G7, same melody', '=D3 C4 F4 | Db3 B3 F4 | C3 B3 E4', 'Dm7 – D♭7 – Cmaj7'],
    ['A tag ending: iii – VI7 – ii – V twice, then home', 'E:m7 A:7 D:m7 G:7 E:m7 A:7 D:m7 G:7 C:6/9'],
  ] }],
  ['chordmelody', 'Listen and steal', { ex: [
    ['“Autumn Leaves” in G minor: the first eight bars', 'C:m7 F:7 Bb:maj7 Eb:maj7 A:m7b5 D:7 G:m7 G:m7'],
    ['“Fly Me to the Moon” changes as three-note shells: few notes, whole band', '=A2 G3 C4 | D3 C4 F4 | G2 F3 B3 | C3 B3 E4 | F2 E3 A3 | B2 A3 D4 | E2 D3 G#3 | A2 G3 C4', 'Am7 – Dm7 – G7 – Cmaj7 – Fmaj7 – Bø7 – E7 – Am7'],
    ['A moving inner voice, Ted Greene style: C – B – B♭ – A under E – F', '=C3 G3 C4 E4 | C3 G3 B3 E4 | C3 G3 Bb3 E4 | F2 C3 F3 A3 C4 F4', 'C – Cmaj7 – C7 – F'],
  ] }],
  ['fluency', 'How to build speed', { ex: [
    ['A one-beat burst over Cmaj7, then stop', '=C3 B3 E4 | C4 | D4 | E4 | G4', 'Cmaj7, one-beat burst'],
    ['A two-beat burst: up A minor pentatonic and back', '=A2 E3 A3 C4 E4 | A3 | C4 | D4 | E4 | G4 | E4 | D4 | C4 | A3', 'Am, two-beat burst'],
    ['Chord changes build the same way: C – Am – F – G, 5 bpm at a time', 'C:maj A:min F:maj G:maj'],
  ] }],
  ['menu', 'The Menu System', { ex: [
    ['One shape, three addresses: Fmaj7 as the ♭3 of Dm7, the ♭7 of G7, the ♭2 of Em7', '=D3 C4 | F4 | A4 | C5 | E5 | G2 F3 | F4 | A4 | C5 | E5 | E2 D3 | F4 | A4 | C5 | E5', 'Dm7 – G7 – Em7, Fmaj7 over each'],
    ['A ii–V–I room by room: Fmaj7 (♭3), D♭7 (♭5), Em7 (3)', '=D3 C4 | F4 | A4 | C5 | E5 | G2 F3 | Db5 | B4 | Ab4 | F4 | C3 B3 | E4 | G4 | B4 | D5', 'Dm7 – G7alt – Cmaj7'],
    ['The minor ii–V–i room by room: Fm6, then B°7, into Cm6', '=D3 Ab3 C4 | F4 | Ab4 | C5 | D5 | G2 F3 B3 | B4 | Ab4 | F4 | D4 | C3 A3 Eb4 G4', 'Dø7 – G7♭9 – Cm6'],
  ] }],
  ['menu', 'Tier-one order', { ex: [
    ['1. maj7 on the ♭3: Fmaj7 over Dm7', '=D3 A3 C4 | F4 | A4 | C5 | E5', 'Dm7 → Dm9 sound'],
    ['2. maj7 on the ♭7: B♭maj7 over C7', '=C3 Bb3 | Bb3 | D4 | F4 | A4', 'C7 → C13sus sound'],
    ['3. m7 on the 3: Am7 over Fmaj7', '=F2 E3 A3 | A3 | C4 | E4 | G4', 'Fmaj7 → Fmaj9 sound'],
  ] }],
  ['menu', 'Ionian', { ex: [
    ['In G: Bm7 over Gmaj7', '=G2 F#3 B3 | B3 | D4 | F#4 | A4', 'Gmaj7 → Gmaj9 sound'],
    ['The catch: F over Cmaj7 rubs; F♯ (Lydian) doesn’t', '=C3 G3 B3 E4 | F4 | C3 G3 B3 E4 | F#4', 'Cmaj7 with F, then with F♯'],
    ['Down from D: Em7 over Cmaj7, descending', '=C3 B3 E4 | D5 | B4 | G4 | E4', 'Cmaj7 → Cmaj9 sound'],
  ] }],
  ['menu', 'Mixolydian', { ex: [
    ['Fmaj7 over G7sus: G13sus', '=G2 F3 C4 | F4 | A4 | C5 | E5', 'G7sus → G13sus sound'],
    ['In G: a C triad over D (♭7 9 11), then home', '=D3 C4 G4 | C5 | G4 | E4 | C4 | G2 F#3 B3 D4', 'D9sus → Gmaj7'],
  ] }],
  ['menu', 'Aeolian', { ex: [
    ['maj7 on the ♭6: Fmaj7 over Am7', '=A2 G3 C4 | F4 | A4 | C5 | E5', 'Am7 with its ♭6'],
    ['In E minor: Gmaj7 over Em7, Em9', '=E2 D3 G3 | G4 | B4 | D5 | F#5', 'Em7 → Em9 sound'],
    ['The catch: Gmaj7 over Am7 brings F♯, Dorian’s 6', '=A2 G3 C4 | G4 | B4 | D5 | F#5', 'Am7 with F♯: the Dorian colour'],
  ] }],
  ['menu', 'Phrygian', { ex: [
    ['In F: B♭maj7 over Am7, the iii chord', '=A2 G3 C4 | Bb3 | D4 | F4 | A4', 'Am7 as iii of F'],
    ['Down the Fmaj7 shape over Em7, F falling to E on Am7', '=E2 D3 G3 | E5 | C5 | A4 | F4 | A2 G3 C4 E4', 'Em7 → Am7'],
    ['The catch: Gmaj7 over Em7 brings F♯, a natural 9', '=E2 D3 G3 | G4 | B4 | D5 | F#5', 'Em7 with F♯: not Phrygian'],
  ] }],
  ['menu', 'Phrygian dominant', { ex: [
    ['In A minor: A harmonic minor down over E7, landing on C', '=E2 D3 G#3 | F5 | E5 | D5 | C5 | B4 | A4 | G#4 | B4 | A2 E3 A3 C4 | C5', 'E7♭9 → Am'],
    ['In D minor: C♯°7 down over A7, C♯ rising to D', '=A2 G3 C#4 | Bb4 | G4 | E4 | C#4 | D3 A3 D4 F4', 'A7♭9 → Dm'],
    ['As chords: Dø7 – G7♭9 – Cm6', 'D:m7b5 G:7b9 C:m6'],
  ] }],
  ['menu', 'Locrian ♮2', { ex: [
    ['In A minor: Dm6 over Bø7, the same four notes', '=B2 A3 D4 | F4 | A4 | B4 | D5', 'Bø7 = Dm6'],
    ['The whole minor ii–V–i: Fm6, then D♭7 over G7, into Cm', '=D3 Ab3 C4 | F4 | Ab4 | C5 | D5 | G2 F3 B3 | Db5 | B4 | Ab4 | F4 | C3 G3 Eb4 | Eb4', 'Dø7 – G7alt – Cm'],
    ['The parent scale from D: F melodic minor, E the ♮2', '=D3 Ab3 C4 | D4 | E4 | F4 | G4 | Ab4 | Bb4 | C5 | D5', 'Dø7, Locrian ♮2'],
  ] }],
  ['menu', 'Altered', { ex: [
    ['A♭ melodic minor up from G, F falling to E on C', '=G2 F3 B3 | G4 | Ab4 | Bb4 | B4 | Db5 | Eb5 | F5 | C3 G3 B3 E4 | E5', 'G7alt → Cmaj7'],
    ['An E♭ triad over G7: E♭ resolves up to E on C', '=G2 F3 B3 | Bb4 | G4 | Eb4 | C3 G3 B3 E4', 'G7♯9♭13 → Cmaj7'],
    ['An A♭m triad over G7, A♭ falling to G on C', '=G2 F3 B3 | Eb5 | B4 | Ab4 | C3 E3 G3 C4 G4', 'G7alt → C'],
  ] }],
  ['menu', 'Lydian dominant', { ex: [
    ['In context: Dm7 – D♭7♯11 – Cmaj7, the E♭ triad on D♭7', '=D3 C4 F4 | Db3 B3 F4 | Eb4 | G4 | Bb4 | C3 B3 E4 | B4', 'Dm7 – D♭7♯11 – Cmaj7'],
    ['D♭ Lydian dominant up from D♭: the same notes as G altered', '=Db3 B3 F4 | Db4 | Eb4 | F4 | G4 | Ab4 | Bb4 | B4 | C3 B3 E4 | C5', 'D♭7♯11 → Cmaj7'],
    ['On ♭VII7: a C triad over B♭7, then home to C', '=Bb2 Ab3 D4 | C4 | E4 | G4 | C3 G3 C4 E4', 'B♭7♯11 → C'],
  ] }],
  ['menu', 'Melodic minor tonic', { ex: [
    ['The alias: an Aø7 arpeggio over Cm6', '=C3 A3 Eb4 | A3 | C4 | Eb4 | G4', 'Cm6 = Aø7'],
    ['At the end of a minor ii–V–i, G – B – D on top', '=D3 Ab3 C4 | G2 F3 B3 | C3 A3 Eb4 | G4 | B4 | D5', 'Dø7 – G7 – Cm6'],
    ['C melodic minor up: B resolves straight to C', '=C3 A3 Eb4 | C4 | D4 | Eb4 | F4 | G4 | A4 | B4 | C5', 'Cm6, C melodic minor'],
  ] }],
  ['menu', 'Half-whole', { ex: [
    ['A♭°7 over G7, F falling to E on C', '=G2 F3 B3 | Ab4 | B4 | D5 | F5 | C3 G3 C4 E4 | E5', 'G7♭9 → C'],
    ['The G half-whole scale up, landing on C', '=G2 F3 B3 | G4 | Ab4 | Bb4 | B4 | C#5 | D5 | E5 | F5 | C3 G3 C4 E4 | E5', 'G13♭9 → C'],
    ['As chords: Dm7 – G13♭9 – Cmaj7', 'D:m7 G:13b9 C:maj7'],
  ] }],
  ['menu', 'Whole tone', { ex: [
    ['The whole-tone scale up from G, then C', '=G2 F3 B3 | G4 | A4 | B4 | C#5 | D#5 | F5 | C3 G3 C4 E4 | E5', 'G7♯5 → C'],
    ['As chords: Dm7 – G7♯5 – Cmaj7', 'D:m7 G:7#5 C:maj7'],
    ['In F: C+ then D+ over C7♯5, A♯ falling to A', '=C3 Bb3 E4 | C4 | E4 | G#4 | D4 | F#4 | A#4 | F2 C3 F3 A3 | A4', 'C7♯5 → F'],
  ] }]
];
for (const [deck, title, add] of MOREEX) {
  const c = DECKS.find((d) => d.id === deck)?.cards.find((x) => x.t === title);
  if (!c) { console.warn('no card', deck, title); continue; }
  const own = c.play ? [['The example', c.play]] : [];
  c.ex = [...(c.ex || []), ...own, ...add.ex.filter(([, p]) => !(c.ex || []).some(([, q]) => q === p))]; delete c.play;
}

// the key-learning cards play the keys they talk about
for (const [deck, title, ex] of [
  ['learnkeys', 'You don’t learn 12 lists', [['I – IV – V – I in C, then the same in E♭: one pattern, any key', 'C:maj F:maj G:maj C:maj Eb:maj Ab:maj Bb:maj Eb:maj'], ['And in E, the guitar key', 'E:maj A:maj B:maj E:maj']]],
  ['learnkeys', 'The order of sharps', [['One sharp (F♯): G – C – D – G', 'G:maj C:maj D:maj G:maj'], ['Two (F♯ C♯): D – G – A – D', 'D:maj G:maj A:maj D:maj'], ['Three (F♯ C♯ G♯): A – D – E – A', 'A:maj D:maj E:maj A:maj']]],
  ['learnkeys', 'The order of flats', [['One flat (B♭): F – B♭ – C – F', 'F:maj Bb:maj C:maj F:maj'], ['Two (B♭ E♭): B♭ – E♭ – F – B♭', 'Bb:maj Eb:maj F:maj Bb:maj'], ['Three (B♭ E♭ A♭): E♭ – A♭ – B♭ – E♭', 'Eb:maj Ab:maj Bb:maj Eb:maj']]],
  ['learnkeys', 'How many sharps or flats', [['Round the 4ths: C – F – B♭ – E♭ – A♭', 'C:maj F:maj Bb:maj Eb:maj Ab:maj']]],
  ['learnkeys', 'The add-to-7 trick', [['G (1 sharp), then G♭ (6 flats)', 'G:maj C:maj D:7 G:maj Gb:maj Cb:maj Db:7 Gb:maj'], ['A (3 sharps), then A♭ (4 flats)', 'A:maj D:maj E:7 A:maj Ab:maj Db:maj Eb:7 Ab:maj']]],
  ['learnkeys', 'Name the key from the signature', [['Last sharp G♯, so A major', 'A:maj D:maj E:7 A:maj'], ['Flats B♭ E♭ A♭, so E♭ major', 'Eb:maj Ab:maj Bb:7 Eb:maj'], ['Two sharps, but F♯7 says B minor', 'B:min E:min F#:7 B:min']]],
  ['learnkeys', 'Spell any key in three steps', [['E♭ major: E♭ F G A♭ B♭ C D', 'Eb:maj7 C:m7 F:m7 Bb:7 Eb:maj7'], ['E major: E F♯ G♯ A B C♯ D♯', 'E:maj C#:min A:maj B:7 E:maj']]],
  ['learnkeys', 'Play in any key without the names', [['The same I – IV – V – I moved from G to A to C', 'G:maj C:maj D:maj G:maj A:maj D:maj E:maj A:maj C:maj F:maj G:maj C:maj'], ['I – vi – IV – V in F, from the box', 'F:maj D:min Bb:maj C:maj F:maj']]],
  ['learnkeys', 'Learn the keys you play first', [['The guitar keys’ I chords: E – A – D – G – C', 'E:maj A:maj D:maj G:maj C:maj'], ['The horn keys: F – B♭ – E♭', 'F:maj Bb:maj Eb:maj'], ['Their relative minors: C♯m – F♯m – Bm – Em – Am', 'C#:min F#:min B:min E:min A:min']]],
  ['majkeys', 'Name the key', [['Three sharps: A major', 'A:maj D:maj E:7 A:maj'], ['Two flats: B♭ major', 'Bb:maj Eb:maj F:7 Bb:maj']]],
  ['minkeys', 'Minor keys', [['A minor, natural then harmonic: G, then G♯ in E7', 'A:min D:min E:min A:min A:min D:min E:7 A:min'], ['A minor and C major: the same notes, a different home', 'A:min F:maj G:maj A:min C:maj F:maj G:maj C:maj']]],
]) {
  const c = DECKS.find((d) => d.id === deck)?.cards.find((x) => x.t === title);
  if (!c) { console.warn('no card', deck, title); continue; }
  c.ex = [...(c.ex || []), ...ex];
}

// ---------- rhythm and strumming: a pattern, its count, the hand, and the groove playing so you can join in ----------
// groove: see groove.js. Guitar strokes on even steps are downs and on odd steps ups: the hand never stops moving.
{
  const R = (t, s, groove, b) => ({ t, s, groove, b });
  const ROCK = { k: 'x...x...', s: '..x...x.', h: 'xxxxxxxx' };
  DECKS.splice(DECKS.findIndex((d) => d.id === 'fluency'), 0, {
    id: 'rhythm', name: 'Rhythm and strumming', cards: [
      { t: 'How to read these cards', s: 'and how to practise rhythm', b: [
        'Each card shows its pattern as a grid. <b>↓</b> is a downstroke, <b>↑</b> an upstroke, a dim arrow is a light stroke, <b>✕</b> a muted chuck (strum with the fretting hand relaxed on the strings), <b>B</b> and <b>5</b> are single bass notes. The count runs underneath: 1 & 2 &, or 1 e & a for 16ths.',
        '- <b>Keep the strumming hand moving</b> like a pendulum: down on the beats, up on the “&”s, whether it hits the strings or not. That’s what keeps you in time',
        '- <b>Count out loud</b> the first few times, then say only the beat numbers',
        '- <b>Play it with the groove</b> (▶ Play), then with the click only, then on your own and record yourself',
        '- <b>Slow and relaxed</b> beats fast and stiff. Speed up 5 bpm only when it feels easy',
        'Turn the Guitar part off to play the pattern yourself over the drums and click.',
      ] },
      R('Quarter-note downstrokes', 'level 1 · 4/4', { meter: '4/4', sub: 2, bpm: 80, chart: 'G:maj | C:maj | D:maj | G:maj', gtr: 'D.D.D.D.' }, [
        '<b>Count</b>: 1 & 2 & 3 & 4 &. Strum down on the numbers only.',
        '<b>Hand</b>: on the “&”s the hand comes back up but misses the strings. Start that habit now.',
        '<b>Best practice</b>: change chord on the last “&” of the bar, so the new chord lands on 1. Late changes are the most common rhythm fault.',
        '<b>Harder</b>: accent beats 2 and 4 slightly. That’s where the snare sits in nearly all popular music.',
      ]),
      R('Eighth notes: down and up', 'level 1 · 4/4', { meter: '4/4', sub: 2, bpm: 80, chart: 'G:maj | C:maj | D:maj | G:maj', gtr: 'DUDUDUDU' }, [
        '<b>Count</b>: 1 & 2 & 3 & 4 &, down on the numbers, up on the “&”s.',
        '<b>Hand</b>: upstrokes are lighter and catch only the top three or four strings. Let them.',
        '<b>Best practice</b>: loose wrist, the movement from the forearm rotating, not the elbow swinging. Hold the pick lightly.',
        '<b>Harder</b>: the same at 140. Then accent only the downbeats, then only the “&”s (the reggae and ska feel).',
      ]),
      R('The pop strum', 'level 2 · D – DU – UDU', { meter: '4/4', sub: 2, bpm: 90, chart: 'C:maj | A:min | F:maj | G:maj', gtr: 'D.DU.UDU' }, [
        '<b>Count</b>: 1 – 2 & – & 4 &. Down, down-up, up, down-up: beat 3 is a missed downstroke.',
        '<b>Hand</b>: the hand keeps moving through beat 3 without hitting. If it stops, the “&” of 3 will be late.',
        '<b>Best practice</b>: say “down, down-up, up-down-up” for a minute, then let it go and just feel it. This one pattern covers a huge amount of pop, folk and rock.',
        '<b>Harder</b>: change chord every two beats with the pattern unbroken.',
      ]),
      R('The backbeat accent', 'level 2 · rock', { meter: '4/4', sub: 2, bpm: 100, chart: 'G:maj | D:maj | E:min | C:maj', gtr: 'duDuduDu', drums: ROCK }, [
        '<b>Count</b>: eighths throughout, light everywhere except beats 2 and 4, which are strong (with the snare).',
        '<b>Hand</b>: the accent is a slightly bigger, faster stroke, not a harder grip.',
        '<b>Best practice</b>: lock to the snare. If your accents and the snare are one sound, you’re in the pocket.',
        '<b>Harder</b>: turn the drums off and keep the accents where the snare was.',
      ]),
      R('Muted chucks', 'level 2 · the snare on the guitar', { meter: '4/4', sub: 2, bpm: 95, chart: 'A:min | G:maj | F:maj | G:maj', gtr: 'DUxUDUxU' }, [
        '<b>Count</b>: 1 & 2 & 3 & 4 &, with a muted chuck on 2 and 4.',
        '<b>Hand</b>: for the chuck, relax the fretting hand so it touches the strings without pressing, and strum normally. It should sound like a snare.',
        '<b>Best practice</b>: release the chord a fraction before the chuck and press it again straight after. The chord–chuck–chord change is the skill.',
        '<b>Harder</b>: chuck on every “&” instead; then only on the “&” of 4, leading into the next bar.',
      ]),
      R('Funk sixteenths', 'level 4 · 16ths, scratched', { meter: '4/4', sub: 4, bpm: 90, chart: 'E:9 | % | % | %', gtr: 'D.xU.Ux.D.xU.Ux.', drums: { k: 'x.....x...x.....', s: '....x.......x...', h: 'x.x.x.x.x.x.x.x.' } }, [
        '<b>Count</b>: 1 e & a 2 e & a… The hand moves in 16ths: down on 1, e is up, & is down, a is up.',
        '<b>Hand</b>: E9 (x7677x) held lightly. Let go a little for the ✕ chucks; press for the chords. The strumming hand never stops.',
        '<b>Best practice</b>: small, fast strokes near the bridge pickup sound. Funk is about short notes and silence, so stop each chord sharply.',
        '<b>Harder</b>: move the accented chords to different 16ths each bar while the hand keeps going. Listen to Nile Rodgers and Jimmy Nolen.',
      ]),
      R('Reggae skank', 'level 3 · the one drop', { meter: '4/4', sub: 2, bpm: 75, chart: 'A:min | D:min | A:min | E:min', gtr: '..K...K.', drums: { k: '....x...', r: '....x...', h: 'x.x.x.x.' }, bass: 'r...r.5.' }, [
        '<b>Count</b>: 1 & 2 & 3 & 4 &. The guitar plays only on 2 and 4, a short choked chord: the skank.',
        '<b>The one drop</b>: the kick and rim land together on 3, and nothing on 1. It feels upside down at first.',
        '<b>Best practice</b>: choke the chord immediately by releasing the fretting hand. Short is everything. Use small three-string chords high on the neck.',
        '<b>Harder</b>: add a muted 16th-note “bubble” on the “&”s, or double the skank (2 and the “&” of 2).',
      ]),
      R('Ska upstrokes', 'level 3 · every off-beat', { meter: '4/4', sub: 2, bpm: 150, chart: 'C:maj | A:min | F:maj | G:maj', gtr: '.K.K.K.K', drums: ROCK }, [
        '<b>Count</b>: 1 & 2 & 3 & 4 &, the chord on every “&” only.',
        '<b>Hand</b>: many players use a short downstroke on the “&”s with the hand coming back up on the beats. Either way, choke each chord.',
        '<b>Best practice</b>: feel the beats in your foot and the chops as the answer to them. If the foot stops, the off-beats drift.',
        '<b>Harder</b>: at 180 and above, the speed of punk-ska.',
      ]),
      R('Country boom-chick', 'level 2 · bass and strum', { meter: '4/4', sub: 2, bpm: 100, chart: 'G:maj | C:maj | D:maj | G:maj', gtr: 'b.D.5.D.' }, [
        '<b>Count</b>: the root on 1, a strum on 2, the 5th on 3, a strum on 4. Boom – chick – boom – chick.',
        '<b>Hand</b>: pick the bass note alone, then brush the top strings. Keep the chord shape held throughout.',
        '<b>Best practice</b>: the bass notes are the bass player’s part, so make them strong and even; the strums lighter.',
        '<b>Harder</b>: walk the bass into the next chord on beat 4 (G A B into C). That’s the bluegrass and Johnny Cash sound.',
      ]),
      R('Alternating bass with strums', 'level 3 · Carter style', { meter: '4/4', sub: 2, bpm: 90, chart: 'C:maj | F:maj | G:maj | C:maj', gtr: 'b.DU5.DU' }, [
        '<b>Count</b>: bass on 1, down-up on 2 &, bass on 3, down-up on 4 &.',
        '<b>Hand</b>: the upstroke after each strum keeps the pendulum going, so the next bass note arrives on time.',
        '<b>Best practice</b>: alternate the bass between the root and the 5th: on C, the A string, 3rd fret (C), then the low E string, 3rd fret (G).',
        '<b>Harder</b>: play the melody on the bass strings between the strums, as Maybelle Carter did.',
      ]),
      R('The waltz', 'level 2 · 3/4', { meter: '3/4', sub: 2, bpm: 100, chart: 'G:maj | D:maj | D:maj | G:maj', gtr: 'b.D.D.' }, [
        '<b>Count</b>: 1 & 2 & 3 &: bass on 1, strums on 2 and 3. Oom – pah – pah.',
        '<b>Best practice</b>: three beats, not four with one missing. Count every bar from 1 until it feels natural.',
        '<b>Harder</b>: add up-strums on the “&”s of 2 and 3; then play it as a jazz waltz, swung, with the accent on 1 only.',
      ]),
      R('6/8: the ballad', 'level 3 · two beats of three', { meter: '6/8', bpm: 60, chart: 'C:maj | A:min | F:maj | G:maj', gtr: 'D.UD.U' }, [
        '<b>Count</b>: 1 2 3 4 5 6, felt in two: <b>1</b> 2 3 <b>4</b> 5 6. The grid shows it as 1 & a 2 & a.',
        '<b>Hand</b>: down on 1 and 4, up on 3 and 6. A rocking feel.',
        '<b>Best practice</b>: feel two big beats, not six small ones. 6/8 is 2 beats of three, so it swings in a way 3/4 doesn’t.',
        '<b>Harder</b>: arpeggiate it instead, one string per eighth note, the way slow soul and doo-wop ballads do.',
      ]),
      R('12/8 shuffle boogie', 'level 3 · the blues in A', { meter: '12/8', bpm: 80, chart: 'A:7 | D:7 | A:7 | A:7 | D:7 | D:7 | A:7 | A:7 | E:7 | D:7 | A:7 | E:7', gtr: 'P.PQ.QP.PQ.Q', drums: { k: 'x.....x.....', s: '...x.....x..', h: 'x.xx.xx.xx.x' } }, [
        '<b>Count</b>: four beats, each split in three: 1 & a 2 & a… The shuffle plays on 1 and a of each beat: long – short.',
        '<b>Hand</b>: the boogie, two strings: root and 5th (5 on the grid), then root and 6th (6), stretching the third finger. On A: open A with the D string at fret 2, then fret 4.',
        '<b>Best practice</b>: palm-mute lightly. Keep the long–short swing exact; it’s the whole style.',
        '<b>Harder</b>: add the ♭7 (D string, fret 5) on the 3rd beat: 5 – 6 – ♭7 – 6.',
      ]),
      R('Swing: four to the bar', 'level 4 · jazz rhythm guitar', { meter: '4/4', sub: 2, bpm: 120, swing: 0.33, chart: 'C:6 A:7 | D:m7 G:7 | C:6 A:7 | D:m7 G:7', gtr: 'd.d.d.d.', drums: { h: 'x.xxx.xx' }, bass: 'r.3.5.a.' }, [
        '<b>Count</b>: four even downstrokes a bar. Swung 8ths are long–short, like triplets with the middle one missing.',
        '<b>Hand</b>: three-note chords (shells) on the middle strings, each stroke short. Lift the fretting hand off after each one.',
        '<b>Best practice</b>: beats 2 and 4 a little stronger. This is Freddie Green’s job in the Basie band: you’re a drum with pitches.',
        '<b>Harder</b>: 200 bpm, and keep it relaxed.',
      ]),
      R('Bossa nova', 'level 4 · thumb and fingers', { meter: '4/4', sub: 2, bpm: 120, chart: 'C:maj7 | % | D:m7 | G:7', gtr: 'd..d..d.', bass: 'r...5...', drums: { m: 'xxxxxxxx', r: 'x..x..x.' } }, [
        '<b>Count</b>: 1 & 2 & 3 & 4 &. The thumb plays the bass on 1 and 3 (root, then 5th); the fingers play the chord on 1, the “&” of 2 and 4: three, three, two.',
        '<b>Hand</b>: fingerstyle. Thumb steady like a heartbeat; fingers pluck the top three strings together, lightly.',
        '<b>Best practice</b>: thumb first, alone, until it doesn’t waver. Then add the fingers one hit at a time.',
        '<b>Harder</b>: the two-bar bossa pattern, with different hits in the second bar, as João Gilberto played it.',
      ]),
      R('The gallop', 'level 4 · eighth and two sixteenths', { meter: '4/4', sub: 4, bpm: 110, chart: 'E:5 | % | C:5 | D:5', gtr: 'D.DUD.DUD.DUD.DU', drums: { k: 'x...x...x...x...', s: '....x.......x...', h: 'x.x.x.x.x.x.x.x.' } }, [
        '<b>Count</b>: 1 & a, 2 & a…: an 8th then two 16ths on every beat. Da – da-da.',
        '<b>Hand</b>: down, then down-up. Palm-muted power chords.',
        '<b>Best practice</b>: the two 16ths must be even. Practise at 80 before 110; the gallop smears easily.',
        '<b>Harder</b>: reverse it (two 16ths then an 8th: da-da – da). The sound of classic metal.',
      ]),
      R('Punk eighths', 'level 3 · all downstrokes', { meter: '4/4', sub: 2, bpm: 160, chart: 'E:5 | C:5 | G:5 | D:5', gtr: 'DDDDDDDD', drums: ROCK }, [
        '<b>Count</b>: eighths, every one a downstroke.',
        '<b>Hand</b>: the one pattern where the hand doesn’t alternate. Small, fast strokes from the wrist; palm-mute the low strings.',
        '<b>Best practice</b>: stamina. Play two minutes without stopping at 140 before going faster. Tension is the enemy; drop your shoulder.',
        '<b>Harder</b>: 200 bpm, the Ramones speed.',
      ]),
      R('The clave beat', 'level 4 · 3-2, one bar', { meter: '4/4', sub: 4, bpm: 100, chart: 'E:maj | % | A:maj | E:maj', gtr: 'D..U..D...D.D...', drums: { k: 'x...x...x...x...', m: 'x.x.x.x.x.x.x.x.' } }, [
        '<b>Count</b>: 1 e & a… Three hits (1, the “a” of 1, the “&” of 2), then two (the “&” of 3, and 4): the 3–2 clave squeezed into one bar.',
        '<b>Hand</b>: 16ths throughout, the hand alternating; strike only where the grid shows.',
        '<b>Best practice</b>: clap it first while counting, then play it. The clave is the backbone of Afro-Cuban music and the Bo Diddley beat.',
        '<b>Harder</b>: play it 2–3 (the two hits first).',
      ]),
      R('5/4: three plus two', 'level 5 · odd meter', { meter: '5/4', sub: 2, groups: [3, 2], bpm: 160, chart: 'Eb:m7 | Bb:m7', gtr: 'D.DUD.D.D.', drums: { k: 'x.....x...', s: '...x....x.', h: 'x.x.x.x.x.' } }, [
        '<b>Count</b>: 1 2 3 4 5, grouped <b>1</b> 2 3 <b>4</b> 5: a bar of 3 and a bar of 2 glued together.',
        '<b>Best practice</b>: say “1-2-3-1-2” out loud with the click. Don’t count to five as one long line; feel the two groups.',
        '<b>Hear it</b>: “Take Five”, which vamps on these two chords.',
        '<b>Harder</b>: group it 2 + 3 instead, and feel the difference.',
      ]),
      R('7/8: two, two, three', 'level 6 · odd meter', { meter: '7/8', groups: [2, 2, 3], bpm: 200, chart: 'D:min | C:maj', gtr: 'D.D.D..', drums: { k: 'x...x..', s: '..x...x', h: 'xxxxxxx' } }, [
        '<b>Count</b>: seven eighths, grouped 1-2, 1-2, 1-2-3. The click accents each group’s first note.',
        '<b>Best practice</b>: say the groups as words: “quick, quick, slow”. The last group is the long one.',
        '<b>Hear it</b>: Balkan folk dances, and progressive rock (Pink Floyd’s “Money” is in 7/4).',
        '<b>Harder</b>: 3 + 2 + 2, and 2 + 3 + 2. Same meter, three different grooves.',
      ]),
    ],
  });
}

// ---------- soloing over grooves: drums, bass and a guitar part loop; you solo over them, level by level ----------
{
  const S = (t, s, groove, b) => ({ t, s, groove: { click: false, ...groove }, b });
  const ROCK = { k: 'x...x...', s: '..x...x.', h: 'xxxxxxxx' };
  DECKS.splice(DECKS.findIndex((d) => d.id === 'fluency'), 0, {
    id: 'grooves', name: 'Soloing over grooves', cards: [
      { t: 'How to use these', s: 'the practice method', b: [
        'Each card loops a groove: drums, bass and a guitar part. Turn the Guitar off if you want to be the only guitar, and use the tempo buttons freely.',
        '- <b>Listen first</b>: one full loop without playing. Find beat 1, hum the bass line',
        '- <b>Three notes</b>: one chorus using only three notes. Rhythm and space do the work',
        '- <b>Then the scale</b>, then the chord tones on the strong beats',
        '- <b>Call and response</b>: play two bars, rest two bars. Rests are part of the solo',
        '- <b>Record yourself</b> and listen back once a week',
        'Levels rise from one scale over one chord to changes, swing and odd meters.',
      ] },
      S('Rock in A minor', 'level 1 · one scale', { meter: '4/4', sub: 2, bpm: 90, chart: 'A:m7 | % | G:maj | D:maj', gtr: 'd...d.u.', drums: ROCK, bass: 'r...r.5.' }, [
        '<b>Play</b>: A minor pentatonic, box 1 at the 5th fret. It fits all three chords.',
        '<b>Step 1</b>: only A, C and E. Start phrases on beat 1, end them on A.',
        '<b>Step 2</b>: the whole box; bend the D (3rd string, 7th fret) up a whole step to E.',
        '<b>Step 3</b>: target the chord tones as the chords change: B over G (the 3rd), F♯ over D (its 3rd, from A Dorian).',
        '<b>Harder</b>: the same idea an octave up, in box 4 at the 12th fret.',
      ]),
      S('The blues shuffle in A', 'level 1 · 12/8', { meter: '12/8', bpm: 80, chart: 'A:7 | D:7 | A:7 | A:7 | D:7 | D:7 | A:7 | A:7 | E:7 | D:7 | A:7 | E:7', gtr: 'P.PQ.QP.PQ.Q', drums: { k: 'x.....x.....', s: '...x.....x..', h: 'x.xx.xx.xx.x' } }, [
        '<b>Play</b>: the A blues scale (A C D E♭ E G).',
        '<b>Step 1</b>: phrase in the shuffle: long–short. Straight 8ths over a shuffle is the commonest blues mistake.',
        '<b>Step 2</b>: call and response with the form: a phrase in bar 1, the same in bar 5 (it sounds different over D7), an answer in bar 9.',
        '<b>Step 3</b>: chord tones: C♯ over A7, F♯ over D7, G♯ over E7. Mix major and minor: C → C♯ over A7 is the blues.',
        '<b>Harder</b>: one note only for a whole chorus, all variety from rhythm, bends and vibrato.',
      ]),
      S('Pop ballad in G', 'level 2 · major pentatonic', { meter: '4/4', sub: 2, bpm: 76, chart: 'G:maj | D:maj | E:min | C:maj', gtr: 'D.DU.UDU', drums: { k: 'x.....x.', s: '..x...x.', h: 'x.x.x.x.' }, bass: 'r...5...' }, [
        '<b>Play</b>: G major pentatonic (G A B D E). It fits every chord.',
        '<b>Step 1</b>: sing a melody first, then play it. Long notes, like a vocal.',
        '<b>Step 2</b>: land on each chord’s 3rd as it arrives: B, F♯, G, E. Add F♯ and C from the full G major scale when they help.',
        '<b>Step 3</b>: build: low and simple for 8 bars, higher and busier for the next 8.',
        '<b>Harder</b>: slide into notes and use double-stops in 3rds (G and B together).',
      ]),
      S('Funk vamp on E9', 'level 2 · sixteenths', { meter: '4/4', sub: 4, bpm: 96, chart: 'E:9 | % | % | %', gtr: 'D.xU.Ux.D.xU.Ux.', drums: { k: 'x.....x...x.....', s: '....x.......x...', h: 'x.x.x.x.x.x.x.x.' }, bass: 'r.....r...5.r...' }, [
        '<b>Play</b>: E minor pentatonic plus G♯ (the 3rd) and C♯ (the 13): E Dorian and Mixolydian mixed.',
        '<b>Step 1</b>: short, percussive notes. Muted 16ths between notes keep the groove going.',
        '<b>Step 2</b>: start phrases off the beat, on the “e” or “a”.',
        '<b>Step 3</b>: double-stops on the top two strings, slid into from a fret below.',
        '<b>Harder</b>: one two-bar riff, repeated, changing only one note each time.',
      ]),
      S('Reggae in A minor', 'level 2 · space', { meter: '4/4', sub: 2, bpm: 75, chart: 'A:min | D:min | A:min | E:min', gtr: '..K...K.', drums: { k: '....x...', r: '....x...', h: 'x.x.x.x.' }, bass: 'r...r.5.' }, [
        '<b>Play</b>: A minor pentatonic, or A natural minor.',
        '<b>Step 1</b>: play less. Two- or three-note phrases with lots of air.',
        '<b>Step 2</b>: lay back: place notes slightly behind the beat.',
        '<b>Step 3</b>: answer the bass line: play when it rests.',
        '<b>Harder</b>: melody in octaves (thumb or first finger and fourth finger, the middle strings muted).',
      ]),
      S('6/8 minor groove', 'level 3 · threes and twos', { meter: '6/8', bpm: 66, chart: 'A:min | F:maj | G:maj | A:min', gtr: 'D.UD.U', drums: { k: 'x.....', s: '...x..', h: 'xxxxxx' }, bass: 'r..5..' }, [
        '<b>Play</b>: A natural minor.',
        '<b>Step 1</b>: phrases in groups of three eighths, matching the meter.',
        '<b>Step 2</b>: hemiola: play groups of two across the bar (three quarter notes in a bar of 6/8). It pulls against the beat and resolves on 1.',
        '<b>Step 3</b>: chord tones: E over Am, A over F, B over G.',
        '<b>Harder</b>: switch freely between threes and twos, and land every phrase on beat 1.',
      ]),
      S('Jazz waltz in D minor', 'level 4 · 3/4, changes', { meter: '3/4', sub: 2, bpm: 140, swing: 0.3, chart: 'D:m7 | G:7 | C:maj7 | A:7b9', gtr: 'd.d.d.', drums: { h: 'x.xxx.', k: 'x.....' }, bass: 'r.3.5.' }, [
        '<b>Play</b>: D Dorian, G Mixolydian, C major, then D harmonic minor over A7♭9.',
        '<b>Step 1</b>: the 3rd of each chord on beat 1: F, B, E, C♯.',
        '<b>Step 2</b>: four-bar phrases. A waltz breathes in fours.',
        '<b>Step 3</b>: swung 8ths, with arpeggios from the 3rd.',
        '<b>Harder</b>: play groups of four 8ths against the 3/4 (they shift across the bar lines) and resolve after 12 beats.',
      ]),
      S('Bossa ii–V–I', 'level 4 · changes, light touch', { meter: '4/4', sub: 2, bpm: 125, chart: 'D:m7 | G:7 | C:maj7 | A:7b9', gtr: 'd..d..d.', bass: 'r...5...', drums: { m: 'xxxxxxxx', r: 'x..x..x.' } }, [
        '<b>Play</b>: C major over the first three; D harmonic minor (A Phrygian dominant) over A7♭9.',
        '<b>Step 1</b>: soft, legato, mostly stepwise. Bossa melodies sing rather than shout.',
        '<b>Step 2</b>: guide tones: F – F – E – C♯ – C as the backbone of your line.',
        '<b>Step 3</b>: anticipate: land the new chord’s note on the “&” of 4 before the bar.',
        '<b>Harder</b>: A7alt (B♭ melodic minor) in bar 4.',
      ]),
      S('Swing: C minor blues', 'level 5 · walking bass, ride', { meter: '4/4', sub: 3, bpm: 140, chart: 'C:m7 | F:m7 | C:m7 | C:m7 | F:m7 | F:m7 | C:m7 | C:m7 | Ab:7 | G:7alt | C:m7 | G:7alt', drums: { h: 'x..x.xx..x.x', k: 'x.....x.....' }, bass: 'r..3..5..a..', gtr: '...d.....d..' }, [
        '<b>Play</b>: C minor pentatonic and C Dorian; F Dorian on Fm7; A♭ Lydian dominant and G altered in bars 9–10.',
        '<b>Step 1</b>: swing 8ths: long–short, with the ride cymbal.',
        '<b>Step 2</b>: hit the change in bar 5: A♭ (the ♭3 of Fm) where you’d played E♭.',
        '<b>Step 3</b>: bars 9–10: resolve A♭ → G and B → C into bar 11.',
        '<b>Harder</b>: double-time lines (16th notes) for two bars, then back to swing 8ths.',
      ]),
      S('Funk ii–V: Dm7 – G7', 'level 5 · Dorian and changes', { meter: '4/4', sub: 4, bpm: 100, chart: 'D:m7 | G:7 | D:m7 | G:7', gtr: 'D.xU.Ux.D.xU.Ux.', drums: { k: 'x.....x...x.....', s: '....x.......x...', h: 'x.x.x.x.x.x.x.x.' }, bass: 'r.....r...5.r...' }, [
        '<b>Play</b>: D Dorian over both, then outline the change: F → F (stays) and C → B.',
        '<b>Step 1</b>: a two-bar riff that works over both chords.',
        '<b>Step 2</b>: B on beat 1 of every G7 bar. That one note makes the change audible.',
        '<b>Step 3</b>: F and G triads alternated (a triad pair, both in D Dorian).',
        '<b>Harder</b>: D minor pentatonic up a half step (E♭) for a beat, then back: outside and in.',
      ]),
      S('5/4 in E♭ minor', 'level 6 · odd meter', { meter: '5/4', sub: 2, groups: [3, 2], bpm: 160, chart: 'Eb:m7 | Bb:m7', gtr: 'D.DUD.D.D.', drums: { k: 'x.....x...', s: '...x....x.', h: 'x.x.x.x.x.' }, bass: 'r...5.r.5.' }, [
        '<b>Play</b>: E♭ minor pentatonic or E♭ Dorian over both chords.',
        '<b>Step 1</b>: feel 3 + 2. Start phrases on 1 and on 4.',
        '<b>Step 2</b>: five-beat phrases that end on beat 1 of the next bar.',
        '<b>Step 3</b>: phrases that run over the bar line and resolve on beat 4.',
        '<b>Harder</b>: groups of three 8ths across the bar: it takes three bars to come round.',
      ]),
      S('7/8 in D minor', 'level 6 · odd meter', { meter: '7/8', groups: [2, 2, 3], bpm: 200, chart: 'D:min | C:maj', gtr: 'D.D.D..', drums: { k: 'x...x..', s: '..x...x', h: 'xxxxxxx' }, bass: 'r.r.5..' }, [
        '<b>Play</b>: D natural minor (D Aeolian) or D Dorian.',
        '<b>Step 1</b>: count 1-2, 1-2, 1-2-3 out loud while playing one note per group.',
        '<b>Step 2</b>: seven-note phrases in 8ths: one note per 8th, so every phrase fits the bar exactly.',
        '<b>Step 3</b>: leave the long group (the three) for the held or bent note.',
        '<b>Harder</b>: phrases of five and nine 8ths, so the line lands on beat 1 only every few bars.',
      ]),
      S('Phrygian in 12/8', 'level 7 · E – F, Spanish', { meter: '12/8', bpm: 70, chart: 'E:maj | F:maj | E:maj | F:maj', gtr: 'D..D..D.UD..', drums: { r: 'x.x.xx.x.x.x', k: 'x.....x.....' }, bass: 'r.....r..5..' }, [
        '<b>Play</b>: E Phrygian dominant (E F G♯ A B C D) over E, E Phrygian (with G) over F.',
        '<b>Step 1</b>: lean on the half step F → E. It’s the whole flavour.',
        '<b>Step 2</b>: triplet runs down the scale into E on beat 1.',
        '<b>Step 3</b>: the rim plays the 12/8 bell pattern: phrase with it, not against it.',
        '<b>Harder</b>: alternate G♯ (over E) and G (over F) exactly on the chord changes.',
      ]),
    ],
  });
}

// ---------- contrary motion and other killer drills, each on the neck ----------
{
  const fl = DECKS.find((d) => d.id === 'fluency');
  const at = fl.cards.findIndex((c) => c.t === 'Triads through the key');
  fl.cards.splice(at + 1, 0,
    { t: 'Contrary motion: scale steps apart', s: 'two voices, opposite directions', drill: { bpm: 60, sub: 1, goal: 'quarters at 120', from: 'quarters at 50', drone: 'C' },
      neck: { kind: 'contrary', id: 'major', key: 'C', start: 64, steps: 8 }, b: [
        'Start both voices on the same E (B string 5th fret and the open top string). Each step, the lower voice goes down C major and the upper goes up: E/E, D/F, C/G, B/A… until they’re two octaves apart, then back in.',
        '- Fingerstyle: thumb or middle finger on the lower voice, ring finger on the upper. Or pick the lower note and pluck the upper with a finger (hybrid picking)',
        '- Name the interval between them at each step: unison, 3rd, 5th, 7th…',
        'Why it matters: contrary motion is the strongest way two lines can move. Every good bass line against a melody does it.',
      ] },
    { t: 'The wedge', s: 'chromatic contrary motion', drill: { bpm: 60, sub: 1, goal: 'quarters at 120', from: 'quarters at 50', drone: 'C' },
      neck: { kind: 'contrary', start: 60, steps: 13 }, b: [
        'From one C, both voices move a half step at a time, one down and one up, until they’re two octaves apart: C/C, B/C♯, B♭/D, A/D♯…',
        '- Listen to the intervals open out: unison, major 2nd, major 3rd, tritone, minor 6th… every other step is a whole number of tones',
        '- Then go back in, the voices converging on the C',
        'A Romantic-era and film-score device: two lines spreading from one note build tension without any harmony at all.',
      ] },
    { t: 'Bass down, melody up', s: 'outer voices in contrary motion', drill: { bpm: 60, sub: 1, goal: 'quarters at 100', from: 'quarters at 50', drone: 'C' },
      neck: { kind: 'contrary', id: 'major', key: 'C', start: 48, gap: 16, steps: 6 }, b: [
        'The bass walks down C – B – A – G – F – E on the low strings while the melody climbs E – F – G – A – B – C on the top strings.',
        '- These outer voices imply C – G/B – Am – Em/G? no matter: just the two lines, and hear the harmony they suggest',
        '- Thumb on the bass, ring finger on the melody. Keep both voices equally loud, then make the melody louder',
        'Then add one inner note between them on each step and you have a chord-melody arrangement with real voice leading.',
      ] },
    { t: 'The spider', s: 'finger independence', drill: { bpm: 60, sub: 2, goal: '8ths at 140', from: '8ths at 60', drone: 'E' },
      neck: { kind: 'spider', from: 5 }, b: [
        'Fingers 1-2-3-4 at frets 5-6-7-8, alternating two strings: 1 on the 6th, 2 on the 5th, 3 on the 6th, 4 on the 5th. Then the 4th and 3rd strings, then the 2nd and 1st, then back down.',
        '- Keep every finger down until it has to move; only one finger lifts at a time',
        '- Strict alternate picking. It trains the hand to move fingers independently, which chromatic runs don’t',
        '- Variations: 1-3-2-4, or 1-4 on one string and 2-3 on the next',
      ] },
    { t: 'Octaves', s: 'Wes Montgomery’s way up the neck', drill: { bpm: 60, sub: 1, goal: 'quarters at 140', from: 'quarters at 60', drone: 'G' },
      neck: { kind: 'list', events: [[[6, 3, '1'], [4, 5, '1']], [[6, 5, '2'], [4, 7, '2']], [[6, 7, '3'], [4, 9, '3']], [[6, 8, '4'], [4, 10, '4']], [[6, 10, '5'], [4, 12, '5']], [[6, 12, '6'], [4, 14, '6']], [[6, 14, '7'], [4, 16, '7']], [[6, 15, '1'], [4, 17, '1']]] }, b: [
        'G major in octaves on the 6th and 4th strings: first finger on the low note, third or fourth on the high one, two frets up and two strings over.',
        '- Mute the 5th string between them with the underside of the first finger, then strum all three with the thumb or the pick. Only the two octave notes should sound',
        '- On the 5th and 3rd strings it’s the same shape; on the 4th and 2nd, the upper note moves one fret further up (the B string again)',
        'Then play melodies in octaves. It’s the fattest single-note sound on the guitar.',
      ] },
    { t: 'Rhythmic displacement', s: 'one lick, four starting points', drill: { bpm: 70, sub: 2, goal: '8ths at 160', from: '8ths at 70', drone: 'G' },
      neck: { kind: 'list', events: [[6, 3, '1'], [6, 5, '2'], [5, 2, '3'], [5, 5, '5'], [], [], [], [], [], [6, 3, '1'], [6, 5, '2'], [5, 2, '3'], [5, 5, '5'], [], [], [], [], [], [6, 3, '1'], [6, 5, '2'], [5, 2, '3'], [5, 5, '5'], [], [], [], [], [], [6, 3, '1'], [6, 5, '2'], [5, 2, '3'], [5, 5, '5'], []] }, b: [
        'A four-note lick, G A B D, played in 8ths starting on beat 1, then a bar later starting on the “&” of 1, then on 2, then on the “&” of 2.',
        '- The notes never change, but each start makes a different accent pattern. It’s one of the fastest ways to get more out of the licks you already know',
        '- Count out loud and feel where the first note lands each time',
        'Then do it with any lick of your own, and with groups of three notes (they displace themselves every beat).',
      ] },
  );
  fl.cards.find((c) => c.t === 'Bass down, melody up').b[1] = '- Just the two lines first, and hear the harmony they suggest: C, then G/B, Am, G… under a rising tune';
}

// ---------- intervals: the building blocks, on the neck and in the ear ----------
DECKS.splice(DECKS.findIndex((d) => d.id === 'symbols') + 1, 0, {
  id: 'intervals', name: 'Intervals', cards: [
    { t: 'What an interval is', s: 'the distance between two notes', b: [
      'An interval is counted in half steps, and on the guitar a half step is one fret. C to E is four frets: a major 3rd.',
      'Its name has two parts: a number (count the letters: C D E is a 3rd) and a quality (major, minor, perfect, augmented, diminished).',
      '- 2nds, 3rds, 6ths and 7ths are <b>major</b> or <b>minor</b>',
      '- Unisons, 4ths, 5ths and octaves are <b>perfect</b>',
      'Melodic: one note after the other. Harmonic: both together. Train both.',
    ], ex: [['C to E: a major 3rd, melodic then harmonic', '=C3 | E3 | C3 E3', 'C · E · C+E'], ['C to E♭: a minor 3rd, one fret smaller', '=C3 | Eb3 | C3 Eb3', 'C · E♭ · C+E♭']] },
    { t: 'The twelve', s: 'within an octave', b: [
      '- 1 fret: minor 2nd. 2: major 2nd. 3: minor 3rd. 4: major 3rd',
      '- 5: perfect 4th. 6: the tritone (augmented 4th or diminished 5th)',
      '- 7: perfect 5th. 8: minor 6th. 9: major 6th',
      '- 10: minor 7th. 11: major 7th. 12: the octave',
      'Same sound, two names: the tritone is ♯4 or ♭5; a minor 6th is spelled differently from an augmented 5th (C–A♭ vs C–G♯) depending on the key.',
    ], ex: [['All twelve from C, each one fret wider', '=C3 Db3 | C3 D3 | C3 Eb3 | C3 E3 | C3 F3 | C3 Gb3 | C3 G3 | C3 Ab3 | C3 A3 | C3 Bb3 | C3 B3 | C3 C4', 'm2 · M2 · m3 · M3 · P4 · TT · P5 · m6 · M6 · m7 · M7 · 8ve']] },
    { t: 'Intervals across the strings', s: 'the shapes', b: [
      'On the 6th to 3rd strings (tuned in 4ths):',
      '- Next string, same fret: a perfect 4th. Two frets up: a perfect 5th (the power chord)',
      '- Next string, one fret down: a major 3rd. Two frets down: a minor 3rd',
      '- Two strings over, two frets up: the octave',
      '<b>Crossing to the B string</b>, every shape moves one fret up, because G to B is a major 3rd, not a 4th. That’s the one rule that makes guitar shapes change.',
    ], ex: [['A 4th, a 5th and an octave from A', '=A2 D3 | A2 E3 | A2 A3', 'P4 · P5 · 8ve'], ['A major 3rd and a minor 3rd from C', '=C3 E3 | C3 Eb3', 'M3 · m3']] },
    { t: 'Inversions add up to 9', s: 'turn an interval upside down', b: [
      'Move the lower note up an octave and the interval inverts. The numbers add up to 9 and the quality flips:',
      '- 3rd ↔ 6th, 2nd ↔ 7th, 4th ↔ 5th',
      '- Major ↔ minor; perfect stays perfect; the tritone stays a tritone',
      'So C up to E is a major 3rd, and E up to C is a minor 6th. Learn six intervals and you have twelve.',
    ], ex: [['C–E (major 3rd), then E–C (minor 6th)', '=C3 E3 | E3 C4', 'M3 · m6'], ['C–G (5th), then G–C (4th)', '=C3 G3 | G3 C4', 'P5 · P4']] },
    { t: 'Compound intervals', s: '9, 11 and 13', b: [
      'Beyond the octave, add 7: a 9th is a 2nd plus an octave, an 11th a 4th plus an octave, a 13th a 6th plus an octave.',
      'In chord symbols they mean the same notes as 2, 4 and 6, but placed above the 7th: C9 has D, C13 has A.',
      '- A 10th (a 3rd plus an octave) is the most beautiful interval on the guitar: bass and melody in 10ths is a whole style',
    ], ex: [['C to D: a 2nd, then a 9th', '=C3 D3 | C3 D4', 'M2 · M9'], ['Moving 10ths: C–E, D–F, E–G', '=C3 E4 | D3 F4 | E3 G4', '10ths in C']] },
    { t: 'Consonant and dissonant', s: 'stable and restless', b: [
      '- <b>Perfect consonances</b>: unison, octave, 5th. Open and stable',
      '- <b>Imperfect consonances</b>: 3rds and 6ths. Sweet; the sound of harmony',
      '- <b>Dissonances</b>: 2nds, 7ths and the tritone. They want to move',
      'The 4th is both: stable over another note, unstable over the bass.',
      'Good lines move from dissonance to consonance. That’s what resolution is.',
    ], ex: [['A 7th resolving to a 6th, and a tritone to a 3rd', '=G3 F4 | G3 E4 | B3 F4 | C4 E4', 'm7 → M6 · TT → M3']] },
    { t: 'The tritone', s: 'half an octave', b: [
      'Six half steps: exactly half an octave, so it inverts to itself. B–F and F–B are both tritones.',
      'It’s the engine of the dominant 7th: in G7, B and F. B rises to C, F falls to E, and the restlessness is resolved.',
      '- Because it’s symmetrical, the same tritone belongs to two dominants a tritone apart: G7 and D♭7. That’s the tritone sub',
    ], ex: [['B–F resolving to C–E', '=B3 F4 | C4 E4', 'TT → M3'], ['The same tritone in G7 and D♭7, both into C', 'G:7 C:maj7 Db:7 C:maj7']] },
    { t: 'Hearing them', s: 'a tune for each', b: [
      'Tie each interval to the start of a tune you know:',
      '- m2: “Jaws”. M2: “Happy Birthday”. m3: “Greensleeves”',
      '- M3: “When the Saints Go Marching In”. P4: “Here Comes the Bride”',
      '- Tritone: “Maria” (West Side Story). P5: “Twinkle, Twinkle”',
      '- M6: “My Bonnie Lies over the Ocean”. m7: “Somewhere” (West Side Story). M7: the chorus of “Take On Me”. Octave: “Over the Rainbow”',
      'Then use the Sing page’s interval drills to hear them without the tunes.',
    ] },
    { t: 'Chords are stacked intervals', s: 'major 3rds and minor 3rds', b: [
      '- Major triad: major 3rd, then minor 3rd (C E G). Minor: minor, then major (C E♭ G)',
      '- Diminished: two minor 3rds. Augmented: two major 3rds',
      '- 7th chords add another 3rd: Cmaj7 is M3 m3 M3; C7 is M3 m3 m3; Cm7 is m3 M3 m3; Cø7 is m3 m3 M3; C°7 is m3 m3 m3',
      'Know the stack and you can build any chord from any note without a chart.',
    ], ex: [['Cmaj7, C7, Cm7, Cø7, C°7', 'C:maj7 C:7 C:m7 C:m7b5 C:dim7']] },
    { t: 'Practise them on the neck', s: 'a daily five minutes', b: [
      '- Pick one interval. Play it from every note on the 6th string, up the neck, saying the note names',
      '- Then the same on the 5th string, and across the G–B pair, where the shape shifts',
      '- Then sing it before you play it',
      '- Then improvise using only that interval: a solo in 4ths, a solo in 6ths. You’ll hear what each interval is for',
    ], ex: [['A melody in 6ths, up the C scale', '=E3 C4 | F3 D4 | G3 E4 | A3 F4 | B3 G4 | C4 A4', '6ths in C']] },
  ],
});

// the play-along exercise decks sit together at the end: comping, rhythm, grooves, drills
{ const i = DECKS.findIndex((d) => d.id === 'comping'); const [cp] = DECKS.splice(i, 1); DECKS.splice(DECKS.findIndex((d) => d.id === 'rhythm'), 0, cp); }
