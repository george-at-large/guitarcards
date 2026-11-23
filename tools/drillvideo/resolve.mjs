// Turn the shape requests in a drill video into notes on the neck, using the Guitar Cards engine.
// build.py pipes {"shapes": [...]} in and reads {"results": [...]} back, one result per request, in order.
//
// Requests (every note comes back as {string, fret, midi, iv, name}; iv is the interval from the chord's root):
//   {kind: 'caged', root, form, quality, octave}   a CAGED form of a triad, anchored on its root string
//   {kind: 'roots', root, frets: [lo, hi], strings, label}   every place a note lives inside a span of frets
//   {kind: 'voicing', root, quality, voicing, strings, bass, near}   one inversion, the placement nearest fret `near`
//   {kind: 'ladder', root, quality, voicing, strings}   every placement on the string set, low to high
//   {kind: 'prog', key, chart, voicing, strings, startFret}   a voice-led progression, one placement per chord
//   {kind: 'morph', root, strings, voicing, count, chain}   voicings morphed in place one note at a time; `chain` is
//       [[startQuality], [quality, fromIv, toIv, how], …] (default maj7 → 7 → m7 → m7♭5 → °7)
//   {kind: 'run', root, scale | quality | tones, region, path, sequence}   a scale or arpeggio in a region, in playing
//       order (`path`), plus all its notes there (`notes`)
//   {kind: 'dyads', root, scale, strings: [low, high], step}   the scale harmonised in one diatonic interval (step 2 =
//       3rds, 5 = 6ths, 9 = 10ths, 7 = octaves) on a pair of strings, up the whole neck
//   {kind: 'line', root, pitches, strings | each, near, labels}   named pitches (e.g. 'A2') placed on the strings
//       given, each near the one before (or `each`: one string per pitch); for bass lines and other written lines
//   {kind: 'grip', root, quality, frets: [[string, fret], …]}   a written chord grip
//   {kind: 'loop', chart, keys, voicing, strings, guide, startFret}   a progression voice-led through a list of keys
//       (`guide: true`: just the 3rd and 7th)
//   {kind: 'areaProg', key, chart, strings, form, voicing}   a progression voice-led inside one CAGED area of the key
//   {kind: 'demo', spec | card + params}   an engine demo (rhythm, chord melody, progression…) compiled as the app plays
//       it: frames, timed events and, for rhythms, the grid
//   {kind: 'cagedTable', keys, form, minFret}      where a form's root sits in each key
//   {kind: 'areasTable', keys, forms}              the I chord's root (string: fret) in each form, per key
//   {kind: 'climbTable', keys}                     each key's lowest CAGED form with no open strings
//   {kind: 'ladderTable', keys, quality, voicing, strings | sets, lowFret}   each key's lowest voicing on a string set
globalThis.window = globalThis;
globalThis.localStorage = { getItem: () => null, setItem: () => {} };
const root = new URL('../../', import.meta.url).pathname;
const T = await import(root + 'src/theory.js');
const F = await import(root + 'src/fretboard.js');
const { chartChords, chordLabel, compile } = await import(root + 'src/demo.js');
const R = await import(root + 'src/rhythm.js');

const OPEN = { 6: 40, 5: 45, 4: 50, 3: 55, 2: 59, 1: 64 };
const SEMIS = { 1: 0, b2: 1, b9: 1, 2: 2, 9: 2, '#9': 3, b3: 3, 3: 4, 4: 5, 11: 5, '#4': 6, '#11': 6, b5: 6, 5: 7, '#5': 8,
  b6: 8, b13: 8, 6: 9, 13: 9, bb7: 9, b7: 10, 7: 11 };
const IV_OF = ['1', 'b2', '2', 'b3', '3', '4', 'b5', '5', 'b6', '6', 'b7', '7'];
const name = (n) => T.noteName(n, true);
const note = (s, f, iv, nm) => ({ string: s, fret: f, midi: OPEN[s] + f, iv, name: nm });
const sym = (r, q) => T.chordSymbol(T.parseNote(r), q);

