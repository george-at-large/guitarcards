// The ultimate ladder's chords: for each mode, every chord on its root that belongs to it, in one CAGED area. Its
// triad, in every voicing there; its 7th chord, in every drop 2 and drop 3 voicing and as shells; then each of its
// other chords (6ths, 9ths, 11ths, 13ths, sus and altered chords, whichever the mode holds without its avoid notes),
// each in a nice rooted grip or two and a rootless (Ted Greene) grip or two. The route through the whole ladder is
// voice-led: each block of voicings is swept the way that starts nearest the chord before. Pure: no screen, no sound.
import * as T from '../theory.js';
import * as F from '../fretboard.js';
import * as G from './grips.js';
import * as SC from './scales.js';
import { ULT_INFO } from './fsladder.js';
import { QUALS, voicingsOn } from './xmorph.js';

const BY = Object.fromEntries(SC.SCALES.map((s) => [s.id, s]));
const Q = { ...QUALS };
for (const [q, sym] of [['maj', ''], ['min', 'm'], ['dim', '°'], ['aug', '+']]) Q[`tri:${q}`] = { id: `tri:${q}`, sym, tones: T.getChord(q).ivs, use: 'The triad: the three notes that make it major, minor, diminished or augmented, in every voicing it has in the shape.' };
export const CHORD = Q;
// each mode's triad and 7th chord (the altered scale read as a dominant: its ♭4 sounds as the 3rd, its ♭6 as the ♯5)
export const TRIAD = { lydian: 'maj', ionian: 'maj', 'mel-min': 'min', mixolydian: 'maj', 'lyd-dom': 'maj', dorian: 'min', 'dorian-b2': 'min', aeolian: 'min', 'harm-min': 'min', 'locrian-n2': 'dim', phrygian: 'min', 'phryg-dom': 'maj', locrian: 'dim', altered: 'aug', 'dim-hw': 'maj' };
export const SEVENTH = { lydian: 'maj7', ionian: 'maj7', 'mel-min': 'mMaj7', mixolydian: '7', 'lyd-dom': '7', dorian: 'm7', 'dorian-b2': 'm7', aeolian: 'm7', 'harm-min': 'mMaj7', 'locrian-n2': 'm7b5', phrygian: 'm7', 'phryg-dom': '7', locrian: 'm7b5', altered: '7#5', 'dim-hw': '7' };

