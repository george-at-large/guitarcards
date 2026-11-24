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

## Develop
```bash
node tools/serve.mjs 8765        # http://localhost:8765
node tools/validate.mjs          # instantiate every template many times and check everything compiles
```
Progress is stored in the browser's localStorage on the device (Settings → Copy backup to move it).

## Check-in (`checkin.html`)
A separate app in the same site: random-moment pings to log how you feel, with CBT tools built in.
- **Check-in**: tap the mood grid (pleasant ↔ unpleasant × energy), pick the words that fit, then (full mode) what you're
  inclined to do right now (withdraw ↔ reach out, rest ↔ get going, avoid ↔ face it, in my head ↔ in the room), urges,
  body, what you're doing, who with, and what's on your mind.
- **It answers the state you're in**: breathe / ground when revved up and unpleasant; one small step (behavioural activation)
  when low; a thought record when a thought is driving it; urge surfing for urges; decatastrophising for worries;
  savouring when it's good. Crisis resources when it's heavy.
- **Tools**: thought record (with thinking traps), one small step, decatastrophise, urge surfing, breathing, 5-4-3-2-1.
- **Insights**: the grid with every check-in, pleasantness and energy day by day, what goes with feeling better or worse,
  what you lean toward when you feel bad vs good, top feelings / urges / thinking traps, ping response rate.
- **Pings**: stratified random within a waking window (Settings). Three routes: in-app notifications while it's open;
  [ntfy](https://ntfy.sh) for pings when it's closed (the app queues the next 48 h of pings on the ntfy server with delivery
  times, prompt text only); or a week of pings as a calendar file with alarms.
- Code in `src/checkin/` (`data` content, `store` storage, `schedule` pings, `ui` kit, `tools` CBT, `insights` charts, `app`).
  Data stays in this browser's localStorage; Settings has JSON/CSV backup and restore.
