// Tunes and progressions: what to have memorised. Standards (rung by rung, each with its changes, in any key, the
// original key marked, a few words and a record to learn the melody from) and Progressions (one long list, written
// out in any key). Just chords and numerals: no fingerings and no sound but a metronome, which also walks through a
// tune's bars. Charts can be made more complex a step at a time (the Exploder's reharmoniser).
import * as T from '../theory.js';
import * as A from '../audio.js';
import * as L from '../caged/library.js';
import * as H from '../caged/harmony.js';
import { explodeSteps } from './reharm.js';
import { RUNGS, PRACTICE_ORDER, ROTATION } from './standards.js';

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const fmt = (s) => esc(T.pretty(String(s ?? '')));
const KEYS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
const MKEYS = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'G#', 'A', 'Bb', 'B'];
const pcOf = (k) => T.notePc(T.parseNote(k));
const keyName = (pc, minor) => (minor ? MKEYS : KEYS)[pc];
const libBy = (name) => L.ALL.find((p) => p.name === name);
// every tune as a library-style item: chart + key (+ minor), or null when there's no chart
function itemOfTune(t) {
  if (t.lib) { const p = libBy(t.lib); return p ? { ...p, minor: t.minor ?? p.minor } : null; }
  return t.chart ? { chart: t.chart, key: t.key, minor: !!t.minor } : null;
}
const homeKey = (item, t) => (item?.key || t?.key || 'C');
// the progression list: every library item but the standards
const PROG_CATS = ['Cadences', 'Turnarounds and jazz moves', 'Blues', 'Pop and rock', 'Modal vamps', 'Classical patterns', 'Borrowed chords', 'Chromatic chords', 'Modulations', 'Voice leading', 'Bass lines and slash chords'];
const CAT_BLURB = {
  'Borrowed chords': 'Modal interchange: chords borrowed from the parallel minor (and other modes), each in the progressions that use it.',
  'Chromatic chords': 'Secondary dominants, tritone subs, diminished and augmented passing chords.',
  Modulations: 'Ways of changing key, from the smooth to the sudden.',
};
// the core set to know cold before the rest
const CORE = ['Major ii–V–I', 'Minor ii–V–i', 'I–vi–ii–V', 'iii–vi–ii–V–I', 'I–VI7–ii–V7', 'Tritone-sub turnaround', 'Backdoor cadence', 'Minor plagal (IV–iv–I)', 'Jazz minor plagal',
  'Rhythm changes, A section', 'Rhythm changes, bridge', '12-bar blues', 'Jazz blues', 'Minor blues', 'Bird blues', 'Andalusian cadence', 'Passing diminished', 'Descending ii–Vs', 'Coltrane substitution', 'Montgomery-Ward bridge', 'Minor turnaround', 'Deceptive cadence (V–vi)'];

// a chart's chords in a key, bar by bar: { name, rn, say, beats }
function barsOf(item, keyPc, level = 0, seed = 1, bpb = 4) {
  const minor = !!item.minor;
  const tonic = T.parseNote(keyName(keyPc, minor));
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
    let rn = ''; try { rn = H.numeral(c.iv, c.q) + (c.bass && c.bass !== '1' ? `/${T.prettyIv ? T.prettyIv(c.bass) : c.bass}` : ''); } catch (e) { rn = ''; }
    const m = /^(bb|b|#)?(\d+)$/.exec(c.iv);
    const say = m ? `${{ b: '♭', bb: '𝄫', '#': '♯' }[m[1]] || ''}${m[2]}` : c.iv;
    return { name: T.chordSymbol(root, c.q) + bass, rn, say, beats: c.beats };
  }));
}
const levelsOf = (item) => { try { return explodeSteps(item, 1, 5).length - 1; } catch (e) { return 0; } };