// the five open shapes as frets relative to the root on the anchor string (strings 6..1, null = not played),
// and which chord tone each string holds
const FORMS = {
  E: { anchor: 6, frets: [0, 2, 2, 1, 0, 0], tones: ['1', '5', '1', '3', '5', '1'], finger: 'index' },
  D: { anchor: 4, frets: [null, null, 0, 2, 3, 2], tones: [null, null, '1', '5', '1', '3'], finger: 'index' },
  C: { anchor: 5, frets: [null, 0, -1, -3, -2, -3], tones: [null, '1', '3', '5', '1', '3'], finger: 'ring or pinky' },
  A: { anchor: 5, frets: [null, 0, 2, 2, 2, 0], tones: [null, '1', '5', '1', '3', '5'], finger: 'index' },
  G: { anchor: 6, frets: [0, -1, -3, -3, -3, 0], tones: ['1', '3', '5', '1', '3', '1'], finger: 'ring or pinky' },
};
// a quality bends the major shape: each 3rd and 5th moves to the quality's own 3rd and 5th
const QUALITY = { maj: { 3: '3', 5: '5' }, min: { 3: 'b3', 5: '5' }, dim: { 3: 'b3', 5: 'b5' }, aug: { 3: '3', 5: '#5' } };

function caged({ root: r, form, quality = 'maj', octave = 0, minFret = 1 }) {
  const f = FORMS[form];
  const rn = T.parseNote(r);
  let rf = ((T.notePc(rn) - OPEN[f.anchor]) % 12 + 12) % 12;
  const lowest = () => Math.min(...f.frets.filter((x) => x !== null).map((x) => rf + x));
  while (lowest() < minFret) rf += 12;
  rf += 12 * octave;
  const notes = [];
  f.frets.forEach((off, i) => {
    if (off === null) return;
    const s = 6 - i;
    const base = f.tones[i];
    const iv = base === '1' ? '1' : QUALITY[quality][base];
    const fret = rf + off + (SEMIS[iv] - SEMIS[base]);
    notes.push(note(s, fret, iv, name(T.transpose(rn, iv))));
  });
  const frets = notes.map((n) => n.fret);
  return { notes, anchor: { string: f.anchor, fret: rf }, finger: f.finger, form, window: [Math.min(...frets), Math.max(...frets)], chord: sym(r, quality) };
}

function roots({ root: r, frets: [lo, hi], strings = [6, 5, 4, 3, 2, 1], label }) {
  const pc = T.notePc(T.parseNote(r));
  const out = [];
  for (const s of strings) for (let f = lo; f <= hi; f++) if ((OPEN[s] + f) % 12 === pc) out.push(note(s, f, '1', name(T.parseNote(r))));
  return { notes: out, chord: label || name(T.parseNote(r)), window: [lo, hi] };
}

const placed = (p, r, q) => ({
  notes: p.notes.map((n) => note(n.string, n.fret, n.iv, name(n.note))),
  bass: p.bassIv, label: p.label, chord: sym(r, q), window: [p.minFret, p.maxFret],
});

function placements({ root: r, quality, voicing = 'drop2', strings }) {
  return F.chordVoicings({ root: T.parseNote(r), quality, voicing, stringSet: strings, inversion: 'all' })
    .sort((a, b) => a.notes[0].fret - b.notes[0].fret || a.minFret - b.minFret);
}

function voicing(spec) {
  let ps = placements(spec);
  if (spec.bass) ps = ps.filter((p) => F.simpleIv(p.bassIv) === F.simpleIv(String(spec.bass)));
  if (!ps.length) throw new Error('no voicing for ' + JSON.stringify(spec));
  const near = spec.near ?? 5;
  const avg = (p) => p.notes.reduce((s, n) => s + n.fret, 0) / p.notes.length;
  const best = ps.reduce((a, b) => (Math.abs(avg(a) - near) <= Math.abs(avg(b) - near) ? a : b));
  return placed(best, spec.root, spec.quality);
}

function ladder(spec) {
  return { steps: placements(spec).map((p) => placed(p, spec.root, spec.quality)) };
}

function prog({ key, chart, voicing: v = 'drop2', strings, startFret = 5 }) {
  const { chords } = chartChords({ key, chart });
  const pls = F.voiceLead(chords, { voicing: v, stringSet: strings, voiceLead: true, startFret });
  return {
    steps: chords.map((c, i) => ({
      chord: chordLabel(c), roman: c.token.split(':')[0],
      notes: pls[i].notes.map((n) => note(n.string, n.fret, n.iv, name(n.note))),
      window: [pls[i].minFret, pls[i].maxFret],
    })),
  };
}

