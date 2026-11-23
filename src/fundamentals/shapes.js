// Shapes: play it on the guitar, then Got it or Reveal. Inversions up the neck on one string set, every inversion
// inside one CAGED area, morphs on one shape, shells, extensions, arpeggios and diatonic sequences.
import * as T from '../theory.js';
import * as F from '../fretboard.js';
import { neckSVG, windowFor } from './neck.js';
import { spellRoot, spellTonic, nn, sym, iv, roman, pick, ordinal, esc, named, typeName } from './core.js';

const SETS = {
  close: [[6, 5, 4], [5, 4, 3], [4, 3, 2], [3, 2, 1]],
  spread: [[6, 4, 3], [5, 3, 2], [4, 2, 1]],
  drop2: [[6, 5, 4, 3], [5, 4, 3, 2], [4, 3, 2, 1]],
  drop3: [[6, 4, 3, 2], [5, 3, 2, 1]],
  drop24: [[6, 5, 3, 2], [5, 4, 2, 1]],
};
const VNAME = { close: 'close', spread: 'spread', drop2: 'drop 2', drop3: 'drop 3', drop24: 'drop 2 & 4' };
const SHAPES = ['C', 'A', 'G', 'E', 'D'];
const setName = (ss) => ss.join('-');
const QN = { maj: 'major', min: 'minor', dim: 'diminished', aug: 'augmented', sus2: 'sus2', sus4: 'sus4' };
const qName = (q) => QN[q] || T.pretty(T.getChord(q).sym);
const TRI_MORPH = ['maj', 'min', 'dim', 'aug'];
const SEV_MORPH = ['maj7', '7', 'm7', 'm7b5', 'dim7'];
const UPPER = { maj7: { tones: ['3', '5', '7', '9'], q: 'maj9', from: 'm7' }, '7': { tones: ['3', '5', 'b7', '9'], q: '9', from: 'm7b5' }, m7: { tones: ['b3', '5', 'b7', '9'], q: 'm9', from: 'maj7' } };
const DSCALE = { major: 'major', aeolian: 'natural minor', 'harmonic-minor': 'harmonic minor', 'melodic-minor': 'melodic minor' };
const START = { '1': 'root', '3': '3rd', '5': '5th', '7': '7th' };

