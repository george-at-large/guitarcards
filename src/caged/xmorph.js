// The extended chord morpher: one root, in one CAGED area, morphed through every sound worth knowing on that root
// (extended, altered, sus and slash chords), in order of brightness. The order is the modes' brightness ladder: each
// sound is the characteristic chord of a mode, and the families step down one note at a time (major: 3 and 7;
// dominant: the 7th drops; minor: the 3rd drops; half-diminished: the 5th drops; diminished: the 7th drops again).
// Each sound is voiced inside the area by a search over every string combination (adjacent sets, skipped strings,
// five and six-string grips) with the root in the bass, kept only if it's playable and clean, and each morph picks the
// voicing on the same strings that moves the hand least. Pure: no screen, no sound.
import * as T from '../theory.js';
import * as F from '../fretboard.js';

const semis = (iv) => T.intervalSemis(F.simpleIv(String(iv))) % 12;

// every sound, brightest first within each family. need: the notes that make it that sound; opt: notes it may add.
// over: a slash chord's upper triad (its root as an interval above the bass, and m for a minor triad).
export const FAMS = [
  ['maj', 'Major'], ['dom', 'Dominant'], ['min', 'Minor'], ['hd', 'Half-diminished and diminished'], ['slash', 'Slash chords'],
];
export const SOUNDS = [
  // ----- major: Lydian augmented, Lydian, Ionian, harmonic major -----
  { id: 'maj7#5', fam: 'maj', sym: 'maj7#5', need: ['3', '#5', '7'], opt: ['9'], from: 'Lydian augmented, the 3rd mode of melodic minor', use: 'The brightest major sound: a maj7 with its 5th pushed up. ♭III in a minor key, or a floating, unresolved tonic in film and fusion.' },
  { id: 'maj7#11', fam: 'maj', sym: 'maj7#11', need: ['3', '7', '#11'], opt: ['5', '9', '13'], from: 'Lydian, the 4th mode of major', use: 'IV in a major key, or a dreamy tonic: the raised 4th floats where the plain 4th would rub. Film scores, Satriani, Steely Dan.' },
  { id: 'B/A', fam: 'slash', sym: '/', over: ['9', ''], need: ['9', '#11', '13'], opt: [], from: 'Lydian: the major triad a whole step up, over the root', use: 'II over I: Lydian with no 3rd or 7th, airy and wide. Fusion, film, worship pads.' },
  { id: 'maj13', fam: 'maj', sym: 'maj13', need: ['3', '7', '13'], opt: ['5', '9'], from: 'Ionian, the major scale', use: 'The fullest major tonic: I or IV in jazz and soul, the 13 sweetening the top.' },
  { id: 'maj9', fam: 'maj', sym: 'maj9', need: ['3', '7', '9'], opt: ['5'], from: 'Ionian, the major scale', use: 'The lush tonic of soul, neo-soul and jazz ballads: I and IV in a major key.' },
  { id: '69', fam: 'maj', sym: '69', need: ['3', '6', '9'], opt: ['5'], from: 'the major pentatonic (Ionian without its 4th and 7th)', use: 'The ending chord of jazz and bossa nova: no 7th, so nothing leans. The major pentatonic stacked up.' },
  { id: 'E/A', fam: 'slash', sym: '/', over: ['5', ''], need: ['5', '7', '9'], opt: [], from: 'Ionian: the V triad over the root', use: 'V over I: a maj9 with no 3rd, open and modern. Fusion, film, ambient guitar.' },
  { id: 'D/A', fam: 'slash', sym: '/', over: ['4', ''], need: ['4', '6'], opt: [], from: 'Ionian or Mixolydian: the IV triad over the root', use: 'IV over I: the gospel and rock lean (the plagal neighbour) that wants to fall straight back to the major chord.' },
  { id: 'maj7b13', fam: 'maj', sym: 'maj7b13', need: ['3', '7', 'b13'], opt: ['5', '9'], from: 'harmonic major (major with a ♭6)', use: 'Major with the minor iv’s sigh built in: dark, romantic, a little exotic. A tonic in film and late-Romantic harmony.' },
  // ----- dominant: Lydian dominant, Mixolydian, sus, Mixolydian ♭6, Phrygian dominant, diminished, altered, whole tone -----
  { id: '9#11', fam: 'dom', sym: '9#11', need: ['3', 'b7', '#11'], opt: ['9', '13', '5'], from: 'Lydian dominant, the 4th mode of melodic minor', use: 'A dominant that doesn’t resolve down a 5th: IV7 in blues and funk, ♭VII7 in rock, the tritone sub ♭II7. Bright and shimmering.' },
  { id: '13', fam: 'dom', sym: '13', need: ['3', 'b7', '13'], opt: ['5', '9'], from: 'Mixolydian, the 5th mode of major', use: 'The sweet dominant of blues, funk and soul; V7 going to a major I. The 13 often holds over as the 3rd of I.' },
  { id: '9', fam: 'dom', sym: '9', need: ['3', 'b7', '9'], opt: ['5'], from: 'Mixolydian, the 5th mode of major', use: 'Funk’s chord (James Brown’s grip), and a plain V7 dressed up.' },
  { id: 'G/A', fam: 'slash', sym: '/', over: ['b7', ''], need: ['b7', '9', '11'], opt: [], from: 'Mixolydian: the ♭VII triad over the root', use: '♭VII over I: a 9sus4, the soul and gospel dominant (Maiden Voyage, Burt Bacharach). It can sit or fall to the major chord.' },
  { id: '13sus4', fam: 'dom', sym: '13sus4', need: ['4', 'b7', '13'], opt: ['9', '5'], from: 'Mixolydian, with the 4th in place of the 3rd', use: 'The suspended dominant: tension held without the leading tone. Modal vamps and the V of a gospel cadence.' },
  { id: 'Gm/A', fam: 'slash', sym: '/', over: ['b7', 'm'], need: ['b7', 'b9', '11'], opt: [], from: 'Phrygian or Dorian ♭2 (the 2nd mode of melodic minor): the ♭VII minor triad over the root', use: 'The sus♭9 chord: dark and modal, Herbie Hancock and Coltrane-era vamps, and a V to a minor chord.' },
  { id: '9b13', fam: 'dom', sym: '9b13', need: ['3', 'b7', 'b13'], opt: ['9'], from: 'Mixolydian ♭6, the 5th mode of melodic minor', use: 'V7 going to a minor chord: the ♭13 is already the 3rd of where it’s going, with the 9 keeping it soft.' },
  { id: '7b9b13', fam: 'dom', sym: '7b9b13', need: ['3', 'b7', 'b9', 'b13'], opt: ['5'], from: 'Phrygian dominant, the 5th mode of harmonic minor', use: 'V7 in a minor key: the classical, Spanish and klezmer dominant. Both tensions fall a half step into the minor chord.' },
  { id: '13b9', fam: 'dom', sym: '13b9', need: ['3', 'b7', 'b9', '13'], opt: ['5'], from: 'the half-whole diminished scale', use: 'The diminished-scale dominant: a bright 13 against a dark ♭9. Big band, bebop, and V7 to a major I.' },
  { id: 'F#/A', fam: 'slash', sym: '/', over: ['13', ''], need: ['13', 'b9', '3'], opt: [], from: 'the half-whole diminished scale: the VI triad over the root', use: 'An upper structure: the major triad on the 6th over the bass is a 13♭9 without its 7th. Jazz piano’s favourite dominant colour, on guitar.' },
  { id: '7#9', fam: 'dom', sym: '7#9', need: ['3', 'b7', '#9'], opt: ['5'], from: 'the blues, and the altered scale', use: 'The Hendrix chord (Purple Haze): the blues ♭3 sounding against the major 3rd. Funk, rock, and an altered V7.' },
  { id: '7alt', fam: 'dom', sym: '7#9b13', need: ['3', 'b7', '#9', 'b13'], opt: [], from: 'the altered scale (super-Locrian), the 7th mode of melodic minor', use: 'The jazz V7 at full pull: every tension altered, each a half step from a note of the chord it resolves to.' },
  { id: '7b9#5', fam: 'dom', sym: '7b9#5', need: ['3', 'b7', 'b9', '#5'], opt: [], from: 'the altered scale (super-Locrian), the 7th mode of melodic minor', use: 'Another altered V7: ♭9 and ♯5 both resolve down by a half step into a minor or major I.' },
  { id: '9#5', fam: 'dom', sym: '9#5', need: ['3', 'b7', '#5'], opt: ['9'], from: 'the whole-tone scale', use: 'The whole-tone dominant: augmented and dreamy (Debussy, Monk, Stevie Wonder), its ♯5 rising into the next chord’s 3rd.' },
  // ----- minor: melodic minor, Dorian, Aeolian, Phrygian -----
  { id: 'mMaj9', fam: 'min', sym: 'mMaj9', need: ['b3', '7', '9'], opt: ['5'], from: 'melodic minor (also harmonic minor without the 9)', use: 'The film-noir minor tonic (the Bond chord), and the middle of the minor line cliché.' },
  { id: 'mMaj7', fam: 'min', sym: 'mMaj7', need: ['b3', '7'], opt: ['5'], from: 'melodic and harmonic minor', use: 'The minor-major chord: a minor tonic with its leading tone, tense and cinematic. The line cliché’s second chord.' },
  { id: 'm6', fam: 'min', sym: 'm6', need: ['b3', '6'], opt: ['5', '9'], from: 'Dorian and melodic minor', use: 'The minor tonic of jazz and gypsy jazz: the natural 6 makes it bittersweet. Also iv6 in a minor key.' },
  { id: 'm13', fam: 'min', sym: 'm13', need: ['b3', 'b7', '13'], opt: ['5', '9', '11'], from: 'Dorian, the 2nd mode of major', use: 'ii in a major key, or a Dorian vamp (Oye Como Va, So What): the natural 13 is Dorian’s bright spot.' },
  { id: 'm11', fam: 'min', sym: 'm11', need: ['b3', 'b7', '11'], opt: ['5', '9'], from: 'Dorian or Aeolian', use: 'Stacked 4ths, the open modal minor: neo-soul, fusion, and the So What voicing’s sound.' },
  { id: 'm9', fam: 'min', sym: 'm9', need: ['b3', 'b7', '9'], opt: ['5'], from: 'Dorian or Aeolian', use: 'The smooth minor: ii in jazz, vi in soul ballads, a minor tonic in R&B.' },
  { id: 'F/A', fam: 'slash', sym: '/', over: ['b13', ''], need: ['b3', 'b13'], opt: [], from: 'Aeolian (natural minor): the ♭VI triad over the root', use: '♭VI over i: the ♭6 hanging over the minor chord, sad and cinematic. Also a step in the minor line cliché.' },
  { id: 'Bb/A', fam: 'slash', sym: '/', over: ['b9', ''], need: ['b9', '11', 'b13'], opt: [], from: 'Phrygian, the 3rd mode of major: the ♭II triad over the root', use: '♭II over i: the flamenco and metal sound, the Phrygian half step on top of the bass.' },
  // ----- half-diminished and diminished: Locrian ♮2, Locrian, diminished -----
  { id: 'm9b5', fam: 'hd', sym: 'm9b5', need: ['b3', 'b5', 'b7', '9'], opt: [], from: 'Locrian ♮2, the 6th mode of melodic minor', use: 'ii in a minor ii–V, the smooth version: the natural 9 softens the half-diminished chord.' },
  { id: 'm11b5', fam: 'hd', sym: 'm11b5', need: ['b3', 'b5', 'b7', '11'], opt: [], from: 'Locrian, the 7th mode of major', use: 'Half-diminished with a 4th on top: modern jazz (Wayne Shorter) and dark modal pads.' },
  { id: 'm7b5', fam: 'hd', sym: 'm7b5', need: ['b3', 'b5', 'b7'], opt: [], from: 'Locrian, the 7th mode of major', use: 'ii of a minor ii–V, or vii in a major key. Its upper three notes are a minor triad, a minor 3rd above the root.' },
  { id: 'dim7', fam: 'hd', sym: 'dim7', need: ['b3', 'b5', 'bb7'], opt: [], from: 'the whole-half diminished scale', use: 'The passing chord between neighbours, and V7♭9 without its root: four notes a minor 3rd apart, the same grip every three frets.' },
];
export const byId = (id) => SOUNDS.find((s) => s.id === id);
const FAM_ORDER = ['maj', 'dom', 'min', 'hd'];
// the family a slash chord sits in, for the brightness order
const SLASH_FAM = { 'B/A': 'maj', 'E/A': 'maj', 'D/A': 'maj', 'G/A': 'dom', 'Gm/A': 'dom', 'F#/A': 'dom', 'F/A': 'min', 'Bb/A': 'min' };
export const famOf = (s) => (s.fam === 'slash' ? SLASH_FAM[s.id] : s.fam);

