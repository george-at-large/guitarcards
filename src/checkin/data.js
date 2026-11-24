// Check-in content: feeling words placed on the pleasantness × energy grid, the body and urge chips, the
// "inclined to" scales, the thinking traps a thought record checks for, and the activity menu for
// behavioural activation. Coordinates run -1..1: x unpleasant → pleasant, y low → high energy.

export const FEELINGS = [
  // high energy, unpleasant
  ['furious', -0.9, 0.85], ['panicked', -0.78, 0.95], ['overwhelmed', -0.7, 0.78], ['angry', -0.82, 0.66],
  ['anxious', -0.58, 0.72], ['stressed', -0.62, 0.55], ['on edge', -0.42, 0.66], ['frustrated', -0.68, 0.45],
  ['irritated', -0.48, 0.38], ['restless', -0.25, 0.55], ['worried', -0.5, 0.25], ['jealous', -0.62, 0.25],
  ['embarrassed', -0.38, 0.28], ['annoyed', -0.32, 0.18], ['scared', -0.8, 0.5],
  // high energy, pleasant
  ['elated', 0.88, 0.9], ['excited', 0.68, 0.8], ['energised', 0.45, 0.88], ['inspired', 0.78, 0.66],
  ['enthusiastic', 0.6, 0.62], ['joyful', 0.9, 0.55], ['playful', 0.55, 0.48], ['motivated', 0.4, 0.55],
  ['alert', 0.12, 0.66], ['curious', 0.28, 0.42], ['proud', 0.66, 0.36], ['focused', 0.2, 0.26],
  ['hopeful', 0.48, 0.2], ['amused', 0.72, 0.3], ['confident', 0.55, 0.12],
  // low energy, unpleasant
  ['hopeless', -0.88, -0.72], ['despairing', -0.92, -0.5], ['sad', -0.7, -0.38], ['lonely', -0.62, -0.52],
  ['discouraged', -0.55, -0.44], ['down', -0.48, -0.28], ['disappointed', -0.6, -0.14], ['guilty', -0.55, -0.05],
  ['ashamed', -0.75, -0.18], ['exhausted', -0.48, -0.9], ['drained', -0.42, -0.72], ['numb', -0.3, -0.78],
  ['apathetic', -0.22, -0.62], ['bored', -0.3, -0.46], ['tired', -0.15, -0.82], ['flat', -0.2, -0.32],
  // low energy, pleasant
  ['peaceful', 0.72, -0.66], ['relaxed', 0.62, -0.52], ['calm', 0.48, -0.48], ['content', 0.6, -0.28],
  ['grateful', 0.7, -0.08], ['satisfied', 0.52, -0.16], ['at ease', 0.4, -0.38], ['cosy', 0.5, -0.76],
  ['tender', 0.62, -0.38], ['secure', 0.38, -0.2], ['mellow', 0.28, -0.6], ['sleepy', 0.12, -0.9],
  ['loved', 0.82, -0.25], ['reflective', 0.15, -0.35],
  // middle
  ['okay', 0.08, 0.02], ['neutral', 0, -0.08], ['meh', -0.1, -0.16], ['uncertain', -0.15, 0.1],
];
// the faint words printed on the grid itself: a few per quadrant so it reads at a glance
export const GRID_LABELS = ['anxious', 'stressed', 'excited', 'joyful', 'focused',
  'hopeless', 'sad', 'lonely', 'bored', 'peaceful', 'calm', 'content', 'grateful', 'sleepy', 'okay'];

export const nearestFeelings = (x, y, n = 12) => FEELINGS
  .map(([w, fx, fy]) => [w, (fx - x) ** 2 + (fy - y) ** 2])
  .sort((a, b) => a[1] - b[1]).slice(0, n).map((f) => f[0]);

export const BODY = ['tense', 'relaxed', 'heavy', 'light', 'tight chest', 'knotted stomach', 'restless', 'still',
  'tired', 'wired', 'hungry', 'in pain', 'warm', 'cold', 'shaky', 'clear-headed', 'foggy'];

// "Right now I'm inclined to…": bipolar scales, 0..100, untouched = null
export const DISPOSITIONS = [
  ['social', 'Withdraw', 'Reach out'],
  ['act', 'Rest', 'Get going'],
  ['approach', 'Avoid what’s in front of me', 'Face it'],
  ['attention', 'Stay in my head', 'Be in the room'],
];
export const URGES = ['scroll my phone', 'eat / snack', 'sleep', 'move', 'talk to someone', 'be alone', 'make something',
  'check work', 'drink', 'smoke / vape', 'shop', 'cry', 'shout', 'escape', 'nothing in particular'];
export const DOING = ['working', 'studying', 'commuting', 'eating', 'chores', 'exercising', 'socialising', 'screens',
  'resting', 'in bed', 'creative', 'outdoors', 'caring for someone'];
