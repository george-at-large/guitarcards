// Modal interchange and its neighbours: the 16 chords worth knowing cold (borrowed from parallel modes across
// harmonic systems, plus secondary dominants, tritone subs and diminished chords), four more for later, and helpers
// that spell, voice and explain them in any key. The long explanations and the progressions come from the CAGED
// app's data (src/caged/borrowdata.js, chromdata.js).
import * as T from '../theory.js';
import * as F from '../fretboard.js';
import * as G from '../caged/grips.js';
import { BORROWED } from '../caged/borrowdata.js';
import { CHROMATIC } from '../caged/chromdata.js';
import { sym, esc } from './core.js';

const E = (id, tok, rn, name, src, job, prog, at, data, o = {}) => ({ id, tok, rn, name, src, job, prog, at, data, ...o });
const M = { minor: true };
export const CORE = [
  E('iv', 'iv:min', 'iv', 'minor iv', 'Aeolian (natural minor)', 'IV turns minor: the 6th sighs down to ♭6, then on to 5.', ['I:maj', 'IV:maj', 'iv:min', 'I:maj'], 2, 'iv'),
  E('iv6', 'iv:m6', 'iv6', 'minor iv6', 'Aeolian (natural minor)', 'Jazz’s minor iv: its ♭6 is the ♭9 of V, so it’s a soft way home on its own.', ['I:maj7', 'IV:maj7', 'iv:m6', 'I:maj7'], 2, 'iv6'),
  E('bVII', 'bVII:maj', '♭VII', 'flat seven', 'Mixolydian', 'Home from a whole step below: ♭VII – I, the rock and folk cadence.', ['I:maj', 'bVII:maj', 'IV:maj', 'I:maj'], 1, 'bVII'),
  E('bVI', 'bVI:maj', '♭VI', 'flat six', 'Aeolian (natural minor)', 'The Aeolian climb ♭VI – ♭VII – I, or the deceptive V – ♭VI.', ['I:maj', 'bVI:maj', 'bVII:maj', 'I:maj'], 1, 'bVI'),
  E('bIII', 'bIII:maj', '♭III', 'flat three', 'Aeolian (natural minor)', 'Up a minor 3rd from I: the bold lift I – ♭III – IV.', ['I:maj', 'bIII:maj', 'IV:maj', 'I:maj'], 1, 'bIII'),
  E('bVII7', 'bVII:7', '♭VII7', 'backdoor dominant', 'Aeolian (natural minor)', 'The back door home: iv7 – ♭VII7 – I, a dominant from a whole step below.', ['iv:m7', 'bVII:7', 'I:maj7', 'I:maj7'], 1, 'bVII7'),
  E('iiø7', 'ii:m7b5', 'iiø7', 'half-diminished ii', 'Aeolian (natural minor)', 'A darker ii for a major ii–V–I; its ♭6 becomes the ♭9 of V7♭9.', ['ii:m7b5', 'V:7', 'I:maj7', 'I:maj7'], 0, 'iiø7'),
  E('v', 'v:min', 'v', 'minor v', 'Mixolydian', 'V without its leading tone: a soft, modal dominant.', ['I:maj', 'v:min', 'IV:maj', 'I:maj'], 1, 'v'),
  E('II', 'II:maj', 'II', 'major II', 'Lydian', 'The Lydian lift: I – II, its ♯4 shining, then on to IV.', ['I:maj', 'II:maj', 'IV:maj', 'I:maj'], 1, 'II'),
  E('bII', 'bII:maj', '♭II', 'Neapolitan', 'Phrygian', 'A dark half step above home: ♭II – V7 – i in a minor key.', ['i:min', 'bII:maj', 'V:7', 'i:min'], 1, 'bII', M),
  E('V7m', 'V:7', 'V7', 'major V7 in minor', 'Harmonic minor', 'The minor key’s real dominant: the raised 7th leads home.', ['i:min', 'iv:min', 'V:7', 'i:min'], 2, 'V7m', M),
  E('Ipic', 'I:maj', 'I', 'Picardy third', 'Ionian (parallel major)', 'End a minor piece on a major I: sudden light.', ['i:min', 'iv:min', 'V:7', 'I:maj'], 3, 'Ipic', M),
  E('subV', 'bII:7', '♭II7', 'tritone sub', 'Tritone substitute', 'Stands in for V7: the same 3rd and 7th, and the bass slides down a half step home.', ['ii:m7', 'bII:7', 'I:maj7', 'I:maj7'], 1, 'subV', { chrom: true }),
  E('passdim', '#i:dim7', '♯i°7', 'passing diminished', 'Passing diminished', 'Between I and ii: the bass climbs a half step at a time.', ['I:maj7', '#i:dim7', 'ii:m7', 'V:7'], 1, 'passdim', { chrom: true }),
  E('VofV', 'II:7', 'II7', 'V of V', 'Secondary dominant', 'Points at V: II7 – V7 – I, its ♯4 leading up to 5.', ['I:maj', 'II:7', 'V:7', 'I:maj'], 1, 'VofV', { chrom: true }),
  E('Vofvi', 'III:7', 'III7', 'V of vi', 'Secondary dominant', 'Points at vi: III7 – vi, its ♯5 leading up to 6.', ['I:maj', 'III:7', 'vi:min', 'IV:maj'], 1, 'Vofvi', { chrom: true }),
];
export const MORE = [
  E('ctdim', 'I:dim7', 'I°7', 'common-tone diminished', 'Common-tone diminished', 'Keeps the root of I and decorates it: I – I°7 – I.', ['I:maj7', 'I:dim7', 'I:maj7', 'V:7'], 1, 'ctdim', { chrom: true }),
  E('bVI7', 'bVI:7', '♭VI7', 'tritone sub of V of V', 'Tritone substitute', 'Subs for II7 and slides down onto V: I – ♭VI7 – V7 – I.', ['I:maj7', 'bVI:7', 'V:7', 'I:maj7'], 1, 'subV', { chrom: true }),
  E('IVm', 'IV:maj', 'IV', 'major IV in minor', 'Dorian', 'Dorian’s bright 6 in a minor key: i – IV, back and forth.', ['i:min', 'IV:maj', 'i:min', 'IV:maj'], 1, 'IVm', M),
  E('viidim', 'vii:dim7', 'vii°7', 'leading-tone diminished', 'Harmonic minor', 'Four notes all leaning onto i: the minor key’s other dominant.', ['i:min', 'iv:min', 'vii:dim7', 'i:min'], 2, 'viidim', M),
];
export const SOURCES = ['Aeolian (natural minor)', 'Dorian', 'Phrygian', 'Lydian', 'Mixolydian', 'Locrian', 'Harmonic minor', 'Melodic minor', 'Ionian (parallel major)', 'Secondary dominant', 'Tritone substitute', 'Passing diminished', 'Common-tone diminished'];
const SRC_SCALE = { 'Aeolian (natural minor)': 'aeolian', Dorian: 'dorian', Phrygian: 'phrygian', Lydian: 'lydian', Mixolydian: 'mixolydian', Locrian: 'locrian', 'Harmonic minor': 'harmonic-minor', 'Melodic minor': 'melodic-minor', 'Ionian (parallel major)': 'ionian' };
export const DATA = Object.fromEntries([...BORROWED, ...CHROMATIC].map((d) => [d.id, d]));
export const ALL_DATA = [...BORROWED, ...CHROMATIC];