const GUIDE = `
<h3>How to memorise tunes and progressions</h3>
<p><b>Learn the root motion, not the grips.</b> A progression is its roots as numbers in the key: Autumn Leaves (from the relative major) is 2 5 1 4 7 3 6. That's true in every key. Grip-by-grip learning ties a tune to one key and one set of shapes; numbers move anywhere.</p>
<p><b>Know your keys on the neck first.</b> You can't find "the 4 chord" fast without seeing the key. Pick a CAGED area of the key and find every root of the progression there, without moving the hand, then do it in each of the five areas.</p>
<p><b>Say it, write it, recite it.</b> Treat it like a phone number: write the numbers out 10–20 times, say them out loud away from the guitar, then play while you say each one as it comes ("two… five… one…"). Talking yourself through it is how you find chords in time instead of reciting grips.</p>
<p><b>Chunk tunes into keys, measured from home.</b> For tunes that modulate, name each key centre and the pattern inside it, and measure every new key from the tune's home key, not from the last chord. All the Things You Are: 6 2 5 1 4 at home; 2 5 1 a 3rd up; 6 2 5 1 4 a 5th up; 2 5 1 a 7th up; 2 5 1 a ♭6 up; then home. Blue Bossa: 6 2 7ø 3 6 in one key, then 2 5 1 a whole step down.</p>
<p><b>Name the common shapes.</b> Most tunes are made of a dozen moves: ii–V–I, minor ii–V–i, I–vi–ii–V, III7–VI7–II7–V7, IV–iv, backdoor ♭VII7, tritone subs. Learn them as single words (the Progressions list) and a tune becomes a short sentence of them.</p>
<p><b>Know the form.</b> 12-bar blues, AABA 32, ABAC 32. Label the sections, then learn only what's different: most AABA tunes are one A, one bridge.</p>
<p><b>Test yourself; don't just reread.</b> Close the chart and play it, or say it, from memory, then check. Getting it back out (retrieval) is what makes it stick; looking at it again feels like learning but isn't.</p>
<p><b>Space it out.</b> A few minutes a day over many days beats an hour once. Come back to a tune the next day, then a few days later, then a week later; keep 4–6 in rotation.</p>
<p><b>Change the key.</b> Once it's in one key, play it in a second and a third (the key menu here). If you can only do it in one key, you've memorised grips, not the tune.</p>
<p><b>Hear it.</b> Learn the melody by ear from a record, sing the bass line (the roots) and the guide tones (3rds and 7ths). A tune you can sing, you can't forget.</p>`;

export const DEF_TP = { tab: 'tunes', key: 'orig', nums: true, say: true, bpm: 100, metro: false, open: null, level: 0, seed: 1, tkey: null };

