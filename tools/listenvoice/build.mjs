// Records the Listen voice: every phrase the CAGED Changes Listen section can say, spoken by Theo Silk (ElevenLabs, the
// Mila house voice, as in tools/audiation and tools/drillvideo), trimmed, and written to voice/theo/<slug>.mp3, with
// voice/theo/index.json listing the phrases. Phrases already recorded are kept, so re-running only adds new ones.
//
//   node tools/listenvoice/build.mjs           record what's missing
//   node tools/listenvoice/build.mjs --list    print the phrases, record nothing
//
// The ElevenLabs key is read from this repo's .env, else the Mila prototype's. ffmpeg comes from the audiation venv
// (tools/audiation/.venv, imageio-ffmpeg) or the PATH.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import * as T from '../../src/theory.js';
import * as V from '../../src/caged/voice.js';
import * as M from '../../src/caged/meander.js';
import * as SC from '../../src/caged/scales.js';
import * as L from '../../src/caged/library.js';
import * as H from '../../src/caged/harmony.js';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../..');
const OUT = path.join(ROOT, 'voice', 'theo');
const VOICE = { id: 'UmQN7jS1Ee8B1czsUtQh', model: 'eleven_multilingual_v2', settings: { stability: 0.6, similarity_boost: 0.75, style: 0, use_speaker_boost: true, speed: 0.95 }, seed: 7 };

// ---------- every phrase ----------
function phrases() {
  const P = new Set();
  const add = (groups) => groups.flat().forEach((p) => p && P.add(p));
  const notes = [];
  for (const l of 'ABCDEFG') for (const a of ['', 'b', '#', 'bb', '##']) notes.push(V.noteWord(T.parseNote(l + a)));
  const degs = [];
  for (const a of ['', 'b', '#', 'bb']) for (let d = 1; d <= 7; d++) degs.push(V.degWord(a + d));
  notes.forEach((n) => { P.add(n); P.add(`over ${n}`); });
  degs.forEach((d) => { P.add(d); P.add(`of ${d}`); P.add(`over ${d}`); });
  Object.values(V.QW).forEach((q) => P.add(q));
  ['7', '9', '13'].forEach((q) => P.add(V.typeWord(q)));
  Object.values(V.FAMILY_WORD).forEach((q) => P.add(q));
  ['seven'].forEach((q) => P.add(q));
  const MAJ = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'], MIN = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'G#', 'A', 'Bb', 'B'];
  MAJ.forEach((k) => P.add(V.keyWords({ tonic: T.parseNote(k), minor: false })));
  MIN.forEach((k) => P.add(V.keyWords({ tonic: T.parseNote(k), minor: true })));
  // annotations: every literal in the composer, then a long sample of what it generates
  const src = fs.readFileSync(path.join(ROOT, 'src/caged/meander.js'), 'utf8');
  for (const m of src.matchAll(/say: '([^']*)'/g)) add(V.annWords(m[1], { tonic: T.parseNote('C'), minor: false }));
  for (const minor of [false, true]) for (const level of [1, 2, 3, 4, 5]) for (const grow of [false, true]) {
    const g = M.meander({ minor, level, grow, modulate: true });
    for (let i = 0; i < 3000; i++) (g.next().ann || []).forEach((a) => add(V.annWords(a.say, { tonic: T.parseNote('C'), minor: false })));
  }
  for (const r of ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'iv', 'v', '♭II', '♭III', '♭VI', '♭VII', 'III', 'VI', 'II', 'VII']) P.add(V.sayable(`two five into ${r}`));
  // the random chords' labels, and the loops'
  ['a variation', 'secondary dominant', 'borrowed', 'chromatic', 'tritone sub', 'Picardy third'].forEach((s) => P.add(s));
  for (const kt of ['major', 'minor']) for (const s of H.SETS[kt]) for (const e of H.setPool(kt, s.id)) if (e.tag && !['subV', 'Picardy'].includes(e.tag)) P.add(V.sayable(e.tag));
  SC.SCALES.forEach((s) => P.add(V.scaleWords(s.name)));
  L.ALL.forEach((p) => P.add(V.sayable(p.name)));
  return [...P].filter(Boolean).sort();
}

