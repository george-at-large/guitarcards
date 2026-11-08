# Guitar videos

One timeline file drives the whole video. Picture and sound are rendered from the same list of timed events, so they cannot drift apart.

```
generator (tools/video/audiation.mjs)  →  timeline.json  →  tools/video/render.mjs  →  .mp4
   theory engine names + checks            seconds-based       frames: video/player.html (Playwright, frame N = N/fps s)
                                                               guitar + click: src/audio.js rendered offline in that page
                                                               voice: ElevenLabs (or macOS `say`), placed at event times
                                                               mix in Node, mux with ffmpeg
```

This reuses the app's own engine instead of adding new libraries:

- **Theory** comes from `src/theory.js` and `src/fretboard.js`, the same code behind every card. The generators derive every name, spelling, fret and interval label from it. They also cross-check those labels against the actual pitches (for example, label semitones must equal the MIDI distance) and stop with `THEORY CHECK FAILED` rather than write a mislabelled video.
- **Guitar sound** is the app's Karplus-Strong guitar with its body EQ and room reverb, rendered through an `OfflineAudioContext` (`useContext` in `src/audio.js`). It runs anywhere Chromium runs, cloud container included. No VST, SoundFont or laptop-only step.
- **The fretboard** is drawn as SVG by `video/player.js`. Strings are numbered 1 = high e to 6 = low E, drawn tab-style, as everywhere else in the repo.

## Make a video

```bash
# 1. a timeline (seeded, so the same command gives the same video)
node tools/video/audiation.mjs intervals --root C --n 12 --gap 4
node tools/video/audiation.mjs chords --root random --qualities maj,min,dim,aug,maj7,7,m7,m7b5 --gap 5

# 2. look at it live in a browser (narration uses the browser's voice here)
node tools/serve.mjs 8765
#    http://localhost:8765/video/player.html?t=/video/out/intervals-c-s1.json

# 3. render the MP4
node tools/video/render.mjs video/out/intervals-c-s1.json
node tools/video/render.mjs video/out/intervals-c-s1.json --frame 20         # one PNG, to check a moment
node tools/video/render.mjs video/out/intervals-c-s1.json --from 5 --to 40   # part of it
node tools/video/render.mjs video/out/intervals-c-s1.json --scale 0.5        # 960x540 draft, faster
node tools/video/render.mjs video/out/intervals-c-s1.json --stems            # also guitar/click/voice WAVs
```

Output goes to `video/out/` and synthesized voice clips are cached in `video/cache/voice/`. Both are gitignored. A full-size render runs at roughly 2–3× the video's length in the cloud container. Frames that don't change are captured once and reused.

**Voice.** `--voice auto` (the default) picks the first that is available:

1. ElevenLabs, when `ELEVENLABS_API_KEY` is set. It uses the `/with-timestamps` endpoint and stores word timings next to each clip for captions later. Choose the voice with `ELEVENLABS_VOICE_ID` and the model with `ELEVENLABS_MODEL`.
2. macOS `say`, optionally with a voice set in `SAY_VOICE`.
3. None. The answer is still on screen.

The renderer warns if a narration line runs into notes you are meant to be listening to.

## Timeline format

All times are in seconds. Only `events` is required.

```jsonc
{
  "title": "Interval audiation", "fps": 30, "duration": 196, "tail": 0.5,
  "autoNeck": false,            // true (default): with no neck event, show the neck whenever there are play events
  "ghost": false,               // show the next play event's notes as dashed "coming next" dots (auto neck only)
  "window": {"lo": 0, "hi": 12},// auto-neck fret window (default: fitted to all played notes)
  "click": {"from": 0, "to": 32, "bpm": 80, "beatsPerBar": 4},   // metronome + beat pulse; may be a list
  "events": [
    {"type": "play",  "t": 0.4, "dur": 2.0, "notes": [{"string": 5, "fret": 3, "finger": 1, "label": "1", "at": 0},
                                                      {"string": 3, "fret": 5, "finger": 3, "label": "b6", "at": 0.03}]},
    {"type": "neck",  "t": 9, "until": 16, "lo": 1, "hi": 8, "dots": [{"string": 5, "fret": 3, "label": "1", "finger": 1}]},
    {"type": "text",  "t": 9, "until": 16, "slot": "big", "style": "answer", "text": "Minor 6th · ♭6"},
    {"type": "timer", "t": 5, "until": 9, "text": "Name it. Hear it again in your head."},
    {"type": "say",   "t": 9, "text": "Minor sixth"}
  ]
}
```

| event | what it does |
|---|---|
| `play` | Sounds its notes: `at` is the offset within the event, `vel` the velocity (0–1), `muted` gives a muted note, and `dur` is how long notes ring. While the notes sound, their dots light up on the neck with an attack ring. `label` (on the event) fills the big text slot while it plays. `hidden: true` keeps the dots off the neck. `silent: true` lights them without sound. |
| `neck` | Shows the neck between `t` and `until`, with fixed `dots`. `dots: []` gives an empty neck. `lightPlayed: false` stops play events lighting dots on it, which is what audiation uses so the question doesn't give away the answer. `hidden: true` hides the neck. |
| `text` | Writes text in a slot: `title` (top left), `corner` (top right), `big`, `sub`, or `caption`. When several are active, the latest one in each slot wins. `style: "answer"` shows it in the accent colour with a rise-in. |
| `timer` | A bar that drains between `t` and `until`. This is the silent "think" gap. |
| `say` | A narration line placed at `t`. |

The shorthand from the first sketch also works: `{"t": 0, "notes": [...], "label": "C (root)"}` is a play event and `{"t": 2, "say": "..."}` is a say event. Give the timeline a `bpm` and notes default to one beat each.

Dot colour comes from the label: root red, 3rds amber, 5ths blue, 7ths purple, tensions cream. Fingers appear in a dark tag beside the dot. The generators' fingerings are suggestions from a simple one-finger-per-fret rule that barres with the first finger. Write `finger` by hand to override them.

## Video types

- **Audiation** (built). A sound rings with the neck empty, then a silent gap with a draining bar. Then the reveal: the voice names it, the answer and spelling appear, and the shape lights up on the neck as the sound plays again. Intervals play melodically, then harmonically (`--play` changes this). Chords are strummed, then arpeggiated.
- **BPM drills** (next). These need a generator that turns a card's `demo` spec (`compile()` in `src/demo.js` already yields beat-timed events with frets and interval labels) into play events at each tempo, plus a `click`. Then set `ghost: true`.
- **Song walkthroughs** (later). These need a Guitar Pro or MusicXML parser (alphaTab) that writes play events, plus text events for chord functions. `src/theory.js` `parseChart` already turns chord symbols into Roman numerals.
