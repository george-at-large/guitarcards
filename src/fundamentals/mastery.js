// Mastery: learn the chords that leave the key, one at a time, until you know them cold. Phone only.
//   Learn: the chord, where it comes from, what it does, and two progressions that use it (tap to hear).
//   Practice: a progression from the library in one of your keys, chord names only: which chord does it use?
//     The reveal shows the numerals, the chord picked out, and why it works there.
//   Mastered: three clean in a row (across different progressions and keys). Then the next chord comes in.
//   Mastered chords come back as review; a miss sends one back to learning.
// Tracks: the borrowed chords (modal interchange) and the chromatic chords (secondary dominants, tritone subs,
// diminished, augmented and line clichés, chromatic mediants), from the CAGED app's data.
import * as A from '../audio.js';
import * as T from '../theory.js';
import * as F from '../fretboard.js';
import * as H from '../caged/harmony.js';
import { resolve, ALL } from '../caged/library.js';
import { BORROWED } from '../caged/borrowdata.js';
import { CHROMATIC } from '../caged/chromdata.js';
import { barsHTML, voiceRun } from './micore.js';
import { panel } from './theorycard.js';
import * as C from './core.js';

const KNOW = 3; // clean in a row to master a chord
const ACTIVE = 2; // chords being learned at once
const semis = (iv) => T.intervalSemis(F.simpleIv(iv)) % 12;
// chord families for matching a chord in a progression to the topic (iv7 counts as iv, V7♭9 as V7…)
function fam(q) {
  if (['dim', 'dim7'].includes(q)) return 'dim';
  if (q === 'm7b5') return 'hd';
  if (['aug', '7#5', 'maj7#5'].includes(q)) return 'aug';
  if (['mMaj7', 'mMaj9'].includes(q)) return 'mmaj';
  if (H.isMinorish(q)) return 'min';
  const ivs = T.getChord(q).ivs;
  if (ivs.includes('b7') && (ivs.includes('3') || ivs.includes('4'))) return 'dom';
  return 'maj';
}
const homePcs = (minor) => (minor ? [0, 2, 3, 5, 7, 8, 10] : [0, 2, 4, 5, 7, 9, 11]);
const outsideKey = (c, minor) => T.getChord(c.q).ivs.some((x) => !homePcs(minor).includes((semis(c.iv) + semis(x)) % 12));
// the chord the topic is about: the borrowed chord itself, or the one chord of a chromatic pair that leaves the key
function topicChord(d) {
  if (d.iv) return { iv: d.iv, q: d.q, rn: d.rn };
  return (d.chords || []).find((c) => outsideKey(c, !!d.minor)) || d.chords[0];
}
const matches = (c, t) => semis(c.iv) === semis(t.iv) && fam(c.q) === fam(t.q);

export const TRACKS = {
  borrowed: { id: 'borrowed', title: 'Borrowed Chords: Mastery', noun: 'borrowed chord', short: 'Borrowed chords',
    blurb: 'Modal interchange until you know it cold: one chord at a time, in real progressions, in your keys.',
    entries: BORROWED.filter((d) => !d.pair && !d.hybrid) },
  chromatic: { id: 'chromatic', title: 'Chromatic Chords: Mastery', noun: 'chromatic chord', short: 'Chromatic chords',
    blurb: 'Secondary dominants, tritone subs, diminished, augmented and mediants: one at a time, in progressions.',
    entries: CHROMATIC.filter((d) => d.chords && d.chords.length) },
};

// the progressions every player should know on sight, in the order a teacher would bring them in
const PROGS = ['three-chord-rock', 'authentic-cadence-iv-v7-i', 'plagal-cadence-iv-i', 'major-ii-v-i', 'the-axis-i-v-vi-iv', 'doo-wop-i-vi-iv-v',
  'i-vi-ii-v', '12-bar-blues', 'half-cadence', 'deceptive-cadence-v-vi', 'mixolydian-rock', 'minor-ii-v-i', 'harmonic-minor-cadence',
  'andalusian-cadence', 'epic-minor-i-vi-vii', 'aeolian-rock', 'minor-plagal-iv-iv-i', 'backdoor-cadence', 'iii-vi-ii-v-i', 'i-vi7-ii-v7',
  'tritone-sub-turnaround', 'passing-diminished', 'pachelbel-s-canon', 'the-axis-from-vi', 'dorian-i-iv', 'rhythm-changes-a-section',
  'rhythm-changes-bridge', 'jazz-blues', 'minor-blues', 'circle-of-fifths-in-sevenths', 'the-royal-road', 'gospel-walk-up', 'minor-turnaround'];
