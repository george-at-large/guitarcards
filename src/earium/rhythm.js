// Rhythm: patterns built up a layer at a time and described by the voice, then looped. Guitar strums (down, up,
// the hand moving without touching, the chuck, the thumb's bass note) and rhythms from around the world (claves,
// bells, the compás, cross-rhythms). A pattern is a cycle of steps; each layer is a string with one character a step.
//   strum layer:  D down, U up, d u soft, X chuck (muted, percussive), . the hand moves but misses
//   thumb layer:  B the bass note, b the alternate bass, . nothing      pick layer: x a finger pluck (two notes)
//   percussion:   X loud, x soft, . nothing (clave, bell, shaker, kick, snare, clap)
import * as A from '../audio.js';
import * as V from '../caged/voice.js';
import { graph } from './engine.js';

const P = (o) => ({ beats: 4, swing: 0, view: 'grid', chords: ['G'], ...o });
export const PATTERNS = [
  // ---------- core: the ones to know by heart ----------
  P({ id: 'eighths', set: 'core', kind: 'guitar', name: 'Straight eighths: the pendulum', steps: 8,
    desc: 'The strumming hand never stops: down on every beat, up on every “and”. Every other rhythm on the guitar is this motion with some strokes left out.',
    layers: [{ type: 'strum', name: 'strum', seq: 'DUDUDUDU' }], chords: ['G', 'C', 'D', 'G'],
    build: [
      { say: 'The pendulum. Down on every beat.', show: { strum: 'D.D.D.D.' } },
      { say: 'Now up on every and. The hand never stops.', show: { strum: 'DUDUDUDU' } },
    ] }),
  P({ id: 'folk', set: 'core', kind: 'guitar', name: 'The folk strum', steps: 8,
    desc: 'Down, down up, up down up. The hand keeps the pendulum going, but misses the strings on beat three: that gap is the groove.',
    layers: [{ type: 'strum', name: 'strum', seq: 'D.DU.UDU' }], chords: ['G', 'Em', 'C', 'D'],
    build: [
      { say: 'The pendulum first: down, up, all the way.', show: { strum: 'DUDUDUDU' } },
      { say: 'Now miss some strokes: down, down up, up down up.', show: { strum: 'D.DU.UDU' } },
      { say: 'Beat three: the hand moves down, but doesn’t touch.', show: { strum: 'D.DU.UDU' } },
    ] }),
  P({ id: 'boomchick', set: 'core', kind: 'guitar', name: 'Boom-chick', steps: 8,
    desc: 'The bass note on beats one and three, the chord on two and four. The thumb alternates between the root and another bass note.',
    layers: [{ type: 'thumb', name: 'bass', seq: 'B...b...' }, { type: 'strum', name: 'strum', seq: '..D...D.' }], chords: ['G', 'C', 'D', 'G'],
    build: [
      { say: 'The boom: a bass note on one, another on three.', show: { bass: 'B...b...', strum: '........' } },
      { say: 'The chick: a short chord on two and four.', show: { bass: 'B...b...', strum: '..D...D.' } },
    ] }),
  P({ id: 'waltz', set: 'core', kind: 'guitar', name: 'Waltz', steps: 6, beats: 3, meter: '3/4',
    desc: 'Three beats: a bass note on one, the chord on two and three. Oom, pah, pah.',
    layers: [{ type: 'thumb', name: 'bass', seq: 'B.....' }, { type: 'strum', name: 'strum', seq: '..D.D.' }], chords: ['G', 'D', 'D', 'G'],
    build: [{ say: 'Three beats. The bass on one.', show: { bass: 'B.....', strum: '......' } }, { say: 'The chord on two and three.', show: { bass: 'B.....', strum: '..D.D.' } }] }),
  P({ id: 'ballad68', set: 'core', kind: 'guitar', name: 'The 6/8 ballad', steps: 6, beats: 2, meter: '6/8',
    desc: 'Six eighths in two big beats: one two three, four five six. A slow sway.',
    layers: [{ type: 'thumb', name: 'bass', seq: 'B..b..' }, { type: 'strum', name: 'strum', seq: '.DU.DU' }], chords: ['C', 'Am', 'F', 'G'],
    build: [{ say: 'Two big beats, each of three.', show: { bass: 'B..b..', strum: '......' } }, { say: 'Strum the two notes after each bass.', show: { bass: 'B..b..', strum: '.DU.DU' } }] }),
  P({ id: 'shuffle', set: 'core', kind: 'guitar', name: 'The shuffle', steps: 8, swing: 0.33,
    desc: 'Every beat split long-short instead of evenly: the swung feel of blues and early rock and roll.',
    layers: [{ type: 'strum', name: 'strum', seq: 'DUDUDUDU' }], chords: ['A', 'A', 'D', 'A'],
    build: [{ say: 'Straight eighths first.', show: { strum: 'DUDUDUDU' }, straight: true }, { say: 'Now long, short: the shuffle.', show: { strum: 'DUDUDUDU' } }] }),
  P({ id: 'skank', set: 'core', kind: 'guitar', name: 'Reggae skank', steps: 8,
    desc: 'Short chords on the off-beats, cut off at once, and a kick drum on beat three: the one drop.',
    layers: [{ type: 'kick', name: 'kick', seq: '....X...' }, { type: 'strum', name: 'skank', seq: '.U.U.U.U', short: true }], chords: ['Am', 'Am', 'D', 'D'],
    build: [{ say: 'The one drop: a kick on three, nothing on one.', show: { kick: '....X...', skank: '........' } }, { say: 'Short upstrokes on every and.', show: { kick: '....X...', skank: '.U.U.U.U' } }] }),
  P({ id: 'funk', set: 'core', kind: 'guitar', name: 'Funk sixteenths', steps: 16,
    desc: 'The hand moves in sixteenths the whole time. Some strokes hit the chord, some are chucks: the strings muted by the fretting hand, a percussive click.',
    layers: [{ type: 'strum', name: 'strum', seq: 'D..UX.DU.UD.X.DU' }], chords: ['E9', 'E9', 'E9', 'E9'],
    build: [
      { say: 'The pendulum in sixteenths: one e and a.', show: { strum: 'DUDUDUDUDUDUDUDU' } },
      { say: 'The chucks on two and four.', show: { strum: '....X.......X...' } },
      { say: 'Now the whole pattern: hits, chucks and misses.', show: { strum: 'D..UX.DU.UD.X.DU' } },
    ] }),
  P({ id: 'bossa', set: 'core', kind: 'guitar', name: 'Bossa nova', steps: 16,
    desc: 'The thumb plays the bass on one and three; the fingers pluck the chord in a syncopated pattern that never quite lands where you expect.',
    layers: [{ type: 'thumb', name: 'thumb', seq: 'B.......b.......' }, { type: 'pick', name: 'fingers', seq: 'x..x..x...x..x..' }], chords: ['Am', 'Am', 'D', 'D'],
    build: [{ say: 'The thumb: one and three.', show: { thumb: 'B.......b.......', fingers: '................' } }, { say: 'The fingers: a pattern that pulls against the thumb.', show: { thumb: 'B.......b.......', fingers: 'x..x..x...x..x..' } }] }),
  P({ id: 'travis', set: 'core', kind: 'guitar', name: 'Travis picking', steps: 8,
    desc: 'The thumb alternates bass notes on every beat; the fingers play between them, on the ands.',
    layers: [{ type: 'thumb', name: 'thumb', seq: 'B.b.B.b.' }, { type: 'pick', name: 'fingers', seq: '.x.x.x.x' }], chords: ['C', 'C', 'G', 'G'],
    build: [{ say: 'The thumb: every beat, alternating.', show: { thumb: 'B.b.B.b.', fingers: '........' } }, { say: 'The fingers: on every and, between the thumb.', show: { thumb: 'B.b.B.b.', fingers: '.x.x.x.x' } }] }),
  P({ id: 'tresillo', set: 'core', kind: 'world', name: 'Tresillo: three, three, two', steps: 8, view: 'circle',
    desc: 'Eight eighths grouped three, three, two. The rhythm under habanera, tango, son, rock and roll and pop.',
    layers: [{ type: 'kick', name: 'pulse', seq: 'x.x.x.x.' }, { type: 'clave', name: 'tresillo', seq: 'X..X..X.' }],
    build: [{ say: 'The pulse: four beats.', show: { pulse: 'x.x.x.x.', tresillo: '........' } }, { say: 'Now three, three, two.', show: { pulse: 'x.x.x.x.', tresillo: 'X..X..X.' } }] }),
  P({ id: 'son32', set: 'core', kind: 'world', name: 'Son clave, three two', steps: 16, view: 'circle',
    desc: 'Five strokes over two bars’ worth of time: three on the first side, two on the second. The key that every part of Cuban music locks to.',
    layers: [{ type: 'shaker', name: 'pulse', seq: 'x...x...x...x...' }, { type: 'clave', name: 'clave', seq: 'X..X..X...X.X...' }],
    build: [{ say: 'The three side: three, three, then a gap.', show: { pulse: 'x...x...x...x...', clave: 'X..X..X.........' } }, { say: 'The two side completes it.', show: { pulse: 'x...x...x...x...', clave: 'X..X..X...X.X...' } }] }),
  P({ id: 'solea', set: 'core', kind: 'world', name: 'Soleá compás', steps: 12, beats: 12, view: 'circle', count: 'num',
    desc: 'Twelve beats with accents on three, six, eight, ten and twelve: six-eight, then three-four. The heart of flamenco.',
    layers: [{ type: 'clap', name: 'palmas', seq: 'xxXxxXxXxXxX' }],
    build: [{ say: 'Twelve beats. Accents on three, six, eight, ten, twelve.', show: { palmas: 'xxXxxXxXxXxX' } }] }),
  // ---------- expanded ----------
  P({ id: 'gallop', set: 'more', kind: 'guitar', name: 'The gallop', steps: 16,
    desc: 'Each beat an eighth and two sixteenths: da, da-da. A driving, galloping push.',
    layers: [{ type: 'strum', name: 'strum', seq: 'D.DUD.DUD.DUD.DU' }], chords: ['Em', 'Em', 'C', 'D'] }),
  P({ id: 'chucks24', set: 'more', kind: 'guitar', name: 'Chucks on two and four', steps: 8,
    desc: 'The folk pattern with chucks in place of the strums on two and four: the snare drum, played on the guitar.',
    layers: [{ type: 'strum', name: 'strum', seq: 'D.XU.UXU' }], chords: ['G', 'C', 'G', 'D'] }),
  P({ id: 'island', set: 'more', kind: 'guitar', name: 'The island strum', steps: 8,
    desc: 'Down, down up, up down up, with the accents pushed off the beat: the strum of a thousand campfire songs.',
    layers: [{ type: 'strum', name: 'strum', seq: 'D.DU.UDU' }], chords: ['C', 'G', 'Am', 'F'], accents: [3, 5] }),
  P({ id: 'rumba32', set: 'more', kind: 'world', name: 'Rumba clave, three two', steps: 16, view: 'circle',
    desc: 'Like son clave, but the third stroke is delayed by one sixteenth: more tension, more push.',
    layers: [{ type: 'shaker', name: 'pulse', seq: 'x...x...x...x...' }, { type: 'clave', name: 'clave', seq: 'X..X...X..X.X...' }] }),
  P({ id: 'son23', set: 'more', kind: 'world', name: 'Son clave, two three', steps: 16, view: 'circle',
    desc: 'The same clave started from its two side.',
    layers: [{ type: 'shaker', name: 'pulse', seq: 'x...x...x...x...' }, { type: 'clave', name: 'clave', seq: '..X.X...X..X..X.' }] }),
  P({ id: 'habanera', set: 'more', kind: 'world', name: 'Habanera', steps: 8, view: 'circle',
    desc: 'Dotted eighth, sixteenth, two eighths: long, short, long, long. Cuba’s dance, tango’s ancestor.',
    layers: [{ type: 'kick', name: 'pulse', seq: 'x...x...' }, { type: 'clave', name: 'habanera', seq: 'X..XX.X.' }] }),
  P({ id: 'bembe', set: 'more', kind: 'world', name: 'The 12/8 bell', steps: 12, view: 'circle', count: 'trip',
    desc: 'The West African standard bell pattern: seven strokes in twelve, in the same shape as the major scale.',
    layers: [{ type: 'shaker', name: 'pulse', seq: 'x..x..x..x..' }, { type: 'bell', name: 'bell', seq: 'X.X.XX.X.X.X' }] }),
  P({ id: 'threetwo', set: 'more', kind: 'world', name: 'Three against two', steps: 6, beats: 2, view: 'circle',
    desc: 'Three evenly spaced strokes against two in the same span: the cross-rhythm at the heart of African and Latin music.',
    layers: [{ type: 'kick', name: 'two', seq: 'X..X..' }, { type: 'clave', name: 'three', seq: 'X.X.X.' }],
    build: [{ say: 'Two.', show: { two: 'X..X..', three: '......' } }, { say: 'Now three, in the same time.', show: { two: 'X..X..', three: 'X.X.X.' } }] }),
  P({ id: 'charleston', set: 'more', kind: 'world', name: 'The Charleston', steps: 8,
    desc: 'One, and the and of two: the jazz-age push.',
    layers: [{ type: 'kick', name: 'pulse', seq: 'x.x.x.x.' }, { type: 'clave', name: 'charleston', seq: 'X..X....' }] }),
  P({ id: 'buleria', set: 'more', kind: 'world', name: 'Bulerías compás', steps: 12, beats: 12, view: 'circle', count: 'bul',
    desc: 'The soleá’s cycle, fast, and felt from twelve: accents on twelve, three, six, eight and ten.',
    layers: [{ type: 'clap', name: 'palmas', seq: 'XxxXxxXxXxXx' }] }),
  P({ id: 'five', set: 'more', kind: 'world', name: 'Five four: three plus two', steps: 10, beats: 5, count: 'num',
    desc: 'Five beats grouped three and two: a limp that becomes a swing.',
    layers: [{ type: 'kick', name: 'groups', seq: 'X.....X...' }, { type: 'shaker', name: 'beats', seq: 'x.x.x.x.x.' }] }),
  P({ id: 'seven', set: 'more', kind: 'world', name: 'Seven eight: two, two, three', steps: 7, beats: 7, count: 'num',
    desc: 'Seven quick beats grouped two, two, three: the Balkan lilt.',
    layers: [{ type: 'kick', name: 'groups', seq: 'X.X.X..' }, { type: 'shaker', name: 'beats', seq: 'xxxxxxx' }] }),
];
export const SETS = [['core', 'Core', 'The essentials: the rhythms to know by heart.'], ['guitar', 'Guitar strums', 'Every strumming and picking pattern.'], ['world', 'World rhythms', 'Claves, bells, the compás, cross-rhythms.'], ['all', 'Everything', 'All of them, core first.']];
export const inSet = (set) => PATTERNS.filter((p) => set === 'all' || (set === 'core' ? p.set === 'core' : p.kind === set));

