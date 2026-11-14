// The Listen voice: what to say for a chord, and saying it. The words come as groups of short phrases ("two",
// "minor seven", "over three"); each phrase is a clip of Theo Silk (ElevenLabs, the Mila house voice), recorded ahead of
// time by tools/listenvoice/build.mjs into voice/theo/, and the clips are joined on the audio clock. It plays straight
// to the speakers, past the compressor, so the chords never dip while it talks. A phrase with no clip drops its group;
// a device voice (Web Speech) can be chosen instead.
import * as T from '../theory.js';
import * as A from '../audio.js';
import * as H from './harmony.js';

// ---------- words ----------
const NUM = { 1: 'one', 2: 'two', 3: 'three', 4: 'four', 5: 'five', 6: 'six', 7: 'seven' };
const ACC = { b: 'flat ', bb: 'double flat ', '#': 'sharp ', '♭': 'flat ', '♯': 'sharp ', '𝄫': 'double flat ' };
export const QW = { maj: 'major', min: 'minor', dim: 'diminished', aug: 'augmented', sus2: 'sus two', sus4: 'sus four', 5: 'five', maj7: 'major seven', 7: 'seven', m7: 'minor seven',
  m7b5: 'half diminished', dim7: 'diminished seven', mMaj7: 'minor major seven', 'maj7#5': 'major seven sharp five', '7#5': 'seven sharp five', '7b5': 'seven flat five', '7sus4': 'seven sus four',
  6: 'six', m6: 'minor six', add9: 'add nine', madd9: 'minor add nine', '6/9': 'six nine', 'm6/9': 'minor six nine', maj9: 'major nine', 9: 'nine', m9: 'minor nine', mMaj9: 'minor major nine',
  11: 'eleven', m11: 'minor eleven', 'maj7#11': 'major seven sharp eleven', 'maj9#11': 'major nine sharp eleven', 13: 'thirteen', m13: 'minor thirteen', maj13: 'major thirteen',
  '9sus4': 'nine sus four', '13sus4': 'thirteen sus four', '7b9': 'seven flat nine', '7#9': 'seven sharp nine', '7#11': 'seven sharp eleven', '7b13': 'seven flat thirteen',
  '7b9b13': 'seven flat nine flat thirteen', '7#9b13': 'seven sharp nine flat thirteen', '7#9#5': 'seven sharp nine sharp five', '13b9': 'thirteen flat nine', '13#11': 'thirteen sharp eleven',
  '7alt': 'altered', 'dim-maj7': 'diminished major seven', 'm7#5': 'minor seven sharp five', '7sus2': 'seven sus two', '7sus4b5': 'seven sus four flat five', quartal: 'quartal' };
