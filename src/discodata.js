// Disco mode palettes: every chord you can move to in a key, tiered from safe to spicy.
// Each chord: id, tier, deg (root as a degree of the MAJOR scale of the tonic: '1', 'b3', '#4'…), q (chord quality id),
// rn (numeral shown), scale (the mode to play over it, on the chord's own root), to (the chord it usually resolves to),
// fn (its job, short) and why (when it's used and why it works).
const C = (id, tier, deg, q, rn, scale, to, fn, why) => ({ id, tier, deg, q, rn, scale, to, fn, why });

export const TIERS = {
  major: [
    'Diatonic', 'Secondary dominants', 'Secondary ii–V', 'Secondary diminished', 'Tritone subs',
    'Borrowed from minor', 'Borrowed from other modes', 'Chromatic colours',
  ],
  minor: [
    'Diatonic (natural minor)', 'Harmonic minor', 'Melodic minor', 'Secondary dominants',
    'Diminished & tritone subs', 'Borrowed from other modes', 'Chromatic colours',
  ],
};

export const MAJOR = [
  // tier 1: diatonic
  C('I', 1, '1', 'maj7', 'Imaj7', 'ionian', null, 'Home', 'The tonic: everything resolves here. Ionian over it; the 4th is the avoid note, so lean on 3, 5, 7, 9.'),
  C('ii', 1, '2', 'm7', 'ii7', 'dorian', 'V', 'Predominant', 'The most common way to set up the dominant (ii–V–I). Dorian over it: the natural 6 is the bright minor colour.'),
  C('iii', 1, '3', 'm7', 'iii7', 'phrygian', 'vi', 'Weak tonic', 'Shares three notes with Imaj7, so it can stand in for I; usually moves on to vi. Phrygian over it: avoid holding the ♭2.'),
  C('IV', 1, '4', 'maj7', 'IVmaj7', 'lydian', null, 'Predominant', 'The other predominant: softer than ii. Lydian over it: the ♯4 is the key’s own 7th, and it sounds open and bright.'),
  C('V', 1, '5', '7', 'V7', 'mixolydian', 'I', 'Dominant', 'Tension: its 3rd (the leading tone) and 7th form a tritone that resolves into I. Mixolydian over it.'),
  C('vi', 1, '6', 'm7', 'vi7', 'aeolian', 'ii', 'Relative minor', 'The relative minor: sad version of I, and the deceptive-cadence target (V–vi). Aeolian over it.'),
  C('vii', 1, '7', 'm7b5', 'viiø7', 'locrian', 'I', 'Dominant function', 'Contains the V7’s 3rd, 5th and 7th — it is a rootless G9 — so it pulls to I. Locrian over it.'),
  // tier 2: secondary dominants
  C('V/ii', 2, '6', '7', 'V7/ii', 'phrygian-dominant', 'ii', 'Tonicises ii', 'A7 points at Dm: its 3rd (C♯) is Dm’s leading tone. Resolving to a minor chord, so Phrygian dominant (harmonic minor of the target).'),
  C('V/iii', 2, '7', '7', 'V7/iii', 'phrygian-dominant', 'iii', 'Tonicises iii', 'B7 → Em: D♯ leads to E. Rarer and more dramatic. Phrygian dominant, because the target is minor.'),
  C('V/IV', 2, '1', '7', 'V7/IV', 'mixolydian', 'IV', 'Tonicises IV', 'The tonic turned dominant: the added ♭7 (B♭) points it at F. Bluesy and very common. Mixolydian.'),
  C('V/V', 2, '2', '7', 'V7/V', 'mixolydian', 'V', 'Tonicises V', 'D7 → G7: the F♯ leads to G. The classic “two-five” lift in standards and pop bridges. Mixolydian.'),
  C('V/vi', 2, '3', '7', 'V7/vi', 'phrygian-dominant', 'vi', 'Tonicises vi', 'E7 → Am: the G♯ leads to A. Very common, very emotional. Phrygian dominant because Am is minor.'),
  // tier 3: secondary ii chords
  C('ii/ii', 3, '3', 'm7b5', 'iiø7/ii', 'locrian', 'V/ii', 'ii of ii', 'Turns A7 → Dm into a full minor ii–V: Eø7 → A7 → Dm. Half-diminished because the target is minor. Locrian.'),
  C('ii/iii', 3, '#4', 'm7b5', 'iiø7/iii', 'locrian', 'V/iii', 'ii of iii', 'F♯ø7 → B7 → Em: the minor ii–V into iii. F♯ø7 is also the Lydian ♯iv — bright and tense at once.'),
  C('ii/IV', 3, '5', 'm7', 'ii7/IV', 'dorian', 'V/IV', 'ii of IV', 'Gm7 → C7 → F: a major ii–V into IV. Gm7 borrows the ♭7 (B♭), so it sounds like a key change towards F.'),
  C('ii/V', 3, '6', 'm7', 'ii7/V', 'dorian', 'V/V', 'ii of V', 'Am7 → D7 → G: the ii of V is just diatonic vi, so this one sounds totally inside.'),
  C('ii/vi', 3, '7', 'm7b5', 'iiø7/vi', 'locrian', 'V/vi', 'ii of vi', 'Bø7 → E7 → Am: diatonic viiø7 doubling as the ii of vi — the minor ii–V of Autumn Leaves-style harmony.'),
  // tier 4: secondary leading-tone diminished
  C('#I°', 4, '#1', 'dim7', '♯I°7', 'diminished-wh', 'ii', 'Leading-tone to ii', 'C♯°7 → Dm: a diminished 7th a half step below the target is V7♭9 without its root. The bass climbs chromatically (C → C♯ → D).'),
  C('#II°', 4, '#2', 'dim7', '♯II°7', 'diminished-wh', 'iii', 'Leading-tone to iii', 'D♯°7 → Em: the same trick aimed at iii. Gospel and stride piano love the rising bass.'),
  C('III°', 4, '3', 'dim7', 'III°7', 'diminished-wh', 'IV', 'Leading-tone to IV', 'E°7 → F: rootless C7♭9 heading for IV.'),
  C('#IV°', 4, '#4', 'dim7', '♯IV°7', 'diminished-wh', 'V', 'Leading-tone to V', 'F♯°7 → G: very common (IV – ♯IV°7 – I/5 – V). The bass walks F → F♯ → G.'),
  C('#V°', 4, '#5', 'dim7', '♯V°7', 'diminished-wh', 'vi', 'Leading-tone to vi', 'G♯°7 → Am: rootless E7♭9 resolving to vi.'),
  // tier 5: tritone subs
  C('subV', 5, 'b2', '7', '♭II7 (subV)', 'lydian-dominant', 'I', 'Sub for V7', 'D♭7 shares G7’s 3rd and 7th (F and C♭/B), so it does the same job; its root slides down a half step into I.'),
  C('sub/ii', 5, 'b3', '7', '♭III7 (sub V/ii)', 'lydian-dominant', 'ii', 'Sub for A7', 'E♭7 replaces A7 → Dm: chromatic bass E♭ → D.'),
  C('sub/iii', 5, '4', '7', 'IV7 (sub V/iii)', 'lydian-dominant', 'iii', 'Sub for B7', 'F7 replaces B7 → Em: F → E in the bass.'),
  C('sub/IV', 5, 'b5', '7', '♭V7 (sub V/IV)', 'lydian-dominant', 'IV', 'Sub for C7', 'G♭7 replaces C7 → F: G♭ → F in the bass.'),
  C('sub/V', 5, 'b6', '7', '♭VI7 (sub V/V)', 'lydian-dominant', 'V', 'Sub for D7', 'A♭7 → G: also the German augmented sixth. A♭ → G in the bass.'),
  C('sub/vi', 5, 'b7', '7', '♭VII7 (sub V/vi)', 'lydian-dominant', 'vi', 'Sub for E7', 'B♭7 → Am: the same chord as the backdoor ♭VII7 — what it is depends on where it goes.'),
  // tier 6: borrowed from parallel minor
  C('i', 6, '1', 'm7', 'im7', 'dorian', 'IV', 'Borrowed tonic', 'Sudden darkness on the tonic: the parallel minor. Often moves to IV (a bluesy Dorian lift) or back to I.'),
  C('iiø', 6, '2', 'm7b5', 'iiø7', 'locrian', 'V', 'Darker predominant', 'Dø7 → G7 → C: the minor ii in a major key. The ♭5 (A♭) is the key’s ♭6, the “minor” note.'),
  C('bIII', 6, 'b3', 'maj7', '♭IIImaj7', 'ionian', 'IV', 'Borrowed colour', 'E♭maj7: the ♭3 of the key as a whole chord. Rock and soul use it (I – ♭III – IV).'),
  C('iv', 6, '4', 'm7', 'ivm7', 'dorian', 'I', 'Minor plagal', 'The tear-jerker: IV → iv → I. The 6 of the key sighs down to ♭6, then to 5.'),
  C('v', 6, '5', 'm7', 'vm7', 'phrygian', 'IV', 'Soft dominant', 'Gm7: no leading tone, so no pull. Often moves to IV (Mixolydian feel) or acts as ii of IV.'),
  C('bVI', 6, 'b6', 'maj7', '♭VImaj7', 'lydian', 'bVII', 'Epic colour', 'A♭maj7: cinematic. Deceptive target (V → ♭VI) or the start of ♭VI – ♭VII – I.'),
  C('bVII', 6, 'b7', '7', '♭VII7 (backdoor)', 'mixolydian', 'I', 'Backdoor dominant', 'B♭7 → C: resolves up a whole step into I. Softer than V7; its ♭7 (A♭) falls to G.'),
  // tier 7: other parallel modes
  C('IV7', 7, '4', '7', 'IV7 (Dorian)', 'mixolydian', 'I', 'Bluesy IV', 'F7 in C: the IV made dominant. The blues sound; borrowed from C Dorian.'),
  C('I7', 7, '1', '7', 'I7 (Mixolydian)', 'mixolydian', 'IV', 'Bluesy tonic', 'C7 as a home chord, not resolving: the Mixolydian tonic of blues and funk.'),
  C('bVIIt', 7, 'b7', 'maj', '♭VII (rock)', 'lydian', 'IV', 'Rock staple', 'B♭ in C: from Mixolydian, Dorian or Aeolian — the source is often ambiguous. I – ♭VII – IV – I.'),
  C('bII', 7, 'b2', 'maj7', '♭IImaj7 (Neapolitan)', 'lydian', 'I', 'Dramatic predominant', 'D♭maj7: Phrygian colour, a half step above the tonic. ♭II – I or ♭II – V – I.'),
  C('bvii', 7, 'b7', 'm7', '♭viim7 (Phrygian)', 'dorian', 'I', 'Rare and dark', 'B♭m7 from C Phrygian: dark, modal; resolves to I with a sinking feel.'),
  C('II7', 7, '2', '7', 'II7 (Lydian)', 'mixolydian', 'IV', 'Dreamy lift', 'D or D7 as colour, not resolving to V: the Lydian ♯4 (F♯) in the key. I – II – IV – I.'),
  C('#ivø', 7, '#4', 'm7b5', '♯ivø7 (Lydian)', 'locrian', 'IV', 'Lydian predominant', 'F♯ø7: the Lydian-flavoured predominant, sliding to IV or on to V.'),
  C('bV', 7, 'b5', 'maj7', '♭Vmaj7 (Locrian)', 'lydian', 'I', 'Very remote', 'G♭maj7: a tritone from home. Use sparingly; it sounds like a different planet.'),
  C('imM7', 7, '1', 'mMaj7', 'i(maj7)', 'harmonic-minor', 'I', 'Noir tonic', 'Cm(maj7): the Bond/noir tonic from harmonic minor.'),
  C('iv6', 7, '4', 'm6', 'iv6', 'melodic-minor', 'I', 'Film-score iv', 'Fm6: the minor iv with a natural 6 (D); also a rootless B♭9 (the backdoor). Melodic minor on F over it.'),
  // tier 8: chromatic colours
  C('bVI7', 8, 'b6', '7', '♭VI7 → I', 'lydian-dominant', 'I', 'Backdoor-ish', 'A♭7 straight to I: an augmented-sixth sound. The A♭ falls to G, the G♭ (F♯) rises to G.'),
  C('II7#11', 8, '2', '7#11', 'II7♯11', 'lydian-dominant', 'I', 'Lydian dominant colour', 'D7♯11 not resolving to V: pure Lydian-dominant shimmer (think the bridge of a bossa).'),
  C('III', 8, '3', 'maj', 'III (mediant)', 'mixolydian', 'vi', 'Chromatic mediant', 'E major in C: the major version of iii. Often heads to vi (it is V of vi) or simply shifts colour.'),
  C('VI', 8, '6', 'maj', 'VI (mediant)', 'mixolydian', 'ii', 'Chromatic mediant', 'A major in C: the major version of vi, pulling to ii.'),
  C('bIIIt', 8, 'b3', 'maj', '♭III (shift)', 'lydian', 'I', 'Sudden shift', 'E♭ major: a chromatic mediant for a sudden “camera cut” moment.'),
  C('bVIt', 8, 'b6', 'maj', '♭VI (shift)', 'lydian', 'I', 'Sudden shift', 'A♭ major: the other big mediant shift, very cinematic.'),
  C('I°', 8, '1', 'dim7', 'I°7 (common tone)', 'diminished-wh', 'I', 'Common-tone dim', 'C°7 decorates I: shares the root, every other note moves by step. Barry Harris uses it everywhere.'),
  C('I+', 8, '1', 'aug', 'I+', 'whole-tone', 'vi', 'Passing augmented', 'C+: the 5th rises to ♯5, leading on to vi (or IV). Line-cliché motion.'),
  C('V+', 8, '5', '7#5', 'V7♯5', 'whole-tone', 'I', 'Augmented dominant', 'G7♯5: the ♯5 (D♯) pushes up to E, the 3rd of I.'),
  C('Valt', 8, '5', '7alt', 'V7alt', 'altered', 'I', 'Maximum tension', 'G7alt: same job as V7, every tension altered (♭9 ♯9 ♯11 ♭13). Altered scale = melodic minor a half step up.'),
];

