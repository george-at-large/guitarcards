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
// a change: { tier, cat, why, swap?: spec } or { tier, cat, why, ins: [spec, …] } (inserted on the slot's second half)
function changesAt(cur, i, minor) {
  const x = cur[i], sp = x.spec, nx = cur[(i + 1) % cur.length].spec, last = i === cur.length - 1;
  const s = semi(sp.iv), k = E.cls(sp.q), sev = isSev(sp.q), ns = semi(nx.iv), nk = E.cls(nx.q);
  const was = rn(sp), to = rn(nx);
  const o = [];
  const swap = (tier, cat, spec, why) => o.push({ tier, cat, swap: spec, why });
  const ins = (tier, cat, specs, why) => { if (x.beats >= (specs.length > 1 ? 4 : 2)) o.push({ tier, cat, ins: specs, why }); };
  // 1: colour, diatonic substitutes
  const sevQ = k === 'dom' || (s === 7 && k === 'maj') ? '7' : Q(k, true);
  if (!sev && k !== 'dim7') swap(1, 'colour', { ...sp, q: sevQ }, `${was} becomes ${rn({ ...sp, q: sevQ })}: a seventh adds colour`);
  else if (['maj7', 'm7', '7'].includes(sp.q)) { const q = { maj7: s === 0 ? '6/9' : 'maj9', m7: 'm9', 7: '9' }[sp.q]; swap(1, 'colour', { ...sp, q }, `${was} becomes ${rn({ ...sp, q })}: a 9th on top`); }
  if (!minor) {
    if (s === 0 && k === 'maj' && i > 0) { swap(1, 'diatonic', { iv: '6', q: Q('min', sev) }, `vi for ${was}: the tonic’s relative, two notes shared`); swap(1, 'diatonic', { iv: '3', q: Q('min', sev) }, `iii for ${was}: tonic family`); }
    if (s === 5 && k === 'maj') swap(1, 'diatonic', { iv: '2', q: Q('min', sev) }, `ii for ${was}: both predominants`);
    if (s === 2 && k === 'min') swap(1, 'diatonic', { iv: '4', q: Q('maj', sev) }, `IV for ${was}: both predominants`);
  }
  // 2: borrowed
  if (!minor) {
    if (s === 5 && k === 'maj') swap(2, 'borrowed', { iv: '4', q: sev ? 'm6' : 'min' }, `${minor ? '' : 'iv'} for ${was}: the minor four, from the parallel minor`);
    if (s === 9 && k === 'min') swap(2, 'borrowed', { iv: 'b6', q: Q('maj', sev) }, `♭VI for ${was}: from the parallel minor`);
    if (s === 2 && k === 'min') swap(2, 'borrowed', { iv: '2', q: 'm7b5' }, `iiø7 for ${was}: the darker two, from the parallel minor`);
    if (s === 4 && k === 'min') swap(2, 'borrowed', { iv: 'b3', q: Q('maj', sev) }, `♭III for ${was}: from the parallel minor`);
    if (s === 7 && ns === 0) swap(2, 'borrowed', { iv: 'b7', q: Q('maj', sev) }, `♭VII for ${was}: home without a leading tone`);
    if (s === 0 && k === 'maj' && ns === 7) ins(2, 'borrowed', [{ iv: 'b6', q: Q('maj', sev) }], `♭VI before ${to}: a borrowed shadow`);
  } else {
    if (s === 5 && k === 'min') swap(2, 'borrowed', { iv: '4', q: sev ? '7' : 'maj' }, `IV for ${was}: the Dorian four, from the parallel major`);
    if (s === 7 && k === 'min') swap(2, 'borrowed', { iv: '5', q: '7' }, `V7 for ${was}: harmonic minor’s leading tone`);
    if (s === 0 && last && k === 'min') swap(2, 'borrowed', { iv: '1', q: Q('maj', sev) }, `I for ${was}: a Picardy third`);
  }
  // 3: secondary dominants, two-fives, passing diminished (into the next chord)
  if (!(ns === 0 && (nk === 'maj' || nk === 'min')) && ['maj', 'min'].includes(nk)) {
    ins(3, 'secondary', [{ iv: ivPlus(nx.iv, '5'), q: '7', rel: { fn: 'V', to } }], `V7/${to}: a secondary dominant pointing at ${to}`);
    ins(3, 'twofive', [{ iv: ivPlus(nx.iv, '2'), q: nk === 'min' ? 'm7b5' : 'm7', rel: { fn: 'ii', to } }, { iv: ivPlus(nx.iv, '5'), q: nk === 'min' ? '7b9' : '7', rel: { fn: 'V', to } }], `ii–V of ${to}: ${to} heard as a little home of its own`);
    ins(3, 'passing', [{ iv: ivSemi(semi(nx.iv) - 1, true), q: 'dim7' }], `${rn({ iv: ivSemi(semi(nx.iv) - 1, true), q: 'dim7' })} into ${to}: a diminished chord a half step below`);
  }
  if (ns === 0 && k !== 'dom' && !(s === 7)) ins(3, 'dominant', [{ iv: '5', q: '7' }], `V7 before ${to}: the dominant, to close`);
  // 4: tritone subs, backdoor, chromatic approach
  if (k === 'dom') swap(4, 'tritone', { iv: ivPlus(sp.iv, 'b5'), q: '7' }, `${rn({ iv: ivPlus(sp.iv, 'b5'), q: '7' })} for ${was}: tritone sub, the same 3rd and 7th, the bass sliding down`);
  if (k === 'dom' && s === 7 && ns === 0 && !minor) swap(4, 'backdoor', { iv: 'b7', q: '7' }, `♭VII7 for ${was}: the backdoor dominant`);
  if (['maj', 'min'].includes(nk) && x.beats >= 2) ins(4, 'approach', [{ iv: ivPlus(nx.iv, 'b2'), q: '7' }], `${rn({ iv: ivPlus(nx.iv, 'b2'), q: '7' })} into ${to}: a dominant a half step above, sliding down`);
  // 5: far out
  if (s === 0 && k === 'maj' && i > 0) { swap(5, 'mediant', { iv: 'b6', q: 'maj7' }, `♭VImaj7 for ${was}: a chromatic mediant, a third away`); swap(5, 'mediant', { iv: '3', q: '7' }, `III7 for ${was}: a chromatic mediant`); }
  if ((s === 2 && k === 'min') || (s === 5 && !minor)) swap(5, 'neapolitan', { iv: 'b2', q: 'maj7' }, `♭IImaj7 for ${was}: the Neapolitan, dark and sweet`);
  if (['maj', 'min'].includes(nk)) ins(5, 'sidestep', [{ iv: ivPlus(nx.iv, 'b2'), q: nx.q }], `${rn({ iv: ivPlus(nx.iv, 'b2'), q: nx.q })} into ${to}: the same chord a half step up, then down`);
  if ((s === 5 || s === 7 || s === 2) && !sp.bass) { const b = ivSemi(12 - s); swap(5, 'pedal', { ...sp, bass: b }, `${rn({ ...sp, bass: b })}: ${was} over the tonic in the bass, a pedal`); }
  if (k === 'dom' && s === 7 && ns === 0 && !minor) o.push({ tier: 5, cat: 'deceptive', next: { iv: 'b6', q: 'maj7' }, why: `${was} resolves to ♭VImaj7 instead of I: a deceptive cadence` });
  return o.filter((c) => (c.swap ? c.swap.iv && T.getChord(c.swap.q) : true));
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
          const opts = [];
          // any chord can change again (an inserted V7 can become its tritone sub); untouched ones first
          const same = (a, b) => a && b && a.iv === b.iv && a.q === b.q && a.bass === b.bass;
          cur.forEach((x, k) => changesAt(cur, k, minor).filter((c) => c.tier === tt && !same(c.swap, x.spec) && !(c.next && same(c.next, cur[(k + 1) % cur.length].spec))).forEach((c) => opts.push({ k, c, w: x.changed ? 1 : 3 })));
          if (!opts.length) continue;
          let r = Math.random() * opts.reduce((a, o) => a + o.w, 0), ch = opts[0];
          for (const o of opts) { r -= o.w; if (r <= 0) { ch = o; break; } }
          const { k, c } = ch;
          if (c.swap) cur[k] = { ...cur[k], spec: c.swap, changed: c.why };
          else if (c.ins) { const x = cur[k], half = x.beats / 2, each = half / c.ins.length; cur.splice(k, 1, { ...x, beats: half }, ...c.ins.map((spec) => ({ spec, beats: each, changed: c.why, ins: true }))); }
          else if (c.next) { const j = (k + 1) % cur.length; cur[j] = { ...cur[j], spec: c.next, changed: c.why }; }
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
  const same = (a, b) => a && b && a.iv === b.iv && a.q === b.q && a.bass === b.bass;
  for (let vn = 1; vn <= max * 2 + 2; vn++) {
    const tier = Math.min(max, Math.ceil(vn / 2));
    let made = null;
    for (let tt = tier; tt >= 1 && !made; tt--) {
      const opts = [];
      cur.forEach((x, k) => changesAt(cur, k, minor).filter((c) => c.tier === tt && !same(c.swap, x.spec) && !(c.next && same(c.next, cur[(k + 1) % cur.length].spec))).forEach((c) => opts.push({ k, c, w: x.changed ? 1 : 3 })));
      if (!opts.length) continue;
      let r = R() * opts.reduce((a, o) => a + o.w, 0), ch = opts[0];
      for (const o of opts) { r -= o.w; if (r <= 0) { ch = o; break; } }
      const { k, c } = ch;
      if (c.swap) cur[k] = { ...cur[k], spec: c.swap, changed: c.why, tier: c.tier, cat: c.cat };
      else if (c.ins) { const x = cur[k], half = x.beats / 2, each = half / c.ins.length; cur.splice(k, 1, { ...x, beats: half }, ...c.ins.map((spec) => ({ spec, beats: each, changed: c.why, tier: c.tier, cat: c.cat, ins: true }))); }
      else if (c.next) { const j = (k + 1) % cur.length; cur[j] = { ...cur[j], spec: c.next, changed: c.why, tier: c.tier, cat: c.cat }; }
      made = c;
    }
    if (!made) break;
    states.push({ slots: cur.map((x) => ({ ...x })), change: made, tier: made.tier });
  }
  return states;
}