export default {
  id: 'shapes',
  title: 'Shapes',
  blurb: 'Inversions up the neck and in a CAGED area, arpeggios, morphs. Play it, then Got it or Reveal.',
  tools: { metro: true, drone: true },
  keyed: true,
  options: [
    { id: 'fam', label: 'What to drill', type: 'multi', def: ['triads', 'sevenths'], choices: [['triads', 'Triads'], ['sevenths', '7th chords'], ['shells', 'Shells'], ['ext', 'Extensions'], ['arps', 'Arpeggios'], ['diatonic', 'Diatonic sequences']] },
    { id: 'task', label: 'Inversions', type: 'multi', def: ['neck', 'area'], when: (c) => c.fam.some((f) => ['triads', 'sevenths'].includes(f)), choices: [['neck', 'Up the neck (one string set)'], ['area', 'In a CAGED area (every set)'], ['morph', 'Morph one shape']] },
    { id: 'triQ', label: 'Triads', type: 'multi', def: ['maj', 'min', 'dim', 'aug'], when: (c) => c.fam.includes('triads'), choices: [['maj', 'major'], ['min', 'minor'], ['dim', 'dim'], ['aug', 'aug'], ['sus2', 'sus2'], ['sus4', 'sus4']] },
    { id: 'triV', label: 'Triad voicings', type: 'multi', def: ['close', 'spread'], when: (c) => c.fam.includes('triads'), choices: [['close', 'Close'], ['spread', 'Spread']] },
    { id: 'sevQ', label: '7th chords', type: 'multi', def: ['maj7', '7', 'm7', 'm7b5', 'dim7'], when: (c) => c.fam.some((f) => ['sevenths', 'shells'].includes(f)), choices: ['maj7', '7', 'm7', 'm7b5', 'dim7', 'mMaj7', '6', 'm6', '7sus4', 'maj7#5', '7#5', '7b5'].map((q) => [q, T.pretty(T.getChord(q).sym)]) },
    { id: 'sevV', label: '7th voicings', type: 'multi', def: ['drop2', 'drop3'], when: (c) => c.fam.includes('sevenths'), choices: [['drop2', 'Drop 2'], ['drop3', 'Drop 3'], ['drop24', 'Drop 2 & 4']] },
    { id: 'extQ', label: 'Extensions', type: 'multi', def: ['maj9', '9', 'm9', '13', '7b9', '7#9'], when: (c) => c.fam.includes('ext'), choices: ['maj9', '9', 'm9', '13', '7b9', '7#9', '7alt', 'm11', 'maj7#11'].map((q) => [q, T.pretty(T.getChord(q).sym)]) },
    { id: 'arpQ', label: 'Arpeggios', type: 'multi', def: ['maj', 'min', 'maj7', '7', 'm7', 'm7b5', 'dim7'], when: (c) => c.fam.includes('arps'), choices: ['maj', 'min', 'dim', 'aug', 'maj7', '7', 'm7', 'm7b5', 'dim7', 'mMaj7', '6', 'm6', 'maj9', '9', 'm9'].map((q) => [q, QN[q] || T.pretty(T.getChord(q).sym)]) },
    { id: 'arpT', label: 'Arpeggio tasks', type: 'multi', def: ['area', 'upper'], when: (c) => c.fam.includes('arps'), choices: [['area', 'In a CAGED area'], ['neck', 'Whole neck'], ['upper', '3-to-9 (from the 3rd)']] },
    { id: 'arpS', label: 'Start on', type: 'multi', def: ['1', '3', '5', '7'], when: (c) => c.fam.includes('arps'), choices: [['1', 'Root'], ['3', '3rd'], ['5', '5th'], ['7', '7th']] },
    { id: 'diaS', label: 'Diatonic: scales', type: 'multi', def: ['major'], when: (c) => c.fam.includes('diatonic'), choices: Object.entries(DSCALE) },
    { id: 'diaN', label: 'Diatonic: chords', type: 'multi', def: ['3', '4'], when: (c) => c.fam.includes('diatonic'), choices: [['3', 'Triads'], ['4', '7ths (drop 2)']] },
  ],

  pool(c) {
    const out = [];
    const add = (group, params, label) => out.push({ id: 'sh|' + Object.values(params).join('|'), mode: 'shapes', group, label, params });
    const inv = (fam, qs, vs) => {
      for (const v of vs) {
        if (c.task.includes('neck')) for (const q of qs) for (const ss of SETS[v]) add(fam + '-neck', { k: 'neck', q, v, ss: setName(ss) }, `${qName(q)} · ${VNAME[v]} · ${setName(ss)} · up the neck`);
        if (c.task.includes('area')) for (const q of qs) for (const sh of SHAPES) add(fam + '-area', { k: 'area', q, v, sh }, `${qName(q)} · ${VNAME[v]} · ${sh}-shape area`);
        if (c.task.includes('morph')) for (const ss of SETS[v]) add(fam + '-morph', { k: 'morph', f: fam, v, ss: setName(ss) }, `Morph · ${VNAME[v]} · ${setName(ss)}`);
      }
    };
    if (c.fam.includes('triads')) inv('tri', c.triQ, c.triV);
    if (c.fam.includes('sevenths')) inv('sev', c.sevQ, c.sevV);
    if (c.fam.includes('shells')) for (const q of c.sevQ) for (const rs of [6, 5]) add('shell', { k: 'shell', q, rs }, `${qName(q)} shells · root on the ${ordinal(rs)} string`);
    if (c.fam.includes('ext')) for (const q of c.extQ) for (const ss of [[4, 3, 2, 1], [5, 4, 3, 2]]) add('ext', { k: 'ext', q, ss: setName(ss) }, `${qName(q)} · drop 2 · ${setName(ss)} · up the neck`);
    if (c.fam.includes('arps')) {
      for (const q of c.arpQ) {
        const n = T.getChord(q).ivs.length;
        if (c.arpT.includes('area')) for (const sh of SHAPES) for (const st of c.arpS) if (st !== '7' || n >= 4) add('arp-area', { k: 'arp', q, sh, st }, `${qName(q)} arpeggio · ${sh} shape · from the ${START[st]}`);
        if (c.arpT.includes('neck')) add('arp-neck', { k: 'arpneck', q }, `${qName(q)} arpeggio · whole neck`);
        if (c.arpT.includes('upper') && UPPER[q]) for (const sh of SHAPES) add('arp-upper', { k: 'upper', q, sh }, `${qName(UPPER[q].q)} as 3-to-9 · ${sh} shape`);
      }
    }
    if (c.fam.includes('diatonic')) for (const sc of c.diaS) for (const n of c.diaN) for (const ss of (n === '3' ? SETS.close : SETS.drop2)) add('dia', { k: 'dia', sc, n, ss: setName(ss) }, `${DSCALE[sc]} diatonic ${n === '3' ? 'triads' : '7ths'} · ${setName(ss)}`);
    return out;
  },

  make(item, pc) {
    const p = item.params;
    const ss = p.ss ? p.ss.split('-').map(Number) : null;
    if (p.k === 'neck' || p.k === 'ext') {
      const v = p.v || 'drop2';
      const root = spellRoot(pc, p.q);
      const list = F.chordVoicings({ root, quality: p.q, voicing: v, stringSet: ss, inversion: 'all' }).filter((x) => x.maxFret <= 17).sort((a, b) => a.minFret - b.minFret || a.inversion - b.inversion);
      return {
        title: `All inversions of ${named(root, p.q)}`, sub: `${VNAME[v]} · strings ${p.ss} · up the neck and back, naming each bass note`,
        target: list.length * 5000, droneMidi: droneOf(pc),
        reveal: () => diagrams(list.map((x) => ({ notes: x.notes, cap: invCap(x), set: ss }))),
      };
    }
    if (p.k === 'area') {
      const root = spellRoot(pc, p.q);
      const w = F.cagedWindow(root, p.sh);
      const list = [];
      for (const s of SETS[p.v]) {
        for (const x of F.chordVoicings({ root, quality: p.q, voicing: p.v, stringSet: s, inversion: 'all' })) {
          if (x.minFret >= Math.max(0, w.lo - 1) && x.maxFret <= w.hi + 1) list.push({ ...x, set: s });
        }
      }
      return {
        title: `Every inversion of ${named(root, p.q)} in the ${p.sh}-shape area`, sub: `${VNAME[p.v]} · every string set · frets ${w.lo}–${w.hi}`,
        target: Math.max(1, list.length) * 6000, droneMidi: droneOf(pc),
        reveal: () => `<p class="note">${list.length} voicings, by string set.</p>` + diagrams(list.map((x) => ({ notes: x.notes, cap: `${setName(x.set)} · ${invCap(x)}`, set: x.set }))),
      };
    }
    if (p.k === 'morph') {
      const qs = p.f === 'tri' ? TRI_MORPH : SEV_MORPH;
      const root = spellRoot(pc, 'maj');
      const n = qs === TRI_MORPH ? 3 : 4;
      const invIdx = Math.floor(Math.random() * n);
      const t = 2 + Math.random() * 7;
      const shapes = qs.map((q) => {
        const pl = F.chordVoicings({ root, quality: q, voicing: p.v, stringSet: ss, inversion: invIdx });
        const best = pl.sort((a, b) => Math.abs(avg(a) - t) - Math.abs(avg(b) - t))[0];
        return { q, best };
      }).filter((x) => x.best);
      const bassName = ['root', '3rd', '5th', '7th'][invIdx];
      return {
        title: `Morph: ${qs.map((q) => sym(root, q)).join(' → ')}`, sub: `${VNAME[p.v]} · strings ${p.ss} · ${invIdx ? ordinal(invIdx) + ' inversion' : 'root position'} (${bassName} in the bass) · one note moves at a time`,
        target: qs.length * 4000, droneMidi: droneOf(pc),
        reveal: () => diagrams(shapes.map((x) => ({ notes: x.best.notes, cap: sym(root, x.q), q: x.q, set: ss }))),
      };
    }
    if (p.k === 'shell') {
      const root = spellRoot(pc, p.q);
      const sets = p.rs === 6 || p.rs === '6' ? [[6, 4, 3], [6, 5, 4]] : [[5, 3, 2], [5, 4, 3]];
      const list = sets.map((s) => F.chordVoicings({ root, quality: p.q, voicing: 'shell', stringSet: s }).filter((x) => x.notes[0].iv === '1' || x.label.startsWith('1')).sort((a, b) => a.minFret - b.minFret)[0]).filter(Boolean);
      return {
        title: `Shell voicings of ${named(root, p.q)}`, sub: `Root on the ${ordinal(Number(p.rs))} string · both shapes (1-7-3 and 1-3-7)`,
        target: 8000, droneMidi: droneOf(pc),
        reveal: () => diagrams(list.map((x) => ({ notes: x.notes, cap: x.label.replace(/b/g, '♭'), set: x.stringSet }))),
      };
    }
    if (p.k === 'arp' || p.k === 'upper') {
      const up = p.k === 'upper' ? UPPER[p.q] : null;
      const root = spellRoot(pc, p.q);
      const w = F.cagedWindow(root, p.sh);
      const notes = F.regionNotes(up ? { root, tones: up.tones, region: { caged: p.sh } } : { root, quality: p.q, region: { caged: p.sh } });
      const startIv = up ? up.tones[0] : chordTone(p.q, p.st);
      const ordered = fromStart(notes, startIv);
      const title = up ? `${named(root, up.q)} as a 3-to-9 arpeggio` : `${named(root, p.q)} arpeggio`;
      const sub = up ? `${p.sh}-shape area (frets ${w.lo}–${w.hi}) · from its ${iv(up.tones[0])} up to its 9th, through the area and back` : `${p.sh}-shape area (frets ${w.lo}–${w.hi}) · start on the lowest ${START[p.st]}, up to the top and back`;
      return {
        title, sub, target: notes.length * 900, droneMidi: droneOf(pc),
        reveal: () => (up ? `<p class="note">The 3rd to the 9th of ${esc(sym(root, up.q))} is ${esc(sym(T.transpose(root, up.tones[0]), up.from))}.</p>` : '') + area(notes, w, startIv, ordered),
      };
    }
    if (p.k === 'arpneck') {
      const root = spellRoot(pc, p.q);
      const notes = F.regionNotes({ root, quality: p.q, region: { frets: [0, 15] } });
      return {
        title: `${named(root, p.q)} arpeggio, whole neck`, sub: 'Through all five areas, low to high and back, saying the degrees',
        target: 40000, droneMidi: droneOf(pc),
        reveal: () => `<div class="neckwrap">${neckSVG({ lo: 0, hi: 15, size: 'l', dots: notes.map((n) => ({ s: n.string, f: n.fret, iv: n.iv, label: iv(n.iv) })) })}</div>`,
      };
    }
    if (p.k === 'dia') {
      const tonic = spellTonic(pc, p.sc === 'major' ? 'major' : p.sc);
      const size = Number(p.n);
      const v = size === 3 ? 'close' : 'drop2';
      const degs = [];
      for (let i = 0; i <= 7; i++) {
        const c = T.diatonicChord(tonic, p.sc, i % 7, size);
        if (!c.quality) continue;
        const semis = (T.notePc(c.root) - T.notePc(tonic) + 12) % 12;
        degs.push({ root: c.root, q: c.quality, rn: roman(i % 7, semis, c.quality) });
      }
      const got = climbAny(degs, v, ss, size);
      if (!got) throw new Error('no climb fits');
      const invIdx = got.inv;
      const chords = got.list.map((pl, i) => ({ notes: pl.notes, cap: `${degs[i].rn} ${sym(degs[i].root, degs[i].q)}`, q: degs[i].q, set: ss }));
      return {
        title: `${nn(tonic)} ${DSCALE[p.sc]}: diatonic ${size === 3 ? 'triads' : '7ths'}`,
        sub: `${VNAME[v]} · strings ${p.ss} · stay in ${invIdx ? ordinal(invIdx) + ' inversion' : 'root position'} and climb the key, I to I${got.wrap ? WRAP_NOTE : ''}`,
        target: 8 * 4000, droneMidi: droneOf(pc),
        reveal: () => diagrams(chords),
      };
    }
    throw new Error('Unknown shape task ' + p.k);
  },

  mount(q, el, ctx) { ctx.selfRate(q); },
};

