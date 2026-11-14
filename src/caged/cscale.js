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
  open: { name: 'Open strings', sets: [] },
};
// open-string voicings of a chord anywhere on the neck: open strings ringing against fretted notes higher up (the
// cowboy chords at the nut left out), the most open strings and the fullest first
export function openGems(root, q) {
  let vs = [];
  try { vs = G.openVoicings(root, q); } catch (e) { return []; }
  const holes = (v) => { const ss = v.notes.map((n) => n.string); let k = 0; for (let x = Math.min(...ss) + 1; x < Math.max(...ss); x++) if (!ss.includes(x)) k++; return k; };
  const up = vs.filter((v) => { const fr = v.notes.filter((n) => n.fret > 0).map((n) => n.fret); return fr.length >= 1 && Math.max(...fr) >= 4 && v.notes.length >= 4 && !holes(v); });
  const pool = up.length ? up : vs;
  const score = (v) => v.opens * 2 + v.notes.length - v.cost;
  // one per hand position: the best at each lowest fret, so the list spreads up the neck
  const best = new Map();
  for (const v of pool) { const fr = v.notes.filter((n) => n.fret > 0).map((n) => n.fret); const at = fr.length ? Math.min(...fr) : 0; if (!best.has(at) || score(v) > score(best.get(at))) best.set(at, v); }
  return [...best.values()].sort((a, b) => score(b) - score(a));
}
const ORDERS = {
  up: { name: 'Up', seq: [0, 1, 2, 3, 4, 5, 6, 7] },
  down: { name: 'Down', seq: [7, 6, 5, 4, 3, 2, 1, 0] },
  updown: { name: 'Up and down', seq: [0, 1, 2, 3, 4, 5, 6, 7, 6, 5, 4, 3, 2, 1] },
  fourths: { name: 'In 4ths', seq: [0, 3, 6, 2, 5, 1, 4, 7] }, // I IV vii iii vi ii V I: the diatonic cycle
};
const INV = [['1', ['1']], ['3rd', ['3', 'b3']], ['5th', ['5', 'b5', '#5']], ['7th', ['7', 'b7', 'bb7', '6']]];

// a voicing with a muted string in the middle of it (other than drop 3's, which is standard)
const holes = (v) => { const ss = v.notes.map((n) => n.string), lo = Math.min(...ss), hi = Math.max(...ss); let k = 0; for (let s = lo; s <= hi; s++) if (!ss.includes(s)) k++; return k; };
// the chord in one CAGED area: its CAGED grip when that's a clean, everyday grip; when the grip needs a muted string
// inside it (the G-shape m7 without its B string, say), or there's no grip, the nearest standard voicing instead:
// drop 2 or drop 3 for 7th chords, close or spread triads for triads
export function voiceInArea(root, q, pos, prev, voice, vid, triads) {
  if (voice !== 'caged') return G.voiceLeadPick(root, q, vid, pos, prev);
  const g = G.gripInPosition(root, q, pos, prev);
  if (g && !holes(g)) return g;
  const alts = (triads ? ['tri:adj', 'spread'] : ['d2:all', 'd3:all']).map((id) => G.voiceLeadPick(root, q, id, pos, prev)).filter(Boolean);
  if (!alts.length) return g;
  const sc = (x) => (prev ? G.movement(prev, x) : Math.abs(x.center - pos.mid)) + (triads && holes(x) ? 2 : 0);
  return alts.reduce((a, b) => (sc(b) < sc(a) ? b : a));
}

