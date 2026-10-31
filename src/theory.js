// Music theory core: spelled notes, intervals, scales, chords, keys, roman numerals.
// Everything is computed; nothing is hand-entered per key.

export const LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const LETTER_PC = [0, 2, 4, 5, 7, 9, 11];

// interval name -> [degree number (1-based, can exceed 7), semitones]
export const INTERVALS = {
  '1': [1, 0], 'b2': [2, 1], '2': [2, 2], '#2': [2, 3], 'b3': [3, 3], '3': [3, 4], '4': [4, 5],
  '#4': [4, 6], 'b5': [5, 6], '5': [5, 7], '#5': [5, 8], 'b6': [6, 8], '6': [6, 9], 'bb7': [7, 9],
  'b7': [7, 10], '7': [7, 11], '8': [8, 12], 'b9': [9, 13], '9': [9, 14], '#9': [9, 15], '10': [10, 16],
  '11': [11, 17], '#11': [11, 18], '12': [12, 19], 'b13': [13, 20], '13': [13, 21],
  'b10': [10, 15], 'b14': [14, 22], '14': [14, 23], '15': [15, 24], 'b12': [12, 18], '#12': [12, 20],
};
export const intervalSemis = (iv) => {
  const x = INTERVALS[iv];
  if (!x) throw new Error(`Unknown interval "${iv}"`);
  return x[1];
};

