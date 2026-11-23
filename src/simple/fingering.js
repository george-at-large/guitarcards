// Simple's fingerings for the cards' examples: where a teacher would put each chord on the neck.
// Chord symbols: every playable grip of the chord anywhere on the neck (the CAGED grips, drop 2 / drop 3 / triads,
// a grip with the right bass for slash chords), then one pass picks the run of grips that costs least overall:
// each grip's own awkwardness, a little for climbing the neck, and the hand's travel from the last chord, with a big
// charge for a jump of more than a few frets. So a progression stays in one area and moves like a player would.
// Exact voicings ('=C3 B3 E4 | E4'): the notes are given, so only the strings are chosen; single notes after a chord
// go where the hand already is.
import * as T from '../theory.js';
import * as F from '../fretboard.js';
import * as G from '../caged/grips.js';

const OPEN = F.OPEN, MAX = 15, MAXX = 17; // grips stay below the 15th fret; given notes may go to the 17th
const TRIAD = new Set(['maj', 'min', 'sus2', 'sus4', '5', 'add9', 'madd9']);
// how hard a grip is to play: the stretch, muted strings inside it, a barre, too few or too many notes; open strings
// help a plain chord ring but tie a jazz chord to one key
function playCost(notes, q) {
  const fr = fretted(notes), n = notes.length;
  const span = fr.length ? Math.max(...fr) - Math.min(...fr) : 0;
  const ss = notes.map((x) => x.string), hi = Math.max(...ss), lo = Math.min(...ss);
  let gaps = 0;
  for (let s = lo + 1; s < hi; s++) if (!ss.includes(s)) gaps++;
  const fingers = notes.map((x) => x.finger).filter(Boolean);
  const barre = fingers.length !== new Set(fingers).size;
  const opens = notes.filter((x) => x.fret === 0).length;
  const plain = TRIAD.has(q);
  return 0.5 * span + 0.8 * gaps + (plain ? 0.4 * Math.max(0, 5 - n) : 0.4 * Math.abs(n - 4.5)) + (barre ? 0.35 : 0) + opens * (plain ? -0.25 : 0.6);
}
const sig = (notes) => notes.map((n) => `${n.string}:${n.fret}`).sort().join();
const fretted = (notes) => notes.filter((n) => n.fret > 0).map((n) => n.fret);
const centre = (notes) => { const f = fretted(notes); return f.length ? f.reduce((a, b) => a + b, 0) / f.length : 0; };

// fingers the way a hand does it: a full barre with 1 when the lowest fret spans strings that are all held at or
// above it; otherwise one finger per fret upward, a finger lying across neighbouring strings at the same fret only
// when there aren't enough fingers to give each its own. null when it needs more than four.
export function fingerGrip(notes) {
  const fr = notes.filter((n) => n.fret > 0);
  const out = new Map();
  if (!fr.length) return notes.map((n) => ({ ...n, finger: 0 }));
  const at = new Map(notes.map((n) => [n.string, n.fret]));
  const min = Math.min(...fr.map((n) => n.fret));
  const lows = fr.filter((n) => n.fret === min).map((n) => n.string);
  let rest = fr, next = 1;
  const lo = Math.min(...lows), hi = Math.max(...lows);
  let barre = lows.length >= 2 && hi - lo + 1 > lows.length;
  for (let s = lo; s <= hi && barre; s++) { const f = at.get(s); if (f === undefined || f < min) barre = false; }
  // runs of neighbouring strings at one fret, low frets first, low strings first
  const runsOf = (list) => {
    const byFret = new Map();
    for (const n of list) byFret.set(n.fret, [...(byFret.get(n.fret) || []), n.string]);
    const runs = [];
    for (const f of [...byFret.keys()].sort((a, b) => a - b)) {
      const ss = byFret.get(f).sort((a, b) => b - a);
      let cur = [ss[0]];
      for (let i = 1; i < ss.length; i++) { if (ss[i] === cur[cur.length - 1] - 1) cur.push(ss[i]); else { runs.push({ f, ss: cur }); cur = [ss[i]]; } }
      runs.push({ f, ss: cur });
    }
    return runs;
  };
  if (barre) { lows.forEach((s) => out.set(s, 1)); rest = fr.filter((n) => n.fret !== min); next = 2; }
  let runs = runsOf(rest);
  // split shared runs while fingers are spare
  let spare = 5 - next - runs.length;
  runs = runs.flatMap((r) => { if (r.ss.length > 1 && spare >= r.ss.length - 1) { spare -= r.ss.length - 1; return r.ss.map((x) => ({ f: r.f, ss: [x] })); } return [r]; });
  if (runs.length > 5 - next) return null;
  const base = barre ? min : Math.min(...rest.map((n) => n.fret));
  runs.forEach((r, i) => {
    const want = (barre ? 2 : 1) + (r.f - base) - (barre ? 1 : 0);
    const f = Math.min(Math.max(next, want), 4 - (runs.length - i - 1));
    r.ss.forEach((x) => out.set(x, f));
    next = f + 1;
  });
  return notes.map((n) => ({ ...n, finger: n.fret > 0 ? out.get(n.string) : 0 }));
}

