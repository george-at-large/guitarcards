// Ambient's packs: progressions grouped to teach one thing each (a borrowed chord, a secondary dominant, a kind of
// chromatic mediant, slash chords and bass lines …), drawn from CAGED Changes' library and its borrowed, chromatic
// and modulation data. Each pack and each progression has a spoken introduction: its name and a line of theory,
// written for the ear (numerals as words), so the same text is recorded and shown.
import * as L from '../caged/library.js';
import { BORROWED } from '../caged/borrowdata.js';
import { CHROMATIC } from '../caged/chromdata.js';
import { MODULATIONS } from '../caged/moddata.js';

// ---------- text for the voice ----------
const NUM = { I: 'one', II: 'two', III: 'three', IV: 'four', V: 'five', VI: 'six', VII: 'seven' };
const QW = [['maj7♯11', 'major seven sharp eleven'], ['ø7', 'half diminished'], ['ø', 'half diminished'], ['°7', 'diminished seven'], ['°', 'diminished'], ['maj13', 'major thirteen'], ['maj9', 'major nine'], ['maj7', 'major seven'],
  ['m7♭5', 'half diminished'], ['m7b5', 'half diminished'], ['m(maj7)', 'minor major seven'], ['m11', 'minor eleven'], ['m9', 'minor nine'], ['m7', 'minor seven'], ['m6', 'minor six'], ['m', 'minor'],
  ['7♭9', 'seven flat nine'], ['7♯9', 'seven sharp nine'], ['7alt', 'altered'], ['7sus4', 'seven sus four'], ['13', 'thirteen'], ['11', 'eleven'], ['9', 'nine'], ['6/9', 'six nine'],
  ['7', 'seven'], ['6', 'six'], ['sus4', 'sus four'], ['sus2', 'sus two'], ['add9', 'add nine'], ['+', 'augmented']];
