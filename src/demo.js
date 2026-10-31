// Compile visual/demo specs into diagrams + timed events (for "Watch it").
import * as T from './theory.js';
import * as F from './fretboard.js';
import { fretboardSVG, dotsFrom, windowFor, rhythmHTML, rhythmSlots, md, esc } from './render.js';
import { slotBeat as rSlotBeat, isCompas } from './rhythm.js';
import { transposeExample, gripPlacement, chordScaleFrom, cycleFrom, keyShift } from './tg.js';
import { transposeSymbol } from './tgchords.js';

export function asRoot(x) {
  if (!x) return T.parseNote('C');
  if (typeof x === 'object') return x.tonic || x;
  try { return T.parseNote(x); } catch (e) { return T.parseKey(x).tonic; }
}
export function asKey(x) {
  if (!x) return T.parseKey('C');
  if (typeof x === 'object' && x.tonic) return x;
  return T.parseKey(x);
}
const key = (n) => `${n.string}:${n.fret}`;

// ---------- melody ----------
// Degrees are major-relative (like roman numerals): in minor write b3, b6, b7 explicitly.
// Tokens: 1..7 with b/#, ' = octave up, , = octave down, _ = half the length; "-" holds one more beat, "-_" half a beat; "." rest.
export function parseMelody(str, root, scaleId = 'major') {
  const r = asRoot(root);
  const semis = T.getScale('major').ivs.map(T.intervalSemis);
  const bars = String(str).split('|').map((b) => b.trim()).filter(Boolean);
  const out = [];
  let beat = 0;
  const barStarts = [];
  for (const bar of bars) {
    barStarts.push(beat);
    for (const tok of bar.split(/\s+/).filter(Boolean)) {
      let m = /^(-+)(_*)$/.exec(tok);
      if (m) { const d = m[1].length * 0.5 ** m[2].length; if (out.length) out[out.length - 1].dur += d; beat += d; continue; }
      m = /^(\.+)(_*)$/.exec(tok);
      if (m) { beat += m[1].length * 0.5 ** m[2].length; continue; }
      m = /^(bb|b|#|##)?([1-7])([',]*)(_*)(-*)$/.exec(tok);
      if (!m) continue;
      const deg = Number(m[2]);
      let s = semis[(deg - 1) % 7];
      s += { bb: -2, b: -1, '#': 1, '##': 2 }[m[1]] || 0;
      for (const c of m[3]) s += c === "'" ? 12 : -12;
      let d = m[4] ? 0.5 ** m[4].length : 1;
      d += m[5].length;
      out.push({ s, beat, dur: d, deg: (m[1] || '') + deg + m[3] });
      beat += d;
    }
  }
  // register: tonic in octave 4, shifted to fit 55..81
  let base = 60 + T.notePc(r);
  if (base > 66) base -= 12;
  const lo = Math.min(...out.map((n) => n.s)), hi = Math.max(...out.map((n) => n.s));
  while (base + hi > 81) base -= 12;
  while (base + lo < 52) base += 12;
  return { notes: out.map((n) => ({ ...n, midi: base + n.s })), barStarts, length: beat };
}
export function placeMelody(midis, prefer = 5) {
  // try a single 5-fret position first
  let bestLo = null;
  for (const lo of [prefer, 4, 3, 2, 5, 6, 7, 1, 8, 9, 0, 10, 12]) {
    if (midis.every((m) => [1, 2, 3, 4, 5, 6].some((s) => { const f = m - F.OPEN[s]; return f >= lo && f <= lo + 4; }))) { bestLo = lo; break; }
  }
  let prevF = bestLo ?? prefer;
  return midis.map((m0) => {
    let m = m0;
    while (m < F.OPEN[6]) m += 12;
    while (m > F.OPEN[1] + F.MAX_FRET) m -= 12;
    let best = null;
    for (const s of [1, 2, 3, 4, 5, 6]) {
      const f = m - F.OPEN[s];
      if (f < 0 || f > F.MAX_FRET) continue;
      const inWin = bestLo != null && f >= bestLo && f <= bestLo + 4;
      const cost = inWin ? Math.abs(f - prevF) * 0.1 : 10 + Math.abs(f - prevF);
      if (!best || cost < best.cost) best = { string: s, fret: f, midi: m, cost };
    }
    prevF = best.fret;
    return best;
  });
}

// ---------- main compiler ----------
// returns { html (static diagrams), frames:[{dots, lo, hi, caption}], events:[{beat, dur, kind, notes, frame, hl:[keys], label}], lo, hi, rhythm? }
export function compile(spec, opts = {}) {
  if (!spec) return null;
  if (Array.isArray(spec)) return combine(spec.map((s) => compile(s, opts)).filter(Boolean));
  const fn = COMPILERS[spec.type];
  if (!fn) throw new Error(`Unknown visual type "${spec.type}"`);
  const out = fn(spec, opts);
  out.title = spec.title || out.title || '';
  return out;
}
function combine(list) {
  let beat = 0, frameBase = 0;
  const frames = [], events = [];
  for (const c of list) {
    frames.push(...c.frames);
    for (const e of c.events) events.push({ ...e, beat: e.beat + beat, frame: e.frame + frameBase });
    beat += c.length || Math.max(0, ...c.events.map((e) => e.beat + (e.dur || 1))) + 1;
    frameBase += c.frames.length;
  }
  const lo = Math.min(...frames.map((f) => f.lo)), hi = Math.max(...frames.map((f) => f.hi));
  return { html: list.map((c) => (c.title ? `<h4>${esc(c.title)}</h4>` : '') + c.html).join(''), frames, events, length: beat, lo, hi, rhythm: list.find((c) => c.rhythm)?.rhythm, beatsPerBar: list.find((c) => c.beatsPerBar)?.beatsPerBar, clickAccents: list.find((c) => c.clickAccents)?.clickAccents, perFrame: list.some((c) => c.perFrame) || hi - lo > 11 };
}

function scaleLike(spec) {
  const root = asRoot(spec.root ?? spec.key);
  const s = { ...spec, root };
  if (spec.scale === 'minor') s.scale = 'aeolian';
  let notes = F.regionNotes(s);
  const labels = spec.labels || 'interval';
  let path;
  let demoNotes = notes;
  if (spec.region && spec.region.neck) {
    const sub = s.quality || s.tones ? { caged: 'E' } : (T.getScale(s.scale).ivs.length <= 6 ? { box: 1 } : { nps3: 1 });
    demoNotes = F.regionNotes({ ...s, region: sub });
  }
  if (spec.sequence) path = F.applySequence(demoNotes, spec.sequence);
  else path = F.orderPath(demoNotes, spec.path || 'up-and-down', spec.fromRoot);
  const bpn = spec.beatsPerNote ?? (spec.sequence ? 0.5 : 1);
  const w = windowFor(notes);
  const name = spec.quality ? T.chordSymbol(root, spec.quality) + ' arpeggio' : spec.tones ? `Arpeggio (${spec.tones.map(T.prettyIv).join(' ')})` : `${T.noteName(root, true)} ${T.getScale(s.scale).name}`;
  // caption = what is being played; the big readout under the neck shows each note's interval
  const frame = { dots: dotsFrom(notes, labels), lo: w.lo, hi: Math.min(w.hi, 17), caption: spec.title || (name + regionCaption(spec.region)) };
  const events = path.map((n, i) => ({ beat: i * bpn, dur: bpn, kind: 'note', notes: [n.midi], frame: 0, hl: [key(n)], iv: lblOf(n, labels) }));
  return {
    html: fretboardSVG({ ...frame, caption: name + regionCaption(spec.region) }),
    frames: [frame], events, length: path.length * bpn, lo: frame.lo, hi: frame.hi, title: '', name,
  };
}
const lblOf = (n, labels) => (labels === 'note' ? T.noteName(n.note, true) : T.prettyIv(n.iv));
function regionCaption(r) {
  if (!r) return '';
  if (r.caged) return ` — ${r.caged} shape`;
  if (r.nps3) return ` — 3nps position ${r.nps3}`;
  if (r.box) return ` — box ${r.box}`;
  if (r.position != null) return ` — position ${r.position}`;
  if (r.string) return ` — string ${r.string}`;
  if (r.strings) return ` — strings ${r.strings.join('-')}`;
  if (r.connect) return ` — ${r.connect.join(' → ')}`;
  if (r.frets) return ` — frets ${r.frets[0]}–${r.frets[1]}`;
  return ' — whole neck';
}

function voicingEvents(placements, captions, opts = {}) {
  const frames = [];
  const events = [];
  const all = placements.filter(Boolean).flatMap((p) => p.notes);
  const w = windowFor(all, 1);
  let beat = 0;
  const bpc = opts.beatsPerChord ?? 2;
  placements.forEach((p, i) => {
    if (!p) return;
    const fi = frames.length;
    const pw = windowFor(p.notes, 1);
    frames.push({ dots: dotsFrom(p.notes, opts.labels || 'interval'), lo: pw.lo, hi: Math.min(17, Math.max(pw.hi, pw.lo + 5)), caption: captions[i] });
    const mids = p.notes.map((n) => n.midi).sort((a, b) => a - b);
    events.push({ beat, dur: bpc, kind: 'strum', notes: mids, frame: fi, hl: p.notes.map(key), label: captions[i], hold: true });
    beat += bpc;
    if (opts.arpeggiate !== false) {
      const asc = [...p.notes].sort((a, b) => a.midi - b.midi);
      asc.forEach((n, k) => events.push({ beat: beat + k * 0.5, dur: 0.5, kind: 'note', notes: [n.midi], frame: fi, hl: [key(n)], label: captions[i] }));
      beat += asc.length * 0.5 + 0.5;
    }
  });
  const html = '<div class="diagrams">' + placements.map((p, i) => {
    if (!p) return `<div class="nodiag">${esc(captions[i])}: not playable on this string set</div>`;
    const ww = windowFor(p.notes, 1);
    return fretboardSVG({ dots: dotsFrom(p.notes, opts.labels || 'interval'), lo: ww.lo, hi: Math.min(ww.lo + 5, 17), caption: esc(captions[i]), compact: true });
  }).join('') + '</div>';
  return { html, frames, events, length: beat, lo: w.lo, hi: w.hi, perFrame: w.hi - w.lo > 11 };
}

const COMPILERS = {
  scale: scaleLike,
  arpeggio: scaleLike,

  voicings(spec) {
    const root = asRoot(spec.root ?? spec.key);
    const vs = F.chordVoicings({ ...spec, root });
    if (!vs.length) throw new Error(`No playable voicing for ${T.chordSymbol(root, spec.quality || 'maj')} ${spec.voicing} on ${spec.stringSet}`);
    const sym = T.chordSymbol(root, spec.quality || 'maj');
    const caps = vs.map((v) => `${sym} · ${v.label}` + (spec.stringSet === 'auto' || !spec.stringSet ? ` · strings ${v.stringSet.join('')}` : ''));
    const out = voicingEvents(vs, caps, { beatsPerChord: spec.beatsPerChord, labels: spec.labels, arpeggiate: spec.arpeggiate });
    out.name = `${sym} ${spec.voicing || ''}`;
    return out;
  },

  chordScale(spec) {
    const root = asRoot(spec.root ?? spec.key);
    const items = F.chordScale({ ...spec, root, scale: spec.scale === 'minor' ? 'aeolian' : spec.scale, stringSet: spec.stringSet === 'auto' ? undefined : spec.stringSet });
    const list = spec.path === 'descending' ? [...items].reverse() : items;
    const caps = list.map((it) => `${it.roman} · ${it.quality ? T.chordSymbol(it.root, it.quality) : T.noteName(it.root, true) + ' (' + it.ivs.join(' ') + ')'}`);
    const out = voicingEvents(list.map((i) => i.placement), caps, { beatsPerChord: spec.beatsPerChord ?? 1, labels: spec.labels, arpeggiate: spec.arpeggiate ?? false });
    out.name = `${T.noteName(root, true)} ${T.getScale(spec.scale === 'minor' ? 'aeolian' : spec.scale).name} chord scale`;
    return out;
  },

  progression(spec) { return progressionCompile(spec); },

  compare(spec) {
    const parts = (spec.options || []).map((o, i) => {
      const letter = 'ABCDEFG'[i];
      let chart = spec.chart;
      if (o.token && spec.target) chart = chart.split(/(\s+|\|)/).map((t) => (t === spec.target ? o.token : t)).join('');
      const scales = o.scale && spec.target ? { [spec.target]: o.from ? { scale: o.scale, from: o.from } : o.scale } : {};
      const c = progressionCompile({ ...spec, chart, scales, voiceLead: true, runs: true });
      const nm = o.label || (o.scale ? (o.from && o.from !== '1' ? `${T.getScale(o.scale).name} from the ${o.from}` : T.getScale(o.scale).name) : o.token);
      c.title = `${letter}: ${nm}`;
      c.frames.forEach((f) => { f.caption = `${letter}: ${nm} — ${f.caption}`; });
      return c;
    });
    const comb = combine(parts);
    comb.html = (spec.explain ? `<div class="md">${md(spec.explain)}</div>` : '') + comb.html;
    return comb;
  },

  rhythm(spec) {
    const { beats, grid, slots, isPick } = rhythmSlots(spec);
    let grip = null;
    if (spec.chord) {
      const r = asRoot(spec.chord.root ?? spec.chord.key);
      grip = F.gripFor(r, spec.chord.quality || 'maj', spec.chord.fret ?? 3);
      // fuller strum: add a bass note below the grip when possible
    }
    const gripMidis = grip ? grip.notes.map((n) => n.midi).sort((a, b) => a - b) : [40, 45, 50, 55, 59, 64];
    const byString = {};
    if (grip) for (const n of grip.notes) byString[n.string] = n.midi;
    const stringMidi = (s) => byString[s] ?? F.OPEN[s];
    const events = [];
    const slotBeat = (i) => rSlotBeat(i, grid, spec.swing);
    const accents = new Set(spec.accents || []);
    slots.forEach((tok, i) => {
      const beat = slotBeat(i);
      const dur = slotBeat(i + 1) - beat;
      // clear dynamics: accents loud, normal strokes medium, ghosts quiet
      const vel = accents.has(i) ? 1 : (accents.size ? 0.55 : 0.75);
      const base = { beat, dur, slot: i, frame: 0, hl: [] };
      if (isPick) {
        if (tok === '-' || tok === '.') { events.push({ ...base, kind: 'rest' }); return; }
        const strs = tok.split('+').map(Number).filter((x) => x >= 1 && x <= 6);
        events.push({ ...base, kind: 'note', notes: strs.map(stringMidi), vel, hl: strs.map((s) => `${s}:${(stringMidi(s) - F.OPEN[s])}`) });
        return;
      }
      if (tok === 'D') events.push({ ...base, kind: 'strum', dir: 'D', notes: gripMidis, vel, hl: grip ? grip.notes.map(key) : [] });
      else if (tok === 'U') events.push({ ...base, kind: 'strum', dir: 'U', notes: gripMidis.slice(-4), vel: vel * 0.85, hl: grip ? grip.notes.map(key) : [] });
      else if (tok === 'd' || tok === 'u') events.push({ ...base, kind: 'mute', dir: tok.toUpperCase(), notes: gripMidis, vel: accents.has(i) ? 0.8 : 0.4 });
      else if (tok === 'X') events.push({ ...base, kind: 'chuck', vel });
      else if (tok === 'T') events.push({ ...base, kind: 'note', notes: [gripMidis[0]], vel });
      else if (tok === 'R') { for (let k = 0; k < 4; k++) events.push({ ...base, beat: beat + k * (dur / 4), dur: dur / 4, kind: 'strum', dir: 'D', notes: gripMidis, vel: 0.55 + k * 0.1, spread: 0.006 }); }
      else events.push({ ...base, kind: 'rest' });
    });
    const frame = grip ? (() => { const w = windowFor(grip.notes, 1); return { dots: dotsFrom(grip.notes), lo: w.lo, hi: w.hi, caption: 'Hold: ' + T.chordSymbol(asRoot(spec.chord.root ?? spec.chord.key), spec.chord.quality || 'maj') }; })() : { dots: [], lo: 0, hi: 5, caption: isPick ? 'Open strings' : 'Muted strings' };
    const html = rhythmHTML(spec) + (grip ? fretboardSVG({ ...frame, compact: true, caption: esc(frame.caption) }) : '');
    // click track: beat 1 of the bar, plus the accented beats of a compás / one-slot-per-beat pattern
    const clickAccents = grid === 1 ? [...accents] : [0];
    return { html, frames: [frame], events, length: Math.ceil(slots.length / grid / beats) * beats, lo: frame.lo, hi: frame.hi, rhythm: spec, beatsPerBar: beats, clickAccents: spec.clickAccents || clickAccents, compas: isCompas(spec) };
  },

  fretboard(spec) {
    let notes = [];
    if (spec.tones) notes = F.regionNotes({ root: asRoot(spec.root ?? spec.key), tones: spec.tones, region: spec.region || { frets: [0, 12] } });
    else if (spec.notes) {
      const pcs = new Map(spec.notes.map((n) => [T.notePc(T.parseNote(n)), T.parseNote(n)]));
      const reg = spec.region || { frets: [0, 12] };
      const strings = reg.string ? [reg.string] : reg.strings || [6, 5, 4, 3, 2, 1];
      const [lo, hi] = reg.frets || (reg.string || reg.strings ? [0, 15] : [0, 12]);
      for (const s of strings) for (let f = lo; f <= hi; f++) { const pc = F.midiAt(s, f) % 12; if (pcs.has(pc)) notes.push({ string: s, fret: f, midi: F.midiAt(s, f), iv: T.noteName(pcs.get(pc), true), note: pcs.get(pc) }); }
    }
    const w = windowFor(notes);
    const frame = { dots: notes.map((n) => ({ string: n.string, fret: n.fret, label: spec.tones ? T.prettyIv(n.iv) : T.noteName(n.note, true), kind: n.iv === '1' ? 'root' : 'tone' })), lo: w.lo, hi: w.hi };
    const asc = [...notes].sort((a, b) => a.midi - b.midi);
    return { html: fretboardSVG(frame), frames: [frame], events: asc.map((n, i) => ({ beat: i, dur: 1, kind: 'note', notes: [n.midi], frame: 0, hl: [key(n)] })), length: asc.length, lo: w.lo, hi: w.hi };
  },

  chordMelody(spec) { return chordMelodyCompile(spec); },

  // exact book grips (Ted Greene), transposed from `from` to `key`; optional generation by his rules
  grips(spec) {
    const from = spec.from || spec.key || 'C';
    const to = spec.key || from;
    let chords = spec.chords || [];
    if (spec.generate === 'chordScale' && chords[0]) chords = chordScaleFrom(chords[0], from, spec.dir || 1, spec.steps || 7);
    if (spec.generate === 'cycle' && chords[1]) chords = cycleFrom(chords[0], chords[1], from, spec.dir || -1, spec.length || 8);
    const sh = keyShift(from, to);
    const tx = transposeExample(chords, from, to).map((c, i) => ({ ...c, means: chords[i].means && sh ? safeT(chords[i].means, sh) : chords[i].means }));
    // the neck view stops at fret 17: grips above it drop an octave
    tx.forEach((c) => { const v = c.frets.filter((x) => x != null); if (Math.max(...v) > 17 && Math.min(...v) >= 12) c.frets = c.frets.map((x) => (x == null ? null : x - 12)); });
    const pls = tx.map((c) => gripPlacement(c.means || c.name, c.frets));
    const romans = spec.romans || chords.map((c) => c.roman || '');
    const caps = tx.map((c, i) => `${T.pretty(c.name)}${c.means && c.means !== c.name ? ` (= ${T.pretty(c.means)})` : ''}${romans[i] ? ` · ${T.prettyRoman ? T.prettyRoman(romans[i]) : romans[i]}` : ''}`);
    const out = voicingEvents(pls, caps, { beatsPerChord: spec.beatsPerChord ?? 2, labels: spec.labels, arpeggiate: spec.arpeggiate ?? false });
    out.chords = tx;
    out.name = spec.title || '';
    return out;
  },

  text(spec) { return { html: `<div class="md">${md(spec.body)}</div>`, frames: [], events: [], length: 0, lo: 0, hi: 12 }; },
};

const safeT = (n, s) => { try { return transposeSymbol(n, s); } catch (e) { return n; } };

// ---------- progressions ----------
export function chartChords(spec) {
  const k = spec.key ? asKey(spec.key) : null;
  const bars = T.parseChart(spec.chart, k ? k.tonic : null);
  const bpb = spec.beatsPerBar || Number(String(spec.meter || '4/4').split('/')[0]) || 4;
  const chords = [];
  bars.forEach((bar, bi) => {
    const each = bpb / bar.length;
    bar.forEach((c, ci) => {
      const prev = chords[chords.length - 1];
      // a repeated token inside a bar means "hold it longer", not "strike again"
      if (ci > 0 && prev && prev.bar === bi && prev.token === c.token) { prev.dur += each; return; }
      chords.push({ ...c, bar: bi, beat: bi * bpb + ci * each, dur: each, tones: c.quality === '7alt' ? ['3', 'b7', '#9', 'b13'] : undefined });
    });
  });
  return { chords, bars, bpb, key: k };
}
export function chordLabel(c) {
  let s = T.chordSymbol(c.root, c.quality);
  if (c.bass) s += '/' + T.noteName(c.bass, true);
  return s;
}
function progressionCompile(spec) {
  const { chords, bpb } = chartChords(spec);
  const pls = F.voiceLead(chords, { voicing: spec.voicing || (chords.some((c) => T.getChord(c.quality).ivs.length >= 4) ? 'drop2' : 'close'), stringSet: spec.stringSet, voiceLead: spec.voiceLead !== false, startFret: spec.startFret });
  const frames = [];
  const events = [];
  const all = pls.filter(Boolean).flatMap((p) => p.notes);
  const w = windowFor(all, 1);
  let hiW = w.hi, loW = w.lo;
  chords.forEach((c, i) => {
    const p = pls[i];
    const label = chordLabel(c) + (c.roman ? `  (${T.prettyRoman(c.roman)})` : '');
    const sEntry = spec.scales && (spec.scales[c.token] || spec.scales[c.roman]);
    const scaleId = sEntry && typeof sEntry === 'object' ? sEntry.scale : sEntry;
    const scaleRoot = sEntry && typeof sEntry === 'object' && sEntry.from ? T.transpose(c.root, sEntry.from) : c.root;
    let scaleNotes = [];
    if (scaleId && p) {
      const lo = Math.max(0, p.minFret - 2), hi = Math.min(17, p.maxFret + 2);
      scaleNotes = F.regionNotes({ root: scaleRoot, scale: scaleId, region: { frets: [lo, hi] } });
      // one note per pitch (the fret window can contain the same pitch on two strings)
      const seenMidi = new Set();
      scaleNotes = scaleNotes.filter((n) => (seenMidi.has(n.midi) ? false : seenMidi.add(n.midi)));
      loW = Math.min(loW, lo); hiW = Math.max(hiW, hi);
    }
    const fi = frames.length;
    const chordDots = p ? dotsFrom(p.notes) : [];
    const ghost = scaleNotes.filter((n) => !p || !p.notes.some((q) => q.string === n.string && q.fret === n.fret)).map((n) => ({ string: n.string, fret: n.fret, label: T.prettyIv(n.iv), kind: n.iv === '1' ? 'root ghost' : 'ghost' }));
    frames.push({ dots: chordDots.concat(ghost), lo: 0, hi: 0, caption: label + (scaleId ? ` — ${T.noteName(scaleRoot, true)} ${T.getScale(scaleId).name}` : '') });
    if (!p) { events.push({ beat: c.beat, dur: c.dur, kind: 'rest', frame: fi, hl: [], label, unvoiced: true }); return; }
    const mids = p.notes.map((n) => n.midi).sort((a, b) => a - b);
    if (spec.walk === 'arpeggio') {
      const asc = [...p.notes].sort((a, b) => a.midi - b.midi);
      const seq = asc.concat(asc.slice(1, -1).reverse());
      const step = c.dur / Math.max(seq.length, 1);
      seq.forEach((n, k) => events.push({ beat: c.beat + k * step, dur: step, kind: 'note', notes: [n.midi], frame: fi, hl: [key(n)], label }));
    } else if (scaleId && (spec.runs || spec.scales)) {
      events.push({ beat: c.beat, dur: c.dur, kind: 'strum', notes: mids, frame: fi, hl: p.notes.map(key), label, vel: 0.55, hold: true });
      // scale run in 8ths starting from the chord's lowest scale note in window
      const run = F.orderPath(scaleNotes, 'ascending');
      const n8 = Math.floor(c.dur * 2);
      const startIdx = Math.max(0, run.findIndex((n) => n.iv === '3' || n.iv === 'b3' || n.iv === '1'));
      for (let k = 0; k < n8 && run.length; k++) {
        const n = run[(startIdx + k) % run.length];
        events.push({ beat: c.beat + k * 0.5, dur: 0.5, kind: 'note', notes: [n.midi + 12 * (n.midi < mids[mids.length - 1] - 12 ? 1 : 0)], frame: fi, hl: [key(n)], label, vel: 0.85 });
      }
    } else {
      const strumPat = spec.strum ? String(spec.strum).replace(/\s|\|/g, '') : null;
      if (strumPat) {
        const slotsPerBar = strumPat.length;
        const per = bpb / slotsPerBar;
        for (let k = 0; k < slotsPerBar; k++) {
          const b = c.beat + k * per;
          if (b >= c.beat + c.dur - 1e-6) break;
          const t = strumPat[k];
          if (t === 'D' || t === 'U') events.push({ beat: b, dur: per, kind: 'strum', dir: t, notes: t === 'U' ? mids.slice(-3) : mids, frame: fi, hl: p.notes.map(key), label });
          else if (t === 'X') events.push({ beat: b, dur: per, kind: 'chuck', frame: fi, hl: [], label });
        }
      } else events.push({ beat: c.beat, dur: c.dur, kind: 'strum', notes: mids, frame: fi, hl: p.notes.map(key), label, hold: true });
    }
  });
  frames.forEach((f) => { f.lo = loW; f.hi = Math.max(hiW, loW + 4); });
  // static: chart + one diagram per distinct chord
  const seen = new Set();
  const diags = [];
  chords.forEach((c, i) => {
    const k2 = chordLabel(c) + (pls[i] ? pls[i].notes.map(key).join() : '');
    if (seen.has(k2) || !pls[i]) return;
    seen.add(k2);
    const ww = windowFor(pls[i].notes, 1);
    diags.push(fretboardSVG({ dots: frames[i].dots, lo: ww.lo, hi: Math.min(Math.max(ww.hi, ww.lo + 4), 17), caption: esc(frames[i].caption), compact: true }));
  });
  const length = Math.max(...chords.map((c) => c.beat + c.dur));
  return { html: chartHTML(chords, bpb) + `<div class="diagrams">${diags.join('')}</div>`, frames, events, length, lo: loW, hi: hiW, chords };
}
export function chartHTML(chords, bpb = 4) {
  const bars = [];
  for (const c of chords) { (bars[c.bar] = bars[c.bar] || []).push(c); }
  return '<div class="chart">' + bars.map((b, i) => `<div class="cbar" data-bar="${i}">${(b || []).map((c) => `<span class="cchord"><b>${esc(chordLabel(c))}</b>${c.roman ? `<small>${esc(T.prettyRoman(c.roman))}</small>` : ''}</span>`).join('')}</div>`).join('') + '</div>';
}

// ---------- chord melody ----------
const CM_SETS = {
  'triad-top': [[3, 2, 1], [4, 3, 2], [2, 1, 0]],
  'drop2-top': [[4, 3, 2, 1], [5, 4, 3, 2]],
  'drop3-top': [[5, 3, 2, 1], [6, 4, 3, 2]],
};
function chordMelodyCompile(spec) {
  const k = asKey(spec.key);
  const scale = spec.scale || (k.minor ? 'aeolian' : 'major');
  const mel = parseMelody(spec.melody, k.tonic, scale);
  // chord melody sits on the top strings: lift the line if it lies low
  const avg = mel.notes.reduce((a, n) => a + n.midi, 0) / Math.max(1, mel.notes.length);
  if (avg < 62 && Math.max(...mel.notes.map((n) => n.midi)) + 12 <= 84) mel.notes.forEach((n) => { n.midi += 12; });
  const { chords } = spec.chart ? chartChords({ ...spec, key: k.short }) : { chords: [] };
  const style = spec.style || 'drop2-top';
  const placed = placeMelody(mel.notes.map((n) => n.midi), 7);
  const events = [];
  const shown = [];
  // chord at each beat
  const chordAt = (beat) => [...chords].reverse().find((c) => c.beat <= beat + 1e-6);
  const changeBeats = new Set(chords.map((c) => c.beat));
  mel.notes.forEach((n, i) => {
    const c = chordAt(n.beat);
    const isChange = c && (changeBeats.has(n.beat) || (i === 0) || (mel.notes[i - 1] && chordAt(mel.notes[i - 1].beat) !== c));
    let notes = [placed[i]];
    if (c && isChange && style !== 'melody-only') {
      const v = voiceUnder(c, n.midi, style);
      if (v) notes = v;
    }
    const mids = notes.map((x) => x.midi).sort((a, b) => a - b);
    events.push({ beat: n.beat, dur: n.dur, kind: notes.length > 1 ? 'strum' : 'note', notes: mids, frame: 0, hl: notes.map(key), label: (c ? chordLabel(c) + ' · ' : '') + 'melody ' + T.prettyIv(n.deg), hold: true });
    shown.push(...notes);
  });
  const dedup = [...new Map(shown.map((x) => [key(x), x])).values()];
  const w = windowFor(dedup, 1);
  const frame = { dots: [], lo: w.lo, hi: w.hi, caption: style };
  events.forEach((e) => { e.frame = 0; });
  // frame dots are built live from hl in the player (empty base)
  frame.live = true;
  const html = (chords.length ? chartHTML(chords) : '') + `<p class="muted small">Melody on top · style: ${esc(style)}. Tap “Watch it” to see each grip.</p>`;
  return { html, frames: [frame], events, length: mel.length, lo: w.lo, hi: w.hi, liveDots: true };
}
function voiceUnder(c, melodyMidi, style) {
  const ch = T.getChord(c.quality);
  const pcMel = melodyMidi % 12;
  const tonesPc = ch.ivs.map((iv) => (T.notePc(c.root) + T.intervalSemis(F.simpleIv(iv))) % 12);
  if (style === 'shell-under' || !tonesPc.includes(pcMel)) {
    // shell (root + 3rd/7th) under the melody note
    const out = [];
    const melS = placeMelody([melodyMidi], 5)[0];
    out.push(melS);
    for (const vs of [[6, 4, 3], [5, 4, 3]]) {
      try {
        const shells = F.chordVoicings({ root: c.root, quality: ch.ivs.length >= 4 ? c.quality : c.quality, voicing: ch.ivs.length >= 4 ? 'shell' : 'close', stringSet: ch.ivs.length >= 4 ? vs : [vs[0], vs[1], vs[2]], inversion: 0 })
          .filter((p) => Math.max(...p.notes.map((x) => x.midi)) < melodyMidi && p.notes.every((x) => x.string > melS.string));
        if (shells.length) {
          const best = shells.reduce((a, b) => (Math.abs(a.minFret - melS.fret) < Math.abs(b.minFret - melS.fret) ? a : b));
          return best.notes.concat([melS]);
        }
      } catch (e) { /* */ }
    }
    // just a bass note
    const bassPc = T.notePc(c.root);
    for (const s of [6, 5]) {
      const f = ((bassPc - F.OPEN[s]) % 12 + 12) % 12;
      for (const ff of [f, f + 12]) if (Math.abs(ff - melS.fret) <= 4 && melS.string < s) return [{ string: s, fret: ff, midi: F.OPEN[s] + ff }, melS];
    }
    return out;
  }
  const triadOnly = style === 'triad-top' || ch.ivs.length < 4;
  const tries = triadOnly
    ? [['close', [3, 2, 1]], ['close', [4, 3, 2]], ['spread', [4, 2, 1]], ['spread', [5, 3, 2]]]
    : (CM_SETS[style] || CM_SETS['drop2-top']).map((ss) => [style === 'drop3-top' ? 'drop3' : 'drop2', ss]);
  const q = triadOnly ? triadOf(c.quality) : c.quality;
  for (const [voicing, ss] of tries) {
    try {
      const vs = F.chordVoicings({ root: c.root, quality: q, voicing, stringSet: ss, inversion: 'all' });
      const hit = vs.filter((p) => Math.max(...p.notes.map((x) => x.midi)) === melodyMidi);
      if (hit.length) return hit[0].notes;
    } catch (e) { /* */ }
  }
  return null;
}
function triadOf(q) {
  const ivs = T.getChord(q).ivs;
  if (ivs.includes('b3') && ivs.includes('b5')) return 'dim';
  if (ivs.includes('b3')) return 'min';
  if (ivs.includes('#5')) return 'aug';
  if (ivs.includes('4') && !ivs.includes('3')) return 'sus4';
  return 'maj';
}
