// Kinds of practice. Each one turns the area's playing path (the scale low to high in that position) into groups of
// notes: the pattern you play, shown as degrees and played by the guide. A null in a group is a rest (a held note).
// fits() says which scales it suits: 3rds and diatonic 7ths need a seven-note scale, cells in minor 3rds belong to
// the diminished scales, and so on.
import * as T from '../theory.js';
import * as F from '../fretboard.js';
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
  { id: 'updown', cat: 'runs', name: 'Up and down', how: 'Start on the lowest note in the shape and play every note up to the highest one. Then turn round and play them all back down to the lowest note.', why: 'It teaches you the shape and the sound of the scale. Every other drill builds on it.',
    fits: () => true, gen: ({ P }) => upThenDown(P) },
  { id: 'rootroot', cat: 'runs', name: 'Root to root', how: 'Find the lowest root in the shape (a ringed dot). Play up the scale until you reach the highest root, then come back down to the lowest root. Leave out any notes below the first root or above the last.', why: 'You hear the scale come home at each end, so it sounds like a key and not just a pattern.',
    fits: () => true, gen: ({ P }) => { const r = rootIdx(P); if (r.length < 2) return upThenDown(P); return upThenDown(P.slice(r[0], r[r.length - 1] + 1)); } },
  { id: 'anywhere', cat: 'runs', name: 'Start anywhere', how: 'Begin on the start note shown below, not on the root. Play up to the highest note in the shape, then all the way down to the lowest note, then up again until you’re back on the start note.', why: 'It stops you relying on the root to find your place. Real lines start anywhere.',
    fits: () => true, gen: ({ P, seed }) => { const s = Math.floor(seed * (P.length - 2)) + 1; return [...chunk(P.slice(s), 8, 'up'), ...chunk([...P].reverse().slice(1), 8, 'down'), ...chunk(P.slice(1, s + 1), 8, 'up')]; } },
  { id: 'skip', cat: 'runs', name: 'String skipping', how: 'Pair up strings that have one string between them. Play all the shape’s notes on the low E string, low to high, then all its notes on the D string, skipping the A string. Then do the A and G strings, then D and B, then G and high E. Come back down through the same pairs.', why: 'The jumps stop the scale sounding like a scale, and train your picking hand to cross strings cleanly.',
    fits: () => true, gen: ({ notes }) => { const on = (s) => notes.filter((n) => n.string === s).sort((a, b) => a.fret - b.fret); const up = [[6, 4], [5, 3], [4, 2], [3, 1]].map(([a, b]) => tag([...on(a), ...on(b)], `strings ${a} & ${b}`)).filter((g) => g.length); return updown(up); } },
  { id: 'g3', cat: 'seq', name: 'Groups of 3', how: 'Play three notes going up the scale. Then start again from the second of those notes and play three more. Keep moving the start up one note at a time until you reach the top of the shape. Coming down, do the mirror image: three notes down, start one note lower, three more.', why: 'It’s the classic sequence: it breaks up the straight run and builds control. In 8ths the groups cross the beat, which is good timing practice too.',
    fits: () => true, gen: ({ P }) => updown(slide(P, [0, 1, 2])) },
  { id: 'g4', cat: 'seq', name: 'Groups of 4', how: 'Play four notes going up the scale. Then start again from the second of those notes and play four more. Keep moving the start up one note at a time until you reach the top of the shape. Coming down, do the mirror image: four notes down, start one note lower, four more.', why: 'A staple of rock and fusion lines. In 16ths each group fills one beat.',
    fits: () => true, gen: ({ P }) => updown(slide(P, [0, 1, 2, 3])) },
  { id: 'thirds', cat: 'seq', name: 'In 3rds', how: 'Play a note, skip the next note of the scale, and play the one after it: that pair is a 3rd. Then move up one note and play the next pair. Carry on to the top of the shape, then come back down with each pair going downwards.', why: '3rds are what chords and most melodies are made of. This is the single most useful scale sequence.',
    fits: (id) => !isBebop(id), gen: ({ P }) => updown(slide(P, [0, 2])) },
  { id: 'thirdsAlt', cat: 'seq', name: '3rds, one up, one back', how: 'Play the scale in 3rds (a note, then the note two steps above it), but turn every second pair round so it goes down instead of up. The line zigzags: up a 3rd, down a 3rd, up a 3rd, down a 3rd, while it climbs one note at a time. Go to the top of the shape, then come back down the same way.', why: 'It sounds like a melody rather than an exercise, and trains you to change direction smoothly.',
    fits: (id) => sizeOf(id) >= 6 && !isBebop(id), gen: ({ P }) => updown(slide(P, [0, 2]).map((g, i) => (i % 2 ? [g[1], g[0]] : g))) },
  { id: 'fourths', cat: 'seq', name: 'In 4ths', how: 'Play a note, then the note three scale steps above it (skip two notes). Move up one note and play the next pair. Carry on to the top of the shape, then come back down with the pairs going downwards. Many 4ths are on the same fret on neighbouring strings: roll one finger across them.', why: '4ths give an open, modern sound (jazz, fusion), and train the finger roll.',
    fits: (id) => sizeOf(id) === 7, gen: ({ P }) => updown(slide(P, [0, 3])) },
  { id: 'sixths', cat: 'seq', name: 'In 6ths', how: 'Play a note, then the note five scale steps above it, usually a string or two over. Move up one note and play the next pair. Carry on to the top of the shape, then come back down with the pairs going downwards.', why: 'Wide, singing intervals: great for melodies, and for string-skipping technique.',
    fits: (id) => sizeOf(id) === 7, gen: ({ P }) => updown(slide(P, [0, 5])) },
  { id: 'cells', cat: 'seq', name: '1‑2‑3‑5 cells', how: 'From each note, play four notes: that note, the next two notes up, then jump over one note and play the next (steps 1, 2, 3 and 5 counted from where you started). Then play the same cell starting one note higher. Go to the top of the shape, then play the cells downwards.', why: 'John Coltrane’s building block. It sounds melodic over almost any chord.',
    fits: (id) => sizeOf(id) === 7, gen: ({ P }) => updown(slide(P, [0, 1, 2, 4])) },
  { id: 'pedal', cat: 'seq', name: 'Pedal on the root', how: 'Keep coming back to the root. Play the root, then the next note up, then the root, then the note after that, and so on until you reach the top of the shape. Then come back down the same way.', why: 'Every note is heard against the root, so you hear exactly what each degree sounds like. It’s the quickest way to hear a mode’s character. Try it with the drone on.',
    fits: () => true, gen: ({ P }) => { const r = rootIdx(P)[0] ?? 0; const up = P.slice(r + 1).map((n) => tag([P[r], n], null, 'up')); return up.concat([...up].reverse().slice(1).map((g) => tag([...g], null, 'down'))); } },
  { id: 'home', cat: 'arp', name: 'Arpeggio of its chord', how: 'Play only the notes of the scale’s own chord (listed below) and leave the other notes out. Go from the lowest chord tone in the shape to the highest, then back down.', why: 'These are the strongest, safest notes over the chord: the ones to land on when you improvise.',
    fits: () => true, gen: ({ P, chord }) => { return upThenDown(P.filter((n) => chord.includes(semi(n.iv)))); } },
  { id: 'inv', cat: 'arp', name: 'Its chord from every chord tone', how: 'Play the scale’s chord as an arpeggio (chord tones listed below), starting from each chord tone in turn. First from the root up to the next root and back down. Then from the 3rd up to the next 3rd and back, then from the 5th, then from the 7th. Use the lowest one of each in the shape.',
    why: 'Real lines rarely start on the root. Each starting note gives a different shape (the chord’s inversions), and the 3rd and 7th matter most: they are the notes that define the chord.',
    fits: () => true, gen: ({ P, chord }) => {
      const A = P.filter((n) => chord.includes(semi(n.iv))), k = new Set(A.map((n) => semi(n.iv))).size, out = [];
      for (const c of chord) {
        const i = A.findIndex((n) => semi(n.iv) === c);
        if (i < 0 || A.length - i < k) continue; // room for the inversion; the octave on top if the shape has it
        const up = A.slice(i, i + k + 1);
        out.push(tag(up, `from the ${T.prettyIv(A[i].iv)}`, 'up'), tag([...up].reverse().slice(1), null, 'down'));
      }
      return out;
    } },
  { id: 'triads', cat: 'arp', name: 'Triads on every note', how: 'Build a three-note chord on each note of the scale and play it one note at a time: the note, the note two steps above it, and the note two steps above that. Then do the same from the next note of the scale. Go to the top of the shape, then play the triads downwards.', why: 'It shows you every chord inside the scale, and joins scales to arpeggios.',
    fits: (id) => sizeOf(id) === 7 || id === 'whole-tone', gen: ({ P }) => updown(slide(P, [0, 2, 4])) },
  { id: 'triadsAlt', cat: 'arp', name: 'Triads, up one, down the next', how: 'The same triads, built on each note of the scale, but every second one is played downwards: the first triad from the bottom up, the next from its top note down, the next up again, and so on to the top of the shape and back.', why: 'The line keeps turning, so it sounds musical, and you practise changing direction.',
    fits: (id) => sizeOf(id) === 7 || id === 'whole-tone', gen: ({ P }) => updown(slide(P, [0, 2, 4]).map((g, i) => (i % 2 ? [...g].reverse() : g))) },
  { id: 'sevenths', cat: 'arp', name: '7th arpeggios on every note', how: 'Build a four-note chord on each note of the scale (every other note, four of them) and play it as an arpeggio. Then do the same from the next note of the scale. Go to the top of the shape, then play them downwards.', why: 'These are the 7th chords the scale contains. It’s the essential jazz drill.',
    fits: (id) => sizeOf(id) === 7, gen: ({ P }) => updown(slide(P, [0, 2, 4, 6])) },
  { id: 'ext', cat: 'arp', name: 'Extended arpeggio', how: 'Start on the lowest root and play every other note of the scale, climbing as high as the shape goes. Then come back down the same notes.', why: 'Stacking 3rds past the octave gives the 9, 11 and 13, so you hear the whole chord the scale implies.',
    fits: (id) => sizeOf(id) === 7, gen: ({ P }) => { const r = rootIdx(P)[0] ?? 0; const a = P.filter((_, i) => i >= r && (i - r) % 2 === 0); return [tag(a, null, 'up'), tag([...a].reverse().slice(1), null, 'down')]; } },
  { id: 'dimarps', cat: 'arp', name: '°7 arpeggios', how: 'In a diminished scale, every other note makes a diminished 7th chord. From each note, play every other note, four notes in all. Then do the same from the next note up. Go to the top of the shape, then come back down.', why: 'The diminished scale is two diminished 7th chords interlocked. This shows you both.',
    fits: isDim, gen: ({ P }) => updown(slide(P, [0, 2, 4, 6])) },
  { id: 'dimtriads', cat: 'arp', name: 'Its four major triads', how: 'Four major triads sit inside this scale, a minor 3rd apart (listed below). As you climb the shape, play each one as an arpeggio (root, 3rd, 5th) whenever you reach its root. Then come back down.', why: 'Major triads are how players make the diminished scale sound like a melody rather than an exercise.',
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
  { id: 'into', cat: 'voc', name: 'Run into chord tones', how: 'Take each chord tone in turn (listed below). Play the three scale notes just under it, then land on the chord tone on the beat and let it ring. Do this for every chord tone going up the shape, then again coming down, approaching each one from the three notes above it.', why: 'It teaches you to aim lines at chord tones so they land on strong beats: the core of soloing over changes.',
    fits: (id) => sizeOf(id) >= 6, gen: ({ P, chord }) => {
      const ct = (n) => chord.includes(semi(n.iv));
      const up = [], down = [];
      P.forEach((n, j) => { if (ct(n) && j >= 3) up.push(tag([null, P[j - 3], P[j - 2], P[j - 1], n, null, null, null], `into ${T.prettyIv(n.iv)}`, 'up')); });
      for (let j = P.length - 4; j >= 0; j--) if (ct(P[j])) down.push(tag([null, P[j + 3], P[j + 2], P[j + 1], P[j], null, null, null], `into ${T.prettyIv(P[j].iv)}`, 'down'));
      return up.concat(down);
    } },
  { id: 'enclose', cat: 'voc', name: 'Enclosures', how: 'For each chord tone (listed below): play the scale note just above it, then the note one fret below it (even if that note is outside the scale), then the chord tone itself. Above, below, land. In 8ths the chord tone falls on the beat.', why: 'It’s the bebop way of targeting a note: surrounding it makes the arrival sound deliberate.',
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
  { id: 'pents', cat: 'voc', name: 'Pentatonics inside it', how: 'This scale contains complete pentatonic scales (listed below). Take the first one and play only its five notes up and down in the shape. Then do the same with the next one.', why: 'Pentatonic shapes are easy and melodic. Finding them inside a mode gives you instant vocabulary for it.',
    fits: (id) => sizeOf(id) === 7 && hiddenPents(id).length > 0, gen: ({ P, rel, id }) => {
      const out = [];
      for (const x of hiddenPents(id)) {
        const set = [0, 2, 4, 7, 9].map((o) => (x + o) % 12);
        const a = P.filter((n) => set.includes(rel(n)));
        const g = upThenDown(a); g[0].label = `minor pent. from the ${CHROM[(x + 9) % 12]}`; out.push(...g, [null, null]);
      }
      return out;
    } },
  { id: 'm3cells', cat: 'voc', name: 'Cells up in minor 3rds', how: 'Play four notes straight up the scale. Then move up two scale notes (a minor 3rd) and play the same four-note shape again. Keep moving up a minor 3rd to the top of the shape, then come back down the same way.', why: 'The diminished scale repeats every minor 3rd, so one small shape moved up and down covers all of it.',
    fits: isDim, gen: ({ P }) => updown(slide(P, [0, 1, 2, 3], 2)) },
  { id: 'bebopdown', cat: 'voc', name: 'Bebop descent', how: 'Start on a chord tone, on the beat, and play eight notes straight down the scale in 8ths. Do this from each chord tone, starting from the highest one in the shape and working down.', why: 'The extra passing note makes the chord tones land on the beats as you come down: the sound of bebop lines.',
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
// a short example: the first groups of the drill played up from the root, as [{ lab, semis }] (null for a group gap).
// Above the octave, 2 4 6 read 9 11 13 and the root reads 8.
const EXN = { inv: [4, 5], updown: [1, 9], rootroot: [1, 9], home: [1, 5], ext: [1, 7], bebopdown: [1, 8], pents: [1, 6], into: [2, 8], enclose: [3, 4], dimtriads: [2, 3] };
export function example(pid, id) {
  if (pid === 'skip' || pid === 'anywhere') return null;
  const ivs = ivsOf(id), P = [];
  for (let o = 0; o < 3; o++) for (const iv of ivs) P.push({ iv, midi: 60 + semi(iv) + 12 * o, string: 1, fret: 5 });
  const lab = (n) => {
    if (n.chrom) return n.chrom;
    if (n.midi < 72) return T.prettyIv(n.iv);
    const d = Number(n.iv.replace(/[^0-9]/g, ''));
    if (d >= 8) return T.prettyIv(n.iv);
    return T.prettyIv([1, 2, 4, 6].includes(d) ? n.iv.replace(/[0-9]+/, String(d + 7)) : n.iv);
  };
  let groups = PR[pid].gen({ P, notes: [], chord: chordOf(id).map(semi), rel: (n) => semi(n.iv), pc: 0, id, seed: 0 }).filter((g) => g.some(Boolean));
  // the bebop descent from the root an octave up, named plainly (8 7 ♭7 6 …)
  if (pid === 'bebopdown') return [groups.find((g) => g[0].midi === 72).map((n) => ({ lab: n.midi === 72 ? '8' : T.prettyIv(F.simpleIv(n.iv)), semis: (n.midi - 60) % 12, iv: n.iv }))];
  const [ng, nn] = EXN[pid] || [3, 8];
  return groups.slice(0, ng).map((g) => g.filter(Boolean).slice(0, nn).map((n) => ({ lab: lab(n), semis: (((n.midi - 60) % 12) + 12) % 12, iv: n.chrom ? n.chrom.replace('♭', 'b').replace('♯', '#') : n.iv })));
}
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
