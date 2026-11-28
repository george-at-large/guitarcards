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

// ---------- moving between chords ----------
// The ii–V–I is the centre of chord practice in the usual teaching: guide tones first (the 7th of ii falls a
// half step to the 3rd of V, the 3rd of ii becomes the 7th of V), then shells, then drop 2 voicings moving to the
// nearest shape of the next chord (from every inversion of ii), the minor ii–V–i, drop 3, and the key's
// diatonic 7th chords up a string set.
const sym = (c) => T.pretty(T.chordSymbol(c.root, c.q));
function twoFiveOne(tonicPc, minor) {
  const KEYS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
  // the key's tonic spelled so its chords spell cleanly (F♯ major, B♭ minor)
  const t = T.parseNote(minor ? ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'G#', 'A', 'Bb', 'B'][tonicPc] : KEYS[tonicPc]);
  return minor
    ? [{ root: T.transpose(t, '2'), q: 'm7b5' }, { root: T.transpose(t, '5'), q: '7' }, { root: t, q: 'm7' }]
    : [{ root: T.transpose(t, '2'), q: 'm7' }, { root: T.transpose(t, '5'), q: '7' }, { root: t, q: 'maj7' }];
}
function cands(c, voicing, sets, extra = {}) {
  const out = [];
  for (const ss of sets) {
    let l = [];
    try { l = F.chordVoicings({ root: c.root, quality: c.q, voicing, stringSet: ss, inversion: 'all', ...extra }); } catch (e) { l = []; }
    for (const x of l) if (x.maxFret <= MAXF && x.minFret >= 0) out.push({ ...x, ss });
  }
  return out;
}
const mv = (a, b) => {
  const pa = a.notes.map((n) => n.midi).sort((x, y) => x - y), pb = b.notes.map((n) => n.midi).sort((x, y) => x - y);
  let d = 0; for (let i = 0; i < Math.min(pa.length, pb.length); i++) d += Math.abs(pa[i] - pb[i]);
  const av = (x) => x.notes.reduce((t, n) => t + n.fret, 0) / x.notes.length;
  // ties (the same pitches somewhere else) go to the shape nearest on the neck
  return d + (a.ss.join() === b.ss.join() ? 0 : 1.5) + Math.abs(av(a) - av(b)) * 0.5;
};
// each chord after the first: the candidate that moves least from the one before
function chain(chords, first, candFn) {
  const out = [first]; let prev = first;
  for (const c of chords.slice(1)) { const cs = candFn(c); if (!cs.length) break; prev = cs.reduce((a, b) => (mv(prev, a) <= mv(prev, b) ? a : b)); out.push(prev); }
  return out;
}
const near = (list, f) => list.reduce((a, b) => (Math.abs(a.minFret - f) <= Math.abs(b.minFret - f) ? a : b));
// a chain as steps, captioned chord by chord
const chainSteps = (chords, picks, what, head) => picks.map((x, i) => ({ notes: x.notes, text: `${head ? head + ' · ' : ''}${sym(chords[i])} · ${what(x)}` }));
function dropTwoFive(chords, voicing, sets) {
  const out = [];
  for (const ss of sets) {
    const starts = cands(chords[0], voicing, [ss]).filter((x) => x.maxFret <= 12).sort((a, b) => a.inversion - b.inversion || a.minFret - b.minFret);
    const seen = new Set();
    for (const st of starts) {
      if (seen.has(st.inversion)) continue; seen.add(st.inversion);
      const picks = chain(chords, st, (c) => cands(c, voicing, [ss]));
      out.push(...chainSteps(chords, picks, (x) => `${pl(x.label)} · strings ${SETNAME(ss)}`, `From ${sym(chords[0])} ${['in root position', 'in 1st inversion', 'in 2nd inversion', 'in 3rd inversion'][st.inversion]}`));
    }
  }
  return out;
}

