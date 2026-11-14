// Listen: an ambient chord player with annotations. A soft synth pad plays each chord, voiced exactly as the grip on
// screen (the same CAGED shapes, voicing sets and voice leading as the rest of the app), at any tempo down to very
// slow. The chords come from the composer (endless phrases with cadences, substitutions and key changes, growing from
// simple to far out), a progression from the library (varied as it loops), or random chords from a set. A voice can
// name each chord (its type, numeral or name), and annotation mode says what just happened: the cadence, the
// substitution, the new key, the scale to play. Scales can be shown, and soft bells can play a line from them.
import * as T from '../theory.js';
import * as A from '../audio.js';
import * as G from './grips.js';
import * as H from './harmony.js';
import * as L from './library.js';
import * as E from './evolve.js';
import * as SC from './scales.js';
import * as M from './meander.js';

const pick = (a) => a[Math.floor(Math.random() * a.length)];
const wpick = (pairs) => { let r = Math.random() * pairs.reduce((s, p) => s + p[1], 0); for (const [v, w] of pairs) { r -= w; if (r <= 0) return v; } return pairs[0][0]; };
const MAJOR_KEYS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
const MINOR_KEYS = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'G#', 'A', 'Bb', 'B'];
const keyAt = (pc, minor) => (minor ? MINOR_KEYS : MAJOR_KEYS).find((k) => T.notePc(T.parseNote(k)) === ((pc % 12) + 12) % 12);

// ---------- words for the voice ----------
const NUM = { 1: 'one', 2: 'two', 3: 'three', 4: 'four', 5: 'five', 6: 'six', 7: 'seven' };
const ACC = { b: 'flat ', bb: 'double flat ', '#': 'sharp ', '♭': 'flat ', '♯': 'sharp ' };
const QW = { maj: 'major', min: 'minor', dim: 'diminished', aug: 'augmented', sus2: 'sus two', sus4: 'sus four', 5: 'five', maj7: 'major seven', 7: 'seven', m7: 'minor seven',
  m7b5: 'half diminished', dim7: 'diminished seven', mMaj7: 'minor major seven', 'maj7#5': 'major seven sharp five', '7#5': 'seven sharp five', '7b5': 'seven flat five', '7sus4': 'seven sus four',
  6: 'six', m6: 'minor six', add9: 'add nine', madd9: 'minor add nine', '6/9': 'six nine', 'm6/9': 'minor six nine', maj9: 'major nine', 9: 'nine', m9: 'minor nine', mMaj9: 'minor major nine',
  11: 'eleven', m11: 'minor eleven', 'maj7#11': 'major seven sharp eleven', 'maj9#11': 'major nine sharp eleven', 13: 'thirteen', m13: 'minor thirteen', maj13: 'major thirteen',
  '9sus4': 'nine sus four', '13sus4': 'thirteen sus four', '7b9': 'seven flat nine', '7#9': 'seven sharp nine', '7#11': 'seven sharp eleven', '7b13': 'seven flat thirteen',
  '7b9b13': 'seven flat nine flat thirteen', '7#9b13': 'seven sharp nine flat thirteen', '7#9#5': 'seven sharp nine sharp five', '13b9': 'thirteen flat nine', '13#11': 'thirteen sharp eleven',
  '7alt': 'altered', 'dim-maj7': 'diminished major seven', 'm7#5': 'minor seven sharp five', '7sus2': 'seven sus two', '7sus4b5': 'seven sus four flat five', quartal: 'quartal' };
