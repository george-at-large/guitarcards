// Guided audiation: the sessions of tools/audiation/CURRICULUM.md, run live in a new key each time.
// A session is a list of exercises built from a few templates (the core cycle, stack and peel, minimal pairs, top-voice
// migration, moving between chords, plain listening, review). Each template is a short script of primitive moves: notes
// sound (a held tone), drop (an empty ring to keep hearing), stop, get louder; the narrator says a line; a silence.
// Every line the narrator can say is in LINES, so tools/audiation/app_voice.py can record them all.
import * as T from '../theory.js';
import * as F from '../fretboard.js';
import * as S from './sound.js';

// ---------- what the narrator says ----------
const TONE = { 1: 'root', 3: 'third', b3: 'third', 4: 'fourth', 2: 'second', 5: 'fifth', b5: 'flat five', '#5': 'sharp five', 7: 'seventh', b7: 'seventh', bb7: 'seventh' };
const QUAL_WORD = { maj: 'Major.', min: 'Minor.', dim: 'Diminished.', aug: 'Augmented.', sus4: 'Sus four.', maj7: 'Major seven.', '7': 'Dominant seven.', m7: 'Minor seven.', m7b5: 'Half-diminished.', dim7: 'Diminished seven.', mMaj7: 'Minor, major seven.' };
const toneLines = (n) => [`This is the ${n}.`, `The ${n} is gone. Notice the hole.`, `Put back the ${n}.`, `It was the ${n}.`, `The ${n}.`,
  `Imagine the ${n} before it sounds.`, `Find the ${n}.`, `The ${n} is on top.`, `The ${n} is in the bass.`, `The ${n} is in the middle.`];
const FIXED = [
  'The chord.', 'Find it inside the chord.', 'Put it back, in your head.', 'Check.', 'Once more, on your own.', 'Again, with nothing lit.',
  'Now the whole chord, with nothing sounding.', 'Hold it.', 'Which note left?', 'Just listen.', 'The key.',
  'Now note by note.', 'And now they leave, one by one.', 'Which one is it?', 'Imagine it the other way.',
  'Only one note changes.', 'Hold the rest of the chord over the root.', 'Follow it.', 'Find it now.',
  'Listen to what moves and what stays.', 'These notes stayed.', 'These moved.', 'Now move it, in your head.', 'And back.',
  'Back, in your head.', 'Only the moving notes.', 'Just the bass.', 'The bass and the guide tones.', 'Now the bass alone. Hear the chords above it.',
  'A new chord.', 'Now a few you know.', 'Play it on your guitar, and compare it with what you hear inside.',
  "That's the end of this session.", 'Imagine it major.', 'Now imagine it minor.',
];
export const LINES = [...new Set([...FIXED, ...Object.values(TONE).flatMap(toneLines), ...Object.values(QUAL_WORD),
  ...Object.values(QUAL_WORD).map((w) => `Now imagine it ${w.replace('.', '').toLowerCase()}.`)])];

// ---------- chords on the neck ----------
const KEYS = ['C', 'G', 'D', 'A', 'E', 'F', 'Bb', 'Eb', 'Ab', 'Db'];
const simple = (iv) => F.simpleIv(iv);
// one voicing of a chord: {notes: [{key, string, fret, midi, iv}]}; `top`/`bass`/`middle` ask for a tone in that place
function voicing(root, quality, { kind = null, top = null, bass = null, middle = null, near = 5, strings = null } = {}) {
  const ivs = T.getChord(quality).ivs;
  const v = kind || (ivs.length >= 4 ? 'drop2' : 'close');
  let cands = [];
  try { cands = F.chordVoicings({ root, quality, voicing: v, stringSet: strings || 'auto', stringSetAll: !strings, inversion: 'all' }); } catch (e) { cands = []; }
  const order = (p) => [...p.notes].sort((a, b) => a.midi - b.midi);
  if (top) cands = cands.filter((p) => order(p).at(-1).iv === top);
  if (bass) cands = cands.filter((p) => order(p)[0].iv === bass);
  if (middle) cands = cands.filter((p) => { const o = order(p); return o.slice(1, -1).some((n) => n.iv === middle); });
  if (!cands.length) throw new Error(`no voicing for ${quality} ${top || bass || middle || ''}`);
  const avg = (p) => p.notes.reduce((s, n) => s + n.fret, 0) / p.notes.length;
  const p = cands.reduce((a, b) => (Math.abs(avg(a) - near) <= Math.abs(avg(b) - near) ? a : b));
  return { root, quality, notes: p.notes.map((n) => ({ key: `${n.string}:${n.fret}`, string: n.string, fret: n.fret, midi: n.midi, iv: n.iv })) };
}
const ivSet = (ch, ivs) => (ivs === 'all' ? ch.notes : ch.notes.filter((n) => [].concat(ivs).includes(n.iv)));

