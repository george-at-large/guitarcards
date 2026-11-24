// Insights: what the check-ins add up to. Stat tiles for the headline numbers, the grid with every check-in on it,
// pleasantness and energy day by day, what tends to go with feeling better or worse, what you lean toward when
// you feel bad versus good, and the feelings, urges and thinking traps that come up most.
// Colour by job: pleasant / unpleasant is a diverging pair (blue ↔ red); pleasantness vs energy are two
// categorical series (blue, orange); counts are one hue.
import * as S from './store.js';
import * as P from './schedule.js';
import { h, svg, clock, dayName } from './ui.js';
import { DISPOSITIONS, TRAP } from './data.js';

const DAY = 864e5;
const mean = (xs) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null);
const median = (xs) => { if (!xs.length) return null; const s = xs.slice().sort((a, b) => a - b); return s[Math.floor(s.length / 2)]; };
const pct = (v) => `${v > 0 ? '+' : ''}${Math.round(v * 100)}`;

export function renderInsights(root, range = 30) {
  const db = S.get(), now = Date.now(), since = now - range * DAY;
  const entries = db.entries.filter((e) => e.t >= since && e.v != null);
  const records = db.records.filter((r) => r.t >= since);
  const tip = h('div.readout', { 'aria-live': 'polite' }, 'Tap a dot or a day for details.');

  if (entries.length < 3) {
    root.append(h('div.empty', {}, h('h3', {}, 'Patterns show up after a few check-ins'),
      h('p', {}, `You have ${entries.length} in the last ${range} days. Answer the next few pings and come back.`)));
    if (!entries.length) return;
  }

  // ---------- tiles ----------
  const pings = P.all().filter((p) => p.t >= since && p.t <= now);
  const answeredPings = pings.filter(P.answered).length;
  const lat = entries.filter((e) => e.promptAt).map((e) => (e.t - e.promptAt) / 60000);
  const thoughts = records.filter((r) => r.kind === 'thought');
  const drops = thoughts.filter((r) => r.intensity != null && r.intensityAfter != null).map((r) => r.intensity - r.intensityAfter);
  const acts = records.filter((r) => r.kind === 'activity' && r.done === true && r.before != null && r.after != null);
  root.append(h('div.tiles', {},
    tile(entries.length, 'check-ins', `last ${range} days`),
    pings.length ? tile(`${Math.round((answeredPings / pings.length) * 100)}%`, 'pings answered', lat.length ? `median ${Math.round(median(lat))} min later` : '') : null,
    tile(thoughts.length, 'thought records', drops.length ? `feeling ${mean(drops) >= 0 ? 'down' : 'up'} ${Math.abs(Math.round(mean(drops)))} pts on average` : ''),
    acts.length ? tile(`${mean(acts.map((a) => a.after - a.before)) >= 0 ? '+' : ''}${Math.round(mean(acts.map((a) => a.after - a.before)))}`, 'mood after a small step', `${acts.length} done`) : null));

  // ---------- the grid ----------
  root.append(section('Where you’ve been', 'Each dot is a check-in. Darker is more recent; ringed dots are today.', scatter(entries, tip, now), tip));

  // ---------- day by day ----------
  const days = [];
  for (let i = Math.min(range, 14) - 1; i >= 0; i--) {
    const d0 = new Date(now - i * DAY); d0.setHours(0, 0, 0, 0);
    const es = entries.filter((e) => e.t >= d0.getTime() && e.t < d0.getTime() + DAY);
    days.push({ t: d0.getTime(), v: mean(es.map((e) => e.v)), a: mean(es.map((e) => e.a)), n: es.length });
  }
  if (days.filter((d) => d.n).length >= 2) {
    const tip2 = h('div.readout', {}, 'Tap a day.');
    root.append(section('Day by day', 'Average of each day’s check-ins, last two weeks. Middle line is neutral.', lines(days, tip2), tip2));
  }

  // ---------- what goes with what ----------
  const groups = [];
  const by = (label, keyFn) => {
    const m = new Map();
    for (const e of entries) for (const k of keyFn(e)) { if (!m.has(k)) m.set(k, []); m.get(k).push(e.v); }
    const rows = [...m].filter(([, vs]) => vs.length >= 2).map(([k, vs]) => [k, mean(vs), vs.length]).sort((a, b) => b[1] - a[1]);
    if (rows.length >= 2) groups.push([label, rows]);
  };
  const part = (t) => { const hr = new Date(t).getHours(); return [hr < 5 ? 'night' : hr < 12 ? 'morning' : hr < 17 ? 'afternoon' : hr < 21 ? 'evening' : 'night']; };
  by('Doing', (e) => e.doing || []);
  by('With', (e) => e.with || []);
  by('Time of day', (e) => part(e.t));
  if (groups.length) {
    root.append(section('What goes with feeling better or worse', 'Average pleasantness when you were… (shown once something comes up at least twice). Patterns, not causes.',
      h('div', {}, groups.map(([label, rows]) => h('div.dgroup', {}, h('h4', {}, label), diverging(rows))))));
  }

  // ---------- inclinations by mood ----------
  const withDisp = entries.filter((e) => e.disp && Object.values(e.disp).some((x) => x != null));
  if (withDisp.length >= 3) {
    const lo = withDisp.filter((e) => e.v < 0), hi = withDisp.filter((e) => e.v >= 0);
    root.append(section('What you lean toward', 'Average position on each scale when you felt unpleasant versus pleasant.',
      h('div', {},
        h('div.legend', {}, h('span', {}, h('i.k.neg'), `unpleasant (${lo.length})`), h('span', {}, h('i.k.pos'), `pleasant (${hi.length})`)),
        DISPOSITIONS.map(([k, l, r]) => {
          const a = mean(lo.map((e) => e.disp[k]).filter((x) => x != null)), b = mean(hi.map((e) => e.disp[k]).filter((x) => x != null));
          if (a == null && b == null) return null;
          return h('div.lean', {}, h('div.track', {}, a != null ? h('i.neg', { style: `left:${a}%`, title: `unpleasant: ${Math.round(a)}` }) : null, b != null ? h('i.pos', { style: `left:${b}%`, title: `pleasant: ${Math.round(b)}` }) : null),
            h('div.ends', {}, h('span', {}, l), h('span', {}, r)));
        }))));
  }

  // ---------- counts ----------
  const count = (arr) => { const m = new Map(); for (const x of arr) m.set(x, (m.get(x) || 0) + 1); return [...m].sort((a, b) => b[1] - a[1]).slice(0, 8); };
  const lists = [
    ['Feelings named most', count(entries.flatMap((e) => e.words || []))],
    ['Urges', count(entries.flatMap((e) => e.urges || []).filter((u) => u !== 'nothing in particular'))],
    ['Thinking traps spotted', count(thoughts.flatMap((r) => r.traps || []).map((t) => TRAP[t]?.name || t))],
  ].filter(([, rows]) => rows.length);
  if (lists.length) root.append(h('div.counts', {}, lists.map(([title, rows]) => h('section.card', {}, h('h3', {}, title), bars(rows)))));
}

