// Memory pack: keys, modes, functional harmony and guide tones drilled with no instrument.
// Understand → Derive → Recall → Fluency → Interleave, with spaced repetition and a daily session.
import { esc, md } from './render.js';
import * as E from './memory/engine.js';
import { UNITS, MODULES, buildDeck, contrast } from './memory/cards.js';
import * as M from './memory/store.js';
import { visualHTML, stripSVG, circleSVG, clockSVG } from './memory/visuals.js';

let DECK = null, BYID = null, $root = null, BACK = null;
const UNIT = Object.fromEntries(UNITS.map((u) => [u.id, u]));
const TYPE_LABEL = { spell: 'Spell', name: 'Name', reverse: 'Reverse', reeloff: 'Reel-off', contrast: 'Contrast' };
const STAGE_LABEL = { derive: 'Derive · rule shown', recall: 'Recall', fluency: 'Fluency · ~2 s', review: 'Review', warmup: 'Warm-up', close: 'Mixed', walk: 'Walk mode' };
const shuffle = (a) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
const isNote = (s) => /^[A-G](𝄫|𝄪|♭|♯)?$/.test(s);

function loadDeck() {
  if (DECK) return;
  DECK = buildDeck();
  BYID = new Map(DECK.map((c) => [c.id, c]));
  for (const dc of M.state().contrasts) addDynamicContrast(dc);
  M.setDeck(DECK);
}
const MODE_BY_NAME = Object.fromEntries(E.MODES.map((m) => [m.name, m.id]));
function addDynamicContrast(dc) {
  const base = BYID.get(dc.base); if (!base || BYID.has(dc.id)) return null;
  let c;
  if (MODE_BY_NAME[base.answer[0]] && MODE_BY_NAME[dc.alt]) c = { ...contrast(MODE_BY_NAME[base.answer[0]], MODE_BY_NAME[dc.alt], base.unit, base.module), id: dc.id };
  else c = { ...base, id: dc.id, type: 'contrast', input: 'choice', choices: [base.answer[0], dc.alt].sort(), prompt: `${base.prompt} (you’ve mixed these up)`, why: `${base.why} Not ${dc.alt}.`, reverse_of: null, traps: [], accept: [] };
  DECK.push(c); BYID.set(c.id, c);
  return c;
}

// ---------- spoken prompts (walk mode) ----------
const ROMAN = { I: 'one', II: 'two', III: 'three', IV: 'four', V: 'five', VI: 'six', VII: 'seven' };
export function spoken(t) {
  return String(t)
    .replace(/m7♭5/g, ' minor seven flat five').replace(/mMaj7/g, ' minor major seven').replace(/maj7/g, ' major seven').replace(/ø7/g, ' half diminished').replace(/°7/g, ' diminished seven')
    .replace(/(^|[\s(/–])(♭?)(VII|VI|IV|V|III|II|I|vii|vi|iv|v|iii|ii|i)(7)?(?=[\s?,).:/–]|$)/g, (m, pre, fl, r, sev) => `${pre}${fl ? 'flat ' : ''}${ROMAN[r.toUpperCase()]}${r === r.toLowerCase() ? ' minor' : ''}${sev ? ' seven' : ''}`)
    .replace(/(\w)\/(\w)/g, '$1 of $2')
    .replace(/m7/g, ' minor seven').replace(/([A-G][♭♯]?)7/g, '$1 seven')
    .replace(/𝄫/g, ' double flat').replace(/𝄪/g, ' double sharp').replace(/♭/g, ' flat').replace(/♯/g, ' sharp')
    .replace(/→/g, ' to ').replace(/↔/g, ' and ').replace(/\|/g, ', then, ').replace(/–/g, ', ');
}
function say(t) { try { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(spoken(t)); u.rate = 0.95; speechSynthesis.speak(u); } catch (e) { /* no speech */ } }

