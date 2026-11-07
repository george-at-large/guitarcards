# Sound lab

Synthesis sketches toward a non-human musical tradition, plus human reference styles and
Reich-style phase pieces. Pure Python + numpy; ffmpeg encodes MP3s and draws spectrograms.

- `index.html` is the listening notebook: what each clip does, why, and what to listen for.
- `synth.py` is the shared toolkit (additive tones, modelled piano, envelopes, reverb, output).
- `dissonance.py` holds the Plomp–Levelt / Sethares roughness model and derives scales from timbres.
- `a*_`, `b*_`, `c*_` are one script per clip. Run from this folder, e.g. `python3 a1_body_scale.py`.
  Each writes `audio/<name>.mp3` and `spectrograms/<name>.png`. Seeds are fixed, so renders are repeatable.
