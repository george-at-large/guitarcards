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

export { rhythmHTML, rhythmSlots, meterInfo } from './rhythm.js';

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

// ---------- book-style vertical chord box (Ted Greene layout) ----------
// frets: [s6..s1] numbers or null; optional / added: ['strN:fret', ...] ; added = [[stage1...], [stage2...]]
export function chordBoxSVG({ frets, name = '', sub = '', optional = [], added = [], note = '' }) {
  const pos = (str) => { const m = /str(\d):(\d+)/.exec(str); return m ? { s: Number(m[1]), f: Number(m[2]) } : null; };
  const opt = optional.map(pos).filter(Boolean);
  const stages = (added || []).map((st) => (Array.isArray(st) ? st : [st]).map(pos).filter(Boolean));
  const all = frets.filter((x) => x != null && x > 0).concat(opt.map((o) => o.f), ...stages.map((st) => st.map((o) => o.f))).filter((x) => x > 0);
  const lo = all.length ? Math.min(...all) : 1;
  const top = lo <= 2 ? 1 : lo;
  const rows = Math.max(4, (all.length ? Math.max(...all) : 4) - top + 1);
  const W = 132, sx = 28, sw = 18, y0 = 30, rh = 22;
  const x = (s) => sx + (6 - s) * sw;           // string 6 on the left (book layout)
  const y = (f) => y0 + (f - top + 0.5) * rh;
  let g = '';
  for (let r = 0; r <= rows; r++) g += `<line x1="${sx}" y1="${y0 + r * rh}" x2="${sx + 5 * sw}" y2="${y0 + r * rh}" class="${r === 0 && top === 1 ? 'nut' : 'wire'}"/>`;
  for (let s = 1; s <= 6; s++) g += `<line x1="${x(s)}" y1="${y0}" x2="${x(s)}" y2="${y0 + rows * rh}" class="string"/>`;
  if (top > 1) g += `<text x="${sx - 12}" y="${y0 + rh * 0.5 + 4}" class="fretnum" text-anchor="end">${top}</text>`;
  frets.forEach((f, i) => {
    const s = 6 - i;
    if (f === 0) g += `<circle cx="${x(s)}" cy="${y0 - 9}" r="4.5" class="openstr"/>`;
    else if (f != null) g += `<circle cx="${x(s)}" cy="${y(f)}" r="7" class="bdot"/>`;
  });
  for (const o of opt) g += `<g class="optnote"><circle cx="${x(o.s)}" cy="${o.f ? y(o.f) : y0 - 9}" r="7"/><line x1="${x(o.s) - 5}" y1="${(o.f ? y(o.f) : y0 - 9) + 5}" x2="${x(o.s) + 5}" y2="${(o.f ? y(o.f) : y0 - 9) - 5}"/></g>`;
  stages.forEach((st, k) => st.forEach((o) => {
    const cy = o.f ? y(o.f) : y0 - 9;
    g += k === 0
      ? `<g class="addx"><line x1="${x(o.s) - 6}" y1="${cy - 6}" x2="${x(o.s) + 6}" y2="${cy + 6}"/><line x1="${x(o.s) - 6}" y1="${cy + 6}" x2="${x(o.s) + 6}" y2="${cy - 6}"/></g>`
      : `<rect class="addsq" x="${x(o.s) - 6}" y="${cy - 6}" width="12" height="12"/>`;
  }));
  const H = y0 + rows * rh + 8;
  return `<figure class="cbox"><figcaption><b>${esc(name)}</b>${sub ? `<small>${esc(sub)}</small>` : ''}</figcaption><svg viewBox="0 0 ${W} ${H}" class="chordbox">${g}</svg>${note ? `<div class="cboxnote">${esc(note)}</div>` : ''}</figure>`;
}
export const CHORDBOX_LEGEND = '<div class="rlegend"><span><b>●</b> chord tone</span><span><b class="addtxt">✕</b> added after the chord (chord keeps ringing)</span><span><b class="sqtxt">■</b> played after the ✕ notes</span><span><b>⊘</b> optional note — try with and without</span><span><b>○</b> above = open string</span></div>';
