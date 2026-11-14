// Call and response: the app plays a short question in a scale, you answer in the same number of bars, back and
// forth. Questions are generated so there's no end to them, built the way melodies are: a rhythm cell per bar (real
// phrase rhythms, more syncopated at higher levels), mostly steps with leaps that turn back, a motif repeated or
// sequenced in the second bar, accents on the beat, and an ending left open (on the 2nd, 4th, 5th or 7th) so it asks
// for an answer. A model answer can follow: the same rhythm, heading home to the 1 or 3.
import * as T from '../theory.js';
import * as F from '../fretboard.js';
import * as A from '../audio.js';
import * as G from './grips.js';
import * as SC from './scales.js';

const IVN = ['1', 'b2', '2', 'b3', '3', '4', '#4', '5', 'b6', '6', 'b7', '7'];
const BY = Object.fromEntries(SC.SCALES.map((s) => [s.id, s]));
const pick = (a) => a[Math.floor(Math.random() * a.length)];
const wpick = (pairs) => { let r = Math.random() * pairs.reduce((s, p) => s + p[1], 0); for (const [v, w] of pairs) { r -= w; if (r <= 0) return v; } return pairs[0][0]; };

// ---------- rhythm: time signatures and styles on a grid of 6 ticks per eighth ----------
// (so sixteenths are 3 ticks, eighth triplets 4, swung eighths 8 + 4). A bar is a list of beat groups: 12 ticks for a
// quarter-note beat, 18 for a dotted quarter (compound time); 7/8 is 2 + 2 + 3 eighths.
export const METERS = {
  '4/4': { groups: [12, 12, 12, 12], beat: 12 }, '3/4': { groups: [12, 12, 12], beat: 12 }, '2/4': { groups: [12, 12], beat: 12 },
  '5/4': { groups: [12, 12, 12, 12, 12], beat: 12 }, '6/8': { groups: [18, 18], beat: 18 }, '9/8': { groups: [18, 18, 18], beat: 18 },
  '12/8': { groups: [18, 18, 18, 18], beat: 18 }, '7/8': { groups: [12, 12, 18], beat: 12 },
};
// figures that fill one beat group, by style (negative = a rest)
const FIG = {
  plain: { 12: [[12], [6, 6], [12], [-6, 6]], 18: [[18], [12, 6], [6, 6, 6]] },
  dotted: { 12: [[9, 3], [6, 3, 3], [9, 3], [3, 9]], 18: [[9, 3, 6], [12, 6], [6, 9, 3]] },
  sixteenths: { 12: [[3, 3, 3, 3], [6, 3, 3], [3, 3, 6], [3, 6, 3]], 18: [[3, 3, 6, 6], [6, 3, 3, 6], [6, 6, 3, 3]] },
  triplets: { 12: [[4, 4, 4], [8, 4], [4, 8], [12]], 18: [[6, 6, 6], [12, 6], [6, 12]] },
  swing: { 12: [[8, 4], [12], [8, 4], [-8, 4]], 18: [[12, 6], [6, 6, 6]] },
  syncopated: { 12: [[-6, 6], [3, 6, 3], [6, 6], [-3, 9]], 18: [[-6, 12], [6, 12], [-6, 6, 6]] },
  sparse: { 12: [[12], [-12], [-6, 6]], 18: [[18], [-18], [-12, 6]] },
};
export const STYLES = [['auto', 'Auto'], ['plain', 'Plain'], ['dotted', 'Dotted'], ['sixteenths', 'Sixteenths'], ['triplets', 'Triplets'], ['swing', 'Swing'], ['syncopated', 'Syncopated'], ['sparse', 'Sparse'], ['clave', 'Clave'], ['mixed', 'Mixed']];
const AUTO = { 1: ['plain', 'plain', 'sparse'], 2: ['plain', 'dotted', 'sixteenths', 'swing'], 3: ['syncopated', 'sixteenths', 'dotted', 'triplets'] };
// one or more bars of rhythm: [{ s, len }] in ticks from the start
function makeRhythm(meter, bars, style, level) {
  const M = METERS[meter], barLen = M.groups.reduce((a, b) => a + b, 0);
  for (let tries = 0; tries < 30; tries++) {
    const hits = [];
    for (let b = 0; b < bars; b++) {
      let t = b * barLen;
      // clave: the tresillo (3 + 3 + 2 eighths) laid over the bar where it fits
      if (style === 'clave' && barLen % 48 === 0) {
        for (const [o, l] of [[0, 18], [18, 18], [36, 12]]) hits.push({ s: t + o, len: l });
        if (barLen > 48) for (let x = 48; x < barLen; x += 12) hits.push({ s: t + x, len: 12 });
        continue;
      }
      for (const g of M.groups) {
        const st = style === 'auto' ? pick(AUTO[level]) : style === 'mixed' || style === 'clave' ? pick(['plain', 'dotted', 'sixteenths', 'triplets', 'syncopated', 'swing']) : style;
        const figs = FIG[st][g] || FIG.plain[g];
        let f = pick(figs);
        // triplets only fit quarter beats; compound beats take their own threes
        let o = t;
        for (const d of f) { if (d > 0) hits.push({ s: o, len: d }); o += Math.abs(d); }
        t += g;
      }
    }
    // syncopation: sometimes tie a note into the next beat
    if (style === 'syncopated' || (style === 'auto' && level === 3)) for (let i = 0; i < hits.length - 1; i++) if (Math.random() < 0.25 && hits[i].s + hits[i].len === hits[i + 1].s && hits[i + 1].s % M.beat === 0) { hits[i].len += hits[i + 1].len; hits.splice(i + 1, 1); }
    const min = level === 1 ? 3 : 4;
    if (hits.length >= Math.min(min, bars * 3) && hits.length <= bars * (level === 1 ? 7 : 12)) return hits;
  }
  return Array.from({ length: bars * M.groups.length }, (_, i) => ({ s: i * M.groups[0], len: M.groups[0] }));
}

