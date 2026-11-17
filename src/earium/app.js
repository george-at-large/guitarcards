// Earium: listen into the intervals. Two modes: Guided (a voice builds chords note by note and morphs them,
// naming everything you hear, sometimes asking you to hear it first) and Ambient (chords drift and morph through
// progressions, with optional narration). A vertical neck shows where every note is.
import * as A from '../audio.js';
import * as V from '../caged/voice.js';
import * as T from '../theory.js';
import * as E from './engine.js';
import * as H from './harm.js';
import { neckSVG } from './neck.js';
import { guided, LESSONS } from './guided.js';
import { ambient, PROGRESSIONS, LEVEL_NAMES, GROUPS, details } from './ambient.js';
import { degText } from './words.js';
import { PACKS as ALL_PACKS, GROUPS as ALL_GROUPS } from './packs.js';
import { TIERS } from './reharm.js';
import { inversions, QUALITIES, SETS as INV_SETS, INV_NAMES } from './inversions.js';
import { rhythm, SETS as R_SETS, inSet } from './rhythm.js';
import { gridSVG, circleSVG } from './rview.js';
import { exploder } from './exploder.js';
import * as TGB from './tgbook.js';

const $ = (s) => document.querySelector(s);
const app = $('#earium');
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const fmt = (s) => esc(T.pretty(String(s ?? '')));
const ROOTS = ['C', 'D♭', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'A♭', 'A', 'B♭', 'B'];

const DEF = {
  inst: 'guitar', space: 0.55, vvol: 0.7,
  g: { lesson: 'build', level: 2, maxNotes: 4, bass: 'root', prompts: 'off', voice: 'rich', pace: 8, root: 'random', vlSource: 'pack:voicelead', vlVoices: 4, vlBass: 'root', vlMoves: 'one', vlFollow: 'all' },
  i: { root: 'C', q: 'maj', set: 'any', move: 'bounce', pace: 5, arp: false, voice: true, bassSay: false },
  r: { set: 'core', bpm: 72, loops: 4, count: true, voice: true, view: 'auto' },
  x: { prog: null, key: 'C', version: 1, level: 4, explain: true, bpm: 72, shape: 'auto', tour: false, vl: 'off' },
  a: { src: 'packs', pack: 'all', loops: 2, shape: 'auto', prog: 'major-ii-v-i', level: 2, key: 'random', minor: false, secs: 12, motion: 'gentle', far: 3, narr: 'on', theory: 1, extTalk: 'off', extLater: false, arp: 'off', modeSay: false, feel: 'off', spotlight: false, tension: false, tgv: false, more: false },
};
let S;
try { S = JSON.parse(localStorage.getItem('earium') || 'null'); } catch (e) { S = null; }
S = { ...DEF, ...(S || {}), g: { ...DEF.g, ...(S?.g || {}) }, a: { ...DEF.a, ...(S?.a || {}) }, i: { ...DEF.i, ...(S?.i || {}) }, r: { ...DEF.r, ...(S?.r || {}) }, x: { ...DEF.x, ...(S?.x || {}) } };
if (S.a.narr !== 'off') S.a.narr = 'on'; // older settings: Describe / Chords only
const save = () => { try { localStorage.setItem('earium', JSON.stringify(S)); } catch (e) { /* */ } };

let run = null, voices = null, lock = null, view = 'home';

// ---------- small pieces ----------
const seg = (path, opts, cur) => `<div class="seg">${opts.map(([v, l]) => `<button data-set="${path}" data-v="${esc(v)}" class="${String(cur) === String(v) ? 'on' : ''}">${l}</button>`).join('')}</div>`;
const row = (label, body, note = '') => `<div class="row"><label>${label}</label>${body}${note ? `<p class="hint">${note}</p>` : ''}</div>`;
const slider = (path, min, max, step, val, show) => `<div class="slide"><input type="range" data-set="${path}" min="${min}" max="${max}" step="${step}" value="${val}"><output>${show}</output></div>`;
const get = (path) => path.split('.').reduce((o, k) => o[k], S);
function put(path, v) { const ks = path.split('.'), last = ks.pop(); const o = ks.reduce((x, k) => x[k], S); o[last] = typeof o[last] === 'number' ? Number(v) : typeof o[last] === 'boolean' ? v === 'true' : v; save(); }

function sound() {
  return `<section class="card sound">
    <h3>Sound</h3>
    <div class="insts">${E.INSTRUMENTS.map((i) => `<button data-set="inst" data-v="${i.id}" class="inst ${S.inst === i.id ? 'on' : ''}"><b>${i.name}</b><small>${i.blurb}</small></button>`).join('')}</div>
    ${row('Space', slider('space', 0, 1, 0.05, S.space, S.space < 0.3 ? 'close' : S.space < 0.7 ? 'hall' : 'cathedral'))}
    ${row('Voice volume', slider('vvol', 0.1, 1, 0.05, S.vvol, Math.round(S.vvol * 100) + '%'))}
  </section>`;
}

// ---------- home ----------
function home() {
  view = 'home';
  app.innerHTML = `
  <header class="hero"><h1>Earium</h1><p>Listen into the intervals.</p></header>
  <button class="mode" data-go="g"><span class="glyph">◐</span><span><b>Guided</b><small>A voice builds chords note by note and morphs them, naming everything you hear. It can ask you to hear the next note first.</small></span></button>
  <button class="mode" data-go="a"><span class="glyph">◌</span><span><b>Ambient</b><small>Rich chords drift and morph through progressions. A voice can name them, or tell you what they're doing.</small></span></button>
  <button class="mode" data-go="x"><span class="glyph">✺</span><span><b>Exploder</b><small>Any progression, and a slider from plain to fully exploded: passing chords, borrowed chords, subs. Tap a chord to see every way to play it.</small></span></button>
  <button class="mode" data-go="i"><span class="glyph">◇</span><span><b>Inversions</b><small>One chord in one key, bouncing around its inversions, on one string set or the whole neck.</small></span></button>
  <button class="mode" data-go="r"><span class="glyph">◷</span><span><b>Rhythm</b><small>Strums and rhythms from around the world, built up a layer at a time and described, on a grid or a circle.</small></span></button>
  ${sound()}
  <section class="card tgcard"><h3>Ted Greene (private)</h3>${TGB.ready() ? `<p class="hint">Your copy of <i>Modern Chord Progressions</i> is on this device (${TGB.from() === 'files' ? 'from the book file on this Mac' : 'from the imported pack'}): his progressions are in the Exploder, his grips in the Exploder, Inversions and Ambient. It never leaves this device.</p>` : `<p class="hint">Import your private pack (<b>tedgreene-pack.json</b>, from the <i>private</i> folder on your Mac; AirDrop it to the phone) to add his progressions and grips. It stays on this device, never uploaded.</p>`}<label class="chip filechip">${TGB.ready() ? 'Update the pack' : 'Import the pack'}<input type="file" id="tgpack" accept=".json,application/json" hidden></label><p class="hint" id="tgmsg"></p></section>
  <p class="foot">Use headphones. The neck shows where each note lives; it isn't always a grip you'd play.</p>`;
}

