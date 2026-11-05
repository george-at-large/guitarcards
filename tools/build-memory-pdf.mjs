#!/usr/bin/env node
// Builds the printed companion to the Memory pack: guide/memory-essentials.html -> guide/memory-essentials.pdf
// (headless Chrome, A4). Facts, tables and all 12 keys; no fretboard diagrams (those live in guitar-mastery.pdf).
// Every note name is produced by the Memory pack engine (src/memory/engine.js) and the superimposition table
// (src/superimpose.js), so spellings match the app card for card (E♯ in F♯ major, C♭ in D♭7, …).
//
//   node tools/build-memory-pdf.mjs          build HTML + PDF (repeated passes so the contents page gets page numbers)
//   node tools/build-memory-pdf.mjs --html   build the HTML only
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

globalThis.window ??= globalThis;
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const imp = (p) => import(pathToFileURL(path.join(ROOT, p)).href);
const E = await imp('src/memory/engine.js');
const { UNITS, MODULES } = await imp('src/memory/cards.js');
const SI = await imp('src/superimpose.js');

const OUT_DIR = path.join(ROOT, 'guide');
const HTML = path.join(OUT_DIR, 'memory-essentials.html');
const PDF = path.join(OUT_DIR, 'memory-essentials.pdf');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const ACC = '#0f766e';