// the sounds to morph through, in order: brightest to darkest, the chosen families (slash chords where they belong)
export function ladder({ fams = FAM_ORDER, slash = true } = {}) {
  return SOUNDS.filter((s) => (s.fam === 'slash' ? slash && fams.includes(SLASH_FAM[s.id]) : fams.includes(s.fam)));
}

// a sound's name on a root: Amaj7♯11, or B/A for a slash chord
export function nameOn(root, s) {
  const r = T.noteName(root, true);
  if (s.fam !== 'slash') return `${r}${s.sym.replace(/b(?=\d)/g, '♭').replace(/#/g, '♯').replace('mMaj', 'm(maj').replace(/m\(maj(\d+)/, 'm(maj$1)')}`;
  return `${T.noteName(T.transpose(root, F.simpleIv(s.over[0])), true)}${s.over[1]}/${r}`;
}

// ---------- voicing search ----------
// every clean, playable voicing of a sound on this root, inside the area (pos: lo..hi, a fret either side allowed
// once), root in the bass
export function voicings(root, s, pos) {
  const rpc = T.notePc(root);
  const tones = [['1', 0], ...[...s.need, ...s.opt].map((iv) => [iv, semis(iv)])];
  const ivAt = new Map(); for (const [iv, x] of tones) if (!ivAt.has(x)) ivAt.set(x, iv);
  const needPcs = s.need.map(semis);
  const hasB9 = needPcs.includes(1);
  const lo = Math.max(0, pos.lo - 1), hi = pos.hi + 1;
  const cand = {};
  for (let st = 1; st <= 6; st++) {
    cand[st] = [];
    for (let f = lo; f <= hi; f++) {
      if (f === 0 && pos.lo > 1) continue;
      const rel = ((F.OPEN[st] + f - rpc) % 12 + 12) % 12;
      if (ivAt.has(rel)) cand[st].push({ string: st, fret: f, midi: F.OPEN[st] + f, rel, iv: ivAt.get(rel) });
    }
  }
  const out = [];
  const pick = [];
  const rec = (st) => {
    if (st === 0) { const v = check(pick.slice()); if (v) out.push(v); return; }
    rec(st - 1); // string muted
    for (const c of cand[st]) { pick.push(c); rec(st - 1); pick.pop(); }
  };
  const check = (notes) => {
    if (notes.length < 3) return null;
    notes.sort((a, b) => b.string - a.string); // bass first
    if (notes[0].rel !== 0) return null; // the root in the bass
    const rels = notes.map((n) => n.rel);
    for (const x of needPcs) if (!rels.includes(x)) return null;
    // doubles: only the root or 5th, at most two extra notes
    const count = new Map(); for (const r of rels) count.set(r, (count.get(r) || 0) + 1);
    let extra = 0; for (const [r, c] of count) if (c > 1) { if (r !== 0 && r !== 7) return null; extra += c - 1; }
    if (extra > 2) return null;
    // the hand: a span of four frets at most, four fingers (or a barre for the rest), inside the area
    const fr = notes.filter((n) => n.fret > 0).map((n) => n.fret);
    if (fr.length) {
      const mn = Math.min(...fr), mx = Math.max(...fr);
      if (mx - mn > 3 + (fr.length <= 3 ? 1 : 0)) return null;
      if (fr.length > 4 && fr.filter((f) => f === mn).length < fr.length - 3) return null;
      let outside = 0; for (const f of fr) outside += Math.max(0, pos.lo - f, f - pos.hi);
      if (outside > 1) return null;
    }
    // strings: no two muted strings in a row inside the voicing, at most two muted inside
    const used = notes.map((n) => n.string), top = Math.min(...used), bot = Math.max(...used);
    let gaps = 0, run = 0;
    for (let x = bot; x >= top; x--) { if (used.includes(x)) run = 0; else { gaps++; run++; if (run > 1) return null; } }
    if (gaps > 2) return null;
    // the sound: no unisons, no muddy close intervals low down, no ♭9 rubs (except the ♭9 over the root), no
    // half step at the top
    const m = notes.map((n) => n.midi).slice().sort((a, b) => a - b);
    for (let i = 1; i < m.length; i++) {
      const d = m[i] - m[i - 1];
      if (d === 0) return null;
      if (m[i - 1] < 47 && d < 7) return null;
      if (m[i - 1] < 52 && d < 3) return null;
    }
    if (m[m.length - 1] - m[m.length - 2] === 1) return null;
    for (let i = 0; i < m.length; i++) for (let j = i + 1; j < m.length; j++) if (m[j] - m[i] === 13) {
      const a = ((m[i] - rpc) % 12 + 12) % 12;
      if (!(hasB9 && a === 0)) return null;
    }
    const g = notes.map((n) => ({ string: n.string, fret: n.fret, midi: n.midi, iv: n.iv, note: T.transpose(root, F.simpleIv(n.iv)) }));
    const strings = used.slice().sort((a, b) => b - a);
    return { notes: g, strings, bass: notes[0].string, top, size: notes.length, lo: fr.length ? Math.min(...fr) : 0, hi: Math.max(...notes.map((n) => n.fret)), span: fr.length ? Math.max(...fr) - Math.min(...fr) : 0, topIv: notes[notes.length - 1].iv };
  };
  rec(6);
  return out;
}

