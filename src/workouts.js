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
// how essential a card is for real playing: multiplies its chance of coming up in mixed sessions (likes boost further)
export const ESSENTIAL = {
  'ii-v-i': 1.5, 'minor-ii-v-i': 1.4, triads: 1.3, arpeggios: 1.3, drop2: 1.3, inversions: 1.3, 'cycle-of-fourths': 1.4,
  'chord-tones': 1.3, 'guide-tones': 1.3, 'melodic-minor': 1.2, 'harmonic-minor': 1.2, comping: 1.2, 'deep-dive': 1.2,
  'parallel-modes': 0.7, 'modal-interchange': 0.85, quartal: 0.8, 'harmonic-major': 0.6, 'drop24': 0.7, drop23: 0.6, drop4: 0.5,
};
export function essentialWeight(t) {
  if (t.weight) return t.weight;
  let w = 1;
  for (const g of t.tags || []) if (ESSENTIAL[g]) w = Math.max(w, ESSENTIAL[g]) * (ESSENTIAL[g] < 1 ? ESSENTIAL[g] : 1);
  return Math.max(0.3, Math.min(1.6, w));
}
