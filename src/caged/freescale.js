// Free scale practice: one screen, no setup. A key, a mode from any harmonic system (listed from most useful to most
// exotic, each with its family), the whole neck showing it, a drone on the key note (with or without the 5th) and a
// metronome you set on screen. While it plays, facts about when the mode is useful scroll by.
import * as T from '../theory.js';
import * as F from '../fretboard.js';
import * as A from '../audio.js';
import * as SC from './scales.js';

const BY = Object.fromEntries(SC.SCALES.map((s) => [s.id, s]));
const IVN = ['1', '♭2', '2', '♭3', '3', '4', '♯4', '5', '♭6', '6', '♭7', '7'];
const KEYS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
const pcs = (id) => [...new Set(BY[id].ivs.map((iv) => T.intervalSemis(F.simpleIv(iv)) % 12))];

// most useful first
export const TIERS = [
  ['Essentials', ['ionian', 'aeolian', 'min-pent', 'maj-pent', 'blues']],
  ['Everyday modes', ['dorian', 'mixolydian']],
  ['Colour', ['lydian', 'phrygian', 'harm-min', 'mel-min', 'maj-blues', 'dom-pent']],
  ['Jazz', ['altered', 'lyd-dom', 'locrian-n2', 'dim-hw', 'whole-tone', 'bebop-dom', 'mixo-b6', 'phryg-dom', 'm6-pent']],
  ['Deeper', ['locrian', 'dim-wh', 'dorian-b2', 'lyd-aug', 'harm-maj', 'bebop-maj', 'bebop-dor', 'dorian-s4', 'ionian-s5', 'locrian-n6', 'lydian-s2', 'superloc-bb7', 'aug-hex']],
  ['Exotic', ['dbl-harm', 'hung-min', 'hung-maj', 'neap-min', 'neap-maj', 'persian', 'enigmatic', 'prometheus', 'hirajoshi', 'in-sen']],
];
const FAMILY = { pent: 'pentatonic', mode: 'major-scale mode', mm: 'melodic minor', hm: 'harmonic minor', hmaj: 'harmonic major', sym: 'symmetric', bebop: 'bebop', exotic: 'exotic' };

