// Fretboard geometry: regions, scale positions, voicing placement.
import {
  parseNote, notePc, transpose, intervalSemis, getScale, getChord, scaleNotes, noteName,
  diatonicChord, diatonicQuartal, intervalBetween,
} from './theory.js';

// string 1 = high e ... 6 = low E
export const OPEN = { 1: 64, 2: 59, 3: 55, 4: 50, 5: 45, 6: 40 };
export const MAX_FRET = 17;
export const midiAt = (s, f) => OPEN[s] + f;

const toNote = (x) => (typeof x === 'string' ? parseNote(x) : x);

// pitch-class -> {iv, note} map for a set of intervals over a root
function toneMap(root, ivs, labels) {
  const r = toNote(root);
  const m = new Map();
  ivs.forEach((iv, i) => {
    const n = transpose(r, iv);
    const pc = notePc(n);
    if (!m.has(pc)) m.set(pc, { iv: labels ? labels[i] : iv, note: n, idx: i });
  });
  return m;
}

function notesInWindow(map, lo, hi, strings = [6, 5, 4, 3, 2, 1]) {
  const out = [];
  for (const s of strings) {
    for (let f = Math.max(0, lo); f <= Math.min(MAX_FRET, hi); f++) {
      const t = map.get(midiAt(s, f) % 12);
      if (t) out.push({ string: s, fret: f, midi: midiAt(s, f), iv: t.iv, note: t.note, idx: t.idx });
    }
  }
  return out;
}

// remove same-pitch duplicates (keeps the one on the higher-numbered string unless preferHigh)
function dedupe(notes) {
  const byMidi = new Map();
  for (const n of notes) {
    const prev = byMidi.get(n.midi);
    if (!prev) byMidi.set(n.midi, n);
    else if (n.string < prev.string) byMidi.set(n.midi, n); // prefer higher string at lower fret (standard box)
  }
  return [...byMidi.values()];
}
const byPitch = (a, b) => a.midi - b.midi || b.string - a.string;

// lowest fret r >= minR on string s that sounds pitch class pc
function fretFor(s, pc, minR = 0) {
  let r = ((pc - OPEN[s]) % 12 + 12) % 12;
  while (r < minR) r += 12;
  return r;
}

// CAGED windows relative to the root fret on its anchor string
const CAGED = {
  E: { s: 6, lo: -1, hi: 3 },
  D: { s: 4, lo: -1, hi: 3 },
  C: { s: 5, lo: -3, hi: 1 },
  A: { s: 5, lo: -1, hi: 3 },
  G: { s: 6, lo: -3, hi: 1 },
};
export function cagedWindow(root, shape) {
  const c = CAGED[shape];
  if (!c) throw new Error(`Unknown CAGED shape "${shape}"`);
  const pc = notePc(toNote(root));
  let r = fretFor(c.s, pc);
  if (r + c.lo < -1) r += 12;
  return { lo: Math.max(0, r + c.lo), hi: r + c.hi, rootFret: r, anchor: c.s };
}

// walk a scale k notes per string from degree d on string 6
function nPerString(map, ivs, root, startDeg, k) {
  const r = toNote(root);
  const n = ivs.length;
  const semis = ivs.map(intervalSemis);
  const startIdx = (startDeg - 1) % n;
  // starting pitch on string 6
  const pc0 = (notePc(r) + semis[startIdx]) % 12;
  let midi = OPEN[6] + fretFor(6, pc0);
  const seq = [];
  let idx = startIdx;
  for (const s of [6, 5, 4, 3, 2, 1]) {
    for (let j = 0; j < k; j++) {
      seq.push({ string: s, midi, idx });
      const next = (idx + 1) % n;
      let step = (semis[next] - semis[idx] + 12) % 12;
      if (step === 0) step = 12;
      midi += step;
      idx = next;
    }
  }
  let out = seq.map((x) => ({ ...x, fret: x.midi - OPEN[x.string] }));
  const minF = Math.min(...out.map((x) => x.fret));
  if (minF < 0) out = out.map((x) => ({ ...x, fret: x.fret + 12, midi: x.midi + 12 }));
  if (Math.max(...out.map((x) => x.fret)) > MAX_FRET && Math.min(...out.map((x) => x.fret)) >= 12)
    out = out.map((x) => ({ ...x, fret: x.fret - 12, midi: x.midi - 12 }));
  return out.map((x) => {
    const t = map.get(x.midi % 12);
    return { ...x, iv: t.iv, note: t.note, idx: t.idx };
  });
}

