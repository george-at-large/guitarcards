// The extended chord morpher, built the way Ted Greene taught chord vocabulary: four-note voicings sorted by his
// V-System (the voicing group: drop 2 is V-2, drop 3 is V-4…), one group on one of its natural string sets at a time
// (a lane), and short "chord evolution" chains on one root in which each step changes exactly one voice, so the hand
// keeps its place while the sound changes. The chains follow his chord subfamilies (major, major ♯11, minor 7ths, the
// m6 / m(maj7) / m7♭5 cluster, plain dominants, sus, ♯11 and ♭5, augmented, ♭9, ♯9, diminished), simple to complex,
// or bright to dark. Roots may be left out (as in most jazz voicings; the root is drawn as a hollow ring), each grip
// gives its homonym (the same four notes under another name), dominants give their co-minor and can be heard
// resolving. Pure: no screen, no sound.
import * as T from '../theory.js';
import * as F from '../fretboard.js';

const semis = (iv) => T.intervalSemis(F.simpleIv(String(iv))) % 12;
// an interval's degree number: 9 → 2, 11 → 4, 13 → 6
const degOf = (iv) => { const n = Number(String(iv).replace(/\D/g, '')); return n > 7 ? n - 7 : n; };

// ---------- the V-System: which voicing group a four-note voicing belongs to ----------
// Lay the chord's four tones out as a repeating scale; between each pair of neighbouring voices (bass up), count the
// chord tones skipped. The three counts name the group.
const GROUP_BY_SKIPS = { '000': 1, '101': 2, '012': 3, '210': 4, '121': 5, '400': 6, '501': 7, '222': 8, '105': 9, '141': 10, '214': 11, '412': 12, '040': 13, '004': 14 };
export function vGroup(notes, rootPc) {
  if (notes.length !== 4) return 0;
  const tones = notes.map((n) => degOf(n.iv));
  if (new Set(tones).size !== 4) return 0;
  const h = notes.map((n) => { const oct = Math.round((n.midi - rootPc - semis(n.iv)) / 12); return degOf(n.iv) - 1 + 7 * oct; });
  const skips = [];
  for (let i = 0; i < 3; i++) {
    let c = 0;
    for (const t of tones) for (let o = -2; o < 12; o++) { const x = t - 1 + 7 * o; if (x > h[i] && x < h[i + 1]) c++; }
    skips.push(c);
  }
  return GROUP_BY_SKIPS[skips.join('')] || 0;
}
// the groups to practise, each on its natural string sets (bass string first)
export const GROUPS = [
  { g: 2, name: 'V-2 (drop 2)', sets: [[4, 3, 2, 1], [5, 4, 3, 2], [6, 5, 4, 3]] },
  { g: 4, name: 'V-4 (drop 3)', sets: [[6, 4, 3, 2], [5, 3, 2, 1]] },
  { g: 1, name: 'V-1 (close)', sets: [[4, 3, 2, 1], [5, 4, 3, 2]] },
  { g: 3, name: 'V-3 (drop 2 and 3)', sets: [[5, 4, 3, 1], [6, 5, 4, 2]] },
  { g: 5, name: 'V-5 (drop 2 and 4)', sets: [[5, 4, 2, 1], [6, 5, 3, 2]] },
];

