"""Write the drill videos that are mostly loops (every chord type × every string set, every progression × every area)
as video files in videos/. Edit the loops here, not the generated YAML.

    python3 tools/drillvideo/gen.py            # rewrites 02, 03b, 11t and the scale-family videos (12m, 13h, 13s)
"""
import json
from pathlib import Path

HERE = Path(__file__).resolve().parent
KEYS = '[G, C, F, Bb, Eb, Ab, Db, Gb, B, E, A, D]'
WHERE = "'{bassNote} on string {bassString}, fret {bassFret}'"


def q(x, **_) -> str:
    """A JSON string is a safe YAML scalar, colons and all."""
    return json.dumps(x, ensure_ascii=False)


def ladders(quality: str, sym: str, sets: list, voicing: str = 'drop2', say: str | None = None, note: str | None = None) -> str:
    """One quality's ladders across the whole neck on each string set, each ending on its map."""
    out = ''
    for i, ss in enumerate(sets):
        out += f"  - section: {sym} · strings {'-'.join(map(str, ss))}\n"
        if i == 0 and note:
            out += f"    notes: ['{note}']\n"
        if i == 0 and say:
            out += f'    say: {q(say, ensure_ascii=False)}\n'
        out += (f"    play: strum 2\n    click: false\n    expand: {{kind: ladder, root: G, quality: {quality}, voicing: {voicing}, "
                f"strings: {ss}, minFret: 0, maxFret: 17, dir: up, bars: 0.5, sub: {WHERE}, map: true}}\n")
    return out


def morphs(title: str, sets: list, chain: str, voicing: str = 'drop2', count: int = 4, section: str = 'Morphing') -> str:
    out = ''
    for ss in sets:
        out += (f"  - section: {section} · strings {'-'.join(map(str, ss))}\n    notes: null\n    play: strum 2\n    click: false\n"
                f"    expand: {{kind: morph, root: G, voicing: {voicing}, strings: {ss}, count: {count}, bars: 0.5, chain: {chain}}}\n")
    return out


def ending(table: str, daily: list, got: list) -> str:
    return f'''
  # ---------- all 12 keys ----------
  - section: All 12 keys
    key: null
    mark: null
    now: Then every key
    sub: round the cycle of fourths
    show: null
    band: null
    notes: null
{table}
  - notes: {daily}
    hold: 7

  - section: null
    table: null
    notes: null
    card:
      title: You've got it when
      lines: {got}
    hold: 6
'''


def ladder_table(quality: str, sets: list, voicing: str = 'drop2', what: str = 'the lowest voicing') -> str:
    heads = ', '.join('-'.join(map(str, ss)) for ss in sets)
    cols = ', '.join(f"'{{sets[{i}][bass]}} · {{sets[{i}][at]}}'" for i in range(len(sets)))
    return f'''    table:
      title: "Where each key starts: the bass degree and fret of {what}"
      head: [Key, {heads}]
      widths: [{', '.join([str(round(1 / (len(sets) + 1), 3))] * (len(sets) + 1))}]
      rows_from: {{kind: ladderTable, keys: {KEYS}, quality: {quality}, voicing: {voicing}, lowFret: 0, sets: {sets}, cols: ['{{chord}}', {cols}]}}
    say: Then every key, round the cycle of fourths. The table shows where each key starts.
    hold: 6'''


def header(id_: str, title: str, rule: str, lines: list, intro_now: str, intro_sub: str, notes: list, say: str,
           bpm: int = 80, comment: str = '', drill: list | None = None, key: str = 'Key of G') -> str:
    drill = drill or DRILL[id_]
    return f'''# {comment}
# Written by gen.py: change the loops there, not the steps here.
id: {id_}
title: {q(title, ensure_ascii=False)}
rule: {q(rule, ensure_ascii=False)}
bpm: {bpm}
captions: false

steps:
  - card: {{title: {q(title, ensure_ascii=False)}, lines: {q(lines, ensure_ascii=False)}}}
    hold: 4.5
  - card: {{title: The drill, lines: {q(drill, ensure_ascii=False)}}}
    hold: {round(2 + 1.8 * len(drill), 1)}
  - card: null
    section: The drill
    key: {key}
    now: {q(intro_now, ensure_ascii=False)}
    sub: {q(intro_sub, ensure_ascii=False)}
    notes: {q(notes, ensure_ascii=False)}
    say: {q(say, ensure_ascii=False)}
'''


DRILL = {'02-close-triads': ['1   One string set: G from its lowest inversion to the top of the neck', '2   Name the lowest note (1, 3 or 5) before each triad', '3   Morph each inversion to minor, diminished and augmented', '4   Next string set; then the next key from the table'], '03b-drop2-more': ['1   One chord, one string set: every inversion up the neck, bass degree first', '2   Then morph it from the chord it comes from', '3   Next string set; then the next key from the table'], '11t-turnarounds-areas': ['1   One progression in one area: every chord to the nearest voicing', '2   The same progression in the next area, until all five are done', '3   Next progression; then the next key']}

DROP2 = [[4, 3, 2, 1], [5, 4, 3, 2], [6, 5, 4, 3]]
CLOSE = [[3, 2, 1], [4, 3, 2], [5, 4, 3], [6, 5, 4]]
SEVENTHS = "[[maj7], ['7', '7', b7, lower the 7th], [m7, '3', b3, lower the 3rd], [m7b5, '5', b5, lower the 5th], [dim7, b7, bb7, lower the 7th again]]"


def close_triads() -> str:
    out = header('02-close-triads', 'Close triads', 'Name the lowest note before you play each triad.',
                 ['Every inversion of G on every set of three strings,', 'across the whole neck, then each one morphed', 'to minor, diminished and augmented.'],
                 'G major · G B D', 'strings 3-2-1, 4-3-2, 5-4-3, 6-5-4 · every inversion · bottom to top',
                 ['Each triad is named by its lowest note: 1, 3 or 5.', 'Each set ends with all its triads on the neck at once.'],
                 'Every inversion of G major on each set of three strings, from the bottom of the neck to the top. Then each one morphed, one note at a time.',
                 comment='Video 2: close triads (plan v3, docs/drill-videos-plan.md).')
    out += ladders('maj', 'G', CLOSE, voicing='close', note='The G-B pair of strings bends every shape that crosses it: learn them by the lowest note.')
    out += '''
  # ---------- morphing ----------
  - section: Morphing
    now: One triad, four qualities
    sub: G → Gm → G° (lower the 3rd, then the 5th) · G → G+ (raise the 5th)
    show: null
    notes: ['The ringed note is the one that moved. The other two stay put.']
    say: Now morph each one. Lower the third for minor, then the fifth for diminished. Raise the fifth for augmented.
'''
    out += morphs('', CLOSE, "[[maj], [min, '3', b3, lower the 3rd], [dim, '5', b5, lower the 5th]]", voicing='close', count=3,
                  section='Major → minor → dim')
    out += morphs('', CLOSE, "[[maj], [aug, '5', '#5', raise the 5th]]", voicing='close', count=3, section='Major → augmented')
    out += ending(ladder_table('maj', CLOSE, voicing='close', what='the lowest G-type triad'),
                  ['Minor, diminished and augmented: morph from the major triad, as shown.', 'Each day: one string set in two or three keys, plus one old key.'],
                  ['you can name any triad by its lowest note,', 'find it on any string set in any key within a few seconds,', 'and morph it to minor, diminished or augmented without stopping.'])
    return out


def drop2_more() -> str:
    out = header('03b-drop2-more', 'Drop 2: four more chords', 'Call the bass degree before you play each voicing.',
                 ['G6, Gm6, Gm(maj7) and G7sus4 in drop 2,', 'on every set of four strings, across the whole neck,', 'then each one morphed from the chord it comes from.'],
                 'Four more chords on G', 'G6 · Gm6 · Gm(maj7) · G7sus4 · strings 4-3-2-1, 5-4-3-2, 6-5-4-3',
                 ['Each voicing is named by its bass note.', 'G6 has the same notes as Em7, and Gm6 the same as Em7♭5.'],
                 'Four more drop 2 chords on G, on each set of four strings, from the bottom of the neck to the top.',
                 comment='Video 3b: drop 2, four more chords (plan v3).')
    out += ladders("'6'", 'G6', DROP2, say='G six.', note='G6 = G B D E: the same notes as Em7.')
    out += ladders('m6', 'Gm6', DROP2, say='G minor six.', note='Gm6 = G B♭ D E: the same notes as Em7♭5.')
    out += ladders('mMaj7', 'Gm(maj7)', DROP2, say='G minor major seven.', note='Gm(maj7) = G B♭ D F♯: the tonic minor sound.')
    out += ladders('7sus4', 'G7sus4', DROP2, say='G seven sus four.', note='G7sus4 = G C D F: the 3rd raised to the 4th.')
    out += '''
  # ---------- where they come from ----------
  - section: Morphing
    now: Where they come from
    sub: each is one note away from a chord you know
    show: null
    notes: ['The ringed note is the one that moved.']
    say: Each of these is one note away from a chord you already know. Here they are, from every inversion on the top four strings.
'''
    top = [[4, 3, 2, 1]]
    out += morphs('', top, "[[maj7], ['6', '7', '6', lower the 7th to the 6th]]", section='Gmaj7 → G6')
    out += morphs('', top, "[[maj7], [mMaj7, '3', b3, lower the 3rd]]", section='Gmaj7 → Gm(maj7)')
    out += morphs('', top, "[[m7], [m6, b7, '6', lower the ♭7 to the 6th]]", section='Gm7 → Gm6')
    out += morphs('', top, "[['7'], [7sus4, '3', '4', raise the 3rd to the 4th]]", section='G7 → G7sus4')
    out += ending(ladder_table("'6'", DROP2, what='the lowest G6-type chord'),
                  ['The other three: morph from maj7, m7 or 7 as shown.', 'Each day: one chord on all three string sets, in two or three keys.'],
                  ['you can find G6, Gm6, Gm(maj7) and G7sus4 in any inversion,', 'on any string set, in any key, within a few seconds,', 'and say which chord each one comes from.'])
    return out


def turnarounds(id_='11t-turnarounds-areas', strings=(4, 3, 2, 1), where='on the top four strings') -> str:
    out = header(id_, 'Turnarounds in five areas', 'Stay in the area: every chord is a fret or two away.',
                 ['Five essential progressions, voice-led', 'without leaving each of the five CAGED areas,', where + '.'],
                 'Five progressions, five areas', 'ii–V–I · I–vi–ii–V · iii–VI–ii–V · backdoor · minor ii–V–i',
                 ['Each chord moves to the nearest voicing of the next.', 'The band is the area: the hand never leaves it.'],
                 'Five progressions in G, each played in the five CAGED areas without moving out of the area. Every chord moves to the nearest voicing of the next.',
                 bpm=80, comment='Progression strand: turnarounds in the five areas, after Marbin\'s fifteen areas (plan v3).', drill=DRILL['11t-turnarounds-areas'])
    progs = [('ii–V–I', '| ii:m7 | V:7 | I:maj7 |', 'Two five one.', 'Am7 – D7 – Gmaj7: the 7th of each chord falls to the 3rd of the next.'),
             ('I–vi–ii–V', '| I:maj7 | vi:m7 | ii:m7 | V:7 |', 'One six two five.', 'Gmaj7 – Em7 – Am7 – D7: the standard turnaround.'),
             ('iii–VI–ii–V', '| iii:m7 | VI:7 | ii:m7 | V:7 |', 'Three six two five.', 'Bm7 – E7 – Am7 – D7: E7 is the V of Am7.'),
             ('Backdoor', '| iv:m7 | bVII:7 | I:maj7 |', 'The backdoor.', 'Cm7 – F7 – Gmaj7: home from a whole step below, borrowed from G minor.'),
             ('Minor ii–V–i', '| ii:m7b5 | V:7 | i:m6 |', 'Minor two five one.', 'Aø – D7 – Gm6: the minor-key cadence.')]
    forms = ['E', 'D', 'C', 'A', 'G']
    for name, chart, say, note in progs:
        out += f"\n  # ---------- {name} ----------\n"
        for i, f in enumerate(forms):
            out += f"  - section: {name} · {f}-form area\n"
            if i == 0:
                out += f"    notes: ['{note}']\n    say: {q(say, ensure_ascii=False)}\n"
            out += (f"    play: strum 2\n    click: false\n    expand: {{kind: areaProg, key: G, chart: '{chart}', strings: {list(strings)}, form: {f}, "
                    f"bars: 0.5, now: '{{chord}}', sub: '{{roman}} · {f}-form area'}}\n    hold: 0.4\n")
    out += ending('''    table:
      title: "Where each key's areas sit: the I chord's root (string: fret) in each form"
      head: [Key, E form, D form, C form, A form, G form]
      widths: [0.2, 0.16, 0.16, 0.16, 0.16, 0.16]
      rows_from: {kind: areasTable, keys: ''' + KEYS + ''', forms: [E, D, C, A, G], cols: ['{key}', '{at[0]}', '{at[1]}', '{at[2]}', '{at[3]}', '{at[4]}']}
    say: Then every key, round the cycle of fourths, five areas each.
    hold: 6''',
                  ['In each key: find the I chord’s root in each form, then voice-lead the progression inside that area.', 'Each day: one progression in all five areas, in one or two keys.'],
                  ['you can play all five progressions in any of the five areas', 'of any key, without leaving the area', 'and without stopping between chords.'])
    return out


