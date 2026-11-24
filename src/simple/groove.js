// Grooves for the rhythm and soloing cards: a guitar part (strums down and up, muted chucks, bass notes), a drum
// part and a bass line, over a chord chart, in any meter, straight or swung. The pattern shows as a grid with the
// count underneath; the step being played lights up. Click, drums, guitar and bass can each be switched off.
//
// card.groove = { meter: '4/4', sub: 4, bpm: 90, swing: 0, groups: [3,2] (accents for odd meters), chart: 'G | C',
//   gtr: 'D.DU.UDU' (D U strum, d u light strum, x muted chuck, b root alone, 5 fifth alone, . rest),
//   drums: { k: 'x...', s: '..x.', h: 'xxxx', o, r, m } (x hit, X accent, g ghost), bass: 'r.5.' (r root, 5, 3, 7, 8, a approach) }
import * as T from '../theory.js';
import * as A from '../audio.js';
import { esc } from '../fundamentals/core.js';
import { progGrips } from './fingering.js';

const OPEN = { 1: 64, 2: 59, 3: 55, 4: 50, 5: 45, 6: 40 };
const steps = (g) => g.beats * g.sub;
export function meterOf(g) {
  const [n, d] = (g.meter || '4/4').split('/').map(Number);
  // x/8 meters count in eighths (the beat is an eighth); 6/8, 9/8 and 12/8 feel in dotted quarters
  const compound = d === 8 && n % 3 === 0 && !g.groups;
  return { n, d, beats: compound ? n / 3 : n, sub: compound ? 3 : g.sub || (d === 8 ? 1 : 2), groups: g.groups || null, compound };
}
// what each step is called when you count it
function countLabels(m) {
  const out = [];
  for (let b = 0; b < m.beats; b++) for (let s = 0; s < m.sub; s++) {
    if (m.compound) out.push(s === 0 ? String(b + 1) : s === 1 ? '&' : 'a');
    else if (m.sub === 1) out.push(String(b + 1));
    else if (m.sub === 2) out.push(s ? '&' : String(b + 1));
    else if (m.sub === 3) out.push(s === 0 ? String(b + 1) : s === 1 ? 'trip' : 'let');
    else out.push(s === 0 ? String(b + 1) : ['', 'e', '&', 'a'][s]);
  }
  return out;
}
const SYM = { D: '↓', U: '↑', d: '↓', u: '↑', x: '✕', K: '↓', b: 'B', 5: '5', 6: '6', 7: '♭7', P: '5', Q: '6', '.': '' };
const pad = (str, n) => (str || '').padEnd(n, '.').slice(0, n);

