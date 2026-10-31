// Rhythm notation: slot timing, an ultra-explicit grid (counts, strokes, accents, hand motion, swing
// drawn proportionally), a compás clock for 12-beat cycles, and a generated "how to play this" guide.
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export function meterInfo(meter = '4/4') {
  const [n, d] = String(meter).split('/').map(Number);
  return { beats: n || 4, unit: d || 4 };
}
export function rhythmSlots(spec) {
  const { beats, unit } = meterInfo(spec.meter);
  const grid = spec.grid || 2;
  let slots;
  let isPick = false;
  if (spec.pick) { slots = String(spec.pick).replace(/\|/g, ' ').trim().split(/\s+/).filter(Boolean); isPick = true; }
  else slots = String(spec.pattern || '').replace(/[\s|]/g, '').split('');
  return { beats, unit, grid, slots, isPick, perBar: beats * grid, bars: Math.max(1, Math.ceil(slots.length / (beats * grid))) };
}
// 0 = straight, 0.67 = triplet swing (long note = 2/3 of the beat)
export const swingFrac = (s) => 0.5 + Math.min(0.67, s || 0) * 0.25;
// where each slot starts inside its beat (0..1)
export function slotOffsets(grid, swing) {
  if (swing && grid === 2) { const f = swingFrac(swing); return [0, f]; }
  if (swing && grid === 4) { const f = swingFrac(swing); return [0, f / 2, 0.5, 0.5 + f / 2]; }
  return [...Array(grid).keys()].map((k) => k / grid);
}
export const slotBeat = (i, grid, swing) => Math.floor(i / grid) + slotOffsets(grid, swing)[i % grid];

// ---------- counting ----------
const SUB = { 1: [''], 2: ['', '&'], 3: ['', 'trip', 'let'], 4: ['', 'e', '&', 'a'], 5: ['', 'ta', 'ka', 'di', 'mi'], 6: ['', 'la', 'li', '&', 'la', 'li'], 8: ['', 'e', '&', 'a', '', 'e', '&', 'a'] };
export function countLabels(spec) {
  const { beats, unit, grid, slots, perBar } = rhythmSlots(spec);
  const total = Math.max(slots.length, perBar);
  const out = [];
  const cycle = spec.cycle || (spec.startCount || spec.count === 'compas' ? 12 : beats);
  for (let i = 0; i < total; i++) {
    const beatInBar = Math.floor((i % perBar) / grid);
    const k = i % grid;
    let beatName;
    if (spec.count === 'compound' && unit === 8 && grid === 1) {
      // 6/8, 9/8, 12/8 felt in dotted quarters: 1 & a 2 & a ...
      const big = Math.floor(beatInBar / 3) + 1;
      beatName = ['', '&', 'a'][beatInBar % 3] || String(big);
      if (beatInBar % 3 === 0) beatName = String(big);
    } else if (spec.startCount || spec.count === 'compas') {
      const start = spec.startCount || 1;
      const absBeat = Math.floor(i / grid);
      beatName = String(((start - 1 + absBeat) % cycle) + 1);
    } else beatName = String(beatInBar + 1);
    out.push(k === 0 ? beatName : (SUB[grid] || [])[k] ?? '');
  }
  return out;
}

// strum direction a constant-motion hand would be making on slot i (null if the grid has no constant motion)
function motionDir(i, grid) { if (grid === 1) return null; return i % 2 === 0 ? 'D' : 'U'; }
function constantMotion(spec, slots) {
  const grid = spec.grid || 2;
  if (grid === 1 || spec.pick) return false;
  // every sounding stroke matches the down-on-even / up-on-odd rule
  let n = 0;
  for (let i = 0; i < slots.length; i++) {
    const t = slots[i];
    if (t === 'D' || t === 'd') { if (i % 2) return false; n++; }
    if (t === 'U' || t === 'u') { if (i % 2 === 0) return false; n++; }
  }
  return n > 0;
}

