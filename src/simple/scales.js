// Simple's Scales: the scales worth knowing (pentatonics and blues, the modes, melodic and harmonic minor, the
// symmetric and bebop scales), each in the ways teachers set them: one CAGED shape, two shapes joined, the pentatonic
// boxes, three or four notes per string, the two-string ladder, one string. ◀ ▶ step through the positions. A click
// (with subdivisions) and a drone on the key note, each switchable; Guide plays the scale up and down in time,
// lighting each note.
import * as T from '../theory.js';
import * as F from '../fretboard.js';
import * as A from '../audio.js';
import * as G from '../caged/grips.js';
import { SCALES } from '../caged/scales.js';
import { esc } from '../fundamentals/core.js';
import * as N from './neck.js';

const BY = Object.fromEntries(SCALES.map((s) => [s.id, s]));
export const GROUPS = [
  ['Pentatonics and blues', ['min-pent', 'maj-pent', 'blues', 'maj-blues', 'dom-pent', 'm6-pent']],
  ['Modes (3 per string is the way)', ['dorian', 'mixolydian', 'lydian', 'phrygian', 'locrian', 'ionian', 'aeolian']],
  ['Melodic minor and its modes', ['mel-min', 'lyd-dom', 'altered', 'locrian-n2', 'mixo-b6', 'lyd-aug', 'dorian-b2']],
  ['Harmonic minor and major', ['harm-min', 'phryg-dom', 'harm-maj']],
  ['Symmetric', ['dim-hw', 'dim-wh', 'whole-tone']],
  ['Bebop', ['bebop-dom', 'bebop-maj', 'bebop-dor']],
];
// what each is for, in a sentence
const USE = {
  'min-pent': 'Rock and blues over minor chords and dominant 7ths. A minor pentatonic is also C major pentatonic: same notes, different home.',
  'maj-pent': 'Over major chords and dominants: sweet, no avoid notes. Same shapes as the relative minor pentatonic, a minor 3rd down.',
  blues: 'Minor pentatonic plus the ♭5 as a passing note: over a whole blues, I7, IV7 and V7 alike.',
  'maj-blues': 'Major pentatonic plus the ♭3, slid into the 3: country, soul, and the I7 of a blues.',
  'dom-pent': 'Over a dominant 7th: 1 2 3 5 ♭7, Mixolydian without the avoid note. Great over funk vamps.',
  'm6-pent': 'Over m6 and Dorian minor: the natural 6 gives the Dorian lift without the 2.',
  dorian: 'Over a m7 that’s a ii, or a Dorian i vamp. Lean on the colour note, the natural 6.',
  mixolydian: 'Over a dominant 7th going to major, or a static I7 vamp. The colour note is the ♭7.',
  lydian: 'Over maj7 on IV, or a Lydian tonic. The colour note is the ♯4.',
  phrygian: 'Over m7 on iii, and the Spanish i – ♭II vamp. The colour note is the ♭2.',
  locrian: 'Over ø7 (m7♭5). Locrian ♮2 (melodic minor) is the smoother jazz choice.',
  ionian: 'The parent shapes. Learn its 3-per-string patterns and every major mode is already in your hands: just start on another note.',
  aeolian: 'Natural minor: over the vi or a minor i. Same 3-per-string shapes as the relative major.',
  'mel-min': 'Over m(maj7) and m6 tonics. Learn its shapes once and you have all seven melodic minor modes.',
  'lyd-dom': 'Over dominants that don’t fall a 5th: tritone subs, ♭VII7, IV7 in a blues. It’s melodic minor from a 5th above the root.',
  altered: 'Over V7 resolving, above all into minor: ♭9 ♯9 ♯11 ♭13. It’s melodic minor from a half step above the root.',
  'locrian-n2': 'Over ø7, the ii of a minor ii–V. It’s melodic minor from a minor 3rd above the root.',
  'mixo-b6': 'Over V7 into minor with a natural 9, or 7♭13. It’s melodic minor from a 4th above the root.',
  'lyd-aug': 'Over maj7♯5. It’s melodic minor from a minor 3rd below the root.',
  'dorian-b2': 'Over sus♭9 chords. It’s melodic minor from a whole step below the root.',
  'harm-min': 'Over a minor i with a leading tone, m(maj7). Its 5th mode is Phrygian dominant.',
  'phryg-dom': 'Over V7♭9 into minor (E7♭9 → Am). It’s harmonic minor from its 5th.',
  'harm-maj': 'Major with a ♭6: the iv-minor colour inside a major key, and V7♭9 into major.',
  'dim-hw': 'Over 13♭9 and 7♭9 dominants: half step, whole step from the root. It repeats every 3 frets, so one shape moves in minor 3rds.',
  'dim-wh': 'Over °7 chords: whole step, half step. It repeats every 3 frets.',
  'whole-tone': 'Over 7♯5 and 7♭13 dominants. It repeats every 2 frets: only two whole-tone scales exist.',
  'bebop-dom': 'Mixolydian plus the major 7 as a passing note, so running 8ths from a chord tone puts chord tones on the beats.',
  'bebop-maj': 'Major plus a ♯5 passing note: chord tones land on the beats.',
  'bebop-dor': 'Dorian plus the major 3 as a passing note: the minor bebop line.',
};
const HOW = {
  caged: ['One CAGED shape', 'Root to root first, then the lowest note to the highest and back. Say the degrees out loud. Alternate picking, 8ths; aim for 100.'],
  pair: ['Two shapes joined', 'Climb in the lower shape, cross into the upper one on the way up, and come back down the same way. This is how you stop living in one box. 8ths; aim for 90.'],
  box: ['Boxes, 2 per string', 'One hand position, two notes on every string. Learn all five, then link each to the next one up. 8ths, then 16ths; aim for 16ths at 90.'],
  nps3: ['3 per string', 'Three notes on every string: down-up-down picking, or pick one and hammer two. The hand shifts as it climbs, so each pattern runs on a diagonal about six frets wide. There are seven, one starting from each note of the scale on the low E, and between them they cover the whole neck (the faint dots are the rest of it). Learn them one at a time with the numbers, then play All: up one, down the next, to the top and back. 16ths; aim for 110.'],
  nps4: ['4 per string', 'Four notes on every string: slide the index finger up to shift on each string. The fusion way up the neck, two and a half octaves in one sweep. Triplets or 16ths; aim for 80.'],
  two: ['Two-string ladder', 'A group on the lower string and the next notes on the upper, then start again a few notes further up the lower string, all the way up the neck (the guide plays it in groups). It joins every position sideways, which boxes never do. 8ths; aim for 100.'],
  one: ['One string', 'The whole scale on one string, nut to the top: you hear the steps as distances. Say each degree as you play it. 8ths; aim for 80.'],
};
const KEYS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
const STR = { 6: 'low E', 5: 'A', 4: 'D', 3: 'G', 2: 'B', 1: 'high E' };
const SUBS = { 1: 'Beats', 2: '8ths', 3: 'Triplets', 4: '16ths' };
const semi = (iv) => T.intervalSemis(F.simpleIv(iv)) % 12;
const role = (iv) => (iv === '1' ? 'r' : ['3', 'b3'].includes(iv) ? 't' : ['5', 'b5', '#5'].includes(iv) ? 'f' : ['7', 'b7'].includes(iv) ? 's' : 'x');

