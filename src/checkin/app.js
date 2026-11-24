// Check-in: experience sampling with CBT built in. Pings arrive at random moments in your waking window; each
// check-in is a tap on the mood grid (pleasantness × energy), the words that fit, what you're inclined to do,
// what you're doing and who with, and what's on your mind. Then it answers in kind: settling tools when you're
// revved up and unpleasant, a small step when you're low, a thought record when a thought is driving it, and a
// moment of savouring when things are good. Everything is stored on this device.
import * as S from './store.js';
import * as P from './schedule.js';
import * as T from './tools.js';
import { h, put, chips, scale, moodGrid, zone, flow, flowOpen, setAfterClose, toast, clock, dayName, area } from './ui.js';
import { nearestFeelings, FEELINGS, BODY, DISPOSITIONS, URGES, DOING, WITH, TRAPS, CRISIS } from './data.js';
import { renderInsights } from './insights.js';

const app = document.getElementById('checkin');
const TABS = [['home', 'Now'], ['tools', 'Tools'], ['insights', 'Insights'], ['history', 'History'], ['settings', 'Settings']];
let tab = 'home', insightRange = 30;

// ---------- the check-in ----------
function checkIn(prompt = P.pending()) {
  const st = { v: null, a: null, words: new Set(), other: '', body: new Set(), disp: {}, urges: new Set(), doing: new Set(), with: new Set(), mind: '' };
  const full = S.settings().full;
  let more = false;
  const finish = (ctx) => {
    const words = [...st.words, ...st.other.split(',').map((w) => w.trim().toLowerCase()).filter(Boolean)];
    const e = S.addEntry({ v: st.v, a: st.a, words, body: [...st.body], disp: st.disp, urges: [...st.urges], doing: [...st.doing], with: [...st.with],
      mind: st.mind.trim(), promptId: prompt?.id || null, promptAt: prompt?.t || null, mode: full ? 'full' : 'quick' });
    respond(e);
    return true;
  };
  const saveNow = (ctx) => h('button.ghost', { type: 'button', onclick: () => finish(ctx) }, 'Save now');
  const steps = [
    { title: 'Where are you right now?', hint: prompt ? `Ping from ${clock(prompt.t)}. Tap the grid: across is how pleasant, up is how much energy.` : 'Tap the grid: across is how pleasant, up is how much energy.',
      body: (ctx) => { const z = h('p.zone', {}, zone(st.v, st.a) || ' '); return h('div', {}, moodGrid(st, () => { z.textContent = zone(st.v, st.a); ctx.enableNext(); }), z); },
      canNext: () => st.v != null },
    { title: 'Which words fit?', hint: 'Pick any. Naming a feeling precisely takes some of its heat out.',
      body: (ctx) => {
        const near = nearestFeelings(st.v, st.a, 12);
        const rest = FEELINGS.map((f) => f[0]).filter((w) => !near.includes(w)).sort();
        return h('div', {}, chips(near, st.words),
          more ? chips(rest, st.words) : h('button.link', { type: 'button', onclick: () => { more = true; ctx.refresh(); } }, 'More words'),
          h('input', { type: 'text', placeholder: 'Other (comma-separated)', value: st.other, oninput: (e) => { st.other = e.target.value; } }));
      },
      next: full ? 'Next' : 'Save', extra: full ? saveNow : null },
  ];
  if (full) steps.push(
    { title: 'Right now I’m inclined to…', hint: 'Move the ones that apply; leave the rest.',
      body: () => h('div', {},
        DISPOSITIONS.map(([k, l, r]) => scale(l, r, st.disp, k)),
        h('label.lbl', {}, 'Any urges?'), chips(URGES, st.urges),
        h('label.lbl', {}, 'In your body'), chips(BODY, st.body)),
      extra: saveNow },
    { title: 'Context', body: () => h('div', {},
        h('label.lbl', {}, 'Doing'), chips(DOING, st.doing),
        h('label.lbl', {}, 'With'), chips(WITH, st.with),
        h('label.lbl', {}, 'What’s on your mind?'), area(st, 'mind', 'Optional. A thought, a worry, something good.', 3)),
      next: 'Save' });
  flow({ title: 'Check in', steps, onDone: finish });
}

