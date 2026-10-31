// Template -> card instance: pick params, resolve $refs and {placeholders}, compute difficulty.
import * as T from './theory.js';
import { asRoot, asKey } from './demo.js';

const KEY_POOLS = {
  major: T.MAJOR_KEYS,
  minor: T.MINOR_KEYS,
  any: [...T.MAJOR_KEYS, ...T.MINOR_KEYS],
};
export function poolValues(name, pool) {
  if (name === 'key' && typeof pool === 'string') return (KEY_POOLS[pool] || [pool]).map((k) => ({ v: k, lvl: (T.parseKey(k).diff - 1) * 0.5 }));
  if (name === 'root' && typeof pool === 'string') return (pool === 'any' ? T.ROOTS : [pool]).map((r) => ({ v: r, lvl: (T.rootDiff(r) - 1) * 0.5 }));
  if (!Array.isArray(pool)) return [{ v: pool, lvl: 0 }];
  return pool.map((x) => {
    const isObj = x && typeof x === 'object' && !Array.isArray(x) && 'v' in x;
    const o = isObj ? { lvl: 0, ...x } : { v: x, lvl: 0 };
    const hasLvl = isObj && 'lvl' in x;
    if (name === 'key' && typeof o.v === 'string' && !hasLvl) o.lvl = (safeKey(o.v).diff - 1) * 0.5;
    if (name === 'root' && typeof o.v === 'string' && !hasLvl) o.lvl = (T.rootDiff(safeNote(o.v)) - 1) * 0.5;
    return o;
  });
}
const safeKey = (k) => { try { return T.parseKey(k); } catch (e) { return { diff: 3 }; } };
const safeNote = (n) => { try { return T.parseNote(n); } catch (e) { return T.parseNote('C'); } };

// chooser(name, values, tpl) -> one of values ; default random
export function instantiate(tpl, chooser = (n, vals) => vals[Math.floor(Math.random() * vals.length)], fixed = {}) {
  const params = {};
  const chosen = {};
  let lvl = tpl.level || 1;
  for (const [name, pool] of Object.entries(tpl.params || {})) {
    const vals = poolValues(name, pool);
    const pick = fixed[name] !== undefined ? (vals.find((v) => same(v.v, fixed[name])) || { v: fixed[name], lvl: 0 }) : chooser(name, vals, tpl);
    params[name] = pick.v;
    chosen[name] = pick;
    lvl += pick.lvl || 0;
  }
  const ctx = buildCtx(tpl, params, chosen);
  const resolve = (x) => resolveRefs(x, params, ctx);
  const card = {
    tpl,
    id: tpl.id,
    instanceKey: tpl.id + '|' + Object.entries(params).map(([k, v]) => k + '=' + JSON.stringify(v)).join('&'),
    params,
    chosen,
    ctx,
    level: lvl,
    visual: resolve(tpl.visual),
    demo: resolve(tpl.demo || tpl.visual),
    quiz: resolve(tpl.quiz),
    metronome: resolve(tpl.metronome),
    drone: resolve(tpl.drone),
    // the metronome can always reach at least 200 bpm, whatever the card's suggested range
    tempo: tpl.tempo ? { ...tpl.tempo, max: Math.max(tpl.tempo.max ?? 200, 200) } : null,
  };
  card.text = (s) => fill(s, card);
  // placeholders inside diagram captions
  const caps = (x) => { if (Array.isArray(x)) x.forEach(caps); else if (x && typeof x === 'object') { for (const k of ['title', 'label', 'explain']) if (typeof x[k] === 'string') x[k] = fill(x[k], card); Object.values(x).forEach((v) => typeof v === 'object' && caps(v)); } };
  caps(card.visual); caps(card.demo);
  return card;
}
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

