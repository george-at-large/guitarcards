// Scale mode: for each chord, every scale that works over it, graded Easy → Exotic, with a sentence on its colour in
// this key. A 7- or 8-note scale "works" when it contains every chord tone; pentatonics and other gapped scales are
// matched to the chord's family by hand (they work by leaving the clashing notes out). Difficulty comes from how
// familiar the scale is and how far it strays from the key: a mode that stays inside the key is easy, one that adds
// three outside notes is hard. The context sentence is computed: which notes leave the key, and whether it is
// brighter or darker than the key's own mode on that chord.
import * as T from '../theory.js';
import * as F from '../fretboard.js';
import { semisOf } from './harmony.js';

// fam: pent (gapped, matched by hand), mode (church), mm / hm / hmaj (melodic, harmonic minor/major modes),
// sym (symmetric), bebop, exotic. base: 1 easy, 2 medium, 3 hard, 4 exotic. alias: where it comes from.
const S = (id, name, ivs, fam, base, feel, alias = '') => ({ id, name, ivs: ivs.split(' '), fam, base, feel, alias });
export const SCALES = [
  S('maj-pent', 'major pentatonic', '1 2 3 5 6', 'pent', 1, 'Open and sunny, with no half steps to trip over.'),
  S('min-pent', 'minor pentatonic', '1 b3 4 5 b7', 'pent', 1, 'The rock and blues workhorse: strong and safe.'),
  S('blues', 'blues scale', '1 b3 4 b5 5 b7', 'pent', 1, 'Minor pentatonic plus the ♭5 blue note: grit and attitude.'),
  S('maj-blues', 'major blues', '1 2 b3 3 5 6', 'pent', 1, 'Country and soul sweetness: the ♭3 slides up into the 3.'),
  S('dom-pent', 'dominant pentatonic', '1 2 3 5 b7', 'pent', 1, 'Mixolydian boiled down: bright, with a bluesy ♭7.'),
  S('m6-pent', 'minor 6 pentatonic', '1 b3 4 5 6', 'pent', 1, 'Dorian boiled down: minor but hopeful, thanks to the natural 6.'),
  S('ionian', 'Ionian (major)', '1 2 3 4 5 6 7', 'mode', 1, 'Plain, bright major. The 4 is the note to pass through, not sit on.'),
  S('dorian', 'Dorian', '1 2 b3 4 5 6 b7', 'mode', 1, 'Minor with a lift: the natural 6 keeps it cool rather than sad.'),
  S('phrygian', 'Phrygian', '1 b2 b3 4 5 b6 b7', 'mode', 1, 'Dark and Spanish: the ♭2 sits a half step above the root.'),
  S('lydian', 'Lydian', '1 2 3 #4 5 6 7', 'mode', 1, 'The brightest mode: the ♯4 floats, dreamy and unresolved.'),
  S('mixolydian', 'Mixolydian', '1 2 3 4 5 6 b7', 'mode', 1, 'Major with a bluesy ♭7: rock, funk and folk.'),
  S('aeolian', 'Aeolian (natural minor)', '1 2 b3 4 5 b6 b7', 'mode', 1, 'Plain, sad minor: the ♭6 gives the ache.'),
  S('locrian', 'Locrian', '1 b2 b3 4 b5 b6 b7', 'mode', 1, 'The darkest mode: ♭2 and ♭5, nothing stable to lean on.'),
  S('mel-min', 'melodic minor', '1 2 b3 4 5 6 7', 'mm', 2, 'Minor with a major top half: sophisticated and bittersweet.'),
  S('dorian-b2', 'Dorian ♭2', '1 b2 b3 4 5 6 b7', 'mm', 3, 'Dorian with a Phrygian ♭2: suspended and mysterious (sus♭9 sound).', 'melodic minor from the ♭7'),
  S('lyd-aug', 'Lydian augmented', '1 2 3 #4 #5 6 7', 'mm', 3, 'Lydian with a ♯5: floating, weightless, unresolved.', 'melodic minor from the 6'),
  S('lyd-dom', 'Lydian dominant', '1 2 3 #4 5 6 b7', 'mm', 2, 'A dominant with a ♯11 shimmer: bright tension, the Simpsons sound.', 'melodic minor from the 5th'),
  S('mixo-b6', 'Mixolydian ♭6', '1 2 3 4 5 b6 b7', 'mm', 3, 'Major turning wistful: the ♭6 leans down to the 5.', 'melodic minor from the 4th'),
  S('locrian-n2', 'Locrian ♮2', '1 2 b3 4 b5 b6 b7', 'mm', 2, 'Half-diminished made smoother: the natural 9 softens Locrian.', 'melodic minor from the ♭3'),
  S('altered', 'altered', '1 b9 #9 3 #11 b13 b7', 'mm', 2, 'Every tension bent: ♭9, ♯9, ♯11, ♭13. Maximum pull back home.', 'melodic minor a half step up'),
  S('harm-min', 'harmonic minor', '1 2 b3 4 5 b6 7', 'hm', 2, 'Minor with a leading tone: classical drama and a Middle Eastern gap.'),
  S('locrian-n6', 'Locrian ♮6', '1 b2 b3 4 b5 6 b7', 'hm', 3, 'Locrian with a raised 6: eerie half-diminished colour.', 'harmonic minor from the 2nd'),
  S('ionian-s5', 'Ionian ♯5', '1 2 3 4 #5 6 7', 'hm', 3, 'Major with a ♯5: grand but unsettled.', 'harmonic minor from the ♭3'),
  S('dorian-s4', 'Dorian ♯4', '1 2 b3 #4 5 6 b7', 'hm', 3, 'Ukrainian or Romanian Dorian: minor with a folk wail on the ♯4.', 'harmonic minor from the 4th'),
  S('phryg-dom', 'Phrygian dominant', '1 b2 3 4 5 b6 b7', 'hm', 2, 'Flamenco and klezmer: a major 3rd over a ♭2 and ♭6.', 'harmonic minor from the 5th'),
  S('lydian-s2', 'Lydian ♯2', '1 #2 3 #4 5 6 7', 'hm', 3, 'Very bright and exotic: a ♯2 and ♯4 around a major chord.', 'harmonic minor from the 6'),
  S('superloc-bb7', 'super-Locrian 𝄫7', '1 b2 b3 b4 b5 b6 bb7', 'hm', 3, 'Diminished-sounding and unstable: everything flattened.', 'harmonic minor from the 7th'),
  S('harm-maj', 'harmonic major', '1 2 3 4 5 b6 7', 'hmaj', 3, 'Major with a ♭6: the minor iv chord’s sigh inside a major scale.'),
  S('whole-tone', 'whole tone', '1 2 3 #4 #5 b7', 'sym', 2, 'Six whole steps, no centre: dreamlike and floating.'),
  S('dim-hw', 'half-whole diminished', '1 b9 #9 3 #11 5 13 b7', 'sym', 2, 'Dominant with ♭9, ♯9, ♯11 and natural 13: symmetric, precise tension.'),
  S('dim-wh', 'whole-half diminished', '1 2 b3 4 b5 b6 6 7', 'sym', 2, 'The diminished chord’s own scale: eight notes, every one a step from a chord tone.'),
  S('aug-hex', 'augmented (hexatonic)', '1 #2 3 5 #5 7', 'sym', 3, 'Two augmented triads interlocked: modern and angular.'),
  S('bebop-dom', 'bebop dominant', '1 2 3 4 5 6 b7 7', 'bebop', 2, 'Mixolydian with a passing major 7, so chord tones land on the beat.'),
  S('bebop-maj', 'bebop major', '1 2 3 4 5 #5 6 7', 'bebop', 3, 'Major with a passing ♯5: swing lines that land on chord tones.'),
  S('bebop-dor', 'bebop Dorian', '1 2 b3 3 4 5 6 b7', 'bebop', 3, 'Dorian with a passing major 3rd: the classic minor bebop line.'),
  S('dbl-harm', 'double harmonic', '1 b2 3 4 5 b6 7', 'exotic', 4, 'Byzantine or Arabic: two augmented seconds, intensely exotic.'),
  S('hung-min', 'Hungarian minor', '1 2 b3 #4 5 b6 7', 'exotic', 4, 'Gypsy minor: harmonic minor with a ♯4, dark and dramatic.'),
  S('hung-maj', 'Hungarian major', '1 #2 3 #4 5 6 b7', 'exotic', 4, 'A dominant with a ♯2 and ♯4: wild and bright.'),
  S('neap-min', 'Neapolitan minor', '1 b2 b3 4 5 b6 7', 'exotic', 4, 'Harmonic minor with a ♭2: operatic and very dark.'),
  S('neap-maj', 'Neapolitan major', '1 b2 b3 4 5 6 7', 'exotic', 4, 'Melodic minor with a ♭2: dark start, bright finish.'),
  S('persian', 'Persian', '1 b2 3 4 b5 b6 7', 'exotic', 4, 'Double harmonic with a ♭5: tense and ornamental.'),
  S('enigmatic', 'enigmatic', '1 b2 3 #4 #5 #6 7', 'exotic', 4, 'Verdi’s puzzle scale: whole-tone shimmer over a ♭2.'),
  S('prometheus', 'Prometheus', '1 2 3 #4 6 b7', 'exotic', 4, 'Scriabin’s mystic chord as a scale: luminous and strange.'),
  S('hirajoshi', 'Hirajoshi', '1 2 b3 5 b6', 'exotic', 4, 'Japanese pentatonic: sparse and plaintive, with a half step to ♭6.'),
  S('in-sen', 'In-sen', '1 b2 4 5 b7', 'exotic', 4, 'Japanese pentatonic: stark and suspended, the ♭2 bites.'),
];
const BY = Object.fromEntries(SCALES.map((s) => [s.id, s]));
export const LEVELS = [
  { id: 1, name: 'Easy' }, { id: 2, name: 'Medium' }, { id: 3, name: 'Hard' }, { id: 4, name: 'Exotic' },
];
const pcsOf = (ivs) => [...new Set(ivs.map((iv) => T.intervalSemis(F.simpleIv(iv)) % 12))];

