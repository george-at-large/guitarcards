// Memory pack: units (explainers, rules, visual aids) and card generators.
// Every answer, hint and why line is produced by the engine, so every key gets identical treatment.
import * as E from './engine.js';
import * as SI from '../superimpose.js';

const { N, nm, up, down } = E;
const R12 = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
const RANK_PC = [0, 5, 2, 3, 4, 1, 6, 1, 4, 3, 2, 5]; // distance round the circle from C
const rankOf = (n) => RANK_PC[E.pc(n)];
const K = (s) => nm(N(s));
const list = (ns) => ns.map(nm).join(' ');
const ord = (d) => ({ 1: '1st', 2: '2nd', 3: '3rd' }[d] || `${d}th`);
const LONG = Object.fromEntries(E.IV.map(([k, , , l]) => [k, l]));
const INV = { m2: 'M7', M2: 'm7', m3: 'M6', M3: 'm6', P4: 'P5', TT: 'TT', P5: 'P4', m6: 'M3', M6: 'm3', m7: 'M2', M7: 'm2' };
const QNAME = { maj7: 'maj7', m7: 'm7', 7: '7', m7b5: 'm7♭5', dim7: '°7', mMaj7: 'mMaj7' };
const LETTER_RULE = {
  A: 'Each letter appears once, so the spelling must use the next letter even if that means E♯, B♯, C♭ or F♭.',
  B: 'Spell the major scale first, then alter: every mode uses each letter once.',
  C: 'Spell from the chord root: a dominant 7th is 1 3 5 ♭7 of its own root, so the letters stack in thirds.',
  D: 'Guide tones are the 3rd and 7th letters above the root: count letters first, then accidentals.',
};

function card(o) {
  return {
    accept: [], reverse_of: null, requires: [], tags: [], rank: 0, traps: [], input: 'keypad',
    ...o,
    hints: o.hints.map(String),
    letterMsg: o.letterMsg || LETTER_RULE[o.module],
  };
}
const letterHint = (ans) => `Starts with ${Array.isArray(ans) ? ans.slice(0, Math.max(1, Math.min(3, Math.ceil(ans.length / 2)))).join(' ') + (ans.length > 1 ? '…' : '') : ans}`;

// ---------- superimposition explainers (built from the shared table in src/superimpose.js) ----------
function SI_MD(kind) {
  const tri = kind === 'triads';
  const intro = tri
    ? `A triad played over a chord is a **superimposition**: three notes you already know as a shape, heard as **tensions** of the chord underneath. Name it by the chord degree it is built on, not by its letter, and it transposes to every key at once: over any dominant, the **II** major triad gives **9, ♯11, 13**.\n\nTo work one out: count up from the chord root to the triad root, then read each triad note as an interval from the chord root. D over C7: D is the 9, F♯ the ♯11, A the 13.`
    : `A pentatonic has no half steps, so it never clashes hard. Played from other roots it becomes a five-note colour over the chord: a step above a minor 7 gives Dorian (9 11 5 13 1); a minor 3rd above a dominant gives five altered notes (♯9 ♯11 ♭13 ♭7 ♭9).`;
  const SYM = { maj: 'maj7', dom: '7', min: 'm7', half: 'm7♭5', mmaj: 'm(maj7)', dim: '°7' };
  const rows = [];
  for (const k of SI.MENU_KEYS) for (const it of SI.menu(k).items) {
    if (tri !== (it.shape === 'maj' || it.shape === 'min')) continue;
    const st = SI.structure('C', k, it);
    rows.push(`| C${SYM[k]} | ${it.deg} ${SI.shapeName(it.shape)} (${st.name}) | ${st.tensions.join(' ')} | ${it.result} | ${it.scale} |`);
  }
  return `${intro}\n\n| Chord | Play | Adds | Sounds like | Scale |\n|---|---|---|---|---|\n${rows.join('\n')}\n\nOn the guitar: open **Deep chord study → Superimpose** to see each one on the neck, labelled as tensions over the chord.`;
}

