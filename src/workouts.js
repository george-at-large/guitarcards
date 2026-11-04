// Workouts: fixed runs of cards that build on each other (warm-up → core → application → speed).
// `params` pins a card's parameters for that step (others still adapt).
export const WORKOUTS = [
  {
    id: 'arpeggios', name: 'Arpeggio workout', minutes: 30,
    blurb: 'Triads → inversions → 7ths across the neck → inverted 7th arpeggios → transformations → extensions → in a tune → speed.',
    steps: [
      { id: 'scl-arp-triads-caged', why: 'Warm-up: triad arpeggios in one shape.' },
      { id: 'scl-arp-inversions-string-sets', why: 'Triad arpeggios from every inversion (start on the 3rd and 5th, not just the root).' },
      { id: 'scl-arp-7ths-caged', why: '7th-chord arpeggios in a position.' },
      { id: 'scl-arp-7ths-connect', why: 'The same arpeggio across the whole neck.' },
      { id: 'voi-drop2-inversion-arpeggio', why: 'Inverted 7th arpeggios: strum each drop-2 inversion, then arpeggiate it.' },
      { id: 'scl-arp-7th-morph', why: 'Transform the chord one note at a time: maj7 → 7 → m7 → m7♭5 → °7.' },
      { id: 'scl-arp-sub-maj7-from-3', why: 'Extensions: the arpeggio from the 3rd gives you the 9.' },
      { id: 'scl-arp-one-string', why: 'One string: see the arpeggio as distances, not boxes.' },
      { id: 'har-imp-arpeggios-blues', why: 'Use it: chord tones through a jazz blues.' },
      { id: 'arp-speed-ladder', why: 'Finisher: speed ladder with a click.' },
    ],
  },
  {
    id: 'minor-chord-scales', name: 'Minor-key chord scales', minutes: 25,
    blurb: 'The chord scales you need in minor keys: natural, harmonic and melodic minor — triads, then drop 2, then drop 3, then in a ii–V–i.',
    steps: [
      { id: 'mi-palette-triads', params: { mode: 'aeolian' }, why: 'Natural minor triads against the major key (i, ♭III, iv, ♭VI, ♭VII).' },
      { id: 'voi-triad-chord-scale-minor-modalities', params: { scale: 'harmonic-minor' }, why: 'Harmonic minor triads: the major V and the augmented ♭III+.' },
      { id: 'voi-triad-chord-scale-minor-modalities', params: { scale: 'melodic-minor' }, why: 'Melodic minor triads: major IV and V, two diminished.' },
      { id: 'voi-cs-harmonic-minor-drop2', why: 'Harmonic minor 7th chords in drop 2: i(maj7), iiø7, ♭III+maj7, iv7, V7, ♭VImaj7, vii°7.' },
      { id: 'voi-cs-melodic-minor-drop2', why: 'Melodic minor 7th chords in drop 2: i(maj7), ii7, ♭III+maj7, IV7, V7, viø7, viiø7.' },
      { id: 'mi-palette-7ths', params: { mode: 'aeolian' }, why: 'Natural minor 7ths — the borrowed-chord palette.' },
      { id: 'voi-cs-minor-modalities-drop3', why: 'The same in drop 3.' },
    ],
  },
];
WORKOUTS.splice(1, 0, {
  id: 'guide-tones', name: 'Guide tones workout', minutes: 30,
  blurb: 'The 3rds and 7ths that carry the harmony: understand them, grip them as shells, connect them as lines, comp with them, then solo by landing on them.',
  steps: [
    { id: 'voi-shell-shape', why: 'Shell grips: root + 3rd + 7th on the low strings.' },
    { id: 'voi-shell-ii-V-I', why: 'Shells through ii–V–I: hear the 7th fall to the next 3rd.' },
    { id: 'voi-guide-tones-ii-V-I', why: 'Guide-tone lines: just the two moving voices.' },
    { id: 'har-comp-guide-tones', why: 'Comp with two-note guide tones.' },
    { id: 'voi-shell-dominant-cycle', why: 'Dominant shells round the cycle of 4ths.' },
    { id: 'har-comp-blues-shells-gap', why: 'Shell comping on a blues, with a gap click.' },
    { id: 'har-imp-target-3rds', why: 'Solo: land on the 3rd of each chord.' },
    { id: 'har-imp-guide-tone-line', why: 'Solo along a guide-tone line through an Autumn Leaves cycle.' },
    { id: 'har-imp-enclosures', why: 'Decorate the target guide tone with an enclosure.' },
    { id: 'voi-shell-plus-tension', why: 'Add one tension on top of the shell (9, ♭9, ♯9, 13).' },
  ],
});
WORKOUTS.unshift({
  id: 'daily', name: 'Daily practice', minutes: 25,
  blurb: 'A balanced session of the essentials — technique, time, fretboard, arpeggios, voice leading, guide tones, modes, the cycle and ear — different cards every day.',
  steps: [
    { pool: ['rhy-pick-alt-8ths', 'rhy-pick-alt-16ths', 'rhy-pick-alt-triplets', 'arp-speed-ladder'], why: 'Warm-up: picking hand.' },
    { pool: ['rhy-16ths-muted', 'rhy-triplets-intro', 'rhy-triplet-accent-shift', 'rhy-8ths-accent-offbeats', 'rhy-blues-shuffle-strum'], why: 'Time: subdivisions and feel.' },
    { pool: ['scl-fb-find-note-neck', 'scl-fb-note-on-fret-all', 'scl-fb-find-note-position'], why: 'Fretboard: know every note.' },
    { pool: ['scl-arp-7ths-caged', 'scl-arp-inversions-string-sets', 'voi-drop2-inversion-arpeggio', 'scl-arp-7ths-connect'], why: 'Arpeggios.' },
    { pool: ['voi-drop2-ii-V-I', 'voi-triad-I-vi-ii-V', 'voi-drop2-minor-ii-V-i', 'har-diatonic-cycle-4ths'], why: 'Voice leading through changes.' },
    { pool: ['voi-guide-tones-ii-V-I', 'har-imp-target-3rds', 'har-comp-guide-tones', 'har-imp-guide-tone-line'], why: 'Guide tones.' },
    { pool: ['improv-rip-it', 'scl-journey-light-to-dark', 'scl-journey-parent-loop', 'scl-neck-interval-tracking'], why: 'Modes and the whole neck.' },
    { pool: ['cyc4-chords', 'cyc4-ii-v-i', 'cyc4-dominant-chain'], why: 'The cycle of fourths.' },
    { pool: ['ear-prog-cadences-major', 'ear-prog-pop-loops', 'ear-prog-drill-diatonic', 'ear-prog-cadences-minor'], why: 'Ear: hear the progression.' },
  ],
});
WORKOUTS.splice(3, 0, {
  id: 'voice-leading', name: 'Voice leading workout', minutes: 30,
  blurb: 'Move between chords with the smallest motion: nearest triads, shells, guide tones, drop 2 through ii–V–I in major and minor, line clichés, the cycle of 4ths, and a melody on top.',
  steps: [
    { id: 'voi-triad-I-IV-V-nearest', why: 'Nearest triads: I–IV–V–I without jumping.' },
    { id: 'voi-triad-I-vi-ii-V', why: 'Triad turnaround, voice-led.' },
    { id: 'voi-triad-key-cycle-voice-led', why: 'Triads round the cycle of 4ths in one position.' },
    { id: 'voi-shell-ii-V-I', why: 'Shells through ii–V–I.' },
    { id: 'voi-guide-tones-ii-V-I', why: 'Just the moving voices: 7th falls to 3rd.' },
    { id: 'voi-drop2-ii-V-I', why: 'Drop 2 ii–V–I: one voice moves at a time.' },
    { id: 'voi-drop2-minor-ii-V-i', why: 'The same in minor.' },
    { id: 'voi-drop2-line-cliche', why: 'Line cliché: one voice walks down chromatically.' },
    { id: 'har-diatonic-cycle-4ths', why: 'Diatonic cycle of 4ths in drop 2.' },
    { id: 'voi-cycle-4-5-drop2', why: 'Goodrick/Miller cycle 4 and 5 drills.' },
    { id: 'har-comp-top-voice-melody', why: 'Make the top voice a melody (Ted Greene).' },
  ],
});
import { RB_QUALITIES } from '../content/barnby.js';
WORKOUTS.splice(2, 0, {
  id: 'barnby', name: 'Robbie Barnby arpeggio workout', minutes: 60,
  blurb: 'Three-octave arpeggios through all 12 keys for every essential quality, then the substitution sounds and the chromatic ladder.',
  steps: [
    ...RB_QUALITIES.map((q) => ({ id: 'rb-cycle', params: { quality: q.v }, why: `${q.label}: three octaves, all 12 keys. ${q.tip}` })),
    { id: 'rb-other-sounds', why: 'The same shapes as other chords (Cmaj7 = Am9, C°(maj7) = D13♭9…).' },
    { id: 'rb-chromatic', why: 'Chromatic ladder: up in E, down in F, up in F♯…' },
  ],
});
WORKOUTS.splice(1, 0, {
  id: 'drops', name: 'Drop voicings: one chord, all of it', minutes: 25,
  blurb: 'One chord (say F m7), the whole neck: triad, arpeggio, every drop-2 and drop-3 inversion, tapped, mapped, in time.',
  // every step uses the same root and quality, picked when the workout starts
  oneChord: ['maj7', 'm7', '7', 'm7b5'],
  steps: [
    { id: 'drops-tap-triads', params: { voicing: 'close' }, why: 'Warm-up: the triad inside the chord, any inversion.' },
    { id: 'scl-arp-7ths-caged', why: 'The arpeggio in one shape: say each interval as you play it.' },
    { id: 'drops-tap', params: { voicing: 'drop2' }, why: 'Drop 2: find this inversion and tap it.' },
    { id: 'drops-tap', params: { voicing: 'drop2' }, why: 'Drop 2: another inversion / string set.' },
    { id: 'drops-all-inversions-map', params: { voicing: 'drop2' }, why: 'Every drop-2 inversion on every string set, then check the map.' },
    { id: 'voi-drop2-inversion-arpeggio', why: 'Strum each inversion, then arpeggiate it.' },
    { id: 'voi-drop2-inversion-rhythm-ladder', why: 'Lock them in time: whole → half → quarter → 8ths.' },
    { id: 'drops-tap', params: { voicing: 'drop3' }, why: 'Drop 3: bass, skip a string, three strings.' },
    { id: 'drops-tap', params: { voicing: 'drop3' }, why: 'Drop 3: another inversion.' },
    { id: 'drops-all-inversions-map', params: { voicing: 'drop3' }, why: 'Every drop-3 inversion, then the map.' },
    { id: 'scl-arp-7ths-connect', why: 'Finish: the arpeggio across the whole neck.' },
  ],
});
WORKOUTS.splice(5, 0, {
  id: 'melodic-minor-cs', name: 'Melodic minor chord scales', minutes: 25,
  blurb: 'The chords of melodic minor — i(maj7) ii7 ♭III+maj7 IV7 V7 viø7 viiø7 — as triads, drop 2 and drop 3, with what each chord is used for.',
  steps: [
    { id: 'voi-triad-chord-scale-minor-modalities', params: { scale: 'melodic-minor' }, why: 'Triads of melodic minor: i ii ♭III+ IV V vi° vii°.' },
    { id: 'voi-cs-melodic-minor-drop2', why: 'Drop-2 7th chords of melodic minor up the neck.' },
    { id: 'mi-palette-7ths', params: { mode: 'melodic-minor' }, why: 'Melodic minor against the major key: what changed and what each chord does.' },
    { id: 'voi-cs-minor-modalities-drop3', params: { scale: 'melodic-minor' }, why: 'The same in drop 3.' },
    { id: 'voi-cs-play-and-arpeggiate', params: { scale: 'melodic-minor' }, why: 'Play each chord, then arpeggiate it.' },
    { id: 'scl-arp-diatonic-7ths-minor-families', params: { scale: 'melodic-minor' }, why: 'The 7th arpeggios of melodic minor in a 3nps position.' },
  ],
});
// how essential a card is for real playing: multiplies its chance of coming up in mixed sessions (likes boost further)
export const ESSENTIAL = {
  'ii-v-i': 1.5, 'minor-ii-v-i': 1.4, triads: 1.3, arpeggios: 1.3, drop2: 1.3, inversions: 1.3, 'cycle-of-fourths': 1.4,
  'chord-tones': 1.3, 'voice-leading': 1.4, 'guide-tones': 1.5, shells: 1.4, 'guide-tone': 1.5, targeting: 1.3, 'melodic-minor': 1.2, 'harmonic-minor': 1.2, comping: 1.2, 'deep-dive': 1.2,
  'parallel-modes': 0.7, 'modal-interchange': 0.85, quartal: 0.8, 'harmonic-major': 0.6, 'drop24': 0.7, drop23: 0.6, drop4: 0.5,
};
export function essentialWeight(t) {
  if (t.weight) return t.weight;
  let w = 1;
  for (const g of t.tags || []) if (ESSENTIAL[g]) w = Math.max(w, ESSENTIAL[g]) * (ESSENTIAL[g] < 1 ? ESSENTIAL[g] : 1);
  return Math.max(0.3, Math.min(1.6, w));
}