def scale_family(id_: str, title: str, rule: str, lines: list, drill: list, now: str, sub: str, notes: list, say: str,
                 core: list, extras: list, daily: list, got: list, comment: str) -> str:
    """Scales on one root over a drone: each core scale run in one region with its colour notes ringed, then on the
    whole neck; the rarer ones as whole-neck maps only. A scale is a scale id or a list of tones."""
    out = header(id_, title, rule, lines, now, sub, notes, say, bpm=100, comment=comment, drill=drill)
    out = out.replace('    key: Key of G\n', '    key: Root G\n    drone: G2\n', 1)

    def src(sc):
        return f'tones: {q(sc)}' if isinstance(sc, list) else f'scale: {sc}'
    for sc, name, ring, desc, note, region in core:
        out += f"""
  # ---------- {name} ----------
  - section: {name}
    now: G {name}
    sub: {q(desc)}
    show: {{kind: run, root: G, {src(sc)}, region: {region}, path: up, ring: {q(ring)}}}
    band: true
    notes: {q([note])}
    say: {q('G ' + name + '.')}
    play: run 0.5
    hold: 0.5
  - now: G {name} · the whole neck
    sub: {q('ringed: ' + ' '.join(r.replace('b', '♭').replace('#', '♯') for r in ring))}
    show: {{kind: run, root: G, {src(sc)}, region: {{frets: [0, 17]}}, ring: {q(ring)}}}
    band: null
    hold: 3.5
"""
    if extras:
        out += """
  - section: Also in the family
    now: Worth recognising
    sub: less used · know where they sit
    show: null
    notes: null
    say: And the rest of the family, to recognise.
"""
        for sc, name, ring, desc in extras:
            out += f"""  - now: G {name}
    sub: {q(desc)}
    show: {{kind: run, root: G, {src(sc)}, region: {{frets: [0, 17]}}, ring: {q(ring)}}}
    hold: 3
"""
    out += f"""
  - section: Every root
    key: null
    drone: null
    now: Then every root
    sub: the same scales on each of the twelve roots, over a drone
    show: null
    notes: {q(daily)}
    say: Then every root.
    hold: 7
  - section: null
    notes: null
    card:
      title: You've got it when
      lines: {q(got)}
    hold: 6
"""
    return out


def melodic_minor() -> str:
    return scale_family(
        '12m-melodic-minor-modes', 'Melodic minor and its modes', 'Name the parent melodic minor; hear the colour notes.',
        ['Melodic minor and the three of its modes jazz uses most,', 'on G over a drone, colour notes ringed,', 'in one region, then across the whole neck.'],
        ['1   A drone on G', '2   One scale in one region: land on its ringed notes and hold them', '3   Then the same scale across the whole neck', '4   Next scale; then the next root'],
        'Four scales worth knowing', 'melodic minor · Lydian dominant · altered · Locrian ♮2',
        ['Melodic minor = the major scale with a ♭3. Each mode is that scale from another note.'],
        'Melodic minor, and the three of its modes that jazz uses most. All on G, over a drone.',
        [('melodic-minor', 'melodic minor', ['b3', '7'], 'Gm(maj7) and Gm6 · the ♭3 with a natural 7', 'The tonic minor sound.', '{caged: E}'),
         ('lydian-dominant', 'Lydian dominant', ['#4', 'b7'], 'G7♯11 · the 4th mode of D melodic minor', 'Fits IV7, ♭VII7 and the tritone sub.', '{caged: E}'),
         (['1', 'b9', '#9', '3', 'b5', 'b13', 'b7'], 'altered', ['b9', '#9', 'b5', 'b13'], 'G7alt · the 7th mode of A♭ melodic minor', 'Melodic minor a half step above the root: every tension altered.', '{caged: E}'),
         ('locrian-nat2', 'Locrian ♮2', ['2'], 'Gø (m7♭5) · the 6th mode of B♭ melodic minor', 'The ii of a minor ii–V: Locrian with a natural 2.', '{caged: E}')],
        [('lydian-augmented', 'Lydian augmented', ['#4', '#5'], 'Gmaj7♯5 · the 3rd mode of E melodic minor'),
         ('mixolydian-b6', 'Mixolydian ♭6', ['b6'], 'G7♭13 · the 5th mode of C melodic minor'),
         ('dorian-b2', 'Dorian ♭2', ['b2'], 'G7sus♭9 sound · the 2nd mode of F melodic minor')],
        ['Find each mode from its parent: Lydian dominant = melodic minor a 5th above; altered = a half step above; Locrian ♮2 = a minor 3rd above.', 'Each day: the four core scales on one root in one region, then across the neck.'],
        ['you can play melodic minor, Lydian dominant, altered and Locrian ♮2', 'on any root, in any region,', 'and name the melodic minor each comes from.'],
        'Melodic minor modes on one root (plan v3).')


def harmonic_minor() -> str:
    return scale_family(
        '13h-harmonic-minor-modes', 'Harmonic minor and its modes', 'The ♭6 and the natural 7: the minor key’s pull home.',
        ['Harmonic minor and Phrygian dominant, the two that matter,', 'on G over a drone, colour notes ringed,', 'then the rest of the family to recognise.'],
        ['1   A drone on G', '2   One scale in one region: land on its ringed notes', '3   Then across the whole neck', '4   Next scale; then the next root'],
        'Harmonic minor on G', 'harmonic minor · Phrygian dominant · Dorian ♯4',
        ['Harmonic minor = natural minor with a raised 7th.'],
        'Harmonic minor and its modes on G, over a drone. Two you will use all the time, and the rest to recognise.',
        [('harmonic-minor', 'harmonic minor', ['b6', '7'], 'Gm(maj7) · the ♭6 against the natural 7', 'The augmented 2nd between ♭6 and 7 is the sound: mind the stretch.', '{caged: E}'),
         ('phrygian-dominant', 'Phrygian dominant', ['b2', '3'], 'G7♭9♭13 · the 5th mode of C harmonic minor', 'The V7 of a minor key: D Phrygian dominant over D7 resolves to Gm.', '{caged: E}'),
         ('dorian-sharp4', 'Dorian ♯4', ['#4'], 'Gm7♯11 · the 4th mode of D harmonic minor', 'The Romanian / Ukrainian minor: a darker Dorian.', '{caged: E}')],
        [('locrian-nat6', 'Locrian ♮6', ['6'], 'Gø with a natural 6 · the 2nd mode'),
         ('ionian-sharp5', 'Ionian ♯5', ['#5'], 'Gmaj7♯5 · the 3rd mode'),
         ('lydian-sharp2', 'Lydian ♯2', ['#2', '#4'], 'Gmaj7♯11 with a ♯9 · the 6th mode'),
         ('altered-dim', 'altered diminished', ['b9', '#9', '6'], 'G°7 colour · the 7th mode')],
        ['Phrygian dominant is the one to own: play it over every V7 that resolves to minor.', 'Each day: harmonic minor and Phrygian dominant on one root, one region, then the whole neck.'],
        ['you can play harmonic minor and Phrygian dominant on any root,', 'in any region and across the neck,', 'and hear the ♭6 and the 7 against the drone.'],
        'Harmonic minor modes on one root (plan v3).')


def symmetric() -> str:
    out = header('13s-symmetric-scales', 'Diminished and symmetric scales', 'Learn one shape and the distance it repeats.',
                 ['Half-whole, whole-half, whole tone and augmented:', 'scales that repeat, so one shape covers several keys.'],
                 'Four symmetric scales on G', 'half-whole · whole-half · whole tone · augmented',
                 ['Symmetric: the scale repeats itself every few frets, so it has only 2 or 3 versions.'],
                 'Four symmetric scales on G. Each one repeats every few frets, so one shape covers several keys.',
                 bpm=100, comment='Diminished and symmetric scales (plan v3).',
                 drill=['1   One scale in one region, over its chord', '2   Move the same shape up the distance it repeats (3 frets, or 2)', '3   Then the classic sequence: 3rds through the scale', '4   Next scale'])
    out = out.replace('    key: Key of G\n', '    key: Root G\n    drone: G2\n', 1)
    blocks = [
        ('Half-whole diminished', 'diminished-hw', ['b2', '#2', '#4', '6'], 'G7♭9 · ♭9 ♯9 ♯11 13', 3,
         'Over dominant 7♭9: the same notes fit G7, B♭7, D♭7 and E7.'),
        ('Whole-half diminished', 'diminished-wh', ['bb7', '7'], 'G°7 · the diminished chord plus the notes a whole step above', 3,
         'Over diminished 7th chords. Which one starts with a half step decides the job: say which you’re playing.'),
        ('Whole tone', 'whole-tone', ['#4', '#5'], 'G7♯5 · six notes, all whole steps', 2,
         'Over 7♯5 and augmented sounds; only two whole-tone scales exist.'),
        ('Augmented', 'augmented', ['b3', '#5'], 'Gmaj7♯5 · two augmented triads, G and B', 4,
         'Minor 3rd, half step, alternating: the hexatonic sound of modern jazz.'),
    ]
    for name, sc, ring, desc, step, note in blocks:
        out += f"""
  # ---------- {name} ----------
  - section: {name}
    now: G {name.lower()}
    sub: {q(desc)}
    show: {{kind: run, root: G, scale: {sc}, region: {{frets: [2, 5]}}, path: up, ring: {q(ring)}}}
    band: true
    notes: {q([note])}
    say: {q(name + '.')}
    play: run 0.5
    hold: 0.4
"""
        for k in (1, 2):
            lo = 2 + k * step
            out += f"""  - now: {q(f'The same shape, {step * k} frets up')}
    sub: {q(f'it repeats every {step} frets')}
    show: {{kind: run, root: G, scale: {sc}, region: {{frets: [{lo}, {lo + 3}]}}, path: up, ring: {q(ring)}}}
    play: run 0.5
    hold: 0.4
"""
        out += f"""  - now: In 3rds
    sub: every note, then the one two steps above it
    show: {{kind: run, root: G, scale: {sc}, region: {{frets: [2, 5]}}, sequence: {{kind: intervals, step: 3}}, ring: {q(ring)}}}
    notes: null
    play: run 0.5
    hold: 0.4
  - now: {q(f'G {name.lower()} · the whole neck')}
    sub: the repeat is visible across the neck
    show: {{kind: run, root: G, scale: {sc}, region: {{frets: [0, 17]}}, ring: {q(ring)}}}
    band: null
    hold: 3.5
"""
    out += f"""
  - section: Other scales
    drone: null
    key: null
    now: The other scales in the series
    sub: blues and pentatonics (14a) · bebop scales (15) · harmonic major (13a)
    show: null
    notes: ['Symmetric scales sound like patterns: break them up by landing on chord tones.']
    say: The other scales, blues, bebop and harmonic major, have their own videos.
    hold: 6
  - section: null
    notes: null
    card:
      title: You've got it when
      lines: ['you can play each symmetric scale in one region over its chord,', 'move it by the distance it repeats,', 'and run it in 3rds without stopping.']
    hold: 6
"""
    return out


DROP3 = [[6, 4, 3, 2], [5, 3, 2, 1]]
SPREAD = [[6, 4, 3], [5, 3, 2], [4, 2, 1]]


def spread_triads() -> str:
    out = header('02b-spread-triads', 'Spread triads', 'Name the lowest note; mute the string you skip.',
                 ['Every inversion of G spread over a skipped string,', 'on 6-4-3, 5-3-2 and 4-2-1, across the whole neck,', 'then morphed to minor, diminished and augmented.'],
                 'G major, spread · G B D', 'strings 6-4-3, 5-3-2, 4-2-1 · every inversion · bottom to top',
                 ['The middle note of a close triad drops an octave: the triad opens out over a 10th.',
                  'Mute the skipped string with the finger on the string below it.'],
                 'Spread triads: every inversion of G on each skipped-string set, bottom of the neck to the top. Then each one morphed.',
                 comment='Video 2b: spread (open) triads.',
                 drill=['1   One string set: G spread, every inversion up the neck', '2   Name the lowest note (1, 3 or 5); mute the skipped string',
                        '3   Morph each to minor, diminished and augmented', '4   Next set; then the next key from the table'])
    out += ladders('maj', 'G', SPREAD, voicing='spread', note='The open sound of classical and fingerstyle guitar: the bass and top a 10th apart.')
    out += morphs('', SPREAD, "[[maj], [min, '3', b3, lower the 3rd], [dim, '5', b5, lower the 5th]]", voicing='spread', count=3,
                  section='Major → minor → dim')
    out += morphs('', SPREAD, "[[maj], [aug, '5', '#5', raise the 5th]]", voicing='spread', count=3, section='Major → augmented')
    out += ending(ladder_table('maj', SPREAD, voicing='spread', what='the lowest spread G-type triad'),
                  ['Each day: one string set in two or three keys, plus one old key.'],
                  ['you can find any spread triad on any set, in any key,', 'name its lowest note before you play it,', 'and keep the skipped string silent.'])
    return out


def drop3_core() -> str:
    out = header('03c-drop3-core', 'Drop 3 inversions', 'Call the bass degree; mute the string you skip.',
                 ['Every inversion of all five seventh chords in drop 3,', 'on 6-4-3-2 and 5-3-2-1, across the whole neck,', 'then each inversion morphed from maj7 down to °7.'],
                 'Five seventh chords on G, drop 3', 'maj7 · 7 · m7 · m7♭5 · °7  ·  strings 6-4-3-2, 5-3-2-1',
                 ['Drop 3: the 3rd voice from the top of a close chord drops an octave. The bass sits alone, a string apart.',
                  'The jazz-guitar grip: a bass with three notes above it, the 5th string (or the 4th) muted.'],
                 'Every drop 3 inversion of the five seventh chords on G, on both string sets, bottom of the neck to the top. Say the bass degree first.',
                 comment='Video 3c: drop 3, the core five.',
                 drill=['1   One chord type, one string set: every inversion up the neck', '2   Say the bass degree; mute the skipped string',
                        '3   Then morph each inversion: maj7 → 7 → m7 → m7♭5 → °7', '4   Next string set; then the next key from the table'])
    for qual, sym, note in (('maj7', 'Gmaj7', 'Gmaj7 = G B D F♯'), ("'7'", 'G7', 'G7 = G B D F: the 7th lowered'),
                            ('m7', 'Gm7', 'Gm7 = G B♭ D F: the 3rd lowered too'), ('m7b5', 'Gm7♭5', 'Gm7♭5 = G B♭ D♭ F: and the 5th'),
                            ('dim7', 'G°7', 'G°7 = G B♭ D♭ F♭: and the 7th again')):
        out += ladders(qual, sym, DROP3, voicing='drop3', note=note)
    out += """
  - section: Morphing
    now: One voicing, five chords
    sub: maj7 → 7 → m7 → m7♭5 → °7, one note at a time
    show: null
    notes: ['The ringed note is the one that moved.']
    say: Now morph each inversion, one note at a time, down to diminished seven.
"""
    for ss in DROP3:
        out += (f"  - section: Morphing · strings {'-'.join(map(str, ss))}\n    notes: null\n    play: strum 2\n    click: false\n"
                f"    expand: {{kind: morph, root: G, voicing: drop3, strings: {ss}, bars: 0.5}}\n")
    out += ending(ladder_table('maj7', DROP3, voicing='drop3', what='the lowest Gmaj7-type drop 3'),
                  ['Each day: one chord type on both sets, in two or three keys.'],
                  ['you can find all five seventh chords in drop 3, any inversion,', 'on both sets, in any key, within a few seconds,', 'and morph each from maj7 to °7 without stopping.'])
    return out


