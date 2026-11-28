// Scale Driller: pick a key, a scale and where on the neck (one CAGED shape, two joined, three notes per string or
// the whole neck), then a kind of practice. The neck shows the scale (intervals, notes, dots, roots only or nothing);
// a metronome, a drone, and a guide that plays the drill and lights each note. Game mode deals random scale, key,
// position and drill (any of them can be locked). Numbers mode holds a line of degree numbers (up to 13ths) while you
// flick through scales.
import * as T from '../theory.js';
import * as F from '../fretboard.js';
import * as A from '../audio.js';
import { esc } from '../fundamentals/core.js';
import { GROUPS, ORDER, BY, TIPS, nameOf, ivsOf, ivForNumber, semi, sizeOf, groupOf } from './data.js';
import { AREAS, AREA_NAME, positions, positionsIvs, spell, placePitch, NECK_TOP } from './areas.js';
import { PR, CATS, practicesFor, isBest, pattern, example, hiddenPents, TWISTS } from './practice.js';
import { chordOf } from './data.js';
import { CHORD_LIST, CHORD_NAME, chordIvs, WK, workoutsFor, chordExample, progName } from './chords.js';
import { spellRoot } from '../fundamentals/core.js';
import { neck } from './neck.js';
import { BUILD } from './build.js';

// ---------- state ----------
const KEY = 'driller.v1';
let saved = {};
try { saved = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { saved = {}; }
const S = Object.assign({ mode: 'drill', key: 7, scale: 'dorian', area: 'caged', pos: {}, prac: 'updown', labels: 'iv', zoom: false, bpm: 80, sub: 2, guide: true, click: true, drone: false }, saved);
S.game = Object.assign({ groups: [0, 1, 2, 3, 4, 5], areas: ['caged', 'pair', 'nps3'], keys: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], cats: ['runs', 'seq', 'arp', 'voc'], every: 0, twist: true, locks: {}, done: 0 }, saved.game || {});
S.num = Object.assign({ len: 6, top: 9, style: 'melodic', line: null, hint: true, pool: 'all' }, saved.num || {});
S.pos = Object.assign({ caged: 0, pair: 0, nps3: 0, neck: 0 }, S.pos);
S.ch = Object.assign({ q: 'maj7', w: 'arp', area: 'caged', pos: { caged: 0, pair: 0, neck: 0 }, step: 0 }, saved.ch || {});
if (!CHORD_NAME[S.ch.q]) S.ch.q = 'maj7';
if (!BY[S.scale] || !ORDER.includes(S.scale)) S.scale = 'dorian';
if (!AREA_NAME[S.area]) S.area = 'caged';
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* private mode */ } };

const SUBS = { 1: 'Beats', 2: '8ths', 3: 'Triplets', 4: '16ths' };
const LABELS = [['iv', 'Intervals'], ['note', 'Notes'], ['dot', 'Dots'], ['root', 'Roots only'], ['none', 'Hidden']];
const LABEL = Object.fromEntries(LABELS);
const pick = (list) => list[Math.floor(Math.random() * list.length)];
const pickNot = (list, cur) => { const l = list.length > 1 ? list.filter((x) => x !== cur) : list; return pick(l); };

// ---------- what's on the neck ----------
let data = null, area = null, pat = null, seed = Math.random(), lit = null, peek = false, twist = null, showAll = false;
const isCh = () => S.mode === 'chords';
const curArea = () => (isCh() ? S.ch.area : S.area);
const posMap = () => (isCh() ? S.ch.pos : S.pos);
const curIvs = () => (isCh() ? (WK[S.ch.w]?.scaleArea ? ivsOf('ionian') : chordIvs(S.ch.q)) : ivsOf(S.scale));
let steps = null; // a voicing workout's grips
function loadChord() {
  const q = S.ch.q, ivs = chordIvs(q), root = spellRoot(S.key, q);
  if (!['caged', 'pair', 'neck'].includes(S.ch.area)) S.ch.area = 'caged';
  data = positionsIvs(ivs, S.key, S.ch.area, root);
  S.ch.pos[S.ch.area] = Math.min(S.ch.pos[S.ch.area] || 0, data.list.length - 1);
  area = data.list[S.ch.pos[S.ch.area]];
  const list = workoutsFor(q);
  if (!list.some((w) => w.id === S.ch.w)) S.ch.w = list[0].id;
  const w = WK[S.ch.w];
  if (w.scaleArea) {
    // arpeggios over the changes: the key's major scale on the neck, the chords' notes lit as they go
    data = positionsIvs(ivsOf('ionian'), S.key, S.ch.area, spell(S.key, 'ionian'));
    area = data.list[S.ch.pos[S.ch.area]] || data.list[0];
    pat = { groups: w.gen({ P: area.path, key: S.key }).filter((g) => g.some(Boolean)) };
    steps = null;
  } else if (w.kind === 'arp') {
    const ext = [...ivs, '9'].filter((x, i, a) => a.findIndex((y) => semi(y) === semi(x)) === i);
    const extArea = positionsIvs(ext, S.key, S.ch.area, root).list[S.ch.pos[S.ch.area]];
    pat = { groups: w.gen({ P: area.path, Pext: extArea.path, ivs, q, pc: S.key }).filter((g) => g.some(Boolean)) };
    steps = null;
  } else {
    steps = w.steps({ root, q, area, key: S.key });
    S.ch.step = Math.max(0, Math.min(S.ch.step || 0, steps.length - 1));
    pat = { groups: [] };
  }
  cachedSeq = null;
}
function load() {
  showAll = false;
  if (isCh()) return loadChord();
  data = positions(S.scale, S.key, S.area);
  S.pos[S.area] = Math.min(S.pos[S.area] || 0, data.list.length - 1);
  area = data.list[S.pos[S.area]];
  const list = practicesFor(S.scale);
  if (!list.some((p) => p.id === S.prac)) S.prac = list[0].id;
  pat = pattern(S.prac, S.scale, S.key, area, seed);
  cachedSeq = null;
}
const rootName = () => T.noteName(data.root, true);
const titleOf = () => (isCh() ? T.pretty(T.chordSymbol(data.root, S.ch.q)) : `${rootName()} ${nameOf(S.scale)}`);
// note names; a double sharp or flat (C𝄪 in B altered) is shown as the note players call it (D)
const noteOf = (iv) => { const n = T.transpose(data.root, F.simpleIv(iv)); return T.noteName(Math.abs(n.acc) > 1 ? T.enharmonic(n) : n, true); };
function role(iv) {
  const s = semi(iv), colour = !isCh() && (TIPS[S.scale]?.colour || []).some((c) => semi(c) === s);
  if (s === 0) return 'r';
  if (colour) return 'c';
  const d = F.simpleIv(iv).replace(/[^0-9]/g, '');
  if (d === '3') return 't';
  if (d === '5') return 'f';
  if (d === '7') return 's';
  return 'x';
}
const upright = () => window.innerHeight > window.innerWidth && window.innerWidth < 760;

