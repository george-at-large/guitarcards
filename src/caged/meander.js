// Listen mode's composer: endless chord progressions that wander like real music. Each phrase opens on the tonic,
// moves through the key and closes with a cadence (perfect, plagal, half, deceptive, backdoor, Neapolitan…). The
// higher the level, the more gets added on the way: suspensions and walking basses, then borrowed chords and
// secondary dominants, then ii–Vs into any chord, tritone subs and passing diminished chords, then chromatic mediants
// and keys far away. Every chord carries a short note of what just happened, to be shown and spoken.
// A chord is { spec: { iv, q, rel?, bass? }, key: { off, minor }, beats, ann: [{ say, text }] }; iv is above the
// local key's tonic, key.off the local tonic in semitones above home.
import * as T from '../theory.js';
import { numeral, toTriad } from './harmony.js';

const IVS = ['1', 'b2', '2', 'b3', '3', '4', '#4', '5', 'b6', '6', 'b7', '7'];
const SEMI = (iv) => T.intervalSemis(iv) % 12;
const ivAt = (s) => IVS[((s % 12) + 12) % 12];
// a passing diminished chord is spelled sharp (C♯°7 between C and Dm), a tritone sub flat (G♭7 into F)
const ivSharp = (s) => ['1', '#1', '2', '#2', '3', '4', '#4', '5', '#5', '6', 'b7', '7'][((s % 12) + 12) % 12];
const ivFlat = (s) => ['1', 'b2', '2', 'b3', '3', '4', 'b5', '5', 'b6', '6', 'b7', '7'][((s % 12) + 12) % 12];
const pick = (a) => a[Math.floor(Math.random() * a.length)];
const chance = (p) => Math.random() < p;
const wpick = (pairs) => { let r = Math.random() * pairs.reduce((s, p) => s + p[1], 0); for (const [v, w] of pairs) { r -= w; if (r <= 0) return v; } return pairs[0][0]; };

export const LEVELS = [
  { n: 1, name: 'Simple', blurb: 'Triads of the key: I, IV, V, vi, ii. Perfect, plagal and half cadences.' },
  { n: 2, name: 'Gentle', blurb: 'Sevenths and add9s, deceptive cadences, ii–V–I, suspensions, a bass that walks between chords.' },
  { n: 3, name: 'Colour', blurb: 'Borrowed chords (iv, ♭VI, ♭VII), secondary dominants, Picardy and Phrygian cadences, moves to nearby keys.' },
  { n: 4, name: 'Jazz', blurb: 'ii–Vs into any chord, tritone subs, passing diminished chords, the backdoor cadence, 9ths, 13ths and altered dominants.' },
  { n: 5, name: 'Far out', blurb: 'Chromatic mediants, the Neapolitan and augmented sixth, keys a third or a half step away.' },
];

