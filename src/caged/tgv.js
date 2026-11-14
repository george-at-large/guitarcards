// Ted Greene voicings: every grip from the Ted Greene book (Modern Chord Progressions), turned into movable forms, so
// any chord in a run can be played with one of his voicings, moved to its root and placed in the CAGED area. A form
// fits a chord when it holds the chord's essential tones (the root may be left out of a seventh chord, as he often
// does) and its other notes are tensions that suit the chord; those extra notes are marked, so they can be shown or
// hidden. The book is private study material: it is never published with the app. It's read from the local files when
// running from the repo, or from the private pack imported on the phone (the same pack Guitar Cards uses).
import * as T from '../theory.js';
import * as F from '../fretboard.js';
import { parseSymbol, parseFrets } from '../tgchords.js';

let forms = null, loading = null, source = '';
const OPEN = F.OPEN;

async function readPack() {
  return new Promise((res) => {
    try {
      const r = indexedDB.open('guitarcards-packs', 1);
      r.onupgradeneeded = () => r.result.createObjectStore('packs');
      r.onsuccess = () => { try { const q = r.result.transaction('packs').objectStore('packs').get('tedgreene'); q.onsuccess = () => res(q.result || null); q.onerror = () => res(null); } catch (e) { res(null); } };
      r.onerror = () => res(null);
    } catch (e) { res(null); }
  });
}
export async function savePack(pack) {
  return new Promise((res, rej) => {
    const r = indexedDB.open('guitarcards-packs', 1);
    r.onupgradeneeded = () => r.result.createObjectStore('packs');
    r.onsuccess = () => { const tx = r.result.transaction('packs', 'readwrite'); tx.objectStore('packs').put(pack, 'tedgreene'); tx.oncomplete = () => res(true); tx.onerror = () => rej(tx.error); };
    r.onerror = () => rej(r.error);
  });
}
// the forms, built once: from the repo's private file if it's there, else the pack saved on this device
export function load() {
  if (forms) return Promise.resolve(forms);
  if (!loading) loading = (async () => {
    let tg = null;
    try { tg = (await import('../../content/tedgreene.js')).tg; source = 'files'; } catch (e) { /* not published */ }
    if (!tg) { const p = await readPack(); if (p && p.tg) { tg = p.tg; source = 'pack'; } }
    forms = tg ? build(tg) : [];
    return forms;
  })();
  return loading;
}
export const ready = () => !!(forms && forms.length);
export const count = () => (forms ? forms.length : 0);
export const from = () => source;
export function reset() { forms = null; loading = null; }

