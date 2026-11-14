// Quick start: a coach that keeps a model of your playing and plans each session from it. Four areas (chords in
// the shape, voicing families, lines over the changes, progressions), each a ladder of levels. For each area the
// model holds: the level, a working tempo, the fastest tempo you've called comfortable and the slowest you couldn't
// keep up with (it aims between them), how each CAGED shape has gone (reps and how often it was too hard), the keys
// played, and when it was last practised. A session is a warm-up a step below your level, two growth-edge blocks from
// the areas practised least recently (spacing, interleaving), in your weakest shapes, and a progression to finish.
// After each block you say how it went (couldn't keep up, just right, easy) and the model updates. Pure: no DOM.

export const SHAPES = ['C', 'A', 'G', 'E', 'D'];
export const KEYS = ['C', 'F', 'Bb', 'Eb', 'Ab', 'Db', 'F#', 'B', 'E', 'A', 'D', 'G']; // the cycle of 4ths

// each level is a set of Chord changes settings
export const AREAS = {
  grips: { name: 'Chords in the shape', levels: [
    { name: 'Diatonic triads', o: { src: 'set', set: 'dia', colour: 'tri', voicing: 'caged', play: 'chords' } },
    { name: 'Diatonic sevenths', o: { src: 'set', set: 'dia', colour: 'sev', voicing: 'caged', play: 'chords' } },
    { name: 'Borrowed chords, triads', o: { src: 'set', set: 'exp', colour: 'tri', voicing: 'caged', play: 'chords' } },
    { name: 'Borrowed chords, sevenths', o: { src: 'set', set: 'exp', colour: 'sev', voicing: 'caged', play: 'chords' } },
    { name: 'Everything, sevenths', o: { src: 'set', set: 'chr', colour: 'sev', voicing: 'caged', play: 'chords' } },
    { name: 'Everything, colour tones', o: { src: 'set', set: 'chr', colour: 'col', voicing: 'caged', play: 'chords' } },
    { name: 'Any chord at all', o: { src: 'set', set: 'any', colour: 'sev', voicing: 'caged', play: 'chords' } },
  ] },
  voicings: { name: 'Voicing families', levels: [
    { name: 'Triads on strings 3-2-1', o: { voicing: 'tri:321', colour: 'tri' } },
    { name: 'Triads on strings 4-3-2', o: { voicing: 'tri:432', colour: 'tri' } },
    { name: 'Triads on strings 5-4-3', o: { voicing: 'tri:543', colour: 'tri' } },
    { name: 'Triads on any adjacent strings', o: { voicing: 'tri:adj', colour: 'tri' } },
    { name: 'Shells', o: { voicing: 'shell:any', colour: 'sev' } },
    { name: 'Drop 2 on strings 4-3-2-1', o: { voicing: 'd2:4321', colour: 'sev' } },
    { name: 'Drop 2 on strings 5-4-3-2', o: { voicing: 'd2:5432', colour: 'sev' } },
    { name: 'Drop 2 on any string set', o: { voicing: 'd2:all', colour: 'sev' } },
    { name: 'Drop 3', o: { voicing: 'd3:all', colour: 'sev' } },
    { name: 'Every four-note type', o: { voicing: 'mix:four', colour: 'sev' } },
  ].map((l) => ({ ...l, o: { src: 'set', set: 'dia', play: 'chords', ...l.o } })) },
  lines: { name: 'Lines over the changes', levels: [
    { name: 'Arpeggios of the key’s chords', o: { play: 'arps', src: 'set', set: 'dia', colour: 'tri' } },
    { name: 'Seventh-chord arpeggios', o: { play: 'arps', src: 'set', set: 'dia', colour: 'sev' } },
    { name: 'Guide tones through ii–V–I', o: { play: 'guide', src: 'prog', prog: 'major-ii-v-i', pcolour: 'sev' } },
    { name: 'Scales, easy, over the key’s chords', o: { play: 'scales', src: 'set', set: 'dia', colour: 'sev', scaleLevel: 1 } },
    { name: 'Guide tones through a turnaround', o: { play: 'guide', src: 'prog', prog: 'iii-vi-ii-v-i', pcolour: 'sev' } },
    { name: 'Scales over borrowed chords', o: { play: 'scales', src: 'set', set: 'exp', colour: 'sev', scaleLevel: 2 } },
    { name: 'Arpeggios over borrowed chords', o: { play: 'arps', src: 'set', set: 'exp', colour: 'sev' } },
    { name: 'Guide tones through Autumn Leaves', o: { play: 'guide', src: 'prog', prog: 'autumn-leaves', pcolour: 'sev' } },
    { name: 'Scales over everything', o: { play: 'scales', src: 'set', set: 'chr', colour: 'sev', scaleLevel: 3 } },
  ] },
  progs: { name: 'Progressions', levels: [
    { name: 'Cadences', cat: 'Cadences', o: { pcolour: 'as', around: 'off' } },
    { name: 'Pop and rock', cat: 'Pop and rock', o: { pcolour: 'as', around: 'off' } },
    { name: 'Blues', cat: 'Blues', o: { pcolour: 'as', around: 'off' } },
    { name: 'Pop and rock in sevenths', cat: 'Pop and rock', o: { pcolour: 'sev', around: 'off' } },
    { name: 'Turnarounds', cat: 'Turnarounds and jazz moves', o: { pcolour: 'as', around: 'off' } },
    { name: 'Classical patterns', cat: 'Classical patterns', o: { pcolour: 'as', around: 'off' } },
    { name: 'Pop and rock, borrowing', cat: 'Pop and rock', o: { pcolour: 'as', around: 'mi', aroundAmt: 'medium' } },
    { name: 'Jazz standards', cat: 'Jazz standards', o: { pcolour: 'as', around: 'off' } },
    { name: 'Turnarounds, chromatic', cat: 'Turnarounds and jazz moves', o: { pcolour: 'sev', around: 'chr', aroundAmt: 'medium' } },
    { name: 'Modal vamps', cat: 'Modal vamps', o: { pcolour: 'as', around: 'off' } },
    { name: 'Voice leading', cat: 'Voice leading', o: { pcolour: 'as', around: 'off' } },
    { name: 'Bass lines and slash chords', cat: 'Bass lines and slash chords', o: { pcolour: 'as', around: 'off' } },
    { name: 'Jazz standards in colour', cat: 'Jazz standards', o: { pcolour: 'col', around: 'off' } },
    { name: 'Jazz standards with substitutions', cat: 'Jazz standards', o: { pcolour: 'subs', around: 'both', aroundAmt: 'medium' } },
  ].map((l) => ({ ...l, o: { src: 'prog', play: 'chords', voicing: 'caged', ...l.o } })) },
  modes: { name: 'Modes', needs: { lines: 2 }, levels: [
    ['dorian', 'Dorian'], ['mixolydian', 'Mixolydian'], ['aeolian', 'Aeolian'], ['lydian', 'Lydian'], ['phrygian', 'Phrygian'],
    ['melodic-minor', 'Melodic minor'], ['lydian-dominant', 'Lydian dominant'], ['phrygian-dominant', 'Phrygian dominant'], ['harmonic-minor', 'Harmonic minor'], ['locrian', 'Locrian'],
  ].map(([id, name]) => ({ name: `${name} vamps`, o: { play: 'modal', modal: id, modalSrc: 'vamp' } })) },
  genres: { name: 'Genres', needs: { progs: 2 }, levels: [
    ['pop', 'Pop'], ['rock', 'Rock'], ['blues', 'Blues'], ['folk', 'Folk'], ['country', 'Country'], ['reggae', 'Reggae'], ['funk', 'Funk'], ['indie', 'Indie'],
    ['bossa', 'Bossa nova'], ['latin', 'Latin'], ['gospel', 'Gospel'], ['neosoul', 'Neo-soul'], ['punk', 'Punk'], ['metal', 'Metal', true], ['flamenco', 'Flamenco', true], ['jazz', 'Jazz'],
  ].map(([id, name, minor]) => ({ name, minor: !!minor, o: { src: 'genre', genre: id, play: 'chords', pcolour: 'as', voicing: 'caged' } })) },
  tg: { name: 'Ted Greene voicings', needs: { voicings: 4 }, tg: true, levels: [
    { name: 'Cadences', cat: 'Cadences' }, { name: 'Pop and rock in sevenths', cat: 'Pop and rock', pc: 'sev' }, { name: 'Turnarounds', cat: 'Turnarounds and jazz moves' },
    { name: 'Voice leading', cat: 'Voice leading' }, { name: 'Jazz standards', cat: 'Jazz standards' }, { name: 'Jazz standards in colour', cat: 'Jazz standards', pc: 'col' },
  ].map((l) => ({ ...l, o: { src: 'prog', play: 'chords', voicing: 'tg', pcolour: l.pc || 'as', around: 'off' } })) },
};
// an area opens once the areas it builds on have got far enough
const open = (st, k, opt) => { const a = AREAS[k]; if (a.tg && !opt.tg) return false; return Object.entries(a.needs || {}).every(([b, lv]) => st.areas[b].lv >= lv); };
// how much of the curriculum is done: levels climbed, over all of them
export function progress(stIn) {
  const st = ensure(stIn);
  let got = 0, all = 0;
  for (const [k, a] of Object.entries(AREAS)) { all += a.levels.length; got += Math.min(a.levels.length, st.areas[k].lv + (st.areas[k].streak || st.areas[k].ok ? 0.5 : 0)); }
  return got / all;
}
const START_BPM = 60, MIN_BPM = 40, LEVEL_UP_BPM = 84;