// ---------- chord colour by level: a base kind (maj, min, dom, hd, dim) becomes a real chord quality ----------
function colour(kind, L, { tonic = false, sub = false, toMinor = false, role = '', lyd = false, plain = false } = {}) {
  if (kind === 'sus') return L >= 3 ? pick(['7sus4', '9sus4']) : L >= 2 ? '7sus4' : 'sus4';
  if (kind === 'hd') return L >= 2 ? 'm7b5' : 'dim';
  if (kind === 'dim') return L >= 2 || role === 'pass' ? 'dim7' : 'dim';
  if (kind === 'aug6') return '7';
  if (kind === 'maj') {
    if (role === 'n6') return 'maj';
    if (L <= 1) return 'maj';
    if (L === 2) return wpick([['maj', 2], ['maj7', 2], ['add9', 1]]);
    if (L === 3) return wpick([['maj7', 3], ['add9', 1], [tonic ? '6/9' : 'maj9', 1]]);
    // the ♯11 only where the key has it (IV in major, ♭VI)
    if (L === 4) return wpick([['maj9', 2], ['maj7', 1], [tonic ? '6/9' : lyd ? 'maj7#11' : 'maj7', 2]]);
    return wpick([['maj9', 2], [tonic ? '6/9' : lyd ? 'maj7#11' : 'maj9', 2], ['maj13', 1], [lyd ? 'maj9#11' : 'maj9', 1]]);
  }
  if (kind === 'min') {
    if (L <= 1) return 'min';
    if (L === 2) return wpick([['min', 1], ['m7', 3]]);
    if (L === 3) return wpick([['m7', 3], ['m9', 1], [tonic ? 'm6' : 'madd9', 1]]);
    if (L === 4) return wpick([['m9', 3], ['m11', 1], [tonic ? 'mMaj7' : 'm7', 1]]);
    return wpick([['m9', 2], ['m11', 2], [tonic ? 'm6/9' : 'm13', 1]]);
  }
  // dominants: a triad at first, then sevenths, then 9ths and 13ths, altered when they resolve to minor; ♭VII7 and
  // other dominants that don't resolve down a fifth stay unaltered
  if (plain) return L <= 1 ? (chance(0.5) ? '7' : 'maj') : L <= 3 ? '7' : wpick([['9', 2], ['13', 1], ['7', 1]]);
  if (L <= 1) return sub ? '7' : chance(0.3) ? '7' : 'maj';
  if (L === 2) return '7';
  if (L === 3) return toMinor ? wpick([['7', 2], ['7b9', 1]]) : wpick([['7', 3], ['9', 1]]);
  if (L === 4) return toMinor ? wpick([['7b9', 2], ['7#9', 1], ['7b13', 1]]) : wpick([['9', 2], ['13', 2], ['7', 1]]);
  return toMinor ? wpick([['7alt', 2], ['7b9b13', 1], ['7#9', 1]]) : wpick([['13', 2], ['13b9', 1], ['7#11', 1], ['7alt', 1]]);
}

// ---------- the key's chords, by symbol ----------
const MAJ = { I: ['1', 'maj'], ii: ['2', 'min'], iii: ['3', 'min'], IV: ['4', 'maj'], V: ['5', 'dom'], vi: ['6', 'min'], vii: ['7', 'hd'],
  iv: ['4', 'min'], bVI: ['b6', 'maj'], bVII: ['b7', 'dom'], bIII: ['b3', 'maj'], bII: ['b2', 'maj'], bII7: ['b2', 'dom'], bVII7: ['b7', 'dom'], bVI7: ['b6', 'aug6'], iiø: ['2', 'hd'], Vsus: ['5', 'sus'] };
const MIN = { i: ['1', 'min'], ii: ['2', 'hd'], III: ['b3', 'maj'], iv: ['4', 'min'], v: ['5', 'min'], V: ['5', 'dom'], VI: ['b6', 'maj'], VII: ['b7', 'dom'], vii: ['7', 'dim'],
  IV: ['4', 'maj'], I: ['1', 'maj'], bII: ['b2', 'maj'], bII7: ['b2', 'dom'], VI7: ['b6', 'aug6'], VII7: ['b7', 'dom'], Vsus: ['5', 'sus'] };
const ch = (minor, sym, extra = {}) => { const [iv, kind] = (minor ? MIN : MAJ)[sym]; return { iv, kind, sym, ...extra }; };
const isTonic = (c) => SEMI(c.iv) === 0 && (c.kind === 'maj' || c.kind === 'min');

