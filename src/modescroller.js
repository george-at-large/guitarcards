// Mode scroller: any scale or mode in any key, lit up across the whole upright neck. Visual only, no sound.
// Colours follow the chord the mode makes: root, 3rd, 5th and 7th each have a colour, tensions are cream,
// and a ring marks the notes that make it this mode rather than plain major or natural minor.
import * as T from './theory.js';
import * as F from './fretboard.js';
import { esc } from './render.js';

const KEYS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
const FRETS = 22;
const GROUPS = [
  ['Major modes', ['ionian', 'dorian', 'phrygian', 'lydian', 'mixolydian', 'aeolian', 'locrian'], true],
  ['Melodic minor modes', ['melodic-minor', 'dorian-b2', 'lydian-augmented', 'lydian-dominant', 'mixolydian-b6', 'locrian-nat2', 'altered'], true],
  ['Harmonic minor modes', ['harmonic-minor', 'locrian-nat6', 'ionian-sharp5', 'dorian-sharp4', 'phrygian-dominant', 'lydian-sharp2', 'altered-dim'], true],
  ['Harmonic major modes', ['harmonic-major', 'dorian-b5', 'phrygian-b4', 'lydian-b3', 'mixolydian-b2', 'lydian-augmented-sharp2', 'locrian-bb7'], true],
  ['Diminished & symmetric', ['diminished-hw', 'diminished-wh', 'whole-tone', 'augmented']],
  ['Pentatonic & blues', ['major-pentatonic', 'minor-pentatonic', 'blues', 'major-blues', 'dominant-pentatonic', 'minor6-pentatonic', 'in-sen', 'hirajoshi']],
  ['Bebop', ['bebop-major', 'bebop-dominant', 'bebop-dorian', 'bebop-melodic-minor']],
  ['Other', ['double-harmonic', 'gypsy-minor']],
];
// what each one is called on a lead sheet, so "half-diminished" or "7♭9" finds its scale
const HINT = {
  ionian: 'maj7', dorian: 'm7, m6', phrygian: 'm7 ♭9 sound', lydian: 'maj7♯11', mixolydian: '7', aeolian: 'natural minor', locrian: 'half-diminished m7♭5',
  'melodic-minor': 'm(maj7), m6', 'dorian-b2': 'sus♭9', 'lydian-augmented': 'maj7♯5', 'lydian-dominant': '7♯11', 'mixolydian-b6': '7♭13', 'locrian-nat2': 'half-diminished m9♭5', altered: '7alt',
  'harmonic-minor': 'm(maj7)', 'phrygian-dominant': '7♭9 in minor', 'altered-dim': 'dim7',
  'diminished-hw': '7♭9 ♯9 13', 'diminished-wh': 'dim7', 'whole-tone': '7♯5 9', augmented: 'maj7♯5',
};

const STORE = 'guitarcards-modes';
const load = () => { try { return JSON.parse(localStorage.getItem(STORE) || 'null'); } catch (e) { return null; } };
const S = Object.assign({ key: 'D', scale: 'dorian', zoom: 'whole', labels: 'deg', rings: true }, load() || {});
S.hide = new Set();
const save = () => { try { localStorage.setItem(STORE, JSON.stringify({ key: S.key, scale: S.scale, zoom: S.zoom, labels: S.labels, rings: S.rings })); } catch (e) { /* private mode */ } };
if (!T.SCALES[S.scale]) S.scale = 'dorian';