export const MINOR = [
  // tier 1: natural minor
  C('i', 1, '1', 'm7', 'im7', 'aeolian', null, 'Home', 'The minor tonic. Aeolian (or Dorian for a lighter colour).'),
  C('iiø', 1, '2', 'm7b5', 'iiø7', 'locrian', 'V', 'Predominant', 'The minor ii: its ♭5 is the key’s ♭6. Sets up V7 → i.'),
  C('bIII', 1, 'b3', 'maj7', '♭IIImaj7', 'ionian', 'bVI', 'Relative major', 'E♭maj7: the relative major. Minor tunes often visit it (iv7 – ♭VII7 – ♭IIImaj7).'),
  C('iv', 1, '4', 'm7', 'ivm7', 'dorian', 'bVII', 'Predominant', 'Fm7: the minor iv. Dorian over it.'),
  C('v', 1, '5', 'm7', 'vm7', 'phrygian', 'i', 'Weak dominant', 'Gm7: natural minor’s v has no leading tone, so it barely pulls. Modal and folky.'),
  C('bVI', 1, 'b6', 'maj7', '♭VImaj7', 'lydian', 'bVII', 'Colour', 'A♭maj7: warm and wide. ♭VI – ♭VII – i is the epic minor cadence.'),
  C('bVII', 1, 'b7', '7', '♭VII7', 'mixolydian', 'bIII', 'V of ♭III', 'B♭7 → E♭: the dominant of the relative major. Or ♭VII → i in rock.'),
  // tier 2: harmonic minor
  C('V', 2, '5', '7b9', 'V7♭9', 'phrygian-dominant', 'i', 'The real dominant', 'G7♭9: the raised 7th (B) gives minor a true leading tone. Phrygian dominant over it.'),
  C('vii°', 2, '7', 'dim7', 'vii°7', 'altered-dim', 'i', 'Leading-tone dim', 'B°7 → Cm: rootless G7♭9. Every note is a half step or whole step from the tonic chord.'),
  C('imM7', 2, '1', 'mMaj7', 'i(maj7)', 'harmonic-minor', 'iv', 'Noir tonic', 'Cm(maj7): the harmonic-minor tonic. Spy films, noir, the line cliché.'),
  C('bIII+', 2, 'b3', 'aug', '♭III+', 'ionian-sharp5', 'iv', 'Augmented colour', 'E♭+: the harmonic minor’s augmented chord, a restless passing sound.'),
  // tier 3: melodic minor
  C('ii', 3, '2', 'm7', 'iim7', 'dorian-b2', 'V', 'Bright ii', 'Dm7 in C minor: the raised 6 (A) makes the ii minor 7th. A lighter minor ii–V.'),
  C('IV7', 3, '4', '7', 'IV7 (Dorian)', 'lydian-dominant', 'i', 'Dorian IV', 'F7 in C minor: the raised 6 (A) makes IV major — the Dorian/Latin minor sound (i – IV7).'),
  C('viø', 3, '6', 'm7b5', 'viø7', 'locrian-nat2', 'II', 'Raised 6th', 'Aø7: the raised 6 as a chord root. Often moves in a ii–V towards D7 → G7.'),
  C('bIII+M7', 3, 'b3', 'maj7#5', '♭IIImaj7♯5', 'lydian-augmented', 'iv', 'Floating colour', 'E♭maj7♯5: melodic minor’s floating, dreamy chord.'),
  // tier 4: secondary dominants
  C('V/iv', 4, '1', '7', 'V7/iv', 'phrygian-dominant', 'iv', 'Tonicises iv', 'C7 → Fm: the tonic turned dominant. Its E♮ leads to F.'),
  C('V/V', 4, '2', '7', 'V7/V', 'mixolydian', 'V', 'Tonicises V', 'D7 → G7: the F♯ leads to G. Very common before the final V.'),
  C('V/bVI', 4, 'b3', '7', 'V7/♭VI', 'mixolydian', 'bVI', 'Tonicises ♭VI', 'E♭7 → A♭: the relative major turned dominant, pointing at ♭VI.'),
  C('V/bVII', 4, '4', '7', 'V7/♭VII', 'mixolydian', 'bVII', 'Tonicises ♭VII', 'F7 → B♭: the iv turned dominant.'),
  C('V/ii', 4, '6', '7', 'V7/ii', 'phrygian-dominant', 'ii', 'Tonicises Dorian ii', 'A7 → Dm7: only when you are using the Dorian ii.'),
  // tier 5: diminished and tritone subs
  C('#IV°', 5, '#4', 'dim7', '♯IV°7', 'diminished-wh', 'V', 'Leading-tone to V', 'F♯°7 → G: the bass walks F → F♯ → G.'),
  C('III°', 5, '3', 'dim7', 'III°7', 'diminished-wh', 'iv', 'Leading-tone to iv', 'E°7 → Fm: rootless C7♭9.'),
  C('subV', 5, 'b2', '7', '♭II7 (subV)', 'lydian-dominant', 'i', 'Sub for V7', 'D♭7 → Cm: the tritone sub of G7; the bass slides down a half step.'),
  C('Ger6', 5, 'b6', '7', '♭VI7 (German 6th)', 'lydian-dominant', 'V', 'Augmented sixth', 'A♭7 → G: the minor-key classic. A♭ falls to G, G♭ (F♯) rises to G.'),
  C('bIII7', 5, 'b3', '7', '♭III7 → V7/V', 'lydian-dominant', 'V/V', 'Chain sub', 'E♭7 → D7: a tritone sub of A7 leading into V7/V — the chain-sub idea.'),
  // tier 6: borrowed from other modes
  C('I', 6, '1', 'maj7', 'Imaj7 (Picardy)', 'ionian', null, 'Picardy third', 'Ending a minor piece on major: the 3rd is borrowed from the parallel major.'),
  C('IV', 6, '4', 'maj', 'IV (Dorian)', 'mixolydian', 'i', 'Dorian brightness', 'F major in C minor: the natural 6 lightens the key.'),
  C('viøD', 6, '6', 'm7b5', 'viø7 (Dorian)', 'locrian', 'II', 'Dorian 6th', 'Aø7 with the natural A: the Dorian colour as a chord.'),
  C('bII', 6, 'b2', 'maj7', '♭IImaj7 (Neapolitan)', 'lydian', 'V', 'Neapolitan', 'D♭maj7: Phrygian, very idiomatic in minor. ♭II – V – i or ♭II – i.'),
  C('bvii', 6, 'b7', 'm7', '♭viim7 (Phrygian)', 'dorian', 'i', 'Dark', 'B♭m7 from C Phrygian: dark and modal.'),
  C('bV', 6, 'b5', 'maj7', '♭Vmaj7 (Locrian)', 'lydian', 'i', 'Very remote', 'G♭maj7: the tritone from home, Locrian territory.'),
  C('II', 6, '2', 'maj', 'II (Lydian)', 'mixolydian', 'V', 'Major II', 'D major in C minor: the Lydian/Dorian-major lift, usually on to V.'),
  // tier 7: chromatic and dominant colours
  C('i°', 7, '1', 'dim7', 'i°7 (common tone)', 'diminished-wh', 'i', 'Common-tone dim', 'C°7 on the tonic: shares the root, the other notes move by step.'),
  C('V+', 7, '5', '7#5', 'V7♯5', 'whole-tone', 'i', 'Augmented dominant', 'G7♯5: the ♯5 (D♯ = E♭) is the 3rd of the minor tonic, held over from the dominant.'),
  C('Valt', 7, '5', '7alt', 'V7alt', 'altered', 'i', 'Minor-key default', 'G7alt: in minor the ♭9 and ♭13 are already in the key, so altered is the natural dominant colour.'),
  C('III', 7, '3', 'maj', 'III (mediant)', 'mixolydian', 'i', 'Chromatic mediant', 'E major in C minor: a bright, startling mediant.'),
  C('VI', 7, '6', 'maj', 'VI (mediant)', 'mixolydian', 'i', 'Chromatic mediant', 'A major in C minor: the other bright mediant.'),
  C('bvi', 7, 'b6', 'm7', '♭vim7 (mediant)', 'dorian', 'i', 'Dark mediant', 'A♭m7: the minor version of ♭VI, very dark.'),
];

