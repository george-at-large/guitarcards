// Fundamentals: the app shell. Home, mode setup, the drill (prompt, answer, Reveal, score, streak), the session
// summary, the Fuzzy section and Settings. Each mode module supplies options, a pool of items, a question maker and
// the answer UI; this file runs sessions, scores answers and keeps the metronome and drone.
import * as A from '../audio.js';
import * as C from './core.js';
import shapes from './shapes.js';
import finder from './finder.js';
import formulas from './formulas.js';
import modetest from './modetest.js';
import intervals from './intervals.js';
import miquiz from './miquiz.js';
import miplayer from './miplayer.js';
import chordscales from './chordscales.js';
import context from './context.js';
import progressions from './progressions.js';

const MODES = [shapes, chordscales, finder, formulas, modetest, intervals, context, progressions, miquiz, miplayer];
const BY = Object.fromEntries(MODES.map((m) => [m.id, m]));
const $app = document.getElementById('fun');
const S = C.state();
const esc = C.esc;
let cleanup = () => {};

// ---------- setup ----------
function cfgFor(mode) {
  const def = Object.fromEntries(mode.options.map((o) => [o.id, Array.isArray(o.def) ? [...o.def] : o.def]));
  const c = Object.assign(def, { len: '10', tools: { metro: false, bpm: 70, up: false, drone: false, fifth: true } }, S.setups[mode.id] || {});
  c.tools = Object.assign({ metro: false, bpm: 70, up: false, drone: false, fifth: true }, c.tools);
  return c;
}
const saveCfg = (mode, c) => { S.setups[mode.id] = c; C.save(); };

// ---------- home ----------
function home() {
  stopAll();
  const fz = C.fuzzyItems();
  const pts = S.days[C.today()] || 0;
  $app.innerHTML = `
    <header class="top"><h1>Fundamentals</h1>
      <div class="sub">${pts ? `${pts.toLocaleString()} points today` : 'The things to know cold.'}</div></header>
    <div class="modes">${MODES.map((m) => {
      const n = fz.filter((x) => x.mode === m.id).length;
      return `<button class="mode" data-mode="${m.id}"><b>${esc(m.title)}</b><span>${esc(m.blurb)}</span>${n ? `<i class="fz">${n} fuzzy</i>` : ''}</button>`;
    }).join('')}</div>
    <div class="row wide">
      <button class="big ${fz.length ? 'warn' : ''}" id="fuzzy">Fuzzy material${fz.length ? ` · ${fz.length}` : ''}</button>
      <button class="big ghost" id="settings">Settings</button>
    </div>`;
  $app.querySelectorAll('[data-mode]').forEach((b) => (b.onclick = () => setup(BY[b.dataset.mode])));
  $app.querySelector('#fuzzy').onclick = fuzzy;
  $app.querySelector('#settings').onclick = settings;
}

