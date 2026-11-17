// Meander: one progression, played as written, then altered a little more on each pass, to show how a progression
// can be elaborated: richer chords and diatonic substitutes first, then borrowed chords, then secondary dominants,
// two-fives and passing diminished chords, then tritone subs and chromatic approaches, then chromatic mediants,
// side steps and pedal basses. Changes accumulate; after the furthest pass it plays as written once more, for
// contrast, and sets off on a new path. Every change is named (in a word or two aloud, in full on screen).
import * as T from '../theory.js';
import * as L from '../caged/library.js';
import * as Hc from '../caged/harmony.js';
import * as E from '../caged/evolve.js';
import { speakable } from './packs.js';

const C = T.parseNote('C');
const ivPlus = (iv, step) => Hc.ivFrom(C, T.transpose(T.transpose(C, iv), step));
const ivSemi = (s, sharp = false) => (sharp ? ['1', '#1', '2', '#2', '3', '4', '#4', '5', '#5', '6', 'b7', '7'] : ['1', 'b2', '2', 'b3', '3', '4', 'b5', '5', 'b6', '6', 'b7', '7'])[((s % 12) + 12) % 12];
const semi = (iv) => Hc.semisOf(iv);
const isSev = (q) => T.getChord(q).ivs.length >= 4;
const Q = (kind, sev) => ({ maj: sev ? 'maj7' : 'maj', min: sev ? 'm7' : 'min', dom: '7', hd: sev ? 'm7b5' : 'dim', dim7: 'dim7' }[kind]);
const rn = (spec) => Hc.label(spec, spec.q, spec.bass);
const pick = (a) => a[Math.floor(Math.random() * a.length)];

export const TIERS = [
  { n: 1, name: 'Colour', blurb: 'Richer chords, and diatonic substitutes: vi or iii for I, ii for IV.' },
  { n: 2, name: 'Borrowed', blurb: 'Then chords from the parallel key: iv, ♭VI, ♭VII, iiø, ♭III.' },
  { n: 3, name: 'Secondary', blurb: 'Then secondary dominants, two-fives into any chord, passing diminished chords.' },
  { n: 4, name: 'Jazz', blurb: 'Then tritone subs, the backdoor dominant, chromatic approach chords.' },
  { n: 5, name: 'Far out', blurb: 'Then chromatic mediants, the Neapolitan, side steps, pedal basses.' },
];
// what the voice says for each kind of change (economy of words)
export const CAT_SAY = {
  colour: 'a richer chord', dominant: 'the dominant', diatonic: 'a diatonic substitute', borrowed: 'a borrowed chord', secondary: 'a secondary dominant', twofive: 'a two five',
  passing: 'a passing diminished', tritone: 'a tritone sub', backdoor: 'the backdoor dominant', approach: 'a chromatic approach', mediant: 'a chromatic mediant',
  neapolitan: 'the Neapolitan', sidestep: 'a side step', pedal: 'a pedal in the bass', deceptive: 'a deceptive cadence',
};
const NUMW = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
export const VAR_SAY = (n) => `Variation ${NUMW[n - 1] || n}.`;
export const SAYS = ['As written.', 'Back as written.', ...NUMW.map((_, i) => VAR_SAY(i + 1)), ...Object.values(CAT_SAY)];

