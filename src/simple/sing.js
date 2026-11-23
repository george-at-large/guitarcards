// Simple's Sing: a root (droned if you like), a mode, and a string of degree numbers up to the 13th. Sing them first,
// then play them, in that mode. The root is either low (sing and play above it) or high (go down from it).
// The structure and the answer stay hidden until you ask; ▶ plays the answer to check yourself.
import * as T from '../theory.js';
import * as A from '../audio.js';
import { esc } from '../fundamentals/core.js';
import { MODE_DEFAULT, scaleName, parent, formula, steps, colour } from '../fundamentals/scaledata.js';

const MAJOR = ['ionian', 'dorian', 'phrygian', 'lydian', 'mixolydian', 'aeolian', 'locrian'];
const SETS = [['major', 'The 7 major modes'], ['core', 'Modes to know (13)'], ...MODE_DEFAULT.map((id) => [id, scaleName(id)])];
const KEYS = [['any', 'Any root'], ...['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'].map((k, i) => [String(i), T.pretty(k)])];
const pick = (a) => a[Math.floor(Math.random() * a.length)];

// ---------- spelling: the root name that gives the cleanest scale ----------
const NAMES = [['C'], ['Db', 'C#'], ['D'], ['Eb', 'D#'], ['E'], ['F'], ['F#', 'Gb'], ['G'], ['Ab', 'G#'], ['A'], ['Bb', 'A#'], ['B']];
const clean = (n) => (Math.abs(n.acc) > 1 || ['Cb', 'Fb', 'E#', 'B#'].includes(T.noteName(n)) ? T.enharmonic(n) : n);
const ivsOf = (id) => T.getScale(id).labels || T.getScale(id).ivs;
function spell(pc, id) {
  let best = null, cost = Infinity;
  for (const nm of NAMES[pc]) {
    const r = T.parseNote(nm);
    const notes = ivsOf(id).map((iv) => T.transpose(r, iv));
    const c = notes.reduce((s, n) => s + Math.abs(n.acc) * (Math.abs(n.acc) > 1 ? 4 : 1), 0) + (nm.length > 1 ? 0.5 : 0);
    if (c < cost) { cost = c; best = { root: r, notes: notes.map(clean) }; }
  }
  return best;
}

// ---------- the degrees: over a low root 1–7, 8, 9, 11, 13; under a high root down to the octave below ----------
function slots(id, dir, far) {
  const iv = T.getScale(id).ivs, lab = T.getScale(id).labels;
  const se = (i) => T.intervalSemis(iv[i]) % 12;
  const show = (i) => T.prettyIv(iv[i]) + (lab && lab[i] !== iv[i] ? ` (${T.prettyIv(lab[i])})` : '');
  if (dir === 'under') {
    return [{ n: '1', semis: 0, i: 0, iv: '1' }, ...[6, 5, 4, 3, 2, 1].map((i) => ({ n: String(i + 1), semis: se(i) - 12, i, iv: show(i) })), { n: '1', low: true, semis: -12, i: 0, iv: '1' }];
  }
  const out = [0, 1, 2, 3, 4, 5, 6].map((i) => ({ n: String(i + 1), semis: se(i), i, iv: show(i) }));
  out.push({ n: '8', semis: 12, i: 0, iv: '1' });
  if (far) [[1, '9'], [3, '11'], [5, '13']].forEach(([i, n]) => out.push({ n, semis: 12 + se(i), i, iv: show(i) }));
  return out;
}
// a singable line: no repeats, no leap bigger than a major 6th, no bouncing between two notes, fresh notes first
function line(sl, len) {
  const out = [pick(sl.filter((s) => Math.abs(s.semis) <= 7))];
  while (out.length < len) {
    const last = out[out.length - 1], back = out[out.length - 2];
    const near = sl.filter((s) => s !== last && Math.abs(s.semis - last.semis) <= 9);
    const notBack = near.filter((s) => s !== back);
    const fresh = notBack.filter((s) => !out.includes(s));
    out.push(pick(fresh.length && Math.random() < 0.8 ? fresh : notBack.length ? notBack : near));
  }
  return out;
}
export function makeSing(st) {
  const pool = st.set === 'major' ? MAJOR : st.set === 'core' ? MODE_DEFAULT : [st.set];
  const id = pick(pool);
  const pc = st.key === 'any' ? Math.floor(Math.random() * 12) : Number(st.key);
  const dir = st.reg === 'any' ? pick(['over', 'under']) : st.reg;
  const sp = spell(pc, id);
  const rootMidi = dir === 'over' ? 40 + ((pc - 4 + 12) % 12) : 57 + ((pc - 9 + 12) % 12);
  const seq = line(slots(id, dir, st.range === '13'), st.len);
  return { id, pc, dir, root: sp.root, notes: sp.notes, rootMidi, seq };
}