def drop3_more() -> str:
    out = header('03d-drop3-more', 'Drop 3: four more chords', 'Call the bass degree; mute the string you skip.',
                 ['G6, Gm6, Gm(maj7) and G7sus4 in drop 3,', 'on 6-4-3-2 and 5-3-2-1, across the whole neck,', 'then each one morphed from the chord it comes from.'],
                 'Four more chords on G, drop 3', 'G6 · Gm6 · Gm(maj7) · G7sus4 · strings 6-4-3-2, 5-3-2-1',
                 ['G6 has the same notes as Em7, and Gm6 the same as Em7♭5.'],
                 'Four more drop 3 chords on G, on both string sets, from the bottom of the neck to the top.',
                 comment='Video 3d: drop 3, four more chords.',
                 drill=['1   One chord, one string set: every inversion up the neck, bass degree first', '2   Then morph it from the chord it comes from',
                        '3   Next string set; then the next key from the table'])
    for qual, sym, note in (("'6'", 'G6', 'G6 = G B D E'), ('m6', 'Gm6', 'Gm6 = G B♭ D E'), ('mMaj7', 'Gm(maj7)', 'Gm(maj7) = G B♭ D F♯'),
                            ('7sus4', 'G7sus4', 'G7sus4 = G C D F')):
        out += ladders(qual, sym, DROP3, voicing='drop3', note=note)
    out += """
  - section: Morphing
    now: Where they come from
    sub: each is one note away from a chord you know
    show: null
    notes: ['The ringed note is the one that moved.']
"""
    top = [[5, 3, 2, 1]]
    out += morphs('', top, "[[maj7], ['6', '7', '6', lower the 7th to the 6th]]", voicing='drop3', section='Gmaj7 → G6')
    out += morphs('', top, "[[maj7], [mMaj7, '3', b3, lower the 3rd]]", voicing='drop3', section='Gmaj7 → Gm(maj7)')
    out += morphs('', top, "[[m7], [m6, b7, '6', lower the ♭7 to the 6th]]", voicing='drop3', section='Gm7 → Gm6')
    out += morphs('', top, "[['7'], [7sus4, '3', '4', raise the 3rd to the 4th]]", voicing='drop3', section='G7 → G7sus4')
    out += ending(ladder_table("'6'", DROP3, voicing='drop3', what='the lowest G6-type drop 3'),
                  ['Each day: one chord on both sets, in two or three keys.'],
                  ['you can find G6, Gm6, Gm(maj7) and G7sus4 in drop 3,', 'any inversion, either set, any key,', 'and say which chord each one comes from.'])
    return out


TOP = [[4, 3, 2, 1]]


def morph_map() -> str:
    out = header('04a-morph-map', 'The morph map', 'Every chord is one note away from another.',
                 ['Every one-note move between the chord types,', 'and the diminished 7th as a hub:', 'one °7, four dominant 7ths.'],
                 'One note moves, the chord changes', 'every inversion on the top four strings',
                 ['The ringed note is the one that moved; the other three stay put.',
                  'The main line, maj7 → 7 → m7 → m7♭5 → °7, is in videos 3a and 3c.'],
                 'The morph map: every one-note move between the chord types, then the diminished seventh as a hub.',
                 comment='Video 4a: the morph map.',
                 drill=['1   Hold one voicing; move one note; name the new chord', '2   Every branch below, on every inversion',
                        '3   The °7 hub: lower any one note to get a dominant 7th', '4   Then the same in drop 3 and the next key'])
    for sec, chain in (('maj7 → 6', "[[maj7], ['6', '7', '6', lower the 7th to the 6th]]"),
                       ('maj7 → m(maj7)', "[[maj7], [mMaj7, '3', b3, lower the 3rd]]"),
                       ('maj7 → maj7♯5', "[[maj7], [maj7#5, '5', '#5', raise the 5th]]"),
                       ('7 → 7sus4', "[['7'], [7sus4, '3', '4', raise the 3rd to the 4th]]"),
                       ('7 → 7♯5 · 7 → 7♭5', "[['7'], [7#5, '5', '#5', raise the 5th]]"),
                       ('m7 → m6', "[[m7], [m6, b7, '6', lower the ♭7 to the 6th]]")):
        out += morphs('', TOP, chain, count=4, section=sec)
    out += """
  - section: The °7 hub
    now: One °7, four dominant 7ths
    sub: 'lower any one note a half step, and it is the root of a dominant 7th'
    show: null
    notes: ['G°7 → F♯7, A7, C7 or E♭7: four dominants a minor 3rd apart, all from one shape.',
            'Read it backwards too: a dominant 7th with its root raised a half step is a °7 (the 7♭9 sound).']
    say: The diminished seventh is a hub. Lower any one note a half step, and it becomes the root of a dominant seventh.
"""
    for sec, chain in (('G°7 → F♯7', "[[dim7], ['7', '1', '7', lower G to F♯, 'F#']]"),
                       ('G°7 → A7', "[[dim7], ['7', b3, '2', lower B♭ to A, A]]"),
                       ('G°7 → C7', "[[dim7], ['7', b5, '4', lower D♭ to C, C]]"),
                       ('G°7 → E♭7', "[[dim7], ['7', bb7, b6, lower E to E♭, Eb]]")):
        out += morphs('', TOP, chain, count=4, section=sec)
    out += """
  - section: The map
    now: null
    sub: null
    show: null
    notes: null
    table:
      title: Every one-note move
      head: [From, Move, To]
      widths: [0.3, 0.4, 0.3]
      rows: [[maj7, 7 → ♭7, '7'], ['7', 3 → ♭3, m7], [m7, 5 → ♭5, m7♭5], [m7♭5, ♭7 → ♭♭7, °7], [maj7, 7 → 6, '6'], [maj7, 3 → ♭3, m(maj7)],
             [maj7, 5 → ♯5, maj7♯5], ['7', 3 → 4, 7sus4], ['7', 5 → ♯5 or ♭5, 7♯5 · 7♭5], [m7, ♭7 → 6, m6], [°7, any note ↓, a dominant 7th], [m(maj7), 7 → ♭7, m7]]
    say: The whole map. Practise it in drop 3, and in every key.
    hold: 9
  - section: null
    table: null
    card:
      title: You've got it when
      lines: ['you can move any chord to its neighbours without lifting the other fingers,', 'name the new chord as it sounds,', 'and find all four dominants inside any °7.']
    hold: 6
"""
    return out


def extensions() -> str:
    out = header('04b-extensions', 'Extensions on four-note shapes', 'The 9 replaces the root; the 13 replaces the 5th.',
                 ['Colour tones on the drop 2 shapes you know:', 'the root up to the 9th, the 5th up to the 13th,', 'then the alterations, one fret each.'],
                 'Four notes, richer chords', 'every inversion on the top four strings',
                 ['On four strings something has to go: the root (the bass player has it) and the 5th (it adds nothing).',
                  'Each extension is one fret or two from the chord tone it replaces.'],
                 'Extensions: raise the root to the ninth, the fifth to the thirteenth, then alter them, one fret at a time.',
                 comment='Video 4b: extensions on four-note shapes.',
                 drill=['1   One inversion: move the root to the 9th, then the 5th to the 13th', '2   Every inversion; then each chord type below',
                        '3   Alter them: ♭9, ♯9, ♭13, one fret each', '4   Then the next key: the shapes move with the root'])
    for sec, chain in (('G7 → G9 → G13', "[['7'], ['9', '1', '9', raise the root to the 9th], ['13', '5', '13', raise the 5th to the 13th]]"),
                       ('G7 → G7♭9 → G7♭9♭13', "[['7'], [7b9, '1', b9, raise the root to the ♭9], [7b9b13, '5', b13, raise the 5th to the ♭13]]"),
                       ('G7 → G7♯9 → G7♯9♭13', "[['7'], [7#9, '1', '#9', raise the root to the ♯9], [7#9b13, '5', b13, raise the 5th to the ♭13]]"),
                       ('Gmaj7 → Gmaj9 → Gmaj13', "[[maj7], [maj9, '1', '9', raise the root to the 9th], [maj13, '5', '13', raise the 5th to the 13th]]"),
                       ('Gm7 → Gm9 → Gm11', "[[m7], [m9, '1', '9', raise the root to the 9th], [m11, '5', '11', lower the 5th to the 11th]]")):
        out += morphs('', TOP, chain, count=4, section=sec)
    out += """
  - section: null
    show: null
    notes: ['The 7♭9 and 7♯9♭13 shapes are the altered dominant: use them on V7 resolving to minor.']
    card:
      title: You've got it when
      lines: ['you can turn any drop 2 seventh into its 9th, 13th or altered form,', 'name the colour tone under each finger,', 'and do it in any key without looking it up.']
    hold: 6
"""
    return out


REGIONS = ['G', 'E', 'D', 'C', 'A']
AREAS_TABLE = """    table:
      title: "Where each key's regions sit: the root's string and fret in each form"
      head: [Key, E form, D form, C form, A form, G form]
      widths: [0.16, 0.168, 0.168, 0.168, 0.168, 0.168]
      rows_from: {kind: areasTable, keys: """ + KEYS + """, forms: [E, D, C, A, G], cols: ['{key}', '{at[0]}', '{at[1]}', '{at[2]}', '{at[3]}', '{at[4]}']}
    say: Then every key. The table shows where each region sits.
    hold: 6"""


def arp_runs(spec: str, regions=REGIONS, run=0.5, label='{form}-form region') -> str:
    out = ''
    for j, f in enumerate(regions):
        out += f"""  - now: {q(label.format(form=f))}
    sub: lowest note to highest (then play it back down)
    show: {{kind: run, {spec}, region: {{caged: {f}}}, path: up}}
    band: true
    play: run {run}
"""
    return out


def seventh_arps() -> str:
    out = header('05a-seventh-arpeggios', 'Seventh arpeggios', 'Every region, lowest note to highest: say the degree you land on.',
                 ['maj7, 7, m7, m7♭5 and °7 arpeggios on G,', 'in each of the five CAGED regions,', 'from the lowest note in the region to the highest and back.'],
                 'Five seventh arpeggios on G', 'maj7 · 7 · m7 · m7♭5 · °7 · five regions each',
                 ['Play every chord tone in the region, not root to root: the shape is the region, not the octave.',
                  'Then start on any chord tone: the 3rd, the 5th, the 7th.'],
                 'Seventh arpeggios on G, in each of the five regions, from the lowest note to the highest and back.',
                 bpm=120, comment='Video 5a: seventh arpeggios in the five CAGED regions.',
                 drill=['1   One arpeggio, one region: lowest note to highest and back', '2   The same arpeggio in the next region, all five',
                        '3   Then start on the 3rd, 5th or 7th instead of the root', '4   Next arpeggio; then the next key from the table'])
    for qual, sym, note in (('maj7', 'Gmaj7', 'G B D F♯'), ("'7'", 'G7', 'G B D F'), ('m7', 'Gm7', 'G B♭ D F'),
                            ('m7b5', 'Gm7♭5', 'G B♭ D♭ F'), ('dim7', 'G°7', 'G B♭ D♭ E: four notes a minor 3rd apart; it repeats every 3 frets')):
        out += f"  - section: {q(sym)}\n    notes: [{q(sym + ' = ' + note)}]\n    say: {q(sym.replace('maj7', ' major seven').replace('m7♭5', ' minor seven flat five').replace('°7', ' diminished seven').replace('m7', ' minor seven').replace('G7', 'G seven') + '.')}\n"
        out += arp_runs(f'root: G, quality: {qual}')
    out += ending(AREAS_TABLE, ['Each day: one arpeggio through all five regions, in two keys.'],
                  ['you can play all five seventh arpeggios in any region,', 'starting on any chord tone,', 'and name the degree on every note.'])
    return out