// numbers mode: the line placed on the neck in this area: [{ n, iv, note } | { n, iv: null }]
function placedLine() {
  const line = S.num.line || [];
  const roots = area.notes.filter((n) => semi(n.iv) === 0).map((n) => n.midi);
  const cands = [...new Set(roots.length ? roots : [area.path[0].midi])].sort((a, b) => a - b);
  let best = null, bc = Infinity;
  for (const r0 of cands) {
    let prev = null, cost = 0;
    const out = line.map((n) => {
      const iv = ivForNumber(S.scale, n);
      if (!iv) return { n, iv: null };
      const midi = r0 + semi(iv) + (n >= 8 ? 12 : 0);
      const at = placePitch(midi, area, prev);
      if (!at) { cost += 50; return { n, iv: null }; }
      const inside = area.notes.some((x) => x.string === at.string && x.fret === at.fret);
      cost += (inside ? 0 : 10) + (prev ? Math.abs(at.fret - prev.fret) * 0.2 : 0);
      prev = at;
      return { n, iv, note: { ...at, iv } };
    });
    if (cost < bc) { bc = cost; best = out; }
  }
  return best || [];
}

function drawNeck() {
  const box = document.querySelector('.neckbox');
  if (!box) return;
  const v = upright();
  const labels = peek ? 'iv' : S.labels;
  const numHint = S.mode === 'numbers' && S.num.hint;
  const line = S.mode === 'numbers' ? placedLine() : [];
  const tags = new Map();
  if (numHint) line.forEach((x, i) => { if (x.note) { const k = x.note.string + ':' + x.note.fret; tags.set(k, tags.has(k) ? tags.get(k) + ',' + (i + 1) : String(i + 1)); } });
  const isLit = (n) => !!lit && lit.some((l) => l.string === n.string && l.fret === n.fret);
  const stepNotes = isCh() && steps ? (steps[S.ch.step]?.notes || []) : null;
  let dots = (stepNotes || area.notes).map((n) => {
    const k = n.string + ':' + n.fret;
    return { string: n.string, fret: n.fret, cls: role(n.iv), ring: semi(n.iv) === 0, lit: isLit(n), tag: tags.get(k), dim: numHint && !tags.has(k),
      label: labels === 'iv' || labels === 'root' ? T.prettyIv(n.iv) : labels === 'note' ? noteOf(n.iv) : '', root: semi(n.iv) === 0 };
  });
  if (labels === 'root') dots = dots.filter((d) => d.root || d.lit || d.tag);
  if (labels === 'none') dots = dots.filter((d) => d.lit).map((d) => ({ ...d, label: '' }));
  for (const l of lit || []) if (!dots.some((d) => d.string === l.string && d.fret === l.fret)) dots.push({ string: l.string, fret: l.fret, cls: l.chrom ? 'chrom' : role(l.iv), lit: true, label: labels === 'none' ? '' : l.chrom || T.prettyIv(l.iv) });
  // numbers mode: line notes that fall outside the area still show
  for (const x of line) if (numHint && x.note && !dots.some((d) => d.string === x.note.string && d.fret === x.note.fret)) dots.push({ string: x.note.string, fret: x.note.fret, cls: role(x.iv), tag: tags.get(x.note.string + ':' + x.note.fret), label: labels === 'none' ? '' : T.prettyIv(x.iv) });
  const top = Math.min(19, Math.max(NECK_TOP, area.top + 1, ...dots.map((d) => d.fret + 1)));
  let from = 0, to = top;
  if (S.zoom && !area.whole && !stepNotes) {
    const fr = dots.map((d) => d.fret).concat([area.win.lo, area.win.hi]);
    from = Math.max(0, Math.min(...fr) - 1); to = Math.max(...fr) + 1;
    if (from <= 1) from = 0;
    if (to - from < 5) to = from + 5;
  }
  // the rest of the scale, faint, all over the neck
  const ghosts = [];
  if ((!area.whole || stepNotes) && labels !== 'none') {
    const pcs = new Set(curIvs().map(semi));
    for (let s = 1; s <= 6; s++) for (let f = 0; f <= to; f++) { const r = ((F.OPEN[s] + f - S.key) % 12 + 12) % 12; if (pcs.has(r) && (labels !== 'root' || r === 0)) ghosts.push({ string: s, fret: f, cls: r === 0 ? 'r' : 'x' }); }
  }
  const showWin = !area.whole && (!stepNotes || WK[S.ch.w].usesArea);
  box.innerHTML = neck({ dir: v ? 'v' : 'h', from, to, win: showWin ? area.win : null, ghosts, dots });
}

// ---------- sound: metronome, guide, drone ----------
let run = null, cachedSeq = null, droneAt = null, wake = null;
// the notes of one pass, one per subdivision, padded with rests to whole bars so every pass starts on beat 1
function seqNow() {
  if (cachedSeq) return cachedSeq;
  const bar = S.sub * 4;
  // a voicing workout: one grip per bar
  const base = isCh() && steps ? steps.flatMap((st, i) => [{ chord: st.notes, step: i }, ...Array(bar - 1).fill(null)])
    : S.mode === 'numbers' ? placedLine().map((x) => x.note || null) : pat.groups.flat();
  const rest = isCh() && steps ? 0 : S.mode === 'numbers' ? S.sub * 2 : S.sub;
  const len = Math.ceil((base.length + rest) / bar) * bar;
  cachedSeq = base.concat(Array(len - base.length).fill(null));
  return cachedSeq;
}
function startRun() {
  stopRun();
  A.unlockAudio();
  const c = A.audioCtx();
  const m = { next: c.currentTime + 0.12, slot: -S.sub * 4, idx: 0, wait: false, timers: [], timer: null };
  const tick = () => {
    while (m.next < c.currentTime + 0.12) {
      const sub = S.sub, k = ((m.slot % sub) + sub) % sub, beat = Math.floor(m.slot / sub), t = m.next;
      if (k === 0 && (S.click || m.slot < 0)) A.click(t, ((beat % 4) + 4) % 4 === 0 ? 2 : 1);
      if (m.slot >= 0) {
        const down = k === 0 && ((beat % 4) + 4) % 4 === 0, at = Math.max(0, (t - c.currentTime) * 1000);
        // game: a new deal every N bars, dealt as this downbeat is scheduled so its first note lands on it
        const every = S.game.every;
        if (S.mode === 'game' && every && m.slot > 0 && m.slot % (sub * 4 * every) === 0) {
          deal();
          m.timers.push(setTimeout(() => { if (run === m) render(); }, at));
        }
        // after a change the pattern waits for the next bar line and starts from its first note
        if (down && m.wait) { m.idx = 0; m.wait = false; }
        if (!m.wait) {
          const seq = seqNow(), n = seq[m.idx % seq.length];
          if (n && n.chord) {
            // a grip: strum it on the downbeat (if Play notes is on) and show it for the bar
            if (S.guide) A.strum(n.chord.map((x) => x.midi).sort((a, b) => a - b), t, { vel: 0.7, dur: (60 / S.bpm) * 3.6 });
            m.timers.push(setTimeout(() => { if (run === m) { S.ch.step = n.step; lit = S.guide ? n.chord : null; render(); } }, at));
          } else if (n && S.guide) {
            A.pluck(n.midi, t, { vel: 0.7, dur: Math.min(0.6, (60 / S.bpm / sub) * 1.5) });
            m.timers.push(setTimeout(() => { if (run === m) { lit = [n]; drawNeck(); } }, at));
          }
          m.idx++;
        }
        if (m.timers.length > 64) m.timers.splice(0, 32);
      }
      m.next += 60 / S.bpm / sub; m.slot++;
    }
  };
  m.timer = setInterval(tick, 25); tick();
  run = m;
  try { navigator.wakeLock?.request('screen').then((w) => { wake = w; }).catch(() => {}); } catch (e) { /* */ }
}
function stopRun() {
  if (run) { clearInterval(run.timer); run.timers.forEach(clearTimeout); run = null; }
  if (wake) { wake.release().catch(() => {}); wake = null; }
  lit = null;
}
// restart the guide from the top of the pattern after a change
function changed() { cachedSeq = null; lit = null; if (run) run.wait = true; }
function syncDrone() {
  const want = S.drone ? 40 + ((S.key - 4 + 12) % 12) : null;
  const fifth = curIvs().some((iv) => semi(iv) === 7);
  const k = want == null ? null : want + (fifth ? 'f' : '');
  if (k === droneAt) return;
  if (droneAt != null) A.stopDrone();
  droneAt = k;
  if (want != null) { A.unlockAudio(); A.startDrone(want, fifth); }
}