function setup(mode) {
  stopAll();
  const c = cfgFor(mode);
  const fz = C.fuzzyItems(mode.id).length;
  const draw = () => {
    const opts = mode.options.filter((o) => !o.when || o.when(c));
    $app.innerHTML = `
      <header class="top"><button class="back" id="back">‹ Home</button><h1>${esc(mode.title)}</h1><div class="sub">${esc(mode.blurb)}</div></header>
      ${opts.map((o) => optionHTML(o, c[o.id])).join('')}
      ${mode.kind === 'player' ? '' : `<div class="opt"><div class="ol">Session</div><div class="chips">${[['10', '10 prompts'], ['20', '20 prompts'], ['5m', '5 minutes']].map(([v, l]) => `<button class="chip ${c.len === v ? 'on' : ''}" data-len="${v}">${l}</button>`).join('')}</div></div>`}
      <div class="row wide sticky">
        <button class="big go" id="start">${mode.kind === 'player' ? 'Start' : 'Start session'}</button>
        ${fz ? `<button class="big warn" id="fz">Fuzzy · ${fz}</button>` : ''}
      </div>`;
    $app.querySelector('#back').onclick = home;
    $app.querySelectorAll('[data-opt]').forEach((b) => (b.onclick = () => {
      const o = mode.options.find((x) => x.id === b.dataset.opt);
      const v = b.dataset.v;
      if (o.type === 'multi') {
        const cur = c[o.id];
        if (cur.includes(v)) { if (cur.length > 1) c[o.id] = cur.filter((x) => x !== v); } else c[o.id] = [...cur, v];
      } else if (o.type === 'toggle') c[o.id] = !c[o.id];
      else c[o.id] = v;
      saveCfg(mode, c); draw();
    }));
    $app.querySelectorAll('[data-len]').forEach((b) => (b.onclick = () => { c.len = b.dataset.len; saveCfg(mode, c); draw(); }));
    $app.querySelector('#start').onclick = () => { A.unlockAudio(); start(mode, c, false); };
    const f = $app.querySelector('#fz');
    if (f) f.onclick = () => { A.unlockAudio(); start(mode, c, true); };
  };
  draw();
}
function optionHTML(o, val) {
  if (o.type === 'toggle') return `<div class="opt"><div class="ol">${esc(o.label)}</div><div class="chips"><button class="chip ${val ? 'on' : ''}" data-opt="${o.id}">${val ? 'On' : 'Off'}</button>${o.note ? `<span class="onote">${esc(o.note)}</span>` : ''}</div></div>`;
  const on = (v) => (o.type === 'multi' ? val.includes(v) : String(val) === String(v));
  const groups = o.groups || [[null, o.choices]];
  return `<div class="opt"><div class="ol">${esc(o.label)}</div>${groups.map(([g, ch]) => `${g ? `<div class="og">${esc(g)}</div>` : ''}<div class="chips">${ch.map(([v, l]) => `<button class="chip ${on(v) ? 'on' : ''}" data-opt="${o.id}" data-v="${esc(v)}">${esc(l)}</button>`).join('')}</div>`).join('')}</div>`;
}

// ---------- the session ----------
let SES = null;
function start(mode, cfg, fuzzyOnly, allModes = false) {
  const pool = fuzzyOnly ? null : mode.pool(cfg);
  if (!fuzzyOnly && !pool.length) { alert('Nothing to drill with these settings.'); return; }
  SES = {
    mode, cfg, fuzzyOnly, allModes, pool, state: {}, recent: [], lastKey: null,
    n: cfg.len === '20' ? 20 : cfg.len === '5m' ? Infinity : 10, until: cfg.len === '5m' ? Date.now() + 5 * 60000 : Infinity,
    asked: 0, clean: 0, points: 0, streak: 0, best: 0, newFuzzy: new Map(), cleared: new Map(), card: 0,
  };
  if (mode.kind === 'player') SES.n = Infinity;
  next();
}

function chooseQuestion() {
  const s = SES;
  let item, mode = s.mode, keyPc = null;
  if (s.fuzzyOnly) {
    const fz = C.fuzzyItems(s.allModes ? null : s.mode.id).filter((x) => BY[x.mode]);
    if (!fz.length) return null;
    const fresh = fz.length > 2 ? fz.filter((x) => !s.recent.includes(x.id)) : fz;
    item = C.weighted(fresh, (x) => 1 + (1 - x.ema) * 2);
    item = { id: item.id, mode: item.mode, label: item.label, params: item.params };
    mode = BY[item.mode];
    if (mode.keyed) keyPc = C.pickKeyPc(s.lastKey);
  } else if (mode.next) {
    ({ item, keyPc } = mode.next(ctxBase(), s.pool));
  } else {
    item = C.pickItem(s.pool, s.recent);
    if (mode.keyed) keyPc = C.pickKeyPc(s.lastKey);
  }
  s.recent = [item.id, ...s.recent].slice(0, 3);
  if (keyPc != null) s.lastKey = keyPc;
  return { item, mode, keyPc };
}
function ctxBase() {
  return { cfg: SES.cfg, state: SES.state, pickKey: () => C.pickKeyPc(SES.lastKey), pickItem: (pool) => C.pickItem(pool, SES.recent) };
}

function next() {
  cleanup(); cleanup = () => {};
  A.stopPlayer();
  const s = SES;
  if (s.asked >= s.n || Date.now() > s.until) return summary();
  const ch = chooseQuestion();
  if (!ch) { alert('No fuzzy items left here. Nice.'); return home(); }
  const { item, mode, keyPc } = ch;
  const cfg = s.fuzzyOnly ? Object.assign(cfgFor(mode), { fuzzy: true }) : s.cfg;
  let q;
  try { q = mode.make(item, keyPc, { ...ctxBase(), cfg }); } catch (e) { console.error(e); s.recent.push(item.id); return next(); }
  q.item = item; q.keyPc = keyPc; q.mode = mode;
  s.card++;
  drill(q, cfg);
}

