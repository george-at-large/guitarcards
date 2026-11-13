// Evolving mode and major/minor conversion. A progression is a list of slots { spec: { iv, q, rel? }, beats, bar }.
// Each pass through the loop, evolve() makes one change that keeps the harmony's job the same: a chord swapped for one
// with the same function (iii or vi for I, ii for IV, ♭II7 or viiø7 for V7), or a chord inserted on the second half of
// a long chord (ii before V, V7 of the next chord, a passing diminished). Once enough has changed it starts undoing old
// changes as well, so the tune drifts around its original instead of wandering off.
import * as T from '../theory.js';
import { ivFrom, numeral, semisOf, toTriad } from './harmony.js';

const C = T.parseNote('C');
const ivPlus = (iv, step) => ivFrom(C, T.transpose(T.transpose(C, iv), step));
// chord families: what a chord is, so a substitute can be written in the same weight (triad or seventh)
export function cls(q) {
  const ivs = T.getChord(q).ivs;
  const has = (x) => ivs.includes(x);
  if (has('b3') && has('b5') && has('bb7')) return 'dim7';
  if (has('b3') && has('b5') && has('b7')) return 'hd';
  if (has('b3') && has('b5')) return 'dim';
  if (has('b7') && (has('3') || has('4'))) return 'dom';
  if (has('b3')) return 'min';
  return 'maj';
}
const isSeventh = (q) => T.getChord(q).ivs.length >= 4;
const make = (kind, sev) => ({ maj: sev ? 'maj7' : 'maj', min: sev ? 'm7' : 'min', dom: '7', hd: sev ? 'm7b5' : 'dim', dim: sev ? 'm7b5' : 'dim', dim7: sev ? 'dim7' : 'dim' }[kind]);
const roman = (spec) => numeral(spec.iv, toTriad(spec.q));

// ---------- major ↔ minor ----------
// a progression heard in the parallel key: the diatonic chords take their parallel-key versions (I → i, ii → iiø,
// iii → ♭III, IV → iv, vi → ♭VI, vii° → vii°7 and back); dominants and chromatic chords stay as they are
export function toParallel(spec, toMinor) {
  const s = semisOf(spec.iv), k = cls(spec.q), q = spec.q;
  const out = (iv, nq) => ({ ...spec, iv, q: nq });
  if (k === 'dom' || spec.rel) return spec;
  if (toMinor) {
    if (s === 0 && k === 'maj') return out('1', { maj: 'min', maj7: 'm7', '6': 'm6', maj9: 'm9', '6/9': 'm6/9', add9: 'madd9' }[q] || 'm7');
    if (s === 2 && k === 'min') return out('2', isSeventh(q) ? 'm7b5' : 'dim');
    if (s === 4 && k === 'min') return out('b3', isSeventh(q) ? 'maj7' : 'maj');
    if (s === 5 && k === 'maj') return out('4', isSeventh(q) ? (q === '6' ? 'm6' : 'm7') : 'min');
    if (s === 9 && k === 'min') return out('b6', isSeventh(q) ? 'maj7' : 'maj');
    if (s === 11 && (k === 'hd' || k === 'dim')) return out('7', isSeventh(q) ? 'dim7' : 'dim');
    return spec;
  }
  if (s === 0 && (k === 'min')) return out('1', { min: 'maj', m7: 'maj7', m6: '6', m9: 'maj9', 'm6/9': '6/9', madd9: 'add9', mMaj7: 'maj7', m11: 'maj9' }[q] || 'maj7');
  if (s === 2 && (k === 'hd' || k === 'dim')) return out('2', isSeventh(q) ? 'm7' : 'min');
  if (s === 3 && k === 'maj') return out('3', isSeventh(q) ? 'm7' : 'min');
  if (s === 5 && k === 'min') return out('4', isSeventh(q) ? (q === 'm6' ? '6' : 'maj7') : 'maj');
  if (s === 7 && k === 'min') return out('5', isSeventh(q) ? '7' : 'maj');
  if (s === 8 && k === 'maj') return out('6', isSeventh(q) ? 'm7' : 'min');
  if (s === 11 && (k === 'dim7' || k === 'dim')) return out('7', isSeventh(q) ? 'm7b5' : 'dim');
  return spec;
}

