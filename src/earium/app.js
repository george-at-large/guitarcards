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
import { ambient, PROGRESSIONS, LEVEL_NAMES, GROUPS } from './ambient.js';
import { degText } from './words.js';

const $ = (s) => document.querySelector(s);
const app = $('#earium');
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const fmt = (s) => esc(T.pretty(String(s ?? '')));
const ROOTS = ['C', 'D♭', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'A♭', 'A', 'B♭', 'B'];

const DEF = {
  inst: 'guitar', space: 0.55, vvol: 0.45,
  g: { lesson: 'build', level: 2, maxNotes: 4, bass: 'root', prompts: 'off', voice: 'rich', pace: 8, root: 'random' },
  a: { src: 'packs', pack: 'all', loops: 2, prog: 'major-ii-v-i', level: 2, key: 'random', minor: false, secs: 12, motion: 'gentle', narr: 'rich' },
};
let S;
try { S = JSON.parse(localStorage.getItem('earium') || 'null'); } catch (e) { S = null; }
S = { ...DEF, ...(S || {}), g: { ...DEF.g, ...(S?.g || {}) }, a: { ...DEF.a, ...(S?.a || {}) } };
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
    ${row('Voice volume', slider('vvol', 0.1, 0.9, 0.05, S.vvol, Math.round(S.vvol * 100) + '%'))}
  </section>`;
}

// ---------- home ----------
function home() {
  view = 'home';
  app.innerHTML = `
  <header class="hero"><h1>Earium</h1><p>Listen into the intervals.</p></header>
  <button class="mode" data-go="g"><span class="glyph">◐</span><span><b>Guided</b><small>A voice builds chords note by note and morphs them, naming everything you hear. It can ask you to hear the next note first.</small></span></button>
  <button class="mode" data-go="a"><span class="glyph">◌</span><span><b>Ambient</b><small>Rich chords drift and morph through progressions. A voice can name them, or tell you what they're doing.</small></span></button>
  ${sound()}
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
    ${row('Colours', slider('g.level', 1, 5, 1, g.level, lv.name), lv.blurb)}
    ${g.lesson === 'build' ? row('Up to', seg('g.maxNotes', [3, 4, 5, 6, 7].map((n) => [n, `${n} notes`]), g.maxNotes)) : ''}
    ${g.lesson !== 'intervals' ? row('Bass', seg('g.bass', [['root', 'Root lowest'], ['inv', 'Inversions']], g.bass)) : ''}
    ${row('Ask me', seg('g.prompts', [['off', 'Never'], ['imagine', 'Imagine it'], ['quiz', 'Name it'], ['mix', 'Both']], g.prompts),
    g.prompts === 'imagine' ? 'Now and then you’ll be told which note is coming, and given time to hear it in your head before it sounds.' : g.prompts === 'quiz' ? 'Now and then a note comes in unnamed: name it (tap, or just say it), then you’re told.' : g.prompts === 'mix' ? 'Sometimes imagine it first, sometimes name it.' : 'Everything is named as it happens.')}
    ${row('Voice', seg('g.voice', [['rich', 'Full'], ['minimal', 'Just names'], ['off', 'Off']], g.voice), g.voice === 'rich' ? 'Each note’s name and its character, and the chord’s name.' : g.voice === 'minimal' ? 'The note and the chord, nothing more.' : 'Silent: everything is still written on screen.')}
    ${row('Pace', slider('g.pace', 4, 24, 1, g.pace, `${g.pace} s`), 'How long each sound rings before the next change.')}
    ${row('Root', `<select data-set="g.root" class="sel"><option value="random" ${g.root === 'random' ? 'selected' : ''}>Changes now and then</option>${ROOTS.map((r, i) => `<option value="${i}" ${String(g.root) === String(i) ? 'selected' : ''}>${r}</option>`).join('')}</select>`)}
  </section>
  ${sound()}
  <button class="play" data-play="g">Begin</button>`;
}
function setupA() {
  view = 'a';
  const a = S.a;
  const packOpts = GROUPS.map((g) => `<optgroup label="${esc(g.name)}">${g.packs.map((p) => `<option value="${p.id}" ${p.id === a.pack ? 'selected' : ''}>${fmt(p.name)}</option>`).join('')}</optgroup>`).join('');
  const progs = PROGRESSIONS().map((g) => `<optgroup label="${esc(g.cat)}">${g.items.map((p) => `<option value="${p.id}" ${p.id === a.prog ? 'selected' : ''}>${esc(p.name)}</option>`).join('')}</optgroup>`).join('');
  app.innerHTML = `
  <header class="bar"><button class="icon" data-go="home" aria-label="Back">‹</button><h2>Ambient</h2><span></span></header>
  <section class="card">
    ${row('Music', seg('a.src', [['packs', 'Packs'], ['wander', 'Wandering'], ['prog', 'One progression']], a.src),
    a.src === 'packs' ? 'Progressions play one after another, each introduced by name with a line of theory.' : a.src === 'wander' ? 'Endless phrases that move through the key and close with cadences; at higher complexity, borrowed chords, secondary dominants and new keys.' : '')}
    ${a.src === 'packs' ? row('Play', `<select data-set="a.pack" class="sel"><option value="all" ${a.pack === 'all' ? 'selected' : ''}>All packs, in turn</option><option value="random" ${a.pack === 'random' ? 'selected' : ''}>Random mix</option>${packOpts}</select>`) + row('Each progression', seg('a.loops', [1, 2, 3, 4].map((n) => [n, `${n}×`]), a.loops), 'How many times round before the next one.') : ''}
    ${a.src === 'prog' ? row('Progression', `<select data-set="a.prog" class="sel">${progs}</select>`) : ''}
    ${row('Complexity', slider('a.level', 1, 5, 1, a.level, LEVEL_NAMES[a.level - 1]), a.src === 'wander' ? ['Triads of the key.', 'Sevenths, add9s.', 'Borrowed chords, secondary dominants, 9ths.', 'Jazz: ii–Vs everywhere, tritone subs, 13ths, altered.', 'Far out: chromatic mediants, distant keys.'][a.level - 1] : ['Chords as written.', 'Chords as written.', 'Now and then a chord gets a colour (a 9th, a 13th…).', 'Most chords get colours.', 'Colours everywhere.'][a.level - 1])}
    ${row('Key', `<div class="keyrow"><select data-set="a.key" class="sel"><option value="random" ${a.key === 'random' ? 'selected' : ''}>Any, changing</option>${['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'].map((k) => `<option value="${k}" ${a.key === k ? 'selected' : ''}>${fmt(k)}</option>`).join('')}</select>${a.src === 'wander' ? seg('a.minor', [[false, 'Major'], [true, 'Minor']], a.minor) : ''}</div>`)}
    ${row('Each chord', slider('a.secs', 5, 30, 1, a.secs, `${a.secs} s`))}
    ${row('Movement', seg('a.motion', [['still', 'Still'], ['gentle', 'Gentle'], ['flowing', 'Flowing']], a.motion), a.motion === 'still' ? 'Only the chord changes move.' : a.motion === 'gentle' ? 'The top voice wanders to another chord tone.' : 'Suspensions resolve and the top voice sings a little.')}
    ${row('Narration', seg('a.narr', [['rich', 'Describe'], ['minimal', 'Chords only'], ['off', 'Off']], a.narr), a.narr === 'rich' ? 'Each progression introduced with its theory; each chord and what it’s doing: “moving to the minor four, borrowed from the parallel minor”.' : a.narr === 'minimal' ? 'Each progression’s name, and just the chords: “four, major seven”.' : 'Silent: names and theory still shown on screen.')}
  </section>
  ${sound()}
  <button class="play" data-play="a">Begin</button>`;
}

// ---------- the run screen ----------
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
function introA({ pack, it, rns, lines }) {
  const el = $('#intro');
  if (!el) return;
  el.innerHTML = `${pack ? `<div class="pk">${esc(pack.group)} · ${fmt(pack.name)}</div>` : ''}<div class="pn">${fmt(it.name)}</div>${it.note ? `<div class="pt">${fmt(it.note)}</div>` : ''}<div class="chart">${rns.map((r, i) => `<span data-i="${i}">${fmt(r)}</span>`).join('')}</div>`;
  const cap = $('#caption'); if (cap) cap.innerHTML = '';
}
function showA({ c, notes, next, first }) {
  document.querySelectorAll('#intro .chart span').forEach((s) => s.classList.toggle('on', Number(s.dataset.i) === c.idx));
  $('#neck').innerHTML = neckSVG(notes.map((n) => ({ ...n, label: degText(n.iv), kind: IVK(n.iv), fresh: false })));
  if (!first) return;
  $('#chord').innerHTML = `<div class="rn">${fmt(c.rn)}</div><div class="sym">${fmt(c.name)}</div><div class="say">${esc(c.keyLabel)}</div>`;
  const role = c.role ? ({ tonic: 'Tonic: home', tonicMinor: 'Tonic: home', super: 'Pre-dominant', mediant: 'Mediant', sub: 'Subdominant', dom: 'Dominant', rel: 'Relative minor', lead: 'Leading-tone chord',
    borrowed: 'Borrowed from the parallel minor', borrowedMaj: 'Borrowed from the parallel major', secondary: 'Secondary dominant', tritone: 'Tritone substitute', passing: 'Passing diminished',
    mediantChrom: 'Chromatic mediant', neapolitan: 'Neapolitan', subMinor: 'Minor subdominant (borrowed)', domMinor: 'Minor dominant', backdoor: 'Backdoor dominant', picardy: 'Picardy third',
    sus: 'Suspended', relMaj: 'Relative major', flatSix: '♭VI', subtonic: 'Subtonic ♭VII' })[c.role] : '';
  $('#stack').innerHTML = `<div class="fn">${esc(role)}</div>${c.ann.map((a) => `<div class="ann">${fmt(a.text)}</div>`).join('')}`;
  $('#next').innerHTML = next ? `<span>next</span> <b>${fmt(next.rn)}</b> ${fmt(next.name)}` : '';
}

// ---------- start / stop ----------
async function begin(mode) {
  await A.unlockAudio(); await A.ensureRunning();
  E.setSpace(S.space);
  voices = E.voices(S.inst);
  runScreen(mode);
  try { if (navigator.wakeLock) lock = await navigator.wakeLock.request('screen'); } catch (e) { lock = null; }
  const O = { ...(mode === 'g' ? S.g : S.a), vvol: S.vvol };
  if (mode === 'g') run = guided(O, { show: showG, quiz: quizUI }, voices);
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
  if (b.dataset.go) { if (b.dataset.go === 'home') home(); else if (b.dataset.go === 'g') setupG(); else setupA(); window.scrollTo(0, 0); return; }
  if (b.dataset.play) { begin(b.dataset.play); return; }
  if (b.dataset.set && b.dataset.v !== undefined) {
    put(b.dataset.set, b.dataset.v);
    if (b.dataset.set === 'inst') preview();
    rerender();
    return;
  }
  const act = b.dataset.act;
  if (act === 'stop') { const m = run?.mode; end(); m === 'g' ? setupG() : setupA(); }
  if (act === 'pause' && run) { const p = !run.paused; run.pause(p); b.textContent = p ? '▶' : '❚❚'; b.classList.toggle('on', p); }
  if (act === 'slower' || act === 'faster') {
    const d = act === 'faster' ? -1 : 1;
    if (run?.mode === 'g') { S.g.pace = Math.max(3, Math.min(30, S.g.pace + d)); $('#pace').textContent = `${S.g.pace} s`; }
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
      : k === 'a.level' ? LEVEL_NAMES[S.a.level - 1] : k === 'g.pace' ? `${S.g.pace} s` : k === 'a.secs' ? `${S.a.secs} s` : el.value;
  }
});
app.addEventListener('change', (e) => { const el = e.target; if (el.tagName === 'SELECT' && el.dataset.set) { put(el.dataset.set, el.value); rerender(); } else if (el.type === 'range') rerender(); });
function rerender() { const y = window.scrollY; if (view === 'home') home(); else if (view === 'g') setupG(); else if (view === 'a') setupA(); window.scrollTo(0, y); }
// the run reads its options live: pace changes take effect at the next step
function liveOpts() { if (!run?.O) return; if (run.mode === 'g') run.O.pace = S.g.pace; else run.O.secs = S.a.secs; }
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