// ---------- pack home ----------
export function renderMemoryPack($app, { onBack } = {}) {
  $root = $app; BACK = onBack || (() => {});
  loadDeck();
  window.scrollTo(0, 0);
  const st = M.state();
  const now = Date.now();
  const counts = { learning: 0, review: 0, fluent: 0, mature: 0 };
  for (const id of Object.keys(st.cards)) counts[st.cards[id].st] = (counts[st.cards[id].st] || 0) + 1;
  const due = DECK.filter((c) => M.isDue(c.id, now)).length;
  const nextU = M.newUnitToday() ? null : M.nextNewUnit();
  $root.innerHTML = `
  <div class="row spread"><button class="icon" data-mp="back" aria-label="Back">←</button><h2 style="margin:0">Memory pack</h2><span></span></div>
  <p class="muted small">Keys, modes, functional harmony and guide tones — facts to recall instantly with no instrument. Each one is taught as a rule you can rebuild, then drilled until you don’t need the rule.</p>
  <div class="navgrid">
    <button data-mp="daily" class="mp-daily" style="grid-column:1/-1"><b>▶ Daily session</b><small>~15–20 min · ${due} due${nextU ? ` · new unit: ${esc(nextU.id)} ${esc(nextU.name)}` : M.newUnitToday() ? ` · today’s new unit: ${esc(M.newUnitToday())}` : ''}</small></button>
    <button data-mp="walk"><b>🚶 Walk mode</b><small>Prompts read aloud; answer aloud</small></button>
    <button data-mp="speed"><b>⚡ Speed round</b><small>Fluent cards against the clock</small></button>
  </div>
  <div class="mp-stats">${['learning', 'review', 'fluent', 'mature'].map((k) => `<div><b>${counts[k] || 0}</b><span>${k}</span></div>`).join('')}</div>
  ${MODULES.map((mo) => `<h3>${mo.id}. ${esc(mo.name)}</h3><p class="muted small mp-modblurb">${esc(mo.blurb)}</p>
    <div class="mp-units">${UNITS.filter((u) => u.module === mo.id).map((u) => {
      const s = M.unitStatus(u.id), rel = M.released(DECK, u.id), all = M.unitDeck(DECK, u.id);
      const p = M.pctReviewed(all);
      return `<button class="mp-unit ${s}" data-unit="${u.id}"><span class="mp-uid">${u.id}</span><span class="grow"><b>${esc(u.name)}</b><small>${s === 'locked' ? '🔒 locked — finish the unit before' : s === 'new' ? 'Not started' : `${Math.round(100 * M.pctFacts(all))}% of facts learned · ${all.length} cards, all 12 keys`}</small><i class="mp-bar"><i style="width:${Math.round(100 * p)}%"></i></i></span><span class="mp-chip">${s === 'locked' ? '🔒' : s === 'new' ? 'New' : s === 'learning' ? 'Learning' : 'Review'}</span></button>`;
    }).join('')}</div>`).join('')}
  <h3>Settings</h3>
  <div class="row mp-set"><button data-mp="unlockall" class="${st.settings.unlockAll ? 'on' : ''}">${st.settings.unlockAll ? '✓ ' : ''}Unlock all units</button><button data-mp="reset" class="ghost">Reset progress</button></div>
  <p class="muted small">Every key is in play from the start: new cards come in random keys. A unit unlocks when 80% of the previous unit’s facts are in Review (in any key). At most one new unit a day.</p>`;
  $root.onclick = (e) => {
    const b = e.target.closest('button'); if (!b) return;
    const a = b.dataset.mp;
    if (a === 'back') { stopSpeech(); BACK(); return; }
    if (b.dataset.unit) return renderUnit(b.dataset.unit);
    if (a === 'daily') return runQueue(dailyQueue(), { title: 'Daily session' });
    if (a === 'walk') return runWalk();
    if (a === 'speed') { const q = speedQueue(); if (!q.length) return toastMsg('No fluent cards yet: cards become fluent after three fast correct answers.'); return runQueue(q, { title: 'Speed round' }); }
    if (a === 'unlockall') { st.settings.unlockAll = !st.settings.unlockAll; M.save(); return renderMemoryPack($root, { onBack: BACK }); }
    if (a === 'reset') { if (confirm('Reset all Memory pack progress?')) { M.reset(); DECK = null; return renderMemoryPack($root, { onBack: BACK }); } }
  };
}
function toastMsg(t) { const d = document.createElement('div'); d.className = 'mp-toast'; d.textContent = t; document.body.appendChild(d); setTimeout(() => d.remove(), 2600); }
function stopSpeech() { try { speechSynthesis.cancel(); } catch (e) { /* */ } }