const tile = (big, label, sub) => h('div.tile', {}, h('b', {}, big), h('span', {}, label), sub ? h('small', {}, sub) : null);
const section = (title, sub, ...kids) => h('section.card', {}, h('h3', {}, title), h('p.sub', {}, sub), ...kids);

function scatter(entries, tip, now) {
  const W = 300, pad = 6, X = (v) => pad + ((v + 1) / 2) * (W - 2 * pad), Y = (a) => pad + ((1 - a) / 2) * (W - 2 * pad);
  const oldest = Math.min(...entries.map((e) => e.t));
  const today0 = new Date(now).setHours(0, 0, 0, 0);
  const g = svg('svg', { viewBox: `0 0 ${W} ${W}`, class: 'scatter', role: 'img', 'aria-label': `${entries.length} check-ins on the mood grid` },
    svg('line', { x1: W / 2, x2: W / 2, y1: pad, y2: W - pad, class: 'mid' }), svg('line', { y1: W / 2, y2: W / 2, x1: pad, x2: W - pad, class: 'mid' }),
    svg('text', { x: W - pad - 2, y: W / 2 - 5, 'text-anchor': 'end', class: 'ax' }, 'pleasant'), svg('text', { x: pad + 2, y: W / 2 - 5, class: 'ax' }, 'unpleasant'),
    svg('text', { x: W / 2 + 5, y: pad + 11, class: 'ax' }, 'high energy'), svg('text', { x: W / 2 + 5, y: W - pad - 4, class: 'ax' }, 'low energy'));
  const sorted = entries.slice().sort((a, b) => a.t - b.t);
  for (const e of sorted) {
    const age = now - oldest > 0 ? (e.t - oldest) / (now - oldest) : 1;
    const isToday = e.t >= today0;
    const show = () => { g.querySelectorAll('.dot.sel').forEach((d) => d.classList.remove('sel')); dot.classList.add('sel'); tip.textContent = `${dayName(e.t)} ${clock(e.t)} · ${(e.words || []).join(', ') || 'no words'}${e.doing?.length ? ' · ' + e.doing.join(', ') : ''}`; };
    const dot = svg('g', { class: 'dot' + (isToday ? ' today' : ''), tabindex: 0 },
      svg('circle', { cx: X(e.v), cy: Y(e.a), r: 14, class: 'hit' }),
      svg('circle', { cx: X(e.v), cy: Y(e.a), r: isToday ? 6 : 5, class: 'mark', 'fill-opacity': (0.25 + 0.75 * age).toFixed(2) }));
    dot.addEventListener('pointerenter', show); dot.addEventListener('click', show); dot.addEventListener('focus', show);
    g.append(dot);
  }
  return h('div.scatterwrap', {}, g);
}

