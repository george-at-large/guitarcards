// Rhythm, drawn: a grid (one row per layer, one cell per step: strum arrows, chucks, the hand moving without
// touching, bass notes, hits) or a circle (the cycle as a ring, each layer's hits joined into a shape, so a clave
// or three-against-two can be seen). The current step lights up.
import { countOf } from './rhythm.js';

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const COLOURS = { strum: 'var(--gold)', thumb: 'var(--t3)', pick: 'var(--t5)', clave: 'var(--gold)', bell: 'var(--t5)', shaker: 'var(--faint)', kick: 'var(--t3)', snare: 'var(--t7)', clap: 'var(--gold)' };

function cellMark(L, ch, k) {
  const strong = ch === ch.toUpperCase() && ch !== '.';
  if (L.type === 'strum') {
    if (ch === 'D' || ch === 'd') return { t: '↓', cls: ch === 'D' ? 'hit' : 'soft' };
    if (ch === 'U' || ch === 'u') return { t: '↑', cls: ch === 'U' ? 'hit' : 'soft' };
    if (ch === 'X' || ch === 'x') return { t: '✕', cls: 'chuck' };
    return { t: k % 2 ? '↑' : '↓', cls: 'ghost' }; // the hand still moves
  }
  if (L.type === 'thumb') return ch === '.' ? null : { t: ch === 'b' ? 'b' : 'B', cls: 'hit' };
  if (ch === '.') return null;
  return { t: '●', cls: strong ? 'hit big' : 'soft' };
}

export function gridSVG(p, layers, step) {
  const per = p.steps / p.beats, n = p.steps;
  const W = 340, x0 = 52, cw = (W - x0 - 4) / n, rh = 40, top = 26, H = top + layers.length * rh + 6;
  const parts = [];
  for (let k = 0; k < n; k++) {
    const x = x0 + k * cw;
    if (k === step) parts.push(`<rect x="${x}" y="2" width="${cw}" height="${H - 4}" rx="4" class="now"/>`);
    if (k % per === 0) parts.push(`<line x1="${x}" x2="${x}" y1="${top - 4}" y2="${H - 4}" class="beat"/>`);
    const c = countOf(p, k);
    parts.push(`<text x="${x + cw / 2}" y="16" class="cnt ${k % per === 0 ? 'on' : ''}">${esc(c.show)}</text>`);
  }
  layers.forEach((L, r) => {
    const y = top + r * rh + rh / 2;
    parts.push(`<text x="4" y="${y + 4}" class="lname">${esc(L.name)}</text>`);
    for (let k = 0; k < n; k++) {
      const m = cellMark(L, L.seq[k] || '.', k);
      if (!m) { parts.push(`<circle cx="${x0 + k * cw + cw / 2}" cy="${y}" r="1.6" class="dotempty"/>`); continue; }
      const acc = p.accents && p.accents.includes(k);
      parts.push(`<text x="${x0 + k * cw + cw / 2}" y="${y + 7}" class="mk ${m.cls}${acc ? ' acc' : ''}${k === step ? ' lit' : ''}" style="fill:${COLOURS[L.type] || 'var(--ink)'}">${m.t}</text>`);
    }
  });
  return `<svg class="rgrid" viewBox="0 0 ${W} ${H}">${parts.join('')}</svg>`;
}

export function circleSVG(p, layers, step) {
  const S = 320, cx = S / 2, cy = S / 2, n = p.steps, per = p.steps / p.beats;
  const ang = (k) => -Math.PI / 2 + (2 * Math.PI * k) / n;
  const pt = (k, r) => [cx + r * Math.cos(ang(k)), cy + r * Math.sin(ang(k))];
  const parts = [];
  const R0 = 138;
  // the count around the outside
  for (let k = 0; k < n; k++) { const [x, y] = pt(k, R0 + 14); parts.push(`<text x="${x}" y="${y + 4}" class="cnt ${k % per === 0 ? 'on' : ''}${k === step ? ' lit' : ''}">${esc(countOf(p, k).show)}</text>`); }
  layers.forEach((L, r) => {
    const R = R0 - r * 34;
    parts.push(`<circle cx="${cx}" cy="${cy}" r="${R}" class="ring"/>`);
    const hits = [];
    for (let k = 0; k < n; k++) {
      const ch = L.seq[k] || '.', [x, y] = pt(k, R);
      if (ch === '.') { parts.push(`<circle cx="${x}" cy="${y}" r="2" class="dotempty"/>`); continue; }
      hits.push([x, y]);
      const big = ch === ch.toUpperCase();
      parts.push(`<circle cx="${x}" cy="${y}" r="${big ? 7.5 : 5}" class="hitdot${k === step ? ' lit' : ''}" style="fill:${COLOURS[L.type] || 'var(--ink)'}"/>`);
    }
    if (hits.length > 2) parts.unshift(`<polygon points="${hits.map((h) => h.join(',')).join(' ')}" class="shape" style="stroke:${COLOURS[L.type] || 'var(--ink)'}"/>`);
    const [lx, ly] = pt(0, R - 16);
    parts.push(`<text x="${lx}" y="${ly + 4}" class="lname c">${esc(L.name)}</text>`);
  });
  const [hx, hy] = pt(step, R0 + 2);
  parts.push(`<line x1="${cx}" y1="${cy}" x2="${hx}" y2="${hy}" class="hand"/><circle cx="${cx}" cy="${cy}" r="3" class="hub"/>`);
  return `<svg class="rcircle" viewBox="0 0 ${S} ${S}">${parts.join('')}</svg>`;
}
