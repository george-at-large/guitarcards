// Render a timeline (video/README.md) to MP4: frames from video/player.html via Playwright, guitar and click
// from the app's synth rendered offline in the same page, narration from ElevenLabs (or macOS `say`),
// mixed here and muxed with ffmpeg. One timeline drives picture and sound, so they cannot drift.
//
//   node tools/video/render.mjs video/out/intervals-c-s1.json
//     --out file.mp4        default: next to the timeline
//     --voice auto|elevenlabs|say|none   auto = ElevenLabs if ELEVENLABS_API_KEY is set, else `say` on macOS, else none
//     --from 10 --to 40     render part of it (seconds)
//     --scale 0.5           half-size draft (960x540), much faster
//     --frame 41.13         write one PNG of that moment and stop
//     --stems               also write guitar/click/voice WAVs for mixing elsewhere
//     --click-gain 0.5 --voice-gain 1.0 --guitar-gain 1.0
// Env: ELEVENLABS_API_KEY, ELEVENLABS_VOICE_ID, ELEVENLABS_MODEL, SAY_VOICE
import http from 'node:http';
import { createHash } from 'node:crypto';
import { spawn, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { dirname, extname, join, normalize, basename, resolve } from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const root = new URL('../../', import.meta.url).pathname;
const SR = 48000;

const argv = process.argv.slice(2);
const opt = (name, def) => { const i = argv.indexOf('--' + name); return i >= 0 ? argv[i + 1] : def; };
const flag = (name) => argv.includes('--' + name);
const input = argv[0];
if (!input || input.startsWith('--')) { console.error('usage: node tools/video/render.mjs <timeline.json> [--out x.mp4] [--voice auto|elevenlabs|say|none] [--from s] [--to s] [--scale 0.5] [--frame s] [--stems]'); process.exit(1); }
const timeline = JSON.parse(readFileSync(input, 'utf8'));
const outFile = opt('out', input.replace(/\.json$/, '') + '.mp4');
const scale = Number(opt('scale', 1));
const gains = { guitar: Number(opt('guitar-gain', 1)), click: Number(opt('click-gain', 0.5)), voice: Number(opt('voice-gain', 1)) };
const log = (...a) => console.log(...a);

// ---------- voice ----------
const cacheDir = join(root, 'video/cache/voice');
const has = (cmd) => spawnSync('which', [cmd]).status === 0;
function voiceProvider() {
  const v = opt('voice', 'auto');
  if (v !== 'auto') return v;
  if (process.env.ELEVENLABS_API_KEY) return 'elevenlabs';
  if (process.platform === 'darwin' && has('say')) return 'say';
  return 'none';
}
async function ttsElevenLabs(text, file) {
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) throw new Error('ELEVENLABS_API_KEY is not set');
  const voice = process.env.ELEVENLABS_VOICE_ID || 'JBFqnCBsd6RMkjVDRZzb';
  const model = process.env.ELEVENLABS_MODEL || 'eleven_multilingual_v2';
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}/with-timestamps?output_format=mp3_44100_128`, {
    method: 'POST', headers: { 'xi-api-key': key, 'Content-Type': 'application/json' }, body: JSON.stringify({ text, model_id: model }),
  });
  if (!res.ok) throw new Error(`ElevenLabs ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const j = await res.json();
  writeFileSync(file, Buffer.from(j.audio_base64, 'base64'));
  writeFileSync(file.replace(/\.mp3$/, '.align.json'), JSON.stringify(j.alignment || j.normalized_alignment || null)); // word timings, for captions later
}
function ttsSay(text, file) {
  const args = ['-o', file];
  if (process.env.SAY_VOICE) args.push('-v', process.env.SAY_VOICE);
  const r = spawnSync('say', [...args, text]);
  if (r.status !== 0) throw new Error('say failed: ' + r.stderr);
}
function decode(file) {
  const r = spawnSync('ffmpeg', ['-v', 'error', '-i', file, '-f', 'f32le', '-ac', '1', '-ar', String(SR), '-'], { maxBuffer: 1 << 30 });
  if (r.status !== 0) throw new Error('ffmpeg could not decode ' + file + ': ' + r.stderr);
  return new Float32Array(r.stdout.buffer, r.stdout.byteOffset, r.stdout.byteLength / 4);
}
async function voiceClips(says, provider) {
  if (provider === 'none' || !says.length) return [];
  mkdirSync(cacheDir, { recursive: true });
  const clips = [];
  for (const s of says) {
    const id = createHash('sha1').update([provider, process.env.ELEVENLABS_VOICE_ID || '', process.env.ELEVENLABS_MODEL || '', process.env.SAY_VOICE || '', s.text].join('|')).digest('hex').slice(0, 16);
    const file = join(cacheDir, `${id}.${provider === 'say' ? 'aiff' : 'mp3'}`);
    if (!existsSync(file)) {
      log(`  voice: "${s.text}"`);
      if (provider === 'elevenlabs') await ttsElevenLabs(s.text, file); else if (provider === 'say') ttsSay(s.text, file); else throw new Error('unknown voice provider ' + provider);
    }
    const pcm = decode(file);
    clips.push({ ...s, pcm, dur: pcm.length / SR });
  }
  return clips;
}