// ---------- the runner ----------
// A run holds the sounding tones, the neck's picture and the stats; every move awaits gate() so pause and stop work.
export class Run {
  constructor({ neck, onLine, onCue, onChord, onCheck, onEnd }) {
    Object.assign(this, { neck, onLine, onCue, onChord, onCheck, onEnd });
    this.sounding = new Map(); // key -> {note, tone}
    this.view = new Map(); // key -> {note, state, dim, boost}
    this.paused = false; this.stopped = false; this.checks = []; this.lastCheck = null;
  }
  async gate() {
    if (this.stopped) throw new Error('stopped');
    while (this.paused) { await S.sleep(0.1); if (this.stopped) throw new Error('stopped'); }
  }
  pause(on) { this.paused = on; const c = S.ctx(); (on ? c.suspend() : c.resume()).catch(() => {}); if ('speechSynthesis' in window) (on ? speechSynthesis.pause() : speechSynthesis.resume()); }
  stop() { this.stopped = true; this.paused = false; S.ctx().resume().catch(() => {}); S.hush(); this.sounding.clear(); }
  draw() { this.neck.set([...this.view.values()].map((v) => ({ ...v.note, state: v.state, dim: v.dim, boost: v.boost }))); }
  show(ch, { quiet = false } = {}) { this.view.clear(); for (const n of ch.notes) this.view.set(n.key, { note: n, state: 'off' }); this.chord = ch; this.onChord?.(quiet ? null : ch); this.draw(); }

  // moves
  async sound(notes, { roll = 0.06, show = true } = {}) {
    await this.gate();
    const t = S.now() + 0.03;
    [...notes].sort((a, b) => a.midi - b.midi).forEach((n, i) => {
      if (this.sounding.has(n.key)) return;
      this.sounding.set(n.key, { note: n, tone: S.tone(n.midi, t + i * roll, { string: n.string }) });
    });
    if (show) for (const n of notes) this.view.set(n.key, { note: n, state: 'on' });
    this.draw();
  }
  async release(notes, state) { // state: 'ring' (keep hearing it), 'off', or 'ghost'
    await this.gate();
    for (const n of notes) {
      const s = this.sounding.get(n.key);
      if (s) { s.tone.stop(S.now(), 0.7); this.sounding.delete(n.key); }
      this.view.set(n.key, { note: n, state });
    }
    this.draw();
  }
  drop(notes) { return this.release(notes, 'ring'); }
  stopNotes(notes) { return this.release(notes, 'off'); }
  async stopAll() { await this.stopNotes([...this.sounding.values()].map((s) => s.note)); }
  async boost(note, on) { const s = this.sounding.get(note.key); if (s) s.tone.level(on ? 2 : 1); const v = this.view.get(note.key); if (v) v.boost = on; this.draw(); }
  async look(notes, state) { await this.gate(); for (const n of notes) this.view.set(n.key, { note: n, state }); this.draw(); }
  async say(line) { await this.gate(); this.onLine?.(line); await S.say(line); }
  async hold(s) { let left = s; while (left > 0) { await this.gate(); await S.sleep(Math.min(0.1, left)); left -= 0.1; } }
  cue(text) { this.onCue?.(text); }
  async cadence(grips, spb = 0.6) { // strummed on the guitar, two beats each
    await this.gate();
    const t0 = S.now() + 0.05;
    grips.forEach((g, i) => S.strum(g, t0 + i * spb * 2, { vel: 0.75 }));
    await this.hold(spb * 2 * grips.length + 0.5);
  }
  // the answer sounds; the listener may tap whether they had it
  async check(notes, { line = 'Check.', hold = 2 } = {}) {
    await this.sound(notes);
    const rec = { at: this.checks.length, got: null };
    this.checks.push(rec);
    this.onCheck?.(rec);
    await this.say(line);
    await this.hold(hold);
  }
}