// ---------- unit page ----------
function renderUnit(uid) {
  const u = UNIT[uid];
  const s = M.unitStatus(uid);
  const all = M.unitDeck(DECK, uid), rel = M.released(DECK, uid);
  const by = { new: 0, learning: 0, review: 0, fluent: 0, mature: 0 };
  for (const c of all) by[M.cardState(c.id)]++;
  window.scrollTo(0, 0);
  $root.innerHTML = `
  <div class="row spread"><button class="icon" data-mp="home" aria-label="Back">←</button><h2 style="margin:0">${u.id} · ${esc(u.name)}</h2><span></span></div>
  ${s === 'locked' ? `<div class="panel mp-locked">🔒 Locked until 80% of ${esc(u.after || UNITS[UNITS.indexOf(u) - 1].id)}’s facts are in Review. You can read the explainer now. <button data-mp="force">Unlock anyway</button></div>` : ''}
  <div class="panel"><div class="mp-vis">${visualHTML(u.visual)}</div><div class="md mp-md">${md(u.md)}</div></div>
  <div class="mp-ladder">${['Understand', 'Derive', 'Recall', 'Fluency', 'Interleave'].map((x, i) => `<span>${i + 1} ${x}</span>`).join('')}</div>
  ${s !== 'locked' ? `<div class="navgrid">
    <button data-mp="learn" style="grid-column:1/-1"><b>${s === 'new' ? '▶ Start: derive → recall' : '▶ Learn more: derive → recall'}</b><small>3 cards with the rule shown, then recall with hints</small></button>
    <button data-mp="practise"><b>🔁 Practise</b><small>${rel.length} cards across all keys, due first</small></button>
    <button data-mp="fluency"><b>⚡ Fluency round</b><small>Timed, ~2 s per fact</small></button>
  </div>` : ''}
  <div class="mp-stats">${Object.entries(by).map(([k, v]) => `<div><b>${v}</b><span>${k}</span></div>`).join('')}</div>
  <p class="muted small">All 12 keys. Card types: ${[...new Set(all.map((c) => TYPE_LABEL[c.type]))].join(', ')}.</p>`;
  $root.onclick = (e) => {
    const b = e.target.closest('button'); if (!b) return;
    const a = b.dataset.mp;
    if (a === 'home') return renderMemoryPack($root, { onBack: BACK });
    if (a === 'force') { M.state().units[uid] = { ...(M.state().units[uid] || {}), forced: true }; M.save(); return renderUnit(uid); }
    if (a === 'learn') return runQueue(learnQueue(uid, true), { title: `${uid} ${u.name}`, back: () => renderUnit(uid) });
    if (a === 'practise') return runQueue(practiseQueue(uid), { title: `${uid} practice`, back: () => renderUnit(uid) });
    if (a === 'fluency') { const q = fluencyQueue(uid); if (!q.length) return toastMsg('Nothing in Review here yet — learn a few cards first.'); return runQueue(q, { title: `${uid} fluency`, back: () => renderUnit(uid) }); }
  };
}

