# Guitar Cards

A personal, offline, adaptive practice deck for iPhone (installable web app).

- **Play / Ear / Theory** modes, category filters, card length, session length, focus box.
- Every card is a template plus parameters (key, string set, position, tempo…); the theory engine computes
  all notes, frets, voicings and sounds, so diagrams and demos are correct by construction.
- **Watch it**: an animated neck plays the exercise with interval labels. **Help**: hints → explanation → diagrams → lessons.
- Ratings (Too hard / Hard / Good / Easy) drive per-category levels, spaced repetition, tempo ladders and follow-up cards.
  Quizzes and ear training score themselves.
- **Songs**: annotated progressions with a per-chord substitution menu. **Toolbox**: what to play over what. **Lessons**: concept deep-dives.

## Layout
- `src/` engine + UI (`theory`, `fretboard`, `demo`, `audio`, `cards`, `quiz`, `adapt`, `subs`, `app`)
- `content/` card libraries (`voicings`, `scales`, `rhythm`, `harmony`, `ear`, `analyses`) — schema in `docs/SCHEMA.md`
- `research/` notes and sources behind each library
- `video/` + `tools/video/` practice videos rendered from one timeline (audiation so far) — see `video/README.md`

## Develop
```bash
node tools/serve.mjs 8765        # http://localhost:8765
node tools/validate.mjs          # instantiate every template many times and check everything compiles
```
Progress is stored in the browser's localStorage on the device (Settings → Copy backup to move it).