// ---------- audio helpers ----------
function wav16(channels, file) {
  const n = channels[0].length, nc = channels.length;
  const buf = Buffer.alloc(44 + n * nc * 2);
  buf.write('RIFF', 0); buf.writeUInt32LE(36 + n * nc * 2, 4); buf.write('WAVE', 8); buf.write('fmt ', 12);
  buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(nc, 22); buf.writeUInt32LE(SR, 24);
  buf.writeUInt32LE(SR * nc * 2, 28); buf.writeUInt16LE(nc * 2, 32); buf.writeUInt16LE(16, 34); buf.write('data', 36); buf.writeUInt32LE(n * nc * 2, 40);
  let o = 44;
  for (let i = 0; i < n; i++) for (let c = 0; c < nc; c++) { const v = Math.max(-1, Math.min(1, channels[c][i])); buf.writeInt16LE(Math.round(v * 32767), o); o += 2; }
  writeFileSync(file, buf);
}
async function pullStem(page, name) {
  const info = await page.evaluate((n) => window.renderStem(n), name);
  const chans = [];
  const CH = SR * 10;
  for (let c = 0; c < info.channels; c++) {
    const out = new Float32Array(info.length);
    for (let start = 0; start < info.length; start += CH) {
      const b64 = await page.evaluate(([n, c2, s, k]) => window.stemChunk(n, c2, s, k), [name, c, start, CH]);
      const bytes = Buffer.from(b64, 'base64');
      out.set(new Float32Array(bytes.buffer, bytes.byteOffset, bytes.byteLength / 4), start);
    }
    chans.push(out);
  }
  return { chans, peak: info.peak };
}

// ---------- server ----------
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json' };
function serve() {
  return new Promise((res) => {
    const srv = http.createServer(async (req, resp) => {
      const p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
      const file = normalize(join(root, p));
      if (!file.startsWith(root)) { resp.writeHead(403).end(); return; }
      try { const d = await readFile(file); resp.writeHead(200, { 'Content-Type': TYPES[extname(file)] || 'application/octet-stream' }); resp.end(d); } catch { resp.writeHead(404).end(); }
    }).listen(0, '127.0.0.1', () => res(srv));
  });
}