// the root name that spells the scale most cleanly
function spell(pc, id) {
  const opts = [...new Set([KEYS[pc], T.noteName(T.enharmonic(T.parseNote(KEYS[pc])))])];
  let best = opts[0], cost = Infinity;
  for (const nm of opts) {
    const r = T.parseNote(nm);
    const c = BY[id].ivs.reduce((s, iv) => { const n = T.transpose(r, F.simpleIv(iv)); return s + Math.abs(n.acc) * (Math.abs(n.acc) > 1 ? 4 : 1); }, 0) + (nm.length > 1 ? 0.5 : 0);
    if (c < cost) { cost = c; best = nm; }
  }
  return T.parseNote(best);
}

// the layouts this scale offers
export function familiesFor(id) {
  const n = new Set(BY[id].ivs.map(semi)).size;
  const out = ['caged', 'pair'];
  if (n === 5 || id === 'whole-tone') out.push('box');
  out.push('nps3');
  if (n >= 7) out.push('nps4');
  out.push('two', 'one');
  return out;
}

// every position of one layout: [{ title, notes: [{string, fret, midi, iv}], path: [same, in playing order], win }]
export function positions(id, pc, fam) {
  const sc = BY[id], rootN = spell(pc, id);
  const bySemi = new Map(); sc.ivs.forEach((iv) => { if (!bySemi.has(semi(iv))) bySemi.set(semi(iv), iv); });
  const rel = (m) => ((m - pc) % 12 + 12) % 12;
  const at = (s, f) => { const m = F.OPEN[s] + f; return bySemi.has(rel(m)) ? { string: s, fret: f, midi: m, iv: bySemi.get(rel(m)) } : null; };
  const inWin = (lo, hi) => { const out = []; for (let s = 6; s >= 1; s--) for (let f = lo; f <= hi; f++) { const n = at(s, f); if (n) out.push(n); } return out; };
  const byPitch = (a, b) => a.midi - b.midi || b.string - a.string;
  // the playing order: low to high, one note per pitch (on the lower string where a pitch appears twice)
  const pathOf = (notes) => { const seen = new Set(); return [...notes].sort(byPitch).filter((n) => (seen.has(n.midi) ? false : seen.add(n.midi))); };
  const fitDown = (w) => (w.hi > 19 && w.lo - 12 >= 0 ? { lo: w.lo - 12, hi: w.hi - 12 } : w);
  const sorted = [...bySemi.keys()].sort((a, b) => a - b);
  const climb = (k, d) => {
    let f0 = ((pc + sorted[d] - 4) % 12 + 12) % 12;
    const seq = [];
    for (let m = 40 + f0; m <= 40 + f0 + 54; m++) if (bySemi.has(rel(m))) seq.push(m);
    const out = []; let i = 0;
    for (let s = 6; s >= 1; s--) for (let j = 0; j < k && i < seq.length; j++, i++) out.push({ string: s, fret: seq[i] - F.OPEN[s], midi: seq[i], iv: bySemi.get(rel(seq[i])) });
    // a low start can push the B string below the nut: play that position an octave up
    if (out.some((n) => n.fret < 0)) { out.forEach((n) => { n.fret += 12; n.midi += 12; }); f0 += 12; }
    return { notes: out, f0 };
  };
  const startName = (d) => T.prettyIv(bySemi.get(sorted[d]));
  let list = [];
  if (fam === 'caged' || fam === 'pair') {
    for (const sh of ['C', 'A', 'G', 'E', 'D']) {
      let w = fam === 'caged' ? F.cagedWindow(rootN, sh) : G.positionOfPair(rootN, sh);
      w = fitDown({ lo: Math.max(0, w.lo), hi: w.hi });
      const notes = inWin(w.lo, w.hi);
      list.push({ title: fam === 'caged' ? `${sh} shape` : `${sh} and ${'CAGEDC'['CAGED'.indexOf(sh) + 1]} shapes`, sub: `frets ${w.lo}–${w.hi}`, notes, path: pathOf(notes), win: w });
    }
    list.sort((a, b) => a.win.lo - b.win.lo);
  } else if (fam === 'box' || fam === 'nps3' || fam === 'nps4') {
    const k = fam === 'box' ? 2 : fam === 'nps3' ? 3 : 4;
    list = sorted.map((_, d) => {
      const c = climb(k, d);
      return { title: `From the ${startName(d)}`, sub: c.f0 ? `fret ${c.f0} on the low E` : 'the open low E', notes: c.notes, path: c.notes, f0: c.f0 };
    }).filter((p) => Math.max(...p.notes.map((n) => n.fret)) <= 19).sort((a, b) => a.f0 - b.f0);
  } else if (fam === 'two') {
    const k = sorted.length <= 6 ? 2 : 3;
    // groups up the pair: k notes on the lower string, the next k scale notes on the upper, then start again k
    // notes further up the lower string (F G B♭ C, B♭ C D F, D F G B♭ … in G minor pentatonic)
    list = [[6, 5], [5, 4], [4, 3], [3, 2], [2, 1]].map(([lo, hi]) => {
      const low = []; for (let f = 0; f <= 17; f++) { const n = at(lo, f); if (n) low.push(n); }
      const path = [];
      for (let j = 0; j + k - 1 < low.length; j += k) {
        const grp = low.slice(j, j + k);
        let m = grp[k - 1].midi, got = 0;
        const upper = [];
        while (got < k) { m++; if (!bySemi.has(rel(m))) continue; const f = m - F.OPEN[hi]; if (f < 0) continue; if (f > 17) break; upper.push({ string: hi, fret: f, midi: m, iv: bySemi.get(rel(m)) }); got++; }
        if (got < k) break;
        path.push(...grp, ...upper);
      }
      const seen = new Set(), notes = path.filter((n) => { const key = n.string + ':' + n.fret; return seen.has(key) ? false : seen.add(key); });
      return { title: `Strings ${lo} and ${hi}`, sub: `${STR[lo]} and ${STR[hi]}, ${k} and ${k}, up from the nut`, notes, path };
    });
  } else if (fam === 'one') {
    list = [6, 5, 4, 3, 2, 1].map((s) => {
      const out = []; for (let f = 0; f <= 17; f++) { const n = at(s, f); if (n) out.push(n); }
      return { title: `The ${STR[s]} string`, sub: 'nut to fret 17', notes: out, path: out };
    });
  }
  // the positions joined: up the first, down the next, up the one after, all the way up the neck (and the guide
  // comes back down the same way). The whole neck lit, so you see how the positions overlap and hand on.
  const joins = ['caged', 'box', 'nps3', 'nps4'].includes(fam) && list.length > 1;
  if (joins) {
    const path = [];
    list.forEach((p, i) => { const up = p.path; const seg = i % 2 ? [...up].reverse() : up; for (const n of seg) { const l = path[path.length - 1]; if (!l || l.string !== n.string || l.fret !== n.fret) path.push(n); } });
    const seen = new Set(), notes = list.flatMap((p) => p.notes).filter((n) => { const key = n.string + ':' + n.fret; return seen.has(key) ? false : seen.add(key); });
    list.push({ title: `All ${list.length}, up the neck`, sub: 'every position in turn: up one, down the next', notes, path, all: true });
  }
  const span = Math.max(...list.flatMap((p) => p.notes.map((n) => n.fret)));
  for (const p of list) {
    const fr = p.notes.map((n) => n.fret);
    // positions of one layout share one neck length, so stepping through them doesn't resize it
    p.nf = Math.max(15, Math.min(19, (joins ? span : Math.max(...fr)) + 1));
    if (!p.win) p.win = { lo: Math.min(...fr), hi: Math.max(...fr) };
  }
  // the rest of the neck, faint, behind each position
  const every = joins ? list[list.length - 1].notes : null;
  for (const p of list) if (every && !p.all) p.ghosts = every.map((n) => ({ string: n.string, fret: n.fret, cls: role(n.iv) }));
  return { root: rootN, list };
}

