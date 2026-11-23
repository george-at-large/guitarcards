// Chord Finder: a key comes up and you build its seven diatonic chords against the clock, spelling each root
// (letter, then ♭ ♮ ♯) and choosing its quality. Quick-fire asks one degree at a time. Every degree is tracked, so
// "slow on iii and vii°" shows up in Fuzzy.
import * as T from '../theory.js';
import { spellTonic, nn, sym, roman, pick, esc } from './core.js';

const SCALES = { major: 'major', aeolian: 'natural minor', 'harmonic-minor': 'harmonic minor', 'melodic-minor': 'melodic minor', 'harmonic-major': 'harmonic major' };
const TRI_Q = [['maj', ''], ['min', 'm'], ['dim', '°'], ['aug', '+']];
const SEV_Q = [['maj7', 'maj7'], ['7', '7'], ['m7', 'm7'], ['m7b5', 'm7♭5'], ['dim7', '°7'], ['mMaj7', 'm(maj7)'], ['maj7#5', 'maj7♯5']];
const LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const sizeName = (n) => (n === 3 ? 'triads' : '7th chords');

export default {
  id: 'finder',
  title: 'Chord Finder',
  blurb: 'A key comes up: build its seven diatonic chords as fast as you can, spelled right.',
  keyed: true,
  options: [
    { id: 'scales', label: 'Scales', type: 'multi', def: ['major', 'aeolian'], choices: Object.entries(SCALES) },
    { id: 'size', label: 'Chords', type: 'multi', def: ['4'], choices: [['3', 'Triads'], ['4', '7ths']] },
    { id: 'variant', label: 'Game', type: 'multi', def: ['build'], choices: [['build', 'Build all seven'], ['quick', 'Quick-fire: one degree']] },
  ],
  pool(c) {
    const out = [];
    for (const sc of c.scales) for (const n of c.size) {
      if (c.variant.includes('build')) out.push(item('build', sc, n));
      if (c.variant.includes('quick')) for (let d = 0; d < 7; d++) out.push(degItem(sc, n, d));
    }
    return out;
  },
  make(it, pc) {
    const p = it.params;
    const tonic = spellTonic(pc, p.sc);
    const size = Number(p.n);
    const chords = [...Array(7).keys()].map((i) => {
      const c = T.diatonicChord(tonic, p.sc, i, size);
      const semis = (T.notePc(c.root) - T.notePc(tonic) + 12) % 12;
      return { root: c.root, q: c.quality, rn: roman(i, semis, c.quality) };
    });
    const key = `${nn(tonic)} ${SCALES[p.sc]}`;
    if (p.k === 'build') return { title: key, sub: `Its seven diatonic ${sizeName(size)}, in order. Spell each root, then choose the quality.`, kicker: 'Build the key', chords, size, sc: p.sc, n: p.n, tonic };
    return { title: `The chord on degree ${p.d + 1} of ${key}?`, sub: `As a ${size === 3 ? 'triad' : '7th chord'}.`, kicker: 'Quick-fire', chords: [chords[p.d]], degs: [p.d], size, sc: p.sc, n: p.n, tonic };
  },
  mount(q, el, ctx) {
    const degs = q.degs || [0, 1, 2, 3, 4, 5, 6];
    const quals = q.size === 3 ? TRI_Q : SEV_Q;
    let cur = 0, letter = null, acc = 0, wrong = 0, shown = 0;
    const res = degs.map(() => ({ ok: false, shown: false, wrong: 0 }));
    const draw = () => {
      el.innerHTML = `
        <div class="slots" style="grid-template-columns:repeat(${degs.length === 1 ? 1 : 7},minmax(0,1fr))">${degs.map((d, i) => {
          const r = res[i], c = q.chords[i];
          const cls = i === cur && !r.ok && !r.shown ? 'cur' : r.ok ? 'ok' : r.shown ? 'shown' : '';
          return `<div class="slot ${cls}" data-slot="${i}"><small>${d + 1}</small><b>${r.ok || r.shown ? esc(sym(c.root, c.q)) : i === cur && letter ? esc(T.pretty(letter + ['b', '', '#'][acc + 1])) : ''}</b>${r.ok || r.shown ? `<small>${esc(c.rn)}</small>` : ''}</div>`;
        }).join('')}</div>
        <div class="pad c7">${LETTERS.map((L) => `<button data-l="${L}" class="${letter === L ? 'sel' : ''}">${L}</button>`).join('')}</div>
        <div class="pad c3">${[[-1, '♭'], [0, '♮'], [1, '♯']].map(([a, l]) => `<button data-a="${a}" class="${acc === a ? 'sel' : ''}">${l}</button>`).join('')}</div>
        <div class="pad c${quals.length > 4 ? 4 : 4}">${quals.map(([qq, l]) => `<button data-q="${qq}" ${letter ? '' : 'disabled'}>${l || 'maj'}</button>`).join('')}</div>`;
      el.querySelectorAll('[data-l]').forEach((b) => (b.onclick = () => { letter = b.dataset.l; draw(); }));
      el.querySelectorAll('[data-a]').forEach((b) => (b.onclick = () => { acc = Number(b.dataset.a); draw(); }));
      el.querySelectorAll('[data-q]').forEach((b) => (b.onclick = () => answer(b.dataset.q)));
    };
    const answer = (qq) => {
      const c = q.chords[cur];
      const ok = letter === LETTERS[c.root.letter] && acc === c.root.acc && qq === c.q;
      if (ok) { res[cur].ok = true; advance(); return; }
      res[cur].wrong++; wrong++;
      draw();
      const s = el.querySelector(`[data-slot="${cur}"]`); if (s) { s.classList.add('shake'); }
    };
    const advance = () => {
      letter = null; acc = 0;
      cur++;
      if (cur >= degs.length) return end();
      draw();
    };
    const end = () => {
      draw();
      el.querySelectorAll('.pad button').forEach((b) => (b.disabled = true));
      const clean = !shown && (degs.length > 1 || !wrong);
      const extra = q.degs ? [] : degs.map((d, i) => ({ item: degItem(q.sc, q.n, d), clean: !res[i].shown && !res[i].wrong, fuzz: res[i].shown ? 1 : 0.5 }));
      ctx.finish({ clean, fuzz: 1, speed: Math.max(0, ctx.speed(degs.length * 3500) - wrong * 0.15), extra, auto: degs.length === 1, why: shown ? `${shown} revealed` : wrong ? 'wrong chord' : '' });
      ctx.reveal(table(q));
    };
    draw();
    ctx.buttons([{ label: 'Reveal this one', kind: 'ghost', on: () => { if (cur >= degs.length) return; res[cur].shown = true; shown++; advance(); } }]);
  },
};

function item(k, sc, n) { return { id: `cf|${k}|${sc}|${n}`, mode: 'finder', group: 'build', label: `Build ${SCALES[sc]} ${sizeName(Number(n))}`, params: { k, sc, n } }; }
function degItem(sc, n, d) { return { id: `cf|q|${sc}|${n}|${d}`, mode: 'finder', group: 'quick', label: `${SCALES[sc]}: chord on degree ${d + 1} (${Number(n) === 3 ? 'triad' : '7th'})`, params: { k: 'q', sc, n, d } }; }
function table(q) {
  return `<div class="info"><div class="k">${esc(nn(q.tonic))} ${esc(SCALES[q.sc])}</div><div class="prog-bars">${q.chords.map((c) => `<div class="bar-c"><b>${esc(sym(c.root, c.q))}</b><small>${esc(c.rn)}</small></div>`).join('')}</div></div>`;
}
