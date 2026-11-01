import * as T from './theory.js';
import * as A from './audio.js';
import { loadLibrary, savePack } from './library.js';
import { instantiate, fill } from './cards.js';
import { compile, chartChords, chordLabel, asKey } from './demo.js';
import { fretboardSVG, md, esc, rhythmHTML, chordBoxSVG, CHORDBOX_LEGEND } from './render.js';
import { makeQuiz, PC_NAMES } from './quiz.js';
import * as AD from './adapt.js';
import { substitutions } from './subs.js';
import { contextFor, chordScaleContext, modeOrigin } from './context.js';
import { howToPlay } from './rhythm.js';
import { EAR_LEVELS, PASS, gymQuestion } from './eargym.js';
import { WORKOUTS } from './workouts.js';
import { PG_LEVELS, PG_PASS, pgRound, playSeq, chordName } from './proggame.js';
import { CHEATS, cheatsFor } from './cheats.js';

const $app = document.getElementById('app');
let LIB = null;
let VIEW = 'home';
let SESSION = null;
let CARD = null; // current card UI state
let PLAYER = null;
const st = () => AD.state();

// ---------- utils ----------
const qs = (s, el = document) => el.querySelector(s);
const qsa = (s, el = document) => [...el.querySelectorAll(s)];
function toast(msg) { const d = document.createElement('div'); d.className = 'toast'; d.textContent = msg; document.body.appendChild(d); setTimeout(() => d.remove(), 1800); }
const lvlDots = (l) => `<span class="lvl" title="level ${l.toFixed(1)}">${[...Array(10)].map((_, i) => `<i class="${i < Math.round(l) ? 'f' : ''}"></i>`).join('')}</span>`;
const MODE_META = { play: ['🎸', 'Play'], ear: ['🎧', 'Ear'], theory: ['🧠', 'Theory'] };
document.addEventListener('pointerdown', () => { A.unlockAudio().catch(() => {}); }, { once: false, passive: true });
let wakeLock = null;
async function keepAwake(on) {
  try {
    if (on && 'wakeLock' in navigator && !wakeLock) wakeLock = await navigator.wakeLock.request('screen');
    if (!on && wakeLock) { await wakeLock.release(); wakeLock = null; }
  } catch (e) { /* */ }
}

// ---------- neck player ----------
class NeckPlayer {
  constructor(el, compiled, { bpm = 80, title = '' } = {}) {
    this.el = el; this.c = compiled; this.bpm = bpm; this.loops = 1; this.speed = 1; this.frame = -1;
    // rhythms: click and count-in on by default so you always hear where the beat is
    this.click = !!compiled.rhythm; this.countIn = !!compiled.rhythm; this.turn = false;
    if (compiled.rhythm) this.loops = 3;
    this.title = title;
    this.render();
  }
  render() {
    const c = this.c;
    this.el.innerHTML = `<div class="watch">
      ${c.rhythm ? `<div class="rh"></div>` : ''}
      <div class="cap"></div><div class="neck"></div><div class="big"></div>
      ${this.len() > 0 ? `<div class="scrubrow"><input type="range" class="scrub" min="0" max="${this.len()}" step="0.25" value="${this.pos || 0}" aria-label="Position in the demo"><span class="scrubpos small muted"></span></div>` : ''}
      <div class="ctrl">
        <button data-w="play" class="primary">▶ Play</button>
        <button data-w="loops">${this.loopLabel()}</button>
        <button data-w="speed">${this.speed}×</button>
        <button data-w="click" class="${this.click ? 'on' : ''}">Click</button>
        ${c.rhythm ? `<button data-w="turn" class="${this.turn ? 'on' : ''}">Your turn</button><button data-w="count" class="${this.countIn ? 'on' : ''}">Count-in</button>` : ''}
        <span class="muted small grow" style="text-align:right">${Math.round(this.bpm * this.speed)} bpm</span>
      </div>
      ${c.rhythm ? `<p class="muted small turnnote">${this.turn ? 'Your turn: the demo plays a bar, then <b>you</b> play the next bar with only the click (cursor keeps moving). Repeats 4×.' : 'Tip: “Your turn” alternates demo bars with bars for you to play.'}</p>` : ''}
      </div>`;
    if (c.rhythm) qs('.rh', this.el).innerHTML = rhythmHTML(c.rhythm);
    this.frame = -1;
    this.showFrame(0);
    if (this.pos) this.showAt(this.pos);
    const sc = qs('.scrub', this.el);
    if (sc) {
      sc.oninput = () => { if (PLAYER === this && A.playing()) { this.resume = true; A.stopPlayer(); this.stopped(); } this.showAt(Number(sc.value)); };
      sc.onchange = () => { if (this.resume) { this.resume = false; this.play(Number(sc.value)); } };
    }
    this.updatePos(this.pos || 0);
    this.el.onclick = (e) => {
      const b = e.target.closest('[data-w]'); if (!b) return;
      const w = b.dataset.w;
      if (w === 'play') { if (A.playing() && PLAYER === this) this.stop(); else this.play(); }
      if (w === 'loops') { this.loops = { 1: 3, 3: 99, 99: 1 }[this.loops]; b.textContent = this.loopLabel(); }
      if (w === 'speed') { this.speed = { 1: 0.5, 0.5: 0.75, 0.75: 1.25, 1.25: 1 }[this.speed]; this.render(); }
      if (w === 'click') { this.click = !this.click; b.classList.toggle('on', this.click); }
      if (w === 'turn') { this.turn = !this.turn; this.render(); }
      if (w === 'count') { this.countIn = !this.countIn; b.classList.toggle('on', this.countIn); }
    };
  }
  loopLabel() { return this.loops === 99 ? 'Loop ∞' : `×${this.loops}`; }
  len() { const ev = this.c.events || []; return ev.length ? Math.max(this.c.length || 0, ...ev.map((e) => e.beat + (e.dur || 0))) : 0; }
  updatePos(b) {
    this.pos = b;
    const bpb = this.c.beatsPerBar || 4;
    const sc = qs('.scrub', this.el); if (sc && document.activeElement !== sc) sc.value = b;
    const lab = qs('.scrubpos', this.el); if (lab) lab.textContent = `bar ${Math.floor(b / bpb) + 1} · beat ${Math.floor(b % bpb) + 1}`;
  }
  // show the moment at beat b (last event that has started by then)
  showAt(b) {
    const ev = (this.c.events || []).filter((e) => e.beat <= b + 1e-6).pop() || (this.c.events || [])[0];
    if (ev) {
      this.showFrame(ev.frame ?? 0, ev.hl, ev);
      if (this.c.rhythm && ev.slot != null) qsa('.rslot, .cnum', this.el).forEach((s) => s.classList.toggle('cur', Number(s.dataset.i) === ev.slot));
      const big = qs('.big', this.el);
      if (big && !this.c.rhythm) big.textContent = ev.kind === 'note' && ev.hl && ev.hl.length === 1 ? (qs(`.dot[data-k="${ev.hl[0]}"] text`, this.el)?.textContent || '') : '';
    }
    this.updatePos(b);
  }
  showFrame(i, hl = null, ev = null) {
    const f = this.c.frames[i];
    if (!f) { qs('.neck', this.el).innerHTML = ''; return; }
    if (i !== this.frame || f.live) {
      const dots = f.live && hl ? hl.map((k) => { const [s, fr] = k.split(':').map(Number); return { string: s, fret: fr, label: '', kind: 'tone' }; }) : f.dots;
      const lo = this.c.perFrame ? f.lo : (this.c.lo ?? f.lo);
      const hi = this.c.perFrame ? f.hi : (this.c.hi ?? f.hi);
      qs('.neck', this.el).innerHTML = fretboardSVG({ lo, hi: Math.min(17, Math.max(hi, lo + 4)), dots });
      this.frame = i;
    }
    qs('.cap', this.el).textContent = (ev && ev.label) || f.caption || this.title || '';
    qsa('.dot', this.el).forEach((d) => d.classList.remove('on'));
    if (hl) {
      const set = new Set(hl);
      qsa('.dot', this.el).forEach((d) => { if (set.has(d.dataset.k)) d.classList.add('on'); });
      if (!f.live) qsa('.dot', this.el).forEach((d) => d.classList.toggle('dim', !set.has(d.dataset.k) && hl.length > 0 && hl.length < 3 ? false : false));
    }
  }
  play(from = 0) {
    stopAll();
    PLAYER = this;
    qs('[data-w=play]', this.el).textContent = '■ Stop';
    // wake the audio engine first; scheduling against a sleeping clock is what makes demos silent on iPhone
    A.unlockAudio().then(() => A.ensureRunning()).then(() => { if (PLAYER === this) this.start(from); });
  }
  start(from = 0) {
    const bpm = this.bpm * this.speed;
    const bpb = this.c.beatsPerBar || 4;
    const turn = this.turn && this.c.rhythm;
    const L = this.len();
    if (turn || from >= L - 1e-6) from = 0;
    // start mid-way: play the rest of this pass, then any remaining full loops
    let events = this.c.events.map((e) => ({ ...e, _b: e.beat }));
    let loops = turn ? 8 : this.loops;
    if (from > 0) {
      const tail = events.filter((e) => e.beat >= from - 1e-6).map((e) => ({ ...e, beat: e.beat - from }));
      const extra = loops === 99 ? 30 : loops - 1;
      events = tail.concat(...[...Array(Math.max(0, extra)).keys()].map((k) => this.c.events.map((e) => ({ ...e, _b: e.beat, beat: e.beat + (L - from) + k * L }))));
      loops = 1;
    }
    A.playEvents(events, {
      bpm, loops, countIn: this.countIn && from === 0 ? Math.min(bpb, 6) : 0, clickTrack: this.click || turn,
      beatsPerBar: bpb, clickAccents: this.c.clickAccents || [0],
      silentPasses: turn ? (pass) => pass % 2 === 1 : null,
      sound: 'guitar',
      onCount: (n, of) => { const big = qs('.big', this.el); if (big) big.textContent = `count-in ${n}…`; },
      onEvent: (e) => {
        if (e._b != null) this.updatePos(e._b);
        this.showFrame(e.frame ?? 0, e.silent ? null : e.hl, e);
        const big = qs('.big', this.el);
        if (big) big.textContent = e.silent ? '🎸 Your turn' : this.c.rhythm ? '' : e.kind === 'note' && e.hl && e.hl.length === 1 ? (qs(`.dot[data-k="${e.hl[0]}"] text`, this.el)?.textContent || '') : '';
        if (this.c.rhythm && e.slot != null) {
          qsa('.rslot', this.el).forEach((s) => s.classList.toggle('cur', Number(s.dataset.i) === e.slot));
          qsa('.cnum', this.el).forEach((s) => s.classList.toggle('cur', Number(s.dataset.i) === e.slot));
        }
      },
      onDone: () => { this.stopped(); if (this.onFinish) this.onFinish(); },
    });
  }
  stop() { A.stopPlayer(); this.stopped(); }
  stopped() { if (PLAYER === this) PLAYER = null; const b = qs('[data-w=play]', this.el); if (b) b.textContent = '▶ Play'; qsa('.rslot.cur, .cnum.cur', this.el).forEach((s) => s.classList.remove('cur')); const big = qs('.big', this.el); if (big && this.c.rhythm) big.textContent = ''; }
}
function stopAll() { if (PLAYER) PLAYER.stop(); A.stopPlayer(); }
// leaving a screen: nothing keeps sounding (demos, quiz audio, metronome, drone, timers)
function silence() { if (PLAYER) PLAYER.stopped(); PLAYER = null; A.hush(); qsa('.tbtn.on').forEach((b) => b.classList.remove('on')); }

// ---------- sheet (concepts etc.) ----------
const sheetStack = [];
function openSheet(title, renderFn) {
  silence();
  sheetStack.push({ title, renderFn });
  drawSheet();
}
function drawSheet() {
  const top = sheetStack[sheetStack.length - 1];
  const sh = qs('#sheet');
  if (!top) { sh.classList.add('hidden'); return; }
  sh.classList.remove('hidden');
  qs('#sheet-title').textContent = top.title;
  qs('#sheet-back').style.visibility = sheetStack.length > 1 ? 'visible' : 'hidden';
  const body = qs('#sheet-body');
  body.innerHTML = '';
  top.renderFn(body);
  qs('.sheet-inner').scrollTop = 0;
}
qs('#sheet-back').onclick = () => { silence(); sheetStack.pop(); drawSheet(); };
qs('#sheet-close').onclick = () => { silence(); sheetStack.length = 0; drawSheet(); };
qs('#sheet').addEventListener('click', (e) => { if (e.target.id === 'sheet') { silence(); sheetStack.length = 0; drawSheet(); } });