// ---------- game ----------
function deal() {
  const g = S.game, L = g.locks;
  if (!L.scale) { const pool = ORDER.filter((id) => g.groups.includes(groupOf(id))); if (pool.length) S.scale = pickNot(pool, S.scale); }
  if (!L.key && g.keys.length) S.key = pickNot(g.keys, S.key);
  if (!L.area && g.areas.length) {
    S.area = pick(g.areas);
    const n = positions(S.scale, S.key, S.area).list.length;
    S.pos[S.area] = Math.floor(Math.random() * n);
  }
  const fits = practicesFor(S.scale).filter((p) => g.cats.includes(p.cat));
  if (!L.prac || !practicesFor(S.scale).some((p) => p.id === S.prac)) S.prac = (fits.length ? pickNot(fits.map((p) => p.id), S.prac) : practicesFor(S.scale)[0].id);
  twist = g.twist ? pickNot(TWISTS, twist) : null;
  seed = Math.random();
  g.done++;
  save(); load(); changed(); syncDrone();
}

// ---------- numbers ----------
function newLine() {
  const { len, top, style } = S.num;
  const nums = top === 13 ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13] : Array.from({ length: top }, (_, i) => i + 1);
  const out = [];
  for (let i = 0; i < len; i++) {
    const prev = out[i - 1];
    let pool = nums.filter((n) => n !== prev);
    if (style === 'melodic' && prev) pool = pool.filter((n) => Math.abs(n - prev) <= 3);
    if (style === 'chord') pool = pool.flatMap((n) => (n % 2 ? [n, n, n] : [n]));
    out.push(pick(pool));
  }
  S.num.line = out; save();
}