function scaleSource(spec) {
  if (spec.tones) return { ivs: spec.tones, labels: null, scale: null };
  if (spec.quality) { const c = getChord(spec.quality); return { ivs: c.ivs.map(simpleIv), labels: c.ivs, scale: null }; }
  const s = getScale(spec.scale);
  return { ivs: s.ivs, labels: s.labels || null, scale: s };
}
// compound intervals -> simple for pitch mapping (labels keep the compound name)
export const simpleIv = (iv) => ({ b9: 'b2', '9': '2', '#9': '#2', '11': '4', '#11': '#4', b13: 'b6', '13': '6', '8': '1', '10': '3', '12': '5', b10: 'b3', b12: 'b5', '#12': '#5', b14: 'b7', '14': '7', '15': '1' }[iv] || iv);

// Resolve a region spec into a list of notes (each {string, fret, midi, iv, note})
export function regionNotes(spec) {
  const root = toNote(spec.root);
  const src = scaleSource(spec);
  const ivs = src.ivs.map(simpleIv);
  const labels = src.labels || src.ivs;
  const map = toneMap(root, ivs, labels);
  const reg = spec.region || { neck: true };

  if (reg.connect) {
    let all = [];
    for (const r of reg.connect) {
      const sub = typeof r === 'number' ? { box: r } : (/^[CAGED]$/.test(r) ? { caged: r } : r);
      all = all.concat(regionNotes({ ...spec, region: sub }));
    }
    const seen = new Set();
    return all.filter((n) => { const k = n.string + ':' + n.fret; if (seen.has(k)) return false; seen.add(k); return true; }).sort(byPitch);
  }
  if (reg.caged) {
    const w = cagedWindow(root, reg.caged);
    return dedupe(notesInWindow(map, w.lo, w.hi)).sort(byPitch);
  }
  if (reg.nps3) {
    if (ivs.length < 6) return boxNotes(map, ivs, root, src, reg.nps3);
    return nPerString(map, ivs, root, reg.nps3, 3).sort(byPitch);
  }
  if (reg.box) {
    if (ivs.length <= 6) return boxNotes(map, ivs, root, src, reg.box);
    return nPerString(map, ivs, root, reg.box, 3).sort(byPitch);
  }
  if (reg.position != null) {
    const N = reg.position;
    return dedupe(notesInWindow(map, N - 1, N + 3)).sort(byPitch);
  }
  if (reg.frets) return notesInWindow(map, reg.frets[0], reg.frets[1]).sort(byPitch);
  if (reg.string) {
    const [lo, hi] = reg.frets || [0, 15];
    return notesInWindow(map, lo, hi, [reg.string]).sort(byPitch);
  }
  if (reg.strings) {
    const [lo, hi] = reg.frets || [0, 15];
    return notesInWindow(map, lo, hi, reg.strings).sort(byPitch);
  }
  return notesInWindow(map, 0, 15).sort(byPitch);
}

// pentatonic boxes (2 per string), box 1 = minor pentatonic root shape
function boxNotes(map, ivs, root, src, box) {
  let base = ivs;
  let baseRoot = root;
  let startDeg = box;
  const id = src.scale && src.scale.id;
  // blues scales: build the parent pentatonic box, then add blue notes inside its window
  if (id === 'blues' || id === 'major-blues') {
    const parentIvs = getScale(src.scale.blueOf).ivs;
    const pmap = toneMap(root, parentIvs, null);
    const pnotes = boxNotes(pmap, parentIvs, root, { scale: getScale(src.scale.blueOf) }, box);
    const lo = Math.min(...pnotes.map((n) => n.fret)), hi = Math.max(...pnotes.map((n) => n.fret));
    const extra = notesInWindow(map, lo, hi).filter((n) => !pnotes.some((p) => p.midi === n.midi));
    const relabel = pnotes.map((p) => ({ ...p, ...pick(map.get(p.midi % 12)) }));
    return dedupe(relabel.concat(extra)).sort(byPitch);
  }
  if (id === 'major-pentatonic') startDeg = ((4 + box - 1) % 5) + 1; // same shapes as relative minor
  if (ivs.length === 5) return nPerString(map, base, baseRoot, startDeg, 2).sort(byPitch);
  return nPerString(map, base, baseRoot, startDeg, 2).sort(byPitch);
}
const pick = (t) => (t ? { iv: t.iv, note: t.note, idx: t.idx } : {});