def extended_arps() -> str:
    out = header('05b-extended-arpeggios', '6, m6 and extended arpeggios', 'The arpeggio from the 3rd is the chord with a 9th.',
                 ['G6 and Gm6 arpeggios in every region (Marbin’s “painful practice”),', 'then arpeggios built from the 3rd:', 'Bm7 over G is Gmaj9.'],
                 'G6, Gm6, and arpeggios from the 3rd', 'five regions · then 3-5-7-9',
                 ['Marbin: take the triad, add the 6th, then the m6, then the 7th, in all five forms.',
                  'An arpeggio from the 3rd drops the root and adds the 9th: the colour without the bass.'],
                 'Six and minor six arpeggios in every region. Then arpeggios from the third, which add the ninth.',
                 bpm=120, comment="Video 5b: 6, m6 and 3-to-9 arpeggios (Marbin's painful practice).",
                 drill=['1   G6 in one region, lowest to highest and back; then Gm6', '2   All five regions', '3   The 3-to-9 arpeggios over a G bass in mind', '4   Next key from the table'])
    for qual, sym, note in (("'6'", 'G6', 'G6 = G B D E (Em7 from E)'), ('m6', 'Gm6', 'Gm6 = G B♭ D E: the Dorian minor')):
        out += f"  - section: {q(sym)}\n    notes: [{q(note)}]\n"
        out += arp_runs(f'root: G, quality: {qual}')
    out += """  - section: From the 3rd
    now: 3 5 7 9
    sub: the arpeggio of the chord built on the 3rd
    notes: ['Over a G bass, these arpeggios sound as the 9th chords: no root, all colour.']
    say: Arpeggios from the third. Over G, they are the ninth chords.
    hold: 0.3
"""
    for tones, sym, sub in ((['3', '5', '7', '9'], 'Bm7 over G = Gmaj9', 'B D F♯ A: the 3, 5, 7 and 9 of Gmaj9'),
                            (['3', '5', 'b7', '9'], 'Bm7♭5 over G = G9', 'B D F A: the 3, 5, ♭7 and 9 of G9'),
                            (['b3', '5', 'b7', '9'], 'B♭maj7 over G = Gm9', 'B♭ D F A: the ♭3, 5, ♭7 and 9 of Gm9')):
        for j, f in enumerate(['E', 'A']):
            out += f"""  - now: {q(sym + ' · ' + f + '-form region')}
    sub: {q(sub)}
    show: {{kind: run, root: G, tones: {q(tones)}, region: {{caged: {f}}}, path: up}}
    band: true
    play: run 0.5
    hold: 0.2
"""
    out += ending(AREAS_TABLE, ['Each day: G6 and Gm6 through two regions; one 3-to-9 arpeggio in one key.'],
                  ['you can play 6 and m6 arpeggios in every region,', 'build the arpeggio from the 3rd of any chord,', 'and hear it as the chord with a 9th.'])
    return out


def sequences() -> str:
    out = header('09b-scale-sequences', 'Scale sequences', 'Keep the sequence going across every string.',
                 ['G major in one region, as sequences:', 'groups of 3 and 4, 3rds, 4ths and 6ths,', 'then diatonic triads and 7th chords.'],
                 'G major sequences · E-form region', 'each one up the region, then the note on how to vary it',
                 ['A sequence is a small shape moved up the scale: the shape stays, the notes change.',
                  'Practise each three ways: ascending, descending, and alternating up-down.'],
                 'Scale sequences in G major, in one region. Groups, intervals, then triads and sevenths.',
                 bpm=84, comment='Video 9b: scale sequences in one region.',
                 drill=['1   One sequence up the region, even notes', '2   Then descending, then alternating', '3   Next sequence', '4   The same in the other four regions'])
    for name, seq, sub in (('Groups of 3', '{kind: groups, size: 3}', '1 2 3, 2 3 4, 3 4 5 …'),
                           ('Groups of 4', '{kind: groups, size: 4}', '1 2 3 4, 2 3 4 5 …'),
                           ('3rds', '{kind: intervals, step: 3}', '1 3, 2 4, 3 5 …'),
                           ('4ths', '{kind: intervals, step: 4}', '1 4, 2 5, 3 6 …'),
                           ('6ths', '{kind: intervals, step: 6}', '1 6, 2 7, 3 8 …'),
                           ('3rds, alternating', '{kind: intervals, step: 3, alternate: true}', '1 3, 4 2, 3 5, 6 4 …: one up, one down'),
                           ('Triads', '{kind: triads}', 'every diatonic triad: G Am Bm C D Em F♯°'),
                           ('7th chords', '{kind: sevenths}', 'Gmaj7 Am7 Bm7 Cmaj7 D7 Em7 F♯m7♭5')):
        out += f"""  - section: {q(name)}
    now: {q(name)}
    sub: {q(sub)}
    show: {{kind: run, root: G, scale: major, region: {{caged: E}}, sequence: {seq}}}
    band: true
    notes: null
    play: run {0.25 if 'Groups' in name or name in ('Triads', '7th chords') else 0.5}
    hold: 0.3
"""
    out += """  - section: null
    show: null
    band: null
    card:
      title: You've got it when
      lines: ['you can run every sequence up, down and alternating,', 'in all five regions without stopping at the string changes,', 'and name the chord each triad or 7th spells.']
    hold: 6
"""
    return out



def prog_step(section, chart, key='G', strings=(4, 3, 2, 1), start=3, now=None, sub='{roman}', notes=None, say=None, bars=0.5):
    out = f"  - section: {q(section)}\n"
    if now:
        out += f"    now: {q(now)}\n"
    out += f"    notes: {q(notes) if notes else 'null'}\n"
    if say:
        out += f"    say: {q(say)}\n"
    out += (f"    play: strum 2\n    click: false\n    expand: {{kind: prog, key: {key}, chart: {q(chart)}, voicing: drop2, "
            f"strings: {list(strings)}, startFret: {start}, bars: {bars}, sub: {q(sub)}}}\n")
    return out


def got(lines):
    return f"""  - section: null
    show: null
    band: null
    notes: null
    card:
      title: You've got it when
      lines: {q(lines)}
    hold: 6
"""


def melodic_minor_harmony() -> str:
    out = header('12-melodic-minor-harmony', 'Melodic minor harmony', 'One scale, seven chords, three famous sounds.',
                 ['The seven chords of G melodic minor in drop 2,', 'the m(maj7) and maj7♯5 ladders,', 'and one shape over three bass notes.'],
                 'G melodic minor, harmonised', 'Gm(maj7) Am7 B♭maj7♯5 C7 D7 Em7♭5 F♯m7♭5',
                 ['Two dominants a whole step apart (IV7 and V7) and two half-diminished chords: the jazz-minor sound.'],
                 'The seven chords of G melodic minor, in drop 2. Then its two special chords, and one shape over three basses.',
                 comment='Video 12: melodic minor harmony.',
                 drill=['1   The seven chords up the top four strings, naming each', '2   Then on the middle four', '3   The m(maj7) and maj7♯5 ladders', '4   One Gm(maj7) shape over G, C and F♯ basses'])
    chart = '| i:mMaj7 | ii:m7 | bIII:maj7#5 | IV:7 | V:7 | vi:m7b5 | vii:m7b5 | i:mMaj7 |'
    out += prog_step('The seven chords · strings 4-3-2-1', chart, start=3, say='The seven chords, on the top four strings.')
    out += prog_step('The seven chords · strings 5-4-3-2', chart, strings=(5, 4, 3, 2), start=5)
    out += ladders('mMaj7', 'Gm(maj7)', [[4, 3, 2, 1]], note='Gm(maj7) = G B♭ D F♯: the tonic of melodic minor.')
    out += ladders('maj7#5', 'Gmaj7♯5', [[4, 3, 2, 1]], note='maj7♯5: the chord on ♭III (B♭maj7♯5 in G melodic minor), Lydian augmented.')
    shape = ['G3', 'D4', 'F#4', 'Bb4']
    for bass, s_, root, labs, name, sub in (('G2', 6, 'G', ['1', '1', '5', '7', 'b3'], 'over G: Gm(maj7)', 'the tonic'),
                                            ('C3', 5, 'C', ['1', '5', '9', '#11', 'b7'], 'over C: C9♯11', 'the 4th mode, Lydian dominant'),
                                            ('F#2', 6, 'F#', ['1', 'b9', 'b13', '1', '3'], 'over F♯: F♯7alt', 'the 7th mode, altered: ♭9, ♭13 and the 3rd')):
        out += f"""  - section: One shape, three chords
    now: {q(name)}
    sub: {q(sub)}
    show: {{kind: line, root: {root}, pitches: {q([bass] + shape)}, each: [{s_}, 4, 3, 2, 1], labels: {q(labs)}}}
    notes: ['The same four notes on top; the bass decides the chord.']
    play: strum 2
    hold: 1
"""
    out += got(['you can play the seven melodic minor chords in drop 2 and name each,', 'find m(maj7) and maj7♯5 anywhere,', 'and hear one shape become three chords over three basses.'])
    return out


def harmonic_harmony() -> str:
    out = header('13a-harmonic-harmony', 'Harmonic minor and major harmony', 'The raised 7th makes the dominant; the ♭6 makes the colour.',
                 ['The seven chords of G harmonic minor and G harmonic major,', 'in drop 2, and Phrygian dominant over', 'the V7 of a minor key.'],
                 'Two scales, harmonised', 'G harmonic minor · G harmonic major',
                 ['Harmonic minor: a real V7 in a minor key. Harmonic major: a minor iv and a °7 in a major key.'],
                 'The seven chords of G harmonic minor, then G harmonic major, in drop 2.',
                 comment='Video 13a: harmonic minor and harmonic major harmony.',
                 drill=['1   G harmonic minor, the seven chords, naming each', '2   G harmonic major, the same', '3   D Phrygian dominant over D7, resolving to Gm'])
    out += prog_step('Harmonic minor', '| i:mMaj7 | ii:m7b5 | bIII:maj7#5 | iv:m7 | V:7 | bVI:maj7 | vii:dim7 | i:mMaj7 |', start=3,
                     notes=['V7 and vii°7 both lead home: the raised 7th (F♯) is the leading tone.'])
    out += prog_step('Harmonic major', '| I:maj7 | ii:m7b5 | iii:m7 | iv:mMaj7 | V:7 | bVI:maj7#5 | vii:dim7 | I:maj7 |', start=3,
                     notes=['The minor iv in a major key: the sound of “borrowed” harmony, from one scale.'])
    out += """  - section: Phrygian dominant
    now: D Phrygian dominant over D7♭9
    sub: the 5th mode of G harmonic minor · D E♭ F♯ G A B♭ C
    show: {kind: run, root: D, scale: phrygian-dominant, region: {caged: E}, path: up}
    drone: D3
    band: true
    notes: ['Over the V7 of a minor key, this is the scale: ♭9 and ♭13 pulling into the tonic’s 5th and 3rd.']
    play: run 0.5
    hold: 0.5
  - now: The minor ii – V – i
    sub: Am7♭5 – D7♭9 – Gm(maj7)
    show: null
    drone: null
    band: null
    play: strum 4
    click: false
    expand: {kind: prog, key: G, chart: '| ii:m7b5 | V:7b9 | i:mMaj7 | i:mMaj7 |', voicing: drop2, strings: [4, 3, 2, 1], startFret: 3, bars: 1, sub: '{roman}'}
"""
    out += got(['you can play both harmonised scales in drop 2 and name each chord,', 'run Phrygian dominant over any V7 of a minor key,', 'and hear the ♭9 resolve.'])
    return out


def dim_blues() -> str:
    out = header('13c-diminished-blues', 'Diminished on a blues', 'The °7 on the root hovers, then returns.',
                 ['A G blues in drop 2 where every dominant', 'steps to the °7 on its own root and back,', 'in four positions: four top lines.'],
                 'G7 → G°7 → G7', 'the °7 on the root: a suspension of the chord',
                 ['Three families of °7 (Marbin): on the root a suspension, on the 3rd a dominant, on the 7th the V of here.',
                  'Here, the root family: every chord hovers on its °7 and comes back.'],
                 'A blues where every dominant steps to the diminished seventh on its root and back. Four times, four top lines.',
                 bpm=100, comment="Video 13c: diminished on a blues (Marbin's diminished families).",
                 drill=['1   The blues with I7 → I°7, IV7 → IV°7, V7 → V°7 in every bar', '2   In four positions: listen to the top line', '3   Then the next key'])
    chart = '| I:7 I:dim7 | IV:7 IV:dim7 | I:7 I:dim7 | I:7 I:dim7 | IV:7 IV:dim7 | IV:7 IV:dim7 | I:7 I:dim7 | I:7 I:dim7 | V:7 V:dim7 | IV:7 IV:dim7 | I:7 I:dim7 | V:7 V:dim7 |'
    for i, sf in enumerate((3, 6, 9, 12)):
        out += prog_step(f'Top line {i + 1} · from fret {sf}', chart, start=sf, sub='{roman}',
                         notes=['Only one note moves a half step between each 7 and its °7: hear it in the top or inside.'] if i == 0 else None)
    out += got(['you can comp the blues with the °7 suspension on every chord,', 'in four positions without looking,', 'and say which family any °7 belongs to.'])
    return out


def pentatonics() -> str:
    out = header('14a-pentatonics', 'Pentatonics, blues scales, triad pairs', 'Five notes, many colours: name the scale before you play it.',
                 ['Major, minor, dominant and minor 6 pentatonics,', 'the minor and major blues scales,', 'and a triad pair, in the E-form region of G.'],
                 'Seven small scales on G', 'one region · lowest note to highest',
                 ['G major pentatonic = E minor pentatonic: the same notes, a different home.'],
                 'Pentatonics, blues scales and a triad pair, in one region of G.',
                 bpm=110, comment='Video 14a: pentatonics, blues scales and triad pairs.',
                 drill=['1   Each scale in the region, lowest to highest and back', '2   Name its formula as you play', '3   The other four regions', '4   Then the next key'])
    for sc, name, form in (('major-pentatonic', 'G major pentatonic', '1 2 3 5 6'), ('minor-pentatonic', 'G minor pentatonic', '1 ♭3 4 5 ♭7'),
                           ('blues', 'G blues', '1 ♭3 4 ♭5 5 ♭7: minor pentatonic + ♭5'), ('major-blues', 'G major blues', '1 2 ♭3 3 5 6: major pentatonic + ♭3'),
                           ('dominant-pentatonic', 'G dominant pentatonic', '1 2 3 5 ♭7: for G7'), ('minor6-pentatonic', 'G minor 6 pentatonic', '1 ♭3 4 5 6: for Gm6, Dorian')):
        out += f"""  - section: {q(name)}
    now: {q(name)}
    sub: {q(form)}
    show: {{kind: run, root: G, scale: {sc}, region: {{caged: E}}, path: up}}
    band: true
    notes: null
    play: run 0.5
"""
    out += """  - section: Triad pair
    now: F and G triads over G7sus
    sub: 'G B D + F A C = 1 3 5 + ♭7 9 11, a six-note scale'
    show: {kind: run, root: G, tones: ['1', '9', '3', '11', '5', 'b7'], region: {caged: E}, sequence: {kind: groups, size: 3}}
    band: true
    notes: ['Two triads a step apart cover six notes with no avoid note: alternate them, three notes each.']
    play: run 0.25
"""
    out += ending(AREAS_TABLE, ['Each day: two scales in all five regions.'],
                  ['you can play every pentatonic and blues scale in any region,', 'name its formula,', 'and run a triad pair without losing the form.'])
    return out