// ---------- the screen ----------
const $app = document.getElementById('driller');
const opt = (v, l, cur) => `<option value="${esc(v)}" ${String(cur) === String(v) ? 'selected' : ''}>${esc(l)}</option>`;
const keyOpts = () => Array.from({ length: 12 }, (_, i) => opt(i, T.noteName(isCh() ? spellRoot(i, S.ch.q) : spell(i, S.scale), true), S.key)).join('');
const scaleOpts = () => GROUPS.map(([g, ids]) => `<optgroup label="${esc(g)}">${ids.map((id) => opt(id, nameOf(id), S.scale)).join('')}</optgroup>`).join('');
const areaOpts = () => AREAS.filter(([id]) => !isCh() || id !== 'nps3').map(([id, l]) => opt(id, l, curArea())).join('');
const formula = () => `<div class="form">${curIvs().map((iv) => `<span class="${role(iv)}"><b>${esc(T.prettyIv(iv))}</b><small>${esc(noteOf(iv))}</small></span>`).join('')}</div>`;
// the notes a description refers to, named in this key
const nameSemis = (x) => { const n = T.transposeSemis(data.root, x); return T.noteName(Math.abs(n.acc) > 1 ? T.enharmonic(n) : n, true); };
const STR = { 6: 'low E', 5: 'A', 4: 'D', 3: 'G', 2: 'B', 1: 'high E' };
// a drill in words: what to do, an example in this key (degrees, then the notes), the notes it refers to, and why
function drillText(p, why = true) {
  const ex = example(p.id, S.scale), info = infoFor(p.id);
  const more = (g) => (ex.length > 1 || g.length >= 5 ? ' …' : '');
  const exHTML = ex ? `<p class="ex"><span>Example in ${esc(titleOf())}, from the root</span><b>${esc(ex.map((g) => g.map((n) => n.lab).join(' ')).join(' · '))}${more(ex[0])}</b><i>${esc(ex.map((g) => g.map((n) => (n.iv ? noteOf(n.iv) : nameSemis(n.semis))).join(' ')).join(' · '))}${more(ex[0])}</i></p>` : '';
  if (p.id === 'pents') return `<p class="desc">${esc(p.how)}</p>${pentsBlock()}${why && p.why ? `<p class="why"><b>Why:</b> ${esc(p.why)}</p>` : ''}`;
  return `<p class="desc">${esc(p.how)}</p>${exHTML}${info ? `<p class="info">${esc(info)}</p>` : ''}${why && p.why ? `<p class="why"><b>Why:</b> ${esc(p.why)}</p>` : ''}`;
}
// the pentatonics hidden in a scale, the way jazz players use them over its chord (pentatonic superimposition):
// what each one adds over the chord (in chord terms: 9, 11, 13, ♯11, ♭9 …), the rule of thumb for the chord, and
// how to use them
const PENT_RULE = {
  dorian: 'Over a minor 7th chord: minor pentatonics on the root, the 2nd and the 5th (“1, 2, 5”).',
  aeolian: 'Over a minor chord in a minor key: minor pentatonics on the 1, 4 and 5. The one on the 4 brings in the ♭6.',
  phrygian: 'Over a Phrygian minor chord: minor pentatonics on the 1, 4 and ♭7. The ♭2 isn’t in any of them, so add it yourself for the Spanish sound.',
  ionian: 'Over a maj7: the major pentatonic on the root or the 5th (the same notes as the minor pentatonic on the 6th or the 3rd). Skip the one on the 4th: it has the 4th, which clashes with the major 3rd.',
  lydian: 'Over a maj7 (or maj7♯11): major pentatonics on the 1, 2 and 5. The one on the 2nd (D major over Cmaj7) carries the ♯11: the Lydian sound.',
  mixolydian: 'Over a dominant 7th: the major pentatonic on the root for the inside sound. Minor pentatonics on the 5th or the 2nd give a sus sound, because they hold the 11.',
  altered: 'Over an altered dominant: the minor pentatonic a minor 3rd above the root (B♭ minor over G7alt). It’s the same as the major pentatonic of the tritone sub (D♭ major). Add the chord’s 3rd and you have the whole altered scale.',
  locrian: 'Over m7♭5: the minor pentatonic on the ♭3 (B♭ minor over Gø), the same notes as the major pentatonic on the ♭5.',
  'mel-min': 'Over m(maj7) or m6: the minor pentatonic on the 2nd (D minor over Cm6), which gives 9 11 5 13: the melodic minor sound without the 7.',
};
function pentsBlock() {
  const ivs = ivsOf(S.scale);
  const ct = chordOf(S.scale), cts = ct.map(semi);
  const q = T.recogniseChord(ct.map(F.simpleIv));
  const chordName = q ? T.pretty(T.chordSymbol(data.root, q)) : `${rootName()} ${nameOf(S.scale)}`;
  const major3 = cts.includes(4), minor3 = cts.includes(3);
  const colour = (TIPS[S.scale]?.colour || []).map(semi);
  // a note over the chord, named as an extension
  const ext = (d) => ({ 0: '1', 1: '♭9', 2: '9', 3: major3 ? '♯9' : '♭3', 4: major3 || !minor3 ? '3' : '♭11', 5: '11', 6: cts.includes(6) ? '♭5' : '♯11', 7: '5', 8: cts.includes(8) ? '♯5' : '♭13', 9: cts.includes(9) ? '6' : '13', 10: '♭7', 11: '7' }[d]);
  const MINOR = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'G#', 'A', 'Bb', 'B'];
  const pName = (m) => T.noteName(T.parseNote(MINOR[(S.key + m) % 12]), true);
  const pMajor = (m) => T.noteName(T.transpose(T.parseNote(MINOR[(S.key + m) % 12]), 'b3'), true);
  const list = hiddenPents(S.scale).map((x) => {
    const m = (x + 9) % 12, degs = [0, 3, 5, 7, 10].map((o) => (m + o) % 12);
    const third = cts.find((d) => d === 3 || d === 4 || d === 5 && !major3 && !minor3), sev = cts.find((d) => d >= 9);
    return { m, x, degs, has3: degs.includes(third), has7: degs.includes(sev), root: degs.includes(0), cols: degs.filter((d) => colour.includes(d)),
      alt: major3 && cts.includes(10) ? degs.filter((d) => [1, 3, 8].includes(d)).length : 0, eleven: major3 && degs.includes(5) };
  });
  // the notes that make the chord what it is: its 3rd and 7th, and a ♭5 or ♯5 if it has one; the scale's colour
  // notes that aren't chord tones
  const defining = cts.filter((d) => d !== 0 && d !== 7);
  const distinct = colour.filter((d) => !cts.includes(d));
  const dominant = major3 && cts.includes(10);
  for (const p of list) {
    p.states = defining.every((d) => p.degs.includes(d));
    p.missing = defining.filter((d) => !p.degs.includes(d));
    p.dcols = p.degs.filter((d) => distinct.includes(d));
    const no5 = p.missing.some((d) => d === 6 || d === 8);
    p.score = p.alt >= 2 ? 3 : p.root && p.has3 && !p.dcols.length && !no5 ? 0 : p.dcols.length && !no5 ? 1 : 2;
  }
  list.sort((a, b) => a.score - b.score);
  const and = (l) => (l.length > 1 ? `${l.slice(0, -1).join(', ')} and ${l[l.length - 1]}` : l[0] || '');
  let firstInside = true;
  const what = (p) => {
    const bits = [];
    bits.push(p.has3 && p.has7 ? 'Has the 3rd and 7th' : p.has3 ? 'Has the 3rd, not the 7th' : p.has7 ? 'Has the 7th, not the 3rd' : 'No 3rd or 7th');
    bits.push(p.root ? 'has the root' : 'no root');
    if (p.missing.length && (p.has3 || p.has7) && defining.some((d) => d === 6 || d === 8)) bits.push(`no ${and(p.missing.filter((d) => d === 6 || d === 8).map(ext))}, so it doesn’t spell out ${chordName}`);
    if (p.dcols.length && p.alt < 2) bits.push(`brings in the ${and(p.dcols.map(ext))}, the ${nameOf(S.scale)} colour`);
    if (p.alt >= 2) bits.push(`carries the altered notes ${and(p.degs.filter((d) => [1, 3, 8, 6].includes(d)).map(ext))}`);
    if (p.eleven) bits.push('holds the 11, which rubs against the major 3rd, so pass through it rather than holding it');
    const use = p.alt >= 2 ? 'Use it for tension just before the chord resolves, and land on the next chord’s 3rd.'
      : p.score === 0 ? (firstInside ? (firstInside = false, `The inside choice: it states the chord${minor3 ? ' (and sounds bluesy)' : ''}. Start here.`) : 'Also inside: it states the chord.')
      : p.score === 1 ? `The one that brings out the ${nameOf(S.scale)} sound${p.states ? ', and it spells out the whole chord' : ''}.`
      : p.missing.some((d) => d === 6 || d === 8) ? 'Usable, but weaker than the ones that have it.'
      : p.has3 && p.has7 ? 'States the chord without leaning on the root: a more modern sound.'
      : 'An open, floating sound over the chord: good for a lift once the chord is established.';
    return `${bits.join('; ')}. ${use}`;
  };
  const item = (p) => `<li><b>${esc(pName(p.m))} minor pentatonic</b> <span class="muted">(= ${esc(pMajor(p.m))} major) · on the ${esc(T.prettyIv(ivs.find((iv) => semi(iv) === p.m) || ext(p.m)))}</span><br>Over ${esc(chordName)}: <b class="amb">${esc(p.degs.map(ext).join(' '))}</b>. ${esc(what(p))}</li>`;
  const rule = PENT_RULE[S.scale] || `In ${nameOf(S.scale)}: minor pentatonic${list.length > 1 ? 's' : ''} on the ${list.map((p) => T.prettyIv(ivs.find((iv) => semi(iv) === p.m) || ext(p.m))).join(', ')}.`;
  // on a ii–V–I the key's major pentatonic fits all three chords
  return `
    <div class="pents">
      <b class="ph">Pentatonics over ${esc(chordName)}</b>
      <p class="rule"><b>Rule to remember:</b> ${esc(rule)}</p>
      <ul>${list.map(item).join('')}</ul>
      <b class="ph">How players use them</b>
      <ol>
        <li><b>Choose by sound, don’t just pick any.</b> Start a solo with the inside one to state the chord, move to the colour one for the ${esc(nameOf(S.scale))} sound or for lift, then come back. Inside, outside, home again: that’s tension and release inside a single chord.</li>
        <li><b>End phrases on strong notes.</b> Finish on a chord tone or on the 9 or 13${major3 ? ', not on the 11' : ''}. The pentatonic gets you there; the last note is what the ear judges.</li>
        <li><b>Play them as intervals, not as blues boxes.</b> Groups of 4, 1‑2‑3‑5 cells and 4ths across the strings are what make pentatonics sound like jazz (the McCoy Tyner and Coltrane sound) rather than rock licks.</li>
        <li><b>One shape for a whole ii–V–I.</b> The major pentatonic of the key’s I fits all three chords: G major pentatonic over Am7–D7–Gmaj7. Good for learning to play through changes before you switch shapes per chord.</li>
        <li><b>For outside tension,</b> shift the pentatonic up a half step for a beat or two, then step back into the right one.</li>
      </ol>
    </div>`;
}
function infoFor(pid) {
  const tones = () => chordOf(S.scale).map((iv) => `${T.prettyIv(iv)} (${noteOf(iv)})`).join(', ');
  if (['home', 'inv', 'into', 'enclose'].includes(pid)) return `Chord tones: ${tones()}.`;
  if (pid === 'bebopdown') return `Chord tones: ${tones()}.`;
  if (pid === 'pents') return `Hidden inside: ${hiddenPents(S.scale).map((x) => `${nameSemis((x + 9) % 12)} minor pentatonic`).join(', ')}.`;
  if (pid === 'dimtriads') { const pcs = new Set(ivsOf(S.scale).map(semi)); const r = []; for (let x = 0; x < 12; x++) if (pcs.has(x) && pcs.has((x + 4) % 12) && pcs.has((x + 7) % 12)) r.push(nameSemis(x)); return `The triads: ${r.join(', ')} major.`; }
  if (pid === 'anywhere') { const P = area.path, n = P[Math.floor(seed * (P.length - 2)) + 1]; return `Start on: ${noteOf(n.iv)} (the ${T.prettyIv(n.iv)}) on the ${STR[n.string]} string, fret ${n.fret}.`; }
  return '';
}