function cagedTable({ keys, form, minFret = 2 }) {
  return { rows: keys.map((k) => { const c = caged({ root: k, form, minFret }); return { key: name(T.parseNote(k)), fret: c.anchor.fret, lo: c.anchor.fret - 1, hi: c.anchor.fret + 3 }; }) };
}

// each of the first `count` voicings above the nut morphed in place along a chain, one note moving each step
const CHAIN = [['maj7'], ['7', '7', 'b7', 'lower the 7th'], ['m7', '3', 'b3', 'lower the 3rd'], ['m7b5', '5', 'b5', 'lower the 5th'],
  ['dim7', 'b7', 'bb7', 'lower the 7th again']];
function morph({ root: r, strings, voicing: v = 'drop2', count = 4, chain = CHAIN }) {
  const rn = T.parseNote(r);
  const steps = [];
  const start = chain[0][0];
  placements({ root: r, quality: start, voicing: v, strings }).filter((p) => p.minFret >= 1).slice(0, count).forEach((p, k) => {
    let notes = p.notes.map((n) => note(n.string, n.fret, n.iv, name(n.note)));
    for (const [q, from, to, how, as] of chain) {
      let moved = null;
      let move = `start: ${sym(r, start)}`;
      if (from) {
        const old = notes.find((n) => n.iv === from);
        let d = SEMIS[to] - SEMIS[from];
        if (d > 6) d -= 12;
        if (d < -6) d += 12;
        moved = note(old.string, old.fret + d, to, name(T.transpose(rn, to)));
        notes = notes.map((n) => (n === old ? moved : n));
        move = `${how || (d < 0 ? 'lower' : 'raise')}: ${old.name} → ${moved.name}`;
      }
      // `as`: the chord now has another root (a °7 with one note lowered is a dominant 7th): rename it, relabel every note
      let shown = notes;
      if (as) {
        const p = T.parseNote(as);
        const pc = ([0, 2, 4, 5, 7, 9, 11][p.letter] + p.acc + 12) % 12;
        shown = notes.map((n) => ({ ...n, iv: IV_OF[(n.midi - pc + 120) % 12] }));
        if (moved) moved = shown.find((n) => n.string === moved.string);
      }
      const low = shown.reduce((a, b) => (a.midi < b.midi ? a : b));
      const frets = shown.map((n) => n.fret);
      steps.push({ chord: sym(as || r, q), notes: shown, bass: low.iv, move, moved, inversion: k, window: [Math.min(...frets), Math.max(...frets)] });
    }
  });
  return { steps };
}

// the five-form climb in each key starts with whichever form sits lowest without open strings
function climbTable({ keys }) {
  return {
    rows: keys.map((k) => {
      const first = Object.keys(FORMS).map((f) => caged({ root: k, form: f })).sort((a, b) => a.window[0] - b.window[0])[0];
      return { key: name(T.parseNote(k)), form: first.form, fret: first.anchor.fret, string: first.anchor.string };
    }),
  };
}

// where the I chord's root sits in each CAGED form, per key: at[i] = 'string s, fret f'
function areasTable({ keys, forms }) {
  return { rows: keys.map((k) => ({ key: name(T.parseNote(k)), at: forms.map((f) => { const c = caged({ root: k, form: f }); return `${c.anchor.string}: ${c.anchor.fret}`; }) })) };
}

