// Chord workouts: one chord in one key, practised the way teachers set it. Two kinds:
// - arpeggio workouts run single notes over the chord tones in the chosen area (like the scale drills);
// - voicing workouts are grips stepped through on the neck, one per bar.
// rank gives the usual order of priority (arpeggio through the shape, from every chord tone, shells, drop 2,
// drop 3; for triads: close triads, then the CAGED forms); workouts without a rank are extras.
import * as T from '../theory.js';
import * as F from '../fretboard.js';
import * as G from '../caged/grips.js';
import { semi } from './data.js';

export const CHORD_LIST = [
  ['Seventh chords', [['maj7', 'Major 7th'], ['7', 'Dominant 7th'], ['m7', 'Minor 7th'], ['m7b5', 'Half-diminished (m7♭5)'], ['dim7', 'Diminished 7th'], ['mMaj7', 'Minor-major 7th'], ['6', 'Major 6th'], ['m6', 'Minor 6th'], ['7sus4', '7sus4']]],
  ['Triads', [['maj', 'Major triad'], ['min', 'Minor triad']]],
];
export const CHORD_NAME = Object.fromEntries(CHORD_LIST.flatMap((g) => g[1]));
export const chordIvs = (q) => T.getChord(q).ivs;
const isTri = (q) => chordIvs(q).length === 3;
const STR = { 6: 'low E', 5: 'A', 4: 'D', 3: 'G', 2: 'B', 1: 'high E' };
const SETNAME = (ss) => ss.join('‑');
// an engine label made readable: b7 → ♭7, bb7 → 𝄫7, 1-b7-b3 → 1‑♭7‑♭3 (and "bass" left alone)
const pl = (t) => t.replace(/(^|[\s(-])bb(\d)/g, '$1𝄫$2').replace(/(^|[\s(-])b(\d)/g, '$1♭$2').replace(/#/g, '♯').replace(/(\d)-(?=[♭𝄫♯]?\d)/g, '$1‑');
const CHROM = ['1', '♭2', '2', '♭3', '3', '4', '♯4', '5', '♭6', '6', '♭7', '7'];
const MAXF = 15;

const tag = (g, label, dir) => Object.assign(g, label ? { label } : {}, dir ? { dir } : {});
const chunk = (list, dir) => { const out = []; for (let i = 0; i < list.length; i += 8) out.push(tag(list.slice(i, i + 8), null, dir)); return out; };
const upThenDown = (a) => chunk(a, 'up').concat(chunk([...a].reverse().slice(1), 'down'));
const thirdOf = (q) => chordIvs(q).find((x) => ['3', 'b3', '4', '2'].includes(x));
const seventhOf = (q) => chordIvs(q).find((x) => ['7', 'b7', 'bb7', '6'].includes(x));

// a voicing as a step: its notes and a caption
const step = (x, text) => ({ notes: x.notes, text });
function upAndBack(root, q, voicing, ss) {
  const up = F.chordVoicings({ root, quality: q, voicing, stringSet: ss, inversion: 'all' }).filter((x) => x.maxFret <= MAXF).sort((a, b) => a.minFret - b.minFret || a.inversion - b.inversion);
  const seq = up.concat(up.slice(0, -1).reverse());
  return seq.map((x, i) => step(x, `${pl(x.label)} · strings ${SETNAME(ss)}${i >= up.length ? ' · coming back down' : ''}`));
}

export const WORKOUTS = [
  // ---------- arpeggios ----------
  { id: 'arp', kind: 'arp', name: 'Arpeggio through the shape', rank: () => 1,
    how: 'Play only the chord tones, from the lowest one in the shape to the highest, then back down. One note per click subdivision.',
    why: 'This is the chord as a shape you can solo with. Everything else builds on knowing where its notes are.',
    fits: () => true, gen: ({ P }) => upThenDown(P) },
  { id: 'arpinv', kind: 'arp', name: 'Arpeggio from every chord tone', rank: () => 2,
    how: 'Play the arpeggio starting from each chord tone in turn, each time up to the same note an octave higher and back down: from the root, then the 3rd, then the 5th, then the 7th. Use the lowest one of each in the shape.',
    priority: 'Do all of them: that’s every inversion. If time is short, the 3rd and 7th starts come first, because those notes define the chord. The root start is the one you probably know already.',
    why: 'Real lines rarely start on the root. Each starting note gives you a different shape on the neck.',
    fits: () => true, gen: ({ P, ivs }) => {
      const k = ivs.length, out = [];
      for (const iv of ivs) {
        const i = P.findIndex((n) => semi(n.iv) === semi(iv));
        if (i < 0 || P.length - i < k) continue;
        const up = P.slice(i, i + k + 1);
        out.push(tag(up, `from the ${T.prettyIv(iv)}`, 'up'), tag([...up].reverse().slice(1), null, 'down'));
      }
      return out;
    } },
  { id: 'guide', kind: 'arp', name: 'Guide tones only (3rds and 7ths)', rank: () => null,
    how: 'Play only the 3rds and 7ths of the chord, lowest to highest in the shape and back. Leave out the root and 5th.',
    why: 'The 3rd and 7th say what kind of chord it is. Jazz lines and comping are built on them.',
    fits: (q) => !isTri(q), gen: ({ P, q }) => upThenDown(P.filter((n) => [thirdOf(q), seventhOf(q)].map(semi).includes(semi(n.iv)))) },
  { id: 'three9', kind: 'arp', name: 'From the 3rd up to the 9th', rank: () => null,
    how: 'Start on a 3rd and play four chord notes up: 3rd, 5th, 7th, 9th. Do it from each 3rd in the shape, going up, then play the same groups coming down.',
    why: 'The 3‑to‑9 arpeggio is a rootless 9th chord: one of the most used sounds in jazz lines, and it avoids landing on the root.',
    fits: (q) => !isTri(q) && q !== 'dim7', gen: ({ Pext, q }) => {
      const noRoot = Pext.filter((n) => semi(n.iv) !== 0), t = semi(thirdOf(q)), up = [];
      noRoot.forEach((n, i) => { if (semi(n.iv) === t && i + 3 < noRoot.length) up.push(tag(noRoot.slice(i, i + 4), 'from the ' + T.prettyIv(n.iv), 'up')); });
      return up.concat([...up].reverse().map((g) => tag([...g].reverse(), g.label, 'down')));
    } },
  { id: 'approach', kind: 'arp', name: 'Approach each note from below', rank: () => null,
    how: 'Before each chord tone, play the note one fret below it, then the chord tone. Go up through the shape, then back down.',
    why: 'Approaching from a half step below is the most common way to lead into a chord tone in blues and jazz.',
    fits: () => true, gen: ({ P, pc }) => {
      const g = P.filter((n) => n.fret > 0).map((n) => { const b = { string: n.string, fret: n.fret - 1, midi: n.midi - 1, iv: null }; b.chrom = CHROM[((b.midi - pc) % 12 + 12) % 12]; return [b, n]; });
      return g.map((x) => tag(x, null, 'up')).concat([...g].reverse().map((x) => tag([...x], null, 'down')));
    } },
  // ---------- voicings ----------
  { id: 'shell', kind: 'grip', name: 'Shell voicings', rank: (q) => (isTri(q) ? null : 3),
    how: 'Three-note grips: root, 3rd and 7th. Four of them: root on the low E string (1‑7‑3, then 1‑3‑7) and root on the A string (1‑7‑3, then 1‑3‑7). Play each, one per bar, and say which note is on top.',
    why: 'The usual first step in jazz chords: the smallest grip that says exactly what the chord is.',
    fits: (q) => !isTri(q), steps: ({ root, q }) => {
      const out = [];
      for (const [ss, nm] of [[[6, 4, 3], 'root on the low E'], [[6, 5, 4], 'root on the low E'], [[5, 3, 2], 'root on the A'], [[5, 4, 3], 'root on the A']]) {
        const v = F.chordVoicings({ root, quality: q, voicing: 'shell', stringSet: ss }).filter((x) => x.notes[0].iv === '1' && x.maxFret <= MAXF).sort((a, b) => a.minFret - b.minFret);
        if (v[0]) out.push(step(v[0], `Shell · ${nm} · ${pl(v[0].notes.map((n) => n.iv).join('-'))} · strings ${SETNAME(ss)}`));
      }
      return out;
    } },
  { id: 'drop2', kind: 'grip', name: 'Drop 2 inversions', rank: (q) => (isTri(q) ? null : 4),
    how: 'Four-note grips on four neighbouring strings. On strings 4‑3‑2‑1, play root position, then 1st, 2nd and 3rd inversion, climbing the neck, then come back down. Then the same on strings 5‑4‑3‑2. One grip per bar.',
    why: 'The most used family of chord voicings in jazz guitar.',
    fits: (q) => !isTri(q), steps: ({ root, q }) => [[4, 3, 2, 1], [5, 4, 3, 2]].flatMap((ss) => upAndBack(root, q, 'drop2', ss)) },
  { id: 'drop3', kind: 'grip', name: 'Drop 3 inversions', rank: (q) => (isTri(q) ? null : 5),
    how: 'Four-note grips with a string skipped after the bass note. On strings 6‑4‑3‑2, play all four inversions up the neck and back; then on strings 5‑3‑2‑1. One grip per bar.',
    why: 'Usually learned after drop 2: the bass note sits low and apart, good for comping and chord melody.',
    fits: (q) => !isTri(q), steps: ({ root, q }) => [[6, 4, 3, 2], [5, 3, 2, 1]].flatMap((ss) => upAndBack(root, q, 'drop3', ss)) },
  { id: 'close', kind: 'grip', name: 'Triad inversions on each string set', rank: (q) => (isTri(q) ? 3 : null),
    how: 'Three-note grips on three neighbouring strings. On strings 3‑2‑1, play root position, 1st and 2nd inversion up the neck and back. Then on 4‑3‑2, 5‑4‑3 and 6‑5‑4. One grip per bar.',
    why: 'Triads on every string set are the map of the neck that most other chords and lines hang on.',
    fits: (q) => isTri(q), steps: ({ root, q }) => [[3, 2, 1], [4, 3, 2], [5, 4, 3], [6, 5, 4]].flatMap((ss) => upAndBack(root, q, 'close', ss)) },
  { id: 'caged', kind: 'grip', name: 'The five CAGED forms', rank: (q) => (isTri(q) ? 4 : null),
    how: 'The chord as each of the five CAGED shapes, one per bar, climbing the neck: whichever comes first, then the next, until you’re back to the first an octave up.',
    why: 'Shows where the chord lives in every area of the neck, joined end to end.',
    fits: () => true, steps: ({ root, q }) => {
      const all = [];
      for (const sh of G.SHAPES) for (const p of G.placements(root, q, sh)) if (p.hi <= MAXF) all.push({ ...p, sh });
      all.sort((a, b) => a.lo - b.lo || a.center - b.center);
      const out = []; let last = null;
      for (const p of all) { if (p.sh === last) continue; last = p.sh; out.push({ notes: p.notes, text: `${p.sh} form · frets ${p.lo}–${p.hi}` }); if (out.length >= 6) break; }
      return out;
    } },
  { id: 'inarea', kind: 'grip', name: 'Every voicing in this shape', rank: () => null, usesArea: true,
    how: 'All the inversions that fit inside the area you picked, one per bar: drop 2 and drop 3 for a 7th chord, close and spread triads for a triad. Lowest strings first.',
    why: 'Stay in one position and find the chord everywhere in it, the way you need to when comping without jumping around.',
    fits: () => true, steps: ({ root, q, area }) => {
      const fams = isTri(q) ? [['close', [[3, 2, 1], [4, 3, 2], [5, 4, 3], [6, 5, 4]]], ['spread', [[6, 4, 3], [5, 3, 2], [4, 2, 1]]]] : [['drop2', [[4, 3, 2, 1], [5, 4, 3, 2], [6, 5, 4, 3]]], ['drop3', [[6, 4, 3, 2], [5, 3, 2, 1]]]];
      const w = area.win, out = [];
      for (const [v, sets] of fams) for (const ss of sets) for (const x of F.chordVoicings({ root, quality: q, voicing: v, stringSet: ss, inversion: 'all' })) {
        if (x.minFret >= Math.max(0, w.lo - 1) && x.maxFret <= w.hi + 1) out.push({ ...step(x, `${{ drop2: 'Drop 2', drop3: 'Drop 3', close: 'Close triad', spread: 'Spread triad' }[v]} · ${pl(x.label)} · strings ${SETNAME(ss)}`), lo: ss[0] });
      }
      return out.sort((a, b) => b.lo - a.lo);
    } },
];
export const WK = Object.fromEntries(WORKOUTS.map((w) => [w.id, w]));

// the workouts for a chord: the ranked ones in order, then the extras
export function workoutsFor(q) {
  const fit = WORKOUTS.filter((w) => w.fits(q));
  const ranked = fit.filter((w) => w.rank(q)).sort((a, b) => a.rank(q) - b.rank(q));
  return [...ranked, ...fit.filter((w) => !w.rank(q))];
}

// an example from the root for an arpeggio workout: [[{ lab, iv, chrom }]]
export function chordExample(wid, q) {
  const w = WK[wid];
  if (w.kind !== 'arp') return null;
  const ivs = chordIvs(q), ext = [...ivs, '9'].filter((x, i, a) => a.findIndex((y) => semi(y) === semi(x)) === i).sort((a, b) => semi(a) - semi(b));
  const mk = (list) => { const P = []; for (let o = 0; o < 3; o++) for (const iv of list) P.push({ iv, midi: 60 + semi(iv) + 12 * o, string: 1, fret: 5 }); return P; };
  const P = mk(ivs), Pext = mk(ext);
  const lab = (n) => {
    if (n.chrom) return n.chrom;
    const d = Number(n.iv.replace(/[^0-9]/g, ''));
    if (n.midi < 72) return T.prettyIv(n.iv);
    return T.prettyIv(d === 1 ? '8' : d === 2 ? n.iv.replace('2', '9') : n.iv);
  };
  const groups = w.gen({ P, Pext, ivs, q, pc: 0 }).filter((g) => g.some(Boolean));
  const [ng, nn] = { arp: [1, 5], arpinv: [4, 5], guide: [1, 6], three9: [2, 4], approach: [3, 2] }[wid] || [3, 8];
  return groups.slice(0, ng).map((g) => g.filter(Boolean).slice(0, nn).map((n) => ({ lab: lab(n), iv: n.chrom ? n.chrom.replace('♭', 'b').replace('♯', '#') : n.iv })));
}
