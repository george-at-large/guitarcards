// Modal Interchange quiz: multiple choice on the chords that leave the key. Five kinds of question for each chord,
// asked in random keys: which chord does this job, where it comes from, what it is in this key, which chord fills
// the gap in a progression, and which notes it borrows. Every answer ends on the chord's memory card.
import * as T from '../theory.js';
import { CORE, MORE, SOURCES, chordOf, rnOf, nameOf, outside, srcHolds, barsHTML, voiceRun } from './micore.js';
import { spellTonic, nn, shuffle, pick, esc } from './core.js';

const KINDS = [['job', 'What it does'], ['src', 'Where it comes from'], ['key', 'Spell it in a key'], ['prog', 'Spot it in a progression'], ['notes', 'Notes it borrows']];
const SHAPES = ['C', 'A', 'G', 'E', 'D'];

export default {
  id: 'miquiz',
  title: 'Modal Interchange Quiz',
  blurb: 'The 16 chords that leave the key (borrowed, secondary dominants, tritone subs, diminished): what they do, where they come from, where they go.',
  keyed: true,
  options: [
    { id: 'set', label: 'Chords', type: 'one', def: 'core', choices: [['core', `The essential ${CORE.length}`], ['more', `All ${CORE.length + MORE.length}`]] },
    { id: 'kinds', label: 'Questions', type: 'multi', def: KINDS.map((k) => k[0]), choices: KINDS },
  ],
  pool(c) {
    const ents = c.set === 'more' ? [...CORE, ...MORE] : CORE;
    const out = [];
    for (const e of ents) for (const k of c.kinds) out.push({ id: `mq|${e.id}|${k}`, mode: 'miquiz', group: k, label: `${e.rn} (${e.name}): ${KINDS.find((x) => x[0] === k)[1].toLowerCase()}`, params: { e: e.id, k } });
    return out;
  },
  make(it, pc, ctx) {
    const ents = ctx.cfg.set === 'more' || ctx.cfg.fuzzy ? [...CORE, ...MORE] : CORE;
    const e = [...CORE, ...MORE].find((x) => x.id === it.params.e);
    const tonic = spellTonic(pc, e.minor ? 'aeolian' : 'major');
    const keyName = `${nn(tonic)} ${e.minor ? 'minor' : 'major'}`;
    const same = ents.filter((x) => x.id !== e.id && !!x.minor === !!e.minor);
    const others = ents.filter((x) => x.id !== e.id);
    const k = it.params.k;
    const base = { e, tonic, keyName, k };
    if (k === 'job') {
      const ch = shuffle([e, ...shuffle(same.length >= 3 ? same : others).filter((x) => x.rn !== e.rn).slice(0, 3)]);
      return { ...base, kicker: e.minor ? 'In a minor key' : 'In a major key', title: esc(e.job), sub: 'Which chord does this?', choices: ch.map((x) => ({ v: x.id, l: `${x.rn} · ${x.name}` })), answer: e.id };
    }
    if (k === 'src') {
      const wrong = shuffle(SOURCES.filter((s) => s !== e.src && !srcHolds(s, e, tonic))).slice(0, 3);
      return { ...base, kicker: e.minor ? 'In a minor key' : 'In a major key', title: `${esc(e.rn)}, the ${esc(e.name)}`, sub: 'Where does it come from?', choices: shuffle([e.src, ...wrong]).map((s) => ({ v: s, l: s })), answer: e.src };
    }
    if (k === 'key') {
      const c = chordOf(e.tok, tonic);
      const right = nameOf(c);
      const alts = new Set();
      for (const q of ['maj', 'min', '7', 'maj7', 'm7', 'dim7', 'm7b5', 'm6']) if (q !== c.quality && T.getChord(q).ivs.length === T.getChord(c.quality).ivs.length) alts.add(nameOf({ root: c.root, quality: q }));
      for (const o of shuffle(same.length ? same : others)) { try { alts.add(nameOf(chordOf(o.tok, tonic))); } catch (err) { /* */ } }
      const wrong = shuffle([...alts].filter((x) => x !== right)).slice(0, 3);
      return { ...base, kicker: esc(keyName), title: `The ${esc(e.name)} (${esc(e.rn)}) is…`, sub: `In ${esc(keyName)}.`, choices: shuffle([right, ...wrong]).map((x) => ({ v: x, l: x })), answer: right };
    }
    if (k === 'prog') {
      // spot it: the whole progression, then one fully right reading of its outside chord among near misses
      const chords = e.prog.map((t) => chordOf(t, tonic));
      const c = chords[e.at];
      const nm = nameOf(c), rn = rnOf(c);
      const right = `${nm} · ${rn} · ${e.src}`;
      const wrongSrc = shuffle(SOURCES.filter((x) => x !== e.src && !srcHolds(x, e, tonic))).slice(0, 2).map((x) => `${nm} · ${rn} · ${x}`);
      const home = T.scaleNotes(tonic, e.minor ? 'aeolian' : 'major').map(T.notePc);
      const inKey = chords.filter((x) => T.chordNotes(x.root, x.quality).every((n) => home.includes(T.notePc(n))) && nameOf(x) !== nm);
      const decoy = inKey.length ? pick(inKey) : null;
      const d3 = decoy ? `${nameOf(decoy)} · ${rnOf(decoy)} · ${pick(SOURCES.filter((x) => x !== e.src))}` : `${nm} · ${rn} · ${pick(SOURCES.filter((x) => x !== e.src && !wrongSrc.some((w) => w.endsWith(x))))}`;
      const ch = shuffle([right, ...wrongSrc, d3]).map((x) => ({ v: x, l: x }));
      return { ...base, kicker: esc(keyName), title: 'Spot the chord from outside the key', sub: barsHTML(chords, new Set(), -1, true) + 'Which reading is right: chord, numeral and where it comes from?', choices: ch, answer: right, chords };
    }
    // notes it borrows
    const fmt = (x) => { const o = outside(x, tonic); return o.length ? o.map((n) => `${n.deg} (${n.note})`).join(', ') : 'none: all in the key'; };
    const right = fmt(e);
    const wrong = [...new Set(shuffle(others).map(fmt))].filter((x) => x !== right).slice(0, 3);
    const c = chordOf(e.tok, tonic);
    return { ...base, kicker: esc(keyName), title: `${esc(nameOf(c))}, the ${esc(e.name)} (${esc(e.rn)})`, sub: `Which of its notes are outside ${esc(keyName)}?`, choices: shuffle([right, ...wrong]).map((x) => ({ v: x, l: x })), answer: right };
  },
  mount(q, el, ctx) {
    el.innerHTML = `<div class="choices">${q.choices.map((c, i) => `<button data-i="${i}">${esc(c.l)}</button>`).join('')}</div>`;
    const answer = (i) => {
      const pickV = i == null ? null : q.choices[i].v;
      el.querySelectorAll('[data-i]').forEach((b) => { b.disabled = true; const v = q.choices[Number(b.dataset.i)].v; if (v === q.answer) b.classList.add('right'); else if (v === pickV) b.classList.add('wrong'); });
      const ok = pickV === q.answer;
      ctx.reveal(card(q));
      ctx.finish({ clean: ok, speed: ctx.speed(6000), why: pickV == null ? 'revealed' : ok ? '' : 'not that one' });
    };
    el.querySelectorAll('[data-i]').forEach((b) => (b.onclick = () => answer(Number(b.dataset.i))));
    ctx.buttons([{ label: 'Reveal', kind: 'ghost', on: () => answer(null) }]);
  },
};

// the memory card: the chord, its source, its job, its example progression in this key (tap to hear)
function card(q) {
  const { e, tonic, keyName } = q;
  const chords = e.prog.map((t) => chordOf(t, tonic));
  const out = outside(e, tonic);
  const grips = voiceRun(chords, tonic, pick(SHAPES));
  const all = grips.filter(Boolean);
  const arp = all.map((g) => g.notes.map((n) => n.midi).sort((a, b) => a - b));
  return `<div class="info">
    <div class="k">${esc(keyName)}</div>
    <div class="f">${esc(e.rn)} · ${esc(e.name)}</div>
    <p><b>From:</b> ${esc(e.src)}</p>
    <p><b>Job:</b> ${esc(e.job)}</p>
    ${out.length ? `<p><b>Outside the key:</b> ${out.map((n) => `${esc(n.deg)} (${esc(n.note)})`).join(', ')}</p>` : ''}
    <div class="k">Example</div>
    ${barsHTML(chords, new Set([e.at]))}
    <div class="row"><button class="ghost" data-prog='${JSON.stringify(arp)}'>▶ Hear it</button></div>
  </div>`;
}
