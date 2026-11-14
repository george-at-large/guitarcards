// CAGED Changes: pick a key and a CAGED shape, start the beat, and play each chord as it arrives, in that shape.
// Silent by default: the metronome is visual (an audible click is an opt-in); in the line modes a soft pad can play
// each chord (the Chord sound toggle).
// Chords come from a set (diatonic → modal interchange → everything → any chord) or a progression from the library;
// colour tiers turn triads into sevenths and sevenths into 9ths, 13ths and altered dominants. Evolving mode swaps
// chords for others with the same job as the loop goes round. A progression counts as done once you've confirmed a
// clean run in all five shapes at a fast tempo.
import * as T from '../theory.js';
import * as A from '../audio.js';
import * as G from './grips.js';
import * as H from './harmony.js';
import * as L from './library.js';
import * as E from './evolve.js';
import * as SC from './scales.js';
import * as MC from './modal.js';
import * as GN from './genres.js';
import * as CR from './callresp.js';
import * as LS from './listen.js';
import * as WK from './wkrun.js';
import * as AR from './around.js';
import * as CO from './coach.js';
import * as TGV from './tgv.js';
import * as CW from './colourwhy.js';
import * as SO from './solo.js';
import * as FS from './freescale.js';
import * as BC from './borrowed.js';
import * as CS from './cscale.js';

const $app = document.getElementById('caged');
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const fmt = (s) => esc(s).replace(/([♭♯𝄫])/g, '<span class="acc">$1</span>');
const pickOne = (a) => a[Math.floor(Math.random() * a.length)];
const standalone = matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;

// ---------- settings and progress ----------
const STORE = 'caged-changes';
const load = () => { try { return JSON.parse(localStorage.getItem(STORE) || '{}'); } catch (e) { return {}; } };
const D = Object.assign({
  key: 'C', kt: 'major', shape: 'C', mode: 'pos', src: 'set', set: 'dia', prog: 'major-ii-v-i',
  colour: 'sev', pcolour: 'as', names: false, nums: true, neck: true, voicing: 'caged', play: 'chords', scaleLevel: 1, bassline: 'off', varVL: true, allv: false, rhythm: 'ring', tour: false, mine: [], modal: 'dorian', modalSrc: 'vamp', wide: false, pad: false, genre: 'blues', diagram: 'now', labels: 'iv', hint: true, moves: true, evolve: false,
  bpm: 72, beats: 4, barBeats: 4, click: false, countIn: true, done: {},
  roam: { cat: 'all', times: 2, tour5: false, done: {} }, hearRhythm: true, mute: false, around: 'off', aroundAmt: 'medium', tgExtras: true, qsMinutes: 15,
}, load());
// the beat and the rhythm are heard now (they were silent by default): turn the click on once for everyone
if (!D.soundV2) { D.click = true; D.hearRhythm = true; D.soundV2 = 1; }
// a quick-start session that never finished (the app was closed mid-way): put your own settings back
if (D.qsSnap) { Object.assign(D, D.qsSnap); delete D.qsSnap; }
const save = () => { try { localStorage.setItem(STORE, JSON.stringify(D)); } catch (e) { /* private mode */ } };
if (D.diagram === 'off') { D.neck = false; D.diagram = 'now'; } // older setting: "never" is now the neck toggle
if (!D.nums && !D.names) D.nums = true;

const MAJOR_KEYS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
const MINOR_KEYS = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'G#', 'A', 'Bb', 'B'];
const keysFor = (minor) => (minor ? MINOR_KEYS : MAJOR_KEYS);
// your own progressions live in the settings, alongside the library
// (charts are stored as numerals; `writtenIn` is only the key chord names were typed in, never the library's `key`)
const mine = () => (D.mine || []).map((m) => ({ ...m, key: undefined, writtenIn: m.writtenIn || m.key || 'C', by: m.by || 'yours', cat: 'My progressions' }));
const prog = () => (D.src === 'roam' && R?.roam ? R.roam : mine().find((p) => p.id === D.prog) || L.byId(D.prog));
const isMinor = () => D.kt === 'minor';
// a progression counts as done at this tempo (normalised to 4 beats a bar): 120, or 100 when bars hold two chords
const progBars = () => L.resolve(prog());
const progLike = () => D.src === 'prog' || D.src === 'genre' || D.src === 'roam';
const target = () => (D.src === 'genre' || D.src === 'roam' ? 110 : D.src === 'prog' ? (progBars().some((b) => b.length > 1) ? 100 : 120) : 120);
const doneKey = () => (D.play === 'modal' ? `m:${D.modal}:${D.modalSrc}` : ({ scales: 'x:', arps: 'a:', guide: 'g:' }[D.play] || '') + (D.src === 'roam' ? `r:${D.roam.cat}` : D.src === 'genre' ? `gn:${D.genre}:${D.kt}` : D.src === 'prog' ? `p:${D.prog}:${D.kt}` : `s:${D.kt}:${D.set}:${D.colour}`));
const record = (k = doneKey()) => D.done[k] || {};
const complete = (k, tgt) => G.SHAPES.every((s) => (record(k)[s] || 0) >= tgt);
const normBpm = (bpm) => Math.round(progLike() ? bpm * 4 / D.barBeats : bpm * 4 / D.beats);

// ---------- a session: key, position, and the stream of chords ----------
function session() {
  const minor = isMinor();
  const keyName = D.key === 'rand' ? pickOne(keysFor(minor)) : D.key;
  const tonic = T.parseNote(keyName);
  const shape = D.shape === 'rand' ? pickOne(G.SHAPES) : D.shape;
  // two neighbouring shapes: one wider area (C+A, A+G, G+E, E+D, D+C)
  const pos = D.pair ? G.positionOfPair(tonic, shape) : G.positionOf(tonic, shape);
  const shapes = D.pair ? pos.shapes : [shape];
  return { tonic, minor, shape, shapes, shapeKey: shapes.join('+'), pos, keyName, toured: new Set([shapes.join('+')]) };
}
// the tour: on to the next CAGED shape (or pair) up the neck
function advanceShape(S, force = false) {
  if (!force && D.tourSlow && D.mode === 'pos') return; // the slow tour glides instead (drift)
  S.shape = G.nextShape(S.shape);
  S.pos = D.pair ? G.positionOfPair(S.tonic, S.shape) : G.positionOf(S.tonic, S.shape);
  S.shapes = D.pair ? S.pos.shapes : [S.shape];
  S.shapeKey = S.shapes.join('+');
  S.toured.add(S.shapeKey);
  S.gtPrev = null;
}
const keyLabel = (S) => `${T.noteName(S.tonic, true)} ${S.minor ? 'minor' : 'major'}`;
const shapeWord = (S) => `${S.shapeKey} shape${S.shapes.length > 1 ? 's' : ''}`;
const posLabel = (S) => (D.mode === 'pos' ? `${shapeWord(S)} · frets ${S.pos.lo}–${S.pos.hi}` : `${shapeWord(S)} everywhere`);

