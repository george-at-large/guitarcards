// Scale practice: one tonic, a drone on it, and a scale across the whole neck (frets 0–12). No chord changes. Hold one
// scale, climb the darkness ladder (one note changes per rung), jump at random, or tour the scales congruent with
// yours: the gapped scales whose notes all sit inside it over the same drone (G minor pentatonic inside C Dorian),
// plus the blues fits (minor pentatonic over a major-3rd mode, its ♭3 rubbing the 3 on purpose).
import * as T from '../theory.js';
import * as F from '../fretboard.js';
import * as A from '../audio.js';
import * as SC from './scales.js';

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

// ---------- the screen ----------
export function renderPractice($app, ctx) {
  const { D, save, neckSVG, esc, fmt, onBack, keys } = ctx;
  const P = D.sp = Object.assign({ tonic: 'C', scale: 'dorian', mode: 'hold', pool: 'modes', bars: 4, bpm: 60, drone: true, fifth: true, labels: 'iv' }, D.sp || {});
  let cur = { id: P.scale, start: 0, why: null }, rung = LADDER.indexOf(P.scale), dir = 1, cong = [], ci = -1;
  let running = false, timer = null, beat = 0, lastStep = '';
  const tonic = () => T.parseNote(P.tonic);
  const title = (c) => `${T.noteName(T.transposeSemis(tonic(), c.start), true)} ${BY[c.id].name}`;

  function notes(c) {
    const tpc = T.notePc(tonic());
    const p = pcsOf(BY[c.id].ivs, c.start);
    const colour = c.start === 0 ? colourNotes(c.id) : [];
    const out = [];
    for (let s = 1; s <= 6; s++) for (let f = 0; f <= 12; f++) {
      const rel = ((F.OPEN[s] + f - tpc) % 12 + 12) % 12;
      if (!p.includes(rel)) continue;
      const kind = rel === 0 ? 'r' : rel === 3 || rel === 4 ? 't3' : rel === 10 || rel === 11 ? 't7' : colour.includes(rel) ? 'tx' : rel === 7 ? 't5' : 'sc';
      out.push({ string: s, fret: f, midi: F.OPEN[s] + f, iv: IVN[rel], kind, mark: c.start !== 0 && rel === c.start });
    }
    return out;
  }
  function next(step = 1) {
    if (P.mode === 'ladder') {
      if (rung < 0) rung = 1;
      let r = rung + dir * step;
      if (r < 0 || r >= LADDER.length) { dir = -dir; r = rung + dir * step; }
      lastStep = ladderStep(LADDER[rung], LADDER[r]);
      rung = r; cur = { id: LADDER[r], start: 0 };
    } else if (P.mode === 'random') {
      const pool = POOLS[P.pool].filter((x) => x !== cur.id);
      cur = { id: pool[Math.floor(Math.random() * pool.length)], start: 0 };
      lastStep = '';
    } else if (P.mode === 'congruent') {
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
  function tick() {
    if (!running) return;
    beat++;
    const per = P.bars * 4;
    if (P.mode !== 'hold' && beat >= per) { beat = 0; next(); } else drawBeat();
    timer = setTimeout(tick, 60000 / P.bpm);
  }
  function drawBeat() {
    const per = P.bars * 4;
    document.querySelectorAll('#pbeats i').forEach((el, i) => el.classList.toggle('on', i === beat % 4));
    const left = document.getElementById('pleft');
    if (left) left.textContent = P.mode === 'hold' ? '' : `next change in ${Math.ceil((per - beat) / 4)} bar${Math.ceil((per - beat) / 4) === 1 ? '' : 's'}`;
  }
  function stop() { running = false; clearTimeout(timer); A.stopDrone(); }

  function scaleInfo() {
    const sc = BY[cur.id];
    const parts = [];
    if (cur.why) parts.push(`<p class="pcong">Congruent with <b>${fmt(title({ id: P.scale, start: 0 }))}</b>: ${cur.why === 'blues' ? 'not inside it, but the ♭3 rubbing the 3 is the blues sound' : 'every note of it sits inside that scale'}${cur.also ? ` (the same notes as ${fmt(title(cur.also))})` : ''}. Over the drone it sounds as ${fmt(cur.as.join(' '))}.</p>`);
    if (lastStep) parts.push(`<p class="pcong">One note changed: <b>${fmt(lastStep)}</b></p>`);
    const col = cur.start === 0 ? colourNotes(cur.id) : [];
    if (col.length) parts.push(`<p class="note">Colour note${col.length > 1 ? 's' : ''} (violet): ${fmt(col.map((x) => T.prettyIv(IVN[x])).join(', '))}.</p>`);
    return `<div class="solo lv${cur.why ? 'G' : 'M'}"><div class="solo-top"><small>${P.mode === 'hold' ? 'Practise' : 'Now'}</small>${P.mode === 'ladder' ? `<span class="lvl">rung ${rung + 1} of 7 · ${rung < 3 ? 'bright' : rung > 3 ? 'dark' : 'middle'}</span>` : ''}</div><b>${fmt(title(cur))}</b>${sc.alias ? `<i>${fmt(sc.alias)}</i>` : ''}<p>${fmt(sc.feel)}</p>${parts.join('')}</div>`;
  }
  function ladderHTML() {
    if (P.mode !== 'ladder') return '';
    return `<div class="ladder">${LADDER.map((id, i) => `<span class="${i === rung ? 'on' : ''}">${esc(BY[id].name.replace(/ \(.*\)/, ''))}</span>`).join('')}</div>`;
  }
  function congHTML() {
    if (P.mode !== 'hold') return '';
    const cs = congruent(cur.id).slice(0, 12);
    if (!cs.length) return '';
    return `<details class="pcongs"><summary>Congruent over this drone (${cs.length})</summary>${cs.map((c) => `<p><b>${fmt(title(c))}</b>${c.also ? ` <span class="muted">(= ${fmt(title(c.also))})</span>` : ''} <span class="muted">${c.why === 'blues' ? 'blues fit' : 'inside'}</span> · sounds as ${fmt(c.as.join(' '))}</p>`).join('')}</details>`;
  }

  function draw() {
    const opts = (ids) => ids.map((id) => `<option value="${id}" ${id === P.scale ? 'selected' : ''}>${esc(BY[id].name)}</option>`).join('');
    $app.innerHTML = `
    <header class="chead"><button class="icon" data-p="back" aria-label="Back">‹</button><h1>Scale practice</h1><button class="icon" data-p="go" aria-label="${running ? 'Stop' : 'Start'}">${running ? '■' : '▶'}</button></header>
    <section class="card pctl">
      <div class="chips">${keys.map((k) => `<button class="chip ${P.tonic === k ? 'on' : ''}" data-tonic="${k}">${fmt(T.pretty(k))}</button>`).join('')}</div>
      <select id="pscale" class="select" aria-label="Scale"><optgroup label="Church modes">${opts(LADDER)}</optgroup><optgroup label="Melodic and harmonic minor, symmetric, bebop">${opts(SC.SCALES.filter((s) => ['mm', 'hm', 'hmaj', 'sym', 'bebop'].includes(s.fam)).map((s) => s.id))}</optgroup><optgroup label="Pentatonic and blues">${opts(SC.SCALES.filter((s) => s.fam === 'pent').map((s) => s.id))}</optgroup><optgroup label="Exotic">${opts(SC.SCALES.filter((s) => s.fam === 'exotic').map((s) => s.id))}</optgroup></select>
      <div class="seg">${[['hold', 'Hold'], ['ladder', 'Darkness ladder'], ['random', 'Random'], ['congruent', 'Congruent']].map(([v, l]) => `<button data-pmode="${v}" class="${P.mode === v ? 'on' : ''}">${l}</button>`).join('')}</div>
      ${P.mode === 'random' ? `<div class="chips">${Object.entries(POOL_NAMES).map(([v, l]) => `<button class="chip ${P.pool === v ? 'on' : ''}" data-pool="${v}">${l}</button>`).join('')}</div>` : ''}
      ${P.mode !== 'hold' ? `<div class="chips"><span class="muted small">Change every</span>${[2, 4, 8, 16].map((b) => `<button class="chip ${P.bars === b ? 'on' : ''}" data-bars="${b}">${b} bars</button>`).join('')}<button class="chip" data-p="next">Next ›</button></div>` : ''}
      <div class="chips"><button class="chip ${P.drone ? 'on' : ''}" data-p="drone">Drone</button><button class="chip ${P.fifth ? 'on' : ''}" data-p="fifth">+ 5th</button><span class="muted small">${P.bpm} bpm</span><button class="chip" data-p="bpm-">−</button><button class="chip" data-p="bpm+">+</button></div>
    </section>
    ${ladderHTML()}
    ${scaleInfo()}
    <div class="beats" id="pbeats">${running && P.mode !== 'hold' ? '<i></i><i></i><i></i><i></i>' : ''}</div><div class="note" id="pleft" style="text-align:center"></div>
    <div class="stage whole">${neckSVG({ notes: notes(cur), lo: 0, hi: 12 }, { lo: 0, hi: 12, labels: 'iv' })}</div>
    <div class="legend"><span class="k r">root</span><span class="k t3">3rd</span><span class="k t5">5th</span><span class="k t7">7th</span><span class="k tx">colour note</span><span class="k sc">rest</span></div>
    ${congHTML()}
    <p class="note">${running ? '' : 'Press ▶ to start the drone' + (P.mode !== 'hold' ? ' and the changes' : '') + '. '}The drone is on ${fmt(T.noteName(tonic(), true))}; the whole neck is the scale, frets 0–12.${cur.start !== 0 ? ' The ringed notes are the congruent scale’s own root.' : ''}</p>`;
    if (running) drawBeat();
    const sel = $app.querySelector('#pscale');
    sel.onchange = () => { P.scale = sel.value; cur = { id: P.scale, start: 0 }; rung = LADDER.indexOf(P.scale); cong = []; ci = -1; lastStep = ''; save(); draw(); };
  }
  $app.onclick = async (e) => {
    const b = e.target.closest('button'); if (!b) return;
    const d = b.dataset;
    if (d.tonic) { P.tonic = d.tonic; save(); if (running) drone(true); return draw(); }
    if (d.pmode) { P.mode = d.pmode; beat = 0; cong = []; ci = -1; cur = { id: P.scale, start: 0 }; rung = LADDER.indexOf(P.scale); lastStep = ''; save(); return draw(); }
    if (d.pool) { P.pool = d.pool; save(); return draw(); }
    if (d.bars) { P.bars = Number(d.bars); beat = 0; save(); return draw(); }
    const a = d.p;
    if (a === 'back') { stop(); return onBack(); }
    if (a === 'next') { beat = 0; return next(); }
    if (a === 'drone') { P.drone = !P.drone; save(); if (running) drone(P.drone); return draw(); }
    if (a === 'fifth') { P.fifth = !P.fifth; save(); if (running) drone(true); return draw(); }
    if (a === 'bpm-' || a === 'bpm+') { P.bpm = Math.max(30, Math.min(200, P.bpm + (a === 'bpm+' ? 4 : -4))); save(); return draw(); }
    if (a === 'go') {
      if (running) { stop(); return draw(); }
      await A.unlockAudio(); await A.ensureRunning();
      running = true; beat = 0; drone(true); draw();
      timer = setTimeout(tick, 60000 / P.bpm);
    }
  };
  draw();
  window.scrollTo(0, 0);
  return stop;
}
