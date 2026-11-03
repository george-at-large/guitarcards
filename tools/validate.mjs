// Validate all content: node tools/validate.mjs [domain] [--n 12] [--verbose]
globalThis.window = globalThis;
globalThis.localStorage = { getItem: () => null, setItem: () => {} };
const root = new URL('../', import.meta.url).pathname;
const { loadLibrary, CONTENT_FILES } = await import(root + 'src/library.js');
const { instantiate } = await import(root + 'src/cards.js');
const { compile, chartChords } = await import(root + 'src/demo.js');
const { makeQuiz, QUIZ_KINDS } = await import(root + 'src/quiz.js');
const { CATEGORY_INFO } = await import(root + 'src/adapt.js');
const T = await import(root + 'src/theory.js');

const args = process.argv.slice(2);
const only = args.find((a) => !a.startsWith('--') && isNaN(Number(a)));
const N = Number(args[args.indexOf('--n') + 1]) || 12;
const verbose = args.includes('--verbose');
const lib = await loadLibrary(root + 'content/');
if (lib.errors.length) console.log('LOAD ERRORS:\n  ' + lib.errors.join('\n  '));

const problems = [];
const warn = (where, msg) => problems.push(`${where}: ${msg}`);
const validCats = new Set(Object.values(CATEGORY_INFO).flat());
const validModes = new Set(Object.keys(CATEGORY_INFO));
const TEXT_FIELDS = ['title', 'prompt', 'goal', 'explain'];
const PH = /\{(key|root|chord|scale|scaleNotes|chordTones|stringSet|tempo|rn|p|parent|[a-zA-Z]+)(?::[^}]+)?\}/g;

