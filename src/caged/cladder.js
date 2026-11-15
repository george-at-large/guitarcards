// The ultimate ladder's chords: for each mode, its triad, its 7th chord and its extended chords (with their colours
// and sus chords), all in one CAGED area. Triads are close voicings on adjacent strings; 7ths and extended chords are
// four-note voicings from Ted Greene's V-System (drop 2 and drop 3 on their natural string sets). With inversions,
// the triad and the 7th are played in every voicing they have in the area, low to high or high to low; the route
// through the whole ladder is voice-led, so each chord takes the voicing that moves fewest voices the shortest way.
// Pure: no screen, no sound.
import * as T from '../theory.js';
import * as F from '../fretboard.js';
import * as G from './grips.js';
import { QUALS, voicingsOn } from './xmorph.js';

// the morpher's chords, plus Dorian ♭2's own 13sus♭9 and a 9sus4 that keeps its 5th (9 4 5 ♭7): one voice from the 9 chord, where the morpher's
// "11" grip (1 4 ♭7 9) is two away
const Q = { ...QUALS, '13susb9': { id: '13susb9', sym: '13sus4♭9', tones: ['b9', '4', '13', 'b7'], from: 'Dorian ♭2, the 2nd mode of melodic minor', use: 'The sus♭9 with Dorian’s 13 on top: dark below, bright above, the sound of modal jazz vamps.' }, '9sus': { id: '9sus', sym: '9sus4', tones: ['9', '4', '5', 'b7'], from: 'Mixolydian, with the 4th in place of the 3rd', use: 'The suspended dominant: the 3rd held back a half step up, waiting to fall.' } };
for (const [q, sym] of [['maj', ''], ['min', 'm'], ['dim', '°'], ['aug', '+']]) Q[`tri:${q}`] = { id: `tri:${q}`, sym, tones: T.getChord(q).ivs, use: 'The triad: the three notes that make it major, minor, diminished or augmented. Every voicing of it in the shape, then the richer chords.' };
export const CHORD = Q;
// each mode's triad and 7th chord (the altered scale read as a dominant: its ♭4 sounds as the 3rd, its ♭6 as the ♯5)
export const TRIAD = { lydian: 'maj', ionian: 'maj', 'mel-min': 'min', mixolydian: 'maj', 'lyd-dom': 'maj', dorian: 'min', 'dorian-b2': 'min', aeolian: 'min', 'harm-min': 'min', 'locrian-n2': 'dim', phrygian: 'min', 'phryg-dom': 'maj', locrian: 'dim', altered: 'aug', 'dim-hw': 'maj' };
export const SEVENTH = { lydian: 'maj7', ionian: 'maj7', 'mel-min': 'mMaj7', mixolydian: '7', 'lyd-dom': '7', dorian: 'm7', 'dorian-b2': 'm7', aeolian: 'm7', 'harm-min': 'mMaj7', 'locrian-n2': 'm7b5', phrygian: 'm7', 'phryg-dom': '7', locrian: 'm7b5', altered: '7#5', 'dim-hw': '7' };

