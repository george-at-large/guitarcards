// Inversions Game: nothing to set. Tap Play and it tells you what to play, in the order a teacher would: triads
// before 7ths, close before spread, top string sets before low ones, one set up the neck before a whole CAGED area,
// and one-note morphs coming in gradually. Clean on 8 of the last 10 prompts at your level, and the next level opens;
// earlier levels keep coming back as review (fuzzy ones most).
import shapes from './shapes.js';
import * as C from './core.js';

export const LEVELS = [
  { name: 'Close triads on the top strings', short: 'close triads, top sets', cfg: { fam: ['triads'], task: ['neck'], triQ: ['maj', 'min'], triV: ['close'] }, sets: ['3-2-1', '4-3-2'], morphs: 'never' },
  { name: 'Close triads on every set, and in CAGED areas', short: 'close triads, every set', cfg: { fam: ['triads'], task: ['neck', 'area'], triQ: ['maj', 'min'], triV: ['close'] }, morphs: 'rare' },
  { name: 'Spread triads', short: 'spread triads', cfg: { fam: ['triads'], task: ['neck', 'area'], triQ: ['maj', 'min'], triV: ['spread'] }, morphs: 'rare' },
  { name: 'Drop 2 7th chords on the top strings', short: 'drop 2, top sets', cfg: { fam: ['sevenths'], task: ['neck'], sevQ: ['maj7', '7', 'm7', 'm7b5'], sevV: ['drop2'] }, sets: ['4-3-2-1', '5-4-3-2'], morphs: 'rare' },
  { name: 'Drop 2 everywhere, and drop 3', short: 'drop 2 and drop 3', cfg: { fam: ['sevenths'], task: ['neck', 'area'], sevQ: ['maj7', '7', 'm7', 'm7b5'], sevV: ['drop2', 'drop3'] }, morphs: 'some' },
  { name: 'Everything, with morphs', short: 'everything', cfg: { fam: ['triads', 'sevenths'], task: ['neck', 'area', 'morph'], triQ: ['maj', 'min', 'dim'], triV: ['close', 'spread'], sevQ: ['maj7', '7', 'm7', 'm7b5'], sevV: ['drop2', 'drop3'] }, morphs: 'some' },
];
const need = 8, WINDOW = 10;
const G = () => { const S = C.state(); return S.game || (S.game = { level: 0, recent: [] }); };
export const gameLevel = () => G().level;

function levelPool(i) {
  const L = LEVELS[i];
  const base = { triQ: [], triV: [], sevQ: [], sevV: [], extQ: [], arpQ: [], arpT: [], arpS: [], diaS: [], diaN: [], morphs: L.morphs };
  return shapes.pool({ ...base, ...L.cfg }).filter((it) => !L.sets || !it.params.ss || L.sets.includes(it.params.ss)).map((it) => ({ ...it, lvl: i }));
}

export default {
  id: 'game',
  title: 'Inversions Game',
  blurb: 'Just play: it tells you which inversions to play, triads to 7ths, and moves you up a level as you get them clean.',
  game: true, dynamic: true, keyed: true,
  tools: { metro: true, drone: true },
  options: [],
  pool() {
    const out = [];
    for (let i = 0; i <= G().level; i++) out.push(...levelPool(i));
    return out;
  },
  // mostly the current level, about a third review from earlier ones
  next(ctx, pool) {
    const lv = G().level;
    const cur = pool.filter((it) => it.lvl === lv), old = pool.filter((it) => it.lvl < lv);
    const from = old.length && Math.random() < 0.3 ? old : cur;
    return { item: ctx.pickItem(from), keyPc: ctx.pickKey() };
  },
  make(item, pc, ctx) {
    const lvl = item.lvl ?? G().level;
    const q = shapes.make(item, pc, { ...ctx, cfg: { morphs: LEVELS[lvl]?.morphs || 'some' } });
    q.kicker = `Level ${G().level + 1} of ${LEVELS.length} · ${LEVELS[G().level].short}${lvl < G().level ? ' · review' : ''}`;
    q.lvl = lvl;
    return q;
  },
  mount(q, el, ctx) { ctx.selfRate(q); },
  // a level opens after 8 clean of the last 10 prompts at the current level
  onResult(q, res) {
    const g = G();
    if (q.lvl !== g.level) return '';
    g.recent = [...g.recent, !!res.clean].slice(-WINDOW);
    if (g.level < LEVELS.length - 1 && g.recent.filter(Boolean).length >= need) {
      g.level++; g.recent = []; C.save();
      return `<b class="good">Level ${g.level + 1}: ${LEVELS[g.level].name}</b>`;
    }
    C.save();
    const left = Math.max(0, need - g.recent.filter(Boolean).length);
    return g.level < LEVELS.length - 1 && left <= 3 ? `${left} more clean to level ${g.level + 2}` : '';
  },
};