// ---------- the chords: four different notes each ----------
// also: a homonym, the same four notes named from another root ([interval of its root, quality]): over the root as a
// slash chord when the root is in the chord, the grip's other name when it isn't
const Q = {};
const q = (id, sym, tones, from, use, also = null) => { Q[id] = { id, sym, tones, from, use, also, rootless: !tones.includes('1'), dom: tones.includes('3') && tones.includes('b7') || tones.includes('4') && tones.includes('b7') }; };
// major
q('6', '6', ['1', '3', '5', '6'], 'the major scale, or the major pentatonic', 'The warm, settled major: the swing-era and gypsy-jazz tonic, no 7th to lean on.', ['6', 'm7']);
q('69', '6/9', ['9', '3', '5', '6'], 'the major pentatonic', 'The ending chord of jazz and bossa nova: nothing leans, nothing clashes.');
q('maj9', 'maj9', ['9', '3', '5', '7'], 'Ionian, the major scale', 'The lush tonic of soul, neo-soul and jazz ballads: I and IV in a major key.', ['3', 'm7']);
q('maj7', 'maj7', ['1', '3', '5', '7'], 'Ionian, the major scale', 'The major 7th: I and IV in a major key, cool and settled.');
q('maj9no3', 'maj9 (no 3)', ['1', '5', '7', '9'], 'Ionian: the V triad over the root', 'Open and modern, neither happy nor sad: a pedal colour in fusion, ambient and film guitar.', ['5', '']);
q('maj7#5', 'maj7♯5', ['1', '3', '#5', '7'], 'Lydian augmented, the 3rd mode of melodic minor', 'The brightest major sound: ♭III in a minor key, or a floating, unresolved tonic.', ['3', '']);
q('maj7#11', 'maj7♯11', ['1', '3', '#11', '7'], 'Lydian, the 4th mode of major', 'IV in a major key, or a dreamy tonic: the raised 4th floats where the plain 4th would rub.');
q('maj9#11', 'maj9♯11', ['9', '3', '#11', '7'], 'Lydian, the 4th mode of major', 'The Lydian chord at its fullest: film scores, Satriani, Steely Dan.');
q('maj13', 'maj13', ['9', '3', '13', '7'], 'Ionian, the major scale', 'The fullest major tonic: I or IV in jazz and soul, the 13 sweetening the top.');
// minor 7ths and their extensions
q('m7', 'm7', ['1', 'b3', '5', 'b7'], 'Dorian or Aeolian', 'The minor 7th: ii in a major key, i in a minor groove. Its upper notes are the major 6 chord on the ♭3.', ['b3', '6']);
q('m9', 'm9', ['9', 'b3', '5', 'b7'], 'Dorian or Aeolian', 'The smooth minor: ii in jazz, vi in soul ballads. Rootless, it’s the major 7th on the ♭3.', ['b3', 'maj7']);
q('m11', 'm11', ['9', 'b3', '11', 'b7'], 'Dorian or Aeolian', 'The So What sound: stacked 4ths, neo-soul, modal jazz.');
q('m7_11', 'm7/11', ['1', 'b3', '11', 'b7'], 'Dorian or Aeolian', 'The minor 7th with its 4th added: open and modal, with the root still in the bass.');
q('m7_6', 'm7/6', ['1', 'b3', '13', 'b7'], 'Dorian, the 2nd mode of major', 'Ted Greene’s name for a minor 13 without its 9: Dorian’s bright natural 6 on a minor 7th.');
q('m13', 'm13', ['9', 'b3', '13', 'b7'], 'Dorian, the 2nd mode of major', 'ii in a major key, or a Dorian vamp: the natural 13 is Dorian’s bright spot.');
// the m6 / m(maj7) / m7♭5 cluster
q('mMaj7', 'm(maj7)', ['1', 'b3', '5', '7'], 'melodic and harmonic minor', 'The minor chord with its leading tone, tense and cinematic: the line cliché’s second chord.', ['b3', 'maj7#5']);
q('m6', 'm6', ['1', 'b3', '5', '6'], 'Dorian and melodic minor', 'The minor tonic of jazz and gypsy jazz, bittersweet; iv6 going to V. The same grip as the half-diminished on the 6th.', ['6', 'm7b5']);
q('mb6', 'm♭6', ['1', 'b3', '5', 'b13'], 'Aeolian, natural minor', 'The ♭6 hanging over the minor chord: sad and cinematic, the line cliché’s last step.', ['b13', 'maj7']);
q('m69', 'm6/9', ['9', 'b3', '5', '6'], 'Dorian and melodic minor', 'The richest minor tonic: Dorian’s 6th and the 9th together.');
q('mMaj9', 'm(maj9)', ['9', 'b3', '5', '7'], 'melodic minor', 'The film-noir minor tonic (the Bond chord).', ['b3', 'maj7#5']);
// dominants: plain, sus, ♯11/♭5, augmented, ♭9, ♯9
q('7', '7', ['1', '3', '5', 'b7'], 'Mixolydian, the 5th mode of major', 'The dominant 7th: V7 pulling home, and the blues I7 and IV7.');
q('9', '9', ['9', '3', '5', 'b7'], 'Mixolydian, the 5th mode of major', 'Funk’s chord, and a plain V7 dressed up. Rootless, it’s the half-diminished chord on the 3rd.', ['3', 'm7b5']);
q('13', '13', ['9', '3', '13', 'b7'], 'Mixolydian, the 5th mode of major', 'The sweet dominant of blues, funk and soul; the 13 often holds over as the 3rd of I.');
q('7/6', '7/6', ['1', '3', '13', 'b7'], 'Mixolydian (Ted Greene’s name for a 13 without its 9)', 'The 13th sound with the root kept: blues and swing comping, V7 to a major I.');
q('13sus4', '7/6sus4', ['1', '4', '13', 'b7'], 'Mixolydian, with the 4th in place of the 3rd', 'The suspended 13th: the tension held without its leading tone. Modal vamps, gospel.');
q('7sus4', '7sus4', ['1', '4', '5', 'b7'], 'Mixolydian, with the 4th in place of the 3rd', 'The suspended V7: the 4 wants to fall to the 3rd, or to be left floating.');
q('9sus4', '11', ['1', '4', 'b7', '9'], 'Mixolydian: the ♭VII triad over the root', 'The 11 chord (9sus4, no 5): the soul and gospel dominant (Maiden Voyage, Bacharach). It can sit, or fall to the major chord.', ['b7', '']);
q('susb9', '7sus4♭9', ['1', '4', 'b7', 'b9'], 'Phrygian, or Dorian ♭2 (the 2nd mode of melodic minor)', 'The sus♭9 chord: dark and modal, Herbie Hancock and Coltrane-era vamps, a V to a minor chord.', ['b7', 'm']);
q('9#11', '9♯11', ['9', '3', '#11', 'b7'], 'Lydian dominant, the 4th mode of melodic minor', 'A dominant that doesn’t resolve down a 5th: IV7 in blues and funk, ♭VII7, the tritone sub ♭II7.');
q('7b5', '7♭5', ['1', '3', 'b5', 'b7'], 'the whole-tone scale', 'The French sixth: the same four notes as the dominant a tritone away, so it can resolve either way.', ['b5', '7b5']);
q('7b9b5', '7♭9♭5', ['b9', '3', 'b5', 'b7'], 'the half-whole diminished scale', 'The tritone sub hiding in V7: this grip is also the plain 7th a tritone away, so it resolves down a 5th or down a half step.', ['b5', '7']);
q('7#5', '7♯5', ['1', '3', '#5', 'b7'], 'the whole-tone scale', 'The augmented dominant (Ted Greene’s 7+): the ♯5 rises into the next chord’s 3rd. Dreamy, Debussy and Monk.');
q('9#5', '9♯5', ['9', '3', '#5', 'b7'], 'the whole-tone scale', 'The whole-tone dominant with its 9th: Stevie Wonder, Monk, the dream sequence.');
q('7b9#5', '7♭9♯5', ['b9', '3', '#5', 'b7'], 'the altered scale, the 7th mode of melodic minor', 'The altered V7 to a minor chord: ♭9 and ♯5 both fall a half step into it.');
q('7#9#5', '7♯9♯5', ['#9', '3', '#5', 'b7'], 'the altered scale, the 7th mode of melodic minor', 'The darkest altered V7: the full “alt” sound of modern jazz.');
q('7b9', '7♭9', ['b9', '3', '5', 'b7'], 'Phrygian dominant (harmonic minor) or the half-whole diminished scale', 'V7 to a minor chord: the ♭9 falls a half step into its 5th. Rootless, it’s a diminished 7th grip.', ['3', 'dim7']);
q('13b9', '13♭9', ['b9', '3', '13', 'b7'], 'the half-whole diminished scale', 'A bright 13 against a dark ♭9: big band and bebop, V7 to a major I.');
q('7#9', '7♯9', ['#9', '3', '5', 'b7'], 'the blues, and the altered scale', 'The Hendrix chord: the blues ♭3 against the major 3rd. Bluesy on V and I; careful on IV with the ♯9 on top.');
q('13#9', '13♯9', ['#9', '3', '13', 'b7'], 'the half-whole diminished scale', 'The bluesy 13: the ♯9’s grit with the 13’s sweetness, a funk and organ-trio sound.');
q('7#9b5', '7♯9♭5', ['#9', '3', 'b5', 'b7'], 'the altered scale, the 7th mode of melodic minor', 'An altered V7: both tensions a half step from notes of the chord it resolves to.');
// half-diminished and diminished
q('m7b5', 'm7♭5', ['1', 'b3', 'b5', 'b7'], 'Locrian, the 7th mode of major', 'ii of a minor ii–V, or vii in a major key. The same grip as the minor 6th on the ♭3.', ['b3', 'm6']);
q('m9b5', 'm9♭5', ['9', 'b3', 'b5', 'b7'], 'Locrian ♮2, the 6th mode of melodic minor', 'ii in a minor key, the smooth version: the natural 9 softens the half-diminished chord.');
q('dim9', '°7 add 9', ['9', 'b3', 'b5', 'bb7'], 'the whole-half diminished scale', 'A diminished 7th with the note a whole step above its root: it colours the chord without changing its job.');
q('dim7', '°7', ['1', 'b3', 'b5', 'bb7'], 'the whole-half diminished scale', 'The passing chord between neighbours, and V7♭9 without its root: the same grip every three frets.');
q('dimMaj7', '°(maj7)', ['1', 'b3', 'b5', '7'], 'the whole-half diminished scale', 'The diminished chord with its major 7th: eerie and floating.');
export const QUALS = Q;

