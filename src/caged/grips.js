// CAGED grips for any chord quality. Each shape starts from its open-chord template (the E, A, C, G or D chord) and
// is bent into the quality the way guitarists do it: the 3rd drops to ♭3, a doubled root falls to ♭7, the 5th moves
// to ♭5 or ♯5, a spare string takes the 9 or 13. A small search scores every way to bend the template (stay close to
// it, keep the root in the bass on the anchor string, cover the chord's essential tones, no more than four fingers or
// a four-fret span, no half-step clashes) and keeps the best. Grips are cached per shape and quality, then placed on
// the neck at any root.
import * as T from '../theory.js';
import * as F from '../fretboard.js';

export const SHAPES = ['C', 'A', 'G', 'E', 'D'];
const OPEN = F.OPEN; // string -> midi, 1 = high E
const MAX = 17;

// open-chord templates: fret offsets from the root on the anchor string, strings 6..1 (null = not played);
// win = the frets the shape lives in, relative to that root
const SHAPE = {
  E: { anchor: 6, win: [-1, 3], tpl: [0, 2, 2, 1, 0, 0] },
  A: { anchor: 5, win: [-1, 3], tpl: [null, 0, 2, 2, 2, 0] },
  C: { anchor: 5, win: [-3, 1], tpl: [null, 0, -1, -3, -2, -3] },
  G: { anchor: 6, win: [-3, 1], tpl: [0, -1, -3, -3, -3, 0] },
  D: { anchor: 4, win: [-1, 3], tpl: [null, null, 0, 2, 3, 2] },
};
export const anchorOf = (shape) => SHAPE[shape].anchor;

const semisOf = (iv) => T.intervalSemis(F.simpleIv(iv)) % 12;

// which chord tones a grip must have; the rest are welcome but optional
export function needs(q) {
  const ivs = T.getChord(q).ivs;
  const opt = new Set(['5']);
  if (/13/.test(q) || q === '11' || q === 'm11' || q === '7#11') opt.add('9');
  if (q === 'maj9#11') opt.add('5');
  if (q === '7alt') return { ivs, req: ['1', '3', 'b7'], opt: ['b9', '#9', '#11', 'b13'], alt: 2 };
  if (q === '6/9' || q === 'm6/9') opt.add('5');
  return { ivs, req: ivs.filter((iv) => !opt.has(iv)), opt: ivs.filter((iv) => opt.has(iv)), alt: 0 };
}

// fingers a grip needs (fretted notes only; one barre across the lowest fret if nothing muted sits under it)
function fingersFor(notes) {
  const fr = notes.filter((n) => n.fret > 0);
  if (!fr.length) return 0;
  const m = Math.min(...fr.map((n) => n.fret));
  const atMin = fr.filter((n) => n.fret === m);
  let best = fr.length;
  if (atMin.length >= 2) {
    const ss = atMin.map((n) => n.string);
    const lo = Math.min(...ss), hi = Math.max(...ss);
    const played = new Map(notes.map((n) => [n.string, n.fret]));
    let ok = true;
    for (let s = lo; s <= hi; s++) { const f = played.get(s); if (f === undefined || f === 0 || f < m) ok = false; }
    if (ok) best = Math.min(best, 1 + fr.filter((n) => n.fret > m).length);
  }
  return best;
}

// finger numbers: a barre (or the lowest note) takes 1, the rest go up in fret order, low strings first
export function assignFingers(notes) {
  const fr = notes.filter((n) => n.fret > 0);
  if (!fr.length) return notes.map((n) => ({ ...n, finger: 0 }));
  const m = Math.min(...fr.map((n) => n.fret));
  const atMin = fr.filter((n) => n.fret === m);
  // barre only when four fingers can't cover it note by note
  const barre = fr.length > 4 && atMin.length >= 2 && fingersFor(notes) === 1 + fr.filter((n) => n.fret > m).length;
  const out = new Map();
  let next = 1, base = m;
  if (barre) { atMin.forEach((n) => out.set(n.string, 1)); next = 2; }
  const rest = fr.filter((n) => !(barre && n.fret === m)).sort((a, b) => a.fret - b.fret || b.string - a.string);
  rest.forEach((n, i) => {
    // one finger per fret step, but leave enough fingers for the notes still to come
    const f = Math.min(4, Math.max(next, Math.min(1 + (n.fret - base), 4 - (rest.length - i - 1))));
    out.set(n.string, f);
    next = f + 1;
  });
  return notes.map((n) => ({ ...n, finger: n.fret > 0 ? out.get(n.string) || 0 : 0 }));
}