// ---------- paths & sequences ----------
export function orderPath(notes, path = 'up-and-down', fromRoot = false) {
  let asc = [...notes].sort(byPitch);
  if (fromRoot) {
    const i = asc.findIndex((n) => n.iv === '1');
    if (i > 0) asc = asc.slice(i);
  }
  if (path === 'ascending') return asc;
  if (path === 'descending') return [...asc].reverse();
  return asc.concat([...asc].reverse().slice(1));
}

export function applySequence(notes, seq) {
  const asc = [...notes].sort(byPitch);
  const n = asc.length;
  const cells = [];
  const kind = seq.kind;
  let cell;
  if (kind === 'intervals') cell = [0, (seq.step || 3) - 1];
  else if (kind === 'groups') cell = [...Array(seq.size || 4).keys()];
  else if (kind === 'triads') cell = [0, 2, 4];
  else if (kind === 'sevenths') cell = [0, 2, 4, 6];
  else if (kind === 'pattern') { const d = seq.degrees || [1, 2, 3]; const m = Math.min(...d); cell = d.map((x) => x - m); }
  else return asc;
  const span = Math.max(...cell);
  if (Math.min(...cell) < 0) return asc;
  for (let i = 0; i + span < n; i++) {
    let c = cell.map((k) => asc[i + k]);
    if (seq.alternate && i % 2 === 1) c = c.reverse();
    cells.push(c);
  }
  const dir = seq.direction || 'ascending';
  let up = cells;
  if (dir === 'descending') return cells.reverse().map((c) => [...c].reverse()).flat();
  if (dir === 'up-and-down') return up.flat().concat(cells.slice(0, -1).reverse().map((c) => [...c].reverse()).flat());
  return up.flat();
}

// ---------- voicings ----------
// Build bottom->top semitone offsets + labels for a voicing type and inversion
function chordToneList(quality, tones) {
  const c = getChord(quality);
  let ivs = tones || c.ivs;
  if (!tones && ivs.length > 4) {
    // default reduction: omit 5, then root, then 11 (for dominants), keep top extensions
    let t = [...ivs];
    for (const drop of ['5', '1', '11', '9']) { if (t.length > 4 && t.includes(drop)) t = t.filter((x) => x !== drop); }
    ivs = t.slice(0, 4);
  }
  // stacking order: sort by simple pitch
  return [...ivs].sort((a, b) => (intervalSemis(simpleIv(a)) % 12) - (intervalSemis(simpleIv(b)) % 12));
}

export function closeVoicings(stack) {
  // every rotation as a close voicing (bottom->top), offsets in semitones from bass
  const pcs = stack.map((iv) => intervalSemis(simpleIv(iv)) % 12);
  const out = [];
  for (let k = 0; k < stack.length; k++) {
    const order = [];
    let prev = -1;
    for (let j = 0; j < stack.length; j++) {
      const i = (k + j) % stack.length;
      let p = pcs[i];
      while (p <= prev) p += 12;
      order.push({ iv: stack[i], semis: p });
      prev = p;
    }
    const base = order[0].semis;
    out.push(order.map((x) => ({ ...x, semis: x.semis - base })));
  }
  return out;
}
function applyDrop(voices, type) {
  // voices bottom->top; voice numbers counted from the top (1 = top)
  const n = voices.length;
  const drops = { drop2: [2], drop3: [3], drop24: [2, 4], drop23: [2, 3], drop4: [4], spread: [2] }[type] || [];
  const v = voices.map((x) => ({ ...x }));
  for (const d of drops) {
    if (d > n) continue;
    v[n - d].semis -= 12;
  }
  v.sort((a, b) => a.semis - b.semis);
  const base = v[0].semis;
  return v.map((x) => ({ ...x, semis: x.semis - base }));
}
function customOrder(order) {
  const out = [];
  let prev = -1;
  for (const iv of order) {
    let p = intervalSemis(simpleIv(iv)) % 12;
    while (p <= prev) p += 12;
    out.push({ iv, semis: p });
    prev = p;
  }
  const base = out[0].semis;
  return out.map((x) => ({ ...x, semis: x.semis - base }));
}

