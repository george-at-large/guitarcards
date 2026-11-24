// When to ask. Experience sampling, stratified: the waking window is cut into equal slots, one ping per slot at a
// random moment inside it, kept at least minGap apart, so pings are unpredictable but spread across the day.
// Three ways to be pinged:
//   • in the app: a notification (or a banner) while the app is open
//   • ntfy: pings are queued on an ntfy server with a delivery time, and the ntfy phone app shows them even when
//     this app is closed. Only the prompt text is sent; no check-in data leaves the device.
//   • calendar: an .ics file of the coming week's pings, each with an alarm
import * as S from './store.js';
import { PROMPT_LINES } from './data.js';

const MIN = 60000;
const HORIZON = 48 * 60 * MIN;            // how far ahead pings are queued on ntfy (the server allows up to 3 days)
export const dayKey = (t) => { const d = new Date(t); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
const atClock = (key, hhmm) => { const [y, m, d] = key.split('-').map(Number); const [h, mi] = hhmm.split(':').map(Number); return new Date(y, m - 1, d, h, mi).getTime(); };
const addDays = (key, n) => { const [y, m, d] = key.split('-').map(Number); return dayKey(new Date(y, m - 1, d + n, 12).getTime()); };

// one day's pings; `from` lets today's be generated mid-day without putting pings in the past
function generate(key, from = 0) {
  const s = S.settings();
  let a = atClock(key, s.start), b = atClock(key, s.end);
  if (b <= a) b += 24 * 60 * MIN;
  const n = Math.max(1, Math.min(20, s.perDay)), slot = (b - a) / n;
  const pad = Math.min(slot / 2 - MIN, (s.minGap * MIN) / 2);
  const out = [];
  for (let i = 0; i < n; i++) {
    const lo = a + i * slot + Math.max(0, pad), hi = a + (i + 1) * slot - Math.max(0, pad);
    const t = Math.round(lo + Math.random() * (hi - lo));
    if (t > from) out.push({ id: S.uid(), t });
  }
  return out;
}

// make sure pings exist from today through `days` ahead
export function ensure(days = 2) {
  const db = S.get(), now = Date.now(), today = dayKey(now);
  let changed = false;
  for (let i = 0; i <= days; i++) {
    const k = addDays(today, i);
    if (!db.prompts[k]) { db.prompts[k] = generate(k, i === 0 ? now + 2 * MIN : 0); changed = true; }
  }
  // forget pings older than 60 days (entries keep their own copy of the ping time)
  for (const k of Object.keys(db.prompts)) if (k < addDays(today, -60)) { delete db.prompts[k]; changed = true; }
  if (changed) S.save();
}

// after a settings change: redraw future pings that haven't already been handed to ntfy or a calendar
export function regenerate() {
  const db = S.get(), now = Date.now();
  for (const k of Object.keys(db.prompts)) {
    const list = db.prompts[k];
    const future = list.filter((p) => p.t > now);
    if (!future.length || future.some((p) => p.pushed || p.cal)) continue;
    const kept = list.filter((p) => p.t <= now);
    db.prompts[k] = [...kept, ...generate(k, now + 2 * MIN)];
  }
  S.save();
  ensure();
}

export const all = () => Object.values(S.get().prompts).flat().sort((a, b) => a.t - b.t);
export const next = () => all().find((p) => p.t > Date.now());
export const todays = () => (S.get().prompts[dayKey(Date.now())] || []).slice().sort((a, b) => a.t - b.t);
export const answered = (p) => S.get().entries.some((e) => e.promptId === p.id);
// the latest ping that has gone off and not been answered, if it's recent enough to still be worth answering
export function pending(windowMin = 120) {
  const now = Date.now();
  return all().filter((p) => p.t <= now && now - p.t < windowMin * MIN && !answered(p)).at(-1) || null;
}
export const byId = (id) => all().find((p) => p.id === id) || null;
const line = (p) => PROMPT_LINES[parseInt(p.id.slice(-3), 36) % PROMPT_LINES.length];
const appURL = (p) => { const u = new URL(location.href); u.search = `?prompt=${p.id}`; u.hash = ''; return u.toString(); };

// ---------- in the app ----------
let timer = 0;
export function armLocal(onDue) {
  clearTimeout(timer);
  const p = next();
  if (!p) return;
  // setTimeout can't be trusted over long gaps (sleeping devices), so wake at most every 10 minutes and re-check
  const wait = Math.min(p.t - Date.now(), 10 * MIN);
  timer = setTimeout(() => {
    if (Date.now() >= p.t - 1000) { fireLocal(p); onDue(p); }
    armLocal(onDue);
  }, Math.max(1000, wait));
}
async function fireLocal(p) {
  if (!S.settings().local || !('Notification' in window) || Notification.permission !== 'granted') return;
  const opts = { body: 'Tap to check in.', tag: 'checkin', renotify: true, icon: 'icons/checkin-192.png', data: { url: appURL(p) } };
  try {
    const reg = await navigator.serviceWorker?.getRegistration();
    if (reg) await reg.showNotification(line(p), opts); else new Notification(line(p), opts);
  } catch { /* the in-app banner still shows */ }
}
export async function askPermission() {
  if (!('Notification' in window)) return 'unsupported';
  try { return await Notification.requestPermission(); } catch { return 'denied'; }
}

// ---------- ntfy ----------
export const randomTopic = () => 'checkin-' + Array.from(crypto.getRandomValues(new Uint8Array(10)), (b) => 'abcdefghijkmnpqrstuvwxyz23456789'[b % 32]).join('');
function ntfyURL(params) {
  const n = S.settings().ntfy;
  const u = new URL(`${n.server.replace(/\/+$/, '')}/${encodeURIComponent(n.topic)}`);
  for (const [k, v] of Object.entries(params)) if (v != null) u.searchParams.set(k, v);
  return u.toString();
}
// a plain-text POST with the options in the query string is a "simple" request, so no CORS preflight is needed
async function post(text, params) {
  const res = await fetch(ntfyURL(params), { method: 'POST', body: text, headers: { 'Content-Type': 'text/plain' } });
  if (!res.ok) throw new Error(`ntfy ${res.status}: ${(await res.text().catch(() => '')).slice(0, 120)}`);
}
export async function testPush() {
  await post('This is how check-in pings will look. Tap to open the app.', { title: 'Check-in test', tags: 'seedling', click: location.href.split('?')[0] });
}
let pushing = false;
// queue every ping in the next 48 hours that hasn't been queued yet; called whenever the app opens
export async function pushAhead() {
  const n = S.settings().ntfy;
  if (!n.on || !n.topic || pushing) return { sent: 0 };
  pushing = true;
  let sent = 0, error = null;
  try {
    ensure();
    const now = Date.now();
    for (const p of all()) {
      if (p.pushed || p.t < now + 30000 || p.t > now + HORIZON) continue;
      try {
        await post('Tap to log mood, body and what you’re inclined to do.', {
          title: line(p), tags: 'seedling', at: String(Math.floor(p.t / 1000)), click: n.open ? appURL(p) : undefined,
        });
        p.pushed = true; sent++; S.save();
      } catch (e) { error = e; break; }
    }
  } finally { pushing = false; }
  return { sent, error };
}
export const queuedUntil = () => all().filter((p) => p.pushed).at(-1)?.t || null;

// ---------- calendar ----------
export function ics(days = 7) {
  ensure(days);
  const now = Date.now(), until = now + days * 24 * 60 * MIN;
  const stamp = (t) => new Date(t).toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//checkin//EN', 'CALSCALE:GREGORIAN'];
  for (const p of all()) {
    if (p.t <= now || p.t > until) continue;
    p.cal = true;
    lines.push('BEGIN:VEVENT', `UID:${p.id}@checkin`, `DTSTAMP:${stamp(now)}`, `DTSTART:${stamp(p.t)}`, `DTEND:${stamp(p.t + 5 * MIN)}`,
      `SUMMARY:${line(p)}`, `URL:${appURL(p)}`, `DESCRIPTION:Check in: ${appURL(p)}`, 'TRANSP:TRANSPARENT',
      'BEGIN:VALARM', 'ACTION:DISPLAY', `DESCRIPTION:${line(p)}`, 'TRIGGER:PT0M', 'END:VALARM', 'END:VEVENT');
  }
  lines.push('END:VCALENDAR');
  S.save();
  return lines.join('\r\n');
}