// how far the hand travels: frets moved per string, a string joining or leaving counts 1.5
export function cost(a, b) {
  let d = 0;
  for (let s = 1; s <= 6; s++) {
    const x = a.notes.find((n) => n.string === s), y = b.notes.find((n) => n.string === s);
    if (x && y) d += Math.abs(x.fret - y.fret); else if (x || y) d += 1.5;
  }
  return d;
}
// which notes moved, by pitch (whichever string they're on): "7 → ♭7 down a half step"; notes held aren't mentioned
export function movedText(a, b) {
  const am = a.notes.filter((n) => !b.notes.some((x) => x.midi === n.midi));
  const bm = b.notes.filter((n) => !a.notes.some((x) => x.midi === n.midi));
  const out = [], used = new Set();
  for (const n of bm.slice().sort((x, y) => x.midi - y.midi)) {
    let best = null;
    for (const o of am) if (!used.has(o) && (!best || Math.abs(o.midi - n.midi) < Math.abs(best.midi - n.midi))) best = o;
    if (best && Math.abs(best.midi - n.midi) <= 4) {
      used.add(best);
      const d = n.midi - best.midi;
      out.push(`${T.prettyIv(best.iv)} → ${T.prettyIv(n.iv)} ${d < 0 ? 'down' : 'up'} ${Math.abs(d) === 1 ? 'a half step' : Math.abs(d) === 2 ? 'a whole step' : `${Math.abs(d)} frets`}`);
    } else out.push(`${T.prettyIv(n.iv)} added`);
  }
  for (const o of am) if (!used.has(o)) out.push(`${T.prettyIv(o.iv)} dropped`);
  return out;
}