function drill(q, cfg) {
  const s = SES, mode = q.mode, player = mode.kind === 'player';
  const t0 = performance.now();
  let done = false, revealed = false;
  $app.innerHTML = `
    <div class="dhead">
      <button class="x" id="quit" aria-label="End">✕</button>
      <span class="prog">${player ? `Card ${s.card}` : s.n === Infinity ? `<span id="clock"></span>` : `${s.asked + 1} / ${s.n}`}</span>
      ${player ? '' : `<span class="pts" id="pts">${s.points.toLocaleString()}</span><span class="streak ${s.streak > 1 ? 'on' : ''}" id="streak">×${s.streak}</span>`}
    </div>
    ${toolsHTML(mode, cfg)}
    <div class="prompt">
      ${q.kicker ? `<div class="kicker">${q.kicker}</div>` : ''}
      <div class="ptitle">${q.title}</div>${q.sub ? `<div class="psub">${q.sub}</div>` : ''}
      <div class="cd" id="cd" hidden><i></i></div>
    </div>
    <div id="body"></div>
    <div id="reveal"></div>
    <div class="result" id="result"></div>
    <div class="actions" id="actions"></div>`;
  const $ = (id) => $app.querySelector('#' + id);
  $('quit').onclick = () => (player || s.asked === 0 ? home() : summary());
  bindTools(mode, cfg, q);
  let clockT = null;
  if (s.n === Infinity && !player) {
    const tick = () => { const left = Math.max(0, s.until - Date.now()); const el = $('clock'); if (el) el.textContent = `${Math.floor(left / 60000)}:${String(Math.floor(left / 1000) % 60).padStart(2, '0')}`; };
    tick(); clockT = setInterval(tick, 500);
  }
  let cdT = null;
  const ctx = {
    cfg, state: s.state, body: $('body'), q,
    elapsed: () => performance.now() - t0,
    buttons(list) {
      const el = $('actions');
      el.innerHTML = list.map((b, i) => `<button class="big ${b.kind || ''}" data-i="${i}">${b.label}</button>`).join('');
      el.querySelectorAll('[data-i]').forEach((x) => (x.onclick = () => list[Number(x.dataset.i)].on()));
    },
    reveal(html) { revealed = true; $('reveal').innerHTML = html; $('reveal').scrollIntoView({ behavior: 'smooth', block: 'nearest' }); },
    setPrompt(title, sub) { $app.querySelector('.ptitle').innerHTML = title; const ps = $app.querySelector('.psub'); if (ps) ps.innerHTML = sub || ''; },
    speed: (target) => Math.max(0, Math.min(1, 1 - (ctx.elapsed() - target) / (target * 1.5))),
    countdown(secs, onEnd) {
      if (!secs) return;
      const el = $('cd'); el.hidden = false;
      const bar = el.querySelector('i');
      const end = performance.now() + secs * 1000;
      const step = () => {
        const left = end - performance.now();
        bar.style.width = `${Math.max(0, (100 * left) / (secs * 1000))}%`;
        el.classList.toggle('low', left < 2500);
        if (left <= 0) { cdT = null; if (!done) onEnd(); return; }
        cdT = requestAnimationFrame(step);
      };
      cdT = requestAnimationFrame(step);
    },
    stopCountdown() { if (cdT) cancelAnimationFrame(cdT); cdT = null; const el = $('cd'); if (el) el.classList.add('stopped'); },
    // self-rated: play it, then Got it or Reveal
    selfRate(qq) {
      ctx.buttons([
        { label: 'Reveal', kind: 'ghost', on: () => { ctx.reveal(qq.reveal()); ctx.finish({ clean: false, fuzz: 1 }); } },
        { label: 'Got it', kind: 'go', on: () => ctx.finish({ clean: true, speed: ctx.speed(qq.target || 10000), show: qq.reveal }) },
      ]);
    },
    finish(res) {
      if (done) return; done = true;
      ctx.stopCountdown();
      if (player) return;
      s.asked++;
      let gained = 0;
      if (res.clean) {
        s.clean++; s.streak++; s.best = Math.max(s.best, s.streak);
        gained = Math.round((100 + 50 * (res.speed ?? 0.5)) * (1 + 0.1 * Math.min(s.streak - 1, 10)));
        s.points += gained;
        if (cfg.tools?.up && cfg.tools.metro && mode.tools?.metro) { cfg.tools.bpm = Math.min(240, cfg.tools.bpm + 4); A.setMetronomeBpm(cfg.tools.bpm); const b = $app.querySelector('#tbpm'); if (b) b.textContent = cfg.tools.bpm; }
      } else s.streak = 0;
      const recs = [{ item: q.item, clean: res.clean, fuzz: res.fuzz }].concat(res.extra || []);
      for (const r of recs) {
        const ch = C.record(r.item, { clean: r.clean, fuzz: r.fuzz ?? (r.clean ? 0 : 1), keyPc: r === recs[0] ? q.keyPc : null });
        if (ch === 'fuzzy') s.newFuzzy.set(r.item.id, r.item.label);
        if (ch === 'cleared') s.cleared.set(r.item.id, r.item.label);
      }
      S.days[C.today()] = (S.days[C.today()] || 0) + gained; C.save();
      $('pts').textContent = s.points.toLocaleString();
      const st = $('streak'); st.textContent = `×${s.streak}`; st.classList.toggle('on', s.streak > 1);
      $('result').innerHTML = res.clean ? `<span class="good">+${gained}</span>${s.streak > 2 ? ` · streak ${s.streak}` : ''}` : `<span class="miss">No points</span>${res.why ? ` · ${res.why}` : ' · marked fuzzy'}`;
      if (res.auto && res.clean) { const id = setTimeout(next, res.delay || 700); cleanup = () => clearTimeout(id); ctx.buttons([{ label: 'Next', kind: 'go', on: next }]); return; }
      const btns = [];
      if (res.show && !revealed) btns.push({ label: 'Show answer', kind: 'ghost', on: () => { ctx.reveal(res.show()); ctx.buttons([{ label: 'Next', kind: 'go', on: next }]); } });
      btns.push({ label: s.asked >= s.n || Date.now() > s.until ? 'Finish' : 'Next', kind: 'go', on: next });
      ctx.buttons(btns);
    },
    next,
  };
  const prevCleanup = cleanup;
  cleanup = () => { prevCleanup(); if (clockT) clearInterval(clockT); if (cdT) cancelAnimationFrame(cdT); if (ctx.onLeave) ctx.onLeave(); };
  mode.mount(q, $('body'), ctx);
}