TRACKS.progressions = { id: 'progressions', kind: 'progs', title: 'Common Progressions: Mastery', noun: 'progression', short: 'Progressions',
  blurb: 'The progressions every player knows on sight: see the chord names in any key, know the progression.',
  entries: PROGS.map((id) => ALL.find((x) => x.id === id)).filter(Boolean).map((x) => ({ ...x, rn: numerals(x) })) };
// a progression's numerals, each change once: I – vi – ii – V
function numerals(item) {
  const flat = resolve(item).flat();
  const out = [];
  for (const c of flat) { const r = H.numeral(c.iv, c.q); if (out[out.length - 1] !== r) out.push(r); }
  return out.join(' – ');
}
// the same progression in plain triad numerals, to keep look-alikes (I–IV–V–I and I–IV–V7–I) out of the choices
const shape = (rn) => rn.split(' – ').map((x) => x.replace(/(maj|m|ø|°|\+)?\d.*$/, '').replace(/[ø°+]$/, '')).join('-');

const M = () => { const S = C.state(); return S.mastery || (S.mastery = {}); };
const recOf = (track, id) => { const m = M(); m[track] = m[track] || {}; return m[track][id] || (m[track][id] = { stage: 'new', streak: 0, n: 0, last: 0 }); };
export function progress(track) {
  const t = TRACKS[track];
  const known = t.entries.filter((d) => (M()[track] || {})[d.id]?.stage === 'known').length;
  return { known, total: t.entries.length };
}

