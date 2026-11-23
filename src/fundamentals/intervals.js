// Interval Finder: a key and an area of the neck come up and you tap every ♭3 there (or the whole neck, or just one,
// or two intervals at once) before the countdown runs out. "Name it" lights one dot for you to name. Stay keeps the
// key and walks through its five CAGED areas; Roam changes key and area every time.
import * as T from '../theory.js';
import * as F from '../fretboard.js';
import { neckSVG } from './neck.js';
import { spellTonic, nn, iv as prettyIv, shuffle, pick, esc } from './core.js';

const IVS = ['1', 'b2', '2', 'b3', '3', '4', '#4', '5', 'b6', '6', 'b7', '7'];
const TENSION = { '1': '1', b2: '♭9', '2': '9', b3: '♭3/♯9', '3': '3', '4': '11', '#4': '♯11', '5': '5', b6: '♭13', '6': '13', b7: '♭7', '7': '7' };
const SHAPES = ['C', 'A', 'G', 'E', 'D'];
const semis = (x) => T.intervalSemis(x) % 12;
const PER_AREA = 8;

export default {
  id: 'intervals',
  title: 'Interval Finder',
  blurb: 'A key and an area: tap every ♭3 (or two intervals at once, or the whole neck) before time runs out.',
  keyed: true,
  options: [
    { id: 'game', label: 'Game', type: 'one', def: 'find', choices: [['find', 'Find them'], ['name', 'Name it (one dot lit)']] },
    { id: 'scope', label: 'Where', type: 'one', def: 'area', choices: [['area', 'One CAGED area'], ['neck', 'Whole neck']] },
    { id: 'howmany', label: 'Find', type: 'one', def: 'all', when: (c) => c.game === 'find', choices: [['all', 'All of them'], ['one', 'Any one']] },
    { id: 'per', label: 'Intervals at a time', type: 'one', def: '1', when: (c) => c.game === 'find', choices: [['1', 'One'], ['2', 'Two']] },
    { id: 'keys', label: 'Keys', type: 'one', def: 'stay', choices: [['stay', 'Stay: one key, area by area'], ['roam', 'Roam: new key each time']] },
    { id: 'roots', label: 'Show the roots', type: 'toggle', def: true },
    { id: 'secs', label: 'Countdown', type: 'one', def: '12', choices: [['0', 'Off'], ['6', '6 s'], ['12', '12 s'], ['20', '20 s'], ['40', '40 s']] },
    { id: 'ivs', label: 'Intervals', type: 'multi', def: IVS.slice(1), choices: IVS.map((x) => [x, prettyIv(x)]) },
    { id: 'names', label: 'Call them', type: 'one', def: 'simple', choices: [['simple', '♭2 ♭3 ♯4 ♭6'], ['tension', '♭9 ♯9 ♯11 ♭13']] },
  ],
  pool(c) {
    const out = [];
    const places = c.scope === 'neck' ? ['neck'] : SHAPES;
    for (const x of c.ivs) for (const w of places) out.push(itemFor(c.game, x, w, c.names));
    return out;
  },
  next(ctx, pool) {
    const c = ctx.cfg, st = ctx.state;
    if (c.keys === 'roam') { const item = ctx.pickItem(pool); return { item, keyPc: ctx.pickKey() }; }
    // stay: one key, PER_AREA questions in each area, the areas in order up the neck, then a new key
    if (st.pc == null || st.k >= PER_AREA * (c.scope === 'neck' ? 1 : 5)) { st.pc = ctx.pickKey(); st.k = 0; st.queue = []; }
    const w = c.scope === 'neck' ? 'neck' : SHAPES[Math.floor(st.k / PER_AREA)];
    if (!st.queue.length) st.queue = shuffle(c.ivs);
    st.k++;
    const x = st.queue.pop();
    return { item: pool.find((it) => it.params.x === x && it.params.w === w) || ctx.pickItem(pool), keyPc: st.pc };
  },
  make(it, pc, ctx) {
    const c = ctx.cfg;
    const { g, x, w } = it.params;
    const tonic = spellTonic(pc, 'major');
    let lo = 0, hi = 15, area = 'the whole neck (frets 0–15)';
    if (w !== 'neck') { const win = F.cagedWindow(tonic, w); lo = win.lo; hi = win.hi; area = `the ${w}-shape area (frets ${lo}–${hi})`; }
    const name = (y) => (c.names === 'tension' ? TENSION[y] : prettyIv(y));
    const cells = [];
    for (let s = 6; s >= 1; s--) for (let f = lo; f <= hi; f++) cells.push({ s, f, iv: ivAt(pc, s, f) });
    const roots = c.roots ? cells.filter((z) => z.iv === '1') : [];
    if (g === 'name') {
      const cands = cells.filter((z) => c.ivs.includes(z.iv) && z.iv === x);
      const target = pick(cands.length ? cands : cells.filter((z) => z.iv !== '1'));
      return { kicker: `Key of ${esc(nn(tonic))}`, title: 'Name the lit note', sub: `${area[0].toUpperCase() + area.slice(1)}. What interval is it from ${esc(nn(tonic))}?`, g, lo, hi, cells, roots, target, name, pc, tonic, secs: Number(c.secs) };
    }
    // two at a time: a second interval from the chosen set, not the same
    const want = [x];
    if (c.per === '2' && c.ivs.length > 1) want.push(pick(c.ivs.filter((y) => y !== x)));
    const targets = cells.filter((z) => want.includes(z.iv));
    const one = c.howmany === 'one';
    return {
      kicker: `Key of ${esc(nn(tonic))}`,
      title: `${one ? 'Find a' : 'Find every'} ${want.map((y) => `<b>${esc(name(y))}</b>`).join(' and ')}`,
      sub: `In ${area}. ${one ? 'Tap one.' : `Tap them all (${targets.length}).`}${roots.length ? ' Roots shown.' : ''}`,
      g, lo, hi, cells, roots: want.includes('1') ? [] : roots, want, targets, one, name, pc, tonic, secs: Number(c.secs) * (w === 'neck' ? 2 : 1), extraIv: want[1],
    };
  },
  mount(q, el, ctx) {
    if (q.g === 'name') return nameIt(q, el, ctx);
    const found = new Set(), bad = new Set();
    let over = false;
    const key = (s, f) => `${s}:${f}`;
    const draw = (end = false) => {
      const dots = [];
      for (const r of q.roots) if (!found.has(key(r.s, r.f))) dots.push({ s: r.s, f: r.f, label: '1', cls: 'root-hint' });
      for (const t of q.targets) {
        const k = key(t.s, t.f);
        if (found.has(k)) dots.push({ s: t.s, f: t.f, label: q.name(t.iv), cls: 'ok' });
        else if (end) dots.push({ s: t.s, f: t.f, label: q.name(t.iv), cls: 'miss' });
      }
      for (const k of bad) { const [s, f] = k.split(':').map(Number); dots.push({ s, f, label: q.name(ivAt(q.pc, s, f)), cls: 'bad' }); }
      el.innerHTML = `<div class="neckwrap">${neckSVG({ lo: q.lo, hi: q.hi, size: q.hi - q.lo > 8 ? 'l' : 'm', tap: !end, dots })}</div>`;
      if (!end) el.querySelectorAll('.cell').forEach((r) => (r.onclick = () => tap(Number(r.dataset.s), Number(r.dataset.f))));
    };
    const tap = (s, f) => {
      if (over) return;
      const k = key(s, f);
      if (found.has(k) || bad.has(k)) return;
      if (q.targets.some((t) => t.s === s && t.f === f)) found.add(k); else bad.add(k);
      if (q.one ? found.size >= 1 : found.size >= q.targets.length) return finish(false);
      draw();
    };
    const finish = (timeUp) => {
      over = true;
      draw(true);
      const done = q.one ? found.size >= 1 : found.size >= q.targets.length;
      const clean = done && !bad.size && !timeUp;
      const extra = q.extraIv ? [{ item: itemFor('find', q.extraIv, q.item.params.w, ctx.cfg.names), clean }] : [];
      ctx.finish({ clean, extra, speed: ctx.speed((q.one ? 1 : q.targets.length) * 1800), auto: clean, delay: 900, why: timeUp ? 'out of time' : !done ? 'revealed' : bad.size ? `${bad.size} wrong tap${bad.size > 1 ? 's' : ''}` : '' });
    };
    draw();
    ctx.countdown(q.secs, () => finish(true));
    ctx.buttons([{ label: 'Reveal', kind: 'ghost', on: () => finish(false) }]);
  },
};