export const WITH = ['alone', 'partner', 'family', 'friends', 'colleagues', 'strangers', 'online'];

// Thinking traps (cognitive distortions), each with a plain gloss and the question that loosens it
export const TRAPS = [
  ['allornothing', 'All-or-nothing', 'Seeing it as total success or total failure, no middle.', 'Where is this on a scale of 0–100, rather than 0 or 100?'],
  ['catastrophising', 'Catastrophising', 'Jumping to the worst outcome and treating it as likely.', 'What’s the most likely outcome? And if the worst happened, how would I get through it?'],
  ['mindreading', 'Mind reading', 'Assuming you know what others think of you.', 'What do I actually know they think? What else could they be thinking?'],
  ['fortunetelling', 'Fortune telling', 'Predicting how it will go as if it were fact.', 'What has happened in similar situations before?'],
  ['overgeneralising', 'Overgeneralising', '“Always”, “never”, “everyone”: one event becomes a rule.', 'Is it really always? Can I think of one exception?'],
  ['filter', 'Mental filter', 'Fixing on one negative detail and missing the rest.', 'What am I leaving out of the picture?'],
  ['discounting', 'Discounting the positive', 'Good things “don’t count” or were luck.', 'If a friend did this, would I say it didn’t count?'],
  ['shoulds', 'Should statements', 'Rigid rules for yourself or others: should, must, ought.', 'What would I say if I swapped “should” for “I’d prefer”?'],
  ['labelling', 'Labelling', 'Calling yourself (or someone) a name instead of describing what happened.', 'What did I do, rather than what am I?'],
  ['personalising', 'Personalising', 'Taking responsibility for things that aren’t all yours.', 'What else contributed? What share is really mine?'],
  ['blaming', 'Blaming', 'Putting it all on someone else, which leaves you powerless.', 'What part of this can I influence?'],
  ['emotional', 'Emotional reasoning', '“I feel it, so it must be true.”', 'If I felt calm, would I still believe this?'],
  ['magnifying', 'Magnifying / minimising', 'Blowing up the bad, shrinking the good.', 'How big will this seem in a week? A year?'],
  ['comparing', 'Unfair comparison', 'Measuring yourself against the best of others.', 'Is this a fair comparison? What am I not seeing about them?'],
];
export const TRAP = Object.fromEntries(TRAPS.map((t) => [t[0], { name: t[1], gloss: t[2], ask: t[3] }]));

// questions for weighing a thought, shown beside the evidence boxes
export const EVIDENCE_QS = [
  'What facts support the thought? Facts, not feelings.',
  'What facts don’t fit it?',
  'Have there been times when it wasn’t true?',
  'If a friend had this thought, what would I tell them?',
  'Am I confusing a thought with a fact?',
  'What would I think about this in five years?',
  'Is there a kinder, still-honest way to see it?',
];

// Behavioural activation: small things, tagged by what they give (pleasure, mastery, connection, body) and how much
// energy they take (1 low … 3 high), so a low-energy moment is offered low-energy steps
export const ACTIVITIES = [
  ['Drink a glass of water', 'body', 1], ['Step outside for two minutes', 'body', 1], ['Open a window, take five slow breaths', 'body', 1],
  ['Stretch for one minute', 'body', 1], ['Make a hot drink and drink it slowly', 'pleasure', 1], ['Put on one song you love', 'pleasure', 1],
  ['Shower or wash your face', 'body', 1], ['Text one person something kind', 'connection', 1], ['Tidy one small surface', 'mastery', 1],
  ['Write down three things that went okay today', 'pleasure', 1], ['Eat something with protein', 'body', 1],
  ['Walk around the block', 'body', 2], ['Do the smallest piece of a task you’re avoiding (5 min)', 'mastery', 2],
  ['Call or voice-note a friend', 'connection', 2], ['Cook something simple', 'mastery', 2], ['Read ten pages', 'pleasure', 2],
  ['Play an instrument for ten minutes', 'pleasure', 2], ['Answer one email you’ve been putting off', 'mastery', 2],
  ['Go somewhere with people (café, park)', 'connection', 2], ['Sort one drawer or folder', 'mastery', 2],
  ['Go for a run, swim or ride', 'body', 3], ['Make a plan to see someone this week', 'connection', 2],
  ['Start a small creative thing', 'pleasure', 2], ['Exercise for twenty minutes', 'body', 3], ['Work 25 minutes on something that matters', 'mastery', 3],
];

export const PROMPT_LINES = [
  'How are you, right now?', 'Quick check-in: where are you on the grid?', 'Pause. What’s here right now?',
  'What are you inclined to do, this moment?', 'Notice: body, mood, urge. Tap to log.',
];

export const CRISIS = 'If you feel unsafe or are thinking about harming yourself, contact local emergency services or a crisis line now. findahelpline.com lists free, confidential lines in most countries.';