// a fingering is real if no finger has to hold two different frets
// and a finger laid across strings only crosses strings fretted at or above it
function fingeringOk(notes) {
  const by = new Map();
  const fretOf = new Map(notes.map((n) => [n.string, n.fret]));
  for (const n of assignFingers(notes)) {
    if (!n.finger) continue;
    const b = by.get(n.finger);
    if (b && b.fret !== n.fret) return false;
    by.set(n.finger, b ? { fret: b.fret, lo: Math.min(b.lo, n.string), hi: Math.max(b.hi, n.string) } : { fret: n.fret, lo: n.string, hi: n.string });
  }
  for (const b of by.values()) for (let s = b.lo + 1; s < b.hi; s++) { const f = fretOf.get(s); if (f === undefined || f < b.fret) return false; }
  return true;
}

// ---------- the search, in root-relative space (root fret = 12, so nothing is an open string) ----------
const cache = new Map();
export function gripShape(q, shape) {
  const key = `${shape}:${q}`;
  if (cache.has(key)) return cache.get(key);
  const sh = SHAPE[shape];
  const R = 12;
  const rootMidi = OPEN[sh.anchor] + R;
  const nd = needs(q);
  const label = new Map(); // semis -> interval label
  for (const iv of nd.ivs) if (!label.has(semisOf(iv))) label.set(semisOf(iv), iv);
  const reqS = nd.req.map(semisOf), optS = nd.opt.map(semisOf);
  const hasB9 = nd.ivs.includes('b9') || q === '7alt';
  const strings = [6, 5, 4, 3, 2, 1].filter((s) => s < sh.anchor);
  const opts = strings.map((s) => {
    const o = [null];
    for (let d = sh.win[0] - 1; d <= sh.win[1]; d++) {
      const midi = OPEN[s] + R + d;
      if (label.has(((midi - rootMidi) % 12 + 12) % 12)) o.push(d);
    }
    return o;
  });
  const tplAt = (s) => sh.tpl[6 - s];
  let best = null, bestCost = Infinity;
  const pick = new Array(strings.length);
  const walk = (i) => {
    if (i < strings.length) { for (const o of opts[i]) { pick[i] = o; walk(i + 1); } return; }
    const notes = [{ string: sh.anchor, off: 0 }];
    strings.forEach((s, j) => { if (pick[j] !== null) notes.push({ string: s, off: pick[j] }); });
    if (notes.length < 3) return;
    const midis = notes.map((n) => OPEN[n.string] + R + n.off);
    const rel = midis.map((m) => (m - rootMidi) % 12);
    const have = new Set(rel);
    if (!reqS.every((x) => have.has(x))) return;
    if (nd.alt && optS.filter((x) => have.has(x)).length < nd.alt) return;
    const offs = notes.map((n) => n.off);
    const span = Math.max(...offs) - Math.min(...offs);
    if (span > 3) return; // four frets, one finger each
    const placed = notes.map((n) => ({ string: n.string, fret: R + n.off }));
    const fingers = fingersFor(placed);
    if (fingers > 4 || !fingeringOk(placed)) return;
    let cost = 0;
    strings.forEach((s, j) => {
      const t = tplAt(s), o = pick[j];
      if (o === null && t !== null) cost += 1.2;
      else if (o !== null && t === null) cost += 0.8;
      else if (o !== null) cost += Math.abs(o - t) * 0.7;
    });
    // a gap between played strings has to be muted by a finger
    const played = notes.map((n) => n.string);
    const top = Math.min(...played);
    for (let s = sh.anchor - 1; s > top; s--) if (!played.includes(s)) cost += 0.9;
    cost -= 0.35 * notes.length;
    cost -= 0.5 * optS.filter((x) => have.has(x)).length;
    cost += 1.1 * offs.filter((o) => o < sh.win[0]).length; // reached a fret below the shape's home
    if (fingers === 4) cost += 0.3;
    // clashes: a half step between any two voices, or a minor 9th that isn't the chord's own ♭9 over the root
    const sorted = [...midis].sort((a, b) => a - b);
    for (let a = 0; a < sorted.length; a++) for (let b = a + 1; b < sorted.length; b++) {
      const d = sorted[b] - sorted[a];
      if (d === 1) cost += 4;
      if (d === 13 && !(hasB9 && (sorted[a] - rootMidi) % 12 === 0)) cost += 2.5;
    }
    // too many doubled notes in a colour chord thins out the colour
    if (sorted.length - have.size > 2) cost += 0.6 * (sorted.length - have.size - 2);
    if (cost < bestCost) {
      bestCost = cost;
      best = { shape, q, cost, notes: notes.map((n) => ({ string: n.string, off: n.off, iv: label.get(((OPEN[n.string] + R + n.off - rootMidi) % 12 + 12) % 12) })) };
    }
  };
  walk(0);
  cache.set(key, best);
  return best;
}