const groupOf = (id) => GROUPS.find((g) => g[1].includes(id)) || GROUPS[0];
const nameOf = (id) => { const g = groupOf(id); return `${g[2] ? `${g[1].indexOf(id) + 1}. ` : ''}${T.SCALES[id].name}`; };
const labelsOf = (sc) => sc.labels || sc.ivs;
const semis = (iv) => T.intervalSemis(F.simpleIv(iv));
const TENSION = { 2: '9', b2: 'b9', '#2': '#9', 4: '11', '#4': '#11', b6: 'b13', 6: '13' };
// colour family of a degree label: root, third, fifth, seventh, or a tension
function family(lab, iv) {
  if (lab === '1') return 'r';
  if (lab === 'b4' && semis(iv) === 4) return 't3';
  const n = Number(lab.replace(/[^0-9]/g, '')); const d = ((n - 1) % 7) + 1;
  return { 3: 't3', 5: 't5', 7: 't7' }[d] || 'tx';
}
// the notes that set a mode apart from plain major (if it has a major 3rd) or natural minor (if it has a minor 3rd)
function characteristic(ivs) {
  const set = ivs.map(semis);
  const base = set.includes(4) ? [0, 2, 4, 5, 7, 9, 11] : set.includes(3) ? [0, 2, 3, 5, 7, 8, 10] : null;
  return base ? new Set(set.filter((x) => !base.includes(x))) : new Set();
}
// scales spelled the jazz way (♯9, ♭13…) name their chord from that spelling, not from stacked letters
const CHORD = { altered: '7alt', 'super-locrian': '7alt', 'phrygian-dominant': '7♭9', 'spanish-phrygian': '7♭9', 'altered-dim': '°7' };
const STEP = { 1: 'H', 2: 'W', 3: 'W½', 4: '2W' };

let prev = null; // last key + pitch set, so changed notes pulse when you step to the next mode

function info() {
  const sc = T.SCALES[S.scale];
  const root = T.parseNote(S.key);
  const ivs = sc.ivs;
  const labs = labelsOf(sc);
  const notes = ivs.map((iv) => T.transpose(root, iv));
  const pcs = notes.map(T.notePc);
  const steps = ivs.map((iv, i) => (semis(ivs[(i + 1) % ivs.length]) - semis(iv) + 12) % 12 || 12);
  const p = T.parentOf(root, S.scale);
  const parent = p && p.degree > 1 ? `${ord(p.degree)} mode of ${T.noteName(p.root, true)} ${T.SCALES[p.scaleId].name.replace(/ \(.*/, '').replace('Ionian', 'major').toLowerCase()}` : '';
  let chord = '';
  if (CHORD[S.scale]) chord = T.pretty(S.key) + CHORD[S.scale];
  else if (ivs.length === 7) { const c = T.diatonicChord(root, S.scale, 0, 4); if (c.quality) chord = T.pretty(T.chordSymbol(root, c.quality)); }
  return { sc, root, ivs, labs, notes, pcs, steps, parent, chord, char: characteristic(ivs) };
}
const ord = (n) => `${n}${{ 1: 'st', 2: 'nd', 3: 'rd' }[n] || 'th'}`;

// interval names by degree and size: m3, P5, A4, d5…
const QUAL = { 1: { 0: 'R' }, 2: { 1: 'm2', 2: 'M2', 3: 'A2' }, 3: { 2: 'd3', 3: 'm3', 4: 'M3' }, 4: { 4: 'd4', 5: 'P4', 6: 'A4' }, 5: { 6: 'd5', 7: 'P5', 8: 'A5' }, 6: { 8: 'm6', 9: 'M6', 10: 'A6' }, 7: { 9: 'd7', 10: 'm7', 11: 'M7' } };
function ivName(lab) {
  const sl = F.simpleIv(lab);
  const n = Number(sl.replace(/[^0-9]/g, ''));
  return QUAL[n]?.[T.intervalSemis(sl)] || T.prettyIv(lab);
}
function shown(lab, i, x) {
  if (S.labels === 'note') return T.noteName(x.notes[i], true);
  if (S.labels === 'name') return ivName(lab);
  if (S.labels === 'ten') return T.prettyIv(TENSION[lab] || lab);
  return T.prettyIv(lab);
}