// the chains (Ted Greene's chord subfamilies), one voice changing at each step. ted: his teaching order; fam: for
// the bright-to-dark order (major, dominant, minor, diminished)
export const CHAINS = [
  { id: 'maj', ted: 0, fam: 0, name: 'Major', ids: ['6', '69', 'maj9', 'maj7', 'maj9no3'] },
  { id: 'lyd', ted: 1, fam: 0, name: 'Major ♯11 (Lydian)', ids: ['maj7#5', 'maj7', 'maj7#11', 'maj9#11', 'maj13', 'maj9'] },
  { id: 'm7', ted: 2, fam: 2, name: 'Minor 7ths and extensions', ids: ['m7', 'm9', 'm11', 'm7_11', 'm7_6', 'm13'] },
  { id: 'cliche', ted: 3, fam: 2, name: 'm6, m(maj7): the line cliché', ids: ['mMaj7', 'm7', 'm6', 'mb6'] },
  { id: 'm6', ted: 4, fam: 2, name: 'm6 and m(maj7) colours', ids: ['m6', 'm69', 'mMaj9', 'mMaj7'] },
  { id: 'dom', ted: 5, fam: 1, name: 'Dominant: 7, 9, 13, 7/6', ids: ['7', '9', '13', '7/6'], resolve: true },
  { id: 'sus', ted: 6, fam: 1, name: 'Dominant sus and 11', ids: ['7/6', '13sus4', '7sus4', '9sus4', 'susb9'], resolve: true },
  { id: 's11', ted: 7, fam: 1, name: 'Dominant ♯11 and ♭5', ids: ['7', '7b5', '7b9b5', '9#11', '9'], resolve: true },
  { id: 'aug', ted: 8, fam: 1, name: 'Augmented dominants (7+)', ids: ['7#5', '9#5', '7b9#5', '7#9#5'], resolve: true },
  { id: 'b9', ted: 9, fam: 1, name: 'Altered: ♭9', ids: ['7', '7b9', '13b9', '7/6'], resolve: true },
  { id: 's9', ted: 10, fam: 1, name: 'Altered: ♯9', ids: ['7', '7#9', '13#9', '7#9#5', '7#9b5'], resolve: true },
  { id: 'dim', ted: 11, fam: 3, name: 'Half-diminished and diminished', ids: ['m7b5', 'm9b5', 'dim9', 'dim7', 'dimMaj7'] },
];
export const ORDERS = [['ted', 'Ted Greene’s order'], ['bright', 'Bright to dark']];
export function chainsIn(ids, order = 'ted') {
  return CHAINS.filter((c) => ids.includes(c.id)).sort((a, b) => (order === 'bright' ? a.fam - b.fam || a.ted - b.ted : a.ted - b.ted));
}