export function grooveHTML(c, st) {
  const g = c.groove, m = meterOf(g), n = m.beats * m.sub;
  const labels = countLabels(m);
  const row = (name, str, sym) => `<div class="gvrow"><span>${name}</span>${[...pad(str, n)].map((ch, i) => `<i class="${i % m.sub === 0 ? 'bt' : ''}${ch === 'D' || ch === 'U' || ch === 'X' ? ' acc' : ''}${ch === '.' ? '' : ' on'}" data-i="${i}">${esc(sym(ch))}</i>`).join('')}</div>`;
  const drumNames = { k: 'Kick', s: 'Snare', h: 'Hat', o: 'Open hat', r: 'Rim', m: 'Shaker' };
  const bars = T.parseChart(g.chart);
  return `<div class="comp groove">
    <div class="gvmeta"><b>${esc(g.meter || '4/4')}</b>${g.swing ? ' · swung' : ''} · ${esc(bars.map((b) => b.map((ch) => T.pretty(T.chordSymbol(ch.root, ch.quality))).join(' ')).join(' | '))}</div>
    <div class="gvgrid" style="--n:${n}">
      ${g.gtr ? row('Guitar', g.gtr, (ch) => SYM[ch] ?? ch) : ''}
      ${g.drums ? Object.entries(g.drums).map(([k, v]) => row(drumNames[k] || k, v, (ch) => (ch === 'g' ? '·' : ch === '.' ? '' : '●'))).join('') : ''}
      ${g.bass ? row('Bass', g.bass, (ch) => (ch === '.' ? '' : ch === 'r' ? 'R' : ch)) : ''}
      <div class="gvrow cnt"><span></span>${labels.map((l, i) => `<i class="${i % m.sub === 0 ? 'bt' : ''}" data-i="${i}">${l}</i>`).join('')}</div>
    </div>
    <div class="cctl"><button data-gv="play">▶ Play</button><button data-gv="down" class="sq">−</button><span class="cbpm">${st.bpm} bpm</span><button data-gv="up" class="sq">+</button></div>
    <div class="cctl gvparts">
      <button data-gv="click" class="${st.click ? 'on' : ''}">Click</button>
      ${g.drums ? `<button data-gv="drums" class="${st.drums ? 'on' : ''}">Drums</button>` : ''}
      ${g.gtr ? `<button data-gv="gtr" class="${st.gtr ? 'on' : ''}">Guitar</button>` : ''}
      ${g.bass ? `<button data-gv="bass" class="${st.bass ? 'on' : ''}">Bass</button>` : ''}
    </div>
  </div>`;
}