// a grip for a chord: in position, or this shape nearest the last chord; a colour chord with no grip here steps
// down to its plainer cousin
const scaleMode = () => D.play === 'scales';
const lineMode = () => D.play !== 'chords'; // scales, arpeggios, guide tones, modes: notes over the chord, not a grip
const usesArea = () => D.mode === 'pos' || D.voicing !== 'caged' || lineMode();
// a chord's quality as one voicing family plays it: triad sets play the triad, drop sets and shells need a seventh,
// shells cut colour chords back to their seventh
function adaptQFor(vid, q, spec, S) {
  const v = G.voicingById(vid);
  if (v.fam === 'tri' || v.fam === 'spread') return H.toTriad(q);
  if (v.fam && T.getChord(q).ivs.length < 4) q = H.toSeventh(q, spec.iv, { dominant: !!spec.rel, minorKey: S.minor });
  if (v.fam === 'shell') while (T.getChord(q).ivs.length > 4 && H.simpler(q)) q = H.simpler(q);
  return q;
}
const adaptQ = (q, spec, S) => adaptQFor(D.voicing, q, spec, S);
// every voicing the current set offers for this chord; a mix pools its families, each in its own chord weight
function familyPool(S, root, q, spec) {
  const v = G.voicingById(D.voicing);
  const pool = [];
  for (const id of v.mix || [D.voicing]) {
    const qq = adaptQFor(id, q, spec, S);
    const f = G.familyVoicings(root, qq, id, S.pos);
    pool.push(...(f.inside.length ? f.inside : f.outside.map((x) => ({ ...x, far: true }))).map((x) => ({ ...x, q: qq })));
  }
  return pool;
}
const lowMidi = (g) => Math.min(...g.notes.map((n) => n.midi));
const toneRels = (q) => [...new Set(T.getChord(q).ivs.map((iv) => H.semisOf(iv.replace(/^(b|#)?(9|11|13)$/, (m, a, n) => (a || '') + { 9: '2', 11: '4', 13: '6' }[n]))))];
// bass-line steering: smooth = smallest bass move; walk down / up = a step the right way, and when the walk runs out
// of room, one big jump back to start again
function bassScore(prev, g) {
  const b = lowMidi(g);
  if (!prev) return D.bassline === 'down' ? -b * 0.3 : D.bassline === 'up' ? b * 0.3 : 0;
  const d = b - lowMidi(prev);
  if (D.bassline === 'smooth') return Math.abs(d) * 0.6;
  const s = D.bassline === 'down' ? -d : d;
  if (s > 0) return s <= 2 ? (s - 1) * 0.5 : s <= 4 ? 1.5 : 3;
  if (s === 0) return 2.5;
  return 5 - Math.min(-s, 12) * 0.1;
}
function choose(pool, S, prev) {
  const sc = (x) => (D.bassline !== 'off' ? bassScore(prev, x) + (prev ? G.movement(prev, x) * 0.15 : 0) : prev ? G.movement(prev, x) : Math.abs(x.center - S.pos.mid)) + (x.far ? 3 : 0) + (x.cost || 0) * 0.2 - Math.min(x.notes.length, 5) * 0.25; // fuller grips win ties
  return pool.reduce((a, b) => (sc(a) <= sc(b) ? a : b));
}
// a grip for a chord in the current voicing set
function gripFor(S, root, q, prev, vl, spec = {}) {
  // a slash chord: a grip with that note in the bass, in the area (widened a little if it has to be)
  if (spec.bass && spec.bass !== '1') {
    const rel = H.semisOf(spec.bass);
    let pool = G.bassGrips(root, q, rel, S.pos);
    if (!pool.length) pool = G.bassGrips(root, q, rel, { lo: Math.max(0, S.pos.lo - 2), hi: Math.min(17, S.pos.hi + 2), mid: S.pos.mid }).map((x) => ({ ...x, far: true }));
    if (pool.length) return choose(pool, S, prev);
  }
  // Ted Greene: his grips for this chord in the area (the bass line steers the choice too); none: the CAGED grip
  if (D.voicing === 'tg') {
    const pool = TGV.voicingsFor(root, q, S.pos);
    if (pool.length) return choose(pool, S, prev);
    const c = G.gripInPosition(root, q, S.pos, prev);
    return c ? { ...c, noTG: true } : null;
  }
  // bass-line mode: any version in the area with any chord tone in the bass, steered by the line
  if (D.bassline !== 'off' && D.voicing !== 'open') {
    const pool = D.voicing === 'caged' || D.voicing === 'any'
      ? [...G.versionsIn(root, q, S.pos), ...toneRels(q).flatMap((rel) => G.bassGrips(root, q, rel, S.pos).slice(0, 6))]
      : familyPool(S, root, q, spec);
    if (pool.length) return choose(pool, S, prev);
  }
  if (D.voicing === 'open') {
    const g = G.voiceLeadPick(root, q, 'open', S.pos, prev);
    if (g) return g;
    const c = G.gripInPosition(root, q, S.pos, prev); // nothing open in this key: the CAGED grip instead
    return c ? { ...c, noOpen: true } : null;
  }
  if (G.voicingById(D.voicing).mix) { const pool = familyPool(S, root, q, spec); return pool.length ? choose(pool, S, prev) : null; }
  if (D.voicing !== 'caged') return G.voiceLeadPick(root, q, D.voicing, S.pos, prev);
  if (D.mode === 'pos') return G.gripInPosition(root, q, S.pos, prev, vl ? 0.6 : 0.12);
  // one shape everywhere: follow the last chord, but stay anchored to the key's position so it doesn't drift up the neck
  const near = prev ? (prev.center + S.pos.mid) / 2 : S.pos.mid;
  const gs = S.shapes.map((sh) => G.gripNear(root, q, sh, near)).filter(Boolean);
  return gs.length ? gs.reduce((a, b) => (Math.abs(a.center - near) <= Math.abs(b.center - near) ? a : b)) : null;
}
// the grip and the quality actually played; a colour chord with no grip here steps down to its plainer cousin
function voice(S, root, q, spec, prev, vl) {
  q = adaptQ(q, spec, S);
  let qq = q, grip = gripFor(S, root, qq, prev, vl, spec), plainer = null;
  while (!grip && H.simpler(qq)) { qq = H.simpler(qq); grip = gripFor(S, root, qq, prev, vl, spec); plainer = q; }
  if (!grip && D.mode === 'one' && D.voicing === 'caged') grip = G.gripInPosition(root, qq, { lo: Math.max(0, (prev?.center ?? S.pos.mid) - 3), hi: (prev?.center ?? S.pos.mid) + 3, mid: prev?.center ?? S.pos.mid });
  if (grip?.q) qq = grip.q;
  return { q: qq, grip, plainer };
}
const varyOn = () => (progLike() ? D.pcolour === 'var' : D.colour === 'var');
// every chord remembers the area it was made for (the tour moves on while it waits in the queue)
function realise(S, spec, q, prev, extra = {}) {
  const c = realiseCore(S, spec, q, prev, extra);
  c.snap = { pos: S.pos, shapes: S.shapes, shapeKey: S.shapeKey, shape: S.shape };
  c.place = D.tour || S.moved ? posLabel(S) : null;
  drift(S);
  return c;
}
// the slow tour: after each chord the area slides a fret, up the neck to the top and back down, so the shapes
// blend into each other instead of jumping; it's named after the key's CAGED shape it overlaps most
function drift(S) {
  if (!D.tour || !D.tourSlow || D.mode !== 'pos' || !S.pos) return;
  const span = Math.min(4, S.pos.hi - S.pos.lo);
  S.dir ||= 1;
  let lo = S.pos.lo + S.dir;
  if (lo + span > 15) { S.dir = -1; lo = S.pos.lo - 1; }
  if (lo < 0) { S.dir = 1; lo = S.pos.lo + 1; }
  let best = S.shape, bd = Infinity;
  for (const sh of G.SHAPES) {
    const w = G.positionOf(S.tonic, sh);
    for (const o of [-12, 0, 12]) { const d = Math.abs(w.lo + o - lo); if (d < bd) { bd = d; best = sh; } }
  }
  S.pos = { lo, hi: lo + span, shape: best, mid: lo + span / 2 };
  S.shape = best; S.shapes = [best]; S.shapeKey = best; S.toured.add(best);
}
// guide tones: the chord's 3rd and 7th inside the area, as two voices that each move as little as possible
function guideFor(S, root, q) {
  const [third, sev] = MC.targetsFor(q);
  const rootPc = T.notePc(root), cands = [];
  for (const iv of [third, sev]) {
    const pc = (rootPc + H.semisOf(iv)) % 12;
    for (let st = 1; st <= 6; st++) for (let f = S.pos.lo; f <= S.pos.hi; f++) if ((F_OPEN[st] + f) % 12 === pc) cands.push({ string: st, fret: f, midi: F_OPEN[st] + f, iv, note: T.transposeSemis(root, H.semisOf(iv)) });
  }
  const A = cands.filter((x) => x.iv === third), B = cands.filter((x) => x.iv === sev), prev = S.gtPrev;
  let best = null, bs = Infinity, swap = false;
  for (const a of A) for (const b of B) {
    if (a.string === b.string) continue;
    let sc, sw = false;
    if (prev) { const m1 = Math.abs(a.midi - prev[0].midi) + Math.abs(b.midi - prev[1].midi), m2 = Math.abs(a.midi - prev[1].midi) + Math.abs(b.midi - prev[0].midi); sc = Math.min(m1, m2); sw = m2 < m1; }
    else sc = Math.abs(a.string - b.string) + Math.abs((a.midi + b.midi) / 2 - 60) * 0.15;
    if (sc < bs) { bs = sc; best = [a, b]; swap = sw; }
  }
  if (!best) return null;
  const line = swap ? [best[1], best[0]] : best; // line[k] continues prev[k]
  const word = (d) => (d === 0 ? 'holds' : Math.abs(d) <= 2 ? `${Math.abs(d) === 1 ? 'half' : 'whole'} step ${d > 0 ? 'up' : 'down'}` : `leaps ${d > 0 ? 'up' : 'down'} ${Math.abs(d)} semitones`);
  const nm = (x) => `${T.prettyIv(x.iv)} ${T.noteName(x.note, true)}`;
  const moves = prev ? line.map((x, k) => `${nm(prev[k])} → ${nm(x)}: ${word(x.midi - prev[k].midi)}`) : [`Start on ${nm(best[0])} and ${nm(best[1])}`];
  S.gtPrev = line;
  return { notes: best, all: cands, moves, prev: prev || null };
}
// everything a chord can be practised as, made up front so the play mode can switch mid-run: the grip (chords), and
// over the chord as written, a scale, an arpeggio start, the guide-tone pair and (in mode mode) the targets
function realiseCore(S, spec, q, prev, extra = {}) {
  const root = H.spell(S.tonic, spec.iv);
  S.lastScale ||= {};
  const k = `${spec.iv}:${q}`;
  const solo = SC.pickScale(spec.iv, q, S.minor, D.scaleLevel, S.lastScale[k], T.notePc(S.tonic), D.src === 'genre' ? GN.genreById(D.genre).scales : null);
  S.lastScale[k] = solo;
  const line = { lq: q, lname: H.slashName(root, q, spec.bass), lrn: H.label(spec, q), solo, arp: { start: pickOne(T.getChord(q).ivs) }, guide: guideFor(S, root, q) };
  if (D.play === 'modal' || extra.modalRun) {
    const m = MC.modeById(D.modal);
    line.modal = { m, targets: MC.targetsFor(q), pcs: MC.modePcsFrom(S.tonic, m.id, root), charRel: ((T.notePc(T.transpose(S.tonic, m.char)) - T.notePc(root)) % 12 + 12) % 12, charNote: T.transpose(S.tonic, m.char) };
  }
  let v;
  if (varyOn()) {
    // variations: a related chord type in the key; with "smoothest" on, the one whose voicing moves least
    const cands = H.variations(q, spec.iv, S.minor);
    if (D.varVL && prev) {
      const tries = cands.map((qc) => voice(S, root, qc, spec, prev, extra.vl)).filter((x) => x.grip);
      v = tries.length ? tries.reduce((a, b) => (G.movement(prev, a.grip) + Math.random() * 0.4 <= G.movement(prev, b.grip) + Math.random() * 0.4 ? a : b)) : voice(S, root, q, spec, prev, extra.vl);
    } else v = voice(S, root, pickOne(cands), spec, prev, extra.vl);
  } else v = voice(S, root, q, spec, prev, extra.vl);
  const { grip, plainer } = v;
  const qq = v.q;
  // the bass actually played: a slash chord's own, or an inversion the bass line chose
  let bass = spec.bass && spec.bass !== '1' ? spec.bass : null;
  if (!bass && grip && D.bassline !== 'off') { const low = grip.notes.reduce((a, b) => (a.midi <= b.midi ? a : b)); if (low.iv && low.iv !== '1') bass = low.iv.replace(/^(b|#)?(9|11|13)$/, (m, a, n) => (a || '') + { 9: '2', 11: '4', 13: '6' }[n]); }
  return { spec, q: qq, root, bassIv: bass, name: H.slashName(root, qq, bass), rn: H.label(spec, qq, bass), grip, plainer, ...line, ...extra };
}

// sets: a random chord from the pool, never the same twice running
function colourFor(e) {
  if (D.colour === 'tri') return e.tri;
  if (D.colour === 'sev' || D.colour === 'var') return e.sev;
  return pickOne(e.col);
}
function setStream(S) {
  const pool = H.setPool(S.minor ? 'minor' : 'major', D.set);
  let last = null, prev = null, n = 0;
  return {
    next() {
      let spec, fn = '', tag = '', q;
      if (D.set === 'any') {
        do { spec = { iv: H.randomIv() }; q = pickOne(H.ANY_QUALITIES[D.colour]); } while (last && last.iv === spec.iv && last.q === q);
        spec.q = q;
      } else {
        let e;
        do { e = pickOne(pool); } while (pool.length > 1 && last && e === last.e);
        q = colourFor(e);
        spec = { iv: e.iv, q, rel: e.rel };
        fn = e.fn; tag = e.tag || '';
        last = { e };
      }
      if (D.set === 'any') last = { iv: spec.iv, q };
      if (D.tour && n > 0 && n % 8 === 0) { advanceShape(S); prev = null; }
      n++;
      const c = realise(S, spec, q, prev, { fn, tag, beats: D.beats });
      prev = c.grip;
      return c;
    },
  };
}
// a progression's colour: as written, or reduced to triads, or every chord a seventh, or 9ths/13ths/alt
function colourise(spec, next, i, minor) {
  const c = D.pcolour;
  if (c === 'as') return spec.q;
  const tri = H.toTriad(spec.q);
  if (c === 'tri') return tri;
  const sev = T.getChord(spec.q).ivs.length >= 4 ? spec.q : H.toSeventh(tri, spec.iv, { dominant: !!spec.rel, minorKey: minor });
  if (c === 'sev' || c === 'var') return sev;
  const opts = H.colourOptions(sev, spec.iv, { toMinor: next ? H.isMinorish(next.q) || E.cls(next.q) === 'hd' : false, minorKey: minor });
  return opts[i % opts.length];
}
// a chart's slots (each chord with its beats and bar), converted to the chosen mode if written in the other one
function slotsFor(item, minor, barOffset = 0) {
  const bars = L.resolve(item);
  const conv = !!item.minor !== minor;
  const slots = [];
  bars.forEach((b, bi) => b.forEach((spec) => {
    const beats = Math.max(1, Math.round(D.barBeats / b.length));
    slots.push({ spec: conv ? E.toParallel(spec, minor) : spec, beats, bar: bi + barOffset });
  }));
  slots.forEach((x, i) => { x.oid = i; });
  return slots;
}
// the progression's slots; for a genre, all its loops one after another (for the chord list and walkthrough)
function progSlots(minor) {
  if (D.src === 'genre') {
    const g = GN.genreById(D.genre);
    let off = 0;
    const all = [];
    for (const ch of g.charts) { const sl = slotsFor({ chart: ch, minor: g.minor }, minor, off); off = sl[sl.length - 1].bar + 1; all.push(...sl); }
    all.forEach((x, i) => { x.oid = i; });
    return all;
  }
  return slotsFor(prog(), minor);
}
// a genre: one of its typical loops, a new one every two times round
function genreStream(S, R) {
  const g = GN.genreById(D.genre);
  const charts = g.charts.map((ch) => slotsFor({ chart: ch, minor: g.minor }, S.minor));
  let ci = Math.floor(Math.random() * charts.length), cur = charts[ci], i = 0, loops = 0, prev = null;
  R.slots = cur;
  return {
    genre: true,
    next() {
      if (i >= cur.length) {
        i = 0; loops++;
        if (loops % 2 === 0 && charts.length > 1) { let n; do { n = Math.floor(Math.random() * charts.length); } while (n === ci); ci = n; cur = charts[ci]; }
        if (D.tour) { advanceShape(S); prev = null; }
        R.slots = cur;
      }
      const x = cur[i], nx = cur[(i + 1) % cur.length];
      const q = colourise(x.spec, nx.spec, x.oid + loops, S.minor);
      const c = realise(S, x.spec, q, prev, { beats: x.beats, bar: x.bar, slot: i, pass: loops, slots: cur });
      prev = c.grip;
      i++;
      return c;
    },
  };
}
// what an evolved chord is doing: standing in for the written chord, or a chord on the way to the next one
function roleIn(orig, x) {
  if (!x.sub) return null;
  const lab = (o) => H.label(o.spec);
  return x.half ? { kind: 'way', text: `on the way to ${lab(orig[(x.oid + 1) % orig.length])}`, why: x.sub } : { kind: 'swap', text: `in place of ${lab(orig[x.oid])}`, why: x.sub };
}
// the complexity dial: triads, as written, sevenths, colour tones, then colour with substitutions evolving the
// progression each time round (the top step); it can be turned during a run
const CX = [['tri', 'Simple'], ['as', 'As written'], ['sev', 'Sevenths'], ['col', 'Colour'], ['subs', 'Substitutions']];
const CX_BLURB = { tri: 'Every chord a plain triad.', as: 'The chords as the progression writes them.', sev: 'Every chord a seventh chord.', col: 'Colour tones: 9ths, 11ths, 13ths, altered dominants.', subs: 'Colour tones, and each time round a chord is swapped for a substitute (tritone sub, ii–V, secondary dominant, passing diminished); the screen says what each one replaces.', var: 'Variations: related chord types.' };
const subsOn = () => D.pcolour === 'subs';
function progStream(S, R) {
  const orig = progSlots(S.minor);
  const vl = prog().vl;
  let cur = orig, i = 0, pass = 0, prev = null;
  R.slots = cur; R.orig = orig;
  const roleOf = (x) => roleIn(orig, x);
  return {
    next() {
      if (i >= cur.length) {
        i = 0; pass++;
        const base = D.around !== 'off' ? AR.around(orig, S.minor, D.around, D.aroundAmt) : orig;
        if (D.evolve || subsOn()) { const r = E.evolve(D.around !== 'off' ? base : cur, orig, S.minor); cur = r.slots; R.pendingNote = r.note; } else cur = base;
        if (D.tour) { advanceShape(S); prev = null; }
        R.slots = cur;
      }
      const x = cur[i], nx = cur[(i + 1) % cur.length];
      const q = colourise(x.spec, nx.spec, x.oid + pass, S.minor);
      const c = realise(S, x.spec, q, prev, { beats: x.beats, bar: x.bar, slot: i, pass, sub: x.sub, vl, slots: cur, oid: x.oid, role: roleOf(x) });
      prev = c.grip;
      i++;
      return c;
    },
  };
}

// ---------- the roamer: the library's progressions in a shuffled order, a few times round each, until all are done ----------
// Major ones play in the major key, minor ones in the minor key on the same tonic. Done ones are remembered, so it
// carries on where it left off. Once in every shape: each progression goes round five times, a shape further up
// each time.
const roamMode = () => (D.roam.tour5 ? 'tour' : 'times');
const roamList = () => L.ALL.filter((p) => D.roam.cat === 'all' || p.cat === D.roam.cat);
const roamDone = () => ((D.roam.done ||= {})[`${D.roam.cat}|${roamMode()}`] ||= {});
const roamLeft = () => { const d = roamDone(); return roamList().filter((p) => !d[p.id]); };
const RESPELL = { minor: { Db: 'C#', Ab: 'G#', Gb: 'F#' }, major: { 'C#': 'Db', 'G#': 'Ab', 'D#': 'Eb', 'A#': 'Bb' } };
function roamStream(S, R) {
  const done = roamDone(), list = roamList();
  const todo = roamLeft();
  for (let k = todo.length - 1; k > 0; k--) { const j = Math.floor(Math.random() * (k + 1)); [todo[k], todo[j]] = [todo[j], todo[k]]; }
  const rounds = D.roam.tour5 ? 5 : D.roam.times;
  let item = null, cur = null, orig = null, i = 0, pass = 0, prev = null, last = null, idx = list.length - todo.length;
  function load() {
    item = todo.shift(); idx++;
    const minor = !!item.minor;
    if (minor !== S.minor) {
      const nm = T.noteName(S.tonic), re = RESPELL[minor ? 'minor' : 'major'][nm];
      if (re) S.tonic = T.parseNote(re);
      S.minor = minor; S.lastScale = {};
      S.pos = D.pair ? G.positionOfPair(S.tonic, S.shape) : G.positionOf(S.tonic, S.shape);
    }
    orig = slotsFor(item, minor); i = 0; pass = 0; prev = null;
    const first = D.around !== 'off' && (D.roam.tour5 ? 5 : D.roam.times) === 1 ? AR.around(orig, minor, D.around, D.aroundAmt) : orig;
    cur = subsOn() ? E.evolve(first, orig, minor).slots : first;
    R.roam = item; R.slots = cur; R.orig = orig;
  }
  if (todo.length) load();
  return {
    next() {
      if (!item) return { ...last, end: true };
      if (i >= cur.length) {
        i = 0; pass++;
        if (pass >= rounds) {
          done[item.id] = Date.now(); save();
          if (!todo.length) { item = null; return { ...last, end: true }; }
          load();
          if (D.roam.tour5) advanceShape(S);
        } else {
          const base = D.around !== 'off' ? AR.around(orig, S.minor, D.around, D.aroundAmt) : orig;
          cur = subsOn() ? E.evolve(base, orig, S.minor).slots : base;
          if (D.roam.tour5 || D.tour) { advanceShape(S); prev = null; }
        }
        R.slots = cur;
      }
      const x = cur[i], nx = cur[(i + 1) % cur.length];
      const q = colourise(x.spec, nx.spec, x.oid + pass, S.minor);
      const c = realise(S, x.spec, q, prev, { beats: x.beats, bar: x.bar, slot: i, pass, sub: x.sub, vl: item.vl, slots: cur, oid: x.oid, role: roleIn(orig, x) });
      c.roam = { name: item.name, by: item.by, cat: item.cat, round: pass + 1, rounds, idx, total: list.length, key: keyLabel(S) };
      prev = c.grip;
      last = c;
      i++;
      return c;
    },
  };
}
// around the progression: the palette it borrows from, and how much
function aroundCard() {
  return `<h3>Around the progression</h3>
      ${seg('around', AR.PALETTES, D.around)}
      ${D.around !== 'off' ? seg('aroundAmt', AR.AMOUNTS, D.aroundAmt) : ''}
      <p class="note">${esc(AR.PALETTE_BLURB[D.around])}${D.around !== 'off' ? ` The progression is the scaffold: the first time round it plays as written, then each time round ${D.aroundAmt === 'light' ? 'one chord' : D.aroundAmt === 'heavy' ? 'about half the chords' : 'about a quarter of the chords'} change, fresh from the original, and the screen says what each one replaces or leads into. Changeable during a run.` : ''}</p>`;
}
function roamCard() {
  const list = roamList(), left = roamLeft().length, n = list.length - left;
  return `
      <div class="chips">${[['all', 'Everything'], ...L.LIBRARY.map((g) => [g.cat, g.cat])].map(([v, l]) => `<button class="chip ${D.roam.cat === v ? 'on' : ''}" data-roamcat="${esc(v)}">${esc(l)}</button>`).join('')}</div>
      <h3>Complexity</h3>
      ${seg('pcolour', CX, D.pcolour === 'var' ? 'sev' : D.pcolour)}
      <p class="note">${esc(CX_BLURB[D.pcolour] || '')} Turn the dial on the run screen to change it as you play.</p>
      ${aroundCard()}
      <h3>Each progression</h3>
      <div class="seg" role="radiogroup">${[[1, 'Once'], [2, 'Twice'], [3, '3 times'], ['tour', 'Once in every shape']].map(([v, l]) => { const on = v === 'tour' ? D.roam.tour5 : !D.roam.tour5 && D.roam.times === v; return `<button data-roamtimes="${v}" class="${on ? 'on' : ''}" role="radio" aria-checked="${on}">${l}</button>`; }).join('')}</div>
      <p class="note">It roams through ${D.roam.cat === 'all' ? 'every progression and cadence in the library' : `the ${esc(D.roam.cat.toLowerCase())}`} in a shuffled order, ${D.roam.tour5 ? 'each once round in every CAGED shape, moving up a shape each time round' : `${D.roam.times === 1 ? 'once' : D.roam.times === 2 ? 'twice' : `${D.roam.times} times`} round each`}, then moves on; the one playing is named at the top. Major ones play in ${fmt(T.pretty(D.key === 'rand' ? 'C' : D.key))} major, minor ones in ${fmt(T.pretty(D.key === 'rand' ? 'C' : D.key))} minor. It finishes when every one has been played, and remembers where it got to.</p>
      <div class="roamprog"><i style="width:${list.length ? (n / list.length) * 100 : 0}%"></i></div>
      <p class="note"><b>${n} of ${list.length}</b> done.${n ? ' <button class="chip" data-act="roamreset">Start the list over</button>' : ''}</p>`;
}
function roamFinished() {
  const list = roamList();
  stop(); R = null;
  window.scrollTo(0, 0);
  $app.innerHTML = `
  <header class="chead"><span></span><h1>Roamed them all</h1><span></span></header>
  <section class="card end"><p>Every one of the <b>${list.length}</b> ${D.roam.cat === 'all' ? 'progressions and cadences' : esc(D.roam.cat.toLowerCase())} has been played${D.roam.tour5 ? ', each in all five shapes' : ''}.</p>
  <div class="actions"><button class="primary" data-e="again">Start the list over</button><button data-e="back">Back</button></div></section>`;
  $app.onclick = (e) => {
    const b = e.target.closest('[data-e]'); if (!b) return;
    if (b.dataset.e === 'again') { roamDone(); D.roam.done[`${D.roam.cat}|${roamMode()}`] = {}; save(); }
    setup();
  };
}

// mode mode: the mode's own chords, as its vamps (a new one every two times round) or any of them
function modalStream(S) {
  const m = MC.modeById(D.modal);
  const chords = MC.modeChords(S.tonic, m.id, D.colour === 'tri' ? 3 : 4);
  const byDeg = Object.fromEntries(chords.map((c) => [c.deg, c]));
  const vamps = m.vamps.filter((v) => v.every((d) => byDeg[d]));
  let vamp = null, vi = 0, loops = 0, prev = null, n = 0, last = null;
  return {
    modal: true,
    next() {
      let ch;
      if (D.modalSrc === 'vamp' && vamps.length) {
        if (!vamp || vi >= vamp.length) {
          if (vamp) loops++;
          if (vamp && D.tour && loops % 2 === 0) { advanceShape(S); prev = null; }
          if (!vamp || loops % 2 === 0) vamp = pickOne(vamps);
          vi = 0;
        }
        ch = byDeg[vamp[vi++]];
      } else {
        if (D.tour && n > 0 && n % 8 === 0) { advanceShape(S); prev = null; }
        do { ch = Math.random() < 0.3 ? byDeg[0] : pickOne(chords); } while (chords.length > 1 && ch === last);
        last = ch; n++;
      }
      const c = realise(S, { iv: ch.iv, q: ch.q }, ch.q, prev, { beats: D.beats, modalRun: true });
      prev = c.grip;
      return c;
    },
  };
}

// ---------- the neck diagram: the position stood upright, low E on the left ----------
const KIND = (iv) => (iv === '1' ? 'r' : /^(b?3)$/.test(iv) ? 't3' : /^(b5|5|#5)$/.test(iv) ? 't5' : /^(b?b?7)$/.test(iv) ? 't7' : 'tx');
function neckSVG(grip, { lo, hi, labels = D.labels, prev = null, band = null, small = false, tiny = false, bg = null } = {}) {
  if (!grip) return '<div class="cnone">No grip for this one here</div>';
  lo = Math.max(0, Math.min(lo, grip.lo));
  hi = Math.max(hi, grip.hi, lo + 4);
  const left = 50, sp = 44, top = 38, fh = 50;
  const rows = lo === 0 ? hi : hi - lo + 1;
  const W = left + 5 * sp + 26, H = top + rows * fh + 10;
  const x = (s) => left + (6 - s) * sp;
  const y = (f) => (f === 0 ? top - 17 : lo === 0 ? top + (f - 0.5) * fh : top + (f - lo + 0.5) * fh);
  let g = '';
  if (band) {
    const a = Math.max(band.lo, lo === 0 ? 1 : lo), b = Math.min(band.hi, hi);
    if (b >= a) g += `<rect x="${x(6) - 20}" y="${y(a) - fh / 2}" width="${5 * sp + 40}" height="${(b - a + 1) * fh}" rx="8" class="band"/>`;
  }
  for (let i = 0; i <= rows; i++) g += `<line x1="${x(6)}" y1="${top + i * fh}" x2="${x(1)}" y2="${top + i * fh}" class="${i === 0 && lo === 0 ? 'nut' : 'wire'}"/>`;
  for (let f = Math.max(1, lo); f <= hi; f++) {
    if (!tiny) g += `<text x="16" y="${y(f) + 4}" class="fnum">${f}</text>`;
    else if (f === Math.max(1, lo)) g += `<text x="22" y="${y(f) + 10}" class="fnum big">${f}</text>`;
    if ([3, 5, 7, 9, 15, 17].includes(f)) g += `<circle cx="${(x(4) + x(3)) / 2}" cy="${y(f)}" r="5" class="inlay"/>`;
    if (f === 12) g += `<circle cx="${(x(5) + x(4)) / 2}" cy="${y(f)}" r="5" class="inlay"/><circle cx="${(x(3) + x(2)) / 2}" cy="${y(f)}" r="5" class="inlay"/>`;
  }
  for (let s = 1; s <= 6; s++) g += `<line x1="${x(s)}" y1="${top}" x2="${x(s)}" y2="${H - 6}" class="str s${s}"/>`;
  // the key's CAGED shape, faintly: the tonic chord's notes across the area
  if (bg) for (const b of bg) if (b.fret >= lo && b.fret <= hi && (b.fret > 0 || lo === 0)) g += `<circle cx="${x(b.string)}" cy="${y(b.fret)}" r="${b.fret === 0 ? 10 : 13}" class="bg${b.root ? ' root' : ''}"/>`;
  const at = new Map(grip.notes.map((n) => [n.string, n]));
  // the previous chord: where each moving voice came from, and which notes are held
  if (prev && D.moves) {
    for (const p of prev.notes) {
      const n = at.get(p.string);
      if (n && n.fret === p.fret) continue;
      if (p.fret >= lo && p.fret <= hi && (p.fret > 0 || lo === 0)) g += `<circle cx="${x(p.string)}" cy="${y(p.fret)}" r="9" class="was"/>`;
    }
  }
  for (let s = 1; s <= 6; s++) if (!at.has(s) || (at.get(s).extra && !D.tgExtras)) g += `<text x="${x(s)}" y="${top - 12}" class="mute">×</text>`;
  for (const n of grip.notes) {
    if (n.extra && !D.tgExtras) continue;
    const lab = labels === 'finger' && n.finger !== undefined ? (n.finger || '○') : labels === 'note' ? T.noteName(n.note, true) : T.prettyIv(n.iv);
    const held = prev && D.moves && prev.notes.some((p) => p.string === n.string && p.fret === n.fret);
    const cls = `dot ${n.kind || KIND(n.iv)}${n.fret === 0 ? ' open' : ''}${held || n.mark ? ' held' : ''}${n.outer ? ' outer' : ''}${n.extra ? ' extra' : ''}`;
    const r = tiny ? (n.fret === 0 ? 13 : 18) : n.fret === 0 ? 12 : 16;
    g += `<g class="${cls}"><circle cx="${x(n.string)}" cy="${y(n.fret)}" r="${r}"/>${tiny ? '' : `<text x="${x(n.string)}" y="${y(n.fret) + 4.5}">${esc(lab)}</text>`}</g>`;
  }
  return `<svg viewBox="0 0 ${W} ${H}" class="neck${small ? ' small' : ''}${tiny ? ' tiny' : ''}" role="img" aria-label="Chord diagram">${g}</svg>`;
}
const LEGEND = '<div class="legend"><span class="k r">root</span><span class="k t3">3rd</span><span class="k t5">5th</span><span class="k t7">7th</span><span class="k tx">colour</span></div>';
// open-string voicings: from the nut when they sit low, else around the fretted notes (opens drawn above)
const openWindow = (g) => (g.lo <= 5 ? { lo: 0, hi: Math.max(4, g.hi), band: null } : { lo: g.lo - 1, hi: g.lo + 3, band: null });
function windowFor(S, grip) {
  if (D.voicing === 'open' && grip && !grip.noOpen && !lineMode()) return openWindow(grip);
  if (usesArea()) return { lo: Math.max(0, S.pos.lo - (S.pos.lo > 0 ? 1 : 0)), hi: S.pos.hi + 1, band: S.pos };
  return { lo: Math.max(0, (grip?.lo ?? 1) - 1), hi: (grip?.lo ?? 1) + 4, band: null };
}

function varNote() {
  return `<div class="chips"><button class="chip ${D.varVL ? 'on' : ''}" data-act="varVL">Smoothest variations</button></div><p class="note">Each chord becomes a related type that keeps its job and stays in the key: I as 6, add9, sus2, 6/9, maj9; ii as m6, m9, m11; V7 as 7sus4, 9, 13 (♭9 and ♯9 in minor). ${D.varVL ? 'With “smoothest” on, it picks the type whose voicing moves least from the last chord.' : 'Picked at random.'} Triad voicing sets flatten these back to triads.</p>`;
}
function modalCard() {
  const m = MC.modeById(D.modal);
  return `<section class="card">
    <h2>Mode</h2>
    <select id="modal" class="select" aria-label="Mode">${MC.MODES.map((x) => `<option value="${x.id}" ${x.id === D.modal ? 'selected' : ''}>${esc(x.name)}</option>`).join('')}</select>
    ${seg('modalSrc', [['vamp', 'Its vamps'], ['all', 'Any of its chords']], D.modalSrc)}
    <h3>Chords</h3>
    ${seg('colour', [['tri', 'Triads'], ['sev', 'Sevenths']], D.colour === 'tri' ? 'tri' : 'sev')}
    <p class="note">${esc(m.name[0].toUpperCase() + m.name.slice(1))}: ${esc(m.feel)}. Its colour note is the ${fmt(T.prettyIv(m.char))}. ${D.modalSrc === 'vamp' ? 'Its typical vamps loop, a new one every two times round.' : 'Any chord of the mode, the tonic most often.'} On each chord the 3rd and 7th are ringed: land a phrase on one of them as the chord arrives.</p>
  </section>`;
}
function genreCard() {
  const g = GN.genreById(D.genre);
  return `<div class="chips">${GN.GENRES.map((x) => `<button class="chip ${D.genre === x.id ? 'on' : ''}" data-genre="${x.id}">${esc(x.name)}</button>`).join('')}</div>
      <p class="note"><b>${esc(g.name)}</b>: ${esc(g.guide.feel)} Strum: ${esc((RHYTHMS.find((r) => r.id === g.rhythm) || RHYTHMS[0]).name)} (set in Tempo). ${g.tempo[0]}–${g.tempo[1]} bpm. ${g.charts.length} typical loops, a new one every two times round${g.minor ? '; minor key' : ''}. In Scales, its own scales come first.</p>
      <button class="toggle" data-act="gguide"><b>Genre guide</b><small>Rhythm and strumming, the chords it uses, how to solo, who to listen to</small></button>
      <h3>Colour</h3>
      ${seg('pcolour', [['as', 'As the genre plays them'], ['tri', 'Triads'], ['sev', 'Sevenths'], ['col', 'Colour tones'], ['var', 'Variations']], D.pcolour)}`;
}
function guideHTML(g) {
  const sec = (t, x) => `<h3>${t}</h3><p>${esc(x)}</p>`;
  const r = RHYTHMS.find((x) => x.id === g.rhythm) || RHYTHMS[0];
  return `<div class="gguide">${sec('Feel', g.guide.feel)}${sec(`Rhythm and strumming · ${r.name}`, g.guide.rhythm)}<div class="rhythm demo">${Array.from({ length: 8 }, (_, e) => `<i class="${r.hits.includes(e) ? 'hit' : ''}${e % 2 ? ' and' : ''}"><small>${e % 2 ? '&' : e / 2 + 1}</small></i>`).join('')}</div>${sec('Chords', g.guide.chords)}${sec('Soloing', g.guide.solo)}<h3>Scales it uses</h3><p>${g.scales.map((id) => esc((SC.SCALES.find((x) => x.id === id) || { name: id }).name)).join(', ')}</p><h3>Tempo</h3><p>${g.tempo[0]}–${g.tempo[1]} bpm</p>${sec('Listen to', g.guide.listen)}</div>`;
}
function guidePage() {
  const g = GN.genreById(D.genre);
  $app.innerHTML = `<header class="chead"><button class="icon" data-g="back" aria-label="Back">‹</button><h1>${esc(g.name)}</h1><span></span></header><section class="card">${guideHTML(g)}</section>`;
  $app.onclick = (e) => { if (e.target.closest('[data-g="back"]')) setup(); };
  window.scrollTo(0, 0);
}
function openGuide() {
  const el = document.getElementById('sheet');
  if (!el) return;
  const g = GN.genreById(D.genre);
  el.innerHTML = `<div class="sheet-head"><div><b>${esc(g.name)}</b><small>Genre guide</small></div><button class="icon" data-r="close-sheet" aria-label="Close">✕</button></div>${guideHTML(g)}`;
  el.hidden = false; el.scrollTop = 0;
  document.body.classList.add('locked');
}
// Ted Greene: is the private pack on this device?
function tgStatus() {
  if (!TGV.ready() && !tgStatus.tried) { tgStatus.tried = true; TGV.load().then(() => { if (!R && D.app === 'changes' && D.voicing === 'tg') setup(); }); return '<p class="note">Looking for your Ted Greene pack…</p>'; }
  if (TGV.ready()) return `<p class="note tgok">${TGV.count()} Ted Greene forms, from your ${TGV.from() === 'files' ? 'own copy of the book on this computer' : 'private pack on this device'}. It stays here: never published.</p><div class="chips"><button class="chip ${D.tgExtras ? 'on' : ''}" data-act="tgExtras">Show his extra notes</button></div>`;
  return `<p class="note">No Ted Greene pack on this device yet. Import the pack file (<b>tedgreene-pack.json</b> from the private folder on your Mac; AirDrop it to the phone). It’s kept on this device only. Until then, chords use the CAGED grips.</p><label class="chip filechip">Import the pack<input type="file" id="tgpackc" accept=".json,application/json" hidden></label>`;
}
// what a voicing set does, in a sentence or two
function voicingBlurb() {
  const v = G.voicingById(D.voicing);
  if (v.blurb) return esc(v.blurb);
  if (v.mix) return esc(`Chord by chord, whichever of ${v.mix.map((m) => G.voicingById(m).name.split(' · ')[0].toLowerCase()).filter((x, i, a) => a.indexOf(x) === i).join(', ').replace(/, ([^,]*)$/, ' or $1')} moves least from the last chord, so the type changes to keep the voice leading smooth. Each is played in its own weight (triads as triads, shells and drops as sevenths).`);
  const sets = v.sets.map((x) => x.join('-')).join(', ');
  const led = 'whichever one is closest to the last chord, so the voices move as little as possible';
  return esc({
    tri: `Every chord as a close triad on strings ${sets}, in ${led}. Seventh and colour chords are played as their triads.`,
    spread: `Every chord as a spread (open) triad, one voice lifted an octave so it skips a string, on any of ${v.sets.length} string sets, in ${led}. Sevenths and colour chords become triads.`,
    shell: `Root, 3rd and 7th (1–3–7 or 1–7–3) with the root ${v.id === 'shell:6' ? 'on the 6th string' : v.id === 'shell:5' ? 'on the 5th string' : 'on the 6th or 5th string'}: the jazz comping skeleton, in ${led}. Triads become seventh chords; colour chords are reduced to their seventh.`,
    d2: `Every chord as a drop 2 voicing on strings ${sets}, in ${led}. Triads become seventh chords; bigger chords keep their four most telling notes.`,
    d3: `Every chord as a drop 3 voicing on strings ${sets}, in ${led}. Triads become seventh chords; bigger chords keep their four most telling notes.`,
    d24: `Drop 2&4: the widest four-note voicing, spread over six strings (${sets}), in ${led}. Triads become seventh chords.`,
  }[v.fam]);
}

// ---------- the other sections, each its own screen ----------
let stopPractice = null;
function openCall() {
  stopPractice = CR.renderCall($app, { D, save, neckSVG, esc, fmt, keys: MAJOR_KEYS, onBack: () => { stopPractice = null; D.app = 'changes'; save(); setup(); } });
}
// Listen: chords voiced by the same engine, with its own voicing set, bass and scale level (the run's settings are
// put back afterwards)
function listenChord(S, spec, prev, o) {
  const over = { voicing: o.voicing, mode: 'pos', bassline: o.bass, play: 'chords', pcolour: 'as', colour: 'sev', src: 'set', scaleLevel: o.scaleLevel, tour: false };
  const keep = {};
  for (const k in over) { keep[k] = D[k]; D[k] = over[k]; }
  try { return realise(S, spec, spec.q, prev, { vl: true }); } finally { Object.assign(D, keep); }
}
function openListen() {
  stopPractice = LS.renderListen($app, { D, save, neckSVG, esc, fmt, mine, realise: listenChord, legend: LEGEND, KIND, onBack: () => { stopPractice = null; D.app = 'changes'; save(); setup(); } });
}
// Workouts: systematic coverage; its roamer entry runs the Chord changes roamer once round each progression in
// every shape
function openWorkouts() {
  stopPractice = WK.renderWorkouts($app, { D, save, neckSVG, esc, fmt, legend: LEGEND, onBack: () => { stopPractice = null; D.app = 'changes'; save(); setup(); },
    startRoamer: () => { stopPractice = null; D.app = 'changes'; D.src = 'roam'; D.play = 'chords'; D.roam.tour5 = true; D.roam.cat = 'all'; save(); setup(); run(); } });
}
function openFree() {
  stopPractice = FS.renderFreeScale($app, { D, save, neckSVG, esc, fmt, KIND, onBack: () => { stopPractice = null; D.app = 'changes'; save(); setup(); } });
}
// Borrowed chords: each one explained, in all five shapes, and its progressions sent to Chord changes round the shapes
function openBorrowed() {
  stopPractice = BC.renderBorrowed($app, { D, save, neckSVG, esc, fmt, onBack: () => { stopPractice = null; D.app = 'changes'; save(); setup(); },
    onPractise: practiseFrom, progress: progProgress });
}
// how far a library progression has got: the best clean tempo per shape, the tempo that counts as done, done in all five
function progProgress(id, minor) {
  const k = `p:${id}:${minor ? 'minor' : 'major'}`, tgt = L.resolve(L.byId(id)).some((b) => b.length > 1) ? 100 : 120;
  return { rec: record(k), tgt, all: complete(k, tgt), html: shapeProgress(k, tgt) };
}
// play a library progression in Chord changes: in one CAGED shape, round and round, or touring all five
function practiseFrom(id, minor, key, where = 'E') {
  D.returnTo = D.app; // after the run, back to the chord being worked on
  stopPractice = null; D.app = 'changes'; D.src = 'prog'; D.prog = id; D.kt = minor ? 'minor' : 'major'; D.key = key; D.mode = 'pos'; D.play = 'chords'; D.pcolour = 'as';
  D.tour = where === 'all'; D.tourSlow = false; D.shape = where === 'all' ? 'C' : where; save(); setup(); run();
}
// Chord scales: each chord's scale, fingered in every CAGED shape and 3 per string, over the held chord
// Chromatic chords: secondary dominants, tritone subs, diminished and augmented chords, the same screen as Borrowed chords
function openChromatic() {
  stopPractice = BC.renderBorrowed($app, { D, save, neckSVG, esc, fmt, onBack: () => { stopPractice = null; D.app = 'changes'; save(); setup(); }, onPractise: practiseFrom, progress: progProgress }, BC.CHROM_CFG);
}
function openChordScales() {
  stopPractice = CS.renderChordScales($app, { D, save, neckSVG, esc, fmt, KIND, onBack: () => { stopPractice = null; D.app = 'changes'; save(); setup(); } });
}
function openSolo() {
  stopPractice = SO.renderSolo($app, { D, save, neckSVG, esc, fmt, realise: listenChord, legend: LEGEND, KIND, onBack: () => { stopPractice = null; D.app = 'changes'; save(); setup(); } });
}

// ---------- setup ----------
function seg(name, opts, cur) {
  // data-bar-beats reads back as dataset.barBeats (HTML lowercases data-barBeats)
  const attr = name.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
  return `<div class="seg" role="radiogroup">${opts.map(([v, l]) => `<button data-${attr}="${v}" class="${String(cur) === String(v) ? 'on' : ''}" role="radio" aria-checked="${String(cur) === String(v)}">${l}</button>`).join('')}</div>`;
}
function shapeProgress(k, tgt) {
  const r = D.done[k] || {};
  return `<div class="prog-shapes">${G.SHAPES.map((s) => { const b = r[s] || 0; return `<span class="ps ${b >= tgt ? 'ok' : b ? 'part' : ''}" title="${s} shape${b ? `: best ${b} bpm` : ''}"><b>${s}</b>${b ? `<small>${b}</small>` : ''}</span>`; }).join('')}</div>`;
}
function progOptions() {
  const own = mine();
  return (own.length ? `<optgroup label="My progressions">${own.map((p) => `<option value="${p.id}" ${p.id === D.prog ? 'selected' : ''}>${esc(p.name)}${p.minor ? ' (minor)' : ''}</option>`).join('')}</optgroup>` : '') + L.LIBRARY.map((g) => `<optgroup label="${esc(g.cat)}">${L.ALL.filter((p) => p.cat === g.cat).map((p) => {
    const kt = p.minor ? 'minor' : 'major';
    const tgt = L.resolve(p).some((b) => b.length > 1) ? 100 : 120;
    const done = complete(`p:${p.id}:${kt}`, tgt) || complete(`p:${p.id}:${kt === 'major' ? 'minor' : 'major'}`, tgt);
    return `<option value="${p.id}" ${p.id === D.prog ? 'selected' : ''}>${done ? '✓ ' : ''}${esc(p.name)}${p.minor ? ' (minor)' : ''}</option>`;
  }).join('')}</optgroup>`).join('');
}
function chartHTML(slots, { cur = -1, tonic = null } = {}) {
  const bars = [];
  slots.forEach((x, i) => { (bars[x.bar] ||= []).push({ x, i }); });
  return `<div class="chart">${bars.map((b) => `<div class="bar">${(b || []).map(({ x, i }) => {
    const nm = tonic ? `<span class="cname">${fmt(H.slashName(H.spell(tonic, x.spec.iv), x.spec.q, x.spec.bass))}</span>` : '';
    return `<span class="ch${i === cur ? ' cur' : ''}${x.sub ? ' sub' : ''}" ${x.sub ? `title="${esc(x.sub)}"` : ''}><span class="cnum">${fmt(H.label(x.spec))}</span>${nm}</span>`;
  }).join('')}</div>`).join('')}</div>`;
}

function setup() {
  stop();
  if (stopPractice) { stopPractice(); stopPractice = null; }
  if (D.app === 'practice') { D.app = 'free'; save(); } // Scale practice is now part of Free scales
  if (D.app === 'call') return openCall();
  if (D.app === 'listen') return openListen();
  if (D.app === 'workouts') return openWorkouts();
  if (D.app === 'solo') return openSolo();
  if (D.app === 'free') return openFree();
  if (D.app === 'borrow') return openBorrowed();
  if (D.app === 'cscale') return openChordScales();
  if (D.app === 'chrom') return openChromatic();
  const minor = isMinor();
  const keys = keysFor(minor);
  if (D.key !== 'rand' && !keys.includes(D.key)) D.key = minor ? ({ Db: 'C#', Ab: 'G#' }[D.key] || D.key) : ({ 'C#': 'Db', 'G#': 'Ab' }[D.key] || D.key);
  const p = prog();
  const S0 = { tonic: T.parseNote(D.key === 'rand' ? 'C' : D.key), minor, shape: D.shape === 'rand' ? 'C' : D.shape };
  S0.pos = D.pair ? G.positionOfPair(S0.tonic, S0.shape) : G.positionOf(S0.tonic, S0.shape);
  S0.shapes = D.pair ? S0.pos.shapes : [S0.shape]; S0.shapeKey = S0.shapes.join('+');
  const tgt = target();
  const sets = H.SETS[D.kt];
  const conv = D.src === 'prog' && !!p.minor !== minor;
  $app.innerHTML = `
  <header class="chead">${standalone ? '<span></span>' : '<a class="cback" href="./" aria-label="Guitar Cards">‹</a>'}<h1>CAGED Changes</h1><span></span></header>
  <p class="lead">${{ chords: 'Pick a key and a shape. The beat keeps time and the chords keep coming. Play each one in the shape as it arrives.', scales: 'The chords keep coming on the beat; for each one you get a scale to solo over it, inside the shape.', arps: 'The chords keep coming; play each one as an arpeggio through the shape, starting from the tone it names.', guide: 'The chords keep coming; play just their 3rds and 7ths as two lines that move as little as possible.', modal: 'Pick a mode. Its own chords vamp on the beat; solo in the shape and land on each chord’s 3rd or 7th.' }[D.play]}</p>
  ${seg('app', [['changes', 'Chord changes'], ['free', 'Free scales'], ['borrow', 'Borrowed chords'], ['chrom', 'Chromatic chords'], ['cscale', 'Chord scales'], ['call', 'Call and response'], ['listen', 'Listen'], ['workouts', 'Workouts'], ['solo', 'Soloing']], D.app || 'changes')}
  ${qsCard()}
  ${seg('play', [['chords', 'Chords'], ['arps', 'Arpeggios'], ['guide', 'Guide tones'], ['scales', 'Scales'], ['modal', 'Modes']], D.play)}

  <section class="card">
    <h2>${D.play === 'modal' ? 'Tonic' : 'Key'}</h2>
    ${D.play === 'modal' ? '' : seg('kt', [['major', 'Major'], ['minor', 'Minor']], D.kt)}
    <div class="chips">${['rand', ...keys].map((k) => `<button class="chip ${D.key === k ? 'on' : ''}" data-key="${k}">${k === 'rand' ? 'Any' : fmt(T.pretty(k)) + (minor ? 'm' : '')}</button>`).join('')}</div>
    <h2>Shape</h2>
    <div class="chips shapes">${['rand', ...G.SHAPES].map((s) => `<button class="chip ${D.shape === s ? 'on' : ''}" data-shape="${s}">${s === 'rand' ? 'Any' : D.pair ? `${s}+${G.nextShape(s)}` : s}</button>`).join('')}</div>
    <div class="chips"><button class="chip ${D.pair ? 'on' : ''}" data-act="pair">Two shapes at once</button><button class="chip ${D.tour ? 'on' : ''}" data-act="tour">Tour all five shapes</button>${D.tour && D.mode === 'pos' ? `<button class="chip ${D.tourSlow ? 'on' : ''}" data-act="tourSlow">Slowly</button>` : ''}</div>
    ${D.tour && D.tourSlow && D.mode === 'pos' ? `<p class="note">Slowly: after every chord the area slides one fret, up the neck to the top and back down, so one shape melts into the next; the name of the shape you’re passing through is shown as you go. Finish a full sweep and a clean run counts for every shape you passed.</p>` : D.tour ? `<p class="note">The run moves up the neck through the shapes, ${G.SHAPES.join(' → ')}, starting from the one you pick: a new shape each time round the progression or vamp (every 8 chords in a chord set). Finish a full lap and a clean run counts for every shape you passed through.</p>` : ''}
    ${seg('mode', [['pos', 'Stay in position'], ['one', 'One shape everywhere']], D.mode)}
    <p class="note">${D.mode === 'pos'
      ? `The key’s ${D.pair ? `${S0.shapeKey} shapes mark` : `${S0.shape} shape marks`} out ${D.pair ? 'an area' : 'a position'}${D.key !== 'rand' && D.shape !== 'rand' ? ` (frets ${S0.pos.lo}–${S0.pos.hi} in ${fmt(T.pretty(D.key))}${minor ? 'm' : ''})` : ''}. Every chord is played inside it, in whichever CAGED shape of that chord lives there.`
      : `Every chord in the ${D.pair ? `${S0.shapeKey} shapes (whichever is nearer)` : `${S0.shape} shape`}, moving up and down the neck to find its root.`}</p>
  </section>

  ${D.play === 'arps' || D.play === 'guide' ? `<section class="card"><h2>${D.play === 'arps' ? 'Arpeggios' : 'Guide tones'}</h2><p class="note">${D.play === 'arps' ? 'Each chord’s tones across the shape, coloured by job; the ringed tone is where to start. Run it up and back, then try starting from the next chord tone in time.' : 'For each chord the 3rd and 7th (a triad: 3rd and root), chosen inside the shape so each line moves as little as possible: 7ths fall to 3rds, 3rds hold or step. The ringed pair is this chord’s, the dashed circles where they came from.'} Turn on <b>Wider</b> during a run to see two frets past each side of the shape.</p></section>` : ''}
  ${D.play === 'arps' || D.play === 'guide' || D.play === 'modal' ? '' : scaleMode() ? `<section class="card">
    <h2>Scales</h2>
    ${seg('scaleLevel', [[1, 'Easy'], [2, 'Medium'], [3, 'Hard'], [4, 'Exotic'], ['any', 'Mix']], D.scaleLevel)}
    <p class="note">${{ 1: 'Pentatonics, blues and the key’s own mode for each chord: inside sounds.', 2: 'One or two notes outside the key, and the everyday jazz scales: Lydian dominant, altered, Phrygian dominant, diminished, bebop.', 3: 'Rarer melodic- and harmonic-minor modes, harmonic major, and modes that bend three or more notes.', 4: 'Double harmonic, Hungarian, Neapolitan, Persian, enigmatic, Japanese pentatonics: wherever they genuinely fit.', any: 'Anything that works, any level.' }[D.scaleLevel]} Only scales that hold every chord tone (or, for pentatonics, leave the clashing ones out) are offered. When a chord has nothing at your level, the nearest level is used.</p>
  </section>` : `  <section class="card">
    <h2>Voicings</h2>
    <select id="voicing" class="select" aria-label="Voicing set">${[...new Set(G.VOICINGS.map((v) => v.group))].map((g) => `<optgroup label="${esc(g)}">${G.VOICINGS.filter((v) => v.group === g).map((v) => `<option value="${v.id}" ${v.id === D.voicing ? 'selected' : ''}>${esc(v.name)}</option>`).join('')}</optgroup>`).join('')}</select>
    <p class="note">${voicingBlurb()}</p>
    ${D.voicing === 'tg' ? tgStatus() : ''}
    <h3>Bass line</h3>
    ${seg('bassline', [['off', 'Off'], ['smooth', 'Smooth'], ['down', 'Walk down'], ['up', 'Walk up']], D.bassline)}
    <p class="note">${{ off: 'Each chord in its usual voicing; slash chords in a progression still get their bass.', smooth: 'Inversions are chosen so the bass moves as little as possible.', down: 'Inversions are chosen so the bass walks down by step; when it runs out of room it jumps back up and starts again.', up: 'Inversions are chosen so the bass climbs by step; when it runs out of room it drops back and starts again.' }[D.bassline]} Inversions show as slash chords: C/E, numeral I/3 (the bass as a degree of the key).${D.bassline !== 'off' && !D.pair ? ' Bass lines need room: try “Two shapes at once”.' : ''}</p>
  </section>`}

  ${D.play === 'modal' ? modalCard() : `  <section class="card">
    <h2>Chords</h2>
    ${seg('src', [['set', 'Chord sets'], ['prog', 'Progressions'], ['genre', 'Genres'], ['roam', 'Roamer']], D.src)}
    ${D.src === 'roam' ? roamCard() : D.src === 'genre' ? genreCard() : D.src === 'set' ? `
      <div class="sets">${sets.map((s) => `<button class="set ${D.set === s.id ? 'on' : ''}" data-set="${s.id}"><b>${esc(s.name)}</b><small>${esc(s.blurb)}</small></button>`).join('')}</div>
      <h3>Colour</h3>
      ${seg('colour', H.COLOURS.map((c) => [c.id, c.name]), D.colour)}
      <p class="note">${esc(H.COLOURS.find((c) => c.id === D.colour).blurb)}</p>${D.colour === 'var' ? varNote() : ''}`
    : `
      <select id="prog" class="select" aria-label="Progression">${progOptions()}</select>
      <div class="chips"><button class="chip" data-act="newprog">＋ New progression</button>${prog().cat === 'My progressions' ? '<button class="chip" data-act="editprog">Edit</button>' : ''}</div>
      <p class="note"><b>${esc(p.name)}</b> · ${esc(p.by)}${p.vl ? ' · a voice-leading study: the grips are chosen to move as little as possible' : ''}${p.bassLine ? ' · slash chords: each gets a grip with that bass note; “Two shapes at once” gives the line room' : ''}${conv ? ` · <i>written in ${p.minor ? 'minor' : 'major'}, converted to ${D.kt}</i>` : ''}</p>
      ${chartHTML(progSlots(minor), { tonic: S0.tonic })}
      <h3>Colour</h3>
      ${seg('pcolour', [...CX, ['var', 'Variations']], D.pcolour)}
      <p class="note">${esc(CX_BLURB[D.pcolour] || '')} A complexity dial on the run screen changes it as you play.</p>
      ${D.pcolour === 'var' ? varNote() : ''}
      ${aroundCard()}
      <button class="toggle ${D.evolve ? 'on' : ''}" data-act="evolve"><b>Evolving mode ${D.evolve ? 'on' : 'off'}</b><small>Each time round, one chord is swapped for another with the same job (iii or vi for I, ii for IV, ♭II7 for V7), or a ii–V, secondary dominant or passing diminished slips in. Old swaps drift back.</small></button>`}
  </section>`}

  <section class="card">
    <h2>Show</h2>
    <div class="chips"><button class="chip ${D.nums ? 'on' : ''}" data-act="nums">Numerals</button><button class="chip ${D.names ? 'on' : ''}" data-act="names">Chord names</button><button class="chip ${D.neck ? 'on' : ''}" data-act="neck">Neck diagram</button></div>
    <p class="note">At least one of numeral and name stays on. All three can be switched during a run too. With the neck off it’s just the beat and the chord.</p>
    ${D.neck ? `<h3>Show the neck</h3>
    ${seg('diagram', [['now', 'Right away'], ['half', 'Halfway'], ['tap', 'On tap']], D.diagram)}` : ''}
    <h3>Dots show</h3>
    ${seg('labels', [['iv', 'Intervals'], ['finger', 'Fingers'], ['note', 'Notes']], D.labels)}
    <div class="chips"><button class="chip ${D.hint ? 'on' : ''}" data-act="hint">Name the shape</button><button class="chip ${D.moves ? 'on' : ''}" data-act="moves">Show held notes</button></div>
  </section>

  <section class="card">
    <h2>Tempo</h2>
    <div class="tempo"><button data-act="bpm-" aria-label="Slower">−</button><b>${D.bpm}<small> bpm</small></b><button data-act="bpm+" aria-label="Faster">+</button></div>
    <input type="range" id="bpm" min="30" max="220" step="2" value="${D.bpm}" aria-label="Tempo">
    ${D.src === 'set'
      ? `<h3>Change chord every</h3>${seg('beats', [[1, '1 beat'], [2, '2'], [4, '4 (a bar)'], [8, '8']], D.beats)}`
      : `<h3>Beats in a bar</h3>${seg('barBeats', [[2, '2 (double time)'], [4, '4'], [8, '8 (half time)']], D.barBeats)}`}
    <h3>Rhythm</h3>
    <div class="chips">${RHYTHMS.map((r) => `<button class="chip ${D.rhythm === r.id ? 'on' : ''}" data-rhythm="${r.id}">${esc(r.name)}</button>`).join('')}</div>
    <p class="note">${esc(rhythm().blurb)}${D.rhythm !== 'ring' ? ' A strip under the beat shows where to strike, the current eighth lit.' : ''}</p>
    <div class="chips"><button class="chip ${D.countIn ? 'on' : ''}" data-act="countIn">Count-in</button><button class="chip ${D.click ? 'on' : ''}" data-act="click">Click</button>${D.rhythm !== 'ring' ? `<button class="chip ${D.hearRhythm ? 'on' : ''}" data-act="hearRhythm">Hear the rhythm</button>` : ''}</div>
    <p class="note">The dots light up on every beat${D.click ? ' and the click sounds' : ''}${D.rhythm !== 'ring' && D.hearRhythm ? '; a soft muted strum plays the rhythm on its hits' : ''}. Mute it all during a run with Mute.</p>
  </section>

  <section class="card">
    <h2>Progress</h2>
    <p class="note">${D.src === 'roam' ? `The roamer, ${D.roam.cat === 'all' ? 'everything' : esc(D.roam.cat.toLowerCase())},` : D.src === 'genre' ? `<b>${esc(GN.genreById(D.genre).name)}</b> in ${D.kt}` : D.src === 'prog' ? `<b>${esc(p.name)}</b> in ${D.kt}` : `<b>${esc(sets.find((s) => s.id === D.set).name)}</b>, ${esc(H.COLOURS.find((c) => c.id === D.colour).name.toLowerCase())}, ${D.kt}`} is done when you’ve played it cleanly in all five shapes at <b>${tgt} bpm</b>${D.src === 'prog' ? ' with 4 beats a bar' : ' changing every bar'} (or the same speed of change at other settings). You confirm each run yourself.</p>
    ${shapeProgress(doneKey(), tgt)}
    ${complete(doneKey(), tgt) ? '<p class="done">✓ Done in every shape</p>' : ''}
  </section>

  <div class="actions"><button class="primary" data-act="go">▶ Start</button><button data-act="walk">${scaleMode() ? 'Scale options' : D.play === 'chords' ? 'Walkthrough' : 'All chords'}</button></div>`;

  $app.onclick = (e) => {
    const b = e.target.closest('button'); if (!b) return;
    const d = b.dataset;
    const redraw = () => { save(); setup(); };
    for (const k of ['kt', 'key', 'shape', 'mode', 'src', 'set', 'colour', 'pcolour', 'diagram', 'labels', 'play', 'bassline', 'rhythm', 'modalSrc', 'app', 'around', 'aroundAmt']) if (d[k] !== undefined) { D[k] = d[k]; if (k === 'app') D.returnTo = null; return redraw(); }
    for (const k of ['beats', 'barBeats']) if (d[k] !== undefined) { D[k] = Number(d[k]); return redraw(); }
    if (d.genre) {
      const g = GN.genreById(d.genre);
      D.genre = g.id; D.rhythm = g.rhythm; D.kt = g.minor ? 'minor' : 'major';
      if (D.bpm < g.tempo[0] || D.bpm > g.tempo[1]) D.bpm = g.tempo[0];
      return redraw();
    }
    if (d.scaleLevel !== undefined) { D.scaleLevel = d.scaleLevel === 'any' ? 'any' : Number(d.scaleLevel); return redraw(); }
    if (d.roamcat !== undefined) { D.roam.cat = d.roamcat; return redraw(); }
    if (d.roamtimes !== undefined) { if (d.roamtimes === 'tour') D.roam.tour5 = true; else { D.roam.tour5 = false; D.roam.times = Number(d.roamtimes); } return redraw(); }
    const a = d.act;
    if (a === 'quick') return quickStart();
    if (d.qsmin !== undefined) { D.qsMinutes = Number(d.qsmin); qsPreview = null; return redraw(); }
    if (a === 'qsreset') { if (confirm('Forget everything Quick start has learned about your playing?')) { D.coach = CO.fresh(); qsPreview = null; } return redraw(); }
    if (a === 'roamreset') { D.roam.done[`${D.roam.cat}|${roamMode()}`] = {}; return redraw(); }
    if (a === 'nums' || a === 'names') { flipLabel(a); return redraw(); }
    if (['hint', 'moves', 'click', 'countIn', 'evolve', 'neck', 'pair', 'varVL', 'tour', 'tourSlow', 'hearRhythm', 'tgExtras'].includes(a)) { D[a] = !D[a]; return redraw(); }
    if (a === 'bpm-' || a === 'bpm+') { D.bpm = Math.max(30, Math.min(220, D.bpm + (a === 'bpm+' ? 2 : -2))); return redraw(); }
    if (a === 'go') { save(); run(); }
    if (a === 'newprog') return editor(null);
    if (a === 'gguide') return guidePage();
    if (a === 'editprog') return editor(prog());
    if (a === 'walk') { save(); walkthrough(); }
  };
  applyNames();
  const r = $app.querySelector('#bpm');
  r.oninput = () => { D.bpm = Number(r.value); $app.querySelector('.tempo b').innerHTML = `${D.bpm}<small> bpm</small>`; };
  r.onchange = () => save();
  const msel = $app.querySelector('#modal');
  if (msel) msel.onchange = () => { D.modal = msel.value; save(); setup(); };
  const vsel = $app.querySelector('#voicing');
  if (vsel) vsel.onchange = () => { D.voicing = vsel.value; save(); setup(); };
  const tgf = $app.querySelector('#tgpackc');
  if (tgf) tgf.onchange = async () => {
    const f = tgf.files && tgf.files[0]; if (!f) return;
    try {
      const pack = JSON.parse(await f.text());
      if (pack.kind !== 'guitarcards-pack' || pack.name !== 'tedgreene' || !pack.tg) throw new Error('that isn’t the Ted Greene pack');
      await TGV.savePack(pack); TGV.reset(); await TGV.load(); setup();
    } catch (e) { alert(`Couldn’t import it: ${e.message}`); }
  };
  const sel = $app.querySelector('#prog');
  if (sel) sel.onchange = () => { D.prog = sel.value; D.kt = prog().minor ? 'minor' : 'major'; save(); setup(); };
}

// ---------- the run ----------
let R = null;
function stop() {
  $app.classList.remove('paused');
  if (!R) return;
  clearTimeout(R.timer);
  R.ui.forEach(clearTimeout);
  if (R.sound || D.pad) A.hush();
  awake(false);
  R.stopped = true;
}
const now = () => (R && R.sound ? A.audioCtx().currentTime : performance.now() / 1000);
let lock = null;
async function awake(on) {
  try {
    if (on && !lock && navigator.wakeLock) lock = await navigator.wakeLock.request('screen');
    if (!on && lock) { await lock.release(); lock = null; }
  } catch (e) { lock = null; }
}

async function run() {
  if (D.voicing === 'tg' && !TGV.ready()) await TGV.load();
  const S = session();
  R = { S, ui: [], timer: null, queue: [], cur: null, e: 0, count: 0, passes: 0, countLeft: D.countIn ? 8 : 0, bpm: D.bpm, paused: false, prevGrip: null, maxBpm: D.bpm, minBpm: D.bpm };
  if (D.src === 'roam' && D.play !== 'modal' && !roamLeft().length) { R = null; return roamFinished(); }
  R.stream = D.play === 'modal' ? modalStream(S) : D.src === 'roam' ? roamStream(S, R) : D.src === 'genre' ? genreStream(S, R) : D.src === 'prog' ? progStream(S, R) : setStream(S);
  R.queue.push(R.stream.next(), R.stream.next());
  drawRun();
  // the clock: the audio clock when the click sounds (sample-accurate), otherwise the page clock; no audio is
  // touched at all when the click is off
  R.sound = true; // the audio clock always: the click and the rhythm can be switched on (or muted) mid-run
  await A.unlockAudio(); await A.ensureRunning();
  awake(true);
  R.nextTime = now() + 0.15;
  if (R.countLeft) showChord(R.queue[0], { counting: true });
  pump();
}
function at(t, fn) {
  const ms = Math.max(0, (t - now()) * 1000);
  const id = setTimeout(() => { R.ui = R.ui.filter((x) => x !== id); fn(); }, ms);
  R.ui.push(id);
}
function pump() {
  if (!R || R.stopped || R.paused) return;
  // the clock ticks in eighth notes: beats get the click and the beat dots, the "&"s carry rhythm hits
  while (R.nextTime < now() + 0.12) { tick(R.nextTime); R.nextTime += 30 / R.bpm; }
  R.timer = setTimeout(pump, 25);
}

// ---------- rhythm: where to strike in each chord (eighth-note positions in a 4/4 bar) ----------
const RHYTHMS = [
  { id: 'ring', name: 'Let it ring', hits: [0], blurb: 'One strum when the chord arrives.' },
  { id: 'quarters', name: 'Four to the bar', hits: [0, 2, 4, 6], blurb: 'Every beat, short and even (Freddie Green).' },
  { id: 'two', name: 'Two-feel', hits: [0, 4], blurb: 'Beats 1 and 3.' },
  { id: 'charleston', name: 'Charleston', hits: [0, 3], blurb: '1 and the & of 2: the jazz comping staple.' },
  { id: 'push', name: 'Push', hits: [3], push: true, blurb: 'The next chord is struck on the & of 4, half a beat early, and shown early too. Plus the & of 2.' },
  { id: 'offbeat', name: 'Off-beats', hits: [1, 3, 5, 7], blurb: 'Every &: reggae and ska.' },
  { id: 'tresillo', name: 'Tresillo 3-3-2', hits: [0, 3, 6], blurb: 'Dotted, dotted, straight: Latin and pop.' },
  { id: 'eighths', name: 'Straight eighths', hits: [0, 1, 2, 3, 4, 5, 6, 7], blurb: 'Every eighth, down-strokes or down-up: rock and punk drive.' },
  { id: 'shuffle', name: 'Shuffle', hits: [0, 1, 2, 3, 4, 5, 6, 7], blurb: 'Every eighth, swung long–short (the & comes late): blues.' },
  { id: 'island', name: 'Island strum', hits: [0, 2, 3, 5, 6, 7], blurb: 'Down, down-up, up-down-up: the pop and folk staple.' },
  { id: 'funk', name: 'Funk scratch', hits: [0, 1, 3, 5, 6], blurb: 'Keep the hand moving; these hits ring, everything else is a muted scratch.' },
  { id: 'bossa', name: 'Bossa', hits: [0, 3, 5], blurb: 'Thumb on 1 and 3, fingers on 1, the & of 2 and the & of 3.' },
  { id: 'boomchick', name: 'Boom-chick', hits: [0, 2, 4, 6], blurb: 'Bass note on 1 and 3 (root, then 5th), strum on 2 and 4: country.' },
  { id: 'rumba', name: 'Rumba', hits: [0, 3, 4, 6], blurb: 'Flamenco rumba: 1, the & of 2, 3, 4, with a muted chuck on 2 and 4.' },
  { id: 'random', name: 'Random comping', random: true, blurb: 'A fresh syncopated pattern on every chord: leave space, place each hit.' },
];
const rhythm = () => RHYTHMS.find((r) => r.id === D.rhythm) || RHYTHMS[0];
function hitsFor(c, first) {
  if (c.hits) return c.hits;
  const r = rhythm(), n = c.beats * 2;
  let base = r.hits;
  if (r.random) {
    const k = Math.random() < 0.45 ? 3 : 2, pool = [0, 1, 2, 3, 4, 5, 6, 7], pick = new Set([Math.random() < 0.5 ? 0 : [1, 2, 3][Math.floor(Math.random() * 3)]]);
    while (pick.size < k) pick.add(pool[Math.floor(Math.random() * 8)]);
    base = [...pick].sort((a, b) => a - b);
  }
  const hits = new Set();
  for (let bar = 0; bar * 8 < n; bar++) for (const h of base) if (bar * 8 + h < n) hits.add(bar * 8 + h);
  if (r.push && first) hits.add(0); // the very first chord can't have been pushed
  c.hits = [...hits].sort((a, b) => a - b);
  return c.hits;
}
function rhythmHTML(c) {
  if (D.rhythm === 'ring') return '';
  const n = c.beats * 2, hits = new Set(hitsFor(c, c === R.first)), push = rhythm().push;
  return Array.from({ length: n }, (_, e) => `<i class="${hits.has(e) ? 'hit' : ''}${push && e === n - 1 ? ' push' : ''}${e % 2 ? ' and' : ''}"><small>${e % 2 ? '&' : (e >> 1) % 4 + 1}</small></i>`).join('');
}

// the chord as a soft pad: root low, then the 3rd, 7th and one colour tone close together above middle C
function padVoicing(c) {
  const ivs = T.getChord(c.lq || c.q).ivs;
  const rootPc = T.notePc(c.root);
  const bassIv = c.spec?.bass && c.spec.bass !== '1' ? c.spec.bass : '1';
  const bass = 36 + ((rootPc + H.semisOf(bassIv)) % 12) + (((rootPc + H.semisOf(bassIv)) % 12) < 4 ? 12 : 0); // E2 to D#3
  const order = ['3', 'b3', '4', '2', '7', 'b7', 'bb7', '6', '9', 'b9', '#9', '11', '#11', '13', 'b13', '5', 'b5', '#5'];
  const upper = order.filter((x) => ivs.includes(x)).slice(0, 4);
  let prevM = 55, out = [];
  for (const iv of upper) {
    const pc = (rootPc + H.semisOf(iv.replace(/^(b|#)?(9|11|13)$/, (m, a, n) => (a || '') + { 9: '2', 11: '4', 13: '6' }[n]))) % 12;
    let m = 55 + ((pc - 55) % 12 + 12) % 12; // first one from G3 up
    while (m <= prevM && out.length) m += 12;
    out.push(m); prevM = m;
  }
  if (out.length && out[out.length - 1] > 76) out = out.map((m) => m - 12).map((m) => (m < 55 ? m + 12 : m)); // keep it under E5, nothing muddy under G3
  return [bass, ...out.sort((a, b) => a - b)];
}
function playPad(c, t) {
  if (!D.pad || !lineMode() || !c) return;
  const at = A.audioCtx().currentTime + Math.max(0.01, t - now());
  A.pad(padVoicing(c), at, c.beats * 60 / R.bpm - 0.05, { vel: 0.55 });
}
// the rhythm, heard: a soft muted strum of the chord on each hit (down on the beat, up on the &; a push strikes the
// next chord early; a shuffle's & comes late)
function strumHit(c, e, t) {
  const n = c.beats * 2, push = rhythm().push && e === n - 1 && R.queue[0];
  if (!push && !hitsFor(c, c === R.first).includes(e)) return;
  const ch = push ? R.queue[0] : c;
  const ms = ch.grip ? ch.grip.notes.filter((n) => D.tgExtras || !n.extra).map((n) => n.midi).sort((a, b) => a - b) : padVoicing(ch);
  const tt = t + (D.rhythm === 'shuffle' && e % 2 ? (30 / R.bpm) * 0.33 : 0);
  A.strum(e % 2 ? [...ms].reverse() : ms, tt, { muted: D.rhythm === 'funk' && !(e % 2 === 0), vel: e % 2 ? 0.42 : 0.55, dur: Math.min(0.5, (30 / R.bpm) * 1.6), spread: 0.009 });
}
function tick(t) {
  if (R.countLeft > 0) {
    const n8 = R.countLeft;
    if (n8 % 2 === 0) {
      if (D.click && !D.mute) A.click(t, n8 === 8 ? 2 : 1);
      at(t, () => { const el = document.getElementById('count'); if (el) el.textContent = String(5 - n8 / 2); });
    }
    R.countLeft--;
    return;
  }
  if (R.e === 0) {
    R.prevGrip = R.cur ? R.cur.grip : null;
    R.cur = R.queue.shift();
    (R.hist ||= []).push(R.cur); if (R.hist.length > 64) R.hist.shift();
    R.ptr = R.hist.length - 1;
    R.queue.push(R.stream.next());
    if (!R.first) R.first = R.cur;
    const c = R.cur, nx = R.queue[0], prev = R.prevGrip, note = R.pendingNote;
    if (c.slot === 0 && note) R.pendingNote = null;
    if (!c.shownEarly) { at(t, () => { showChord(c, { next: nx, prev, note: c.slot === 0 ? note : null }); }); playPad(c, t); }
    else at(t, () => { const el = document.getElementById('next'); if (el) el.innerHTML = nextHTML(nx); });
    if (c.slot === 0 && R.count > 0) R.passes++;
  }
  const c = R.cur, e = R.e, b = e >> 1, onBeat = e % 2 === 0;
  if (onBeat && D.click && !D.mute) A.click(t, b === 0 ? 2 : 1);
  if (D.hearRhythm && !D.mute && D.rhythm !== 'ring') strumHit(c, e, t);
  at(t, () => {
    if (onBeat) document.querySelectorAll('#beats i').forEach((el, i) => el.classList.toggle('on', i === b));
    document.querySelectorAll('#rhythm i').forEach((el, i) => el.classList.toggle('on', i === e));
    if (onBeat && D.neck && D.diagram === 'half' && b === Math.floor(c.beats / 2)) revealNeck();
  });
  // a push: the next chord arrives on the last "&", half a beat early
  if (rhythm().push && e === c.beats * 2 - 1 && R.queue[0]) {
    const nx = R.queue[0], after = R.queue[1], prev = c.grip, note = nx.slot === 0 ? R.pendingNote : null;
    nx.shownEarly = true;
    at(t, () => { showChord(nx, { next: after, prev, note, early: true }); });
    playPad(nx, t);
  }
  R.e++;
  if (R.e >= c.beats * 2) { R.e = 0; R.count++; }
}

// ---------- quick start: a session planned from the coach's model of your playing ----------
const QS_FIELDS = ['src', 'set', 'colour', 'prog', 'pcolour', 'around', 'aroundAmt', 'evolve', 'voicing', 'play', 'scaleLevel', 'key', 'kt', 'shape', 'pair', 'tour', 'tourSlow', 'bpm', 'beats', 'barBeats', 'mode', 'bassline', 'diagram'];
let QS = null, qsPreview = null;
const mmss = (s) => `${Math.floor(s / 60)}:${String(Math.max(0, s) % 60).padStart(2, '0')}`;
function qsPlan() { if (!qsPreview) qsPreview = CO.plan(D.coach, L.ALL, { minutes: D.qsMinutes, tg: TGV.ready() }); return qsPreview; }
function qsCard() {
  D.coach = CO.ensure(D.coach);
  // is the Ted Greene pack here? (its area joins the curriculum if so)
  if (!TGV.ready() && !qsCard.tried) { qsCard.tried = true; TGV.load().then(() => { if (TGV.ready() && !R && !QS && D.app === 'changes') { qsPreview = null; setup(); } }); }
  const blocks = qsPlan(), mins = blocks.reduce((t, b) => t + b.minutes, 0);
  const bel = CO.beliefs(D.coach);
  return `<section class="card qs">
    <button class="primary qsgo" data-act="quick">▶ Quick start <small>about ${mins} minutes</small></button>
    <div class="seg qsmins" role="radiogroup">${[5, 10, 15, 20, 30, 45].map((m) => `<button data-qsmin="${m}" class="${D.qsMinutes === m ? 'on' : ''}">${m} min</button>`).join('')}</div>
    <div class="qscur"><span>Curriculum</span><div class="roamprog"><i style="width:${(CO.progress(D.coach) * 100).toFixed(0)}%"></i></div><b>${(CO.progress(D.coach) * 100).toFixed(0)}%</b></div>
    <ol class="qsplan">${blocks.map((b) => `<li><b>${esc(b.title)}</b> · ${esc(b.level)}${b.prog ? ` · ${esc(b.prog)}` : ''} <small>${fmt(T.pretty(b.key))}${b.minor ? 'm' : ''} · ${b.shape} shape · ${b.bpm} bpm · ${b.minutes} min</small></li>`).join('')}</ol>
    <details class="qsmodel"><summary>What I think about your playing${D.coach.sessions ? ` (${D.coach.sessions} session${D.coach.sessions === 1 ? '' : 's'})` : ''}</summary>
      <ul>${bel.map((x) => `<li><b>${esc(x.area)}</b>: ${esc(x.text)}</li>`).join('')}</ul>
      <p class="note">After each part you say how it went (or skip it as too easy); that moves the tempo, the level, the key and the shape. Areas left longest come back first; your weakest shapes get the work; new areas open as the ones they build on come along. Just show up and press Quick start: over time it works through the whole curriculum.</p>
      <button class="chip" data-act="qsreset">Start the model again</button></details>
  </section>`;
}
function quickStart() {
  D.coach = CO.ensure(D.coach);
  const snap = {};
  for (const k of QS_FIELDS) snap[k] = D[k];
  D.qsSnap = snap;
  QS = { blocks: qsPlan(), i: 0, snap, changes: [], rated: [] };
  qsPreview = null;
  startBlock();
}
function startBlock() {
  const b = QS.blocks[QS.i];
  Object.assign(D, { mode: 'pos', pair: false, tour: false, tourSlow: false, evolve: false, bassline: 'off', diagram: 'now', around: 'off', beats: 4, barBeats: 4, pcolour: 'as' }, b.o);
  if (b.o.genre) D.rhythm = GN.genreById(b.o.genre).rhythm;
  QS.left = b.minutes * 60;
  save();
  clearInterval(QS.timer);
  QS.timer = setInterval(qsTick, 1000);
  run();
}
function qsTick() {
  if (!QS) return;
  if (!R || R.paused || R.stopped || R.countLeft > 0) return;
  QS.left--;
  const el = document.getElementById('qsleft'); if (el) el.textContent = `${mmss(QS.left)} left`;
  if (QS.left <= 0) qsEnd();
}
function qsBar() {
  const b = QS.blocks[QS.i];
  return `<span class="lbl">quick start · ${QS.i + 1} of ${QS.blocks.length}${b.role === 'warm' ? ' · warm-up' : ''}</span><b>${esc(b.title)}: ${esc(b.level)}${b.prog ? ` · ${esc(b.prog)}` : ''}</b><small><span id="qsleft">${mmss(QS.left)} left</span> · ${esc(b.why)}</small><button class="qsskip" data-r="qsskip">Too easy: skip ⏭</button>`;
}
// a block is over (time, or ■): how did it go?
function qsEnd() {
  clearInterval(QS.timer);
  if (R) { stop(); R = null; }
  const b = QS.blocks[QS.i], nx = QS.blocks[QS.i + 1];
  window.scrollTo(0, 0);
  $app.innerHTML = `
  <header class="chead"><span></span><h1>How was that?</h1><span></span></header>
  <section class="card end">
    <p><b>${esc(b.title)}: ${esc(b.level)}</b>${b.prog ? ` · ${esc(b.prog)}` : ''}<br><small>${fmt(T.pretty(b.key))}${b.minor ? ' minor' : ''} · ${b.shape} shape · ${b.bpm} bpm</small></p>
    <div class="qsrate"><button data-q="hard">Couldn’t keep up</button><button data-q="right" class="primary">Just right</button><button data-q="easy">Easy</button></div>
    ${nx ? `<p class="note">Next: <b>${esc(nx.title)}</b> · ${esc(nx.level)}${nx.prog ? ` · ${esc(nx.prog)}` : ''}, ${fmt(T.pretty(nx.key))}${nx.minor ? 'm' : ''} in the ${nx.shape} shape, ${nx.minutes} min. It starts with a count-in when you answer.</p>` : '<p class="note">That was the last part.</p>'}
    <div class="actions"><button data-q="end">End the session here</button></div>
  </section>`;
  $app.onclick = (e) => {
    const x = e.target.closest('[data-q]'); if (!x) return;
    const how = x.dataset.q;
    if (how === 'end') return qsDone();
    const r = CO.rate(D.coach, b, how);
    D.coach = r.st; QS.changes.push(r.change); QS.rated.push({ b, how });
    QS.i++;
    save();
    if (QS.i >= QS.blocks.length) return qsDone();
    startBlock();
  };
}
// too easy: no need to finish it; it counts as a big step up, and the next block starts
function qsSkip() {
  if (!QS) return;
  clearInterval(QS.timer);
  if (R) { stop(); R = null; }
  const b = QS.blocks[QS.i];
  const r = CO.rate(D.coach, b, 'skip');
  D.coach = r.st; QS.changes.push(r.change); QS.rated.push({ b, how: 'skip' });
  QS.i++;
  save();
  if (QS.i >= QS.blocks.length) return qsDone();
  startBlock();
}
function qsDone() {
  clearInterval(QS.timer);
  if (QS.rated.length) D.coach = CO.endSession(D.coach);
  Object.assign(D, QS.snap); delete D.qsSnap;
  const { rated, changes } = QS;
  QS = null; qsPreview = null;
  save();
  const word = { hard: 'couldn’t keep up', right: 'just right', easy: 'easy', skip: 'too easy, skipped' };
  window.scrollTo(0, 0);
  $app.innerHTML = `
  <header class="chead"><span></span><h1>Done for today</h1><span></span></header>
  <section class="card end">
    ${rated.length ? `<ul class="qsdone">${rated.map(({ b, how }) => `<li><b>${esc(b.title)}</b> · ${esc(b.level)}: <i>${word[how]}</i></li>`).join('')}</ul>
    <h3>What changes next time</h3><ul class="qsdone">${changes.filter(Boolean).map((c) => `<li>${esc(c)}</li>`).join('') || '<li>Nothing yet: same again, to settle it.</li>'}</ul>` : '<p>Nothing rated this time, so nothing changes.</p>'}
    <div class="actions"><button class="primary" data-q="ok">Done</button></div>
  </section>`;
  $app.onclick = (e) => { if (e.target.closest('[data-q]')) setup(); };
}
// by hand: on to the next CAGED shape up the neck; the chord already waiting is voiced again in the new shape
function nextShapeNow() {
  if (!R) return;
  const S = R.S;
  advanceShape(S, true);
  S.moved = true; // from now on each chord carries its place, so the header follows
  const c = R.queue[0];
  if (c && !c.end && !c.shownEarly) {
    const re = realise(S, c.spec, c.lq || c.q, R.cur?.grip || null, { beats: c.beats, bar: c.bar, slot: c.slot, pass: c.pass, sub: c.sub, slots: c.slots, oid: c.oid, role: c.role });
    if (c.roam) re.roam = c.roam;
    R.queue[0] = re;
    const el = document.getElementById('next'); if (el) el.innerHTML = nextHTML(re);
  }
}
function drawRun() {
  const { S } = R;
  $app.innerHTML = `
  <header class="chead run"><button class="icon" data-r="stop" aria-label="Stop">■</button><div class="where"><span id="rkey">${fmt(keyLabel(S))}</span><small>${fmt(posLabel(S))}${scaleMode() ? ` · scales: ${LEVEL_NAME[D.scaleLevel] || 'mix'}` : D.voicing !== 'caged' ? ` · ${esc(G.voicingById(D.voicing).name.toLowerCase().replace('strings ', ''))}` : ''}${D.evolve && D.src === 'prog' ? ' · evolving' : ''}</small></div><button class="icon" data-r="pause" aria-label="Pause">❚❚</button></header>
  ${QS ? `<div class="qsbar" id="qsbar">${qsBar()}</div>` : ''}
  ${D.src === 'roam' && D.play !== 'modal' ? '<div class="roamnow" id="roamnow"></div>' : ''}
  <div class="liveplay" id="liveplay">${livePlay()}</div>
  ${progLike() && D.play !== 'modal' ? `<div class="cxdial" id="cxdial">${cxDial()}</div>` : ''}
  ${(D.src === 'prog' || D.src === 'roam') && D.play !== 'modal' ? `<div class="arlive" id="arlive">${arLive()}</div>` : ''}
  ${((D.evolve || subsOn() || D.around !== 'off') && D.src === 'prog') || D.src === 'roam' ? '<div class="written" id="written"></div>' : ''}
  <div class="now" id="now"></div>
  <div class="beats" id="beats"></div>
  <div class="rhythm" id="rhythm"></div>
  <div class="nextline" id="next"></div>
  <div class="stage" id="stage"></div>
  <div class="evo" id="evo"></div>
  <div id="chart"></div>
  <div class="runctl"><button data-r="bpm-" aria-label="Slower">−</button><b id="bpmnow">${R.bpm} bpm</b><button data-r="bpm+" aria-label="Faster">+</button></div>
  <div class="runbtns" id="runbtns">${runButtons()}</div>
  <div class="sheet" id="sheet" hidden></div>`;
  applyNames();
  window.scrollTo(0, 0);
  const cx = document.getElementById('cx');
  if (cx) cx.oninput = () => {
    const opts = D.src === 'genre' ? CX.slice(0, 4) : CX, [v, l] = opts[Number(cx.value)];
    D.pcolour = v; save();
    document.getElementById('cxname').textContent = l;
  };
  $app.onclick = (e) => {
    const b = e.target.closest('button, #stage'); if (!b) return;
    const r = b.dataset?.r || (b.id === 'stage' ? 'reveal' : null);
    if (r === 'stop') return QS ? qsEnd() : finish();
    if (r === 'qsskip') return qsSkip();
    if (r === 'names' || r === 'nums') { flipLabel(r); save(); return applyNames(); }
    if (r === 'neck') { D.neck = !D.neck; save(); applyNames(); return renderStage(); }
    if (r && r.startsWith('play-')) return switchPlay(r.slice(5));
    if (r === 'keep') return keepVersion(b);
    if (r === 'pad') {
      D.pad = !D.pad; save(); applyNames();
      if (D.pad) { A.unlockAudio().then(() => A.ensureRunning()).then(() => { if (R?.cur && !R.paused) playPad(R.cur, now() + 0.02); }); } else A.hush();
      return;
    }
    if (r === 'wide') { D.wide = !D.wide; if (D.wide) D.neck = true; save(); applyNames(); return renderStage(); }
    if (r === 'nextshape') return nextShapeNow();
    if (r === 'why') return openWhy();
    if (r === 'step-' || r === 'step+') return stepChord(r === 'step+' ? 1 : -1);
    if (r === 'tgExtras') { D.tgExtras = !D.tgExtras; save(); applyNames(); return renderStage(); }
    if (r && r.startsWith('ar-')) { D.around = r.slice(3); save(); document.getElementById('arlive').innerHTML = arLive(); return; }
    if (r === 'click' || r === 'hearRhythm' || r === 'mute') { D[r] = !D[r]; if (r === 'mute' && D.mute) A.hush(); save(); return applyNames(); }
    if (r === 'allv') { D.allv = !D.allv; if (D.allv) D.neck = true; save(); applyNames(); return renderStage(); }
    if (r === 'sheet') return openSheet();
    if (r === 'gguide') return openGuide();
    if (r === 'close-sheet') return closeSheet();
    if (r === 'pause') return togglePause(b);
    if (r === 'reveal') return revealNeck();
    if (r === 'bpm-' || r === 'bpm+') {
      R.bpm = Math.max(30, Math.min(220, R.bpm + (r === 'bpm+' ? 2 : -2)));
      R.maxBpm = Math.max(R.maxBpm, R.bpm); R.minBpm = Math.min(R.minBpm, R.bpm);
      D.bpm = R.bpm; save();
      document.getElementById('bpmnow').textContent = `${R.bpm} bpm`;
    }
  };
}
// the play mode can change mid-run: every chord already carries what each mode needs
function cxDial() {
  const opts = D.src === 'genre' ? CX.slice(0, 4) : CX;
  const i = Math.max(0, opts.findIndex(([v]) => v === D.pcolour));
  return `<span class="lbl">simple</span><input type="range" id="cx" min="0" max="${opts.length - 1}" step="1" value="${D.pcolour === 'var' ? 2 : i}" aria-label="Complexity"><span class="lbl">complex</span><b id="cxname">${esc(D.pcolour === 'var' ? 'Variations' : opts[i][1])}</b>`;
}
function arLive() {
  return `<span class="lbl">bring in</span><div class="seg">${AR.PALETTES.map(([v, l]) => `<button data-r="ar-${v}" class="${D.around === v ? 'on' : ''}">${{ off: 'None', mi: 'Borrowed', chr: 'Chromatic', both: 'Both' }[v] || l}</button>`).join('')}</div>`;
}
function livePlay() {
  const modes = [['chords', 'Chords'], ['arps', 'Arpeggios'], ['guide', 'Guide tones'], ['scales', 'Scales']];
  if (R?.stream?.modal) modes.push(['modal', 'Mode']);
  return `<div class="seg">${modes.map(([v, l]) => `<button data-r="play-${v}" class="${D.play === v ? 'on' : ''}">${l}</button>`).join('')}</div>`;
}
function runButtons() {
  return `<button class="rt" data-r="nums">Numeral</button><button class="rt" data-r="names">Name</button><button class="rt" data-r="neck">Neck</button>${lineMode() ? '<button class="rt" data-r="wide">Wider</button><button class="rt" data-r="pad">Chord sound</button>' : '<button class="rt" data-r="allv">All voicings</button>'}${D.evolve && D.src === 'prog' && !R?.stream?.modal ? '<button class="rt" data-r="keep">Save this version</button>' : ''}${D.src === 'genre' ? '<button class="rt" data-r="gguide">Genre guide</button>' : ''}${D.voicing === 'tg' && D.play === 'chords' ? '<button class="rt" data-r="tgExtras">TG extras</button>' : ''}<button class="rt" data-r="nextshape">Next shape ⏭</button><button class="rt" data-r="click">Click</button>${D.rhythm !== 'ring' ? '<button class="rt" data-r="hearRhythm">Rhythm</button>' : ''}<button class="rt" data-r="mute">Mute</button><button class="sheet-btn" data-r="sheet">${scaleMode() ? 'Scale options' : D.play === 'chords' ? 'Chord set' : 'All chords'}</button>`;
}
function switchPlay(mode) {
  if (!R || D.play === mode) return;
  D.play = mode;
  save();
  R.sheet = null;
  document.getElementById('liveplay').innerHTML = livePlay();
  document.getElementById('runbtns').innerHTML = runButtons();
  applyNames();
  if (R.shown?.c && !R.shown.counting) showChord(R.shown.c, { next: R.queue[0], prev: R.shown.prev });
  else if (R.shown?.c) showChord(R.shown.c, { counting: true });
}
function togglePause(btn) {
  if (!R) return;
  R.paused = !R.paused;
  btn.textContent = R.paused ? '▶' : '❚❚';
  $app.classList.toggle('paused', R.paused);
  if (R.paused) { clearTimeout(R.timer); R.ui.forEach(clearTimeout); R.ui = []; if (R.sound || D.pad) A.hush(); }
  else {
    // stepped while paused: play on from the chord on screen, the ones after it in order
    if (R.stepped && R.hist) {
      R.queue = [...R.hist.slice(R.ptr), ...R.queue];
      R.hist = R.hist.slice(0, R.ptr);
      R.cur = R.hist[R.hist.length - 1] || null;
      R.e = 0; R.stepped = false;
    }
    R.nextTime = now() + 0.1; pump();
  }
}
// paused: step through the chords, back through the ones played, forward through what's coming
function stepChord(d) {
  if (!R || !R.paused || !R.hist || !R.hist.length) return;
  if (d < 0) { if (R.ptr <= 0) return; R.ptr--; }
  else if (R.ptr < R.hist.length - 1) R.ptr++;
  else {
    const c = R.queue[0];
    if (!c || c.end) return;
    R.queue.shift(); R.queue.push(R.stream.next());
    R.hist.push(c); R.ptr = R.hist.length - 1;
  }
  R.stepped = true;
  const c = R.hist[R.ptr];
  showChord(c, { next: R.hist[R.ptr + 1] || R.queue[0], prev: R.hist[R.ptr - 1]?.grip || null });
  if (D.neck && D.diagram !== 'now') revealNeck();
}
// numeral and name are both always in the page; classes on the app decide which show (at least one does), and
// with the numeral off the name takes its place and size
function labelsFor(c) { return D.play === 'chords' ? { main: c.rn, sub: c.name } : { main: c.lrn || c.rn, sub: c.lname || c.name }; }
function flipLabel(which) {
  const other = which === 'nums' ? 'names' : 'nums';
  if (D[which] && !D[other]) D[other] = true;
  D[which] = !D[which];
}
function namesButton(attr) {
  return `<div class="runbtns"><button class="rt" data-${attr}="nums">Numeral</button><button class="rt" data-${attr}="names">Name</button></div>`;
}
function applyNames() {
  $app.classList.toggle('hide-names', !D.names);
  $app.classList.toggle('hide-nums', !D.nums);
  $app.classList.toggle('no-neck', !D.neck);
  const on = { nums: D.nums, names: D.names, neck: D.neck, allv: D.allv, wide: D.wide, pad: D.pad, click: D.click, hearRhythm: D.hearRhythm, mute: D.mute, tgExtras: D.tgExtras };
  $app.querySelectorAll('.rt').forEach((b) => { const k = b.dataset.r || b.dataset.w; b.classList.toggle('on', !!on[k]); b.setAttribute('aria-pressed', !!on[k]); });
}
const gripTag = (g) => (g ? (g.shape ? `${g.shape} shape` : g.label) : '');
function showChord(c, { next = null, prev = null, counting = false, note = null } = {}) {
  if (!R) return;
  if (c.end) return roamFinished();
  if (c.roam) {
    const el = document.getElementById('roamnow');
    if (el) el.innerHTML = `<span class="lbl">now playing</span><b>${fmt(T.pretty(c.roam.name))}</b><small>${esc(c.roam.by || c.roam.cat)} · ${c.roam.rounds > 1 ? `round ${c.roam.round} of ${c.roam.rounds} · ` : ''}${c.roam.idx} of ${c.roam.total}</small>`;
    const k = document.getElementById('rkey'); if (k) k.innerHTML = fmt(c.roam.key);
  }
  const { main, sub } = labelsFor(c);
  const tags = [];
  const ch = D.play === 'chords';
  if (ch && D.hint && c.grip) tags.push(`<span class="tag shape">${esc(gripTag(c.grip))}</span>`);
  if (c.tag) tags.push(`<span class="tag">${esc(c.tag)}</span>`);
  if (ch && c.plainer) tags.push(`<span class="tag warn" title="No ${esc(c.plainer)} grip here">plainer: no ${fmt(T.pretty(T.getChord(c.plainer).sym))} grip here</span>`);
  if (ch && c.grip?.outside) tags.push('<span class="tag warn">stretches out of position</span>');
  if (ch && c.grip?.noOpen) tags.push('<span class="tag warn">no open strings fit this one</span>');
  if (CW.hasColour(c.lq || c.q, ch ? c.grip : null)) tags.push('<button class="tag colourbtn" data-r="why">why this colour?</button>');
  if (ch && c.grip?.noTG) tags.push('<span class="tag warn">no Ted Greene form here: the CAGED grip</span>');
  if (ch && c.grip?.tg && c.grip.notes.some((n) => n.extra)) tags.push(`<span class="tag tgx">${D.tgExtras ? 'extras' : 'extras hidden'}: ${c.grip.notes.filter((n) => n.extra).map((n) => fmt(T.prettyIv(n.iv))).join(' ')}</span>`);
  const solo = ch ? '' : D.play === 'scales' ? (c.solo ? soloHTML(c) : '') : linePanel(c);
  document.getElementById('now').innerHTML = counting
    ? `<div class="count" id="count"></div><div class="first">first: <b class="cnum">${fmt(main)}</b> <b class="cname">${fmt(sub)}</b></div>`
    : `<button class="stepb prev" data-r="step-" aria-label="Previous chord">◀</button><button class="stepb next" data-r="step+" aria-label="Next chord">▶</button><div class="main cnum">${fmt(main)}</div><div class="sub cname">${fmt(sub)}</div><div class="tags">${tags.join('')}</div>${solo}${c.fn && !solo ? `<div class="fn">${esc(c.fn)}${c.tag ? '' : ''}</div>` : ''}${c.role ? `<div class="fn subnote"><b>${fmt(T.prettyRoman(c.role.text))}</b> · ${esc(c.role.why)}</div>` : c.sub ? `<div class="fn subnote">${esc(c.sub)}</div>` : ''}`;
  const wr = document.getElementById('written');
  if (wr && R.orig && c.oid !== undefined && !counting) wr.innerHTML = `<span class="lbl">as written</span> ${R.orig.map((o, j) => `<span class="${j === c.oid ? 'on' : ''}${j === c.oid && c.role ? ` ${c.role.kind}` : ''}">${fmt(T.prettyRoman(H.label(o.spec)))}</span>`).join('<i>·</i>')}`;
  document.getElementById('beats').innerHTML = counting ? '' : Array.from({ length: c.beats }, () => '<i></i>').join('');
  const rh = document.getElementById('rhythm');
  if (rh) rh.innerHTML = counting ? '' : rhythmHTML(c);
  if (c.place) { const w = document.querySelector('.where small'); if (w && w.dataset.place !== c.place) { w.dataset.place = c.place; w.innerHTML = c.place; } }
  R.shown = { c, prev, counting, next };
  renderStage();
  if (next) document.getElementById('next').innerHTML = nextHTML(next);
  if (note) document.getElementById('evo').innerHTML = `<span>Evolved:</span> ${esc(note)}`;
  if (c.slots) document.getElementById('chart').innerHTML = chartHTML(c.slots, { cur: c.slot, tonic: R.S.tonic });
}
function nextHTML(next) {
  if (!next) return '';
  const l = labelsFor(next);
  // a tiny picture of the next grip, so the hand can get ready (not in the reveal-later modes)
  const g = D.play === 'chords' && D.neck && D.diagram === 'now' && next.grip ? next.grip : null;
  const pic = g ? `<span class="nextpic">${neckSVG(g, { lo: g.lo <= 1 ? 0 : g.lo, hi: (g.lo <= 1 ? 0 : g.lo) + 4, tiny: true })}</span>` : '';
  return `${pic}<span class="lbl">next</span> <b class="cnum">${fmt(l.main)}</b> <b class="cname">${fmt(l.sub)}</b>${D.play === 'chords' && D.hint && next.grip ? ` <span class="muted">${esc(gripTag(next.grip))}</span>` : ''}${D.play === 'scales' && next.solo ? ` <span class="nsolo">${fmt(SC.scaleTitle(next.solo, next.root))}</span>` : ''}${next.place && next.place !== R.shown?.c?.place ? ` <span class="nsolo">→ ${next.place}</span>` : ''}`;
}
// the neck: off, shown, or waiting (halfway / on tap)
function renderStage() {
  const st = document.getElementById('stage');
  if (!st || !R?.shown) return;
  if (!D.neck) { st.innerHTML = ''; return; }
  if (R.shown.counting || D.diagram === 'now') return revealNeck();
  st.innerHTML = `<div class="hidden">${D.diagram === 'half' ? `Find it… the ${scaleMode() ? 'scale' : 'voicing'} shows halfway through` : 'Find it. Tap here to check.'}</div>`;
}
// every fingering of the chord on screen that works here, small, the one the run chose ringed
function allVoicings(c) {
  const S = R.S;
  const w = usesArea() && D.voicing !== 'open' ? windowFor(S, null) : null;
  const bg = w ? bgFor(S, w.lo, w.hi) : null;
  const sig = (g) => g.notes.map((n) => `${n.string}:${n.fret}`).sort().join();
  const chosen = c.grip ? sig(c.grip) : '';
  let vs = versionsFor(S, c.root, c.q, { ...c.spec, bass: c.spec.bass });
  if (c.grip && !vs.some((v) => sig(v) === chosen)) vs = [{ ...c.grip, label: gripTag(c.grip) }, ...vs];
  document.getElementById('stage').innerHTML = `<div class="allv"><div class="sgrid">${vs.map((v) => {
    const win = w || (D.voicing === 'open' ? openWindow(v) : { lo: Math.max(0, v.lo - 1), hi: v.lo + 4 });
    return `<figure class="sv${sig(v) === chosen ? ' chosen' : ''}${v.kind === 'caged' || !v.kind ? ' caged' : ''}">${neckSVG(v, { lo: win.lo, hi: win.hi, band: w ? S.pos : null, tiny: true, bg })}<figcaption>${esc(v.label || '')}</figcaption></figure>`;
  }).join('')}</div><p class="note">${vs.length} way${vs.length === 1 ? '' : 's'} to play it here${chosen ? '; the ringed one is the run’s pick' : ''}.</p></div>${LEGEND}`;
}
// the panel under the chord in the arpeggio, guide-tone and mode modes
function linePanel(c) {
  const pv = (x) => T.prettyIv(x);
  if (D.play === 'arps' && c.arp) {
    const ivs = T.getChord(c.lq || c.q).ivs;
    return `<div class="solo lvA"><div class="solo-top"><small>Arpeggio</small></div><b>${ivs.map((x) => `${pv(x)}`).join(' · ')}</b><p>Start on the ${pv(c.arp.start)} (${T.noteName(T.transpose(c.root, c.arp.start.replace(/^(b|#)?(9|11|13)$/, (m, a, n) => (a || '') + { 9: '2', 11: '4', 13: '6' }[n])), true)}, ringed) and run the chord tones through the position, up and back.</p></div>`;
  }
  if (D.play === 'guide') return !c.guide ? '<div class="solo lvG"><p>No 3rd-and-7th pair fits inside this shape for this chord.</p></div>' : `<div class="solo lvG"><div class="solo-top"><small>Guide tones</small></div>${c.guide.moves.map((m) => `<p class="gline">${fmt(m)}</p>`).join('')}</div>`;
  if (D.play === 'modal' && c.modal) {
    const md = c.modal, [a, b] = md.targets;
    const nn = (iv) => T.noteName(T.transpose(c.root, iv), true);
    return `<div class="solo lvM"><div class="solo-top"><small>${fmt(T.noteName(R.S.tonic, true))} ${esc(md.m.name)}</small></div><b>Land on ${fmt(pv(a))} ${fmt(nn(a))} or ${fmt(pv(b))} ${fmt(nn(b))}</b><p>Aim a phrase at a target on the chord change. The mode’s own colour is ${fmt(T.prettyIv(md.m.char))} (${fmt(T.noteName(md.charNote, true))}): ${esc(md.m.feel)}.</p></div>`;
  }
  return '';
}
// the frets a line mode draws: the shape, or two frets past it each side with "wider" on
function lineSpan(Sx) {
  const p = Sx.pos, wide = D.wide ? 2 : 0;
  const lo = Math.max(0, p.lo - wide), hi = Math.min(17, p.hi + wide);
  return { lo, hi, wlo: Math.max(0, lo - (lo > 0 && !wide ? 1 : 0)), whi: hi + (wide ? 0 : 1) };
}
function lineNotes(c, Sx, z) {
  const outer = (n) => n.fret < Sx.pos.lo || n.fret > Sx.pos.hi;
  const simple = (x) => x.replace(/^(b|#)?(9|11|13)$/, (m, a, n) => (a || '') + { 9: '2', 11: '4', 13: '6' }[n]);
  const lq = c.lq || c.q;
  if (D.play === 'arps') {
    const rel = [...new Set(T.getChord(lq).ivs.map((x) => H.semisOf(simple(x))))];
    return { notes: SC.scaleNotesIn({ rel }, c.root, lq, z.lo, z.hi).map((n) => ({ ...n, mark: n.iv === c.arp.start, outer: outer(n) })) };
  }
  if (D.play === 'guide') {
    if (!c.guide) return { notes: [] };
    const chosen = new Set(c.guide.notes.map((n) => `${n.string}:${n.fret}`));
    return { notes: c.guide.all.map((n) => (chosen.has(`${n.string}:${n.fret}`) ? { ...n, mark: true } : { ...n, kind: 'sc' })), prev: c.guide.prev ? { notes: c.guide.prev } : null };
  }
  const md = c.modal;
  return { notes: SC.scaleNotesIn({ rel: md.pcs }, c.root, lq, z.lo, z.hi).map((n) => {
    const rel = ((n.midi - T.notePc(c.root)) % 12 + 12) % 12;
    const o = { ...n, outer: outer(n) };
    if (md.targets.includes(n.iv)) return { ...o, mark: true };
    if (n.iv === '1') return o;
    if (rel === md.charRel) return { ...o, kind: 'tx' };
    return { ...o, kind: 'sc' };
  }) };
}
const LEGEND_MODE = '<div class="legend"><span class="k t3">3rd</span><span class="k t7">7th</span><span class="k r">root</span><span class="k tx">the mode’s colour note</span><span class="k sc">rest of the mode</span></div>';
function lineNeck(c) {
  const Sx = c.snap ? { ...R.S, ...c.snap } : R.S;
  const z = lineSpan(Sx);
  const w = { ...windowFor(Sx, null), lo: z.wlo, hi: z.whi };
  if (D.play === 'guide' && !c.guide) { document.getElementById('stage').innerHTML = '<div class="cnone">No 3rd and 7th pair fits in this shape</div>'; return; }
  const { notes, prev } = lineNotes(c, Sx, z);
  document.getElementById('stage').innerHTML = neckSVG({ notes, lo: w.lo, hi: w.hi }, { ...w, prev, labels: D.labels === 'finger' ? 'iv' : D.labels }) + (D.play === 'modal' ? LEGEND_MODE : LEGEND);
}
// the sheet and walkthrough for the line modes: each chord's tones (or guide tones, or the mode with its targets)
function toneListHTML(S) {
  const z = { lo: S.pos.lo, hi: S.pos.hi, wlo: Math.max(0, S.pos.lo - (S.pos.lo > 0 ? 1 : 0)), whi: S.pos.hi + 1 };
  const groups = D.play === 'modal'
    ? [{ title: `${T.noteName(S.tonic, true)} ${MC.modeById(D.modal).name}`, list: MC.modeChords(S.tonic, D.modal, D.colour === 'tri' ? 3 : 4).map((x) => ({ spec: { iv: x.iv, q: x.q }, q: x.q })) }]
    : sheetChords(S);
  let html = '';
  const S2 = { ...S, gtPrev: null };
  for (const grp of groups) {
    html += `<h2 class="sgroup">${fmt(grp.title)}</h2><div class="sgrid tones">`;
    for (const it of grp.list) {
      const c = realiseCore(S2, it.spec, it.q, null, {});
      if (c.arp) c.arp.start = '1';
      S2.gtPrev = null;
      const body = D.play === 'guide' && !c.guide ? '<div class="cnone">none here</div>' : neckSVG({ notes: lineNotes(c, S, z).notes, lo: z.wlo, hi: z.whi }, { lo: z.wlo, hi: z.whi, band: S.pos, tiny: true });
      html += `<figure class="sv"><figcaption class="tt"><b class="cnum">${fmt(c.rn)}</b> <span class="cname">${fmt(c.name)}</span></figcaption>${body}</figure>`;
    }
    html += '</div>';
  }
  return html;
}
function revealNeck() {
  if (!R?.shown || !D.neck) return;
  const { c, prev } = R.shown;
  const Sx = c.snap ? { ...R.S, ...c.snap } : R.S;
  const w = windowFor(Sx, c.grip);
  if (D.play === 'chords' && D.allv && c.grip) return allVoicings(c);
  if (D.play === 'arps' || D.play === 'guide' || D.play === 'modal') return lineNeck(c);
  if (D.play === 'scales' && c.solo) {
    // the scale across the area, chord tones in their colours, the rest of the scale as quiet dots; "wider" carries
    // it two frets past each side of the shape, those notes dimmed
    const z = lineSpan(Sx);
    const notes = SC.scaleNotesIn(c.solo, c.root, c.lq || c.q, z.lo, z.hi).map((n) => ({ ...n, kind: n.chord ? KIND(n.iv) : 'sc', outer: n.fret < Sx.pos.lo || n.fret > Sx.pos.hi }));
    document.getElementById('stage').innerHTML = neckSVG({ notes, lo: z.wlo, hi: z.whi }, { ...w, lo: z.wlo, hi: z.whi, labels: D.labels === 'finger' ? 'iv' : D.labels }) + LEGEND_SCALE;
    return;
  }
  document.getElementById('stage').innerHTML = neckSVG(c.grip, { ...w, prev }) + LEGEND;
}
// after a run: back to the section that sent it (Borrowed or Chromatic chords), else the Chord changes screen
function afterRun() {
  R = null;
  if (D.returnTo) { D.app = D.returnTo; D.returnTo = null; save(); }
  setup();
}
function finish() {
  closeSheet();
  if (!R) return afterRun();
  const { S, count, passes } = R;
  const bpm = R.minBpm;
  stop();
  const enough = progLike() ? passes >= 1 : count >= 8;
  if (!enough) return afterRun();
  const n = normBpm(bpm), tgt = target(), k = doneKey();
  const prevBest = record(k)[S.shapeKey] || 0;
  const lap = D.tour && S.toured.size > 1 ? [...S.toured] : [S.shapeKey];
  window.scrollTo(0, 0);
  $app.innerHTML = `
  <header class="chead"><span></span><h1>How was it?</h1><span></span></header>
  <section class="card end">
    <p>${progLike() ? `<b>${esc(D.src === 'genre' ? GN.genreById(D.genre).name : prog().name)}</b>, ${passes} time${passes === 1 ? '' : 's'} round` : `<b>${count} chords</b>`} in ${fmt(keyLabel(S))}, <b>${lap.length > 1 ? `through ${lap.join(', ')}` : shapeWord(S)}</b>, at ${bpm} bpm${n !== bpm ? ` (counts as ${n})` : ''}.</p>
    <p>Was every chord clean and on time?</p>
    <div class="actions"><button class="primary" data-e="yes">✓ Clean</button><button data-e="no">Not yet</button></div>
    <p class="note">${prevBest ? `Best in the ${shapeWord(S)} so far: ${prevBest} bpm.` : `First clean run in the ${shapeWord(S)} gets recorded.`} Fast is ${tgt} bpm. ${n >= tgt ? 'This one counts as fast.' : `${tgt - n} to go.`}${S.shapes.length > 1 ? ' Two-shape runs are logged; the five single shapes are what count towards done.' : ''}</p>
    ${shapeProgress(k, tgt)}
  </section>`;
  $app.onclick = (e) => {
    const b = e.target.closest('[data-e]'); if (!b) return;
    if (b.dataset.e === 'yes') {
      const rec = (D.done[k] ||= {});
      for (const sk of lap) if (n > (rec[sk] || 0)) rec[sk] = n;
      if (bpm < 220) D.bpm = Math.min(220, bpm + 4);
      save();
      if (complete(k, tgt)) { $app.querySelector('.end').insertAdjacentHTML('beforeend', '<p class="done">✓ Done in all five shapes</p>'); setTimeout(afterRun, 1600); return; }
    }
    afterRun();
  };
}

// ---------- the chord set: everything that can come up, every version of it in this area ----------
// the key's CAGED shape for the faint background: the tonic chord's notes across the area
function bgFor(S, lo, hi) {
  const t = T.notePc(S.tonic), pcs = [t, (t + (S.minor ? 3 : 4)) % 12, (t + 7) % 12], out = [];
  for (let st = 1; st <= 6; st++) for (let f = lo; f <= hi; f++) { const pc = (F_OPEN[st] + f) % 12; if (pcs.includes(pc)) out.push({ string: st, fret: f, root: pc === t }); }
  return out;
}
const F_OPEN = { 1: 64, 2: 59, 3: 55, 4: 50, 5: 45, 6: 40 };
function sheetChords(S) {
  const groups = [];
  const add = (title, list) => { if (list.length) groups.push({ title, list }); };
  const qsFor = (q, spec, next) => {
    if (progLike() && D.pcolour === 'col') {
      const tri = H.toTriad(q);
      const sev = T.getChord(q).ivs.length >= 4 ? q : H.toSeventh(tri, spec.iv, { dominant: !!spec.rel, minorKey: S.minor });
      return H.colourOptions(sev, spec.iv, { toMinor: next ? H.isMinorish(next.q) || E.cls(next.q) === 'hd' : false, minorKey: S.minor });
    }
    if (varyOn()) {
      const base = progLike() ? colourise(spec, next, 0, S.minor) : q;
      return H.variations(base, spec.iv, S.minor);
    }
    return [progLike() ? colourise(spec, next, 0, S.minor) : q];
  };
  if (progLike()) {
    const slots = progSlots(S.minor), seen = new Set(), own = [];
    slots.forEach((x, i) => {
      const next = slots[(i + 1) % slots.length].spec;
      for (const q of qsFor(x.spec.q, x.spec, next)) {
        const k = `${x.spec.iv}:${q}:${x.spec.rel ? x.spec.rel.to : ''}:${x.spec.bass || ''}`;
        if (!seen.has(k)) { seen.add(k); own.push({ spec: x.spec, q }); }
      }
    });
    add(D.src === 'genre' ? `Chords ${GN.genreById(D.genre).name.toLowerCase()} uses` : 'In the progression', own);
    if (D.evolve) {
      const subs = [];
      for (const r of E.reachable(slots, S.minor)) for (const q of qsFor(r.spec.q, r.spec, r.next)) {
        const k = `${r.spec.iv}:${q}:${r.spec.rel ? r.spec.rel.to : ''}`;
        if (!seen.has(k)) { seen.add(k); subs.push({ spec: r.spec, q, note: r.why }); }
      }
      add('Substitutes evolving mode can bring in', subs);
    }
  } else if (D.set === 'any') {
    for (const iv of ['1', 'b2', '2', 'b3', '3', '4', '#4', '5', 'b6', '6', 'b7', '7']) add(H.numeral(iv, 'maj').replace(/maj|7/g, ''), H.ANY_QUALITIES[D.colour].map((q) => ({ spec: { iv, q }, q, one: true })));
  } else {
    const byGroup = {};
    for (const e of H.setPool(S.minor ? 'minor' : 'major', D.set)) {
      const qs = D.colour === 'tri' ? [e.tri] : D.colour === 'sev' ? [e.sev] : D.colour === 'var' ? H.variations(e.sev, e.iv, S.minor) : e.col;
      for (const q of qs) (byGroup[e.group] ||= []).push({ spec: { iv: e.iv, q, rel: e.rel }, q, note: e.tag ? `${e.tag}: ${e.fn}` : e.fn });
    }
    for (const g of ['dia', 'mi', 'chr']) if (byGroup[g]) add(H.GROUP_NAMES[g], byGroup[g]);
  }
  return groups;
}
function versionsFor(S, root, q, spec = {}) {
  if (spec.bass && spec.bass !== '1') return G.bassGrips(root, q, H.semisOf(spec.bass), S.pos);
  if (D.bassline !== 'off' && D.voicing !== 'open' && (D.voicing === 'caged' || D.voicing === 'any')) return [...G.versionsIn(root, q, S.pos), ...toneRels(q).filter((r) => r).flatMap((rel) => G.bassGrips(root, q, rel, S.pos).slice(0, 3))];
  if (G.voicingById(D.voicing).mix) return familyPool(S, root, q, spec).filter((x) => !x.far);
  if (D.voicing === 'open') return G.openVoicings(root, q).slice(0, 8);
  if (D.voicing === 'tg') return TGV.voicingsFor(root, q, S.pos).filter((x) => !x.far).slice(0, 16);
  if (D.voicing !== 'caged') return G.familyVoicings(root, q, D.voicing, S.pos).inside;
  if (D.mode === 'pos') return G.versionsIn(root, q, S.pos);
  return S.shapes.flatMap((sh) => G.placements(root, q, sh).map((p) => ({ ...p, label: `${sh} shape · fret ${p.rootFret}` })));
}
function sheetHTML(S) {
  const w = usesArea() && D.voicing !== 'open' ? windowFor(S, null) : null;
  const bg = w ? bgFor(S, w.lo, w.hi) : null;
  let html = '';
  for (const grp of sheetChords(S)) {
    html += `<h2 class="sgroup">${fmt(grp.title)}</h2>`;
    for (const c of grp.list) {
      const root = H.spell(S.tonic, c.spec.iv);
      let q = adaptQ(c.q, c.spec, S), vs = versionsFor(S, root, q, c.spec), plainer = null;
      while (!vs.length && H.simpler(q)) { q = H.simpler(q); vs = versionsFor(S, root, q, c.spec); plainer = c.q; }
      if (c.one) vs = vs.slice(0, 1);
      html += `<div class="schord"><div class="shead"><b class="cnum">${fmt(H.label(c.spec, q))}</b><span class="cname">${fmt(H.slashName(root, q, c.spec.bass))}</span>${c.note ? `<small>${esc(c.note)}</small>` : ''}${plainer ? `<small class="warn">no ${fmt(T.pretty(T.getChord(plainer).sym))} grip here</small>` : ''}</div>`;
      html += vs.length ? `<div class="sgrid">${vs.map((v) => {
        const win = w || (D.voicing === 'open' ? openWindow(v) : { lo: Math.max(0, v.lo - 1), hi: v.lo + 4 });
        return `<figure class="sv${v.kind === 'caged' || !v.kind ? ' caged' : ''}">${neckSVG(v, { lo: win.lo, hi: win.hi, band: w ? S.pos : null, tiny: true, bg, labels: 'iv' })}<figcaption>${esc(v.label)}${v.q && v.q !== q ? ` · ${fmt(T.pretty(T.getChord(v.q).sym) || 'triad')}` : ''}</figcaption></figure>`;
      }).join('')}</div>` : '<p class="note">Nothing fits here.</p>';
      html += '</div>';
    }
  }
  return html;
}
function openSheet() {
  const el = document.getElementById('sheet');
  if (!el || !R) return;
  if (!R.sheet) R.sheet = scaleMode() ? scaleListHTML(R.S) : lineMode() ? toneListHTML(R.S) : sheetHTML(R.S);
  if (lineMode() && !scaleMode()) {
    el.innerHTML = `<div class="sheet-head"><div><b>${{ arps: 'Arpeggios', guide: 'Guide tones', modal: 'The mode’s chords' }[D.play]}</b><small>${fmt(keyLabel(R.S))} · ${fmt(posLabel(R.S))}</small></div><button class="icon" data-r="close-sheet" aria-label="Close">✕</button></div>
    <p class="note">${{ arps: 'Every chord that can come up, its tones across the shape.', guide: 'Every chord’s 3rd and 7th inside the shape. In a run, the pair that moves least is ringed.', modal: 'Each chord of the mode with the whole mode across the shape: its 3rd and 7th ringed, the colour note in violet.' }[D.play]}</p>${D.play === 'modal' ? LEGEND_MODE : LEGEND}${R.sheet}`;
  } else if (scaleMode()) {
    el.innerHTML = `<div class="sheet-head"><div><b>Scale options</b><small>${fmt(keyLabel(R.S))} · ${fmt(posLabel(R.S))}</small></div><button class="icon" data-r="close-sheet" aria-label="Close">✕</button></div>
    <p class="note">Every chord that can come up and every scale that works over it, easiest first. Your level is highlighted; the run picks from it.</p>${R.sheet}`;
  } else el.innerHTML = `<div class="sheet-head"><div><b>Chord set</b><small>${fmt(keyLabel(R.S))} · ${fmt(posLabel(R.S))}</small></div><button class="icon" data-r="close-sheet" aria-label="Close">✕</button></div>
  <p class="note">Every chord that can come up, and ${D.voicing === 'caged' || D.voicing === 'any' ? `every version of it ${usesArea() ? 'inside the area' : 'in the shape'}: the CAGED grip${usesArea() ? ', then triads or drop voicings on each string set and inversion' : ' wherever it lands'}` : D.voicing === 'open' ? 'its voicings with the most open strings, anywhere on the neck (the run picks the most open, then the nearest)' : `every ${esc(G.voicingById(D.voicing).name.toLowerCase())} voicing of it inside the area (the run picks the one nearest the last chord)`}.${usesArea() ? ' The key’s own shape is the faint dots behind.' : ''}</p>${LEGEND}${R.sheet}`;
  el.hidden = false;
  el.scrollTop = 0;
  document.body.classList.add('locked');
}
// why this colour: each colour note of the chord on screen, where it comes from and why it suits this chord here
function openWhy() {
  const el = document.getElementById('sheet');
  if (!el || !R || !R.shown) return;
  const c = R.shown.c, w = CW.explain(c, { tonic: R.S.tonic, minor: R.S.minor }, R.shown.next);
  el.innerHTML = `<div class="sheet-head"><div><b>${fmt(w.title)}</b><small>${fmt(c.rn)} in ${fmt(keyLabel(R.S))}</small></div><button class="icon" data-r="close-sheet" aria-label="Close">✕</button></div>
  ${w.items.map((x) => `<section class="why"><h3><span class="whytone">${fmt(x.tone)}</span> ${fmt(x.note)}</h3><p>${fmt(x.text)}</p><p class="note">${fmt(x.where)}</p></section>`).join('')}
  ${w.ctx.length ? `<section class="why ctx"><h3>Why here</h3>${w.ctx.map((t) => `<p>${fmt(t)}</p>`).join('')}</section>` : ''}
  <p class="note">The run keeps going behind this; pause first to take your time.</p>`;
  el.hidden = false; el.scrollTop = 0;
  document.body.classList.add('locked');
}
function closeSheet() {
  const el = document.getElementById('sheet');
  if (el) el.hidden = true;
  document.body.classList.remove('locked');
}

// ---------- scale mode ----------
const LEVEL_NAME = { 1: 'Easy', 2: 'Medium', 3: 'Hard', 4: 'Exotic' };
const LEGEND_SCALE = '<div class="legend"><span class="k r">root</span><span class="k t3">3rd</span><span class="k t5">5th</span><span class="k t7">7th</span><span class="k tx">chord colour</span><span class="k sc">rest of the scale</span></div>';
function soloHTML(c) {
  const x = c.solo;
  const from = [x.scale.alias, x.note].filter(Boolean).join(' · ');
  return `<div class="solo lv${x.level}"><div class="solo-top"><small>Solo with</small><span class="lvl">${LEVEL_NAME[x.level]}</span></div><b>${fmt(SC.scaleTitle(x, c.root))}</b>${from ? `<i>${fmt(from)}</i>` : ''}<p>${fmt(x.sentence)}</p></div>`;
}
function scaleListHTML(S) {
  let html = '';
  const tpc = T.notePc(S.tonic);
  for (const grp of sheetChords(S)) {
    html += `<h2 class="sgroup">${fmt(grp.title)}</h2>`;
    for (const c of grp.list) {
      const root = H.spell(S.tonic, c.spec.iv);
      const all = SC.scalesFor(c.spec.iv, c.q, S.minor, tpc);
      html += `<div class="schord"><div class="shead"><b class="cnum">${fmt(H.label(c.spec, c.q))}</b><span class="cname">${fmt(H.chordName(root, c.q))}</span>${c.note ? `<small>${esc(c.note)}</small>` : ''}</div>`;
      for (const lv of [1, 2, 3, 4]) {
        const xs = all.filter((x) => x.level === lv);
        if (!xs.length) continue;
        html += `<div class="slevel${D.scaleLevel === 'any' || Number(D.scaleLevel) === lv ? ' cur' : ''}"><span class="lvl">${LEVEL_NAME[lv]}</span>${xs.map((x) => {
          const from = [x.scale.alias, x.note].filter(Boolean).join(' · ');
          return `<div class="sopt"><b>${fmt(SC.scaleTitle(x, root))}</b>${from ? ` <i>${fmt(from)}</i>` : ''}<p>${fmt(x.sentence)}</p></div>`;
        }).join('')}</div>`;
      }
      html += '</div>';
    }
  }
  return html;
}
function listWalkthrough(S, body, title) {
  $app.innerHTML = `
  <header class="chead"><button class="icon" data-w="back" aria-label="Back">‹</button><h1>${esc(title)}</h1><span></span></header>
  <p class="lead">${fmt(keyLabel(S))} · ${fmt(posLabel(S))}</p>
  ${namesButton('w')}
  ${D.play === 'modal' ? LEGEND_MODE : LEGEND}
  ${body}`;
  applyNames();
  $app.onclick = (e) => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.w === 'back') return setup();
    if (b.dataset.w === 'names' || b.dataset.w === 'nums') { flipLabel(b.dataset.w); save(); applyNames(); }
  };
  window.scrollTo(0, 0);
}
function scaleWalkthrough(S) {
  const title = D.src === 'genre' ? GN.genreById(D.genre).name : D.src === 'prog' ? prog().name : H.SETS[D.kt].find((s) => s.id === D.set).name;
  $app.innerHTML = `
  <header class="chead"><button class="icon" data-w="back" aria-label="Back">‹</button><h1>Scale options</h1><span></span></header>
  <p class="lead"><b>${esc(title)}</b> · ${fmt(keyLabel(S))}. Every scale that works over each chord, from easy to exotic, with what it sounds like here.</p>
  ${progLike() ? chartHTML(progSlots(S.minor), { tonic: S.tonic }) : ''}
  ${namesButton('w')}
  <div class="scalelist">${scaleListHTML(S)}</div>`;
  applyNames();
  $app.onclick = (e) => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.w === 'back') return setup();
    if (b.dataset.w === 'names' || b.dataset.w === 'nums') { flipLabel(b.dataset.w); save(); applyNames(); }
  };
  window.scrollTo(0, 0);
}


// ---------- your own progressions ----------
// A chart in numerals (ii7 V7 | Imaj7, I/3 = I over the 3rd of the key, V7/ii, iiø7, vii°7) or chord names in a
// written key (Dm7 G7 | Cmaj7, C/E). Bars split by |; without bars, one chord a bar. Stored as engine tokens.
const ROM = { i: 1, ii: 2, iii: 3, iv: 4, v: 5, vi: 6, vii: 7 };
const SUF_UP = { '': 'maj', maj: 'maj', M: 'maj', maj7: 'maj7', M7: 'maj7', 'Δ': 'maj7', 'Δ7': 'maj7', '7': '7', '6': '6', '9': '9', '11': '11', '13': '13', maj9: 'maj9', add9: 'add9', '6/9': '6/9', '69': '6/9', sus: 'sus4', sus4: 'sus4', sus2: 'sus2', '7sus4': '7sus4', '7sus': '7sus4', '9sus4': '9sus4', '+': 'aug', aug: 'aug', '7#5': '7#5', '+7': '7#5', '7b9': '7b9', '7#9': '7#9', '7#11': '7#11', '7b13': '7b13', '7alt': '7alt', alt: '7alt', '13b9': '13b9', 'maj7#11': 'maj7#11', '5': '5', 'm': 'min', 'm7': 'm7', 'm6': 'm6', 'm9': 'm9', '°': 'dim', '°7': 'dim7', o: 'dim', o7: 'dim7', 'ø': 'm7b5', 'ø7': 'm7b5', m7b5: 'm7b5', dim: 'dim', dim7: 'dim7' };
const SUF_LO = { '': 'min', '7': 'm7', '6': 'm6', '9': 'm9', '11': 'm11', '13': 'm13', maj7: 'mMaj7', '(maj7)': 'mMaj7', add9: 'madd9', '6/9': 'm6/9', 'ø': 'm7b5', 'ø7': 'm7b5', '7b5': 'm7b5', m7b5: 'm7b5', '°': 'dim', '°7': 'dim7', o: 'dim', o7: 'dim7', dim: 'dim', dim7: 'dim7', '+': 'aug' };
const C0 = T.parseNote('C');
function romanHead(iv, q) {
  const m = /^(b|#)?(\d)$/.exec(iv);
  const r = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'][Number(m[2]) - 1];
  return (m[1] || '') + (H.isMinorish(q) ? r.toLowerCase() : r);
}
function userToken(raw, keyTonic) {
  const t = raw.replace(/♭/g, 'b').replace(/♯/g, '#');
  // chord name in the written key
  const nm = /^([A-G](?:b|#)?)([^/]*)(?:\/([A-G](?:b|#)?))?$/.exec(t);
  if (nm) {
    const q = SUF_UP[nm[2]];
    if (!q) throw new Error(`Don’t know the chord type in “${raw}”`);
    const root = T.parseNote(nm[1]);
    const iv = H.ivFrom(keyTonic, root);
    const bass = nm[3] ? H.ivFrom(root, T.parseNote(nm[3])) : null;
    return `${romanHead(iv, q)}:${q}${bass && bass !== '1' ? `/${bass}` : ''}`;
  }
  const m = /^(b|#)?(vii|vi|iv|v|iii|ii|i|VII|VI|IV|V|III|II|I)([^/]*)(?:\/(.+))?$/.exec(t);
  if (!m) throw new Error(`Can’t read “${raw}”: write numerals like ii7, V7, Imaj7, ♭VII, or chord names like Dm7`);
  const lower = m[2] === m[2].toLowerCase();
  const q = (lower ? SUF_LO : SUF_UP)[m[3]];
  if (!q) throw new Error(`Don’t know the chord type in “${raw}”`);
  const head = (m[1] || '') + m[2];
  if (!m[4]) return `${head}:${q}`;
  // after the slash: a numeral = a secondary chord (V7/ii); a number = the bass as a degree of the key (I/3)
  if (/^(b|#)?[ivIV]+$/.test(m[4])) return `${head}/${m[4]}:${q}`;
  const dm = /^(b|#)?([1-7])$/.exec(m[4]);
  if (!dm) throw new Error(`Can’t read the bass in “${raw}”`);
  const chordIv = (m[1] || '') + String(ROM[m[2].toLowerCase()]);
  const root = T.transpose(C0, chordIv), bassNote = T.transpose(C0, (dm[1] || '') + dm[2]);
  const bass = H.ivFrom(root, bassNote);
  return `${head}:${q}${bass !== '1' ? `/${bass}` : ''}`;
}
function parseUserChart(text, keyName) {
  const tonic = T.parseNote(keyName);
  const hasBars = text.includes('|');
  const bars = (hasBars ? text.split('|') : text.split(/\s+/)).map((b) => b.trim()).filter(Boolean);
  if (!bars.length) throw new Error('Write at least one chord');
  return '| ' + bars.map((b) => b.split(/\s+/).filter(Boolean).map((tok) => userToken(tok, tonic)).join(' ')).join(' | ') + ' |';
}
function editor(item) {
  stop();
  const ed = item ? { ...item, key: item.writtenIn || 'C' } : { id: `mine-${Date.now().toString(36)}`, name: '', minor: D.kt === 'minor', text: '', key: 'C' };
  const draw = () => {
    let preview = '', chart = null;
    try {
      if (ed.text.trim()) { chart = parseUserChart(ed.text, ed.key || 'C'); preview = chartHTML(L.resolve({ chart }).flatMap((b, bi) => b.map((spec) => ({ spec, bar: bi }))), { tonic: T.parseNote(D.key === 'rand' ? 'C' : D.key) }); }
    } catch (e) { preview = `<p class="note warn">${esc(e.message)}</p>`; }
    $app.innerHTML = `
    <header class="chead"><button class="icon" data-e="back" aria-label="Back">‹</button><h1>${item ? 'Edit progression' : 'New progression'}</h1><span></span></header>
    <section class="card">
      <h2>Name</h2><input id="ename" class="select" value="${esc(ed.name)}" placeholder="My ii–V" aria-label="Name">
      <h2>Chart</h2><textarea id="etext" class="select" rows="4" placeholder="ii7 V7 | Imaj7 | vi7 II7 | ii7 V7" aria-label="Chart">${esc(ed.text)}</textarea>
      <p class="note">Numerals: <b>ii7 V7 Imaj7</b>, <b>♭VII7</b>, <b>iiø7</b>, <b>vii°7</b>, <b>iv6</b>, secondary <b>V7/ii</b>, slash <b>I/3</b> (I over the 3rd of the key). Or chord names in the key below: <b>Dm7 G7 Cmaj7</b>, <b>C/E</b>. Split bars with <b>|</b>; two chords in a bar share it. Without bars, one chord a bar.</p>
      <h3>Chord names are written in</h3>
      <div class="chips">${MAJOR_KEYS.map((k) => `<button class="chip ${ed.key === k ? 'on' : ''}" data-ekey="${k}">${fmt(T.pretty(k))}</button>`).join('')}</div>
      <div class="chips"><button class="chip ${ed.minor ? 'on' : ''}" data-e="minor">Minor key (the tonic is i)</button></div>
      <h3>Preview</h3>${preview || '<p class="note">Type a chart to see it.</p>'}
    </section>
    <div class="actions"><button class="primary" data-e="save" ${chart ? '' : 'disabled'}>Save</button>${item ? '<button data-e="delete">Delete</button>' : ''}</div>`;
    const tn = $app.querySelector('#ename'), tt = $app.querySelector('#etext');
    tn.oninput = () => { ed.name = tn.value; };
    tt.onchange = () => { ed.text = tt.value; draw(); };
    $app.onclick = (e) => {
      const b = e.target.closest('button'); if (!b) return;
      if (b.dataset.ekey) { ed.text = tt.value; ed.key = b.dataset.ekey; return draw(); }
      const a = b.dataset.e;
      if (a === 'back') return setup();
      if (a === 'minor') { ed.text = tt.value; ed.minor = !ed.minor; return draw(); }
      if (a === 'delete') { D.mine = (D.mine || []).filter((m) => m.id !== ed.id); if (D.prog === ed.id) D.prog = 'major-ii-v-i'; save(); return setup(); }
      if (a === 'save' && chart) {
        const rec = { id: ed.id, name: ed.name.trim() || 'My progression', chart, minor: ed.minor, text: tt.value, writtenIn: ed.key };
        D.mine = [...(D.mine || []).filter((m) => m.id !== rec.id), rec];
        D.prog = rec.id; D.src = 'prog'; D.kt = rec.minor ? 'minor' : 'major';
        save(); setup();
      }
    };
  };
  draw();
}
// save the evolved version playing now as one of your progressions
function keepVersion(btn) {
  if (!R?.slots) return;
  const bars = [];
  R.slots.forEach((x) => { const sp = x.spec; (bars[x.bar] ||= []).push(`${romanHead(sp.iv, sp.q)}:${sp.q}${sp.bass && sp.bass !== '1' ? `/${sp.bass}` : ''}`); });
  const chart = '| ' + bars.filter(Boolean).map((b) => b.join(' ')).join(' | ') + ' |';
  const base = prog().name.replace(/ \(evolved.*\)$/, '');
  const n = (D.mine || []).filter((m) => m.name.startsWith(base + ' (evolved')).length + 1;
  const rec = { id: `mine-${Date.now().toString(36)}`, name: `${base} (evolved ${n})`, chart, minor: R.S.minor, text: L.resolve({ chart }).map((b) => b.map((sp) => H.label(sp)).join(' ')).join(' | '), writtenIn: 'C' };
  D.mine = [...(D.mine || []), rec];
  save();
  btn.textContent = 'Saved ✓';
  setTimeout(() => { if (btn.isConnected) btn.textContent = 'Save this version'; }, 1800);
}

// ---------- walkthrough: every chord in the set or progression, with its grip ----------
function walkItems(S) {
  const items = [];
  let prev = null;
  if (progLike()) {
    const slots = progSlots(S.minor);
    const seen = new Set();
    slots.forEach((x, i) => {
      const q = colourise(x.spec, slots[(i + 1) % slots.length].spec, x.oid, S.minor);
      const key = `${x.spec.iv}:${q}:${x.spec.rel ? x.spec.rel.to : ''}:${x.spec.bass || ''}`;
      const c = realise(S, x.spec, q, prev, { vl: prog().vl });
      prev = c.grip;
      if (seen.has(key)) return;
      seen.add(key);
      items.push({ ...c, group: '' });
    });
    return items;
  }
  if (D.set === 'any') {
    for (const q of H.ANY_QUALITIES[D.colour]) items.push({ ...realise(S, { iv: '1', q }, q, null), group: `Every chord type on ${T.noteName(S.tonic, true)}, in this position` });
    return items;
  }
  for (const e of H.setPool(S.minor ? 'minor' : 'major', D.set)) {
    const qs = D.colour === 'tri' ? [e.tri] : D.colour === 'sev' ? [e.sev] : e.col;
    for (const q of qs) items.push({ ...realise(S, { iv: e.iv, q, rel: e.rel }, q, null, { fn: e.fn, tag: e.tag }), group: H.GROUP_NAMES[e.group] });
  }
  return items;
}
function walkthrough() {
  stop();
  const S = session();
  if (scaleMode()) return scaleWalkthrough(S);
  if (lineMode()) return listWalkthrough(S, toneListHTML(S), { arps: 'Arpeggios', guide: 'Guide tones', modal: 'Mode chords' }[D.play]);
  const items = walkItems(S);
  const title = D.src === 'genre' ? GN.genreById(D.genre).name : D.src === 'prog' ? prog().name : H.SETS[D.kt].find((s) => s.id === D.set).name;
  let html = '', group = null;
  items.forEach((c, i) => {
    if (c.group && c.group !== group) { if (group !== null) html += '</div>'; html += `<h2 class="wgroup">${esc(c.group)}</h2><div class="cards">`; group = c.group; }
    else if (i === 0) html += '<div class="cards">';
    html += `<button class="wcard" data-i="${i}"><div class="wtop"><b class="cnum">${fmt(c.rn)}</b><span class="cname">${fmt(c.name)}</span></div>${neckSVG(c.grip, { ...windowFor(S, c.grip), small: true })}<div class="wmeta">${esc(gripTag(c.grip))}${c.tag ? ` · ${esc(c.tag)}` : ''}${c.plainer ? ` · <i>plainer: no ${fmt(T.pretty(T.getChord(c.plainer).sym))} grip here</i>` : ''}</div>${c.fn ? `<div class="wfn">${esc(c.fn)}</div>` : ''}</button>`;
  });
  html += '</div>';
  $app.innerHTML = `
  <header class="chead"><button class="icon" data-w="back" aria-label="Back">‹</button><h1>Walkthrough</h1><span></span></header>
  <p class="lead"><b>${esc(title)}</b> · ${fmt(keyLabel(S))} · ${fmt(posLabel(S))}${D.src === 'set' ? ` · ${esc(H.COLOURS.find((c) => c.id === D.colour).name.toLowerCase())}` : ''}. Play through steps along at your tempo.</p>
  ${progLike() ? chartHTML(progSlots(S.minor), { tonic: S.tonic }) : ''}
  <div class="actions"><button class="primary" data-w="play">▶ Play through</button></div>
  ${namesButton('w')}
  ${LEGEND}
  ${html}`;
  applyNames();
  let playing = null;
  const mark = (i) => {
    $app.querySelectorAll('.wcard').forEach((el) => el.classList.toggle('on', Number(el.dataset.i) === i));
  };
  $app.onclick = async (e) => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.w === 'back') { clearTimeout(playing); return setup(); }
    if (b.dataset.w === 'names' || b.dataset.w === 'nums') { flipLabel(b.dataset.w); save(); return applyNames(); }
    if (b.dataset.w === 'play') {
      if (playing !== null) { clearTimeout(playing); playing = null; b.textContent = '▶ Play through'; return; }
      b.textContent = '■ Stop';
      let i = 0;
      const step = () => {
        if (i >= items.length) { playing = null; b.textContent = '▶ Play through'; return; }
        mark(i);
        $app.querySelector(`.wcard[data-i="${i}"]`)?.scrollIntoView({ block: 'center', behavior: 'smooth' });
        i++;
        playing = setTimeout(step, Math.max(900, 2 * 60000 / D.bpm));
      };
      step();
      return;
    }
    if (b.dataset.i !== undefined) mark(Number(b.dataset.i));
  };
  window.scrollTo(0, 0);
}

document.addEventListener('keydown', (e) => {
  if (!R || R.stopped) return;
  if (e.code === 'Space') { e.preventDefault(); const b = $app.querySelector('[data-r="pause"]'); if (b) togglePause(b); }
  if (e.code === 'Escape') finish();
});
setup();
if ('serviceWorker' in navigator && location.protocol !== 'file:') navigator.serviceWorker.register('sw.js').catch(() => {});