// ---------- metronome and drone ----------
function toolsHTML(mode, cfg) {
  if (!mode.tools) return '';
  const t = cfg.tools;
  return `<div class="tools">
    ${mode.tools.metro ? `<button class="tog ${t.metro ? 'on' : ''}" id="tmetro">Click</button>
      <button class="sq" id="tdown">−</button><span class="bpm" id="tbpm">${t.bpm}</span><button class="sq" id="tup">+</button>
      <button class="tog small ${t.up ? 'on' : ''}" id="tauto" title="Speed up 4 after each clean answer">+4</button>` : ''}
    ${mode.tools.drone ? `<button class="tog ${t.drone ? 'on' : ''}" id="tdrone">Drone</button><button class="tog small ${t.fifth ? 'on' : ''}" id="tfifth">+5th</button>` : ''}
  </div>`;
}
function bindTools(mode, cfg, q) {
  if (!mode.tools) { A.stopDrone(); A.stopMetronome(); return; }
  const t = cfg.tools, $ = (id) => $app.querySelector('#' + id);
  const persist = () => { if (!SES.fuzzyOnly) saveCfg(SES.mode, cfg); };
  const metro = () => { if (t.metro) { if (!A.metronomeOn()) A.startMetronome({ bpm: t.bpm, meter: '4/4' }); else A.setMetronomeBpm(t.bpm); } else A.stopMetronome(); };
  const drone = () => { if (t.drone && q.droneMidi != null) A.startDrone(q.droneMidi, t.fifth); else A.stopDrone(); };
  if (mode.tools.metro) {
    $('tmetro').onclick = () => { A.unlockAudio(); t.metro = !t.metro; $('tmetro').classList.toggle('on', t.metro); persist(); metro(); };
    const bump = (d) => { t.bpm = Math.max(30, Math.min(240, t.bpm + d)); $('tbpm').textContent = t.bpm; A.setMetronomeBpm(t.bpm); persist(); };
    $('tdown').onclick = () => bump(-2); $('tup').onclick = () => bump(2);
    $('tauto').onclick = () => { t.up = !t.up; $('tauto').classList.toggle('on', t.up); persist(); };
  } else A.stopMetronome();
  if (mode.tools.drone) {
    $('tdrone').onclick = () => { A.unlockAudio(); t.drone = !t.drone; $('tdrone').classList.toggle('on', t.drone); persist(); drone(); };
    $('tfifth').onclick = () => { t.fifth = !t.fifth; $('tfifth').classList.toggle('on', t.fifth); persist(); drone(); };
  } else A.stopDrone();
  metro();
  // the drone follows the question's key; leave it ringing when the key hasn't changed
  if (t.drone && q.droneMidi != null) { if (!(A.droneOn() && lastDrone === q.droneMidi + ':' + t.fifth)) drone(); }
  else A.stopDrone();
  lastDrone = t.drone ? q.droneMidi + ':' + t.fifth : null;
}
let lastDrone = null;
function stopAll() { cleanup(); cleanup = () => {}; A.stopMetronome(); A.stopDrone(); A.stopPlayer(); lastDrone = null; }