// every grip of one chord: [{notes: [{string, fret, midi, iv, finger}], cost}]
const cache = new Map();
function candidates(tok) {
  if (cache.has(tok)) return cache.get(tok);
  const c = T.parseChordToken(tok), q = c.quality, root = c.root;
  const bassRel = c.bass ? ((T.notePc(c.bass) - T.notePc(root)) % 12 + 12) % 12 : 0;
  const out = new Map();
  const rootPc = T.notePc(root);
  const add = (notes) => {
    if (!notes?.length || notes.some((n) => n.fret > MAX)) return;
    const low = notes.reduce((a, n) => (OPEN[n.string] + n.fret < OPEN[a.string] + a.fret ? n : a));
    if (!bassRel && (OPEN[low.string] + low.fret) % 12 !== rootPc) return; // root in the bass: these are examples, not inversions
    const k = sig(notes);
    if (out.has(k)) return;
    const fg = fingerGrip(notes);
    if (!fg) return;
    const placed = fg.sort((a, b) => b.string - a.string);
    out.set(k, { notes: placed, cost: playCost(placed, q) });
  };
  for (let lo = 0; lo <= 11; lo++) {
    const pos = { lo, hi: lo + 4, mid: lo + 2 };
    if (bassRel) for (const g of G.bassGrips(root, q, bassRel, pos).slice(0, 8)) add(g.notes);
    else {
      for (const v of G.versionsIn(root, q, pos)) add(v.notes);
      for (const g of G.bassGrips(root, q, 0, pos).slice(0, 8)) add(g.notes); // any other playable root-position grip here
    }
  }
  const list = [...out.values()];
  cache.set(tok, list);
  return list;
}

// the cheapest run of grips through a progression
// shells: root, 3rd and 7th only, root on the 6th or 5th string (1-3-7 on neighbouring strings, 1-7-3 skipping one)
const SHELL_SETS = [[6, 5, 4, ['3', '7']], [6, 4, 3, ['7', '3']], [5, 4, 3, ['3', '7']], [5, 3, 2, ['7', '3']]];
function shellCands(tok) {
  const c = T.parseChordToken(tok);
  if (c.bass) return [];
  const ivs = T.getChord(c.quality).ivs;
  const third = ['3', 'b3', '4', '2'].find((x) => ivs.includes(x)), sev = ['7', 'b7', 'bb7', '6'].find((x) => ivs.includes(x));
  if (!third || !sev) return [];
  const rpc = T.notePc(c.root), want = { [third]: (rpc + T.intervalSemis(third)) % 12, [sev]: (rpc + T.intervalSemis(sev)) % 12 };
  const out = [];
  for (const [rs, s2, s3, [i2, i3]] of SHELL_SETS) {
    const iv2 = i2 === '3' ? third : sev, iv3 = i3 === '3' ? third : sev;
    for (let r = (rpc - OPEN[rs] + 120) % 12; r <= 12; r += 12) {
      const near = (s, pc) => { let best = null; for (let f = Math.max(0, r - 3); f <= r + 3; f++) if ((OPEN[s] + f) % 12 === pc && (best == null || Math.abs(f - r) < Math.abs(best - r))) best = f; return best; };
      const f2 = near(s2, want[iv2]), f3 = near(s3, want[iv3]);
      if (f2 == null || f3 == null) continue;
      const notes = [{ string: rs, fret: r, midi: OPEN[rs] + r, iv: '1' }, { string: s2, fret: f2, midi: OPEN[s2] + f2, iv: iv2 }, { string: s3, fret: f3, midi: OPEN[s3] + f3, iv: iv3 }];
      const fg = fingerGrip(notes);
      if (fg) out.push({ notes: fg.sort((a, b) => b.string - a.string), cost: playCost(fg, c.quality) + (r === 0 ? 0.5 : 0) });
    }
  }
  return out;
}

