// A progression on the neck and in theory, the way a teacher would explain it.
//  On the neck: voiced as a player would. 7th-chord progressions in drop 2, voice-led inside one CAGED area (each
//   chord the smallest move from the last); triad and pop progressions in CAGED grips in one position. With the
//   top-voice line, the little melody the voicings make.
//  Chord by chord: its numeral, its job (tonic, predominant, dominant), and the mode to play over it, with where that
//   mode comes from (D Dorian = the 2nd mode of C major). Chords from outside the key get more: which notes leave the
//   key, which parallel mode lends them, what they stand in for or point at, and how their 3rd and 7th move into the
//   next chord. All computed from the chords and the key, so it holds in every key.
import * as T from '../theory.js';
import * as F from '../fretboard.js';
import * as G from '../caged/grips.js';
import * as H from '../caged/harmony.js';
import { sourcesOf } from '../caged/borrowed.js';
import { diagrams } from './shapes.js';
import { scaleName, FAMILY } from './scaledata.js';
import { nn, ordinal, esc, typeName } from './core.js';

const pcOf = (n) => T.notePc(n);
const semis = (iv) => T.intervalSemis(F.simpleIv(iv)) % 12;
const name = (c) => T.pretty(T.chordSymbol(c.root, c.quality)).replace(/\s+/g, '');
// the CAGED app's scale ids → the theory engine's
const CS2T = { ionian: 'ionian', dorian: 'dorian', phrygian: 'phrygian', lydian: 'lydian', mixolydian: 'mixolydian', aeolian: 'aeolian', locrian: 'locrian', 'mel-min': 'melodic-minor', 'dorian-b2': 'dorian-b2', 'lyd-aug': 'lydian-augmented', 'lyd-dom': 'lydian-dominant', 'mixo-b6': 'mixolydian-b6', 'locrian-n2': 'locrian-nat2', altered: 'altered', 'harm-min': 'harmonic-minor', 'locrian-n6': 'locrian-nat6', 'ionian-s5': 'ionian-sharp5', 'dorian-s4': 'dorian-sharp4', 'phryg-dom': 'phrygian-dominant', 'lydian-s2': 'lydian-sharp2', 'superloc-bb7': 'altered-dim', 'harm-maj': 'harmonic-major' };
const MAJOR_MODES = ['ionian', 'dorian', 'phrygian', 'lydian', 'mixolydian', 'aeolian', 'locrian'];
const FAMNAME = { ionian: 'major', 'melodic-minor': 'melodic minor', 'harmonic-minor': 'harmonic minor', 'harmonic-major': 'harmonic major' };

// "D Dorian, the 2nd mode of C major" (or "C melodic minor itself")
export function modeName(root, id) {
  let s = `${nn(root)} ${scaleName(id).replace(/ \(.*\)$/, '')}`;
  try {
    const p = T.parentOf(root, id);
    if (p && p.degree > 1) s += `, the ${ordinal(p.degree)} mode of ${nn(p.root)} ${FAMNAME[p.scaleId] || p.scaleId}`;
    else if (p && id !== 'ionian' && id !== 'aeolian') s += ` (the parent scale itself)`;
  } catch (e) { /* not a mode of anything: symmetric scales */ }
  return s;
}

// ---------- voicing ----------
export function voice(chords, tonic, shape) {
  const pos = G.positionOf(tonic, shape);
  const sev = chords.filter((c) => T.getChord(c.quality).ivs.length >= 4).length >= chords.length / 2;
  let prev = null;
  const grips = chords.map((c) => {
    let g = null;
    try { g = sev ? G.voiceLeadPick(c.root, c.quality, 'd2:all', pos, prev) : G.gripInPosition(c.root, c.quality, pos, prev); } catch (e) { g = null; }
    if (!g) { try { g = G.gripInPosition(c.root, c.quality, pos, prev) || G.voiceLeadPick(c.root, c.quality, 'd2:all', pos, prev); } catch (e) { g = null; } }
    prev = g || prev;
    return g;
  });
  return { grips, how: sev ? `Drop 2, voice-led in the ${shape}-shape area (frets ${pos.lo}–${pos.hi}): each chord the smallest move from the last` : `CAGED grips in the ${shape}-shape area (frets ${pos.lo}–${pos.hi}): stay in position, let the grips change around you` };
}
const top = (g) => (g ? g.notes.reduce((a, b) => (b.midi > a.midi ? b : a)) : null);