// ---------- counting ----------
const NUMS = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
export function countOf(p, i) {
  const per = p.steps / p.beats, b = Math.floor(i / per), k = i % per;
  if (p.count === 'num') return { say: NUMS[i % 12], show: String(i + 1) };
  if (p.count === 'bul') { const n = ((i + 11) % 12) + 1; return { say: NUMS[n - 1], show: String(n) }; }
  if (p.count === 'trip' || per === 3) return k === 0 ? { say: NUMS[Math.floor(i / 3)], show: String(Math.floor(i / 3) + 1) } : { say: k === 1 ? 'trip' : 'let', show: k === 1 ? 'trip' : 'let' };
  if (per === 1) return { say: NUMS[b], show: String(b + 1) };
  if (per === 2) return k === 0 ? { say: NUMS[b], show: String(b + 1) } : { say: 'and', show: '&' };
  if (per === 4) return [{ say: NUMS[b], show: String(b + 1) }, { say: 'ee', show: 'e' }, { say: 'and', show: '&' }, { say: 'uh', show: 'a' }][k];
  return { say: NUMS[b], show: String(b + 1) };
}

// ---------- sounds ----------
const SHAPES = { G: [43, 47, 50, 55, 59, 67], C: [48, 52, 55, 60, 64], D: [50, 57, 62, 66], Em: [40, 47, 52, 55, 59, 64], Am: [45, 52, 57, 60, 64], A: [45, 52, 57, 61, 64], E9: [40, 47, 50, 56, 59, 66], F: [41, 48, 53, 57, 60, 65] };
const BASS = { G: [43, 50], C: [48, 43], D: [50, 45], Em: [40, 47], Am: [45, 40], A: [45, 40], E9: [40, 47], F: [41, 48] };
function perc(type, t, vel) {
  const g = graph(), c = g.c, out = c.createGain();
  out.connect(g.dry); const w = c.createGain(); w.gain.value = 0.35; out.connect(w).connect(g.send);
  const env = (node, a, d, peak) => { node.gain.setValueAtTime(0.0001, t); node.gain.exponentialRampToValueAtTime(peak, t + a); node.gain.exponentialRampToValueAtTime(0.0001, t + d); };
  const tone = (f, d, peak, type2 = 'sine', f2) => { const o = c.createOscillator(); o.type = type2; o.frequency.setValueAtTime(f, t); if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + d); const a = c.createGain(); env(a, 0.002, d, peak); o.connect(a).connect(out); o.start(t); o.stop(t + d + 0.05); };
  const noise = (fType, f, q, d, peak) => { const s = c.createBufferSource(); s.buffer = g.noise; const fl = c.createBiquadFilter(); fl.type = fType; fl.frequency.value = f; fl.Q.value = q; const a = c.createGain(); env(a, 0.002, d, peak); s.connect(fl).connect(a).connect(out); s.start(t, Math.random()); s.stop(t + d + 0.05); };
  const v = vel;
  if (type === 'clave') { tone(2480, 0.08, 0.5 * v); tone(4960, 0.03, 0.08 * v); }
  if (type === 'bell') { tone(1580, 0.35, 0.3 * v); tone(2370, 0.2, 0.12 * v); }
  if (type === 'shaker') noise('highpass', 6500, 0.7, 0.07, 0.25 * v);
  if (type === 'kick') { tone(110, 0.25, 0.9 * v, 'sine', 45); }
  if (type === 'snare') { noise('bandpass', 1800, 0.8, 0.14, 0.5 * v); tone(190, 0.08, 0.25 * v); }
  if (type === 'clap') { for (const dt of [0, 0.011, 0.022]) { const s = c.createBufferSource(); s.buffer = g.noise; const fl = c.createBiquadFilter(); fl.type = 'bandpass'; fl.frequency.value = 1400; fl.Q.value = 1.1; const a = c.createGain(); a.gain.setValueAtTime(0.0001, t + dt); a.gain.exponentialRampToValueAtTime(0.45 * v, t + dt + 0.002); a.gain.exponentialRampToValueAtTime(0.0001, t + dt + (dt ? 0.03 : 0.16)); s.connect(fl).connect(a).connect(out); s.start(t + dt, Math.random()); s.stop(t + dt + 0.2); } }
}
function hit(layer, ch, chord, t, vel, p) {
  if (ch === '.' || ch === ' ') return;
  const loud = ch === ch.toUpperCase() ? 1 : 0.55;
  if (layer.type === 'strum') {
    const shape = SHAPES[chord] || SHAPES.G;
    if (ch === 'X' || ch === 'x') { A.strum(shape.slice(-4), t, { dir: 'D', muted: true, vel: 0.9 * vel }); perc('snare', t, 0.25 * vel); return; }
    const up = ch.toUpperCase() === 'U';
    const notes = up ? shape.slice(-4) : shape;
    A.strum(notes, t, { dir: up ? 'U' : 'D', vel: (up ? 0.6 : 0.85) * loud * vel, dur: layer.short ? 0.14 : null, spread: up ? 0.009 : 0.013 });
    return;
  }
  if (layer.type === 'thumb') { const b = BASS[chord] || BASS.G; A.pluck(ch === 'b' ? b[1] : b[0], t, { vel: 0.95 * vel }); return; }
  if (layer.type === 'pick') { const shape = SHAPES[chord] || SHAPES.G; A.pluck(shape[shape.length - 1], t, { vel: 0.7 * vel }); A.pluck(shape[shape.length - 2], t + 0.004, { vel: 0.6 * vel }); return; }
  perc(layer.type, t, loud * vel);
}