// gapped scales matched to chord families by hand: [scale id, start (interval above the chord root), note]
const PENT = {
  maj: [['maj-pent', '1', ''], ['maj-pent', '5', 'from the 5th: adds the 7 and 9']],
  min: [['min-pent', '1', ''], ['m6-pent', '1', ''], ['min-pent', '2', 'from the 9th: 9, 11, 5, 6, ♭7 over the chord']],
  dom: [['maj-pent', '1', ''], ['dom-pent', '1', ''], ['min-pent', '1', 'over a major chord: the ♭3 rubs the 3, pure blues'], ['blues', '1', ''], ['maj-blues', '1', '']],
  domalt: [['min-pent', '1', 'over a ♯9 chord: the Hendrix sound'], ['blues', '1', '']],
  alt: [],
  domx: [],
  sus: [['min-pent', '5', 'from the 5th: 5, ♭7, 1, 9, 11'], ['dom-pent', '1', '']],
  hd: [['min-pent', 'b3', 'from the ♭3: ♭3, ♭5, ♭6, ♭7 and ♭9 over the chord']],
  aug: [],
  dim: [],
};
function family(q) {
  const ivs = T.getChord(q).ivs;
  const has = (x) => ivs.includes(x);
  if (has('b3') && has('b5') && has('bb7')) return 'dim';
  if (has('b3') && has('b5')) return 'hd';
  if (has('4') && !has('3') && !has('b3')) return 'sus';
  if (has('3') && has('#5') && !has('b7')) return 'aug';
  if (q === '7alt') return 'alt';
  if (has('b7') && has('3')) return has('#9') ? 'domalt' : ivs.some((x) => ['b9', '#11', 'b13', '#5', 'b5'].includes(x)) ? 'domx' : 'dom';
  if (has('b3')) return 'min';
  return 'maj';
}