let gv = null;
export function stopGroove() {
  if (!gv) return;
  clearInterval(gv.timer); gv.timers.forEach(clearTimeout);
  gv.el?.querySelectorAll('.gvgrid i.now').forEach((x) => x.classList.remove('now'));
  const b = gv.el?.querySelector('[data-gv="play"]'); if (b) { b.textContent = '▶ Play'; b.classList.remove('on'); }
  gv = null;
}
export const grooveOn = () => !!gv;
export function startGroove(c, el, st) {
  stopGroove();
  A.unlockAudio();
  const g = c.groove, m = meterOf(g), n = m.beats * m.sub;
  const bars = T.parseChart(g.chart);
  // one guitar grip per chord, the sensible way (open and barre chords for plain triads, movable grips for 7ths)
  const toks = bars.flat().map((ch) => ch.token || `${T.noteName(ch.root)}:${ch.quality}`);
  let grips = null;
  try { grips = progGrips(toks); } catch (e) { grips = null; }
  let k = 0;
  const chordAt = bars.map((bar) => bar.map((ch) => {
    const grip = grips?.[k++];
    const midis = grip ? grip.notes.map((x) => OPEN[x.string] + x.fret).sort((a, b) => a - b) : null;
    const rootPc = T.notePc(ch.root);
    return { ch, midis, rootPc };
  }));
  const accents = new Set();
  if (m.groups) { let i = 0; for (const gsz of m.groups) { accents.add(i); i += gsz * m.sub; } } else for (let b = 0; b < m.beats; b++) accents.add(b * m.sub); // groups count in beats
  const parts = { gtr: pad(g.gtr, n), bass: pad(g.bass, n), drums: Object.fromEntries(Object.entries(g.drums || {}).map(([kk, v]) => [kk, pad(v, n)])) };
  const ctx = A.audioCtx();
  const mm = { el, timers: [], timer: null, next: ctx.currentTime + 0.1, step: -n };
  const bassMidi = (pc, off) => { let x = 36 + (((pc + off) - 0) % 12 + 12) % 12; if (x < 33) x += 12; return x; };
  const tick = () => {
    while (mm.next < ctx.currentTime + 0.15) {
      const stepDur = 60 / st.bpm / m.sub;
      const i = ((mm.step % n) + n) % n;
      let t = mm.next;
      if (g.swing && (m.sub === 2 || m.sub === 4) && i % 2 === 1) t += g.swing * stepDur; // swing the off-steps
      const onBeat = i % m.sub === 0, lvl = i === 0 ? 2 : accents.has(i) ? 1 : 0;
      if (mm.step < 0) { if (onBeat) A.click(t, lvl); } // count-in
      else {
        const barIdx = Math.floor(mm.step / n) % bars.length, bar = chordAt[barIdx];
        const cc = bar[Math.min(bar.length - 1, Math.floor(i / (n / bar.length)))];
        if (st.click && onBeat) A.click(t, lvl);
        const gch = parts.gtr[i];
        if (st.gtr && gch !== '.' && cc.midis) {
          const low = 40 + ((cc.rootPc - 4) % 12 + 12) % 12; // the root on the low E string
          if (gch === 'P' || gch === 'Q') A.strum([low, low + (gch === 'P' ? 7 : 9)], t, { dir: 'D', vel: 0.8, spread: 0.006, dur: stepDur * 1.6 }); // boogie: root + 5th, root + 6th
          else if (gch === '6' || gch === '7') A.pluck(low + (gch === '6' ? 9 : 10), t, { vel: 0.8, dur: stepDur * 1.6 });
          else if (gch === 'b') A.pluck(cc.midis[0], t, { vel: 0.85, dur: stepDur * 1.8 });
          else if (gch === '5') { const f = cc.midis.find((x) => ((x - cc.rootPc) % 12 + 12) % 12 === 7) ?? cc.midis[0] + 7; A.pluck(f, t, { vel: 0.8, dur: stepDur * 1.8 }); }
          else if (gch === 'x') A.strum(cc.midis.slice(-4), t, { dir: 'D', muted: true, vel: 0.75, spread: 0.008 });
          else if (gch === 'K') A.strum(cc.midis.slice(-3), t, { dir: 'D', vel: 0.72, spread: 0.006, dur: stepDur * 0.55 }); // a short, choked chop
          else {
            const up = gch === 'U' || gch === 'u', soft = gch === 'd' || gch === 'u';
            const notes = up ? cc.midis.slice(-4) : cc.midis; // up-strums catch the top strings
            A.strum(notes, t, { dir: up ? 'U' : 'D', vel: soft ? 0.5 : up ? 0.68 : 0.82, spread: 0.011 });
          }
        }
        if (st.drums) for (const [kk, v] of Object.entries(parts.drums)) { const ch = v[i]; if (ch !== '.') A.drum(kk, t, ch === 'X' ? 1 : ch === 'g' ? 0.35 : 0.75); }
        const bch = parts.bass[i];
        if (st.bass && bch !== '.') {
          const off = { r: 0, 3: (cc.ch.quality.startsWith('m') && !cc.ch.quality.startsWith('maj')) || cc.ch.quality === 'dim' ? 3 : 4, 5: 7, 7: cc.ch.quality === 'maj7' ? 11 : 10, 8: 12 }[bch];
          let midi;
          if (bch === 'a') { const nb = chordAt[(barIdx + 1) % bars.length][0]; midi = bassMidi(nb.rootPc, 0) - 1; }
          else midi = bassMidi(cc.rootPc, 0) + (off ?? 0);
          A.pluck(midi, t, { vel: 0.95, dur: stepDur * (m.sub === 1 ? 0.9 : 1.6) });
        }
        const at = t;
        mm.timers.push(setTimeout(() => { if (gv === mm) { el.querySelectorAll('.gvgrid i.now').forEach((x) => x.classList.remove('now')); el.querySelectorAll(`.gvgrid i[data-i="${i}"]`).forEach((x) => x.classList.add('now')); } }, Math.max(0, (at - ctx.currentTime) * 1000)));
        if (mm.timers.length > 64) mm.timers.splice(0, 32);
      }
      mm.next += stepDur; mm.step++;
    }
  };
  mm.timer = setInterval(tick, 20); tick();
  gv = mm;
  const b = el.querySelector('[data-gv="play"]'); b.textContent = '■ Stop'; b.classList.add('on');
}