// the lanes to morph in: compact (3 or 4 notes) or full (5 or 6), with the root on the 6th, 5th or 4th string
export const SIZES = [['compact', 'Compact: 3–4 notes'], ['full', 'Full: 5–6 notes'], ['both', 'Both']];
export function lanes(root, list, pos, size = 'both') {
  const all = new Map(list.map((s) => [s.id, voicings(root, s, pos)]));
  const out = [];
  for (const bass of [6, 5, 4]) for (const sz of size === 'both' ? ['compact', 'full'] : [size]) {
    const ok = (v) => v.bass === bass && (sz === 'compact' ? v.size <= 4 : v.size >= 5);
    // the root's place on this string: one lane per root fret in the area
    const roots = [...new Set(list.flatMap((s) => all.get(s.id).filter(ok).map((v) => v.notes[0].fret)))];
    for (const rf of roots) {
      const per = list.map((s) => [s, all.get(s.id).filter((v) => ok(v) && v.notes[0].fret === rf)]).filter(([, vs]) => vs.length);
      if (per.length >= Math.min(6, Math.ceil(list.length / 2))) out.push({ bass, size: sz, rootFret: rf, per });
    }
  }
  return out;
}
// one lane, morphed: start on the first sound's tidiest voicing, then each next sound on the voicing that moves least
// (staying on the same strings when it can, the colour note on top as a tie-break)
export function morph(lane) {
  const path = [];
  let prev = null;
  for (const [s, vs] of lane.per) {
    let v;
    if (!prev) v = vs.slice().sort((a, b) => a.span - b.span || b.size - a.size || a.lo - b.lo)[0];
    else {
      const sc = (x) => cost(prev, x) + (String(x.strings) === String(prev.strings) ? 0 : 0.75) + x.span * 0.15 + (s.need.includes(x.topIv) ? -0.2 : 0);
      v = vs.reduce((a, b) => (sc(a) <= sc(b) ? a : b));
    }
    path.push({ s, v, prev });
    prev = v;
  }
  return path;
}