// ---------- units ----------
export const UNITS = [
  { id: 'A1', module: 'A', name: 'Intervals', rule: 'Spell the root’s major scale; major and perfect intervals are its notes. One semitone smaller than major is minor; smaller than perfect is diminished; larger is augmented.', visual: { type: 'clock', pcs: [0, 4, 7] },
    md: `The major scale is the measuring stick. Measured up from the root, every note of a major scale is a **major or perfect** interval: M2, M3, P4, P5, M6, M7. One semitone smaller than major is **minor**; one smaller than perfect is **diminished**; one larger than either is **augmented**.\n\nSo to find any interval above a note, spell that note's major scale and adjust. A minor 6th above E♭ is the 6th of E♭ major (C) lowered a semitone: **C♭**. Not B, because a 6th must land on the sixth letter.\n\n| Interval | Semitones | Interval | Semitones |\n|---|---|---|---|\n| m2 | 1 | P5 | 7 |\n| M2 | 2 | m6 / ♯5 | 8 |\n| m3 / ♯2 | 3 | M6 | 9 |\n| M3 | 4 | m7 | 10 |\n| P4 | 5 | M7 | 11 |\n| Tritone (♯4 / ♭5) | 6 | Octave | 12 |\n\n**Hold these:** inversions add to 9 (M3 inverts to m6, P4 to P5), and major inverts to minor. Extensions are the 2nd, 4th and 6th plus an octave: 9 = 2, 11 = 4, 13 = 6.` },
  { id: 'A2', module: 'A', name: 'Circle of fifths & key signatures', rule: 'Clockwise: up a 5th, add a sharp (the new key’s 7th). Anticlockwise: up a 4th, add a flat (the new key’s 4th). Sharp keys: up a semitone from the last sharp. Flat keys: the second-to-last flat.', visual: { type: 'circle' },
    md: `Going **clockwise** moves up a 5th and adds one sharp. The new sharp is always the new key's **7th degree**, raised so it leads to the tonic. Going **anticlockwise** moves up a 4th and adds one flat, which is always the new key's **4th degree**.\n\nOrder of sharps: **F C G D A E B** (“Father Charles Goes Down And Ends Battle”). Order of flats: the same backwards.\n\nTwo shortcuts name a key from its signature:\n- **Sharp keys:** go up a semitone from the last sharp. Four sharps end on D♯, so the key is E.\n- **Flat keys:** the second-to-last flat names the key. Four flats are B♭ E♭ A♭ D♭, so the key is A♭. (F, with one flat, is the one to memorise.)` },
  { id: 'A3', module: 'A', name: 'Relative and parallel', rule: 'Relative minor: same signature, starts on the 6th (a minor 3rd below the major tonic). Parallel minor: same tonic.', visual: { type: 'circle', minor: true },
    md: `The **relative** minor shares the key signature and starts on the 6th degree, a minor 3rd below the major tonic (C major and A minor). The **parallel** minor shares the tonic (C major and C minor).\n\nModal interchange (Module C) borrows from **parallel** keys, so the distinction matters.` },
  { id: 'A4', module: 'A', name: 'Every note in every key', rule: 'Major keys in circle order, each one note different from the last; each letter once. Natural minor = relative major from its 6th. Harmonic minor = natural minor with the 7th raised. Melodic minor = major with a ♭3.', visual: { type: 'strip', f: '1 2 b3 4 5 b6 7' },
    md: `Learn major keys in circle order (C, G, D, A, E, B, F♯, then F, B♭, E♭, A♭, D♭, G♭), so each key adds one note change to the last. Each letter appears once, which is why F♯ major has **E♯**, not F.\n\nThe three minors are built from things you know:\n- **Natural minor:** the relative major started from its 6th. E minor is G major from E.\n- **Harmonic minor:** natural minor with the 7th raised. E F♯ G A B C **D♯**.\n- **Melodic minor (jazz form):** major with a ♭3. E F♯ **G** A B C♯ D♯.` },
  { id: 'A5', module: 'A', name: 'The degree triangle', rule: 'Major: maj7, m7, m7, maj7, 7, m7, m7♭5 — Ionian, Dorian, Phrygian, Lydian, Mixolydian, Aeolian, Locrian. Natural minor is the same cycle from the 6th: i m7, iiø7, ♭IIImaj7, iv m7, v m7, ♭VImaj7, ♭VII7.', visual: { type: 'strip', f: '1 2 3 4 5 6 7' },
    md: `Stack 7th chords on each note of a major scale and you always get the same pattern: **maj7, m7, m7, maj7, 7, m7, m7♭5**. Memorise it as a rhythm (“major, minor, minor, major, dominant, minor, half-diminished”). The mode on each degree is in the same order: **Ionian, Dorian, Phrygian, Lydian, Mixolydian, Aeolian, Locrian**.\n\nNatural minor is the same cycle started from the 6th, so it reads m7, m7♭5, maj7, m7, m7, maj7, 7 on **i, ii, ♭III, iv, v, ♭VI, ♭VII**.\n\nEach degree gives three answers at once: the note, the chord quality and the mode. E minor, ♭VII is **D, D7, Mixolydian**.` },
  { id: 'B1', module: 'B', name: 'Major modes: the brightness ladder', rule: 'Lydian ♯4 · Ionian · Mixolydian ♭7 · Dorian ♭3 · Aeolian ♭6 · Phrygian ♭2 · Locrian ♭5 — each darkens one more note. Parents: Dorian a whole step down, Phrygian a M3 down, Lydian a 4th down, Mixolydian a 5th down, Aeolian a m3 up, Locrian a semitone up.', visual: { type: 'strip', f: '1 2 3 #4 5 6 7' },
    md: `Every mode can be written as the major scale with some notes flattened (or, for Lydian, one note sharpened). Ordered from brightest to darkest, **each mode darkens exactly one more note than the last**. Learn the ladder and you can spell any mode on any root: spell the major scale, then apply the alterations.\n\n| # | Mode | Formula | Changed note | 7th chord | Colour |\n|---|---|---|---|---|---|\n| 1 | Lydian | 1 2 3 ♯4 5 6 7 | ♯4 | maj7 | ♯11 |\n| 2 | Ionian | 1 2 3 4 5 6 7 | — | maj7 | 9 |\n| 3 | Mixolydian | 1 2 3 4 5 6 ♭7 | ♭7 | 7 | 9, 13 |\n| 4 | Dorian | 1 2 ♭3 4 5 6 ♭7 | ♭3 | m7 | ♮13 |\n| 5 | Aeolian | 1 2 ♭3 4 5 ♭6 ♭7 | ♭6 | m7 | ♭13 |\n| 6 | Phrygian | 1 ♭2 ♭3 4 5 ♭6 ♭7 | ♭2 | m7 | ♭9 |\n| 7 | Locrian | 1 ♭2 ♭3 4 ♭5 ♭6 ♭7 | ♭5 | m7♭5 | ♭9 |\n\nThe second way in is the **parent scale**. Each mode is a major scale started on a different degree: Dorian's parent is a whole step down, Phrygian's a major 3rd down, Lydian's a 4th down, Mixolydian's a 5th down, Aeolian's a minor 3rd up and Locrian's a semitone up. E Phrygian is C major from E. Use the ladder for sound and the parent for spelling speed.\n\n**Worked example.** Spell A Mixolydian. Ladder: A major is A B C♯ D E F♯ G♯; flatten the 7th: A B C♯ D E F♯ G. Parent check: a 5th below A is D, and D major from A gives the same notes.` },
  { id: 'B2', module: 'B', name: 'Harmonic minor: one raised note', rule: 'Each harmonic-minor mode is a major mode on the same root with one note raised (Ultralocrian: Locrian with ♭4 and 𝄫7). Phrygian dominant = harmonic minor a 4th above.', visual: { type: 'strip', f: '1 2 b3 4 5 b6 7' },
    md: `A harmonic minor is A natural minor with the 7th raised: A B C D E F **G♯**. Its notes are C major with G raised to G♯. So every mode of harmonic minor is a C-major mode on the same root with that one G raised, and the name says which degree moved.\n\n| # | Mode (on A harmonic minor) | Twin + change | Formula | 7th chord | Use |\n|---|---|---|---|---|---|\n| 1 | A harmonic minor | Aeolian ♮7 | 1 2 ♭3 4 5 ♭6 7 | mMaj7 | Dark tonic minor |\n| 2 | B Locrian ♮6 | Locrian, raise the 6th | 1 ♭2 ♭3 4 ♭5 6 ♭7 | m7♭5 | iiø7 in minor |\n| 3 | C Ionian ♯5 | Ionian, raise the 5th | 1 2 3 4 ♯5 6 7 | maj7♯5 | Augmented colour |\n| 4 | D Dorian ♯4 | Dorian, raise the 4th | 1 2 ♭3 ♯4 5 6 ♭7 | m7 | Exotic iv |\n| 5 | E Phrygian dominant | Phrygian, raise the 3rd | 1 ♭2 3 4 5 ♭6 ♭7 | 7 | V7♭9 into minor |\n| 6 | F Lydian ♯2 | Lydian, raise the 2nd | 1 ♯2 3 ♯4 5 6 7 | maj7 | Exotic ♭VI |\n| 7 | G♯ Ultralocrian | Locrian, lower the 4th and 7th | 1 ♭2 ♭3 ♭4 ♭5 ♭6 𝄫7 | dim7 | vii°7 into i |\n\nThe signature sound is the **augmented 2nd** between ♭6 and 7 (F to G♯). Mode 5 matters most: harmonic minor exists in practice to give a minor key a dominant V7.\n\n**Worked example.** Spell B Phrygian dominant. B Phrygian is B C D E F♯ G A (parent G major, a major 3rd down). Raise the 3rd: B C **D♯** E F♯ G A.` },
  { id: 'B3', module: 'B', name: 'Melodic minor: one raised note', rule: 'Each melodic-minor mode is a major mode with one note changed. X7alt = melodic minor a semitone above X; X7♯11 = a 5th above; Xm7♭5 = a minor 3rd above.', visual: { type: 'strip', f: '1 2 b3 4 5 6 7' },
    md: `A melodic minor (jazz form) is A B C D E F♯ G♯: A major with a ♭3. Its notes are G major with G raised to G♯. So every mode is a G-major mode on the same root with that one G raised.\n\n| # | Mode (on A melodic minor) | Twin + change | Formula | 7th chord | Use |\n|---|---|---|---|---|---|\n| 1 | A melodic minor | Dorian ♮7 (or Ionian ♭3) | 1 2 ♭3 4 5 6 7 | mMaj7 | Tonic minor (m6/9) |\n| 2 | B Dorian ♭2 | Phrygian, raise the 6th | 1 ♭2 ♭3 4 5 6 ♭7 | m7 | 7sus♭9 sound |\n| 3 | C Lydian augmented | Lydian, raise the 5th | 1 2 3 ♯4 ♯5 6 7 | maj7♯5 | Floating maj7♯5 |\n| 4 | D Lydian dominant | Mixolydian, raise the 4th | 1 2 3 ♯4 5 6 ♭7 | 7 | IV7, ♭VII7, tritone subs |\n| 5 | E Mixolydian ♭6 | Aeolian, raise the 3rd | 1 2 3 4 5 ♭6 ♭7 | 7 | Gentle V7 in minor |\n| 6 | F♯ Locrian ♮2 | Locrian, raise the 2nd | 1 2 ♭3 4 ♭5 ♭6 ♭7 | m7♭5 | iiø7 in minor (standard) |\n| 7 | G♯ Altered | Locrian, lower the 4th | 1 ♭2 ♭3 ♭4 ♭5 ♭6 ♭7 | 7alt | Tense V7 |\n\nOn the **Altered** scale, read the degrees as a dominant chord: ♭2 is ♭9, ♭3 is ♯9, ♭4 is the major 3rd, ♭5 is ♯11, ♭6 is ♭13.\n\n**Parent shortcuts:**\n- X7alt: melodic minor a **semitone above** X. G7alt = A♭ melodic minor.\n- X7♯11 (Lydian dominant): melodic minor a **5th above** X. D7♯11 = A melodic minor.\n- Xm7♭5 (Locrian ♮2): melodic minor a **minor 3rd above** X. F♯m7♭5 = A melodic minor.\n- X Phrygian dominant: harmonic minor a **4th above** X. E Phrygian dominant = A harmonic minor.\n\n**Worked example.** Spell D♭ Lydian dominant. D♭ Mixolydian is D♭ E♭ F G♭ A♭ B♭ C♭ (parent G♭ major). Raise the 4th: D♭ E♭ F **G** A♭ B♭ C♭. Check: a 5th above D♭ is A♭, and A♭ melodic minor has the same notes.` },
  { id: 'B4', module: 'B', name: 'Symmetric scales', rule: 'Half-whole: H W repeating, over 7♭9 (repeats every minor 3rd). Whole-half: W H, over dim7. Whole tone: all whole steps, over 7♯5 (no perfect 5th).', visual: { type: 'clock', pcs: [0, 2, 4, 6, 8, 10] },
    md: `These scales repeat a fixed step pattern, so on the pitch clock they make regular shapes and there are only a few of each.\n\n| Scale | Steps | Formula | Over | Versions | Shortcut |\n|---|---|---|---|---|---|\n| Half-whole diminished | H W H W H W H W | 1 ♭2 ♯2 3 ♯4 5 6 ♭7 | 7♭9, 13♭9 | 3 | Repeats every minor 3rd: G7, B♭7, D♭7, E7 share one scale |\n| Whole-half diminished | W H W H W H W H | 1 2 ♭3 4 ♭5 ♭6 6 7 | dim7 | 3 | Same notes as half-whole a semitone lower |\n| Whole tone | W W W W W W | 1 2 3 ♯4 ♯5 ♭7 | 7♯5, 9♯5 | 2 | Repeats every whole step; no perfect 5th |\n\nThe half-whole scale has ♭9, ♯9, ♯11 and **♮13** with a **natural 5th**, unlike the altered scale, which has ♭13 and no natural 5th. That is the contrast to drill.` },
  { id: 'C1', module: 'C', name: 'Secondary dominants', rule: 'Go up a 5th from the target and make it a dominant 7th. Its 3rd is the target’s leading tone (V7/IV adds the ♭7 instead).', visual: { type: 'circle' },
    md: `A V7 pulls to I because its 3rd is a semitone below the tonic and its 3rd and 7th form a tritone that wants to resolve. You can point that pull at any diatonic chord (except the diminished vii) by playing that chord's own V7 first. **The rule: go up a 5th from the target and make it a dominant 7th.** Each secondary dominant adds one note from outside the key, its 3rd, which is the leading tone of the target. (V7/IV adds the ♭7 instead.)\n\n| Target (C major) | Secondary dominant | Roman shortcut | Out-of-key note | With its ii |\n|---|---|---|---|---|\n| ii (Dm7) | A7 | VI7 | C♯ | Em7–A7–Dm7 |\n| iii (Em7) | B7 | VII7 | D♯ | F♯m7♭5–B7–Em7 |\n| IV (Fmaj7) | C7 | I7 | B♭ | Gm7–C7–Fmaj7 |\n| V (G7) | D7 | II7 | F♯ | Am7–D7–G7 |\n| vi (Am7) | E7 | III7 | G♯ | Bm7♭5–E7–Am7 |\n\nWhen the target is minor (ii, iii, vi), its ii–V is a minor ii–V: m7♭5 then 7♭9 or 7alt.\n\nIn a minor key the same rule gives, in A minor: V7/iv = A7, V7/v = B7, V7/♭VI = C7, V7/♭VII = D7. (V7/♭III is G7, already diatonic as ♭VII7.)` },
  { id: 'C2', module: 'C', name: 'Tritone substitution', rule: 'The dominant a tritone away has the same 3rd and 7th, swapped, and resolves down a semitone.', visual: { type: 'clock', pcs: [7, 1], line: true },
    md: `A dominant 7th's 3rd and 7th sit a tritone apart. The dominant whose root is a tritone away has **the same two notes, swapped**: G7 has B and F, D♭7 has F and C♭. With the same guide tones it does the same job, and its root resolves **down a semitone** instead of down a 5th, giving a chromatic bass (Dm7–D♭7–C). On the pitch clock the two roots sit directly opposite each other.\n\nThe six pairs: **C7↔G♭7, G7↔D♭7, D7↔A♭7, A7↔E♭7, E7↔B♭7, B7↔F7.**\n\nSecondary dominants can be substituted too: in C, A7 (V7/ii) becomes E♭7, giving Cmaj7–E♭7–Dm7–D♭7–Cmaj7.` },
  { id: 'C3', module: 'C', name: 'Modal interchange', rule: 'Borrow from the PARALLEL modes (same tonic). Flat-side chords come from darker modes: ♭VI needs a ♭6, so Aeolian or darker.', visual: { type: 'strip', f: '1 2 b3 4 5 b6 b7' },
    md: `Parallel modes share your tonic. Any chord from the degree triangle of a parallel mode can be borrowed. Darker modes give flat-side chords with a wistful, heavier colour; Lydian gives a brighter one. Using the brightness ladder (B1) you can find a borrowed chord's source: ♭VI needs a ♭6, so it comes from Aeolian or darker.\n\n| In C major | Chord | Source | Typical move |\n|---|---|---|---|\n| iv | Fm, Fm6, Fm7 | C Aeolian | IV–iv–I |\n| ♭VImaj7 | A♭maj7 | C Aeolian | ♭VI–♭VII–I or ♭VI–I |\n| ♭VII7 | B♭7 | C Aeolian | Backdoor: Fm7–B♭7–Cmaj7 |\n| ♭IIImaj7 | E♭maj7 | C Aeolian or Dorian | I–♭III–IV |\n| iiø7 | Dm7♭5 | C Aeolian | Dm7♭5–G7–Cmaj7 |\n| v | Gm7 | C Mixolydian | Gm7–C7–Fmaj7 |\n| ♭VIImaj7 | B♭maj7 | C Mixolydian or Dorian | I–♭VII–I |\n| ♭IImaj7 | D♭maj7 | C Phrygian | ♭II–I |\n| II7 | D7 | C Lydian | I–II7, not resolving to V |\n\n| In A minor | Chord | Source | Typical move |\n|---|---|---|---|\n| IV7 | D7 | A Dorian | i–IV7 vamp |\n| V7 | E7 | A harmonic minor | V7–i |\n| I | A or Amaj7 | A major | Picardy ending |\n| ♭IImaj7 | B♭maj7 | A Phrygian | ♭II–V–i or ♭II–i |` },
  { id: 'D1', module: 'D', name: 'Guide tones of any chord', rule: 'The 3rd says major or minor; the 7th says major 7th, dominant or diminished. Only the dominant has a tritone between them.', visual: { type: 'clock', pcs: [4, 10], line: true },
    md: `The **3rd** says major or minor; the **7th** says major 7th, dominant or diminished. Together they identify every 7th-chord quality except one pair (m7 and m7♭5 share them; only the 5th tells them apart).\n\n| Quality | 3rd | 7th | Between them | Root C |\n|---|---|---|---|---|\n| maj7 | 3 | 7 | Perfect 5th | E, B |\n| 7 | 3 | ♭7 | Tritone | E, B♭ |\n| m7 | ♭3 | ♭7 | Perfect 5th | E♭, B♭ |\n| m7♭5 | ♭3 | ♭7 | Perfect 5th | E♭, B♭ |\n| mMaj7 | ♭3 | 7 | Augmented 5th | E♭, B |\n| dim7 | ♭3 | 𝄫7 | Tritone | E♭, B𝄫 |\n\nAmong the four common 7th chords, **only the dominant has a tritone between its guide tones**. That tritone is the tension a V7 carries, and it's why the tritone sub works (C2).` },
  { id: 'D2', module: 'D', name: 'The ii–V–I rule', rule: 'Roots down a 5th: the 7th falls a step to the next 3rd; the 3rd holds to become the next 7th.', visual: { type: 'circle' },
    md: `When roots move down a 5th, the guide tones barely move. **The 7th of the first chord falls a step to become the 3rd of the next. The 3rd of the first chord holds to become the 7th of the next.** So ii–V–I is two lines: at each change one note holds and the other steps down.\n\nIn C: Dm7 (F, C) → G7 (F, B) → Cmaj7 (E, B).\n\nDerive any key this way: name the guide tones of the ii, then apply “7th falls, 3rd holds” twice.` },
  { id: 'D3', module: 'D', name: 'The canonical progressions', rule: '7th falls, 3rd holds (roots down a 5th). Tritone sub: same lines, only the root moves. Cycle of dominants: two chromatic lines falling. Blues I7–IV7: both fall a semitone.', visual: { type: 'circle' },
    md: `Shown in C; each is drilled in all 12 keys.\n\n| Progression | Chords | Line A | Line B |\n|---|---|---|---|\n| Major ii–V–I | Dm7–G7–Cmaj7 | C → B → B | F → F → E |\n| Minor ii–V–i | Dm7♭5–G7–Cm7 | C → B → B♭ | F → F → E♭ |\n| ii–subV–I | Dm7–D♭7–Cmaj7 | C → C♭ → B | F → F → E |\n| Cycle of dominants | E7–A7–D7–G7–Cmaj7 | G♯ → G → F♯ → F → E | D → C♯ → C → B → B |\n| Turnaround from VI7 | A7–Dm7–G7–Cmaj7 | G → F → F → E | C♯ → C → B → B |\n| Blues I7–IV7 | C7–F7 | E → E♭ | B♭ → A |\n\n1. The tritone sub leaves both lines exactly as they were. Only the root moves.\n2. A cycle of dominants is two chromatic lines falling side by side, alternating 3rd and 7th.\n3. In a blues, both guide tones fall a semitone from I7 to IV7 and rise back.` },
  { id: 'E1', module: 'E', after: 'B3', name: 'Triads over chords', rule: 'Name the triad by the chord degree it sits on, then read each note as a tension over the chord root. Over a dominant: II = 9 ♯11 13, VI = 13 ♭9 3, ♭VI = ♭13 1 ♯9, ♭V = ♯11 ♭7 ♭9.', visual: { type: 'clock', pcs: [0, 2, 6, 9] },
    md: SI_MD('triads') },
  { id: 'E2', module: 'E', name: 'Pentatonics over chords', rule: 'Pentatonics a step or a 5th up stay inside (Dorian, Lydian, Mixolydian colours); the minor pentatonic a minor 3rd above a dominant is the altered sound.', visual: { type: 'clock', pcs: [3, 6, 8, 10, 1] },
    md: SI_MD('pent') },
];