// the rootless vocabulary (Ted Greene's four-note grips: the 9 in place of the root, the 13 in place of the 5th),
// the way jazz guitarists comp with a bass player; also the fallback where no rooted grip fits the shape
export const ROOTLESS = {
  lydian: ['maj7#11', 'maj9#11'], ionian: ['maj9', '69'], 'mel-min': ['mMaj9', 'm69'], mixolydian: ['13', '9', '9sus'], 'lyd-dom': ['9#11'],
  dorian: ['m13', 'm9', 'm11'], 'dorian-b2': ['13susb9', 'susb9'], aeolian: ['m9', 'm11'], 'harm-min': ['mMaj9'], 'locrian-n2': ['m9b5'],
  phrygian: ['susb9', 'm7_11'], 'phryg-dom': ['7b9', '7b9#5'], locrian: ['m7b5'], altered: ['7#9#5', '7b9#5', '7#9b5'], 'dim-hw': ['13b9', '13#9'],
};
// each mode's extended chords, rooted: the root in the bass, the 3rd (or the sus 4th), the 7th and the mode's own
// tension; its other tensions (and the 5th) are add-ons, drawn faintly where a free string can take them
const R = (id, sym, tones, add, use) => { Q[id] = { id, sym, tones, add, use, rooted: true }; return id; };
export const MODE_CHORDS = {
  lydian: [R('r:lyd', 'maj7♯11', ['1', '3', '7', '#11'], ['9', '13', '5'], 'The Lydian chord: the ♯11 floats where the plain 11 would clash. Add the 9 for maj9♯11.')],
  ionian: [R('r:ion', 'maj9', ['1', '3', '7', '9'], ['13', '5'], 'The lush major tonic: I and IV in soul, jazz and ballads.'), R('r:ion69', '6/9', ['1', '3', '6', '9'], ['5'], 'The major chord with nothing leaning: the ending chord of jazz and bossa nova.')],
  'mel-min': [R('r:mm', 'm(maj9)', ['1', 'b3', '7', '9'], ['13', '11', '5'], 'The film-noir minor tonic: minor with its leading tone. Add the 13 for the full melodic minor sound.')],
  mixolydian: [R('r:mix', '13', ['1', '3', 'b7', '13'], ['9', '5'], 'The sweet dominant of blues, funk and soul.'), R('r:mixsus', '9sus4', ['1', '4', 'b7', '9'], ['5', '13'], 'The suspended dominant: the 4th in place of the 3rd, waiting to fall (or left floating).')],
  'lyd-dom': [R('r:ld', '7♯11', ['1', '3', 'b7', '#11'], ['9', '13'], 'A dominant that doesn’t resolve down a 5th: IV7 in the blues, ♭VII7, the tritone sub.')],
  dorian: [R('r:dor', 'm13', ['1', 'b3', 'b7', '13'], ['9', '11', '5'], 'Dorian’s bright natural 13 on a minor 7th: ii in a major key, or a modal vamp.'), R('r:dor11', 'm11', ['1', 'b3', 'b7', '11'], ['9', '5'], 'The So What sound: open, modal, neo-soul.')],
  'dorian-b2': [R('r:db2', '7sus4♭9', ['1', '4', 'b7', 'b9'], ['13', '5'], 'The sus♭9: dark and modal. Add the 13 for Dorian ♭2’s own colour.')],
  aeolian: [R('r:aeo', 'm9', ['1', 'b3', 'b7', '9'], ['11', '5'], 'The smooth minor: the 9 on a minor 7th. The ♭13 is the one to avoid over it.')],
  'harm-min': [R('r:hm', 'm(maj9)', ['1', 'b3', '7', '9'], ['11', '5'], 'Minor with its leading tone, the harmonic minor tonic. The ♭13 rubs, so leave it out.')],
  'locrian-n2': [R('r:ln2', 'm7♭5', ['1', 'b3', 'b5', 'b7'], ['9', '11'], 'The half-diminished chord, softened: add the natural 9 for m9♭5, ii of a minor key.')],
  phrygian: [R('r:phr', '7sus4♭9', ['1', '4', 'b7', 'b9'], ['5', 'b13'], 'The Phrygian chord: sus♭9, dark and Spanish-tinged.'), R('r:phr11', 'm7(11)', ['1', 'b3', 'b7', '11'], ['5'], 'Phrygian as a minor chord: the 11 is safe, the ♭9 and ♭13 are not.')],
  'phryg-dom': [R('r:pd', '7♭9', ['1', '3', 'b7', 'b9'], ['b13', '5'], 'V7 to a minor chord: the ♭9 falls a half step into its 5th. Add the ♭13 for the full harmonic-minor dominant.')],
  locrian: [R('r:loc', 'm7♭5', ['1', 'b3', 'b5', 'b7'], ['11', 'b13'], 'The half-diminished chord: ii of a minor ii–V. The 11 is the tension to add.')],
  altered: [R('r:alt', '7♯9', ['1', '3', 'b7', '#9'], ['b13', 'b9'], 'The altered dominant: ♯9 on top, ♭13 and ♭9 to add. Every tension wants to resolve.'), R('r:altb9', '7♭9', ['1', '3', 'b7', 'b9'], ['b13', '#9'], 'The altered dominant with the ♭9: add the ♭13 for 7♭9♭13.')],
  'dim-hw': [R('r:dim', '13', ['1', '3', 'b7', '13'], ['b9', '#9', '#11'], 'The diminished-scale dominant: a bright 13 with a dark ♭9 to add (13♭9), the big-band and bebop sound.')],
};
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
export function rootedIn(root, id, lane, pos) {
  const k = `root|${T.notePc(root)}|${id}|${pos.lo}|${pos.hi}`;
  if (cache.has(k)) return cache.get(k);
  const ch = Q[id], need = ch.tones.filter((x) => x !== '1'), opt = !ch.tones.some((x) => /5$/.test(x)) && (ch.add || []).includes('5') ? ['5'] : [];
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
// the add-ons a rooted voicing can take: each of the chord's optional notes on a string the grip leaves free (above
// the bass), within the grip's reach (the stretch still at most four frets)
export function addOnsFor(root, id, v) {
  const add = Q[id]?.add || [], used = new Set(v.notes.map((n) => n.string)), bass = v.notes[0].string, out = [];
  const fr = v.notes.filter((n) => n.fret > 0).map((n) => n.fret), lo = fr.length ? Math.min(...fr) : 0, hi = fr.length ? Math.max(...fr) : 0, mid = (lo + hi) / 2;
  // each add-on once, in the spot nearest the grip, the whole hand still within four frets; three at most
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
// kinds: { tri, sev, ext } which chords each mode plays, in that order (simple to rich); lane: the four-note voicings;
// inv: 'all' plays the triad and the 7th in every voicing they have in the area, 'one' plays each once, voice-led.
// A return to the rung plays one chord (its nearest). Each step: { ui (the walk entry), mode, kind, rung, part
// ('tri' | 'sev' | 'ext'), id, q, v, first (of its walk entry), inv (another voicing of the chord just played), moved }.
const MAX_BLOCK = 8;
export function route(root, walk, pos, laneId, { kinds = { tri: true, sev: true, ext: true }, inv = 'all', grips = 'root' } = {}) {
  const lane = laneById(laneId), mid = (pos.lo + pos.hi) / 2;
  const four = (id) => { let vs = voicingsIn(root, id, lane, pos); if (!vs.length && lane.id !== 'best') vs = voicingsIn(root, id, LANES[0], pos); return vs; };
  // a triad or 7th chord already played this lap (Ionian's after Lydian's, Dorian ♭2's after Dorian's) isn't played
  // again: the mode's own sound is in its extended chords
  const played = new Set();
  const units = walk.map(([mode, kind], ui) => {
    const k = typeof kind === 'number' ? 'rung' : kind, groups = [], want = [], already = [];
    const once = (id) => { if (played.has(id)) { already.push(id); return false; } if (k !== 'back') played.add(id); return true; };
    if (kinds.tri && once(`tri:${TRIAD[mode]}`)) { const id = `tri:${TRIAD[mode]}`; want.push(id); groups.push({ id, part: 'tri', vs: triadsIn(root, TRIAD[mode], pos), block: true }); }
    if (kinds.sev && once(SEVENTH[mode])) { const id = SEVENTH[mode]; want.push(id); groups.push({ id, part: 'sev', vs: four(id), block: true }); }
    if (kinds.ext && grips === 'rootless') for (const id of ROOTLESS[mode] || []) { want.push(id); groups.push({ id, part: 'ext', vs: four(id), block: false }); }
    else if (kinds.ext) for (const [i, id] of (MODE_CHORDS[mode] || []).entries()) {
      // rooted; where no rooted grip fits the shape, the rootless one in its place
      const vs = rootedIn(root, id, lane, pos);
      if (vs.length) { want.push(id); groups.push({ id, part: 'ext', vs, block: false }); continue; }
      const alt = (ROOTLESS[mode] || [])[i];
      if (alt) { want.push(alt); groups.push({ id: alt, part: 'ext', vs: four(alt), block: false }); }
    }
    const have = groups.filter((g) => g.vs.length);
    return { ui, mode, kind: k, rung: typeof kind === 'number' ? kind : null, groups: have, already, missing: want.filter((id) => !have.some((g) => g.id === id)) };
  });
  // a block: every voicing in the area (the nearest the middle, at most eight), low to high or high to low
  const sweeps = (g) => { const s = g.vs.slice(0, MAX_BLOCK).sort((a, b) => a.notes[0].midi - b.notes[0].midi || a.notes[a.notes.length - 1].midi - b.notes[b.notes.length - 1].midi); return [s, s.slice().reverse()]; };
  // the ways through one unit: triad, 7th, then the extended chords in any order (a sus can resolve into the mode's
  // own chord); each block swept up or down, each single chord in the voicing nearest the one before
  function plans(u) {
    if (!u.groups.length) return [];
    if (u.kind === 'back') return u.groups.flatMap((g) => g.vs.map((v) => ({ seq: [[g, v]], cost: 0 })));
    const fixed = u.groups.filter((g) => g.part !== 'ext'), ext = u.groups.filter((g) => g.part === 'ext');
    const out = [];
    const tails = perms(ext);
    // the first group: every way to start it (both sweeps of a block, or any single voicing)
    const g0 = fixed[0] || null;
    for (const order of tails) {
      const groups = g0 ? [...fixed, ...order] : order;
      const first = groups[0];
      const starts = first.block && inv === 'all' && first.vs.length > 1 ? sweeps(first).map((vs) => vs.map((v) => [first, v])) : first.vs.map((v) => [[first, v]]);
      // later blocks: both sweeps tried
      const later = groups.slice(1);
      const combos = later.reduce((acc, g) => acc.flatMap((c) => (g.block && inv === 'all' && g.vs.length > 1 ? [[...c, 0], [...c, 1]] : [[...c, -1]])), [[]]);
      for (const h of starts) for (const combo of combos) {
        const seq = h.slice();
        let cost = 0;
        for (let i = 1; i < h.length; i++) cost += moveCost(h[i - 1][1], h[i][1]);
        later.forEach((g, i) => {
          const last = seq[seq.length - 1][1];
          if (combo[i] >= 0) { for (const v of sweeps(g)[combo[i]]) { cost += moveCost(seq[seq.length - 1][1], v) + (same(seq[seq.length - 1][1], v) ? 40 : 0); seq.push([g, v]); } return; }
          const v = g.vs.reduce((x, y) => (moveCost(last, x) <= moveCost(last, y) ? x : y));
          cost += moveCost(last, v) + (same(last, v) ? 40 : 0); seq.push([g, v]);
        });
        out.push({ seq, cost });
      }
    }
    return out;
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
    // keep the search small: the cheapest few dozen ways in
    states = [...next.values()].sort((a, b) => a.cost - b.cost).slice(0, 40);
  }
  const best = states.reduce((a, b) => (a.cost <= b.cost ? a : b));
  const steps = [];
  let prev = null;
  for (const { u, seq } of best.path) {
    if (!seq.length) { steps.push({ ui: u.ui, mode: u.mode, kind: u.kind, rung: u.rung, id: null, missing: u.missing }); continue; }
    seq.forEach(([g, v], i) => {
      steps.push({ ui: u.ui, mode: u.mode, kind: u.kind, rung: u.rung, part: g.part, id: g.id, q: Q[g.id], v, first: i === 0, inv: i > 0 && g.id === seq[i - 1][0].id, moved: prev ? movedText(prev, v) : [], missing: i === 0 ? u.missing : [], already: i === 0 ? u.already : [] });
      prev = v;
    });
  }
  return { steps, cost: best.cost };
}