export function fresh() {
  const a = {};
  for (const k of Object.keys(AREAS)) a[k] = { lv: 0, bpm: START_BPM, ok: 0, hard: 999, streak: 0, last: 0, shapes: {}, keys: {}, n: 0 };
  return { v: 1, sessions: 0, areas: a, progSeen: {}, log: [] };
}
export function ensure(st) {
  if (!st || st.v !== 1) return fresh();
  for (const k of Object.keys(AREAS)) st.areas[k] ||= { lv: 0, bpm: START_BPM, ok: 0, hard: 999, streak: 0, last: 0, shapes: {}, keys: {}, n: 0 };
  return st;
}

// the weakest shape for an area: untried shapes first, then the fewest reps (a "too hard" counts against it), but
// not the same shape twice running, so a struggle doesn't become a rut
function weakestShape(ar) {
  const score = (s) => { const r = ar.shapes[s] || { n: 0, hard: 0 }; return (r.n ? 0 : -100) + r.n - r.hard + (s === ar.lastShape ? 3 : 0); };
  return SHAPES.slice().sort((a, b) => score(a) - score(b) || SHAPES.indexOf(a) - SHAPES.indexOf(b))[0];
}
// the key: the area's next key round the cycle of 4ths
function keyFor(ar) {
  const n = Object.values(ar.keys).reduce((t, x) => t + x, 0);
  return KEYS[n % KEYS.length];
}
// a progression from the level's category, the one played least lately
function progFor(st, cat, all) {
  const pool = all.filter((p) => p.cat === cat);
  return pool.slice().sort((a, b) => (st.progSeen[a.id] || 0) - (st.progSeen[b.id] || 0) || Math.random() - 0.5)[0];
}
const ago = (st, ar) => (ar.last ? st.sessions - ar.last : Infinity);

