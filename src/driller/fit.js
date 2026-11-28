// The chords each scale sounds good over, the way a teacher would put it: the chord, which of its notes the scale
// starts on (from: the interval of the scale's root above the chord's root), and when it works. Then grips for the
// chord, drawn as chord boxes with every note labelled by its interval.
import * as T from '../theory.js';
import * as F from '../fretboard.js';
import * as G from '../caged/grips.js';
import { esc } from '../fundamentals/core.js';

// [chord quality, from, context]
export const FIT = {
  ionian: [
    ['maj7', '1', 'The I chord of a major key. Treat the 4 as a passing note: held over a maj7 it clashes with the 3rd. On a IVmaj7, Lydian sounds better.'],
    ['6', '1', 'The tonic 6 chord of swing and older standards. Same scale, and the 4 still passes.'],
    ['maj9', '1', 'The same sound with the 9 in the chord: land on the 9, 3 or 7.'],
  ],
  dorian: [
    ['m7', '1', 'The ii chord of a ii–V (Am7 in G), and one-chord minor vamps (So What, Oye Como Va). On a minor i chord that a V7 resolves to, natural or melodic minor usually fits the tune better.'],
    ['m11', '1', 'The modal-jazz voicing of the same sound: Dorian holds every note of it.'],
    ['7sus4', '5', 'On a 7sus4, play Dorian from the chord’s 5th (D Dorian over G7sus4). A sus chord is “ii over V”, so the ii chord’s scale fits it exactly.'],
  ],
  phrygian: [
    ['min', '1', 'Spanish and metal vamps where a ♭II major chord alternates with the i (E – F – E): the ♭2 is the whole point.'],
    ['m7', '1', 'The iii chord of a major key (Bm7 in G), but only in passing: its ♭2 and ♭6 clash if you hold them over a plain m7.'],
    ['7sus4', '1', 'A sus♭9 chord (a 7sus4 with a ♭9 on top), as in modal jazz: the scale’s ♭2 is the chord’s ♭9.'],
  ],
  lydian: [
    ['maj7#11', '1', 'The chord written for it: a maj7 with a ♯11.'],
    ['maj7', '1', 'A IVmaj7 in a major key (Cmaj7 in G), or any maj7 you want bright and open. On the I chord at a cadence, Ionian is the plain choice and Lydian the modern one.'],
  ],
  mixolydian: [
    ['7', '1', 'A V7 resolving to a major chord, a static dominant vamp, the I7 of a rock or funk tune. Pass through the 4 rather than holding it over the 3rd. If the V7 resolves to a minor chord, use Phrygian dominant or the altered scale instead.'],
    ['9', '1', 'The same sound: the 9 and 13 are its natural colours.'],
    ['7sus4', '1', 'On a sus chord the 4 is a chord tone, not an avoid note: lean on it.'],
  ],
  aeolian: [
    ['m7', '1', 'The vi chord (Em7 in G) or the i chord of a minor key, in rock and pop. Over a ii chord in jazz its ♭6 clashes: use Dorian there.'],
    ['min', '1', 'Minor chords in minor-key songs, where the ♭6 belongs to the key.'],
  ],
  locrian: [
    ['m7b5', '1', 'The iiø of a minor ii–V (Bø in Bø–E7–Am). Its ♭2 is rough against the chord; Locrian ♮2 smooths it.'],
  ],
  'min-pent': [
    ['m7', '1', 'Any minor 7th: the inside, bluesy sound.'],
    ['m7', '5', 'From the chord’s 5th (D minor pentatonic over Gm7): it adds the 9 and 11, an m9/m11 sound.'],
    ['m7', '2', 'From the chord’s 2nd (A minor pentatonic over Gm7): it adds the 13, the Dorian sound.'],
    ['7', '1', 'In a blues: its ♭3 against the chord’s 3rd is the blues sound. Outside a blues it just clashes.'],
    ['maj7', '3', 'From the chord’s 3rd (E minor pentatonic over Cmaj7): 3 5 13 7 9, no root, a modern maj7 sound.'],
    ['7alt', 'b3', 'From the chord’s ♭3 (B♭ minor pentatonic over G7alt): ♯9 ♯11 ♭13 ♭7 ♭9. Only on a V7 that resolves.'],
  ],
  'maj-pent': [
    ['maj', '1', 'Major chords in pop, country and rock: no avoid notes.'],
    ['maj7', '5', 'From the chord’s 5th (G major pentatonic over Cmaj7): it adds the 7 and 9.'],
    ['maj7', '2', 'From the chord’s 2nd (D major pentatonic over Cmaj7): it brings in the ♯11, the Lydian sound.'],
    ['7', '1', 'Over a dominant in country, soul and blues: sweet and inside. Mix in the ♭3 for the blues.'],
  ],
  blues: [
    ['7', '1', 'The I7, IV7 and V7 of a blues alike: one scale for all three chords.'],
    ['m7', '1', 'Minor blues and minor rock vamps.'],
  ],
  'maj-blues': [
    ['7', '1', 'The I7 of a blues: slide the ♭3 into the 3. On the IV7, switch to the minor blues scale.'],
    ['6', '1', 'Swing and jump blues on a major 6 chord.'],
  ],
  'dom-pent': [
    ['7', '1', 'Dominant 7ths without the avoid 4: funk vamps and V7 chords.'],
    ['9', '1', 'It is a 9 chord’s notes without the 5th.'],
  ],
  'm6-pent': [
    ['m6', '1', 'Minor 6 chords: the arpeggio plus the 4.'],
    ['m7', '1', 'Over a m7 it gives the Dorian colour (the 6) without the 2.'],
  ],
  'mel-min': [
    ['mMaj7', '1', 'The minor tonic: m(maj7) or m6, often the last chord of a minor tune.'],
    ['7alt', 'b2', 'On a V7 that resolves, start it a half step above the chord’s root, on its ♭9 (A♭ melodic minor over G7alt). That’s the altered scale.'],
    ['7#11', '5', 'On a 7♯11, start it on the chord’s 5th (A melodic minor over D7♯11). That’s Lydian dominant.'],
    ['m7b5', 'b3', 'On a half-diminished chord, start it on the chord’s ♭3 (C melodic minor over Aø). That’s Locrian ♮2.'],
  ],
  'dorian-b2': [
    ['7sus4', '1', 'A sus♭9 chord (a 7sus4 with a ♭9 on top), as in modal jazz.'],
  ],
  'lyd-aug': [
    ['maj7#5', '1', 'The maj7♯5 chord, e.g. the ♭III+ of a minor key (E♭maj7♯5 in C minor).'],
  ],
  'lyd-dom': [
    ['7#11', '1', 'The chord written for it: 7♯11 or 9♯11.'],
    ['7', '1', 'Dominants that don’t resolve down a 5th: a ♭VII7 (F7 in G), the II7 of “Take the A Train”, the IV7 of a blues, tritone subs (A♭7 going to G). On a V7 that resolves to its I, Mixolydian or the altered scale fit better.'],
  ],
  'mixo-b6': [
    ['7b13', '1', 'A V7 going to a minor chord where you want the 9 natural (D7♭13 to Gm).'],
  ],
  'locrian-n2': [
    ['m7b5', '1', 'The iiø of a minor ii–V, and the ♯ivø of a major key (C♯ø in G). Smoother than Locrian because of the natural 9.'],
  ],
  altered: [
    ['7alt', '1', 'A V7 that resolves down a 5th or a half step, above all into minor (G7alt to Cm). Not on a static dominant vamp: with nowhere to go, it just sounds wrong.'],
    ['7#9', '1', 'The 7♯9: altered gives its ♯9 plus the ♭9, ♯11 and ♭13.'],
  ],
  'harm-min': [
    ['mMaj7', '1', 'The minor tonic, above all with the leading tone in the melody (Am(maj7)).'],
    ['7b9', '4', 'On the V7♭9 of a minor key, play the harmonic minor of the chord it resolves to, from the chord’s 4th (A harmonic minor over E7♭9 going to Am). That’s Phrygian dominant.'],
  ],
  'phryg-dom': [
    ['7b9', '1', 'A V7 resolving to a minor chord (E7♭9 to Am); also flamenco and klezmer vamps.'],
    ['7b9b13', '1', 'The same: both the ♭9 and ♭13 are in the scale.'],
  ],
  'harm-maj': [
    ['maj7', '1', 'A maj7 tonic where the minor iv chord (Fm in C) is in the air: its ♭6 is that chord’s ♭3.'],
    ['m6', '5', 'On the minor iv chord of a major key, play harmonic major from the chord’s 5th (C harmonic major over Fm6).'],
  ],
  'dim-hw': [
    ['13b9', '1', 'The chord this scale spells out: a dominant with a ♭9 and a natural 13.'],
    ['7b9', '1', 'Any 7♭9, often a V7 going to a major chord. If the chord has a ♭13 instead of a 13, use Phrygian dominant or altered.'],
  ],
  'dim-wh': [
    ['dim7', '1', 'Diminished 7th chords: a passing C♯°7 between C and Dm, or a vii°7.'],
  ],
  'whole-tone': [
    ['7#5', '1', 'A 7♯5 (or 9♯5) resolving to its I: brief and colourful.'],
    ['aug', '1', 'An augmented triad, e.g. the C+ in C – C+ – F.'],
  ],
  'bebop-dom': [
    ['7', '1', 'A V7: run it down from a chord tone on the beat and the chord tones keep landing on beats.'],
    ['m7', '4', 'On the ii of a ii–V, keep playing the V chord’s bebop dominant (G over Dm7, from the chord’s 4th). Bebop players treat the ii–V as one long V7.'],
  ],
  'bebop-maj': [
    ['6', '1', 'A major 6 chord: chord tones land on the beats, and the passing notes make a °7 (Barry Harris’s 6th-diminished).'],
    ['maj7', '1', 'Major 7th chords too.'],
  ],
  'bebop-dor': [
    ['m7', '1', 'A m7, especially a ii or a minor tonic: chord tones land on the beats.'],
  ],
};