function buildCtx(tpl, params, chosen) {
  const ctx = {};
  if (params.key) { ctx.key = asKey(params.key); ctx.root = ctx.key.tonic; }
  if (params.root) { ctx.root = asRoot(params.root); if (!ctx.key) ctx.key = T.parseKey(T.noteName(ctx.root)); }
  if (!ctx.root) {
    const v = tpl.visual || {};
    const r = v.root ?? v.key;
    if (r && !String(r).startsWith('$')) { try { ctx.root = asRoot(r); ctx.key = asKey(typeof r === 'string' ? r : T.noteName(ctx.root)); } catch (e) { /* */ } }
  }
  if (!ctx.root) { ctx.root = T.parseNote('C'); ctx.key = T.parseKey('C'); }
  ctx.quality = params.quality ?? (tpl.visual && !String(tpl.visual.quality || '').startsWith('$') ? tpl.visual.quality : undefined);
  ctx.scale = params.scale ?? (tpl.visual && tpl.visual.scale && !String(tpl.visual.scale).startsWith('$') ? tpl.visual.scale : undefined);
  ctx.labels = Object.fromEntries(Object.entries(chosen).map(([k, c]) => [k, c.label]));
  return ctx;
}

function resolveRefs(x, params, ctx) {
  if (x == null) return x;
  if (typeof x === 'string') {
    if (x.startsWith('$')) {
      const name = x.slice(1);
      if (name in params) return params[name];
      if (name === 'root') return T.noteName(ctx.root);
      if (name === 'key') return ctx.key.short;
    }
    return x;
  }
  if (Array.isArray(x)) return x.map((y) => resolveRefs(y, params, ctx));
  if (typeof x === 'object') {
    const o = {};
    for (const [k, v] of Object.entries(x)) o[k] = resolveRefs(v, params, ctx);
    return o;
  }
  return x;
}

// ---------- placeholders ----------
export function displayValue(name, v, label) {
  if (label) return label;
  if (Array.isArray(v)) return v.join('-');
  if (v && typeof v === 'object') return Object.entries(v).map(([k, x]) => `${k} ${x}`).join(', ');
  if (name === 'scale' && T.SCALES[v]) return T.SCALES[v].name;
  if (name === 'quality' && T.CHORDS[v]) return T.CHORDS[v].sym || 'major';
  if (name === 'key') { try { return T.parseKey(v).name; } catch (e) { return v; } }
  return T.pretty(String(v));
}
export function fill(s, card) {
  if (s == null) return '';
  const { ctx, params, chosen } = card;
  return String(s).replace(/\{([a-zA-Z]+)(?::([^}]+))?\}/g, (m, name, arg) => {
    try {
      switch (name) {
        case 'key': return ctx.key.name;
        case 'root': return T.noteName(ctx.root, true);
        case 'chord': return T.chordSymbol(ctx.root, ctx.quality || (ctx.key.minor ? 'min' : 'maj'));
        case 'scale': return `${T.noteName(ctx.root, true)} ${T.getScale(ctx.scale || (ctx.key.minor ? 'aeolian' : 'major')).name}`;
        case 'scaleNotes': return T.scaleNotes(ctx.root, ctx.scale || (ctx.key.minor ? 'aeolian' : 'major')).map((n) => T.noteName(n, true)).join(' ');
        case 'chordTones': return T.chordNotes(ctx.root, ctx.quality || (ctx.key.minor ? 'min' : 'maj')).map((n) => T.noteName(n, true)).join(' ');
        case 'stringSet': return params.stringSet ? [...params.stringSet].sort((a, b) => b - a).join('-') : m;
        case 'tempo': return card.tempoNow ? `${card.tempoNow} bpm` : (card.tempo ? `${card.tempo.start} bpm` : '');
        case 'rn': { const c = T.parseChordToken(arg, ctx.key.tonic); return T.chordSymbol(c.root, c.quality) + (c.bass ? '/' + T.noteName(c.bass, true) : ''); }
        case 'p': return displayValue(arg, params[arg], chosen[arg] && chosen[arg].label);
        case 'parent': { const p = T.parentOf(ctx.root, arg); return p ? `${T.noteName(p.root, true)} ${T.getScale(p.scaleId).name.toLowerCase()}` : m; }
        default:
          if (name in params) return displayValue(name, params[name], chosen[name] && chosen[name].label);
          return m;
      }
    } catch (e) { return m; }
  });
}