export const MODULES = [
  { id: 'A', name: 'Keys', blurb: 'Intervals, circle of fifths, every note in every key, the degree triangle' },
  { id: 'B', name: 'Scales and modes', blurb: 'Major, harmonic minor and melodic minor modes; diminished and whole tone' },
  { id: 'C', name: 'Functional harmony', blurb: 'Secondary dominants, tritone subs, modal interchange' },
  { id: 'D', name: 'Guide tones', blurb: '3rds and 7ths, the ii–V–I rule, canonical lines' },
  { id: 'E', name: 'Superimposition', blurb: 'Which triad or pentatonic to play over each chord, and the tensions it adds' },
];

// ---------- generators ----------
// intervals as facts, not as per-key lookups (any single interval in a key you can work out on the spot)
function A1() {
  const out = [];
  for (const [k, , semis, l] of E.IV) {
    out.push(card({ id: `A1.name.semis.${k}`, module: 'A', unit: 'A1', type: 'name', input: 'choice', choices: Array.from({ length: 11 }, (_, i) => String(i + 1)), prompt: `Semitones in a ${l} (${k})?`, answer: [String(semis)], tags: ['interval', 'semitones'],
      why: `A ${l} is ${semis} semitones (C up to ${nm(up(N('C'), E.IV.find((x) => x[0] === k)[1]))}).`, hints: ['Major-scale steps from C: 2, 4, 5, 7, 9, 11 semitones.', 'Minor = major − 1. Tritone = 6.', `Between ${semis - 1} and ${semis + 1}.`] }));
    out.push(card({ id: `A1.name.inv.${k}`, module: 'A', unit: 'A1', type: 'reverse', input: 'choice', choices: E.IV.map((x) => E.ivLabel(x[0])), prompt: `${k} inverts to…?`, answer: [E.ivLabel(INV[k])], tags: ['interval', 'inversion'],
      why: `Inversions add to 9 and major ↔ minor: ${k} ↔ ${INV[k]} (${semis} + ${12 - semis} = 12 semitones).`, hints: ['Numbers add to 9; major becomes minor, perfect stays perfect.', `${semis} semitones up, so ${12 - semis} the other way.`, `It’s a ${INV[k].slice(1) === 'T' ? 'tritone' : ord(Number(INV[k].slice(1)))}.`] }));
  }
  return out;
}

const KEY15 = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb'];
const sigLabel = (k) => { const s = E.SIG[k]; return s === 0 ? '0' : s > 0 ? `${s}♯` : `${-s}♭`; };
function A1ext() {
  const EXT = [['♭9', '♭2'], ['9', '2'], ['♯9', '♯2 (= ♭3)'], ['11', '4'], ['♯11', '♯4'], ['♭13', '♭6'], ['13', '6']];
  return EXT.map(([x, y]) => card({ id: `A1.name.ext.${x}`, module: 'A', unit: 'A1', type: 'name', input: 'choice', choices: EXT.map((e) => e[1]), prompt: `The ${x} is the same note as the…?`, answer: [y], tags: ['interval', 'extension'],
    why: `Extensions are the 2nd, 4th and 6th an octave up: 9 = 2, 11 = 4, 13 = 6, so ${x} = ${y}.`, hints: ['Subtract 7.', '9 = 2, 11 = 4, 13 = 6.', `It’s a ${y.replace(/[♭♯]/g, '')[0]}.`] }));
}
function A2() {
  const out = [];
  const CH = ['0', ...[1, 2, 3, 4, 5, 6, 7].map((n) => n + '♯'), ...[1, 2, 3, 4, 5, 6, 7].map((n) => n + '♭')];
  for (const k of KEY15) {
    const s = E.SIG[k], sig = E.sigNotes(k), key = N(k), rank = Math.min(Math.abs(s), 6);
    const what = s > 0 ? `${s} sharp${s > 1 ? 's' : ''}` : s < 0 ? `${-s} flat${s < -1 ? 's' : ''}` : 'no sharps or flats';
    const how = s > 0 ? `Last sharp ${nm(sig.at(-1))}, up a semitone: ${nm(key)}.` : s === -1 ? 'One flat is F major (memorise it).' : s < 0 ? `Flats ${list(sig)}; the second-to-last is ${nm(sig.at(-2))}.` : 'C major has none.';
    const traps = s < -1 ? [{ answer: [nm(sig.at(-1))], msg: 'For flat keys it’s the second-to-last flat, not the last one.' }] : s > 0 ? [{ answer: [nm(sig.at(-1))], msg: 'The last sharp is the 7th degree; go up a semitone from it.' }] : [];
    out.push(card({ id: `A2.name.sigkey.${k}`, module: 'A', unit: 'A2', type: 'name', prompt: `Major key with ${what}?`, answer: [nm(key)], rank, traps, tags: ['circle', 'signature'],
      accept: k === 'F#' ? [['G♭']] : k === 'Gb' ? [['F♯']] : k === 'C#' ? [['D♭']] : k === 'Cb' ? [['B']] : k === 'Db' ? [['C♯']] : k === 'B' ? [['C♭']] : [],
      why: how, hints: ['Sharps: up a semitone from the last sharp. Flats: the second-to-last flat names the key.', s ? `The ${s > 0 ? 'sharps' : 'flats'}: ${list(sig)}.` : 'No accidentals at all.', `It’s some kind of ${nm({ letter: key.letter, acc: 0 })}.`] }));
    out.push(card({ id: `A2.reverse.keysig.${k}`, module: 'A', unit: 'A2', type: 'reverse', input: 'choice', choices: CH, prompt: `How many sharps or flats in ${nm(key)} major?`, answer: [sigLabel(k)], rank, reverse_of: `A2.name.sigkey.${k}`, tags: ['circle', 'signature'],
      why: `${nm(key)} major: ${what}${s ? ` (${list(sig)})` : ''}.`, hints: ['Count steps round the circle from C: clockwise adds sharps, anticlockwise adds flats.', s > 0 ? `${nm(key)} is ${s} fifth${s > 1 ? 's' : ''} above C.` : s < 0 ? `${nm(key)} is ${-s} fourth${s < -1 ? 's' : ''} above C.` : 'C is the top of the circle.', s > 0 ? 'Sharps.' : s < 0 ? 'Flats.' : 'None.'] }));
    if (s) out.push(card({ id: `A2.spell.sig.${k}`, module: 'A', unit: 'A2', type: 'spell', prompt: `Which ${s > 0 ? 'sharps' : 'flats'} are in ${nm(key)} major? (in order)`, answer: sig.map(nm), rank, tags: ['circle', 'signature'],
      why: `${nm(key)} major has ${what}: ${list(sig)} — in the order ${s > 0 ? 'F C G D A E B' : 'B E A D G C F'}.`, hints: [s > 0 ? 'Order of sharps: F C G D A E B.' : 'Order of flats: B E A D G C F.', `${Math.abs(s)} of them.`, letterHint(sig.map(nm))] }));
  }
  for (const k of E.MAJOR_KEYS) {
    const key = N(k), a = up(key, '5'), b = up(key, '4');
    out.push(card({ id: `A2.name.neigh.${k}`, module: 'A', unit: 'A2', type: 'name', prompt: `Neighbours of ${nm(key)} on the circle? (clockwise, then anticlockwise)`, answer: [nm(a), nm(b)], accept: [[nm(b), nm(a)]], rank: rankOf(key), tags: ['circle'],
      why: `Clockwise is up a 5th (${nm(a)}), anticlockwise up a 4th (${nm(b)}).`, hints: ['Clockwise = up a 5th; anticlockwise = up a 4th (down a 5th).', `${nm(key)} major's 5th and 4th degrees.`, `Starts ${nm(a)}…`] }));
  }
  return out;
}

function A3() {
  const out = [];
  for (const k of E.MAJOR_KEYS) {
    const key = N(k), rel = up(key, '6');
    out.push(card({ id: `A3.name.relminor.${k}`, module: 'A', unit: 'A3', type: 'name', prompt: `Relative minor of ${nm(key)} major?`, answer: [nm(rel)], rank: rankOf(key), tags: ['relative'],
      traps: [{ answer: [nm(key)], msg: 'Relative shares the signature; parallel shares the tonic. The relative minor starts on the 6th.' }],
      why: `${nm(rel)} minor shares ${nm(key)} major’s signature: it starts on the 6th, a minor 3rd below ${nm(key)}.`, hints: ['Relative minor = the 6th degree (a minor 3rd down).', `${nm(key)} major: ${list(E.spell(key, 'ionian'))}.`, `It’s some kind of ${nm({ letter: rel.letter, acc: 0 })}.`] }));
    let pmRoot = key, pm = E.spell(key, 'aeolian');
    if (E.accCount(pm) > 7) { pmRoot = E.bestRoot(E.pc(key), (r) => E.spell(r, 'aeolian')); pm = E.spell(pmRoot, 'aeolian'); }
    const cnt = E.accCount(pm.filter((n) => n.acc)), sh = pm.some((n) => n.acc > 0);
    const lab = cnt === 0 ? '0' : `${cnt}${sh ? '♯' : '♭'}`;
    out.push(card({ id: `A3.name.parallel.${k}`, module: 'A', unit: 'A3', type: 'name', input: 'choice', choices: ['0', ...[1, 2, 3, 4, 5, 6, 7].map((n) => n + '♯'), ...[1, 2, 3, 4, 5, 6, 7].map((n) => n + '♭')], prompt: `Parallel minor of ${nm(key)} major has how many sharps or flats?`, answer: [lab], rank: rankOf(key), tags: ['parallel'],
      why: `${nm(pmRoot)} minor (same tonic${E.same(pmRoot, key) ? '' : ', spelled enharmonically'}) is ${list(pm)}: three flats more (or sharps fewer) than ${nm(key)} major, so ${lab}.`, hints: ['Parallel = same tonic. Minor has 3 more flats (or 3 fewer sharps) than its parallel major.', `${nm(key)} major has ${sigLabel(k)}.`, sh ? 'Sharps.' : cnt ? 'Flats.' : 'None.'] }));
  }
  for (const k of E.MINOR_KEYS) {
    const key = N(k), rel = up(key, 'b3');
    out.push(card({ id: `A3.name.relmajor.${k}`, module: 'A', unit: 'A3', type: 'reverse', prompt: `Relative major of ${nm(key)} minor?`, answer: [nm(rel)], rank: rankOf(rel), tags: ['relative'],
      traps: [{ answer: [nm(key)], msg: 'Relative shares the signature; parallel shares the tonic. Go up a minor 3rd.' }],
      why: `Up a minor 3rd from ${nm(key)} is ${nm(rel)}; ${nm(rel)} major shares the signature.`, hints: ['Relative major = up a minor 3rd from the minor tonic.', `${nm(key)} natural minor: ${list(E.spell(key, 'aeolian'))}.`, `It’s some kind of ${nm({ letter: rel.letter, acc: 0 })}.`] }));
  }
  return out;
}