// ---------- placing a grip on the neck ----------
function rootFret(root, shape) {
  const a = SHAPE[shape].anchor;
  return ((T.notePc(root) - OPEN[a]) % 12 + 12) % 12;
}
function realise(g, root, r) {
  const notes = g.notes.map((n) => {
    const fret = r + n.off;
    return { string: n.string, fret, midi: OPEN[n.string] + fret, iv: n.iv, note: T.transpose(root, F.simpleIv(n.iv)) };
  });
  if (notes.some((n) => n.fret < 0 || n.fret > MAX)) return null;
  const fr = notes.map((n) => n.fret);
  const fretted = fr.filter((f) => f > 0);
  return {
    shape: g.shape, q: g.q, cost: g.cost, root, rootFret: r,
    notes: assignFingers(notes).sort((a, b) => b.string - a.string),
    lo: fretted.length ? Math.min(...fretted) : 0, hi: Math.max(...fr),
    center: fretted.length ? fretted.reduce((a, b) => a + b, 0) / fretted.length : 0,
  };
}
// every placement of a shape's grip for this root (usually two: low and an octave up)
export function placements(root, q, shape) {
  const g = gripShape(q, shape);
  if (!g) return [];
  const out = [];
  for (let r = rootFret(root, shape); r <= MAX; r += 12) { const p = realise(g, root, r); if (p) out.push(p); }
  return out;
}
// one shape everywhere: this shape's grip nearest to a fret
export function gripNear(root, q, shape, near = 5) {
  const ps = placements(root, q, shape);
  if (!ps.length) return null;
  return ps.reduce((a, b) => (Math.abs(a.center - near) <= Math.abs(b.center - near) ? a : b));
}

// the position a key's shape defines: the tonic chord's CAGED window
export function positionOf(tonic, shape) {
  const w = F.cagedWindow(tonic, shape);
  return { lo: w.lo, hi: w.hi, shape, mid: (w.lo + w.hi) / 2 };
}

// how far the hand travels between two grips: fret moves per string, a string joining or leaving counts 1.5
export function movement(a, b) {
  if (!a || !b) return 0;
  let d = 0;
  for (let s = 1; s <= 6; s++) {
    const x = a.notes.find((n) => n.string === s), y = b.notes.find((n) => n.string === s);
    if (x && y) d += Math.abs(x.fret - y.fret);
    else if (x || y) d += 1.5;
  }
  return d;
}

// stay in position: whichever shape of this chord lives inside the window (weighted towards the smallest move
// from the previous grip when voice leading matters)
export function gripInPosition(root, q, pos, prev = null, w = 0.12) {
  let best = null, bs = Infinity;
  for (const shape of SHAPES) {
    for (const p of placements(root, q, shape)) {
      const fretted = p.notes.filter((n) => n.fret > 0).map((n) => n.fret);
      const opens = p.notes.some((n) => n.fret === 0);
      let out = 0, far = false;
      for (const f of fretted) {
        const d = Math.max(0, pos.lo - f, f - pos.hi);
        if (d > 1) far = true;
        out += d;
      }
      if (far) continue;
      if (opens && pos.lo > 1) continue; // open strings only when the position sits at the nut
      const sc = out * 2.2 + Math.abs(p.center - pos.mid) * 0.35 + p.cost * 0.35 + movement(prev, p) * w;
      if (sc < bs) { bs = sc; best = { ...p, outside: out }; }
    }
  }
  return best;
}