export function renderChordScales($app, ctx) {
  const { D, save, neckSVG, esc, fmt, onBack } = ctx;
  const O = D.cs2 = Object.assign({ key: 'C', scale: 'mel', size: 'sev', voice: 'caged', set: '4321', where: 'E', inv: 0, order: 'up', labels: 'finger', beats: 4, bpm: 72, k: 0 }, D.cs2 || {});
  const R = { on: false, timer: null, next: 0, beat: 0, vis: [], seq: null };

  const sc = () => SCALES.find((s) => s.id === O.scale) || SCALES[0];
  const tonic = () => T.parseNote(O.key);
  const size = () => (O.voice === 'tri' ? 'tri' : O.size === 'tri' && O.voice !== 'caged' && O.voice !== 'open' ? 'sev' : O.size);
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
    const pos = O.where === 'neck' || O.voice === 'open' ? null : G.positionOf(tonic(), O.where);
    for (let j = 0; j < seq.length; j++) {
      const c = chordAt(seq[j]);
      let v = null;
      if (O.voice === 'open') {
        // the most open strings ringing, then the smallest move from the last chord
        const gs = openGems(c.root, c.q);
        if (gs.length) { const most = Math.max(...gs.map((x) => x.opens)); const top = gs.filter((x) => x.opens >= most - 1); v = top.reduce((a, b) => ((prev ? G.movement(prev, b) * 0.4 : 0) - b.opens * 2 < (prev ? G.movement(prev, a) * 0.4 : 0) - a.opens * 2 ? b : a)); }
        else v = voiceInArea(c.root, c.q, G.positionOf(tonic(), 'E'), prev, 'caged', 'caged', size() === 'tri');
      } else if (pos) v = voiceInArea(c.root, c.q, pos, prev, O.voice, vid(), size() === 'tri');
      else if (O.voice !== 'open') {
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
    if (O.where !== 'neck' && O.voice !== 'open') { const p = G.positionOf(tonic(), O.where); return { lo: Math.min(p.lo, v?.lo ?? p.lo), hi: Math.max(p.hi, v?.hi ?? p.hi), band: { lo: p.lo, hi: p.hi } }; }
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
      <div class="legend"><span class="k r">root</span><span class="k t3">3rd</span><span class="k t5">5th</span><span class="k t7">7th</span><span class="k tx">extension</span></div>
      ${O.voice === 'open' ? gemsHTML(c) : ''}`;
  }
  // more open-string voicings of this chord around the neck: tap one to hear it
  function gemsHTML(c) {
    const gs = openGems(c.root, c.q).filter((g) => !c.v || g.notes.map((n) => n.string + ':' + n.fret).join() !== c.v.notes.map((n) => n.string + ':' + n.fret).join()).slice(0, 6);
    R.gems = gs;
    if (!gs.length) return '';
    return `<section class="card csgems"><h2>More open-string ${fmt(c.name)} voicings</h2><div class="csgemgrid">${gs.map((g, i) => {
      const fr = g.notes.filter((n) => n.fret > 0).map((n) => n.fret), lo = Math.max(0, Math.min(...fr) - 1), hi = Math.max(Math.max(...fr) + 1, lo + 4);
      return `<button class="csgem" data-gem="${i}">${neckSVG(g, { lo, hi, labels: 'iv', small: true })}<small>frets ${Math.min(...fr)}–${Math.max(...fr)} · ${g.opens} open</small></button>`;
    }).join('')}</div><p class="note">Tap one to hear it. Open strings ring under fretted notes higher up: the keys whose notes match the open strings (E, A, D, G) have the most.</p></section>`;
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
    <div class="fsopt"><span>Chords</span>${seg('size', size(), [...(O.voice === 'caged' || O.voice === 'tri' || O.voice === 'open' ? [['tri', 'Triads']] : []), ...(O.voice === 'tri' ? [] : [['sev', 'Sevenths'], ['ext', 'Extensions']])])}</div>
    <div class="fsopt"><span>Voicing</span>${seg('voice', O.voice, Object.entries(VOICE).map(([id, v]) => [id, v.name]))}</div>
    ${O.voice !== 'caged' ? `<div class="fsopt"><span>Strings</span>${seg('set', O.set, V.sets.map((x) => [x, x.split('').join('-')]))}</div>` : ''}
    ${O.voice === 'open' ? `<p class="note">Open strings: anywhere on the neck, as many open strings ringing as the chord allows. Best in E, A, D and G.</p>` : `<div class="fsopt"><span>Where</span>${seg('where', O.where, [...G.SHAPES.map((x) => [x, `${x} area`]), ...(O.voice !== 'caged' ? [['neck', 'Up the neck']] : [])])}</div>`}
    ${O.where === 'neck' && O.voice !== 'open' ? `<div class="fsopt"><span>Inversion</span>${seg('inv', O.inv, invOpts)}</div>` : ''}
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
    if (d.voice) return change(() => { O.voice = d.voice; if (d.voice === 'tri') O.size = 'tri'; else if (O.size === 'tri' && d.voice !== 'caged' && d.voice !== 'open') O.size = 'sev'; });
    if (d.set) return change(() => { O.set = d.set; });
    if (d.where) return change(() => { O.where = d.where; });
    if (d.inv !== undefined) return change(() => { O.inv = Number(d.inv); });
    if (d.order) return change(() => { O.order = d.order; });
    if (d.labels) { O.labels = d.labels; save(); return drawStage(); }
    if (d.beats) { O.beats = Number(d.beats); save(); return draw(); }
    if (d.gem !== undefined) { const g = R.gems?.[Number(d.gem)]; if (g) { A.unlockAudio().catch(() => {}); A.ensureRunning().then(() => strum(g, A.audioCtx().currentTime + 0.05, 1.8)); } return; }
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