function A4() {
  const out = [];
  const kinds = [['ionian', 'major', E.MAJOR_KEYS], ['aeolian', 'natural minor', E.MINOR_KEYS], ['harmonic-minor', 'harmonic minor', E.MINOR_KEYS], ['melodic-minor', 'melodic minor', E.MINOR_KEYS]];
  for (const [id, label, keys] of kinds) for (const k of keys) {
    const key = N(k), notes = E.spell(key, id), ans = notes.map(nm), minor = id !== 'ionian';
    const rel = minor ? up(key, 'b3') : null;
    const why = id === 'ionian' ? `${nm(key)} major: ${list(notes)}${notes.some((n) => n.letter === 2 && n.acc === 1) ? ' — E♯, so the E letter appears once' : ''}.`
      : id === 'aeolian' ? `${nm(rel)} major from its 6th: ${list(notes)}.`
        : id === 'harmonic-minor' ? `${nm(key)} natural minor with the 7th raised: ${list(notes)}.`
          : `${nm(key)} major with a ♭3: ${list(notes)}.`;
    const rule = id === 'ionian' ? 'Circle order: each key changes one note from its neighbour; each letter once.' : id === 'aeolian' ? 'Natural minor = the relative major started from its 6th.' : id === 'harmonic-minor' ? 'Harmonic minor = natural minor with the 7th raised.' : 'Melodic minor = major with a ♭3.';
    const step = id === 'ionian' ? `Neighbour key ${nm(up(key, '4'))} major is ${list(E.spell(up(key, '4'), 'ionian'))}; change one note.` : id === 'aeolian' ? `${nm(rel)} major: ${list(E.spell(rel, 'ionian'))}.` : id === 'harmonic-minor' ? `${nm(key)} natural minor: ${list(E.spell(key, 'aeolian'))}.` : `${nm(key)} major: ${list(E.spell(key, 'ionian'))}.`;
    const rank = rankOf(minor ? rel : key);
    out.push(card({ id: `A4.reeloff.${id}.${k}`, module: 'A', unit: 'A4', type: 'reeloff', input: 'self', prompt: `${nm(key)} ${label}, all seven notes`, answer: ans, rank, tags: ['keys', id], why, hints: [rule, step, letterHint(ans)] }));
    out.push(card({ id: `A4.spell.${id}.${k}`, module: 'A', unit: 'A4', type: 'spell', prompt: `Spell ${nm(key)} ${label}`, answer: ans, rank, tags: ['keys', id], reverse_of: `A4.reeloff.${id}.${k}`, why, hints: [rule, step, letterHint(ans)] }));
  }
  for (const k of E.MAJOR_KEYS) {
    const key = N(k), sc = E.spell(key, 'ionian');
    for (const d of [3, 4, 6, 7]) out.push(card({ id: `A4.name.deg${d}.${k}`, module: 'A', unit: 'A4', type: 'name', prompt: `${ord(d)} note of ${nm(key)} major?`, answer: [nm(sc[d - 1])], rank: rankOf(key), tags: ['keys', 'degree'],
      why: `${nm(key)} major: ${list(sc)}; the ${ord(d)} is ${nm(sc[d - 1])}.`, hints: ['Count letters up from the tonic, then apply the key signature.', `${nm(key)} major has ${sigLabel(k)}${E.SIG[k] ? ': ' + list(E.sigNotes(k)) : ''}.`, `It’s some kind of ${nm({ letter: sc[d - 1].letter, acc: 0 })}.`] }));
  }
  return out;
}

function triName(t, root, minor) { return `${minor ? 'minor' : 'major'} ${t.r}`; }
function A5() {
  const out = [];
  const QCH = ['maj7', 'm7', '7', 'm7♭5'];
  for (const k of E.MAJOR_KEYS) {
    const key = N(k), sc = E.spell(key, 'ionian');
    E.MAJ_TRI.forEach((t, i) => {
      const r = up(key, t.d);
      out.push(card({ id: `A5.name.maj.${t.r}.${k}`, module: 'A', unit: 'A5', type: 'name', prompt: `${t.r} in ${nm(key)} major?`, answer: [nm(r)], answerText: `${E.csym(r, t.q)} · ${E.MODE[t.mode].name}`, rank: rankOf(key), tags: ['triangle'],
        why: `${nm(key)} major is ${list(sc)}; note ${i + 1} is ${nm(r)}, and ${t.r} is a ${QNAME[t.q]} (${E.MODE[t.mode].name}): ${E.csym(r, t.q)}.`,
        hints: ['maj7, m7, m7, maj7, 7, m7, m7♭5 — Ionian, Dorian, Phrygian, Lydian, Mixolydian, Aeolian, Locrian.', `${nm(key)} major: ${list(sc)}.`, `It’s some kind of ${nm({ letter: r.letter, acc: 0 })}.`] }));
    });
    out.push(card({ id: `A5.reeloff.maj.${k}`, module: 'A', unit: 'A5', type: 'reeloff', input: 'self', prompt: `All seven chords of ${nm(key)} major`, answer: E.MAJ_TRI.map((t) => nm(up(key, t.d))), answerText: E.MAJ_TRI.map((t) => E.csym(up(key, t.d), t.q)).join(' '), rank: rankOf(key), tags: ['triangle'],
      why: `${E.MAJ_TRI.map((t) => E.csym(up(key, t.d), t.q)).join(' ')}.`, hints: ['maj7, m7, m7, maj7, 7, m7, m7♭5 on the notes of the scale.', `${nm(key)} major: ${list(sc)}.`, `Starts ${E.csym(key, 'maj7')} ${E.csym(sc[1], 'm7')}…`] }));
  }
  for (const k of E.MINOR_KEYS) {
    const key = N(k), sc = E.spell(key, 'aeolian'), relMaj = up(key, 'b3');
    E.MIN_TRI.forEach((t, i) => {
      const r = up(key, t.d);
      const majDeg = up(key, t.d.replace('b', ''));
      const traps = t.d.startsWith('b') ? [{ answer: [nm(majDeg)], msg: `Minor degrees are numbered against major: ${nm(majDeg)} would be the major ${t.d.slice(1)}, so the minor key’s note is ${t.r}.` }] : [];
      out.push(card({ id: `A5.name.min.${t.r}.${k}`, module: 'A', unit: 'A5', type: 'name', prompt: `${t.r} in ${nm(key)} minor?`, answer: [nm(r)], answerText: `${E.csym(r, t.q)} · ${E.MODE[t.mode].name}`, rank: rankOf(relMaj), traps, tags: ['triangle', 'minor'],
        why: `${nm(key)} natural minor is ${list(sc)}; note ${i + 1} is ${nm(r)}, and ${t.r} is a ${QNAME[t.q]} (${E.MODE[t.mode].name}): ${E.csym(r, t.q)}.`,
        hints: ['Minor: i m7, iiø7, ♭IIImaj7, iv m7, v m7, ♭VImaj7, ♭VII7 (the major cycle from the 6th).', `${nm(key)} natural minor = ${nm(relMaj)} major from ${nm(key)}: ${list(sc)}.`, `It’s some kind of ${nm({ letter: r.letter, acc: 0 })}.`] }));
    });
    for (const t of E.MIN_TRI.filter((x) => ['♭III', 'iv', '♭VI', '♭VII'].includes(x.r))) {
      const r = up(key, t.d);
      out.push(card({ id: `A5.reverse.min.${t.r}.${k}`, module: 'A', unit: 'A5', type: 'reverse', prompt: `${E.csym(r, t.q)} is ${t.r} of which minor key?`, answer: [nm(key)], rank: rankOf(relMaj), reverse_of: `A5.name.min.${t.r}.${k}`, tags: ['triangle', 'minor'],
        traps: t.r === '♭III' ? [{ answer: [nm(up(r, '6'))], msg: 'Relative vs parallel: ♭III is a minor 3rd ABOVE the minor tonic, so go down a minor 3rd.' }] : [],
        why: `${t.r} is the ${t.d.replace('b', '♭')} of the minor key, so the key is ${t.d.replace('b', '♭')} below ${nm(r)}: ${nm(key)} minor.`, hints: ['Work backwards: which degree is it, and how far is that from the tonic?', `${t.r} sits a ${E.intervalName(key, r)} above the tonic.`, `It’s some kind of ${nm({ letter: key.letter, acc: 0 })}.`] }));
    }
    out.push(card({ id: `A5.reeloff.min.${k}`, module: 'A', unit: 'A5', type: 'reeloff', input: 'self', prompt: `All seven chords of ${nm(key)} minor`, answer: E.MIN_TRI.map((t) => nm(up(key, t.d))), answerText: E.MIN_TRI.map((t) => E.csym(up(key, t.d), t.q)).join(' '), rank: rankOf(relMaj), tags: ['triangle', 'minor'],
      why: `${E.MIN_TRI.map((t) => E.csym(up(key, t.d), t.q)).join(' ')}.`, hints: ['m7, m7♭5, maj7, m7, m7, maj7, 7.', `${nm(key)} natural minor: ${list(sc)}.`, `Starts ${E.csym(key, 'm7')}…`] }));
  }
  // reverse: which major keys contain this chord
  for (const r0 of R12) {
    const pcN = E.pc(N(r0));
    const mk = (q, degs) => E.bestRoot(pcN, (r) => degs.map((d) => down(r, d)));
    const m7r = mk('m7', ['2', '3', '6']), mj = mk('maj7', ['1', '4']), d7 = mk('7', ['5']), hd = mk('m7b5', ['7']);
    const rows = [[m7r, 'm7', ['2', '3', '6'], 'ii, iii and vi'], [mj, 'maj7', ['1', '4'], 'I and IV'], [d7, '7', ['5'], 'V'], [hd, 'm7b5', ['7'], 'vii']];
    for (const [r, q, degs, names] of rows) {
      const ans = degs.map((d) => down(r, d));
      out.push(card({ id: `A5.reverse.${q}.${r0}`, module: 'A', unit: 'A5', type: 'reverse', prompt: `${E.csym(r, q)} is ${names} of which major key${degs.length > 1 ? 's (in that order)' : ''}?`, answer: ans.map(nm), rank: rankOf(r), tags: ['triangle', 'reverse'],
        why: `${degs.map((d, i) => `${E.MAJ_TRI[Number(d) - 1].r} of ${nm(ans[i])}`).join(', ')}: ${E.csym(r, q)} sits on those degrees.`, hints: ['Go down from the chord root by the degree: ii → down a step, iii → down a M3, IV → down a 4th, V → down a 5th, vi → down a M6, vii → down a M7.', `${E.csym(r, q)}: ${degs.map((d) => `${E.MAJ_TRI[Number(d) - 1].r} means the key is ${d === '1' ? 'the root itself' : `a ${E.intervalName(down(r, d), r)} below`}`).join('; ')}.`, letterHint(ans.map(nm))] }));
    }
  }
  E.MAJ_TRI.forEach((t) => out.push(card({ id: `A5.name.quality.maj.${t.r}`, module: 'A', unit: 'A5', type: 'name', input: 'choice', choices: QCH, prompt: `What quality is the ${t.r} chord in a major key?`, answer: [QNAME[t.q]], tags: ['triangle', 'quality'],
    why: `${t.r} is ${QNAME[t.q]} (${E.MODE[t.mode].name}).`, hints: ['major, minor, minor, major, dominant, minor, half-diminished.', `Degree ${t.d} of 7.`, QNAME[t.q][0] === 'm' ? 'A minor-ish chord.' : 'A major-ish chord.'] })));
  E.MIN_TRI.forEach((t) => out.push(card({ id: `A5.name.quality.min.${t.r}`, module: 'A', unit: 'A5', type: 'name', input: 'choice', choices: QCH, prompt: `What quality is ${t.r} in a minor key?`, answer: [QNAME[t.q]], tags: ['triangle', 'quality', 'minor'],
    why: `${t.r} in natural minor is ${QNAME[t.q]} (${E.MODE[t.mode].name}).`, hints: ['The major cycle started from its 6th: m7, m7♭5, maj7, m7, m7, maj7, 7.', `It’s the ${t.r} chord.`, QNAME[t.q][0] === 'm' ? 'A minor-ish chord.' : 'A major-ish chord.'] })));
  return out;
}

