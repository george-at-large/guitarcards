// Chord study: pick any chord, see it on the whole neck, and step or play through every voicing of a family.
import * as T from './theory.js';
import * as F from './fretboard.js';
import * as A from './audio.js';
import { fretboardSVG, esc } from './render.js';

const ROOTS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
const QUALITY_GROUPS = [
  ['Triads', ['maj', 'min', 'dim', 'aug', 'sus4', 'sus2']],
  ['7ths', ['maj7', '7', 'm7', 'm7b5', 'dim7', 'mMaj7', '6', 'm6', '7sus4', 'maj7#5', '7#5']],
  ['Extended', ['maj9', '9', 'm9', '6/9', 'm11', '11', '13', 'm13', 'maj7#11', '7#11']],
  ['Altered', ['7b9', '7#9', '7b13', '13b9', '7b9b13', '7#9b13', '7alt']],
];
// voicing families: which engine voicing, on which string sets
const FAMILIES = {
  tones: { label: 'Whole neck' },
  triads: { label: 'Triads', voicing: 'close', sets: [[3, 2, 1], [4, 3, 2], [5, 4, 3], [6, 5, 4]], size: 3 },
  drop2: { label: 'Drop 2', voicing: 'drop2', sets: [[4, 3, 2, 1], [5, 4, 3, 2], [6, 5, 4, 3]], size: 4 },
  drop3: { label: 'Drop 3', voicing: 'drop3', sets: [[6, 4, 3, 2], [5, 3, 2, 1]], size: 4 },
  drop24: { label: 'Drop 2&4', voicing: 'drop24', sets: [[6, 5, 3, 2], [5, 4, 2, 1]], size: 4 },
  shell: { label: 'Shells', voicing: 'shell', sets: [[6, 4, 3], [5, 3, 2], [6, 5, 4], [5, 4, 3]], size: 3 },
};
const S = { root: 'C', quality: 'maj7', fam: 'drop2', set: 'all', inv: 'all', ivs: null, names: false, idx: 0, bpm: 60, beats: 2, arp: false, loop: false, ghosts: true };
let timer = null;

const sym = () => T.pretty(T.chordSymbol(T.parseNote(S.root), S.quality));
const chordIvs = () => T.getChord(S.quality).ivs;
const pcOf = (iv) => (T.notePc(T.parseNote(S.root)) + T.intervalSemis(F.simpleIv(iv))) % 12;
const triadOf = (ivs) => {
  const third = ivs.find((x) => ['3', 'b3', '4', '2'].includes(x));
  const fifth = ivs.find((x) => ['5', 'b5', '#5'].includes(x)) || ivs.find((x) => ['b7', '7', 'bb7', '6'].includes(x));
  const t = ['1', third, fifth].filter(Boolean);
  return t.length === 3 ? t : ivs.slice(0, 3);
};
// families that make sense for this chord (no 4-note drops for a 3-note chord)
const famsFor = () => Object.keys(FAMILIES).filter((k) => !(FAMILIES[k].size === 4 && chordIvs().length < 4) && !(k === 'shell' && chordIvs().length < 4));

function voicings() {
  const fam = FAMILIES[S.fam];
  if (!fam || !fam.voicing) return [];
  const ivs = chordIvs();
  const tones = S.fam === 'triads' ? triadOf(ivs) : undefined;
  let out = [];
  for (const ss of fam.sets) {
    if (S.set !== 'all' && ss.join('') !== S.set) continue;
    try { out.push(...F.chordVoicings({ root: S.root, quality: S.quality, voicing: fam.voicing, tones, stringSet: ss, inversion: 'all' })); } catch (e) { /* no fit on this set */ }
  }
  if (S.inv !== 'all') out = out.filter((v) => F.simpleIv(v.bassIv) === S.inv);
  // up the neck, lowest string set first at each position
  out.sort((a, b) => a.minFret - b.minFret || b.stringSet[0] - a.stringSet[0]);
  return out;
}

function label(iv) {
  if (!S.names) return T.prettyIv(F.simpleIv(iv));
  return T.noteName(T.transpose(T.parseNote(S.root), F.simpleIv(iv)), true);
}

