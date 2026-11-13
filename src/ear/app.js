// Ear: two sections. Progressions, a level game from I→IV up to any progression at all; Audiation, guided sessions that
// build chords, take notes away and have you put them back in your head.
import * as T from '../theory.js';
import * as S from './sound.js';
import * as P from './progressions.js';
import * as A from './audiation.js';
import { createNeck } from './neck.js';
import { learnMore } from './notes.js';

const $ = (sel, root = document) => root.querySelector(sel);
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
// accidentals set in the text face, tight against the numeral (the serif has no ♭ of its own)
const fmt = (s) => esc(s).replace(/([♭♯𝄫])/g, '<span class="acc">$1</span>');
const STORE = 'guitarcards-ear';
const load = () => { try { return JSON.parse(localStorage.getItem(STORE) || '{}'); } catch (e) { return {}; } };
const st = Object.assign({ tab: 'prog', prog: {}, aud: {}, conf: {}, key: 'random', eyes: false, sound: 'piano', drone: false }, load());
const save = () => { try { localStorage.setItem(STORE, JSON.stringify(st)); } catch (e) { /* private mode */ } };
const app = document.getElementById('ear');
let cleanup = null; // stops whatever the current screen is playing
const go = (fn) => { if (cleanup) cleanup(); cleanup = null; S.hush(); S.awake(false); fn(); window.scrollTo(0, 0); };

// ---------- progress ----------
const lp = (id) => (st.prog[id] ||= { hist: [], passed: false, streak: 0, best: 0 });
const passedLevel = (L) => lp(L.id).passed;
const unlocked = (i) => i === 0 || P.LEVELS.slice(0, i).every(passedLevel) || P.LEVELS[i - 1] && passedLevel(P.LEVELS[i - 1]);
const isPass = (L, rec) => (L.streak ? rec.streak >= L.streak : rec.hist.slice(-P.PASS.of).filter(Boolean).length >= P.PASS.need);