// ---------- substitutions ----------
const pick = (a) => a[Math.floor(Math.random() * a.length)];
// a swap: same slot, new chord. Returns { spec, why } or null.
function swaps(spec, next, minor) {
  const s = semisOf(spec.iv), k = cls(spec.q), sev = isSeventh(spec.q);
  const was = roman(spec);
  const o = [];
  const sw = (iv, kind, why) => o.push({ spec: { iv, q: make(kind, sev) }, why: `${why}` });
  const nextS = next ? semisOf(next.iv) : null;
  if (!minor) {
    if (s === 0 && k === 'maj') { sw('3', 'min', `iii for ${was}: tonic family, two notes shared`); sw('6', 'min', `vi for ${was}: tonic family`); }
    if ((s === 4 || s === 9) && k === 'min') sw('1', 'maj', `I for ${was}: tonic family`);
    if (s === 5 && k === 'maj') { sw('2', 'min', `ii for ${was}: both predominants`); sw('4', 'min', `iv for ${was}: borrowed from minor`); }
    if (s === 2 && k === 'min') { sw('4', 'maj', `IV for ${was}: both predominants`); sw('2', 'hd', `iiø for ${was}: the darker, borrowed ii`); }
    if (s === 7 && k === 'maj') sw('7', 'dim', `vii° for ${was}: dominant family`);
  } else {
    if (s === 0 && k === 'min') { sw('b3', 'maj', `♭III for ${was}: the relative major, tonic family`); sw('b6', 'maj', `♭VI for ${was}: tonic family`); }
    if ((s === 3 || s === 8) && k === 'maj') sw('1', 'min', `i for ${was}: tonic family`);
    if (s === 5 && k === 'min') sw('2', 'hd', `iiø for ${was}: both predominants`);
    if (s === 2 && (k === 'hd' || k === 'dim')) sw('4', 'min', `iv for ${was}: both predominants`);
    if (s === 8 && k === 'maj' && nextS === 7) sw('4', 'min', `iv for ${was}: predominant before V`);
  }
  if (k === 'dom' && s === 7) {
    o.push({ spec: { iv: 'b2', q: '7' }, why: `♭II7 for ${was}: tritone sub, same 3rd and 7th` });
    o.push(minor ? { spec: { iv: '7', q: 'dim7' }, why: `vii°7 for ${was}: rootless V7♭9` } : { spec: { iv: '7', q: 'm7b5' }, why: `viiø7 for ${was}: rootless V9` });
    if (next && semisOf(next.iv) === 0 && !minor) o.push({ spec: { iv: 'b7', q: '7' }, why: `♭VII7 for ${was}: the backdoor dominant` });
  } else if (k === 'dom' && !spec.rel) {
    o.push({ spec: { iv: ivPlus(spec.iv, 'b5'), q: '7' }, why: `tritone sub for ${was}: same 3rd and 7th` });
  } else if (k === 'dom' && spec.rel) {
    o.push({ spec: { iv: ivPlus(spec.iv, 'b5'), q: '7' }, why: `tritone sub for ${numeral(spec.iv, '7')}: the bass slides by half step` });
  }
  return o;
}
// an insertion on the second half of a chord of 2+ beats, leading into the next chord
function inserts(spec, next, minor) {
  const o = [];
  if (!next) return o;
  const ns = semisOf(next.iv), nk = cls(next.q);
  const target = roman(next);
  if (nk === 'dom' && ns === 7) o.push({ spec: { iv: '2', q: minor ? 'm7b5' : 'm7' }, why: `${minor ? 'iiø7' : 'ii7'} before ${target}: a ii–V` });
  if ((nk === 'maj' || nk === 'min') && ns !== 0) o.push({ spec: { iv: ivPlus(next.iv, '5'), q: '7', rel: { fn: 'V', to: target } }, why: `V7/${target}: a secondary dominant pointing at ${target}` });
  if (!minor && ns === 2 && nk === 'min' && semisOf(spec.iv) === 0) o.push({ spec: { iv: '#1', q: 'dim7' }, why: '♯I°7 between I and ii: the bass climbs by half steps' });
  if (nk === 'dom' && ns === 7 && semisOf(spec.iv) === 5 && cls(spec.q) === 'maj') o.push({ spec: { iv: '#4', q: 'dim7' }, why: '♯IV°7 between IV and V: the bass climbs by half steps' });
  return o;
}