// the notes a chord is heard against. In a major key: the key, then the parallel minor (borrowed chords). In a minor
// key: natural, harmonic, melodic minor, then the parallel major. A chromatic dominant or diminished chord is heard
// against the key it points to (A7 in C → D harmonic minor, since D is minor in C).
const MAJ = ['1', '2', '3', '4', '5', '6', '7'], NAT = ['1', '2', 'b3', '4', '5', 'b6', 'b7'], HARM = ['1', '2', 'b3', '4', '5', 'b6', '7'], MEL = ['1', '2', 'b3', '4', '5', '6', '7'];
const NOTE_NAMES = ['C', 'D♭', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'A♭', 'A', 'B♭', 'B'];
function homeFor(root, chordAbs, minor, tonicPc) {
  const at = (ivs, t, label) => ({ pcs: pcsOf(ivs).map((p) => (p + t) % 12), label });
  const cols = minor
    ? [at(NAT, 0, 'the key'), at(HARM, 0, 'the key (harmonic minor)'), at(MEL, 0, 'the key (melodic minor)'), at(MAJ, 0, 'the parallel major')]
    : [at(MAJ, 0, 'the key'), at(NAT, 0, 'the parallel minor')];
  const hit = cols.find((c) => chordAbs.every((p) => c.pcs.includes(p)));
  if (hit) return hit;
  const key = cols[0].pcs;
  const third = chordAbs.includes((root + 4) % 12), sev = chordAbs.includes((root + 10) % 12), dimish = chordAbs.includes((root + 6) % 12) && chordAbs.includes((root + 3) % 12);
  const targets = [];
  if (third && sev) targets.push((root + 5) % 12); // a dominant points a 4th up
  if (dimish) targets.push((root + 1) % 12); // a leading-tone diminished points a half step up
  for (const t of targets) {
    const minorTarget = key.includes((t + 3) % 12) && !key.includes((t + 4) % 12);
    const name = (n) => `${NOTE_NAMES[(n + tonicPc) % 12]}`;
    const opts = minorTarget ? [at(HARM, t, `${name(t)} harmonic minor, where it points`), at(MAJ, t, `${name(t)} major, where it points`)] : [at(MAJ, t, `${name(t)} major, where it points`), at(HARM, t, `${name(t)} harmonic minor, where it points`)];
    const h = opts.find((c) => chordAbs.every((p) => c.pcs.includes(p)));
    if (h) return h;
  }
  return cols[0];
}
const brightness = (pcs) => pcs.reduce((a, b) => a + b, 0);
const IVN = ['1', '♭2', '2', '♭3', '3', '4', '♯4', '5', '♭6', '6', '♭7', '7'];
// a scale clashes with a chord when it holds the chord's 3rd and the other 3rd (on a minor chord), the other 7th, or
// a natural 5 against an altered 5th. Bebop scales keep their passing tones on purpose.
function clashes(sc, rel, chordPcs) {
  const c = (x) => chordPcs.includes(x), h = (x) => rel.includes(x);
  if (sc.id === 'bebop-dom') return !(c(4) && c(10));
  if (sc.id === 'bebop-maj') return !(c(4) && !c(10));
  if (sc.id === 'bebop-dor') return !(c(3) && !c(6));
  if (c(3) && !c(4) && h(4)) return true;
  if (c(11) && h(10)) return true;
  if (c(10) && h(11)) return true;
  if ((c(8) || c(6)) && !c(7) && h(7)) return true;
  return false;
}