function conceptLinks(ids) {
  const list = (ids || []).filter((id) => LIB.concepts.has(id));
  if (!list.length) return '';
  return `<div class="links">${list.map((id) => `<button data-concept="${esc(id)}">📖 ${esc(LIB.concepts.get(id).title)}</button>`).join('')}</div>`;
}
document.addEventListener('click', (e) => {
  const ch = e.target.closest('[data-cheat]');
  if (ch) { e.stopPropagation(); openCheat(ch.dataset.cheat, CARD && VIEW === 'card' && CARD.card.ctx.root ? T.noteName(CARD.card.ctx.root) : 'C'); return; }
  const b = e.target.closest('[data-concept]');
  if (b) { e.stopPropagation(); openConcept(b.dataset.concept); }
});
function openConcept(id) {
  const c = LIB.concepts.get(id);
  if (!c) return toast('Concept not found');
  openSheet(c.title, (body) => {
    body.innerHTML = `<div class="md">${md(c.body)}</div><div class="cvis"></div><div class="cwatch"></div>${conceptLinks(c.see)}`;
    if (c.visual) {
      try {
        const comp = compile(normalizeSpec(c.visual));
        qs('.cvis', body).innerHTML = comp.html;
        if (comp.events.length) new NeckPlayer(qs('.cwatch', body), comp, { bpm: 80 });
      } catch (err) { qs('.cvis', body).innerHTML = `<p class="muted small">(diagram unavailable: ${esc(err.message)})</p>`; }
    }
  });
}
// specs in concepts/analyses may contain literal values only
const normalizeSpec = (s) => s;
function openCheatList() {
  openSheet('Cheat sheets', (body) => {
    body.innerHTML = `<div class="list">${Object.entries(CHEATS).filter(([id]) => id !== 'tgsymbols' || LIB.tg).map(([id, c]) => `<button class="item" data-cheat="${id}"><span>${esc(c.title)}</span><span>›</span></button>`).join('')}</div>`;
  });
}
function openCheat(id, key = 'C') {
  const c = CHEATS[id]; if (!c) return;
  openSheet(c.title, (body) => {
    const draw = (k) => {
      let html = '';
      try { html = c.html(k, LIB); } catch (err) { html = `<p class="muted small">${esc(err.message)}</p>`; }
      body.innerHTML = (c.keyed ? `<div class="row"><span class="muted small">Key / root</span><select id="cheatkey" style="width:auto">${T.ROOTS.map((r) => `<option ${r === k ? 'selected' : ''}>${r}</option>`).join('')}</select></div>` : '') + `<div class="md cheat">${html}</div>`;
      const sel = qs('#cheatkey', body); if (sel) sel.onchange = (e) => draw(e.target.value);
    };
    draw(T.ROOTS.includes(key) ? key : 'C');
  });
}

// ---------- HOME ----------
function renderHome() {
  VIEW = 'home';
  silence(); keepAwake(false);
  const s = st().settings;
  const prog = AD.progress(LIB);
  const pct = (x) => (prog.total ? Math.round((100 * x) / prog.total) : 0);
  const catsFor = (mode) => AD.CATEGORY_INFO[mode].filter((c) => LIB.templates.some((t) => t.category === c && t.mode === mode));
  const elig = AD.eligible(LIB).length;
  $app.innerHTML = `
  <div class="row spread"><h1>Guitar Cards</h1><button class="icon" data-act="settings">⚙︎</button></div>
  <p class="muted small">${LIB.templates.length} card types · ${LIB.analyses.length} songs · ${LIB.concepts.size} lessons</p>
  <div class="panel">
    <div class="bigmode">${Object.entries(MODE_META).map(([m, [ic, lb]]) => `<button data-mode="${m}" class="${s.modes.includes(m) ? 'on' : ''}"><span>${ic}</span>${lb}</button>`).join('')}</div>
    ${s.modes.map((m) => `<h3>${MODE_META[m][1]} topics <span class="muted small">(none = all)</span></h3><div class="chips">${catsFor(m).map((c) => `<button class="chip ${(s.cats[m] || []).includes(c) ? 'on' : ''}" data-cat="${m}|${c}">${esc(AD.CAT_LABEL[c] || c)}</button>`).join('')}</div>`).join('')}
    <h3>Card length</h3>
    <div class="seg">${['short', 'medium', 'long', 'mix'].map((l) => `<button data-len="${l}" class="${s.length === l ? 'on' : ''}">${l[0].toUpperCase() + l.slice(1)}</button>`).join('')}</div>
    <h3>Session</h3>
    <div class="seg">${[['cards', 10], ['cards', 20], ['cards', 40], ['min', 15], ['min', 30], ['min', 60]].map(([t, n]) => `<button data-sess="${t}|${n}" class="${s.session.type === t && s.session.n === n ? 'on' : ''}">${n}${t === 'min' ? 'm' : ''}</button>`).join('')}</div>
    <h3>Focus <span class="muted small">— bias toward topics (comma-separated)</span></h3>
    <input type="search" id="focus" placeholder="e.g. drop 2, bossa, altered, triplets" value="${esc(st().focus)}">
    <div class="chips" style="margin-top:8px">${suggestTags().map((t) => `<button class="chip" data-tag="${esc(t)}">${esc(t)}</button>`).join('')}</div>
    <h3>Workouts</h3>
    <div class="navgrid">${WORKOUTS.map((w, i) => `<button data-wo="${w.id}" ${i === 0 ? 'style="grid-column:1/-1"' : ''}><b>${i === 0 ? '📅' : '💪'} ${esc(w.name)}</b><small>${w.steps.length} cards · ~${w.minutes} min</small></button>`).join('')}</div>
    <button class="primary start" data-act="start" ${elig ? '' : 'disabled'}>Start session${elig ? '' : ' (no cards match)'}</button>
    <p class="muted small" style="text-align:center">${elig} card types match these settings</p>
  </div>
  <div class="panel">
    <div class="row spread"><div><div class="ring">${pct(prog.mastered)}%</div><span class="muted small">mastered · ${pct(prog.seen)}% seen</span></div>
    <div class="muted small" style="text-align:right">${prog.mastered}/${prog.total} mastered<br>${prog.seen} seen</div></div>
    ${Object.entries(prog.byCat).sort((a, b) => a[1].mode.localeCompare(b[1].mode)).map(([c, v]) => `<div class="catrow"><span>${esc(AD.CAT_LABEL[c] || c)} <span class="muted small">L${AD.catLevel(c).toFixed(1)}</span></span><div class="bar"><i style="width:${(100 * v.seen) / v.total}%"></i><i class="m" style="width:${(100 * v.mastered) / v.total}%"></i></div><span class="muted small">${v.mastered}/${v.total}</span></div>`).join('')}
  </div>
  <div class="navgrid">
    <button data-act="tg" style="grid-column:1/-1;border-color:var(--accent)"><b>🎹 Ted Greene</b><small>Modern Chord Progressions — every progression, playable in any key</small></button>
    <button data-act="songs"><b>🎼 Songs</b><small>Annotated progressions</small></button>
    <button data-act="toolbox"><b>🧰 Toolbox</b><small>What to play over what</small></button>
    <button data-act="concepts"><b>📖 Lessons</b><small>Concept deep-dives</small></button>
    <button data-act="library"><b>🗂 Library</b><small>Browse every card</small></button>
    <button data-act="cheats" style="grid-column:1/-1"><b>📋 Cheat sheets</b><small>Modes, diatonic chords, chord formulas, intervals, cycle of 4ths, voicings, rhythm…</small></button>
    <button data-act="proggame" style="grid-column:1/-1"><b>🎯 Progression game</b><small>Hear it, spell it — from 2 chords up (level ${(st().pgame?.level ?? 0) + 1}/${PG_LEVELS.length})</small></button>
    <button data-act="eargym" style="grid-column:1/-1"><b>🎧 Ear Gym</b><small>Hear progressions — level by level (${gymPassed()}/${EAR_LEVELS.length} passed)</small></button>
  </div>
  ${LIB.errors.length ? `<p class="muted small">Content not loaded: ${esc(LIB.errors.join('; '))}</p>` : ''}`;
  $app.onclick = (e) => {
    const b = e.target.closest('button'); if (!b) return;
    const S = st().settings;
    if (b.dataset.wo) {
      const w = WORKOUTS.find((x) => x.id === b.dataset.wo);
      // pool steps pick one card each time, so a workout like Daily practice changes day to day
      const steps = w.steps.map((x) => { if (!x.pool) return x; const ok = x.pool.filter((id) => LIB.byId.has(id)); return ok.length ? { ...x, id: ok[Math.floor(Math.random() * ok.length)] } : null; }).filter((x) => x && LIB.byId.has(x.id));
      if (steps.length) startSession(null, { workout: { ...w, steps } });
      return;
    }
    if (b.dataset.mode) { const m = b.dataset.mode; S.modes = S.modes.includes(m) ? S.modes.filter((x) => x !== m) : [...S.modes, m]; if (!S.modes.length) S.modes = [m]; AD.save(); renderHome(); }
    else if (b.dataset.cat) { const [m, c] = b.dataset.cat.split('|'); const l = S.cats[m] || []; S.cats[m] = l.includes(c) ? l.filter((x) => x !== c) : [...l, c]; AD.save(); renderHome(); }
    else if (b.dataset.len) { S.length = b.dataset.len; AD.save(); renderHome(); }
    else if (b.dataset.sess) { const [t, n] = b.dataset.sess.split('|'); S.session = { type: t, n: Number(n) }; AD.save(); renderHome(); }
    else if (b.dataset.tag) { const f = qs('#focus'); f.value = f.value ? f.value + ', ' + b.dataset.tag : b.dataset.tag; st().focus = f.value; AD.save(); }
    else if (b.dataset.act === 'start') { st().focus = qs('#focus').value; AD.save(); startSession(); }
    else if (b.dataset.act === 'songs') renderSongs();
    else if (b.dataset.act === 'tg') renderTG();
    else if (b.dataset.act === 'toolbox') renderToolbox();
    else if (b.dataset.act === 'concepts') renderConcepts();
    else if (b.dataset.act === 'library') renderLibrary();
    else if (b.dataset.act === 'eargym') renderEarGym();
    else if (b.dataset.act === 'proggame') renderProgGame();
    else if (b.dataset.act === 'cheats') openCheatList();
    else if (b.dataset.act === 'settings') renderSettings();
  };
  qs('#focus').onchange = (e) => { st().focus = e.target.value; AD.save(); renderHome(); };
}
function suggestTags() {
  const counts = {};
  for (const t of AD.eligible(LIB, { ...st().settings, cats: {}, length: 'mix' })) for (const g of t.tags || []) counts[g] = (counts[g] || 0) + 1;
  return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 14).map(([g]) => g);
}