export const MOVES = [
  { id: 'guide251', kind: 'grip', move: true, name: 'Guide tones through ii–V–I', rank: () => 1,
    how: 'Play just two notes of each chord, the 3rd and the 7th, as a pair on two neighbouring strings: ii, then V, then I, one per bar. Each time a note either stays put or moves one fret. Do it twice: once with the 3rd of ii underneath, once with its 7th underneath.',
    priority: 'This comes first: it is the voice leading every other ii–V–I voicing is built on. The 7th of ii falls a half step to the 3rd of V, and the 7th of V falls to the 3rd of I.',
    why: 'The 3rds and 7ths carry the sound of the changes. Hear and see them move and the rest of the chord is decoration.',
    steps: ({ key }) => {
      const ch = twoFiveOne(key, false), out = [];
      const dy = (c) => { const th = chordIvs(c.q).find((x) => ['3', 'b3'].includes(x)), sv = chordIvs(c.q).find((x) => ['7', 'b7'].includes(x)); return [[th, sv], [sv, th]].flatMap((order) => cands(c, 'custom', [[4, 3], [3, 2], [5, 4]], { order })); };
      for (const low of ['third', 'seventh']) {
        const first = dy(ch[0]).filter((x) => (low === 'third' ? ['3', 'b3'] : ['7', 'b7']).includes(x.notes.sort((a, b) => a.midi - b.midi)[0].iv));
        if (!first.length) continue;
        const picks = chain(ch, near(first, 5), dy);
        out.push(...chainSteps(ch, picks, (x) => `${x.notes.map((n) => T.prettyIv(n.iv)).join(' and ')} (${x.notes.map((n) => T.noteName(n.note, true)).join(' and ')})`, low === 'third' ? '3rd of ii underneath' : '7th of ii underneath'));
      }
      return out;
    } },
  { id: 'shell251', kind: 'grip', move: true, name: 'Shells through ii–V–I', rank: () => 2,
    how: 'Three-note shells (root, 3rd, 7th) for ii, V and I, one per bar, each moving to the nearest shell of the next chord. First with the ii root on the low E string, then with it on the A string. The root swaps strings as you go.',
    why: 'The usual first ii–V–I comping grips: small, clear, and the guide tones move just as in the line before.',
    steps: ({ key }) => {
      const ch = twoFiveOne(key, false), sets = [[6, 4, 3], [6, 5, 4], [5, 4, 3], [5, 3, 2]], out = [];
      const sh = (c) => cands(c, 'shell', sets).filter((x) => x.notes[0].iv === '1');
      for (const rs of [6, 5]) {
        const first = sh(ch[0]).filter((x) => x.ss[0] === rs);
        if (!first.length) continue;
        out.push(...chainSteps(ch, chain(ch, near(first, 5), sh), (x) => `root on the ${STR[x.ss[0]]} · ${pl(x.label)}`, `ii root on the ${STR[rs]}`));
      }
      return out;
    } },
  { id: 'drop2251', kind: 'grip', move: true, name: 'Drop 2 through ii–V–I', rank: () => 3,
    how: 'Start on one inversion of the ii chord on strings 4‑3‑2‑1, then play the V chord shape nearest to it, then the nearest I. Do this from each of the four inversions of ii. Then the same on strings 5‑4‑3‑2. One chord per bar.',
    why: 'This is how drop 2 voicings get used for real: moving smoothly between chords in one area, not jumping up the neck.',
    steps: ({ key }) => dropTwoFive(twoFiveOne(key, false), 'drop2', [[4, 3, 2, 1], [5, 4, 3, 2]]) },
  { id: 'minor251', kind: 'grip', move: true, name: 'Minor ii–V–i in drop 2', rank: () => 4,
    how: 'The same as drop 2 through ii–V–I, in the minor key: half-diminished ii, dominant V, minor i. From each inversion of the ii chord, on strings 4‑3‑2‑1 and then 5‑4‑3‑2.',
    why: 'Most standards use both major and minor ii–V’s.',
    steps: ({ key }) => dropTwoFive(twoFiveOne(key, true), 'drop2', [[4, 3, 2, 1], [5, 4, 3, 2]]) },
  { id: 'scale7', kind: 'grip', move: true, name: 'The key’s 7th chords up a string set', rank: () => 5,
    how: 'The seven 7th chords of the major key, I to vii and I again, climbing one string set in the same inversion: all in root position on strings 4‑3‑2‑1, then all in 1st inversion, 2nd, 3rd. Then the same on 5‑4‑3‑2.',
    why: 'You learn the shapes of every chord in the key and hear the key’s harmony go by in order.',
    steps: ({ key }) => {
      const t = T.parseNote(['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'][key]), out = [];
      const ch = [0, 1, 2, 3, 4, 5, 6, 0].map((i) => { const d = T.diatonicChord(t, 'major', i, 4); return { root: d.root, q: d.quality, tones: d.ivs }; });
      const RN = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'viiø', 'I'];
      for (const ss of [[4, 3, 2, 1], [5, 4, 3, 2]]) for (let inv = 0; inv < 4; inv++) {
        let prevLo = -1;
        ch.forEach((c, i) => {
          const bass = c.tones[inv];
          const all = cands(c, 'drop2', [ss]).filter((x) => F.simpleIv(x.bassIv) === F.simpleIv(bass)).sort((a, b) => a.minFret - b.minFret);
          if (!all.length) return;
          // keep climbing; when the neck runs out, carry on an octave lower
          const up = all.find((x) => x.minFret >= prevLo), x = up || all[0];
          prevLo = x.minFret;
          out.push({ notes: x.notes, text: `${['Root position', '1st inversion', '2nd inversion', '3rd inversion'][inv]} · ${RN[i]} ${sym(c)} · strings ${SETNAME(ss)}${up || i === 0 ? '' : ' · an octave down'}` });
        });
      }
      return out;
    } },
  { id: 'drop3251', kind: 'grip', move: true, name: 'Drop 3 through ii–V–I', rank: () => 6,
    how: 'Drop 3 voicings through ii–V–I: from each inversion of ii on strings 6‑4‑3‑2, move to the nearest V and I. Then on strings 5‑3‑2‑1.',
    why: 'The same moves with the bass note low and apart: a fuller comping sound.',
    steps: ({ key }) => dropTwoFive(twoFiveOne(key, false), 'drop3', [[6, 4, 3, 2], [5, 3, 2, 1]]) },
  { id: 'cycle', kind: 'grip', move: true, name: 'Your chord round the cycle of 4ths', rank: () => null,
    how: 'The chord you picked above, in all twelve keys going up in 4ths (C, F, B♭, E♭ …), drop 2 voicings, each moving to the nearest shape of the next so your hand stays in one area. One per bar.',
    why: 'Many tunes move round the cycle, and it gets one chord type into every key.',
    steps: ({ key, q }) => {
      const KEYS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
      const ch = Array.from({ length: 13 }, (_, i) => ({ root: T.parseNote(KEYS[(key + 5 * i) % 12]), q }));
      const vo = isTri(q) ? 'close' : 'drop2', sets = isTri(q) ? [[3, 2, 1], [4, 3, 2]] : [[4, 3, 2, 1], [5, 4, 3, 2]];
      const first = cands(ch[0], vo, sets);
      if (!first.length) return [];
      return chainSteps(ch, chain(ch, near(first, 5), (c) => cands(c, vo, sets)), (x) => `${pl(x.label)} · strings ${SETNAME(x.ss)}`);
    } },
  { id: 'arp251', kind: 'arp', move: true, scaleArea: true, name: 'Arpeggios through ii–V–I', rank: () => null,
    how: 'Eight notes of each chord’s arpeggio, a bar of 8ths per chord: ii, V, I, I. Start on the root of ii. When the chord changes, carry on to the nearest note of the new chord in the same direction, turning round at the edges of the area.',
    why: 'Joining arpeggios at the nearest chord tone is how lines follow the changes instead of restarting on each root.',
    gen: ({ P, key }) => {
      const ch = twoFiveOne(key, false), seq = [ch[0], ch[1], ch[2], ch[2]];
      const pcsOf = (c) => chordIvs(c.q).map((iv) => (T.notePc(c.root) + semi(iv)) % 12);
      let i = P.findIndex((n) => n.midi % 12 === T.notePc(ch[0].root)), dir = 1;
      if (i < 0) i = 0;
      const out = [];
      seq.forEach((c, k) => {
        const ok = (n) => pcsOf(c).includes(n.midi % 12), g = [];
        if (k > 0 || !ok(P[i])) { let j = i; while (j >= 0 && j < P.length && !ok(P[j])) j += dir; if (j < 0 || j >= P.length) { dir = -dir; j = i; while (j >= 0 && j < P.length && !ok(P[j])) j += dir; } i = Math.max(0, Math.min(P.length - 1, j)); }
        while (g.length < 8) {
          g.push(P[i]);
          let j = i + dir; while (j >= 0 && j < P.length && !ok(P[j])) j += dir;
          if (j < 0 || j >= P.length) { dir = -dir; j = i + dir; while (j >= 0 && j < P.length && !ok(P[j])) j += dir; }
          if (j < 0 || j >= P.length) break;
          i = j;
        }
        out.push(tag(g, sym(c)));
        // the next chord starts from the next step on
        let j = i + dir; if (j < 0 || j >= P.length) { dir = -dir; j = i + dir; } i = Math.max(0, Math.min(P.length - 1, j));
      });
      return out;
    } },
];
WORKOUTS.push(...MOVES.map((m) => ({ fits: () => true, ...m })));
// the ii–V–I of the key, named: "Am7 – D7 – Gmaj7"
export const progName = (key, minor = false) => twoFiveOne(key, minor).map(sym).join(' – ');

export const WK = Object.fromEntries(WORKOUTS.map((w) => [w.id, w]));

// the workouts for a chord: the ranked ones in order, then the extras
export function workoutsFor(q, move = null) {
  const fit = WORKOUTS.filter((w) => w.fits(q) && (move == null || !!w.move === move));
  const one = fit.filter((w) => !w.move), mov = fit.filter((w) => w.move);
  const order = (l) => [...l.filter((w) => w.rank(q)).sort((a, b) => a.rank(q) - b.rank(q)), ...l.filter((w) => !w.rank(q))];
  return [...order(one), ...order(mov)];
}

// an example from the root for an arpeggio workout: [[{ lab, iv, chrom }]]
export function chordExample(wid, q) {
  const w = WK[wid];
  if (w.kind !== 'arp' || w.move) return null;
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
