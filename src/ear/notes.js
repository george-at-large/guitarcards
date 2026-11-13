// "Learn more" after a round: what the progression is (for the named ones), then each chord: its job in the key, where
// a chromatic chord comes from, how the root (and bass) moves, and how many notes it keeps from the chord before.
import { chordOf, label, nameIn } from './progressions.js';

export const ABOUT = {
  'Three-chord rock': 'The three major chords of a key: home, away (IV) and tension (V). Most of early rock and roll, folk and country lives here.',
  'I–IV–V–IV': 'V doesn’t resolve home but falls back to IV, a rock habit that keeps the loop open and swaggering rather than cadencing.',
  'Plagal vamp': 'I and IV rocking back and forth: no dominant, so no leading note pulling home. The “amen” of hymns, and the sound of gospel and soul vamps.',
  'Authentic cadence': 'Pre-dominant (IV), dominant (V7), tonic: the strongest way home. V7’s 3rd (the leading note) rises a half step to the root; its 7th falls to the 3rd.',
  'Half cadence': 'The phrase stops on V, like a question. You expect the answer, I, next.',
  'The axis': 'The most-used loop in pop since the 2000s. Two tonic-family chords (I, vi) and the two others (V, IV): each move keeps at least one note.',
  'The axis from vi': 'The same four chords started on vi: the loop now sounds minor and wistful, because the ear takes the first chord as home.',
  'The axis from IV': 'The same four chords started on IV: it opens with a lift, lands on I in the middle and ends on the minor chord.',
  'Doo-wop (the 50s progression)': 'I–vi–IV–V: the ballad loop of the 1950s. vi softens the move away from home; V turns back to I.',
  'Pop deceptive': 'V goes to vi instead of I: the tonic’s minor neighbour, which shares two of its notes. It sounds like an arrival that isn’t quite home.',
  'Knockin’ on Heaven’s Door': 'Two plain answers to I: first V–ii (open), then V–IV (folky, plagal). ii is the only minor chord, and it carries the colour.',
  'Pachelbel’s Canon': 'A descending bass, I–V/3–vi–iii–IV–I/3–IV–V in its smoothest form: roots fall a 4th and rise a step, again and again. Hundreds of songs borrow it.',
  'Diatonic circle of fifths': 'Every diatonic chord, each root a 5th below the last (I–IV–vii°–iii–vi–ii–V–I). It’s the engine of Baroque sequences and of many standards.',
  'I–vi–ii–V': 'The turnaround: from home, through the relative minor and the pre-dominant to V, then back. The roots fall in 5ths from vi.',
  'I–IV–ii–V': 'Two pre-dominants in a row (IV, then ii, which shares two of its notes), before V: a gentle way to the dominant.',
  'Andalusian cadence': 'A minor key’s bass walking down to the dominant: i–♭VII–♭VI–V. The last chord is major (the harmonic-minor V), which gives the flamenco bite.',
  'Aeolian rock': 'Natural minor with no leading note: i–♭VII–♭VI–♭VII. It never pulls home hard, so it can loop forever.',
  'Aeolian i–♭VI–♭VII': 'The “epic” minor loop: ♭VI and ♭VII climb by step back to i, with no V at all.',
  'Minor four chords': 'The same four chords as the axis, heard from the minor tonic: i–♭VI–♭III–♭VII.',
  'Harmonic-minor cadence': 'In minor, V is made major (borrowing the leading note from harmonic minor) so it pulls home as strongly as in major.',
  'Natural-minor cadence': 'With a minor v there’s no leading note: the cadence is softer and modal, like folk and early music.',
  'Mixolydian rock': '♭VII instead of V: the major key with a flattened 7th. It feels home-like and bluesy rather than tense.',
  'Sweet Home Alabama': 'I–♭VII–IV: a Mixolydian loop where every chord is major and the “dominant” is a whole step below home.',
  'Hey Joe': 'A chain of 5ths climbing to I: ♭VI–♭III–♭VII–IV–I. Each chord is the IV of the next.',
  'Dorian vamp': 'Minor i with a major IV: the raised 6th of the Dorian mode, which brightens the minor key.',
  'Phrygian vamp': 'i and ♭II a half step above: the flattened 2nd of the Phrygian mode. It’s the flamenco and metal sound.',
  'Lydian vamp': 'I and II (major): the raised 4th of Lydian, the floating, dreamy major.',
  'House of the Rising Sun': 'A minor key with a Dorian IV (major) and the borrowed ♭VI, turning on the major V.',
  'Smells Like Teen Spirit': 'Four chords in two pairs a 4th apart: i–iv, then ♭III–♭VI. Power chords in the original; here heard as triads.',
  'Major ii–V–I': 'The core of jazz harmony. Guide tones: the 7th of ii falls to the 3rd of V; the 7th of V falls to the 3rd of I.',
  'Minor ii–V–i': 'In minor: a half-diminished ii, a V7 with ♭9 (from harmonic minor), and a minor tonic (m6 or m7).',
  'iii–vi–ii–V–I': 'The turnaround from further back: four roots falling in 5ths, all minor 7ths then V7.',
  'The Royal Road': 'IVmaj7–V7–iii7–vi: J-pop’s favourite progression. It never touches I; iii7 is a soft stand-in for home.',
  'Dorian vamp in sevenths': 'i7 to IV7: the Dorian major 6th in the IV chord’s 3rd. Latin and jazz-funk vamps.',
  '12-bar blues': 'Every chord a dominant 7th, so none is fully at rest: four bars of I, two of IV, two of I, then V–IV–I and a turnaround to V.',
  'Quick-change blues': 'The 12-bar with IV in bar 2: an early visit to IV, then home.',
  '8-bar blues': 'The short form: I–V–IV, then home, with V7 as the turnaround.',
  'My Girl': 'I and ii rocking: a gentle step up and back, no dominant at all.',
  'ii/3 cadence': 'ii with its 3rd in the bass (the “ii6”) gives the bass a step up to V: the classic pre-dominant before a cadence.',
  'Cadential six-four': 'I/5 just before V: the bass already sits on the dominant, and the upper notes fall 6–5 and 4–3 into V7. It sounds like V with a delay.',
  'Deceptive cadence': 'V7 resolves to vi instead of I: the leading note still rises to the root, but the bass steps up to 6.',
  'Deceptive cadence in minor': 'V7 to ♭VI: the minor key’s deception. The bass steps up a half step instead of falling to i.',
  'Picardy third': 'A minor piece that ends on a major tonic: Bach’s chorales do it constantly.',
  'Phrygian half cadence': 'iv/3 to V in minor: the bass falls a half step (♭6 to 5), the Baroque ending of a slow movement.',
  'Pop with V/3': 'V with its 3rd in the bass makes the bass fall by step: 1–7–6. It’s the smoothest way from I to vi.',
  'Descending bass': 'The bass walks down the scale while the chords change above it, mostly by inversions: 1–7–6–5–4–3–2–5.',
  'Lament bass': 'The minor tetrachord falling from 1 to 5: i–v/3–iv/3–V. It’s the sound of grief, from Monteverdi and Purcell to rock.',
  'The Prinner': 'A galant schema: the melody falls 6–5–4–3 over the bass 4–3–2–1. A gentle answer to a phrase.',
  'Romanesca': 'A Renaissance pattern of falling 4ths and rising steps, the harmonic frame of Greensleeves and its family.',
  'La Folia': 'One of the oldest progressions in Western music, used for variations by Corelli and many others: i–V–i–♭VII–♭III–♭VII–i–V.',
  'I–VI7–ii–V': 'vi made major (VI7) becomes the dominant of ii: a secondary dominant that pulls the turnaround forward.',
  'V7 of vi': 'III7 is the dominant of vi: a raised 5th degree (the leading note of vi) makes the minor chord feel like a destination.',
  'Take the A Train': 'II7 (the dominant of V, with a raised 4th) for two bars, then ii–V: the famous lift in bar 3.',
  'I–I7–IV': 'Adding ♭7 to I turns home into the dominant of IV: the cleanest way to tonicise IV.',
  'In My Life (verse)': 'I7 leads to IV, then IV turns minor (iv, borrowed) before home: a bittersweet plagal ending.',
  'Creep': 'III (major, the dominant of vi) and iv (minor, borrowed): two chromatic chords, a bright one and a dark one.',
  'The Mario cadence': '♭VI–♭VII–I: two borrowed major chords climbing by step to home, the heroic video-game ending.',
  'Minor plagal': 'IV turns minor (iv) before home: the 6th of the key falls a half step to the 5th.',
  'Backdoor in triads': '♭VII to I: the “backdoor” resolution, home approached from a whole step below.',
  'Hotel California': 'A minor key with a Spanish-sounding V and borrowed major IV, then a chain falling in 5ths (♭VI–♭III–iv) back to V.',
  'Minor line cliché': 'A minor chord held while one voice falls by half steps: 1–7–♭7–6 (i, i(maj7), i7, i6).',
  'Major line cliché': 'The same idea in major: the root falls 1–7–♭7, turning I into I7, which leads to IV.',
  'Rising line cliché': 'The 5th rises by half steps: 5–♯5–6–♭7 over I, which ends up as I7 heading for IV.',
  'Ragtime': 'Dominant 7ths chained down the circle of 5ths (III7–VI7–II7–V7–I), each one resolving into the next.',
  'Montgomery-Ward bridge': 'I7 to IV, then II7 to V: two secondary dominants moving up in steps, a common bridge.',
  'Gospel walk-up': 'The bass climbs 4–♯4–5 (IV, ♯iv°7, I/5): the passing diminished chord is the chromatic step.',
  'Minor blues': 'The blues form in minor: i7, iv7, then ♭VI7–V7 as the turnaround.',
  'Minor circle of fifths': 'Every root a 5th below the last, in minor: i–iv–♭VII–♭III–♭VI–iiø–V–i.',
  'Fly Me to the Moon': 'The major circle of 5ths starting on vi, with III7 (the dominant of vi) to bring it round.',
  'All of Me': 'III7 and VI7: two secondary dominants back to back, heading round the circle towards ii.',
  'Pivot to the relative minor': 'viiø–III7–vi: the ii–V of the relative minor, which then sounds like the new home.',
  'Pivot to the dominant': 'vi becomes the ii of V, and II7 its dominant: the key leans up a 5th.',
  'The Monte': 'A rising sequence: a pair of chords (V7–I of IV, then of V) moved up a step.',
  'The Fonte': 'A falling sequence: a pair of chords (V7–i of ii, then V7–I) moved down a step.',
  'Tritone substitution': 'V7 replaced by ♭II7: the two share the tritone (3 and ♭7 swap), and the bass slides down a half step into I.',
  'Tritone-sub turnaround': 'I–VI7–ii–♭II7: the last dominant replaced by its tritone sub, so the bass falls chromatically into I.',
  'All-dominant turnaround': '♭III7 and ♭II7 are tritone subs of VI7 and V7: every chord but I is now a dominant sliding by half steps.',
  'Backdoor ii–V': 'iv7–♭VII7–I: home approached from a whole step below. The ♭VII7 shares notes with iv and resolves warmly.',
  'Passing diminished': '♯i°7 between I and ii: the bass climbs by half step, and the diminished chord acts as V7♭9 of ii.',
  'Jazz blues': 'The blues with jazz chords: a ii–V into IV, a passing ♯iv°7, VI7 heading for ii–V, and a turnaround.',
  'Rhythm changes, A section': 'Gershwin’s I Got Rhythm: turnarounds (I–vi–ii–V), then I7 to IV and a minor iv on the way home.',
  'Rhythm changes, bridge': 'Dominants down the circle of 5ths, two bars each: III7–VI7–II7–V7.',
  'Satin Doll': 'ii–Vs climbing a step at a time (ii–V of I, of ii, of V, then of ♭V), a chain of tonicisations.',
  'ii–V into IV': 'v7–I7 is the ii–V of IV: home turns into the dominant of IV for a moment.',
  'ii–V into ii': 'iiiø–VI7 is the minor ii–V of ii: the minor chord becomes a brief new home.',
  'Autumn Leaves': 'Heard from its minor tonic: the major ii–V–I of the relative major, then the minor iiø–V–i.',
  'Blue Bossa': 'A minor blues-like form with a brief ii–V into ♭II (a half step up), then back home.',
  'There Will Never Be Another You': 'Imaj7, then a minor ii–V into vi, then v7–I7: ii–V of IV.',
  'All the Things You Are': 'A circle of 5ths (vi–ii–V–I–IV), then a ii–V a major 3rd up into III: the first of its key changes.',
  'Just the Two of Us': 'IVmaj7–III7–vi: the borrowed dominant of vi, then v–I7 heading back round.',
  'The Girl from Ipanema': 'II7 (a raised 4th) for two bars, ii7, then the tritone sub ♭II7 sliding into I.',
  'Misty': 'Imaj7, the ii–V of IV, then iv–♭VII7 (backdoor) home and a turnaround.',
  'Neapolitan sixth': '♭II with its 3rd in the bass, a pre-dominant in minor: the flattened 2nd falls to the leading note in V.',
  'Augmented sixth': 'Sounds like ♭VI7, but its “7th” is really a raised 4th: the ♭6 and ♯4 spread outwards to the octave on V.',
  'Truck-driver key change': 'The whole song lifts a half step: ♭VI7 (the dominant of the new key) leads into ♭II, which is now home.',
  'Half-step modal shift': 'A Dorian vamp moved up a half step and back: no cadence, just a change of colour.',
  'Chromatic mediants': 'Major chords a 3rd from I (♭VI, ♭III): a shared note and bold chromatic shifts, the sound of film scores.',
  'Stella by Starlight': 'It opens on a minor ii–V that resolves deceptively, then ii–Vs into IV and back home. A tour of tonicisations.',
  'Solar': 'A minor-major tonic, then ii–Vs falling a whole step at a time: F, E♭ and D♭ in C minor.',
  'Lady Bird turnaround': 'I–♭III7–♭VI–♭II7: the backdoor and tritone ideas combined, falling to I.',
  'Countdown': 'Coltrane changes over a ii–V–I: dominants into major chords a major 3rd apart (♭VI, III), arriving on I.',
  'Giant Steps': 'Three tonics a major 3rd apart (I, ♭VI, III), each preceded by its V7: the cycle that divides the octave in three.',
  'Major-third cycle': 'I, ♭VI, III: three major chords a major 3rd apart. It’s the skeleton of Coltrane changes.',
  'A walking line in inversions': 'The chords put their 3rd, 5th or 7th in the bass so the bass walks by step, the way a jazz bassist connects changes.',
};