// openings: how a phrase sets out from home, before its cadence (weights rise or fall with the level)
const OPEN = {
  major: [[['I', 'IV'], 3, 1], [['I', 'vi'], 3, 1], [['I', 'vi', 'IV'], 3, 1], [['I', 'IV', 'vi'], 2, 1], [['I', 'V', 'vi', 'IV'], 2, 1], [['I', 'iii', 'vi'], 2, 2], [['I', 'vi', 'ii'], 2, 2],
    [['I', 'ii', 'iii', 'IV'], 1, 2], [['vi', 'IV', 'I'], 1, 2], [['I', 'iii', 'IV'], 1, 2], [['I', 'bVII', 'IV'], 1, 3], [['I', 'iv'], 1, 3], [['I', 'bVI', 'bVII'], 1, 3], [['I', 'bIII', 'IV'], 1, 4]],
  minor: [[['i', 'iv'], 3, 1], [['i', 'VI'], 3, 1], [['i', 'VI', 'III', 'VII'], 3, 1], [['i', 'VII', 'VI'], 2, 1], [['i', 'iv', 'VII', 'III'], 2, 2], [['i', 'III', 'VII'], 2, 2], [['i', 'v', 'VI'], 1, 2],
    [['i', 'ii', 'v'], 1, 2], [['i', 'IV'], 1, 3], [['i', 'VI', 'iv'], 2, 1]],
};
// cadences: how a phrase closes. say = what the voice says, text = the screen's line; the last chord is the arrival
const CAD = {
  major: [
    { L: 1, w: 4, say: 'perfect cadence', text: 'Perfect cadence: V to I, home', ch: [['IV', 'ii'], 'V', 'I'] },
    { L: 1, w: 3, say: 'plagal cadence', text: 'Plagal cadence: IV to I, the “amen”', ch: ['IV', 'I'] },
    { L: 1, w: 2, say: 'half cadence', text: 'Half cadence: resting on V, a question', ch: [['ii', 'IV', 'vi'], 'V'], open: true },
    { L: 2, w: 3, say: 'deceptive cadence', text: 'Deceptive cadence: V goes to vi instead of home', ch: [['IV', 'ii'], 'V', 'vi'], open: true },
    { L: 2, w: 3, say: 'two five one', text: 'ii–V–I: the jazz cadence', ch: ['ii', 'V', 'I'] },
    { L: 2, w: 2, say: 'suspension', text: 'Suspended cadence: the 4 over V falls to the 3, then home', ch: ['IV', 'Vsus', 'V', 'I'] },
    { L: 3, w: 3, say: 'minor plagal cadence', text: 'Minor plagal: IV, then iv borrowed from minor, then I', ch: ['IV', 'iv', 'I'] },
    { L: 3, w: 2, say: 'flat seven to one', text: 'Mixolydian cadence: ♭VII to I', ch: ['IV', 'bVII', 'I'] },
    { L: 3, w: 2, say: 'Aeolian cadence', text: 'Aeolian cadence: ♭VI, ♭VII, I', ch: ['bVI', 'bVII', 'I'] },
    { L: 4, w: 3, say: 'backdoor cadence', text: 'Backdoor cadence: iv7 to ♭VII7 to I', ch: ['iv', 'bVII7', 'I'] },
    { L: 4, w: 3, say: 'tritone substitute', text: 'Tritone sub: ♭II7 stands in for V7, the bass slides down a half step', ch: ['ii', 'bII7', 'I'] },
    { L: 4, w: 2, say: 'deceptive, to flat six', text: 'Deceptive cadence to ♭VI: a borrowed chord where I should be', ch: ['ii', 'V', 'bVI'], open: true },
    { L: 5, w: 2, say: 'Neapolitan sixth', text: 'Neapolitan sixth: ♭II with its 3rd in the bass, to V, home', ch: ['bII', 'V', 'I'], n6: 0 },
    { L: 5, w: 2, say: 'augmented sixth', text: 'Augmented sixth: ♭VI7 spreads out onto V', ch: ['bVI7', 'V', 'I'] },
  ],
  minor: [
    { L: 1, w: 4, say: 'perfect cadence', text: 'Perfect cadence: V to i, home', ch: ['iv', 'V', 'i'] },
    { L: 1, w: 3, say: 'plagal cadence', text: 'Plagal cadence: iv to i', ch: ['iv', 'i'] },
    { L: 1, w: 2, say: 'half cadence', text: 'Half cadence: resting on V', ch: ['iv', 'V'], open: true },
    { L: 2, w: 3, say: 'deceptive cadence', text: 'Deceptive cadence: V goes to VI instead of home', ch: ['iv', 'V', 'VI'], open: true },
    { L: 2, w: 3, say: 'minor two five one', text: 'Minor ii–V–i: half-diminished ii, dominant V', ch: ['ii', 'V', 'i'] },
    { L: 2, w: 2, say: 'Andalusian cadence', text: 'Andalusian cadence: i, VII, VI, V, stepping down', ch: ['i', 'VII', 'VI', 'V'], open: true },
    { L: 3, w: 2, say: 'Phrygian half cadence', text: 'Phrygian half cadence: iv with its 3rd in the bass, the bass falling a half step to V', ch: ['iv', 'V'], open: true, phr: 0 },
    { L: 3, w: 2, say: 'Aeolian cadence', text: 'Aeolian cadence: VI, VII, i', ch: ['VI', 'VII', 'i'] },
    { L: 3, w: 2, say: 'Picardy third', text: 'Picardy third: a minor piece ends on a major I', ch: ['iv', 'V', 'I'] },
    { L: 3, w: 2, say: 'Dorian four', text: 'Dorian plagal: a major IV, from Dorian, to i', ch: ['IV', 'i'] },
    { L: 4, w: 2, say: 'tritone substitute', text: 'Tritone sub: ♭II7 for V7, sliding down a half step to i', ch: ['ii', 'bII7', 'i'] },
    { L: 4, w: 2, say: 'Neapolitan sixth', text: 'Neapolitan sixth: ♭II with its 3rd in the bass, to V, home', ch: ['bII', 'V', 'i'], n6: 0 },
    { L: 5, w: 2, say: 'augmented sixth', text: 'Augmented sixth: VI7 spreads out onto V', ch: ['VI7', 'V', 'i'] },
  ],
};