const where = () => `
  <label><span>Where</span><select id="dArea">${areaOpts()}</select></label>
  ${data.list.length > 1 ? `<div class="chips pos">${data.list.map((p, i) => `<button data-pos="${i}" class="${i === posMap()[curArea()] ? 'on' : ''}">${esc(p.short)}</button>`).join('')}</div>` : ''}
  <div class="sub">${esc(area.title)} · ${esc(area.sub)}</div>`;

function practiceBlock() {
  const list = practicesFor(S.scale), p = PR[S.prac];
  return `
    <div class="prac">
      <b class="pname">${isBest(S.scale, p.id) ? '★ ' : ''}${esc(p.name)}</b>
      <div class="flick"><button id="dPrPrev" aria-label="Previous drill">◀</button>
        <select id="dPrac">${CATS.map(([c, cl]) => { const ps = list.filter((x) => x.cat === c); return ps.length ? `<optgroup label="${cl}">${ps.map((x) => opt(x.id, (isBest(S.scale, x.id) ? '★ ' : '') + x.name, S.prac)).join('')}</optgroup>` : ''; }).join('')}</select>
        <button id="dPrNext" aria-label="Next drill">▶</button></div>
      ${drillText(p)}
      ${isBest(S.scale, p.id) ? '<p class="star">★ One of the best drills for this scale.</p>' : ''}
    </div>`;
}
function transport(label = 'Start') {
  return `
    <div class="row"><button id="dGo" class="go ${run ? 'on' : ''}">${run ? '■ Stop' : `▶ ${label}`}</button></div>
    <div class="row"><button class="sq" id="dDown">−</button><span class="bpm" id="dBpm">${S.bpm} bpm</span><button class="sq" id="dUp">+</button><button id="dSub" class="sm">${SUBS[S.sub]}</button></div>
    <div class="row tg">
      <button id="dGuide" class="${S.guide ? 'on' : ''}">Play notes</button>
      <button id="dClick" class="${S.click ? 'on' : ''}">Click</button>
      <button id="dDrone" class="${S.drone ? 'on' : ''}">Drone ${esc(rootName())}</button>
    </div>
    <div class="row tg">
      <button id="dLab">Show: ${LABEL[S.labels]}</button>
      ${S.labels === 'none' || S.labels === 'dot' || S.labels === 'root' ? '<button id="dPeek">Peek</button>' : ''}
      <button id="dZoom" class="${S.zoom ? 'on' : ''}" ${area.whole ? 'disabled' : ''}>Zoom</button>
    </div>`;
}