// ---------- summary ----------
function summary() {
  stopAll();
  const s = SES;
  const key = `${s.fuzzyOnly ? 'fuzzy:' : ''}${s.mode.id}:${s.cfg.len}`;
  const prev = S.best[key] || 0;
  const record = s.points > prev;
  if (record) { S.best[key] = s.points; }
  S.sessions = [{ mode: s.mode.id, at: Date.now(), points: s.points, asked: s.asked, clean: s.clean }, ...S.sessions].slice(0, 100);
  C.save();
  const list = (m) => [...m.values()].map((l) => `<li>${esc(l)}</li>`).join('');
  $app.innerHTML = `
    <header class="top"><h1>${s.points.toLocaleString()} points</h1>
      <div class="sub">${s.clean} of ${s.asked} clean · best streak ${s.best}${record && s.asked ? ' · <b class="good">a new best</b>' : prev ? ` · best ${prev.toLocaleString()}` : ''}</div></header>
    ${s.newFuzzy.size ? `<div class="card"><div class="ol">Now fuzzy</div><ul class="list">${list(s.newFuzzy)}</ul></div>` : ''}
    ${s.cleared.size ? `<div class="card"><div class="ol">Cleared from fuzzy</div><ul class="list good">${list(s.cleared)}</ul></div>` : ''}
    <div class="row wide">
      <button class="big go" id="again">Again</button>
      ${C.fuzzyItems().length ? `<button class="big warn" id="fz">Fuzzy</button>` : ''}
      <button class="big ghost" id="home">Home</button>
    </div>`;
  $app.querySelector('#again').onclick = () => start(s.mode, s.cfg, s.fuzzyOnly, s.allModes);
  $app.querySelector('#home').onclick = home;
  const f = $app.querySelector('#fz'); if (f) f.onclick = fuzzy;
}

// ---------- fuzzy ----------
function fuzzy() {
  stopAll();
  const fz = C.fuzzyItems();
  const weak = C.weakKeys();
  $app.innerHTML = `
    <header class="top"><button class="back" id="back">‹ Home</button><h1>Fuzzy material</h1>
      <div class="sub">${fz.length ? 'Weakest first. An item leaves after three clean answers on different days.' : 'Nothing fuzzy yet. Reveals and wrong answers land here.'}</div></header>
    ${fz.length ? `<div class="row wide"><button class="big go" id="all">Work on all ${fz.length}</button></div>` : ''}
    ${weak.length ? `<div class="card"><div class="ol">Weak keys (they come up more)</div><div class="chips">${weak.map((pc) => `<span class="chip on">${C.keyLabel(pc)}</span>`).join('')}</div></div>` : ''}
    ${MODES.map((m) => {
      const items = fz.filter((x) => x.mode === m.id);
      if (!items.length) return '';
      return `<div class="card"><div class="ol">${esc(m.title)} · ${items.length}</div><ul class="list">${items.slice(0, 40).map((x) => `<li>${esc(x.label)}<small>${x.miss} miss${x.miss === 1 ? '' : 'es'}${x.cleanDays.length ? ` · clean ${x.cleanDays.length}/3` : ''}</small></li>`).join('')}</ul>
        <button class="big warn" data-m="${m.id}">Work on these</button></div>`;
    }).join('')}`;
  $app.querySelector('#back').onclick = home;
  const all = $app.querySelector('#all');
  if (all) all.onclick = () => { A.unlockAudio(); start(MODES.find((m) => fz.some((x) => x.mode === m.id)), { ...cfgFor(shapes), len: '20' }, true, true); };
  $app.querySelectorAll('[data-m]').forEach((b) => (b.onclick = () => { A.unlockAudio(); const m = BY[b.dataset.m]; start(m, cfgFor(m), true); }));
}

