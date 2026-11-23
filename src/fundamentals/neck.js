// An upright neck in SVG, held like a chord diagram: low E on the left, the nut at the top, frets going down.
// Sizes: 's' a chord diagram, 'm' one CAGED area, 'l' the whole neck. Cells carry data-s / data-f for tapping.
import { OPEN } from '../fretboard.js';
import { role, esc } from './core.js';

const SIZES = {
  s: { sw: 17, fh: 21, r: 7.5, font: 8.5, padL: 30, padT: 14, open: 14 },
  m: { sw: 46, fh: 54, r: 16, font: 13, padL: 50, padT: 30, open: 34 },
  l: { sw: 46, fh: 38, r: 14, font: 12, padL: 50, padT: 30, open: 34 },
};
const INLAY = [3, 5, 7, 9, 15, 17];

// dots: [{s, f, label, cls, ring}] cls: role class (r t f s x) or 'ok' 'bad' 'miss' 'ask' 'ghost'
export function neckSVG({ lo = 0, hi = 15, dots = [], size = 'm', tap = false, caption = '', strings = null }) {
  const g = SIZES[size];
  const showOpen = lo === 0;
  const first = Math.max(1, lo);
  const rows = hi - first + 1;
  const W = g.padL + 5 * g.sw + 16;
  const top = g.padT + (showOpen ? g.open : 0);
  const H = top + rows * g.fh + 10;
  const x = (s) => g.padL + (6 - s) * g.sw;
  const y = (f) => (f === 0 ? top - g.open / 2 - 2 : top + (f - first + 0.5) * g.fh);
  let svg = `<svg class="neck neck-${size}" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">`;
  if (caption) svg += `<text class="cap" x="${W / 2}" y="${g.padT - (size === 's' ? 4 : 10)}" text-anchor="middle">${esc(caption)}</text>`;
  // inlays
  for (let f = first; f <= hi; f++) {
    const cy = top + (f - first + 0.5) * g.fh;
    if (INLAY.includes(f)) svg += `<circle class="inlay" cx="${g.padL + 2.5 * g.sw}" cy="${cy}" r="${g.r * 0.45}"/>`;
    if (f === 12) svg += `<circle class="inlay" cx="${g.padL + 1.5 * g.sw}" cy="${cy}" r="${g.r * 0.45}"/><circle class="inlay" cx="${g.padL + 3.5 * g.sw}" cy="${cy}" r="${g.r * 0.45}"/>`;
  }
  // frets
  for (let i = 0; i <= rows; i++) {
    const fy = top + i * g.fh;
    const nut = i === 0 && first === 1;
    svg += `<line class="${nut ? 'nut' : 'fret'}" x1="${x(6)}" y1="${fy}" x2="${x(1)}" y2="${fy}"/>`;
  }
  // fret numbers
  for (let f = first; f <= hi; f++) {
    const show = size === 's' ? f === first && first > 1 : (f === first || [3, 5, 7, 9, 12, 15, 17].includes(f));
    if (show) svg += `<text class="fn" x="${g.padL - (size === 's' ? 11 : 24)}" y="${y(f) + g.font * 0.35}" text-anchor="end">${f}${size === 's' ? 'fr' : ''}</text>`;
  }
  // strings
  for (let s = 6; s >= 1; s--) {
    const dim = strings && !strings.includes(s);
    svg += `<line class="str${dim ? ' dim' : ''}" x1="${x(s)}" y1="${top - (showOpen ? g.open : 0)}" x2="${x(s)}" y2="${top + rows * g.fh}" stroke-width="${size === 's' ? 1 : 1 + (s - 1) * 0.28}"/>`;
  }
  // tap cells
  if (tap) {
    for (let s = 6; s >= 1; s--) {
      for (let f = lo; f <= hi; f++) {
        const cy = y(f), h = f === 0 ? g.open : g.fh;
        svg += `<rect class="cell" data-s="${s}" data-f="${f}" x="${x(s) - g.sw / 2}" y="${cy - h / 2}" width="${g.sw}" height="${h}"/>`;
      }
    }
  }
  // dots
  for (const d of dots) {
    if (d.f < lo || d.f > hi) continue;
    const cls = d.cls || role(d.iv || '');
    const cx = x(d.s), cy = y(d.f);
    svg += `<g class="dot ${cls}" data-s="${d.s}" data-f="${d.f}">`;
    if (d.ring) svg += `<circle class="ring" cx="${cx}" cy="${cy}" r="${g.r + (size === 's' ? 2.5 : 4)}"/>`;
    svg += `<circle cx="${cx}" cy="${cy}" r="${g.r}"/>`;
    if (d.label != null && d.label !== '') svg += `<text x="${cx}" y="${cy + g.font * 0.36}" text-anchor="middle" style="font-size:${String(d.label).length > 2 ? g.font * 0.82 : g.font}px">${esc(d.label)}</text>`;
    svg += `</g>`;
  }
  return svg + '</svg>';
}

// window to show for a set of notes: a few frets round them, with the nut when it's close
export function windowFor(notes, minRows = 4) {
  const fs = notes.map((n) => n.fret);
  let lo = Math.min(...fs), hi = Math.max(...fs);
  if (lo <= 1 || hi <= minRows) lo = 0;
  if (lo > 0) lo = Math.max(1, lo);
  while (hi - Math.max(1, lo) + 1 < minRows) hi++;
  return { lo, hi };
}
export const midiAt = (s, f) => OPEN[s] + f;