function drillPanel() {
  return `
    <div class="cap"><b>${esc(titleOf())}</b><button id="dTips" class="tipsb">Tips</button></div>
    ${formula()}
    <div class="menus">
      <label class="k"><span>Key</span><select id="dKey">${keyOpts()}</select></label>
      <label><span>Scale</span><select id="dScale">${scaleOpts()}</select></label>
    </div>
    ${where()}
    ${practiceBlock()}
    ${transport()}`;
}
// ---------- chords ----------
function chordText(w) {
  const ex = chordExample(w.id, S.ch.q);
  const exHTML = ex ? `<p class="ex"><span>Example in ${esc(titleOf())}, from the root</span><b>${esc(ex.map((g) => g.map((n) => n.lab).join(' ')).join(' · '))} …</b><i>${esc(ex.map((g) => g.map((n) => noteOf(n.iv)).join(' ')).join(' · '))} …</i></p>` : '';
  const prog = w.move ? `<p class="info">${w.id === 'cycle' ? `${esc(titleOf())} round the cycle: ${esc(Array.from({ length: 12 }, (_, i) => T.noteName(spellRoot((S.key + 5 * i) % 12, S.ch.q), true)).join(' '))}` : w.id === 'scale7' ? `The key of ${esc(rootName())} major` : `In ${esc(rootName())}: ${esc(progName(S.key, w.id === 'minor251'))}`}</p>` : '';
  return `<p class="desc">${esc(w.how)}</p>${w.priority ? `<p class="prio"><b>What to prioritise:</b> ${esc(w.priority)}</p>` : ''}${prog}${exHTML}<p class="why"><b>Why:</b> ${esc(w.why)}</p>`;
}
function chordsPanel() {
  const q = S.ch.q, list = workoutsFor(q), w = WK[S.ch.w];
  const one = workoutsFor(q, false), mov = workoutsFor(q, true);
  const ranked = one.filter((x) => x.rank(q)), extras = one.filter((x) => !x.rank(q));
  const mRanked = mov.filter((x) => x.rank(q)), mExtras = mov.filter((x) => !x.rank(q));
  const rk = w.rank(q), ofN = w.move ? mRanked.length : ranked.length;
  const item = (x) => `<li><button data-wk="${x.id}" class="${x.id === w.id ? 'on' : ''}">${esc(x.name)}${x.id === 'arpinv' ? ' <i>(3rd and 7th starts first)</i>' : ''}</button></li>`;
  const chips = (l) => `<div class="chips">${l.map((x) => `<button data-wk="${x.id}" class="${x.id === w.id ? 'on' : ''}">${esc(x.name)}</button>`).join('')}</div>`;
  const st = steps ? steps[S.ch.step] : null;
  return `
    <div class="cap"><b>${esc(titleOf())}</b><span class="cname">${esc(CHORD_NAME[q])}</span></div>
    ${formula()}
    <div class="menus">
      <label class="k"><span>Key</span><select id="dKey">${keyOpts()}</select></label>
      <label><span>Chord</span><select id="cQ">${CHORD_LIST.map(([g, l]) => `<optgroup label="${esc(g)}">${l.map(([id, nm]) => opt(id, nm, q)).join('')}</optgroup>`).join('')}</select></label>
    </div>
    <div class="order">
      <b>Practise in this order</b>
      <span>The usual advice from teachers: arpeggios first, then ${q.length && chordIvs(q).length === 3 ? 'triad inversions, then the CAGED forms' : 'shell voicings, then drop 2, then drop 3'}.</span>
      <ol>${ranked.map(item).join('')}</ol>
      ${extras.length ? `<span>Extras, once those are solid:</span>${chips(extras)}` : ''}
    </div>
    <div class="order">
      <b>Then: moving between chords</b>
      <span>Most chord practice is chords in motion, above all the ii–V–I. In ${esc(rootName())}: ${esc(progName(S.key))}; minor ${esc(progName(S.key, true))}. The usual order: guide tones, shells, drop 2, the minor ii–V–i.</span>
      <ol>${mRanked.map(item).join('')}</ol>
      ${mExtras.length ? `<span>Extras:</span>${chips(mExtras)}` : ''}
    </div>
    <div class="prac">
      <div class="pname">${esc(w.name)} <span class="rk">${rk ? `${w.move ? 'Moving between chords · ' : ''}Step ${rk} of ${ofN}` : 'Extra'}</span></div>
      <div class="flick"><button id="cPrev" aria-label="Previous workout">◀</button>
        <select id="cW"><optgroup label="One chord">${one.map((x) => opt(x.id, (x.rank(q) ? x.rank(q) + '. ' : 'Extra: ') + x.name, w.id)).join('')}</optgroup><optgroup label="Moving between chords">${mov.map((x) => opt(x.id, (x.rank(q) ? x.rank(q) + '. ' : 'Extra: ') + x.name, w.id)).join('')}</optgroup></select>
        <button id="cNext" aria-label="Next workout">▶</button></div>
      ${chordText(w)}
      ${st ? `<div class="stepnav"><button id="sPrev" aria-label="Previous grip">◀</button><div><b>Grip ${S.ch.step + 1} of ${steps.length}</b><span>${esc(st.text)}</span></div><button id="sNext" aria-label="Next grip">▶</button></div>` : ''}
    </div>
    ${w.kind === 'arp' || w.usesArea ? where() : `<p class="sub">${w.move ? 'This workout picks its own shapes on the neck' : 'This workout runs up the whole neck'}, so Where isn’t used.</p>`}
    ${transport(steps ? 'Start (a grip per bar)' : 'Start')}`;
}
function gamePanel() {
  const L = S.game.locks, p = PR[S.prac];
  const lock = (k) => `<button class="lock ${L[k] ? 'on' : ''}" data-lock="${k}" aria-label="Lock">${L[k] ? 'Held' : 'Hold'}</button>`;
  return `
    <div class="deal">
      <div class="dl"><div><i>Scale</i><b class="big">${esc(titleOf())}</b></div>${lock('scale')}</div>
      <div class="dl"><div><i>Key</i><b>${esc(rootName())}</b></div>${lock('key')}</div>
      <div class="dl"><div><i>Where</i><b>${esc(area.title)}</b><span>${esc(area.sub)}</span></div>${lock('area')}</div>
      <div class="dl"><div><i>Drill</i><b>${isBest(S.scale, p.id) ? '★ ' : ''}${esc(p.name)}</b></div>${lock('prac')}</div>
      ${twist ? `<div class="twist">${esc(twist)}</div>` : ''}
    </div>
    <div class="row"><button id="gDeal" class="go deal-b">Deal ⟳</button></div>
    <div class="row"><label class="inl"><span>New deal</span><select id="gEvery">${[[0, 'when I tap Deal'], [2, 'every 2 bars'], [4, 'every 4 bars'], [8, 'every 8 bars'], [16, 'every 16 bars'], [32, 'every 32 bars']].map(([v, l]) => opt(v, l, S.game.every)).join('')}</select></label></div>
    <div class="row tg"><button id="gSet">Game settings</button><button id="dTips">Tips</button></div>
    <div class="howto">${drillText(p, false)}</div>
    ${formula()}
    ${transport()}
    <div class="count">${S.game.done} dealt</div>`;
}
// a number from 8 up names its note an octave higher: 2 → 9, ♭6 → ♭13
const above = (iv, n) => { if (n < 8) return iv; const d = Number(iv.replace(/[^0-9]/g, '')); return d >= 8 ? iv : iv.replace(/[0-9]+/, String(d + 7)); };
function numbersPanel() {
  if (!S.num.line) newLine();
  const line = placedLine();
  const pool = S.num.pool === 'group' ? GROUPS[groupOf(S.scale)][1] : S.num.pool === '7' ? ORDER.filter((id) => sizeOf(id) === 7) : ORDER;
  return `
    <div class="line">${line.map((x) => `<span class="nb ${x.iv ? '' : 'miss'}"><b>${x.n}</b><i>${x.iv ? esc(T.prettyIv(above(x.iv, x.n))) : '—'}</i></span>`).join('')}</div>
    <p class="howto">Play the numbers in order: degrees of the scale, 8 and up an octave higher. A dash means this scale has no such note: skip it.</p>
    <div class="row"><button id="nNew" class="go">New line</button></div>
    <div class="row"><button class="sq" id="nLess">−</button><span class="bpm">${S.num.len} notes</span><button class="sq" id="nMore">+</button></div>
    <div class="menus">
      <label><span>Numbers</span><select id="nTop">${[[7, '1 to 7'], [8, '1 to 8'], [9, 'Up to 9'], [13, 'Up to 13']].map(([v, l]) => opt(v, l, S.num.top)).join('')}</select></label>
      <label><span>Shape</span><select id="nStyle">${[['melodic', 'Mostly steps'], ['random', 'Any leaps'], ['chord', 'Chord tones']].map(([v, l]) => opt(v, l, S.num.style)).join('')}</select></label>
    </div>
    <div class="flick scl"><button id="nPrev" aria-label="Previous scale">◀</button><div class="sname"><b>${esc(titleOf())}</b><span>${pool.indexOf(S.scale) + 1} / ${pool.length}</span></div><button id="nNext" aria-label="Next scale">▶</button></div>
    ${formula()}
    <div class="menus">
      <label class="k"><span>Key</span><select id="dKey">${keyOpts()}</select></label>
      <label><span>Flick through</span><select id="nPool">${[['all', 'All scales'], ['group', 'This family'], ['7', '7-note scales']].map(([v, l]) => opt(v, l, S.num.pool)).join('')}</select></label>
    </div>
    ${where()}
    <div class="row tg"><button id="nHint" class="${S.num.hint ? 'on' : ''}">Show the line</button><button id="dTips">Tips</button></div>
    ${transport('Play the line')}`;
}

function render() {
  const v = upright();
  $app.className = v ? 'v' : 'h';
  const panel = S.mode === 'game' ? gamePanel() : S.mode === 'numbers' ? numbersPanel() : isCh() ? chordsPanel() : drillPanel();
  const keepScroll = $app.querySelector('.panel')?.scrollTop || 0;
  $app.innerHTML = `
    <header><h1>Scale Driller <button id="dHelp" class="help" aria-label="What everything does">?</button></h1>
      <div class="seg">${[['drill', 'Scales'], ['chords', 'Chords'], ['game', 'Game'], ['numbers', 'Numbers']].map(([m, l]) => `<button data-mode="${m}" class="${S.mode === m ? 'on' : ''}">${l}</button>`).join('')}</div>
    </header>
    <div class="neckbox"></div>
    <div class="panel">${panel}</div>`;
  $app.querySelector('.panel').scrollTop = keepScroll;
  drawNeck();
  bind();
}

