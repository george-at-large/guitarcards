// Borrowed chords: the modal-interchange chords worth knowing, one at a time. Each one explained (where it comes
// from, how to use it, how it sounds), shown next to the tonic chord in all five CAGED shapes of your key (tap a
// shape to hear the change), and a handful of progressions that use it, each sent to Chord changes to play round
// all five shapes.
import * as T from '../theory.js';
import * as A from '../audio.js';
import * as G from './grips.js';
import * as H from './harmony.js';
import * as L from './library.js';
import { BORROWED } from './borrowdata.js';
import { voiceInArea } from './cscale.js';

const KEYS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];

export function renderBorrowed($app, ctx) {
  const { D, save, neckSVG, esc, fmt, onBack, onPractise } = ctx;
  const O = D.bc = Object.assign({ key: 'C', id: 'iv', where: 'all' }, D.bc || {});
  const cur = () => BORROWED.find((b) => b.id === O.id) || BORROWED[0];
  const tonic = () => T.parseNote(O.key);
  const name = (root, q) => H.chordName(root, q);

  // a single borrowed chord, or a pair that travels together
  const chordsOf = (b) => b.chords || [{ iv: b.iv, q: b.q, rn: b.rn }];
  // the tonic chord and the borrowed chord(s), all inside one CAGED shape of the key, each voice-led from the last
  function pair(shape) {
    const b = cur(), t = tonic(), pos = G.positionOf(t, shape);
    const tri = (q) => ['maj', 'min', 'dim', 'aug'].includes(q), grip = (root, q, prev) => voiceInArea(root, q, pos, prev, 'caged', 'caged', tri(q)); // everyday grips only, no muted string inside
    const home = grip(t, b.minor ? 'min' : 'maj', null);
    let prev = home;
    const gs = chordsOf(b).map((c) => { const root = T.transpose(t, c.iv), g = grip(root, c.q, prev); if (g) prev = g; return { ...c, root, g }; });
    gs.forEach((x, i) => { x.prev = i ? gs[i - 1].g : home; });
    return { pos, home, gs };
  }
  function shapeRow(shape) {
    const b = cur(), { pos, home, gs } = pair(shape);
    const all = [home, ...gs.map((x) => x.g)].filter(Boolean);
    const lo = Math.min(pos.lo, ...all.map((g) => g.lo)), hi = Math.max(pos.hi, ...all.map((g) => g.hi));
    const w = { lo: Math.max(0, lo), hi: Math.max(hi, lo + 4), small: true, labels: 'iv' };
    return `<div class="bcrow" style="grid-template-columns: 54px repeat(${gs.length + 1}, 1fr)">
      <button class="bcplay" data-hear="${shape}" aria-label="Hear ${shape} shape"><b>${shape}</b><small>shape</small><span>▶</span></button>
      <figure><figcaption>${fmt(name(tonic(), b.minor ? 'min' : 'maj'))} <small>${b.minor ? 'i' : 'I'}</small></figcaption>${neckSVG(home, w)}</figure>
      ${gs.map((x) => `<figure><figcaption>${fmt(name(x.root, x.q))} <small>${fmt(x.rn)}</small></figcaption>${neckSVG(x.g, { ...w, prev: x.prev })}</figure>`).join('')}
    </div>`;
  }
  function hear(shape) {
    const { home, gs } = pair(shape);
    if (!home || gs.some((x) => !x.g)) return;
    A.unlockAudio().catch(() => {});
    A.ensureRunning().then(() => {
      const t = A.audioCtx().currentTime + 0.08, seq = [home, ...gs.map((x) => x.g), home];
      seq.forEach((g, i) => A.strum(G.gripMidis(g), t + i * 1.2, { dur: i === seq.length - 1 ? 1.6 : 1.1 }));
    });
  }
  // a progression's chords in this key, with their numerals
  function progHTML(p, i) {
    const b = cur(), item = L.byId(`borrow-${b.id}-${i}`), bars = L.resolve(item), t = tonic();
    const minor = !!p.minor;
    const chords = bars.map((bar) => bar.map((c) => ({ nm: name(T.transpose(t, c.iv), c.q), rn: H.numeral(c.iv, c.q) })));
    return `<li class="bcprog">
      <p class="bcpname">${fmt(p.name)}${minor && !b.minor ? ' <small>(minor key)</small>' : ''}</p>
      <p class="bcbars">${chords.map((bar) => `<span>${bar.map((c) => `<b>${fmt(c.rn)}</b><i>${fmt(c.nm)}</i>`).join(' ')}</span>`).join('')}</p>
      <p class="note">${fmt(p.note)}</p>
      <button class="chip on" data-practise="${item.id}" data-minor="${minor ? 1 : 0}">▶ ${O.where === 'all' ? 'Play it round all five shapes' : `Play it in the ${O.where} shape`}</button>
    </li>`;
  }
  function draw() {
    const b = cur(), t = tonic(), kn = fmt(T.noteName(t, true)) + (b.minor ? ' minor' : ' major');
    const maj = BORROWED.filter((x) => !x.minor && !x.pair), min = BORROWED.filter((x) => x.minor && !x.pair), pairs = BORROWED.filter((x) => x.pair);
    const chip = (x) => `<button class="chip bcchip ${x.id === b.id ? 'on' : ''}" data-bc="${x.id}"><b>${fmt(x.rn)}</b> <small>${esc(x.name)}</small></button>`;
    $app.innerHTML = `
    <header class="chead"><button class="icon" data-f="back" aria-label="Back">‹</button><h1>Borrowed chords</h1><span></span></header>
    <div class="chips fskeys">${KEYS.map((k) => `<button class="chip ${O.key === k ? 'on' : ''}" data-key="${k}">${fmt(T.pretty(k))}</button>`).join('')}</div>
    <section class="card bcpick">
      <p class="lbl">In a major key</p><div class="chips bcchips">${maj.map(chip).join('')}</div>
      <p class="lbl">In a minor key</p><div class="chips bcchips">${min.map(chip).join('')}</div>
      <p class="lbl">Pairs that travel together</p><div class="chips bcchips">${pairs.map(chip).join('')}</div>
    </section>
    <section class="card bcabout">
      <h2><span class="bcrn">${fmt(b.rn)}</span> ${esc(b.name)} <small>${fmt(chordsOf(b).map((c) => name(T.transpose(t, c.iv), c.q)).join(' – '))} in ${kn} · from ${esc(b.from)}</small></h2>
      <dl class="fsglance"><dt>Where it comes from</dt><dd>${fmt(b.where)}</dd><dt>How to use it</dt><dd>${fmt(b.how)}</dd><dt>Sound</dt><dd>${fmt(b.sound)}</dd></dl>
      <p class="note">Shown in C (or A minor where it says so); the chords below are in ${kn}.</p>
    </section>
    <section class="card bcshapes">
      <h2>In every CAGED shape of ${kn}</h2>
      <p class="note">Home chord, then ${fmt(b.rn)}, inside the same shape: the ringed notes are the ones held over. Tap a shape to hear the change.</p>
      ${G.SHAPES.map(shapeRow).join('')}
    </section>
    <section class="card bcprogs">
      <h2>Progressions that use it</h2>
      <div class="fsopt"><span>Play in</span><div class="seg" role="radiogroup">${[['all', 'All five'], ...G.SHAPES.map((x) => [x, x])].map(([v, l]) => `<button data-where="${v}" class="${O.where === v ? 'on' : ''}" role="radio" aria-checked="${O.where === v}">${l}</button>`).join('')}</div></div>
      <p class="note">Each one opens in Chord changes in ${fmt(T.noteName(t, true))}, ${O.where === 'all' ? 'a new CAGED shape each time round (C → A → G → E → D), so you play it in all five' : `staying in the ${O.where} shape`}.</p>
      <ul>${b.progs.map(progHTML).join('')}</ul>
    </section>`;
  }
  $app.onclick = (e) => {
    const el = e.target.closest('button'); if (!el) return;
    const d = el.dataset;
    if (d.f === 'back') { A.hush(); return onBack(); }
    if (d.key) { O.key = d.key; save(); return draw(); }
    if (d.bc) { O.id = d.bc; save(); draw(); document.querySelector('.bcabout')?.scrollIntoView({ block: 'start', behavior: 'smooth' }); return; }
    if (d.hear) return hear(d.hear);
    if (d.where) { O.where = d.where; save(); const y = window.scrollY; draw(); window.scrollTo(0, y); return; }
    if (d.practise) { A.hush(); return onPractise(d.practise, d.minor === '1', O.key, O.where); }
  };
  draw();
  return () => A.hush();
}