const STRUM = {
  D: ['↓', 'down-strum'], U: ['↑', 'up-strum'], d: ['⇣', 'muted down-strum (scratch: fretting hand lies on the strings, no pitch)'], u: ['⇡', 'muted up-strum (scratch)'],
  X: ['✕', 'percussive hit: slap / chuck / golpe (no notes)'], R: ['R', 'rasgueado: fingers flick out one after another (4 quick strokes)'], T: ['T', 'thumb plays the bass note'],
  '-': ['', 'hand keeps moving but misses the strings'], '.': ['·', 'rest: stop the sound'],
};
const STROKE = { D: '⊓', U: 'V' };

// ---------- grid HTML ----------
export function rhythmHTML(spec, cursor = -1) {
  const { beats, unit, grid, slots, isPick, perBar, bars } = rhythmSlots(spec);
  const accents = new Set(spec.accents || []);
  const labels = countLabels(spec);
  const offs = slotOffsets(grid, spec.swing);
  const widths = offs.map((o, k) => (offs[k + 1] ?? 1) - o);
  const motion = constantMotion(spec, slots);
  const strokes = isPick && spec.strokes ? splitTokens(spec.strokes) : null;
  const fingers = isPick && spec.fingers ? splitTokens(spec.fingers) : null;
  const used = new Set();
  let h = `<div class="rhy">${headerHTML(spec)}`;
  if (isCompas(spec)) h += compasClock(spec);
  h += '<div class="rgrid">';
  for (let b = 0; b < bars; b++) {
    h += `<div class="rbar"><span class="rbarn">${bars > 1 ? 'bar ' + (b + 1) : ''}</span><div class="rbeats">`;
    for (let bt = 0; bt < beats; bt++) {
      const beatAcc = [...Array(grid).keys()].some((k) => accents.has(b * perBar + bt * grid + k));
      h += `<div class="rbeat ${grid === 1 && beatAcc ? 'bacc' : ''}">`;
      for (let k = 0; k < grid; k++) {
        const i = b * perBar + bt * grid + k;
        const tok = slots[i] ?? '.';
        let symHTML = '';
        let cls = '';
        if (isPick) {
          if (tok === '-' || tok === '.') { symHTML = '·'; cls = 'rest'; used.add('.'); }
          else symHTML = esc(tok);
        } else {
          used.add(tok);
          symHTML = esc((STRUM[tok] || [tok])[0]);
          if (tok === '-') { cls = 'rest'; if (motion) symHTML = `<i class="ghostarrow">${motionDir(i, grid) === 'D' ? '↓' : '↑'}</i>`; }
          if (tok === '.') cls = 'rest';
          if (tok === 'd' || tok === 'u') cls = 'ghost';
        }
        const acc = accents.has(i);
        const st = strokes ? strokes[i] : null;
        const fg = fingers ? fingers[i] : null;
        h += `<div class="rslot ${cls} ${acc ? 'acc' : ''} ${i === cursor ? 'cur' : ''}" style="flex-grow:${widths[k].toFixed(3)}" data-i="${i}">` +
          `<span class="racc">${acc ? '&gt;' : ''}</span>` +
          `<span class="rsym">${symHTML}</span>` +
          (st || fg ? `<span class="rstroke">${esc(st && st !== '-' && st !== '.' ? (STROKE[st.toUpperCase()] || st) : '')}${fg && fg !== '-' && fg !== '.' ? esc(fg) : ''}</span>` : '') +
          `<span class="rcount ${k === 0 ? 'beatn' : ''}">${esc(labels[i])}</span></div>`;
      }
      h += '</div>';
    }
    h += '</div></div>';
  }
  h += '</div>';
  h += legendHTML(spec, used, motion, isPick, !!strokes, !!fingers);
  return h + '</div>';
}
function splitTokens(s) {
  const t = String(s).replace(/\|/g, ' ').trim();
  return /\s/.test(t) ? t.split(/\s+/).filter(Boolean) : t.split('');
}
export function isCompas(spec) {
  const { beats, grid } = rhythmSlots(spec);
  return spec.count === 'compas' || !!spec.startCount || (beats === 12 && grid === 1 && spec.count !== 'compound');
}
function feelText(spec) {
  const g = spec.grid || 2;
  if (spec.swing >= 0.6) return g === 4 ? 'swung 16ths (triplet feel)' : 'swing / shuffle — long-short in a 2:1 triplet ratio';
  if (spec.swing > 0) return g === 4 ? 'lightly swung 16ths' : 'light swing — slightly long-short';
  if (g === 1 && isCompas(spec)) return '12-count compás, one stroke per count';
  return { 1: 'one stroke slot per beat', 2: 'straight 8ths', 3: 'triplets — 3 even notes per beat', 4: 'straight 16ths', 5: 'quintuplets — 5 even notes per beat', 6: 'sextuplets — 6 even notes per beat' }[g] || `${g} per beat`;
}
function headerHTML(spec) {
  const { beats, unit } = meterInfo(spec.meter);
  const acc = (spec.accents || []);
  const labels = countLabels(spec);
  const accTxt = acc.length ? `accents on <b>${[...new Set(acc.map((i) => labels[i]))].map(esc).join(' · ')}</b>` : '';
  return `<div class="rhead"><span class="rmeter">${esc(spec.meter || '4/4')}</span> ${esc(feelText(spec))}${accTxt ? ' · ' + accTxt : ''}</div>`;
}
function legendHTML(spec, used, motion, isPick, hasStrokes, hasFingers) {
  const items = [];
  if (isPick) {
    items.push('<b>numbers</b> = which string to pick (1 = high e … 6 = low E); <b>a+b</b> = pluck together');
    if (hasStrokes) items.push('<b>⊓</b> downstroke · <b>V</b> upstroke');
    if (hasFingers) items.push('<b>p</b> thumb · <b>i</b> index · <b>m</b> middle · <b>a</b> ring');
    if (used.has('.')) items.push('<b>·</b> = no note');
  } else {
    for (const t of ['D', 'U', 'd', 'u', 'X', 'R', 'T', '.']) if (used.has(t)) items.push(`<b class="${t === 'd' || t === 'u' ? 'ghosttxt' : ''}">${STRUM[t][0]}</b> ${STRUM[t][1]}`);
    if (used.has('-')) items.push(motion ? '<i class="ghostarrow">↓↑</i> faint arrow = hand keeps moving that way but <b>misses</b> the strings' : 'blank = no stroke (let it ring)');
  }
  if ((spec.accents || []).length) items.push('<b class="acctxt">&gt;</b> accent: play it louder');
  if (spec.swing) items.push('slots are drawn to scale: in swing the on-beat note is longer than the off-beat');
  return `<div class="rlegend">${items.map((x) => `<span>${x}</span>`).join('')}</div>`;
}
function compasClock(spec) {
  const labels = countLabels(spec);
  const acc = new Set((spec.accents || []).map((i) => Number(labels[i])));
  const R = 62, C = 78;
  let g = `<circle cx="${C}" cy="${C}" r="${R + 14}" class="clockring"/>`;
  for (let n = 1; n <= 12; n++) {
    const a = (n % 12) / 12 * Math.PI * 2 - Math.PI / 2;
    const x = C + R * Math.cos(a), y = C + R * Math.sin(a);
    const slot = labels.findIndex((l) => Number(l) === n);
    g += `<g class="cnum ${acc.has(n) ? 'acc' : ''}" data-i="${slot}"><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${acc.has(n) ? 14 : 10}"/><text x="${x.toFixed(1)}" y="${(y + 4.5).toFixed(1)}">${n}</text></g>`;
  }
  g += `<text x="${C}" y="${C + 4}" class="clockc">compás</text>`;
  return `<div class="clockwrap"><svg viewBox="0 0 ${2 * C} ${2 * C}" class="compasclock">${g}</svg><div class="clocknote small">Read it like a clock: 12 beats in a circle, the big circles are the accents. Count every number out loud; play loud on the big ones.</div></div>`;
}

