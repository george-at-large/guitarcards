// Chord Scales: a scale's own chords, or the scale in 3rds, 4ths, 6ths, triads and 7th arpeggios, to have under the
// fingers. Major, melodic minor, harmonic minor, harmonic major, natural minor and Barry Harris's 6th-diminished.
// On a string set the chords climb in one inversion; in a CAGED area they're voice-led and stay put.
import * as T from '../theory.js';
import * as F from '../fretboard.js';
import * as G from '../caged/grips.js';
import { SCALES as CS, voiceInArea } from '../caged/cscale.js';
import { neckSVG } from './neck.js';
import { diagrams, climb, climbAny, WRAP_NOTE } from './shapes.js';
import { spellTonic, nn, sym, iv, roman, ordinal, esc } from './core.js';

const SC = {
  maj: { id: 'major', name: 'major', cs: 'maj' },
  mel: { id: 'melodic-minor', name: 'melodic minor', cs: 'mel' },
  harm: { id: 'harmonic-minor', name: 'harmonic minor', cs: 'harm' },
  hmaj: { id: 'harmonic-major', name: 'harmonic major' },
  nat: { id: 'aeolian', name: 'natural minor', cs: 'nat' },
  bh: { id: 'bebop-major', name: '6th-diminished (Barry Harris)' },
};
const SETS = { d2: [[4, 3, 2, 1], [5, 4, 3, 2], [6, 5, 4, 3]], d3: [[6, 4, 3, 2], [5, 3, 2, 1]], tri: [[3, 2, 1], [4, 3, 2], [5, 4, 3], [6, 5, 4]] };
const VN = { d2: 'drop 2', d3: 'drop 3', tri: 'close triads' };
const SHAPES = ['C', 'A', 'G', 'E', 'D'];
const SIZE = { tri: 'triads', sev: '7ths', ext: 'with extensions' };
const SEQ = { '3': ['3rds', { kind: 'intervals', step: 3 }], '4': ['4ths', { kind: 'intervals', step: 4 }], '6': ['6ths', { kind: 'intervals', step: 6 }], tri: ['triads', { kind: 'triads' }], sev: ['7th arpeggios', { kind: 'sevenths' }], g4: ['groups of 4', { kind: 'groups', size: 4 }] };
const setName = (s) => s.join('-');