// the upright neck: low E on the left, nut at the top, frets running down the page.
// tile: frets 1–12 with no nut and no numbers, so copies stacked end to end make an endless neck.
const SP = 44, PADL = 42, PADR = 18;
const VW = PADL + 5 * SP + PADR;
const GAUGE = { 1: 1.1, 2: 1.4, 3: 1.8, 4: 2.2, 5: 2.6, 6: 3.0 };
const DEFS = `<defs>
  <linearGradient id="msWood" x1="0" x2="1"><stop offset="0" stop-color="#1f130b"/><stop offset=".18" stop-color="#2f1d12"/><stop offset=".5" stop-color="#3a2416"/><stop offset=".82" stop-color="#2f1d12"/><stop offset="1" stop-color="#1f130b"/></linearGradient>
  <linearGradient id="msFret" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fbfbf8"/><stop offset=".45" stop-color="#cfd0cc"/><stop offset="1" stop-color="#7d7e7a"/></linearGradient>
  <linearGradient id="msNut" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fbf4e3"/><stop offset="1" stop-color="#c9b994"/></linearGradient>
  <radialGradient id="msPearl" cx=".38" cy=".35" r=".75"><stop offset="0" stop-color="#ffffff"/><stop offset=".45" stop-color="#e9e3f2"/><stop offset=".8" stop-color="#bfd3d6"/><stop offset="1" stop-color="#a7b2bf"/></radialGradient>
  <linearGradient id="msWound" x1="0" x2="1"><stop offset="0" stop-color="#8c7550"/><stop offset=".5" stop-color="#f0dfb8"/><stop offset="1" stop-color="#8c7550"/></linearGradient>
  <linearGradient id="msPlain" x1="0" x2="1"><stop offset="0" stop-color="#9ea3a8"/><stop offset=".5" stop-color="#ffffff"/><stop offset="1" stop-color="#9ea3a8"/></linearGradient>
  <radialGradient id="msShine" cx=".35" cy=".28" r=".7"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".55" stop-color="#fff" stop-opacity="0"/></radialGradient>
</defs>`;
// fixed, so the grain doesn't shimmer between redraws
const GRAIN = [0.07, 0.15, 0.22, 0.31, 0.37, 0.46, 0.52, 0.61, 0.69, 0.74, 0.83, 0.9, 0.95];