function itemFor(g, x, w, names) {
  const n = (names === 'tension' ? TENSION[x] : prettyIv(x));
  const where = w === 'neck' ? 'whole neck' : `${w} shape`;
  return { id: `if|${g}|${x}|${w}`, mode: 'intervals', group: x, label: g === 'name' ? `Name the ${n} · ${where}` : `Find the ${n} · ${where}`, params: { g, x, w } };
}
function ivAt(pc, s, f) { return IVS[((F.OPEN[s] + f - pc) % 12 + 12) % 12]; }

function nameIt(q, el, ctx) {
  const t = q.target;
  const dots = q.roots.filter((r) => !(r.s === t.s && r.f === t.f)).map((r) => ({ s: r.s, f: r.f, label: '1', cls: 'root-hint' }));
  const draw = (ans = null) => {
    const d = [...dots, { s: t.s, f: t.f, label: ans ? q.name(t.iv) : '?', cls: ans ? (ans === t.iv ? 'ok' : 'bad') : 'ask', ring: !ans }];
    el.innerHTML = `<div class="neckwrap">${neckSVG({ lo: q.lo, hi: q.hi, size: q.hi - q.lo > 8 ? 'l' : 'm', dots: d })}</div>
      <div class="pad c4">${IVS.map((x) => `<button data-x="${x}" class="${ans ? (x === t.iv ? 'right' : x === ans ? 'wrong' : '') : ''}" ${ans ? 'disabled' : ''}>${esc(q.name(x))}</button>`).join('')}</div>`;
    if (!ans) el.querySelectorAll('[data-x]').forEach((b) => (b.onclick = () => answer(b.dataset.x)));
  };
  const answer = (x, why = '') => {
    draw(x || t.iv);
    const ok = x === t.iv;
    ctx.finish({ clean: ok, speed: ctx.speed(2500), auto: ok, delay: 700, why: why || (ok ? '' : `it’s ${q.name(t.iv)}`) });
  };
  draw();
  ctx.countdown(q.secs, () => answer(null, 'out of time'));
  ctx.buttons([{ label: 'Reveal', kind: 'ghost', on: () => answer(null, 'revealed') }]);
}