function neckDots(cur) {
  const ivs = chordIvs();
  const shown = S.ivs || new Set(ivs.map(F.simpleIv));
  const curKeys = new Set(cur ? cur.notes.map((n) => `${n.string}:${n.fret}`) : []);
  const dots = [];
  if (S.fam === 'tones' || S.ghosts) {
    for (let s = 1; s <= 6; s++) for (let f = 0; f <= F.MAX_FRET; f++) {
      const pc = F.midiAt(s, f) % 12;
      const iv = ivs.find((x) => pcOf(x) === pc);
      if (!iv || !shown.has(F.simpleIv(iv)) || curKeys.has(`${s}:${f}`)) continue;
      const kind = S.fam === 'tones' ? (F.simpleIv(iv) === '1' ? 'root' : 'tone') : 'ghost dim';
      dots.push({ string: s, fret: f, label: label(iv), kind });
    }
  }
  if (cur) for (const n of cur.notes) dots.push({ string: n.string, fret: n.fret, label: label(n.iv), kind: F.simpleIv(n.iv) === '1' ? 'root cur' : 'tone cur' });
  return dots;
}

export function renderChordStudy($app, { onBack }) {
  stop();
  if (!famsFor().includes(S.fam)) S.fam = famsFor()[1] || 'tones';
  const list = voicings();
  if (S.idx >= list.length) S.idx = 0;
  const cur = list[S.idx] || null;
  const ivs = chordIvs();
  const fam = FAMILIES[S.fam];
  const notes = ivs.map((iv) => T.noteName(T.transpose(T.parseNote(S.root), F.simpleIv(iv)), true));
  const sets = fam.sets ? fam.sets.map((s) => s.join('')) : [];
  const bassHave = new Set(fam.voicing ? voicingsAllInv().map((v) => F.simpleIv(v.bassIv)) : []);
  const bassOpts = ivs.map(F.simpleIv).filter((x) => bassHave.has(x));
  const famHTML = `<div class="seg csfam">${famsFor().map((k) => `<button data-fam="${k}" class="${k === S.fam ? 'on' : ''}">${FAMILIES[k].label}</button>`).join('')}</div>`;
  $app.innerHTML = `
  <div class="csstick">
    <div class="row spread cshead"><button class="icon" data-cs="back" aria-label="Back">←</button><div class="cssym">${esc(sym())}</div><div class="muted small csnotes">${notes.map(esc).join(' ')}</div></div>
    <div class="csneck" id="csneck">${fretboardSVG({ lo: 0, hi: F.MAX_FRET, dots: neckDots(cur), tappable: true })}</div>
    <div class="cscap" id="cscap">${capText(cur, list)}</div>
    ${fam.voicing ? `<div class="row csnav"><button data-cs="prev" aria-label="Previous voicing">◀</button><button class="primary grow" data-cs="play">▶ Play through</button><button data-cs="next" aria-label="Next voicing">▶</button></div>` : `<div class="row csnav"><button class="primary grow" data-cs="strum">▶ Hear the chord</button></div>`}
  </div>
  ${famHTML}
  ${fam.voicing ? `<div class="chips cssub"><span class="muted small">Strings</span>${['all', ...sets].map((s) => `<button class="chip ${S.set === s ? 'on' : ''}" data-set="${s}">${s === 'all' ? 'All' : s.split('').join('-')}</button>`).join('')}</div>
  <div class="chips cssub"><span class="muted small">Bass</span>${['all', ...bassOpts].map((b) => `<button class="chip ${S.inv === b ? 'on' : ''}" data-inv="${esc(b)}">${b === 'all' ? 'Any' : esc(T.prettyIv(b))}</button>`).join('')}</div>` : ''}
  <div class="chips cssub csivs"><span class="muted small">Show</span>${ivs.map((iv) => { const k = F.simpleIv(iv); const on = !S.ivs || S.ivs.has(k); return `<button class="chip ${on ? 'on' : ''}" data-iv="${esc(k)}">${esc(T.prettyIv(iv))}</button>`; }).join('')}<button class="chip" data-cs="guide">3 & 7</button><button class="chip" data-cs="allivs">All</button></div>
  <h3>Root</h3>
  <div class="chips csroots">${ROOTS.map((r) => `<button class="chip ${r === S.root ? 'on' : ''}" data-root="${r}">${esc(T.pretty(r))}</button>`).join('')}</div>
  <h3>Chord</h3>
  ${QUALITY_GROUPS.map(([g, qs]) => `<div class="small muted">${g}</div><div class="chips csqual">${qs.map((q) => `<button class="chip ${q === S.quality ? 'on' : ''}" data-qual="${q}">${esc(T.pretty(T.chordSymbol(T.parseNote(S.root), q)))}</button>`).join('')}</div>`).join('')}
  <h3>Options</h3>
  <div class="row csopts">${fam.voicing ? `<button data-cs="bpm-">−</button><span class="small">${S.bpm} bpm · ${S.beats} beats each</span><button data-cs="bpm+">+</button><button data-cs="beats">Beats</button><button data-cs="arp" class="${S.arp ? 'on' : ''}">Arpeggiate</button><button data-cs="loop" class="${S.loop ? 'on' : ''}">Loop</button>` : ''}</div>
  <div class="row csopts"><button data-cs="names" class="${S.names ? 'on' : ''}">Note names</button>${fam.voicing ? `<button data-cs="ghosts" class="${S.ghosts ? 'on' : ''}">Other chord tones</button>` : ''}</div>
  <p class="muted small">Tap any dot (or any fret) to hear it. ${S.fam === 'tones' ? '' : 'Faded dots are the same chord’s tones elsewhere on the neck.'}</p>`;
  scrollToCur(cur);
  $app.onclick = (e) => {
    const tap = e.target.closest('rect.tap');
    if (tap) { A.unlockAudio().then(() => A.pluck(F.midiAt(Number(tap.dataset.s), Number(tap.dataset.f)), A.audioCtx().currentTime + 0.02)); return; }
    const b = e.target.closest('button'); if (!b) return;
    const d = b.dataset;
    const redraw = () => renderChordStudy($app, { onBack });
    if (d.cs === 'back') { stop(); onBack(); return; }
    if (d.root) { S.root = d.root; S.idx = 0; return redraw(); }
    if (d.qual) { S.quality = d.qual; S.ivs = null; S.idx = 0; S.inv = 'all'; return redraw(); }
    if (d.fam) { S.fam = d.fam; S.set = 'all'; S.inv = 'all'; S.idx = 0; return redraw(); }
    if (d.set) { S.set = d.set; S.idx = 0; return redraw(); }
    if (d.inv) { S.inv = d.inv; S.idx = 0; return redraw(); }
    if (d.iv) { const all = new Set(ivs.map(F.simpleIv)); const cur2 = S.ivs || all; const n = new Set(cur2); n.has(d.iv) ? n.delete(d.iv) : n.add(d.iv); S.ivs = n.size === all.size ? null : n; return redraw(); }
    if (d.cs === 'guide') { S.ivs = new Set(ivs.map(F.simpleIv).filter((x) => /^(b?3|4|2|b?b?7|6)$/.test(x))); return redraw(); }
    if (d.cs === 'allivs') { S.ivs = null; return redraw(); }
    if (d.cs === 'names') { S.names = !S.names; return redraw(); }
    if (d.cs === 'ghosts') { S.ghosts = !S.ghosts; return redraw(); }
    if (d.cs === 'next' || d.cs === 'prev') { stop(); if (!list.length) return; S.idx = (S.idx + (d.cs === 'next' ? 1 : list.length - 1)) % list.length; show(list); sound(list[S.idx]); return; }
    if (d.cs === 'play') { if (timer) { stop(); b.textContent = '▶ Play through'; } else { b.textContent = '■ Stop'; playThrough(list, b); } return; }
    if (d.cs === 'strum') { const lo = lowestShape(); A.unlockAudio().then(() => A.strum(lo, A.audioCtx().currentTime + 0.05)); return; }
    if (d.cs === 'bpm-' || d.cs === 'bpm+') { S.bpm = Math.max(30, Math.min(200, S.bpm + (d.cs === 'bpm+' ? 10 : -10))); return redraw(); }
    if (d.cs === 'beats') { S.beats = { 1: 2, 2: 4, 4: 1 }[S.beats]; return redraw(); }
    if (d.cs === 'arp') { S.arp = !S.arp; return redraw(); }
    if (d.cs === 'loop') { S.loop = !S.loop; return redraw(); }
  };
}