export const gripMidis = (g) => g.notes.map((n) => n.midi).sort((a, b) => a - b);

// ---------- two neighbouring shapes as one area ----------
// CAGED runs up the neck C → A → G → E → D → C: the next shape up sits just above this one
export const nextShape = (s) => SHAPES[(SHAPES.indexOf(s) + 1) % 5];
export function positionOfPair(tonic, shape) {
  const a = F.cagedWindow(tonic, shape), s2 = nextShape(shape);
  let b = F.cagedWindow(tonic, s2);
  // put the second window just above the first (an octave up if the shape order wrapped round)
  let lo2 = b.lo, hi2 = b.hi;
  while (lo2 < a.lo) { lo2 += 12; hi2 += 12; }
  while (lo2 - 12 >= a.lo) { lo2 -= 12; hi2 -= 12; }
  if (hi2 > MAX) { // no room above: use the pair's lower octave instead
    const lo1 = a.lo - 12;
    if (lo1 >= 0) return { lo: Math.max(0, lo1), hi: hi2 - 12, shape: `${shape}+${s2}`, shapes: [shape, s2], mid: (lo1 + hi2 - 12) / 2 };
  }
  return { lo: a.lo, hi: Math.min(MAX, hi2), shape: `${shape}+${s2}`, shapes: [shape, s2], mid: (a.lo + Math.min(MAX, hi2)) / 2 };
}

// ---------- every version of a chord inside an area ----------
// the CAGED grips that fit, then triads (close and spread) or drop 2 / drop 3 voicings on every string set,
// each inversion; duplicates removed. Each comes with a short label.
const INV = ['root pos.', '1st inv.', '2nd inv.', '3rd inv.'];
function fits(notes, pos) {
  let out = 0;
  for (const n of notes) {
    if (n.fret === 0) { if (pos.lo > 1) return false; continue; }
    const d = Math.max(0, pos.lo - n.fret, n.fret - pos.hi);
    if (d > 1) return false;
    out += d;
  }
  return out <= 1;
}
export function versionsIn(root, q, pos) {
  const out = [], seen = new Set();
  const add = (notes, label, kind) => {
    const sig = notes.map((n) => `${n.string}:${n.fret}`).sort().join(',');
    if (seen.has(sig)) return;
    seen.add(sig);
    const placed = assignFingers(notes.map((n) => ({ ...n }))).sort((a, b) => b.string - a.string);
    const fr = placed.filter((n) => n.fret > 0).map((n) => n.fret);
    out.push({ notes: placed, label, kind, lo: fr.length ? Math.min(...fr) : 0, hi: Math.max(...placed.map((n) => n.fret)), center: fr.length ? fr.reduce((a, b) => a + b, 0) / fr.length : 0 });
  };
  for (const shape of SHAPES) for (const p of placements(root, q, shape)) if (fits(p.notes, pos)) add(p.notes, `${shape} shape`, 'caged');
  const n = Math.min(4, T.getChord(q).ivs.length);
  const kinds = n === 3 ? [['close', 'triad'], ['spread', 'open triad']] : [['drop2', 'drop 2'], ['drop3', 'drop 3']];
  for (const [voicing, kind] of kinds) {
    let list = [];
    try { list = F.chordVoicings({ root, quality: q, voicing, stringSet: 'auto', stringSetAll: true, inversion: 'all' }); } catch (e) { /* none */ }
    for (const v of list) {
      if (!fits(v.notes, pos)) continue;
      const strings = v.stringSet.slice().sort((a, b) => b - a).join('');
      add(v.notes, `${kind} · ${INV[v.inversion] || `${v.bassIv} bass`} · ${strings}`, kind);
    }
  }
  return out;
}

