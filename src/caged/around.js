// Around the progression: the progression stays the scaffold, and each time round some of its chords are swapped for
// (or led into by) chords from a palette: modal interchange (borrowed from the parallel key), chromatic (secondary
// dominants, tritone subs, passing diminished, the augmented sixth), or both. Every change keeps its slot's job, and
// each pass starts again from the original, so the tune never wanders off. Slots keep `oid` (their place in the
// original), `sub` (why they changed) and `half` (an inserted chord on the second half of a slot), as evolve.js does.
import * as T from '../theory.js';
import { ivFrom, numeral, semisOf, toTriad } from './harmony.js';
import { cls } from './evolve.js';

const C0 = T.parseNote('C');
const ivPlus = (iv, step) => ivFrom(C0, T.transpose(T.transpose(C0, iv), step));
const sev = (q) => T.getChord(q).ivs.length >= 4;
const make = (kind, seventh) => ({ maj: seventh ? 'maj7' : 'maj', min: seventh ? 'm7' : 'min', dom: '7', hd: seventh ? 'm7b5' : 'dim', dim7: 'dim7' }[kind]);
const rn = (spec) => numeral(spec.iv, toTriad(spec.q));

export const PALETTES = [['off', 'Off'], ['mi', 'Modal interchange'], ['chr', 'Chromatic'], ['both', 'Both']];
export const AMOUNTS = [['light', 'Light'], ['medium', 'Medium'], ['heavy', 'Heavy']];
export const PALETTE_BLURB = {
  off: 'The progression as written (with the colour you pick).',
  mi: 'Borrowed chords from the parallel key: iv for IV, ♭VI for vi, ♭VII, iiø, ♭III, v; ♭VII7 or iv slipping in before I. In minor: Dorian ii and IV, the harmonic V, the Picardy third, the Neapolitan.',
  chr: 'Secondary dominants (a chord turned into the V7 of the next), tritone subs, passing diminished chords and the augmented sixth into V.',
  both: 'Borrowed and chromatic chords together.',
};

