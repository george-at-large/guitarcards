// Cheat sheets, generated from the theory engine (so they're correct in any key).
import * as T from './theory.js';
import { SCALE_INFO, QUALITY_INFO } from './context.js';

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const nn = (n) => T.noteName(n, true);
const table = (head, rows) => `<table><tr>${head.map((h) => `<th>${h}</th>`).join('')}</tr>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</table>`;
const ORD = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th'];

export const CHEATS = {
  diatonic: {
    title: 'Diatonic chords (major & minor keys)', keyed: true,
    html: (k) => {
      const root = T.parseNote(k);
      const fam = [['major', 'Major'], ['aeolian', 'Natural minor'], ['harmonic-minor', 'Harmonic minor'], ['melodic-minor', 'Melodic minor']];
      const R = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
      const roman = (c, i) => {
        const iv = T.intervalBetween(root, c.root);
        const acc = iv.startsWith('b') ? '♭' : iv.startsWith('#') ? '♯' : '';
        let r = R[i]; if (c.ivs[1] === 'b3') r = r.toLowerCase();
        if (c.ivs[1] === 'b3' && c.ivs[2] === 'b5') r += c.ivs[3] === 'b7' ? 'ø' : '°';
        if (c.ivs[1] === '3' && c.ivs[2] === '#5') r += '+';
        return acc + r;
      };
      return fam.map(([id, name]) => `<h4>${nn(root)} ${name}</h4>` + table(['', ...R.map((_, i) => i + 1)], [
        ['Roman', ...[...Array(7).keys()].map((i) => `<b>${roman(T.diatonicChord(root, id, i, 4), i)}</b>`)],
        ['7th chord', ...[...Array(7).keys()].map((i) => { const c = T.diatonicChord(root, id, i, 4); return T.chordSymbol(c.root, c.quality || 'maj'); })],
        ['Triad', ...[...Array(7).keys()].map((i) => { const c = T.diatonicChord(root, id, i, 3); return T.chordSymbol(c.root, c.quality || 'maj'); })],
      ])).join('') + '<p class="small muted">Function: I/vi/iii = tonic (home) · ii/IV = predominant · V/vii° = dominant (pulls home). Minor keys usually borrow V7 from harmonic minor.</p>';
    },
  },
  modes: {
    title: 'Modes & scales: formula, origin, use', keyed: true,
    html: (k) => {
      const root = T.parseNote(k);
      const fams = [['Major modes', ['ionian', 'dorian', 'phrygian', 'lydian', 'mixolydian', 'aeolian', 'locrian']],
        ['Melodic minor modes', ['melodic-minor', 'dorian-b2', 'lydian-augmented', 'lydian-dominant', 'mixolydian-b6', 'locrian-nat2', 'altered']],
        ['Harmonic minor modes', ['harmonic-minor', 'locrian-nat6', 'ionian-sharp5', 'dorian-sharp4', 'phrygian-dominant', 'lydian-sharp2', 'altered-dim']],
        ['Other essentials', ['major-pentatonic', 'minor-pentatonic', 'blues', 'diminished-hw', 'diminished-wh', 'whole-tone', 'bebop-dominant']]];
      return fams.map(([name, ids]) => `<h4>${name}</h4>` + table(['Scale', 'Formula', `Notes on ${nn(root)}`, 'Comes from', 'Use over'], ids.map((id) => {
        const s = T.getScale(id);
        const p = T.parentOf(root, id);
        return [`<b>${esc(s.name)}</b>`, (s.labels || s.ivs).map(T.prettyIv).join(' '), T.scaleNotes(root, id).map(nn).join(' '),
          p && p.degree > 1 ? `${ORD[p.degree - 1]} mode of ${nn(p.root)} ${esc(T.getScale(p.scaleId).name.toLowerCase())}` : '—',
          esc((SCALE_INFO[id] && SCALE_INFO[id].use) || '')];
      }))).join('') + '<p class="small muted">Brightness order (one note changes each step): Lydian → Ionian → Mixolydian → Dorian → Aeolian → Phrygian → Locrian.</p>';
    },
  },
  chords: {
    title: 'Chord formulas', keyed: true,
    html: (k) => {
      const root = T.parseNote(k);
      const ids = ['maj', 'min', 'dim', 'aug', 'sus4', 'maj7', '7', 'm7', 'm7b5', 'dim7', 'mMaj7', '6', 'm6', 'maj9', '9', 'm9', '13', '7b9', '7#9', '7alt', 'maj7#11', '7#11', '7sus4'];
      return table(['Chord', 'Formula', `On ${nn(root)}`, 'Sound / job'], ids.map((q) => [
        `<b>${T.chordSymbol(root, q)}</b>`, T.getChord(q).ivs.map(T.prettyIv).join(' '), T.chordNotes(root, q).map(nn).join(' '),
        esc(QUALITY_INFO[q] ? QUALITY_INFO[q].use : '')]));
    },
  },
  intervals: {
    title: 'Intervals on the fretboard',
    html: () => table(['Interval', 'Semitones', 'Same string', 'Next string up (not G→B)', 'Sound'], [
      ['♭2 minor 2nd', 1, '+1 fret', '−4 frets', 'tense, crunchy'], ['2 major 2nd', 2, '+2', '−3', 'step'], ['♭3 minor 3rd', 3, '+3', '−2', 'minor, sad'],
      ['3 major 3rd', 4, '+4', '−1', 'major, bright'], ['4 perfect 4th', 5, '+5', 'same fret', 'open, suspended'], ['♯4/♭5 tritone', 6, '+6', '+1', 'unstable — the dominant’s engine'],
      ['5 perfect 5th', 7, '+7', '+2', 'strong, open'], ['♭6 minor 6th', 8, '+8', '+3', 'bittersweet'], ['6 major 6th', 9, '+9', '+4', 'sweet'],
      ['♭7 minor 7th', 10, '+10', '+5 (or 2 strings up, same fret)', 'bluesy, dominant'], ['7 major 7th', 11, '+11', '+6', 'lush, leading tone'], ['8 octave', 12, '+12', '2 strings up, +2 frets', 'same note'],
    ]) + '<p class="small muted">Crossing from the G string to the B string, add one fret to every "next string" shape (B is tuned a major 3rd above G).</p>',
  },
  cycle: {
    title: 'Cycle of fourths & key signatures',
    html: () => table(['Key', 'Relative minor', 'Signature', 'ii–V–I'], ['C', 'F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'B', 'E', 'A', 'D', 'G'].map((k, i) => {
      const r = T.parseNote(k);
      const sig = [0, 1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1][i];
      const flats = i <= 6;
      const ii = T.transpose(r, '2'), V = T.transpose(r, '5');
      return [`<b>${nn(r)}</b>`, nn(T.transpose(r, '6')) + 'm', sig ? `${sig} ${flats ? '♭' : '♯'}` : '—', `${T.chordSymbol(ii, 'm7')} ${T.chordSymbol(V, '7')} ${T.chordSymbol(r, 'maj7')}`];
    })) + '<p class="small muted">Each step up a 4th = down a 5th = the strongest root motion (V → I). On guitar: next string over, same fret (one fret higher crossing G → B).</p>',
  },
  voicings: {
    title: 'Voicing types: triads, drop 2, drop 3, shells',
    html: () => table(['Type', 'How it’s built', 'Usual strings', 'Inversion order up the neck'], [
      ['Close triad', 'R 3 5 stacked within an octave', '3-2-1, 4-3-2, 5-4-3, 6-5-4', 'root pos → 1st inv (3 in bass) → 2nd inv (5 in bass)'],
      ['Spread triad', 'close triad, 2nd voice from the top dropped an octave', '6-4-3, 5-3-2, 4-2-1', 'same order, wider'],
      ['Drop 2', 'close 7th chord, 2nd voice from the top dropped an octave', '4-3-2-1, 5-4-3-2, 6-5-4-3', 'R → 3 → 5 → 7 in the bass'],
      ['Drop 3', '3rd voice from the top dropped an octave', '6-4-3-2, 5-3-2-1', 'R → 3 → 5 → 7 in the bass'],
      ['Drop 2&4', '2nd and 4th voices dropped', '6-5-3-2, 5-4-2-1', 'wide, piano-like'],
      ['Shell', 'R + 3 + 7 (no 5th)', '6-4-3 (R 7 3), 5-4-3 (R 3 7)', 'alternate the two shapes through ii–V–I'],
      ['Rootless', '3 7 + tensions (9, 13…)', '5-4-3-2, 4-3-2-1', 'the bass player plays the root'],
    ]) + '<p class="small muted">Guide tones = the 3rd and 7th. In ii–V–I the 7th of each chord falls a half step to the 3rd of the next.</p>',
  },
  rhythm: {
    title: 'Rhythm: counting & feels',
    html: () => table(['Subdivision', 'Count it', 'Notes per beat'], [
      ['Quarters', '1 2 3 4', 1], ['8ths', '1 & 2 &', 2], ['Triplets', '1 trip let 2 trip let', 3], ['16ths', '1 e & a 2 e & a', 4],
      ['Quintuplets', '1 ta ka di mi', 5], ['Sextuplets', '1 la li & la li', 6],
    ]) + table(['Feel', 'What it means'], [
      ['Straight 8ths', 'each beat split 1 : 1'], ['Swing / shuffle', 'each beat split long–short 2 : 1 — play on “1” and “let” of 1-trip-let'],
      ['Backbeat', 'accent beats 2 and 4'], ['Soleá / alegrías (12)', 'accents on 3 6 8 10 12'], ['Bulerías (12)', 'counted from 12: accents 12 3 6 8 10'],
      ['Seguiriya', '2 2 3 3 2 (long–short pattern of 5 beats)'], ['Son clave 3-2', '3 hits in bar 1, 2 in bar 2'],
    ]),
  },
  toolbox: {
    title: 'What to play over what', needsLib: true,
    html: (k, lib) => table(['Chord', 'First choices'], (lib.toolbox || []).map((e) => [`<b>${esc(e.label || e.chord)}</b>`, (e.options || []).slice(0, 3).map((o) => `${esc(T.getScale(o.scale).name)}${o.from && o.from !== '1' ? ' from the ' + T.prettyIv(o.from) : ''}`).join(' · ')])),
  },
  tgsymbols: {
    title: 'Ted Greene diagram symbols',
    html: () => table(['Symbol', 'Meaning'], [
      ['●', 'chord tone — pluck it with the chord'], ['✕ (small x)', 'added after the chord, while the chord keeps ringing'],
      ['■ (small square)', 'played after the ✕ notes'], ['✕ over a ●', 'play it with the chord, then strike it again'], ['⊘ (slashed circle)', 'optional — try with and without'],
      ['○ above the grid', 'open string (above a higher-position grid: the fret just below the top row)'], ['Curved tie', 'hold the note into the next chord, don’t re-pluck'],
      ['Number left of the grid', 'fret of the top row'], ['T 1 2 3 above', 'right-hand finger: thumb then fingers, low to high'],
    ]),
  },
};
// which sheets help with which cards
export function cheatsFor(t) {
  const c = t.category, tags = t.tags || [];
  const out = new Set();
  if (['voicings'].includes(c)) ['voicings', 'chords', 'diatonic'].forEach((x) => out.add(x));
  if (['scales', 'pentatonic', 'improv'].includes(c)) ['modes', 'intervals'].forEach((x) => out.add(x));
  if (c === 'arpeggios') ['chords', 'intervals'].forEach((x) => out.add(x));
  if (['progressions', 'theory'].includes(c) || c === 'ear-progressions') ['diatonic', 'cycle'].forEach((x) => out.add(x));
  if (c === 'improv' || tags.includes('heuristics')) out.add('toolbox');
  if (['rhythm', 'picking', 'styles'].includes(c)) out.add('rhythm');
  if (c === 'fretboard' || c === 'ear-intervals') out.add('intervals');
  if (c === 'ear-chords') out.add('chords');
  if (c === 'tedgreene') ['tgsymbols', 'chords'].forEach((x) => out.add(x));
  if (tags.includes('cycle-of-fourths')) out.add('cycle');
  return [...out].slice(0, 3);
}
