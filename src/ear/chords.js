// Chords: one chord at a time, name its type (and, later, which of its notes is in the bass). Levels go from major or
// minor up through sevenths, inversions and extensions to any chord at all. Every chord is a real guitar voicing, so
// the fingering can be shown with the answer and what you see is exactly what you heard.
import * as T from '../theory.js';
import * as F from '../fretboard.js';

const t = (s) => s.trim().split(/\s+/);
// pass: N right out of the last M; a `streak` level needs N right in a row
export const PASS = { need: 16, of: 20 };

export const TIERS = [
  { id: 'triads', title: 'Triads', levels: [
    { id: 'k1', title: 'Major or minor', tip: 'Major is bright and settled; minor is darker. Only the middle note differs: the 3rd, a half step apart.', q: t('maj min') },
    { id: 'k2', title: 'Diminished, augmented', tip: 'Diminished is minor squeezed tight (a ♭5): tense, wanting to move. Augmented is major stretched (a ♯5): floating, dreamlike, unresolved.', q: t('maj min dim aug') },
    { id: 'k3', title: 'Suspended', tip: 'A sus chord has no 3rd, so it is neither major nor minor: open, waiting. sus4 leans to resolve down; sus2 is airy and still.', q: t('maj min sus2 sus4') },
    { id: 'k4', title: 'Every triad', tip: 'All six. Listen for the 3rd first (major, minor or none), then the 5th (perfect, flat or sharp).', q: t('maj min dim aug sus2 sus4') },
  ] },
  { id: 'inversions', title: 'Triad inversions', levels: [
    { id: 'k5', title: 'The bass note', tip: 'The same major or minor chord with its root, 3rd or 5th lowest. Root position is solid; over the 3rd it is lighter and leans; over the 5th it is unstable, wanting to move.', q: t('maj min'), inv: true },
    { id: 'k6', title: 'Triads inverted', tip: 'Type first, then the bass. Sing the lowest note and ask which chord tone it is.', q: t('maj min dim sus4'), inv: true },
  ] },
  { id: 'sevenths', title: 'Seventh chords', levels: [
    { id: 'k7', title: 'The big three', tip: 'maj7: soft, a little bittersweet (the 7th a half step under the octave). 7: bluesy, restless, the dominant. m7: mellow, the minor with a cushion.', q: t('maj7 7 m7') },
    { id: 'k8', title: 'Diminished sevenths', tip: 'ø7 is a minor 7 with a ♭5: dark but open. °7 is stacked minor 3rds: the horror-film chord, tense and symmetrical.', q: t('maj7 7 m7 m7b5 dim7') },
    { id: 'k9', title: 'Sixths and more', tip: '6 is major with a sweet added 6th (no 7th). m6 is bittersweet, film-noir. m(maj7) is the spy chord. 7sus4 is a dominant with its 3rd held back.', q: t('maj7 7 m7 m7b5 dim7 6 m6 mMaj7 7sus4') },
    { id: 'k10', title: 'Sevenths inverted', tip: 'Four notes, four possible basses. With the 7th in the bass the chord falls: it wants to step down.', q: t('maj7 7 m7 m7b5'), inv: true },
  ] },
  { id: 'extensions', title: 'Extensions', levels: [
    { id: 'k11', title: 'Ninths', tip: 'A 9th is the 2nd an octave up: it adds shimmer. add9 has no 7th; maj9, 9 and m9 sit on their seventh chords.', q: t('maj7 7 m7 add9 maj9 9 m9') },
    { id: 'k12', title: 'Sixes and sus', tip: '6/9 is the open, pentatonic chord that ends a jazz tune. 9sus4 is the soul and fusion sound: the dominant floating without its 3rd.', q: t('6 6/9 7sus4 9sus4 sus2 add9') },
    { id: 'k13', title: 'Altered dominants', tip: 'All dominant 7ths, coloured by what is added: ♭9 dark and Spanish, ♯9 the gritty Hendrix chord, ♯11 bright and Lydian, ♯5 whole-tone and pushing.', q: t('7 7b9 7#9 7#11 7#5') },
    { id: 'k14', title: 'Elevenths, thirteenths', tip: 'Big stacks. m11 is wide and modal; maj7♯11 the Lydian chord; 13 a dominant with the 6th on top; maj13 and m13 lush endings.', q: t('m11 maj7#11 13 m13 maj13 9 m9') },
  ] },
  { id: 'mastery', title: 'Mastery', levels: [
    { id: 'k15', title: 'Any chord', tip: 'Thirty-one chord types. Find the 3rd, then the 7th (or 6th), then whatever is on top.', q: t('maj min dim aug sus2 sus4 maj7 7 m7 m7b5 dim7 mMaj7 6 m6 7sus4 add9 maj9 9 m9 6/9 9sus4 7b9 7#9 7#11 7#5 m11 maj7#11 13 m13 maj13') },
    { id: 'k16', title: 'The gauntlet', tip: 'Anything: every type, and triads and sevenths in any inversion. Twenty right in a row beats it.', q: t('maj min dim aug sus2 sus4 maj7 7 m7 m7b5 dim7 mMaj7 6 m6 7sus4 add9 maj9 9 m9 6/9 9sus4 7b9 7#9 7#11 7#5 m11 maj7#11 13 m13 maj13'), inv: 'some', streak: 20 },
  ] },
];
export const LEVELS = TIERS.flatMap((tier) => tier.levels.map((l) => ({ ...l, tier: tier.id, tierTitle: tier.title })));

