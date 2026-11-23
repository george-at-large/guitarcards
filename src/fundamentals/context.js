// Chords in Context: one functional chord (a fully diminished 7th, a 7♭5, a borrowed iv, a tritone sub…) and a
// handful of progressions that use it, in a key and a CAGED position, each one playable with its grips. Chord-type
// topics are written here; the borrowed and chromatic topics come from the CAGED app's data.
import * as A from '../audio.js';
import * as T from '../theory.js';
import * as H from '../caged/harmony.js';
import { resolve } from '../caged/library.js';
import { BORROWED } from '../caged/borrowdata.js';
import { CHROMATIC } from '../caged/chromdata.js';
import { barsHTML, voiceRun } from './micore.js';
import { diagrams } from './shapes.js';
import { spellTonic, nn, pick, shuffle, esc } from './core.js';

const P = (name, chart, note, o = {}) => ({ name, chart, note, ...o });
const M = { minor: true };
const D = Object.fromEntries([...BORROWED, ...CHROMATIC].map((d) => [d.id, d]));
const composed = (id, n = 2) => (D[id]?.progs || []).filter((p) => !p.song).slice(0, n);

// chord types, each with several jobs; the progressions are numerals against the tonic's major scale
export const TYPES = [
  { id: 'dim7', name: 'Fully diminished 7th', rn: '°7', qs: ['dim7'],
    where: 'Four notes a minor 3rd apart (1 ♭3 ♭5 𝄫7), so every inversion is the same shape, repeating every three frets. Each note can step up a half step, so one °7 leads to four different chords.',
    how: 'Three jobs. Passing: ♯i°7 between I and ii, the bass climbing by half steps. Leading tone: vii°7 → i, a rootless V7♭9. Common tone: I°7 decorating I and sharing its root.',
    progs: () => [...composed('passdim'), ...composed('sharp4dim', 1), ...composed('ctdim', 1), ...composed('viidim', 1)] },
  { id: 'm7b5', name: 'Half-diminished (ø7)', rn: 'ø7', qs: ['m7b5'],
    where: '1 ♭3 ♭5 ♭7: a diminished triad with a minor 7th. It has the same notes as the m6 chord a minor 3rd up (Dø7 = Fm6).',
    how: 'The ii of a minor key (iiø7 – V7♭9 – i), a darker ii in a major key, the ii of a ii–V into a minor chord (viiø7 – III7 – vi), and ♯ivø7 climbing from IV towards I.',
    progs: () => [
      P('Minor ii–V–i', '| ii:m7b5 | V:7b9 | i:m7 | i:m7 |', 'The minor cadence: the ♭5 of the ø7 becomes the ♭9 of V.', M),
      P('Into the relative minor', '| I:maj7 | vii:m7b5 III:7 | vi:m7 | vi:m7 |', 'viiø7 – III7 is the minor ii–V of vi.'),
      P('A borrowed ii in major', '| ii:m7b5 | V:7 | I:maj7 | I:maj7 |', 'The parallel minor’s ii darkens a major cadence.'),
      P('A Stella-style opening', '| #iv:m7b5 | VII:7 | ii:m7 | V:7 |', '♯ivø7 – VII7 is a ii–V that doesn’t go where it points: it sidesteps to ii.'),
      P('♯ivø7 climbing to I', '| IV:maj7 | #iv:m7b5 | I:maj7/5 | V:7 |', 'The bass climbs 4 – ♯4 – 5 under IV, ♯ivø7 and I over its 5th.'),
    ] },
  { id: '7b5', name: 'Dominant 7♭5', rn: '7♭5', qs: ['7b5'],
    where: '1 3 ♭5 ♭7: a dominant with its 5th lowered. It’s symmetric: G7♭5 and D♭7♭5 are the same four notes, so it’s its own tritone sub.',
    how: 'As V7♭5 before I (the ♭5 falls a half step to the root of I), as ♭II7♭5 with the bass sliding down, as a secondary dominant, and as the classical French sixth (♭VI7♭5 – V).',
    progs: () => [
      P('V7♭5 – I', '| ii:m7 | V:7b5 | I:maj7 | I:maj7 |', 'The ♭5 (D♭ in C) falls a half step to the root of I.'),
      P('Its own tritone sub', '| ii:m7 | bII:7b5 | I:maj7 | I:maj7 |', 'D♭7♭5 has the same notes as G7♭5; now the bass slides down onto I.'),
      P('The French sixth', '| i:min | bVI:7b5 | V:7 | i:min |', '♭VI7♭5 (A♭ C D G♭ in C minor): the outer voices open out to the octave on V.', M),
      P('Whole-tone colour', '| I:maj7 | V:7b5 | I:maj7 | V:7b5 |', 'V7♭5 is four notes of the whole-tone scale: dreamy, unresolved.'),
      P('A secondary 7♭5', '| I:maj7 | II:7b5 | ii:m7 V:7 | I:maj7 |', 'II7♭5, the V of V with a ♭5: its ♭5 (A♭ in C) slides down to G.'),
    ] },
  { id: '7sus4', name: 'Suspended dominant (7sus4)', rn: '7sus4', qs: ['7sus4', '9sus4'],
    where: '1 4 5 ♭7: a dominant with the 4th in place of the 3rd. With the 9 it’s the ii chord over V’s root (G9sus4 = Dm7/G = F/G).',
    how: 'Delay the 3rd and resolve it (V7sus4 – V7 – I), use it on its own as a softer dominant, or vamp on it as a modal sound.',
    progs: () => [
      P('Sus, then resolve', '| ii:m7 | V:7sus4 V:7 | I:maj7 | I:maj7 |', 'The 4th (C in G7sus4) falls to the 3rd (B), then home.'),
      P('Sus straight home', '| I:maj7 | IV:maj7 | V:9sus4 | I:maj7 |', 'No 3rd at all: an open, soft dominant, the gospel and pop way.'),
      P('Modal vamp', '| I:7sus4 | I:7sus4 | bIII:7sus4 | bIII:7sus4 |', 'Sus chords a minor 3rd apart, standing on their own: the modal-jazz sound.'),
      P('ii–V as one chord', '| I:maj7 | vi:m7 | V:9sus4 | V:7b9 |', 'V9sus4 is ii over V’s root; then it turns into V7♭9.'),
      P('Sus in a minor key', '| i:m7 | iv:m7 | V:7sus4 | V:7 |', 'The sus holds back the raised 7th until the last moment.', M),
    ] },
  { id: 'aug', name: 'Augmented', rn: '+', qs: ['aug', '7#5', 'maj7#5'], from: 'aug', progs: () => D.aug?.progs?.filter((p) => !p.song) || [] },
  { id: 'mMaj7', name: 'Minor-major 7th and the line cliché', rn: 'm(maj7)', qs: ['mMaj7'], from: 'liclmin', progs: () => D.liclmin?.progs?.filter((p) => !p.song) || [] },
];
const SHAPES = ['C', 'A', 'G', 'E', 'D'];