function bind() {
  const $ = (id) => $app.querySelector('#' + id);
  const on = (id, ev, fn) => { const el = $(id); if (el) el[ev] = fn; };
  const redo = () => { save(); load(); changed(); syncDrone(); render(); };
  $app.querySelectorAll('[data-mode]').forEach((b) => (b.onclick = () => {
    if (S.mode === b.dataset.mode) return;
    S.mode = b.dataset.mode;
    if (S.mode === 'game' && !S.game.done) deal();
    redo();
  }));
  on('dKey', 'onchange', (e) => { S.key = Number(e.target.value); redo(); });
  on('dScale', 'onchange', (e) => { S.scale = e.target.value; redo(); });
  on('dArea', 'onchange', (e) => { if (isCh()) S.ch.area = e.target.value; else S.area = e.target.value; redo(); });
  // chords
  on('cQ', 'onchange', (e) => { S.ch.q = e.target.value; S.ch.step = 0; redo(); });
  const setWk = (id) => { S.ch.w = id; S.ch.step = 0; redo(); };
  $app.querySelectorAll('[data-wk]').forEach((b) => (b.onclick = () => setWk(b.dataset.wk)));
  on('cW', 'onchange', (e) => setWk(e.target.value));
  const flickWk = (d) => { const l = workoutsFor(S.ch.q); setWk(l[(l.findIndex((x) => x.id === S.ch.w) + d + l.length) % l.length].id); };
  on('cPrev', 'onclick', () => flickWk(-1));
  on('cNext', 'onclick', () => flickWk(1));
  const stepBy = (d) => { if (!steps) return; S.ch.step = (S.ch.step + d + steps.length) % steps.length; lit = null; save(); render(); };
  on('sPrev', 'onclick', () => stepBy(-1));
  on('sNext', 'onclick', () => stepBy(1));
  $app.querySelectorAll('[data-pos]').forEach((b) => (b.onclick = () => { posMap()[curArea()] = Number(b.dataset.pos); redo(); }));
  const flickPrac = (d) => { const l = practicesFor(S.scale); S.prac = l[(l.findIndex((p) => p.id === S.prac) + d + l.length) % l.length].id; seed = Math.random(); redo(); };
  on('dPrPrev', 'onclick', () => flickPrac(-1));
  on('dPrNext', 'onclick', () => flickPrac(1));
  on('dPrac', 'onchange', (e) => { S.prac = e.target.value; seed = Math.random(); redo(); });
  // transport
  on('dGo', 'onclick', () => { if (run) stopRun(); else { changed(); startRun(); } render(); });
  const bpm = (d) => { S.bpm = Math.max(30, Math.min(260, S.bpm + d)); save(); $('dBpm').textContent = `${S.bpm} bpm`; };
  on('dDown', 'onclick', () => bpm(-5));
  on('dUp', 'onclick', () => bpm(5));
  on('dSub', 'onclick', (e) => { S.sub = { 1: 2, 2: 3, 3: 4, 4: 1 }[S.sub]; save(); changed(); e.currentTarget.textContent = SUBS[S.sub]; if (run) startRun(); }); // a new subdivision starts again from a count-in, so the bar lines stay true
  on('dGuide', 'onclick', () => { S.guide = !S.guide; lit = null; save(); render(); });
  on('dClick', 'onclick', () => { S.click = !S.click; save(); render(); });
  on('dDrone', 'onclick', () => { S.drone = !S.drone; save(); syncDrone(); render(); });
  on('dLab', 'onclick', () => { const i = LABELS.findIndex(([k]) => k === S.labels); S.labels = LABELS[(i + 1) % LABELS.length][0]; save(); render(); });
  const pk = $('dPeek');
  if (pk) {
    const down = (e) => { e.preventDefault(); peek = true; drawNeck(); };
    const up = () => { if (peek) { peek = false; drawNeck(); } };
    pk.onpointerdown = down; pk.onpointerup = up; pk.onpointerleave = up; pk.onpointercancel = up;
    pk.oncontextmenu = (e) => e.preventDefault();
  }
  on('dZoom', 'onclick', () => { S.zoom = !S.zoom; save(); render(); });
  on('dTips', 'onclick', openTips);
  on('dHelp', 'onclick', openHelp);
  // game
  on('gDeal', 'onclick', () => { deal(); render(); });
  on('gEvery', 'onchange', (e) => { S.game.every = Number(e.target.value); save(); });
  on('gSet', 'onclick', openGameSettings);
  $app.querySelectorAll('[data-lock]').forEach((b) => (b.onclick = () => { const k = b.dataset.lock; S.game.locks[k] = !S.game.locks[k]; save(); render(); }));
  // numbers
  on('nNew', 'onclick', () => { newLine(); changed(); render(); });
  on('nLess', 'onclick', () => { S.num.len = Math.max(2, S.num.len - 1); newLine(); changed(); render(); });
  on('nMore', 'onclick', () => { S.num.len = Math.min(16, S.num.len + 1); newLine(); changed(); render(); });
  on('nTop', 'onchange', (e) => { S.num.top = Number(e.target.value); newLine(); changed(); render(); });
  on('nStyle', 'onchange', (e) => { S.num.style = e.target.value; newLine(); changed(); render(); });
  on('nPool', 'onchange', (e) => { S.num.pool = e.target.value; save(); render(); });
  const flickScale = (d) => {
    const pool = S.num.pool === 'group' ? GROUPS[groupOf(S.scale)][1] : S.num.pool === '7' ? ORDER.filter((id) => sizeOf(id) === 7) : ORDER;
    const i = pool.indexOf(S.scale);
    S.scale = pool[i < 0 ? 0 : (i + d + pool.length) % pool.length];
    redo();
  };
  on('nPrev', 'onclick', () => flickScale(-1));
  on('nNext', 'onclick', () => flickScale(1));
  on('nHint', 'onclick', () => { S.num.hint = !S.num.hint; save(); render(); });
}

