// Chord study: pick any chord, see it on the whole neck, and step or play through every voicing of a family.
import * as T from './theory.js';
import * as F from './fretboard.js';
import * as A from './audio.js';
import { esc } from './render.js';
import * as SI from './superimpose.js';

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
  open: { label: 'Open position', grips: true },
  triads: { label: 'Triads', voicing: 'close', sets: [[3, 2, 1], [4, 3, 2], [5, 4, 3], [6, 5, 4]], size: 3 },
  spread: { label: 'Open triads', voicing: 'spread', sets: [[6, 4, 3], [5, 3, 2], [4, 2, 1], [6, 5, 3], [5, 4, 2]], size: 3 },
  drop2: { label: 'Drop 2', voicing: 'drop2', sets: [[4, 3, 2, 1], [5, 4, 3, 2], [6, 5, 4, 3]], size: 4 },
  drop3: { label: 'Drop 3', voicing: 'drop3', sets: [[6, 4, 3, 2], [5, 3, 2, 1]], size: 4 },
  drop24: { label: 'Drop 2&4', voicing: 'drop24', sets: [[6, 5, 3, 2], [5, 4, 2, 1]], size: 4 },
  super: { label: 'Superimpose', si: true, sets: [[3, 2, 1], [4, 3, 2], [5, 4, 3], [6, 5, 4]] },
  shell: { label: 'Shells', voicing: 'shell', sets: [[6, 4, 3], [5, 3, 2], [6, 5, 4], [5, 4, 3]], size: 3 },
};
const S = { root: 'C', quality: 'maj7', fam: 'drop2', set: 'all', inv: 'all', ivs: null, names: false, idx: 0, bpm: 60, beats: 2, arp: false, loop: false, ghosts: true, si: 0 };
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
const gripCache = new Map();
const hasOpen = () => { const k = S.root + S.quality; if (!gripCache.has(k)) gripCache.set(k, openGrips().length > 0); return gripCache.get(k); };
const famsFor = () => Object.keys(FAMILIES).filter((k) => !(FAMILIES[k].size === 4 && chordIvs().length < 4) && !(k === 'shell' && chordIvs().length < 4) && !(k === 'open' && !hasOpen()) && !(k === 'super' && !SI.menuKey(S.quality)));

// the superimposed structure currently picked for this chord
function siNow() {
  const key = SI.menuKey(S.quality); if (!key) return null;
  const items = SI.menu(key).items;
  if (S.si >= items.length) S.si = 0;
  const item = items[S.si];
  const st = SI.structure(S.root, key, item);
  const tensionOf = (pc) => st.tensions[st.pcs.indexOf(pc)];
  return { key, items, item, st, tensionOf };
}
function siVoicings(fam) {
  const x = siNow(); if (!x || !x.st.triad) return [];
  const out = [];
  for (const ss of fam.sets) {
    if (S.set !== 'all' && ss.join('') !== S.set) continue;
    try { out.push(...F.chordVoicings({ root: x.st.sroot, quality: x.st.triad, voicing: 'close', stringSet: ss, inversion: 'all' })); } catch (e) { /* no fit */ }
  }
  for (const v of out) v.notes = v.notes.map((n) => ({ ...n, tension: x.tensionOf(n.midi % 12) }));
  return out.sort((a, b) => a.minFret - b.minFret || b.stringSet[0] - a.stringSet[0]);
}

