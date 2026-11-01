// Progression game: hear a progression (always starting on I), spell it chord by chord.
// Root-position voicings only (root in the bass, chord stacked above), optional arpeggiation.
import * as T from './theory.js';
import * as A from './audio.js';

const C = (tok, label) => ({ tok, label });
const TRIADS = { ii: C('ii:min', 'ii'), iii: C('iii:min', 'iii'), IV: C('IV:maj', 'IV'), V: C('V:maj', 'V'), vi: C('vi:min', 'vi') };
const SEV = { I: C('I:maj7', 'Imaj7'), ii: C('ii:m7', 'ii7'), iii: C('iii:m7', 'iii7'), IV: C('IV:maj7', 'IVmaj7'), V: C('V:7', 'V7'), vi: C('vi:m7', 'vi7') };
export const PG_LEVELS = [
  { n: 2, start: C('I:maj', 'I'), pool: [TRIADS.IV, TRIADS.V], title: 'Two chords: I → IV or V' },
  { n: 2, start: C('I:maj', 'I'), pool: [TRIADS.IV, TRIADS.V, TRIADS.vi], title: 'Two chords: I → IV, V or vi' },
  { n: 2, start: C('I:maj', 'I'), pool: [TRIADS.ii, TRIADS.IV, TRIADS.V, TRIADS.vi], title: 'Two chords: I → ii, IV, V or vi' },
  { n: 3, start: C('I:maj', 'I'), pool: [TRIADS.IV, TRIADS.V, TRIADS.vi], title: 'Three chords: IV, V, vi' },
  { n: 3, start: C('I:maj', 'I'), pool: [TRIADS.ii, TRIADS.IV, TRIADS.V, TRIADS.vi, C('I:maj', 'I')], title: 'Three chords: ii, IV, V, vi (and back to I)' },
  { n: 4, start: C('I:maj', 'I'), pool: [TRIADS.ii, TRIADS.IV, TRIADS.V, TRIADS.vi, C('I:maj', 'I')], title: 'Four chords: the common diatonic triads' },
  { n: 4, start: C('I:maj', 'I'), pool: [TRIADS.ii, TRIADS.iii, TRIADS.IV, TRIADS.V, TRIADS.vi, C('I:maj', 'I')], title: 'Four chords: add iii' },
  { n: 4, start: SEV.I, pool: [SEV.ii, SEV.iii, SEV.IV, SEV.V, SEV.vi, SEV.I], title: 'Four 7th chords (jazz colours)' },
  { n: 4, start: C('I:maj', 'I'), pool: [TRIADS.ii, TRIADS.IV, TRIADS.V, TRIADS.vi, C('iv:min', 'iv'), C('bVII:maj', '♭VII'), C('bVI:maj', '♭VI')], title: 'Borrowed chords: iv, ♭VII, ♭VI' },
  { n: 4, start: SEV.I, pool: [SEV.ii, SEV.V, SEV.vi, SEV.IV, C('VI:7', 'VI7 (V/ii)'), C('II:7', 'II7 (V/V)'), C('III:7', 'III7 (V/vi)')], title: 'Secondary dominants' },
  { n: 5, start: SEV.I, pool: [SEV.ii, SEV.iii, SEV.IV, SEV.V, SEV.vi, C('VI:7', 'VI7 (V/ii)'), C('II:7', 'II7 (V/V)'), C('iv:m7', 'iv7'), C('bVII:7', '♭VII7')], title: 'Five chords: everything so far' },
];
export const PG_PASS = { need: 8, of: 10 };

export function pgRound(level) {
  const L = PG_LEVELS[level];
  const seq = [L.start];
  while (seq.length < L.n) {
    const opts = L.pool.filter((c) => c.tok !== seq[seq.length - 1].tok);
    seq.push(opts[Math.floor(Math.random() * opts.length)]);
  }
  const keyName = T.MAJOR_KEYS[Math.floor(Math.random() * T.MAJOR_KEYS.length)];
  return { seq, key: T.parseKey(keyName) };
}

// root position: bass root in octave 2–3, then the chord stacked in close position from the root (around middle C)
function rootPosition(tok, tonic) {
  const c = T.parseChordToken(tok, tonic);
  const r = T.notePc(c.root);
  const bass = 40 + ((r - 40) % 12 + 12) % 12;            // E2..D#3
  let top = bass + 12; if (top < 50) top += 12;
  const ivs = T.getChord(c.quality).ivs.map((iv) => T.intervalSemis(iv) % 12);
  return [bass, ...ivs.map((s) => top + s)];
}
export function playSeq(seq, tonic, { arpeggio = false, bpm = 66 } = {}) {
  A.hush();
  const c = A.audioCtx();
  const spb = 60 / bpm;
  const per = arpeggio ? 4 : 2; // beats per chord
  const t0 = c.currentTime + 0.1;
  seq.forEach((ch, i) => {
    const mids = rootPosition(ch.tok, tonic);
    const t = t0 + i * per * spb;
    mids.forEach((m, k) => A.keys(m, arpeggio ? t + k * spb * 0.5 : t, (arpeggio ? per - k * 0.5 : per) * spb * 0.95, k === 0 ? 0.7 : 0.55));
  });
}
export const chordName = (tok, tonic) => { const c = T.parseChordToken(tok, tonic); return T.chordSymbol(c.root, c.quality); };