// ---------- main ----------
const srv = await serve();
const browser = await chromium.launch();
let ff = null;
try {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: scale });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto(`http://127.0.0.1:${srv.address().port}/video/player.html?render=1`);
  await page.waitForFunction(() => typeof window.loadTimeline === 'function', null, { timeout: 15000 }).catch(() => { throw new Error('player did not load: ' + errors.join(' | ')); });
  await page.evaluate(() => document.fonts.ready);

  // single frame
  if (opt('frame') != null) {
    const tl = await page.evaluate((tl) => window.loadTimeline(tl), timeline);
    await page.evaluate((T) => window.renderAt(T), Number(opt('frame')));
    const png = outFile.replace(/\.mp4$/, '') + `-${opt('frame')}s.png`;
    await page.screenshot({ path: png });
    log(`${png} (of ${tl.duration.toFixed(1)} s)`);
    process.exit(0);
  }

  // voice first: real clip lengths feed the timeline's duration
  const provider = voiceProvider();
  let info = await page.evaluate((tl) => window.loadTimeline(tl), timeline);
  log(`timeline: ${info.duration.toFixed(1)} s at ${info.fps} fps, ${info.says.length} narration lines, voice: ${provider}`);
  if (provider === 'none' && info.says.length) log('  (no voice: set ELEVENLABS_API_KEY, or run on a Mac for `say`; the text is still on screen)');
  const clips = await voiceClips(info.says, provider);
  info = await page.evaluate(([tl, d]) => window.loadTimeline(tl, { sayDurations: d }), [timeline, Object.fromEntries(clips.map((c) => [c.text, c.dur]))]);
  // a narration line that runs into a sound you are meant to hear is a timeline bug
  const plays = timeline.events.filter((e) => (e.type || (e.notes ? 'play' : '')) === 'play');
  for (const c of clips) {
    const hit = plays.find((p) => p.t > c.t && p.t < c.t + c.dur);
    if (hit) log(`  warning: "${c.text}" (${c.t.toFixed(2)}–${(c.t + c.dur).toFixed(2)} s) overlaps notes at ${hit.t.toFixed(2)} s`);
  }

  // audio: render stems offline in the page, mix here
  log('rendering audio…');
  const guitar = await pullStem(page, 'guitar');
  const hasClick = [timeline.click || []].flat().length > 0;
  const click = hasClick ? await pullStem(page, 'click') : null;
  const n = guitar.chans[0].length;
  const voice = new Float32Array(n);
  for (const c of clips) { const o = Math.round(c.t * SR); for (let i = 0; i < c.pcm.length && o + i < n; i++) voice[o + i] += c.pcm[i]; }
  const mix = [0, 1].map((ch) => {
    const out = new Float32Array(n);
    for (let i = 0; i < n; i++) out[i] = guitar.chans[ch][i] * gains.guitar + (click ? click.chans[ch][i] * gains.click : 0) + voice[i] * gains.voice * 0.8;
    return out;
  });
  let peak = 0; for (const ch of mix) for (let i = 0; i < n; i++) peak = Math.max(peak, Math.abs(ch[i]));
  if (peak > 0.97) { const k = 0.97 / peak; for (const ch of mix) for (let i = 0; i < n; i++) ch[i] *= k; }
  const from = Number(opt('from', 0)), to = Math.min(Number(opt('to', info.duration)), info.duration);
  const cut = (a) => a.subarray(Math.round(from * SR), Math.round(to * SR));
  mkdirSync(dirname(resolve(outFile)), { recursive: true });
  const base = outFile.replace(/\.mp4$/, '');
  const mixFile = base + '.mix.wav';
  wav16(mix.map(cut), mixFile);
  if (flag('stems')) {
    wav16(guitar.chans.map(cut), base + '.guitar.wav');
    if (click) wav16(click.chans.map(cut), base + '.click.wav');
    if (clips.length) wav16([cut(voice)], base + '.voice.wav');
  }

  // frames → ffmpeg
  const fps = Number(opt('fps', info.fps));
  const first = Math.round(from * fps), last = Math.round(to * fps);
  ff = spawn('ffmpeg', ['-y', '-v', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-', '-i', mixFile,
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', outFile], { stdio: ['pipe', 'inherit', 'inherit'] });
  const ffDone = new Promise((res, rej) => ff.on('close', (code) => (code === 0 ? res() : rej(new Error('ffmpeg exited ' + code)))));
  const write = (b) => new Promise((res) => (ff.stdin.write(b) ? res() : ff.stdin.once('drain', res)));
  let prevSvg = null, prevPng = null, shot = 0;
  const t0 = Date.now();
  for (let f = first; f < last; f++) {
    const svg = await page.evaluate((T) => window.renderAt(T), f / fps);
    if (svg !== prevSvg) { prevPng = await page.screenshot({ type: 'png' }); prevSvg = svg; shot++; }
    await write(prevPng);
    if ((f - first) % (fps * 10) === 0) process.stdout.write(`\r  frames ${f - first}/${last - first}  (${shot} drawn)`);
  }
  ff.stdin.end();
  await ffDone;
  process.stdout.write(`\r  frames ${last - first}/${last - first}  (${shot} drawn, ${((Date.now() - t0) / 1000).toFixed(0)} s)\n`);
  if (errors.length) log('page errors:\n  ' + errors.join('\n  '));
  log(`${outFile}  (${(to - from).toFixed(1)} s)`);
} finally {
  if (ff && ff.exitCode === null && !ff.stdin.writableEnded) ff.kill();
  await browser.close();
  srv.close();
}
