// The Progression Exploder: a progression, and a slider from plain to fully exploded. Each notch adds one change
// (richer chords, diatonic subs, borrowed chords, secondary dominants, two-fives, passing diminished, tritone subs,
// chromatic approaches and mediants…); versions are different paths. The bars keep their meter: each chord sits where
// it falls in its bar, as wide as it lasts. Tap a chord to hear it and see it on the neck, and flip through every
// voicing of it; Play runs the progression in time.
import * as T from '../theory.js';
import * as A from '../audio.js';
import * as L from '../caged/library.js';
import * as Hc from '../caged/harmony.js';
import * as E from './engine.js';
import { neckSVG } from './neck.js';
import { explodeSteps, TIERS } from './reharm.js';
import { grips, choose, roleOf } from './ambient.js';
import { PACKS, GROUPS, itemOf } from './packs.js';
import { degText, ROLE } from './words.js';
import { KIND } from './harm.js';
import * as Gr from '../caged/grips.js';
import { formsFor, STUDY_ITEMS } from './forms.js';

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const fmt = (s) => esc(T.pretty(String(s ?? '')));
const KEYS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
const MKEYS = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'G#', 'A', 'Bb', 'B'];
const TIER_COL = ['var(--ink)', 'var(--tx)', 'var(--t3)', 'var(--t5)', 'var(--t7)', 'var(--gold)'];
const IVK = (iv) => KIND(String(iv).replace(/^(b|#)?(2|4|6)$/, (m, a, n) => (n === '6' ? (a || '') + '6' : (a || '') + { 2: '9', 4: '11' }[n])));
const INV = ['root position', 'first inversion', 'second inversion', 'third inversion'];
const INV_OF = { 1: 0, 3: 1, b3: 1, 2: 1, 4: 1, 5: 2, b5: 2, '#5': 2, 7: 3, b7: 3, bb7: 3, 6: 3 };

// ---------- voice leading: ways to choose every voicing of a progression together ----------
export const VL_MODES = [['off', 'Off', 'Each chord’s voicing chosen near the last one.'],
  ['smooth', 'Smoothest', 'The least total movement from chord to chord.'],
  ['common', 'Common tones', 'Notes the chords share are held on the same pitch.'],
  ['guide', 'Guide tones', 'The 3rds and 7ths move by step into the next chord’s 3rds and 7ths.'],
  ['contrary', 'Contrary', 'The top and the bass move in opposite directions.'],
  ['top', 'Melodic top', 'The top note moves by step: a melody on top.'],
  ['bass', 'Bass line', 'Inversions chosen so the bass moves by step.'],
  ['parallel', 'Parallel', 'The same shape moved as a block: planing.'],
  ['strings', 'Same string set', 'Every voicing on one set of strings, changing sets only when it must.'],
  ['tenths', 'Outer 10ths', 'The bass and the top a tenth apart, moving together.'],
  ['heldtop', 'Held top', 'The top note stays put as long as it can while the harmony moves under it.'],
  ['heldbass', 'Held bass', 'The bass stays put as long as it can while the harmony moves over it.']];
const isGuide = (iv) => /^(b)?3$|^(b|bb)?7$/.test(iv) || iv === '6';
const mids = (g) => g.notes.map((n) => n.midi).sort((a, b) => a - b);
function smoothCost(a, b) {
  const A = mids(a), B = mids(b);
  return (B.reduce((s2, x) => s2 + Math.min(...A.map((y) => Math.abs(x - y))), 0) / B.length) + (A.reduce((s2, y) => s2 + Math.min(...B.map((x) => Math.abs(x - y))), 0) / A.length) * 0.6;
}
function vlCost(mode, a, b) {
  const A = mids(a), B = mids(b), sm = smoothCost(a, b);
  const db = B[0] - A[0], dt = B[B.length - 1] - A[A.length - 1];
  const thin = Math.max(0, 4 - B.length) * 1.2;
  if (mode === 'smooth') return sm + thin;
  if (mode === 'common') return sm * 0.5 - B.filter((x) => A.includes(x)).length * 2 + thin;
  if (mode === 'guide') {
    let good = 0;
    for (const n of a.notes.filter((x) => isGuide(x.iv))) if (b.notes.some((m) => isGuide(m.iv) && Math.abs(m.midi - n.midi) <= 2)) good++;
    return sm * 0.4 - good * 2.5 + (b.notes.some((m) => isGuide(m.iv)) ? 0 : 2) + thin;
  }
  if (mode === 'contrary') return (db && dt ? (Math.sign(db) !== Math.sign(dt) ? -4 : 2.5) : 1) + Math.max(0, Math.abs(dt) - 4) * 0.8 + Math.max(0, Math.abs(db) - 7) * 0.5 + sm * 0.3 + thin;
  if (mode === 'top') { const d = Math.abs(dt); return (d === 0 ? 0.6 : d <= 2 ? 0 : (d - 2) * 1.5) + sm * 0.3 + thin; }
  if (mode === 'bass') { const d = Math.abs(db); return (d === 0 ? 1 : d <= 2 ? 0 : (d - 2) * 1.5) + sm * 0.3 + thin; }
  if (mode === 'strings') {
    const sa = a.notes.map((n) => n.string).sort().join(), sb = b.notes.map((n) => n.string).sort().join();
    const shared = b.notes.filter((n) => a.notes.some((m) => m.string === n.string)).length;
    return (sa === sb ? -3 : (b.notes.length - shared) * 1.2) + (b.notes.length !== a.notes.length ? 1 : 0) + sm * 0.4 + thin;
  }
  if (mode === 'tenths') { const iv = B[B.length - 1] - B[0], tenth = iv === 15 || iv === 16 || iv === 27 || iv === 28; const was = A[A.length - 1] - A[0]; return (tenth ? -2.5 : 1.2) + (tenth && (was === 15 || was === 16) ? -0.8 : 0) + Math.max(0, Math.abs(db) - 5) * 0.4 + sm * 0.3 + thin; }
  if (mode === 'heldtop') { const d = Math.abs(dt); return (d === 0 ? -3 : d <= 2 ? 0 : d) + sm * 0.3 + thin; }
  if (mode === 'heldbass') { const d = Math.abs(db); return (d === 0 ? -3 : d <= 2 ? 0 : d) + sm * 0.3 + thin; }
  if (mode === 'parallel') {
    const ia = A.slice(1).map((x, i) => x - A[i]).join(), ib = B.slice(1).map((x, i) => x - B[i]).join();
    const strings = a.notes.map((n) => n.string).join() === b.notes.map((n) => n.string).join();
    return (ia === ib ? -3 : 2) - (strings ? 1 : 0) + Math.abs(db) * 0.05 + thin;
  }
  return sm;
}
// the best path through every chord's voicings (dynamic programming), inside a CAGED position if one is set
function vlPath(cands, mode, w, inWin) {
  const C = cands.map((list) => { const inside = w ? list.filter((g) => inWin(g, w)) : list; return (inside.length ? inside : list).slice(0, 36); });
  if (C.some((c) => !c.length)) return null;
  let prev = C[0].map((g) => ({ cost: Math.max(0, 4 - g.notes.length), back: -1 }));
  const backs = [prev];
  for (let k = 1; k < C.length; k++) {
    const cur = C[k].map((g) => { let best = Infinity, bi = 0; C[k - 1].forEach((h, hi) => { const c = prev[hi].cost + vlCost(mode, h, g); if (c < best) { best = c; bi = hi; } }); return { cost: best, back: bi }; });
    backs.push(cur); prev = cur;
  }
  let bi = prev.reduce((b, x, i) => (x.cost < prev[b].cost ? i : b), 0);
  const path = [];
  for (let k = C.length - 1; k >= 0; k--) { path.unshift(C[k][bi]); bi = backs[k][bi].back; }
  return path;
}
// how the voices moved from one voicing to the next: the bass, the top, and the guide tones
function moves(a, b) {
  const A = [...a.notes].sort((x, y) => x.midi - y.midi), B = [...b.notes].sort((x, y) => x.midi - y.midi);
  const dir = (d) => (d === 0 ? 'holds' : `${d < 0 ? 'falls' : 'rises'} ${Math.abs(d) <= 2 ? (Math.abs(d) === 1 ? 'a half step' : 'a step') : Math.abs(d) <= 4 ? 'a third' : Math.abs(d) === 5 ? 'a fourth' : Math.abs(d) === 7 ? 'a fifth' : `${Math.abs(d)} half steps`}`);
  const out = [{ who: 'Top', a: A[A.length - 1], b: B[B.length - 1] }, { who: 'Bass', a: A[0], b: B[0] }];
  for (const n of A.filter((x) => isGuide(x.iv) && x !== A[0] && x !== A[A.length - 1])) {
    const m = B.filter((x) => Math.abs(x.midi - n.midi) <= 2).sort((x, y) => Math.abs(x.midi - n.midi) - Math.abs(y.midi - n.midi))[0];
    if (m) out.push({ who: 'Inner', a: n, b: m });
  }
  return out.map((o) => ({ ...o, text: `the ${degText(o.a.iv)} ${dir(o.b.midi - o.a.midi)} to the ${degText(o.b.iv)}`, d: o.b.midi - o.a.midi }));
}

// every progression, in order (the packs' order), for ‹ › and 🎲
const BASE_LIST = (() => { const seen = new Set(), out = []; for (const p of PACKS) for (const it of p.items) if (!seen.has(it.id)) { seen.add(it.id); out.push({ id: it.id, name: it.name, note: it.note, pack: p.name }); } return out; })();
const LIST_ALL = () => [...BASE_LIST, ...STUDY_ITEMS.map((x) => ({ id: x.id, name: x.name, note: x.note, pack: 'Studies' }))];
const itemFor = (id) => { if (String(id).startsWith('st-')) { const t = STUDY_ITEMS.find((x) => x.id === id); if (t) return t; } const it = PACKS.flatMap((p) => p.items).find((x) => x.id === id); return it ? { ...itemOf(it), name: it.name, note: it.note } : L.byId(id); };

export function exploder(app, { S, save, back, unlock }) {
  const O = S.x;
  let item = null, states = [], voices = null, sel = 0, vIdx = 0, voicingsOf = [], playing = null, chosen = {}, pathCache = null, led = {}, shown = null;
  const tonic = () => T.parseNote((item?.minor ? MKEYS : KEYS)[O.key === 'random' ? (O.keyPc ?? 0) : KEYS.indexOf(O.key)]);
  function load(id) {
    O.prog = id || O.prog || BASE_LIST[0].id;
    item = itemFor(O.prog);
    states = explodeSteps(item, O.version, 5);
    if (O.level > states.length - 1) O.level = states.length - 1;
    chosen = {}; led = {}; sel = 0; vIdx = 0;
    save();
  }
  const slots = () => states[Math.min(O.level, states.length - 1)].slots;
  const SHAPES = ['C', 'A', 'G', 'E', 'D'];
  const win = () => (O.shape && O.shape !== 'auto' ? Gr.positionOf(tonic(), O.shape) : null);
  const inWin = (g, w) => g.notes.every((n) => (n.fret === 0 ? w.lo <= 1 : n.fret >= w.lo - 1 && n.fret <= w.hi + 1));
  function chordOf(x) {
    const tn = tonic(), root = Hc.spell(tn, x.spec.iv), q = x.spec.q;
    return { root, rootPc: T.notePc(root), q, spec: x.spec, rn: Hc.label(x.spec, q, x.spec.bass), name: Hc.slashName(root, q, x.spec.bass), role: roleOf(x.spec, q, !!item.minor) };
  }
  // every way to hold a chord: each chord tone in the bass, everywhere on the neck
  function allVoicings(c) {
    const ivs = T.getChord(c.q).ivs, basses = c.spec.bass ? [c.spec.bass] : [...new Set(ivs.filter((iv) => !/^(b|#)?(9|11|13)$/.test(iv)))];
    const out = [], seen = new Set();
    for (const g of formsFor(c.root, c.q)) { const k = g.notes.map((n) => `${n.string}:${n.fret}`).join(' '); if (seen.has(k)) continue; seen.add(k); const fr = g.notes.filter((n) => n.fret > 0).map((n) => n.fret); out.push({ ...g, bass: g.notes[0].iv, at: fr.length ? fr.reduce((a, f) => a + f, 0) / fr.length : 0 }); }
    for (const b of basses) for (const g of grips(c.rootPc, c.q, b)) {
      const k = g.notes.map((n) => `${n.string}:${n.fret}`).join(' ');
      if (seen.has(k)) continue; seen.add(k);
      const fr = g.notes.filter((n) => n.fret > 0).map((n) => n.fret);
      out.push({ ...g, bass: b, at: fr.length ? fr.reduce((a, f) => a + f, 0) / fr.length : 0 });
    }
    // one per inversion per area of the neck: the fullest, most compact grip there
    const best = new Map();
    for (const g of out) {
      const fr = g.notes.filter((n) => n.fret > 0).map((n) => n.fret), span = fr.length ? Math.max(...fr) - Math.min(...fr) : 0;
      const k = `${g.form ? 'f' : ''}${INV_OF[g.bass] ?? g.bass}:${Math.round(g.at / 2.5)}:${g.notes.some((n) => n.fret === 0) ? 'o' : 'f'}`, sc = g.notes.length * 2 - span - (g.notes[g.notes.length - 1].iv === '1' ? 1 : 0);
      if (!best.has(k) || sc > best.get(k).sc) best.set(k, { ...g, sc });
    }
    const w = win(), list = [...best.values()].sort((a, b) => a.at - b.at || (INV_OF[a.bass] ?? 0) - (INV_OF[b.bass] ?? 0));
    return w ? [...list.filter((g) => inWin(g, w)), ...list.filter((g) => !inWin(g, w))].map((g) => ({ ...g, inside: inWin(g, w) })) : list;
  }
  // the voice-led path for the progression as it stands (cached until something changes)
  function path() {
    if (!O.vl || O.vl === 'off') return null;
    const key = `${O.prog}|${O.version}|${O.level}|${O.vl}|${O.shape}|${O.key}|${O.keyPc}`;
    if (pathCache?.key !== key) pathCache = { key, path: vlPath(slots().map((x) => allVoicings(chordOf(x))), O.vl, win(), inWin) };
    return pathCache.path;
  }
  async function sound(notes) {
    await unlock();
    voices ||= E.voices(S.inst);
    voices.set(notes.map((n) => n.midi), A.audioCtx().currentTime + 0.03, { stagger: 0.04 });
  }

  // ---------- drawing ----------
  function timeline() {
    const sl = slots();
    const bars = [];
    let beat = 0;
    sl.forEach((x, i) => { const b = Math.floor(beat / 4 + 1e-6); (bars[b] ||= []).push({ x, i, at: beat - b * 4 }); beat += x.beats; });
    return `<div class="xbars">${bars.map((bar, bi) => `<div class="xbar"><span class="xbn">${bi + 1}</span>${[1, 2, 3].map((t) => `<i class="xtick" style="left:${t * 25}%"></i>`).join('')}${bar.map(({ x, i, at }) => {
      const c = chordOf(x);
      return `<button class="xch ${i === sel ? 'sel' : ''} ${playing?.k === i ? 'play' : ''} ${x.changed ? 'chg' : ''}" data-x="${i}" style="left:${at * 25}%;width:${x.beats * 25}%;--tc:${x.changed ? TIER_COL[x.tier] : 'var(--ink)'}"><b>${fmt(c.rn)}</b><small>${fmt(c.name)}</small></button>`;
    }).join('')}</div>`).join('')}</div>`;
  }
  // the voice-led lines: the bass and the top through the progression, inner notes as dots, spaced by time
  function linesSVG() {
    const pth = path();
    if (!pth) return '';
    const sl = slots(), total = sl.reduce((a, x) => a + x.beats, 0), W = 340, H = 92;
    let beat = 0; const xs = sl.map((x) => { const at = beat + x.beats / 2; beat += x.beats; return 8 + (at / total) * (W - 16); });
    const all = pth.flatMap((g) => mids(g)), lo = Math.min(...all) - 1, hi = Math.max(...all) + 1, y = (m) => 6 + ((hi - m) / (hi - lo)) * (H - 12);
    const tops = pth.map((g) => mids(g).slice(-1)[0]), bass = pth.map((g) => mids(g)[0]);
    const dots = pth.flatMap((g, i) => mids(g).slice(1, -1).map((m) => `<circle cx="${xs[i]}" cy="${y(m)}" r="1.8" class="vin"/>`)).join('');
    const line = (arr, cls) => `<polyline points="${arr.map((m, i) => `${xs[i]},${y(m)}`).join(' ')}" class="${cls}"/>${arr.map((m, i) => `<circle cx="${xs[i]}" cy="${y(m)}" r="${i === sel ? 4 : 2.6}" class="${cls}d"/>`).join('')}`;
    return `<svg class="xlines" viewBox="0 0 ${W} ${H}">${dots}${line(bass, 'vb')}${line(tops, 'vt')}</svg><p class="xvlnote">${esc(VL_MODES.find(([m]) => m === O.vl)[2])} <span class="vt">top</span> <span class="vb">bass</span></p>`;
  }
  function explainHTML() {
    if (!O.explain) return '';
    const st = states.slice(1, O.level + 1);
    if (!st.length) return '<p class="xnote">As written. Move the slider to explode it.</p>';
    const keyName = T.noteName(tonic(), true) + (item.minor ? ' minor' : '');
    return `<ol class="xwhy">${states.slice(1, O.level + 1).map((s, j) => {
      const prevState = states[j], c = s.change, at = c.at ?? 0, sl = s.slots;
      const nm = (x) => (x ? chordOf(x).name : '');
      const here = sl[at], after = sl[(at + 1) % sl.length], before = prevState.slots[at];
      const eg = c.swap ? `${nm(here)} in place of ${nm(before)}, then ${nm(after)}` : c.ins ? `${c.ins.length > 1 ? `${nm(sl[at])} ${nm(sl[at + 1])}` : nm(here)} → ${nm(sl[(at + c.ins.length) % sl.length])}` : `${nm(sl[(at - 1 + sl.length) % sl.length])} → ${nm(here)}`;
      return `<li style="--tc:${TIER_COL[s.tier]}"><span>${esc(TIERS[s.tier - 1].name)}</span> <b>${fmt(c.why)}</b>${c.detail ? `<p>${fmt(c.detail)}</p>` : ''}<em>In ${fmt(keyName)}: ${fmt(eg)}</em></li>`;
    }).join('')}</ol>`;
  }
  function chordPanel() {
    const sl = slots(), x = sl[sel];
    if (!x) return '';
    const c = chordOf(x);
    voicingsOf = allVoicings(c);
    if (vIdx >= voicingsOf.length) vIdx = 0;
    const pth = path(), auto = !chosen[sel] && vIdx === 0;
    const ledV = led[sel] && voicingsOf.find((g) => g.notes.map((n) => n.midi).join() === led[sel]);
    const v = (auto && pth ? pth[sel] : null) || (chosen[sel] && voicingsOf.find((g) => g.notes.map((n) => n.midi).join() === chosen[sel])) || (auto ? ledV : null) || voicingsOf[vIdx];
    shown = v;
    const notes = v ? v.notes.map((n) => ({ ...n, label: degText(n.iv), kind: IVK(n.iv) })) : [];
    const fr = v ? v.notes.filter((n) => n.fret > 0).map((n) => n.fret) : [];
    const w = win();
    return `<div class="xpanel"><div class="neckcol">${neckSVG(notes, { band: w ? [w.lo, w.hi] : null })}</div><div class="info">
      <div class="chord"><div class="rn">${fmt(c.rn)}</div><div class="sym">${fmt(c.name)}</div><div class="say">${esc(c.role && ROLE[c.role] ? ROLE[c.role] : '')}</div></div>
      ${x.changed ? `<div class="xchg" style="--tc:${TIER_COL[x.tier]}"><b>${fmt(x.changed)}</b>${x.detail ? `<p>${fmt(x.detail)}</p>` : ''}</div>` : ''}
      <div class="xstep"><button data-act="cprev" aria-label="Previous chord">‹ chord</button><span>${sel + 1} of ${sl.length}</span><button data-act="cnext" aria-label="Next chord">chord ›</button></div>
      ${v ? `<div class="xvoice"><button data-act="vprev" aria-label="Previous voicing">‹</button><div><b>${esc(INV[INV_OF[v.bass] ?? 0] || '')}</b>${v.form ? '<em class="formtag">jazz form</em>' : ''}<small>${esc(degText(v.bass))} in the bass · frets ${fr.length ? `${Math.min(...fr)}–${Math.max(...fr)}` : 'open'}${w ? (v.inside ? ` · in the ${O.shape} shape` : ' · outside the shape') : ''} · ${vIdx + 1} of ${voicingsOf.length}</small></div><button data-act="vnext" aria-label="Next voicing">›</button></div>
      ${pth && sel > 0 && pth[sel - 1] ? `<div class="xmoves"><span>From ${fmt(chordOf(slots()[sel - 1]).name)}</span>${moves(pth[sel - 1], v).map((m) => `<p><b>${m.who}</b> ${fmt(m.text)}</p>`).join('')}</div>` : ''}
      <ol class="xnotes">${[...v.notes].sort((a, b) => b.midi - a.midi).map((n) => `<li class="k-${IVK(n.iv)}"><i></i><b>${degText(n.iv)}</b> <span>${fmt(T.noteName(T.transpose(c.root, n.iv), true))}</span></li>`).join('')}</ol>` : '<p class="xnote">No playable grip for this one.</p>'}
    </div></div>`;
  }
  function draw() {
    const tier = states[O.level]?.tier || 0;
    const keyOpts = `<option value="random" ${O.key === 'random' ? 'selected' : ''}>Any key</option>${KEYS.map((k) => `<option value="${k}" ${O.key === k ? 'selected' : ''}>${fmt(k)}</option>`).join('')}`;
    const stOpts = `<optgroup label="Studies">${STUDY_ITEMS.map((it) => `<option value="${it.id}" ${it.id === O.prog ? 'selected' : ''}>${fmt(it.name)}</option>`).join('')}</optgroup>`;
    const progOpts = GROUPS.map((g) => `<optgroup label="${esc(g.name)}">${g.packs.flatMap((p) => (PACKS.find((x) => x.id === p.id)?.items || [])).map((it) => `<option value="${it.id}" ${it.id === O.prog ? 'selected' : ''}>${fmt(it.name)}</option>`).join('')}</optgroup>`).join('') + stOpts;
    app.innerHTML = `
    <header class="bar"><button class="icon" data-act="xback" aria-label="Back">‹</button><h2>Exploder</h2><span></span></header>
    <div class="xpick"><button data-act="xprev" aria-label="Previous progression">‹</button><select id="xprog" class="sel">${progOpts}</select><button data-act="xnext" aria-label="Next progression">›</button><button data-act="xrand" aria-label="Random progression">🎲</button></div>
    <div class="xrow"><select id="xkey" class="sel">${keyOpts}</select><div class="xvers">${[1, 2, 3, 4].map((n) => `<span class="xv ${O.version === n ? 'on' : ''}"><button data-ver="${n}">${n}</button><button data-vplay="${n}" aria-label="Play version ${n}">▶</button></span>`).join('')}<span class="xv ${O.version > 4 ? 'on' : ''}"><button data-ver="more">${O.version > 4 ? O.version : '+'}</button>${O.version > 4 ? `<button data-vplay="${O.version}" aria-label="Play">▶</button>` : ''}</span></div></div>
    <div class="xrow xpos"><span>Position</span>${['auto', ...SHAPES].map((sh) => `<button data-shape="${sh}" class="${O.shape === sh ? 'on' : ''}">${sh === 'auto' ? 'Auto' : sh}</button>`).join('')}<button data-act="xtour" class="${O.tour ? 'on' : ''}" title="Move to the next shape each time round">Tour</button></div>
    <div class="xrow xvl"><span>Voice leading</span><select id="xvl" class="sel">${VL_MODES.map(([m, l]) => `<option value="${m}" ${O.vl === m ? 'selected' : ''}>${esc(l)}</option>`).join('')}</select></div>
    <div class="xslide"><button data-lplay="0" aria-label="Play it plain">▶</button><span>Plain</span><input id="xlevel" type="range" min="0" max="${states.length - 1}" step="1" value="${O.level}"><span>Exploded</span><button data-lplay="max" aria-label="Play it fully exploded">▶</button></div>
    <p class="xlvl">${O.level === 0 ? 'As written' : `${O.level} change${O.level > 1 ? 's' : ''} · up to ${esc(TIERS[Math.max(0, tier - 1)].name.toLowerCase())}`}${item.note ? ` · <i>${fmt(item.note)}</i>` : ''}</p>
    ${timeline()}
    ${linesSVG()}
    <div class="xctl"><button class="xplay ${playing ? 'on' : ''}" data-act="xplay">${playing ? '■ Stop' : '▶ Play'}</button><button class="chip ${O.explain ? 'on' : ''}" data-act="xexplain">Explain</button><span class="xbpm"><button data-act="xslow">−</button>${O.bpm} bpm<button data-act="xfast">+</button></span></div>
    ${explainHTML()}
    ${chordPanel()}`;
    app.querySelector('#xprog').addEventListener('change', (e) => { stop(); load(e.target.value); draw(); });
    app.querySelector('#xvl').addEventListener('change', (e) => { O.vl = e.target.value; save(); chosen = {}; led = {}; vIdx = 0; draw(); });
    app.querySelector('#xkey').addEventListener('change', (e) => { O.key = e.target.value; if (O.key === 'random') O.keyPc = Math.floor(Math.random() * 12); save(); chosen = {}; led = {}; draw(); });
    app.querySelector('#xlevel').addEventListener('input', (e) => { O.level = Number(e.target.value); save(); chosen = {}; led = {}; if (sel >= slots().length) sel = 0; draw(); });
  }

  // ---------- playing ----------
  function stop() { if (playing) { clearTimeout(playing.timer); playing = null; voices?.releaseAll(A.audioCtx().currentTime, 1); } }
  async function play() {
    await unlock();
    voices ||= E.voices(S.inst);
    const sl = slots();
    let prev = null, k = sel;
    playing = { k, timer: null };
    const stepOnce = () => {
      if (!playing) return;
      const x = slots()[k];
      if (!x) { k = 0; return stepOnce(); }
      const c = chordOf(x);
      const vs = allVoicings(c);
      const w = win();
      const pth = path();
      const pick = (chosen[k] && vs.find((g) => g.notes.map((n) => n.midi).join() === chosen[k])) || (pth && pth[k]) || choose(vs, w ? null : prev, w ? w.mid : prev ? prev.notes.filter((n) => n.fret > 0).reduce((s, n, _, a) => s + n.fret / a.length, 0) || 5 : 5, w);
      if (pick) { voices.set(pick.notes.map((n) => n.midi), A.audioCtx().currentTime + 0.02, { stagger: 0.03 }); prev = pick; }
      playing.k = k;
      app.querySelectorAll('.xch').forEach((b) => b.classList.toggle('play', Number(b.dataset.x) === k));
      const dur = (60 / O.bpm) * x.beats * 1000;
      k = (k + 1) % slots().length;
      if (k === 0 && O.tour) { O.shape = SHAPES[(Math.max(0, SHAPES.indexOf(O.shape)) + 1) % 5]; chosen = {}; led = {}; save(); playing.timer = setTimeout(() => { draw(); stepOnce(); }, dur); return; }
      playing.timer = setTimeout(stepOnce, dur);
    };
    stepOnce();
  }

  // go to a chord: unless one is fixed (or the strategy's path or his grip decides), its voicing is the one nearest the
  // voicing on the neck now (inside the CAGED position, if one is set), so clicking through sounds like a progression
  function goTo(k) {
    const from = shown;
    sel = k; vIdx = 0;
    if (!chosen[k]) {
      const x = slots()[k], c = chordOf(x), w = win();
      const list = allVoicings(c), pool = w ? list.filter((g) => inWin(g, w)) : list;
      const near = from ? from.notes.filter((n) => n.fret > 0).reduce((a2, n, _, arr) => a2 + n.fret / arr.length, 0) || 5 : w ? w.mid : 5;
      const g = choose(pool.length ? pool : list, from, w ? w.mid : near, w);
      if (g) led[k] = g.notes.map((n) => n.midi).join();
    }
    draw();
    if (shown && !playing) sound(shown.notes);
  }
  // ---------- events ----------
  app.onclick = async (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    if (b.dataset.x !== undefined) { goTo(Number(b.dataset.x)); return; }
    if (b.dataset.vplay) { stop(); O.version = Number(b.dataset.vplay); states = explodeSteps(item, O.version, 5); if (O.level > states.length - 1) O.level = states.length - 1; save(); chosen = {}; led = {}; sel = 0; await play(); draw(); return; }
    if (b.dataset.lplay) { stop(); O.level = b.dataset.lplay === 'max' ? states.length - 1 : 0; save(); chosen = {}; led = {}; sel = 0; await play(); draw(); return; }
    if (b.dataset.shape) { O.shape = b.dataset.shape; save(); chosen = {}; led = {}; vIdx = 0; draw(); const v = voicingsOf[0]; if (v && !playing) sound(v.notes); return; }
    if (b.dataset.ver) { stop(); O.version = b.dataset.ver === 'more' ? Math.max(5, O.version + 1) : Number(b.dataset.ver); states = explodeSteps(item, O.version, 5); if (O.level > states.length - 1) O.level = states.length - 1; save(); chosen = {}; led = {}; sel = 0; draw(); return; }
    const a = b.dataset.act;
    if (a === 'xback') { stop(); app.onclick = null; back(); return; }
    if (a === 'xprev' || a === 'xnext') { stop(); const i = LIST_ALL().findIndex((p) => p.id === O.prog); load(LIST_ALL()[(i + (a === 'xnext' ? 1 : -1) + LIST_ALL().length) % LIST_ALL().length].id); if (O.key === 'random') O.keyPc = Math.floor(Math.random() * 12); draw(); return; }
    if (a === 'xrand') { stop(); load(LIST_ALL()[Math.floor(Math.random() * LIST_ALL().length)].id); O.version = 1 + Math.floor(Math.random() * 4); states = explodeSteps(item, O.version, 5); O.level = Math.floor(states.length / 2); if (O.key === 'random') O.keyPc = Math.floor(Math.random() * 12); save(); draw(); return; }
    if (a === 'cnext' || a === 'cprev') { goTo((sel + (a === 'cnext' ? 1 : -1) + slots().length) % slots().length); return; }
    if (a === 'vnext' || a === 'vprev') {
      vIdx = (vIdx + (a === 'vnext' ? 1 : -1) + voicingsOf.length) % voicingsOf.length;
      const v = voicingsOf[vIdx]; chosen[sel] = v.notes.map((n) => n.midi).join();
      draw(); sound(v.notes); return;
    }
    if (a === 'xplay') { if (playing) stop(); else await play(); draw(); return; }
    if (a === 'xtour') { O.tour = !O.tour; if (O.tour && O.shape === 'auto') O.shape = 'C'; save(); draw(); return; }
    if (a === 'xexplain') { O.explain = !O.explain; save(); draw(); return; }
    if (a === 'xslow' || a === 'xfast') { O.bpm = Math.max(30, Math.min(160, O.bpm + (a === 'xfast' ? 6 : -6))); save(); draw(); return; }
  };
  if (O.key === 'random' && O.keyPc == null) O.keyPc = Math.floor(Math.random() * 12);
  load(O.prog);
  draw();
  return { stop };
}