// ---------- templates ----------
const tn = (iv) => TONE[iv] || 'note';
// the core cycle: whole, the tone alone, found inside (louder at first), removed, restored in the mind, checked, again
function cycle(ch, iv, pass = 0) {
  return async (r) => {
    const all = ivSet(ch, 'all'), tgt = ivSet(ch, iv);
    const rest = all.filter((n) => !tgt.includes(n));
    r.show(ch); r.cue(`The ${tn(iv)}`);
    await r.sound(all); await r.say('The chord.'); await r.hold(1.2);
    await r.stopNotes(rest); await r.say(`This is the ${tn(iv)}.`); await r.hold(1.2);
    await r.sound(rest);
    if (pass === 0) for (const n of tgt) await r.boost(n, true);
    await r.say(pass === 0 ? 'Find it inside the chord.' : `Find the ${tn(iv)}.`); await r.hold(2.2);
    for (const n of tgt) await r.boost(n, false);
    await r.release(tgt, pass >= 2 ? 'off' : 'ring');
    await r.say(`The ${tn(iv)} is gone. Notice the hole.`); await r.hold(1);
    r.cue(`Hold the ${tn(iv)}`);
    await r.say('Put it back, in your head.'); await r.hold(3);
    await r.check(tgt);
    await r.release(tgt, pass >= 1 ? 'off' : 'ring');
    await r.say(pass >= 1 ? 'Again, with nothing lit.' : 'Once more, on your own.'); await r.hold(3);
    await r.check(tgt, { hold: 1.5 });
    if (pass >= 2) {
      await r.release(all, 'off'); r.cue('The whole chord');
      await r.say('Now the whole chord, with nothing sounding.'); await r.hold(4);
      await r.check(all, { hold: 2 });
    }
    await r.stopAll();
  };
}
// stack and peel: tones in tuning order, out in reverse, then one leaves unannounced
function peel(ch, order) {
  return async (r) => {
    r.show(ch); r.cue('Note by note');
    await r.say('Now note by note.');
    for (const iv of order) { await r.sound(ivSet(ch, iv)); await r.say(`The ${tn(iv)}.`); await r.hold(0.8); }
    await r.hold(1.5);
    await r.say('And now they leave, one by one.');
    for (const iv of [...order].reverse().slice(0, -1)) { await r.drop(ivSet(ch, iv)); await r.say(`The ${tn(iv)}.`); await r.hold(1.5); }
    await r.check(ivSet(ch, 'all'), { hold: 1.5 });
    for (let k = 0; k < 3; k++) {
      const iv = order[1 + Math.floor(Math.random() * (order.length - 1))];
      r.cue('Which note left?');
      await r.release(ivSet(ch, iv), 'off');
      await r.say('Which note left?'); await r.hold(2.5);
      await r.look(ivSet(ch, iv), 'ring');
      await r.check(ivSet(ch, iv), { line: `It was the ${tn(iv)}.`, hold: 1.2 });
    }
    await r.stopAll();
  };
}
// a minimal pair: two chords one tone apart, the moving tone isolated, imagined both ways, then told apart
function pair(ctx, qA, qB) {
  return async (r) => {
    const a = voicing(ctx.root, qA, { near: ctx.near, bass: '1' }), b = sameShape(a, qB);
    const moving = a.notes.filter((n) => !b.notes.some((m) => m.key === n.key));
    const movingB = b.notes.filter((n) => !a.notes.some((m) => m.key === n.key));
    const shared = a.notes.filter((n) => !moving.includes(n));
    r.cue(`${QUAL_WORD[qA].slice(0, -1)} or ${QUAL_WORD[qB].slice(0, -1).toLowerCase()}`);
    for (let k = 0; k < 2; k++) {
      r.show(a); await r.sound(a.notes); await r.say(QUAL_WORD[qA]); await r.hold(1.2); await r.stopAll();
      r.show(b); await r.sound(b.notes); await r.say(QUAL_WORD[qB]); await r.hold(1.2); await r.stopAll();
    }
    r.show(merge(a, b));
    await r.sound(moving); await r.hold(1); await r.stopNotes(moving); await r.sound(movingB);
    await r.say('Only one note changes.'); await r.hold(1); await r.stopAll();
    for (const [q, notes] of [[qA, moving], [qB, movingB]]) {
      r.show(q === qA ? a : b);
      await r.sound(shared); await r.look(notes, 'ghost');
      await r.say(`Now imagine it ${QUAL_WORD[q].slice(0, -1).toLowerCase()}.`); await r.hold(2.5);
      await r.check(notes, { hold: 1.5 }); await r.stopAll();
    }
    r.cue('Which one is it?');
    for (let k = 0; k < 3; k++) {
      const pickA = Math.random() < 0.5, ch = pickA ? a : b;
      r.show(ch, { quiet: true });
      await r.sound(ch.notes, { show: false });
      await r.say('Which one is it?'); await r.hold(2.5);
      r.onChord?.(ch); await r.look(ch.notes, 'on');
      r.checks.push({ at: r.checks.length, got: null }); r.onCheck?.(r.checks.at(-1));
      await r.say(QUAL_WORD[pickA ? qA : qB]); await r.hold(1); await r.stopAll();
    }
  };
}
// the same frets with the one tone that differs moved (a major triad's 3rd lowered to make it minor…)
function sameShape(a, q) {
  const from = T.getChord(a.quality).ivs, to = T.getChord(q).ivs;
  const notes = a.notes.map((n) => {
    const i = from.indexOf(n.iv);
    if (i < 0 || to[i] === n.iv) return n;
    const d = T.intervalSemis(simple(to[i])) - T.intervalSemis(simple(n.iv));
    return { ...n, key: `${n.string}:${n.fret + d}`, fret: n.fret + d, midi: n.midi + d, iv: to[i] };
  });
  return { root: a.root, quality: q, notes };
}
const merge = (a, b) => ({ ...a, notes: [...a.notes, ...b.notes.filter((n) => !a.notes.some((m) => m.key === n.key))] });
// top-voice migration: the tone on top (easiest to hear), then in the middle, then removed there and restored
function migrate(ctx, quality, iv) {
  return async (r) => {
    const topV = voicing(ctx.root, quality, { top: iv, near: ctx.near });
    const midV = voicing(ctx.root, quality, { middle: iv, near: ctx.near });
    r.cue(`The ${tn(iv)}, on top`);
    r.show(topV); await r.sound(topV.notes); await r.say(`The ${tn(iv)} is on top.`); await r.hold(1.5);
    await r.stopNotes(topV.notes.filter((n) => n.iv !== iv)); await r.say('Follow it.'); await r.hold(1); await r.stopAll();
    r.cue(`The ${tn(iv)}, in the middle`);
    r.show(midV); await r.sound(midV.notes); await r.say(`The ${tn(iv)} is in the middle.`);
    for (const n of ivSet(midV, iv)) await r.boost(n, true);
    await r.say('Find it now.'); await r.hold(2);
    for (const n of ivSet(midV, iv)) await r.boost(n, false);
    await r.drop(ivSet(midV, iv)); await r.say('Put it back, in your head.'); await r.hold(3);
    await r.check(ivSet(midV, iv)); await r.stopAll();
  };
}
// hold three tones over a sounding root (a four-note chord is more than working memory holds at once)
function overRoot(ch) {
  return async (r) => {
    const all = ivSet(ch, 'all'), root = ivSet(ch, '1');
    r.show(ch); r.cue('The rest over the root');
    await r.sound(all); await r.say('The chord.'); await r.hold(1.5);
    await r.drop(all.filter((n) => !root.includes(n)));
    await r.say('Hold the rest of the chord over the root.'); await r.hold(4);
    await r.check(all, { hold: 2 }); await r.stopAll();
  };
}
// two chords: what moves and what stays, heard, then moved in the mind
function move(a, b, { rounds = 2 } = {}) {
  return async (r) => {
    const stay = a.notes.filter((n) => b.notes.some((m) => m.midi === n.midi));
    const goneA = a.notes.filter((n) => !stay.includes(n)), newB = b.notes.filter((n) => !a.notes.some((m) => m.midi === n.midi));
    r.cue('What moves, what stays');
    r.show(merge(a, b)); r.view.forEach((v) => { v.state = 'off'; }); r.draw();
    await r.say('Listen to what moves and what stays.');
    for (let k = 0; k < rounds; k++) {
      await r.stopNotes(newB); await r.sound(a.notes); r.onChord?.(a); await r.hold(2);
      await r.stopNotes(goneA); await r.sound(newB); r.onChord?.(b); await r.hold(2);
    }
    await r.look(stay, 'on'); await r.say('These notes stayed.'); await r.hold(1.2);
    await r.say('These moved.'); await r.stopNotes(newB); await r.sound(goneA); r.onChord?.(a); await r.hold(0.6); await r.stopNotes(goneA); await r.sound(newB); r.onChord?.(b); await r.hold(1.5);
    await r.stopAll();
    // in the mind
    r.cue('Move it in your head');
    await r.sound(a.notes); r.onChord?.(a); await r.say('Hold it.'); await r.drop(a.notes); await r.hold(2.5);
    await r.look(goneA, 'off'); await r.look(newB, 'ghost'); r.onChord?.(b);
    await r.say('Now move it, in your head.'); await r.hold(3.5);
    await r.check(b.notes); await r.drop(b.notes);
    await r.look(newB, 'off'); await r.look(goneA, 'ghost'); r.onChord?.(a);
    await r.say('Back, in your head.'); await r.hold(3.5);
    await r.check(a.notes); await r.stopAll();
    r.cue('Only the moving notes');
    await r.say('Only the moving notes.');
    await r.sound(goneA); await r.hold(1.5); await r.drop(goneA);
    await r.look(goneA, 'off'); await r.look(newB, 'ghost');
    await r.say('Now move it, in your head.'); await r.hold(3);
    await r.check(newB, { hold: 1.5 }); await r.stopAll();
  };
}
// just listen: the session's chords, no task (plain exposure helps learning carry over)
function listen(chords, seconds = 20) {
  return async (r) => {
    r.cue('Just listen'); await r.say('Just listen.');
    const per = seconds / chords.length;
    for (const ch of chords) { r.show(ch); await r.sound(ch.notes); await r.hold(per); await r.stopAll(); }
  };
}
// review: familiar tones restored from a gap, mixed
function review(items) {
  return async (r) => {
    r.cue('Review'); await r.say('Now a few you know.');
    for (const { ch, iv } of items) {
      r.show(ch); const tgt = ivSet(ch, iv);
      await r.sound(ch.notes.filter((n) => !tgt.includes(n)));
      await r.look(tgt, 'ring'); await r.say(`Put back the ${tn(iv)}.`); await r.hold(2.5);
      await r.check(tgt, { hold: 1.2 }); await r.stopAll();
    }
  };
}
// predict an unheard tone on a new root
function predict(ch, iv) {
  return async (r) => {
    const tgt = ivSet(ch, iv);
    r.show(ch); r.cue(`Imagine the ${tn(iv)}`);
    await r.sound(ch.notes.filter((n) => !tgt.includes(n))); await r.say('A new chord.'); await r.hold(1);
    await r.look(tgt, 'ghost'); await r.say(`Imagine the ${tn(iv)} before it sounds.`); await r.hold(3);
    await r.check(tgt); await r.stopAll();
  };
}
// a bass line, then bass and guide tones, then the bass alone (the chords imagined above it)
function bassLadder(chords) {
  return async (r) => {
    const guide = (ch) => ch.notes.filter((n) => ['3', 'b3', '7', 'b7', 'bb7'].includes(n.iv));
    const bassOf = (ch) => [ch.notes.reduce((a, n) => (n.midi < a.midi ? n : a))];
    r.cue('The bass line');
    for (const [line, part] of [['Just the bass.', bassOf], ['The bass and the guide tones.', (ch) => [...bassOf(ch), ...guide(ch)]], ['The chord.', (ch) => ch.notes]]) {
      await r.say(line);
      for (const ch of chords) { r.show(ch); await r.sound(part(ch)); await r.hold(1.8); await r.stopAll(); }
    }
    r.cue('Hear the chords above the bass');
    await r.say('Now the bass alone. Hear the chords above it.');
    for (const ch of chords) { r.show(ch); await r.sound(bassOf(ch)); await r.look(ch.notes.filter((n) => n !== bassOf(ch)[0]), 'ring'); await r.hold(2.6); await r.stopAll(); }
    await r.say('Check.');
    for (const ch of chords) { r.show(ch); await r.sound(ch.notes); await r.hold(1.8); await r.stopAll(); }
  };
}
// the key first: a short cadence on the guitar
function orient(ctx) {
  return async (r) => {
    r.cue('The key'); await r.say('The key.');
    await r.cadence(['I:maj', 'IV:maj', 'V:7', 'I:maj'].map((tok) => {
      const c = T.parseChordToken(tok, ctx.root);
      const g = F.gripFor(c.root, c.quality, ctx.near);
      return g ? g.notes.map((n) => ({ midi: n.midi, string: n.string })) : [];
    }));
  };
}
const close = () => async (r) => { r.cue(''); await r.say('Play it on your guitar, and compare it with what you hear inside.'); await r.hold(6); };