// one step of evolution. `orig` is the untouched progression; slots carry `oid` (their original index), `sub` (why
// they differ) and `half` (an inserted second half, to be merged back when undone)
export function evolve(cur, orig, minor) {
  const subs = cur.filter((x) => x.sub).length;
  const undo = subs >= Math.max(2, Math.ceil(orig.length / 3)) && Math.random() < 0.45;
  if (undo) {
    const i = pick(cur.map((x, j) => (x.sub ? j : -1)).filter((j) => j >= 0));
    const x = cur[i];
    const out = [...cur];
    const o = orig[x.oid];
    if (x.half) { const j = out.findIndex((y) => y.oid === x.oid && !y.half); out.splice(Math.min(i, j), 2, { ...o, oid: x.oid }); }
    else if (out.some((y) => y.oid === x.oid && y.half)) out[i] = { ...out[i], spec: o.spec, sub: null };
    else out[i] = { ...o, oid: x.oid };
    return { slots: out, note: `back to ${roman(o.spec)}` };
  }
  for (let tries = 0; tries < 40; tries++) {
    const i = Math.floor(Math.random() * cur.length);
    const x = cur[i], next = cur[(i + 1) % cur.length].spec;
    if (x.half) continue;
    const canSplit = x.beats >= 2 && x.beats % 2 === 0 && !cur.some((y) => y.oid === x.oid && y.half);
    const opts = [...swaps(x.spec, next, minor).map((s) => ({ ...s, kind: 'swap' })), ...(canSplit ? inserts(x.spec, next, minor).map((s) => ({ ...s, kind: 'ins' })) : [])];
    if (!opts.length) continue;
    const ch = pick(opts);
    const out = [...cur];
    if (ch.kind === 'swap') {
      const o = orig[x.oid].spec;
      const home = o.iv === ch.spec.iv && o.q === ch.spec.q && !x.half;
      out[i] = { ...x, spec: home ? o : ch.spec, sub: home ? null : ch.why };
      if (home) return { slots: out, note: `back to ${roman(o)}` };
    }
    else out.splice(i, 1, { ...x, beats: x.beats / 2 }, { ...x, beats: x.beats / 2, spec: ch.spec, sub: ch.why, half: true });
    return { slots: out, note: ch.why };
  }
  return { slots: cur, note: null };
}

// every chord evolving mode could bring into this progression: swaps and insertions from the original, and one more
// step from those (iii for I, then the tritone sub of an inserted V7/ii…). Each comes with what it stands in for
// and the chord it leads to (for its colour).
export function reachable(orig, minor) {
  const key = (sp) => `${sp.iv}:${sp.q}:${sp.rel ? sp.rel.to : ''}`;
  const have = new Set(orig.map((x) => key(x.spec)));
  const out = [];
  let frontier = orig.map((x, i) => ({ spec: x.spec, next: orig[(i + 1) % orig.length].spec }));
  for (let depth = 0; depth < 2; depth++) {
    const found = [];
    for (const { spec, next } of frontier) {
      for (const o of [...swaps(spec, next, minor), ...inserts(spec, next, minor)]) {
        const k = key(o.spec);
        if (have.has(k)) continue;
        have.add(k);
        const item = { spec: o.spec, why: o.why, next: o.spec.rel || cls(o.spec.q) === 'dom' ? next : next };
        out.push(item);
        found.push({ spec: o.spec, next });
      }
    }
    frontier = found;
  }
  return out;
}