function lines(days, tip) {
  const W = 320, H = 150, l = 30, r = 12, t = 10, b = 22;
  const X = (i) => l + (i / (days.length - 1)) * (W - l - r), Y = (v) => t + ((1 - v) / 2) * (H - t - b);
  const path = (key) => { let d = '', pen = false; days.forEach((dd, i) => { if (dd[key] == null) { pen = false; return; } d += `${pen ? 'L' : 'M'}${X(i).toFixed(1)},${Y(dd[key]).toFixed(1)}`; pen = true; }); return d; };
  const g = svg('svg', { viewBox: `0 0 ${W} ${H}`, class: 'lines', role: 'img', 'aria-label': 'Daily pleasantness and energy' },
    [1, 0, -1].map((v) => svg('line', { x1: l, x2: W - r, y1: Y(v), y2: Y(v), class: v === 0 ? 'mid' : 'grid' })),
    svg('text', { x: l - 5, y: Y(1) + 4, 'text-anchor': 'end', class: 'ax' }, '+'), svg('text', { x: l - 5, y: Y(-1) + 4, 'text-anchor': 'end', class: 'ax' }, '−'),
    days.map((d, i) => (i % 2 === (days.length - 1) % 2 ? svg('text', { x: X(i), y: H - 6, 'text-anchor': 'middle', class: 'ax' }, new Date(d.t).toLocaleDateString([], { weekday: 'narrow' })) : null)),
    svg('path', { d: path('v'), class: 's1' }), svg('path', { d: path('a'), class: 's2' }),
    days.map((d, i) => [d.v != null ? svg('circle', { cx: X(i), cy: Y(d.v), r: 3, class: 'p1' }) : null, d.a != null ? svg('circle', { cx: X(i), cy: Y(d.a), r: 3, class: 'p2' }) : null]));
  const cross = svg('line', { y1: t, y2: H - b, class: 'cross', style: 'display:none' });
  g.append(cross);
  days.forEach((d, i) => {
    const hit = svg('rect', { x: X(i) - (W - l - r) / (days.length - 1) / 2, y: 0, width: (W - l - r) / (days.length - 1), height: H, class: 'hitcol' });
    const show = () => {
      cross.setAttribute('x1', X(i)); cross.setAttribute('x2', X(i)); cross.style.display = '';
      tip.replaceChildren(h('b', {}, dayName(d.t)), d.n ? ` · ${d.n} check-in${d.n > 1 ? 's' : ''} · ` : ' · no check-ins',
        d.n ? h('span', {}, h('i.k.s1'), `pleasantness ${pct(d.v)}`, '  ', h('i.k.s2'), `energy ${pct(d.a)}`) : '');
    };
    hit.addEventListener('pointerenter', show); hit.addEventListener('click', show);
    g.append(hit);
  });
  return h('div', {}, h('div.legend', {}, h('span', {}, h('i.k.s1'), 'pleasantness'), h('span', {}, h('i.k.s2'), 'energy')), g);
}

function diverging(rows) {
  const max = Math.max(0.25, ...rows.map((r) => Math.abs(r[1])));
  return h('div.div', {}, rows.map(([k, v, n]) => h('div.drow', { title: `${k}: ${pct(v)} average pleasantness over ${n} check-ins` },
    h('span.dk', {}, k, h('small', {}, ` ${n}`)),
    h('span.dbar', {}, h('i' + (v < 0 ? '.neg' : '.pos'), { style: v < 0 ? `right:50%;width:${(Math.abs(v) / max) * 50}%` : `left:50%;width:${(v / max) * 50}%` })),
    h('span.dv', {}, pct(v)))));
}

function bars(rows) {
  const max = rows[0][1];
  return h('div.bars', {}, rows.map(([k, n]) => h('div.brow', {}, h('span.bk', {}, k), h('span.bb', {}, h('i', { style: `width:${(n / max) * 100}%` })), h('span.bn', {}, n))));
}