// ---------- settings ----------
function settings() {
  stopAll();
  const draw = () => {
    $app.innerHTML = `
      <header class="top"><button class="back" id="back">‹ Home</button><h1>Settings</h1></header>
      <div class="card"><div class="ol">Key weights</div><p class="note">How often each key comes up (0 = never). Keys that keep needing reveals come up more on top of this.</p>
        ${C.KEY_ORDER.map((pc) => `<div class="kw"><b>${C.keyLabel(pc)}</b><button class="sq" data-k="${pc}" data-d="-1">−</button><span class="bar"><i style="width:${(S.weights[pc] ?? 0) * 20}%"></i></span><span class="n">${S.weights[pc] ?? 0}</span><button class="sq" data-k="${pc}" data-d="1">+</button></div>`).join('')}
        <div class="row"><button class="ghost" id="wdef">Back to the defaults</button></div></div>
      <div class="card"><div class="ol">Progress</div><p class="note">${Object.keys(S.items).length} items practised · ${S.sessions.length} sessions.</p>
        <div class="row"><button class="ghost" id="copy">Copy backup</button><button class="ghost" id="paste">Restore backup</button><button class="ghost danger" id="reset">Reset progress</button></div></div>`;
    $app.querySelector('#back').onclick = home;
    $app.querySelectorAll('[data-k]').forEach((b) => (b.onclick = () => { const pc = b.dataset.k; S.weights[pc] = Math.max(0, Math.min(5, (S.weights[pc] ?? 0) + Number(b.dataset.d))); C.save(); draw(); }));
    $app.querySelector('#wdef').onclick = () => { S.weights = { ...C.DEFAULT_WEIGHTS }; C.save(); draw(); };
    $app.querySelector('#reset').onclick = () => { if (confirm('Clear all scores and fuzzy items? Key weights and setups stay.')) { C.resetProgress(); location.reload(); } };
    $app.querySelector('#copy').onclick = async () => { try { await navigator.clipboard.writeText(JSON.stringify(S)); alert('Copied.'); } catch (e) { prompt('Copy this:', JSON.stringify(S)); } };
    $app.querySelector('#paste').onclick = () => { const t = prompt('Paste a backup:'); if (!t) return; try { const o = JSON.parse(t); localStorage.setItem('fundamentals.v1', JSON.stringify(o)); location.reload(); } catch (e) { alert('That isn’t a backup.'); } };
  };
  draw();
}

// ---------- sounds from anywhere: tap a diagram to hear it ----------
$app.addEventListener('click', (e) => {
  const st = e.target.closest('[data-strum]');
  if (st) { A.unlockAudio(); const c = A.audioCtx(); A.strum(st.dataset.strum.split(',').map(Number), c.currentTime + 0.03, { spread: 0.03 }); return; }
  const pr = e.target.closest('[data-prog]');
  if (pr) { A.unlockAudio(); const c = A.audioCtx(); JSON.parse(pr.dataset.prog).forEach((ch, i) => A.strum(ch, c.currentTime + 0.05 + i * 1.1, { spread: 0.025 })); return; }
  const ar = e.target.closest('[data-arp]');
  if (ar) { A.unlockAudio(); const c = A.audioCtx(); ar.dataset.arp.split(',').map(Number).forEach((m, i) => A.pluck(m, c.currentTime + 0.05 + i * 0.2, { vel: 0.7, dur: 0.5 })); }
});
document.addEventListener('visibilitychange', () => { if (document.hidden) { A.stopMetronome(); } });

home();
if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
