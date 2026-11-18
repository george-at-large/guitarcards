// Chord study: one chord, every inversion, all over the neck. Silent: a picture to study. Pick a key and a chord type
// (either may be random, with Skip for a new one), and a mode or none (the mode decides the extensions shown). Then
// step through its voicings: on one string set up the neck, one inversion across every string set, inside each CAGED
// shape, or all of them low to high. Study runs the first three in order. Ghosts can show every chord tone in the area
// and the extensions around it.
import * as T from '../theory.js';
import * as F from '../fretboard.js';
import * as SC from '../caged/scales.js';
import * as Gr from '../caged/grips.js';
import { neckSVG } from './neck.js';
import { KIND } from './harm.js';
import { degText } from './words.js';
import { SETS, INV_NAMES, onSet, chordVoicings, invName, nearby, parentOf, modeName, BY } from './ladder.js';

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const fmt = (s) => esc(T.pretty(String(s ?? '')));
const cap = (s) => (s ? s[0].toUpperCase() + s.slice(1) : s);
const KEYS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
const OPEN = [40, 45, 50, 55, 59, 64];
const openOf = (s) => OPEN[6 - s];
const semi = (iv) => T.intervalSemis(F.simpleIv(String(iv))) % 12;
const SHAPES = ['C', 'A', 'G', 'E', 'D'];
const SET_NAME = Object.fromEntries([...SETS[3], ...SETS[4]]);

// three- and four-note chords (one note per string on the voicing groups)
export const TYPES = [
  ['Triads', [['maj', 'Major'], ['min', 'Minor'], ['dim', 'Diminished'], ['aug', 'Augmented'], ['sus2', 'Sus 2'], ['sus4', 'Sus 4']]],
  ['7th chords', [['maj7', 'Major 7'], ['7', 'Dominant 7'], ['m7', 'Minor 7'], ['m7b5', 'Half-diminished'], ['dim7', 'Diminished 7'], ['mMaj7', 'Minor-major 7'], ['7sus4', '7sus4'], ['maj7#5', 'Major 7♯5'], ['7#5', '7♯5'], ['7b5', '7♭5']]],
  ['6ths and add 9', [['6', 'Major 6'], ['m6', 'Minor 6'], ['add9', 'Add 9'], ['madd9', 'Minor add 9']]],
];
const ALL_Q = TYPES.flatMap(([, l]) => l.map(([q]) => q));
const qName = (q) => TYPES.flatMap(([, l]) => l).find(([x]) => x === q)?.[1] || q;
// the modes on the chord's root that hold every note of it, most familiar first
const MODES = SC.SCALES.filter((s) => ['mode', 'mm', 'hm', 'hmaj', 'sym'].includes(s.fam) && s.ivs.length >= 7);
export function modesFor(q) {
  const need = T.getChord(q).ivs.map(semi);
  return MODES.filter((s) => { const have = new Set(s.ivs.map(semi)); return need.every((x) => have.has(x)); }).map((s) => s.id);
}
const VIEWS = [
  ['study', 'Study: all three exercises in turn'],
  ['sets', 'Inversions on a string set'],
  ['across', 'One inversion across the strings'],
  ['shape', 'Inversions in a CAGED shape'],
  ['neck', 'Every voicing, low to high'],
];
const EX_NAME = { sets: 'Inversions on a string set, up the neck', across: 'One inversion across every string set', shape: 'Every inversion inside a CAGED shape', neck: 'Every voicing on the neck' };

export const DEF_ST = { key: 'C', q: 'm7', mode: 'none', view: 'study', set: 'each', inv: -1, shape: 'each', pick: 'best', tones: true, ext: false, auto: false, secs: 6 };

