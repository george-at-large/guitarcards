// Workouts: systematic coverage, one step at a time. A workout is a list of steps for one key in one area of the neck
// (a CAGED shape, or two side by side), or for one key across the whole neck. Each step says what to play, draws it,
// and says what to sound first (a chord or a short cadence, then the chord held while you play, then where it
// resolves). Pure: no DOM, no audio; the runner (wkrun.js) draws and sounds the steps.
import * as T from '../theory.js';
import * as F from '../fretboard.js';
import * as G from './grips.js';
import * as H from './harmony.js';
import * as SC from './scales.js';

// ---------- the key loops ----------
export const MAJOR_KEYS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
export const LOOPS = [
  { id: 'one', name: 'This key', blurb: 'Just the key you pick.' },
  { id: 'k4', name: 'Cycle of 4ths', blurb: 'C F B♭ E♭ A♭ D♭ F♯ B E A D G: each key a 4th up, the way tunes move.' },
  { id: 'k5', name: 'Cycle of 5ths', blurb: 'C G D A E B F♯ D♭ A♭ E♭ B♭ F: each key a 5th up, one sharp more each time.' },
  { id: 'up', name: 'Chromatic ↑', blurb: 'Up a half step each time.' },
  { id: 'down', name: 'Chromatic ↓', blurb: 'Down a half step each time.' },
  { id: 'pos', name: 'One position', blurb: 'The cycle of 4ths without moving your hand: each key in whichever CAGED shape lives where you started. The best loop for learning every shape.' },
  { id: 'rand', name: 'Random', blurb: 'All twelve keys in a shuffled order, none twice.' },
];
const pcOf = (k) => T.notePc(T.parseNote(k));
const keyAtPc = (pc) => MAJOR_KEYS.find((k) => pcOf(k) === ((pc % 12) + 12) % 12);
export function loopKeys(start, loop, seed = 1) {
  const p = pcOf(start);
  const step = { k4: 5, pos: 5, k5: 7, up: 1, down: 11 }[loop];
  if (loop === 'one') return [start];
  if (step) return Array.from({ length: 12 }, (_, i) => keyAtPc(p + i * step));
  // random: a fixed shuffle (from the seed), starting from the chosen key
  const rest = MAJOR_KEYS.filter((k) => k !== start);
  let s = seed;
  for (let i = rest.length - 1; i > 0; i--) { s = (s * 9301 + 49297) % 233280; const j = Math.floor((s / 233280) * (i + 1)); [rest[i], rest[j]] = [rest[j], rest[i]]; }
  return [start, ...rest];
}
// "one position": the shape of this key whose window sits nearest the starting area
export function shapeNear(key, lo) {
  const tonic = T.parseNote(key);
  let best = null, bd = Infinity;
  for (const s of G.SHAPES) {
    const w = G.positionOf(tonic, s);
    for (const o of [-12, 0, 12]) { const d = Math.abs(w.lo + o - lo); if (w.lo + o >= 0 && w.hi + o <= 17 && d < bd) { bd = d; best = s; } }
  }
  return best;
}
// the five shapes up the neck from one
export const shapesFrom = (s) => Array.from({ length: 5 }, (_, i) => G.SHAPES[(G.SHAPES.indexOf(s) + i) % 5]);

// ---------- chord types ----------
export const TYPES = {
  tri: { name: 'Triads', qs: ['maj', 'min', 'dim', 'aug'] },
  sev: { name: 'Sevenths', qs: ['maj7', '7', 'm7', 'm7b5', 'dim7'] },
  ext: { name: 'Extras', qs: ['6', 'm6', 'mMaj7', '7sus4'] },
};
export const typesFor = (sel) => Object.keys(TYPES).filter((k) => sel[k]).flatMap((k) => TYPES[k].qs);