// ---------- names ----------
export const BUTTON = {
  maj: 'maj', min: 'm', dim: '°', aug: '+', sus2: 'sus2', sus4: 'sus4', maj7: 'maj7', '7': '7', m7: 'm7', m7b5: 'ø7', dim7: '°7',
  mMaj7: 'm(maj7)', '6': '6', m6: 'm6', '7sus4': '7sus4', add9: 'add9', maj9: 'maj9', '9': '9', m9: 'm9', '6/9': '6/9', '9sus4': '9sus4',
  '7b9': '7♭9', '7#9': '7♯9', '7#11': '7♯11', '7#5': '7♯5', m11: 'm11', 'maj7#11': 'maj7♯11', '13': '13', m13: 'm13', maj13: 'maj13',
};
const SPOKEN_Q = {
  maj: 'major', min: 'minor', dim: 'diminished', aug: 'augmented', sus2: 'sus two', sus4: 'sus four', maj7: 'major seven', '7': 'seven',
  m7: 'minor seven', m7b5: 'half diminished', dim7: 'diminished seven', mMaj7: 'minor major seven', '6': 'six', m6: 'minor six',
  '7sus4': 'seven sus four', add9: 'add nine', maj9: 'major nine', '9': 'nine', m9: 'minor nine', '6/9': 'six nine', '9sus4': 'nine sus four',
  '7b9': 'seven flat nine', '7#9': 'seven sharp nine', '7#11': 'seven sharp eleven', '7#5': 'seven sharp five', m11: 'minor eleven',
  'maj7#11': 'major seven sharp eleven', '13': 'thirteen', m13: 'minor thirteen', maj13: 'major thirteen',
};
export const NAME = {
  maj: 'major', min: 'minor', dim: 'diminished', aug: 'augmented', sus2: 'sus2', sus4: 'sus4', maj7: 'major 7', '7': 'dominant 7',
  m7: 'minor 7', m7b5: 'half-diminished', dim7: 'diminished 7', mMaj7: 'minor-major 7', '6': 'major 6', m6: 'minor 6', '7sus4': '7sus4',
  add9: 'add 9', maj9: 'major 9', '9': 'dominant 9', m9: 'minor 9', '6/9': '6/9', '9sus4': '9sus4', '7b9': '7♭9', '7#9': '7♯9',
  '7#11': '9♯11', '7#5': '7♯5 (augmented 7)', m11: 'minor 11', 'maj7#11': 'major 7♯11 (Lydian)', '13': 'dominant 13', m13: 'minor 13', maj13: 'major 13',
};
// what each chord is and where it lives
export const ABOUT = {
  maj: 'A major 3rd and a perfect 5th. I, IV and V of a major key.',
  min: 'A minor 3rd and a perfect 5th. ii, iii and vi of a major key; i, iv and v of a minor one.',
  dim: 'Two minor 3rds: the 5th is flat. vii° of a major key, ii° of a minor key; it wants to resolve inward.',
  aug: 'Two major 3rds: the 5th is sharp. ♭III+ of harmonic minor; a passing chord that splits the octave in three.',
  sus2: 'The 3rd replaced by the 2nd. Open and still; common in folk, rock and ambient guitar.',
  sus4: 'The 3rd replaced by the 4th, which wants to fall back to the 3rd. The classical suspension; Vsus4–V.',
  maj7: 'A major triad and the major 7th, a half step under the octave. Imaj7 and IVmaj7 of a major key.',
  '7': 'A major triad and the minor 7th. V7 of any key: its 3rd and 7th make a tritone that pulls home. Every chord of a blues.',
  m7: 'A minor triad and the minor 7th. ii7, iii7 and vi7 of a major key; the i7 of Dorian vamps.',
  m7b5: 'A diminished triad and the minor 7th. viiø7 of a major key, iiø7 of the minor ii–V–i.',
  dim7: 'Stacked minor 3rds, the 7th a double flat. vii°7 of harmonic minor; symmetrical, so any of its notes can be the root.',
  mMaj7: 'A minor triad with the major 7th. i of harmonic and melodic minor; the line cliché’s second chord; the spy-film chord.',
  '6': 'A major triad with the 6th added. The swing-era tonic; it has the same notes as the m7 a minor 3rd below.',
  m6: 'A minor triad with the major 6th. The tonic of melodic minor and of minor-key swing; Dorian’s i chord.',
  '7sus4': 'A dominant 7th with its 3rd held back as the 4th. V7sus4, before the V7; also its own floating colour.',
  add9: 'A major triad with the 9th added and no 7th. The shimmering open chord of pop and rock guitar.',
  maj9: 'A major 7th with the 9th on top. A lush Imaj or IVmaj in jazz, neo-soul and bossa.',
  '9': 'A dominant 7th with the natural 9th. Funk, blues and jazz dominants; V9.',
  m9: 'A minor 7th with the 9th. ii9 and the Dorian i9 of soul, jazz and lo-fi.',
  '6/9': 'A major triad with the 6th and 9th: a pentatonic chord, no 7th. The classic jazz final chord.',
  '9sus4': 'A dominant with its 4th for a 3rd and the 9th: really IV over V (F/G). Soul, gospel and fusion; the Herbie Hancock sound.',
  '7b9': 'A dominant 7th with the flat 9th. V7♭9 of a minor key: dark, Spanish, pulling hard to minor.',
  '7#9': 'A dominant 7th with the sharp 9th, which clashes against the 3rd like a blue note. The “Hendrix chord” of Purple Haze.',
  '7#11': 'A dominant 9 with the sharp 11th: Lydian dominant (melodic minor’s 4th mode). Bright, the bII7 tritone sub, IV7 of a Lydian blues.',
  '7#5': 'A dominant 7th with a sharp 5th: an augmented triad with the 7th. Whole-tone; a pushing V7♯5 into I.',
  m11: 'A minor 9 with the 11th: stacked 4ths on top. Modal jazz (So What), the Dorian i11.',
  'maj7#11': 'A major 7th with the sharp 11th. The Lydian chord: IVmaj7 lifted, film-score wonder.',
  '13': 'A dominant 7th with the 13th (the 6th) on top. Big band and blues; V13 of a major key.',
  m13: 'A minor 9 with the 13th. The Dorian chord in full: ii13, the i13 of modal vamps.',
  maj13: 'A major 9 with the 13th on top. A full, lush major tonic.',
};

