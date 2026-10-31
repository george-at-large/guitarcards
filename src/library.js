// Loads all content modules into one library.
export const CONTENT_FILES = ['voicings', 'scales', 'rhythm', 'harmony', 'ear', 'analyses', 'interchange'];

export async function loadLibrary(base = '../content/') {
  const lib = { templates: [], concepts: new Map(), toolbox: [], analyses: [], errors: [] };
  const mods = await Promise.all(CONTENT_FILES.map((f) => import(`${base}${f}.js`).then((m) => [f, m]).catch((e) => { lib.errors.push(`${f}: ${e.message}`); return [f, null]; })));
  for (const [f, m] of mods) {
    if (!m) continue;
    for (const t of m.templates || []) lib.templates.push({ ...t, _file: f });
    for (const c of m.concepts || []) if (!lib.concepts.has(c.id)) lib.concepts.set(c.id, { ...c, _file: f });
    if (m.toolbox) lib.toolbox.push(...m.toolbox);
    if (m.analyses) lib.analyses.push(...m.analyses);
  }
  const seen = new Set();
  lib.templates = lib.templates.filter((t) => (seen.has(t.id) ? false : seen.add(t.id)));
  lib.byId = new Map(lib.templates.map((t) => [t.id, t]));
  return lib;
}
