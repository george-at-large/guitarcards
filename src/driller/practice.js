// Kinds of practice. Each one turns the area's playing path (the scale low to high in that position) into groups of
// notes: the pattern you play, shown as degrees and played by the guide. A null in a group is a rest (a held note).
// fits() says which scales it suits: 3rds and diatonic 7ths need a seven-note scale, cells in minor 3rds belong to
// the diminished scales, and so on.
import * as T from '../theory.js';
import { TIPS, sizeOf, pcsOf, ivsOf, chordOf, semi } from './data.js';

export const CATS = [
  ['runs', 'Runs'],
  ['seq', 'Sequences'],
  ['arp', 'Arpeggios'],
  ['voc', 'Vocabulary'],
];
const CHROM = ['1', '♭2', '2', '♭3', '3', '4', '♯4', '5', '♭6', '6', '♭7', '7'];
// a group can carry a label (Strings 6 & 4, into ♭3) and a direction (up or down), shown with the pattern
const tag = (g, label, dir) => Object.assign(g, label ? { label } : {}, dir ? { dir } : {});
const mirror = (groups) => [...groups].reverse().map((g) => tag([...g].reverse(), g.label, 'down'));
const updown = (groups) => groups.map((g) => tag(g, g.label, 'up')).concat(mirror(groups));
const slide = (P, offs, step = 1) => { const out = []; const span = Math.max(...offs); for (let i = 0; i + span < P.length; i += step) out.push(offs.map((o) => P[i + o])); return out; };
const chunk = (list, k = 8, dir = null) => { const out = []; for (let i = 0; i < list.length; i += k) out.push(tag(list.slice(i, i + k), null, dir)); return out; };
const upThenDown = (a) => chunk(a, 8, 'up').concat(chunk([...a].reverse().slice(1), 8, 'down'));
const isRoot = (n) => semi(n.iv) === 0;
const rootIdx = (P) => P.map((n, i) => (isRoot(n) ? i : -1)).filter((i) => i >= 0);

// the major pentatonics a scale holds, as offsets from its root
export function hiddenPents(id) {
  const pcs = pcsOf(ivsOf(id));
  const out = [];
  for (let x = 0; x < 12; x++) if ([0, 2, 4, 7, 9].every((o) => pcs.includes((x + o) % 12))) out.push(x);
  return out;
}
const isBebop = (id) => id.startsWith('bebop');
const isDim = (id) => id.startsWith('dim-');