// spelled roots the chords are built on (and how the narrator says them)
const ROOTS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
const SPOKEN_ROOT = { C: 'C', Db: 'D flat', D: 'D', Eb: 'E flat', E: 'E', F: 'F', 'F#': 'F sharp', G: 'G', Ab: 'A flat', A: 'A', Bb: 'B flat', B: 'B' };
const INV_WORD = ['root position', 'first inversion', 'second inversion', 'third inversion'];
export const spoken = (root, q) => `${SPOKEN_ROOT[root]} ${SPOKEN_Q[q]}`;
export const spokenInv = (inv) => (inv ? INV_WORD[inv] : null);
// every line the chord narrator can say
export const LINES = [...ROOTS.flatMap((r) => Object.keys(SPOKEN_Q).map((q) => spoken(r, q))), ...INV_WORD.slice(1)];

// the chord tones that can be in the bass, in order: root, 3rd (or its sus), 5th, 7th (or 6th)
export function tones(q) {
  const ivs = T.getChord(q).ivs;
  const third = ivs.find((x) => ['3', 'b3', '4', '2'].includes(x));
  const fifth = ivs.find((x) => ['5', 'b5', '#5'].includes(x));
  const seventh = ivs.find((x) => ['7', 'b7', 'bb7', '6'].includes(x));
  return ['1', third, fifth, seventh].filter(Boolean);
}
export const BASS = ['root', '3rd', '5th', '7th'];
export const bassName = (q, inv) => (inv === 3 && tones(q)[3] === '6' ? '6th' : inv === 1 && /^[24]$/.test(tones(q)[1]) ? (tones(q)[1] === '4' ? '4th' : '2nd') : BASS[inv]);
const pcsOf = (rootPc, q) => [...new Set(T.getChord(q).ivs.map((iv) => (rootPc + T.intervalSemis(F.simpleIv(iv))) % 12))].sort((a, b) => a - b).join();