// ---------- setup ----------
function setupG() {
  view = 'g';
  const g = S.g, lv = H.LEVELS[g.level - 1];
  app.innerHTML = `
  <header class="bar"><button class="icon" data-go="home" aria-label="Back">‹</button><h2>Guided</h2><span></span></header>
  <section class="card">
    ${row('Lesson', seg('g.lesson', LESSONS.map((l) => [l.id, l.name]), g.lesson), LESSONS.find((l) => l.id === g.lesson).blurb)}
    ${g.lesson === 'voicelead' ? vlRows(g) : row('Colours', slider('g.level', 1, 5, 1, g.level, lv.name), lv.blurb)}
    ${g.lesson === 'build' && g.lesson !== 'voicelead' ? row('Up to', seg('g.maxNotes', [3, 4, 5, 6, 7].map((n) => [n, `${n} notes`]), g.maxNotes)) : ''}
    ${g.lesson !== 'intervals' && g.lesson !== 'voicelead' ? row('Bass', seg('g.bass', [['root', 'Root lowest'], ['inv', 'Inversions']], g.bass)) : ''}
    ${row('Ask me', seg('g.prompts', [['off', 'Never'], ['imagine', 'Imagine it'], ['quiz', 'Name it'], ['mix', 'Both']], g.prompts),
    g.prompts === 'imagine' ? 'Now and then you’ll be told which note is coming, and given time to hear it in your head before it sounds.' : g.prompts === 'quiz' ? 'Now and then a note comes in unnamed: name it (tap, or just say it), then you’re told.' : g.prompts === 'mix' ? 'Sometimes imagine it first, sometimes name it.' : 'Everything is named as it happens.')}
    ${row('Voice', seg('g.voice', [['rich', 'Full'], ['minimal', 'Just names'], ['off', 'Off']], g.voice), g.voice === 'rich' ? 'Each note’s name and its character, and the chord’s name.' : g.voice === 'minimal' ? 'The note and the chord, nothing more.' : 'Silent: everything is still written on screen.')}
    ${row('Pace', slider('g.pace', 4, 24, 1, g.pace, `${g.pace} s`), 'How long each sound rings before the next change.')}
    ${row('Root', `<select data-set="g.root" class="sel"><option value="random" ${g.root === 'random' ? 'selected' : ''}>Changes now and then</option>${ROOTS.map((r, i) => `<option value="${i}" ${String(g.root) === String(i) ? 'selected' : ''}>${r}</option>`).join('')}</select>`)}
  </section>
  ${sound()}
  <button class="play" data-play="g">Begin</button>`;
}
// Voice leading's settings: which progression (or a whole pack), how many voices, the bass, how the voices move
function vlRows(g) {
  const opts = ALL_GROUPS.map((gr) => `<optgroup label="${esc(gr.name)}">${gr.packs.map((p) => {
    const pk = ALL_PACKS.find((x) => x.id === p.id); if (!pk) return '';
    return `<option value="pack:${pk.id}" ${g.vlSource === `pack:${pk.id}` ? 'selected' : ''}>All of: ${fmt(pk.name)}</option>${pk.items.map((it) => `<option value="item:${it.id}" ${g.vlSource === `item:${it.id}` ? 'selected' : ''}>  ${fmt(it.name)}</option>`).join('')}`;
  }).join('')}</optgroup>`).join('');
  const n = Number(g.vlVoices), names = n === 4 ? ['Bass', 'Tenor', 'Alto', 'Soprano'] : ['Bass', 'Middle', 'Top'];
  if (g.vlFollow !== 'all' && Number(g.vlFollow) >= n) g.vlFollow = 'all';
  return row('Progression', `<select data-set="g.vlSource" class="sel">${opts}</select>`, 'One progression, or a whole pack in turn.')
    + row('Voices', seg('g.vlVoices', [[3, 'Three'], [4, 'Four']], n))
    + row('Bass', seg('g.vlBass', [['root', 'Root in the bass'], ['free', 'Inversions allowed']], g.vlBass), g.vlBass === 'free' ? 'The bass moves smoothly too: the smoothest voice leading of all.' : 'The bass plays each chord’s root (or the bass written); the upper voices do the leading.')
    + row('Moves', seg('g.vlMoves', [['one', 'One at a time'], ['together', 'Together']], g.vlMoves), g.vlMoves === 'one' ? 'Each voice moves on its own, the smallest move first, and is named.' : 'All voices move at once; the moves that matter are named.')
    + row('Follow', seg('g.vlFollow', [['all', 'All'], ...names.map((nm, i) => [i, nm])], g.vlFollow), g.vlFollow === 'all' ? '' : 'The other voices move quietly together; this one moves on its own, louder, and is named.');
}
const VCOL = { 4: ['var(--t3)', 'var(--t5)', 'var(--t7)', 'var(--gold)'], 3: ['var(--t3)', 'var(--t5)', 'var(--gold)'] };
// the voice map: one line per voice through the progression
function vmapSVG(st) {
  const { path, chords, k, n, follow } = st;
  const W = 230, H = 150, x = (i) => 10 + (i * (W - 20)) / Math.max(1, path.length - 1);
  const lo = Math.min(...path.flatMap((v) => v.midis)) - 2, hi = Math.max(...path.flatMap((v) => v.midis)) + 2;
  const y = (m) => 8 + ((hi - m) / (hi - lo)) * (H - 30);
  const parts = [`<rect x="${x(k) - 8}" y="2" width="16" height="${H - 18}" rx="5" class="vnow"/>`];
  for (let v = 0; v < n; v++) {
    const dim = follow != null && v !== follow;
    parts.push(`<polyline points="${path.map((p, i) => `${x(i)},${y(p.midis[v])}`).join(' ')}" style="stroke:${VCOL[n][v]};opacity:${dim ? 0.25 : 0.85};stroke-width:${follow === v ? 3 : 1.6}" class="vline"/>`);
    path.forEach((p, i) => parts.push(`<circle cx="${x(i)}" cy="${y(p.midis[v])}" r="${i === k ? 4.2 : 2.6}" style="fill:${VCOL[n][v]};opacity:${dim ? 0.3 : 1}"/>`));
  }
  chords.forEach((c, i) => parts.push(`<text x="${x(i)}" y="${H - 4}" class="vrn${i === k ? ' on' : ''}">${fmt(c.rn)}</text>`));
  return `<svg class="vmap" viewBox="0 0 ${W} ${H}">${parts.join('')}</svg>`;
}
function showVL(st) {
  $('#neck').innerHTML = neckSVG(st.neck);
  const c = st.chords[st.k];
  $('#chord').innerHTML = `<div class="rn">${fmt(c.rn)}</div><div class="sym">${fmt(c.name)}</div><div class="say">${esc(st.keyLabel)} · ${esc(st.item.name)}</div>`;
  const order = st.sounding.map((m, v) => ({ m, v, iv: st.ivs[v] })).sort((a, b) => b.m - a.m);
  $('#stack').innerHTML = `<ol>${order.map((o) => `<li class="${st.moving === o.v || (st.moved || []).includes(o.v) ? 'fresh' : ''}" style="color:${VCOL[st.n][o.v]}"><i></i><b>${degText(o.iv)}</b><span>${esc(st.vnames[o.v])}${st.follow === o.v ? ' ●' : ''}</span></li>`).join('')}</ol>${vmapSVG(st)}`;
  if (st.caption) $('#caption').innerHTML = st.caption.map((l) => `<p>${fmt(l)}</p>`).join('');
  const p = st.prompt;
  $('#prompt').innerHTML = p ? `<div class="prompt"><div class="ring" style="--secs:${p.secs}s"></div><p>${fmt(p.text)}</p></div>` : '';
}
function setupA() {
  view = 'a';
  const a = S.a;
  const packOpts = GROUPS.map((g) => `<optgroup label="${esc(g.name)}">${g.packs.map((p) => `<option value="${p.id}" ${p.id === a.pack ? 'selected' : ''}>${fmt(p.name)}</option>`).join('')}</optgroup>`).join('');
  const progs = PROGRESSIONS().map((g) => `<optgroup label="${esc(g.cat)}">${g.items.map((p) => `<option value="${p.id}" ${p.id === a.prog ? 'selected' : ''}>${esc(p.name)}</option>`).join('')}</optgroup>`).join('');
  app.innerHTML = `
  <header class="bar"><button class="icon" data-go="home" aria-label="Back">‹</button><h2>Ambient</h2><span></span></header>
  <section class="card">
    ${row('Music', seg('a.src', [['packs', 'Packs'], ['meander', 'Meander'], ['wander', 'Wandering'], ['prog', 'One progression']], a.src),
    a.src === 'packs' ? 'Progressions play one after another, each introduced by name with a line of theory.' : a.src === 'meander' ? 'One progression, as written, then altered a little more each time round, each change named. Then as written again, and a new path.' : a.src === 'wander' ? 'Endless phrases that move through the key and close with cadences; at higher complexity, borrowed chords, secondary dominants and new keys.' : '')}
    ${a.src === 'packs' ? row('Play', `<select data-set="a.pack" class="sel"><option value="all" ${a.pack === 'all' ? 'selected' : ''}>All packs, in turn</option><option value="random" ${a.pack === 'random' ? 'selected' : ''}>Random mix</option>${packOpts}</select>`) + row('Each progression', seg('a.loops', [1, 2, 3, 4].map((n) => [n, `${n}×`]), a.loops), 'How many times round before the next one.') : ''}
    ${a.src === 'prog' || a.src === 'meander' ? row('Progression', `<select data-set="a.prog" class="sel">${progs}</select>`) : ''}
    ${a.src === 'meander' ? row('How far', slider('a.far', 1, 5, 1, a.far, TIERS[a.far - 1].name), TIERS.slice(0, a.far).map((t) => t.blurb).join(' ')) + row('Each version', seg('a.loops', [1, 2, 3].map((n) => [n, `${n}×`]), a.loops), 'How many times round before the next change.') : ''}
    ${row('Complexity', slider('a.level', 1, 5, 1, a.level, LEVEL_NAMES[a.level - 1]), a.src === 'wander' ? ['Triads of the key.', 'Sevenths, add9s.', 'Borrowed chords, secondary dominants, 9ths.', 'Jazz: ii–Vs everywhere, tritone subs, 13ths, altered.', 'Far out: chromatic mediants, distant keys.'][a.level - 1] : ['Chords as written.', 'Chords as written.', 'Now and then a chord gets a colour (a 9th, a 13th…).', 'Most chords get colours.', 'Colours everywhere.'][a.level - 1])}
    ${row('Key', `<div class="keyrow"><select data-set="a.key" class="sel"><option value="random" ${a.key === 'random' ? 'selected' : ''}>Any, changing</option>${['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'].map((k) => `<option value="${k}" ${a.key === k ? 'selected' : ''}>${fmt(k)}</option>`).join('')}</select>${a.src === 'wander' ? seg('a.minor', [[false, 'Major'], [true, 'Minor']], a.minor) : ''}</div>`)}
    ${row('Each chord', slider('a.secs', 5, 30, 1, a.secs, `${a.secs} s`))}
    ${TGB.ready() ? row('Voicings', seg('a.tgv', [[false, 'Guitar grips'], [true, 'Ted Greene forms']], a.tgv), a.tgv ? 'Every chord in one of his grips from the book, moved to its root.' : '') : ''}
    ${row('Position', seg('a.shape', [['auto', 'Auto'], ['C', 'C'], ['A', 'A'], ['G', 'G'], ['E', 'E'], ['D', 'D']], a.shape), a.shape === 'auto' ? 'Grips anywhere on the neck, each one close to the last.' : `Every chord voiced inside the ${a.shape} shape of its key. Change it while playing, too.`)}
    ${row('Movement', seg('a.motion', [['still', 'Still'], ['gentle', 'Gentle'], ['flowing', 'Flowing']], a.motion), a.motion === 'still' ? 'Only the chord changes move.' : a.motion === 'gentle' ? 'The top voice wanders to another chord tone.' : 'Suspensions resolve and the top voice sings a little.')}
    ${row('Narration', seg('a.narr', [['on', 'On'], ['off', 'Off']], a.narr), a.narr === 'off' ? 'Silent: names and theory still shown on screen.' : 'Chord names, briefly. How much theory, and whether extensions are named, you set with the buttons while it plays.')}
  </section>
  ${sound()}
  <button class="play" data-play="a">Begin</button>`;
}

