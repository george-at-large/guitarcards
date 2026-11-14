// Quartal: chords stacked in 4ths instead of 3rds, the open sound of modal jazz (McCoy Tyner, Herbie Hancock, So What)
// and neo-soul. The guitar is tuned in 4ths (bar the B string), so most stacks are a barre or near-barre across
// adjacent strings. An introduction, then progressions built from stacks over a bass note, each played in one CAGED
// area of the key or on one string set, voice-led, with fingers, and a bass note sounding under each stack.
import * as T from '../theory.js';
import * as F from '../fretboard.js';
import * as A from '../audio.js';
import * as G from './grips.js';

const KEYS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
// an interval above the bass, as a chord would name it (9, 11 and 13 for the tensions)
const EXT = ['1', 'b9', '9', 'b3', '3', '11', '#11', '5', 'b13', '13', 'b7', '7'];
// a note so many semitones above the tonic, spelled as a degree (flat for the notes outside the major scale)
const OFFIV = ['1', 'b2', '2', 'b3', '3', '4', 'b5', '5', 'b6', '6', 'b7', '7'];

// a chord: the bass (semitones above the progression's tonic), the stack's bottom note (also from the tonic) and the
// intervals stacked on it (5 = a perfect 4th, 6 = an augmented 4th, 4 = a major 3rd on top, as in the So What chord)
const C = (bass, from, steps, name) => ({ bass, from, steps, name });
const Q3 = [5, 5], Q4 = [5, 5, 5], SW = [5, 5, 5, 4];

export const PROGS = [
  { id: 'dorian', name: 'Dorian pad', key: 'D', minor: true,
    blurb: 'The McCoy Tyner sound: one quartal shape moved up and down the Dorian mode over a held root. Every stack is the mode’s own 4ths, so they all fit.',
    chords: [C(0, 0, Q4, 'm11'), C(0, 2, Q4, 'm11'), C(0, 3, [6, 5, 5], 'm6/9'), C(0, 2, Q4, 'm11')] },
  { id: 'sowhat', name: 'So What-style vamp', key: 'D', minor: true,
    blurb: 'The So What chord: three 4ths with a major 3rd on top (on strings 6 to 2 it’s one fret across). Eight bars on the root, then up a half step and back, the shape of the famous modal tune.',
    chords: [C(0, 0, SW, 'm11'), C(0, 0, SW, 'm11'), C(0, 0, SW, 'm11'), C(0, 0, SW, 'm11'), C(1, 1, SW, 'm11'), C(1, 1, SW, 'm11'), C(0, 0, SW, 'm11'), C(0, 0, SW, 'm11')] },
  { id: 'iiVI', name: 'ii–V–I in 4ths', key: 'C',
    blurb: 'A jazz ii–V–I voiced in 4ths: Dm11 as D G C F, G13 as F B E A (♭7 3 13 9), Cmaj6/9 as E A D G. The stacks hardly move: each voice steps to the nearest note.',
    chords: [C(2, 2, Q4, 'm11'), C(7, 5, [6, 5, 5], '13'), C(0, 4, Q4, '6/9'), C(0, 4, Q4, '6/9')] },
  { id: 'sus', name: 'Sus chords in parallel', key: 'D',
    blurb: 'In the style of Maiden Voyage: 7sus4 chords (5, root, 4th, ♭7 stacked in 4ths) moving by minor 3rds and half steps, never resolving.',
    chords: [C(0, 7, Q4, '7sus4'), C(0, 7, Q4, '7sus4'), C(3, 10, Q4, '7sus4'), C(3, 10, Q4, '7sus4'), C(1, 8, Q4, '7sus4'), C(1, 8, Q4, '7sus4'), C(11, 6, Q4, '7sus4'), C(11, 6, Q4, '7sus4')] },
  { id: 'soul', name: 'Neo-soul 6/9s', key: 'C',
    blurb: 'I – IV – V – IV with every chord a 6/9 voiced in 4ths (3, 6, 9, 5 over the root): the same shape moved, warm and floating.',
    chords: [C(0, 4, Q4, '6/9'), C(5, 9, Q4, '6/9'), C(7, 11, Q4, '6/9'), C(5, 9, Q4, '6/9')] },
  { id: 'minor', name: 'Minor ii–V–i in 4ths', key: 'A', minor: true,
    blurb: 'Bø7 as B E A D (1 11 ♭7 ♭3), E7alt as D G C F (♭7 ♯9 ♭13 ♭9 over E), Am6/9 as C F♯ B E: dark quartal colours for a minor cadence.',
    chords: [C(2, 2, Q4, 'm11♭5'), C(7, 5, Q4, '7alt'), C(0, 3, [6, 5, 5], 'm6/9'), C(0, 3, [6, 5, 5], 'm6/9')] },
  { id: 'scale', name: '4ths up the scale', key: 'C', scale: [0, 2, 4, 5, 7, 9, 11],
    blurb: 'Three-note stacks of the major scale’s own 4ths on every degree, up the scale: six perfect-4th stacks and one with an augmented 4th (on the 4th degree). The building blocks for comping in 4ths.' },
];
// a scale's own 4ths on each degree: the note, the note three steps up, the note three steps above that
function scaleStacks(sc) {
  const out = [];
  for (let d = 0; d <= 7; d++) {
    const at = (k) => sc[(d + k) % 7] + 12 * Math.floor((d + k) / 7);
    out.push(C(null, at(0) % 12, [at(3) - at(0), at(6) - at(3)], ''));
  }
  return out;
}
const chordsOf = (p) => p.chords || scaleStacks(p.scale);