export const typeWord = (q) => (q === '7' ? 'dominant seven' : q === '9' ? 'dominant nine' : q === '13' ? 'dominant thirteen' : QW[q] || q);
export const noteWord = (n) => { const m = /^([A-G])(bb|b|#|##)?$/.exec(T.noteName(n)); return m ? m[1] + (m[2] ? ` ${{ b: 'flat', bb: 'double flat', '#': 'sharp', '##': 'double sharp' }[m[2]]}` : '') : T.noteName(n); };
export const degWord = (iv) => { const m = /^(bb|b|#|♭|♯)?(\d)$/.exec(iv); return m ? (ACC[m[1]] || '') + NUM[m[2]] : iv; };
export const romanWord = (r) => { const m = /^(bb|b|#|♭|♯|𝄫)?([ivIV]+)/.exec(String(r)); if (!m) return r; const d = { i: 1, ii: 2, iii: 3, iv: 4, v: 5, vi: 6, vii: 7 }[m[2].toLowerCase()]; return (ACC[m[1]] || '') + NUM[d]; };
export const keyWords = (k) => `${noteWord(k.tonic)} ${k.minor ? 'minor' : 'major'}`;
// numerals and symbols in a written name, as words (“ii–V–i” → “two five one”), brackets dropped
export const sayable = (s) => String(s).replace(/\s*\([^)]*\)/g, '')
  .replace(/(^|[\s(–-])([b♭#♯]?)(vii|vi|iv|v|iii|ii|i|VII|VI|IV|V|III|II|I)(s?)(?=$|[\s)–\-/,:7°ø])/g, (m, pre, acc, r, pl, off, str) => {
    if (r === 'I' && !acc && /^ [A-Z][a-z]/.test(str.slice(off + m.length))) return m; // the word "I"
    const w = romanWord(acc + r);
    return `${pre === '–' || pre === '-' ? ' ' : pre}${w}${pl ? (w.endsWith('six') ? 'es' : 's') : ''}`;
  })
  .replace(/\bm7\b/g, 'minor seven').replace(/([a-z])(\d)/g, '$1 $2')
  .replace(/[–—]/g, ' ').replace(/[°]/g, ' diminished').replace(/ø/g, ' half diminished').replace(/♭/g, ' flat').replace(/♯/g, ' sharp').replace(/\s+/g, ' ').trim();
// a scale's name as words: “Dorian ♭2” → “Dorian flat two”, “super-Locrian 𝄫7” → “super Locrian double flat seven”
export const scaleWords = (name) => String(name).replace(/\s*\([^)]*\)/g, '').replace(/𝄫/g, ' double flat ').replace(/♭/g, ' flat ').replace(/♯/g, ' sharp ').replace(/♮/g, ' natural ')
  .replace(/-/g, ' ').replace(/\d+/g, (d) => ({ 2: 'two', 4: 'four', 5: 'five', 6: 'six', 7: 'seven' }[d] || d)).replace(/\s+/g, ' ').trim();

// a chord's family, for the few-words voice: "minor", "dominant"…
export function familyOf(q) {
  if (q === '5') return 'five';
  if (q === 'quartal') return 'quartal';
  const ivs = T.getChord(q).ivs, has = (x) => ivs.includes(x);
  if (has('3') && has('b7')) return 'dom';
  if (has('b3') && has('b5')) return has('b7') ? 'hd' : 'dim';
  if (has('b3')) return 'min';
  if (has('3') && has('#5')) return 'aug';
  if (!has('3')) return 'sus';
  return 'maj';
}
export const FAMILY_WORD = { maj: 'major', min: 'minor', dom: 'dominant', dim: 'diminished', hd: 'half diminished', aug: 'augmented', sus: 'sus', five: 'five', quartal: 'quartal' };
const NAME_TAIL = { maj: '', min: 'minor', dom: 'seven', dim: 'diminished', hd: 'half diminished', aug: 'augmented', sus: 'sus', five: 'five', quartal: 'quartal' };

// the chord, as groups of phrases. more = the full chord ("two minor seven over three"); else the least that names it ("two")
export function chordWords(c, mode, more) {
  const g = [], fam = familyOf(c.q);
  if (mode === 'type') g.push([more ? typeWord(c.q) : FAMILY_WORD[fam]]);
  if (mode === 'num' || mode === 'both') {
    const rel = c.spec.rel;
    const p = [rel ? romanWord(rel.fn) : degWord(c.spec.iv)];
    if (more && c.q !== 'maj') p.push(QW[c.q] || c.q);
    if (rel) p.push(`of ${romanWord(rel.to)}`);
    if (more && c.bass) p.push(`over ${degWord(H.bassDegree(c.spec.iv, c.bass).replace('♭', 'b').replace('♯', '#'))}`);
    g.push(p);
  }
  if (mode === 'name' || mode === 'both') {
    const p = [noteWord(c.root), more ? QW[c.q] || c.q : NAME_TAIL[fam]];
    if (more && c.bass) p.push(`over ${noteWord(H.bassNote(c.root, c.bass))}`);
    g.push(p.filter(Boolean));
  }
  return g;
}
// an annotation's spoken label; "{key}" becomes its own phrase
export function annWords(say, key) {
  if (!say) return [];
  if (!say.includes('{key}')) return [[sayable(say)]];
  const head = say.split('{key}')[0].replace(/[,\s]+$/, '');
  return [[...(head ? [sayable(head)] : []), keyWords(key)]];
}
export const scaleWordsFor = (root, name, more) => [more ? [noteWord(root), scaleWords(name)] : [scaleWords(name)]];

// ---------- the clips ----------
export const slug = (p) => p.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const BASE = 'voice/theo/';
let index = null;                     // the phrases that have a clip (as slugs: case and punctuation don't matter)
const bufs = new Map();               // slug → Promise<AudioBuffer|null>
function loadIndex() {
  if (!index) index = fetch(`${BASE}index.json`).then((r) => (r.ok ? r.json() : [])).then((a) => new Set(a.map(slug))).catch(() => new Set());
  return index;
}
function clip(p) {
  const s = slug(p);
  if (!bufs.has(s)) {
    bufs.set(s, fetch(`${BASE}${s}.mp3`).then((r) => (r.ok ? r.arrayBuffer() : null))
      .then((ab) => (ab ? new Promise((res) => A.audioCtx().decodeAudioData(ab, res, () => res(null))) : null)).catch(() => null));
  }
  return bufs.get(s);
}
// the groups that can be said, every phrase in them recorded
async function sayableGroups(groups) {
  const have = await loadIndex();
  return groups.filter((g) => g.length && g.every((p) => have.has(slug(p))));
}
// start fetching a chord's clips before it plays
export async function prefetch(groups) { (await sayableGroups(groups)).flat().forEach(clip); }

// ---------- device speech, the fallback ----------
const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
export const hasSpeech = !!synth;
export const deviceVoices = () => (synth ? synth.getVoices().filter((v) => /^en/i.test(v.lang)) : []);
const NICE = /Samantha|Daniel|Karen|Moira|Serena|Kate|Oliver|Martha|Arthur|Ava|Allison|Google UK English Female|Google US English/;
function deviceVoice(name) { const vs = deviceVoices(); return vs.find((v) => v.name === name) || vs.find((v) => NICE.test(v.name) && v.localService) || vs.find((v) => NICE.test(v.name)) || vs.find((v) => v.default) || vs[0] || null; }
export function wakeSpeech() { if (synth) { const u = new SpeechSynthesisUtterance(' '); u.volume = 0; synth.speak(u); } }

// ---------- saying it ----------
let speaking = null;   // { gain, srcs } of the clip line now playing
let devTimer = null;
const GAP = 0.04, PAUSE = 0.34;
// say the groups at audio time t (a moment after the chord lands). voice: '' = Theo, else a device voice's name
export async function say(groups, t, { vol = 0.35, voice = '' } = {}) {
  if (!groups.length) return;
  if (voice) return sayDevice(groups, t, vol, voice);
  const ok = await sayableGroups(groups);
  if (!ok.length) return;
  const lines = await Promise.all(ok.map((g) => Promise.all(g.map(clip))));
  const c = A.audioCtx(), now = c.currentTime;
  if (now > t + 1.5) return; // too late: the moment has gone
  let at = Math.max(t, now + 0.03);
  fade(at);
  const gain = A.voiceBus(vol), srcs = [];
  lines.forEach((bs, gi) => {
    if (gi) at += PAUSE;
    bs.forEach((b, i) => {
      if (!b) return;
      if (i) at += GAP;
      const s = c.createBufferSource(); s.buffer = b; s.connect(gain); s.start(at); srcs.push(s);
      at += b.duration;
    });
  });
  speaking = { gain, srcs };
}
// the line before, if still talking, fades away under the new one
function fade(at) {
  if (!speaking) return;
  const { gain, srcs } = speaking;
  try { gain.gain.setTargetAtTime(0, at, 0.05); srcs.forEach((s) => s.stop(at + 0.4)); } catch (e) { /* */ }
  speaking = null;
}
function sayDevice(groups, t, vol, name) {
  if (!synth) return;
  clearTimeout(devTimer);
  devTimer = setTimeout(() => {
    synth.cancel();
    const u = new SpeechSynthesisUtterance(groups.map((g) => g.join(' ')).join('. '));
    const v = deviceVoice(name);
    if (v) { u.voice = v; u.lang = v.lang; }
    u.rate = 0.9; u.pitch = 0.95; u.volume = Math.min(1, vol * 1.2);
    synth.speak(u);
  }, Math.max(0, (t - A.audioCtx().currentTime) * 1000));
}
export function hush() {
  clearTimeout(devTimer);
  if (synth) synth.cancel();
  if (speaking) { try { speaking.srcs.forEach((s) => s.stop()); speaking.gain.disconnect(); } catch (e) { /* */ } speaking = null; }
}
