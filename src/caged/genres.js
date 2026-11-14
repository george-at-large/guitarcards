// Genres: the chords each style actually uses (as loops in the engine's chart language, numerals against the tonic's
// major scale), its strum pattern, the scales its players reach for, and a short guide to feel, rhythm, chords and
// soloing. Artists are named only as listening suggestions.
const G = (id, name, o) => ({ id, name, ...o });

export const GENRES = [
  G('blues', 'Blues', {
    rhythm: 'shuffle', tempo: [60, 110], scales: ['blues', 'min-pent', 'maj-blues', 'mixolydian', 'dom-pent'],
    charts: [
      '| I:7 | IV:7 | I:7 | I:7 | IV:7 | IV:7 | I:7 | I:7 | V:7 | IV:7 | I:7 | V:7 |',
      '| I:7 | I:7 | I:7 | I:7 | IV:7 | IV:7 | I:7 | I:7 | V:7 | IV:7 | I:7 | V:7 |',
      '| I:9 | IV:9 | I:9 | I:9 | IV:9 | IV:9 | I:9 | VI:7#9 | ii:m7 | V:7#9 | I:9 IV:9 | I:9 V:7#9 |',
      '| I:7 | V:7 | IV:7 | IV:7 | I:7 | V:7 | I:7 | V:7 |',
      '| i:m7 | i:m7 | i:m7 | i:m7 | iv:m7 | iv:m7 | i:m7 | i:m7 | bVI:7 | V:7 | i:m7 | V:7 |',
    ],
    guide: {
      feel: 'Swung: every pair of eighths is long–short. Laid back, behind the beat. Dominant 7th chords are home, not tension.',
      rhythm: 'The shuffle: a strum on every eighth, swung, accenting 2 and 4. On the low strings, the boogie: root–5th, root–6th, root–♭7 alternating with the palm half on the strings.',
      chords: 'Every chord a dominant 7th or 9th (I7, IV7, V7). The 12-bar is the form; quick change puts IV in bar 2. 7♯9 for grit, 9ths for a smoother sound.',
      solo: 'Minor pentatonic and the blues scale over everything; bend the ♭3 up towards the 3, and the 4 up to the 5. Mix in major pentatonic (or Mixolydian) over the I chord for sweetness. Leave space: call and response, short phrases, repeat a lick and vary its ending. Target the 3rd of each chord as it changes (the 3rd of IV is the ♭7 of I).',
      listen: 'B.B. King, Freddie King, Albert King, Stevie Ray Vaughan, T-Bone Walker.',
    },
  }),
  G('rock', 'Rock', {
    rhythm: 'eighths', tempo: [100, 150], scales: ['min-pent', 'blues', 'mixolydian', 'aeolian', 'dorian'],
    charts: [
      '| I:5 | bVII:5 | IV:5 | I:5 |',
      '| I:maj | IV:maj | V:maj | IV:maj |',
      '| i:5 | bVI:5 | bVII:5 | i:5 |',
      '| I:maj | bIII:maj | IV:maj | I:maj |',
      '| I:5 IV:5 | bIII:5 IV:5 | I:5 bVII:5 | IV:5 I:5 |',
    ],
    guide: {
      feel: 'Straight eighths, driving, on top of the beat. The ♭VII and ♭III borrowed from minor are what make it rock rather than pop.',
      rhythm: 'Steady down-strokes on every eighth (or down-up), palm-muting the verses and opening up for choruses. Accent 2 and 4 with the snare.',
      chords: 'Power chords (root and 5th, no 3rd) so distortion stays clean; open major chords for the anthems. I–♭VII–IV is the Mixolydian rock move.',
      solo: 'Minor pentatonic in the box, bends and vibrato doing the talking. Over major-key riffs, slide between minor and major pentatonic. Target chord roots on the downbeat, then move off them.',
      listen: 'AC/DC, Led Zeppelin, The Who, Foo Fighters, The Rolling Stones.',
    },
  }),
  G('pop', 'Pop', {
    rhythm: 'island', tempo: [80, 125], scales: ['maj-pent', 'ionian', 'min-pent', 'aeolian'],
    charts: [
      '| I:maj | V:maj | vi:min | IV:maj |',
      '| vi:min | IV:maj | I:maj | V:maj |',
      '| I:maj | vi:min | IV:maj | V:maj |',
      '| I:add9 | V:maj | vi:m7 | IV:maj7 |',
      '| IV:maj | I:maj | V:maj | vi:min |',
    ],
    guide: {
      feel: 'Straight and bright. The four chords of the axis in every rotation; the melody and the hook carry the song, the guitar supports.',
      rhythm: 'The “island” strum: down, down-up, up-down-up (1, 2&, &4&). Light wrist, loose arm, keep the hand moving down-up even when you miss the strings.',
      chords: 'I, V, vi, IV, often with add9 or maj7 colour and the 3rd on top. Open chords, a capo for the singer’s key.',
      solo: 'Melodic: major pentatonic, singable lines, mostly chord tones. Target the 3rd of each chord. Fewer notes, more shape.',
      listen: 'Ed Sheeran, Taylor Swift, John Mayer (pop side), Coldplay.',
    },
  }),
  G('funk', 'Funk', {
    rhythm: 'funk', tempo: [90, 115], scales: ['dorian', 'min-pent', 'mixolydian', 'dom-pent', 'm6-pent', 'blues'],
    charts: [
      '| i:m7 | i:m7 | IV:9 | IV:9 |',
      '| I:9 | I:9 | I:9 | IV:9 |',
      '| i:m9 | IV:9 | i:m9 | IV:9 |',
      '| I:7#9 | I:7#9 | bVII:9 | IV:9 |',
      '| i:m7 | bIII:maj7 | IV:9 | i:m7 |',
    ],
    guide: {
      feel: 'Sixteenth-note groove, everything on the one. The guitar is a drum: tight, percussive, mostly muted.',
      rhythm: 'Keep the hand moving in sixteenths the whole time; let only some strums ring and mute the rest with the fretting hand (“chicken scratch”). Short chord stabs on the & of beats, a big hit on 1.',
      chords: 'Small, high voicings: 9ths and m7s on the top four strings, often just three notes. One- or two-chord vamps (i7–IV9 is Dorian).',
      solo: 'Dorian and minor pentatonic with 16th-note rhythms; a single repeated note with a syncopated rhythm is funk. Target the 9 and 13 over dominants, the 6 over minor (Dorian colour).',
      listen: 'Nile Rodgers, James Brown’s guitarists (Jimmy Nolen), Prince, Cory Wong, Vulfpeck.',
    },
  }),
  G('jazz', 'Jazz (swing)', {
    rhythm: 'charleston', tempo: [100, 200], scales: ['dorian', 'mixolydian', 'ionian', 'bebop-dom', 'altered', 'lyd-dom', 'locrian-n2', 'dim-hw'],
    charts: [
      '| ii:m7 | V:7 | I:maj7 | I:maj7 |',
      '| I:maj7 vi:m7 | ii:m7 V:7 |',
      '| iii:m7 VI:7 | ii:m7 V:7 | I:maj7 | I:maj7 |',
      '| ii:m7b5 | V:7b9 | i:m6 | i:m6 |',
      '| I:maj7 vi:m7 | ii:m7 V:7 | I:maj7 I:7 | IV:maj7 iv:m7 | I:maj7 V:7 | I:maj7 |',
    ],
    guide: {
      feel: 'Swing eighths, the ride cymbal on 2 and 4. Harmony moves in ii–V–Is; each chord lasts a bar or half a bar.',
      rhythm: 'Comping: the Charleston (1 and the & of 2), short and crisp, anticipations into the next chord. Or Freddie Green: a short muted strum on every beat, three-note shells on the low strings.',
      chords: 'Sevenths always; shells (root–3–7) and drop 2 voicings; extensions (9, 13) and altered dominants (♭9, ♯9) for colour.',
      solo: 'Arpeggios first: outline each chord’s 1–3–5–7. Land on 3rds and 7ths on the beat (the guide tones), use chromatic approach notes from a half step below, bebop scales so chord tones fall on beats. Over V7 try altered or Lydian dominant.',
      listen: 'Wes Montgomery, Joe Pass, Jim Hall, Grant Green, Pat Martino.',
    },
  }),
  G('bossa', 'Bossa nova', {
    rhythm: 'bossa', tempo: [110, 140], scales: ['ionian', 'lydian', 'dorian', 'mixolydian', 'lyd-dom', 'altered'],
    charts: [
      '| I:maj7 | I:maj7 | II:7 | II:7 | ii:m7 | bII:7 | I:maj7 | bII:7 |',
      '| ii:m9 | V:13 | I:6/9 | I:6/9 |',
      '| i:m7 | IV:9 | i:m7 | IV:9 |',
      '| I:maj7 | vi:m7 | ii:m9 | V:7b9 |',
    ],
    guide: {
      feel: 'Gentle, straight eighths (not swung), quiet. Brazilian samba slowed down and whispered.',
      rhythm: 'Thumb plays the bass on 1 and 3 (root, then 5th); the fingers pluck the chord in a syncopated pattern over two bars, the classic bossa figure: 1, &2, &3 then 2, &3.',
      chords: 'Lush: maj7, m9, 13, 6/9, 7♯11 with smooth voice leading, often tritone subs (♭II7). Four-note voicings with the root on the 6th or 5th string.',
      solo: 'Melodic and sparse, mostly chord tones and extensions (9, 13). Lydian over maj7 and Lydian dominant over II7 are the sound.',
      listen: 'João Gilberto, Antônio Carlos Jobim, Baden Powell, Charlie Byrd.',
    },
  }),
  G('neosoul', 'Neo-soul / R&B', {
    rhythm: 'push', tempo: [65, 95], scales: ['dorian', 'ionian', 'lydian', 'min-pent', 'maj-pent', 'm6-pent'],
    charts: [
      '| IV:maj7 | iii:m7 | ii:m9 | I:maj9 |',
      '| ii:m9 | V:13 | iii:m7 | vi:m9 |',
      '| IV:maj7 | III:7 | vi:m7 | v:m7 I:7 |',
      '| I:maj9 | iv:m9 | iii:m7 | VI:7#9 |',
    ],
    guide: {
      feel: 'Slow, behind the beat, lazy sixteenths with a swing. Chords bloom; space matters.',
      rhythm: 'Push the chord changes (hit the next chord on the & of 4), let them ring, add hammer-ons and little fills between chords.',
      chords: 'maj9, m9, m11, 13 with the colour note on top; descending chromatic m7 chains; IVmaj7 to iii7. Small voicings on the top four strings, often with an embellishment hammered in.',
      solo: 'Double stops (3rds and 6ths), slides and hammer-ons around the chord shape; pentatonics with the 9 added. The Hendrix-to-Curtis Mayfield thumb-over style.',
      listen: 'D’Angelo, Erykah Badu, Isaiah Sharkey, Mark Lettieri, Tom Misch.',
    },
  }),
  G('gospel', 'Gospel', {
    rhythm: 'quarters', tempo: [65, 110], scales: ['maj-pent', 'maj-blues', 'mixolydian', 'ionian', 'dorian'],
    charts: [
      '| I:maj | I:maj/3 | IV:maj | #iv:dim7 | I:maj/5 | VI:7 | ii:m7 | V:7 |',
      '| IV:maj | iv:m6 | I:maj | VI:7 |',
      '| I:maj | IV:maj/1 | I:maj | V:7sus4 V:7 |',
      '| vi:m7 | II:7 | ii:m7 | V:7 |',
    ],
    guide: {
      feel: 'Big, warm, triplet-y. Walk-ups and passing chords between every change.',
      rhythm: 'Quarter-note or triplet strums, a strong backbeat; fills of passing diminished chords and inversions on the last beat of each bar.',
      chords: 'Inversions (I/3, I/5), passing ♯iv°7, secondary dominants (VI7), sus4–7 resolutions, the minor iv6 plagal sigh.',
      solo: 'Major pentatonic with the ♭3 blue note sliding into the 3; long sustained bends, call and response with the vocal line. Target the chord’s 3rd and the walking bass notes.',
      listen: 'Sister Rosetta Tharpe, the Staple Singers (Pops Staples), Kirk Franklin’s bands.',
    },
  }),
  G('country', 'Country', {
    rhythm: 'boomchick', tempo: [90, 140], scales: ['maj-pent', 'mixolydian', 'maj-blues', 'ionian', 'dom-pent'],
    charts: [
      '| I:maj | I:maj | IV:maj | I:maj | V:maj | V:maj | I:maj | I:maj |',
      '| I:maj | IV:maj | I:maj | V:maj |',
      '| I:maj | VI:7 | II:7 | V:7 |',
      '| I:maj | V:maj | IV:maj | I:maj |',
    ],
    guide: {
      feel: 'Bright, bouncy two-beat. Clean tone, twang.',
      rhythm: 'Boom-chick: bass note on 1 and 3 (root, then alternate to the 5th), strum the chord on 2 and 4. Hybrid picking (pick plus fingers) for chicken pickin’.',
      chords: 'Open major chords, I–IV–V, the occasional II7 or VI7 (ragtime country). Bass walk-ups between chords.',
      solo: 'Major pentatonic with the ♭3 hammered into the 3, double stops, bends behind the nut (pedal-steel imitations), Mixolydian over dominants. Target the 3rd of every chord.',
      listen: 'Brad Paisley, Vince Gill, Albert Lee, Chet Atkins, Brent Mason.',
    },
  }),
  G('folk', 'Folk / acoustic', {
    rhythm: 'island', tempo: [80, 120], scales: ['maj-pent', 'ionian', 'mixolydian', 'aeolian', 'dorian'],
    charts: [
      '| I:maj | IV:maj | I:maj | V:maj |',
      '| vi:min | IV:maj | I:maj | V:maj |',
      '| I:maj | iii:min | IV:maj | I:maj |',
      '| I:sus2 | IV:maj | I:maj | V:sus4 V:maj |',
    ],
    guide: {
      feel: 'Acoustic, open strings ringing. The song comes first.',
      rhythm: 'Down, down-up, up-down-up; or fingerpicking: thumb alternating bass on the beat, fingers on the top strings in between (Travis picking).',
      chords: 'Open chords with sus2, sus4 and add9 embellishments: lift or add a finger on the beat. Try the Open strings voicing set.',
      solo: 'Melodic fills between vocal lines: major pentatonic hammer-ons and pull-offs on open strings, Mixolydian for a Celtic tinge.',
      listen: 'Bob Dylan, Joni Mitchell, Nick Drake, Simon & Garfunkel, James Taylor.',
    },
  }),
  G('reggae', 'Reggae', {
    rhythm: 'offbeat', tempo: [65, 90], scales: ['min-pent', 'dorian', 'maj-pent', 'aeolian', 'mixolydian'],
    charts: [
      '| i:min | iv:min | i:min | iv:min |',
      '| I:maj | IV:maj | V:maj | IV:maj |',
      '| I:maj | ii:min | IV:maj | I:maj |',
      '| i:m7 | bVII:maj | bVI:maj | bVII:maj |',
    ],
    guide: {
      feel: 'One drop: the kick and snare on 3, a huge space on 1. Relaxed, heavy bass.',
      rhythm: 'The skank: a short, choked up- or down-stroke on the & of every beat (the off-beats), muted immediately by releasing the fretting hand. Never on the beat.',
      chords: 'Small triads on the top three or four strings, often minor two-chord vamps. Bass and drums carry the groove.',
      solo: 'Sparse minor-pentatonic melodies doubling the bass line; Dorian for the minor vamps. Echo and delay do half the work.',
      listen: 'Bob Marley and the Wailers (Al Anderson, Junior Marvin), Ernest Ranglin, Toots and the Maytals.',
    },
  }),
  G('metal', 'Metal', {
    minor: true, rhythm: 'eighths', tempo: [100, 200], scales: ['aeolian', 'phrygian', 'harm-min', 'phryg-dom', 'min-pent', 'blues', 'locrian'],
    charts: [
      '| i:5 | bVI:5 | bVII:5 | i:5 |',
      '| i:5 | bII:5 | i:5 | bII:5 |',
      '| i:5 | bIII:5 | bVII:5 | iv:5 |',
      '| i:5 | iv:5 | bVI:5 | V:5 |',
    ],
    guide: {
      feel: 'Heavy and tight, everything locked to the kick drum. Minor, Phrygian and harmonic minor darkness.',
      rhythm: 'Palm-muted down-picked eighths (or sixteenths) on the low string, the gallop (eighth plus two sixteenths), stops and accents with the drums.',
      chords: 'Power chords, ♭II and ♭VI borrowed for darkness (Phrygian), the tritone for menace. Low strings, often dropped tunings.',
      solo: 'Natural minor and harmonic minor (Phrygian dominant over V), fast alternate-picked runs, three-notes-per-string shapes, wide vibrato. Target the root and 5th on the downbeats, the ♭2 and ♭6 for darkness.',
      listen: 'Black Sabbath (Tony Iommi), Metallica, Iron Maiden, Ozzy’s Randy Rhoads, Megadeth.',
    },
  }),
  G('flamenco', 'Flamenco', {
    minor: true, rhythm: 'rumba', tempo: [90, 140], scales: ['phryg-dom', 'phrygian', 'harm-min', 'aeolian'],
    charts: [
      '| i:min | bVII:maj | bVI:maj | V:maj |',
      '| V:maj | bVI:maj | V:maj | bVI:maj |',
      '| iv:min | V:7 | i:min | i:min |',
      '| i:min | V:7 | i:min | V:7 |',
    ],
    guide: {
      feel: 'Fiery and percussive. The home chord is really the V (E major in A minor): the Phrygian dominant world.',
      rhythm: 'Rumba: strums on 1, the & of 2, 3, and 4, with a golpe (tap) or muted chuck on 2 and 4; rasgueado finger rolls on accents.',
      chords: 'The Andalusian cadence i–♭VII–♭VI–V, V with its ♭2 (♭VI–V), open-string voicings with the high strings ringing.',
      solo: 'Phrygian dominant over V (the ♭2 and major 3rd), harmonic minor over i; fast picado runs, hammer-on trills, landing on the root of V.',
      listen: 'Paco de Lucía, Vicente Amigo, Tomatito, the Gipsy Kings (rumba).',
    },
  }),
  G('latin', 'Latin (salsa, son)', {
    rhythm: 'tresillo', tempo: [90, 200], scales: ['ionian', 'mixolydian', 'harm-min', 'phryg-dom', 'dorian'],
    charts: [
      '| I:maj | IV:maj | V:7 | IV:maj |',
      '| ii:m7 | V:7 | I:maj7 | I:maj7 |',
      '| i:m7 | iv:m7 | V:7 | i:m7 |',
      '| I:maj | V:7 | V:7 | I:maj |',
    ],
    guide: {
      feel: 'Everything sits on the clave (3-2 or 2-3). Syncopated, dancing, bright.',
      rhythm: 'Tresillo (3-3-2) and montuno patterns: arpeggiated chord tones in a syncopated eighth-note loop, anticipating the next chord on the & of 4.',
      chords: 'I–IV–V–IV vamps (son montuno), minor ii–V–i with V7♭9, triads and simple sevenths.',
      solo: 'Major or harmonic minor (Phrygian dominant over V7 in minor), arpeggios, repeated syncopated figures that lock to the clave.',
      listen: 'Buena Vista Social Club (Compay Segundo), Santana, Yomo Toro.',
    },
  }),
  G('indie', 'Indie / dream pop', {
    rhythm: 'ring', tempo: [80, 130], scales: ['lydian', 'ionian', 'mixolydian', 'maj-pent', 'aeolian'],
    charts: [
      '| I:maj7 | IV:maj7 |',
      '| I:add9 | iii:m7 | vi:m7 | IV:maj7 |',
      '| I:maj | bVII:maj | IV:maj | I:maj |',
      '| vi:min | I:maj | IV:maj | IV:maj |',
      '| I:maj | II:maj | IV:maj | I:maj |',
    ],
    guide: {
      feel: 'Atmospheric, chiming, lots of reverb and delay. Chords ring together.',
      rhythm: 'Let chords ring, or arpeggiate them in eighths across the strings; driving eighths for the upbeat songs.',
      chords: 'maj7 and add9, the Lydian II–IV lift, open strings over moving shapes (try the Open strings voicing set).',
      solo: 'Melodic lines, slide and tremolo, Lydian and major pentatonic; fewer notes, more sound.',
      listen: 'The Smiths (Johnny Marr), Radiohead, Beach House, Mac DeMarco, Wild Nothing.',
    },
  }),
  G('punk', 'Punk', {
    rhythm: 'eighths', tempo: [150, 200], scales: ['min-pent', 'maj-pent', 'aeolian', 'ionian'],
    charts: [
      '| I:5 | IV:5 | V:5 | IV:5 |',
      '| I:5 | V:5 | vi:5 | IV:5 |',
      '| I:5 | bIII:5 | IV:5 | I:5 |',
    ],
    guide: {
      feel: 'Fast, loud, simple, energetic.',
      rhythm: 'All down-strokes on eighths, palm-muted in verses, open in choruses. Stamina matters: relax the arm.',
      chords: 'Power chords with the root on the 6th and 5th strings, moving fast.',
      solo: 'Short and melodic, often the vocal line doubled or a minor-pentatonic burst.',
      listen: 'Ramones, Green Day, The Clash, Buzzcocks.',
    },
  }),
];
export const genreById = (id) => GENRES.find((g) => g.id === id) || GENRES[0];