// ---------- SESSION ----------
function startSession(onlyTpl = null, extra = {}) {
  SESSION = { cards: [], seen: new Set(), queue: [], start: Date.now(), results: [], only: onlyTpl, ...extra, levels0: { ...Object.fromEntries(Object.keys(AD.CAT_LABEL).map((c) => [c, AD.catLevel(c)])) } };
  st().sessions++; AD.save();
  keepAwake(true);
  nextCard();
}
function sessionDone() {
  const s = st().settings.session;
  if (SESSION.workout) return SESSION.cards.length >= SESSION.workout.steps.length;
  if (SESSION.only) return SESSION.cards.length >= 6;
  if (s.type === 'cards') return SESSION.cards.length >= s.n;
  return Date.now() - SESSION.start >= s.n * 60000;
}
function nextCard() {
  silence();
  if (SESSION.cards.length && sessionDone()) return renderSummary();
  let card = null;
  const dueIdx = SESSION.queue.findIndex((q) => q.at <= SESSION.cards.length);
  try {
    if (dueIdx >= 0) {
      const q = SESSION.queue.splice(dueIdx, 1)[0];
      card = instantiate(q.from.tpl, AD.variantChooser(q.from, q.dir));
      card.followUp = q.dir > 0 ? (q.tempoOnly ? 'Same exercise — faster' : 'Same exercise — one notch harder') : (q.tempoOnly ? 'Same exercise — slower' : 'Same exercise — a bit easier');
    } else {
      const wstep = SESSION.workout ? SESSION.workout.steps[SESSION.cards.length] : null;
      const tpl = wstep ? LIB.byId.get(wstep.id) : SESSION.only ? SESSION.only : AD.pickTemplate(LIB, SESSION);
      if (!tpl) { toast('No cards match your settings'); return renderHome(); }
      card = instantiate(tpl, AD.paramChooser(tpl), (wstep && wstep.params) || {});
      if (wstep) card.followUp = `${SESSION.workout.name} · ${SESSION.cards.length + 1}/${SESSION.workout.steps.length} — ${wstep.why}`;
    }
  } catch (err) {
    console.error(err);
    SESSION.seen.add(card?.id || 'x');
    return nextCard();
  }
  SESSION.cards.push(card);
  SESSION.seen.add(card.id);
  CARD = { card, help: 0, hint: 0, t0: Date.now(), tempo: AD.startTempo(card), quiz: null, answered: false, rated: false };
  card.tempoNow = CARD.tempo;
  try { CARD.quiz = makeQuiz(card, LIB); } catch (err) { console.error(err); CARD.quiz = null; }
  if (card.quiz && !CARD.quiz && SESSION.cards.length < 200) { SESSION.cards.pop(); return nextCard(); }
  renderCard();
  const S = st().settings;
  if (S.metronomeAuto && (card.metronome || card.tempo) && card.tpl.mode === 'play') startMetro();
  if (S.droneAuto && card.drone) startDroneFor();
}
function cardBpm() { return CARD.tempo || (CARD.card.tempo && CARD.card.tempo.start) || 80; }
function startMetro() {
  const m = CARD.card.metronome || {};
  A.startMetronome({ bpm: cardBpm(), meter: m.meter || '4/4', subdivision: m.subdivision || 1, swing: m.swing || 0, accent: m.accent !== false, gap: m.gap, clickOn: m.clickOn, accentBeats: m.accentBeats,
    onBeat: ({ beat, gap }) => { qsa('.beatdots i').forEach((d, i) => d.classList.toggle('on', i === beat && !gap)); } });
  const b = qs('[data-c=metro]'); if (b) b.classList.add('on');
}
function droneMidi() {
  const d = CARD.card.drone || {};
  let n = d.note ? asKey(String(d.note)).tonic : CARD.card.ctx.root;
  const pc = T.notePc(n);
  return 40 + ((pc - 40) % 12 + 12) % 12;
}
function startDroneFor() { A.startDrone(droneMidi(), (CARD.card.drone || {}).fifth !== false); const b = qs('[data-c=drone]'); if (b) b.classList.add('on'); }