// ---------------------------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------------------------
const { N, nm, up, down } = E;
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const inl = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\*(.+?)\*/g, '<i>$1</i>');
const assert = (c, msg) => { if (!c) throw new Error('Memory PDF check failed: ' + msg); };
const pf = (f) => f.split(' ').map(E.prettyDeg).join(' ');
const list = (ns, sep = ' ') => ns.map(nm).join(sep);
const isDbl = (n) => Math.abs(n.acc) > 1;
// simplest spelling of a pitch class, for enharmonic hints next to double-accidental roots
const COMMON = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
const SPELLINGS = [['C'], ['C#', 'Db'], ['D'], ['Eb', 'D#'], ['E'], ['F'], ['F#', 'Gb'], ['G'], ['Ab', 'G#'], ['A'], ['Bb', 'A#'], ['B']];
const simple = (n) => N(COMMON[E.pc(n)]);
const CIRCLE_PCS = [0, 7, 2, 9, 4, 11, 6, 1, 8, 3, 10, 5];
// rows that show both spellings of the ambiguous black keys
const ROOTS14 = ['C', 'C#', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'].map(N);
// chord label: the engine spelling, with the plain enharmonic beside it when the root has a double accidental
const chord = (root, q) => isDbl(root) ? `${E.csym(root, q)}<span class="enh"> = ${E.csym(simple(root), q)}</span>` : E.csym(root, q);
const sigLabel = (k) => { const s = E.SIG[k]; return s === 0 ? '—' : s > 0 ? `${s}♯` : `${-s}♭`; };
const sigOf = (notes) => { const c = E.accCount(notes); return c === 0 ? '—' : `${c}${notes.some((x) => x.acc > 0) ? '♯' : '♭'}`; };

const table = (head, rows, cls = '') => `<table class="${cls}"><thead><tr>${head.map((h) => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${c ?? ''}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
const h3 = (s) => `<h3>${s}</h3>`;
const h4 = (s) => `<h4>${s}</h4>`;
const p = (s, cls = '') => `<p class="${cls}">${inl(s)}</p>`;
const ul = (items, cls = '') => `<ul class="${cls}">${items.map((i) => `<li>${inl(i)}</li>`).join('')}</ul>`;
const two = (a, b) => `<div class="two"><div>${a}</div><div>${b}</div></div>`;
const keep = (s) => `<div class="keep">${s}</div>`;
const callout = (s) => `<div class="callout">${s}</div>`;
const hl = (s) => `<span class="hl">${s}</span>`;

// the unit explainers from cards.js, as prose (tables are dropped: this PDF replaces them with 12-key versions)
const UNIT = Object.fromEntries(UNITS.map((u) => [u.id, u]));
function mdProse(src, { skip = [], seen = null } = {}) {
  const out = [];
  const push = (h) => { if (seen) { if (seen.has(h)) return; seen.add(h); } out.push(h); };
  let para = [], li = null, ol = null;
  const flush = () => {
    if (para.length) push(`<p>${inl(para.join(' '))}</p>`);
    if (li) push(`<ul>${li.map((x) => `<li>${inl(x)}</li>`).join('')}</ul>`);
    if (ol) push(`<ol>${ol.map((x) => `<li>${inl(x)}</li>`).join('')}</ol>`);
    para = []; li = null; ol = null;
  };
  for (const raw of src.split('\n')) {
    const line = raw.trim();
    if (!line) { flush(); continue; }
    if (line.startsWith('|')) { flush(); continue; }
    if (skip.some((s) => line.startsWith(s))) { flush(); continue; }
    let m;
    if ((m = /^#{1,4} (.*)$/.exec(line))) { flush(); push(`<h4>${inl(m[1])}</h4>`); continue; }
    if ((m = /^- (.*)$/.exec(line))) { if (para.length || ol) flush(); (li ??= []).push(m[1]); continue; }
    if ((m = /^\d+\. (.*)$/.exec(line))) { if (para.length || li) flush(); (ol ??= []).push(m[1]); continue; }
    if (li || ol) flush();
    para.push(line);
  }
  flush();
  return `<div class="prose">${out.join('')}</div>`;
}
const explain = (id, opts) => mdProse(UNIT[id].md, opts);
const ruleBox = (id) => `<div class="rule"><span class="rid">${id} rule</span> ${inl(UNIT[id].rule)}</div>`;

// sections
const SECTIONS = [];
function section(part, id, num, title, body, { lead = '', flow = false } = {}) {
  SECTIONS.push({ part, id, num, title, html: `<section class="sec${flow ? ' flow' : ''}" id="${id}"><div class="partband">${esc(part)}</div><h2>${num ? `<span class="num">${num}</span>` : ''}${title}</h2>${lead ? `<p class="lead">${inl(lead)}</p>` : ''}${body}</section>` });
}
const PART = Object.fromEntries(MODULES.map((m) => [m.id, `${m.id} · ${m.name}`]));

// ---------------------------------------------------------------------------------------------
// FRONT — the rules that generate everything
// ---------------------------------------------------------------------------------------------
{
  const body = MODULES.map((m) => `<div class="rmod"><div class="rmh"><span>${m.id}</span>${esc(m.name)}<small>${esc(m.blurb)}</small></div>${UNITS.filter((u) => u.module === m.id).map((u) => `<div class="rl"><b>${u.id}</b><div><span class="rn">${esc(u.name)}.</span> ${inl(u.rule)}</div></div>`).join('')}</div>`).join('');
  section('Front', 'rules', '', 'Rules that generate everything', body + `<p class="note">Seventeen rules, one per unit of the Memory pack. Everything else in this booklet is one of these rules applied to all 12 keys: if a table cell is ever in doubt, rebuild it from the rule.</p>`,
    { lead: 'Learn these lines first. Each one regenerates a whole table in the pages that follow.' });
}

// ---------------------------------------------------------------------------------------------
// A · KEYS
// ---------------------------------------------------------------------------------------------
// A1 intervals
{
  const INV = { m2: 'M7', M2: 'm7', m3: 'M6', M3: 'm6', P4: 'P5', TT: 'TT', P5: 'P4', m6: 'M3', M6: 'm3', m7: 'M2', M7: 'm2' };
  const core = table(['Interval', 'Name', 'Semitones', 'Degree', 'Inverts to', 'Inverted semitones'],
    E.IV.map(([k, tok, s, long]) => [`<b>${E.ivLabel(k)}</b>`, `<span class="nw">${long}</span>`, s, E.prettyDeg(tok) + (k === 'TT' ? ' / ♭5' : k === 'm6' ? ' / ♯5' : k === 'm3' ? ' / ♯2' : ''), E.ivLabel(INV[k]), 12 - s]).concat([['<b>P8</b>', 'octave', 12, '8', 'P1', 0]]), 'center z');
  const EXT = [['♭9', 'b9', '♭2', 1], ['9', '9', '2', 2], ['♯9', '#9', '♯2 (sounds as ♭3)', 3], ['11', '11', '4', 5], ['♯11', '#11', '♯4 (sounds as ♭5)', 6], ['♭13', 'b13', '♭6 (sounds as ♯5)', 8], ['13', '13', '6', 9]];
  const ext = table(['Extension', 'Same note as', 'Semitones above root (mod 12)'], EXT.map(([a, , b, s]) => [`<b>${a}</b>`, b, s]), 'center z');
  const body = ruleBox('A1') + explain('A1')
    + two(h3('The eleven intervals') + core, h3('Extensions = 2nd, 4th, 6th an octave up') + ext + callout('<b>Hold these:</b> inversions add to <b>9</b> (M3 ↔ m6, P4 ↔ P5) and their semitones add to <b>12</b>; major ↔ minor, perfect stays perfect, the tritone stays a tritone. Extensions: <b>9 = 2, 11 = 4, 13 = 6</b>.'))
;
  section(PART.A, 'a1', 'A1', 'Intervals', body);
}

// A2 circle of fifths and key signatures, A3 relative and parallel
function circleSVG({ size = 330, title = false } = {}) {
  const c = size / 2, rO = size * 0.385, rI = size * 0.255, rS = size * 0.47;
  const maj = E.MAJOR_KEYS.map((k, i) => (i === 5 ? 'B / C♭' : i === 6 ? 'F♯ / G♭' : i === 7 ? 'D♭ / C♯' : nm(N(k))));
  const min = E.MINOR_KEYS.map((k, i) => (i === 5 ? 'G♯m / A♭m' : i === 6 ? 'D♯m / E♭m' : i === 7 ? 'B♭m / A♯m' : nm(N(k)) + 'm'));
  const sig = E.MAJOR_KEYS.map((k, i) => (i === 0 ? '0' : i === 5 ? '5♯ · 7♭' : i === 6 ? '6♯ · 6♭' : i === 7 ? '5♭ · 7♯' : sigLabel(k)));
  const pt = (r, i) => [c + r * Math.sin((i * Math.PI) / 6), c - r * Math.cos((i * Math.PI) / 6)];
  let s = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">`;
  s += `<circle cx="${c}" cy="${c}" r="${(rO + rS) / 2 - 2}" fill="none" stroke="#d9e7e5" stroke-width="1"/><circle cx="${c}" cy="${c}" r="${(rO + rI) / 2}" fill="none" stroke="#d9e7e5" stroke-width="1"/><circle cx="${c}" cy="${c}" r="${rI - size * 0.06}" fill="none" stroke="#d9e7e5" stroke-width="1"/>`;
  for (let i = 0; i < 12; i++) {
    const [x1, y1] = pt(rI - size * 0.06, i + 0.5), [x2, y2] = pt((rO + rS) / 2 - 2, i + 0.5);
    s += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#e6efee" stroke-width="1"/>`;
    const [xo, yo] = pt(rO, i), [xi, yi] = pt(rI, i), [xs, ys] = pt(rS, i);
    s += `<text x="${xo}" y="${yo + 5}" text-anchor="middle" font-size="${maj[i].length > 3 ? size * 0.04 : size * 0.055}" font-weight="700" fill="${i === 0 ? ACC : '#1b1b1b'}">${maj[i]}</text>`;
    s += `<text x="${xi}" y="${yi + 4}" text-anchor="middle" font-size="${min[i].length > 4 ? size * 0.03 : size * 0.04}" fill="#444">${min[i]}</text>`;
    s += `<text x="${xs}" y="${ys + 3}" text-anchor="middle" font-size="${size * 0.03}" fill="${ACC}">${sig[i]}</text>`;
  }
  s += `<text x="${c}" y="${c - 3}" text-anchor="middle" font-size="${size * 0.03}" fill="#666">clockwise: 5th up, +1♯</text><text x="${c}" y="${c + 9}" text-anchor="middle" font-size="${size * 0.03}" fill="#666">anticlockwise: 4th up, +1♭</text>`;
  if (title) s += '';
  return s + '</svg>';
}
{
  const KEY15 = Object.keys(E.SIG).sort((a, b) => { const x = E.SIG[a], y = E.SIG[b]; return (x < 0) - (y < 0) || Math.abs(x) - Math.abs(y); });
  const rows = KEY15.map((k) => {
    const s = E.SIG[k], sig = E.sigNotes(k), key = N(k);
    const last = sig.at(-1);
    const how = s > 0 ? `last sharp ${nm(last)} + semitone = ${nm(key)}` : s === -1 ? 'one flat: memorise F' : s < 0 ? `second-to-last flat: ${nm(sig.at(-2))}` : '—';
    const added = s > 0 ? `${nm(last)} = 7th of ${nm(key)}` : s < 0 ? `${nm(last)} = 4th of ${nm(key)}` : '—';
    return [`<b>${nm(key)}</b>`, sigLabel(k), sig.length ? list(sig) : '—', added, nm(up(key, '6')) + 'm', how];
  });
  const sigT = table(['Major key', 'Sig.', 'Accidentals, in order', 'Newest accidental', 'Rel. minor', 'Naming shortcut'], rows, 'z');
  const body = ruleBox('A2')
    + `<div class="trigrid"><div>${circleSVG()}</div><div>${explain('A2')}</div></div>`
    + h3('Key signatures: all 15 spellings') + sigT
    + two(callout('<b>Order of sharps:</b> F C G D A E B &nbsp;·&nbsp; <b>Order of flats:</b> B E A D G C F (the same backwards).'), callout('<b>Enharmonic pairs on the circle:</b> B = C♭ (5♯ / 7♭), F♯ = G♭ (6♯ / 6♭), C♯ = D♭ (7♯ / 5♭). Sharps + flats of the pair always add to 12.'));
  section(PART.A, 'a2', 'A2', 'Circle of fifths and key signatures', body);

  const relRows = E.MAJOR_KEYS.map((k) => {
    const key = N(k), rel = up(key, '6');
    let pm = key, sc = E.spell(key, 'aeolian');
    if (E.accCount(sc) > 7) { pm = E.bestRoot(E.pc(key), (r) => E.spell(r, 'aeolian')); sc = E.spell(pm, 'aeolian'); }
    return [`<b>${nm(key)}</b>`, sigLabel(k), `${nm(rel)}m`, `${nm(pm)}m${E.same(pm, key) ? '' : ' <span class="enh">(enh.)</span>'}`, sigOf(sc), nm(up(pm, 'b3')), nm(up(key, '5')), nm(up(key, '4'))];
  });
  const body3 = ruleBox('A3') + explain('A3')
    + table(['Major key', 'Sig.', 'Relative minor (6th)', 'Parallel minor (same tonic)', 'Parallel minor sig.', 'Its relative major (♭III)', 'Clockwise neighbour (5th up)', 'Anticlockwise neighbour (4th up)'], relRows, 'center z')
    + p('**Parallel minor = three more flats (or three fewer sharps)** than the major on the same tonic. Relative minor = down a minor 3rd; relative major = up a minor 3rd.', 'note')
    + h3('From the minor side') + table(['Minor key', 'Sig.', 'Relative major (♭3)', 'Parallel major (same tonic)', 'Parallel major sig.', 'Dominant (V7, harmonic minor)', 'Leading tone (raised 7th)'], E.MINOR_KEYS.map((k) => {
      const key = N(k), rel = up(key, 'b3');
      let pM = key, sc = E.spell(key, 'ionian');
      if (E.accCount(sc) > 7) { pM = E.bestRoot(E.pc(key), (r) => E.spell(r, 'ionian')); sc = E.spell(pM, 'ionian'); }
      return [`<b>${nm(key)}m</b>`, sigOf(E.spell(key, 'aeolian')), nm(rel), `${nm(pM)}${E.same(pM, key) ? '' : ' <span class="enh">(enh.)</span>'}`, sigOf(sc), E.csym(up(key, '5'), '7'), nm(up(key, '7'))];
    }), 'center z');
  section(PART.A, 'a3', 'A3', 'Relative and parallel keys', body3);
}

// A4 every note in every key
{
  const majRows = E.MAJOR_KEYS.map((k) => {
    const key = N(k), sc = E.spell(key, 'ionian'), sig = E.sigNotes(k), newest = sig.at(-1);
    return [`<b>${nm(key)}</b>`, sigLabel(k), ...sc.map((x) => (newest && E.same(x, newest) ? hl(nm(x)) : nm(x)))];
  });
  const DEG = (id) => E.MODE[id].f.split(' ').map((t) => E.prettyDeg(t));
  const minTable = (id, mark) => table(['Tonic', 'Rel. major', ...DEG(id)], E.MINOR_KEYS.map((k) => {
    const key = N(k), sc = E.spell(key, id), nat = E.spell(key, 'aeolian');
    return [`<b>${nm(key)}</b>`, nm(up(key, 'b3')), ...sc.map((x, i) => (mark && !E.same(x, nat[i]) ? hl(nm(x)) : nm(x)))];
  }), 'center z keys');
  const body = ruleBox('A4') + explain('A4')
    + two(keep(h3('Major keys (circle order)') + table(['Key', 'Sig.', ...DEG('ionian')], majRows, 'center z keys') + p('Highlighted: the accidental this key adds to its neighbour (a new sharp is the 7th; a new flat is the 4th).', 'note')),
      keep(h3('Natural minor (relative major from its 6th)') + minTable('aeolian', false)))
    + two(keep(h3('Harmonic minor (natural minor, 7th raised)') + minTable('harmonic-minor', true) + p('Highlighted: the raised 7th, the leading tone that gives minor its V7.', 'note')),
      keep(h3('Melodic minor, jazz form (major with ♭3)') + minTable('melodic-minor', true) + p('Highlighted: the raised 6th and 7th compared with natural minor.', 'note')));
  section(PART.A, 'a4', 'A4', 'Every note in every key', body);
}