export function study(app, { S, save, back }) {
  const O = S.st;
  const R = { key: null, q: null, mode: null, steps: [], i: 0, timer: null };
  const rand = (a) => a[Math.floor(Math.random() * a.length)];

  // ----- what's being studied -----
  function resolve(fresh = false) {
    if (fresh || !R.key || O.key !== 'random') R.key = O.key === 'random' ? (fresh || !R.key ? rand(KEYS) : R.key) : O.key;
    if (fresh || !R.q || O.q !== 'random') R.q = O.q === 'random' ? (fresh || !R.q ? rand(ALL_Q) : R.q) : O.q;
    const fits = modesFor(R.q);
    if (O.mode === 'random') R.mode = fresh || !R.mode || !fits.includes(R.mode) ? rand(fits) || null : R.mode;
    else R.mode = O.mode !== 'none' && fits.includes(O.mode) ? O.mode : null;
    build();
  }
  function build() {
    const root = T.parseNote(R.key), rootPc = T.notePc(root), tones = T.getChord(R.q).ivs, size = tones.length >= 4 ? 4 : 3;
    const sets = SETS[size].map(([id]) => id);
    const win = (s) => { const p = Gr.positionOf(root, s); return { lo: p.lo, hi: p.hi, shape: s }; };
    const steps = [];
    const add = (ex, group, vs, extra = {}) => vs.forEach((v, k) => steps.push({ ex, group, v, k, n: vs.length, ...extra }));
    const exSets = () => { for (const set of O.view === 'sets' && O.set !== 'each' && sets.includes(O.set) ? [O.set] : sets) add('sets', SET_NAME[set], chordVoicings(rootPc, tones, { set, pick: 'all' }).filter((v) => v.span <= 4)); };
    const exAcross = () => {
      const invs = O.view === 'across' && O.inv >= 0 && O.inv < size ? [O.inv] : [...Array(size).keys()];
      for (const inv of invs) {
        let at = 5;
        const vs = [];
        for (const set of sets) {
          const opts = onSet(rootPc, tones, set).filter((v) => v.notes[0].iv === tones[inv] && v.span <= 3);
          if (!opts.length) continue;
          const v = opts.reduce((a, b) => (Math.abs(a.at - at) <= Math.abs(b.at - at) ? a : b));
          at = v.at; vs.push(v);
        }
        add('across', cap(INV_NAMES[inv] || `inversion ${inv}`), vs);
      }
    };
    const exShape = () => {
      for (const s of O.view === 'shape' && O.shape !== 'each' ? [O.shape] : SHAPES) {
        const w = win(s);
        add('shape', `The ${s} shape, frets ${w.lo}–${w.hi}`, chordVoicings(rootPc, tones, { win: w, pick: O.pick }).sort((a, b) => a.notes[0].midi - b.notes[0].midi), { win: w });
      }
    };
    if (O.view === 'study') { exSets(); exAcross(); exShape(); }
    else if (O.view === 'sets') exSets();
    else if (O.view === 'across') exAcross();
    else if (O.view === 'shape') exShape();
    else add('neck', 'The whole neck', chordVoicings(rootPc, tones, { pick: O.pick }));
    R.steps = steps; R.i = 0; R.root = root; R.rootPc = rootPc; R.tones = tones;
  }

  // ----- drawing -----
  function ghosts(st) {
    const out = [], w = st?.win || { lo: 0, hi: 15 };
    const have = new Map(R.tones.map((iv) => [semi(iv), iv]));
    const near = O.ext ? nearby(R.rootPc, R.tones, R.mode, R.rootPc) : new Map();
    for (let s = 6; s >= 1; s--) for (let f = Math.max(0, w.lo - (st?.win ? 1 : 0)); f <= Math.min(15, w.hi + (st?.win ? 1 : 0)); f++) {
      const x = ((openOf(s) + f - R.rootPc) % 12 + 12) % 12;
      if (O.tones && have.has(x)) out.push({ string: s, fret: f, label: degText(have.get(x)), kind: KIND(have.get(x)), ghost: true });
      else if (near.has(x)) { const e = near.get(x); out.push({ string: s, fret: f, label: degText(e.iv), kind: e.avoid ? 'q' : 'tx', ghost: !e.avoid, avoid: e.avoid }); }
    }
    return out;
  }
  function stepHTML() {
    const st = R.steps[R.i];
    const name = `${T.noteName(R.root, true)}${T.getChord(R.q).sym}`;
    const p = R.mode ? parentOf(R.mode, R.rootPc) : null;
    const modeLine = R.mode ? `<div class="lm">${esc(modeName(R.mode))}</div><div class="lp">${esc(p?.text || BY[R.mode]?.alias || '')}</div>` : '<div class="lp">No mode: just the chord</div>';
    if (!st) return { neck: neckSVG(ghosts(null)), info: `<div class="lmode">${modeLine}</div><div class="chord"><div class="sym">${fmt(name)}</div><div class="say">No voicings here: try another view.</div></div>` };
    const exs = O.view === 'study' ? ['sets', 'across', 'shape'] : [st.ex];
    const exNo = exs.indexOf(st.ex) + 1;
    const at = new Set(st.v.notes.map((n) => `${n.string}:${n.fret}`));
    const prev = R.steps[R.i - 1]?.v;
    const notes = st.v.notes.map((n) => ({ ...n, label: degText(n.iv), kind: KIND(n.iv), fresh: prev ? !prev.notes.some((x) => x.string === n.string && x.fret === n.fret) : false }));
    const neck = neckSVG([...ghosts(st).filter((g) => !at.has(`${g.string}:${g.fret}`)), ...notes], { band: st.win ? [st.win.lo, st.win.hi] : null });
    const near = O.ext ? [...nearby(R.rootPc, R.tones, R.mode, R.rootPc).values()] : [];
    const ok = near.filter((x) => !x.avoid).map((x) => degText(x.iv)), bad = near.filter((x) => x.avoid).map((x) => degText(x.iv));
    const list = [...st.v.notes].sort((a, b) => b.midi - a.midi).map((n) => `<li class="k-${KIND(n.iv)}"><i></i><b>${degText(n.iv)}</b><span>${fmt(T.noteName(T.transpose(R.root, F.simpleIv(n.iv)), true))} · string ${n.string}, fret ${n.fret}</span></li>`).join('');
    const info = `<div class="lmode">${modeLine}</div>
      <div class="lpart">${exs.length > 1 ? `Exercise ${exNo} of 3 · ` : ''}${esc(EX_NAME[st.ex])}</div>
      <div class="chord"><div class="sym">${fmt(name)}</div><div class="say">${esc(cap(invName(st.v.notes[0].iv, R.tones)))}</div></div>
      <div class="stpos"><b>${esc(st.group)}</b> · ${st.k + 1} of ${st.n}${st.ex !== 'sets' && SET_NAME[st.v.set] ? ` · ${esc(SET_NAME[st.v.set].replace('Strings ', 'strings '))}` : ''}</div>
      ${O.ext && (ok.length || bad.length) ? `<div class="aware">${ok.length ? `<span>Extensions: <b>${ok.join(' · ')}</b></span>` : ''}${bad.length ? `<span class="bad">Careful: <b>${bad.join(' · ')}</b></span>` : ''}</div>` : ''}
      <div class="stack"><ol>${list}</ol></div>
      <div class="stprog">${R.i + 1} / ${R.steps.length}</div>`;
    return { neck, info };
  }
  function drawStep() {
    const { neck, info } = stepHTML();
    const n = app.querySelector('#stneck'), i = app.querySelector('#stinfo');
    if (n) n.innerHTML = neck; if (i) i.innerHTML = info;
  }
  function sel(k, opts, cur) { return `<select data-st="${k}" class="sel">${opts}</select>`; }
  const opt = (v, l, cur) => `<option value="${esc(v)}" ${String(cur) === String(v) ? 'selected' : ''}>${esc(l)}</option>`;
  function draw() {
    const fits = O.q === 'random' ? [] : modesFor(O.q);
    if (O.mode !== 'none' && O.mode !== 'random' && !fits.includes(O.mode)) O.mode = 'none';
    const size = T.getChord(R.q).ivs.length >= 4 ? 4 : 3;
    const sub = O.view === 'sets' ? sel('set', opt('each', 'Each set in turn', O.set) + SETS[size].map(([id, l]) => opt(id, l, O.set)).join(''))
      : O.view === 'across' ? sel('inv', opt(-1, 'Each inversion in turn', O.inv) + INV_NAMES.slice(0, size).map((l, i) => opt(i, cap(l), O.inv)).join(''))
        : O.view === 'shape' ? sel('shape', opt('each', 'Each shape in turn', O.shape) + SHAPES.map((s) => opt(s, `${s} shape`, O.shape)).join('')) : '';
    const random = O.key === 'random' || O.q === 'random' || O.mode === 'random';
    app.innerHTML = `
    <header class="bar"><button class="icon" data-s="back" aria-label="Back">‹</button><h2>Chord study</h2>${random ? '<button class="icon stskip" data-s="skip" aria-label="Skip to a new chord">⤼</button>' : '<span></span>'}</header>
    <section class="stpick">
      ${sel('key', opt('random', 'Random key', O.key) + KEYS.map((k) => `<option value="${k}" ${O.key === k ? 'selected' : ''}>${fmt(k)}</option>`).join(''))}
      ${sel('q', opt('random', 'Random chord', O.q) + TYPES.map(([g, l]) => `<optgroup label="${esc(g)}">${l.map(([q, n]) => opt(q, n, O.q)).join('')}</optgroup>`).join(''))}
      ${sel('mode', opt('none', 'No mode', O.mode) + opt('random', 'A mode that fits, at random', O.mode) + fits.map((m) => opt(m, modeName(m), O.mode)).join(''))}
      ${sel('view', VIEWS.map(([v, l]) => opt(v, l, O.view)).join(''))}
      ${sub}
    </section>
    <div class="transport ltrans sttrans">
      <button data-s="prev" aria-label="Previous voicing"><b>‹</b><small>back</small></button>
      <button data-s="tones" class="${O.tones ? 'on' : ''}"><b>◌</b><small>chord tones</small></button>
      <button data-s="ext" class="${O.ext ? 'on' : ''}"><b>✧</b><small>extensions</small></button>
      <button data-s="auto" class="${O.auto ? 'on' : ''}"><b>↻</b><small>${O.auto ? `${O.secs} s` : 'by hand'}</small></button>
      <button data-s="next" aria-label="Next voicing"><b>›</b><small>next</small></button>
    </div>
    <main class="stage">
      <div class="neckcol" id="stneck"></div>
      <div class="info" id="stinfo"></div>
    </main>
    ${O.view === 'shape' || O.view === 'neck' || O.view === 'study' ? `<div class="stfoot">${['shape', 'neck', 'study'].includes(O.view) ? `<div class="seg">${[['best', 'Best voicings'], ['all', 'All']].map(([v, l]) => `<button data-s="pick" data-v="${v}" class="${O.pick === v ? 'on' : ''}">${l}</button>`).join('')}</div>` : ''}</div>` : ''}
    <p class="foot">Silent: a picture to study. Play each voicing and say its notes; the faint notes are the chord’s other places${O.ext ? ', the violet ones the extensions the mode allows, the red rings the clashes' : ''}.</p>`;
    drawStep();
  }
  function go(d) {
    if (!R.steps.length) return;
    let i = R.i + d;
    if (i >= R.steps.length) { if (O.key === 'random' || O.q === 'random') { resolve(true); draw(); return; } i = 0; }
    if (i < 0) i = R.steps.length - 1;
    R.i = i; drawStep();
  }
  function setAuto() { clearInterval(R.timer); if (O.auto) R.timer = setInterval(() => { if (!document.body.contains(app.querySelector('#stneck'))) return clearInterval(R.timer); go(1); }, O.secs * 1000); }

  app.onclick = (e) => {
    const b = e.target.closest('button'); if (!b) return;
    const a = b.dataset.s; if (!a) return;
    if (a === 'back') { clearInterval(R.timer); app.onclick = null; app.onchange = null; back(); return; }
    if (a === 'next') { go(1); setAuto(); return; }
    if (a === 'prev') { go(-1); setAuto(); return; }
    if (a === 'skip') { resolve(true); draw(); return; }
    if (a === 'tones' || a === 'ext') { O[a] = !O[a]; save(); b.classList.toggle('on', O[a]); drawStep(); return; }
    if (a === 'auto') {
      // off → 6 s → 10 s → 3 s → off
      if (!O.auto) { O.auto = true; O.secs = 6; } else if (O.secs === 6) O.secs = 10; else if (O.secs === 10) O.secs = 3; else O.auto = false;
      save(); b.classList.toggle('on', O.auto); b.querySelector('small').textContent = O.auto ? `${O.secs} s` : 'by hand'; setAuto(); return;
    }
    if (a === 'pick') { O.pick = b.dataset.v; save(); build(); draw(); }
  };
  app.onchange = (e) => {
    const k = e.target.dataset.st; if (!k) return;
    O[k] = k === 'inv' ? Number(e.target.value) : e.target.value; save();
    resolve(['key', 'q', 'mode'].includes(k) && e.target.value === 'random');
    draw();
  };
  resolve(true);
  draw();
  setAuto();
}
