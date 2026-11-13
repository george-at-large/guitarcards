"""Record every line the Ear app's narrator can say (src/ear/audiation.js LINES) into ear/voice/.

    tools/audiation/.venv/bin/python tools/audiation/app_voice.py           # record what's missing
    tools/audiation/.venv/bin/python tools/audiation/app_voice.py --plan    # list what would be recorded

Each line is spoken on its own (no surrounding context, so a line sounds the same wherever the app plays it), with the
house voice from style.yaml at speaking speed 1.0, trimmed of silence and written as a small mono mp3 named by a hash
of its text. ear/voice/index.json maps each line to its file; the app falls back to the device's voice for any line
that isn't there.
"""
import argparse
import hashlib
import json
import subprocess
import sys
from pathlib import Path

import yaml

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
sys.path.insert(0, str(HERE))
import build as B  # noqa: E402  (speech synthesis and its cache)

OUT = ROOT / 'ear' / 'voice'


def lines() -> list:
    code = "import('./src/ear/audiation.js').then(m => process.stdout.write(JSON.stringify(m.LINES)))"
    js = "globalThis.window = globalThis; globalThis.localStorage = {getItem: () => null, setItem: () => {}};" + code
    return json.loads(subprocess.run(['node', '--input-type=module', '-e', js], cwd=ROOT, check=True, capture_output=True, text=True).stdout)


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument('--plan', action='store_true')
    args = ap.parse_args()
    voice = {**yaml.safe_load((HERE / 'style.yaml').read_text())['voice']}
    voice['settings'] = {**voice['settings'], 'speed': 1.0}
    OUT.mkdir(parents=True, exist_ok=True)
    index_path = OUT / 'index.json'
    index = json.loads(index_path.read_text()) if index_path.exists() else {}
    todo = [s for s in lines() if s not in index or not (OUT / index[s]).exists()]
    print(f'{len(todo)} lines to record, {sum(map(len, todo))} characters')
    if args.plan:
        print('\n'.join(todo))
        return
    keys = B.env_keys()
    for s in todo:
        mp3 = B.synthesize(s, voice, ('', ''), keys)
        name = hashlib.sha256(s.encode()).hexdigest()[:16] + '.mp3'
        trim = 'silenceremove=start_periods=1:start_threshold=-50dB'
        subprocess.run([B.FFMPEG, '-y', '-v', 'error', '-i', str(mp3), '-af', f'{trim},areverse,{trim},areverse,apad=pad_dur=0.05',
                        '-ac', '1', '-ar', '44100', '-c:a', 'libmp3lame', '-b:a', '64k', str(OUT / name)], check=True)
        index[s] = name
        index_path.write_text(json.dumps(index, indent=1, ensure_ascii=False))
        print(' ', s)
    print(f'{len(index)} lines in {index_path.relative_to(ROOT)}')


if __name__ == '__main__':
    main()