// ---------- queues ----------
function interleave(cards) {
  // round-robin across units so similar facts don't sit next to each other
  const groups = {};
  for (const c of cards) (groups[c.unit] = groups[c.unit] || []).push(c);
  const lists = Object.values(groups).map(shuffle);
  const out = [];
  while (lists.some((l) => l.length)) for (const l of lists) if (l.length) out.push(l.shift());
  return out;
}
function deriveSet(uid, n) {
  // fresh rank-0 cards, varied types (spell/name/reverse before reel-offs)
  // one card per fact first, each in a random key, so new material arrives across all 12 keys
  const seenFacts = new Set(M.unitDeck(DECK, uid).filter((c) => M.cardState(c.id) !== 'new').map(M.factOf));
  const pool = shuffle(M.released(DECK, uid).filter((c) => M.cardState(c.id) === 'new'));
  const firstPer = new Map();
  for (const c of pool) { const f = M.factOf(c); if (!seenFacts.has(f) && !firstPer.has(f)) firstPer.set(f, c); }
  const fresh = firstPer.size ? [...firstPer.values()] : pool;
  const byType = {};
  for (const c of shuffle(fresh)) (byType[c.type] = byType[c.type] || []).push(c);
  const order = ['spell', 'name', 'reverse', 'contrast', 'reeloff'].filter((t) => byType[t]);
  const out = [];
  while (out.length < n && order.some((t) => byType[t].length)) for (const t of order) if (byType[t].length && out.length < n) out.push(byType[t].shift());
  return out;
}
function learnQueue(uid, withExplainer) {
  if (!M.state().units[uid]) M.startUnit(uid);
  const derive = deriveSet(uid, 3);
  const recall = deriveSet(uid, 9).filter((c) => !derive.includes(c)).slice(0, 6);
  const dueHere = M.released(DECK, uid).filter((c) => M.isDue(c.id)).slice(0, 4);
  return [
    ...(withExplainer ? [{ explainer: uid, phase: 'new' }] : []),
    ...derive.map((card) => ({ card, stage: 'derive', phase: 'new' })),
    ...shuffle([...recall, ...dueHere]).map((card) => ({ card, stage: 'recall', phase: 'new' })),
  ];
}
function practiseQueue(uid) {
  const rel = M.released(DECK, uid);
  const due = rel.filter((c) => M.isDue(c.id)).sort((a, b) => M.state().cards[a.id].due - M.state().cards[b.id].due);
  const fresh = shuffle(rel.filter((c) => M.cardState(c.id) === 'new'));
  const rest = shuffle(rel.filter((c) => !due.includes(c) && !fresh.includes(c)));
  return [...due, ...fresh, ...rest].slice(0, 12).map((card) => ({ card, stage: M.cardState(card.id) === 'new' ? 'recall' : 'review' }));
}
function fluencyQueue(uid) {
  return shuffle(M.unitDeck(DECK, uid).filter((c) => M.REVIEWED.has(M.cardState(c.id)) && c.type !== 'reeloff')).slice(0, 10).map((card) => ({ card, stage: 'fluency' }));
}
function speedQueue() {
  return shuffle(DECK.filter((c) => ['fluent', 'mature'].includes(M.cardState(c.id)) && c.type !== 'reeloff')).slice(0, 15).map((card) => ({ card, stage: 'fluency' }));
}
function dailyQueue() {
  const st = M.state(), now = Date.now();
  const seen = DECK.filter((c) => st.cards[c.id]);
  const used = new Set();
  const take = (list, n) => list.filter((c) => !used.has(c.id)).slice(0, n).map((c) => { used.add(c.id); return c; });
  const warm = take(shuffle(seen.filter((c) => ['fluent', 'mature'].includes(M.cardState(c.id)) && c.type !== 'reeloff')), 6);
  const due = take(interleave(seen.filter((c) => M.isDue(c.id, now))), 30);
  let fresh = [];
  const nu = M.newUnitToday() ? null : M.nextNewUnit();
  if (nu) fresh = learnQueue(nu.id, true);
  else {
    // keep going with started units: their released, unseen cards
    const started = UNITS.filter((u) => st.units[u.id]).map((u) => u.id);
    const cands = interleave(started.flatMap((uid) => M.released(DECK, uid).filter((c) => M.cardState(c.id) === 'new')));
    fresh = take(cands, 8).map((card, i) => ({ card, stage: i < 2 ? 'derive' : 'recall', phase: 'new' }));
  }
  fresh.forEach((x) => x.card && used.add(x.card.id));
  const week = now - 7 * 86400000;
  const close = take(interleave(seen.filter((c) => (st.cards[c.id].last || 0) >= week)), 6);
  return [
    ...warm.map((card) => ({ card, stage: 'fluency', phase: 'warmup' })),
    ...due.map((card) => ({ card, stage: 'review', phase: 'reviews' })),
    ...fresh,
    ...close.map((card) => ({ card, stage: 'review', phase: 'close' })),
  ];
}