export function renderQuartal($app, ctx) {
  const { D, save, neckSVG, esc, fmt, onBack, KIND } = ctx;
  const O = D.qt = Object.assign({ id: 'dorian', key: null, where: 'E', set: '5432', labels: 'finger', beats: 4, bpm: 72, k: 0, bass: true }, D.qt || {});
  const R = { on: false, timer: null, next: 0, beat: 0, vis: [], seq: null };
  const prog = () => PROGS.find((p) => p.id === O.id) || PROGS[0];
  const tonic = () => T.parseNote(O.key || prog().key);

  // ---------- every way to put a stack on adjacent strings, within a four-fret span ----------
  function placements(ch) {
    const tp = T.notePc(tonic()), bottom = (tp + ch.from) % 12, n = ch.steps.length + 1, out = [];
    const bassPc = ch.bass === null ? bottom : (tp + ch.bass) % 12, bassNote = T.transpose(tonic(), OFFIV[((bassPc - tp) % 12 + 12) % 12]);
    for (let low = 6; low - n + 1 >= 1; low--) {
      const strings = Array.from({ length: n }, (_, i) => low - i);
      for (let f0 = 0; f0 <= 17; f0++) {
        const m0 = F.OPEN[low] + f0;
        if (((m0 - bottom) % 12 + 12) % 12) continue;
        let m = m0, ok = true;
        const notes = [{ string: low, fret: f0, midi: m0 }];
        ch.steps.forEach((st, i) => { m += st; const s = strings[i + 1], f = m - F.OPEN[s]; if (f < 0 || f > 17) ok = false; notes.push({ string: s, fret: f, midi: m }); });
        if (!ok) continue;
        const fr = notes.filter((x) => x.fret > 0).map((x) => x.fret);
        if (fr.length && Math.max(...fr) - Math.min(...fr) > 3) continue;
        const named = notes.map((x) => { const iv = EXT[((x.midi - bassPc) % 12 + 12) % 12]; return { ...x, iv, kind: KIND(iv.replace(/^(b9|9|11|#11|b13|13)$/, 'x')), note: T.transpose(bassNote, F.simpleIv(iv)) }; }); // spelled from the bass: E♭ A♭ D♭, not E♭ A♭ C♯
        const placed = G.assignFingers(named).sort((a, b) => b.string - a.string);
        out.push({ notes: placed, set: strings.join(''), lo: fr.length ? Math.min(...fr) : 0, hi: Math.max(...notes.map((x) => x.fret)), center: fr.length ? fr.reduce((a, b) => a + b, 0) / fr.length : 0 });
      }
    }
    return out;
  }
  // the whole progression: each stack in the CAGED area (or on the string set), as near the last as it can be
  function sequence() {
    let prev = null;
    const pos = O.where === 'set' ? null : G.positionOf(tonic(), O.where);
    return chordsOf(prog()).map((ch) => {
      let pool = placements(ch);
      if (pos) { const inside = pool.filter((v) => v.notes.every((x) => x.fret === 0 ? pos.lo <= 1 : x.fret >= pos.lo - 1 && x.fret <= pos.hi + 1)); if (inside.length) pool = inside; }
      else { const on = pool.filter((v) => v.set === O.set.slice(0, v.set.length)); if (on.length) pool = on; } // a smaller stack takes the set's lowest strings
      const mid = pos ? pos.mid : 5;
      const score = (v) => (prev ? G.movement(prev, v) : Math.abs(v.center - mid)) + (pos ? Math.abs(v.center - mid) * 0.15 : 0);
      const v = pool.length ? pool.reduce((a, b) => (score(b) < score(a) ? b : a)) : null;
      if (v) prev = v;
      const tp = T.notePc(tonic()), bassPc = ch.bass === null ? (tp + ch.from) % 12 : (tp + ch.bass) % 12;
      const nm = T.noteName(T.transpose(tonic(), OFFIV[((bassPc - tp) % 12 + 12) % 12]), true);
      const stackNames = v ? v.notes.slice().sort((a, b) => a.midi - b.midi).map((x) => T.noteName(x.note, true)).join(' ') : '';
      return { ...ch, v, bassPc, label: ch.name ? `${nm}${ch.name}` : stackNames, stackNames };
    });
  }
  const seq = () => (R.seq ||= sequence());

  // ---------- sound: the stack strummed, its bass note under it ----------
  function play(c, t, dur) {
    if (!c?.v) return;
    A.strum(c.v.notes.map((x) => x.midi).sort((a, b) => a - b), t, { dur });
    if (O.bass && c.bass !== null) A.pluck(36 + c.bassPc, t, { vel: 0.7, dur });
  }
  function clock() {
    if (!R.on) return;
    const ac = A.audioCtx();
    if (R.next < ac.currentTime - 0.02) R.next = ac.currentTime + 0.05;
    while (R.next < ac.currentTime + 0.12) {
      const t = R.next, b = R.beat++, s = seq(), dur = 60 / O.bpm;
      const k = Math.floor(b / O.beats) % s.length, first = b % O.beats === 0;
      if (first) play(s[k], t, dur * O.beats * 0.95);
      A.click(t, first ? 2 : 1);
      R.vis.push(setTimeout(() => { if (!R.on) return; if (first && O.k !== k) { O.k = k; drawStage(); } document.querySelectorAll('.qtbeats i').forEach((el, i) => el.classList.toggle('on', i === (b % O.beats) % 4)); }, Math.max(0, (t - ac.currentTime) * 1000)));
      if (R.vis.length > 64) R.vis.splice(0, 32);
      R.next += dur;
    }
    R.timer = setTimeout(clock, 25);
  }
  async function start() {
    A.unlockAudio().catch(() => {});
    R.on = true;
    await Promise.race([A.ensureRunning(), new Promise((r) => setTimeout(r, 500))]);
    if (!R.on) return;
    R.next = A.audioCtx().currentTime + 0.1; R.beat = O.k * O.beats;
    clock(); draw();
  }
  function stop() { R.on = false; clearTimeout(R.timer); R.vis.forEach(clearTimeout); R.vis = []; A.hush(); }
  function hearNow() { const c = seq()[O.k]; A.unlockAudio().catch(() => {}); A.ensureRunning().then(() => play(c, A.audioCtx().currentTime + 0.05, 1.8)); }

  // ---------- the screen ----------
  const seg = (attr, cur, opts) => `<div class="seg" role="radiogroup">${opts.map(([v, l]) => `<button data-${attr}="${v}" class="${String(cur) === String(v) ? 'on' : ''}" role="radio" aria-checked="${String(cur) === String(v)}">${l}</button>`).join('')}</div>`;
  function stageHTML() {
    const s = seq(), k = ((O.k % s.length) + s.length) % s.length, c = s[k], nx = s[(k + 1) % s.length], pv = s[(k - 1 + s.length) % s.length];
    const pos = O.where === 'set' ? null : G.positionOf(tonic(), O.where);
    const lo = Math.max(0, Math.min(pos ? pos.lo : 99, c.v ? c.v.lo - 1 : 99)), hi = Math.max(pos ? pos.hi : 0, c.v ? c.v.hi + 1 : 0, lo + 4);
    const big = c.v ? neckSVG(c.v, { lo, hi, labels: O.labels, band: pos ? { lo: pos.lo, hi: pos.hi } : null, prev: k ? pv.v : null }) : '<div class="cnone">No stack fits here</div>';
    return `<div class="csstrip">${s.map((x, i) => `<button class="csch ${i === k ? 'on' : ''}" data-k="${i}"><b>${fmt(x.label)}</b><i>${fmt(x.name ? x.stackNames : '')}</i></button>`).join('')}</div>
      <div class="csnow"><div><h2>${fmt(c.label)}</h2><p class="note">stacked ${fmt(c.stackNames)}${c.bass !== null ? ` over ${fmt(T.noteName(T.transpose(tonic(), OFFIV[((c.bassPc - T.notePc(tonic())) % 12 + 12) % 12]), true))} in the bass` : ''} · strings ${c.v ? c.v.set.split('').join('-') : ''}</p></div><div class="csnext"><small>next</small><b>${fmt(nx.label)}</b></div></div>
      <div class="stage fsneck" id="qtswipe">${big}</div>
      <div class="legend"><span class="k r">root (bass)</span><span class="k t3">3rd</span><span class="k t5">5th</span><span class="k t7">7th</span><span class="k tx">9, 11, 13</span></div>`;
  }
  function drawStage() { const el = document.getElementById('qtstage'); if (el) el.innerHTML = stageHTML(); }
  function draw() {
    const p = prog();
    $app.innerHTML = `
    <header class="chead"><button class="icon" data-f="back" aria-label="Back">‹</button><h1>Quartal</h1><button class="icon" data-f="play" aria-label="${R.on ? 'Stop' : 'Start'}">${R.on ? '■' : '▶'}</button></header>
    <details class="card qtintro" ${O.introClosed ? '' : 'open'}><summary><b>Chords in 4ths</b></summary>
      <p>Most chords stack 3rds (C E G B). Quartal chords stack 4ths: D G C F. With no 3rd at the bottom they sound open and unresolved, neither major nor minor until the bass or the context decides. It’s the sound of modal jazz (McCoy Tyner, Herbie Hancock, Miles’s So What) and a lot of neo-soul and film music.</p>
      <p><b>Why it suits the guitar:</b> the strings are tuned in 4ths, apart from the B string. A three-note stack on strings 6-5-4, 5-4-3 or 4-3-2 is a one-fret barre; crossing to the B string moves it up a fret. The So What chord (three 4ths with a major 3rd on top) lies on strings 6 to 2 at a single fret.</p>
      <p><b>How to use it:</b> over a bass note, a stack names a chord (D G C F over D is Dm11; E A D G over C is C6/9). Move one shape through a mode’s own 4ths for a modal pad; voice-lead stacks through a ii–V–I; slide one shape in parallel for the sus-chord sound. The colours below name each note against the bass.</p>
    </details>
    <div class="chips cschips">${PROGS.map((x) => `<button class="chip ${x.id === p.id ? 'on' : ''}" data-prog="${x.id}">${esc(x.name)}</button>`).join('')}</div>
    <p class="note">${fmt(p.blurb)}</p>
    <div class="chips fskeys">${KEYS.map((k) => `<button class="chip ${(O.key || p.key) === k ? 'on' : ''}" data-key="${k}">${fmt(T.pretty(k))}${p.minor ? 'm' : ''}</button>`).join('')}</div>
    <div class="fsopt"><span>Where</span>${seg('where', O.where, [...G.SHAPES.map((x) => [x, `${x} area`]), ['set', 'One string set']])}</div>
    ${O.where === 'set' ? `<div class="fsopt"><span>Strings</span>${seg('set', O.set, [['6543', '6-5-4-3'], ['5432', '5-4-3-2'], ['4321', '4-3-2-1'], ['65432', '6 to 2']])}</div>` : ''}
    <div class="fsopt"><span>Show</span>${seg('labels', O.labels, [['finger', 'Fingers'], ['iv', 'Over the bass'], ['note', 'Notes']])}</div>
    <div class="fsplay csplay"><button class="primary ${R.on ? 'stop' : ''}" data-f="play">${R.on ? '■ Stop' : '▶ Play through'}</button><div class="fsplayr">${R.on ? '<div class="beats qtbeats"><i></i><i></i><i></i><i></i></div>' : `<small>each stack strummed with its bass note, ${O.beats} beats each, with a click</small>`}</div></div>
    <div class="fsrow fstempo"><span class="lbl">Tempo</span><input type="range" id="qtbpm" min="40" max="200" step="2" value="${O.bpm}" aria-label="Tempo"><span class="fsbpm"><b id="qtbpmv">${O.bpm}</b><small>bpm</small></span></div>
    <div class="fsopt"><span>Each chord</span>${seg('beats', O.beats, [[2, '2 beats'], [4, '4'], [8, '8']])}</div>
    <div class="fsopt"><span>Bass note</span>${seg('bass', O.bass ? 1 : 0, [[1, 'On'], [0, 'Off']])}</div>
    <div class="fsnav csnav"><button class="icon" data-f="prev" aria-label="Previous">‹</button><button class="chip" data-f="hear">▶ Hear this one</button><button class="icon" data-f="next" aria-label="Next">›</button></div>
    <div id="qtstage">${stageHTML()}</div>
    <p class="note">${O.where === 'set' ? 'On the string set: each stack as near the last as it can be.' : `All in the ${O.where} area of ${fmt(T.noteName(tonic(), true))} (the band), on whichever strings each stack fits, as near the last as it can be.`} The dotted rings show where the previous stack’s fingers were.</p>`;
    const rr = $app.querySelector('#qtbpm');
    rr.oninput = () => { O.bpm = Number(rr.value); document.getElementById('qtbpmv').textContent = O.bpm; };
    rr.onchange = () => save();
    const det = $app.querySelector('.qtintro');
    det.ontoggle = () => { O.introClosed = !det.open; save(); };
  }
  const change = (fn) => { fn(); R.seq = null; O.k = 0; save(); if (R.on) R.beat = 0; draw(); };
  function move(dir) { const n = seq().length; O.k = (((O.k + dir) % n) + n) % n; save(); drawStage(); if (!R.on) hearNow(); else R.beat = O.k * O.beats; }
  let sx = null;
  $app.ontouchstart = (e) => { sx = e.target.closest('#qtswipe') ? e.touches[0].clientX : null; };
  $app.ontouchend = (e) => { if (sx === null) return; const dx = e.changedTouches[0].clientX - sx; sx = null; if (Math.abs(dx) >= 40) move(dx < 0 ? 1 : -1); };
  $app.onclick = (e) => {
    const b = e.target.closest('button'); if (!b) return;
    const d = b.dataset;
    if (d.prog) return change(() => { O.id = d.prog; O.key = null; });
    if (d.key) return change(() => { O.key = d.key; });
    if (d.where) return change(() => { O.where = d.where; });
    if (d.set) return change(() => { O.set = d.set; });
    if (d.labels) { O.labels = d.labels; save(); return drawStage(); }
    if (d.beats) { O.beats = Number(d.beats); save(); return draw(); }
    if (d.bass !== undefined) { O.bass = d.bass === '1'; save(); return draw(); }
    if (d.k !== undefined) { O.k = Number(d.k); save(); drawStage(); if (!R.on) hearNow(); else R.beat = O.k * O.beats; return; }
    const a = d.f;
    if (a === 'back') { stop(); return onBack(); }
    if (a === 'play') { if (R.on) { stop(); return draw(); } return start(); }
    if (a === 'next' || a === 'prev') return move(a === 'next' ? 1 : -1);
    if (a === 'hear') return hearNow();
  };
  draw();
  return stop;
}
