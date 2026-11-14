// Scale practice: one tonic, a drone on it, and a scale across the whole neck (frets 0–12). No chord changes. Hold one
// scale, climb the darkness ladder (one note changes per rung), jump at random, or tour the scales congruent with
// yours: the gapped scales whose notes all sit inside it over the same drone (G minor pentatonic inside C Dorian),
// plus the blues fits (minor pentatonic over a major-3rd mode, its ♭3 rubbing the 3 on purpose).
import * as T from '../theory.js';
import * as F from '../fretboard.js';
import * as A from '../audio.js';
import * as SC from './scales.js';
import * as FL from './fsladder.js';
import * as G from './grips.js';

const IVN = ['1', 'b2', '2', 'b3', '3', '4', '#4', '5', 'b6', '6', 'b7', '7'];
const BY = Object.fromEntries(SC.SCALES.map((s) => [s.id, s]));
const pcsOf = (ivs, start = 0) => [...new Set(ivs.map((iv) => (T.intervalSemis(F.simpleIv(iv)) + start) % 12))];
export const LADDER = ['lydian', 'ionian', 'mixolydian', 'dorian', 'aeolian', 'phrygian', 'locrian'];
const JAZZ = ['mel-min', 'lyd-dom', 'altered', 'locrian-n2', 'dorian-b2', 'lyd-aug', 'mixo-b6', 'phryg-dom', 'harm-min', 'dorian-s4', 'dim-hw', 'dim-wh', 'whole-tone', 'bebop-dom', 'harm-maj'];
export const POOLS = { modes: LADDER, jazz: [...LADDER, ...JAZZ], all: SC.SCALES.map((s) => s.id) };
export const POOL_NAMES = { modes: 'Church modes', jazz: 'Modes + jazz scales', all: 'Everything, exotic too' };

// the notes that give a scale its colour: what it has that plain major (if it has a major 3rd) or natural minor
// (otherwise) doesn't
export function colourNotes(id) {
  const p = pcsOf(BY[id].ivs);
  const ref = pcsOf(p.includes(4) ? BY.ionian.ivs : BY.aeolian.ivs);
  return p.length >= 7 ? p.filter((x) => !ref.includes(x)) : [];
}
// one rung of the ladder to the next: the note that moved
export function ladderStep(fromId, toId) {
  const a = pcsOf(BY[fromId].ivs), b = pcsOf(BY[toId].ivs);
  const gone = a.filter((x) => !b.includes(x)), came = b.filter((x) => !a.includes(x));
  const name = (x, other) => T.prettyIv(x === 6 && other === 7 ? 'b5' : IVN[x]); // 5 falls to ♭5, not ♯4
  return gone.length === 1 && came.length === 1 ? `${name(gone[0], came[0])} → ${name(came[0], gone[0])}` : '';
}
// the gapped scales on any root whose notes all sit inside this one (plus the blues fits), as heard over the drone
export function congruent(id) {
  const base = pcsOf(BY[id].ivs);
  const out = [], seen = new Set();
  const gapped = SC.SCALES.filter((s) => s.ivs.length <= 6 && s.id !== 'whole-tone' && s.id !== 'aug-hex');
  for (const g of gapped) for (let st = 0; st < 12; st++) {
    const p = pcsOf(g.ivs, st);
    let why = null;
    if (p.every((x) => base.includes(x))) why = 'inside';
    else if (st === 0 && base.includes(4) && base.includes(10) && (g.id === 'min-pent' || g.id === 'blues')) why = 'blues';
    if (!why) continue;
    // the same notes under another name (C minor pentatonic = E♭ major pentatonic): keep the first, note the other
    const key = [...p].sort((x, y) => x - y).join();
    if (seen.has(key)) {
      const prev = out.find((o) => o.key === key);
      if (prev && st === 0 && prev.start !== 0) { prev.also = { id: prev.id, start: prev.start }; prev.id = g.id; prev.start = 0; } // name it from the drone's root
      else if (prev && !prev.also) prev.also = { id: g.id, start: st };
      continue;
    }
    seen.add(key);
    const as = p.map((x) => T.prettyIv(IVN[x])).sort((x, y) => IVN.indexOf(x.replace('♭', 'b').replace('♯', '#')) - IVN.indexOf(y.replace('♭', 'b').replace('♯', '#')));
    out.push({ id: g.id, start: st, why, as, key });
  }
  // the plainest first: pentatonics on the root, then on other roots, then the rest
  const rank = (c) => (c.start === 0 ? 0 : 1) + (c.id.includes('pent') ? 0 : 2) + (c.why === 'blues' ? 1 : 0);
  return out.sort((a, b) => rank(a) - rank(b));
}