// what a chord does in the key
const DIATONIC = {
  major: { 0: ['maj', 'I is home (the tonic).'], 2: ['min', 'ii is a pre-dominant: it usually leads to V.'], 4: ['min', 'iii is a tonic substitute: it shares two notes with I.'],
    5: ['maj', 'IV is the pre-dominant: the move away from home.'], 7: ['maj', 'V is the dominant: its 3rd is the leading note, a half step below home.'],
    9: ['min', 'vi is the relative minor, a tonic substitute that shares two notes with I.'], 11: ['dim', 'vii° works as a dominant: V7 without its root.'] },
  minor: { 0: ['min', 'i is home (the minor tonic).'], 5: ['min', 'iv is the pre-dominant.'], 7: ['min', 'v is the natural-minor dominant: no leading note, so a softer pull home.'],
    3: ['maj', '♭III is the relative major.'], 8: ['maj', '♭VI is a pre-dominant colour, a half step above V.'], 10: ['maj', '♭VII sits a whole step below home (the subtonic).'],
    2: ['dim', 'iiø is the minor key’s pre-dominant.'] },
};
const famOf = (q) => (['maj', 'maj7', '6', 'add9', 'maj9'].includes(q) ? 'maj' : ['min', 'm7', 'm6', 'mMaj7', 'm9'].includes(q) ? 'min' : ['7', '7b9', '9', '13'].includes(q) ? 'dom' : ['dim', 'dim7', 'm7b5'].includes(q) ? 'dim' : q);
const TARGET = { 0: 'I', 2: 'ii', 4: 'iii', 5: 'IV', 7: 'V', 9: 'vi' };
const TARGET_MINOR = { 0: 'i', 3: '♭III', 5: 'iv', 7: 'V', 8: '♭VI', 10: '♭VII' };
function role(c, next, minor) {
  const f = famOf(c.quality);
  const d = (minor ? DIATONIC.minor : DIATONIC.major)[c.deg];
  const L = label(c.token);
  if (minor && c.deg === 7 && (f === 'maj' || f === 'dom')) return `${L} is the major dominant, borrowed from harmonic minor for its leading note.`;
  if (d && (d[0] === f || (d[0] === 'maj' && f === 'dom' && c.deg === 7) || (d[0] === 'dim' && f === 'dim'))) return d[1];
  if (f === 'dom' && next && next.deg === (c.deg + 5) % 12 && !(c.deg === 7 && next.deg === 0)) return `${L} acts as V7 of ${label(next.token)}, the chord it falls a 5th to.`;
  if (f === 'dom' && c.deg === 1) return `${L} is the tritone substitute for V7: they share the tritone, and the bass slides down a half step to I.`;
  if (f === 'dom' && c.deg === 10 && !minor) return `${L} is the backdoor dominant: it resolves up a whole step to I.`;
  if (f === 'dim' && c.quality === 'dim7') return `${L} is a passing diminished chord: a chromatic step in the bass, acting as V7♭9 of the chord a half step above.`;
  const target = (c.deg + 5) % 12;
  const T = minor ? TARGET_MINOR : TARGET;
  if ((f === 'dom' || (f === 'maj' && ![0, 5, 7].includes(c.deg))) && T[target]) {
    const lands = next && next.deg === target;
    return `${L} is a secondary dominant, V of ${T[target]}${lands ? ', and it resolves there' : ''}.`;
  }
  if (!minor && [3, 8, 10].includes(c.deg) && f === 'maj') return `${L} is borrowed from the parallel minor.`;
  if (!minor && c.deg === 5 && f === 'min') return `${L} is borrowed from the parallel minor: IV’s 3rd drops a half step.`;
  if (!minor && c.deg === 7 && f === 'min') return `${L} is a minor v, borrowed from Mixolydian.`;
  if (c.deg === 1 && f === 'maj') return `${L} is the Neapolitan: a major chord on the flattened 2nd.`;
  return `${L} is a chromatic colour, outside the key.`;
}
const STEP = { 0: 'stays put', 1: 'rises a half step', 2: 'rises a whole step', 3: 'rises a minor 3rd', 4: 'rises a major 3rd', 5: 'rises a 4th (falls a 5th): the strongest root move',
  6: 'moves a tritone', 7: 'rises a 5th (falls a 4th)', 8: 'falls a major 3rd', 9: 'falls a minor 3rd', 10: 'falls a whole step', 11: 'falls a half step' };