// names on a root
const SYM = { '': '', m: 'm', m7: 'm7', m7b5: 'm7♭5', dim7: '°7', 6: '6', m6: 'm6', maj7: 'maj7', 'maj7#5': 'maj7♯5', 7: '7', '7b5': '7♭5' };
export const nameOn = (root, qq) => `${T.noteName(root, true)}${qq.sym}`;
export function alsoOn(root, qq) {
  if (!qq.also) return '';
  const [iv, k] = qq.also, other = T.noteName(T.transpose(root, F.simpleIv(iv)), true);
  return qq.rootless ? `${other}${SYM[k] ?? k}` : `${other}${SYM[k] ?? k}/${T.noteName(root, true)}`;
}
// a dominant's co-minor: the minor 7th a 5th above its root (A7 and Em7), the ii it pairs with
export const coMinor = (root, qq) => (qq.dom ? `${T.noteName(T.transpose(root, '5'), true)}m7` : '');

// ---------- voicings ----------
// every voicing of a chord on a string set, in one voicing group, inside the area (a fret either side allowed once),
// clean in the low register (no close intervals at the bottom of the neck)
export function voicingsOn(root, qq, set, group, pos) {
  const rpc = T.notePc(root), out = [];
  const lo = Math.max(0, pos.lo - 1), hi = pos.hi + 1;
  const perms = (a) => (a.length <= 1 ? [a] : a.flatMap((x, i) => perms(a.slice(0, i).concat(a.slice(i + 1))).map((r) => [x, ...r])));
  for (const order of perms(qq.tones)) {
    const opts = set.map((st, i) => {
      const want = (rpc + semis(order[i])) % 12, fs = [];
      for (let f = lo; f <= hi; f++) { if (f === 0 && pos.lo > 1) continue; if ((F.OPEN[st] + f) % 12 === want) fs.push({ string: st, fret: f, midi: F.OPEN[st] + f, iv: order[i] }); }
      return fs;
    });
    const rec = (i, acc) => {
      if (i === set.length) {
        for (let j = 1; j < acc.length; j++) if (acc[j].midi <= acc[j - 1].midi) return;
        const fr = acc.filter((n) => n.fret > 0).map((n) => n.fret);
        if (fr.length && Math.max(...fr) - Math.min(...fr) > 4) return;
        let outside = 0; for (const f of fr) outside += Math.max(0, pos.lo - f, f - pos.hi);
        if (outside > 1) return;
        const d = acc[1].midi - acc[0].midi;
        if ((acc[0].midi < 45 && d < 7) || (acc[0].midi < 50 && d < 5)) return; // muddy low down
        if (vGroup(acc, rpc) !== group) return;
        out.push({ notes: acc.map((n) => ({ ...n, note: T.transpose(root, F.simpleIv(n.iv)) })), set, group, bassIv: acc[0].iv, lo: fr.length ? Math.min(...fr) : 0, hi: Math.max(...acc.map((n) => n.fret)) });
        return;
      }
      for (const o of opts[i]) rec(i + 1, [...acc, o]);
    };
    rec(0, []);
  }
  return out;
}
// how many voices changed, and how far the hand travels (voices compared string by string)
export const changed = (a, b) => b.notes.filter((n, i) => a.notes[i].midi !== n.midi).length;
export const travel = (a, b) => b.notes.reduce((t, n, i) => t + Math.abs(n.fret - a.notes[i].fret), 0);
export function movedText(a, b) {
  return b.notes.map((n, i) => [a.notes[i], n]).filter(([o, n]) => o.midi !== n.midi).map(([o, n]) => {
    const d = n.midi - o.midi;
    return `${T.prettyIv(o.iv)} → ${T.prettyIv(n.iv)} ${d < 0 ? 'down' : 'up'} ${Math.abs(d) === 1 ? 'a half step' : Math.abs(d) === 2 ? 'a whole step' : `${Math.abs(d)} frets`}`;
  });
}