// every scale for a chord in a key: [{ scale, start, rel, level, note, sentence }]
export function scalesFor(iv, q, minor, tonicPc = 0) {
  const root = semisOf(iv);
  const chordPcs = pcsOf(T.getChord(q).ivs);
  const home = homeFor(root, chordPcs.map((p) => (p + root) % 12), minor, tonicPc);
  const homeRel = home.pcs.map((p) => (p - root + 12) % 12).sort((a, b) => a - b);
  const homeScale = SCALES.find((x) => x.ivs.length === 7 && pcsOf(x.ivs).sort((a, b) => a - b).join() === homeRel.join());
  const out = [];
  const add = (sc, startIv, note) => {
    const st = semisOf(startIv);
    const rel = pcsOf(sc.ivs).map((p) => (p + st) % 12);
    if (clashes(sc, rel, chordPcs)) return;
    const outside = rel.filter((p) => !home.pcs.includes((p + root) % 12));
    let level = sc.base;
    if (sc.fam === 'mode') level = outside.length === 0 ? 1 : outside.length <= 2 ? 2 : 3;
    else if (sc.fam === 'pent') level = outside.length === 0 ? 1 : 2;
    else if (!outside.length && rel.length >= 7) level = 1; // the key's own sound for this chord, whatever its name
    // where it sits: inside the chord's home collection, or which notes leave it; then brighter or darker than
    // the home collection's own mode on this chord
    const where = home.label;
    let ctx;
    if (!outside.length) ctx = `All inside ${where}.`;
    else ctx = `${outside.length === 1 ? 'One note' : `${outside.length} notes`} outside ${where} (${outside.sort((a, b) => a - b).map((p) => IVN[p]).join(', ')} over the chord)${outside.length >= 3 ? ': strong colour' : ''}.`;
    if (rel.length === 7 && homeScale && sc.id !== homeScale.id) {
      const d = brightness(rel) - brightness(homeRel);
      if (d) ctx += ` ${d > 0 ? 'Brighter' : 'Darker'} than ${homeScale.name.replace(/ \(.*\)/, '')}, the sound ${where.startsWith('the') ? where : 'that key'} gives this chord.`;
    }
    out.push({ scale: sc, start: startIv, rel, level, note, sentence: `${sc.feel} ${ctx}` });
  };
  for (const sc of SCALES) {
    if (sc.fam === 'pent' || sc.id === 'hirajoshi' || sc.id === 'in-sen') continue;
    const rel = pcsOf(sc.ivs);
    if (chordPcs.every((p) => rel.includes(p))) add(sc, '1', sc.alias);
  }
  for (const [id, start, note] of PENT[family(q)] || []) add(BY[id], start, note);
  if (family(q) === 'min' && !chordPcs.includes(9)) add(BY.hirajoshi, '1', '');
  if (family(q) === 'sus') add(BY['in-sen'], '1', 'the sus♭9 sound');
  return out;
}

