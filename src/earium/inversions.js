// Inversions: one chord, in one key, bouncing around its inversions on the neck. On one string set (triads on
// three adjacent strings, sevenths as drop 2 or drop 3) or on all of them. Each voicing rings until the next; the
// voice names the inversion (and, if asked, the note in the bass).
import * as T from '../theory.js';
import * as A from '../audio.js';
import * as V from '../caged/voice.js';
import { OPEN, fingerable } from './harm.js';
import { degWord } from './words.js';
import { formsFor } from './forms.js';

export const QUALITIES = [['maj', 'Major'], ['min', 'Minor'], ['dim', 'Diminished'], ['aug', 'Augmented'], ['sus4', 'Sus 4'], ['sus2', 'Sus 2'],
  ['maj7', 'Major 7'], ['7', 'Dominant 7'], ['m7', 'Minor 7'], ['m7b5', 'Half-diminished'], ['dim7', 'Diminished 7'], ['mMaj7', 'Minor-major 7'], ['6', 'Major 6'], ['m6', 'Minor 6']];
// string sets, low string first
export const SETS = {
  3: [['654', 'Strings 6 5 4'], ['543', 'Strings 5 4 3'], ['432', 'Strings 4 3 2'], ['321', 'Strings 3 2 1']],
  4: [['4321', 'Drop 2 on 4 3 2 1'], ['5432', 'Drop 2 on 5 4 3 2'], ['6543', 'Drop 2 on 6 5 4 3'], ['6432', 'Drop 3 on 6 4 3 2'], ['5321', 'Drop 3 on 5 3 2 1']],
};
export const INV_NAMES = ['root position', 'first inversion', 'second inversion', 'third inversion'];
const ORDER = { 1: 0, 3: 1, b3: 1, 2: 1, 4: 1, 5: 2, b5: 2, '#5': 2, 7: 3, b7: 3, bb7: 3, 6: 3 };

// the standard voicing groups: close triads on three neighbouring strings; on four neighbouring strings, drop 2
// (a close voicing with its second-highest note an octave lower); on 6-4-3-2 and 5-3-2-1, drop 3 (the third-highest
// dropped). Checked by undoing the drop and asking whether the result is a close voicing.
function standard(midis, setId) {
  const v = [...midis].sort((a, b) => a - b);
  const close = (x) => { const y = [...x].sort((a, b) => a - b); return y[y.length - 1] - y[0] < 12; };
  if (v.length === 3) return close(v);
  if (setId === '6432' || setId === '5321') return close([v[1], v[2], v[3], v[0] + 12]) && v[0] + 12 > v[1] && v[0] + 12 < v[2]; // drop 3
  return close([v[1], v[2], v[3], v[0] + 12]) && v[0] + 12 > v[2] && v[0] + 12 < v[3]; // drop 2
}
// every voicing of the chord on a string set: one chord tone per string, all tones present, playable
export function voicings(rootPc, q, setId) {
  const ivs = T.getChord(q).ivs;
  const pcs = new Map(ivs.map((iv) => [(rootPc + T.intervalSemis(iv)) % 12, iv]));
  const strings = setId.split('').map(Number);
  const out = [];
  const cur = [];
  const go = (k) => {
    if (k === strings.length) {
      const used = new Set(cur.map((n) => n.iv));
      if (used.size !== ivs.length) return;
      const fr = cur.filter((n) => n.fret > 0).map((n) => n.fret);
      if (!fingerable(cur)) return;
      if (!standard(cur.map((n) => n.midi), setId)) return;
      const notes = cur.map((n) => ({ ...n }));
      const bass = notes[0].iv;
      out.push({ notes, set: setId, inv: ORDER[bass] ?? 0, bass, at: fr.length ? fr.reduce((a, b) => a + b, 0) / fr.length : 0 });
      return;
    }
    const s = strings[k];
    for (let f = 0; f <= 15; f++) {
      const midi = OPEN[6 - s] + f, iv = pcs.get(midi % 12);
      if (!iv || cur.some((n) => n.iv === iv)) continue;
      cur.push({ string: s, fret: f, midi, iv });
      go(k + 1);
      cur.pop();
    }
  };
  go(0);
  return out.filter((v) => v.notes.every((n, i) => i === 0 || n.midi > v.notes[i - 1].midi)).sort((a, b) => a.at - b.at);
}