// all voicing "shapes" (bottom->top interval structures) for a spec
export function voicingShapes(spec) {
  const { quality = 'maj', voicing = 'close' } = spec;
  if (voicing === 'custom') return [customOrder(spec.order)];
  if (voicing === 'shell') {
    const c = getChord(quality).ivs;
    const third = c.find((x) => ['3', 'b3', '4', '2'].includes(x)) || c[1];
    const sev = c.find((x) => ['7', 'b7', 'bb7', '6'].includes(x)) || c[c.length - 1];
    return [customOrder(['1', sev, third]), customOrder(['1', third, sev])];
  }
  if (voicing === 'quartal') {
    const n = spec.size || (spec.stringSet && spec.stringSet.length) || 3;
    const start = (spec.tones && spec.tones[0]) || '1';
    const s0 = intervalSemis(simpleIv(start));
    return [Array.from({ length: n }, (_, i) => ({ iv: semisLabel(s0 + 5 * i, start, i), semis: 5 * i }))];
  }
  const stack = chordToneList(quality, spec.tones);
  const closes = closeVoicings(stack);
  const shapes = closes.map((cv) => (voicing === 'close' ? cv : applyDrop(cv, voicing)));
  // order by bass tone in stack order (root position first)
  const rank = (sh) => stack.indexOf(sh[0].iv);
  return shapes.sort((a, b) => rank(a) - rank(b));
}
function semisLabel(s, start, i) {
  const names = ['1', 'b2', '2', 'b3', '3', '4', '#4', '5', 'b6', '6', 'b7', '7'];
  return i === 0 ? start : names[s % 12];
}

// place a shape on a string set: returns list of placements [{notes:[{string,fret,midi,iv}], minFret, maxFret}]
export function placeShape(root, shape, stringSet, opts = {}) {
  const r = toNote(root);
  const strings = [...stringSet].sort((a, b) => b - a); // low string first
  if (strings.length !== shape.length) return [];
  const bassIv = shape[0].iv;
  const bassPc = (notePc(r) + intervalSemis(simpleIv(bassIv))) % 12;
  const maxSpan = opts.maxSpan ?? 4;
  const out = [];
  for (let f = fretFor(strings[0], bassPc); f <= MAX_FRET; f += 12) {
    for (const oct of [0]) {
      const bass = midiAt(strings[0], f) + oct;
      const notes = shape.map((v, i) => {
        const midi = bass + v.semis;
        return { string: strings[i], fret: midi - OPEN[strings[i]], midi, iv: v.iv, note: transpose(r, simpleIv(v.iv)) };
      });
      if (notes.some((n) => n.fret < 0 || n.fret > MAX_FRET)) continue;
      const fretted = notes.filter((n) => n.fret > 0).map((n) => n.fret);
      const span = fretted.length ? Math.max(...fretted) - Math.min(...fretted) : 0;
      if (span > maxSpan) continue;
      const fs = notes.map((n) => n.fret);
      out.push({ notes, minFret: Math.min(...fs), maxFret: Math.max(...fs), span });
    }
  }
  return out;
}

const STD_SETS = {
  3: [[3, 2, 1], [4, 3, 2], [5, 4, 3], [6, 5, 4], [4, 2, 1], [5, 3, 2], [6, 4, 3], [5, 4, 2], [6, 5, 3], [6, 4, 2], [5, 3, 1]],
  4: [[4, 3, 2, 1], [5, 4, 3, 2], [6, 5, 4, 3], [6, 4, 3, 2], [5, 3, 2, 1], [6, 5, 3, 2], [5, 4, 2, 1], [6, 5, 4, 2], [5, 4, 3, 1], [6, 4, 3, 1], [6, 5, 4, 1]],
  5: [[5, 4, 3, 2, 1], [6, 5, 4, 3, 2], [6, 4, 3, 2, 1], [6, 5, 4, 3, 1]],
  6: [[6, 5, 4, 3, 2, 1]],
};
export const stringSetsFor = (n) => STD_SETS[n] || [];

