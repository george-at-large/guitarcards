// Free scales, moving: what to step through (ladders of modes one note apart, shuffles, sets of arpeggio types), the
// arpeggio inside a mode (to the 7th, or stacked on to 13), and interval patterns (degree numbers like 1 2 3 5 or
// 3 5 7 9) spelled out in whichever mode is playing. Pure: no screen, no sound.
import * as T from '../theory.js';
import * as F from '../fretboard.js';
import * as SC from './scales.js';

const BY = Object.fromEntries(SC.SCALES.map((s) => [s.id, s]));
export const semisOf = (iv) => T.intervalSemis(F.simpleIv(String(iv))) % 12;
// an interval's degree number inside one octave: 9 → 2, 11 → 4, 13 → 6
export const numberOf = (iv) => { const n = Number(String(iv).replace(/\D/g, '')); return n > 7 ? n - 7 : n; };
// as a tension: 2 → 9, 4 → 11, 6 → 13 (accidentals kept)
export const asExt = (iv) => String(iv).replace(/^(bb|b|#)?([246])$/, (m, a, n) => (a || '') + { 2: '9', 4: '11', 6: '13' }[n]);
// back inside the octave: 9 → 2, 11 → 4, 13 → 6
export const asSimple = (iv) => String(iv).replace(/^(bb|b|#)?(9|11|13)$/, (m, a, n) => (a || '') + { 9: '2', 11: '4', 13: '6' }[n]);

// ---------- what to step through ----------
// ladders: each step moves one note by a half step (the dominant ladder's last rung moves two)
export const LADDERS = [
  { id: 'bright', group: 'Ladders', name: 'Brightness: the seven modes', ids: ['lydian', 'ionian', 'mixolydian', 'dorian', 'aeolian', 'phrygian', 'locrian'], blurb: 'Lydian down to Locrian, one note lower at each step, then back up.' },
  { id: 'bright-x', group: 'Ladders', name: 'Brightness, extended', ids: ['lyd-aug', 'lydian', 'ionian', 'mixolydian', 'dorian', 'aeolian', 'phrygian', 'locrian', 'altered', 'superloc-bb7'], blurb: 'The seven modes with a rung above (Lydian augmented) and two below (altered, super-Locrian 𝄫7): melodic and harmonic minor modes stretch the ladder.' },
  { id: 'dom', group: 'Ladders', name: 'Dominant: inside to outside', ids: ['lyd-dom', 'mixolydian', 'mixo-b6', 'phryg-dom', 'altered'], blurb: 'Over a dominant 7th: the root, 3rd and ♭7 stay put while the tensions darken, from Lydian dominant to altered (the last step moves two notes).' },
  { id: 'minor', group: 'Ladders', name: 'Minor: brightest to darkest', ids: ['mel-min', 'dorian', 'aeolian', 'phrygian', 'locrian'], blurb: 'Every minor mode from melodic minor down to Locrian, one note at a time.' },
  { id: 'mdia-a', group: 'Ladders', name: 'Minor diamond, via Aeolian', ids: ['dorian-s4', 'dorian', 'aeolian', 'phrygian'], blurb: 'Dorian ♯4 down to Phrygian: the 6th drops before the 2nd.' },
  { id: 'mdia-b', group: 'Ladders', name: 'Minor diamond, via Dorian ♭2', ids: ['dorian', 'dorian-b2', 'phrygian'], blurb: 'Dorian to Phrygian the other way: the 2nd drops before the 6th.' },
  { id: 'hd', group: 'Ladders', name: 'Half-diminished square', ids: ['aeolian', 'locrian-n2', 'locrian', 'phrygian'], loop: true, blurb: 'Round the square: Aeolian, Locrian ♮2, Locrian, Phrygian, back to Aeolian. The 2nd and 5th take turns to drop and rise.' },
  { id: 'cube', group: 'Major to minor', name: 'The cube: all eight scales', ids: ['ionian', 'mixolydian', 'mixo-b6', 'harm-maj', 'harm-min', 'mel-min', 'dorian', 'aeolian'], blurb: 'Every mix of 3 or ♭3, 6 or ♭6, 7 or ♭7 over the same root, visited one note at a time.' },
  { id: 'r-dia', group: 'Major to minor', name: 'Diatonic route (7, 3, 6)', ids: ['ionian', 'mixolydian', 'dorian', 'aeolian'], blurb: 'Major to minor through the church modes: the 7th drops, then the 3rd, then the 6th.' },
  { id: 'r-mel', group: 'Major to minor', name: 'Classical route (3, 6, 7)', ids: ['ionian', 'mel-min', 'harm-min', 'aeolian'], blurb: 'Major to minor through melodic and harmonic minor: the 3rd drops, then the 6th, then the 7th.' },
  { id: 'r-harm', group: 'Major to minor', name: 'Harmonic route (6, 3, 7)', ids: ['ionian', 'harm-maj', 'harm-min', 'aeolian'], blurb: 'The 6th drops first (harmonic major), then the 3rd (harmonic minor), then the 7th.' },
  { id: 'r-dark', group: 'Major to minor', name: 'Dark-major route (6, 7, 3)', ids: ['ionian', 'harm-maj', 'mixo-b6', 'aeolian'], blurb: 'The major 3rd holds on longest: harmonic major, then Mixolydian ♭6, the film-score sound.' },
  { id: 'r-mix', group: 'Major to minor', name: 'Mixolydian route (7, 6, 3)', ids: ['ionian', 'mixolydian', 'mixo-b6', 'aeolian'], blurb: 'The 7th drops, then the 6th, and the 3rd last.' },
  { id: 'r-mm', group: 'Major to minor', name: 'Melodic route (3, 7, 6)', ids: ['ionian', 'mel-min', 'dorian', 'aeolian'], blurb: 'The 3rd drops (melodic minor), then the 7th (Dorian), then the 6th.' },
  { id: 'sh-modes', group: 'Shuffles', name: 'The seven modes, shuffled', ids: ['ionian', 'dorian', 'phrygian', 'lydian', 'mixolydian', 'aeolian', 'locrian'], shuffle: true, blurb: 'The seven modes in a random order, each pass a new order.' },
  { id: 'sh-mm', group: 'Shuffles', name: 'Melodic minor modes, shuffled', ids: ['mel-min', 'dorian-b2', 'lyd-aug', 'lyd-dom', 'mixo-b6', 'locrian-n2', 'altered'], shuffle: true, blurb: 'The seven modes of melodic minor, shuffled.' },
  { id: 'sh-hm', group: 'Shuffles', name: 'Harmonic minor modes, shuffled', ids: ['harm-min', 'locrian-n6', 'ionian-s5', 'dorian-s4', 'phryg-dom', 'lydian-s2', 'superloc-bb7'], shuffle: true, blurb: 'The seven modes of harmonic minor, shuffled.' },
  { id: 'sh-all', group: 'Shuffles', name: 'Everything, exotic too, shuffled', ids: SC.SCALES.map((s) => s.id), shuffle: true, blurb: 'Every scale the app knows, exotic ones too, shuffled.' },
  { id: 'sh-use', group: 'Shuffles', name: 'Everything useful, shuffled', ids: ['ionian', 'aeolian', 'min-pent', 'maj-pent', 'blues', 'dorian', 'mixolydian', 'lydian', 'phrygian', 'harm-min', 'mel-min', 'altered', 'lyd-dom', 'locrian-n2', 'mixo-b6', 'phryg-dom'], shuffle: true, blurb: 'The essentials, everyday, colour and jazz scales, shuffled.' },
];
// arpeggio types to step through: plain ones and extended ones
export const ARPSETS = [
  { id: 'a-tri', ext: false, name: 'Triads', qs: ['', 'm', 'dim', 'aug', 'sus2', 'sus4'], blurb: 'The six triads on the same root.' },
  { id: 'a-6', ext: false, name: 'Sixes', qs: ['6', 'm6', '69'], blurb: 'The 6 chords: the 6th in place of the 7th.' },
  { id: 'a-7', ext: false, name: 'Sevenths', qs: ['maj7', '7', 'm7', 'm7b5', 'dim7', 'mMaj7'], blurb: 'The six main seventh chords on the same root.' },
  { id: 'a-all', ext: false, name: 'All of these, shuffled', qs: ['', 'm', 'dim', 'aug', 'sus4', '6', 'm6', 'maj7', '7', 'm7', 'm7b5', 'dim7', 'mMaj7', 'maj7#5', '7sus4'], shuffle: true, blurb: 'Triads, sixes and sevenths, shuffled.' },
  { id: 'e-9', ext: true, name: 'Ninths', qs: ['maj9', '9', 'm9', 'add9', 'madd9', '69'], blurb: 'The ninth chords: the 9th on top of the 7th (or the triad).' },
  { id: 'e-dom', ext: true, name: 'Dominant tensions', qs: ['9', '13', '7b9', '7#9', '7#11', '7b13', '7alt'], blurb: 'One dominant 7th, a different tension each time.' },
  { id: 'e-13', ext: true, name: 'Elevenths and thirteenths', qs: ['m11', 'maj7#11', '11', '9sus4', '13', 'm13', 'maj13'], blurb: 'The tall chords: 11ths and 13ths.' },
  { id: 'e-all', ext: true, name: 'All of these, shuffled', qs: ['maj9', '9', 'm9', 'add9', '69', '13', '7b9', '7#9', '7#11', '7b13', '7alt', 'm11', 'maj7#11', '9sus4', 'm13', 'maj13'], shuffle: true, blurb: 'Every extended arpeggio here, shuffled.' },
];
export const seqDef = (id) => LADDERS.find((l) => l.id === id) || ARPSETS.find((a) => a.id === id) || null;
// the items of a sequence: modes ({mode}) or arpeggio types ({q})
export const itemsOf = (def) => (def.qs ? def.qs.map((q) => ({ q })) : def.ids.filter((id) => BY[id]).map((mode) => ({ mode })));
// the order to visit them in: a loop goes round; anything else goes there and back (without repeating the ends)
export function walkOf(def, n) {
  const fwd = Array.from({ length: n }, (_, i) => i);
  if (def.loop || def.shuffle || n < 3) return fwd;
  return fwd.concat(fwd.slice(1, -1).reverse());
}
export function shuffled(a, avoidFirst = null) {
  const b = a.slice();
  for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; }
  if (avoidFirst != null && b.length > 1 && b[0] === avoidFirst) [b[0], b[1]] = [b[1], b[0]];
  return b;
}
export const qName = (q) => ({ '': 'major', m: 'minor', dim: 'diminished', aug: 'augmented' }[q] ?? q.replace(/b(?=\d)/g, '♭').replace(/#/g, '♯').replace('mMaj7', 'm(maj7)').replace(/^69$/, '6/9').replace(/^add9$/, 'add 9').replace(/^madd9$/, 'm(add 9)'));

// what moved between two modes on the same root: the notes that left and the notes that came, each in its own spelling
export function moved(fromId, toId) {
  if (!BY[fromId] || !BY[toId]) return null;
  const a = BY[fromId].ivs.map((iv) => [semisOf(iv), iv]), b = BY[toId].ivs.map((iv) => [semisOf(iv), iv]);
  const A = new Set(a.map((x) => x[0])), B = new Set(b.map((x) => x[0]));
  const out = a.filter((x) => !B.has(x[0])), inn = b.filter((x) => !A.has(x[0]));
  if (!out.length && !inn.length) return null;
  // pair each leaver with the arrival nearest to it (the pairing that moves least), in each scale's own spelling
  const d = (x, y) => { const k = Math.abs(x - y) % 12; return Math.min(k, 12 - k); };
  const perms = (a) => (a.length <= 1 ? [a] : a.flatMap((x, i) => perms(a.slice(0, i).concat(a.slice(i + 1))).map((r) => [x, ...r])));
  let best = null, bs = Infinity;
  for (const p of perms(inn.map((_, i) => i))) {
    let c = 0;
    out.forEach((o, i) => { c += p[i] === undefined ? 6 : d(o[0], inn[p[i]][0]); });
    if (c < bs) { bs = c; best = p; }
  }
  const pairs = out.map((o, i) => [o[1], best[i] === undefined ? null : inn[best[i]][1]]);
  for (let j = 0; j < inn.length; j++) if (!best.includes(j)) pairs.push([null, inn[j][1]]);
  return { pairs, added: inn.map((x) => x[0]) };
}

// ---------- arpeggios ----------
// the arpeggio inside a mode: 1 3 5 7 (or 6 when it has no 7th), and stacked on to 9, 11 and 13 when extended
export function modeArp(id, ext) {
  const ivs = BY[id].ivs, pick = (n) => ivs.find((iv) => numberOf(iv) === n);
  const out = [];
  for (const n of [1, 3, 5]) { const iv = pick(n); if (iv) out.push(asSimple(iv)); }
  const sev = pick(7) || pick(6);
  if (sev) out.push(asSimple(sev));
  if (ext) for (const iv of ivs) if ([2, 4, 6].includes(numberOf(iv)) && !out.includes(asSimple(iv))) out.push(asExt(asSimple(iv)));
  return out;
}

// ---------- interval patterns ----------
// degree numbers, played in whichever mode is up: the shape stays, the mode decides each note's flavour
export const CELLS = [
  { c: [1, 2, 3, 5], name: 'the Coltrane cell' },
  { c: [1, 3, 5, 7], name: 'the seventh arpeggio' },
  { c: [3, 5, 7, 9], name: 'the upper structure' },
  { c: [1, 3, 5, 9], name: 'triad and 9th' },
  { c: [5, 7, 9, 11], name: 'the triad on the 5th, plus 11' },
  { c: [7, 9, 11, 13], name: 'the tensions from the 7th' },
  { c: [9, 11, 13], name: 'the tension triad' },
  { c: [1, 4, 7], name: 'stacked 4ths' },
  { c: [1, 5, 9, 13], name: 'stacked 5ths' },
  { c: [3, 7, 9, 13], name: 'a rootless voicing' },
  { c: [1, 2, 3, 4, 5], name: 'the first five' },
  { c: [2, 4, 6], name: 'the triad on the 2nd' },
  { c: [1, 2, 5], name: 'the sus2 cell' },
  { c: [1, 4, 5], name: 'the sus4 cell' },
  { c: [1, 3, 6, 9], name: 'the 6/9 shape' },
  { c: [3, 4, 5, 7], name: 'the leading notes' },
  { c: [5, 6, 7, 9], name: 'up from the 5th' },
];
const POOL = [1, 2, 3, 4, 5, 6, 7, 9, 11, 13];
// a pattern: usually a named cell, sometimes a random set of 3 to 5 degrees
export function newPattern(prev = null) {
  for (let tries = 0; tries < 20; tries++) {
    let p;
    if (Math.random() < 0.7) p = CELLS[Math.floor(Math.random() * CELLS.length)];
    else {
      const k = 3 + Math.floor(Math.random() * 3), got = [], base = new Set();
      for (const n of shuffled(POOL)) { const b = n > 7 ? n - 7 : n; if (base.has(b)) continue; base.add(b); got.push(n); if (got.length === k) break; }
      p = { c: got.sort((a, b) => a - b), name: '' };
    }
    if (!prev || p.c.join() !== prev.join()) return { c: p.c.slice(), name: p.name };
  }
  return { c: [1, 2, 3, 5], name: 'the Coltrane cell' };
}
// one degree number in a mode: its spelling (a 9 stays a 9: ♭9, 9, ♯9) or null if the scale has no such degree
export function spellNum(id, n) {
  const base = n > 7 ? n - 7 : n;
  const iv = BY[id].ivs.find((x) => numberOf(x) === base);
  if (!iv) return null;
  return n > 7 ? asExt(asSimple(iv)) : asSimple(iv);
}

// ---------- congruent scales: the gapped scales (on any root) whose notes all sit inside a scale ----------
const IVC = ['1', 'b2', '2', 'b3', '3', '4', '#4', '5', 'b6', '6', 'b7', '7'];
const pcsOfC = (ivs, start = 0) => [...new Set(ivs.map((iv) => (T.intervalSemis(F.simpleIv(iv)) + start) % 12))];
const IVN = IVC;
// the gapped scales on any root whose notes all sit inside this one (plus the blues fits), as heard over the drone
export function congruent(id) {
  const base = pcsOfC(BY[id].ivs);
  const out = [], seen = new Set();
  const gapped = SC.SCALES.filter((s) => s.ivs.length <= 6 && s.id !== 'whole-tone' && s.id !== 'aug-hex');
  for (const g of gapped) for (let st = 0; st < 12; st++) {
    const p = pcsOfC(g.ivs, st);
    let why = null;
    if (p.every((x) => base.includes(x))) why = 'inside';
    else if (st === 0 && base.includes(4) && base.includes(10) && (g.id === 'min-pent' || g.id === 'blues')) why = 'blues';
    if (!why) continue;
    // the same notes under another name (C minor pentatonic = E♭ major pentatonic): keep the first, note the other
    const key = [...p].sort((x, y) => x - y).join();
    if (seen.has(key)) {
      const prev = out.find((o) => o.key === key);
      if (prev && st === 0 && prev.start !== 0) { prev.also = { id: prev.id, start: prev.start }; prev.id = g.id; prev.start = 0; } // name it from the drone's root
      else if (prev && !prev.also) prev.also = { id: g.id, start: st };
      continue;
    }
    seen.add(key);
    const as = p.map((x) => T.prettyIv(IVN[x])).sort((x, y) => IVN.indexOf(x.replace('♭', 'b').replace('♯', '#')) - IVN.indexOf(y.replace('♭', 'b').replace('♯', '#')));
    out.push({ id: g.id, start: st, why, as, key });
  }
  // the plainest first: pentatonics on the root, then on other roots, then the rest
  const rank = (c) => (c.start === 0 ? 0 : 1) + (c.id.includes('pent') ? 0 : 2) + (c.why === 'blues' ? 1 : 0);
  return out.sort((a, b) => rank(a) - rank(b));
}

