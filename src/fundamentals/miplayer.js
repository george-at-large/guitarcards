// Modal Interchange Player: skippable cards. Each picks a key and a CAGED position, then a progression that puts one
// borrowed or chromatic chord to work (the backdoor dominant, the Neapolitan, a tritone sub…), voiced in that
// position, with what the chord is, how it's used and how it sounds. Play loops it; drone and click switch on.
import * as A from '../audio.js';
import * as T from '../theory.js';
import * as G from '../caged/grips.js';
import * as H from '../caged/harmony.js';
import { resolve } from '../caged/library.js';
import { CORE, MORE, DATA, ALL_DATA, chordOf, rnOf, nameOf, barsHTML } from './micore.js';
import { voice, panel } from './theorycard.js';
import { spellTonic, nn, pick, esc } from './core.js';
import { diagrams } from './shapes.js';

const SHAPES = ['C', 'A', 'G', 'E', 'D'];

export default {
  id: 'miplayer',
  title: 'Modal Interchange Player',
  blurb: 'Skippable cards: a key, a CAGED position and a progression with a borrowed or chromatic chord in it, and what that chord does.',
  kind: 'player',
  tools: { metro: true, drone: true },
  keyed: true,
  options: [
    { id: 'set', label: 'Chords', type: 'one', def: 'core', choices: [['core', `The essential ${CORE.length}`], ['all', `Everything (${ALL_DATA.length} topics)`]] },
    { id: 'shape', label: 'Position', type: 'one', def: 'any', choices: [['any', 'Any'], ...SHAPES.map((s) => [s, `${s} shape`])] },
    { id: 'bpm', label: 'Play speed', type: 'one', def: '76', choices: [['60', '60'], ['76', '76'], ['92', '92'], ['112', '112']] },
  ],
  pool(c) {
    const topics = c.set === 'all' ? ALL_DATA.filter((d) => d.progs && d.progs.length) : [...CORE, ...MORE].map((e) => DATA[e.data]).filter(Boolean);
    return [...new Map(topics.map((d) => [d.id, d])).values()].map((d) => ({ id: `mp|${d.id}`, mode: 'miplayer', label: d.name, params: { d: d.id } }));
  },
  make(it, pc, ctx) {
    const d = DATA[it.params.d];
    const prog = pick(d.progs);
    const minor = !!(prog.minor || d.minor);
    const tonic = spellTonic(pc, minor ? 'aeolian' : 'major');
    const shape = ctx.cfg.shape === 'any' ? pick(SHAPES) : ctx.cfg.shape;
    const pos = G.positionOf(tonic, shape);
    // composed charts are numerals; songs are chord symbols in the record's key: both resolve to intervals
    const bars = resolve(prog);
    const flat = bars.flatMap((b, bi) => b.map((c) => ({ root: H.spell(tonic, c.iv), quality: c.q, rn: H.numeral(c.iv, c.q), bar: bi, beats: 4 / b.length })));
    const home = T.scaleNotes(tonic, minor ? 'aeolian' : 'major').map(T.notePc);
    const hl = new Set(flat.map((c, i) => (T.chordNotes(c.root, c.quality).some((n) => !home.includes(T.notePc(n))) ? i : -1)).filter((i) => i >= 0));
    return {
      kicker: `${esc(nn(tonic))} ${minor ? 'minor' : 'major'} · ${shape} shape, frets ${pos.lo}–${pos.hi}`,
      title: `${esc(d.name)} <span class="psub">${esc(T.prettyRoman(d.rn))}</span>`,
      sub: prog.song ? `From a record: ${esc(prog.name)} (${esc(prog.by || '')}), moved to this key` : esc(prog.name),
      d, prog, tonic, shape, flat, hl, minor, bpm: Number(ctx.cfg.bpm) || 76,
      droneMidi: 40 + ((pc - 4 + 12) % 12),
    };
  },
  mount(q, el, ctx) {
    const grips = voice(q.flat, q.tonic, q.shape).grips;
    // the data's text is written in C major (A minor for minor-key topics)
    const ref = q.minor ? 'A' : 'C';
    const inC = T.noteName(q.tonic) !== ref;
    const uniq = [];
    q.flat.forEach((c, i) => { if (grips[i] && !uniq.some((u) => u.name === nameOf(c))) uniq.push({ name: nameOf(c), rn: rnOf(c), q: c.quality, g: grips[i] }); });
    el.innerHTML = `
      ${barsHTML(q.flat, q.hl)}
      <p class="note">${esc(q.prog.note || '')}</p>
      ${panel(q.flat, q.tonic, q.minor, { shape: q.shape, hits: [...q.hl] })}
      <div class="info">
        ${inC ? `<p class="note">The text’s examples are in ${q.minor ? 'A minor' : 'C major'}.</p>` : ''}
        <div class="k">What it is</div><p>${esc(q.d.where || '')}</p>
        <div class="k">How to use it</div><p>${esc(q.d.how || '')}</p>
        ${q.d.sound ? `<div class="k">Sound</div><p>${esc(q.d.sound)}</p>` : ''}
        ${q.d.from ? `<div class="k">From</div><p>${esc(q.d.from[0].toUpperCase() + q.d.from.slice(1))}</p>` : ''}
      </div>`;
    let playing = false;
    const mark = (i) => el.querySelectorAll('[data-bar]').forEach((b) => b.classList.toggle('now', Number(b.dataset.bar) === i));
    const play = () => {
      A.unlockAudio();
      let beat = 0;
      const events = q.flat.map((c, i) => { const e = { beat, dur: c.beats, kind: 'strum', notes: grips[i] ? grips[i].notes.map((n) => n.midi).sort((a, b) => a - b) : [], idx: i }; beat += c.beats; return e; });
      A.playEvents(events, { bpm: q.bpm, loops: 8, onEvent: (e) => mark(e.idx), onDone: () => { playing = false; mark(-1); btns(); } });
      playing = true; btns();
    };
    const stop = () => { A.stopPlayer(); playing = false; mark(-1); btns(); };
    const btns = () => ctx.buttons([
      { label: playing ? '■ Stop' : '▶ Play', kind: 'ghost', on: () => (playing ? stop() : play()) },
      { label: 'Next card', kind: 'go', on: () => { A.stopPlayer(); ctx.next(); } },
    ]);
    btns();
    ctx.onLeave = () => A.stopPlayer();
  },
};
