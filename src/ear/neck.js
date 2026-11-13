// The neck the ear trainer draws: a few frets of a horizontal fretboard (high e on top), dots that sound (filled and
// glowing), hold (an empty ring: keep hearing it), wait to be imagined (a dashed ring), dim, and slide between frets.
const NS = 'http://www.w3.org/2000/svg';
const W = 520, H = 206;
const TOP = 30, BOT = 172; // high e and low E strings
const sy = (s) => TOP + (s - 1) * (BOT - TOP) / 5;
export const FAMILY_COLOURS = { r: '#ffb547', t3: '#ff7a9a', t5: '#5ccdf2', t7: '#b49cff', tx: '#efe8da' };

export function family(iv) {
  const s = String(iv);
  if (s === '1' || s === 'bass') return 'r';
  const d = Number(s.replace(/[^0-9]/g, ''));
  return { 3: 't3', 5: 't5', 7: 't7' }[((d - 1) % 7) + 1] || 'tx';
}
export const prettyIv = (iv) => String(iv).replace(/bb/g, '𝄫').replace(/b/g, '♭').replace(/#/g, '♯');

function el(tag, attrs = {}, parent) {
  const e = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  if (parent) parent.appendChild(e);
  return e;
}

export function createNeck(host) {
  const svg = el('svg', { viewBox: `0 0 ${W} ${H}`, class: 'eneck', role: 'img', 'aria-label': 'Guitar neck' });
  host.appendChild(svg);
  const defs = el('defs', {}, svg);
  defs.innerHTML = `<linearGradient id="enWood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1f130b"/><stop offset=".5" stop-color="#3a2416"/><stop offset="1" stop-color="#1f130b"/></linearGradient>
    <linearGradient id="enFret" x1="0" x2="1"><stop offset="0" stop-color="#7d7e7a"/><stop offset=".5" stop-color="#e9eae6"/><stop offset="1" stop-color="#7d7e7a"/></linearGradient>
    <filter id="enGlow" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="7"/></filter>`;
  const board = el('g', {}, svg);
  const dotsG = el('g', {}, svg);
  let lo = 0, hi = 7, xs = [];
  const dots = new Map(); // key -> {g, glow, circle, text, string, fret}

  function fx(f) { // x of fret wire f
    const a = 1 - Math.pow(2, -lo / 12), b = 1 - Math.pow(2, -hi / 12);
    const x0 = lo === 0 ? 44 : 14, x1 = W - 10;
    return x0 + ((1 - Math.pow(2, -f / 12)) - a) / (b - a) * (x1 - x0);
  }
  const posX = (f) => (f === 0 ? fx(0) - 22 : (fx(f - 1) + fx(f)) / 2);

  function drawBoard() {
    board.innerHTML = '';
    const xL = lo === 0 ? fx(0) : 0;
    el('rect', { x: xL, y: TOP - 18, width: W - xL, height: BOT - TOP + 36, fill: 'url(#enWood)', rx: 3 }, board);
    for (const f of [3, 5, 7, 9, 15, 17]) if (f > lo && f <= hi) el('circle', { cx: (fx(f - 1) + fx(f)) / 2, cy: (TOP + BOT) / 2, r: 7, fill: '#cfcadb', opacity: 0.55 }, board);
    if (12 > lo && 12 <= hi) for (const y of [(sy(2) + sy(3)) / 2, (sy(4) + sy(5)) / 2]) el('circle', { cx: (fx(11) + fx(12)) / 2, cy: y, r: 7, fill: '#cfcadb', opacity: 0.55 }, board);
    if (lo === 0) el('rect', { x: fx(0) - 6, y: TOP - 18, width: 7, height: BOT - TOP + 36, fill: '#e9dfc4' }, board);
    for (let f = lo === 0 ? 1 : lo; f <= hi; f++) el('rect', { x: fx(f) - 2.2, y: TOP - 18, width: 4.4, height: BOT - TOP + 36, fill: 'url(#enFret)', opacity: 0.85 }, board);
    for (let s = 1; s <= 6; s++) el('rect', { x: 0, y: sy(s) - (0.6 + 0.32 * (s - 1)), width: W, height: 1.2 + 0.64 * (s - 1), fill: s >= 4 ? '#cdb98d' : '#d7dade', opacity: 0.8 }, board);
    if (lo > 0) { const t = el('text', { x: posX(lo + 1), y: H - 6, class: 'enfn' }, board); t.textContent = `${lo + 1}`; }
  }

  function place(d) {
    d.g.style.transform = `translate(${posX(d.fret)}px, ${sy(d.string)}px)`;
  }

  // the window of frets shown: enough to hold every note given, at least `min` frets wide
  function windowFor(notes, min = 4) {
    const fs = notes.map((n) => n.fret);
    if (!fs.length) return;
    const fretted = fs.filter((f) => f > 0);
    let a = fretted.length ? Math.min(...fretted) - 1 : 0;
    let b = Math.max(...fs, a + min);
    if (fs.includes(0) || a <= 1) a = 0;
    if (b - a < min) b = a + min;
    if (a !== lo || b !== hi) { lo = a; hi = b; drawBoard(); dots.forEach(place); }
  }

  // notes: [{key, string, fret, iv, state}] (state: on | ring | ghost | off), plus dim and boost flags
  function set(notes, { window: win = true } = {}) {
    if (win) windowFor(notes.filter((n) => n.state && n.state !== 'off'));
    const seen = new Set();
    for (const n of notes) {
      seen.add(n.key);
      let d = dots.get(n.key);
      if (!d) {
        const g = el('g', { class: 'endot' }, dotsG);
        const glow = el('circle', { r: 23, class: 'englow', filter: 'url(#enGlow)' }, g);
        const circle = el('circle', { r: 17, class: 'encirc' }, g);
        const text = el('text', { class: 'entxt', y: 6 }, g);
        d = { g, glow, circle, text };
        dots.set(n.key, d);
        d.string = n.string; d.fret = n.fret; place(d);
        g.getBoundingClientRect(); // so the first state fades in
      }
      if (d.string !== n.string || d.fret !== n.fret) { d.string = n.string; d.fret = n.fret; place(d); }
      const col = FAMILY_COLOURS[family(n.iv)];
      d.g.style.setProperty('--c', col);
      d.text.textContent = n.label ?? prettyIv(n.iv);
      d.g.setAttribute('class', `endot ${n.state || 'off'}${n.dim ? ' dim' : ''}${n.boost ? ' boost' : ''}`);
    }
    for (const [k, d] of dots) if (!seen.has(k)) d.g.setAttribute('class', 'endot off');
  }
  function clear() { dots.forEach((d) => d.g.remove()); dots.clear(); }
  drawBoard();
  return { set, clear, windowFor, el: svg };
}