// --- module B helpers
const MODE_NAMES = (fam) => E.MODES.filter((m) => m.fam === fam).map((m) => m.name);
function twinText(m) { return m.twin ? `${E.MODE[m.twin].name}, ${m.how}` : ''; }
export function contrast(idA, idB, unit, module = 'B') {
  const a = E.MODE[idA], b = E.MODE[idB];
  const fa = a.f.split(' '), fb = b.f.split(' ');
  const diff = [];
  const n = Math.max(fa.length, fb.length);
  for (let i = 0; i < n; i++) if (fa[i] !== fb[i]) diff.push(`${E.prettyDeg(fa[i] || '—')} vs ${E.prettyDeg(fb[i] || '—')}`);
  const ans = diff.join(', ');
  const pool = ['♭2 vs 2', '3 vs ♭3', '♯4 vs 4', '6 vs ♭6', '♭7 vs 7', '♭5 vs 5', '2 vs ♭2', '♭6 vs 6', '♮13 vs ♭13'].filter((x) => x !== ans);
  const choices = [ans, ...pool.slice(0, 3)].sort();
  return card({ id: `${unit}.contrast.${idA}.${idB}`, module, unit, type: 'contrast', input: 'choice', choices, prompt: `${a.name} vs ${b.name}: what differs? (${a.name} first)`, answer: [ans], tags: ['contrast'],
    why: `${a.name} is ${a.f.split(' ').map(E.prettyDeg).join(' ')}; ${b.name} is ${b.f.split(' ').map(E.prettyDeg).join(' ')}.`, hints: ['Write both formulas as degree strips and compare column by column.', `${a.name}: ${a.f.split(' ').map(E.prettyDeg).join(' ')}.`, `${b.name}: ${b.f.split(' ').map(E.prettyDeg).join(' ')}.`] });
}
function modeSpells(unit, ids, extra = () => ({})) {
  const out = [];
  for (const id of ids) {
    const m = E.MODE[id];
    for (let p = 0; p < 12; p++) {
      const root = E.bestRoot(p, (r) => E.spell(r, id));
      if (!root) continue;
      const notes = E.spell(root, id), ans = notes.map(nm);
      let hint2, why;
      if (m.fam === 'major') {
        const par = E.parentOf(root, id);
        hint2 = `${nm(root)} major: ${list(E.spell(root, 'ionian'))}${m.change !== '—' ? `; apply ${m.change}` : ''}. (Parent: ${nm(par)} major, ${E.PARENT[id][1]}.)`;
        why = `${nm(root)} ${m.name} = ${nm(root)} major with ${m.change === '—' ? 'nothing changed' : m.change} (parent ${nm(par)} major): ${list(notes)}.`;
      } else if (m.twin) {
        const tw = E.spell(root, m.twin);
        hint2 = `${nm(root)} ${E.MODE[m.twin].name} is ${list(tw)}; now ${m.how}.`;
        why = `${nm(root)} ${E.MODE[m.twin].name} is ${list(tw)}; ${m.how}: ${list(notes)}.`;
      } else {
        hint2 = `Steps: ${m.steps}.`;
        why = `${nm(root)} ${m.name} (${m.steps}): ${list(notes)}.`;
      }
      const traps = [];
      if (m.fam === 'major' && id !== 'ionian') {
        // parent direction reversed: the major scale a degree ABOVE instead of below, read from the root
        const wrong = up(root, E.PARENT[id][0] === '6' ? 'b6' : E.PARENT[id][0] === '7' ? 'b2' : E.PARENT[id][0]);
        try {
          const ws = E.spell(wrong, 'ionian'); const start = ws.findIndex((n) => n.letter === root.letter);
          if (start >= 0) traps.push({ answer: [...ws.slice(start), ...ws.slice(0, start)].map(nm), msg: `Parent direction reversed: ${m.name}’s parent is ${E.PARENT[id][1]}.` });
        } catch (e) { /* */ }
      }
      if (id === 'altered') traps.push({ answer: ans.map((x, i) => (i === 3 ? nm(up(root, '3')) : x)), ok: true, msg: 'Spell it as a scale (♭4); hear it as a chord (3). Both are accepted.' });
      out.push(card({ id: `${unit}.spell.${id}.${nm(root)}`, module: 'B', unit, type: 'spell', prompt: `Spell ${nm(root)} ${m.name}`, answer: ans, rank: RANK_PC[p], tags: [m.fam, id], traps,
        accept: id === 'altered' ? [ans.map((x, i) => (i === 3 ? nm(up(root, '3')) : x))] : [],
        requires: m.twin ? [`B1.spell.${m.twin}.${nm(root)}`] : [], why,
        hints: [m.fam === 'major' ? `${m.name} = major with ${m.change === '—' ? 'nothing changed' : m.change}.` : m.twin ? `${m.name} = ${twinText(m)}.` : `${m.name}: ${m.steps}.`, hint2, letterHint(ans)], ...extra(m, root) }));
    }
  }
  return out;
}
function B1() {
  const out = modeSpells('B1', E.BRIGHT);
  const CH = ['—', '♭3', '♭2', '♯4', '♭7', '♭6', '♭5'];
  for (const id of E.BRIGHT) {
    const m = E.MODE[id];
    out.push(card({ id: `B1.name.formula.${id}`, module: 'B', unit: 'B1', type: 'name', input: 'choice', choices: MODE_NAMES('major'), prompt: `${m.f.split(' ').map(E.prettyDeg).join(' ')} — which mode?`, answer: [m.name], tags: ['major-modes', id],
      why: `${m.name}: ${m.change === '—' ? 'the major scale itself' : `major with ${m.change}`}.`, hints: ['Find which notes differ from 1 2 3 4 5 6 7, then read the ladder.', `Altered notes: ${m.f.split(' ').filter((x) => /[b#]/.test(x)).map(E.prettyDeg).join(' ') || 'none'}.`, `Brightness ${E.BRIGHT.indexOf(id) + 1} of 7.`] }));
    out.push(card({ id: `B1.name.change.${id}`, module: 'B', unit: 'B1', type: 'name', input: 'choice', choices: CH, prompt: `${m.name}: which note does it change on the ladder?`, answer: [m.change], tags: ['major-modes', id],
      why: `${m.name} is ${m.f.split(' ').map(E.prettyDeg).join(' ')}; going down the ladder it is the mode that adds ${m.change}.`, hints: ['Lydian ♯4 · Ionian · Mixolydian ♭7 · Dorian ♭3 · Aeolian ♭6 · Phrygian ♭2 · Locrian ♭5.', `${m.name} is number ${E.BRIGHT.indexOf(id) + 1} from the bright end.`, `Its 7th chord is ${QNAME[m.chord]}.`] }));
    if (id !== 'ionian') for (let p = 0; p < 12; p++) {
      const root = E.bestRoot(p, (r) => E.spell(r, id)); if (!root) continue;
      const par = E.parentOf(root, id);
      const tok = E.PARENT[id][0];
      const wrong = up(root, tok === '6' ? 'b6' : tok === '7' ? 'b2' : tok);
      out.push(card({ id: `B1.name.parent.${id}.${nm(root)}`, module: 'B', unit: 'B1', type: 'name', prompt: `${nm(root)} ${m.name}: parent major scale?`, answer: [nm(par)], rank: RANK_PC[p], tags: ['parent', id],
        traps: [{ answer: [nm(wrong)], msg: `Parent direction reversed: ${m.name}’s parent is ${E.PARENT[id][1]}.` }],
        why: `${m.name}’s parent is ${E.PARENT[id][1]}: ${nm(root)} ${m.name} is ${nm(par)} major from ${nm(root)}.`, hints: ['Dorian ↓ M2 · Phrygian ↓ M3 · Lydian ↓ P4 · Mixolydian ↓ P5 · Aeolian ↑ m3 · Locrian ↑ m2.', `${m.name}: ${E.PARENT[id][1]}.`, `It’s some kind of ${nm({ letter: par.letter, acc: 0 })}.`] }));
    }
  }
  for (let i = 0; i < 6; i++) out.push(contrast(E.BRIGHT[i], E.BRIGHT[i + 1], 'B1'));
  out.push(card({ id: 'B1.reeloff.ladder', module: 'B', unit: 'B1', type: 'reeloff', input: 'self', prompt: 'Brightness ladder, Lydian to Locrian, with each changed note', answer: ['Lydian ♯4', 'Ionian', 'Mixolydian ♭7', 'Dorian ♭3', 'Aeolian ♭6', 'Phrygian ♭2', 'Locrian ♭5'], tags: ['ladder'],
    why: 'Each step down the ladder darkens one more note: ♯4 → — → ♭7 → ♭3 → ♭6 → ♭2 → ♭5.', hints: ['Brightest has a ♯4; darkest has a ♭5.', 'The flats arrive in the order ♭7, ♭3, ♭6, ♭2, ♭5 (fourths!).', 'Lydian, Ionian, Mixolydian…'] }));
  out.push(card({ id: 'B1.reeloff.order', module: 'B', unit: 'B1', type: 'reeloff', input: 'self', prompt: 'The seven major modes in scale order, with their 7th chords', answer: ['Ionian maj7', 'Dorian m7', 'Phrygian m7', 'Lydian maj7', 'Mixolydian 7', 'Aeolian m7', 'Locrian m7♭5'], tags: ['ladder'],
    why: 'I Ionian maj7, ii Dorian m7, iii Phrygian m7, IV Lydian maj7, V Mixolydian 7, vi Aeolian m7, vii Locrian m7♭5.', hints: ['Same order as the degree triangle.', 'maj7, m7, m7, maj7, 7, m7, m7♭5.', 'Ionian, Dorian, Phrygian…'] }));
  return out;
}
function minorFamily(unit, fam) {
  const ids = E.MODES.filter((m) => m.fam === fam).map((m) => m.id);
  const out = modeSpells(unit, ids);
  const twins = E.MODES.filter((m) => m.twin).map(twinText);
  const uses = E.MODES.filter((m) => m.fam === fam).map((m) => m.name);
  for (const id of ids) {
    const m = E.MODE[id];
    const others = twins.filter((t) => t !== twinText(m)).sort(() => 0.5 - ((id.length * 7) % 10) / 10).slice(0, 3);
    out.push(card({ id: `${unit}.name.twin.${id}`, module: 'B', unit, type: 'name', input: 'choice', choices: [twinText(m), ...others].sort(), prompt: `${m.name} is which major mode with what changed?`, answer: [twinText(m)], tags: [fam, 'twin', id],
      why: `${m.name} = ${twinText(m)}: ${m.f.split(' ').map(E.prettyDeg).join(' ')}.`, hints: ['The name says what moved: ♯5 means the 5th was raised; “dominant” means the 3rd became major.', `Formula: ${m.f.split(' ').map(E.prettyDeg).join(' ')}.`, `Twin: ${E.MODE[m.twin].name}.`] }));
    out.push(card({ id: `${unit}.name.formula.${id}`, module: 'B', unit, type: 'name', input: 'choice', choices: uses, prompt: `${m.f.split(' ').map(E.prettyDeg).join(' ')} — which mode?`, answer: [m.name], tags: [fam, id],
      why: `${m.name} (${twinText(m)}).`, hints: ['Find the nearest major mode, then name the change.', `Its 7th chord is ${CHORD_LABEL(m.chord)}.`, `Mode ${m.i} of ${fam} minor.`] }));
    out.push(card({ id: `${unit}.name.use.${id}`, module: 'B', unit, type: 'name', input: 'choice', choices: uses, prompt: `${m.use} (${CHORD_LABEL(m.chord)}): which ${fam}-minor mode?`, answer: [m.name], tags: [fam, 'use', id],
      why: `${m.name} gives ${CHORD_LABEL(m.chord)}; colour ${m.colour}.`, hints: ['Match the 7th chord first, then the colour note.', `It’s mode ${m.i}.`, `Colour: ${m.colour}.`] }));
  }
  out.push(card({ id: `${unit}.reeloff.modes`, module: 'B', unit, type: 'reeloff', input: 'self', prompt: `Modes of ${fam} minor in order, with their 7th chords`, answer: ids.map((id) => `${E.MODE[id].name} ${CHORD_LABEL(E.MODE[id].chord)}`), tags: [fam],
    why: ids.map((id) => `${E.MODE[id].name} ${CHORD_LABEL(E.MODE[id].chord)}`).join(' · ') + '.', hints: ['Each is a major mode with one note changed.', ids.map((id) => twinText(E.MODE[id])).slice(0, 3).join('; ') + '…', `${E.MODE[ids[0]].name}, ${E.MODE[ids[1]].name}…`] }));
  return out;
}
const CHORD_LABEL = (q) => (E.CHORD[q] ? E.CHORD[q].sym : q);
function B2() {
  const out = minorFamily('B2', 'harmonic');
  for (let p = 0; p < 12; p++) {
    const root = E.bestRoot(p, (r) => E.spell(up(r, '4'), 'harmonic-minor')); const hm = up(root, '4');
    out.push(card({ id: `B2.name.parent.pd.${nm(root)}`, module: 'B', unit: 'B2', type: 'name', prompt: `${nm(root)} Phrygian dominant: which harmonic minor?`, answer: [nm(hm)], rank: RANK_PC[p], tags: ['parent'],
      traps: [{ answer: [nm(down(root, '4'))], msg: 'Parent direction reversed: Phrygian dominant is mode 5, so the harmonic minor is a 4th ABOVE.' }],
      why: `Phrygian dominant is mode 5 of harmonic minor: up a 4th from ${nm(root)} is ${nm(hm)}, so ${nm(hm)} harmonic minor.`, hints: ['X Phrygian dominant = harmonic minor a 4th above X.', `A 4th above ${nm(root)}.`, `It’s some kind of ${nm({ letter: hm.letter, acc: 0 })}.`] }));
  }
  out.push(contrast('phrygian-dominant', 'phrygian', 'B2'));
  out.push(contrast('locrian-nat6', 'locrian-nat2', 'B2'));
  return out;
}
function B3() {
  const out = minorFamily('B3', 'melodic');
  const SC = [['7alt', 'b2', 'a semitone above', 'altered'], ['7♯11', '5', 'a 5th above', 'lydian-dominant'], ['m7♭5', 'b3', 'a minor 3rd above', 'locrian-nat2']];
  for (const [chord, tok, how, mode] of SC) for (let p = 0; p < 12; p++) {
    const root = E.bestRoot(p, (r) => E.spell(up(r, tok), 'melodic-minor')); const mm = up(root, tok);
    out.push(card({ id: `B3.name.parent.${mode}.${nm(root)}`, module: 'B', unit: 'B3', type: 'name', prompt: `${nm(root)}${chord}: which melodic minor?`, answer: [nm(mm)], rank: RANK_PC[p], tags: ['parent', mode],
      traps: [{ answer: [nm(down(root, tok))], msg: `Parent direction reversed: the melodic minor is ${how} ${nm(root)}.` }],
      why: `${E.MODE[mode].name} is mode ${E.MODE[mode].i} of melodic minor: ${how} ${nm(root)} is ${nm(mm)}, so ${nm(mm)} melodic minor.`, hints: [`X${chord} = melodic minor ${how} X.`, `${how[0].toUpperCase() + how.slice(1)} ${nm(root)}.`, `It’s some kind of ${nm({ letter: mm.letter, acc: 0 })}.`] }));
  }
  out.push(contrast('dorian-b2', 'phrygian', 'B3'));
  out.push(contrast('lydian-dominant', 'mixolydian', 'B3'));
  out.push(contrast('mixolydian-b6', 'mixolydian', 'B3'));
  out.push(contrast('lydian-augmented', 'lydian', 'B3'));
  return out;
}
function B4() {
  const out = modeSpells('B4', ['half-whole', 'whole-half', 'whole-tone']);
  for (const m of E.MODES.filter((x) => x.fam === 'symmetric')) {
    out.push(card({ id: `B4.name.steps.${m.id}`, module: 'B', unit: 'B4', type: 'name', input: 'choice', choices: ['H W H W H W H W', 'W H W H W H W H', 'W W W W W W'], prompt: `Step pattern of the ${m.name} scale?`, answer: [m.steps], tags: ['symmetric'],
      why: `${m.name}: ${m.steps} — ${m.shortcut.toLowerCase()}.`, hints: ['The name gives the order: half-whole starts with a half step.', `Used over ${m.over}.`, m.steps.slice(0, 1) === 'H' ? 'Starts with a half step.' : 'Starts with a whole step.'] }));
    out.push(card({ id: `B4.name.versions.${m.id}`, module: 'B', unit: 'B4', type: 'name', input: 'choice', choices: ['2', '3', '4', '6', '12'], prompt: `How many distinct ${m.name} scales are there?`, answer: [String(m.versions)], tags: ['symmetric'],
      why: `${m.name} repeats every ${m.versions === 3 ? 'minor 3rd' : 'whole step'}, so there are only ${m.versions}.`, hints: ['12 notes ÷ how often the pattern repeats.', m.versions === 3 ? 'It repeats every minor 3rd (3 semitones).' : 'It repeats every whole step (2 semitones).', `Fewer than 4.`] }));
    out.push(card({ id: `B4.name.over.${m.id}`, module: 'B', unit: 'B4', type: 'name', input: 'choice', choices: ['7♭9, 13♭9', 'dim7', '7♯5, 9♯5', 'maj7♯11'], prompt: `${m.name}: played over which chords?`, answer: [m.over], tags: ['symmetric'],
      why: `${m.name} (${m.f.split(' ').map(E.prettyDeg).join(' ')}) fits ${m.over}.`, hints: ['Look at which chord tones the formula contains.', `Formula: ${m.f.split(' ').map(E.prettyDeg).join(' ')}.`, m.id === 'whole-tone' ? 'It has a ♯5.' : m.id === 'half-whole' ? 'It has ♭9 and a major 3rd.' : 'It has ♭3, ♭5 and 6 (𝄫7).'] }));
  }
  for (let p = 0; p < 12; p++) {
    const root = E.bestRoot(p, (r) => [up(r, 'b3'), up(r, 'b5'), up(r, '6')]);
    const ans = [up(root, 'b3'), up(root, 'b5'), up(root, '6')].map(nm);
    out.push(card({ id: `B4.name.share.${nm(root)}`, module: 'B', unit: 'B4', type: 'name', prompt: `Which three other dominants share ${nm(root)}7’s half-whole scale? (ascending)`, answer: ans, rank: RANK_PC[p], tags: ['symmetric'],
      why: `Half-whole repeats every minor 3rd: ${nm(root)}7, ${ans.join('7, ')}7 share one scale.`, hints: ['The pattern repeats every minor 3rd.', `Up a minor 3rd from ${nm(root)} is ${ans[0]}.`, letterHint(ans)] }));
  }
  out.push(card({ id: 'B4.contrast.altered.half-whole', module: 'B', unit: 'B4', type: 'contrast', input: 'choice', choices: ['Altered has ♭13 and no 5th; half-whole has 13 and a natural 5th', 'Altered has a natural 5th; half-whole has ♭13', 'They differ only in the 9ths', 'Half-whole has no 3rd'], prompt: 'Altered vs half-whole: what differs?', answer: ['Altered has ♭13 and no 5th; half-whole has 13 and a natural 5th'], tags: ['contrast', 'symmetric'],
    why: 'Both have ♭9, ♯9, 3, ♯11 and ♭7; altered adds ♭13 (no 5th), half-whole adds 5 and 13.', hints: ['Write both over the same root.', 'Altered (as a chord): 1 ♭9 ♯9 3 ♯11 ♭13 ♭7.', 'Half-whole: 1 ♭9 ♯9 3 ♯11 5 13 ♭7.'] }));
  return out;
}

