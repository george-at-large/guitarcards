// The CBT toolkit. Each tool is a short flow that saves a record:
//   thought record  situation → feelings → hot thought → thinking traps → evidence → balanced thought → re-rate
//   decatastrophise worry → worst / best / most likely → how I'd cope → how likely, really
//   one small step  behavioural activation: pick a small action sized to your energy, rate mood before and after
//   urge surfing    name the urge, ride it out for two minutes, re-rate
//   breathe         paced breathing with a moving guide
//   ground          5-4-3-2-1 senses
import * as S from './store.js';
import { h, flow, chips, rating, area, toast, clock } from './ui.js';
import { TRAPS, TRAP, EVIDENCE_QS, FEELINGS, ACTIVITIES, URGES } from './data.js';

let refreshApp = () => {};
export const onSaved = (fn) => { refreshApp = fn; };
const saved = (msg) => { toast(msg); refreshApp(); };

// ---------- thought record ----------
export function thoughtRecord(pre = {}) {
  const r = { situation: pre.situation || '', feelings: new Set(pre.feelings || []), intensity: pre.intensity ?? null,
    thought: pre.thought || '', belief: null, traps: new Set(), evFor: '', evAgainst: '', balanced: '', balancedBelief: null,
    intensityAfter: null, beliefAfter: null, entryId: pre.entryId || null };
  const near = FEELINGS.map((f) => f[0]).filter((w) => !['okay', 'neutral', 'meh'].includes(w));
  flow({
    title: 'Thought record',
    steps: [
      { title: 'What was happening?', hint: 'Where were you, who with, what had just happened? Just the facts, like a camera would record it.',
        body: () => area(r, 'situation', 'e.g. In the meeting, my manager said the report needs more work', 4) },
      { title: 'What did you feel?', hint: 'Pick the feelings, then rate how strong the main one is.',
        body: () => h('div', {}, chips(near.filter((w) => FEELINGS.find((f) => f[0] === w)[1] < 0.1), r.feelings), rating(r, 'intensity', 'Strength (0–100):')) },
      { title: 'What went through your mind?', hint: 'The hot thought: the one that carries the most feeling. Questions can hide a thought (“Why do I always…?”), so write it as a statement.',
        body: () => h('div', {}, area(r, 'thought', 'e.g. I’m going to get found out as not good enough', 3), rating(r, 'belief', 'How much do you believe it (0–100):')) },
      { title: 'Any thinking traps?', hint: 'Tick any that fit. Most hot thoughts have one or two.',
        body: (ctx) => h('div.traps', {}, TRAPS.map(([id, name, gloss]) => h('label.trap' + (r.traps.has(id) ? '.on' : ''), {},
          h('input', { type: 'checkbox', checked: r.traps.has(id), onchange: (e) => { e.target.checked ? r.traps.add(id) : r.traps.delete(id); ctx.refresh(); } }),
          h('div', {}, h('b', {}, name), h('span', {}, gloss))))) },
      { title: 'Weigh the evidence', hint: 'Treat the thought as a guess to test, not a fact.',
        body: () => h('div', {},
          h('label.lbl', {}, 'What supports it?'), area(r, 'evFor', 'Facts only', 3),
          h('label.lbl', {}, 'What doesn’t fit it?'), area(r, 'evAgainst', 'Facts that point the other way, exceptions, things you’re leaving out', 4),
          h('details.qs', {}, h('summary', {}, 'Questions that help'), h('ul', {}, [...EVIDENCE_QS, ...[...r.traps].map((t) => TRAP[t].ask)].map((q) => h('li', {}, q))))) },
      { title: 'A more balanced thought', hint: 'Not forced positivity: a version that takes all the evidence into account. It can start “Even though…”.',
        body: () => h('div', {},
          r.thought ? h('blockquote', {}, r.thought) : null,
          r.traps.size ? h('ul.asks', {}, [...r.traps].map((t) => h('li', {}, h('b', {}, TRAP[t].name, ': '), TRAP[t].ask))) : null,
          area(r, 'balanced', 'e.g. Even though the report needs work, feedback on a draft is normal and they’ve been happy with my last three pieces', 4),
          rating(r, 'balancedBelief', 'How much do you believe this (0–100):')) },
      { title: 'Re-rate', hint: 'Now, after looking at it:',
        body: () => h('div', {},
          rating(r, 'intensityAfter', `Strength of the feeling${r.intensity != null ? ` (was ${r.intensity})` : ''}:`),
          rating(r, 'beliefAfter', `Belief in the original thought${r.belief != null ? ` (was ${r.belief})` : ''}:`)), next: 'Save' },
    ],
    onDone: () => {
      S.addRecord('thought', { ...r, feelings: [...r.feelings], traps: [...r.traps] });
      const d = r.intensity != null && r.intensityAfter != null ? r.intensity - r.intensityAfter : null;
      saved(d > 0 ? `Saved. The feeling dropped ${d} points.` : 'Saved. Looking at a thought counts, even when the feeling stays.');
    },
  });
}

