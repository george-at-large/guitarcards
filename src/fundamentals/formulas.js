// Scale Formulas: a scale's name comes up and you tap its degrees; or a formula comes up and you name the scale.
// A wrong answer or Reveal shows the formula, the steps, the family and the colour note, and the quiz carries on.
import * as T from '../theory.js';
import { TIERS, TIER_NAMES, scaleName, pcsOf, formula, infoHTML } from './scaledata.js';
import { shuffle, pick, esc } from './core.js';

const GRID = [[0, '1'], [1, '♭2'], [2, '2'], [3, '♭3'], [4, '3'], [5, '4'], [6, '♯4/♭5'], [7, '5'], [8, '♯5/♭6'], [9, '6'], [10, '♭7'], [11, '7']];

export default {
  id: 'formulas',
  title: 'Scale Formulas',
  blurb: 'A scale comes up: tap its intervals. Or a formula comes up: name the scale. 46 scales in three tiers.',
  keyed: false,
  options: [
    { id: 'tiers', label: 'Scales', type: 'multi', def: ['core', 'jazz'], choices: Object.entries(TIER_NAMES).map(([k, v]) => [k, `${v} (${TIERS[k].length})`]) },
    { id: 'dir', label: 'Questions', type: 'multi', def: ['formula'], choices: [['formula', 'Name → formula'], ['name', 'Formula → name']] },
  ],
  pool(c) {
    const out = [];
    for (const t of c.tiers) for (const id of TIERS[t]) for (const d of c.dir) {
      out.push({ id: `sf|${d}|${id}`, mode: 'formulas', label: d === 'formula' ? `${scaleName(id)}: its formula` : `${scaleName(id)}: name it from the formula`, params: { d, id, tier: t } });
    }
    return out;
  },
  make(it, pc, ctx) {
    const { d, id, tier } = it.params;
    if (d === 'formula') return { kicker: 'Tap the formula', title: esc(scaleName(id)), sub: 'Tap every degree, then Check.', d, id };
    // name it: distractors from the same tiers, similar size first
    const tiers = ctx.cfg.tiers || [tier];
    const all = tiers.flatMap((t) => TIERS[t]).filter((x) => x !== id && pcsOf(x).join() !== pcsOf(id).join());
    const n = pcsOf(id).length;
    const near = shuffle(all.filter((x) => Math.abs(pcsOf(x).length - n) <= 0)).slice(0, 3);
    const rest = shuffle(all.filter((x) => !near.includes(x))).slice(0, 5 - near.length);
    return { kicker: 'Name the scale', title: esc(formula(id)), sub: `${n} notes. Which scale is it?`, d, id, choices: shuffle([id, ...near, ...rest]) };
  },
  mount(q, el, ctx) {
    if (q.d === 'name') return nameIt(q, el, ctx);
    const want = new Set(pcsOf(q.id));
    const sel = new Set([0]);
    const draw = (checked = false) => {
      el.innerHTML = `<div class="pad c4">${GRID.map(([s, l]) => {
        let cls = sel.has(s) ? 'sel' : '';
        if (checked) cls = sel.has(s) && want.has(s) ? 'right' : sel.has(s) ? 'wrong' : want.has(s) ? 'missed' : '';
        return `<button data-s="${s}" class="${cls}" ${s === 0 || checked ? 'disabled' : ''}>${l}</button>`;
      }).join('')}</div>`;
      if (!checked) el.querySelectorAll('[data-s]').forEach((b) => (b.onclick = () => { const s = Number(b.dataset.s); sel.has(s) ? sel.delete(s) : sel.add(s); draw(); }));
    };
    draw();
    const check = (gaveUp) => {
      const ok = !gaveUp && sel.size === want.size && [...want].every((s) => sel.has(s));
      if (gaveUp) { sel.clear(); sel.add(0); }
      draw(true);
      ctx.reveal(infoHTML(q.id));
      ctx.finish({ clean: ok, speed: ctx.speed(want.size * 1600), auto: ok, delay: 1600, why: gaveUp ? 'revealed' : ok ? '' : 'not quite' });
    };
    ctx.buttons([{ label: 'Reveal', kind: 'ghost', on: () => check(true) }, { label: 'Check', kind: 'go', on: () => check(false) }]);
  },
};

function nameIt(q, el, ctx) {
  el.innerHTML = `<div class="choices">${q.choices.map((id) => `<button data-id="${id}">${esc(scaleName(id))}</button>`).join('')}</div>`;
  const answer = (pickId) => {
    el.querySelectorAll('[data-id]').forEach((b) => { b.disabled = true; if (b.dataset.id === q.id) b.classList.add('right'); else if (b.dataset.id === pickId) b.classList.add('wrong'); });
    const ok = pickId === q.id;
    ctx.reveal(infoHTML(q.id));
    ctx.finish({ clean: ok, speed: ctx.speed(5000), auto: ok, delay: 1400, why: pickId ? (ok ? '' : 'wrong scale') : 'revealed' });
  };
  el.querySelectorAll('[data-id]').forEach((b) => (b.onclick = () => answer(b.dataset.id)));
  ctx.buttons([{ label: 'Reveal', kind: 'ghost', on: () => answer(null) }]);
}
