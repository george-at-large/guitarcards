// Guided mode: a drone root, then notes coming in one at a time, each named as it arrives, until a chord stands;
// then the chord morphs, one voice at a time (the 3 falls to the ♭3, the 3 rises to the 4, a 9 comes in, the 5
// steps out …), each change named. Everything sustains, so every interval can be heard against the rest.
// Before a note comes in, it can ask you to imagine it first, or to name it before it's named.
import * as A from '../audio.js';
import * as T from '../theory.js';
import * as V from '../caged/voice.js';
import * as H from './harm.js';
import { G, COLOUR, degText, rootName, degWord } from './words.js';
import * as L from '../caged/library.js';
import * as Hc from '../caged/harmony.js';
import { PACKS, packById, itemOf, speakable } from './packs.js';
import { solve, movesBetween, VOICE_NAMES } from './vlead.js';
import { VL } from './words.js';

const pick = (a) => a[Math.floor(Math.random() * a.length)];
const wpick = (pairs) => { let r = Math.random() * pairs.reduce((s, p) => s + p[1], 0); for (const [v, w] of pairs) { r -= w; if (r <= 0) return v; } return pairs[0][0]; };

export const LESSONS = [
  { id: 'build', name: 'Build & morph', blurb: 'Notes come in one by one until a chord stands, then it morphs, one voice at a time.' },
  { id: 'colours', name: 'Triad + colours', blurb: 'A triad holds; colours (7ths, 9ths, 11ths, 13ths…) come in and leave, one at a time.' },
  { id: 'intervals', name: 'Intervals', blurb: 'Just the drone and one other note at a time.' },
  { id: 'voicelead', name: 'Voice leading', blurb: 'A progression in three or four voices. Each voice moves to the next chord on its own, the smallest move first, and is named as it goes.' },
];