function voicingsAllInv() { const k = S.inv; S.inv = 'all'; const v = voicings(); S.inv = k; return v; }
function capText(cur, list) {
  if (S.fam === 'tones') return `<b>${esc(sym())}</b> everywhere on the neck. Toggle intervals above (try <b>3 & 7 only</b>), or pick a voicing family.`;
  if (!cur) return '<span class="muted">No voicing of this family fits here — try other strings or bass.</span>';
  const frets = [6, 5, 4, 3, 2, 1].map((s) => { const n = cur.notes.find((x) => x.string === s); return n ? n.fret : 'x'; }).join(' ');
  return `<b>${S.idx + 1}/${list.length}</b> · ${esc(cur.label.replace(/(^|[\s(-])b(\d)/g, '$1♭$2').replace(/#(\d)/g, '♯$1'))} · strings ${cur.stringSet.join('-')}<br><span class="muted small">Low→high: ${cur.notes.map((n) => esc(T.prettyIv(F.simpleIv(n.iv)))).join(' ')} · frets ${frets}</span>`;
}
function show(list) {
  const cur = list[S.idx];
  document.getElementById('csneck').innerHTML = fretboardSVG({ lo: 0, hi: F.MAX_FRET, dots: neckDots(cur), tappable: true });
  document.getElementById('cscap').innerHTML = capText(cur, list);
  scrollToCur(cur);
}
function scrollToCur(cur) {
  const box = document.getElementById('csneck'); if (!box || !cur) return;
  const svg = box.querySelector('svg'); if (!svg || box.scrollWidth <= box.clientWidth) return;
  const frac = ((cur.minFret + cur.maxFret) / 2 + 0.5) / (F.MAX_FRET + 1);
  box.scrollTo({ left: Math.max(0, frac * box.scrollWidth - box.clientWidth / 2), behavior: 'smooth' });
}
function sound(v, t) {
  const midis = v.notes.map((n) => n.midi).sort((a, b) => a - b);
  A.unlockAudio().then(() => {
    const t0 = t ?? A.audioCtx().currentTime + 0.03;
    A.strum(midis, t0);
    if (S.arp) { const step = (60 / S.bpm) * S.beats / (midis.length + 1); midis.forEach((m, i) => A.pluck(m, t0 + step * (i + 1), { vel: 0.7 })); }
  });
}
function playThrough(list, btn) {
  if (!list.length) return;
  A.unlockAudio().then(() => A.ensureRunning()).then(() => {
    const tick = () => {
      show(list); sound(list[S.idx]);
      timer = setTimeout(() => {
        if (S.idx + 1 >= list.length && !S.loop) { stop(); S.idx = list.length - 1; if (btn) btn.textContent = '▶ Play through'; return; }
        S.idx = (S.idx + 1) % list.length; tick();
      }, (60 / S.bpm) * S.beats * 1000);
    };
    tick();
  });
}
function lowestShape() {
  const ivs = chordIvs();
  try { const v = F.chordVoicings({ root: S.root, quality: S.quality, voicing: ivs.length < 4 ? 'close' : 'drop2', stringSet: ivs.length < 4 ? [4, 3, 2] : [5, 4, 3, 2], inversion: 0 }); if (v.length) return v[0].notes.map((n) => n.midi); } catch (e) { /* */ }
  return ivs.map((iv) => 48 + pcOf(iv));
}
export function stop() { if (timer) { clearTimeout(timer); timer = null; } A.hush(); }