// ---------- decatastrophise ----------
export function decatastrophise(pre = {}) {
  const r = { worry: pre.worry || '', worst: '', best: '', likely: '', cope: '', chance: null, anxiety: null, anxietyAfter: null };
  flow({
    title: 'Decatastrophise',
    steps: [
      { title: 'What’s the worry?', body: () => h('div', {}, area(r, 'worry', 'e.g. I’ll mess up the presentation', 3), rating(r, 'anxiety', 'How anxious (0–100):')) },
      { title: 'Worst case', hint: 'Let it play out. What’s the worst that could realistically happen?', body: () => area(r, 'worst', '', 3) },
      { title: 'Best case', hint: 'Now the other end: the best that could happen.', body: () => area(r, 'best', '', 3) },
      { title: 'Most likely', hint: 'Somewhere between the two. What will probably happen?', body: () => area(r, 'likely', '', 3) },
      { title: 'If the worst happened…', hint: 'What would you do? Who could help? Have you got through something like it before?', body: () => area(r, 'cope', '', 4) },
      { title: 'Re-rate', body: () => h('div', {}, rating(r, 'chance', 'Chance the worst case happens (%):'), rating(r, 'anxietyAfter', `How anxious now${r.anxiety != null ? ` (was ${r.anxiety})` : ''}:`)), next: 'Save' },
    ],
    onDone: () => { S.addRecord('decat', r); saved('Saved.'); },
  });
}