def upper_structures() -> str:
    shell = "{kind: line, root: D, pitches: [D3, F#3, C4], each: [6, 5, 4], labels: ['1', '3', 'b7'], faint: true}"
    out = header('14b-upper-structures', 'Upper structures', 'A triad on top, the shell below: name it from the bass.',
                 ['Five major triads over a D7 shell,', 'each labelled from D:', 'the colour tones they add.'],
                 'D7 shell + a triad', 'shell D F♯ C on 6-5-4 · triad on 3-2-1',
                 ['The faint dots are the shell (1 3 ♭7); the bright ones the triad, measured from D.'],
                 'Upper structures: a major triad on top of a D seven shell. Each one adds different colour tones.',
                 comment='Video 14b: upper-structure triads over a dominant shell.',
                 drill=['1   The shell, then the triad over it; name the colour tones', '2   Resolve each to Gmaj7 by step', '3   Then play the triads alone over a bass note'])
    for tri, pitches, labs, name, sub in (('E', ['E4', 'G#4', 'B4'], ['9', '#11', '13'], 'E over D7 = D13♯11', 'II: 9 ♯11 13, the Lydian dominant'),
                                          ('B', ['D#4', 'F#4', 'B4'], ['b9', '3', '13'], 'B over D7 = D13♭9', 'VI: ♭9 3 13, the half-whole diminished'),
                                          ('Ab', ['C4', 'Eb4', 'Ab4'], ['b7', 'b9', '#11'], 'A♭ over D7 = D7♭9♯11', '♭V: ♭7 ♭9 ♯11, the tritone sub on top'),
                                          ('Bb', ['D4', 'F4', 'Bb4'], ['1', '#9', 'b13'], 'B♭ over D7 = D7♯9♭13', '♭VI: 1 ♯9 ♭13, altered'),
                                          ('F', ['C4', 'F4', 'A4'], ['b7', '#9', '5'], 'F over D7 = D7♯9', '♭III: ♭7 ♯9 5, the blues dominant')):
        out += f"""  - section: Upper structures
    now: {q(name)}
    sub: {q(sub)}
    show: [{shell}, {{kind: line, root: D, pitches: {q(pitches)}, each: [3, 2, 1], labels: {q(labs)}}}]
    notes: null
    play: strum 2
    hold: 1.2
"""
    out += got(['you can put any of the five triads over a dominant shell,', 'name the colour tones each one adds,', 'and choose one for the sound you want.'])
    return out


def bebop() -> str:
    out = header('15-bebop', 'Bebop scales and line vocabulary', 'Chord tones on the beat.',
                 ['The bebop dominant, major and Dorian scales,', 'enclosures round a target note,', 'and 1-2-3-5 cells through a ii – V – I.'],
                 'Bebop scales', 'eight notes, so chord tones fall on the beats',
                 ['The added passing note (♮7 on a dominant, ♯5 on major) puts every chord tone on a downbeat.'],
                 'Bebop scales, enclosures, and digital patterns through a two five one.',
                 bpm=100, comment='Video 15: bebop scales, enclosures, digital patterns.',
                 drill=['1   Each bebop scale down from the top of the region, in 8ths', '2   Enclose each chord tone: above, below, target', '3   1-2-3-5 on each chord of the ii – V – I', '4   Then in the other regions and keys'])
    for root, sc, name, sub in (('D', 'bebop-dominant', 'D bebop dominant over D7', 'Mixolydian + ♮7: D E F♯ G A B C C♯'),
                                ('G', 'bebop-major', 'G bebop major over Gmaj7', 'major + ♯5: G A B C D D♯ E F♯'),
                                ('A', 'bebop-dorian', 'A bebop Dorian over Am7', 'Dorian + ♮3: A B C C♯ D E F♯ G')):
        out += f"""  - section: Bebop scales
    now: {q(name)}
    sub: {q(sub)}
    show: {{kind: run, root: {root}, scale: {sc}, region: {{caged: E}}, path: down}}
    band: true
    notes: null
    play: run 0.5
"""
    for target, pitches, labs, sub in (('B', ['C4', 'A#3', 'B3'], ['4', '#2', '3'], 'C above, A♯ below, then B: the 3rd of Gmaj7'),
                                       ('D', ['Eb4', 'C#4', 'D4'], ['b6', '#4', '5'], 'E♭ above, C♯ below, then D: the 5th'),
                                       ('F♯', ['G4', 'E#4', 'F#4'], ['1', '#6', '7'], 'G above, E♯ below, then F♯: the 7th')):
        out += f"""  - section: Enclosures
    now: {q('Enclose ' + target)}
    sub: {q(sub)}
    show: {{kind: line, root: G, pitches: {q(pitches)}, strings: [4, 3, 2, 1], labels: {q(labs)}}}
    band: null
    notes: ['Approach from above and below, then land on the beat.']
    play: run 0.5
    hold: 0.3
"""
    for root, pitches, chord in (('A', ['A3', 'B3', 'C4', 'E4'], 'Am7'), ('D', ['D4', 'E4', 'F#4', 'A4'], 'D7'), ('G', ['G4', 'A4', 'B4', 'D5'], 'Gmaj7')):
        out += f"""  - section: 1-2-3-5
    now: {q('1 2 3 5 on ' + chord)}
    sub: the digital pattern through ii – V – I
    show: {{kind: line, root: {root}, pitches: {q(pitches)}, strings: [4, 3, 2, 1], labels: ['1', '2', '3', '5']}}
    notes: null
    play: run 0.5
    hold: 0.3
"""
    out += got(['you can run each bebop scale with chord tones on the beats,', 'enclose any chord tone,', 'and string 1-2-3-5 cells through a ii – V – I.'])
    return out



def tunes_as_numbers() -> str:
    out = header('11-0-tunes-as-numbers', 'Tunes as numbers', 'Say the number, then play the chord.',
                 ['The diatonic cycle 2 5 1 4 7 3 6 (Marbin):', 'the skeleton of hundreds of standards,', 'voice-led in each of the five areas.'],
                 '2 5 1 4 7 3 6', 'Am7 D7 Gmaj7 Cmaj7 F♯m7♭5 Bm7 Em7: every root a 4th up',
                 ['Autumn Leaves, Fly Me to the Moon, All the Things You Are, I Will Survive: this cycle, or most of it.',
                  'Learn tunes as numbers and you can play them in any key.'],
                 'Two five one four seven three six. The diatonic cycle of fourths, in each of the five areas.',
                 bpm=90, comment="Video 11.0: tunes as numbers, after Marbin's 2 5 1 4 7 3 6.",
                 drill=['1   Say each number as you play its chord', '2   The cycle in one area; then all five', '3   Then name a tune you know as numbers, and play it here'])
    chart = '| ii:m7 | V:7 | I:maj7 | IV:maj7 | vii:m7b5 | iii:m7 | vi:m7 | ii:m7 |'
    for f in ['E', 'D', 'C', 'A', 'G']:
        out += (f"  - section: {f}-form area\n    play: strum 2\n    click: false\n    expand: {{kind: areaProg, key: G, chart: '{chart}', "
                f"strings: [4, 3, 2, 1], form: {f}, bars: 0.5, now: '{{chord}}', sub: '{{roman}} · {f}-form area'}}\n    hold: 0.3\n")
    out += got(['you can play 2 5 1 4 7 3 6 in all five areas, naming each number,', 'and turn any tune you know into numbers,', 'then play it in any key.'])
    return out


def diatonic_cycles() -> str:
    out = header('06-diatonic-cycles', 'Diatonic sevenths and voice-leading cycles', 'Each chord to the nearest voicing of the next.',
                 ['G major’s seven chords in drop 2,', 'voice-led round the cycles of 4ths, 2nds and 3rds,', 'from different starting inversions.'],
                 'G major, harmonised', 'Gmaj7 Am7 Bm7 Cmaj7 D7 Em7 F♯m7♭5',
                 ['Cycle 4 (roots up a 4th) is how most music moves; cycle 2 is the scale; cycle 3 links chords that share three notes.'],
                 'The seven chords of G major, voice-led through the cycles of fourths, seconds and thirds.',
                 bpm=96, comment='Video 6: diatonic sevenths and voice-leading cycles.',
                 drill=['1   Cycle 4 from one inversion: every chord to the nearest voicing', '2   The same from the other three starting inversions', '3   Then cycle 2 and cycle 3', '4   Then on the middle strings, and the next key'])
    c4 = '| I:maj7 | IV:maj7 | vii:m7b5 | iii:m7 | vi:m7 | ii:m7 | V:7 | I:maj7 |'
    for sf in (2, 5, 8, 12):
        out += prog_step(f'Cycle 4 · from fret {sf}', c4, start=sf, notes=['In cycle 4 two voices hold or move by step: the 7th falls to the 3rd every time.'] if sf == 2 else None)
    out += prog_step('Cycle 2', '| I:maj7 | ii:m7 | iii:m7 | IV:maj7 | V:7 | vi:m7 | vii:m7b5 | I:maj7 |', start=3,
                     notes=['Cycle 2: neighbouring chords share no notes in drop 2, so every voice moves.'])
    out += prog_step('Cycle 3', '| I:maj7 | iii:m7 | V:7 | vii:m7b5 | ii:m7 | IV:maj7 | vi:m7 | I:maj7 |', start=3,
                     notes=['Cycle 3: each chord shares three notes with the next: only one voice moves.'])
    out += got(['you can play cycle 4 from any inversion without stopping,', 'and cycles 2 and 3,', 'always to the nearest voicing.'])
    return out


EXPLAINERS = [
    ('11-1-explain-ii-v-i', 'Why ii – V – I works', '| ii:m7 | V:7 | I:maj7 | I:maj7 |',
     'Am7 – D7 – Gmaj7', [['Am7', 'ii · pre-dominant', 'shares 3 notes with IV: it leans away from home'],
                         ['D7', 'V · dominant', 'its tritone F♯–C wants to resolve inward'], ['Gmaj7', 'I · tonic', 'F♯ → G and C → B: home']],
     'The 7th of each chord falls a half step to the 3rd of the next: C → B, G → F♯.'),
    ('11-2-explain-i-vi-ii-v', 'Why I – vi – ii – V turns around', '| I:maj7 | vi:m7 | ii:m7 | V:7 |',
     'Gmaj7 – Em7 – Am7 – D7', [['Gmaj7', 'I · tonic', 'home'], ['Em7', 'vi · tonic substitute', 'shares 3 notes with I: still home, a step away'],
                                ['Am7', 'ii · pre-dominant', 'roots now fall in 5ths'], ['D7', 'V · dominant', 'pulls back to I: round again']],
     'Roots fall in 5ths from vi: E → A → D → G, the strongest motion in tonal music.'),
    ('11-3-explain-iii-vi-ii-v', 'Why iii – VI7 – ii – V works', '| iii:m7 | VI:7 | ii:m7 | V:7 |',
     'Bm7 – E7 – Am7 – D7', [['Bm7', 'iii · tonic substitute', 'shares 3 notes with I'], ['E7', 'VI7 · V of ii', 'a borrowed dominant: G♯ leads to A'],
                             ['Am7', 'ii · pre-dominant', 'arrives like a little tonic'], ['D7', 'V · dominant', 'home next']],
     'Making vi a dominant (E7) turns the turnaround into a chain of dominants falling in 5ths.'),
    ('11-4-explain-backdoor', 'Why the backdoor works', '| iv:m7 | bVII:7 | I:maj7 | I:maj7 |',
     'Cm7 – F7 – Gmaj7', [['Cm7', 'iv · borrowed from G minor', 'E♭ is the ♭6, a darker pre-dominant'],
                          ['F7', '♭VII7 · backdoor dominant', 'A and E♭ resolve to B and D'], ['Gmaj7', 'I · tonic', 'home from a whole step below']],
     'Borrowed from the parallel minor: the dominant arrives from ♭VII instead of V.'),
    ('11-5-explain-minor-ii-v-i', 'Why the minor ii – V – i works', '| ii:m7b5 | V:7b9 | i:m6 | i:m6 |',
     'Aø – D7♭9 – Gm6', [['Am7♭5', 'iiø · pre-dominant', 'E♭ (the ♭6 of G minor) in the chord'],
                         ['D7♭9', 'V7♭9 · dominant', 'harmonic minor gives the major 3rd F♯; E♭ is the ♭9'], ['Gm6', 'i · tonic', 'E♭ → D, F♯ → G']],
     'Every chord holds a note of G harmonic minor: the ♭6 pulls down, the leading tone up.'),
    ('11-6-explain-blues', 'Why the 12-bar blues works', '| I:7 | IV:7 | I:7 | I:7 | IV:7 | IV:7 | I:7 | I:7 | V:7 | IV:7 | I:7 | V:7 |',
     'G7 – C7 – D7, all dominant', [['G7', 'I7 · tonic, but dominant', 'the blue ♭7 is part of home'], ['C7', 'IV7', 'its 7th (B♭) is the blue ♭3 of G'],
                                     ['D7', 'V7', 'bar 9: the strongest pull'], ['C7 → G7', 'IV → I', 'bar 10: the plagal close, the “amen”']],
     'Three dominant chords, none resolving “properly”: the blues lives in the tension.'),
    ('11-7-explain-secondary-dominants', 'Secondary dominants: the chain', '| III:7 | VI:7 | II:7 | V:7 | I:maj7 | I:maj7 |',
     'B7 – E7 – A7 – D7 – Gmaj7', [['B7', 'V of vi (III7)', 'D♯ leads to E'], ['E7', 'V of ii (VI7)', 'G♯ leads to A'],
                                     ['A7', 'V of V (II7)', 'C♯ leads to D'], ['D7', 'V7', 'F♯ leads home to G']],
     'Each chord is the V7 of the next: the bridge of rhythm changes, Sweet Georgia Brown, ragtime.'),
    ('11-8-explain-tritone-sub', 'Why the tritone sub works', '| ii:m7 | bII:7 | I:maj7 | I:maj7 |',
     'Am7 – A♭7 – Gmaj7', [['Am7', 'ii · pre-dominant', 'leans away from home'], ['A♭7', '♭II7 · stands in for D7', 'shares D7’s tritone (C and F♯ = G♭); its root is a tritone from D'],
                            ['Gmaj7', 'I · tonic', 'the bass now falls by half step: A → A♭ → G']],
     'D7 and A♭7 share their 3rd and 7th (F♯/G♭ and C): swap one for the other and the bass walks down chromatically.'),
]