// the scale as a ladder of midi notes around the tonic, and which rungs are which degree
function ladder(tonicPc, id) {
  const pcs = [...new Set(BY[id].ivs.map((iv) => T.intervalSemis(F.simpleIv(iv)) % 12))].sort((a, b) => a - b);
  const base = 48 + tonicPc; // the tonic around C3–B3
  const notes = [];
  for (let oct = -1; oct <= 2; oct++) for (const p of pcs) notes.push({ midi: base + oct * 12 + p, rel: p });
  const zero = notes.findIndex((n) => n.midi === base);
  return { notes, zero, n: pcs.length, pcs };
}
// open endings (questions) and closed ones (answers), as semitones above the tonic
const OPEN_END = [2, 5, 7, 11, 9];
const CLOSED_END = [0, 3, 4];

function phrase(L, bars, level, { end, rhythm, start = null, range = [-3, 9], barLen = 48 }) {
  const hits = rhythm.map((h) => ({ ...h }));
  const contour = pick(['arch', 'up', 'down', 'wave', 'valley']);
  const chordIdx = L.pcs.map((p, i) => ([0, 3, 4, 7].includes(p) ? i : -1)).filter((i) => i >= 0);
  let idx = start !== null ? start : L.zero + pick(chordIdx.length ? chordIdx : [0]) + (Math.random() < 0.3 ? L.n : 0) - (Math.random() < 0.2 ? L.n : 0);
  const lo = L.zero + range[0], hi = L.zero + range[1];
  idx = Math.max(lo, Math.min(hi, idx));
  const out = [];
  let lastMove = 0;
  hits.forEach((h, k) => {
    if (k > 0) {
      const frac = k / Math.max(1, hits.length - 1);
      const want = { arch: frac < 0.55 ? 1 : -1, up: 1, down: -1, wave: Math.sin(frac * Math.PI * 2) >= 0 ? 1 : -1, valley: frac < 0.5 ? -1 : 1 }[contour];
      let mv;
      if (Math.abs(lastMove) >= 2) mv = -Math.sign(lastMove); // after a leap, step back the other way
      else mv = wpick([[want, 40], [-want, 14], [2 * want, 14], [-2 * want, 5], [3 * want, 7], [4 * want, 3], [0, 8 + (level === 1 ? 4 : 0)]]);
      if (idx + mv < lo || idx + mv > hi) mv = -mv;
      idx += mv; lastMove = mv;
    }
    out.push({ ...h, idx });
  });
  // a motif: in two-bar phrases, half the time bar 2 echoes bar 1's shape a step or two away
  const b1 = out.filter((x) => x.s < barLen), b2 = out.filter((x) => x.s >= barLen);
  if (bars === 2 && start === null && Math.random() < 0.5 && b1.length === b2.length) {
    const shift = pick([-2, -1, 1, 2]);
    b2.forEach((x, k) => { x.idx = Math.max(lo, Math.min(hi, b1[k].idx + shift)); });
  }
  // the ending: the nearest rung that is an open (question) or closed (answer) degree
  const last = out[out.length - 1];
  const targets = end === 'open' ? OPEN_END : CLOSED_END;
  let best = last.idx, bd = Infinity;
  for (let i = lo; i <= hi; i++) if (targets.includes(L.notes[i].rel) && !(end === 'open' && L.notes[i].rel === 0)) { const d = Math.abs(i - last.idx) + (end === 'closed' && L.notes[i].rel !== 0 ? 0.6 : 0); if (d < bd) { bd = d; best = i; } }
  last.idx = best;
  last.len = Math.max(1, Math.min(Math.max(last.len, 9), bars * barLen - last.s)); // ring, but stop at the bar line
  return out.map((x) => ({ ...x, midi: L.notes[x.idx].midi, rel: L.notes[x.idx].rel }));
}

