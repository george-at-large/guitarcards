// Generic substitution "menu" for any chord, by function. Tokens are roman numerals relative to the key.
import * as T from './theory.js';

const DOM = new Set(['7', '9', '13', '7b9', '7#9', '7alt', '7#11', '7b13', '7b9b13', '7#9b13', '7#9#5', '13b9', '13#11', '7sus4', '9sus4', '13sus4', '7#5', '7b5']);
const MAJ = new Set(['maj', 'maj7', '6', '6/9', 'maj9', 'maj7#11', 'maj9#11', 'maj13', 'add9']);
const MIN = new Set(['min', 'm7', 'm9', 'm11', 'm6', 'm13', 'madd9', 'm6/9']);

// semitone offset of a chord root from the key tonic -> roman numeral head (with b/#)
const HEADS = ['I', 'bII', 'II', 'bIII', 'III', 'IV', '#IV', 'V', 'bVI', 'VI', 'bVII', 'VII'];
function headFor(root, tonic) { return HEADS[(T.notePc(root) - T.notePc(tonic) + 12) % 12]; }
const tok = (head, q) => `${head}:${q}`;
const offs = (root, tonic) => (T.notePc(root) - T.notePc(tonic) + 12) % 12;

// chord = parsed chord token ({root, quality}); next = following chord (or null); key = parsed key
export function substitutions(chord, next, key) {
  const tonic = key.tonic;
  const q = chord.quality;
  const o = offs(chord.root, tonic);
  const out = [];
  const add = (head, quality, label, why, concepts = []) => {
    try { T.getChord(quality); out.push({ token: tok(head, quality), label, why, concepts }); } catch (e) { /* */ }
  };
  const nextO = next ? offs(next.root, tonic) : null;
  const resolvesDown5 = next && (o - nextO + 12) % 12 === 7;
  if (DOM.has(q)) {
    const tgt = next ? next.root : T.transpose(chord.root, '4');
    const tritone = headFor(T.transposeSemis(chord.root, 6), tonic);
    add(tritone, '7', 'Tritone substitute', 'Same tritone (3rd and 7th swap roles); the bass now slides down a half step into the target.', ['tritone-sub']);
    add(headFor(chord.root, tonic), '7alt', 'Altered dominant', 'Keep the root and guide tones, but sharpen/flatten the 5th and 9th — play the altered scale (melodic minor a half step above). Maximum tension, strong pull.', ['altered-scale']);
    add(headFor(chord.root, tonic), '7b9', 'Dominant ♭9 (half-whole)', 'The ♭9 adds a darker, “minor-key” dominant sound; the half-whole diminished scale fits.', ['diminished-scale']);
    add(headFor(chord.root, tonic), '13', 'Dominant 13', 'Natural 9 and 13 — the bright, inside Mixolydian colour.', []);
    add(headFor(T.transpose(chord.root, '5'), tonic), 'm7', 'Related ii (make it a ii–V)', `Precede or replace with the ii of this dominant (${T.chordSymbol(T.transpose(chord.root, '5'), 'm7')}) to stretch the cadence over two chords.`, ['ii-v-i']);
    if (resolvesDown5 || !next) add(headFor(T.transposeSemis(tgt, -1), tonic), 'dim7', 'Diminished 7 (rootless 7♭9)', 'A dim7 a half step below the target contains the 3, 5, ♭7 and ♭9 of this dominant — it resolves up by half step.', ['diminished-chords']);
    add(headFor(chord.root, tonic), '7sus4', 'Suspended dominant', 'Delay the 3rd: a softer, modal dominant (common in modern jazz and gospel).', []);
    if (next && nextO === 0) add('bVII', '7', 'Backdoor dominant', 'bVII7 → I: the backdoor cadence, borrowed from the parallel minor (iv–bVII7). Softer than V7 → I.', ['backdoor-cadence']);
  } else if (MAJ.has(q)) {
    if (o === 0) {
      add('iii', 'm7', 'Tonic substitute (iii)', 'iii shares three notes with Imaj7 — a softer, less settled tonic.', ['diatonic-substitution']);
      add('vi', 'm7', 'Tonic substitute (vi)', 'vi shares three notes with I6 — the classic deceptive move when it follows V.', ['diatonic-substitution', 'deceptive-cadence']);
      add('I', 'maj7#11', 'Lydian colour', 'Raise the 4th: Imaj7♯11 floats instead of resolving — the “film” sound.', ['lydian']);
      add('I', '6', 'Major 6', 'The 6th instead of the 7th: older-style, sweeter tonic.', []);
      add('i', 'm7', 'Modal interchange: tonic minor', 'Borrow the tonic from the parallel minor — sudden darkening.', ['modal-interchange']);
      add('bVI', 'maj7', 'Modal interchange: bVImaj7', 'Borrowed from Aeolian. Bittersweet; often heard as a deceptive resolution.', ['modal-interchange']);
    } else {
      add(headFor(chord.root, tonic), 'maj7#11', 'Lydian colour', 'A non-tonic major chord often wants the ♯11 — this is the IV chord’s natural Lydian sound.', ['lydian']);
      if (o === 5) {
        add('ii', 'm7', 'Predominant substitute (ii)', 'ii and IV share three notes and the same pull toward V.', ['diatonic-substitution']);
        add('iv', 'm6', 'Minor plagal (iv)', 'Borrow iv from the parallel minor: the ♭6 leans down to 5 — very cinematic/gospel.', ['modal-interchange', 'plagal-cadence']);
        add('bVII', '7', 'Backdoor bVII7', 'From iv you can continue to bVII7 → I (backdoor progression).', ['backdoor-cadence']);
        add('#iv', 'm7b5', 'Raised IV (♯iv°)', '♯ivø7 is the Lydian-flavoured predominant that walks up to V or I/5.', []);
      }
    }
  } else if (MIN.has(q)) {
    if (o === 2) {
      add('IV', 'maj7', 'Predominant substitute (IV)', 'IV and ii7 share three notes; same function.', ['diatonic-substitution']);
      add('ii', 'm7b5', 'Borrowed iiø7', 'Borrowed from the parallel minor — darkens the cadence, pairs with V7♭9.', ['modal-interchange', 'minor-ii-v-i']);
      add('bVI', '7', 'Tritone sub of V/V', 'bVI7 is the tritone substitute for II7 (V/V).', ['tritone-sub']);
    }
    if (o === 0) {
      add('i', 'mMaj7', 'Tonic minor-major 7', 'Melodic-minor tonic: the Bond/film-noir sound.', ['melodic-minor']);
      add('i', 'm6', 'Tonic minor 6', 'Dorian-flavoured tonic minor (the natural 6).', ['dorian']);
    }
    add(headFor(chord.root, tonic), 'm9', 'Add the 9', 'm9 = Dorian or Aeolian colour; the 9 is the safest extension on minor chords.', []);
    add(headFor(T.transpose(chord.root, '5'), tonic), '7', `Secondary dominant (V7/${headFor(chord.root, tonic).toLowerCase()})`, `Precede this chord with its own dominant (${T.chordSymbol(T.transpose(chord.root, '5'), '7')}) to tonicise it.`, ['secondary-dominant']);
  } else if (q === 'm7b5') {
    add(headFor(chord.root, tonic), 'm7b5', 'Locrian ♮2 colour', 'Over ø7 the natural 9 (Locrian ♮2 = melodic minor from the ♭3) is smoother than ♭9.', ['melodic-minor']);
    add(headFor(T.transpose(chord.root, 'b3'), tonic), 'm6', 'Minor 6 relationship', `${T.chordSymbol(chord.root, 'm7b5')} has the same notes as ${T.chordSymbol(T.transpose(chord.root, 'b3'), 'm6')} — use one as the other.`, []);
  } else if (q === 'dim7') {
    add(headFor(T.transposeSemis(chord.root, -1), tonic), '7b9', 'Dominant it implies', `A dim7 is a rootless 7♭9: ${T.chordSymbol(chord.root, 'dim7')} ≈ ${T.chordSymbol(T.transposeSemis(chord.root, -4), '7b9')} (and three other dominants a minor 3rd apart).`, ['diminished-chords']);
  }
  // universal approach chords
  add(headFor(T.transposeSemis(chord.root, 1), tonic), q, 'Chromatic approach from above', 'Same chord a half step above, sliding into this one — a planing approach.', ['chromatic-approach']);
  add(headFor(T.transposeSemis(chord.root, -1), tonic), 'dim7', 'Passing diminished from below', 'A dim7 a half step below acts as a leading-tone chord into this one.', ['diminished-chords']);
  return out;
}