function renderCard() {
  VIEW = 'card';
  const { card } = CARD;
  const tpl = card.tpl;
  const n = SESSION.cards.length;
  const total = SESSION.workout ? `/${SESSION.workout.steps.length}` : SESSION.only ? '' : st().settings.session.type === 'cards' ? `/${st().settings.session.n}` : ` · ${Math.round((Date.now() - SESSION.start) / 60000)}/${st().settings.session.n}m`;
  const hasTransport = tpl.mode === 'play' && (card.tempo || card.metronome || card.drone || tpl.category === 'improv' || tpl.category === 'scales');
  const hasDemo = !!card.demo;
  const hasHelp = (tpl.hints && tpl.hints.length) || tpl.explain || card.visual || (tpl.concepts && tpl.concepts.length);
  const m = card.metronome || {};
  const beats = A.meter(m.meter || '4/4').beats;
  $app.innerHTML = `
  <div class="cardtop"><button class="icon" data-c="end" aria-label="End session">✕</button>
    <span class="catchip">${MODE_META[tpl.mode][0]} ${esc(AD.CAT_SHORT[tpl.category] || tpl.category)}</span>${lvlDots(card.level)}
    <span class="grow"></span><span class="count">${n}${total}</span>
    <button class="icon" data-c="less" title="Less like this">👎</button><button class="icon" data-c="more" title="More like this">👍</button></div>
  ${card.followUp ? `<span class="badge">${esc(card.followUp)}</span>` : ''}
  <h2>${esc(card.text(tpl.title))}</h2>
  <div class="prompt md">${md(card.text(tpl.prompt))}</div>
  ${tpl.goal ? `<div class="goal">🎯 ${esc(card.text(tpl.goal))}</div>` : ''}
  ${tpl.link ? `<a class="linkbtn" style="display:block;text-align:center;padding:12px;margin:8px 0;border:1px solid var(--accent);border-radius:12px;color:var(--accent);text-decoration:none;font-weight:600" href="${esc(tpl.link)}" target="_blank" rel="noopener">📄 Open the lesson sheet</a>` : ''}
  ${hasTransport ? `<div class="transport">
     ${card.tempo || card.metronome ? `<button class="tbtn" data-c="slower">−</button><div class="bpm">${cardBpm()}<small>bpm</small></div><button class="tbtn" data-c="faster">+</button>
     <button class="tbtn ${A.metronomeOn() ? 'on' : ''}" data-c="metro">🥁 Click</button>` : ''}
     <button class="tbtn ${A.droneOn() ? 'on' : ''}" data-c="drone">◉ Drone ${esc(T.noteName(T.noteFromPc(droneMidi() % 12), true))}</button>
     ${card.tempo || card.metronome ? `<div class="beatdots">${[...Array(beats)].map(() => '<i></i>').join('')}</div>` : ''}
     ${m.subdivision > 1 || m.swing || m.gap || (m.meter && m.meter !== '4/4') ? `<div class="muted small" style="width:100%">${[m.meter, m.subdivision > 1 ? `${{ 2: '8ths', 3: 'triplets', 4: '16ths', 6: 'sextuplets' }[m.subdivision] || m.subdivision} clicked` : '', m.swing ? 'swing' : '', m.gap ? `gap click ${m.gap.play} on / ${m.gap.mute} off` : '', m.clickOn === '2&4' ? 'click on 2 & 4' : ''].filter(Boolean).join(' · ')}</div>` : ''}
   </div>` : ''}
  <div id="quiz"></div>
  <div class="actions">
    ${hasDemo ? `<button data-c="watch">👁 Watch it</button>` : ''}
    ${hasHelp ? `<button data-c="help">💡 ${CARD.help ? 'More help' : 'Help'}</button>` : ''}
  </div>
  <div id="watch"></div>
  <div id="help"></div>
  <div class="rate" id="rate"></div>`;
  drawQuiz();
  drawRate();
  drawHelp();
  $app.onclick = onCardClick;
}
function onCardClick(e) {
  const b = e.target.closest('[data-c]'); if (!b) return;
  const c = b.dataset.c;
  if (c === 'end') { renderSummary(); }
  else if (c === 'more' || c === 'less') { AD.nudge(CARD.card, c === 'more' ? 1 : -1); toast(c === 'more' ? 'More like this 👍' : 'Less like this 👎'); }
  else if (c === 'faster' || c === 'slower') {
    const t = CARD.card.tempo || { step: 5, min: 30, max: 240 };
    const step = t.step || 5;
    CARD.tempo = Math.max(t.min ?? 30, Math.min(t.max ?? 260, cardBpm() + (c === 'faster' ? step : -step)));
    CARD.card.tempoNow = CARD.tempo;
    qs('.bpm').innerHTML = `${CARD.tempo}<small>bpm</small>`;
    A.setMetronomeBpm(CARD.tempo);
    if (PLAYER) PLAYER.bpm = CARD.tempo;
  }
  else if (c === 'metro') { if (A.metronomeOn()) { A.stopMetronome(); b.classList.remove('on'); } else startMetro(); }
  else if (c === 'drone') { if (A.droneOn()) { A.stopDrone(); b.classList.remove('on'); } else startDroneFor(); }
  else if (c === 'watch') { toggleWatch(); }
  else if (c === 'help') { CARD.help++; drawHelp(true); b.textContent = '💡 More help'; }
  else if (c === 'skip') skipCard();
  else if (c.startsWith('rate')) rateCard(Number(c.slice(4)));
  else if (c === 'next') advance();
  else if (c === 'ctxplay') playContext(Number(b.dataset.i));
}
function toggleWatch() {
  const el = qs('#watch');
  if (el.innerHTML) { stopAll(); el.innerHTML = ''; return; }
  try {
    const comp = compile(CARD.card.demo);
    CARD.watched = true;
    if (!comp.events.length) { el.innerHTML = `<div class="watch">${comp.html}</div>`; return; }
    const p = new NeckPlayer(el, comp, { bpm: Math.min(cardBpm(), 140), title: CARD.card.text(CARD.card.tpl.title) });
    p.play();
  } catch (err) { console.error(err); el.innerHTML = `<p class="muted small">Demo unavailable: ${esc(err.message)}</p>`; }
}
function chordScaleTable(card) {
  const specs = [card.visual, card.demo].flat().filter(Boolean);
  const sp = specs.find((x) => x.type === 'chordScale');
  if (!sp) return '';
  let t = null;
  try { t = chordScaleContext(sp); } catch (e) { t = null; }
  if (!t) return '';
  return `<div class="ctxbox"><div class="ctxh">🎵 ${esc(t.title)}</div>
    ${t.scaleChange.length ? `<p class="small">Notes that differ from the major scale: <b>${t.scaleChange.map(T.prettyIv).join(' ')}</b></p>` : '<p class="small">This is the major scale itself.</p>'}
    <table><tr><th>Chord</th><th>vs major</th><th>Function</th></tr>${t.rows.map((r) => `<tr><td><b>${esc(T.prettyRoman(r.roman))}</b><br>${esc(r.chord)}</td><td class="small">${r.same ? '<span class="muted">same</span>' : `${esc(T.prettyRoman(r.droman))} ${esc(r.diatonic)}<br><span style="color:var(--accent)">changed: ${esc(r.changed.join(' '))}</span>`}</td><td class="small">${esc(r.fn)}</td></tr>`).join('')}</table></div>`;
}
function rhythmGuideHTML(card) {
  const specs = [card.visual, card.demo].flat().filter(Boolean);
  const rs = specs.filter((x) => x.type === 'rhythm');
  if (!rs.length) return '';
  const seen = new Set();
  const uniq = rs.filter((r) => { const k = JSON.stringify([r.pattern, r.pick, r.meter, r.grid, r.swing]); if (seen.has(k)) return false; seen.add(k); return true; }).slice(0, 3);
  return uniq.map((r, i) => {
    let body = '';
    try { body = rhythmHTML(r) + `<div class="md">${md(howToPlay(r))}</div>`; } catch (e) { body = ''; }
    return `<div class="ctxbox"><div class="ctxh">🥁 How to play this${uniq.length > 1 ? ` — part ${i + 1}${r.title ? ': ' + esc(r.title) : ''}` : ''}</div>${body}</div>`;
  }).join('');
}
function contextHTML(card) {
  const rg = rhythmGuideHTML(card);
  if (rg) return rg;
  const cs = chordScaleTable(card);
  if (cs) return cs;
  let list = [];
  try { list = contextFor(card); } catch (e) { list = []; }
  CARD.ctxList = list;
  if (!list.length) return '';
  return list.map((c, i) => `<div class="ctxbox"><div class="ctxh">🎵 ${esc(c.heading)}</div>
    <p><b>Sound:</b> ${esc(c.info.sound)}${c.info.colour ? ` <span class="muted">Colour note: ${esc(c.info.colour)}.</span>` : ''}</p>
    <p><b>Job:</b> ${esc(c.info.use)}</p>
    ${c.example ? `<p><b>Example</b> (${esc(c.example.keyLabel)}, as ${esc(T.prettyRoman(c.example.deg))}): ${esc(c.example.names)}</p>` : ''}
    ${c.info.songs ? `<p class="muted small">Heard in: ${esc(c.info.songs)}</p>` : ''}
    ${c.kind === 'scale' ? originHTML(c) : ''}
    ${c.example ? `<button data-c="ctxplay" data-i="${i}">▶ Hear it in context</button><div class="ctxw" id="ctxw${i}"></div>` : ''}</div>`).join('');
}
function originHTML(c) {
  let o = {};
  try { o = modeOrigin(CARD.card.ctx.root, c.example ? c.example.scale : CARD.card.ctx.scale); } catch (e) { return ''; }
  const nb = (o.neighbours || []).map((n) => `<li>${n.up ? 'raise' : 'lower'} the <b>${esc(T.prettyIv(n.from))}</b> → ${esc(T.prettyIv(n.to))}: <b>${esc(n.name)}</b></li>`).join('');
  return (o.parent ? `<p><b>Where it comes from:</b> ${md(o.parent).replace(/^<p>|<\/p>$/g, '')}</p>` : '') +
    (nb ? `<p><b>One note away:</b></p><ul class="small">${nb}</ul>` : '');
}
function playContext(i) {
  const c = CARD.ctxList && CARD.ctxList[i];
  if (!c || !c.example) return;
  const ex = c.example;
  const spec = { type: 'progression', key: ex.key, chart: ex.chart, voiceLead: true };
  if (c.kind === 'scale' && ex.scale) { spec.scales = { [ex.target]: ex.scale }; spec.runs = true; }
  try { const comp = compile(spec); const p = new NeckPlayer(qs('#ctxw' + i), comp, { bpm: 84 }); p.play(); } catch (err) { toast(err.message); }
}
function drawHelp(scroll) {
  const { card } = CARD;
  const tpl = card.tpl;
  const el = qs('#help');
  if (!CARD.help) { el.innerHTML = ''; return; }
  const hints = (tpl.hints || []).map((h) => card.text(h));
  // layer order: hints one at a time, then explanation, then diagrams + concepts
  const nh = Math.min(CARD.help, hints.length);
  const showExplain = CARD.help > hints.length && tpl.explain;
  const showVisual = CARD.help > hints.length + (tpl.explain ? 1 : 0);
  let h = '<div class="helpbox">';
  const cs = cheatsFor(tpl);
  if (cs.length) h += `<div class="links" style="margin:0 0 8px">${cs.map((id) => `<button data-cheat="${id}">📋 ${esc(CHEATS[id].title)}</button>`).join('')}</div>`;
  h += contextHTML(card);
  h += hints.slice(0, nh).map((x, i) => `<div class="hint">💡 ${md(x).replace(/^<p>|<\/p>$/g, '')}</div>`).join('');
  if (showExplain) h += `<div class="md">${md(card.text(tpl.explain))}</div>`;
  if (showVisual || (!hints.length && !tpl.explain)) {
    if (card.visual) { try { h += compile(card.visual).html; } catch (err) { h += `<p class="muted small">Diagram unavailable: ${esc(err.message)}</p>`; } }
    h += conceptLinks(tpl.concepts);
  }
  if (tpl.source && (showExplain || showVisual)) h += `<p class="muted small">Source: ${esc(tpl.source)}</p>`;
  el.innerHTML = h + '</div>';
  const hb = qs('[data-c=help]');
  const maxLayers = hints.length + (tpl.explain ? 1 : 0) + 1;
  if (hb && CARD.help >= maxLayers) hb.disabled = true;
  if (scroll) el.lastElementChild?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ---------- quiz UI ----------
function drawQuiz() {
  const Q = CARD.quiz;
  const el = qs('#quiz');
  if (!Q) { el.innerHTML = ''; return; }
  let h = `<div class="panel"><div class="md"><p>${Q.question || ''}</p></div>`;
  if (Q.play) h += `<button class="primary playbig" data-q="play">▶ ${Q.type === 'audiate' ? 'Starting note' : 'Play'}</button>`;
  if (Q.board && Q.type !== 'tap') h += fretboardSVG({ lo: Q.board.lo, hi: Q.board.hi, dots: Q.board.dots });
  if (Q.type === 'choice') h += `<div class="qgrid ${Q.grid ? 'twelve' : ''}">${Q.choices.map((c, i) => `<button data-q="ans" data-i="${i}">${esc(c)}</button>`).join('')}</div>`;
  if (Q.type === 'notes') h += `<div class="qgrid twelve">${PC_NAMES.map((c, i) => `<button data-q="pc" data-i="${i}">${c}</button>`).join('')}</div><button class="primary" style="width:100%" data-q="check">Check</button>`;
  if (Q.type === 'tap') h += `<div id="tapboard">${fretboardSVG({ lo: Q.board.lo, hi: Q.board.hi, dots: [], tappable: true })}</div><button class="primary" style="width:100%" data-q="check">Check</button>`;
  if (Q.type === 'sequence') h += `<div class="seqout" id="seqout"></div><div class="qgrid twelve">${Q.options.map((o) => `<button data-q="deg" data-v="${esc(o)}">${esc(T.prettyIv(o))}</button>`).join('')}</div><div class="row"><button data-q="undo">⌫ Undo</button><button class="primary grow" data-q="check">Check</button></div>`;
  if (Q.type === 'reveal') h += `<button style="width:100%" data-q="reveal">Show answer</button><div id="revealed"></div>`;
  if (Q.type === 'listen') h += `<div class="md">${md(Q.html)}</div><div id="qneck"></div><p class="muted small">Degrees: ${Q.degrees.map(T.prettyIv).join(' ')}</p>`;
  if (Q.type === 'audiate') h += `<p class="muted small">1) Hear the starting note · 2) Watch the melody and sing it in your head · 3) Reveal and compare.</p><button style="width:100%" data-q="show">👁 Show the melody (silent)</button><div id="qneck"></div><button style="width:100%; margin-top:8px" data-q="revealsound">🔊 Reveal (play it)</button>`;
  h += '<div id="fb"></div></div>';
  el.innerHTML = h;
  CARD.picks = new Set(); CARD.seq = [];
  el.onclick = onQuizClick;
  if (Q.type === 'tap') {
    qs('#tapboard', el).onclick = (e) => {
      const r = e.target.closest('.tap'); if (!r || CARD.answered) return;
      const k = `${r.dataset.s}:${r.dataset.f}`;
      CARD.picks.has(k) ? CARD.picks.delete(k) : CARD.picks.add(k);
      const dots = [...CARD.picks].map((x) => { const [s, f] = x.split(':').map(Number); return { string: s, fret: f, label: '', kind: 'mark' }; });
      qs('#tapboard', el).innerHTML = fretboardSVG({ lo: Q.board.lo, hi: Q.board.hi, dots, tappable: true });
    };
  }
  if (Q.type === 'listen' && Q.placed) qs('#qneck', el).innerHTML = fretboardSVG({ ...neckWin(Q.placed), dots: Q.placed.map((p, i) => ({ string: p.string, fret: p.fret, label: T.prettyIv(Q.degrees[i]), kind: i === 0 ? 'root' : 'tone' })) });
  if (Q.play && Q.type !== 'audiate') A.later(() => { if (CARD && CARD.quiz === Q) Q.play(); }, 350);
}
const neckWin = (placed) => { const fs = placed.map((p) => p.fret); const lo = Math.max(0, Math.min(...fs) - 1); return { lo, hi: Math.max(Math.max(...fs) + 1, lo + 4) }; };
function onQuizClick(e) {
  const b = e.target.closest('[data-q]'); if (!b) return;
  const Q = CARD.quiz;
  const a = b.dataset.q;
  if (a === 'play') { A.hush(); if (Q.type === 'audiate') Q.playStart(); else Q.play(); CARD.replays = (CARD.replays || 0) + 1; return; }
  if (CARD.answered && !['show', 'revealsound'].includes(a)) return;
  if (a === 'ans') {
    const i = Number(b.dataset.i);
    const ok = i === Q.answer;
    qsa('[data-q=ans]').forEach((x, j) => { if (j === Q.answer) x.classList.add('right'); });
    if (!ok) b.classList.add('wrong');
    finishObjective(ok);
  }
  if (a === 'pc') { const i = Number(b.dataset.i); CARD.picks.has(i) ? CARD.picks.delete(i) : CARD.picks.add(i); b.classList.toggle('picked'); }
  if (a === 'deg') { CARD.seq.push(b.dataset.v); qs('#seqout').textContent = CARD.seq.map(T.prettyIv).join('  '); }
  if (a === 'undo') { CARD.seq.pop(); qs('#seqout').textContent = CARD.seq.map(T.prettyIv).join('  '); }
  if (a === 'check') {
    let ok = false;
    if (Q.type === 'notes') { ok = Q.answer.size === CARD.picks.size && [...Q.answer].every((x) => CARD.picks.has(x)); qsa('[data-q=pc]').forEach((x, j) => { if (Q.answer.has(j)) x.classList.add('right'); else if (CARD.picks.has(j)) x.classList.add('wrong'); }); }
    if (Q.type === 'tap') {
      const tg = new Set(Q.targets);
      ok = tg.size === CARD.picks.size && [...tg].every((x) => CARD.picks.has(x));
      const dots = [...new Set([...tg, ...CARD.picks])].map((k) => { const [s, f] = k.split(':').map(Number); return { string: s, fret: f, label: '', kind: tg.has(k) ? (CARD.picks.has(k) ? 'mark' : 'missed') : 'wrong' }; });
      qs('#tapboard').innerHTML = fretboardSVG({ lo: Q.board.lo, hi: Q.board.hi, dots });
    }
    if (Q.type === 'sequence') ok = CARD.seq.length === Q.answer.length && CARD.seq.every((x, i) => x === Q.answer[i]);
    finishObjective(ok);
  }
  if (a === 'reveal') { qs('#revealed').innerHTML = `<div class="md">${md(Q.answerHtml)}</div>`; CARD.answered = true; drawRate(); }
  if (a === 'show') {
    const el = qs('#qneck');
    if (Q.show === 'degrees' || Q.show === 'notes') { el.innerHTML = `<div class="watch"><div class="big" id="audbig"></div></div>`; }
    else el.innerHTML = fretboardSVG({ ...neckWin(Q.placed), dots: Q.placed.map((p) => ({ string: p.string, fret: p.fret, label: '', kind: 'ghost' })) });
    const spb = 60 / Q.bpm;
    Q.melody.notes.forEach((n, i) => A.later(() => {
      if (!CARD || CARD.quiz !== Q) return;
      if (Q.show === 'degrees' || Q.show === 'notes') { const bg = qs('#audbig'); if (bg) bg.textContent = Q.show === 'notes' ? Q.notes[i] : T.prettyIv(Q.degrees[i]); }
      else { qsa('#qneck .dot').forEach((d) => d.classList.remove('on')); const d = qs(`#qneck .dot[data-k="${Q.placed[i].string}:${Q.placed[i].fret}"]`); if (d) d.classList.add('on'); }
    }, n.beat * spb * 1000));
  }
  if (a === 'revealsound') { A.hush(); Q.play(); CARD.answered = true; drawRate(); }
}
function finishObjective(ok) {
  CARD.answered = true;
  CARD.correct = ok;
  const Q = CARD.quiz;
  qs('#fb').innerHTML = `<div class="feedback ${ok ? 'ok' : 'no'}">${ok ? '✓ Correct' : '✗ Not quite'}</div>${Q.explain ? `<p class="small">${esc(Q.explain)}</p>` : ''}`;
  drawRate();
}
function drawRate() {
  const el = qs('#rate');
  if (!el) return;
  const Q = CARD.quiz;
  const objective = Q && ['choice', 'notes', 'tap', 'sequence'].includes(Q.type);
  if (objective) {
    el.className = 'rate one';
    el.innerHTML = CARD.answered ? `<button class="r3" data-c="next">Next →</button>` : `<button data-c="skip">Skip</button>`;
    return;
  }
  if (Q && Q.selfRate && !CARD.answered) { el.className = 'rate one'; el.innerHTML = `<button data-c="skip">Skip</button>`; return; }
  el.className = 'rate';
  el.innerHTML = `<button class="r1" data-c="rate1">Too hard</button><button class="r2" data-c="rate2">Hard</button><button class="r3" data-c="rate3">Good ✓</button><button class="r4" data-c="rate4">Easy</button>`;
}
// Skip = "not now": no rating, no follow-up, and it won't come straight back this session
function skipCard() {
  if (CARD.rated) return;
  CARD.rated = true;
  SESSION.results.push({ card: CARD.card, eff: null, skipped: true });
  nextCard();
}
function rateCard(r) {
  if (CARD.rated) return;
  CARD.rated = true;
  const Q = CARD.quiz;
  const objective = Q && ['choice', 'notes', 'tap', 'sequence'].includes(Q.type);
  const ms = Date.now() - CARD.t0;
  const eff = AD.record(CARD.card, { rating: r, help: CARD.help + (CARD.watched ? 1 : 0), objective: objective && CARD.answered ? { correct: CARD.correct, ms } : null, tempo: CARD.tempo, ms });
  SESSION.results.push({ card: CARD.card, eff, tempo: CARD.tempo });
  scheduleFollowUp(CARD.card, eff);
  nextCard();
}
function advance() { rateCard(3); }
function scheduleFollowUp(card, eff) {
  const tpl = card.tpl;
  const hasVary = (tpl.vary || []).length || tpl.tempo;
  if (!hasVary || SESSION.only || SESSION.workout) return;
  const tempoOnly = !!tpl.tempo && !(tpl.vary || []).some((v) => v !== 'tempo' && tpl.params && tpl.params[v]);
  if (eff >= 3.4 && Math.random() < 0.45) SESSION.queue.push({ from: card, dir: 1, at: SESSION.cards.length + 2 + Math.floor(Math.random() * 3), tempoOnly });
  else if (eff <= 1.8 && Math.random() < 0.6) SESSION.queue.push({ from: card, dir: -1, at: SESSION.cards.length + 1, tempoOnly });
  else if (eff >= 3 && tpl.tempo && Math.random() < 0.2) SESSION.queue.push({ from: card, dir: 1, at: SESSION.cards.length + 3, tempoOnly: true });
}

// ---------- SUMMARY ----------
function renderSummary() {
  VIEW = 'summary';
  silence(); keepAwake(false);
  const res = SESSION ? SESSION.results : [];
  const mins = SESSION ? Math.round((Date.now() - SESSION.start) / 60000) : 0;
  const moved = SESSION ? Object.keys(AD.CAT_LABEL).map((c) => [c, AD.catLevel(c) - (SESSION.levels0[c] ?? AD.catLevel(c))]).filter(([, d]) => Math.abs(d) > 0.05) : [];
  const word = (e) => (e == null ? 'skipped' : e >= 3.5 ? 'easy' : e >= 2.9 ? 'good' : e >= 2 ? 'hard' : 'too hard');
  $app.innerHTML = `<h1>Session done</h1><p class="muted">${res.length} cards · ${mins} min</p>
  ${moved.length ? `<div class="panel"><h3>Level changes</h3>${moved.map(([c, d]) => `<div class="catrow"><span>${esc(AD.CAT_LABEL[c])}</span><span>${d > 0 ? '▲' : '▼'} ${Math.abs(d).toFixed(2)}</span><span class="muted small">L${AD.catLevel(c).toFixed(1)}</span></div>`).join('')}</div>` : ''}
  <div class="panel list">${res.map((r, i) => `<button class="item" data-i="${i}"><span>${esc(r.card.text(r.card.tpl.title))}<br><small>${esc(AD.CAT_LABEL[r.card.tpl.category] || '')}${r.tempo ? ' · ' + r.tempo + ' bpm' : ''}</small></span><span class="badge ${r.eff >= 3 ? 'm' : ''}">${word(r.eff)}</span></button>`).join('')}</div>
  <button class="primary start" data-s="home">Done</button><button class="start" data-s="again">Another session</button>`;
  const prev = SESSION;
  $app.onclick = (e) => { const b = e.target.closest('[data-s]'); if (!b) return; if (b.dataset.s === 'home') (prev && prev.back ? prev.back() : renderHome()); else startSession(prev && prev.only, prev ? { filter: prev.filter, back: prev.back } : {}); };
}

// ---------- LIBRARY ----------
function renderLibrary() {
  VIEW = 'library';
  silence();
  const groups = {};
  for (const t of LIB.templates) (groups[t.category] = groups[t.category] || []).push(t);
  const ts = st().tpl;
  const cats = Object.keys(groups).sort((a, b) => Object.keys(AD.CAT_LABEL).indexOf(a) - Object.keys(AD.CAT_LABEL).indexOf(b));
  $app.innerHTML = `<div class="row"><button class="icon" data-l="back">‹</button><h1>Library</h1></div>
  <input type="search" id="libq" placeholder="Search cards…">
  <div id="libl">${cats.map((c) => `<h3>${esc(AD.CAT_LABEL[c] || c)} <span class="muted small">${groups[c].length}</span></h3><div class="list">${groups[c].sort((a, b) => a.level - b.level).map((t) => `<button class="item" data-t="${esc(t.id)}" data-h="${esc((t.title + ' ' + (t.tags || []).join(' ')).toLowerCase())}"><span>${esc(t.title.replace(/\{p:(\w+)\}|\{(\w+)(:[^}]*)?\}/g, (m, a, b) => '‹' + (a || b) + '›'))}<br><small>L${t.level} · ${t.length || ''} · ${(t.tags || []).slice(0, 4).join(', ')}</small></span><span class="badge ${ts[t.id]?.mastered ? 'm' : ''}">${ts[t.id]?.mastered ? '✓' : ts[t.id]?.n ? ts[t.id].n + '×' : 'new'}</span></button>`).join('')}</div>`).join('')}</div>`;
  $app.onclick = (e) => { const b = e.target.closest('button'); if (!b) return; if (b.dataset.l === 'back') renderHome(); if (b.dataset.t) startSession(LIB.byId.get(b.dataset.t)); };
  qs('#libq').oninput = (e) => { const q = e.target.value.toLowerCase(); qsa('[data-h]').forEach((x) => { x.style.display = !q || x.dataset.h.includes(q) ? '' : 'none'; }); };
}

// ---------- CONCEPTS ----------
function renderConcepts() {
  VIEW = 'concepts';
  silence();
  const list = [...LIB.concepts.values()].sort((a, b) => a.title.localeCompare(b.title));
  $app.innerHTML = `<div class="row"><button class="icon" data-l="back">‹</button><h1>Lessons</h1></div>
  <input type="search" id="cq" placeholder="Search lessons…"><div class="list">${list.map((c) => `<button class="item" data-concept="${esc(c.id)}" data-h="${esc((c.title + ' ' + (c.tags || []).join(' ')).toLowerCase())}"><span>${esc(c.title)}<br><small>${esc((c.tags || []).join(', '))}</small></span><span>›</span></button>`).join('')}</div>`;
  $app.onclick = (e) => { const b = e.target.closest('[data-l]'); if (b) renderHome(); };
  qs('#cq').oninput = (e) => { const q = e.target.value.toLowerCase(); qsa('[data-h]').forEach((x) => { x.style.display = !q || x.dataset.h.includes(q) ? '' : 'none'; }); };
}

// ---------- TOOLBOX ----------
function renderToolbox() {
  VIEW = 'toolbox';
  silence();
  $app.innerHTML = `<div class="row"><button class="icon" data-l="back">‹</button><h1>Toolbox</h1></div>
  <p class="muted small">What can I play over this chord? Tap a chord type.</p>
  <div class="list">${LIB.toolbox.map((e, i) => `<button class="item" data-tb="${i}"><span><b>${esc(e.label || e.chord)}</b><br><small>${(e.options || []).length} options</small></span><span>›</span></button>`).join('')}</div>`;
  $app.onclick = (e) => { const b = e.target.closest('button'); if (!b) return; if (b.dataset.l) renderHome(); if (b.dataset.tb) openToolbox(LIB.toolbox[Number(b.dataset.tb)]); };
}
function openToolbox(entry, rootName = 'C') {
  openSheet(entry.label || entry.chord, (body) => {
    const root = T.parseNote(rootName);
    let q = entry.chord; try { T.getChord(q); } catch (e) { q = null; }
    body.innerHTML = `<div class="row"><span class="muted small">Root</span><select id="tbroot">${T.ROOTS.map((r) => `<option ${r === rootName ? 'selected' : ''}>${r}</option>`).join('')}</select></div>
    ${entry.why || entry.description ? `<div class="md">${md(entry.why || entry.description)}</div>` : ''}
    ${(entry.options || []).map((o, i) => {
      const r = o.from ? T.transpose(root, o.from) : root;
      let name = o.scale; try { name = `${T.noteName(r, true)} ${T.getScale(o.scale).name}`; } catch (e) { /* */ }
      return `<div class="sub"><b>${esc(name)}</b> ${o.lvl ? `<span class="badge">L${o.lvl}</span>` : ''}<p class="small muted">${esc(o.relation || '')}</p><div class="md small">${md(o.why || '')}</div>
      <div class="row"><button data-tbo="${i}" data-a="see">Show on neck</button>${q ? `<button data-tbo="${i}" data-a="hear">Hear over ${esc(T.chordSymbol(root, q))}</button>` : ''}</div><div class="tbout" id="tbo${i}"></div></div>`;
    }).join('')}`;
    qs('#tbroot', body).onchange = (e) => { sheetStack.pop(); openToolbox(entry, e.target.value); };
    body.onclick = (e) => {
      const b = e.target.closest('[data-tbo]'); if (!b) return;
      const o = entry.options[Number(b.dataset.tbo)];
      const r = o.from ? T.transpose(root, o.from) : root;
      const out = qs('#tbo' + b.dataset.tbo, body);
      try {
        if (b.dataset.a === 'see') {
          const comp = compile({ type: 'scale', root: T.noteName(r), scale: o.scale, region: { frets: [Math.max(0, fretNear(r) - 1), fretNear(r) + 4] }, labels: 'interval' });
          // relabel relative to the chord root
          out.innerHTML = comp.html; new NeckPlayer(out.appendChild(document.createElement('div')), comp, { bpm: 100 });
        } else {
          const tokn = `${T.noteName(root)}:${q}`;
          const comp = compile({ type: 'progression', chart: `| ${tokn} | ${tokn} |`, scales: { [tokn]: o.scale }, runs: true });
          // chord-scale runs are rooted on the chord; option rooted elsewhere -> use compare-style run on its own root
          if (o.from && o.from !== '1') {
            const run = compile({ type: 'scale', root: T.noteName(r), scale: o.scale, region: { frets: [Math.max(0, fretNear(r) - 1), fretNear(r) + 4] }, path: 'ascending', beatsPerNote: 0.5 });
            const chordC = compile({ type: 'progression', chart: `| ${tokn} |` });
            comp.events = chordC.events.map((ev) => ({ ...ev, frame: 0 })).concat(run.events.map((ev) => ({ ...ev, frame: 1 })));
            comp.frames = [chordC.frames[0], run.frames[0]]; comp.lo = Math.min(chordC.lo, run.lo); comp.hi = Math.max(chordC.hi, run.hi);
          }
          out.innerHTML = ''; const p = new NeckPlayer(out, comp, { bpm: 90 }); p.play();
        }
      } catch (err) { out.innerHTML = `<p class="muted small">${esc(err.message)}</p>`; }
    };
  });
}
const fretNear = (n) => { const f = ((T.notePc(n) - 4) % 12 + 12) % 12; return f < 2 ? f + 12 : f; };

// ---------- SONGS (analyses) ----------
function renderSongs() {
  VIEW = 'songs';
  silence();
  const byGenre = {};
  for (const a of LIB.analyses) (byGenre[a.genre || 'other'] = byGenre[a.genre || 'other'] || []).push(a);
  $app.innerHTML = `<div class="row"><button class="icon" data-l="back">‹</button><h1>Songs</h1></div>
  <p class="muted small">Annotated chord progressions. Tap one to play through it and see what's going on.</p>
  <input type="search" id="sq" placeholder="Search songs, ideas (mediant, backdoor…)">
  ${Object.entries(byGenre).map(([g, list]) => `<h3>${esc(g)}</h3><div class="list">${list.sort((a, b) => (a.level || 0) - (b.level || 0)).map((a) => `<button class="item" data-song="${esc(a.id)}" data-h="${esc((a.title + ' ' + (a.artist || '') + ' ' + (a.tags || []).join(' ')).toLowerCase())}"><span>${esc(a.title)}<br><small>${esc(a.artist || '')}${a.key ? ' · ' + esc(asKey(a.key).name) : ''}</small></span><span class="badge">L${a.level || '?'}</span></button>`).join('')}</div>`).join('')}`;
  $app.onclick = (e) => { const b = e.target.closest('button'); if (!b) return; if (b.dataset.l) renderHome(); if (b.dataset.song) renderSong(LIB.analyses.find((a) => a.id === b.dataset.song)); };
  qs('#sq').oninput = (e) => { const q = e.target.value.toLowerCase(); qsa('[data-h]').forEach((x) => { x.style.display = !q || x.dataset.h.includes(q) ? '' : 'none'; }); };
}
function renderSong(a, keyOverride = null) {
  VIEW = 'song';
  silence();
  const key = keyOverride || a.key || 'C';
  const K = asKey(key);
  const keyChoices = K.minor ? T.MINOR_KEYS : T.MAJOR_KEYS;
  $app.innerHTML = `<div class="row"><button class="icon" data-l="back">‹</button><h2 class="grow">${esc(a.title)}</h2></div>
  <p class="muted small">${esc(a.artist || '')} · ${esc(a.genre || '')} · L${a.level || '?'}</p>
  <div class="row"><span class="muted small">Key</span><select id="songkey" style="width:auto">${keyChoices.map((k) => `<option value="${k}" ${asKey(k).short === K.short ? 'selected' : ''}>${esc(asKey(k).name)}${asKey(k).short === asKey(a.key || 'C').short ? ' (original)' : ''}</option>`).join('')}</select><span class="muted small">${a.tempo || 90} bpm</span></div>
  <div class="md">${md(a.summary)}</div>${conceptLinks(a.concepts)}
  ${(a.sections || []).map((s, si) => `<div class="panel"><div class="row spread"><h3 style="margin:0">${esc(s.name || 'Section ' + (si + 1))}</h3><button class="primary" data-play="${si}">▶ Play</button></div>
    <div id="sec${si}"></div><div id="secw${si}"></div>
    <div>${(s.notes || []).map((n) => `<div class="note"><span class="bn">Bar ${n.bar}</span>${md(fillKey(n.text, K)).replace(/^<p>|<\/p>$/g, '')}${conceptLinks(n.concepts)}</div>`).join('')}</div>
    <p class="muted small">Tap any chord for its substitution menu.</p></div>`).join('')}
  ${(a.compare || []).map((c, ci) => `<div class="panel"><h3 style="margin-top:0">🎧 ${esc(c.title || 'Compare')}</h3><div class="md">${md(c.explain || '')}</div><button data-cmp="${ci}">▶ Hear the comparison</button><div id="cmp${ci}"></div></div>`).join('')}
  ${a.source ? `<p class="muted small">Chart source: ${esc(a.source)}</p>` : ''}`;
  (a.sections || []).forEach((s, si) => {
    try {
      const { chords } = chartChords({ key: K.short, chart: s.chart, meter: a.meter });
      const noted = new Set((s.notes || []).map((n) => n.bar - 1));
      const bars = [];
      chords.forEach((c, ci) => (bars[c.bar] = bars[c.bar] || []).push({ c, ci }));
      qs('#sec' + si).innerHTML = `<div class="chart">${bars.map((b, bi) => `<div class="cbar ${noted.has(bi) ? 'noted' : ''}" data-bar="${bi}">${(b || []).map(({ c, ci }) => `<span class="cchord" data-sub="${si}|${ci}"><b>${esc(chordLabel(c))}</b><small>${esc(T.prettyRoman(c.roman || ''))}</small></span>`).join('')}</div>`).join('')}</div>`;
    } catch (err) { qs('#sec' + si).innerHTML = `<p class="muted small">Chart error: ${esc(err.message)}</p>`; }
  });
  $app.onclick = (e) => {
    const b = e.target.closest('[data-l],[data-play],[data-sub],[data-cmp]'); if (!b) return;
    if (b.dataset.l) return renderSongs();
    if (b.dataset.play) {
      const si = Number(b.dataset.play);
      const s = a.sections[si];
      try {
        const comp = compile({ type: 'progression', key: K.short, chart: s.chart, strum: a.strum, meter: a.meter, voiceLead: true });
        const el = qs('#secw' + si);
        const p = new NeckPlayer(el, comp, { bpm: a.tempo || 90 });
        const orig = p.showFrame.bind(p);
        p.showFrame = (i, hl, ev) => { orig(i, hl, ev); const c = comp.chords && comp.chords[i]; qsa(`#sec${si} .cbar`).forEach((x) => x.classList.toggle('cur', c && Number(x.dataset.bar) === c.bar)); };
        p.play();
      } catch (err) { toast(err.message); }
    }
    if (b.dataset.sub) { const [si, ci] = b.dataset.sub.split('|').map(Number); openSubMenu(a, K, si, ci); }
    if (b.dataset.cmp) {
      const c = a.compare[Number(b.dataset.cmp)];
      try { const comp = compile({ ...c, type: 'compare', key: K.short }); const p = new NeckPlayer(qs('#cmp' + b.dataset.cmp), comp, { bpm: a.tempo || 90 }); p.play(); } catch (err) { toast(err.message); }
    }
  };
  qs('#songkey').onchange = (e) => renderSong(a, e.target.value);
}
const fillKey = (s, K) => String(s || '').replace(/\{rn:([^}]+)\}/g, (m, t) => { try { const c = T.parseChordToken(t, K.tonic); return T.chordSymbol(c.root, c.quality); } catch (e) { return m; } });