// the session, as long as you have: a warm-up (from ten minutes), growth-edge blocks from the open areas left
// longest (in their weakest shapes), and a progression to finish (from eight minutes); each block with its settings,
// its length and why it was chosen
export function plan(stIn, library, opt = {}) {
  const st = ensure(stIn), minutes = opt.minutes || 15;
  const A = st.areas, blocks = [];
  const mk = (area, lvIdx, mins, role, why, bpmAdj = 0, shapeAs = null) => {
    const ar = A[area], L = AREAS[area].levels[Math.max(0, Math.min(lvIdx, AREAS[area].levels.length - 1))];
    const shape = shapeAs || (role === 'warm' ? SHAPES.slice().sort((a, b) => ((ar.shapes[b]?.n || 0) - (ar.shapes[a]?.n || 0)))[0] : weakestShape(ar));
    const key = keyFor(ar);
    const o = { ...L.o };
    let prog = null;
    if (L.cat) { prog = progFor(st, L.cat, library); o.prog = prog.id; }
    const minor = prog ? !!prog.minor : !!L.minor;
    const bpm = Math.max(MIN_BPM, Math.round(ar.bpm + bpmAdj));
    return { area, role, lv: lvIdx, title: AREAS[area].name, level: L.name, prog: prog ? prog.name : null, key, minor, shape, bpm, minutes: mins, why, o: { ...o, key: minor ? ({ Db: 'C#', Ab: 'G#' }[key] || key) : key, kt: minor ? 'minor' : 'major', shape, bpm } };
  };
  const warm = minutes >= 10 ? 2 : 0, apply = minutes >= 8 ? Math.min(5, Math.max(3, Math.round(minutes * 0.25))) : 0;
  const nEdge = Math.max(1, Math.round((minutes - warm - apply) / 4));
  const pool = Object.keys(AREAS).filter((k) => k !== 'progs' && open(st, k, opt) && !(k === 'grips' && st.sessions === 0));
  const edge = pool.sort((a, b) => ago(st, A[b]) - ago(st, A[a]) || A[a].lv / AREAS[a].levels.length - A[b].lv / AREAS[b].levels.length).slice(0, nEdge);
  if (warm) {
    const wa = ['grips', 'voicings', 'lines'].filter((a) => !edge.includes(a)).sort((a, b) => A[b].n - A[a].n)[0] || 'grips';
    const w = A[wa];
    blocks.push(mk(wa, Math.max(0, w.lv - 1), warm, 'warm', w.n ? `Warm-up: ${AREAS[wa].name.toLowerCase()} a step below your level, in the shape you know best, a little under your tempo.` : 'Warm-up: the plainest version, to get the hands moving.', -6));
  }
  // a long session with few areas open: the same areas again in another shape, so blocks stay short and fresh
  const runs = edge.map((a) => ({ area: a, shape: null }));
  const left = minutes - warm - apply;
  for (let i = 0; runs.length && left / runs.length > 8 && i < 12; i++) {
    const a = edge[i % edge.length], used = runs.filter((r) => r.area === a).map((r) => r.shape || weakestShape(A[a]));
    const next = SHAPES.find((sh) => !used.includes(sh));
    if (!next) break;
    runs.push({ area: a, shape: next });
  }
  runs.sort((x, y) => edge.indexOf(x.area) - edge.indexOf(y.area) || (x.shape ? 1 : 0) - (y.shape ? 1 : 0));
  const len = Math.max(2, Math.round(left / Math.max(1, runs.length)));
  for (const { area, shape } of runs) {
    const ar = A[area];
    if (shape) { blocks.push(mk(area, ar.lv, len, 'edge', `The same again in the ${shape} shape: one area across more of the neck.`, 0, shape)); continue; }
    const why = !ar.n ? `New: the first level of ${AREAS[area].name.toLowerCase()}${AREAS[area].needs ? ', now that you’re ready for it' : ''}.`
      : `${ago(st, ar) > 1 ? `Not practised for ${ago(st, ar)} sessions, so it comes back now. ` : ''}${ar.streak ? `Last time it went well, so ${ar.bpm} bpm today` : ar.hard < 999 && ar.bpm < ar.hard ? `Last time ${ar.hard} bpm was too fast, so ${ar.bpm} today` : `At your working tempo, ${ar.bpm} bpm`}; the ${weakestShape(ar)} shape, your least secure there.`;
    blocks.push(mk(area, ar.lv, len, 'edge', why));
  }
  if (apply) {
    const p = A.progs;
    blocks.push(mk('progs', p.lv, apply, 'apply', p.n ? `Put it to use: a progression from ${AREAS.progs.levels[p.lv].name.toLowerCase()}, at your tempo there.` : 'Put it to use: a real progression to finish.'));
  }
  return blocks;
}