// ---------- behavioural activation ----------
export function smallStep(energy = 0) {
  const level = energy < -0.3 ? 1 : energy < 0.3 ? 2 : 3;
  const mine = S.settings().myActivities.map((a) => [a, 'mine', 1]);
  const pool = [...mine, ...ACTIVITIES].filter((a) => a[2] <= level);
  const shuffled = pool.slice().sort(() => Math.random() - 0.5);
  const r = { activity: null, kind: null, before: null, custom: '' };
  let shown = shuffled.slice(0, 5);
  flow({
    title: 'One small step',
    steps: [
      { title: 'Pick one small thing', hint: 'Action comes before motivation, not after. Choose something you could start in the next ten minutes.',
        body: (ctx) => h('div', {},
          h('div.picks', {}, shown.map(([a, kind]) => h('button.pick' + (r.activity === a ? '.on' : ''), { type: 'button', onclick: () => { r.activity = a; r.kind = kind; ctx.refresh(); } },
            a, h('small', {}, kind)))),
          h('button.link', { type: 'button', onclick: () => { shown = pool.slice().sort(() => Math.random() - 0.5).slice(0, 5); ctx.refresh(); } }, 'Show others'),
          h('label.lbl', {}, 'Or your own:'),
          h('input', { type: 'text', value: r.custom, placeholder: 'e.g. Put the washing on', oninput: (e) => { r.custom = e.target.value; r.activity = r.custom.trim() || null; r.kind = 'mine'; ctx.enableNext(); } })),
        canNext: () => !!r.activity },
      { title: 'Before you start', body: () => h('div', {}, h('blockquote', {}, r.activity), rating(r, 'before', 'Mood right now (0 = worst, 100 = best):')), next: 'I’ll do it now' },
    ],
    onDone: () => {
      if (r.custom.trim() && !S.settings().myActivities.includes(r.custom.trim())) { S.settings().myActivities.push(r.custom.trim()); S.save(); }
      S.addRecord('activity', { activity: r.activity, kind: r.kind, before: r.before, done: false });
      saved('Go. Come back and mark it done; the app will ask how you feel.');
    },
  });
}
export function finishStep(rec) {
  const r = { after: null, mastery: null, pleasure: null };
  flow({
    title: 'How did it go?',
    steps: [{ title: rec.activity, hint: `Started ${clock(rec.t)}.`, body: () => h('div', {},
      rating(r, 'after', `Mood now${rec.before != null ? ` (was ${rec.before})` : ''}:`),
      rating(r, 'pleasure', 'Enjoyment (0–100):'), rating(r, 'mastery', 'Sense of achievement (0–100):')), next: 'Save' }],
    onDone: () => { Object.assign(rec, r, { done: true, doneAt: Date.now() }); S.save(); saved(r.after != null && rec.before != null && r.after > rec.before ? `Mood up ${r.after - rec.before}. Noted.` : 'Noted. Doing it counts.'); },
  });
}
export function skipStep(rec) { rec.done = 'skipped'; S.save(); refreshApp(); }

// ---------- urge surfing ----------
export function urgeSurf(pre = {}) {
  const r = { urge: pre.urge || null, strength: null, after: null, acted: null };
  const sel = { value: r.urge };
  flow({
    title: 'Urge surfing',
    steps: [
      { title: 'What’s the urge?', hint: 'Urges rise, peak and fall like a wave, usually within a few minutes, if you don’t feed them.',
        body: () => h('div', {}, chips(URGES.filter((u) => u !== 'nothing in particular'), sel, { single: true, onChange: () => { r.urge = sel.value; } }), rating(r, 'strength', 'Strength (0–100):')) },
      { title: 'Ride it out', hint: 'Two minutes. Notice where the urge sits in your body. Breathe into it. Watch it change without acting on it.',
        body: (ctx) => timer(120, ['Where in your body do you feel it?', 'Is it sharp, dull, hot, tight?', 'Is it rising, peaking or falling?', 'Breathe out slowly. Let it be there.', 'Notice it shift, even a little.'], ctx), next: 'Done' },
      { title: 'Now', body: () => h('div', {}, rating(r, 'after', `Strength now${r.strength != null ? ` (was ${r.strength})` : ''}:`),
        h('label.lbl', {}, 'Did you act on it?'), chips(['no', 'a bit', 'yes'], { get value() { return r.acted; }, set value(v) { r.acted = v; } }, { single: true })), next: 'Save' },
    ],
    onDone: () => { S.addRecord('urge', r); saved('Saved. Each wave you ride makes the next one easier.'); },
  });
}
function timer(seconds, cues, ctx) {
  const num = h('div.bignum', {}, fmt(seconds));
  const cue = h('p.cue', {}, cues[0]);
  let left = seconds;
  const iv = setInterval(() => {
    if (!document.body.contains(num)) return clearInterval(iv);
    left--; num.textContent = fmt(Math.max(0, left));
    cue.textContent = cues[Math.min(cues.length - 1, Math.floor(((seconds - left) / seconds) * cues.length))];
    if (left <= 0) { clearInterval(iv); cue.textContent = 'Done. Notice how it is now.'; navigator.vibrate?.(200); }
  }, 1000);
  return h('div.timer', {}, num, cue);
}
const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

