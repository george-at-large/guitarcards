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
import * as SC from './scales.js';
import * as FL from './fsladder.js';
import { CHROMATIC } from './chromdata.js';

const SBY = Object.fromEntries(SC.SCALES.map((s) => [s.id, s]));
const spcs = (id) => [...new Set(SBY[id].ivs.map(FL.semisOf))].sort((a, b) => a - b);
// where a borrowed chord can come from: the parallel modes (same tonic) that hold all its notes, most common first,
// and the scale each one gives you over the chord (that mode seen from the chord's root). In a minor key only the
// minor-flavoured ones count (plus Phrygian dominant, the Spanish minor)
const SOURCES = ['aeolian', 'mixolydian', 'dorian', 'lydian', 'phrygian', 'harm-min', 'mel-min', 'phryg-dom', 'locrian'];
export function sourcesOf(c, minor, prefer = []) {
  const r = FL.semisOf(c.iv), tones = T.getChord(c.q).ivs.map((iv) => (r + FL.semisOf(iv)) % 12);
  return SOURCES.filter((id) => (minor ? id !== 'aeolian' && (spcs(id).includes(3) || id === 'phryg-dom') : true))
    .filter((id) => tones.every((t) => spcs(id).includes(t)))
    .map((id) => { const rot = spcs(id).map((p) => (p - r + 12) % 12).sort((a, b) => a - b).join(); const over = SC.SCALES.find((s) => s.ivs.length === 7 && spcs(s.id).join() === rot); return over ? { src: id, over: over.id } : null; })
    .filter(Boolean).sort((a, b) => (prefer.includes(b.src) ? 1 : 0) - (prefer.includes(a.src) ? 1 : 0)).slice(0, 3);
}
const KEYS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];

// the same screen serves Chromatic chords (secondary dominants, tritone subs, diminished…): cfg names the data, the
// title, the library id prefix, where its settings live, and how the picker groups the chords
const BORROW_CFG = { data: BORROWED, title: 'Borrowed chords', prefix: 'borrow', state: 'bc', first: 'iv',
  groups: [['In a major key', (x) => !x.minor && !x.pair && !x.hybrid], ['In a minor key', (x) => x.minor && !x.pair && !x.hybrid], ['Pairs that travel together', (x) => x.pair], ['Hybrid: several kinds in one tune', (x) => x.hybrid]] };
export const CHROM_CFG = { data: CHROMATIC, title: 'Chromatic chords', prefix: 'chrom', state: 'cc', first: 'VofV',
  groups: [...new Set(CHROMATIC.map((x) => x.group))].map((g) => [g, (x) => x.group === g]) };