def explainer(id_, title, chart, names, rows, note) -> str:
    out = header(id_, title, 'Function first: what does each chord want to do?',
                 [names + ':', 'what each chord does,', 'and the guide tones that lead it.'],
                 names, 'in G · drop 2, then the guide tones',
                 [note], f'{title.replace("Why ", "Why ")}.', bpm=84, comment=f'Explainer: {title}.',
                 drill=['1   Hear the progression and say each Roman numeral', '2   Play the guide tones: the 3rd and 7th of each chord', '3   Name each chord’s job from the table, then play it in another key'])
    out += f"""  - section: The progression
    play: strum 4
    click: false
    expand: {{kind: prog, key: G, chart: {q(chart)}, voicing: drop2, strings: [4, 3, 2, 1], startFret: 5, bars: 1, sub: '{{roman}}'}}
  - section: Guide tones
    notes: ['The 3rd and 7th of each chord: the two notes that say what the chord is, moving by step.']
    play: strum 4
    click: false
    expand: {{kind: loop, chart: {q(chart)}, keys: [G], voicing: close, strings: [3, 2], guide: true, startFret: 5, bars: 1, now: '{{chord}}', sub: '{{roman}}'}}
  - section: What each chord does
    now: null
    sub: null
    show: null
    notes: null
    table:
      title: {q(names)}
      head: [Chord, Function, Why]
      widths: [0.18, 0.32, 0.5]
      rows: {q(rows)}
    hold: 9
  - section: null
    table: null
    card:
      title: You've got it when
      lines: ['you can name each chord’s job as it sounds,', 'play the guide tones without the full chords,', 'and find the progression in another key.']
    hold: 5
"""
    return out



def subs_pairs(id_, title, rule, lines, intro_now, intro_sub, notes, say, drill, pairs, got_lines, comment) -> str:
    out = header(id_, title, rule, lines, intro_now, intro_sub, notes, say, bpm=96, comment=comment, drill=drill)
    for name, plain, sub, why in pairs:
        out += prog_step(f'{name} · plain', plain, start=5, bars=1, notes=None, sub='{roman}')
        out += prog_step(f'{name} · substituted', sub, start=5, bars=1, notes=[why], sub='{roman}')
    out += got(got_lines)
    return out


def subs_ii_v_i() -> str:
    plain = '| ii:m7 | V:7 | I:maj7 | I:maj7 |'
    return subs_pairs('04c-subs-ii-v-i', 'Substitutions on a ii – V – I', 'Plain first, then the substitute: hear what changes.',
                      ['Am7 – D7 – Gmaj7 in drop 2, then each substitute', 'swapped in: plain, then substituted,', 'so you hear exactly what it adds.'],
                      'Am7 – D7 – Gmaj7', 'each pair: plain, then substituted',
                      ['A substitute keeps the job (the function) and changes the colour or the bass line.'],
                      'Substitutions on a two five one. Each one plain, then substituted.',
                      ['1   The plain ii – V – I, voice-led', '2   The same with the substitute, from the same position', '3   Then mix: plain some times, substituted others'],
                      [('Tritone sub', plain, '| ii:m7 | bII:7 | I:maj7 | I:maj7 |', 'A♭7 for D7: the same tritone, and the bass falls by half steps A → A♭ → G.'),
                       ('Related ii', plain, '| ii:m7 bvi:m7 | bII:7 | I:maj7 | I:maj7 |', 'E♭m7 – A♭7: the ii – V of the tritone sub, a half step above home.'),
                       ('Altered dominant', plain, '| ii:m7 | V:7b9 | I:maj7 | I:maj7 |', 'D7♭9: the ♭9 (E♭) falls to D, the 5th of G.'),
                       ('Backdoor', plain, '| iv:m7 | bVII:7 | I:maj7 | I:maj7 |', 'Cm7 – F7: home from a whole step below, borrowed from G minor.')],
                      ['you can play each substitute from the same position as the plain chord,', 'say what it changes (colour, bass line or both),', 'and choose when to use it.'],
                      'Video 4c: substitutions on a ii–V–I, plain then substituted.')


def subs_turnarounds() -> str:
    plain = '| I:maj7 | vi:m7 | ii:m7 | V:7 |'
    return subs_pairs('04d-subs-turnarounds', 'Substitutions in turnarounds', 'Plain first, then the substitute: hear what changes.',
                      ['I – vi – ii – V in drop 2, then each substitute', 'swapped in: plain, then substituted.'],
                      'Gmaj7 – Em7 – Am7 – D7', 'each pair: plain, then substituted',
                      ['Every turnaround is I – (something) – ii – V: the substitutes change the something and the dominants.'],
                      'Substitutions in the turnaround. Each one plain, then substituted.',
                      ['1   The plain turnaround, voice-led', '2   The same with the substitute', '3   Then mix them as you comp'],
                      [('Secondary dominant', plain, '| I:maj7 | VI:7 | ii:m7 | V:7 |', 'E7 for Em7: the V of Am7, its G♯ leading up to A.'),
                       ('♯i°7 passing', plain, '| I:maj7 | #i:dim7 | ii:m7 | V:7 |', 'G♯°7 between Gmaj7 and Am7: the bass climbs G → G♯ → A (it is E7♭9 without its root).'),
                       ('iii for I', plain, '| iii:m7 | VI:7 | ii:m7 | V:7 |', 'Bm7 for Gmaj7: three notes in common, a step further from home.'),
                       ('Tritone subs', plain, '| I:maj7 | bIII:7 | ii:m7 | bII:7 |', 'B♭7 for E7 and A♭7 for D7: the bass walks G → B♭ → A → A♭ → G.')],
                      ['you can swap any of the four into a turnaround from the same position,', 'hear the new bass line,', 'and choose one on the spot.'],
                      'Video 4d: substitutions in turnarounds, plain then substituted.')


def rhythm_vocab() -> str:
    out = header('17-rhythmic-vocabulary', 'Rhythmic vocabulary', 'Count out loud; the hand never stops.',
                 ['Subdivisions from quarters to 16ths,', 'groups of three across four, displacement,', 'and 3 against 4, on the grid.'],
                 'One chord, many rhythms', 'G major · the grid shows every slot',
                 ['The hand keeps moving down and up; only the strings it hits change.'],
                 'Rhythmic vocabulary. Subdivisions, groups of three, displacement, and three against four.',
                 bpm=80, comment='Video 17: rhythmic vocabulary on the groove grid.',
                 drill=['1   Each subdivision, counting out loud', '2   Accents every 3 16ths across the bar', '3   One figure, then the same figure an 8th later', '4   3 against 4: three accents over four beats'])
    grip = "{kind: grip, root: G, quality: maj, frets: [[6, 3], [5, 2], [4, 0], [3, 0], [2, 0], [1, 3]]}"
    items = [('Subdivisions', 'Quarters', '1 2 3 4', "{groove: 'DDDD', grid: 1, repeat: 2}"),
             (None, 'Eighths', '1 & 2 & 3 & 4 &', "{groove: 'DUDUDUDU', grid: 2, repeat: 2}"),
             (None, 'Triplets', '1 trip let 2 trip let …', "{groove: 'DUD UDU DUD UDU', grid: 3, repeat: 2}"),
             (None, '16ths', '1 e & a 2 e & a …', "{groove: 'DUDU DUDU DUDU DUDU', grid: 4, repeat: 2}"),
             ('Groups of 3', 'Accents every 3 16ths', '3 + 3 + 3 + 3 + 3 + 1 … across two bars',
              "{groove: 'Dudu Dudu Dudu Dudu Dudu Dudu Dudu Dudu', grid: 4, accents: [0, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30]}"),
             ('Displacement', 'The figure', 'on 1, the & of 2, and 4', "{groove: 'D-x-xUx-D-x-x-x-', grid: 4, accents: [0, 6, 8], repeat: 2}"),
             (None, 'The same figure, an 8th later', 'now on the & of 1, 3, and the & of 4', "{groove: 'x-D-x-xUx-D-x-x-', grid: 4, accents: [2, 8, 10], repeat: 2}"),
             ('3 against 4', 'Three accents over four beats', 'accent every 4th triplet', "{groove: 'Dud udu Dud udu Dud udu', grid: 3, accents: [0, 4, 8], repeat: 2}")]
    for sec, now, sub, play in items:
        out += (f"  - {'section: ' + q(sec) + chr(10) + '    ' if sec else ''}now: {q(now)}\n    sub: {q(sub)}\n    show: {grip}\n"
                f"    notes: null\n    play: {play}\n    hold: 0.3\n")
    out += got(['you can switch between subdivisions without stopping,', 'keep groups of 3 going across the bar line,', 'and displace any figure by an 8th.'])
    return out


C_TRAVIS = "{kind: grip, root: C, quality: maj, frets: [[6, 3], [5, 3], [4, 2], [3, 0], [2, 1], [1, 0]]}"
AM_GRIP = "{kind: grip, root: A, quality: min, frets: [[5, 0], [4, 2], [3, 2], [2, 1], [1, 0]]}"
G_GRIP = "{kind: grip, root: G, quality: maj, frets: [[6, 3], [5, 2], [4, 0], [3, 0], [2, 0], [1, 3]]}"
EM_GRIP = "{kind: grip, root: E, quality: min, frets: [[6, 0], [5, 2], [4, 2], [3, 0], [2, 0], [1, 0]]}"
D_GRIP = "{kind: grip, root: D, quality: maj, frets: [[4, 0], [3, 2], [2, 3], [1, 2]]}"
C_GRIP = "{kind: grip, root: C, quality: maj, frets: [[5, 3], [4, 2], [3, 0], [2, 1], [1, 0]]}"


def pattern_steps(items, grip, grid=2, repeat=2, first_section=None) -> str:
    out = ''
    for sec, now, sub, groove, extra in items:
        out += f"  - {'section: ' + q(sec) + chr(10) + '    ' if sec else ''}now: {q(now)}\n    sub: {q(sub)}\n    show: {extra.get('grip', grip)}\n"
        out += f"    notes: {q(extra['note']) if extra.get('note') else 'null'}\n"
        acc = f", accents: {extra['accents']}" if extra.get('accents') else ''
        sw = f", swing: {extra['swing']}" if extra.get('swing') else ''
        out += f"    play: {{groove: {q(groove)}, grid: {extra.get('grid', grid)}, repeat: {extra.get('repeat', repeat)}{acc}{sw}}}\n    hold: 0.2\n"
    return out


def fingerpicking_1() -> str:
    out = header('F1-fingerpicking-foundations', 'Fingerpicking foundations', 'p plays the bass; i m a play strings 3 2 1.',
                 ['The thumb alone, the pinch, p-i-m-a up and back,', 'block plucks and arpeggio patterns,', 'each on C, then on Am.'],
                 'p i m a', 'p (thumb): strings 6-4 · i: 3 · m: 2 · a: 1',
                 ['Each finger owns a string: the hand stays still and the fingers do the work.'],
                 'Fingerpicking foundations. The thumb plays the bass, and the three fingers own the top three strings.',
                 bpm=84, comment='Video F1: fingerpicking foundations.', key='C major',
                 drill=['1   Each pattern on C for two bars, even and slow', '2   The same pattern on Am', '3   Then the next pattern; tempo up only when it is even'])
    items = [('Thumb', 'The thumb alone', 'p on the root, every beat', '5 - 5 - 5 - 5 -', {}),
             (None, 'Thumb, alternating', 'root, then the string above, then back', '5 - 4 - 5 - 4 -', {}),
             ('Pinch', 'The pinch', 'p and a together', '51 - 4 - 51 - 4 -', {'note': 'Pinch: thumb and finger squeeze toward each other, at the same instant.'}),
             ('Arpeggios', 'p i m a', 'up the chord', '5 3 2 1 5 3 2 1', {}),
             (None, 'p i m a m i', 'up and back', '5 3 2 1 2 3 5 3', {}),
             (None, 'p i m i a i m i', 'the classical arpeggio', '5 3 2 3 1 3 2 3', {}),
             ('Block plucks', 'p + i m a', 'the fingers together, on the off-beats', '5 321 4 321 5 321 4 321', {}),
             (None, 'On Am', 'the same block pattern, root on string 5', '5 321 4 321 5 321 4 321', {'grip': AM_GRIP})]
    out += pattern_steps(items, C_TRAVIS)
    out += got(['you can play every pattern evenly on C and Am,', 'keep the thumb steady under the fingers,', 'and switch patterns without stopping.'])
    return out