// A5 degree triangle
{
  const head = (tri) => tri.map((t) => `${E.romanQ(t)}<small>${E.MODE[t.mode].name}</small>`);
  const majT = table(['Key', ...head(E.MAJ_TRI)], E.MAJOR_KEYS.map((k) => [`<b>${nm(N(k))}</b>`, ...E.MAJ_TRI.map((t) => chord(up(N(k), t.d), t.q))]), 'center z tri');
  const minT = table(['Key', ...head(E.MIN_TRI)], E.MINOR_KEYS.map((k) => [`<b>${nm(N(k))}m</b>`, ...E.MIN_TRI.map((t) => chord(up(N(k), t.d), t.q))]), 'center z tri');
  // where a chord lives (reverse lookup)
  const live = CIRCLE_PCS.map((pcN) => {
    const mk = (degs) => E.bestRoot(pcN, (r) => degs.map((d) => down(r, d)));
    const cell = (q, degs) => { const r = mk(degs); return `<b>${E.csym(r, q)}</b>: ${degs.map((d) => nm(down(r, d))).join(' · ')}`; };
    return [cell('m7', ['2', '3', '6']), cell('maj7', ['1', '4']), cell('7', ['5']), cell('m7b5', ['7'])];
  });
  const liveT = table(['m7 is ii · iii · vi of…', 'maj7 is I · IV of…', '7 is V of…', 'm7♭5 is vii of…'], live, 'z');
  const famTri = (fam) => {
    const ms = E.MODES.filter((m) => m.fam === fam), toks = E.MODE[ms[0].id].f.split(' ');
    const roman = (tok, q) => { const { d, acc } = E.parseDeg(tok); const R = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'][d - 1]; return (acc < 0 ? '♭' : acc > 0 ? '♯' : '') + (['m7', 'm7b5', 'mMaj7', 'dim7'].includes(q) ? R.toLowerCase() : R); };
    return table(['Key', ...ms.map((m, i) => `${roman(toks[i], m.chord)}${{ mMaj7: '(maj7)', m7: '7', m7b5: 'ø7', dim7: '°7' }[m.chord] ?? E.CHORD[m.chord].sym}<small>${m.name}</small>`)],
      E.MINOR_KEYS.map((k) => { const sc = E.spell(N(k), ms[0].id); return [`<b>${nm(N(k))}m</b>`, ...ms.map((m, i) => chord(sc[i], m.chord))]; }), 'center z tri');
  };
  const body = ruleBox('A5') + explain('A5')
    + keep(h3('Major keys: the seven 7th chords and their modes') + majT)
    + keep(h3('Natural minor keys: i · iiø7 · ♭III · iv · v · ♭VI · ♭VII7') + minT)
    + keep(h3('Harmonic minor keys: where the V7 and vii°7 come from') + famTri('harmonic'))
    + keep(h3('Melodic minor keys: the jazz-minor chords') + famTri('melodic'))
    + keep(h3('Where a chord lives: the major keys that contain it') + p('Go down from the chord root by its degree: ii → a step down, iii → a major 3rd down, IV → a 4th down, V → a 5th down, vi → a major 6th down, vii → a semitone up. A minor 7 lives in three keys, a maj7 in two, a dominant 7 and a m7♭5 in one.', 'note') + liveT);
  section(PART.A, 'a5', 'A5', 'The degree triangle in all 24 keys', body);
}

// ---------------------------------------------------------------------------------------------
// B · SCALES AND MODES
// ---------------------------------------------------------------------------------------------
const FAMF = { harmonic: E.MODE['harmonic-minor'].f.split(' '), melodic: E.MODE['melodic-minor'].f.split(' ') };
// one mode spelled on all 12 roots (simplest root spelling, circle order), characteristic note highlighted
function modeGrid(id) {
  const m = E.MODE[id], toks = m.f.split(' ');
  let mark = [];
  if (m.fam === 'major') mark = toks.map((t, i) => (E.prettyDeg(t) === m.change ? i : -1)).filter((i) => i >= 0);
  else if (m.twin) { const tw = E.MODE[m.twin].f.split(' '); mark = toks.map((t, i) => (t !== tw[i] ? i : -1)).filter((i) => i >= 0); }
  const parentHead = m.fam === 'major' ? 'Parent major' : m.fam === 'harmonic' ? 'Parent harm. min.' : 'Parent mel. min.';
  const rows = [];
  for (const pcN of CIRCLE_PCS) {
    const root = E.bestRoot(pcN, (r) => E.spell(r, id));
    assert(root, `no spelling for ${id} on pc ${pcN}`);
    const notes = E.spell(root, id);
    const par = m.fam === 'major' ? E.parentOf(root, id) : down(root, FAMF[m.fam][m.i - 1]);
    rows.push([`<b>${nm(root)}</b>`, ...notes.map((x, i) => (mark.includes(i) ? hl(nm(x)) : nm(x))), E.csym(root, m.chord), nm(par)]);
  }
  const sub = m.fam === 'major' ? (m.change === '—' ? 'the major scale' : `major with ${m.change}`) + ` · parent ${E.PARENT[id][1]}` : `${E.MODE[m.twin].name}, ${m.how}`;
  return keep(`<div class="gt"><b>${m.name}</b> <span>${sub}</span></div>` + table(['Root', ...toks.map((t, i) => (mark.includes(i) ? `<span class="hh">${E.prettyDeg(t)}</span>` : E.prettyDeg(t))), '7th chord', parentHead], rows, 'center z mg'));
}
const pairs = (items) => { let s = ''; for (let i = 0; i < items.length; i += 2) s += two(items[i], items[i + 1] || ''); return s; };

// B1 brightness ladder
{
  const ladder = table(['#', 'Mode', 'Formula', 'Changed note', '7th chord', 'Colour', 'Degree of major', 'Parent major'], E.BRIGHT.map((id, i) => {
    const m = E.MODE[id];
    return [i + 1, `<b>${m.name}</b>`, pf(m.f), m.change, E.CHORD[m.chord].sym, m.colour, E.MAJ_TRI[m.i - 1].r, E.PARENT[id][1]];
  }), 'z');
  const body = ruleBox('B1') + explain('B1') + keep(h3('The ladder, brightest to darkest') + ladder)
    + h3('All seven major modes on all 12 roots') + p('Rows in circle order; each root spelled with the fewest accidentals. Highlighted column: the note that mode changes on the ladder. Last column: the major scale with the same notes.', 'note')
    + pairs(E.BRIGHT.map(modeGrid))
    + keep(h3('Contrast pairs: the note that separates them') + table(['Pair', 'Differs at', 'First', 'Second'], [
      ...E.BRIGHT.slice(0, -1).map((id, i) => [id, E.BRIGHT[i + 1]]),
      ['dorian', 'melodic-minor'], ['aeolian', 'harmonic-minor'], ['mixolydian', 'lydian-dominant'], ['phrygian', 'phrygian-dominant'], ['locrian', 'locrian-nat2'], ['mixolydian', 'mixolydian-b6'], ['phrygian', 'dorian-b2'], ['locrian', 'altered'],
    ].map(([a, b]) => { const fa = E.MODE[a].f.split(' '), fb = E.MODE[b].f.split(' '); const d = fa.map((t, i) => (t !== fb[i] ? `${E.prettyDeg(t)} vs ${E.prettyDeg(fb[i])}` : null)).filter(Boolean); return [`<b>${E.MODE[a].name}</b> vs <b>${E.MODE[b].name}</b>`, d.join(', '), pf(E.MODE[a].f), pf(E.MODE[b].f)]; }), 'z'));
  section(PART.B, 'b1', 'B1', 'Major modes: the brightness ladder', body);
}
// B2 / B3 harmonic and melodic minor modes
function famTable(fam) {
  return table(['#', 'Mode', 'Twin + change', 'Formula', '7th chord', 'Colour', 'Use'], E.MODES.filter((m) => m.fam === fam).map((m) => [m.i, `<b>${m.name}</b>`, m.alias || `${E.MODE[m.twin].name}, ${m.how}`, pf(m.f), E.CHORD[m.chord].sym, m.colour, m.use]), 'z');
}
{
  const ids = E.MODES.filter((m) => m.fam === 'harmonic').map((m) => m.id);
  const body = ruleBox('B2') + explain('B2') + keep(h3('The seven modes') + famTable('harmonic'))
    + h3('Every harmonic-minor mode on all 12 roots') + p('Highlighted: the note(s) that differ from the twin major mode. Last column: the harmonic minor that contains it.', 'note') + pairs(ids.map(modeGrid));
  section(PART.B, 'b2', 'B2', 'Harmonic minor modes', body);
}
{
  const ids = E.MODES.filter((m) => m.fam === 'melodic').map((m) => m.id);
  const body = ruleBox('B3') + explain('B3') + keep(h3('The seven modes') + famTable('melodic'))
    + h3('Every melodic-minor mode on all 12 roots') + p('Highlighted: the note that differs from the twin major mode. Altered is spelled as a scale (♭4); over the chord read the ♭4 as the 3rd.', 'note') + pairs(ids.map(modeGrid));
  section(PART.B, 'b3', 'B3', 'Melodic minor modes', body);
}
// B4 symmetric scales
{
  const sym = E.MODES.filter((m) => m.fam === 'symmetric');
  const symT = table(['Scale', 'Steps', 'Formula', 'Over', 'Versions', 'Shortcut'], sym.map((m) => [`<b class="nw">${m.name}</b>`, `<span class="nw">${m.steps}</span>`, `<span class="nw">${pf(m.f)}</span>`, `<span class="nw">${m.over}</span>`, m.versions, m.shortcut]), 'z');
  const groups = (id, n) => {
    const rows = [];
    for (let g = 0; g < n; g++) {
      const pcs = Array.from({ length: 12 / n }, (_, j) => (g + j * n) % 12);
      pcs.forEach((pcN, j) => {
        const r = E.bestRoot(pcN, (x) => E.spell(x, id));
        rows.push([j === 0 ? `<b>${g + 1}</b>` : '', `<b>${nm(r)}</b>`, list(E.spell(r, id)), E.csym(r, E.MODE[id].chord)]);
      });
    }
    return rows;
  };
  const hw = table(['Set', 'Root', 'Notes', 'Fits'], groups('half-whole', 3), 'z sym');
  const wh = table(['Set', 'Root', 'Notes', 'Fits'], groups('whole-half', 3), 'z sym');
  const wt = table(['Set', 'Root', 'Notes', 'Fits'], groups('whole-tone', 2), 'z sym');
  const body = ruleBox('B4') + explain('B4') + keep(symT)
    + two(keep(h3('Half-whole diminished: 3 sets of 4 dominants') + hw), keep(h3('Whole-half diminished: 3 sets of 4 dim7 chords') + wh))
    + keep(h3('Whole tone: 2 sets of 6') + wt)
    + callout(`<b>Set membership is the memory fact.</b> ${[0, 1, 2].map((g) => `Half-whole set ${g + 1} = ${[0, 3, 6, 9].map((j) => nm(E.bestRoot((g + j) % 12, (x) => E.spell(x, 'half-whole')))).join(', ')} dominants`).join('; ')}. Whole-half on a note = half-whole a semitone lower. Whole-tone set 1 = ${list(E.spell(N('C'), 'whole-tone'))}; set 2 = ${list(E.spell(N('Db'), 'whole-tone'))}.`);
  section(PART.B, 'b4', 'B4', 'Symmetric scales', body);
}
// B5 parent shortcuts on 12 roots
{
  const SHORT = [
    { head: 'X7alt<small>altered = mel. minor ½ step up</small>', mode: 'altered', tok: 'b2', fam: 'mel. minor', q: '7alt' },
    { head: 'X7♯11<small>Lydian dom. = mel. minor 5th up</small>', mode: 'lydian-dominant', tok: '5', fam: 'mel. minor', q: '7' },
    { head: 'Xm7♭5<small>Locrian ♮2 = mel. minor m3 up</small>', mode: 'locrian-nat2', tok: 'b3', fam: 'mel. minor', q: 'm7b5' },
    { head: 'X7♭9 (to minor)<small>Phryg. dom. = harm. minor 4th up</small>', mode: 'phrygian-dominant', tok: '4', fam: 'harm. minor', q: '7' },
    { head: 'X7♭13<small>Mixolydian ♭6 = mel. minor 4th up</small>', mode: 'mixolydian-b6', tok: '4', fam: 'mel. minor', q: '7' },
    { head: 'Xm7 (Dorian)<small>major a whole step down</small>', mode: 'dorian', tok: null, fam: 'major', q: 'm7' },
  ];
  // sanity: the shortcut intervals agree with the mode's position in its family
  for (const s of SHORT.filter((x) => x.tok)) { const m = E.MODE[s.mode]; const f = FAMF[m.fam]; const r = N('G'); assert(E.same(up(r, s.tok), down(r, f[m.i - 1])), `shortcut ${s.mode}`); }
  const ex = SHORT.map((s) => {
    const r = N(s.mode === 'altered' ? 'G' : s.mode === 'lydian-dominant' ? 'D' : s.mode === 'locrian-nat2' ? 'F#' : s.mode === 'phrygian-dominant' ? 'E' : s.mode === 'mixolydian-b6' ? 'E' : 'D');
    const par = s.tok ? up(r, s.tok) : E.parentOf(r, s.mode);
    return [`<b>${s.head.replace(/<small>.*$/, '')}</b>`, E.MODE[s.mode].name, s.head.replace(/^.*<small>(.*)<\/small>$/, '$1').replace(/^[^=]*= /, ''), `${E.csym(r, s.q)} → ${nm(par)} ${s.fam === 'major' ? 'major' : s.fam}: ${list(E.spell(par, s.fam === 'major' ? 'ionian' : s.fam === 'mel. minor' ? 'melodic-minor' : 'harmonic-minor'))}`, `${nm(r)} ${E.MODE[s.mode].name}: ${list(E.spell(r, s.mode))}`];
  });
  const body = p('The fastest way to spell a melodic- or harmonic-minor mode is to jump to its parent scale and read it from your root. These are the jumps worth knowing cold; the mode tables in B1–B3 show every root.', 'lead')
    + table(['Chord', 'Mode', 'Parent jump', 'Example', 'Read from the root'], ex, 'z ps')
    + two(callout('<b>The four to know cold:</b> X7alt → melodic minor a <b>semitone up</b>. X7♯11 → melodic minor a <b>5th up</b>. Xm7♭5 → melodic minor a <b>minor 3rd up</b>. X Phrygian dominant → harmonic minor a <b>4th up</b>.'),
      (() => { const r = N('Ab'); return callout(`<b>One scale, four chords:</b> each melodic minor covers its own m6/mMaj7, the m7♭5 a major 6th up, the 7♯11 a 4th up and the 7alt a major 7th up. ${nm(r)} melodic minor = ${E.csym(r, 'mMaj7')} = ${E.csym(up(r, '6'), 'm7b5')} = ${E.csym(up(r, '4'), '7')}♯11 = ${E.csym(up(r, '7'), '7alt')}.`); })())
    + h3('Major-mode parents (from B1)') + table(['Mode', 'Parent', 'Example'], E.BRIGHT.filter((id) => id !== 'ionian').map((id) => { const r = E.bestRoot(5, (x) => E.spell(x, id)); return [`<b>${E.MODE[id].name}</b>`, E.PARENT[id][1], `${nm(r)} ${E.MODE[id].name} = ${nm(E.parentOf(r, id))} major from ${nm(r)}`]; }), 'z');
  section(PART.B, 'b5', 'B5', 'Parent shortcuts', body);
}
// B6 chord -> scale cheat sheet
{
  const R = [
    ['maj7, maj9, 6, 6/9', 'I (tonic major)', 'Ionian', 'Major pentatonic; Lydian for a brighter tonic', 'The 4th (11) is the avoid note over maj7'],
    ['maj7♯11, maj7 on IV', 'IV, ♭VI, ♭II, ♭III', 'Lydian', 'II triad / II major pentatonic on top', 'Parent: major a 4th down'],
    ['maj7♯5', 'Augmented colour', 'Lydian augmented', 'Ionian ♯5 (harmonic minor mode 3)', 'Parent: melodic minor a minor 3rd down'],
    ['m7, m9, m11', 'ii', 'Dorian', 'ii minor pentatonic (Dorian pentatonic)', '♮13 is the Dorian colour'],
    ['m7', 'vi, or i in natural minor', 'Aeolian', 'Dorian for a brighter minor', '♭13 is the Aeolian colour'],
    ['m7', 'iii', 'Phrygian', 'Aeolian if the melody has a ♮9', '♭9 is a colour note, not an avoid note in modal use'],
    ['m6, m6/9, mMaj7', 'Tonic minor (jazz)', 'Melodic minor', 'Dorian', 'V triad on top gives m(maj9)'],
    ['mMaj7 (dark)', 'Tonic minor (classical)', 'Harmonic minor', 'Melodic minor', 'The ♭6–7 augmented 2nd is the sound'],
    ['m7♭5', 'iiø7 in minor', 'Locrian ♮2', 'Locrian; Locrian ♮6', 'Locrian ♮2 = mel. minor a m3 up'],
    ['°7', 'vii°7, passing diminished', 'Whole-half diminished', 'Ultralocrian (inside a harmonic-minor key)', 'Any note of a dim7 can be the root'],
    ['7, 9, 13', 'V (unaltered), blues', 'Mixolydian', 'v minor pentatonic for 9sus4', '11 is the avoid note unless sus'],
    ['7sus4, 9sus4', 'Suspended V', 'Mixolydian', 'Dorian ♭2 for 7sus♭9', 'The 4th replaces the 3rd'],
    ['7♯11, 9♯11, 13♯11', 'IV7, ♭VII7, subV7, II7', 'Lydian dominant', 'II triad on top', 'Mel. minor a 5th up'],
    ['7♭9, 7♭9♭13', 'V into a minor chord', 'Phrygian dominant', 'Altered', 'Harm. minor a 4th up (the key you resolve to)'],
    ['7♭13, 9♭13', 'Gentle V in minor', 'Mixolydian ♭6', 'Phrygian dominant', 'Mel. minor a 4th up'],
    ['13♭9, 7♭9 (♮13)', 'V into major, bright tension', 'Half-whole diminished', 'VI triad on top', 'Has ♮5 and ♮13; repeats every minor 3rd'],
    ['7alt, 7♯9♭13, 7♭9♯9', 'V into major or minor, max tension', 'Altered', '♭iii minor pentatonic; ♭VI or ♭V triads', 'Mel. minor a semitone up; no ♮5'],
    ['7♯5, 9♯5', 'Augmented dominant', 'Whole tone', 'Altered', 'No perfect 5th; repeats every whole step'],
  ];
  const body = p('First choice = the scale that names the chord’s own colour without an avoid note. When a chord has more than one job, the job decides the scale.', 'lead')
    + table(['Chord', 'Typical job', 'First choice', 'Also good', 'Remember'], R.map((r) => [`<b>${r[0]}</b>`, r[1], `<b>${r[2]}</b>`, r[3], r[4]]), 'z cs')
    + callout('<b>Dominant decision tree:</b> resolving to major and want it inside → Mixolydian. Bright tension → half-whole (13♭9). Maximum tension → altered. Resolving to minor → Phrygian dominant (♭9 ♭13) or altered. Not resolving down a 5th (IV7, ♭VII7, subV) → Lydian dominant.');
  section(PART.B, 'b6', 'B6', 'Chord → scale cheat sheet', body.replace('Parent: melodic minor a minor 3rd down', 'Parent: melodic minor a minor 3rd down'));
}

// ---------------------------------------------------------------------------------------------
// C · FUNCTIONAL HARMONY
// ---------------------------------------------------------------------------------------------
const outOf = (root, q, scale) => E.CHORD[q].f.slice(0, 4).map((t) => up(root, t)).filter((x) => !scale.some((y) => E.same(x, y)));
{
  const head = E.SECONDARY.map((s) => `V7/${s.target}<small>(${s.short})</small>`);
  const rows = E.MAJOR_KEYS.map((k) => {
    const key = N(k), sc = E.spell(key, 'ionian');
    return [`<b>${nm(key)}</b>`, ...E.SECONDARY.map((s) => {
      const tgt = up(key, s.td), dom = up(tgt, '5');
      const outs = outOf(dom, '7', sc);
      const lead = up(dom, s.out);
      assert(outs.some((x) => E.same(x, lead)), `secondary out-of-key ${k} ${s.target}`);
      const extra = outs.filter((x) => !E.same(x, lead));
      const ii = up(tgt, '2'), iiq = s.tq === 'm7' ? 'm7b5' : 'm7';
      return `<b>${chord(dom, '7')}</b> <span class="oo">${nm(lead)}</span>${extra.length ? ` <span class="enh">+${list(extra)}</span>` : ''}<br><small>${E.csym(ii, iiq)}–${E.csym(dom, '7')}–${E.csym(tgt, s.tq)}</small>`;
    })];
  });
  const minRows = E.MINOR_KEYS.map((k) => {
    const key = N(k), sc = E.spell(key, 'aeolian');
    return [`<b>${nm(key)}m</b>`, ...E.SECONDARY_MINOR.map((s) => { const tgt = up(key, s.td), dom = up(tgt, '5'); const o = outOf(dom, '7', sc); return `<b>${chord(dom, '7')}</b> <span class="oo">${o.map(nm).join(' ') || '—'}</span>`; }),
      (() => { const v = up(key, '5'); const o = outOf(v, '7', sc); return `<b>${E.csym(v, '7')}</b> <span class="oo">${o.map(nm).join(' ')}</span>`; })()];
  });
  const body = ruleBox('C1') + explain('C1')
    + keep(h3('Secondary dominants in all 12 major keys') + p('Each cell: the secondary dominant, its characteristic out-of-key note (accent: the leading tone of the target, or the ♭7 for V7/IV), any other out-of-key note (grey), and the ii–V into the target.', 'note') + table(['Key', ...head], rows, 'center z sd'))
    + keep(h3('Minor keys') + table(['Key', ...E.SECONDARY_MINOR.map((s) => `V7/${s.target}`), 'V7 (harmonic minor)'], minRows, 'center z'));
  section(PART.C, 'c1', 'C1', 'Secondary dominants', body);
}
{
  const pairsT = table(['Dominant', 'Guide tones (3, ♭7)', 'Tritone sub', 'Guide tones (3, ♭7)', 'Both resolve to'], ['C', 'G', 'D', 'A', 'E', 'B'].map((r0) => {
    const r = N(r0), s = E.tritoneSub(r), g = E.guideTones(r, '7'), h = E.guideTones(s, '7');
    assert(E.pc(g[0]) === E.pc(h[1]) && E.pc(g[1]) === E.pc(h[0]), 'tritone guide tones swap');
    return [`<b>${E.csym(r, '7')}</b>`, list(g, ', '), `<b>${E.csym(s, '7')}</b>`, list(h, ', '), `${nm(up(r, '4'))} <span class="enh">(down a 5th / down a semitone)</span>`];
  }), 'center z');
  // subV of each secondary dominant: the dominant a semitone above the target
  const targets = [...E.SECONDARY.map((s) => [s.target, s.td]), ['I', '1']];
  const rows = E.MAJOR_KEYS.map((k) => {
    const key = N(k);
    return [`<b>${nm(key)}</b>`, ...targets.map(([, td]) => {
      const tgt = up(key, td), sub = up(tgt, 'b2'), v = up(tgt, '5');
      assert(E.pc(sub) === E.pc(E.tritoneSub(v)), 'subV is a tritone from V');
      return `<b>${chord(sub, '7')}</b><br><small>for ${E.csym(v, '7')}</small>`;
    })];
  });
  const body = ruleBox('C2') + explain('C2')
    + keep(h3('The six tritone pairs') + pairsT)
    + keep(h3('subV7 of every target in all 12 major keys') + p('The tritone sub of V7/x is the dominant a semitone above x. Last column: subV7 of I (♭II7), the substitute for the main V7.', 'note')
      + table(['Key', ...targets.map(([t]) => `subV7/${t}`)], rows, 'center z sd'));
  section(PART.C, 'c2', 'C2', 'Tritone substitution', body);
}
{
  const BM = E.BORROW_MAJOR;
  const legend = table(['Borrowed chord', 'Source (parallel)', 'Typical move'], BM.map((b) => [`<b>${b.r}</b>${b.name ? ` <span class="enh">(${b.name})</span>` : ''}`, b.src, b.move]), 'z');
  const rows = E.MAJOR_KEYS.map((k) => [`<b>${nm(N(k))}</b>`, ...BM.map((b) => chord(up(N(k), b.d), b.q))]);
  const head = BM.map((b) => `${b.r}<small>${b.src.replace(' or ', '/')}</small>`);
  const BMi = E.BORROW_MINOR;
  const mRows = E.MINOR_KEYS.map((k) => [`<b>${nm(N(k))}m</b>`, ...BMi.map((b) => chord(up(N(k), b.d), b.q))]);
  const body = ruleBox('C3') + explain('C3')
    + two(keep(h3('In a major key') + legend), keep(h3('In a minor key') + table(['Borrowed chord', 'Source', 'Typical move'], BMi.map((b) => [`<b>${b.r}</b>`, b.src, b.move]), 'z')))
    + keep(h3('Borrowed chords in all 12 major keys') + table(['Key', ...head], rows, 'center z bc'))
    + keep(h3('Borrowed chords in all 12 minor keys') + table(['Key', ...BMi.map((b) => `${b.r}<small>${b.src}</small>`)], mRows, 'center z'));
  section(PART.C, 'c3', 'C3', 'Modal interchange (borrowed chords)', body);
}

// ---------------------------------------------------------------------------------------------
// D · GUIDE TONES
// ---------------------------------------------------------------------------------------------
{
  const QS = ['maj7', '7', 'm7', 'm7b5', 'mMaj7', 'dim7'];
  const qInfo = table(['Quality', '3rd', '7th', 'Between them', 'Formula'], QS.map((q) => {
    const g = E.guideTones(N('C'), q), iv = E.intervalName(g[0], g[1]);
    return [`<b>${E.CHORD[q].sym}</b> <span class="enh">${E.CHORD[q].name}</span>`, E.prettyDeg(E.third(q)), E.prettyDeg(E.seventh(q)), { P5: 'perfect 5th', TT: 'tritone', A5: 'augmented 5th', d5: 'tritone' }[iv] || iv, pf(E.CHORD[q].f.join(' '))];
  }), 'z');
  const grid = table(['Root', ...QS.map((q) => E.CHORD[q].sym)], ROOTS14.map((r) => [`<b>${nm(r)}</b>`, ...QS.map((q) => E.CHORD[q].f.map((t) => { const x = nm(up(r, t)); return t === E.third(q) || t === E.seventh(q) ? `<b class="gtn">${x}</b>` : `<span class="ct">${x}</span>`; }).join(' '))]), 'center z gtg');
  const body = ruleBox('D1') + explain('D1')
    + keep(qInfo)
    + keep(h3('Every 7th chord spelled on every root, guide tones in bold') + p('Read across for one root, down for one quality. Both spellings are given for C♯/D♭ and F♯/G♭.', 'note') + grid)
    + keep(h3('Guide tones (3rd, 7th) of the seven diatonic chords in all 12 major keys') + table(['Key', ...E.MAJ_TRI.map((t) => E.romanQ(t))], E.MAJOR_KEYS.map((k) => [`<b>${nm(N(k))}</b>`, ...E.MAJ_TRI.map((t) => list(E.guideTones(up(N(k), t.d), t.q)))]), 'center z'));
  section(PART.D, 'd1', 'D1', 'Guide tones of every 7th chord', body);
}
{
  const progTable = (prog, half = false) => {
    const keys = prog.minor ? E.MINOR_KEYS : E.MAJOR_KEYS;
    const rows = keys.map((k) => {
      const g = E.guideLines(N(k), prog);
      g.chords.forEach((c, i) => { const gt = E.guideTones(c.root, c.q); assert([g.A[i], g.B[i]].every((x) => gt.some((y) => E.same(x, y))), `${prog.id} ${k}`); });
      return [`<b>${nm(N(k))}${prog.minor ? 'm' : ''}</b>`, g.chords.map((c) => chord(c.root, c.q)).join(' – '), list(g.A, ' → '), list(g.B, ' → ')];
    });
    return keep(h3(prog.name) + table(['Key', 'Chords', 'Line A', 'Line B'], rows, `z gl${half ? ' half' : ''}`));
  };
  const body = ruleBox('D2') + explain('D2') + ruleBox('D3') + explain('D3', { skip: ['Shown in C'] })
    + p('Line A starts on the 7th of the first chord (on the 3rd for the cycle and the blues); at every change each line moves to the nearest guide tone of the next chord. Minor ii–V–i is shown in the 12 minor keys.', 'note')
    + (() => { const P = Object.fromEntries(E.PROGS.map((x) => [x.id, x])); assert(E.PROGS.length === 6, 'six progressions'); return two(progTable(P['ii-V-I'], true), progTable(P['minor-ii-V-i'], true)) + two(progTable(P['ii-subV-I'], true), progTable(P.blues, true)) + progTable(P.cycle) + progTable(P.turnaround); })();
  section(PART.D, 'd2', 'D2', 'The ii–V–I rule and the canonical lines in all 12 keys', body);
}

// ---------------------------------------------------------------------------------------------
// E · SUPERIMPOSITION
// ---------------------------------------------------------------------------------------------
// pick the enharmonic chord-root spelling that gives the cleanest structure
const WIDE = [['C', 'B#'], ['C#', 'Db'], ['D'], ['Eb', 'D#'], ['E', 'Fb'], ['F', 'E#'], ['F#', 'Gb'], ['G'], ['Ab', 'G#'], ['A'], ['Bb', 'A#'], ['B', 'Cb']];
function cleanStructure(pcN, key, item) {
  let best = null, bs = 1e9;
  for (const r of WIDE[pcN]) {
    const s = SI.structure(N(r), key, item);
    if (s.names.some((x) => /undefined/.test(x)) || s.notes.some((x) => Math.abs(x.acc) > 2)) continue;
    const sc = E.accCount(s.notes) + 3 * s.notes.filter(isDbl).length + 0.5 * Math.abs(s.sroot.acc);
    if (sc < bs) { bs = sc; best = s; }
  }
  assert(best, `structure ${key} ${pcN}`);
  return best;
}
const shortName = (s, item) => s.rootName + (item.shape === 'min' ? 'm' : item.shape === 'pent' ? ' pent.' : item.shape === 'mpent' ? 'm pent.' : '');
{
  const SYM = { maj: 'maj7', dom: '7', min: 'm7', half: 'm7♭5', mmaj: 'm(maj7)', dim: '°7' };
  const menus = SI.MENU_KEYS.map((k) => {
    const mnu = SI.menu(k);
    return keep(h3(`Over a ${mnu.label} (X${SYM[k]})`) + table(['Play', 'Adds', 'Sounds like', 'Scale', 'Why'], mnu.items.map((it) => [`<b>${it.deg} ${SI.shapeName(it.shape)}</b>`, SI.tensionsOf(k, it).join(' '), it.result, it.scale, `<span class="why">${esc(it.why)}</span>`]), 'z si'));
  });
  const body = ruleBox('E1') + ruleBox('E2') + (() => { const seen = new Set(); return `<div class="cols">${mdProse(UNIT.E1.md, { skip: ['On the guitar'], seen }) + mdProse(UNIT.E2.md, { skip: ['On the guitar'], seen })}</div>`; })() + menus.join('');
  section(PART.E, 'e1', 'E1', 'The superimposition menus', body);
}
{
  const pick = (k, deg, shape) => { const it = SI.menu(k).items.find((x) => x.deg === deg && x.shape === shape); assert(it, `menu item ${k} ${deg} ${shape}`); return it; };
  const grid = (k, sym, items) => table(['Chord', ...items.map((it) => `${it.deg} ${SI.shapeName(it.shape).replace('pentatonic', 'pent.')}<small>${SI.tensionsOf(k, it).join(' ')} → ${it.result}</small>`)],
    CIRCLE_PCS.map((pcN) => [`<b>${[...new Set([COMMON[pcN], ...SPELLINGS[pcN]])].map((x) => nm(N(x)) + sym).join(' / ')}</b>`, ...items.map((it) => { const s = cleanStructure(pcN, k, it); return `<b>${shortName(s, it)}</b><br><small>${s.names.join(' ')}</small>`; })]), 'center z sg');
  const dom = [pick('dom', 'II', 'maj'), pick('dom', 'VI', 'maj'), pick('dom', '♭VI', 'maj'), pick('dom', '♭V', 'maj'), pick('dom', '♭iii', 'mpent')];
  const maj = [pick('maj', 'II', 'maj'), pick('maj', 'V', 'maj'), pick('maj', 'II', 'pent'), pick('maj', 'V', 'pent')];
  const min = [pick('min', '♭VII', 'maj'), pick('min', 'IV', 'maj'), pick('min', 'ii', 'mpent'), pick('min', 'v', 'min')];
  const body = p('The structure to play on every root, for the menu items worth knowing instantly. Header: the degree, the tensions it adds and the resulting chord. Structures are spelled the simplest way (they are played as shapes), so the enharmonic of the chord root is used where it avoids double accidentals.', 'lead')
    + keep(h3('Over a dominant 7th') + grid('dom', '7', dom))
    + keep(h3('Over a major 7th') + grid('maj', 'maj7', maj))
    + keep(h3('Over a minor 7th') + grid('min', 'm7', min))
    + callout(`<b>Say it as a sentence:</b> “over G7, ${dom.map((it) => `${shortName(cleanStructure(7, 'dom', it), it).replace(' pent.', ' pentatonic').replace('m pentatonic', ' minor pentatonic')} is ${it.result}`).join(', ')}.” Then move the chord round the circle and say it again.`);
  section(PART.E, 'e2', 'E2', 'Superimposition in all 12 keys', body);
}

// ---------------------------------------------------------------------------------------------
// BACK — daily recall checklist
// ---------------------------------------------------------------------------------------------
{
  const G = [
    ['A · Keys', [
      'Semitones of any interval, its inversion, and 9/11/13 as 2/4/6 — instantly.',
      'The circle both ways, the sharps and flats of any key in order, and the key from any signature (both shortcuts).',
      'Relative and parallel minor of every major key; relative major of every minor key.',
      'Major, natural, harmonic and melodic minor of today’s key, aloud, in under 5 seconds each.',
      'The seven 7th chords of any major and any minor key, with the mode on each degree.',
      'Where a chord lives: every major key a m7, maj7, 7 or m7♭5 belongs to.',
    ]],
    ['B · Scales and modes', [
      'The brightness ladder with the changed note on each rung, and the parent of each major mode.',
      'Any major mode on any root, by the ladder and then checked by the parent.',
      'Harmonic- and melodic-minor modes: name, twin + change, 7th chord and use, in order.',
      'The parent shortcuts in both directions (X7alt → melodic minor a semitone up, and back).',
      'Which four dominants share each half-whole scale; the two whole-tone sets.',
      'First-choice scale for every chord quality and every dominant job.',
    ]],
    ['C · Functional harmony', [
      'The five secondary dominants of any major key with their out-of-key notes; the minor-key set.',
      'The six tritone pairs and the guide tones they share; subV7 of any target.',
      'The borrowed chords of any major key with their source modes; the backdoor ♭VII7.',
    ]],
    ['D · Guide tones', [
      '3rd and 7th of maj7, 7, m7, m7♭5, mMaj7 and °7 on any root.',
      '“7th falls, 3rd holds”: both lines of ii–V–I in all 12 keys, then minor ii–V–i, ii–subV–I.',
      'The cycle of dominants, the turnaround from VI7 and the blues I7–IV7 lines in today’s key.',
    ]],
    ['E · Superimposition', [
      'Over any dominant: II, VI, ♭VI, ♭V triads and the ♭iii minor pentatonic — name each one and the sound.',
      'Over any maj7: II and V triads; over any m7: ♭VII and IV triads and the ii minor pentatonic.',
      'Read any triad over any root as tensions (D over C7 = 9 ♯11 13).',
    ]],
  ];
  const body = G.map(([t, items]) => `<div class="ck keep"><div class="ckh">${t}</div>${ul(items, 'check')}</div>`).join('')
    + callout('<b>The daily routine (10 minutes):</b> pick today’s key by walking the circle (C, G, D, A, E, B, F♯, D♭, A♭, E♭, B♭, F). Say its signature and scales, its seven chords, its secondary dominants and borrowed chords, and the ii–V–I guide-tone lines. Then name the superimpositions over its V7. Anything slower than a second goes on tomorrow’s list.');
  section('Back', 'checklist', '', 'Daily recall checklist', body, { lead: 'Be able to reel these off with no instrument and no paper. Tick a line when it is instant in all 12 keys.' });
}

// ---------------------------------------------------------------------------------------------
// ASSEMBLY
// ---------------------------------------------------------------------------------------------
const FONT = '-apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif';
const CSS = `
@page { size: A4; margin: 11mm 11mm 12mm;
  @bottom-center { content: counter(page); font: 8pt ${FONT}; color: #777; }
  @bottom-right { content: "Memory Essentials"; font: 7pt ${FONT}; color: #aaa; } }
@page :first { @bottom-center { content: none; } @bottom-right { content: none; } }
* { box-sizing: border-box; }
html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body { margin: 0; background: #fff; color: #1b1b1b; font: 9.3pt/1.38 ${FONT}; }
svg text { font-family: ${FONT}; }
section.sec { break-before: page; }
section.sec.flow { break-before: auto; margin-top: 14px; }
.partband { font-size: 7pt; letter-spacing: .14em; text-transform: uppercase; color: ${ACC}; font-weight: 700; margin-bottom: 1px; }
h2 { font-size: 15pt; margin: 0 0 6px; padding-bottom: 3px; border-bottom: 2px solid ${ACC}; break-after: avoid; }
h2 .num { color: ${ACC}; margin-right: 8px; }
h3 { font-size: 10.5pt; margin: 10px 0 3px; break-after: avoid; }
h4 { font-size: 9.5pt; margin: 6px 0 2px; break-after: avoid; }
p { margin: 2px 0 5px; }
p.lead { font-size: 9.8pt; color: #333; margin-bottom: 7px; }
p.note, .note { font-size: 8.3pt; color: #555; margin: 1px 0 3px; }
.prose p { margin: 2px 0 4px; }
.prose h4 { margin: 6px 0 2px; }
.cols { column-count: 2; column-gap: 14px; font-size: 8.6pt; line-height: 1.33; margin-bottom: 4px; }
.cols li, .cols p { break-inside: avoid; }
.cols p:has(+ ul), .cols p:has(+ ol), .cols h4 { break-after: avoid; }
.prose ul, .prose ol { margin: 2px 0 5px; padding-left: 16px; }
ul { margin: 3px 0 6px; padding-left: 16px; }
li { margin: 1px 0; }
table { border-collapse: collapse; width: 100%; margin: 2px 0 7px; font-size: 8.6pt; line-height: 1.3; }
thead { display: table-header-group; }
tr { break-inside: avoid; }
th { background: #e3efed; text-align: left; font-weight: 700; color: #123; vertical-align: bottom; }
th small { display: block; font-weight: 400; color: #4a5a58; font-size: 7pt; line-height: 1.2; }
th, td { border: 0.5pt solid #c9d3d1; padding: 1.6px 4px; vertical-align: top; }
table.z tbody tr:nth-child(even) td { background: #f4f8f7; }
table.center td, table.center th { text-align: center; }
table.center td:first-child, table.center th:first-child { text-align: left; }
td small { color: #555; font-size: 7.2pt; }
.nw { white-space: nowrap; }
table.gl.half { font-size: 7.8pt; }
table.gl.half td { padding: 1.4px 3px; }
table.gl.half td:first-child { width: 9%; }
table.gl.half td:nth-child(2) { width: auto; }
table.gl.half td:nth-child(3), table.gl.half td:nth-child(4) { white-space: nowrap; width: 1%; }
.enh { color: #888; font-weight: 400; font-size: 7.5pt; }
.hl { color: ${ACC}; font-weight: 700; }
.hh { color: ${ACC}; }
.oo { color: ${ACC}; font-weight: 700; }
.keep { break-inside: avoid; }
.two { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; align-items: start; }
.callout { border-left: 3px solid ${ACC}; background: #eef6f5; padding: 4px 8px; margin: 5px 0 7px; font-size: 8.8pt; break-inside: avoid; }
.rule { border: 0.8pt solid ${ACC}; border-radius: 3px; padding: 4px 8px; margin: 2px 0 6px; font-size: 9pt; background: #f7fbfa; break-inside: avoid; }
.rule .rid { font-weight: 700; color: ${ACC}; margin-right: 4px; text-transform: uppercase; font-size: 7.5pt; letter-spacing: .08em; }
table.grid12 { font-size: 8.4pt; }
table.grid12 td { padding: 1.3px 2px; }
table.keys { font-size: 8.4pt; }
table.keys td { padding: 1.3px 2px; }
table.tri td { white-space: nowrap; }
table.mg { font-size: 8pt; margin-bottom: 4px; }
table.mg td, table.mg th { padding: 1.1px 2px; }
table.mg th:nth-last-child(-n+2) { font-size: 7pt; }
.gt { font-size: 8.8pt; margin: 6px 0 1px; break-after: avoid; }
.gt span { color: #555; font-size: 8pt; }
table.ps td { font-size: 8.4pt; }
table.cs td:first-child { width: 22%; }
table.sd td { font-size: 8.4pt; }
table.bc { font-size: 8.2pt; }
table.bc td { padding: 1.4px 2px; white-space: nowrap; }
table.gtg { font-size: 8.4pt; }
table.gtg td { padding: 1.4px 3px; white-space: nowrap; }
.gtn { color: #111; }
.ct { color: #888; }
table.gl { font-size: 8.3pt; }
table.gl td:first-child { width: 7%; }
table.gl td:nth-child(2) { width: 39%; }
table.si .why { font-size: 7.6pt; color: #444; }
table.si td:first-child { width: 19%; }
table.si td:nth-child(5) { width: 40%; }
table.sg { font-size: 8.4pt; }
table.sg td:first-child { white-space: nowrap; }
table.sym td:nth-child(3) { white-space: nowrap; }
.trigrid { display: grid; grid-template-columns: 340px 1fr; gap: 14px; align-items: center; margin: 2px 0 4px; }
.rmod { margin: 0 0 5px; break-inside: avoid; }
.rmh { font-size: 10.5pt; font-weight: 700; border-bottom: 1pt solid #cfe0dd; margin: 7px 0 2px; padding-bottom: 1px; }
.rmh span { color: #fff; background: ${ACC}; border-radius: 3px; padding: 0 5px; margin-right: 6px; }
.rmh small { font-weight: 400; color: #666; font-size: 8pt; margin-left: 8px; }
.rl { display: grid; grid-template-columns: 26px 1fr; gap: 4px; font-size: 9pt; padding: 2.2px 0; border-bottom: 0.5pt dotted #d6dedc; }
.rl b { color: ${ACC}; }
.rl .rn { font-weight: 700; }
.check { padding-left: 0; }
.check li { list-style: none; padding-left: 18px; text-indent: -18px; margin: 3px 0; font-size: 9.6pt; }
.check li::before { content: "☐"; color: ${ACC}; display: inline-block; width: 18px; text-indent: 0; }
.ck { margin-bottom: 6px; }
.ckh { font-weight: 700; font-size: 10.5pt; color: ${ACC}; border-bottom: 1pt solid #cfe0dd; margin: 8px 0 2px; }
.title { height: 270mm; display: flex; flex-direction: column; justify-content: center; }
.title .kicker { font-size: 9pt; letter-spacing: .25em; color: ${ACC}; font-weight: 700; }
.title h1 { font-size: 40pt; margin: 6px 0 4px; line-height: 1; }
.title .sub { font-size: 12pt; color: #333; max-width: 150mm; margin-bottom: 10mm; }
.title .meta { font-size: 8.5pt; color: #555; margin-top: 10mm; max-width: 165mm; }
.title .fig { display: flex; gap: 18px; align-items: center; }
.title .mods { font-size: 9.5pt; }
.title .mods div { margin: 5px 0; }
.title .mods .enh { display: block; margin-left: 16px; font-size: 8pt; }
.title .mods b { color: ${ACC}; display: inline-block; width: 16px; }
.toc { break-before: page; }
.toc .tp { font-size: 8pt; font-weight: 700; color: ${ACC}; letter-spacing: .12em; text-transform: uppercase; margin: 10px 0 2px; }
.toc a { display: flex; color: inherit; text-decoration: none; font-size: 10.5pt; padding: 2.4px 0; }
.toc a .n { width: 30px; color: ${ACC}; font-weight: 700; }
.toc a .t { flex: none; }
.toc a .d { flex: 1; border-bottom: 1px dotted #aaa; margin: 0 6px 4px; }
.toc a .pg { width: 24px; text-align: right; font-variant-numeric: tabular-nums; }
.howto { margin-top: 14px; font-size: 9pt; }
`;

function render(pages = {}) {
  const parts = [];
  for (const s of SECTIONS) { if (!parts.length || parts.at(-1).name !== s.part) parts.push({ name: s.part, secs: [] }); parts.at(-1).secs.push(s); }
  const toc = parts.map((pt) => `<div class="tp">${esc(pt.name)}</div>` + pt.secs.map((s) => `<a href="#${s.id}"><span class="n">${s.num}</span><span class="t">${esc(s.title)}</span><span class="d"></span><span class="pg">${pages[s.id] ?? ''}</span></a>`).join('')).join('');
  const title = `<section class="title"><div class="kicker">GUITAR CARDS · MEMORY PACK</div><h1>Memory Essentials</h1>
    <div class="sub">The facts to recall instantly, with no instrument: every key, every mode, functional harmony, guide tones and superimposition — in all 12 keys.</div>
    <div class="fig">${circleSVG({ size: 300 })}<div class="mods">${MODULES.map((m) => `<div><b>${m.id}</b>${esc(m.name)} <span class="enh">${esc(m.blurb)}</span></div>`).join('')}</div></div>
    <div class="meta">The printed companion to the Memory pack. Every note name in these tables is generated by the same spelling engine that writes the cards, so each letter appears once per scale and chord (E♯ in F♯ major, C♭ in D♭7, B𝄫 in C°7). Where a root needs a double accidental, the plain enharmonic is shown beside it in grey. Fretboard shapes live in the Guitar Mastery guide; this booklet is facts and tables only.</div></section>`;
  const howto = `<div class="howto">${ul([
    '**Start with the rules page.** Every table is one rule applied to every key; recite the rule, then check yourself against the table.',
    '**Accent colour** marks the note that matters: the newest accidental, the raised note, the characteristic degree of a mode, the out-of-key note of a secondary dominant.',
    '**Keys run in circle order** (C G D A E B F♯ D♭ A♭ E♭ B♭ F) so neighbouring rows differ by one note. Cover a row, say it, uncover.',
    'Roman numerals are relative to the **major** scale of the tonic: a minor key reads i iiø7 ♭III iv v ♭VI ♭VII.',
  ])}</div>`;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Memory Essentials</title><style>${CSS}</style></head><body>
${title}
<section class="toc" id="contents"><h2>Contents</h2>${toc}${howto}</section>
${SECTIONS.map((s) => s.html).join('\n')}
</body></html>`;
}

function printPdf() {
  execFileSync(CHROME, ['--headless=new', '--no-pdf-header-footer', '--generate-pdf-document-outline', '--disable-gpu', `--print-to-pdf=${PDF}`, pathToFileURL(HTML).href], { stdio: 'pipe' });
}
// page number of every named destination (element id) in a Chrome PDF
function pdfDestPages(file) {
  const s = fs.readFileSync(file, 'latin1');
  const objAt = (n) => { const m = new RegExp(`(?:^|[\\r\\n])${n} 0 obj\\s*([\\s\\S]*?)endobj`).exec(s); return m ? m[1] : ''; };
  const rootRef = [...s.matchAll(/\/Root (\d+) 0 R/g)].pop();
  if (!rootRef) return { map: {}, count: 0 };
  const cat = objAt(rootRef[1]);
  const order = [];
  const walk = (n) => {
    const o = objAt(n);
    if (/\/Type\s*\/Pages\b/.test(o)) { const kids = /\/Kids\s*\[([^\]]*)\]/.exec(o); if (kids) for (const k of kids[1].matchAll(/(\d+) 0 R/g)) walk(k[1]); }
    else order.push(n);
  };
  const pagesRef = /\/Pages (\d+) 0 R/.exec(cat);
  if (pagesRef) walk(pagesRef[1]);
  const destsRef = /\/Dests (\d+) 0 R/.exec(cat);
  const d = destsRef ? objAt(destsRef[1]) : '';
  const map = {};
  for (const m of d.matchAll(/\/([A-Za-z0-9_.-]+)\s*\[(\d+) 0 R/g)) map[m[1]] = order.indexOf(m[2]) + 1;
  return { map, count: order.length };
}

const html0 = render();
assert(!/undefined|NaN|\[object/.test(html0.replace(/<style>[\s\S]*?<\/style>/, '')), 'undefined/NaN in output');
assert(!/(♭♭|♯♯|𝄫♭|𝄪♯)/.test(html0), 'triple accidental in output');
fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(HTML, html0);
if (process.argv.includes('--html')) { console.log('Wrote', path.relative(ROOT, HTML)); process.exit(0); }
printPdf();
let { map, count } = pdfDestPages(PDF);
if (Object.keys(map).length) {
  for (let pass = 0; pass < 3; pass++) {
    fs.writeFileSync(HTML, render(map));
    printPdf();
    const again = pdfDestPages(PDF);
    const moved = Object.keys(map).filter((k) => again.map[k] !== map[k]);
    ({ map, count } = again);
    if (!moved.length) break;
  }
} else console.warn('Could not read page numbers from the PDF; contents page left without numbers.');
const size = fs.statSync(PDF).size;
console.log(`Wrote ${path.relative(ROOT, HTML)} and ${path.relative(ROOT, PDF)}: ${count} pages, ${(size / 1024 / 1024).toFixed(2)} MB`);
for (const s of SECTIONS) console.log(`  ${String(s.num).padStart(3)}  p.${String(map[s.id] ?? '?').padStart(3)}  ${s.title}`);