// ---------- notes ----------
export function parseNote(name) {
  const m = /^([A-Ga-g])(bb|##|b|#|♭|♯|x)?$/.exec(String(name).trim());
  if (!m) throw new Error(`Bad note "${name}"`);
  const letter = LETTERS.indexOf(m[1].toUpperCase());
  const accMap = { b: -1, '♭': -1, bb: -2, '#': 1, '♯': 1, '##': 2, x: 2 };
  const acc = m[2] ? accMap[m[2]] : 0;
  return { letter, acc };
}
export const notePc = (n) => (((LETTER_PC[n.letter] + n.acc) % 12) + 12) % 12;
export function noteName(n, pretty = false) {
  const accs = pretty
    ? { '-2': '𝄫', '-1': '♭', 0: '', 1: '♯', 2: '𝄪' }
    : { '-2': 'bb', '-1': 'b', 0: '', 1: '#', 2: '##' };
  return LETTERS[n.letter] + accs[n.acc];
}
export const pretty = (s) => String(s).replace(/([A-G0-9])bb/g, '$1𝄫').replace(/([A-G0-9)])b/g, '$1♭').replace(/([A-G])##/g, '$1𝄪').replace(/#/g, '♯');
export const prettyRoman = (r) => String(r ?? '').replace(/(^|[\s/(])bb(?=[IViv])/g, '$1𝄫').replace(/(^|[\s/(])b(?=[IViv])/g, '$1♭').replace(/#/g, '♯');
export const prettyIv = (iv) => String(iv).replace(/bb/g, '𝄫').replace(/b/g, '♭').replace(/#/g, '♯');

export function transpose(note, iv) {
  const [deg, semis] = INTERVALS[iv] || (() => { throw new Error(`Unknown interval "${iv}"`); })();
  const letter = (note.letter + deg - 1) % 7;
  const targetPc = (notePc(note) + semis) % 12;
  let acc = targetPc - LETTER_PC[letter];
  while (acc > 6) acc -= 12;
  while (acc < -6) acc += 12;
  return { letter, acc };
}
// transpose by a raw semitone amount, choosing a sensible spelling
export function transposeSemis(note, semis) {
  const names = ['1', 'b2', '2', 'b3', '3', '4', 'b5', '5', 'b6', '6', 'b7', '7'];
  const s = ((semis % 12) + 12) % 12;
  const n = transpose(note, names[s]);
  return Math.abs(n.acc) > 1 ? enharmonic(n) : n;
}
export function enharmonic(n) {
  const pc = notePc(n);
  return parseNote(PREFERRED[pc]);
}
const PREFERRED = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
export const noteFromPc = (pc, preferSharp = false) =>
  parseNote(preferSharp ? ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'][pc] : PREFERRED[pc]);

// ---------- scales ----------
const MAJOR = ['1', '2', '3', '4', '5', '6', '7'];
const MEL = ['1', '2', 'b3', '4', '5', '6', '7'];
const HARM = ['1', '2', 'b3', '4', '5', 'b6', '7'];
const HMAJ = ['1', '2', '3', '4', '5', 'b6', '7'];

// rotate a parent scale to its nth mode and re-express intervals relative to the new root
const IV_BY_SEMI = {
  1: ['b2'], 2: ['2'], 3: ['b3', '#2'], 4: ['3', 'b4'], 5: ['4'], 6: ['#4', 'b5'], 7: ['5'],
  8: ['b6', '#5'], 9: ['6', 'bb7'], 10: ['b7'], 11: ['7'],
};
function modeOf(parent, n) {
  const semis = parent.map(intervalSemis);
  const out = [];
  for (let i = 0; i < parent.length; i++) {
    const j = (n + i) % parent.length;
    const deg = i + 1; // 7-note scales: each step is the next letter
    const s = (semis[j] - semis[n] + 12) % 12;
    if (i === 0) { out.push('1'); continue; }
    // choose the interval name with the right degree number
    const cands = Object.keys(INTERVALS).filter((k) => INTERVALS[k][0] === deg && INTERVALS[k][1] === s);
    if (cands.length) out.push(cands[0]);
    else out.push(...(IV_BY_SEMI[s] || []).slice(0, 1)); // b4 etc. fallback
  }
  return out;
}
INTERVALS.b4 = [4, 4]; INTERVALS.b8 = [8, 11]; INTERVALS['#6'] = [6, 10]; INTERVALS.bb3 = [3, 2];

export const SCALES = {};
const def = (id, name, ivs, extra = {}) => { SCALES[id] = { id, name, ivs, ...extra }; };
const MAJOR_MODES = ['ionian', 'dorian', 'phrygian', 'lydian', 'mixolydian', 'aeolian', 'locrian'];
const MAJOR_NAMES = ['Ionian (major)', 'Dorian', 'Phrygian', 'Lydian', 'Mixolydian', 'Aeolian (natural minor)', 'Locrian'];
const MEL_MODES = ['melodic-minor', 'dorian-b2', 'lydian-augmented', 'lydian-dominant', 'mixolydian-b6', 'locrian-nat2', 'altered'];
const MEL_NAMES = ['Melodic minor', 'Dorian ♭2', 'Lydian augmented', 'Lydian dominant', 'Mixolydian ♭6', 'Locrian ♮2', 'Altered'];
const HARM_MODES = ['harmonic-minor', 'locrian-nat6', 'ionian-sharp5', 'dorian-sharp4', 'phrygian-dominant', 'lydian-sharp2', 'altered-dim'];
const HARM_NAMES = ['Harmonic minor', 'Locrian ♮6', 'Ionian ♯5', 'Dorian ♯4', 'Phrygian dominant', 'Lydian ♯2', 'Altered ♭♭7 (superlocrian ♭♭7)'];
const HMAJ_MODES = ['harmonic-major', 'dorian-b5', 'phrygian-b4', 'lydian-b3', 'mixolydian-b2', 'lydian-augmented-sharp2', 'locrian-bb7'];
const HMAJ_NAMES = ['Harmonic major', 'Dorian ♭5', 'Phrygian ♭4', 'Lydian ♭3', 'Mixolydian ♭2', 'Lydian augmented ♯2', 'Locrian ♭♭7'];
const FAMILIES = [
  ['major', MAJOR, MAJOR_MODES, MAJOR_NAMES],
  ['melodic-minor', MEL, MEL_MODES, MEL_NAMES],
  ['harmonic-minor', HARM, HARM_MODES, HARM_NAMES],
  ['harmonic-major', HMAJ, HMAJ_MODES, HMAJ_NAMES],
];
for (const [fam, parent, ids, names] of FAMILIES) {
  ids.forEach((id, n) => def(id, names[n], modeOf(parent, n), { family: fam, modeIndex: n, parentId: ids[0] }));
}
SCALES.ionian.parentId = 'ionian';
def('major', 'Major', MAJOR, { family: 'major', modeIndex: 0, parentId: 'ionian', alias: 'ionian' });
def('natural-minor', 'Natural minor', SCALES.aeolian.ivs, { family: 'major', modeIndex: 5, parentId: 'ionian', alias: 'aeolian' });
def('spanish-phrygian', 'Spanish Phrygian', SCALES['phrygian-dominant'].ivs, { family: 'harmonic-minor', modeIndex: 4, parentId: 'harmonic-minor', alias: 'phrygian-dominant' });
def('super-locrian', 'Super Locrian (altered)', SCALES.altered.ivs, { family: 'melodic-minor', modeIndex: 6, parentId: 'melodic-minor', alias: 'altered' });
def('double-harmonic', 'Double harmonic major', ['1', 'b2', '3', '4', '5', 'b6', '7']);
def('gypsy-minor', 'Hungarian (gypsy) minor', ['1', '2', 'b3', '#4', '5', 'b6', '7']);
def('major-pentatonic', 'Major pentatonic', ['1', '2', '3', '5', '6'], { penta: true });
def('minor-pentatonic', 'Minor pentatonic', ['1', 'b3', '4', '5', 'b7'], { penta: true });
def('blues', 'Blues scale', ['1', 'b3', '4', 'b5', '5', 'b7'], { penta: true, blueOf: 'minor-pentatonic' });
def('major-blues', 'Major blues scale', ['1', '2', 'b3', '3', '5', '6'], { penta: true, blueOf: 'major-pentatonic' });
def('dominant-pentatonic', 'Dominant pentatonic', ['1', '2', '3', '5', 'b7'], { penta: true });
def('minor6-pentatonic', 'Minor 6 pentatonic', ['1', 'b3', '4', '5', '6'], { penta: true });
def('in-sen', 'In-sen', ['1', 'b2', '4', '5', 'b7'], { penta: true });
def('hirajoshi', 'Hirajoshi', ['1', '2', 'b3', '5', 'b6'], { penta: true });
def('whole-tone', 'Whole tone', ['1', '2', '3', '#4', '#5', 'b7']);
def('diminished-hw', 'Half-whole diminished', ['1', 'b2', '#2', '3', '#4', '5', '6', 'b7']);
def('diminished-wh', 'Whole-half diminished', ['1', '2', 'b3', '4', 'b5', 'b6', 'bb7', '7']);
def('augmented', 'Augmented (hexatonic)', ['1', 'b3', '3', '5', '#5', '7']);
def('chromatic', 'Chromatic', ['1', 'b2', '2', 'b3', '3', '4', '#4', '5', 'b6', '6', 'b7', '7']);
def('bebop-dominant', 'Bebop dominant', ['1', '2', '3', '4', '5', '6', 'b7', '7']);
def('bebop-major', 'Bebop major', ['1', '2', '3', '4', '5', '#5', '6', '7']);
def('bebop-dorian', 'Bebop Dorian', ['1', '2', 'b3', '3', '4', '5', '6', 'b7']);
def('bebop-melodic-minor', 'Bebop melodic minor', ['1', '2', 'b3', '4', '5', '#5', '6', '7']);

// functional labels for display (spelling by letter stays correct; labels read like a jazz player thinks)
SCALES.altered.labels = ['1', 'b9', '#9', '3', '#11', 'b13', 'b7'];
SCALES['super-locrian'].labels = SCALES.altered.labels;
SCALES['altered-dim'].labels = ['1', 'b9', '#9', '3', '#11', 'b13', '6'];
SCALES['phrygian-dominant'].labels = ['1', 'b9', '3', '4', '5', 'b13', 'b7'];
SCALES['spanish-phrygian'].labels = SCALES['phrygian-dominant'].labels;

export function getScale(id) {
  const s = SCALES[id];
  if (!s) throw new Error(`Unknown scale "${id}"`);
  return s;
}
export function scaleNotes(root, scaleId) {
  const r = typeof root === 'string' ? parseNote(root) : root;
  return getScale(scaleId).ivs.map((iv) => transpose(r, iv));
}
// root of the parent scale for a mode, e.g. G altered -> Ab melodic minor
export function parentOf(root, scaleId) {
  const s = getScale(scaleId);
  if (!s.family) return null;
  const parentIvs = FAMILIES.find((f) => f[0] === s.family)[1];
  const r = typeof root === 'string' ? parseNote(root) : root;
  // the mode's root is degree (modeIndex+1) of the parent: parent root = r - parentIvs[modeIndex]
  const up = parentIvs[s.modeIndex];
  const inv = invertInterval(up);
  const p = transpose(r, inv);
  return { root: p, scaleId: s.parentId, degree: s.modeIndex + 1 };
}
function invertInterval(iv) {
  // interval that goes from upper note back up to the octave of the lower one
  const [deg, semis] = INTERVALS[iv];
  const d = ((9 - deg) % 7) || 7;
  const s = (12 - semis) % 12;
  const cands = Object.keys(INTERVALS).filter((k) => INTERVALS[k][0] === (deg === 1 ? 1 : d) && INTERVALS[k][1] === s);
  return cands[0] || '1';
}

// ---------- chords ----------
export const CHORDS = {};
const ch = (id, sym, ivs, name) => { CHORDS[id] = { id, sym, ivs, name: name || id }; };
ch('maj', '', ['1', '3', '5'], 'major triad');
ch('min', 'm', ['1', 'b3', '5'], 'minor triad');
ch('dim', '°', ['1', 'b3', 'b5'], 'diminished triad');
ch('aug', '+', ['1', '3', '#5'], 'augmented triad');
ch('sus2', 'sus2', ['1', '2', '5']);
ch('sus4', 'sus4', ['1', '4', '5']);
ch('5', '5', ['1', '5'], 'power chord');
ch('maj7', 'maj7', ['1', '3', '5', '7'], 'major 7');
ch('7', '7', ['1', '3', '5', 'b7'], 'dominant 7');
ch('m7', 'm7', ['1', 'b3', '5', 'b7'], 'minor 7');
ch('m7b5', 'm7♭5', ['1', 'b3', 'b5', 'b7'], 'half-diminished');
ch('dim7', '°7', ['1', 'b3', 'b5', 'bb7'], 'diminished 7');
ch('mMaj7', 'm(maj7)', ['1', 'b3', '5', '7'], 'minor-major 7');
ch('maj7#5', 'maj7♯5', ['1', '3', '#5', '7']);
ch('7#5', '7♯5', ['1', '3', '#5', 'b7']);
ch('7b5', '7♭5', ['1', '3', 'b5', 'b7']);
ch('7sus4', '7sus4', ['1', '4', '5', 'b7']);
ch('6', '6', ['1', '3', '5', '6'], 'major 6');
ch('m6', 'm6', ['1', 'b3', '5', '6'], 'minor 6');
ch('add9', 'add9', ['1', '3', '5', '9']);
ch('madd9', 'm(add9)', ['1', 'b3', '5', '9']);
ch('6/9', '6/9', ['1', '3', '5', '6', '9']);
ch('m6/9', 'm6/9', ['1', 'b3', '5', '6', '9']);
ch('maj9', 'maj9', ['1', '3', '5', '7', '9']);
ch('9', '9', ['1', '3', '5', 'b7', '9']);
ch('m9', 'm9', ['1', 'b3', '5', 'b7', '9']);
ch('mMaj9', 'm(maj9)', ['1', 'b3', '5', '7', '9']);
ch('11', '11', ['1', '5', 'b7', '9', '11']);
ch('m11', 'm11', ['1', 'b3', '5', 'b7', '9', '11']);
ch('maj7#11', 'maj7♯11', ['1', '3', '5', '7', '#11']);
ch('maj9#11', 'maj9♯11', ['1', '3', '5', '7', '9', '#11']);
ch('13', '13', ['1', '3', '5', 'b7', '9', '13']);
ch('m13', 'm13', ['1', 'b3', '5', 'b7', '9', '13']);
ch('maj13', 'maj13', ['1', '3', '5', '7', '9', '13']);
ch('9sus4', '9sus4', ['1', '4', '5', 'b7', '9']);
ch('13sus4', '13sus4', ['1', '4', '5', 'b7', '9', '13']);
ch('7b9', '7♭9', ['1', '3', '5', 'b7', 'b9']);
ch('7#9', '7♯9', ['1', '3', '5', 'b7', '#9']);
ch('7#11', '7♯11', ['1', '3', '5', 'b7', '9', '#11']);
ch('7b13', '7♭13', ['1', '3', '5', 'b7', 'b13']);
ch('7b9b13', '7♭9♭13', ['1', '3', '5', 'b7', 'b9', 'b13']);
ch('7#9b13', '7♯9♭13', ['1', '3', '5', 'b7', '#9', 'b13']);
ch('7#9#5', '7♯9♯5', ['1', '3', '#5', 'b7', '#9']);
ch('13b9', '13♭9', ['1', '3', 'b7', 'b9', '13']);
ch('13#11', '13♯11', ['1', '3', 'b7', '9', '#11', '13']);
ch('7alt', '7alt', ['1', '3', 'b7', 'b9', '#9', '#11', 'b13'], 'altered dominant');
ch('dim-maj7', '°(maj7)', ['1', 'b3', 'b5', '7']);
ch('m7#5', 'm7♯5', ['1', 'b3', '#5', 'b7']);
ch('7sus2', '7sus2', ['1', '2', '5', 'b7']);
ch('quartal', ' quartal', ['1', '4', 'b7']);
// aliases authors may use
const ALIAS = { major: 'maj', minor: 'min', m: 'min', '': 'maj', M7: 'maj7', dom7: '7', 'ø7': 'm7b5', 'ø': 'm7b5', o7: 'dim7', '°7': 'dim7', mmaj7: 'mMaj7', 'm(maj7)': 'mMaj7', 'maj7#11': 'maj7#11', '+': 'aug', '°': 'dim', 'dim7b5': 'dim7', '69': '6/9', 'maj6': '6', 'aug7': '7#5', '+7': '7#5', 'halfdim': 'm7b5', 'alt': '7alt', 'm7(b5)': 'm7b5', 'maj': 'maj' };
export function getChord(id) {
  const c = CHORDS[id] || CHORDS[ALIAS[id]];
  if (!c) throw new Error(`Unknown chord quality "${id}"`);
  return c;
}
export function chordSymbol(root, qid) {
  const r = typeof root === 'string' ? parseNote(root) : root;
  return noteName(r, true) + getChord(qid).sym;
}
export function chordNotes(root, qid) {
  const r = typeof root === 'string' ? parseNote(root) : root;
  return getChord(qid).ivs.map((iv) => transpose(r, iv));
}

// recognise a chord from interval names relative to its root (used for chord scales)
const RECOG = [
  ['maj', '1 3 5'], ['min', '1 b3 5'], ['dim', '1 b3 b5'], ['aug', '1 3 #5'],
  ['maj7', '1 3 5 7'], ['7', '1 3 5 b7'], ['m7', '1 b3 5 b7'], ['m7b5', '1 b3 b5 b7'],
  ['dim7', '1 b3 b5 bb7'], ['mMaj7', '1 b3 5 7'], ['maj7#5', '1 3 #5 7'], ['7#5', '1 3 #5 b7'],
  ['7b5', '1 3 b5 b7'], ['dim-maj7', '1 b3 b5 7'], ['m7#5', '1 b3 #5 b7'], ['sus4', '1 4 5'], ['sus2', '1 2 5'],
  ['7sus4', '1 4 5 b7'], ['6', '1 3 5 6'], ['m6', '1 b3 5 6'],
];
export function recogniseChord(ivs) {
  const key = ivs.map((x) => intervalSemis(x) % 12).sort((a, b) => a - b).join(',');
  for (const [id, f] of RECOG) {
    if (f.split(' ').map((x) => intervalSemis(x)).sort((a, b) => a - b).join(',') === key) return id;
  }
  return null;
}

// diatonic chord on degree i (0-based) of a 7-note scale: stack thirds
export function diatonicChord(root, scaleId, i, size = 4) {
  const notes = scaleNotes(root, scaleId);
  const n = notes.length;
  const tones = [];
  for (let k = 0; k < size; k++) tones.push(notes[(i + 2 * k) % n]);
  const r = tones[0];
  const ivs = tones.map((t) => intervalBetween(r, t));
  const q = recogniseChord(ivs);
  return { root: r, quality: q, tones, ivs };
}
export function diatonicQuartal(root, scaleId, i, size = 3) {
  const notes = scaleNotes(root, scaleId);
  const tones = [];
  for (let k = 0; k < size; k++) tones.push(notes[(i + 3 * k) % notes.length]);
  return { root: tones[0], quality: null, tones, ivs: tones.map((t) => intervalBetween(tones[0], t)) };
}
// interval name from note a up to note b (within an octave, by letter distance)
export function intervalBetween(a, b) {
  const deg = ((b.letter - a.letter + 7) % 7) + 1;
  const s = (notePc(b) - notePc(a) + 12) % 12;
  const c = Object.keys(INTERVALS).filter((k) => INTERVALS[k][0] === deg && INTERVALS[k][1] === s);
  if (c.length) return c[0];
  return ['1', 'b2', '2', 'b3', '3', '4', '#4', '5', 'b6', '6', 'b7', '7'][s];
}

// ---------- keys ----------
// difficulty 1 (easiest) .. 5 (hardest) for guitar
const MAJOR_KEY_DIFF = { C: 1, G: 1, D: 2, A: 2, E: 2, F: 2, Bb: 3, B: 4, Eb: 3, Ab: 4, Db: 4, 'F#': 5, Gb: 5 };
const MINOR_KEY_DIFF = { A: 1, E: 1, D: 2, B: 2, G: 2, 'F#': 3, C: 3, F: 3, 'C#': 4, Bb: 4, 'G#': 5, Eb: 5 };
export const MAJOR_KEYS = Object.keys(MAJOR_KEY_DIFF);
export const MINOR_KEYS = Object.keys(MINOR_KEY_DIFF).map((k) => k + 'm');
export const ROOTS = ['C', 'G', 'D', 'A', 'E', 'F', 'Bb', 'Eb', 'B', 'Ab', 'Db', 'F#'];
export function parseKey(k) {
  const s = String(k).trim();
  const minor = /m(in(or)?)?$/.test(s) && !/maj/.test(s);
  const tonic = s.replace(/\s*(major|maj|minor|min|m)$/i, '');
  const t = parseNote(tonic);
  const tn = noteName(t);
  const diff = minor ? (MINOR_KEY_DIFF[tn] ?? 4) : (MAJOR_KEY_DIFF[tn] ?? 4);
  return { tonic: t, minor, name: `${noteName(t, true)} ${minor ? 'minor' : 'major'}`, short: noteName(t) + (minor ? 'm' : ''), diff };
}
export const rootDiff = (r) => MAJOR_KEY_DIFF[noteName(typeof r === 'string' ? parseNote(r) : r)] ?? 3;

// ---------- roman numerals ----------
const ROMAN = { i: 1, ii: 2, iii: 3, iv: 4, v: 5, vi: 6, vii: 7 };
// parse "bVII:7", "V/ii:7", "I:maj/3", "ii/V:m7"
export function parseChordToken(tok, keyTonic) {
  const t = tok.trim();
  let [head, quality] = t.split(':');
  let bass = null;
  if (quality && quality.includes('/') && !CHORDS[quality] && !/^m?6\/9$/.test(quality.split('/').slice(0, 2).join('/')) ) {
    const idx = quality.lastIndexOf('/');
    bass = quality.slice(idx + 1);
    quality = quality.slice(0, idx);
  }
  if (quality && /^(m?6\/9)\/(.+)$/.test(quality)) { const mm = /^(m?6\/9)\/(.+)$/.exec(quality); quality = mm[1]; bass = mm[2]; }
  quality = quality || null;
  // absolute chord like C:maj7
  if (/^[A-G](b|#)?$/.test(head)) {
    const root = parseNote(head);
    const q = quality || 'maj';
    getChord(q);
    return { root, quality: q, bass: bass ? transpose(root, bass) : null, bassIv: bass, token: t, roman: null };
  }
  if (!keyTonic) throw new Error(`Roman token "${tok}" needs a key`);
  const parts = head.split('/');
  let root = keyTonic;
  for (let p = parts.length - 1; p >= 0; p--) {
    const m = /^(bb|b|#|♭|♯)?([ivIV]+)$/.exec(parts[p]);
    if (!m) throw new Error(`Bad roman "${parts[p]}" in "${tok}"`);
    const deg = ROMAN[m[2].toLowerCase()];
    if (!deg) throw new Error(`Bad roman "${parts[p]}"`);
    const base = MAJOR[deg - 1];
    let iv = base;
    const acc = m[1];
    if (acc === 'b' || acc === '♭') iv = base === '1' ? 'b2' : flatten(base);
    if (acc === 'bb') iv = flatten(flatten(base));
    if (acc === '#' || acc === '♯') iv = sharpen(base);
    root = transpose(root, iv);
  }
  const q = quality || defaultQuality(parts[0]);
  getChord(q);
  if (Math.abs(root.acc) > 1 || ['Cb', 'Fb', 'E#', 'B#'].includes(noteName(root))) root = enharmonic(root);
  return { root, quality: q, bass: bass ? transpose(root, bass) : null, bassIv: bass, token: t, roman: head };
}
const flatten = (iv) => ({ '2': 'b2', '3': 'b3', '4': 'b4', '5': 'b5', '6': 'b6', '7': 'b7', 'b7': 'bb7', 'b3': 'bb3' }[iv] || iv);
const sharpen = (iv) => ({ '1': '#1', '2': '#2', '4': '#4', '5': '#5', '6': '#6' }[iv] || iv);
INTERVALS['#1'] = [1, 1];
function defaultQuality(romanHead) {
  const m = /([ivIV]+)/.exec(romanHead);
  return m && m[1] === m[1].toLowerCase() ? 'min' : 'maj';
}
export function parseChart(chart, keyTonic) {
  const bars = [];
  const raw = String(chart).split('|').map((b) => b.trim()).filter(Boolean);
  for (const b of raw) {
    if (b === '%') { if (bars.length) bars.push(bars[bars.length - 1].map((c) => ({ ...c }))); continue; }
    bars.push(b.split(/\s+/).filter(Boolean).map((tok) => (tok === '%' ? null : parseChordToken(tok, keyTonic))).filter(Boolean));
  }
  return bars;
}
