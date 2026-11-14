// Chord scales: the scale that goes with each chord, fingered all over the neck. Melodic minor first (the jazz
// workhorse), then the major-scale modes, then harmonic minor and the symmetric scales. For each chord: which scale,
// where it comes from and when to use it; then the scale in each CAGED shape around the chord, or as 3-notes-per-string
// positions up the neck, with finger numbers, the chord's own grip faintly underneath, over a held chord.
import * as T from '../theory.js';
import * as F from '../fretboard.js';
import * as A from '../audio.js';
import * as G from './grips.js';
import * as H from './harmony.js';
import * as SC from './scales.js';
import * as FL from './fsladder.js';
import { glance, parentOf } from './freescale.js';

const BY = Object.fromEntries(SC.SCALES.map((s) => [s.id, s]));
const KEYS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
const ORD = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th'];

// the chords and their scales, by family
export const FAMILIES = [
  { id: 'mm', name: 'Melodic minor', blurb: 'The jazz family: every mode of melodic minor has a chord it fits better than anything else.', items: [
    { id: 'mel-min', q: 'mMaj7', use: 'Minor chords with a natural 6 or 7: m6, m(maj7), and the i chord of a minor ii–V–i.' },
    { id: 'lyd-dom', q: '7#11', use: 'Dominant 7ths that don’t resolve down a 5th: ♭VII7, IV7 in a blues, tritone subs, 7♯11 chords.' },
    { id: 'altered', q: '7alt', use: 'The V7 of a ii–V–I, every tension altered (♭9, ♯9, ♯11, ♭13): the most tension before the resolution.' },
    { id: 'locrian-n2', q: 'm7b5', use: 'Half-diminished chords, above all the iiø7 of a minor ii–V–i; the natural 9 makes it smoother than Locrian.' },
    { id: 'mixo-b6', q: '7b13', use: 'A dominant with ♭13 and natural 9, heading for a minor chord.' },
    { id: 'lyd-aug', q: 'maj7#5', use: 'maj7♯5: a bright, floating major with a raised 5th.' },
    { id: 'dorian-b2', q: '7sus4', label: '7sus4(♭9)', use: 'The sus4(♭9) chord, the “Phrygian” sus sound of modal jazz.' },
  ] },
  { id: 'maj', name: 'Major scale modes', blurb: 'The everyday chords: each chord of a major key with its mode.', items: [
    { id: 'ionian', q: 'maj7', use: 'Imaj7 and major triads; the 4th is an avoid note on the beat.' },
    { id: 'dorian', q: 'm7', use: 'm7 chords, especially ii7 in a ii–V and minor vamps.' },
    { id: 'mixolydian', q: '7', use: 'Dominant 7ths: V7, blues chords, unaltered 9 and 13 chords.' },
    { id: 'lydian', q: 'maj7#11', use: 'maj7 chords other than I (IVmaj7, ♭VImaj7) and maj7♯11.' },
    { id: 'aeolian', q: 'm7', use: 'vi7 and minor chords with a ♭6 colour: the plain minor key.' },
    { id: 'phrygian', q: 'm7', use: 'iii7, and m7 chords with a dark ♭9 colour; Spanish and metal minor.' },
    { id: 'locrian', q: 'm7b5', use: 'viiø7 in a major key; jazz players often prefer Locrian ♮2.' },
  ] },
  { id: 'hm', name: 'Harmonic minor and symmetric', blurb: 'The rest you need: harmonic minor’s dominant and the two diminished scales and the whole-tone scale.', items: [
    { id: 'phryg-dom', q: '7b9', use: 'The V7♭9 of a minor key: ♭9 and ♭13 with a natural 3rd.' },
    { id: 'harm-min', q: 'mMaj7', use: 'A minor tonic with a leading tone: i(maj7) in classical and Latin minor.' },
    { id: 'dim-hw', q: '13b9', use: '7♭9 and 13♭9 chords: ♭9, ♯9 and ♯11 with a natural 13th.' },
    { id: 'dim-wh', q: 'dim7', use: 'Diminished 7th chords: every other note of it is a chord tone.' },
    { id: 'whole-tone', q: '7#5', use: '7♯5 (augmented dominant) chords: dreamy, unresolved.' },
  ] },
];
const ALL = FAMILIES.flatMap((f) => f.items.map((it) => ({ ...it, fam: f.id })));

