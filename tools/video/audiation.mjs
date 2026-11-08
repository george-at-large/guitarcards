// Generate an audiation timeline: a sound rings, a silent gap to name it in your head, then the reveal
// (voice + the shape on the neck + the sound again). Every name, spelling, fret and interval label comes
// from the theory engine and is cross-checked against the pitches before anything is written.
//
//   node tools/video/audiation.mjs intervals [--root C|random] [--n 12] [--gap 4] [--play both|melodic|harmonic] [--seed 1]
//   node tools/video/audiation.mjs chords    [--root G|random] [--qualities maj,min,dim,aug,maj7,7,m7,m7b5] [--repeat 1] [--gap 5]
//   options: --out video/out/<name>.json   --title "..."
// Then: node tools/video/render.mjs video/out/<name>.json
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
globalThis.window = globalThis;
globalThis.localStorage = { getItem: () => null, setItem: () => {} };
const root = new URL('../../', import.meta.url).pathname;
const T = await import(root + 'src/theory.js');
const F = await import(root + 'src/fretboard.js');

// ---------- args ----------
const argv = process.argv.slice(2);
const kind = argv[0];
const opt = (name, def) => { const i = argv.indexOf('--' + name); return i >= 0 ? argv[i + 1] : def; };
if (!['intervals', 'chords'].includes(kind)) {
  console.error('usage: node tools/video/audiation.mjs intervals|chords [--root C|random] [--n 12] [--gap 4] [--seed 1] [--out file]');
  process.exit(1);
}
const seed = Number(opt('seed', 1));
const gap = Number(opt('gap', kind === 'chords' ? 5 : 4));
const rootOpt = opt('root', kind === 'chords' ? 'G' : 'C');