function motion(prev, c) {
  const root = STEP[((c.deg - prev.deg) % 12 + 12) % 12];
  const common = [...new Set(c.pcs)].filter((p) => prev.pcs.includes(p)).length;
  const bassMoved = prev.bassRel !== prev.deg || c.bassRel !== c.deg;
  const bass = bassMoved ? ` The bass ${STEP[((c.bassRel - prev.bassRel) % 12 + 12) % 12].replace(': the strongest root move', '')}.` : '';
  return `The root ${root}.${bass} ${common ? `It keeps ${common === 1 ? 'one note' : `${common} notes`} from the chord before.` : 'No notes in common with the chord before.'}`;
}
const INV = { 3: 'Its 3rd is in the bass, which makes the bass line move by step.', 5: 'Its 5th is in the bass (a six-four chord): unstable, it leans on the next chord.', 7: 'Its 7th is in the bass, and it wants to fall a step to the next chord’s 3rd.' };

export function learnMore(round) {
  const cs = round.tokens.map((x) => chordOf(x, round.tonic));
  // after a key change, each chord's job is told in the new key (its numerals stay in the opening key)
  const mod = round.song?.modulate;
  const inKey = (c, i) => (mod && i >= mod.at ? { ...c, deg: (c.deg - mod.shift + 12) % 12, token: c.token } : c);
  const roleAt = (i) => {
    const r = role(inKey(cs[i], i), cs[i + 1] && (mod && i >= mod.at ? inKey(cs[i + 1], i + 1) : cs[i + 1]), round.minor);
    return mod && i >= mod.at ? `In the new key (up ${mod.shift === 1 ? 'a half step' : mod.shift + ' half steps'}), ${r.replace(/^\S+ is/, 'this is').replace(/^\S+ acts/, 'this acts')}` : r;
  };
  return {
    title: round.song?.song || null,
    by: round.song?.by || null,
    about: round.song ? ABOUT[round.song.song] || null : null,
    chords: cs.map((c, i) => ({
      label: label(c.token), name: nameIn(c),
      text: [roleAt(i), i ? motion(cs[i - 1], c) : '', c.inv && c.inv !== '1' ? INV[c.inv] || '' : ''].filter(Boolean).join(' '),
    })),
  };
}