export function makeMastery(trackId) {
  const t = TRACKS[trackId];
  const item = (d) => ({ id: `ms|${trackId}|${d.id}`, mode: `m-${trackId}`, label: `${d.name} (${T.prettyRoman(d.rn)})`, params: { e: d.id } });
  return {
    id: `m-${trackId}`, title: t.title, blurb: t.blurb, keyed: true, where: 'phone', dynamic: true,
    options: [], progressLabel: () => { const p = progress(trackId); return `${p.known} of ${p.total} known`; },
    pool: () => t.entries.map(item),
    // introduce a new chord while fewer than two are being learned; otherwise practise the ones being learned,
    // with known ones coming back now and then (the longest unseen first)
    next(ctx, pool) {
      const recs = t.entries.map((d) => ({ d, r: recOf(trackId, d.id) }));
      const learning = recs.filter((x) => x.r.stage === 'learning');
      const fresh = recs.filter((x) => x.r.stage === 'new');
      const known = recs.filter((x) => x.r.stage === 'known').sort((a, b) => a.r.last - b.r.last);
      let pickD, learn = false;
      if (learning.length < ACTIVE && fresh.length && !ctx.state.justLearned) { pickD = fresh[0].d; learn = true; }
      else if (learning.length && (!known.length || Math.random() < 0.75)) {
        const notLast = learning.length > 1 ? learning.filter((x) => x.d.id !== ctx.state.lastId) : learning;
        pickD = C.weighted(notLast, (x) => 1 + (KNOW - x.r.streak)).d;
      } else if (known.length) pickD = known[Math.floor(Math.random() * Math.min(3, known.length))].d;
      else pickD = recs[0].d;
      ctx.state.justLearned = learn;
      ctx.state.lastId = pickD.id;
      const it = item(pickD);
      it.params = { ...it.params, learn };
      return { item: it, keyPc: ctx.pickKey() };
    },
    make(it, pc) {
      const d = t.entries.find((x) => x.id === it.params.e);
      if (t.kind === 'progs') return makeProg(d, it, pc);
      const topic = topicChord(d);
      // the progressions that really contain the chord, each resolved to bars of chords in this key
      const usable = d.progs.map((p) => {
        const minor = !!(p.minor || d.minor);
        let bars; try { bars = resolve(p); } catch (e) { return null; }
        const flat = bars.flatMap((b) => b.map((c) => c));
        const hits = flat.map((c, i) => (matches(c, topic) ? i : -1)).filter((i) => i >= 0);
        return hits.length ? { p, minor, flat, hits } : null;
      }).filter(Boolean);
      if (!usable.length) throw new Error('no progression contains ' + d.id);
      const pick = (n) => C.shuffle(usable).slice(0, n);
      const build = (u) => {
        const tonic = C.spellTonic(pc, u.minor ? 'aeolian' : 'major');
        const chords = u.flat.map((c) => ({ root: H.spell(tonic, c.iv), quality: c.q, rn: H.numeral(c.iv, c.q) }));
        return { ...u, tonic, chords, keyName: `${C.nn(tonic)} ${u.minor ? 'minor' : 'major'}` };
      };
      const p = progress(trackId);
      const kicker = `${t.short} · ${p.known} of ${p.total} known`;
      if (it.params.learn) {
        const ex = pick(2).map(build);
        return { learn: true, d, topic, ex, kicker: `${kicker} · new`, title: `${C.esc(d.name)} <span class="tn">${C.esc(T.prettyRoman(d.rn))}</span>`, sub: C.esc(d.from ? `From ${d.from}` : '') };
      }
      const u = build(pick(1)[0]);
      // wrong answers: other chords of the track that aren't in this progression and aren't this chord in disguise
      const present = (x) => { const tc = topicChord(x); return u.flat.some((c) => matches(c, tc)); };
      const others = C.shuffle(t.entries.filter((x) => x.id !== d.id && !present(x) && !matches(topicChord(x), topic)));
      const same = others.filter((x) => !!x.minor === !!d.minor);
      const wrong = [...same, ...others.filter((x) => !same.includes(x))].slice(0, 3);
      const choices = C.shuffle([d, ...wrong]).map((x) => ({ v: x.id, l: `${T.prettyRoman(x.rn)} · ${x.name}` }));
      return { learn: false, d, topic, u, choices, kicker, title: `In ${C.esc(u.keyName)}`, sub: `Which ${t.noun} does this progression use?` };
    },
    mount(q, el, ctx) {
      if (q.learn) return learnCard(q, el, ctx);
      const u = q.u;
      el.innerHTML = `${barsHTML(u.chords, new Set(), -1, true)}<div class="choices">${q.choices.map((c, i) => `<button data-i="${i}">${C.esc(c.l)}</button>`).join('')}</div>`;
      const answer = (i) => {
        const v = i == null ? null : q.choices[i].v;
        el.querySelectorAll('[data-i]').forEach((b) => { b.disabled = true; const x = q.choices[Number(b.dataset.i)].v; if (x === q.d.id) b.classList.add('right'); else if (x === v) b.classList.add('wrong'); });
        const ok = v === q.d.id;
        ctx.reveal(explain(q.d, [u], true));
        ctx.finish({ clean: ok, speed: ctx.speed(9000), why: v == null ? 'revealed' : ok ? '' : `it’s the ${q.d.name}` });
      };
      el.querySelectorAll('[data-i]').forEach((b) => (b.onclick = () => answer(Number(b.dataset.i))));
      ctx.buttons([{ label: 'Reveal', kind: 'ghost', on: () => answer(null) }]);
    },
    onResult(q, res) {
      if (q.learn) return '';
      const r = recOf(trackId, q.d.id);
      r.n++; r.last = Date.now();
      if (res.clean) {
        r.streak++;
        if (r.stage !== 'known' && r.streak >= KNOW) { r.stage = 'known'; C.save(); return `<b class="good">Mastered: ${C.esc(q.d.name)}</b>`; }
        if (r.stage === 'new') r.stage = 'learning';
      } else {
        const was = r.stage;
        r.streak = 0; r.stage = 'learning';
        C.save();
        return was === 'known' ? `${C.esc(q.d.name)} goes back to learning` : '';
      }
      C.save();
      return r.stage === 'learning' ? `${KNOW - r.streak} more clean to master it` : '';
    },
  };

  // a progression: learn it in two keys; then name it from its chord names in a third
  function makeProg(d, it, pc) {
    const inKey = (k) => {
      const tonic = C.spellTonic(k, d.minor ? 'aeolian' : 'major');
      const chords = resolve(d).flatMap((b) => b.map((c) => ({ root: H.spell(tonic, c.iv), quality: c.q, rn: H.numeral(c.iv, c.q), beats: 4 / b.length })));
      return { p: d, minor: !!d.minor, tonic, chords, hits: [], keyName: `${C.nn(tonic)} ${d.minor ? 'minor' : 'major'}` };
    };
    const p = progress(trackId);
    const kicker = `${t.short} · ${p.known} of ${p.total} known`;
    if (it.params.learn) {
      const other = (pc + C.pick([2, 5, 7, 10])) % 12;
      return { learn: true, d, ex: [inKey(pc), inKey(other)], kicker: `${kicker} · new`, title: C.esc(d.name), sub: C.esc(d.by || '') };
    }
    const u = inKey(pc);
    const len = resolve(d).length;
    const pool = t.entries.filter((x) => x.id !== d.id && shape(x.rn) !== shape(d.rn));
    const near = C.shuffle(pool.filter((x) => !!x.minor === !!d.minor && Math.abs(resolve(x).length - len) <= 4));
    const wrong = [...near, ...C.shuffle(pool.filter((x) => !near.includes(x)))].slice(0, 3);
    const choices = C.shuffle([d, ...wrong]).map((x) => ({ v: x.id, l: `${x.name} · ${x.rn}` }));
    return { learn: false, d, u, choices, kicker, title: `In ${C.esc(u.keyName)}`, sub: 'Which progression is this?' };
  }

  function learnCard(q, el, ctx) {
    recOf(trackId, q.d.id).stage = 'learning'; C.save();
    el.innerHTML = explain(q.d, q.ex, false);
    ctx.buttons([{ label: 'Got it, quiz me', kind: 'go', on: () => ctx.finish({ clean: true, noScore: true, auto: true, delay: 10 }) }]);
  }
}