def fingerpicking_2() -> str:
    out = header('F2-travis-catalogue', 'The Travis catalogue', 'The thumb never changes; the fingers fill the gaps.',
                 ['Travis picking on C: the alternating thumb first,', 'then each classic finger pattern over it,', 'from the pinch to syncopated melody.'],
                 'Travis picking on C', 'pinky on 6.3: the thumb plays 5 4 6 4 (Atkins)',
                 ['Merle Travis, Chet Atkins: a steady alternating bass, the fingers syncopating above it.'],
                 'Travis picking. The thumb alternates five four six four; then each finger pattern over it.',
                 bpm=90, comment='Video F2: the Travis catalogue.', key='C major',
                 drill=['1   The thumb alone until it runs by itself', '2   Each finger pattern over it, two bars', '3   Then on Am and G with the same thumb', '4   Tempo up only when the thumb never wavers'])
    items = [('Thumb', 'Root and 5th', '5 and 6 on beats 1 and 3', '5 - - - 6 - - -', {}),
             (None, 'Four to the bar', '5 4 6 4: the Atkins thumb', '5 - 4 - 6 - 4 -', {'note': 'Mute the bass slightly with the heel of the hand: it keeps the thumb from booming.'}),
             (None, 'Reverse', '6 4 5 4: start on the alternate bass', '6 - 4 - 5 - 4 -', {}),
             ('Fingers', 'Pinch on 1', 'p + a on beat 1', '51 - 4 - 6 - 4 -', {}),
             (None, 'Fingers on the &s', 'm and i between the thumbs', '5 2 4 3 6 2 4 3', {}),
             (None, 'The Travis pattern', 'pinch on 1, then i and m off the beat', '52 - 4 3 6 2 4 3', {'note': 'The classic: pinch, then a finger on each & between the thumbs.'}),
             (None, 'Syncopated pinch', 'the pinch on the & of 2', '5 - 4 1 6 - 4 2', {}),
             (None, 'Melody on top', 'a picks a tune on string 1 over the thumb', '51 - 4 1 6 2 41 -', {}),
             ('Other chords', 'On Am', 'thumb 5 4 6 4: 6 is the open E', '52 - 4 3 6 2 4 3', {'grip': AM_GRIP}),
             (None, 'On G', 'thumb 6 4 5 4: root on 6', '62 - 4 3 5 2 4 3', {'grip': G_GRIP})]
    out += pattern_steps(items, C_TRAVIS)
    out += got(['your thumb runs 5 4 6 4 without thinking,', 'you can put any finger pattern over it,', 'and change chord without the thumb missing a beat.'])
    return out


def fingerpicking_3() -> str:
    out = header('F3-travis-combinations', 'Travis combinations', 'Pick a thumb, pick a cell: combine.',
                 ['Four thumb patterns × finger cells,', 'combined from simple to novel:', 'a recipe for endless patterns.'],
                 'Thumb pattern + finger cell', 'combine any thumb with any cell',
                 ['A pattern is a thumb part and a finger part: learn them apart, then combine freely.'],
                 'Travis combinations. A thumb pattern plus a finger cell, from simple to new.',
                 bpm=90, comment='Video F3: Travis combinations, simple to novel.', key='C major',
                 drill=['1   Each combination for two bars', '2   Then invent: any thumb with any cell', '3   Over C – Am – F – G'])
    combos = [('Simple', '5 4 6 4 + pinch on 1', '51 - 4 - 6 - 4 -'),
              (None, '5 4 6 4 + m on every &', '5 2 4 2 6 2 4 2'),
              (None, '5 4 6 4 + i m alternating', '5 3 4 2 6 3 4 2'),
              ('Busier', 'Pinch, then i m a rolling', '51 3 4 2 6 1 4 3'),
              (None, 'Double-thumb (8ths in the bass)', '5 4 6 4 5 4 6 4'),
              (None, 'Double-thumb + pinch on 1 and 3', '51 4 6 4 51 4 6 4'),
              ('Syncopated', 'Pinches on the &s', '5 41 6 42 5 41 6 42'),
              (None, 'Bass and a melody line', '51 - 42 1 63 - 42 1'),
              ('Novel', 'Thumb in 3s across the bar', '5 2 4 6 3 5 4 2'),
              (None, 'Reverse thumb + cascading fingers', '6 1 4 2 5 3 4 2')]
    items = [(sec, now, 'p5 p4 p6 = the thumb · i m a = strings 3 2 1', g, {}) for sec, now, g in combos]
    out += pattern_steps(items, C_TRAVIS)
    out += got(['you can combine any thumb pattern with any finger cell,', 'invent a new one and keep it going for a verse,', 'and play it through C – Am – F – G.'])
    return out


def strumming_1() -> str:
    out = header('S1-strumming-foundations', 'Strumming: foundations and syncopation', 'The hand never stops: down on the beat, up on the &.',
                 ['Twelve strumming patterns, one after another,', 'from quarters to the push and the reggae skank:', 'each one taught in two bars.'],
                 'Twelve patterns', '↓ down · ↑ up · × muted · – the hand moves, missing the strings',
                 ['The arm swings down and up all the time; a missing strum is a miss in the air, not a pause.'],
                 'Strumming foundations. Twelve patterns, each in two bars.',
                 bpm=90, comment='Video S1: strumming foundations and syncopation.',
                 drill=['1   Each pattern on G for two bars', '2   Then over G – C – D – Em, changing on beat 1', '3   Next pattern'])
    items = [('Even', 'Quarters', 'every beat, down', 'D-D-D-D-', {}),
             (None, 'Eighths', 'down on the beat, up on the &', 'DUDUDUDU', {}),
             ('Pop', 'The pop strum', 'D D U U D U', 'D-DU-UDU', {'note': 'The most-used pattern in pop and folk: the miss on beat 3 is the hook.'}),
             (None, 'The backbeat', 'accents on 2 and 4', 'DUDUDUDU', {'accents': [2, 6]}),
             ('Feels', '6/8', 'two groups of three', 'DUDDUD', {'grid': 3, 'accents': [0, 3], 'repeat': 4}),
             (None, 'Shuffle', 'swung 8ths: long-short', 'DUDUDUDU', {'swing': 0.67}),
             (None, 'Charleston', 'beat 1, and the & of 2', 'D--U----', {'accents': [0, 3]}),
             ('Syncopation', 'The push', 'the next chord arrives on the & of 4', 'D-DU-UDU', {'accents': [7]}),
             (None, 'Reggae skank', 'only the &s, short', '-u-u-u-u', {'accents': [1, 3, 5, 7]}),
             (None, 'Calypso', 'D – D U – U D U, accent on the &s', 'D-DU-UDU', {'accents': [3, 5]}),
             ('Bass and strum', 'Boom-chicka', 'bass note, strum, other bass, strum', 'T-D-t-D-', {}),
             (None, 'Over G – C – D – Em', 'the pop strum, a chord a bar', 'D-DU-UDU', {'repeat': 1})]
    out += pattern_steps(items, G_GRIP)
    for g in (C_GRIP, D_GRIP, EM_GRIP):
        out += f"  - show: {g}\n    play: {{groove: 'D-DU-UDU', grid: 2}}\n"
    out += got(['you can play all twelve patterns from memory,', 'keep the hand moving through every miss,', 'and change chords without breaking the strum.'])
    return out


def strumming_2() -> str:
    out = header('S2-strumming-advanced', 'Strumming: 16ths and advanced', 'Sixteen slots a bar; the hand plays all of them.',
                 ['16th-note strumming from folk to funk,', 'disco, samba, rumba with the golpe,', 'la pompe and the tresillo.'],
                 '16ths', 'the hand moves in 16ths: down on 1 e & a, up on e and a',
                 ['At 16ths, down strokes fall on the beat and the &, up strokes on the e and the a.'],
                 'Strumming in sixteenths, from folk to funk and beyond.',
                 bpm=84, comment='Video S2: 16ths and advanced strumming.',
                 drill=['1   Each pattern for two bars, the hand in 16ths throughout', '2   Then over G – C – D – Em', '3   Next pattern'])
    items = [('16ths', '16th folk', 'the pop strum in 16ths: busy and bright', 'D-DU-UDU D-DU-UDU', {'grid': 4}),
             (None, 'Funk scratch', 'all muted 16ths, accents on 2 and 4', 'dudu dudu dudu dudu', {'grid': 4, 'accents': [4, 12]}),
             (None, 'The funk groove', 'chord stabs inside the scratch', 'Dudu dUdu Dudu dUdU', {'grid': 4, 'accents': [0, 5, 8, 13]}),
             (None, 'Disco 16ths', 'open on the & of every beat', 'duDu duDu duDu duDu', {'grid': 4, 'accents': [2, 6, 10, 14]}),
             ('Latin', 'Samba', 'accents off the beat, the surdo on 2', 'DuDU dUdU DuDU dUdU', {'grid': 4, 'accents': [0, 3, 6, 9, 12, 15]}),
             (None, 'Tresillo', '3 + 3 + 2 eighths', 'D--D--D-', {'accents': [0, 3, 6]}),
             (None, 'Rumba with golpe', 'x = the golpe, a slap on the strings', 'D-x-DUx- D-x-DUx-', {'grid': 4, 'accents': [0, 2, 6]}),
             ('Gypsy jazz', 'La pompe', 'bass-ish on 1 and 3, short chop on 2 and 4', 'D-u-D-u-', {'accents': [2, 6]})]
    out += pattern_steps(items, G_GRIP)
    out += got(['you can keep 16ths moving in the arm for a whole song,', 'place stabs, scratches and accents anywhere in them,', 'and play each groove over G – C – D – Em.'])
    return out


AM7_GRIP = "{kind: grip, root: A, quality: m7, frets: [[5, 0], [4, 2], [3, 0], [2, 1], [1, 0]]}"
G6_GRIP = "{kind: grip, root: G, quality: '6', frets: [[6, 3], [5, 2], [4, 0], [3, 0], [2, 0], [1, 0]]}"
G7_SHELL = "{kind: grip, root: G, quality: '7', frets: [[6, 3], [4, 3], [3, 4]]}"
C7_SHELL = "{kind: grip, root: C, quality: '7', frets: [[5, 3], [4, 2], [3, 3]]}"
D7_SHELL = "{kind: grip, root: D, quality: '7', frets: [[5, 5], [4, 4], [3, 5]]}"
AM6_GRIP = "{kind: grip, root: A, quality: m6, frets: [[5, 0], [4, 2], [3, 2], [2, 1], [1, 2]]}"
DM6_GRIP = "{kind: grip, root: D, quality: m6, frets: [[4, 0], [3, 2], [2, 0], [1, 1]]}"
E7_GRIP = "{kind: grip, root: E, quality: '7', frets: [[6, 0], [5, 2], [4, 0], [3, 1], [2, 0], [1, 0]]}"


def genre(id_, title, rule, lines, now, sub, notes, say, drill, items, grip, got_lines, bpm=90, key='Key of G', grid=2) -> str:
    out = header(id_, title, rule, lines, now, sub, notes, say, bpm=bpm, comment=f'Genre intro: {title}.', drill=drill, key=key)
    out += pattern_steps(items, grip, grid=grid)
    out += got(got_lines)
    return out


def samba() -> str:
    items = [('The surdo', 'The thumb alone', 'the bass drum: soft on 1, strong on 2', 'T - - - T - - - T - - - T - - -', {'grid': 4, 'accents': [4, 12]}),
             ('The tamborim', 'The fingers alone', '16ths, accents off the beat', '- F - F F - F - - F - F F - F -', {'grid': 4, 'accents': [1, 4, 6, 9, 12, 14]}),
             ('Together', 'Thumb and fingers', 'the samba groove', 'T F - F TF - F - T F - F TF - F -', {'grid': 4, 'accents': [4, 12]}),
             ('The vamp', 'On G', 'the i – ♭VII vamp: Am7 to G', 'T F - F TF - F - T F - F TF - F -', {'grid': 4, 'accents': [4, 12], 'grip': G_GRIP, 'repeat': 1}),
             (None, 'Pushed', 'the last 16th plays the next chord early', 'T F - F TF - F - T F - F TF - F N', {'grid': 4, 'accents': [4, 12, 15], 'repeat': 1})]
    return genre('G2-samba', 'Samba', 'The thumb is the surdo: the weight is on 2.',
                 ['The samba right hand: a surdo thumb, tamborim fingers,', 'and the i – ♭VII vamp of the Afro-sambas,', 'played straight, then with the push.'],
                 'Samba on Am7', 'thumb = surdo · fingers = tamborim',
                 ['Samba is in 2: feel two big beats a bar, the second one heavier.'],
                 'Samba. The thumb plays the surdo, the fingers the tamborim.',
                 ['1   The thumb alone, the weight on 2', '2   The fingers alone, then together', '3   The Am7 – G vamp: plain, then pushed into each change'],
                 items, AM7_GRIP, ['you can hold the surdo thumb under the 16th fingers,', 'play the vamp plain and pushed,', 'and feel the bar in two.'], bpm=84, key='A minor', grid=4)


def swing_comping() -> str:
    items = [('Four to the bar', 'Freddie Green', 'short, even quarters on the shell', 'D - D - D - D -', {'swing': 0.67}),
             ('The Charleston', 'The Charleston', 'beat 1 and the & of 2', 'D - - U - - - -', {'swing': 0.67, 'accents': [0, 3]}),
             (None, 'On C7', 'the same, on the IV chord', 'D - - U - - - -', {'swing': 0.67, 'accents': [0, 3], 'grip': C7_SHELL}),
             ('Anticipation', 'The push into the next chord', 'the & of 4 plays the next chord early', 'D - - U - - - N', {'swing': 0.67, 'accents': [0, 3, 7], 'repeat': 1}),
             (None, 'Onto C7', 'and back', 'D - - U - - - N', {'swing': 0.67, 'accents': [0, 3, 7], 'grip': C7_SHELL, 'repeat': 1})]
    return genre('G3-swing-comping', 'Swing comping', 'Short chords; the swing is in the gaps.',
                 ['Comping on three-note shells:', 'four to the bar, the Charleston,', 'then anticipating the changes.'],
                 'Shells: root, 3rd and 7th', 'G7 shell on 6-4-3 · C7 shell on 5-4-3',
                 ['Shells leave out the 5th: the bass and soloist have the space.'],
                 'Swing comping on shells. Four to the bar, the Charleston, then the anticipation.',
                 ['1   Four to the bar, short and even', '2   The Charleston on G7 and C7', '3   Then push each change on the & of 4'],
                 items, G7_SHELL, ['you can comp four to the bar and the Charleston,', 'swing the 8ths without rushing,', 'and anticipate a change when you choose.'], bpm=120)