// ---------- grips ----------
const MAXF = 15;
const SETS = { 3: [[3, 2, 1], [4, 3, 2], [5, 4, 3]], 4: [] };
function placements(root, q, voicing, ss, extra = {}) {
  try { return F.chordVoicings({ root, quality: q, voicing, stringSet: ss, inversion: 'all', ...extra }).filter((x) => x.maxFret <= MAXF); } catch (e) { return []; }
}
// up to six everyday grips for a chord, each with a name: the CAGED barre forms, shells, drop 2 and drop 3
export function gripsFor(root, q) {
  const out = [], seen = new Set();
  const add = (notes, label) => {
    if (!notes || notes.length < 3) return;
    const sig = notes.map((n) => n.string + ':' + n.fret).sort().join();
    if (seen.has(sig)) return; seen.add(sig);
    out.push({ notes, label });
  };
  const tri = T.getChord(q).ivs.length === 3;
  // the CAGED E and A forms (the barre chords everyone knows), where the chord has one
  // only chords that have a standard barre form; the altered chord gets the classic 7♯9 grip
  const BARRE = { maj: 'maj', min: 'min', '7': '7', m7: 'm7', maj7: 'maj7', '6': '6', m6: 'm6', '7sus4': '7sus4', m11: 'm11', '9': '9', '13': '13', mMaj7: 'mMaj7', '7#9': '7#9', '7b9': '7b9', '7alt': '7#9', aug: 'aug' };
  if (BARRE[q]) for (const sh of ['E', 'A']) {
    try {
      const qq = BARRE[q];
      const p = G.placements(root, qq, sh).filter((x) => x.hi <= 12).sort((a, b) => a.lo - b.lo)[0];
      if (p) add(p.notes, `${qq !== q ? `${T.pretty(T.chordSymbol(root, qq))} grip, ` : ''}${sh}-shape barre, root on the ${sh === 'E' ? 'low E' : 'A'} string`);
    } catch (e) { /* no grip for this chord */ }
  }
  if (tri) {
    for (const ss of SETS[3]) { const l = placements(root, q, 'close', ss).filter((x) => x.minFret >= 1).sort((a, b) => a.minFret - b.minFret); if (l[0]) add(l[0].notes, `Triad on strings ${ss.join('‑')}`); }
    return out.slice(0, 6);
  }
  const ivs = T.getChord(q).ivs;
  const hasGuide = ivs.some((x) => ['3', 'b3', '4'].includes(x)) && ivs.some((x) => ['7', 'b7', 'bb7', '6'].includes(x));
  if (hasGuide) {
    for (const [ss, nm] of [[[6, 4, 3], 'Shell, root on the low E'], [[5, 4, 3], 'Shell, root on the A']]) {
      const l = placements(root, q, 'shell', ss).filter((x) => x.notes[0].iv === '1' && x.minFret >= 1).sort((a, b) => a.minFret - b.minFret);
      if (l[0]) add(l[0].notes, nm);
    }
  }
  const inv = (x) => x.label.replace(/ \(.*\)/, '').toLowerCase().replace(/(^|\s)b(\d)/g, '$1♭$2').replace(/#/g, '♯');
  const pick = (l) => l.filter((x) => x.minFret >= 1 && x.maxFret <= 12).sort((a, b) => a.minFret - b.minFret)[0];
  const d2 = pick(placements(root, q, 'drop2', [4, 3, 2, 1]));
  if (d2) add(d2.notes, `Drop 2 on strings 4‑3‑2‑1 (${inv(d2)})`);
  const d2b = pick(placements(root, q, 'drop2', [5, 4, 3, 2]));
  if (d2b) add(d2b.notes, `Drop 2 on strings 5‑4‑3‑2 (${inv(d2b)})`);
  const d3 = pick(placements(root, q, 'drop3', [6, 4, 3, 2]).filter((x) => x.bassIv === '1'));
  if (d3) add(d3.notes, 'Drop 3, root on the low E');
  const d3b = pick(placements(root, q, 'drop3', [5, 3, 2, 1]).filter((x) => x.bassIv === '1'));
  if (d3b) add(d3b.notes, 'Drop 3, root on the A');
  return out.slice(0, 6);
}

// a chord box: strings top to bottom as on a chart (low E on the left), each note labelled by its interval
const role = (iv) => { const d = String(iv).replace(/[^0-9]/g, ''); return d === '1' || d === '8' ? 'r' : d === '3' || d === '10' ? 't' : d === '5' || d === '12' ? 'f' : d === '7' || (d === '6' && false) ? 's' : 'x'; };
export function gripSVG(notes, q) {
  const sevenIsSix = ['6', 'm6'].includes(q);
  const cls = (iv) => (sevenIsSix && iv === '6' ? 's' : iv === 'bb7' ? 's' : role(iv));
  const fretted = notes.filter((n) => n.fret > 0).map((n) => n.fret);
  const lo = fretted.length ? Math.min(...fretted) : 1, hi = fretted.length ? Math.max(...fretted) : 1;
  const from = hi <= 5 ? 1 : lo, rows = Math.max(5, hi - from + 1);
  const W = 150, x0 = 22, x1 = 128, y0 = 30, fh = 28, H = y0 + rows * fh + 8;
  const sx = (s) => x0 + ((6 - s) * (x1 - x0)) / 5;
  let svg = `<svg class="gbox" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">`;
  if (from === 1) svg += `<rect x="${x0 - 2}" y="${y0 - 5}" width="${x1 - x0 + 4}" height="6" rx="1" class="gnut"/>`;
  else svg += `<text x="${x0 - 8}" y="${y0 + fh / 2 + 4}" text-anchor="end" class="gfn">${from}</text>`;
  for (let r = 0; r <= rows; r++) svg += `<line x1="${x0}" y1="${y0 + r * fh}" x2="${x1}" y2="${y0 + r * fh}" class="gfret"/>`;
  for (let s = 1; s <= 6; s++) svg += `<line x1="${sx(s)}" y1="${y0}" x2="${sx(s)}" y2="${y0 + rows * fh}" class="gstr"/>`;
  const used = new Set(notes.map((n) => n.string));
  for (let s = 1; s <= 6; s++) if (!used.has(s)) svg += `<text x="${sx(s)}" y="${y0 - 10}" text-anchor="middle" class="gx">×</text>`;
  for (const n of notes) {
    const lab = T.prettyIv(n.iv);
    if (n.fret === 0) { svg += `<g class="gdot open ${cls(n.iv)}"><circle cx="${sx(n.string)}" cy="${y0 - 14}" r="9"/><text x="${sx(n.string)}" y="${y0 - 10.5}" text-anchor="middle">${esc(lab)}</text></g>`; continue; }
    const cy = y0 + (n.fret - from + 0.5) * fh;
    svg += `<g class="gdot ${cls(n.iv)}"><circle cx="${sx(n.string)}" cy="${cy}" r="11.5"/><text x="${sx(n.string)}" y="${cy + 4}" text-anchor="middle">${esc(lab)}</text></g>`;
  }
  return svg + '</svg>';
}