export function repertoire(app, { S, save, back }) {
  const O = S.tp;
  const R = { timer: null, bar: -1, beat: -1, nextT: 0, bars: null, bpb: 4 };
  const ctx = () => A.audioCtx();

  // ----- metronome (and, on a tune, the bar it's on) -----
  function stopMetro() { clearInterval(R.timer); R.timer = null; R.bar = -1; R.beat = -1; }
  async function startMetro() {
    stopMetro();
    await A.unlockAudio(); await A.ensureRunning();
    R.nextT = ctx().currentTime + 0.1; R.beat = -1; R.bar = -1;
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
    const dots = app.querySelectorAll('.tpdots i');
    dots.forEach((d, i) => d.classList.toggle('on', i === beat));
    if (!R.bars) return;
    app.querySelectorAll('.tpbar.now').forEach((b) => b.classList.remove('now'));
    const el = app.querySelector(`.tpbar[data-bar="${bar}"]`);
    if (el) { el.classList.add('now'); if (beat === 0 && O.follow !== false) { const r = el.getBoundingClientRect(); if (r.top < 120 || r.bottom > innerHeight - 20) el.scrollIntoView({ block: 'center', behavior: 'smooth' }); } }
  }

  // ----- pieces -----
  const metroBar = (bpb) => `<div class="tpmetro">
      <button class="tpm ${O.metro ? 'on' : ''}" data-t="metro">${O.metro ? '■' : '▶'} <small>metronome</small></button>
      <button data-t="bpm-">−</button><b>${O.bpm}</b><small>bpm</small><button data-t="bpm+">+</button>
      <span class="tpdots">${Array.from({ length: bpb }, (_, i) => `<i class="${i === 0 ? 'one' : ''}"></i>`).join('')}</span>
    </div>`;
  const toggles = () => `<div class="tptog"><button data-t="nums" class="${O.nums ? 'on' : ''}">Numerals</button><button data-t="say" class="${O.say ? 'on' : ''}">Say it</button></div>`;
  function chartHTML(bars) {
    return `<div class="tpchart">${bars.map((b, i) => `<div class="tpbar" data-bar="${i}">${b.map((c) => `<span class="tpc" style="flex:${c.beats}"><b>${fmt(c.name)}</b>${O.nums ? `<i>${fmt(c.rn)}</i>` : ''}</span>`).join('')}</div>`).join('')}</div>`;
  }
  const sayLine = (bars) => `<p class="tpsay">${bars.map((b) => b.map((c) => c.say).join(' ')).join(' | ')}</p>`;
  function keySelect(home, minor, cur) {
    const hp = pcOf(home);
    return `<select class="sel tpkey" data-tsel="tkey">${KEYS.map((k, i) => `<option value="${i}" ${i === cur ? 'selected' : ''}>${fmt(keyName(i, minor))}${minor ? ' minor' : ''}${i === hp ? '  ★ original' : ''}</option>`).join('')}</select>`;
  }

  // ----- lists -----
  function listTunes() {
    return RUNGS.map((r) => `<section class="card tprung"><h3>${esc(r.name)}</h3>${r.blurb ? `<p class="hint">${fmt(r.blurb)}</p>` : ''}
      ${r.tunes.map((t, i) => { const it = itemOfTune(t); const k = homeKey(it, t); return `<button class="tprow" data-open="${r.id}:${i}"><b>${esc(t.t)}</b><span>${esc(t.by)} · ${fmt(keyName(pcOf(k), it?.minor ?? t.minor))}${(it?.minor ?? t.minor) ? ' minor' : ''}${it ? '' : ' · no chart'}</span>${t.teaches ? `<small>${esc(t.teaches)}</small>` : ''}</button>`; }).join('')}
    </section>`).join('') + `<section class="card"><h3>For each tune</h3><ol class="tpol">${PRACTICE_ORDER.map((p) => `<li>${esc(p)}</li>`).join('')}</ol><p class="hint">${esc(ROTATION)}</p></section>`;
  }
  function listProgs() {
    const kpc = O.key === 'orig' ? null : Number(O.key);
    const one = (p) => {
      const home = pcOf(p.key || 'C'), bars = barsOf(p, kpc ?? home);
      return `<div class="tpprog"><p class="tppn"><b>${fmt(p.name)}</b> <small>${fmt(p.by || '')} · ${fmt(keyName(kpc ?? home, p.minor))}${p.minor ? ' minor' : ''}</small></p>
        <p class="tpline">${bars.map((b) => b.map((c) => `<b>${fmt(c.name)}</b>${O.nums ? `<i>${fmt(c.rn)}</i>` : ''}`).join(' ')).join('<span class="sep">|</span>')}</p>
        ${O.say ? sayLine(bars) : ''}${p.note ? `<p class="hint">${fmt(p.note)}</p>` : ''}</div>`;
    };
    const core = CORE.map(libBy).filter(Boolean);
    return `<section class="card"><h3>The core: know these cold</h3>${core.map(one).join('')}</section>`
      + PROG_CATS.map((c) => { const ps = L.ALL.filter((p) => p.cat === c && !CORE.includes(p.name)); return ps.length ? `<details class="card tpcat"><summary>${esc(c)} <small>${ps.length}</small></summary>${CAT_BLURB[c] ? `<p class="hint">${esc(CAT_BLURB[c])}</p>` : ''}${ps.map(one).join('')}</details>` : ''; }).join('');
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
        <p class="hint">No melody is played here: the tunes are under copyright, and learning the melody by ear from the record is the first step anyway.</p>
      </section>`;
  }

  // ----- the screen -----
  function draw() {
    stopMetro(); O.metro = false;
    if (O.open) {
      const [rid, i] = O.open.split(':'), t = RUNGS.find((r) => r.id === rid)?.tunes[Number(i)];
      if (t) { app.innerHTML = tuneHTML(t); return; }
      O.open = null;
    }
    R.bars = null; R.bpb = 4;
    app.innerHTML = `
    <header class="bar"><button class="icon" data-t="back" aria-label="Back">‹</button><h2>Tunes</h2><span></span></header>
    <div class="seg tptabs"><button data-t="tab" data-v="tunes" class="${O.tab === 'tunes' ? 'on' : ''}">Standards</button><button data-t="tab" data-v="progs" class="${O.tab === 'progs' ? 'on' : ''}">Progressions</button></div>
    ${O.tab === 'progs' ? `<div class="tpkeyrow"><select class="sel" data-tsel="key"><option value="orig" ${O.key === 'orig' ? 'selected' : ''}>Each in its usual key (C unless named)</option>${KEYS.map((k, i) => `<option value="${i}" ${String(O.key) === String(i) ? 'selected' : ''}>All in ${fmt(k)}</option>`).join('')}</select><button class="tphow" data-t="how">How to memorise</button></div>${metroBar(4)}${toggles()}${listProgs()}` : listTunes()}
    <div class="sheet tpsheet" id="tphow" hidden><button class="icon tpx" data-t="howx" aria-label="Close">✕</button>${GUIDE}</div>`;
  }
  app.onclick = async (e) => {
    const b = e.target.closest('button'); if (!b) return;
    const a = b.dataset.t;
    if (b.dataset.open) { O.open = b.dataset.open; O.tkey = null; O.level = 0; O.seed = 1; save(); draw(); window.scrollTo(0, 0); return; }
    if (!a) return;
    if (a === 'back') { stopMetro(); app.onclick = null; app.onchange = null; back(); return; }
    if (a === 'close') { const was = O.open; O.open = null; save(); draw(); const el = app.querySelector(`[data-open="${was}"]`); if (el) el.scrollIntoView({ block: 'center' }); return; }
    if (a === 'tab') { O.tab = b.dataset.v; save(); draw(); return; }
    if (a === 'how') { const s = app.querySelector('#tphow'); s.hidden = false; s.scrollTop = 0; return; }
    if (a === 'howx') { app.querySelector('#tphow').hidden = true; return; }
    if (a === 'metro') { O.metro = !O.metro; if (O.metro) await startMetro(); else stopMetro(); b.classList.toggle('on', O.metro); b.innerHTML = `${O.metro ? '■' : '▶'} <small>metronome</small>`; if (!O.metro) app.querySelectorAll('.tpbar.now').forEach((x) => x.classList.remove('now')); return; }
    if (a === 'bpm-' || a === 'bpm+') { O.bpm = Math.max(40, Math.min(280, O.bpm + (a === 'bpm+' ? 4 : -4))); save(); b.parentElement.querySelector('b').textContent = O.bpm; return; }
    const y = window.scrollY;
    if (a === 'nums' || a === 'say') { O[a] = !O[a]; save(); draw(); window.scrollTo(0, y); return; }
    if (a === 'lv-' || a === 'lv+') { O.level = Math.max(0, O.level + (a === 'lv+' ? 1 : -1)); save(); draw(); window.scrollTo(0, y); return; }
    if (a === 'seed') { O.seed = (O.seed || 1) + 1; save(); draw(); window.scrollTo(0, y); }
  };
  app.onchange = (e) => {
    const k = e.target.dataset.tsel; if (!k) return;
    O[k] = k === 'tkey' ? Number(e.target.value) : e.target.value; save();
    const y = window.scrollY; draw(); window.scrollTo(0, y);
  };
  draw();
  window.scrollTo(0, 0);
}