// ---------- the sessions ----------
// each build(ctx) returns the exercises; ctx = {root (a note), near (a fret), kind}
const at = (ctx, q, o = {}) => voicing(ctx.root, q, { near: ctx.near, ...o });
const up4 = (ctx) => T.transpose(ctx.root, '4');
const tri = (c, q) => at(c, q, { bass: '1', kind: 'close', strings: [4, 3, 2] });
const r7 = (q) => (q === 'maj7' ? '7' : q === 'dim7' ? 'bb7' : 'b7');
// a chord with one of its notes moved by `semis` on the same string (I7 → I: the ♭7 back up to the root)
function shift(ch, iv, semis, newIv, quality) {
  return { root: ch.root, quality, notes: ch.notes.map((n) => (n.iv !== iv ? n : { ...n, key: `${n.string}:${n.fret + semis}`, fret: n.fret + semis, midi: n.midi + semis, iv: newIv })) };
}
// every session: the key, a short review of what came before, the new work with support fading pass by pass, plain
// listening, a mixed review, and a close at the guitar
export const STAGES = [
  { id: 's1', title: 'Tones inside a triad', sessions: [
    { id: '1.1', title: 'The major triad', about: 'The core cycle on the top note, the bass, then the third, with the help fading.', build: (c) => { const ch = tri(c, 'maj'); return [orient(c), cycle(ch, '5'), cycle(ch, '1'), cycle(ch, '3'), cycle(ch, '5', 1), cycle(ch, '3', 1), cycle(ch, '3', 2), listen([ch], 15), review([{ ch, iv: '5' }, { ch, iv: '3' }, { ch, iv: '1' }, { ch, iv: '3' }]), predict(tri({ ...c, root: up4(c) }, 'maj'), '3'), close()]; } },
    { id: '1.2', title: 'Major and minor', about: 'A minimal pair: only the third moves. Then the minor third, found and restored.', build: (c) => { const mj = tri(c, 'maj'), mn = tri(c, 'min'); return [orient(c), review([{ ch: mj, iv: '3' }, { ch: mj, iv: '5' }]), pair(c, 'maj', 'min'), cycle(mn, 'b3'), cycle(mn, 'b3', 1), cycle(mn, '5', 1), cycle(mn, 'b3', 2), listen([mj, mn], 16), review([{ ch: mn, iv: 'b3' }, { ch: mj, iv: '3' }, { ch: mn, iv: '1' }, { ch: mj, iv: '3' }]), close()]; } },
    { id: '1.3', title: 'The fifth', about: 'Stack and peel in tuning order (root, fifth, third); which note left?', build: (c) => { const ch = tri(c, 'maj'), mn = tri(c, 'min'); return [orient(c), review([{ ch: mn, iv: 'b3' }, { ch, iv: '3' }]), peel(ch, ['1', '5', '3']), cycle(ch, '5', 1), cycle(ch, '5', 2), peel(mn, ['1', '5', 'b3']), listen([ch, mn], 14), review([{ ch, iv: '5' }, { ch: mn, iv: '5' }, { ch: mn, iv: 'b3' }]), close()]; } },
    { id: '1.4', title: 'Inversions', about: 'The third on top, then in the middle: find it wherever it sits.', build: (c) => { const b3 = at(c, 'maj', { bass: '3', kind: 'close' }), t3 = at(c, 'maj', { top: '3', kind: 'close' }); return [orient(c), review([{ ch: tri(c, 'maj'), iv: '5' }, { ch: tri(c, 'min'), iv: 'b3' }]), migrate(c, 'maj', '3'), cycle(b3, '3', 1), cycle(t3, '3', 1), migrate(c, 'min', 'b3'), cycle(t3, '5', 2), listen([tri(c, 'maj'), b3, t3], 15), review([{ ch: b3, iv: '1' }, { ch: t3, iv: '3' }, { ch: b3, iv: '5' }]), close()]; } },
    { id: '1.5', title: 'Colours of the triad', about: 'Augmented and diminished (the fifth moves), sus4 (the third replaced).', build: (c) => [orient(c), review([{ ch: tri(c, 'maj'), iv: '3' }, { ch: tri(c, 'min'), iv: '5' }]), pair(c, 'maj', 'aug'), pair(c, 'min', 'dim'), pair(c, 'maj', 'sus4'), cycle(tri(c, 'sus4'), '4', 1), listen(['aug', 'dim', 'sus4'].map((q) => tri(c, q)), 15), close()] },
  ] },
  { id: 's2', title: 'Seventh chords', sessions: [
    { id: '2.1', title: 'Major seventh', about: 'The seventh on top, then in the middle; three tones held over the root.', build: (c) => { const ch = at(c, 'maj7', { top: '7' }), rp = at(c, 'maj7', { bass: '1' }); return [orient(c), review([{ ch: tri(c, 'maj'), iv: '3' }, { ch: tri(c, 'maj'), iv: '5' }]), cycle(ch, '7'), cycle(ch, '7', 1), migrate(c, 'maj7', '7'), cycle(rp, '3', 1), overRoot(rp), cycle(ch, '7', 2), listen([ch, rp], 14), review([{ ch: rp, iv: '7' }, { ch: rp, iv: '3' }, { ch, iv: '5' }]), predict(voicing(up4(c), 'maj7', { near: c.near, top: '7' }), '7'), close()]; } },
    ...[['2.2', 'Major 7 or dominant 7', 'Only the seventh moves: a half step.', 'maj7', '7', 'b7'],
      ['2.3', 'Dominant 7 or minor 7', 'Only the third moves.', '7', 'm7', 'b3'],
      ['2.4', 'Minor 7 or half-diminished', 'Only the fifth moves.', 'm7', 'm7b5', 'b5'],
      ['2.5', 'Half-diminished or diminished 7', 'The seventh drops again: half-diminished to fully diminished.', 'm7b5', 'dim7', 'bb7']].map(([id, title, about, qa, qb, iv]) => ({
      id, title, about, build: (c) => {
        const top = at(c, qb, { top: iv }), rp = at(c, qb, { bass: '1' }), prev = at(c, qa, { top: r7(qa) });
        return [orient(c), review([{ ch: prev, iv: r7(qa) }, { ch: at(c, qa, { bass: '1' }), iv: '3' }].filter((x) => ivSet(x.ch, x.iv).length)), pair(c, qa, qb), cycle(top, iv), cycle(top, iv, 1), overRoot(rp), cycle(rp, iv, 2), listen([prev, top], 14),
          review([{ ch: rp, iv }, { ch: prev, iv: r7(qa) }, { ch: top, iv }]), predict(voicing(up4(c), qb, { near: c.near, top: iv }), iv), close()];
      } })),
    { id: '2.6', title: 'All five, mixed', about: 'Which seventh chord is it? Pairs, then each one’s seventh restored.', build: (c) => [orient(c), pair(c, 'maj7', 'm7'), pair(c, '7', 'm7b5'), pair(c, 'maj7', '7'), review(['maj7', '7', 'm7', 'm7b5', 'dim7'].map((q) => ({ ch: at(c, q, { top: r7(q) }), iv: r7(q) }))), listen(['maj7', '7', 'm7', 'm7b5', 'dim7'].map((q) => at(c, q, { bass: '1' })), 18), predict(voicing(up4(c), 'm7', { near: c.near, top: 'b7' }), 'b7'), close()] },
  ] },
  { id: 's3', title: 'Two chords: what moves, what stays', sessions: [
    { id: '3.1', title: 'Common tones: I to vi', about: 'Imaj7 to vi7: two notes stay, the bass falls a third, the seventh rises to the root.', build: (c) => { const [a, b] = lead(c, ['I:maj7', 'vi:m7']); return [orient(c), review([{ ch: a, iv: '7' }, { ch: b, iv: 'b3' }]), move(a, b), move(a, b, { rounds: 1 }), listen([a, b, a, b], 14), review([{ ch: a, iv: '3' }, { ch: b, iv: 'b7' }, { ch: b, iv: '1' }]), close()]; } },
    { id: '3.2', title: 'One voice by a half step', about: 'I to I7 to IV: the root slides down to ♭7, which becomes the third of IV.', build: (c) => { const [b, d] = lead(c, ['I:7', 'IV:maj7']); const a = shift(b, 'b7', 2, '1', 'maj'); return [orient(c), review([{ ch: b, iv: 'b7' }]), move(a, b, { rounds: 2 }), move(b, d, { rounds: 2 }), listen([a, b, d], 12), review([{ ch: b, iv: 'b7' }, { ch: d, iv: '3' }, { ch: d, iv: '7' }]), close()]; } },
    { id: '3.3', title: 'Guide tones: V7 to I', about: 'The seventh falls a half step to the third; the third holds as the seventh.', build: (c) => { const [a, b] = lead(c, ['V:7', 'I:maj7']); return [orient(c), review([{ ch: a, iv: '3' }, { ch: b, iv: '7' }]), move(a, b), move(a, b, { rounds: 1 }), listen([a, b, a, b], 12), review([{ ch: b, iv: '3' }, { ch: a, iv: 'b7' }, { ch: b, iv: '7' }]), close()]; } },
    { id: '3.4', title: 'Root motion by fifths', about: 'ii–V–I as a bass line, then bass and guide tones, then the bass alone.', build: (c) => { const ch = lead(c, ['ii:m7', 'V:7', 'I:maj7']); return [orient(c), review([{ ch: ch[1], iv: 'b7' }, { ch: ch[2], iv: '3' }]), bassLadder(ch), move(ch[0], ch[1], { rounds: 1 }), bassLadder(lead(c, ['vi:m7', 'ii:m7', 'V:7', 'I:maj7'])), close()]; } },
    { id: '3.5', title: 'Mixed moves', about: 'Two-chord moves in a new key each time.', build: (c) => { const [a, b] = lead(c, ['IV:maj7', 'iii:m7']); const [d, e] = lead(c, ['ii:m7', 'V:7']); const [f, g] = lead(c, ['I:maj7', 'IV:maj7']); return [orient(c), move(a, b, { rounds: 1 }), move(d, e, { rounds: 1 }), move(f, g, { rounds: 1 }), listen([a, b, d, e, f, g], 16), review([{ ch: b, iv: 'b3' }, { ch: e, iv: 'b7' }, { ch: g, iv: '3' }]), close()]; } },
  ] },
  { id: 's4', title: 'ii–V–I as a single unit', sessions: [
    { id: '4.1', title: 'The guide-tone thread', about: 'The 7th of ii falls to the 3rd of V, which holds as the 7th of I.', build: (c) => { const ch = lead(c, ['ii:m7', 'V:7', 'I:maj7']); return [orient(c), move(ch[0], ch[1]), move(ch[1], ch[2]), bassLadder(ch), listen(ch, 10), review([{ ch: ch[0], iv: 'b7' }, { ch: ch[1], iv: '3' }, { ch: ch[2], iv: '7' }]), close()]; } },
    { id: '4.2', title: 'Minor ii–V–i', about: 'A half-diminished ii and a dark V7 landing on minor: what changes against major.', build: (c) => { const mj = lead(c, ['ii:m7', 'V:7', 'I:maj7']), mn = lead(c, ['ii:m7b5', 'V:7b9', 'i:m7']); return [orient(c), bassLadder(mj), move(mn[0], mn[1]), move(mn[1], mn[2]), bassLadder(mn), listen([...mj, ...mn], 16), review([{ ch: mn[0], iv: 'b5' }, { ch: mn[2], iv: 'b3' }, { ch: mj[2], iv: '3' }]), close()]; } },
    { id: '4.3', title: 'Turnarounds', about: 'I–vi–ii–V and iii–vi–ii–V: a chain of fifths, guide tones stepping down.', build: (c) => { const a = lead(c, ['I:maj7', 'vi:m7', 'ii:m7', 'V:7']), b = lead(c, ['iii:m7', 'vi:m7', 'ii:m7', 'V:7']); return [orient(c), bassLadder(a), move(a[0], a[1], { rounds: 1 }), move(a[2], a[3], { rounds: 1 }), bassLadder(b), listen([...a, ...b], 16), close()]; } },
  ] },
];
// voice-led drop 2 voicings of a progression (the engine's voiceLead), root position
function lead(ctx, toks) {
  const chords = toks.map((x) => { const c = T.parseChordToken(x, ctx.root); return { ...c, bass: c.root }; });
  return F.voiceLead(chords, { voicing: chords.some((c) => T.getChord(c.quality).ivs.length >= 4) ? 'drop2' : 'close', startFret: ctx.near }).map((p, i) => ({
    root: chords[i].root, quality: chords[i].quality,
    notes: p.notes.map((n) => ({ key: `${n.string}:${n.fret}`, string: n.string, fret: n.fret, midi: n.midi, iv: n.iv === 'bass' ? '1' : n.iv })),
  }));
}
export const SESSIONS = STAGES.flatMap((s) => s.sessions.map((x) => ({ ...x, stage: s.id, stageTitle: s.title })));
export const LATER = ['Diatonic progressions', 'Colour and chromatic harmony', 'Creating'];

