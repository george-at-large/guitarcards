// Progressions: learn a progression by heart and play with it. Under each chord a spider opens its substitutions
// (tritone sub, related ii, backdoor, borrowed iv, passing diminished…, from src/subs.js); in each gap between chords
// a spider adds an approach chord (its V7, a ii–V, a ♭II7, a passing °7). An added chord takes half the time of the
// chord before it, so the bar length never changes and the loop stays on the click. Hide names or numerals to test
// your memory; tap a chord to peek.
import * as A from '../audio.js';
import * as T from '../theory.js';
import * as H from '../caged/harmony.js';
import { ALL, resolve } from '../caged/library.js';
import { substitutions } from '../subs.js';
import { voiceRun } from './micore.js';
import { spellTonic, nn, pick, esc, typeName } from './core.js';

const CATS = ['Cadences', 'Pop and rock', 'Modal vamps', 'Blues', 'Turnarounds and jazz moves', 'Classical patterns', 'Jazz standards', 'Borrowed chords', 'Chromatic chords'];
const SHAPES = ['C', 'A', 'G', 'E', 'D'];
const HIDE = [['show', 'Show all'], ['names', 'Hide names'], ['rn', 'Hide numerals'], ['all', 'Hide both']];
const SPIDER = '<svg viewBox="0 0 20 14" width="20" height="14" aria-hidden="true"><g stroke="currentColor" stroke-width="1.3" fill="none" stroke-linecap="round"><path d="M10 7 L3 2 M10 7 L2 7 M10 7 L3 12 M10 7 L17 2 M10 7 L18 7 M10 7 L17 12"/></g><circle cx="10" cy="7" r="2.6" fill="currentColor"/></svg>';

