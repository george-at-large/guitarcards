// Objective quizzes (theory + ear). Each generator returns a "Q" object consumed by the UI.
import * as T from './theory.js';
import * as F from './fretboard.js';
import * as A from './audio.js';
import { parseMelody, placeMelody, chartChords, chordLabel, asRoot } from './demo.js';
import { fill } from './cards.js';

const rnd = (a) => a[Math.floor(Math.random() * a.length)];
const shuffle = (a) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
const PC_NAMES = ['C', 'C♯/D♭', 'D', 'D♯/E♭', 'E', 'F', 'F♯/G♭', 'G', 'G♯/A♭', 'A', 'A♯/B♭', 'B'];
const nn = (n) => T.noteName(n, true);
const ivName = {
  '1': 'Unison', b2: 'Minor 2nd', '2': 'Major 2nd', b3: 'Minor 3rd', '3': 'Major 3rd', '4': 'Perfect 4th', '#4': 'Tritone (♯4)', b5: 'Tritone (♭5)',
  '5': 'Perfect 5th', '#5': 'Augmented 5th', b6: 'Minor 6th', '6': 'Major 6th', bb7: 'Diminished 7th', b7: 'Minor 7th', '7': 'Major 7th', '8': 'Octave',
  b9: 'Minor 9th', '9': 'Major 9th', '#9': '♯9', b10: 'Minor 10th', '10': 'Major 10th', b12: 'Diminished 12th', b14: 'Minor 14th', '14': 'Major 14th', '15': 'Double octave', '11': 'Perfect 11th', '#11': '♯11', '12': 'Perfect 12th', b13: '♭13', '13': '13th',
};
const ivLabel = (iv) => ivName[iv] || T.prettyIv(iv);
const qualName = (q) => { const c = T.getChord(q); return (c.sym ? c.sym.trim() : 'maj') + (c.name && c.name !== q ? ` (${c.name})` : ''); };
function choices(correct, pool, n = 4) {
  const others = shuffle([...new Set(pool.filter((x) => x !== correct))]).slice(0, n - 1);
  const list = shuffle([correct, ...others]);
  return { choices: list, answer: list.indexOf(correct) };
}
const keyRoot = (card) => card.ctx.root;
const randRoot = () => T.parseNote(rnd(T.ROOTS));

// ---------- keyboard-style voicings for ear training ----------
function earVoicing(root, quality, { inversion = 0, voicing = 'close', tones = null, base = 52 } = {}) {
  const ivs = tones || T.getChord(quality).ivs;
  const semis = ivs.map((iv) => T.intervalSemis(F.simpleIv(iv)) % 12);
  let rot = semis.slice(inversion).concat(semis.slice(0, inversion).map((s) => s + 12));
  // compound extensions sit above the 7th
  rot = rot.map((s, i) => (i > 0 && s <= rot[i - 1] ? s + 12 : s));
  let r = T.notePc(root);
  let bass = base + ((r + rot[0] - base) % 12 + 12) % 12;
  let mids = rot.map((s) => bass + s - rot[0]);
  if (voicing === 'spread' || voicing === 'drop2') {
    const n = mids.length; if (n >= 3) { mids[n - 2] -= 12; mids.sort((a, b) => a - b); }
    if (voicing === 'spread' && mids[0] < 40) mids = mids.map((m) => m + 12);
  }
  return mids;
}
export function progressionVoicings(chords) {
  let prev = null;
  return chords.map((c) => {
    const ivs = (c.tones || T.getChord(c.quality).ivs).map(F.simpleIv);
    const pcs = [...new Set(ivs.map((iv) => (T.notePc(c.root) + T.intervalSemis(iv)) % 12))];
    const upperPcs = pcs.length > 3 ? pcs.filter((p, i) => !(i === 0 && pcs.length > 4)) : pcs;
    const bassPc = c.bass ? T.notePc(c.bass) : T.notePc(c.root);
    const bass = 40 + ((bassPc - 40) % 12 + 12) % 12;
    // candidate upper voicings: each rotation placed from 57 up
    let best = null;
    for (let k = 0; k < upperPcs.length; k++) {
      const rot = upperPcs.slice(k).concat(upperPcs.slice(0, k));
      for (const start of [55, 60]) {
        let m = start + ((rot[0] - start) % 12 + 12) % 12;
        const mids = [m];
        for (let j = 1; j < rot.length; j++) { let x = mids[j - 1] + 1; while (x % 12 !== rot[j]) x++; mids.push(x); }
        const cost = prev ? mids.reduce((s, x, i) => s + Math.abs(x - (prev[i] ?? prev[prev.length - 1])), 0) : Math.abs(mids[0] - 60);
        if (!best || cost < best.cost) best = { mids, cost };
      }
    }
    prev = best.mids;
    return [bass, ...best.mids];
  });
}
export function playChordKeys(mids, t = null, dur = 1.6, arpeggiate = false) {
  const c = A.audioCtx();
  const t0 = t ?? c.currentTime + 0.05;
  mids.forEach((m, i) => A.keys(m, t0 + (arpeggiate ? i * 0.35 : 0), dur + (arpeggiate ? (mids.length - i) * 0.1 : 0)));
  return t0 + dur + (arpeggiate ? mids.length * 0.35 : 0);
}
function playCadence(root, minor = false, t = null) {
  const c = A.audioCtx();
  let t0 = t ?? c.currentTime + 0.05;
  const chart = minor ? '| i:min | iv:min | V:7 | i:min |' : '| I:maj | IV:maj | V:7 | I:maj |';
  const { chords } = chartChords({ key: T.noteName(root) + (minor ? 'm' : ''), chart });
  const vs = progressionVoicings(chords);
  vs.forEach((v, i) => playChordKeys(v, t0 + i * 0.7, 0.65));
  return t0 + vs.length * 0.7 + 0.3;
}
function playMelodyNotes(notes, bpm, t, sound = 'keys') {
  const spb = 60 / bpm;
  notes.forEach((n) => (sound === 'keys' ? A.keys(n.midi, t + n.beat * spb, n.dur * spb * 0.95) : A.pluck(n.midi, t + n.beat * spb)));
  return t + Math.max(...notes.map((n) => n.beat + n.dur)) * spb;
}