export default {
  id: 'chordscales',
  title: 'Chord Scales',
  blurb: 'A scale’s own chords on a string set or in a CAGED area, or the scale in 3rds, 6ths, triads and 7ths. Melodic minor and the rest.',
  tools: { metro: true, drone: true },
  keyed: true,
  options: [
    { id: 'scales', label: 'Scales', type: 'multi', def: ['maj', 'mel', 'harm'], choices: Object.entries(SC).map(([k, v]) => [k, v.name[0].toUpperCase() + v.name.slice(1)]) },
    { id: 'tasks', label: 'Play', type: 'multi', def: ['set', 'area', 'seq'], choices: [['set', 'Chords up a string set'], ['area', 'Chords in a CAGED area'], ['seq', 'The scale in intervals']] },
    { id: 'size', label: 'Chords', type: 'multi', def: ['sev'], when: (c) => c.tasks.some((t) => t !== 'seq'), choices: Object.entries(SIZE) },
    { id: 'voice', label: 'String sets', type: 'multi', def: ['d2', 'd3'], when: (c) => c.tasks.includes('set'), choices: [['d2', 'Drop 2'], ['d3', 'Drop 3']] },
    { id: 'seqs', label: 'Intervals', type: 'multi', def: ['3', '6', 'tri', 'sev'], when: (c) => c.tasks.includes('seq'), choices: Object.entries(SEQ).map(([k, v]) => [k, v[0]]) },
  ],
  pool(c) {
    const out = [];
    const add = (group, params, label) => out.push({ id: 'cs|' + Object.values(params).join('|'), mode: 'chordscales', group, label, params });
    for (const s of c.scales) {
      const nm = SC[s].name;
      if (c.tasks.includes('set')) for (const z of c.size) {
        // extensions reduce to different four-note shapes chord to chord, so they're voice-led in an area instead
        if (z === 'ext' || (s === 'bh' && z !== 'sev')) continue;
        for (const v of (z === 'tri' ? ['tri'] : c.voice)) for (const ss of SETS[v]) add('set', { k: 'set', s, z, v, ss: setName(ss) }, `${nm} ${SIZE[z]} · ${VN[v]} · ${setName(ss)}`);
      }
      if (c.tasks.includes('area')) for (const z of c.size) { if ((z === 'ext' && !SC[s].cs) || (s === 'bh' && z !== 'sev')) continue; for (const sh of SHAPES) add('area', { k: 'area', s, z, sh }, `${nm} ${SIZE[z]} · ${sh}-shape area`); }
      if (c.tasks.includes('seq')) for (const q of c.seqs) for (const sh of SHAPES) add('seq', { k: 'seq', s, q, sh }, `${nm} in ${SEQ[q][0]} · ${sh}-shape area`);
    }
    return out;
  },
  make(it, pc) {
    const p = it.params;
    const sc = SC[p.s];
    const tonic = spellTonic(pc, sc.id);
    const key = `${nn(tonic)} ${sc.name}`;
    const droneMidi = 40 + ((pc - 4 + 12) % 12);
    if (p.k === 'seq') {
      const notes = F.regionNotes({ root: tonic, scale: sc.id, region: { caged: p.sh } });
      const w = F.cagedWindow(tonic, p.sh);
      const seq = F.applySequence(notes, { ...SEQ[p.q][1], direction: 'up-and-down' });
      const lo = w.lo <= 1 ? 0 : w.lo - 1;
      return {
        kicker: 'The scale in intervals', title: `${esc(key)} in ${SEQ[p.q][0]}`, sub: `${p.sh}-shape area (frets ${w.lo}–${w.hi}) · from the lowest note up to the top and back down`,
        target: seq.length * 400, droneMidi,
        reveal: () => `<div class="neckwrap">${neckSVG({ lo, hi: Math.max(w.hi + 1, lo + 5), size: 'm', dots: notes.map((n) => ({ s: n.string, f: n.fret, iv: n.iv, label: iv(n.iv) })) })}</div>
          <div class="row"><button class="ghost" data-arp="${seq.map((n) => n.midi).join(',')}">▶ Hear the pattern</button></div>`,
      };
    }
    const chords = chordList(tonic, p.s, p.z);
    if (p.k === 'set') {
      const ss = p.ss.split('-').map(Number);
      const v = p.v === 'tri' ? 'close' : p.v === 'd2' ? 'drop2' : 'drop3';
      // an inversion whose whole I-to-I climb fits on the neck; Barry Harris's cycle can start on any 6th-chord inversion
      let got = null;
      if (p.s === 'bh') {
        for (const k of [0, 1, 2, 3]) { const rot = chordList(tonic, 'bh', p.z, k); const r = climb(rot, v, ss, 0); if (r) { got = { inv: k, list: r }; chords.splice(0, chords.length, ...rot); break; } }
        if (!got) got = climbAny(chords, v, ss, 1);
      } else got = climbAny(chords, v, ss, ss.length);
      if (!got) throw new Error('no climb fits');
      const inv = got.inv;
      const list = got.list.map((pl, i) => ({ notes: pl.notes, cap: `${chords[i].rn} ${sym(chords[i].root, chords[i].q)}`, q: chords[i].q, set: ss }));
      const invName = p.s === 'bh' ? `the 6th chord’s inversions from ${['the root', 'the 3rd', 'the 5th', 'the 6th'][inv]} in the bass, each with its °7 between` : inv ? `${ordinal(inv)} inversion` : 'root position';
      return {
        kicker: 'Chord scale', title: `${esc(key)}: ${SIZE[p.z]}`, sub: `${VN[p.v]} · strings ${p.ss} · stay in ${invName} and climb, I to I${got.wrap ? WRAP_NOTE : ''}`,
        target: list.length * 3500, droneMidi, reveal: () => why(chords, p) + diagrams(list),
      };
    }
    // in an area: voice-led, staying in position
    const pos = G.positionOf(tonic, p.sh);
    let prev = null;
    const list = [];
    for (const c of chords) {
      let g = null;
      try { g = voiceInArea(c.root, c.q, pos, prev, 'caged', 'caged', p.z === 'tri'); } catch (e) { g = null; }
      if (!g) continue;
      prev = g;
      list.push({ notes: g.notes, cap: `${c.rn} ${sym(c.root, c.q)}`, q: c.q, set: g.notes.map((n) => n.string) });
    }
    return {
      kicker: 'Chord scale', title: `${esc(key)}: ${SIZE[p.z]}`, sub: `${p.sh}-shape area (frets ${pos.lo}–${pos.hi}) · stay in position, I to I and back, each chord close to the last`,
      target: list.length * 3500, droneMidi, reveal: () => why(chords, p) + diagrams(list),
    };
  },
  mount(q, el, ctx) { ctx.selfRate(q); },
};

const avg = (p) => p.notes.reduce((s, n) => s + n.fret, 0) / p.notes.length;
// the scale's chords I to I. Barry Harris: the 6th chord and the diminished 7th a half step below it, alternating
// up through the 6th chord's inversions (C6, D°7, C6/E, F°7… as drop 2 it's C6 and B°7 turn about)
function chordList(tonic, s, z, start = 0) {
  if (s === 'bh') {
    const lt = T.transpose(tonic, '7');
    // each °7 has its bass a step above the 6th chord's bass (D, F, A♭, B in C)
    const out = [];
    for (let k = 0; k < 4; k++) { const i = (start + k) % 4; out.push({ root: tonic, q: '6', rn: 'I6', inv: i }); out.push({ root: lt, q: 'dim7', rn: 'vii°7', inv: (i + 1) % 4 }); }
    out.push({ root: tonic, q: '6', rn: 'I6', inv: start });
    return out;
  }
  const sc = SC[s];
  const csd = sc.cs ? CS.find((x) => x.id === sc.cs) : null;
  const out = [];
  for (let i = 0; i <= 7; i++) {
    const d = i % 7;
    const base = T.diatonicChord(tonic, sc.id, d, z === 'tri' ? 3 : 4);
    let q = base.quality;
    if (z === 'ext' && csd) q = csd.ext[d];
    const semis = (T.notePc(base.root) - T.notePc(tonic) + 12) % 12;
    out.push({ root: base.root, q, rn: roman(d, semis, base.quality), mode: csd ? csd.modes[d] : null, why: z === 'ext' && csd ? csd.why[d] : null });
  }
  return out;
}
function why(chords, p) {
  if (p.z !== 'ext') return '';
  return `<div class="info"><div class="k">Why these extensions</div>${chords.slice(0, 7).map((c) => `<p><b>${esc(c.rn)} ${esc(sym(c.root, c.q))}</b>: ${esc(c.why || '')}</p>`).join('')}</div>`;
}
