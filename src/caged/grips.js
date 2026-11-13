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
function needs(q) {
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
