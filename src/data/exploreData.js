export const workMetadataById = {
  "abai-words": {
    type: "Essay",
    period: "Kazakh Enlightenment",
    mood: "Contemplative",
    experience: "Guided Reflection",
    readingTime: 14,
    whyNow:
      "It helps young readers connect moral responsibility with personal growth and cultural identity.",
    spotlightIntro:
      "Abai invites the reader into a quiet but demanding conversation about learning, conscience, and becoming human.",
    conflict:
      "What happens when a society stops asking difficult moral questions?",
  },
  "murakami-identity": {
    type: "Novel",
    period: "Contemporary Literature",
    mood: "Dreamlike",
    experience: "Immersive Journey",
    readingTime: 18,
    whyNow:
      "Its uncertainty feels familiar in a digital age shaped by memory, identity, and inner fragmentation.",
    spotlightIntro:
      "Murakami opens a space where memory and selfhood drift, blur, and return in unexpected forms.",
    conflict:
      "Can identity remain stable when memory itself becomes unreliable?",
  },
  "dostoevsky-crime": {
    type: "Novel",
    period: "Russian Realism",
    mood: "Intense",
    experience: "Deep Analysis",
    readingTime: 20,
    whyNow:
      "It speaks directly to modern questions of guilt, ethics, social pressure, and inner justification.",
    spotlightIntro:
      "Dostoevsky turns the page into a moral battleground where every thought becomes a test of conscience.",
    conflict:
      "Can intelligence justify a choice that violates the human soul?",
  },
  "camus-stranger": {
    type: "Novel",
    period: "Existentialism",
    mood: "Detached",
    experience: "Philosophical Reading",
    readingTime: 12,
    whyNow:
      "Its emotional distance mirrors the disconnection many readers feel in contemporary life.",
    spotlightIntro:
      "Camus strips meaning to the bone and asks what remains when the world offers no comforting answers.",
    conflict:
      "What does freedom mean in a universe that feels indifferent?",
  },
  "woolf-dalloway": {
    type: "Novel",
    period: "Modernism",
    mood: "Reflective",
    experience: "Inner Monologue",
    readingTime: 16,
    whyNow:
      "Its attention to mental life, loneliness, and social performance feels deeply contemporary.",
    spotlightIntro:
      "Woolf transforms a single day into a vast emotional landscape shaped by memory, loss, and perception.",
    conflict:
      "How much of the self remains hidden beneath everyday social roles?",
  },
};

export const literaryJourneys = [
  {
    id: "who-am-i",
    title: "Who Am I?",
    description:
      "A reflective path through identity, memory, and the search for the self.",
    works: ["murakami-identity", "woolf-dalloway", "abai-words"],
    minutes: 28,
    level: "Reflective",
    focusTheme: "Identity",
  },
  {
    id: "weight-of-choice",
    title: "The Weight of Choice",
    description:
      "Follow moral conflict, difficult decisions, and the burden of consequence.",
    works: ["dostoevsky-crime", "camus-stranger", "abai-words"],
    minutes: 32,
    level: "Deep",
    focusTheme: "Morality",
  },
  {
    id: "voices-of-society",
    title: "Voices of Society",
    description:
      "Read texts that ask how the individual moves through culture, norms, and public life.",
    works: ["woolf-dalloway", "abai-words", "dostoevsky-crime"],
    minutes: 24,
    level: "Contextual",
    focusTheme: "Society",
  },
  {
    id: "love-beyond-time",
    title: "Love Beyond Time",
    description:
      "Move through tenderness, distance, and memory to see how feeling survives historical change.",
    works: ["woolf-dalloway", "murakami-identity", "camus-stranger"],
    minutes: 22,
    level: "Emotional",
    focusTheme: "Love",
  },
  {
    id: "search-for-meaning",
    title: "The Search for Meaning",
    description:
      "A thematic route through absurdity, reflection, and the desire for inner clarity.",
    works: ["camus-stranger", "murakami-identity", "abai-words"],
    minutes: 26,
    level: "Philosophical",
    focusTheme: "Freedom",
  },
];

export const themeCollections = [
  {
    name: "Identity",
    description:
      "Texts that ask how the self is shaped through memory, society, and inner experience.",
    works: ["murakami-identity", "woolf-dalloway", "dostoevsky-crime"],
  },
  {
    name: "Morality",
    description:
      "Works focused on conscience, accountability, and the difficult texture of ethical choices.",
    works: ["dostoevsky-crime", "camus-stranger", "abai-words"],
  },
  {
    name: "Knowledge",
    description:
      "A reading route through learning, intellectual growth, and the search for understanding.",
    works: ["abai-words", "murakami-identity", "woolf-dalloway"],
  },
  {
    name: "Society",
    description:
      "Literature that places the individual within social expectations, structures, and change.",
    works: ["woolf-dalloway", "dostoevsky-crime", "murakami-identity"],
  },
  {
    name: "Memory",
    description:
      "Stories where recollection, fragmentation, and emotional echoes shape interpretation.",
    works: ["murakami-identity", "woolf-dalloway", "camus-stranger"],
  },
  {
    name: "Freedom",
    description:
      "Texts that test autonomy, existential choice, and the cost of personal agency.",
    works: ["camus-stranger", "dostoevsky-crime", "abai-words"],
  },
  {
    name: "Love",
    description:
      "A reading path through tenderness, emotional distance, and the forms intimacy can take.",
    works: ["woolf-dalloway", "murakami-identity", "camus-stranger"],
  },
  {
    name: "Fate",
    description:
      "Works that question whether human lives are chosen, inherited, or carried by unseen forces.",
    works: ["murakami-identity", "camus-stranger", "dostoevsky-crime"],
  },
];

export const gamificationData = {
  progress: {
    exploredWorks: 4,
    reflectionsSaved: 7,
    activeJourney: "Who Am I?",
    weeklyGoal: "3 sessions",
  },
  badges: [
    "First Discovery",
    "Theme Explorer",
    "Reflection Writer",
    "Story Seeker",
    "Heritage Keeper",
  ],
  weeklyChallenges: [
    {
      title: "Read Across Eras",
      detail: "Complete one work from a different literary period.",
    },
    {
      title: "Write One Reflection",
      detail: "Respond to a question and save your interpretation.",
    },
  ],
  levels: [
    "Beginner Explorer",
    "Curious Reader",
    "Thoughtful Interpreter",
    "Literary Researcher",
    "Heritage Guardian",
  ],
};

export const communityPreview = {
  discussions: [
    "Is loneliness always visible in Woolf's prose?",
    "Can Camus be read as a writer of freedom rather than indifference?",
    "What makes Abai feel contemporary for young readers today?",
  ],
  reflections: [
    "A recent reader connected Murakami's memory theme to digital identity.",
    "One discussion compared Dostoevsky's guilt with modern online accountability.",
  ],
  counters: {
    comments: 128,
    likes: 312,
    activeReaders: 48,
  },
};

export const multimediaContext = [
  {
    type: "Video",
    title: "Literary period mini-guides",
    description:
      "Short explainers that place each work in its cultural and historical moment.",
  },
  {
    type: "Audio",
    title: "Guided reflection prompts",
    description:
      "Listen to curated prompts that help readers pause, interpret, and respond.",
  },
  {
    type: "Timeline",
    title: "Authors across centuries",
    description:
      "Trace connections between writers, movements, and recurring themes.",
  },
  {
    type: "Quotes",
    title: "Context cards",
    description:
      "Save, compare, and revisit resonant passages that speak to modern life.",
  },
];