// ---------- voicing sets: one family of voicings, voice-led ----------
// fam: tri (close triads), spread (open triads), shell (1-3-7 / 1-7-3), d2, d3, d24 (drop 2, 3, 2&4), each over
// one or more string sets; 'any' = every version in the area; 'open' = as many open strings as possible
const SPREAD_SETS = [[6, 4, 3], [5, 3, 2], [4, 2, 1], [6, 5, 3], [5, 4, 2], [6, 4, 2], [5, 3, 1]];
export const VOICINGS = [
  { id: 'caged', name: 'CAGED grips', group: 'Grips', blurb: 'One grip per chord, in whichever CAGED shape of it lives in the area.' },
  { id: 'any', name: 'Any voicing, voice-led', group: 'Grips', blurb: 'From every grip, triad and drop voicing in the area, the one closest to the last chord.' },
  { id: 'open', name: 'Open strings: as many as possible', group: 'Grips', blurb: 'For every chord, the playable voicing anywhere on the neck with the most open strings ringing; ties go to the smallest move. Keys with no open strings to offer fall back to the CAGED grip.' },
  { id: 'tri:321', name: 'Triads · strings 3-2-1', group: 'Triads', fam: 'tri', sets: [[3, 2, 1]] },
  { id: 'tri:432', name: 'Triads · strings 4-3-2', group: 'Triads', fam: 'tri', sets: [[4, 3, 2]] },
  { id: 'tri:543', name: 'Triads · strings 5-4-3', group: 'Triads', fam: 'tri', sets: [[5, 4, 3]] },
  { id: 'tri:654', name: 'Triads · strings 6-5-4', group: 'Triads', fam: 'tri', sets: [[6, 5, 4]] },
  { id: 'tri:adj', name: 'Triads · any adjacent strings', group: 'Triads', fam: 'tri', sets: [[3, 2, 1], [4, 3, 2], [5, 4, 3], [6, 5, 4]] },
  { id: 'tri:every', name: 'Triads · close and spread, any strings', group: 'Triads', mix: ['tri:adj', 'spread'] },
  { id: 'spread', name: 'Spread triads · any string set', group: 'Triads', fam: 'spread', sets: SPREAD_SETS },
  { id: 'shell:6', name: 'Shells · root on the 6th string', group: 'Shells', fam: 'shell', sets: [[6, 5, 4], [6, 4, 3]] },
  { id: 'shell:5', name: 'Shells · root on the 5th string', group: 'Shells', fam: 'shell', sets: [[5, 4, 3], [5, 3, 2]] },
  { id: 'shell:any', name: 'Shells · root on either', group: 'Shells', fam: 'shell', sets: [[6, 5, 4], [6, 4, 3], [5, 4, 3], [5, 3, 2]] },
  { id: 'd2:4321', name: 'Drop 2 · strings 4-3-2-1', group: 'Drop voicings', fam: 'd2', sets: [[4, 3, 2, 1]] },
  { id: 'd2:5432', name: 'Drop 2 · strings 5-4-3-2', group: 'Drop voicings', fam: 'd2', sets: [[5, 4, 3, 2]] },
  { id: 'd2:6543', name: 'Drop 2 · strings 6-5-4-3', group: 'Drop voicings', fam: 'd2', sets: [[6, 5, 4, 3]] },
  { id: 'd2:all', name: 'Drop 2 · any string set', group: 'Drop voicings', fam: 'd2', sets: [[4, 3, 2, 1], [5, 4, 3, 2], [6, 5, 4, 3]] },
  { id: 'd3:6432', name: 'Drop 3 · strings 6-4-3-2', group: 'Drop voicings', fam: 'd3', sets: [[6, 4, 3, 2]] },
  { id: 'd3:5321', name: 'Drop 3 · strings 5-3-2-1', group: 'Drop voicings', fam: 'd3', sets: [[5, 3, 2, 1]] },
  { id: 'd3:all', name: 'Drop 3 · either string set', group: 'Drop voicings', fam: 'd3', sets: [[6, 4, 3, 2], [5, 3, 2, 1]] },
  { id: 'd24', name: 'Drop 2&4 · wide open, 6-5-3-2 or 5-4-2-1', group: 'Drop voicings', fam: 'd24', sets: [[6, 5, 3, 2], [5, 4, 2, 1]] },
  // mixes: each chord takes whichever voicing type moves least from the last chord
  { id: 'mix:d2shell', name: 'Drop 2 + shells', group: 'Mixes (type changes for the smoothest move)', mix: ['d2:all', 'shell:any'] },
  { id: 'mix:d3shell', name: 'Drop 3 + shells', group: 'Mixes (type changes for the smoothest move)', mix: ['d3:all', 'shell:any'] },
  { id: 'mix:d2d3', name: 'Drop 2 + drop 3', group: 'Mixes (type changes for the smoothest move)', mix: ['d2:all', 'd3:all'] },
  { id: 'mix:trishell', name: 'Triads + shells', group: 'Mixes (type changes for the smoothest move)', mix: ['tri:adj', 'shell:any'] },
  { id: 'mix:four', name: 'Every four-note type: drop 2, drop 3, drop 2&4, shells', group: 'Mixes (type changes for the smoothest move)', mix: ['d2:all', 'd3:all', 'd24', 'shell:any'] },
];
export const voicingById = (id) => VOICINGS.find((v) => v.id === id) || VOICINGS[0];
const FAM = { tri: ['close', 'triad'], spread: ['spread', 'spread triad'], shell: ['shell', 'shell'], d2: ['drop2', 'drop 2'], d3: ['drop3', 'drop 3'], d24: ['drop24', 'drop 2&4'] };
function asVersion(notes, label, kind) {
  const placed = assignFingers(notes.map((n) => ({ ...n }))).sort((a, b) => b.string - a.string);
  const fr = placed.filter((n) => n.fret > 0).map((n) => n.fret);
  return { notes: placed, label, kind, lo: fr.length ? Math.min(...fr) : 0, hi: Math.max(...placed.map((n) => n.fret)), center: fr.length ? fr.reduce((a, b) => a + b, 0) / fr.length : 0, opens: placed.filter((n) => n.fret === 0).length };
}
// every voicing of this family for the chord; those inside the area first-class, the rest only as a fallback
export function familyVoicings(root, q, vid, pos) {
  const v = voicingById(vid);
  if (v.id === 'any') return { inside: versionsIn(root, q, pos), outside: [] };
  if (v.id === 'open') { const o = openVoicings(root, q); return { inside: o, outside: [] }; }
  const [voicing, kind] = FAM[v.fam];
  const all = [], seen = new Set();
  for (const set of v.sets) {
    let list = [];
    try { list = F.chordVoicings({ root, quality: q, voicing, stringSet: set, inversion: 'all' }); } catch (e) { /* none */ }
    for (const x of list) {
      if (v.fam === 'shell' && x.bassIv !== '1') continue; // a shell has the root in the bass
      const sig = x.notes.map((n) => `${n.string}:${n.fret}`).sort().join();
      if (seen.has(sig)) continue;
      seen.add(sig);
      const strings = set.join('');
      const what = v.fam === 'shell' ? x.label.split('-').map(T.prettyIv).join('–') : INV[x.inversion] || `${x.bassIv} bass`;
      all.push(asVersion(x.notes, v.sets.length > 1 ? `${what} · ${strings}` : what, kind));
    }
  }
  return { inside: all.filter((x) => fits(x.notes, pos)), outside: all.filter((x) => !fits(x.notes, pos)) };
}
// the voicing nearest the last one (or the middle of the area to start), staying inside the area when it can;
// in open-string mode, the most open strings first and the smallest move second
export function voiceLeadPick(root, q, vid, pos, prev) {
  const { inside, outside } = familyVoicings(root, q, vid, pos);
  const pool = inside.length ? inside : outside;
  if (!pool.length) return null;
  if (vid === 'open') {
    const most = Math.max(...pool.map((x) => x.opens));
    if (!most) return null; // nothing open in this key: the caller falls back to a CAGED grip
    const best = pool.filter((x) => x.opens === most);
    const sc = (x) => (prev ? movement(prev, x) : x.center) + x.cost;
    return best.reduce((a, b) => (sc(a) <= sc(b) ? a : b));
  }
  const score = (x) => (prev ? movement(prev, x) : 0) + Math.abs(x.center - pos.mid) * (prev ? 0.25 : 1) + (inside.length ? 0 : 3);
  return pool.reduce((a, b) => (score(a) <= score(b) ? a : b));
}

