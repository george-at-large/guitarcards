// Guitar Cards — Analyses library (read-only annotated pieces). Schema: docs/SCHEMA.md §11.
// Chord charts only: no lyrics or melodies of copyrighted songs. Roman numerals are relative to the MAJOR scale on the key tonic.

export const analyses = [
  // ───────────────────────────── CADENCES ─────────────────────────────
  {
    id: "ana-cadence-authentic", title: "Authentic cadence: V–I and its cousins", artist: "Illustration (original)",
    genre: "theory", level: 1, key: "C", tempo: 76, meter: "4/4", tags: ["cadence", "authentic", "dominant", "function"],
    summary: "The **authentic cadence** is dominant → tonic: V or V7 resolving to I. It is the strongest 'full stop' in tonal music because two notes pull at once. The 3rd of V (B in C, the *leading tone*) rises a half step to the root, and the 7th of V7 (F) falls a half step to the 3rd (E). B and F form a **tritone**, the unstable interval the dominant exists to resolve.\n\nFour short phrases show the main flavours:\n- plain IV–V7–I\n- ii–V–I, the jazz version\n- the leading-tone chord vii° standing in for V\n- the minor-key version, with V borrowed from harmonic minor",
    sections: [
      { name: "1. IV–V7–I", chart: "| I:maj | IV:maj | V:7 | I:maj |",
        notes: [
          { bar: 2, text: "**IV is the predominant**: its job is to prepare the dominant. The functional cycle is tonic → predominant → dominant → tonic.", concepts: ["ana-harmonic-function"] },
          { bar: 3, text: "G7 is G B D F. B and F are a **tritone** apart. Listen to that rub, then hear it dissolve in the next bar.", concepts: ["ana-authentic-cadence"] },
          { bar: 4, text: "Resolution: B rises to C and F falls to E. With the root of I on top this is a *perfect* authentic cadence. With the 3rd or 5th on top it is *imperfect*, which sounds slightly less final." } ],
        subs: [
          { bar: 3, options: [
            { token: "V:7sus4", label: "Suspended V (G7sus4)", why: "Removes the leading tone, so the pull is softer and more open. Gospel, soul and modern jazz all use it, often resolving it to plain V7 first.", concepts: ["ana-sus-dominant"] },
            { token: "bII:7", label: "Tritone sub (Db7)", why: "Db7 has the same tritone (F and Cb = B), and its root slides down a half step into C. The voice leading is just as strong, but the colour is jazzier.", concepts: ["ana-tritone-sub"] },
            { token: "V:7b9", label: "G7♭9", why: "Adds Ab, which falls a half step to G. The result is extra tension and a borrowed minor-key colour.", concepts: ["ana-dominant-colors"] } ] } ] },
      { name: "2. ii–V–I", chart: "| I:maj | ii:m7 | V:7 | I:maj7 |",
        notes: [
          { bar: 2, text: "ii (Dm7) is IV with an extra 3rd underneath (D F A C contains F A C), so it does the same predominant job. The root then falls in fifths, D → G → C, the strongest root motion there is. This is the jazz **ii–V–I** in miniature.", concepts: ["ana-ii-v-i", "ana-harmonic-function"] } ] },
      { name: "3. vii° as dominant", chart: "| I:maj | IV:maj | vii:dim | I:maj |",
        notes: [
          { bar: 3, text: "B° (B D F) is G7 without its root. The tritone, and with it the pull, is intact. Classical writers use it when they want a lighter dominant that moves stepwise in every voice.", concepts: ["ana-harmonic-function"] } ] },
      { name: "4. Minor key", chart: "| i:min | iv:min | V:7 | i:min |",
        notes: [
          { bar: 3, text: "Natural minor would give v minor (Gm), which has no leading tone. So the 7th is raised to B natural, making G7, the **harmonic-minor dominant**. Almost every minor-key song and jazz tune does this.", concepts: ["ana-authentic-cadence", "ana-dominant-colors"] } ] } ],
    compare: [
      { type: "compare", key: "C", chart: "| I:maj | IV:maj | V:7 | I:maj |", target: "V:7",
        options: [ { token: "V:maj", label: "V triad: clean, classical" }, { token: "V:7", label: "V7: tritone added, stronger pull" },
                   { token: "vii:dim", label: "vii°: rootless dominant, lighter" }, { token: "V:7sus4", label: "V7sus4: pull without the leading tone" } ],
        explain: "Listen to how much each version *wants* the final C. V7 pulls hardest because it has both tendency tones, B and F. The sus4 version holds back the leading tone, so the arrival feels gentler, close to a plagal 'amen'." } ],
    source: "Original illustration of standard common-practice cadence types; terminology follows Open Music Theory ('Cadences') and standard harmony texts."
  },
  {
    id: "ana-cadence-plagal", title: "Plagal and minor plagal cadences (IV–I, iv–I)", artist: "Illustration (original)",
    genre: "theory", level: 2, key: "C", tempo: 72, meter: "4/4", tags: ["cadence", "plagal", "minor-plagal", "modal-interchange"],
    summary: "The **plagal cadence** goes IV → I, the 'amen' of hymns. It has no leading tone, so it sounds like a settling-in rather than a forceful arrival. Rock uses it all the time (I–IV–I riffs, double-plagal I–bVII–IV–I).\n\nThe **minor plagal cadence** goes iv → I: the IV chord is borrowed from the parallel minor, so in C, F becomes **Fm**. The Ab in Fm falls a half step to G, a bittersweet sigh. Beatles ballads, Radiohead's 'Creep', soul and countless film cues lean on it. Jazz players spell the same move as **iv6** or **bVII7** (the backdoor dominant).",
    sections: [
      { name: "1. Plagal (IV–I)", chart: "| I:maj | V:maj | IV:maj | I:maj |",
        notes: [
          { bar: 3, text: "F → C. The common tone C stays put while A falls to G and F falls to E. Nothing is *forced* to resolve, so the ending sounds like a release rather than a conclusion.", concepts: ["ana-plagal-cadence"] },
          { bar: 2, text: "V → IV is a 'backwards' move (a **retrogression**) in classical terms, but it is the backbone of blues and rock: the dominant relaxes into IV instead of resolving to I.", concepts: ["ana-harmonic-function"] } ] },
      { name: "2. Minor plagal (iv–I)", chart: "| I:maj | IV:maj | iv:min | I:maj |",
        notes: [
          { bar: 3, text: "IV turns into iv: A drops to Ab. That one note is the whole effect. Ab then falls to G in the C chord, a chromatic line A–Ab–G.", concepts: ["ana-plagal-cadence", "ana-modal-interchange"] } ],
        subs: [
          { bar: 3, options: [
            { token: "iv:m6", label: "iv6 (Fm6)", why: "Adds D. Fm6 (F Ab C D) is the same set of notes as Dm7♭5, so it doubles as a ii of the minor key. This is the standard jazz version.", concepts: ["ana-plagal-cadence"] },
            { token: "bVII:7", label: "Backdoor dominant (Bb7)", why: "Bb7 holds the Ab and the D of Fm6, plus a root a whole step below C. It is the 'backdoor' route home, heard in countless standards.", concepts: ["ana-backdoor"] },
            { token: "bVI:maj", label: "bVI (Ab major)", why: "Another borrowed chord carrying Ab. It is more cinematic and less bluesy, and it leads to I via the chromatic mediant (Ab → C).", concepts: ["ana-modal-interchange", "ana-chromatic-mediant"] } ] } ] },
      { name: "3. Jazz minor plagal", chart: "| I:maj7 | IV:maj7 | iv:m6 | I:maj7 |",
        notes: [
          { bar: 3, text: "Same line, now with 7th chords: Fmaj7 → Fm6 → Cmaj7. Inner voices: A → Ab → G and E → D → E. Try it with drop-2 voicings on the middle four strings.", concepts: ["ana-plagal-cadence"] } ] } ],
    compare: [
      { type: "compare", key: "C", chart: "| I:maj | vi:min | IV:maj | I:maj |", target: "IV:maj",
        options: [ { token: "IV:maj", label: "IV: plain 'amen'" }, { token: "iv:min", label: "iv: borrowed, bittersweet" },
                   { token: "iv:m6", label: "iv6: jazz spelling" }, { token: "bVII:7", label: "bVII7: backdoor dominant" } ],
        explain: "The last three options all contain Ab. Listen for that note sinking to G as the C chord arrives. The more of the minor key you bring in, the more wistful the cadence sounds." } ],
    source: "Original illustration; standard terminology (plagal / minor plagal cadence) as in Open Music Theory and jazz harmony texts (e.g. Mark Levine, The Jazz Theory Book, on iv and bVII7)."
  },
  {
    id: "ana-cadence-half", title: "Half cadences and the Phrygian half cadence", artist: "Illustration (original)",
    genre: "theory", level: 3, key: "C", tempo: 72, meter: "4/4", tags: ["cadence", "half-cadence", "phrygian", "lament-bass"],
    summary: "A **half cadence** ends a phrase *on* the dominant. The music stops on a question mark, and the next phrase usually answers it with an authentic cadence. Pop choruses that hang on V before the drop work the same way.\n\nThe **Phrygian half cadence** is the minor-key version with a special bass: **iv6 → V**, where the bass falls a half step (Ab → G in C minor) while the top voice climbs. It sounds ancient and Spanish, and it links directly to the flamenco Andalusian cadence (i–bVII–bVI–V). The bass line below, C–Bb–Ab–G, is the **lament bass**, the descending minor tetrachord.",
    sections: [
      { name: "1. Half cadence", chart: "| I:maj | vi:min | ii:min | V:maj |",
        notes: [
          { bar: 4, text: "We stop on G. It sounds unfinished, and that is the point: a half cadence is the 'antecedent' half of a question–answer pair.", concepts: ["ana-half-cadence"] } ],
        subs: [
          { bar: 4, options: [
            { token: "V:7sus4", label: "G7sus4", why: "The pop and gospel way to hang on the dominant: the open sus sound stretches the suspense before the next section.", concepts: ["ana-sus-dominant"] },
            { token: "V/V:7", label: "D7 (V/V)", why: "Ending on V of V pushes the question further away. You now 'expect' G, and then C.", concepts: ["ana-secondary-dominant"] } ] } ] },
      { name: "2. Phrygian half cadence", chart: "| i:min | i:min/b7 | iv:min/b3 | V:maj |",
        notes: [
          { bar: 2, text: "Cm/Bb: the bass starts its slow descent C → Bb → Ab → G, the **lament bass**.", concepts: ["ana-bass-line"] },
          { bar: 3, text: "Fm with Ab in the bass (iv6). Ab is the b6 of the key.", concepts: ["ana-half-cadence"] },
          { bar: 4, text: "Ab → G in the bass, a half step down, while the upper voice rises F → G. That pair of half steps is the **Phrygian** sound, the same b2–1 pull as F → E in A Phrygian. Bach chorales end slow movements with it; flamenco treats this chord as home.", concepts: ["ana-half-cadence", "ana-andalusian"] } ],
        subs: [
          { bar: 3, options: [
            { token: "bVI:maj", label: "bVI (Ab major)", why: "Same bass note, slightly brighter. Cm–Bb–Ab–G is exactly the **Andalusian cadence** in C minor.", concepts: ["ana-andalusian"] },
            { token: "bVI:7", label: "Ab7 (German-sixth sound)", why: "Ab7 sounds the same as the German augmented sixth, whose F# is spelled here as Gb. Ab falls and Gb/F# rises, both landing on G. It is also the tritone sub of D7 (V/V), and the most dramatic way into V.", concepts: ["ana-tritone-sub"] } ] } ] } ],
    compare: [
      { type: "compare", key: "C", chart: "| i:min | i:min/b7 | iv:min/b3 | V:maj |", target: "V:maj",
        options: [ { scale: "phrygian-dominant", label: "G Phrygian dominant (C harmonic minor)" }, { scale: "phrygian", label: "G Phrygian (C natural minor)" }, { scale: "mixolydian", label: "G Mixolydian (C major)" } ],
        explain: "Over the final G chord: Phrygian dominant keeps the B natural and the Ab, the classic Spanish sound. Plain Phrygian has Bb, which fights the chord's B. Mixolydian brings in A natural and sounds like the music has lurched into C major." } ],
    source: "Original illustration; Phrygian half cadence and lament bass per Open Music Theory and standard counterpoint texts."
  },
  {
    id: "ana-cadence-deceptive", title: "Deceptive cadence: V goes somewhere else", artist: "Illustration (original)",
    genre: "theory", level: 2, key: "C", tempo: 76, meter: "4/4", tags: ["cadence", "deceptive", "modal-interchange"],
    summary: "In a **deceptive cadence** the dominant sets up I and then resolves somewhere else. The textbook target is **vi**: Am shares C and E with the C chord, so the leading tone still rises to C. The ear gets *almost* what it wanted, and the phrase has to go round again. That is why deceptive cadences extend phrases and delay endings.\n\nThe darker version swaps in the borrowed **bVI** (Ab major), which has the movie-trailer, 'the floor fell away' effect. Both exist to postpone the real authentic cadence that follows.",
    sections: [
      { name: "1. V–vi", chart: "| I:maj | ii:min | V:7 | vi:min | IV:maj | ii:min | V:7 | I:maj |",
        notes: [
          { bar: 3, text: "Everything says 'C is coming'.", concepts: ["ana-authentic-cadence"] },
          { bar: 4, text: "Am instead. B still rises to C and F still falls to E, but the bass goes G → A instead of G → C. The answer is *right notes, wrong bass*.", concepts: ["ana-deceptive-cadence"] },
          { bar: 8, text: "Now the real authentic cadence lands. Hearing it after the fake-out makes it feel twice as final." } ],
        subs: [
          { bar: 4, options: [
            { token: "IV:maj/3", label: "IV6 (F/A)", why: "Same bass step G → A, but the harmony slips to the subdominant. It is common in gospel and in hymn reharmonisations.", concepts: ["ana-bass-line"] },
            { token: "V/ii:7", label: "A7 (V/ii)", why: "Deceptive *and* forward-moving: A7 shares nothing with C, and it pushes on towards Dm.", concepts: ["ana-secondary-dominant"] } ] } ] },
      { name: "2. V–bVI (borrowed)", chart: "| I:maj | IV:maj | V:7 | bVI:maj | IV:maj | V:7 | I:maj | % |",
        notes: [
          { bar: 4, text: "Ab major: Ab–C–Eb. The leading tone B slides *up* to C, but D falls to Eb and G falls to Ab. Everything sinks by a half step, a dramatic darkening borrowed from C minor.", concepts: ["ana-deceptive-cadence", "ana-modal-interchange"] } ],
        subs: [
          { bar: 4, options: [
            { token: "bVI:maj7", label: "Abmaj7", why: "Adds G, the note you were expecting as the root of a C chord's fifth, hanging on as a common tone. It softens the blow and sounds lush rather than shocked.", concepts: ["ana-modal-interchange"] } ] } ] } ],
    compare: [
      { type: "compare", key: "C", chart: "| vi:min | IV:maj | V:7 | I:maj |", target: "I:maj",
        options: [ { token: "I:maj", label: "I: authentic, the expected answer" }, { token: "vi:min", label: "vi: deceptive, the classic" },
                   { token: "bVI:maj7", label: "bVImaj7: borrowed, cinematic" }, { token: "V/ii:7", label: "A7: deceptive, then keeps moving" } ],
        explain: "Each option follows the same G7. Notice how much 'C' each one still contains: Am keeps C and E, Abmaj7 keeps C and G, and A7 keeps only E. The less common ground, the bigger the surprise." } ],
    source: "Original illustration; terminology per Open Music Theory and standard harmony texts."
  },
  {
    id: "ana-cadence-backdoor", title: "Backdoor cadence: iv–bVII7–I", artist: "Illustration (original)",
    genre: "jazz", level: 5, key: "C", tempo: 100, meter: "4/4", tags: ["cadence", "backdoor", "modal-interchange", "jazz"],
    summary: "The **backdoor progression** comes home through the back: **ivm7 → bVII7 → Imaj7** (in C: Fm7 → Bb7 → Cmaj7). It is a ii–V *of the wrong key*. Fm7–Bb7 is ii–V in Eb, but it resolves to C instead.\n\nWhy it works: Bb7 contains Ab and D, the notes of Fm6 (the minor plagal chord). It also has a root a whole step below C, and its own 'leading tone', D, which sits a step above C. The ear hears a mixture of minor plagal and dominant. Standards that use it include 'There Will Never Be Another You', 'Lady Bird' and 'Stella by Starlight'. It is also the bridge between jazz and the rock bVII chord.",
    sections: [
      { name: "Front door, then back door", chart: "| ii:m7 | V:7 | I:maj7 | % | iv:m7 | bVII:7 | I:maj7 | % |",
        notes: [
          { bar: 2, text: "Front door: G7 with its leading tone B pushing up into C.", concepts: ["ana-ii-v-i"] },
          { bar: 5, text: "Fm7, the borrowed iv, with an Ab that will sink to G.", concepts: ["ana-modal-interchange"] },
          { bar: 6, text: "Bb7: Bb D F Ab. Ab falls to G and D falls to C (or holds as the 9th). Bb is the b7 of C, which is the Mixolydian/blues colour.", concepts: ["ana-backdoor"] },
          { bar: 7, text: "Same destination, very different feeling: the front door is decisive, the back door warm and a bit sly." } ],
        subs: [
          { bar: 6, options: [
            { token: "bVII:9", label: "Bb9", why: "The 9th (C) anticipates the tonic, and the chord blurs into the arrival.", concepts: ["ana-backdoor"] },
            { token: "bVII:7#11", label: "Bb7#11 (Lydian dominant)", why: "Bb Lydian dominant has the same notes as F melodic minor, the 'minor iv' world. It is the natural scale over the backdoor chord.", concepts: ["ana-lydian-dominant"] },
            { token: "bII:7", label: "Db7 (tritone sub)", why: "A different trapdoor: the root slides a half step into C. Comparing it with the backdoor shows two non-V ways home.", concepts: ["ana-tritone-sub"] } ] } ] } ],
    compare: [
      { type: "compare", key: "C", chart: "| I:maj7 | iv:m7 | bVII:7 | I:maj7 |", target: "bVII:7",
        options: [ { token: "V:7", label: "G7: front door" }, { token: "bVII:7", label: "Bb7: back door" }, { token: "bII:7", label: "Db7: tritone sub" }, { token: "iv:m6", label: "Fm6: minor plagal" } ],
        explain: "Four ways into Cmaj7. G7 and Db7 share a tritone (B/F), so they are the dominant family. Bb7 and Fm6 share Ab and D, so they are the minor-plagal family. Train your ear to sort them into these two families." },
      { type: "compare", key: "C", chart: "| I:maj7 | iv:m7 | bVII:7 | I:maj7 |", target: "bVII:7",
        options: [ { scale: "lydian-dominant", label: "Bb Lydian dominant (= F melodic minor)" }, { scale: "mixolydian", label: "Bb Mixolydian (= Eb major)" } ],
        explain: "Mixolydian contains Eb, a note that points towards Eb major, the 'wrong' key. Lydian dominant swaps it for E natural, the 3rd of the coming C chord, so the line glides home." } ],
    source: "Original illustration; the backdoor ii–V as described in Mark Levine's The Jazz Theory Book and common jazz pedagogy."
  },
  // ─────────────────────── SINGLE-IDEA PIECES ───────────────────────
  {
    id: "ana-modal-interchange-tour", title: "Modal interchange: borrowing from the parallel minor", artist: "Illustration (original)",
    genre: "theory", level: 3, key: "C", tempo: 84, meter: "4/4", tags: ["modal-interchange", "borrowed-chords", "bVI", "bVII", "iv"],
    summary: "**Modal interchange** (borrowing, or mixture) means using chords from a *parallel* key, one with the same tonic but a different mode, without actually changing key. In C major the most common loans come from C minor: **iv (Fm), bVI (Ab), bVII (Bb), bIII (Eb), ii° (Dm7♭5)**.\n\nEach one adds a flat note (Ab, Bb or Eb) to the bright major key. The result is the bittersweet, heroic or 'rock' colour you hear in the Beatles, Bowie, film scores and video games. This piece runs through the main loans so you can hear each one against the plain diatonic chord it replaces.",
    sections: [
      { name: "1. bVI–bVII–I (the 'victory' cadence)", chart: "| I:maj | IV:maj | bVI:maj bVII:maj | I:maj |",
        notes: [
          { bar: 3, text: "Ab → Bb → C: three major chords stepping up by whole steps, all borrowed except the last. It is the triumphant end-of-level sound of games and arena rock. Bb works like a dominant without a leading tone.", concepts: ["ana-modal-interchange", "ana-mixolydian-bvii"] } ],
        subs: [
          { bar: 3, chord: 1, options: [
            { token: "V:maj", label: "G (diatonic V)", why: "The 'correct' approach. Comparing it with Bb shows how the borrowed chord swaps a leading-tone pull for a broad, modal lift.", concepts: ["ana-authentic-cadence"] },
            { token: "bVII:7", label: "Bb7 (backdoor)", why: "Adding the Ab turns the rock bVII into the jazz backdoor dominant.", concepts: ["ana-backdoor"] } ] } ] },
      { name: "2. bIII and iv", chart: "| I:maj | bIII:maj | IV:maj iv:min | I:maj |",
        notes: [
          { bar: 2, text: "Eb major in a C major song: a chromatic mediant (root a minor third up). G is shared, and C→Bb and E→Eb pull downward.", concepts: ["ana-modal-interchange", "ana-chromatic-mediant"] },
          { bar: 3, text: "IV → iv: the A → Ab sigh, the minor plagal cadence.", concepts: ["ana-plagal-cadence"] } ] },
      { name: "3. ii° and iv in a ii–V", chart: "| I:maj7 | vi:m7 | ii:m7b5 | V:7b9 | I:maj7 | % |",
        notes: [
          { bar: 3, text: "Dm7♭5 is ii borrowed from C minor (D F Ab C). Its Ab carries straight into the b9 of G7♭9 (also Ab). This *minor ii–V into a major I* is a standard jazz colour.", concepts: ["ana-modal-interchange", "ana-ii-v-i"] } ] } ],
    compare: [
      { type: "compare", key: "C", chart: "| I:maj | IV:maj | ii:min | I:maj |", target: "ii:min",
        options: [ { token: "ii:min", label: "Dm: diatonic ii" }, { token: "iv:min", label: "Fm: borrowed iv" }, { token: "ii:m7b5", label: "Dm7♭5: borrowed ii°" },
                   { token: "bVII:maj", label: "Bb: borrowed bVII" }, { token: "bVI:maj", label: "Ab: borrowed bVI" } ],
        explain: "The same slot holds five chords. Go down the list and the colour grows darker and more 'filmic': each borrowed chord brings one or two flat notes from C minor (Ab, Bb) into the bright key." } ],
    source: "Original illustration; modal mixture as presented in Open Music Theory ('Modal mixture') and the Berklee approach to modal interchange."
  },
  {
    id: "ana-secondary-dominants-tour", title: "Secondary dominants: every chord gets its own V", artist: "Illustration (original)",
    genre: "theory", level: 4, key: "C", tempo: 96, meter: "4/4", tags: ["secondary-dominant", "tonicization", "extended-dominants", "ii-v"],
    summary: "Any major or minor diatonic chord can be **tonicized**, made to feel like a temporary tonic, by putting *its* dominant in front of it. That borrowed V is a **secondary dominant**, written V/x: in C, V/ii = A7 (→ Dm), V/V = D7 (→ G), V/vi = E7 (→ Am).\n\nEach secondary dominant adds one 'foreign' note, the leading tone of its target (C# for Dm, F# for G, G# for Am). When dominants chain, each resolving to the next (A7 → D7 → G7 → C), you get **extended dominants**: the bridge of Rhythm Changes and of 'Sweet Georgia Brown'. Add the matching ii in front and you get secondary ii–Vs, the language of bebop.",
    sections: [
      { name: "1. One secondary dominant per chord", chart: "| I:maj | V/vi:7 | vi:min | V/ii:7 | ii:min | V/V:7 | V:7 | I:maj |",
        notes: [
          { bar: 2, text: "E7, with G# as the leading tone of A. The Am arrives feeling like a little tonic.", concepts: ["ana-secondary-dominant"] },
          { bar: 4, text: "A7, with C# pulling to D.", concepts: ["ana-secondary-dominant"] },
          { bar: 6, text: "D7, with F# pulling to G. V/V is the most common secondary dominant of all; it turns up everywhere from Bach to the Beatles.", concepts: ["ana-secondary-dominant"] } ],
        subs: [
          { bar: 2, options: [
            { token: "V/vi:7b9", label: "E7♭9", why: "The b9 (F) belongs to A harmonic minor, the key being tonicized. It sounds more 'minor-target' and darker.", concepts: ["ana-dominant-colors"] },
            { token: "bVII:7", label: "Bb7 (tritone sub of E7)", why: "Bb7 shares the tritone G#/D with E7, but its root slides down a half step to A.", concepts: ["ana-tritone-sub"] } ] } ] },
      { name: "2. Extended dominants (chain)", chart: "| V/ii:7 | % | V/V:7 | % | V:7 | % | I:maj | % |",
        notes: [
          { bar: 1, text: "A7 → D7 → G7 → C: each 'resolves' to another dominant, so the music never rests until the end. Roots fall in fifths around the cycle.", concepts: ["ana-secondary-dominant"] },
          { bar: 3, text: "The tritone moves down a half step every two bars: C#/G → C/F# → B/F. Play only the 3rds and 7ths to hear it.", concepts: ["ana-tritone-sub"] } ] },
      { name: "3. Secondary ii–Vs", chart: "| I:maj7 | ii/ii:m7b5 V/ii:7 | ii:m7 | ii/V:m7 V/V:7 | ii:m7 V:7 | I:maj7 |",
        notes: [
          { bar: 2, text: "Em7♭5–A7 is a *minor* ii–V aimed at Dm.", concepts: ["ana-ii-v-i", "ana-secondary-dominant"] },
          { bar: 4, text: "Am7–D7 is a *major* ii–V aimed at G, which never arrives: Dm7 slips in instead. That deceptive resolution keeps the chain moving.", concepts: ["ana-ii-v-i", "ana-deceptive-cadence"] } ] } ],
    compare: [
      { type: "compare", key: "C", chart: "| I:maj7 | V/ii:7 | ii:m7 | V:7 |", target: "V/ii:7",
        options: [ { scale: "phrygian-dominant", label: "A Phrygian dominant (D harmonic minor)" }, { scale: "mixolydian", label: "A Mixolydian" },
                   { scale: "altered", label: "A altered" }, { scale: "diminished-hw", label: "A half-whole diminished" } ],
        explain: "A7 is heading to D *minor*. Phrygian dominant gives you Bb and F, notes of the target key, so the line flows into Dm. Mixolydian's F# and B point to D *major*; once Dm arrives, that F# sounds wrong. Altered and half-whole add tension but still contain Bb." } ],
    source: "Original illustration; secondary and extended dominants as in Open Music Theory ('Applied chords') and the bridge of Rhythm Changes."
  },
  {
    id: "ana-film-harmony", title: "Film harmony: chromatic mediants and the Lydian lift", artist: "Illustration (original, in the style of modern film scores)",
    genre: "film", level: 5, key: "C", tempo: 66, meter: "4/4", tags: ["chromatic-mediant", "lydian", "film", "pedal-point", "wonder"],
    summary: "Two sounds define a lot of film and game music.\n\n**1. The Lydian lift**: I → II over a tonic pedal (C → D/C). The D triad brings in F#, the #4 of C, the note that makes Lydian 'float'. Composers reach for it to suggest wonder, flight, space and magic.\n\n**2. Chromatic mediants**: major triads whose roots are a third apart but come from *different* keys (C ↔ E, C ↔ Ab, C ↔ A, C ↔ Eb). They share one common tone, and every other voice moves by a half or whole step. The change sounds magical or heroic rather than functional, because nothing about it is 'leading' anywhere.\n\nThe third section takes the same idea into minor: Cm ↔ Abm and Cm ↔ Em, the 'mystery' and 'villain' mediants.",
    sections: [
      { name: "1. Lydian lift (I – II/I)", chart: "| I:maj | II:maj/b7 | I:maj | II:maj/b7 |",
        notes: [
          { bar: 2, text: "D/C keeps the C bass, so C stays home while the D triad adds F#. Together they spell C Lydian: C D E F# G A. Hold the bass and let the triads float above it.", concepts: ["ana-mode-brightness", "ana-pedal-point"] } ],
        subs: [
          { bar: 2, options: [
            { token: "I:maj7#11", label: "Cmaj7#11", why: "The same colour stacked into one chord: the Lydian tonic as a single sound.", concepts: ["ana-mode-brightness"] },
            { token: "IV:maj/5", label: "F/C (plain Ionian)", why: "The diatonic equivalent. It sounds warm and hymn-like rather than airborne; the only difference is F versus F#.", concepts: ["ana-pedal-point"] } ] } ] },
      { name: "2. Major chromatic mediants", chart: "| I:maj | III:maj | bVI:maj | I:maj |",
        notes: [
          { bar: 2, text: "C → E: the common tone is E, and C→B and G→G# move by half step. It is bright and lifting, with a sense of revelation.", concepts: ["ana-chromatic-mediant"] },
          { bar: 3, text: "E → Ab (= G#): G# is held while E→Eb and B→C move. These are two chromatic mediants in a row. Neither chord belongs to C major, yet the return to C sounds inevitable.", concepts: ["ana-chromatic-mediant"] },
          { bar: 4, text: "Ab → C: C is the common tone, and Ab→G and Eb→E move. Notice that no dominant chord appears anywhere; the movement comes entirely from smooth voice leading." } ],
        subs: [
          { bar: 2, options: [
            { token: "iii:min", label: "Em (diatonic mediant)", why: "The diatonic relative. It shares two notes with C, so it is barely a change. Making it major (E) adds the G#, and the magic appears.", concepts: ["ana-chromatic-mediant"] },
            { token: "bIII:maj", label: "Eb (flat mediant)", why: "The darker direction. Eb shares G with C, and the borrowed Eb and Bb drag the mood down.", concepts: ["ana-modal-interchange"] },
            { token: "VI:maj", label: "A major", why: "The chromatic mediant above the relative minor, a heroic, bright lift (C# is the new note).", concepts: ["ana-chromatic-mediant"] } ] } ] },
      { name: "3. Minor mediants (mystery)", chart: "| i:min | bvi:min | i:min | iii:min |",
        notes: [
          { bar: 2, text: "Cm → Abm (Ab Cb Eb): Eb is held while C→Cb and G→Ab move by half step. It is eerie, a staple of fantasy and horror cues.", concepts: ["ana-chromatic-mediant"] },
          { bar: 4, text: "Cm → Em (E G B): G is held while C→B and Eb→E move. It sounds unstable and uncanny, as if the floor tilted.", concepts: ["ana-chromatic-mediant"] } ] } ],
    compare: [
      { type: "compare", key: "C", chart: "| I:maj | III:maj | I:maj | % |", target: "III:maj",
        options: [ { token: "iii:min", label: "Em: diatonic mediant" }, { token: "III:maj", label: "E: chromatic mediant (up)" }, { token: "bVI:maj", label: "Ab: chromatic mediant (down)" },
                   { token: "VI:maj", label: "A: chromatic submediant" }, { token: "bIII:maj", label: "Eb: flat mediant" } ],
        explain: "Every option keeps exactly one note of C major in common, except Em, which keeps two. Listen for the held note, then for the half-step slides around it. Brighter results (E, A) add sharps; darker ones (Ab, Eb) add flats." },
      { type: "compare", key: "C", chart: "| I:maj | % | I:maj | % |", target: "I:maj",
        options: [ { scale: "lydian", label: "C Lydian: #4, floating" }, { scale: "ionian", label: "C Ionian: plain major" }, { scale: "mixolydian", label: "C Mixolydian: b7, earthy" } ],
        explain: "Over the same chord, only one note changes from option to option: F# (Lydian), F (Ionian), or Bb with F (Mixolydian). Lydian's #4 never wants to resolve, which is why it sounds suspended in the air." } ],
    source: "Original illustration; chromatic mediant definition per Open Music Theory and Frank Lehman's work on film harmony (Hollywood Harmony, 2018), paraphrased."
  },
  {
    id: "ana-line-cliches", title: "Line clichés: one moving voice inside a held chord", artist: "Illustration (original)",
    genre: "theory", level: 4, key: "Am", tempo: 80, meter: "4/4", tags: ["line-cliche", "voice-leading", "descending-bass", "minor"],
    summary: "A **line cliché** keeps a chord in place while one voice moves chromatically through it. The harmony barely changes, but the moving line generates all the motion.\n\n- **Minor descending** (inner voice): Am → Am(maj7) → Am7 → Am6, i.e. A–G#–G–F#. This is 'My Funny Valentine' and countless spy and bond-style cues.\n- **The same line in the bass**: Am → Am/G# → Am/G → D/F#. It leads to the Stairway / 'While My Guitar Gently Weeps' family of descending basses.\n- **Major ascending**: C → C+ → C6 → C7 (5 → #5 → 6 → b7). This is the showtune climb before IV.\n\nOn guitar, keep a barre or triad shape and move one finger.",
    sections: [
      { name: "1. Minor, inner voice", chart: "| i:min | i:mMaj7 | i:m7 | i:m6 |",
        notes: [
          { bar: 1, text: "Play it on strings 4-3-2 (Am at the 5th fret, or open). The top or inner A is the voice that will move." },
          { bar: 2, text: "A → G#: the major 7th sounds tense and noir-ish.", concepts: ["ana-line-cliche"] },
          { bar: 4, text: "F#, the 6th. Am6 = A C E F#, the Dorian colour. It sets up D or E nicely.", concepts: ["ana-line-cliche", "ana-dorian-iv"] } ],
        subs: [
          { bar: 4, options: [
            { token: "IV:9", label: "D9", why: "Am6 without the A is just D9 without its root. Moving to D9 turns the cliché into i → IV, the Dorian vamp.", concepts: ["ana-dorian-iv"] },
            { token: "vi:m7b5", label: "F#m7♭5 (same notes, new bass)", why: "Am6 (A C E F#) and F#m7♭5 (F# A C E) are the same four notes. Put F# in the bass and the cliché turns into the ii of a minor ii–V towards E minor (F#ø–B7–Em).", concepts: ["ana-ii-v-i", "ana-line-cliche"] } ] } ] },
      { name: "2. Minor, bass line", chart: "| i:min | i:min/7 | i:min/b7 | IV:maj/3 | bVI:maj7 | % | V:7 | % |",
        notes: [
          { bar: 2, text: "Now the moving voice is the bass: A → G# → G → F#.", concepts: ["ana-line-cliche", "ana-bass-line"] },
          { bar: 4, text: "D/F#: the line lands on a real chord, IV major, borrowed from A Dorian.", concepts: ["ana-dorian-iv"] },
          { bar: 5, text: "F → E: Fmaj7 to E7, the b6 → 5 Phrygian half-step descent that also ends the Andalusian cadence.", concepts: ["ana-andalusian"] } ] },
      { name: "3. Major, ascending", chart: "| bIII:maj | bIII:aug | bIII:6 | bIII:7 | bVI:maj | % |",
        notes: [
          { bar: 2, text: "C → C+: G rises to G#. This is the augmented triad's natural job, a passing chord.", concepts: ["ana-line-cliche"] },
          { bar: 4, text: "C7: the line arrives at Bb, so the chord becomes V/IV and resolves to F. The climb has turned into a secondary dominant.", concepts: ["ana-secondary-dominant"] } ] } ],
    compare: [
      { type: "compare", key: "Am", chart: "| i:min | i:mMaj7 | i:m7 | i:m6 |", target: "i:mMaj7",
        options: [ { scale: "harmonic-minor", label: "A harmonic minor: G# and F" }, { scale: "melodic-minor", label: "A melodic minor: G# and F#" } ],
        explain: "Over Am(maj7) both scales contain G#. The difference is the 6th: harmonic minor's F sounds exotic and Spanish, melodic minor's F# sounds smooth and jazzy, and it anticipates the Am6 two bars later." } ],
    source: "Original illustration; line cliché as described in jazz and songwriting pedagogy (e.g. Berklee harmony texts)."
  },
  {
    id: "ana-pedal-points", title: "Pedal points: chords moving over a held bass", artist: "Illustration (original)",
    genre: "theory", level: 4, key: "C", tempo: 72, meter: "4/4", tags: ["pedal-point", "slash-chords", "tonic-pedal", "dominant-pedal"],
    summary: "A **pedal point** is a note held, usually in the bass, while the harmony above it changes, even when the chords clash with it. It is named after the organ pedals.\n\n- A **tonic pedal** (the root held) makes everything above it sound anchored and calm. It is how a piece settles at its very end, and how ambient, drone and film music create stasis.\n- A **dominant pedal** (5 held) builds suspense: the ear knows V must resolve, so every chord over it becomes part of a long wind-up. Bach's preludes and every EDM build-up use it.\n\nOn guitar, open strings are natural pedals: let the low E or A ring while you move shapes up the neck.",
    sections: [
      { name: "1. Tonic pedal", chart: "| I:maj | IV:maj/5 | V:maj/4 | I:maj |",
        notes: [
          { bar: 2, text: "F/C: F major over C. The bass doesn't move, so even the subdominant feels like a decoration of C.", concepts: ["ana-pedal-point"] },
          { bar: 3, text: "G/C: G major over C. The bass C clashes with B and D and creates mild dissonance, but the pedal 'licenses' it. This is the I–IV–V–I gesture compressed into a single sustained bass.", concepts: ["ana-pedal-point", "ana-bass-line"] } ],
        subs: [
          { bar: 3, options: [
            { token: "bVII:maj/2", label: "Bb/C", why: "A Mixolydian version over the tonic pedal, typical of rock and gospel endings. Bb/C is effectively a C9sus4 sound.", concepts: ["ana-mixolydian-bvii", "ana-sus-dominant"] },
            { token: "II:maj/b7", label: "D/C (Lydian)", why: "Swap in II over the pedal and the F# turns the passage into C Lydian, which is the film 'wonder' sound.", concepts: ["ana-mode-brightness"] } ] } ] },
      { name: "2. Dominant pedal", chart: "| V:maj | I:maj/5 | V:7sus4 | V:7 | I:maj |",
        notes: [
          { bar: 2, text: "C/G: the tonic chord with G still in the bass, the **cadential 6/4**. It sounds like C but behaves like G, because the G bass makes it a decoration of the dominant.", concepts: ["ana-pedal-point", "ana-authentic-cadence"] },
          { bar: 3, text: "G7sus4: C hangs over from the previous chord and resolves to B in the next bar. This is how Bach extends the final dominant pedal of the C major Prelude.", concepts: ["ana-sus-dominant"] },
          { bar: 5, text: "The pedal finally releases and the bass moves to C. The longer the pedal, the bigger the release." } ] } ],
    compare: [
      { type: "compare", key: "C", chart: "| I:maj | IV:maj/5 | V:maj/4 | I:maj |", target: "V:maj/4",
        options: [ { token: "V:maj/4", label: "G/C: dominant over the tonic pedal" }, { token: "V:maj", label: "G: bass moves" }, { token: "bVII:maj/2", label: "Bb/C: Mixolydian pedal" } ],
        explain: "With the pedal, the cadence feels like breathing in and out on one spot. Let the bass move to G and the same chords start a journey." } ],
    source: "Original illustration; pedal point and cadential 6/4 per Open Music Theory; Bach's dominant pedal per the BWV 846 analysis in this library."
  },
  {
    id: "ana-tritone-subs", title: "Tritone substitution: the half-step way home", artist: "Illustration (original)",
    genre: "jazz", level: 5, key: "C", tempo: 120, meter: "4/4", tags: ["tritone-sub", "ii-v-i", "chromatic-bass", "reharmonization"],
    summary: "Any dominant 7th chord can be replaced by the dominant 7th a **tritone** away: G7 ↔ Db7. The two chords share their 3rd and 7th, the tritone itself (G7: B and F; Db7: F and Cb = B), so they do the same job. The sub's root, though, slides down a half step into the target, which gives a smooth chromatic bass: Dm7 → Db7 → Cmaj7.\n\nUpper-structure bonus: Db7's notes are G7's altered tensions (Db = b5, Ab = b9, Cb = 3). So playing **Db Lydian dominant over G7** is the same as playing **G altered**. Tritone subs can be applied to secondary dominants too, and the ii can be subbed along with the V (Abm7–Db7).",
    sections: [
      { name: "1. V7 vs bII7", chart: "| ii:m7 | V:7 | I:maj7 | % | ii:m7 | bII:7 | I:maj7 | % |",
        notes: [
          { bar: 2, text: "G7: the bass falls a fifth, D → G → C.", concepts: ["ana-ii-v-i"] },
          { bar: 6, text: "Db7: the bass falls by half steps, D → Db → C. Upper voices: F and Cb (=B) are exactly the tritone of G7.", concepts: ["ana-tritone-sub"] } ],
        subs: [
          { bar: 6, options: [
            { token: "bII:7#11", label: "Db7#11", why: "The #11 of Db7 is G, the root of the chord being replaced. That is the classic voicing of a tritone sub.", concepts: ["ana-tritone-sub", "ana-lydian-dominant"] },
            { token: "bII:maj7", label: "Dbmaj7 (Neapolitan colour)", why: "Not a dominant at all, but it still slides by a half step. It is the Tadd Dameron / 'Lady Bird' turnaround sound.", concepts: ["ana-tadd-turnaround", "ana-neapolitan"] } ] } ] },
      { name: "2. Subbed turnaround (I–bIII7–ii–bII7)", chart: "| I:maj7 bIII:7 | ii:m7 bII:7 | I:maj7 bIII:7 | ii:m7 bII:7 |",
        notes: [
          { bar: 1, text: "Eb7 replaces A7 (V/ii). Its tritone, G and Db (= C#), is the same as A7's. Bass: C → Eb → D → Db → C, a chromatic descent.", concepts: ["ana-tritone-sub", "ana-secondary-dominant"] } ] },
      { name: "3. Sub the ii too", chart: "| ii:m7 V:7 | bvi:m7 bII:7 | I:maj7 | % |",
        notes: [
          { bar: 2, text: "Abm7–Db7 is a whole ii–V a tritone away from Dm7–G7. It sounds like a sudden key shift that resolves down a half step. Bird and Coltrane use it constantly.", concepts: ["ana-tritone-sub", "ana-ii-v-i"] } ] } ],
    compare: [
      { type: "compare", key: "C", chart: "| ii:m7 | V:7 | I:maj7 | % |", target: "V:7",
        options: [ { token: "V:7", label: "G7: fifth-fall" }, { token: "bII:7", label: "Db7: half-step slide" }, { token: "V:7b9", label: "G7♭9: altered V" }, { token: "bII:7#11", label: "Db7#11: tritone sub with G on top" } ],
        explain: "Play the four back to back and you'll find Db7 and G7♭9 closer than they look: both contain Ab, F and B. The tritone sub is really a re-spelled altered dominant with a new bass note." },
      { type: "compare", key: "C", chart: "| ii:m7 | V:7 | I:maj7 | % |", target: "V:7",
        options: [ { scale: "mixolydian", label: "G Mixolydian: inside" }, { scale: "altered", label: "G altered (= Ab melodic minor)" } ],
        explain: "G altered = G Ab Bb B Db Eb F, which is Db Lydian dominant starting from G. Soloing 'altered over G7' and 'Lydian dominant over the tritone sub' are the same notes." } ],
    source: "Original illustration; tritone substitution as in Mark Levine's The Jazz Theory Book and standard jazz pedagogy."
  },
  {
    id: "ana-coltrane-changes-demo", title: "Coltrane changes: ii–V–I through three keys", artist: "Illustration (original, after John Coltrane's 'Countdown' approach)",
    genre: "jazz", level: 8, key: "C", tempo: 160, meter: "4/4", tags: ["coltrane-changes", "major-thirds", "giant-steps", "reharmonization"],
    summary: "**Coltrane changes** split the octave into three equal parts, keys a major third apart (C, Ab, E), and visit each through its own dominant. Coltrane used them to reharmonise ordinary ii–V–Is ('Countdown' is built on 'Tune Up'; '26-2' on 'Confirmation'), and wrote 'Giant Steps' entirely around the cycle.\n\nThe trick: a two-bar ii–V–I (Dm7 | G7 | Cmaj7) becomes **Dm7 Eb7 | Abmaj7 B7 | Emaj7 G7 | Cmaj7**. The start and the destination are the same, but in between the music passes through Ab and E. Each key change is a **chromatic mediant** and each arrival is prepared by its own V7, so the line stays logical even as it modulates every two beats.",
    sections: [
      { name: "1. Plain ii–V–I", chart: "| ii:m7 | V:7 | I:maj7 | % |",
        notes: [ { bar: 1, text: "The skeleton Coltrane starts from.", concepts: ["ana-ii-v-i"] } ] },
      { name: "2. Coltrane substitution", chart: "| ii:m7 bIII:7 | bVI:maj7 VII:7 | III:maj7 V:7 | I:maj7 |",
        notes: [
          { bar: 1, text: "Dm7 → Eb7: Eb7 is V of Ab. Dm7 still works as a 'ii' to be answered, but the answer is redirected.", concepts: ["ana-coltrane-changes"] },
          { bar: 2, text: "Abmaj7 (key 2), then B7 = V of E.", concepts: ["ana-coltrane-changes", "ana-chromatic-mediant"] },
          { bar: 3, text: "Emaj7 (key 3), then G7, the original dominant, back to C. The tonics C, Ab and E form an augmented triad, and the dominants Eb7, B7 and G7 form another.", concepts: ["ana-coltrane-changes"] },
          { bar: 4, text: "Home. Practise by arpeggiating 1-2-3-5 of each chord: the cells sit close together on the neck if you choose positions carefully." } ],
        subs: [
          { bar: 2, chord: 1, options: [
            { token: "IV:7", label: "F7 (tritone sub of B7)", why: "F7 shares B7's tritone (A/D#) and slides by half step into Emaj7. The bass becomes Ab → F → E, which smooths out one of the big leaps in the cycle.", concepts: ["ana-tritone-sub"] } ] } ] },
      { name: "3. Cycle over a long tonic", chart: "| I:maj7 bIII:7 | bVI:maj7 VII:7 | III:maj7 V:7 | I:maj7 |",
        notes: [ { bar: 1, text: "The same cycle can replace four bars of plain Cmaj7. This is how 'Giant Steps'-style motion gets dropped into a standard.", concepts: ["ana-coltrane-changes"] } ] } ],
    compare: [
      { type: "compare", key: "C", chart: "| ii:m7 bIII:7 | bVI:maj7 VII:7 | III:maj7 V:7 | I:maj7 |", target: "VII:7",
        options: [ { scale: "mixolydian", label: "B Mixolydian" }, { scale: "altered", label: "B altered" }, { scale: "major-pentatonic", label: "B major pentatonic (pure 'inside')" } ],
        explain: "At this tempo, chord tones matter most. Mixolydian and major pentatonic sound like clear arrivals on each key. Altered gives a smoother pull into Emaj7 but blurs the key change." } ],
    source: "Original illustration; Coltrane substitution formula per Wikipedia ('Coltrane changes') and Levine, The Jazz Theory Book."
  },
  {
    id: "ana-modes-darkness", title: "Increasing darkness: seven modes on one root", artist: "Illustration (original)",
    genre: "theory", level: 3, key: "C", tempo: 84, meter: "4/4", tags: ["modes", "brightness", "modal-vamp", "drone"],
    summary: "Put all seven modes on the same root (C) and order them by how many notes are lowered compared with Lydian. You get a smooth slide from brightest to darkest. Each step flattens exactly **one** note:\n\n**Lydian** (#4) → **Ionian** (F) → **Mixolydian** (Bb) → **Dorian** (Eb) → **Aeolian** (Ab) → **Phrygian** (Db) → **Locrian** (Gb).\n\nEach section is a two-chord vamp built from the mode's *characteristic* chord, the one containing its signature note. These are the vamps you'd hear in modal tunes, film cues and rock songs. Play one, then improvise with the matching mode over a C drone.",
    sections: [
      { name: "Lydian: I – II", chart: "| I:maj | II:maj | I:maj | II:maj |",
        notes: [ { bar: 2, text: "D major supplies the F# (#4). It sounds dreamy and floating.", concepts: ["ana-mode-brightness"] } ] },
      { name: "Ionian: I – IV – V", chart: "| I:maj | IV:maj | V:maj | I:maj |",
        notes: [ { bar: 3, text: "The leading tone (B) and the natural 4th (F) together make the tritone, and with it functional harmony.", concepts: ["ana-mode-brightness", "ana-authentic-cadence"] } ] },
      { name: "Mixolydian: I – bVII", chart: "| I:maj | bVII:maj | I:maj | bVII:maj |",
        notes: [ { bar: 2, text: "Bb major brings the b7. It is the sound of rock, blues and Celtic music.", concepts: ["ana-mode-brightness", "ana-mixolydian-bvii"] } ] },
      { name: "Dorian: i – IV", chart: "| i:m7 | IV:maj | i:m7 | IV:maj |",
        notes: [ { bar: 2, text: "F *major* in a minor key: its A natural is the Dorian major 6th. It sounds minor but hopeful; think funk vamps and 'Oye Como Va'.", concepts: ["ana-mode-brightness", "ana-dorian-iv"] } ] },
      { name: "Aeolian: i – bVI – bIII – bVII", chart: "| i:min | bVI:maj | bIII:maj | bVII:maj |",
        notes: [ { bar: 2, text: "Ab major brings the b6, the 'sad' note. This four-chord loop is the epic-minor sound of trailers and power ballads.", concepts: ["ana-mode-brightness"] } ] },
      { name: "Phrygian: i – bII", chart: "| i:min | bII:maj | i:min | bII:maj |",
        notes: [ { bar: 2, text: "Db major brings the b2. It sounds dark and Spanish, and metal riffs live here.", concepts: ["ana-mode-brightness", "ana-andalusian"] } ] },
      { name: "Locrian: i° – bII", chart: "| i:m7b5 | bII:maj7 | i:m7b5 | bII:maj7 |",
        notes: [ { bar: 1, text: "Even the tonic chord is unstable, because the b5 (Gb) undermines it. Locrian works as a colour, rarely as a key.", concepts: ["ana-mode-brightness"] } ],
        subs: [
          { bar: 1, options: [
            { token: "i:min", label: "Cm (Phrygian return)", why: "Restore the natural 5th and you step one notch brighter, back into Phrygian. It is the last 'usable' dark mode.", concepts: ["ana-mode-brightness"] } ] } ] } ],
    compare: [
      { type: "compare", key: "C", chart: "| I:maj | % | I:maj | % |", target: "I:maj",
        options: [ { scale: "lydian", label: "Lydian (#4)" }, { scale: "ionian", label: "Ionian" }, { scale: "mixolydian", label: "Mixolydian (b7)" } ],
        explain: "The three major modes: listen for the single changing note. F# floats, F wants to resolve to E, and Bb adds a bluesy pull." },
      { type: "compare", key: "C", chart: "| i:min | % | i:min | % |", target: "i:min",
        options: [ { scale: "dorian", label: "Dorian (6)" }, { scale: "aeolian", label: "Aeolian (b6)" }, { scale: "phrygian", label: "Phrygian (b2)" } ],
        explain: "The three minor modes: A natural (Dorian) sounds soulful, Ab (Aeolian) mournful, Db (Phrygian) menacing." } ],
    source: "Original illustration; the 'brightness' ordering of modes as taught in modal jazz and composition pedagogy."
  },
  {
    id: "ana-neo-soul-colors", title: "Neo-soul colours: IVmaj9 loops, chromatic m7s and sus dominants", artist: "Illustration (original, in a neo-soul style)",
    genre: "soul", level: 6, key: "Eb", tempo: 76, meter: "4/4", tags: ["neo-soul", "extensions", "sus", "chromatic", "loop"],
    summary: "Neo-soul (D'Angelo, Erykah Badu, Robert Glasper and the many players influenced by them) builds loops from jazz chords but **avoids the tonic**: songs often start and circle around IV, and dominants are suspended rather than resolved. Three habits to hear here:\n- **IVmaj9** as the 'home' chord of the loop.\n- **Chromatic minor 7ths** sliding down by half steps (Gm7 → Gbm7 → Fm7).\n- **Sus dominants** (Bb9sus4) that hover instead of pulling, with a borrowed **iv m9** for the minor-plagal sigh.\n\nVoice these as small 4-note grips on the middle strings, with the 9ths on top, and play behind the beat.",
    sections: [
      { name: "1. The loop", chart: "| IV:maj9 | iii:m7 V/ii:7#9 | ii:m9 | V:9sus4 |",
        notes: [
          { bar: 1, text: "Abmaj9: the loop 'lives' on IV and never resolves cleanly to Eb. That openness is the style.", concepts: ["ana-axis"] },
          { bar: 2, text: "Gm7 → C7#9: iii, then the secondary dominant of ii. The #9 (D#/Eb) is also the key's tonic, a bluesy overlap.", concepts: ["ana-secondary-dominant", "ana-dominant-colors"] },
          { bar: 4, text: "Bb9sus4 = Ab triad over Bb. A dominant that hovers. It loops back to Abmaj9 rather than resolving to Eb.", concepts: ["ana-sus-dominant"] } ],
        subs: [
          { bar: 4, options: [
            { token: "V:13sus4", label: "Bb13sus4", why: "The 13th (G) adds even more air. It is the gospel and neo-soul pre-resolution chord.", concepts: ["ana-sus-dominant"] },
            { token: "bII:maj7", label: "Fbmaj7 (sounds as Emaj7)", why: "A major 7th chord a half step above the tonic, sliding down into Eb. It is a chromatic planing move, a Neapolitan colour used as a modern approach chord.", concepts: ["ana-neapolitan"] } ] } ] },
      { name: "2. Chromatic slide + minor iv", chart: "| IV:maj9 | iv:m9 | iii:m7 biii:m7 | ii:m9 V:9sus4 |",
        notes: [
          { bar: 2, text: "Abmaj9 → Abm9: the borrowed minor iv. C falls to Cb (B), which is the minor plagal sigh with jazz extensions.", concepts: ["ana-modal-interchange", "ana-plagal-cadence"] },
          { bar: 3, text: "Gm7 → Gbm7 → (Fm9): parallel minor 7ths sliding down by half steps. Gbm7 isn't functional; it is **planing**, the same grip moved down a fret.", concepts: ["ana-bass-line"] } ] } ],
    compare: [
      { type: "compare", key: "Eb", chart: "| IV:maj9 | iii:m7 V/ii:7#9 | ii:m9 | V:9sus4 |", target: "V/ii:7#9",
        options: [ { scale: "altered", label: "C altered: #9, b9, b13" }, { scale: "diminished-hw", label: "C half-whole: #9 with natural 13" }, { scale: "mixolydian-b6", label: "C Mixolydian b6 (F harmonic-minor-ish)" } ],
        explain: "C7#9 is heading to Fm9. Altered gives the slinkiest pull (Db and Ab fall into Fm). Half-whole keeps the A natural, a brighter, funkier tension. Mixolydian b6 keeps the 9th natural and sounds more 'soul' than 'bebop'." } ],
    source: "Original illustration of common neo-soul harmonic devices; style description paraphrased from general jazz/neo-soul pedagogy."
  },
  {
    id: "ana-andalusian-cadence", title: "The Andalusian cadence (flamenco)", artist: "Traditional (flamenco / Spanish)",
    genre: "flamenco", level: 3, key: "Am", tempo: 104, meter: "4/4", tags: ["andalusian", "phrygian", "flamenco", "descending-bass", "harmonic-minor"],
    strum: "D-DUX-DU",
    summary: "**Am – G – F – E**: four chords stepping down the minor tetrachord (A–G–F–E). It is the oldest chord progression still in daily use: flamenco, Renaissance dances, 'Hit the Road Jack', 'Walk Don't Run', 'Hotel California' (a long-form cousin), surf rock and metal.\n\nFlamenco hears it from the other end. **E is home**, and the progression is iv–bIII–bII–I in **E Phrygian dominant**: the F → E half step (bII → I) is the cadence. That is why it never sounds like it 'ends' on A. The E chord is major (G#, borrowed from A harmonic minor), and the clash between that G# and the G natural of the second chord is the flavour.",
    sections: [
      { name: "1. The cadence (minor-key view)", chart: "| i:min | bVII:maj | bVI:maj | V:maj |",
        notes: [
          { bar: 1, text: "The bass line A–G–F–E is the descending minor tetrachord, also called the lament bass.", concepts: ["ana-andalusian", "ana-bass-line"] },
          { bar: 2, text: "G major: G natural from natural minor.", concepts: ["ana-andalusian"] },
          { bar: 4, text: "E major: G# from harmonic minor. G and G# a bar apart is the Spanish 'cross-relation'.", concepts: ["ana-andalusian", "ana-dominant-colors"] } ],
        subs: [
          { bar: 3, options: [
            { token: "bVI:maj7", label: "Fmaj7", why: "Adds E on top, which anticipates the next chord's root. This is the jazz/bossa version (as in Hotel California-style ballads).", concepts: ["ana-andalusian"] },
            { token: "bVI:7", label: "F7", why: "F7 is the tritone sub of B7 (V of E), so it slides by half step into the E chord. This is the jazz-flamenco crossover sound.", concepts: ["ana-tritone-sub"] } ] },
          { bar: 4, options: [
            { token: "V:7b9", label: "E7♭9", why: "The b9 (F) is the Phrygian bII as a tension inside the chord. It is the classic flamenco/jazz crossover voicing.", concepts: ["ana-dominant-colors"] } ] } ] },
      { name: "2. Flamenco view: E is home", chart: "| V:maj | bVI:maj | V:maj | % | i:min | bVII:maj | bVI:maj | V:maj |",
        notes: [
          { bar: 2, text: "F → E: the Phrygian cadence (bII → I in E). On guitar, the open E shape and F (1st fret) shape are the backbone of *por arriba* playing.", concepts: ["ana-andalusian", "ana-half-cadence"] },
          { bar: 5, text: "From E's point of view, Am–G–F–E is iv–bIII–bII–I. The 'tonic' of the Andalusian cadence depends on where you stop." } ] } ],
    compare: [
      { type: "compare", key: "Am", chart: "| i:min | bVII:maj | bVI:maj | V:maj |", target: "V:maj",
        options: [ { scale: "phrygian-dominant", label: "E Phrygian dominant (A harmonic minor)" }, { scale: "phrygian", label: "E Phrygian (A natural minor)" }, { scale: "mixolydian", label: "E Mixolydian" } ],
        explain: "Phrygian dominant matches the chord's G# and keeps the F, the flamenco sound. Plain Phrygian's G clashes with G#, though flamenco players deliberately mix both. Mixolydian's F# and C# wipe out the Spanish colour completely." } ],
    source: "Standard progression; Wikipedia 'Andalusian cadence'; Open Music Theory on the lament bass. Example songs cited only by name."
  },
  {
    id: "ana-12-bar-blues", title: "The 12-bar blues: dominant chords as home", artist: "Traditional form",
    genre: "blues", level: 1, key: "A", tempo: 96, meter: "4/4", tags: ["blues", "12-bar", "dominant", "quick-change", "turnaround"],
    strum: "D-D-D-D-",
    summary: "The 12-bar blues is three 4-bar lines: **I** (statement), **IV → I** (response), **V → IV → I** (resolution). Its harmonic oddity is that **every chord is a dominant 7th**, including the tonic. Under classical rules A7 'should' resolve to D. In the blues it is simply home. The b7 is a blue note, and the b3 of the melody rubs against the chord's major 3rd.\n\nVariants to know: the **quick change** (IV in bar 2), the **turnaround** (V in bar 12 to restart), and the jazz blues (next analysis), which fills it with ii–Vs.",
    sections: [
      { name: "1. Basic 12-bar", chart: "| I:7 | % | % | % | IV:7 | % | I:7 | % | V:7 | IV:7 | I:7 | V:7 |",
        notes: [
          { bar: 1, text: "A7 as tonic: the b7 (G) is part of the home sound.", concepts: ["ana-blues-harmony"] },
          { bar: 5, text: "D7: A7's G becomes D7's C. The 'blue' 3rd of A (C) is now a chord tone.", concepts: ["ana-blues-harmony"] },
          { bar: 9, text: "V → IV → I: a 'backwards' cadence. The dominant relaxes into IV, then I. The blues is where the plagal habit of rock comes from.", concepts: ["ana-plagal-cadence", "ana-blues-harmony"] },
          { bar: 12, text: "The turnaround: E7 sends you back to bar 1." } ],
        subs: [
          { bar: 12, options: [
            { token: "V:7#9", label: "E7#9", why: "The #9 (G) is the blue b3 of the *key*, stacked onto the dominant. It is the Hendrix sound.", concepts: ["ana-dominant-colors"] },
            { token: "bVI:7", label: "F7 → E7 (half-step approach)", why: "A common turnaround is | A7 F7 | E7 |. F7 is a tritone sub for B7 (V/V), so it slides into E.", concepts: ["ana-tritone-sub"] } ] } ] },
      { name: "2. Quick change + turnaround", chart: "| I:7 | IV:7 | I:7 | % | IV:7 | % | I:7 | % | V:7 | IV:7 | I:7 IV:7 | I:7 V:7 |",
        notes: [
          { bar: 2, text: "The **quick change**: IV in bar 2. It breaks up four bars of tonic.", concepts: ["ana-blues-harmony"] },
          { bar: 11, text: "I–IV | I–V: the classic two-bar turnaround.", concepts: ["ana-blues-harmony"] } ] } ],
    compare: [
      { type: "compare", key: "A", chart: "| I:7 | % | IV:7 | I:7 |", target: "I:7",
        options: [ { scale: "minor-pentatonic", label: "A minor pentatonic: gritty, b3 against the major 3rd" }, { scale: "major-pentatonic", label: "A major pentatonic: sweet, country" },
                   { scale: "blues", label: "A blues: adds b5" }, { scale: "mixolydian", label: "A Mixolydian: 'inside' the chord" } ],
        explain: "The heart of blues soloing is mixing the first two. Minor pentatonic's C against the chord's C# is *the* blues tension. Major pentatonic sits perfectly on A7 but sounds polite. Most great players switch between them, using major pentatonic over I and minor over IV." } ],
    source: "Standard 12-bar blues form (Wikipedia '12-bar blues'; any blues method)."
  },
  {
    id: "ana-jazz-blues", title: "Jazz blues in F", artist: "Standard form (as in 'Now's the Time', 'Billie's Bounce', 'Tenor Madness')",
    genre: "jazz", level: 4, key: "F", tempo: 140, meter: "4/4", tags: ["blues", "jazz-blues", "ii-v", "diminished", "secondary-dominant"],
    summary: "Jazz musicians keep the 12-bar shape of the blues but fill it with motion. Four upgrades turn the 3-chord blues into the bebop blues:\n1. **ii–V into IV** (Cm7–F7 → Bb7, bar 4).\n2. **#iv°7** passing chord (B°7, bar 6), leading back to I/5.\n3. **V/ii** in bar 8 (D7 → Gm7).\n4. **ii–V** in bars 9–10 instead of V–IV, plus a I–VI–ii–V turnaround.\n\nThis is the form under hundreds of tunes, and the gateway to the Bird blues.",
    sections: [
      { name: "12-bar jazz blues", chart: "| I:7 | IV:7 | I:7 | ii/IV:m7 V/IV:7 | IV:7 | #iv:dim7 | I:7 | iii:m7 V/ii:7 | ii:m7 | V:7 | I:7 V/ii:7 | ii:m7 V:7 |",
        notes: [
          { bar: 4, text: "Cm7–F7: a ii–V of Bb, so the move to IV is 'tonicized' and feels like a little key change.", concepts: ["ana-ii-v-i", "ana-secondary-dominant"] },
          { bar: 6, text: "B°7 (B D F Ab): the bass rises Bb → B → C (F7/C). The diminished chord is a rootless C7♭9, i.e. V of F.", concepts: ["ana-diminished-passing"] },
          { bar: 8, text: "Am7–D7: iii then V/ii, pointing at Gm7.", concepts: ["ana-secondary-dominant"] },
          { bar: 9, text: "Gm7–C7 replaces C7–Bb7: the ii–V is the jazz version of the blues V–IV.", concepts: ["ana-ii-v-i"] },
          { bar: 11, text: "I–VI–ii–V turnaround (F7 D7 | Gm7 C7).", concepts: ["ana-secondary-dominant"] } ],
        subs: [
          { bar: 6, options: [
            { token: "iv:m7", label: "Bbm7 (minor iv)", why: "Many players use Bbm7–Eb7 here instead: a minor plagal / backdoor move that falls back to F.", concepts: ["ana-backdoor", "ana-plagal-cadence"] } ] },
          { bar: 12, chord: 1, options: [
            { token: "bII:7", label: "Gb7 (tritone sub)", why: "Gm7–Gb7–F7: chromatic bass into the top of the form.", concepts: ["ana-tritone-sub"] } ] } ] } ],
    compare: [
      { type: "compare", key: "F", chart: "| I:7 | IV:7 | I:7 | ii/IV:m7 V/IV:7 |", target: "IV:7",
        options: [ { scale: "mixolydian", label: "Bb Mixolydian" }, { scale: "lydian-dominant", label: "Bb Lydian dominant (#11 = E)" }, { scale: "blues", label: "Bb blues" } ],
        explain: "Over Bb7 in F, the key's leading tone E is Bb's #11. Lydian dominant keeps the line 'in F' while sounding modern. Mixolydian's Eb sounds bluesier and more down-home." } ],
    source: "Standard jazz-blues form (Jamey Aebersold 'Nothin' But Blues' changes; Wikipedia 'Twelve-bar blues' jazz variations; Levine, The Jazz Theory Book)."
  },
  // ───────────────────────────── POP / ROCK ─────────────────────────────
  {
    id: "ana-its-my-life", title: "It's My Life", artist: "Talk Talk (1984)",
    genre: "pop", level: 6, key: "Eb", tempo: 116, meter: "4/4", tags: ["chromatic-mediant", "tritone-modulation", "mixolydian", "synth-pop", "pivot"],
    summary: "A synth-pop hit with one of the boldest key relationships in the charts. The **verse sits in Eb** (with a Mixolydian Db), and the **pre-chorus and chorus are in A minor**, a **tritone** away, the most distant key there is. It barely sounds like a jolt because both seams are stitched with **chromatic mediants**:\n- **Out**: the verse's last chord, Ab6, moves to **E major** (a major third down, holding Ab = G#). E then acts as V of A minor.\n- **Back**: the chorus ends on **Fm**. Am → Fm is a minor-chord chromatic mediant (C held), and Fm is ii of Eb. It is also hidden inside the verse's Ab6, which has the same notes as Fm7.\n\n*Numerals here are all relative to Eb. Heard in A minor, the pre-chorus is i–VI6–bVII–III and the chorus i–iv–bVII–III (see the notes).*",
    sections: [
      { name: "Verse (Eb)", chart: "| I:maj | % | bVII:maj/3 | IV:6 | I:maj | % | bVII:maj/3 | IV:6 |",
        notes: [
          { bar: 1, text: "Eb major for two bars. Each chord change is 'pushed', arriving an 8th note early, a jazz-funk habit carried over into synth-pop.", concepts: ["ana-mixolydian-bvii"] },
          { bar: 3, text: "Db/F: the chord steps *down* a whole step while the bass steps *up* (Eb → F). Contrary motion keeps the loop smooth. Db is bVII, the Mixolydian colour.", concepts: ["ana-mixolydian-bvii", "ana-bass-line"] },
          { bar: 4, text: "Ab6 (Ab C Eb F) has the same notes as Fm7/Ab, so Hooktheory hears it as ii in first inversion. Keep this sound in mind: Fm is where the chorus will end.", concepts: ["ana-key-ambiguity"] } ],
        subs: [
          { bar: 3, options: [
            { token: "v:min", label: "Bbm (v minor)", why: "Many fan chord sheets give the verse as Eb–Bbm–Db. Bbm is also Mixolydian (minor v, no leading tone) and darker. The analytical sources (MusicRadar, Hooktheory) hear Db/F here.", concepts: ["ana-mixolydian-bvii"] } ] } ] },
      { name: "Turn (pivot)", chart: "| #I:maj | % |",
        notes: [
          { bar: 1, text: "**E major, two bars.** From Ab6 this is a chromatic mediant: Ab (= G#) is held, and everything else slides. Then E reveals itself as **V of A minor**. One chord is both a colour shift and a dominant.", concepts: ["ana-chromatic-mediant", "ana-modulation", "ana-secondary-dominant"] } ],
        subs: [
          { bar: 1, options: [
            { token: "#I:7", label: "E7", why: "Makes the pivot explicit: E7's tritone (G#/D) shouts 'A minor next'. The record keeps the plain triad, so the destination stays a mystery a moment longer.", concepts: ["ana-secondary-dominant"] } ] } ] },
      { name: "Pre-chorus (A minor)", chart: "| #iv:min II:maj/3 | III:maj VI:maj | II:maj | II:maj III:maj | #iv:min II:maj/3 | III:maj VI:maj | II:maj | II:maj III:maj |",
        notes: [
          { bar: 1, text: "In A minor: **Am – F/A – G – C**, two beats each. Over an A pedal, Am becomes F/A: E rises to F (5 → b6), the Aeolian sound.", concepts: ["ana-modulation", "ana-pedal-point"] },
          { bar: 3, text: "F held for six beats, then G: bVI → bVII in A minor, rising back to Am. It is the 'victory' rise of a minor key, here kept tense by the pushed rhythms." } ] },
      { name: "Chorus (A minor → back)", chart: "| #iv:min vii:min | III:maj VI:maj | #iv:min vii:min | III:maj VI:maj | ii:min | % |",
        notes: [
          { bar: 1, text: "**Am Dm | G C**: i–iv–bVII–bIII in A minor, roots falling in fifths (A → D → G → C), the same motion as a chain of ii–Vs.", concepts: ["ana-harmonic-function"] },
          { bar: 5, text: "**Fm, two bars.** Am → Fm: C is the common tone, A sinks to Ab and E rises to F. It is a chromatic mediant between minor chords. Fm is ii of Eb (and the Ab6 of the verse in disguise), so the verse returns with no sense of a key change.", concepts: ["ana-chromatic-mediant", "ana-modulation"] } ],
        subs: [
          { bar: 5, options: [
            { token: "V:7", label: "Bb7 (the conventional way home)", why: "A real dominant into Eb would announce the key change loudly. Talk Talk's Fm (ii) steps home instead, so the seam disappears.", concepts: ["ana-authentic-cadence"] } ] } ] } ],
    compare: [
      { type: "compare", key: "Eb", chart: "| I:maj | IV:6 | #I:maj | #iv:min |", target: "#I:maj",
        options: [ { token: "#I:maj", label: "E: the record's pivot" }, { token: "#I:7", label: "E7: explicit V of A minor" }, { token: "IV:6", label: "No pivot: Ab6 straight to Am" } ],
        explain: "Without the E chord, Ab6 → Am is a raw jump with no common tone. With E, the ear first hears a mediant slide (Ab = G# held), then a dominant-to-tonic cadence. Two small, logical steps cover a tritone's distance." } ],
    source: "MusicRadar, 'the surprising music theory that underpinned a Talk Talk classic' (Roland Schmidt): verse Eb (2 bars) – Db/F – Ab(add6); 2-bar E major pivot; pre-chorus Am F/A G C, F (6 beats) G; chorus Am Dm G C; Fm (2 bars) back to the verse; tritone relation. Hooktheory TheoryTab: verse Eb Mixolydian I4/3–VII6–ii6; pre-chorus/chorus A minor i–VI6–VII–III–VI. Fan chord sheets (guitartabs.cc) show Eb–Bbm–Db. Bar counts per MusicRadar; repeats approximate."
  },
  {
    id: "ana-creep", title: "Creep", artist: "Radiohead (1992)",
    genre: "rock", level: 3, key: "G", tempo: 92, meter: "4/4", tags: ["modal-interchange", "minor-plagal", "chromatic-line", "secondary-dominant"],
    summary: "Four chords, two bars each: **G – B – C – Cm (I – III – IV – iv)**. Two of them are outside G major. **B major** is V/vi, but it never resolves to Em; it slides up to C instead. **Cm** is the borrowed minor iv.\n\nThe secret is a hidden chromatic line through the chords: **D (in G) → D# (in B) → E (in C) → Eb (in Cm)**. It creeps up by half steps, then sinks back. That push-and-pull is the song's emotional engine.",
    sections: [
      { name: "Loop", chart: "| I:maj | % | III:maj | % | IV:maj | % | iv:min | % |",
        notes: [
          { bar: 1, text: "G major. Track the note D (the 5th) as it starts climbing.", concepts: ["ana-bass-line"] },
          { bar: 3, text: "B major (B D# F#): D rises to D#. This is V/vi, normally a signpost to Em, but no Em ever comes. G → B is also a chromatic mediant (common tone B).", concepts: ["ana-secondary-dominant", "ana-chromatic-mediant"] },
          { bar: 5, text: "C major: D# rises to E. B → C acts like a deceptive resolution of V/vi (V→bVI of E minor).", concepts: ["ana-deceptive-cadence"] },
          { bar: 7, text: "C minor: E sinks to Eb, the **minor plagal** ache. Cm → G then resolves Eb → D, closing the circle.", concepts: ["ana-plagal-cadence", "ana-modal-interchange"] } ],
        subs: [
          { bar: 3, options: [
            { token: "III:7", label: "B7", why: "Adds A, making the V/vi function explicit. It sounds bluesier but more predictable; the plain triad keeps the mediant ambiguity.", concepts: ["ana-secondary-dominant"] },
            { token: "iii:min", label: "Bm (diatonic)", why: "Removes the D#. The chromatic climb vanishes, and so does most of the song's tension.", concepts: ["ana-chromatic-mediant"] } ] },
          { bar: 7, options: [
            { token: "iv:m6", label: "Cm6", why: "The jazz minor plagal: adds A, which falls to G. It is lusher and more 'Beatles'.", concepts: ["ana-plagal-cadence"] },
            { token: "bVII:7", label: "F7 (backdoor)", why: "F7 contains Eb and A, the same tendency tones as Cm6, and it resolves to G through the back door.", concepts: ["ana-backdoor"] } ] } ] } ],
    compare: [
      { type: "compare", key: "G", chart: "| I:maj | III:maj | IV:maj | iv:min |", target: "III:maj",
        options: [ { token: "iii:min", label: "Bm: diatonic" }, { token: "III:maj", label: "B: the song" }, { token: "III:7", label: "B7: explicit V/vi" } ],
        explain: "Only one note differs between Bm and B (D vs D#), but it is the note that sets the chromatic line D–D#–E–Eb in motion." } ],
    source: "Wikipedia 'Creep (Radiohead song)' (G–B–C–Cm, I–III–IV–iv, modal mixture); Hooktheory TheoryTab (same). Two bars per chord inferred from phrase length."
  },
  {
    id: "ana-in-my-life", title: "In My Life", artist: "The Beatles (1965)",
    genre: "pop", level: 4, key: "A", tempo: 103, meter: "4/4", tags: ["modal-interchange", "minor-plagal", "bVII", "secondary-dominant", "chromatic-line"],
    summary: "A Lennon ballad that packs three kinds of chromaticism into a simple A major frame:\n- a **secondary dominant** (A7 → D)\n- the **minor plagal** iv (D → Dm → A)\n- in the refrain, a borrowed **bVII** (G) and a **II major** (B) that drops into Dm instead of resolving\n\nThe refrain's B → Dm → A hides a falling chromatic line, **D# → D → C#**, which gives the 'remembering' feeling.",
    sections: [
      { name: "Intro", chart: "| I:maj | V:maj | I:maj | V:maj |",
        notes: [ { bar: 1, text: "Just I and V, a plain frame for what follows." } ] },
      { name: "Verse (×2)", chart: "| I:maj V:maj | vi:min I:7/b7 | IV:maj iv:min | I:maj |",
        notes: [
          { bar: 2, text: "A7 with G in the bass: I7 = **V/IV**, tonicizing D. The bass walks A – E – F# – G – D.", concepts: ["ana-secondary-dominant", "ana-bass-line"] },
          { bar: 3, text: "D → Dm: F# sinks to F and then to E (in A). This is the **minor plagal** cadence, the bittersweet heart of the song.", concepts: ["ana-plagal-cadence", "ana-modal-interchange"] } ],
        subs: [
          { bar: 3, chord: 1, options: [
            { token: "iv:m6", label: "Dm6", why: "Adds B: Dm6 (D F A B) = Bm7♭5, so it doubles as a minor-key ii. This is the jazz spelling of the same sigh.", concepts: ["ana-plagal-cadence"] },
            { token: "bVII:9", label: "G9 (backdoor)", why: "Keeps the F (as the 7th) and adds a bluesy root motion into A.", concepts: ["ana-backdoor"] } ] } ] },
      { name: "Refrain", chart: "| vi:min | IV:maj | bVII:maj | I:maj | vi:min | II:maj | iv:min | I:maj |",
        notes: [
          { bar: 3, text: "G major: bVII, borrowed from A Mixolydian/minor. G → A is the rock 'double-plagal' arrival.", concepts: ["ana-mixolydian-bvii", "ana-modal-interchange"] },
          { bar: 6, text: "B major = II = V/V. It *should* lead to E. Instead it goes to Dm. Follow the inner line: D# (in B) → D (in Dm) → C# (in A).", concepts: ["ana-secondary-dominant", "ana-line-cliche"] },
          { bar: 7, text: "Dm again: the minor iv closes every phrase of the song.", concepts: ["ana-plagal-cadence"] } ],
        subs: [
          { bar: 7, options: [
            { token: "V:7", label: "E7 (expected)", why: "The 'correct' path B → E → A (V/V–V–I). It is bright and final. Lennon's Dm swaps the cadence for a sigh.", concepts: ["ana-authentic-cadence"] } ] } ] } ],
    source: "Alan W. Pollack, 'Notes on In My Life' (recmusicbeatles.com mirror); Hooktheory TheoryTab (A7/G, refrain bVII, V/V, iv)."
  },
  {
    id: "ana-yesterday", title: "Yesterday", artist: "The Beatles (1965)",
    genre: "pop", level: 4, key: "F", tempo: 96, meter: "4/4", tags: ["tonicization", "relative-minor", "descending-bass", "plagal", "secondary-dominant"],
    summary: "Behind its calm surface, 'Yesterday' keeps tonicizing **D minor** (vi). The second chord is already **Em7–A7**, a ii–V of Dm, and the bridge opens the same way.\n\nThree devices to listen for:\n- descending **bass lines** (Dm – Dm/C – Bb)\n- the **plagal** Bb → F ending of each verse\n- the bridge's **Gm6**, which has the same notes as C9 without its root: a ii that already contains the dominant\n\nMcCartney's guitar is tuned down a whole step and played with G-shapes; it sounds in F.",
    sections: [
      { name: "Verse (7 bars)", chart: "| I:maj | vii:m7 V/vi:7 | vi:min vi:min/b7 | IV:maj V:7 | I:maj V:maj/3 | vi:min V/V:7 | IV:maj I:maj |",
        notes: [
          { bar: 2, text: "Em7 → A7 is ii–V *of D minor*. The phrase heads straight for the relative minor rather than settling at home. (Pollack reads the first chord as E dim, i.e. Em7♭5, the diatonic version.)", concepts: ["ana-ii-v-i", "ana-secondary-dominant", "ana-modulation"] },
          { bar: 3, text: "Dm → Dm/C → Bb: the bass walks down D – C – Bb, one of McCartney's favourite moves.", concepts: ["ana-bass-line"] },
          { bar: 5, text: "C/E: a passing chord whose bass E leads down to D.", concepts: ["ana-bass-line"] },
          { bar: 6, text: "G7 = V/V, a little lift before the close.", concepts: ["ana-secondary-dominant"] },
          { bar: 7, text: "Bb → F: a **plagal** ending, gentle and hymn-like, with no leading tone.", concepts: ["ana-plagal-cadence"] } ],
        subs: [
          { bar: 2, options: [
            { token: "vii:m7b5", label: "Em7♭5 (Pollack's reading)", why: "Diatonic to F major and the true minor-key ii of Dm. It is darker, with no B natural, and a more classical sound.", concepts: ["ana-ii-v-i"] } ] },
          { bar: 7, options: [
            { token: "V:7", label: "C7 → F (authentic)", why: "A dominant ending would be more emphatic. The plagal Bb–F is what makes the verse sound resigned rather than resolved.", concepts: ["ana-authentic-cadence"] } ] } ] },
      { name: "Bridge", chart: "| vii:m7 V/vi:7 | vi:min vi:min V:maj IV:maj | ii:m6 V:7 | I:maj |",
        notes: [
          { bar: 1, text: "The same ii–V into Dm, now opening the section.", concepts: ["ana-ii-v-i"] },
          { bar: 2, text: "Dm – C – Bb: the descending bass again, this time as full chords.", concepts: ["ana-bass-line"] },
          { bar: 3, text: "**Gm6** (G Bb D E): the E is F's leading tone. Gm6 has the same notes as C9 without its root, so the predominant and the dominant are fused in one chord.", concepts: ["ana-harmonic-function"] } ],
        subs: [
          { bar: 3, options: [
            { token: "ii:m7", label: "Gm7", why: "Plainer: swaps E for F. Hear how the 6th in Gm6 adds a sense of longing.", concepts: ["ana-harmonic-function"] },
            { token: "iv:m6", label: "Bbm6", why: "The minor plagal route home instead of ii–V. It is even more wistful.", concepts: ["ana-plagal-cadence", "ana-modal-interchange"] } ] } ] } ],
    source: "Alan W. Pollack, 'Notes on Yesterday'; Hooktheory TheoryTab; top-rated Ultimate Guitar chart (summarised via search): F, Em7 A7, Dm Dm/C, Bb C7, F, Dm G7, Bb F; bridge Em7 A7 Dm C Bb Gm6 C7 F. Beat placement within bars approximate."
  },
  {
    id: "ana-here-comes-the-sun", title: "Here Comes the Sun", artist: "The Beatles (George Harrison, 1969)",
    genre: "pop", level: 4, key: "A", tempo: 129, meter: "4/4", tags: ["bVII", "bIII", "plagal-chain", "odd-meter", "secondary-dominant"],
    summary: "Bright A major (capo 7, D-shapes) with two chromatic surprises:\n- **B7** (II7 = V/V) in the refrain goes straight back to A instead of to E.\n- The bridge climbs through **C – G – D – A (bIII – bVII – IV – I)**. Each chord is the IV of the next, so it forms a chain of plagal cadences, the 'triple plagal'.\n\nThe bridge is also famous for its **meter changes** (11/8, 4/4, 7/8), with the C–G–D–D/F# group arriving in a lopsided 3+3+3+2.\n\n*Playback note: the app plays every bar in 4/4. In the real bridge the first bar is shorter (11/8) and the E7 bar is 7/8.*",
    sections: [
      { name: "Verse", chart: "| I:maj | % | IV:maj | V:7 | I:maj | % | IV:maj | V:7 |",
        notes: [ { bar: 3, text: "Pure I–IV–V, all open-position D-shapes with the capo at 7." } ] },
      { name: "Refrain", chart: "| I:maj | % | IV:maj | II:7 | I:maj | ii:m7/b3 I:maj/3 ii:min | I:maj V:maj | I:maj | V:maj |",
        notes: [
          { bar: 4, text: "B7 = V/V. Its D# is the #4 of A (a Lydian flash), and then it falls back to A rather than going on to E.", concepts: ["ana-secondary-dominant", "ana-mode-brightness"] },
          { bar: 6, text: "Bm7/D – A/C# – Bm: the bass walks down D – C# – B.", concepts: ["ana-bass-line"] } ],
        subs: [
          { bar: 4, options: [
            { token: "V:7", label: "E7", why: "The ordinary approach chord. B7's D# is what gives the line its sunny lift.", concepts: ["ana-authentic-cadence"] } ] } ] },
      { name: "Bridge (×2)", chart: "| bIII:maj bVII:maj IV:maj IV:maj/3 | I:maj | V:7 | bIII:maj bVII:maj IV:maj IV:maj/3 | I:maj | V:7 |",
        notes: [
          { bar: 1, text: "C – G – D – D/F#: each chord is IV of the next (C→G, G→D, D→A). Two borrowed chords (C = bIII, G = bVII) climb the circle of fifths back to the tonic. In the original this bar is 11/8.", concepts: ["ana-plagal-cadence", "ana-modal-interchange", "ana-mixolydian-bvii"] },
          { bar: 2, text: "A, the arrival of a triple plagal chain.", concepts: ["ana-plagal-cadence"] },
          { bar: 3, text: "E7 sets up the next pass. In the original this bar is 7/8, which makes it feel like it trips forward." } ],
        subs: [
          { bar: 3, options: [
            { token: "V:7sus4", label: "E7sus4", why: "Hang on the sus before E7 to stretch the turn. On the record, the last pass of the bridge stretches E7 to four bars of 4/4 before the verse returns.", concepts: ["ana-sus-dominant"] } ] } ] } ],
    source: "Alan W. Pollack, 'Notes on Here Comes the Sun' (verse, refrain incl. b6/5–A6/3–b, bridge, 11/8–4/4–7/8); Wikipedia 'Here Comes the Sun' (capo 7; bridge bIII–bVII–IV–I–V7; meters); Hooktheory TheoryTab."
  },
  {
    id: "ana-hey-jude", title: "Hey Jude", artist: "The Beatles (1968)",
    genre: "pop", level: 2, key: "F", tempo: 74, meter: "4/4", tags: ["plagal", "double-plagal", "bVII", "descending-bass", "mixolydian"],
    summary: "Three sections, three lessons:\n- **Verse**: the plainest possible I–V–IV harmony; the melody carries everything.\n- **Bridge**: F7 (V/IV) pushes to Bb, and then a bass line walks down **Bb–A–G–F–E** to C7.\n- **Coda**: the famous four-minute loop **F – Eb – Bb – F (I – bVII – IV – I)**, a **double plagal** cadence. Eb → Bb and Bb → F are each IV → I, and the borrowed Eb gives the singalong its Mixolydian, anthemic lift.",
    sections: [
      { name: "Verse", chart: "| I:maj | V:maj | V:7 | I:maj | IV:maj | I:maj | V:7 | I:maj |",
        notes: [ { bar: 3, text: "C → C7: the added Bb makes the return to F inevitable. Charts often decorate this bar with C6 and C7sus4." } ],
        subs: [
          { bar: 3, options: [
            { token: "V:7sus4", label: "C7sus4", why: "The piano part leans on the sus before resolving; on guitar it's a pinky on the F.", concepts: ["ana-sus-dominant"] } ] } ] },
      { name: "Bridge", chart: "| I:7 | IV:maj IV:maj/7 | ii:m7 ii:m7/b7 | V:maj/3 V:7 | I:maj |",
        notes: [
          { bar: 1, text: "F7 = V/IV: the Eb points to Bb.", concepts: ["ana-secondary-dominant"] },
          { bar: 2, text: "Bb – Bb/A – Gm7 – Gm7/F – C/E: a stepwise descending bass under slowly changing chords.", concepts: ["ana-bass-line"] } ] },
      { name: "Coda", chart: "| I:maj | bVII:maj | IV:maj | I:maj |",
        notes: [
          { bar: 2, text: "Eb, the borrowed bVII. The tonic's leading tone (E) is replaced by Eb, so the loop never quite 'cadences'. It just keeps rolling.", concepts: ["ana-mixolydian-bvii", "ana-modal-interchange"] },
          { bar: 3, text: "Eb → Bb → F: two plagal steps in a row, the **double plagal** cadence of countless rock codas.", concepts: ["ana-plagal-cadence"] } ] } ],
    compare: [
      { type: "compare", key: "F", chart: "| I:maj | bVII:maj | IV:maj | I:maj |", target: "bVII:maj",
        options: [ { token: "bVII:maj", label: "Eb: the record (borrowed)" }, { token: "V:maj", label: "C: diatonic, I–V–IV–I" }, { token: "bVI:maj", label: "Db: darker borrowed chord" } ],
        explain: "C makes it sound like a nursery tune. Eb makes it an anthem: the b7 sounds open and celebratory rather than sad. Db tips over into melancholy." } ],
    source: "Wikipedia 'Hey Jude' (F major; coda I–bVII–IV–I, ~19 repetitions); Hooktheory TheoryTab; chordband.com and UG comments (bridge F7 Bb Bb/A Gm Gm/F C/E C F). Bar placement in the bridge approximate."
  },
  {
    id: "ana-something", title: "Something", artist: "The Beatles (George Harrison, 1969)",
    genre: "pop", level: 5, key: "C", tempo: 66, meter: "4/4", tags: ["line-cliche", "bIII", "modulation", "chromatic-mediant", "secondary-dominant"],
    summary: "Harrison's masterpiece is built on **line clichés**: C → Cmaj7 → C7 (C–B–Bb) and Am → Am(maj7)/G# → Am7/G → D9/F# (A–G#–G–F#). Its signature 'turnaround' is **F – Eb – G/D – C**, with the borrowed bIII. Then the bridge jumps to **A major**, a **chromatic-mediant key** a minor third below. A pivot chord brings it home: G works as bVII in A and as V in C.\n\n*Bridge numerals are relative to C. In A major the bridge is I – iii – vi – IV – bVII – I.*",
    sections: [
      { name: "Intro / turnaround", chart: "| IV:maj | bIII:maj V:maj/5 | I:maj |",
        notes: [ { bar: 2, text: "Eb: borrowed bIII. Its Bb and Eb sink into G/D and C. This little phrase recurs at the end of every verse.", concepts: ["ana-modal-interchange"] } ] },
      { name: "Verse", chart: "| I:maj | I:maj7 | I:7 | IV:maj | II:7 | V:maj | vi:min vi:mMaj7/7 | vi:m7/b7 II:9/3 | IV:maj | bIII:maj V:maj/5 | I:maj |",
        notes: [
          { bar: 1, text: "C → Cmaj7 → C7 → F: a line cliché C–B–Bb inside the chord, landing on IV. C7 is V/IV.", concepts: ["ana-line-cliche", "ana-secondary-dominant"] },
          { bar: 5, text: "D7 = V/V → G.", concepts: ["ana-secondary-dominant"] },
          { bar: 7, text: "Am – Am(maj7)/G# – Am7/G – D9/F#: now the cliché is in the bass (A–G#–G–F#), as in 'While My Guitar Gently Weeps'.", concepts: ["ana-line-cliche", "ana-bass-line"] },
          { bar: 10, text: "The F–Eb–G–C turnaround again.", concepts: ["ana-modal-interchange"] } ],
        subs: [
          { bar: 5, options: [
            { token: "ii:m7", label: "Dm7 (diatonic)", why: "The ordinary ii. The major II7 (F#) is the Beatles' brighter, more yearning choice.", concepts: ["ana-secondary-dominant"] } ] } ] },
      { name: "Bridge (key of A)", chart: "| VI:maj #i:min/5 | #iv:min #iv:min/b7 | II:maj V:maj | VI:maj | VI:maj #i:min/5 | #iv:min VI:maj/5 | II:maj V:maj | I:maj |",
        notes: [
          { bar: 1, text: "A major: a direct modulation to the key a minor third *below*, a chromatic-mediant key (A shares only E with C). The bass descends A – G# – F# – E.", concepts: ["ana-modulation", "ana-chromatic-mediant", "ana-bass-line"] },
          { bar: 3, text: "D – G: IV – bVII in A, the rock cadence back to A.", concepts: ["ana-mixolydian-bvii"] },
          { bar: 7, text: "Second time, D – G becomes V/V – V in **C**, and the music is home. One pair of chords serves as both the A-major cadence and the pivot.", concepts: ["ana-modulation"] } ],
        subs: [
          { bar: 3, chord: 1, options: [
            { token: "III:7", label: "E7 (V of A)", why: "The 'normal' way to stay in A. Harrison's G is borrowed bVII in A, and it doubles as V of C, which is what makes the return possible.", concepts: ["ana-modulation", "ana-secondary-dominant"] } ] } ] } ],
    source: "Alan W. Pollack, 'Notes on Something'; signalsmusic.studio 'Something chord analysis'; Hooktheory TheoryTab; Wikipedia 'Something (Beatles song)'. Half-bar durations approximate."
  },
  {
    id: "ana-while-my-guitar", title: "While My Guitar Gently Weeps", artist: "The Beatles (George Harrison, 1968)",
    genre: "rock", level: 4, key: "Am", tempo: 116, meter: "4/4", tags: ["line-cliche", "descending-bass", "dorian", "parallel-major", "harmonic-minor"],
    summary: "A minor verse over a **descending chromatic bass** (A – G – F# – F) that switches to **A major** for the bridge: the same tonic, a different mode (**parallel major**). The verse also mixes three minor-key colours:\n- Am/F# and D, the Dorian F#\n- Fmaj7 and C, natural minor\n- E major, the harmonic-minor V",
    sections: [
      { name: "Verse", chart: "| i:min | i:min/b7 | i:min/6 | bVI:maj7 | i:min | bVII:maj | IV:maj | V:maj | i:min | i:min/b7 | i:min/6 | bVI:maj7 | i:min | bVII:maj | bIII:maj | V:maj |",
        notes: [
          { bar: 1, text: "Am → Am/G → Am/F# → Fmaj7: the bass falls A–G–F#–F, a line cliché in the bass.", concepts: ["ana-line-cliche", "ana-bass-line"] },
          { bar: 3, text: "Am/F# (F# A C E) is close to D9/F#, and Hooktheory hears an F#° chord here. F# is the Dorian 6th, a brief flash of brightness.", concepts: ["ana-dorian-iv"] },
          { bar: 7, text: "D major: IV *major* in a minor key, the Dorian chord.", concepts: ["ana-dorian-iv"] },
          { bar: 8, text: "E major: G# from harmonic minor, the real dominant.", concepts: ["ana-dominant-colors"] },
          { bar: 15, text: "Second time, C (bIII) replaces D. This is natural minor instead of Dorian." } ],
        subs: [
          { bar: 7, options: [
            { token: "iv:min", label: "Dm (Aeolian)", why: "The natural-minor iv. It is heavier and sadder, and loses the brief lift of F#.", concepts: ["ana-dorian-iv"] } ] },
          { bar: 8, options: [
            { token: "V:7", label: "E7", why: "Adds D, the tritone G#–D, for a stronger turn back to Am.", concepts: ["ana-authentic-cadence"] } ] } ] },
      { name: "Bridge (A major)", chart: "| I:maj | iii:min | vi:min | iii:min | ii:min | % | V:maj | % |",
        notes: [
          { bar: 1, text: "A **major**: the parallel key. C becomes C#, F becomes F#, G becomes G#. The tonic stays the same, but the light changes completely.", concepts: ["ana-modal-interchange", "ana-modulation"] },
          { bar: 7, text: "E major works as V in both keys, which is what lets the bridge slide back into A minor.", concepts: ["ana-modulation"] } ] } ],
    compare: [
      { type: "compare", key: "Am", chart: "| i:min | bVII:maj | IV:maj | V:maj |", target: "IV:maj",
        options: [ { token: "IV:maj", label: "D: Dorian IV (the record)" }, { token: "iv:min", label: "Dm: Aeolian iv" }, { token: "bIII:maj", label: "C: the second-phrase choice" } ],
        explain: "Harrison uses both D and C in the same slot in alternate phrases. D (with F#) lifts, C sinks. Hear how the same E chord afterwards feels more urgent after D." } ],
    source: "Alan W. Pollack, 'Notes on While My Guitar Gently Weeps'; Wikipedia (descending bass; C replacing D in the second phrase); Hooktheory TheoryTab (F#dim7 reading, bridge variants)."
  },
  {
    id: "ana-let-it-be", title: "Let It Be", artist: "The Beatles (1970)",
    genre: "pop", level: 2, key: "C", tempo: 72, meter: "4/4", tags: ["axis", "plagal", "bVII", "descending-bass", "gospel"],
    summary: "The verse is the **Axis progression** (I–V–vi–IV) with a gospel plagal ending. The verse and chorus both finish **F → C (IV–I)**, never G → C. The chorus walks the axis backwards (vi–V–IV–I), and the instrumental tag adds a borrowed **Bb (bVII)**.\n\nA lesson in how much mileage four diatonic chords can give, depending on order and bass line.",
    sections: [
      { name: "Verse (×2)", chart: "| I:maj V:maj | vi:min IV:maj | I:maj V:maj | IV:maj I:maj |",
        notes: [
          { bar: 1, text: "C – G – Am – F: the Axis. Note that the phrase ends IV–I (plagal), so the dominant G never resolves directly.", concepts: ["ana-axis", "ana-plagal-cadence"] } ],
        subs: [
          { bar: 2, chord: 1, options: [
            { token: "IV:maj7", label: "Fmaj7", why: "Adds E on top. It is softer and more 'piano ballad', and the E is the next chord's 3rd.", concepts: ["ana-axis"] } ] } ] },
      { name: "Chorus", chart: "| vi:min V:maj | IV:maj I:maj | I:maj V:maj | IV:maj I:maj/3 ii:m7 I:maj |",
        notes: [
          { bar: 1, text: "Am – G – F – C: roots falling A–G–F, then C. It is the Axis rotated, starting on vi.", concepts: ["ana-axis"] },
          { bar: 4, text: "F – C/E – Dm7 – C: the bass walks F–E–D–C, the gospel piano 'amen' fill.", concepts: ["ana-bass-line", "ana-plagal-cadence"] } ],
        subs: [
          { bar: 1, chord: 1, options: [
            { token: "iii:m7/b3", label: "Em7/G (Pollack's reading)", why: "The piano's chord has G in the bass but an Em7 colour. The bass line is what matters.", concepts: ["ana-bass-line"] } ] } ] },
      { name: "Instrumental tag", chart: "| IV:maj I:maj/3 | ii:m7 I:maj | bVII:maj IV:maj/3 | V:maj IV:maj | I:maj |",
        notes: [
          { bar: 3, text: "Bb – F/A: borrowed bVII and its own plagal step, a double-plagal echo inside a gospel turnaround.", concepts: ["ana-mixolydian-bvii", "ana-plagal-cadence"] } ] } ],
    source: "Alan W. Pollack, 'Notes on Let It Be'; Hooktheory TheoryTab (verse ends ii6/5; bridge/tag F C/E Dm7 C Bb F/A G F C); UG mirror (rated 4.86). Two chords per bar at ~72 bpm."
  },
  {
    id: "ana-dont-look-back-in-anger", title: "Don't Look Back in Anger", artist: "Oasis (1995)",
    genre: "rock", level: 3, key: "C", tempo: 75, meter: "4/4", tags: ["secondary-dominant", "minor-plagal", "chromatic-bass", "britpop"],
    summary: "Britpop's Beatles homage, in C:\n- an **E major (V/vi)** that resolves *deceptively* to F instead of Am\n- a pre-chorus built on the **minor plagal** F – Fm – C\n- Noel Gallagher's 'mystery chord', **E7/G#**, which carries a chromatic bass G – G# – A",
    sections: [
      { name: "Verse / Chorus", chart: "| I:maj | V:maj | vi:min | III:maj | IV:maj | V:maj | I:maj vi:min | V:maj |",
        notes: [
          { bar: 4, text: "E major = V/vi. It should go to Am, but it goes to F, a deceptive resolution of the secondary dominant (G# rises to A in the F chord).", concepts: ["ana-secondary-dominant", "ana-deceptive-cadence"] } ],
        subs: [
          { bar: 4, options: [
            { token: "III:maj/3", label: "E/G#", why: "Puts G# in the bass. Many charts and the recording's bass line suggest it, and it makes the rise to A in F smoother.", concepts: ["ana-bass-line"] },
            { token: "iii:min", label: "Em (diatonic)", why: "Without the G# the line flattens out. The secondary dominant is the hook.", concepts: ["ana-secondary-dominant"] } ] } ] },
      { name: "Pre-chorus", chart: "| IV:maj | iv:min | I:maj | IV:maj | iv:min | I:maj | IV:maj | iv:min | I:maj | V:maj | III:7/3 | vi:min | V:maj | IV:maj | V:maj |",
        notes: [
          { bar: 2, text: "F → Fm → C: the minor plagal cadence three times running (A → Ab → G).", concepts: ["ana-plagal-cadence", "ana-modal-interchange"] },
          { bar: 11, text: "**E7/G#**, the 'mystery chord' Noel Gallagher later confirmed. The bass climbs G (in G) → G# → A (in Am). It is V/vi in first inversion.", concepts: ["ana-secondary-dominant", "ana-bass-line"] } ],
        subs: [
          { bar: 2, options: [
            { token: "bVII:7", label: "Bb7", why: "Backdoor alternative: same Ab, plus D, landing on C.", concepts: ["ana-backdoor"] } ] } ] } ],
    compare: [
      { type: "compare", key: "C", chart: "| I:maj | V:maj | vi:min | III:maj | IV:maj |", target: "III:maj",
        options: [ { token: "III:maj", label: "E: V/vi (the song)" }, { token: "iii:min", label: "Em: diatonic" }, { token: "III:7/3", label: "E7/G#: the 'mystery chord' version" } ],
        explain: "The G# leads up to A, the 3rd of the next chord, F. Without it, Am → Em → F has no forward pull." } ],
    source: "Hooktheory TheoryTab; guitartabs.cc chord chart; Far Out Magazine on Noel Gallagher confirming the E7/G# 'mystery chord'. Chord durations approximate."
  },
  {
    id: "ana-wonderwall", title: "Wonderwall", artist: "Oasis (1995)",
    genre: "rock", level: 3, key: "F#m", tempo: 87, meter: "4/4", tags: ["sus-chords", "drone-strings", "relative-major", "key-ambiguity", "capo"],
    summary: "Played **capo 2** with Em7 – G – Dsus4 – A7sus4 shapes, which sound as **F#m7 – A – Esus4 – B7sus4**. The magic is in the shapes: the top two strings stay fretted at the same place through every chord, so two notes **drone** above the changes (sounding E and A). Each chord is half a chord plus a ringing pedal.\n\nBecause the sus chords leave out their 3rds, the key floats between **F# minor and its relative A major**. The chorus (D – F#m – A – F#m) leans towards A, the verse towards F#m.",
    sections: [
      { name: "Verse", chart: "| i:m7 bIII:maj | bVII:sus4 IV:7sus4 | i:m7 bIII:maj | bVII:sus4 IV:7sus4 |",
        notes: [
          { bar: 1, text: "F#m7 – A: shapes Em7 and G, with the same two top-string notes (sounding E and A).", concepts: ["ana-pedal-point"] },
          { bar: 2, text: "Esus4 – B7sus4: no 3rds anywhere, so neither chord commits to major or minor. B7sus4 is the IV chord, unresolved and suspended.", concepts: ["ana-sus-dominant", "ana-key-ambiguity"] } ],
        subs: [
          { bar: 2, chord: 1, options: [
            { token: "IV:7", label: "B7 (resolve the sus)", why: "Brings in D#, the Dorian 6th of F#m. It sounds brighter and more 'folk', and it commits the mode.", concepts: ["ana-dorian-iv"] } ] } ] },
      { name: "Pre-chorus", chart: "| bVI:add9 bVII:sus4 | i:m7 | bVI:add9 bVII:sus4 | i:m7 | bVI:add9 bVII:sus4 | bIII:maj bVII:sus4/3 i:m7 | bIII:maj IV:7sus4 |",
        notes: [
          { bar: 1, text: "Dadd9 – Esus4 – F#m7: bVI – bVII – i, the Aeolian 'rise'. The D natural confirms the minor mode is Aeolian, not Dorian.", concepts: ["ana-modal-interchange"] },
          { bar: 6, text: "A – Esus4/G# – F#m7: a stepping-down bass A – G# – F#.", concepts: ["ana-bass-line"] } ] },
      { name: "Chorus", chart: "| bVI:add9 i:m7 | bIII:maj i:m7 | bVI:add9 i:m7 | bIII:maj i:m7 |",
        notes: [
          { bar: 1, text: "D – F#m – A – F#m. Heard in A major this is IV – vi – I – vi. The chorus tilts towards the relative major without ever cadencing.", concepts: ["ana-key-ambiguity"] } ],
        subs: [
          { bar: 1, options: [
            { token: "bVI:maj7", label: "Dmaj7", why: "The pop-ballad version: lush, with less drone.", concepts: ["ana-axis"] } ] } ] } ],
    compare: [
      { type: "compare", key: "F#m", chart: "| i:m7 bIII:maj | bVII:sus4 IV:7sus4 |", target: "i:m7",
        options: [ { scale: "aeolian", label: "F# Aeolian (D natural)" }, { scale: "dorian", label: "F# Dorian (D#)" }, { scale: "minor-pentatonic", label: "F# minor pentatonic (no 6th at all)" } ],
        explain: "The verse never states the 6th, so both modes fit, but the pre-chorus Dadd9 says Aeolian. Pentatonic dodges the question, which is exactly what the song's sus chords do." } ],
    source: "Hooktheory TheoryTab (F#m: i7–III–VIIsus4–iv7sus4; VI–VII–i7; VI(add9)–i7–III–i7); guitartabs.cc; UG mirror (capo 2, rated 4.5). Two beats per chord inferred."
  },
  {
    id: "ana-clocks", title: "Clocks", artist: "Coldplay (2002)",
    genre: "pop", level: 3, key: "Eb", tempo: 131, meter: "4/4", tags: ["mixolydian", "key-ambiguity", "3-3-2", "minor-v"],
    strum: "D--D--D-",
    summary: "One loop: **Eb – Bbm – Bbm – Fm**. The **minor v** (Bbm instead of Bb) tells you it's **Eb Mixolydian**: there is no leading tone (D natural is replaced by Db). Wikipedia notes that some transcriptions put it in **Ab major** instead (V – ii – vi), a classic case of key ambiguity, where the tonic is decided by emphasis rather than by a cadence.\n\nThe piano arpeggios group 8th notes **3+3+2**, the tresillo rhythm. The playback strum here imitates that.",
    sections: [
      { name: "Loop", chart: "| I:maj | v:min | % | ii:min |",
        notes: [
          { bar: 1, text: "Eb major, heard as home because the loop starts and lingers here.", concepts: ["ana-key-ambiguity"] },
          { bar: 2, text: "Bbm: the Db in it is the Mixolydian b7. Without a major V, nothing pulls hard towards Eb, so the loop can spin forever.", concepts: ["ana-mixolydian-bvii", "ana-mode-brightness"] },
          { bar: 4, text: "Fm, which Hooktheory gives as a ii7. In Ab major the same three chords are V – ii – vi, so the song never settles the question.", concepts: ["ana-key-ambiguity"] } ],
        subs: [
          { bar: 2, options: [
            { token: "V:maj", label: "Bb major", why: "Brings in D natural, the leading tone. The loop now sounds like plain Eb major, and the mystery evaporates.", concepts: ["ana-mode-brightness"] } ] },
          { bar: 4, options: [
            { token: "ii:m7", label: "Fm7", why: "Adds Eb on top, a common tone with the coming Eb chord, so the loop closes more smoothly.", concepts: ["ana-key-ambiguity"] } ] } ] } ],
    compare: [
      { type: "compare", key: "Eb", chart: "| I:maj | v:min | % | ii:min |", target: "I:maj",
        options: [ { scale: "mixolydian", label: "Eb Mixolydian (Db)" }, { scale: "ionian", label: "Eb Ionian (D)" } ],
        explain: "D natural over the Eb chord sounds fine on its own, but it fights the next chord's Db. Mixolydian matches the whole loop." } ],
    source: "Wikipedia 'Clocks (song)' (Eb Mixolydian, I–v–ii; alternative Ab reading); Hooktheory TheoryTab (bridge Gb–Db–Ab, not charted here). Bar split inferred."
  },
  {
    id: "ana-viva-la-vida", title: "Viva la Vida", artist: "Coldplay (2008)",
    genre: "pop", level: 2, key: "Ab", tempo: 138, meter: "4/4", tags: ["axis", "loop", "sus", "rotation"],
    summary: "**Db – Eb – Ab – Fm (IV – V – I – vi)**, one chord per bar, for the whole song. It is a rotation of the Axis family that starts on the predominant, so each pass sounds like a cadence (IV – V – I) followed by a step aside (vi). On guitar it is usually played capo 1 with C – D – G – Em shapes.\n\nThe Eb chord is often voiced as **Eb7sus4**, or (in Wikipedia's notation) **Absus4/Eb**, the tonic's sus chord over the dominant bass. Both soften the V so the loop never feels too final.",
    sections: [
      { name: "Loop", chart: "| IV:maj | V:maj | I:maj | vi:min |",
        notes: [
          { bar: 1, text: "Db: starting on IV gives momentum. The loop is always on the way somewhere.", concepts: ["ana-axis", "ana-harmonic-function"] },
          { bar: 3, text: "Ab: the tonic arrives mid-phrase, not at the downbeat of the loop.", concepts: ["ana-authentic-cadence"] },
          { bar: 4, text: "Fm: vi, the relative minor, darkening the turn back to Db.", concepts: ["ana-axis"] } ],
        subs: [
          { bar: 2, options: [
            { token: "V:7sus4", label: "Eb7sus4", why: "The common keyboard voicing: the sus4 (Ab) anticipates the tonic.", concepts: ["ana-sus-dominant"] },
            { token: "I:sus4/5", label: "Absus4/Eb", why: "Wikipedia's spelling of the same bar: a tonic-family chord over the dominant bass, the pop equivalent of the classical cadential 6/4.", concepts: ["ana-pedal-point", "ana-sus-dominant"] } ] } ] } ],
    compare: [
      { type: "compare", key: "Ab", chart: "| IV:maj | V:maj | I:maj | vi:min |", target: "V:maj",
        options: [ { token: "V:maj", label: "Eb triad" }, { token: "V:7sus4", label: "Eb7sus4" }, { token: "I:sus4/5", label: "Absus4/Eb" } ],
        explain: "All three have Eb in the bass. The triad has a leading tone (G) and pulls hardest. The sus versions replace it with Ab, so the arrival on Ab feels like a continuation rather than a resolution." } ],
    source: "Wikipedia 'Viva la Vida (song)' (Ab major, Absus4/Eb); Hooktheory TheoryTab (IV–V–I–vi)."
  },
  {
    id: "ana-space-oddity", title: "Space Oddity", artist: "David Bowie (1969)",
    genre: "rock", level: 5, key: "C", tempo: 70, meter: "4/4", tags: ["modal-interchange", "chromatic-mediant", "secondary-dominant", "planing", "bVII"],
    summary: "Bowie's space ballad is a tour of colour chords around C major:\n- an unsettled **Fmaj7 – Em** intro\n- **E7** (V/vi) sliding to F\n- borrowed **Fm** (iv) and **Bbmaj7** (bVII)\n- an instrumental that climbs **Fmaj7 – Em7 – A – C – D – E**: major triads on roots that don't belong together, ending suspended on E with nowhere to go\n\nThe **A → C** step is a chromatic mediant, and **C – D – E** is **planing**, one chord shape moved up the neck.",
    sections: [
      { name: "Intro", chart: "| IV:maj7 | iii:min | IV:maj7 | iii:min |",
        notes: [ { bar: 1, text: "Fmaj7 ↔ Em: two chords sharing E, rocking by half step in the bass (F → E). It hovers without a tonic, as if the song were drifting before it starts.", concepts: ["ana-key-ambiguity"] } ] },
      { name: "Verse 1", chart: "| I:maj | iii:min | I:maj | iii:min | vi:min vi:m7/b7 | II:7 | I:maj | iii:min |",
        notes: [
          { bar: 5, text: "Am – Am7/G – D7: a descending bass leads to D7 = V/V, which sets up G but goes to C.", concepts: ["ana-bass-line", "ana-secondary-dominant"] } ] },
      { name: "Verse 2", chart: "| I:maj | III:7 | IV:maj | iv:min I:maj | IV:maj | iv:min I:maj | IV:maj |",
        notes: [
          { bar: 2, text: "E7 (V/vi) → F: the deceptive resolution of a secondary dominant (G# rises to A).", concepts: ["ana-secondary-dominant", "ana-deceptive-cadence"] },
          { bar: 4, text: "Fm → C: the minor plagal sigh, twice.", concepts: ["ana-plagal-cadence", "ana-modal-interchange"] } ],
        subs: [
          { bar: 2, options: [
            { token: "iii:m7", label: "Em7 (diatonic)", why: "Keeps everything inside C. The G# of E7 is what gives the lift into F.", concepts: ["ana-secondary-dominant"] } ] } ] },
      { name: "Floating / descending", chart: "| IV:maj7 | iii:m7 | IV:maj7 | iii:m7 | bVII:maj7 vi:min | V:maj IV:maj |",
        notes: [
          { bar: 5, text: "Bbmaj7 – Am – G – F: roots step down Bb–A–G–F. The borrowed bVII starts it (Wikipedia gives these chords with added 9ths).", concepts: ["ana-modal-interchange", "ana-bass-line"] } ] },
      { name: "Instrumental climb", chart: "| IV:maj7 | iii:m7 | VI:maj | I:maj | II:maj | III:maj |",
        notes: [
          { bar: 3, text: "A *major*: a chromatic chord (C#).", concepts: ["ana-chromatic-mediant"] },
          { bar: 4, text: "A → C: a chromatic-mediant hop (only E in common).", concepts: ["ana-chromatic-mediant"] },
          { bar: 5, text: "C – D – E: the same major shape slid up by whole steps. This is **planing**, parallel chords with no functional logic, pure ascent.", concepts: ["ana-mode-brightness"] },
          { bar: 6, text: "E major, held at the end of the song. It is V/vi, but no Am ever comes. The harmony never 'lands', which suits the story." } ],
        subs: [
          { bar: 6, options: [
            { token: "III:7", label: "E7", why: "Would point firmly to Am and promise a landing. Bowie's open E triad leaves the question hanging.", concepts: ["ana-secondary-dominant"] } ] } ] } ],
    source: "Hooktheory TheoryTab; Wikipedia 'Space Oddity (song)' (citing Chris O'Leary: Bbmaj9–Am(add9)–G(add9)–F; ascending figure); Heartwood Guitar chord chart. Half-bar splits approximate."
  },
  {
    id: "ana-peg", title: "Peg (chorus)", artist: "Steely Dan (1977)",
    genre: "rock", level: 7, key: "G", tempo: 128, meter: "4/4", tags: ["mu-chord", "slash-chords", "upper-structure", "jazz-rock", "steely-dan"],
    summary: "Steely Dan's harmonic fingerprint is the **mu major chord**: an add2 chord with the 2nd and 3rd voiced a whole step apart (1-2-3 cluster), often over its own 3rd in the bass. The chorus of 'Peg' (whose verse is a disguised 12-bar blues in G) is full of them, alternating with maj7, m11 and sus chords:\n\n**Cmaj7 – Gadd2/B – Am11 – E7sus4** (twice), then **Aadd2/C# – C6 – G6 – F#7**.\n\nThe Deacon Blues intro (Cmaj7, Gsus2/B, Bbmaj7, Fsus2/A, Dmaj7, Asus2/C#, Cmaj7, Gsus2/B, Ebmaj7, E7#9) uses the same device. Bar groupings below are approximate; the chord order is verified.",
    sections: [
      { name: "Chorus", chart: "| IV:maj7 I:add9/3 | ii:m11 VI:7sus4 | IV:maj7 I:add9/3 | ii:m11 VI:7sus4 | II:add9/3 IV:6 | I:6 VII:7 |",
        notes: [
          { bar: 1, text: "Cmaj7 → Gadd2/B: the bass steps C → B while the top keeps the A–B (9–3) cluster ringing. That's the **mu** sound: bright, a little smeared, very 'studio'.", concepts: ["ana-mu-chord", "ana-bass-line"] },
          { bar: 2, text: "Am11 – E7sus4: E7sus4 is V/ii *suspended*. It could go to Am, but it loops back to Cmaj7, a soft deceptive move.", concepts: ["ana-sus-dominant", "ana-deceptive-cadence"] },
          { bar: 5, text: "Aadd2/C#: V/V with its 3rd in the bass, another mu chord. The bass then drops C# → C (C6), a chromatic half step.", concepts: ["ana-mu-chord", "ana-secondary-dominant", "ana-bass-line"] },
          { bar: 6, text: "G6 – F#7: F#7 is V/iii. Rather than resolve to Bm, the next chorus restarts on Cmaj7, a tritone root move (F# → C). F#7 and C7 share a tritone (E / A#=Bb), so the jump sounds closer than it looks.", concepts: ["ana-secondary-dominant", "ana-tritone-sub"] } ],
        subs: [
          { bar: 1, chord: 1, options: [
            { token: "I:maj/3", label: "Plain G/B", why: "Take out the 2nd and the cluster disappears. It still works, but it sounds like a folk song.", concepts: ["ana-mu-chord"] } ] },
          { bar: 6, chord: 1, options: [
            { token: "VII:7#9", label: "F#7#9", why: "The 'dirty' Steely Dan dominant (compare the E7#9 at the end of the Deacon Blues intro). The #9 (A natural) rubs against the chord's A#, a bluesy minor-over-major clash.", concepts: ["ana-dominant-colors"] } ] } ] } ],
    compare: [
      { type: "compare", key: "G", chart: "| IV:maj7 I:add9/3 | ii:m11 VI:7sus4 |", target: "I:add9/3",
        options: [ { token: "I:maj/3", label: "G/B: triad" }, { token: "I:add9/3", label: "Gadd2/B: mu chord" }, { token: "I:maj7/3", label: "Gmaj7/B: maj7" } ],
        explain: "Same bass, same chord family. The mu chord's A–B cluster sounds brighter than the maj7's F# and fuller than the bare triad. Try voicing it x2x233 (as hakwright.co.uk transcribes it)." } ],
    source: "hakwright.co.uk Steely Dan pages ('mu major' list of songs incl. Peg, Deacon Blues; Peg tab: Cmaj7 Gsus2/B Am11 E7sus4, A/C# C6/9 G F#7; Deacon Blues intro); Jon MacLennan 'Peg' lesson (Gadd9/B, C6, G6); Wikipedia 'Mu major chord' (definition). Bar lengths not verified."
  },
  {
    id: "ana-isnt-she-lovely", title: "Isn't She Lovely", artist: "Stevie Wonder (1976)",
    genre: "soul", level: 4, key: "E", tempo: 119, meter: "4/4", tags: ["vi-ii-v-i", "secondary-dominant", "sus-dominant", "loop", "shuffle"],
    summary: "A four-bar loop, **C#m7 – F#9 – B11 – E6**, repeated for the whole song (with a shuffle feel; Hooktheory notates 12/8). In E major it is **vi – II9 – V11 – I6**: a **vi–ii–V–I** with two soul upgrades:\n- **F#9**: the ii becomes a dominant, V/V, which adds A# for a sunny Lydian lift.\n- **B11** (= A/B, IV over the V bass): the classic soul **sus dominant**, which floats instead of pushing.\n\nBecause the loop starts on C#m7 and gives every chord a full bar, some listeners hear C# minor as home. That ambiguity keeps the loop from ever feeling finished.",
    sections: [
      { name: "Loop", chart: "| vi:m7 | V/V:9 | V:11 | I:6 |",
        notes: [
          { bar: 1, text: "C#m7: the loop begins on vi, so 'home' is postponed by three bars.", concepts: ["ana-key-ambiguity"] },
          { bar: 2, text: "F#9 = V/V. Its A# is the raised 4th of E. It pulls to B, the dominant.", concepts: ["ana-secondary-dominant"] },
          { bar: 3, text: "B11, often played as A/B: an A triad over B. The 3rd of B (D#) is missing, so there's no leading tone, and the cadence sounds relaxed.", concepts: ["ana-sus-dominant"] },
          { bar: 4, text: "E6: the 6th (C#) is the next chord's root, so the loop overlaps itself.", concepts: ["ana-axis"] } ],
        subs: [
          { bar: 2, options: [
            { token: "ii:m7", label: "F#m7 (diatonic ii)", why: "The plain vi–ii–V–I. It's correct, but Stevie's major II is what makes it sound joyful.", concepts: ["ana-secondary-dominant"] } ] },
          { bar: 3, options: [
            { token: "bII:7", label: "F7 (tritone sub)", why: "A jazzier turnaround: F7 slides by half step into E.", concepts: ["ana-tritone-sub"] } ] } ] } ],
    compare: [
      { type: "compare", key: "E", chart: "| vi:m7 | V/V:9 | V:11 | I:6 |", target: "V:11",
        options: [ { token: "V:7", label: "B7: classic dominant" }, { token: "V:11", label: "B11 (A/B): soul sus" }, { token: "V:13", label: "B13: jazz dominant" } ],
        explain: "B7 has D#, the leading tone, and pulls hard. B11 replaces D# with E, the tonic itself, so the resolution is already half there. Gospel and soul players love it for that reason." } ],
    source: "Hooktheory TheoryTab (vi7–V9/V–I, 12/8); NYU Theory Anthology secondary-dominants page (C#m7 | F#9 | B11 | E, via search snippet); Jon MacLennan 'Isn't She Lovely chords'."
  },
  {
    id: "ana-purple-rain", title: "Purple Rain", artist: "Prince (1984)",
    genre: "pop", level: 2, key: "Bb", tempo: 57, meter: "4/4", tags: ["sus2", "axis", "power-ballad", "open-voicings"],
    summary: "A slow 4/4 power ballad (often played as A-shapes with capo 1) built on **I – vi – V – IV** with ringing **sus2** voicings. The sus2s leave the 3rds out of the I and IV chords, giving an open, hymn-like shimmer. The chorus starts on **IV**, so every chorus opens with a plagal lean into the tonic.\n\nCompare it with the Axis (I–V–vi–IV): the same four chords with the middle pair swapped. Put vi before V and the descent sounds gospel-like rather than anthemic.",
    sections: [
      { name: "Verse", chart: "| I:sus2 | vi:m11 | V:maj | IV:sus2 | I:sus2 | vi:m11 | V:maj | V:maj |",
        notes: [
          { bar: 1, text: "Bbsus2: no 3rd, just 1-2-5. It sounds open, neither happy nor sad.", concepts: ["ana-sus-dominant"] },
          { bar: 2, text: "Gm7(11), which Hooktheory gives as vi7sus4. The 11th (C) is a held common tone with the sus2 chords.", concepts: ["ana-pedal-point"] },
          { bar: 4, text: "F → Eb: V moving *down* to IV, a rock 'retrogression'. The dominant relaxes rather than resolves.", concepts: ["ana-axis", "ana-plagal-cadence"] } ],
        subs: [
          { bar: 2, options: [
            { token: "vi:m7", label: "Gm7", why: "The plain version. It loses the shimmering common tone.", concepts: ["ana-axis"] } ] } ] },
      { name: "Chorus", chart: "| IV:sus2 | % | I:sus2 | vi:m11 | V:maj | % |",
        notes: [ { bar: 1, text: "Starting on IV (Ebsus2): the chorus's first move is a plagal IV → I.", concepts: ["ana-plagal-cadence"] } ],
        subs: [
          { bar: 1, options: [
            { token: "iv:m6", label: "Ebm6 (minor plagal)", why: "A darker gospel touch for a final chorus: Gb sinks to F.", concepts: ["ana-plagal-cadence", "ana-modal-interchange"] } ] } ] } ],
    source: "Hooktheory TheoryTab (I(add9)–vi7sus4–V–IV(add9)); Wikipedia 'Purple Rain (song)' (Bb major); Heartwood Guitar and guitartabs.cc charts (capo 1 A-shapes). Bar counts approximate."
  },
  {
    id: "ana-teen-spirit", title: "Smells Like Teen Spirit", artist: "Nirvana (1991)",
    genre: "rock", level: 2, key: "Fm", tempo: 117, meter: "4/4", tags: ["power-chords", "key-ambiguity", "aeolian", "riff"],
    summary: "**F5 – Bb5 – Ab5 – Db5**, two beats each, through the verse, pre-chorus and chorus. Power chords contain no 3rds, so the riff doesn't say major or minor. Analysts call it **F minor** (i – iv – bIII – bVI), but **Ab major** (vi – ii – I – IV) fits the same notes. The vocal and lead lines decide.\n\nThe root motion (up a 4th, down a step, up a 4th) is the pattern of many rock riffs: two 'plagal' leaps joined by a step.",
    sections: [
      { name: "Riff", chart: "| i:5 iv:5 | bIII:5 bVI:5 | i:5 iv:5 | bIII:5 bVI:5 |",
        notes: [
          { bar: 1, text: "F5 → Bb5: up a 4th. Without 3rds, we can't tell whether Bb is minor (Aeolian iv) or major (Dorian IV).", concepts: ["ana-key-ambiguity"] },
          { bar: 2, text: "Ab5 → Db5: the same up-a-4th shape, starting a whole step below Bb5. Pairs of fourths moving by step make a sequence; that's why the riff feels so propulsive.", concepts: ["ana-key-ambiguity", "ana-plagal-cadence"] } ],
        subs: [
          { bar: 1, chord: 1, options: [
            { token: "IV:maj", label: "Bb major (Dorian)", why: "Fill in a D natural and the riff turns Dorian and funky, a brighter, more 70s sound.", concepts: ["ana-dorian-iv"] },
            { token: "iv:min", label: "Bbm (Aeolian)", why: "Fill in Db and it becomes darker, minor-key grunge.", concepts: ["ana-mode-brightness"] } ] } ] } ],
    compare: [
      { type: "compare", key: "Fm", chart: "| i:5 iv:5 | bIII:5 bVI:5 |", target: "i:5",
        options: [ { scale: "minor-pentatonic", label: "F minor pentatonic" }, { scale: "aeolian", label: "F Aeolian" }, { scale: "dorian", label: "F Dorian" } ],
        explain: "Because the chords have no 3rds or 6ths, all three fit. The pentatonic is the 'safe' grunge choice. Aeolian's Db matches the Db5 chord; Dorian's D natural clashes with it, which tells you which mode the riff implies." } ],
    source: "Wikipedia 'Smells Like Teen Spirit' (F minor; sus-like voicings on four strings); Hooktheory TheoryTab (i–iv–III–VI)."
  },
  {
    id: "ana-with-or-without-you", title: "With or Without You", artist: "U2 (1987)",
    genre: "rock", level: 1, key: "D", tempo: 110, meter: "4/4", tags: ["axis", "loop", "pedal-point", "bass-line"],
    summary: "The **Axis progression**, **D – A – Bm – G (I – V – vi – IV)**, one bar each, for the entire song. The chords are mostly *implied* by the bass and the roots under the Edge's sustained guitar, rather than strummed. That sustain acts like a pedal, so the loop feels static and slowly rising at once. The whole arrangement builds on four unchanging chords.",
    sections: [
      { name: "Loop", chart: "| I:maj | V:maj | vi:min | IV:maj |",
        notes: [
          { bar: 1, text: "D: the Axis begins on I.", concepts: ["ana-axis"] },
          { bar: 2, text: "A: V, which here moves on to vi instead of resolving, a deceptive motion repeated every four bars.", concepts: ["ana-deceptive-cadence", "ana-axis"] },
          { bar: 4, text: "G → D: plagal, so the loop's 'cadence' is IV–I.", concepts: ["ana-plagal-cadence"] } ],
        subs: [
          { bar: 2, options: [
            { token: "V:maj/4", label: "A/D (pedal)", why: "Keep D ringing in the bass under every chord, as a sustained guitar does. The loop turns into a pedal-point meditation.", concepts: ["ana-pedal-point"] } ] },
          { bar: 4, options: [
            { token: "IV:maj7", label: "Gmaj7", why: "Adds F#, a common tone with D, so the IV glows rather than pushes.", concepts: ["ana-axis"] } ] } ] } ],
    source: "Wikipedia 'With or Without You' (D major; progression implied by bass and guitar roots); Hooktheory TheoryTab (I–V–vi–IV)."
  },
  {
    id: "ana-hotel-california", title: "Hotel California", artist: "Eagles (1976)",
    genre: "rock", level: 4, key: "Bm", tempo: 74, meter: "4/4", tags: ["harmonic-minor", "dorian", "andalusian-family", "secondary-dominant", "descending"],
    summary: "Played capo 7 on 12-string with Em-shapes, sounding in **B minor**: **Bm – F#7 – A – E – G – D – Em – F#7**. It is a stretched relative of the Andalusian cadence. The chords come in pairs that each fall a 4th (Bm→F#, A→E, G→D), and the pairs step down **B – A – G** (Aeolian). Two non-Aeolian chords spice it:\n- **F#7**, the harmonic-minor V (A#)\n- **E major**, the Dorian IV (G#)\n\nThe chorus reorders the same material: G – D – F#7 – Bm.",
    sections: [
      { name: "Verse", chart: "| i:min | V:7 | bVII:maj | IV:maj | bVI:maj | bIII:maj | iv:min | V:7 |",
        notes: [
          { bar: 2, text: "F#7: the A# from harmonic minor, a real dominant right away in bar 2.", concepts: ["ana-dominant-colors"] },
          { bar: 3, text: "A → E: E major is IV *major* in B minor, the Dorian colour (G#). Each pair moves from a chord to its own dominant (Bm→F#, A→E, G→D), so the pairs are miniature I–V gestures.", concepts: ["ana-dorian-iv", "ana-secondary-dominant"] },
          { bar: 5, text: "G → D: the third pair. Roots of the pairs fall B–A–G, the descending tetrachord of the Andalusian family.", concepts: ["ana-andalusian"] },
          { bar: 7, text: "Em → F#7: iv – V, a half cadence that loops back to Bm.", concepts: ["ana-half-cadence"] } ],
        subs: [
          { bar: 7, options: [
            { token: "ii:m7b5", label: "C#m7♭5", why: "The minor-key ii. With F#7 it forms a proper minor ii–V into Bm (jazz reading).", concepts: ["ana-ii-v-i"] } ] },
          { bar: 8, options: [
            { token: "V:7b9", label: "F#7♭9", why: "The b9 (G) is borrowed straight from the key. It adds a darker, flamenco-tinged pull.", concepts: ["ana-dominant-colors", "ana-andalusian"] } ] } ] },
      { name: "Chorus", chart: "| bVI:maj | bIII:maj | V:7 | i:min | bVI:maj | bIII:maj | iv:min | V:7 |",
        notes: [ { bar: 1, text: "G – D – F#7 – Bm: the chorus opens on the 'major' side (bVI, bIII) and pivots back to minor through the dominant.", concepts: ["ana-modal-interchange"] } ] } ],
    compare: [
      { type: "compare", key: "Bm", chart: "| bIII:maj | iv:min | V:7 | i:min |", target: "V:7",
        options: [ { scale: "phrygian-dominant", label: "F# Phrygian dominant (B harmonic minor)" }, { scale: "mixolydian", label: "F# Mixolydian" }, { scale: "altered", label: "F# altered" } ],
        explain: "Phrygian dominant is the song's own world: G and D natural, the b9 and b13. Mixolydian's G# and D# point to B *major*, and Bm sounds jarring after them. Altered adds jazz tension but still lands softly on Bm." } ],
    source: "Wikipedia 'Hotel California (song)'; Hooktheory TheoryTab; Guitar World (Don Felder interview: capo 7, 12-string). Verse and chorus charts agree across sources."
  },
  {
    id: "ana-get-lucky", title: "Get Lucky", artist: "Daft Punk feat. Pharrell & Nile Rodgers (2013)",
    genre: "funk", level: 3, key: "Bm", tempo: 116, meter: "4/4", tags: ["dorian", "loop", "key-ambiguity", "minor-v", "disco"],
    strum: "D-DUD-DU",
    summary: "**Bm7 – D – F#m7 – E**, one bar each, for the whole song: B **Dorian**. E major (with G#) is the Dorian IV, and F#m7 is a *minor* v with no leading tone, so nothing pulls the loop home. It just grooves.\n\nKey ambiguity is the other trick. The same four chords are ii – IV – vi – V in **A major**, and Hooktheory starts its loop on E. Nile Rodgers' chops never resolve the question, which is why it can repeat for six minutes without fatigue.",
    sections: [
      { name: "Loop", chart: "| i:m7 | bIII:maj | v:m7 | IV:maj |",
        notes: [
          { bar: 1, text: "Bm7: the tonic by emphasis, not by cadence.", concepts: ["ana-key-ambiguity"] },
          { bar: 3, text: "F#m7: minor v. No A#, so there's no dominant pull. That is modal harmony.", concepts: ["ana-dorian-iv", "ana-mode-brightness"] },
          { bar: 4, text: "E major: G# is the Dorian major 6th of B. It brightens the turn back to Bm.", concepts: ["ana-dorian-iv"] } ],
        subs: [
          { bar: 3, options: [
            { token: "V:7", label: "F#7", why: "The harmonic-minor dominant: much stronger pull, but the loop becomes a cadence and loses its endless float.", concepts: ["ana-dominant-colors"] } ] },
          { bar: 4, options: [
            { token: "IV:9", label: "E9", why: "The funk upgrade: E9's G# and D are the classic Dorian 'IV9' grip, as in many Nile Rodgers-style vamps.", concepts: ["ana-dorian-iv"] } ] } ] } ],
    compare: [
      { type: "compare", key: "Bm", chart: "| i:m7 | bIII:maj | v:m7 | IV:maj |", target: "i:m7",
        options: [ { scale: "dorian", label: "B Dorian (G#)" }, { scale: "aeolian", label: "B Aeolian (G)" } ],
        explain: "Aeolian's G clashes with the E major chord (G#) two bars later. Dorian matches the whole loop, the soul and disco minor." } ],
    source: "Hooktheory TheoryTab (B Dorian; IV–i7–III–v7 starting on E); MusicTech tutorial; UG chart (capo 2 shapes, via search snippet)."
  },
  {
    id: "ana-sweet-home-alabama", title: "Sweet Home Alabama", artist: "Lynyrd Skynyrd (1974)",
    genre: "rock", level: 2, key: "D", tempo: 98, meter: "4/4", tags: ["mixolydian", "bVII", "key-ambiguity", "plagal"],
    summary: "**D – C – G**, round and round: I – bVII – IV in **D Mixolydian** (Hooktheory and most analysts). A vocal minority hears **G major**, V – IV – I, because the riff lands on G and Ed King reportedly thought of his solo in G. Both readings use exactly the same notes, so the tonic is decided by phrasing and emphasis. This is the textbook case of key ambiguity in rock.\n\nThe Mixolydian bVII – IV – I and I – bVII – IV – I shuffle is the backbone of Southern and classic rock. Guns N' Roses' 'Sweet Child O' Mine' verse is the same I – bVII – IV – I move (in C# Mixolydian, with D – C – G – D shapes in half-step-down tuning).",
    sections: [
      { name: "Riff", chart: "| I:maj bVII:add9 | IV:maj | I:maj bVII:add9 | IV:maj |",
        notes: [
          { bar: 1, text: "D → Cadd9: the b7 root (C natural) is the Mixolydian signature.", concepts: ["ana-mixolydian-bvii"] },
          { bar: 2, text: "G for a full bar: C → G is plagal (IV–I *of G*), which is why some hear G as home.", concepts: ["ana-key-ambiguity", "ana-plagal-cadence"] } ],
        subs: [
          { bar: 1, chord: 1, options: [
            { token: "V:maj", label: "A (diatonic V)", why: "Swap C for A and it becomes plain D major I – V – IV. The C natural carries the whole Southern-rock attitude.", concepts: ["ana-mixolydian-bvii"] } ] } ] },
      { name: "Verse-end variant", chart: "| I:maj bVII:maj | IV:maj IV:maj bIII:maj bVII:maj |",
        notes: [ { bar: 2, text: "G – F – C: now even bIII (F) appears. In the order F → C → G → D, each chord is the IV of the next: a chain of plagal steps leading back to the tonic.", concepts: ["ana-modal-interchange", "ana-plagal-cadence"] } ] } ],
    compare: [
      { type: "compare", key: "D", chart: "| I:maj bVII:add9 | IV:maj |", target: "I:maj",
        options: [ { scale: "mixolydian", label: "D Mixolydian (C natural)" }, { scale: "ionian", label: "D Ionian (C#)" }, { scale: "major-pentatonic", label: "D major pentatonic" } ],
        explain: "Ionian's C# fights the C chord. Mixolydian (which has the same notes as G major) fits everything, and the pentatonic dodges the 7th entirely, as most Southern-rock solos do." } ],
    source: "Hooktheory TheoryTab (D Mixolydian, I–bVII–IV; verse includes bIII); laurenbateman.com and songnotes.net charts; Straight Dope forum thread on the key debate; fretjam.com. Sweet Child O' Mine verse per Hooktheory (I–VII–IV, C# Mixolydian)."
  },
  {
    id: "ana-stand-by-me", title: "Stand By Me", artist: "Ben E. King (1961)",
    genre: "soul", level: 1, key: "A", tempo: 118, meter: "4/4", tags: ["50s-progression", "doo-wop", "loop", "bass-line"],
    summary: "The **'50s progression'**, **I – vi – IV – V**, here in A: two bars of A, two of F#m, then D and E, one bar each. Wikipedia calls it the 'Stand by Me changes'. Doo-wop, early rock'n'roll and Motown are built on it.\n\nIt's the friendly cousin of the Axis: the same chords as I–V–vi–IV but in an order that *ends* on V, so every loop is a half cadence asking to start again.",
    sections: [
      { name: "Verse / Chorus", chart: "| I:maj | % | vi:min | % | IV:maj | V:maj | I:maj | % |",
        notes: [
          { bar: 3, text: "F#m (vi) shares two notes (A, C#) with A. The step down is gentle.", concepts: ["ana-axis"] },
          { bar: 5, text: "D → E: predominant → dominant, then home.", concepts: ["ana-harmonic-function", "ana-authentic-cadence"] } ],
        subs: [
          { bar: 5, options: [
            { token: "ii:m7", label: "Bm7", why: "I – vi – ii – V: the jazz version of the same loop, the 'turnaround' that opens Rhythm Changes.", concepts: ["ana-ii-v-i"] } ] },
          { bar: 6, options: [
            { token: "V:7", label: "E7", why: "The tritone (G#–D) sharpens the pull home.", concepts: ["ana-authentic-cadence"] } ] },
          { bar: 3, options: [
            { token: "V/ii:7", label: "F#7", why: "Make vi major and it becomes V/ii, pointing towards Bm. Use it with the Bm7 sub for a full I–VI7–ii–V.", concepts: ["ana-secondary-dominant"] } ] } ] } ],
    source: "Wikipedia 'Stand by Me (Ben E. King song)' ('50s progression / 'Stand by Me changes'); Hooktheory TheoryTab; Jon MacLennan lesson."
  },
  // ───────────────────────────── SOUL / FUNK / R&B ─────────────────────────────
  {
    id: "ana-just-the-two-of-us", title: "Just the Two of Us", artist: "Grover Washington Jr. feat. Bill Withers (1980)",
    genre: "soul", level: 5, key: "Fm", tempo: 96, meter: "4/4", tags: ["perpetual-loop", "ii-v", "relative-major", "harmonic-minor", "marusa"],
    summary: "A two-bar loop that never stops turning: **Dbmaj7 – C7 – Fm7 – Ebm7 – Ab7**. In F minor it is **bVImaj7 – V7 – i7**, then a **ii–V of Db** (Ebm7–Ab7) that leads straight back to the start. Every ending is a new beginning.\n\nHeard in Ab major, the same chords are IVmaj7 – III7 – vi7 – v7 – I7, and Ab7 works as V/IV. That is how Japanese musicians name it: the **'Just the Two of Us' / Marusa progression** (丸サ進行), after a famous J-pop song built on it. Wikipedia describes it as a double-time reordering of the 'Sunny' progression. It has become a staple of city pop and lo-fi.",
    sections: [
      { name: "Loop", chart: "| bVI:maj7 V:7b9 | i:m7 i:m7 bvii:m7 bIII:7 |",
        notes: [
          { bar: 1, text: "Dbmaj7 → C7: bVI → V, the half-step-down bass of the Andalusian and Phrygian cadences, now in jazz chords. C7 uses E natural from harmonic minor.", concepts: ["ana-andalusian", "ana-dominant-colors"] },
          { bar: 2, text: "Fm7 for two beats, then **Ebm7 – Ab7**: a ii–V of Db, so the loop 'resolves' to its own first chord. Note that Ebm7 is a *borrowed* minor ii (Eb minor isn't in F minor).", concepts: ["ana-ii-v-i", "ana-secondary-dominant"] },
          { bar: 2, chord: 3, text: "Ab7 is bIII7 in F minor and I7 in Ab major. Either way it is the dominant of Db.", concepts: ["ana-key-ambiguity"] } ],
        subs: [
          { bar: 1, chord: 1, options: [
            { token: "bII:7", label: "Gb7 (tritone sub)", why: "Gb7 slides by half step into Fm7. The bass becomes Db – Gb – F, smoother and jazzier.", concepts: ["ana-tritone-sub"] },
            { token: "V:7#9", label: "C7#9", why: "The #9 (Eb) is the b7 of Fm7. It is a funkier, Hendrix-flavoured tension.", concepts: ["ana-dominant-colors"] } ] },
          { bar: 2, chord: 3, options: [
            { token: "VI:7", label: "D7 (tritone sub of Ab7)", why: "D7 → Dbmaj7: the chord a half step above slides into the loop's start.", concepts: ["ana-tritone-sub"] } ] } ] },
      { name: "Chorus variant (chromatic m7s)", chart: "| bVI:maj7 V:7b9 | i:m7 vii:m7 bvii:m7 bIII:7 |",
        notes: [ { bar: 2, text: "Fm7 – Em7 – Ebm7: the same grip slid down a fret at a time (planing), into the Ab7.", concepts: ["ana-bass-line"] } ] } ],
    compare: [
      { type: "compare", key: "Fm", chart: "| bVI:maj7 V:7b9 | i:m7 i:m7 bvii:m7 bIII:7 |", target: "V:7b9",
        options: [ { scale: "phrygian-dominant", label: "C Phrygian dominant (F harmonic minor)" }, { scale: "altered", label: "C altered" }, { scale: "diminished-hw", label: "C half-whole" } ],
        explain: "Phrygian dominant keeps you in F minor's world (Db, Ab). Altered adds Eb and Gb: more bite, smooth into Fm7. Half-whole keeps A natural (the 13th), which sounds brighter and almost resolves to F *major*." } ],
    source: "Wikipedia 'Just the Two of Us (Grover Washington Jr. song)' (F minor; double-time reordering of the 'Sunny' progression); Hooktheory TheoryTab; Japanese sources on 丸サ進行 / 'Just The Two of Us進行' (IVM7–III7–VIm7–Vm7–I7). Beat split inferred."
  },
  {
    id: "ana-whats-going-on", title: "What's Going On", artist: "Marvin Gaye (1971)",
    genre: "soul", level: 4, key: "E", tempo: 100, meter: "4/4", tags: ["maj7", "sus-dominant", "soul", "two-chord-vamp"],
    summary: "Soul harmony at its most fluid. The verse rocks between **Emaj7 and C#m7**, two chords that share three notes (E, G#, B), so the change feels like a shift of light rather than a move. Then a **ii – V** made of sus sounds (F#m7 → A/B → B13) floats back. There is no hard cadence anywhere, which suits the song's questioning mood.",
    sections: [
      { name: "Verse", chart: "| I:maj7 | % | vi:m7 | % | I:maj7 | % | vi:m7 | % |",
        notes: [ { bar: 3, text: "Emaj7 (E G# B D#) → C#m7 (C# E G# B): only one note changes (D# → C#). It is the smoothest possible chord change, and the 'floating tonic' of soul ballads.", concepts: ["ana-axis"] } ],
        subs: [
          { bar: 3, options: [
            { token: "vi:m9", label: "C#m9", why: "Adds D#, so *every* note of Emaj7 is now inside the minor chord. Many charts voice it this way.", concepts: ["ana-axis"] } ] } ] },
      { name: "Turn", chart: "| ii:m7 | % | V:11 | V:13 |",
        notes: [
          { bar: 3, text: "A/B (B11): IV over V. The soul sus dominant, with no leading tone.", concepts: ["ana-sus-dominant"] },
          { bar: 4, text: "B13: the sus resolves into a full dominant, then home to Emaj7.", concepts: ["ana-sus-dominant", "ana-authentic-cadence"] } ],
        subs: [
          { bar: 4, options: [
            { token: "V:13b9", label: "B13♭9", why: "Adds C, a darker gospel colour, before the resolution.", concepts: ["ana-dominant-colors"] } ] } ] } ],
    source: "Ethan Hein, 'What's Going On' analysis (Emaj7/C#m7 alternation, F#m7, A/B, B13); Hooktheory TheoryTab; guitartabs.cc chart. Bar lengths approximate; extensions vary between charts."
  },
  {
    id: "ana-chameleon", title: "Chameleon (main vamp)", artist: "Herbie Hancock (1973)",
    genre: "funk", level: 3, key: "Bbm", tempo: 96, meter: "4/4", tags: ["dorian", "vamp", "funk", "i-IV7"],
    strum: "D-uDu-Du",
    summary: "Two bars, **Bbm7 – Eb7**, under one of funk's great bass lines. This is the **Dorian vamp** in its purest form. Eb7's 3rd is **G natural**, the Dorian 6th of Bb minor, and its 7th is Db, the minor 3rd. So the IV7 chord *is* the Dorian colour.\n\nNeither chord resolves; the tritone in Eb7 (G–Db) just rocks back to Bbm7. Modal funk, in the line of 'Oye Como Va' and Miles' electric period.",
    sections: [
      { name: "Vamp", chart: "| i:m7 | IV:7 | i:m7 | IV:7 |",
        notes: [
          { bar: 1, text: "Bbm7: home by repetition.", concepts: ["ana-dorian-iv"] },
          { bar: 2, text: "Eb7: G natural (major 6th of Bb) makes it Dorian, not Aeolian. On guitar, alternate a Bbm7 grip with an Eb9 grip on the middle strings; they share Db and F.", concepts: ["ana-dorian-iv", "ana-mode-brightness"] } ],
        subs: [
          { bar: 2, options: [
            { token: "IV:9", label: "Eb9", why: "The classic funk IV chord: the 9th (F) is a common tone with Bbm7.", concepts: ["ana-dorian-iv"] },
            { token: "iv:m7", label: "Ebm7 (Aeolian)", why: "Swap in Gb and the vamp darkens. Hear how the major 3rd of the IV chord is what makes it funky.", concepts: ["ana-mode-brightness"] } ] } ] } ],
    compare: [
      { type: "compare", key: "Bbm", chart: "| i:m7 | IV:7 | i:m7 | IV:7 |", target: "i:m7",
        options: [ { scale: "dorian", label: "Bb Dorian (G)" }, { scale: "aeolian", label: "Bb Aeolian (Gb)" }, { scale: "minor-pentatonic", label: "Bb minor pentatonic" } ],
        explain: "Aeolian's Gb clashes with the G of the next chord. Dorian fits both chords, and the pentatonic is the safe funk default. Add Dorian's G to it for the 'Herbie' sound." } ],
    source: "Wikipedia 'Chameleon (composition)'; Ethan Hein, 'Deconstructing the bassline in Herbie Hancock's Chameleon'; Hooktheory TheoryTab (i7–IV7). Later sections of the track not covered."
  },
  // ───────────────────────────── BLUES ─────────────────────────────
  {
    id: "ana-thrill-is-gone", title: "The Thrill Is Gone", artist: "B.B. King (1969)",
    genre: "blues", level: 3, key: "Bm", tempo: 90, meter: "4/4", tags: ["minor-blues", "bVI-V", "12-bar"],
    summary: "A 12-bar **minor blues** in B minor with one memorable twist. Bars 9–10 go **Gmaj7 → F#7 (bVI – V)** instead of the usual V – iv. The half-step slide G → F# into the dominant is the same Phrygian/Andalusian 'sigh' that ends flamenco phrases, and it gives the tune its tragic elegance.",
    sections: [
      { name: "12-bar minor blues", chart: "| i:m7 | % | % | % | iv:m7 | % | i:m7 | % | bVI:maj7 | V:7 | i:m7 | % |",
        notes: [
          { bar: 5, text: "Em7: the minor iv, as in a regular blues, but minor.", concepts: ["ana-blues-harmony"] },
          { bar: 9, text: "Gmaj7: bVI. The bass G falls a half step to F#.", concepts: ["ana-andalusian"] },
          { bar: 10, text: "F#7: the harmonic-minor V (A#), the strongest pull back to Bm.", concepts: ["ana-dominant-colors"] } ],
        subs: [
          { bar: 9, options: [
            { token: "bVI:7", label: "G7", why: "Some charts give G7. It is the tritone sub of C#7 (V/V), so it doubles as a dominant sliding into F#7.", concepts: ["ana-tritone-sub"] } ] },
          { bar: 12, options: [
            { token: "V:7", label: "F#7 turnaround", why: "Several charts put F#7 in bar 12 to send the form round again.", concepts: ["ana-blues-harmony"] } ] } ] } ],
    compare: [
      { type: "compare", key: "Bm", chart: "| bVI:maj7 | V:7 | i:m7 | % |", target: "V:7",
        options: [ { scale: "phrygian-dominant", label: "F# Phrygian dominant (B harmonic minor)" }, { scale: "altered", label: "F# altered" }, { scale: "mixolydian", label: "F# Mixolydian" } ],
        explain: "B.B. King mostly stays in B minor pentatonic and simply bends to A# over F#7. Phrygian dominant formalises that. Mixolydian's D# and G# fight the coming Bm." } ],
    source: "Jon MacLennan 'The Thrill Is Gone' lesson; bluesharmonica.com minor-blues chord grooves; JustinGuitar community lesson; pianowithjonny (G7 variant); Hooktheory TheoryTab."
  },
  {
    id: "ana-blues-for-alice", title: "Blues for Alice (Bird blues)", artist: "Charlie Parker (1951)",
    genre: "jazz", level: 7, key: "F", tempo: 160, meter: "4/4", tags: ["bird-blues", "ii-v-chains", "backdoor", "chromatic-ii-v", "blues"],
    summary: "Charlie Parker's re-imagining of the 12-bar blues, the **Bird blues** or 'Bird changes'. The landmarks are the same as a plain blues: IV in bar 5, I in bar 7 (sort of), ii–V in 9–10. But in between is a cascade of **ii–Vs falling by whole and half steps**:\n- bars 1–4 descend through a ii–V chain: Em7♭5 A7 | Dm7 G7 | Cm7 F7 → Bb7\n- bar 6 is a backdoor ii–V (Bbm7 Eb7)\n- bars 7–8 slide chromatically: Am7 D7 | Abm7 Db7 → Gm7\n\nIt is the great proving ground for ii–V vocabulary.",
    sections: [
      { name: "12 bars", chart: "| I:maj7 | vii:m7b5 V/vi:7 | vi:m7 V/V:7 | ii/IV:m7 V/IV:7 | IV:7 | iv:m7 bVII:7 | iii:m7 V/ii:7 | biii:m7 bVI:7 | ii:m7 | V:7 | I:maj V/ii:7 | ii:m7 V:7 |",
        notes: [
          { bar: 1, text: "Fmaj7, not F7: the bebop blues starts *major*, and the bluesiness comes later.", concepts: ["ana-blues-harmony"] },
          { bar: 2, text: "Em7♭5 – A7 → Dm7: a minor ii–V to vi.", concepts: ["ana-ii-v-i", "ana-secondary-dominant"] },
          { bar: 3, text: "Dm7 – G7 → Cm7 – F7 → Bb7: each ii–V resolves to the next ii, which keeps the chain falling until it lands on IV in bar 5.", concepts: ["ana-ii-v-i", "ana-deceptive-cadence"] },
          { bar: 6, text: "Bbm7 – Eb7: iv – bVII7, the **backdoor** ii–V. It 'should' go to F but slips to Am7 (iii), the place where a plain blues returns to I.", concepts: ["ana-backdoor"] },
          { bar: 7, text: "Am7 – D7 | Abm7 – Db7: the same ii–V shape moved down a half step, a chromatic sequence that lands on Gm7.", concepts: ["ana-ii-v-i", "ana-tritone-sub"] },
          { bar: 9, text: "Gm7 – C7: the familiar ii–V of every jazz blues, and finally the I–VI–ii–V turnaround.", concepts: ["ana-ii-v-i"] } ],
        subs: [
          { bar: 2, options: [
            { token: "vii:m7", label: "Em7 (not ♭5)", why: "A common variant. B natural makes it a *major-key* ii–V aimed at D, which sounds brighter.", concepts: ["ana-ii-v-i"] } ] },
          { bar: 11, options: [
            { token: "iii:m7", label: "Am7 – D7", why: "Bar 11 is disputed: some play F6 D7, others Am7 D7 (iii for I).", concepts: ["ana-harmonic-function"] } ] } ] } ],
    compare: [
      { type: "compare", key: "F", chart: "| I:maj7 | vii:m7b5 V/vi:7 | vi:m7 | % |", target: "V/vi:7",
        options: [ { scale: "phrygian-dominant", label: "A Phrygian dominant" }, { scale: "altered", label: "A altered" }, { scale: "diminished-hw", label: "A half-whole" }, { scale: "mixolydian", label: "A Mixolydian" } ],
        explain: "A7 goes to D *minor*. The first three options all contain Bb (b9) and point there. Mixolydian's B natural and F# point to D major and sound sour against Dm7." } ],
    source: "Wikipedia 'Bird changes' and 'Blues for Alice' (key F; Fmaj7/F6 opening); guitarthinker.com 'Blues for Alice chords'. Variants noted in subs."
  },
  // ───────────────────────────── BOSSA ─────────────────────────────
  {
    id: "ana-blue-bossa", title: "Blue Bossa", artist: "Kenny Dorham (1963)",
    genre: "bossa", level: 4, key: "Cm", tempo: 140, meter: "4/4", tags: ["minor-ii-v", "neapolitan-key", "bossa", "modulation"],
    summary: "Sixteen bars, two keys:\n- **C minor**, with a minor ii–V–i (Dm7♭5 – G7♭9 – Cm7)\n- **Db major**, a half step up, with a major ii–V–I (Ebm7 – Ab7 – Dbmaj7)\n\nDb is the **Neapolitan** key of C minor (bII), so the modulation is a sudden brightening that falls back a half step. It is the perfect tune for practising major vs minor ii–Vs side by side.",
    sections: [
      { name: "16 bars", chart: "| i:m7 | % | iv:m7 | % | ii:m7b5 | V:7b9 | i:m7 | % | biii:m7 | bVI:7 | bII:maj7 | % | ii:m7b5 | V:7b9 | i:m7 | ii:m7b5 V:7b9 |",
        notes: [
          { bar: 3, text: "Fm7: iv. Bars 1–4 are pure C Dorian/Aeolian territory.", concepts: ["ana-harmonic-function"] },
          { bar: 5, text: "Dm7♭5 – G7♭9 – Cm7: the **minor ii–V–i**. Ab (b5 of Dm7♭5) becomes the b9 of G7.", concepts: ["ana-ii-v-i"] },
          { bar: 9, text: "Ebm7 – Ab7 – Dbmaj7: a major ii–V–I in **Db**, the key a half step above, the Neapolitan.", concepts: ["ana-modulation", "ana-neapolitan", "ana-ii-v-i"] },
          { bar: 13, text: "Dbmaj7 → Dm7♭5: the bass rises Db → D and you're back in C minor. The same minor ii–V brings it home.", concepts: ["ana-modulation"] } ],
        subs: [
          { bar: 2, options: [
            { token: "I:7", label: "C7 (V/iv)", why: "Some charts add C7 in bar 2 to push into Fm7.", concepts: ["ana-secondary-dominant"] } ] },
          { bar: 10, options: [
            { token: "II:7", label: "D7 (tritone sub of Ab7)", why: "D7 → Dbmaj7: a half-step slide. It also foreshadows the Dm7♭5 that follows.", concepts: ["ana-tritone-sub"] } ] } ] } ],
    compare: [
      { type: "compare", key: "Cm", chart: "| ii:m7b5 | V:7b9 | i:m7 | % |", target: "V:7b9",
        options: [ { scale: "phrygian-dominant", label: "G Phrygian dominant (C harmonic minor)" }, { scale: "altered", label: "G altered" }, { scale: "diminished-hw", label: "G half-whole" } ],
        explain: "All three have Ab (b9). Phrygian dominant adds Eb (b13) and sounds 'classic minor'. Altered adds Bb (#9) and Db (b5) for the most tension. Half-whole keeps E natural (13), a brighter, more symmetric sound." },
      { type: "compare", key: "Cm", chart: "| ii:m7b5 | V:7b9 | i:m7 | % |", target: "ii:m7b5",
        options: [ { scale: "locrian", label: "D Locrian (b2: Eb)" }, { scale: "locrian-nat2", label: "D Locrian ♮2 (E natural)" } ],
        explain: "Locrian's Eb is a note of C minor, the 'expected' sound. Locrian ♮2 (6th mode of F melodic minor) swaps it for E, a smoother, modern colour that avoids the b9 rub over the root." } ],
    source: "Learnjazzstandards.com 'Blue Bossa chords'; guitarcomposerstoolbox.com 'Blue Bossa in C'; jazzadvice.com. Variants: G7 vs G7♭9; bar 16 sometimes just Cm7."
  },
  {
    id: "ana-girl-from-ipanema", title: "The Girl from Ipanema", artist: "Antônio Carlos Jobim (1962)",
    genre: "bossa", level: 6, key: "F", tempo: 130, meter: "4/4", tags: ["lydian-dominant", "tritone-sub", "chromatic-mediant", "bossa", "modulation"],
    summary: "The A section sits gently in F, coloured by **G7 (II7)**, often played as G7#11 or G13. That chord's B natural is the Lydian #4 of F. A **tritone sub** (Gb7) sets up every return.\n\nThe 16-bar bridge is the adventure. It drifts **up a half step to Gbmaj7**, then through a series of minor-chord → dominant pairs a major third apart (**F#m7 → D7**, **Gm7 → Eb7**), before a **iii–VI–ii–V** brings it home. Form: AABA, 8+8+16+8 = 40 bars. *Numerals are relative to F, so the bridge's numerals look exotic. Read them alongside the notes.*",
    sections: [
      { name: "A (×2; 2nd ending lands on Fmaj7)", chart: "| I:maj7 | % | II:7 | % | ii:m7 | bII:7 | I:maj7 | bII:7 |",
        notes: [
          { bar: 3, text: "G7 = II7 (V/V), with no resolution to C. It is a colour: B natural is F's #4, the 'Lydian' brightness. Players voice it G13 or G7#11.", concepts: ["ana-lydian-dominant", "ana-secondary-dominant"] },
          { bar: 5, text: "Gm7 – Gb7 – Fmaj7: ii – bII7 – I, the **tritone sub** cadence, with a chromatic bass G – Gb – F.", concepts: ["ana-tritone-sub", "ana-ii-v-i"] },
          { bar: 8, text: "Gb7 again, as a turnaround into the next A.", concepts: ["ana-tritone-sub"] } ],
        subs: [
          { bar: 3, options: [
            { token: "II:7#11", label: "G7#11", why: "The common voicing: the #11 (C#) on top glows against the F tonic.", concepts: ["ana-lydian-dominant"] },
            { token: "ii:m7", label: "Gm7 (diatonic)", why: "Plainer and more 'inside'. The magic of bar 3 is the major 3rd (B natural).", concepts: ["ana-secondary-dominant"] } ] } ] },
      { name: "B (bridge, 16 bars)", chart: "| bII:maj7 | % | #IV:7 | % | #i:m7 | % | VI:7 | % | ii:m7 | % | bVII:7 | % | iii:m7 | VI:7 | ii:m7 | V:7 |",
        notes: [
          { bar: 1, text: "Gbmaj7: a sudden step up a half step to the Neapolitan region. Gb7 from the A section has turned into a major tonic.", concepts: ["ana-neapolitan", "ana-modulation"] },
          { bar: 3, text: "B7: IV7 of Gb (spelled B7 for Cb7), the blues 'IV7' of the new key.", concepts: ["ana-lydian-dominant"] },
          { bar: 5, text: "F#m7 → D7: a minor chord to a dominant a major third below, a chromatic-mediant pair. D7 is V of Gm, which comes next.", concepts: ["ana-chromatic-mediant", "ana-secondary-dominant"] },
          { bar: 9, text: "Gm7 → Eb7: the same pattern a half step higher. Eb7 is bVII7 of F, the backdoor colour.", concepts: ["ana-chromatic-mediant", "ana-backdoor"] },
          { bar: 13, text: "Am7 – D7 – Gm7 – C7: iii – VI – ii – V, the standard turnaround back to F.", concepts: ["ana-ii-v-i", "ana-secondary-dominant"] } ] },
      { name: "Last A", chart: "| I:maj7 | % | II:7 | % | ii:m7 | bII:7 | I:maj7 | % |",
        notes: [ { bar: 7, text: "Home on Fmaj7." } ] } ],
    compare: [
      { type: "compare", key: "F", chart: "| I:maj7 | % | II:7 | % |", target: "II:7",
        options: [ { scale: "lydian-dominant", label: "G Lydian dominant (C#)" }, { scale: "mixolydian", label: "G Mixolydian (C)" }, { scale: "whole-tone", label: "G whole tone" } ],
        explain: "G7 here isn't going to C, so the C natural of Mixolydian (a strong 'resolve to C' avoid-note) sounds heavy. Lydian dominant's C# keeps it floating, the classic bossa sound. Whole tone adds an augmented 5th for a dreamier blur." } ],
    source: "Pianowithjonny 'Girl from Ipanema' lesson (F, 40 bars, Gb7 tritone sub, III–VI–II–V ending of the bridge); guitarcomposerstoolbox.com; lydiandominant.blogspot.com. Getz/Gilberto recording is in Db."
  },
  // ───────────────────────────── CLASSICAL ─────────────────────────────
  {
    id: "ana-pachelbel-canon", title: "Canon in D (the ground bass)", artist: "Johann Pachelbel (c. 1680)",
    genre: "classical", level: 1, key: "D", tempo: 60, meter: "4/4", tags: ["ground-bass", "romanesca", "descending-fourths", "axis-ancestor"],
    summary: "Eight bass notes, **D – A – B – F# – G – D – G – A**, repeated 28 times while three violins weave a canon on top. Harmonised, they give **I – V – vi – iii – IV – I – IV – V**. The pattern (falling a 4th, rising a 2nd) is the old **Romanesca** schema, and it is the ancestor of a huge family of pop songs.\n\nGreen Day's 'Basket Case' verse (I – V – vi – iii – IV – I – V in Eb, per Wikipedia) and dozens of ballads borrow it almost unchanged, and the Axis progression is its four-chord grandchild.",
    sections: [
      { name: "Ground (Pachelbel)", chart: "| I:maj V:maj | vi:min iii:min | IV:maj I:maj | IV:maj V:maj |",
        notes: [
          { bar: 1, text: "D → A: down a 4th. A → Bm: up a step. The whole progression is that two-move cell repeated: fall a 4th, rise a 2nd.", concepts: ["ana-bass-line", "ana-axis"] },
          { bar: 2, text: "Bm → F#m: vi → iii. This is rare in pop (iii is the 'missing' chord), but it is what keeps the sequence consistent.", concepts: ["ana-harmonic-function"] },
          { bar: 4, text: "G → A → (D): IV – V – I closes each cycle with a real authentic cadence.", concepts: ["ana-authentic-cadence"] } ],
        subs: [
          { bar: 2, chord: 1, options: [
            { token: "I:maj/3", label: "D/F#", why: "Same bass note, F#, but tonic harmony instead of iii. Many arrangements do this.", concepts: ["ana-bass-line"] } ] },
          { bar: 4, chord: 1, options: [
            { token: "V:7", label: "A7", why: "The usual final-cycle upgrade.", concepts: ["ana-authentic-cadence"] } ] } ] },
      { name: "Stepwise-bass variant (common arrangement)", chart: "| I:maj V:maj/3 | vi:min iii:min/b3 | IV:maj I:maj/3 | IV:maj V:maj |",
        notes: [ { bar: 1, text: "An arranger's version, not Pachelbel's bass: the same chords in inversion so the bass walks straight down the scale, D – C# – B – A – G – F# – G – A. It is the basis of countless wedding and pop arrangements.", concepts: ["ana-bass-line"] } ] } ],
    compare: [
      { type: "compare", key: "D", chart: "| I:maj V:maj | vi:min iii:min | IV:maj I:maj | IV:maj V:maj |", target: "iii:min",
        options: [ { token: "iii:min", label: "F#m: Pachelbel" }, { token: "I:maj/3", label: "D/F#: tonic in inversion" }, { token: "V/vi:7", label: "F#7: V/vi, a baroque-to-pop lift" } ],
        explain: "Same bass note, three meanings. F#m is a gentle diatonic step. D/F# sounds like 'home again'. F#7 turns the bar into a secondary dominant that pulls back towards Bm and away from G." } ],
    source: "Wikipedia 'Pachelbel's Canon' (ground bass, 28 statements, Romanesca); piano-composer-teacher-london.co.uk; Wikipedia 'Basket Case (Green Day song)' (Canon comparison)."
  },
  {
    id: "ana-bach-prelude-c", title: "Prelude in C major, BWV 846", artist: "J.S. Bach (Well-Tempered Clavier I, 1722)",
    genre: "classical", level: 5, key: "C", tempo: 66, meter: "4/4", tags: ["voice-leading", "inversions", "diminished-7th", "pedal-point", "secondary-dominant"],
    summary: "One broken chord per bar, 35 bars, and a complete lesson in **voice leading**. Each chord is chosen so that the voices move as little as possible, which is why so many are inversions (slash chords).\n\nThe journey:\n- **bars 1–11**: a phrase that tonicizes G (V/V = D7)\n- **bars 12–19**: chromatic diminished-7th chords lead back to C\n- **bars 20–23**: a turn to F and a climb of diminished 7ths\n- **bars 24–31**: a long **dominant pedal** on G\n- **bars 32–35**: a final **tonic pedal** on C\n\nTry playing it as arpeggiated triads and 7ths on the middle strings, one chord per bar. *Numbering follows the Urtext (without the spurious 'Schwencke bar').*",
    sections: [
      { name: "Bars 1–11: from C towards G", chart: "| I:maj | ii:m7/b7 | V:7/3 | I:maj | vi:min/b3 | II:7/b7 | V:maj/3 | I:maj7/7 | vi:m7 | II:7/5 | V:maj |",
        notes: [
          { bar: 2, text: "Dm7 over C: ii4/2. The bass holds C while the upper voices move by step. It is a tonic pedal in miniature.", concepts: ["ana-pedal-point", "ana-bass-line"] },
          { bar: 3, text: "G7/B: V6/5. The bass steps down to B, the leading tone.", concepts: ["ana-authentic-cadence"] },
          { bar: 6, text: "D7/C = V/V with C in the bass. The F# heads for G.", concepts: ["ana-secondary-dominant"] },
          { bar: 8, text: "Cmaj7/B: a passing chord as the bass walks down C – B – A.", concepts: ["ana-bass-line"] },
          { bar: 11, text: "G: bars 9–11 (Am7 – D7/A – G) form a cadence *in G*, so the first phrase ends in the dominant key.", concepts: ["ana-modulation"] } ],
        subs: [
          { bar: 6, options: [
            { token: "II:7", label: "D7 in root position", why: "Same chord, but the bass would leap C → D → B. Bach's D7/C keeps the bass on C and lets it step down to B in the next bar. The whole prelude is voice-leading economy.", concepts: ["ana-bass-line", "ana-secondary-dominant"] } ] } ] },
      { name: "Bars 12–19: diminished chords lead home", chart: "| #i:dim7/b5 | ii:min/b3 | vii:dim7/b5 | I:maj/3 | IV:maj7/7 | ii:m7 | V:7 | I:maj |",
        notes: [
          { bar: 1, text: "C#°7 over G (vii°7 of ii): C# pushes to D, turning Dm into a passing goal.", concepts: ["ana-diminished-passing", "ana-secondary-dominant"] },
          { bar: 3, text: "B°7 over F: vii°7 of C itself, a rootless G7♭9.", concepts: ["ana-diminished-passing"] },
          { bar: 5, text: "Fmaj7/E: IV with the 7th in the bass, falling into Dm7 – G7 – C.", concepts: ["ana-bass-line"] } ] },
      { name: "Bars 20–23: towards F, then rising diminished", chart: "| I:7 | IV:maj7 | #iv:dim7 | vii:dim7/bb7 |",
        notes: [
          { bar: 1, text: "C7 = V/IV: the Bb tips us towards F.", concepts: ["ana-secondary-dominant"] },
          { bar: 3, text: "F#°7: vii°7 of V, with the bass rising F → F#. Then a diminished chord over Ab (also read as Fm6/Ab) pushes on to G.", concepts: ["ana-diminished-passing"] } ] },
      { name: "Bars 24–31: dominant pedal on G", chart: "| V:7 | I:maj/5 | V:7sus4 | V:7 | #iv:dim7/b2 | I:maj/5 | V:7sus4 | V:7 |",
        notes: [
          { bar: 1, text: "G in the bass for eight bars. Everything above, C/G, sus chords, a diminished chord, is heard as decoration of G, and the tension piles up.", concepts: ["ana-pedal-point"] },
          { bar: 2, text: "C/G: the cadential 6/4, tonic notes over the dominant bass.", concepts: ["ana-pedal-point", "ana-authentic-cadence"] } ] },
      { name: "Bars 32–35: tonic pedal on C", chart: "| I:7 | IV:maj/5 | V:7/4 | I:maj |",
        notes: [ { bar: 1, text: "C in the bass to the end, with a I7 – IV – V7 – I cadence floating above it.", concepts: ["ana-pedal-point", "ana-plagal-cadence"] } ] } ],
    compare: [
      { type: "compare", key: "C", chart: "| I:maj | ii:m7/b7 | V:7/3 | I:maj |", target: "ii:m7/b7",
        options: [ { token: "ii:m7/b7", label: "Dm7/C: Bach (bass stays)" }, { token: "ii:m7", label: "Dm7: root in the bass" }, { token: "IV:maj/5", label: "F/C: plainer pedal chord" } ],
        explain: "With the bass held on C, the change sounds like a breath. Put D in the bass and the same chord sounds like a new event. The whole prelude is built from choices like this." } ],
    source: "Analyses at bzoennchen.github.io (SuperCollider book, chapter 6), practicing-guitar.readthedocs.io (BWV 846), teoria.com 'BWV 846' article (dominant pedal from bar 24, tonic pedal), researchcatalogue.net; Wikipedia 'Prelude and Fugue in C major, BWV 846' (35 bars, Schwencke bar). Voicing labels of bars 26 and 28 are approximations of Bach's figuration."
  },
  {
    id: "ana-moonlight-sonata", title: "'Moonlight' Sonata, mvt. 1 (bars 1–5)", artist: "Ludwig van Beethoven (Op. 27 No. 2, 1801)",
    genre: "classical", level: 5, key: "C#m", tempo: 54, meter: "4/4", tags: ["neapolitan", "descending-bass", "minor", "cadential-64"],
    summary: "The opening five bars contain a complete minor-key cadence with one of the most famous **Neapolitan chords** in music. Over slow triplet arpeggios the bass descends **C# – B – A – F# – G#**:\n\n**i – i/b7 – VI – N6 – V7 – i**\n\nThe Neapolitan (**D major over F#**) is the major chord on the *lowered* 2nd degree. It replaces the normal predominant (iv or ii°), and its D natural falls to C#, B# and G# as the dominant arrives.\n\n*The movement is in cut time (2/2). The app plays it in 4/4 at a slow tempo, one bar per bar.*",
    sections: [
      { name: "Bars 1–5", chart: "| i:min | i:min/b7 | bVI:maj bII:maj/3 | V:7 | i:min |",
        notes: [
          { bar: 2, text: "C#m over B: a passing bass note on the way down.", concepts: ["ana-bass-line"] },
          { bar: 3, text: "A major (VI), then **D/F#**, the **Neapolitan sixth**. D natural is the b2 of C# minor; F# is the bass, as in a normal iv chord.", concepts: ["ana-neapolitan"] },
          { bar: 4, text: "G#7: the harmonic-minor dominant. D natural falls to C# and then B#. Analysts read a brief **cadential 6/4** (C#m/G#) and a suspension inside this bar before the pure V7.", concepts: ["ana-authentic-cadence", "ana-pedal-point"] },
          { bar: 5, text: "Home to C#m. The melody enters here." } ],
        subs: [
          { bar: 3, chord: 1, options: [
            { token: "iv:min", label: "F#m (plain iv)", why: "Same bass, same function, but D# instead of D. Comparing them shows exactly what the Neapolitan's lowered 2nd adds: a darker, more tragic weight.", concepts: ["ana-neapolitan"] },
            { token: "ii:m7b5/b3", label: "D#ø/F# (ii°)", why: "The other standard minor predominant, also over F#. It is restrained, where the Neapolitan is dramatic.", concepts: ["ana-harmonic-function"] } ] } ] } ],
    compare: [
      { type: "compare", key: "C#m", chart: "| i:min | i:min/b7 | bII:maj/3 | V:7 | i:min |", target: "bII:maj/3",
        options: [ { token: "bII:maj/3", label: "D/F#: Neapolitan sixth" }, { token: "iv:min", label: "F#m: plain iv" }, { token: "ii:m7b5/b3", label: "D#ø/F#: ii°" } ],
        explain: "All three keep F# in the bass. Listen to the note a step above the tonic: D# (iv, ii°) or D natural (Neapolitan). The D natural is what makes the arrival on G#7 feel so heavy." } ],
    source: "Bernd Hamann's bar-by-bar notes on Op. 27/2 (UC Davis); good-music-guide.com forum analysis (VI, N6); Society for Music Theory symposium article on Neapolitan formations in Beethoven's sonatas."
  },
  // ───────────────────────────── JAZZ STANDARDS ─────────────────────────────
  {
    id: "ana-autumn-leaves", title: "Autumn Leaves", artist: "Joseph Kosma (jazz standard)",
    genre: "jazz", level: 3, key: "Gm", tempo: 120, meter: "4/4", tags: ["ii-v-i", "relative-major", "minor-ii-v", "tritone-sub"],
    summary: "The first standard most jazz guitarists learn, and the clearest demonstration of **major and minor ii–V–Is side by side**. Every four-bar phrase is one or the other:\n- **Cm7 – F7 – Bbmaj7**: ii–V–I in **Bb** (the relative major)\n- **Am7♭5 – D7 – Gm**: ii–V–i in **G minor**\n\nThe Ebmaj7 between them is the pivot. It is IV in Bb and bVI in G minor, and the bass falls a 5th from Bb to Eb and then a tritone down to A. Form: AABC, 32 bars.",
    sections: [
      { name: "A (×2)", chart: "| iv:m7 | bVII:7 | bIII:maj7 | bVI:maj7 | ii:m7b5 | V:7b9 | i:m6 | % |",
        notes: [
          { bar: 1, text: "Cm7 – F7 – Bbmaj7: ii–V–I in Bb, the relative major.", concepts: ["ana-ii-v-i", "ana-modulation"] },
          { bar: 4, text: "Ebmaj7: IV of Bb *and* bVI of Gm, the pivot. The roots so far: C F Bb Eb A D G, the complete diatonic cycle of fifths.", concepts: ["ana-modulation", "ana-harmonic-function"] },
          { bar: 5, text: "Am7♭5 – D7♭9 – Gm6: the minor ii–V–i. Eb (b5 of Am7♭5) becomes the b9 of D7.", concepts: ["ana-ii-v-i"] } ],
        subs: [
          { bar: 6, options: [
            { token: "bII:7", label: "Ab7 (tritone sub)", why: "Ab7 shares D7's tritone (F#/Gb and C). The bass becomes A – Ab – G.", concepts: ["ana-tritone-sub"] },
            { token: "V:7#9b13", label: "D7#9♭13 (altered)", why: "The modern default sound: #9 (F) and b13 (Bb) are both notes of G minor. Voice it 3, b7, #9, b13 on the middle strings.", concepts: ["ana-dominant-colors"] } ] } ] },
      { name: "B", chart: "| ii:m7b5 | V:7b9 | i:m6 | % | iv:m7 | bVII:7 | bIII:maj7 | % |",
        notes: [ { bar: 1, text: "The bridge flips the order: minor first, then major.", concepts: ["ana-ii-v-i"] } ] },
      { name: "C", chart: "| ii:m7b5 | V:7b9 | i:m7 IV:7 | bvii:m7 bIII:7 | bVI:maj7 | ii:m7b5 V:7b9 | i:m6 | % |",
        notes: [
          { bar: 3, text: "Gm7 – C7 | Fm7 – Bb7 → Ebmaj7: two ii–Vs falling by whole step (into F, then Eb).", concepts: ["ana-ii-v-i", "ana-secondary-dominant"] },
          { bar: 6, text: "The final minor ii–V–i, compressed into one bar.", concepts: ["ana-ii-v-i"] } ],
        subs: [
          { bar: 3, chord: 1, options: [
            { token: "VII:7", label: "Gb7 (F#7; tritone sub of C7)", why: "The common jazz version: Gm7 – Gb7 | Fm7 – E7 | Ebmaj7, a chromatic bass descent G – Gb – F – E – Eb.", concepts: ["ana-tritone-sub"] } ] },
          { bar: 4, chord: 1, options: [
            { token: "VI:7", label: "E7 (tritone sub of Bb7)", why: "Completes the chromatic line into Ebmaj7.", concepts: ["ana-tritone-sub"] } ] } ] } ],
    compare: [
      { type: "compare", key: "Gm", chart: "| ii:m7b5 | V:7b9 | i:m6 | % |", target: "V:7b9",
        options: [ { scale: "phrygian-dominant", label: "D Phrygian dominant (G harmonic minor)" }, { scale: "altered", label: "D altered (Eb melodic minor)" },
                   { scale: "diminished-hw", label: "D half-whole" }, { scale: "mixolydian", label: "D Mixolydian" } ],
        explain: "Over the V of a minor ii–V: Phrygian dominant is the 'inside' minor sound (Eb, Bb). Altered adds F natural (#9) and Ab (b5), more tension and a smoother pull to Gm. Half-whole adds B natural (the 13th of D7), a bright, symmetrical tension that hints at G major for a moment before Gm6 arrives. Mixolydian's B and E sound as if D7 were heading for G *major*." },
      { type: "compare", key: "Gm", chart: "| ii:m7b5 | V:7b9 | i:m6 | % |", target: "ii:m7b5",
        options: [ { scale: "locrian", label: "A Locrian (Bb)" }, { scale: "locrian-nat2", label: "A Locrian ♮2 (B natural)" } ],
        explain: "Locrian's Bb is a G-minor scale note. Locrian ♮2 (from C melodic minor) gives a smoother, more modern half-diminished sound." } ],
    source: "guitarcomposerstoolbox.com 'Autumn Leaves in G'; jazzstandards.com (Autumn Leaves; tritone-sub passage); Mike Hayes 'Autumn Leaves chords: the ultimate guide'; learnjazzstandards.com. Bar 24 is Bbmaj7 or Ebmaj7 depending on the chart."
  },
  {
    id: "ana-all-the-things-you-are", title: "All the Things You Are", artist: "Jerome Kern (1939)",
    genre: "jazz", level: 6, key: "Ab", tempo: 160, meter: "4/4", tags: ["cycle-of-fifths", "modulation", "ii-v-i", "chromatic-mediant", "passing-diminished"],
    summary: "A tour of keys driven by the **cycle of fifths**. A1 moves from Ab to **C**; A2 is the same music a 4th lower, from Eb to **G**. The bridge goes from G to **E**, a major third down, and a **C7#5** (V of Fm) brings back the opening. The last A is extended to 12 bars, with a **minor iv** (Dbm7) and a **passing diminished** chord before the final cadence. Form: A(8) A'(8) B(8) A''(12) = 36 bars.\n\n*Numerals are relative to Ab, so the bridge appears as #i, #IV, #vi... Think of each four-bar phrase as a ii–V–I in its own key.*",
    sections: [
      { name: "A1 (Ab → C)", chart: "| vi:m7 | ii:m7 | V:7 | I:maj7 | IV:maj7 | VII:7 | III:maj7 | % |",
        notes: [
          { bar: 1, text: "Fm7 – Bbm7 – Eb7 – Abmaj7 – Dbmaj7: roots falling in fifths down the diatonic cycle.", concepts: ["ana-ii-v-i", "ana-harmonic-function"] },
          { bar: 6, text: "G7 → Cmaj7: a V–I into **C major**, a major third above Ab. Dbmaj7 → G7 is a tritone root move, but the chords share F (and Ab, if you play G7♭9), so the turn is smooth.", concepts: ["ana-modulation", "ana-chromatic-mediant"] } ],
        subs: [
          { bar: 6, options: [
            { token: "IV:7", label: "Db7 (tritone sub of G7)", why: "Dbmaj7 → Db7 → Cmaj7: change one note (C → Cb) and the bar becomes a tritone sub that slides by half step into the new key.", concepts: ["ana-tritone-sub"] } ] } ] },
      { name: "A2 (Eb → G)", chart: "| iii:m7 | vi:m7 | II:7 | V:maj7 | I:maj7 | #IV:7 | VII:maj7 | % |",
        notes: [ { bar: 1, text: "A1 moved down a perfect 4th: Cm7 – Fm7 – Bb7 – Ebmaj7 – Abmaj7 – D7 – Gmaj7.", concepts: ["ana-modulation"] } ] },
      { name: "Bridge (G → E)", chart: "| #i:m7 | #IV:7 | VII:maj7 | % | #vi:m7b5 | #II:7 | #V:maj7 | III:7#5 |",
        notes: [
          { bar: 1, text: "Am7 – D7 – Gmaj7: ii–V–I in G.", concepts: ["ana-ii-v-i"] },
          { bar: 5, text: "F#m7♭5 – B7 – Emaj7: ii–V–I in **E**, a major third below G. G and E are chromatic-mediant keys.", concepts: ["ana-chromatic-mediant", "ana-ii-v-i"] },
          { bar: 8, text: "C7#5: V of Fm. E → C is another major-third drop, and G# (= Ab) becomes the #5 of C7, a common tone back home.", concepts: ["ana-chromatic-mediant", "ana-secondary-dominant"] } ],
        subs: [
          { bar: 8, options: [
            { token: "III:7b9", label: "C7♭9", why: "A different tension: Db (b9) instead of Ab (#5). Both point to Fm.", concepts: ["ana-dominant-colors"] } ] } ] },
      { name: "A3 (12 bars)", chart: "| vi:m7 | ii:m7 | V:7 | I:maj7 | IV:maj7 | iv:m7 | iii:m7 | #ii:dim7 | ii:m7 | V:7 | I:maj7 | vii:m7b5 III:7 |",
        notes: [
          { bar: 6, text: "Dbm7: the **minor iv**, borrowed from Ab minor. Fb (E) falls to Eb.", concepts: ["ana-modal-interchange", "ana-plagal-cadence"] },
          { bar: 7, text: "Cm7 – B°7 – Bbm7: a chromatic descent through a **passing diminished** chord.", concepts: ["ana-diminished-passing"] },
          { bar: 12, text: "Gm7♭5 – C7: turnaround to the top (Fm7).", concepts: ["ana-ii-v-i"] } ],
        subs: [
          { bar: 6, options: [
            { token: "bVII:7", label: "Gb7 (backdoor)", why: "Wikipedia lists Gb7 (or Dbm7–Gb7) as a common variant: the backdoor dominant.", concepts: ["ana-backdoor"] } ] } ] } ],
    compare: [
      { type: "compare", key: "Ab", chart: "| #V:maj7 | III:7#5 | vi:m7 | ii:m7 |", target: "III:7#5",
        options: [ { scale: "altered", label: "C altered" }, { scale: "whole-tone", label: "C whole tone" }, { scale: "mixolydian-b6", label: "C Mixolydian ♭6 (F melodic minor)" } ],
        explain: "All three have G#/Ab as the #5/b13. Whole tone is dreamy and blurred, altered is the most tense (Db, D#), and Mixolydian ♭6 keeps a natural 9 (D), so it sounds 'minor-key dominant' rather than bebop." } ],
    source: "Wikipedia 'All the Things You Are' (form, keys, bar 30 variants); guitarcomposerstoolbox.com 'All the Things You Are'. Variants: F#m7 vs F#m7♭5 in the bridge; Bdim7 vs Bbdim7 in bar 32."
  },
  {
    id: "ana-giant-steps", title: "Giant Steps", artist: "John Coltrane (1959)",
    genre: "jazz", level: 10, key: "B", tempo: 280, meter: "4/4", tags: ["coltrane-changes", "major-thirds", "ii-v-i", "fast"],
    summary: "Sixteen bars cycling through three tonal centres a **major third apart: B, G and Eb**. These divide the octave into three equal parts, so their tonics form an augmented triad. Each new key is approached by its own V7, or by a ii–V in the second half.\n\nBars 1–7 move *down* the cycle (B → G → Eb) twice over, with dominants in between. Bars 8–16 move *up* the cycle with ii–Vs.\n\n*Numerals are relative to B. The engine spells Bb7 as A#7 and Ebmaj7 as D#maj7, since they are the 7th and 3rd degrees of B.*",
    sections: [
      { name: "Bars 1–8", chart: "| I:maj7 bIII:7 | bVI:maj7 VII:7 | III:maj7 | bvii:m7 bIII:7 | bVI:maj7 VII:7 | III:maj7 V:7 | I:maj7 | bv:m7 VII:7 |",
        notes: [
          { bar: 1, text: "Bmaj7 → D7 → Gmaj7: a drop of a major third, bridged by G's dominant.", concepts: ["ana-coltrane-changes"] },
          { bar: 2, text: "Gmaj7 → Bb7 → Ebmaj7: another major-third drop.", concepts: ["ana-coltrane-changes", "ana-chromatic-mediant"] },
          { bar: 4, text: "Am7 – D7: now a ii–V into G.", concepts: ["ana-ii-v-i"] },
          { bar: 8, text: "Fm7 – Bb7 into Eb: the second half uses ii–Vs throughout.", concepts: ["ana-ii-v-i"] } ],
        subs: [
          { bar: 3, options: [
            { token: "III:maj7#5", label: "Ebmaj7#5", why: "A variant some charts use: the #5 (B) foreshadows the Bmaj7 keys around it.", concepts: ["ana-coltrane-changes"] } ] } ] },
      { name: "Bars 9–16", chart: "| III:maj7 | bvii:m7 bIII:7 | bVI:maj7 | ii:m7 V:7 | I:maj7 | bv:m7 VII:7 | III:maj7 | ii:m7 V:7 |",
        notes: [
          { bar: 1, text: "Eb → (ii–V) G → (ii–V) B → (ii–V) Eb: each key arrives for a full bar now, climbing the cycle in major thirds.", concepts: ["ana-coltrane-changes", "ana-ii-v-i"] },
          { bar: 8, text: "C#m7 – F#7: ii–V back to Bmaj7 at the top.", concepts: ["ana-ii-v-i"] } ],
        subs: [
          { bar: 4, chord: 1, options: [
            { token: "V:7b9", label: "F#7♭9", why: "One altered colour at a time is plenty at this tempo. The b9 (G) is a common tone with the Gmaj7 that appears elsewhere in the tune.", concepts: ["ana-dominant-colors"] } ] } ] } ],
    compare: [
      { type: "compare", key: "B", chart: "| I:maj7 bIII:7 | bVI:maj7 VII:7 | III:maj7 | % |", target: "bVI:maj7",
        options: [ { scale: "major-pentatonic", label: "G major pentatonic" }, { scale: "ionian", label: "G major" }, { scale: "lydian", label: "G Lydian" } ],
        explain: "At 280 bpm, each key lasts two beats. Pentatonic and 1-2-3-5 cells (Coltrane's own approach) state each key clearly. Full scales tend to blur the changes." } ],
    source: "Wikipedia 'Giant Steps (composition)' (key centres B, G, Eb); guitartabs.cc and talkbass.com charts; guitarcomposerstoolbox.com (same chord order)."
  },
  {
    id: "ana-rhythm-changes", title: "Rhythm Changes", artist: "After George Gershwin, 'I Got Rhythm' (1930)",
    genre: "jazz", level: 6, key: "Bb", tempo: 200, meter: "4/4", tags: ["rhythm-changes", "turnaround", "extended-dominants", "bebop"],
    summary: "The second most important form in jazz after the blues, used by hundreds of bebop tunes ('Oleo', 'Anthropology', 'Moose the Mooche'...). It is AABA, 32 bars:\n- **A**: fast I–vi–ii–V turnarounds, a trip to IV (with the minor iv or a passing diminished), and back.\n- **Bridge**: **extended dominants**, D7 – G7 – C7 – F7, two bars each, travelling around the cycle of fifths back to Bb.",
    sections: [
      { name: "A", chart: "| I:6 vi:m7 | ii:m7 V:7 | I:6 vi:m7 | ii:m7 V:7 | I:6 I:7 | IV:6 iv:m7 | I:6 vi:m7 | ii:m7 V:7 |",
        notes: [
          { bar: 1, text: "Bb6 – Gm7 – Cm7 – F7: the I–vi–ii–V turnaround, two beats per chord.", concepts: ["ana-ii-v-i", "ana-axis"] },
          { bar: 5, text: "Bb → Bb7: I7 = V/IV, tonicizing Eb.", concepts: ["ana-secondary-dominant"] },
          { bar: 6, text: "Eb6 → Ebm7: IV → iv, the minor plagal, before Bb returns.", concepts: ["ana-plagal-cadence", "ana-modal-interchange"] } ],
        subs: [
          { bar: 1, chord: 1, options: [
            { token: "V/ii:7", label: "G7 (VI7)", why: "The bebop default: I–VI7–ii–V. The secondary dominant adds B natural.", concepts: ["ana-secondary-dominant"] } ] },
          { bar: 6, chord: 1, options: [
            { token: "#iv:dim7", label: "E°7", why: "Eb6 – E°7 – Bb/F: a passing diminished chord with a rising bass, the classic alternative.", concepts: ["ana-diminished-passing"] },
            { token: "bVII:7", label: "Ab7 (backdoor)", why: "Eb7 – Ab7 → Bb: a backdoor approach to the tonic.", concepts: ["ana-backdoor"] } ] } ] },
      { name: "Bridge", chart: "| V/vi:7 | % | V/ii:7 | % | V/V:7 | % | V:7 | % |",
        notes: [
          { bar: 1, text: "D7 → G7 → C7 → F7: each dominant resolves to another dominant. The 'Sears Roebuck bridge' of the swing era.", concepts: ["ana-secondary-dominant"] },
          { bar: 7, text: "F7 returns us to the final A.", concepts: ["ana-authentic-cadence"] } ],
        subs: [
          { bar: 1, options: [
            { token: "vii:m7", label: "Am7 (ii–V each dominant)", why: "Split each two-bar dominant into a ii–V: | Am7 D7 | Dm7 G7 | Gm7 C7 | Cm7 F7 |, the bebop treatment.", concepts: ["ana-ii-v-i"] } ] } ] } ],
    compare: [
      { type: "compare", key: "Bb", chart: "| V/vi:7 | % | V/ii:7 | % |", target: "V/vi:7",
        options: [ { scale: "mixolydian", label: "D Mixolydian" }, { scale: "lydian-dominant", label: "D Lydian dominant" }, { scale: "altered", label: "D altered" }, { scale: "diminished-hw", label: "D half-whole" } ],
        explain: "D7 resolves to G7 (a dominant), not to a G tonic, so anything goes. Mixolydian is the swing sound, Lydian dominant the modern one. Altered and half-whole create bebop tension that resolves into G7's 3rd (B)." } ],
    source: "Wikipedia 'Rhythm changes'; thejazzpianosite.com 'Rhythm Changes' (grid and variants)."
  },
  {
    id: "ana-so-what", title: "So What", artist: "Miles Davis (1959)",
    genre: "jazz", level: 4, key: "Dm", tempo: 136, meter: "4/4", tags: ["modal-jazz", "dorian", "quartal", "so-what-chord"],
    summary: "The anthem of **modal jazz**: 16 bars of **D Dorian**, 8 bars of **Eb Dorian** (up a half step), and 8 more of D. That's two chords in 32 bars. There are no ii–Vs and no cadences. Interest comes from the melody, the rhythm, and the famous **'So What chord'**: three stacked 4ths with a major 3rd on top (E–A–D–G–B over Dm). It is answered by the same shape a step lower (D–G–C–F–A).\n\nOn guitar, play the So What chord on strings 5–1 and slide it diatonically up and down the Dorian scale.",
    sections: [
      { name: "A (8 bars, played twice)", chart: "| i:m7 | % | % | % | % | % | % | % |",
        notes: [
          { bar: 1, text: "Dm7 for 16 bars. The scale is D Dorian (all white keys), and the characteristic note is B natural, the major 6th.", concepts: ["ana-mode-brightness", "ana-dorian-iv"] },
          { bar: 2, text: "The So What chord, E A D G B, is five white-key notes in 4ths and a 3rd. Move it down a step (D G C F A) and back for the 'amen' response.", concepts: ["ana-quartal"] } ],
        subs: [
          { bar: 1, options: [
            { token: "i:m11", label: "Dm11", why: "The tertian name for the So What sonority. Stacking 3rds or 4ths from D Dorian gives similar colours, but the 4ths sound more open and less 'functional'.", concepts: ["ana-quartal"] } ] } ] },
      { name: "B (8 bars)", chart: "| bii:m7 | % | % | % | % | % | % | % |",
        notes: [ { bar: 1, text: "Ebm7: Eb Dorian, the whole world up a half step. It is the simplest possible 'modulation', a direct shift with no pivot.", concepts: ["ana-modulation"] } ] },
      { name: "A (last 8)", chart: "| i:m7 | % | % | % | % | % | % | % |",
        notes: [ { bar: 1, text: "Back down to D Dorian." } ] } ],
    compare: [
      { type: "compare", key: "Dm", chart: "| i:m7 | % | % | % |", target: "i:m7",
        options: [ { scale: "dorian", label: "D Dorian (B natural)" }, { scale: "aeolian", label: "D Aeolian (Bb)" }, { scale: "minor-pentatonic", label: "D minor pentatonic" } ],
        explain: "Over a static Dm7 the 6th degree decides everything. B natural is cool and open, Miles' sound. Bb is darker and more classical. The pentatonic omits the 6th, so add B to it to sound modal." } ],
    source: "Wikipedia 'So What (Miles Davis composition)' (form, D/Eb Dorian); brunojazz.com; musicplayer.com forum (citing Marc Sabatella) on the So What voicing."
  },
  {
    id: "ana-stella-by-starlight", title: "Stella by Starlight", artist: "Victor Young (1944)",
    genre: "jazz", level: 8, key: "Bb", tempo: 110, meter: "4/4", tags: ["deceptive-ii-v", "backdoor", "half-diminished", "chains", "lydian-dominant"],
    summary: "A harmonic labyrinth, and a jazz rite of passage. It starts *far* from the tonic, on **Em7♭5 – A7♭9**, a minor ii–V towards D minor that resolves deceptively to **Cm7**. From there it is a chain of ii–Vs and surprises:\n- a **backdoor** Ab7 → Bbmaj7\n- a D7 → **G7#5**, held for two bars, resolving to Cm7\n- a closing chain of **minor ii–Vs falling by whole step** (Em7♭5 A7 → Dm7♭5 G7 → Cm7♭5 F7 → Bb)\n\nIt contains seven half-diminished chords in 32 bars. Practise it slowly with guide tones (3rds and 7ths).",
    sections: [
      { name: "Bars 1–8", chart: "| #iv:m7b5 | VII:7b9 | ii:m7 | V:7 | v:m7 | I:7 | IV:maj7 | bVII:7 |",
        notes: [
          { bar: 1, text: "Em7♭5 – A7♭9: a minor ii–V *of D minor* (iii)...", concepts: ["ana-ii-v-i"] },
          { bar: 3, text: "...that lands on Cm7 instead, a deceptive resolution. Cm7 – F7 is the ii–V of Bb, but it too is sidestepped.", concepts: ["ana-deceptive-cadence", "ana-ii-v-i"] },
          { bar: 5, text: "Fm7 – Bb7 → Ebmaj7: ii–V–I of IV.", concepts: ["ana-ii-v-i", "ana-secondary-dominant"] },
          { bar: 8, text: "Ab7: bVII7, the **backdoor** dominant, often played Ab7#11.", concepts: ["ana-backdoor", "ana-lydian-dominant"] } ],
        subs: [
          { bar: 2, options: [
            { token: "i:dim7", label: "Bb°7", why: "A common substitute: Bb°7 = A7♭9 without its root, and it moves stepwise into Cm7.", concepts: ["ana-diminished-passing"] } ] } ] },
      { name: "Bars 9–16", chart: "| I:maj7 | #iv:m7b5 VII:7 | iii:m7 | i:m7 IV:7 | V:maj7 | #iv:m7b5 VII:7 | vii:m7b5 | III:7b9 |",
        notes: [
          { bar: 1, text: "Bbmaj7: the tonic, finally, at bar 9.", concepts: ["ana-backdoor"] },
          { bar: 3, text: "Dm7 – Bbm7 Eb7 → Fmaj7: a ii–V a whole step below the target, borrowed from the parallel minor (iv–bVII of F). It is the backdoor into V.", concepts: ["ana-backdoor", "ana-modulation"] },
          { bar: 7, text: "Am7♭5 – D7♭9: minor ii–V towards G minor...", concepts: ["ana-ii-v-i"] } ] },
      { name: "Bars 17–24", chart: "| VI:7#5 | % | ii:m7 | % | bVII:7 | % | I:maj7 | % |",
        notes: [
          { bar: 1, text: "...which arrives as **G7#5** instead (major, not minor), held two bars as V/ii.", concepts: ["ana-secondary-dominant", "ana-dominant-colors"] },
          { bar: 5, text: "Ab7 for two bars → Bbmaj7: the backdoor again, given room to breathe. Lydian dominant (Ab7#11) is the classic sound.", concepts: ["ana-backdoor", "ana-lydian-dominant"] } ] },
      { name: "Bars 25–32", chart: "| #iv:m7b5 | VII:7b9 | iii:m7b5 | VI:7b9 | ii:m7b5 | V:7b9 | I:maj7 | % |",
        notes: [ { bar: 1, text: "Three minor ii–Vs falling by whole steps: towards D minor, C minor, then Bb. Only the last one resolves, and to a major chord.", concepts: ["ana-ii-v-i", "ana-deceptive-cadence"] } ],
        subs: [
          { bar: 8, options: [
            { token: "#iv:m7b5", label: "Em7♭5 (turnaround)", why: "Charts often add Em7♭5 – A7 in bars 31–32 to lead back to the top.", concepts: ["ana-ii-v-i"] } ] } ] } ],
    compare: [
      { type: "compare", key: "Bb", chart: "| v:m7 | I:7 | IV:maj7 | bVII:7 | I:maj7 |", target: "bVII:7",
        options: [ { scale: "lydian-dominant", label: "Ab Lydian dominant (D natural)" }, { scale: "mixolydian", label: "Ab Mixolydian (Db)" } ],
        explain: "D natural (the #11 of Ab7) is the 3rd of the coming Bbmaj7, so Lydian dominant glides into the resolution. Mixolydian's Db sounds bluesy and pulls towards Gb instead." },
      { type: "compare", key: "Bb", chart: "| vii:m7b5 | III:7b9 | VI:7#5 | ii:m7 |", target: "VI:7#5",
        options: [ { scale: "altered", label: "G altered" }, { scale: "whole-tone", label: "G whole tone" }, { scale: "mixolydian-b6", label: "G Mixolydian ♭6" } ],
        explain: "G7#5 is going to C minor. All three options contain Eb (#5 / b13), the 3rd of Cm. Whole tone matches the #5 chord symmetrically, altered adds Ab and Bb (b9, #9), and Mixolydian ♭6 keeps a natural 9 (A)." } ],
    source: "Learnjazzstandards.com 'Improvise over Stella by Starlight' (bar positions of m7♭5 and altered V7s); guitarcomposerstoolbox.com; jazzstandards.com (analysis in G). Variants: Bb°7 for A7♭9; Ab7#11."
  },
  {
    id: "ana-body-and-soul", title: "Body and Soul", artist: "Johnny Green (1930)",
    genre: "jazz", level: 8, key: "Db", tempo: 60, meter: "4/4", tags: ["modulation", "half-step-modulation", "passing-diminished", "ballad", "tritone-sub"],
    summary: "The tenor-saxophone ballad (Coleman Hawkins' 1939 recording made it a jazz cornerstone). The A sections live in **Db major**, opening on the ii chord (Ebm7) and full of passing chords. The bridge is famous: it **jumps up a half step to D major**, steps **down to C major**, then crawls back to Db through chromatic dominants **C7 – B7 – Bb7**.\n\n*Numerals are relative to Db, so the bridge (in D and C) appears as #I, #ii, VII... Bridge bar splits are approximate; the sources disagree on details here.*",
    sections: [
      { name: "A1 (A2 ends with Em7 A7 into the bridge)", chart: "| ii:m7 V/ii:7b9 | ii:m7 V:7 | I:maj7 IV:7 | iii:m7 #ii:dim7 | ii:m7 ii:m7/b7 vii:m7b5 III:7b9 | vi:m7 II:7 ii:m7 V:7 | I:6 | ii:m7 VI:7 |",
        notes: [
          { bar: 1, text: "Ebm7 – Bb7♭9 – Ebm7: the tune opens on ii, tonicized by its own dominant. The tonic is withheld until bar 3.", concepts: ["ana-secondary-dominant"] },
          { bar: 3, text: "Dbmaj7 – Gb7: I – IV7. The blues-tinged IV7 is the Lydian dominant colour.", concepts: ["ana-lydian-dominant"] },
          { bar: 4, text: "Fm7 – E°7 – Ebm7: a chromatic descent through a **passing diminished** chord.", concepts: ["ana-diminished-passing"] },
          { bar: 5, text: "Ebm7 – Ebm7/Db – Cm7♭5 – F7: a descending bass (Eb – Db – C), then a minor ii–V to Bbm.", concepts: ["ana-bass-line", "ana-ii-v-i"] },
          { bar: 6, text: "Bbm7 – Eb7 – Ebm7 – Ab7: two ii–Vs back home to Db.", concepts: ["ana-ii-v-i"] } ],
        subs: [
          { bar: 2, chord: 1, options: [
            { token: "#I:7", label: "D7 (tritone sub of Ab7)", why: "A very common variant: Ebm7 – D7 → Dbmaj7, a chromatic bass Eb – D – Db.", concepts: ["ana-tritone-sub"] } ] } ] },
      { name: "Bridge (D → C → back)", chart: "| #I:maj7 #ii:m7 | #iii:m7 #iii:m7 #iv:m7 VII:7 | #iii:m7 #VI:7 #ii:m7 #V:7 | #I:maj7 | #i:m7 #IV:7 | VII:maj7 ii:dim7 | #i:m7 #IV:7 | VII:7 VII:7 #VI:7 VI:7 |",
        notes: [
          { bar: 1, text: "**D major**, a half step above Db. A2 ended with Em7 – A7 (ii–V of D), so the jump has been prepared.", concepts: ["ana-modulation"] },
          { bar: 2, text: "F#m7 – Gm7 – C7: a chromatic sidestep. Gm7–C7 is a ii–V a half step above F#m7 (a common bebop 'side-slip').", concepts: ["ana-ii-v-i"] },
          { bar: 5, text: "Dm7 – G7 – Cmaj7: now **C major**, a whole step down from D.", concepts: ["ana-modulation", "ana-ii-v-i"] },
          { bar: 6, text: "Eb°7: a passing diminished chord between Cmaj7 and Dm7.", concepts: ["ana-diminished-passing"] },
          { bar: 8, text: "C7 – B7 – Bb7: chromatic dominants. Bb7 is V of Ebm7, the first chord of the last A, so the half-step crawl returns us to Db. (C7 – B7 – Bb7 is the tritone-sub version of C7 – F7 – Bb7.)", concepts: ["ana-tritone-sub", "ana-secondary-dominant"] } ],
        subs: [
          { bar: 8, chord: 2, options: [
            { token: "III:7", label: "F7 (cycle of fifths)", why: "The un-subbed version: C7 – F7 – Bb7, falling fifths. The chromatic B7 is the tritone sub of F7.", concepts: ["ana-tritone-sub"] } ] } ] } ],
    source: "jazz-library.com 'Body and Soul' (chord order incl. bridge); jazzstandards.com (A-section chords; bridge in D then C; C7–B7–Bb7); guitarcomposerstoolbox.com; Wikipedia 'Body and Soul (1930 song)'; Faber sheet-music excerpt (Ebm7 Bb7♭9 Ebm7 Ab9 Dbmaj7 Gb13 Fm7 Edim7 Ebm7 Ebm7/Db Cm7♭5 F7♭9). Bridge confidence medium."
  },
  {
    id: "ana-lady-bird", title: "Lady Bird", artist: "Tadd Dameron (1939)",
    genre: "jazz", level: 6, key: "C", tempo: 160, meter: "4/4", tags: ["backdoor", "tadd-dameron-turnaround", "modal-interchange", "ii-v"],
    summary: "Sixteen bars that are a little textbook of **modal interchange**. Out of C major come:\n- a **backdoor** ii–V (Fm7 – Bb7 → C)\n- a ii–V into **Ab** (bVI), the key of C minor's submediant\n- the famous **Tadd Dameron turnaround**, **Cmaj7 – Ebmaj7 | Abmaj7 – Dbmaj7**, which is the I–vi–ii–V turnaround with every chord replaced by a major-seventh chord a tritone (or minor third) away\n\nMiles Davis's 'Half Nelson' uses the same changes.",
    sections: [
      { name: "16 bars", chart: "| I:maj7 | % | iv:m7 | bVII:7 | I:maj7 | % | bvii:m7 | bIII:7 | bVI:maj7 | % | vi:m7 | V/V:7 | ii:m7 | V:7 | I:maj7 bIII:maj7 | bVI:maj7 bII:maj7 |",
        notes: [
          { bar: 3, text: "Fm7 – Bb7 → Cmaj7: the **backdoor** ii–V, minor iv and bVII7 borrowed from C minor.", concepts: ["ana-backdoor", "ana-modal-interchange"] },
          { bar: 7, text: "Bbm7 – Eb7 → Abmaj7: a ii–V into **bVI** (Ab), a borrowed key area. Ab is a chromatic mediant of C.", concepts: ["ana-modal-interchange", "ana-chromatic-mediant", "ana-ii-v-i"] },
          { bar: 11, text: "Am7 – D7 – Dm7 – G7: back to C via VI–II–ii–V, with D7 working as V/V.", concepts: ["ana-secondary-dominant", "ana-ii-v-i"] },
          { bar: 15, text: "**The Tadd Dameron turnaround**: C – Eb – Ab – Db, all maj7. Compare it with C – A7 – D7 – G7. Each dominant is swapped for its tritone sub (Eb7, Ab7, Db7), and then the subs are turned into maj7 chords. After C, the roots Eb – Ab – Db fall in fifths, each a tritone away from the 'original' root (A, D, G), and the last one slides by half step into C.", concepts: ["ana-tadd-turnaround", "ana-tritone-sub"] } ],
        subs: [
          { bar: 15, chord: 1, options: [
            { token: "bIII:7", label: "Eb7", why: "Wikipedia's Lady Bird page gives the turnaround as Cmaj7 Eb7 | Abmaj7 Db7, with dominants on the 2nd and 4th chords. This is the more 'functional' version, with explicit tritone subs.", concepts: ["ana-tadd-turnaround", "ana-tritone-sub"] } ] },
          { bar: 16, chord: 1, options: [
            { token: "bII:7", label: "Db7", why: "The dominant version of the last chord: the tritone sub of G7, sliding into C.", concepts: ["ana-tritone-sub"] },
            { token: "V:7", label: "G7 (plain)", why: "Replace it with the 'original' V7 to hear what the Tadd turnaround is substituting for.", concepts: ["ana-authentic-cadence"] } ] } ] } ],
    compare: [
      { type: "compare", key: "C", chart: "| I:maj7 bIII:maj7 | bVI:maj7 bII:maj7 | I:maj7 | % |", target: "bII:maj7",
        options: [ { token: "bII:maj7", label: "Dbmaj7: Tadd's choice" }, { token: "bII:7", label: "Db7: tritone sub" }, { token: "V:7", label: "G7: plain V" } ],
        explain: "Dbmaj7 contains C, the tonic itself, so the resolution is soft and glowing. Db7 adds Cb (= B, the leading tone), and G7 adds the full tritone. Three degrees of pull into the same Cmaj7." } ],
    source: "Wikipedia 'Lady Bird (composition)' and 'Tadd Dameron turnaround'; guitarcomposerstoolbox.com 'Lady Bird in C'. Turnaround variants: all maj7 vs Eb7/Db7."
  },
  {
    id: "ana-solar", title: "Solar", artist: "Miles Davis (1954; after Chuck Wayne's 'Sonny')",
    genre: "jazz", level: 6, key: "Cm", tempo: 160, meter: "4/4", tags: ["ii-v-chains", "descending-keys", "minor-major-7", "modulation"],
    summary: "Twelve bars, and a ii–V staircase that walks **down by whole steps through keys**. From the C minor(maj7) tonic, the tune goes:\n- Gm7 – C7 → **F**\n- Fm7 – Bb7 → **Eb**\n- Ebm7 – Ab7 → **Db**\n- Dm7♭5 – G7 → **C minor** again\n\nEach ii–V is the 'ii' of the previous key turned minor, the same trick that drives 'Tune Up' and 'How High the Moon'.",
    sections: [
      { name: "12 bars", chart: "| i:mMaj7 | % | v:m7 | I:7 | IV:maj7 | % | iv:m7 | bVII:7 | bIII:maj7 | biii:m7 bVI:7 | bII:maj7 | ii:m7b5 V:7 |",
        notes: [
          { bar: 1, text: "Cm(maj7): the melodic-minor tonic, with B natural, a jazz minor sound (the chord at the top of the minor line cliché)." },
          { bar: 3, text: "Gm7 – C7 → Fmaj7: the tonic minor is reinterpreted as part of a ii–V to F. Cm becomes C7.", concepts: ["ana-ii-v-i", "ana-modulation"] },
          { bar: 7, text: "Fmaj7 turns minor (Fm7) and becomes the ii of Eb.", concepts: ["ana-ii-v-i", "ana-modal-interchange"] },
          { bar: 10, text: "Ebmaj7 → Ebm7 – Ab7 → Dbmaj7: the same move again, a whole step lower. Db is the Neapolitan of C minor.", concepts: ["ana-ii-v-i", "ana-neapolitan"] },
          { bar: 12, text: "Dm7♭5 – G7: minor ii–V home. Dbmaj7 → Dm7♭5 rises by half step.", concepts: ["ana-ii-v-i"] } ],
        subs: [
          { bar: 3, options: [
            { token: "i:m7", label: "Cm7 (Wikipedia's 'Cm7 or Gm7')", why: "Some versions stay on Cm7 here and play Gm7–C7 in bar 4.", concepts: ["ana-ii-v-i"] } ] },
          { bar: 12, chord: 1, options: [
            { token: "V:7b9", label: "G7♭9", why: "The minor-key dominant colour, pointing firmly to Cm.", concepts: ["ana-dominant-colors"] } ] } ] } ],
    compare: [
      { type: "compare", key: "Cm", chart: "| i:mMaj7 | % | v:m7 | I:7 |", target: "i:mMaj7",
        options: [ { scale: "melodic-minor", label: "C melodic minor (A, B)" }, { scale: "harmonic-minor", label: "C harmonic minor (Ab, B)" }, { scale: "dorian", label: "C Dorian (A, Bb)" } ],
        explain: "The chord's major 7th (B) rules out Dorian, which sounds like it ignores the chord. Melodic minor is the smooth modern jazz-minor sound; harmonic minor's Ab adds an exotic, classical edge." } ],
    source: "Wikipedia 'Solar (composition)' (12 bars; Cm7 or Gm7 in bar 3); guitarcomposerstoolbox.com 'Solar in C'. Variants: Cm vs Cm(maj7) in bar 1; G7♭9 in bar 12."
  },
  {
    id: "ana-take-the-a-train", title: "Take the 'A' Train", artist: "Billy Strayhorn (1939)",
    genre: "jazz", level: 4, key: "C", tempo: 168, meter: "4/4", tags: ["lydian-dominant", "ii7", "swing", "secondary-dominant"],
    summary: "The Ellington band's theme. Its signature is bar 3: a **D7♭5** (II7 = V/V), held for two bars, whose b5 (Ab = G#) is the **#11**, the **Lydian dominant** sound. The A section is otherwise a simple I – II7 – ii – V – I. The bridge moves to **F (IV)** and returns via D7 – Dm7 – G7. Form: AABA, 32 bars.",
    sections: [
      { name: "A", chart: "| I:6 | % | II:7b5 | % | ii:m7 | V:7 | I:6 | ii:m7 V:7 |",
        notes: [
          { bar: 3, text: "D7♭5: II7. The F# (3rd) and the Ab/G# (b5 = #11) give a bright, slightly 'off' sound.", concepts: ["ana-lydian-dominant", "ana-secondary-dominant"] },
          { bar: 5, text: "Dm7: D7 becomes minor and turns into a ii–V. It is the classic II7 → ii7 → V7 → I.", concepts: ["ana-ii-v-i"] } ],
        subs: [
          { bar: 3, options: [
            { token: "II:9", label: "D9", why: "A softer, swing-era voicing, with no #11 clash with the melody.", concepts: ["ana-secondary-dominant"] },
            { token: "II:7#11", label: "D7#11", why: "The modern spelling: same Lydian-dominant sound, with a natural 5th.", concepts: ["ana-lydian-dominant"] } ] },
          { bar: 6, options: [
            { token: "bII:7", label: "Db7", why: "Tritone sub into C. The bass slides D – Db – C.", concepts: ["ana-tritone-sub"] } ] } ] },
      { name: "Bridge", chart: "| IV:maj7 | % | % | % | II:7 | % | ii:m7 | V:7 |",
        notes: [
          { bar: 1, text: "Four bars of Fmaj7 (IV). Some charts write F6 or even F7.", concepts: ["ana-harmonic-function"] },
          { bar: 5, text: "D7 – Dm7 – G7: the A section's move, now leading back to the last A.", concepts: ["ana-secondary-dominant", "ana-ii-v-i"] } ] } ],
    compare: [
      { type: "compare", key: "C", chart: "| I:6 | % | II:7b5 | % |", target: "II:7b5",
        options: [ { scale: "lydian-dominant", label: "D Lydian dominant (G#)" }, { scale: "mixolydian", label: "D Mixolydian (G)" }, { scale: "whole-tone", label: "D whole tone" } ],
        explain: "The written chord has the b5 / #11 (G#). Lydian dominant and whole tone both contain it. Mixolydian's G natural clashes with the chord, though over a plain D7 it is the 'swing' choice." } ],
    source: "jazz-guitar-licks.com 'Take the A Train' chord-melody lesson (A and B grids); guitarcomposerstoolbox.com; antonjazz.com; Wikipedia 'Take the \"A\" Train'."
  },
];

