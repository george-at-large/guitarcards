// Print exactly what a card's "Watch it" demo plays.
// node tools/dump-demo.mjs <template-id> [--n 2] [--param name=value ...]
globalThis.window = globalThis;
globalThis.localStorage = { getItem: () => null, setItem: () => {} };
const root = new URL('../', import.meta.url).pathname;
const { loadLibrary } = await import(root + 'src/library.js');
const { instantiate } = await import(root + 'src/cards.js');
const { compile } = await import(root + 'src/demo.js');
const { howToPlay } = await import(root + 'src/rhythm.js');
const T = await import(root + 'src/theory.js');

const args = process.argv.slice(2);
const id = args[0];
const n = Number(args[args.indexOf('--n') + 1]) || 1;
const fixed = {};
args.forEach((a, i) => { if (a === '--param') { const [k, ...v] = args[i + 1].split('='); try { fixed[k] = JSON.parse(v.join('=')); } catch { fixed[k] = v.join('='); } } });
const lib = await loadLibrary(root + 'content/');
const t = lib.byId.get(id);
if (!t) { console.log('no template', id); process.exit(1); }
const nameOf = (m) => T.noteName(T.noteFromPc(((m % 12) + 12) % 12), true) + (Math.floor(m / 12) - 1);
for (let k = 0; k < n; k++) {
  const c = instantiate(t, undefined, fixed);
  console.log(`\n=== ${id} :: ${c.text(t.title)}`);
  console.log('params:', JSON.stringify(c.params));
  console.log('prompt:', c.text(t.prompt));
  if (c.metronome) console.log('metronome:', JSON.stringify(c.metronome));
  const spec = c.demo;
  if (!spec) { console.log('(no demo)'); continue; }
  console.log('demo spec:', JSON.stringify(spec));
  let comp;
  try { comp = compile(spec); } catch (e) { console.log('COMPILE ERROR', e.message); continue; }
  const frames = comp.frames.map((f) => f.caption);
  let lastFrame = -1;
  for (const e of comp.events) {
    if (e.frame !== lastFrame) { console.log(`  [frame ${e.frame}] ${frames[e.frame] || ''}`); lastFrame = e.frame; }
    const where = (e.hl || []).join(' ');
    const notes = (e.notes || []).map(nameOf).join(' ');
    const extra = [e.dir ? 'dir ' + e.dir : '', e.vel != null ? 'vel ' + e.vel.toFixed(2) : '', e.slot != null ? 'slot ' + e.slot : ''].filter(Boolean).join(', ');
    console.log(`   beat ${e.beat.toFixed(3).padStart(7)}  ${e.kind.padEnd(6)} ${notes.padEnd(18)} ${where.padEnd(22)} ${e.label && e.label !== frames[e.frame] ? e.label : ''} ${extra}`);
  }
  for (const r of [spec].flat().filter((s) => s.type === 'rhythm')) console.log('\n--- generated guide ---\n' + howToPlay(r));
}