// ---------- open strings: every playable voicing with at least one open string ----------
// Fretted notes stay within four frets (one finger each, a barre allowed), the root is the lowest note, every
// essential chord tone is there, no two voices a half step apart, at most one muted string inside the voicing.
// Sorted by open strings, then fullness. Cached per root and quality.
const openCache = new Map();
export function openVoicings(root, q) {
  const key = `${T.notePc(root)}:${q}`;
  if (openCache.has(key)) return openCache.get(key);
  const nd = needs(q);
  const rootPc = T.notePc(root);
  const label = new Map();
  for (const iv of nd.ivs) { const s = semisOf(iv); if (!label.has(s)) label.set(s, iv); }
  const reqS = nd.req.map(semisOf), optS = nd.opt.map(semisOf);
  const relOf = (midi) => ((midi - rootPc) % 12 + 12) % 12;
  const found = new Map();
  for (let base = 1; base <= 12; base++) {
    const opts = [6, 5, 4, 3, 2, 1].map((s) => {
      const o = [null];
      if (label.has(relOf(OPEN[s]))) o.push(0);
      for (let f = base; f <= base + 3; f++) if (label.has(relOf(OPEN[s] + f))) o.push(f);
      return o;
    });
    const pick = [];
    const walk = (i) => {
      if (i < 6) { for (const o of opts[i]) { pick[i] = o; walk(i + 1); } return; }
      const notes = [];
      pick.forEach((f, j) => { if (f !== null) notes.push({ string: 6 - j, fret: f }); });
      if (notes.length < 3) return;
      const opens = notes.filter((n) => n.fret === 0).length;
      if (!opens) return;
      const midis = notes.map((n) => OPEN[n.string] + n.fret);
      if (relOf(Math.min(...midis)) !== 0) return; // root in the bass
      const have = new Set(midis.map(relOf));
      if (!reqS.every((x) => have.has(x))) return;
      if (nd.alt && optS.filter((x) => have.has(x)).length < nd.alt) return;
      const sorted = [...midis].sort((a, b) => a - b);
      for (let k = 1; k < sorted.length; k++) if (sorted[k] - sorted[k - 1] === 1) return;
      const strings = notes.map((n) => n.string);
      const hi = Math.max(...strings), lo = Math.min(...strings);
      let gaps = 0;
      for (let s2 = lo + 1; s2 < hi; s2++) if (!strings.includes(s2)) gaps++;
      if (gaps > 1) return;
      if (fingersFor(notes) > 4 || !fingeringOk(notes)) return;
      const sig = notes.map((n) => `${n.string}:${n.fret}`).join();
      if (found.has(sig)) return;
      const fr = notes.filter((n) => n.fret > 0).map((n) => n.fret);
      const cost = gaps * 1.5 + (fr.length ? Math.max(...fr) - Math.min(...fr) : 0) * 0.2 - optS.filter((x) => have.has(x)).length * 0.3 - notes.length * 0.2;
      found.set(sig, { notes, opens, cost });
    };
    walk(0);
  }
  const out = [...found.values()].map((v) => {
    const notes = v.notes.map((n) => ({ ...n, midi: OPEN[n.string] + n.fret, iv: label.get(relOf(OPEN[n.string] + n.fret)), note: T.transpose(root, F.simpleIv(label.get(relOf(OPEN[n.string] + n.fret)))) }));
    const x = asVersion(notes, `${v.opens} open string${v.opens > 1 ? 's' : ''}`, 'open');
    return { ...x, cost: v.cost };
  }).sort((a, b) => b.opens - a.opens || a.cost - b.cost);
  openCache.set(key, out);
  return out;
}