// prefer: 'shell' to show root–3rd–7th shells (cards about guide tones); otherwise the style suits the example
export function progGrips(tokens, prefer = null) {
  // a pop example (mostly plain triads) gets open and barre chords; a jazz one gets movable 4–5 note grips
  const qs = tokens.map((t) => T.parseChordToken(t).quality);
  const jazz = qs.filter((q) => !TRIAD.has(q)).length * 2 >= qs.length;
  const C = tokens.map((t) => {
    if (prefer === 'shell') { const sh = shellCands(t); if (sh.length) return sh; }
    const all = candidates(t);
    if (!jazz) return all;
    const movable = all.filter((g) => g.notes.length >= 4 && g.notes.every((n) => n.fret > 0));
    return movable.length ? movable : all;
  });
  if (C.some((l) => !l.length)) return null;
  const own = (g) => g.cost + 0.09 * centre(g.notes);
  const move = (a, b) => {
    const d = Math.abs(centre(a.notes) - centre(b.notes));
    let slide = 0, swap = 0;
    for (let s = 1; s <= 6; s++) {
      const x = a.notes.find((n) => n.string === s), y = b.notes.find((n) => n.string === s);
      if (x && y) slide += x.fret && y.fret ? Math.abs(x.fret - y.fret) : 0;
      else if (x || y) swap++;
    }
    return slide * 0.3 + swap * 0.12 + (d > 3 ? (d - 3) * 1.2 : 0);
  };
  let prev = C[0].map((g) => ({ g, cost: own(g), back: null }));
  const steps = [prev];
  for (let i = 1; i < C.length; i++) {
    prev = C[i].map((g) => {
      let best = null;
      for (const p of steps[i - 1]) { const v = p.cost + move(p.g, g); if (!best || v < best.cost) best = { cost: v, back: p }; }
      return { g, cost: best.cost + own(g), back: best.back };
    });
    steps.push(prev);
  }
  let end = prev.reduce((a, b) => (a.cost <= b.cost ? a : b));
  const run = [];
  for (let s = end; s; s = s.back) run.unshift(s.g);
  return run;
}

// exact notes, low to high, on distinct strings low to high; the tightest hand shape near `near`
function placeChord(midis, near, strict = true) {
  const k = midis.length;
  let best = null, bc = Infinity;
  const pick = (i, from, acc) => {
    if (i === k) {
      const notes = acc.map((s, j) => ({ string: s, fret: midis[j] - OPEN[s], midi: midis[j] }));
      const fr = fretted(notes);
      const span = fr.length ? Math.max(...fr) - Math.min(...fr) : 0;
      if (span > (strict ? 4 : 6) || (strict && !fingerGrip(notes))) return;
      const gaps = acc[0] - acc[k - 1] + 1 - k;
      const c = span * 0.8 + gaps * 1.4 + notes.filter((n) => n.fret === 0).length * 0.3 + centre(notes) * 0.05 + (near != null && fr.length ? Math.abs(centre(notes) - near) * 0.3 : 0);
      if (c < bc) { bc = c; best = notes; }
      return;
    }
    for (let s = from; s >= 1; s--) {
      const f = midis[i] - OPEN[s];
      if (f < 0 || f > MAXX) continue;
      pick(i + 1, s - 1, [...acc, s]);
    }
  };
  pick(0, 6, []);
  if (!best) return strict ? placeChord(midis, near, false) : null;
  // a voicing no hand can hold (a piano polychord): shown, but without finger numbers
  return (fingerGrip(best) || best.map((n) => ({ ...n, finger: 0 }))).sort((a, b) => b.string - a.string);
}
function placeNote(midi, near) {
  let best = null, bc = Infinity;
  for (let s = 6; s >= 1; s--) {
    const f = midi - OPEN[s];
    if (f < 0 || f > MAXX) continue;
    const c = (near == null ? f * 0.1 : Math.abs(f - near)) + (f === 0 && near > 3 ? 1 : 0);
    if (c < bc) { bc = c; best = { string: s, fret: f, midi }; }
  }
  return best;
}
const midiOf = (s) => { const m = /^([A-G](?:#|b)?)(-?\d)$/.exec(s); return T.notePc(T.parseNote(m[1])) + (Number(m[2]) + 1) * 12; };

// what to show and play, event by event: { notes (the grip), line (melody notes after it), label }
// in words, the kind of voicing shown
export function styleOf(play, prefer = null) {
  if (play.startsWith('=')) return 'The exact voicing the card asks for';
  if (prefer === 'shell') return 'Shells: root, 3rd and 7th';
  const qs = play.split(/\s+/).map((t) => T.parseChordToken(t).quality);
  return qs.filter((q) => !TRIAD.has(q)).length * 2 >= qs.length ? 'Movable 4–5 note grips, kept in one area' : 'Open and barre chords';
}
export function exampleSteps(play, prefer = null) {
  if (!play.startsWith('=')) {
    const toks = play.split(/\s+/);
    const run = progGrips(toks, prefer);
    return toks.map((tok, i) => {
      const c = T.parseChordToken(tok);
      return { label: T.pretty(T.chordSymbol(c.root, c.quality)) + (c.bass ? '/' + T.noteName(c.bass, true) : ''), notes: run ? run[i].notes : null, line: [] };
    });
  }
  const evs = play.slice(1).split('|').map((x) => x.trim().split(/\s+/).map(midiOf));
  const steps = [];
  let near = null;
  for (const e of evs) {
    if (e.length > 1 || !steps.length) {
      const notes = e.length > 1 ? placeChord(e, near) : null;
      steps.push({ notes, line: e.length > 1 ? [] : [placeNote(e[0], near)], midis: e.length > 1 ? e : [] });
      if (notes) near = centre(notes) || near;
    } else steps[steps.length - 1].line.push(placeNote(e[0], near ?? 5));
  }
  return steps;
}