function C1() {
  const out = [];
  const ROMS = E.SECONDARY.map((s) => `V7/${s.target}`);
  for (const k of E.MAJOR_KEYS) {
    const key = N(k), rank = rankOf(key);
    const doms = [];
    for (const s of E.SECONDARY) {
      const tgt = up(key, s.td), dom = up(tgt, '5'), outN = up(dom, s.out);
      doms.push(dom);
      const why = `Up a 5th from ${s.target} (${E.csym(tgt, s.tq)}) is ${nm(dom)}: ${E.csym(dom, '7')}. Its ${s.out === '3' ? '3rd' : '♭7'} ${nm(outN)} is the out-of-key note${s.out === '3' ? `, leading to ${nm(tgt)}` : ''}.`;
      const hints = ['Go up a 5th from the target and make it dominant.', `${s.target} in ${nm(key)} is ${E.csym(tgt, s.tq)}.`, `It’s some kind of ${nm({ letter: dom.letter, acc: 0 })}.`];
      out.push(card({ id: `C1.name.V7/${s.target}.${k}`, module: 'C', unit: 'C1', type: 'name', prompt: `V7/${s.target} in ${nm(key)} major?`, answer: [nm(dom)], answerText: E.csym(dom, '7'), rank, tags: ['secondary'], why, hints }));
      out.push(card({ id: `C1.reverse.V7/${s.target}.${k}`, module: 'C', unit: 'C1', type: 'reverse', input: 'choice', choices: ROMS, prompt: `${E.csym(dom, '7')} in ${nm(key)} major is…?`, answer: [`V7/${s.target}`], rank, reverse_of: `C1.name.V7/${s.target}.${k}`, tags: ['secondary'], why: `${E.csym(dom, '7')} resolves down a 5th to ${E.csym(tgt, s.tq)}, the ${s.target}: V7/${s.target} (${s.short}).`, hints: ['Go down a 5th from the dominant: that’s its target.', `Down a 5th from ${nm(dom)} is ${nm(tgt)}.`, `Its target is ${nm(tgt)}.`] }));
      out.push(card({ id: `C1.name.out.V7/${s.target}.${k}`, module: 'C', unit: 'C1', type: 'name', prompt: `Out-of-key note in V7/${s.target} in ${nm(key)}?`, answer: [nm(outN)], rank, tags: ['secondary'], why, hints: [s.out === '3' ? 'It’s the 3rd of the dominant: the leading tone of the target.' : 'V7/IV is the tonic made dominant: the added note is its ♭7.', `V7/${s.target} is ${E.csym(dom, '7')}.`, `It’s some kind of ${nm({ letter: outN.letter, acc: 0 })}.`] }));
    }
    out.push(card({ id: `C1.reeloff.all.${k}`, module: 'C', unit: 'C1', type: 'reeloff', input: 'self', prompt: `All five secondary dominants in ${nm(key)} major (V7/ii → V7/vi)`, answer: doms.map(nm), answerText: doms.map((d) => E.csym(d, '7')).join(' '), rank, tags: ['secondary'],
      why: `${doms.map((d) => E.csym(d, '7')).join(', ')}: VI7, VII7, I7, II7, III7.`, hints: ['VI7, VII7, I7, II7, III7 — the diatonic roots a 5th above each target, made dominant.', `${nm(key)} major: ${list(E.spell(key, 'ionian'))}.`, `Starts ${E.csym(doms[0], '7')}…`] }));
  }
  for (const k of E.MINOR_KEYS) {
    const key = N(k), rank = rankOf(up(key, 'b3'));
    for (const s of E.SECONDARY_MINOR) {
      const tgt = up(key, s.td), dom = up(tgt, '5');
      out.push(card({ id: `C1.name.minor.V7/${s.target}.${k}`, module: 'C', unit: 'C1', type: 'name', prompt: `V7/${s.target} in ${nm(key)} minor?`, answer: [nm(dom)], answerText: E.csym(dom, '7'), rank, tags: ['secondary', 'minor'],
        why: `${s.target} in ${nm(key)} minor is ${nm(tgt)}; up a 5th is ${nm(dom)}: ${E.csym(dom, '7')}.`, hints: ['Same rule in minor: up a 5th from the target, make it dominant.', `${s.target} in ${nm(key)} minor is ${nm(tgt)}.`, `It’s some kind of ${nm({ letter: dom.letter, acc: 0 })}.`] }));
    }
  }
  out.push(card({ id: 'C1.contrast.V7/IV', module: 'C', unit: 'C1', type: 'contrast', input: 'choice', choices: ['Yes: the tonic made dominant points at IV', 'No: C7 is just the tonic', 'Only in a blues', 'Only in minor'], prompt: 'In C major, is C7 a real secondary dominant?', answer: ['Yes: the tonic made dominant points at IV'], tags: ['secondary'],
    why: 'It’s the tonic chord made dominant; the added B♭ points it at F (V7/IV).', hints: ['What does the added ♭7 resolve to?', 'B♭ falls to A, the 3rd of F.', 'Think V7/IV.'] }));
  return out;
}
function C2() {
  const out = [];
  for (const r0 of R12) {
    const root = N(r0), sub = E.tritoneSub(root), res = down(root, 'b2');
    out.push(card({ id: `C2.name.sub.${r0}`, module: 'C', unit: 'C2', type: 'name', prompt: `Tritone sub of ${E.csym(root, '7')}?`, answer: [nm(sub)], answerText: E.csym(sub, '7'), accept: [[nm(E.N(['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'][E.pc(sub)]))]], rank: rankOf(root), tags: ['tritone'],
      why: `${E.csym(root, '7')} has ${E.guideTones(root, '7').map(nm).join(' and ')}; ${E.csym(sub, '7')} has ${E.guideTones(sub, '7').map(nm).join(' and ')} — the same pair, swapped.`, hints: ['The root a tritone (♭5) away; the roots sit opposite on the pitch clock.', `Guide tones of ${E.csym(root, '7')}: ${E.guideTones(root, '7').map(nm).join(', ')}.`, `It’s some kind of ${nm({ letter: sub.letter, acc: 0 })}.`] }));
    out.push(card({ id: `C2.name.res.${r0}`, module: 'C', unit: 'C2', type: 'name', prompt: `As a tritone sub, where does ${E.csym(root, '7')} resolve?`, answer: [nm(res)], accept: [[nm(E.N(['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'][E.pc(res)]))]], rank: rankOf(root), tags: ['tritone'],
      traps: [{ answer: [nm(down(root, '5'))], msg: `The sub resolves down a semitone: ${E.csym(root, '7')} goes to ${nm(res)}.` }],
      why: `A tritone sub resolves down a semitone: ${E.csym(root, '7')} → ${nm(res)}.`, hints: ['Down a semitone, not down a 5th.', `It stands in for the V7 of ${nm(res)}.`, `It’s some kind of ${nm({ letter: res.letter, acc: 0 })}.`] }));
  }
  for (const k of E.MAJOR_KEYS) {
    const key = N(k), v = up(key, '5'), vv = up(key, '2'), subV = E.tritoneSub(v), subVV = E.tritoneSub(vv);
    out.push(card({ id: `C2.name.subV.${k}`, module: 'C', unit: 'C2', type: 'name', prompt: `subV7 in ${nm(key)} major?`, answer: [nm(subV)], answerText: E.csym(subV, '7'), rank: rankOf(key), tags: ['tritone'],
      why: `V7 is ${E.csym(v, '7')}; a tritone away is ${E.csym(subV, '7')}, resolving down a semitone to ${nm(key)}.`, hints: ['Find V7, then the root a tritone away.', `V7 in ${nm(key)} is ${E.csym(v, '7')}.`, `A semitone above ${nm(key)}.`] }));
    out.push(card({ id: `C2.name.subVV.${k}`, module: 'C', unit: 'C2', type: 'name', prompt: `subV7/V in ${nm(key)} major?`, answer: [nm(subVV)], answerText: E.csym(subVV, '7'), rank: rankOf(key), tags: ['tritone'],
      why: `V7/V is ${E.csym(vv, '7')}; its sub is ${E.csym(subVV, '7')}, resolving down a semitone to ${E.csym(v, '7')}.`, hints: ['Find V7/V (up a 5th from V), then the tritone sub.', `V7/V in ${nm(key)} is ${E.csym(vv, '7')}.`, `A semitone above ${nm(v)}.`] }));
  }
  out.push(card({ id: 'C2.reeloff.pairs', module: 'C', unit: 'C2', type: 'reeloff', input: 'self', prompt: 'The six tritone pairs', answer: ['C7↔G♭7', 'G7↔D♭7', 'D7↔A♭7', 'A7↔E♭7', 'E7↔B♭7', 'B7↔F7'], tags: ['tritone'],
    why: 'C7↔G♭7, G7↔D♭7, D7↔A♭7, A7↔E♭7, E7↔B♭7, B7↔F7.', hints: ['Go round the circle from C clockwise; each partner is opposite.', 'C–G♭, G–D♭…', 'C7↔G♭7, G7↔D♭7…'] }));
  return out;
}
function C3() {
  const out = [];
  const ROMS = E.BORROW_MAJOR.map((b) => b.r);
  const SRC = ['Aeolian', 'Aeolian or Dorian', 'Mixolydian', 'Mixolydian or Dorian', 'Phrygian', 'Lydian', 'Dorian', 'harmonic minor'];
  for (const k of E.MAJOR_KEYS) {
    const key = N(k), rank = rankOf(key), rel = up(key, '6');
    for (const b of E.BORROW_MAJOR) {
      const r = up(key, b.d);
      const traps = [];
      if (b.r === '♭VII7') traps.push({ answer: [nm(up(key, '5'))], msg: `That’s V7. The backdoor dominant is ♭VII7, borrowed from ${nm(key)} Aeolian; it resolves UP a whole step to I.` });
      try { const relWrong = up(rel, b.d); if (!E.same(relWrong, r)) traps.push({ answer: [nm(relWrong)], msg: `Borrowing from the relative minor: interchange borrows from the PARALLEL key (${nm(key)} minor), not ${nm(rel)} minor.` }); } catch (e) { /* */ }
      const label = b.name ? `${b.name} (${b.r})` : b.r;
      out.push(card({ id: `C3.name.${b.r}.${k}`, module: 'C', unit: 'C3', type: 'name', prompt: `${label} in ${nm(key)} major?`, answer: [nm(r)], answerText: `${E.csym(r, b.q)} · from ${nm(key)} ${b.src}`, rank, traps, tags: ['interchange'],
        why: `${b.r} borrows from ${nm(key)} ${b.src}: ${E.csym(r, b.q)} (typical move ${b.move}).`, hints: ['Same tonic, darker (or brighter) mode: read the numeral against the major scale.', `${nm(key)} ${b.src.split(' ')[0]}: ${list(E.spell(key, b.src.split(' ')[0].toLowerCase() === 'aeolian' ? 'aeolian' : b.src.split(' ')[0].toLowerCase()))}.`, `It’s some kind of ${nm({ letter: r.letter, acc: 0 })}.`] }));
      out.push(card({ id: `C3.reverse.${b.r}.${k}`, module: 'C', unit: 'C3', type: 'reverse', input: 'choice', choices: ROMS, prompt: `In ${nm(key)} major, ${E.csym(r, b.q)} is…?`, answer: [b.r], rank, reverse_of: `C3.name.${b.r}.${k}`, tags: ['interchange'],
        why: `${E.csym(r, b.q)} is ${b.r}, borrowed from ${nm(key)} ${b.src}.`, hints: ['Measure the root against the major scale of the tonic, then check the quality.', `${nm(r)} is a ${E.intervalName(key, r)} above ${nm(key)}.`, `The quality is ${CHORD_LABEL(b.q)}.`] }));
    }
  }
  for (const b of E.BORROW_MAJOR) out.push(card({ id: `C3.name.src.${b.r}`, module: 'C', unit: 'C3', type: 'name', input: 'choice', choices: SRC.slice(0, 6), prompt: `Which parallel mode gives ${b.r}?`, answer: [b.src], tags: ['interchange'],
    why: `${b.r} comes from ${b.src} (${b.move}).`, hints: ['Which altered degree does the chord need? Find the brightest mode that has it.', `The chord needs: ${b.d.replace('b', '♭')} as its root${b.q === '7' && b.d === '2' ? ' and a ♯4 as its 3rd' : ''}.`, b.src.startsWith('A') ? 'A dark mode.' : 'Not Aeolian.'] }));
  for (const k of E.MINOR_KEYS) {
    const key = N(k), rank = rankOf(up(key, 'b3'));
    for (const b of E.BORROW_MINOR) {
      const r = up(key, b.d);
      out.push(card({ id: `C3.name.minor.${b.r}.${k}`, module: 'C', unit: 'C3', type: 'name', prompt: `${b.r} in ${nm(key)} minor (from ${b.src})?`, answer: [nm(r)], answerText: E.csym(r, b.q), rank, tags: ['interchange', 'minor'],
        why: `${E.csym(r, b.q)}, borrowed from ${nm(key)} ${b.src}: ${b.move}.`, hints: ['Same tonic, different mode.', `${b.r} is a ${E.intervalName(key, r)} above ${nm(key)}.`, `It’s some kind of ${nm({ letter: r.letter, acc: 0 })}.`] }));
    }
  }
  out.push(card({ id: 'C3.contrast.backdoor', module: 'C', unit: 'C3', type: 'contrast', input: 'choice', choices: ['Borrowed from C Aeolian (backdoor)', 'A secondary dominant (V7 of something)', 'A tritone sub of G7', 'Diatonic to C major'], prompt: 'B♭7 resolving to Cmaj7 in C major is…?', answer: ['Borrowed from C Aeolian (backdoor)'], tags: ['interchange', 'contrast'],
    why: 'B♭7 in C resolves up a whole step to I; it’s borrowed from Aeolian, not V of anything diatonic.', hints: ['Where would B♭7 resolve as a V7?', 'E♭ is not diatonic to C major.', 'Think parallel minor.'] }));
  return out;
}

