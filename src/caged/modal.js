// Mode mode: a mode on the key's tonic, its own chords as vamps (or any of them), and for each chord the targets to
// land on, its 3rd and 7th, plus the mode's characteristic note. Chords are stacked in thirds from the mode itself,
// so every one is diatonic to it.
import * as T from '../theory.js';
import { ivFrom } from './harmony.js';

// char: the note that makes the mode itself (as an interval above its tonic). vamps: chord degrees, 0 = tonic.
export const MODES = [
  { id: 'ionian', name: 'Ionian (major)', char: '4', feel: 'plain major; the 4 is the note that wants to fall to 3', vamps: [[0, 3, 4, 0], [0, 5, 3, 4], [0, 3], [1, 4, 0, 0]] },
  { id: 'dorian', name: 'Dorian', char: '6', feel: 'minor with a bright natural 6', vamps: [[0, 3], [0, 3, 0, 6], [0, 1], [0, 6, 3, 0]] },
  { id: 'phrygian', name: 'Phrygian', char: 'b2', feel: 'dark and Spanish, the ♭2 a half step over the root', vamps: [[0, 1], [0, 1, 0, 6], [0, 6, 5, 1], [0, 3, 1, 0]] },
  { id: 'lydian', name: 'Lydian', char: '#4', feel: 'major, floating on the ♯4', vamps: [[0, 1], [0, 1, 0, 6], [0, 4, 1, 0], [0, 1, 4, 0]] },
  { id: 'mixolydian', name: 'Mixolydian', char: 'b7', feel: 'major with a bluesy ♭7', vamps: [[0, 6, 3, 0], [0, 6], [0, 3], [0, 4, 6, 0]] },
  { id: 'aeolian', name: 'Aeolian (natural minor)', char: 'b6', feel: 'plain minor, the ♭6 aching down to 5', vamps: [[0, 5, 6, 0], [0, 6, 5, 6], [0, 3, 4, 0], [0, 2, 6, 3]] },
  { id: 'locrian', name: 'Locrian', char: 'b5', feel: 'the darkest: no perfect 5th to rest on', vamps: [[0, 1], [0, 1, 0, 6], [0, 4, 1, 0]] },
  { id: 'melodic-minor', name: 'melodic minor', char: '7', feel: 'minor with a major 7: bittersweet and modern', vamps: [[0, 3], [0, 1, 0, 3], [0, 4, 0, 3]] },
  { id: 'lydian-dominant', name: 'Lydian dominant', char: '#4', feel: 'a dominant with a ♯11 shimmer', vamps: [[0, 1], [0, 6, 0, 1], [0, 4]] },
  { id: 'phrygian-dominant', name: 'Phrygian dominant', char: 'b2', feel: 'flamenco: a major 3rd over ♭2 and ♭6', vamps: [[0, 1], [0, 1, 6, 1], [0, 6, 5, 1], [0, 3, 1, 0]] },
  { id: 'harmonic-minor', name: 'harmonic minor', char: '7', feel: 'minor with a leading tone: drama and the augmented 2nd', vamps: [[0, 3, 4, 0], [0, 4], [0, 5, 4, 0], [0, 3, 6, 0]] },
];
export const modeById = (id) => MODES.find((m) => m.id === id) || MODES[1];

// the mode's chords: { iv (above the tonic), q } for each degree, as triads or sevenths
export function modeChords(tonic, modeId, size) {
  const out = [];
  for (let i = 0; i < 7; i++) {
    const c = T.diatonicChord(tonic, modeId, i, size);
    if (!c.quality) continue;
    out.push({ deg: i, iv: ivFrom(tonic, c.root), q: c.quality });
  }
  return out;
}
// the mode's notes as pitch classes above a chord root (to draw it across the position)
export function modePcsFrom(tonic, modeId, chordRoot) {
  return T.scaleNotes(tonic, modeId).map((n) => ((T.notePc(n) - T.notePc(chordRoot)) % 12 + 12) % 12);
}
// what to aim for over a chord: its 3rd and 7th (a triad: its 3rd and root), named
export function targetsFor(q) {
  const ivs = T.getChord(q).ivs;
  const third = ivs.find((x) => ['3', 'b3', '4', '2'].includes(x)) || ivs[1];
  const seventh = ivs.find((x) => ['7', 'b7', 'bb7', '6'].includes(x)) || '1';
  return [third, seventh];
}