// ---------- chord by chord ----------
function homeScale(tonic, minor) { return T.scaleNotes(tonic, minor ? 'aeolian' : 'major'); }
// diatonic chord: its degree in the key and its job
function degreeOf(c, tonic, minor) {
  const notes = homeScale(tonic, minor);
  return notes.findIndex((n) => pcOf(n) === pcOf(c.root));
}
const JOB_MAJOR = ['tonic (home)', 'predominant (leads to V)', 'tonic substitute (shares two notes with I)', 'predominant', 'dominant (pulls home)', 'tonic substitute (the relative minor)', 'dominant (the leading-tone chord)'];
const JOB_MINOR = ['tonic (home)', 'predominant', 'tonic substitute (the relative major)', 'predominant', 'dominant (natural minor: a soft one)', 'predominant', 'subtonic: a whole step under home'];
const isDom = (q) => { const iv = T.getChord(q).ivs; return iv.includes('3') && iv.includes('b7'); };
function guideTones(q) {
  const iv = T.getChord(q).ivs;
  return iv.filter((x) => ['3', 'b3', '4', '7', 'b7', 'bb7', '6', 'b5', '#5'].includes(x)).filter((x, i, a) => a.findIndex((y) => semis(y) === semis(x)) === i).slice(0, 3);
}
// how the 3rd and 7th of a chord move into the next: "A♭ (♭7) falls to G (3rd of E♭)"
function resolution(c, next) {
  if (!next) return '';
  const nt = T.getChord(next.quality).ivs.map((x) => ({ x, pc: (pcOf(next.root) + semis(x)) % 12 }));
  const out = [];
  for (const g of guideTones(c.quality)) {
    const pc = (pcOf(c.root) + semis(g)) % 12;
    let best = null;
    for (const t of nt) { let d = ((t.pc - pc + 18) % 12) - 6; if (best == null || Math.abs(d) < Math.abs(best.d)) best = { ...t, d }; }
    if (!best || Math.abs(best.d) > 2) continue;
    const from = T.noteName(T.transpose(c.root, F.simpleIv(g)), true), to = T.noteName(T.transpose(next.root, F.simpleIv(best.x)), true);
    const move = best.d === 0 ? 'stays as' : `${best.d > 0 ? 'rises' : 'falls'} a ${Math.abs(best.d) === 1 ? 'half' : 'whole'} step to`;
    out.push(`${from} (${T.prettyIv(g)}) ${move} ${to} (${T.prettyIv(best.x)} of ${name(next)})`);
  }
  return out.length ? out.join('; ') + '.' : '';
}

export function analyse(c, next, tonic, minor) {
  const iv = H.ivFrom(tonic, c.root);
  const rn = c.rn || H.numeral(iv, c.quality);
  const home = homeScale(tonic, minor).map(pcOf);
  const tones = T.chordNotes(c.root, c.quality);
  const out = tones.filter((n) => !home.includes(pcOf(n))).map((n) => `${T.noteName(n, true)} (${T.prettyIv(T.intervalBetween(tonic, n))} of the key)`);
  const r = { name: name(c), rn, type: typeName(c.quality), outside: out.length > 0, lines: [] };
  const keyName = `${nn(tonic)} ${minor ? 'minor' : 'major'}`;
  if (!out.length) {
    const d = degreeOf(c, tonic, minor);
    if (d >= 0) {
      r.job = (minor ? JOB_MINOR : JOB_MAJOR)[d];
      const mode = minor ? MAJOR_MODES[(d + 5) % 7] : MAJOR_MODES[d];
      r.over = modeName(c.root, mode);
      return r;
    }
  }
  // outside the key: what lends it, or what it points at
  r.lines.push(`Outside ${keyName}: ${out.join(', ')}.`);
  const nextRoot = next ? pcOf(next.root) : null;
  const toNext = next ? (nextRoot - pcOf(c.root) + 12) % 12 : null;
  if (['dim7', 'dim'].includes(c.quality)) {
    if (toNext === 1) { r.job = `leading-tone diminished into ${name(next)}`; r.lines.push(`Every note leans onto ${name(next)}; it has the notes of ${nn(T.transposeSemis(next.root, -5))}7♭9 without the root, so it works as a dominant.`); }
    else if (toNext === 0) { r.job = `common-tone diminished, decorating ${name(next)}`; r.lines.push(`It keeps ${nn(next.root)} and moves the other voices a step away and back.`); }
    else r.job = 'passing diminished';
    r.over = modeName(c.root, 'diminished-wh');
  } else if (['aug', '7#5', 'maj7#5'].includes(c.quality)) {
    r.job = 'augmented: a raised 5th pushing upward';
    r.lines.push(`The ♯5 (${T.noteName(T.transpose(c.root, '#5'), true)}) wants to rise a half step.`);
    r.over = c.quality === 'maj7#5' ? modeName(c.root, 'lydian-augmented') : modeName(c.root, 'whole-tone');
  } else if (isDom(c.quality) && next && toNext === 5 && !(semis(iv) === 7 && pcOf(next.root) === pcOf(tonic))) {
    const minorTarget = H.isMinorish(next.quality);
    r.job = `secondary dominant: V7 of ${name(next)}`;
    r.lines.push(`Its 3rd (${T.noteName(T.transpose(c.root, '3'), true)}) is the leading tone of ${nn(next.root)}, borrowed for a moment from ${nn(next.root)}’s own key.`);
    r.over = modeName(c.root, minorTarget ? 'mixolydian-b6' : 'mixolydian') + (minorTarget ? ' (its ♭13 fits a minor target)' : '');
  } else if (isDom(c.quality) && next && toNext === 11) {
    const v = T.transposeSemis(c.root, 6);
    r.job = `tritone sub: stands in for ${nn(v)}7`;
    r.lines.push(`${name(c)} and ${nn(v)}7 share the same 3rd and 7th (swapped), so it does the same job, and the bass slides down a half step into ${name(next)}.`);
    r.over = modeName(c.root, 'lydian-dominant');
  } else {
    // borrowed from a parallel mode
    let src = [];
    try { src = sourcesOf({ iv, q: c.quality }, minor); } catch (e) { src = []; }
    if (src.length) {
      const s = src[0];
      const sid = CS2T[s.src] || s.src;
      r.job = `borrowed from ${nn(tonic)} ${scaleName(sid).replace(/ \(.*\)$/, '')} (same tonic, another mode)`;
      r.lines.push(`${modeName(tonic, sid)}: same tonic as ${keyName}, different notes.`);
      if (src.length > 1) r.lines.push(`Also found in ${src.slice(1).map((x) => `${nn(tonic)} ${scaleName(CS2T[x.src] || x.src).replace(/ \(.*\)$/, '')}`).join(' and ')}.`);
      if (s.over && CS2T[s.over]) r.over = modeName(c.root, CS2T[s.over]);
    } else if (isDom(c.quality)) { r.job = 'a dominant from outside the key'; r.over = modeName(c.root, 'mixolydian'); }
    else r.job = 'chromatic';
  }
  const res = resolution(c, next);
  if (res) r.lines.push(`Into ${name(next)}: ${res}`);
  return r;
}