// ---------- elaborations: what gets slipped in as the level rises ----------
const romanOf = (c) => numeral(c.iv, toTriad(c.q || (c.kind === 'min' ? 'min' : c.kind === 'hd' || c.kind === 'dim' ? 'dim' : 'maj')));
const stepWord = (s) => ({ 1: 'half step', 2: 'whole step' }[s] || '');
function elaborate(list, L, minor) {
  const out = [];
  for (let i = 0; i < list.length; i++) {
    const c = list[i], n = list[i + 1];
    out.push(c);
    if (!n) break;
    const a = SEMI(c.iv), b = SEMI(n.iv), up = ((b - a) % 12 + 12) % 12;
    const tgtOk = !isTonic(n) && (n.kind === 'maj' || n.kind === 'min') && !n.locked;
    // a walking bass: I – V/7 – vi, or I – I/3 – IV
    if (L >= 2 && !c.locked && chance(0.18)) {
      if (!minor && isTonic(c) && SEMI(n.iv) === 9 && n.kind === 'min') { out.push({ iv: '5', kind: 'maj', q: 'maj', bass: '3', ins: true, ann: { say: 'walking bass', text: 'Passing chord: V with its 3rd in the bass, so the bass steps down to vi' } }); continue; }
      if (isTonic(c) && SEMI(n.iv) === 5) { out.push({ iv: '1', kind: c.kind, bass: minor ? 'b3' : '3', ins: true, ann: { say: 'walking bass', text: 'Passing inversion: I with its 3rd in the bass walks up to IV' } }); continue; }
    }
    // a passing diminished chord between two chords a whole step apart
    if (L >= 4 && up === 2 && chance(0.4) && !n.locked) { out.push({ iv: ivSharp(a + 1), kind: 'dim', role: 'pass', ins: true, ann: { say: 'passing diminished', text: `Passing diminished: the bass climbs by half steps from ${romanOf(c)} to ${romanOf(n)}` } }); continue; }
    if (tgtOk && L >= 4 && chance(0.25)) {
      // ii–V into the next chord (the V sometimes a tritone sub)
      const t = romanOf(n), toMinor = n.kind === 'min';
      const sub = chance(0.35);
      out.push({ iv: ivAt(b + 2), kind: toMinor ? 'hd' : 'min', ins: true, rel: { fn: 'ii', to: t }, ann: { say: `two five into ${t}`, text: `ii–V into ${t}: its own two and five` } });
      out.push(sub ? { iv: ivFlat(b + 1), kind: 'dom', ins: true, toMinor, ann: { say: 'tritone sub', text: `Tritone sub: the V of ${t} replaced by the dominant a tritone away, sliding down a half step` } } : { iv: ivAt(b + 7), kind: 'dom', ins: true, toMinor, rel: { fn: 'V', to: t } });
      continue;
    }
    if (tgtOk && L >= 3 && chance(0.3)) {
      const t = romanOf(n), toMinor = n.kind === 'min';
      if (L >= 4 && chance(0.3)) out.push({ iv: ivFlat(b + 1), kind: 'dom', ins: true, toMinor, ann: { say: 'tritone sub', text: `Tritone sub for V of ${t}: the bass slides down a half step` } });
      else out.push({ iv: ivAt(b + 7), kind: 'dom', ins: true, toMinor, rel: { fn: 'V', to: t }, ann: { say: 'secondary dominant', text: `Secondary dominant: V of ${t}, borrowed from ${t}’s own key` } });
      continue;
    }
    // a chromatic mediant: a major chord a third away, sharing one note with home
    if (L >= 5 && isTonic(c) && chance(0.3)) {
      const s = pick([3, 4, 8, 9]);
      out.push({ iv: ivAt(s), kind: 'maj', ins: true, ann: { say: 'chromatic mediant', text: `Chromatic mediant: a major chord a ${s === 3 || s === 9 ? 'minor' : 'major'} third ${s < 6 ? 'up' : 'down'}, one note in common` } });
      continue;
    }
    // a dominant leaning on its 4th first
    if (L >= 2 && c.kind === 'dom' && !c.rel && SEMI(c.iv) === 7 && !c.ins && out[out.length - 2]?.kind !== 'sus' && chance(0.15) && out.length > 1) { out.splice(out.length - 1, 0, { iv: '5', kind: 'sus', ins: true, ann: { say: 'suspension', text: 'Suspension: the 4 over V, about to fall to the 3' } }); }
  }
  // borrowed colour: swap a IV for iv or a vi for ♭VI (major), a iv for IV (minor), mid-phrase only
  if (L >= 3) for (const c of out) {
    if (c.locked || c.ins || c.ann) continue;
    if (!minor && c.sym === 'IV' && chance(0.25)) Object.assign(c, { kind: 'min', sym: 'iv', ann: { say: 'borrowed from minor', text: 'iv borrowed from the parallel minor: the 6 drops a half step' } });
    else if (!minor && c.sym === 'vi' && chance(0.2)) Object.assign(c, { iv: 'b6', kind: 'maj', sym: 'bVI', ann: { say: 'borrowed flat six', text: '♭VI borrowed from the parallel minor' } });
    else if (minor && c.sym === 'iv' && chance(0.2)) Object.assign(c, { kind: 'maj', sym: 'IV', ann: { say: 'Dorian four', text: 'A major IV: the raised 6 from Dorian' } });
  }
  return out;
}