const avg = (p) => p.notes.reduce((s, n) => s + n.fret, 0) / p.notes.length;
// a run of chords climbing one string set, every one higher than the last, in one inversion (chords may carry their
// own). Tries each starting position of the first chord; null when the run can't climb without running out of neck.
export function climb(chords, voicing, ss, inv) {
  const pls = chords.map((c) => { try { return F.chordVoicings({ root: c.root, quality: c.q, voicing, stringSet: ss, inversion: c.inv ?? inv }).sort((a, b) => avg(a) - avg(b)); } catch (e) { return []; } });
  if (pls.some((x) => !x.length)) return null;
  for (const start of pls[0]) {
    const out = [start];
    for (let i = 1; i < pls.length; i++) { const nx = pls[i].find((x) => avg(x) > avg(out[i - 1]) + 0.4); if (!nx) break; out.push(nx); }
    if (out.length === pls.length) return out;
  }
  return null;
}
// the inversion asked for if its climb fits on the neck, else the first one that does
export function climbAny(chords, voicing, ss, n) {
  const first = Math.floor(Math.random() * n);
  for (let k = 0; k < n; k++) { const inv = (first + k) % n; const r = climb(chords, voicing, ss, inv); if (r) return { inv, list: r }; }
  // no inversion fits a whole octave below the 17th fret: climb from the lowest I and drop an octave when the neck
  // runs out
  const pls = chords.map((c) => { try { return F.chordVoicings({ root: c.root, quality: c.q, voicing, stringSet: ss, inversion: c.inv ?? first }).sort((a, b) => avg(a) - avg(b)); } catch (e) { return []; } });
  if (pls.some((x) => !x.length)) return null;
  const list = [pls[0][0]];
  for (let i = 1; i < pls.length; i++) list.push(pls[i].find((x) => avg(x) > avg(list[i - 1]) + 0.4) || pls[i][0]);
  return { inv: first, list, wrap: true };
}
export const WRAP_NOTE = ' (drop an octave when the neck runs out)';
const droneOf = (pc) => 40 + ((pc - 4 + 12) % 12);
function invCap(x) {
  const names = ['Root pos', '1st inv', '2nd inv', '3rd inv'];
  const hasRoot = x.notes.some((n) => n.iv === '1');
  return hasRoot ? `${names[x.inversion] || ''}` : `${iv(x.bassIv)} in bass`;
}
function chordTone(q, st) {
  const ivs = T.getChord(q).ivs;
  const want = { '1': ['1'], '3': ['3', 'b3', '4', '2'], '5': ['5', 'b5', '#5'], '7': ['7', 'b7', 'bb7', '6'] }[st];
  return ivs.find((x) => want.includes(x)) || '1';
}
// the notes from the lowest start tone up, then back down
function fromStart(notes, startIv) {
  const asc = [...notes].sort((a, b) => a.midi - b.midi);
  const i = asc.findIndex((n) => F.simpleIv(n.iv) === F.simpleIv(startIv));
  const up = i >= 0 ? asc.slice(i) : asc;
  return up.concat(up.slice(0, -1).reverse());
}
export function diagrams(list) {
  return `<div class="diagrams">${list.map((d) => {
    const w = windowFor(d.notes, 4);
    const bass = Math.max(...d.notes.map((n) => n.string));
    const svg = neckSVG({ lo: w.lo, hi: w.hi, size: 's', strings: d.set, dots: d.notes.map((n) => ({ s: n.string, f: n.fret, iv: n.iv, label: iv(n.iv), ring: n.string === bass })) });
    const midis = [...d.notes].sort((a, b) => a.midi - b.midi).map((n) => n.midi).join(',');
    return `<button class="dg" data-strum="${midis}">${svg}<span>${esc(d.cap)}</span>${d.q && typeName(d.q) ? `<span class="tn">${typeName(d.q)}</span>` : ''}</button>`;
  }).join('')}</div>`;
}
function area(notes, w, startIv, ordered) {
  const dots = notes.map((n) => ({ s: n.string, f: n.fret, iv: n.iv, label: iv(n.iv), ring: F.simpleIv(n.iv) === F.simpleIv(startIv) }));
  const lo = w.lo <= 1 ? 0 : w.lo - 1;
  return `<div class="neckwrap">${neckSVG({ lo, hi: Math.max(w.hi + 1, lo + 5), size: 'm', dots })}</div>
    <div class="row"><button class="ghost" data-arp="${ordered.map((n) => n.midi).join(',')}">▶ Hear it</button></div>`;
}
