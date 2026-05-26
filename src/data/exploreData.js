export const workMetadataById = {
  "abai-words": {
    type: "Philosophical prose",
    period: "Kazakh Enlightenment",
    mood: "Contemplative",
    experience: "Guided reflection",
    readingTime: 14,
    whyNow:
      "It helps readers connect moral responsibility with personal growth and cultural identity.",
    spotlightIntro:
      "Abai invites the reader into a quiet but demanding conversation about learning, conscience, and becoming human.",
    conflict:
      "What happens when a society stops asking difficult moral questions?",
  },
  "auezov-abai-path": {
    type: "Novel",
    period: "Soviet Kazakh literature",
    mood: "Epic",
    experience: "Historical journey",
    readingTime: 32,
    whyNow:
      "It shows how one author's life can become a map of national memory.",
    spotlightIntro:
      "Auezov turns the steppe, education, family, and public life into a living literary archive.",
    conflict:
      "How does a person become a moral voice for an entire culture?",
  },
  "auezov-enlik-kebek": {
    type: "Drama",
    period: "Early XX century",
    mood: "Tragic",
    experience: "Cultural context",
    readingTime: 20,
    whyNow:
      "It reveals how love, custom, and social pressure collide in Kazakh dramatic memory.",
    spotlightIntro:
      "The play turns a well-known legend into a study of fate, authority, and human dignity.",
    conflict:
      "Can private feeling survive when collective rules become absolute?",
  },
  "seifullin-thorny-path": {
    type: "Memoir novel",
    period: "Soviet Kazakh literature",
    mood: "Civic",
    experience: "Memory route",
    readingTime: 28,
    whyNow:
      "It helps students understand literature as testimony, not only imagination.",
    spotlightIntro:
      "Seifullin writes through upheaval, public duty, and the painful price of historical change.",
    conflict:
      "How does a writer carry truth through a violent century?",
  },
  "zhumabayev-batyr-bayan": {
    type: "Poem",
    period: "Alash and early XX century",
    mood: "Lyric-heroic",
    experience: "Poetry analysis",
    readingTime: 18,
    whyNow:
      "It shows how poetry preserves courage, longing, and national imagination.",
    spotlightIntro:
      "Magzhan makes history feel emotional, musical, and inwardly alive.",
    conflict:
      "What does loyalty mean when love, homeland, and tragedy meet?",
  },
  "zhansugurov-kulager": {
    type: "Poem",
    period: "Soviet Kazakh literature",
    mood: "Elegiac",
    experience: "Symbolic reading",
    readingTime: 22,
    whyNow:
      "It teaches readers to see how an animal, a song, and a loss can become cultural symbols.",
    spotlightIntro:
      "Kulager turns beauty and violence into a poetic memory of the steppe.",
    conflict:
      "Why does the loss of beauty become a wound for an entire community?",
  },
  "baitursynuly-masa": {
    type: "Poetry and essays",
    period: "Alash and early XX century",
    mood: "Awakening",
    experience: "Civic reading",
    readingTime: 16,
    whyNow:
      "It connects language, education, and public responsibility.",
    spotlightIntro:
      "Baitursynuly's voice calls the reader toward literacy, attention, and cultural action.",
    conflict:
      "How can language itself become a form of freedom?",
  },
  "shakarim-three-truths": {
    type: "Philosophical prose",
    period: "Kazakh Enlightenment",
    mood: "Spiritual",
    experience: "Ethical inquiry",
    readingTime: 18,
    whyNow:
      "It invites readers to compare knowledge, conscience, and faith as living questions.",
    spotlightIntro:
      "Shakarim searches for a moral language that joins reason and inner purity.",
    conflict:
      "What kind of truth can guide a human life?",
  },
};

export const literaryJourneys = [
  {
    id: "abai-path",
    title: "The Path of Abai",
    description:
      "A reflective route through Abai's words, Auezov's novel, education, conscience, and renewal.",
    works: ["abai-words", "auezov-abai-path"],
    minutes: 42,
    level: "Reflective",
    focusTheme: "Knowledge",
    coverImage: "abai-words",
    routeSteps: 8,
    completedSteps: 2,
    difficulty: "Reflective",
    language: "EN/RU/KZ",
    epoch: "Kazakh Enlightenment",
  },
  {
    id: "alash-voice",
    title: "Voice of Alash",
    description:
      "Read writers who made language, education, and poetry part of cultural responsibility.",
    works: ["baitursynuly-masa", "zhumabayev-batyr-bayan"],
    minutes: 35,
    level: "Contextual",
    focusTheme: "Freedom",
    coverImage: "baitursynuly-masa",
    routeSteps: 8,
    completedSteps: 1,
    difficulty: "Contextual",
    language: "EN/RU/KZ",
    epoch: "Alash and early XX century",
  },
  {
    id: "steppe-poetry",
    title: "Poetry of the Steppe",
    description:
      "Follow image, rhythm, music, and landscape through Kazakh poetic memory.",
    works: ["zhansugurov-kulager", "zhumabayev-batyr-bayan"],
    minutes: 30,
    level: "Poetic",
    focusTheme: "Memory",
    coverImage: "zhansugurov-kulager",
    routeSteps: 8,
    completedSteps: 1,
    difficulty: "Poetic",
    language: "EN/RU/KZ",
    epoch: "XX century",
  },
];

export const themeCollections = [
  {
    name: "Identity",
    description:
      "Texts that ask how a person and a culture recognize themselves through memory and language.",
    works: ["abai-words", "auezov-abai-path", "shakarim-three-truths"],
  },
  {
    name: "Morality",
    description:
      "Works focused on conscience, accountability, justice, and the difficult texture of ethical choices.",
    works: ["abai-words", "shakarim-three-truths", "auezov-enlik-kebek"],
  },
  {
    name: "Knowledge",
    description:
      "A reading route through learning, intellectual growth, literacy, and the search for understanding.",
    works: ["abai-words", "baitursynuly-masa", "auezov-abai-path"],
  },
  {
    name: "Society",
    description:
      "Literature that places the individual within custom, public duty, history, and social change.",
    works: ["auezov-enlik-kebek", "seifullin-thorny-path", "baitursynuly-masa"],
  },
  {
    name: "Memory",
    description:
      "Texts where recollection, loss, repression, and cultural continuity shape interpretation.",
    works: ["zhansugurov-kulager", "seifullin-thorny-path", "auezov-abai-path"],
  },
  {
    name: "Freedom",
    description:
      "Works that test autonomy, national thought, language, and the cost of public agency.",
    works: ["baitursynuly-masa", "zhumabayev-batyr-bayan", "seifullin-thorny-path"],
  },
];

export const gamificationData = {
  progress: {
    exploredWorks: 4,
    reflectionsSaved: 7,
    activeJourney: "The Path of Abai",
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
      detail: "Complete one work from another Kazakh literary period.",
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
    "Why does Abai still feel contemporary for young readers?",
    "How does Auezov turn biography into national memory?",
    "What makes Alash literature a language of responsibility?",
  ],
  reflections: [
    "A recent reader connected Abai's moral questions with personal discipline.",
    "One discussion compared Baitursynuly's language reform with modern education.",
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
    title: "Kazakh literary period mini-guides",
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
      "Trace connections between writers, epochs, and recurring cultural themes.",
  },
  {
    type: "Quotes",
    title: "Context cards",
    description:
      "Save, compare, and revisit resonant passages that speak to Kazakh literary memory.",
  },
];