// line cliché moves on the minor tonic (one chord, a descending inner voice)
export const CLICHE = ['1:min', '1:mMaj7', '1:m7', '1:m6'];

// diatonic phrases (chord ids) used as connective tissue between the moves
export const PHRASES = {
  major: [['I', 'vi', 'ii', 'V'], ['I', 'IV', 'ii', 'V'], ['iii', 'vi', 'ii', 'V'], ['I', 'IV', 'V', 'I'], ['ii', 'V', 'I', 'I'], ['I', 'iii', 'IV', 'V'], ['vi', 'IV', 'I', 'V'], ['IV', 'V', 'iii', 'vi']],
  minor: [['i', 'iv', 'v', 'i'], ['i', 'bVI', 'bVII', 'i'], ['i', 'bVII', 'bVI', 'bVII'], ['iiø', 'v', 'i', 'i'], ['i', 'bIII', 'bVII', 'iv'], ['iv', 'bVII', 'bIII', 'bVI']],
};

export const GLOSSARY = `**Secondary dominants vs borrowed chords.** A secondary dominant briefly tonicises a non-tonic chord (it is “V of” something), while a modal-interchange chord is borrowed from a parallel scale mainly for colour. The same chord can be either: B♭7 in C is both the backdoor ♭VII7 (→ I) and the tritone sub of E7 (→ Am). What it is depends on where it goes.

**How weird it sounds, roughly:** diatonic → V/V and V/vi → iv and ♭VII from minor → ♭VI → tritone subs and backdoor → Neapolitan / Lydian / Locrian borrowings → chromatic mediants and altered dominants.`;
