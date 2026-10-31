// Adaptive selection + learner model (persisted in localStorage).
import { essentialWeight } from './workouts.js';
const KEY = 'guitarcards.v1';
const DAY = 86400000;

export const CATEGORY_INFO = {
  play: ['rhythm', 'picking', 'scales', 'pentatonic', 'arpeggios', 'voicings', 'progressions', 'improv', 'fretboard', 'styles', 'tedgreene'],
  ear: ['ear-intervals', 'ear-chords', 'ear-progressions', 'ear-melody', 'ear-functional'],
  theory: ['theory'],
};
export const CAT_LABEL = {
  tedgreene: 'Ted Greene progressions', rhythm: 'Rhythm & time', picking: 'Picking & fingerstyle', scales: 'Scales & modes', pentatonic: 'Pentatonics', arpeggios: 'Arpeggios',
  voicings: 'Voicings & chord scales', progressions: 'Progressions & chord melody', improv: 'Improvisation', fretboard: 'Fretboard knowledge', styles: 'Styles (funk, bossa, flamenco…)',
  'ear-intervals': 'Intervals', 'ear-chords': 'Chord qualities', 'ear-progressions': 'Progressions', 'ear-melody': 'Melody & audiation', 'ear-functional': 'Scale degrees & modes',
  theory: 'Theory & heuristics',
};
export const CAT_SHORT = { tedgreene: 'Ted Greene', rhythm: 'Rhythm', picking: 'Picking', scales: 'Scales', pentatonic: 'Pentatonic', arpeggios: 'Arpeggios', voicings: 'Voicings', progressions: 'Progressions', improv: 'Improv', fretboard: 'Fretboard', styles: 'Styles', 'ear-intervals': 'Intervals', 'ear-chords': 'Chords', 'ear-progressions': 'Progressions', 'ear-melody': 'Melody', 'ear-functional': 'Degrees', theory: 'Theory' };
// starting levels from the user's self-description
const START_LEVEL = {
  tedgreene: 3,
  rhythm: 2.5, picking: 3, scales: 4.5, pentatonic: 4.5, arpeggios: 3.5, voicings: 3, progressions: 3.5, improv: 3.5, fretboard: 4.5, styles: 2,
  'ear-intervals': 2.5, 'ear-chords': 2, 'ear-progressions': 2, 'ear-melody': 2, 'ear-functional': 2, theory: 4,
};

const DEFAULT = () => ({
  settings: {
    modes: ['play'], cats: {}, length: 'mix', session: { type: 'cards', n: 20 },
    metronome: true, drone: true, labels: 'interval', earSound: 'keys',
  },
  tpl: {}, cat: {}, bias: { tags: {}, tpl: {} }, focus: '', history: [], sessions: 0,
});

let S = null;
export function state() {
  if (S) return S;
  try { S = { ...DEFAULT(), ...JSON.parse(localStorage.getItem(KEY) || '{}') }; } catch (e) { S = DEFAULT(); }
  S.settings = { ...DEFAULT().settings, ...(S.settings || {}) };
  return S;
}
export function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* */ } }
export function resetAll() { S = DEFAULT(); save(); }
export function exportState() { return JSON.stringify(state()); }
export function importState(json) { S = { ...DEFAULT(), ...JSON.parse(json) }; save(); }

export const catLevel = (c) => (state().cat[c]?.level ?? START_LEVEL[c] ?? 3);
const tplState = (id) => (state().tpl[id] = state().tpl[id] || { n: 0, last: 0, stab: 0, lvlAdj: 0, tempo: null, ratings: [], good: 0 });

// ---------- filtering ----------
export function eligible(lib, settings = state().settings) {
  const modes = new Set(settings.modes);
  return lib.templates.filter((t) => {
    if (!modes.has(t.mode)) return false;
    const cats = settings.cats[t.mode];
    if (cats && cats.length && !cats.includes(t.category)) return false;
    // the 2,387 Ted Greene archive sheets only join the deck when Ted Greene is picked explicitly
    if (t.tags && t.tags.includes('tg-archive') && !(cats && cats.includes('tedgreene'))) return false;
    if (settings.length !== 'mix' && t.length && t.length !== settings.length) return false;
    if ((state().bias.tpl[t.id] || 0) <= -3) return false;
    return true;
  });
}