// ---------- finger numbers ----------
// a box (one hand position): the index sits where most notes fall within four frets; one finger per fret, a stretch
// either side, kept in order on each string
function boxFingers(notes) {
  const fr = notes.map((n) => n.fret).filter((f) => f > 0);
  if (!fr.length) return notes.map((n) => ({ ...n, finger: 0 }));
  let p = Math.min(...fr), best = -1;
  for (let c = Math.min(...fr); c <= Math.max(...fr); c++) { const k = fr.filter((f) => f >= c && f <= c + 3).length; if (k > best) { best = k; p = c; } }
  return byString(notes, (fs) => fs.map((f) => (f === 0 ? 0 : Math.max(1, Math.min(4, f - p + 1)))));
}
// 3 notes per string: the standard patterns, by the steps between them
function npsFingers(notes) {
  return byString(notes, (fs) => {
    if (fs[0] === 0) return fs.map((f) => Math.min(4, f)); // an open string: first position, one finger per fret
    if (fs.length !== 3) return fs.map((f, i) => Math.min(4, i + 1));
    const [a, b, c] = fs;
    if (c - a <= 2) return [1, 2, 3];          // half, half
    if (b - a === 1) return [1, 2, 4];         // half, whole (or wider)
    if (c - b === 1) return [1, 3, 4];         // whole, half
    return [1, 2, 4];                          // whole, whole: index, middle, stretch to pinky
  });
}
function byString(notes, fn) {
  const out = notes.map((n) => ({ ...n }));
  for (let s = 1; s <= 6; s++) {
    const on = out.filter((n) => n.string === s).sort((a, b) => a.fret - b.fret);
    if (!on.length) continue;
    let f = fn(on.map((n) => n.fret));
    // keep fingers rising along the string: up where they collide, then back down from the pinky if they overflow
    for (let i = 1; i < f.length; i++) if (f[i] && f[i] <= f[i - 1]) f[i] = f[i - 1] + 1;
    for (let i = f.length - 1; i >= 0; i--) if (f[i] > 4 - (f.length - 1 - i)) f[i] = Math.max(1, 4 - (f.length - 1 - i));
    on.forEach((n, i) => { n.finger = n.fret === 0 ? 0 : f[i]; });
  }
  return out;
}

