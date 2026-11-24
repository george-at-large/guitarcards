// The iReal Pro section: the tunes the owner practises in iReal Pro, each unpacked as harmony (chords only: the
// melodies and lyrics are copyrighted). One deck per tune; cardsview puts an "iReal Pro" heading before the first.
// Keys are the usual iReal / Real Book keys. Charts are 4 beats a bar; two chords in a bar split it.
const A = (href, text) => `<a href="${href}" target="_blank" rel="noopener">${text}</a>`;
const SP = 'https://open.spotify.com/';
const listen = (a, b, focus) => `<b>Listen</b>: ${a}, then ${b}. <b>Listen for</b>: ${focus}`;

export const DECKS = [
{ id: 'ir-insensitive', name: 'How Insensitive', cards: [
  { t: 'How Insensitive: the map', s: 'Jobim · D minor · the falling bass', comp: { chart: 'D:m7 | % | C#:dim7 | % | C:m6 | % | G:7/3 | % | Bb:6 | % | Eb:maj7 | % | E:m7b5 | A:7b13 | D:m7 | %', bpm: 110 }, b: [
    'The first sixteen bars are one idea: the bass falls a half step every two bars, D, C♯, C, B, B♭, and each chord is chosen to sit on that bass note; then ♭II and the minor ii–V bring it home. Jobim took the idea from Chopin’s E minor Prelude (see Progressions from the classics).',
    '- <b>Dm7</b> (i) · <b>C♯°7</b> (A7♭9 without its root: V of D minor, in first inversion) · <b>Cm6</b> · <b>G7/B</b> · <b>B♭6</b> (♭VI) · <b>E♭maj7</b> (♭II, the Neapolitan) · <b>Eø7 – A7</b> (the minor ii–V) · <b>Dm7</b>',
    '- The chords change every two bars, slowly. The melody is long notes: the harmony moves under them',
    '- The second half of the tune moves through other keys before this falling line comes back: follow it on the iReal chart, asking of each chord “what is the bass doing?”',
    listen(A(SP + 'track/3V8opoT10UsI4APcfrXsjv', 'Jobim'), A(SP + 'album/2jAQUEN5DK7HP0jb14CCHA', 'Wes Montgomery (Tequila)'), 'a steady bossa pulse while the harmony moves under a spacious melody.'),
  ], ex: [['The falling bass', 'D:m7 C#:dim7 C:m6 G:7/3 Bb:6'], ['♭II, then the minor ii–V', 'Eb:maj7 E:m7b5 A:7b13 D:m7']] },
  { t: 'How Insensitive: each chord', s: 'what it is and what to play', b: [
    '- <b>Dm7</b>: home. D Dorian or Aeolian',
    '- <b>C♯°7</b>: C♯ E G B♭ is A7♭9 with C♯ in the bass. It wants to go to Dm and doesn’t: the surprise of the tune. D harmonic minor, or the C♯ diminished scale',
    '- <b>Cm6</b>: C E♭ G A. A borrowed chord whose job is the C in the bass. C Dorian (or C melodic minor)',
    '- <b>G7/B</b>: G7 is IV7 in D minor (the B natural comes from D Dorian / melodic minor). G Lydian dominant: the notes of D melodic minor',
    '- <b>B♭6</b>: ♭VI. B♭ Lydian, which is D minor’s own notes',
    '- <b>E♭maj7</b>: ♭II, a half step above home. E♭ Lydian: D minor’s notes with E♭ for E',
    '- <b>Eø7 – A7♭13</b>: the minor ii–V. D harmonic minor over both',
    'Voice it well and every voice moves by a half step or a step, or holds: that’s what makes it sound like one long breath.',
  ], ex: [['Dm7 to C♯°7: the root falls to C♯', 'D:m7 C#:dim7'], ['C♯°7 is A7♭9 over C♯', 'A:7b9/3 C#:dim7']] },
  { t: 'How Insensitive: practise it', s: 'bossa comping and the bass line', b: [
    '- <b>The bass line alone</b>, root on 1 and 5th on 3 (the bossa bass), with the drone of the falling line in your ear',
    '- <b>Three-note shells</b>, bass on the low strings: hear the falling note at the bottom of every shape',
    '- <b>Bossa comping</b>: thumb on the bass (beats 1 and 3), fingers on the chord in the syncopated pattern: the thumb never wavers, whatever the fingers do',
    '- <b>Solo</b>: one scale per two bars (the previous card), then aim for the note that changes in each new chord',
    'Then play the melody (learn it from the Jobim record) over your own comping: hold its long notes and let the harmony move under them.',
  ] },
] },

{ id: 'ir-bluemonk', name: 'Blue Monk', cards: [
  { t: 'Blue Monk: the map', s: 'Monk · a B♭ blues', comp: { chart: 'Bb:7 Eb:7 | Bb:7 | Bb:7 Eb:7 | Bb:7 | Eb:7 | E:dim7 | Bb:7/5 | G:7 | C:m7 | F:7 | Bb:7 G:7 | C:m7 F:7', bpm: 110 }, b: [
    'A 12-bar blues in B♭. What makes it Monk is the melody: chromatic, built from half-step climbs into chord tones, and full of space.',
    '- Bars 1–4: B♭7, with a quick E♭7 (IV) in bars 1 and 3',
    '- Bars 5–6: <b>E♭7</b> (IV) then <b>E°7</b>: the ♯iv diminished pushes the bass up a half step, E to F, into <b>B♭7/F</b>',
    '- Bars 9–10: jazz players use a ii–V, <b>Cm7 – F7</b>, where the old blues has V – IV',
    '- Bars 11–12: the turnaround, B♭7 – G7 – Cm7 – F7 (I – VI7 – ii – V)',
    listen(A(SP + 'track/5q5XkroSpmvbRl6uRsSJiS', 'Monk'), A(SP + 'album/0NNfPzjM01C98ZsQ7g5uz4', 'Bill Frisell and Fred Hersch (Songs We Know)'), 'the blues form, rhythmic character, and the room left between phrases.'),
  ], ex: [['IV to ♯iv° to I/5', 'Eb:7 E:dim7 Bb:7/5'], ['The turnaround', 'Bb:7 G:7 C:m7 F:7 Bb:7']] },
  { t: 'Blue Monk: Monk’s language', s: 'half steps and space', b: [
    '- <b>Half-step approach from below</b>: Monk’s melody slides into the 3rd and 5th of each chord from a half step under. Do it in your solo: every chord tone can be approached from a fret below',
    '- <b>Minor 2nds as colour</b>: Monk crushes two notes a half step apart (the ♭3 against the 3 on B♭7: D♭ with D). On guitar: a double stop on adjacent strings',
    '- <b>Whole-tone runs</b> over the dominants: B♭ C D E F♯ G♯ fits B♭7 (it’s B♭9♯11♯5)',
    '- <b>Space</b>: play a two-bar phrase, then rest two bars. Repeat the phrase, moving one note',
    'Comp with shells (root, 7th, 3rd) and leave holes for the melody: the Luminary “Blue Monk” card shows the chromatic line in tenths.',
  ], ex: [['B♭7 shells moving to E♭7', '=Bb2 Ab3 D4 | Eb3 Db4 G4 | Bb2 Ab3 D4'], ['The crushed blues 3rd', '=Ab3 Db4 D4']] },
] },

{ id: 'ir-bluebossa', name: 'Blue Bossa', cards: [
  { t: 'Blue Bossa: the map', s: 'Kenny Dorham · C minor · 16 bars', comp: { chart: 'C:m7 | % | F:m7 | % | D:m7b5 | G:7b9 | C:m7 | % | Eb:m7 | Ab:7 | Db:maj7 | % | D:m7b5 | G:7b9 | C:m7 | D:m7b5 G:7b9', bpm: 130 }, b: [
    'Sixteen bars, two keys: C minor and D♭ major.',
    '- Bars 1–8: <b>Cm7 – Fm7</b> (i – iv), then the minor ii–V–i, <b>Dø7 – G7 – Cm7</b>',
    '- Bars 9–12: a major ii–V–I a half step up, <b>E♭m7 – A♭7 – D♭maj7</b>. D♭ is ♭II of C minor: the Neapolitan, the same move as the Moonlight Sonata, in bossa clothes',
    '- Bars 13–16: back through <b>Dø7 – G7 – Cm7</b>, and a turnaround',
    'The whole tune is the minor ii–V–i and the major ii–V–I, side by side. That’s why it’s everyone’s first Latin tune.',
    listen(A(SP + 'track/7x3mLS02eLiHw18Inohisj', 'Joe Henderson with Kenny Dorham'), A(SP + 'search/Blue%20Bossa%20Milt%20Jackson%20Joe%20Pass', 'Joe Pass, Milt Jackson and Ray Brown (The Big 3)'), 'the minor ii–V–i, and the guitar comping under the vibes.'),
  ], ex: [['Minor ii–V–i', 'D:m7b5 G:7b9 C:m7'], ['Major ii–V–I, a half step up', 'Eb:m7 Ab:7 Db:maj7']] },
  { t: 'Blue Bossa: scales and targets', s: 'two keys, one scale each', b: [
    '- <b>Bars 1–4</b>: C Dorian or Aeolian. Over Fm7, the same notes (C Aeolian is F Dorian)',
    '- <b>Dø7 – G7</b>: C harmonic minor. Its B natural and A♭ are the sound of the minor V',
    '- <b>E♭m7 – A♭7 – D♭maj7</b>: D♭ major. From C minor only two notes change: D becomes D♭, G becomes G♭',
    '- <b>Target notes</b>: land on the 3rd of each new chord: E♭ (Cm7), A♭ (Fm7), B (G7), G♭ (E♭m7), C (A♭7), F (D♭maj7)',
    'The modulation is the place to show you know where you are: play D♭maj7’s 3rd (F) on the downbeat of bar 11.',
  ], ex: [['3rds: Cm7, Fm7, G7, E♭m7, A♭7, D♭maj7', '=Eb4 | Ab4 | B3 | Gb4 | C5 | F4', 'targets']] },
  { t: 'Blue Bossa: comping under a soloist', s: 'what Joe Pass does under the vibes', b: [
    '- <b>Small voicings, mid-register</b>: three or four notes on the middle strings, out of the bass player’s and the soloist’s way',
    '- <b>The bossa pattern</b>, or swing it as Pass does with Milt Jackson: short chords on the off-beats, then a long one',
    '- <b>Move the top voice</b>: on Cm7 (two bars) go Cm7 → Cm6 → Cm7 → Cm9, one note moving',
    '- <b>Answer the soloist</b>: when the vibes rest, fill; when they play, lay out',
    'Record a chorus of comping with iReal (drums and bass only), then solo over your own comping.',
  ], ex: [['One note moving on Cm', 'C:m7 C:m6 C:m7 C:m9']] },
] },

{ id: 'ir-autumn', name: 'Autumn Leaves', cards: [
  { t: 'Autumn Leaves: the map', s: 'Kosma · G minor · AAB', comp: { chart: 'C:m7 | F:7 | Bb:maj7 | Eb:maj7 | A:m7b5 | D:7b9 | G:m6 | % | A:m7b5 | D:7b9 | G:m6 | % | C:m7 | F:7 | Bb:maj7 | Eb:maj7 | A:m7b5 | D:7b9 | G:m7 C:7 | F:m7 Bb:7 | Eb:maj7 | A:m7b5 D:7b9 | G:m6 | %', bpm: 120 }, b: [
    'Almost every bar is part of a ii–V–I, either to B♭ major or to its relative, G minor.',
    '- <b>Cm7 – F7 – B♭maj7</b>: ii–V–I in B♭ · <b>E♭maj7</b>: IV of B♭, which is also VI of G minor: the hinge',
    '- <b>Aø7 – D7♭9 – Gm</b>: the minor ii–V–i in G minor',
    '- The A section is played twice; the last part (B) starts with the minor ii–V, then the major',
    '- The end: <b>Gm7 – C7 – Fm7 – B♭7 – E♭maj7</b>, two ii–Vs a whole step apart sliding down to E♭, then home to G minor',
    listen(A(SP + 'track/4ytHu7iktfReuGL6UCgvKS', 'Cannonball Adderley with Miles Davis'), A(SP + 'album/0fSBLnMrUewblIXtLDLtAx', 'Jim Hall and Ron Carter (Alone Together)'), 'major and minor cadences joined up, and Hall’s chords under Carter’s bass solo.'),
  ], ex: [['Major, then minor', 'C:m7 F:7 Bb:maj7 Eb:maj7 A:m7b5 D:7b9 G:m6'], ['The sliding ii–Vs', 'G:m7 C:7 F:m7 Bb:7 Eb:maj7']] },
  { t: 'Autumn Leaves: the guide-tone line', s: '3rds and 7ths, one step at a time', b: [
    'Play only the 3rd and 7th of each chord. Because the roots fall in 5ths, the 7th of each chord falls a step to the 3rd of the next, and the 3rd stays to become the next 7th.',
    '- Cm7 (E♭, B♭) → F7 (E♭, A) → B♭maj7 (D, A) → E♭maj7 (D, G) → Aø7 (C, G) → D7 (C, F♯) → Gm7 (B♭, F)',
    '- One note moves each time, by a step. That line is the tune’s inner melody',
    '- On guitar: the 3rd and 7th on the D and G strings (or A and D), moving a fret or two',
    '<b>Harder</b>: add the root on the 6th or 5th string, so it’s a three-note shell, then solo using only guide tones on the downbeats.',
  ], ex: [['Guide tones through the A section', '=Eb3 Bb3 | Eb3 A3 | D3 A3 | D3 G3 | C3 G3 | C3 F#3 | Bb2 F3', '3rd and 7th']] },
  { t: 'Autumn Leaves: scales and comping', s: 'two scales cover it', b: [
    '- <b>B♭ major</b> over Cm7 – F7 – B♭maj7 – E♭maj7 (one scale, four chords)',
    '- <b>G harmonic minor</b> over Aø7 – D7 – Gm (its F♯ is the sound of the minor V)',
    '- That’s it: the tune is two keys that share all but one note (F against F♯)',
    '- <b>Jim Hall’s comping</b> under Carter: light, mid-register, a lot of rests, inner voices moving. He changes the voicing on long chords rather than restriking the same one',
    'Comp one chorus as Hall does: no more than two chords a bar, and change one note of each held chord.',
  ] },
] },

{ id: 'ir-satindoll', name: 'Satin Doll', cards: [
  { t: 'Satin Doll: the map', s: 'Ellington and Strayhorn · C · AABA', comp: { chart: 'D:m7 G:7 | D:m7 G:7 | E:m7 A:7 | E:m7 A:7 | A:m7 D:7 | Ab:m7 Db:7 | C:6 | % | G:m7 | C:7 | F:maj7 | % | A:m7 | D:7 | D:m7 | G:7', bpm: 120 }, b: [
    'A tune made of ii–Vs that don’t resolve where you expect.',
    '- <b>Dm7 – G7</b> twice, then <b>Em7 – A7</b> twice: the same shape up a whole step. Neither goes to its I',
    '- <b>Am7 – D7</b>, then <b>A♭m7 – D♭7</b> a half step lower (D♭7 is the tritone sub of G7), then home to <b>C</b>',
    '- Bridge: <b>Gm7 – C7 – Fmaj7</b> (ii–V–I to IV), then <b>Am7 – D7</b> (a ii–V to G that doesn’t land), <b>Dm7 – G7</b> back to the top',
    listen(A(SP + 'track/33JqqJanlRvypk6ezu4Jrs', 'Duke Ellington'), A(SP + 'search/Satin%20Doll%20Kenny%20Burrell%20Lotus%20Blossom', 'Kenny Burrell (Lotus Blossom)'), 'short ii–Vs and a relaxed, repeatable swing.'),
  ], ex: [['ii–Vs climbing', 'D:m7 G:7 D:m7 G:7 E:m7 A:7 E:m7 A:7'], ['Chromatic ii–Vs home', 'A:m7 D:7 Ab:m7 Db:7 C:6'], ['The bridge: ii–V–I to IV', 'G:m7 C:7 F:maj7']] },
  { t: 'Satin Doll: play the ii–Vs as one', s: 'one shape, moved', b: [
    'Each chord lasts two beats. Treat every pair as one sound, the V7, and the tune gets simpler: G7, G7, A7, A7, D7, D♭7, C.',
    '- Comping: one drop-2 ii–V shape (Dm7 → G7, one note falls), moved up a whole step for Em7 – A7, then down by half steps',
    '- Soloing: one idea over Dm7 – G7, the same idea a whole step up over Em7 – A7. Ellington’s melody does exactly this',
    '- The half-step ii–Vs (Am7 D7 → A♭m7 D♭7): slide the shape down a fret',
    'Burrell plays it with a light swing and lots of repeated riffs: find one two-bar riff and move it with the changes.',
  ], ex: [['One shape, moved', 'D:m7 G:7 E:m7 A:7 A:m7 D:7 Ab:m7 Db:7 C:maj7']] },
] },

{ id: 'ir-another', name: 'There Will Never Be Another You', cards: [
  { t: 'Another You: the map', s: 'Harry Warren · E♭ · ABAC', comp: { chart: 'Eb:maj7 | % | D:m7b5 | G:7b9 | C:m7 | % | Bb:m7 | Eb:7 | Ab:maj7 | Db:7 | Eb:maj7 | C:m7 | F:7 | % | F:m7 | Bb:7', bpm: 140 }, b: [
    'Thirty-two bars, and nearly every move in it is a standard one, which is why it’s a session favourite.',
    '- <b>E♭maj7 – Dø7 – G7 – Cm7</b>: I, then a minor ii–V to vi',
    '- <b>B♭m7 – E♭7 – A♭maj7</b>: ii–V–I to IV (E♭maj7 becomes E♭7 by changing one note)',
    '- <b>A♭maj7 – D♭7 – E♭maj7</b>: IV, then the backdoor dominant (♭VII7) home: the sound of the tune',
    '- <b>Cm7 – F7 – Fm7 – B♭7</b>: vi, then II7 (V of V) for two bars, then ii–V home',
    'The second half repeats the first eight bars, then ends differently with the same moves (IV, ♭VII7, I, ii–V–I).',
    listen(A(SP + 'track/0IsH0B6seYDMqaEnB2PHOn', 'Chet Baker (vocal)'), A(SP + 'search/There%20Will%20Never%20Be%20Another%20You%20Kenny%20Burrell', 'Kenny Burrell (Lotus Blossom)'), 'the sung phrasing, then make your changes support those phrases.'),
  ], ex: [['Minor ii–V to vi', 'Eb:maj7 D:m7b5 G:7b9 C:m7'], ['ii–V to IV, then the backdoor home', 'Bb:m7 Eb:7 Ab:maj7 Db:7 Eb:maj7'], ['II7, then ii–V home', 'F:7 F:m7 Bb:7 Eb:maj7']] },
  { t: 'Another You: phrase like a singer', s: 'what Chet Baker shows', b: [
    '- Learn the melody by singing it with the Chet record. Its phrases start after the downbeat and leave the end of each eight bars empty',
    '- Comp so the chord changes land <i>with</i> the singer’s phrases: change chord a beat early (anticipate) as the melody moves to the next phrase',
    '- Over the backdoor D♭7, play D♭7’s ♯11 and 9 (G and E♭): they’re notes of E♭ major, so the line stays smooth',
    '- Over F7 (II7) for two bars: F Mixolydian, or bring in the ♯11 (B natural): F Lydian dominant',
    'Then solo in phrases the length of the melody’s, and breathe where Chet breathes.',
  ], ex: [['D♭7 with the ♯11 on top', 'Ab:maj7 Db:7#11 Eb:maj7']] },
] },

{ id: 'ir-wine', name: 'Days of Wine and Roses', cards: [
  { t: 'Days of Wine and Roses: map', s: 'Mancini · F · ABAC', comp: { chart: 'F:maj7 | Eb:7#11 | A:m7 | D:7b9 | G:m7 | % | Eb:7 | % | A:m7 | D:m7 | G:m7 | G:m7/b7 | E:m7b5 A:7b9 | D:m7 G:7 | G:m7 | C:7', bpm: 120 }, b: [
    'It opens with a surprise: straight from Fmaj7 to <b>E♭7</b>, ♭VII7 borrowed from F minor, with the melody holding a note that’s E♭7’s ♯11.',
    '- <b>Am7 – D7♭9 – Gm7</b>: iii – VI7 – ii, falling in 5ths',
    '- <b>E♭7</b> again, now resolving to <b>Am7</b> (iii, standing in for I). Many players put B♭m7 before it: iv – ♭VII7, the backdoor',
    '- Bars 9–16: <b>Am7 – Dm7 – Gm7</b> in 4ths, the bass stepping down to F, then <b>Eø7 – A7</b> (ii–V to vi), <b>Dm7 – G7</b> (V of V), <b>Gm7 – C7</b>',
    '- The last eight: <b>Am7 – Dm7, Bø7 – E7</b> (ii–V to iii), <b>Am7 – Dm7 – Gm7 – C7 – F</b>: down the cycle home',
    listen(A(SP + 'album/7BVfV9OGD9tYdy7Jr5JLbt', 'Oscar Peterson (We Get Requests)'), A(SP + 'track/3eo240NAKE7AQ9NJAcqokl', 'Wes Montgomery (Boss Guitar)'), 'smooth voice leading through the changing colours.'),
  ], ex: [['I – ♭VII7: the opening colour', 'F:maj7 Eb:7#11 A:m7 D:7b9 G:m7'], ['The ending, down the cycle', 'A:m7 D:m7 B:m7b5 E:7b9 A:m7 D:m7 G:m7 C:7 F:6']] },
  { t: 'Wine and Roses: voice leading', s: 'make the colours connect', b: [
    '- <b>Fmaj7 → E♭7♯11</b>: keep A on top: Fmaj7’s 3rd becomes E♭7’s ♯11. Under it, F steps down to E♭, C up to D♭, E up to G. The top holds and the colour changes completely',
    '- <b>Am7 → D7♭9 → Gm7</b>: the guide-tone line (7th falls to 3rd), as in Autumn Leaves',
    '- <b>E♭7 for two bars</b>: E♭ Lydian dominant (the notes of B♭ melodic minor): it keeps F major’s A and C over the borrowed chord',
    '- <b>Wes</b> plays the melody in octaves and his solos build from single notes to octaves to block chords: practise the A section in octaves',
    'Drill: drop-2 voicings with the top note moving no more than a step between chords.',
  ], ex: [['Fmaj7 to E♭7♯11, the top note held', '=F3 C4 E4 A4 | Eb3 Db4 G4 A4', 'Fmaj7 · E♭7♯11']] },
] },

{ id: 'ir-misty', name: 'Misty', cards: [
  { t: 'Misty: the map', s: 'Erroll Garner · E♭ · AABA ballad', comp: { chart: 'Eb:maj7 | Bb:m7 Eb:7 | Ab:maj7 | Ab:m7 Db:7 | Eb:maj7 C:m7 | F:m7 Bb:7 | G:m7 C:7 | F:m7 Bb:7', bpm: 60 }, b: [
    'Eight bars that hold most of jazz harmony:',
    '- <b>E♭maj7 – B♭m7 – E♭7 – A♭maj7</b>: I, then ii–V–I to IV',
    '- <b>A♭m7 – D♭7 – E♭</b>: iv – ♭VII7, the backdoor home (minor iv borrowed from E♭ minor)',
    '- <b>E♭ – Cm7 – Fm7 – B♭7</b>: I – vi – ii – V; then <b>Gm7 – C7 – Fm7 – B♭7</b>, iii – VI7 – ii – V: the long turnaround',
    '- The bridge goes to A♭ (IV) by its ii–V (<b>B♭m7 – E♭7 – A♭maj7</b>), then a ii–V a half step up (<b>Am7 – D7</b>) and a chain of ii–Vs back down to E♭',
    listen(A(SP + 'track/6gymGoFmu2IA7JPjezmDkn', 'Erroll Garner'), A(SP + 'track/47x9b5GE4UTzNqq6uQ86SQ', 'Wes Montgomery and the Wynton Kelly Trio (Half Note)'), 'ballad time, sustained melody notes, and restrained chord placement.'),
  ], ex: [['ii–V to IV, then iv – ♭VII7 home', 'Eb:maj7 Bb:m7 Eb:7 Ab:maj7 Ab:m7 Db:7 Eb:maj7'], ['The long turnaround', 'Eb:maj7 C:m7 F:m7 Bb:7 G:m7 C:7 F:m7 Bb:7']] },
  { t: 'Misty: ballad time', s: 'fewer chords, placed well', b: [
    '- <b>Garner’s left hand</b> plays steady quarter-note chords like a rhythm guitarist, while the right hand drags the melody behind the beat. Try it: steady comping, a lazy melody',
    '- At a slow tempo, feel the 8ths: count “1-and-2-and” so the chords land exactly',
    '- <b>Restraint</b>: one chord per chord symbol, placed on the beat and held. Let the sustained melody notes ring over them',
    '- The ♭VII7 (D♭7) and VI7 (C7) are where the colour is: try D♭9 and C7♭9',
    'Comp it with iReal at 60 bpm: whole notes, then half notes, then Garner’s quarters.',
  ], ex: [['Colour on the dominants', 'Ab:m7 Db:9 Eb:maj7 C:7b9 F:m7 Bb:13']] },
] },

{ id: 'ir-valentine', name: 'My Funny Valentine', cards: [
  { t: 'My Funny Valentine: the map', s: 'Rodgers and Hart · C minor · AABA', comp: { chart: 'C:min | C:mMaj7/7 | C:m7/b7 | C:m6/6 | Ab:maj7 | F:m7 | D:m7b5 | G:7b9', bpm: 70 }, b: [
    'It opens on the <b>minor line cliché</b>: a C minor chord held while one voice falls a half step at a time, C, B, B♭, A.',
    '- <b>Cm – Cm(maj7) – Cm7 – Cm6</b>: the same chord, its top (or bass) voice falling. Often written as slash chords: Cm, Cm/B, Cm/B♭, Cm/A',
    '- <b>A♭maj7 – Fm7 – Dø7 – G7</b>: VI, iv, then the minor ii–V back to C minor',
    '- The second A turns towards E♭ major (the relative major); the bridge sits in E♭, moving E♭maj7 – Fm7 – Gm7 – Fm7, a melody in chords; the last A is longer and ends with the line cliché again',
    listen(A(SP + 'track/0MfK7lsLUvMq2CURkt61uF', 'the Miles Davis Quintet (Cookin’)'), A(SP + 'track/28zHqk0hj28G0IgmpL4FRL', 'Bill Evans and Jim Hall (Undercurrent)'), 'two contrasting treatments, and how Hall accompanies Evans.'),
  ], ex: [['The line cliché', 'C:min C:mMaj7/7 C:m7/b7 C:m6/6'], ['Into the minor ii–V', 'Ab:maj7 F:m7 D:m7b5 G:7b9 C:min']] },
  { t: 'Valentine: the line cliché on guitar', s: 'one voice moves', b: [
    'Hold a Cm grip and move one note down by half steps: C, B, B♭, A.',
    '- In the bass: Cm (x3555x), then only the 5th string moves: x2555x (Cm/B), x1555x (Cm/B♭), x0555x (Cm/A)',
    '- Inside: the 8th-fret Cm barre (8 10 10 8 8 8), and the C on the 4th string (10th fret) falls to frets 9, 8, 7',
    '- Over it, play C melodic minor on bar 2 (the B natural) and C Dorian on bar 4 (the A natural)',
    '<b>Jim Hall under Evans</b>: in Undercurrent the two take turns: one plays, the other answers, never both busy. Comp a chorus where you only play in the melody’s gaps.',
  ], ex: [['The cliché in the bass', '=C3 G3 C4 Eb4 | B2 G3 C4 Eb4 | Bb2 G3 C4 Eb4 | A2 G3 C4 Eb4', 'Cm · Cm/B · Cm/B♭ · Cm/A']] },
] },

{ id: 'ir-allthings', name: 'All the Things You Are', cards: [
  { t: 'All the Things: the map', s: 'Jerome Kern · A♭ · 36 bars', comp: { chart: 'F:m7 | Bb:m7 | Eb:7 | Ab:maj7 | Db:maj7 | G:7 | C:maj7 | % | C:m7 | F:m7 | Bb:7 | Eb:maj7 | Ab:maj7 | D:7 | G:maj7 | % | A:m7 | D:7 | G:maj7 | % | F#:m7 | B:7 | E:maj7 | C:7#5', bpm: 140 }, b: [
    'The tune walks round the cycle of 5ths, changing key every eight bars.',
    '- <b>A1</b>: Fm7 – B♭m7 – E♭7 – A♭maj7 – D♭maj7 (down in 5ths through A♭), then <b>G7 – Cmaj7</b>: a V–I into C',
    '- <b>A2</b>: the same, a 5th lower: Cm7 – Fm7 – B♭7 – E♭maj7 – A♭maj7, then <b>D7 – Gmaj7</b> into G',
    '- <b>Bridge</b>: ii–V–I in G, then ii–V–I in E (a major 3rd down), then <b>C7♯5</b>, the V of Fm, back to the top',
    '- <b>A3</b> starts as A1, then goes D♭maj7 – D♭m7 (minor iv) – Cm7 – B°7 – B♭m7 – E♭7 – A♭maj7: a longer, chromatic way home',
    listen(A(SP + 'track/1BJCYbpcH0o7ENUcypWMbo', 'Charlie Parker and Dizzy Gillespie'), A(SP + 'album/15mqbWSQ1XtAtpx5JsRA3Y', 'Joe Pass (Virtuoso)'), 'the melody through the key changes; Pass’s solo version is a longer-term study.'),
  ], ex: [['A1: down the cycle into C', 'F:m7 Bb:m7 Eb:7 Ab:maj7 Db:maj7 G:7 C:maj7'], ['The bridge: G, then E', 'A:m7 D:7 G:maj7 F#:m7 B:7 E:maj7 C:7#5'], ['A3’s ending', 'Db:maj7 Db:m7 C:m7 B:dim7 Bb:m7 Eb:7 Ab:maj7']] },
  { t: 'All the Things: the pivots', s: 'how it changes key so smoothly', b: [
    '- The melody tends to sit on a note the old and new keys share while the key changes under it. Find those notes on the iReal chart',
    '- <b>D♭maj7 → G7</b>: a tritone apart, so the bass jumps, but D♭’s 3rd (F) stays as G7’s 7th and its 7th (C) slips down to B, G7’s 3rd',
    '- <b>Emaj7 → C7♯5 → Fm7</b>: E major’s 3rd, G♯, is the same note as A♭: the ♯5 of C7♯5 and the 3rd of Fm7. The famous pivot of the tune',
    '- <b>D♭m7</b> in A3: the minor iv, the darkest moment, just before home',
    'Practise each key centre as a scale for its bars: A♭ major (with C at the end), E♭ major (with G), G major, E major, then A♭. Five keys in one tune.',
  ], ex: [['Guide tones across the pivot', '=F3 C4 | F3 B3 | E3 B3', 'D♭maj7 → G7 → Cmaj7']] },
] },

{ id: 'ir-sunny', name: 'Sunny', cards: [
  { t: 'Sunny: the map', s: 'Bobby Hebb · E minor · four chords', comp: { chart: 'E:m7 | G:7 | C:maj7 | F#:m7b5 B:7b9', bpm: 110 }, b: [
    'Four bars, round and round:',
    '- <b>Em7</b>: i',
    '- <b>G7</b>: ♭III, made dominant so it points to C (V7 of VI)',
    '- <b>Cmaj7</b>: VI',
    '- <b>F♯ø7 – B7</b>: the minor ii–V back to Em',
    'It’s half of Autumn Leaves (ii–V–I to the relative major, then the minor ii–V home) squeezed into four bars. Hebb’s record moves the song up a half step for later verses, the classic way to lift a song that repeats.',
  ], ex: [['The loop', 'E:m7 G:7 C:maj7 F#:m7b5 B:7b9 E:m7'], ['Up a half step', 'F:m7 Ab:7 Db:maj7 G:m7b5 C:7b9 F:m7']] },
  { t: 'Sunny: play over it', s: 'pentatonic, then the changes', b: [
    '- <b>E minor pentatonic</b> works over all of it, apart from B7. That’s the soul-jazz start',
    '- Then make the changes: G7’s B and F (3rd and 7th) are the notes that point to C; B7’s D♯ is the note that points back to E',
    '- <b>Over B7</b>: E harmonic minor (D♯), or B7♭9 arpeggio',
    '- Groove: a straight-8ths soul feel. Comp with short, muted 16th-note chops on the off-beats, and a G7 to Cmaj7 that rings',
    'Then transpose the whole loop up a half step every 16 bars, as the record does.',
  ], ex: [['3rd and 7th: the guide tones', '=D3 G3 | B2 F3 | B2 E3 | A2 E3 | A2 D#3 | G2 D3', 'Em7 · G7 · Cmaj7 · F♯ø7 · B7 · Em7']] },
] },

{ id: 'ir-summertime', name: 'Summertime', cards: [
  { t: 'Summertime: the map', s: 'Gershwin · A minor · 16 bars', comp: { chart: 'A:m7 | B:m7b5 E:7b9 | A:m7 | A:m7 A:7 | D:m7 | F:7 | B:m7b5 | E:7b9 | A:m7 | B:m7b5 E:7b9 | A:m7 | D:7 G:7 | C:maj7 | B:m7b5 E:7b9 | A:m7 | B:m7b5 E:7b9', bpm: 90 }, b: [
    'Sixteen bars, a lot like a minor blues. This is the usual jazz chart; lead sheets vary, and Gershwin’s own harmony (in the opera) is richer.',
    '- <b>Line 1</b>: Am7 (i), the minor ii–V (Bø7 – E7), back to Am, which turns into <b>A7</b> to point at…',
    '- <b>Line 2</b>: <b>Dm7</b> (iv), <b>F7</b> (♭VI7, a dominant on the ♭6), then a long Bø7 – E7 home',
    '- <b>Line 3</b>: like line 1, but ends <b>D7 – G7</b>: V of V, then V of C, the relative major',
    '- <b>Line 4</b>: <b>Cmaj7</b> (III) for a moment, then Bø7 – E7 – Am and the turnaround',
  ], ex: [['i, minor ii–V, i turning to I7', 'A:m7 B:m7b5 E:7b9 A:m7 A:7 D:m7'], ['iv – ♭VI7 – iiø – V', 'D:m7 F:7 B:m7b5 E:7b9 A:m7'], ['To the relative major', 'D:7 G:7 C:maj7']] },
  { t: 'Summertime: play over it', s: 'blues first, then the changes', b: [
    '- <b>A minor pentatonic and blues</b> over most of it: it’s a minor blues at heart',
    '- <b>E7♭9</b>: A harmonic minor (G♯), every time it comes round',
    '- <b>A7 → Dm7</b>: the C♯ in A7 is the note that turns the music towards D minor; hit it',
    '- <b>F7</b>: F Lydian dominant (B natural), or just F7’s arpeggio: the E♭ against the A minor around it is the sound',
    '- <b>D7 – G7 – Cmaj7</b>: D7’s 3rd (F♯), G7’s 7th (F), Cmaj7’s 3rd (E): a falling guide-tone line',
    'Slow and swung, or as a bossa. Keep the melody’s long notes and its shape in your solo: it’s a lullaby.',
  ], ex: [['The F7 colour', 'D:m7 F:7 E:7b9 A:m7'], ['The falling guide tones', '=F#3 | F3 | E3', 'D7 · G7 · Cmaj7']] },
] },
];