export function renderBorrowed($app, ctx, cfg = BORROW_CFG) {
  const { D, save, neckSVG, esc, fmt, onBack, onPractise, progress } = ctx;
  const DATA = cfg.data;
  const O = D[cfg.state] = Object.assign({ key: 'C', id: cfg.first, where: 'E' }, D[cfg.state] || {});
  if (!O.oneShape) { O.oneShape = true; if (O.where === 'all') O.where = 'E'; } // one shape round and round is the default now
  const cur = () => DATA.find((b) => b.id === O.id) || DATA[0];
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
    return `<div class="bcrow${O.where === shape ? ' on' : ''}" style="grid-template-columns: 54px repeat(${gs.length + 1}, 1fr)">
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
  // each chord's sources in this key, and the scale to play over it from each
  // the source the text names first ('from Mixolydian') leads the list
  const NAMED = [['Mixolydian', 'mixolydian'], ['Lydian', 'lydian'], ['Dorian', 'dorian'], ['Phrygian', 'phrygian'], ['armonic minor', 'harm-min'], ['atural minor', 'aeolian'], ['Aeolian', 'aeolian'], ['elodic minor', 'mel-min']];
  function fromHTML(b, t) {
    const one = chordsOf(b).length === 1;
    const prefer = NAMED.filter(([w]) => b.from.includes(w)).sort((x, y) => b.from.indexOf(x[0]) - b.from.indexOf(y[0])).map(([, id]) => id);
    return chordsOf(b).map((c) => {
      const root = T.transpose(t, c.iv), cn = name(root, c.q), ss = sourcesOf(c, b.minor, prefer);
      const list = ss.map((x) => `<li><b>${fmt(T.noteName(t, true))} ${esc(SBY[x.src].name)}</b> → over ${fmt(cn)}, play <b>${fmt(T.noteName(root, true))} ${esc(SBY[x.over].name)}</b></li>`).join('');
      return `${one ? '' : `<p class="bcfromhd">${fmt(c.rn)} · ${fmt(cn)}</p>`}<ul class="bcfrom">${list || '<li>outside the parallel modes</li>'}</ul>`;
    }).join('');
  }
  // a progression's chords in this key, with their numerals
  function progHTML(p, i) {
    const b = cur(), item = L.byId(`${cfg.prefix}-${b.id}-${i}`), bars = L.resolve(item), t = tonic();
    const minor = !!p.minor;
    const chords = bars.map((bar) => bar.map((c) => ({ nm: name(T.transpose(t, c.iv), c.q), rn: H.numeral(c.iv, c.q) })));
    // a tick when it's done where you're playing it: clean at the fast tempo in this shape (or in all five); a hollow
    // one when there's a clean run but not yet at that tempo
    const pr = progress ? progress(item.id, minor) : null;
    const best = pr ? (O.where === 'all' ? Math.min(...G.SHAPES.map((x) => pr.rec[x] || 0)) : pr.rec[O.where] || 0) : 0;
    const tick = !pr ? '' : (O.where === 'all' ? pr.all : best >= pr.tgt) ? '<span class="bctick done" title="Done">✓</span>' : best ? `<span class="bctick part" title="Clean at ${best} bpm; done at ${pr.tgt}">✓</span>` : '';
    return `<li class="bcprog${tick.includes('done') ? ' isdone' : ''}">
      <p class="bcpname">${tick}${fmt(p.name)}${minor && !b.minor ? ' <small>(minor key)</small>' : ''}</p>
      <p class="bcbars">${chords.map((bar) => `<span>${bar.map((c) => `<b>${fmt(c.rn)}</b><i>${fmt(c.nm)}</i>`).join(' ')}</span>`).join('')}</p>
      <p class="note">${fmt(p.note)}</p>
      ${pr && Object.keys(pr.rec).length ? `<div class="bcprogress">${pr.html}<small>best clean tempo per shape; done at ${pr.tgt} bpm</small></div>` : ''}
      <button class="chip on" data-practise="${item.id}" data-minor="${minor ? 1 : 0}">▶ ${O.where === 'all' ? 'Play it round all five shapes' : `Play it in the ${O.where} shape`}</button>
    </li>`;
  }
  function draw() {
    const b = cur(), t = tonic(), kn = fmt(T.noteName(t, true)) + (b.minor ? ' minor' : ' major');

    const chip = (x) => `<button class="chip bcchip ${x.id === b.id ? 'on' : ''}" data-bc="${x.id}"><b>${fmt(x.rn)}</b> <small>${esc(x.name)}</small></button>`;
    $app.innerHTML = `
    <header class="chead"><button class="icon" data-f="back" aria-label="Back">‹</button><h1>${esc(cfg.title)}</h1><span></span></header>
    <div class="chips fskeys">${KEYS.map((k) => `<button class="chip ${O.key === k ? 'on' : ''}" data-key="${k}">${fmt(T.pretty(k))}</button>`).join('')}</div>
      <div class="fsopt"><span>Shape</span><div class="seg" role="radiogroup">${[...G.SHAPES.map((x) => [x, x]), ['all', 'All five']].map(([v, l]) => `<button data-where="${v}" class="${O.where === v ? 'on' : ''}" role="radio" aria-checked="${O.where === v}">${l}</button>`).join('')}</div></div>
    <section class="card bcpick">
      ${cfg.groups.map(([label, f]) => `<p class="lbl">${esc(label)}</p><div class="chips bcchips">${DATA.filter(f).map(chip).join('')}</div>`).join('')}
    </section>
    <section class="card bcabout">
      <h2><span class="bcrn">${fmt(b.rn)}</span> ${esc(b.name)} <small>${fmt(chordsOf(b).map((c) => name(T.transpose(t, c.iv), c.q)).join(' – '))} in ${kn} · ${cfg.prefix === 'borrow' ? 'from ' : ''}${esc(b.from)}</small></h2>
      <dl class="fsglance">${cfg.prefix === 'borrow' ? `<dt>Borrowed from</dt><dd>${fromHTML(b, t)}</dd>` : ''}<dt>Where it comes from</dt><dd>${fmt(b.where)}</dd><dt>How to use it</dt><dd>${fmt(b.how)}</dd><dt>Sound</dt><dd>${fmt(b.sound)}</dd></dl>
      <p class="note">${cfg.prefix === 'borrow' ? 'Borrowed from: the first is the usual source; any of them works, each a slightly different colour. ' : ''}The text is written in C (or A minor where it says so); the chords and scales above and below are in ${kn}.</p>
    </section>
    <section class="card bcshapes">
      <h2>In every CAGED shape of ${kn}</h2>
      <p class="note">Home chord, then ${fmt(b.rn)}, inside the same shape: the ringed notes are the ones held over. Tap a shape to hear the change.</p>
      ${G.SHAPES.map(shapeRow).join('')}
    </section>
    <section class="card bcprogs">
      <h2>Progressions that use it</h2>
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
    if (d.practise) { A.hush(); O.lastProg = d.practise; save(); return onPractise(d.practise, d.minor === '1', O.key, O.where); }
  };
  draw();
  // back from a run: straight to the progression just played
  if (O.lastProg) { const el = $app.querySelector(`[data-practise="${O.lastProg}"]`); O.lastProg = null; save(); if (el) requestAnimationFrame(() => el.closest('.bcprog').scrollIntoView({ block: 'center' })); }
  return () => A.hush();
}