export function inversions(O, ui, voices) {
  const ctx = () => A.audioCtx();
  const rootPc = T.notePc(T.parseNote(O.root));
  const size = T.getChord(O.q).ivs.length >= 4 ? 4 : 3;
  const sets = O.set === 'any' ? SETS[size].map(([id]) => id) : O.set === 'forms' ? [] : [O.set];
  let all = sets.flatMap((id) => voicings(rootPc, O.q, id));
  if (O.set === 'forms') all = formsFor(T.parseNote(O.root), O.q).filter((g) => g.notes.length <= 5).map((g) => { const fr = g.notes.map((n) => n.fret); return { notes: g.notes, set: 'forms', inv: ORDER[g.notes[0].iv] ?? 0, bass: g.notes[0].iv, at: fr.reduce((a, b) => a + b, 0) / fr.length, form: true }; });
  all.sort((a, b) => a.at - b.at);
  let alive = true, paused = false, timer = null, idx = -1, dir = 1, prev = null;
  const history = []; let back = 0; // voicings already played, and how far back we've stepped
  function nextVoicing() {
    if (!all.length) return null;
    if (O.move === 'up') { idx = (idx + 1) % all.length; return all[idx]; }
    if (O.move === 'updown') { if (idx + dir >= all.length || idx + dir < 0) dir = -dir; idx = Math.max(0, idx + dir); return all[idx]; }
    // bounce: a different inversion, not far away
    const cands = all.filter((v) => v !== prev && (!prev || (v.inv !== prev.inv && Math.abs(v.at - prev.at) <= 7)));
    const pool = cands.length ? cands : all.filter((v) => v !== prev);
    return pool[Math.floor(Math.random() * pool.length)];
  }
  // manual: a button press, which works while paused too (it shows and sounds the voicing, and stays paused)
  function step(v0 = null, manual = false) {
    if (!alive || (paused && !v0 && !manual)) return;
    const v = v0 || nextVoicing();
    if (!v0) { history.push(v); if (history.length > 200) history.shift(); }
    if (!v) { ui.none(); return; }
    const t = ctx().currentTime + 0.05;
    const midis = v.notes.map((n) => n.midi);
    voices.set(midis, t, O.arp ? { arp: 0.32 } : { stagger: 0.04 });
    const lines = O.voice ? [INV_NAMES[v.inv] || 'root position', ...(O.bassSay ? [`In the bass, the ${degWord(v.bass)}.`] : [])] : [];
    if (lines.length) V.say(lines.map((l) => [l]), t + 0.25, { vol: O.vvol });
    ui.show(v, prev, lines);
    prev = v;
    if (!paused) timer = setTimeout(() => { if (back > 0) { back--; step(history[history.length - 1 - back]); } else step(); }, O.pace * 1000);
  }
  step();
  return {
    O,
    stop() { alive = false; clearTimeout(timer); V.hush(); voices.releaseAll(ctx().currentTime, 1.5); },
    pause(p) { paused = p; clearTimeout(timer); if (!p) step(); },
    get paused() { return paused; },
    next() { clearTimeout(timer); if (back > 0) { back--; step(history[history.length - 1 - back], true); } else step(null, true); },
    // back to the voicing before (and on back through what was played)
    prev() { if (history.length - 1 - back <= 0) return; clearTimeout(timer); back++; step(history[history.length - 1 - back], true); },
    count: all.length,
  };
}
export const allPhrases = () => [...INV_NAMES];