export function renderChordScales($app, ctx) {
  const { D, save, neckSVG, esc, fmt, onBack, KIND } = ctx;
  const O = D.cs = Object.assign({ key: 'C', fam: 'mm', id: 'mel-min', view: 'shape', pos: 0, labels: 'finger', metro: true, bpm: 80, go: 'manual', every: 16 }, D.cs || {});
  const R = { on: false, timer: null, next: 0, beat: 0, since: 0, pad: null, dir: 1, vis: [] };

  const item = () => ALL.find((x) => x.id === O.id && x.fam === O.fam) || FAMILIES.find((f) => f.id === O.fam).items[0];
  const root = () => T.parseNote(O.key);
  const chordName = () => H.chordName(root(), item().q) + (item().label ? '' : '');

  // ---------- positions ----------
  function positions() {
    const it = item(), ivs = BY[it.id].ivs, r = root();
    const tag = (n) => ({ ...n, iv: n.iv, note: T.transpose(r, F.simpleIv(n.iv)) });
    if (O.view === 'shape') {
      return G.SHAPES.map((sh) => {
        const w = F.cagedWindow(r, sh);
        const notes = F.regionNotes({ root: O.key, tones: ivs, region: { caged: sh } }).map(tag);
        return { name: `${sh} shape`, sub: `frets ${w.lo}–${w.hi}`, lo: w.lo, hi: w.hi, shape: sh, notes: boxFingers(notes) };
      }).sort((a, b) => a.lo - b.lo);
    }
    if (O.view === 'nps') {
      if (ivs.length < 7) return [];
      const out = [];
      for (let d = 1; d <= ivs.length; d++) {
        let notes = F.regionNotes({ root: O.key, tones: ivs, region: { nps3: d } });
        const lo = Math.min(...notes.map((n) => n.fret));
        if (lo >= 12) notes = notes.map((n) => ({ ...n, fret: n.fret - 12, midi: n.midi - 12 }));
        if (Math.max(...notes.map((n) => n.fret)) > 19) continue;
        notes = notes.map(tag);
        const fr = notes.map((n) => n.fret);
        out.push({ name: `From the ${T.prettyIv(ivs[d - 1])}`, sub: `3 per string · frets ${Math.min(...fr)}–${Math.max(...fr)}`, lo: Math.min(...fr), hi: Math.max(...fr), deg: d, notes: npsFingers(notes) });
      }
      return out.sort((a, b) => a.lo - b.lo);
    }
    const notes = F.regionNotes({ root: O.key, tones: ivs, region: { frets: [0, 15] } }).map(tag);
    return [{ name: 'The whole neck', sub: 'frets 0–15', lo: 0, hi: 15, notes: notes.map((n) => ({ ...n, finger: undefined })) }];
  }
  const posAt = () => { const ps = positions(); if (!ps.length) return null; const k = ((O.pos % ps.length) + ps.length) % ps.length; return { ...ps[k], k, n: ps.length }; };

  // chord tones in their colours, tensions purple, the rest of the scale grey
  function kindOf(iv) {
    const c = T.getChord(item().q).ivs, s = FL.semisOf(iv), m = c.find((x) => FL.semisOf(x) === s);
    return m ? KIND(m) : 'sc';
  }
  function neck(p) {
    const lo = Math.max(0, p.lo - (p.lo > 0 ? 1 : 0)), hi = Math.max(p.hi + 1, lo + 4);
    // the chord's own grip in this area: its notes ringed (faint rings where the grip uses a note outside this fingering)
    const g = G.gripInPosition(root(), item().q, { lo: p.lo, hi: p.hi, mid: (p.lo + p.hi) / 2 });
    const inGrip = new Set((g ? g.notes : []).map((n) => `${n.string}:${n.fret}`));
    const notes = p.notes.map((n) => ({ ...n, kind: kindOf(n.iv), mark: inGrip.has(`${n.string}:${n.fret}`) }));
    const bg = g ? g.notes.filter((n) => !p.notes.some((x) => x.string === n.string && x.fret === n.fret)).map((n) => ({ string: n.string, fret: n.fret, root: n.iv === '1' })) : [];
    const lab = O.labels === 'finger' && O.view !== 'neck' ? 'finger' : O.labels === 'note' ? 'note' : 'iv';
    return neckSVG({ notes, lo, hi }, { lo, hi, labels: lab, bg });
  }

  // ---------- sound: the chord held on a pad, a click, the position moving on its own ----------
  function chordMidis() {
    const r = T.notePc(root()), bass = 40 + ((r - 4 + 12) % 12);
    let up = T.getChord(item().q).ivs.filter((iv) => iv !== '1');
    if (up.length > 4) up = up.filter((iv) => iv !== '5');
    const top = up.map((iv) => { const pc = (r + FL.semisOf(iv)) % 12; return 55 + ((pc - 7 + 12) % 12); });
    return [bass, ...new Set(top)].sort((a, b) => a - b);
  }
  function padChord() { if (R.pad) R.pad.chord(chordMidis(), A.audioCtx().currentTime + 0.05); }
  function clock() {
    if (!R.on) return;
    const c = A.audioCtx();
    if (R.next < c.currentTime - 0.02) R.next = c.currentTime + 0.05;
    while (R.next < c.currentTime + 0.12) {
      const t = R.next, b = R.beat++;
      let move = false;
      if (O.go === 'auto' && R.since >= O.every) { R.since = 0; move = true; }
      R.since++;
      if (O.metro) A.click(t, b % 4 === 0 ? 2 : 1);
      R.vis.push(setTimeout(() => {
        if (move && R.on) step(R.dir, true);
        document.querySelectorAll('.csbeats i').forEach((el, i) => el.classList.toggle('on', i === b % 4));
      }, Math.max(0, (t - c.currentTime) * 1000)));
      if (R.vis.length > 64) R.vis.splice(0, 32);
      R.next += 60 / O.bpm;
    }
    R.timer = setTimeout(clock, 25);
  }
  async function start() {
    A.unlockAudio().catch(() => {});
    R.on = true;
    await Promise.race([A.ensureRunning(), new Promise((r) => setTimeout(r, 500))]);
    if (!R.on) return;
    R.pad = A.padLine({ vel: 0.55 }); padChord();
    R.next = A.audioCtx().currentTime + 0.1; R.beat = 0; R.since = 0;
    clock(); draw();
  }
  function stop() {
    R.on = false; clearTimeout(R.timer); R.vis.forEach(clearTimeout); R.vis = [];
    if (R.pad) { R.pad.release(A.audioCtx().currentTime, 0.3); R.pad = null; }
    A.hush();
  }
  // the position played up and back down, in eighth notes
  function hearIt() {
    const p = posAt(); if (!p) return;
    A.unlockAudio().catch(() => {});
    A.ensureRunning().then(() => {
      const ms = p.notes.map((n) => n.midi).sort((a, b) => a - b), seq = ms.concat(ms.slice(0, -1).reverse());
      const t0 = A.audioCtx().currentTime + 0.1, dt = 30 / O.bpm;
      seq.forEach((m, i) => A.pluck(m, t0 + i * dt, { vel: 0.7, dur: dt * 1.6 }));
    });
  }
  // next or previous position; on auto it walks up the neck and back down
  function step(dir, auto = false) {
    const ps = positions(); if (ps.length < 2) return;
    const k = ((O.pos % ps.length) + ps.length) % ps.length;
    if (auto) { if (k + R.dir > ps.length - 1 || k + R.dir < 0) R.dir = -R.dir; O.pos = k + R.dir; }
    else O.pos = k + dir;
    save(); draw();
  }

  // ---------- the screen ----------
  const seg = (attr, cur, opts) => `<div class="seg" role="radiogroup">${opts.map(([v, l]) => `<button data-${attr}="${v}" class="${String(cur) === String(v) ? 'on' : ''}" role="radio" aria-checked="${String(cur) === String(v)}">${l}</button>`).join('')}</div>`;
  function aboutHTML() {
    const it = item(), s = BY[it.id], par = parentOf(it.id), r = root();
    const from = par ? (par.deg === 0 ? `${par.pname} itself` : `mode ${par.deg + 1} of ${par.pname}: ${T.noteName(T.transposeSemis(r, -par.offset), true)} ${par.pname} from its ${ORD[par.deg]}`) : '';
    const rows = glance(it.id, r).filter(([k]) => ['Notes', 'Tensions', 'Avoid notes', 'Feel', 'Same notes as'].includes(k));
    return `<h2><span class="csq">${fmt(chordName())}${it.label ? ` <small>${fmt(it.label.replace(/^7sus4/, ''))}</small>` : ''}</span> → ${fmt(T.noteName(r, true))} ${esc(s.name)}</h2>
      ${from ? `<p class="note">${fmt(from)}</p>` : ''}
      <p>${fmt(it.use)}</p>
      <dl class="fsglance">${rows.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${fmt(v)}</dd>`).join('')}</dl>`;
  }
  function draw() {
    const fam = FAMILIES.find((f) => f.id === O.fam), it = item(), p = posAt();
    if (O.view === 'nps' && BY[it.id].ivs.length < 7) O.view = 'shape';
    $app.innerHTML = `
    <header class="chead"><button class="icon" data-f="back" aria-label="Back">‹</button><h1>Chord scales</h1><button class="icon" data-f="play" aria-label="${R.on ? 'Stop' : 'Start'}">${R.on ? '■' : '▶'}</button></header>
    <div class="chips fskeys">${KEYS.map((k) => `<button class="chip ${O.key === k ? 'on' : ''}" data-key="${k}">${fmt(T.pretty(k))}</button>`).join('')}</div>
    ${seg('fam', O.fam, FAMILIES.map((f) => [f.id, esc(f.name)]))}
    <p class="note csblurb">${esc(fam.blurb)}</p>
    <div class="chips cschips">${fam.items.map((x) => `<button class="chip ${x.id === it.id ? 'on' : ''}" data-cs="${x.id}"><b>${fmt(H.chordName(root(), x.q))}${x.label ? fmt(x.label.replace(/^7sus4/, '')) : ''}</b> <small>${esc(BY[x.id].name)}</small></button>`).join('')}</div>
    <section class="card csabout">${aboutHTML()}</section>
    <div class="fsopt"><span>Where</span>${seg('view', O.view, [['shape', 'CAGED shapes'], ...(BY[it.id].ivs.length >= 7 ? [['nps', '3 per string']] : []), ['neck', 'Whole neck']])}</div>
    <div class="fsopt"><span>Show</span>${seg('labels', O.labels, [['finger', 'Fingers'], ['iv', 'Degrees'], ['note', 'Notes']])}</div>
    ${p ? `<div class="fspos3"><button class="icon" data-f="pos-" aria-label="Lower position">‹</button><p><b>${esc(p.name)}</b><small>${esc(p.sub)}${p.n > 1 ? ` · ${p.k + 1} of ${p.n}, low to high` : ''}</small></p><button class="icon" data-f="pos+" aria-label="Higher position">›</button></div>` : ''}
    <div class="fsplay csplay"><button class="primary ${R.on ? 'stop' : ''}" data-f="play">${R.on ? '■ Stop' : '▶ Play over the chord'}</button><div class="fsplayr">${R.on ? '<div class="beats csbeats"><i></i><i></i><i></i><i></i></div>' : `<small>the chord held${O.metro ? ', with a click' : ''}${O.go === 'auto' ? `, moving every ${O.every} beats` : ''}</small>`}</div></div>
    <div class="stage fsneck" id="csswipe">${p ? neck(p) : ''}</div>
    <div class="legend"><span class="k r">root</span><span class="k t3">3rd</span><span class="k t5">5th</span><span class="k t7">7th</span><span class="k tx">tension</span><span class="k sc">rest of the scale</span></div>
    <p class="note">The white-ringed notes are the ${fmt(chordName())} grip in this area: play it, then the scale around it.${O.labels === 'finger' && O.view === 'nps' ? ' Three per string: half then whole 1-2-4, whole then half 1-3-4, whole-whole 1-2-4 with a stretch.' : O.labels === 'finger' && O.view === 'shape' ? ' One finger per fret, the index where most notes sit; a 1 or 4 outside that is a stretch.' : ''}</p>
    <div class="chips"><button class="chip" data-f="hear">▶ Hear this position, up and down</button></div>
    <section class="card">
      <div class="fsopt"><span>Click</span>${seg('metro', O.metro ? 1 : 0, [[1, 'On'], [0, 'Off']])}</div>
      <div class="fsrow fstempo"><span class="lbl">Tempo</span><input type="range" id="csbpm" min="40" max="200" step="2" value="${O.bpm}" aria-label="Tempo"><span class="fsbpm"><b id="csbpmv">${O.bpm}</b><small>bpm</small></span></div>
      <div class="fsopt"><span>Move</span>${seg('go', O.go, [['manual', 'By hand'], ['auto', 'Auto, up and down']])}</div>
      ${O.go === 'auto' ? `<div class="fsopt"><span>Every</span>${seg('every', O.every, [[8, '8 beats'], [16, '16'], [32, '32']])}</div>` : ''}
    </section>
    <section class="card"><h2>How to practise it</h2><ul class="cstips">
      <li>Play the grip, then the scale from its lowest note to its highest and back, in time. Then the next position up.</li>
      <li>Land a chord tone (coloured) on every beat 1; the tensions (purple) are the sound of the scale, so lean on them and resolve them a step to a chord tone.</li>
      <li>Auto walks up the neck and back down, a position every few bars, with the chord held: keep playing through each move.</li>
      <li>Then change chord, same root: you’ll hear what each scale adds, and the fingers learn where the notes move.</li>
    </ul></section>`;
    const rr = $app.querySelector('#csbpm');
    rr.oninput = () => { O.bpm = Number(rr.value); document.getElementById('csbpmv').textContent = O.bpm; };
    rr.onchange = () => save();
  }
  let sx = null;
  $app.ontouchstart = (e) => { sx = e.target.closest('#csswipe') ? e.touches[0].clientX : null; };
  $app.ontouchend = (e) => { if (sx === null) return; const dx = e.changedTouches[0].clientX - sx; sx = null; if (Math.abs(dx) >= 40) step(dx < 0 ? 1 : -1); };
  $app.onclick = (e) => {
    const b = e.target.closest('button'); if (!b) return;
    const d = b.dataset;
    if (d.key) { O.key = d.key; save(); padChord(); return draw(); }
    if (d.fam) { O.fam = d.fam; O.id = FAMILIES.find((f) => f.id === d.fam).items[0].id; O.pos = 0; save(); padChord(); return draw(); }
    if (d.cs) { O.id = d.cs; save(); padChord(); return draw(); }
    if (d.view) { O.view = d.view; O.pos = 0; save(); return draw(); }
    if (d.labels) { O.labels = d.labels; save(); return draw(); }
    if (d.metro !== undefined) { O.metro = d.metro === '1'; save(); return draw(); }
    if (d.go) { O.go = d.go; R.since = 0; save(); return draw(); }
    if (d.every) { O.every = Number(d.every); save(); return draw(); }
    const a = d.f;
    if (a === 'back') { stop(); return onBack(); }
    if (a === 'play') { if (R.on) { stop(); return draw(); } return start(); }
    if (a === 'pos+' || a === 'pos-') return step(a === 'pos+' ? 1 : -1);
    if (a === 'hear') return hearIt();
  };
  draw();
  return stop;
}