// ---------- the changes one slot can take, by tier ----------
// a change: { tier, cat, why, detail, swap?: spec } or { …, ins: [spec, …] } (on the slot's second half) or { …, next: spec }.
// Musical guards: the opening tonic and the final arrival only take colour (or a Picardy third); a chord that an
// inserted chord leads into is never swapped away; a dominant is only substituted when it really resolves; nothing is
// inserted into a chord that is itself inserted; at most one insertion per chord.
const isTonic = (sp) => semi(sp.iv) === 0 && !sp.bass;
const resolvesTo = (sp, nx) => (((semi(nx.iv) - semi(sp.iv)) % 12) + 12) % 12 === 5; // root down a fifth
function changesAt(cur, i, minor) {
  const x = cur[i], sp = x.spec, nxs = cur[(i + 1) % cur.length], nx = nxs.spec, last = i === cur.length - 1, first = i === 0;
  const s = semi(sp.iv), k = E.cls(sp.q), sev = isSev(sp.q), ns = semi(nx.iv), nk = E.cls(nx.q);
  const was = rn(sp), to = rn(nx);
  const target = i > 0 && cur[i - 1].ins && !cur[i - 1].colourOnly; // an inserted chord leads into this one: keep it
  const anchor = first || last || target; // only colour here (and a Picardy third at the end)
  const o = [];
  const swap = (tier, cat, spec, why, detail) => { if (!anchor || cat === 'colour' || (last && cat === 'picardy')) o.push({ tier, cat, swap: spec, why, detail }); };
  const ins = (tier, cat, specs, why, detail) => {
    if (x.ins || nxs.ins || x.split || x.beats < (specs.length > 1 ? 4 : 2) || last) return;
    o.push({ tier, cat, ins: specs, why, detail });
  };
  // 1: colour, diatonic substitutes
  const sevQ = k === 'dom' || (s === 7 && k === 'maj') ? '7' : Q(k, true);
  if (!sev && k !== 'dim7') swap(1, 'colour', { ...sp, q: sevQ }, `${was} becomes ${rn({ ...sp, q: sevQ })}: a seventh adds colour`, 'The seventh gives the chord a soft inner glow (or, on a dominant, a pull); the root and the job stay the same, so the progression keeps its shape.');
  else if (['maj7', 'm7', '7'].includes(sp.q)) { const q = { maj7: s === 0 ? '6/9' : 'maj9', m7: 'm9', 7: '9' }[sp.q]; swap(1, 'colour', { ...sp, q }, `${was} becomes ${rn({ ...sp, q })}: a 9th on top`, 'The ninth sits on top as pure colour: the chord does the same job, just lusher.'); }
  if (!minor) {
    if (s === 0 && k === 'maj' && !anchor && ns !== 9) swap(1, 'diatonic', { iv: '6', q: Q('min', sev) }, `vi for ${was}: the tonic’s relative`, 'vi shares two of the tonic’s three notes, so it still feels like home, but softer and more wistful: a way to arrive without landing.');
    if (s === 0 && k === 'maj' && !anchor && ns !== 4) swap(1, 'diatonic', { iv: '3', q: Q('min', sev) }, `iii for ${was}: tonic family`, 'iii shares the tonic’s third and fifth: home seen through a veil, leaning gently toward the dominant.');
    if (s === 5 && k === 'maj') swap(1, 'diatonic', { iv: '2', q: Q('min', sev) }, `ii for ${was}: both predominants`, 'ii shares two notes with four and does the same job, leaving home to set up the five; minor, so a little cooler.');
    if (s === 2 && k === 'min') swap(1, 'diatonic', { iv: '4', q: Q('maj', sev) }, `IV for ${was}: both predominants`, 'Four does the same job as two, setting up the five, but in major: brighter and more open.');
  }
  // 2: borrowed (from the parallel key)
  if (!minor) {
    if (s === 5 && k === 'maj') swap(2, 'borrowed', { iv: '4', q: sev ? 'm6' : 'min' }, `iv for ${was}: the minor four, from the parallel minor`, 'One note changes: the key’s sixth drops a half step and then falls on to the fifth. That small sigh is the most famous borrowed sound in pop and film.');
    if (s === 9 && k === 'min') swap(2, 'borrowed', { iv: 'b6', q: Q('maj', sev) }, `♭VI for ${was}: from the parallel minor`, 'The root drops a half step and the chord turns major: two flattened notes from the parallel minor, and the music suddenly opens out, cinematic.');
    if (s === 2 && k === 'min' && (ns === 7 || nk === 'dom')) swap(2, 'borrowed', { iv: '2', q: 'm7b5' }, `iiø7 for ${was}: the darker two`, 'The two’s fifth drops a half step (the key’s flat six again): a darker predominant that leans harder into the five.');
    if (s === 4 && k === 'min') swap(2, 'borrowed', { iv: 'b3', q: Q('maj', sev) }, `♭III for ${was}: from the parallel minor`, 'The minor third of the key as a whole major chord: bold, bluesy, a rock and soul colour.');
    if (s === 7 && ns === 0 && !last) swap(2, 'borrowed', { iv: 'b7', q: Q('maj', sev) }, `♭VII for ${was}: home without a leading tone`, 'The flat seven chord comes home a whole step up, with no leading tone pulling: the arrival feels open and anthemic rather than inevitable.');
    if (isTonic(sp) && k === 'maj' && ns === 7) ins(2, 'borrowed', [{ iv: 'b6', q: Q('maj', sev) }], `♭VI before ${to}: a borrowed shadow`, 'On the way to the five, the flat six chord: its root falls a half step straight onto the five’s root, a grand, dark approach.');
  } else {
    if (s === 5 && k === 'min') swap(2, 'borrowed', { iv: '4', q: sev ? '7' : 'maj' }, `IV for ${was}: the Dorian four`, 'The minor four turns major: the key’s flat six is raised, borrowed from the parallel major (Dorian). Hope inside the minor key.');
    if (s === 7 && k === 'min') swap(2, 'borrowed', { iv: '5', q: '7' }, `V7 for ${was}: harmonic minor’s dominant`, 'The minor five gets its leading tone back, a half step below home: now it pulls home with full force.');
    if (last && isTonic(sp) && k === 'min') o.push({ tier: 2, cat: 'picardy', swap: { iv: '1', q: Q('maj', sev) }, why: `I for ${was}: a Picardy third`, detail: 'The last chord’s third is raised: a minor piece ends in major, sudden light.' });
  }
  // 3: secondary dominants, two-fives, passing diminished (each one into the chord after it)
  const nextOk = ['maj', 'min'].includes(nk) && !(ns === 0 && nk === 'maj' && !minor) && !nxs.ins;
  if (nextOk) {
    ins(3, 'secondary', [{ iv: ivPlus(nx.iv, '5'), q: '7', rel: { fn: 'V', to } }], `V7/${to}: a secondary dominant pointing at ${to}`, `A dominant chord built a fifth above ${to}: its third is a half step below ${to}’s root and pulls up into it, so for a moment ${to} sounds like home.`);
    ins(3, 'twofive', [{ iv: ivPlus(nx.iv, '2'), q: nk === 'min' ? 'm7b5' : 'm7', rel: { fn: 'ii', to } }, { iv: ivPlus(nx.iv, '5'), q: nk === 'min' ? '7b9' : '7', rel: { fn: 'V', to } }], `ii–V of ${to}: ${to} as a little home`, `The whole two-five of ${to} squeezed in: two steps round the circle of fifths instead of one, more motion, and ${to} arrives like a cadence.`);
    if (k !== 'dim' && k !== 'dim7') ins(3, 'passing', [{ iv: ivSemi(semi(nx.iv) - 1, true), q: 'dim7' }], `${rn({ iv: ivSemi(semi(nx.iv) - 1, true), q: 'dim7' })} into ${to}: a passing diminished`, `A diminished seventh a half step below ${to}: every note is a half step from a note of ${to}, so it slides in from below, pure forward motion.`);
  }
  if (isTonic(nx) && !['dom'].includes(k) && s !== 7 && !nxs.ins) ins(3, 'dominant', [{ iv: '5', q: '7' }], `V7 before ${to}: the dominant, to close`, 'The dominant slipped in before home: its leading tone rises a half step and its seventh falls, the strongest arrival there is.');
  // 4: tritone subs, backdoor, chromatic approach (only for dominants that really resolve)
  if (k === 'dom' && resolvesTo(sp, nx) && !anchor) swap(4, 'tritone', { iv: ivPlus(sp.iv, 'b5'), q: '7' }, `${rn({ iv: ivPlus(sp.iv, 'b5'), q: '7' })} for ${was}: tritone sub`, `The dominant a tritone away shares the same third and seventh (swapped), so it pulls the same way, but the bass now slides down a half step into ${to}: smoother, jazzier.`);
  if (k === 'dom' && s === 7 && ns === 0 && !minor && !anchor) swap(4, 'backdoor', { iv: 'b7', q: '7' }, `♭VII7 for ${was}: the backdoor dominant`, 'The flat seven dominant comes home a whole step up instead of falling a fifth; its notes come from the parallel minor. Home by the back door: smoky, relaxed.');
  if (nextOk && !isTonic(nx)) ins(4, 'approach', [{ iv: ivPlus(nx.iv, 'b2'), q: '7' }], `${rn({ iv: ivPlus(nx.iv, 'b2'), q: '7' })} into ${to}: a chromatic approach`, `A dominant a half step above ${to}, sliding down into it: it is the tritone sub of ${to}’s own dominant, so it resolves with the same pull, by half step.`);
  // 5: far out
  if (isTonic(sp) && k === 'maj' && !anchor && [5, 2, 7].includes(ns)) swap(5, 'mediant', { iv: 'b6', q: 'maj7' }, `♭VImaj7 for ${was}: a chromatic mediant`, 'A major chord a major third below home, sharing just one note: the same weight as the tonic, a completely different light. A film-score cut.');
  if (isTonic(sp) && k === 'maj' && !anchor && ns === 9) swap(5, 'mediant', { iv: '3', q: '7' }, `III7 for ${was}: a chromatic mediant that leads on`, 'The tonic becomes a dominant on the third, which pulls straight into the six: a bright, surprising lift.');
  if ((s === 2 && k === 'min' || s === 5 && k === 'maj' && !minor) && (ns === 7 || nk === 'dom') && !anchor) swap(5, 'neapolitan', { iv: 'b2', q: 'maj7' }, `♭IImaj7 for ${was}: the Neapolitan`, 'A major chord a half step above home, standing in for the predominant: dark and sweet, and its root falls neatly into the five.');
  if (isTonic(nx) && nk === 'maj' && !nxs.ins) ins(5, 'sidestep', [{ iv: ivPlus(nx.iv, 'b2'), q: nx.q }], `${rn({ iv: ivPlus(nx.iv, 'b2'), q: nx.q })} into ${to}: a side step`, 'Home played a half step too high, then slipping down into place: tension by displacement, an old jazz and soul trick.');
  if ((s === 5 || s === 7) && !sp.bass && i > 0 && isTonic(cur[i - 1].spec)) { const b = ivSemi(12 - s); swap(5, 'pedal', { ...sp, bass: b }, `${rn({ ...sp, bass: b })}: ${was} over the home bass`, 'The bass stays on the home note while the chord changes above it: a pedal point, the harmony moving over still ground.'); }
  if (k === 'dom' && s === 7 && isTonic(nx) && !minor && !last && !anchor) o.push({ tier: 5, cat: 'deceptive', next: { iv: 'b6', q: 'maj7' }, why: `${was} resolves to ♭VImaj7: a deceptive cadence`, detail: 'The dominant promises home; the leading tone rises as expected, but the bass lands a half step from the five instead: a surprise arrival, warm and wide.' });
  return o.filter((c) => (c.swap ? c.swap.iv && T.getChord(c.swap.q) : true));
}