function openSubMenu(a, K, si, ci) {
  const s = a.sections[si];
  const { chords } = chartChords({ key: K.short, chart: s.chart, meter: a.meter });
  const c = chords[ci];
  const next = chords[ci + 1] || null;
  const curated = (s.subs || []).filter((x) => x.bar - 1 === c.bar && (x.chord == null || x.chord === chords.filter((y) => y.bar === c.bar).indexOf(c))).flatMap((x) => x.options || []);
  const generic = substitutions(c, next, K);
  const all = [...curated.map((o) => ({ ...o, curated: true })), ...generic.filter((g) => !curated.some((o) => o.token === g.token))];
  openSheet(`Instead of ${chordLabel(c)}`, (body) => {
    body.innerHTML = `<p class="muted small">Bar ${c.bar + 1} · ${esc(T.prettyRoman(c.roman || ''))} · function-based alternatives. ▶ plays the surrounding bars with the swap.</p>
    <button data-hear="-1" style="width:100%">▶ Original</button><div id="subw"></div>
    ${all.map((o, i) => { let sym = ''; try { const x = T.parseChordToken(o.token, K.tonic); sym = T.chordSymbol(x.root, x.quality); } catch (e) { sym = o.token; } return `<div class="sub"><div class="row spread"><span><b>${esc(sym)}</b> <span class="muted small">${esc(T.prettyRoman(o.token.replace(':', ' ')))}</span></span>${o.curated ? '<span class="badge m">for this song</span>' : ''}</div><div><b style="color:var(--text)">${esc(o.label || '')}</b></div><div class="md small">${md(fillKey(o.why || '', K))}</div>${conceptLinks(o.concepts)}<button data-hear="${i}">▶ Hear it</button></div>`; }).join('')}`;
    body.onclick = (e) => {
      const b = e.target.closest('[data-hear]'); if (!b) return;
      const i = Number(b.dataset.hear);
      // window: one bar before through one bar after
      const barsArr = String(s.chart).split('|').map((x) => x.trim()).filter(Boolean);
      const lo = Math.max(0, c.bar - 1), hi = Math.min(barsArr.length - 1, c.bar + 1);
      const windowBars = barsArr.slice(lo, hi + 1).map((bar, bi) => {
        if (i < 0 || lo + bi !== c.bar) return bar === '%' && bi === 0 ? barsArr[lo - 1] || bar : bar;
        const toks = bar.split(/\s+/);
        const idxInBar = chords.filter((y) => y.bar === c.bar).indexOf(c);
        toks[idxInBar] = all[i].token;
        return toks.join(' ');
      });
      try {
        const comp = compile({ type: 'progression', key: K.short, chart: '| ' + windowBars.join(' | ') + ' |', voiceLead: true, meter: a.meter });
        const p = new NeckPlayer(qs('#subw', body), comp, { bpm: a.tempo || 90 });
        p.play();
      } catch (err) { toast(err.message); }
    };
  });
}