// ---------- the screen ----------
export function mountSing(root, S, save, { onPage } = {}) {
  S.sing = Object.assign({ set: 'core', key: 'any', reg: 'any', len: 5, range: '13', drone: false }, S.sing || {});
  const st = S.sing;
  let q = makeSing(st), showStruct = false, showAns = false, droning = false;
  const nm = (n) => T.noteName(n, true);
  const acc = (x) => esc(x).replace(/[♭♯]/g, (m) => `<span class="acc">${m}</span>`); // the serif's own ♭ sits loose
  const drone = () => { if (st.drone) { A.unlockAudio(); A.startDrone(q.rootMidi, false); droning = true; } else { A.stopDrone(); droning = false; } };
  const hear = (withLine) => {
    A.unlockAudio();
    const c = A.audioCtx(), t = c.currentTime + 0.05;
    A.pluck(q.rootMidi, t, { vel: 0.85, dur: 1.2 });
    if (withLine) q.seq.forEach((s, i) => A.pluck(q.rootMidi + s.semis, t + 0.9 + i * 0.62, { vel: 0.75, dur: 0.55 }));
  };
  const opt = (v, l, cur) => `<option value="${esc(v)}" ${String(cur) === String(v) ? 'selected' : ''}>${esc(l)}</option>`;
  const render = () => {
    const mode = `${nm(q.root)} ${scaleName(q.id)}`;
    const over = q.dir === 'over';
    root.querySelector('.sbody').innerHTML = `
      <div class="seg sub"><button data-page="deg" class="on">Degrees</button><button data-page="neck">On the neck</button></div>
      <div class="sroot">
        <div class="snote">${acc(nm(q.root))}<span class="sreg ${over ? 'lo' : 'hi'}">${over ? 'low' : 'high'}</span></div>
        <div class="sdir">${over ? 'The root is low: sing and play <b>above</b> it' : 'The root is high: sing and play <b>below</b> it'}</div>
      </div>
      <div class="smode"><b>${acc(mode)}</b><span>${esc(parent(q.id))}</span></div>
      ${showStruct ? `<div class="sstruct"><div class="f">${esc(formula(q.id))}</div><div>${esc(steps(q.id))}</div><div>${esc(colour(q.id))}</div><div class="sn">${q.notes.map(nm).map(esc).join(' ')}</div></div>` : ''}
      <div class="sseq">${q.seq.map((s) => `<div class="sd"><b>${s.n}${s.low ? '<i>↓</i>' : ''}</b>${showAns ? `<span>${esc(s.iv)}</span><em>${esc(nm(q.notes[s.i]))}</em>` : ''}</div>`).join('')}</div>
      <div class="row sbtns">
        <button id="sStruct" class="${showStruct ? 'on' : ''}">Structure</button>
        <button id="sAns" class="${showAns ? 'on' : ''}">Answer</button>
        <button id="sHear">▶ Hear</button>
      </div>
      <div class="row big"><button id="sNext">Next ▶</button></div>
      <div class="row toggles">
        <button id="sRoot">▶ Root</button>
        <button id="sDrone" class="${st.drone ? 'on' : ''}" aria-pressed="${st.drone}">Drone ${esc(nm(q.root))}</button>
      </div>`;
    root.querySelector('.sopts').innerHTML = `
      <label><span>Modes</span><select id="sSet">${SETS.map(([v, l]) => opt(v, l, st.set)).join('')}</select></label>
      <label><span>Root</span><select id="sKey">${KEYS.map(([v, l]) => opt(v, l, st.key)).join('')}</select></label>
      <label><span>Register</span><select id="sReg">${[['any', 'High or low'], ['over', 'Low root: go above'], ['under', 'High root: go below']].map(([v, l]) => opt(v, l, st.reg)).join('')}</select></label>
      <label><span>Notes</span><select id="sLen">${[3, 4, 5, 6, 8].map((n) => opt(n, `${n} notes`, st.len)).join('')}</select></label>
      <label><span>Range</span><select id="sRange">${[['8', 'Up to the octave'], ['13', 'Up to the 13th']].map(([v, l]) => opt(v, l, st.range)).join('')}</select></label>`;
    const $ = (id) => root.querySelector('#' + id);
    root.querySelectorAll('[data-page]').forEach((b) => (b.onclick = () => onPage?.(b.dataset.page)));
    $('sStruct').onclick = () => { showStruct = !showStruct; render(); };
    $('sAns').onclick = () => { showAns = !showAns; render(); };
    $('sHear').onclick = () => hear(true);
    $('sRoot').onclick = () => hear(false);
    $('sNext').onclick = () => next();
    $('sDrone').onclick = () => { st.drone = !st.drone; save(); drone(); render(); };
    const set = (id, k, num) => { $(id).onchange = (e) => { st[k] = num ? Number(e.target.value) : e.target.value; save(); next(); }; };
    set('sSet', 'set'); set('sKey', 'key'); set('sReg', 'reg'); set('sLen', 'len', true); set('sRange', 'range');
  };
  const next = () => {
    q = makeSing(st); showStruct = false; showAns = false;
    render();
    if (st.drone) drone(); else hear(false); // the new root, so you can find it
  };
  render();
  return {
    wake: () => { if (st.drone && !droning) drone(); }, // sound can only start from a tap on iOS
    leave: () => { A.stopDrone(); droning = false; },
  };
}
