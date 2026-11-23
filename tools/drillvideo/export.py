"""Copy every current video into export/, named in course order for a phone app ("001 Start - How to use….mp4").

    python3 tools/drillvideo/export.py
"""
import json
import re
import shutil
from pathlib import Path

HERE = Path(__file__).resolve().parent
OUT, EXPORT = HERE / 'out', HERE / 'export'
SUPERSEDED = {'01-caged-root-areas', '01s-caged-climb', '03a-drop2-ladders'}
STRANDS = [  # (id pattern, strand name), in course order
    (r'^00-', 'Start'), (r'^0[1-4]', 'Chords'), (r'^(05|09)', 'Lines'), (r'^(08|12|13|14|15)', 'Scales'),
    (r'^(06|07|11)', 'Progressions'), (r'^(10|16|17)', 'Hands and time'), (r'^S\d', 'Strumming'), (r'^F\d', 'Fingerpicking'),
    (r'^G\d', 'Genres'), (r'^C7-', 'Repertoire'), (r'^(c|cp|cl|r|b|l|j|s|w|fb|o|tp|cm)\d', 'Repertoire')]


def strand(vid: str) -> tuple:
    for k, (pat, name) in enumerate(STRANDS):
        if re.match(pat, vid):
            return k, name
    return len(STRANDS), 'Other'


def main() -> None:
    EXPORT.mkdir(exist_ok=True)
    for old in EXPORT.glob('*.mp4'):
        old.unlink()
    vids = []
    for meta in OUT.glob('*.json'):
        m = json.loads(meta.read_text())
        mp4 = OUT / f"{m['id']}.mp4"
        if m['id'] in SUPERSEDED or not mp4.exists():
            continue
        k, name = strand(m['id'])
        vids.append((k, m['id'].lower(), name, m.get('title') or m['id'], mp4))
    vids.sort()
    for n, (_, vid, name, title, mp4) in enumerate(vids, 1):
        safe = re.sub(r'[/:\\?*"<>|]', '–', title)
        shutil.copy2(mp4, EXPORT / f'{n:03d} {name} - {safe}.mp4')
    print(f'{len(vids)} videos in {EXPORT}')


if __name__ == '__main__':
    main()
