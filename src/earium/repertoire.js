// Tunes: what to have memorised, and tests. Standards (jazz, rung by rung, and great songs across genres, each with
// its changes in any key, the original key marked, a few words and a record to learn the melody from), Progressions
// (a short list worth knowing cold, with songs that use them), and Test: name as many major (then minor) progressions
// as you can by tapping their chords; or give a standard's chords, as numbers or (harder) in a random key.
// Just chords and numerals: no fingerings and no sound but a metronome.
import * as T from '../theory.js';
import * as A from '../audio.js';
import * as L from '../caged/library.js';
import * as H from '../caged/harmony.js';
import { explodeSteps } from './reharm.js';
import { RUNGS, PRACTICE_ORDER, ROTATION } from './standards.js';
import { SONG_GROUPS } from './songs.js';
import { PROG_GROUPS, PROGS } from './progs.js';

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const fmt = (s) => esc(T.pretty(String(s ?? '')));
const KEYS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
const MKEYS = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'G#', 'A', 'Bb', 'B'];
const pcOf = (k) => T.notePc(T.parseNote(k));
const keyName = (pc, minor) => (minor ? MKEYS : KEYS)[pc];
const semi = (iv) => T.intervalSemis(iv) % 12;
const libBy = (name) => L.ALL.find((p) => p.name === name);
const SETS = { jazz: RUNGS, songs: SONG_GROUPS };
function tuneAt(id) { const [g, i] = id.split(':'); for (const set of Object.values(SETS)) { const grp = set.find((r) => r.id === g); if (grp) return grp.tunes[Number(i)]; } return null; }
function itemOfTune(t) {
  if (t.lib) { const p = libBy(t.lib); return p ? { ...p, minor: t.minor ?? p.minor } : null; }
  return t.chart ? { chart: t.chart, key: t.key, minor: !!t.minor } : null;
}
const homeKey = (item, t) => (item?.key || t?.key || 'C');

// ---------- a chord's identity: its family (major, dominant, minor, half-diminished, diminished, sus, augmented) ----------
export function famOf(q) {
  const ivs = T.getChord(q).ivs, has = (x) => ivs.includes(x);
  if (has('b3') && has('b5')) return has('b7') ? 'hd' : 'dim';
  if (has('b3')) return 'min';
  if (has('3') && has('b7')) return 'dom';
  if (has('3') && has('#5')) return 'aug';
  if (has('3')) return 'maj';
  return 'sus';
}
const FAM_SYM = { maj: '△', dom: '7', min: 'm', hd: 'ø', dim: '°', sus: 'sus', aug: '+' };
const DEG = ['1', '♭2', '2', '♭3', '3', '4', '♯4', '5', '♭6', '6', '♭7', '7'];
const ROMAN = ['I', '♭II', 'II', '♭III', 'III', 'IV', '♯IV', 'V', '♭VI', 'VI', '♭VII', 'VII'];
const NOTE = ['C', 'D♭', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'A♭', 'A', 'B♭', 'B'];
// a numeral as it's said for a progression: case for major/minor, ° for (half-)diminished, + for augmented
function romanId(iv, q) {
  const f = famOf(q), s = semi(iv);
  let r = ROMAN[s];
  if (f === 'min' || f === 'hd' || f === 'dim') r = r.replace(/[IV]+/, (x) => x.toLowerCase());
  if (f === 'dim' || f === 'hd') { if (s === 6) r = '♯iv'; if (s === 1) r = '♯i'; }
  return r + (f === 'hd' || f === 'dim' ? '°' : f === 'aug' ? '+' : '');
}
// the easy test: numerals with the chord's name in the key
const EASY = {
  major: [['In the key', [[0, 'maj'], [2, 'min'], [4, 'min'], [5, 'maj'], [7, 'dom'], [9, 'min'], [11, 'hd']]],
    ['Common outside the key', [[7, 'maj'], [0, 'dom'], [2, 'dom'], [4, 'dom'], [9, 'dom'], [11, 'dom'], [5, 'min'], [5, 'dom'], [10, 'maj'], [10, 'dom'], [8, 'maj'], [8, 'dom'], [3, 'maj'], [1, 'dom'], [2, 'hd'], [1, 'dim'], [6, 'dim'], [6, 'hd']]]],
  minor: [['In the key', [[0, 'min'], [2, 'hd'], [3, 'maj'], [5, 'min'], [7, 'min'], [8, 'maj'], [10, 'maj']]],
    ['Common outside the key', [[7, 'dom'], [7, 'maj'], [5, 'dom'], [5, 'maj'], [2, 'min'], [11, 'dim'], [10, 'dom'], [8, 'dom'], [3, 'dom'], [1, 'maj'], [0, 'maj'], [0, 'dom'], [2, 'dom'], [9, 'hd']]]],
};
const romanOf = (s, f) => { let r = (s === 1 && f === 'dim') ? '♯I' : ROMAN[s]; if (f === 'min' || f === 'hd' || f === 'dim') r = r.replace(/[IV]+/, (x) => x.toLowerCase()); return r + ({ dom: '7', hd: 'ø', dim: '°', aug: '+', sus: 'sus' }[f] || ''); };
const IVN = ['1', 'b2', '2', 'b3', '3', '4', '#4', '5', 'b6', '6', 'b7', '7'];
const nameIn = (keyNote, s, f) => T.noteName(T.transpose(keyNote, s === 1 && f === 'dim' ? '#1' : IVN[s]), true) + ({ maj: '', dom: '7', min: 'm', hd: 'm7♭5', dim: '°', aug: '+', sus: 'sus' }[f]);
const collapse = (a) => a.filter((x, i) => i === 0 || x !== a[i - 1]);
const flat = (item) => L.resolve(item).flat();
export const progIds = (p) => collapse(flat(p).map((c) => romanId(c.iv, c.q)));
// longest common subsequence: which of the target's chords were given, in order
function lcs(a, b) {
  const n = a.length, m = b.length, d = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) d[i][j] = a[i] === b[j] ? d[i + 1][j + 1] + 1 : Math.max(d[i + 1][j], d[i][j + 1]);
  const hitA = new Set(), hitB = new Set();
  let i = 0, j = 0;
  while (i < n && j < m) { if (a[i] === b[j]) { hitA.add(i); hitB.add(j); i++; j++; } else if (d[i + 1][j] >= d[i][j + 1]) i++; else j++; }
  return { n: d[0][0], hitA, hitB };
}

