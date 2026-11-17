// Voice leading: a progression voiced in three or four independent voices (bass, tenor, alto, soprano), each
// moving as little as possible from chord to chord. Every voicing has the chord's essential notes (the 3rd, the
// 7th, the bass, then the top colour), no crossed voices, sensible spacing; the path through the progression is
// the one with the least total motion (and no parallel fifths or octaves), found by dynamic programming.
import * as T from '../theory.js';

export const VOICE_NAMES = { 4: ['bass', 'tenor', 'alto', 'soprano'], 3: ['bass', 'middle voice', 'top voice'] };
const RANGES = { 4: [[38, 55], [48, 64], [55, 70], [60, 77]], 3: [[38, 55], [52, 67], [59, 77]] };
const deg = (iv) => T.INTERVALS[iv][0];

// a chord: its notes as pitch classes (each with its interval name) and the ones it can't do without
function chordInfo({ rootPc, q, bass }, n, freeBass) {
  const ivs = T.getChord(q).ivs;
  const pcs = new Map();
  for (const iv of ivs) { const pc = (rootPc + T.intervalSemis(iv)) % 12; if (!pcs.has(pc)) pcs.set(pc, iv); }
  let bassPc = rootPc;
  if (bass) { bassPc = (rootPc + T.intervalSemis(bass)) % 12; if (!pcs.has(bassPc)) pcs.set(bassPc, bass); }
  const pcOf = (iv) => (rootPc + T.intervalSemis(iv)) % 12;
  const has3 = ivs.some((iv) => deg(iv) === 3);
  const third = ivs.find((iv) => deg(iv) === 3) || ivs.find((iv) => !has3 && (deg(iv) === 2 || deg(iv) === 4));
  const seventh = ivs.find((iv) => deg(iv) === 7 || (deg(iv) === 6 && !/13/.test(iv)));
  const exts = ivs.filter((iv) => deg(iv) >= 9);
  const fifth = ivs.find((iv) => deg(iv) === 5);
  // priority: the bass (unless free), the 3rd, the 7th, the top colour, the root, an altered 5th, the 5th
  const order = [];
  if (!freeBass) order.push(bassPc);
  if (third) order.push(pcOf(third));
  if (seventh) order.push(pcOf(seventh));
  if (exts.length) order.push(pcOf(exts[exts.length - 1]));
  order.push(rootPc);
  if (fifth && fifth !== '5') order.push(pcOf(fifth));
  if (fifth) order.push(pcOf(fifth));
  const req = [...new Set(order)].slice(0, n);
  return { pcs, req: new Set(req), bassPc, rootPc };
}

// every voicing of a chord for n voices
function candidates(ch, n, freeBass) {
  const info = chordInfo(ch, n, freeBass);
  const R = RANGES[n], out = [], cur = [];
  const go = (k) => {
    if (k === n) {
      const set = new Set(cur.map((m) => m % 12));
      for (const p of info.req) if (!set.has(p)) return;
      let pen = 0;
      // doubled 3rds and 7ths sound thick and want to move the same way
      const counts = {}; cur.forEach((m) => { counts[m % 12] = (counts[m % 12] || 0) + 1; });
      for (const [p, c] of Object.entries(counts)) if (c > 1) { const iv = info.pcs.get(Number(p)); pen += /^(b|#)?(3|7)$/.test(iv) ? 4 : /^(1|5)$/.test(iv) ? 0.3 : 2; }
      if (freeBass) { const biv = info.pcs.get(cur[0] % 12); pen += biv === '1' ? 0 : deg(biv) === 3 ? 0.6 : deg(biv) === 7 ? 1 : deg(biv) === 5 ? 1.8 : 2.5; }
      out.push({ midis: [...cur], ivs: cur.map((m) => info.pcs.get(m % 12)), pen });
      return;
    }
    const [lo, hi] = R[k];
    for (let m = lo; m <= hi; m++) {
      if (!info.pcs.has(m % 12)) continue;
      if (k === 0 && !freeBass && m % 12 !== info.bassPc) continue;
      if (k > 0 && m <= cur[k - 1]) continue;
      if (k > 1 && m - cur[k - 1] > 12) continue; // upper voices within an octave of each other
      if (k === 1 && m - cur[0] > 19) continue;
      cur.push(m); go(k + 1); cur.pop();
    }
  };
  go(0);
  return out;
}
const parallel = (a, b) => {
  let p = 0;
  for (let i = 0; i < a.length; i++) for (let j = i + 1; j < a.length; j++) {
    const i1 = (a[j] - a[i]) % 12, i2 = (b[j] - b[i]) % 12;
    if ((i1 === 7 || i1 === 0) && i1 === i2 && a[i] !== b[i]) p++;
  }
  return p;
};
// the smoothest path: [{ midis, ivs }] per chord
export function solve(chords, n = 4, freeBass = false) {
  const C = chords.map((ch) => candidates(ch, n, freeBass));
  if (C.some((c) => !c.length)) return null;
  let prev = C[0].map((v) => ({ cost: v.pen + Math.abs(v.midis[n - 1] - (n === 4 ? 69 : 70)) * 0.15, back: -1 }));
  const backs = [prev];
  for (let k = 1; k < C.length; k++) {
    const cur = C[k].map((v) => {
      let best = Infinity, bi = -1;
      C[k - 1].forEach((u, ui) => {
        let move = 0;
        for (let i = 0; i < n; i++) move += Math.abs(v.midis[i] - u.midis[i]) * (i === 0 ? 0.6 : 1);
        const c = prev[ui].cost + move + v.pen + parallel(u.midis, v.midis) * 3;
        if (c < best) { best = c; bi = ui; }
      });
      return { cost: best, back: bi };
    });
    backs.push(cur); prev = cur;
  }
  let bi = prev.reduce((b, x, i) => (x.cost < prev[b].cost ? i : b), 0);
  const path = [];
  for (let k = C.length - 1; k >= 0; k--) { path.unshift(C[k][bi]); bi = backs[k][bi].back; }
  return path;
}

// the moves from one voicing to the next: { voice, from, to, a (old interval), b (new interval), d (semitones) }
export function movesBetween(u, v) {
  return u.midis.map((m, i) => ({ voice: i, from: m, to: v.midis[i], a: u.ivs[i], b: v.ivs[i], d: v.midis[i] - m }));
}
