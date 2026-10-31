// Ted Greene engine: book grips -> playable placements, transposition, and his generating rules
// (chord scales = move every note to the next scale note on its own string; cycles = alternating chord scales).
import * as T from './theory.js';
import { parseFrets, parseSymbol, ivLabel, transposeSequence, transposeSymbol } from './tgchords.js';

const OPEN = { 6: 40, 5: 45, 4: 50, 3: 55, 2: 59, 1: 64 };

// semitones to move from key `from` to key `to` (smallest move, -5..+6)
export function keyShift(from, to) {
  if (!from || !to) return 0;
  const a = T.notePc(T.parseKey(from).tonic), b = T.notePc(T.parseKey(to).tonic);
  let d = ((b - a) % 12 + 12) % 12;
  if (d > 6) d -= 12;
  return d;
}

// [{name, frets}] in key `from` -> same voicings in key `to`
export function transposeExample(chords, from, to) {
  const s = keyShift(from, to);
  if (!s) return chords.map((c) => ({ ...c, frets: parseFrets(c.frets) }));
  const seq = transposeSequence(chords.map((c) => c.frets), s);
  return chords.map((c, i) => ({ ...c, name: safe(() => transposeSymbol(c.name, s), c.name), frets: seq[i] }));
}
const safe = (fn, d) => { try { return fn(); } catch (e) { return d; } };

// grip -> placement {notes:[{string,fret,midi,iv,note}], minFret, maxFret}
export function gripPlacement(name, frets) {
  const f = parseFrets(frets);
  let ch = null;
  try { ch = parseSymbol(name); } catch (e) { /* unnamed */ }
  const notes = [];
  f.forEach((fr, i) => {
    if (fr == null) return;
    const string = 6 - i;
    const midi = OPEN[string] + fr;
    const pc = midi % 12;
    const iv = ch ? ivLabel(ch, pc) : '';
    notes.push({ string, fret: fr, midi, iv, note: ch ? T.transpose(ch.root, ivSimple(iv)) : T.noteFromPc(pc) });
  });
  const fs = notes.map((n) => n.fret);
  return { notes, minFret: Math.min(...fs), maxFret: Math.max(...fs), stringSet: notes.map((n) => n.string) };
}
const ivSimple = (iv) => ({ b9: 'b2', '9': '2', '#9': '#2', '11': '4', '#11': '#4', b13: 'b6', '13': '6' }[iv] || iv || '1');