// Voicings for a chord: [{label, bassIv, placement}] ascending the neck
export function chordVoicings(spec) {
  const root = toNote(spec.root);
  const shapes = voicingShapes(spec);
  const n = shapes[0].length;
  let sets = spec.stringSet === 'auto' || !spec.stringSet ? null : [spec.stringSet];
  if (!sets) {
    sets = stringSetsFor(n).filter((ss) => shapes.some((sh) => placeShape(root, sh, ss).length));
    if (!spec.stringSetAll) sets = sets.slice(0, 1);
  }
  let chosen = shapes;
  const inv = spec.inversion;
  const bassWanted = spec.bass || (inv && typeof inv === 'object' && inv.bass) || (spec.tones && typeof inv === 'number' ? spec.tones[inv % spec.tones.length] : null);
  if (bassWanted) chosen = shapes.filter((sh) => sh[0].iv === bassWanted || simpleIv(sh[0].iv) === simpleIv(bassWanted));
  else if (inv !== undefined && inv !== 'all' && inv !== null && typeof inv === 'number') chosen = [shapes[inv % shapes.length]];
  if (!chosen.length) chosen = shapes;
  let res = collect(chosen);
  // e.g. a 1-7-3 shell can't sit on 5-4-3; fall back to the shapes that fit this string set
  if (!res.length && chosen.length < shapes.length) res = collect(shapes);
  res.sort((a, b) => avgFret(a) - avgFret(b));
  return res;
  function collect(list) {
  const res = [];
  for (const ss of sets) {
    list.forEach((sh) => {
      const invIdx = shapes.indexOf(sh);
      for (const p of placeShape(root, sh, ss, { maxSpan: spec.maxSpan ?? (spec.voicing === 'close' && n >= 4 ? 5 : 4) })) {
        res.push({ ...p, inversion: invIdx, bassIv: sh[0].iv, stringSet: ss, label: invLabel(spec, sh, invIdx) });
      }
    });
  }
  return res;
  }
}
const avgFret = (p) => p.notes.reduce((s, n) => s + n.fret, 0) / p.notes.length;
function invLabel(spec, sh, idx) {
  if (spec.voicing === 'shell') return sh.map((v) => v.iv).join('-');
  if (spec.voicing === 'quartal' || spec.voicing === 'custom') return sh.map((v) => v.iv).join('-');
  const names = ['Root position', '1st inversion', '2nd inversion', '3rd inversion', '4th inversion'];
  const bass = sh[0].iv;
  const hasRoot = sh.some((v) => v.iv === '1');
  if (!hasRoot) return `${bass} in bass`;
  return `${names[idx] || idx + 'th inversion'} (${bass} in bass)`;
}