function focusTokens(f) { return String(f || '').toLowerCase().split(/[,;]+/).map((s) => s.trim()).filter(Boolean); }
function matchesFocus(t, toks) {
  if (!toks.length) return false;
  const hay = (t.title + ' ' + (t.tags || []).join(' ') + ' ' + t.category + ' ' + t.id).toLowerCase().replace(/-/g, ' ');
  return toks.some((tok) => tok.split(/\s+/).every((w) => hay.includes(w.replace(/-/g, ' '))));
}

// ---------- selection ----------
export function pickTemplate(lib, session) {
  const st = state();
  const cands = session.filter ? lib.templates.filter(session.filter) : eligible(lib);
  if (!cands.length) return null;
  const now = Date.now();
  const toks = focusTokens(st.focus);
  const last = session.cards.slice(-2).map((c) => c.tpl.category);
  const scored = cands.map((t) => {
    const ts = st.tpl[t.id];
    const target = catLevel(t.category);
    const d = t.level - target;
    let s = Math.exp(-(d * d) / (2 * (d > 0 ? 1.3 : 2.2) ** 2)); // easier cards decay slower than harder ones
    if (d > 3) s *= 0.05;
    if (!ts || !ts.n) s *= 1.15; // coverage
    else {
      const overdue = (now - ts.last) / (Math.max(ts.stab, 0.02) * DAY);
      s *= Math.min(2.2, 0.25 + overdue);
    }
    if (session.seen.has(t.id)) s *= 0.03;
    if (last.length && last.every((c) => c === t.category)) s *= 0.35;
    const tagB = (t.tags || []).reduce((a, g) => a + (st.bias.tags[g] || 0), 0) + (st.bias.tpl[t.id] || 0) * 1.5;
    s *= Math.pow(1.5, Math.max(-4, Math.min(4, tagB)));
    if (toks.length) s *= matchesFocus(t, toks) ? 6 : 0.25;
    s *= essentialWeight(t);
    // the Ted Greene book is big: in a mixed deck it gets a fair share, not a third of every session
    if (t.category === 'tedgreene' && !session.filter && !((st.settings.cats[t.mode] || []).includes('tedgreene'))) s *= 0.2;
    return { t, s: s * (0.6 + Math.random() * 0.8) };
  });
  const total = scored.reduce((a, x) => a + x.s, 0);
  let r = Math.random() * total;
  for (const x of scored) { r -= x.s; if (r <= 0) return x.t; }
  return scored[scored.length - 1].t;
}

// adaptive chooser for params: aims extra difficulty at (category level - template level) + per-template adjustment
export function paramChooser(tpl) {
  const ts = tplState(tpl.id);
  const desired = Math.max(0, Math.min(4, (catLevel(tpl.category) - tpl.level) * 0.6 + ts.lvlAdj));
  const vals0 = ts.vals || {};
  return (name, vals) => {
    let w = vals.map((v) => Math.exp(-(((v.lvl || 0) - desired) ** 2) / 1.2) + 0.05);
    // breadth before depth: until the easier values of this param are done (rated good), keep harder ones rare
    if (name !== 'key' && name !== 'root' && vals.length > 1) {
      const covered = (v) => (vals0[name + '=' + JSON.stringify(v.v)] || 0) > 0;
      const open = vals.filter((v) => !covered(v));
      if (open.length) {
        const floor = Math.min(...open.map((v) => v.lvl || 0));
        w = w.map((x, i) => {
          const v = vals[i];
          if ((v.lvl || 0) > floor + 0.5) return x * 0.08;
          return covered(v) ? x * 0.5 : x * 2;
        });
      }
    }
    const tot = w.reduce((a, b) => a + b, 0);
    let r = Math.random() * tot;
    for (let i = 0; i < vals.length; i++) { r -= w[i]; if (r <= 0) return vals[i]; }
    return vals[vals.length - 1];
  };
}
// harder/easier variant chooser for follow-ups: change one `vary` param toward harder/easier values
export function variantChooser(card, dir) {
  const tpl = card.tpl;
  const vary = (tpl.vary || []).filter((v) => v !== 'tempo' && tpl.params && tpl.params[v]);
  const change = vary.length ? vary[Math.floor(Math.random() * vary.length)] : null;
  return (name, vals) => {
    const cur = card.chosen[name];
    if (name !== change) return vals.find((v) => JSON.stringify(v.v) === JSON.stringify(cur && cur.v)) || vals[0];
    const others = vals.filter((v) => JSON.stringify(v.v) !== JSON.stringify(cur && cur.v));
    if (!others.length) return cur;
    const curL = (cur && cur.lvl) || 0;
    const pref = others.filter((v) => (dir > 0 ? (v.lvl || 0) >= curL : (v.lvl || 0) <= curL));
    const pool = pref.length ? pref : others;
    return pool[Math.floor(Math.random() * pool.length)];
  };
}