function voicings() {
  const fam = FAMILIES[S.fam];
  if (fam && fam.si) return siVoicings(fam);
  if (fam && fam.grips) return openGrips().filter((v) => S.inv === 'all' || F.simpleIv(v.bassIv) === S.inv);
  if (!fam || !fam.voicing) return [];
  const ivs = chordIvs();
  const tones = S.fam === 'triads' || S.fam === 'spread' ? triadOf(ivs) : undefined;
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

// open-position grips: every playable shape in frets 0–4 that uses open strings, has the root in the bass
// and every chord tone (the 5th may be left out)
function openGrips() {
  const ivs = chordIvs();
  const need = ivs.filter((iv) => !['5'].includes(F.simpleIv(iv)) || ivs.length < 4);
  const must = ivs.length > 4 ? need.filter((iv) => !['9', '11'].includes(iv)) : need;
  const ivAt = (s, f) => ivs.find((iv) => pcOf(iv) === F.midiAt(s, f) % 12);
  const opts = [6, 5, 4, 3, 2, 1].map((s) => [null, ...[0, 1, 2, 3, 4].filter((f) => ivAt(s, f))]);
  const out = [];
  const rec = (i, acc) => {
    if (i === 6) {
      const notes = acc.map((f, k) => (f === null ? null : { string: 6 - k, fret: f, midi: F.midiAt(6 - k, f), iv: ivAt(6 - k, f) })).filter(Boolean);
      if (notes.length < Math.min(4, ivs.length + 1) || !notes.some((n) => n.fret === 0)) return;
      const first = acc.findIndex((f) => f !== null);
      if (acc.slice(first).some((f) => f === null)) return; // no muted strings inside the grip
      if (F.simpleIv(notes[0].iv) !== '1') return;
      const have = new Set(notes.map((n) => F.simpleIv(n.iv)));
      if (!must.every((iv) => have.has(F.simpleIv(iv)))) return;
      const fr = notes.filter((n) => n.fret > 0).map((n) => n.fret);
      if (fr.length && Math.max(...fr) - Math.min(...fr) > 3) return;
      const lo = fr.length ? Math.min(...fr) : 0;
      const atLo = fr.filter((f) => f === lo).length;
      const fingers = fr.length - (atLo > 2 ? atLo - 1 : 0);
      if (fingers > 4) return;
      const grip = [6, 5, 4, 3, 2, 1].map((s2) => { const n = notes.find((x) => x.string === s2); return n ? n.fret : 'x'; }).join('');
      out.push({ notes, minFret: Math.min(...notes.map((n) => n.fret)), maxFret: Math.max(...notes.map((n) => n.fret)), stringSet: notes.map((n) => n.string), bassIv: notes[0].iv,
        label: `Open grip ${grip}`, score: notes.length * 3 - fingers - (fr.length ? Math.max(...fr) : 0) * 0.5 });
      return;
    }
    for (const f of opts[i]) rec(i + 1, [...acc, f]);
  };
  rec(0, []);
  out.sort((a, b) => b.score - a.score);
  // keep the best few distinct shapes (one per bass string)
  const seen = new Map();
  for (const g of out) { const k = g.notes[0].string; if ((seen.get(k) || []).length < 2) seen.set(k, [...(seen.get(k) || []), g]); }
  return [...seen.values()].flat().sort((a, b) => b.notes[0].string - a.notes[0].string || b.score - a.score);
}

function label(iv) {
  if (!S.names) return T.prettyIv(F.simpleIv(iv));
  return T.noteName(T.transpose(T.parseNote(S.root), F.simpleIv(iv)), true);
}

function neckDots(cur) {
  if (S.fam === 'super') return siDots(cur);
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

// chord tones faded underneath, the superimposed notes everywhere (labelled as tensions), the current triad shape on top
function siDots(cur) {
  const x = siNow(); if (!x) return [];
  const ivs = chordIvs();
  const curKeys = new Set(cur ? cur.notes.map((n) => `${n.string}:${n.fret}`) : []);
  const names = (pc) => x.st.names[x.st.pcs.indexOf(pc)];
  const dots = [];
  for (let s = 1; s <= 6; s++) for (let f = 0; f <= F.MAX_FRET; f++) {
    if (curKeys.has(`${s}:${f}`)) continue;
    const pc = F.midiAt(s, f) % 12;
    if (x.st.pcs.includes(pc)) dots.push({ string: s, fret: f, label: S.names ? names(pc) : x.tensionOf(pc), kind: cur ? 'mark dim' : 'mark' });
    else if (S.ghosts) { const iv = ivs.find((y) => pcOf(y) === pc); if (iv) dots.push({ string: s, fret: f, label: label(iv), kind: 'ghost dim' }); }
  }
  if (cur) for (const n of cur.notes) dots.push({ string: n.string, fret: n.fret, label: S.names ? names(n.midi % 12) : n.tension, kind: 'mark cur' });
  return dots;
}

// the neck stood upright, like a chord box: low E on the left, the nut at the top, frets 0–17 going down
const INL = [3, 5, 7, 9, 15, 17];
function vneckSVG(dots, cur) {
  const left = 30, sp = 27, nutY = 30, fh = 30, nF = F.MAX_FRET;
  const W = left + 5 * sp + 16, H = nutY + nF * fh + 8;
  const x = (s) => left + (6 - s) * sp;
  const y = (f) => (f === 0 ? nutY - 14 : nutY + (f - 0.5) * fh);
  let g = '';
  for (let f = 1; f <= nF; f++) {
    g += `<line x1="${x(6)}" y1="${nutY + f * fh}" x2="${x(1)}" y2="${nutY + f * fh}" class="wire"/>`;
    g += `<text x="12" y="${y(f) + 3.5}" class="fretnum${INL.includes(f) || f === 12 ? ' strong' : ''}">${f}</text>`;
    if (INL.includes(f)) g += `<circle cx="${(x(4) + x(3)) / 2}" cy="${y(f)}" r="4" class="inlay"/>`;
    if (f === 12) g += `<circle cx="${(x(5) + x(4)) / 2}" cy="${y(f)}" r="4" class="inlay"/><circle cx="${(x(3) + x(2)) / 2}" cy="${y(f)}" r="4" class="inlay"/>`;
  }
  g += `<line x1="${x(6) - 2}" y1="${nutY}" x2="${x(1) + 2}" y2="${nutY}" class="nut"/>`;
  for (let s = 1; s <= 6; s++) g += `<line x1="${x(s)}" y1="${nutY}" x2="${x(s)}" y2="${H - 6}" class="string s${s}"/>`;
  for (let s = 1; s <= 6; s++) for (let f = 0; f <= nF; f++) g += `<rect x="${x(s) - sp / 2}" y="${f === 0 ? 4 : nutY + (f - 1) * fh}" width="${sp}" height="${f === 0 ? nutY - 6 : fh}" class="tap" data-s="${s}" data-f="${f}"/>`;
  if (cur) for (let s2 = 1; s2 <= 6; s2++) if (!cur.notes.some((n) => n.string === s2)) g += `<text x="${x(s2)}" y="${nutY - 10}" class="mute">×</text>`;
  for (const d of dots) g += `<g class="dot ${d.kind || 'tone'}"><circle cx="${x(d.string)}" cy="${y(d.fret)}" r="10"/>${d.label ? `<text x="${x(d.string)}" y="${y(d.fret) + 3.5}">${esc(d.label)}</text>` : ''}</g>`;
  return `<svg viewBox="0 0 ${W} ${H}" class="fretboard vneck" preserveAspectRatio="xMidYMin meet">${g}</svg>`;
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
  const bassHave = new Set(fam.voicing || fam.grips ? voicingsAllInv().map((v) => F.simpleIv(v.bassIv)) : []);
  const bassOpts = ivs.map(F.simpleIv).filter((x) => bassHave.has(x));
  $app.innerHTML = `
  <div class="row spread cshead"><button class="icon" data-cs="back" aria-label="Back">←</button><div class="cssym">${esc(sym())}</div><div class="muted small csnotes">${notes.map(esc).join(' ')}</div></div>
  <div class="cswrap">
    <div class="csneck" id="csneck">${vneckSVG(neckDots(cur), cur)}</div>
    <div class="csside">
      <div class="cscap" id="cscap">${capText(cur, list)}</div>
      ${fam.si ? `<div class="csnav">${siNow()?.st.triad ? '<button data-cs="prev" aria-label="Previous shape">▲</button>' : ''}<button class="primary" data-cs="${siNow()?.st.triad ? 'play' : 'siplay'}">▶ Hear it</button>${siNow()?.st.triad ? '<button data-cs="next" aria-label="Next shape">▼</button>' : ''}</div>` : fam.voicing || fam.grips ? `<div class="csnav"><button data-cs="prev" aria-label="Previous voicing">▲</button><button class="primary" data-cs="play">▶ Play</button><button data-cs="next" aria-label="Next voicing">▼</button></div>` : `<div class="csnav"><button class="primary" data-cs="strum">▶ Hear it</button></div>`}
      <div class="csfam">${famsFor().map((k) => `<button data-fam="${k}" class="${k === S.fam ? 'on' : ''}">${FAMILIES[k].label}</button>`).join('')}</div>
    </div>
  </div>
  ${fam.si ? `<div class="chips cssub cssi"><span class="muted small">Play</span>${siNow().items.map((it, i) => `<button class="chip ${i === S.si ? 'on' : ''}" data-si="${i}">${esc(it.deg)} ${esc(SI.shapeName(it.shape).replace('major ', 'maj ').replace('minor ', 'min ').replace('pentatonic', 'pent'))} <span class="muted">· ${esc(it.result)}</span></button>`).join('')}</div><div class="panel cswhy"><h4>Why it works</h4><ul>${SI.explain(S.root, siNow().key, siNow().item).map((x) => `<li><b>${esc(x.k)}.</b> ${esc(x.t)}</li>`).join('')}</ul></div>` : ''}
  ${fam.voicing || (fam.si && siNow()?.st.triad) ? `<div class="chips cssub"><span class="muted small">Strings</span>${['all', ...sets].map((s) => `<button class="chip ${S.set === s ? 'on' : ''}" data-set="${s}">${s === 'all' ? 'All' : s.split('').join('-')}</button>`).join('')}</div>` : ''}
  ${fam.voicing || fam.grips ? `<div class="chips cssub"><span class="muted small">Bass</span>${['all', ...bassOpts].map((b) => `<button class="chip ${S.inv === b ? 'on' : ''}" data-inv="${esc(b)}">${b === 'all' ? 'Any' : esc(T.prettyIv(b))}</button>`).join('')}</div>` : ''}
  <div class="chips cssub csivs"><span class="muted small">Show</span>${ivs.map((iv) => { const k = F.simpleIv(iv); const on = !S.ivs || S.ivs.has(k); return `<button class="chip ${on ? 'on' : ''}" data-iv="${esc(k)}">${esc(T.prettyIv(iv))}</button>`; }).join('')}<button class="chip" data-cs="guide">3 & 7</button><button class="chip" data-cs="allivs">All</button></div>
  <h3>Root</h3>
  <div class="chips csroots">${ROOTS.map((r) => `<button class="chip ${r === S.root ? 'on' : ''}" data-root="${r}">${esc(T.pretty(r))}</button>`).join('')}</div>
  <h3>Chord</h3>
  ${QUALITY_GROUPS.map(([g, qs]) => `<div class="small muted">${g}</div><div class="chips csqual">${qs.map((q) => `<button class="chip ${q === S.quality ? 'on' : ''}" data-qual="${q}">${esc(T.pretty(T.chordSymbol(T.parseNote(S.root), q)))}</button>`).join('')}</div>`).join('')}
  <h3>Options</h3>
  <div class="row csopts">${fam.voicing || fam.grips ? `<button data-cs="bpm-">−</button><span class="small">${S.bpm} bpm · ${S.beats} beats each</span><button data-cs="bpm+">+</button><button data-cs="beats">Beats</button><button data-cs="arp" class="${S.arp ? 'on' : ''}">Arpeggiate</button><button data-cs="loop" class="${S.loop ? 'on' : ''}">Loop</button>` : ''}</div>
  <div class="row csopts"><button data-cs="names" class="${S.names ? 'on' : ''}">Note names</button>${fam.voicing || fam.grips ? `<button data-cs="ghosts" class="${S.ghosts ? 'on' : ''}">Other chord tones</button>` : ''}</div>
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
    if (d.si) { S.si = Number(d.si); S.idx = 0; S.set = 'all'; redraw(); siHear(); return; }
    if (d.cs === 'siplay') { siHear(); return; }
    if (d.set) { S.set = d.set; S.idx = 0; return redraw(); }
    if (d.inv) { S.inv = d.inv; S.idx = 0; return redraw(); }
    if (d.iv) { const all = new Set(ivs.map(F.simpleIv)); const cur2 = S.ivs || all; const n = new Set(cur2); n.has(d.iv) ? n.delete(d.iv) : n.add(d.iv); S.ivs = n.size === all.size ? null : n; return redraw(); }
    if (d.cs === 'guide') { S.ivs = new Set(ivs.map(F.simpleIv).filter((x) => /^(b?3|4|2|b?b?7|6)$/.test(x))); return redraw(); }
    if (d.cs === 'allivs') { S.ivs = null; return redraw(); }
    if (d.cs === 'names') { S.names = !S.names; return redraw(); }
    if (d.cs === 'ghosts') { S.ghosts = !S.ghosts; return redraw(); }
    if (d.cs === 'next' || d.cs === 'prev') { stop(); if (!list.length) return; S.idx = (S.idx + (d.cs === 'next' ? 1 : list.length - 1)) % list.length; show(list); sound(list[S.idx]); return; }
    if (d.cs === 'play') { if (timer) { stop(); b.textContent = '▶ Play'; } else { b.textContent = '■ Stop'; playThrough(list, b); } return; }
    if (d.cs === 'strum') { const lo = lowestShape(); A.unlockAudio().then(() => A.strum(lo, A.audioCtx().currentTime + 0.05)); return; }
    if (d.cs === 'bpm-' || d.cs === 'bpm+') { S.bpm = Math.max(30, Math.min(200, S.bpm + (d.cs === 'bpm+' ? 10 : -10))); return redraw(); }
    if (d.cs === 'beats') { S.beats = { 1: 2, 2: 4, 4: 1 }[S.beats]; return redraw(); }
    if (d.cs === 'arp') { S.arp = !S.arp; return redraw(); }
    if (d.cs === 'loop') { S.loop = !S.loop; return redraw(); }
  };
}

function voicingsAllInv() { const k = S.inv; S.inv = 'all'; const v = voicings(); S.inv = k; return v; }
function capText(cur, list) {
  if (S.fam === 'super') {
    const x = siNow(); if (!x) return '';
    const head = `<b>${esc(x.st.name)}</b> over <b>${esc(sym())}</b> → <b>${esc(x.st.tensions.join(' '))}</b><br><span class="small">${esc(x.item.result)} · ${esc(x.item.scale)}</span>`;
    const where = cur ? `<br><span class="muted small">${S.idx + 1}/${list.length} · strings ${cur.stringSet.join('-')} · low→high ${cur.notes.map((n) => esc(n.tension)).join(' ')}</span>` : '';
    return head + where;
  }
  if (S.fam === 'tones') return `<b>${esc(sym())}</b> everywhere on the neck. Toggle intervals above (try <b>3 & 7 only</b>), or pick a voicing family.`;
  if (!cur) return '<span class="muted">No voicing of this family fits here — try other strings or bass.</span>';
  const frets = [6, 5, 4, 3, 2, 1].map((s) => { const n = cur.notes.find((x) => x.string === s); return n ? n.fret : 'x'; }).join(' ');
  return `<b>${S.idx + 1}/${list.length}</b> · ${esc(cur.label.replace(/(^|[\s(-])b(\d)/g, '$1♭$2').replace(/#(\d)/g, '♯$1'))} · strings ${cur.stringSet.join('-')}<br><span class="muted small">Low→high: ${cur.notes.map((n) => esc(T.prettyIv(F.simpleIv(n.iv)))).join(' ')} · frets ${frets}</span>`;
}
function show(list) {
  const cur = list[S.idx];
  document.getElementById('csneck').innerHTML = vneckSVG(neckDots(cur), cur);
  document.getElementById('cscap').innerHTML = capText(cur, list);
  scrollToCur(cur);
}
function scrollToCur() { /* the whole upright neck is always in view */ }
// the chord, then the superimposed shape over it
function siHear(v) {
  const x = siNow(); if (!x) return;
  const chord = lowestShape();
  const beat = 60 / Math.max(60, S.bpm);
  A.unlockAudio().then(() => {
    const t0 = A.audioCtx().currentTime + 0.05;
    A.strum(chord, t0, { vel: 0.6 });
    let top;
    if (v) top = v.notes.map((n) => n.midi).sort((a, b) => a - b);
    else {
      // the structure's notes ascending from just above the chord, two octaves of a pentatonic or one of a triad
      top = []; for (let m = Math.max(...chord) - 4; top.length < (x.st.triad ? 4 : 11); m++) if (x.st.pcs.includes(m % 12)) top.push(m);
    }
    if (v) { A.strum(chord, t0 + beat, { vel: 0.5 }); A.strum(top, t0 + beat, { vel: 0.8 }); }
    top.forEach((m, i) => A.pluck(m, t0 + beat * (v ? 2 : 1) + i * beat * 0.5, { vel: 0.75 }));
  });
}
function sound(v, t) {
  if (S.fam === 'super') return siHear(v);
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
        if (S.idx + 1 >= list.length && !S.loop) { stop(); S.idx = list.length - 1; if (btn) btn.textContent = '▶ Play'; return; }
        S.idx = (S.idx + 1) % list.length; tick();
      }, (60 / (S.fam === 'super' ? Math.max(60, S.bpm) : S.bpm)) * (S.fam === 'super' ? 4 : S.beats) * 1000);
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