// ---------- helpers ----------
const INV = ['root position', '1st inversion', '2nd inversion', '3rd inversion'];
const simple = (iv) => iv.replace(/^(b|#)?(9|11|13)$/, (m, a, n) => (a || '') + { 9: '2', 11: '4', 13: '6' }[n]);
const relOf = (ivs) => [...new Set(ivs.map((iv) => T.intervalSemis(F.simpleIv(simple(iv))) % 12))];
const SCALE = Object.fromEntries(SC.SCALES.map((s) => [s.id, s]));
const scaleName = (id) => SCALE[id].name.replace(/\s*\(.*\)/, '');
const strings = (set) => set.join('-');
const avg = (notes) => notes.reduce((s, n) => s + n.fret, 0) / notes.length;
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
function voicings(root, q, voicing, set) {
  try { return F.chordVoicings({ root, quality: q, voicing, stringSet: set, inversion: 'all' }); } catch (e) { return []; }
}
const grip = (notes, extra = {}) => {
  const fr = notes.filter((n) => n.fret > 0).map((n) => n.fret);
  return { notes: notes.map((n) => ({ ...n })), lo: fr.length ? Math.min(...fr) : 0, hi: Math.max(0, ...notes.map((n) => n.fret)), ...extra };
};
const midis = (g) => (g ? [...new Set(g.notes.map((n) => n.midi))].sort((a, b) => a - b) : []);
// a window a little wider than the notes, at least five frets
function around(lo, hi) { const a = Math.max(0, lo - 1); return { lo: a, hi: Math.max(a + 4, hi + 1) }; }
const areaView = (pos) => ({ lo: Math.max(0, pos.lo - (pos.lo > 0 ? 1 : 0)), hi: Math.min(17, pos.hi + 1), band: pos });

// the key's world: spell a degree, name a chord, voice it in the area for the sound
function keyCtx(key, pos) {
  const tonic = T.parseNote(key);
  const root = (iv) => H.spell(tonic, iv);
  const name = (iv, q) => H.chordName(root(iv), q) + (q === 'maj' ? ' major' : '');
  const rn = (iv, q, rel) => H.label({ iv, q, ...(rel ? { rel } : {}) });
  const voiced = (iv, q) => {
    const r = root(iv);
    const g = pos ? G.gripInPosition(r, q, pos) : G.gripNear(r, q, 'E', 5) || G.gripNear(r, q, 'A', 5);
    if (g) return midis(g);
    const pc = T.notePc(r);
    return [40 + ((pc - 4 + 12) % 12), ...relOf(T.getChord(q).ivs).map((x) => 55 + ((pc + x - 55) % 12 + 12) % 12)];
  };
  return { tonic, key, root, name, rn, voiced, pos };
}
const chordSound = (k, seq) => seq.map(([iv, q]) => ({ midis: k.voiced(iv, q), name: k.name(iv, q) }));

// a scale over a chord, inside the area: chord tones coloured, the rest plain, an optional colour note picked out
function scaleNeck(k, { iv, q, scale, colour = null, rel = null }) {
  const root = k.root(iv);
  const r = rel || relOf(SCALE[scale].ivs);
  const p = k.pos;
  const colourRel = colour ? T.intervalSemis(F.simpleIv(colour)) % 12 : -1;
  const notes = SC.scaleNotesIn({ rel: r }, root, q, Math.max(0, p.lo), p.hi).map((n) => {
    const nrel = ((n.midi - T.notePc(root)) % 12 + 12) % 12;
    if (nrel === colourRel && !n.chord) return { ...n, kind: 'tx', mark: true };
    return n.chord ? n : { ...n, kind: 'sc' };
  });
  return { ...grip(notes), ...areaView(p) };
}
// a scale step: sound the context, hold the chord, play the scale, resolve
function scaleStep(k, { iv, q, scale, colour, title, sub, tip, before = [], resolve = null, rel = null, scaleLabel = null }) {
  const nm = k.name(iv, q);
  return {
    title: title || `${T.noteName(k.root(iv), true)} ${scaleLabel || scaleName(scale)}`,
    sub: sub || `over ${nm} (${k.rn(iv, q)})`,
    tip,
    necks: [scaleNeck(k, { iv, q, scale, colour, rel })],
    legend: 'scale',
    sound: { seq: chordSound(k, [...before, [iv, q]]), resolve: resolve ? chordSound(k, [resolve])[0] : null },
  };
}
const PLAY_SCALE = 'From the lowest note in the shape up to the highest and back, slowly, hearing it against the held chord. Linger on the coloured chord tones.';

// ---------- the workouts ----------
// area: true = per CAGED shape (or pair), false = across the whole neck
const W = [];
const def = (o) => W.push(o);

// ----- chords -----
def({
  id: 'caged-chords', group: 'Chords', name: 'Chords in the CAGED shapes', area: true, types: true,
  blurb: 'Every chord type on the key’s root, in the shape: the grip, then across the string sets, each inversion that lives there.',
  build(k, o) {
    const steps = [], r = k.root('1'), p = k.pos;
    for (const q of o.qs) {
      const nm = k.name('1', q), n = T.getChord(q).ivs.length;
      for (const shape of p.shapes || [p.shape]) {
        const ps = G.placements(r, q, shape).filter((x) => fits(x.notes, p));
        if (ps.length) steps.push({ title: `${nm} · ${shape} shape grip`, sub: 'the CAGED grip', tip: 'Grip it, strum it, then pick each note low to high and say its name: root, 3rd, 5th, 7th.', necks: [{ ...grip(ps[0].notes), ...areaView(p) }], legend: 'chord', sound: { seq: [{ midis: midis(ps[0]), name: nm }] } });
      }
      const fam = n === 3 ? [['close', 'triad', [[6, 5, 4], [5, 4, 3], [4, 3, 2], [3, 2, 1]]]] : [['drop2', 'drop 2', [[6, 5, 4, 3], [5, 4, 3, 2], [4, 3, 2, 1]]], ['drop3', 'drop 3', [[6, 4, 3, 2], [5, 3, 2, 1]]]];
      for (const [voicing, kind, sets] of fam) for (const set of sets) {
        for (const v of voicings(r, q, voicing, set).filter((x) => fits(x.notes, p)).sort((a, b) => avg(a.notes) - avg(b.notes))) {
          steps.push({ title: `${nm} · ${kind} · ${INV[v.inversion] || `${v.bassIv} in the bass`}`, sub: `strings ${strings(set)}`, tip: `The ${T.prettyIv(v.bassIv)} is in the bass. Find it from the grip: which grip notes does it share?`, necks: [{ ...grip(v.notes), ...areaView(p) }], legend: 'chord', sound: { seq: [{ midis: midis(v), name: nm }] } });
        }
      }
    }
    return steps;
  },
});
// one string set at a time, up the neck through every inversion
function upTheNeck(k, qs, families) {
  const steps = [], r = k.root('1');
  for (const q of qs) {
    const nm = k.name('1', q);
    for (const [voicing, kind, sets] of families(T.getChord(q).ivs.length)) for (const set of sets) {
      const vs = voicings(r, q, voicing, set).filter((v) => Math.max(...v.notes.map((n) => n.fret)) <= 15).sort((a, b) => avg(a.notes) - avg(b.notes));
      vs.forEach((v, i) => {
        const g = grip(v.notes);
        steps.push({ title: `${nm} · ${INV[v.inversion] || `${v.bassIv} in the bass`}`, sub: `${kind} · strings ${strings(set)} · ${i + 1} of ${vs.length} up the neck`, tip: i === 0 ? 'Start at the bottom of the neck. Each next inversion is the next one up: the lowest note moves to the next chord tone.' : 'Slide up to it. Watch which voice moves: each note goes up to the next chord tone.', necks: [{ ...g, ...around(g.lo, g.hi), prev: i ? grip(vs[i - 1].notes) : null }], legend: 'chord', sound: { seq: [{ midis: midis(v), name: nm }] } });
      });
    }
  }
  return steps;
}
def({
  id: 'triad-sets', group: 'Chords', name: 'Triads on the string sets', area: false,
  blurb: 'Major, minor, diminished, augmented: one string set at a time, up the neck through every inversion.',
  build: (k) => upTheNeck(k, TYPES.tri.qs, () => [['close', 'close triad', [[3, 2, 1], [4, 3, 2], [5, 4, 3], [6, 5, 4]]]]),
});
def({
  id: 'drop2-sets', group: 'Chords', name: 'Drop 2 on the string sets', area: false,
  blurb: 'The five sevenths in drop 2 on strings 4-3-2-1, 5-4-3-2 and 6-5-4-3, every inversion, up the neck.',
  build: (k) => upTheNeck(k, TYPES.sev.qs, () => [['drop2', 'drop 2', [[4, 3, 2, 1], [5, 4, 3, 2], [6, 5, 4, 3]]]]),
});
def({
  id: 'drop3-sets', group: 'Chords', name: 'Drop 3 on the string sets', area: false,
  blurb: 'The five sevenths in drop 3 on strings 6-4-3-2 and 5-3-2-1, every inversion, up the neck.',
  build: (k) => upTheNeck(k, TYPES.sev.qs, () => [['drop3', 'drop 3', [[6, 4, 3, 2], [5, 3, 2, 1]]]]),
});
// the key's own chords, one string set, each up from the last
const DEG = ['1', '2', '3', '4', '5', '6', '7'];
const TRI_Q = ['maj', 'min', 'min', 'maj', 'maj', 'min', 'dim'];
const SEV_Q = ['maj7', 'm7', 'm7', 'maj7', '7', 'm7', 'm7b5'];
// chord scales: the seven chords of a parent scale up one string set, the parent scale faint behind them
const TRI_BY = { '4,7': 'maj', '3,7': 'min', '3,6': 'dim', '4,8': 'aug' };
const SEV_BY = { '4,7,11': 'maj7', '4,7,10': '7', '3,7,10': 'm7', '3,6,10': 'm7b5', '3,6,9': 'dim7', '3,7,11': 'mMaj7', '4,8,11': 'maj7#5', '4,6,10': '7b5' };
function stacked(ivs, d, n) {
  const sem = ivs.map((iv) => T.intervalSemis(F.simpleIv(iv)) % 12);
  const sig = [2, 4, 6].slice(0, n - 1).map((j) => ((sem[(d + j) % 7] - sem[d]) % 12 + 12) % 12).join(',');
  return (n === 3 ? TRI_BY : SEV_BY)[sig] || null;
}
const PARENTS = [
  { id: 'chord-scales', scale: 'ionian', mode: 'major', name: 'Chord scales: major', blurb: 'The key’s seven chords up one string set (I, ii, iii… to I an octave up), in triads and in drop 2, the major scale faint behind them: from knowing shapes to knowing the key.' },
  { id: 'cs-melmin', scale: 'mel-min', mode: 'melodic minor', name: 'Chord scales: melodic minor', blurb: 'i mMaj7, ii m7, ♭III maj7♯5, IV7, V7, vi ø, vii ø: the jazz minor’s chords, in triads and drop 2, the scale faint behind them.' },
  { id: 'cs-harmmin', scale: 'harm-min', mode: 'harmonic minor', name: 'Chord scales: harmonic minor', blurb: 'i mMaj7, ii ø, ♭III maj7♯5, iv m7, V7, ♭VI maj7, vii °7: the classical minor’s chords, the scale faint behind them.' },
  { id: 'cs-harmmaj', scale: 'harm-maj', mode: 'harmonic major', name: 'Chord scales: harmonic major', blurb: 'Major with a ♭6: Imaj7, ii ø, iii m7, iv mMaj7, V7, ♭VI maj7♯5, vii °7. The minor iv’s sigh inside a major key.' },
];
for (const P of PARENTS) def({
  id: P.id, group: 'Chord scales', name: P.name, area: false, mode: P.mode, blurb: P.blurb,
  build(k) {
    const steps = [], ivs = SCALE[P.scale].ivs, rel = relOf(ivs);
    const runs = [...[[3, 2, 1], [4, 3, 2], [5, 4, 3], [6, 5, 4]].map((s) => ['close', 'triads', s, 3]), ...[[4, 3, 2, 1], [5, 4, 3, 2], [6, 5, 4, 3]].map((s) => ['drop2', 'drop 2', s, 4])];
    for (const [voicing, kind, set, n] of runs) {
      let prev = null;
      for (let d = 0; d <= 7; d++) {
        const iv = ivs[d % 7], q = stacked(ivs, d % 7, n);
        if (!q) continue;
        const vs = voicings(k.root(iv), q, voicing, set).filter((v) => Math.max(...v.notes.map((x) => x.fret)) <= 17);
        if (!vs.length) continue;
        let v;
        if (!prev) v = vs.reduce((a, b) => (avg(a.notes) <= avg(b.notes) ? a : b));
        else { const up = vs.filter((x) => avg(x.notes) > avg(prev.notes)); v = up.length ? up.reduce((a, b) => (avg(a.notes) <= avg(b.notes) ? a : b)) : vs.reduce((a, b) => (avg(a.notes) <= avg(b.notes) ? a : b)); }
        const g = grip(v.notes), w = around(g.lo, g.hi);
        const bg = SC.scaleNotesIn({ rel }, k.tonic, 'maj', w.lo, w.hi).map((x) => ({ string: x.string, fret: x.fret, root: x.iv === '1' }));
        steps.push({ title: `${k.rn(iv, q)} · ${k.name(iv, q)}`, sub: `${P.mode} · ${kind} · strings ${strings(set)} · chord ${d + 1} of 8`,
          tip: d === 0 ? `The faint dots are ${T.noteName(k.tonic, true)} ${P.mode}: every chord here is built from them. Up one chord at a time; each voice steps up to the next note of the scale.` : 'Every voice moves up one step of the scale: find each new note among the faint ones.',
          necks: [{ ...g, ...w, bg, prev: prev ? grip(prev.notes) : null }], legend: 'chord', sound: { seq: [{ midis: midis(v), name: k.name(iv, q) }] } });
        prev = v;
      }
    }
    return steps;
  },
});

// ----- chord morphing: hold the voicing, change the type, one note moving a half step at a time -----
const MORPHS = [
  { fam: 'tri', voicing: 'close', kind: 'triad', chain: ['aug', 'maj', 'min', 'dim'], sets: [[3, 2, 1], [4, 3, 2], [5, 4, 3], [6, 5, 4]] },
  { fam: 'sev', voicing: 'drop2', kind: 'drop 2', chain: ['maj7', '7', 'm7', 'm7b5', 'dim7'], sets: [[4, 3, 2, 1], [5, 4, 3, 2], [6, 5, 4, 3]] },
  { fam: 'sev', voicing: 'drop3', kind: 'drop 3', chain: ['maj7', '7', 'm7', 'm7b5', 'dim7'], sets: [[6, 4, 3, 2], [5, 3, 2, 1]] },
];
// what moved between two voicings of the same shape: "7 → ♭7"
function moved(a, b) {
  const out = [];
  for (const n of b.notes) {
    const o = a.notes.find((x) => x.string === n.string);
    if (o && o.midi !== n.midi) out.push(`${T.prettyIv(o.iv)} → ${T.prettyIv(n.iv)} ${n.midi < o.midi ? 'down' : 'up'} a ${Math.abs(n.midi - o.midi) === 1 ? 'half step' : 'whole step'}`);
  }
  return out;
}
// one voicing morphed through the chain: the same inversion on the same strings, as close as it can stay
function morphRun(k, m, set, base, where) {
  const r = k.root('1'), steps = [];
  let prev = base;
  m.chain.forEach((q, i) => {
    let v = base;
    if (i) {
      const vs = voicings(r, q, m.voicing, set).filter((x) => x.inversion === base.inversion);
      if (!vs.length) return;
      const cost = (x) => x.notes.reduce((t, n) => { const o = prev.notes.find((y) => y.string === n.string); return t + (o ? Math.abs(o.fret - n.fret) : 3); }, 0);
      v = vs.reduce((a, b) => (cost(a) <= cost(b) ? a : b));
    }
    const g = grip(v.notes), mv = i ? moved(prev, v) : [];
    const view = where ? areaView(where) : around(Math.min(g.lo, base.notes.length ? Math.min(...base.notes.filter((n) => n.fret > 0).map((n) => n.fret), g.lo) : g.lo), g.hi);
    steps.push({
      title: i ? `${k.name('1', m.chain[i - 1])} → ${k.name('1', q)}` : `${k.name('1', q)}`,
      sub: `${m.kind} · ${INV[base.inversion] || 'inversion'} · strings ${strings(set)}`,
      tip: i ? `Only ${mv.length === 1 ? 'one note moves' : `${mv.length} notes move`}: ${mv.join(', ')}. Keep the rest of the hand still.` : `Start here, then change the chord type one note at a time: ${m.chain.map((x) => T.pretty(T.chordSymbol(r, x))).join(' → ')}.`,
      necks: [{ ...g, ...view, prev: i ? grip(prev.notes) : null }], legend: 'chord', sound: { seq: [{ midis: midis(v), name: k.name('1', q) }] },
    });
    prev = v;
  });
  return steps;
}
const morphFams = (o) => MORPHS.filter((m) => (m.fam === 'tri' ? o.qs.includes('maj') || o.qs.includes('min') : o.qs.some((q) => ['maj7', '7', 'm7', 'm7b5', 'dim7'].includes(q))));
def({
  id: 'morph-sets', group: 'Chords', name: 'Chord morphing up the neck', area: false, types: true,
  blurb: 'One string set at a time: each inversion, from the bottom of the neck up, morphed through the types (maj7 → 7 → m7 → m7♭5 → °7, or aug → major → minor → diminished), one note moving at a time.',
  build(k, o) {
    const steps = [], r = k.root('1');
    for (const m of morphFams(o)) for (const set of m.sets) {
      const bases = voicings(r, m.chain[0], m.voicing, set).filter((v) => Math.max(...v.notes.map((n) => n.fret)) <= 15 && Math.min(...v.notes.map((n) => n.fret)) >= 2).sort((a, b) => avg(a.notes) - avg(b.notes));
      for (const b of bases) steps.push(...morphRun(k, m, set, b, null));
    }
    return steps;
  },
});
def({
  id: 'morph-caged', group: 'Chords', name: 'Chord morphing in the CAGED shapes', area: true, types: true,
  blurb: 'Across the string sets inside the shape: every voicing that lives there, morphed through the types, one note moving at a time.',
  build(k, o) {
    const steps = [], r = k.root('1');
    for (const m of morphFams(o)) for (const set of m.sets) {
      const bases = voicings(r, m.chain[0], m.voicing, set).filter((v) => fits(v.notes, k.pos) && Math.min(...v.notes.map((n) => n.fret)) >= 2).sort((a, b) => avg(a.notes) - avg(b.notes));
      for (const b of bases) steps.push(...morphRun(k, m, set, b, k.pos));
    }
    return steps;
  },
});

// ----- arpeggios -----
def({
  id: 'caged-arps', group: 'Arpeggios', name: 'Arpeggios in the CAGED shapes', area: true, types: true,
  blurb: 'Every chord type’s arpeggio on the key’s root, through the whole shape.',
  build(k, o) {
    const r = k.root('1'), p = k.pos;
    return o.qs.map((q) => {
      const notes = SC.scaleNotesIn({ rel: relOf(T.getChord(q).ivs) }, r, q, Math.max(0, p.lo), p.hi).map((n) => ({ ...n, mark: n.iv === '1' }));
      return { title: `${k.name('1', q)} arpeggio`, sub: `${(p.shapes || [p.shape]).join(' + ')} shape${p.shapes ? 's' : ''}`, tip: 'From the lowest note in the shape to the highest and back, one note per beat. Say each tone as you play it.', necks: [{ ...grip(notes), ...areaView(p) }], legend: 'chord', sound: { seq: [{ midis: k.voiced('1', q), name: k.name('1', q) }] } };
    });
  },
});
// a two-octave arpeggio that climbs the neck diagonally: each note on the string that keeps the hand moving least,
// at most three notes a string, never back to a lower string
function climb(root, q, startString) {
  const rel = relOf(T.getChord(q).ivs);
  const pc = T.notePc(root);
  const f0 = ((pc - F.OPEN[startString]) % 12 + 12) % 12 || 12;
  const m0 = F.OPEN[startString] + f0;
  const ps = [];
  for (let m = m0; m <= m0 + 24; m++) if (rel.includes(((m - pc) % 12 + 12) % 12)) ps.push(m);
  // dp over (note, string, count on that string)
  const key = (s, c) => `${s}:${c}`;
  let layer = new Map([[key(startString, 1), { cost: 0, f: f0, first: f0, path: [{ string: startString, fret: f0 }] }]]);
  for (let i = 1; i < ps.length; i++) {
    const next = new Map();
    for (const [kk, st] of layer) {
      const [s, c] = kk.split(':').map(Number);
      for (let s2 = s; s2 >= Math.max(1, s - 2); s2--) {
        const f = ps[i] - F.OPEN[s2];
        if (f < 0 || f > 17) continue;
        let cost;
        if (s2 === s) { if (c >= 3 || f <= st.f || f - st.first > 4) continue; cost = (f - st.f) * 0.6; }
        else cost = Math.abs(f - st.f) * (f < st.f ? 1.3 : 0.9) + (s - s2 - 1) * 4;
        const c2 = s2 === s ? c + 1 : 1, k2 = key(s2, c2), tot = st.cost + cost;
        if (!next.has(k2) || next.get(k2).cost > tot) next.set(k2, { cost: tot, f, first: s2 === s ? st.first : f, path: [...st.path, { string: s2, fret: f }] });
      }
    }
    layer = next;
    if (!layer.size) return null;
  }
  const best = [...layer.values()].reduce((a, b) => (a.cost <= b.cost ? a : b));
  const by = new Map(T.getChord(q).ivs.map((x) => [T.intervalSemis(F.simpleIv(simple(x))) % 12, x]));
  return best.path.map((n, i) => ({ ...n, midi: ps[i], iv: by.get(((ps[i] - pc) % 12 + 12) % 12), mark: i === 0 || i === ps.length - 1 }));
}
def({
  id: 'neck-arps', group: 'Arpeggios', name: 'Arpeggios up the neck', area: false, types: true,
  blurb: 'Two octaves on one line, climbing diagonally from the 6th-string root and from the 5th-string root: it links the shapes into one run.',
  build(k, o) {
    const steps = [], r = k.root('1');
    for (const q of o.qs) for (const s of [6, 5]) {
      const notes = climb(r, q, s);
      if (!notes) continue;
      const g = grip(notes);
      steps.push({ title: `${k.name('1', q)} · two octaves`, sub: `from the root on the ${s}th string`, tip: 'Up from the ringed root to the ringed root two octaves higher and back, shifting as you go. Slow and even.', necks: [{ ...g, ...around(g.lo, g.hi) }], legend: 'chord', line: true, sound: { seq: [{ midis: k.voiced('1', q), name: k.name('1', q) }] } });
    }
    return steps;
  },
});

// ----- scales in a key -----
const MODES = ['ionian', 'dorian', 'phrygian', 'lydian', 'mixolydian', 'aeolian', 'locrian'];
def({
  id: 'modes-key', group: 'Scales', name: 'Modes of the key', area: true,
  blurb: 'Each chord of the key, then its own mode in the same shape: one position, seven ways to hear it.',
  build(k) {
    return DEG.map((iv, i) => scaleStep(k, { iv, q: SEV_Q[i], scale: MODES[i], tip: `${i === 0 ? 'The key itself. ' : `The same notes as the key, now centred on the ${k.rn(iv, SEV_Q[i])} chord. `}${PLAY_SCALE}`, before: i ? [['1', 'maj7']] : [] }));
  },
});
const PARALLEL = [
  ['lydian', 'maj7', '#4', 'The brightest: the ♯4 floats.'], ['ionian', 'maj7', null, 'Plain major.'], ['mixolydian', '7', 'b7', 'Major with a ♭7.'],
  ['dorian', 'm7', '6', 'Minor with a natural 6.'], ['aeolian', 'm7', 'b6', 'Natural minor: the ♭6.'], ['phrygian', 'm7', 'b2', 'The ♭2: dark.'], ['locrian', 'm7b5', 'b5', 'The darkest: ♭2 and ♭5.'],
  ['harm-min', 'mMaj7', '7', 'Minor with a leading tone.'], ['mel-min', 'mMaj7', '6', 'Minor with a major top half.'],
];
def({
  id: 'parallel', group: 'Scales', name: 'Parallel colours', area: true,
  blurb: 'One tonic, every colour, brightest to darkest: Lydian, major, Mixolydian, Dorian, minor, Phrygian, Locrian, then harmonic and melodic minor.',
  build(k) {
    return PARALLEL.map(([scale, q, colour, feel]) => scaleStep(k, { iv: '1', q, scale, colour, tip: `${feel}${colour ? ` The highlighted note is its colour: the ${T.prettyIv(colour)}. ` : ' '}${PLAY_SCALE}` }));
  },
});
def({
  id: 'pent-blues', group: 'Scales', name: 'Pentatonics and blues', area: true,
  blurb: 'Major pentatonic and major blues over I, minor pentatonic and blues over vi, then the rock way: minor pentatonic over I.',
  build(k) {
    return [
      scaleStep(k, { iv: '1', q: 'maj', scale: 'maj-pent', tip: `No half steps: every note is safe. ${PLAY_SCALE}` }),
      scaleStep(k, { iv: '1', q: '7', scale: 'maj-blues', colour: 'b3', tip: 'Slide the ♭3 up into the 3: country and soul.' }),
      scaleStep(k, { iv: '6', q: 'm7', scale: 'min-pent', tip: 'The same five notes as the major pentatonic, centred on vi.', before: [['1', 'maj']] }),
      scaleStep(k, { iv: '6', q: 'm7', scale: 'blues', colour: 'b5', tip: 'Add the ♭5 blue note: pass through it, don’t sit on it.' }),
      scaleStep(k, { iv: '1', q: '7', scale: 'min-pent', colour: 'b3', tip: 'The rock and blues sound: minor pentatonic over a major or dominant chord. Bend the ♭3 towards the 3.' }),
      scaleStep(k, { iv: '1', q: '7', scale: 'blues', colour: 'b5', tip: 'The whole blues scale over the I7.' }),
    ];
  },
});

// ----- dominants -----
const DOM_COLOURS = [
  ['mixolydian', '7', null, 'Mixolydian: the plain dominant, inside the key.'],
  ['lyd-dom', '7#11', '#11', 'Lydian dominant: a ♯11 shimmer, bright tension.'],
  ['dim-hw', '7b9', 'b9', 'Half-whole diminished: ♭9, ♯9, ♯11 and a natural 13.'],
  ['whole-tone', '7#5', '#5', 'Whole tone: ♯11 and ♯5, no centre.'],
  ['phryg-dom', '7b9b13', 'b13', 'Phrygian dominant: ♭9 and ♭13, the dominant of a minor key.'],
  ['altered', '7alt', 'b13', 'Altered: every tension bent, the most tension there is.'],
];
def({
  id: 'dom-colours', group: 'Dominants', name: 'Dominant colours', area: true,
  blurb: 'ii, then V: over the V every colour a dominant can have, each resolving to I.',
  build(k) {
    return DOM_COLOURS.map(([scale, q, colour, feel]) => scaleStep(k, { iv: '5', q, scale, colour, before: [['2', 'm7']], resolve: ['1', 'maj7'], tip: `${feel} Play it over the V, then resolve to a note of I: its 3rd is a step away.` }));
  },
});
const SECONDARY = [['2', 'min'], ['3', 'min'], ['4', 'maj'], ['5', 'maj'], ['6', 'min']];
def({
  id: 'secondary', group: 'Dominants', name: 'Secondary dominants', area: true,
  blurb: 'The dominant of each chord of the key, then the chord: Mixolydian into a major target, Phrygian dominant into a minor one. Learn the one note that changes.',
  build(k) {
    const steps = [];
    for (const [to, tq] of SECONDARY) {
      const rel = { fn: 'V', to: { 2: 'ii', 3: 'iii', 4: 'IV', 5: 'V', 6: 'vi' }[to] };
      const viv = H.ivFrom(k.tonic, T.transpose(k.root(to), '5'));
      const minorT = tq === 'min';
      const s = scaleStep(k, { iv: viv, q: minorT ? '7b9b13' : '7', scale: minorT ? 'phryg-dom' : 'mixolydian', before: [['1', 'maj']], resolve: [to, tq],
        tip: `V of ${rel.to}: its 3rd is the key’s ${T.prettyIv(H.ivFrom(k.tonic, T.transpose(k.root(viv), '3')))}, a leading tone up to ${k.name(to, tq)}. ${minorT ? 'The ♭9 and ♭13 lean down into a minor chord.' : ''} Play the scale, then resolve to the target’s 3rd.` });
      s.sub = `V of ${rel.to}: ${k.name(viv, '7')} → ${k.name(to, tq)}`;
      steps.push(s);
    }
    return steps;
  },
});
// tritone subs: ♭II7 for V7, and the secondary ones
const ivUp = (k, iv, by) => H.ivFrom(k.tonic, T.transpose(k.root(iv), by));
def({
  id: 'tritone', group: 'Dominants', name: 'Tritone subs', area: true,
  blurb: 'V7 and ♭II7 share their 3rd and 7th: see both, then Lydian dominant over the sub, then the secondary subs and the backdoor.',
  build(k) {
    const p = k.pos, steps = [];
    const v = G.gripInPosition(k.root('5'), '7', p), s = G.gripInPosition(k.root('b2'), '7', p);
    const ring = (g, other) => g && { ...grip(g.notes.map((n) => ({ ...n, mark: other && other.notes.some((o) => o.midi % 12 === n.midi % 12) }))), ...areaView(p), cap: '' };
    if (v && s) steps.push({ title: `${k.name('5', '7')} and ${k.name('b2', '7')}`, sub: 'V7 and its tritone sub', tip: 'The ringed notes are shared: V’s 3rd is the sub’s 7th and V’s 7th is the sub’s 3rd. Play one grip, then the other, and hear the same tension with a new bass.', necks: [{ ...ring(v, s), cap: `V7 · ${k.name('5', '7')}` }, { ...ring(s, v), cap: `♭II7 · ${k.name('b2', '7')}` }], legend: 'chord', sound: { seq: [{ midis: midis(v), name: k.name('5', '7') }, { midis: midis(s), name: k.name('b2', '7') }], resolve: chordSound(k, [['1', 'maj7']])[0] } });
    steps.push(scaleStep(k, { iv: 'b2', q: '7#11', scale: 'lyd-dom', colour: '#11', before: [['2', 'm7']], resolve: ['1', 'maj7'], tip: `ii, ♭II7, I. Lydian dominant from ${T.noteName(k.root('b2'), true)} has the same notes as ${T.noteName(k.root('5'), true)} altered: one fingering, two names. Resolve down a half step.` }));
    // the secondary subs: the dominant a tritone from each target's V
    for (const [to, tq] of [['2', 'min'], ['3', 'min'], ['4', 'maj'], ['5', 'maj'], ['6', 'min']]) {
      const sub = ivUp(k, to, 'b2');
      const st = scaleStep(k, { iv: sub, q: '7#11', scale: 'lyd-dom', colour: '#11', before: [['1', 'maj']], resolve: [to, tq], tip: `The sub for V of ${k.rn(to, tq)}: it slides down a half step into ${k.name(to, tq)}. Lydian dominant over it.` });
      st.sub = `${k.name(sub, '7')} → ${k.name(to, tq)}`;
      steps.push(st);
    }
    const bd = scaleStep(k, { iv: 'b7', q: '7', scale: 'mixolydian', before: [['4', 'm7']], resolve: ['1', 'maj7'], tip: 'The backdoor: iv7, ♭VII7, I. Mixolydian over the ♭VII7; it reaches I from a whole step below.' });
    bd.sub = `backdoor: ${k.name('4', 'm7')} → ${k.name('b7', '7')} → ${k.name('1', 'maj7')}`;
    steps.push(bd);
    return steps;
  },
});

// ----- colour and minor -----
const BORROWED = [
  ['4', 'm7', 'dorian', 'b3', 'iv: the minor four, borrowed from the parallel minor. Dorian keeps it soft.'],
  ['b6', 'maj7', 'lydian', '#4', '♭VI: big and cinematic. Lydian fits it.'],
  ['b7', '7', 'mixolydian', null, '♭VII: the rock chord. Mixolydian over it.'],
  ['b3', 'maj7', 'lydian', '#4', '♭III: bluesy. Lydian over it.'],
  ['2', 'm7b5', 'locrian', 'b5', 'iiø: from minor, darker than ii. Locrian over it.'],
  ['5', 'm7', 'dorian', 'b3', 'v: the minor five, a Mixolydian colour.'],
];
def({
  id: 'borrowed', group: 'Colour and minor', name: 'Borrowed chords', area: true,
  blurb: 'iv, ♭VI, ♭VII, ♭III, iiø and v in a major key, each struck after I, with a scale that fits, then home.',
  build(k) {
    return BORROWED.map(([iv, q, scale, colour, tip]) => scaleStep(k, { iv, q, scale, colour, before: [['1', 'maj7']], resolve: ['1', 'maj7'], tip: `${tip} The highlighted note is the one the key doesn’t have.` }));
  },
});
// guide tones: the 3rd and 7th of each chord, each pair the nearest to the last
function guideSteps(k, chords, label) {
  const p = k.pos, steps = [];
  let prev = null;
  const lo = Math.max(0, p.lo), hi = p.hi;
  chords.forEach(([iv, q], i) => {
    const r = k.root(iv), ivs = T.getChord(q).ivs.filter((x) => /^(b?3|b?b?7|6)$/.test(x));
    const all = SC.scaleNotesIn({ rel: relOf(ivs) }, r, q, lo, hi);
    const t3 = all.filter((n) => /3/.test(n.iv)), t7 = all.filter((n) => !/3/.test(n.iv));
    let pair = null, best = Infinity;
    const mid = (F.OPEN[4] + F.OPEN[3]) / 2 + (lo + hi) / 2;
    for (const a of t3) for (const b of t7) {
      if (a.string === b.string || Math.abs(a.string - b.string) > 2) continue;
      const sc = prev ? Math.min(Math.abs(a.midi - prev[0].midi) + Math.abs(b.midi - prev[1].midi), Math.abs(a.midi - prev[1].midi) + Math.abs(b.midi - prev[0].midi)) : Math.abs((a.midi + b.midi) / 2 - mid) * 0.3 + Math.abs(a.fret - b.fret);
      if (sc < best) { best = sc; pair = [a, b]; }
    }
    const on = new Set((pair || []).map((n) => `${n.string}:${n.fret}`));
    const notes = all.map((n) => (on.has(`${n.string}:${n.fret}`) ? { ...n, mark: true } : { ...n, kind: 'sc' }));
    steps.push({ title: `${k.rn(iv, q)} · ${k.name(iv, q)}`, sub: `${label}, chord ${i + 1} of ${chords.length}: 3rd and 7th`, tip: i === 0 ? 'Play just the two ringed notes over each chord. The faint ones are the other 3rds and 7ths in the shape.' : 'One note holds or moves a half step, the other a step: the 7th falls to the next 3rd.', necks: [{ ...grip(notes), ...areaView(p) }], legend: 'guide', sound: { seq: chordSound(k, [[iv, q]]) } });
    prev = pair;
  });
  return steps;
}
def({
  id: 'guide-tones', group: 'Colour and minor', name: 'Guide tones', area: true,
  blurb: 'Just the 3rds and 7ths through ii–V–I and the minor ii–V–i, each pair the nearest to the last: the thinnest map of the changes.',
  build: (k) => [...guideSteps(k, [['2', 'm7'], ['5', '7'], ['1', 'maj7']], 'ii–V–I'), ...guideSteps(k, [['2', 'm7b5'], ['5', '7b9'], ['1', 'm6']], 'minor ii–V–i')],
});
def({
  id: 'minor-key', group: 'Colour and minor', name: 'The minor key', area: true, minor: true,
  blurb: 'The minor ii–V–i: Locrian ♮2 over iiø, Phrygian dominant over V7, melodic and harmonic minor over i.',
  build(k) {
    return [
      scaleStep(k, { iv: '2', q: 'm7b5', scale: 'locrian-n2', colour: '2', before: [['1', 'm7']], tip: 'Half-diminished with a natural 9: smoother than plain Locrian.' }),
      scaleStep(k, { iv: '5', q: '7b9b13', scale: 'phryg-dom', colour: 'b9', before: [['2', 'm7b5']], resolve: ['1', 'm6'], tip: 'The harmonic minor’s fifth mode. The ♭9 falls to the 5th of i; the 3rd rises to its root.' }),
      scaleStep(k, { iv: '1', q: 'm6', scale: 'mel-min', colour: '6', before: [['2', 'm7b5'], ['5', '7b9']], tip: 'Melodic minor over i: the natural 6 and 7 make it sophisticated.' }),
      scaleStep(k, { iv: '1', q: 'mMaj7', scale: 'harm-min', colour: '7', before: [['2', 'm7b5'], ['5', '7b9']], tip: 'Harmonic minor over i: the ♭6 and 7 a step and a half apart, the classical sound.' }),
      scaleStep(k, { iv: '1', q: 'm7', scale: 'dorian', colour: '6', before: [['4', 'm7']], tip: 'Dorian over i: the modal minor, cooler than Aeolian.' }),
    ];
  },
});
def({
  id: 'symmetric', group: 'Colour and minor', name: 'Symmetric scales', area: true,
  blurb: 'Half-whole diminished over 7♭9, whole-half over the diminished 7th, whole tone over 7♯5. Only three diminished scales and two whole-tone scales exist; the fingerings repeat.',
  build(k) {
    return [
      scaleStep(k, { iv: '5', q: '7b9', scale: 'dim-hw', colour: 'b9', before: [['2', 'm7']], resolve: ['1', 'maj7'], tip: 'Half step, whole step, round and round. The fingering repeats every three frets: find the repeat in the shape.' }),
      scaleStep(k, { iv: 'b7', q: '7b9', scale: 'dim-hw', colour: 'b9', tip: `The same notes as the last step: ${k.name('b7', '7')} is ${k.name('5', '7')} a minor 3rd up, and the diminished scale doesn’t change. Same fingering, new root.` }),
      scaleStep(k, { iv: '7', q: 'dim7', scale: 'dim-wh', colour: '2', resolve: ['1', 'maj7'], tip: `Whole step, half step: the diminished 7th’s own scale. Its notes are the ${T.noteName(k.root('5'), true)} half-whole again.` }),
      scaleStep(k, { iv: '5', q: '7#5', scale: 'whole-tone', colour: '#5', before: [['2', 'm7']], resolve: ['1', 'maj7'], tip: 'Six whole steps, no half steps: dreamlike. The fingering repeats every two frets.' }),
      scaleStep(k, { iv: 'b6', q: '7#5', scale: 'whole-tone', colour: '#5', tip: 'The other whole-tone scale: between the two, every note is covered.' }),
    ];
  },
});

export const WORKOUTS = W;
export const GROUPS = [...new Set(W.map((w) => w.group))];
export const byId = (id) => W.find((w) => w.id === id);

// the steps for one unit: a workout in a key, in an area (or across the neck)
export function steps(w, key, { shape = 'E', pair = false, qs = typesFor({ tri: true, sev: true }) } = {}) {
  const tonic = T.parseNote(key);
  const pos = w.area ? (pair ? G.positionOfPair(tonic, shape) : G.positionOf(tonic, shape)) : null;
  return w.build(keyCtx(key, pos), { qs });
}