// ---------- a general grip search: any bass, any area ----------
// Every grip whose lowest note is `bassRel` semitones above the root (0 = root position; a non-chord bass for
// pedals and slash chords), with the chord's essential tones above it, fretted notes within four frets of one of
// `bases`, at most four fingers, no two voices a half step apart, at most one muted string inside.
function searchGrips(root, q, { bassRel = 0, bases, allowOpen = true, needOpen = false }) {
  const nd = needs(q);
  const rootPc = T.notePc(root);
  const label = new Map();
  for (const iv of nd.ivs) { const s2 = semisOf(iv); if (!label.has(s2)) label.set(s2, iv); }
  const bassIsTone = label.has(bassRel);
  const reqS = nd.req.map(semisOf).filter((x) => !(bassRel !== 0 && x === 0 && false)), optS = nd.opt.map(semisOf);
  const relOf = (midi) => ((midi - rootPc) % 12 + 12) % 12;
  const ok = (rel) => label.has(rel) || rel === bassRel;
  const found = new Map();
  for (const base of bases) {
    const opts = [6, 5, 4, 3, 2, 1].map((s2) => {
      const o = [null];
      if (allowOpen && ok(relOf(OPEN[s2]))) o.push(0);
      for (let f = Math.max(1, base); f <= base + 3; f++) if (f <= MAX && ok(relOf(OPEN[s2] + f))) o.push(f);
      return o;
    });
    const pick = [];
    const walk = (i) => {
      if (i < 6) { for (const o of opts[i]) { pick[i] = o; walk(i + 1); } return; }
      const notes = [];
      pick.forEach((f, j) => { if (f !== null) notes.push({ string: 6 - j, fret: f }); });
      if (notes.length < 3) return;
      const opens = notes.filter((n) => n.fret === 0).length;
      if (needOpen && !opens) return;
      const midis = notes.map((n) => OPEN[n.string] + n.fret);
      const low = Math.min(...midis);
      if (relOf(low) !== bassRel) return;
      // a non-chord bass appears only in the bass
      if (!bassIsTone && midis.filter((m) => relOf(m) === bassRel).length > 1) return;
      const have = new Set(midis.map(relOf));
      if (!reqS.every((x) => have.has(x))) return;
      if (nd.alt && optS.filter((x) => have.has(x)).length < nd.alt) return;
      const sorted = [...midis].sort((a, b) => a - b);
      for (let k = 1; k < sorted.length; k++) if (sorted[k] - sorted[k - 1] === 1) return;
      const strings = notes.map((n) => n.string);
      const hi = Math.max(...strings), lo = Math.min(...strings);
      let gaps = 0;
      for (let s2 = lo + 1; s2 < hi; s2++) if (!strings.includes(s2)) gaps++;
      if (gaps > 1) return;
      if (fingersFor(notes) > 4 || !fingeringOk(notes)) return;
      const sig = notes.map((n) => `${n.string}:${n.fret}`).join();
      if (found.has(sig)) return;
      const fr = notes.filter((n) => n.fret > 0).map((n) => n.fret);
      const cost = gaps * 1.5 + (fr.length ? Math.max(...fr) - Math.min(...fr) : 0) * 0.2 - optS.filter((x) => have.has(x)).length * 0.3 - Math.min(notes.length, 5) * 0.2;
      found.set(sig, { notes, opens, cost });
    };
    walk(0);
  }
  return [...found.values()].map((v) => {
    const notes = v.notes.map((n) => {
      const rel = relOf(OPEN[n.string] + n.fret);
      const iv = label.get(rel) || T.prettyIv(['1', 'b2', '2', 'b3', '3', '4', '#4', '5', 'b6', '6', 'b7', '7'][rel]).replace('♭', 'b').replace('♯', '#');
      return { ...n, midi: OPEN[n.string] + n.fret, iv, note: T.transposeSemis(root, rel) };
    });
    return { ...asVersion(notes, '', 'grip'), cost: v.cost, opens: v.opens };
  });
}
// grips in an area with a given bass (slash chords, inversions, pedals): best first
const bassCache = new Map();
export function bassGrips(root, q, bassRel, pos) {
  const key = `${T.notePc(root)}:${q}:${bassRel}:${pos.lo}:${pos.hi}`;
  if (bassCache.has(key)) return bassCache.get(key);
  const bases = [];
  for (let b = Math.max(1, pos.lo - 1); b <= Math.max(1, pos.hi - 2); b++) bases.push(b);
  const out = searchGrips(root, q, { bassRel, bases, allowOpen: pos.lo <= 1 })
    .filter((x) => fits(x.notes, pos))
    .map((x) => ({ ...x, label: bassRel ? `${['1', '♭2', '2', '♭3', '3', '4', '♯4', '5', '♭6', '6', '♭7', '7'][bassRel]} in the bass` : 'root in the bass' }))
    .sort((a, b) => a.cost - b.cost);
  bassCache.set(key, out);
  return out;
}