// ---------- runner ----------
const BUDGET = { warmup: 2, reviews: 10, new: 6, close: 2 }; // minutes
let R = null;
function runQueue(items, { title, back } = {}) {
  if (!items.length) { toastMsg('Nothing to do here right now.'); return; }
  R = { items, i: 0, title, back: back || (() => renderMemoryPack($root, { onBack: BACK })), phaseStart: {}, done: [], requeued: new Set() };
  drawItem();
}
function phaseOver(it) {
  if (!it.phase || !BUDGET[it.phase]) return false;
  const t0 = R.phaseStart[it.phase] ?? (R.phaseStart[it.phase] = Date.now());
  return Date.now() - t0 > BUDGET[it.phase] * 60000;
}
function nextItem() {
  R.i++;
  while (R.i < R.items.length && R.items[R.i].card && phaseOver(R.items[R.i])) R.i++;
  if (R.i >= R.items.length) return drawSummary();
  drawItem();
}
function header() {
  const it = R.items[R.i];
  return `<div class="row spread mp-top"><button class="icon" data-run="exit" aria-label="Exit">✕</button><span class="small muted">${esc(R.title)} · ${R.i + 1}/${R.items.length}</span><span class="mp-stage">${esc(it.explainer ? 'Understand' : STAGE_LABEL[it.phase === 'warmup' ? 'warmup' : it.phase === 'close' ? 'close' : it.stage] || '')}</span></div>`;
}
function drawItem() {
  const it = R.items[R.i];
  window.scrollTo(0, 0);
  if (it.explainer) {
    const u = UNIT[it.explainer];
    M.startUnit(u.id);
    $root.innerHTML = `${header()}<div class="panel"><div class="mp-type">Understand · ${u.id}</div><h2>${esc(u.name)}</h2><div class="mp-vis">${visualHTML(u.visual)}</div><div class="md mp-md">${md(u.md)}</div></div><button class="primary" style="width:100%" data-run="next">Got it — derive the first cards</button>`;
    $root.onclick = runClick;
    return;
  }
  const c = it.card;
  const C = (R.cur = { card: c, stage: it.stage, hints: 0, t0: Date.now(), input: [], done: false, typed: false, revealed: false });
  const target = targetMs(c);
  C.target = target;
  $root.innerHTML = `${header()}
  <div class="panel mp-card">
    <div class="mp-type">${TYPE_LABEL[c.type]} · ${c.unit} ${esc(UNIT[c.unit].name)}</div>
    <div class="mp-prompt">${esc(c.prompt)}</div>
    ${it.stage === 'derive' ? `<div class="mp-rule"><b>Rule:</b> ${esc(c.hints[0])}<div class="small">${esc(c.hints[1])}</div></div>` : ''}
    ${it.stage === 'fluency' ? `<div class="mp-timer"><i style="animation-duration:${target}ms"></i></div>` : ''}
    <div id="mp-hints" class="mp-hints"></div>
    <div id="mp-input"></div>
    <div id="mp-fb"></div>
  </div>
  <div class="row mp-tools">${it.stage !== 'derive' ? '<button data-run="hint">💡 Hint 1/3</button>' : ''}<button data-run="explain">📖 Explainer</button><button data-run="speak" aria-label="Read the prompt aloud">🔊</button><span class="grow"></span><button data-run="skip" class="ghost">Skip</button></div>
  <div id="mp-explain"></div>`;
  drawInput();
  $root.onclick = runClick;
}
function targetMs(c) {
  if (c.type === 'reeloff') return 1000 * Math.max(4, c.answer.length);
  if (c.input === 'choice') return 2000;
  return 1600 + 900 * (c.answer.length - 1);
}
function drawInput() {
  const C = R.cur, c = C.card, box = document.getElementById('mp-input');
  if (c.input === 'choice') {
    box.innerHTML = `<div class="qgrid mp-choices ${c.choices.length > 6 ? 'many' : ''}">${c.choices.map((x, i) => `<button data-choice="${i}">${esc(x)}</button>`).join('')}</div>`;
  } else if (c.input === 'self' && !C.typed) {
    box.innerHTML = `<div class="mp-reel"><span id="mp-clock">0.0 s</span><span class="muted small">Say it aloud, in tempo (~${Math.round(C.target / 1000)} s), then reveal.</span></div>
      <div class="row"><button class="primary grow" data-run="reveal">Reveal</button>${c.answer.every(isNote) ? '<button data-run="type">⌨ Type it</button>' : ''}</div>`;
    tickClock();
  } else {
    box.innerHTML = `<div class="mp-entry" id="mp-entry"></div>
      <div class="mp-keys">${E.LETTERS.map((l) => `<button data-key="${l}">${l}</button>`).join('')}</div>
      <div class="mp-keys acc">${['♭', '♯', '𝄫', '𝄪'].map((a) => `<button data-acc="${a}">${a}</button>`).join('')}<button data-run="bksp" aria-label="Backspace">⌫</button></div>
      <button class="primary" style="width:100%" data-run="check">Check${c.answer.length > 1 ? ` (${c.answer.length} notes)` : ''}</button>`;
    drawEntry();
  }
}
function tickClock() {
  const C = R.cur; const el = document.getElementById('mp-clock');
  if (!el || C.revealed || C !== R.cur) return;
  el.textContent = `${((Date.now() - C.t0) / 1000).toFixed(1)} s`;
  el.classList.toggle('late', Date.now() - C.t0 > C.target);
  setTimeout(tickClock, 100);
}
function drawEntry() { const el = document.getElementById('mp-entry'); if (el) el.innerHTML = R.cur.input.length ? R.cur.input.map((n) => `<span class="mp-note">${esc(n)}</span>`).join('') : '<span class="muted small">Tap letters, then ♭ ♯ to alter the last one</span>'; }
const gradeCap = (h) => (h >= 3 ? 1 : h >= 1 ? 2 : 4);