// after a check-in: answer the state you're in
function respond(e) {
  const low = e.v < -0.2, high = e.a > 0.2, good = e.v > 0.2;
  const urgent = (e.v < -0.7 && e.a < -0.3) || e.words.some((w) => ['hopeless', 'despairing'].includes(w));
  const avoid = e.disp?.approach != null && e.disp.approach < 30;
  const urge = e.urges.find((u) => !['nothing in particular', 'talk to someone', 'move', 'make something'].includes(u));
  const r = { savour: '', step: '' };
  const offer = (title, sub, fn) => h('button.offer', { type: 'button', onclick: () => { S.updateEntry(e.id, r); fn(); } }, h('b', {}, title), h('span', {}, sub));
  const offers = [];
  let lead;
  if (low && e.mind) offers.push(offer('Look at that thought', `“${e.mind.slice(0, 60)}${e.mind.length > 60 ? '…' : ''}”`, () => T.thoughtRecord({ thought: e.mind, feelings: e.words, situation: [e.doing.join(', '), e.with.length ? 'with ' + e.with.join(', ') : ''].filter(Boolean).join(' · '), entryId: e.id })));
  if (low && high) {
    lead = 'Revved up and unpleasant. Settle the body first; thinking clearly comes easier after.';
    offers.push(offer('Breathe', 'One minute, long exhale', T.breathe), offer('5-4-3-2-1', 'Ground in the room', T.ground));
    if (!e.mind) offers.push(offer('Thought record', 'If a thought is driving this', () => T.thoughtRecord({ feelings: e.words, entryId: e.id })));
  } else if (low) {
    lead = 'Low and unpleasant. Waiting to feel like it rarely works here; a small action usually comes first and the mood follows.';
    offers.push(offer('One small step', 'Something you could start in ten minutes', () => T.smallStep(e.a)));
    if (!e.mind) offers.push(offer('Thought record', 'If a thought is weighing on you', () => T.thoughtRecord({ feelings: e.words, entryId: e.id })));
  } else if (good) {
    lead = 'Good. Notice what’s contributing; it’s data worth keeping for the days that aren’t.';
  } else {
    lead = 'Noted.';
  }
  if (urge && e.v < 0.2) offers.push(offer('Urge surfing', `Ride out “${urge}” for two minutes`, () => T.urgeSurf({ urge })));
  if (e.mind && /\b(worr|what if|going to|will be|disaster|fail)/i.test(e.mind) && low) offers.push(offer('Decatastrophise', 'Worst, best, most likely', () => T.decatastrophise({ worry: e.mind })));

  flow({
    title: 'Saved',
    steps: [{
      title: e.words.length ? e.words.slice(0, 4).join(', ') : zone(e.v, e.a), hint: lead,
      body: () => h('div', {},
        good ? h('div', {}, h('label.lbl', {}, 'What’s contributing to this?'), area(r, 'savour', 'People, place, what you did, what you didn’t…', 3)) : null,
        avoid ? h('div', {}, h('label.lbl', {}, 'You’re leaning toward avoiding something. What’s the smallest step toward it, two minutes or less?'), area(r, 'step', '', 2)) : null,
        offers.length ? h('div.offers', {}, offers) : null,
        urgent ? h('div.crisis', {}, h('b', {}, 'That sounds heavy.'), h('p', {}, CRISIS), h('a', { href: 'https://findahelpline.com', target: '_blank', rel: 'noopener' }, 'findahelpline.com')) : null),
      next: 'Done', noBack: true,
    }],
    onDone: () => { if (r.savour || r.step) S.updateEntry(e.id, r); toast(e.promptAt ? `Answered the ${clock(e.promptAt)} ping.` : 'Checked in.'); },
  });
}

// ---------- views ----------
function render() {
  if (flowOpen()) return;
  const main = h('main');
  ({ home, tools: toolsView, insights: insightsView, history: historyView, settings: settingsView })[tab](main);
  app.replaceChildren(main, h('nav.tabs', {}, TABS.map(([k, label]) => h('button' + (k === tab ? '.on' : ''), { type: 'button', onclick: () => { tab = k; render(); scrollTo(0, 0); } }, icon(k), h('span', {}, label)))));
}
T.onSaved(render);
setAfterClose(render);