const GT_QUALS = ['maj7', '7', 'm7', 'm7b5', 'mMaj7', 'dim7'];
function D1() {
  const out = [];
  for (const q of GT_QUALS) for (let p = 0; p < 12; p++) {
    const root = E.bestRoot(p, (r) => E.guideTones(r, q));
    const gt = E.guideTones(root, q).map(nm);
    out.push(card({ id: `D1.name.gt.${q}.${nm(root)}`, module: 'D', unit: 'D1', type: 'name', prompt: `Guide tones of ${E.csym(root, q)}? (3rd, then 7th)`, answer: gt, rank: RANK_PC[p], tags: ['guide-tones'],
      why: `${E.csym(root, q)}: 3rd ${gt[0]} (${E.prettyDeg(E.third(q))}), 7th ${gt[1]} (${E.prettyDeg(E.seventh(q))}).`, hints: [`${CHORD_LABEL(q)} = 3rd ${E.prettyDeg(E.third(q))}, 7th ${E.prettyDeg(E.seventh(q))}.`, `${nm(root)} major: ${list(E.spell(root, 'ionian'))}.`, `Starts ${gt[0]}…`] }));
  }
  for (const r0 of ['C', 'G', 'D', 'A', 'E', 'B']) {
    const a = N(r0), b = E.tritoneSub(a), gt = E.guideTones(a, '7');
    out.push(card({ id: `D1.reverse.tt.${r0}`, module: 'D', unit: 'D1', type: 'reverse', prompt: `${gt.map(nm).join(' and ')} are the guide tones of which two dominants?`, answer: [nm(a), nm(b)], accept: [[nm(b), nm(a)], [nm(a), nm(E.N(['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'][E.pc(b)]))]], answerText: `${E.csym(a, '7')} and ${E.csym(b, '7')}`, rank: rankOf(a), tags: ['guide-tones', 'tritone'],
      why: `${nm(gt[0])} is the 3rd of ${E.csym(a, '7')} and the 7th of ${E.csym(b, '7')}; ${nm(gt[1])} the other way round.`, hints: ['A tritone is the 3rd and 7th of two dominants a tritone apart.', `If ${nm(gt[0])} is the 3rd, the root is a M3 below.`, `One is ${nm(a)}7.`] }));
  }
  const BETWEEN = { maj7: 'Perfect 5th', 7: 'Tritone', m7: 'Perfect 5th', m7b5: 'Perfect 5th', mMaj7: 'Augmented 5th', dim7: 'Tritone' };
  for (const q of GT_QUALS) out.push(card({ id: `D1.name.between.${q}`, module: 'D', unit: 'D1', type: 'name', input: 'choice', choices: ['Perfect 5th', 'Tritone', 'Augmented 5th', 'Major 6th'], prompt: `Interval from the 3rd up to the 7th of a ${CHORD_LABEL(q)} chord?`, answer: [BETWEEN[q]], tags: ['guide-tones'],
    why: `${CHORD_LABEL(q)}: ${E.prettyDeg(E.third(q))} up to ${E.prettyDeg(E.seventh(q))} is a ${BETWEEN[q].toLowerCase()}.`, hints: ['Only the dominant (and dim7) has a tritone between its guide tones.', `In C: ${E.guideTones(N('C'), q).map(nm).join(' up to ')}.`, BETWEEN[q] === 'Tritone' ? 'It’s the unstable one.' : 'Not a tritone.'] }));
  return out;
}
function D2() {
  const out = [];
  for (const k of E.MAJOR_KEYS) {
    const key = N(k), ii = up(key, '2'), v = up(key, '5'), [t2, s2] = E.guideTones(ii, 'm7'), [t5, s5] = E.guideTones(v, '7');
    const why = `${E.csym(ii, 'm7')} (${nm(t2)}, ${nm(s2)}) → ${E.csym(v, '7')} (${nm(s5)}, ${nm(t5)}): the 7th ${nm(s2)} falls to ${nm(t5)}; the 3rd ${nm(t2)} holds as the 7th.`;
    const hints = ['7th falls a step to the next 3rd; 3rd holds as the next 7th.', `Guide tones of ${E.csym(ii, 'm7')}: ${nm(t2)}, ${nm(s2)}.`, `Look at ${nm(s2)}.`];
    out.push(card({ id: `D2.name.falls.${k}`, module: 'D', unit: 'D2', type: 'name', prompt: `ii–V–I in ${nm(key)}: what does the 7th of ${E.csym(ii, 'm7')} become?`, answer: [nm(t5)], rank: rankOf(key), tags: ['ii-V-I'], why, hints,
      traps: [{ answer: [nm(s2)], msg: 'Down a 5th, the 7th falls a step: it becomes the 3rd of the V.' }] }));
    out.push(card({ id: `D2.name.holds.${k}`, module: 'D', unit: 'D2', type: 'name', prompt: `Which note holds from ${E.csym(ii, 'm7')} to ${E.csym(v, '7')}?`, answer: [nm(t2)], rank: rankOf(key), tags: ['ii-V-I'], why, hints: [hints[0], hints[1], `Look at ${nm(t2)}.`],
      traps: [{ answer: [nm(s2)], msg: 'Down a 5th, one note always holds: the 3rd becomes the next 7th. The 7th moves.' }] }));
    const [t1] = E.guideTones(key, 'maj7');
    out.push(card({ id: `D2.name.vi.${k}`, module: 'D', unit: 'D2', type: 'name', prompt: `ii–V–I in ${nm(key)}: what does the 7th of ${E.csym(v, '7')} become?`, answer: [nm(t1)], rank: rankOf(key), tags: ['ii-V-I'],
      traps: [{ answer: [nm(s5)], msg: 'The 7th of V falls a step to the 3rd of I.' }],
      why: `${E.csym(v, '7')}’s 7th ${nm(s5)} falls a step to ${nm(t1)}, the 3rd of ${E.csym(key, 'maj7')}; its 3rd ${nm(t5)} holds as the maj7.`, hints: ['7th falls, 3rd holds — again.', `Guide tones of ${E.csym(v, '7')}: ${nm(t5)}, ${nm(s5)}.`, `Look at ${nm(s5)}.`] }));
  }
  return out;
}
function D3() {
  const out = [];
  for (const prog of E.PROGS) for (const k of (prog.minor ? E.MINOR_KEYS.map((x) => x) : E.MAJOR_KEYS)) {
    const key = N(k), g = E.guideLines(key, prog);
    const chords = g.chords.map((c) => E.csym(c.root, c.q)).join('–');
    const a = g.A.map(nm), b = g.B.map(nm);
    out.push(card({ id: `D3.reeloff.${prog.id}.${k}`, module: 'D', unit: 'D3', type: 'reeloff', input: 'self', prompt: `${prog.name} in ${nm(key)}${prog.minor ? ' minor' : ''}, both lines (${chords})`, answer: [...a, ...b], accept: [[...b, ...a]], answerText: `${a.join(' → ')}  |  ${b.join(' → ')}`, rank: prog.minor ? rankOf(up(key, 'b3')) : rankOf(key), tags: ['guide-tones', prog.id],
      why: `Line A ${a.join(' → ')}; line B ${b.join(' → ')}.`, hints: [prog.id === 'ii-subV-I' ? 'The tritone sub leaves both lines exactly as in ii–V–I.' : prog.id === 'cycle' ? 'Two chromatic lines falling side by side.' : prog.id === 'blues' ? 'Both guide tones fall a semitone from I7 to IV7.' : '7th falls, 3rd holds.', `${g.chords.map((c) => `${E.csym(c.root, c.q)}: ${E.guideTones(c.root, c.q).map(nm).join(', ')}`).join(' · ')}.`, `Line A starts ${a[0]} → ${a[1]}…`] }));
  }
  return out;
}

