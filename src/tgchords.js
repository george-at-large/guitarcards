// Ted Greene-style chord symbols -> tone sets, and absolute-fret grips -> notes. Used by the TG section and the checker.
import * as T from './theory.js';

const OPEN = [40, 45, 50, 55, 59, 64]; // strings 6..1

// "x 3 2 0 1 0" / [null,3,2,0,1,0]  (strings 6 -> 1)
export function parseFrets(f) {
  const arr = Array.isArray(f) ? f : String(f).trim().split(/\s+/);
  if (arr.length !== 6) throw new Error(`grip "${f}" must list 6 strings (6 → 1)`);
  return arr.map((t) => {
    if (t === null || t === 'x' || t === 'X' || t === '-') return null;
    const n = Number(String(t).replace(/[!?*()]/g, ''));
    if (!Number.isFinite(n) || n < 0 || n > 24) throw new Error(`bad fret "${t}" in "${f}"`);
    return n;
  });
}
export const gripMidis = (frets) => frets.map((f, i) => (f == null ? null : OPEN[i] + f));

// parse a written chord symbol: C, Dm7, Bø7, B°, G#°7, F7/6, C6/9, Am7/G, C/E, Ebmaj7#11, D7-9, A7+5, Csus, G9sus4
export function parseSymbol(sym) {
  const s = String(sym).trim().replace(/♭/g, 'b').replace(/♯/g, '#').replace(/Δ/g, 'maj').replace(/∅/g, 'ø');
  const m = /^([A-G])(#|b)?(.*)$/.exec(s);
  if (!m) throw new Error(`can't read chord symbol "${sym}"`);
  const root = T.parseNote(m[1] + (m[2] || ''));
  let q = m[3].trim();
  let bass = null;
  const sl = /\/([A-G](#|b)?)$/.exec(q);
  if (sl) { bass = T.parseNote(sl[1]); q = q.slice(0, sl.index); }
  q = q.replace(/\(|\)/g, '').replace(/-(?=\d)/g, 'b').replace(/\+(?=\d)/g, '#').replace(/^mi(?!n)/, 'm').replace(/^min/, 'm').replace(/^-/, 'm').replace(/^M(?=7|9|13)/, 'maj').replace(/^ma(?=7|9|13)/, 'maj');
  const tones = new Set(['1']);
  let third = '3', fifth = '5';
  let rest = q;
  const take = (re) => { const mm = re.exec(rest); if (mm) rest = rest.replace(re, ''); return mm; };
  let maj = false;
  if (take(/^(maj|M)(?=\d|$)/)) maj = true;
  else if (take(/^(ø|o\/|halfdim)/)) { third = 'b3'; fifth = 'b5'; tones.add('b7'); }
  else if (take(/^(°|o|dim)(?=7|$|[^a-z])/)) { third = 'b3'; fifth = 'b5'; if (take(/^7/)) tones.add('bb7'); }
  else if (take(/^m(?!aj)/)) { third = 'b3'; if (take(/^(maj|M|\/maj|Δ)/)) maj = true; }
  if (take(/^(\+|aug)/)) fifth = '#5';
  // main number
  const num = take(/^(13|11|9|7|6)/);
  const n = num ? num[1] : null;
  const sev = maj ? '7' : 'b7';
  if (n === '6') tones.add('6');
  if (n === '7') tones.add(sev);
  if (n === '9') { tones.add(sev); tones.add('9'); }
  if (n === '11') { tones.add(sev); tones.add('9'); tones.add('11'); }
  if (n === '13') { tones.add(sev); tones.add('9'); tones.add('13'); tones.add('11'); }
  if (maj && !n) tones.add('7');
  if (/^7\b/.test(q) && third === 'b3' && fifth === 'b5' && !tones.has('b7')) tones.add('b7');
  // "/6" "/9" "/11" added tones (7/6 = 7 with 6, 6/9)
  rest = rest.replace(/\/(6|9|11|13)/g, (x, d) => { tones.add(d === '13' ? '13' : d); return ''; });
  if (take(/^sus2/)) third = '2';
  else if (take(/^sus4?/)) third = '4';
  rest = rest.replace(/add(b?#?\d+)/g, (x, d) => { tones.add(d); return ''; });
  if (/sus4?/.test(rest)) { third = '4'; rest = rest.replace(/sus4?/, ''); }
  // alterations
  rest = rest.replace(/(b|#)(5|9|11|13)/g, (x, a, d) => {
    if (d === '5') fifth = a + '5';
    else tones.add(a + d);
    if (d !== '5' && !tones.has('b7') && !tones.has('7') && !tones.has('6')) tones.add('b7');
    return '';
  });
  rest = rest.replace(/\+$|aug$/, () => { fifth = '#5'; return ''; });
  rest = rest.replace(/alt/, () => { ['b7', 'b9', '#9', '#11', 'b13'].forEach((t) => tones.add(t)); fifth = null; return ''; });
  tones.add(third);
  if (fifth) tones.add(fifth);
  const ivs = [...tones];
  const pcs = new Set(ivs.map((iv) => (T.notePc(root) + T.intervalSemis(iv)) % 12));
  if (bass) pcs.add(T.notePc(bass));
  return { root, bass, ivs, pcs, leftover: rest.trim() };
}

// interval label of a pitch class relative to a chord
export function ivLabel(chord, pc) {
  const semi = ((pc - T.notePc(chord.root)) % 12 + 12) % 12;
  const fromChord = chord.ivs.find((iv) => T.intervalSemis(iv) % 12 === semi);
  return fromChord || ['1', 'b2', '2', 'b3', '3', '4', 'b5', '5', 'b6', '6', 'b7', '7'][semi];
}

// check a grip against its symbol: returns {ok, notes, extra:[...], problems:[...]}
export function checkGrip(name, frets) {
  const ch = parseSymbol(name);
  const f = parseFrets(frets);
  const mids = gripMidis(f);
  const sounded = mids.map((m, i) => (m == null ? null : { string: 6 - i, fret: f[i], pc: m % 12, iv: ivLabel(ch, m % 12) }));
  const extra = sounded.filter((x) => x && !ch.pcs.has(x.pc));
  const problems = [];
  if (ch.leftover) problems.push(`unparsed "${ch.leftover}" in symbol`);
  if (extra.length) problems.push(`note(s) not in ${name}: ${extra.map((x) => `str${x.string} fr${x.fret}=${T.noteName(T.noteFromPc(x.pc))}`).join(', ')}`);
  if (ch.bass) { const low = sounded.find((x) => x); if (low && low.pc !== T.notePc(ch.bass)) problems.push(`slash bass ${T.noteName(ch.bass)} is not the lowest note`); }
  if (sounded.filter(Boolean).length < 2) problems.push('fewer than 2 notes');
  const fretted = f.filter((x) => x != null && x > 0);
  if (fretted.length && Math.max(...fretted) - Math.min(...fretted) > 5) problems.push('stretch > 5 frets');
  return { ok: !problems.length, sounded, problems };
}

// transpose a grip by semitones, keeping it on the neck (shift by octaves if needed)
export function transposeGrip(frets, semis) {
  const f = parseFrets(frets);
  for (const s of [semis, semis + 12, semis - 12, semis + 24, semis - 24]) {
    const out = f.map((x) => (x == null ? null : x + s));
    if (out.every((x) => x == null || (x >= 0 && x <= 17))) return out;
  }
  return f.map((x) => (x == null ? null : x + (((semis % 12) + 12) % 12)));
}
// transpose a whole sequence by the same amount (so voice leading is preserved)
export function transposeSequence(seq, semis) {
  const all = seq.flatMap((g) => parseFrets(g).filter((x) => x != null));
  for (const s of [semis, semis - 12, semis + 12, semis - 24, semis + 24]) {
    if (all.every((x) => x + s >= 0 && x + s <= 17)) return seq.map((g) => parseFrets(g).map((x) => (x == null ? null : x + s)));
  }
  // too wide for one shift: per-grip
  return seq.map((g) => transposeGrip(g, semis));
}
export function transposeSymbol(name, semis) {
  const ch = parseSymbol(name);
  const s = String(name).trim().replace(/♭/g, 'b').replace(/♯/g, '#');
  const m = /^([A-G](#|b)?)(.*)$/.exec(s);
  const newRoot = T.transposeSemis(ch.root, semis);
  let rest = m[3];
  rest = rest.replace(/\/([A-G](#|b)?)$/, (x, b) => '/' + T.noteName(T.transposeSemis(T.parseNote(b), semis)));
  return T.noteName(newRoot) + rest;
}
