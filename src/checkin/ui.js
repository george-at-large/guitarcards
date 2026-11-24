// Small DOM kit: an element builder, chip sets, a slider that knows when it hasn't been touched, the mood grid,
// and the full-screen flow (a stepper used by the check-in and every CBT tool).
import { GRID_LABELS, FEELINGS } from './data.js';

export function h(tag, attrs = {}, ...kids) {
  const [name, ...cls] = tag.split('.');
  const el = document.createElement(name || 'div');
  if (cls.length) el.className = cls.join(' ');
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue;
    if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else if (k === 'class') el.className += (el.className ? ' ' : '') + v;
    else if (k === 'style') el.style.cssText = v;
    else if (k in el && k !== 'list') el[k] = v;
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const k of kids.flat(Infinity)) if (k != null && k !== false) el.append(k.nodeType ? k : String(k));
  return el;
}
// append children the way h() does: flattened, with null/false dropped
export const put = (el, ...kids) => { el.append(...kids.flat(Infinity).filter((k) => k != null && k !== false)); return el; };
export const svg = (tag, attrs = {}, ...kids) => {
  const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const [k, v] of Object.entries(attrs)) if (v != null) el.setAttribute(k, v);
  for (const k of kids.flat(Infinity)) if (k != null && k !== false) el.append(k.nodeType ? k : String(k));
  return el;
};

export const clock = (t) => new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
export const dayName = (t) => {
  const d = new Date(t), today = new Date(); today.setHours(0, 0, 0, 0);
  const diff = Math.round((today - new Date(d).setHours(0, 0, 0, 0)) / 864e5);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  return d.toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'short' });
};

// chips over a Set (multi) or a one-slot holder {value} (single)
export function chips(options, sel, { single = false, onChange } = {}) {
  const wrap = h('div.chips');
  const paint = () => wrap.querySelectorAll('button').forEach((b) => b.classList.toggle('on', single ? sel.value === b.dataset.v : sel.has(b.dataset.v)));
  for (const o of options) {
    wrap.append(h('button.chip', { type: 'button', 'data-v': o, onclick: () => {
      if (single) sel.value = sel.value === o ? null : o; else if (sel.has(o)) sel.delete(o); else sel.add(o);
      paint(); onChange?.();
    } }, o));
  }
  paint();
  return wrap;
}

// a 0..100 slider that stays faint (and reports null) until it's moved
export function scale(left, right, holder, key, { mid } = {}) {
  const input = h('input', { type: 'range', min: 0, max: 100, step: 1, value: holder[key] ?? 50 });
  const row = h('div.scale' + (holder[key] == null ? '.unset' : ''), {},
    input, h('div.ends', {}, h('span', {}, left), mid ? h('span.mid', {}, mid) : null, h('span', {}, right)));
  const set = () => { holder[key] = Number(input.value); row.classList.remove('unset'); };
  input.addEventListener('input', set);
  input.addEventListener('pointerdown', set);
  return row;
}

// The mood grid: x unpleasant → pleasant, y low → high energy. Tap or drag to place the marker.
export function moodGrid(state, onPick) {
  const marker = h('div.marker');
  const pad = h('div.gridpad', { role: 'application', 'aria-label': 'Mood grid: left is unpleasant, right is pleasant, top is high energy, bottom is low energy' },
    h('div.axis.x'), h('div.axis.y'),
    GRID_LABELS.map((w) => { const f = FEELINGS.find((x) => x[0] === w); const pc = (n) => Math.max(11, Math.min(89, (n + 1) * 50)); return h('span.gl', { style: `left:${pc(f[1])}%;top:${pc(-f[2])}%` }, w); }),
    marker);
  const place = () => {
    marker.style.display = state.v == null ? 'none' : 'block';
    if (state.v != null) { marker.style.left = `${(state.v + 1) * 50}%`; marker.style.top = `${(1 - state.a) * 50}%`; }
  };
  const pick = (ev) => {
    const r = pad.getBoundingClientRect();
    const cl = (n) => Math.max(-1, Math.min(1, n));
    state.v = cl(((ev.clientX - r.left) / r.width) * 2 - 1);
    state.a = cl(1 - ((ev.clientY - r.top) / r.height) * 2);
    place(); onPick?.();
  };
  let down = false;
  pad.addEventListener('pointerdown', (e) => { down = true; pad.setPointerCapture(e.pointerId); pick(e); });
  pad.addEventListener('pointermove', (e) => { if (down) pick(e); });
  pad.addEventListener('pointerup', () => { down = false; });
  pad.addEventListener('pointercancel', () => { down = false; });
  place();
  return h('div.gridwrap', {},
    h('div.gl-top', {}, 'high energy'),
    h('div.gridrow', {}, h('div.gl-side', {}, 'unpleasant'), pad, h('div.gl-side', {}, 'pleasant')),
    h('div.gl-bot', {}, 'low energy'));
}
export const zone = (v, a) => (v == null ? '' : `${v < -0.2 ? 'unpleasant' : v > 0.2 ? 'pleasant' : 'mixed'}, ${a > 0.2 ? 'high energy' : a < -0.2 ? 'low energy' : 'medium energy'}`);