// ---------- choosing well: voice leading and resolution ----------
const pcsOf = (sp) => { const r = semi(sp.iv); const out = T.getChord(sp.q).ivs.map((iv) => (r + T.intervalSemis(iv)) % 12); if (sp.bass) out.push((r + T.intervalSemis(sp.bass)) % 12); return out; };
const near = (a, b) => b.reduce((s2, p) => s2 + Math.min(...a.map((q) => Math.min((p - q + 12) % 12, (q - p + 12) % 12))), 0) / b.length;
// how musical a change is here: smooth voice leading on both sides, a strong root motion into the next chord
function musicality(cur, k, c) {
  const prev = cur[(k - 1 + cur.length) % cur.length].spec, next = cur[(k + 1) % cur.length].spec;
  const news = c.swap ? [c.swap] : c.ins ? [cur[k].spec, ...c.ins] : [c.next];
  const after = c.next ? cur[(k + 2) % cur.length].spec : next;
  const seq = c.next ? [cur[k].spec, c.next, after] : c.swap ? [prev, c.swap, next] : [prev, ...news, next];
  let smooth = 0;
  for (let j = 1; j < seq.length; j++) smooth += near(pcsOf(seq[j - 1]), pcsOf(seq[j]));
  smooth /= seq.length - 1;
  const last = news[news.length - 1], into = (((semi(after.iv) - semi(last.iv)) % 12) + 12) % 12;
  const strong = into === 5 ? 1.2 : into === 11 ? 0.9 : into === 1 ? 0.7 : into === 2 ? 0.4 : 0;
  return 2.5 - smooth + strong + (c.cat === 'colour' ? 0.4 : 0);
}
// the options at a tier, each with a weight: musical ones far likelier; untouched chords first
function weighted(cur, tier, minor) {
  const same = (a, b) => a && b && a.iv === b.iv && a.q === b.q && a.bass === b.bass;
  const opts = [];
  cur.forEach((x, k) => {
    if ((x.times || 0) >= 2) return;
    for (const c of changesAt(cur, k, minor)) {
      if (c.tier !== tier || same(c.swap, x.spec) || (c.next && same(c.next, cur[(k + 1) % cur.length].spec))) continue;
      const m = musicality(cur, k, c);
      opts.push({ k, c, w: Math.exp(m * 1.6) * (x.changed ? 0.4 : 1) });
    }
  });
  return opts;
}
function applyChange(cur, k, c) {
  if (c.swap) cur[k] = { ...cur[k], spec: c.swap, changed: c.why, detail: c.detail, tier: c.tier, cat: c.cat, times: (cur[k].times || 0) + 1, colourOnly: c.cat === 'colour' };
  else if (c.ins) { const x = cur[k], half = x.beats / 2, each = half / c.ins.length; cur.splice(k, 1, { ...x, beats: half, split: true }, ...c.ins.map((spec) => ({ spec, beats: each, changed: c.why, detail: c.detail, tier: c.tier, cat: c.cat, ins: true, times: 1 }))); }
  else if (c.next) { const j = (k + 1) % cur.length; cur[j] = { ...cur[j], spec: c.next, changed: c.why, detail: c.detail, tier: c.tier, cat: c.cat, times: 2 }; }
  return c.ins ? k + 1 : c.next ? (k + 1) % cur.length : k; // where the new chord is
}

