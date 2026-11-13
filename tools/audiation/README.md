# Guided audiation videos

Narrated sessions that build a chord a note at a time on the guitar neck, then drop its notes out so you hold it in
your mind. Built like the Mila module videos: a session file says what happens, `style.yaml` says how it looks, sounds
and is paced, and `build.py` renders the mp4 (speech by ElevenLabs, cached line by line; the tones synthesised here).

```bash
python3 -m venv tools/audiation/.venv
tools/audiation/.venv/bin/pip install numpy scipy pillow pyyaml imageio-ffmpeg
tools/audiation/.venv/bin/python tools/audiation/build.py 01-build-and-hold --plan   # timings, no speech
tools/audiation/.venv/bin/python tools/audiation/build.py 01-build-and-hold          # → out/01-build-and-hold.mp4
```

The ElevenLabs key is read from this repo's `.env`, else the Mila prototype's. Step types are documented at the top of
`build.py`. Renders and the speech cache stay out of Git.

Design rules, from the research (Gordon's audiation, inner-hearing practice, musical-imagery studies):
- establish the key (a root or a cadence) before asking for an imagined note, and again after any key change;
- ask for the note, leave silence, then play it: predict, then check;
- no stray pitched sounds in a silent hold (narration is fine);
- hum, then sing inside, then play it on the guitar;
- drop notes only from a chord already heard for a while;
- one steady, simple timbre; rotate keys between sessions.