// ---------- the flow: a full-screen stepper ----------
// steps: [{ title, hint, body: (ctx) => Node, next?: 'Next'|'Save'|…, canNext?: () => bool, skip?: bool }]
const host = () => document.getElementById('flow');
let current = null, afterClose = () => {};
export const setAfterClose = (fn) => { afterClose = fn; };
export function flow({ title, steps, onDone, onClose }) {
  const el = host();
  let i = 0;
  const ctx = { refresh: () => render(), go: (n) => { i = n; render(); }, next: () => advance(), close: () => close() };
  function close() { el.classList.add('hidden'); el.replaceChildren(); document.body.classList.remove('flowing'); current = null; onClose?.(); afterClose(); }
  function advance() {
    if (i < steps.length - 1) { i++; render(); el.querySelector('.flow-body')?.scrollTo(0, 0); }
    else { const keep = onDone?.(ctx); if (keep !== true) close(); }
  }
  function render() {
    const s = steps[i];
    const nextBtn = h('button.primary', { type: 'button', onclick: advance, disabled: s.canNext ? !s.canNext() : false }, s.next || (i === steps.length - 1 ? 'Done' : 'Next'));
    ctx.enableNext = () => { nextBtn.disabled = s.canNext ? !s.canNext() : false; };
    el.replaceChildren(h('div.flow-inner', {},
      h('div.flow-head', {},
        h('button.icon', { type: 'button', 'aria-label': 'Back', onclick: () => (i > 0 ? (i--, render()) : close()), disabled: s.noBack }, i > 0 ? '‹' : '✕'),
        h('div.flow-title', {}, title, steps.length > 1 ? h('div.dots', {}, steps.map((_, k) => h('i' + (k <= i ? '.on' : '')))) : null),
        h('button.icon', { type: 'button', 'aria-label': 'Close', onclick: close }, i > 0 ? '✕' : '')),
      h('div.flow-body', {}, s.title ? h('h2', {}, s.title) : null, s.hint ? h('p.hint', {}, s.hint) : null, s.body(ctx)),
      h('div.flow-foot', {},
        s.extra ? s.extra(ctx) : null,
        s.skip ? h('button.ghost', { type: 'button', onclick: advance }, 'Skip') : null,
        s.hideNext ? null : nextBtn)));
  }
  current = ctx;
  el.classList.remove('hidden');
  document.body.classList.add('flowing');
  render();
  return ctx;
}
export const flowOpen = () => !!current;

// a 0..100 rating with the number shown
export function rating(holder, key, label) {
  const out = h('b', {}, holder[key] ?? '–');
  const input = h('input', { type: 'range', min: 0, max: 100, step: 5, value: holder[key] ?? 50, oninput: () => { holder[key] = Number(input.value); out.textContent = input.value; } });
  return h('label.rating', {}, h('span', {}, label, ' ', out), input);
}
export const area = (holder, key, placeholder, rows = 3) =>
  h('textarea', { rows, placeholder, value: holder[key] || '', oninput: (e) => { holder[key] = e.target.value; } });

export function toast(msg, ms = 2600) {
  document.querySelectorAll('.toast').forEach((t) => t.remove());
  const t = h('div.toast', {}, msg);
  document.body.append(t);
  requestAnimationFrame(() => t.classList.add('show'));
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 300); }, ms);
}
