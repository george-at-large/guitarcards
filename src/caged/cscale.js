// Chord scales: a scale's own chords (melodic minor harmonised: i m(maj7), ii m7, ♭III maj7♯5, IV7, V7, viø7, viiø7),
// played in order in one CAGED area or on one string set, with good fingerings. Triads, sevenths, or each chord with
// the extension worth knowing on it (IV7♯11 and VII7alt in melodic minor, say). Voicings: CAGED grips, drop 2, drop 3
// or triads; in an area they're voice-led and stay in position, or on a string set they climb the neck in one
// inversion. Step through by hand, or let it play each chord for a few beats.
import * as T from '../theory.js';
import * as A from '../audio.js';
import * as G from './grips.js';
import * as H from './harmony.js';

const KEYS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];

// each scale: its degrees, the triad / seventh / extended chord on each, and the mode each chord comes from
export const SCALES = [
  { id: 'mel', name: 'Melodic minor', ivs: ['1', '2', 'b3', '4', '5', '6', '7'],
    tri: ['min', 'min', 'aug', 'maj', 'maj', 'dim', 'dim'],
    sev: ['mMaj7', 'm7', 'maj7#5', '7', '7', 'm7b5', 'm7b5'],
    ext: ['mMaj9', 'm7', 'maj7#5', '7#11', '7b13', 'm7b5', '7alt'],
    modes: ['melodic minor', 'Dorian ♭2', 'Lydian augmented', 'Lydian dominant', 'Mixolydian ♭6', 'Locrian ♮2', 'altered'],
    why: ['the 9 sits well on the minor-major chord', 'the ♭9 is an avoid note, so the plain m7 (or a sus4♭9)', 'the ♯5 is already the colour', 'the ♯11 is this mode’s sound: the tritone-sub and ♭VII7 chord', 'the ♭13 points the dominant towards minor', 'the natural 9 is usable here (Locrian ♮2)', 'read as a dominant: every tension altered'] },
  { id: 'maj', name: 'Major', ivs: ['1', '2', '3', '4', '5', '6', '7'],
    tri: ['maj', 'min', 'min', 'maj', 'maj', 'min', 'dim'],
    sev: ['maj7', 'm7', 'm7', 'maj7', '7', 'm7', 'm7b5'],
    ext: ['maj9', 'm9', 'm11', 'maj7#11', '13', 'm9', 'm7b5'],
    modes: ['Ionian', 'Dorian', 'Phrygian', 'Lydian', 'Mixolydian', 'Aeolian', 'Locrian'],
    why: ['the 9 (the 11 would clash with the 3rd)', 'Dorian takes 9, 11 and 13', 'the ♭9 is an avoid note, so the 11 instead', 'the ♯11 is Lydian’s sound', 'the 13 (with the 9) is the classic dominant colour', 'the 9 (the ♭13 is an avoid note)', 'the ♭9 is an avoid note: keep it m7♭5'] },
  { id: 'harm', name: 'Harmonic minor', ivs: ['1', '2', 'b3', '4', '5', 'b6', '7'],
    tri: ['min', 'dim', 'aug', 'min', 'maj', 'maj', 'dim'],
    sev: ['mMaj7', 'm7b5', 'maj7#5', 'm7', '7', 'maj7', 'dim7'],
    ext: ['mMaj9', 'm7b5', 'maj7#5', 'm9', '7b9b13', 'maj7#11', 'dim7'],
    modes: ['harmonic minor', 'Locrian ♮6', 'Ionian ♯5', 'Dorian ♯4', 'Phrygian dominant', 'Lydian ♯2', 'super-Locrian 𝄫7'],
    why: ['the 9 on the minor-major tonic', 'the ♭9 is an avoid note: keep it m7♭5', 'the ♯5 is already the colour', 'the 9 (and the ♯11 is there too)', '♭9 and ♭13: the V of a minor key', 'the ♯11 (and the ♯9) of Lydian ♯2', 'the diminished 7th, already symmetrical'] },
  { id: 'nat', name: 'Natural minor', ivs: ['1', '2', 'b3', '4', '5', 'b6', 'b7'],
    tri: ['min', 'dim', 'maj', 'min', 'min', 'maj', 'maj'],
    sev: ['m7', 'm7b5', 'maj7', 'm7', 'm7', 'maj7', '7'],
    ext: ['m9', 'm7b5', 'maj9', 'm9', 'm11', 'maj7#11', '9'],
    modes: ['Aeolian', 'Locrian', 'Ionian', 'Dorian', 'Phrygian', 'Lydian', 'Mixolydian'],
    why: ['the 9 (the ♭13 is an avoid note)', 'the ♭9 is an avoid note: keep it m7♭5', 'the 9 on the relative major', 'Dorian takes 9, 11 and 13', 'the ♭9 is an avoid note, so the 11 instead', 'the ♯11, Lydian’s sound', 'the 9 on ♭VII7'] },
];
// voicing families and their string sets
const VOICE = {
  caged: { name: 'CAGED grips', sets: [] },
  d2: { name: 'Drop 2', sets: ['4321', '5432', '6543'] },
  d3: { name: 'Drop 3', sets: ['6432', '5321'] },
  tri: { name: 'Triads', sets: ['321', '432', '543', '654'] },
};
const ORDERS = {
  up: { name: 'Up', seq: [0, 1, 2, 3, 4, 5, 6, 7] },
  down: { name: 'Down', seq: [7, 6, 5, 4, 3, 2, 1, 0] },
  updown: { name: 'Up and down', seq: [0, 1, 2, 3, 4, 5, 6, 7, 6, 5, 4, 3, 2, 1] },
  fourths: { name: 'In 4ths', seq: [0, 3, 6, 2, 5, 1, 4, 7] }, // I IV vii iii vi ii V I: the diatonic cycle
};
const INV = [['1', ['1']], ['3rd', ['3', 'b3']], ['5th', ['5', 'b5', '#5']], ['7th', ['7', 'b7', 'bb7', '6']]];