// ---------- the player: a pattern's build-up, then loops, then the next ----------
export function rhythm(O, ui) {
  const ctx = () => A.audioCtx();
  let alive = true, paused = false, timer = null, timers = [];
  let list = inSet(O.set), li = Math.max(0, list.findIndex((p) => p.id === O.start)), phase = 0, cycle = 0, step = 0, t = ctx().currentTime + 0.4;
  let pat = null, phases = [], quietUntil = 0;
  function load() {
    pat = list[li % list.length];
    phases = [...(pat.build || []), { say: null, show: null, cycles: O.loops }];
    phase = 0; cycle = 0; step = 0;
    ui.pattern(pat);
    if (O.voice) { const lines = [`${pat.name}.`.replace('..', '.'), pat.desc]; quietUntil = t + lines.join(' ').length * 0.065; V.say(lines.map((l) => [l]), t, { vol: O.vvol }); }
    t = Math.max(t, quietUntil - 1);
    startPhase();
  }
  function startPhase() {
    const ph = phases[phase];
    ui.phase(pat, ph, phase, phases.length);
    if (ph.say && O.voice) { const at = Math.max(t, quietUntil); V.say([[ph.say]], at, { vol: O.vvol }); quietUntil = at + ph.say.length * 0.065; }
  }
  const layerSeq = (L) => { const ph = phases[phase]; return ph.show && ph.show[L.name] !== undefined ? ph.show[L.name] : ph.show ? '.'.repeat(pat.steps) : L.seq; };
  function schedule() {
    const ph = phases[phase];
    const beat = 60 / O.bpm, stepDur = beat / (pat.steps / pat.beats);
    const sw = ph.straight ? 0 : pat.swing;
    const at = t + (step % 2 === 1 ? stepDur * sw : 0);
    const chord = pat.chords[Math.floor(cycle) % pat.chords.length];
    for (const L of pat.layers) {
      const seq = layerSeq(L);
      const accent = pat.accents && pat.accents.includes(step) ? 1.25 : 1;
      hit(L, seq[step] || '.', chord, at, (step % (pat.steps / pat.beats) === 0 ? 1 : 0.85) * accent, pat);
    }
    if (O.count && stepDur > 0.22 && at >= quietUntil) V.say([[countOf(pat, step).say]], at, { vol: O.vvol * 0.8 });
    else if (O.count && step % (pat.steps / pat.beats) === 0 && at >= quietUntil) V.say([[countOf(pat, step).say]], at, { vol: O.vvol * 0.8 });
    const s0 = step, c0 = cycle;
    later(at, () => ui.step(s0, c0, chord, phases[phase] ? layerView() : null));
    t += stepDur; step++;
    if (step >= pat.steps) {
      step = 0; cycle++;
      const need = ph.cycles || Math.max(2, Math.ceil((quietUntil - t) / (stepDur * pat.steps)) + 1);
      if (cycle >= need) { cycle = 0; phase++; if (phase >= phases.length) { li++; load(); } else startPhase(); }
    }
  }
  const layerView = () => pat.layers.map((L) => ({ ...L, seq: layerSeq(L) }));
  function later(at, fn) { const id = setTimeout(fn, Math.max(0, (at - ctx().currentTime) * 1000)); timers.push(id); if (timers.length > 400) timers.splice(0, 200); }
  function pump() {
    if (!alive || paused) return;
    while (t < ctx().currentTime + 0.25) schedule();
    timer = setTimeout(pump, 40);
  }
  load(); pump();
  const jump = () => { clearTimeout(timer); timers.forEach(clearTimeout); timers = []; V.hush(); quietUntil = 0; t = ctx().currentTime + 0.25; load(); if (!paused) pump(); };
  return {
    O,
    next() { li++; jump(); },
    prev() { li = (li - 1 + list.length) % list.length; jump(); },
    stop() { alive = false; clearTimeout(timer); timers.forEach(clearTimeout); V.hush(); },
    pause(p) { paused = p; if (p) { clearTimeout(timer); timers.forEach(clearTimeout); timers = []; V.hush(); } else { t = ctx().currentTime + 0.2; pump(); } },
    get paused() { return paused; },
    layers: () => layerView(),
  };
}
export function allPhrases() {
  const P2 = new Set([...NUMS, 'and', 'ee', 'uh', 'trip', 'let']);
  for (const p of PATTERNS) { P2.add(`${p.name}.`.replace('..', '.')); P2.add(p.desc); (p.build || []).forEach((b) => P2.add(b.say)); }
  return [...P2];
}
