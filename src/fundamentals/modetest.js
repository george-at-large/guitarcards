// Mode Tester: a key and a mode come up ("F♯ Dorian, start on the 5th string"); you play it. Reveal comes in two
// steps: the interval structure first (formula, steps, colour), then the notes on the neck in that position.
import * as T from '../theory.js';
import * as F from '../fretboard.js';
import { neckSVG } from './neck.js';
import { spellTonic, nn, iv, ordinal, esc, pick } from './core.js';
import { TIERS, MODE_DEFAULT, BRIGHTNESS, scaleName, infoHTML } from './scaledata.js';

const STRING_SHAPE = { 6: 'E', 5: 'A', 4: 'D', 3: 'G', 2: 'C' };
const SHAPE_STRING = { E: 6, A: 5, D: 4, G: 3, C: 5 };
const POS = [['string', 'Root string'], ['caged', 'CAGED shape'], ['neck', 'Whole neck'], ['any', 'Anywhere']];
const all = [...TIERS.core, ...TIERS.jazz, ...TIERS.colour];

export default {
  id: 'modetest',
  title: 'Mode Tester',
  blurb: 'A key and a mode, sometimes a string to start on: play it. Reveal the formula if you need it, then the neck.',
  tools: { metro: true, drone: true },
  keyed: true,
  options: [
    { id: 'modes', label: 'Modes', type: 'multi', def: MODE_DEFAULT, groups: [['Core', TIERS.core.map((x) => [x, scaleName(x)])], ['Jazz', TIERS.jazz.map((x) => [x, scaleName(x)])], ['Colour', TIERS.colour.map((x) => [x, scaleName(x)])]] },
    { id: 'pos', label: 'Where', type: 'multi', def: ['string'], choices: POS },
    { id: 'ladder', label: 'Ladder: same key, next mode (brightest to darkest)', type: 'toggle', def: false },
  ],
  pool(c) {
    const out = [];
    for (const id of c.modes) for (const p of c.pos) {
      const places = p === 'string' ? [6, 5, 4, 3, 2].map((s) => 's' + s) : p === 'caged' ? ['C', 'A', 'G', 'E', 'D'] : [p];
      for (const w of places) out.push({ id: `mt|${id}|${w}`, mode: 'modetest', group: id, label: `${scaleName(id)} · ${placeName(w)}`, params: { id, w } });
    }
    return out;
  },
  // the ladder keeps one key and walks the chosen modes from brightest to darkest
  next(ctx, pool) {
    if (!ctx.cfg.ladder) { const item = ctx.pickItem(pool); return { item, keyPc: ctx.pickKey() }; }
    const st = ctx.state;
    const order = [...BRIGHTNESS.filter((m) => ctx.cfg.modes.includes(m)), ...ctx.cfg.modes.filter((m) => !BRIGHTNESS.includes(m))];
    if (st.i == null || st.i >= order.length) { st.i = 0; st.pc = ctx.pickKey(); st.w = pick(pool).params.w; }
    const id = order[st.i++];
    const item = pool.find((x) => x.params.id === id && x.params.w === st.w) || pool.find((x) => x.params.id === id) || pool[0];
    return { item, keyPc: st.pc };
  },
  make(it, pc) {
    const { id, w } = it.params;
    const tonic = spellTonic(pc, id);
    return { kicker: 'Play it', title: `${esc(nn(tonic))} ${esc(scaleName(id))}`, sub: placeText(w), id, w, tonic, droneMidi: 40 + ((pc - 4 + 12) % 12), target: 20000 };
  },
  mount(q, el, ctx) {
    let step = 0;
    const neck = () => {
      const { lo, hi, notes, start } = where(q);
      const dots = notes.map((n) => ({ s: n.string, f: n.fret, iv: n.iv, label: iv(n.iv), ring: start && n.string === start.string && n.fret === start.fret }));
      return `<div class="neckwrap">${neckSVG({ lo, hi, dots, size: hi - lo > 8 ? 'l' : 'm' })}</div>
        <div class="row"><button class="ghost" data-arp="${play(notes, start).join(',')}">▶ Hear it</button></div>`;
    };
    const buttons = () => {
      if (step === 0) ctx.buttons([
        { label: 'Reveal formula', kind: 'ghost', on: () => { step = 1; ctx.reveal(infoHTML(q.id, { title: false })); buttons(); } },
        { label: 'Got it', kind: 'go', on: () => ctx.finish({ clean: true, speed: ctx.speed(q.target), show: () => infoHTML(q.id, { title: false }) + neck() }) },
      ]);
      else ctx.buttons([
        { label: 'Show on the neck', kind: 'ghost', on: () => { ctx.reveal(infoHTML(q.id, { title: false }) + neck()); ctx.finish({ clean: false, fuzz: 1, why: 'needed the neck' }); } },
        { label: 'Played it', kind: 'go', on: () => ctx.finish({ clean: false, fuzz: 0.5, why: 'needed the formula', show: () => infoHTML(q.id, { title: false }) + neck() }) },
      ]);
    };
    buttons();
  },
};

function placeName(w) {
  if (w === 'neck') return 'whole neck';
  if (w === 'any') return 'anywhere';
  if (w[0] === 's') return `from the ${ordinal(Number(w[1]))} string`;
  return `${w} shape`;
}
function placeText(w) {
  if (w === 'neck') return 'Whole neck: root to root through all five areas, low to high and back.';
  if (w === 'any') return 'Anywhere you like, root to root, saying the degrees.';
  if (w[0] === 's') return `Start on the root on the <b>${ordinal(Number(w[1]))} string</b> and play through the position, up and back.`;
  return `<b>${w} shape</b> (root on the ${ordinal(SHAPE_STRING[w])} string): lowest note in the area to the highest and back.`;
}
// the notes to show for the position asked
function where(q) {
  const { id, w, tonic } = q;
  if (w === 'neck' || w === 'any') return { lo: 0, hi: 15, notes: F.regionNotes({ root: tonic, scale: id, region: { frets: [0, 15] } }) };
  const shape = w[0] === 's' ? STRING_SHAPE[w[1]] : w;
  const win = F.cagedWindow(tonic, shape);
  const notes = F.regionNotes({ root: tonic, scale: id, region: { caged: shape } });
  let start = null;
  if (w[0] === 's') {
    const s = Number(w[1]);
    start = notes.filter((n) => n.string === s && F.simpleIv(n.iv) === '1').sort((a, b) => a.fret - b.fret)[0] || null;
  }
  const lo = win.lo <= 1 ? 0 : win.lo - 1;
  return { lo, hi: Math.max(win.hi + 1, lo + 5), notes, start };
}
function play(notes, start) {
  const asc = [...notes].sort((a, b) => a.midi - b.midi);
  const i = start ? asc.findIndex((n) => n.midi === start.midi) : asc.findIndex((n) => F.simpleIv(n.iv) === '1');
  const up = i > 0 ? asc.slice(i) : asc;
  return up.concat(up.slice(0, -1).reverse()).map((n) => n.midi);
}