// ---------- recording ----------
function apiKey() {
  for (const f of [path.join(ROOT, '.env'), path.join(os.homedir(), 'Desktop', 'mind-at-large-prototype', '.env')]) {
    if (!fs.existsSync(f)) continue;
    const m = /^\s*ELEVENLABS_API_KEY\s*=\s*["']?([^"'\s]+)/m.exec(fs.readFileSync(f, 'utf8'));
    if (m) return m[1];
  }
  return process.env.ELEVENLABS_API_KEY;
}
function ffmpeg() {
  const dir = path.join(ROOT, 'tools/audiation/.venv/lib');
  if (fs.existsSync(dir)) for (const py of fs.readdirSync(dir)) {
    const b = path.join(dir, py, 'site-packages/imageio_ffmpeg/binaries');
    if (fs.existsSync(b)) { const f = fs.readdirSync(b).find((x) => x.startsWith('ffmpeg')); if (f) return path.join(b, f); }
  }
  return 'ffmpeg';
}
// how a lone phrase is read: a note name is cued as a chord's name, so "A" isn't read as the word "a"
const context = (p) => (/^[A-G]( (flat|sharp|double flat|double sharp))?$/.test(p) ? { previous_text: 'The chord is' }
  : /^(minor|major|seven|dominant|diminished|half|augmented|sus|add|six|nine|eleven|thirteen|altered|quartal)\b/.test(p) ? { previous_text: 'A chord: D' } : {});
async function record(p, key, ff) {
  const body = { text: p, model_id: VOICE.model, voice_settings: VOICE.settings, seed: VOICE.seed, ...context(p) };
  for (let tries = 0; ; tries++) {
    const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE.id}?output_format=mp3_44100_128`, {
      method: 'POST', headers: { 'xi-api-key': key, 'Content-Type': 'application/json', Accept: 'audio/mpeg' }, body: JSON.stringify(body) });
    if (r.ok) {
      const raw = path.join(os.tmpdir(), `lv-${V.slug(p)}.mp3`);
      fs.writeFileSync(raw, Buffer.from(await r.arrayBuffer()));
      // trim the silence either end, a few ms of fade, mono
      const trim = 'silenceremove=start_periods=1:start_threshold=-48dB';
      execFileSync(ff, ['-v', 'error', '-y', '-i', raw, '-af', `${trim},areverse,${trim},areverse,afade=t=in:d=0.008,areverse,afade=t=in:d=0.04,areverse`,
        '-ac', '1', '-ar', '44100', '-c:a', 'libmp3lame', '-b:a', '64k', path.join(OUT, `${V.slug(p)}.mp3`)]);
      fs.unlinkSync(raw);
      return;
    }
    if (tries >= 4 || ![429, 500, 502, 503].includes(r.status)) throw new Error(`${r.status} for "${p}": ${(await r.text()).slice(0, 200)}`);
    await new Promise((res) => setTimeout(res, 1500 * (tries + 1)));
  }
}

// one clip per file name: "Backdoor cadence" and "backdoor cadence" are the same words (the lower case is kept)
const bySlug = new Map();
for (const p of phrases().reverse()) bySlug.set(V.slug(p), p);
const list = [...bySlug.values()].sort();
if (process.argv.includes('--list')) { list.forEach((p) => console.log(p)); console.log(`${list.length} phrases, ${list.join('').length} characters`); process.exit(0); }
fs.mkdirSync(OUT, { recursive: true });
const todo = list.filter((p) => !fs.existsSync(path.join(OUT, `${V.slug(p)}.mp3`)));
console.log(`${list.length} phrases, ${todo.length} to record (${todo.join('').length} characters)`);
const key = apiKey();
if (todo.length && !key) throw new Error('No ELEVENLABS_API_KEY in .env');
const ff = ffmpeg();
let done = 0, failed = [];
async function worker() {
  while (todo.length) {
    const p = todo.shift();
    try { await record(p, key, ff); } catch (e) { failed.push(p); console.error(e.message); }
    if (++done % 25 === 0) console.log(`${done} recorded`);
  }
}
await Promise.all([worker(), worker(), worker()]);
const have = list.filter((p) => fs.existsSync(path.join(OUT, `${V.slug(p)}.mp3`)));
fs.writeFileSync(path.join(OUT, 'index.json'), JSON.stringify(have));
console.log(`index.json: ${have.length} phrases${failed.length ? `; failed: ${failed.join(', ')}` : ''}`);