// ---------- chord scales ----------
export function chordScale(spec) {
  const root = toNote(spec.root);
  const s = getScale(spec.scale);
  const size = spec.size || 4;
  const n = s.ivs.length;
  const items = [];
  for (let i = 0; i < n; i++) {
    const dc = size === 'quartal' ? diatonicQuartal(root, spec.scale, i, spec.stringSet?.length || 3) : diatonicChord(root, spec.scale, i, size);
    items.push({ degree: i + 1, ...dc });
  }
  // voice each with a consistent shape: same voicing, same chord tone in the bass
  const inv = spec.inversion ?? 0;
  const voiced = items.map((it, i) => {
    let shape;
    if (size === 'quartal') shape = customOrder(it.ivs);
    else {
      const shapes = closeVoicings(it.ivs).map((cv) => (spec.voicing === 'close' || !spec.voicing ? cv : applyDrop(cv, spec.voicing)));
      const wantBass = it.ivs[inv % it.ivs.length];
      shape = shapes.find((sh) => sh[0].iv === wantBass) || shapes[0];
    }
    return { ...it, shape, roman: size === 'quartal' ? ROMANS[i] : romanFor(it, i, root) };
  }).map((v, i, all) => {
    // no string set given: use the standard set where the most chords of the scale fit
    let ss = spec.stringSet;
    if (!ss) {
      const sets = stringSetsFor(v.shape.length);
      const fits = (set) => all.filter((x) => placeShape(x.root, x.shape, set, { maxSpan: 5 }).length).length;
      ss = all._set || (all._set = sets.reduce((a, b) => (fits(b) > fits(a) ? b : a), sets[0]));
    }
    const places = placeShape(v.root, v.shape, ss, { maxSpan: 5 }).sort((a, b) => avgFret(a) - avgFret(b));
    return { ...v, places };
  });
  // try each placement of the first chord as a start; walk upward; prefer fewest wraps, then lowest start
  let best = null;
  for (const start of voiced[0].places.length ? voiced[0].places : [null]) {
    let prev = start ? avgFret(start) : -1;
    let wraps = 0;
    const seq = [start];
    for (const v of voiced.slice(1)) {
      if (!v.places.length) { seq.push(null); continue; }
      let p = v.places.find((pl) => avgFret(pl) > prev && pl.maxFret <= 15);
      if (!p) { p = v.places.find((pl) => avgFret(pl) > prev - 12) || v.places[0]; wraps++; }
      seq.push(p);
      prev = avgFret(p);
    }
    const startF = start ? start.minFret : 0;
    const tooLow = start && start.minFret < (spec.startFret ?? 0) ? 1 : 0;
    const high = start && start.maxFret > 15 ? 1 : 0;
    const score = wraps * 100 + tooLow * 50 + high * 300 + startF;
    if (!best || score < best.score) best = { score, seq };
  }
  return voiced.map((v, i) => ({ degree: v.degree, root: v.root, quality: v.quality, tones: v.tones, ivs: v.ivs, roman: v.roman, placement: best.seq[i] || null }));
}
const ROMANS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
// roman numeral relative to the MAJOR scale on the tonic (bIII, bVI, #iv°…), with quality marks
export function romanOf(tonic, chordRoot, ivs) {
  const iv = intervalBetween(tonic, chordRoot);
  const deg = { '1': 0, b2: 1, '2': 1, '#2': 1, b3: 2, '3': 2, b4: 3, '4': 3, '#4': 3, b5: 4, '5': 4, '#5': 4, b6: 5, '6': 5, bb7: 6, b7: 6, '7': 6 }[iv] ?? 0;
  const acc = /^b/.test(iv) && iv !== 'bb7' ? (iv.startsWith('bb') ? 'bb' : 'b') : /^#/.test(iv) ? '#' : iv === 'bb7' ? 'bb' : '';
  const third = ivs[1];
  const fifth = ivs[2];
  let r = ROMANS[deg];
  if (third === 'b3') r = r.toLowerCase();
  let mark = '';
  if (third === 'b3' && fifth === 'b5') mark = ivs[3] === 'b7' ? 'ø' : '°';
  if (third === '3' && fifth === '#5') mark = '+';
  return acc + r + mark;
}
function romanFor(it, i, tonic) { return tonic ? romanOf(tonic, it.root, it.ivs) : ROMANS[i]; }

// ---------- progressions: voice-led placements ----------
export function voiceLead(chords, spec) {
  // chords: [{root, quality, bass}] ; returns placement per chord
  const out = [];
  let prev = null;
  for (const c of chords) {
    const vspec = { root: c.root, quality: c.quality, voicing: spec.voicing || 'drop2', tones: c.tones, stringSet: spec.stringSet || 'auto', stringSetAll: !spec.stringSet };
    let cands = [];
    try { cands = chordVoicings({ ...vspec, inversion: 'all' }); } catch (e) { cands = []; }
    if (c.bass) {
      const bassIv = intervalBetween(c.root, c.bass);
      const f = cands.filter((p) => simpleIv(p.bassIv) === bassIv);
      if (f.length) cands = f;
    }
    if (!cands.length) { out.push(null); continue; }
    let best;
    if (!prev) {
      const target = spec.startFret ?? 5;
      best = cands.reduce((a, b) => (Math.abs(avgFret(a) - target) <= Math.abs(avgFret(b) - target) ? a : b));
    } else if (spec.voiceLead === false) {
      best = cands.reduce((a, b) => (Math.abs(avgFret(a) - 5) <= Math.abs(avgFret(b) - 5) ? a : b));
    } else {
      best = cands.reduce((a, b) => (movement(prev, a) <= movement(prev, b) ? a : b));
    }
    out.push(best);
    prev = best;
  }
  return out;
}
function movement(a, b) {
  const pa = a.notes.map((n) => n.midi).sort((x, y) => x - y);
  const pb = b.notes.map((n) => n.midi).sort((x, y) => x - y);
  let s = 0;
  for (let i = 0; i < Math.min(pa.length, pb.length); i++) s += Math.abs(pa[i] - pb[i]);
  return s + Math.abs(avgFret(a) - avgFret(b)) * 0.5 + (a.stringSet.join() === b.stringSet.join() ? 0 : 1.5);
}

