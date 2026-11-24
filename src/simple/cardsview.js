// Simple's Cards: the must-remember harmony, one card at a time. Tap the card for the next one, swipe left or right
// to flick through, ▶ to hear the example. One deck or all of them, in teaching order or shuffled; it remembers
// where you were.
import * as T from '../theory.js';
import * as A from '../audio.js';
import { esc } from '../fundamentals/core.js';
import { DECKS } from './cards.js';
import { exampleSteps, styleOf } from './fingering.js';
import { drillPattern, SEQS } from './drillneck.js';
import { neckSlice } from './neck.js';
import { OPEN } from '../fretboard.js';
import { BUILD } from './build.js';

const ALL = DECKS.flatMap((d) => d.cards.map((c, i) => ({ ...c, deck: d.name, n: i + 1, of: d.cards.length })));
const listFor = (id) => (id === 'all' ? ALL : ALL.filter((c) => c.deck === DECKS.find((d) => d.id === id)?.name));
const shuffled = (n) => { const a = [...Array(n).keys()]; for (let i = n - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

// ---------- hearing a card: close voicings, each the smallest move from the last, over the bass ----------
const GUIDE = ['3', 'b3', '4', '7', 'b7', 'bb7'];
function uppers(c) {
  const ivs = T.getChord(c.quality).ivs.filter((iv) => iv !== '1');
  const has7 = ivs.some((iv) => ['7', 'b7', 'bb7'].includes(iv));
  // the 3rd and 7th first, then the colour tones from the top down, the 5th last
  const guide = ivs.filter((iv) => GUIDE.includes(iv) || (iv === '6' && !has7));
  const rest = ivs.filter((iv) => !guide.includes(iv) && !['5'].includes(iv)).reverse();
  let keep = [...guide, ...rest, ...ivs.filter((iv) => iv === '5')].slice(0, 4);
  const rpc = T.notePc(c.root);
  const pcs = keep.map((iv) => (rpc + T.intervalSemis(iv)) % 12);
  if (c.bass && T.notePc(c.bass) !== rpc && !pcs.includes(rpc)) pcs.push(rpc); // C/G still needs its C
  return [...new Set(pcs)];
}
export function voiceProg(tokens) {
  let prev = null;
  return tokens.map((tok) => {
    const c = typeof tok === 'string' ? T.parseChordToken(tok) : tok;
    const bassPc = T.notePc(c.bass || c.root);
    const bass = 40 + ((bassPc - 4 + 12) % 12);
    const pcs = uppers(c).sort((a, b) => a - b);
    let best = null, bestScore = Infinity;
    for (let r = 0; r < pcs.length; r++) {
      const rot = [...pcs.slice(r), ...pcs.slice(0, r)];
      for (let start = 50; start <= 66; start++) {
        if (start % 12 !== rot[0]) continue;
        const v = [start];
        for (let i = 1; i < rot.length; i++) { let m = v[i - 1] + 1; while (m % 12 !== rot[i]) m++; v.push(m); }
        if (v[0] <= bass + 2 || v[v.length - 1] > 79) continue;
        const score = prev && prev.length === v.length
          ? v.reduce((s, m, i) => s + Math.abs(m - prev[i]), 0)
          : Math.abs(v.reduce((s, m) => s + m, 0) / v.length - (prev ? prev.reduce((s, m) => s + m, 0) / prev.length : 63)) * v.length;
        if (score < bestScore) { bestScore = score; best = v; }
      }
    }
    prev = best;
    return [bass, ...best];
  });
}
function hear(play) {
  A.unlockAudio();
  const c = A.audioCtx(), t0 = c.currentTime + 0.05;
  if (!play.startsWith('=')) { voiceProg(play.split(/\s+/)).forEach((ch, i) => A.strum(ch, t0 + i * 1.15, { spread: 0.03 })); return; }
  // exact events: a chord rings for a beat; single notes are a line in eighths, over the chord before them
  let t = t0;
  exact(play).forEach((ch, i, all) => {
    if (ch.length > 1) { A.strum(ch, t, { spread: ch.length > 3 ? 0.03 : 0.04, vel: all[i + 1]?.length === 1 ? 0.6 : 0.8 }); t += all[i + 1]?.length === 1 ? 0.45 : 1.15; }
    else { A.pluck(ch[0], t, { vel: 0.85, dur: 0.42 }); t += all[i + 1]?.length > 1 ? 0.55 : 0.28; }
  });
}
// '=C3 B3 E4 G4 | …': exact voicings, low to high (chord melody, where the top note is the point)
const midiOf = (s) => { const m = /^([A-G](?:#|b)?)(-?\d)$/.exec(s); if (!m) throw new Error(`Bad note "${s}"`); return T.notePc(T.parseNote(m[1])) + (Number(m[2]) + 1) * 12; };
export const exact = (play) => play.slice(1).split('|').map((ch) => ch.trim().split(/\s+/).map(midiOf));


// ---------- an example on the neck: each chord's grip (finger numbers in the dots, the bass ringed), lit as it
// sounds, three times through (or looping). Melody notes after a chord light one at a time over its grip. ----------
let ex = null;
const ROLE_IV = (iv) => { const v = String(iv || '').replace('♭', 'b').replace('♯', '#'); return v === '1' ? 'r' : ['3', 'b3'].includes(v) ? 't' : ['5', 'b5', '#5'].includes(v) ? 'f' : ['7', 'b7', 'bb7', '6'].includes(v) ? 's' : 'x'; };
const midiOfN = (n) => OPEN[n.string] + n.fret;
function stopEx(close = false) {
  if (!ex) return;
  clearInterval(ex.timer); ex.timers.forEach(clearTimeout); ex.timer = null; ex.timers = [];
  const b = ex.panel?.querySelector('[data-ex="play"]'); if (b) { b.textContent = '▶ Play'; b.classList.remove('on'); }
  ex.btn?.classList.remove('on');
  if (close) { ex.panel?.remove(); ex = null; }
}
function exWindow(steps) {
  const all = steps.flatMap((st) => [...(st.notes || []), ...st.line.filter(Boolean)]);
  const fr = all.filter((n) => n.fret > 0).map((n) => n.fret);
  if (!fr.length) return { from: 1, to: 5 };
  const lo = Math.min(...fr), hi = Math.max(...fr), open = all.some((n) => n.fret === 0);
  const from = open || lo <= 2 ? 1 : lo - 1;
  return { from, to: Math.max(hi + 1, from + 4) };
}
function drawEx(i, j = -1) {
  const st = ex.steps[i];
  const exact = ex.exact;
  const notes = st.notes || [];
  const bass = notes.length ? notes.reduce((a, n) => (midiOfN(n) < midiOfN(a) ? n : a)) : null;
  const top = notes.length ? notes.reduce((a, n) => (midiOfN(n) > midiOfN(a) ? n : a)) : null;
  const chordDots = notes.map((n) => ({ string: n.string, fret: n.fret, cls: exact ? (n === top ? 'r' : 'x') : ROLE_IV(n.iv), label: n.fret ? String(n.finger || '') : '', ring: n === bass }));
  const mutes = notes.length ? [1, 2, 3, 4, 5, 6].filter((s) => !notes.some((n) => n.string === s)) : [];
  const line = j >= 0 ? st.line[j] : null;
  const svg = line
    ? neckSlice({ ...ex.win, ghosts: chordDots.map((d) => ({ ...d })), dots: [{ string: line.string, fret: line.fret, cls: 'r', label: '' }], mutes })
    : neckSlice({ ...ex.win, dots: chordDots, mutes });
  ex.panel.querySelector('.nkwrap').innerHTML = svg;
  ex.panel.querySelectorAll('[data-exi]').forEach((c) => c.classList.toggle('on', Number(c.dataset.exi) === i));
}
// the timeline of one pass: chords ring, melody notes run in eighths
function exEvents(steps, exact) {
  const evs = []; let t = 0;
  steps.forEach((st, i) => {
    const midis = st.notes ? st.notes.map(midiOfN).sort((a, b) => a - b) : st.midis || [];
    const hasLine = st.line.length > 0;
    if (midis.length) { evs.push({ t, i, j: -1, midis }); t += hasLine ? 0.45 : exact ? 1.25 : 1.5; }
    st.line.forEach((n, j) => { if (n) evs.push({ t, i, j, midis: [midiOfN(n)], note: true }); t += 0.3; });
    if (hasLine) t += 0.4;
  });
  return { evs, len: t + 0.6 };
}
function playEx() {
  stopEx();
  A.unlockAudio();
  const c = A.audioCtx();
  const { evs, len } = exEvents(ex.steps, ex.exact);
  if (!evs.length) return;
  const m = ex; m.pass = 0; m.k = 0; m.base = c.currentTime + 0.08;
  const tick = () => {
    while (m.timer && m.k < evs.length && m.base + evs[m.k].t < c.currentTime + 0.15) {
      const e = evs[m.k], at = m.base + e.t;
      if (e.note) A.pluck(e.midis[0], at, { vel: 0.85, dur: 0.42 });
      else A.strum(e.midis, at, { spread: 0.035, vel: 0.8 });
      m.timers.push(setTimeout(() => { if (ex === m) drawEx(e.i, e.j); }, Math.max(0, (at - c.currentTime) * 1000)));
      if (m.timers.length > 40) m.timers.splice(0, 20);
      m.k++;
    }
    if (m.k >= evs.length && m.timer) {
      if (m.loop || m.pass < 2) { m.pass++; m.k = 0; m.base += len; }
      else if (c.currentTime > m.base + len - 0.4) stopEx();
    }
  };
  m.timer = setInterval(tick, 25); tick();
  const b = m.panel.querySelector('[data-ex="play"]'); b.textContent = '■ Stop'; b.classList.add('on');
  m.btn.classList.add('on');
}
function openEx(btn) {
  const play = btn.dataset.play;
  if (ex && ex.btn === btn) { if (ex.timer) stopEx(); else playEx(); return; }
  stopEx(true);
  let steps = null;
  const prefer = btn.closest('[data-grip]')?.dataset.grip || null;
  try { steps = exampleSteps(play, prefer); } catch (e) { steps = null; }
  if (!steps || !steps.some((st) => st.notes || st.line.length)) { hear(play); return; }
  const exact = play.startsWith('=');
  let names = steps.map((st) => st.label);
  if (exact) {
    const lab = btn.querySelector('b')?.textContent || '';
    const parts = lab.split(/\s*(?:→|·)\s*/).filter(Boolean);
    const chordSteps = steps.filter((st) => st.notes).length;
    names = steps.map((st, i) => (parts.length === chordSteps ? parts[steps.slice(0, i + 1).filter((x) => x.notes).length - 1] : `${i + 1}`));
  }
  const panel = document.createElement('div');
  panel.className = 'exneck';
  panel.innerHTML = `<div class="nkwrap"></div>
    <div class="exchips">${steps.map((st, i) => `<button data-exi="${i}">${acc(esc(names[i] || String(i + 1)))}</button>`).join('')}</div>
    <div class="exctl"><button data-ex="play">▶ Play</button><button data-ex="loop">Loop</button><span>${esc(styleOf(play, prefer))} · numbers are fingers · ringed = bass${exact ? ' · amber = top note' : ''}</span></div>`;
  btn.after(panel);
  ex = { btn, panel, steps, exact, win: exWindow(steps), timers: [], timer: null, loop: false };
  drawEx(0);
  playEx();
  // the neck opens under the example: scroll the card so all of it is in view
  const card = panel.closest('.card');
  if (card) {
    const cr = card.getBoundingClientRect(), pr = panel.getBoundingClientRect(), br = btn.getBoundingClientRect();
    if (pr.bottom > cr.bottom - 8) card.scrollTo({ top: card.scrollTop + Math.min(pr.bottom - cr.bottom + 16, br.top - cr.top - 8), behavior: 'smooth' });
  }
}
function exControl(el) {
  if (!ex) return;
  if (el.dataset.ex === 'play') { if (ex.timer) stopEx(); else playEx(); return; }
  if (el.dataset.ex === 'loop') { ex.loop = !ex.loop; el.classList.toggle('on', ex.loop); return; }
  if (el.dataset.exi != null) { // one chord: show it and sound it
    stopEx();
    const i = Number(el.dataset.exi), st = ex.steps[i];
    drawEx(i);
    A.unlockAudio();
    const t = A.audioCtx().currentTime + 0.05;
    const midis = st.notes ? st.notes.map(midiOfN).sort((a, b) => a - b) : [];
    if (midis.length) A.strum(midis, t, { spread: 0.035, vel: 0.8 });
    st.line.forEach((n, j) => n && A.pluck(midiOfN(n), t + 0.45 + j * 0.3, { vel: 0.85, dur: 0.42 }));
  }
}


// ---------- a drill on the neck: the pattern’s notes, and a player that walks through it at the drill’s tempo and
// subdivision (live: the card’s − and + change it while it plays), with the click on the beats ----------
let dn = null;
function stopDn(close = false) {
  if (!dn) return;
  clearInterval(dn.timer); dn.timers.forEach(clearTimeout); dn.timer = null; dn.timers = [];
  const b = dn.panel?.querySelector('[data-dn="play"]'); if (b) { b.textContent = '▶ Play it'; b.classList.remove('on'); }
  if (close) { dn.panel?.remove(); dn = null; }
}
function drawDn(i = -1) {
  const ev = i >= 0 ? dn.pat.events[i] : null;
  const base = ev?.dots || dn.pat.dots;
  const lit = new Set((ev || []).map((n) => n.string + ':' + n.fret));
  const lab = (n) => (dn.pat.labels === 'finger' ? n.iv : n.iv ? T.prettyIv(n.iv) : '');
  const dots = base.map((n) => ({ string: n.string, fret: n.fret, cls: lit.has(n.string + ':' + n.fret) ? 'r' : ROLE_IV(n.iv), label: lab(n), ring: lit.has(n.string + ':' + n.fret) }));
  for (const n of ev || []) if (!base.some((d) => d.string === n.string && d.fret === n.fret)) dots.push({ string: n.string, fret: n.fret, cls: 'r', label: '', ring: true }); // a chromatic approach note
  dn.panel.querySelector('.nkwrap').innerHTML = neckSlice({ ...dn.win, dots });
  if (ev?.key) dn.panel.querySelector('.dnkey').textContent = `Key of ${T.pretty(ev.key)}`;
}
function playDn(ds) {
  stopDn();
  if (drill) { clearInterval(drill.timer); const b = drill.el?.querySelector('[data-dr="go"]'); if (b) { b.textContent = '▶ Click'; b.classList.remove('on'); } drill = null; }
  A.unlockAudio();
  const c = A.audioCtx(), m = dn;
  m.next = c.currentTime + 0.1; m.slot = -4 * ds.sub; // a bar of count-in
  const tick = () => {
    while (m.timer && m.next < c.currentTime + 0.12) {
      const sub = ds.sub, k = ((m.slot % sub) + sub) % sub, beat = Math.floor(m.slot / sub);
      if (k === 0) A.click(m.next, ((beat % 4) + 4) % 4 === 0 ? 2 : 1);
      if (m.slot >= 0) {
        const i = m.slot % m.pat.events.length, ev = m.pat.events[i], at = m.next, len = 60 / ds.bpm / sub;
        if (ev.length > 1) A.strum(ev.map((n) => n.midi), at, { spread: 0.02, vel: 0.75 });
        else A.pluck(ev[0].midi, at, { vel: 0.72, dur: Math.min(0.5, len * 1.3) });
        m.timers.push(setTimeout(() => { if (dn === m) drawDn(i); }, Math.max(0, (at - c.currentTime) * 1000)));
        if (m.timers.length > 48) m.timers.splice(0, 24);
      }
      m.next += 60 / ds.bpm / sub; m.slot++;
    }
  };
  m.timer = setInterval(tick, 25); tick();
  const b = m.panel.querySelector('[data-dn="play"]'); b.textContent = '■ Stop'; b.classList.add('on');
}
function openDn(btn, card, ds) {
  if (dn && dn.btn === btn) { if (dn.timer) stopDn(); else playDn(ds); return; }
  stopDn(true);
  const pat = drillPattern(card.neck);
  if (!pat.events.length) return;
  const all = pat.events.flat().concat(pat.dots), fr = all.map((n) => n.fret);
  const lo = Math.min(...fr), hi = Math.max(...fr);
  const win = { from: lo <= 2 ? 1 : lo - 1, to: Math.max(hi + 1, (lo <= 2 ? 1 : lo - 1) + 4) };
  const panel = document.createElement('div');
  panel.className = 'exneck dnk';
  const seq = card.neck.seq && SEQS[card.neck.seq] ? ` · ${SEQS[card.neck.seq].name}` : '';
  panel.innerHTML = `<div class="nkwrap"></div>
    <div class="exctl"><button data-dn="play">▶ Play it</button><span class="dnkey"></span></div>
    <div class="exctl"><span>${esc(`${pat.events.length} notes${seq}`)} · plays at the drill’s tempo and subdivision, with a bar of count-in. The amber ringed note is the one sounding.</span></div>`;
  btn.after(panel);
  dn = { btn, panel, pat, win, timers: [], timer: null };
  drawDn();
}
// ---------- comping cards: a progression that loops on soft keys, with a click you can turn off and a tempo you can
// change while it plays. One bar of count-in, then round and round; the bar being played lights up. ----------
let comp = null;
const symOf = (c) => T.pretty(T.chordSymbol(c.root, c.quality)) + (c.bass ? '/' + T.noteName(c.bass, true) : '');
export function stopComp() {
  stopDrill();
  stopEx();
  stopDn();
  if (!comp) return;
  clearInterval(comp.timer); comp.timers.forEach(clearTimeout);
  comp.el?.querySelectorAll('.cbarx.on').forEach((b) => b.classList.remove('on'));
  const btn = comp.el?.querySelector('[data-cp="play"]'); if (btn) { btn.textContent = '▶ Play'; btn.classList.remove('on'); }
  comp = null;
}
function startComp(card, el, st) {
  stopComp();
  A.unlockAudio();
  const bars = T.parseChart(card.comp.chart);
  const evs = []; let beat = 0;
  bars.forEach((bar, bi) => { const each = 4 / bar.length; bar.forEach((ch, ci) => evs.push({ ch, beat: beat + ci * each, dur: each, bi })); beat += 4; });
  const total = beat, voiced = voiceProg(evs.map((e) => e.ch));
  const c = A.audioCtx();
  const m = { el, timers: [], next: c.currentTime + 0.1, pos: -4, timer: null };
  const tick = () => {
    while (m.next < c.currentTime + 0.15) {
      const spb = 60 / st.bpm, t = m.next;
      if (m.pos < 0) A.click(t, m.pos === -4 ? 2 : 1); // count-in
      else {
        const b = m.pos % total;
        if (st.click) A.click(t, b % 4 === 0 ? 2 : 1);
        evs.forEach((e, i) => {
          if (e.beat !== b) return;
          const hold = e.dur * spb * 0.96, [bass, ...up] = voiced[i];
          A.keys(bass - 12 >= 33 ? bass - 12 : bass, t, hold, 0.55);
          up.forEach((n) => A.keys(n, t + 0.006, hold, 0.42));
          m.timers.push(setTimeout(() => { el.querySelectorAll('.cbarx').forEach((x, j) => x.classList.toggle('on', j === e.bi)); }, Math.max(0, (t - c.currentTime) * 1000)));
        });
      }
      m.pos++; m.next += spb;
      if (m.timers.length > 64) m.timers.splice(0, 32);
    }
  };
  m.timer = setInterval(tick, 25); tick();
  comp = m;
  const btn = el.querySelector('[data-cp="play"]'); btn.textContent = '■ Stop'; btn.classList.add('on');
}

// ---------- drill cards: a click (with optional subdivisions) and a drone on the key, tempo adjustable live ----------
let drill = null, droneOn = false;
const DRONE_MIDI = (name) => 40 + ((T.notePc(T.parseNote(name)) - 4 + 12) % 12);
function stopDrill() {
  if (drill) { clearInterval(drill.timer); drill.el?.querySelector('[data-dr="go"]')?.classList.remove('on'); const b = drill.el?.querySelector('[data-dr="go"]'); if (b) b.textContent = '▶ Click'; drill = null; }
  if (droneOn) { A.stopDrone(); droneOn = false; }
}
function startClick(el, ds) {
  if (drill) { clearInterval(drill.timer); }
  A.unlockAudio();
  const c = A.audioCtx();
  const m = { el, next: c.currentTime + 0.08, slot: 0, timer: null };
  const tick = () => {
    while (m.next < c.currentTime + 0.12) {
      const sub = ds.sub, k = m.slot % sub, beat = Math.floor(m.slot / sub) % 4;
      A.click(m.next, k ? 0 : beat === 0 ? 2 : 1);
      m.next += 60 / ds.bpm / sub; m.slot++;
    }
  };
  m.timer = setInterval(tick, 25); tick();
  drill = m;
  const b = el.querySelector('[data-dr="go"]'); b.textContent = '■ Stop'; b.classList.add('on');
}
const SUBS = { 1: 'Beats', 2: '8ths', 3: 'Triplets', 4: '16ths' };
const drillHTML = (c, ds) => `<div class="comp drill">
    ${c.drill.goal ? `<div class="dgoal">Goal: <b>${esc(c.drill.goal)}</b>${c.drill.from ? ` · start around ${c.drill.from}` : ''}</div>` : ''}
    <div class="cctl"><button data-dr="go">▶ Click</button><button data-dr="down" class="sq">−</button><span class="cbpm">${ds.bpm} bpm</span><button data-dr="up" class="sq">+</button></div>
    <div class="cctl"><button data-dr="sub" class="wide">${SUBS[ds.sub]}</button>${c.drill.drone ? `<button data-dr="drone" class="wide ${droneOn ? 'on' : ''}">Drone ${acc(T.pretty(c.drill.drone))}</button>` : ''}</div>
  </div>`;

const compHTML = (c, st) => {
  const bars = T.parseChart(c.comp.chart);
  return `<div class="comp">
    <div class="cbars">${bars.map((bar) => `<div class="cbarx">${bar.map((ch) => `<b>${acc(esc(symOf(ch)))}</b>`).join('')}</div>`).join('')}</div>
    <div class="cctl"><button data-cp="play">▶ Play</button><button data-cp="down" class="sq">−</button><span class="cbpm">${st.bpm} bpm</span><button data-cp="up" class="sq">+</button><button data-cp="click" class="${st.click ? 'on' : ''}">Click</button></div>
  </div>`;
};

// ---------- a card ----------
function bodyHTML(lines = []) {
  let out = '', list = false;
  for (const l of lines) {
    const li = l.startsWith('- ');
    if (li && !list) { out += '<ul>'; list = true; }
    if (!li && list) { out += '</ul>'; list = false; }
    out += li ? `<li>${l.slice(2)}</li>` : `<p>${l}</p>`;
  }
  return out + (list ? '</ul>' : '');
}
const chordsLine = (play) => play.split(/\s+/).map((tok) => { const c = T.parseChordToken(tok); return T.chordSymbol(c.root, c.quality) + (c.bass ? '/' + T.noteName(c.bass, true) : ''); }).join(' – ');
// ♭ and ♯ from the UI font: the serif's fallback glyphs sit loose
const acc = (s) => String(s).replace(/[♭♯𝄫]/g, (m) => `<span class="acc">${m}</span>`);
// a key's seven notes under their degree numbers; root, 3rd, 5th and 7th in the neck's colours
const DEG = { false: ['1', '2', '3', '4', '5', '6', '7'], true: ['1', '2', '♭3', '4', '5', '♭6', '♭7'] };
const ROLE = ['r', '', 't', '', 'f', '', 's'];
const keyRow = (k) => `<div class="krow">${k.notes.map((n, i) => `<div class="kc ${ROLE[i]}"><span>${DEG[k.minor][i]}</span><b>${acc(T.pretty(n))}</b></div>`).join('')}</div>`;
// a chord's notes in C under their intervals, coloured by job; a row of chords under their numerals
function chordRow(tok) {
  const ch = T.parseChordToken(tok), ivs = T.getChord(ch.quality).ivs, notes = T.chordNotes(ch.root, ch.quality);
  const role = (iv) => (iv === '1' ? 'r' : ['3', 'b3'].includes(iv) ? 't' : ['5', 'b5', '#5'].includes(iv) ? 'f' : ['7', 'b7', 'bb7', '6'].includes(iv) ? 's' : 'x'); // 2, 4, 9, 11, 13: colour
  return `<div class="krow" style="grid-template-columns: repeat(${ivs.length}, minmax(0, 1fr))">${ivs.map((iv, i) => `<div class="kc ${role(iv)}"><span>${acc(T.prettyIv(iv))}</span><b>${acc(T.noteName(notes[i], true))}</b></div>`).join('')}</div>`;
}
const chordsRow = (row) => `<div class="crow">${row.map(([n, sym]) => `<div><span>${acc(n)}</span><b>${acc(sym)}</b></div>`).join('')}</div>`;
export function cardHTML(c, cs) {
  if (!c) return `<div class="cdeck">&nbsp;</div><h2>That’s the deck</h2><div class="cbody"><p>Tap to go through it again.</p></div>`;
  return `<div class="cdeck">${esc(c.deck)} · ${c.n} / ${c.of}</div>
    <h2>${acc(c.t)}</h2>${c.s ? `<div class="csrc">${c.s}</div>` : ''}
    ${c.key ? keyRow(c.key) : ''}${c.chord ? chordRow(c.chord) : ''}${c.row ? chordsRow(c.row) : ''}
    ${c.comp ? compHTML(c, cs) : ''}${c.drill ? drillHTML(c, cs.drill) : ''}
    <div class="cbody">${bodyHTML(c.b)}</div>
    ${c.neck ? `<button class="hear dnb" data-dnk="1"><span>▦</span> Show it on the neck</button>` : ''}
    ${c.eg ? `<div class="ceg">${acc(c.eg)}</div>` : ''}
    ${c.play ? `<button class="hear" data-play="${esc(c.play)}"><span>▶</span> ${esc(chordsLine(c.play))}</button>` : ''}
    ${c.ex ? `<div class="cex"${c.grip ? ` data-grip="${c.grip}"` : ''}><div class="cexh">In context</div>${c.ex.map(([cap, play, label]) => `<button class="hear ex" data-play="${esc(play)}"><span>▶</span><div><small>${acc(cap)}</small>${label || !play.startsWith('=') ? `<b>${esc(label || chordsLine(play))}</b>` : ''}</div></button>`).join('')}</div>` : ''}`;
}

// ---------- the screen ----------
export function mountCards(root, S, save) {
  S.cards = Object.assign({ deck: 'all', pos: {}, shuffle: false, order: {} }, S.cards || {});
  const st = S.cards;
  if (st.deck !== 'all' && !DECKS.some((d) => d.id === st.deck)) st.deck = 'all';
  const list = () => listFor(st.deck);
  const order = () => {
    const n = list().length;
    if (!st.shuffle) return [...Array(n).keys()];
    if (!st.order[st.deck] || st.order[st.deck].length !== n) st.order[st.deck] = shuffled(n);
    return st.order[st.deck];
  };
  const pos = () => Math.min(st.pos[st.deck] || 0, list().length);
  const current = () => (pos() < list().length ? list()[order()[pos()]] : null);

  root.querySelector('.cbar').innerHTML = `
    <button id="home" class="chome">☰ <span></span></button>
    <button id="test" class="">Test</button>
    <button id="shuf" class="${st.shuffle ? 'on' : ''}" aria-pressed="${st.shuffle}">Shuffle</button>`;
  const stage = root.querySelector('.stage'), foot = root.querySelector('.cfoot');
  const deckName = (id) => (id === 'all' ? 'All decks' : DECKS.find((d) => d.id === id).name);
  let card = null, mode = 'home', openDeck = null;
  // the contents: carry on where you were, start any deck, or jump to any card
  const cs = { bpm: 80, click: st.click !== false, card: null, drill: { bpm: 60, sub: 1 } }; // the players' tempo, click and subdivision
  // the test: a random card, title only; Reveal shows the rest, Next brings another (no repeats until all are seen)
  const NOT_TESTED = new Set(['comping', 'fluency']);
  let tq = [], tcard = null, shown = false, tcount = 0;
  const TPOOL = ALL.filter((c) => !NOT_TESTED.has(DECKS.find((d) => d.name === c.deck)?.id)); // every deck but the exercises
  let tdeck = null; // null: every deck; or one deck’s id, from its Test button in Contents
  const tpool = () => (tdeck ? ALL.filter((c) => c.deck === DECKS.find((d) => d.id === tdeck).name) : TPOOL);
  const testDraw = () => {
    if (!tq.length) tq = shuffled(tpool().length);
    tcard = tpool()[tq.pop()]; shown = false; tcount++;
  };
  const testShow = (from = 0) => {
    stopComp(); stopEx(true); stopDn(true);
    mode = 'test';
    root.querySelector('#home span').textContent = `Test · ${tdeck ? deckName(tdeck) : `${TPOOL.length} cards`}`;
    root.querySelector('#test').classList.add('on');
    stage.innerHTML = `<article class="card test${shown ? ' shown' : ''}${from ? ' from-r' : ''}">${cardHTML(tcard, cs)}${shown ? '' : '<div class="tq">What’s on this card? Say it, or play it, then reveal.</div>'}</article>`;
    card = stage.firstElementChild;
    foot.innerHTML = `<div class="tctl"><button id="tRev" ${shown ? 'disabled' : ''}>Reveal</button><button id="tNext" class="go">Next ▶</button></div><span>${tcount}</span>`;
    foot.querySelector('#tRev').onclick = () => { shown = true; testShow(); };
    foot.querySelector('#tNext').onclick = () => testNext();
  };
  const testNext = () => {
    if (busy) return;
    busy = true;
    card.style.transition = 'transform .2s ease-in, opacity .2s ease-in';
    card.style.transform = 'translateX(-115%) rotate(-6deg)'; card.style.opacity = '0';
    setTimeout(() => { testDraw(); testShow(1); busy = false; }, 170);
  };
  const home = () => {
    stopComp(); stopEx(true); stopDn(true);
    root.querySelector('#test')?.classList.remove('on');
    mode = 'home'; card = null;
    root.querySelector('#home span').textContent = 'Contents';
    const c = current(), n = list().length;
    stage.innerHTML = `<div class="home">
      <button class="hcont" data-cont><small>Carry on · ${esc(deckName(st.deck))} · ${Math.min(pos() + 1, n)} / ${n}</small><b>${c ? acc(c.t) : 'Back to the start'}</b><span>▶</span></button>
      <button class="hall" data-all>All decks in a row <span>${ALL.length} cards</span></button>
      ${DECKS.map((d) => `<section class="hsec${openDeck === d.id ? ' open' : ''}">
        <div class="hhead"><button class="hname" data-open="${d.id}"><i>${openDeck === d.id ? '▾' : '▸'}</i>${esc(d.name)}<span>${d.cards.length}</span></button><button class="hstart" data-tdeck="${d.id}">Test</button><button class="hstart" data-start="${d.id}">Start</button></div>
        ${openDeck === d.id ? `<div class="hcards">${d.cards.map((x, i) => `<button data-jump="${d.id}:${i}"><span>${i + 1}</span>${acc(x.t)}</button>`).join('')}</div>` : ''}
      </section>`).join('')}
      <div class="hver">Version ${esc(BUILD)}</div>
    </div>`;
    foot.innerHTML = '';
    save();
  };
  const show = (from = 0) => {
    mode = 'card';
    root.querySelector('#test').classList.remove('on');
    root.querySelector('#home span').textContent = deckName(st.deck);
    const n = list().length, p = pos();
    stopComp(); stopEx(true); stopDn(true);
    const cur = current();
    if (cur?.comp && cs.card !== cur) { cs.card = cur; cs.bpm = cur.comp.bpm; } // each comping card starts at its own tempo
    if (cur?.drill && cs.card !== cur) { cs.card = cur; cs.drill = { bpm: cur.drill.bpm, sub: cur.drill.sub || 1 }; }
    stage.innerHTML = `<article class="card${from ? (from > 0 ? ' from-r' : ' from-l') : ''}">${cardHTML(cur, cs)}</article>`;
    card = stage.firstElementChild;
    foot.innerHTML = `<button class="cback" ${p === 0 ? 'disabled' : ''}>◀ Back</button><div class="cprog"><i style="width:${(100 * Math.min(p + 1, n)) / n}%"></i></div><span>${Math.min(p + 1, n)} / ${n}</span>`;
    foot.querySelector('.cback').onclick = () => go(-1); // go is defined below; it runs only on a tap
    save();
  };
  const step = (d) => {
    const n = list().length;
    let p = pos() + d;
    if (p > n) { p = 0; if (st.shuffle) st.order[st.deck] = shuffled(n); } // round again (reshuffled)
    if (p < 0) p = 0;
    st.pos[st.deck] = p;
  };
  // fly the card off, then the next one comes in from the other side
  let busy = false;
  const go = (d) => {
    if (busy || (d < 0 && pos() === 0)) { if (card) { card.style.transition = 'transform .2s'; card.style.transform = ''; } return; }
    busy = true;
    card.style.transition = 'transform .2s ease-in, opacity .2s ease-in';
    card.style.transform = `translateX(${d > 0 ? -115 : 115}%) rotate(${d > 0 ? -6 : 6}deg)`;
    card.style.opacity = '0';
    setTimeout(() => { step(d); show(d); busy = false; }, 170);
  };

  root.querySelector('#home').onclick = () => (mode === 'home' ? show() : home());
  const startTest = (deck = null) => { tdeck = deck; tq = []; tcount = 0; testDraw(); testShow(1); };
  root.querySelector('#test').onclick = () => { if (mode === 'test') { show(); return; } startTest(); };
  root.querySelector('#shuf').onclick = (e) => {
    st.shuffle = !st.shuffle;
    if (st.shuffle) st.order[st.deck] = shuffled(list().length);
    st.pos[st.deck] = 0;
    e.currentTarget.classList.toggle('on', st.shuffle);
    if (mode === 'home') home(); else show();
  };
  const jump = (deck, i) => {
    st.deck = deck;
    st.pos[deck] = i == null ? 0 : st.shuffle ? Math.max(0, order().indexOf(i)) : i;
    show(1);
  };

  // tap: next. Drag sideways: the card follows the finger and flicks on release. Vertical drags scroll a long card.
  let x0 = null, y0 = 0, t0 = 0, dx = 0, drag = false;
  stage.onpointerdown = (e) => {
    if (mode === 'home' || e.target.closest('.hear, .comp, .exneck, .tctl') || busy) return; // the players' buttons aren't taps on the card
    x0 = e.clientX; y0 = e.clientY; t0 = performance.now(); dx = 0; drag = false;
  };
  stage.onpointermove = (e) => {
    if (x0 == null || !card) return;
    dx = e.clientX - x0;
    if (!drag && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(e.clientY - y0)) { drag = true; card.style.transition = 'none'; }
    if (drag) card.style.transform = `translateX(${dx}px) rotate(${dx / 30}deg)`;
  };
  const end = (e) => {
    if (x0 == null) return;
    const moved = Math.hypot(e.clientX - x0, e.clientY - y0), fast = Math.abs(dx) / Math.max(1, performance.now() - t0) > 0.5;
    x0 = null;
    if (mode === 'test') {
      if (drag && (Math.abs(dx) > 70 || (fast && Math.abs(dx) > 25))) { drag = false; testNext(); return; }
      if (drag) { card.style.transition = 'transform .2s'; card.style.transform = ''; }
      else if (moved < 10 && e.type === 'pointerup') { if (shown) testNext(); else { shown = true; testShow(); } }
      drag = false; return;
    }
    if (drag && (Math.abs(dx) > 70 || (fast && Math.abs(dx) > 25))) go(dx < 0 ? 1 : -1);
    else if (drag) { card.style.transition = 'transform .2s'; card.style.transform = ''; }
    else if (moved < 10 && e.type === 'pointerup') go(1);
    drag = false;
  };
  stage.onpointerup = end;
  stage.onpointercancel = (e) => { if (drag) { card.style.transition = 'transform .2s'; card.style.transform = ''; } x0 = null; drag = false; };
  stage.onclick = (e) => {
    const dk = e.target.closest('[data-dnk], .dnk [data-dn]');
    if (dk) { e.stopPropagation(); const cardObj = mode === 'test' ? tcard : current(); openDn(dk.dataset.dnk ? dk : dn.btn, cardObj, cs.drill); return; }
    const xc = e.target.closest('.exneck [data-ex], .exneck [data-exi]'); if (xc) { e.stopPropagation(); exControl(xc); return; }
    if (e.target.closest('.exneck')) { e.stopPropagation(); return; }
    const h = e.target.closest('.hear'); if (h) { e.stopPropagation(); openEx(h); return; }
    const dr = e.target.closest('[data-dr]');
    if (dr) {
      e.stopPropagation();
      const el = dr.closest('.comp'), what = dr.dataset.dr, ds = cs.drill, card = current();
      if (what === 'go') { if (drill) { clearInterval(drill.timer); drill = null; dr.textContent = '▶ Click'; dr.classList.remove('on'); } else startClick(el, ds); }
      if (what === 'up' || what === 'down') { ds.bpm = Math.max(30, Math.min(300, ds.bpm + (what === 'up' ? 5 : -5))); el.querySelector('.cbpm').textContent = `${ds.bpm} bpm`; }
      if (what === 'sub') { ds.sub = { 1: 2, 2: 3, 3: 4, 4: 1 }[ds.sub]; dr.textContent = SUBS[ds.sub]; }
      if (what === 'drone') { A.unlockAudio(); if (droneOn) { A.stopDrone(); droneOn = false; } else { A.startDrone(DRONE_MIDI(card.drill.drone), true); droneOn = true; } dr.classList.toggle('on', droneOn); }
      return;
    }
    const cp = e.target.closest('[data-cp]');
    if (cp) {
      e.stopPropagation();
      const el = cp.closest('.comp'), what = cp.dataset.cp;
      if (what === 'play') { if (comp) stopComp(); else startComp(current(), el, cs); }
      if (what === 'up' || what === 'down') { cs.bpm = Math.max(40, Math.min(240, cs.bpm + (what === 'up' ? 5 : -5))); el.querySelector('.cbpm').textContent = `${cs.bpm} bpm`; }
      if (what === 'click') { cs.click = !cs.click; st.click = cs.click; cp.classList.toggle('on', cs.click); save(); }
      return;
    }
    if (mode !== 'home') return;
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.cont != null) show(1);
    else if (b.dataset.all != null) { st.deck = 'all'; show(1); }
    else if (b.dataset.open) { const sc = stage.querySelector('.home').scrollTop; openDeck = openDeck === b.dataset.open ? null : b.dataset.open; home(); stage.querySelector('.home').scrollTop = sc; }
    else if (b.dataset.start) jump(b.dataset.start, null);
    else if (b.dataset.tdeck) startTest(b.dataset.tdeck);
    else if (b.dataset.jump) { const [d, i] = b.dataset.jump.split(':'); jump(d, Number(i)); }
  };
  home();
  return { key: (k) => {
    if (mode === 'test') { if (k === 'ArrowRight' || k === ' ') { if (shown) testNext(); else { shown = true; testShow(); } } if (k === 'Escape') home(); return; }
    if (mode === 'home') return; if (k === 'ArrowRight' || k === ' ') go(1); if (k === 'ArrowLeft') go(-1); if (k === 'Escape') home(); } };
}