export const PRACTICES = [
  { id: 'updown', cat: 'runs', name: 'Up and down', how: 'Play every note in the shape from the lowest to the highest, then back down to the lowest.',
    fits: () => true, gen: ({ P }) => upThenDown(P) },
  { id: 'rootroot', cat: 'runs', name: 'Root to root', how: 'Start on the lowest root. Play up the scale to the highest root, then back down to where you started.',
    fits: () => true, gen: ({ P }) => { const r = rootIdx(P); if (r.length < 2) return upThenDown(P); return upThenDown(P.slice(r[0], r[r.length - 1] + 1)); } },
  { id: 'anywhere', cat: 'runs', name: 'Start anywhere', how: 'Start on the note given below instead of the root. Play up to the highest note in the shape, down to the lowest, then back up to where you started.',
    fits: () => true, gen: ({ P, seed }) => { const s = Math.floor(seed * (P.length - 2)) + 1; return [...chunk(P.slice(s), 8, 'up'), ...chunk([...P].reverse().slice(1), 8, 'down'), ...chunk(P.slice(1, s + 1), 8, 'up')]; } },
  { id: 'skip', cat: 'runs', name: 'String skipping', how: 'Play the notes on the low E string, then jump over the A string and play the notes on the D string. Then do the same on A and G, D and B, G and high E. Come back down the same way.',
    fits: () => true, gen: ({ notes }) => { const on = (s) => notes.filter((n) => n.string === s).sort((a, b) => a.fret - b.fret); const up = [[6, 4], [5, 3], [4, 2], [3, 1]].map(([a, b]) => tag([...on(a), ...on(b)], `strings ${a} & ${b}`)).filter((g) => g.length); return updown(up); } },
  { id: 'g3', cat: 'seq', name: 'Groups of 3', how: 'Play three notes up the scale, then start again one note higher, all the way to the top: {ex}. Come back down the same way.',
    fits: () => true, gen: ({ P }) => updown(slide(P, [0, 1, 2])) },
  { id: 'g4', cat: 'seq', name: 'Groups of 4', how: 'Play four notes up the scale, then start again one note higher, all the way to the top: {ex}. Come back down the same way.',
    fits: () => true, gen: ({ P }) => updown(slide(P, [0, 1, 2, 3])) },
  { id: 'thirds', cat: 'seq', name: 'In 3rds', how: 'Play each note, then the note two steps above it, all the way up: {ex}. Come back down the same way.',
    fits: (id) => !isBebop(id), gen: ({ P }) => updown(slide(P, [0, 2])) },
  { id: 'thirdsAlt', cat: 'seq', name: '3rds, one up, one back', how: 'The same pairs as 3rds, but every second pair goes downwards: {ex}.',
    fits: (id) => sizeOf(id) >= 6 && !isBebop(id), gen: ({ P }) => updown(slide(P, [0, 2]).map((g, i) => (i % 2 ? [g[1], g[0]] : g))) },
  { id: 'fourths', cat: 'seq', name: 'In 4ths', how: 'Play each note, then the note three steps above it: {ex}. Up to the top, then back down.',
    fits: (id) => sizeOf(id) === 7, gen: ({ P }) => updown(slide(P, [0, 3])) },
  { id: 'sixths', cat: 'seq', name: 'In 6ths', how: 'Play each note, then the note five steps above it: {ex}. Up to the top, then back down.',
    fits: (id) => sizeOf(id) === 7, gen: ({ P }) => updown(slide(P, [0, 5])) },
  { id: 'cells', cat: 'seq', name: '1‑2‑3‑5 cells', how: 'From each note, play it and the next two notes, then skip one: {ex}. Up to the top, then back down.',
    fits: (id) => sizeOf(id) === 7, gen: ({ P }) => updown(slide(P, [0, 1, 2, 4])) },
  { id: 'pedal', cat: 'seq', name: 'Pedal on the root', how: 'Go back to the root between every note: {ex}, up to the top and back. Listen to how each note sounds against the root.',
    fits: () => true, gen: ({ P }) => { const r = rootIdx(P)[0] ?? 0; const up = P.slice(r + 1).map((n) => tag([P[r], n], null, 'up')); return up.concat([...up].reverse().slice(1).map((g) => tag([...g], null, 'down'))); } },
  { id: 'home', cat: 'arp', name: 'Arpeggio of its chord', how: 'Play only the chord tones (listed below), lowest to highest in the shape, then back down.',
    fits: () => true, gen: ({ P, chord }) => { return upThenDown(P.filter((n) => chord.includes(semi(n.iv)))); } },
  { id: 'triads', cat: 'arp', name: 'Triads on every note', how: 'Play a three-note chord from each note of the scale, one note at a time: {ex}. Up to the top, then back down.',
    fits: (id) => sizeOf(id) === 7 || id === 'whole-tone', gen: ({ P }) => updown(slide(P, [0, 2, 4])) },
  { id: 'triadsAlt', cat: 'arp', name: 'Triads, up one, down the next', how: 'The same triads, but alternate the direction: {ex}.',
    fits: (id) => sizeOf(id) === 7 || id === 'whole-tone', gen: ({ P }) => updown(slide(P, [0, 2, 4]).map((g, i) => (i % 2 ? [...g].reverse() : g))) },
  { id: 'sevenths', cat: 'arp', name: '7th arpeggios on every note', how: 'Play a four-note chord from each note of the scale, one note at a time: {ex}. Up to the top, then back down.',
    fits: (id) => sizeOf(id) === 7, gen: ({ P }) => updown(slide(P, [0, 2, 4, 6])) },
  { id: 'ext', cat: 'arp', name: 'Extended arpeggio', how: 'From the lowest root, play every other note right to the top of the shape: {ex}. Then back down.',
    fits: (id) => sizeOf(id) === 7, gen: ({ P }) => { const r = rootIdx(P)[0] ?? 0; const a = P.filter((_, i) => i >= r && (i - r) % 2 === 0); return [tag(a, null, 'up'), tag([...a].reverse().slice(1), null, 'down')]; } },
  { id: 'dimarps', cat: 'arp', name: '°7 arpeggios', how: 'From each note, play every other note, four notes in all: that is a diminished 7th chord. {ex}. Up, then back down.',
    fits: isDim, gen: ({ P }) => updown(slide(P, [0, 2, 4, 6])) },
  { id: 'dimtriads', cat: 'arp', name: 'Its four major triads', how: 'Four major triads live in this scale (listed below). Play each one as you climb the shape, then come back down.',
    fits: isDim, gen: ({ P, rel }) => {
      const pcs = new Set(P.map(rel));
      const up = [];
      P.forEach((n, i) => {
        const x = rel(n);
        if (!pcs.has((x + 4) % 12) || !pcs.has((x + 7) % 12)) return;
        const a = P.slice(i + 1).find((m) => rel(m) === (x + 4) % 12 && m.midi - n.midi === 4);
        const b = P.slice(i + 1).find((m) => rel(m) === (x + 7) % 12 && m.midi - n.midi === 7);
        if (a && b) up.push([n, a, b]);
      });
      return updown(up);
    } },
  { id: 'into', cat: 'voc', name: 'Run into chord tones', how: 'For each chord tone (listed below): play the three scale notes under it, then land on it on the beat and hold it. Go up through the shape, then do the same coming down from above.',
    fits: (id) => sizeOf(id) >= 6, gen: ({ P, chord }) => {
      const ct = (n) => chord.includes(semi(n.iv));
      const up = [], down = [];
      P.forEach((n, j) => { if (ct(n) && j >= 3) up.push(tag([null, P[j - 3], P[j - 2], P[j - 1], n, null, null, null], `into ${T.prettyIv(n.iv)}`, 'up')); });
      for (let j = P.length - 4; j >= 0; j--) if (ct(P[j])) down.push(tag([null, P[j + 3], P[j + 2], P[j + 1], P[j], null, null, null], `into ${T.prettyIv(P[j].iv)}`, 'down'));
      return up.concat(down);
    } },
  { id: 'enclose', cat: 'voc', name: 'Enclosures', how: 'For each chord tone (listed below): play the scale note just above it, then the note a half step below it, then the chord tone itself, on the beat.',
    fits: (id) => sizeOf(id) >= 7, gen: ({ P, chord, pc }) => {
      const out = [];
      P.forEach((n, j) => {
        if (!chord.includes(semi(n.iv)) || j === 0 || j === P.length - 1) return;
        const below = n.fret > 0 ? { string: n.string, fret: n.fret - 1, midi: n.midi - 1 } : null;
        if (!below) return;
        below.iv = null; below.chrom = CHROM[((below.midi - pc) % 12 + 12) % 12];
        out.push(tag([P[j + 1], below, n, null], `around ${T.prettyIv(n.iv)}`));
      });
      return out;
    } },
  { id: 'pents', cat: 'voc', name: 'Pentatonics inside it', how: 'Complete pentatonic scales are hidden inside this one (listed below). Play each of them up and down in the shape, using only its five notes.',
    fits: (id) => sizeOf(id) === 7 && hiddenPents(id).length > 0, gen: ({ P, rel, id }) => {
      const out = [];
      for (const x of hiddenPents(id)) {
        const set = [0, 2, 4, 7, 9].map((o) => (x + o) % 12);
        const a = P.filter((n) => set.includes(rel(n)));
        const g = upThenDown(a); g[0].label = `minor pent. from the ${CHROM[(x + 9) % 12]}`; out.push(...g, [null, null]);
      }
      return out;
    } },
  { id: 'm3cells', cat: 'voc', name: 'Cells up in minor 3rds', how: 'Play four notes up the scale, then move up two notes and play four more: {ex}. Each move is a minor 3rd. Up to the top, then back down.',
    fits: isDim, gen: ({ P }) => updown(slide(P, [0, 1, 2, 3], 2)) },
  { id: 'bebopdown', cat: 'voc', name: 'Bebop descent', how: 'Start on a chord tone, on the beat, and run straight down the scale for eight notes. Do it from every chord tone, from the top down. The extra passing note keeps the chord tones on the beats.',
    fits: isBebop, gen: ({ P, chord }) => {
      const out = [];
      for (let j = P.length - 1; j >= 0; j--) {
        if (!chord.includes(semi(P[j].iv))) continue;
        const run = []; for (let k = j; k >= 0 && run.length < 8; k--) run.push(P[k]);
        if (run.length === 8) out.push(tag(run, `from ${T.prettyIv(P[j].iv)}`, 'down'));
      }
      return out;
    } },
];
export const PR = Object.fromEntries(PRACTICES.map((p) => [p.id, p]));