export default {
  id: 'progressions',
  title: 'Progressions',
  blurb: 'Memorise a progression, then reharmonise it: a spider of substitutions under every chord and approach chords in the gaps, looping in time.',
  kind: 'player',
  tools: { drone: true },
  keyed: true,
  options: [
    { id: 'cats', label: 'From', type: 'multi', def: ['Cadences', 'Turnarounds and jazz moves', 'Jazz standards', 'Pop and rock', 'Blues'], choices: CATS.map((c) => [c, c]) },
    { id: 'key', label: 'Key', type: 'one', def: 'weighted', choices: [['weighted', 'Your keys (weighted)'], ['own', 'Songs in their own key']] },
    { id: 'shape', label: 'Position', type: 'one', def: 'any', choices: [['any', 'Any'], ...SHAPES.map((s) => [s, `${s} shape`])] },
  ],
  pool(c) {
    return ALL.filter((it) => c.cats.includes(it.cat) && it.chart).map((it) => ({ id: `pm|${it.id}`, mode: 'progressions', label: it.name, params: { id: it.id } }));
  },
  make(it, pc, ctx) {
    const item = ALL.find((x) => x.id === it.params.id);
    const own = ctx.cfg.key === 'own' && item.key;
    const tonic = own ? T.parseNote(item.key) : spellTonic(pc, item.minor ? 'aeolian' : 'major');
    const seq = [];
    resolve(item).forEach((bar, bi) => bar.forEach((c) => {
      const root = H.spell(tonic, c.iv);
      seq.push({ root, q: c.q, beats: 4 / bar.length, bar: bi, orig: { root, q: c.q } });
    }));
    const shape = ctx.cfg.shape === 'any' ? pick(SHAPES) : ctx.cfg.shape;
    return {
      kicker: `${esc(nn(tonic))} ${item.minor ? 'minor' : 'major'} · ${shape} shape · ${esc(item.cat)}`,
      title: esc(item.name), sub: esc(item.by || ''), item, tonic, seq, shape, minor: !!item.minor,
      droneMidi: 40 + ((T.notePc(tonic) - 4 + 12) % 12),
    };
  },
  mount(q, el, ctx) {
    const st = Object.assign({ bpm: 84, click: true, hide: 'show' }, ctx.state.pm || {});
    ctx.state.pm = st;
    const seq = q.seq;
    let open = null; // {kind:'chord'|'gap', i}
    const peek = new Set();
    let playing = false, grips = null;
    const name = (c) => T.pretty(T.chordSymbol(c.root, c.q)).replace(/\s+/g, '');
    const rn = (c) => H.numeral(H.ivFrom(q.tonic, c.root), c.q);
    const beatsTxt = (b) => (b === 4 ? '' : b === 2 ? '½' : b === 1 ? '¼' : b === 3 ? '¾' : b === 0.5 ? '⅛' : '');

    const draw = () => {
      const nBars = Math.max(...seq.map((c) => c.bar)) + 1;
      const bars = [...Array(nBars).keys()].map((b) => seq.map((c, i) => ({ c, i })).filter((x) => x.c.bar === b));
      el.innerHTML = `
        <div class="pmtools">
          <button class="tog ${playing ? 'on' : ''}" id="pplay">${playing ? '■ Stop' : '▶ Loop'}</button>
          <button class="tog ${st.click ? 'on' : ''}" id="pclick">Click</button>
          <button class="sq" id="pdown">−</button><span class="bpm">${st.bpm}</span><button class="sq" id="pup">+</button>
          <button class="tog" id="phide">${HIDE.find((h) => h[0] === st.hide)[1]}</button>
          <button class="tog" id="preset">Reset</button>
        </div>
        <div class="pmbars">${bars.map((bar, bi) => `<div class="pmbar ${bar.length >= 3 ? 'wide' : ''}"><small class="bn">${bi + 1}</small>${bar.map(({ c, i }) => {
          const changed = c.ins || c.root.letter !== c.orig.root.letter || c.root.acc !== c.orig.root.acc || c.q !== c.orig.q;
          const hideN = !peek.has(i) && (st.hide === 'names' || st.hide === 'all');
          const hideR = !peek.has(i) && (st.hide === 'rn' || st.hide === 'all');
          const last = i === seq.length - 1;
          return `<div class="pmc ${changed ? 'sub' : ''} ${open && open.kind === 'chord' && open.i === i ? 'open' : ''}" data-ci="${i}" style="flex:${c.beats}">
              <button class="pmname" data-peek="${i}"><b>${hideN ? '?' : esc(name(c))}</b><small>${hideR ? '·' : esc(rn(c))}${beatsTxt(c.beats) ? ` <i>${beatsTxt(c.beats)}</i>` : ''}</small>${!hideN && typeName(c.q) ? `<small class="tn">${typeName(c.q)}</small>` : ''}</button>
              <button class="spider" data-spider="${i}" aria-label="Substitutions for this chord">${SPIDER}</button>
            </div>${last ? '' : `<button class="gap ${open && open.kind === 'gap' && open.i === i ? 'open' : ''}" data-gap="${i}" aria-label="Add a chord here">+</button>`}`;
        }).join('')}</div>`).join('')}</div>
        <div id="pmenu">${open ? menu() : `<p class="note">Tap a spider ${SPIDER} for substitutions, a + to add an approach chord. Added chords take half the time of the chord before them, so the loop stays in time.</p>`}</div>`;
      bind();
    };

    // ---------- the spiders ----------
    function chordOptions(i) {
      const c = seq[i], next = seq[i + 1] || seq[0];
      const out = [];
      try {
        for (const s of substitutions({ root: c.root, quality: c.q }, { root: next.root, quality: next.q }, { tonic: q.tonic })) {
          const p = T.parseChordToken(s.token, q.tonic);
          out.push({ label: s.label, why: s.why, chords: [{ root: p.root, q: p.quality }] });
        }
      } catch (e) { /* */ }
      return out;
    }
    function gapOptions(i) {
      const t = seq[i + 1], r = t.root, minorish = H.isMinorish(t.q);
      const S = (n, semis) => T.transposeSemis(n, semis);
      const opts = [
        { label: `Its dominant: V7 of ${name(t)}`, why: 'A secondary dominant a 5th above, resolving down into it.', chords: [{ root: T.transpose(r, '5'), q: minorish ? '7b9' : '7' }] },
        { label: `A ii–V into ${name(t)}`, why: 'Its own ii and V, sharing the time of the chord before.', chords: [{ root: T.transpose(r, '2'), q: minorish ? 'm7b5' : 'm7' }, { root: T.transpose(r, '5'), q: minorish ? '7b9' : '7' }], need: 2 },
        { label: 'Tritone approach (♭II7)', why: 'The tritone sub of its dominant: the bass slides down a half step into it.', chords: [{ root: S(r, 1), q: '7' }] },
        { label: 'Passing °7 from below', why: 'A diminished 7th a half step below, leading up into it.', chords: [{ root: S(r, -1), q: 'dim7' }] },
        { label: 'Chromatic approach from above', why: 'The same chord a half step higher, sliding down onto it.', chords: [{ root: S(r, 1), q: t.q }] },
        { label: 'Backdoor (♭VII7)', why: 'A dominant a whole step below: the backdoor way in, borrowed from the parallel minor.', chords: [{ root: T.transpose(r, 'b7'), q: '7' }] },
      ];
      return opts;
    }
    function menu() {
      if (open.kind === 'chord') {
        const c = seq[open.i];
        const opts = chordOptions(open.i);
        const changed = c.root.letter !== c.orig.root.letter || c.root.acc !== c.orig.root.acc || c.q !== c.orig.q;
        return `<div class="info"><div class="k">Instead of ${esc(name(c))} (${esc(rn(c))}${typeName(c.q) ? `, ${typeName(c.q)}` : ''})</div>
          <div class="choices">${c.ins ? `<button data-rm="1"><b>Take it out</b><small>Its time goes back to the chord before.</small></button>` : ''}
          ${changed && !c.ins ? `<button data-orig="1"><b>Back to ${esc(name({ root: c.orig.root, q: c.orig.q }))}</b><small>The original chord.</small></button>` : ''}
          ${opts.map((o, k) => `<button data-opt="${k}"><b>${esc(name(o.chords[0]))} · ${esc(rn(o.chords[0]))}</b> ${esc(o.label)}${typeName(o.chords[0].q) ? `<small class="tn">${typeName(o.chords[0].q)}</small>` : ''}<small>${esc(o.why)}</small></button>`).join('')}</div></div>`;
      }
      const prev = seq[open.i], t = seq[open.i + 1];
      const opts = gapOptions(open.i);
      return `<div class="info"><div class="k">Add before ${esc(name(t))} (${esc(rn(t))}), taking half of ${esc(name(prev))}’s ${prev.beats} beat${prev.beats === 1 ? '' : 's'}</div>
        <div class="choices">${opts.map((o, k) => {
          const room = prev.beats / 2 / (o.need || 1) >= 0.5;
          return `<button data-gopt="${k}" ${room ? '' : 'disabled'}><b>${o.chords.map((c) => `${esc(name(c))} · ${esc(rn(c))}`).join(' → ')}</b> ${esc(o.label)}${o.chords.some((c) => typeName(c.q)) ? `<small class="tn">${o.chords.map((c) => typeName(c.q)).filter(Boolean).join(' → ')}</small>` : ''}<small>${room ? esc(o.why) : 'No room: the chord before is too short.'}</small></button>`;
        }).join('')}</div></div>`;
    }
    const changedSeq = () => { grips = null; if (playing) { stop(); play(); } else draw(); };
    function bind() {
      el.querySelector('#pplay').onclick = () => (playing ? stop() : play());
      el.querySelector('#pclick').onclick = () => { st.click = !st.click; changedSeq(); };
      el.querySelector('#pdown').onclick = () => { st.bpm = Math.max(40, st.bpm - 4); changedSeq(); };
      el.querySelector('#pup').onclick = () => { st.bpm = Math.min(220, st.bpm + 4); changedSeq(); };
      el.querySelector('#phide').onclick = () => { const k = HIDE.findIndex((h) => h[0] === st.hide); st.hide = HIDE[(k + 1) % HIDE.length][0]; peek.clear(); draw(); };
      el.querySelector('#preset').onclick = () => { const orig = q.seq0; seq.splice(0, seq.length, ...orig.map((c) => ({ ...c }))); open = null; changedSeq(); };
      el.querySelectorAll('[data-peek]').forEach((b) => (b.onclick = () => { const i = Number(b.dataset.peek); if (st.hide === 'show') { A.unlockAudio(); strumAt(i); return; } peek.has(i) ? peek.delete(i) : peek.add(i); draw(); }));
      el.querySelectorAll('[data-spider]').forEach((b) => (b.onclick = () => { const i = Number(b.dataset.spider); open = open && open.kind === 'chord' && open.i === i ? null : { kind: 'chord', i }; draw(); }));
      el.querySelectorAll('[data-gap]').forEach((b) => (b.onclick = () => { const i = Number(b.dataset.gap); open = open && open.kind === 'gap' && open.i === i ? null : { kind: 'gap', i }; draw(); }));
      el.querySelectorAll('[data-opt]').forEach((b) => (b.onclick = () => { const o = chordOptions(open.i)[Number(b.dataset.opt)]; Object.assign(seq[open.i], { root: o.chords[0].root, q: o.chords[0].q }); changedSeq(); }));
      const orig = el.querySelector('[data-orig]'); if (orig) orig.onclick = () => { const c = seq[open.i]; Object.assign(c, { root: c.orig.root, q: c.orig.q }); changedSeq(); };
      const rm = el.querySelector('[data-rm]'); if (rm) rm.onclick = () => { const i = open.i; if (i > 0) seq[i - 1].beats += seq[i].beats; seq.splice(i, 1); open = null; changedSeq(); };
      el.querySelectorAll('[data-gopt]').forEach((b) => (b.onclick = () => {
        const i = open.i, prev = seq[i], o = gapOptions(i)[Number(b.dataset.gopt)];
        const half = prev.beats / 2, each = half / o.chords.length;
        prev.beats = half;
        const add = o.chords.map((c) => ({ root: c.root, q: c.q, beats: each, bar: prev.bar, ins: true, orig: { root: c.root, q: c.q } }));
        seq.splice(i + 1, 0, ...add);
        open = null; changedSeq();
      }));
    }

    // ---------- sound ----------
    const voices = () => (grips || (grips = voiceRun(seq.map((c) => ({ root: c.root, quality: c.q })), q.tonic, q.shape)));
    const strumAt = (i) => { const g = voices()[i]; if (g) A.strum(g.notes.map((n) => n.midi).sort((a, b) => a - b), A.audioCtx().currentTime + 0.03, { spread: 0.025 }); };
    const mark = (i) => el.querySelectorAll('.pmc').forEach((x) => x.classList.toggle('now', Number(x.dataset.ci) === i));
    function play() {
      A.unlockAudio();
      const g = voices();
      let beat = 0;
      const events = seq.map((c, i) => { const e = { beat, dur: c.beats, kind: 'strum', notes: g[i] ? g[i].notes.map((n) => n.midi).sort((a, b) => a - b) : [], idx: i }; beat += c.beats; return e; });
      playing = true; draw();
      A.playEvents(events, { bpm: st.bpm, loops: 200, clickTrack: st.click, beatsPerBar: 4, onEvent: (e) => mark(e.idx), onDone: () => { playing = false; draw(); } });
    }
    function stop() { A.stopPlayer(); playing = false; draw(); }

    q.seq0 = q.seq0 || seq.map((c) => ({ ...c }));
    draw();
    ctx.buttons([{ label: 'Next progression', kind: 'go', on: () => { A.stopPlayer(); ctx.next(); } }]);
    ctx.onLeave = () => A.stopPlayer();
  },
};
