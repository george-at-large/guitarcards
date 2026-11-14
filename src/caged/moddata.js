// Modulation: ways of changing key (not colouring one), each shown in the five CAGED positions of the home key (the
// home chord, the pivot, the new key's tonic, all in the same position: a key change doesn't need the hand to move)
// and in a few progressions. Most are round trips, out to the new key and back, so they loop in Chord changes.
// Charts are numerals against the home key's major scale; songs named only where well known.

const P = (name, chart, note, o = {}) => ({ name, chart, note, ...o });
const M = { minor: true };

export const MODULATIONS = [
  // ---------- pivot chords: a chord both keys share ----------
  { id: 'toV', group: 'Pivot chords', rn: 'I → V', name: 'To the dominant', from: 'a common-chord modulation',
    chords: [{ iv: '2', q: '7', rn: 'II7' }, { iv: '5', q: 'maj', rn: 'V' }],
    where: 'C to G, the most common key change. Am is vi in C and ii in G, so it can pivot; D7 (G’s V7, with F♯) confirms the new key.',
    how: 'Play a chord the two keys share, then the new key’s V7: its 3rd (F♯) is the note that says “new key”. Back home, the G chord simply becomes V of C again.',
    sound: 'A lift, a brightening: the classic move in the middle of a tune.',
    progs: [
      P('Pivot on vi, round trip', '| I:maj | vi:min | II:7 | V:maj | V:maj | ii:min | V:7 | I:maj |', 'Am (= ii of G) – D7 – G; then Dm – G7 home.'),
      P('ii–V of the new key', '| I:maj7 | vi:m7 | II:7 | V:maj7 | vi:m7 | II:7 | V:maj7 | V:7 |', 'Twice into G, then G7 turns it back to C as the loop restarts.'),
      P('Pivot on IV', '| I:maj | IV:maj | II:7 | V:maj | I:maj | II:7 | V:7 | I:maj |', 'F, then straight to D7: the F♯ against the F is the jolt.'),
    ] },
  { id: 'tovi', group: 'Pivot chords', rn: 'I → vi', name: 'To the relative minor', from: 'a common-chord modulation',
    chords: [{ iv: '3', q: '7', rn: 'III7' }, { iv: '6', q: 'min', rn: 'vi' }],
    where: 'C to A minor: the same notes, a new home. Dm is ii in C and iv in A minor; E7 (with G♯) makes A the tonic.',
    how: 'Pivot on ii or IV, then E7: the G♯ is the new leading tone. Back, the G7 (with G natural) pulls home to C.',
    sound: 'A shadow falls without leaving the key signature.',
    progs: [
      P('Pivot on ii, round trip', '| I:maj | IV:maj | ii:min | III:7 | vi:min | vi:min | V:7 | I:maj |', 'Dm (= iv of Am) – E7 – Am; then G7 home.'),
      P('Minor ii–V, round trip', '| I:maj7 | vi:m7 | vii:m7b5 | III:7b9 | vi:m7 | vi:m7 | ii:m7 | V:7 |', 'Bø7 – E7♭9 into Am, then Dm7 – G7 back.'),
      P('Pop version', '| I:maj | V:maj | vi:min | III:maj | vi:min | IV:maj | V:7 | I:maj |', 'Into A minor through its major V, then out through IV.'),
    ] },
  { id: 'toIV', group: 'Pivot chords', rn: 'I → IV', name: 'To the subdominant', from: 'a common-chord modulation',
    chords: [{ iv: '1', q: '7', rn: 'I7' }, { iv: '4', q: 'maj', rn: 'IV' }],
    where: 'C to F: add a B♭ to C and it becomes C7, the V of F. B♭ (F’s IV) then confirms the new key.',
    how: 'Turn I into I7 and stay in F for a while (with B♭ chords) before G7 brings you home. The blues and gospel bridge move.',
    sound: 'Relaxing, settling, warm.',
    progs: [
      P('I7 into F, round trip', '| I:maj | I:7 | IV:maj | bVII:maj | I:7 | IV:maj | V:7 | I:maj |', 'F – B♭ – C7 – F is a whole cadence in F; then G7 home.'),
      P('Jazz: ii–V of IV, home by the back door', '| I:maj7 | v:m7 | I:7 | IV:maj7 | iv:m7 | bVII:7 | I:maj7 | I:maj7 |', 'Gm7 – C7 into F, then Fm7 – B♭7 back to C.'),
      P('Gospel', '| I:maj | IV:maj | I:7 | IV:maj | bVII:maj | IV:maj | V:7 | I:maj |', 'Two bars in F, with B♭ as its IV.'),
    ] },
  // ---------- ii–Vs and direct changes ----------
  { id: 'iiVaway', group: 'ii–Vs and direct changes', rn: 'ii–V → ♭III', name: 'A ii–V into a new key', from: 'a ii–V modulation',
    chords: [{ iv: 'b7', q: '7', rn: '♭VII7' }, { iv: 'b3', q: 'maj7', rn: '♭IIImaj7' }],
    where: 'Jazz’s way to any key: its own ii–V, played straight after the old key. Fm7 – B♭7 lands on E♭ (♭III of C); B♭m7 – E♭7 on A♭.',
    how: 'Think of the ii–V as a doorway: land the dominant’s 3rd (D in B♭7) and resolve it to the new tonic. Back home with Dm7 – G7.',
    sound: 'Smooth and sudden: standards change key like this every few bars.',
    progs: [
      P('To ♭III and back', '| I:maj7 | I:maj7 | iv:m7 | bVII:7 | bIII:maj7 | bIII:maj7 | ii:m7 | V:7 |', 'Fm7 – B♭7 – E♭maj7, then Dm7 – G7.'),
      P('To ♭VI and back', '| I:maj7 | I:maj7 | bvii:m7 | bIII:7 | bVI:maj7 | bVI:maj7 | ii:m7 | V:7 |', 'B♭m7 – E♭7 – A♭maj7.'),
      P('To III and back', '| I:maj7 | #iv:m7 | VII:7 | III:maj7 | III:maj7 | ii:m7 | V:7 | I:maj7 |', 'F♯m7 – B7 – Emaj7: the brightest jump.'),
    ] },
  { id: 'truck', group: 'ii–Vs and direct changes', rn: 'up a step', name: 'Up a step (the truck-driver change)', from: 'a direct modulation',
    chords: [{ iv: '6', q: '7', rn: 'VI7' }, { iv: '2', q: 'maj', rn: 'II' }],
    where: 'The last chorus up a whole step (C to D) or a half step (C to D♭), often with the new key’s V7 as a one-chord bridge (A7 into D).',
    how: 'Play the same progression in the new key: everything moves up two frets (or one). With the pivot V7, the change is smoother; without it, more of a jolt.',
    sound: 'The pop-ballad lift into the final chorus.',
    progs: [
      P('Up a whole step, with its V7', '| I:maj | IV:maj | V:maj | VI:7 | II:maj | V:maj | VI:maj | II:maj |', 'C F G, A7 – then D G A D.'),
      P('Up a half step, with its V7', '| I:maj | IV:maj | V:maj | bVI:7 | bII:maj | bV:maj | bVI:maj | bII:maj |', 'C F G, A♭7 – then D♭ G♭ A♭ D♭.'),
      P('Up a whole step, straight in', '| I:maj | IV:maj | V:maj | I:maj | II:maj | V:maj | VI:maj | II:maj |', 'No bridge: the jolt is the effect.'),
    ] },
  { id: 'mediantkey', group: 'ii–Vs and direct changes', rn: 'I → III', name: 'Up a third, straight in', from: 'a chromatic-mediant modulation',
    chords: [{ iv: '3', q: 'maj', rn: 'III' }, { iv: '6', q: 'maj', rn: 'VI' }],
    where: 'C to E (or A♭, or E♭) with no pivot: the new tonic shares one note with the old one, and that’s enough.',
    how: 'Move straight to the new tonic, holding the common note, and play a short cadence there (E – A – B – E) before coming home.',
    sound: 'Cinematic: a whole new scene.',
    progs: [
      P('C to E and back', '| I:maj | IV:maj | III:maj | VI:maj | VII:maj | III:maj | V:7 | I:maj |', 'E – A – B – E is I – IV – V – I in E.'),
      P('C to A♭ and back', '| I:maj | IV:maj | bVI:maj | bII:maj | bIII:maj | bVI:maj | V:7 | I:maj |', 'A♭ – D♭ – E♭ – A♭ in the new key.'),
      P('C to E♭ and back', '| I:maj | V:maj | bIII:maj | bVI:maj | bVII:maj | bIII:maj | V:7 | I:maj |', 'E♭ – A♭ – B♭ – E♭ in the new key.'),
    ] },
  // ---------- mixture and diminished ----------
  { id: 'parallel', group: 'Mixture and diminished', rn: 'I → i', name: 'Major to parallel minor', from: 'a change of mode',
    chords: [{ iv: '4', q: 'min', rn: 'iv' }, { iv: '1', q: 'min', rn: 'i' }],
    where: 'C major to C minor: the same tonic, a different key. Fm (iv of both) is the hinge.',
    how: 'Darken one chord at a time: IV to iv, then i. Stay in minor with ♭VI and ♭VII before the G7 brings major back.',
    sound: 'The sun goes in, then comes out again.',
    progs: [
      P('Into minor and back', '| I:maj | IV:maj | iv:min | i:min | bVI:maj | bVII:maj | V:7 | I:maj |', 'Fm hinges into C minor; G7 resolves to major again.'),
      P('Jazz', '| I:maj7 | i:m7 | bIII:maj7 | bVI:maj7 | ii:m7b5 | V:7b9 | I:maj7 | I:maj7 |', 'Two bars of C minor’s chords, a minor ii–V, then major.'),
      P('Minor first, major at the end', '| i:min | iv:min | V:7 | I:maj | IV:maj | iv:min | V:7 | i:min |', 'From minor to major (Picardy) and back.', M),
    ] },
  { id: 'dimpivot', group: 'Mixture and diminished', rn: '°7 → four keys', name: 'The diminished pivot', from: 'an enharmonic modulation',
    chords: [{ iv: '2', q: 'dim7', rn: 'ii°7' }, { iv: 'b3', q: 'maj', rn: '♭III' }],
    where: 'B°7, D°7, F°7 and A♭°7 are the same four notes. Each is the leading-tone chord of a different key: C, E♭, G♭ and A. So one diminished chord can resolve to four keys.',
    how: 'Play the diminished chord, then treat whichever of its notes you like as the new leading tone and resolve up a half step from it.',
    sound: 'A magician’s trapdoor: Romantic piano music and film.',
    progs: [
      P('To E♭: D°7 = B°7', '| I:maj | vii:dim7 | I:maj | ii:dim7 | bIII:maj | bIII:maj | ii:m7 | V:7 |', 'The same four notes resolve to C, then to E♭.'),
      P('To A: G♯°7 = B°7', '| I:maj | vii:dim7 | I:maj | #v:dim7 | VI:maj | ii:min | V:7 | I:maj |', 'G♯ rises to A; then A becomes V of ii and leads home.'),
      P('To G♭: F°7 = B°7', '| I:maj | vii:dim7 | I:maj | iv:dim7 | bV:maj | bV:maj | V:7 | I:maj |', 'F rises to G♭, the farthest key of all, and straight back.'),
    ] },
  { id: 'mintoIII', group: 'Mixture and diminished', minor: true, rn: 'i → ♭III', name: 'Minor to its relative major', from: 'a common-chord modulation',
    chords: [{ iv: 'b7', q: '7', rn: '♭VII7' }, { iv: 'b3', q: 'maj', rn: '♭III' }],
    where: 'A minor to C major: the same notes, home moves to the relative major. Dm (iv of Am, ii of C) pivots and G7 (♭VII7 of A minor, V7 of C) lands it.',
    how: 'The most natural key change in minor: ii–V into the relative major, then a minor ii–V (Bø7 – E7) back. The Autumn Leaves pattern.',
    sound: 'Minor opening out into major, then closing again.',
    progs: [
      P('Round trip', '| i:min | iv:min | bVII:7 | bIII:maj | bVI:maj | ii:m7b5 | V:7 | i:min |', 'Into C via Dm – G7, out via Bø7 – E7.', M),
      P('Autumn Leaves style', '| iv:m7 | bVII:7 | bIII:maj7 | bVI:maj7 | ii:m7b5 | V:7b9 | i:m7 | i:m7 |', 'A major ii–V–I, then the minor one: the pattern behind Autumn Leaves.', M),
      P('Pop minor', '| i:min | bVI:maj | bIII:maj | bVII:maj | bIII:maj | bVII:maj | V:7 | i:min |', 'Settling into C, then E7 swings it back to A minor.', M),
    ] },
];