// ---------- home ----------
function home() {
  const next = P.LEVELS.find((L) => !passedLevel(L)) || P.LEVELS[P.LEVELS.length - 1];
  const beaten = passedLevel(P.LEVELS[P.LEVELS.length - 1]);
  const nextSes = A.SESSIONS.find((s) => !st.aud[s.id]?.done) || A.SESSIONS[0];
  app.innerHTML = `
    <header class="ehead">${standalone ? '<span></span>' : '<a class="eback" href="./" aria-label="Guitar Cards">‹</a>'}<h1>Ear</h1><span></span></header>
    <div class="etabs" role="tablist">
      <button role="tab" data-tab="prog" class="${st.tab === 'prog' ? 'on' : ''}">Progressions</button>
      <button role="tab" data-tab="aud" class="${st.tab === 'aud' ? 'on' : ''}">Audiation</button>
    </div>
    <main class="ebody">${st.tab === 'prog' ? progHome(next, beaten) : audHome(nextSes)}</main>`;
  app.querySelectorAll('[data-tab]').forEach((b) => b.onclick = () => { st.tab = b.dataset.tab; save(); home(); });
  app.querySelectorAll('[data-level]').forEach((b) => b.onclick = () => {
    const i = P.LEVELS.findIndex((L) => L.id === b.dataset.level);
    if (!unlocked(i) && !confirm('This level is locked. Skip ahead to it anyway?')) return;
    go(() => level(P.LEVELS[i]));
  });
  app.querySelectorAll('[data-session]').forEach((b) => b.onclick = () => go(() => session(A.SESSIONS.find((s) => s.id === b.dataset.session))));
  const key = $('#ekey'); if (key) key.onchange = () => { st.key = key.value; save(); };
  const eyes = $('#eeyes'); if (eyes) eyes.onchange = () => { st.eyes = eyes.checked; save(); };
}
function progHome(next, beaten) {
  let n = 0;
  return `
    <p class="elead">Hear a progression and name every chord: cadences, songs and standards along the way, each explained after you answer. Pass a level with ${P.PASS.need} perfect rounds out of ${P.PASS.of}. You beat the game when you can name anything at all.</p>
    ${confusions()}
    ${beaten ? '<div class="etrophy">🏆 You beat the game: any progression, any inversion.</div>' : `<button class="ebig" data-level="${next.id}"><small>Continue</small>Level ${P.LEVELS.indexOf(next) + 1} · ${esc(next.title)}</button>`}
    ${P.TIERS.map((tier) => `<section class="etier"><h2>${esc(tier.title)}</h2>${tier.levels.map((L) => {
      const i = P.LEVELS.findIndex((x) => x.id === L.id); n++;
      const rec = lp(L.id), open = unlocked(i);
      const dots = rec.hist.slice(-P.PASS.of);
      return `<button class="erow ${rec.passed ? 'done' : ''} ${open ? '' : 'locked'}" data-level="${L.id}">
        <span class="enum">${rec.passed ? '✓' : open ? n : '🔒'}</span>
        <span class="etitle">${esc(L.title)}${L.streak ? ' 🏆' : ''}<small>${rec.passed ? 'passed' : dots.length ? dots.map((d) => `<i class="${d ? 'y' : 'n'}"></i>`).join('') : open ? 'ready' : 'locked'}</small></span></button>`;
    }).join('')}</section>`).join('')}`;
}
// the chords most often mistaken for others, worth listening for
function confusions() {
  const top = Object.entries(st.conf || {}).sort((a, b) => b[1] - a[1]).slice(0, 4);
  return top.length ? `<p class="emuted econf">Most often mixed up: ${top.map(([k, n]) => `<b>${fmt(k)}</b> ×${n}`).join(', ')}</p>` : '';
}
function audHome(nextSes) {
  const keys = ['random', 'C', 'G', 'D', 'A', 'E', 'F', 'Bb', 'Eb', 'Ab', 'Db'];
  return `
    <p class="elead">Guided sessions that build a chord, take its notes away and have you put them back in your head, then move between chords. Every note sounds before you're asked to imagine it, and every imagined note is checked. A few minutes a day, with headphones.</p>
    <button class="ebig" data-session="${nextSes.id}"><small>Next session</small>${nextSes.id} · ${esc(nextSes.title)}</button>
    <div class="eopts">
      <label>Key <select id="ekey">${keys.map((k) => `<option value="${k}" ${st.key === k ? 'selected' : ''}>${k === 'random' ? 'New each time' : T.pretty(k)}</option>`).join('')}</select></label>
      <label class="echeck"><input type="checkbox" id="eeyes" ${st.eyes ? 'checked' : ''}> Eyes closed (no neck)</label>
    </div>
    ${A.STAGES.map((stage, si) => `<section class="etier"><h2>${si + 1} · ${esc(stage.title)}</h2>${stage.sessions.map((s) => {
      const rec = st.aud[s.id];
      return `<button class="erow ${rec?.done ? 'done' : ''}" data-session="${s.id}"><span class="enum">${rec?.done ? '✓' : s.id}</span>
        <span class="etitle">${esc(s.title)}<small>${esc(s.about)}${rec?.total ? ` · held ${rec.held}/${rec.total}` : ''}</small></span></button>`;
    }).join('')}</section>`).join('')}
    <section class="etier later"><h2>Coming next</h2>${A.LATER.map((x, i) => `<div class="erow locked"><span class="enum">${i + A.STAGES.length + 1}</span><span class="etitle">${esc(x)}</span></div>`).join('')}</section>`;
}