function runClick(e) {
  const b = e.target.closest('button'); if (!b) return;
  const a = b.dataset.run, C = R.cur;
  if (a === 'exit') { stopSpeech(); R.back(); return; }
  if (a === 'next') return nextItem();
  if (!C) return;
  if (a === 'explain') { const el = document.getElementById('mp-explain'); el.innerHTML = el.innerHTML ? '' : `<div class="panel md">${md(UNIT[C.card.unit].md)}</div>`; return; }
  if (a === 'speak') { say(C.card.prompt); return; }
  if (a === 'skip') return nextItem();
  if (C.done) return;
  if (a === 'hint') {
    if (C.hints >= 3) return;
    C.hints++;
    document.getElementById('mp-hints').innerHTML = C.card.hints.slice(0, C.hints).map((h, i) => `<div class="mp-hint"><b>${['Rule', 'First step', 'Start'][i]}:</b> ${esc(h)}</div>`).join('') + `<div class="muted small">Grade capped at ${['', 'Hard', 'Hard', 'Again'][C.hints]}.</div>`;
    b.textContent = C.hints >= 3 ? '💡 No more hints' : `💡 Hint ${C.hints + 1}/3`;
    return;
  }
  if (b.dataset.key) { C.input.push(b.dataset.key); drawEntry(); return; }
  if (b.dataset.acc) {
    if (!C.input.length) return;
    const last = C.input[C.input.length - 1], letter = last[0], acc = last.slice(1);
    C.input[C.input.length - 1] = letter + (acc === b.dataset.acc ? '' : b.dataset.acc);
    drawEntry(); return;
  }
  if (a === 'bksp') { C.input.pop(); drawEntry(); return; }
  if (a === 'check') return finishAuto(C.input);
  if (b.dataset.choice != null) return finishAuto([C.card.choices[Number(b.dataset.choice)]], b);
  if (a === 'type') { C.typed = true; drawInput(); return; }
  if (a === 'reveal') return reveal();
  if (b.dataset.grade) return selfGrade(Number(b.dataset.grade));
}