export function startTempo(card) {
  if (!card.tempo) return null;
  const ts = tplState(card.id);
  const t = card.tempo;
  return Math.max(t.min ?? 30, Math.min(t.max ?? 240, ts.tempo ?? t.start ?? 80));
}

// ---------- learning update ----------
// rating: 1 too hard · 2 hard · 3 good · 4 easy ; help: 0..4 layers opened ; objective: {correct, ms}
export function record(card, { rating, help = 0, objective = null, tempo = null, ms = 0 }) {
  const st = state();
  const ts = tplState(card.id);
  let eff = rating;
  if (objective) eff = objective.correct ? (objective.ms < 6000 ? 3.6 : 3) : 1.4;
  if (help >= 3) eff -= 0.6; else if (help >= 1) eff -= 0.25;
  eff = Math.max(1, Math.min(4, eff));
  const cat = (st.cat[card.tpl.category] = st.cat[card.tpl.category] || { level: catLevel(card.tpl.category), n: 0 });
  // category level moves toward the difficulty actually handled
  const handled = card.level;
  const delta = (eff - 2.7) * 0.22 * (handled >= cat.level - 1 ? 1 : 0.4);
  cat.level = Math.max(1, Math.min(10, cat.level + delta));
  cat.n++;
  ts.n++;
  ts.last = Date.now();
  ts.ratings = [...ts.ratings.slice(-9), Math.round(eff * 10) / 10];
  if (eff >= 3) {
    ts.stab = ts.stab ? ts.stab * (eff >= 3.5 ? 3 : 2) : (eff >= 3.5 ? 3 : 1); ts.good++;
    ts.vals = ts.vals || {};
    for (const [name, c] of Object.entries(card.chosen || {})) { const k = name + '=' + JSON.stringify(c.v); ts.vals[k] = (ts.vals[k] || 0) + 1; }
  }
  else ts.stab = eff < 2 ? 0.01 : 0.3;
  ts.lvlAdj = Math.max(-2, Math.min(3, ts.lvlAdj + (eff >= 3.5 ? 0.5 : eff < 2 ? -0.6 : eff < 2.6 ? -0.2 : 0.1)));
  if (card.tempo && tempo) {
    const step = card.tempo.step || 5;
    let nt = tempo + (eff >= 3.5 ? 2 * step : eff >= 3 ? step : eff < 2 ? -2 * step : 0);
    ts.tempo = Math.max(card.tempo.min ?? 30, Math.min(card.tempo.max ?? 240, nt));
  }
  ts.mastered = ts.good >= 2 && eff >= 3 && (!card.tempo || !card.tempo.max || (ts.tempo ?? 0) >= (card.tempo.start + card.tempo.max) / 2 || ts.good >= 4);
  st.history = [...st.history.slice(-499), { id: card.id, k: card.instanceKey, t: Date.now(), r: Math.round(eff * 10) / 10, help, tempo }];
  save();
  return eff;
}

// "more like this" / "less like this"
export function nudge(card, dir) {
  const st = state();
  st.bias.tpl[card.id] = Math.max(-3, Math.min(3, (st.bias.tpl[card.id] || 0) + dir));
  for (const g of card.tpl.tags || []) st.bias.tags[g] = Math.max(-3, Math.min(3, (st.bias.tags[g] || 0) + dir * 0.5));
  save();
}

// ---------- progress ----------
export function progress(lib) {
  const st = state();
  const byCat = {};
  let seen = 0, mastered = 0;
  for (const t of lib.templates) {
    if (t.tags && t.tags.includes('tg-archive')) continue; // archive sheets are tracked in the Ted Greene section
    const c = (byCat[t.category] = byCat[t.category] || { total: 0, seen: 0, mastered: 0, mode: t.mode });
    c.total++;
    const ts = st.tpl[t.id];
    if (ts && ts.n) { c.seen++; seen++; }
    if (ts && ts.mastered) { c.mastered++; mastered++; }
  }
  return { total: lib.templates.length, seen, mastered, byCat };
}
