// Slow soloing: progressions play slowly on a soft pad while you solo in one CAGED position (or two), with one drill
// set at the outset: land on the 3rd, the 7th or either; lines (7th falls to 3rd, approach notes, enclosures, chord
// tones only); or reach into other scales (Dorian, altered on dominants, harmonic minor in minor keys, melodic minor
// colours…). For each chord the neck shows what the drill asks for in your fret window: the target notes, or the whole
// scale it reaches into. A difficulty slider sets the tempo, how long each chord lasts, how hard the progressions are,
// and whether the targets are shown or left for you to find. Progressions come from the library, a few times round
// each, then another; each one's own targets or scales are listed as it starts.
import * as T from '../theory.js';
import * as F from '../fretboard.js';
import * as A from '../audio.js';
import * as G from './grips.js';
import * as H from './harmony.js';
import * as L from './library.js';
import * as SC from './scales.js';

const pick = (a) => a[Math.floor(Math.random() * a.length)];
const MAJOR_KEYS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
const MINOR_KEYS = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'G#', 'A', 'Bb', 'B'];
const SCALE = Object.fromEntries(SC.SCALES.map((s) => [s.id, s]));
const simple = (iv) => String(iv).replace(/^(b|#)?(9|11|13)$/, (m, a, n) => (a || '') + { 9: '2', 11: '4', 13: '6' }[n]);
const semis = (iv) => T.intervalSemis(F.simpleIv(simple(iv))) % 12;
const relsOf = (ivs) => [...new Set(ivs.map(semis))];
const ord = (iv) => { const n = String(iv).replace(/\D/g, ''); return `${T.prettyIv(iv)}${n === '1' ? 'st' : n === '2' ? 'nd' : n === '3' ? 'rd' : 'th'}`; };

// ---------- the chord's family, its own tones by name ----------
function fam(q) {
  const ivs = T.getChord(q).ivs, has = (x) => ivs.includes(x);
  if (has('3') && has('b7')) return 'dom';
  if (has('b3') && has('b5')) return has('bb7') ? 'dim7' : has('b7') ? 'hd' : 'dim';
  if (has('b3')) return 'min';
  return 'maj';
}
const third = (q) => T.getChord(q).ivs.find((x) => /^b?3$/.test(x)) || T.getChord(q).ivs.find((x) => /^[24]$/.test(x)) || '3';
const seventh = (q) => T.getChord(q).ivs.find((x) => /^(b?b?7|6)$/.test(x)) || null;
const fifth = (q) => T.getChord(q).ivs.find((x) => /^[b#]?5$/.test(x)) || '5';

// ---------- the drills: each says, for a chord, what to aim at (tones) or which scale to play ----------
// resolving: a dominant whose next chord is a 5th down
const resolves = (c, nx) => nx && ((T.notePc(nx.root) - T.notePc(c.root) + 12) % 12) === 5;
// the chord's own mode in the key, by family (and degree in a major key)
function homeMode(c, key) {
  const d = ((T.notePc(c.root) - T.notePc(key.tonic)) % 12 + 12) % 12, f = fam(c.q);
  if (!key.minor) {
    const m = { 0: 'ionian', 2: 'dorian', 4: 'phrygian', 5: 'lydian', 7: 'mixolydian', 9: 'aeolian', 11: 'locrian' }[d];
    if (m && ((f === 'maj' && ['ionian', 'lydian'].includes(m)) || (f === 'min' && ['dorian', 'phrygian', 'aeolian'].includes(m)) || (f === 'dom' && m === 'mixolydian') || ((f === 'hd' || f === 'dim') && m === 'locrian'))) return m;
  } else {
    const m = { 0: 'aeolian', 2: 'locrian', 3: 'ionian', 5: 'dorian', 7: 'phryg-dom', 8: 'lydian', 10: 'mixolydian' }[d];
    if (m && ((f === 'min' && ['aeolian', 'dorian'].includes(m)) || (f === 'maj' && ['ionian', 'lydian'].includes(m)) || (f === 'dom' && ['phryg-dom', 'mixolydian'].includes(m)) || (f === 'hd' && m === 'locrian'))) return m;
  }
  return { maj: 'ionian', min: 'dorian', dom: 'mixolydian', hd: 'locrian-n2', dim7: 'dim-wh', dim: 'locrian' }[f];
}
const T_ = (ivs, extra = {}) => ({ tones: ivs, ...extra });
export const DRILLS = [
  { id: 'third', group: 'Land on', name: 'The 3rd', goal: 'Land on the 3rd of every chord on the first beat of its bar, then play on from there.', why: 'The 3rd says major or minor: landing on it makes every change heard.', at: (c) => T_([third(c.q)]) },
  { id: 'seventh', group: 'Land on', name: 'The 7th', goal: 'Land on the 7th of every chord on its first beat (the 6th on a 6 chord).', why: 'The 7th is the chord’s tension and colour; it moves by step into the next chord.', sev: true, at: (c) => T_([seventh(c.q) || third(c.q)]) },
  { id: 'guide', group: 'Land on', name: 'The 3rd or 7th', goal: 'Land on a guide tone, the 3rd or the 7th, of every chord on its first beat: whichever is nearest.', why: 'The two notes that define the chord: hit one at every change and the harmony is outlined.', sev: true, at: (c) => T_([third(c.q), seventh(c.q)].filter(Boolean)) },
  { id: 'fifth', group: 'Land on', name: 'The 5th', goal: 'Land on the 5th of every chord on its first beat: stable, open, a little neutral.', why: 'The 5th is safe but colourless: a good place to start a phrase, a weak place to end one.', at: (c) => T_([fifth(c.q)]) },
  { id: 'ninth', group: 'Land on', name: 'The 9th', goal: 'Land on the 9th of every chord on its first beat (a natural 9 unless the key says ♭9).', why: 'The 9th is the first colour above the chord: modern, open, unresolved.', at: (c, key) => { const n9 = (T.notePc(c.root) + 2) % 12, inKey = (key.minor ? [0, 2, 3, 5, 7, 8, 10] : [0, 2, 4, 5, 7, 9, 11]).includes((n9 - T.notePc(key.tonic) + 12) % 12); return T_([inKey || fam(c.q) !== 'dom' ? '9' : 'b9']); } },
  { id: 'line73', group: 'Lines', name: '7th falls to 3rd', goal: 'Hold the 7th of each chord up to the change, then step down to the 3rd of the next chord on its first beat.', why: 'The guide-tone line: the 7th of one chord is a step above the 3rd of the next in most progressions.', sev: true, at: (c, key, nx) => T_([seventh(c.q) || third(c.q)], { then: nx ? third(nx.q) : null }) },
  { id: 'approach', group: 'Lines', name: 'Approach from below', goal: 'Reach each chord’s 3rd from a half step below: the approach on the beat before, the 3rd on beat 1.', why: 'A half-step approach makes any target sound inevitable: the ear hears the pull.', at: (c) => T_([third(c.q)], { below: 1 }) },
  { id: 'enclose', group: 'Lines', name: 'Enclosures', goal: 'Surround each chord’s 3rd: the scale note above, the half step below, then the 3rd on the beat.', why: 'The bebop enclosure: circle the target, then land on it.', at: (c) => T_([third(c.q)], { below: 1, above: true }) },
  { id: 'tones', group: 'Lines', name: 'Chord tones only', goal: 'Only chord tones: make a melody out of each chord’s arpeggio, changing as the chord changes.', why: 'If every note is a chord tone, the line outlines the changes on its own.', sev: true, at: (c) => T_(T.getChord(c.q).ivs.filter((x) => !/^(b|#)?(9|11|13)$/.test(x))) },
  { id: 'dorian', group: 'Reach into scales', name: 'Dorian on minor chords', goal: 'Over every minor chord play Dorian (the natural 6 is its colour); elsewhere the key’s own notes.', why: 'Dorian is the bright minor: cooler than natural minor.', scale: (c, key) => (fam(c.q) === 'min' ? ['dorian', '6'] : [homeMode(c, key)]) },
  { id: 'mixo', group: 'Reach into scales', name: 'Mixolydian on dominants', goal: 'Over every dominant chord play its Mixolydian (major with a ♭7); elsewhere the key’s own notes.', why: 'The plain dominant sound, inside the key.', scale: (c, key) => (fam(c.q) === 'dom' ? ['mixolydian', 'b7'] : [homeMode(c, key)]) },
  { id: 'lydian', group: 'Reach into scales', name: 'Lydian on major chords', goal: 'Over every major chord play Lydian (the ♯4 floats); elsewhere the key’s own notes.', why: 'The brightest major colour: no avoid note against the 3rd.', scale: (c, key) => (fam(c.q) === 'maj' ? ['lydian', '#4'] : [homeMode(c, key)]) },
  { id: 'altered', group: 'Reach into scales', name: 'Altered on dominants', goal: 'Over every dominant that resolves down a 5th play the altered scale (♭9, ♯9, ♯11, ♭13), and resolve by half step into the next chord.', why: 'Maximum tension just before the release.', sev: true, scale: (c, key, nx) => (fam(c.q) === 'dom' && resolves(c, nx) ? ['altered', 'b9'] : fam(c.q) === 'dom' ? ['mixolydian', 'b7'] : [homeMode(c, key)]) },
  { id: 'harmmin', group: 'Reach into scales', name: 'Harmonic minor sounds', goal: 'Over dominants resolving to a minor chord play Phrygian dominant (harmonic minor from the target); over minor tonics, harmonic minor.', why: 'The ♭9 and ♭13 are notes of the minor key you’re heading for.', sev: true, scale: (c, key, nx) => (fam(c.q) === 'dom' && resolves(c, nx) && nx && fam(nx.q) !== 'maj' && fam(nx.q) !== 'dom' ? ['phryg-dom', 'b9'] : fam(c.q) === 'min' && key.minor && T.notePc(c.root) === T.notePc(key.tonic) ? ['harm-min', '7'] : [homeMode(c, key)]) },
  { id: 'melmin', group: 'Reach into scales', name: 'Melodic minor colours', goal: 'Minor chords: melodic minor. Dominants that resolve: altered (melodic minor a half step up); dominants that don’t: Lydian dominant. Half-diminished: Locrian ♮2.', why: 'The jazz minor and its modes: every chord gets its melodic-minor colour.', sev: true, scale: (c, key, nx) => { const f = fam(c.q); return f === 'min' ? ['mel-min', '7'] : f === 'dom' ? (resolves(c, nx) ? ['altered', 'b9'] : ['lyd-dom', '#4']) : f === 'hd' ? ['locrian-n2', '2'] : [homeMode(c, key)]; } },
  { id: 'pent', group: 'Reach into scales', name: 'Pentatonics', goal: 'Major chords: major pentatonic. Minor chords: minor pentatonic. Dominants: the dominant pentatonic. From each chord’s root.', why: 'Five notes, no half steps: easy to phrase, and it follows the changes.', scale: (c) => { const f = fam(c.q); return f === 'maj' ? ['maj-pent'] : f === 'min' ? ['min-pent'] : f === 'dom' ? ['dom-pent'] : ['locrian']; } },
  { id: 'bebop', group: 'Reach into scales', name: 'Bebop dominant', goal: 'Over every dominant play the bebop dominant (Mixolydian plus the major 7th as a passing note), chord tones on the beat.', why: 'The passing 7 lines up chord tones with the beat in eighth-note runs.', sev: true, scale: (c, key) => (fam(c.q) === 'dom' ? ['bebop-dom', '7'] : [homeMode(c, key)]) },
  { id: 'dim', group: 'Reach into scales', name: 'Diminished on 7♭9', goal: 'Over every dominant play half-whole diminished (♭9, ♯9, ♯11 and a natural 13); it repeats every three frets.', why: 'A symmetrical tension: the same fingering a minor 3rd up is the same scale.', sev: true, scale: (c, key) => (fam(c.q) === 'dom' ? ['dim-hw', 'b9'] : [homeMode(c, key)]) },
];
const drillById = (id) => DRILLS.find((d) => d.id === id) || DRILLS[0];

// ---------- difficulty: tempo, bars a chord, which progressions, whether targets show ----------
export const LEVELS = [
  { n: 1, name: 'Very easy', bpm: 50, stretch: 4, show: 'all', cats: ['Cadences', 'Pop and rock'], blurb: 'Very slow, each chord four times as long as written, simple progressions, the targets shown.' },
  { n: 2, name: 'Easy', bpm: 56, stretch: 2, show: 'all', cats: ['Cadences', 'Pop and rock', 'Blues'], blurb: 'Slow, chords twice as long as written, the targets shown.' },
  { n: 3, name: 'Medium', bpm: 62, stretch: 2, show: 'all', cats: ['Turnarounds and jazz moves', 'Blues', 'Voice leading', 'Modal vamps'], blurb: 'Turnarounds, blues and voice-leading progressions, chords twice as long as written.' },
  { n: 4, name: 'Hard', bpm: 72, stretch: 1, show: 'faint', cats: ['Turnarounds and jazz moves', 'Jazz standards', 'Classical patterns'], blurb: 'As written, jazz standards and classical patterns, the targets only faint.' },
  { n: 5, name: 'Very hard', bpm: 84, stretch: 1, show: 'none', cats: ['Jazz standards', 'Bass lines and slash chords', 'Turnarounds and jazz moves'], blurb: 'As written, the hardest progressions, the neck shows the position but not the targets: find them.' },
];

export function renderSolo($app, ctx) {
  const { D, save, neckSVG, esc, fmt, onBack, realise, legend, KIND } = ctx;
  const O = D.solo = Object.assign({ key: 'C', kt: 'major', shape: 'E', pair: false, drill: 'guide', level: 1, sound: true, click: false, mute: false, show: true, bpm: 50, explain: true }, D.solo || {});
  let R = null, lock = null;
  const minor = () => O.kt === 'minor';
  const LV = () => LEVELS[O.level - 1];

  // the progressions for this level and key type, shuffled; each goes round a few times
  function pool() {
    const lv = LV();
    let list = L.ALL.filter((p) => lv.cats.includes(p.cat));
    if (O.kt !== 'both') list = list.filter((p) => !!p.minor === minor());
    return list.sort(() => Math.random() - 0.5);
  }
  function stream() {
    const list = pool(), lv = LV();
    let li = 0, item = null, slots = [], i = 0, pass = 0;
    const rounds = () => (slots.length > 8 ? 1 : 2);
    function load() {
      const d = drillById(O.drill);
      item = list[li++ % list.length];
      slots = [];
      L.resolve(item).forEach((bar, bi) => bar.forEach((spec) => {
        let q = spec.q;
        if (d.sev && T.getChord(q).ivs.length < 4) q = H.toSeventh(H.toTriad(q), spec.iv, { dominant: !!spec.rel, minorKey: !!item.minor });
        slots.push({ spec: { ...spec, q }, beats: Math.max(1, Math.round(4 / bar.length)) * lv.stretch, bar: bi });
      }));
      i = 0; pass = 0;
    }
    load();
    return {
      next() {
        if (i >= slots.length) { i = 0; pass++; if (pass >= rounds()) load(); }
        const x = slots[i], first = i === 0 && pass === 0;
        i++;
        return { spec: x.spec, beats: x.beats, item, first, slot: i - 1, slots, pass };
      },
    };
  }

  // ---------- a chord made real, and what the drill asks of it ----------
  function make() {
    const it = R.stream.next(), S = R.S;
    const im = !!it.item.minor;
    const kn = im ? (MINOR_KEYS.includes(O.key) ? O.key : { Db: 'C#', Ab: 'G#' }[O.key] || O.key) : (MAJOR_KEYS.includes(O.key) ? O.key : { 'C#': 'Db', 'G#': 'Ab' }[O.key] || O.key);
    const tonic = T.parseNote(kn);
    if (S.minor !== im || T.notePc(S.tonic) !== T.notePc(tonic)) { S.tonic = tonic; S.minor = im; S.lastScale = {}; }
    const c = realise(S, it.spec, R.prevGrip, { voicing: 'caged', bass: 'off', scaleLevel: 1 });
    R.prevGrip = c.grip || R.prevGrip;
    return { ...c, key: { tonic, minor: im }, beats: it.beats, item: it.item, first: it.first, slot: it.slot, slots: it.slots, pass: it.pass };
  }
  // the drill for chord c (next chord nx): the notes it aims at, or the scale, in the fret window
  function aim(c, nx) {
    const d = drillById(O.drill), p = R.S.pos, lo = Math.max(0, p.lo), hi = p.hi;
    if (d.scale) {
      const [id, colour] = d.scale(c, c.key, nx);
      const sc = SCALE[id];
      const rels = relsOf(sc.ivs), cRel = colour ? semis(colour) : -1;
      const notes = SC.scaleNotesIn({ rel: rels }, c.root, c.q, lo, hi).map((n) => {
        const r = ((n.midi - T.notePc(c.root)) % 12 + 12) % 12;
        if (n.chord) return n;
        return r === cRel ? { ...n, kind: 'tx', mark: true } : { ...n, kind: 'sc' };
      });
      return { kind: 'scale', notes, label: `${T.noteName(c.root, true)} ${sc.name.replace(/\s*\(.*\)/, '')}`, colour, scaleId: id };
    }
    const a = d.at(c, c.key, nx), want = relsOf(a.tones);
    const chordRels = relsOf(T.getChord(c.q).ivs);
    const notes = SC.scaleNotesIn({ rel: chordRels }, c.root, c.q, lo, hi).map((n) => {
      const r = ((n.midi - T.notePc(c.root)) % 12 + 12) % 12;
      return want.includes(r) ? { ...n, mark: true } : { ...n, kind: 'sc' };
    });
    // approach notes a half step below the targets, and the scale note above for enclosures
    if (a.below) for (const t of SC.scaleNotesIn({ rel: want.map((r) => (r + 11) % 12) }, c.root, c.q, lo, hi)) if (!notes.some((n) => n.string === t.string && n.fret === t.fret)) notes.push({ ...t, iv: 'app', kind: 'tx' });
    if (a.above) { const keyScale = SC.scaleNotesIn({ rel: relsOf(SCALE[homeMode(c, c.key)].ivs) }, c.root, c.q, lo, hi); for (const t of keyScale) { const r = ((t.midi - T.notePc(c.root)) % 12 + 12) % 12; if (want.some((w) => (r - w + 12) % 12 === 1 || (r - w + 12) % 12 === 2) && !notes.some((n) => n.string === t.string && n.fret === t.fret)) notes.push({ ...t, kind: 'tx' }); } }
    const names = a.tones.map((iv) => `${T.noteName(T.transpose(c.root, F.simpleIv(simple(iv))), true)} (the ${ord(iv)})`);
    const thenTxt = a.then && nx ? `, then ${T.noteName(T.transpose(nx.root, F.simpleIv(simple(a.then))), true)} (the ${ord(a.then)} of ${nx.name})` : '';
    return { kind: 'tones', notes, label: `${names.join(' or ')}${thenTxt}` };
  }
  // the progression's own specifics: each chord and its target or scale, as it starts
  function progNote(c) {
    const S = R.S, d = drillById(O.drill), seen = new Set(), parts = [];
    for (let j = 0; j < c.slots.length && parts.length < 8; j++) {
      const x = c.slots[j], nxs = c.slots[(j + 1) % c.slots.length];
      const root = H.spell(S.tonic, x.spec.iv), nroot = H.spell(S.tonic, nxs.spec.iv);
      const cc = { root, q: x.spec.q, name: H.chordName(root, x.spec.q), key: c.key }, nn = { root: nroot, q: nxs.spec.q, name: H.chordName(nroot, nxs.spec.q) };
      const k = `${cc.name}`;
      if (seen.has(k)) continue;
      seen.add(k);
      if (d.scale) { const [id] = d.scale(cc, c.key, nn); parts.push(`${cc.name}: ${T.noteName(root, true)} ${SCALE[id].name.replace(/\s*\(.*\)/, '')}`); }
      else { const a = d.at(cc, c.key, nn); parts.push(`${cc.name}: ${a.tones.map((iv) => T.noteName(T.transpose(root, F.simpleIv(simple(iv))), true)).join(' or ')}`); }
    }
    return parts.join(' · ');
  }

  // ---------- the clock: chords on the audio clock, the screen by timers ----------
  const timers = [];
  const later = (t, fn) => { timers.push(setTimeout(fn, Math.max(0, (t - A.audioCtx().currentTime) * 1000))); };
  const bpm = () => Math.max(24, Math.min(200, O.bpm));
  function pump() {
    if (!R || R.paused) return;
    while (R.t < A.audioCtx().currentTime + 0.3) if (scheduleChord() === false) return;
    R.timer = setTimeout(pump, 60);
  }
  function scheduleChord() {
    // a new progression: stop when the last one has rung out, explain this one, play on when asked
    if (O.explain && R.queue[0].first && !R.queue[0].explained) {
      R.queue[0].explained = true;
      R.waiting = true; clearTimeout(R.timer);
      const at = R.t;
      R.pad.release(at, 0.8);
      timers.push(setTimeout(() => explainer(R.queue[0]), Math.max(0, (at - A.audioCtx().currentTime) * 1000)));
      return false;
    }
    const c = R.queue.shift();
    R.queue.push(make());
    const spb = 60 / bpm(), t = R.t, nx = R.queue[0];
    if (O.sound && !O.mute && c.grip) R.pad.chord(G.gripMidis(c.grip), t, { inT: 0.4, outT: 0.7 });
    for (let b = 0; b < c.beats; b++) {
      const tb = t + b * spb;
      if (O.click && !O.mute) A.click(tb, b % 4 === 0 ? 2 : 1);
      later(tb, () => {
        document.querySelectorAll('#sbeats i').forEach((el, i) => el.classList.toggle('on', i === b % 4));
        const bc = document.getElementById('sbar'); if (bc) bc.textContent = c.beats > 4 ? `bar ${Math.floor(b / 4) + 1} of ${Math.ceil(c.beats / 4)}` : '';
      });
    }
    later(t, () => { R.cur = c; show(c, nx); });
    R.t += c.beats * spb;
  }

  // ---------- the explainer: the progression's theory, then what the drill asks of it ----------
  function chordJob(spec, keyMinor) {
    const kt = keyMinor ? 'minor' : 'major', tri = H.toTriad(spec.q);
    if (spec.rel) return `secondary dominant: the V of ${T.prettyRoman(spec.rel.to)}, pointing at it`;
    const e = (H.PALETTE[kt] || []).find((x) => x.iv === spec.iv && x.tri === tri) || (H.PALETTE[kt] || []).find((x) => x.iv === spec.iv && H.toTriad(x.sev) === tri);
    if (e) return `${e.fn}${e.group === 'mi' ? ' (borrowed from the parallel key)' : e.group === 'chr' ? ' (chromatic)' : ''}`;
    return 'outside the key: a chromatic colour';
  }
  function explainer(c) {
    if (!R) return;
    const d = drillById(O.drill), S = R.S, key = c.key;
    const seen = new Set(), rows = [], hard = [];
    const keyPcs = (key.minor ? [0, 2, 3, 5, 7, 8, 10] : [0, 2, 4, 5, 7, 9, 11]).map((x) => (x + T.notePc(key.tonic)) % 12);
    c.slots.forEach((x, j) => {
      const root = H.spell(key.tonic, x.spec.iv), name = H.chordName(root, x.spec.q);
      if (seen.has(name)) return; seen.add(name);
      const nxs = c.slots[(j + 1) % c.slots.length], nroot = H.spell(key.tonic, nxs.spec.iv);
      const cc = { root, q: x.spec.q, name, key }, nn = { root: nroot, q: nxs.spec.q, name: H.chordName(nroot, nxs.spec.q) };
      let ask;
      if (d.scale) {
        const [id] = d.scale(cc, key, nn), sc = SCALE[id];
        ask = `${T.noteName(root, true)} ${sc.name.replace(/\s*\(.*\)/, '')}`;
        const out = relsOf(sc.ivs).map((r) => (T.notePc(root) + r) % 12).filter((pc) => !keyPcs.includes(pc));
        if (out.length) hard.push(`On ${name} the scale leaves the key: ${out.map((pc) => T.noteName(T.noteFromPc(pc), true)).join(', ')} ${out.length === 1 ? 'is' : 'are'} new.`);
      } else {
        const a = d.at(cc, key, nn);
        const notes = a.tones.map((iv) => T.transpose(root, F.simpleIv(simple(iv))));
        ask = notes.map((n) => T.noteName(n, true)).join(' or ');
        const out = notes.filter((n) => !keyPcs.includes(T.notePc(n)));
        if (out.length) hard.push(`On ${name} the target ${out.map((n) => T.noteName(n, true)).join(' or ')} isn’t in the key: it’s the note that tells the ear the chord changed.`);
      }
      rows.push(`<tr><td class="cnum">${fmt(H.label(x.spec))}</td><td><b>${fmt(name)}</b><small>${esc(chordJob(x.spec, key.minor))}</small></td><td class="sask">${fmt(ask)}</td></tr>`);
    });
    const lv = LV();
    if (c.slots.length > 6) hard.push(`It’s long: ${c.slots.length} chords. Keep your place by the numerals.`);
    if (lv.show !== 'all') hard.push(lv.show === 'none' ? 'At this level the targets aren’t shown on the neck: find them from the chord.' : 'At this level the targets are only faint: say each one before you play it.');
    $app.innerHTML = `
    <header class="chead"><button class="icon" data-s="stop" aria-label="Stop">■</button><div class="where">${fmt(T.noteName(key.tonic, true))} ${key.minor ? 'minor' : 'major'}<small>${esc(S.shapeKey)} shape · frets ${S.pos.lo}–${S.pos.hi}</small></div><span></span></header>
    <section class="card sexp">
      <span class="lbl">next up</span>
      <h2 class="sexph">${fmt(T.pretty(c.item.name))}</h2>
      <p class="note">${fmt(c.item.by || c.item.cat)}. In ${fmt(T.noteName(key.tonic, true))} ${key.minor ? 'minor' : 'major'}, ${c.slots.length} chords${lv.stretch > 1 ? `, each held ${lv.stretch} times as long as written` : ''}, ${c.slots.length > 8 ? 'once' : 'twice'} round.</p>
      <h3>The theory</h3>
      <table class="stab"><tr><th></th><th>chord · its job</th><th>${d.scale ? 'play' : 'land on'}</th></tr>${rows.join('')}</table>
      <h3>The challenge: ${esc(d.name.toLowerCase())}</h3>
      <p>${fmt(d.goal)} <i>${fmt(d.why)}</i></p>
      ${hard.length ? `<ul class="shard">${hard.map((h) => `<li>${fmt(h)}</li>`).join('')}</ul>` : '<p class="note">Everything here is inside the key: listen for how each target sounds against its chord.</p>'}
    </section>
    <div class="actions"><button class="primary" data-s="play">▶ Play it</button><button data-s="skipprog">Another progression</button></div>
    <div class="chips" style="justify-content:center"><button class="chip ${O.explain ? 'on' : ''}" data-s="explain">Explain each progression</button></div>`;
    window.scrollTo(0, 0);
  }
  function playOn() {
    if (!R) return;
    R.waiting = false;
    drawRun();
    R.pad = A.padLine({ vel: 0.5 });
    R.t = A.audioCtx().currentTime + 0.3;
    pump();
  }

  // ---------- drawing ----------
  function neck(c, nx) {
    const p = R.S.pos, a = aim(c, nx);
    const show = O.show && LV().show !== 'none';
    let notes = a.notes;
    if (!show) notes = notes.map((n) => ({ ...n, kind: 'sc', mark: false }));
    else if (LV().show === 'faint') notes = notes.map((n) => (n.mark ? { ...n, kind: 'sc' } : { ...n, kind: 'sc', iv: '' }));
    const w = { lo: Math.max(0, p.lo - (p.lo > 0 ? 1 : 0)), hi: p.hi + 1, band: p };
    return { svg: neckSVG({ notes, lo: w.lo, hi: w.hi }, { ...w, labels: 'iv' }), a };
  }
  function show(c, nx, banner = c.first) {
    const now = document.getElementById('snow');
    if (!now) return;
    const { svg, a } = neck(c, nx);
    const hidden = !(O.show && LV().show !== 'none');
    now.innerHTML = `<div class="main cnum">${fmt(c.rn)}</div><div class="sub cname">${fmt(c.name)}</div>`;
    document.getElementById('saim').innerHTML = hidden ? '<span class="lbl">find it</span>' : `<span class="lbl">${a.kind === 'scale' ? 'play' : 'land on'}</span> <b>${fmt(a.label)}</b>`;
    document.getElementById('sbeats').innerHTML = '<i></i><i></i><i></i><i></i>';
    document.getElementById('snext').innerHTML = nx ? `<span class="lbl">next</span> <b class="cnum">${fmt(nx.rn)}</b> <b class="cname">${fmt(nx.name)}</b>${!hidden && !drillById(O.drill).scale ? ` <span class="muted">→ ${fmt(aim(nx, R.queue[1]).label)}</span>` : ''}` : '';
    document.getElementById('sstage').innerHTML = `${svg}${a.kind === 'scale' ? SCALE_LEGEND : TONE_LEGEND}`;
    if (banner) {
      document.getElementById('sprog').innerHTML = `<span class="lbl">now playing</span><b>${fmt(T.pretty(c.item.name))}</b><small>${fmt(T.noteName(c.key.tonic, true))} ${c.key.minor ? 'minor' : 'major'} · ${esc(c.item.by || c.item.cat)}</small>${hidden ? '' : `<p>${fmt(progNote(c))}</p>`}`;
    }
    const w = document.getElementById('swhere'); if (w) w.innerHTML = `${fmt(T.noteName(c.key.tonic, true))} ${c.key.minor ? 'minor' : 'major'}<small>${esc(R.S.shapeKey)} shape${R.S.shapes.length > 1 ? 's' : ''} · frets ${R.S.pos.lo}–${R.S.pos.hi}</small>`;
  }
  const TONE_LEGEND = '<div class="legend"><span class="k r">root</span><span class="k t3">3rd</span><span class="k t5">5th</span><span class="k t7">7th</span><span class="k sc">other chord tones</span><span class="k tx">approach</span></div><p class="note" style="text-align:center">Ringed: the notes to land on.</p>';
  const SCALE_LEGEND = '<div class="legend"><span class="k r">root</span><span class="k t3">3rd</span><span class="k t5">5th</span><span class="k t7">7th</span><span class="k tx">the scale’s colour note</span><span class="k sc">rest of the scale</span></div>';
  function goalHTML() {
    const d = drillById(O.drill), groups = [...new Set(DRILLS.map((x) => x.group))];
    return `<span class="lbl">the drill</span><select id="sdrill" class="select" aria-label="Drill">${groups.map((g) => `<optgroup label="${esc(g)}">${DRILLS.filter((x) => x.group === g).map((x) => `<option value="${x.id}" ${x.id === O.drill ? 'selected' : ''}>${esc(x.name)}</option>`).join('')}</optgroup>`).join('')}</select><small>${fmt(d.goal)}</small>`;
  }
  function wireDrill() {
    const sel = document.getElementById('sdrill');
    if (sel) sel.onchange = () => { O.drill = sel.value; save(); document.getElementById('sgoal').innerHTML = goalHTML(); wireDrill(); if (R?.cur) show(R.cur, R.queue[0], true); };
  }
  const btn = (k, l, on) => `<button class="rt ${on ? 'on' : ''}" data-s="${k}" aria-pressed="${!!on}">${esc(l)}</button>`;
  function liveButtons() { return btn('show', 'Show targets', O.show) + btn('sound', 'Chords', O.sound) + btn('click', 'Click', O.click) + btn('mute', 'Mute', O.mute) + '<button class="rt" data-s="nextprog">Next progression ⏭</button>'; }
  function drawRun() {
    const d = drillById(O.drill);
    $app.innerHTML = `
    <header class="chead run"><button class="icon" data-s="stop" aria-label="Stop">■</button><div class="where" id="swhere"></div><button class="icon" data-s="pause" aria-label="Pause">❚❚</button></header>
    <div class="sgoal" id="sgoal">${goalHTML()}</div>
    <div class="roamnow" id="sprog"></div>
    <div class="now" id="snow"></div>
    <div class="saim" id="saim"></div>
    <div class="beats" id="sbeats"></div><div class="lbar" id="sbar"></div>
    <div class="nextline" id="snext"></div>
    <div class="stage" id="sstage"></div>
    <div class="runctl"><button data-s="bpm-" aria-label="Slower">−</button><b id="sbpm">${bpm()} bpm</b><button data-s="bpm+" aria-label="Faster">+</button></div>
    <div class="runbtns" id="sbtns">${liveButtons()}</div>`;
    wireDrill();
    window.scrollTo(0, 0);
  }

  async function start() {
    A.unlockAudio().catch(() => {});
    const tonic = T.parseNote(O.key);
    const pos = O.pair ? G.positionOfPair(tonic, O.shape) : G.positionOf(tonic, O.shape);
    const S = { tonic, minor: minor(), shape: O.shape, shapes: O.pair ? pos.shapes : [O.shape], shapeKey: O.pair ? pos.shapes.join('+') : O.shape, pos, toured: new Set([O.shape]) };
    R = { S, queue: [], prevGrip: null, paused: false, pad: A.padLine({ vel: 0.5 }) };
    R.stream = stream();
    R.queue.push(make());
    try { if (navigator.wakeLock) lock = await navigator.wakeLock.request('screen'); } catch (e) { lock = null; }
    if (O.explain) { R.queue[0].explained = true; R.waiting = true; explainer(R.queue[0]); A.ensureRunning(); return; }
    drawRun();
    await Promise.race([A.ensureRunning(), new Promise((r) => setTimeout(r, 500))]);
    if (!R) return;
    R.t = A.audioCtx().currentTime + 0.25;
    pump();
  }
  function stopAll() {
    if (!R) return;
    clearTimeout(R.timer); timers.forEach(clearTimeout); timers.length = 0;
    A.hush();
    R = null;
    if (lock) { lock.release().catch(() => {}); lock = null; }
  }
  function togglePause(b) {
    if (R.waiting) return;
    R.paused = !R.paused;
    b.textContent = R.paused ? '▶' : '❚❚';
    clearTimeout(R.timer); timers.forEach(clearTimeout); timers.length = 0;
    if (R.paused) { A.hush(); R.queue.unshift(R.cur || R.queue[0]); }
    else { R.pad = A.padLine({ vel: 0.5 }); R.t = A.audioCtx().currentTime + 0.2; pump(); }
  }

  // ---------- setup ----------
  function seg(name, opts, cur) { return `<div class="seg" role="radiogroup">${opts.map(([v, l]) => `<button data-o="${name}" data-v="${v}" class="${String(cur) === String(v) ? 'on' : ''}" role="radio" aria-checked="${String(cur) === String(v)}">${l}</button>`).join('')}</div>`; }
  function setup() {
    const keys = minor() ? MINOR_KEYS : MAJOR_KEYS;
    if (!keys.includes(O.key)) O.key = minor() ? ({ Db: 'C#', Ab: 'G#' }[O.key] || 'A') : ({ 'C#': 'Db', 'G#': 'Ab' }[O.key] || 'C');
    const pos = O.pair ? G.positionOfPair(T.parseNote(O.key), O.shape) : G.positionOf(T.parseNote(O.key), O.shape);
    const d = drillById(O.drill), lv = LV();
    const groups = [...new Set(DRILLS.map((x) => x.group))];
    $app.innerHTML = `
    <header class="chead"><button class="icon" data-s="back" aria-label="Back">‹</button><h1>Slow soloing</h1><button class="icon" data-s="go" aria-label="Start">▶</button></header>
    <p class="lead">Progressions play slowly on a soft pad while you solo in one position. Pick one thing to drill; the neck shows what it asks for on every chord.</p>
    <section class="card">
      <h2>The drill</h2>
      ${groups.map((g) => `<h3>${esc(g)}</h3><div class="chips">${DRILLS.filter((x) => x.group === g).map((x) => `<button class="chip ${O.drill === x.id ? 'on' : ''}" data-o="drill" data-v="${x.id}">${esc(x.name)}</button>`).join('')}</div>`).join('')}
      <p class="note"><b>${esc(d.name)}</b>: ${fmt(d.goal)} <i>${fmt(d.why)}</i></p>
    </section>
    <section class="card">
      <h2>Difficulty</h2>
      <input type="range" id="slevel" min="1" max="5" step="1" value="${O.level}" aria-label="Difficulty">
      <p class="note"><b>${O.level}: ${esc(lv.name)}</b>. ${esc(lv.blurb)}</p>
      <h3>Tempo</h3>
      <div class="tempo"><button data-s="bpm-" aria-label="Slower">−</button><b>${O.bpm}<small> bpm</small></b><button data-s="bpm+" aria-label="Faster">+</button></div>
      <p class="note">${O.bpm === lv.bpm ? 'The level’s own tempo.' : `The level suggests ${lv.bpm}.`} Change it during the run too.</p>
      <div class="chips"><button class="chip ${O.explain ? 'on' : ''}" data-t="explain">Explain each progression first</button></div>
    </section>
    <section class="card">
      <h2>Key</h2>
      ${seg('kt', [['major', 'Major'], ['minor', 'Minor'], ['both', 'Both']], O.kt)}
      <div class="chips">${keys.map((k) => `<button class="chip ${O.key === k ? 'on' : ''}" data-o="key" data-v="${k}">${fmt(T.pretty(k))}${minor() ? 'm' : ''}</button>`).join('')}</div>
      <p class="note">${O.kt === 'both' ? 'Major and minor progressions both, on the same tonic.' : O.kt === 'minor' ? 'Minor progressions.' : 'Major progressions.'}</p>
      <h2>Position</h2>
      <div class="chips shapes">${G.SHAPES.map((s) => `<button class="chip ${O.shape === s ? 'on' : ''}" data-o="shape" data-v="${s}">${O.pair ? `${s}+${G.nextShape(s)}` : s}</button>`).join('')}</div>
      <div class="chips"><button class="chip ${O.pair ? 'on' : ''}" data-t="pair">Two shapes at once</button></div>
      <p class="note">You stay in frets ${pos.lo}–${pos.hi} all the way through: every target and scale is shown there.</p>
    </section>
    <section class="card">
      <h2>Sound</h2>
      <div class="chips"><button class="chip ${O.sound ? 'on' : ''}" data-t="sound">The chords on a pad</button><button class="chip ${O.click ? 'on' : ''}" data-t="click">Click</button></div>
    </section>
    <div class="actions"><button class="primary" data-s="go">▶ Start soloing</button></div>`;
    const r = $app.querySelector('#slevel');
    r.oninput = () => { O.level = Number(r.value); O.bpm = LV().bpm; save(); setup(); };
  }

  $app.onclick = (e) => {
    const b = e.target.closest('button'); if (!b) return;
    const d = b.dataset;
    if (d.o) { O[d.o] = d.v; save(); return setup(); }
    if (d.t) { O[d.t] = !O[d.t]; save(); return setup(); }
    const a = d.s; if (!a) return;
    if (a === 'back') { stopAll(); return onBack(); }
    if (a === 'go') { save(); return start(); }
    if (a === 'bpm-' || a === 'bpm+') {
      O.bpm = Math.max(24, Math.min(200, O.bpm + (a === 'bpm+' ? 2 : -2))); save();
      if (R) { const el = document.getElementById('sbpm'); if (el) el.textContent = `${bpm()} bpm`; return; }
      return setup();
    }
    if (!R) return;
    if (a === 'play') { A.unlockAudio().catch(() => {}); return playOn(); }
    if (a === 'skipprog') { R.stream = stream(); R.queue = [make()]; R.queue[0].explained = true; return explainer(R.queue[0]); }
    if (a === 'explain') { O.explain = !O.explain; save(); return explainer(R.queue[0]); }
    if (a === 'stop') { stopAll(); return setup(); }
    if (a === 'pause') return togglePause(b);
    if (a === 'nextprog') { R.stream = stream(); R.queue = [make()]; if (!O.explain) R.queue[0].first = false; return; }
    if (['show', 'sound', 'click', 'mute'].includes(a)) {
      O[a] = !O[a]; save();
      if (a === 'mute' && O.mute) { A.hush(); R.pad = A.padLine({ vel: 0.5 }); }
      if (a === 'sound' && !O.sound) R.pad.release(A.audioCtx().currentTime, 0.4);
      document.getElementById('sbtns').innerHTML = liveButtons();
      if (R.cur) show(R.cur, R.queue[0]);
    }
  };
  setup();
  return stopAll;
}