// ---------- the stream ----------
export function reharmStream(O, home) {
  const item = L.byId(O.prog), minor = !!item.minor;
  const orig = [];
  L.resolve(item).forEach((b) => b.forEach((spec) => orig.push({ spec, beats: 4 / b.length })));
  orig.forEach((x, k) => { x.oid = k; });
  const max = Math.max(1, Math.min(5, O.far || 3));
  const steps = max * 2; // two changes per tier
  let cur = orig.map((x) => ({ ...x })), pass = 0, vn = 0, i = 0, rep = 0, prog = null, mode = 'written';
  const label = () => cur.map((x) => rn(x.spec));
  function newPass() {
    let lines, note, name;
    if (mode === 'written' || mode === 'again') {
      cur = orig.map((x) => ({ ...x }));
      lines = mode === 'written' ? [speakable(item.name), 'As written.'] : ['Back as written.'];
      name = item.name; note = 'As written.'; vn = 0;
    } else {
      vn++;
      const tier = Math.min(max, Math.ceil(vn / 2));
      const made = [];
      // one change (two at the far tiers), from this tier if possible, else the one below
      for (let n = 0; n < (tier >= 4 ? 2 : 1); n++) {
        for (let tt = tier; tt >= 1; tt--) {
          const opts = weighted(cur, tt, minor);
          if (!opts.length) continue;
          let r = Math.random() * opts.reduce((a, o) => a + o.w, 0), ch = opts[0];
          for (const o of opts) { r -= o.w; if (r <= 0) { ch = o; break; } }
          const { k, c } = ch;
          applyChange(cur, k, c);
          made.push(c);
          break;
        }
      }
      if (!made.length) { mode = 'again'; return newPass(); }
      lines = [VAR_SAY(vn), ...made.map((c) => CAT_SAY[c.cat])];
      name = `${item.name} · variation ${vn}`;
      note = made.map((c) => c.why).join(' · ');
    }
    prog = { pack: null, it: { id: item.id, name, note }, rns: label(), specs: cur.map((x) => x.spec), changed: cur.map((x) => !!x.changed), lines, changes: cur.filter((x) => x.changed).map((x) => x.changed) };
    i = 0; rep = 0;
  }
  function advance() {
    if (mode === 'written') mode = 'vary';
    else if (mode === 'again') mode = 'vary';
    else if (vn >= steps) mode = 'again';
    newPass();
  }
  newPass();
  return {
    skip() { i = cur.length; rep = 99; },
    next() {
      if (i >= cur.length) { i = 0; rep++; if (rep >= (O.loops || 1)) advance(); }
      const x = cur[i];
      const out = { spec: { ...x.spec }, key: { off: 0, minor }, beats: x.beats, ann: [], idx: i, prog };
      if (i === 0 && rep === 0) out.intro = { pack: null, it: prog.it, lines: prog.lines };
      i++;
      return out;
    },
  };
}