// ---------- a round ----------
const pick = (arr, w = () => 1) => { const ws = arr.map(w); let r = Math.random() * ws.reduce((a, b) => a + b, 0); for (let i = 0; i < arr.length; i++) if ((r -= ws[i]) <= 0) return arr[i]; return arr[arr.length - 1]; };
// a chord: {root (spelled), rootPc, q, inv (index into tones(q)), bassPc, notes: [{string, fret, midi, iv}]}
// `miss` weights the types you got wrong lately, so they come round more often
export function makeChord(level, { miss = {}, last = null } = {}) {
  let q, inv, root;
  for (let tries = 0; tries < 8; tries++) {
    q = pick(level.q, (x) => 1 + 2 * (miss[x] || 0));
    const canInv = level.inv && tones(q).length >= 3 && (level.inv !== 'some' || T.getChord(q).ivs.length <= 4);
    inv = canInv && (level.inv === true || Math.random() < 0.4) ? Math.floor(Math.random() * tones(q).length) : 0;
    root = pick(ROOTS);
    if (!last || last.q !== q || last.inv !== inv) break;
  }
  return build(root, q, inv);
}
export function build(root, q, inv = 0) {
  const r = T.parseNote(root);
  const rootPc = T.notePc(r);
  const bassIv = tones(q)[inv];
  const bassPc = (rootPc + T.intervalSemis(F.simpleIv(bassIv))) % 12;
  return { root, rootPc, q, inv, bassPc, pcs: pcsOf(rootPc, q), notes: guitar(r, q, bassIv) };
}