// ---------- E: superimposition ----------
const QSYM = { maj: 'maj7', dom: '7', min: 'm7', half: 'm7♭5', mmaj: 'm(maj7)', dim: '°7' };
const SI_SEMIS = { 1: 0, b2: 1, 2: 2, b3: 3, 3: 4, 4: 5, b5: 6, '#4': 6, 5: 7, b6: 8, 6: 9, b7: 10, 7: 11 };
// the structure's root spelled by interval, unless that spelling needs double sharps or flats inside the shape;
// then the enharmonic root wins and the interval spelling is still accepted
function siRoot(chordRoot, iv, item, k) {
  let byIv = null;
  try { byIv = E.up(chordRoot, iv); } catch (e) { /* triple accidental */ }
  const dbl = (r) => SI.structure(r, k, { ...item, iv: '1' }).notes.reduce((s, n) => s + (Math.abs(n.acc) > 1 ? 1 : 0), 0) + (Math.abs(r.acc) > 1 ? 1 : 0);
  const best = E.bestRoot((E.pc(chordRoot) + SI_SEMIS[iv]) % 12, (r) => SI.structure(r, k, { ...item, iv: '1' }).notes);
  if (byIv && dbl(byIv) <= dbl(best)) return { sr: byIv, alt: E.same(byIv, best) ? null : best };
  return { sr: best, alt: byIv };
}
const isTri = (it) => it.shape === 'maj' || it.shape === 'min';
function siCards(unit, tri) {
  const out = [];
  for (const k of SI.MENU_KEYS) {
    const m = SI.menu(k);
    const items = m.items.filter((it) => tri === isTri(it));
    if (!items.length) continue;
    const addChoices = [...new Set(m.items.map((it) => SI.tensionsOf(k, it).join(' ')))];
    const nameChoices = [...new Set(items.map((x) => `${x.deg} ${SI.shapeName(x.shape)}`))];
    for (const it of items) {
      const tens = SI.tensionsOf(k, it).join(' ');
      const nmShape = SI.shapeName(it.shape);
      const tag = `${k}.${it.iv}.${it.shape}`;
      const inC = SI.structure('C', k, it);
      out.push(card({ id: `${unit}.name.adds.${tag}`, module: 'E', unit, type: 'name', input: 'choice', choices: addChoices,
        prompt: `Over a ${m.label} chord, the ${it.deg} ${nmShape} adds…?`, answer: [tens], tags: ['superimposition', k],
        why: `${it.deg} ${nmShape} over ${m.label}: ${tens} → ${it.result} (${it.scale}). ${it.why}`,
        hints: [`Count from the chord root to the ${it.deg}, then read each note against the chord root.`, `Over C${QSYM[k]} that is the ${inC.name}: ${inC.names.join(' ')}.`, `Starts ${tens.split(' ')[0]}…`] }));
      if (nameChoices.length > 1) out.push(card({ id: `${unit}.reverse.sound.${tag}`, module: 'E', unit, type: 'reverse', input: 'choice', choices: nameChoices,
        prompt: `Over a ${m.label} chord you want ${it.result} (${it.scale}). Play which ${tri ? 'triad' : 'pentatonic'}?`, answer: [`${it.deg} ${nmShape}`], reverse_of: `${unit}.name.adds.${tag}`, tags: ['superimposition', k],
        why: `${it.deg} ${nmShape}: ${tens} over the chord. ${it.why}`,
        hints: [`Which notes does ${it.result} add? Find the ${tri ? 'triad' : 'pentatonic'} that contains them.`, `It adds ${tens}.`, `It is built on the ${it.deg}.`] }));
      for (const r of R12) {
        const cr = N(r);
        const { sr, alt } = siRoot(cr, it.iv, it, k);
        const st = SI.structure(r, k, it);
        const names = SI.structure(sr, k, { ...it, iv: '1' }).names;
        const chordName = `${nm(cr)}${QSYM[k]}`;
        out.push(card({ id: `${unit}.name.key.${tag}.${r}`, module: 'E', unit, type: 'name', prompt: `Over ${chordName} you want the ${it.result} sound. Which ${tri ? (it.shape === 'min' ? 'minor triad' : 'major triad') : nmShape} — on what note?`, answer: [nm(sr)], accept: alt ? [[nm(alt)]] : [],
          answerText: `${names.join(' ')} = ${st.tensions.join(' ')} over ${chordName}`, rank: rankOf(cr), tags: ['superimposition', k, 'keys'],
          why: `The ${it.deg} of ${nm(cr)} is ${nm(sr)}; ${names.join(' ')} over ${chordName} reads ${tens} (${it.result}).`,
          hints: [`${it.result} over a ${m.label}: the ${it.deg} ${nmShape}.`, `The ${it.deg} is ${it.iv.replace('b', '♭')} above ${nm(cr)}.`, `Starts on the letter ${'CDEFGAB'[sr.letter]}…`] }));
      }
    }
    out.push(card({ id: `${unit}.reeloff.menu.${k}`, module: 'E', unit, type: 'reeloff', input: 'self', prompt: `${tri ? 'Triads' : 'Pentatonics'} over a ${m.label} chord: each one and what it adds`,
      answer: items.map((it) => `${it.deg} ${SI.shapeName(it.shape)} → ${SI.tensionsOf(k, it).join(' ')}`),
      answerText: items.map((it) => `${it.deg} ${SI.shapeName(it.shape)}: ${SI.tensionsOf(k, it).join(' ')} (${it.result})`).join(' · '), tags: ['superimposition', k],
      why: `The ${m.label} menu: ${items.map((it) => `${it.deg} → ${it.result}`).join(', ')}.`, hints: ['Start with the most inside option, then get brighter or more tense.', `There are ${items.length}.`, `First: ${items[0].deg} ${SI.shapeName(items[0].shape)}.`] }));
  }
  if (tri) {
    out.push(card({ id: 'E1.contrast.VI-bVI', module: 'E', unit, type: 'contrast', input: 'choice', choices: ['VI gives 13 ♭9 3; ♭VI gives ♭13 1 ♯9', 'They are the same notes', 'VI is altered; ♭VI is Lydian dominant', 'VI gives 9 ♯11 13; ♭VI gives ♭9 3 5'],
      prompt: 'Over a dominant: VI major triad vs ♭VI major triad — the difference?', answer: ['VI gives 13 ♭9 3; ♭VI gives ♭13 1 ♯9'], tags: ['superimposition', 'contrast'],
      why: 'VI (A over C7) is the bright 13♭9 sound of half-whole diminished; ♭VI (A♭ over C7) is the dark altered sound.', hints: ['Spell both over C7.', 'A C♯ E vs A♭ C E♭.', 'One has the natural 13…'] }));
    out.push(card({ id: 'E1.contrast.II-bV', module: 'E', unit, type: 'contrast', input: 'choice', choices: ['II keeps the 13 (Lydian dominant); ♭V has the ♭9 (altered)', 'Both are altered', 'II has ♭9; ♭V has 13', 'They share all three notes'],
      prompt: 'Over a dominant: II triad vs ♭V triad — the difference?', answer: ['II keeps the 13 (Lydian dominant); ♭V has the ♭9 (altered)'], tags: ['superimposition', 'contrast'],
      why: 'D over C7 is 9 ♯11 13 (Lydian dominant). G♭ over C7 is ♯11 ♭7 ♭9: the tritone sub’s triad, an altered sound.', hints: ['Spell both over C7.', 'D F♯ A vs G♭ B♭ D♭.', 'Look for the ♭9.'] }));
  } else {
    out.push(card({ id: 'E2.contrast.dorian-alt', module: 'E', unit, type: 'contrast', input: 'choice', choices: ['ii minor pentatonic over m7 (Dorian); ♭iii minor pentatonic over 7 (altered)', 'Both are Dorian', 'Both are altered', 'ii over 7 is altered; ♭iii over m7 is Dorian'],
      prompt: 'Minor pentatonic a step up vs a minor 3rd up: where does each go?', answer: ['ii minor pentatonic over m7 (Dorian); ♭iii minor pentatonic over 7 (altered)'], tags: ['superimposition', 'contrast'],
      why: 'Dm pentatonic over Cm7 = 9 11 5 13 1 (Dorian). E♭m pentatonic over C7 = ♯9 ♯11 ♭13 ♭7 ♭9 (altered).', hints: ['Spell both over C.', 'D F G A C and E♭ G♭ A♭ B♭ D♭.', 'Which one has ♭9 and ♯9?'] }));
  }
  return out;
}
function E1() { return siCards('E1', true).map((c) => ({ ...c, requires: ['B3'] })); }
function E2() { return siCards('E2', false).map((c) => ({ ...c, requires: ['E1'] })); }

export function buildDeck() {
  const deck = [...A1(), ...A1ext(), ...A2(), ...A3(), ...A4(), ...A5(), ...B1(), ...B2(), ...B3(), ...B4(), ...C1(), ...C2(), ...C3(), ...D1(), ...D2(), ...D3(), ...E1(), ...E2()];
  // default requires: the previous unit
  const order = UNITS.map((u) => u.id);
  for (const c of deck) if (!c.requires.length) { const i = order.indexOf(c.unit); c.requires = i > 0 ? [order[i - 1]] : []; }
  return deck;
}