// ---------- TED GREENE ----------
const TGK = { major: ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'], minor: ['Am', 'Bbm', 'Bm', 'Cm', 'C#m', 'Dm', 'Ebm', 'Em', 'Fm', 'F#m', 'Gm', 'G#m'] };
const TGS = { hold: false, key: null, bpm: 66, bpc: 2, arp: false };
const tgEx = (id) => LIB.tg.examples.find((e) => e.id === id);
const tgPage = (id) => LIB.tg.pages.find((p) => p.id === id);
const tgFamilyOf = (ex) => LIB.tg.families.find((f) => f.examples.includes(ex.id));
function renderTG() {
  VIEW = 'tg';
  silence();
  const G = LIB.tg;
  if (!G) { LIB.tg = { title: 'Ted Greene', chapters: [], pages: [], examples: [], families: [] }; TGS.tab = 'archive'; return renderTG(); }
  const book = LIB.templates.filter((t) => (t.tags || []).includes('ted-greene') && !t.tags.includes('tg-archive'));
  const nCards = book.length;
  const ts = st().tpl;
  const done = book.filter((t) => ts[t.id] && ts[t.id].n).length;
  $app.innerHTML = `<div class="row"><button class="icon" data-l="back">‹</button><h2 class="grow">${esc(G.title)}</h2></div>
  <p class="muted small">${G.pages.length} pages · ${G.examples.length} progressions · ${G.examples.reduce((a, e) => a + e.chords.length, 0)} grips · ${nCards} cards (${done} practised)</p>
  <div class="row"><button class="primary grow" data-tg="practice">Practise book progressions</button><button class="grow" data-tg="archive">Random archive lesson</button></div>
  <div class="seg" style="margin:12px 0"><button data-tgtab="lessons" class="${(TGS.tab || 'lessons') === 'lessons' ? 'on' : ''}">Lessons</button><button data-tgtab="families" class="${TGS.tab === 'families' ? 'on' : ''}">Progressions</button><button data-tgtab="archive" class="${TGS.tab === 'archive' ? 'on' : ''}">Archive${LIB.tgArchive ? ' (' + LIB.tgArchive.lessons.length + ')' : ''}</button></div>
  <input type="search" id="tgq" placeholder="Search (chord scale, cycle, iii-vi-ii-V…)">
  <p class="muted small" style="margin-top:6px">${LIB.tgPack ? `Book pack on this device (built ${esc(String(LIB.tgPack.built || '').slice(0, 10))}). ` : ''}<label style="color:var(--accent2);text-decoration:underline">${LIB.tgPack || G.pages.length ? 'Update' : 'Import'} the Ted Greene book pack<input type="file" id="tgpack" accept=".json,application/json" style="display:none"></label></p>
  <div id="tglist"></div>`;
  const list = qs('#tglist');
  if ((TGS.tab || 'lessons') === 'lessons') {
    list.innerHTML = G.chapters.map((c) => `<h3>${esc(c.name)}</h3><div class="list">${c.pages.map((pid) => { const p = tgPage(pid); return `<button class="item" data-tgpage="${p.id}" data-h="${esc((c.name + ' ' + p.headings.join(' ') + ' ' + p.summary).toLowerCase())}"><span>p.${p.page ?? '?'} ${esc(p.headings[0] || c.name)}<br><small>${p.examples.length ? p.examples.length + ' progression' + (p.examples.length > 1 ? 's' : '') : 'text'}</small></span><span>›</span></button>`; }).join('')}</div>`).join('');
  } else if (TGS.tab === 'archive') {
    const A = LIB.tgArchive;
    list.innerHTML = !A ? '<p class="muted">Archive index not built.</p>' : `<p class="muted small">Every lesson sheet from tedgreene.com. “Sheet” opens the PDF online; “Card” practises it with a rating.</p>` + Object.keys(A.folders).map((cat) => `<details class="tgfold"><summary style="padding:10px 0;font-weight:700">${esc(cat)} <span class="muted small">${A.folders[cat]}</span></summary><div class="list">${A.lessons.filter((l) => l.cat === cat).map((l) => `<div class="item sub" data-h="${esc((cat + ' ' + l.title).toLowerCase())}" style="display:flex;gap:8px;align-items:center;margin:4px 0"><span class="grow">${esc(l.title)}<br><small class="muted">${esc(l.date || '')}${st().tpl[l.id]?.n ? ' · practised ' + st().tpl[l.id].n + '×' : ''}</small></span><a href="${esc(l.url)}" target="_blank" rel="noopener" style="color:var(--accent2)">Sheet</a><button class="tbtn" data-tga="${esc(l.id)}">Card</button></div>`).join('')}</div></details>`).join('');
  } else {
    list.innerHTML = `<div class="list">${G.families.map((f) => `<button class="item" data-tgfam="${f.id}" data-h="${esc((f.name + ' ' + f.kind).toLowerCase())}"><span>${esc(f.name)}<br><small>${esc(f.kind)} · ${f.examples.length} version${f.examples.length > 1 ? 's' : ''}</small></span><span>›</span></button>`).join('')}</div>`;
  }
  $app.onclick = (e) => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.l) return renderHome();
    if (b.dataset.tgtab) { TGS.tab = b.dataset.tgtab; return renderTG(); }
    if (b.dataset.tgpage) return renderTGPage(b.dataset.tgpage);
    if (b.dataset.tga) return startSession(LIB.byId.get(b.dataset.tga), { back: renderTG });
    if (b.dataset.tgfam) { const f = G.families.find((x) => x.id === b.dataset.tgfam); return renderTGPlayer(f.examples, 0, f.name); }
    if (b.dataset.tg === 'practice') startSession(null, { filter: (t) => (t.tags || []).includes('ted-greene') && !t.tags.includes('tg-archive'), back: renderTG });
    if (b.dataset.tg === 'archive') startSession(null, { filter: (t) => (t.tags || []).includes('tg-archive'), back: renderTG });
  };
  qs('#tgpack').onchange = async (e) => {
    const f = e.target.files && e.target.files[0]; if (!f) return;
    try {
      const pack = JSON.parse(await f.text());
      if (pack.kind !== 'guitarcards-pack' || pack.name !== 'tedgreene') throw new Error('not a Ted Greene pack');
      await savePack('tedgreene', pack);
      LIB = await loadLibrary(); window.__LIB = LIB;
      toast(`Imported ${pack.tg.examples.length} progressions — saved on this device`);
      renderTG();
    } catch (err) { toast('Import failed: ' + err.message); }
  };
  qs('#tgq').oninput = (e) => { const q = e.target.value.toLowerCase(); qsa('[data-h]').forEach((x) => { x.style.display = !q || x.dataset.h.includes(q) ? '' : 'none'; }); qsa('#tglist h3').forEach((h) => { const n = h.nextElementSibling; h.style.display = n && [...n.children].some((x) => x.style.display !== 'none') ? '' : 'none'; }); qsa('#tglist details').forEach((d) => { const any = [...d.querySelectorAll('[data-h]')].some((x) => x.style.display !== 'none'); d.style.display = any ? '' : 'none'; d.open = !!q && any; }); };
}
function renderTGPage(pid) {
  VIEW = 'tgpage';
  silence();
  const p = tgPage(pid);
  const G = LIB.tg;
  const idx = G.pages.indexOf(p);
  $app.innerHTML = `<div class="row"><button class="icon" data-l="back">‹</button><h2 class="grow">p.${p.page ?? '?'} ${esc(p.headings[0] || p.chapter)}</h2></div>
  <p class="muted small">${esc(p.chapter)}</p>
  <div class="md">${md(p.summary)}</div>
  ${p.points.length ? `<div class="helpbox">${p.points.map((x) => `<div class="hint">• ${esc(x)}</div>`).join('')}</div>` : ''}
  ${p.examples.map((id) => { const ex = tgEx(id); return `<div class="panel"><b>${esc(ex.label || ex.family)}</b><p class="muted small">${esc(ex.family)} · ${ex.chords.length} grips${ex.key ? ' · key of ' + esc(ex.key) : ''}</p><div class="tgmini" data-ex="${id}"></div><button class="primary" style="width:100%" data-tgplay="${id}">▶ Open in player (all keys, all versions)</button></div>`; }).join('')}
  <div class="row spread" style="margin-top:12px">${idx > 0 ? `<button data-tgnav="${G.pages[idx - 1].id}">‹ p.${G.pages[idx - 1].page}</button>` : '<span></span>'}${idx < G.pages.length - 1 ? `<button data-tgnav="${G.pages[idx + 1].id}">p.${G.pages[idx + 1].page} ›</button>` : ''}</div>`;
  qsa('.tgmini').forEach((el) => { try { const ex = tgEx(el.dataset.ex); el.innerHTML = tgBoxes(compile(tgSpec(ex, null)), ex); } catch (err) { el.innerHTML = `<p class="muted small">${esc(err.message)}</p>`; } });
  $app.onclick = (e) => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.l) return renderTG();
    if (b.dataset.tgnav) return renderTGPage(b.dataset.tgnav);
    if (b.dataset.tgplay) { const ex = tgEx(b.dataset.tgplay); const f = tgFamilyOf(ex); return renderTGPlayer(f.examples, f.examples.indexOf(ex.id), f.name, () => renderTGPage(pid)); }
  };
}
// the progression as book-style chord boxes (with Greene's added ✕/■ notes and optional notes), transposed with the grips
const tgParse = (f) => (Array.isArray(f) ? f : String(f).trim().split(/\s+/).map((x) => (/^\d+$/.test(x) ? Number(x) : null)));
function tgBoxes(comp, ex, withMarks = true) {
  const chords = comp.chords || [];
  const shiftPos = (arr, d) => (arr || []).map((p) => p.replace(/(str\d):(\d+)/, (m, a, f) => `${a}:${Math.max(0, Number(f) + d)}`));
  const boxes = chords.map((c, i) => {
    const orig = withMarks && ex.chords[i] ? tgParse(ex.chords[i].frets) : null;
    let d = 0;
    if (orig) { const k = orig.findIndex((x, j) => x != null && c.frets[j] != null); if (k >= 0) d = c.frets[k] - orig[k]; }
    const o = withMarks && ex.chords[i] ? ex.chords[i] : {};
    const roman = (ex.romans && ex.romans[i]) || c.roman || '';
    return chordBoxSVG({ frets: c.frets, name: T.pretty(c.name), sub: [c.means && c.means !== c.name ? '= ' + T.pretty(c.means) : '', roman ? T.prettyRoman(roman) : ''].filter(Boolean).join(' · '),
      optional: shiftPos(o.optional, d), added: (o.added || []).map((st) => shiftPos(st, d)), note: o.note && (o.added || o.optional) ? o.note : '' });
  });
  const marks = withMarks && ex.chords.some((c) => c.added || c.optional);
  return `<div class="cboxes">${boxes.join('')}</div>${marks ? CHORDBOX_LEGEND : ''}`;
}
function tgSpec(ex, key, gen = null) {
  const spec = { type: 'grips', from: ex.key || undefined, key: key || ex.key || undefined, chords: ex.chords, romans: ex.romans, beatsPerChord: TGS.bpc, arpeggiate: TGS.arp };
  if (gen === 'up' || gen === 'down') Object.assign(spec, { generate: 'chordScale', dir: gen === 'up' ? 1 : -1, romans: undefined, from: ex.key || 'C' });
  if (gen === 'cycle4' || gen === 'cycle5') Object.assign(spec, { generate: 'cycle', dir: gen === 'cycle4' ? -1 : 1, romans: undefined, from: ex.key || 'C' });
  return spec;
}
// the player: lock the key and step through versions, or keep the version and change key
function renderTGPlayer(ids, start = 0, title = '', back = null) {
  VIEW = 'tgplayer';
  silence();
  const P = { ids, i: start, gen: null };
  const exNow = () => tgEx(P.ids[P.i]);
  const keyList = () => (exNow().key && /m$/.test(exNow().key) ? TGK.minor : TGK.major);
  if (!TGS.hold || !TGS.key) TGS.key = exNow().key;
  const draw = (autoplay = false) => {
    silence();
    const ex = exNow();
    if (!TGS.hold) TGS.key = ex.key;
    if (TGS.key && ex.key && /m$/.test(TGS.key) !== /m$/.test(ex.key)) TGS.key = ex.key;
    const canKey = !!ex.key;
    const pg = LIB.tg.pages.find((p) => p.examples.includes(ex.id));
    $app.innerHTML = `<div class="row"><button class="icon" data-l="back">‹</button><h2 class="grow">${esc(title || ex.family)}</h2></div>
    <p class="muted small">p.${ex.page} · ${esc(ex.label)}</p>
    <div class="panel">
      <div class="row spread"><span class="muted small">Version</span><div class="row"><button class="tbtn" data-p="vprev">◀</button><b>${P.i + 1} / ${P.ids.length}</b><button class="tbtn" data-p="vnext">▶</button></div></div>
      <div class="row spread" style="margin-top:8px"><span class="muted small">Key</span><div class="row">${canKey ? `<button class="tbtn" data-p="kprev">◀</button><b>${esc(T.parseKey(TGS.key).name)}</b><button class="tbtn" data-p="knext">▶</button><button class="tbtn ${TGS.hold ? 'on' : ''}" data-p="hold">🔒 Hold key</button>` : '<span class="muted small">as written (no key given)</span>'}</div></div>
      <div class="row spread" style="margin-top:8px"><span class="muted small">Tempo</span><div class="row"><button class="tbtn" data-p="slower">−</button><b>${TGS.bpm} bpm</b><button class="tbtn" data-p="faster">+</button><button class="tbtn" data-p="bpc">${TGS.bpc} beat${TGS.bpc > 1 ? 's' : ''}/chord</button><button class="tbtn ${TGS.arp ? 'on' : ''}" data-p="arp">Arpeggiate</button></div></div>
      ${canKey ? `<div class="row" style="margin-top:8px"><span class="muted small">Ted's rules →</span><button class="tbtn ${!P.gen ? 'on' : ''}" data-gen="">Book</button><button class="tbtn ${P.gen === 'up' ? 'on' : ''}" data-gen="up">Chord scale ↑</button><button class="tbtn ${P.gen === 'down' ? 'on' : ''}" data-gen="down">Chord scale ↓</button>${ex.chords.length > 1 ? `<button class="tbtn ${P.gen === 'cycle4' ? 'on' : ''}" data-gen="cycle4">Cycle 4ths</button><button class="tbtn ${P.gen === 'cycle5' ? 'on' : ''}" data-gen="cycle5">Cycle 5ths</button>` : ''}</div>` : ''}
      <div class="row" style="margin-top:8px"><button class="primary grow" data-p="playall">▶▶ Play every version${TGS.hold ? ' in this key' : ''}</button></div>
    </div>
    <div id="tgd"></div><details class="helpbox" id="tgwrap"><summary>👁 Watch &amp; hear it</summary><div id="tgw"></div></details>
    ${ex.chords.some((c) => c.flag) ? `<p class="muted small">⚠︎ Some grips here didn't match their chord name when transcribed; double-check against the book.</p>` : ''}
    ${pg ? `<details class="helpbox"><summary>What the book says (p.${pg.page})</summary><div class="md">${md(pg.summary)}</div></details>` : ''}`;
    let comp;
    try { comp = compile(tgSpec(ex, canKey ? TGS.key : null, P.gen)); } catch (err) { qs('#tgw').innerHTML = `<p class="muted small">${esc(err.message)}</p>`; return; }
    qs('#tgd').innerHTML = tgBoxes(comp, ex, !P.gen);
    if (autoplay || P.allMode) qs('#tgwrap').open = true;
    const pl = new NeckPlayer(qs('#tgw'), comp, { bpm: TGS.bpm, title: ex.label });
    pl.loops = P.allMode ? 1 : 3;
    pl.render();
    if (P.allMode) pl.onFinish = () => { if (!P.allMode || VIEW !== 'tgplayer') return; if (P.i < P.ids.length - 1) { P.i++; draw(true); } else { P.allMode = false; toast('Played every version'); } };
    if (autoplay) pl.play();
  };
  const step = (d) => { P.gen = null; P.i = (P.i + d + P.ids.length) % P.ids.length; draw(); };
  const keyStep = (d) => { const L = keyList(); const cur = L.findIndex((k) => T.notePc(T.parseKey(k).tonic) === T.notePc(T.parseKey(TGS.key).tonic)); TGS.key = L[((cur < 0 ? 0 : cur) + d + L.length) % L.length]; TGS.hold = true; draw(); };
  $app.onclick = (e) => {
    const b = e.target.closest('button'); if (!b) return;
    const a = b.dataset.p;
    if (b.dataset.l) { P.allMode = false; silence(); document.onkeydown = null; return back ? back() : renderTG(); }
    if (a && a !== 'playall') P.allMode = false;
    if (a === 'vprev') step(-1);
    if (a === 'vnext') step(1);
    if (a === 'kprev') keyStep(-1);
    if (a === 'knext') keyStep(1);
    if (a === 'hold') { TGS.hold = !TGS.hold; draw(); }
    if (a === 'slower' || a === 'faster') { TGS.bpm = Math.max(30, Math.min(200, TGS.bpm + (a === 'faster' ? 6 : -6))); draw(); }
    if (a === 'bpc') { TGS.bpc = { 1: 2, 2: 4, 4: 1 }[TGS.bpc]; draw(); }
    if (a === 'arp') { TGS.arp = !TGS.arp; draw(); }
    if (b.dataset.gen !== undefined) { P.gen = b.dataset.gen || null; draw(); }
    if (a === 'playall') { P.allMode = true; P.i = 0; P.gen = null; draw(true); }
  };
  // desktop/keyboard: ←/→ versions, ↑/↓ keys, space play
  document.onkeydown = (e) => {
    if (VIEW !== 'tgplayer') { document.onkeydown = null; return; }
    if (e.key === 'ArrowRight') step(1); else if (e.key === 'ArrowLeft') step(-1);
    else if (e.key === 'ArrowUp') keyStep(1); else if (e.key === 'ArrowDown') keyStep(-1);
    else if (e.key === ' ') { e.preventDefault(); qs('[data-w=play]')?.click(); }
  };
  draw();
}

// ---------- PROGRESSION GAME ----------
function renderProgGame() {
  VIEW = 'proggame';
  silence();
  const G = (st().pgame = st().pgame || { level: 0, hist: [], arp: false, best: 0 });
  let R = pgRound(G.level);
  let pick = [];
  let done = false;
  const L = () => PG_LEVELS[G.level];
  const play = (seq = R.seq) => playSeq(seq, R.key.tonic, { arpeggio: G.arp });
  const dots = () => { const last = G.hist.slice(-PG_PASS.of); return [...Array(PG_PASS.of)].map((_, i) => `<span class="badge" style="min-width:20px;text-align:center;${last[i] === true ? 'background:var(--good);color:#052' : last[i] === false ? 'background:var(--bad);color:#300' : ''}">${last[i] === true ? '✓' : last[i] === false ? '✗' : '·'}</span>`).join(''); };
  const slots = () => R.seq.map((c, i) => {
    if (i === 0) return `<span class="pgslot fixed">${esc(c.label)}</span>`;
    const p = pick[i - 1];
    const cls = done ? (p && p.tok === c.tok ? 'ok' : 'bad') : p ? 'filled' : '';
    return `<span class="pgslot ${cls}">${p ? esc(p.label) : '?'}</span>`;
  }).join('<span class="pgarrow">→</span>');
  const draw = () => {
    $app.innerHTML = `<div class="row"><button class="icon" data-pg="back">‹</button><h2 class="grow">Progression game</h2></div>
    <div class="row spread"><span><b>Level ${G.level + 1}</b> <span class="muted small">/ ${PG_LEVELS.length}</span></span>
      <span class="row"><button class="tbtn" data-pg="lvdown" ${G.level ? '' : 'disabled'}>−</button><button class="tbtn" data-pg="lvup" ${G.level < PG_LEVELS.length - 1 ? '' : 'disabled'}>+</button></span></div>
    <p class="muted small">${esc(L().title)}. The first chord is always I (home). Get ${PG_PASS.need} of the last ${PG_PASS.of} right to level up.</p>
    <div class="row" id="pgdots" style="gap:3px;margin:6px 0">${dots()}</div>
    <div class="row"><button class="primary grow playbig" data-pg="play">▶ Play</button><button class="tbtn ${G.arp ? 'on' : ''}" data-pg="arp" style="padding:16px 12px">Arpeggiate</button></div>
    <div class="pgslots">${slots()}</div>
    <div class="qgrid">${L().pool.map((c, i) => `<button data-pg="pick" data-i="${i}" ${done ? 'disabled' : ''}>${esc(c.label)}</button>`).join('')}</div>
    <div class="row"><button data-pg="undo" ${done || !pick.length ? 'disabled' : ''}>⌫ Undo</button><button class="primary grow" data-pg="check" ${done || pick.length < R.seq.length - 1 ? 'disabled' : ''}>Check</button></div>
    <div id="pgfb"></div>`;
  };
  const next = () => { R = pgRound(G.level); pick = []; done = false; draw(); A.later(() => play(), 250); };
  draw();
  A.later(() => play(), 250);
  $app.onclick = (e) => {
    const b = e.target.closest('[data-pg]'); if (!b) return;
    const a = b.dataset.pg;
    if (a === 'back') return renderHome();
    if (a === 'play') return play();
    if (a === 'arp') { G.arp = !G.arp; AD.save(); b.classList.toggle('on', G.arp); return play(); }
    if (a === 'lvdown' || a === 'lvup') { G.level = Math.max(0, Math.min(PG_LEVELS.length - 1, G.level + (a === 'lvup' ? 1 : -1))); G.hist = []; AD.save(); return next(); }
    if (a === 'next') return next();
    if (a === 'hearmine') return play([R.seq[0], ...pick]);
    if (a === 'hearans') return play();
    if (done) return;
    if (a === 'pick' && pick.length < R.seq.length - 1) { pick.push(L().pool[Number(b.dataset.i)]); draw(); }
    if (a === 'undo') { pick.pop(); draw(); }
    if (a === 'check') {
      done = true;
      const ok = pick.every((p, i) => p.tok === R.seq[i + 1].tok);
      G.hist.push(ok);
      const last = G.hist.slice(-PG_PASS.of);
      let msg = '';
      if (last.length >= PG_PASS.of && last.filter(Boolean).length >= PG_PASS.need && G.level < PG_LEVELS.length - 1) { G.level++; G.hist = []; msg = `🎉 Level up! Now: ${PG_LEVELS[G.level].title}`; }
      AD.save();
      draw();
      qs('#pgfb').innerHTML = `<div class="feedback ${ok ? 'ok' : 'no'}">${ok ? '✓ Correct' : '✗ Not quite'}</div>
        <p class="small">In ${esc(R.key.name)}: ${R.seq.map((c) => `<b>${esc(c.label)}</b> ${esc(chordName(c.tok, R.key.tonic))}`).join(' → ')}</p>
        ${ok ? '' : `<div class="row"><button data-pg="hearans">▶ Hear the answer</button><button data-pg="hearmine">▶ Hear yours</button></div>`}
        ${msg ? `<div class="feedback ok">${esc(msg)}</div>` : ''}
        <button class="primary start" data-pg="next">Next →</button>`;
    }
  };
}

// ---------- EAR GYM ----------
const gymState = () => (st().gym = st().gym || { hist: {}, passed: {} });
const gymPassed = () => EAR_LEVELS.filter((l) => gymState().passed[l.id]).length;
const gymUnlocked = (i) => i === 0 || !!gymState().passed[EAR_LEVELS[i - 1].id];
function renderEarGym() {
  VIEW = 'eargym';
  silence();
  const G = gymState();
  $app.innerHTML = `<div class="row"><button class="icon" data-l="back">‹</button><h1>Ear Gym</h1></div>
  <p class="muted small">Headphones on. Each level plays progressions in random keys; name what you hear. Get <b>${PASS.need} of the last ${PASS.of}</b> right to pass and unlock the next level. Replay as often as you like.</p>
  <div class="list">${EAR_LEVELS.map((l, i) => { const h = G.hist[l.id] || []; const last = h.slice(-PASS.of); const ok = last.filter(Boolean).length; const lock = !gymUnlocked(i);
    return `<button class="item" data-lv="${i}" ${lock ? 'disabled' : ''}><span>${lock ? '🔒 ' : G.passed[l.id] ? '✅ ' : '▶ '}<b>Level ${i + 1}</b> · ${esc(l.title)}<br><small>${l.options.length} choices${h.length ? ` · last ${last.length}: ${ok} right` : ''}</small></span><span class="badge ${G.passed[l.id] ? 'm' : ''}">${G.passed[l.id] ? 'passed' : lock ? 'locked' : 'open'}</span></button>`; }).join('')}</div>`;
  $app.onclick = (e) => { const b = e.target.closest('button'); if (!b) return; if (b.dataset.l) return renderHome(); if (b.dataset.lv) renderGymRun(Number(b.dataset.lv)); };
}
function renderGymRun(li) {
  VIEW = 'gymrun';
  silence();
  const L = EAR_LEVELS[li];
  const G = gymState();
  const h = (G.hist[L.id] = G.hist[L.id] || []);
  let Q = gymQuestion(L);
  let answered = false;
  const dots = () => { const last = h.slice(-PASS.of); return [...Array(PASS.of)].map((_, i) => `<span class="badge" style="min-width:22px;text-align:center;${last[i] === true ? 'background:var(--good);color:#052' : last[i] === false ? 'background:var(--bad);color:#300' : ''}">${last[i] === true ? '✓' : last[i] === false ? '✗' : '·'}</span>`).join('') + `<span class="muted small">need ${PASS.need}/${PASS.of}</span>`; };
  const draw = () => {
    $app.innerHTML = `<div class="row"><button class="icon" data-g="back">‹</button><h2 class="grow">Level ${li + 1}: ${esc(L.title)}</h2></div>
    <p class="muted small">💡 ${esc(L.tip)}</p>
    <div class="row" id="gdots" style="gap:4px;margin:8px 0">${dots()}</div>
    <button class="primary playbig" data-g="play">▶ Play progression</button>
    <div class="qgrid">${L.options.map((o, i) => `<button data-g="ans" data-i="${i}">${esc(o.name)}</button>`).join('')}</div>
    <div id="gfb"></div>`;
  };
  const next = () => { Q = gymQuestion(L); answered = false; draw(); A.later(() => Q.play(), 300); };
  draw();
  A.later(() => Q.play(), 300);
  $app.onclick = (e) => {
    const b = e.target.closest('[data-g]'); if (!b) return;
    const g = b.dataset.g;
    if (g === 'back') return renderEarGym();
    if (g === 'play') return Q.play();
    if (g === 'next') return next();
    if (g === 'hear') { const o = L.options[Number(b.dataset.i)]; const k = Q.key; const q2 = gymQuestion({ ...L, options: [o] }, T.noteName(k.tonic)); return q2.play(); }
    if (g === 'ans' && !answered) {
      answered = true;
      const i = Number(b.dataset.i);
      const ok = i === Q.answer;
      h.push(ok);
      const last = h.slice(-PASS.of);
      const passedNow = last.length >= PASS.of && last.filter(Boolean).length >= PASS.need && !G.passed[L.id];
      if (passedNow) G.passed[L.id] = Date.now();
      AD.save();
      qs('#gdots').innerHTML = dots();
      qsa('[data-g=ans]').forEach((x, j) => { if (j === Q.answer) x.classList.add('right'); else if (j === i) x.classList.add('wrong'); });
      qs('#gfb').innerHTML = `<div class="feedback ${ok ? 'ok' : 'no'}">${ok ? '✓ Correct' : '✗ It was: ' + esc(Q.option.name)}</div>
        <p class="small">In ${esc(Q.key.name)}: ${esc(Q.reveal)}</p>
        ${!ok ? `<div class="row"><button data-g="hear" data-i="${Q.answer}">▶ Hear the answer</button><button data-g="hear" data-i="${i}">▶ Hear what you picked</button></div>` : ''}
        ${passedNow ? `<div class="feedback ok">🎉 Level ${li + 1} passed${EAR_LEVELS[li + 1] ? ' — level ' + (li + 2) + ' unlocked' : ''}!</div>` : ''}
        <button class="primary start" data-g="next">Next →</button>`;
    }
  };
}

// ---------- SETTINGS ----------
function renderSettings() {
  VIEW = 'settings';
  silence();
  const s = st().settings;
  const sw = (k, label, sub) => `<div class="toggle"><span>${label}<br><small class="muted">${sub}</small></span><button class="switch ${s[k] ? 'on' : ''}" data-sw="${k}"></button></div>`;
  $app.innerHTML = `<div class="row"><button class="icon" data-l="back">‹</button><h1>Settings</h1></div>
  <div class="panel">${sw('metronomeAuto', 'Auto-start metronome', 'Start the click as soon as a timed card appears')}${sw('droneAuto', 'Auto-start drone', 'Start the drone on modal cards')}</div>
  <div class="panel"><h3 style="margin-top:0">Progress data</h3><p class="muted small">Stored on this device only. Copy it to back up or move between devices.</p>
  <div class="row"><button data-x="export">Copy backup</button><button data-x="import">Restore backup</button><button data-x="reset">Reset all</button></div>
  <textarea id="bk" style="width:100%;height:80px;margin-top:8px;background:var(--panel2);color:var(--text);border:1px solid var(--line);border-radius:10px" placeholder="Backup JSON"></textarea></div>
  <div class="panel"><h3 style="margin-top:0">Levels</h3>${Object.keys(AD.CAT_LABEL).map((c) => `<div class="catrow"><span>${esc(AD.CAT_LABEL[c])}</span><span>L${AD.catLevel(c).toFixed(1)}</span><span><button data-lv="${c}|-1" class="tbtn">−</button><button data-lv="${c}|1" class="tbtn">+</button></span></div>`).join('')}</div>`;
  $app.onclick = async (e) => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.l) return renderHome();
    if (b.dataset.sw) { s[b.dataset.sw] = !s[b.dataset.sw]; AD.save(); renderSettings(); }
    if (b.dataset.lv) { const [c, d] = b.dataset.lv.split('|'); const cat = (st().cat[c] = st().cat[c] || { level: AD.catLevel(c), n: 0 }); cat.level = Math.max(1, Math.min(10, cat.level + Number(d) * 0.5)); AD.save(); renderSettings(); }
    if (b.dataset.x === 'export') { const j = AD.exportState(); qs('#bk').value = j; try { await navigator.clipboard.writeText(j); toast('Copied'); } catch (err) { toast('Select and copy the text'); } }
    if (b.dataset.x === 'import') { try { AD.importState(qs('#bk').value); toast('Restored'); renderSettings(); } catch (err) { toast('Invalid backup'); } }
    if (b.dataset.x === 'reset' && confirm('Reset all progress?')) { AD.resetAll(); renderSettings(); }
  };
}

// ---------- boot ----------
(async function boot() {
  LIB = await loadLibrary();
  window.__LIB = LIB;
  renderHome();
  if ('serviceWorker' in navigator && location.protocol !== 'file:') navigator.serviceWorker.register('sw.js').catch(() => {});
})();
