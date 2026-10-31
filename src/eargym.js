// Ear Gym: a levelled progression trainer. Each level is a set of progressions that sound confusable;
// you pass a level by getting 8 of the last 10 right, which unlocks the next.
// Charts use roman tokens relative to the major scale of the tonic (see SCHEMA §4.4).
import * as T from './theory.js';
import * as A from './audio.js';
import { chartChords, chordLabel } from './demo.js';
import { progressionVoicings, playChordKeys } from './quiz.js';

const P = (name, chart, minor = false) => ({ name, chart, minor });
export const EAR_LEVELS = [
  { id: 'g1', title: 'One move: I → IV or I → V', tip: 'IV lifts and opens (the bass rises a 4th); V creates tension that wants to come home.', tempo: 70,
    options: [P('I → IV', '| I:maj | IV:maj |'), P('I → V', '| I:maj | V:maj |')] },
  { id: 'g2', title: 'One move: I → IV, V or vi', tip: 'vi is the relative minor: same colour family, but it turns sad.', tempo: 72,
    options: [P('I → IV', '| I:maj | IV:maj |'), P('I → V', '| I:maj | V:maj |'), P('I → vi', '| I:maj | vi:min |')] },
  { id: 'g3', title: 'One move: I → any common chord (ii, IV, V, vi)', tip: 'ii is minor and sits a step above home; listen to the bass step up.', tempo: 74,
    options: [P('I → ii', '| I:maj | ii:min |'), P('I → IV', '| I:maj | IV:maj |'), P('I → V', '| I:maj | V:maj |'), P('I → vi', '| I:maj | vi:min |')] },
  { id: 'g4', title: 'Three chords', tip: 'Follow the bass. Does it end on V (open, a question) or back home on I?', tempo: 78,
    options: [P('I – IV – V', '| I:maj | IV:maj | V:maj |'), P('I – V – IV', '| I:maj | V:maj | IV:maj |'), P('I – ii – V', '| I:maj | ii:min | V:maj |'), P('I – vi – IV', '| I:maj | vi:min | IV:maj |'), P('I – IV – I', '| I:maj | IV:maj | I:maj |')] },
  { id: 'g5', title: 'Four-chord loops', tip: 'Pop loops differ only in where the minor chord (vi) falls.', tempo: 84,
    options: [P('I – IV – V – I', '| I:maj | IV:maj | V:maj | I:maj |'), P('I – vi – IV – V (50s)', '| I:maj | vi:min | IV:maj | V:maj |'), P('I – V – vi – IV (pop axis)', '| I:maj | V:maj | vi:min | IV:maj |'), P('vi – IV – I – V', '| vi:min | IV:maj | I:maj | V:maj |'), P('I – vi – ii – V', '| I:maj | vi:min | ii:min | V:maj |')] },
  { id: 'g6', title: 'Cadences: how the phrase ends', tip: 'Authentic V→I lands; plagal IV→I is the "amen"; half cadence stops on V; deceptive V→vi dodges home.', tempo: 76,
    options: [P('Authentic: ii – V – I', '| ii:min | V:7 | I:maj |'), P('Plagal: IV – I', '| I:maj | IV:maj | I:maj |'), P('Half: I – IV – V', '| I:maj | IV:maj | V:maj |'), P('Deceptive: IV – V – vi', '| IV:maj | V:7 | vi:min |')] },
  { id: 'g7', title: 'Jazz 7ths: the ii–V–I family', tip: 'ii7 is soft and minor; V7 has the bite (tritone); Imaj7 is the lush arrival.', tempo: 84,
    options: [P('ii – V – I', '| ii:m7 | V:7 | I:maj7 |'), P('IV – V – I', '| IV:maj7 | V:7 | I:maj7 |'), P('ii – V – vi (deceptive)', '| ii:m7 | V:7 | vi:m7 |'), P('iii – vi – ii – V', '| iii:m7 | vi:m7 | ii:m7 | V:7 |'), P('I – vi – ii – V', '| I:maj7 | vi:m7 | ii:m7 | V:7 |')] },
  { id: 'g8', title: 'Major vs minor ii–V', tip: 'The minor ii–V has a half-diminished ii and lands on a minor chord — darker all the way.', tempo: 84,
    options: [P('Major ii – V – I', '| ii:m7 | V:7 | I:maj7 |'), P('Minor iiø – V7 – i', '| ii:m7b5 | V:7b9 | i:m7 |', true), P('Major ii–V to minor i', '| ii:m7 | V:7 | i:m7 |', true), P('Minor iiø–V to major I', '| ii:m7b5 | V:7b9 | I:maj7 |')] },
  { id: 'g9', title: 'Secondary dominants', tip: 'A major chord where you expect a minor one (VI7 instead of vi) is a dominant pulling to the next chord.', tempo: 86,
    options: [P('I – vi – ii – V', '| I:maj7 | vi:m7 | ii:m7 | V:7 |'), P('I – VI7 – ii – V', '| I:maj7 | VI:7 | ii:m7 | V:7 |'), P('I – I7 – IV', '| I:maj | I:7 | IV:maj |'), P('II7 – V – I', '| II:7 | V:7 | I:maj7 |'), P('ii – V – I', '| ii:m7 | V:7 | I:maj7 |')] },
  { id: 'g10', title: 'Borrowed chords (modal interchange)', tip: 'Listen for one chord that suddenly goes dark (iv, ♭VI, ♭VII) while the key stays major.', tempo: 82,
    options: [P('IV – I (plagal)', '| I:maj | IV:maj | I:maj |'), P('iv – I (minor plagal)', '| I:maj | iv:min | I:maj |'), P('♭VII – IV – I', '| I:maj | bVII:maj | IV:maj | I:maj |'), P('♭VI – ♭VII – I', '| I:maj | bVI:maj | bVII:maj | I:maj |'), P('iv – ♭VII7 – I (backdoor)', '| I:maj7 | iv:m7 | bVII:7 | I:maj7 |')] },
  { id: 'g11', title: 'Substitutions in a ii–V–I', tip: 'Tritone sub: the bass slides down by half steps (ii → ♭II7 → I). Backdoor comes from below (♭VII7 → I).', tempo: 86,
    options: [P('ii – V – I', '| ii:m7 | V:7 | I:maj7 |'), P('ii – ♭II7 – I (tritone sub)', '| ii:m7 | bII:7 | I:maj7 |'), P('iv – ♭VII7 – I (backdoor)', '| iv:m7 | bVII:7 | I:maj7 |'), P('ii – V7alt – I', '| ii:m7 | V:7alt | I:maj7 |')] },
  { id: 'g12', title: 'Turnarounds', tip: 'Passing diminished (I – ♯I° – ii) makes the bass climb chromatically.', tempo: 90,
    options: [P('I – vi – ii – V', '| I:maj7 | vi:m7 | ii:m7 | V:7 |'), P('I – ♯I° – ii – V', '| I:maj7 | #i:dim7 | ii:m7 | V:7 |'), P('iii – VI7 – ii – V', '| iii:m7 | VI:7 | ii:m7 | V:7 |'), P('I – ♭III7 – ♭VI7 – ♭II7 (tritone turnaround)', '| I:maj7 | bIII:7 | bVI:7 | bII:7 |')] },
];
export const PASS = { need: 8, of: 10 };

export function gymQuestion(level, tonicName) {
  const o = level.options[Math.floor(Math.random() * level.options.length)];
  const pool = o.minor ? T.MINOR_KEYS : T.MAJOR_KEYS;
  const keyName = tonicName ? tonicName + (o.minor ? 'm' : '') : pool[Math.floor(Math.random() * pool.length)];
  const k = T.parseKey(keyName);
  const { chords } = chartChords({ key: k.short, chart: o.chart });
  const vs = progressionVoicings(chords);
  const bpm = level.tempo + Math.round(Math.random() * 16 - 8);
  const play = () => {
    A.hush();
    const t0 = A.audioCtx().currentTime + 0.08;
    const spb = 60 / bpm;
    chords.forEach((c, i) => playChordKeys(vs[i], t0 + c.beat * spb, c.dur * spb * 0.95));
  };
  return {
    answer: level.options.indexOf(o), option: o, key: k, play,
    reveal: chords.map((c) => `${chordLabel(c)} (${T.prettyRoman(c.roman || '')})`).join(' – '),
  };
}