// one scale for the chord at the chosen level ('any' = all), never the same as last time for this chord if avoidable
export function pickScale(iv, q, minor, level, last = null, tonicPc = 0) {
  const all = scalesFor(iv, q, minor, tonicPc);
  if (!all.length) return null;
  let pool = level === 'any' ? all : all.filter((x) => x.level === Number(level));
  // nothing at that level for this chord: the nearest level that has something
  for (let d = 1; !pool.length && d < 4; d++) pool = all.filter((x) => Math.abs(x.level - Number(level)) === d);
  if (!pool.length) pool = all;
  const fresh = pool.filter((x) => !last || x.scale.id !== last.scale.id || x.start !== last.start);
  const from = fresh.length ? fresh : pool;
  return from[Math.floor(Math.random() * from.length)];
}

// the scale's name on a real note: 'D Lydian dominant', or 'A minor pentatonic' when it starts away from the root
export function scaleTitle(choice, chordRoot) {
  const start = T.transpose(chordRoot, choice.start);
  return `${T.noteName(start, true)} ${choice.scale.name}`;
}
// its notes on the neck inside an area, labelled as intervals over the chord root; chord tones marked
export function scaleNotesIn(choice, chordRoot, q, lo, hi) {
  const rootPc = T.notePc(chordRoot);
  const chordIvs = T.getChord(q).ivs;
  const chordBy = new Map(chordIvs.map((x) => [T.intervalSemis(F.simpleIv(x)) % 12, x]));
  const out = [];
  for (let s = 1; s <= 6; s++) for (let f = lo; f <= hi; f++) {
    const rel = ((F.OPEN[s] + f - rootPc) % 12 + 12) % 12;
    if (!choice.rel.includes(rel)) continue;
    const ct = chordBy.get(rel);
    out.push({ string: s, fret: f, midi: F.OPEN[s] + f, iv: ct || IVN[rel].replace('♭', 'b').replace('♯', '#'), chord: !!ct, note: T.transposeSemis(chordRoot, rel) });
  }
  return out;
}