export function renderChordScales($app, ctx) {
  const { D, save, neckSVG, esc, fmt, onBack } = ctx;
  const O = D.cs2 = Object.assign({ key: 'C', scale: 'mel', size: 'sev', voice: 'caged', set: '4321', where: 'E', inv: 0, order: 'up', labels: 'finger', beats: 4, bpm: 72, k: 0 }, D.cs2 || {});
  const R = { on: false, timer: null, next: 0, beat: 0, vis: [], seq: null };

  const sc = () => SCALES.find((s) => s.id === O.scale) || SCALES[0];
  const tonic = () => T.parseNote(O.key);
  const size = () => (O.voice === 'tri' ? 'tri' : O.size === 'tri' && O.voice !== 'caged' ? 'sev' : O.size);
  const vid = () => (O.voice === 'caged' ? 'caged' : `${O.voice}:${O.set}`);
  const chordAt = (d) => {
    const s = sc(), i = d % 7, q = s[size()][i], root = T.transpose(tonic(), s.ivs[i]);
    return { i, root, q, name: H.chordName(root, q), rn: H.numeral(s.ivs[i], q), mode: s.modes[i], why: s.why[i], octave: d === 7 };
  };

  // ---------- the voicings, worked out for the whole sequence (each depends on the one before) ----------
  function bassIv(v) { const low = v.notes.reduce((a, b) => (b.string > a.string ? b : a)); return low.iv; }
  function sequence() {
    const seq = ORDERS[O.order].seq, out = [];
    let prev = null;
    const pos = O.where === 'neck' ? null : G.positionOf(tonic(), O.where);
    for (let j = 0; j < seq.length; j++) {
      const c = chordAt(seq[j]);
      let v = null;
      if (pos) {
        v = O.voice === 'caged' ? G.gripInPosition(c.root, c.q, pos, prev) : G.voiceLeadPick(c.root, c.q, vid(), pos, prev);
        // a few extended chords have no CAGED grip in some areas: then the nearest voicing of any kind there
        if (!v && O.voice === 'caged') v = G.voiceLeadPick(c.root, c.q, 'any', pos, prev) || G.voiceLeadPick(c.root, c.q, 'd2:all', pos, prev);
      }
      else {
        // up the neck on one string set, one inversion: the next voicing of that inversion up (or down) from the last
        const all = G.familyVoicings(c.root, c.q, vid(), { lo: 0, hi: 19, mid: 9 });
        const pool = [...all.inside, ...all.outside].filter((x) => x.hi <= 19);
        const want = INV[O.inv]?.[1] || ['1'];
        const match = pool.filter((x) => want.includes(bassIv(x)));
        const cand = match.length ? match : pool;
        if (!cand.length) v = null;
        else if (!prev) v = cand.reduce((a, b) => ((O.order === 'down' ? b.center > a.center : b.center < a.center) ? b : a));
        else {
          const goingDown = seq[j] < seq[j - 1];
          const ahead = cand.filter((x) => (goingDown ? x.center < prev.center - 0.5 : x.center > prev.center + 0.5));
          const pick = ahead.length ? ahead : cand;
          v = pick.reduce((a, b) => (Math.abs(b.center - prev.center) < Math.abs(a.center - prev.center) ? b : a));
          if (!ahead.length) c.wrap = goingDown ? 'up' : 'down'; // out of neck: the climb jumps an octave here
        }
      }
      out.push({ ...c, v });
      if (v) prev = v;
    }
    return out;
  }
  const seq = () => (R.seq ||= sequence());
  const reset = () => { R.seq = null; O.k = 0; };

  // ---------- sound ----------
  function strum(v, t, dur) { if (v) A.strum(G.gripMidis(v), t, { dur }); }
  function clock() {
    if (!R.on) return;
    const c = A.audioCtx();
    if (R.next < c.currentTime - 0.02) R.next = c.currentTime + 0.05;
    while (R.next < c.currentTime + 0.12) {
      const t = R.next, b = R.beat++, s = seq(), dur = 60 / O.bpm;
      const k = Math.floor(b / O.beats) % s.length, first = b % O.beats === 0;
      if (first) strum(s[k].v, t, dur * O.beats * 0.95);
      A.click(t, first ? 2 : 1);
      R.vis.push(setTimeout(() => {
        if (!R.on) return;
        if (first && O.k !== k) { O.k = k; drawStage(); }
        document.querySelectorAll('.csbeats i').forEach((el, i) => el.classList.toggle('on', i === (b % O.beats) % 4));
      }, Math.max(0, (t - c.currentTime) * 1000)));
      if (R.vis.length > 64) R.vis.splice(0, 32);
      R.next += dur;
    }
    R.timer = setTimeout(clock, 25);
  }
  async function start() {
    A.unlockAudio().catch(() => {});
    R.on = true;
    await Promise.race([A.ensureRunning(), new Promise((r) => setTimeout(r, 500))]);
    if (!R.on) return;
    R.next = A.audioCtx().currentTime + 0.1; R.beat = O.k * O.beats;
    clock(); draw();
  }
  function stop() { R.on = false; clearTimeout(R.timer); R.vis.forEach(clearTimeout); R.vis = []; A.hush(); }
  function hearNow() {
    const s = seq()[O.k]; if (!s?.v) return;
    A.unlockAudio().catch(() => {});
    A.ensureRunning().then(() => strum(s.v, A.audioCtx().currentTime + 0.05, 1.6));
  }

  // ---------- the screen ----------
  const seg = (attr, cur, opts) => `<div class="seg" role="radiogroup">${opts.map(([v, l]) => `<button data-${attr}="${v}" class="${String(cur) === String(v) ? 'on' : ''}" role="radio" aria-checked="${String(cur) === String(v)}">${l}</button>`).join('')}</div>`;
  function win(v) {
    if (O.where !== 'neck') { const p = G.positionOf(tonic(), O.where); return { lo: Math.min(p.lo, v?.lo ?? p.lo), hi: Math.max(p.hi, v?.hi ?? p.hi), band: { lo: p.lo, hi: p.hi } }; }
    const lo = Math.max(0, (v?.lo ?? 1) - 1); return { lo, hi: Math.max((v?.hi ?? 4) + 1, lo + 4), band: null };
  }
  function stageHTML() {
    const s = seq(), k = ((O.k % s.length) + s.length) % s.length, c = s[k], nx = s[(k + 1) % s.length], prev = s[(k - 1 + s.length) % s.length];
    const w = win(c.v);
    const big = c.v ? neckSVG(c.v, { lo: w.lo, hi: w.hi, band: w.band, labels: O.labels, prev: k ? prev.v : null }) : '<div class="cnone">No voicing for this one here</div>';
    const wn = win(nx.v), small = nx.v ? neckSVG(nx.v, { lo: wn.lo, hi: wn.hi, labels: 'iv', tiny: true }) : '';
    return `<div class="csstrip">${s.map((x, i) => `<button class="csch ${i === k ? 'on' : ''}" data-k="${i}"><b>${fmt(x.rn)}</b><i>${fmt(x.name)}</i></button>`).join('')}</div>
      <div class="csnow"><div><h2>${fmt(c.rn)} <span>${fmt(c.name)}</span></h2><p class="note">from ${esc(c.mode)}${size() === 'ext' ? ` · ${fmt(c.why)}` : ''}${c.v?.label ? ` · ${fmt(c.v.label)}` : ''}${c.wrap ? ` · <b class="cswrap">the neck runs out: ${c.wrap === 'down' ? 'down' : 'up'} an octave here</b>` : ''}</p></div>
      <div class="csnext"><small>next</small><b>${fmt(nx.rn)}</b>${small}</div></div>
      <div class="stage fsneck" id="csswipe">${big}</div>
      <div class="legend"><span class="k r">root</span><span class="k t3">3rd</span><span class="k t5">5th</span><span class="k t7">7th</span><span class="k tx">extension</span></div>`;
  }
  function drawStage() { const el = document.getElementById('csstage'); if (el) el.innerHTML = stageHTML(); }
  function draw() {
    const V = VOICE[O.voice];
    if (O.voice !== 'caged' && !V.sets.includes(O.set)) O.set = V.sets[0];
    if (O.where === 'neck' && O.voice === 'caged') O.where = 'E';
    const invOpts = INV.slice(0, size() === 'tri' ? 3 : 4).map(([l], i) => [i, i === 0 ? 'Root' : `${l} in bass`]);
    $app.innerHTML = `
    <header class="chead"><button class="icon" data-f="back" aria-label="Back">‹</button><h1>Chord scales</h1><button class="icon" data-f="play" aria-label="${R.on ? 'Stop' : 'Start'}">${R.on ? '■' : '▶'}</button></header>
    <p class="note csblurb">A scale’s own chords, one on each degree, played in order in one place on the neck.</p>
    <div class="chips fskeys">${KEYS.map((k) => `<button class="chip ${O.key === k ? 'on' : ''}" data-key="${k}">${fmt(T.pretty(k))}</button>`).join('')}</div>
    <div class="fsopt"><span>Scale</span>${seg('scale', O.scale, SCALES.map((x) => [x.id, x.name]))}</div>
    <div class="fsopt"><span>Chords</span>${seg('size', size(), [...(O.voice === 'caged' || O.voice === 'tri' ? [['tri', 'Triads']] : []), ...(O.voice === 'tri' ? [] : [['sev', 'Sevenths'], ['ext', 'Extensions']])])}</div>
    <div class="fsopt"><span>Voicing</span>${seg('voice', O.voice, Object.entries(VOICE).map(([id, v]) => [id, v.name]))}</div>
    ${O.voice !== 'caged' ? `<div class="fsopt"><span>Strings</span>${seg('set', O.set, V.sets.map((x) => [x, x.split('').join('-')]))}</div>` : ''}
    <div class="fsopt"><span>Where</span>${seg('where', O.where, [...G.SHAPES.map((x) => [x, `${x} area`]), ...(O.voice !== 'caged' ? [['neck', 'Up the neck']] : [])])}</div>
    ${O.where === 'neck' ? `<div class="fsopt"><span>Inversion</span>${seg('inv', O.inv, invOpts)}</div>` : ''}
    <div class="fsopt"><span>Order</span>${seg('order', O.order, Object.entries(ORDERS).map(([id, o]) => [id, o.name]))}</div>
    <div class="fsopt"><span>Show</span>${seg('labels', O.labels, [['finger', 'Fingers'], ['iv', 'Intervals'], ['note', 'Notes']])}</div>
    <div class="fsplay csplay"><button class="primary ${R.on ? 'stop' : ''}" data-f="play">${R.on ? '■ Stop' : '▶ Play through'}</button><div class="fsplayr">${R.on ? '<div class="beats csbeats"><i></i><i></i><i></i><i></i></div>' : `<small>each chord strummed, ${O.beats} beats each, with a click</small>`}</div></div>
    <div class="fsrow fstempo"><span class="lbl">Tempo</span><input type="range" id="csbpm" min="40" max="200" step="2" value="${O.bpm}" aria-label="Tempo"><span class="fsbpm"><b id="csbpmv">${O.bpm}</b><small>bpm</small></span></div>
    <div class="fsopt"><span>Each chord</span>${seg('beats', O.beats, [[2, '2 beats'], [4, '4'], [8, '8']])}</div>
    <div class="fsnav csnav"><button class="icon" data-f="prev" aria-label="Previous chord">‹</button><button class="chip" data-f="hear">▶ Hear this chord</button><button class="icon" data-f="next" aria-label="Next chord">›</button></div>
    <div id="csstage">${stageHTML()}</div>
    <p class="note">${O.where === 'neck' ? `On strings ${O.set.split('').join('-')}, each chord in the same inversion, climbing the neck.` : `All in the ${O.where} area of ${fmt(T.noteName(tonic(), true))} (the band): each chord voiced as near the last as it can be, so few fingers move.`} The dotted rings show where the previous chord’s fingers were.</p>`;
    const rr = $app.querySelector('#csbpm');
    rr.oninput = () => { O.bpm = Number(rr.value); document.getElementById('csbpmv').textContent = O.bpm; };
    rr.onchange = () => save();
  }
  const change = (fn) => { fn(); reset(); save(); if (R.on) R.beat = 0; draw(); };
  let sx = null;
  $app.ontouchstart = (e) => { sx = e.target.closest('#csswipe') ? e.touches[0].clientX : null; };
  $app.ontouchend = (e) => { if (sx === null) return; const dx = e.changedTouches[0].clientX - sx; sx = null; if (Math.abs(dx) >= 40) move(dx < 0 ? 1 : -1); };
  function move(dir) { const n = seq().length; O.k = (((O.k + dir) % n) + n) % n; save(); drawStage(); if (!R.on) hearNow(); else R.beat = O.k * O.beats; }
  $app.onclick = (e) => {
    const b = e.target.closest('button'); if (!b) return;
    const d = b.dataset;
    if (d.key) return change(() => { O.key = d.key; });
    if (d.scale) return change(() => { O.scale = d.scale; });
    if (d.size) return change(() => { O.size = d.size; });
    if (d.voice) return change(() => { O.voice = d.voice; if (d.voice === 'tri') O.size = 'tri'; else if (O.size === 'tri' && d.voice !== 'caged') O.size = 'sev'; });
    if (d.set) return change(() => { O.set = d.set; });
    if (d.where) return change(() => { O.where = d.where; });
    if (d.inv !== undefined) return change(() => { O.inv = Number(d.inv); });
    if (d.order) return change(() => { O.order = d.order; });
    if (d.labels) { O.labels = d.labels; save(); return drawStage(); }
    if (d.beats) { O.beats = Number(d.beats); save(); return draw(); }
    if (d.k !== undefined) { O.k = Number(d.k); save(); drawStage(); if (!R.on) hearNow(); else R.beat = O.k * O.beats; return; }
    const a = d.f;
    if (a === 'back') { stop(); return onBack(); }
    if (a === 'play') { if (R.on) { stop(); return draw(); } return start(); }
    if (a === 'next' || a === 'prev') return move(a === 'next' ? 1 : -1);
    if (a === 'hear') return hearNow();
  };
  draw();
  return stop;
}