// ---------- the progressions test: palettes of chords to tap ----------
export const PALETTE = {
  major: [['Diatonic', ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°']], ['Borrowed', ['iv', '♭VII', '♭VI', '♭III', '♭II', 'v', 'ii°']], ['Secondary and chromatic', ['II', 'III', 'VI', 'VII', '♯iv°', '♯i°']]],
  minor: [['Diatonic (natural minor)', ['i', 'ii°', '♭III', 'iv', 'v', '♭VI', '♭VII']], ['Raised and borrowed', ['V', 'IV', 'ii', 'vii°', '♭II', 'I']]],
};
const LABEL = {};
const testProgs = (kind) => PROGS.filter((p) => !!p.minor === (kind === 'minor'));
function matchProg(seq, kind) {
  const s = collapse(seq).join(' ');
  return testProgs(kind).find((p) => {
    const ids = progIds(p);
    if (ids.join(' ') === s) return true;
    if (p.loop) for (let r = 1; r < ids.length; r++) if ([...ids.slice(r), ...ids.slice(0, r)].join(' ') === s) return true;
    // a closed loop written with its tonic repeated at the end
    if (ids.length > 2 && ids[0] === ids[ids.length - 1] && ids.slice(0, -1).join(' ') === s) return true;
    return false;
  });
}

// a chart's chords in a key, bar by bar: { name, rn, say, beats }
function barsOf(item, keyPc, level = 0, seed = 1, bpb = 4) {
  const tonic = T.parseNote(keyName(keyPc, !!item.minor));
  let bars;
  if (level > 0 && bpb === 4) {
    const states = explodeSteps(item, seed, 5), st = states[Math.min(level, states.length - 1)];
    bars = []; let acc = 0, cur = [];
    for (const s of st.slots) { cur.push({ ...s.spec, beats: s.beats }); acc += s.beats; if (acc >= 3.999) { bars.push(cur); cur = []; acc = 0; } }
    if (cur.length) bars.push(cur);
  } else bars = L.resolve(item).map((b) => b.map((c) => ({ ...c, beats: bpb / b.length })));
  return bars.map((b) => b.map((c) => {
    const root = T.transpose(tonic, c.iv);
    const bass = c.bass && c.bass !== '1' ? `/${T.noteName(T.transpose(root, c.bass), true)}` : '';
    let rn = ''; try { rn = H.numeral(c.iv, c.q); } catch (e) { rn = ''; }
    return { name: T.chordSymbol(root, c.q) + bass, rn, say: DEG[semi(c.iv)], beats: c.beats };
  }));
}
const levelsOf = (item) => { try { return explodeSteps(item, 1, 5).length - 1; } catch (e) { return 0; } };

const GUIDE = `
<h3>How to memorise tunes and progressions</h3>
<p><b>Learn the root motion, not the grips.</b> A progression is its roots as numbers in the key: Autumn Leaves (from the relative major) is 2 5 1 4 7 3 6. That's true in every key. Grip-by-grip learning ties a tune to one key and one set of shapes; numbers move anywhere.</p>
<p><b>Know your keys on the neck first.</b> You can't find "the 4 chord" fast without seeing the key. Pick a CAGED area of the key and find every root of the progression there without moving the hand, then do it in each of the five areas.</p>
<p><b>Say it, write it, recite it.</b> Treat it like a phone number: write the numbers out 10–20 times, say them out loud away from the guitar, then play while you say each one as it comes ("two… five… one…"). Talking yourself through it is how you find chords in time instead of reciting grips.</p>
<p><b>Chunk tunes into keys, measured from home.</b> For tunes that modulate, name each key centre and the pattern inside it, and measure every new key from the tune's home key, not from the last chord. All the Things You Are: 6 2 5 1 4 at home; 2 5 1 a 3rd up; 6 2 5 1 4 a 5th up; 2 5 1 a 7th up; 2 5 1 a ♭6 up; then home. Blue Bossa: 6 2 7ø 3 6 in one key, then 2 5 1 a whole step down.</p>
<p><b>Name the common shapes.</b> Most tunes are made of a dozen moves: ii–V–I, minor ii–V–i, I–vi–ii–V, III7–VI7–II7–V7, IV–iv, the backdoor ♭VII7, tritone subs. Learn them as single words (the Progressions list) and a tune becomes a short sentence of them.</p>
<p><b>Know the form.</b> 12-bar blues, AABA 32, ABAC 32. Label the sections, then learn only what's different: most AABA tunes are one A and one bridge.</p>
<p><b>Test yourself; don't just reread.</b> Close the chart and play it or say it from memory, then check (the Test tab). Getting it back out is what makes it stick; looking at it again feels like learning but isn't.</p>
<p><b>Space it out.</b> A few minutes a day over many days beats an hour once. Come back to a tune the next day, then a few days later, then a week later; keep 4–6 in rotation.</p>
<p><b>Change the key.</b> Once it's in one key, play it in a second and a third. If you can only do it in one key, you've memorised grips, not the tune.</p>
<p><b>Hear it.</b> Learn the melody by ear from a record, sing the bass line (the roots) and the guide tones (3rds and 7ths). A tune you can sing, you can't forget.</p>`;

export const DEF_TP = { tab: 'tunes', set: 'jazz', key: 'orig', nums: true, say: true, bpm: 100, metro: false, open: null, level: 0, seed: 1, tkey: null };

export function repertoire(app, { S, save, back }) {
  const O = S.tp;
  const R = { timer: null, bar: -1, beat: -1, nextT: 0, bars: null, bpb: 4, test: null };
  const ctx = () => A.audioCtx();

  // ----- metronome (and, on a tune, the bar it's on) -----
  function stopMetro() { clearInterval(R.timer); R.timer = null; R.bar = -1; R.beat = -1; }
  async function startMetro() {
    stopMetro();
    await A.unlockAudio(); await A.ensureRunning();
    R.nextT = ctx().currentTime + 0.1;
    R.timer = setInterval(() => {
      while (R.nextT < ctx().currentTime + 0.12) {
        const t = R.nextT;
        R.beat = (R.beat + 1) % R.bpb;
        if (R.beat === 0) R.bar = R.bars ? (R.bar + 1) % R.bars.length : 0;
        A.click(t, R.beat === 0 ? 2 : 1);
        const bar = R.bar, beat = R.beat;
        setTimeout(() => showBeat(bar, beat), Math.max(0, (t - ctx().currentTime) * 1000));
        R.nextT += 60 / O.bpm;
      }
    }, 25);
  }
  function showBeat(bar, beat) {
    app.querySelectorAll('.tpdots i').forEach((d, i) => d.classList.toggle('on', i === beat));
    if (!R.bars) return;
    app.querySelectorAll('.tpbar.now').forEach((b) => b.classList.remove('now'));
    const el = app.querySelector(`.tpbar[data-bar="${bar}"]`);
    if (el) { el.classList.add('now'); if (beat === 0) { const r = el.getBoundingClientRect(); if (r.top < 120 || r.bottom > innerHeight - 20) el.scrollIntoView({ block: 'center', behavior: 'smooth' }); } }
  }

  // ----- pieces -----
  const metroBar = (bpb) => `<div class="tpmetro">
      <button class="tpm ${O.metro ? 'on' : ''}" data-t="metro">${O.metro ? '■' : '▶'} <small>metronome</small></button>
      <button data-t="bpm-">−</button><b>${O.bpm}</b><small>bpm</small><button data-t="bpm+">+</button>
      <span class="tpdots">${Array.from({ length: bpb }, (_, i) => `<i class="${i === 0 ? 'one' : ''}"></i>`).join('')}</span>
    </div>`;
  const toggles = () => `<div class="tptog"><button data-t="nums" class="${O.nums ? 'on' : ''}">Numerals</button><button data-t="say" class="${O.say ? 'on' : ''}">Say it</button></div>`;
  const chartHTML = (bars) => `<div class="tpchart">${bars.map((b, i) => `<div class="tpbar" data-bar="${i}">${b.map((c) => `<span class="tpc" style="flex:${c.beats}"><b>${fmt(c.name)}</b>${O.nums ? `<i>${fmt(c.rn)}</i>` : ''}</span>`).join('')}</div>`).join('')}</div>`;
  const sayLine = (bars) => `<p class="tpsay">${bars.map((b) => b.map((c) => c.say).join(' ')).join(' | ')}</p>`;
  function keySelect(home, minor, cur) {
    const hp = pcOf(home);
    return `<select class="sel tpkey" data-tsel="tkey">${KEYS.map((k, i) => `<option value="${i}" ${i === cur ? 'selected' : ''}>${fmt(keyName(i, minor))}${minor ? ' minor' : ''}${i === hp ? '  ★ original' : ''}</option>`).join('')}</select>`;
  }
  const tabs = () => `<div class="seg tptabs">${[['tunes', 'Standards'], ['progs', 'Progressions'], ['test', 'Test']].map(([v, l]) => `<button data-t="tab" data-v="${v}" class="${O.tab === v ? 'on' : ''}">${l}</button>`).join('')}</div>`;
  const setTabs = () => `<div class="seg tpsets">${[['jazz', 'Jazz'], ['songs', 'Everything else']].map(([v, l]) => `<button data-t="set" data-v="${v}" class="${O.set === v ? 'on' : ''}">${l}</button>`).join('')}</div>`;

  // ----- lists -----
  function listTunes() {
    const groups = SETS[O.set] || RUNGS;
    return setTabs() + groups.map((r) => `<section class="card tprung"><h3>${esc(r.name)}</h3>${r.blurb ? `<p class="hint">${fmt(r.blurb)}</p>` : ''}
      ${r.tunes.map((t, i) => { const it = itemOfTune(t), k = homeKey(it, t), mi = it?.minor ?? t.minor; return `<button class="tprow" data-open="${r.id}:${i}"><b>${esc(t.t)}</b><span>${esc(t.by)} · ${fmt(keyName(pcOf(k), mi))}${mi ? ' minor' : ''}${it ? '' : ' · no chart'}</span>${t.teaches ? `<small>${esc(t.teaches)}</small>` : ''}</button>`; }).join('')}
    </section>`).join('') + (O.set === 'jazz' ? `<section class="card"><h3>For each tune</h3><ol class="tpol">${PRACTICE_ORDER.map((p) => `<li>${esc(p)}</li>`).join('')}</ol><p class="hint">${esc(ROTATION)}</p></section>` : '');
  }
  function listProgs() {
    const kpc = O.key === 'orig' ? null : Number(O.key);
    const one = (p) => {
      const home = pcOf(p.key || 'C'), bars = barsOf(p, kpc ?? home);
      return `<div class="tpprog"><p class="tppn"><b>${fmt(p.name)}</b> <small>${fmt(keyName(kpc ?? home, p.minor))}${p.minor ? ' minor' : ''}${p.loop ? ' · loop' : ''}</small></p>
        <p class="tpline">${bars.map((b) => b.map((c) => `<b>${fmt(c.name)}</b>${O.nums ? `<i>${fmt(c.rn)}</i>` : ''}`).join(' ')).join('<span class="sep">|</span>')}</p>
        ${O.say ? sayLine(bars) : ''}<p class="hint">${fmt(p.note)}</p>${p.songs?.length ? `<p class="tpsongs">${p.songs.map((s) => `<span>${esc(s)}</span>`).join('')}</p>` : ''}</div>`;
    };
    return PROG_GROUPS.map((g) => `<section class="card"><h3>${esc(g.name)} <small class="tpcount">${g.items.length}</small></h3>${g.blurb ? `<p class="hint">${esc(g.blurb)}</p>` : ''}${g.items.map(one).join('')}</section>`).join('');
  }

  // ----- one tune -----
  function tuneHTML(t) {
    const it = itemOfTune(t), home = homeKey(it, t), minor = it?.minor ?? !!t.minor;
    const kpc = O.tkey == null ? pcOf(home) : O.tkey;
    R.bpb = t.beats || 4;
    const levels = it && R.bpb === 4 ? levelsOf(it) : 0;
    if (O.level > levels) O.level = levels;
    const bars = it ? barsOf(it, kpc, O.level, O.seed, R.bpb) : null;
    R.bars = bars;
    const listen = `https://www.youtube.com/results?search_query=${encodeURIComponent(`${t.t} ${(t.rec || t.by).split(/[;(]/)[0]}`)}`;
    return `<header class="bar"><button class="icon" data-t="close" aria-label="Back">‹</button><h2>${esc(t.t)}</h2><span></span></header>
      <p class="tpby">${esc(t.by)}${t.form ? ` · ${esc(t.form)}` : ''}</p>
      <div class="tpkeyrow">${keySelect(home, minor, kpc)}</div>
      ${metroBar(R.bpb)}
      ${bars ? `${toggles()}${chartHTML(bars)}${O.say ? sayLine(bars) : ''}
        ${levels ? `<div class="tpcx"><span>Complexity</span><button data-t="lv-">−</button><b>${O.level ? `${O.level} of ${levels}` : 'as written'}</b><button data-t="lv+">+</button>${O.level ? '<button data-t="seed">another version</button>' : ''}</div>` : ''}
        ${t.check ? '<p class="hint">A common version of the changes: check it against the record, since versions differ.</p>' : ''}`
        : '<p class="say tpnone">No chart here yet: learn the changes from a lead sheet and the record. The notes below say what to listen for.</p>'}
      <section class="card tpabout">
        ${t.teaches ? `<p><b>What it teaches:</b> ${fmt(t.teaches)}</p>` : ''}
        ${t.about ? `<p>${fmt(t.about)}</p>` : ''}
        ${t.rec ? `<p><b>Learn the melody from:</b> ${fmt(t.rec)}</p>` : ''}
        <p><a class="tplisten" href="${listen}" target="_blank" rel="noopener">▶ Listen to a recording</a></p>
        <p class="hint">No melody is played here: the tunes are under copyright, and learning it by ear from the record is the first step anyway.</p>
      </section>`;
  }

  // ----- tests -----
  function testMenu() {
    return `<section class="card"><h3>Progressions test</h3><p class="hint">Name as many progressions as you can remember: tap each one's chords, then Add. They pile up in a list, ticked when they match one of the ${PROGS.length} worth knowing. Do major, then minor.</p>
      <div class="tpbtns"><button class="play" data-t="ptest" data-v="major">Major</button><button class="play" data-t="ptest" data-v="minor">Minor</button></div></section>
      <section class="card"><h3>Standards test</h3><p class="hint">A tune comes up: give its chords, in order, without repeats. As numbers from the tonic first; with a random key and the actual chords later, which is harder.</p>
      <div class="tpbtns">${setTabs()}</div>
      <p class="tplbl">Easy: tap Roman numerals (the chords' names shown small)</p>
      <div class="tpbtns"><button class="play" data-t="stest" data-v="easy" data-k="major">Major keys</button><button class="play" data-t="stest" data-v="easy" data-k="minor">Minor keys</button></div>
      <div class="tptog"><button data-t="erand" class="${O.erand ? 'on' : ''}">${O.erand ? '✓ ' : ''}Random key</button><span class="hint">${O.erand ? 'Each tune in a new key: the numerals stay the same, the note names change, so you learn both.' : 'Each tune in its own key.'}</span></div>
      <p class="tplbl">Harder: build each chord from its root and quality</p>
      <div class="tpbtns"><button class="play" data-t="stest" data-v="nums">Numbers</button><button class="play" data-t="stest" data-v="keys">Random key</button></div></section>`;
  }
  // progressions: build, add, see what's remembered
  function ptestHTML() {
    const X = R.test, kind = X.kind, all = testProgs(kind);
    const got = new Set(X.list.filter((e) => e.match).map((e) => e.match.name));
    return `<header class="bar"><button class="icon" data-t="tclose" aria-label="Back">‹</button><h2>${kind === 'major' ? 'Major' : 'Minor'} progressions</h2><span></span></header>
      <p class="tpscore"><b>${got.size}</b> of ${all.length} remembered</p>
      <div class="tpentry">${X.cur.length ? X.cur.map((x) => `<b>${esc(LABEL[x] || x)}</b>`).join('<i>–</i>') : '<span class="faint">tap the chords of a progression…</span>'}</div>
      <div class="tpbtns"><button data-t="pback">⌫</button><button data-t="pclear">Clear</button><button class="on" data-t="padd">Add ↵</button></div>
      ${PALETTE[kind].map(([lbl, row]) => `<p class="tplbl">${esc(lbl)}</p><div class="tppal">${row.map((x) => `<button data-pal="${esc(x)}">${esc(LABEL[x] || x)}</button>`).join('')}</div>`).join('')}
      <p class="hint">7ths don’t matter here: V and V7 are the same answer. Loops can start on any of their chords.</p>
      <div class="tplist">${X.list.slice().reverse().map((e) => `<div class="${e.match ? 'ok' : 'no'}"><b>${e.seq.map((x) => esc(LABEL[x] || x)).join(' – ')}</b><span>${e.match ? `✓ ${fmt(e.match.name)}` : e.dup ? 'already in your list' : 'not one of the list (it may still be a good one)'}</span></div>`).join('')}</div>
      <div class="tpbtns"><button data-t="pdone">${X.done ? 'Hide the rest' : 'Don’t know: show the rest'}</button></div>
      ${X.done ? `<section class="card"><h3>Not yet named</h3>${all.filter((p) => !got.has(p.name)).map((p) => `<div class="tpprog"><p class="tppn"><b>${fmt(p.name)}</b></p><p class="tpline">${progIds(p).map((x) => `<b>${esc(LABEL[x] || x)}</b>`).join(' – ')}</p>${p.songs?.length ? `<p class="tpsongs">${p.songs.map((s) => `<span>${esc(s)}</span>`).join('')}</p>` : ''}</div>`).join('') || '<p>All of them. Well done.</p>'}</section>` : ''}`;
  }
  // standards: a tune comes up, give its chords
  function pickTune() {
    const pool = (SETS[R.test.set] || RUNGS).flatMap((g) => g.tunes.map((t, i) => ({ t, id: `${g.id}:${i}` }))).filter((x) => itemOfTune(x.t) && (R.test.mode !== 'easy' || !!itemOfTune(x.t).minor === (R.test.tonality === 'minor')));
    let x; do { x = pool[Math.floor(Math.random() * pool.length)]; } while (pool.length > 1 && x.id === R.test.last);
    const it = itemOfTune(x.t);
    const keyPc = R.test.mode === 'keys' || (R.test.mode === 'easy' && R.test.rand) ? Math.floor(Math.random() * 12) : pcOf(homeKey(it, x.t));
    const target = collapse(flat(it).map((c) => (R.test.mode === 'keys' ? `${(keyPc + semi(c.iv)) % 12}` : `${semi(c.iv)}`) + `:${famOf(c.q)}`));
    Object.assign(R.test, { last: x.id, tune: x.t, it, keyPc, target, cur: [], root: null, shown: null });
  }
  const idText = (id) => {
    const [r, f] = id.split(':');
    if (R.test.mode === 'easy') return `<b>${esc(romanOf(Number(r), f))}</b><small>${esc(nameIn(T.parseNote(keyName(R.test.keyPc, !!R.test.it.minor)), Number(r), f))}</small>`;
    return `<b>${R.test.mode === 'keys' ? NOTE[r] : DEG[r]}</b><i>${FAM_SYM[f]}</i>`;
  };
  function stestHTML() {
    const X = R.test, t = X.tune, minor = !!X.it.minor;
    const roots = X.mode === 'keys' ? NOTE : DEG;
    // the easy palette: the key's own chords, the usual ones from outside it, and any others this tune needs
    const easyRows = () => {
      const rows = EASY[X.tonality].map(([l, ids]) => [l, ids.map(([r, f]) => `${r}:${f}`)]);
      const have = new Set(rows.flatMap(([, ids]) => ids)), extra = [...new Set(X.target.filter((id) => !have.has(id)))].sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
      if (extra.length) rows.push(['Other chords', extra]);
      return rows;
    };
    let result = '';
    if (X.shown) {
      const m = lcs(X.target, X.cur);
      result = `<section class="card tpresult"><h3>${X.shown === 'check' ? `${m.n} of ${X.target.length} chords in order` : 'The changes'}</h3>
        <div class="tpans">${X.target.map((id, i) => `<span class="${X.shown === 'check' ? (m.hitA.has(i) ? 'ok' : 'no') : ''}">${idText(id)}</span>`).join('')}</div>
        ${X.shown === 'check' && X.cur.length ? `<p class="tplbl">Yours</p><div class="tpans">${X.cur.map((id, j) => `<span class="${m.hitB.has(j) ? 'ok' : 'no'}">${idText(id)}</span>`).join('')}</div>` : ''}
        ${chartHTML(barsOf(X.it, X.keyPc, 0, 1, t.beats || 4))}
        ${t.about ? `<p class="hint">${fmt(t.about)}</p>` : ''}
      </section>`;
    }
    return `<header class="bar"><button class="icon" data-t="tclose" aria-label="Back">‹</button><h2>Standards test</h2><span></span></header>
      <div class="tpq"><b>${esc(t.t)}</b><span>${esc(t.by)}${t.form ? ` · ${esc(t.form)}` : ''}</span>
      <em>${X.mode === 'keys' ? `In ${fmt(keyName(X.keyPc, minor))}${minor ? ' minor' : ''}: give the actual chords` : X.mode === 'easy' ? `In ${fmt(keyName(X.keyPc, minor))}${minor ? ' minor' : ''}: tap its chords as numerals` : `As numbers from the ${minor ? 'minor ' : ''}tonic`}</em></div>
      <div class="tpentry">${X.cur.length ? X.cur.map(idText).join('<i class="sep">·</i>') : `<span class="faint">${X.mode === 'easy' ? 'tap each chord in turn (no repeats)…' : 'a root, then its quality, for each chord in turn (no repeats)…'}</span>`}${X.root != null ? `<span class="tppend">${esc(roots[X.root])}…</span>` : ''}</div>
      ${X.mode === 'easy' ? easyRows().map(([l, ids]) => `<p class="tplbl">${esc(l)}</p><div class="tppal tpeasy">${ids.map((id) => `<button data-eid="${id}">${idText(id)}</button>`).join('')}</div>`).join('')
        : `<p class="tplbl">Root</p><div class="tppal tproots">${roots.map((r, i) => `<button data-root="${i}" class="${X.root === i ? 'on' : ''}">${esc(r)}</button>`).join('')}</div>
      <p class="tplbl">Quality</p><div class="tppal">${Object.entries(FAM_SYM).map(([f, s]) => `<button data-fam="${f}" ${X.root == null ? 'disabled' : ''}>${esc(s)}</button>`).join('')}</div>`}
      <div class="tpbtns"><button data-t="sback">⌫</button><button class="on" data-t="scheck">Check</button><button data-t="sdk">Don’t know</button><button data-t="snext">Next tune ›</button></div>
      ${result}`;
  }

  // ----- the screen -----
  function draw() {
    stopMetro(); O.metro = false;
    if (R.test?.kind) { app.innerHTML = ptestHTML(); return; }
    if (R.test?.mode) { app.innerHTML = stestHTML(); return; }
    if (O.open) { const t = tuneAt(O.open); if (t) { app.innerHTML = tuneHTML(t); return; } O.open = null; }
    R.bars = null; R.bpb = 4;
    app.innerHTML = `
    <header class="bar"><button class="icon" data-t="back" aria-label="Back">‹</button><h2>Tunes</h2><span></span></header>
    ${tabs()}
    ${O.tab === 'progs' ? `<div class="tpkeyrow"><select class="sel" data-tsel="key"><option value="orig" ${O.key === 'orig' ? 'selected' : ''}>Each in C (or C minor)</option>${KEYS.map((k, i) => `<option value="${i}" ${String(O.key) === String(i) ? 'selected' : ''}>All in ${fmt(k)}</option>`).join('')}</select><button class="tphow" data-t="how">How to memorise</button></div>${metroBar(4)}${toggles()}${listProgs()}`
      : O.tab === 'test' ? testMenu() : listTunes()}
    <div class="sheet tpsheet" id="tphow" hidden><button class="icon tpx" data-t="howx" aria-label="Close">✕</button>${GUIDE}</div>`;
  }
  app.onclick = async (e) => {
    const b = e.target.closest('button'); if (!b) return;
    const a = b.dataset.t;
    const y = window.scrollY, keep = () => { draw(); window.scrollTo(0, y); };
    if (b.dataset.open) { O.open = b.dataset.open; O.tkey = null; O.level = 0; O.seed = 1; save(); draw(); window.scrollTo(0, 0); return; }
    // the progressions test
    if (b.dataset.pal) { R.test.cur.push(b.dataset.pal); keep(); return; }
    // the standards test
    if (b.dataset.root) { R.test.root = Number(b.dataset.root); keep(); return; }
    if (b.dataset.eid) { R.test.cur.push(b.dataset.eid); keep(); return; }
    if (b.dataset.fam) { if (R.test.root == null) return; R.test.cur.push(`${R.test.root}:${b.dataset.fam}`); R.test.root = null; keep(); return; }
    if (!a) return;
    if (a === 'back') { stopMetro(); app.onclick = null; app.onchange = null; back(); return; }
    if (a === 'close') { const was = O.open; O.open = null; save(); draw(); const el = app.querySelector(`[data-open="${was}"]`); if (el) el.scrollIntoView({ block: 'center' }); return; }
    if (a === 'tab') { O.tab = b.dataset.v; save(); draw(); return; }
    if (a === 'set') { O.set = b.dataset.v; save(); keep(); return; }
    if (a === 'how') { const s = app.querySelector('#tphow'); s.hidden = false; s.scrollTop = 0; return; }
    if (a === 'howx') { app.querySelector('#tphow').hidden = true; return; }
    if (a === 'metro') { O.metro = !O.metro; if (O.metro) await startMetro(); else stopMetro(); b.classList.toggle('on', O.metro); b.innerHTML = `${O.metro ? '■' : '▶'} <small>metronome</small>`; if (!O.metro) app.querySelectorAll('.tpbar.now').forEach((x) => x.classList.remove('now')); return; }
    if (a === 'bpm-' || a === 'bpm+') { O.bpm = Math.max(40, Math.min(280, O.bpm + (a === 'bpm+' ? 4 : -4))); save(); b.parentElement.querySelector('b').textContent = O.bpm; return; }
    if (a === 'nums' || a === 'say') { O[a] = !O[a]; save(); keep(); return; }
    if (a === 'lv-' || a === 'lv+') { O.level = Math.max(0, O.level + (a === 'lv+' ? 1 : -1)); save(); keep(); return; }
    if (a === 'seed') { O.seed = (O.seed || 1) + 1; save(); keep(); return; }
    if (a === 'tclose') { R.test = null; draw(); window.scrollTo(0, 0); return; }
    if (a === 'ptest') { R.test = { kind: b.dataset.v, cur: [], list: [], done: false }; draw(); window.scrollTo(0, 0); return; }
    if (a === 'pback') { R.test.cur.pop(); keep(); return; }
    if (a === 'pclear') { R.test.cur = []; keep(); return; }
    if (a === 'padd') {
      const X = R.test; if (!X.cur.length) return;
      const match = matchProg(X.cur, X.kind) || null, dup = match && X.list.some((e) => e.match === match);
      X.list.push({ seq: X.cur, match: dup ? null : match, dup }); X.cur = []; keep(); return;
    }
    if (a === 'pdone') { R.test.done = !R.test.done; keep(); return; }
    if (a === 'erand') { O.erand = !O.erand; save(); keep(); return; }
    if (a === 'stest') { R.test = { mode: b.dataset.v, set: O.set, tonality: b.dataset.k || null, rand: !!O.erand }; pickTune(); draw(); window.scrollTo(0, 0); return; }
    if (a === 'sback') { if (R.test.root != null) R.test.root = null; else R.test.cur.pop(); keep(); return; }
    if (a === 'scheck') { R.test.shown = 'check'; keep(); return; }
    if (a === 'sdk') { R.test.shown = 'reveal'; keep(); return; }
    if (a === 'snext') { pickTune(); draw(); window.scrollTo(0, 0); }
  };
  app.onchange = (e) => {
    const k = e.target.dataset.tsel; if (!k) return;
    O[k] = k === 'tkey' ? Number(e.target.value) : e.target.value; save();
    const y = window.scrollY; draw(); window.scrollTo(0, y);
  };
  draw();
  window.scrollTo(0, 0);
}