// ---------- the screen ----------
export function mountScales(root, S, save, { upright }) {
  S.scales = Object.assign({ id: 'altered', key: 7, fam: 'caged', pos: 0, bpm: 70, sub: 2, guide: true, drone: false, labels: 'deg' }, S.scales || {});
  const st = S.scales;
  if (!BY[st.id]) st.id = 'altered';
  const box = root.querySelector('.neckbox'), panel = root.querySelector('.panel');
  let data = null, playing = null, lit = -1, droning = false;
  const load = () => {
    if (!familiesFor(st.id).includes(st.fam)) st.fam = 'caged';
    data = positions(st.id, st.key, st.fam);
    st.pos = Math.min(st.pos, data.list.length - 1);
  };
  const cur = () => data.list[st.pos];
  const noteName = (n) => T.noteName(T.transpose(data.root, F.simpleIv(n.iv)), true);
  const drawNeck = () => {
    const p = cur(), on = lit >= 0 ? guidePath()[lit] : null;
    const dots = p.notes.map((n) => ({ string: n.string, fret: n.fret, cls: role(n.iv), label: st.labels === 'deg' ? T.prettyIv(n.iv) : noteName(n), ring: on ? on.string === n.string && on.fret === n.fret : n.iv === '1' }));
    box.innerHTML = (upright() ? N.neckUpright : N.neckAcross)({ win: (st.fam === 'caged' || st.fam === 'pair') && !p.all ? p.win : null, ghosts: p.ghosts || [], dots, nf: p.nf });
    if (on) box.querySelectorAll('.dot').forEach((g) => { if (g.querySelector('.ring')) g.classList.add('lit'); });
  };
  // the guide: up the path and back down, one note per subdivision
  const guidePath = () => { const p = cur().path; return p.concat([...p].reverse().slice(1, -1)); };
  const stop = () => {
    if (playing) { clearInterval(playing.timer); playing.timers.forEach(clearTimeout); playing = null; }
    lit = -1;
  };
  const start = () => {
    stop();
    A.unlockAudio();
    const c = A.audioCtx();
    const m = { next: c.currentTime + 0.1, slot: -st.sub * 4, timers: [], timer: null }; // one bar of count-in
    const tick = () => {
      while (m.next < c.currentTime + 0.12) {
        const sub = st.sub, k = ((m.slot % sub) + sub) % sub, beat = Math.floor(m.slot / sub);
        if (k === 0) A.click(m.next, ((beat % 4) + 4) % 4 === 0 ? 2 : 1);
        else if (m.slot < 0 || !st.guide) A.click(m.next, 0);
        if (m.slot >= 0 && st.guide) {
          const path = guidePath(), i = m.slot % path.length, n = path[i];
          A.pluck(n.midi, m.next, { vel: 0.7, dur: Math.min(0.5, 60 / st.bpm / sub * 1.4) });
          const at = m.next;
          m.timers.push(setTimeout(() => { if (playing === m) { lit = i; drawNeck(); } }, Math.max(0, (at - c.currentTime) * 1000)));
          if (m.timers.length > 48) m.timers.splice(0, 24);
        }
        m.next += 60 / st.bpm / sub; m.slot++;
      }
    };
    m.timer = setInterval(tick, 25); tick();
    playing = m;
  };
  const drone = () => {
    if (st.drone) { A.unlockAudio(); A.startDrone(40 + ((st.key - 4 + 12) % 12), true); droning = true; }
    else if (droning) { A.stopDrone(); droning = false; }
  };
  const opt = (v, l, curV) => `<option value="${esc(v)}" ${String(curV) === String(v) ? 'selected' : ''}>${esc(l)}</option>`;
  const render = () => {
    const p = cur(), sc = BY[st.id], [famName, how] = HOW[st.fam];
    const rootName = T.noteName(data.root, true);
    drawNeck();
    panel.innerHTML = `
      <div class="cap"><b>${esc(rootName)} ${esc(sc.name)} · ${esc(p.title)}</b><span>${st.pos + 1} / ${data.list.length}</span></div>
      <div class="menus">
        <label><span>Scale</span><select id="xScale">${GROUPS.map(([g, ids]) => `<optgroup label="${esc(g)}">${ids.map((id) => opt(id, BY[id].name[0].toUpperCase() + BY[id].name.slice(1), st.id)).join('')}</optgroup>`).join('')}</select></label>
        <label><span>Practise it</span><select id="xFam">${familiesFor(st.id).map((f) => opt(f, HOW[f][0], st.fam)).join('')}</select></label>
        <label class="small"><span>Key</span><select id="xKey">${KEYS.map((k, i) => opt(i, T.noteName(spell(i, st.id), true), st.key)).join('')}</select></label>
      </div>
      <div class="row big"><button id="xPrev">◀</button><button id="xNext">▶</button></div>
      <div class="row xpos">${data.list.map((q, i) => `<button data-pos="${i}" class="${i === st.pos ? 'on' : ''}">${q.all ? 'All' : i + 1}</button>`).join('')}</div>
      <div class="row big"><button id="xGo" class="${playing ? 'on' : ''}">${playing ? '■ Stop' : '▶ Start'}</button></div>
      <div class="row"><button class="sq" id="xDown">−</button><span class="bpm">${st.bpm} bpm</span><button class="sq" id="xUp">+</button></div>
      <div class="row toggles">
        <button id="xSub">${SUBS[st.sub]}</button>
        <button id="xGuide" class="${st.guide ? 'on' : ''}" aria-pressed="${st.guide}">Guide notes</button>
        <button id="xDrone" class="${st.drone ? 'on' : ''}" aria-pressed="${st.drone}">Drone ${esc(rootName)}</button>
        <button id="xLab">${st.labels === 'deg' ? 'Degrees' : 'Notes'}</button>
      </div>
      <div class="xinfo">
        <div class="xform">${sc.ivs.map((iv) => `<span class="${role(iv)}">${esc(T.prettyIv(iv))}</span>`).join('')}</div>
        <p><b>${esc(famName)}</b> · ${esc(p.sub)}. ${esc(how)}</p>
        <p>${esc(USE[st.id] || sc.feel)}</p>
      </div>`;
    const $ = (id) => panel.querySelector('#' + id);
    const move = (d) => { st.pos = (st.pos + d + data.list.length) % data.list.length; save(); lit = -1; render(); };
    $('xPrev').onclick = () => move(-1);
    $('xNext').onclick = () => move(1);
    panel.querySelectorAll('[data-pos]').forEach((b) => { b.onclick = () => move(Number(b.dataset.pos) - st.pos); });
    $('xGo').onclick = () => { if (playing) stop(); else start(); render(); };
    $('xDown').onclick = () => { st.bpm = Math.max(30, st.bpm - 5); save(); panel.querySelector('.bpm').textContent = `${st.bpm} bpm`; };
    $('xUp').onclick = () => { st.bpm = Math.min(240, st.bpm + 5); save(); panel.querySelector('.bpm').textContent = `${st.bpm} bpm`; };
    $('xSub').onclick = (e) => { st.sub = { 1: 2, 2: 3, 3: 4, 4: 1 }[st.sub]; save(); e.currentTarget.textContent = SUBS[st.sub]; };
    $('xGuide').onclick = () => { st.guide = !st.guide; save(); if (!st.guide) { lit = -1; drawNeck(); } render(); };
    $('xDrone').onclick = () => { st.drone = !st.drone; save(); drone(); render(); };
    $('xLab').onclick = () => { st.labels = st.labels === 'deg' ? 'note' : 'deg'; save(); drawNeck(); render(); };
    const reload = () => { const was = !!playing; stop(); load(); save(); render(); if (was) { start(); render(); } };
    $('xScale').onchange = (e) => { st.id = e.target.value; st.pos = 0; reload(); };
    $('xFam').onchange = (e) => { st.fam = e.target.value; st.pos = 0; reload(); };
    $('xKey').onchange = (e) => { st.key = Number(e.target.value); if (st.drone && droning) { A.stopDrone(); droning = false; } reload(); drone(); };
  };
  load();
  render();
  return {
    render: () => { render(); },
    wake: () => { if (st.drone && !droning) drone(); },
    leave: () => { stop(); if (droning) { A.stopDrone(); droning = false; } },
  };
}
