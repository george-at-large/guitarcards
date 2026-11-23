// Simple's neck: real fret spacing (each fret 1/17.817 shorter), rosewood, pearl dots, a bone nut. Across (low E at
// the bottom, like tab) or upright for a phone held upright (nut at the top, low E on the left, like a chord diagram).
// It draws what it's given: an area to shade, faint ghost notes, and labelled dots (cls picks the colour by job).
import { esc } from '../fundamentals/core.js';

export const NF = 15;
export const fx = (f) => 1 - Math.pow(2, -f / 12);

// opts: { win: {lo, hi}, ghosts: [{string, fret, cls}], dots: [{string, fret, cls, label, ring, tag}], tap }
// tap: lay invisible targets over every string and fret (data-s, data-f) so a page can take taps on the neck
export function neckAcross({ win, ghosts = [], dots = [], tap = false, nf = NF } = {}) {
  const W = 1000, H = 190, padL = 34, padR = 14, top = 22, bot = 26;
  const scale = (W - padL - padR) / fx(nf + 0.6);
  const X = (f) => padL + fx(f) * scale;
  const mid = (f) => (f === 0 ? padL - 15 : (X(f - 1) + X(f)) / 2);
  const sy = (s) => top + ((s - 1) * (H - top - bot)) / 5; // string 1 (high e) at the top
  let svg = `<svg class="neck" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMinYMid meet" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="wood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a2417"/><stop offset=".5" stop-color="#4a2e1c"/><stop offset="1" stop-color="#2f1d12"/></linearGradient>
      <linearGradient id="fret" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#9a9a9a"/><stop offset=".5" stop-color="#eeeeee"/><stop offset="1" stop-color="#8a8a8a"/></linearGradient>
      <radialGradient id="pearl"><stop offset="0" stop-color="#fbf7ee"/><stop offset="1" stop-color="#cfc6b4"/></radialGradient>
    </defs>
    <rect x="${padL}" y="${top - 12}" width="${X(nf + 0.6) - padL}" height="${H - top - bot + 24}" rx="4" fill="url(#wood)"/>`;
  if (win) svg += `<rect x="${X(Math.max(0, win.lo - 1))}" y="${top - 12}" width="${X(win.hi) - X(Math.max(0, win.lo - 1))}" height="${H - top - bot + 24}" fill="rgba(255,181,71,0.10)"/>`;
  for (const f of [3, 5, 7, 9, 15, 17, 19]) if (f <= nf) svg += `<circle cx="${mid(f)}" cy="${(sy(3) + sy(4)) / 2}" r="6" fill="url(#pearl)" opacity=".85"/>`;
  svg += `<circle cx="${mid(12)}" cy="${(sy(2) + sy(3)) / 2}" r="6" fill="url(#pearl)" opacity=".85"/><circle cx="${mid(12)}" cy="${(sy(4) + sy(5)) / 2}" r="6" fill="url(#pearl)" opacity=".85"/>`;
  svg += `<rect x="${padL - 6}" y="${top - 12}" width="7" height="${H - top - bot + 24}" fill="#efe6d2"/>`;
  for (let f = 1; f <= nf; f++) svg += `<rect x="${X(f) - 1.6}" y="${top - 12}" width="3.2" height="${H - top - bot + 24}" fill="url(#fret)"/>`;
  for (let f = 1; f <= nf; f++) if ([3, 5, 7, 9, 12, 15, 17, 19].includes(f)) svg += `<text class="fn" x="${mid(f)}" y="${H - 6}" text-anchor="middle">${f}</text>`;
  for (let s = 1; s <= 6; s++) svg += `<line x1="${padL - 30}" y1="${sy(s)}" x2="${X(nf + 0.6)}" y2="${sy(s)}" stroke="${s <= 3 ? '#e9e6df' : '#d9b77a'}" stroke-width="${0.9 + (s - 1) * 0.45}" opacity=".9"/>`;
  const gap = (H - top - bot) / 5;
  const hits = tap ? hitRects(nf, (s, f) => [f === 0 ? padL - 30 : X(f - 1), sy(s) - gap / 2, f === 0 ? 30 : X(f) - X(f - 1), gap]) : '';
  return svg + marks(ghosts, dots, (n) => mid(n.fret), (n) => sy(n.string), 12.5, 16) + hits + '</svg>';
}