// what you said about a block: hard (couldn't keep up), right (just right), easy
export function rate(stIn, b, how) {
  const st = ensure(stIn), ar = st.areas[b.area], max = AREAS[b.area].levels.length - 1;
  const sh = (ar.shapes[b.shape] ||= { n: 0, hard: 0 });
  sh.n++; if (how === 'hard') sh.hard++;
  ar.keys[b.key] = (ar.keys[b.key] || 0) + 1;
  // a warm-up doesn't count as practising the area (it would push it down the queue)
  if (b.role !== 'warm') { ar.n++; ar.last = st.sessions + 1; ar.lastShape = b.shape; }
  let change = '';
  if (how === 'skip') {
    ar.ok = Math.max(ar.ok, b.bpm); ar.streak = 0;
    if (ar.lv < max) { ar.lv++; ar.bpm = Math.max(START_BPM, b.bpm - 8); ar.ok = 0; ar.hard = 999; change = `${AREAS[b.area].name}: too easy, so straight up to ${AREAS[b.area].levels[ar.lv].name.toLowerCase()}.`; }
    else { ar.bpm = Math.min(200, b.bpm + 12); change = `${AREAS[b.area].name}: too easy at the top level, so ${ar.bpm} bpm next time.`; }
  } else if (b.role === 'warm') { if (how === 'hard' && ar.lv > 0) { ar.bpm = Math.max(MIN_BPM, ar.bpm - 6); change = `${AREAS[b.area].name}: tempo down to ${ar.bpm}.`; } }
  else if (how === 'hard') {
    ar.hard = Math.min(ar.hard, b.bpm); ar.streak = 0;
    if (b.bpm <= MIN_BPM + 6 && ar.lv > 0) { ar.lv--; ar.bpm = Math.max(MIN_BPM, ar.ok || START_BPM); change = `${AREAS[b.area].name}: back a level to ${AREAS[b.area].levels[ar.lv].name.toLowerCase()}.`; }
    else { ar.bpm = Math.max(MIN_BPM, Math.round(ar.ok && ar.ok < b.bpm ? Math.max(ar.ok, b.bpm - 10) : b.bpm - 8)); change = `${AREAS[b.area].name}: slower next time, ${ar.bpm} bpm.`; }
  } else {
    ar.ok = Math.max(ar.ok, b.bpm);
    if (ar.hard < 999 && b.bpm >= ar.hard - 4) ar.hard += how === 'easy' ? 8 : 4; // close to the old ceiling and fine: it was lower than thought
    if (ar.hard <= ar.ok) ar.hard = 999; // you've now managed what used to be too fast
    ar.streak++;
    const step = how === 'easy' ? 8 : 4;
    const up = how === 'easy' ? ar.streak >= 1 && b.bpm >= 66 : ar.streak >= 2 && b.bpm >= LEVEL_UP_BPM;
    if (up && ar.lv < max) { ar.lv++; ar.bpm = Math.max(START_BPM, b.bpm - 16); ar.streak = 0; ar.ok = 0; ar.hard = 999; change = `${AREAS[b.area].name}: up a level, to ${AREAS[b.area].levels[ar.lv].name.toLowerCase()}, a little slower to start.`; }
    else { ar.bpm = Math.min(ar.hard < 999 ? ar.hard - 2 : 200, b.bpm + step); change = `${AREAS[b.area].name}: ${ar.bpm} bpm next time.`; }
  }
  if (b.prog) st.progSeen[b.o.prog] = Date.now();
  st.log = [...(st.log || []).slice(-60), { t: Date.now(), area: b.area, lv: b.lv, bpm: b.bpm, shape: b.shape, key: b.key, how }];
  return { st, change };
}
export function endSession(stIn) { const st = ensure(stIn); st.sessions++; return st; }

