import abaiCover from "../assets/authors/abai.png";
import auezovCover from "../assets/authors/dostoevsky.png";
import seifullinCover from "../assets/authors/camus.png";
import zhumabayevCover from "../assets/authors/murakami.png";
import zhansugurovCover from "../assets/authors/woolf.png";

export const works = [
  {
    id: "abai-words",
    title: "Book of Words",
    author: "Abai Kunanbayev",
    image: abaiCover,
    year: 1890,
    themes: ["Identity", "Morality", "Knowledge", "Society"],
    description:
      "Philosophical prose about conscience, knowledge, character, and the renewal of Kazakh society.",
    fragments: [
      {
        id: "abai-f1",
        text: "A human being is born with curiosity and the desire to understand the world.",
        authorNote:
          "Abai treats curiosity as the beginning of moral education and cultural responsibility.",
        annotations: [
          { word: "curiosity", explanation: "The inner impulse that opens a person to knowledge and self-discipline." },
          { word: "understand", explanation: "To connect learning with conscience, action, and community." },
        ],
        reflection: {
          question: "Why does Abai connect knowledge with moral growth?",
          options: ["Because learning changes character", "Because knowledge is only status", "Because society does not matter"],
          resonanceQuote: {
            text: "If a person does not strive for knowledge, the soul becomes empty.",
            author: "Abai Kunanbayev",
          },
        },
      },
    ],
  },
  {
    id: "auezov-abai-path",
    title: "The Path of Abai",
    author: "Mukhtar Auezov",
    image: auezovCover,
    year: 1942,
    themes: ["Identity", "Society", "Memory", "Knowledge"],
    description:
      "Epic novel cycle about Abai, the steppe, cultural change, and the formation of a national intellectual voice.",
    fragments: [
      {
        id: "auezov-f1",
        text: "The road of Abai is a road toward people, language, justice, and difficult truth.",
        authorNote:
          "Auezov turns biography into a cultural epic where personal growth becomes national memory.",
        annotations: [
          { word: "justice", explanation: "A moral principle that guides Abai's conflict with ignorance and abuse of power." },
        ],
        reflection: {
          question: "What makes a personal path become part of national memory?",
          options: ["Its connection to people", "Only fame", "Only political power"],
          resonanceQuote: { text: "The steppe remembers those who served its word.", author: "Mukhtar Auezov" },
        },
      },
    ],
  },
  {
    id: "auezov-enlik-kebek",
    title: "Enlik-Kebek",
    author: "Mukhtar Auezov",
    image: auezovCover,
    year: 1917,
    themes: ["Love", "Fate", "Society", "Morality"],
    description:
      "Drama of love, clan conflict, and tragic choice in the world of traditional Kazakh society.",
    fragments: [
      {
        id: "enlik-f1",
        text: "Love stands before custom, and the steppe must answer for its judgment.",
        authorNote: "The drama studies the conflict between human feeling and social law.",
        annotations: [{ word: "custom", explanation: "Inherited social rules that shape decisions and conflict." }],
        reflection: {
          question: "Can tradition protect people and hurt them at the same time?",
          options: ["Yes", "Sometimes", "No"],
          resonanceQuote: { text: "A human heart cannot be judged only by custom.", author: "Mukhtar Auezov" },
        },
      },
    ],
  },
  {
    id: "seifullin-thorny-path",
    title: "Thorny Path",
    author: "Saken Seifullin",
    image: seifullinCover,
    year: 1927,
    themes: ["Freedom", "Society", "Memory", "Fate"],
    description:
      "Memoir-prose about upheaval, political struggle, and the price of historical transformation.",
    fragments: [
      {
        id: "seifullin-f1",
        text: "History does not move gently; it asks a person to choose a road through thorns.",
        authorNote: "Seifullin writes about a generation caught between hope, danger, and public duty.",
        annotations: [{ word: "thorns", explanation: "A symbol of painful obstacles in political and personal life." }],
        reflection: {
          question: "What makes historical change painful for individuals?",
          options: ["Risk and responsibility", "Only distance", "Only technology"],
          resonanceQuote: { text: "A hard road can still lead toward awakening.", author: "Saken Seifullin" },
        },
      },
    ],
  },
  {
    id: "zhumabayev-batyr-bayan",
    title: "Batyr Bayan",
    author: "Magzhan Zhumabayev",
    image: zhumabayevCover,
    year: 1923,
    themes: ["Memory", "Freedom", "Fate", "Morality"],
    description:
      "Poetic historical work about heroism, sacrifice, love, and the emotional weight of national memory.",
    fragments: [
      {
        id: "bayan-f1",
        text: "The hero carries not only a weapon, but the sorrow and honor of a people.",
        authorNote: "Magzhan connects lyric intensity with historical imagination and national feeling.",
        annotations: [{ word: "honor", explanation: "A value tied to dignity, duty, and collective memory." }],
        reflection: {
          question: "Why does heroic poetry often include sorrow?",
          options: ["Because sacrifice has a cost", "Because heroes never choose", "Because history is simple"],
          resonanceQuote: { text: "Memory burns brightest where love and loss meet.", author: "Magzhan Zhumabayev" },
        },
      },
    ],
  },
  {
    id: "zhansugurov-kulager",
    title: "Kulager",
    author: "Ilyas Zhansugurov",
    image: zhansugurovCover,
    year: 1936,
    themes: ["Memory", "Society", "Fate", "Love"],
    description:
      "Poem about art, envy, tragedy, and the symbolic death of beauty in the Kazakh steppe.",
    fragments: [
      {
        id: "kulager-f1",
        text: "Kulager runs like a song across the steppe, carrying beauty toward danger.",
        authorNote: "Zhansugurov uses the horse as a symbol of talent, freedom, and vulnerability.",
        annotations: [{ word: "song", explanation: "A metaphor for living art and cultural memory." }],
        reflection: {
          question: "What does Kulager symbolize beyond the horse itself?",
          options: ["Beauty and talent", "Only speed", "Only wealth"],
          resonanceQuote: { text: "Where beauty is envied, tragedy follows close behind.", author: "Ilyas Zhansugurov" },
        },
      },
    ],
  },
  {
    id: "baitursynuly-masa",
    title: "Masa",
    author: "Akhmet Baitursynuly",
    image: auezovCover,
    year: 1911,
    themes: ["Knowledge", "Freedom", "Society", "Morality"],
    description:
      "Poetry and civic thought that awakens language, education, and responsibility.",
    fragments: [
      {
        id: "masa-f1",
        text: "The word should awaken the sleeping mind and call it toward service.",
        authorNote: "Baitursynuly uses literature as a tool of education and national consciousness.",
        annotations: [{ word: "awaken", explanation: "To bring a person or society into awareness and action." }],
        reflection: {
          question: "Why can language become a form of freedom?",
          options: ["It gives people voice", "It hides memory", "It removes responsibility"],
          resonanceQuote: { text: "A living language keeps a people awake.", author: "Akhmet Baitursynuly" },
        },
      },
    ],
  },
  {
    id: "shakarim-three-truths",
    title: "Three Truths",
    author: "Shakarim Kudaiberdiuly",
    image: abaiCover,
    year: 1912,
    themes: ["Morality", "Knowledge", "Freedom", "Identity"],
    description:
      "Spiritual and philosophical reflections on conscience, faith, and the ethical life.",
    fragments: [
      {
        id: "shakarim-f1",
        text: "A clean conscience is the road by which knowledge becomes human.",
        authorNote: "Shakarim places conscience at the center of philosophy and everyday conduct.",
        annotations: [{ word: "conscience", explanation: "An inner moral sense that judges action and intention." }],
        reflection: {
          question: "What happens when knowledge loses conscience?",
          options: ["It becomes dangerous", "It becomes poetry", "It becomes tradition"],
          resonanceQuote: { text: "Truth must pass through the heart.", author: "Shakarim Kudaiberdiuly" },
        },
      },
    ],
  },
  {
    id: "makatayev-selected-poetry",
    title: "Selected Poetry",
    author: "Mukagali Makatayev",
    image: zhumabayevCover,
    year: 1970,
    themes: ["Love", "Memory", "Identity", "Society"],
    description:
      "Modern lyric poetry about homeland, sincerity, human tenderness, and the living voice of memory.",
    fragments: [
      {
        id: "makatayev-f1",
        text: "The homeland speaks quietly, but the heart hears it like a mountain echo.",
        authorNote: "Makatayev's lyric voice makes national feeling intimate and personal.",
        annotations: [{ word: "echo", explanation: "A returning sound that suggests memory and emotional continuity." }],
        reflection: {
          question: "Why can a simple image carry deep patriotic feeling?",
          options: ["It connects place and emotion", "It avoids meaning", "It removes memory"],
          resonanceQuote: { text: "Poetry is a heartbeat made visible.", author: "Mukagali Makatayev" },
        },
      },
    ],
  },
];