// ---------- key changes ----------
const MODS = [
  { L: 3, rel: true, say: 'the relative', text: (k, mi) => `to ${k}, the relative ${mi ? 'minor' : 'major'}: same notes, a new home` },
  { L: 3, off: 7, say: 'up a fifth', text: (k) => `to ${k}, the dominant key: up a fifth` },
  { L: 3, off: 5, say: 'up a fourth', text: (k) => `to ${k}, the subdominant key: up a fourth` },
  { L: 4, par: true, say: 'the parallel', text: (k) => `to ${k}: the same tonic, the other mode` },
  { L: 4, off: 2, say: 'up a whole step', text: (k) => `to ${k}, up a whole step` },
  { L: 4, off: 10, say: 'down a whole step', text: (k) => `to ${k}, down a whole step` },
  { L: 5, off: 4, say: 'a chromatic mediant key', text: (k) => `to ${k}, a major third up: a chromatic mediant key` },
  { L: 5, off: 8, say: 'a chromatic mediant key', text: (k) => `to ${k}, a major third down: a chromatic mediant key` },
  { L: 5, off: 3, say: 'up a minor third', text: (k) => `to ${k}, up a minor third` },
  { L: 5, off: 1, say: 'up a half step', text: (k) => `to ${k}, up a half step: the truck driver’s change` },
];