// compare an answer and explain what went wrong
function evaluate(card, input) {
  const s = input.join(' ');
  if (s === card.answer.join(' ')) return { ok: true };
  const acc = (card.accept || []).find((x) => x.join(' ') === s);
  if (acc) {
    const trap = (card.traps || []).find((t) => t.ok && t.answer.join(' ') === s);
    return { ok: true, note: trap ? trap.msg : `Also correct; the card’s spelling is ${card.answer.join(' ')}.` };
  }
  const trap = (card.traps || []).find((t) => !t.ok && t.answer.join(' ') === s);
  if (trap) return { ok: false, msg: trap.msg };
  if (input.length === card.answer.length && input.every(isNote) && card.answer.every(isNote)) {
    const pcs = (arr) => arr.map((n) => E.pc(E.N(n))).join(',');
    if (pcs(input) === pcs(card.answer)) {
      const odd = card.answer.find((n, i) => n !== input[i] && /^(E♯|B♯|C♭|F♭)$/.test(n));
      return { ok: false, msg: odd ? `Right pitch, wrong letter. ${odd} is a real note: the spelling needs that letter so each letter appears once.` : `Right pitch, wrong letter. ${card.letterMsg}` };
    }
  }
  if (input.length && input.length !== card.answer.length && card.input === 'keypad') return { ok: false, msg: `The answer has ${card.answer.length} note${card.answer.length > 1 ? 's' : ''}.` };
  return { ok: false };
}
function finishAuto(input, btn) {
  const C = R.cur; if (C.done) return;
  if (C.card.input !== 'choice' && !input.length) return;
  C.done = true;
  const ms = Date.now() - C.t0;
  const ev = evaluate(C.card, input);
  let grade = ev.ok ? (ms <= C.target ? 4 : ms <= C.target * 3 ? 3 : 2) : 1;
  grade = Math.min(grade, gradeCap(C.hints));
  if (C.stage === 'derive' && ev.ok) grade = Math.min(grade, 3);
  if (C.card.input === 'choice') document.querySelectorAll('[data-choice]').forEach((x) => { const v = C.card.choices[Number(x.dataset.choice)]; if (v === C.card.answer[0]) x.classList.add('right'); else if (x === btn) x.classList.add('wrong'); });
  let created = null;
  if (!ev.ok && C.card.input === 'choice') created = M.noteConfusion(C.card, input[0]);
  if (created) { const cc = addDynamicContrast(created); if (cc) R.items.splice(Math.min(R.items.length, R.i + 4), 0, { card: cc, stage: 'recall' }); }
  M.schedule(C.card, grade, { ms, unaided: C.hints === 0 && C.stage !== 'derive', target: C.target });
  if (!ev.ok && !R.requeued.has(C.card.id)) { R.requeued.add(C.card.id); R.items.splice(Math.min(R.items.length, R.i + 4), 0, { card: C.card, stage: 'recall', phase: R.items[R.i].phase }); }
  R.done.push({ id: C.card.id, ok: ev.ok, grade });
  feedback(ev, grade, ms, created, input);
}
function reveal() {
  const C = R.cur; C.revealed = true;
  const ms = Date.now() - C.t0; C.ms = ms;
  const cap = gradeCap(C.hints);
  document.getElementById('mp-input').innerHTML = `<div class="mp-answer">${esc(C.card.answerText || C.card.answer.join(' '))}</div>
    <p class="mp-why">${esc(C.card.why)}</p><p class="muted small">${(ms / 1000).toFixed(1)} s${ms <= C.target ? ' — in tempo' : ''}. How did you do?</p>
    <div class="mp-grades">${[[1, 'Again'], [2, 'Hard'], [3, 'Good'], [4, 'Easy']].map(([g, l]) => `<button data-grade="${g}" class="g${g}" ${g > cap ? 'disabled' : ''}>${l}</button>`).join('')}</div>`;
}
function selfGrade(g) {
  const C = R.cur; if (C.done) return;
  C.done = true;
  M.schedule(C.card, g, { ms: g >= 3 ? C.ms : null, unaided: C.hints === 0 && C.stage !== 'derive', target: C.target });
  R.done.push({ id: C.card.id, ok: g >= 2, grade: g });
  if (g === 1 && !R.requeued.has(C.card.id)) { R.requeued.add(C.card.id); R.items.splice(Math.min(R.items.length, R.i + 4), 0, { card: C.card, stage: 'recall', phase: R.items[R.i].phase }); }
  nextItem();
}
function cardVisual(c) {
  const mode = (c.tags || []).find((t) => E.MODE[t]);
  if (mode) return stripSVG(E.MODE[mode].f);
  if (c.unit === 'A2' || c.unit === 'A3' || c.unit === 'C1') return circleSVG({ highlight: c.answer.filter(isNote).map((n) => E.pc(E.N(n))), minor: c.unit === 'A3' });
  if (c.unit === 'C2' || (c.unit === 'D1' && c.tags.includes('tritone')) || c.unit === 'B4') return clockSVG({ pcs: c.answer.filter(isNote).map((n) => E.pc(E.N(n))), line: c.unit === 'C2' });
  return '';
}
function feedback(ev, grade, ms, created, input) {
  const C = R.cur, c = C.card;
  const vis = cardVisual(c);
  if (c.input !== 'choice') document.getElementById('mp-input').innerHTML = `<div class="mp-entry ${ev.ok ? 'ok' : 'no'}">${input.map((n) => `<span class="mp-note">${esc(n)}</span>`).join('') || '—'}</div>`;
  document.getElementById('mp-fb').innerHTML = `
    <div class="feedback ${ev.ok ? 'ok' : 'no'}">${ev.ok ? '✓ Right' : '✗ Not quite'} <span class="small" style="font-weight:500">· ${(ms / 1000).toFixed(1)} s · ${['', 'Again', 'Hard', 'Good', 'Easy'][grade]}</span></div>
    ${ev.ok ? '' : `<div class="mp-answer">${esc(c.answerText || c.answer.join(' '))}</div>`}
    ${ev.ok && c.answerText ? `<div class="mp-answer small">${esc(c.answerText)}</div>` : ''}
    ${ev.msg ? `<div class="mp-err">⚠ ${esc(ev.msg)}</div>` : ''}${ev.note ? `<div class="mp-note2">${esc(ev.note)}</div>` : ''}
    <p class="mp-why">${esc(c.why)}</p>
    ${vis ? `<div class="mp-vis small">${vis}</div>` : ''}
    ${created ? '<p class="muted small">You’ve mixed these up twice, so a Contrast card has been added.</p>' : ''}
    <button class="primary" style="width:100%" data-run="next">Next</button>`;
  if (R.walk) say(`${ev.ok ? 'Right.' : 'The answer is ' + (c.answerText || c.answer.join(' ')) + '.'}`);
}
function drawSummary() {
  const n = R.done.length, ok = R.done.filter((x) => x.ok).length;
  const fluent = R.done.filter((x) => M.cardState(x.id) === 'fluent').length;
  R.cur = null;
  $root.innerHTML = `<div class="panel" style="text-align:center"><h2>${esc(R.title)} done</h2><div class="mp-stats"><div><b>${n}</b><span>cards</span></div><div><b>${n ? Math.round((100 * ok) / n) : 0}%</b><span>right</span></div><div><b>${fluent}</b><span>fluent</span></div></div></div><button class="primary" style="width:100%" data-run="exit">Done</button>`;
  $root.onclick = runClick;
}

