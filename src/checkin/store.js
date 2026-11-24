// Everything stays on this device, in localStorage under one key. Entries are check-ins; records are the CBT tools
// used (thought records, decatastrophising, activities, urge surfing, breathing, grounding); prompts are the
// scheduled pings by day, so responses can be tied back to the ping that asked for them.
const KEY = 'checkin.v1';

export const DEFAULTS = {
  perDay: 6, start: '09:00', end: '21:30', minGap: 45,
  local: true,                                    // notify while the app is open
  ntfy: { on: false, server: 'https://ntfy.sh', topic: '', open: true },
  full: true,                                     // full check-in (grid, words, inclinations, context) or quick
  myActivities: [],
};

function blank() { return { v: 1, entries: [], records: [], prompts: {}, settings: structuredClone(DEFAULTS) }; }

let db = load();
function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return blank();
    const d = JSON.parse(raw);
    return { ...blank(), ...d, settings: { ...structuredClone(DEFAULTS), ...d.settings, ntfy: { ...DEFAULTS.ntfy, ...(d.settings?.ntfy || {}) } } };
  } catch { return blank(); }
}
export function save() {
  try { localStorage.setItem(KEY, JSON.stringify(db)); return true; } catch { return false; }
}
export const get = () => db;
export const settings = () => db.settings;
export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

export function addEntry(e) { db.entries.push({ id: uid(), t: Date.now(), ...e }); save(); return db.entries.at(-1); }
export function addRecord(kind, r) { db.records.push({ id: uid(), t: Date.now(), kind, ...r }); save(); return db.records.at(-1); }
export function updateEntry(id, patch) { const e = db.entries.find((x) => x.id === id); if (e) { Object.assign(e, patch); save(); } return e; }
export function remove(id) {
  db.entries = db.entries.filter((x) => x.id !== id);
  db.records = db.records.filter((x) => x.id !== id);
  save();
}

export function exportJSON() { return JSON.stringify(db, null, 1); }
export function importJSON(text) {
  const d = JSON.parse(text);
  if (!Array.isArray(d.entries) || !Array.isArray(d.records)) throw new Error('Not a check-in backup');
  // merge by id so importing an older backup never drops newer entries
  const merge = (a, b) => { const ids = new Set(a.map((x) => x.id)); return [...a, ...b.filter((x) => !ids.has(x.id))].sort((p, q) => p.t - q.t); };
  db.entries = merge(db.entries, d.entries);
  db.records = merge(db.records, d.records);
  save();
  return { entries: d.entries.length, records: d.records.length };
}
export function eraseAll() { const s = db.settings; db = blank(); db.settings = s; save(); }

export function exportCSV() {
  const cols = ['time', 'prompt_time', 'latency_min', 'pleasantness', 'energy', 'feelings', 'body', 'social', 'act', 'approach', 'attention', 'urges', 'doing', 'with', 'mind', 'savour', 'step'];
  const q = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const iso = (t) => (t ? new Date(t).toISOString() : '');
  const rows = db.entries.map((e) => [iso(e.t), iso(e.promptAt), e.promptAt ? ((e.t - e.promptAt) / 60000).toFixed(1) : '',
    e.v?.toFixed(3) ?? '', e.a?.toFixed(3) ?? '', (e.words || []).join('; '), (e.body || []).join('; '),
    e.disp?.social ?? '', e.disp?.act ?? '', e.disp?.approach ?? '', e.disp?.attention ?? '',
    (e.urges || []).join('; '), (e.doing || []).join('; '), (e.with || []).join('; '), e.mind, e.savour, e.step].map(q).join(','));
  return [cols.join(','), ...rows].join('\n');
}
