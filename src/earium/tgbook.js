// Ted Greene in Earium: the user's private copy of Modern Chord Progressions (never published). Read from the repo's
// own file when running on the Mac, else from the pack imported on this device (the same pack Guitar Cards and CAGED
// Changes use, kept in IndexedDB). Gives: his progressions as Exploder items (with his grips, as written), and his
// grips as movable forms for any chord (via CAGED Changes' Ted Greene voicings).
import * as T from '../theory.js';
import * as Hc from '../caged/harmony.js';
import * as TGV from '../caged/tgv.js';
import { parseSymbol, parseFrets } from '../tgchords.js';

let tg = null, loading = null, source = '';
function readPack() {
  return new Promise((res) => {
    try {
      const r = indexedDB.open('guitarcards-packs', 1);
      r.onupgradeneeded = () => r.result.createObjectStore('packs');
      r.onsuccess = () => { try { const q = r.result.transaction('packs').objectStore('packs').get('tedgreene'); q.onsuccess = () => res(q.result || null); q.onerror = () => res(null); } catch (e) { res(null); } };
      r.onerror = () => res(null);
    } catch (e) { res(null); }
  });
}
export function load() {
  if (!loading) loading = (async () => {
    try { tg = (await import('../../content/tedgreene.js')).tg; source = 'files'; } catch (e) { /* not on this site: private */ }
    if (!tg) { const p = await readPack(); if (p && p.tg) { tg = p.tg; source = 'pack'; } }
    if (tg) await TGV.load();
    return !!tg;
  })();
  return loading;
}
export const ready = () => !!tg;
export const from = () => source;
export async function importPack(file) {
  const pack = JSON.parse(await file.text());
  if (pack.kind !== 'guitarcards-pack' || pack.name !== 'tedgreene' || !pack.tg) throw new Error('That isn’t the Ted Greene pack.');
  await TGV.savePack(pack);
  TGV.reset(); tg = null; loading = null;
  return load();
}

// ---------- his progressions, as Exploder items ----------
// a chord's interval set as one of the app's chord qualities: the closest that holds its 3rd and 7th
const ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
function qualityOf(ivs) {
  const set = new Set(ivs.map((x) => (x === '#5' ? '#5' : x)));
  let best = null, bs = -Infinity;
  for (const [id, c] of Object.entries(T.CHORDS)) {
    if (id === 'quartal' || id === '5') continue;
    const core = c.ivs.filter((iv) => iv !== '5' && iv !== '1');
    if (!core.every((iv) => set.has(iv))) continue;
    const extra = [...set].filter((iv) => !c.ivs.includes(iv) && iv !== '5' && iv !== '1' && iv !== '11').length;
    const sc = core.length * 2 - extra * 1.5;
    if (sc > bs) { bs = sc; best = id; }
  }
  return best;
}
function ivToRoman(iv, minorish) {
  const m = /^(bb|b|#)?(\d+)$/.exec(iv);
  const deg = ((Number(m[2]) - 1) % 7) + 1;
  const r = ROMAN[deg];
  return (m[1] || '') + (minorish ? r.toLowerCase() : r);
}
const KIND_NAME = { 'I-IV': 'I7 – IV7', progression: 'Progressions', 'I-vi-ii-V': 'I–vi–ii–V', 'iii-vi-ii-V': 'iii–vi–ii–V', 'iii-vi-ii-V-I': 'iii–vi–ii–V–I', 'I-IV': 'I7 – IV7', cycle: 'Cycles', 'chord-scale': 'Chord scales', substitution: 'Substitutions' };
let items = null;
export function progressions() {
  if (!tg) return [];
  if (items) return items;
  items = [];
  for (const e of tg.examples || []) {
    if (!e.key || !KIND_NAME[e.kind] || (e.chords || []).length < (e.kind === 'I-IV' ? 2 : 3)) continue;
    const minor = /m$/.test(e.key);
    const tonic = T.parseNote(e.key.replace(/m$/, ''));
    const toks = [], grips = [];
    let ok = true;
    for (const c of e.chords) {
      let ch, fr;
      try { ch = parseSymbol(c.name); fr = parseFrets(c.frets); } catch (err) { ok = false; break; }
      const q = qualityOf(ch.ivs);
      if (!q) { ok = false; break; }
      const iv = Hc.ivFrom(tonic, ch.root);
      if (!/^(bb|b|#)?\d+$/.test(iv)) { ok = false; break; }
      const minorish = T.getChord(q).ivs.includes('b3');
      let tok = `${ivToRoman(iv, minorish)}:${q}`;
      if (ch.bass) { const b = Hc.ivFrom(ch.root, ch.bass); if (/^(b|#)?\d$/.test(b) && b !== '1') tok += `/${b}`; }
      toks.push(tok);
      grips.push(fr);
    }
    if (!ok) continue;
    items.push({ id: `tg-${e.id}`, name: e.label.length > 70 ? `${e.label.slice(0, 68)}…` : e.label, note: e.family, chart: `| ${toks.join(' | ')} |`, minor, tg: true, tgKey: T.notePc(tonic), tgGrips: grips, group: KIND_NAME[e.kind] });
  }
  return items;
}
// his grip for a chord of one of his progressions, moved to another key (frets kept between 0 and 17)
export function gripIn(item, k, keyPc, OPEN) {
  const fr = item.tgGrips?.[k];
  if (!fr) return null;
  let sh = ((keyPc - item.tgKey) % 12 + 12) % 12;
  const fretted = fr.filter((f) => f != null);
  if (Math.max(...fretted) + sh > 15) sh -= 12;
  if (Math.min(...fretted) + sh < 0) sh += 12;
  if (fretted.some((f) => f === 0) && sh !== 0) return null; // open strings only work in the original key
  const notes = [];
  fr.forEach((f, i) => { if (f == null) return; const string = 6 - i; notes.push({ string, fret: f + sh, midi: OPEN[6 - string] + f + sh }); });
  return notes.length >= 3 ? notes : null;
}
// his forms for any chord, anywhere on the neck (or inside an area)
export function formsFor(root, q, area = { lo: 0, hi: 15 }) {
  if (!TGV.ready()) return [];
  return TGV.voicingsFor(root, q, area).map((g) => ({ ...g, tg: true, notes: [...g.notes].sort((a, b) => a.midi - b.midi) }));
}