// what the chord is, how it's used, how it sounds, and the progressions with the chord picked out (tap to hear)
function explain(d, list, afterQuiz) {
  const shape = () => C.pick(['C', 'A', 'G', 'E', 'D']);
  if (d.chart) {
    return list.map((u, k) => `<div class="info"><div class="k">${C.esc(d.name)} · in ${C.esc(u.keyName)}</div>${barsHTML(u.chords)}</div>${k === 0 ? panel(u.chords, u.tonic, u.minor, { shape: shape() }) : ''}`).join('') + `<div class="info"><div class="k">${C.esc(d.name)}</div><p class="f" style="font-size:16px">${C.esc(d.rn)}</p>${d.by ? `<p>${C.esc(d.by)}</p>` : ''}<p class="note">Say the numerals as you read the chord names: that's the skill, in any key.</p></div>`;
  }
  const ref = list.some((u) => u.minor) ? 'A minor' : 'C major';
  return `${list.map((u, k) => `<div class="info"><div class="k">${C.esc(u.keyName)} · ${C.esc(u.p.song ? `${u.p.name}${u.p.by ? ` (${u.p.by})` : ''}` : u.p.name)}</div>
      ${barsHTML(u.chords, new Set(u.hits))}
      ${u.p.note ? `<p>${C.esc(u.p.note)}</p>` : ''}</div>
      ${k === 0 ? panel(u.chords, u.tonic, u.minor, { shape: shape(), hits: u.hits }) : `<div class="row"><button class="ghost" data-prog='${JSON.stringify(voiceRun(u.chords, u.tonic, shape()).map((x) => (x ? x.notes.map((n) => n.midi).sort((a, b) => a - b) : [])))}'>▶ Hear it</button></div>`}`).join('')}
  <div class="info"><div class="k">${C.esc(d.name)} · ${C.esc(T.prettyRoman(d.rn))}</div>
    ${d.where ? `<p><b>What it is:</b> ${C.esc(d.where)}</p>` : ''}
    ${d.how ? `<p><b>How it’s used:</b> ${C.esc(d.how)}</p>` : ''}
    ${d.sound ? `<p><b>Sound:</b> ${C.esc(d.sound)}</p>` : ''}
    <p class="note">The examples in this text are in ${ref}.</p></div>`;
}
