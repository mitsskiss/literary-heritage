import abaiCover from "../assets/works/abay.png";
import archiveAuthors from "../assets/mura/portal-authors.jpg";
import archivePoetry from "../assets/mura/collection-poetry.jpg";
import archiveProse from "../assets/mura/collection-prose.jpg";
import archiveFolklore from "../assets/mura/collection-folklore.jpg";
import archiveThoughts from "../assets/mura/collection-thoughts.jpg";
import archiveRoutes from "../assets/mura/collection-routes.jpg";

export const works = [
  {
    id: "abai-words",
    title: "The Book of Words",
    originalTitle: "Қара сөздер",
    author: "Abai Kunanbayev",
    image: abaiCover,
    year: 1890,
    genre: "Philosophical prose",
    period: "Kazakh Enlightenment",
    readingTime: 18,
    language: "Kazakh",
    themes: ["Identity", "Morality", "Knowledge", "Society"],
    description:
      "Philosophical prose about conscience, knowledge, character, and the renewal of Kazakh society.",
    context:
      "A cycle of prose reflections where Abai discusses education, morality, labor, language, faith, and social responsibility.",
    culturalValue:
      "One of the core texts of Kazakh moral philosophy and a gateway to Abai's intellectual world.",
    routeId: "abai-path",
    fragments: [
      {
        id: "abai-f1",
        text: "A human being is born with curiosity and the desire to understand the world.",
        authorNote:
          "Abai treats curiosity as the beginning of moral education and cultural responsibility.",
        annotations: [
          { word: "curiosity", explanation: "The inner impulse that opens a person to knowledge and self-discipline." },
          { word: "understand", explanation: "To connect learning with conscience, action, and community." },
          { word: "knowledge", explanation: "For Abai, knowledge must improve the soul and behavior, not only memory." },
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
    originalTitle: "Абай жолы",
    author: "Mukhtar Auezov",
    image: archiveAuthors,
    year: 1942,
    genre: "Epic novel",
    period: "Soviet Kazakh literature",
    readingTime: 35,
    language: "Kazakh",
    themes: ["Identity", "Society", "Memory", "Knowledge"],
    description:
      "Epic novel cycle about Abai, the steppe, cultural change, and the formation of a national intellectual voice.",
    context:
      "Auezov's multi-volume novel turns Abai's biography into a broad historical picture of Kazakh society.",
    culturalValue:
      "A landmark of Kazakh prose and one of the most important literary monuments to Abai's world.",
    routeId: "abai-path",
    fragments: [
      {
        id: "auezov-f1",
        text: "The road of Abai is a road toward people, language, justice, and difficult truth.",
        authorNote:
          "Auezov turns biography into a cultural epic where personal growth becomes national memory.",
        annotations: [
          { word: "justice", explanation: "A moral principle that guides Abai's conflict with ignorance and abuse of power." },
          { word: "road", explanation: "A symbol of personal growth and historical movement." },
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
    originalTitle: "Еңлік-Кебек",
    author: "Mukhtar Auezov",
    image: archiveFolklore,
    year: 1917,
    genre: "Drama",
    period: "Early Kazakh drama",
    readingTime: 22,
    language: "Kazakh",
    themes: ["Love", "Fate", "Society", "Morality"],
    description:
      "Drama of love, clan conflict, and tragic choice in the world of traditional Kazakh society.",
    context:
      "Auezov adapts a well-known tragic story into a dramatic form that questions custom, justice, and human feeling.",
    culturalValue:
      "An important early Kazakh dramatic work that connects oral legend with modern stage literature.",
    routeId: "oral-tradition",
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
    originalTitle: "Тар жол, тайғақ кешу",
    author: "Saken Seifullin",
    image: archiveProse,
    year: 1927,
    genre: "Memoir-prose",
    period: "Alash and Soviet transition",
    readingTime: 28,
    language: "Kazakh",
    themes: ["Freedom", "Society", "Memory", "Fate"],
    description:
      "Memoir-prose about upheaval, political struggle, and the price of historical transformation.",
    context:
      "The work records a generation's experience of revolution, conflict, public duty, and survival.",
    culturalValue:
      "A key text for understanding twentieth-century historical pressure in Kazakh literary memory.",
    routeId: "memory-repression",
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
    id: "seifullin-kokshetau",
    title: "Kokshetau",
    originalTitle: "Көкшетау",
    author: "Saken Seifullin",
    image: archiveRoutes,
    year: 1929,
    genre: "Poem",
    period: "Soviet Kazakh poetry",
    readingTime: 16,
    language: "Kazakh",
    themes: ["Memory", "Nature", "Identity", "Society"],
    description:
      "Poetic work where landscape, legend, and cultural memory meet around the image of Kokshetau.",
    context:
      "The poem turns a geographical place into a cultural image filled with history and feeling.",
    culturalValue:
      "Shows how Kazakh poetry can preserve landscape as memory and identity.",
    routeId: "steppe-poetry",
    fragments: [
      {
        id: "kokshetau-f1",
        text: "The mountain keeps the voice of old songs, and the lake reflects memory like a bright page.",
        authorNote: "Landscape becomes a living archive of national feeling.",
        annotations: [{ word: "landscape", explanation: "Nature shown as a carrier of cultural memory." }],
        reflection: {
          question: "Why can place become a literary memory?",
          options: ["It gathers stories and emotion", "It has no meaning", "It only marks geography"],
          resonanceQuote: { text: "A place becomes homeland when memory speaks through it.", author: "Saken Seifullin" },
        },
      },
    ],
  },
  {
    id: "zhumabayev-batyr-bayan",
    title: "Batyr Bayan",
    originalTitle: "Батыр Баян",
    author: "Magzhan Zhumabayev",
    image: archivePoetry,
    year: 1923,
    genre: "Historical poem",
    period: "Alash poetry",
    readingTime: 20,
    language: "Kazakh",
    themes: ["Memory", "Freedom", "Fate", "Morality"],
    description:
      "Poetic historical work about heroism, sacrifice, love, and the emotional weight of national memory.",
    context:
      "Zhumabayev uses history and lyric feeling to explore honor, conflict, love, and sacrifice.",
    culturalValue:
      "A central example of romantic and historical imagination in Kazakh poetry.",
    routeId: "alash-voice",
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
    id: "zhumabayev-sholpan",
    title: "Sholpan",
    originalTitle: "Шолпан",
    author: "Magzhan Zhumabayev",
    image: archivePoetry,
    year: 1912,
    genre: "Poetry collection",
    period: "Alash poetry",
    readingTime: 14,
    language: "Kazakh",
    themes: ["Love", "Freedom", "Language", "Identity"],
    description:
      "Early lyric poetry where beauty, longing, homeland, and language form an intimate poetic world.",
    context:
      "The collection reveals Zhumabayev's musical poetic language and emotional intensity.",
    culturalValue:
      "Important for seeing how modern Kazakh lyric poetry gained symbolic depth and personal voice.",
    routeId: "steppe-poetry",
    fragments: [
      {
        id: "sholpan-f1",
        text: "A bright star rises over the steppe, and the heart hears homeland as music.",
        authorNote: "The image of light becomes a symbol of longing and national feeling.",
        annotations: [{ word: "star", explanation: "A symbol of hope, distance, beauty, and guidance." }],
        reflection: {
          question: "How does lyric poetry turn feeling into cultural memory?",
          options: ["Through image and rhythm", "By avoiding emotion", "Only through plot"],
          resonanceQuote: { text: "A song can hold what history cannot say directly.", author: "Magzhan Zhumabayev" },
        },
      },
    ],
  },
  {
    id: "zhansugurov-kulager",
    title: "Kulager",
    originalTitle: "Құлагер",
    author: "Ilyas Zhansugurov",
    image: archiveRoutes,
    year: 1936,
    genre: "Poem",
    period: "Soviet Kazakh poetry",
    readingTime: 22,
    language: "Kazakh",
    themes: ["Memory", "Society", "Fate", "Love"],
    description:
      "Poem about art, envy, tragedy, and the symbolic death of beauty in the Kazakh steppe.",
    context:
      "Kulager transforms the story of a horse into a meditation on talent, violence, beauty, and cultural loss.",
    culturalValue:
      "A classic of Kazakh poetic symbolism and one of the strongest images of art wounded by envy.",
    routeId: "steppe-poetry",
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
    originalTitle: "Маса",
    author: "Akhmet Baitursynuly",
    image: archiveThoughts,
    year: 1911,
    genre: "Poetry and civic thought",
    period: "Alash enlightenment",
    readingTime: 15,
    language: "Kazakh",
    themes: ["Knowledge", "Freedom", "Society", "Morality"],
    description:
      "Poetry and civic thought that awakens language, education, and responsibility.",
    context:
      "Baitursynuly uses poetic voice as an alarm that calls society toward literacy, dignity, and action.",
    culturalValue:
      "A key text of Alash-era cultural awakening and Kazakh language consciousness.",
    routeId: "alash-voice",
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
    id: "baitursynuly-forty-fables",
    title: "Forty Fables",
    originalTitle: "Қырық мысал",
    author: "Akhmet Baitursynuly",
    image: archiveThoughts,
    year: 1909,
    genre: "Fables and adaptation",
    period: "Alash enlightenment",
    readingTime: 12,
    language: "Kazakh",
    themes: ["Morality", "Knowledge", "Society", "Language"],
    description:
      "A collection of adapted fables that uses simple stories to teach social awareness and moral judgment.",
    context:
      "Baitursynuly adapts fable form for Kazakh readers, turning short narrative into civic education.",
    culturalValue:
      "Important for literacy, moral instruction, and the modernization of Kazakh educational literature.",
    routeId: "alash-voice",
    fragments: [
      {
        id: "fables-f1",
        text: "A small story can carry a large warning when society learns how to listen.",
        authorNote: "Fable form makes moral criticism clear and memorable.",
        annotations: [{ word: "fable", explanation: "A short story that teaches a moral idea through symbol or animal characters." }],
        reflection: {
          question: "Why are fables useful for public education?",
          options: ["They make lessons memorable", "They remove all meaning", "They only entertain"],
          resonanceQuote: { text: "Wisdom can enter through a simple story.", author: "Akhmet Baitursynuly" },
        },
      },
    ],
  },
  {
    id: "shakarim-three-truths",
    title: "Three Truths",
    originalTitle: "Үш анық",
    author: "Shakarim Kudaiberdiuly",
    image: archiveThoughts,
    year: 1912,
    genre: "Philosophical prose",
    period: "Kazakh spiritual philosophy",
    readingTime: 18,
    language: "Kazakh",
    themes: ["Morality", "Knowledge", "Freedom", "Identity"],
    description:
      "Spiritual and philosophical reflections on conscience, faith, and the ethical life.",
    context:
      "Shakarim searches for a moral foundation that joins reason, conscience, faith, and responsibility.",
    culturalValue:
      "A major text of Kazakh ethical and spiritual philosophy.",
    routeId: "oral-tradition",
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
    id: "shakarim-qalqaman-mamyr",
    title: "Qalqaman-Mamyr",
    originalTitle: "Қалқаман-Мамыр",
    author: "Shakarim Kudaiberdiuly",
    image: archiveFolklore,
    year: 1888,
    genre: "Narrative poem",
    period: "Kazakh spiritual philosophy",
    readingTime: 16,
    language: "Kazakh",
    themes: ["Love", "Fate", "Morality", "Society"],
    description:
      "Narrative poem about love, social law, tragedy, and the moral pressure of tradition.",
    context:
      "The work revisits a historical-legendary plot to ask how justice, custom, and feeling collide.",
    culturalValue:
      "Connects oral narrative memory with philosophical reflection on human choice.",
    routeId: "oral-tradition",
    fragments: [
      {
        id: "qalqaman-f1",
        text: "When love and custom stand against each other, the human heart becomes a field of judgment.",
        authorNote: "Shakarim turns legend into ethical inquiry.",
        annotations: [{ word: "judgment", explanation: "A social and moral decision that affects human fate." }],
        reflection: {
          question: "What does tragedy reveal about social law?",
          options: ["Its human cost", "Only its strength", "Nothing"],
          resonanceQuote: { text: "Justice without compassion becomes heavy.", author: "Shakarim Kudaiberdiuly" },
        },
      },
    ],
  },
  {
    id: "makatayev-selected-poetry",
    title: "Selected Poetry",
    originalTitle: "Таңдамалы өлеңдер",
    author: "Mukagali Makatayev",
    image: archivePoetry,
    year: 1970,
    genre: "Lyric poetry",
    period: "Modern Kazakh poetry",
    readingTime: 14,
    language: "Kazakh",
    themes: ["Love", "Memory", "Identity", "Society"],
    description:
      "Modern lyric poetry about homeland, sincerity, human tenderness, and the living voice of memory.",
    context:
      "Makatayev's lyric voice makes national feeling intimate, direct, and emotionally accessible.",
    culturalValue:
      "A living part of modern Kazakh reading culture and personal poetic memory.",
    routeId: "steppe-poetry",
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
  {
    id: "makatayev-raiymbek",
    title: "Raiymbek! Raiymbek!",
    originalTitle: "Райымбек! Райымбек!",
    author: "Mukagali Makatayev",
    image: archiveRoutes,
    year: 1972,
    genre: "Poem",
    period: "Modern Kazakh poetry",
    readingTime: 17,
    language: "Kazakh",
    themes: ["Memory", "Identity", "Freedom", "Fate"],
    description:
      "Poetic work that invokes historical memory, homeland, courage, and the emotional voice of the people.",
    context:
      "Makatayev speaks to history through a direct lyric call, turning a heroic name into cultural memory.",
    culturalValue:
      "Shows how modern poetry can reactivate historical memory with intimate emotional force.",
    routeId: "memory-repression",
    fragments: [
      {
        id: "raiymbek-f1",
        text: "A remembered name crosses the mountain wind and returns as a call to the living.",
        authorNote: "The poem connects heroic memory with modern emotional responsibility.",
        annotations: [{ word: "call", explanation: "A poetic address that brings the past into the present." }],
        reflection: {
          question: "Why does poetry call historical figures back into memory?",
          options: ["To renew responsibility", "To erase the present", "Only to list names"],
          resonanceQuote: { text: "Memory becomes alive when the heart answers.", author: "Mukagali Makatayev" },
        },
      },
    ],
  },
  {
    id: "zhabayev-selected-aitys",
    title: "Selected Aitys and Poems",
    originalTitle: "Таңдамалы айтыстар мен өлеңдер",
    author: "Zhambyl Zhabayev",
    image: archivePoetry,
    year: 1936,
    genre: "Oral poetry",
    period: "Zhyrau and Soviet poetry",
    readingTime: 13,
    language: "Kazakh",
    themes: ["Memory", "Identity", "Language", "Society"],
    description:
      "Improvisational poems that preserve oral performance, public voice, and the rhythm of the Kazakh steppe.",
    context:
      "Zhambyl's poetry keeps the energy of live speech and turns communal memory into a literary event.",
    culturalValue:
      "A key bridge between oral poetic culture and twentieth-century Kazakh literary memory.",
    routeId: "oral-tradition",
    difficulty: "Easy",
    fragments: [
      {
        id: "zhambyl-f1",
        text: "The word of the aqyn travels with the people, carrying memory from voice to voice.",
        authorNote: "Improvisation becomes a living archive of public feeling.",
        annotations: [{ word: "aqyn", explanation: "A poet-improviser in Kazakh oral tradition." }],
        reflection: {
          question: "Why does oral poetry depend on a listening community?",
          options: ["Because meaning is shared aloud", "Because books are unnecessary", "Because memory is silent"],
          resonanceQuote: { text: "A song lives while people answer it.", author: "Zhambyl Zhabayev" },
        },
      },
    ],
  },
  {
    id: "dulatuly-wake-up-kazakh",
    title: "Wake Up, Kazakh!",
    originalTitle: "Оян, қазақ!",
    author: "Mirzhakyp Dulatuly",
    image: archiveThoughts,
    year: 1909,
    genre: "Civic poetry",
    period: "Alash literature",
    readingTime: 14,
    language: "Kazakh",
    themes: ["Freedom", "Knowledge", "Identity", "Society"],
    description:
      "A civic poetic call for awakening, education, language, and national responsibility.",
    context:
      "The work belongs to the Alash movement and treats literature as a public alarm.",
    culturalValue:
      "One of the emblematic texts of Kazakh civic awakening.",
    routeId: "alash-voice",
    difficulty: "Medium",
    fragments: [
      {
        id: "dulatuly-f1",
        text: "Awakening begins when a people hears its own name as a responsibility.",
        authorNote: "Dulatuly connects national consciousness with education and action.",
        annotations: [{ word: "awakening", explanation: "A movement from passivity toward civic awareness." }],
        reflection: {
          question: "What does literature awaken in a society?",
          options: ["Memory and responsibility", "Only nostalgia", "Only entertainment"],
          resonanceQuote: { text: "A sleeping word cannot protect a people.", author: "Mirzhakyp Dulatuly" },
        },
      },
    ],
  },
  {
    id: "mailin-shuganyn-belgisi",
    title: "Shuga's Sign",
    originalTitle: "Шұғаның белгісі",
    author: "Beimbet Mailin",
    image: archiveProse,
    year: 1915,
    genre: "Short prose",
    period: "Early Kazakh prose",
    readingTime: 12,
    language: "Kazakh",
    themes: ["Love", "Society", "Fate", "Memory"],
    description:
      "A concise prose work about love, social barriers, and the tenderness of remembered life.",
    context:
      "Mailin's early prose shows human feeling inside village life and social convention.",
    culturalValue:
      "Important for the development of Kazakh short prose and psychological realism.",
    routeId: "classics-modern-prose",
    difficulty: "Easy",
    fragments: [
      {
        id: "mailin-f1",
        text: "A small remembered place can hold the whole weight of love and loss.",
        authorNote: "Mailin turns private memory into a social portrait.",
        annotations: [{ word: "remembered", explanation: "Memory gives emotional shape to the story." }],
        reflection: {
          question: "Why can a short story feel larger than its plot?",
          options: ["Because detail carries emotion", "Because length decides value", "Because characters vanish"],
          resonanceQuote: { text: "A human fate may fit inside one quiet sign.", author: "Beimbet Mailin" },
        },
      },
    ],
  },
  {
    id: "musrepov-ulpan",
    title: "Ulpan",
    originalTitle: "Ұлпан",
    author: "Gabit Musrepov",
    image: archiveProse,
    year: 1974,
    genre: "Novel",
    period: "Soviet Kazakh prose",
    readingTime: 32,
    language: "Kazakh",
    themes: ["Society", "Morality", "Identity", "Memory"],
    description:
      "A novel about dignity, leadership, womanhood, and social conscience in the Kazakh steppe.",
    context:
      "Musrepov uses refined prose to explore character, authority, and moral intelligence.",
    culturalValue:
      "A classic prose image of a strong woman and a changing society.",
    routeId: "women-kazakh-literature",
    difficulty: "Medium",
    fragments: [
      {
        id: "musrepov-f1",
        text: "Dignity becomes visible when a person carries responsibility without losing tenderness.",
        authorNote: "The novel frames strength as ethical presence, not domination.",
        annotations: [{ word: "dignity", explanation: "Inner worth expressed through action and restraint." }],
        reflection: {
          question: "How can leadership be shown through care?",
          options: ["By protecting human dignity", "By refusing empathy", "By avoiding choice"],
          resonanceQuote: { text: "A noble word is strongest when it protects another.", author: "Gabit Musrepov" },
        },
      },
    ],
  },
  {
    id: "suleimenov-az-i-ya",
    title: "Az i Ya",
    originalTitle: "Аз и Я",
    author: "Olzhas Suleimenov",
    image: archiveRoutes,
    year: 1975,
    genre: "Literary-cultural essay",
    period: "Modern Kazakh literature",
    readingTime: 24,
    language: "Russian",
    themes: ["Language", "Identity", "Knowledge", "Memory"],
    description:
      "A bold cultural essay about language, history, interpretation, and Eurasian literary memory.",
    context:
      "Suleimenov reads language as an archive where cultures meet, argue, and remember.",
    culturalValue:
      "An influential modern work linking Kazakh literary thought with broad cultural history.",
    routeId: "classics-modern-prose",
    difficulty: "Hard",
    fragments: [
      {
        id: "suleimenov-f1",
        text: "Language remembers paths that official history often forgets.",
        authorNote: "Suleimenov treats words as evidence of cultural contact and memory.",
        annotations: [{ word: "language", explanation: "A living archive of historical relations." }],
        reflection: {
          question: "Why can language become historical evidence?",
          options: ["It preserves traces of contact", "It has no memory", "It only decorates speech"],
          resonanceQuote: { text: "A word can carry a road across centuries.", author: "Olzhas Suleimenov" },
        },
      },
    ],
  },
  {
    id: "ongarsynova-selected-poetry",
    title: "Selected Poems",
    originalTitle: "Таңдамалы өлеңдер",
    author: "Fariza Ongarsynova",
    image: archivePoetry,
    year: 1984,
    genre: "Lyric poetry",
    period: "Modern Kazakh poetry",
    readingTime: 15,
    language: "Kazakh",
    themes: ["Love", "Identity", "Freedom", "Memory"],
    description:
      "Strong lyric poetry about womanhood, dignity, homeland, tenderness, and emotional courage.",
    context:
      "Ongarsynova's voice brings personal intensity and civic feeling into modern Kazakh poetry.",
    culturalValue:
      "A defining modern poetic voice and an important path into women's perspectives in Kazakh literature.",
    routeId: "women-kazakh-literature",
    difficulty: "Medium",
    fragments: [
      {
        id: "fariza-f1",
        text: "A courageous heart speaks softly, but it changes the room where it is heard.",
        authorNote: "The poem's strength comes from emotional clarity and moral pressure.",
        annotations: [{ word: "courageous", explanation: "The ability to speak truth with dignity." }],
        reflection: {
          question: "How does lyric poetry show courage?",
          options: ["Through honest feeling", "By hiding the self", "By avoiding memory"],
          resonanceQuote: { text: "Tenderness can be a form of strength.", author: "Fariza Ongarsynova" },
        },
      },
    ],
  },
];

const finalWorkContent = {
  "abai-words": {
    relatedAuthor: "Abai Kunanbayev",
    shortTitle: { en: "Book of Words", ru: "Книга слов", kk: "Қара сөздер" },
    fullDescription: {
      en: "Abai's Book of Words is a cycle of philosophical prose that turns everyday moral questions into a disciplined practice of reading. It studies knowledge, conscience, labor, faith, speech, vanity, and responsibility, asking how a person becomes worthy of learning. In the MURA reader it is connected to scenes, annotations, difficult words, quotes, and the Path of Abai route.",
      ru: "«Книга слов» Абая — цикл философской прозы, превращающий повседневные нравственные вопросы в внимательное чтение. Текст исследует знание, совесть, труд, веру, слово, тщеславие и ответственность, спрашивая, как человек становится достойным знания. В reader MURA произведение связано со сценами, аннотациями, сложными словами, цитатами и маршрутом «Путь Абая».",
      kk: "Абайдың «Қара сөздері» — күнделікті адамгершілік сұрақтарын терең оқуға айналдыратын философиялық проза циклі. Мәтін білім, ар, еңбек, иман, сөз, мақтан және жауапкершілікті талдап, адамның білімге қалай лайық болатынын сұрайды. MURA reader ішінде ол сахналармен, түсіндірмелермен, күрделі сөздермен, дәйексөздермен және «Абай жолы» маршрутымен байланысқан.",
    },
    tags: ["abai", "philosophy", "reader", "ethics"],
    locales: {
      en: { title: "The Book of Words", shortTitle: "Book of Words", genre: "Philosophical prose" },
      ru: { title: "Книга слов", shortTitle: "Книга слов", genre: "Философская проза" },
      kk: { title: "Қара сөздер", shortTitle: "Қара сөздер", genre: "Философиялық проза" },
    },
  },
  "auezov-abai-path": {
    relatedAuthor: "Mukhtar Auezov",
    shortTitle: { en: "Path of Abai", ru: "Путь Абая", kk: "Абай жолы" },
    fullDescription: {
      en: "Auezov's epic novel reconstructs Abai's life as a broad cultural memory of the Kazakh steppe. It follows family, education, conflict, speech, justice, and the formation of a moral voice. In the archive it works as both a literary monument and the main companion route for reading Abai.",
      ru: "Роман-эпопея Ауэзова воссоздает жизнь Абая как широкую культурную память казахской степи. В нем соединяются семья, образование, конфликт, слово, справедливость и становление нравственного голоса. В архиве это и литературный памятник, и главный маршрут-связка для чтения Абая.",
      kk: "Әуезовтің роман-эпопеясы Абай өмірін қазақ даласының кең мәдени жады ретінде қайта құрады. Онда отбасы, білім, тартыс, сөз, әділет және рухани дауыстың қалыптасуы тоғысады. Архивте бұл шығарма Абайды оқуға арналған басты байланыстырушы маршрут қызметін атқарады.",
    },
    tags: ["auezov", "abai", "novel-epic", "memory"],
    locales: {
      en: { title: "The Path of Abai", shortTitle: "Path of Abai", genre: "Epic novel" },
      ru: { title: "Путь Абая", shortTitle: "Путь Абая", genre: "Роман-эпопея" },
      kk: { title: "Абай жолы", shortTitle: "Абай жолы", genre: "Роман-эпопея" },
    },
  },
  "auezov-enlik-kebek": {
    relatedAuthor: "Mukhtar Auezov",
    shortTitle: { en: "Enlik-Kebek", ru: "Енлик-Кебек", kk: "Еңлік-Кебек" },
    fullDescription: {
      en: "A dramatic work where love, custom, clan authority, and justice collide. Auezov turns an inherited oral plot into modern stage literature and asks whether social law can hear the human heart.",
      ru: "Драма, где сталкиваются любовь, обычай, родовая власть и справедливость. Ауэзов превращает устный сюжет в современную сценическую литературу и спрашивает, способен ли общественный закон услышать человеческое сердце.",
      kk: "Махаббат, салт, ру билігі және әділет қақтығысатын драма. Әуезов ауызша сюжетті заманауи сахналық әдебиетке айналдырып, қоғамдық заң адам жүрегін ести ала ма деген сұрақ қояды.",
    },
    tags: ["drama", "oral-tradition", "love", "custom"],
  },
  "seifullin-thorny-path": {
    relatedAuthor: "Saken Seifullin",
    shortTitle: { en: "Thorny Path", ru: "Тернистый путь", kk: "Тар жол" },
    fullDescription: {
      en: "Memoir-prose that records historical rupture as lived experience. It connects revolution, public duty, danger, memory, and the responsibility of testimony.",
      ru: "Мемуарная проза, где исторический перелом показан как личный опыт. Произведение соединяет революцию, общественный долг, опасность, память и ответственность свидетельства.",
      kk: "Тарихи сілкіністі жеке тәжірибе ретінде көрсететін мемуарлық проза. Шығарма революцияны, қоғамдық борышты, қауіпті, жадты және куәлік жауапкершілігін байланыстырады.",
    },
    tags: ["memory", "repression", "testimony", "history"],
  },
  "seifullin-kokshetau": {
    relatedAuthor: "Saken Seifullin",
    shortTitle: { en: "Kokshetau", ru: "Кокшетау", kk: "Көкшетау" },
    fullDescription: {
      en: "A poem where mountain, lake, legend, and public feeling turn landscape into cultural memory.",
      ru: "Поэма, где гора, озеро, легенда и народное чувство превращают пейзаж в культурную память.",
      kk: "Тау, көл, аңыз және халық сезімі пейзажды мәдени жадқа айналдыратын поэма.",
    },
    tags: ["landscape", "poetry", "memory", "kokshetau"],
  },
  "zhumabayev-batyr-bayan": {
    relatedAuthor: "Magzhan Zhumabayev",
    shortTitle: { en: "Batyr Bayan", ru: "Батыр Баян", kk: "Батыр Баян" },
    fullDescription: {
      en: "A historical poem where heroism is read through love, sacrifice, sorrow, and national imagination.",
      ru: "Историческая поэма, где героизм раскрывается через любовь, жертву, скорбь и национальное воображение.",
      kk: "Ерлік махаббат, құрбандық, қайғы және ұлттық қиял арқылы ашылатын тарихи поэма.",
    },
    tags: ["alash", "heroic-poem", "memory", "sacrifice"],
  },
  "zhumabayev-sholpan": {
    relatedAuthor: "Magzhan Zhumabayev",
    shortTitle: { en: "Sholpan", ru: "Шолпан", kk: "Шолпан" },
    fullDescription: {
      en: "An early lyric collection where beauty, longing, homeland, and language form a musical poetic world.",
      ru: "Ранний лирический сборник, где красота, тоска, родина и язык складываются в музыкальный поэтический мир.",
      kk: "Сұлулық, сағыныш, туған жер және тіл музыкалық поэтикалық әлемге айналған ерте лирикалық жинақ.",
    },
    tags: ["lyric", "language", "beauty", "homeland"],
  },
  "zhansugurov-kulager": {
    relatedAuthor: "Ilyas Zhansugurov",
    shortTitle: { en: "Kulager", ru: "Кулагер", kk: "Құлагер" },
    fullDescription: {
      en: "A major poem about art, envy, tragedy, and the wounded image of beauty in the steppe.",
      ru: "Крупная поэма об искусстве, зависти, трагедии и раненом образе красоты в степи.",
      kk: "Өнер, қызғаныш, трагедия және даладағы жараланған сұлулық бейнесі туралы ірі поэма.",
    },
    tags: ["poem", "art", "horse", "tragedy"],
  },
  "baitursynuly-masa": {
    relatedAuthor: "Akhmet Baitursynuly",
    shortTitle: { en: "Masa", ru: "Маса", kk: "Маса" },
    fullDescription: {
      en: "A civic poetic collection that treats literature as an alarm for language, education, dignity, and public responsibility.",
      ru: "Гражданский поэтический сборник, где литература становится сигналом к языку, образованию, достоинству и общественной ответственности.",
      kk: "Әдебиетті тілге, білімге, қадірге және қоғамдық жауапкершілікке шақыратын дабыл ретінде көрсететін азаматтық жинақ.",
    },
    tags: ["alash", "language", "education", "awakening"],
  },
  "baitursynuly-forty-fables": {
    relatedAuthor: "Akhmet Baitursynuly",
    shortTitle: { en: "Forty Fables", ru: "Сорок басен", kk: "Қырық мысал" },
    fullDescription: {
      en: "Adapted fables that use simple narrative form for moral education, literacy, and civic attention.",
      ru: "Адаптированные басни, использующие простую повествовательную форму для нравственного воспитания, грамотности и общественной внимательности.",
      kk: "Қарапайым мысал формасы арқылы адамгершілік, сауат және қоғамдық зейін тәрбиелейтін бейімделген шығармалар.",
    },
    tags: ["fables", "education", "morality", "language"],
  },
  "shakarim-three-truths": {
    relatedAuthor: "Shakarim Kudaiberdiuly",
    shortTitle: { en: "Three Truths", ru: "Три истины", kk: "Үш анық" },
    fullDescription: {
      en: "Philosophical prose about conscience, faith, reason, and the search for a moral foundation of life.",
      ru: "Философская проза о совести, вере, разуме и поиске нравственного основания жизни.",
      kk: "Ар, иман, ақыл және өмірдің моральдық негізін іздеу туралы философиялық проза.",
    },
    tags: ["philosophy", "conscience", "faith", "truth"],
  },
  "shakarim-qalqaman-mamyr": {
    relatedAuthor: "Shakarim Kudaiberdiuly",
    shortTitle: { en: "Qalqaman-Mamyr", ru: "Калкаман-Мамыр", kk: "Қалқаман-Мамыр" },
    fullDescription: {
      en: "A narrative poem where love and custom reveal the human cost of social judgment.",
      ru: "Поэма, где любовь и обычай раскрывают человеческую цену общественного суда.",
      kk: "Махаббат пен салт қоғамдық үкімнің адамдық құнын ашатын поэма.",
    },
    tags: ["narrative-poem", "custom", "love", "ethics"],
  },
  "makatayev-selected-poetry": {
    relatedAuthor: "Mukagali Makatayev",
    shortTitle: { en: "Selected Poetry", ru: "Избранная поэзия", kk: "Таңдамалы өлеңдер" },
    fullDescription: {
      en: "Modern lyric poetry where homeland, memory, sincerity, love, and tenderness speak in a direct human voice.",
      ru: "Современная лирика, где родина, память, искренность, любовь и нежность звучат прямым человеческим голосом.",
      kk: "Туған жер, жады, шынайылық, махаббат және мейірім адамға жақын дауыспен сөйлейтін қазіргі лирика.",
    },
    tags: ["modern-poetry", "homeland", "love", "memory"],
  },
  "makatayev-raiymbek": {
    relatedAuthor: "Mukagali Makatayev",
    shortTitle: { en: "Raiymbek!", ru: "Райымбек!", kk: "Райымбек!" },
    fullDescription: {
      en: "A poem that calls historical memory back into the present through heroic address and emotional responsibility.",
      ru: "Поэма, возвращающая историческую память в настоящее через героическое обращение и эмоциональную ответственность.",
      kk: "Тарихи жадты батырлық үндеу және эмоциялық жауапкершілік арқылы бүгінге қайтаратын поэма.",
    },
    tags: ["history", "heroic-memory", "mountain", "identity"],
  },
  "zhabayev-selected-aitys": {
    relatedAuthor: "Zhambyl Zhabayev",
    shortTitle: { en: "Aitys and Poems", ru: "Айтысы и стихи", kk: "Айтыстар мен өлеңдер" },
    fullDescription: {
      en: "Improvisational poetry that preserves oral performance, public speech, and the communal memory of the steppe.",
      ru: "Импровизационная поэзия, сохраняющая устное исполнение, публичное слово и общинную память степи.",
      kk: "Ауызша орындауды, көпшілік сөзді және даланың ортақ жадын сақтайтын импровизациялық поэзия.",
    },
    tags: ["aitys", "oral-tradition", "aqyn", "public-voice"],
  },
  "dulatuly-wake-up-kazakh": {
    relatedAuthor: "Mirzhakyp Dulatuly",
    shortTitle: { en: "Wake Up, Kazakh!", ru: "Проснись, казах!", kk: "Оян, қазақ!" },
    fullDescription: {
      en: "A civic poetic call that joins education, language, awakening, and national responsibility.",
      ru: "Гражданский поэтический призыв, соединяющий образование, язык, пробуждение и национальную ответственность.",
      kk: "Білім, тіл, ояну және ұлттық жауапкершілікті біріктіретін азаматтық поэтикалық үндеу.",
    },
    tags: ["alash", "awakening", "education", "identity"],
  },
  "mailin-shuganyn-belgisi": {
    relatedAuthor: "Beimbet Mailin",
    shortTitle: { en: "Shuga's Sign", ru: "Памятник Шуге", kk: "Шұғаның белгісі" },
    fullDescription: {
      en: "Short prose where remembered love, village life, and social barriers create a concise emotional archive.",
      ru: "Короткая проза, где память о любви, аульная жизнь и социальные преграды создают сжатый эмоциональный архив.",
      kk: "Махаббат жады, ауыл өмірі және әлеуметтік кедергі қысқа эмоциялық архивке айналатын проза.",
    },
    tags: ["short-prose", "village", "love", "realism"],
  },
  "musrepov-ulpan": {
    relatedAuthor: "Gabit Musrepov",
    shortTitle: { en: "Ulpan", ru: "Улпан", kk: "Ұлпан" },
    fullDescription: {
      en: "A novel about dignity, leadership, womanhood, social conscience, and moral intelligence in the steppe.",
      ru: "Роман о достоинстве, лидерстве, женском образе, общественной совести и нравственном уме в степи.",
      kk: "Даладағы қадір, көшбасшылық, әйел болмысы, қоғамдық ар және моральдық зерде туралы роман.",
    },
    tags: ["novel", "womanhood", "dignity", "society"],
  },
  "suleimenov-az-i-ya": {
    relatedAuthor: "Olzhas Suleimenov",
    shortTitle: { en: "Az i Ya", ru: "Аз и Я", kk: "Аз и Я" },
    fullDescription: {
      en: "A literary-cultural essay that reads language as an archive of history, contact, and Eurasian memory.",
      ru: "Литературно-культурное эссе, читающее язык как архив истории, контактов и евразийской памяти.",
      kk: "Тілді тарих, байланыс және еуразиялық жад архиві ретінде оқитын әдеби-мәдени эссе.",
    },
    tags: ["essay", "language", "history", "eurasian-memory"],
  },
  "ongarsynova-selected-poetry": {
    relatedAuthor: "Fariza Ongarsynova",
    shortTitle: { en: "Selected Poems", ru: "Избранные стихи", kk: "Таңдамалы өлеңдер" },
    fullDescription: {
      en: "Modern lyric poetry about dignity, womanhood, homeland, tenderness, responsibility, and emotional courage.",
      ru: "Современная лирика о достоинстве, женском опыте, родине, нежности, ответственности и эмоциональной смелости.",
      kk: "Ар-намыс, әйел тәжірибесі, туған жер, мейірім, жауапкершілік және рухани батылдық туралы қазіргі лирика.",
    },
    tags: ["modern-poetry", "womanhood", "dignity", "homeland"],
  },
};

const localizedWorkAuthors = {
  "Abai Kunanbayev": { en: "Abai Kunanbayev", ru: "Абай Кунанбаев", kk: "Абай Құнанбайұлы" },
  "Mukhtar Auezov": { en: "Mukhtar Auezov", ru: "Мухтар Ауэзов", kk: "Мұхтар Әуезов" },
  "Saken Seifullin": { en: "Saken Seifullin", ru: "Сакен Сейфуллин", kk: "Сәкен Сейфуллин" },
  "Magzhan Zhumabayev": { en: "Magzhan Zhumabayev", ru: "Магжан Жумабаев", kk: "Мағжан Жұмабаев" },
  "Ilyas Zhansugurov": { en: "Ilyas Zhansugurov", ru: "Ильяс Жансугуров", kk: "Ілияс Жансүгіров" },
  "Akhmet Baitursynuly": { en: "Akhmet Baitursynuly", ru: "Ахмет Байтурсынулы", kk: "Ахмет Байтұрсынұлы" },
  "Shakarim Kudaiberdiuly": { en: "Shakarim Kudaiberdiuly", ru: "Шакарим Кудайбердиев", kk: "Шәкәрім Құдайбердіұлы" },
  "Mukagali Makatayev": { en: "Mukagali Makatayev", ru: "Мукагали Макатаев", kk: "Мұқағали Мақатаев" },
  "Zhambyl Zhabayev": { en: "Zhambyl Zhabayev", ru: "Жамбыл Жабаев", kk: "Жамбыл Жабаев" },
  "Mirzhakyp Dulatuly": { en: "Mirzhakyp Dulatuly", ru: "Миржакып Дулатов", kk: "Міржақып Дулатұлы" },
  "Beimbet Mailin": { en: "Beimbet Mailin", ru: "Бейимбет Майлин", kk: "Бейімбет Майлин" },
  "Gabit Musrepov": { en: "Gabit Musrepov", ru: "Габит Мусрепов", kk: "Ғабит Мүсірепов" },
  "Olzhas Suleimenov": { en: "Olzhas Suleimenov", ru: "Олжас Сулейменов", kk: "Олжас Сүлейменов" },
  "Fariza Ongarsynova": { en: "Fariza Ongarsynova", ru: "Фариза Онгарсынова", kk: "Фариза Оңғарсынова" },
};

const localizedWorkFragments = {
  "abai-words": {
    ru: [
      {
        text: "Человек рождается с любознательностью и стремлением понять мир.",
        authorNote:
          "Абай связывает любознательность с нравственным воспитанием и ответственностью перед культурой.",
        annotations: [
          { word: "любознательность", explanation: "Внутренний импульс, открывающий человека знанию и самодисциплине." },
          { word: "понимание", explanation: "Связь обучения с совестью, действием и обществом." },
          { word: "знание", explanation: "У Абая знание должно улучшать душу и поведение, а не только память." },
        ],
        reflection: {
          resonanceQuote: {
            text: "Если человек не стремится к знанию, душа пустеет.",
            author: "Абай Кунанбаев",
          },
        },
      },
    ],
    kk: [
      {
        text: "Адам баласы дүниені тануға деген құмарлықпен туады.",
        authorNote:
          "Абай құмарлықты адамдық тәрбие мен мәдени жауапкершіліктің бастауы ретінде көрсетеді.",
        annotations: [
          { word: "құмарлық", explanation: "Адамды білімге және өзін тәрбиелеуге ашатын ішкі талпыныс." },
          { word: "тану", explanation: "Оқуды армен, әрекетпен және қауыммен байланыстыру." },
          { word: "білім", explanation: "Абай үшін білім жан мен мінезді түзетуі керек." },
        ],
        reflection: {
          resonanceQuote: {
            text: "Адам білімге ұмтылмаса, жаны бос қалады.",
            author: "Абай Құнанбайұлы",
          },
        },
      },
    ],
  },
  "auezov-abai-path": {
    ru: [
      {
        text: "Путь Абая ведет к народу, языку, справедливости и трудной правде.",
        authorNote:
          "Ауэзов превращает биографию в культурную эпопею, где личный рост становится национальной памятью.",
        annotations: [
          { word: "справедливость", explanation: "Нравственный принцип, направляющий конфликт Абая с невежеством и произволом." },
          { word: "путь", explanation: "Символ личного роста и исторического движения." },
        ],
        reflection: {
          resonanceQuote: {
            text: "Степь помнит тех, кто служил ее слову.",
            author: "Мухтар Ауэзов",
          },
        },
      },
    ],
    kk: [
      {
        text: "Абай жолы халыққа, тілге, әділетке және ауыр шындыққа бастайды.",
        authorNote:
          "Әуезов өмірбаянды мәдени эпопеяға айналдырып, жеке өсуді ұлттық жадпен байланыстырады.",
        annotations: [
          { word: "әділет", explanation: "Абайдың надандық пен зорлыққа қарсы күресін бағыттайтын адамгершілік ұстаным." },
          { word: "жол", explanation: "Жеке өсу мен тарихи қозғалыстың белгісі." },
        ],
        reflection: {
          resonanceQuote: {
            text: "Дала өз сөзіне қызмет еткендерді ұмытпайды.",
            author: "Мұхтар Әуезов",
          },
        },
      },
    ],
  },
  "baitursynuly-masa": {
    ru: [
      {
        text: "Язык, знание и гражданская ответственность пробуждают народ.",
        authorNote:
          "Байтұрсынұлы показывает литературу как голос, который будит общественное сознание.",
        annotations: [
          { word: "язык", explanation: "Основа грамотности, культуры и общественной связи." },
          { word: "ответственность", explanation: "Готовность служить народу знанием и словом." },
        ],
        reflection: {
          resonanceQuote: {
            text: "Живой язык держит народ в бодрствовании.",
            author: "Ахмет Байтурсынулы",
          },
        },
      },
    ],
    kk: [
      {
        text: "Тіл, білім және азаматтық жауапкершілік халықты оятады.",
        authorNote:
          "Байтұрсынұлы әдебиетті қоғамдық сананы оятатын үн ретінде көрсетеді.",
        annotations: [
          { word: "тіл", explanation: "Сауат, мәдениет және қоғамдық байланыстың негізі." },
          { word: "жауапкершілік", explanation: "Білім мен сөз арқылы халыққа қызмет етуге дайындық." },
        ],
        reflection: {
          resonanceQuote: {
            text: "Тірі тіл халықты ояу ұстайды.",
            author: "Ахмет Байтұрсынұлы",
          },
        },
      },
    ],
  },
};

for (const work of works) {
  const content = finalWorkContent[work.id];
  if (!content) continue;
  const localizedAuthor = localizedWorkAuthors[work.author] ?? {
    en: work.author,
    ru: work.author,
    kk: work.author,
  };

  work.shortTitle = content.shortTitle.en;
  work.fullDescription = content.fullDescription.en;
  work.tags = content.tags;
  work.relatedAuthor = content.relatedAuthor;
  work.routeLink = work.routeId ? `/route/${work.routeId}` : `/reading/${work.id}`;
  work.availableLanguages = ["kk", "ru", "en"];
  work.imageCredit = work.imageCredit ?? "MURA local archive visual";
  work.imageSource = work.imageSource ?? "local:mura/archive-collection";
  work.locales = {
    en: {
      title: content.shortTitle.en,
      author: localizedAuthor.en,
      shortTitle: content.shortTitle.en,
      fullDescription: content.fullDescription.en,
      tags: content.tags,
      fragments: localizedWorkFragments[work.id]?.en,
      availableLanguages: work.availableLanguages,
      ...(content.locales?.en ?? {}),
    },
    ru: {
      title: content.shortTitle.ru,
      author: localizedAuthor.ru,
      shortTitle: content.shortTitle.ru,
      fullDescription: content.fullDescription.ru,
      tags: content.tags,
      fragments: localizedWorkFragments[work.id]?.ru,
      availableLanguages: work.availableLanguages,
      ...(content.locales?.ru ?? {}),
    },
    kk: {
      title: content.shortTitle.kk,
      author: localizedAuthor.kk,
      shortTitle: content.shortTitle.kk,
      fullDescription: content.fullDescription.kk,
      tags: content.tags,
      fragments: localizedWorkFragments[work.id]?.kk,
      availableLanguages: work.availableLanguages,
      ...(content.locales?.kk ?? {}),
    },
  };
}
