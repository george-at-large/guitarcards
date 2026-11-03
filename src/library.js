// Loads all content modules into one library.
export const CONTENT_FILES = ['voicings', 'scales', 'rhythm', 'harmony', 'ear', 'analyses', 'interchange', 'deepdive', 'barnby', 'ljs', 'tedgreene', 'tgarchive'];

export async function loadLibrary(base = '../content/') {
  const lib = { templates: [], concepts: new Map(), toolbox: [], analyses: [], errors: [] };
  const mods = await Promise.all(CONTENT_FILES.map((f) => import(`${base}${f}.js`).then((m) => [f, m]).catch((e) => { lib.errors.push(`${f}: ${e.message}`); return [f, null]; })));
  for (const [f, m] of mods) {
    if (!m) continue;
    for (const t of m.templates || []) lib.templates.push({ ...t, _file: f });
    for (const c of m.concepts || []) if (!lib.concepts.has(c.id)) lib.concepts.set(c.id, { ...c, _file: f });
    if (m.toolbox) lib.toolbox.push(...m.toolbox);
    if (m.analyses) lib.analyses.push(...m.analyses);
    if (m.tg) lib.tg = m.tg;
    if (m.tgArchive) lib.tgArchive = m.tgArchive;
  }
  // private packs imported on the phone (e.g. the Ted Greene book) live in IndexedDB, not in the published files
  if (!lib.tg) {
    try {
      const pack = await loadPack('tedgreene');
      if (pack) {
        for (const t of pack.templates || []) lib.templates.push({ ...t, _file: 'tedgreene' });
        for (const c of pack.concepts || []) if (!lib.concepts.has(c.id)) lib.concepts.set(c.id, { ...c, _file: 'tedgreene' });
        lib.tg = pack.tg;
        lib.tgPack = { version: pack.version, built: pack.built };
        lib.errors = lib.errors.filter((e) => !e.startsWith('tedgreene:'));
      }
    } catch (e) { /* no pack */ }
  }
  lib.errors = lib.errors.filter((e) => !e.startsWith('tedgreene:')); // optional private content
  const seen = new Set();
  lib.templates = lib.templates.filter((t) => (seen.has(t.id) ? false : seen.add(t.id)));
  lib.byId = new Map(lib.templates.map((t) => [t.id, t]));
  return lib;
}

// ---------- private content packs (IndexedDB) ----------
function db() {
  return new Promise((res, rej) => {
    if (typeof indexedDB === 'undefined') return rej(new Error('no IndexedDB'));
    const r = indexedDB.open('guitarcards-packs', 1);
    r.onupgradeneeded = () => r.result.createObjectStore('packs');
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
}
export async function loadPack(name) {
  const d = await db();
  return new Promise((res, rej) => { const q = d.transaction('packs').objectStore('packs').get(name); q.onsuccess = () => res(q.result || null); q.onerror = () => rej(q.error); });
}
export async function savePack(name, pack) {
  const d = await db();
  if (navigator.storage && navigator.storage.persist) { try { await navigator.storage.persist(); } catch (e) { /* */ } }
  return new Promise((res, rej) => { const tx = d.transaction('packs', 'readwrite'); tx.objectStore('packs').put(pack, name); tx.oncomplete = () => res(true); tx.onerror = () => rej(tx.error); });
}
