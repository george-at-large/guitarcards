// SVG fretboard + rhythm grid + mini-markdown rendering.
import { prettyIv, noteName } from './theory.js';

const INLAYS = [3, 5, 7, 9, 15, 17];
export const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// dots: [{string, fret, label, kind: 'root'|'tone'|'ghost'|'mark', key}]
export function fretboardSVG({ lo = 0, hi = 12, dots = [], caption = '', compact = false, labels = 'interval', tappable = false } = {}) {
  lo = Math.max(0, lo);
  if (hi - lo < 3) hi = lo + 3;
  const nFrets = hi - lo + 1;
  const fw = compact ? 30 : 38;
  const sh = compact ? 15 : 19;
  const left = lo === 0 ? 26 : 16;
  const top = 12;
  const W = left + nFrets * fw + 8;
  const H = top + sh * 5 + 26;
  const x = (f) => (f === 0 ? left - 12 : left + (f - lo) * fw + (lo === 0 ? -fw / 2 : fw / 2) + (lo === 0 ? 0 : 0));
  const xs = (f) => (lo === 0 ? (f === 0 ? left - 12 : left + (f - 1) * fw + fw / 2) : left + (f - lo) * fw + fw / 2);
  const y = (s) => top + (s - 1) * sh;
  let g = '';
  // fret wires
  const firstWire = lo === 0 ? 1 : lo;
  const nWires = lo === 0 ? hi : hi - lo + 1;
  for (let i = 0; i <= nWires; i++) {
    const fx = left + i * fw;
    g += `<line x1="${fx}" y1="${top}" x2="${fx}" y2="${top + sh * 5}" class="${i === 0 && lo === 0 ? 'nut' : 'wire'}"/>`;
  }
  // inlays + fret numbers
  const fretsShown = lo === 0 ? [...Array(hi).keys()].map((i) => i + 1) : [...Array(nFrets).keys()].map((i) => lo + i);
  for (const f of fretsShown) {
    const cx = xs(f);
    if (INLAYS.includes(f)) g += `<circle cx="${cx}" cy="${top + sh * 2.5}" r="${compact ? 3 : 4}" class="inlay"/>`;
    if (f === 12) g += `<circle cx="${cx}" cy="${top + sh * 1.5}" r="${compact ? 3 : 4}" class="inlay"/><circle cx="${cx}" cy="${top + sh * 3.5}" r="${compact ? 3 : 4}" class="inlay"/>`;
    g += `<text x="${cx}" y="${top + sh * 5 + 17}" class="fretnum">${f}</text>`;
  }
  // strings
  for (let s = 1; s <= 6; s++) g += `<line x1="${lo === 0 ? left - 20 : left - 6}" y1="${y(s)}" x2="${W - 8}" y2="${y(s)}" class="string s${s}"/>`;
  // tap targets
  if (tappable) {
    for (let s = 1; s <= 6; s++) for (let f = lo; f <= hi; f++) {
      g += `<rect x="${xs(f) - fw / 2}" y="${y(s) - sh / 2}" width="${fw}" height="${sh}" class="tap" data-s="${s}" data-f="${f}"/>`;
    }
  }
  // dots
  const r = compact ? 7 : 8.5;
  for (const d of dots) {
    if (d.fret < lo && d.fret !== 0) continue;
    if (d.fret > hi) continue;
    const cx = xs(d.fret);
    const cy = y(d.string);
    const lab = d.label ?? '';
    g += `<g class="dot ${d.kind || 'tone'}" data-k="${d.string}:${d.fret}"><circle cx="${cx}" cy="${cy}" r="${r}"/>` +
      (lab !== '' ? `<text x="${cx}" y="${cy + 3.5}">${esc(lab)}</text>` : '') + '</g>';
  }
  return `<figure class="fb">${caption ? `<figcaption>${caption}</figcaption>` : ''}<svg viewBox="0 0 ${W} ${H}" class="fretboard${compact ? ' compact' : ''}" preserveAspectRatio="xMinYMin meet">${g}</svg></figure>`;
}

export function dotLabel(n, labels) {
  if (labels === 'none') return '';
  if (labels === 'note') return prettyNote(n.note);
  if (labels === 'both') return prettyIv(n.iv) + '·' + prettyNote(n.note);
  return prettyIv(n.iv);
}
const prettyNote = (n) => (n ? noteName(n, true) : '');
export const dotsFrom = (notes, labels = 'interval', extra = {}) =>
  notes.map((n) => ({ string: n.string, fret: n.fret, label: dotLabel(n, labels), kind: n.iv === '1' ? 'root' : 'tone', ...extra }));

export function windowFor(notes, pad = 1) {
  if (!notes.length) return { lo: 0, hi: 12 };
  const fs = notes.map((n) => n.fret);
  let lo = Math.min(...fs), hi = Math.max(...fs);
  lo = lo <= 1 ? 0 : lo - pad;
  hi = Math.max(hi + pad, lo + 4);
  return { lo, hi };
}