const typeWord = (q) => (q === '7' ? 'dominant seven' : q === '9' ? 'dominant nine' : q === '13' ? 'dominant thirteen' : QW[q] || q);
const noteWord = (n) => { const m = /^([A-G])(bb|b|#|##)?$/.exec(T.noteName(n)); return m ? m[1] + (m[2] ? ` ${{ b: 'flat', bb: 'double flat', '#': 'sharp', '##': 'double sharp' }[m[2]]}` : '') : T.noteName(n); };
const degWord = (iv) => { const m = /^(bb|b|#|♭|♯)?(\d)$/.exec(iv); return m ? (ACC[m[1]] || '') + NUM[m[2]] : iv; };
const romanWord = (r) => { const m = /^(bb|b|#|♭|♯|𝄫)?([ivIV]+)/.exec(String(r)); if (!m) return r; const d = { i: 1, ii: 2, iii: 3, iv: 4, v: 5, vi: 6, vii: 7 }[m[2].toLowerCase()]; return (ACC[m[1]] || (m[1] === '𝄫' ? 'double flat ' : '')) + NUM[d]; };
// "two minor seven", "five seven of six", "one", "six minor", "four over three"
function numeralWords(c) {
  const q = c.q, qw = q === 'maj' ? '' : QW[q] || q;
  let s = c.spec.rel ? `${romanWord(c.spec.rel.fn)} ${qw} of ${romanWord(c.spec.rel.to)}` : `${degWord(c.spec.iv)} ${qw}`;
  if (c.bass) s += ` over ${degWord(H.bassDegree(c.spec.iv, c.bass).replace('♭', 'b').replace('♯', '#'))}`;
  return s.replace(/\s+/g, ' ').trim();
}
const nameWords = (c) => `${noteWord(c.root)} ${QW[c.q] || c.q}${c.bass ? ` over ${noteWord(H.bassNote(c.root, c.bass))}` : ''}`;
const keyWords = (k) => `${noteWord(k.tonic)} ${k.minor ? 'minor' : 'major'}`;
// numerals and symbols in a written name, as words (“ii–V–i” → “two five one”), brackets dropped
const sayable = (s) => String(s).replace(/\s*\([^)]*\)/g, '').replace(/(^|[\s(–-])([b♭#♯]?)(vii|vi|iv|v|iii|ii|i|VII|VI|IV|V|III|II|I)(?=$|[\s)–\-/,:7°ø])/g, (m, pre, acc, r) => `${pre === '–' || pre === '-' ? ' ' : pre}${romanWord(acc + r)}`).replace(/[–—]/g, ' ').replace(/[°]/g, ' diminished').replace(/ø/g, ' half diminished').replace(/♭/g, ' flat').replace(/♯/g, ' sharp').replace(/\s+/g, ' ').trim();

// ---------- speech ----------
const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
const voices = () => (synth ? synth.getVoices().filter((v) => /^en/i.test(v.lang)) : []);
const NICE = /Samantha|Daniel|Karen|Moira|Serena|Kate|Oliver|Martha|Arthur|Ava|Allison|Google UK English Female|Google US English/;
function voiceFor(name) { const vs = voices(); return vs.find((v) => v.name === name) || vs.find((v) => NICE.test(v.name) && v.localService) || vs.find((v) => NICE.test(v.name)) || vs.find((v) => v.default) || vs[0] || null; }
let speakTimer = null;
function speak(text, name) {
  if (!synth || !text) return;
  synth.cancel();
  clearTimeout(speakTimer);
  speakTimer = setTimeout(() => {
    const u = new SpeechSynthesisUtterance(text);
    const v = voiceFor(name);
    if (v) { u.voice = v; u.lang = v.lang; }
    u.rate = 0.9; u.pitch = 0.95; u.volume = 1;
    synth.speak(u);
  }, 40);
}
function hushVoice() { clearTimeout(speakTimer); if (synth) synth.cancel(); }

export const VOICE = [['off', 'Off'], ['type', 'Chord type'], ['num', 'Numeral'], ['name', 'Chord name'], ['both', 'Numeral + name']];
const VOICE_SAYS = { off: '', type: '“minor seven”', num: '“two minor seven”', name: '“D minor seven”', both: '“two minor seven, D minor seven”' };
const RHYTHM = [['steady', 'Steady'], ['varied', 'Varied'], ['slow', 'Slow']];
const RHYTHM_BLURB = { steady: 'Every chord a bar.', varied: 'Like real music: some chords last two bars, passing chords half a bar, phrases end on a long chord.', slow: 'Two bars a chord, the last chord of a phrase four: very spacious.' };

export function renderListen($app, ctx) {
  const { D, save, neckSVG, esc, fmt, onBack, realise, mine, legend, KIND } = ctx;
  const O = D.lsn = Object.assign({ key: 'C', kt: 'major', shape: 'E', src: 'meander', level: 3, grow: true, modulate: true, rhythm: 'varied', bar: 4, bpm: 40, voicing: 'caged', bass: 'smooth',
    voice: 'num', annotate: true, scales: false, scaleLevel: 1, melody: false, click: false, prog: 'major-ii-v-i', set: 'exp', voiceName: '', neck: true }, D.lsn || {});
  let R = null, lock = null;
  const minor = () => O.kt === 'minor';
  const progs = () => [...mine(), ...L.ALL];
  const progItem = () => progs().find((p) => p.id === O.prog) || L.byId(O.prog) || L.ALL[0];

  // ---------- the chord streams: each gives { spec, key, beats, ann, level } ----------
  function progStream() {
    const item = progItem(), mi = minor();
    const conv = !!item.minor !== mi;
    const orig = [];
    L.resolve(item).forEach((b, bi) => b.forEach((spec) => orig.push({ spec: conv ? E.toParallel(spec, mi) : spec, beats: Math.max(1, Math.round(O.bar / b.length)), bar: bi })));
    orig.forEach((x, i) => { x.oid = i; });
    let cur = orig, i = 0, pass = 0, note = null;
    return {
      level: () => (O.grow ? Math.min(O.level, 1 + pass) : O.level),
      next() {
        if (i >= cur.length) {
          i = 0; pass++;
          if (O.grow && pass >= 2) { const r = E.evolve(cur, orig, mi); cur = r.slots; note = r.note; }
        }
        const x = cur[i], Lv = this.level();
        let beats = x.beats * (O.rhythm === 'slow' ? 2 : 1);
        if (O.rhythm === 'steady') beats = O.bar;
        if (O.rhythm === 'varied' && (i === cur.length - 1 || (x.beats >= O.bar && Math.random() < 0.2))) beats *= 2;
        const ann = [];
        if (i === 0) ann.push(pass === 0 ? { say: sayable(item.name), text: `${item.name}${item.by ? ` · ${item.by}` : ''}` } : note ? { say: 'a variation', text: `Variation: ${note}` } : null);
        if (i === 0 && note) note = null;
        const out = { spec: { ...x.spec, q: colourAt(x.spec, Lv, cur[(i + 1) % cur.length].spec, mi) }, key: { off: 0, minor: mi }, beats, ann: ann.filter(Boolean), level: Lv, loopPass: pass };
        i++;
        return out;
      },
    };
  }
  // a progression's chord coloured for the level: triads, then sevenths, then colour tones
  function colourAt(spec, Lv, next, mi) {
    const q = spec.q;
    if (Lv <= 1) return H.toTriad(q);
    const sev = T.getChord(q).ivs.length >= 4 ? q : H.toSeventh(H.toTriad(q), spec.iv, { dominant: !!spec.rel, minorKey: mi });
    if (Lv === 2) return T.getChord(q).ivs.length >= 4 ? q : Math.random() < 0.6 ? sev : q;
    if (Lv === 3 && Math.random() < 0.6) return sev;
    const opts = H.colourOptions(sev, spec.iv, { toMinor: next ? H.isMinorish(next.q) : false, minorKey: mi });
    return pick(opts.length ? opts : [sev]);
  }
  function randomStream() {
    const mi = minor(), pool = H.setPool(mi ? 'minor' : 'major', O.set);
    let last = null;
    return {
      level: () => O.level,
      next() {
        let e, spec, ann = [];
        if (O.set === 'any') {
          do { spec = { iv: H.randomIv(), q: pick(H.ANY_QUALITIES[O.level <= 1 ? 'tri' : O.level === 2 ? 'sev' : 'col']) }; } while (last && last.iv === spec.iv);
        } else {
          do { e = pick(pool); } while (pool.length > 1 && last && e.iv === last.iv && e.tri === last.tri);
          spec = { iv: e.iv, q: O.level <= 1 ? e.tri : O.level === 2 || Math.random() < 0.4 ? e.sev : pick(e.col), ...(e.rel ? { rel: e.rel } : {}) };
          if (e.group !== 'dia') ann.push({ say: e.rel ? 'secondary dominant' : e.tag ? sayable(e.tag) : e.group === 'mi' ? 'borrowed' : 'chromatic', text: e.fn });
        }
        const d = M.describe(last, spec, mi);
        if (d && !ann.length) ann.push(d);
        last = spec;
        const beats = O.rhythm === 'steady' ? O.bar : O.rhythm === 'slow' ? O.bar * 2 : wpick([[O.bar, 5], [O.bar * 2, 3], [O.bar / 2, O.bar % 2 ? 0 : 1]]);
        return { spec, key: { off: 0, minor: mi }, beats, ann, level: O.level };
      },
    };
  }
  function meanderStream() {
    const g = M.meander({ minor: minor(), level: O.level, grow: O.grow, modulate: O.modulate, rhythm: O.rhythm, bar: O.bar });
    return { level: g.level, next: () => g.next() };
  }

  // ---------- a chord made real: the key it's in, its grip in the shape, its scale, its words ----------
  function make() {
    const it = R.stream.next(), S = R.S;
    const tonic = T.parseNote(keyAt(R.homePc + it.key.off, it.key.minor));
    if (T.notePc(tonic) !== T.notePc(S.tonic) || S.minor !== it.key.minor) { S.tonic = tonic; S.minor = it.key.minor; S.lastScale = {}; }
    const c = realise(S, it.spec, R.prevGrip, { voicing: O.voicing, bass: O.bass, scaleLevel: O.scaleLevel });
    R.prevGrip = c.grip || R.prevGrip;
    const key = { tonic, minor: it.key.minor };
    const fill = (s) => s.replace('{key}', keyWords(key));
    const fillT = (s) => s.replace('{key}', `${T.noteName(tonic, true)} ${key.minor ? 'minor' : 'major'}`);
    // the bass actually played (an inversion chosen for the bass line shows as a slash chord)
    const bass = c.bassIv || null;
    return { ...c, bass, key, keyLabel: `${T.noteName(tonic, true)} ${key.minor ? 'minor' : 'major'}`, beats: it.beats, level: it.level, levelUp: it.levelUp,
      ann: (it.ann || []).map((a) => ({ ...a, say: fill(a.say), text: fillT(a.text) })) };
  }

  // what the voice says for a chord
  function words(c) {
    const parts = [];
    const v = O.voice;
    if (v === 'type') parts.push(typeWord(c.q));
    if (v === 'num' || v === 'both') parts.push(numeralWords(c));
    if (v === 'name' || v === 'both') parts.push(nameWords(c));
    if (O.annotate) {
      for (const a of c.ann) parts.push(a.say);
      if (O.scales && c.solo) parts.push(`${noteWord(T.transpose(c.root, c.solo.start))} ${sayable(c.solo.scale.name)}`);
    }
    return parts.filter(Boolean).join('. ');
  }
  // the sound: the grip's own notes as a pad
  function padNotes(c) {
    if (c.grip) return [...new Set(c.grip.notes.map((n) => n.midi))];
    const rootPc = T.notePc(c.root);
    return [40 + ((rootPc - 4 + 12) % 12), ...T.getChord(c.q).ivs.slice(1, 4).map((iv) => 55 + ((rootPc + H.semisOf(iv.replace(/^(b|#)?(9|11|13)$/, (m, a, n) => (a || '') + { 9: '2', 11: '4', 13: '6' }[n])) - 55) % 12 + 12) % 12)];
  }
  // bells: a slow line from the chord's scale, chord tones on the strong beats, mostly steps
  function bells(c, t, spb) {
    const rel = c.solo ? c.solo.rel : [...new Set(T.getChord(c.q).ivs.map((iv) => T.intervalSemis(iv.replace(/^(b|#)?(9|11|13)$/, (m, a, n) => (a || '') + { 9: '2', 11: '4', 13: '6' }[n])) % 12))];
    const rootPc = T.notePc(c.root);
    const pool = [];
    for (let m = 62; m <= 84; m++) if (rel.includes(((m - rootPc) % 12 + 12) % 12)) pool.push(m);
    const tones = new Set(T.getChord(c.q).ivs.map((iv) => (rootPc + T.intervalSemis(iv.replace(/^(b|#)?(9|11|13)$/, (m, a, n) => (a || '') + { 9: '2', 11: '4', 13: '6' }[n]))) % 12));
    let idx = R.bell != null ? pool.reduce((bi, m, i) => (Math.abs(m - R.bell) < Math.abs(pool[bi] - R.bell) ? i : bi), 0) : Math.floor(pool.length / 2);
    for (let b = 0; b < c.beats; b++) {
      if (Math.random() < (b === 0 ? 0.45 : 0.55)) continue; // space
      const strong = b % O.bar === 0;
      idx = Math.max(0, Math.min(pool.length - 1, idx + pick([-2, -1, -1, 1, 1, 2, 0])));
      if (strong) { // lean to the nearest chord tone
        for (const d of [0, 1, -1, 2, -2]) { const j = idx + d; if (pool[j] && tones.has(pool[j] % 12)) { idx = j; break; } }
      }
      const off = Math.random() < 0.3 ? 0.5 : 0;
      A.bell(pool[idx], t + (b + off) * spb, { vel: 0.3 + Math.random() * 0.15, decay: Math.min(4, 2 + spb) });
      R.bell = pool[idx];
    }
  }

  // ---------- the clock: chords scheduled on the audio clock, the screen and the voice by timers ----------
  const timers = [];
  function later(t, fn) { const id = setTimeout(fn, Math.max(0, (t - A.audioCtx().currentTime) * 1000)); timers.push(id); }
  function pump() {
    if (!R || R.paused) return;
    const now = A.audioCtx().currentTime;
    while (R.t < now + 0.3) scheduleChord();
    R.timer = setTimeout(pump, 60);
  }
  function scheduleChord() {
    const c = R.queue.shift();
    R.queue.push(make());
    const spb = 60 / R.bpm, t = R.t, dur = c.beats * spb;
    A.softPad(padNotes(c), t, dur, { vel: 0.55, attack: Math.min(1.6, spb * 1.2), release: Math.min(4, 1.5 + spb) });
    if (O.melody) bells(c, t, spb);
    for (let b = 0; b < c.beats; b++) {
      const tb = t + b * spb;
      if (O.click) A.click(tb, b % O.bar === 0 ? 2 : 1);
      later(tb, () => {
        document.querySelectorAll('#lbeats i').forEach((el, i) => el.classList.toggle('on', i === b % O.bar));
        const bc = document.getElementById('lbar');
        if (bc) bc.textContent = c.beats > O.bar ? `bar ${Math.floor(b / O.bar) + 1} of ${Math.ceil(c.beats / O.bar)}` : '';
      });
    }
    const nx = R.queue[0], prev = R.lastShown;
    R.lastShown = c;
    later(t, () => { R.cur = c; show(c, nx, prev); if (O.voice !== 'off' || O.annotate) speak(words(c), O.voiceName); });
    R.t += dur;
  }

  // ---------- drawing ----------
  const levelName = (n) => M.LEVELS[n - 1]?.name || '';
  function annHTML(c) {
    const lines = c.ann.map((a) => `<p class="${a.mod ? 'mod' : ''}">${fmt(a.text)}</p>`);
    if (c.levelUp) lines.unshift(`<p class="lvup">Level ${c.levelUp}: ${esc(levelName(c.levelUp))}</p>`);
    return lines.join('');
  }
  function scaleHTML(c) {
    if (!O.scales || !c.solo) return '';
    const x = c.solo;
    return `<div class="solo lv${x.level}"><div class="solo-top"><small>Scale</small></div><b>${fmt(SC.scaleTitle(x, c.root))}</b><p>${fmt(x.sentence)}</p></div>`;
  }
  function necks(c, prev) {
    if (!O.neck) return '';
    const p = R.S.pos;
    const w = { lo: Math.max(0, p.lo - (p.lo > 0 ? 1 : 0)), hi: p.hi + 1, band: p };
    const grip = c.grip ? neckSVG(c.grip, { ...w, prev: prev?.grip || null }) : '<div class="cnone">No grip here</div>';
    if (!O.scales || !c.solo) return `<div class="lnecks one">${grip}</div>${legend}`;
    const notes = SC.scaleNotesIn(c.solo, c.root, c.q, p.lo, p.hi).map((n) => ({ ...n, kind: n.chord ? KIND(n.iv) : 'sc' }));
    const sc = neckSVG({ notes, lo: w.lo, hi: w.hi }, { ...w, labels: 'iv' });
    return `<div class="lnecks"><figure>${grip}<figcaption>voicing</figcaption></figure><figure>${sc}<figcaption>scale</figcaption></figure></div>${legend}`;
  }
  function show(c, nx, prev) {
    const now = document.getElementById('lnow');
    if (!now) return;
    now.innerHTML = `<div class="main cnum">${fmt(c.rn)}</div><div class="sub cname">${fmt(c.name)}</div>`;
    document.getElementById('lann').innerHTML = annHTML(c);
    document.getElementById('lscale').innerHTML = scaleHTML(c);
    document.getElementById('lbeats').innerHTML = Array.from({ length: O.bar }, () => '<i></i>').join('');
    document.getElementById('lnext').innerHTML = nx ? `<span class="lbl">next</span> <b class="cnum">${fmt(nx.rn)}</b> <b class="cname">${fmt(nx.name)}</b>${T.notePc(nx.key.tonic) !== T.notePc(c.key.tonic) || nx.key.minor !== c.key.minor ? ` <span class="nsolo">→ ${fmt(nx.keyLabel)}</span>` : ''}` : '';
    document.getElementById('lstage').innerHTML = necks(c, prev);
    const w = document.getElementById('lwhere');
    if (w) w.innerHTML = `${fmt(c.keyLabel)}<small>${esc(R.S.shape)} shape · frets ${R.S.pos.lo}–${R.S.pos.hi} · level ${c.level} ${esc(levelName(c.level).toLowerCase())}</small>`;
    // the trail: the last few chords and what happened
    R.trail.unshift(c);
    R.trail.length = Math.min(R.trail.length, 8);
    document.getElementById('ltrail').innerHTML = R.trail.slice(1).map((x) => `<li><b class="cnum">${fmt(x.rn)}</b> <span class="cname">${fmt(x.name)}</span>${x.ann.length ? ` <i>${fmt(x.ann.map((a) => a.text.split(':')[0]).join(' · '))}</i>` : ''}</li>`).join('');
  }
  function liveButtons() {
    const vlabel = VOICE.find(([v]) => v === O.voice)[1];
    const b = (k, l, on) => `<button class="rt ${on ? 'on' : ''}" data-l="${k}" aria-pressed="${!!on}">${l}</button>`;
    return b('nums', 'Numeral', D.nums) + b('names', 'Name', D.names) + b('neck', 'Neck', O.neck) + b('voice', `Voice: ${vlabel}`, O.voice !== 'off') + b('annotate', 'Annotate', O.annotate) + b('scales', 'Scales', O.scales) + b('melody', 'Bells', O.melody) + b('click', 'Click', O.click);
  }
  function applyNames() {
    $app.classList.toggle('hide-names', !D.names);
    $app.classList.toggle('hide-nums', !D.nums);
  }
  function drawRun() {
    $app.innerHTML = `
    <header class="chead run"><button class="icon" data-l="stop" aria-label="Stop">■</button><div class="where" id="lwhere"></div><button class="icon" data-l="pause" aria-label="Pause">❚❚</button></header>
    <div class="now" id="lnow"><div class="count">…</div></div>
    <div class="lann" id="lann"></div>
    <div class="beats" id="lbeats"></div><div class="lbar" id="lbar"></div>
    <div class="nextline" id="lnext"></div>
    <div id="lscale"></div>
    <div class="stage" id="lstage"></div>
    <ol class="trail" id="ltrail"></ol>
    <div class="runctl"><button data-l="bpm-" aria-label="Slower">−</button><b id="lbpm">${R.bpm} bpm</b><button data-l="bpm+" aria-label="Faster">+</button></div>
    <p class="note lwarn" id="lwarn"></p>
    <div class="runbtns" id="lbtns">${liveButtons()}</div>`;
    applyNames();
    warn();
    window.scrollTo(0, 0);
  }
  // with the voice and annotations on, a fast tempo cuts the words off
  function warn() {
    const el = document.getElementById('lwarn');
    if (!el) return;
    const spoken = (O.voice !== 'off' ? (O.voice === 'both' ? 6 : 3) : 0) + (O.annotate ? 3 + (O.scales ? 3 : 0) : 0);
    const secs = (60 / (R?.bpm || O.bpm)) * O.bar * (O.rhythm === 'slow' ? 2 : 1) * (O.rhythm === 'varied' ? 0.75 : 1);
    el.textContent = spoken && spoken * 0.42 > secs ? `At this tempo the voice may get cut off: try ${Math.max(20, Math.floor((60 * O.bar) / (spoken * 0.42) / 2) * 2)} bpm or slower.` : '';
  }

  async function start() {
    await A.unlockAudio(); await A.ensureRunning();
    if (synth && (O.voice !== 'off' || O.annotate)) { const u = new SpeechSynthesisUtterance(' '); u.volume = 0; synth.speak(u); } // wakes speech on iOS (needs the tap)
    const tonic = T.parseNote(O.key);
    const pos = G.positionOf(tonic, O.shape);
    const S = { tonic, minor: minor(), shape: O.shape, shapes: [O.shape], shapeKey: O.shape, pos, toured: new Set([O.shape]) };
    R = { S, homePc: T.notePc(tonic), bpm: O.bpm, queue: [], trail: [], prevGrip: null, paused: false };
    R.stream = O.src === 'prog' ? progStream() : O.src === 'random' ? randomStream() : meanderStream();
    R.queue.push(make());
    drawRun();
    try { if (navigator.wakeLock) lock = await navigator.wakeLock.request('screen'); } catch (e) { lock = null; }
    R.t = A.audioCtx().currentTime + 0.25;
    pump();
  }
  function stopAll() {
    if (!R) return;
    clearTimeout(R.timer); timers.forEach(clearTimeout); timers.length = 0;
    A.hush(); hushVoice();
    R = null;
    if (lock) { lock.release().catch(() => {}); lock = null; }
  }
  function togglePause(btn) {
    R.paused = !R.paused;
    btn.textContent = R.paused ? '▶' : '❚❚';
    if (R.paused) { clearTimeout(R.timer); timers.forEach(clearTimeout); timers.length = 0; A.hush(); hushVoice(); R.queue.unshift(R.cur || R.queue[0]); }
    else { R.t = A.audioCtx().currentTime + 0.2; pump(); }
  }

  // ---------- setup ----------
  function seg(name, opts, cur) {
    return `<div class="seg" role="radiogroup">${opts.map(([v, l]) => `<button data-o="${name}" data-v="${v}" class="${String(cur) === String(v) ? 'on' : ''}" role="radio" aria-checked="${String(cur) === String(v)}">${l}</button>`).join('')}</div>`;
  }
  const chip = (k, l) => `<button class="chip ${O[k] ? 'on' : ''}" data-t="${k}">${l}</button>`;
  function progOptions() {
    const own = mine();
    return (own.length ? `<optgroup label="My progressions">${own.map((p) => `<option value="${p.id}" ${p.id === O.prog ? 'selected' : ''}>${esc(p.name)}</option>`).join('')}</optgroup>` : '')
      + L.LIBRARY.map((g) => `<optgroup label="${esc(g.cat)}">${L.ALL.filter((p) => p.cat === g.cat).map((p) => `<option value="${p.id}" ${p.id === O.prog ? 'selected' : ''}>${esc(p.name)}${p.minor ? ' (minor)' : ''}</option>`).join('')}</optgroup>`).join('');
  }
  function setup() {
    const keys = minor() ? MINOR_KEYS : MAJOR_KEYS;
    if (!keys.includes(O.key)) O.key = minor() ? ({ Db: 'C#', Ab: 'G#' }[O.key] || 'A') : ({ 'C#': 'Db', 'G#': 'Ab' }[O.key] || 'C');
    const pos = G.positionOf(T.parseNote(O.key), O.shape);
    const lv = M.LEVELS[O.level - 1];
    const vs = voices();
    $app.innerHTML = `
    <header class="chead"><button class="icon" data-l="back" aria-label="Back">‹</button><h1>Listen</h1><button class="icon" data-l="go" aria-label="Start">▶</button></header>
    <p class="lead">A soft synth plays the chords, voiced exactly as the grip on screen. Let it wander; a voice can name each chord and say what just happened.</p>
    <section class="card">
      <h2>Key</h2>
      ${seg('kt', [['major', 'Major'], ['minor', 'Minor']], O.kt)}
      <div class="chips">${keys.map((k) => `<button class="chip ${O.key === k ? 'on' : ''}" data-o="key" data-v="${k}">${fmt(T.pretty(k))}${minor() ? 'm' : ''}</button>`).join('')}</div>
      <h2>Shape</h2>
      <div class="chips shapes">${G.SHAPES.map((s) => `<button class="chip ${O.shape === s ? 'on' : ''}" data-o="shape" data-v="${s}">${s}</button>`).join('')}</div>
      <p class="note">Every chord is voiced inside the ${O.shape} shape of ${fmt(T.pretty(O.key))}${minor() ? 'm' : ''}, frets ${pos.lo}–${pos.hi}, and stays there when the music changes key.</p>
      <h3>Voicings</h3>
      <select id="lvoicing" class="select" aria-label="Voicing set">${[...new Set(G.VOICINGS.map((v) => v.group))].map((g) => `<optgroup label="${esc(g)}">${G.VOICINGS.filter((v) => v.group === g).map((v) => `<option value="${v.id}" ${v.id === O.voicing ? 'selected' : ''}>${esc(v.name)}</option>`).join('')}</optgroup>`).join('')}</select>
      <h3>Bass</h3>
      ${seg('bass', [['off', 'Root position'], ['smooth', 'Smooth inversions']], O.bass)}
      <p class="note">Each chord is chosen to move as little as possible from the last${O.bass === 'smooth' ? ', inversions included, so the bass glides too' : ''}.</p>
    </section>

    <section class="card">
      <h2>Music</h2>
      ${seg('src', [['meander', 'Wandering'], ['prog', 'A progression'], ['random', 'Random chords']], O.src)}
      ${O.src === 'meander' ? `<p class="note">Endless phrases, each closing with a cadence, with substitutions, passing chords and key changes as the level allows.</p>` : ''}
      ${O.src === 'prog' ? `<select id="lprog" class="select" aria-label="Progression">${progOptions()}</select><p class="note">It loops${O.grow ? '; each time round it gets richer (sevenths, then colour tones) and from the third time a chord is swapped for a substitute, a ii–V or a passing chord slips in' : ''}.</p>` : ''}
      ${O.src === 'random' ? `${seg('set', H.SETS[O.kt].map((s) => [s.id, s.name]), O.set)}<p class="note">${esc((H.SETS[O.kt].find((s) => s.id === O.set) || {}).blurb || '')}</p>` : ''}
      <h3>Level</h3>
      ${seg('level', M.LEVELS.map((l) => [l.n, l.name]), O.level)}
      <p class="note">${esc(lv.blurb)}</p>
      <div class="chips">${O.src !== 'random' ? chip('grow', 'Grow from simple') : ''}${O.src === 'meander' ? chip('modulate', 'Change key') : ''}</div>
      ${O.grow && O.src !== 'random' ? `<p class="note">Starts with plain triads and climbs a level ${O.src === 'prog' ? 'each time round' : 'every two phrases'} up to ${esc(lv.name)}.</p>` : ''}
      <h3>Harmonic rhythm</h3>
      ${seg('rhythm', RHYTHM, O.rhythm)}
      <p class="note">${RHYTHM_BLURB[O.rhythm]}</p>
      <h3>Beats in a bar</h3>
      ${seg('bar', [[3, '3'], [4, '4']], O.bar)}
    </section>

    <section class="card">
      <h2>Voice</h2>
      ${seg('voice', VOICE, O.voice)}
      <p class="note">${O.voice === 'off' ? 'No voice for the chords.' : `As each chord arrives the voice says ${VOICE_SAYS[O.voice]}.`}</p>
      <div class="chips">${chip('annotate', 'Annotate')}</div>
      <p class="note">${O.annotate ? 'Says what just happened, briefly: “perfect cadence”, “secondary dominant”, “tritone sub”, “chromatic mediant”, “new key, E minor”, and the scale when scales are on. The screen gives a line more.' : 'Annotations off: the screen still shows what happened.'}</p>
      ${vs.length > 1 ? `<select id="lvname" class="select" aria-label="Voice">${['', ...vs.map((v) => v.name)].map((n) => `<option value="${esc(n)}" ${n === O.voiceName ? 'selected' : ''}>${n ? esc(n) : 'Default voice'}</option>`).join('')}</select>` : ''}
      ${!synth ? '<p class="note">This browser has no speech, so the voice is silent.</p>' : ''}
    </section>

    <section class="card">
      <h2>Scales</h2>
      <div class="chips">${chip('scales', 'Show scales')}${chip('melody', 'Bells play them')}</div>
      ${O.scales || O.melody ? seg('scaleLevel', [[1, 'Easy'], [2, 'Medium'], [3, 'Hard'], [4, 'Exotic'], ['any', 'Mix']], O.scaleLevel) : ''}
      <p class="note">${O.scales ? 'Each chord gets a scale that fits it, shown next to the voicing.' : 'Show a scale that fits each chord, next to the voicing.'} ${O.melody ? 'Soft bells wander through it, leaning on chord tones.' : 'Bells can wander through it.'}</p>
    </section>

    <section class="card">
      <h2>Tempo</h2>
      <div class="tempo"><button data-l="bpm-" aria-label="Slower">−</button><b>${O.bpm}<small> bpm</small></b><button data-l="bpm+" aria-label="Faster">+</button></div>
      <input type="range" id="lbpmr" min="16" max="140" step="2" value="${O.bpm}" aria-label="Tempo">
      <div class="chips">${chip('click', 'Metronome click')}</div>
      <p class="note">${O.voice !== 'off' && O.annotate ? 'With the chord and the annotation both spoken, keep it slow: 30–40 bpm leaves room.' : O.voice !== 'off' || O.annotate ? 'With the voice on, about 40–60 bpm leaves room for the words.' : 'Slow tempos suit it: 30–60 bpm.'}</p>
    </section>
    <div class="actions"><button class="primary" data-l="go">▶ Listen</button></div>`;
    const r = $app.querySelector('#lbpmr');
    r.oninput = () => { O.bpm = Number(r.value); $app.querySelector('.tempo b').innerHTML = `${O.bpm}<small> bpm</small>`; };
    r.onchange = () => save();
    const sel = (id, k) => { const el = $app.querySelector(id); if (el) el.onchange = () => { O[k] = el.value; save(); setup(); }; };
    sel('#lvoicing', 'voicing'); sel('#lprog', 'prog'); sel('#lvname', 'voiceName');
    if (synth && !vs.length) synth.onvoiceschanged = () => { synth.onvoiceschanged = null; if (!R) setup(); };
  }

  $app.onclick = (e) => {
    const b = e.target.closest('button'); if (!b) return;
    const d = b.dataset;
    if (d.o) {
      const num = ['level', 'bar'].includes(d.o) || (d.o === 'scaleLevel' && d.v !== 'any');
      O[d.o] = num ? Number(d.v) : d.v;
      if (d.o === 'prog') O.kt = progItem().minor ? 'minor' : 'major';
      save(); return setup();
    }
    if (d.t) { O[d.t] = !O[d.t]; save(); return setup(); }
    const a = d.l;
    if (!a) return;
    if (a === 'back') { stopAll(); return onBack(); }
    if (a === 'go') { save(); return start(); }
    if (a === 'stop') { stopAll(); return setup(); }
    if (a === 'pause') return togglePause(b);
    if (a === 'bpm-' || a === 'bpm+') {
      const v = Math.max(16, Math.min(140, (R ? R.bpm : O.bpm) + (a === 'bpm+' ? 2 : -2)));
      O.bpm = v; save();
      if (R) { R.bpm = v; document.getElementById('lbpm').textContent = `${v} bpm`; warn(); } else setup();
      return;
    }
    // live toggles
    if (a === 'nums' || a === 'names') { const o = a === 'nums' ? 'names' : 'nums'; if (D[a] && !D[o]) D[o] = true; D[a] = !D[a]; }
    else if (a === 'voice') { const i = VOICE.findIndex(([v]) => v === O.voice); O.voice = VOICE[(i + 1) % VOICE.length][0]; if (O.voice === 'off') hushVoice(); }
    else if (['neck', 'annotate', 'scales', 'melody', 'click'].includes(a)) { O[a] = !O[a]; if (a === 'annotate' && !O.annotate && O.voice === 'off') hushVoice(); }
    save();
    document.getElementById('lbtns').innerHTML = liveButtons();
    applyNames(); warn();
    if (R?.cur) { document.getElementById('lscale').innerHTML = scaleHTML(R.cur); document.getElementById('lstage').innerHTML = necks(R.cur, R.trail[1]); }
  };
  setup();
  return stopAll;
}