export const concepts = [
  {
    id: "ana-harmonic-function", title: "Harmonic function: tonic, predominant, dominant", tags: ["harmony", "function", "analysis"],
    body: "Chords in a key fall into three families by *job*:\n\n- **Tonic (T)**: rest, home. I, plus its substitutes vi and iii (they share two notes with I).\n- **Predominant (PD)**: motion away, preparing the dominant. IV and ii (ii is IV with an extra 3rd below).\n- **Dominant (D)**: tension that wants to resolve. V and vii°, both containing the tritone 4–7 (F–B in C).\n\nThe basic sentence of tonal music is **T → PD → D → T**: I–IV–V–I, I–ii–V–I, I–vi–ii–V. Once you hear function, substitutions stop being magic. Any chord that does the same job, or holds the same tendency tones, can stand in.\n\n### In blues and rock\nThe rules bend. V often moves to IV (a 'retrogression'), I can be a dominant 7th, and bVII can play the dominant without a leading tone.",
    visual: { type: "progression", key: "C", chart: "| I:maj | vi:min | ii:m7 | V:7 | I:maj |" },
    see: ["ana-authentic-cadence", "ana-plagal-cadence", "ana-ii-v-i"] },
  {
    id: "ana-authentic-cadence", title: "Authentic cadence (V–I)", tags: ["harmony", "cadence"],
    body: "**V → I**: the strongest ending. It works because of two half-step resolutions:\n- the **leading tone** (7th degree, the 3rd of V) rises to the tonic\n- the **7th of V7** (4th degree) falls to the 3rd of I\n\nThose two notes form a **tritone**, the unstable interval at the heart of every dominant.\n\n- **Perfect authentic**: V–I with both roots in the bass and the tonic on top.\n- **Imperfect authentic**: inverted chords or the 3rd/5th on top. It sounds less final.\n- In minor keys, V is made major by raising the 7th degree (harmonic minor), which provides the leading tone.\n\nGuitar tip: play just the 3rd and 7th of G7 (B and F, on strings 3 and 2 or 4 and 3) and resolve them by half step to C and E. That is the whole cadence in two fingers.",
    visual: { type: "progression", key: "C", chart: "| ii:m7 | V:7 | I:maj7 | % |", voicing: "shell" },
    see: ["ana-harmonic-function", "ana-deceptive-cadence", "ana-half-cadence", "ana-dominant-colors"] },
  {
    id: "ana-plagal-cadence", title: "Plagal and minor plagal cadences", tags: ["harmony", "cadence", "modal-interchange"],
    body: "**Plagal (IV → I)**: the 'amen' cadence. It has no leading tone, so it *settles* rather than resolves. It is everywhere in gospel, rock (I–IV–I) and blues (V–IV–I).\n\n**Minor plagal (iv → I)**: borrow the iv chord from the parallel minor (Fm in C). Its b6 (Ab) sinks to the 5th (G), a bittersweet sigh. Heard in 'Creep', 'In My Life', 'Don't Look Back in Anger' and many film scores.\n\nJazz spellings of the same move:\n- **iv6** (Fm6 = F Ab C D)\n- **ivm7 → bVII7 → I** (the backdoor)\n- **bVI → I**\n\nAll of them carry the b6 (and often the 2nd degree), which is what defines the minor plagal sound.\n\n**Double plagal**: bVII → IV → I (Hey Jude's coda). Each step is IV → I of the next chord.",
    visual: { type: "progression", key: "C", chart: "| I:maj | IV:maj | iv:min | I:maj |" },
    see: ["ana-modal-interchange", "ana-backdoor", "ana-mixolydian-bvii"] },
  {
    id: "ana-half-cadence", title: "Half cadence and Phrygian half cadence", tags: ["harmony", "cadence"],
    body: "A **half cadence** ends a phrase on **V**. It sounds like a question, and it usually pairs with a following phrase that ends on I. Any route into V counts (I–V, ii–V, IV–V).\n\nThe **Phrygian half cadence** is the minor-key special case **iv6 → V** (Fm/Ab → G in C minor). The bass falls a half step (b6 → 5) while an upper voice rises to the 5th. That half step in the bass is the same b2 → 1 motion as the Phrygian mode, which is why the cadence sounds archaic and Spanish.\n\nIt connects to the **lament bass** (1 – b7 – b6 – 5) and the **Andalusian cadence** (i – bVII – bVI – V). In flamenco, the 'half cadence' chord (E in A minor) is treated as the tonic.",
    visual: { type: "progression", key: "Cm", chart: "| i:min | i:min/b7 | iv:min/b3 | V:maj |" },
    see: ["ana-andalusian", "ana-authentic-cadence"] },
  {
    id: "ana-deceptive-cadence", title: "Deceptive cadence", tags: ["harmony", "cadence"],
    body: "V sets up I, and something else arrives. The classic target is **vi**. The leading tone still rises to the tonic note (C is in Am), so the voice leading is satisfied, but the bass goes 5 → 6 instead of 5 → 1.\n\nOther deceptive targets:\n- **bVI** (borrowed): darker, cinematic\n- **IV6**\n- a **secondary dominant** (V → V/ii)\n- in jazz, a ii–V that resolves to the 'wrong' ii (Stella by Starlight does this constantly)\n\nUse: extending a phrase so that the real cadence lands harder when it finally comes. In loops (I–V–vi–IV), V → vi is a built-in deceptive move that keeps the cycle turning.",
    visual: { type: "progression", key: "C", chart: "| ii:min | V:7 | vi:min | % |" },
    see: ["ana-authentic-cadence", "ana-axis"] },
  {
    id: "ana-backdoor", title: "Backdoor ii–V (iv7 – bVII7 – I)", tags: ["harmony", "jazz", "modal-interchange", "cadence"],
    body: "A ii–V *of the key a whole step below the tonic's minor 3rd*: in C, **Fm7 – Bb7 → Cmaj7**. On paper Fm7–Bb7 is ii–V of Eb, but it resolves to C.\n\nWhy it works:\n- Bb7 holds **Ab** (b6 of C, sinking to G) and **D** (the 9th of C, which can hold or fall to C). Together with Fm7 it spells the **minor plagal** sound.\n- Bb is the **b7** of C, so the root motion bVII → I is the rock/Mixolydian 'cadence'.\n\nScales: over Bb7, **Bb Lydian dominant** (= F melodic minor) has E natural, the 3rd of C, so the line glides home.\n\nStandards: 'There Will Never Be Another You', 'Lady Bird', 'Stella by Starlight', 'All the Things You Are' (variant).",
    visual: { type: "progression", key: "C", chart: "| I:maj7 | iv:m7 | bVII:7 | I:maj7 |" },
    see: ["ana-plagal-cadence", "ana-modal-interchange", "ana-lydian-dominant", "ana-tritone-sub"] },
  {
    id: "ana-ii-v-i", title: "ii–V–I (major and minor)", tags: ["harmony", "jazz", "progression"],
    body: "The DNA of jazz harmony: **predominant → dominant → tonic**, roots falling in fifths.\n\n- **Major**: iim7 – V7 – Imaj7 (Dm7 – G7 – Cmaj7)\n- **Minor**: iim7♭5 – V7(♭9) – im (Dm7♭5 – G7♭9 – Cm). The b5 of the ii becomes the b9 of the V.\n\nIn tunes, ii–Vs are mostly *temporary*. They tonicize a new key for a bar or two (Autumn Leaves alternates major and minor ones), chain together (Blues for Alice), or resolve deceptively (Stella).\n\nGuide tones: the 7th of each chord falls a half step to the 3rd of the next. Dm7's C falls to B (3rd of G7), and G7's F falls to E (3rd of Cmaj7). Practise playing only those notes through a tune.",
    visual: { type: "progression", key: "C", chart: "| ii:m7 | V:7 | I:maj7 | % |", voicing: "drop2", stringSet: [4, 3, 2, 1], voiceLead: true },
    see: ["ana-secondary-dominant", "ana-tritone-sub", "ana-dominant-colors", "ana-backdoor"] },
  {
    id: "ana-secondary-dominant", title: "Secondary dominants and tonicization", tags: ["harmony", "chromatic"],
    body: "**V/x** = the dominant of a chord other than I. In C:\n- V/ii = A7 (→ Dm)\n- V/iii = B7 (→ Em)\n- V/IV = C7 (→ F)\n- V/V = D7 (→ G)\n- V/vi = E7 (→ Am)\n\nEach adds a note outside the key: C# (A7), D# (B7), Bb (C7, whose leading tone E is already diatonic), F# (D7), G# (E7). The target briefly sounds like a tonic, which is called **tonicization**.\n\nSecondary dominants needn't resolve as expected. E7 → F in 'Don't Look Back in Anger' and 'Space Oddity', and B → C in 'Creep', are deceptive resolutions of V/vi. Chains of them (A7 – D7 – G7 – C) are **extended dominants**, as in the Rhythm Changes bridge.\n\nScale tip: over a secondary dominant aimed at a *minor* chord, use the target's harmonic minor (e.g. A Phrygian dominant over A7 → Dm).",
    visual: { type: "progression", key: "C", chart: "| I:maj | V/vi:7 | vi:min | V/ii:7 | ii:min | V/V:7 | V:7 | I:maj |" },
    see: ["ana-ii-v-i", "ana-modulation", "ana-dominant-colors"] },
  {
    id: "ana-tritone-sub", title: "Tritone substitution", tags: ["harmony", "jazz", "reharmonization"],
    body: "Swap a dominant 7th for the dominant 7th a tritone away: **G7 ↔ Db7**. They share their 3rd and 7th (B/F ↔ F/Cb), so the tension and the resolution are the same. The sub's root, though, falls by **half step** into the target, giving chromatic bass lines (Dm7 – Db7 – Cmaj7).\n\nWhy it sounds 'altered': Db7's notes over a G bass are G's b5, b9 and 3. So Db7 ≈ G7alt, and **Db Lydian dominant = G altered** (the same seven notes).\n\nApply it to any dominant:\n- secondary dominants: A7 → Eb7 (in C)\n- whole ii–Vs: Dm7 G7 → Abm7 Db7\n- the Tadd Dameron turnaround, where tritone subs are turned into maj7 chords",
    visual: { type: "progression", key: "C", chart: "| ii:m7 | bII:7 | I:maj7 | % |", voicing: "shell" },
    see: ["ana-dominant-colors", "ana-lydian-dominant", "ana-tadd-turnaround", "ana-ii-v-i"] },
  {
    id: "ana-modal-interchange", title: "Modal interchange (borrowed chords)", tags: ["harmony", "chromatic", "modes"],
    body: "Borrowing chords from a **parallel** mode, one with the same tonic. Most loans in a major key come from the parallel minor:\n- **iv** (Fm in C): minor plagal sadness\n- **bVI** (Ab): epic, cinematic\n- **bVII** (Bb): rock, Mixolydian, triumphant\n- **bIII** (Eb): bold, bluesy\n- **ii°** (Dm7♭5) and **v** (Gm): darker predominants and dominants\n\nOther parallel modes lend too: **II** major from Lydian (D in C), and IV major in a minor key from Dorian.\n\nThe effect: one or two flat notes (Ab, Bb, Eb) colour the bright key without changing the tonic. Hear it in the bVI–bVII–I 'victory' cadence, Beatles ballads, and Lady Bird's ii–V into Ab.",
    visual: { type: "progression", key: "C", chart: "| I:maj | iv:min | bVI:maj bVII:maj | I:maj |" },
    see: ["ana-plagal-cadence", "ana-mixolydian-bvii", "ana-chromatic-mediant", "ana-mode-brightness"] },
  {
    id: "ana-chromatic-mediant", title: "Chromatic mediants", tags: ["harmony", "chromatic", "film"],
    body: "Two chords of the **same quality** (both major or both minor) whose roots are a **third** apart, where the pair does *not* come from one key. From C major: **E, A, Ab, Eb** (and more remotely Ebm, Abm...).\n\nThey usually share **one** common tone, and the other voices move by half or whole step. The change sounds magical, heroic or eerie rather than functional, because no dominant is involved. This is the core of film-score harmony and of key changes by a third (Beethoven, Schubert, Coltrane changes, Talk Talk's 'It's My Life').\n\nDiatonic mediants (C → Em, C → Am) share *two* tones and sound mild. Making the mediant chromatic (E or A major) is what adds the shimmer.",
    visual: { type: "progression", key: "C", chart: "| I:maj | III:maj | bVI:maj | I:maj |" },
    see: ["ana-modulation", "ana-coltrane-changes", "ana-modal-interchange"] },
  {
    id: "ana-line-cliche", title: "Line clichés", tags: ["harmony", "voice-leading"],
    body: "Hold a chord and move **one voice** chromatically through it:\n- **Minor, descending**: 1 – 7 – b7 – 6 → Am, Am(maj7), Am7, Am6 ('My Funny Valentine', many spy themes)\n- **Bass version**: Am, Am/G#, Am/G, D/F# ('While My Guitar Gently Weeps', 'Something')\n- **Major, ascending**: 5 – #5 – 6 – b7 → C, C+, C6, C7 → F (showtunes, Bond-ish intros)\n- **Major, descending**: 1 – 7 – b7 → C, Cmaj7, C7 → F ('Something')\n\nOn guitar, keep the grip and move one finger along a single string. It is a great way to make a static chord breathe in comping.",
    visual: { type: "progression", key: "Am", chart: "| i:min | i:mMaj7 | i:m7 | i:m6 |" },
    see: ["ana-bass-line", "ana-pedal-point"] },
  {
    id: "ana-pedal-point", title: "Pedal point", tags: ["harmony", "texture"],
    body: "A note, usually in the bass, **held while chords change above it**, including chords that clash with it.\n\n- **Tonic pedal**: calm, anchored, final. It is how pieces end (Bach's C major Prelude, bars 32–35), and the basis of drones and ambient music.\n- **Dominant pedal**: suspense. Everything over it becomes a long upbeat to I (Bach bars 24–31, EDM build-ups, the cadential 6/4).\n- **Inner/upper pedals**: a held note on top, like the drone strings in 'Wonderwall'.\n\nSlash chords such as F/C, G/C and D/C are the notation for pedal harmony. On guitar, open strings make natural pedals.",
    visual: { type: "progression", key: "C", chart: "| I:maj | IV:maj/5 | V:maj/4 | I:maj |" },
    see: ["ana-bass-line", "ana-sus-dominant"] },
  {
    id: "ana-bass-line", title: "Bass lines, inversions and slash chords", tags: ["harmony", "voice-leading", "slash-chords"],
    body: "A slash chord **X/Y** means chord X with Y in the bass. It may be:\n- an **inversion** (C/E = 3rd in bass, C/G = 5th)\n- a **non-chord bass** (D/C, F/G): a pedal or a hybrid chord\n\nSongwriters and Bach alike choose inversions to make the **bass line** move by step:\n- descending: C – C/B – Am – Am/G – F ('Let It Be' fills, 'Yesterday', the lament bass)\n- chromatic: A – G# – G – F# (line clichés)\n- ascending: G – G# – A ('Don't Look Back in Anger')\n\nA stepwise bass makes even ordinary chords sound inevitable. When analysing a song, sing the bass line first.",
    visual: { type: "progression", key: "C", chart: "| I:maj | V:maj/3 | vi:min | I:maj/5 | IV:maj | I:maj/3 | ii:m7 | V:7 |" },
    see: ["ana-line-cliche", "ana-pedal-point"] },
  {
    id: "ana-mixolydian-bvii", title: "bVII and the Mixolydian sound", tags: ["harmony", "modes", "rock"],
    body: "The **bVII** major chord (Bb in C) comes from **Mixolydian** (or borrowed from minor). It is the defining rock chord:\n- **I – bVII – IV – I** (Sweet Home Alabama, Sweet Child O' Mine): a 'double plagal' loop\n- **bVI – bVII – I**: the triumphant rise\n- **I – bVII**: the Celtic/folk vamp\n- **Minor v** (Gm in C): also Mixolydian, as in 'Clocks'\n\nbVII has no leading tone, so it reaches I by whole step. That sounds broad and open, not urgent. Add a 7th (Bb7) and it becomes the jazz **backdoor dominant**.\n\nScale: Mixolydian (major scale with b7), or major pentatonic with occasional b7.",
    visual: { type: "progression", key: "D", chart: "| I:maj bVII:maj | IV:maj | I:maj | % |" },
    see: ["ana-modal-interchange", "ana-backdoor", "ana-plagal-cadence", "ana-mode-brightness"] },
  {
    id: "ana-dorian-iv", title: "Dorian: the major IV in a minor key", tags: ["harmony", "modes", "funk"],
    body: "In natural minor, iv is minor (Dm in A minor). Raise the 6th degree (F → F#) and you get **Dorian**, where IV is **major** (D) or a **dominant 7th** (D7, D9).\n\nThe i – IV vamp (Am – D, Bbm7 – Eb7) is the sound of funk, soul, Santana and modal jazz: minor but warm and hopeful. Tell-tale chords in minor keys:\n- IV or IV7\n- ii minor (Bm in A minor)\n- a minor-6 tonic (Am6)\n\nIn songs, Dorian and Aeolian often alternate ('While My Guitar Gently Weeps': D in one phrase, C in the next). Over the tonic, the 6th is the note that decides which you're in.",
    visual: { type: "scale", root: "A", scale: "dorian", region: { caged: "E" } },
    see: ["ana-mode-brightness", "ana-modal-interchange"] },
  {
    id: "ana-axis", title: "The Axis progression family (I–V–vi–IV and rotations)", tags: ["harmony", "pop", "progression"],
    body: "Four diatonic chords, I, V, vi and IV, in a loop. Rotating where the loop starts changes its mood:\n- **I – V – vi – IV**: anthemic ('Let It Be', 'With or Without You')\n- **vi – IV – I – V**: minor-tinged, the 'sensitive female chord progression'\n- **IV – V – I – vi**: momentum ('Viva la Vida')\n- **I – vi – IV – V**: the 1950s / doo-wop version ('Stand By Me')\n- **I – vi – V – IV**: 'Purple Rain'\n\nIts ancestor is the Pachelbel/Romanesca ground (I – V – vi – iii – IV – I – IV – V). These loops work because every move is either a deceptive step (V → vi) or a plagal one (IV → I). Nothing ever 'ends', so the loop can repeat forever.",
    visual: { type: "progression", key: "C", chart: "| I:maj | V:maj | vi:min | IV:maj |" },
    see: ["ana-deceptive-cadence", "ana-plagal-cadence", "ana-key-ambiguity"] },
  {
    id: "ana-andalusian", title: "Andalusian cadence and Phrygian dominant", tags: ["harmony", "flamenco", "modes"],
    body: "**i – bVII – bVI – V** (Am – G – F – E): the descending minor tetrachord harmonised. Its bass A – G – F – E is the 'lament bass'.\n\nFlamenco hears it in **E Phrygian dominant** (= A harmonic minor from E): E is home, and the progression is iv – bIII – bII – I. The **F → E** half step (bII → I) is the cadence.\n\nThe chord on E is major (G#), so the G natural of the G chord and the G# of the E chord rub against each other, the Spanish 'cross-relation'.\n\nRelatives: 'Hotel California' (a longer descending chain ending on V), the Phrygian half cadence, 'Hit the Road Jack'. Over the V chord, play Phrygian dominant (1 b2 3 4 5 b6 b7).",
    visual: { type: "progression", key: "Am", chart: "| i:min | bVII:maj | bVI:maj | V:maj |" },
    see: ["ana-half-cadence", "ana-dominant-colors", "ana-bass-line"] },
  {
    id: "ana-modulation", title: "Modulation, tonicization and pivots", tags: ["harmony", "keys"],
    body: "**Tonicization**: a chord briefly sounds like a tonic, through its own V or ii–V, before the music returns home.\n\n**Modulation**: the key really changes. Common methods:\n- **Pivot chord**: one chord belongs to both keys (Ebmaj7 = IV of Bb and bVI of Gm in 'Autumn Leaves'; G = bVII of A and V of C in 'Something').\n- **Pivot via V**: approach the new key through its dominant (E major into A minor in 'It's My Life').\n- **Direct / phrase modulation**: just jump (So What's half step; Body and Soul's bridge).\n- **Chromatic-mediant moves**: keys a third apart, linked by a common tone (Coltrane changes, 'Something' C → A).\n- **Relative major/minor**: minor-key tunes visit the relative major (Autumn Leaves, Blue Bossa's trip to bII).\n\nTip: when a ii–V appears, ask 'ii–V of what?' The answer is the key area of the moment.",
    visual: { type: "progression", key: "Gm", chart: "| iv:m7 | bVII:7 | bIII:maj7 | bVI:maj7 | ii:m7b5 | V:7b9 | i:m6 | % |" },
    see: ["ana-secondary-dominant", "ana-chromatic-mediant", "ana-ii-v-i"] },
  {
    id: "ana-key-ambiguity", title: "Key ambiguity: which chord is home?", tags: ["harmony", "analysis", "modes"],
    body: "Many loops never cadence, so their tonic is decided by **emphasis** (which chord starts the loop, lasts longest, is sung over) rather than by V–I. Examples:\n- 'Sweet Home Alabama': D Mixolydian or G major?\n- 'Get Lucky': B Dorian, A major or D major?\n- 'Clocks': Eb Mixolydian or Ab major?\n- 'Smells Like Teen Spirit': F minor or Ab major? Power chords hide the 3rds.\n\nThe notes are the same either way, so the 'right' answer is the one your ear and the melody choose. For soloing, the parent scale works whichever way you hear it; the analysis just changes which note feels like home.\n\nModal pieces avoid the dominant's leading tone, and that avoidance is why the ambiguity survives.",
    see: ["ana-mode-brightness", "ana-mixolydian-bvii", "ana-axis"] },
  {
    id: "ana-dominant-colors", title: "Colours on the dominant: Mixolydian, altered, half-whole, Phrygian dominant", tags: ["harmony", "scales", "jazz", "improvisation"],
    body: "The V chord is where you choose your tension. Over **G7** resolving to C or Cm:\n\n| Scale | Tensions | Sound |\n|---|---|---|\n| Mixolydian | 9, 13 | inside, swing, major target |\n| Lydian dominant | 9, #11, 13 | bright, floating; good when V doesn't resolve |\n| Phrygian dominant (Mixo b9 b13) | b9, b13 | minor-key, Spanish; the 'harmonic minor V' |\n| Half-whole diminished | b9, #9, #11, 13 | symmetric, crunchy but bright |\n| Altered (melodic minor ½ step up) | b9, #9, b5, b13 | maximum tension, smooth to major or minor |\n| Whole tone | 9, #11, #5 | dreamy, for 7#5 |\n\nRules of thumb:\n- Resolving to **minor**, use tensions that are notes of the target key (b9, b13): Phrygian dominant or altered.\n- Resolving to **major**, anything goes, and natural 9/13 sound sweetest.\n- **Not resolving** (II7 in 'Ipanema', IV7 in a blues), use Lydian dominant.",
    visual: { type: "scale", root: "G", scale: "altered", region: { caged: "E" } },
    see: ["ana-tritone-sub", "ana-lydian-dominant", "ana-ii-v-i", "ana-authentic-cadence"] },
  {
    id: "ana-lydian-dominant", title: "Lydian dominant (7#11)", tags: ["scales", "harmony", "jazz"],
    body: "**1 2 3 #4 5 6 b7**: Mixolydian with a raised 4th, the 4th mode of melodic minor (G Lydian dominant = D melodic minor).\n\nUse it on dominants that **don't resolve down a fifth**:\n- **II7** (D7 in C: 'Take the A Train', 'Girl from Ipanema')\n- **bVII7** (the backdoor dominant)\n- **IV7** in a blues\n- **tritone subs** (Db7 → C). Db Lydian dominant has G, the root of the chord being replaced.\n\nThe natural 4th of Mixolydian is an 'avoid note' that clashes with the 3rd and wants to resolve. The #11 removes that pull, so the chord floats.",
    visual: { type: "scale", root: "D", scale: "lydian-dominant", region: { caged: "E" } },
    see: ["ana-dominant-colors", "ana-tritone-sub", "ana-backdoor"] },
  {
    id: "ana-neapolitan", title: "The Neapolitan chord (bII)", tags: ["harmony", "classical", "chromatic"],
    body: "A **major chord on the lowered 2nd degree**: in C# minor, **D major**. Classical composers usually use it in **first inversion** (N6, D/F#), so the bass is the same as iv's, and it goes to **V** (often via a cadential 6/4).\n\nThe b2 (D) falls through the leading tone and tonic (D → C# / B#), a weight that has a strongly tragic effect ('Moonlight' Sonata, bar 3).\n\nModern descendants:\n- **bIImaj7** as a tritone-sub-like approach chord in jazz (Lady Bird turnaround)\n- the Phrygian **bII** of flamenco and metal\n- whole key areas a half step up (Blue Bossa's Dbmaj7 in C minor)",
    visual: { type: "progression", key: "Am", chart: "| i:min | bII:maj/3 | V:7 | i:min |" },
    see: ["ana-andalusian", "ana-tritone-sub", "ana-modulation"] },
  {
    id: "ana-coltrane-changes", title: "Coltrane changes (major-third cycles)", tags: ["harmony", "jazz", "advanced"],
    body: "Divide the octave into **three major thirds**: C – Ab – E (an augmented triad). Visit each key through its own dominant:\n\n**Cmaj7 – Eb7 – Abmaj7 – B7 – Emaj7 – G7 – Cmaj7**\n\n- 'Giant Steps' cycles B – G – Eb.\n- 'Countdown' (on 'Tune Up') and '26-2' (on 'Confirmation') drop the cycle into the ii–V–Is of existing tunes. Dm7 – G7 – C becomes Dm7 Eb7 | Abmaj7 B7 | Emaj7 G7 | Cmaj7.\n\nPractice: arpeggiate 1-2-3-5 of each chord in one position, then move the same cells through positions. The roots of the dominants (Eb, B, G) form another augmented triad, a fact that helps you memorise the cycle.",
    visual: { type: "progression", key: "C", chart: "| ii:m7 bIII:7 | bVI:maj7 VII:7 | III:maj7 V:7 | I:maj7 |" },
    see: ["ana-chromatic-mediant", "ana-ii-v-i", "ana-modulation"] },
  {
    id: "ana-tadd-turnaround", title: "Tadd Dameron turnaround", tags: ["harmony", "jazz", "turnaround"],
    body: "**Imaj7 – bIIImaj7 – bVImaj7 – bIImaj7 → I** (C – Eb – Ab – Db). It comes from the standard turnaround C – A7 – D7 – G7. Replace each dominant with its **tritone sub** (Eb7, Ab7, Db7), then turn them all into **maj7** chords.\n\nThe roots fall in fifths from Eb and the last chord slides by half step into the tonic. Dbmaj7 even contains C, so the resolution is a soft glow rather than a pull.\n\nNamed after Tadd Dameron ('Lady Bird', 1939). Charts also write the dominant version, C – Eb7 – Ab7 – Db7.",
    visual: { type: "progression", key: "C", chart: "| I:maj7 bIII:maj7 | bVI:maj7 bII:maj7 | I:maj7 | % |" },
    see: ["ana-tritone-sub", "ana-modal-interchange"] },
  {
    id: "ana-blues-harmony", title: "Blues harmony: dominant 7ths as home", tags: ["harmony", "blues"],
    body: "In the blues, **I7, IV7 and V7 are all dominant 7ths**, and the I7 is a stable tonic rather than a V/IV. The b7 and the b3 (in the melody) are **blue notes**, and the minor 3rd sung over a major-3rd chord is the essential blues friction.\n\nThe 12-bar form: | I | I(IV) | I | I | IV | IV | I | I | V | IV | I | V |.\n\nTwo departures from classical rules:\n- **V → IV** in bars 9–10 (a 'retrogression')\n- the cadence **IV → I** (plagal)\n\nJazz adds ii–Vs, passing diminished chords and the Bird-blues chains. Minor blues uses i, iv and often bVI – V ('The Thrill Is Gone').\n\nSoloing: mix minor pentatonic (gritty) and major pentatonic (sweet), and follow chord tones on IV and V.",
    visual: { type: "progression", key: "A", chart: "| I:7 | IV:7 | I:7 | % | IV:7 | % | I:7 | % | V:7 | IV:7 | I:7 | V:7 |" },
    see: ["ana-plagal-cadence", "ana-ii-v-i", "ana-dominant-colors"] },
  {
    id: "ana-diminished-passing", title: "Passing diminished 7th chords", tags: ["harmony", "voice-leading", "jazz"],
    body: "A **dim7** chord (stacked minor 3rds) is a dominant 7♭9 without its root: B°7 = G7♭9 minus G. Because it is symmetrical, any of its four notes can be the 'root'. Two common uses:\n\n1. **Chromatic passing chord**: bridge two diatonic chords a whole step apart with a dim7 on the half step between:\n   - I – #I°7 – ii\n   - ii – #ii°7 – iii (or iii – biii°7 – ii going down)\n   - IV – #IV°7 – I/5\n2. **Secondary vii°7**: leading-tone chord of a target, as in Bach's C#°7 → Dm.\n\nOn guitar, the dim7 grip repeats every 3 frets, so you can slide it until it lands next to the chord you need.",
    visual: { type: "progression", key: "C", chart: "| I:maj7 | #i:dim7 | ii:m7 | V:7 |" },
    see: ["ana-secondary-dominant", "ana-bass-line"] },
  {
    id: "ana-mu-chord", title: "Mu major chord and upper structures (Steely Dan)", tags: ["voicings", "harmony", "rock", "jazz"],
    body: "The **mu major** is an add2 chord voiced with the **2nd and 3rd a whole step apart** (e.g. G A B D). It is often placed over its own 3rd in the bass (Gadd2/B), which gives a bright cluster with a little 'smear'. Steely Dan's songbook named it; it appears in 'Peg', 'Deacon Blues', 'Aja' and many more.\n\nIt belongs to a bigger idea, **upper structures**: a simple triad placed over a different bass or chord, creating extensions automatically.\n- D/C = Cmaj7#11-ish\n- A/B = B11 (sus dominant)\n- Ab/Bb = Bb9sus4\n- E/G (or Db/G for the altered sound) = G13b9-ish\n\nGuitarists can grab these as small triad shapes on the top strings over an open or fretted bass.",
    visual: { type: "voicings", root: "G", quality: "add9", voicing: "custom", order: ["3", "9", "5", "1"], stringSet: [5, 3, 2, 1] },
    see: ["ana-sus-dominant", "ana-bass-line", "ana-pedal-point"] },
  {
    id: "ana-quartal", title: "Quartal harmony and the So What chord", tags: ["voicings", "modal-jazz"],
    body: "Chords stacked in **4ths** instead of 3rds. They sound open and modern, and they are 'modal' because they don't spell a clear major/minor triad.\n\nThe **So What chord**: three perfect 4ths plus a major 3rd on top, e.g. **E A D G B** over D minor (Bill Evans' voicing on 'So What'). Its answer is the same shape a step lower (D G C F A).\n\nIn modal jazz (McCoy Tyner, Herbie Hancock), quartal grips move **diatonically** through the mode, which gives a shimmering texture over a static bass.\n\nGuitar: 4ths stack naturally across strings 6-5-4-3 (same fret) and need one shift on strings 3–2.",
    visual: { type: "voicings", root: "E", quality: "m11", voicing: "custom", order: ["1", "4", "b7", "b3", "5"], stringSet: [5, 4, 3, 2, 1] },
    see: ["ana-mode-brightness", "ana-dorian-iv"] },
  {
    id: "ana-mode-brightness", title: "Mode brightness (Lydian to Locrian)", tags: ["modes", "scales", "theory"],
    body: "On one root, the seven major modes form a ladder. Each step flattens exactly one note:\n\n**Lydian** (#4) → **Ionian** → **Mixolydian** (b7) → **Dorian** (b3) → **Aeolian** (b6) → **Phrygian** (b2) → **Locrian** (b5)\n\nThe signature note of each mode is the one that separates it from its brighter neighbour. To *establish* a mode, vamp a chord containing that note against the tonic:\n- Lydian: I – II\n- Mixolydian: I – bVII\n- Dorian: i – IV\n- Aeolian: i – bVI\n- Phrygian: i – bII\n\nAnd **avoid the V7** (its leading tone pulls everything back to Ionian or harmonic minor). Film composers choose modes this way: Lydian for wonder, Phrygian for menace.",
    visual: { type: "scale", root: "C", scale: "lydian", region: { caged: "E" } },
    see: ["ana-dorian-iv", "ana-mixolydian-bvii", "ana-key-ambiguity"] },
  {
    id: "ana-sus-dominant", title: "Sus dominants (V7sus4, V11, IV/V)", tags: ["harmony", "soul", "gospel", "jazz"],
    body: "Replace the 3rd of V with the 4th, and the dominant loses its leading tone. It **hovers** instead of pulling.\n- **V7sus4** (G C D F)\n- **V9sus4 / V11** (G C D F A = **F/G**, IV over V)\n- **V13sus4**\n\nWhere you'll hear them:\n- **Soul and gospel cadences**: A/B → E in 'Isn't She Lovely', B11 → B13 in 'What's Going On'.\n- **Modal jazz**: 'Maiden Voyage' is built from sus chords.\n- **Pop**: the sus4 of V resolving 4 → 3 before the tonic.\n\nOn guitar, F/G is an F triad on the top strings over a G bass. It is the easiest jazz-pop sound there is.",
    visual: { type: "progression", key: "C", chart: "| ii:m7 | V:11 | V:7 | I:maj7 |" },
    see: ["ana-authentic-cadence", "ana-mu-chord", "ana-pedal-point"] },
];
