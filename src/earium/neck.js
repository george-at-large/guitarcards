// A vertical guitar neck: the nut at the top, the low E string on the left. Frets narrow as they go up the neck,
// as on a real guitar. Each sounding note is a dot labelled with its degree, coloured by its family; a note that
// has just come in glows.
const FRETS = 15;
const W = 150, TOP = 26, H = 640, X0 = 22, X1 = W - 22;
// fret positions: the real guitar's spacing, scaled to fit
const pos = (() => { const L = 1 - Math.pow(2, -(FRETS + 0.6) / 12); return Array.from({ length: FRETS + 1 }, (_, f) => TOP + ((1 - Math.pow(2, -f / 12)) / L) * (H - TOP - 8)); })();
const sx = (string) => X0 + ((6 - string) / 5) * (X1 - X0);
const fy = (f) => (f === 0 ? TOP - 12 : (pos[f - 1] + pos[f]) / 2);

export function neckSVG(notes = [], { labels = 'deg' } = {}) {
  const parts = [];
  parts.push(`<rect x="${X0 - 9}" y="${TOP}" width="${X1 - X0 + 18}" height="${H - TOP - 6}" rx="6" class="board"/>`);
  for (let f = 1; f <= FRETS; f++) parts.push(`<line x1="${X0 - 9}" x2="${X1 + 9}" y1="${pos[f]}" y2="${pos[f]}" class="fret"/>`);
  parts.push(`<rect x="${X0 - 10}" y="${TOP - 3}" width="${X1 - X0 + 20}" height="5" rx="2" class="nut"/>`);
  for (const f of [3, 5, 7, 9, 15]) parts.push(`<circle cx="${(X0 + X1) / 2}" cy="${fy(f)}" r="3.4" class="inlay"/>`);
  parts.push(`<circle cx="${X0 + (X1 - X0) * 0.3}" cy="${fy(12)}" r="3.4" class="inlay"/><circle cx="${X0 + (X1 - X0) * 0.7}" cy="${fy(12)}" r="3.4" class="inlay"/>`);
  for (let s = 6; s >= 1; s--) parts.push(`<line x1="${sx(s)}" x2="${sx(s)}" y1="${TOP - 4}" y2="${H - 8}" class="string" stroke-width="${0.7 + (s - 1) * 0.28}"/>`);
  for (const f of [3, 5, 7, 9, 12, 15]) parts.push(`<text x="${W - 4}" y="${fy(f) + 3.5}" class="fno">${f}</text>`);
  for (const n of notes) {
    const x = sx(n.string), y = fy(n.fret);
    const lab = labels === 'note' ? n.note : n.label;
    parts.push(`<g class="dot k-${n.kind}${n.fresh ? ' fresh' : ''}${n.ghost ? ' ghost' : ''}${n.spot ? ' spot' : ''}"><circle cx="${x}" cy="${y}" r="12.5"/><text x="${x}" y="${y + 4.2}">${lab}</text></g>`);
  }
  return `<svg class="neck" viewBox="0 0 ${W} ${H}" role="img" aria-label="Guitar neck">${parts.join('')}</svg>`;
}
