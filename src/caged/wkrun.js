// The Workouts section: pick a workout (or the full workout), a key and a key loop, an area of the neck, then step
// through it. Each step draws what to play and sounds its context: a chord or short cadence, the chord held softly
// while you play, and where it resolves. Steps advance by tap or on a slow beat. Each unit (a workout, in a key, in a
// shape) is ticked off when finished, and the run remembers where it got to.
import * as T from '../theory.js';
import * as A from '../audio.js';
import * as G from './grips.js';
import * as W from './workouts.js';

const LEGEND_SCALE = '<div class="legend"><span class="k r">root</span><span class="k t3">3rd</span><span class="k t5">5th</span><span class="k t7">7th</span><span class="k tx">colour note</span><span class="k sc">rest of the scale</span></div>';
const LEGEND_GUIDE = '<div class="legend"><span class="k t3">3rd</span><span class="k t7">7th</span><span class="k sc">other 3rds and 7ths here</span></div>';
const AREAS = [['one', 'One shape'], ['pair', 'Two shapes'], ['all', 'All five'], ['neck', 'Whole neck']];

export function renderWorkouts($app, ctx) {
  const { D, save, neckSVG, esc, fmt, legend, onBack, startRoamer } = ctx;
  const O = D.wk = Object.assign({ sel: 'full', key: 'C', loop: 'one', shape: 'E', area: 'one', types: { tri: true, sev: true, ext: false }, pace: 'tap', bpm: 60, beats: 8, sound: true, hold: true, click: true, mute: false, skip: [], done: {}, at: null, seed: 7 }, D.wk || {});
  if (!O.v2) { O.click = true; O.v2 = 1; } // the metronome is on unless switched off
  O.cw = { ...W.CW_DEFAULT, ...(O.cw || {}) };
  if (!O.metro) O.metro = O.click === false ? 'silent' : 'on'; // on: click and dots; silent: dots only; off: no beat
  const METRO = [['on', 'Metronome: on'], ['silent', 'Metronome: silent'], ['off', 'Metronome: off']];
  let R = null;

  // ---------- the plan: every unit of the run, in order ----------
  const workoutsOf = () => (O.sel === 'full' ? W.WORKOUTS.filter((w) => !O.skip.includes(w.id)) : [W.byId(O.sel)].filter(Boolean));
  const unitId = (u) => `${u.w.id}|${u.key}${u.shape ? `|${u.shape}${u.pair ? '+' : ''}` : u.neck ? '|neck' : ''}`;
  const sig = () => JSON.stringify([O.sel, O.key, O.loop, O.shape, O.area, O.loop === 'rand' ? O.seed : 0, O.sel === 'full' ? O.skip : 0, O.sel === 'complete' || O.sel === 'full' ? O.cw : 0]);
  function plan() {
    const keys = W.loopKeys(O.key, O.loop, O.seed);
    const lo0 = G.positionOf(T.parseNote(O.key), O.shape).lo;
    const units = [];
    for (const key of keys) for (const w of workoutsOf()) {
      if (!w.area) { units.push({ w, key }); continue; }
      if (O.area === 'neck' && w.neck) { units.push({ w, key, neck: true }); continue; }
      const s0 = O.loop === 'pos' ? W.shapeNear(key, lo0) : O.shape;
      for (const shape of O.area === 'all' ? W.shapesFrom(s0) : [s0]) units.push({ w, key, shape, pair: O.area === 'pair' }); // (the whole neck: one shape for the rest)
    }
    return units;
  }
  const qs = () => W.typesFor(O.types);
  const stepCache = new Map();
  const unitSteps = (u) => {
    const k = `${unitId(u)}|${qs().join(',')}|${JSON.stringify(O.cw)}`;
    if (!stepCache.has(k)) { if (stepCache.size > 40) stepCache.clear(); stepCache.set(k, W.steps(u.w, u.key, { shape: u.shape || 'E', pair: !!u.pair, qs: qs(), cw: O.cw, neck: !!u.neck })); }
    return stepCache.get(k);
  };

  // ---------- progress ----------
  function keysDone(w) {
    return W.MAJOR_KEYS.filter((k) => (w.area ? G.SHAPES.every((s) => O.done[`${w.id}|${k}|${s}`]) || G.SHAPES.every((s) => O.done[`${w.id}|${k}|${s}+`]) : O.done[`${w.id}|${k}`])).length;
  }
  function rowProgress(w) {
    const kd = keysDone(w);
    const here = w.area ? G.SHAPES.filter((s) => O.done[`${w.id}|${O.key}|${s}`]).length : O.done[`${w.id}|${O.key}`] ? 1 : 0;
    const cur = w.area ? `${fmt(T.pretty(O.key))}: ${here}/5 shapes` : `${fmt(T.pretty(O.key))}: ${here ? 'done' : 'to do'}`;
    return `<span class="wkp ${kd === 12 ? 'ok' : kd || here ? 'part' : ''}">${cur} · ${kd}/12 keys</span>`;
  }

  // ---------- sound ----------
  const now = () => A.audioCtx().currentTime;
  const spb = () => 60 / O.bpm;
  // a step's chords: in auto, two beats apart and on the beat; tapping, a comfortable gap
  function sound(step, t = now() + 0.06) {
    if (!O.sound || O.mute || !step.sound) return;
    const gap = O.pace === 'auto' ? 2 * spb() : Math.min(2.2, Math.max(1, spb() * 2));
    step.sound.seq.forEach((c, i) => {
      const tt = t + i * gap;
      A.strum(c.midis, tt, { vel: 0.55, spread: 0.022 });
      if (O.hold) R.pad.chord(c.midis, tt, { inT: 0.25, outT: 0.5 });
    });
    if (!O.hold) R.pad.release(now(), 0.3);
  }
  function resolve(t = now() + 0.04) {
    const st = R.steps[R.si];
    if (!st?.sound?.resolve || O.mute) return;
    A.strum(st.sound.resolve.midis, t, { vel: 0.55, spread: 0.022 });
    if (O.hold) R.pad.chord(st.sound.resolve.midis, t, { inT: 0.25, outT: 0.5 });
  }
  function freshPad() { R.pad = A.padLine({ vel: 0.4 }); }

  // ---------- the clock: one beat drives the metronome and the auto pace ----------
  function clock() {
    if (!R || R.paused) return;
    // after a stall (a heavy step list being worked out, the phone busy) the missed beats are dropped, not played
    // in a burst: the beat jumps to the next one on its grid
    if (R.next < now() - 0.02) { const miss = Math.ceil((now() - R.next) / spb()); R.next += miss * spb(); R.beat += miss; if (R.sb > 0) R.sb += miss; }
    while (R.next < now() + 0.12) {
      const t = R.next, b = R.beat++;
      if (O.metro === 'on' && !O.mute) A.click(t, b % 4 === 0 ? 2 : 1);
      if (O.metro !== 'off') R.vis.push(setTimeout(() => { document.querySelectorAll('#wbeats i').forEach((el, i) => el.classList.toggle('on', i === b % 4)); const n = document.getElementById('wbeatn'); if (n) n.textContent = O.pace === 'auto' && R.sb > 0 ? `${Math.min(R.sb, stepLen(R.steps[R.si]))} of ${stepLen(R.steps[R.si])}` : ''; }, Math.max(0, (t - now()) * 1000)));
      if (O.pace === 'auto') autoBeat(t);
      R.next += spb();
    }
    R.clock = setTimeout(clock, 25);
  }
  function startClock() { clearTimeout(R.clock); R.next = now() + 0.08; R.beat = 0; clock(); }
  const clearVis = () => { (R.vis || []).forEach(clearTimeout); R.vis = []; };
  // auto: a step lasts its lead-in (two beats a chord of the cadence) plus so many beats; a resolution falls two
  // beats before the end; the next step lands on the beat
  const stepLen = (st) => (st.sound ? (st.sound.seq.length - 1) * 2 : 0) + O.beats;
  function autoBeat(t) {
    const st = R.steps[R.si], idx = R.sb++, len = stepLen(st);
    if (st.sound?.resolve && idx === len - 2) resolve(t);
    if (idx === len) { R.sb = -1e9; clearTimeout(R.timer); R.timer = setTimeout(() => safe(() => go(1, t)), Math.max(0, (t - now()) * 1000)); }
  }

  // ---------- the run ----------
  // the run screen comes up at once; the audio is woken inside the tap but never waited on for long (an iPhone can
  // leave it hanging), and the beat starts once it's running or after half a second
  async function start(resume) {
    A.unlockAudio().catch(() => {});
    try {
      const units = plan();
      if (!units.length) return failed(null, 'Nothing to do: every workout is left out of the full workout. Tap In beside one.');
      stopAll();
      R = { units, ui: 0, si: 0, steps: null, timer: null, clock: null, paused: false, sb: 0, vis: [] };
      if (resume && O.at && O.at.sig === sig()) { R.ui = Math.min(O.at.ui, units.length - 1); R.si = O.at.si; }
      freshPad();
      enterUnit(R.ui, R.si);
      const run = R;
      await Promise.race([A.ensureRunning(), new Promise((res) => setTimeout(res, 500))]);
      if (R === run && R && !R.paused) startClock();
    } catch (e) { failed(e); }
  }
  // something broke: stop the beat and say what, rather than clicking on with nothing shown
  function failed(e, msg) {
    if (e) console.error(e);
    stopAll();
    $app.innerHTML = `
    <header class="chead"><button class="icon" data-w="setup" aria-label="Back">‹</button><h1>Workouts</h1><span></span></header>
    <section class="card"><h2>Couldn’t start</h2><p>${esc(msg || 'Something went wrong while setting up this workout.')}</p>${e ? `<p class="note">${esc(String(e && e.message || e))}</p><p class="note">Pull down to reload the page and try again; if it keeps happening, tell me the line above.</p>` : ''}</section>
    <div class="actions"><button class="primary" data-w="setup">Back to workouts</button></div>`;
  }
  const safe = (fn) => { try { fn(); } catch (e) { failed(e); } };
  function enterUnit(ui, si = 0, t = null) {
    R.ui = ui;
    R.steps = unitSteps(R.units[ui]);
    if (!R.steps.length) return finishUnit(t); // nothing fits here (rare): move on
    R.si = Math.min(si, R.steps.length - 1);
    show(t);
  }
  function finishUnit(t = null) {
    const u = R.units[R.ui];
    O.done[unitId(u)] = Date.now();
    R.flash = `✓ ${u.w.name} · ${T.pretty(u.key)}${u.shape ? ` · ${u.pair ? `${u.shape}+${G.nextShape(u.shape)}` : `${u.shape} shape`}` : ''}`;
    if (R.ui + 1 >= R.units.length) { O.at = null; save(); return finished(); }
    save();
    enterUnit(R.ui + 1, 0, t);
  }
  function go(d, t = null) {
    if (!R) return;
    clearTimeout(R.timer);
    if (d > 0 && R.si + 1 >= R.steps.length) return finishUnit(t);
    if (d < 0 && R.si === 0) { if (R.ui > 0) { R.flash = ''; enterUnit(R.ui - 1, 1e9); } return; }
    R.si += d;
    R.flash = '';
    show(t);
  }
  // blocks: runs of steps that belong together (one chord type, one string set, one morph chain); a step with no
  // block is its own
  const blockOf = (i) => R.steps[i]?.block ?? `#${i}`;
  function blocks() { const out = []; R.steps.forEach((s, i) => { if (!i || blockOf(i) !== blockOf(i - 1)) out.push(i); }); return out; }
  function nextBlock() {
    clearTimeout(R.timer);
    const b = blockOf(R.si);
    let j = R.si + 1;
    while (j < R.steps.length && blockOf(j) === b) j++;
    R.flash = '';
    if (j >= R.steps.length) { if (R.ui + 1 >= R.units.length) { O.at = null; save(); return finished(); } return enterUnit(R.ui + 1, 0); }
    R.si = j;
    show();
  }
  // t: the beat this step lands on (auto); a tapped step sounds right away, or on the next beat in auto
  function show(t = null) {
    const u = R.units[R.ui], st = R.steps[R.si];
    O.at = { sig: sig(), ui: R.ui, si: R.si }; save();
    drawRun(u, st);
    if (O.pace === 'auto' && !R.paused) { R.sb = t ? 1 : 0; sound(st, t || R.next); } else sound(st);
  }
  function stopAll() {
    if (!R) return;
    clearTimeout(R.timer); clearTimeout(R.clock); clearVis();
    A.hush();
    R = null;
  }
  function togglePause(btn) {
    R.paused = !R.paused;
    btn.textContent = R.paused ? '▶' : '❚❚';
    clearTimeout(R.timer); clearTimeout(R.clock); clearVis();
    if (R.paused) A.hush();
    else { freshPad(); startClock(); show(); }
  }

  // ---------- drawing the run ----------
  const areaName = (u) => (u.shape ? (u.pair ? `${u.shape}+${G.nextShape(u.shape)} shapes` : `${u.shape} shape`) : 'the whole neck');
  // the complete chord workout's own settings
  function cwCard() {
    const c = O.cw, q = (x) => fmt(T.pretty(T.chordSymbol(T.parseNote('C'), x).replace(/^C/, '') || 'maj'));
    let n = 0;
    try { n = W.steps(W.byId('complete'), O.key, { shape: O.shape, pair: O.area === 'pair', cw: c, neck: O.area === 'neck' }).length; } catch (e) { /* */ }
    return `<section class="card">
      <h2>Complete chord workout</h2>
      ${W.CW_TYPES.map(([g, list]) => `<h3>${esc(g)}</h3><div class="chips">${list.map((x) => `<button class="chip ${c.qs.includes(x) ? 'on' : ''}" data-cwq="${x}">${q(x)}</button>`).join('')}</div>`).join('')}
      <h3>Voicings</h3><div class="chips">${W.CW_FAMS.map(([v, l]) => `<button class="chip ${c.fams.includes(v) ? 'on' : ''}" data-cwf="${v}">${esc(l)}</button>`).join('')}</div>
      <h3>Inversions</h3><div class="chips">${[[0, 'Root position'], [1, '1st'], [2, '2nd'], [3, '3rd (sevenths)']].map(([v, l]) => `<button class="chip ${c.invs.includes(v) ? 'on' : ''}" data-cwi="${v}">${l}</button>`).join('')}</div>
      <h3>Strings</h3>${seg('cwstrings', W.CW_STRINGS, c.strings)}
      <h3>Order</h3>${seg('cworder', [['type', 'Each type through all its voicings'], ['morph', 'Each voicing morphed through the types']], c.order)}
      <p class="note"><b>${n} voicings</b> in ${fmt(T.pretty(O.key))}${O.area === 'neck' ? ' up the whole neck' : O.area === 'pair' ? ` in the ${O.shape}+${G.nextShape(O.shape)} shapes` : ` in the ${O.shape} shape`}${O.area === 'all' ? ' (and the same in each of the five shapes)' : ''}. Triad voicings are for triads, drops and shells for sevenths and colour chords; colour chords are voiced with their four most telling notes, named by the note in the bass. Each string set is a block: Next block skips it.</p>
    </section>`;
  }
  function neckHTML(n) {
    const svg = neckSVG({ notes: n.notes, lo: n.lo, hi: n.hi }, { lo: n.lo, hi: n.hi, band: n.band || null, prev: n.prev || null, bg: n.bg || null, labels: 'iv' });
    return n.cap ? `<figure>${svg}<figcaption>${fmt(n.cap)}</figcaption></figure>` : svg;
  }
  function drawRun(u, st) {
    const nx = R.steps[R.si + 1] || null;
    const total = R.units.length;
    const pct = ((R.ui + (R.si + 1) / R.steps.length) / total) * 100;
    $app.innerHTML = `
    <header class="chead run"><button class="icon" data-w="stop" aria-label="Stop">■</button><div class="where">${esc(u.w.name)}<small>${fmt(T.pretty(u.key))} ${esc(u.w.mode || (u.w.minor ? 'minor' : 'major'))} · ${esc(areaName(u))}</small></div><button class="icon" data-w="pause" aria-label="Pause">${R.paused ? '▶' : '❚❚'}</button></header>
    <div class="wkbar"><i style="width:${pct.toFixed(1)}%"></i></div>
    <p class="wkcount">${total > 1 ? `Part ${R.ui + 1} of ${total} · ` : ''}${(() => { const bs = blocks(); return bs.length > 1 && bs.length < R.steps.length ? `block ${bs.filter((x) => x <= R.si).length} of ${bs.length} · ` : ''; })()}step ${R.si + 1} of ${R.steps.length}${R.flash ? ` <span class="wkflash">${esc(R.flash)}</span>` : ''}</p>
    <div class="now wknow"><div class="main">${fmt(T.pretty(st.title))}</div><div class="sub">${fmt(T.pretty(st.sub || ''))}</div></div>
    ${O.metro !== 'off' ? '<div class="beats wkdots" id="wbeats"><i></i><i></i><i></i><i></i></div><p class="wkbeatn" id="wbeatn"></p>' : ''}
    ${st.tip ? `<p class="note wktip">${fmt(st.tip)}</p>` : ''}
    <div class="lnecks ${st.necks.length > 1 ? '' : 'one'}">${st.necks.map(neckHTML).join('')}</div>
    ${st.legend === 'scale' ? LEGEND_SCALE : st.legend === 'guide' ? LEGEND_GUIDE : legend}
    <div class="nextline">${nx ? `<span class="lbl">next</span> <span class="wknext">${fmt(T.pretty(nx.title))}</span>` : R.ui + 1 < total ? `<span class="lbl">next</span> <span class="muted">${esc(R.units[R.ui + 1].w.name)} · ${fmt(T.pretty(R.units[R.ui + 1].key))} · ${esc(areaName(R.units[R.ui + 1]))}</span>` : '<span class="lbl">last step</span>'}</div>
    <div class="wkctl">
      <button data-w="prev" aria-label="Back">◀</button>
      ${O.sound && !O.mute ? '<button data-w="again" class="soft">↻ Hear it</button>' : ''}
      ${O.sound && !O.mute && st.sound?.resolve ? `<button data-w="resolve" class="soft">Resolve → ${fmt(T.pretty(st.sound.resolve.name))}</button>` : ''}
      <button data-w="next" class="primary" aria-label="Next">Next ▶</button>
      <button data-w="block" aria-label="Skip to the next block">Next block ⏭</button>
    </div>
    <div class="runctl"><button data-w="bpm-" aria-label="Slower">−</button><b id="wbpm">${O.bpm} bpm</b><button data-w="bpm+" aria-label="Faster">+</button></div>
    ${O.pace === 'auto' ? `<div class="wkbeats"><span class="lbl">beats a step</span>${seg('beats', [[4, '4'], [8, '8'], [16, '16'], [32, '32']], O.beats)}</div>` : ''}
    <div class="runbtns"><button class="rt ${O.metro !== 'off' ? 'on' : ''}" data-w="metro">${METRO.find(([v]) => v === O.metro)[1]}</button>${liveBtn('sound', 'Chord sound', O.sound)}${liveBtn('auto', O.pace === 'auto' ? `Auto: next every ${O.beats} beats` : 'Auto: off, tap Next', O.pace === 'auto')}${O.sound ? liveBtn('hold', 'Hold the chord', O.hold) : ''}${liveBtn('mute', 'Mute all', O.mute)}<button class="rt" data-w="skip">Skip this part</button></div>`;
  }
  const liveBtn = (k, l, on) => `<button class="rt ${on ? 'on' : ''}" data-w="t:${k}" aria-pressed="${!!on}">${esc(l)}</button>`;
  function finished() {
    const n = R.units.length;
    stopAll();
    $app.innerHTML = `
    <header class="chead"><button class="icon" data-w="back" aria-label="Back">‹</button><h1>Done</h1><span></span></header>
    <section class="card wkdone"><h2>Workout complete</h2><p>${n} part${n === 1 ? '' : 's'} finished${O.loop !== 'one' ? `, through ${O.loop === 'rand' ? 'all twelve keys' : esc(W.LOOPS.find((l) => l.id === O.loop).name.toLowerCase())}` : ''}. Each one is ticked in the list.</p></section>
    <div class="actions"><button class="primary" data-w="setup">Back to workouts</button></div>`;
  }

  // ---------- setup ----------
  function seg(name, opts, cur) {
    return `<div class="seg" role="radiogroup">${opts.map(([v, l]) => `<button data-o="${name}" data-v="${v}" class="${String(cur) === String(v) ? 'on' : ''}" role="radio" aria-checked="${String(cur) === String(v)}">${l}</button>`).join('')}</div>`;
  }
  const chip = (k, l, on) => `<button class="chip ${on ? 'on' : ''}" data-tg="${k}">${l}</button>`;
  function rowHTML(w) {
    const on = O.sel === w.id, inc = !O.skip.includes(w.id);
    return `<li class="wkrow ${on ? 'on' : ''}"><button class="wkpick" data-pick="${w.id}">${on ? '<span class="wksel">✓ Selected</span>' : ''}<b>${esc(w.name)}</b><small>${fmt(w.blurb)}</small>${rowProgress(w)}</button>${O.sel === 'full' ? `<button class="wkinc ${inc ? 'on' : ''}" data-inc="${w.id}" aria-label="${inc ? 'In the full workout: tap to leave it out' : 'Left out of the full workout: tap to put it back'}" aria-pressed="${inc}">${inc ? 'In' : 'Out'}</button>` : ''}${on ? `<button class="wkgo" data-w="go">▶ Start ${esc(w.name.toLowerCase())}</button>` : ''}</li>`;
  }
  function summary() {
    if (O.sel === 'roamer') return '';
    const units = plan();
    const left = units.filter((u) => !O.done[unitId(u)]).length;
    const hasArea = workoutsOf().some((w) => w.area);
    return `<p class="note"><b>${units.length} part${units.length === 1 ? '' : 's'}</b>${units.length > 1 ? `, ${left} not yet ticked` : ''}: ${O.sel === 'full' ? `${workoutsOf().length} workouts` : esc(W.byId(O.sel).name)} in ${O.loop === 'one' ? fmt(T.pretty(O.key)) : `${12} keys (${esc(W.LOOPS.find((l) => l.id === O.loop).name)})`}${hasArea ? `, ${O.area === 'all' ? 'all five shapes each' : O.area === 'pair' ? 'two shapes at a time' : O.loop === 'pos' ? 'staying in one position' : `the ${O.shape} shape`}` : ''}. ${O.at && O.at.sig === sig() ? 'You can pick up where you left off.' : ''}</p>`;
  }
  function setup() {
    const pos = G.positionOf(T.parseNote(O.key), O.shape);
    const loop = W.LOOPS.find((l) => l.id === O.loop);
    const roam = O.sel === 'roamer';
    const resumable = !roam && O.at && O.at.sig === sig();
    $app.innerHTML = `
    <header class="chead"><button class="icon" data-w="back" aria-label="Back">‹</button><h1>Workouts</h1><button class="icon" data-w="go" aria-label="Start">▶</button></header>
    <p class="lead">Cover everything, one step at a time: every chord, arpeggio and scale in every shape, then every key. Each step sounds its chord, holds it while you play, and shows where it goes.</p>
    <section class="card">
      <h2>Workout</h2>
      <ul class="wklist"><li class="wkrow ${O.sel === 'full' ? 'on' : ''}"><button class="wkpick" data-pick="full">${O.sel === 'full' ? '<span class="wksel">✓ Selected</span>' : ''}<b>Full workout</b><small>All of them in order, every key in your loop. ${O.sel === 'full' ? 'Tap In or Out beside any workout to leave it out.' : 'Or tap one workout below to do just that one.'}</small></button></li></ul>
      ${W.GROUPS.map((g) => `<h3>${esc(g)}</h3><ul class="wklist">${W.WORKOUTS.filter((w) => w.group === g).map(rowHTML).join('')}</ul>`).join('')}
      <h3>Progressions</h3>
      <ul class="wklist"><li class="wkrow ${roam ? 'on' : ''}"><button class="wkpick" data-pick="roamer">${roam ? '<span class="wksel">✓ Selected</span>' : ''}<b>Progression roamer, all five shapes</b><small>Every progression and cadence in the library, each once round in every CAGED shape, on the beat. Runs in Chord changes.</small></button></li></ul>
    </section>
    ${roam ? '' : `
    <section class="card">
      <h2>Key and loop</h2>
      <div class="chips">${W.MAJOR_KEYS.map((k) => `<button class="chip ${O.key === k ? 'on' : ''}" data-o="key" data-v="${k}">${fmt(T.pretty(k))}</button>`).join('')}</div>
      <h3>Loop</h3>
      ${seg('loop', W.LOOPS.map((l) => [l.id, l.name]), O.loop)}
      <p class="note">${fmt(loop.blurb)}${O.loop !== 'one' ? ` Starts on ${fmt(T.pretty(O.key))}.` : ''}</p>
    </section>
    <section class="card">
      <h2>Where on the neck</h2>
      <div class="chips shapes">${G.SHAPES.map((s) => `<button class="chip ${O.shape === s ? 'on' : ''}" data-o="shape" data-v="${s}">${O.area === 'pair' ? `${s}+${G.nextShape(s)}` : s}</button>`).join('')}</div>
      ${seg('area', AREAS, O.area)}
      <p class="note">${O.loop === 'pos' ? `Your hand stays at frets ${pos.lo}–${pos.hi}; each key uses whichever shape lives there.` : O.area === 'all' ? `Each workout goes up the neck through all five shapes, starting from the ${O.shape} shape.` : O.area === 'pair' ? `The ${O.shape} and ${G.nextShape(O.shape)} shapes as one area: part of the drill is the shift between them.` : `The ${O.shape} shape of ${fmt(T.pretty(O.key))}: frets ${pos.lo}–${pos.hi}.`} The string-set and up-the-neck workouts use the whole neck${O.area === 'neck' ? '; Whole neck is for the complete chord workout, the others use the shape' : ''}.</p>
    </section>
    ${O.sel === 'complete' ? cwCard() : ''}
    ${O.sel === 'complete' ? '' : `<section class="card">
      <h2>Chord types</h2>
      <div class="chips">${Object.entries(W.TYPES).map(([k, t]) => chip(`type:${k}`, `${t.name} <small>${t.qs.map((q) => fmt(T.pretty(T.chordSymbol(T.parseNote('C'), q).replace(/^C/, '') || 'maj'))).join(' ')}</small>`, O.types[k])).join('')}</div>
      <p class="note">For the CAGED chords and both arpeggio workouts.</p>
    </section>`}
    <section class="card">
      <h2>Pace</h2>
      ${seg('pace', [['tap', 'Tap through'], ['auto', 'On the beat']], O.pace)}
      <div class="tempo"><button data-w="bpm-" aria-label="Slower">−</button><b>${O.bpm}<small> bpm</small></b><button data-w="bpm+" aria-label="Faster">+</button></div>
      <h3>Beats a step (on Auto)</h3>${seg('beats', [[4, '4'], [8, '8'], [16, '16'], [32, '32']], O.beats)}
      <h3>Metronome</h3>${seg('metro', [['on', 'Click and dots'], ['silent', 'Dots only'], ['off', 'Off']], O.metro)}
      <div class="chips">${chip('sound', 'Chord sounds', O.sound)}${chip('hold', 'Hold the chord', O.hold)}</div>
      <p class="note">${O.pace === 'auto' ? `Each step lasts ${O.beats} beats at ${O.bpm} bpm, then moves on on the beat. Scales want 16 or 32.` : 'Tap Next when you’ve played the step; the metronome keeps time meanwhile.'} The metronome (clicking, silent dots, or off), chord sound and Auto are separate switches, so you can keep the beat with the chords silent, and let it move on by itself or tap through; all of them, the tempo and Mute all can be changed during a run.</p>
    </section>`}
    ${summary()}
    <div class="actions">${resumable ? '<button class="primary" data-w="resume">▶ Pick up where you left off</button>' : ''}<button class="${resumable ? '' : 'primary'}" data-w="go">${roam ? '▶ Start the roamer' : resumable ? 'Start from the beginning' : '▶ Start'}</button></div>`;
  }

  $app.onclick = (e) => safe(() => onClick(e));
  function onClick(e) {
    const b = e.target.closest('button'); if (!b) return;
    const d = b.dataset;
    if (d.pick) { O.sel = d.pick; save(); return setup(); }
    if (d.inc) { O.skip = O.skip.includes(d.inc) ? O.skip.filter((x) => x !== d.inc) : [...O.skip, d.inc]; save(); return setup(); }
    if (d.cwq || d.cwf || d.cwi !== undefined) {
      const [k, v] = d.cwq ? ['qs', d.cwq] : d.cwf ? ['fams', d.cwf] : ['invs', Number(d.cwi)];
      const has = O.cw[k].includes(v);
      if (!(has && O.cw[k].length === 1)) O.cw = { ...O.cw, [k]: has ? O.cw[k].filter((x) => x !== v) : [...O.cw[k], v] };
      save(); return setup();
    }
    if (d.o === 'cwstrings' || d.o === 'cworder') { O.cw = { ...O.cw, [d.o === 'cwstrings' ? 'strings' : 'order']: d.v }; save(); return setup(); }
    if (d.o === 'beats' && R) { O.beats = Number(d.v); save(); return drawRun(R.units[R.ui], R.steps[R.si]); }
    if (d.o) {
      O[d.o] = ['beats'].includes(d.o) ? Number(d.v) : d.v;
      if (d.o === 'loop' && d.v === 'rand') O.seed = 1 + Math.floor(Math.random() * 9999);
      save(); return setup();
    }
    if (d.tg) {
      if (d.tg.startsWith('type:')) { const k = d.tg.slice(5); O.types = { ...O.types, [k]: !O.types[k] }; if (!Object.values(O.types).some(Boolean)) O.types.tri = true; }
      else O[d.tg] = !O[d.tg];
      save(); return setup();
    }
    const a = d.w;
    if (!a) return;
    if (a === 'back') { stopAll(); return onBack(); }
    if (a === 'setup') { stopAll(); return setup(); }
    if (a === 'go' || a === 'resume') { save(); if (O.sel === 'roamer') return startRoamer(); return start(a === 'resume'); }
    if (a === 'bpm-' || a === 'bpm+') {
      O.bpm = Math.max(20, Math.min(200, O.bpm + (a === 'bpm+' ? 4 : -4))); save();
      if (R) { const el = document.getElementById('wbpm'); if (el) el.textContent = `${O.bpm} bpm`; return; }
      return setup();
    }
    if (!R) return;
    if (a === 'stop') { stopAll(); return setup(); }
    if (a === 'pause') return togglePause(b);
    if (a === 'next') return go(1);
    if (a === 'block') return nextBlock();
    if (a === 'metro') { const i = METRO.findIndex(([v]) => v === O.metro); O.metro = METRO[(i + 1) % 3][0]; save(); return drawRun(R.units[R.ui], R.steps[R.si]); }
    if (a === 'prev') return go(-1);
    if (a === 'again') { clearTimeout(R.timer); return sound(R.steps[R.si]); }
    if (a === 'resolve') return resolve();
    if (a === 'skip') { clearTimeout(R.timer); R.flash = ''; if (R.ui + 1 >= R.units.length) { O.at = null; save(); return finished(); } return enterUnit(R.ui + 1, 0); }
    if (a.startsWith('t:')) {
      const k = a.slice(2);
      if (k === 'auto') { O.pace = O.pace === 'auto' ? 'tap' : 'auto'; clearTimeout(R.timer); R.sb = 0; }
      else O[k] = !O[k];
      if ((k === 'hold' && !O.hold) || (k === 'sound' && !O.sound)) R.pad.release(now(), 0.4);
      if (k === 'mute' && O.mute) { A.hush(); freshPad(); }
      save();
      drawRun(R.units[R.ui], R.steps[R.si]);
    }
  }
  setup();
  return stopAll;
}