// ---------- generators ----------
function scalePcs(key) {
  const k = T.parseKey(key);
  return new Set(T.scaleNotes(k.tonic, k.minor ? 'aeolian' : 'major').map(T.notePc));
}
// move every note to the next (dir=+1) or previous (dir=-1) scale note on the same string
export function stepGrip(frets, key, dir = 1) {
  const pcs = scalePcs(key);
  const f = parseFrets(frets);
  const out = f.map((fr, i) => {
    if (fr == null) return null;
    const s = 6 - i;
    let x = fr;
    do { x += dir; } while (!pcs.has((OPEN[s] + x) % 12) && Math.abs(x - fr) < 4);
    return x;
  });
  const vals = out.filter((x) => x != null);
  if (Math.min(...vals) < 0) return out.map((x) => (x == null ? null : x + 12));
  if (Math.max(...vals) > 17) return out.map((x) => (x == null ? null : x - 12));
  return out;
}
// name a grip as the diatonic chord built on the degree of its lowest... use the bass-independent root: the degree whose
// diatonic chord (triad or 7th) contains every sounded note.
export function nameDiatonic(frets, key, size) {
  const k = T.parseKey(key);
  const sc = k.minor ? 'aeolian' : 'major';
  const f = parseFrets(frets);
  const pcs = new Set(f.map((fr, i) => (fr == null ? null : (OPEN[6 - i] + fr) % 12)).filter((x) => x != null));
  let best = null;
  for (let d = 0; d < 7; d++) {
    const dc = T.diatonicChord(k.tonic, sc, d, size);
    const set = new Set(dc.tones.map(T.notePc));
    const covered = [...pcs].every((p) => set.has(p));
    const hasRootOr3 = pcs.has(T.notePc(dc.tones[0])) ? 2 : pcs.has(T.notePc(dc.tones[1])) ? 1 : 0;
    if (covered && (!best || hasRootOr3 > best.score)) best = { d, dc, score: hasRootOr3 };
  }
  if (!best) return '?';
  const ROM = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
  const q = best.dc.quality;
  const sym = q ? T.chordSymbol(best.dc.root, q).replace(/♭/g, 'b').replace(/♯/g, '#') : T.noteName(best.dc.root);
  const minorish = q && /^(min|m7|m7b5|dim|dim7|mMaj7)$/.test(q);
  return { name: sym, roman: minorish ? ROM[best.d].toLowerCase() + (q === 'm7b5' ? 'ø' : q === 'dim' || q === 'dim7' ? '°' : '') : ROM[best.d] };
}
// degree (0-6) of a chord symbol's root in the key, or null
export function degreeOf(name, key) {
  try {
    const k = T.parseKey(key);
    const root = T.notePc(parseSymbol(name).root);
    const i = T.scaleNotes(k.tonic, k.minor ? 'aeolian' : 'major').findIndex((n) => T.notePc(n) === root);
    return i < 0 ? null : i;
  } catch (e) { return null; }
}
function diatonicName(key, d, size) {
  const k = T.parseKey(key);
  const dc = T.diatonicChord(k.tonic, k.minor ? 'aeolian' : 'major', ((d % 7) + 7) % 7, size);
  const ROM = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
  const q = dc.quality;
  const minorish = q && /^(min|m7|m7b5|dim|dim7|mMaj7)$/.test(q);
  const r = ROM[((d % 7) + 7) % 7];
  return { name: T.chordSymbol(dc.root, q || 'maj').replace(/♭/g, 'b').replace(/♯/g, '#'), roman: minorish ? r.toLowerCase() + (q === 'm7b5' ? 'ø' : /dim/.test(q) ? '°' : '') : r };
}
const sizeOf = (name) => (/(7|6|9|11|13)/.test(String(name).replace(/^[A-G](#|b)?/, '')) ? 4 : 3);

// chord scale from a starting grip: 7 steps up (or down) and back to the octave
export function chordScaleFrom(start, key, dir = 1, steps = 7) {
  const size = sizeOf(start.name);
  const seq = [{ name: start.name, frets: parseFrets(start.frets) }];
  let cur = parseFrets(start.frets);
  const d0 = degreeOf(start.means || start.name, key);
  for (let i = 0; i < steps; i++) {
    cur = stepGrip(cur, key, dir);
    const nm = d0 != null ? diatonicName(key, d0 + dir * (i + 1), size) : nameDiatonic(cur, key, size);
    seq.push({ name: nm.name || '?', roman: nm.roman, frets: cur });
  }
  return seq;
}
// Ted's "good connection": the grip of the diatonic chord `steps` scale-degrees away from `grip`'s chord, on the same
// strings, that moves the fewest frets (common tones held, other voices move by step).
export function connectGrip(grip, key, steps, size = 3, knownDeg = null) {
  const k = T.parseKey(key);
  const sc = k.minor ? 'aeolian' : 'major';
  const f = parseFrets(grip.frets);
  const ROM = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii'];
  const d0 = knownDeg != null ? knownDeg : ROM.indexOf(String(nameDiatonic(f, key, size).roman || 'i').toLowerCase().replace(/[ø°]/g, ''));
  const target = T.diatonicChord(k.tonic, sc, ((d0 < 0 ? 0 : d0) + steps + 70) % 7, size);
  const tpcs = target.tones.map(T.notePc);
  const strings = f.map((fr, i) => (fr == null ? null : 6 - i));
  const opts = f.map((fr, i) => {
    if (fr == null) return [null];
    const s = 6 - i;
    const o = [];
    for (let x = Math.max(0, fr - 4); x <= Math.min(17, fr + 4); x++) if (tpcs.includes((OPEN[s] + x) % 12)) o.push(x);
    return o;
  });
  let best = null;
  const rec = (i, acc) => {
    if (i === 6) {
      const vals = acc.filter((x) => x != null);
      const fretted = vals.filter((x) => x > 0);
      if (fretted.length && Math.max(...fretted) - Math.min(...fretted) > 4) return;
      const pcs = new Set(acc.map((x, j) => (x == null ? null : (OPEN[6 - j] + x) % 12)).filter((x) => x != null));
      if (!pcs.has(tpcs[1])) return; // needs the 3rd
      if (!pcs.has(tpcs[0]) && !(size === 4 && pcs.has(tpcs[3]))) return; // root, or (for 7ths) 3rd + 7th
      const move = acc.reduce((a, x, j) => a + (x == null ? 0 : Math.abs(x - f[j])), 0);
      const score = move - pcs.size * 0.6;
      if (!best || score < best.score) best = { score, frets: [...acc] };
      return;
    }
    for (const x of opts[i]) { acc.push(x); rec(i + 1, acc); acc.pop(); }
  };
  rec(0, []);
  if (!best) return null;
  const nm = diatonicName(key, (d0 < 0 ? 0 : d0) + steps, size);
  return { name: nm.name, roman: nm.roman, frets: best.frets };
}

// diatonic cycle from two adjacent grips (e.g. I and IV = cycle of 4ths): alternate the two chord scales.
// `dir` = -1 for 4ths (both scales descend), +1 for 5ths.
export function cycleFrom(a, b, key, dir = -1, length = 8) {
  const size = sizeOf(a.means || a.name);
  // a cycle of 4ths needs b = a 4th above a (3 scale steps); of 5ths, a 5th above (4 steps). Otherwise connect it ourselves.
  const want = dir < 0 ? 3 : 4;
  const da = degreeOf(a.means || a.name, key);
  const db = b ? degreeOf(b.means || b.name, key) : null;
  if (!b || da == null || db == null || (db - da + 7) % 7 !== want) b = connectGrip(a, key, want, size, da) || b;
  const dB = da != null ? da + want : null;
  const seq = [{ name: a.name, means: a.means, frets: parseFrets(a.frets) }, { name: b.name, means: b.means, roman: b.roman, frets: parseFrets(b.frets) }];
  let A = parseFrets(a.frets), B = parseFrets(b.frets);
  for (let k = 1; seq.length < length; k++) {
    A = stepGrip(A, key, dir);
    seq.push({ ...(da != null ? diatonicName(key, da + dir * k, size) : nameDiatonic(A, key, size)), frets: A });
    if (seq.length >= length) break;
    B = stepGrip(B, key, dir);
    seq.push({ ...(dB != null ? diatonicName(key, dB + dir * k, size) : nameDiatonic(B, key, size)), frets: B });
  }
  return seq;
}

// roman numerals for a sequence in a key (when the book didn't print them)
export function romansFor(chords, key) {
  return chords.map((c) => {
    try {
      const ch = parseSymbol(c.name);
      const k = T.parseKey(key);
      const semi = ((T.notePc(ch.root) - T.notePc(k.tonic)) % 12 + 12) % 12;
      const HEADS = ['I', 'bII', 'II', 'bIII', 'III', 'IV', '#IV', 'V', 'bVI', 'VI', 'bVII', 'VII'];
      const minor = ch.ivs.includes('b3');
      const h = HEADS[semi];
      return minor ? h.toLowerCase() : h;
    } catch (e) { return ''; }
  });
}