export function neckUpright({ win, ghosts = [], dots = [], tap = false, nf = NF } = {}) {
  const W = 220, H = 860, padL = 16, padR = 30, padT = 34, padB = 8;
  const scale = (H - padT - padB) / fx(nf + 0.6);
  const Y = (f) => padT + fx(f) * scale;
  const mid = (f) => (f === 0 ? padT - 17 : (Y(f - 1) + Y(f)) / 2);
  const sx = (s) => padL + 14 + ((6 - s) * (W - padL - padR - 28)) / 5;
  const x0 = sx(6) - 15, x1 = sx(1) + 15;
  let svg = `<svg class="neck v" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMin meet" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="woodv" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2f1d12"/><stop offset=".5" stop-color="#4a2e1c"/><stop offset="1" stop-color="#2f1d12"/></linearGradient>
      <linearGradient id="fretv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8a8a8a"/><stop offset=".5" stop-color="#eeeeee"/><stop offset="1" stop-color="#8a8a8a"/></linearGradient>
      <radialGradient id="pearlv"><stop offset="0" stop-color="#fbf7ee"/><stop offset="1" stop-color="#cfc6b4"/></radialGradient>
    </defs>
    <rect x="${x0}" y="${padT}" width="${x1 - x0}" height="${Y(nf + 0.6) - padT}" rx="4" fill="url(#woodv)"/>`;
  if (win) svg += `<rect x="${x0}" y="${Y(Math.max(0, win.lo - 1))}" width="${x1 - x0}" height="${Y(win.hi) - Y(Math.max(0, win.lo - 1))}" fill="rgba(255,181,71,0.12)"/>`;
  const cx = (sx(3) + sx(4)) / 2;
  for (const f of [3, 5, 7, 9, 15, 17, 19]) if (f <= nf) svg += `<circle cx="${cx}" cy="${mid(f)}" r="6" fill="url(#pearlv)" opacity=".85"/>`;
  svg += `<circle cx="${(sx(2) + sx(3)) / 2}" cy="${mid(12)}" r="6" fill="url(#pearlv)" opacity=".85"/><circle cx="${(sx(4) + sx(5)) / 2}" cy="${mid(12)}" r="6" fill="url(#pearlv)" opacity=".85"/>`;
  svg += `<rect x="${x0}" y="${padT - 5}" width="${x1 - x0}" height="7" fill="#efe6d2"/>`;
  for (let f = 1; f <= nf; f++) svg += `<rect x="${x0}" y="${Y(f) - 1.6}" width="${x1 - x0}" height="3.2" fill="url(#fretv)"/>`;
  for (let f = 1; f <= nf; f++) if ([3, 5, 7, 9, 12, 15, 17, 19].includes(f)) svg += `<text class="fn" x="${W - 3}" y="${mid(f) + 4}" text-anchor="end">${f}</text>`;
  for (let s = 1; s <= 6; s++) svg += `<line x1="${sx(s)}" y1="${padT - 30}" x2="${sx(s)}" y2="${Y(nf + 0.6)}" stroke="${s <= 3 ? '#e9e6df' : '#d9b77a'}" stroke-width="${0.9 + (s - 1) * 0.45}" opacity=".9"/>`;
  const gap = (W - padL - padR - 28) / 5;
  const hits = tap ? hitRects(nf, (s, f) => [sx(s) - gap / 2, f === 0 ? padT - 32 : Y(f - 1), gap, f === 0 ? 32 : Y(f) - Y(f - 1)]) : '';
  return svg + marks(ghosts, dots, (n) => sx(n.string), (n) => mid(n.fret), 13, 16.5) + hits + '</svg>';
}