function setupI() {
  view = 'i';
  const o = S.i, size = ['maj7', '7', 'm7', 'm7b5', 'dim7', 'mMaj7', '6', 'm6'].includes(o.q) ? 4 : 3;
  if (o.set !== 'any' && o.set !== 'tg' && !INV_SETS[size].some(([id]) => id === o.set)) o.set = 'any';
  app.innerHTML = `
  <header class="bar"><button class="icon" data-go="home" aria-label="Back">‹</button><h2>Inversions</h2><span></span></header>
  <section class="card">
    ${row('Key', `<select data-set="i.root" class="sel">${['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'].map((k) => `<option value="${k}" ${o.root === k ? 'selected' : ''}>${fmt(k)}</option>`).join('')}</select>`)}
    ${row('Chord', `<select data-set="i.q" class="sel">${QUALITIES.map(([q, l]) => `<option value="${q}" ${o.q === q ? 'selected' : ''}>${esc(l)}</option>`).join('')}</select>`)}
    ${row('Strings', seg('i.set', [['any', 'Anywhere'], ...INV_SETS[size], ...(TGB.ready() ? [['tg', 'Ted Greene forms']] : [])], o.set), size === 4 ? 'Sevenths as drop 2 or drop 3 voicings, one note per string.' : 'Triads on three neighbouring strings, one note per string.')}
    ${row('Move', seg('i.move', [['bounce', 'Bounce'], ['up', 'Up the neck'], ['updown', 'Up and down']], o.move), o.move === 'bounce' ? 'Each time a different inversion, nearby.' : '')}
    ${row('Each voicing', slider('i.pace', 2, 12, 1, o.pace, `${o.pace} s`))}
    ${row('Play', seg('i.arp', [[false, 'Together'], [true, 'Arpeggio']], o.arp))}
    ${row('Voice', seg('i.voice', [[true, 'Names'], [false, 'Off']], o.voice) + (o.voice ? seg('i.bassSay', [[false, 'Inversion'], [true, '+ the bass']], o.bassSay) : ''))}
  </section>
  ${sound()}
  <button class="play" data-play="i">Begin</button>`;
}
function setupR() {
  view = 'r';
  const o = S.r;
  const pats = inSet(o.set);
  app.innerHTML = `
  <header class="bar"><button class="icon" data-go="home" aria-label="Back">‹</button><h2>Rhythm</h2><span></span></header>
  <section class="card">
    ${row('Set', seg('r.set', R_SETS.map(([v, l]) => [v, l]), o.set), R_SETS.find(([v]) => v === o.set)[2] + ` ${pats.length} rhythms.`)}
    ${row('Tempo', slider('r.bpm', 40, 140, 2, o.bpm, `${o.bpm} bpm`))}
    ${row('Each rhythm', seg('r.loops', [2, 4, 8].map((n) => [n, `${n}×`]), o.loops), 'How many times round, once it’s built, before the next.')}
    ${row('Count', seg('r.count', [[true, 'Aloud'], [false, 'Off']], o.count), '“One, ee, and, uh”: the voice counts the steps (just the beats when it’s fast).')}
    ${row('Voice', seg('r.voice', [[true, 'Describe'], [false, 'Off']], o.voice))}
  </section>
  <details class="card guide"><summary>Reading the strum grid</summary>
    <p><b>↓ ↑</b> a downstroke and an upstroke. The strumming hand swings like a pendulum the whole time: down on the beats, up between them.</p>
    <p><b class="faint">↓ ↑</b> faint arrows: the hand still moves, but misses the strings. Those gaps make the groove.</p>
    <p><b>✕</b> a chuck: the strings muted (the fretting hand relaxes, or the palm lands) and struck, a percussive click like a snare drum.</p>
    <p><b>B b</b> the thumb (or pick) on a bass note: the root, then the alternate bass.</p>
    <p><b>●</b> a hit (a finger pluck, a clave, a clap). Big for an accent, small for a soft one.</p>
    <p>The numbers on top are the count: <b>1 e & a</b> for sixteenths, <b>1 &</b> for eighths, <b>1 trip let</b> for triplets.</p>
  </details>
  ${sound()}
  <button class="play" data-play="r">Begin</button>`;
}