// a guitar voicing with `bassIv` lowest: a full barre grip in root position where one exists (and sounds like the
// chord), else a drop-2 / drop-3 / close voicing on adjacent strings, at a random place on the neck
function guitar(r, q, bassIv) {
  const target = 2 + Math.floor(Math.random() * 7);
  const bassPc = (T.notePc(r) + T.intervalSemis(F.simpleIv(bassIv))) % 12;
  const ok = (p) => p && p.notes.length >= 3 && Math.min(...p.notes.map((n) => n.midi)) % 12 === bassPc && p.maxFret <= 15;
  const n = T.getChord(q).ivs.length;
  if (bassIv === '1' && Math.random() < 0.6) {
    const g = F.gripFor(r, q, target);
    if (ok(g) && covers(g, r, q)) return label(g, r);
  }
  // the big chords: the guitarist's grips, root low and the colour on top (the 5th, and often the 9th, left out)
  if (ORDERS[q] && bassIv === '1') {
    const cands = [];
    for (const order of ORDERS[q]) {
      try { cands.push(...F.chordVoicings({ root: r, quality: q, voicing: 'custom', order, stringSet: 'auto', stringSetAll: true, maxSpan: 4 })); } catch (e) { /* */ }
    }
    const good = cands.filter((p) => ok(p) && covers(p, r, q));
    if (good.length) return label(good.reduce((a, b) => (Math.abs(mid(a) - target) <= Math.abs(mid(b) - target) ? a : b)), r);
  }
  const fams = n === 3 ? ['close', 'drop2'] : ['drop2', 'drop3', 'close'];
  const bass = T.transpose ? T.transpose(r, F.simpleIv(bassIv)) : null;
  for (const v of fams) {
    let p = null;
    try { p = F.voiceLead([{ root: r, quality: q, bass }], { voicing: v, startFret: target })[0]; } catch (e) { p = null; }
    if (ok(p)) return label(p, r);
  }
  const g = F.gripFor(r, q, target);
  return g ? label(g, r) : [];
}
const ORDERS = {
  '13': [['1', 'b7', '3', '13'], ['1', 'b7', '3', '13', '9'], ['1', '3', 'b7', '9', '13']],
  m13: [['1', 'b7', 'b3', '13'], ['1', 'b3', 'b7', '9', '13'], ['1', 'b7', 'b3', '13', '9']],
  maj13: [['1', '7', '3', '13'], ['1', '3', '7', '9', '13'], ['1', '7', '9', '3', '13']],
  m11: [['1', 'b7', 'b3', '11'], ['1', '11', 'b7', 'b3'], ['1', 'b7', 'b3', '11', '9'], ['1', '5', 'b7', 'b3', '11']],
  '7#11': [['1', 'b7', '3', '#11'], ['1', '3', 'b7', '9', '#11'], ['1', 'b7', '9', '3', '#11']],
  'maj7#11': [['1', '3', '7', '#11'], ['1', '7', '3', '#11'], ['1', '5', '7', '3', '#11']],
};
const mid = (p) => p.notes.reduce((a, n) => a + n.fret, 0) / p.notes.length;
// a voicing must have the chord's 3rd and 7th and its colour on top; the root, the 5th, and under an 11th or 13th the
// 9th (and 11th) may go, as guitarists leave them
const OPTIONAL = { '13': ['9', '11'], m13: ['9', '11'], maj13: ['9', '11'], m11: ['9'], '7#11': ['9'] };
function covers(p, r, q) {
  const have = new Set(p.notes.map((x) => ((x.midi - T.notePc(r)) % 12 + 12) % 12));
  const need = T.getChord(q).ivs.filter((iv) => !['1', '5', ...(OPTIONAL[q] || [])].includes(iv)).map((iv) => T.intervalSemis(F.simpleIv(iv)) % 12);
  return need.every((x) => have.has(x));
}
const IVN = ['1', '♭2', '2', '♭3', '3', '4', '♭5', '5', '♯5', '6', '♭7', '7'];
function label(p, r) {
  return p.notes.map((x) => ({ string: x.string, fret: x.fret, midi: x.midi, iv: x.iv && x.iv !== 'bass' ? x.iv : IVN[((x.midi - T.notePc(r)) % 12 + 12) % 12] }))
    .sort((a, b) => b.string - a.string);
}

// right: the same notes over the same bass, named by type and bass (a °7, +, or 6 = m7/3 named another way is right)
export function matches(ch, q, inv) {
  if (!tones(q)[inv]) return false;
  for (let r = 0; r < 12; r++) {
    if (pcsOf(r, q) !== ch.pcs) continue;
    if ((r + T.intervalSemis(F.simpleIv(tones(q)[inv]))) % 12 === ch.bassPc) return true;
  }
  return false;
}
// the same type and bass on the root that puts the bass where the real chord's is (for hearing a wrong answer)
export function asAnswered(ch, q, inv) {
  const iv = tones(q)[inv] || '1';
  const rootPc = ((ch.bassPc - T.intervalSemis(F.simpleIv(iv))) % 12 + 12) % 12;
  const root = ROOTS[rootPc];
  return build(root, q, Math.min(inv, tones(q).length - 1));
}
// how it is written: E♭m7/G♭
export function nameOf(ch) {
  const r = T.parseNote(ch.root);
  let s = T.chordSymbol(r, ch.q);
  if (ch.inv) s += '/' + T.noteName(T.transpose(r, F.simpleIv(tones(ch.q)[ch.inv])), true);
  return T.pretty(s);
}
// tab, low E to high e: x35453
export function tab(notes) {
  return [6, 5, 4, 3, 2, 1].map((s) => { const n = notes.find((x) => x.string === s); return n ? String(n.fret) : 'x'; }).join(notes.some((n) => n.fret > 9) ? '-' : '');
}
