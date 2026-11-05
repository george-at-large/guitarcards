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

function shown(lab, i, x) {
  if (S.labels === 'note') return T.noteName(x.notes[i], true);
  if (S.labels === 'ten') return T.prettyIv(TENSION[lab] || lab);
  return T.prettyIv(lab);
}

// the upright neck: low E on the left, nut at the top, frets running down the page
function neckSVG(x, fh) {
  const left = 36, sp = 44, nutY = 34;
  const W = left + 5 * sp + 22, H = nutY + FRETS * fh + 10;
  const r = Math.min(fh * 0.44, 15.5), fs = Math.max(7, r * 0.78);
  const X = (s) => left + (6 - s) * sp;
  const Y = (f) => (f === 0 ? nutY - 15 : nutY + (f - 0.5) * fh);
  const INL = [3, 5, 7, 9, 15, 17, 19, 21];
  let g = '';
  for (let f = 1; f <= FRETS; f++) {
    g += `<line x1="${X(6)}" y1="${nutY + f * fh}" x2="${X(1)}" y2="${nutY + f * fh}" class="wire"/>`;
    g += `<text x="10" y="${Y(f) + 3.5}" class="fretnum${INL.includes(f) || f === 12 ? ' strong' : ''}">${f}</text>`;
    if (INL.includes(f)) g += `<circle cx="${(X(4) + X(3)) / 2}" cy="${Y(f)}" r="4" class="inlay"/>`;
    if (f === 12) g += `<circle cx="${(X(5) + X(4)) / 2}" cy="${Y(f)}" r="4" class="inlay"/><circle cx="${(X(3) + X(2)) / 2}" cy="${Y(f)}" r="4" class="inlay"/>`;
  }
  g += `<line x1="${X(6) - 2}" y1="${nutY}" x2="${X(1) + 2}" y2="${nutY}" class="nut"/>`;
  for (let s = 1; s <= 6; s++) g += `<line x1="${X(s)}" y1="${nutY}" x2="${X(s)}" y2="${H - 6}" class="string s${s}"/>`;
  const fresh = prev && prev.key === S.key ? new Set(x.pcs.filter((pc) => !prev.pcs.includes(pc))) : new Set();
  for (let s = 1; s <= 6; s++) for (let f = 0; f <= FRETS; f++) {
    const pc = F.midiAt(s, f) % 12;
    const i = x.pcs.indexOf(pc);
    if (i < 0) continue;
    const lab = x.labs[i];
    if (S.hide.has(lab)) continue;
    const ring = S.rings && x.char.has(semis(x.ivs[i]));
    g += `<g class="msdot ${family(lab, x.ivs[i])}${fresh.has(pc) ? ' fresh' : ''}">${ring ? `<circle class="ring" cx="${X(s)}" cy="${Y(f)}" r="${r + 3}"/>` : ''}<circle cx="${X(s)}" cy="${Y(f)}" r="${r}"/><text x="${X(s)}" y="${Y(f) + fs * 0.36}" style="font-size:${fs.toFixed(1)}px">${esc(shown(lab, i, x))}</text></g>`;
  }
  return { svg: `<svg viewBox="0 0 ${W} ${H}" class="fretboard msvg">${g}</svg>`, W };
}