export function guided(O, ui, voices) {
  const ctx = () => A.audioCtx();
  let alive = true, paused = false, token = 0;
  const heard = {}; // how often each degree has come in, so the rarer ones are chosen
  let S = null;     // { pc, rm, degs, bass, place }
  const say = async (lines, t) => {
    // lines: the sentences, in order; spoken (or not), and shown
    const spoken = O.voice === 'off' ? [] : lines.filter(Boolean);
    if (!spoken.length) return t;
    const end = await V.say(spoken.map((s) => [s]), t, { vol: O.vvol });
    return end || t + spoken.join(' ').length * 0.065;
  };
  // wait until audio time `t` (or longer while paused); throws if stopped
  async function until(t) {
    const my = token;
    for (;;) {
      if (!alive || my !== token) throw new Error('stop');
      if (!paused && ctx().currentTime >= t) return;
      await new Promise((r) => setTimeout(r, 80));
    }
  }
  const now = () => ctx().currentTime + 0.08;
  const pace = () => O.pace;

  // ---------- the state on screen and in the air ----------
  function sound(t, { stagger = 0 } = {}) {
    const v = H.voice(S.degs, S.rm, S.bass);
    voices.set(v.map((x) => x.midi), t, { stagger });
    S.place = H.place(v.map((x) => x.midi), S.place);
    S.voiced = v;
  }
  function show(extra = {}) {
    const n = H.nameOf(S.degs);
    const pcOf = (d) => (S.pc + H.pc(d)) % 12;
    ui.show({
      root: S.pc, degs: [...S.degs], name: n, sym: n ? H.symOf(S.rootNote, n) : '',
      voiced: S.voiced.map((x) => ({ ...x, pc: pcOf(x.deg) })),
      neck: S.place.notes.map((p) => { const x = S.voiced.find((v) => v.midi === p.midi); return { ...p, deg: x.deg, label: degText(x.deg), kind: H.KIND(x.deg), fresh: extra.fresh === x.deg }; }),
      ...extra,
    });
  }
  const chordLine = (degs) => { const n = H.nameOf(degs); return n && degs.length >= 3 ? G.now(n.say) : null; };

  // a note comes in (asked first, if prompts are on)
  async function enter(d, { quietName = false } = {}) {
    const mode = promptMode();
    const nextDegs = [...S.degs, d];
    if (mode === 'imagine') {
      ui.show({ ...lastShown(), fresh: null, caption: [G.imagine(d)], prompt: { kind: 'imagine', deg: d, text: `Hear the ${degText(d)} before it sounds`, secs: Math.max(4, pace() * 0.7) } });
      let t = await say([G.imagine(d)], now());
      await until(t + Math.max(4, pace() * 0.7));
      S.degs = nextDegs; t = now(); sound(t);
      heard[d] = (heard[d] || 0) + 1;
      const lines = [G.thereItIs, G.inA(d), O.voice === 'rich' ? COLOUR[d] : null, quietName ? null : chordLine(nextDegs)];
      show({ fresh: d, caption: lines.filter(Boolean) });
      t = await say(lines, t + 0.4);
      return until(t + pace());
    }
    if (mode === 'quiz') {
      const choices = quizChoices(d);
      let t = await say([G.quizIn], now());
      S.degs = nextDegs; sound(t + 0.2);
      const wait = Math.max(5, pace() * 0.8);
      const answer = ui.quiz({ choices, answer: d, secs: wait, text: 'What came in?' });
      show({ fresh: null, hide: d, caption: [G.quizIn], prompt: { kind: 'quiz', secs: wait, choices } });
      await Promise.race([until(t + 0.2 + wait), answer]);
      heard[d] = (heard[d] || 0) + 1;
      const lines = [G.itWas(d), O.voice === 'rich' ? COLOUR[d] : null, quietName ? null : chordLine(nextDegs)];
      show({ fresh: d, caption: lines.filter(Boolean), reveal: d });
      t = await say(lines, now());
      return until(t + pace());
    }
    S.degs = nextDegs;
    let t = now(); sound(t);
    heard[d] = (heard[d] || 0) + 1;
    const first = Math.random() < 0.5 ? G.inA(d) : G.inB(d);
    const bassNow = S.bass === d && d !== '1';
    const lines = [first, bassNow ? G.bass(d) : null, O.voice === 'rich' ? COLOUR[d] : null, quietName ? null : chordLine(nextDegs)];
    show({ fresh: d, caption: lines.filter(Boolean) });
    t = await say(lines, t + 0.5);
    return until(t + pace());
  }
  async function leave(d, { name = true } = {}) {
    S.degs = S.degs.filter((x) => x !== d);
    let t = now(); sound(t);
    const lines = [G.out(d), name ? chordLine(S.degs) : null];
    show({ caption: lines.filter(Boolean), gone: d });
    t = await say(lines, t + 0.4);
    return until(t + pace() * 0.8);
  }
  async function step(a, b) {
    const mode = promptMode();
    const nextDegs = S.degs.map((x) => (x === a ? b : x));
    if (mode === 'imagine') {
      const lines = [G.move(a, b), G.imagineMove];
      ui.show({ ...lastShown(), caption: lines, prompt: { kind: 'imagine', deg: b, text: `${degText(a)} → ${degText(b)}: hear it first`, secs: Math.max(4, pace() * 0.7) } });
      let t = await say(lines, now());
      await until(t + Math.max(4, pace() * 0.7));
      S.degs = nextDegs; t = now(); sound(t);
      heard[b] = (heard[b] || 0) + 1;
      show({ fresh: b, caption: [G.thereItIs, chordLine(nextDegs)].filter(Boolean) });
      t = await say([G.thereItIs, chordLine(nextDegs)], t + 0.4);
      return until(t + pace());
    }
    if (mode === 'quiz') {
      let t = await say([G.quizMove], now());
      S.degs = nextDegs; sound(t + 0.2);
      const wait = Math.max(5, pace() * 0.8);
      const choices = quizChoices(b, a);
      const answer = ui.quiz({ choices, answer: b, secs: wait, text: `The ${degText(a)} moved. Where to?` });
      show({ hide: b, caption: [G.quizMove], prompt: { kind: 'quiz', secs: wait, choices } });
      await Promise.race([until(t + 0.2 + wait), answer]);
      heard[b] = (heard[b] || 0) + 1;
      const lines = [G.move(a, b), chordLine(nextDegs)];
      show({ fresh: b, caption: lines.filter(Boolean), reveal: b });
      t = await say(lines, now());
      return until(t + pace());
    }
    S.degs = nextDegs;
    let t = now(); sound(t);
    heard[b] = (heard[b] || 0) + 1;
    const lines = [G.move(a, b), O.voice === 'rich' ? COLOUR[b] : null, chordLine(nextDegs)];
    show({ fresh: b, caption: lines.filter(Boolean) });
    t = await say(lines, t + 0.4);
    return until(t + pace());
  }
  let shown = null;
  const lastShown = () => shown || {};
  const _show = ui.show; ui.show = (s) => { shown = s; _show(s); };

  // ---------- prompts ----------
  let promptCount = 0;
  function promptMode() {
    if (O.prompts === 'off') return null;
    promptCount++;
    const every = O.promptEvery || 2; // not every note: the music needs room
    if (promptCount % every) return null;
    return O.prompts === 'mix' ? pick(['imagine', 'quiz']) : O.prompts;
  }
  function quizChoices(ans, from) {
    const ok = [...H.allowed(O.level)].filter((d) => d !== '1' && d !== ans && d !== from && !S.degs.includes(d));
    // the likeliest confusions first: the same family, then neighbours
    const fam = ok.filter((d) => H.FAMILY[d] === H.FAMILY[ans]);
    const rest = ok.filter((d) => !fam.includes(d)).sort(() => Math.random() - 0.5);
    const opts = [...new Set([...fam.sort(() => Math.random() - 0.5).slice(0, 2), ...rest])].slice(0, 3);
    return [...opts, ans].sort((a, b) => H.DEGS.indexOf(a) - H.DEGS.indexOf(b));
  }

  // ---------- the lessons ----------
  function newRoot(first) {
    const pc = O.root === 'random' ? (first || !S ? Math.floor(Math.random() * 12) : (S.pc + pick([5, 7, 2, 10, 3, 9])) % 12) : Number(O.root);
    const names = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
    S = { pc, rm: H.rootMidi(pc), degs: ['1'], bass: '1', place: S?.place || null, rootNote: T.parseNote(names[pc]) };
  }
  async function opening(first) {
    newRoot(first);
    let t = now(); sound(t);
    const lines = [first ? null : G.newRoot, G.root, O.voice === 'rich' || first ? G.rootIs(rootName(S.pc)) : null];
    show({ fresh: '1', caption: lines.filter(Boolean) });
    t = await say(lines, t + 0.8);
    await until(t + pace());
  }
  async function build() {
    const plan = H.target(O.level, O.maxNotes);
    if (O.bass === 'inv') { const ch = H.bassChoices(plan); if (ch.length) S.bass = pick(ch); }
    for (const d of plan.slice(1)) await enter(d);
    // morph
    let last = null;
    const n = 4 + Math.floor(Math.random() * 5);
    for (let i = 0; i < n; i++) {
      const ms = H.moves(S.degs, O.level, O.maxNotes).filter((m) => !(last && m.kind === 'step' && m.from === last.to && m.to === last.from));
      if (!ms.length) break;
      const size = S.degs.length;
      const m = wpick(ms.map((x) => {
        const d = x.to || x.from;
        let w = (x.kind === 'step' ? 3 : x.kind === 'in' ? (size < 4 ? 3 : 1.5) : size > 4 ? 1.4 : 0.5) / (1 + (heard[d] || 0) * 0.7);
        if (x.kind === 'out' && (x.from === S.bass || H.FAMILY[x.from] === 'third')) w *= 0.2;
        return [x, w];
      }));
      if (m.kind === 'step') { if (S.bass === m.from) S.bass = m.to; await step(m.from, m.to); }
      else if (m.kind === 'in') await enter(m.to);
      else { if (S.bass === m.from) S.bass = '1'; await leave(m.from); }
      last = m;
    }
    await ending();
  }
  async function ending() {
    if (Math.random() < 0.5) {
      let t = await say([G.thin], now()); show({ ...lastShown(), caption: [G.thin], fresh: null });
      await until(t + 1);
      const order = [...S.degs].filter((d) => d !== '1').sort((a, b) => H.SPREAD[b] - H.SPREAD[a]);
      for (const d of order) { if (S.bass === d) S.bass = '1'; await leave(d, { name: false }); }
      t = await say([G.alone], now()); show({ ...lastShown(), caption: [G.alone] });
      await until(t + pace());
    } else {
      const t = await say([G.ring], now()); show({ ...lastShown(), caption: [G.ring], fresh: null });
      await until(t + pace() * 2);
    }
    voices.releaseAll(now(), 4);
    await until(now() + 3);
  }
  async function colours() {
    const tri = pick(O.level >= 4 ? [['3', '5'], ['b3', '5'], ['4', '5'], ['2', '5'], ['b3', 'b5'], ['3', '#5']] : [['3', '5'], ['b3', '5'], ['3', '5'], ['b3', '5'], ['4', '5'], ['2', '5']]);
    for (const d of tri) await enter(d);
    const n = 4 + Math.floor(Math.random() * 4);
    for (let i = 0; i < n; i++) {
      const adds = H.moves(S.degs, O.level, Math.max(4, O.maxNotes)).filter((m) => m.kind === 'in' && !['third', 'fifth'].includes(H.FAMILY[m.to]));
      if (!adds.length) break;
      const m = wpick(adds.map((x) => [x, 1 / (1 + (heard[x.to] || 0))]));
      await enter(m.to);
      await leave(m.to);
      // now and then the triad itself changes colour
      if (Math.random() < 0.3) { const st = H.moves(S.degs, Math.min(O.level, 2), 3).filter((x) => x.kind === 'step'); if (st.length) { const s = pick(st); await step(s.from, s.to); } }
    }
    await ending();
  }
  async function intervals() {
    const n = 6 + Math.floor(Math.random() * 4);
    for (let i = 0; i < n; i++) {
      const pool = [...H.allowed(O.level)].filter((d) => d !== '1');
      const d = wpick(pool.map((x) => [x, 1 / (1 + (heard[x] || 0))]));
      await enter(d, { quietName: true });
      await leave(d, { name: false });
    }
    voices.releaseAll(now(), 3);
    await until(now() + 2);
  }

  // ---------- Voice leading: a progression, every voice traced ----------
  function vlItems() {
    const [kind, id] = String(O.vlSource || 'pack:voicelead').split(':');
    if (kind === 'pack') { const pk = packById(id) || PACKS[0]; return pk.items.map((it) => ({ ...itemOf(it), name: it.name || itemOf(it).name, note: it.note })); }
    const it = PACKS.flatMap((pk) => pk.items).find((x) => x.id === id);
    return [it ? { ...itemOf(it), name: it.name, note: it.note } : L.byId(id)];
  }
  const NAMES = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
  function chordWords(c) {
    let w = V.chordWords(c, 'num', true)[0] || [];
    if (w[1] === 'minor') w = [`minor ${w[0]}`, ...w.slice(2)];
    return w;
  }
  let vlPc = null;
  async function voiceLead() {
    const n = Number(O.vlVoices) || 4;
    for (const item of vlItems()) {
      if (!alive) return;
      vlPc = O.root === 'random' ? (vlPc == null ? Math.floor(Math.random() * 12) : (vlPc + pick([5, 7, 2, 10])) % 12) : Number(O.root);
      const minor = !!item.minor;
      const tonic = T.parseNote(minor ? ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'G#', 'A', 'Bb', 'B'][vlPc] : NAMES[vlPc]);
      const specs = L.resolve(item).flat();
      const chords = specs.map((spec) => { const root = Hc.spell(tonic, spec.iv); return { spec, q: spec.q, root, rootPc: T.notePc(root), bass: spec.bass, rn: Hc.label(spec, spec.q, spec.bass), name: Hc.slashName(root, spec.q, spec.bass) }; });
      const path = solve(chords, n, O.vlBass === 'free');
      if (!path) continue;
      const follow = O.vlFollow === 'all' || O.vlFollow == null ? null : Number(O.vlFollow);
      const vnames = VOICE_NAMES[n];
      let place = null, sounding = [...path[0].midis], sivs = [...path[0].ivs];
      const show = (k, extra = {}) => {
        place = H.place([...sounding].sort((a, b) => a - b), place);
        ui.vl({ item, chords, path, k, n, sounding: [...sounding], ivs: [...sivs], vnames, follow, keyLabel: `${T.noteName(tonic, true)} ${minor ? 'minor' : 'major'}`,
          neck: place.notes.map((pn) => { const i = sounding.indexOf(pn.midi); const iv = sivs[i] || '1'; return { ...pn, label: degText(iv), kind: H.KIND(iv.replace(/^(b|#)?(2|4|6)$/, (m, a, d) => (d === '6' ? (a || '') + '6' : (a || '') + { 2: '9', 4: '11' }[d]))), spot: follow != null && i === follow }; }),
          ...extra });
      };
      const boost = () => (follow != null ? [sounding[follow]] : null);
      // introduce
      let t = now();
      voices.set(sounding, t, { boost: boost() });
      const intro = [speakable(item.name), n === 4 ? VL.four : VL.three];
      show(0, { caption: intro, fresh: null });
      t = await say(intro, t + 0.3);
      const first = chordWords(chords[0]);
      if (O.voice !== 'off') { const e = await V.say([first], t + 0.1, { vol: O.vvol }); t = e || t + 1.5; }
      show(0, { caption: [first.join(' ')] });
      await until(t + pace() * 0.8);
      // chord by chord, voice by voice
      for (let k = 1; k < chords.length; k++) {
        const mv = movesBetween(path[k - 1], path[k]);
        const moving = mv.filter((m) => m.d !== 0).sort((a, b) => Math.abs(a.d) - Math.abs(b.d));
        const holding = mv.filter((m) => m.d === 0 && m.a !== m.b);
        const together = O.vlMoves === 'together' || follow != null;
        if (together) {
          // the others move together; a followed voice moves last, on its own
          const others = moving.filter((m) => m.voice !== follow);
          others.forEach((m) => { sounding[m.voice] = m.to; sivs[m.voice] = m.b; });
          holding.forEach((m) => { sivs[m.voice] = m.b; });
          if (follow == null) mv.forEach((m) => { sivs[m.voice] = m.b; });
          t = now(); voices.set(sounding, t, { stagger: 0.05, boost: boost() });
          show(k, { moved: others.map((m) => m.voice) });
          if (follow == null) {
            const key = moving.filter((m) => /3|7/.test(m.a) || /3|7/.test(m.b)).slice(0, 2);
            const lines = [...key.map((m) => [VL.the(m.a), VL.move(m.b, m.d, m.a === m.b)].join(' ')), chordWords(chords[k]).join(' ')];
            show(k, { caption: lines, moved: others.map((m) => m.voice) });
            if (O.voice !== 'off') { const e = await V.say([...key.map((m) => [VL.the(m.a), VL.move(m.b, m.d, m.a === m.b)]), chordWords(chords[k])], t + 0.3, { vol: O.vvol }); t = e || t + 2; }
            await until(t + pace() * 0.7);
            continue;
          }
          await until(t + Math.max(1, pace() * 0.3));
        }
        const solo = follow != null ? mv.filter((m) => m.voice === follow) : moving;
        for (const m of solo) {
          const mode = promptMode();
          if (mode === 'imagine') {
            show(k, { caption: [G.imagineMove], prompt: { kind: 'imagine', text: `${vnames[m.voice]}: ${degText(m.a)} → ${degText(m.b)}`, secs: Math.max(3, pace() * 0.6) } });
            t = await say([G.imagineMove], now());
            await until(t + Math.max(3, pace() * 0.6));
          }
          sounding[m.voice] = m.to; sivs[m.voice] = m.b;
          t = now(); voices.set(sounding, t, { boost: boost() });
          const words = [...(follow != null ? [VL.voice(vnames[m.voice])] : []), VL.the(m.a), VL.move(m.b, m.d, m.a === m.b)];
          if (mode === 'quiz') {
            show(k, { caption: [G.quizMove], moving: m.voice, prompt: { kind: 'imagine', text: 'Which voice moved, and where to?', secs: Math.max(4, pace() * 0.6) } });
            t = await say([G.quizMove], t + 0.2);
            await until(t + Math.max(4, pace() * 0.6));
          }
          show(k, { caption: [words.join(' ')], moving: m.voice });
          if (O.voice !== 'off') { const e = await V.say([words], now() + 0.15, { vol: O.vvol }); t = e || now() + 1.5; }
          await until(Math.max(t, now()) + Math.max(0.8, pace() * 0.35));
        }
        // the holds that change role, then the chord's name
        holding.forEach((m) => { sivs[m.voice] = m.b; });
        if (follow == null) mv.forEach((m) => { sivs[m.voice] = m.b; });
        const hold = O.voice === 'rich' && follow == null ? holding.slice(0, 1).map((m) => [VL.the(m.a), VL.move(m.b, 0)]) : [];
        const name = chordWords(chords[k]);
        show(k, { caption: [...hold.map((h) => h.join(' ')), name.join(' ')] });
        if (O.voice !== 'off') { const e = await V.say([...hold, name], now() + 0.1, { vol: O.vvol }); t = e || now() + 1.5; } else t = now();
        await until(t + pace() * 0.6);
      }
      // the whole progression, in time
      t = await say([VL.inTime], now());
      show(0, { caption: [VL.inTime] });
      const spc = 60 / 72 * 4;
      for (let k = 0; k < chords.length; k++) {
        sounding = [...path[k].midis]; sivs = [...path[k].ivs];
        const at = Math.max(t, now()) + 0.1;
        voices.set(sounding, at, { boost: boost() });
        await until(at);
        show(k, { caption: [VL.inTime] });
        t = at + spc * (specs[k] ? 1 : 1);
        await until(t - 0.05);
      }
      await until(now() + 1.5);
      voices.releaseAll(now(), 2);
      await until(now() + 2.5);
    }
  }

  async function run() {
    let first = true;
    while (alive) {
      try {
        if (O.lesson === 'voicelead') { await voiceLead(); continue; }
        await opening(first); first = false;
        if (O.lesson === 'colours') await colours();
        else if (O.lesson === 'intervals') await intervals();
        else await build();
      } catch (e) {
        if (e.message !== 'stop') console.error(e);
        if (!alive) return;
        if (e.message === 'stop') await new Promise((r) => setTimeout(r, 50));
      }
    }
  }
  run();
  return {
    stop() { alive = false; token++; V.hush(); voices.releaseAll(ctx().currentTime, 1.5); },
    pause(p) { paused = p; if (p) V.hush(); },
    get paused() { return paused; },
  };
}
