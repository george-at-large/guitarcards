// Ambient mode: chords drifting by, slowly. They come from CAGED Changes' composer (endless phrases with cadences,
// borrowed chords, secondary dominants, key changes; the complexity slider is its level) or from a progression in
// its library, coloured to the level. Each chord is a real guitar grip, chosen to move as little as possible from
// the last, and its notes change at slightly different moments, so the harmony seems to morph. Inside a long chord
// the top voice can wander to another chord tone, or a suspension can resolve. A voice can name each chord, or
// describe what it is doing in the key.
import * as T from '../theory.js';
import * as A from '../audio.js';
import * as V from '../caged/voice.js';
import * as M from '../caged/meander.js';
import * as L from '../caged/library.js';
import * as Hc from '../caged/harmony.js';
import * as E from '../caged/evolve.js';
import { OPEN } from './harm.js';
import { ROLE, AMB, romanWords } from './words.js';

const pick = (a) => a[Math.floor(Math.random() * a.length)];
const semis = (iv) => T.intervalSemis(iv) % 12;
const KEYS = { major: ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'], minor: ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'G#', 'A', 'Bb', 'B'] };
const keyAt = (pc, minor) => KEYS[minor ? 'minor' : 'major'].find((k) => T.notePc(T.parseNote(k)) === ((pc % 12) + 12) % 12);
export const LEVEL_NAMES = M.LEVELS.map((l) => l.name);
export const PROGRESSIONS = () => L.LIBRARY.map((g) => ({ cat: g.cat, items: L.ALL.filter((p) => p.cat === g.cat) }));

// ---------- grips: every playable way to hold the chord, the best one chosen ----------
const ext = (iv) => iv.replace(/^(b|#)?(9|11|13)$/, (m, a, n) => (a || '') + { 9: '2', 11: '4', 13: '6' }[n]);
function needs(ivs, bassIv) {
  const deg = (iv) => T.INTERVALS[iv][0];
  const has3 = ivs.some((iv) => deg(iv) === 3);
  const fam = (iv) => { const d = deg(iv); return d === 1 ? 'root' : d >= 9 ? 'ext' : d === 3 || ((d === 2 || d === 4) && !has3) ? 'third' : d === 5 || iv === '#4' ? 'fifth' : d === 6 || d === 7 ? 'seventh' : 'ext'; };
  const by = (f) => ivs.filter((iv) => fam(iv) === f);
  const exts = by('ext');
  // the essentials: the 3rd (or sus), the 7th (or 6th), up to two colours; the 5th only if altered
  const must = [...by('third'), ...by('seventh'), ...exts.slice(-2), ...by('fifth').filter((x) => x !== '5')];
  if (bassIv && !must.includes(bassIv)) must.unshift(bassIv);
  return { must: [...new Set(must)] };
}
export function grips(rootPc, q, bassIv = '1') {
  const ivs = T.getChord(q).ivs;
  const pcs = new Map(ivs.map((iv) => [(rootPc + semis(ext(iv))) % 12, iv]));
  const bassPc = (rootPc + semis(ext(bassIv))) % 12;
  const { must } = needs(ivs, bassIv);
  const mustPc = must.map((iv) => (rootPc + semis(ext(iv))) % 12);
  const out = [];
  for (let lo = 0; lo <= 11; lo++) {
    const opts = [];
    for (let s = 0; s < 6; s++) {
      const o = [null];
      for (const f of [0, ...Array.from({ length: 4 }, (_, i) => lo + i)]) if ((f === 0 || f >= Math.max(1, lo)) && pcs.has((OPEN[s] + f) % 12) && !o.includes(f)) o.push(f);
      opts.push(o);
    }
    const cur = [];
    const go = (s) => {
      if (s === 6) {
        const played = cur.map((f, i) => (f === null ? null : { s: i, f, midi: OPEN[i] + f })).filter(Boolean);
        if (played.length < Math.min(4, ivs.length)) return;
        if (played[0].midi % 12 !== bassPc) return;
        const first = played[0].s, last = played[played.length - 1].s;
        let gaps = 0; for (let i = first; i <= last; i++) if (cur[i] === null) gaps++;
        if (gaps > 1) return;
        const have = played.map((p) => p.midi % 12);
        if (!mustPc.every((p) => have.includes(p))) return;
        const counts = {}; for (const p of have) counts[p] = (counts[p] || 0) + 1;
        if (Object.entries(counts).some(([p, n]) => n > (Number(p) === rootPc || (played.length >= 6 && Number(p) === (rootPc + 7) % 12) ? 2 : 1))) return;
        const fr = played.filter((p) => p.f > 0).map((p) => p.f);
        if (fr.length && Math.max(...fr) - Math.min(...fr) > 4) return;
        out.push({ notes: played.map((p) => ({ string: 6 - p.s, fret: p.f, midi: p.midi, iv: pcs.get(p.midi % 12) })), lo });
        return;
      }
      for (const f of opts[s]) { cur[s] = f; go(s + 1); }
      cur[s] = null;
    };
    go(0);
  }
  // one per shape
  const seen = new Set();
  return out.filter((g) => { const k = g.notes.map((n) => `${n.string}:${n.fret}`).join(' '); if (seen.has(k)) return false; seen.add(k); return true; });
}
// the best grip after `prev`: little movement, a colourful top note, a full sound, the middle of the neck
function choose(list, prev, area) {
  const score = (g) => {
    const m = g.notes.map((n) => n.midi);
    let c = 0;
    if (prev) {
      const pm = prev.notes.map((n) => n.midi);
      c += m.reduce((s, x) => s + Math.min(...pm.map((y) => Math.abs(x - y))), 0) / m.length * 1.4;
      c += pm.reduce((s, y) => s + Math.min(...m.map((x) => Math.abs(x - y))), 0) / pm.length * 0.8;
    }
    const top = g.notes[g.notes.length - 1].iv;
    if (top === '1') c += 2.2; else if (top === '5') c += 1;
    c -= Math.min(g.notes.length, 5) * 0.6;
    const fr = g.notes.filter((n) => n.fret > 0).map((n) => n.fret);
    const mid = fr.length ? fr.reduce((s, f) => s + f, 0) / fr.length : 2;
    c += Math.abs(mid - area) * 0.35;
    c += Math.random() * 0.8; // not always the same
    return c;
  };
  return list.map((g) => [g, score(g)]).sort((a, b) => a[1] - b[1])[0]?.[0] || null;
}

// ---------- the music ----------
function colourAt(spec, Lv, next, mi) {
  const q = spec.q;
  if (Lv <= 1) return Hc.toTriad(q);
  const four = T.getChord(q).ivs.length >= 4;
  const sev = four ? q : Hc.toSeventh(Hc.toTriad(q), spec.iv, { dominant: !!spec.rel, minorKey: mi });
  if (Lv === 2) return sev;
  const opts = Hc.colourOptions(sev, spec.iv, { toMinor: next ? Hc.isMinorish(next.q) : false, minorKey: mi });
  if (Lv === 3) return Math.random() < 0.5 ? sev : pick(opts.length ? opts : [sev]);
  return pick(opts.length ? opts : [sev]);
}
function progStream(O) {
  const item = L.byId(O.prog), mi = O.minor;
  const conv = !!item.minor !== mi;
  const orig = [];
  L.resolve(item).forEach((b) => b.forEach((spec) => orig.push({ spec: conv ? E.toParallel(spec, mi) : spec, beats: 4 / b.length })));
  let cur = orig, i = 0, pass = 0;
  return {
    next() {
      if (i >= cur.length) { i = 0; pass++; }
      const x = cur[i], nx = cur[(i + 1) % cur.length];
      const ann = i === 0 && pass === 0 ? [{ say: V.sayable(item.name), text: item.name }] : [];
      i++;
      return { spec: { ...x.spec, q: colourAt(x.spec, O.level, nx.spec, mi) }, key: { off: 0, minor: mi }, beats: x.beats * (O.level >= 3 && i === cur.length ? 2 : 1), ann };
    },
  };
}

// what the chord is doing in its key (rich narration)
function roleOf(spec, q, minor) {
  if (spec.rel) return 'secondary';
  const s = semis(spec.iv), fam = V.familyOf(q);
  const maj = ['maj', 'dom'].includes(fam), min = fam === 'min';
  if (fam === 'sus') return 'sus';
  if (fam === 'dim' && T.getChord(q).ivs.includes('bb7') && s !== 11) return 'passing';
  if (!minor) {
    if (s === 0) return min ? 'borrowed' : 'tonic';
    if (s === 2) return min ? 'super' : null;
    if (s === 4) return min ? 'mediant' : maj ? 'mediantChrom' : null;
    if (s === 5) return min ? 'subMinor' : 'sub';
    if (s === 7) return min ? 'domMinor' : 'dom';
    if (s === 9) return min ? 'rel' : maj ? 'mediantChrom' : null;
    if (s === 11) return 'lead';
    if (s === 1) return fam === 'dom' ? 'tritone' : 'neapolitan';
    if (s === 10) return fam === 'dom' ? 'backdoor' : 'borrowed';
    if (s === 8 || s === 3) return 'borrowed';
    return null;
  }
  if (s === 0) return maj ? 'picardy' : 'tonicMinor';
  if (s === 2) return 'super';
  if (s === 3) return 'relMaj';
  if (s === 5) return maj ? 'borrowedMaj' : 'sub';
  if (s === 7) return min ? 'domMinor' : 'dom';
  if (s === 8) return 'flatSix';
  if (s === 10) return 'subtonic';
  if (s === 11) return 'lead';
  if (s === 1) return fam === 'dom' ? 'tritone' : 'neapolitan';
  return null;
}

export function ambient(O, ui, voices) {
  const ctx = () => A.audioCtx();
  let alive = true, paused = false, timer = null;
  const home = O.key === 'random' ? Math.floor(Math.random() * 12) : T.notePc(T.parseNote(O.key));
  const stream = O.src === 'wander' ? M.meander({ minor: O.minor, level: O.level, grow: false, modulate: O.level >= 3, rhythm: 'varied', bar: 4 }) : progStream(O);
  let prevGrip = null, prevChord = null, t = ctx().currentTime + 0.3, timers = [], queue = [];
  const area = 3 + Math.floor(Math.random() * 5);

  function make() {
    const it = stream.next();
    const tonic = T.parseNote(keyAt(home + it.key.off, it.key.minor));
    const root = Hc.spell(tonic, it.spec.iv);
    const q = it.spec.q;
    const list = grips(T.notePc(root), q, it.spec.bass || '1');
    let g = choose(list, prevGrip, prevGrip ? prevGrip.notes.filter((n) => n.fret > 0).reduce((s, n, _, a) => s + n.fret / a.length, 0) || area : area);
    if (!g) { // nothing playable with that bass: let the bass go
      g = choose(grips(T.notePc(root), q, '1'), prevGrip, area) || choose(grips(T.notePc(root), Hc.toSeventh(Hc.toTriad(q), it.spec.iv, {}), '1'), prevGrip, area);
    }
    prevGrip = g || prevGrip;
    const key = { tonic, minor: it.key.minor };
    const keyLabel = `${T.noteName(tonic, true)} ${key.minor ? 'minor' : 'major'}`;
    const fill = (s) => String(typeof s === 'function' ? s() : s).replace('{key}', keyLabel);
    const c = { spec: it.spec, q, root, key, keyLabel, grip: g, beats: it.beats, rn: Hc.label(it.spec, q), name: Hc.slashName(root, q, it.spec.bass),
      ann: (it.ann || []).map((a) => ({ ...a, text: fill(a.text) })), role: roleOf(it.spec, q, key.minor), bass: it.spec.bass };
    if (O.narr !== 'off') V.prefetch(words(c, null));
    return c;
  }
  // what the voice says
  function words(c, prev) {
    if (O.narr === 'off') return [];
    const main = (V.chordWords(c, 'num', true)[0] || []).map((w, i) => (i ? { seven: 'dominant seven', nine: 'dominant nine', thirteen: 'dominant thirteen' }[w] || w : w));
    if (O.narr === 'minimal') return [main];
    const g = [[...(prev ? [AMB.movingTo] : []), ...main]];
    if (c.role && ROLE[c.role]) g.push([ROLE[c.role]]);
    for (const a of c.ann) if (!(c.role === 'secondary' && /secondary/.test(a.say))) g.push(...V.annWords(a.say, c.key));
    return g;
  }
  const roleText = (c) => (c.role && ROLE[c.role] ? ROLE[c.role] : '');

  // inside one chord: the moments its notes change (motion)
  function moments(c, dur) {
    const base = c.grip.notes.map((n) => ({ ...n }));
    const out = [{ at: 0, notes: base }];
    if (O.motion === 'still' || dur < 5) return out;
    const top = base[base.length - 1];
    const rootPc = T.notePc(c.root);
    const ivs = T.getChord(c.q).ivs;
    const pcs = new Map(ivs.map((iv) => [(rootPc + semis(ext(iv))) % 12, iv]));
    // a suspension: the 3rd held a step up as a 4th, then resolving (flowing)
    if (O.motion === 'flowing' && ivs.includes('3') && !c.spec.bass) {
      const thirdIdx = base.findIndex((n) => n.iv === '3');
      if (thirdIdx >= 0 && base[thirdIdx].fret + 1 <= 15) {
        const sus = base.map((n, i) => (i === thirdIdx ? { ...n, fret: n.fret + 1, midi: n.midi + 1, iv: '4' } : n));
        out[0] = { at: 0, notes: sus };
        out.push({ at: dur * 0.35, notes: base });
      }
    }
    // the top voice wanders to a tension the chord can take (9, 11, 13) or another chord tone, and comes back
    const fam = V.familyOf(c.q);
    const tens = { maj: ['9', '13'], min: ['9', '11'], dom: ['9', '13'], sus: ['9'], hd: ['11'] }[fam] || [];
    const colour = new Map([...pcs]);
    for (const iv of tens) { const p = (rootPc + semis(ext(iv))) % 12; if (!colour.has(p) && ![...pcs.keys()].some((q) => Math.abs(((q - p + 18) % 12) - 6) === 5)) colour.set(p, iv); }
    const others = base.slice(0, -1).map((n) => n.midi % 12);
    const alts = [];
    for (let f = Math.max(0, top.fret - 3); f <= top.fret + 4; f++) {
      const m = OPEN[6 - top.string] + f, p = m % 12;
      if (f === top.fret || !colour.has(p) || Math.abs(m - top.midi) > 5 || colour.get(p) === '1' || others.includes(p)) continue;
      alts.push({ ...top, fret: f, midi: m, iv: colour.get(p) });
    }
    if (alts.length) {
      const a = pick(alts);
      const at = dur * (O.motion === 'flowing' ? 0.45 : 0.5);
      const last = out[out.length - 1].notes;
      out.push({ at, notes: last.map((n) => (n.string === top.string ? a : n)) });
      // back home, unless the note it left is doubled elsewhere
      if (dur > 7 && !others.includes(top.midi % 12)) out.push({ at: dur * 0.78, notes: last });
    }
    return out;
  }

  function schedule() {
    while (queue.length < 2) queue.push(make());
    const c = queue.shift(); queue.push(make());
    const dur = Math.max(3, O.secs * (c.beats / 4));
    const ms = c.grip ? moments(c, dur) : [{ at: 0, notes: [] }];
    ms.forEach((m, i) => {
      const at = t + m.at;
      voices.set(m.notes.map((n) => n.midi), at, { stagger: i === 0 ? Math.min(1.6, dur * 0.12) : 0.3 });
      later(at, () => ui.show({ c, notes: m.notes, next: queue[0], first: i === 0 }));
    });
    if (O.narr !== 'off') {
      const g = words(c, prevChord);
      later(t + 0.5, () => ui.caption(g.map((x) => x.join(' ')), c));
      V.say(g, t + 0.9, { vol: O.vvol });
    } else later(t + 0.5, () => ui.caption([], c));
    prevChord = c;
    t += dur;
  }
  function later(at, fn) { const id = setTimeout(fn, Math.max(0, (at - ctx().currentTime) * 1000)); timers.push(id); }
  function pump() {
    if (!alive || paused) return;
    while (t < ctx().currentTime + 0.6) schedule();
    timer = setTimeout(pump, 120);
  }
  pump();
  return {
    stop() { alive = false; clearTimeout(timer); timers.forEach(clearTimeout); V.hush(); voices.releaseAll(ctx().currentTime, 2); },
    pause(p) {
      paused = p;
      if (p) { clearTimeout(timer); timers.forEach(clearTimeout); timers = []; V.hush(); }
      else { t = ctx().currentTime + 0.3; pump(); }
    },
    get paused() { return paused; },
  };
}
export { roleOf };
