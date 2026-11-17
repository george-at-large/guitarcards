// Jazz forms: a vocabulary of movable voicing shapes (formsdata.js), fitted to any chord. A shape fits when it holds
// the chord's essential tones (the 5th may go, and in a seventh chord the root may too) and its other notes are
// tensions that suit the chord; it is moved to the chord's root and placed anywhere on the neck (or in an area).
// Also: the progressions that come with them, as Exploder items.
import * as T from '../theory.js';
import { FORMS, STUDIES } from './formsdata.js';
import { fingerable } from './harm.js';

const OPEN = [40, 45, 50, 55, 59, 64]; // strings 6 → 1
const openOf = (s) => OPEN[6 - s];
const semi = (iv) => T.intervalSemis(iv) % 12;
// the tensions that suit each chord family, beyond its own tones (semitones above the root)
const EXTRAS = { maj: [2, 9, 6], dom: [2, 9], alt: [1, 2, 3, 6, 8, 9], min: [2, 5, 9], hd: [2, 5, 8], dim7: [2, 5, 8, 11], dim: [9], aug: [2, 11], sus: [2, 9, 10] };
const EXT_NAME = { 1: 'b9', 2: '9', 3: '#9', 5: '11', 6: '#11', 8: 'b13', 9: '13', 10: 'b7', 11: '7' };
function familyOf(q) {
  const ivs = T.getChord(q).ivs, has = (x) => ivs.includes(x);
  if (has('3') && has('b7')) return ivs.some((x) => /^(b9|#9|#11|b13|#5|b5)$/.test(x)) || q === '7alt' ? 'alt' : 'dom';
  if (has('b3') && has('b5')) return has('bb7') ? 'dim7' : has('b7') ? 'hd' : 'dim';
  if (has('b3')) return 'min';
  if (has('3') && has('#5')) return 'aug';
  if (!has('3')) return 'sus';
  return 'maj';
}
const RELS = FORMS.map((f) => new Set(f.map((n) => n[2])));

// every placement of every fitting shape: { notes: [{ string, fret, midi, iv }] low to high, form: true }
export function formsFor(root, q, area = { lo: 0, hi: 15 }) {
  const rootPc = T.notePc(root), ivs = T.getChord(q).ivs;
  const own = new Map(ivs.map((iv) => [semi(iv), iv]));
  const ok = new Set([...own.keys(), 0, 7, ...(EXTRAS[familyOf(q)] || [])]);
  const core = ivs.filter((iv) => iv !== '5' && !(iv === '1' && ivs.length >= 4) && !/^(b|#)?(9|11|13)$/.test(iv)).map(semi);
  const ext = ivs.filter((iv) => /^(b|#)?(9|11|13)$/.test(iv)).map(semi);
  const pass = (want) => {
    const out = [];
    FORMS.forEach((f, fi) => {
      const rels = RELS[fi];
      if (![...rels].every((r) => ok.has(r)) || !core.every((r) => rels.has(r)) || !want(rels)) return;
      // where the shape's first note must sit for its interval to land on this root
      const [s0, o0, r0] = f[0];
      const pc0 = (rootPc + r0) % 12;
      for (let base = 0; base <= 15; base++) {
        if ((openOf(s0) + base + o0) % 12 !== pc0) continue;
        const notes = f.map(([s, o, r]) => ({ string: s, fret: base + o, midi: openOf(s) + base + o, iv: own.get(r) || EXT_NAME[r] || (r === 7 ? '5' : r === 0 ? '1' : String(r)) }));
        if (notes.some((n) => n.fret < 1 || n.fret > 15)) continue;
        const fr = notes.map((n) => n.fret);
        if (Math.min(...fr) < area.lo - 1 || Math.max(...fr) > area.hi + 1) continue;
        if (!fingerable(notes)) continue; // a hand can play it
        out.push({ notes: notes.sort((a, b) => a.midi - b.midi), form: true, lo: Math.min(...fr), hi: Math.max(...fr) });
      }
    });
    return out;
  };
  const strict = pass((rels) => ext.every((r) => rels.has(r)));
  return strict.length || !ext.length ? strict : pass((rels) => ext.some((r) => rels.has(r)));
}

// the progressions, named by their numerals
const pretty = (tok) => {
  const [rn, rest] = tok.split(':'), q = (rest || '').split('/')[0];
  let sym = T.getChord(q).sym.trim();
  if (rn !== rn.toUpperCase() && sym.startsWith('m') && !sym.startsWith('maj')) sym = sym.slice(1);
  return T.prettyRoman(rn) + T.pretty(sym);
};
export const STUDY_ITEMS = STUDIES.map((s, i) => {
  const toks = s.chart.split('|').map((x) => x.trim()).filter(Boolean);
  return { id: `st-${i}`, name: toks.map(pretty).join(' – '), chart: s.chart, minor: s.minor, note: `${toks.length} chords` };
});
