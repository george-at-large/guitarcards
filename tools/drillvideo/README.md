# Drill videos

Narrated videos that teach one drill each: the rule, the drill worked slowly in G, the same in time over a click, then
how to take it through all twelve keys. The plan for the series is `docs/drill-videos-plan.md`.

A video file (`videos/<id>.yaml`) says what happens, `style.yaml` says how it looks, sounds and is paced, and
`build.py` renders the mp4. Every shape comes from the Guitar Cards engine through `resolve.mjs`, so a video shows
exactly the voicings the app does. The voice, the neck and the dots are the audiation videos' (`tools/audiation`),
and speech is cached line by line, so a re-render only pays for lines whose words changed.

```bash
tools/audiation/.venv/bin/python tools/drillvideo/build.py 01-caged-root-areas --plan            # timings, no speech
tools/audiation/.venv/bin/python tools/drillvideo/build.py 01-caged-root-areas --frames 40,200   # stills, to check
tools/audiation/.venv/bin/python tools/drillvideo/build.py 01-caged-root-areas                   # → out/<id>.mp4
```

The step fields are documented at the top of `build.py`; the shape requests at the top of `resolve.mjs`.

A render is skipped when the video, the style, the builder and the engine's shapes are unchanged since the last one
(`--force` overrides), so `for v in videos/*.yaml` re-renders only what changed. Videos built from loops (chord
ladders, turnarounds, scale families) live in `gen.py`: edit the loop there and run it, rather than editing the
generated YAML.

Writing a video (the format is in `docs/drill-videos-plan.md`):
- open with the title card, then a "The drill" card of 2–4 numbered steps;
- content, not practice: the complete set in G across the whole neck, each shape played once, `click: false`;
- the voice names the drill and each section only, with `captions: false`; extras go in `notes`;
- optional techniques are drilled three ways: without, with every time, then by choice;
- end with where each key starts (a `rows_from` table), how much to do a day, and "you've got it when";
- check timing with `--plan` and the look with `--frames` before a full render.

Song videos (any step with a `tab:`):
- the voices are `string.fret[tech]:beats` tokens, `+` for a chord, `r:` for a rest, `|` a bar line; techniques are
  `h p s n b m` (hammer, pull, slide, harmonic, bend, mute);
- give every tab its `harmony:`, one string a bar: `'Em:i B7:V7'` splits the bar evenly, `-` holds a slot,
  `@E_minor` changes the key label. It draws over the tab, and the neck moves up to make room;
- `roots:` (per bar, with quality, e.g. `B7`) labels the dots from each bar's chord; with `ext: true` as 9/11/13;
- all voices together throughout, never one voice alone; check fingerings against published guitar versions.
- repertoire format: title, drill card, a playthrough (`tab:`), then `page: {marks: [[bar, text], …]}`, which lays the
  same tab out as a page of systems with the harmony, numbered marks and a legend (the step's `notes` lead it), and
  replays it slower under a cursor; then the end card. A pickup bar is numbered 0: mark it with `pickup: true` in the tab.

Repertoire and export:
- `songs.py` builds songs from a classtab.org tab (`file:`; timing from the tab's columns) or an abcnotation.com ABC
  (`abc:`; melody placed low on the neck, bass from the chord symbols, `drone:` for modal tunes). Each entry carries the
  harmony per bar (read from the notes, checked by hand; leave a bar `''` when unsure), the marks and the tempos.
- `export.py` copies every current video to `export/`, numbered in course order, for a phone.
