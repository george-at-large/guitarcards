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
import { OPEN, fingerable } from './harm.js';
import { voices as makeVoices } from './engine.js';
import * as Gr from '../caged/grips.js';
import { ROLE, ROLE_SHORT, whyOf, EXTS, EXT_SAY, EXT_INFO, COLOUR, WHY, degWord, degText } from './words.js';
import { PACKS, GROUPS, packById, packSay, itemSay, itemOf } from './packs.js';
import { reharmStream } from './reharm.js';
import * as TGB from './tgbook.js';
import { VOICING_SAY, MELODY_SAY, GUIDE, SPOT_SAY, TENSION_SAY } from './words.js';
import { sourceMode, MODE_SAY, feelLines, FEEL, FEEL_WHY, FEEL_ROLE, FEEL_ROLE_WHY } from './feel.js';

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
  const must = [...by('third'), ...by('seventh'), ...exts.slice(-1), ...by('fifth').filter((x) => x !== '5')]; // the top colour only: more voicings to choose from
  if (bassIv && !must.includes(bassIv)) must.unshift(bassIv);
  return { must: [...new Set(must)] };
}
export function grips(rootPc, q, bassIv = '1') {
  const ivs = T.getChord(q).ivs;
  const pcs = new Map(ivs.map((iv) => [(rootPc + semis(ext(iv))) % 12, iv]));
  const bassPc = (rootPc + semis(ext(bassIv))) % 12;
  const foreign = !pcs.has(bassPc); // a slash chord over a note outside the chord: only the bass plays it
  if (foreign) pcs.set(bassPc, bassIv);
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
        if (foreign && played.slice(1).some((p) => p.midi % 12 === bassPc)) return;
        const first = played[0].s, last = played[played.length - 1].s;
        let gaps = 0; for (let i = first; i <= last; i++) if (cur[i] === null) gaps++;
        if (gaps > 1) return;
        const have = played.map((p) => p.midi % 12);
        if (!mustPc.every((p) => have.includes(p))) return;
        const counts = {}; for (const p of have) counts[p] = (counts[p] || 0) + 1;
        if (Object.entries(counts).some(([p, n]) => n > (Number(p) === rootPc || (played.length >= 6 && Number(p) === (rootPc + 7) % 12) ? 2 : 1))) return;
        const fr = played.filter((p) => p.f > 0).map((p) => p.f);
        if (fr.length && Math.max(...fr) - Math.min(...fr) > 4) return;
        if (!fingerable(played.map((p) => ({ fret: p.f })))) return;
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
// style: close, spread, fourths, cluster, open (open strings); topPc: the melody note that must be on top
export function choose(list, prev, area, win = null, { style = null, topPc = null, prevTop = null } = {}) {
  const score = (g) => {
    const m = g.notes.map((n) => n.midi);
    let c = 0;
    if (style) {
      const ms = [...m].sort((a, b) => a - b), gaps = ms.slice(1).map((x, k) => x - ms[k]), span = ms[ms.length - 1] - ms[0];
      if (style === 'fourths') c += gaps.reduce((s, d) => s + Math.min(Math.abs(d - 5), Math.abs(d - 6) + 0.5), 0) * 1.6;
      if (style === 'cluster') c += gaps.reduce((s, d) => s + (d <= 2 ? -5 : d >= 7 ? 1.5 : 0), 0) - g.notes.filter((n) => n.fret === 0).length;
      if (style === 'open') c -= g.notes.filter((n) => n.fret === 0).length * 2.2 + gaps.filter((d) => d <= 2).length * 1.2;
      if (style === 'close') c += Math.max(0, span - 11) * 0.8 + (g.notes.length < 4 ? 3 : 0);
      if (style === 'spread') c -= span * 0.35 + (g.notes.length >= 5 ? 2 : 0);
    }
    if (topPc != null) {
      const top = Math.max(...m);
      c += top % 12 !== topPc ? 40 : prevTop ? Math.abs(top - prevTop) * 2 : 0;
    }
    if (win) { // stay inside the chosen CAGED position
      for (const n of g.notes) c += n.fret === 0 ? (win.lo > 1 ? 6 : 0) : Math.max(0, win.lo - n.fret, n.fret - win.hi) * 5;
    }
    if (prev) {
      const pm = prev.notes.map((n) => n.midi), k = style ? 0.4 : 1; // a voicing style matters more than moving little
      c += m.reduce((s, x) => s + Math.min(...pm.map((y) => Math.abs(x - y))), 0) / m.length * 1.4 * k;
      c += pm.reduce((s, y) => s + Math.min(...m.map((x) => Math.abs(x - y))), 0) / pm.length * 0.8 * k;
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
// a pack's (or one progression's) chords as written, coloured a little at the higher levels
function colourPack(spec, Lv, next, mi) {
  if (Lv <= 2) return spec.q;
  const opts = Hc.colourOptions(spec.q, spec.iv, { toMinor: next ? Hc.isMinorish(next.q) : false, minorKey: mi });
  return opts.length && Math.random() < (Lv === 3 ? 0.3 : 0.6) ? pick(opts) : spec.q;
}
const shuffle = (a) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
// the melody notes sounding in a window of beats: { at (beats from the window's start), beats, iv, oct }
function melodyIn(mel, b0, b1) {
  const out = []; let b = 0;
  for (const [iv, beats, oct = 0] of mel) { if (b + beats > b0 && b < b1) out.push({ at: Math.max(0, b - b0), beats: Math.min(b + beats, b1) - Math.max(b, b0), iv, oct, starts: b >= b0 }); b += beats; }
  return out.filter((e) => e.starts || e.at === 0);
}
function packStream(O, home) {
  let list;
  const build = () => {
    if (O.src === 'prog') { const item = L.byId(O.prog); list = [{ pack: null, it: { id: item.id, name: item.name, note: item.by } }]; return; }
    const every = PACKS.flatMap((p) => p.items.map((it) => ({ pack: p, it })));
    list = O.pack === 'all' ? every : O.pack === 'random' ? shuffle(every) : (packById(O.pack) || PACKS[0]).items.map((it) => ({ pack: packById(O.pack) || PACKS[0], it }));
  };
  build();
  let li = 0, cur = null, pass = 0, i = 0, keyPc = home, lastPack = null;
  function load() {
    if (li >= list.length) { li = 0; if (O.pack === 'random') build(); }
    const { pack, it } = list[li++];
    const item = itemOf(it);
    const chords = [];
    L.resolve(item).forEach((b) => b.forEach((spec) => chords.push({ spec, beats: 4 / b.length })));
    // a new progression: the same key, or (key: any) a new one a 4th, 5th or step away
    if (O.key === 'random' && cur) keyPc = (keyPc + pick([5, 7, 2, 10, 3, 9])) % 12;
    if (item.home) keyPc = T.notePc(T.parseNote(item.home)); // open strings need their key
    const minor = !!item.minor;
    cur = { pack, it, item, chords, minor, newPack: !!pack && pack !== lastPack, rns: chords.map((x) => Hc.label(x.spec, x.spec.q, x.spec.bass)), tension: chords.map((x) => tensionOf(x.spec, x.spec.q, minor)) };
    // a melody: written out, or a held note restruck on every chord
    cur.mel = item.melody || (item.top ? chords.map((x) => [item.top, x.beats, 0]) : null);
    cur.stage = cur.mel ? 'alone' : null;
    lastPack = pack; pass = 0; i = 0;
  }
  load();
  return {
    skip() { if (O.src !== 'prog') { i = cur.chords.length; pass = Math.max(pass, O.loops); } else { i = 0; pass = 0; } }, // the next next() moves on
    next() {
      const key = { off: (keyPc - home + 12) % 12, minor: cur.minor };
      if (cur.mel) { // a melody progression: the melody alone, then in time with the chords, then slowly, chord by chord
        if (cur.stage === 'alone') {
          cur.stage = 'time'; i = 0;
          const total = cur.mel.reduce((a, n) => a + n[1], 0);
          return { silent: true, spec: cur.chords[0].spec, key, beats: total, ann: [], idx: -1, prog: cur, melody: melodyIn(cur.mel, 0, total), say: 'The melody alone.', intro: { pack: cur.newPack ? cur.pack : null, it: cur.it } };
        }
        if (i >= cur.chords.length) { i = 0; if (cur.stage === 'time') cur.stage = 'slow'; else { pass++; if (O.src !== 'prog' && pass >= O.loops) { load(); return this.next(); } cur.stage = 'time'; } }
        const x = cur.chords[i], b0 = cur.chords.slice(0, i).reduce((a, y) => a + y.beats, 0);
        const ev = melodyIn(cur.mel, b0, b0 + x.beats);
        const out = { spec: { ...x.spec }, key, beats: x.beats, ann: [], idx: i, prog: cur, style: cur.item.voicing, label: cur.item.labels?.[i],
          top: ev[0]?.iv, melody: cur.stage === 'slow' ? ev.filter((e) => e.at === 0) : ev, fixed: cur.stage === 'time', quiet: cur.stage === 'time',
          say: i === 0 ? (cur.stage === 'time' ? 'Now with the chords.' : 'Slowly, chord by chord.') : null };
        i++;
        return out;
      }
      if (i >= cur.chords.length) { i = 0; pass++; if (O.src !== 'prog' && pass >= O.loops) load(); }
      const x = cur.chords[i], nx = cur.chords[(i + 1) % cur.chords.length];
      // a comparison pack (its own chart) plays exactly as written
      const out = { spec: { ...x.spec, q: cur.item.chart ? x.spec.q : colourPack(x.spec, O.level, nx.spec, cur.minor) }, key: { off: (keyPc - home + 12) % 12, minor: cur.minor }, beats: x.beats, ann: [], idx: i, prog: cur,
        style: cur.item.voicings ? cur.item.voicings[i] : cur.item.voicing, top: cur.item.top, label: cur.item.labels?.[i], styleSaid: !!cur.item.voicings };
      if (i === 0 && pass === 0) out.intro = { pack: cur.newPack ? cur.pack : null, it: cur.it };
      i++;
      return out;
    },
  };
}

// how tense a chord is in its key: its kind, its colours, its function (for the tension curve)
export function tensionOf(spec, q, minor) {
  const fam = V.familyOf(q), ivs = T.getChord(q).ivs, role = roleOf(spec, q, minor);
  let t = { maj: 0.5, min: 1.2, sus: 1.8, dom: 2.6, hd: 2.8, dim: 3.2, aug: 3, five: 0.6, quartal: 1.4 }[fam] ?? 1;
  if (q === 'maj7' || q === '6' || q === '6/9') t += 0.15;
  t += ivs.filter((iv) => ['b9', '#9', 'b13', '#5', 'b5', '#11'].includes(iv)).length * 0.5 + ivs.filter((iv) => ['9', '11', '13'].includes(iv)).length * 0.15;
  t += { tonic: -0.8, tonicMinor: -0.6, picardy: -0.5, sub: 0.2, super: 0.6, dom: 0.6, secondary: 0.8, tritone: 0.8, passing: 0.6, borrowed: 0.4, subMinor: 0.5, mediantChrom: 0.8, neapolitan: 0.7, lead: 0.6, backdoor: 0.4 }[role] ?? 0;
  if (spec.bass) t += 0.3;
  return Math.max(0, Math.round(t * 10) / 10);
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
  const stream = O.src === 'wander' ? M.meander({ minor: O.minor, level: O.level, grow: false, modulate: O.level >= 3, rhythm: 'varied', bar: 4 }) : O.src === 'meander' ? reharmStream(O, home) : packStream(O, home);
  let quietUntil = 0; // the voice is introducing a progression: no chord names over it
  let prevGrip = null, prevChord = null, t = ctx().currentTime + 0.3, timers = [], queue = [];
  const played = []; let current = null, startedAt = 0;
  const area = 3 + Math.floor(Math.random() * 5);

  // the grip: near the last one, or inside the chosen CAGED position of the chord's key
  function gripFor(c, prev) {
    const win = O.shape && O.shape !== 'auto' ? Gr.positionOf(c.key.tonic, O.shape) : null;
    const near = win ? win.mid : prev ? prev.notes.filter((n) => n.fret > 0).reduce((s, n, _, a) => s + n.fret / a.length, 0) || area : area;
    const o = { style: c.style || null, topPc: c.top ? (T.notePc(c.key.tonic) + semis(c.top)) % 12 : null, prevTop: c.top && prev ? Math.max(...prev.notes.map((n) => n.midi)) : null };
    const his = O.tgv && !c.spec.bass ? TGB.formsFor(c.root, c.q, win ? { lo: win.lo, hi: win.hi } : { lo: 0, hi: 15 }) : [];
    let g = choose(his.length ? his : grips(T.notePc(c.root), c.q, c.spec.bass || '1'), win ? null : prev, near, win, o);
    if (!g) g = choose(grips(T.notePc(c.root), c.q, '1'), win ? null : prev, near, win, o) || choose(grips(T.notePc(c.root), Hc.toSeventh(Hc.toTriad(c.q), c.spec.iv, {}), '1'), prev, near, win);
    return g;
  }
  function make() {
    const it = stream.next();
    const tonic = T.parseNote(keyAt(home + it.key.off, it.key.minor));
    const root = Hc.spell(tonic, it.spec.iv);
    const q = it.spec.q;
    const topIn = it.top && T.getChord(q).ivs.some((iv) => (T.notePc(root) + semis(ext(iv))) % 12 === (T.notePc(tonic) + semis(it.top)) % 12) ? it.top : null;
    const g = it.silent ? null : gripFor({ root, q, spec: it.spec, key: { tonic }, style: it.style, top: topIn }, prevGrip);
    prevGrip = g || prevGrip;
    const key = { tonic, minor: it.key.minor };
    const melody = (it.melody || []).map((e) => { let m = 60 + ((T.notePc(tonic) + semis(e.iv)) % 12); if (m < 65) m += 12; return { ...e, midi: m + 12 * (e.oct || 0) }; });
    const keyLabel = `${T.noteName(tonic, true)} ${key.minor ? 'minor' : 'major'}`;
    const fill = (s) => String(typeof s === 'function' ? s() : s).replace('{key}', keyLabel);
    const c = { spec: it.spec, q, root, key, keyLabel, grip: g, beats: it.beats, rn: Hc.label(it.spec, q), name: Hc.slashName(root, q, it.spec.bass),
      ann: (it.ann || []).map((a) => ({ ...a, text: fill(a.text) })), role: roleOf(it.spec, q, key.minor), bass: it.spec.bass, idx: it.idx, prog: it.prog, intro: it.intro, style: it.style, label: it.label, styleSaid: it.styleSaid, silent: it.silent, fixed: it.fixed, quiet: it.quiet, say: it.say, melody, top: topIn };
    if (O.narr !== 'off') V.prefetch([...words(c, { dry: true }), ...extWords(c, true)]);
    return c;
  }
  // ---------- what the voice says: economical, nothing repeated while it's still obvious ----------
  const said = new Map(); // phrase → the chord count when it was last said
  let count = 0;
  let dryRun = false; // fetching ahead: nothing counts as said
  const fresh = (p, gap) => { const k = said.get(p); if (k !== undefined && count - k < gap) return false; if (!dryRun) said.set(p, count); return true; };
  const isExt = (iv) => EXTS.includes(iv);
  const extsOf = (c) => [...new Set((c.grip?.notes || []).map((n) => n.iv).filter(isExt))].sort((a, b) => EXTS.indexOf(a) - EXTS.indexOf(b));
  // the chord without its extensions (what sounds first when extensions come in later)
  function baseQ(q) {
    const ivs = T.getChord(q).ivs.filter((iv) => !isExt(iv));
    return T.recogniseChord(ivs.length >= 3 ? ivs : [...ivs, '5']) || Hc.toTriad(q);
  }
  function nameWords(c, q = c.q) {
    let w = V.chordWords({ ...c, q }, 'num', true)[0] || [];
    if (w[1] === 'minor') w = [`minor ${w[0]}`, ...w.slice(2)]; // "minor four", as musicians say it
    return w;
  }
  function words(c, { later = false, dry = false } = {}) {
    if (O.narr === 'off') return [];
    dryRun = dry;
    const g = [nameWords(c, later ? baseQ(c.q) : c.q)];
    if (c.styleSaid && c.style && VOICING_SAY[c.style]) g.push([VOICING_SAY[c.style]]);
    if (O.spotlight && c.spot) g.push([c.spot]);
    if (O.tension && c.tcue && fresh(c.tcue + (c.prog ? c.prog.it?.name : ''), 12)) g.push([TENSION_SAY[c.tcue]]);
    if (c.top && c.grip) { const t = [...c.grip.notes].sort((a, b) => b.midi - a.midi)[0]; if (t?.iv) g.push([MELODY_SAY(t.iv)]); }
    const th = O.theory;
    const mode = O.modeSay ? sourceMode(c.spec, c.q, c.key.minor) : null;
    let role = c.role && ROLE_SHORT[c.role];
    if (mode && role && /^from /.test(role)) role = null; // the mode says it more precisely
    if (th >= 1 && role && fresh(role, 6)) g.push([role]);
    if (mode && fresh(MODE_SAY(mode), 6)) g.push([MODE_SAY(mode)]);
    if (th >= 1) for (const a of c.ann) {
      if (/borrowed/.test(a.say) && /parallel/.test(role || '')) continue; // said already, in other words
      if (c.role === 'secondary' && /secondary/.test(a.say)) continue;
      const aw = V.annWords(a.say, c.key);
      if (aw.length && fresh(aw[0].join(' '), 4)) g.push(...aw);
    }
    if (th >= 2) { const w = whyOf(c.role, semis(c.spec.iv)); if (w && fresh(w, 16)) g.push([w]); }
    if (!later && O.extTalk === 'why') for (const e of extsOf(c)) if (fresh(COLOUR[e], 8)) g.push([COLOUR[e]]);
    // Feel: what it feels like (and why), in plain words
    if (O.feel && O.feel !== 'off') for (const l of feelLines(later ? baseQ(c.q) : c.q, c.role, [], O.feel === 'why')) if (fresh(l, 6)) g.push([l]);
    dryRun = false;
    return g;
  }
  // the extensions as they come in (Ext. later)
  function extWords(c, dry = false) {
    if (O.narr === 'off' || O.extTalk === 'off') return [];
    dryRun = dry;
    const out = extsOf(c).flatMap((e) => [[EXT_SAY(e)], ...(O.extTalk === 'why' && fresh(COLOUR[e], 8) ? [[COLOUR[e]]] : [])]);
    dryRun = false;
    return out;
  }

  // inside one chord: the moments its notes change (extensions arriving, motion)
  function moments(c, dur, extAt) {
    const full = c.grip.notes.map((n) => ({ ...n }));
    const hasExt = full.some((n) => isExt(n.iv));
    const out = [];
    if (O.extLater && hasExt && dur >= 4) {
      out.push({ at: 0, notes: full.filter((n) => !isExt(n.iv)) });
      out.push({ at: extAt, notes: full, ext: true });
    } else out.push({ at: 0, notes: full });
    if (O.motion === 'still' || dur < 5 || c.top || c.styleSaid || c.melody?.length) return out; // a demo's voicing (or held melody) stays as it is
    const base = full;
    const top = base[base.length - 1];
    const rootPc = T.notePc(c.root);
    const ivs = T.getChord(c.q).ivs;
    const pcs = new Map(ivs.map((iv) => [(rootPc + semis(ext(iv))) % 12, iv]));
    // a suspension: the 3rd held a step up as a 4th, then resolving (flowing)
    if (O.motion === 'flowing' && !O.extLater && ivs.includes('3') && !c.spec.bass) {
      const thirdIdx = base.findIndex((n) => n.iv === '3');
      if (thirdIdx >= 0 && base[thirdIdx].fret + 1 <= 15) {
        out[0] = { at: 0, notes: base.map((n, i) => (i === thirdIdx ? { ...n, fret: n.fret + 1, midi: n.midi + 1, iv: '4' } : n)) };
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
    const after = out[out.length - 1].at;
    if (alts.length && dur - after > 4) {
      const a = pick(alts);
      const at = Math.max(after + 1.5, dur * (O.motion === 'flowing' ? 0.5 : 0.55));
      out.push({ at, notes: base.map((n) => (n.string === top.string ? a : n)) });
      if (dur > 7 && !others.includes(top.midi % 12)) out.push({ at: Math.max(at + 1.5, dur * 0.8), notes: base });
    }
    return out.filter((m) => m.at < dur);
  }

  function schedule() {
    while (queue.length < 2) queue.push(make());
    const c = queue.shift();
    played.push(c); if (played.length > 400) played.splice(0, 100);
    current = c; startedAt = t; count++;
    if (c.intro) said.clear(); // a new progression: everything may be said again once
    c.spot = null;
    const sameChord = prevChord && T.notePc(prevChord.root) === T.notePc(c.root) && prevChord.q === c.q;
    if (prevChord?.grip && c.grip && !sameChord) {
      // the most telling move: a 7th falling to a 3rd, else any guide tone moving by step (or holding)
      let best = null;
      for (const p of prevChord.grip.notes.filter((n) => GUIDE.includes(n.iv))) for (const n of c.grip.notes) {
        const d = n.midi - p.midi;
        if (Math.abs(d) > 2 || p.iv === n.iv) continue;
        const score = (/7/.test(p.iv) && /3/.test(n.iv) ? 3 : 0) + (d ? 1 : 0) - Math.abs(d) * 0.1;
        if (!best || score > best.score) best = { score, line: SPOT_SAY(p.iv, n.iv, Math.sign(d)) };
      }
      c.spot = best?.line || null;
    }
    // tension: the peak of the progression, and the release after it
    c.tcue = null;
    if (c.prog?.tension && c.idx != null) {
      const ts = c.prog.tension, mx = Math.max(...ts), k = c.idx;
      if (ts[k] === mx && ts.indexOf(mx) === k) c.tcue = 'peak';
      else if (k > 0 && ts[k - 1] === mx && mx - ts[k] >= 1.2) c.tcue = 'release';
    }
    let dur = Math.max(3, O.secs * (c.beats / 4));
    const spb = 60 / (c.prog?.item?.bpm || 72); // a melody's tempo
    if (c.fixed) dur = c.beats * spb; // in time with the melody
    if (c.intro && melV) melV.set([], t);
    // the voice first (its length decides when extensions can come in)
    let speakEnd = t + 0.9, g = [];
    if (c.intro) {
      const lines = c.intro.lines || [...(c.intro.pack ? [packSay(c.intro.pack)] : []), ...itemSay(c.intro.it, O.theory >= 1)];
      const tension = c.prog.tension || (c.prog.specs ? c.prog.specs.map((sp) => tensionOf(sp, sp.q, c.key.minor)) : null);
      c.prog.tension = tension;
      later(t, () => ui.intro({ pack: c.prog.pack, it: c.intro.it, rns: c.prog.rns, changed: c.prog.changed, keyLabel: c.keyLabel, lines, tension }));
      if (O.narr !== 'off') {
        quietUntil = t + 0.4 + lines.join(' ').length * 0.07;
        dur = Math.max(dur, quietUntil - t + 1); // the first chord rings until the introduction is over
        V.say(lines.map((l) => [l]), t + 0.4, { vol: O.vvol }).then((end) => { if (end) quietUntil = end; });
      }
    }
    if (c.silent) { // the melody alone, after the introduction
      const start = Math.max(t + 0.3, (O.narr !== 'off' ? quietUntil : t) + 0.2);
      if (O.narr !== 'off') { V.say([[c.say]], start, { vol: O.vvol }); quietUntil = start + 1.8; }
      const m0 = start + (O.narr !== 'off' ? 1.8 : 0.3);
      later(t, () => ui.show({ c: { ...c, rn: '♪', name: 'The melody, alone' }, notes: [], next: queue[0], first: true }));
      later(start, () => ui.caption([c.say], c));
      playMelody(c.melody, m0, spb, true);
      dur = m0 - t + c.beats * spb + 0.8;
      voices.set([], t);
      prevChord = null;
      t += dur;
      return;
    }
    if (c.say && O.narr !== 'off' && !c.intro) { V.say([[c.say]], t + 0.2, { vol: O.vvol }); later(t, () => ui.caption([c.say], c)); if (c.quiet) quietUntil = t + 1.8; }
    if (c.quiet) { /* in time with the melody: no chord narration */ } else if (O.narr !== 'off' && t >= quietUntil) {
      g = words(c, { later: O.extLater });
      if (c.say) g.unshift([c.say]);
      speakEnd = t + 0.9 + g.flat().join(' ').length * 0.065 + g.length * 0.3;
      dur = Math.max(dur, speakEnd - t + 1.2); // a long description: the chord rings on until it's said
      later(t + 0.5, () => ui.caption(g.map((x) => x.join(' ')), c));
      V.say(g, t + 0.9, { vol: O.vvol });
    } else later(t + 0.5, () => ui.caption([], c));
    if (O.arp === 'named' && O.narr !== 'off' && !c.intro && c.grip) {
      const n = c.grip.notes.filter((x) => !(O.extLater && isExt(x.iv))).length;
      dur = Math.max(dur, (speakEnd - t) + 0.3 + n * 0.95 + 2.5);
    }
    const extAt = Math.min(dur * 0.6, Math.max(dur * 0.3, speakEnd - t + 0.4));
    const ms = c.grip ? moments(c, dur, extAt) : [{ at: 0, notes: [] }];
    // Arpeggio: Named: after the chord's name, each note comes in on its own and is named
    const n0 = ms[0].notes.length;
    const named = O.arp === 'named' && O.narr !== 'off' && !c.intro;
    const nStart = Math.max(0.6, speakEnd - t + 0.25), nGap = Math.min(1.25, (dur * 0.8 - nStart) / Math.max(1, n0));
    const nameNotes = named && nGap >= 0.7;
    ms.forEach((m, i) => {
      const at = t + m.at;
      const arp = O.arp !== 'off' && O.arp && (i === 0 || m.ext);
      const sorted = [...m.notes].sort((a, b) => a.midi - b.midi);
      const boost = O.spotlight ? m.notes.filter((n) => GUIDE.includes(n.iv)).map((n) => n.midi) : null; // the guide tones a little louder
      if (i === 0 && nameNotes) {
        voices.set(sorted.map((n) => n.midi), at, { arp: sorted.map((_, k) => nStart + k * nGap), boost });
        sorted.forEach((n, k) => V.say([[degWord(n.iv)]], at + nStart + k * nGap + 0.05, { vol: O.vvol }));
        later(at + nStart, () => ui.caption([...g.map((x) => x.join(' ')), sorted.map((n) => degText(n.iv)).join(' · ')], c));
      } else voices.set(sorted.map((n) => n.midi), at, arp ? { arp: Math.min(0.55, Math.max(0.22, dur * 0.045)), boost } : { stagger: i === 0 ? Math.min(1.6, dur * 0.12) : 0.3, boost });
      later(at, () => ui.show({ c, notes: m.notes, next: queue[0], first: i === 0, ext: m.ext }));
      if (m.ext) { const ew = extWords(c); if (ew.length && at >= quietUntil) { V.say(ew, at, { vol: O.vvol }); later(at, () => ui.caption(ew.map((x) => x.join(' ')), c)); } }
    });
    // arpeggio: on a long chord, the notes roll again, softly
    if (O.arp === 'on' && c.grip && dur > 8) voices.roll(c.grip.notes.map((n) => n.midi), t + dur * 0.62, Math.min(0.5, dur * 0.04));
    if (c.melody?.length) playMelody(c.melody, t, spb, false);
    prevChord = c;
    t += dur;
  }
  // the melody: its own clear voice, above the chords
  let melV = null;
  function playMelody(evs, start, spb, alone) {
    if (!evs.length) return;
    melV ||= makeVoices('clear');
    for (const e of evs) melV.set([e.midi], start + e.at * spb, { vel: 1.3 });
    const last = evs[evs.length - 1];
    if (alone) melV.set([], start + (last.at + last.beats) * spb);
  }
  function later(at, fn) { const id = setTimeout(fn, Math.max(0, (at - ctx().currentTime) * 1000)); timers.push(id); }
  function pump() {
    if (!alive || paused) return;
    while (t < ctx().currentTime + 0.6) schedule();
    timer = setTimeout(pump, 120);
  }
  pump();
  // jump: drop what's scheduled and play from the head of the queue now
  function jump() {
    clearTimeout(timer); timers.forEach(clearTimeout); timers = [];
    V.hush(); quietUntil = 0;
    t = ctx().currentTime + 0.12;
    voices.cut(t);
    if (!paused) pump();
    else schedule(); // paused: the chord you stepped to sounds and shows, and it stays paused there
  }
  const progStart = (k) => { let s0 = k; while (s0 > 0 && played[s0 - 1].prog === played[k].prog && !played[s0].intro) s0--; return s0; };
  return {
    // back one chord: the one before plays now, then this one again
    prevChord() { if (played.length < 2) return; const cur = played.pop(), prev = played.pop(); queue.unshift(prev, cur); prevChord = null; jump(); },
    nextChord() { jump(); },
    // back to the start of the previous progression (or of this one, if there is none before it)
    prevProg() {
      if (!played.length) return;
      const here = progStart(played.length - 1);
      const from = here > 0 ? progStart(here - 1) : here;
      queue.unshift(...played.splice(from));
      prevChord = null; jump();
    },
    // on to the next progression: chords already queued for this one are dropped
    nextProg() {
      const p = current?.prog;
      while (queue.length && queue[0].prog === p && !queue[0].intro) queue.shift();
      if (!queue.length || (queue[0].prog === p && !queue[0].intro)) { stream.skip?.(); queue.length = 0; }
      prevChord = null; jump();
    },
    // a new CAGED position (or 'auto'): this chord and the queued ones re-voiced, the change heard now
    setShape(sh) {
      O.shape = sh;
      let pg = played.length > 1 ? played[played.length - 2].grip : null;
      if (current) { current.grip = gripFor(current, pg) || current.grip; pg = current.grip; }
      for (const q of queue) { q.grip = gripFor(q, pg) || q.grip; pg = q.grip; }
      prevGrip = pg;
      if (current?.grip && !paused) {
        const now = ctx().currentTime + 0.05;
        voices.set(current.grip.notes.map((n) => n.midi), now, { stagger: 0.6 });
        ui.show({ c: current, notes: current.grip.notes, next: queue[0], first: true });
      }
    },
    canProg: O.src !== 'wander',
    stop() { alive = false; clearTimeout(timer); timers.forEach(clearTimeout); V.hush(); voices.releaseAll(ctx().currentTime, 2); melV?.releaseAll(ctx().currentTime, 1); },
    pause(p) {
      paused = p;
      if (p) { clearTimeout(timer); timers.forEach(clearTimeout); timers = []; V.hush(); }
      else { t = ctx().currentTime + 0.3; pump(); }
    },
    get paused() { return paused; },
  };
}
export { roleOf, GROUPS };
// the details shown under the chord (and in More)
export function details(c) {
  const exts = [...new Set((c.grip?.notes || []).map((n) => n.iv).filter((iv) => EXTS.includes(iv)))];
  return { role: c.role ? ROLE[c.role] : '', why: c.role ? whyOf(c.role, semis(c.spec.iv)) : '', exts: exts.map((e) => ({ e, info: EXT_INFO[e], colour: COLOUR[e] })),
    mode: sourceMode(c.spec, c.q, c.key.minor), feel: feelLines(c.q, c.role, [], false), feelWhy: feelLines(c.q, c.role, [], true).slice(feelLines(c.q, c.role, [], false).length),
    notes: (c.grip?.notes || []).map((n) => ({ iv: n.iv, midi: n.midi })) };
}