// where each note sits in the CAGED position: the lowest comfortable string with that pitch inside the window
function placeOnNeck(notes, pos) {
  let prevString = 3;
  return notes.map((n) => {
    let best = null, bs = Infinity;
    for (let s = 1; s <= 6; s++) {
      const f = n.midi - F.OPEN[s];
      if (f < 0 || f > 17) continue;
      const out = Math.max(0, pos.lo - f, f - pos.hi);
      const sc = out * 4 + Math.abs(s - prevString) * 0.6;
      if (sc < bs) { bs = sc; best = { string: s, fret: f }; }
    }
    if (best) prevString = best.string;
    return { ...n, ...best };
  });
}
// shift a phrase by octaves so it lies in the position
function fitOctave(notes, pos) {
  const lowest = F.OPEN[6] + Math.max(0, pos.lo - 1), highest = F.OPEN[1] + pos.hi + 1;
  let shift = 0;
  const lo = Math.min(...notes.map((n) => n.midi)), hi = Math.max(...notes.map((n) => n.midi));
  while (hi + shift > highest && lo + shift - 12 >= lowest) shift -= 12;
  while (lo + shift < lowest && hi + shift + 12 <= highest) shift += 12;
  return notes.map((n) => ({ ...n, midi: n.midi + shift }));
}

