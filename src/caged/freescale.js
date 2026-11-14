// Free scale practice: one screen, no setup. A key, a mode from any harmonic system (listed from most useful to most
// exotic, each with its family), the whole neck showing it, a drone on the key note (with or without the 5th) and a
// metronome you set on screen. While it plays, facts about when the mode is useful scroll by.
import * as T from '../theory.js';
import * as F from '../fretboard.js';
import * as A from '../audio.js';
import * as SC from './scales.js';

const BY = Object.fromEntries(SC.SCALES.map((s) => [s.id, s]));
const IVN = ['1', '♭2', '2', '♭3', '3', '4', '♯4', '5', '♭6', '6', '♭7', '7'];
const KEYS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
const pcs = (id) => [...new Set(BY[id].ivs.map((iv) => T.intervalSemis(F.simpleIv(iv)) % 12))];

// most useful first
export const TIERS = [
  ['Essentials', ['ionian', 'aeolian', 'min-pent', 'maj-pent', 'blues']],
  ['Everyday modes', ['dorian', 'mixolydian']],
  ['Colour', ['lydian', 'phrygian', 'harm-min', 'mel-min', 'maj-blues', 'dom-pent']],
  ['Jazz', ['altered', 'lyd-dom', 'locrian-n2', 'dim-hw', 'whole-tone', 'bebop-dom', 'mixo-b6', 'phryg-dom', 'm6-pent']],
  ['Deeper', ['locrian', 'dim-wh', 'dorian-b2', 'lyd-aug', 'harm-maj', 'bebop-maj', 'bebop-dor', 'dorian-s4', 'ionian-s5', 'locrian-n6', 'lydian-s2', 'superloc-bb7', 'aug-hex']],
  ['Exotic', ['dbl-harm', 'hung-min', 'hung-maj', 'neap-min', 'neap-maj', 'persian', 'enigmatic', 'prometheus', 'hirajoshi', 'in-sen']],
];
const FAMILY = { pent: 'pentatonic', mode: 'major-scale mode', mm: 'melodic minor', hm: 'harmonic minor', hmaj: 'harmonic major', sym: 'symmetric', bebop: 'bebop', exotic: 'exotic' };