// with `sets`, each row also has sets[i] = {bass, fret, bassNote} for each string set
function ladderTable(spec) {
  const lowest = (k, strings) => {
    const p = placements({ ...spec, root: k, strings }).filter((x) => x.minFret >= (spec.lowFret ?? 1))[0];
    const fret = p.notes[0].fret;
    return { bass: p.bassIv.replace(/b/g, '♭').replace(/#/g, '♯'), fret, at: fret ? `fret ${fret}` : 'open', bassNote: name(p.notes[0].note) };
  };
  return {
    rows: spec.keys.map((k) => ({
      key: name(T.parseNote(k)), chord: sym(k, spec.quality), ...(spec.strings ? lowest(k, spec.strings) : {}),
      sets: (spec.sets || []).map((ss) => lowest(k, ss)),
    })),
  };
}

const mapNote = (n) => note(n.string, n.fret, n.iv, name(n.note));
const windowOf = (notes) => { const fs = notes.map((n) => n.fret); return [Math.min(...fs), Math.max(...fs)]; };

function run({ root: r, scale, quality, tones, region, path = 'up', sequence, fromRoot }) {
  const spec = { root: T.parseNote(r), scale, quality, tones, region };
  const all = F.regionNotes(spec);
  const order = sequence ? F.applySequence(all, sequence) : F.orderPath(all, path, fromRoot);
  const title = quality ? sym(r, quality) : tones ? tones.join(' ') : `${name(T.parseNote(r))} ${T.getScale(scale).name}`;
  return { notes: all.map(mapNote), path: order.map(mapNote), chord: title, window: windowOf(all) };
}

function dyads({ root: r, scale = 'major', strings: [lo, hi], step, minFret = 0, maxFret = 17 }) {
  const rn = T.parseNote(r);
  const ivs = T.getScale(scale).ivs;
  const semis = ivs.map((iv) => SEMIS[F.simpleIv(iv)]);
  const steps = [];
  for (let f = minFret; f <= maxFret; f++) {
    const midi = OPEN[lo] + f;
    const idx = semis.indexOf(((midi - T.notePc(rn)) % 12 + 12) % 12);
    if (idx < 0) continue;
    let up = 0;
    for (let k = 0; k < step; k++) up += ((semis[(idx + k + 1) % semis.length] - semis[(idx + k) % semis.length]) + 12) % 12 || 12;
    const f2 = midi + up - OPEN[hi];
    if (f2 < minFret || f2 > maxFret) continue;
    const ivA = ivs[idx], ivB = ivs[(idx + step) % ivs.length];
    const a = note(lo, f, ivA, name(T.transpose(rn, F.simpleIv(ivA)))), b = note(hi, f2, ivB, name(T.transpose(rn, F.simpleIv(ivB))));
    steps.push({ notes: [a, b], chord: `${a.name} + ${b.name}`, bass: ivA, window: windowOf([a, b]) });
  }
  return { steps };
}

const toMidi = (p) => {
  const m = /^([A-Ga-g])([#b♯♭]*)(-?\d)$/.exec(p);
  const pc = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }[m[1].toUpperCase()] + [...m[2]].reduce((s, c) => s + (c === '#' || c === '♯' ? 1 : -1), 0);
  return 12 * (Number(m[3]) + 1) + pc;
};
function line({ root: r, pitches, strings = [6, 5, 4], each, near = 5, labels }) {
  const rpc = T.notePc(T.parseNote(r));
  let prev = near;
  const path = pitches.map((p, i) => {
    const midi = toMidi(p);
    const c = (each ? [each[i]] : strings).map((s) => ({ s, f: midi - OPEN[s] })).filter((x) => x.f >= 0 && x.f <= 17)
      .reduce((a, b) => (Math.abs(b.f - prev) < Math.abs(a.f - prev) ? b : a));
    prev = c.f;
    return note(c.s, c.f, labels ? labels[i] : IV_OF[((midi - rpc) % 12 + 12) % 12], p.replace(/-?\d$/, '').replace('#', '♯').replace(/(?<=[A-G])b/, '♭'));
  });
  return { notes: path, path, chord: name(T.parseNote(r)), window: windowOf(path) };
}

// a written grip: [[string, fret], …], labelled from the chord's root
function grip({ root: r, quality, frets }) {
  const rpc = T.notePc(T.parseNote(r));
  const notes = frets.map(([st, f]) => {
    const iv = IV_OF[((OPEN[st] + f - rpc) % 12 + 12) % 12];
    return note(st, f, iv === '2' ? '9' : iv === '6' && quality && /7/.test(quality) ? '13' : iv, name(T.noteFromPc((OPEN[st] + f) % 12)));
  });
  return { notes, chord: quality ? sym(r, quality) : name(T.parseNote(r)), window: windowOf(notes) };
}

function guideTones(q) {
  const ivs = T.getChord(q).ivs;
  return [ivs.find((x) => ['3', 'b3', '4'].includes(x)), ivs.find((x) => ['7', 'b7', 'bb7', '6'].includes(x))];
}
function loop({ chart, keys, voicing: v = 'drop2', strings, guide = false, startFret = 5 }) {
  const chords = [];
  keys.forEach((k, ki) => chartChords({ key: k, chart }).chords.forEach((c) => chords.push({ ...c, key: k, keyIndex: ki,
    tones: guide ? guideTones(c.quality) : c.tones })));
  const pls = F.voiceLead(chords, { voicing: v, stringSet: strings, voiceLead: true, startFret });
  return {
    steps: chords.map((c, i) => ({
      chord: chordLabel(c), roman: c.token.split(':')[0], key: name(T.parseNote(c.key)), keyIndex: c.keyIndex,
      notes: pls[i].notes.map(mapNote), window: [pls[i].minFret, pls[i].maxFret],
    })),
  };
}

// a progression voice-led without leaving one CAGED area of the key (the form's window, a fret either side)
function areaProg({ key, chart, strings, form, voicing: v = 'drop2', spread = 1 }) {
  const { chords } = chartChords({ key, chart });
  const w = F.cagedWindow(T.parseKey(key).tonic, form);
  const lo = Math.max(1, w.lo - spread), hi = w.hi + spread;
  const move = (a, b) => { const x = a.notes.map((n) => n.midi).sort((p, q) => p - q), y = b.notes.map((n) => n.midi).sort((p, q) => p - q); return x.reduce((s, m, i) => s + Math.abs(m - y[i]), 0); };
  let prev = null;
  const steps = chords.map((c) => {
    const all = F.chordVoicings({ root: c.root, quality: c.quality, voicing: v, stringSet: strings, inversion: 'all' });
    let cands = [];
    for (let k = 0; k <= 3 && !cands.length; k++) cands = all.filter((p) => p.minFret >= Math.max(0, lo - k) && p.maxFret <= hi + k);  // a fret wider if nothing fits
    if (!cands.length) throw new Error(`no ${c.token} voicing near frets ${lo}-${hi} on ${strings}`);
    const mid = (lo + hi) / 2, avg = (p) => p.notes.reduce((s, n) => s + n.fret, 0) / p.notes.length;
    const best = cands.reduce((a, b) => ((prev ? move(prev, a) - move(prev, b) : Math.abs(avg(a) - mid) - Math.abs(avg(b) - mid)) <= 0 ? a : b));
    prev = best;
    return { chord: chordLabel(c), roman: c.token.split(':')[0], bass: best.bassIv, notes: best.notes.map(mapNote), window: [best.minFret, best.maxFret] };
  });
  return { steps, area: [lo, hi] };
}

async function demo({ spec, card, params = {} }) {
  if (card) {
    const { loadLibrary } = await import(root + 'src/library.js');
    const { instantiate } = await import(root + 'src/cards.js');
    const lib = await loadLibrary(root + 'content/');
    spec = instantiate(lib.byId.get(card), undefined, params).demo;
  }
  return {
    parts: [spec].flat().map((sp) => {
      const c = compile(sp);
      const part = {
        title: sp.title || c.title || '', length: c.length,
        frames: c.frames.map((f) => ({ caption: f.caption || '', dots: f.dots.map((d) => ({ string: d.string, fret: d.fret, label: String(d.label ?? ''), kind: d.kind })) })),
        events: c.events.map((e) => ({ beat: e.beat, dur: e.dur, kind: e.kind, notes: e.notes || [], hl: e.hl || [], dir: e.dir, vel: e.vel, frame: e.frame, slot: e.slot, spread: e.spread })),
      };
      if (sp.type === 'rhythm') {
        const rs = R.rhythmSlots(sp);
        const n = Math.max(rs.slots.length, rs.perBar * rs.bars);
        part.rhythm = {
          grid: rs.grid, perBar: rs.perBar, isPick: rs.isPick, accents: sp.accents || [],
          slots: rs.slots, fingers: sp.fingers ? String(sp.fingers).replace(/\|/g, ' ').trim().split(/\s+/) : null,
          counts: R.countLabels(sp).slice(0, n), times: [...Array(n + 1).keys()].map((i) => R.slotBeat(i, rs.grid, sp.swing)),
        };
      }
      return part;
    }),
  };
}

const KINDS = { caged, roots, voicing, ladder, prog, morph, run, dyads, line, grip, loop, areaProg, demo, areasTable, cagedTable, climbTable, ladderTable };
let input = '';
for await (const chunk of process.stdin) input += chunk;
const { shapes } = JSON.parse(input);
const results = [];
for (const s of shapes) {
  const fn = KINDS[s.kind];
  if (!fn) throw new Error('unknown shape kind ' + s.kind);
  results.push(await fn(s));
}
process.stdout.write(JSON.stringify({ results }));