// ---------- the screen ----------
export function renderCall($app, ctx) {
  const { D, save, neckSVG, esc, fmt, onBack, keys } = ctx;
  const C = D.cr = Object.assign({ tonic: 'A', scale: 'min-pent', shape: 'E', level: 1, bars: 1, bpm: 80, drone: true, show: true, model: false, meter: '4/4', style: 'auto' }, D.cr || {});
  const M = () => METERS[C.meter] || METERS['4/4'];
  const barTicks = () => M().groups.reduce((a, b) => a + b, 0);
  let running = false, timers = [], q = null, ans = null, phase = 'idle', count = 0;
  const tonic = () => T.parseNote(C.tonic);
  const pos = () => G.positionOf(tonic(), C.shape);
  const L = () => ladder(T.notePc(tonic()), C.scale);
  const deg = (rel) => T.prettyIv(IVN[rel]);
  const kind = (rel) => (rel === 0 ? 'r' : rel === 3 || rel === 4 ? 't3' : rel === 7 ? 't5' : rel === 10 || rel === 11 ? 't7' : 'tx');

  function later(ms, fn) { const id = setTimeout(fn, Math.max(0, ms)); timers.push(id); }
  function stop() { running = false; timers.forEach(clearTimeout); timers = []; A.stopDrone(); A.hush(); phase = 'idle'; }
  function makeQuestion() {
    const l = L(), p = pos();
    const rhythm = makeRhythm(C.meter, C.bars, C.style, C.level);
    const notes = placeOnNeck(fitOctave(phrase(l, C.bars, C.level, { end: 'open', rhythm, barLen: barTicks() }), p), p);
    // the model answer: same rhythm, starting on the degree the question stopped on, ending home
    const lastRel = notes[notes.length - 1].rel;
    let start = l.zero;
    for (let i = 0; i < l.notes.length; i++) if (l.notes[i].rel === lastRel && Math.abs(i - (l.zero + 3)) < Math.abs(start - (l.zero + 3))) start = i;
    const a = placeOnNeck(fitOctave(phrase(l, C.bars, C.level, { end: 'closed', rhythm, start, barLen: barTicks() }), p), p);
    return { notes, answer: a };
  }
  // where the beats fall in a bar (ticks), for accents and the count
  const beatStarts = () => { const out = []; let t = 0; for (const g of M().groups) { out.push(t); t += g; } return out; };
  function play(notes, t0, tick, tag) {
    const ctx0 = A.audioCtx();
    const starts = beatStarts(), bt = barTicks();
    for (const n of notes) {
      const at = t0 + n.s * tick;
      const inBar = n.s % bt;
      const vel = (inBar === 0 ? 0.95 : starts.includes(inBar) ? 0.82 : 0.68) * (0.92 + Math.random() * 0.08);
      A.pluck(n.midi, at, { vel, dur: n.len * tick * 0.96 });
      later((at - ctx0.currentTime) * 1000, () => {
        document.querySelectorAll('.crn.on, #crneck .playing').forEach((x) => x.classList.remove('on', 'playing'));
        document.querySelector(`[data-ni="${tag}${notes.indexOf(n)}"]`)?.classList.add('on');
        document.querySelector(`#crneck [data-sf="${n.string}:${n.fret}"]`)?.classList.add('playing');
      });
    }
  }
  function beatDots(t0, tick, label) {
    const ctx0 = A.audioCtx(), starts = beatStarts(), bt = barTicks(), n = starts.length;
    for (let b = 0; b < C.bars; b++) starts.forEach((st, k) => later((t0 + (b * bt + st) * tick - ctx0.currentTime) * 1000, () => { const el = document.getElementById('crphase'); if (el) el.innerHTML = `${label}<small>${'●'.repeat(k + 1)}${'○'.repeat(n - 1 - k)}</small>`; }));
  }
  // one round: question, your answer, (model answer), then the next round
  function round(t0) {
    if (!running) return;
    const tick = 60 / C.bpm / M().beat, len = C.bars * barTicks() * tick; // the tempo counts the meter's beat
    q = makeQuestion(); count++;
    const ctx0 = A.audioCtx();
    later((t0 - ctx0.currentTime) * 1000, () => { phase = 'q'; draw(); });
    play(q.notes, t0, tick, 'q');
    beatDots(t0, tick, 'Listen');
    const tA = t0 + len;
    later((tA - ctx0.currentTime) * 1000, () => { phase = 'a'; draw(); });
    beatDots(tA, tick, 'Your answer');
    let tNext = tA + len;
    if (C.model) {
      const tM = tA + len;
      later((tM - ctx0.currentTime) * 1000, () => { phase = 'm'; draw(); });
      play(q.answer, tM, tick, 'a');
      beatDots(tM, tick, 'A model answer');
      tNext = tM + len;
    }
    later((tNext - ctx0.currentTime) * 1000 - 150, () => round(tNext));
  }
  async function start() {
    await A.unlockAudio(); await A.ensureRunning();
    running = true; count = 0;
    if (C.drone) A.startDrone(36 + T.notePc(tonic()), true);
    // a bar of count-in, clicked on the meter's beats
    const ctx0 = A.audioCtx(), tick = 60 / C.bpm / M().beat, t0 = ctx0.currentTime + 0.2;
    beatStarts().forEach((st, b) => { A.click(t0 + st * tick, b === 0 ? 2 : 1); later((t0 + st * tick - ctx0.currentTime) * 1000, () => { const el = document.getElementById('crphase'); if (el) el.innerHTML = `Count-in<small>${b + 1}</small>`; }); });
    phase = 'count'; draw();
    round(t0 + barTicks() * tick);
  }

  function phraseHTML(notes, tag) {
    if (!notes) return '';
    return `<div class="crnotes">${notes.map((n, i) => `<span class="crn ${kind(n.rel)}${n.len >= 4 ? ' long' : ''}" data-ni="${tag}${i}" style="flex-grow:${n.len}">${fmt(deg(n.rel))}</span>`).join('')}</div>`;
  }
  function stepsHTML(notes) {
    if (!notes || notes.length < 2) return '';
    const name = (d) => { const a = Math.abs(d); return a === 0 ? 'repeat' : `${d > 0 ? '↑' : '↓'} ${['', 'half step', 'whole step', 'min 3rd', 'maj 3rd', '4th', 'tritone', '5th', 'min 6th', 'maj 6th', 'min 7th', 'maj 7th', 'octave'][Math.min(a, 12)]}`; };
    return `<p class="note crsteps">${notes.slice(1).map((n, i) => esc(name(n.midi - notes[i].midi))).join(' · ')}</p>`;
  }
  // the whole scale across the shape, faint and numbered by degree; the phrase's notes on top, coloured by degree,
  // each lighting as it plays (with no phrase showing, just the scale)
  function neckHTML(notes) {
    const p = pos();
    const seen = new Map();
    for (const n of notes || []) if (n.string && !seen.has(`${n.string}:${n.fret}`)) seen.set(`${n.string}:${n.fret}`, n);
    const phrase = [...seen.values()].map((n) => ({ string: n.string, fret: n.fret, midi: n.midi, iv: IVN[n.rel], kind: kind(n.rel) }));
    const tpc = T.notePc(tonic()), rels = BY[C.scale].ivs.map((iv) => T.intervalSemis(F.simpleIv(iv)) % 12);
    const scale = [];
    for (let st = 1; st <= 6; st++) for (let f = Math.max(0, p.lo); f <= p.hi; f++) {
      const rel = ((F.OPEN[st] + f - tpc) % 12 + 12) % 12;
      if (rels.includes(rel) && !seen.has(`${st}:${f}`)) scale.push({ string: st, fret: f, midi: F.OPEN[st] + f, iv: IVN[rel], kind: rel === 0 ? 'r sc' : 'sc' });
    }
    const uniq = [...scale, ...phrase];
    if (!uniq.length) return '';
    // with the phrase hidden, the dots carry no position tags, so nothing lights up to give it away
    if (!phrase.length) return neckSVG({ notes: uniq, lo: Math.max(0, p.lo - 1), hi: p.hi + 1 }, { lo: Math.max(0, p.lo - 1), hi: p.hi + 1, band: p, labels: 'iv' });
    let i = 0;
    return neckSVG({ notes: uniq, lo: Math.max(0, p.lo - 1), hi: p.hi + 1 }, { lo: Math.max(0, p.lo - 1), hi: p.hi + 1, band: p, labels: 'iv' })
      .replace(/<g class="dot /g, () => { const n = uniq[i++]; return `<g data-sf="${n.string}:${n.fret}" class="dot `; });
  }

  function draw() {
    const sc = BY[C.scale];
    const opt = (ids) => ids.map((id) => `<option value="${id}" ${id === C.scale ? 'selected' : ''}>${esc(BY[id].name)}</option>`).join('');
    const p = pos();
    const shown = phase === 'm' ? q?.answer : q?.notes;
    $app.innerHTML = `
    <header class="chead"><button class="icon" data-c="back" aria-label="Back">‹</button><h1>Call and response</h1><button class="icon" data-c="go" aria-label="${running ? 'Stop' : 'Start'}">${running ? '■' : '▶'}</button></header>
    ${running ? '' : `<section class="card pctl">
      <div class="chips">${keys.map((k) => `<button class="chip ${C.tonic === k ? 'on' : ''}" data-ctonic="${k}">${fmt(T.pretty(k))}</button>`).join('')}</div>
      <select id="cscale" class="select" aria-label="Scale"><optgroup label="Pentatonic and blues">${opt(['maj-pent', 'min-pent', 'blues', 'maj-blues', 'dom-pent', 'm6-pent'])}</optgroup><optgroup label="Modes">${opt(['ionian', 'dorian', 'phrygian', 'lydian', 'mixolydian', 'aeolian', 'locrian'])}</optgroup><optgroup label="More">${opt(['harm-min', 'mel-min', 'phryg-dom', 'lyd-dom', 'hirajoshi', 'in-sen', 'dbl-harm'])}</optgroup></select>
      <div class="chips shapes">${G.SHAPES.map((s) => `<button class="chip ${C.shape === s ? 'on' : ''}" data-cshape="${s}">${s}</button>`).join('')}</div>
      <div class="seg">${[[1, 'Simple'], [2, 'Flowing'], [3, 'Syncopated']].map(([v, l]) => `<button data-clevel="${v}" class="${C.level === v ? 'on' : ''}">${l}</button>`).join('')}</div>
      <div class="seg">${[[1, '1-bar questions'], [2, '2-bar questions']].map(([v, l]) => `<button data-cbars="${v}" class="${C.bars === v ? 'on' : ''}">${l}</button>`).join('')}</div>
      <h3>Time signature</h3>
      <div class="chips">${Object.keys(METERS).map((m) => `<button class="chip ${C.meter === m ? 'on' : ''}" data-cmeter="${m}">${m}${m === '7/8' ? ' (2+2+3)' : ''}</button>`).join('')}</div>
      <h3>Rhythm</h3>
      <div class="chips">${STYLES.map(([v, l]) => `<button class="chip ${C.style === v ? 'on' : ''}" data-cstyle="${v}">${l}</button>`).join('')}</div>
      <p class="note">${{ auto: 'Follows the level: plain rhythms at Simple, dotted, sixteenths and swing at Flowing, syncopation and triplets at Syncopated.', plain: 'Quarters, eighths and the odd rest.', dotted: 'Dotted eighth and sixteenth, dotted quarters: a lilt.', sixteenths: 'Busy runs of sixteenths.', triplets: 'Eighth-note triplets (in 6/8, 9/8 and 12/8: the natural threes).', swing: 'Long–short eighths.', syncopated: 'Off-beat starts and notes tied over the beat.', sparse: 'Few notes, lots of space: phrasing.', clave: 'The tresillo (3 + 3 + 2) where the bar allows, mixed rhythms elsewhere.', mixed: 'A different style every beat.' }[C.style]} Tempo counts the ${M().beat === 18 ? 'dotted quarter' : 'quarter note'}.</p>
      <div class="chips"><button class="chip ${C.drone ? 'on' : ''}" data-c="drone">Drone</button><button class="chip ${C.show ? 'on' : ''}" data-c="show">Show the notes</button><button class="chip ${C.model ? 'on' : ''}" data-c="model">Model answer after mine</button></div>
      <div class="tempo"><button data-c="bpm-" aria-label="Slower">−</button><b>${C.bpm}<small> bpm</small></b><button data-c="bpm+" aria-label="Faster">+</button></div>
      <p class="note">I play a question in ${fmt(T.noteName(tonic(), true))} ${esc(sc.name)} from the ${C.shape} shape (frets ${p.lo}–${p.hi}); you answer in the same ${C.bars === 1 ? 'bar' : 'two bars'} of ${C.meter}, then the next one comes. Questions end open (on the 2nd, 4th, 5th or 7th); answer them home to the 1 or 3, or leave them hanging.</p>
    </section>`}
    <div class="crhead"><b>${fmt(T.noteName(tonic(), true))} ${esc(sc.name)}</b> · ${C.shape} shape, frets ${p.lo}–${p.hi}${running ? ` · question ${count}` : ''}</div>
    <div class="crphase ${phase}" id="crphase">${{ idle: 'Press ▶ to start', count: 'Count-in', q: 'Listen', a: 'Your answer', m: 'A model answer' }[phase]}</div>
    ${shown && (C.show || phase === 'a' || phase === 'm') ? `${phraseHTML(shown, phase === 'm' ? 'a' : 'q')}${stepsHTML(shown)}<div class="stage" id="crneck">${neckHTML(shown)}</div>` : `${shown ? '<p class="note" style="text-align:center">Notes hidden while it plays: listen, then they show for your answer.</p>' : ''}<div class="stage" id="crneck">${neckHTML(null)}</div>`}
    <div class="legend"><span class="k r">1</span><span class="k t3">3rd</span><span class="k t5">5th</span><span class="k t7">7th</span><span class="k tx">other degrees</span><span class="k sc">the rest of the scale</span></div>`;
    const sel = $app.querySelector('#cscale');
    if (sel) sel.onchange = () => { C.scale = sel.value; save(); draw(); };
  }
  $app.onclick = async (e) => {
    const b = e.target.closest('button'); if (!b) return;
    const d = b.dataset;
    if (d.ctonic) { C.tonic = d.ctonic; save(); return draw(); }
    if (d.cshape) { C.shape = d.cshape; save(); return draw(); }
    if (d.clevel) { C.level = Number(d.clevel); save(); return draw(); }
    if (d.cbars) { C.bars = Number(d.cbars); save(); return draw(); }
    if (d.cmeter) { C.meter = d.cmeter; save(); return draw(); }
    if (d.cstyle) { C.style = d.cstyle; save(); return draw(); }
    const a = d.c;
    if (a === 'back') { stop(); return onBack(); }
    if (['drone', 'show', 'model'].includes(a)) { C[a] = !C[a]; save(); return draw(); }
    if (a === 'bpm-' || a === 'bpm+') { C.bpm = Math.max(40, Math.min(160, C.bpm + (a === 'bpm+' ? 4 : -4))); save(); return draw(); }
    if (a === 'go') { if (running) { stop(); return draw(); } return start(); }
  };
  draw();
  window.scrollTo(0, 0);
  return stop;
}

// for testing: a batch of questions as degree strings
export function sampleQuestions(tonicPc, id, n = 8, level = 2, bars = 2, meter = '4/4', style = 'auto') {
  const L = ladder(tonicPc, id), bl = METERS[meter].groups.reduce((a, b) => a + b, 0);
  return Array.from({ length: n }, () => phrase(L, bars, level, { end: 'open', rhythm: makeRhythm(meter, bars, style, level), barLen: bl }).map((x) => `${IVN[x.rel]}@${x.s}/${x.len}`).join(' '));
}