const semis = (iv) => T.intervalSemis(F.simpleIv(String(iv).replace(/^(b|#)?(9|11|13)$/, (m, a, n) => (a || '') + { 9: '2', 11: '4', 13: '6' }[n]))) % 12;
// every grip in the book as a form: its notes as (string, fret, semitones above the root), deduplicated by shape
function build(tg) {
  const out = [], seen = new Set();
  for (const ex of tg.examples || []) for (const c of ex.chords || []) {
    let ch, fr;
    try { ch = parseSymbol(c.name); fr = parseFrets(c.frets); } catch (e) { continue; }
    if (ch.leftover) continue;
    const rootPc = T.notePc(ch.root);
    const notes = [];
    fr.forEach((f, i) => { if (f == null) return; const string = 6 - i, midi = OPEN[string] + f; notes.push({ string, fret: f, midi, rel: ((midi - rootPc) % 12 + 12) % 12 }); });
    if (notes.length < 3) continue;
    if (ch.bass && notes.reduce((a, b) => (a.midi <= b.midi ? a : b)).rel !== ((T.notePc(ch.bass) - rootPc + 12) % 12)) continue;
    const lo = Math.min(...notes.map((n) => n.fret));
    const sig = notes.map((n) => `${n.string}:${n.fret - lo}:${n.rel}`).join(',');
    if (seen.has(sig)) continue;
    seen.add(sig);
    out.push({ rootPc, notes, rels: new Set(notes.map((n) => n.rel)), sym: c.name, page: ex.page });
  }
  return out;
}

// the tensions that suit a chord family, beyond its own tones
const EXTRAS = { maj: [2, 9, 6], dom: [2, 9], alt: [1, 2, 3, 6, 8, 9], min: [2, 5, 9], hd: [2, 5, 8], dim7: [2, 5, 8, 11], dim: [9], aug: [2, 11], sus: [2, 9, 10] };
function familyOf(q) {
  const ivs = T.getChord(q).ivs, has = (x) => ivs.includes(x);
  if (has('3') && has('b7')) return ivs.some((x) => /^(b9|#9|#11|b13|#5|b5)$/.test(x)) || q === '7alt' ? 'alt' : 'dom';
  if (has('b3') && has('b5')) return has('bb7') ? 'dim7' : has('b7') ? 'hd' : 'dim';
  if (has('b3')) return 'min';
  if (has('3') && has('#5')) return 'aug';
  if (!has('3')) return 'sus';
  return 'maj';
}
const EXT_NAME = { 1: 'b9', 2: '9', 3: '#9', 5: '11', 6: '#11', 8: 'b13', 9: '13', 10: 'b7', 11: '7' };
// Ted Greene grips for this chord, moved to its root, inside the area (or just outside if nothing fits inside)
export function voicingsFor(root, q, pos) {
  if (!forms || !forms.length) return [];
  const ivs = T.getChord(q).ivs;
  const own = new Map(ivs.map((iv) => [semis(iv), iv]));
  const fam = familyOf(q);
  const ok = new Set([...own.keys(), 7, 0, ...(EXTRAS[fam] || [])]);
  // every tone the chord names (the 5th and, in a seventh chord, the root may go); then just its core (3rd, 7th, 6th,
  // altered 5th) with at least one of its tensions
  const core = ivs.filter((iv) => iv !== '5' && !(iv === '1' && ivs.length >= 4) && !/^(b|#)?(9|11|13)$/.test(iv)).map(semis);
  const ext = ivs.filter((iv) => /^(b|#)?(9|11|13)$/.test(iv)).map(semis);
  const strict = place(root, own, ok, (f) => core.every((r) => f.rels.has(r)) && ext.every((r) => f.rels.has(r)), pos);
  if (strict.some((x) => !x.far) || !ext.length) return pick(strict, pos);
  return pick(place(root, own, ok, (f) => core.every((r) => f.rels.has(r)) && ext.some((r) => f.rels.has(r)), pos), pos);
}
function pick(out, pos) {
  const inside = out.filter((x) => !x.far);
  return inside.length ? inside : out.filter((x) => x.lo >= pos.lo - 3 && x.hi <= pos.hi + 3);
}
function place(root, own, ok, want, pos) {
  const rpc = T.notePc(root), out = [];
  for (const f of forms) {
    if (!want(f)) continue;
    let fits = true;
    for (const r of f.rels) if (!ok.has(r)) { fits = false; break; }
    if (!fits) continue;
    const base = ((rpc - f.rootPc) % 12 + 12) % 12;
    for (const k of [-24, -12, 0, 12]) {
      const sh = base + k, fr = f.notes.map((n) => n.fret + sh);
      if (fr.some((x) => x < 0 || x > 17)) continue;
      const fretted = fr.filter((x) => x > 0);
      if (fr.some((x) => x === 0) && pos.lo > 1) continue;
      let outside = 0, far = false;
      for (const x of fretted) { const d = Math.max(0, pos.lo - x, x - pos.hi); if (d > 1) far = true; outside += d; }
      const notes = f.notes.map((n, i) => {
        const iv = own.get(n.rel) || EXT_NAME[n.rel] || (n.rel === 7 ? '5' : n.rel === 0 ? '1' : String(n.rel));
        return { string: n.string, fret: fr[i], midi: n.midi + sh, iv, note: T.transposeSemis(root, n.rel), extra: !own.has(n.rel) && n.rel !== 0 && n.rel !== 7 };
      }).sort((a, b) => b.string - a.string);
      const lo = fretted.length ? Math.min(...fretted) : 0, hi = Math.max(...fr);
      out.push({ notes, lo, hi, center: fretted.length ? fretted.reduce((a, b) => a + b, 0) / fretted.length : 0, label: `Ted Greene · ${f.sym.replace(/^[A-G][#b]?/, '').trim().replace(/^\//, 'add ') || 'major'} form`, tg: true, far: far || outside > 1, cost: notes.filter((n) => n.extra).length * 0.1 });
    }
  }
  return out;
}
