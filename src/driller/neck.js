// Scale Driller's neck: Simple's rosewood neck (real fret spacing, pearl dots, a bone nut), upright for a phone held
// upright (nut at the top, low E on the left) or across (low E at the bottom, like tab), showing frets from..to so a
// single shape can be zoomed to fill the screen.
import { esc } from '../fundamentals/core.js';

const fx = (f) => 1 - Math.pow(2, -f / 12);

// opts: { dir: 'v' | 'h', from, to, win, ghosts: [{string, fret, cls}], dots: [{string, fret, cls, label, ring, tag, lit}] }
export function neck({ dir = 'v', from = 0, to = 15, win = null, ghosts = [], dots = [] } = {}) {
  const v = dir === 'v', nut = from <= 1;
  const a0 = nut ? 0 : from - 1, end = to + 0.6;
  // along: the length of the neck in px; across: the width of the strings
  const L = v ? 860 : 1000, Wd = v ? 220 : 190;
  const pre = nut ? 34 : 14, post = 8; // room for the open strings above the nut
  const pos = (f) => pre + ((fx(f) - fx(a0)) / (fx(end) - fx(a0))) * (L - pre - post);
  const mid = (f) => (f === 0 ? pre - 17 : (pos(f - 1) + pos(f)) / 2);
  const s0 = v ? 30 : 22, s1 = v ? Wd - 44 : Wd - 26; // first and last string across
  const sAt = (s) => (v ? s0 + ((6 - s) * (s1 - s0)) / 5 : s0 + ((s - 1) * (s1 - s0)) / 5);
  const edge0 = sAt(v ? 6 : 1) - 15, edge1 = sAt(v ? 1 : 6) + 15;
  const P = (along, across) => (v ? [across, along] : [along, across]);
  const rect = (al, ac, lenAl, lenAc, attrs) => { const [x, y] = P(al, ac); const [w, h] = v ? [lenAc, lenAl] : [lenAl, lenAc]; return `<rect x="${x}" y="${y}" width="${w}" height="${h}" ${attrs}/>`; };
  const [W, H] = v ? [Wd, L] : [L, Wd];
  const gid = v ? 'v' : 'h';
  let svg = `<svg class="neck ${gid}" viewBox="0 0 ${W} ${H}" preserveAspectRatio="${v ? 'xMidYMin' : 'xMinYMid'} meet" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="wood${gid}" x1="0" y1="0" x2="${v ? 1 : 0}" y2="${v ? 0 : 1}"><stop offset="0" stop-color="#2f1d12"/><stop offset=".5" stop-color="#4a2e1c"/><stop offset="1" stop-color="#2f1d12"/></linearGradient>
      <linearGradient id="fret${gid}" x1="0" y1="0" x2="${v ? 0 : 1}" y2="${v ? 1 : 0}"><stop offset="0" stop-color="#8a8a8a"/><stop offset=".5" stop-color="#eeeeee"/><stop offset="1" stop-color="#8a8a8a"/></linearGradient>
      <radialGradient id="pearl${gid}"><stop offset="0" stop-color="#fbf7ee"/><stop offset="1" stop-color="#cfc6b4"/></radialGradient>
    </defs>`;
  const woodStart = nut ? pre : 0;
  svg += rect(woodStart, edge0, pos(end) - woodStart, edge1 - edge0, `rx="4" fill="url(#wood${gid})"`);
  if (win) { const lo = Math.max(a0, win.lo - 1), hi = Math.min(to, win.hi); if (hi > lo || win.lo === 0) svg += rect(win.lo === 0 ? pre - 34 : pos(lo), edge0, pos(hi) - (win.lo === 0 ? pre - 34 : pos(lo)), edge1 - edge0, 'fill="rgba(255,181,71,0.11)"'); }
  const inlay = (f, ac) => { const [x, y] = P(mid(f), ac); return `<circle cx="${x}" cy="${y}" r="6" fill="url(#pearl${gid})" opacity=".85"/>`; };
  for (let f = Math.max(1, from); f <= to; f++) {
    if ([3, 5, 7, 9, 15, 17, 19].includes(f)) svg += inlay(f, (sAt(3) + sAt(4)) / 2);
    if (f === 12) svg += inlay(f, (sAt(2) + sAt(3)) / 2) + inlay(f, (sAt(4) + sAt(5)) / 2);
  }
  if (nut) svg += rect(pre - 5, edge0, 7, edge1 - edge0, 'fill="#efe6d2"');
  for (let f = Math.max(1, from); f <= to; f++) svg += rect(pos(f) - 1.6, edge0, 3.2, edge1 - edge0, `fill="url(#fret${gid})"`);
  for (let f = Math.max(1, from); f <= to; f++) if ([3, 5, 7, 9, 12, 15, 17, 19].includes(f) || !nut) {
    const [x, y] = v ? [W - 3, mid(f) + 4] : [mid(f), H - 5];
    svg += `<text class="fn" x="${x}" y="${y}" text-anchor="${v ? 'end' : 'middle'}">${f}</text>`;
  }
  for (let s = 1; s <= 6; s++) {
    const [x1, y1] = P(nut ? pre - 30 : 0, sAt(s)), [x2, y2] = P(pos(end), sAt(s));
    svg += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${s <= 3 ? '#e9e6df' : '#d9b77a'}" stroke-width="${0.9 + (s - 1) * 0.45}" opacity=".9"/>`;
  }
  const show = (n) => n.fret >= (nut ? 0 : from) && n.fret <= to;
  const zoom = v ? 1 : Math.min(1.12, Math.max(1, 7 / Math.max(4, to - from + 1)));
  const r = (v ? 13 : 12.5) * zoom, ringR = r + 3.5;
  const xy = (n) => P(mid(n.fret), sAt(n.string));
  const litSet = new Set(dots.map((n) => n.string + ':' + n.fret));
  for (const n of ghosts) if (show(n) && !litSet.has(n.string + ':' + n.fret)) { const [x, y] = xy(n); svg += `<circle cx="${x}" cy="${y}" r="5" class="ghost ${n.cls || ''}"/>`; }
  for (const n of dots) {
    if (!show(n)) continue;
    const [x, y] = xy(n);
    svg += `<g class="dot ${n.cls || ''}${n.lit ? ' lit' : ''}${n.dim ? ' dim' : ''}"><circle cx="${x}" cy="${y}" r="${n.small ? r * 0.55 : r}"/>${n.ring ? `<circle class="ring" cx="${x}" cy="${y}" r="${ringR}"/>` : ''}`;
    if (n.label) svg += `<text x="${x}" y="${y + 4.3 * zoom}" text-anchor="middle" style="font-size:${12 * zoom}px">${esc(n.label)}</text>`;
    if (n.tag != null) { const tx = x + r * 0.85, ty = y - r * 0.85; svg += `<g class="tag"><rect x="${tx - 9}" y="${ty - 8}" width="${Math.max(18, String(n.tag).length * 7 + 6)}" height="16" rx="8"/><text x="${tx - 9 + Math.max(18, String(n.tag).length * 7 + 6) / 2}" y="${ty + 4}" text-anchor="middle">${esc(n.tag)}</text></g>`; }
    svg += '</g>';
  }
  return svg + '</svg>';
}