// ---------- a progression level ----------
function level(L) {
  const idx = P.LEVELS.indexOf(L);
  const rec = lp(L.id);
  let round, pls, kpls, answer, checked, pad, partial, sel, lastFilled = -1;
  let playing = null; // timers of the playback in progress
  app.innerHTML = `
    <header class="ehead"><button class="eback" id="eback" aria-label="Back">‹</button><h1>${idx + 1} · ${esc(L.title)}</h1><span></span></header>
    <main class="ebody game">
      <details class="etip"><summary>How to hear it</summary><p>${esc(L.tip)}</p><p class="emuted">Chords are named against the major scale of the key: ♭VII, iv and ♭VI are borrowed; lower case is minor; /3, /5, /7 put that chord tone in the bass.</p></details>
      <div class="emeter" id="emeter"></div>
      <div class="econtrols"><button id="eplay" class="eprimary">▶ Play</button><button id="ekeyb">Key</button><button id="ebass">Bass</button><button id="edrone" class="${st.drone ? 'on' : ''}" aria-pressed="${!!st.drone}">Drone</button>
        <select id="esound" aria-label="Sound">${Object.entries(S.INSTRUMENTS).map(([k, v]) => `<option value="${k}" ${st.sound === k ? 'selected' : ''}>${v}</option>`).join('')}</select></div>
      <p class="estatus" id="estatus">&nbsp;</p>
      <div class="eslots" id="eslots"></div>
      <div class="epad" id="epad"></div>
      <div class="eresult" id="eresult"></div>
      <div class="elearn" id="elearn" hidden></div>
      <div class="eactions"><button id="eundo">⌫</button><button id="echeckb" class="eprimary" disabled>Check</button></div>
    </main>`;
  $('#eback').onclick = () => go(home);
  cleanup = () => stopPlay();
  function stopPlay() { if (playing) playing.forEach(clearTimeout); playing = null; S.hush(); highlight(-1); status(''); }
  const status = (text) => { $('#estatus').textContent = text || '\u00a0'; };
  function meter() {
    const dots = rec.hist.slice(-P.PASS.of);
    $('#emeter').innerHTML = L.streak
      ? `<span>${rec.streak} of ${L.streak} in a row</span>${rec.passed ? ' <b>🏆 beaten</b>' : ''}`
      : `<span class="edots">${Array.from({ length: P.PASS.of }, (_, i) => `<i class="${dots[i] === undefined ? '' : dots[i] ? 'y' : 'n'}"></i>`).join('')}</span><span>${P.PASS.need} of the last ${P.PASS.of} to pass${rec.passed ? ' · <b>passed</b>' : ''}</span>`;
  }
  function newRound() {
    stopPlay();
    round = P.makeRound(L);
    pls = P.voicings(round);
    kpls = P.keysVoicings(round);
    answer = round.tokens.map((x, i) => (i < round.given ? x : null));
    checked = false; partial = {}; sel = answer.findIndex((x) => !x);
    pad = P.padFor(L, round);
    $('#eresult').innerHTML = ''; $('#elearn').hidden = true; $('#elearn').innerHTML = '';
    $('#epad').hidden = false;
    $('#echeckb').textContent = 'Check';
    drawSlots(); drawPad(); meter();
    play(true);
  }
  function drawSlots() {
    $('#eslots').innerHTML = round.tokens.map((tok, i) => {
      const a = answer[i];
      const given = i < round.given;
      const ok = checked ? P.same(P.chordOf(a || 'I:maj', round.tonic), P.chordOf(tok, round.tonic)) && a : null;
      const bassOk = checked && !ok && a && P.chordOf(a, round.tonic).bassRel === P.chordOf(tok, round.tonic).bassRel;
      const shown = a ? P.label(a) : i === sel && partial.deg !== undefined ? P.DEGREES[partial.deg] + (partial.q ? P.QUALITY_BUTTONS[partial.q] : '…') : '';
      return `<button class="eslot ${shown.length > 4 ? 'long' : ''} ${given ? 'given' : ''} ${i === sel && !checked ? 'sel' : ''} ${checked ? (ok ? 'ok' : bassOk ? 'half' : 'bad') : ''}" data-i="${i}">
        <b>${fmt(shown) || '&nbsp;'}</b>${checked ? `<small>${ok ? fmt(P.nameIn(P.chordOf(tok, round.tonic))) : fmt(P.label(tok)) + ' · ' + fmt(P.nameIn(P.chordOf(tok, round.tonic))) + (bassOk ? '<br>bass right' : '')}</small>` : ''}</button>`;
    }).join('');
    $('#eslots').querySelectorAll('.eslot').forEach((b) => b.onclick = () => {
      const i = +b.dataset.i;
      if (checked) { playOne(i); return; }
      if (i < round.given) return;
      sel = i; partial = {}; drawSlots();
    });
    $('#echeckb').disabled = !checked && answer.some((x) => !x);
  }
  function fill(tok) {
    if (checked || sel < 0) return;
    answer[sel] = tok; partial = {}; lastFilled = sel;
    const nextEmpty = answer.findIndex((x, i) => !x && i > sel);
    sel = nextEmpty >= 0 ? nextEmpty : answer.findIndex((x) => !x);
    drawSlots();
  }
  function drawPad() {
    if (pad.kind === 'buttons') {
      const groups = [['T', 'Tonic'], ['PD', 'Predominant'], ['D', 'Dominant']].map(([f, name]) => [name, pad.tokens.filter((x) => P.functionOf(x) === f)]).filter(([, xs]) => xs.length);
      $('#epad').innerHTML = `<div class="efuncs">${groups.map(([name, xs]) => `<div><div class="erowlabel">${name}</div><div class="ebtns col">${xs.map((tok) => `<button data-tok="${tok}">${fmt(P.label(tok))}</button>`).join('')}</div></div>`).join('')}</div>`;
      $('#epad').querySelectorAll('[data-tok]').forEach((b) => b.onclick = () => fill(b.dataset.tok));
      return;
    }
    $('#epad').innerHTML = `
      <div class="erowlabel">Root</div><div class="ebtns deg">${P.DEGREES.map((d, i) => `<button data-deg="${i}" class="${partial.deg === i ? 'on' : ''}">${fmt(d)}</button>`).join('')}</div>
      <div class="erowlabel">Type</div><div class="ebtns">${pad.qualities.map((q) => `<button data-q="${q}" class="${partial.q === q ? 'on' : ''}">${esc(P.QUALITY_BUTTONS[q] || q)}</button>`).join('')}</div>
      ${pad.inversions ? `<div class="erowlabel">Bass</div><div class="ebtns">${['1', '3', '5', '7'].map((b) => `<button data-bass="${b}">${b === '1' ? 'root' : '/' + b}</button>`).join('')}</div><p class="emuted ebasshint">Bass changes the chord you just entered</p><div hidden></div>` : ''}`;
    // root and type fill the slot (root position); the bass row then re-voices the chord just entered
    $('#epad').querySelectorAll('[data-deg]').forEach((b) => b.onclick = () => { partial.deg = +b.dataset.deg; if (partial.q) return done(); drawPad(); drawSlots(); });
    $('#epad').querySelectorAll('[data-q]').forEach((b) => b.onclick = () => { partial.q = b.dataset.q; if (partial.deg !== undefined) return done(); drawPad(); drawSlots(); });
    $('#epad').querySelectorAll('[data-bass]').forEach((b) => b.onclick = () => {
      if (lastFilled < 0 || !answer[lastFilled] || checked) return;
      const c = P.chordOf(answer[lastFilled], round.tonic);
      const bass = b.dataset.bass === '7' && T.getChord(c.quality).ivs.length < 4 ? '1' : b.dataset.bass;
      answer[lastFilled] = P.tokenOf(c.deg, c.quality, bass); drawSlots();
    });
    function done() { fill(P.tokenOf(partial.deg, partial.q, '1')); drawPad(); }
  }
  function highlight(i) { app.querySelectorAll('.eslot').forEach((b) => b.classList.toggle('now', +b.dataset.i === i)); }
  // play the round (or `what`: only its bass line, or the answer given) with the slots lit as each chord sounds
  async function play(withCadence = false, what = 'round') {
    stopPlay();
    await S.unlockAudio();
    const t0 = S.now() + 0.1;
    let start = t0;
    if (withCadence && round.cadence) start = P.scheduleCadence(round, t0, st.sound) + 0.9;
    let r = round, v = sounding();
    if (what === 'bass') v = v.map((p) => p && { notes: [p.notes.reduce((a, n) => (n.midi < a.midi ? n : a))] });
    if (what === 'yours') {
      r = { ...round, tokens: answer, chart: null, loops: 1, secs: round.chart ? 240 / round.tempo : round.secs };
      v = st.sound === 'guitar' ? P.voicings(r) : P.keysVoicings(r);
    }
    const { end, marks } = P.schedule(r, v, start, { instrument: st.sound });
    if (st.drone && what !== 'bass') { // the tonic, held low under the round (hear each chord against home)
      const d = S.tone(36 + ((T.notePc(round.tonic) - 0) % 12), t0, { attack: 1, pluckLevel: 0, level: 0.06, send: 0.3 });
      const d2 = S.tone(48 + T.notePc(round.tonic), t0, { attack: 1, pluckLevel: 0, level: 0.035, send: 0.3 });
      d.stop(end + 0.3, 1.2); d2.stop(end + 0.3, 1.2);
    }
    playing = [];
    const at = (t, fn) => playing.push(setTimeout(fn, Math.max(0, (t - S.now()) * 1000)));
    if (start > t0) { status('Setting the key…'); at(start - 0.5, () => status('')); }
    if (what === 'bass') at(start, () => status('The bass line'));
    if (what === 'yours') at(start, () => status('Your answer'));
    marks.forEach((m) => at(m.t, () => highlight(m.i)));
    at(end + 0.4, () => { highlight(-1); status(''); playing = null; });
  }
  async function playOne(i) {
    stopPlay(); await S.unlockAudio();
    const wrong = checked && answer[i] && !P.same(P.chordOf(answer[i], round.tonic), P.chordOf(round.tokens[i], round.tonic));
    if (wrong) { // the chord before, then what you said; the chord before, then what it was
      const before = round.tokens[i - 1] || (round.minor ? 'i:min' : 'I:maj');
      let t = S.now() + 0.05;
      for (const pairToks of [[before, answer[i]], [before, round.tokens[i]]]) {
        const r = { ...round, tokens: pairToks, chart: null, loops: 1, secs: 1.4 };
        t = P.schedule(r, st.sound === 'guitar' ? P.voicings(r) : P.keysVoicings(r), t, { instrument: st.sound }).end + 0.6;
      }
      status(`${P.label(before)} → ${P.label(answer[i])} (yours), then ${P.label(before)} → ${P.label(round.tokens[i])}`);
      highlight(i);
      playing = [setTimeout(() => { highlight(-1); status(''); }, (t - S.now()) * 1000)];
      return;
    }
    const { end } = P.schedule({ ...round, loops: 1 }, sounding(), S.now() + 0.05, { onlyIndex: i, instrument: st.sound });
    highlight(i);
    playing = [setTimeout(() => highlight(-1), (end - S.now()) * 1000)];
  }
  // what the progression is and what each chord does; tapping a chord plays it
  function drawLearn() {
    const m = learnMore(round);
    $('#elearn').innerHTML = `${m.title ? `<h3>${esc(m.title)}</h3>${m.by ? `<p class="eby">${esc(m.by)}</p>` : ''}${m.about ? `<p>${esc(m.about)}</p>` : ''}` : ''}
      <ol class="ewalk">${m.chords.map((c, i) => `<li data-i="${i}"><span class="ernum">${fmt(c.label)}</span><span><b>${fmt(c.name)}</b> ${fmt(c.text)}</span></li>`).join('')}</ol>`;
    $('#elearn').querySelectorAll('li').forEach((li) => li.onclick = () => playOne(+li.dataset.i));
  }
  $('#eplay').onclick = () => play(false);
  $('#ebass').onclick = () => play(false, 'bass');
  $('#edrone').onclick = (e) => { st.drone = !st.drone; save(); e.target.classList.toggle('on', st.drone); e.target.setAttribute('aria-pressed', st.drone); };
  $('#ekeyb').onclick = async () => { stopPlay(); await S.unlockAudio(); const end = P.scheduleCadence(round, S.now() + 0.05, st.sound); status(round.minor ? 'The key: i–iv–V–i' : 'The key: I–IV–V–I'); playing = [setTimeout(() => status(''), (end - S.now()) * 1000)]; };
  $('#esound').onchange = (e) => { st.sound = e.target.value; save(); S.warm(st.sound, range(36, 80)); play(false); };
  const sounding = () => (st.sound === 'guitar' ? pls : kpls);
  $('#eundo').onclick = () => {
    if (checked) return;
    if (partial.deg !== undefined) { partial = {}; drawPad(); drawSlots(); return; }
    let i = sel >= 0 && answer[sel] && sel >= round.given ? sel : answer.reduce((last, x, k) => (x && k >= round.given ? k : last), -1);
    if (i < round.given) return;
    answer[i] = null; sel = i; drawSlots();
  };
  $('#echeckb').onclick = () => {
    if (checked) { newRound(); return; }
    checked = true;
    const right = round.tokens.map((tok, i) => P.same(P.chordOf(answer[i], round.tonic), P.chordOf(tok, round.tonic)));
    const perfect = right.every(Boolean);
    right.forEach((ok, i) => { if (!ok) { const k = `${P.label(round.tokens[i])} → ${P.label(answer[i])}`; st.conf[k] = (st.conf[k] || 0) + 1; } });
    rec.hist.push(perfect); rec.hist = rec.hist.slice(-30);
    rec.streak = perfect ? rec.streak + 1 : 0;
    const wasPassed = rec.passed;
    if (!rec.passed && isPass(L, rec)) rec.passed = true;
    save();
    const keyName = `${T.noteName(round.tonic, true)} ${round.minor ? 'minor' : 'major'}`;
    $('#eresult').innerHTML = `<p class="everdict">${perfect ? '<b class="eok">Perfect.</b>' : `<b class="eno">${right.filter(Boolean).length} of ${right.length}.</b>`} In ${fmt(keyName)}.${round.song ? ` That was <b>${esc(round.song.song)}</b>.` : ''}</p>
      <p class="emuted">${perfect ? 'Tap a chord to hear it alone.' : 'Tap a wrong chord to hear the chord before it into yours, then into the right one.'}</p>
      <div class="econtrols"><button id="elearnb" class="eaccent">Learn more</button>${perfect ? '' : '<button id="eyours">Your answer</button>'}<button id="eagain">Again</button></div>
      ${!wasPassed && rec.passed ? `<div class="etrophy">${L.streak ? '🏆 You beat the game.' : `Level passed. ${idx + 1 < P.LEVELS.length ? `Next: ${esc(P.LEVELS[idx + 1].title)}.` : ''}`}</div>` : ''}`;
    $('#epad').hidden = true;
    $('#echeckb').textContent = 'Next';
    $('#echeckb').disabled = false;
    drawSlots(); meter();
    if (!perfect) $('#eyours').onclick = () => play(false, 'yours');
    $('#eagain').onclick = () => play(false);
    $('#elearnb').onclick = () => { const el = $('#elearn'); if (el.hidden) drawLearn(); el.hidden = !el.hidden; $('#elearnb').textContent = el.hidden ? 'Learn more' : 'Hide'; if (!el.hidden) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); };
    play(false);
  };
  newRound();
}