// ---------- the run screen ----------
function runScreenI() {
  view = 'run';
  app.innerHTML = `
  <header class="bar run"><button class="icon" data-act="stop" aria-label="Stop">✕</button><h2>Inversions</h2><button class="icon" data-act="pause" aria-label="Hold">❚❚</button></header>
  <main class="stage">
    <div class="neckcol" id="neck">${neckSVG([])}</div>
    <div class="info">
      <div class="chord" id="chord"><div class="sym">…</div></div>
      <div id="stack" class="stack"></div>
      <div id="caption" class="caption"></div>
    </div>
  </main>
  <div class="transport"><button data-act="iprev" aria-label="Previous voicing"><b>‹</b><small>back</small></button><button data-act="inext" aria-label="Next voicing"><b>›</b><small>next</small></button></div>
  <footer class="runbar"><button data-act="slower">−</button><span id="pace">${S.i.pace} s</span><button data-act="faster">+</button><span class="instname">${E.INSTRUMENTS.find((i) => i.id === S.inst).name}</span></footer>`;
}
function showI(v, prev, lines) {
  const root = T.parseNote(S.i.root);
  $('#neck').innerHTML = neckSVG(v.notes.map((n) => ({ ...n, label: degText(n.iv), kind: H.KIND(n.iv), fresh: !prev || !prev.notes.some((x) => x.midi === n.midi) })));
  const name = T.pretty(T.chordSymbol(root, S.i.q)).replace(/\s+/g, '');
  $('#chord').innerHTML = `<div class="rn">${esc(INV_NAMES[v.inv] ? INV_NAMES[v.inv][0].toUpperCase() + INV_NAMES[v.inv].slice(1) : '')}</div><div class="sym">${fmt(name)}${v.bass !== '1' ? `/${fmt(T.noteName(T.transpose(root, v.bass), true))}` : ''}</div><div class="say">${esc(v.bass === '1' ? 'the root in the bass' : `the ${degText(v.bass)} in the bass`)}</div>`;
  const notes = [...v.notes].sort((a, b) => b.midi - a.midi).map((n) => `<li class="k-${H.KIND(n.iv)}"><i></i><b>${degText(n.iv)}</b><span>${fmt(T.noteName(T.transpose(root, n.iv), true))} · string ${n.string}, fret ${n.fret}</span></li>`).join('');
  const set = (INV_SETS[v.notes.length] || []).find(([id]) => id === v.set);
  $('#stack').innerHTML = `<ol>${notes}</ol><div class="exl">${esc(set ? set[1] : '')}</div>`;
  $('#caption').innerHTML = lines.map((l) => `<p>${fmt(l)}</p>`).join('');
}
function runScreenR() {
  view = 'run';
  app.innerHTML = `
  <header class="bar run"><button class="icon" data-act="stop" aria-label="Stop">✕</button><h2>Rhythm</h2><button class="icon" data-act="pause" aria-label="Hold">❚❚</button></header>
  <div id="rhead" class="rhead"></div>
  <div id="rviz" class="rviz"></div>
  <div id="rcount" class="rcount"></div>
  <div id="caption" class="caption"></div>
  <div class="transport">
    <button data-act="rprev" aria-label="Previous rhythm"><b>⏮</b><small>rhythm</small></button>
    <button data-act="rview" aria-label="Grid or circle"><b>◐</b><small>view</small></button>
    <button data-act="rcount" aria-label="Count aloud"><b>1&amp;</b><small>count</small></button>
    <button data-act="rnext" aria-label="Next rhythm"><b>⏭</b><small>rhythm</small></button>
  </div>
  <footer class="runbar"><button data-act="slower">−</button><span id="pace">${S.r.bpm} bpm</span><button data-act="faster">+</button></footer>`;
}
let rPat = null, rLayers = null, rView = null;
const rUI = {
  pattern(p) {
    rPat = p; rLayers = null;
    rView = S.r.view === 'auto' ? p.view : S.r.view;
    const viz = $('#rviz'); if (viz) viz.innerHTML = (rView === 'circle' ? circleSVG : gridSVG)(p, p.layers, -1); // the whole pattern, before it starts
    $('#rhead').innerHTML = `<div class="pk">${esc(p.set === 'core' ? 'Core' : 'More')} · ${esc(p.kind === 'guitar' ? 'Guitar' : 'World')}${p.meter ? ` · ${esc(p.meter)}` : ''}</div><div class="pn">${esc(p.name)}</div><div class="pt">${esc(p.desc)}</div>`;
  },
  phase(p, ph) { if (ph.say) { const el = $('#caption'); if (el) el.innerHTML = `<p>${esc(ph.say)}</p>`; } },
  step(k, cyc, chord, layers) {
    if (!rPat) return;
    rLayers = layers || rLayers;
    const viz = $('#rviz'); if (!viz) return;
    viz.innerHTML = (rView === 'circle' ? circleSVG : gridSVG)(rPat, rLayers || rPat.layers, k);
    const per = rPat.steps / rPat.beats;
    const c = $('#rcount'); if (c) c.innerHTML = `<span class="${k % per === 0 ? 'on' : ''}">${esc(countLabel(k))}</span>${rPat.kind === 'guitar' && chord ? `<small>${fmt(chord)}</small>` : ''}`;
  },
};
function countLabel(k) { const per = rPat.steps / rPat.beats; return rPat.count === 'num' || rPat.count === 'bul' || per === 1 ? String(rPat.count === 'bul' ? ((k + 11) % 12) + 1 : k + 1) : per === 2 ? (k % 2 ? '&' : String(k / 2 + 1)) : per === 4 ? [String(Math.floor(k / 4) + 1), 'e', '&', 'a'][k % 4] : per === 3 ? (k % 3 === 0 ? String(k / 3 + 1) : k % 3 === 1 ? 'trip' : 'let') : String(k + 1); }