// facts about when each mode is useful (the most used ones by hand; the rest built from what the scale is)
const FACTS = {
  ionian: ['The major scale: home base for most pop, folk, country and classical melodies.', 'Over a maj7 chord the 4th is the note to pass through, not sit on: it rubs a half step above the 3rd.', 'Every other church mode is this scale from another note: learn it everywhere first.', 'Use it over I, IV (carefully) and V in a major key: the key’s own notes.'],
  aeolian: ['Natural minor: the sad, plain minor of rock and pop ballads.', 'Its ♭6 aches down to the 5th: lean on it over the i chord.', 'The relative minor: the same notes as the major scale a minor 3rd up.', 'Use it over i–♭VI–♭VII progressions, the epic minor sound.'],
  'min-pent': ['The rock and blues workhorse: five notes, no half steps, nothing to clash.', 'Works over minor chords, and over major and dominant chords in blues, where its ♭3 rubs the 3.', 'Five boxes cover the neck; most licks you know live in box 1.', 'Bend the ♭3 a quarter step towards the 3 for the blues sound.'],
  'maj-pent': ['Bright and open: country, soul, gospel and pop solos.', 'The same notes as the minor pentatonic a minor 3rd down.', 'Over a major chord nothing clashes: every note is safe.', 'Add the ♭3 as a passing note for the major blues sound.'],
  blues: ['Minor pentatonic plus the ♭5 blue note.', 'Pass through the ♭5, don’t sit on it: it’s grit, not a resting place.', 'Works over all three chords of a 12-bar blues.', 'The sound of rock, blues and a lot of soul and funk soloing.'],
  dorian: ['Minor with a bright natural 6: cool rather than sad.', 'Use it over m7 chords, especially ii in a major key and the i of a minor vamp (i–IV).', 'Funk, jazz, Santana, Celtic tunes: the minor with a lift.', 'The 6 is its colour note: lean on it over the minor chord.'],
  mixolydian: ['Major with a ♭7: the dominant sound, bluesy and rock.', 'Use it over dominant 7th chords and I–♭VII–IV rock vamps.', 'The ♭7 is its colour note: it stops the major sounding too sweet.', 'Funk, jam bands, folk and rock riffs live here.'],
  lydian: ['The brightest mode: major with a raised 4th.', 'Use it over a maj7 chord when you want it to float, especially IV in a major key.', 'The ♯4 is its colour: film scores and dreamy pop love it.', 'A I–II vamp says Lydian straight away.'],
  phrygian: ['Minor with a ♭2: dark, Spanish, metal.', 'The ♭2 a half step above the root is everything: lean on it and fall to the root.', 'Use it over a minor chord vamping with ♭II.', 'Flamenco and metal riffs often sit on i–♭II.'],
  'harm-min': ['Minor with a major 7th: classical drama, the leading tone pulling home.', 'The gap between ♭6 and 7 (an augmented 2nd) gives it its exotic sound.', 'Its 5th mode, Phrygian dominant, is the V7 of a minor key.', 'Use it over the i chord, or over V7 heading to a minor chord.'],
  'mel-min': ['Minor with a major top half: the jazz minor.', 'Use it over minor-major and m6 chords, and as a tonic minor in jazz.', 'Its modes give Lydian dominant, altered and Locrian ♮2: much of modern jazz.', 'Bittersweet: minor 3rd, major 6th and 7th.'],
  altered: ['Every tension bent: ♭9, ♯9, ♯11, ♭13 over a dominant.', 'Use it over V7 just before it resolves: maximum tension, then release.', 'It’s melodic minor from a half step above the root.', 'Resolve each altered note by half step into the next chord.'],
  'lyd-dom': ['A dominant with a ♯11: bright tension that doesn’t need to resolve.', 'Use it over IV7, ♭VII7 and tritone subs (♭II7).', 'It’s melodic minor from the 5th.', 'The Simpsons theme and a lot of fusion live here.'],
  'dim-hw': ['Half step, whole step: the 7♭9 dominant scale.', 'Use it over 7♭9 and 13♭9 chords.', 'Symmetric: the same scale repeats every three frets, so one fingering moves.', 'Only three of these exist; each fits four dominant chords a minor 3rd apart.'],
  'whole-tone': ['Six whole steps: dreamlike, no centre.', 'Use it over 7♯5 and 9♯5 chords.', 'Only two whole-tone scales exist; the fingering repeats every two frets.', 'Debussy and Thelonious Monk loved it.'],
  locrian: ['The darkest mode: ♭2 and ♭5, no stable 5th.', 'Use it over half-diminished chords (often Locrian ♮2 sounds smoother).', 'Rare as a tonic: it’s mostly a colour over m7♭5.'],
  'locrian-n2': ['Half-diminished made smoother: Locrian with a natural 9.', 'Use it over m7♭5 chords, the ii of a minor ii–V–i.', 'It’s melodic minor from the ♭3.'],
  'bebop-dom': ['Mixolydian plus a passing major 7th.', 'In eighth-note runs the extra note puts chord tones on the beat.', 'Use it over dominant chords in swing and bebop.'],
  'mixo-b6': ['Major turning wistful: a ♭6 in a major scale.', 'Use it over a dominant heading to a minor chord.', 'It’s melodic minor from the 4th.'],
  'phryg-dom': ['Flamenco and klezmer: a major 3rd over ♭2 and ♭6.', 'Use it over V7 in a minor key.', 'It’s harmonic minor from the 5th.'],
  'maj-blues': ['Major pentatonic plus the ♭3 sliding into the 3.', 'Country and soul sweetness over major and dominant chords.'],
  'dom-pent': ['Mixolydian boiled down: 1 2 3 5 ♭7.', 'A clean dominant sound with no avoid note.'],
};
function factsFor(id, tonic) {
  const s = BY[id], p = pcs(id), out = [...(FACTS[id] || [])];
  if (!FACTS[id]) out.push(s.feel);
  if (s.alias) out.push(`Where it comes from: ${s.alias}.`);
  if (s.fam) out.push(`Family: ${FAMILY[s.fam] || s.fam}${p.length !== 7 ? `, ${p.length} notes` : ''}.`);
  // its own chord, stacked in 3rds from the root
  if (p.length >= 7) {
    const sorted = [...p].sort((a, b) => a - b);
    const chord = [0, 2, 4, 6].map((i) => sorted[i]);
    const name = { '0,4,7,11': 'maj7', '0,4,7,10': '7', '0,3,7,10': 'm7', '0,3,6,10': 'm7♭5', '0,3,6,9': '°7', '0,3,7,11': 'm(maj7)', '0,4,8,11': 'maj7♯5', '0,4,8,10': '7♯5', '0,4,6,10': '7♭5', '0,3,6,11': '°(maj7)' }[chord.join()];
    if (name) out.push(`Its own chord: ${T.noteName(tonic, true)}${name}. Play that chord’s tones on the strong beats.`);
  }
  const ref = p.includes(4) ? [0, 2, 4, 5, 7, 9, 11] : [0, 2, 3, 5, 7, 8, 10];
  const colour = p.length >= 7 ? p.filter((x) => !ref.includes(x)) : [];
  if (colour.length) out.push(`Its colour note${colour.length > 1 ? 's' : ''}: the ${colour.map((x) => IVN[x]).join(' and ')}, compared with plain ${p.includes(4) ? 'major' : 'minor'}. Lean on ${colour.length > 1 ? 'them' : 'it'} over the drone.`);
  out.push('Practise: from the lowest note on the neck to the highest and back, then improvise using only two strings at a time.');
  return out;
}

