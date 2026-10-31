import * as T from './theory.js';
import * as A from './audio.js';
import { loadLibrary } from './library.js';
import { instantiate, fill } from './cards.js';
import { compile, chartChords, chordLabel, asKey } from './demo.js';
import { fretboardSVG, md, esc, rhythmHTML } from './render.js';
import { makeQuiz, PC_NAMES } from './quiz.js';
import * as AD from './adapt.js';
import { substitutions } from './subs.js';
import { contextFor, chordScaleContext } from './context.js';

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
    this.el = el; this.c = compiled; this.bpm = bpm; this.loops = 1; this.speed = 1; this.click = false; this.frame = -1;
    this.title = title;
    this.render();
  }
  render() {
    const c = this.c;
    this.el.innerHTML = `<div class="watch">
      ${c.rhythm ? `<div class="rh"></div>` : ''}
      <div class="cap"></div><div class="neck"></div><div class="big"></div>
      <div class="ctrl">
        <button data-w="play" class="primary">▶ Play</button>
        <button data-w="loops">${this.loopLabel()}</button>
        <button data-w="speed">${this.speed}×</button>
        <button data-w="click" class="${this.click ? 'on' : ''}">Click</button>
        <span class="muted small grow" style="text-align:right">${Math.round(this.bpm * this.speed)} bpm</span>
      </div></div>`;
    if (c.rhythm) qs('.rh', this.el).innerHTML = rhythmHTML(c.rhythm);
    this.showFrame(0);
    this.el.onclick = (e) => {
      const b = e.target.closest('[data-w]'); if (!b) return;
      const w = b.dataset.w;
      if (w === 'play') { if (A.playing() && PLAYER === this) this.stop(); else this.play(); }
      if (w === 'loops') { this.loops = { 1: 3, 3: 99, 99: 1 }[this.loops]; b.textContent = this.loopLabel(); }
      if (w === 'speed') { this.speed = { 1: 0.5, 0.5: 0.75, 0.75: 1.25, 1.25: 1 }[this.speed]; this.render(); }
      if (w === 'click') { this.click = !this.click; b.classList.toggle('on', this.click); }
    };
  }
  loopLabel() { return this.loops === 99 ? 'Loop ∞' : `×${this.loops}`; }
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
  play() {
    stopAll();
    PLAYER = this;
    qs('[data-w=play]', this.el).textContent = '■ Stop';
    const bpm = this.bpm * this.speed;
    A.playEvents(this.c.events, {
      bpm, loops: this.loops, countIn: 0, clickTrack: this.click,
      sound: 'guitar',
      onEvent: (e) => {
        this.showFrame(e.frame ?? 0, e.hl, e);
        const big = qs('.big', this.el);
        if (big) big.textContent = e.kind === 'note' && e.hl && e.hl.length === 1 ? (qs(`.dot[data-k="${e.hl[0]}"] text`, this.el)?.textContent || '') : '';
        if (this.c.rhythm && e.slot != null) { qsa('.rslot', this.el).forEach((s) => s.classList.toggle('cur', Number(s.dataset.i) === e.slot)); }
      },
      onDone: () => this.stopped(),
    });
  }
  stop() { A.stopPlayer(); this.stopped(); }
  stopped() { if (PLAYER === this) PLAYER = null; const b = qs('[data-w=play]', this.el); if (b) b.textContent = '▶ Play'; qsa('.rslot.cur', this.el).forEach((s) => s.classList.remove('cur')); }
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
    <button class="primary start" data-act="start" ${elig ? '' : 'disabled'}>Start session${elig ? '' : ' (no cards match)'}</button>
    <p class="muted small" style="text-align:center">${elig} card types match these settings</p>
  </div>
  <div class="panel">
    <div class="row spread"><div><div class="ring">${pct(prog.mastered)}%</div><span class="muted small">mastered · ${pct(prog.seen)}% seen</span></div>
    <div class="muted small" style="text-align:right">${prog.mastered}/${prog.total} mastered<br>${prog.seen} seen</div></div>
    ${Object.entries(prog.byCat).sort((a, b) => a[1].mode.localeCompare(b[1].mode)).map(([c, v]) => `<div class="catrow"><span>${esc(AD.CAT_LABEL[c] || c)} <span class="muted small">L${AD.catLevel(c).toFixed(1)}</span></span><div class="bar"><i style="width:${(100 * v.seen) / v.total}%"></i><i class="m" style="width:${(100 * v.mastered) / v.total}%"></i></div><span class="muted small">${v.mastered}/${v.total}</span></div>`).join('')}
  </div>
  <div class="navgrid">
    <button data-act="songs"><b>🎼 Songs</b><small>Annotated progressions</small></button>
    <button data-act="toolbox"><b>🧰 Toolbox</b><small>What to play over what</small></button>
    <button data-act="concepts"><b>📖 Lessons</b><small>Concept deep-dives</small></button>
    <button data-act="library"><b>🗂 Library</b><small>Browse every card</small></button>
  </div>
  ${LIB.errors.length ? `<p class="muted small">Content not loaded: ${esc(LIB.errors.join('; '))}</p>` : ''}`;
  $app.onclick = (e) => {
    const b = e.target.closest('button'); if (!b) return;
    const S = st().settings;
    if (b.dataset.mode) { const m = b.dataset.mode; S.modes = S.modes.includes(m) ? S.modes.filter((x) => x !== m) : [...S.modes, m]; if (!S.modes.length) S.modes = [m]; AD.save(); renderHome(); }
    else if (b.dataset.cat) { const [m, c] = b.dataset.cat.split('|'); const l = S.cats[m] || []; S.cats[m] = l.includes(c) ? l.filter((x) => x !== c) : [...l, c]; AD.save(); renderHome(); }
    else if (b.dataset.len) { S.length = b.dataset.len; AD.save(); renderHome(); }
    else if (b.dataset.sess) { const [t, n] = b.dataset.sess.split('|'); S.session = { type: t, n: Number(n) }; AD.save(); renderHome(); }
    else if (b.dataset.tag) { const f = qs('#focus'); f.value = f.value ? f.value + ', ' + b.dataset.tag : b.dataset.tag; st().focus = f.value; AD.save(); }
    else if (b.dataset.act === 'start') { st().focus = qs('#focus').value; AD.save(); startSession(); }
    else if (b.dataset.act === 'songs') renderSongs();
    else if (b.dataset.act === 'toolbox') renderToolbox();
    else if (b.dataset.act === 'concepts') renderConcepts();
    else if (b.dataset.act === 'library') renderLibrary();
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
function startSession(onlyTpl = null) {
  SESSION = { cards: [], seen: new Set(), queue: [], start: Date.now(), results: [], only: onlyTpl, levels0: { ...Object.fromEntries(Object.keys(AD.CAT_LABEL).map((c) => [c, AD.catLevel(c)])) } };
  st().sessions++; AD.save();
  keepAwake(true);
  nextCard();
}
function sessionDone() {
  const s = st().settings.session;
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
      const tpl = SESSION.only ? SESSION.only : AD.pickTemplate(LIB, SESSION);
      if (!tpl) { toast('No cards match your settings'); return renderHome(); }
      card = instantiate(tpl, AD.paramChooser(tpl));
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
  A.startMetronome({ bpm: cardBpm(), meter: m.meter || '4/4', subdivision: m.subdivision || 1, swing: m.swing || 0, accent: m.accent !== false, gap: m.gap, clickOn: m.clickOn,
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
  const total = SESSION.only ? '' : st().settings.session.type === 'cards' ? `/${st().settings.session.n}` : ` · ${Math.round((Date.now() - SESSION.start) / 60000)}/${st().settings.session.n}m`;
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
function contextHTML(card) {
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
    ${c.example ? `<button data-c="ctxplay" data-i="${i}">▶ Hear it in context</button><div class="ctxw" id="ctxw${i}"></div>` : ''}</div>`).join('');
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
    el.innerHTML = CARD.answered ? `<button class="r3" data-c="next">Next →</button>` : `<button data-c="rate1">Skip</button>`;
    return;
  }
  if (Q && Q.selfRate && !CARD.answered) { el.className = 'rate one'; el.innerHTML = `<button data-c="rate2">Skip</button>`; return; }
  el.className = 'rate';
  el.innerHTML = `<button class="r1" data-c="rate1">Too hard</button><button class="r2" data-c="rate2">Hard</button><button class="r3" data-c="rate3">Good ✓</button><button class="r4" data-c="rate4">Easy</button>`;
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
  if (!hasVary || SESSION.only) return;
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
  const word = (e) => (e >= 3.5 ? 'easy' : e >= 2.9 ? 'good' : e >= 2 ? 'hard' : 'too hard');
  $app.innerHTML = `<h1>Session done</h1><p class="muted">${res.length} cards · ${mins} min</p>
  ${moved.length ? `<div class="panel"><h3>Level changes</h3>${moved.map(([c, d]) => `<div class="catrow"><span>${esc(AD.CAT_LABEL[c])}</span><span>${d > 0 ? '▲' : '▼'} ${Math.abs(d).toFixed(2)}</span><span class="muted small">L${AD.catLevel(c).toFixed(1)}</span></div>`).join('')}</div>` : ''}
  <div class="panel list">${res.map((r, i) => `<button class="item" data-i="${i}"><span>${esc(r.card.text(r.card.tpl.title))}<br><small>${esc(AD.CAT_LABEL[r.card.tpl.category] || '')}${r.tempo ? ' · ' + r.tempo + ' bpm' : ''}</small></span><span class="badge ${r.eff >= 3 ? 'm' : ''}">${word(r.eff)}</span></button>`).join('')}</div>
  <button class="primary start" data-s="home">Done</button><button class="start" data-s="again">Another session</button>`;
  $app.onclick = (e) => { const b = e.target.closest('[data-s]'); if (!b) return; if (b.dataset.s === 'home') renderHome(); else startSession(); };
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