// ---------- walk mode ----------
function runWalk() {
  const st = M.state();
  const ok = (c) => ['reeloff', 'name', 'reverse'].includes(c.type);
  let pool = DECK.filter((c) => ok(c) && M.isDue(c.id));
  if (pool.length < 10) pool = pool.concat(shuffle(DECK.filter((c) => ok(c) && st.cards[c.id] && !pool.includes(c))));
  if (pool.length < 10) pool = pool.concat(UNITS.filter((u) => st.units[u.id]).flatMap((u) => M.released(DECK, u.id).filter((c) => ok(c) && !pool.includes(c))));
  if (!pool.length) pool = M.released(DECK, 'A1').filter(ok);
  const items = interleave(pool).slice(0, 20).map((card) => ({ card, stage: 'walk' }));
  R = { items, i: 0, title: 'Walk mode', back: () => renderMemoryPack($root, { onBack: BACK }), phaseStart: {}, done: [], requeued: new Set(), walk: true };
  drawWalk();
}
function drawWalk() {
  if (R.i >= R.items.length) return drawSummary();
  const c = R.items[R.i].card;
  R.cur = { card: c, stage: 'walk', hints: 0, t0: Date.now(), target: targetMs(c), done: false };
  $root.innerHTML = `${header()}<div class="panel mp-walk"><div class="mp-type">${TYPE_LABEL[c.type]} · ${c.unit}</div><div class="mp-prompt big">${esc(c.prompt)}</div><div id="mp-walkans"></div></div>
    <button class="primary mp-bigbtn" data-walk="reveal">Reveal (answer aloud first)</button><div class="row"><button data-walk="repeat">🔊 Repeat</button><span class="grow"></span><button data-run="exit" class="ghost">End</button></div>`;
  say(c.prompt);
  $root.onclick = (e) => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.run === 'exit') { stopSpeech(); return R.back(); }
    if (b.dataset.walk === 'repeat') return say(c.prompt);
    if (b.dataset.walk === 'reveal') {
      R.cur.ms = Date.now() - R.cur.t0;
      const ans = c.answerText || c.answer.join(' ');
      say(ans);
      document.getElementById('mp-walkans').innerHTML = `<div class="mp-answer">${esc(ans)}</div><p class="mp-why">${esc(c.why)}</p>`;
      b.outerHTML = `<div class="mp-grades big">${[[1, 'Again'], [2, 'Hard'], [3, 'Good'], [4, 'Easy']].map(([g, l]) => `<button data-wg="${g}" class="g${g}">${l}</button>`).join('')}</div>`;
      return;
    }
    if (b.dataset.wg) {
      const g = Number(b.dataset.wg);
      M.schedule(c, g, { ms: g >= 3 ? R.cur.ms : null, unaided: true, target: R.cur.target + 2000 });
      R.done.push({ id: c.id, ok: g >= 2, grade: g });
      R.i++; drawWalk();
    }
  };
}