// run a session: a key (random unless given), its exercises in order
export async function runSession(session, run, { key = null } = {}) {
  const root = T.parseNote(key || KEYS[Math.floor(Math.random() * KEYS.length)]);
  const ctx = { root, near: 3 + Math.floor(Math.random() * 5) };
  run.key = root;
  const exercises = session.build(ctx);
  await S.preload(LINES).catch(() => {});
  try {
    for (const ex of exercises) {
      await run.gate();
      await ex(run);
      await run.hold(0.6);
    }
    await run.say("That's the end of this session.");
    run.onEnd?.(true);
  } catch (e) {
    if (e.message !== 'stopped') { console.error(e); run.onEnd?.(false, e); } else run.onEnd?.(false);
  } finally { S.hush(); }
}
export const QUALITY_ABOUT = {
  maj: 'major triad · 1 3 5 · I, IV and V of a major key',
  min: 'minor triad · 1 ♭3 5 · ii, iii and vi of a major key; i of a minor key',
  dim: 'diminished triad · 1 ♭3 ♭5 · vii° of a major key, ii° of a minor key',
  aug: 'augmented triad · 1 3 ♯5 · ♭III+ of harmonic minor; a passing chord',
  sus4: 'sus4 · 1 4 5 · the third replaced by the fourth; resolves down to the third',
  maj7: 'major seventh · 1 3 5 7 · Imaj7 and IVmaj7 of a major key',
  '7': 'dominant seventh · 1 3 5 ♭7 · V7 of a major or minor key; the tritone 3–♭7 wants to resolve',
  m7: 'minor seventh · 1 ♭3 5 ♭7 · ii7, iii7 and vi7 of a major key',
  m7b5: 'half-diminished · 1 ♭3 ♭5 ♭7 · viiø7 of a major key, iiø7 of a minor key',
  dim7: 'diminished seventh · 1 ♭3 ♭5 𝄫7 · vii°7 of harmonic minor; symmetrical, every note can be the root',
  mMaj7: 'minor-major seventh · 1 ♭3 5 7 · i of melodic or harmonic minor',
};
