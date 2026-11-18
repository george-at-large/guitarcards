// The progressions worth memorising: a short list, with what each does and songs that use it. Charts are in the
// library's chart language (numerals against the tonic's major scale; minor: true reads them in the minor tonic).
// loop: true means it goes round and round (any rotation of it is the same loop). Songs are named for their changes
// only; no melodies or lyrics.
const P = (name, chart, note, songs = [], o = {}) => ({ name, chart, note, songs, ...o });
const M = { minor: true }, LOOP = { loop: true }, ML = { minor: true, loop: true };

export const PROG_GROUPS = [
  { id: 'major', name: 'Major keys', items: [
    P('I – IV – V – I', '| I:maj | IV:maj | V:maj | I:maj |', 'The three primary chords: home, away, tension, home. The bones of folk, rock and roll and country.', ['Twist and Shout', 'La Bamba', 'Johnny B. Goode (as a blues)']),
    P('I – V – vi – IV', '| I:maj | V:maj | vi:min | IV:maj |', 'The axis loop. Start it on vi (vi – IV – I – V) and the same four chords sound sad.', ['Let It Be', 'With or Without You', 'No Woman, No Cry', 'Don’t Stop Believin’', 'Someone Like You'], LOOP),
    P('I – vi – IV – V', '| I:maj | vi:min | IV:maj | V:maj |', 'The 50s or doo-wop loop: I to its relative minor, then IV and V.', ['Stand by Me', 'Earth Angel', 'Every Breath You Take', 'Heart and Soul'], LOOP),
    P('I – vi – ii – V', '| I:maj vi:m7 | ii:m7 V:7 |', 'The jazz version of the 50s loop: the standard turnaround at the end of a tune.', ['I Got Rhythm (A section)', 'Blue Moon', 'the end of countless standards'], LOOP),
    P('ii – V – I', '| ii:m7 | V:7 | I:maj7 | I:maj7 |', 'The jazz cadence: the 2nd chord, the dominant, home. The single most important move in jazz.', ['Autumn Leaves', 'Tune Up', 'Satin Doll', 'Honeysuckle Rose']),
    P('iii – vi – ii – V – I', '| iii:m7 | vi:m7 | ii:m7 V:7 | I:maj7 |', 'Roots falling by 5ths into I: the long turnaround.', ['I Got Rhythm (ending)', 'countless standards’ last bars']),
    P('The diatonic cycle: I – IV – vii – iii – vi – ii – V – I', '| I:maj7 | IV:maj7 | vii:m7b5 | iii:m7 | vi:m7 | ii:m7 | V:7 | I:maj7 |', 'Every chord of the key, roots falling by 5ths. In major or (from vi) in its relative minor.', ['Fly Me to the Moon', 'Autumn Leaves', 'I Will Survive (in minor)']),
    P('I – VI7 – ii – V', '| I:maj7 VI:7 | ii:m7 V:7 |', 'The turnaround with VI made dominant (V of ii): a stronger pull into ii.', ['All of Me', 'countless standards'], LOOP),
    P('III7 – VI7 – II7 – V7 – I', '| III:7 | VI:7 | II:7 | V:7 | I:maj |', 'Ragtime: a chain of dominants round the circle of 5ths. The rhythm-changes bridge.', ['Sweet Georgia Brown', 'Alice’s Restaurant', 'Salty Dog']),
    P('I – III7 – IV', '| I:maj | III:7 | IV:maj | IV:maj |', 'III made major (V of vi) and resolving deceptively to IV.', ['Creep (then iv)', 'Rag-time and old-time tunes']),
    P('I – I7 – IV – ♯iv° – I', '| I:maj | I:7 | IV:maj | #iv:dim7 | I:maj |', 'Gospel: I7 pushes to IV, then a diminished chord walks the bass back up.', ['the jazz blues, bar 6', 'gospel and soul endings']),
    P('I – I° – ii – V (passing diminished)', '| I:maj7 #i:dim7 | ii:m7 V:7 |', 'A diminished chord between I and ii: the bass climbs by half step.', ['Have You Met Miss Jones?', 'Ain’t Misbehavin’'], LOOP),
    P('Pachelbel: I – V – vi – iii – IV – I – IV – V', '| I:maj | V:maj | vi:min | iii:min | IV:maj | I:maj | IV:maj | V:maj |', 'The bass walks down the scale under it.', ['Canon in D', 'Basket Case', 'Don’t Look Back in Anger', 'Go West']),
    P('IVmaj7 – III7 – vi', '| IV:maj7 | III:7 | vi:m7 | vi:m7 |', 'The neo-soul turn: IV to the V of vi, landing on vi.', ['Just the Two of Us', 'many neo-soul and city-pop tunes'], LOOP),
    P('Tritone sub: ii – ♭II7 – I', '| ii:m7 | bII:7 | I:maj7 | I:maj7 |', 'V7 swapped for the dominant a tritone away: the bass slides down by half step into I.', ['The Girl from Ipanema', 'Satin Doll']),
    P('Line cliché in major: I – Imaj7 – I7 – I6', '| I:maj | I:maj7 | I:7 | I:6 |', 'One voice falls a half step at a time inside a held chord.', ['Something', 'Michelle (in minor)']),
  ] },
  { id: 'borrow', name: 'Borrowed chords in major (modal interchange)', blurb: 'Chords borrowed from the parallel minor (and its modes) into a major key: the most useful colours in pop and jazz.', items: [
    P('IV – iv – I (minor plagal)', '| I:maj | IV:maj | iv:min | I:maj |', 'IV turns minor on its way home: the 6th of the key falls to ♭6 then to 5. From the parallel minor.', ['In My Life', 'Creep', 'Nowhere Man']),
    P('I – ♭VII – IV – I', '| I:maj | bVII:maj | IV:maj | I:maj |', 'The double plagal: two falls of a 4th into I. ♭VII is from Mixolydian.', ['Hey Jude (coda)', 'Sympathy for the Devil', 'Sweet Child o’ Mine (verse)'], LOOP),
    P('♭VI – ♭VII – I', '| I:maj | bVI:maj | bVII:maj | I:maj |', 'The Aeolian cadence into a major I: triumphant. Both chords from the parallel minor.', ['the Super Mario level-clear fanfare', 'film and game endings', 'many rock endings']),
    P('Backdoor: iv7 – ♭VII7 – I', '| iv:m7 | bVII:7 | I:maj7 | I:maj7 |', 'Home by the back door: the minor iv and ♭VII7 instead of ii–V.', ['There Will Never Be Another You', 'Lady Bird', 'Misty']),
    P('I – ♭III – IV', '| I:maj | bIII:maj | IV:maj | IV:maj |', '♭III from the parallel minor: a bluesy, rocky shadow.', ['many rock riffs', 'Here’s That Rainy Day (as ♭IIImaj7)']),
    P('I – iv6 (the jazz minor plagal)', '| I:maj7 | IV:maj7 | iv:m6 | I:maj7 |', 'The minor iv with a 6th: it sounds half like V7♭9 and slips home.', ['countless standards', 'Misty (bars 3–4, as iv–♭VII7)']),
    P('I – ♭VI – ♭VII – I', '| I:maj | bVI:maj | bVII:maj | I:maj |', 'Two borrowed major chords stepping up into I.', ['video game victory themes', 'rock and anthem endings'], LOOP),
  ] },
  { id: 'minor', name: 'Minor keys', items: [
    P('i – iv – V – i', '| i:min | iv:min | V:7 | i:min |', 'The harmonic-minor cadence: V is made major for a leading tone.', ['Black Magic Woman (i–v–i–iv)', 'countless classical and folk tunes'], M),
    P('Minor ii – V – i', '| ii:m7b5 | V:7b9 | i:m6 | i:m6 |', 'The jazz cadence in minor: half-diminished ii, altered V, minor i.', ['Autumn Leaves', 'Blue Bossa', 'Softly, as in a Morning Sunrise', 'Alone Together'], M),
    P('Andalusian: i – ♭VII – ♭VI – V', '| i:min | bVII:maj | bVI:maj | V:maj |', 'A bass walking down from the tonic to the dominant: flamenco and rock.', ['Hit the Road Jack', 'Runaway', 'Walk Don’t Run', 'Smooth (as i–♭VI–V)'], ML),
    P('i – ♭VI – ♭III – ♭VII', '| i:min | bVI:maj | bIII:maj | bVII:maj |', 'The minor axis loop: the same four chords as I–V–vi–IV, started on the minor.', ['Zombie', 'Apologize', 'Numb'], ML),
    P('i – ♭VII – ♭VI – ♭VII', '| i:min | bVII:maj | bVI:maj | bVII:maj |', 'Aeolian rock: back and forth below the tonic.', ['All Along the Watchtower', 'Stairway to Heaven (closing section)'], ML),
    P('i – ♭VI – ♭VII – i', '| i:min | bVI:maj | bVII:maj | i:min |', 'Climbing back to the minor tonic from below: epic rock.', ['Livin’ on a Prayer', 'epic and power-metal choruses'], ML),
    P('Minor line cliché: i – i(maj7) – i7 – i6', '| i:min | i:mMaj7 | i:m7 | i:m6 |', 'One voice falls by half steps inside the minor chord.', ['My Funny Valentine', 'In a Sentimental Mood', 'Stairway to Heaven (intro)', 'Michelle'], M),
    P('The minor cycle: i – iv – ♭VII – ♭III – ♭VI – iiø – V – i', '| i:m7 | iv:m7 | bVII:7 | bIII:maj7 | bVI:maj7 | ii:m7b5 | V:7 | i:m7 |', 'Every chord of the minor key round the circle of 5ths.', ['I Will Survive', 'Autumn Leaves', 'Still Got the Blues'], M),
    P('i – ♭III – ♭VII – IV', '| i:min | bIII:maj | bVII:maj | IV:maj |', 'Dorian minor: the major IV is the Dorian note.', ['Boulevard of Broken Dreams'], ML),
    P('Minor turnaround: i – ♭VI7 – iiø – V7', '| i:m7 bVI:7 | ii:m7b5 V:7b9 |', 'The minor version of I–vi–ii–V, with ♭VI7 standing in for the vi.', ['minor jazz tunes’ last bars'], ML),
    P('Neapolitan: i – ♭II – V – i', '| i:min | bII:maj | V:7 | i:min |', 'The major chord on ♭2 as a dark pre-dominant.', ['Moonlight Sonata', 'classical cadences'], M),
    P('Picardy third: i – iv – V – I', '| i:min | iv:min | V:7 | I:maj |', 'A minor piece that ends on a major tonic.', ['Bach chorales', 'Greensleeves (some endings)'], M),
  ] },
  { id: 'modal', name: 'Modal vamps', blurb: 'Two chords, round and round: each mode has a vamp that brings out its one telltale note.', items: [
    P('Dorian: i – IV', '| i:m7 | IV:7 |', 'The major IV holds the Dorian natural 6.', ['Oye Como Va', 'Evil Ways', 'Moondance (as i–ii)', 'So What (one chord)'], ML),
    P('Mixolydian: I – ♭VII', '| I:maj | bVII:maj |', 'The ♭VII holds the Mixolydian ♭7.', ['Norwegian Wood', 'Sweet Home Alabama (I–♭VII–IV)', 'Gloria (I–♭VII–IV)'], LOOP),
    P('Lydian: I – II', '| I:maj7 | II:maj |', 'The major II holds the Lydian ♯4.', ['Flying in a Blue Dream', 'Dreams (Fleetwood Mac)', 'film themes that float'], LOOP),
    P('Phrygian: i – ♭II', '| i:min | bII:maj |', 'The ♭II a half step above: flamenco and metal.', ['White Rabbit', 'flamenco', 'Wherever I May Roam'], ML),
    P('Aeolian: i – ♭VI – ♭VII', '| i:min | bVI:maj | bVII:maj | i:min |', 'The ♭VI holds the Aeolian ♭6.', ['Livin’ on a Prayer', 'Losing My Religion (i–v–♭VI)'], ML),
    P('Ionian: I – IV', '| I:maj7 | IV:maj7 |', 'The plain major vamp.', ['Feelin’ Alright', 'countless gospel and pop vamps'], LOOP),
    P('Phrygian dominant: I – ♭II', '| I:maj | bII:maj |', 'The major I over a ♭II: the flamenco and klezmer sound (the 5th mode of harmonic minor).', ['Misirlou', 'Hava Nagila (as I–iv)'], LOOP),
  ] },
  { id: 'forms', name: 'Blues and jazz forms', items: [
    P('12-bar blues', '| I:7 | I:7 | I:7 | I:7 | IV:7 | IV:7 | I:7 | I:7 | V:7 | IV:7 | I:7 | V:7 |', 'I for four bars, IV for two, I for two, then V, IV, I and a turnaround.', ['Johnny B. Goode', 'Hound Dog', 'C Jam Blues', 'Pride and Joy']),
    P('Jazz blues', '| I:7 | IV:7 | I:7 | v:m7 I:7 | IV:7 | #iv:dim7 | I:7 | VI:7 | ii:m7 | V:7 | I:7 VI:7 | ii:m7 V:7 |', 'The 12-bar dressed in ii–Vs: IV in bar 2, ii–V into IV, ♯iv°, VI7 into ii–V.', ['Bags’ Groove', 'Straight, No Chaser', 'Tenor Madness', 'Now’s the Time']),
    P('Minor blues', '| i:m7 | i:m7 | i:m7 | i:m7 | iv:m7 | iv:m7 | i:m7 | i:m7 | bVI:7 | V:7 | i:m7 | V:7 |', 'i, iv, then ♭VI7 to V7.', ['Mr. P.C.', 'The Thrill Is Gone', 'Equinox'], M),
    P('Rhythm changes, A section', '| I:maj7 vi:m7 | ii:m7 V:7 | I:maj7 vi:m7 | ii:m7 V:7 | I:maj7 I:7 | IV:maj7 #iv:dim7 | I:maj7 V:7 | I:maj7 |', 'I–vi–ii–V twice, then I7 to IV and back. Usually in B♭.', ['I Got Rhythm', 'Oleo', 'Anthropology', 'Rhythm-a-Ning']),
    P('Rhythm changes, bridge', '| III:7 | III:7 | VI:7 | VI:7 | II:7 | II:7 | V:7 | V:7 |', 'Dominants round the circle, two bars each: III7, VI7, II7, V7.', ['I Got Rhythm', 'every rhythm-changes tune']),
    P('Coltrane changes', '| I:maj7 bIII:7 | bVI:maj7 VII:7 | III:maj7 | V:7 |', 'Three keys a major 3rd apart, joined by their V7s.', ['Giant Steps', 'Countdown', '26-2']),
  ] },
];
export const PROGS = PROG_GROUPS.flatMap((g) => g.items.map((p) => ({ ...p, group: g.id })));