// ---------- sheets: tips and game settings ----------
function sheet(title, html, onBind) {
  const el = document.createElement('div');
  el.className = 'sheet';
  el.innerHTML = `<div class="sheetin"><div class="sh"><b>${esc(title)}</b><button class="x" aria-label="Close">✕</button></div><div class="sb">${html}</div></div>`;
  document.body.appendChild(el);
  const close = () => { el.remove(); render(); };
  el.querySelector('.x').onclick = close;
  el.onclick = (e) => { if (e.target === el) close(); };
  if (onBind) onBind(el, close);
}
function openTips() {
  const t = TIPS[S.scale] || {}, sc = BY[S.scale];
  const list = practicesFor(S.scale).filter((p) => isBest(S.scale, p.id));
  sheet(titleOf(), `
    ${formula()}
    <p class="feel">${esc(sc.feel)}</p>
    ${t.over ? `<h3>Play it over</h3><p>${esc(t.over)}</p>` : ''}
    ${t.colour ? `<h3>Its colour notes</h3><p>${t.colour.map((c) => `<span class="cn">${esc(T.prettyIv(c))}</span> ${esc(noteOf(c))}`).join(' &nbsp; ')}. Lean on them: they’re what makes it this scale. Green on the neck.</p>` : ''}
    ${t.think ? `<h3>Find it</h3><p>${esc(t.think)}</p>` : ''}
    ${t.tips ? `<h3>How to practise it</h3><ul>${t.tips.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}
    ${list.length ? `<h3>Best drills for it</h3><div class="chips">${list.map((p) => `<button data-go="${p.id}">★ ${esc(p.name)}</button>`).join('')}</div>` : ''}
  `, (el, close) => el.querySelectorAll('[data-go]').forEach((b) => (b.onclick = () => { S.prac = b.dataset.go; seed = Math.random(); save(); load(); changed(); close(); })));
}
function openHelp() {
  const row = (t, d) => `<h3>${esc(t)}</h3><p>${d}</p>`;
  sheet('What everything does', `
    ${row('The neck', 'The scale in the area you picked. Big dots are the notes to play; the faint dots are the same scale elsewhere on the neck. Ringed dots are the roots. Colours: <b style="color:var(--amber)">root</b>, <b style="color:var(--cyan)">3rd</b>, <b style="color:var(--bone)">5th</b>, <b style="color:var(--rose)">7th</b>, <b style="color:var(--green)">the scale’s colour notes</b>, <b style="color:var(--violet)">the rest</b>.')}
    ${row('The row of coloured boxes', 'The scale’s formula: each degree (big) with its note in this key (small). G Dorian is 1 2 ♭3 4 5 6 ♭7, which is G A B♭ C D E F.')}
    ${row('Where', 'One CAGED shape: the five-fret area round one of the five chord shapes, so the CAGED letter just tells you where the roots sit. Two shapes joined: two neighbouring areas as one. 3 notes per string: seven long diagonal patterns, one from each note. Whole neck: everything. Zoom fills the screen with the area.')}
    ${row('The drill', 'A way of playing through the scale in that area: what to do, an example starting from the root (degrees, with the notes in this key under them; · separates one group from the next), and why it’s worth doing. ★ marks the drills that suit this scale best. ◀ ▶ step through every drill for the scale.')}
    ${row('Start', 'Starts the metronome (after one bar of count-in). With Play notes on, the app also plays the drill in time and lights each note on the neck, so you can hear and see it before you play along. Turn Play notes off to play it yourself to the click.')}
    ${row('8ths / Triplets / 16ths', 'How many notes per click: one note per subdivision.')}
    ${row('Drone', 'A low held note on the key’s root (and its 5th if the scale has one), so you hear every note against home.')}
    ${row('Show', 'What the dots say: intervals, note names, plain dots, roots only, or nothing (test yourself). Hold Peek to look.')}
    ${row('Chords', 'One chord in one key, practised in the usual order of priority: the arpeggio through the shape, the arpeggio from every chord tone (3rd and 7th starts first), then shell voicings, drop 2 and drop 3 (for a triad: triad inversions on each string set, then the CAGED forms). Extras come after. Voicing workouts show one grip at a time: step through them with ◀ ▶, or press Start for one grip per bar.')}
    ${row('Game', 'Deals a random scale, key, area and drill. Hold keeps one of them the same on the next deal. New deal can come every few bars while the metronome runs. Game settings choose what gets dealt.')}
    ${row('Numbers', 'A line of scale degrees to play in order, e.g. 1 3 5 9 7 4. 8 and above are an octave up (9 is the 2nd an octave higher). The line stays put while ◀ ▶ change the scale, so the same shape of melody comes out in each scale. A crossed-out number isn’t in that scale: skip it. Show the line numbers its notes on the neck in order.')}
    ${row('Tips', 'For this scale: what to play it over, its colour notes, how to find it, how to practise it, and its best drills.')}
  `);
}
function openGameSettings() {
  const g = S.game;
  const keyName = (i) => T.noteName(spell(i, 'ionian'), true);
  const chips = (name, items, sel) => `<div class="chips">${items.map(([v, l]) => `<button data-set="${name}" data-v="${v}" class="${sel.includes(v) ? 'on' : ''}">${esc(l)}</button>`).join('')}</div>`;
  const body = () => `
    <h3>Scales</h3>${chips('groups', GROUPS.map(([gname], i) => [i, gname]), g.groups)}
    <h3>Where on the neck</h3>${chips('areas', AREAS, g.areas)}
    <h3>Keys</h3>${chips('keys', Array.from({ length: 12 }, (_, i) => [i, keyName(i)]), g.keys)}
    <div class="chips"><button data-keys="all">All 12</button><button data-keys="common">Common (C G D A E F B♭ E♭)</button><button data-keys="flat">Flat keys</button></div>
    <h3>Kinds of practice</h3>${chips('cats', CATS, g.cats)}
    <p class="small">Runs: up and down, root to root, start anywhere, string skipping. Sequences: groups of 3 and 4, 3rds, 4ths, 6ths, 1‑2‑3‑5, pedal. Arpeggios: its chord, triads and 7ths on every note, extended, °7s. Vocabulary: run into chord tones, enclosures, hidden pentatonics, diminished cells, bebop descents.</p>
    <h3>Twists</h3><div class="chips"><button data-twist="1" class="${g.twist ? 'on' : ''}">Add a twist to each deal (triplets, legato, say the degrees…)</button></div>`;
  sheet('Game settings', body(), (el) => {
    const rebind = () => {
      el.querySelectorAll('[data-set]').forEach((b) => (b.onclick = () => {
        const k = b.dataset.set, v = k === 'areas' || k === 'cats' ? b.dataset.v : Number(b.dataset.v);
        const arr = g[k];
        if (arr.includes(v)) { if (arr.length > 1) arr.splice(arr.indexOf(v), 1); } else arr.push(v);
        save(); el.querySelector('.sb').innerHTML = body(); rebind();
      }));
      el.querySelectorAll('[data-keys]').forEach((b) => (b.onclick = () => {
        g.keys = { all: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], common: [0, 7, 2, 9, 4, 5, 10, 3], flat: [5, 10, 3, 8, 1] }[b.dataset.keys];
        save(); el.querySelector('.sb').innerHTML = body(); rebind();
      }));
      el.querySelector('[data-twist]').onclick = () => { g.twist = !g.twist; if (!g.twist) twist = null; save(); el.querySelector('.sb').innerHTML = body(); rebind(); };
    };
    rebind();
  });
}

// ---------- start ----------
load();
if (S.mode === 'game' && S.game.twist) twist = pick(TWISTS);
render();
let lastV = upright();
window.addEventListener('resize', () => { if (upright() !== lastV) { lastV = upright(); render(); } });
document.addEventListener('visibilitychange', () => {
  if (document.hidden) { stopRun(); if (droneAt != null) { A.stopDrone(); droneAt = null; } render(); }
});
// the drone needs a tap to start on iOS: pick it up again on the first touch after reopening
document.addEventListener('pointerdown', () => { if (S.drone && droneAt == null) syncDrone(); }, { capture: true });

if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
// stay current: if the site has a newer build than this one, drop the offline copy and reload (once per build)
async function checkUpdate() {
  try {
    const r = await fetch(`driller-version.json?t=${Date.now()}`, { cache: 'no-store' });
    const { v } = await r.json();
    if (!v || v === BUILD || sessionStorage.getItem('driller.reloaded') === v) return;
    sessionStorage.setItem('driller.reloaded', v);
    if (window.caches) for (const k of await caches.keys()) await caches.delete(k);
    const regs = (await navigator.serviceWorker?.getRegistrations?.()) || [];
    for (const reg of regs) await reg.update().catch(() => {});
    location.reload();
  } catch (e) { /* offline: carry on with this build */ }
}
checkUpdate();
document.addEventListener('visibilitychange', () => { if (!document.hidden) checkUpdate(); });