// ---------- the Exploder: every step from the plain progression to the most elaborate, repeatable ----------
// A version is a seed: the same seed always gives the same path. Each state is the whole progression after one more
// change; slots carry `changed` (why) and `tier` when they differ from the original.
function rng(seed) { let s = (seed * 7919 + 104729) % 233280; return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; }; }
export function explodeSteps(item, seed = 1, max = 5) {
  const R = rng(seed);
  const minor = !!item.minor;
  const orig = [];
  L.resolve(item).forEach((b) => b.forEach((spec) => orig.push({ spec, beats: 4 / b.length })));
  const cur = orig.map((x, k) => ({ ...x, oid: k }));
  const states = [{ slots: cur.map((x) => ({ ...x })), change: null, tier: 0 }];
  for (let vn = 1; vn <= max * 2 + 2; vn++) {
    const tier = Math.min(max, Math.ceil(vn / 2));
    let made = null;
    for (let tt = tier; tt >= 1 && !made; tt--) {
      const opts = weighted(cur, tt, minor);
      if (!opts.length) continue;
      let r = R() * opts.reduce((a, o) => a + o.w, 0), ch = opts[0];
      for (const o of opts) { r -= o.w; if (r <= 0) { ch = o; break; } }
      const at = applyChange(cur, ch.k, ch.c);
      made = { ...ch.c, at };
    }
    if (!made) break;
    states.push({ slots: cur.map((x) => ({ ...x })), change: made, tier: made.tier });
  }
  return states;
}