// ---------- harmonic rhythm: how many beats each chord lasts ----------
function lengths(list, rhythm, bar, L) {
  const half = bar % 2 === 0 ? bar / 2 : bar;
  list.forEach((c, i) => {
    const last = i === list.length - 1;
    if (rhythm === 'steady') c.beats = bar;
    else if (rhythm === 'slow') c.beats = c.ins ? bar : last ? bar * 4 : bar * 2;
    else c.beats = c.ins ? half : last ? bar * 2 : i === 0 ? wpick([[bar, 2], [bar * 2, 1]]) : i === list.length - 2 ? bar : wpick([[bar, 5], [bar * 2, 3], [half, half < bar && L >= 2 ? 1.5 : 0]]);
  });
}

// the composer: next() gives one chord at a time
export function meander({ minor = false, level = 3, grow = true, modulate = true, rhythm = 'varied', bar = 4 } = {}) {
  const home = { off: 0, minor };
  let key = { ...home }, phrases = 0, away = 0, buf = [], lastSym = null, pendingMod = null;
  const cur = () => (grow ? Math.min(level, 1 + Math.floor(phrases / 2)) : level);
  function phrase() {
    const L = cur(), mk = key.minor ? 'minor' : 'major';
    // openings and cadences the level allows; higher levels lean on the newer ones
    const ops = OPEN[mk].filter(([, , l]) => l <= L).map(([o, w, l]) => [o, w * (l === L ? 1.6 : 1)]);
    const cads = CAD[mk].filter((c) => c.L <= L).map((c) => [c, c.w * (c.L === L && L > 1 ? 1.8 : 1)]);
    const open = wpick(ops), cad = wpick(cads);
    let list = open.map((s) => ch(key.minor, s));
    // the cadence: chords as written (a pair is a choice), the last one carries the cadence's name
    const tail = cad.ch.map((s, i) => ch(key.minor, Array.isArray(s) ? pick(s) : s, { cad: true, last: i === cad.ch.length - 1, locked: i >= cad.ch.length - 2 }));
    if (cad.n6 !== undefined) tail[cad.n6] = { ...tail[cad.n6], bass: '3', role: 'n6' };
    if (cad.phr !== undefined) tail[cad.phr] = { ...tail[cad.phr], bass: 'b3' };
    tail[tail.length - 1].ann = { say: cad.say, text: cad.text };
    // join, without the same chord twice in a row
    for (const t of tail) { const p = list[list.length - 1]; if (p && p.iv === t.iv && p.kind === t.kind && !t.bass) { if (t.ann) p.ann = t.ann; Object.assign(p, { cad: t.cad, last: t.last, locked: t.locked }); } else list.push(t); }
    // the last phrase already landed on this chord (and holds it): start from the next one
    if (list.length > 2 && lastSym && list[0].iv === lastSym.iv && list[0].kind === lastSym.kind && key.off === lastSym.off) list.shift();
    list = elaborate(list, L, key.minor);
    // qualities for this level
    for (let i = 0; i < list.length; i++) {
      const c = list[i], n = list[i + 1];
      const toMinor = c.toMinor ?? ((key.minor && SEMI(c.iv) === 7 && !c.rel) || (n ? n.kind === 'min' || n.kind === 'hd' : false));
      const plain = c.kind === 'dom' && SEMI(c.iv) === 10 && !c.rel;
      c.q = c.q || colour(c.kind, L, { tonic: isTonic(c), sub: !!c.rel, toMinor, plain, role: c.role, lyd: SEMI(c.iv) === 8 || (!key.minor && SEMI(c.iv) === 5) });
      if (c.sym === 'I' && key.minor && c.ann?.say === 'Picardy third') c.q = L >= 4 ? 'maj9' : L >= 2 ? 'maj7' : 'maj';
    }
    lengths(list, rhythm, bar, L);
    const out = list.map((c) => ({ spec: { iv: c.iv, q: c.q, ...(c.rel ? { rel: c.rel } : {}), ...(c.bass ? { bass: c.bass } : {}) }, key: { ...key }, beats: c.beats, ann: c.ann ? [c.ann] : [], level: L }));
    if (pendingMod) { out[0].ann.unshift(pendingMod); pendingMod = null; }
    if (L > cur.lastL) out[0].levelUp = L;
    cur.lastL = L;
    phrases++;
    lastSym = { iv: list[list.length - 1].iv, kind: list[list.length - 1].kind, off: key.off };
    // after the phrase: maybe a new key, reached through its own V7 (or straight in, for the parallel)
    if (modulate && L >= 3) {
      if (key.off !== home.off || key.minor !== home.minor) away++;
      const goHome = away >= 2 && chance(0.6);
      if (goHome || ((away === 0 || (L >= 5 && chance(0.4))) && chance(L === 3 ? 0.22 : L === 4 ? 0.3 : 0.4))) {
        let next, how;
        if (goHome) { next = { ...home }; how = { say: 'home again', text: () => 'Home again' }; away = 0; }
        else {
          const m = pick(MODS.filter((x) => x.L <= L));
          next = m.rel ? { off: (key.off + (key.minor ? 3 : 9)) % 12, minor: !key.minor } : m.par ? { off: key.off, minor: !key.minor } : { off: (key.off + m.off) % 12, minor: key.minor };
          how = m;
        }
        const viaV = !(next.off === key.off) && chance(0.8);
        if (viaV) {
          // the new key's dominant, heard in the new key
          out.push({ spec: { iv: '5', q: colour('dom', L, { toMinor: next.minor }) }, key: { ...next }, beats: bar, ann: [{ say: 'heading for {key}', text: 'Heading for {key}: its own V7 leads the way', mod: true }], level: L });
        }
        pendingMod = { say: goHome ? 'home again, {key}' : 'new key, {key}', text: goHome ? 'Home again: {key}' : `New key: ${how.text('{key}', next.minor)}`, mod: true };
        if (key.off === next.off && key.minor === next.minor) pendingMod = null;
        key = next;
      }
    }
    return out;
  }
  return {
    level: () => cur(),
    key: () => key,
    next() { if (!buf.length) buf = phrase(); return buf.shift(); },
  };
}

