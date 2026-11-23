"""Fill the Guitarnautics app (guitarnautics/, its own git repo) with the current videos: each one compressed for phones
(720p, CRF 30, 64k audio, faststart), only when its render is newer; then catalogue.json in course order.

    tools/audiation/.venv/bin/python tools/drillvideo/app_build.py
"""
import json
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
from export import OUT, SUPERSEDED, strand  # noqa: E402

# videos made from tabs whose transcribers allow private study only (Asturias, Romance, BWV 999, The Entertainer,
# Guárdame las vacas, Lágrima): kept in, as the app is only for its owner's study
PRIVATE: set = set()  # the app is for one player's own study (owner's decision, 2026-11-15), so nothing is held back

APP = HERE.parent.parent / 'guitarnautics'
VIDEOS = APP / 'videos'


def ffmpeg() -> str:
    import imageio_ffmpeg
    return imageio_ffmpeg.get_ffmpeg_exe()


def main() -> None:
    VIDEOS.mkdir(parents=True, exist_ok=True)
    ff, items = ffmpeg(), []
    for meta in OUT.glob('*.json'):
        m = json.loads(meta.read_text())
        src = OUT / f"{m['id']}.mp4"
        if m['id'] in SUPERSEDED or m['id'] in PRIVATE or not src.exists():
            continue
        k, name = strand(m['id'])
        items.append((k, m['id'].lower(), m['id'], name, m.get('title') or m['id'], m.get('duration_s', 0), src))
    items.sort()
    catalogue, done = [], 0
    for n, (_, _, vid, name, title, dur, src) in enumerate(items, 1):
        dst = VIDEOS / f'{vid}.mp4'
        if not dst.exists() or dst.stat().st_mtime < src.stat().st_mtime:
            tmp = dst.with_suffix('.part.mp4')
            r = subprocess.run([ff, '-y', '-v', 'error', '-i', str(src), '-vf', 'scale=1280:-2', '-c:v', 'libx264', '-preset', 'slow',
                                '-crf', '30', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '64k', '-movflags', '+faststart', str(tmp)])
            if r.returncode:  # the render is still being written: skip it this time
                tmp.unlink(missing_ok=True)
                print(f'skipped {vid} (unreadable now; run again later)')
            else:
                tmp.replace(dst)
                done += 1
        if not dst.exists():
            continue
        catalogue.append({'n': n, 'id': vid, 'strand': name, 'title': title, 'duration': round(dur)})
    keep = {f"{c['id']}.mp4" for c in catalogue}
    for old in VIDEOS.glob('*.mp4'):
        if old.name not in keep:
            old.unlink()
    (APP / 'catalogue.json').write_text(json.dumps(catalogue, ensure_ascii=False, indent=1))
    size = sum(p.stat().st_size for p in VIDEOS.glob('*.mp4')) / 1e6
    print(f'{len(catalogue)} videos ({done} compressed now), {size:.0f} MB')


if __name__ == '__main__':
    main()