// the drills for a scale: its best ones first (starred), then the rest in order
export function practicesFor(id) {
  const fit = PRACTICES.filter((p) => p.fits(id));
  const best = (TIPS[id]?.best || []).filter((b) => fit.some((p) => p.id === b));
  return [...best.map((b) => PR[b]), ...fit.filter((p) => !best.includes(p.id))];
}
export const isBest = (id, pid) => (TIPS[id]?.best || []).includes(pid);

// a pattern over an area: { groups, info }
export function pattern(pid, id, pc, area, seed = 0.5) {
  const P = area.path, rel = (n) => ((n.midi - pc) % 12 + 12) % 12;
  const chord = chordOf(id).map(semi);
  const groups = (PR[pid] || PR.updown).gen({ P, notes: area.notes, chord, rel, pc, id, seed }).filter((g) => g.some(Boolean));
  let info = '';
  if (pid === 'home') info = `Chord tones: ${chordOf(id).map(T.prettyIv).join(' ')}`;
  if (pid === 'pents') info = hiddenPents(id).map((x) => `minor pentatonic from the ${CHROM[(x + 9) % 12]} (= major from the ${CHROM[x]})`).join('; ');
  return { groups, info };
}
// a short example in this scale's degrees, counted up from the root (the {ex} in a description)
export function example(pid, id) {
  const ivs = ivsOf(id), P = [];
  for (let o = 0; o < 3; o++) for (const iv of ivs) P.push({ iv, midi: 60 + semi(iv) + 12 * o, string: 1, fret: 0 });
  const lab = (n) => { if (n.midi < 72) return T.prettyIv(n.iv); const d = Number(n.iv.replace(/[^0-9]/g, '')); return T.prettyIv(d >= 8 ? n.iv : n.iv.replace(/[0-9]+/, String(d + 7))); };
  const groups = PR[pid].gen({ P, notes: [], chord: chordOf(id).map(semi), rel: (n) => semi(n.iv), pc: 0, id, seed: 0 });
  if (pid === 'ext') return groups[0].slice(0, 7).map(lab).join(' ');
  return groups.slice(0, 3).map((g) => g.filter(Boolean).map(lab).join(' ')).join(', ') + ', and so on';
}
export const describe = (pid, id) => PR[pid].how.replace('{ex}', () => example(pid, id));
// the degrees of the first few groups, as text
export function preview(groups, n = 4) {
  const lab = (x) => (x ? (x.chrom ? `(${x.chrom})` : T.prettyIv(x.iv)) : '–');
  return groups.slice(0, n).map((g) => g.map(lab).join(' ').replace(/^– | –( –)*$/g, '')).join(' · ') + (groups.length > n ? ' …' : '');
}

// game mode's extra twists: a constraint on how to play the drill
export const TWISTS = [
  'Say each degree out loud as you play it.',
  'Play it in triplets.',
  'Play it in 16ths, then half time.',
  'Start from the top: descend first.',
  'Legato: pick only the first note on each string.',
  'Accent every third note.',
  'Don’t look at the neck.',
  'Play it twice: once loud, once as quietly as you can.',
  'Swing the 8ths.',
  'Leave a beat of rest after every group.',
  'Sing each note before you play it.',
  'Economy picking: sweep across each string change.',
];