// the lanes in an area for one chain: each chosen voicing group on each of its string sets, starting from each voicing
// of the chain's first chord that lives there (root in the bass only, if asked). Each next chord takes the voicing on
// the same strings and in the same group that changes fewest voices and moves least (keeping the top note, if asked).
// back: the chain then runs back to its start.
export function lanes(root, chain, groups, pos, { rootBass = true, back = true, soprano = false } = {}) {
  const out = [];
  const ids = back ? chain.ids.concat(chain.ids.slice(0, -1).reverse()) : chain.ids;
  const cache = new Map();
  for (const G of GROUPS.filter((x) => groups.includes(x.g))) for (const set of G.sets) {
    const on = (id) => { const k = `${id}|${set}`; if (!cache.has(k)) cache.set(k, voicingsOn(root, Q[id], set, G.g, pos)); return cache.get(k); };
    let starts = on(chain.ids[0]);
    if (rootBass) starts = starts.filter((v) => v.bassIv === '1');
    for (const s0 of starts.slice().sort((a, b) => a.lo - b.lo)) {
      const path = [{ q: Q[ids[0]], v: s0, prev: null }];
      let prev = s0;
      for (const id of ids.slice(1)) {
        const cands = on(id);
        if (!cands.length) continue;
        const top = (v) => v.notes[3].midi;
        const sc = (v) => changed(prev, v) * 10 + travel(prev, v) + (soprano && top(v) !== top(prev) ? 6 : 0);
        const v = cands.reduce((a, b) => (sc(a) <= sc(b) ? a : b));
        if (changed(prev, v) > 2) continue; // too far: leave this chord out here
        path.push({ q: Q[id], v, prev });
        prev = v;
      }
      if (path.length >= Math.min(3, ids.length)) out.push({ chain, group: G, set, path });
    }
  }
  return out;
}