function home(m) {
  const db = S.get(), s = S.settings(), now = Date.now();
  const pend = P.pending();
  const last = db.entries.at(-1);
  const today = P.todays();
  const done = today.filter((p) => P.answered(p)).length, gone = today.filter((p) => p.t <= now).length, toCome = today.length - gone;
  const openSteps = db.records.filter((r) => r.kind === 'activity' && r.done === false && now - r.t < DAYMS);
  const notifying = (s.local && 'Notification' in window && Notification.permission === 'granted') || (s.ntfy.on && s.ntfy.topic);
  put(m,
    h('header', {}, h('h1', {}, 'Check-in'), h('span.date', {}, new Date().toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long' }))),
    pend ? h('button.banner', { type: 'button', onclick: () => checkIn(pend) }, h('b', {}, `Ping at ${clock(pend.t)}`), h('span', {}, 'How are you, right now? Tap to answer.')) : null,
    openSteps.map((r) => h('div.card.step', {}, h('p', {}, 'You were going to: ', h('b', {}, r.activity)),
      h('div.row', {}, h('button.primary', { type: 'button', onclick: () => T.finishStep(r) }, 'Done it'), h('button.ghost', { type: 'button', onclick: () => T.skipStep(r) }, 'Didn’t happen')))),
    h('button.big', { type: 'button', onclick: () => checkIn() }, h('span.bigdot'), h('b', {}, 'Check in now'),
      h('small', {}, last ? `Last: ${ago(last.t)}${last.words?.length ? ' · ' + last.words.slice(0, 3).join(', ') : ''}` : 'Takes about 20 seconds')),
    today.length ? h('div.today', {},
      h('div.pings', {}, today.map((p) => h('i.' + (P.answered(p) ? 'yes' : p.t <= now ? 'missed' : 'later'), { title: p.t <= now ? clock(p.t) : 'later today' }))),
      h('span', {}, gone ? `${done} of ${gone} ping${gone === 1 ? '' : 's'} answered today${toCome ? ` · ${toCome} to come` : ''}` : `${toCome} ping${toCome === 1 ? '' : 's'} to come today`)) : null,
    !notifying ? h('button.card.setup', { type: 'button', onclick: () => { tab = 'settings'; render(); } }, h('b', {}, 'Turn on pings'), h('span', {}, 'So the app can ask you at random moments, even when it’s closed.')) : null,
    h('h3.sec', {}, 'Tools'),
    h('div.quick', {}, T.TOOLS.map(([name, , fn]) => h('button', { type: 'button', onclick: fn }, name))),
    h('p.foot', {}, 'Not a substitute for care. ', CRISIS));
}

function toolsView(m) {
  put(m, h('header', {}, h('h1', {}, 'Tools')),
    h('p.sub', {}, 'CBT skills. Each one is a few minutes and saves a record you can look back on.'),
    h('div.toollist', {}, T.TOOLS.map(([name, sub, fn]) => h('button.offer', { type: 'button', onclick: fn }, h('b', {}, name), h('span', {}, sub)))),
    h('h3.sec', {}, 'Thinking traps'),
    h('p.sub', {}, 'Habits of thought that make feelings bigger than the facts. Spotting one is half the work.'),
    h('div.trapref', {}, TRAPS.map(([, name, gloss, ask]) => h('details', {}, h('summary', {}, name), h('p', {}, gloss), h('p.ask', {}, ask)))));
}

function insightsView(m) {
  m.append(h('header', {}, h('h1', {}, 'Insights'),
    h('div.seg', {}, [7, 30, 90].map((d) => h('button' + (d === insightRange ? '.on' : ''), { type: 'button', onclick: () => { insightRange = d; render(); } }, `${d}d`)))));
  renderInsights(m, insightRange);
}

const KIND = { thought: 'Thought record', decat: 'Decatastrophise', activity: 'Small step', urge: 'Urge surfing', breathe: 'Breathing', ground: '5-4-3-2-1' };
function historyView(m) {
  const db = S.get();
  const items = [...db.entries.map((e) => ['entry', e]), ...db.records.map((r) => ['record', r])].sort((a, b) => b[1].t - a[1].t);
  m.append(h('header', {}, h('h1', {}, 'History')));
  if (!items.length) { m.append(h('div.empty', {}, h('p', {}, 'Nothing yet. Check in and it shows up here.'))); return; }
  let day = '';
  for (const [type, x] of items.slice(0, 300)) {
    const d = dayName(x.t);
    if (d !== day) { day = d; m.append(h('h3.sec', {}, d)); }
    m.append(type === 'entry' ? entryItem(x) : recordItem(x));
  }
}
const del = (x) => h('button.link.danger', { type: 'button', onclick: () => { if (confirm('Delete this?')) { S.remove(x.id); render(); } } }, 'Delete');
const kv = (k, v) => (v == null || v === '' || (Array.isArray(v) && !v.length) ? null : h('div.kv', {}, h('span', {}, k), h('span', {}, Array.isArray(v) ? v.join(', ') : String(v))));
function entryItem(e) {
  const hue = e.v == null ? '' : e.v < -0.2 ? 'neg' : e.v > 0.2 ? 'pos' : 'mid';
  return h('details.item', {},
    h('summary', {}, h('i.swatch.' + (hue || 'mid')), h('span.t', {}, clock(e.t)), h('span.w', {}, e.words?.length ? e.words.join(', ') : zone(e.v, e.a)), e.promptAt ? h('small', {}, 'ping') : null),
    h('div.detail', {},
      kv('Grid', zone(e.v, e.a) + (e.v != null ? ` (${Math.round(e.v * 100)}, ${Math.round(e.a * 100)})` : '')),
      e.promptAt ? kv('Ping', `${clock(e.promptAt)}, answered after ${Math.round((e.t - e.promptAt) / 60000)} min`) : null,
      DISPOSITIONS.map(([k, l, r]) => (e.disp?.[k] != null ? kv(`${l} ↔ ${r}`, e.disp[k]) : null)),
      kv('Urges', e.urges), kv('Body', e.body), kv('Doing', e.doing), kv('With', e.with), kv('On my mind', e.mind), kv('Contributing', e.savour), kv('Smallest step', e.step),
      del(e)));
}
function recordItem(r) {
  const head = { thought: r.thought, decat: r.worry, activity: r.activity, urge: r.urge, breathe: `${r.pattern}, ${r.minutes} min`, ground: '' }[r.kind] || '';
  const body = {
    thought: () => [kv('Situation', r.situation), kv('Feelings', r.feelings), kv('Strength', r.intensity != null ? `${r.intensity} → ${r.intensityAfter ?? '?'}` : null), kv('Hot thought', r.thought),
      kv('Belief', r.belief != null ? `${r.belief} → ${r.beliefAfter ?? '?'}` : null), kv('Traps', (r.traps || []).map((t) => TRAPS.find((x) => x[0] === t)?.[1] || t)),
      kv('For', r.evFor), kv('Against', r.evAgainst), kv('Balanced', r.balanced)],
    decat: () => [kv('Worst', r.worst), kv('Best', r.best), kv('Most likely', r.likely), kv('How I’d cope', r.cope), kv('Chance of worst', r.chance != null ? r.chance + '%' : null), kv('Anxiety', r.anxiety != null ? `${r.anxiety} → ${r.anxietyAfter ?? '?'}` : null)],
    activity: () => [kv('Status', r.done === true ? 'done' : r.done === 'skipped' ? 'didn’t happen' : 'planned'), kv('Mood', r.before != null ? `${r.before} → ${r.after ?? '?'}` : null), kv('Enjoyment', r.pleasure), kv('Achievement', r.mastery)],
    urge: () => [kv('Strength', r.strength != null ? `${r.strength} → ${r.after ?? '?'}` : null), kv('Acted on it', r.acted)],
    ground: () => [kv('See', r.see), kv('Touch', r.touch), kv('Hear', r.hear), kv('Smell', r.smell), kv('Taste', r.taste)],
  }[r.kind];
  return h('details.item.rec', {},
    h('summary', {}, h('i.swatch.tool'), h('span.t', {}, clock(r.t)), h('span.w', {}, h('b', {}, KIND[r.kind] || r.kind), head ? ' · ' + head : '')),
    h('div.detail', {}, body ? body() : null, del(r)));
}

function settingsView(m) {
  const s = S.settings();
  const changed = () => { S.save(); P.regenerate(); P.armLocal(onDue); pushNow(); };
  const num = (key, min, max, label, unit = '') => h('label.field', {}, h('span', {}, label),
    h('span.stepper', {}, h('button', { type: 'button', onclick: () => { s[key] = Math.max(min, s[key] - (key === 'minGap' ? 15 : 1)); changed(); render(); } }, '−'),
      h('b', {}, s[key] + unit), h('button', { type: 'button', onclick: () => { s[key] = Math.min(max, s[key] + (key === 'minGap' ? 15 : 1)); changed(); render(); } }, '+')));
  const time = (key, label) => h('label.field', {}, h('span', {}, label), h('input', { type: 'time', value: s[key], onchange: (e) => { if (e.target.value) { s[key] = e.target.value; changed(); } } }));
  const toggle = (obj, key, label, after) => h('label.field', {}, h('span', {}, label), h('input.switch', { type: 'checkbox', checked: !!obj[key], onchange: (e) => { obj[key] = e.target.checked; S.save(); after?.(); render(); } }));
  const perm = 'Notification' in window ? Notification.permission : 'unsupported';
  const q = s.ntfy;
  const queued = P.queuedUntil();
  put(m, h('header', {}, h('h1', {}, 'Settings')),
    h('section.card', {}, h('h3', {}, 'Pings'),
      h('p.sub', {}, 'The window is split into equal slots with one ping at a random moment in each, so they’re spread out but unpredictable.'),
      num('perDay', 1, 16, 'Pings a day'), time('start', 'From'), time('end', 'Until'), num('minGap', 15, 180, 'At least', ' min apart'),
      toggle(s, 'full', 'Full check-in (inclinations, urges, context)')),
    h('section.card', {}, h('h3', {}, 'While the app is open'),
      h('p.sub', {}, 'A notification (or a banner) when a ping is due and this app is open or in a background tab.'),
      toggle(s, 'local', 'Notify in the app', () => P.armLocal(onDue)),
      perm === 'granted' ? h('p.ok', {}, 'Notifications allowed.') :
        perm === 'unsupported' ? h('p.sub', {}, 'This browser can’t show notifications here. On iPhone, add the app to the Home Screen first.') :
          h('button.ghost', { type: 'button', onclick: async () => { const r = await P.askPermission(); toast(r === 'granted' ? 'Allowed.' : 'Not allowed. You can change it in the browser’s site settings.'); render(); } }, 'Allow notifications')),
    h('section.card', {}, h('h3', {}, 'Pings when the app is closed'),
      h('p.sub', {}, 'Uses ntfy, a free push service with a phone app. Each time you open Check-in it queues the next two days of pings on the ntfy server with their delivery times. Only the prompt text is sent, never your answers.'),
      toggle(q, 'on', 'Send pings through ntfy', () => { if (q.on && !q.topic) q.topic = P.randomTopic(); S.save(); pushNow(); }),
      q.on ? h('div', {},
        h('ol.howto', {},
          h('li', {}, 'Install the ntfy app (', h('a', { href: 'https://docs.ntfy.sh/subscribe/phone/', target: '_blank', rel: 'noopener' }, 'iPhone or Android'), ').'),
          h('li', {}, 'Tap +, and subscribe to this topic:', h('div.copy', {}, h('code', {}, q.topic), h('button.ghost', { type: 'button', onclick: () => navigator.clipboard?.writeText(q.topic).then(() => toast('Copied.')) }, 'Copy'))),
          h('li', {}, h('button.ghost', { type: 'button', onclick: () => P.testPush().then(() => toast('Sent. It should arrive in a few seconds.'), (e) => toast('Couldn’t send: ' + e.message, 5000)) }, 'Send a test ping'))),
        h('p.sub', {}, queued ? `Pings queued until ${dayName(queued)} ${clock(queued)}. Open the app at least every two days to keep them coming.` : 'Nothing queued yet.'),
        toggle(q, 'open', 'Tapping a ping opens Check-in'),
        h('details.adv', {}, h('summary', {}, 'Server and topic'),
          h('label.field', {}, h('span', {}, 'Server'), h('input', { type: 'url', value: q.server, onchange: (e) => { q.server = e.target.value.trim() || 'https://ntfy.sh'; S.save(); } })),
          h('label.field', {}, h('span', {}, 'Topic'), h('input', { type: 'text', value: q.topic, onchange: (e) => { q.topic = e.target.value.trim(); S.save(); } })),
          h('p.sub', {}, 'Anyone who knows the topic name can see the pings, so it’s a long random one. Pings already queued can’t be recalled; changing the schedule applies after them.'))) : null),
    h('section.card', {}, h('h3', {}, 'Or use your calendar'),
      h('p.sub', {}, 'Download the next seven days of pings as calendar events with alarms. Reliable on any phone; the times are visible in your calendar, so they’re less of a surprise.'),
      h('button.ghost', { type: 'button', onclick: () => download('checkin-pings.ics', P.ics(7), 'text/calendar') }, 'Download the week (.ics)')),
    h('section.card', {}, h('h3', {}, 'Your data'),
      h('p.sub', {}, `${S.get().entries.length} check-ins and ${S.get().records.length} tool records, stored only in this browser. Back up now and then: clearing site data deletes them.`),
      h('div.row.wrap', {},
        h('button.ghost', { type: 'button', onclick: () => download(`checkin-backup-${P.dayKey(Date.now())}.json`, S.exportJSON(), 'application/json') }, 'Back up (.json)'),
        h('button.ghost', { type: 'button', onclick: () => download(`checkin-${P.dayKey(Date.now())}.csv`, S.exportCSV(), 'text/csv') }, 'Check-ins (.csv)'),
        h('label.ghost.filebtn', {}, 'Restore…', h('input', { type: 'file', accept: '.json,application/json', onchange: async (e) => {
          const f = e.target.files[0]; if (!f) return;
          try { const r = S.importJSON(await f.text()); toast(`Merged ${r.entries} check-ins and ${r.records} records.`); render(); } catch (err) { toast('Couldn’t read that file: ' + err.message, 5000); }
        } })),
        h('button.link.danger', { type: 'button', onclick: () => { if (confirm('Erase every check-in and record on this device? This can’t be undone.')) { S.eraseAll(); render(); } } }, 'Erase all'))),
    h('p.foot', {}, 'Check-in uses ideas from cognitive behavioural therapy. It’s a self-help tool, not a substitute for care. ', CRISIS));
}

// ---------- helpers ----------
const DAYMS = 864e5;
function ago(t) {
  const m = Math.round((Date.now() - t) / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m} min ago`;
  if (m < 60 * 24) return `${Math.round(m / 60)} h ago`;
  return dayName(t);
}
function download(name, text, type) {
  const a = h('a', { href: URL.createObjectURL(new Blob([text], { type })), download: name });
  document.body.append(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
}
const ICONS = {
  home: 'M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16zm0 4.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7z',
  tools: 'M5 7h14M5 12h14M5 17h9',
  insights: 'M5 19V11M10 19V6M15 19v-5M20 19V9',
  history: 'M12 7v5l3 2M12 4a8 8 0 1 1-8 8',
  settings: 'M4 8h10M18 8h2M4 16h2M10 16h10M16 6v4M8 14v4',
};
const icon = (k) => { const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); s.setAttribute('viewBox', '0 0 24 24'); s.innerHTML = `<path d="${ICONS[k]}"/>`; return s; };

async function pushNow() {
  const r = await P.pushAhead();
  if (r.error) toast('Couldn’t reach the ntfy server to queue pings. They’ll be queued next time the app opens online.', 5000);
  else if (r.sent && tab === 'settings') render();
}
function onDue(p) {
  navigator.vibrate?.([80, 60, 80]);
  if (!flowOpen()) { render(); if (tab !== 'home') toast(`Ping: how are you right now? (${clock(p.t)})`, 5000); }
}

// ---------- start ----------
P.ensure();
render();
P.armLocal(onDue);
pushNow();
// opened from a ping: answer that ping
const pid = new URLSearchParams(location.search).get('prompt');
if (pid) {
  history.replaceState(null, '', location.pathname);
  const p = P.byId(pid);
  checkIn(p && !P.answered(p) ? p : P.pending());
}
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState !== 'visible') return;
  P.ensure(); P.armLocal(onDue); pushNow();
  render();
});
navigator.serviceWorker?.addEventListener('message', (e) => { if (e.data?.prompt && !flowOpen()) { const p = P.byId(e.data.prompt); checkIn(p && !P.answered(p) ? p : P.pending()); } });
if ('serviceWorker' in navigator && location.protocol !== 'file:') navigator.serviceWorker.register('sw.js').catch(() => {});
