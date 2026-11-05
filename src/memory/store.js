// Memory pack learner state: spaced repetition (FSRS-style stability), card states, unit unlocks, confusions.
import { UNITS } from './cards.js';

const KEY = 'guitarcards-memory';
const DAY = 86400000;
let S = null;
export function state() {
  if (S) return S;
  try { S = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { S = null; }
  if (!S || S.v !== 1) S = { v: 1, cards: {}, units: {}, conf: {}, contrasts: [], days: {}, settings: { unlockAll: false } };
  return S;
}
export function save() { try { localStorage.setItem(KEY, JSON.stringify(state())); } catch (e) { /* private mode */ } }
export function reset() { S = null; try { localStorage.removeItem(KEY); } catch (e) { /* */ } }
export const today = () => new Date().toISOString().slice(0, 10);

// states: new (no record) → learning → review → fluent → mature
export const REVIEWED = new Set(['review', 'fluent', 'mature']);
export const cardState = (id) => state().cards[id]?.st || 'new';
export const isDue = (id, now = Date.now()) => { const c = state().cards[id]; return !!c && c.due <= now; };

// grade: 1 Again, 2 Hard, 3 Good, 4 Easy. unaided = no hints and not in the Derive stage.
export function schedule(card, grade, { ms = null, unaided = true, target = 2000 } = {}) {
  const st = state();
  const c = st.cards[card.id] || { st: 'learning', s: 0, d: 5, reps: 0, lapses: 0, times: [], seen: Date.now() };
  c.reps++;
  c.last = Date.now();
  if (grade === 1) {
    c.lapses++;
    c.s = c.s ? Math.max(0.007, c.s * 0.3) : 0.003; // ~5 minutes, then back in the session
    c.d = Math.min(10, c.d + 1);
    if (c.st !== 'learning') c.st = 'learning';
    c.times = [...(c.times || []), null].slice(-3);
  } else {
    const ease = 1 + (11 - c.d) / 8;
    c.s = c.s < 0.5 ? { 2: 0.5, 3: 1, 4: 3 }[grade] : c.s * { 2: 1.2, 3: 1.4 * ease, 4: 1.8 * ease }[grade];
    c.d = Math.max(1, Math.min(10, c.d + { 2: 0.4, 3: -0.2, 4: -0.6 }[grade]));
    c.times = [...(c.times || []), ms].slice(-3);
    if (unaided && c.st === 'learning') c.st = 'review';
    const t = c.times;
    if (REVIEWED.has(c.st) && t.length === 3 && t.every((x) => x != null) && [...t].sort((a, b) => a - b)[1] <= target) c.st = 'fluent';
    if (REVIEWED.has(c.st) && c.s > 30) c.st = 'mature';
  }
  c.due = Date.now() + c.s * DAY;
  st.cards[card.id] = c;
  bumpRelease(card.unit);
  save();
  return c;
}

// ---------- units ----------
export const unitDeck = (deck, uid) => deck.filter((c) => c.unit === uid);
export const release = (uid) => state().units[uid]?.release ?? 0;
// every key is in play from the start (no C-first rings)
export const released = (deck, uid) => unitDeck(deck, uid);
// a fact is a card id without its key, e.g. A5.name.maj.ii.Bb → A5.name.maj.ii
export const factOf = (c) => c.id.replace(/\.[A-G](b|#)?$/, '');
export function pctFacts(cards) {
  const facts = new Map();
  for (const c of cards) { const f = factOf(c); facts.set(f, facts.get(f) || REVIEWED.has(cardState(c.id))); }
  return facts.size ? [...facts.values()].filter(Boolean).length / facts.size : 0;
}
export function pctReviewed(cards) { return cards.length ? cards.filter((c) => REVIEWED.has(cardState(c.id))).length / cards.length : 0; }
let DECK = [];
export function setDeck(d) { DECK = d; }
// keys are released in circle order: when 80% of what's released is in Review, the next key ring opens
function bumpRelease(uid) {
  const u = state().units[uid]; if (!u) return;
  while ((u.release ?? 0) < 6 && pctReviewed(released(DECK, uid)) >= 0.8) u.release = (u.release ?? 0) + 1;
}
export function unlocked(uid) {
  const i = UNITS.findIndex((u) => u.id === uid);
  if (i <= 0 || state().settings.unlockAll || state().units[uid]?.forced) return true;
  if (UNITS[i].reference) return true;
  // a unit may name its own prerequisite; reference-only units don't count
  const prev = UNITS[i].after || UNITS.slice(0, i).reverse().find((u) => !u.reference)?.id;
  if (!prev) return true;
  // the previous unit is learned when 80% of its facts are in Review in at least one key
  return pctFacts(unitDeck(DECK, prev)) >= 0.8;
}
export function startUnit(uid) {
  const st = state();
  if (!st.units[uid]) st.units[uid] = { started: today(), release: 0 };
  const d = (st.days[today()] = st.days[today()] || {});
  if (!d.newUnit) d.newUnit = uid;
  save();
}
export const newUnitToday = () => state().days[today()]?.newUnit || null;
export function nextNewUnit() { return UNITS.find((u) => !u.reference && !state().units[u.id] && unlocked(u.id)) || null; }
export function unitStatus(uid) {
  if (UNITS.find((u) => u.id === uid)?.reference) return 'reference';
  if (!unlocked(uid)) return 'locked';
  if (!state().units[uid]) return 'new';
  const p = pctReviewed(released(DECK, uid));
  return p >= 0.8 ? 'review' : 'learning';
}

// ---------- confusions → contrast cards ----------
export function noteConfusion(card, picked) {
  const st = state();
  const k = `${card.id}|${picked}`;
  st.conf[k] = (st.conf[k] || 0) + 1;
  let created = null;
  if (st.conf[k] === 2 && !st.contrasts.some((c) => c.base === card.id && c.alt === picked)) {
    created = { base: card.id, alt: picked, id: `${card.unit}.contrast.dyn.${st.contrasts.length}` };
    st.contrasts.push(created);
  }
  save();
  return created;
}