// the ladders to climb: every ladder of modes one note apart (not the shuffles)
export const LADDERS = FL.LADDERS.filter((l) => !l.shuffle);

// ---------- the screen ----------
export function renderPractice($app, ctx) {
  const { D, save, neckSVG, esc, fmt, onBack, keys } = ctx;
  const P = D.sp = Object.assign({ tonic: 'C', scale: 'dorian', mode: 'hold', pool: 'modes', bars: 4, bpm: 60, drone: true, fifth: true, labels: 'iv' }, D.sp || {});
  // the old single "mode" split in two: whether the scale changes (and how), and what it moves through
  if (!P.change) { P.change = P.mode === 'hold' ? 'hold' : 'auto'; P.src = P.mode === 'hold' ? 'ladder' : P.mode; }
  if (!P.ladder || !FL.seqDef(P.ladder)) P.ladder = 'bright';
  if (!P.metro) P.metro = 'click';
  if (!P.area) { P.area = 'whole'; P.shape = 'E'; P.shapeGo = 'manual'; }
  const lad = () => FL.seqDef(P.ladder), ladIds = () => lad().ids.filter((id) => BY[id]), ladWalk = () => FL.walkOf(lad(), ladIds().length);
  let cur = { id: P.scale, start: 0, why: null }, wi = Math.max(0, ladWalk().findIndex((x) => ladIds()[x] === P.scale)), cong = [], ci = -1;
  let running = false, timer = null, beat = 0, lastStep = '';
  const tonic = () => T.parseNote(P.tonic);
  const title = (c) => `${T.noteName(T.transposeSemis(tonic(), c.start), true)} ${BY[c.id].name}`;
  const moving = () => P.change !== 'hold';
  // the piece of neck: the whole of it, a half, or one CAGED shape of the drone's note
  function win() {
    if (P.area === 'low') return { lo: 0, hi: 7, name: 'Frets 0–7' };
    if (P.area === 'high') return { lo: 7, hi: 15, name: 'Frets 7–15' };
    if (P.area === 'shape') { const p = G.positionOf(tonic(), P.shape); return { lo: p.lo, hi: p.hi, band: true, name: `${P.shape} shape · frets ${p.lo}–${p.hi}` }; }
    return { lo: 0, hi: 12, name: '' };
  }
  const timed = () => P.change === 'auto' || (P.area === 'shape' && P.shapeGo === 'auto');

  function notes(c) {
    const tpc = T.notePc(tonic());
    const p = pcsOf(BY[c.id].ivs, c.start);
    const colour = c.start === 0 ? colourNotes(c.id) : [];
    const out = [];
    const w = win();
    for (let s = 1; s <= 6; s++) for (let f = w.lo; f <= w.hi; f++) {
      const rel = ((F.OPEN[s] + f - tpc) % 12 + 12) % 12;
      if (!p.includes(rel)) continue;
      const kind = rel === 0 ? 'r' : rel === 3 || rel === 4 ? 't3' : rel === 10 || rel === 11 ? 't7' : colour.includes(rel) ? 'tx' : rel === 7 ? 't5' : 'sc';
      out.push({ string: s, fret: f, midi: F.OPEN[s] + f, iv: IVN[rel], kind, mark: c.start !== 0 && rel === c.start });
    }
    return out;
  }
  function next(step = 1) {
    const was = cur.id;
    if (P.src === 'ladder') {
      const w = ladWalk();
      wi = ((wi + step) % w.length + w.length) % w.length;
      cur = { id: ladIds()[w[wi]], start: 0 };
      const mv = FL.moved(was, cur.id);
      lastStep = mv && mv.pairs.length <= 2 ? mv.pairs.map(([a, b]) => `${T.prettyIv(a || '')} → ${T.prettyIv(b || '')}`).join(', ') : '';
    } else if (P.src === 'random') {
      const pool = POOLS[P.pool].filter((x) => x !== cur.id);
      cur = { id: pool[Math.floor(Math.random() * pool.length)], start: 0 };
      lastStep = '';
    } else if (P.src === 'congruent') {
      if (!cong.length) cong = congruent(P.scale);
      // the home scale, then each congruent one, back home in between
      if (cur.id !== P.scale || cur.start !== 0) cur = { id: P.scale, start: 0, why: null };
      else { ci = (ci + 1) % Math.max(1, cong.length); cur = cong[ci] ? { ...cong[ci] } : cur; }
      lastStep = '';
    }
    draw();
  }
  function drone(on) {
    if (on && P.drone) A.startDrone(36 + T.notePc(tonic()), P.fifth); // C2 to B2
    else A.stopDrone();
  }
  // each beat: the click (or just the dots), and on Auto the change when the bars are up
  function tick() {
    if (!running) return;
    beat++;
    const per = P.bars * 4;
    if (timed() && beat >= per) {
      beat = 0;
      if (P.area === 'shape' && P.shapeGo === 'auto') P.shape = G.nextShape(P.shape);
      if (P.change === 'auto') next(); else draw();
    }
    if (P.metro === 'click') { try { A.click(A.audioCtx().currentTime + 0.01, beat % 4 === 0 ? 2 : 1); } catch (e) { /* */ } }
    drawBeat();
    timer = setTimeout(tick, 60000 / P.bpm);
  }
  function drawBeat() {
    const per = P.bars * 4;
    document.querySelectorAll('#pbeats i').forEach((el, i) => el.classList.toggle('on', i === beat % 4));
    const left = document.getElementById('pleft');
    if (left) left.textContent = timed() ? `next ${P.change === 'auto' ? 'change' : 'shape'} in ${Math.ceil((per - beat) / 4)} bar${Math.ceil((per - beat) / 4) === 1 ? '' : 's'}` : '';
  }
  function stop() { running = false; clearTimeout(timer); A.stopDrone(); }

  function scaleInfo() {
    const sc = BY[cur.id];
    const parts = [];
    if (cur.why) parts.push(`<p class="pcong">Congruent with <b>${fmt(title({ id: P.scale, start: 0 }))}</b>: ${cur.why === 'blues' ? 'not inside it, but the ♭3 rubbing the 3 is the blues sound' : 'every note of it sits inside that scale'}${cur.also ? ` (the same notes as ${fmt(title(cur.also))})` : ''}. Over the drone it sounds as ${fmt(cur.as.join(' '))}.</p>`);
    if (lastStep) parts.push(`<p class="pcong">${lastStep.includes(',') ? 'Two notes changed' : 'One note changed'}: <b>${fmt(lastStep)}</b></p>`);
    const col = cur.start === 0 ? colourNotes(cur.id) : [];
    if (col.length) parts.push(`<p class="note">Colour note${col.length > 1 ? 's' : ''} (violet): ${fmt(col.map((x) => T.prettyIv(IVN[x])).join(', '))}.</p>`);
    const w = ladWalk();
    return `<div class="solo lv${cur.why ? 'G' : 'M'}"><div class="solo-top"><small>${moving() ? 'Now' : 'Practise'}</small>${moving() && P.src === 'ladder' ? `<span class="lvl">step ${wi + 1} of ${w.length}</span>` : ''}</div><b>${fmt(title(cur))}</b>${sc.alias ? `<i>${fmt(sc.alias)}</i>` : ''}<p>${fmt(sc.feel)}</p>${parts.join('')}</div>`;
  }
  function ladderHTML() {
    if (!moving() || P.src !== 'ladder') return '';
    return `<div class="ladder">${ladIds().map((id) => `<span class="${id === cur.id ? 'on' : ''}">${esc(BY[id].name.replace(/ \(.*\)/, ''))}</span>`).join('')}</div>`;
  }
  function congHTML() {
    if (moving()) return '';
    const cs = congruent(cur.id).slice(0, 12);
    if (!cs.length) return '';
    return `<details class="pcongs"><summary>Congruent over this drone (${cs.length})</summary>${cs.map((c) => `<p><b>${fmt(title(c))}</b>${c.also ? ` <span class="muted">(= ${fmt(title(c.also))})</span>` : ''} <span class="muted">${c.why === 'blues' ? 'blues fit' : 'inside'}</span> · sounds as ${fmt(c.as.join(' '))}</p>`).join('')}</details>`;
  }
  const segOf = (attr, cur2, opts) => `<div class="seg" role="radiogroup">${opts.map(([v, l]) => `<button data-${attr}="${v}" class="${String(cur2) === String(v) ? 'on' : ''}" role="radio" aria-checked="${String(cur2) === String(v)}">${l}</button>`).join('')}</div>`;
  function ladderOptions() {
    const groups = {};
    for (const l of LADDERS) (groups[l.group] = groups[l.group] || []).push(l);
    return Object.entries(groups).map(([g, ls]) => `<optgroup label="${esc(g)}">${ls.map((l) => `<option value="${l.id}" ${P.ladder === l.id ? 'selected' : ''}>${esc(l.name)}</option>`).join('')}</optgroup>`).join('');
  }

  function draw() {
    const opts = (ids) => ids.map((id) => `<option value="${id}" ${id === P.scale ? 'selected' : ''}>${esc(BY[id].name)}</option>`).join('');
    $app.innerHTML = `
    <header class="chead"><button class="icon" data-p="back" aria-label="Back">‹</button><h1>Scale practice</h1><button class="icon" data-p="go" aria-label="${running ? 'Stop' : 'Start'}">${running ? '■' : '▶'}</button></header>
    <section class="card pctl">
      <div class="chips">${keys.map((k) => `<button class="chip ${P.tonic === k ? 'on' : ''}" data-tonic="${k}">${fmt(T.pretty(k))}</button>`).join('')}</div>
      <select id="pscale" class="select" aria-label="Scale"><optgroup label="Church modes">${opts(LADDER)}</optgroup><optgroup label="Melodic and harmonic minor, symmetric, bebop">${opts(SC.SCALES.filter((s) => ['mm', 'hm', 'hmaj', 'sym', 'bebop'].includes(s.fam)).map((s) => s.id))}</optgroup><optgroup label="Pentatonic and blues">${opts(SC.SCALES.filter((s) => s.fam === 'pent').map((s) => s.id))}</optgroup><optgroup label="Exotic">${opts(SC.SCALES.filter((s) => s.fam === 'exotic').map((s) => s.id))}</optgroup></select>
      <h3>Change the scale</h3>
      ${segOf('pchange', P.change, [['hold', 'No: stay on it'], ['auto', 'Every few bars'], ['tap', 'When I tap Next']])}
      ${moving() ? `<h3>Move through</h3>${segOf('psrc', P.src, [['ladder', 'A darkness ladder'], ['random', 'Random'], ['congruent', 'Congruent']])}` : ''}
      ${moving() && P.src === 'ladder' ? `<select id="pladder" class="select" aria-label="Ladder">${ladderOptions()}</select><p class="note">${fmt(lad().blurb)}</p>` : ''}
      ${moving() && P.src === 'random' ? `<div class="chips">${Object.entries(POOL_NAMES).map(([v, l]) => `<button class="chip ${P.pool === v ? 'on' : ''}" data-pool="${v}">${l}</button>`).join('')}</div>` : ''}
      ${timed() ? `<div class="chips"><span class="muted small">${P.change === 'auto' ? 'Change' : 'Move'} every</span>${[1, 2, 4, 8, 16].map((b) => `<button class="chip ${P.bars === b ? 'on' : ''}" data-bars="${b}">${b} bar${b === 1 ? '' : 's'}</button>`).join('')}</div>` : ''}
      ${moving() ? `<div class="chips">${P.src === 'ladder' ? '<button class="chip" data-p="prev">‹ Back</button>' : ''}<button class="chip on" data-p="next">Next ›</button></div>` : ''}
      <h3>Neck</h3>
      ${segOf('parea', P.area, [['whole', 'Whole'], ['low', 'Low half'], ['high', 'High half'], ['shape', 'Shape']])}
      ${P.area === 'shape' ? `<div class="chips">${G.SHAPES.map((x) => `<button class="chip ${P.shape === x ? 'on' : ''}" data-pshape="${x}">${x}</button>`).join('')}<button class="chip" data-p="nextshape">Next shape ›</button></div>
      ${segOf('pshapego', P.shapeGo, [['manual', 'Move by hand'], ['auto', 'Move every few bars']])}` : ''}
      <h3>Sound</h3>
      <div class="chips"><button class="chip ${P.drone ? 'on' : ''}" data-p="drone">Drone</button><button class="chip ${P.fifth ? 'on' : ''}" data-p="fifth">+ 5th</button></div>
      ${segOf('pmetro', P.metro, [['click', 'Metronome: click'], ['silent', 'Silent (dots)'], ['off', 'Off']])}
      <div class="chips"><button class="chip" data-p="bpm-">−</button><span class="muted small">${P.bpm} bpm</span><button class="chip" data-p="bpm+">+</button></div>
    </section>
    ${ladderHTML()}
    ${scaleInfo()}
    <div class="beats" id="pbeats">${running && P.metro !== 'off' ? '<i></i><i></i><i></i><i></i>' : ''}</div><div class="note" id="pleft" style="text-align:center"></div>
    ${win().name ? `<p class="note" style="text-align:center">${esc(win().name)}</p>` : ''}
    <div class="stage whole">${neckSVG({ notes: notes(cur), lo: win().lo, hi: win().hi }, { lo: win().lo, hi: win().hi, labels: 'iv', band: win().band ? { lo: win().lo, hi: win().hi } : null })}</div>
    <div class="legend"><span class="k r">root</span><span class="k t3">3rd</span><span class="k t5">5th</span><span class="k t7">7th</span><span class="k tx">colour note</span><span class="k sc">rest</span></div>
    ${congHTML()}
    <p class="note">${running ? '' : `Press ▶ to start the drone${P.metro === 'click' ? ' and the metronome' : ''}${P.change === 'auto' ? ' and the changes' : ''}. `}The drone is on ${fmt(T.noteName(tonic(), true))}; ${P.area === 'whole' ? 'the whole neck is the scale, frets 0–12.' : `the neck shows ${win().name.replace(/^Frets/, 'frets')}.`}${cur.start !== 0 ? ' The ringed notes are the congruent scale’s own root.' : ''}</p>`;
    if (running) drawBeat();
    const sel = $app.querySelector('#pscale');
    sel.onchange = () => { P.scale = sel.value; cur = { id: P.scale, start: 0 }; const k = ladWalk().findIndex((x) => ladIds()[x] === P.scale); if (k >= 0) wi = k; cong = []; ci = -1; lastStep = ''; save(); draw(); };
    const ls = $app.querySelector('#pladder');
    if (ls) ls.onchange = () => { P.ladder = ls.value; wi = 0; cur = { id: ladIds()[ladWalk()[0]], start: 0 }; lastStep = ''; beat = 0; save(); draw(); };
  }
  $app.onclick = async (e) => {
    const b = e.target.closest('button'); if (!b) return;
    const d = b.dataset;
    if (d.tonic) { P.tonic = d.tonic; save(); if (running) drone(true); return draw(); }
    if (d.pchange) { P.change = d.pchange; beat = 0; cong = []; ci = -1; lastStep = ''; if (P.change === 'hold') cur = { id: P.scale, start: 0 }; save(); return draw(); }
    if (d.psrc) {
      P.src = d.psrc; beat = 0; cong = []; ci = -1; lastStep = '';
      if (P.src === 'ladder') { const k = ladWalk().findIndex((x) => ladIds()[x] === cur.id); wi = Math.max(0, k); cur = { id: ladIds()[ladWalk()[wi]], start: 0 }; } else cur = { id: P.scale, start: 0 };
      save(); return draw();
    }
    if (d.parea) { P.area = d.parea; save(); return draw(); }
    if (d.pshape) { P.shape = d.pshape; save(); return draw(); }
    if (d.pshapego) { P.shapeGo = d.pshapego; beat = 0; save(); return draw(); }
    if (d.pmetro) { P.metro = d.pmetro; save(); return draw(); }
    if (d.pool) { P.pool = d.pool; save(); return draw(); }
    if (d.bars) { P.bars = Number(d.bars); beat = 0; save(); return draw(); }
    const a = d.p;
    if (a === 'back') { stop(); return onBack(); }
    if (a === 'next' || a === 'prev') { beat = 0; return next(a === 'next' ? 1 : -1); }
    if (a === 'nextshape') { P.shape = G.nextShape(P.shape); beat = 0; save(); return draw(); }
    if (a === 'drone') { P.drone = !P.drone; save(); if (running) drone(P.drone); return draw(); }
    if (a === 'fifth') { P.fifth = !P.fifth; save(); if (running) drone(true); return draw(); }
    if (a === 'bpm-' || a === 'bpm+') { P.bpm = Math.max(30, Math.min(200, P.bpm + (a === 'bpm+' ? 4 : -4))); save(); return draw(); }
    if (a === 'go') {
      if (running) { stop(); return draw(); }
      A.unlockAudio().catch(() => {});
      await Promise.race([A.ensureRunning(), new Promise((r) => setTimeout(r, 500))]);
      running = true; beat = 0; drone(true); draw();
      if (P.metro === 'click') { try { A.click(A.audioCtx().currentTime + 0.02, 2); } catch (e) { /* */ } }
      timer = setTimeout(tick, 60000 / P.bpm);
    }
  };
  draw();
  window.scrollTo(0, 0);
  return stop;
}