// seeded, so the same command always makes the same video
let s0 = seed >>> 0 || 1;
const rand = () => { s0 = (s0 + 0x6d2b79f5) >>> 0; let t = s0; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const pick = (xs) => xs[Math.floor(rand() * xs.length)];
const shuffle = (xs) => { const a = [...xs]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const ROOTS = ['C', 'G', 'D', 'A', 'E', 'F', 'Bb', 'Eb', 'Ab', 'Db', 'B', 'F#'];
// random roots avoid spellings a reader stumbles on (C♭, F♭, E♯, B♯, double accidentals) in the chord itself
const awkward = (n) => Math.abs(n.acc) > 1 || ['Cb', 'Fb', 'E#', 'B#'].includes(T.noteName(n));
const rootFor = (q) => {
  if (rootOpt !== 'random') return rootOpt;
  for (let k = 0; k < 50; k++) { const r = pick(ROOTS); if (!q || !T.chordNotes(r, q).some(awkward)) return r; }
  return pick(['C', 'G', 'D', 'A', 'E', 'F']);
};
const nn = (n) => T.noteName(n, true);
const pc = (midi) => ((midi % 12) + 12) % 12;
const assert = (ok, msg) => { if (!ok) { console.error('THEORY CHECK FAILED: ' + msg); process.exit(2); } };

// ---------- names ----------
const IV_BY_SEMIS = { 1: 'b2', 2: '2', 3: 'b3', 4: '3', 5: '4', 6: 'b5', 7: '5', 8: 'b6', 9: '6', 10: 'b7', 11: '7', 12: '8' };
const IV_NAME = { b2: ['minor second', 'Minor 2nd'], 2: ['major second', 'Major 2nd'], b3: ['minor third', 'Minor 3rd'], 3: ['major third', 'Major 3rd'],
  4: ['perfect fourth', 'Perfect 4th'], b5: ['tritone', 'Tritone'], 5: ['perfect fifth', 'Perfect 5th'], b6: ['minor sixth', 'Minor 6th'],
  6: ['major sixth', 'Major 6th'], b7: ['minor seventh', 'Minor 7th'], 7: ['major seventh', 'Major 7th'], 8: ['octave', 'Octave'] };
const Q_NAME = { maj: 'major', min: 'minor', dim: 'diminished', aug: 'augmented', sus2: 'suspended second', sus4: 'suspended fourth',
  maj7: 'major seventh', 7: 'dominant seventh', m7: 'minor seventh', m7b5: 'half-diminished', dim7: 'diminished seventh',
  mMaj7: 'minor major seventh', 6: 'major sixth', m6: 'minor sixth', 9: 'dominant ninth', maj9: 'major ninth', m9: 'minor ninth', '7sus4': 'seventh suspended fourth' };
const cap = (s) => s[0].toUpperCase() + s.slice(1);
const qDisplay = (q) => cap((Q_NAME[q] || T.getChord(q).name).replace('seventh', '7th').replace('sixth', '6th').replace('ninth', '9th').replace('second', '2nd').replace('fourth', '4th'));

// ---------- placement + fingering ----------
// root on string 6 or 5 around the 5th fret, the upper note on the same or a higher string within reach
function placeInterval(rootName, semis) {
  const r = T.parseNote(rootName);
  const opts = [];
  for (const s of [6, 5]) for (let f = 1; f <= 10; f++) if (pc(F.OPEN[s] + f) === T.notePc(r)) opts.push({ string: s, fret: f });
  const lo = opts.reduce((a, b) => (Math.abs(a.fret - 4.5) <= Math.abs(b.fret - 4.5) ? a : b));
  const lowMidi = F.OPEN[lo.string] + lo.fret, hiMidi = lowMidi + semis;
  let best = null;
  for (let s = lo.string; s >= 1; s--) {
    const f = hiMidi - F.OPEN[s];
    if (f < 0 || f > F.MAX_FRET) continue;
    const reach = Math.abs(f - lo.fret);
    const cost = reach + (s === lo.string ? 3 : 0) + (reach > 4 ? 10 : 0) + (lo.string - s) * 0.2;
    if (!best || cost < best.cost) best = { string: s, fret: f, cost };
  }
  return [{ ...lo, midi: lowMidi }, { string: best.string, fret: best.fret, midi: hiMidi }];
}
// suggested fingers: one finger per fret from the lowest fretted note; notes sharing a finger on the same
// fret spread to the next fingers, or barre if they run out
function assignFingers(notes) {
  const fretted = notes.filter((n) => n.fret > 0);
  if (!fretted.length) return notes;
  const base = Math.min(...fretted.map((n) => n.fret));
  for (const n of fretted) n.finger = Math.min(4, n.fret - base + 1);
  const groups = new Map();
  for (const n of fretted) { const k = n.finger + ':' + n.fret; groups.set(k, [...(groups.get(k) || []), n]); }
  for (const g of groups.values()) {
    if (g.length < 2 || g[0].finger === 1) continue;           // first-finger barre is fine as is
    g.sort((a, b) => b.string - a.string);
    const f0 = g[0].finger;
    const used = new Set(fretted.filter((n) => !g.includes(n)).map((n) => n.finger));
    const spread = g.map((_, i) => f0 + i);
    if (spread.every((f) => f <= 4 && !used.has(f))) g.forEach((n, i) => { n.finger = spread[i]; });
  }
  return notes;
}
const windowFor = (notes) => {
  const fs = notes.map((n) => n.fret);
  let lo = Math.min(...fs), hi = Math.max(...fs);
  lo = lo <= 2 ? 0 : lo - 2; hi = Math.max(hi + 2, lo + 7);
  return { lo, hi };
};

// ---------- items ----------
function intervalItem(semis) {
  const rootName = rootFor();
  const r = T.parseNote(rootName);
  const iv = IV_BY_SEMIS[semis];
  const upper = T.transpose(r, iv);
  const [a, b] = placeInterval(rootName, semis);
  // the checks: label semitones = pitch distance, spelled notes = sounding pitches, engine agrees on the name
  assert(T.intervalSemis(iv) === b.midi - a.midi, `${iv} is ${T.intervalSemis(iv)} semitones but the notes are ${b.midi - a.midi} apart`);
  assert(T.notePc(r) === pc(a.midi) && T.notePc(upper) === pc(b.midi), `spelling ${nn(r)}–${nn(upper)} does not match MIDI ${a.midi}/${b.midi}`);
  assert(semis === 12 || T.intervalBetween(r, upper) === iv, `engine names ${nn(r)}→${nn(upper)} as ${T.intervalBetween(r, upper)}, expected ${iv}`);
  const notes = assignFingers([{ ...a, label: '1' }, { ...b, label: iv }]);
  const [say, show] = IV_NAME[iv];
  return { notes, say, answer: show + ' · ' + T.prettyIv(iv === '8' ? '8' : iv), sub: `${nn(r)} → ${nn(upper)} · ${semis} semitone${semis > 1 ? 's' : ''}`, kind: 'interval' };
}
function chordItem(q) {
  const rootName = rootFor(q);
  const r = T.parseNote(rootName);
  const grip = F.gripFor(r, q, 5);
  assert(grip, `no grip for ${rootName}${q}`);
  const tones = T.chordNotes(r, q);
  const notes = grip.notes.map((n) => ({ string: n.string, fret: n.fret, midi: n.midi, label: n.iv })).sort((x, y) => y.string - x.string);
  for (const n of notes) {
    assert(F.OPEN[n.string] + n.fret === n.midi, `fret maths off at string ${n.string}`);
    const want = T.transpose(r, F.simpleIv(n.label));
    assert(T.notePc(want) === pc(n.midi), `${n.label} of ${rootName} should be ${nn(want)}, string ${n.string} fret ${n.fret} sounds pc ${pc(n.midi)}`);
  }
  assert(tones.every((t) => notes.some((n) => pc(n.midi) === T.notePc(t)) || T.getChord(q).ivs.length > notes.length), `${rootName}${q} grip is missing a chord tone`);
  assignFingers(notes);
  const say = Q_NAME[q] || T.getChord(q).name;
  return { notes, say, answer: qDisplay(q), sub: `${T.chordSymbol(r, q)} · ${tones.map(nn).join(' ')}`, kind: 'chord' };
}

// ---------- timeline ----------
const events = [];
const ev = (e) => events.push(e);
const items = [];
if (kind === 'intervals') {
  const n = Number(opt('n', 12));
  const pool = (opt('set') || '1,2,3,4,5,6,7,8,9,10,11,12').split(',').map(Number);
  let order = [];
  while (order.length < n) order.push(...shuffle(pool));
  order = order.slice(0, n);
  for (const s of order) items.push(intervalItem(s));
} else {
  const qs = (opt('qualities') || 'maj,min,dim,aug,maj7,7,m7,m7b5').split(',');
  const rep = Number(opt('repeat', 1));
  for (const q of shuffle(Array.from({ length: rep }, () => qs).flat())) items.push(chordItem(q));
}
const playMode = opt('play', 'both');
const title = opt('title', kind === 'intervals' ? 'Interval audiation' : 'Chord quality audiation');

// how an item sounds: melodic then harmonic for intervals; strum then arpeggio for chords
function sound(item, t0) {
  const out = [];
  if (item.kind === 'interval') {
    let t = t0;
    if (playMode !== 'harmonic') { out.push({ type: 'play', t, dur: 1.0, notes: [item.notes[0]] }, { type: 'play', t: t + 0.95, dur: 1.4, notes: [item.notes[1]] }); t += 2.35; }
    if (playMode !== 'melodic') { out.push({ type: 'play', t, dur: 2.0, notes: item.notes.map((n) => ({ ...n, at: 0 })) }); t += 2.0; }
    return { events: out, end: t };
  }
  const strum = item.notes.map((n, i) => ({ ...n, at: i * 0.03 }));
  out.push({ type: 'play', t: t0, dur: 2.3, notes: strum, vel: 0.75 });
  const arp = item.notes.map((n, i) => ({ ...n, at: i * 0.34 }));
  out.push({ type: 'play', t: t0 + 2.5, dur: 0.34 * arp.length + 1.4, notes: arp, vel: 0.7 });
  return { events: out, end: t0 + 2.5 + 0.34 * arp.length + 1.4 };
}
const strip = (e) => ({ ...e, notes: e.notes.map(({ string, fret, finger, label, at }) => ({ string, fret, finger, label, at })) });

let t = 0;
ev({ type: 'text', slot: 'big', t, until: 5.2, text: title });
ev({ type: 'text', slot: 'sub', t: t + 0.4, until: 5.2, text: 'Listen  ·  name it in the silence  ·  then check' });
ev({ type: 'say', t: t + 0.6, text: `${title}. Listen, name it in the silence, then check.` });
t = 6;
items.forEach((item, k) => {
  const win = windowFor(item.notes);
  const corner = { type: 'text', slot: 'corner', t, fadeIn: false, text: `${k + 1} / ${items.length}` };
  ev({ type: 'text', slot: 'title', t, fadeIn: false, text: title });
  // question: empty neck, the sound, then the silent gap
  ev({ type: 'neck', t, lo: win.lo, hi: win.hi, dots: [], lightPlayed: false, fadeIn: false });
  const q = sound(item, t + 0.4);
  ev({ type: 'text', slot: 'big', t, until: q.end, text: 'Listen' });
  q.events.forEach((e) => ev(strip(e)));
  ev({ type: 'timer', t: q.end, until: q.end + gap, text: 'Name it. Hear it again in your head.' });
  // reveal: voice, answer, shape, then the sound again with the dots lighting
  const r = q.end + gap;
  ev({ type: 'say', t: r, text: cap(item.say) });
  ev({ type: 'text', slot: 'big', t: r, style: 'answer', text: item.answer });
  ev({ type: 'text', slot: 'sub', t: r + 0.15, text: item.sub });
  ev({ type: 'neck', t: r, lo: win.lo, hi: win.hi, dots: item.notes.map(({ string, fret, finger, label }) => ({ string, fret, finger, label })), fadeIn: false });
  const again = sound(item, r + 1.6);
  again.events.forEach((e) => ev(strip(e)));
  const end = again.end + 0.8;
  for (const e of events) if (e.until == null && ['text', 'neck'].includes(e.type) && e.t >= t) e.until = end;
  corner.until = end; ev(corner);
  t = end;
});
ev({ type: 'text', slot: 'big', t, until: t + 4, text: 'Nice work' });
ev({ type: 'text', slot: 'sub', t: t + 0.3, until: t + 4, text: kind === 'intervals' ? 'Same set, new order: change --seed' : 'Next: the same qualities from a new root' });
ev({ type: 'say', t: t + 0.3, text: 'Nice work.' });

const timeline = { title, fps: 30, width: 1920, height: 1080, autoNeck: false, tail: 0.5, duration: Math.round((t + 4) * 100) / 100, events };
const out = opt('out', `video/out/${kind}-${rootOpt.toLowerCase()}-s${seed}.json`);
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, JSON.stringify(timeline, null, 1));
console.log(`${out}: ${items.length} items, ${timeline.duration.toFixed(1)} s`);
for (const [i, it] of items.entries()) console.log(`  ${String(i + 1).padStart(2)}. ${it.answer.padEnd(22)} ${it.sub}   ${it.notes.map((n) => `s${n.string}f${n.fret}${n.finger ? '(' + n.finger + ')' : ''}`).join(' ')}`);