// ---------- rhythm grid ----------
const COUNTS = {
  1: [''], 2: ['', '&'], 3: ['', 'trip', 'let'], 4: ['', 'e', '&', 'a'], 6: ['', 'la', 'li', '&', 'la', 'li'], 5: ['', '2', '3', '4', '5'],
};
const SYMS = { D: '↓', U: '↑', d: '⇣', u: '⇡', X: '✕', '-': '', '.': '·', R: 'R', T: 'T' };
export function rhythmHTML(spec, cursor = -1) {
  const { beats, grid, slots, isPick } = rhythmSlots(spec);
  const accents = new Set(spec.accents || []);
  const perBar = beats * grid;
  const bars = Math.max(1, Math.ceil(slots.length / perBar));
  let h = '<div class="rgrid">';
  for (let b = 0; b < bars; b++) {
    h += '<div class="rbar">';
    for (let bt = 0; bt < beats; bt++) {
      h += '<div class="rbeat">';
      for (let k = 0; k < grid; k++) {
        const i = b * perBar + bt * grid + k;
        const tok = slots[i] ?? '.';
        const count = k === 0 ? String(bt + 1) : (COUNTS[grid] || [])[k] || '';
        const sym = isPick ? (tok === '-' || tok === '.' ? '·' : tok) : (SYMS[tok] ?? tok);
        const stroke = isPick && spec.strokes ? (clean(spec.strokes)[i] || '') : isPick && spec.fingers ? (clean(spec.fingers, true)[i] || '') : '';
        h += `<div class="rslot ${tok === '-' || tok === '.' ? 'rest' : ''} ${accents.has(i) ? 'acc' : ''} ${i === cursor ? 'cur' : ''} ${/[du]/.test(tok) && !isPick ? 'ghost' : ''}" data-i="${i}">` +
          `<span class="rsym">${accents.has(i) ? '<b>&gt;</b>' : ''}${esc(sym)}</span>` +
          (stroke ? `<span class="rstroke">${esc(strokeSym(stroke))}</span>` : '') +
          `<span class="rcount">${count}</span></div>`;
      }
      h += '</div>';
    }
    h += '</div>';
  }
  return h + '</div>';
}
const strokeSym = (c) => ({ D: '⊓', U: 'V', d: '⊓', u: 'V' }[c] || c);
function clean(s, words = false) {
  const t = String(s).replace(/\|/g, ' ').trim();
  return words || /\s/.test(t) ? t.split(/\s+/).filter(Boolean).flatMap((w) => (words ? [w] : w.split(''))) : t.split('');
}
export function meterInfo(meter = '4/4') {
  const [n, d] = String(meter).split('/').map(Number);
  // compound meters count dotted quarters? We keep it simple: beats = numerator for /4, numerator for /8 (eighth = beat)
  return { beats: n || 4, unit: d || 4 };
}
export function rhythmSlots(spec) {
  const { beats } = meterInfo(spec.meter);
  const grid = spec.grid || 2;
  if (spec.pick) {
    const toks = String(spec.pick).replace(/\|/g, ' ').trim().split(/\s+/).filter(Boolean);
    return { beats, grid, slots: toks, isPick: true };
  }
  const slots = String(spec.pattern || '').replace(/[\s|]/g, '').split('');
  return { beats, grid, slots, isPick: false };
}

// ---------- mini markdown ----------
export function md(src) {
  if (!src) return '';
  const lines = String(src).replace(/\r/g, '').split('\n');
  let out = '';
  let list = null;
  let table = null;
  const inline = (s) => esc(s)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>');
  const flush = () => {
    if (list) { out += `<${list.t}>${list.items.map((i) => `<li>${inline(i)}</li>`).join('')}</${list.t}>`; list = null; }
    if (table) {
      const rows = table.filter((r) => !/^\s*\|?\s*:?-{2,}/.test(r));
      out += '<table>' + rows.map((r, ri) => '<tr>' + r.replace(/^\||\|$/g, '').split('|').map((c) => (ri === 0 ? `<th>${inline(c.trim())}</th>` : `<td>${inline(c.trim())}</td>`)).join('') + '</tr>').join('') + '</table>';
      table = null;
    }
  };
  let para = [];
  const flushPara = () => { if (para.length) { out += `<p>${inline(para.join(' '))}</p>`; para = []; } };
  for (const raw of lines) {
    const l = raw.trimEnd();
    if (/^\s*\|.*\|\s*$/.test(l)) { flushPara(); if (list) flush(); (table = table || []).push(l.trim()); continue; }
    if (table) flush();
    let m;
    if ((m = /^(#{1,4})\s+(.*)$/.exec(l))) { flushPara(); flush(); const lv = Math.min(4, m[1].length + 2); out += `<h${lv}>${inline(m[2])}</h${lv}>`; continue; }
    if ((m = /^\s*[-*•]\s+(.*)$/.exec(l))) { flushPara(); if (!list || list.t !== 'ul') { flush(); list = { t: 'ul', items: [] }; } list.items.push(m[1]); continue; }
    if ((m = /^\s*\d+[.)]\s+(.*)$/.exec(l))) { flushPara(); if (!list || list.t !== 'ol') { flush(); list = { t: 'ol', items: [] }; } list.items.push(m[1]); continue; }
    if (!l.trim()) { flushPara(); flush(); continue; }
    if (list) flush();
    para.push(l.trim());
  }
  flushPara(); flush();
  return out;
}