function neckSVG(x, fh, { tile = false } = {}) {
  const from = tile ? 1 : 0, last = tile ? 12 : FRETS;
  const top = tile ? 0 : 38;                          // room above the nut for open-string notes
  const H = top + last * fh + (tile ? 0 : 12);
  const r = Math.min(fh * 0.42, 15), fs = Math.max(7, r * 0.8);
  const X = (s) => PADL + (6 - s) * SP;
  const Y = (f) => (f === 0 ? top - 17 : top + (f - 0.5) * fh);
  const bx = X(6) - 15, bw = X(1) - X(6) + 30, by = tile ? 0 : top, bh = tile ? H : H - top - 4;
  let g = DEFS;
  g += `<rect class="board" x="${bx}" y="${by}" width="${bw}" height="${bh}" fill="url(#msWood)"${tile ? '' : ' rx="3"'}/>`;
  for (const k of GRAIN) g += `<line x1="${bx + k * bw}" y1="${by}" x2="${bx + k * bw + (k > 0.5 ? 1.5 : -1.5)}" y2="${by + bh}" stroke="#000" stroke-opacity="${(0.08 + (k * 7 % 1) * 0.1).toFixed(2)}" stroke-width="${(0.6 + (k * 13 % 1)).toFixed(2)}"/>`;
  g += `<line x1="${bx + 0.8}" y1="${by}" x2="${bx + 0.8}" y2="${by + bh}" class="binding"/><line x1="${bx + bw - 0.8}" y1="${by}" x2="${bx + bw - 0.8}" y2="${by + bh}" class="binding"/>`;
  const INL = [3, 5, 7, 9, 15, 17, 19, 21];
  const cx = (X(4) + X(3)) / 2;
  for (let f = 1; f <= last; f++) {
    if (INL.includes(f)) g += `<circle cx="${cx}" cy="${Y(f)}" r="5.5" fill="url(#msPearl)" opacity=".8"/>`;
    if (f === 12) g += `<circle cx="${(X(5) + X(4)) / 2}" cy="${Y(f)}" r="5.5" fill="url(#msPearl)" opacity=".8"/><circle cx="${(X(3) + X(2)) / 2}" cy="${Y(f)}" r="5.5" fill="url(#msPearl)" opacity=".8"/>`;
    const wy = top + f * fh - (tile && f === last ? 3.2 : 1.6);
    g += `<rect x="${bx}" y="${wy + 2.6}" width="${bw}" height="2" fill="#000" opacity=".35"/><rect x="${bx}" y="${wy}" width="${bw}" height="3.2" rx="1" fill="url(#msFret)"/>`;
    if (!tile) g += `<text x="12" y="${Y(f) + 3.5}" class="fretnum${INL.includes(f) || f === 12 ? ' strong' : ''}">${f}</text>`;
  }
  if (!tile) g += `<rect x="${bx - 1}" y="${top - 7}" width="${bw + 2}" height="8" rx="1.5" fill="url(#msNut)"/>`;
  for (let s = 1; s <= 6; s++) {
    const y1 = tile ? 0 : top - 7, w = GAUGE[s];
    g += `<line x1="${X(s) + 1.3}" y1="${y1}" x2="${X(s) + 1.3}" y2="${tile ? H : H - 4}" stroke="#000" stroke-opacity=".45" stroke-width="${w}"/>`;
    g += `<rect x="${X(s) - w / 2}" y="${y1}" width="${w}" height="${(tile ? H : H - 4) - y1}" fill="url(#${s >= 3 ? 'msWound' : 'msPlain'})"/>`;
  }
  const fresh = prev && prev.key === S.key ? new Set(x.pcs.filter((pc) => !prev.pcs.includes(pc))) : new Set();
  for (let s = 1; s <= 6; s++) for (let f = from; f <= last; f++) {
    const pc = F.midiAt(s, f) % 12;
    const i = x.pcs.indexOf(pc);
    if (i < 0) continue;
    const lab = x.labs[i];
    if (S.hide.has(lab)) continue;
    const ring = S.rings && x.char.has(semis(x.ivs[i]));
    const rr = f === 0 ? r * 0.82 : r;
    const label = shown(lab, i, x);
    const size = (label.length > 2 ? fs * 0.82 : fs) * (f === 0 ? 0.88 : 1);
    g += `<g class="msdot ${family(lab, x.ivs[i])}${fresh.has(pc) ? ' fresh' : ''}${f === 0 ? ' open' : ''}"><circle class="sh" cx="${X(s)}" cy="${Y(f) + 1.6}" r="${rr + 0.6}"/>${ring ? `<circle class="ring" cx="${X(s)}" cy="${Y(f)}" r="${rr + 3.2}"/>` : ''}<circle cx="${X(s)}" cy="${Y(f)}" r="${rr}"/><circle cx="${X(s)}" cy="${Y(f)}" r="${rr}" fill="url(#msShine)" class="shine"/><text x="${X(s)}" y="${Y(f) + size * 0.36}" style="font-size:${size.toFixed(1)}px">${esc(label)}</text></g>`;
  }
  // endless has no fret numbers, so drop their gutter and centre the board
  const vx = tile ? PADL - PADR : 0;
  return `<svg viewBox="${vx} 0 ${VW - vx} ${H}" class="msvg${tile ? ' tile' : ''}">${g}</svg>`;
}