// strummable "grip" for a chord near a target fret: classic E- and A-shape barre grips first, else a drop-2/close voicing
const GRIPS = {
  // offsets from the root fret, strings 6..1 (null = not played)
  E: { maj: [0, 2, 2, 1, 0, 0], min: [0, 2, 2, 0, 0, 0], '7': [0, 2, 0, 1, 0, 0], m7: [0, 2, 0, 0, 0, 0], maj7: [0, null, 1, 1, 0, null], '5': [0, 2, 2, null, null, null], sus4: [0, 2, 2, 2, 0, 0], '7sus4': [0, 2, 0, 2, 0, 0], m6: [0, null, -1, 0, 0, null], '6': [0, null, -1, 1, 0, null], '9': [0, null, 0, 1, 0, 2], m7b5: [0, null, 0, 0, -1, null], dim7: [0, null, -1, 0, -1, null], '13': [0, null, 0, 1, 2, null], '7#9': [0, null, 0, 1, 3, null] },
  A: { maj: [null, 0, 2, 2, 2, 0], min: [null, 0, 2, 2, 1, 0], '7': [null, 0, 2, 0, 2, 0], m7: [null, 0, 2, 0, 1, 0], maj7: [null, 0, 2, 1, 2, 0], '5': [null, 0, 2, 2, null, null], sus4: [null, 0, 2, 2, 3, 0], sus2: [null, 0, 2, 2, 0, 0], '7sus4': [null, 0, 2, 0, 3, 0], '6': [null, 0, 2, 2, 2, 2], m6: [null, 0, 2, -1, 1, null], '9': [null, 0, -1, 0, 0, 0], m9: [null, 0, -2, 0, 0, null], maj9: [null, 0, -1, 1, 0, null], m7b5: [null, 0, 1, 0, 1, null], dim7: [null, 0, 1, -1, 1, null], '7#9': [null, 0, -1, 0, 1, null], '7b9': [null, 0, -1, 0, -1, null], '13': [null, 0, null, 0, 2, 2], add9: [null, 0, 2, 4, 0, null] },
};
export function gripFor(root, quality, target = 3) {
  const r = toNote(root);
  const c = getChord(quality);
  const cands = [];
  for (const [shape, s0] of [['E', 6], ['A', 5]]) {
    const offs = GRIPS[shape][quality];
    if (!offs) continue;
    for (let rf = fretFor(s0, notePc(r)); rf <= 14; rf += 12) {
      const notes = [];
      let ok = true;
      offs.forEach((o, i) => {
        if (o === null) return;
        const s = 6 - i;
        const f = rf + o;
        if (f < 0 || f > MAX_FRET) { ok = false; return; }
        const midi = midiAt(s, f);
        const semi = ((midi - (OPEN[s0] + rf)) % 12 + 12) % 12;
        const iv = c.ivs.find((x) => intervalSemis(simpleIv(x)) % 12 === semi) || '?';
        notes.push({ string: s, fret: f, midi, iv, note: transpose(r, simpleIv(iv === '?' ? '1' : iv)) });
      });
      if (ok && notes.every((n) => n.iv !== '?')) {
        const fs = notes.map((n) => n.fret);
        cands.push({ notes, minFret: Math.min(...fs), maxFret: Math.max(...fs), stringSet: notes.map((n) => n.string), label: shape + ' shape' });
      }
    }
  }
  const n = Math.min(c.ivs.length, 4);
  const voicing = n === 3 ? 'close' : 'drop2';
  if (!cands.length) {
    for (const ss of stringSetsFor(n).slice(0, 3)) {
      try { cands.push(...chordVoicings({ root: r, quality, voicing, stringSet: ss, inversion: 'all' })); } catch (e) { /* */ }
    }
  }
  if (!cands.length) return null;
  return cands.reduce((a, b) => (Math.abs(avgFret(a) - target) <= Math.abs(avgFret(b) - target) ? a : b));
}

export { noteName };