function runScreen(mode) {
  view = 'run';
  app.innerHTML = `
  <header class="bar run"><button class="icon" data-act="stop" aria-label="Stop">✕</button><h2>${mode === 'g' ? LESSONS.find((l) => l.id === S.g.lesson).name : 'Ambient'}</h2><button class="icon" data-act="pause" aria-label="Hold">❚❚</button></header>
  <main class="stage">
    <div class="neckcol" id="neck">${neckSVG([])}</div>
    <div class="info">
      <div id="intro" class="intro"></div>
      <div class="chord" id="chord"><div class="sym">…</div></div>
      <div id="stack" class="stack"></div>
      <div id="prompt"></div>
      <div id="caption" class="caption"></div>
      <div id="next" class="next"></div>
    </div>
  </main>
  ${mode === 'a' ? `<div class="toggles" id="toggles">${toggleHTML()}</div><div class="transport">
    ${S.a.src !== 'wander' ? '<button data-act="prevProg" aria-label="Previous progression"><b>⏮</b><small>progression</small></button>' : ''}
    <button data-act="prevChord" aria-label="Previous chord"><b>‹</b><small>chord</small></button>
    <button data-act="nextChord" aria-label="Next chord"><b>›</b><small>chord</small></button>
    ${S.a.src !== 'wander' ? '<button data-act="nextProg" aria-label="Next progression"><b>⏭</b><small>progression</small></button>' : ''}
  </div>
  <div class="shapes"><span>Position</span>${[['auto', 'Auto'], ['C', 'C'], ['A', 'A'], ['G', 'G'], ['E', 'E'], ['D', 'D']].map(([v, l]) => `<button data-shape="${v}" class="${S.a.shape === v ? 'on' : ''}">${l}</button>`).join('')}</div>` : ''}
  <footer class="runbar">${mode === 'g' ? `<button data-act="slower">−</button><span id="pace">${S.g.pace} s</span><button data-act="faster">+</button>` : `<button data-act="slower">−</button><span id="pace">${S.a.secs} s</span><button data-act="faster">+</button>`}
    <span class="instname">${E.INSTRUMENTS.find((i) => i.id === S.inst).name}</span></footer>`;
}
// Guided: the stack of degrees, high to low, the new one glowing
function showG(st) {
  const hide = st.hide;
  const n = st.neck.map((x) => (x.deg === hide ? { ...x, label: '?', kind: 'q' } : x));
  $('#neck').innerHTML = neckSVG(n);
  const named = st.name && st.degs.length >= 3;
  $('#chord').innerHTML = hide ? '<div class="sym dim">?</div>' : `<div class="sym">${fmt(st.sym || ROOTS[st.root])}</div><div class="say">${named ? esc(st.name.say) : st.degs.length === 1 ? 'the root' : st.degs.length === 2 ? 'an interval' : ''}</div>`;
  const rows = [...st.voiced].sort((a, b) => b.midi - a.midi).map((v) => {
    const h = v.deg === hide;
    return `<li class="k-${h ? 'q' : H.KIND(v.deg)} ${st.fresh === v.deg ? 'fresh' : ''} ${st.reveal === v.deg ? 'reveal' : ''}"><i></i><b>${h ? '?' : degText(v.deg)}</b><span>${h ? '' : esc(T.noteName(T.parseNote(['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'][v.pc]), true))}</span></li>`;
  }).join('');
  $('#stack').innerHTML = `<ol>${rows}</ol>`;
  if (st.caption) $('#caption').innerHTML = st.caption.map((c) => `<p>${fmt(c)}</p>`).join('');
  const p = st.prompt;
  $('#prompt').innerHTML = p && p.kind === 'imagine' ? `<div class="prompt"><div class="ring" style="--secs:${p.secs}s"></div><p>${fmt(p.text)}</p></div>` : (p && p.kind === 'quiz') || st.reveal ? $('#prompt').innerHTML : '';
}
function quizUI({ choices, answer, secs, text }) {
  return new Promise((res) => {
    const el = $('#prompt');
    el.innerHTML = `<div class="prompt quiz"><div class="ring" style="--secs:${secs}s"></div><p>${fmt(text)}</p><div class="choices">${choices.map((c) => `<button data-ans="${c}">${degText(c)}</button>`).join('')}</div></div>`;
    el.querySelectorAll('[data-ans]').forEach((b) => b.addEventListener('click', () => {
      el.querySelectorAll('[data-ans]').forEach((x) => { x.disabled = true; x.classList.toggle('right', x.dataset.ans === answer); });
      if (b.dataset.ans !== answer) b.classList.add('wrong');
      res(b.dataset.ans);
    }, { once: true }));
    // when the answer is revealed, the right one lights up anyway
    setTimeout(() => el.querySelectorAll('[data-ans]').forEach((x) => { x.disabled = true; x.classList.toggle('right', x.dataset.ans === answer); }), secs * 1000 + 300);
  });
}
// Ambient
const IVK = (iv) => H.KIND(String(iv).replace(/^(b|#)?(2|4|6)$/, (m, a, n) => (n === '6' ? (a || '') + '6' : (a || '') + { 2: '9', 4: '11' }[n])));
// the tension curve of a progression: a soft line, a dot per chord
function tensionSVG(ts) {
  if (!ts || ts.length < 2) return '';
  const W = 200, H = 34, mx = Math.max(4, ...ts), x = (i) => 6 + (i * (W - 12)) / (ts.length - 1), y = (v) => H - 4 - (v / mx) * (H - 10);
  return `<svg class="tens" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none"><polyline points="${ts.map((v, i) => `${x(i)},${y(v)}`).join(' ')}"/>${ts.map((v, i) => `<circle data-i="${i}" cx="${x(i)}" cy="${y(v)}" r="2.6"/>`).join('')}</svg>`;
}
function introA({ pack, it, rns, changed, lines, tension }) {
  const el = $('#intro');
  if (!el) return;
  el.innerHTML = `${pack ? `<div class="pk">${esc(pack.group)} · ${fmt(pack.name)}</div>` : ''}<div class="pn">${fmt(it.name)}</div>${it.note ? `<div class="pt">${fmt(it.note)}</div>` : ''}${tensionSVG(tension)}<div class="chart">${rns.map((r, i) => `<span data-i="${i}" class="${changed?.[i] ? 'chg' : ''}">${fmt(r)}</span>`).join('')}</div>`;
  const cap = $('#caption'); if (cap) cap.innerHTML = '';
}
function showA({ c, notes, next, first }) {
  document.querySelectorAll('#intro .chart span').forEach((s) => s.classList.toggle('on', Number(s.dataset.i) === c.idx));
  $('#neck').innerHTML = neckSVG(notes.map((n) => ({ ...n, label: degText(n.iv), kind: IVK(n.iv), fresh: false, spot: S.a.spotlight && ['3', 'b3', '7', 'b7'].includes(n.iv) })));
  document.querySelectorAll('#intro .tens circle').forEach((d) => d.classList.toggle('on', Number(d.dataset.i) === c.idx));
  if (!first) return;
  $('#chord').innerHTML = `<div class="rn">${fmt(c.rn)}</div><div class="sym">${fmt(c.name)}</div><div class="say">${esc(c.keyLabel)}</div>`;
  lastA = c;
  drawDetails();
  $('#next').innerHTML = next ? `<span>next</span> <b>${fmt(next.rn)}</b> ${fmt(next.name)}` : '';
}

let lastA = null;
const ROLE_LABEL = { tonic: 'Tonic: home', tonicMinor: 'Tonic: home', super: 'Pre-dominant', mediant: 'Mediant', sub: 'Subdominant', dom: 'Dominant', rel: 'Relative minor', lead: 'Leading-tone chord',
  borrowed: 'From the parallel minor', borrowedMaj: 'From the parallel major', secondary: 'Secondary dominant', tritone: 'Tritone substitute', passing: 'Passing diminished',
  mediantChrom: 'Chromatic mediant', neapolitan: 'Neapolitan', subMinor: 'Minor subdominant, from the parallel minor', domMinor: 'Minor dominant', backdoor: 'Backdoor dominant', picardy: 'Picardy third',
  sus: 'Suspended', relMaj: 'Relative major', flatSix: '♭VI', subtonic: 'Subtonic ♭VII' };
// the chord's details: its function and extensions always; More opens why it works, its notes, why each extension fits
function drawDetails() {
  const c = lastA, el = $('#stack');
  if (!c || !el) return;
  const d = details(c);
  const notes = [...d.notes].sort((a, b) => a.midi - b.midi).map((n) => `<span class="k-${IVK(n.iv)}"><i></i>${degText(n.iv)} <small>${fmt(T.noteName(T.transpose(c.root, n.iv), true))}</small></span>`).join('');
  el.innerHTML = `${c.label ? `<div class="lbl2">${fmt(c.label)}</div>` : ''}${c.style && c.prog?.item?.voicings ? `<div class="lbl2">${esc({ close: 'Close voicing', spread: 'Spread voicing', fourths: 'In fourths', cluster: 'A cluster', open: 'Open strings' }[c.style] || '')}</div>` : ''}<div class="fn">${esc(ROLE_LABEL[c.role] || '')}</div>
    ${d.mode ? `<div class="exl">From <b>${esc(d.mode)}</b></div>` : ''}
    ${S.a.feel !== 'off' && d.feel.length ? `<div class="feel">${fmt(d.feel.join(' '))}</div>` : ''}
    ${d.exts.length ? `<div class="exl">Extensions: ${d.exts.map((x) => `<b>${degText(x.e)}</b>`).join(' · ')}</div>` : ''}
    ${c.ann.map((a) => `<div class="ann">${fmt(a.text)}</div>`).join('')}
    <button class="morebtn" data-act="more">${S.a.more ? 'Less ▴' : 'More ▾'}</button>
    ${S.a.more ? `<div class="more">
      ${d.why ? `<p><b>Why it works.</b> ${fmt(d.why)}</p>` : ''}
      ${d.feel.length ? `<p><b>How it feels.</b> ${fmt(d.feel.join(' '))}</p>` : ''}
      ${d.feelWhy.length ? `<p><b>Why it feels that way.</b> ${fmt(d.feelWhy.join(' '))}</p>` : ''}
      ${d.mode ? `<p><b>Where it comes from.</b> ${fmt(d.mode)}: the mode of the same home note that holds every note of this chord.</p>` : ''}
      <div class="nlist">${notes}</div>
      ${d.exts.map((x) => `<p><b>${degText(x.e)}.</b> ${fmt(x.info)} <i>${fmt(x.colour)}</i></p>`).join('')}
      ${c.bass ? `<p><b>Slash chord.</b> ${fmt(c.name)}: the bass is the chord’s ${degText(c.bass)}, not its root, so the bass line moves more smoothly (or holds still while the harmony changes).</p>` : ''}
      ${c.prog?.it?.note ? `<p class="pnote">${fmt(c.prog.it.note)}</p>` : ''}
    </div>` : ''}`;
}
// the live buttons (Ambient): each cycles through its settings, and takes effect from the next chord
const TOGGLES = [
  ['theory', 'Theory', [[0, 'off'], [1, 'short'], [2, 'more']]],
  ['extTalk', 'Extensions', [['off', 'off'], ['names', 'named'], ['why', 'why']]],
  ['extLater', 'Ext. later', [[false, 'off'], [true, 'on']]],
  ['arp', 'Arpeggio', [['off', 'off'], ['on', 'on'], ['named', 'named']]],
  ['modeSay', 'Mode', [[false, 'off'], [true, 'on']]],
  ['feel', 'Feel', [['off', 'off'], ['on', 'on'], ['why', '+ why']]],
  ['spotlight', 'Spotlight', [[false, 'off'], [true, 'on']]],
  ['tension', 'Tension', [[false, 'off'], [true, 'on']]],
];
const toggleHTML = () => TOGGLES.map(([k, l, opts]) => { const cur = opts.find(([v]) => v === S.a[k]) || opts[0]; return `<button data-tog="${k}" class="${cur[0] && cur[0] !== 'off' ? 'on' : ''}">${l}<small>${cur[1]}</small></button>`; }).join('');

// ---------- start / stop ----------
async function begin(mode) {
  await A.unlockAudio(); await A.ensureRunning();
  E.setSpace(S.space);
  voices = E.voices(S.inst);
  try { if (navigator.wakeLock) lock = await navigator.wakeLock.request('screen'); } catch (e) { lock = null; }
  if (mode === 'i') { runScreenI(); const O = { ...S.i, vvol: S.vvol * 4 }; run = inversions(O, { show: showI, none: () => { $('#chord').innerHTML = '<div class="say">No voicings on this string set.</div>'; } }, voices); run.mode = mode; return; }
  if (mode === 'r') { runScreenR(); const O = { ...S.r, vvol: S.vvol * 4 }; run = rhythm(O, rUI); run.mode = mode; return; }
  runScreen(mode);
  const O = { ...(mode === 'g' ? S.g : S.a), vvol: S.vvol * 4 };
  if (mode === 'g') run = guided(O, { show: showG, quiz: quizUI, vl: showVL }, voices);
  else run = ambient(O, { show: showA, intro: introA, caption: (lines) => { const el = $('#caption'); if (el) el.innerHTML = lines.map((l) => `<p>${esc(l)}</p>`).join(''); } }, voices);
  run.mode = mode; run.O = O;
}
function end() {
  if (run) run.stop();
  run = null;
  if (lock) { lock.release().catch(() => {}); lock = null; }
}

// ---------- events ----------
app.addEventListener('click', async (e) => {
  const b = e.target.closest('button');
  if (!b) return;
  if (b.dataset.go === 'x') { view = 'x'; exploder(app, { S, save, back: home, unlock: async () => { await A.unlockAudio(); await A.ensureRunning(); E.setSpace(S.space); } }); window.scrollTo(0, 0); return; }
  if (b.dataset.go) { ({ home, g: setupG, a: setupA, i: setupI, r: setupR })[b.dataset.go](); window.scrollTo(0, 0); return; }
  if (b.dataset.play) { begin(b.dataset.play); return; }
  if (b.dataset.set && b.dataset.v !== undefined) {
    put(b.dataset.set, b.dataset.v);
    if (b.dataset.set === 'inst') preview();
    rerender();
    return;
  }
  if (b.dataset.tog) {
    const [k, , opts] = TOGGLES.find(([x]) => x === b.dataset.tog);
    const i = opts.findIndex(([v]) => v === S.a[k]);
    S.a[k] = opts[(i + 1) % opts.length][0]; save();
    if (run?.O) run.O[k] = S.a[k];
    $('#toggles').innerHTML = toggleHTML();
    return;
  }
  if (b.dataset.act === 'more') { S.a.more = !S.a.more; save(); drawDetails(); return; }
  if (b.dataset.shape && run?.setShape) {
    S.a.shape = b.dataset.shape; save();
    run.setShape(b.dataset.shape);
    document.querySelectorAll('[data-shape]').forEach((x) => x.classList.toggle('on', x === b));
    return;
  }
  const act = b.dataset.act;
  if (run && ['prevProg', 'prevChord', 'nextChord', 'nextProg'].includes(act) && run[act]) { run[act](); return; }
  if (act === 'stop') { const m = run?.mode; end(); ({ g: setupG, a: setupA, i: setupI, r: setupR })[m || 'a'](); }
  if (act === 'inext' && run?.next) { run.next(); return; }
  if (act === 'iprev' && run?.prev) { run.prev(); return; }
  if (act === 'rnext' && run?.next) { run.next(); return; }
  if (act === 'rprev' && run?.prev) { run.prev(); return; }
  if (act === 'rview') { rView = rView === 'circle' ? 'grid' : 'circle'; S.r.view = rView; save(); return; }
  if (act === 'rcount' && run?.O) { S.r.count = !S.r.count; run.O.count = S.r.count; save(); b.classList.toggle('on', S.r.count); return; }
  if (act === 'pause' && run) { const p = !run.paused; run.pause(p); b.textContent = p ? '▶' : '❚❚'; b.classList.toggle('on', p); }
  if (act === 'slower' || act === 'faster') {
    const d = act === 'faster' ? -1 : 1;
    if (run?.mode === 'g') { S.g.pace = Math.max(3, Math.min(30, S.g.pace + d)); $('#pace').textContent = `${S.g.pace} s`; }
    else if (run?.mode === 'i') { S.i.pace = Math.max(2, Math.min(20, S.i.pace + d)); run.O.pace = S.i.pace; $('#pace').textContent = `${S.i.pace} s`; }
    else if (run?.mode === 'r') { S.r.bpm = Math.max(40, Math.min(160, S.r.bpm - d * 4)); run.O.bpm = S.r.bpm; $('#pace').textContent = `${S.r.bpm} bpm`; }
    else { S.a.secs = Math.max(4, Math.min(40, S.a.secs + d * 2)); $('#pace').textContent = `${S.a.secs} s`; }
    save();
    liveOpts();
  }
});
app.addEventListener('input', (e) => {
  const el = e.target;
  if (!el.dataset.set) return;
  put(el.dataset.set, el.value);
  if (el.dataset.set === 'space') E.setSpace(S.space);
  const out = el.parentElement.querySelector('output');
  if (out) {
    const k = el.dataset.set;
    out.textContent = k === 'space' ? (S.space < 0.3 ? 'close' : S.space < 0.7 ? 'hall' : 'cathedral') : k === 'vvol' ? Math.round(S.vvol * 100) + '%' : k === 'g.level' ? H.LEVELS[S.g.level - 1].name
      : k === 'a.far' ? TIERS[S.a.far - 1].name : k === 'a.level' ? LEVEL_NAMES[S.a.level - 1] : k === 'g.pace' ? `${S.g.pace} s` : k === 'a.secs' ? `${S.a.secs} s` : k === 'i.pace' ? `${S.i.pace} s` : k === 'r.bpm' ? `${S.r.bpm} bpm` : el.value;
  }
});
app.addEventListener('change', async (e) => { const el = e.target;
  if (el.id === 'tgpack' && el.files?.[0]) { const m = $('#tgmsg'); try { if (m) m.textContent = 'Reading…'; await TGB.importPack(el.files[0]); home(); } catch (err) { if (m) m.textContent = err.message; } return; } if (el.tagName === 'SELECT' && el.dataset.set) { put(el.dataset.set, el.value); rerender(); } else if (el.type === 'range') rerender(); });
function rerender() { const y = window.scrollY; const f = { home, g: setupG, a: setupA, i: setupI, r: setupR }[view]; if (f) f(); window.scrollTo(0, y); }
// the run reads its options live: pace changes take effect at the next step
function liveOpts() { if (!run?.O) return; if (run.mode === 'g') run.O.pace = S.g.pace; else if (run.mode === 'a') run.O.secs = S.a.secs; }
// a short taste of an instrument when it's chosen
let previewing = null;
async function preview() {
  await A.unlockAudio(); await A.ensureRunning();
  E.setSpace(S.space);
  if (run) return;
  if (previewing) previewing.releaseAll(A.audioCtx().currentTime, 0.8);
  const v = previewing = E.voices(S.inst), t = A.audioCtx().currentTime + 0.05;
  v.set([48], t); v.set([48, 55], t + 0.7); v.set([48, 55, 64], t + 1.4); v.set([48, 55, 64, 71], t + 2.1);
  setTimeout(() => { if (previewing === v) v.releaseAll(A.audioCtx().currentTime, 2); }, 5200);
}

document.addEventListener('visibilitychange', async () => { if (!document.hidden && run) { try { await A.ensureRunning(); if (navigator.wakeLock && !lock) lock = await navigator.wakeLock.request('screen'); } catch (e) { /* */ } } });
if ('serviceWorker' in navigator && location.protocol !== 'file:') navigator.serviceWorker.register('sw.js').catch(() => {});
home();
TGB.load().then((ok) => { if (ok && view === 'home') home(); });