let onScroll = null;
const TILES = 24;
export function renderModeScroller($app, { onBack }, keepY = null) {
  const x = info();
  const g = groupOf(S.scale);
  const legend = x.labs.map((lab, i) => `<button class="msleg ${family(lab, x.ivs[i])}${S.hide.has(lab) ? ' off' : ''}${S.rings && x.char.has(semis(x.ivs[i])) ? ' char' : ''}" data-hide="${esc(lab)}" aria-label="Show or hide ${esc(lab)}"><i>${esc(shown(lab, i, x))}</i></button>`).join('');
  const bits = [x.parent, x.chord && `chord ${x.chord}`, x.steps.map((s) => STEP[s] || s).join(' ')].filter(Boolean);
  $app.innerHTML = `
  <div class="mshead">
    <div class="msrow"><button class="icon" data-ms="back" aria-label="Back">←</button>
      <select data-sel="key" aria-label="Key">${KEYS.map((k) => `<option value="${k}"${k === S.key ? ' selected' : ''}>${esc(T.pretty(k))}</option>`).join('')}</select>
      <select data-sel="scale" aria-label="Scale">${GROUPS.map(([gn, ids]) => `<optgroup label="${esc(gn)}">${ids.map((id) => `<option value="${id}"${id === S.scale ? ' selected' : ''}>${esc(nameOf(id))}${HINT[id] ? ` — ${esc(HINT[id])}` : ''}</option>`).join('')}</optgroup>`).join('')}</select>
      <button data-ms="prev" aria-label="Previous in this family">◀</button><button data-ms="next" aria-label="Next in this family">▶</button></div>
    <div class="msrow mslegend">${legend}<button class="chip" data-ms="chord">1 3 5 7</button>${S.hide.size ? '<button class="chip" data-ms="all">All</button>' : ''}</div>
    <div class="msrow msinfo"><span class="small muted">${S.labels === 'note' ? x.labs.map((lab) => esc(T.prettyIv(lab))).join(' ') : x.notes.map((n) => esc(T.noteName(n, true))).join(' ')} · ${bits.map(esc).join(' · ')}</span></div>
    <div class="msrow msview">
      <span class="seg">${[['whole', 'Whole'], ['mid', 'Zoom'], ['close', 'Close'], ['inf', '∞ Endless']].map(([k, l]) => `<button data-zoom="${k}" class="${S.zoom === k ? 'on' : ''}">${l}</button>`).join('')}</span>
      <button data-ms="rings" class="${S.rings ? 'on' : ''}" aria-label="Ring the notes that make the mode">◎</button>
    </div>
    <div class="msrow msview"><span class="seg">${[['deg', '1 ♭3 5'], ['name', 'm3 P5'], ['ten', '9 11 13'], ['note', 'C E♭ G']].map(([k, l]) => `<button data-lab="${k}" class="${S.labels === k ? 'on' : ''}">${l}</button>`).join('')}</span></div>
  </div>
  <div class="msneck${S.zoom === 'inf' ? ' inf' : ''}" id="msneck"></div>
  ${S.zoom === 'inf' ? '' : `<div class="panel msnotes small">
    <p><b>${esc(T.pretty(S.key))} ${esc(x.sc.name)}</b>${g[2] ? ` · ${esc(g[0].replace(' modes', ''))} family` : ''}</p>
    <p><span class="msk r">1</span> root · <span class="msk t3">3</span> third · <span class="msk t5">5</span> fifth · <span class="msk t7">7</span> seventh — the chord the mode makes. <span class="msk tx">9</span> cream notes are the tensions (2/9, 4/11, 6/13).</p>
    ${x.char.size ? `<p><span class="msk tx ringed">◎</span> Ringed notes are what make it ${esc(x.sc.name.replace(/ \(.*/, ''))} rather than plain ${x.ivs.map(semis).includes(4) ? 'major' : 'natural minor'}: ${x.labs.filter((lab, i) => x.char.has(semis(x.ivs[i]))).map((lab) => esc(T.prettyIv(lab))).join(', ')}.</p>` : ''}
    <p class="muted">Tap a number in the top row to hide it; “1 3 5 7” shows just the chord. ◀ ▶ walk through the family, and notes that change pulse. ∞ Endless turns the neck into a loop with no fret numbers: keep scrolling and it never ends.</p>
  </div>`}`;
  const neck = document.getElementById('msneck');
  const head = $app.querySelector('.mshead');
  const draw = () => {
    const cw = Math.min(neck.clientWidth || 340, 420);
    if (S.zoom === 'inf') { neck.innerHTML = neckSVG(x, 46, { tile: true }).repeat(TILES); return; }
    let fh = { mid: 46, close: 66 }[S.zoom];
    if (S.zoom === 'whole') {
      const avail = window.innerHeight - head.getBoundingClientRect().height - 24;
      fh = Math.max(14, Math.min(46, ((avail * VW) / cw - 38 - 12) / FRETS));
    }
    neck.innerHTML = neckSVG(x, fh);
  };
  draw();
  // endless: identical 12-fret tiles; near either end, jump by a whole number of tiles, which looks like nothing happened
  if (onScroll) window.removeEventListener('scroll', onScroll);
  onScroll = null;
  if (S.zoom === 'inf') {
    const tiles = neck.children;
    const tileH = () => tiles[1].getBoundingClientRect().top - tiles[0].getBoundingClientRect().top;
    const neckTop = () => neck.getBoundingClientRect().top + window.scrollY;
    onScroll = () => {
      if (!document.getElementById('msneck')) { window.removeEventListener('scroll', onScroll); onScroll = null; return; }
      const t = tileH(), y = window.scrollY - neckTop();
      if (y < 3 * t) window.scrollTo(0, window.scrollY + 8 * t);
      else if (y > (TILES - 5) * t) window.scrollTo(0, window.scrollY - 8 * t);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    if (keepY == null || keepY < neckTop() + 3 * tileH()) window.scrollTo(0, neckTop() + 8 * tileH() - head.getBoundingClientRect().height);
  }
  prev = { key: S.key, pcs: x.pcs };
  window.onresize = () => { if (document.getElementById('msneck')) draw(); else window.onresize = null; };

  const redraw = () => { save(); const y = window.scrollY; renderModeScroller($app, { onBack }, y); window.scrollTo(0, y); };
  $app.onchange = (e) => {
    const sel = e.target.closest('select'); if (!sel) return;
    if (sel.dataset.sel === 'key') S.key = sel.value;
    if (sel.dataset.sel === 'scale') { S.scale = sel.value; S.hide = new Set(); }
    redraw();
  };
  $app.onclick = (e) => {
    const b = e.target.closest('button'); if (!b) return;
    const d = b.dataset;
    if (d.ms === 'back') { window.onresize = null; $app.onchange = null; if (onScroll) window.removeEventListener('scroll', onScroll); onScroll = null; onBack(); return; }
    if (d.ms === 'prev' || d.ms === 'next') { const ids = g[1]; S.scale = ids[(ids.indexOf(S.scale) + (d.ms === 'next' ? 1 : ids.length - 1)) % ids.length]; S.hide = new Set(); return redraw(); }
    if (d.hide) { S.hide.has(d.hide) ? S.hide.delete(d.hide) : S.hide.add(d.hide); if (S.hide.size === x.labs.length) S.hide = new Set(); return redraw(); }
    if (d.ms === 'chord') { S.hide = new Set(x.labs.filter((lab, i) => family(lab, x.ivs[i]) === 'tx')); return redraw(); }
    if (d.ms === 'all') { S.hide = new Set(); return redraw(); }
    if (d.zoom) { const was = S.zoom; S.zoom = d.zoom; if ((was === 'inf') !== (S.zoom === 'inf')) { save(); window.scrollTo(0, 0); renderModeScroller($app, { onBack }); return; } return redraw(); }
    if (d.lab) { S.labels = d.lab; return redraw(); }
    if (d.ms === 'rings') { S.rings = !S.rings; return redraw(); }
  };
}