def jazz_blues() -> str:
    out = header('G4-jazz-blues', 'Jazz blues', 'Same 12 bars; the turnarounds make it jazz.',
                 ['The 12-bar blues in drop 2, plain,', 'then with the jazz changes:', 'the ii – Vs, the ♯iv°7 and the turnaround.'],
                 'G blues', 'plain, then the jazz changes',
                 ['The jazz blues keeps the 12-bar shape but adds a ii – V into every arrival.'],
                 'The jazz blues. Plain, then with the jazz changes.', bpm=110, comment='Genre intro: jazz blues.',
                 drill=['1   The plain blues in drop 2', '2   The jazz blues from the same position', '3   Then mix: plain bars, jazz bars'])
    plain = '| I:7 I:7 | IV:7 IV:7 | I:7 I:7 | I:7 I:7 | IV:7 IV:7 | IV:7 IV:7 | I:7 I:7 | I:7 I:7 | V:7 V:7 | IV:7 IV:7 | I:7 I:7 | V:7 V:7 |'
    jazz = '| I:7 I:7 | IV:7 IV:7 | I:7 I:7 | v:m7 I:7 | IV:7 IV:7 | #iv:dim7 #iv:dim7 | I:7 I:7 | VI:7 VI:7 | ii:m7 ii:m7 | V:7 V:7 | I:7 VI:7 | ii:m7 V:7 |'
    out += prog_step('Plain', plain, start=5, notes=['Three dominant chords: I7, IV7, V7.'])
    out += prog_step('Jazz changes', jazz, start=5, notes=['Bar 4: Dm7 – G7 (ii – V of IV). Bar 6: C♯°7 passing. Bars 8–10: E7 – Am7 – D7. Bars 11–12: the turnaround.'])
    out += got(['you can play the plain and the jazz blues in drop 2,', 'say what each added chord does,', 'and switch between them at any bar.'])
    return out


def gypsy() -> str:
    items = [('La pompe', 'The pompe', 'a low down-strum on 1 and 3, a short choked chop on 2 and 4', 'D - u - D - u -', {'accents': [2, 6]}),
             ('Minor swing', 'Am6', 'the gypsy minor: m6, not m7', 'D - u - D - u -', {'accents': [2, 6]}),
             (None, 'Dm6', 'iv6', 'D - u - D - u -', {'accents': [2, 6], 'grip': DM6_GRIP}),
             (None, 'E7', 'V7, back to Am6', 'D - u - D - u -', {'accents': [2, 6], 'grip': E7_GRIP}),
             (None, 'G6/9 colour', 'the 6/9 major: G B D E A', 'D - u - D - u -', {'accents': [2, 6], 'grip': "{kind: grip, root: G, quality: '6', frets: [[6, 3], [4, 2], [3, 2], [2, 3], [1, 3]]}"})]
    return genre('G5-gypsy-jazz', 'Gypsy jazz', 'Down on 1 and 3, a choked chop on 2 and 4.',
                 ['La pompe, Django’s rhythm guitar,', 'on the m6, 6/9 and 7 grips', 'of a minor swing progression.'],
                 'La pompe', 'Am6 – Dm6 – E7 – Am6',
                 ['The chop on 2 and 4 is choked by lifting the left hand right after the strum.'],
                 'Gypsy jazz. La pompe on the minor swing grips.',
                 ['1   The pompe on one chord until it swings', '2   Am6 – Dm6 – E7 – Am6', '3   Then the 6/9 major colour'],
                 items, AM6_GRIP, ['you can play la pompe at 180 without tiring,', 'change between m6, 6/9 and 7 grips in time,', 'and keep the chop short.'], bpm=150, key='A minor')


def soul() -> str:
    plain = ('6.3+5.2+4.0+3.0+2.0+1.3:1 r:1 6.3+5.2+4.0+3.0+2.0+1.3:1 r:1 | 5.3+4.2+3.0+2.1+1.0:1 r:1 5.3+4.2+3.0+2.1+1.0:1 r:1 |')
    fills = ('6.3+5.2+4.0+3.0+2.0+1.3:1 r:.5 3.4+1.3:.5 3.2+1.2:.5 3.0+1.0:.5 r:1 | 5.3+4.2+3.0+2.1+1.0:1 r:.5 3.5+1.5:.5 3.4+1.3:.5 3.2+1.2:.5 3.0+1.0:1 |')
    out = header('G7-soul', 'Soul and R&B', 'The chord on the beat; the fill in the gap.',
                 ['Soul guitar: I – IV with double-stop fills', 'in 6ths between the chords,', 'played without fills, then with them.'],
                 'G – C with 6ths', 'the fills are 6ths on strings 3 and 1',
                 ['Curtis Mayfield, Steve Cropper, Jimi: the fill answers the singer between chords.'],
                 'Soul guitar. The chords, then 6th fills in the gaps.', bpm=84, comment='Genre intro: soul and R&B.',
                 drill=['1   The chords alone, leaving the gaps', '2   The fills alone: 6ths on strings 3 and 1', '3   Together: chord on the beat, fill in the gap'])
    out += f"""  - section: Without fills
    now: G – C, the gaps empty
    sub: chord on 1 and 3
    tab: {{root: G, roots: [G, C, G, C], harmony: ['G:I', 'C:IV', 'G:I', 'C:IV'], voices: [{q(plain + ' ' + plain)}]}}
  - section: With fills
    now: G – C, with 6ths
    sub: 'the fill walks down G major in 6ths: B/G, A/F♯, G/E'
    notes: ['6ths on strings 3 and 1: the sweet, vocal sound of soul guitar (see video 9d).']
    tab: {{root: G, roots: [G, C, G, C], harmony: ['G:I', 'C:IV', 'G:I', 'C:IV'], voices: [{q(fills + ' ' + fills)}]}}
"""
    out += got(['you can play the chord on the beat and leave the gap,', 'fill it with 6ths in time,', 'and choose when to fill and when to leave space.'])
    return out


def shuffle() -> str:
    A = '5.0+4.2:.5 5.0+4.2:.5 5.0+4.4:.5 5.0+4.2:.5 5.0+4.2:.5 5.0+4.2:.5 5.0+4.4:.5 5.0+4.2:.5 |'
    D = '4.0+3.2:.5 4.0+3.2:.5 4.0+3.4:.5 4.0+3.2:.5 4.0+3.2:.5 4.0+3.2:.5 4.0+3.4:.5 4.0+3.2:.5 |'
    E = '6.0+5.2:.5 6.0+5.2:.5 6.0+5.4:.5 6.0+5.2:.5 6.0+5.2:.5 6.0+5.2:.5 6.0+5.4:.5 6.0+5.2:.5 |'
    form = [A, A, A, A, D, D, A, A, E, D, A, E]
    harm = ['A7:I7', 'A7:I7', 'A7:I7', 'A7:I7', 'D7:IV7', 'D7:IV7', 'A7:I7', 'A7:I7', 'E7:V7', 'D7:IV7', 'A7:I7', 'E7:V7']
    out = header('G8-blues-shuffle', 'Blues shuffle', 'Long-short, long-short: the shuffle is in the right hand.',
                 ['The shuffle feel, the 5-6 boogie pattern,', 'and the 12-bar blues in A', 'on the open strings.'],
                 'The boogie in A', '5th to 6th on the string above the root, shuffled',
                 ['Shuffle: each beat splits long-short, like a triplet with the middle note left out.'],
                 'The blues shuffle. The boogie pattern, then the twelve bar blues.', bpm=96, comment='Genre intro: blues shuffle.', key='A major',
                 drill=['1   The boogie on A, shuffled, palm-muted', '2   Move it to D and E', '3   The 12-bar blues in A'])
    out += f"""  - section: The boogie
    now: On A
    sub: 'A + E, then A + F♯: the 5th to the 6th'
    tab: {{root: A, roots: [A, A], swing: 0.67, harmony: ['A7:I7', 'A7:I7'], voices: [{q(A + ' ' + A)}]}}
  - section: The 12-bar blues
    now: The form
    sub: 'I – IV – I – V – IV – I – V: 4 + 2 + 2 + 1 + 1 + 1 + 1 bars'
    notes: ['The quick change (IV in bar 2) is common: try it once the form is solid.']
    tab: {{root: A, roots: {q([h[0] for h in harm])}, swing: 0.67, harmony: {q(harm)}, voices: [{q(' '.join(form))}]}}
"""
    out += got(['you can shuffle the boogie on A, D and E,', 'play the 12-bar form without counting,', 'and keep the long-short feel steady.'])
    return out



def giuliani() -> str:
    C = "{kind: grip, root: C, quality: maj, frets: [[5, 3], [4, 2], [3, 0], [2, 1], [1, 0]]}"
    G7 = "{kind: grip, root: G, quality: '7', frets: [[6, 3], [5, 2], [4, 0], [3, 0], [2, 0], [1, 1]]}"
    out = header('C7-giuliani-arpeggios', 'Giuliani: 12 right-hand studies', 'Each finger owns its string: the hand stays still.',
                 ['Twelve of Giuliani’s 120 right-hand studies (Op. 1, 1812):', 'arpeggio patterns on C and G7, from simple to virtuosic.'],
                 'C – G7, one pattern at a time', 'p = bass (strings 5 and 6) · i m a = strings 3 2 1',
                 ['Giuliani wrote 120 patterns on two chords so the right hand could learn every combination.'],
                 'Giuliani’s right-hand studies: one pattern on C, then on G seven.',
                 bpm=84, comment="Video C7: a selection of Giuliani's 120 right-hand studies, Op. 1.", key='C major',
                 drill=['1   Each pattern on C, then G7, two bars', '2   Planted fingers: rest each finger on its string before it plays', '3   Then the next pattern; tempo up only when it is even'])
    pats = [('p i m a', '5 3 2 1 5 3 2 1', '6 3 2 1 6 3 2 1', 2), ('p a m i', '5 1 2 3 5 1 2 3', '6 1 2 3 6 1 2 3', 2),
            ('p i m i', '5 3 2 3 5 3 2 3', '6 3 2 3 6 3 2 3', 2), ('p i m a m i', '5 3 2 1 2 3', '6 3 2 1 2 3', 3),
            ('p m i a i m', '5 2 3 1 3 2', '6 2 3 1 3 2', 3), ('p + i m a (block)', '5 321 4 321', '6 321 4 321', 1),
            ('p, then i m a together', '5 - 321 -', '6 - 321 -', 1), ('p i a m', '5 3 1 2 5 3 1 2', '6 3 1 2 6 3 1 2', 2),
            ('p i m a m i, in triplets', '5 3 2 1 2 3 5 3 2 1 2 3', '6 3 2 1 2 3 6 3 2 1 2 3', 3),
            ('p a i m a i', '5 1 3 2 1 3', '6 1 3 2 1 3', 3), ('Repeated notes: p i i m m a a', '5 3 3 2 2 1 1 2', '6 3 3 2 2 1 1 2', 2),
            ('16ths: p i m a m i m a', '5 3 2 1 2 3 2 1 5 3 2 1 2 3 2 1', '6 3 2 1 2 3 2 1 6 3 2 1 2 3 2 1', 4)]
    for k, (name, c, g, grid) in enumerate(pats, 1):
        out += f"""  - section: {q(f'Study {k}')}
    now: {q(name)}
    sub: on C
    show: {C}
    notes: null
    play: {{groove: {q(c)}, grid: {grid}, repeat: 1}}
  - sub: on G7
    show: {G7}
    play: {{groove: {q(g)}, grid: {grid}, repeat: 1}}
"""
    out += got(['you can play all twelve evenly on C and G7,', 'keep the hand still and the fingers on their strings,', 'and move from one pattern to the next without stopping.'])
    return out


if __name__ == '__main__':
    extra = [(e[0], explainer(*e)) for e in EXPLAINERS] + [('11-0-tunes-as-numbers', tunes_as_numbers()), ('06-diatonic-cycles', diatonic_cycles()),
             ('04c-subs-ii-v-i', subs_ii_v_i()), ('04d-subs-turnarounds', subs_turnarounds()), ('17-rhythmic-vocabulary', rhythm_vocab()),
             ('F1-fingerpicking-foundations', fingerpicking_1()), ('F2-travis-catalogue', fingerpicking_2()), ('F3-travis-combinations', fingerpicking_3()),
             ('S1-strumming-foundations', strumming_1()), ('S2-strumming-advanced', strumming_2()),
             ('G2-samba', samba()), ('G3-swing-comping', swing_comping()), ('G4-jazz-blues', jazz_blues()), ('G5-gypsy-jazz', gypsy()),
             ('G7-soul', soul()), ('G8-blues-shuffle', shuffle()), ('C7-giuliani-arpeggios', giuliani())]
    for name, text in extra + [('02-close-triads', close_triads()), ('03b-drop2-more', drop2_more()), ('11t-turnarounds-areas', turnarounds()),
                       ('12m-melodic-minor-modes', melodic_minor()), ('13h-harmonic-minor-modes', harmonic_minor()),
                       ('13s-symmetric-scales', symmetric()), ('02b-spread-triads', spread_triads()),
                       ('03c-drop3-core', drop3_core()), ('03d-drop3-more', drop3_more()),
                       ('04a-morph-map', morph_map()), ('04b-extensions', extensions()),
                       ('05a-seventh-arpeggios', seventh_arps()), ('05b-extended-arpeggios', extended_arps()),
                       ('09b-scale-sequences', sequences()), ('12-melodic-minor-harmony', melodic_minor_harmony()),
                       ('13a-harmonic-harmony', harmonic_harmony()),
                       ('11t2-turnarounds-middle', turnarounds('11t2-turnarounds-middle', (5, 4, 3, 2), 'on the middle four strings')),
                       ('11t3-turnarounds-low', turnarounds('11t3-turnarounds-low', (6, 5, 4, 3), 'on the low four strings')), ('13c-diminished-blues', dim_blues()),
                       ('14a-pentatonics', pentatonics()), ('14b-upper-structures', upper_structures()), ('15-bebop', bebop())]:
        (HERE / 'videos' / f'{name}.yaml').write_text(text)
        print(name)