// ---------- generators ----------
const GEN = {
  'note-on-fret'(q) {
    const s = rnd(q.strings || [1, 2, 3, 4, 5, 6]);
    const [lo, hi] = q.frets || [0, 12];
    const f = lo + Math.floor(Math.random() * (hi - lo + 1));
    const pc = F.midiAt(s, f) % 12;
    return { type: 'choice', question: `What note is on <b>string ${s}, fret ${f}</b>?`, board: { lo: Math.max(0, f - 3), hi: Math.max(f + 2, 5), dots: [{ string: s, fret: f, label: '?', kind: 'mark' }] }, choices: PC_NAMES, answer: pc, grid: true, explain: `String ${s} fret ${f} = ${PC_NAMES[pc]}.` };
  },
  'find-note'(q) {
    const note = q.note ? T.parseNote(q.note) : T.parseNote(rnd(['C', 'D', 'E', 'F', 'G', 'A', 'B', 'Bb', 'Eb', 'F#', 'Ab', 'Db']));
    const reg = q.region || { frets: [0, 12] };
    const strings = reg.string ? [reg.string] : reg.strings || [6, 5, 4, 3, 2, 1];
    const [lo, hi] = reg.frets || [0, 12];
    const targets = [];
    for (const s of strings) for (let f = lo; f <= hi; f++) if (F.midiAt(s, f) % 12 === T.notePc(note)) targets.push(`${s}:${f}`);
    return { type: 'tap', question: `Tap every <b>${nn(note)}</b> ${reg.string ? `on string ${reg.string}` : reg.strings ? `on strings ${reg.strings.join(' & ')}` : ''} (frets ${lo}–${hi}).`, board: { lo, hi }, strings, targets, explain: `${nn(note)} is at ${targets.map((t) => t.replace(':', ' fret ')).map((t) => 'string ' + t).join(', ')}.` };
  },
  'interval-shape'(q) {
    const ivs = q.intervals || ['3', 'b3', '5', '4', 'b7', '7', '6'];
    for (let tries = 0; tries < 50; tries++) {
      const iv = rnd(ivs);
      const s1 = rnd([6, 5, 4, 3]);
      const f1 = 1 + Math.floor(Math.random() * 9);
      const target = F.midiAt(s1, f1) + T.intervalSemis(iv);
      const opts = [];
      for (let s2 = s1; s2 >= 1; s2--) { const f2 = target - F.OPEN[s2]; if (f2 >= 0 && f2 <= 15 && Math.abs(f2 - f1) <= 4 && !(s2 === s1 && f2 === f1)) opts.push({ s2, f2 }); }
      if (!opts.length) continue;
      const o = rnd(opts);
      const lo = Math.max(0, Math.min(f1, o.f2) - 1);
      return { type: 'choice', question: 'Name the interval from the root (R) up to the other note.', board: { lo, hi: lo + 5, dots: [{ string: s1, fret: f1, label: 'R', kind: 'root' }, { string: o.s2, fret: o.f2, label: '?', kind: 'mark' }] }, ...choices(ivLabel(iv), ivs.map(ivLabel)), explain: `That shape is a ${ivLabel(iv)}.` };
    }
    return null;
  },
  'chord-spelling'(q, card) {
    const quality = rnd(q.qualities || ['maj7', 'm7', '7']);
    const root = card.params.key || card.params.root ? keyRoot(card) : randRoot();
    const tones = T.chordNotes(root, quality);
    return { type: 'notes', question: `Spell <b>${T.chordSymbol(root, quality)}</b> — tap every chord tone.`, answer: new Set(tones.map(T.notePc)), explain: `${T.chordSymbol(root, quality)} = ${tones.map(nn).join(' ')} (${T.getChord(quality).ivs.map(T.prettyIv).join(' ')})` };
  },
  'scale-spelling'(q, card) {
    const scale = rnd(q.scales || ['major']);
    const root = card.params.key || card.params.root ? keyRoot(card) : randRoot();
    const notes = T.scaleNotes(root, scale);
    return { type: 'notes', question: `Spell <b>${nn(root)} ${T.getScale(scale).name}</b> — tap every note.`, answer: new Set(notes.map(T.notePc)), explain: `${nn(root)} ${T.getScale(scale).name}: ${notes.map(nn).join(' ')}  (${(T.getScale(scale).labels || T.getScale(scale).ivs).map(T.prettyIv).join(' ')})` };
  },
  'diatonic-chord'(q, card) {
    const scale = rnd(q.scales || ['major']);
    const size = q.size || 4;
    const root = card.params.key || card.params.root ? keyRoot(card) : randRoot();
    const i = Math.floor(Math.random() * 7);
    const dc = T.diatonicChord(root, scale === 'minor' ? 'aeolian' : scale, i, size);
    const all = [...Array(7).keys()].map((k) => T.diatonicChord(root, scale === 'minor' ? 'aeolian' : scale, k, size)).map((c) => T.chordSymbol(c.root, c.quality || 'maj'));
    const correct = T.chordSymbol(dc.root, dc.quality || 'maj');
    const alts = [...all, ...['maj7', 'm7', '7', 'm7b5', 'mMaj7'].slice(0, size === 3 ? 0 : 5).map((qq) => T.chordSymbol(dc.root, qq)), ...['maj', 'min', 'dim'].map((qq) => T.chordSymbol(dc.root, qq))];
    const ord = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th'][i];
    return { type: 'choice', question: `In <b>${nn(root)} ${T.getScale(scale === 'minor' ? 'aeolian' : scale).name}</b>, what ${size === 3 ? 'triad' : '7th chord'} is built on the ${ord} degree?`, ...choices(correct, alts), explain: `Stacking 3rds from ${nn(dc.root)}: ${dc.tones.map(nn).join(' ')} → ${correct}.` };
  },
  roman(q, card) {
    const tok = rnd(q.tokens || ['V/ii:7']);
    const k = card.params.key ? card.ctx.key : T.parseKey(rnd(T.MAJOR_KEYS));
    const c = T.parseChordToken(tok, k.tonic);
    const correct = T.chordSymbol(c.root, c.quality);
    const alt = [...(q.tokens || [])].map((t) => { try { const x = T.parseChordToken(t, k.tonic); return T.chordSymbol(x.root, x.quality); } catch (e) { return null; } }).filter(Boolean);
    for (const s of [1, 2, 5, 7, 10]) alt.push(T.chordSymbol(T.transposeSemis(c.root, s), c.quality));
    return { type: 'choice', question: `In <b>${k.name}</b>, what is <b>${T.pretty(tok.replace(':', ' '))}</b>?`, ...choices(correct, alt), explain: `${T.pretty(tok)} in ${k.name} = ${correct}.` };
  },
  'parent-scale'(q, card) {
    const mode = rnd(q.modes || ['altered']);
    const root = card.params.key || card.params.root ? keyRoot(card) : randRoot();
    const p = T.parentOf(root, mode);
    const fam = T.getScale(p.scaleId).name;
    const correct = `${nn(p.root)} ${fam}`;
    const alts = [0, 1, 2, 5, 7, 10, 11].map((s) => `${nn(T.transposeSemis(root, s))} ${fam}`);
    const ord = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th'][p.degree - 1];
    return { type: 'choice', question: `<b>${nn(root)} ${T.getScale(mode).name}</b> has the same notes as which parent scale?`, ...choices(correct, alts), explain: `${nn(root)} ${T.getScale(mode).name} is the ${ord} mode of ${correct}: ${T.scaleNotes(root, mode).map(nn).join(' ')}.` };
  },
  'mode-of'(q, card) {
    const famId = rnd(q.scales || ['major']);
    const fam = T.getScale(famId === 'major' ? 'ionian' : famId);
    const famModes = Object.values(T.SCALES).filter((s) => s.family === fam.family && !s.alias && s.id !== 'major');
    const root = card.params.key ? keyRoot(card) : randRoot();
    const d = Math.floor(Math.random() * 7);
    const notes = T.scaleNotes(root, fam.id);
    const mode = famModes.find((m) => m.modeIndex === d);
    const ord = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th'][d];
    return { type: 'choice', question: `Play <b>${nn(root)} ${fam.name}</b> from its ${ord} note, <b>${nn(notes[d])}</b>. Which mode is that?`, ...choices(`${nn(notes[d])} ${mode.name}`, famModes.map((m) => `${nn(notes[d])} ${m.name}`), 4), explain: `The ${ord} mode of ${fam.name} is ${mode.name}: ${(mode.labels || mode.ivs).map(T.prettyIv).join(' ')}.` };
  },
  'chord-scale-choice'(q, card, lib) {
    const tb = (lib && lib.toolbox) || [];
    if (!tb.length) return null;
    const entry = rnd(tb.filter((e) => e.options && e.options.length));
    const opt = rnd(entry.options);
    const root = card.params.key || card.params.root ? keyRoot(card) : randRoot();
    let chordQ; try { T.getChord(entry.chord); chordQ = entry.chord; } catch (e) { chordQ = null; }
    const chordName = chordQ ? T.chordSymbol(root, chordQ) : `${nn(root)} (${entry.label || entry.chord})`;
    const optText = (o) => { const r = o.from ? T.transpose(root, o.from) : root; try { return `${nn(r)} ${T.getScale(o.scale).name}`; } catch (e) { return o.scale; } };
    const wrong = tb.filter((e) => e !== entry).flatMap((e) => e.options || []).filter((o) => !entry.options.some((x) => x.scale === o.scale && (x.from || '1') === (o.from || '1'))).map(optText);
    const correct = optText(opt);
    return { type: 'choice', question: `Over <b>${chordName}</b>, which of these is a standard choice?`, ...choices(correct, wrong.filter((w) => w !== correct)), explain: `${correct}: ${opt.relation ? opt.relation + '. ' : ''}${opt.why || ''}` };
  },
  // tap a voicing onto the neck; any correct placement of that inversion on that string set counts
  'voicing-tap'(q, card) {
    const SETS = { drop2: [[4, 3, 2, 1], [5, 4, 3, 2], [6, 5, 4, 3]], drop3: [[6, 4, 3, 2], [5, 3, 2, 1]], drop24: [[6, 5, 3, 2], [5, 4, 2, 1]], close: [[3, 2, 1], [4, 3, 2], [5, 4, 3], [6, 5, 4]], spread: [[6, 4, 3], [5, 3, 2], [4, 2, 1]] };
    const voicing = q.voicing || 'drop2';
    const quality = q.quality || (card.ctx.quality) || 'maj7';
    const root = card.ctx.root;
    const sets = q.stringSet ? [q.stringSet] : SETS[voicing] || SETS.drop2;
    for (let tries = 0; tries < 30; tries++) {
      const ss = rnd(sets);
      let all = [];
      try { all = F.chordVoicings({ root, quality, voicing, stringSet: ss, inversion: 'all' }); } catch (e) { all = []; }
      if (!all.length) continue;
      const invs = [...new Set(all.map((p) => p.inversion))];
      const inv = q.inversion != null ? q.inversion : rnd(invs);
      const mine = all.filter((p) => p.inversion === inv && p.maxFret <= 15);
      if (!mine.length) continue;
      const anchor = rnd(mine);
      const lo = Math.max(0, anchor.minFret - 2), hi = Math.min(15, Math.max(anchor.maxFret + 3, lo + 6));
      const inWin = mine.filter((p) => p.minFret >= lo && p.maxFret <= hi);
      const label = anchor.label;
      return {
        type: 'tap', voicingTap: true,
        question: `Tap <b>${T.chordSymbol(root, quality)}</b> — <b>${voicing === 'close' ? 'close' : voicing.replace('drop', 'drop ').replace('24', '2&4')}</b>, <b>${label}</b> on strings <b>${[...ss].sort((a, b) => b - a).join('-')}</b> (somewhere between frets ${lo} and ${hi}).`,
        board: { lo, hi }, strings: ss,
        targetsAny: inWin.map((p) => p.notes.map((n) => `${n.string}:${n.fret}`)),
        targets: inWin[0].notes.map((n) => `${n.string}:${n.fret}`),
        reveal: inWin[0].notes.map((n) => ({ k: `${n.string}:${n.fret}`, iv: n.iv })),
        explain: `${T.chordSymbol(root, quality)} ${voicing} ${label}: ${inWin[0].notes.slice().sort((a, b) => b.string - a.string).map((n) => `string ${n.string} fret ${n.fret} (${T.prettyIv(n.iv)})`).join(', ')}.`,
      };
    }
    return null;
  },
  // think/play first, then reveal a computed diagram (e.g. every inversion on every string set)
  'voicing-map'(q, card) {
    return { type: 'reveal', question: fill(q.question || 'Play them all, then reveal the map.', card), answerHtml: '', revealSpec: q.spec, selfRate: true };
  },
  // a melody as a chain of intervals (learn, step through, sing, then test)
  'melody-intervals'(q, card) {
    const root = card.params.key ? card.ctx.root : T.parseNote(rnd(['C', 'D', 'E', 'F', 'G', 'A', 'Bb']));
    const sid = q.scale === 'minor' ? 'aeolian' : q.scale || 'major';
    const mel = parseMelody(q.melody, root, sid);
    const NAMES = ['unison', 'm2', 'M2', 'm3', 'M3', 'P4', 'tritone', 'P5', 'm6', 'M6', 'm7', 'M7', 'octave'];
    const LONG = { m2: 'minor 2nd', M2: 'major 2nd', m3: 'minor 3rd', M3: 'major 3rd', P4: 'perfect 4th', tritone: 'tritone', P5: 'perfect 5th', m6: 'minor 6th', M6: 'major 6th', m7: 'minor 7th', M7: 'major 7th', octave: 'octave' };
    const steps = [];
    for (let i = 1; i < mel.notes.length; i++) {
      const d = mel.notes[i].midi - mel.notes[i - 1].midi;
      const a = Math.abs(d);
      const name = a === 0 ? 'same' : a <= 12 ? NAMES[a] : (a === 24 ? '2 octaves' : `${NAMES[a - 12]}+8ve`);
      const label = a === 0 ? '=' : `${d > 0 ? '↑' : '↓'}${name}`;
      steps.push({ i, label, long: a === 0 ? 'same note' : `${d > 0 ? 'up' : 'down'} a ${LONG[name] || name}`, a: mel.notes[i - 1].midi, b: mel.notes[i].midi });
    }
    const spb = 60 / 84;
    const playAll = (onNote) => { A.hush(); const t0 = A.audioCtx().currentTime + 0.1; mel.notes.forEach((n, k) => { A.keys(n.midi, t0 + n.beat * spb, n.dur * spb * 0.95); if (onNote) A.later(() => onNote(k), (0.1 + n.beat * spb) * 1000); }); };
    const playPair = (k) => { A.hush(); const t = A.audioCtx().currentTime + 0.05; A.keys(steps[k].a, t, 0.55); A.keys(steps[k].b, t + 0.6, 0.8); };
    const testN = Math.min(8, steps.length);
    const pool = [...new Set(steps.slice(0, testN).map((x) => x.label))];
    const extras = ['↑M2', '↓M2', '↑m3', '↓m3', '↑P4', '↓P4', '↑P5', '↓M3'].filter((x) => !pool.includes(x));
    return { type: 'melintervals', name: q.name, start: mel.notes[0].deg, startNote: T.noteName(T.transposeSemis(root, mel.notes[0].s), true), key: T.noteName(root, true), steps, playAll, playPair, testN,
      options: pool.concat(extras.slice(0, Math.max(0, 6 - pool.length))), selfRate: true };
  },
  // understand → visualise (eyes closed) → watch it played
  visualize(q, card) {
    return { type: 'visualize', concept: fill(q.concept || card.tpl.explain || '', card), imagine: fill(q.imagine || 'Picture it on the neck.', card), seconds: q.seconds || 15, selfRate: true };
  },
  choice(q, card) {
    const cs = q.choices.map((c) => fill(c, card));
    // shuffle while tracking the answer
    const idx = shuffle(cs.map((_, i) => i));
    return { type: 'choice', question: fill(q.question, card), choices: idx.map((i) => cs[i]), answer: idx.indexOf(q.answer), explain: fill(q.explain || '', card) };
  },
  reveal(q, card) { return { type: 'reveal', question: fill(q.question, card), answerHtml: fill(q.answer, card), selfRate: true }; },

  // ---------- ear ----------
  'ear-interval'(q) {
    const iv = rnd(q.intervals || ['3', 'b3']);
    const dir = q.direction === 'mixed' ? rnd(['up', 'down', 'harmonic']) : (q.direction || 'up');
    const lo = 50 + Math.floor(Math.random() * 14);
    const semis = T.intervalSemis(iv);
    const a = dir === 'down' ? lo + semis : lo, b = dir === 'down' ? lo : lo + semis;
    const play = () => { const t = A.audioCtx().currentTime + 0.05; if (dir === 'harmonic') { A.keys(a, t, 1.4); A.keys(b, t, 1.4); } else { A.keys(a, t, 0.8); A.keys(b, t + 0.75, 1); } };
    return { type: 'choice', question: `Which interval? <span class="muted">(${dir === 'harmonic' ? 'together' : dir === 'down' ? 'descending' : 'ascending'})</span>`, play, ...choices(ivLabel(iv), (q.intervals || []).map(ivLabel), Math.min(6, (q.intervals || []).length)), explain: `${ivLabel(iv)} (${semis} semitones).` };
  },
  'ear-chord'(q) {
    const quals = q.qualities || ['maj', 'min'];
    const quality = rnd(quals);
    const root = randRoot();
    const dense = { '7alt': ['1', '3', 'b7', '#9', 'b13'], '13#11': ['1', '3', 'b7', '9', '#11', '13'] };
    if (!q.tones && dense[quality]) q = { ...q, tones: dense[quality] };
    const n = (q.tones || T.getChord(quality).ivs).length;
    const inv = q.inversions ? Math.floor(Math.random() * Math.min(n, 4)) : 0;
    const mids = earVoicing(root, quality, { inversion: inv, voicing: q.voicing, tones: q.tones, base: 48 + Math.floor(Math.random() * 7) });
    const play = () => playChordKeys(mids, null, 1.8, !!q.arpeggiate);
    const pool = quals.map(qualName);
    return { type: 'choice', question: 'What chord quality?', play, ...choices(qualName(quality), pool, Math.min(6, pool.length)), explain: `${T.chordSymbol(root, quality)} — ${T.getChord(quality).ivs.map(T.prettyIv).join(' ')}${inv ? ` (inversion ${inv})` : ''}.` };
  },
  'ear-inversion'(q) {
    const quality = q.quality || 'maj';
    const n = T.getChord(quality).ivs.length;
    const inv = Math.floor(Math.random() * Math.min(n, 4));
    const root = randRoot();
    const mids = earVoicing(root, quality, { inversion: inv, voicing: q.voicing });
    const names = ['Root position', '1st inversion', '2nd inversion', '3rd inversion'].slice(0, Math.min(n, 4));
    return { type: 'choice', question: `Which inversion of this ${T.getChord(quality).name || quality}?`, play: () => playChordKeys(mids, null, 1.8, !!q.arpeggiate), choices: names, answer: inv, explain: `Bass note was the ${T.prettyIv(T.getChord(quality).ivs[inv])}.` };
  },
  'ear-progression'(q) {
    const opts = q.options || [];
    const o = rnd(opts);
    const k = T.parseKey(q.key || rnd(o.minor || /^\|?\s*i[:\s]/.test(o.chart) ? T.MINOR_KEYS : T.MAJOR_KEYS));
    const [tlo, thi] = q.tempo || [70, 110];
    const bpm = Math.round(tlo + Math.random() * (thi - tlo));
    const { chords, bpb } = chartChords({ key: k.short, chart: o.chart });
    const vs = progressionVoicings(chords);
    const play = () => { const t0 = A.audioCtx().currentTime + 0.08; const spb = 60 / bpm; chords.forEach((c, i) => playChordKeys(vs[i], t0 + c.beat * spb, c.dur * spb * 0.95)); };
    const names = opts.map((x) => x.name || x.chart);
    return { type: 'choice', question: `Which progression? <span class="muted">(${bpm} bpm)</span>`, play, ...choices(o.name || o.chart, names, Math.min(6, names.length)), explain: `${o.name || ''}: ${chords.map((c) => chordLabel(c)).join(' – ')} in ${k.name}.` };
  },
  'ear-degree'(q) {
    const degs = q.degrees || ['1', '3', '5'];
    const d = rnd(degs);
    const minor = /minor|aeolian|dorian|phrygian/.test(q.scale || '');
    const root = randRoot();
    const sc = T.getScale(q.scale === 'minor' ? 'aeolian' : q.scale || 'major');
    const mel = parseMelody(String(d).replace(/^(b|#)?(\d)$/, '$1$2'), root, sc.id);
    const play = () => { const t = q.cadence === false ? A.audioCtx().currentTime + 0.05 : playCadence(root, minor); A.keys(mel.notes[0].midi, t + 0.2, 1.3); };
    return { type: 'choice', question: 'After the cadence: which scale degree is the note?', play, ...choices(d, degs, Math.min(8, degs.length)), explain: `It was ${T.prettyIv(d)} (${nn(T.transposeSemis(root, mel.notes[0].s))}).` };
  },
  'ear-mode'(q) {
    const scales = q.scales || ['ionian', 'dorian', 'mixolydian'];
    const sid = rnd(scales);
    const root = randRoot();
    const ivs = T.getScale(sid).ivs;
    const base = 52 + ((T.notePc(root) - 52) % 12 + 12) % 12;
    const play = () => {
      const c = A.audioCtx(); const t = c.currentTime + 0.1;
      A.startDrone(base - 12, true);
      const line = ivs.map((iv) => base + T.intervalSemis(iv)).concat([base + 12]);
      const seq = q.playback === 'drone-melody' ? shuffle(line.slice(1, -1)).concat([base + 12, base]) : line.concat([...line].reverse().slice(1));
      seq.forEach((m, i) => A.keys(m, t + 0.6 + i * 0.38, 0.4));
      A.later(() => A.stopDrone(), (0.6 + seq.length * 0.38 + 0.8) * 1000);
    };
    return { type: 'choice', question: 'Which mode? (listen for the colour note against the drone)', play, ...choices(T.getScale(sid).name, scales.map((s) => T.getScale(s).name), Math.min(7, scales.length)), explain: `${T.getScale(sid).name}: ${(T.getScale(sid).labels || ivs).map(T.prettyIv).join(' ')}.` };
  },
  'ear-melody'(q) {
    const sid = q.scale === 'minor' ? 'aeolian' : q.scale || 'major';
    const root = randRoot();
    const degs = genMelody(q, sid);
    const mel = parseMelody(degs.join(' '), root, sid);
    const minor = /aeolian|dorian|phrygian|minor/.test(sid);
    const play = () => { const t = q.cadence === false ? A.audioCtx().currentTime + 0.05 : playCadence(root, minor); playMelodyNotes(mel.notes, 84, t + 0.3); };
    const range = rangeDegrees(q.range).map((d) => spellDeg(Number(d), sid));
    return { type: 'sequence', question: `Tap the ${degs.length} scale degrees you hear, in order.`, play, options: [...new Set(range)], answer: degs.map((d) => d.replace(/[',]/g, '')), explain: `Melody: ${degs.map((d) => T.prettyIv(d.replace(/[',]/g, ''))).join(' ')}` };
  },
  'ear-bass'(q) {
    const k = T.parseKey(rnd(T.MAJOR_KEYS));
    const { chords } = chartChords({ key: k.short, chart: q.chart });
    const vs = progressionVoicings(chords);
    const play = () => { const t0 = A.audioCtx().currentTime + 0.08; chords.forEach((c, i) => playChordKeys(vs[i], t0 + i * 1.2, 1.1)); };
    const ans = chords.map((c) => { const b = c.bass || c.root; const iv = T.intervalBetween(k.tonic, b); return iv.replace(/^1$/, '1'); });
    return { type: 'sequence', question: 'Tap the bass-note scale degree of each chord.', play, options: ['1', 'b2', '2', 'b3', '3', '4', '#4', '5', 'b6', '6', 'b7', '7'], answer: ans, explain: chords.map((c, i) => `${chordLabel(c)} → ${T.prettyIv(ans[i])}`).join(', ') };
  },
  listen(q, card) {
    const root = card.params.key ? card.ctx.root : T.parseNote(q.key || 'C');
    const mel = parseMelody(q.melody, root, q.scale === 'minor' ? 'aeolian' : q.scale || 'major');
    const play = () => playMelodyNotes(mel.notes, q.tempo || 90, A.audioCtx().currentTime + 0.1);
    const placed = placeMelody(mel.notes.map((n) => n.midi));
    return { type: 'listen', play, html: fill(q.explain || '', card), melody: mel, placed, degrees: mel.notes.map((n) => n.deg), selfRate: true };
  },
  audiate(q, card) {
    const sid = q.scale === 'minor' ? 'aeolian' : q.scale || 'major';
    const root = card.params.key ? card.ctx.root : randRoot();
    const str = q.melody || genMelody(q, sid).join(' ');
    const mel = parseMelody(str, root, sid);
    const placed = placeMelody(mel.notes.map((n) => n.midi));
    const bpm = q.tempo || 72;
    const first = () => { const t = q.cadence ? playCadence(root, /aeolian|minor|dorian/.test(sid)) : A.audioCtx().currentTime + 0.05; A.keys(mel.notes[0].midi, t, 1.2); };
    const reveal = () => playMelodyNotes(mel.notes, bpm, A.audioCtx().currentTime + 0.1);
    return { type: 'audiate', show: q.show || 'neck', melody: mel, placed, bpm, playStart: first, play: reveal, degrees: mel.notes.map((n) => n.deg), notes: mel.notes.map((n, i) => nn(T.transposeSemis(root, n.s))), selfRate: true };
  },
};
const MAJ_SEMIS = [0, 2, 4, 5, 7, 9, 11];
function spellDeg(idx, sid) {
  // scale-step index (1-based, may exceed 7) -> major-relative token
  const ivs = T.getScale(sid).ivs;
  const n = ivs.length;
  const oct = Math.floor((idx - 1) / n);
  const iv = ivs[(((idx - 1) % n) + n) % n];
  const deg = T.INTERVALS[iv][0];
  const diff = T.intervalSemis(iv) - MAJ_SEMIS[deg - 1];
  const acc = diff === -1 ? 'b' : diff === 1 ? '#' : diff === -2 ? 'bb' : '';
  return acc + deg + (oct > 0 ? "'".repeat(oct) : oct < 0 ? ','.repeat(-oct) : '');
}
function genMelody(q, sid) {
  if (q.chromatic) return genChromatic(q);
  return genSteps(q, sid).map((i) => spellDeg(i, sid));
}
function genChromatic(q) {
  const toks = ['1', 'b2', '2', 'b3', '3', '4', '#4', '5', 'b6', '6', 'b7', '7'];
  const len = q.length || 5;
  let i = 0; const out = ['1'];
  for (let k = 1; k < len; k++) { let step = Math.floor(Math.random() * 7) - 3; if (!step) step = 1; i = Math.max(0, Math.min(11, i + step)); out.push(toks[i]); }
  return out;
}
const degIdx = (x) => { const t = String(x); const d = Number(t.replace(/[^0-9]/g, '')) || 1; return d + 7 * ((t.match(/'/g) || []).length - (t.match(/,/g) || []).length); };
function genSteps(q, sid) {
  const len = q.length || 4;
  let [a, b] = (q.range || ['1', '5']).map(degIdx);
  if (b <= a) b = a + 4;
  let cur = Math.max(a, Math.min(b, 1));
  if (cur < a || cur > b) cur = a;
  const out = [cur];
  const maxStep = q.leaps ? 4 : 1;
  for (let i = 1; i < len; i++) {
    let nxt = cur;
    for (let tries = 0; tries < 40 && (nxt === cur || nxt < a || nxt > b); tries++) nxt = cur + (Math.floor(Math.random() * (2 * maxStep + 1)) - maxStep);
    if (nxt < a || nxt > b || nxt === cur) nxt = cur < b ? cur + 1 : cur - 1;
    out.push(nxt);
    cur = nxt;
  }
  return out;
}
function rangeDegrees(range) {
  const all = ['1', '2', '3', '4', '5', '6', '7'];
  if (!range) return all;
  const a = Math.max(1, ((degIdx(range[0]) - 1) % 7 + 7) % 7 + 1), b = degIdx(range[1]);
  return b - degIdx(range[0]) >= 6 ? all : all.slice(a - 1, Math.min(7, Math.max(a, ((b - 1) % 7) + 1)));
}

export function makeQuiz(card, lib) {
  const q = card.quiz;
  if (!q) return null;
  const g = GEN[q.kind];
  if (!g) throw new Error(`Unknown quiz kind "${q.kind}"`);
  return g(q, card, lib);
}
export const QUIZ_KINDS = Object.keys(GEN);
export { PC_NAMES };