// facts about when each mode is useful (the most used ones by hand; the rest built from what the scale is)
const FACTS = {
  ionian: ['The major scale: home base for most pop, folk, country and classical melodies.', 'Over a maj7 chord the 4th is the note to pass through, not sit on: it rubs a half step above the 3rd.', 'Every other church mode is this scale from another note: learn it everywhere first.', 'Use it over I, IV (carefully) and V in a major key: the key’s own notes.'],
  aeolian: ['Natural minor: the sad, plain minor of rock and pop ballads.', 'Its ♭6 aches down to the 5th: lean on it over the i chord.', 'The relative minor: the same notes as the major scale a minor 3rd up.', 'Use it over i–♭VI–♭VII progressions, the epic minor sound.'],
  'min-pent': ['The rock and blues workhorse: five notes, no half steps, nothing to clash.', 'Works over minor chords, and over major and dominant chords in blues, where its ♭3 rubs the 3.', 'Five boxes cover the neck; most licks you know live in box 1.', 'Bend the ♭3 a quarter step towards the 3 for the blues sound.'],
  'maj-pent': ['Bright and open: country, soul, gospel and pop solos.', 'The same notes as the minor pentatonic a minor 3rd down.', 'Over a major chord nothing clashes: every note is safe.', 'Add the ♭3 as a passing note for the major blues sound.'],
  blues: ['Minor pentatonic plus the ♭5 blue note.', 'Pass through the ♭5, don’t sit on it: it’s grit, not a resting place.', 'Works over all three chords of a 12-bar blues.', 'The sound of rock, blues and a lot of soul and funk soloing.'],
  dorian: ['Minor with a bright natural 6: cool rather than sad.', 'Use it over m7 chords, especially ii in a major key and the i of a minor vamp (i–IV).', 'Funk, jazz, Santana, Celtic tunes: the minor with a lift.', 'The 6 is its colour note: lean on it over the minor chord.'],
  mixolydian: ['Major with a ♭7: the dominant sound, bluesy and rock.', 'Use it over dominant 7th chords and I–♭VII–IV rock vamps.', 'The ♭7 is its colour note: it stops the major sounding too sweet.', 'Funk, jam bands, folk and rock riffs live here.'],
  lydian: ['The brightest mode: major with a raised 4th.', 'Use it over a maj7 chord when you want it to float, especially IV in a major key.', 'The ♯4 is its colour: film scores and dreamy pop love it.', 'A I–II vamp says Lydian straight away.'],
  phrygian: ['Minor with a ♭2: dark, Spanish, metal.', 'The ♭2 a half step above the root is everything: lean on it and fall to the root.', 'Use it over a minor chord vamping with ♭II.', 'Flamenco and metal riffs often sit on i–♭II.'],
  'harm-min': ['Minor with a major 7th: classical drama, the leading tone pulling home.', 'The gap between ♭6 and 7 (an augmented 2nd) gives it its exotic sound.', 'Its 5th mode, Phrygian dominant, is the V7 of a minor key.', 'Use it over the i chord, or over V7 heading to a minor chord.'],
  'mel-min': ['Minor with a major top half: the jazz minor.', 'Use it over minor-major and m6 chords, and as a tonic minor in jazz.', 'Its modes give Lydian dominant, altered and Locrian ♮2: much of modern jazz.', 'Bittersweet: minor 3rd, major 6th and 7th.'],
  altered: ['Every tension bent: ♭9, ♯9, ♯11, ♭13 over a dominant.', 'Use it over V7 just before it resolves: maximum tension, then release.', 'It’s melodic minor from a half step above the root.', 'Resolve each altered note by half step into the next chord.'],
  'lyd-dom': ['A dominant with a ♯11: bright tension that doesn’t need to resolve.', 'Use it over IV7, ♭VII7 and tritone subs (♭II7).', 'It’s melodic minor from the 5th.', 'The Simpsons theme and a lot of fusion live here.'],
  'dim-hw': ['Half step, whole step: the 7♭9 dominant scale.', 'Use it over 7♭9 and 13♭9 chords.', 'Symmetric: the same scale repeats every three frets, so one fingering moves.', 'Only three of these exist; each fits four dominant chords a minor 3rd apart.'],
  'whole-tone': ['Six whole steps: dreamlike, no centre.', 'Use it over 7♯5 and 9♯5 chords.', 'Only two whole-tone scales exist; the fingering repeats every two frets.', 'Debussy and Thelonious Monk loved it.'],
  locrian: ['The darkest mode: ♭2 and ♭5, no stable 5th.', 'Use it over half-diminished chords (often Locrian ♮2 sounds smoother).', 'Rare as a tonic: it’s mostly a colour over m7♭5.'],
  'locrian-n2': ['Half-diminished made smoother: Locrian with a natural 9.', 'Use it over m7♭5 chords, the ii of a minor ii–V–i.', 'It’s melodic minor from the ♭3.'],
  'bebop-dom': ['Mixolydian plus a passing major 7th.', 'In eighth-note runs the extra note puts chord tones on the beat.', 'Use it over dominant chords in swing and bebop.'],
  'mixo-b6': ['Major turning wistful: a ♭6 in a major scale.', 'Use it over a dominant heading to a minor chord.', 'It’s melodic minor from the 4th.'],
  'phryg-dom': ['Flamenco and klezmer: a major 3rd over ♭2 and ♭6.', 'Use it over V7 in a minor key.', 'It’s harmonic minor from the 5th.'],
  'maj-blues': ['Major pentatonic plus the ♭3 sliding into the 3.', 'Country and soul sweetness over major and dominant chords.'],
  'dom-pent': ['Mixolydian boiled down: 1 2 3 5 ♭7.', 'A clean dominant sound with no avoid note.'],
};
function factsFor(id, tonic) {
  const s = BY[id], p = pcs(id), out = [...(FACTS[id] || [])];
  if (!FACTS[id]) out.push(s.feel);
  if (s.alias) out.push(`Where it comes from: ${s.alias}.`);
  if (s.fam) out.push(`Family: ${FAMILY[s.fam] || s.fam}${p.length !== 7 ? `, ${p.length} notes` : ''}.`);
  // its own chord, stacked in 3rds from the root
  if (p.length >= 7) {
    const sorted = [...p].sort((a, b) => a - b);
    const chord = [0, 2, 4, 6].map((i) => sorted[i]);
    const name = { '0,4,7,11': 'maj7', '0,4,7,10': '7', '0,3,7,10': 'm7', '0,3,6,10': 'm7♭5', '0,3,6,9': '°7', '0,3,7,11': 'm(maj7)', '0,4,8,11': 'maj7♯5', '0,4,8,10': '7♯5', '0,4,6,10': '7♭5', '0,3,6,11': '°(maj7)' }[chord.join()];
    if (name) out.push(`Its own chord: ${T.noteName(tonic, true)}${name}. Play that chord’s tones on the strong beats.`);
  }
  const ref = p.includes(4) ? [0, 2, 4, 5, 7, 9, 11] : [0, 2, 3, 5, 7, 8, 10];
  const colour = p.length >= 7 ? p.filter((x) => !ref.includes(x)) : [];
  if (colour.length) out.push(`Its colour note${colour.length > 1 ? 's' : ''}: the ${colour.map((x) => IVN[x]).join(' and ')}, compared with plain ${p.includes(4) ? 'major' : 'minor'}. Lean on ${colour.length > 1 ? 'them' : 'it'} over the drone.`);
  out.push('Practise: from the lowest note on the neck to the highest and back, then improvise using only two strings at a time.');
  return out;
}