const allIds = new Map();
let nCards = 0;
const stats = {};
for (const t of lib.templates) {
  if (only && t._file !== only) continue;
  const where = `${t._file}/${t.id}`;
  stats[t._file] = (stats[t._file] || 0) + 1;
  for (const f of ['id', 'mode', 'category', 'title', 'level', 'length', 'prompt']) if (t[f] == null) warn(where, `missing ${f}`);
  if (!validModes.has(t.mode)) warn(where, `bad mode ${t.mode}`);
  if (!validCats.has(t.category)) warn(where, `bad category ${t.category}`);
  else if (!CATEGORY_INFO[t.mode]?.includes(t.category)) warn(where, `category ${t.category} not in mode ${t.mode}`);
  if (t.length && !['short', 'medium', 'long'].includes(t.length)) warn(where, `bad length ${t.length}`);
  for (const c of t.concepts || []) if (!lib.concepts.has(c)) warn(where, `unknown concept "${c}"`);
  if (t.quiz && !QUIZ_KINDS.includes(t.quiz.kind)) warn(where, `unknown quiz kind ${t.quiz.kind}`);
  if ((t.mode === 'ear') && !t.quiz) warn(where, 'ear card without quiz');
  const errs = new Map();
  for (let i = 0; i < N; i++) {
    let card;
    try { card = instantiate(t); } catch (e) { errs.set('instantiate: ' + e.message, 1); continue; }
    nCards++;
    for (const f of TEXT_FIELDS) {
      const out = card.text(t[f]);
      const left = out.match(PH);
      if (left) errs.set(`unresolved ${left.join(' ')} in ${f}`, 1);
    }
    for (const h of t.hints || []) { const left = card.text(h).match(PH); if (left) errs.set(`unresolved ${left.join(' ')} in hint`, 1); }
    for (const which of ['visual', 'demo']) {
      const spec = card[which];
      if (!spec) continue;
      try {
        const c = compile(spec);
        if (spec.type !== 'text' && !(Array.isArray(spec)) && c.frames.length === 0 && spec.type !== 'chordMelody') errs.set(`${which} produced no diagram`, 1);
        if (which === 'demo' && spec.type !== 'text' && !c.events.length) errs.set('demo has no events', 1);
        const silent = c.events.filter((e) => e.unvoiced).map((e) => e.label);
        if (silent.length) errs.set(`${which}: ${silent.length} chord(s) could not be voiced (silent): ${silent.slice(0, 3).join(', ')}`, 1);
        const top = [spec].flat().some((x) => x.region && x.region.octaves) ? 24 : 17; // multi-octave runs go past fret 17 on purpose
        for (const f of c.frames) for (const d of f.dots) if (d.fret < 0 || d.fret > top) errs.set(`${which} fret out of range ${d.fret}`, 1);
        if (spec.type === 'voicings' || spec.type === 'chordScale') {
          const missing = c.html.match(/not playable/g);
          if (missing) errs.set(`${which}: ${missing.length} chord(s) not playable on ${JSON.stringify(spec.stringSet)} (${spec.voicing})`, 1);
        }
        if (spec.type === 'rhythm') {
          const slots = spec.pick ? String(spec.pick).replace(/\|/g, ' ').trim().split(/\s+/).length : String(spec.pattern || '').replace(/[\s|]/g, '').length;
          const beats = Number(String(spec.meter || '4/4').split('/')[0]);
          if (slots % (beats * (spec.grid || 2)) !== 0) errs.set(`rhythm slot count ${slots} not a multiple of ${beats}×${spec.grid || 2}`, 1);
        }
      } catch (e) { errs.set(`${which} (${spec.type}): ${e.message}`, 1); }
    }
    if (card.quiz) {
      try { const q = makeQuiz(card, lib); if (!q) errs.set('quiz generated nothing', 1); else if (q.type === 'choice' && (q.answer < 0 || q.answer == null)) errs.set('quiz answer missing from choices', 1); }
      catch (e) { errs.set('quiz: ' + e.message, 1); }
    }
  }
  for (const k of errs.keys()) warn(where, k);
}
// concepts
for (const c of lib.concepts.values()) {
  if (only && c._file !== only) continue;
  for (const s of c.see || []) if (!lib.concepts.has(s)) warn(`concept/${c.id}`, `see → unknown "${s}"`);
  if (c.visual) { try { compile(c.visual); } catch (e) { warn(`concept/${c.id}`, `visual: ${e.message}`); } }
}
// toolbox
for (const e of lib.toolbox) {
  for (const o of e.options || []) { try { T.getScale(o.scale); } catch (err) { warn(`toolbox/${e.chord}`, err.message); } if (o.from && !T.INTERVALS[o.from]) warn(`toolbox/${e.chord}`, `bad from ${o.from}`); }
}
// analyses
if (!only || only === 'analyses') for (const a of lib.analyses) {
  const where = `analyses/${a.id}`;
  for (const c of a.concepts || []) if (!lib.concepts.has(c)) warn(where, `unknown concept "${c}"`);
  for (const s of a.sections || []) {
    try {
      const { chords, bars } = chartChords({ key: a.key, chart: s.chart, meter: a.meter });
      compile({ type: 'progression', key: a.key, chart: s.chart, strum: a.strum, meter: a.meter });
      for (const n of s.notes || []) { if (n.bar < 1 || n.bar > bars.length) warn(where, `note bar ${n.bar} out of range (${bars.length} bars) in ${s.name}`); for (const c of n.concepts || []) if (!lib.concepts.has(c)) warn(where, `unknown concept "${c}"`); }
      for (const sb of s.subs || []) { if (sb.bar < 1 || sb.bar > bars.length) warn(where, `subs bar ${sb.bar} out of range`); for (const o of sb.options || []) { try { T.parseChordToken(o.token, T.parseKey(a.key).tonic); } catch (e) { warn(where, `sub token ${o.token}: ${e.message}`); } for (const c of o.concepts || []) if (!lib.concepts.has(c)) warn(where, `unknown concept "${c}"`); } }
    } catch (e) { warn(where, `section ${s.name}: ${e.message}`); }
  }
  for (const c of a.compare || []) { try { compile({ ...c, type: 'compare', key: c.key || a.key }); } catch (e) { warn(where, `compare: ${e.message}`); } }
}

console.log(`templates: ${JSON.stringify(stats)} · concepts ${lib.concepts.size} · toolbox ${lib.toolbox.length} · analyses ${lib.analyses.length} · ${nCards} cards instantiated`);
const grouped = {};
for (const p of problems) { const [w, ...m] = p.split(': '); (grouped[m.join(': ').replace(/\d+(?= chord)/, 'n')] = grouped[m.join(': ').replace(/\d+(?= chord)/, 'n')] || []).push(w); }
console.log(`${problems.length} problems`);
if (verbose) problems.forEach((p) => console.log('  ' + p));
else for (const [m, ws] of Object.entries(grouped).sort((a, b) => b[1].length - a[1].length)) console.log(`  [${ws.length}] ${m}\n      ${ws.slice(0, 6).join(', ')}${ws.length > 6 ? ' …' : ''}`);
process.exit(problems.length ? 1 : 0);