// ---------- "how to play this" (generated, so always matches the pattern) ----------
export function howToPlay(spec) {
  const { beats, grid, slots, isPick, perBar, bars } = rhythmSlots(spec);
  const labels = countLabels(spec);
  const accents = new Set(spec.accents || []);
  const motion = constantMotion(spec, slots);
  const lines = [];
  const name = (t) => isPick ? (t === '-' || t === '.' ? 'nothing' : `string ${t.replace(/\+/g, ' + ')}`) : ({ D: 'down', U: 'up', d: 'muted down', u: 'muted up', X: 'slap/chuck', R: 'rasgueado', T: 'thumb bass', '-': motion ? 'miss' : '—', '.': 'rest' }[t] || t);
  lines.push(`**Count:** say *${labels.slice(0, Math.min(labels.length, perBar)).join(' ')}* out loud — one syllable per slot${spec.swing ? ', swung (long–short, see below)' : ', perfectly evenly'}.`);
  const beatLines = [];
  for (let b = 0; b < Math.min(bars, 2); b++) {
    for (let bt = 0; bt < beats; bt++) {
      const parts = [];
      for (let k = 0; k < grid; k++) {
        const i = b * perBar + bt * grid + k;
        const t = slots[i] ?? '.';
        const strokeDir = isPick && spec.strokes ? splitTokens(spec.strokes)[i] : null;
        let s = `${labels[i] || '·'}: ${name(t)}${strokeDir && /[DU]/i.test(strokeDir) ? (strokeDir.toUpperCase() === 'D' ? ' (downstroke)' : ' (upstroke)') : ''}`;
        if (accents.has(i)) s = `**${s} (LOUD)**`;
        parts.push(s);
      }
      beatLines.push(`- ${bars > 1 ? `bar ${b + 1}, ` : ''}beat ${bt + 1} → ${parts.join(' · ')}`);
    }
  }
  if (beats * grid <= 48) lines.push('**Slot by slot:**\n' + beatLines.join('\n'));
  if (motion) lines.push(`**Hand motion:** keep the strumming hand swinging down–up in ${grid === 4 ? '16ths' : grid === 2 ? '8ths' : 'the grid'} the whole time — down on the numbers${grid === 4 ? ' and the &s' : ''}, up on the ${grid === 4 ? 'e’s and a’s' : '&s'}. The rhythm comes from *when you touch the strings*, not from changing the motion. A faint arrow means “move, but miss”.`);
  if (spec.swing >= 0.6) lines.push('**Swing / shuffle:** each beat is split **long–short, 2 : 1** — like the first and third notes of a triplet. Say *“1-trip-LET, 2-trip-LET”*: play on the number and on *let* — that is where the swung *&* lands — never on *trip*. (Straight 8ths split the beat 1 : 1; swing makes the first note twice as long as the second.)');
  else if (spec.swing > 0) lines.push('**Light swing:** the off-beat arrives a little late — between straight and full triplet swing. Lean on the downbeat, lay back the off-beat.');
  if (grid === 3 && !spec.swing) lines.push('**Triplets:** three *equal* notes per beat — *1-trip-let*. Don’t rush the first two or drag the last.');
  if (isCompas(spec)) lines.push('**Compás:** this is a 12-count cycle, not 4/4. Count every number; the loud strokes fall on the accented numbers. Clapping it (palmas) before playing it helps.');
  const checks = [
    'Turn the click on and play **with** the demo (Loop ∞) until you can’t hear yourself separately.',
    'Then tap **Your turn**: the demo plays a bar, then you play a bar with only the click. You should land exactly where the demo did.',
    'Count out loud while you play. Every LOUD syllable must line up with a loud stroke.',
    'Start at ½× and only speed up after four clean loops in a row.',
  ];
  if (motion) checks.splice(2, 0, 'Watch your strumming hand: it never stops or pauses, even on the silent slots.');
  if (spec.swing) checks.push('If it sounds like a march, it’s too straight; if it limps, the long note is too long.');
  lines.push('**Check yourself:**\n' + checks.map((c) => '- ' + c).join('\n'));
  return lines.join('\n\n');
}