// ---------- an audiation session ----------
function session(ses) {
  const rec = (st.aud[ses.id] ||= { done: false, held: 0, total: 0, runs: 0 });
  app.innerHTML = `
    <header class="ehead"><button class="eback" id="eback" aria-label="Back">‹</button><h1>${ses.id} · ${esc(ses.title)}</h1><span id="ekeyname"></span></header>
    <main class="ebody ses">
      <div class="ecue" id="ecue"></div>
      <details class="echord" id="echord"><summary><span id="ecname">&nbsp;</span></summary><p id="ecabout"></p></details>
      <div class="eneckwrap ${st.eyes ? 'eyes' : ''}" id="eneck"></div>
      <p class="eline" id="eline">${esc(ses.about)}</p>
      <div class="etaps" id="etaps" hidden><span>Did you have it?</span><button data-got="1">Yes</button><button data-got="0">No</button></div>
      <div class="econtrols"><button id="estart" class="eprimary">▶ Start</button><button id="epause" hidden>Pause</button></div>
      <p class="emuted ehint">Headphones help. The chord name drops down to show its intervals and where it comes from.</p>
    </main>`;
  const neck = createNeck($('#eneck'));
  let run = null, tapTimer = null;
  $('#eback').onclick = () => go(home);
  cleanup = () => { if (run) run.stop(); clearTimeout(tapTimer); };
  const taps = $('#etaps');
  taps.querySelectorAll('button').forEach((b) => b.onclick = () => { if (run?.lastCheck) run.lastCheck.got = b.dataset.got === '1'; taps.hidden = true; });
  $('#estart').onclick = async () => {
    await S.unlockAudio(); S.awake(true);
    $('#estart').hidden = true; $('#epause').hidden = false; $('#epause').textContent = 'Pause';
    run = new A.Run({
      neck,
      onLine: (l) => { $('#eline').textContent = l; },
      onCue: (c) => { $('#ecue').textContent = c; },
      onChord: (ch) => {
        if (!ch) { $('#ecname').innerHTML = '?'; $('#ecabout').textContent = ''; return; }
        $('#ecname').textContent = T.pretty(T.chordSymbol(ch.root, ch.quality));
        $('#ecabout').textContent = A.QUALITY_ABOUT[ch.quality] || T.getChord(ch.quality).ivs.map(T.prettyIv).join(' ');
      },
      onCheck: (r) => { run.lastCheck = r; taps.hidden = false; clearTimeout(tapTimer); tapTimer = setTimeout(() => { taps.hidden = true; }, 4500); },
      onEnd: (finished, err) => {
        S.awake(false); taps.hidden = true;
        $('#epause').hidden = true; $('#estart').hidden = false; $('#estart').textContent = '▶ Again';
        if (err) { $('#eline').textContent = 'Something went wrong: ' + err.message; return; }
        if (!finished) return;
        const answered = run.checks.filter((c) => c.got !== null);
        rec.done = true; rec.runs++; rec.held = answered.filter((c) => c.got).length; rec.total = answered.length; save();
        const nextSes = A.SESSIONS[A.SESSIONS.indexOf(ses) + 1];
        $('#eline').innerHTML = `Done.${answered.length ? ` You had ${rec.held} of ${answered.length} you rated.` : ''} ${rec.total && rec.held / rec.total < 0.7 ? 'Worth repeating tomorrow before moving on.' : nextSes ? `Next: ${esc(nextSes.id)} · ${esc(nextSes.title)}.` : ''}`;
      },
    });
    const key = st.key === 'random' ? null : st.key;
    A.runSession(ses, run, { key }).then(() => {});
    $('#ekeyname').textContent = 'in ' + T.noteName(run.key || T.parseNote('C'), true);
  };
  $('#epause').onclick = () => { if (!run) return; run.pause(!run.paused); $('#epause').textContent = run.paused ? 'Resume' : 'Pause'; };
}

// on the home screen Ear is its own app: no way back into Guitar Cards, and it works offline
const standalone = matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
if ('serviceWorker' in navigator && location.protocol !== 'file:') navigator.serviceWorker.register('sw.js').catch(() => {});
const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
S.warm(st.sound, st.sound === 'piano' ? range(36, 76) : range(40, 80));
home();