export function renderFreeScale($app, ctx) {
  const { D, save, neckSVG, esc, fmt, onBack, KIND } = ctx;
  const O = D.fs = Object.assign({ key: 'A', scale: 'dorian', drone: true, fifth: true, metro: false, bpm: 70, frets: 12 }, D.fs || {});
  let R = { on: false, timer: null, next: 0, beat: 0, fact: 0, factT: null, vis: [] };

  const tonic = () => T.parseNote(O.key);
  function neck() {
    const t = tonic(), s = BY[O.scale];
    const rel = pcs(O.scale);
    const p = rel, ref = p.includes(4) ? [0, 2, 4, 5, 7, 9, 11] : [0, 2, 3, 5, 7, 8, 10];
    const colour = p.length >= 7 ? p.filter((x) => !ref.includes(x)) : [];
    const notes = [];
    for (let st = 1; st <= 6; st++) for (let f = 0; f <= O.frets; f++) {
      const r = ((F.OPEN[st] + f - T.notePc(t)) % 12 + 12) % 12;
      if (!rel.includes(r)) continue;
      const iv = s.ivs.find((x) => T.intervalSemis(F.simpleIv(x)) % 12 === r) || IVN[r];
      const plain = iv.replace('♭', 'b').replace('♯', '#');
      const kind = r === 0 ? 'r' : /^(b?3|[b#]?5|b?b?7)$/.test(plain) ? KIND(plain) : colour.includes(r) || /^[b#]?(9|11|13)$/.test(plain) ? 'tx' : 'sc';
      notes.push({ string: st, fret: f, midi: F.OPEN[st] + f, iv, kind });
    }
    return neckSVG({ notes, lo: 0, hi: O.frets }, { lo: 0, hi: O.frets, labels: 'iv' });
  }
  const facts = () => factsFor(O.scale, tonic());
  function factHTML() { const f = facts(); return `<span class="lbl">when it’s useful · ${(R.fact % f.length) + 1} of ${f.length}</span><p>${fmt(f[R.fact % f.length])}</p>`; }

  // ---------- sound: the drone and the metronome ----------
  function drone() { if (R.on && O.drone) A.startDrone(36 + T.notePc(tonic()) + (T.notePc(tonic()) < 4 ? 12 : 0), O.fifth); else A.stopDrone(); }
  function clock() {
    if (!R.on) return;
    const c = A.audioCtx();
    if (R.next < c.currentTime - 0.02) R.next = c.currentTime + 0.05;
    while (R.next < c.currentTime + 0.12) {
      const t = R.next, b = R.beat++;
      if (O.metro) A.click(t, b % 4 === 0 ? 2 : 1);
      R.vis.push(setTimeout(() => document.querySelectorAll('#fsbeats i').forEach((el, i) => el.classList.toggle('on', O.metro && i === b % 4)), Math.max(0, (t - c.currentTime) * 1000)));
      if (R.vis.length > 64) R.vis.splice(0, 32);
      R.next += 60 / O.bpm;
    }
    R.timer = setTimeout(clock, 25);
  }
  function rotateFacts() {
    clearInterval(R.factT);
    R.factT = setInterval(() => { R.fact++; const el = document.getElementById('fsfact'); if (el) { el.classList.remove('in'); void el.offsetWidth; el.innerHTML = factHTML(); el.classList.add('in'); } }, 9000);
  }
  async function play() {
    A.unlockAudio().catch(() => {});
    R.on = true;
    await Promise.race([A.ensureRunning(), new Promise((r) => setTimeout(r, 500))]);
    if (!R.on) return;
    drone();
    R.next = A.audioCtx().currentTime + 0.1; R.beat = 0;
    clock(); rotateFacts();
    draw();
  }
  function stopAll() {
    R.on = false;
    clearTimeout(R.timer); clearInterval(R.factT); R.vis.forEach(clearTimeout); R.vis = [];
    A.stopDrone(); A.hush();
  }

  // ---------- the screen ----------
  function draw() {
    const s = BY[O.scale];
    const opts = TIERS.map(([tier, ids]) => `<optgroup label="${esc(tier)}">${ids.filter((id) => BY[id]).map((id) => `<option value="${id}" ${id === O.scale ? 'selected' : ''}>${esc(BY[id].name)} · ${esc(FAMILY[BY[id].fam] || '')}</option>`).join('')}</optgroup>`).join('');
    $app.innerHTML = `
    <header class="chead"><button class="icon" data-f="back" aria-label="Back">‹</button><h1>Free scales</h1><button class="icon" data-f="play" aria-label="${R.on ? 'Stop' : 'Start'}">${R.on ? '■' : '▶'}</button></header>
    <div class="fsbar">
      <div class="chips fskeys">${KEYS.map((k) => `<button class="chip ${O.key === k ? 'on' : ''}" data-key="${k}">${fmt(T.pretty(k))}</button>`).join('')}</div>
      <select id="fsscale" class="select" aria-label="Mode">${opts}</select>
      <div class="fsrow">
        <button class="chip ${O.drone ? 'on' : ''}" data-f="drone">Drone</button><button class="chip ${O.fifth ? 'on' : ''}" data-f="fifth">+ 5th</button>
        <button class="chip ${O.metro ? 'on' : ''}" data-f="metro">Metronome</button>
        <span class="fsbpm"><button data-f="bpm-" aria-label="Slower">−</button><b id="fsbpmv">${O.bpm}</b><button data-f="bpm+" aria-label="Faster">+</button></span>
      </div>
      <input type="range" id="fsbpmr" min="30" max="200" step="2" value="${O.bpm}" aria-label="Tempo">
    </div>
    <h2 class="fstitle">${fmt(T.noteName(tonic(), true))} ${esc(s.name)} <small>${esc(FAMILY[s.fam] || '')}${s.alias ? ` · ${esc(s.alias)}` : ''}</small></h2>
    <div class="beats" id="fsbeats">${O.metro ? '<i></i><i></i><i></i><i></i>' : ''}</div>
    <div class="fsfact in" id="fsfact">${factHTML()}</div>
    <div class="stage fsneck">${neck()}</div>
    <div class="legend"><span class="k r">root</span><span class="k t3">3rd</span><span class="k t5">5th</span><span class="k t7">7th</span><span class="k tx">colour note</span><span class="k sc">rest of the scale</span></div>
    <div class="chips" style="justify-content:center">${[12, 15].map((n) => `<button class="chip ${O.frets === n ? 'on' : ''}" data-frets="${n}">Frets 0–${n}</button>`).join('')}</div>
    ${R.on ? '' : '<div class="actions"><button class="primary" data-f="play">▶ Start the drone</button></div>'}`;
    const sel = $app.querySelector('#fsscale');
    sel.onchange = () => { O.scale = sel.value; R.fact = 0; save(); draw(); };
    const r = $app.querySelector('#fsbpmr');
    r.oninput = () => { O.bpm = Number(r.value); document.getElementById('fsbpmv').textContent = O.bpm; };
    r.onchange = () => save();
  }
  $app.onclick = (e) => {
    if (e.target.closest('#fsfact')) { R.fact++; const el = document.getElementById('fsfact'); if (el) el.innerHTML = factHTML(); return; } // tap the fact to move on
    const b = e.target.closest('button'); if (!b) return;
    const d = b.dataset;
    if (d.key) { O.key = d.key; save(); if (R.on) drone(); return draw(); }
    if (d.frets) { O.frets = Number(d.frets); save(); return draw(); }
    const a = d.f; if (!a) return;
    if (a === 'back') { stopAll(); return onBack(); }
    if (a === 'play') { if (R.on) { stopAll(); return draw(); } return play(); }
    if (a === 'drone' || a === 'fifth') { O[a] = !O[a]; save(); if (R.on) drone(); return draw(); }
    if (a === 'metro') { O.metro = !O.metro; save(); return draw(); }
    if (a === 'bpm-' || a === 'bpm+') { O.bpm = Math.max(30, Math.min(200, O.bpm + (a === 'bpm+' ? 2 : -2))); save(); document.getElementById('fsbpmv').textContent = O.bpm; const rr = document.getElementById('fsbpmr'); if (rr) rr.value = O.bpm; return; }
  };
  draw();
  return stopAll;
}