export const chordOf = (tok, tonic) => T.parseChordToken(tok, tonic);
// numeral with its quality, the way it's written: iv7, ♭VII7, iiø7, ♯i°7
export function rnOf(c) {
  if (c.rn) return c.rn;
  const head = T.prettyRoman(c.roman || '');
  const lower = head && head === head.toLowerCase();
  let s = c.quality === 'm7b5' ? 'ø7' : T.pretty(T.getChord(c.quality).sym).trim();
  if (lower && /^m(?!aj)/.test(s)) s = s.slice(1);
  if (c.quality === 'min' || c.quality === 'maj') s = '';
  return head + s;
}
export const nameOf = (c) => sym(c.root, c.quality).replace(/\s+/g, '');
// the notes of a chord that aren't in the home key (major, or natural minor for a minor key), as degrees
export function outside(entry, tonic) {
  const c = chordOf(entry.tok, tonic);
  const home = T.scaleNotes(tonic, entry.minor ? 'aeolian' : 'major').map(T.notePc);
  return T.chordNotes(c.root, c.quality).filter((n) => !home.includes(T.notePc(n))).map((n) => ({ deg: T.prettyIv(T.intervalBetween(tonic, n)), note: T.noteName(n, true) }));
}
// a source is a fair wrong answer only if that parallel scale doesn't hold the chord
export function srcHolds(src, entry, tonic) {
  const sc = SRC_SCALE[src];
  if (!sc) return src === entry.src;
  const c = chordOf(entry.tok, tonic);
  const pcs = T.scaleNotes(tonic, sc).map(T.notePc);
  return T.chordNotes(c.root, c.quality).every((n) => pcs.includes(T.notePc(n)));
}

// voice a run of chords in one CAGED position, each one close to the last
export function voiceRun(chords, tonic, shape) {
  const pos = G.positionOf(tonic, shape);
  let prev = null;
  return chords.map((c) => {
    let g = null;
    try { g = G.gripInPosition(c.root, c.quality, pos, prev); } catch (e) { g = null; }
    if (!g) {
      const vs = F.chordVoicings({ root: c.root, quality: c.quality, voicing: 'drop2', stringSet: 'auto', stringSetAll: true, inversion: 'all' });
      g = vs.sort((a, b) => Math.abs(center(a) - pos.mid) - Math.abs(center(b) - pos.mid))[0];
    }
    prev = g;
    return g;
  });
}
const center = (p) => p.notes.reduce((s, n) => s + n.fret, 0) / p.notes.length;
export function barsHTML(chords, hl = new Set(), gap = -1, namesOnly = false) {
  return `<div class="prog-bars">${chords.map((c, i) => i === gap
    ? `<div class="bar-c hl"><b>?</b><small>&nbsp;</small></div>`
    : `<div class="bar-c ${hl.has(i) ? 'hl' : ''}" data-bar="${i}"><b>${esc(nameOf(c))}</b>${namesOnly ? '' : `<small>${esc(rnOf(c))}</small>`}</div>`).join('')}</div>`;
}