// ---------- the panel ----------
// chords: [{root, quality, rn?}] in order; hits: indexes to explain in full (default: every chord outside the key)
export function panel(chords, tonic, minor, { shape = 'A', hits = null } = {}) {
  const { grips, how } = voice(chords, tonic, shape);
  const uniq = [], seen = new Set();
  chords.forEach((c, i) => { if (!grips[i]) return; const k = name(c) + ':' + grips[i].notes.map((n) => n.fret).join(); if (seen.has(k)) return; seen.add(k); uniq.push({ notes: grips[i].notes, cap: `${name(c)} · ${c.rn || H.numeral(H.ivFrom(tonic, c.root), c.quality)}`, q: c.quality, set: grips[i].notes.map((n) => n.string) }); });
  const tops = grips.map(top).filter(Boolean).map((n) => T.noteName(n.note, true));
  const topLine = tops.filter((x, i) => i === 0 || x !== tops[i - 1]).join(' – ');
  const play = JSON.stringify(grips.map((g) => (g ? g.notes.map((n) => n.midi).sort((a, b) => a - b) : [])));
  const an = chords.map((c, i) => analyse(c, chords[i + 1] || chords[0], tonic, minor));
  const full = new Set(hits || an.map((a, i) => (a.outside ? i : -1)).filter((i) => i >= 0));
  // each chord explained once, where it first appears (a picked-out chord wherever it is)
  const shown = new Set();
  const once = an.map((a, i) => { const k = a.name + a.rn; if (shown.has(k) && !full.has(i)) return false; shown.add(k); return true; });
  return `<div class="info"><div class="k">On the neck</div><p class="note">${esc(how)}.</p>
      ${diagrams(uniq)}
      <p><b>Top line:</b> ${esc(topLine)}. ${chords.length > 2 ? 'Let it sing over the changes.' : ''}</p>
      <div class="row"><button class="ghost" data-prog='${play}'>▶ Hear these voicings</button></div></div>
    <div class="info"><div class="k">Chord by chord</div>
      ${an.map((a, i) => !once[i] ? '' : `<div class="cbc ${full.has(i) ? 'hl' : ''}"><b>${esc(a.name)} · ${esc(a.rn)}</b>${a.type ? ` <span class="tn" style="display:inline">${esc(a.type)}</span>` : ''}
        ${a.job ? `<p><b>Job:</b> ${esc(a.job)}.</p>` : ''}
        ${full.has(i) ? a.lines.map((l) => `<p>${esc(l)}</p>`).join('') : ''}
        ${a.over ? `<p><b>Play over it:</b> ${esc(a.over)}.</p>` : ''}</div>`).join('')}
    </div>`;
}