export function renderModeScroller($app, { onBack }) {
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
    <div class="msrow msinfo"><span class="small muted">${x.notes.map((n) => esc(T.noteName(n, true))).join(' ')} · ${bits.map(esc).join(' · ')}</span></div>
    <div class="msrow msview">
      <span class="seg">${[['whole', 'Whole'], ['mid', 'Zoom'], ['close', 'Close']].map(([k, l]) => `<button data-zoom="${k}" class="${S.zoom === k ? 'on' : ''}">${l}</button>`).join('')}</span>
      <span class="seg">${[['deg', '1 ♭3'], ['ten', '9 11'], ['note', 'C D']].map(([k, l]) => `<button data-lab="${k}" class="${S.labels === k ? 'on' : ''}">${l}</button>`).join('')}</span>
      <button data-ms="rings" class="${S.rings ? 'on' : ''}" aria-label="Ring the notes that make the mode">◎</button>
    </div>
  </div>
  <div class="msneck" id="msneck"></div>
  <div class="panel msnotes small">
    <p><b>${esc(T.pretty(S.key))} ${esc(x.sc.name)}</b>${g[2] ? ` · ${esc(g[0].replace(' modes', ''))} family` : ''}</p>
    <p><span class="msk r">1</span> root · <span class="msk t3">3</span> third · <span class="msk t5">5</span> fifth · <span class="msk t7">7</span> seventh — the chord the mode makes. <span class="msk tx">9</span> cream notes are the tensions (2/9, 4/11, 6/13).</p>
    ${x.char.size ? `<p><span class="msk tx ringed">◎</span> Ringed notes are what make it ${esc(x.sc.name.replace(/ \(.*/, ''))} rather than plain ${x.ivs.map(semis).includes(4) ? 'major' : 'natural minor'}: ${x.labs.filter((lab, i) => x.char.has(semis(x.ivs[i]))).map((lab) => esc(T.prettyIv(lab))).join(', ')}.</p>` : ''}
    <p class="muted">Tap a number in the top row to hide it; “1 3 5 7” shows just the chord. ◀ ▶ walk through the family, and notes that change pulse.</p>
  </div>`;
  const neck = document.getElementById('msneck');
  const head = $app.querySelector('.mshead');
  const draw = () => {
    const cw = Math.min(neck.clientWidth || 340, 420);
    let fh = { mid: 46, close: 66 }[S.zoom];
    if (S.zoom === 'whole') {
      const avail = window.innerHeight - head.getBoundingClientRect().height - 24;
      const Wv = 36 + 5 * 44 + 22;
      fh = Math.max(14, Math.min(46, ((avail * Wv) / cw - 34 - 10) / FRETS));
    }
    neck.innerHTML = neckSVG(x, fh).svg;
  };
  draw();
  prev = { key: S.key, pcs: x.pcs };
  window.onresize = () => { if (document.getElementById('msneck')) draw(); else window.onresize = null; };

  const redraw = () => { save(); const y = window.scrollY; renderModeScroller($app, { onBack }); window.scrollTo(0, y); };
  $app.onchange = (e) => {
    const sel = e.target.closest('select'); if (!sel) return;
    if (sel.dataset.sel === 'key') S.key = sel.value;
    if (sel.dataset.sel === 'scale') { S.scale = sel.value; S.hide = new Set(); }
    redraw();
  };
  $app.onclick = (e) => {
    const b = e.target.closest('button'); if (!b) return;
    const d = b.dataset;
    if (d.ms === 'back') { window.onresize = null; $app.onchange = null; onBack(); return; }
    if (d.ms === 'prev' || d.ms === 'next') { const ids = g[1]; S.scale = ids[(ids.indexOf(S.scale) + (d.ms === 'next' ? 1 : ids.length - 1)) % ids.length]; S.hide = new Set(); return redraw(); }
    if (d.hide) { S.hide.has(d.hide) ? S.hide.delete(d.hide) : S.hide.add(d.hide); if (S.hide.size === x.labs.length) S.hide = new Set(); return redraw(); }
    if (d.ms === 'chord') { S.hide = new Set(x.labs.filter((lab, i) => family(lab, x.ivs[i]) === 'tx')); return redraw(); }
    if (d.ms === 'all') { S.hide = new Set(); return redraw(); }
    if (d.zoom) { S.zoom = d.zoom; return redraw(); }
    if (d.lab) { S.labels = d.lab; return redraw(); }
    if (d.ms === 'rings') { S.rings = !S.rings; return redraw(); }
  };
}