// a slice of the neck, frets `from`..`to` (from 1 shows the nut and open strings), across, sized for a card;
// mutes: strings marked ✕ at the left edge
export function neckSlice({ from = 1, to = 5, ghosts = [], dots = [], mutes = [] } = {}) {
  const W = 520, H = 230, top = 24, bot = 28, padR = 8, nut = from <= 1;
  const padL = nut ? 46 : 30;
  const a = fx(from - 1), b = fx(to);
  const X = (f) => padL + ((fx(f) - a) / (b - a)) * (W - padL - padR);
  const mid = (f) => (f === 0 ? padL - 20 : (X(f - 1) + X(f)) / 2);
  const sy = (s) => top + ((s - 1) * (H - top - bot)) / 5;
  const y0 = top - 11, h = H - top - bot + 22;
  let svg = `<svg class="neck nw" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="woods" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a2417"/><stop offset=".5" stop-color="#4a2e1c"/><stop offset="1" stop-color="#2f1d12"/></linearGradient>
      <linearGradient id="frets" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#9a9a9a"/><stop offset=".5" stop-color="#eeeeee"/><stop offset="1" stop-color="#8a8a8a"/></linearGradient>
      <radialGradient id="pearls"><stop offset="0" stop-color="#fbf7ee"/><stop offset="1" stop-color="#cfc6b4"/></radialGradient>
    </defs>
    <rect x="${nut ? padL : padL - 8}" y="${y0}" width="${W - padR - (nut ? padL : padL - 8)}" height="${h}" rx="4" fill="url(#woods)"/>`;
  for (let f = from; f <= to; f++) {
    if ([3, 5, 7, 9, 15].includes(f)) svg += `<circle cx="${mid(f)}" cy="${(sy(3) + sy(4)) / 2}" r="6" fill="url(#pearls)" opacity=".85"/>`;
    if (f === 12) svg += `<circle cx="${mid(12)}" cy="${(sy(2) + sy(3)) / 2}" r="6" fill="url(#pearls)" opacity=".85"/><circle cx="${mid(12)}" cy="${(sy(4) + sy(5)) / 2}" r="6" fill="url(#pearls)" opacity=".85"/>`;
  }
  if (nut) svg += `<rect x="${padL - 6}" y="${y0}" width="7" height="${h}" fill="#efe6d2"/>`;
  for (let f = from; f <= to; f++) svg += `<rect x="${X(f) - 1.6}" y="${y0}" width="3.2" height="${h}" fill="url(#frets)"/>`;
  for (let f = from; f <= to; f++) svg += `<text class="fn" x="${mid(f)}" y="${H - 5}" text-anchor="middle">${f}</text>`;
  for (let s = 1; s <= 6; s++) svg += `<line x1="${nut ? padL - 34 : padL - 8}" y1="${sy(s)}" x2="${W - padR}" y2="${sy(s)}" stroke="${s <= 3 ? '#e9e6df' : '#d9b77a'}" stroke-width="${0.9 + (s - 1) * 0.45}" opacity=".9"/>`;
  for (const s of mutes) svg += `<text class="mute" x="${nut ? padL - 38 : padL - 20}" y="${sy(s) + 4.5}" text-anchor="middle">✕</text>`;
  return svg + marks(ghosts, dots, (n) => mid(n.fret), (n) => sy(n.string), 15, 19) + '</svg>';
}

// the ghosts, then the dots (a ring for the bass or the first note; a small tag, e.g. the order in a line)
function marks(ghosts, dots, cx, cy, r, ringR) {
  const lit = new Set(dots.map((n) => n.string + ':' + n.fret));
  let out = '';
  for (const n of ghosts) if (!lit.has(n.string + ':' + n.fret)) out += `<circle cx="${cx(n)}" cy="${cy(n)}" r="5" class="ghost ${n.cls || ''}"/>`;
  for (const n of dots) {
    out += `<g class="dot ${n.cls || ''}"><circle cx="${cx(n)}" cy="${cy(n)}" r="${r}"/>${n.ring ? `<circle class="ring" cx="${cx(n)}" cy="${cy(n)}" r="${ringR}"/>` : ''}<text x="${cx(n)}" y="${cy(n) + 4.3}" text-anchor="middle">${esc(n.label ?? '')}</text>`;
    if (n.tag != null) out += `<g class="tag"><circle cx="${cx(n) + r * 0.85}" cy="${cy(n) - r * 0.85}" r="7.5"/><text x="${cx(n) + r * 0.85}" y="${cy(n) - r * 0.85 + 3.4}" text-anchor="middle">${esc(n.tag)}</text></g>`;
    out += '</g>';
  }
  return out;
}
const hitRects = (nf, box) => {
  let out = '<g class="hits">';
  for (let s = 1; s <= 6; s++) for (let f = 0; f <= nf; f++) { const [x, y, w, h] = box(s, f); out += `<rect class="hit" data-s="${s}" data-f="${f}" x="${x}" y="${y}" width="${w}" height="${h}"/>`; }
  return out + '</g>';
};