// ---------- the other chords on the root: rooted grip tones, rootless grip tones (either may be absent) ----------
// simple to rich; a mode takes each one whose notes it holds, whose 3rd is its own (or that has none: sus chords),
// and that has none of its avoid notes (sus chords may: the 4th there is no clash)
const EXT = [
  ['6', '6', ['1', '3', '5', '6'], null, 'The major chord with its 6th: sweet and settled, no 7th leaning anywhere.'],
  ['69', '6/9', ['1', '3', '6', '9'], ['9', '3', '5', '6'], 'Major with its 6th and 9th: nothing leans. The ending chord of jazz and bossa nova.'],
  ['add9', 'add9', ['1', '3', '5', '9'], null, 'The major triad with a 9: open and bright, the pop and folk colour.'],
  ['maj9', 'maj9', ['1', '3', '7', '9'], ['9', '3', '5', '7'], 'The major 7th with its 9: the lush tonic of soul, jazz and ballads.'],
  ['maj13', 'maj13', ['1', '3', '7', '13'], ['9', '3', '13', '7'], 'The fullest major chord: the 13 sweetening the top.'],
  ['maj7#11', 'maj7♯11', ['1', '3', '7', '#11'], ['9', '3', '#11', '7'], 'The Lydian chord: the ♯11 floats where a plain 11 would clash.'],
  ['9', '9', ['1', '3', 'b7', '9'], ['9', '3', '5', 'b7'], 'The dominant with its 9: funk, soul, a plain V7 dressed up.'],
  ['13', '13', ['1', '3', 'b7', '13'], ['9', '3', '13', 'b7'], 'The sweet dominant of blues and soul: the 13 on top.'],
  ['7#11', '7♯11', ['1', '3', 'b7', '#11'], ['9', '3', '#11', 'b7'], 'The Lydian dominant: a 7th chord that doesn’t need to resolve down a 5th.'],
  ['7sus4', '7sus4', ['1', '4', '5', 'b7'], null, 'The suspended dominant: the 4th in place of the 3rd, waiting to fall.'],
  ['9sus4', '9sus4', ['1', '4', 'b7', '9'], ['9', '4', '5', 'b7'], 'The soul and gospel sus chord: suspended, with the 9.'],
  ['13sus4', '13sus4', ['1', '4', 'b7', '13'], null, 'The suspended 13th: modal vamps.'],
  ['susb9', '7sus4♭9', ['1', '4', 'b7', 'b9'], null, 'The sus♭9: dark and modal, the Phrygian chord.'],
  ['13susb9', '13sus4♭9', null, ['b9', '4', '13', 'b7'], 'The sus♭9 with a bright 13 on top: Dorian ♭2’s own sound.'],
  ['7b9', '7♭9', ['1', '3', 'b7', 'b9'], ['b9', '3', '5', 'b7'], 'A dominant pulling to a minor chord: the ♭9 falls a half step.'],
  ['7#9', '7♯9', ['1', '3', 'b7', '#9'], ['#9', '3', '5', 'b7'], 'The Hendrix chord: the ♯9 rubbing the major 3rd.'],
  ['7b13', '7♭13', ['1', '3', 'b7', 'b13'], null, 'The dominant with its ♭13: a darker pull home.'],
  ['7b9b13', '7♭9♭13', null, ['b9', '3', 'b13', 'b7'], 'Both tensions falling a half step into the chord to come.'],
  ['7alt', '7alt', null, ['#9', '3', 'b13', 'b7'], 'The full altered sound: ♯9 and ♭13 over the tritone.'],
  ['13b9', '13♭9', null, ['b9', '3', '13', 'b7'], 'A bright 13 over a dark ♭9: big band and bebop.'],
  ['m6', 'm6', ['1', 'b3', '5', '6'], null, 'The minor tonic of jazz and gypsy jazz: bittersweet.'],
  ['m69', 'm6/9', ['1', 'b3', '6', '9'], ['9', 'b3', '5', '6'], 'The richest minor tonic: the 6th and the 9th together.'],
  ['madd9', 'm(add9)', ['1', 'b3', '5', '9'], null, 'The minor triad with a 9: wistful and open.'],
  ['m9', 'm9', ['1', 'b3', 'b7', '9'], ['9', 'b3', '5', 'b7'], 'The smooth minor: ii in jazz, vi in soul ballads.'],
  ['m11', 'm11', ['1', 'b3', 'b7', '11'], ['9', 'b3', '11', 'b7'], 'The So What sound: open, modal, neo-soul.'],
  ['m13', 'm13', ['1', 'b3', 'b7', '13'], ['9', 'b3', '13', 'b7'], 'The bright minor: Dorian’s natural 13 on a minor 7th.'],
  ['mMaj9', 'm(maj9)', ['1', 'b3', '7', '9'], ['9', 'b3', '5', '7'], 'The film-noir minor: minor with its leading tone and a 9.'],
  ['m7_11', 'm7(11)', ['1', 'b3', 'b7', '11'], null, 'The minor 7th with its 4th added and no 9: open and modal, safe in Phrygian.'],
  ['m9b5', 'm9♭5', null, ['9', 'b3', 'b5', 'b7'], 'The half-diminished chord softened by its natural 9: ii of a minor key.'],
  ['m11b5', 'm11♭5', ['1', 'b5', 'b7', '11'], ['11', 'b3', 'b5', 'b7'], 'The half-diminished chord with its 11: dark and open.'],
];
for (const [id, sym, r, rl, use] of EXT) {
  if (r) Q[`x:${id}`] = { id: `x:${id}`, sym, tones: r, use, rooted: true };
  if (rl) Q[`xr:${id}`] = { id: `xr:${id}`, sym, tones: rl, use, rootless: true };
}
const semis = (iv) => T.intervalSemis(F.simpleIv(String(iv))) % 12;
const modePcs = (mode) => new Set(BY[mode].ivs.map(semis));
const avoidPcs = (mode) => new Set((ULT_INFO[mode]?.avoid || []).map(semis));
const MAJOR = new Set(['maj7', '7', '7#5']);
// the chords a mode holds on its root (ids of rooted and rootless grips), in the catalogue's order
export function chordsOf(mode) {
  const pcs = modePcs(mode), avoid = avoidPcs(mode), major = MAJOR.has(SEVENTH[mode]);
  // a chord's name promises notes its grip may leave out: a natural 5th (unless it names another), and a 9 under an
  // 11 or 13 (unless it names an altered 9 or a ♭5); the mode has to hold those too
  const implied = (id, tones) => {
    const out = [];
    if (!tones.some((iv) => /^(b5|#5|b13|5)$/.test(iv)) && !['7alt', '7b9b13', 'm9b5', 'm11b5'].includes(id)) out.push('5');
    if (/(^|[^#b])1[13]|^m?1[13]|^maj13|^13/.test(id) && !tones.some((iv) => /^(b9|#9|b5)$/.test(iv)) && !/^(13susb9|m7_11)$/.test(id)) out.push('9');
    return out;
  };
  const fits = (tones, id) => {
    if (![...tones, ...implied(id, tones)].every((iv) => pcs.has(semis(iv)))) return false;
    const third = tones.includes('3') ? 'maj' : tones.includes('b3') ? 'min' : 'sus';
    if (third !== 'sus' && (third === 'maj') !== major) return false;
    if (third !== 'sus' && tones.some((iv) => iv !== '1' && avoid.has(semis(iv)))) return false;
    return true;
  };
  const out = [];
  for (const [id, , r, rl] of EXT) {
    const a = r && fits(r, id) ? `x:${id}` : null, b = rl && fits(rl, id) ? `xr:${id}` : null;
    if (a || b) out.push({ key: id, rooted: a, rootless: b });
  }
  return out;
}
// the extended chords each mode plays, most useful first (at most five, with the triad and 7th, ten chords a mode);
// each must belong to the mode (checked above), else it's dropped
const PICK = {
  lydian: ['maj7#11', 'maj9', '69', 'maj13', '6'],
  ionian: ['maj9', '69', 'maj13', '6', 'add9'],
  'mel-min': ['mMaj9', 'm6', 'm69', 'madd9'],
  mixolydian: ['13', '9', '9sus4', '7sus4', '13sus4'],
  'lyd-dom': ['7#11', '9', '13', '6'],
  dorian: ['m9', 'm11', 'm13', 'm6', '9sus4'],
  'dorian-b2': ['susb9', '13susb9', 'm6', 'm7_11'],
  aeolian: ['m9', 'm11', 'madd9', '9sus4'],
  'harm-min': ['mMaj9', 'madd9'],
  'locrian-n2': ['m9b5', 'm11b5'],
  phrygian: ['susb9', 'm7_11', '7sus4'],
  'phryg-dom': ['7b9', '7b9b13', '7b13', 'susb9'],
  locrian: ['m11b5'],
  altered: ['7alt', '7b9b13', '7b13'],
  'dim-hw': ['13b9', '7b9', '7#9', '7#11'],
};
export function picksOf(mode) { const all = chordsOf(mode); return (PICK[mode] || []).map((k) => all.find((c) => c.key === k)).filter(Boolean); }
export const MODE_CHORDS = Object.fromEntries(Object.keys(TRIAD).map((m) => [m, picksOf(m).map((c) => c.rooted || c.rootless)]));

// the voicings to draw from: drop 2 and drop 3 on their natural string sets (Ted Greene's V-2 and V-4), or the best of
// both; a chord with nothing in its lane in this area borrows from the other
const SETS = [{ g: 2, set: [4, 3, 2, 1] }, { g: 2, set: [5, 4, 3, 2] }, { g: 2, set: [6, 5, 4, 3] }, { g: 4, set: [6, 4, 3, 2] }, { g: 4, set: [5, 3, 2, 1] }];
export const LANES = [
  { id: 'best', name: 'Best', sets: SETS, blurb: 'Drop 2 and drop 3 together: each chord takes whichever moves least.' },
  { id: 'd2', name: 'Drop 2', sets: SETS.filter((x) => x.g === 2), blurb: 'Drop 2 (Ted Greene’s V-2) on strings 4-3-2-1, 5-4-3-2 and 6-5-4-3.' },
  { id: 'd3', name: 'Drop 3', sets: SETS.filter((x) => x.g === 4), blurb: 'Drop 3 (V-4), root-heavy and wide, on strings 6-4-3-2 and 5-3-2-1.' },
];
export const laneById = (id) => LANES.find((l) => l.id === id) || LANES[0];

const pcOf = (root, iv) => (T.notePc(root) + T.intervalSemis(F.simpleIv(String(iv)))) % 12;
// a voicing, fingered; the same four sounding notes in another lane count once
function finish(v) {
  const notes = G.assignFingers(v.notes.map((n) => ({ ...n }))).sort((a, b) => b.string - a.string);
  return { ...v, notes, key: notes.map((n) => `${n.string}:${n.fret}`).join(' ') };
}
// a hand has to be able to hold it: no finger asked for two frets, and no wider gap between two fingers than their
// distance allows plus one fret (index to middle two frets at most, ring to little finger two)
function playable(v) {
  const fr = v.notes.filter((n) => n.finger);
  for (const a of fr) for (const b of fr) {
    if (a.finger === b.finger && a.fret !== b.fret) return false;
    if (a.finger < b.finger && b.fret - a.fret > b.finger - a.finger + 1) return false;
    // a finger laid across strings (a barre) only crosses strings fretted at or above it
    if (a.finger === b.finger && a.string > b.string) for (let st = b.string + 1; st < a.string; st++) { const n = v.notes.find((x) => x.string === st); if (!n || n.fret < a.fret) return false; }
  }
  return true;
}
// what makes a voicing less good, as a cost: a four-fret stretch, and a tension (9, 11, 13) in the bass, which low
// down sounds like a slash chord; worst on the 6th string
const TENSION = /^(b9|9|#9|11|#11|b13|13)$/;
const rough = (v) => { const bass = v.notes[0]; return (span(v) >= 4 ? 8 : 0) + (TENSION.test(bass.iv) ? (bass.string === 6 ? 14 : bass.string === 5 ? 6 : 2) : 0) + (v.group === 'root' && bass.string === 4 ? 3 : 0) + (v.group === 'root' && v.notes.length === bass.string ? 5 : 0); }; // a rooted grip that fills every string above its bass leaves nowhere for the add-ons
// a four-fret span is playable but a stretch: the route takes one only when it saves a real move
const span = (v) => { const fr = v.notes.filter((n) => n.fret > 0).map((n) => n.fret); return fr.length ? Math.max(...fr) - Math.min(...fr) : 0; };
const cache = new Map();
export function voicingsIn(root, id, lane, pos) {
  const k = `${T.notePc(root)}|${id}|${lane.id}|${pos.lo}|${pos.hi}`;
  if (cache.has(k)) return cache.get(k);
  const seen = new Set(), out = [];
  for (const l of lane.sets) for (const v of voicingsOn(root, Q[id], l.set, l.g, pos)) {
    const f = finish({ ...v, group: l.g });
    if (seen.has(f.key) || !playable(f)) continue;
    seen.add(f.key); out.push(f);
  }
  // nearest the middle of the area first
  const mid = (pos.lo + pos.hi) / 2, c = (v) => { const fr = v.notes.filter((n) => n.fret > 0).map((n) => n.fret); return fr.length ? Math.abs(fr.reduce((a, b) => a + b, 0) / fr.length - mid) : 9; };
  out.sort((a, b) => c(a) - c(b));
  cache.set(k, out);
  return out;
}

// close triads on adjacent strings inside the area: every order of the three notes that fits under an octave, the
// stretch at most three frets, nothing muddy low down
const TRI_SETS = [[3, 2, 1], [4, 3, 2], [5, 4, 3], [6, 5, 4]];
export function triadsIn(root, q, pos) {
  const k = `tri|${T.notePc(root)}|${q}|${pos.lo}|${pos.hi}`;
  if (cache.has(k)) return cache.get(k);
  const tones = T.getChord(q).ivs, rpc = T.notePc(root), lo = Math.max(0, pos.lo - 1), hi = pos.hi + 1, seen = new Set(), out = [];
  for (const set of TRI_SETS) for (const order of perms(tones)) {
    const opts = set.map((st, i) => { const want = pcOf(root, order[i]), fs = []; for (let f = lo; f <= hi; f++) { if (f === 0 && pos.lo > 1) continue; if ((F.OPEN[st] + f) % 12 === want) fs.push({ string: st, fret: f, midi: F.OPEN[st] + f, iv: order[i] }); } return fs; });
    for (const a of opts[0]) for (const b of opts[1]) for (const c of opts[2]) {
      const ns = [a, b, c];
      if (!(a.midi < b.midi && b.midi < c.midi) || c.midi - a.midi >= 12) continue;
      const fr = ns.filter((n) => n.fret > 0).map((n) => n.fret);
      if (fr.length && Math.max(...fr) - Math.min(...fr) > 3) continue;
      let outside = 0; for (const f of fr) outside += Math.max(0, pos.lo - f, f - pos.hi);
      if (outside > (pos.lo === 0 ? 2 : 1) || a.midi < 47) continue; // low close triads are mud; at the nut, a fret more
      const v = finish({ notes: ns.map((n) => ({ ...n, note: T.transpose(root, F.simpleIv(n.iv)) })), set, group: 'tri', bassIv: a.iv, lo: fr.length ? Math.min(...fr) : 0, hi: Math.max(...ns.map((n) => n.fret)) });
      if (!seen.has(v.key) && playable(v)) { seen.add(v.key); out.push(v); }
    }
  }
  void rpc;
  cache.set(k, out);
  return out;
}

// a rooted chord, the way guitarists grip it: the root in the bass (on the 6th, 5th or 4th string), each other required
// note once above it, the 5th too if it fits, each string higher up either fretted or muted (at most one muted string
// inside the grip), every note in the area (a fret either side), the stretch at most four frets, playable, rising
// in pitch string by string, nothing muddy low down
export function rootedIn(root, id, pos, mode) {
  const k = `root|${T.notePc(root)}|${id}|${mode}|${pos.lo}|${pos.hi}`;
  if (cache.has(k)) return cache.get(k);
  const ch = Q[id], need = ch.tones.filter((x) => x !== '1'), opt = !ch.tones.some((x) => /(5|13)$/.test(x)) && modePcs(mode).has(7) ? ['5'] : [];
  const lo = Math.max(0, pos.lo - 1), hi = pos.hi + 1, seen = new Set(), out = [];
  const pcIv = new Map([...need, ...opt].map((iv) => [pcOf(root, iv), iv]));
  for (const bs of [6, 5, 4]) for (let f0 = lo; f0 <= hi; f0++) {
    if (f0 === 0 && pos.lo > 1) continue;
    if ((F.OPEN[bs] + f0) % 12 !== T.notePc(root)) continue;
    const bassN = { string: bs, fret: f0, midi: F.OPEN[bs] + f0, iv: '1' };
    const rec = (st, acc, used, muted) => {
      if (st === 0) {
        if (!need.every((iv) => used.has(iv))) return;
        // no muted string above the top note counts; inside, at most one
        const top = acc[acc.length - 1].string, inside = muted.filter((m) => m > top);
        if (inside.length > 1 || (inside.length && inside[0] !== bs - 1)) return; // a muted string only right above the bass (5-x-5-6-7-x), never a hole inside
        const fr = acc.filter((n) => n.fret > 0).map((n) => n.fret);
        if (fr.length && Math.max(...fr) - Math.min(...fr) > 4) return;
        let outside = 0; for (const f of fr) outside += Math.max(0, pos.lo - f, f - pos.hi);
        if (outside > 1) return;
        const d = acc[1].midi - acc[0].midi;
        if ((acc[0].midi < 45 && d < 7) || (acc[0].midi < 50 && d < 5)) return;
        const v = finish({ notes: acc.map((n) => ({ ...n, note: T.transpose(root, F.simpleIv(n.iv)) })), set: acc.map((n) => n.string), group: 'root', bassIv: '1', lo: fr.length ? Math.min(...fr) : 0, hi: Math.max(...acc.map((n) => n.fret)) });
        if (!seen.has(v.key) && playable(v)) { seen.add(v.key); out.push(v); }
        return;
      }
      // this string muted (only once the required notes are all in, or once inside the grip)
      rec(st - 1, acc, used, [...muted, st]);
      for (let f = lo; f <= hi; f++) {
        if (f === 0 && pos.lo > 1) continue;
        const m = F.OPEN[st] + f, iv = pcIv.get(m % 12);
        if (!iv || used.has(iv) || m <= acc[acc.length - 1].midi) continue;
        rec(st - 1, [...acc, { string: st, fret: f, midi: m, iv }], new Set([...used, iv]), muted);
      }
    };
    rec(bs - 1, [bassN], new Set(), []);
  }
  // nearest the middle of the area, small stretches, and room left for the add-ons (free strings above the bass)
  const mid = (pos.lo + pos.hi) / 2, c = (v) => Math.abs(v.notes.reduce((t, n) => t + n.fret, 0) / v.notes.length - mid) + span(v);
  out.sort((a, b) => c(a) - c(b));
  cache.set(k, out);
  return out;
}
// the add-ons a rooted grip can take: the mode's other safe notes (its tensions, the 5th) that the chord leaves out, each
// once, on a string the grip leaves free above the bass, in the spot nearest the grip, the hand within four frets;
// three at most
export function addOnsFor(root, id, v, mode) {
  const pcs = modePcs(mode), avoid = avoidPcs(mode), have = new Set(Q[id].tones.map(semis));
  const add = ['9', 'b9', '#9', '11', '#11', '13', 'b13', '5'].filter((iv) => pcs.has(semis(iv)) && !have.has(semis(iv)) && !avoid.has(semis(iv)) && !(semis(iv) === 5 && have.has(4)));
  const used = new Set(v.notes.map((n) => n.string)), bass = v.notes[0].string, out = [];
  const fr = v.notes.filter((n) => n.fret > 0).map((n) => n.fret), lo = fr.length ? Math.min(...fr) : 0, hi = fr.length ? Math.max(...fr) : 0, mid = (lo + hi) / 2;
  for (const iv of add) {
    let best = null;
    for (let st = bass - 1; st >= 1; st--) {
      if (used.has(st)) continue;
      for (let f = Math.max(0, lo - 1); f <= hi + 1; f++) {
        if ((F.OPEN[st] + f) % 12 !== pcOf(root, iv)) continue;
        if (f > 0 && Math.max(hi, f) - Math.min(lo, f) > 3) continue;
        const c = Math.abs(f - mid);
        if (!best || c < best.c) best = { string: st, fret: f, iv, midi: F.OPEN[st] + f, c };
      }
    }
    if (best && !out.some((o) => o.string === best.string && o.fret === best.fret)) out.push(best);
  }
  return out.slice(0, 3);
}

// shells: root, 3rd and 7th, the root on the 6th or 5th string (1-3-7 on adjacent strings, 1-7-3 skipping one)
const SHELL_SETS = [[6, 5, 4], [6, 4, 3], [5, 4, 3], [5, 3, 2]];
export function shellsIn(root, sevId, pos) {
  const k = `shell|${T.notePc(root)}|${sevId}|${pos.lo}|${pos.hi}`;
  if (cache.has(k)) return cache.get(k);
  const t = Q[sevId].tones, third = t.find((x) => /^[b#]?3$/.test(x)) || t[1], sev = t.find((x) => /^b{0,2}7$/.test(x)) || t[3];
  const lo = Math.max(0, pos.lo - 1), hi = pos.hi + 1, seen = new Set(), out = [];
  for (const set of SHELL_SETS) for (const order of [[third, sev], [sev, third]]) {
    const opts = set.map((st, i) => { const iv = i ? order[i - 1] : '1', fs = []; for (let f = lo; f <= hi; f++) { if (f === 0 && pos.lo > 1) continue; if ((F.OPEN[st] + f) % 12 === pcOf(root, iv)) fs.push({ string: st, fret: f, midi: F.OPEN[st] + f, iv }); } return fs; });
    for (const a of opts[0]) for (const b of opts[1]) for (const c of opts[2]) {
      if (!(a.midi < b.midi && b.midi < c.midi)) continue;
      const ns = [a, b, c], fr = ns.filter((n) => n.fret > 0).map((n) => n.fret);
      if (fr.length && Math.max(...fr) - Math.min(...fr) > 3) continue;
      let outside = 0; for (const f of fr) outside += Math.max(0, pos.lo - f, f - pos.hi);
      if (outside > 1) continue;
      const v = finish({ notes: ns.map((n) => ({ ...n, note: T.transpose(root, F.simpleIv(n.iv)) })), set, group: 'shell', bassIv: '1', lo: fr.length ? Math.min(...fr) : 0, hi: Math.max(...ns.map((n) => n.fret)) });
      if (!seen.has(v.key) && playable(v)) { seen.add(v.key); out.push(v); }
    }
  }
  cache.set(k, out);
  return out;
}

// the cost of a change: voices that move (bass up, pitch by pitch; between a triad and a four-note chord, the new
// notes and how far each is from the nearest old one), how far they move, the strings the hand has to change, and
// what makes the new voicing less good
export function moveCost(a, b) {
  const x = a.notes.map((n) => n.midi).sort((p, q) => p - q), y = b.notes.map((n) => n.midi).sort((p, q) => p - q);
  let moved = 0, dist = 0;
  if (x.length === y.length) { for (let i = 0; i < y.length; i++) { const d = Math.abs(x[i] - y[i]); if (d) { moved++; dist += d; } } }
  else for (const m of y) { const d = Math.min(...x.map((o) => Math.abs(o - m))); if (d) { moved++; dist += d; } }
  const sa = new Set(a.notes.map((n) => n.string)), strings = b.notes.filter((n) => !sa.has(n.string)).length;
  const shift = Math.abs(a.notes.reduce((t, n) => t + n.fret, 0) / a.notes.length - b.notes.reduce((t, n) => t + n.fret, 0) / b.notes.length);
  return moved * 10 + dist + strings * 6 + shift + rough(b);
}
// which voices moved, bass up: "♯11 → 5, up a half step" (only between chords of the same size)
export function movedText(a, b) {
  if (a.notes.length !== b.notes.length) return [];
  const x = a.notes.slice().sort((p, q) => p.midi - q.midi), y = b.notes.slice().sort((p, q) => p.midi - q.midi);
  const out = [];
  for (let i = 0; i < y.length; i++) {
    const d = y[i].midi - x[i].midi;
    if (!d) continue;
    out.push(`${T.prettyIv(x[i].iv)} → ${T.prettyIv(y[i].iv)}, ${d < 0 ? 'down' : 'up'} ${Math.abs(d) === 1 ? 'a half step' : Math.abs(d) === 2 ? 'a whole step' : `${Math.abs(d)} half steps`}`);
  }
  return out;
}
function perms(a) { return a.length <= 1 ? [a] : a.flatMap((x, i) => perms(a.slice(0, i).concat(a.slice(i + 1))).map((r) => [x, ...r])); }
const same = (a, b) => a.notes.map((n) => n.midi).sort().join() === b.notes.map((n) => n.midi).sort().join();

// the route through a walk ([mode, 'rung' n | 'detour' | 'back']) on one root, in one area.
// kinds: { tri, sev, ext } which chords each mode plays, in that order (simple to rich); lane: the drop voicings;
// inv: 'all' plays every voicing of each chord in the area, 'one' plays each chord once, voice-led; grips: 'both',
// 'root' or 'rootless' for the extended chords; skip: a triad or 7th already played this lap isn't played again.
// A return to the rung plays one chord (its nearest). Each step: { ui (the walk entry), mode, kind, rung, part
// ('tri' | 'sev' | 'ext'), id, q, v, first (of its walk entry), inv (another voicing of the chord just played), moved }.
const MAX_BLOCK = 10;
export function route(root, walk, pos, laneId, { kinds = { tri: true, sev: true, ext: true }, inv = 'all', grips = 'both', skip = false } = {}) {
  const lane = laneById(laneId), mid = (pos.lo + pos.hi) / 2;
  const four = (id) => { let vs = voicingsIn(root, id, lane, pos); if (!vs.length && lane.id !== 'best') vs = voicingsIn(root, id, LANES[0], pos); return vs; };
  const played = new Set();
  const units = walk.map(([mode, kind], ui) => {
    const k = typeof kind === 'number' ? 'rung' : kind, groups = [], want = [], already = [];
    const once = (id) => { if (skip && played.has(id)) { already.push(id); return false; } if (k !== 'back') played.add(id); return true; };
    const tri = `tri:${TRIAD[mode]}`, sev = SEVENTH[mode];
    const centre = (v) => Math.abs(v.notes.reduce((t, n) => t + n.fret, 0) / v.notes.length - mid) + span(v) * 0.3;
    const best = (vs) => vs.slice().sort((a, b) => centre(a) - centre(b));
    // ten chords a mode at most: the triad in two voicings (on different strings), the 7th in three (a drop 2, a drop
    // 3 and a shell), then up to five other chords, one grip each; with one voicing each, the triad and 7th once
    if (kinds.tri && once(tri)) {
      const all = best(triadsIn(root, TRIAD[mode], pos)), two = all.slice(0, 1).concat(all.filter((v) => all[0] && v.set.join() !== all[0].set.join()).slice(0, 1));
      want.push(tri); groups.push({ id: tri, part: 'tri', vs: inv === 'all' ? two : all.slice(0, 1) });
    }
    if (kinds.sev && once(sev)) {
      const dv = four(sev), three = [best(dv.filter((v) => v.group === 2))[0], best(dv.filter((v) => v.group === 4))[0], best(shellsIn(root, sev, pos))[0]].filter(Boolean);
      want.push(sev); groups.push({ id: sev, part: 'sev', vs: inv === 'all' ? three : three.slice(0, 1) });
    }
    // a pick with no good grip in this shape gives its place to the mode's next chord
    const pool = [...picksOf(mode), ...chordsOf(mode).filter((c) => !(PICK[mode] || []).includes(c.key))];
    let taken = 0, extra = 0;
    if (kinds.ext) for (const c of pool) {
      if (taken >= 5) break;
      // each chord one grip: rooted, rootless, or (both) whichever sits nearest the chord before
      const r = c.rooted && grips !== 'rootless' ? rootedIn(root, c.rooted, pos, mode).slice(0, 3) : [];
      const rl = c.rootless && grips !== 'root' ? four(c.rootless).slice(0, 3) : [];
      let vs = [...r.map((v) => ({ v, id: c.rooted })), ...rl.map((v) => ({ v, id: c.rootless }))];
      // nothing of the kind asked for in this shape: the other kind
      if (!vs.length) vs = [...(c.rooted ? rootedIn(root, c.rooted, pos, mode).slice(0, 3).map((v) => ({ v, id: c.rooted })) : []), ...(c.rootless ? four(c.rootless).slice(0, 3).map((v) => ({ v, id: c.rootless })) : [])];
      const id = c.rooted || c.rootless;
      if (!vs.length) continue;
      taken++;
      // a second grip only when it's a really good one: within two frets, four notes or more, no tension in the bass,
      // on other strings than the first; the mode can then go past ten chords (twelve at most)
      const ranked = vs.slice().sort((a, b) => centre(a.v) - centre(b.v)), a = ranked[0];
      const great = (v) => span(v) <= 2 && v.notes.length >= 4 && rough(v) === 0;
      const b = extra < 2 ? ranked.find((x) => x !== a && great(x.v) && x.v.notes[0].string !== a.v.notes[0].string) : null;
      if (b && inv === 'all') { extra++; groups.push({ id, part: 'ext', vs: [a.v, b.v], ids: [a.id, b.id] }); }
      else groups.push({ id, part: 'ext', vs: vs.map((x) => x.v), ids: vs.map((x) => x.id), single: true });
    }
    const have = groups.filter((g) => g.vs.length);
    return { ui, mode, kind: k, rung: typeof kind === 'number' ? kind : null, groups: have, already, missing: want.filter((id) => !have.some((g) => g.id === id)) };
  });
  // a group's voicings as a sweep, low to high by the bass (at most ten, the nearest the middle)
  const sweep = (g) => { const idx = g.vs.map((v, i) => i).slice(0, MAX_BLOCK).sort((a, b) => g.vs[a].notes[0].midi - g.vs[b].notes[0].midi || g.vs[a].notes[g.vs[a].notes.length - 1].midi - g.vs[b].notes[g.vs[b].notes.length - 1].midi); return idx; };
  // the ways through one unit: triad, 7th, then the other chords simple to rich; each group swept up or down (the first
  // both ways, the rest whichever way starts nearer the chord before), or (one each) the voicing nearest the last
  function plans(u) {
    if (!u.groups.length) return [];
    const item = (g, i) => [g, g.vs[i], g.ids ? g.ids[i] : g.id];
    if (u.kind === 'back') return u.groups.flatMap((g) => g.vs.map((v, i) => ({ seq: [item(g, i)], cost: 0 })));
    const starts = inv === 'all' && !u.groups[0].single ? (() => { const s = sweep(u.groups[0]); return [s, s.slice().reverse()].map((o) => o.map((i) => item(u.groups[0], i))); })() : u.groups[0].vs.map((v, i) => [item(u.groups[0], i)]);
    return starts.map((h) => {
      const seq = h.slice();
      let cost = 0;
      for (let i = 1; i < h.length; i++) cost += moveCost(h[i - 1][1], h[i][1]);
      for (const g of u.groups.slice(1)) {
        const last = seq[seq.length - 1][1];
        if (inv === 'all' && !g.single) {
          const s = sweep(g), r = s.slice().reverse(), pick = moveCost(last, g.vs[s[0]]) <= moveCost(last, g.vs[r[0]]) ? s : r;
          for (const i of pick) { const prev = seq[seq.length - 1][1]; cost += moveCost(prev, g.vs[i]) + (same(prev, g.vs[i]) ? 40 : 0); seq.push(item(g, i)); }
        } else {
          let bi = 0; g.vs.forEach((v, i) => { if (moveCost(last, v) < moveCost(last, g.vs[bi])) bi = i; });
          cost += moveCost(last, g.vs[bi]) + (same(last, g.vs[bi]) ? 40 : 0); seq.push(item(g, bi));
        }
      }
      return { seq, cost };
    });
  }
  // dynamic programming over the units: the state is the last voicing played
  let states = [{ last: null, cost: 0, path: [] }];
  for (const u of units) {
    const ps = plans(u);
    if (!ps.length) { states = states.map((s) => ({ ...s, path: [...s.path, { u, seq: [] }] })); continue; }
    const next = new Map();
    for (const s of states) for (const p of ps) {
      const first = p.seq[0][1];
      const enter = s.last ? moveCost(s.last, first) + (same(s.last, first) ? 40 : 0) : Math.abs(first.notes.reduce((t, n) => t + n.fret, 0) / first.notes.length - mid) + (first.notes[0].iv === '1' ? 0 : 3);
      const c = s.cost + enter + p.cost, end = p.seq[p.seq.length - 1][1].key;
      if (!next.has(end) || next.get(end).cost > c) next.set(end, { last: p.seq[p.seq.length - 1][1], cost: c, path: [...s.path, { u, seq: p.seq }] });
    }
    states = [...next.values()].sort((a, b) => a.cost - b.cost).slice(0, 24);
  }
  const best = states.reduce((a, b) => (a.cost <= b.cost ? a : b));
  const steps = [];
  let prev = null;
  for (const { u, seq } of best.path) {
    if (!seq.length) { steps.push({ ui: u.ui, mode: u.mode, kind: u.kind, rung: u.rung, id: null, missing: u.missing }); continue; }
    seq.forEach(([g, v, id], i) => {
      steps.push({ ui: u.ui, mode: u.mode, kind: u.kind, rung: u.rung, part: g.part, id, q: Q[id], v, first: i === 0, inv: i > 0 && g === seq[i - 1][0], moved: prev ? movedText(prev, v) : [], missing: i === 0 ? u.missing : [], already: i === 0 ? u.already : [] });
      prev = v;
    });
  }
  return { steps, cost: best.cost };
}