export default {
  id: 'context',
  title: 'Chords in Context',
  blurb: 'One functional chord (°7, 7♭5, a borrowed iv, a tritone sub…) and five progressions that use it, each playable.',
  kind: 'player',
  tools: { metro: true, drone: true },
  keyed: true,
  options: [
    { id: 'set', label: 'Topics', type: 'multi', def: ['types', 'borrowed', 'chromatic'], choices: [['types', `Chord types (${TYPES.length})`], ['borrowed', 'Borrowed chords'], ['chromatic', 'Chromatic chords']] },
    { id: 'shape', label: 'Position', type: 'one', def: 'any', choices: [['any', 'Any'], ...SHAPES.map((s) => [s, `${s} shape`])] },
    { id: 'bpm', label: 'Play speed', type: 'one', def: '76', choices: [['60', '60'], ['76', '76'], ['92', '92'], ['112', '112']] },
  ],
  pool(c) {
    const out = [];
    if (c.set.includes('types')) for (const t of TYPES) out.push({ id: `cx|t|${t.id}`, mode: 'context', label: t.name, params: { t: t.id } });
    const single = (d) => !d.pair && !d.hybrid && d.progs && d.progs.length >= 3;
    if (c.set.includes('borrowed')) for (const d of BORROWED.filter(single)) out.push({ id: `cx|d|${d.id}`, mode: 'context', label: `${d.name} (${d.rn})`, params: { d: d.id } });
    if (c.set.includes('chromatic')) for (const d of CHROMATIC.filter(single)) out.push({ id: `cx|d|${d.id}`, mode: 'context', label: `${d.name} (${d.rn})`, params: { d: d.id } });
    return out;
  },
  make(it, pc, ctx) {
    const t = it.params.t ? TYPES.find((x) => x.id === it.params.t) : null;
    const d = t ? (t.from ? D[t.from] : null) : D[it.params.d];
    const info = { name: t ? t.name : d.name, rn: t ? t.rn : d.rn, where: t?.where || d?.where || '', how: t?.how || d?.how || '', sound: t ? (t.from ? d?.sound : '') : d.sound };
    const progs = (t ? t.progs() : d.progs).slice(0, 6);
    const shape = ctx.cfg.shape === 'any' ? pick(SHAPES) : ctx.cfg.shape;
    // each progression in the key of the card (a minor progression in the parallel minor)
    const rows = progs.map((p) => {
      const minor = !!(p.minor || d?.minor && !t);
      const tonic = spellTonic(pc, minor ? 'aeolian' : 'major');
      const flat = resolve(p).flatMap((b, bi) => b.map((c) => ({ root: H.spell(tonic, c.iv), quality: c.q, rn: H.numeral(c.iv, c.q), bar: bi, beats: 4 / b.length })));
      const home = T.scaleNotes(tonic, minor ? 'aeolian' : 'major').map(T.notePc);
      const hl = new Set(flat.map((c, i) => (t ? t.qs.includes(c.quality) : T.chordNotes(c.root, c.quality).some((n) => !home.includes(T.notePc(n)))) ? i : -1).filter((i) => i >= 0));
      return { p, minor, tonic, flat, hl };
    });
    const tonic = spellTonic(pc, 'major');
    return {
      kicker: `${esc(nn(tonic))} · ${shape} shape`, title: `${esc(info.name)} <span class="psub">${esc(T.prettyRoman(info.rn))}</span>`,
      sub: `${rows.length} ways it’s used. Tap ▶ to hear one, Grips to see it in the ${shape} shape.`, info, rows, shape, bpm: Number(ctx.cfg.bpm) || 76,
      droneMidi: 40 + ((pc - 4 + 12) % 12),
    };
  },
  mount(q, el, ctx) {
    el.innerHTML = `
      <div class="info"><div class="k">What it is</div><p>${esc(q.info.where)}</p>
        <div class="k">How it’s used</div><p>${esc(q.info.how)}</p>${q.info.sound ? `<div class="k">Sound</div><p>${esc(q.info.sound)}</p>` : ''}
        <p class="note">Examples in the text are in C (A minor for minor keys).</p></div>
      ${q.rows.map((r, i) => `<div class="card ctx" data-row="${i}">
        <div class="ol">${i + 1}. ${esc(r.p.name)}${r.minor ? ' · minor' : ''}</div>
        ${barsHTML(r.flat, r.hl)}
        ${r.p.note ? `<p class="note">${esc(r.p.note)}</p>` : ''}
        <div class="row"><button class="ghost" data-play="${i}">▶ Play</button><button class="ghost" data-grips="${i}">Grips</button></div>
        <div class="grips" id="grips${i}"></div></div>`).join('')}`;
    let cur = -1;
    const voiced = new Map();
    const grips = (i) => { if (!voiced.has(i)) voiced.set(i, voiceRun(q.rows[i].flat, q.rows[i].tonic, q.shape)); return voiced.get(i); };
    const mark = (i, k) => el.querySelectorAll('.ctx').forEach((card) => card.querySelectorAll('[data-bar]').forEach((b) => b.classList.toggle('now', Number(card.dataset.row) === i && Number(b.dataset.bar) === k)));
    const stop = () => { A.stopPlayer(); cur = -1; mark(-1, -1); el.querySelectorAll('[data-play]').forEach((b) => (b.textContent = '▶ Play')); };
    el.querySelectorAll('[data-play]').forEach((b) => (b.onclick = () => {
      const i = Number(b.dataset.play);
      if (cur === i) return stop();
      stop(); A.unlockAudio();
      const g = grips(i);
      let beat = 0;
      const events = q.rows[i].flat.map((c, k) => { const e = { beat, dur: c.beats, kind: 'strum', notes: g[k] ? g[k].notes.map((n) => n.midi).sort((a, b) => a - b) : [], idx: k }; beat += c.beats; return e; });
      cur = i; b.textContent = '■ Stop';
      A.playEvents(events, { bpm: q.bpm, loops: 4, onEvent: (e) => mark(i, e.idx), onDone: stop });
    }));
    el.querySelectorAll('[data-grips]').forEach((b) => (b.onclick = () => {
      const i = Number(b.dataset.grips), box = el.querySelector('#grips' + i);
      if (box.innerHTML) { box.innerHTML = ''; return; }
      const g = grips(i), seen = new Set();
      const list = [];
      q.rows[i].flat.forEach((c, k) => { const nm = T.pretty(T.chordSymbol(c.root, c.quality)); if (g[k] && !seen.has(nm)) { seen.add(nm); list.push({ notes: g[k].notes, cap: `${nm} · ${c.rn}`, set: g[k].notes.map((n) => n.string) }); } });
      box.innerHTML = diagrams(list);
    }));
    ctx.buttons([{ label: 'Next chord', kind: 'go', on: () => { stop(); ctx.next(); } }]);
    ctx.onLeave = stop;
  },
};