// swaps: the same slot, a different chord with the same job
function swaps(x, next, minor, pal, isLast, isFirst) {
  const spec = x.spec, s = semisOf(spec.iv), k = cls(spec.q), w = sev(spec.q), was = rn(spec), o = [];
  const sw = (iv, kind, why, q) => o.push({ spec: { iv, q: q || make(kind, w) }, why });
  if (pal.mi && !spec.rel) {
    if (!minor) {
      if (s === 2 && k === 'min') sw('2', 'hd', `iiø for ${was}: borrowed from minor, darker`);
      if (s === 4 && k === 'min') sw('b3', 'maj', `♭III for ${was}: borrowed from minor`);
      if (s === 5 && k === 'maj') { sw('4', 'min', `iv for ${was}: the minor four, borrowed`); sw('b6', 'maj', `♭VI for ${was}: borrowed, cinematic`); }
      if (s === 7 && (k === 'maj' || k === 'dom') && !(next && semisOf(next.spec.iv) === 0)) sw('5', 'min', `v for ${was}: borrowed, a softer dominant`);
      if (s === 9 && k === 'min') sw('b6', 'maj', `♭VI for ${was}: borrowed from minor`);
      if (s === 11 && (k === 'dim' || k === 'hd')) sw('b7', 'maj', `♭VII for ${was}: borrowed, the rock chord`, w ? '7' : 'maj');
      if (s === 0 && k === 'maj' && !isLast && !isFirst) sw('1', 'min', `i for ${was}: a flash of the parallel minor`);
    } else {
      if (s === 0 && k === 'min' && isLast) sw('1', 'maj', `I for ${was}: the Picardy third`);
      if (s === 2 && (k === 'hd' || k === 'dim')) sw('2', 'min', `ii for ${was}: Dorian, lighter`);
      if (s === 5 && k === 'min') sw('4', 'dom', `IV for ${was}: the Dorian four`, w ? '7' : 'maj');
      if (s === 7 && k === 'min') sw('5', 'dom', `V for ${was}: the harmonic-minor dominant`, w ? '7' : 'maj');
      if ((s === 5 || s === 2) && next && semisOf(next.spec.iv) === 7) sw('b2', 'maj', `♭II for ${was}: the Neapolitan, Phrygian colour before V`);
    }
  }
  if (pal.chr) {
    // a chord turned into the dominant of the next one (vi → VI7 before ii)
    if (next && !spec.rel && k !== 'dom' && ((semisOf(next.spec.iv) - s + 12) % 12) === 5 && ['maj', 'min'].includes(cls(next.spec.q)) && semisOf(next.spec.iv) !== 0) {
      const target = rn(next.spec);
      o.push({ spec: { iv: spec.iv, q: '7', rel: { fn: 'V', to: target } }, why: `V7/${target} for ${was}: turned into the dominant of the next chord` });
    }
    if (k === 'dom') o.push({ spec: { iv: ivPlus(spec.iv, 'b5'), q: '7' }, why: `tritone sub for ${spec.rel ? numeral(spec.iv, '7') : was}: same 3rd and 7th, the bass slides by half step` });
  }
  return o;
}
// insertions: a chord on the second half of a slot of two beats or more, leading into the next chord
function inserts(x, next, minor, pal) {
  const o = [];
  if (!next || x.beats < 2 || x.beats % 2) return o;
  const ns = semisOf(next.spec.iv), nk = cls(next.spec.q), target = rn(next.spec), s = semisOf(x.spec.iv);
  const ins = (spec, why) => o.push({ spec, why });
  if (pal.mi) {
    if (!minor && ns === 0 && nk === 'maj' && s !== 0) { ins({ iv: '4', q: 'm7' }, `iv before ${target}: the minor plagal, borrowed`); ins({ iv: 'b7', q: '7' }, `♭VII7 before ${target}: the backdoor dominant`); }
    if (!minor && ns === 7 && s !== 8) ins({ iv: 'b6', q: 'maj7' }, `♭VI before ${target}: borrowed, rising to V`);
    if (minor && ns === 7 && s !== 1) ins({ iv: 'b2', q: 'maj7' }, `♭II before ${target}: the Neapolitan`);
  }
  if (pal.chr) {
    if ((nk === 'maj' || nk === 'min') && ns !== 0) ins({ iv: ivPlus(next.spec.iv, '5'), q: '7', rel: { fn: 'V', to: target } }, `V7/${target}: a secondary dominant pointing at ${target}`);
    if (!minor && ns === 2 && nk === 'min' && s === 0) ins({ iv: '#1', q: 'dim7' }, `♯I°7 between I and ii: the bass climbs by half steps`);
    if (ns === 7 && s === 5) ins({ iv: '#4', q: 'dim7' }, `♯IV°7 between IV and V: the bass climbs by half steps`);
    if (ns === 7 && (nk === 'dom' || nk === 'maj') && s !== 8) ins({ iv: 'b6', q: '7' }, `the augmented sixth (♭VI7) into ${target}: the bass falls a half step`);
  }
  return o;
}

const pick = (a) => a[Math.floor(Math.random() * a.length)];
// one pass round the progression: the original with a few slots swapped or led into
export function around(orig, minor, palette = 'off', amount = 'medium') {
  if (palette === 'off' || !orig.length) return orig;
  const pal = { mi: palette === 'mi' || palette === 'both', chr: palette === 'chr' || palette === 'both' };
  const n = orig.length;
  const want = amount === 'light' ? 1 : Math.max(1, Math.round(n * (amount === 'heavy' ? 0.5 : 0.25)));
  const opts = orig.map((x, i) => {
    const next = orig[(i + 1) % n];
    return [...swaps(x, next, minor, pal, i === n - 1, i === 0).map((c) => ({ ...c, kind: 'swap' })), ...inserts(x, next, minor, pal).map((c) => ({ ...c, kind: 'ins' }))];
  });
  const order = orig.map((_, i) => i).filter((i) => opts[i].length).sort(() => Math.random() - 0.5).slice(0, want);
  const out = [];
  orig.forEach((x, i) => {
    const base = { ...x, oid: x.oid ?? i };
    if (!order.includes(i)) return out.push(base);
    const ch = pick(opts[i]);
    if (ch.kind === 'swap') out.push({ ...base, spec: ch.spec, sub: ch.why });
    else out.push({ ...base, beats: x.beats / 2 }, { ...base, beats: x.beats / 2, spec: ch.spec, sub: ch.why, half: true });
  });
  return out;
}