// ---------- practice tips: ways to practise the mode, each with a picture of the pattern in this key ----------
// the scale climbing from its root on the 6th string, laid out a few notes per string
function climb(tonic, id, perString) {
  const pc = T.notePc(tonic), rel = pcs(id);
  let f0 = ((pc - 4) % 12 + 12) % 12; if (f0 === 0) f0 = 12;
  const m0 = 40 + f0, seq = [];
  for (let m = m0; m <= m0 + 30; m++) if (rel.includes(((m - pc) % 12 + 12) % 12)) seq.push(m);
  const out = [];
  let i = 0;
  for (let st = 6; st >= 1 && i < seq.length; st--) for (let k = 0; k < perString && i < seq.length; k++, i++) out.push({ string: st, fret: seq[i] - F.OPEN[st], midi: seq[i], rel: ((seq[i] - pc) % 12 + 12) % 12 });
  return { notes: out.filter((n) => n.fret >= 0), f0 };
}
const label = (n, txt, kind) => ({ string: n.string, fret: n.fret, midi: n.midi, iv: String(txt), kind });
const relKind = (rel) => (rel === 0 ? 'r' : [3, 4].includes(rel) ? 't3' : [6, 7, 8].includes(rel) ? 't5' : [10, 11].includes(rel) ? 't7' : 'sc');
function pic(notes, extra = 1) {
  if (!notes.length) return null;
  const fr = notes.map((n) => n.fret), lo = Math.max(0, Math.min(...fr.filter((f) => f > 0).concat([99])) - extra), hi = Math.max(...fr) + extra;
  return { notes, lo: Math.min(lo, Math.min(...fr)), hi: Math.max(hi, lo + 4) };
}
export function tipsFor(id, tonic) {
  const s = BY[id], p = pcs(id), n7 = p.length >= 7, gapped = p.length <= 6, sym = s.fam === 'sym', bebop = s.fam === 'bebop';
  const name = `${s.name.replace(/\s*\(.*\)/, '')}`;
  const q = (t) => `https://www.google.com/search?q=${encodeURIComponent(`${t} ${name} scale guitar`)}`;
  const tips = [];
  const per = gapped ? 2 : 3, c = climb(tonic, id, per);
  tips.push({ title: gapped ? 'Two notes per string' : 'Three notes per string', how: gapped ? `The box shape: two notes on every string, from the root on the 6th string up two octaves. Play it up and back down, then find the four other boxes up the neck.` : `Three notes on every string, from the root on the 6th string up two octaves: the hand shifts as it climbs, so the whole mode runs on a diagonal. Alternate pick, slowly, with the drone.`, search: q(gapped ? 'box shapes' : '3 notes per string'), pic: pic(c.notes.map((n, i) => label(n, i + 1, relKind(n.rel)))) });
  if (n7 || gapped) {
    const seq = c.notes, steps = [];
    for (let i = 0; i + 2 < seq.length && steps.length < 12; i++) steps.push(seq[i], seq[i + (gapped ? 1 : 2)]);
    const order = new Map(); steps.forEach((n, i) => { const k = `${n.string}:${n.fret}`; if (!order.has(k)) order.set(k, i + 1); });
    tips.push({ title: gapped ? 'In 4ths and 5ths' : 'In 3rds', how: gapped ? 'Skip one note each time: up one, back, up two (1-3, 2-4, 3-5…). In a pentatonic that makes 4ths and 5ths: an open, modern sound.' : 'Skip a note each time: 1-3, 2-4, 3-5 and so on, up and back down. It turns the scale into a melody and trains your eye to see the chords inside it.', search: q(gapped ? 'intervals 4ths' : 'in 3rds'), pic: pic(seq.filter((n) => order.has(`${n.string}:${n.fret}`)).slice(0, 12).map((n) => label(n, order.get(`${n.string}:${n.fret}`), relKind(n.rel)))) });
    const lad = c.notes.slice(0, 6).map((n, i) => label(n, i + 1, relKind(n.rel)));
    tips.push({ title: 'Ladders: groups of 3 and 4', how: 'Play 1-2-3, 2-3-4, 3-4-5… then 1-2-3-4, 2-3-4-5… up the scale and back. The classic way to make a scale fluent in every direction. Numbers show the first notes.', search: q('sequences groups of 3 4'), pic: pic(lad) });
  }
  // string skipping: the 6th and 4th strings, then the 5th and 3rd
  {
    const pc = T.notePc(tonic), rel = p, out = [];
    const lo = c.f0, hi = c.f0 + 5;
    for (const st of [6, 4]) for (let f = lo; f <= hi; f++) { const r = ((F.OPEN[st] + f - pc) % 12 + 12) % 12; if (rel.includes(r)) out.push({ string: st, fret: f, midi: F.OPEN[st] + f, rel: r }); }
    out.sort((a, b) => a.midi - b.midi);
    tips.push({ title: 'String skipping', how: 'Play the scale on two strings that aren’t next to each other (6th and 4th, then 5th and 3rd), jumping across the gap: wide intervals that sound nothing like running the scale.', search: q('string skipping'), pic: pic(out.map((n, i) => label(n, i + 1, relKind(n.rel)))) });
  }
  // double stops on the 3rd and 2nd strings
  {
    const pc = T.notePc(tonic), out = [];
    let k = 1;
    for (let f = Math.max(0, c.f0 - 1); f <= c.f0 + 7 && k <= 6; f++) {
      const r3 = ((F.OPEN[3] + f - pc) % 12 + 12) % 12;
      if (!p.includes(r3)) continue;
      for (let g = f - 2; g <= f + 2; g++) {
        if (g < 0) continue;
        const r2 = ((F.OPEN[2] + g - pc) % 12 + 12) % 12, iv = (F.OPEN[2] + g) - (F.OPEN[3] + f);
        if (p.includes(r2) && (gapped ? iv === 5 || iv === 7 : iv === 3 || iv === 4)) { out.push(label({ string: 3, fret: f, midi: F.OPEN[3] + f }, k, relKind(r3)), label({ string: 2, fret: g, midi: F.OPEN[2] + g }, k, relKind(r2))); k++; break; }
      }
    }
    tips.push({ title: gapped ? 'Double stops in 4ths' : 'Double stops in 3rds', how: gapped ? 'Two notes at once on neighbouring strings, a 4th apart: the rock and blues double stop. Slide each pair up to the next.' : 'Two notes at once on the 3rd and 2nd strings, a 3rd apart, moving up the scale together: pairs 1, 2, 3… Instant harmony, and it shows you the chords hiding in the mode.', search: q(gapped ? 'double stops 4ths' : 'double stops 3rds'), pic: pic(out) });
  }
  // one string up the neck
  {
    const pc = T.notePc(tonic), out = [];
    for (let f = 0; f <= 12; f++) { const r = ((F.OPEN[3] + f - pc) % 12 + 12) % 12; if (p.includes(r)) out.push(label({ string: 3, fret: f, midi: F.OPEN[3] + f }, IVN[r], relKind(r))); }
    tips.push({ title: 'One string up the neck', how: 'The whole mode on the 3rd string alone, sliding up and down. You see the half and whole steps as distances, and the mode stops being a box.', search: q('one string'), pic: { notes: out, lo: 0, hi: 12 } });
  }
  // the colour note
  if (n7) {
    const ref = p.includes(4) ? [0, 2, 4, 5, 7, 9, 11] : [0, 2, 3, 5, 7, 8, 10], col = p.filter((x) => !ref.includes(x));
    if (col.length && col.length <= 2) tips.push({ title: 'Target the colour note', how: `Over the drone, make every phrase end on the ${col.map((x) => IVN[x]).join(' or ')}: it’s what makes ${name} sound like itself. Then resolve it to the nearest chord tone. Highlighted: where it sits.`, search: q('characteristic note'), pic: pic(c.notes.map((n) => label(n, col.includes(n.rel) ? IVN[n.rel] : n.rel === 0 ? '1' : '', col.includes(n.rel) ? 'tx' : n.rel === 0 ? 'r' : 'sc'))) });
  }
  if (sym) tips.push({ title: id === 'whole-tone' ? 'It repeats every two frets' : 'It repeats every three frets', how: id === 'whole-tone' ? 'Whole steps all the way: the same fingering slid up two frets is the same scale. Learn one small shape and move it.' : 'Half and whole steps alternating: the same fingering slid up three frets (a minor 3rd) is the same scale. Learn one shape on two strings and move it in minor 3rds.', search: q('symmetrical pattern'), pic: pic(c.notes.slice(0, 8).map((n, i) => label(n, i + 1, relKind(n.rel)))) });
  if (bebop) tips.push({ title: 'Chord tones on the beat', how: 'Run it in eighth notes down from the root: the extra passing note makes every chord tone land on a beat. Start on a chord tone, on the beat.', search: q('bebop scale eighth notes'), pic: pic(c.notes.slice().reverse().slice(0, 8).map((n, i) => label(n, i + 1, relKind(n.rel)))) });
  if (id === 'blues' || id === 'maj-blues') tips.push({ title: 'Slide into the blue note', how: 'Slide or bend into the blue note from a fret below and resolve it: it’s a passing colour, not a place to stop.', search: q('blue note bends'), pic: pic(c.notes.map((n, i) => label(n, i + 1, [3, 6].includes(n.rel) ? 'tx' : relKind(n.rel)))) });
  // rhythm: the same notes, different feels (the picture is one bar of four beats: where the notes fall, accents bigger)
  const R4 = (div, hits, acc = [], labels = {}) => ({ div, hits, acc, labels });
  // target on the beat: a chosen degree on a chosen beat, in this mode's own spelling
  const ivs = s.ivs, pi = (x) => { const n = String(x).replace(/\D/g, ''); return `${T.prettyIv(x)}${n === '1' ? 'st' : n === '2' ? 'nd' : n === '3' ? 'rd' : 'th'}`; }, pl = (x) => T.prettyIv(x);
  const th = ivs.find((x) => /^b?3$/.test(x)), sv = ivs.find((x) => /^b?b?7$/.test(x)) || ivs.find((x) => x === '6'), fv = ivs.find((x) => /^[b#]?5$/.test(x));
  const refT = p.includes(4) ? [0, 2, 4, 5, 7, 9, 11] : [0, 2, 3, 5, 7, 8, 10], colT = n7 ? p.filter((x) => !refT.includes(x)) : [];
  const colIv = colT.length === 1 ? ivs.find((x) => T.intervalSemis(F.simpleIv(x)) % 12 === colT[0]) : null;
  if (th) tips.push({ title: `The ${pi(th)} on beat 1`, how: `Play eighth notes freely through the mode, but beat 1 of every bar must be the ${pi(th)}${th === 'b3' ? ' (the minor 3rd)' : ' (the 3rd)'}. Aim for it from a different place each bar.`, search: q('target notes downbeat'), rhythm: R4(2, [0, 1, 2, 3, 4, 5, 6, 7], [0], { 0: pl(th) }), pic: null });
  tips.push({ title: 'Chord tones on the beats', how: `On every click play a chord tone (1, ${[th, fv, sv].filter(Boolean).map(pl).join(', ')}); on the “and”s anything in the mode. The beat outlines the harmony, the off-beats decorate it: the bebop principle.`, search: q('chord tones on the beat'), rhythm: R4(2, [0, 1, 2, 3, 4, 5, 6, 7], [0, 2, 4, 6], { 0: 'CT', 2: 'CT', 4: 'CT', 6: 'CT' }), pic: null });
  if (colIv) tips.push({ title: `Colour note on beat 3`, how: `Put the ${pi(colIv)}, the note that makes this mode itself, on beat 3, then resolve it to the nearest chord tone on beat 4. Tension, release, every bar.`, search: q('characteristic note resolution'), rhythm: R4(1, [0, 1, 2, 3], [2, 3], { 2: pl(colIv), 3: 'CT' }), pic: null });
  if (sv) tips.push({ title: `Anticipate the ${pi(sv)}`, how: `Land the ${pi(sv)} on the “and” of 4 and hold it over the bar line into beat 1: arriving early is what makes a line swing.`, search: q('anticipation phrasing'), rhythm: R4(2, [0, 2, 4, 7], [7], { 7: pl(sv) }), pic: null });
  const all = (div) => Array.from({ length: div * 4 }, (_, i) => i);
  tips.push({ title: 'Triplets', how: 'Three notes to every click: up the scale in triplets, accenting the first of each three. Then turn it into a sequence: 1-2-3, 2-3-4, 3-4-5, one group per beat.', search: q('triplets'), rhythm: R4(3, all(3), [0, 3, 6, 9]), pic: null });
  tips.push({ title: 'Sixteenths', how: 'Four notes to every click, alternate picking, evenly. Start at half the tempo you think you can manage; speed comes from evenness.', search: q('sixteenth notes'), rhythm: R4(4, all(4), [0, 4, 8, 12]), pic: null });
  tips.push({ title: 'Groups of 3 over 4', how: 'Sixteenth notes, but accent every third note: the accent drifts across the beat and comes home after three beats. The classic way to make a scale sound like a phrase.', search: q('groups of three over four'), rhythm: R4(4, all(4), [0, 3, 6, 9, 12, 15]), pic: null });
  tips.push({ title: 'Swing', how: 'Long–short eighth notes, as if in triplets with the middle one silent. Accent the off-beats lightly: jazz and blues phrasing.', search: q('swing eighth notes'), rhythm: R4(3, [0, 2, 3, 5, 6, 8, 9, 11], [2, 5, 8, 11]), pic: null });
  tips.push({ title: 'Start on the “and”', how: 'Begin every phrase on an off-beat: rest on the click, play on the “and”. Off-beat starts are what make lines groove instead of march.', search: q('offbeat phrasing'), rhythm: R4(2, [1, 2, 3, 5, 6, 7], [1, 5]), pic: null });
  tips.push({ title: 'Quintuplets', how: 'Five notes to a click: count “un-i-ver-si-ty”. Hard at first; it breaks the habit of thinking in twos and fours.', search: q('quintuplets'), rhythm: R4(5, all(5), [0, 5, 10, 15]), pic: null });
  tips.push({ title: 'Long notes against the drone', how: 'One note every four clicks: let each note ring over the drone and listen to how it sits. The colour notes will jump out.', search: q('long tones drone'), rhythm: R4(1, [0], [0]), pic: null });
  tips.push({ title: 'Two bars on, two bars off', how: 'Play a two-bar phrase, rest two bars, play another that answers it: question and answer. Silence is half of phrasing.', search: q('call and response phrasing'), rhythm: R4(2, [0, 1, 2, 3, 4, 5], [0]), pic: null });
  return tips;
}

// ---------- where a mode comes from: its parent scale and degree, found by rotating the parents ----------
const PARENTS = [['ionian', 'major'], ['mel-min', 'melodic minor'], ['harm-min', 'harmonic minor'], ['harm-maj', 'harmonic major']];
const ORD = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th'];
const KEYNAME = (pc) => T.noteName(T.parseNote(KEYS[((pc % 12) + 12) % 12]), true);
export function parentOf(id) {
  const mine = pcs(id).slice().sort((a, b) => a - b).join();
  if (pcs(id).length !== 7) return null;
  for (const [pid, pname] of PARENTS) {
    const pp = pcs(pid).slice().sort((a, b) => a - b);
    for (let d = 0; d < 7; d++) {
      const rot = pp.map((x) => (x - pp[d] + 12) % 12).sort((a, b) => a - b).join();
      if (rot === mine) {
        // its brothers and sisters: the parent from each degree, the ones the app knows by name
        const sibs = [];
        for (let e = 0; e < 7; e++) {
          const r = pp.map((x) => (x - pp[e] + 12) % 12).sort((a, b) => a - b).join();
          const sc = SC.SCALES.find((x) => pcs(x.id).length === 7 && pcs(x.id).slice().sort((a, b) => a - b).join() === r);
          sibs.push({ deg: e, offset: pp[e], id: sc ? sc.id : null });
        }
        return { pid, pname, deg: d, offset: pp[d], sibs };
      }
    }
  }
  return null;
}
// the triads inside a seven-note mode, on each of its degrees
function triadsIn(id, tonic) {
  const p = pcs(id).slice().sort((a, b) => a - b);
  if (p.length !== 7) return [];
  const Q = { '4,7': '', '3,7': 'm', '3,6': '°', '4,8': '+' };
  return p.map((r, i) => { const t = (p[(i + 2) % 7] - r + 12) % 12, f = (p[(i + 4) % 7] - r + 12) % 12, q = Q[`${t},${f}`]; return q === undefined ? null : `${T.noteName(T.transposeSemis(tonic, r), true)}${q}`; }).filter(Boolean);
}

// one bar of four beats: the beat lines, a dot for each note, bigger on the accents
function rhythmSVG({ div, hits, acc, labels = {} }) {
  const W = 320, H = 70, x0 = 14, bw = (W - 2 * x0) / 4, n = div * 4, step = bw / div;
  let g = '';
  for (let b = 0; b <= 4; b++) g += `<line x1="${x0 + b * bw}" y1="10" x2="${x0 + b * bw}" y2="${H - 10}" class="rbeat"/>`;
  for (let b = 0; b < 4; b++) g += `<text x="${x0 + b * bw + 4}" y="${H - 2}" class="rnum">${b + 1}</text>`;
  for (let i = 0; i < n; i++) {
    const x = x0 + i * step + step / 2;
    const lab = labels[i];
    g += hits.includes(i) ? `<circle cx="${x}" cy="${H / 2}" r="${lab ? 12 : acc.includes(i) ? 9 : 5.5}" class="${acc.includes(i) ? 'racc' : 'rhit'}"/>${lab ? `<text x="${x}" y="${H / 2 + 4}" class="rlab">${lab}</text>` : ''}` : `<circle cx="${x}" cy="${H / 2}" r="2.5" class="rrest"/>`;
  }
  return `<svg viewBox="0 0 ${W} ${H}" class="rhythmpic" role="img" aria-label="Rhythm">${g}</svg>`;
}

export function renderFreeScale($app, ctx) {
  const { D, save, neckSVG, esc, fmt, onBack, KIND } = ctx;
  const O = D.fs = Object.assign({ key: 'A', scale: 'dorian', drone: true, fifth: true, metro: false, bpm: 70, frets: 12 }, D.fs || {});
  let R = { on: false, timer: null, next: 0, beat: 0, fact: 0, factT: null, vis: [], tip: 0 };

  const tonic = () => T.parseNote(O.key);
  function neck() {
    const t = tonic(), s = BY[O.scale];
    const rel = pcs(O.scale);
    const p = rel, ref = p.includes(4) ? [0, 2, 4, 5, 7, 9, 11] : [0, 2, 3, 5, 7, 8, 10];
    const colour = p.length >= 7 ? p.filter((x) => !ref.includes(x)) : [];
    const notes = [];
    for (let st = 1; st <= 6; st++) for (let f = 0; f <= O.frets; f++) {
      const r = ((F.OPEN[st] + f - T.notePc(t)) % 12 + 12) % 12;
      if (!rel.includes(r)) continue;
      const iv = s.ivs.find((x) => T.intervalSemis(F.simpleIv(x)) % 12 === r) || IVN[r];
      const plain = iv.replace('♭', 'b').replace('♯', '#');
      const kind = r === 0 ? 'r' : /^(b?3|[b#]?5|b?b?7)$/.test(plain) ? KIND(plain) : colour.includes(r) || /^[b#]?(9|11|13)$/.test(plain) ? 'tx' : 'sc';
      notes.push({ string: st, fret: f, midi: F.OPEN[st] + f, iv, kind });
    }
    return neckSVG({ notes, lo: 0, hi: O.frets }, { lo: 0, hi: O.frets, labels: 'iv' });
  }
  const facts = () => factsFor(O.scale, tonic());
  function factHTML() { const f = facts(); return `<span class="lbl">when it’s useful · ${(R.fact % f.length) + 1} of ${f.length} <i>tap to read it all</i></span><p>${fmt(f[R.fact % f.length])}</p>`; }
  // practice tips: one at a time, its picture and a link to look it up
  function tipsHTML() {
    const tips = tipsFor(O.scale, tonic()), t = tips[R.tip % tips.length];
    const picSvg = t.pic ? neckSVG({ notes: t.pic.notes, lo: t.pic.lo, hi: t.pic.hi }, { lo: t.pic.lo, hi: t.pic.hi, labels: 'iv', small: true }) : t.rhythm ? rhythmSVG(t.rhythm) : '';
    return `<h2>Practice tips</h2>
      <div class="chips fstips">${tips.map((x, i) => `<button class="chip ${i === R.tip % tips.length ? 'on' : ''}" data-tip="${i}">${esc(x.title)}</button>`).join('')}</div>
      <p>${fmt(t.how)}</p>
      ${picSvg ? `<div class="fstippic${t.rhythm ? ' wide' : ''}">${picSvg}<p class="note">${t.rhythm ? (Object.keys(t.rhythm.labels || {}).length ? 'One bar of four beats: the labelled notes go on those beats (CT: any chord tone).' : 'One bar of four beats: each dot a note, the big ones accented.') : t.pic.notes.some((n) => /^\d+$/.test(n.iv)) ? 'Numbers: the order to play them in.' : ''}</p></div>` : ''}
      <a class="fslook" href="${t.search}" target="_blank" rel="noopener">Look it up ↗</a>`;
  }
  // everything about the mode, to read at leisure
  function aboutHTML() {
    const s = BY[O.scale], t = tonic(), par = parentOf(O.scale), tri = triadsIn(O.scale, t);
    const parent = par ? `<p><b>${fmt(T.noteName(t, true))} ${esc(s.name)}</b> is <b>${fmt(KEYNAME(T.notePc(t) - par.offset))} ${esc(par.pname)}</b> played from its ${ORD[par.deg]} degree: the same seven notes, centred on ${fmt(T.noteName(t, true))}.</p>
      <h3>Its family: the modes of ${esc(par.pname)}</h3><ul class="fssibs">${par.sibs.map((x) => `<li${x.id === O.scale ? ' class="on"' : ''}>${ORD[x.deg]}: ${x.id ? `<button class="linkish" data-goto="${x.id}" data-gokey="${KEYS[((T.notePc(t) - par.offset + x.offset) % 12 + 12) % 12]}">${fmt(T.noteName(T.transpose(T.parseNote(KEYS[((T.notePc(t) - par.offset) % 12 + 12) % 12]), F.simpleIv(BY[par.pid].ivs[x.deg])), true))} ${esc(BY[x.id].name)}</button>` : '—'}</li>`).join('')}</ul><p class="note">All seven use the same notes; each puts a different one at home.</p>`
      : `<p>${esc(FAMILY[s.fam] ? `A ${FAMILY[s.fam]} scale` : 'A scale')} of ${pcs(O.scale).length} notes${s.alias ? `: ${esc(s.alias)}` : ''}. It isn’t a mode of major, melodic minor, harmonic minor or harmonic major.</p>`;
    return `<div class="sheet-head"><div><b>${fmt(T.noteName(t, true))} ${esc(s.name)}</b><small>${esc(FAMILY[s.fam] || '')}</small></div><button class="icon" data-f="closeabout" aria-label="Close">✕</button></div>
      <section class="why"><h3>Where it comes from</h3>${parent}</section>
      <section class="why"><h3>Its notes</h3><p>${fmt(s.ivs.map((x) => T.prettyIv(x)).join(' '))}</p><p class="note">${fmt(s.feel)}</p>${tri.length ? `<p>The triads inside it: ${fmt(tri.join(' · '))}</p>` : ''}</section>
      <section class="why"><h3>When it’s used</h3><ul>${facts().map((f) => `<li>${fmt(f)}</li>`).join('')}</ul></section>
      <section class="why"><h3>Ways to practise it</h3><ul>${tipsFor(O.scale, t).map((x) => `<li><b>${esc(x.title)}</b>: ${fmt(x.how)}</li>`).join('')}</ul></section>`;
  }
  function openAbout() { const el = document.getElementById('fsabout'); el.innerHTML = aboutHTML(); el.hidden = false; el.scrollTop = 0; document.body.classList.add('locked'); }
  function closeAbout() { const el = document.getElementById('fsabout'); if (el) el.hidden = true; document.body.classList.remove('locked'); }

  // ---------- sound: the drone and the metronome ----------
  function drone() { if (R.on && O.drone) A.startDrone(36 + T.notePc(tonic()) + (T.notePc(tonic()) < 4 ? 12 : 0), O.fifth); else A.stopDrone(); }
  function clock() {
    if (!R.on) return;
    const c = A.audioCtx();
    if (R.next < c.currentTime - 0.02) R.next = c.currentTime + 0.05;
    while (R.next < c.currentTime + 0.12) {
      const t = R.next, b = R.beat++;
      if (O.metro) A.click(t, b % 4 === 0 ? 2 : 1);
      R.vis.push(setTimeout(() => document.querySelectorAll('#fsbeats i').forEach((el, i) => el.classList.toggle('on', O.metro && i === b % 4)), Math.max(0, (t - c.currentTime) * 1000)));
      if (R.vis.length > 64) R.vis.splice(0, 32);
      R.next += 60 / O.bpm;
    }
    R.timer = setTimeout(clock, 25);
  }
  function rotateFacts() {
    clearInterval(R.factT);
    R.factT = setInterval(() => { R.fact++; const el = document.getElementById('fsfact'); if (el) { el.classList.remove('in'); void el.offsetWidth; el.innerHTML = factHTML(); el.classList.add('in'); } }, 9000);
  }
  async function play() {
    A.unlockAudio().catch(() => {});
    R.on = true;
    await Promise.race([A.ensureRunning(), new Promise((r) => setTimeout(r, 500))]);
    if (!R.on) return;
    drone();
    R.next = A.audioCtx().currentTime + 0.1; R.beat = 0;
    clock(); rotateFacts();
    draw();
  }
  function stopAll() {
    R.on = false;
    clearTimeout(R.timer); clearInterval(R.factT); R.vis.forEach(clearTimeout); R.vis = [];
    A.stopDrone(); A.hush();
  }

  // ---------- the screen ----------
  function draw() {
    const s = BY[O.scale];
    const opts = TIERS.map(([tier, ids]) => `<optgroup label="${esc(tier)}">${ids.filter((id) => BY[id]).map((id) => `<option value="${id}" ${id === O.scale ? 'selected' : ''}>${esc(BY[id].name)} · ${esc(FAMILY[BY[id].fam] || '')}</option>`).join('')}</optgroup>`).join('');
    $app.innerHTML = `
    <header class="chead"><button class="icon" data-f="back" aria-label="Back">‹</button><h1>Free scales</h1><button class="icon" data-f="play" aria-label="${R.on ? 'Stop' : 'Start'}">${R.on ? '■' : '▶'}</button></header>
    <div class="fsbar">
      <div class="chips fskeys">${KEYS.map((k) => `<button class="chip ${O.key === k ? 'on' : ''}" data-key="${k}">${fmt(T.pretty(k))}</button>`).join('')}</div>
      <select id="fsscale" class="select" aria-label="Mode">${opts}</select>
      <div class="fsrow">
        <button class="chip ${O.drone ? 'on' : ''}" data-f="drone">Drone</button><button class="chip ${O.fifth ? 'on' : ''}" data-f="fifth">+ 5th</button>
        <button class="chip ${O.metro ? 'on' : ''}" data-f="metro">Metronome</button>
        <span class="fsbpm"><button data-f="bpm-" aria-label="Slower">−</button><b id="fsbpmv">${O.bpm}</b><button data-f="bpm+" aria-label="Faster">+</button></span>
      </div>
      <input type="range" id="fsbpmr" min="30" max="200" step="2" value="${O.bpm}" aria-label="Tempo">
    </div>
    <h2 class="fstitle">${fmt(T.noteName(tonic(), true))} ${esc(s.name)} <small>${(() => { const par = parentOf(O.scale); return par ? `${par.deg === 0 ? esc(par.pname) : `mode ${par.deg + 1} of ${esc(par.pname)}`}: ${fmt(KEYNAME(T.notePc(tonic()) - par.offset))} ${esc(par.pname)} from its ${ORD[par.deg]}` : esc(FAMILY[s.fam] || ''); })()} · <button class="linkish" data-f="about">about this mode</button></small></h2>
    <div class="beats" id="fsbeats">${O.metro ? '<i></i><i></i><i></i><i></i>' : ''}</div>
    <div class="fsfact in" id="fsfact">${factHTML()}</div>
    <div class="stage fsneck">${neck()}</div>
    <div class="legend"><span class="k r">root</span><span class="k t3">3rd</span><span class="k t5">5th</span><span class="k t7">7th</span><span class="k tx">colour note</span><span class="k sc">rest of the scale</span></div>
    <div class="chips" style="justify-content:center">${[12, 15].map((n) => `<button class="chip ${O.frets === n ? 'on' : ''}" data-frets="${n}">Frets 0–${n}</button>`).join('')}</div>
    <section class="card fstipcard" id="fstips">${tipsHTML()}</section>
    <div class="sheet" id="fsabout" hidden></div>
    ${R.on ? '' : '<div class="actions"><button class="primary" data-f="play">▶ Start the drone</button></div>'}`;
    const sel = $app.querySelector('#fsscale');
    sel.onchange = () => { O.scale = sel.value; R.fact = 0; R.tip = 0; save(); draw(); };
    const r = $app.querySelector('#fsbpmr');
    r.oninput = () => { O.bpm = Number(r.value); document.getElementById('fsbpmv').textContent = O.bpm; };
    r.onchange = () => save();
  }
  $app.onclick = (e) => {
    if (e.target.closest('#fsfact')) return openAbout(); // tap the facts to read them all
    const g = e.target.closest('[data-goto]');
    if (g) { O.scale = g.dataset.goto; O.key = g.dataset.gokey; R.fact = 0; R.tip = 0; save(); closeAbout(); if (R.on) drone(); return draw(); }
    const b = e.target.closest('button'); if (!b) return;
    const d = b.dataset;
    if (d.key) { O.key = d.key; save(); if (R.on) drone(); return draw(); }
    if (d.frets) { O.frets = Number(d.frets); save(); return draw(); }
    if (d.tip !== undefined) { R.tip = Number(d.tip); document.getElementById('fstips').innerHTML = tipsHTML(); return; }
    const a = d.f; if (!a) return;
    if (a === 'back') { stopAll(); closeAbout(); return onBack(); }
    if (a === 'about') return openAbout();
    if (a === 'closeabout') return closeAbout();
    if (a === 'play') { if (R.on) { stopAll(); return draw(); } return play(); }
    if (a === 'drone' || a === 'fifth') { O[a] = !O[a]; save(); if (R.on) drone(); return draw(); }
    if (a === 'metro') { O.metro = !O.metro; save(); return draw(); }
    if (a === 'bpm-' || a === 'bpm+') { O.bpm = Math.max(30, Math.min(200, O.bpm + (a === 'bpm+' ? 2 : -2))); save(); document.getElementById('fsbpmv').textContent = O.bpm; const rr = document.getElementById('fsbpmr'); if (rr) rr.value = O.bpm; return; }
  };
  draw();
  return stopAll;
}
