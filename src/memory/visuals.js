// Memory pack visual aids (no instrument): circle of fifths, pitch clock, degree strip. Inline SVG.
const CIRCLE = ['C', 'G', 'D', 'A', 'E', 'B', 'F♯/G♭', 'D♭', 'A♭', 'E♭', 'B♭', 'F'];
const MINORS = ['Am', 'Em', 'Bm', 'F♯m', 'C♯m', 'G♯m', 'D♯m', 'B♭m', 'Fm', 'Cm', 'Gm', 'Dm'];
const SIGS = ['0', '1♯', '2♯', '3♯', '4♯', '5♯', '6♯/6♭', '5♭', '4♭', '3♭', '2♭', '1♭'];
const PCN = ['C', 'C♯/D♭', 'D', 'E♭', 'E', 'F', 'F♯/G♭', 'G', 'A♭', 'A', 'B♭', 'B'];
const CIRCLE_PC = [0, 7, 2, 9, 4, 11, 6, 1, 8, 3, 10, 5];

export function circleSVG({ highlight = [], minor = false } = {}) {
  const hl = new Set(highlight.map(Number));
  const c = 110, R1 = 92, R2 = 62, R3 = 38;
  let g = `<circle cx="${c}" cy="${c}" r="${R1 + 14}" class="mv-ring"/><circle cx="${c}" cy="${c}" r="${R2 - 14}" class="mv-ring2"/>`;
  CIRCLE.forEach((k, i) => {
    const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
    const x = (r) => (c + Math.cos(a) * r).toFixed(1), y = (r) => (c + Math.sin(a) * r).toFixed(1);
    const on = hl.has(CIRCLE_PC[i]);
    g += `<g class="${on ? 'mv-on' : ''}"><circle cx="${x(R1)}" cy="${y(R1)}" r="14" class="mv-key"/><text x="${x(R1)}" y="${Number(y(R1)) + 4}" class="mv-t ${k.length > 3 ? 'mv-tiny' : ''}">${k}</text></g>`;
    g += `<text x="${x(R2)}" y="${Number(y(R2)) + 4}" class="mv-t2 ${minor ? 'mv-strong' : ''}">${MINORS[i]}</text>`;
    g += `<text x="${x(R3)}" y="${Number(y(R3)) + 3}" class="mv-t3">${SIGS[i]}</text>`;
  });
  return `<svg viewBox="0 0 220 220" class="mv-svg" role="img" aria-label="Circle of fifths">${g}</svg>`;
}
export function clockSVG({ pcs = [], line = false } = {}) {
  const c = 110, R = 84;
  const pt = (p) => { const a = (p / 12) * Math.PI * 2 - Math.PI / 2; return [c + Math.cos(a) * R, c + Math.sin(a) * R]; };
  let g = `<circle cx="${c}" cy="${c}" r="${R}" class="mv-ring"/>`;
  const sorted = [...new Set(pcs)].sort((a, b) => a - b);
  if (sorted.length >= 2) g += `<${sorted.length === 2 || line ? 'polyline' : 'polygon'} points="${sorted.map((p) => pt(p).map((v) => v.toFixed(1)).join(',')).join(' ')}" class="mv-shape"/>`;
  for (let p = 0; p < 12; p++) {
    const [x, y] = pt(p);
    const on = sorted.includes(p);
    g += `<g class="${on ? 'mv-on' : ''}"><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${on ? 13 : 10}" class="mv-key"/><text x="${x.toFixed(1)}" y="${(y + 3.5).toFixed(1)}" class="mv-t ${PCN[p].length > 2 ? 'mv-tiny' : ''}">${PCN[p]}</text></g>`;
  }
  return `<svg viewBox="0 0 220 220" class="mv-svg" role="img" aria-label="Pitch clock">${g}</svg>`;
}
export function stripSVG(formula) {
  const f = String(formula).split(' ');
  const w = 36, h = 40, W = f.length * (w + 4);
  const pretty = (t) => t.replace(/bb/g, '𝄫').replace(/b/g, '♭').replace(/#/g, '♯');
  const g = f.map((t, i) => `<g class="${/[b#]/.test(t) ? 'mv-alt' : ''}"><rect x="${i * (w + 4)}" y="0" width="${w}" height="${h}" rx="8" class="mv-box"/><text x="${i * (w + 4) + w / 2}" y="${h / 2 + 6}" class="mv-deg">${pretty(t)}</text></g>`).join('');
  return `<svg viewBox="0 0 ${W} ${h}" class="mv-strip" role="img" aria-label="Degree strip ${f.join(' ')}">${g}</svg>`;
}
export function visualHTML(v) {
  if (!v) return '';
  if (v.type === 'circle') return circleSVG(v);
  if (v.type === 'clock') return clockSVG(v);
  if (v.type === 'strip') return stripSVG(v.f);
  return '';
}