// the model, in words
export function beliefs(stIn) {
  const st = ensure(stIn), out = [];
  for (const [k, def] of Object.entries(AREAS)) {
    const ar = st.areas[k];
    if (!ar.n) { out.push({ area: def.name, text: def.needs && !Object.entries(def.needs).every(([b, lv]) => st.areas[b].lv >= lv) ? `Opens once ${Object.entries(def.needs).map(([b, lv]) => `${AREAS[b].name.toLowerCase()} reaches level ${lv + 1}`).join(' and ')}.` : def.tg ? 'Not tried yet (needs your Ted Greene pack on this device).' : 'Not tried yet.' }); continue; }
    const shapes = SHAPES.filter((s) => ar.shapes[s]?.n);
    const weak = weakestShape(ar);
    out.push({ area: def.name, text: `${def.levels[ar.lv].name} (level ${ar.lv + 1} of ${def.levels.length}) at ${ar.bpm} bpm${ar.ok ? `; comfortable up to ${ar.ok}` : ''}${ar.hard < 999 ? `, ${ar.hard} too fast` : ''}. ${shapes.length < 5 ? `${5 - shapes.length} shape${5 - shapes.length === 1 ? '' : 's'} not tried yet` : `Weakest shape: ${weak}`}.` });
  }
  return out;
}