const RN = '(?:VII|VI|IV|V|III|II|I|vii|vi|iv|v|iii|ii|i)';
const QRX = QW.map(([q]) => q.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')).join('|');
const TOKEN = new RegExp(`(^|[\\s(–,:;/→])([♭♯b#]?)(${RN})(${QRX})?((?:/[♭♯b#]?${RN})?)(?=$|[\\s),.;:–→])`, 'g');
function numeral(acc, rn, q, of) {
  const minor = rn === rn.toLowerCase();
  const a = { '♭': 'flat ', b: 'flat ', '♯': 'sharp ', '#': 'sharp ' }[acc] || '';
  const n = NUM[rn.toUpperCase()];
  let qw = q ? QW.find(([k]) => k === q)[1] : '';
  let w;
  if (!minor) w = `${a}${n}${qw ? ` ${qw}` : ''}`;
  else if (qw) w = `${a}${n} ${/^(minor|half|diminished)/.test(qw) ? qw : qw === 'augmented' ? qw : `minor ${qw}`}`;
  else w = ['ii', 'iii', 'vi'].includes(rn) && !a ? n : `minor ${a}${n}`; // ii, iii, vi are minor anyway
  if (of) { const m = /^\/([♭♯b#]?)(\S+)$/.exec(of); w += ` of ${({ '♭': 'flat ', b: 'flat ', '♯': 'sharp ', '#': 'sharp ' }[m[1]] || '') + NUM[m[2].toUpperCase()]}`; }
  return w.replace(/\s+/g, ' ').trim();
}
const DEGN = { 1: 'one', 2: 'two', 3: 'three', 4: 'four', 5: 'five', 6: 'six', 7: 'seven', 8: 'eight', 9: 'nine', 11: 'eleven', 13: 'thirteen' };
export function speakable(s) {
  let t = String(s);
  for (let i = 0; i < 2; i++) t = t.replace(TOKEN, (m, pre, acc, rn, q, of) => `${pre}${numeral(acc, rn, q, of)}`);
  // chord symbols in a key: Bø7, E7♭9, Am7, D°7
  t = t.replace(/\b([A-G])([♭♯#b]?)(ø7|ø|°7|°|maj7|m7♭5|m7|m6|m|7♭9|7♯9|7|6|9)(?=$|[\s,.:;)–→=])/g, (m, n, acc, q) => `${n}${acc ? (/[♭b]/.test(acc) ? ' flat' : ' sharp') : ''} ${QW.find(([k]) => k === q)[1]}`)
    .replace(/\s=\s/g, ' is the same as ');
  t = t.replace(/([A-G])♭/g, '$1 flat').replace(/([A-G])♯/g, '$1 sharp')
    .replace(/([♭♯])(\d+)/g, (m, a, n) => `${a === '♭' ? 'flat' : 'sharp'} ${DEGN[n] || n}`)
    .replace(/\s*(→|–|—)\s*/g, ', ').replace(/\(([^)]*)\)/g, ', $1,').replace(/,\s*,/g, ',').replace(/,\s*([.:;])/g, '$1')
    .replace(/\s+/g, ' ').replace(/\s+([,.:;])/g, '$1').replace(/\bminor minor\b/g, 'minor').replace(/,\s*=\s*/g, ', which is ').replace(/,([.:;])/g, '$1').replace(/[,\s]+$/, '').trim();
  if (!/[.!?]$/.test(t)) t += '.';
  return t[0].toUpperCase() + t.slice(1);
}

// ---------- the packs ----------
const lib = (cat) => L.ALL.filter((p) => p.cat === cat);
const libItem = (p, note) => ({ id: p.id, name: p.name, note: note ?? p.by });
const fromData = (prefix, b, n = 5) => b.progs.slice(0, n).map((p, i) => ({ id: `${prefix}-${b.id}-${i}`, name: p.name, note: p.note || p.by || '' }));
const cleanFrom = (f) => String(f || '').replace(/\s*\(([^)]*)\)/, ', $1');

const CORE = ['iv', 'iv6', 'bVII', 'bVI', 'bIII', 'bVII7', 'iiø7', 'v', 'II', 'bII', 'IVm', 'V7m', 'Ipic'];
const COMBOS = ['bVI-bVII', 'iv-bVII', 'bIII-bVII', 'II-iv', 'bII-V', 'h-parallel', 'h-lyd-aeo'];
const B = (id) => BORROWED.find((b) => b.id === id);
const C = (name) => CHROMATIC.find((c) => c.name === name);

export const GROUPS = [
  { name: 'Modal interchange', packs: [
    ...CORE.map((id) => { const b = B(id); return { id: `mi-${id}`, name: `${b.rn} · ${b.name}`, intro: `${b.name}, borrowed from ${cleanFrom(b.from)}. ${b.sound}`, items: fromData('borrow', b) }; }),
    { id: 'mi-combos', name: 'Borrowed chords together', intro: 'Borrowed chords together: two or more colours from the parallel modes in one progression.',
      items: COMBOS.flatMap((id) => fromData('borrow', B(id), 2)) },
  ] },
  { name: 'Secondary dominants', packs: CHROMATIC.filter((c) => c.group === 'Secondary dominants').map((c) => ({ id: `sd-${c.id}`, name: c.name, intro: `${c.name}: ${c.sound}`, items: fromData('chrom', c) })) },
  { name: 'Substitutes and passing chords', packs: [
    { id: 'sub-tritone', name: 'Tritone substitutes', intro: `The tritone substitute: ${C('Tritone sub').sound}`, items: fromData('chrom', C('Tritone sub')) },
    { id: 'sub-dim', name: 'Diminished chords', intro: 'Diminished chords: passing between chords, or decorating one, every note a half step from somewhere.',
      items: CHROMATIC.filter((c) => c.group === 'Diminished').flatMap((c) => fromData('chrom', c, 2)) },
    { id: 'sub-cliche', name: 'Augmented and line clichés', intro: 'Line clichés: one inner voice moving by half steps while the chord holds.',
      items: CHROMATIC.filter((c) => c.group === 'Augmented and line clichés').flatMap((c) => fromData('chrom', c, 2)) },
    { id: 'sub-deceptive', name: 'Deceptive moves', intro: 'Deceptive moves: the dominant promises home, and goes somewhere else.',
      items: lib('Cadences').filter((p) => /Deceptive|Backdoor|Tritone/.test(p.name)).map((p) => libItem(p)) },
  ] },
  { name: 'Film harmony', packs: [
    ...CHROMATIC.filter((c) => c.group === 'Chromatic mediants').map((c) => ({ id: `fm-${c.id}`, name: `Mediants: ${c.name.toLowerCase()}`, intro: `Chromatic mediants, ${c.name.toLowerCase()}: ${c.sound}`, items: fromData('chrom', c) })),
    { id: 'fm-epic', name: 'Epic and heroic', intro: 'Epic harmony: chords borrowed from minor, landing on a major home.',
      items: [...fromData('borrow', B('bVI-bVII'), 3), ...fromData('borrow', B('h-lyd-aeo'), 2), ...lib('Cadences').filter((p) => /Mario/.test(p.name)).map((p) => libItem(p))] },
  ] },
  { name: 'Modes and cadences', packs: [
    { id: 'modes', name: 'Mode colours', intro: 'Mode colours: one vamp for each mode, built on the chord that makes it sound like itself.', items: lib('Modal vamps').map((p) => libItem(p)) },
    { id: 'cadences', name: 'Cadences', intro: 'Cadences: the ways a phrase can end, from the full stop to the open question.', items: lib('Cadences').map((p) => libItem(p)) },
  ] },
  { name: 'Bass and voice leading', packs: [
    { id: 'slash', name: 'Bass lines and slash chords', intro: 'Slash chords and bass lines: listen to the bass move while the chords above it barely change.', items: lib('Bass lines and slash chords').map((p) => libItem(p)) },
    { id: 'voicelead', name: 'Voice leading', intro: 'Voice leading: one note at a time moves, and every chord melts into the next.', items: lib('Voice leading').map((p) => libItem(p)) },
  ] },
  { name: 'Styles', packs: [
    { id: 'jazz', name: 'Jazz moves', intro: 'Jazz moves: two fives, turnarounds and chains of dominants.', items: lib('Turnarounds and jazz moves').map((p) => libItem(p)) },
    { id: 'standards', name: 'Jazz standards', intro: 'Jazz standards: the changes of tunes everyone plays.', items: lib('Jazz standards').map((p) => libItem(p)) },
    { id: 'classical', name: 'Classical patterns', intro: 'Classical patterns: sequences and grounds composers have used for centuries.', items: lib('Classical patterns').map((p) => libItem(p)) },
    { id: 'pop', name: 'Pop and rock', intro: 'Pop and rock: the loops behind thousands of songs.', items: lib('Pop and rock').map((p) => libItem(p)) },
    { id: 'blues', name: 'Blues', intro: 'The blues: dominant sevens everywhere, and the twelve-bar form.', items: lib('Blues').map((p) => libItem(p)) },
  ] },
  { name: 'Key changes', packs: MODULATIONS.map((m) => ({ id: `mod-${m.id}`, name: m.name, intro: `${m.name}. ${m.sound || ''}`, items: fromData('mod', m, 4) })) },
];
export const PACKS = GROUPS.flatMap((g) => g.packs.map((p) => ({ ...p, group: g.name, items: p.items.filter((it) => L.ALL.some((x) => x.id === it.id)) }))).filter((p) => p.items.length);
export const packById = (id) => PACKS.find((p) => p.id === id);

// what the voice says: a pack's opening, a progression's name and its line of theory
export const packSay = (p) => speakable(p.intro);
export const itemSay = (it, rich) => (rich && it.note ? [speakable(it.name), speakable(it.note)] : [speakable(it.name)]);
export function allPhrases() {
  const P = new Set();
  for (const p of PACKS) { P.add(packSay(p)); for (const it of p.items) itemSay(it, true).forEach((s) => P.add(s)); }
  L.ALL.forEach((it) => P.add(speakable(it.name))); // any progression can be chosen alone (One progression, Meander)
  return [...P];
}