// ---------- breathing ----------
const PATTERNS = [
  ['Long exhale', [['in', 4], ['out', 6]], 'Out-breath longer than the in-breath: the quickest way to settle.'],
  ['Box', [['in', 4], ['hold', 4], ['out', 4], ['hold', 4]], 'Steadying when you need to stay alert.'],
  ['Sigh', [['in', 2], ['in more', 1], ['out', 6]], 'Two sips in through the nose, one long sigh out.'],
];
export function breathe() {
  const st = { p: 0, minutes: 1, running: false };
  let stop = () => {};
  flow({
    title: 'Breathe',
    onClose: () => stop(),
    steps: [{ body: (ctx) => {
      stop();
      const [, seq, desc] = PATTERNS[st.p];
      const orb = h('div.orb'), word = h('div.orbword', {}, 'Ready'), left = h('div.muted', {});
      const view = h('div.breathe', {},
        h('div.seg', {}, PATTERNS.map(([n], k) => h('button' + (k === st.p ? '.on' : ''), { type: 'button', onclick: () => { st.p = k; st.running = false; ctx.refresh(); } }, n))),
        h('p.hint', {}, desc),
        h('div.orbwrap', {}, orb, word), left,
        h('div.seg', {}, [1, 2, 3].map((m) => h('button' + (m === st.minutes ? '.on' : ''), { type: 'button', onclick: () => { st.minutes = m; st.running = false; ctx.refresh(); } }, `${m} min`))),
        h('button.primary.wide', { type: 'button', onclick: () => { st.running = !st.running; ctx.refresh(); } }, st.running ? 'Stop' : 'Start'));
      if (st.running) {
        let k = 0, alive = true;
        const end = Date.now() + st.minutes * 60000;
        const tick = () => {
          if (!alive || !document.body.contains(orb)) return;
          if (Date.now() >= end) { word.textContent = 'Done'; orb.style.transform = 'scale(0.6)'; st.running = false; S.addRecord('breathe', { pattern: PATTERNS[st.p][0], minutes: st.minutes }); navigator.vibrate?.(150); return; }
          const [phase, secs] = seq[k % seq.length];
          word.textContent = phase;
          orb.style.transition = `transform ${secs}s ease-in-out`;
          orb.style.transform = phase.startsWith('in') ? (phase === 'in more' ? 'scale(1.08)' : 'scale(1)') : phase === 'out' ? 'scale(0.6)' : orb.style.transform;
          left.textContent = fmt(Math.ceil((end - Date.now()) / 1000)) + ' left';
          k++; setTimeout(tick, secs * 1000);
        };
        requestAnimationFrame(tick);
        stop = () => { alive = false; };
      }
      return view;
    }, hideNext: true }],
  });
}

// ---------- grounding ----------
export function ground() {
  const r = { see: '', touch: '', hear: '', smell: '', taste: '' };
  const steps = [['see', 5, 'things you can see'], ['touch', 4, 'things you can feel or touch'], ['hear', 3, 'things you can hear'], ['smell', 2, 'things you can smell'], ['taste', 1, 'thing you can taste']]
    .map(([k, n, what]) => ({ title: `${n} ${what}`, hint: 'Look slowly. Name them, in your head or here.', body: () => area(r, k, 'Optional', 2) }));
  steps.at(-1).next = 'Done';
  flow({ title: '5-4-3-2-1', steps, onDone: () => { S.addRecord('ground', r); saved('Back in the room.'); } });
}

export const TOOLS = [
  ['Thought record', 'Catch a hot thought, test it, find a balanced one.', () => thoughtRecord()],
  ['One small step', 'Behavioural activation: a small action sized to your energy.', () => smallStep()],
  ['Decatastrophise', 'Worst, best and most likely, and how you’d cope.', () => decatastrophise()],
  ['Urge surfing', 'Ride out an urge for two minutes instead of acting on it.', () => urgeSurf()],
  ['Breathe', 'One to three minutes of paced breathing.', () => breathe()],
  ['5-4-3-2-1', 'Grounding through the senses when you’re spun up.', () => ground()],
];