// ---------- describing a move between any two chords (for loops and random chords) ----------
const kindOf = (q) => { const ivs = T.getChord(q).ivs; const has = (x) => ivs.includes(x); if (has('b3') && has('b5')) return 'dim'; if (has('b7') && has('3')) return 'dom'; if (has('b3')) return 'min'; if (has('4') && !has('3')) return 'sus'; return 'maj'; };
export function describe(prev, cur, minor) {
  if (!prev) return null;
  const a = SEMI(prev.iv), b = SEMI(cur.iv), ka = kindOf(prev.q), kb = kindOf(cur.q), mv = ((b - a) % 12 + 12) % 12;
  const tonicNow = b === 0 && (kb === 'maj' || kb === 'min') && !cur.bass;
  if (tonicNow && a === 7 && (ka === 'dom' || ka === 'maj')) return { say: 'perfect cadence', text: 'Perfect cadence: V to I' };
  if (tonicNow && a === 5 && ka === 'min' && !minor) return { say: 'minor plagal cadence', text: 'Minor plagal: iv to I' };
  if (tonicNow && a === 5) return { say: 'plagal cadence', text: 'Plagal cadence: IV to I' };
  if (tonicNow && a === 10) return { say: 'flat seven to one', text: '♭VII to I: the Mixolydian cadence' };
  if (tonicNow && a === 1 && ka === 'dom') return { say: 'tritone sub', text: 'Tritone sub: ♭II7 to I' };
  if (tonicNow && a === 11 && ka === 'dim') return { say: 'leading tone', text: 'vii° to I: the leading-tone chord resolves' };
  if (a === 7 && ka === 'dom' && ((b === 9 && !minor) || (b === 8 && minor))) return { say: 'deceptive cadence', text: 'Deceptive cadence: V to vi' };
  if (cur.rel) return { say: 'secondary dominant', text: `Secondary dominant: V of ${T.prettyRoman(cur.rel.to)}` };
  if ((mv === 3 || mv === 4 || mv === 8 || mv === 9) && ka === kb && (ka === 'maj') && Math.abs(a - b) % 12 && ![0, 5, 7].includes(b)) return { say: 'chromatic mediant', text: 'Chromatic mediant: a third away, same quality' };
  if (mv === 5 && ka === 'dom') return { say: 'down a fifth', text: 'Root down a fifth: the strongest pull' };
  return null;
}
