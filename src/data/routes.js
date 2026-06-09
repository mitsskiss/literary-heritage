export const readingRoutes = [
  {
    id: "abai-path",
    title: "The Path of Abai",
    subtitle: "Knowledge, conscience, and the moral awakening of the steppe.",
    focusTheme: "Knowledge",
    minutes: 42,
    difficulty: "Medium",
    languages: "KZ / RU / EN",
    authorsCount: 2,
    works: ["abai-words", "auezov-abai-path"],
    recommendedNext: "alash-voice",
    steps: [
      {
        type: "intro",
        title: "Introduction",
        text: "This route follows Abai as a thinker whose word became a school of conscience.",
        content: "Begin with Abai as a guide to knowledge, responsibility, and inner discipline. The route asks how reading can become a form of self-education.",
        context: "Abai's legacy connects poetry, philosophy, music, and public moral reflection.",
        explanation: "The first stage frames the whole route as a journey through character, not only biography.",
        quote: "A person grows when knowledge becomes conscience.",
        source: "Route introduction",
      },
      {
        type: "context",
        title: "Historical context",
        text: "The nineteenth-century steppe faced questions of education, justice, language, and cultural renewal.",
        content: "The nineteenth-century Kazakh steppe was changing through education, social pressure, oral memory, and new written forms.",
        context: "This context explains why Abai's questions about learning, justice, and society became culturally important.",
        explanation: "Historical background helps the reader understand why philosophical prose could become a public act.",
        quote: "The steppe remembers those who served its word.",
        source: "Cultural context",
      },
      {
        type: "author",
        title: "Author",
        text: "Abai Kunanbayev connected poetry, philosophy, music, and ethical self-education.",
        content: "Abai appears here as poet, composer, educator, and thinker whose work calls the reader to examine the self.",
        context: "His thought belongs to Kazakh enlightenment and speaks to education, conscience, and renewal.",
        explanation: "The author stage connects life, ideas, and the moral tone of the route.",
        quote: "Do not seek profit, seek knowledge and character.",
        source: "Abai Kunanbayev",
      },
      {
        type: "work",
        title: "Work",
        text: "Book of Words asks how a person becomes worthy of knowledge and responsibility.",
        content: "A human being is born with curiosity and the desire to understand the world. Knowledge without labor is empty; labor without justice is heavy.",
        context: "Book of Words is philosophical prose where Abai discusses human nature, education, morality, and society.",
        explanation: "This stage focuses on the connection between curiosity, effort, and moral responsibility.",
        quote: "If a person does not strive for knowledge, the soul becomes empty.",
        source: "Book of Words",
        workId: "abai-words",
      },
      {
        type: "analysis",
        title: "Analysis",
        text: "The route explores knowledge as a moral practice, not only information.",
        content: "Knowledge in Abai is not an ornament. It must shape action, speech, responsibility, and care for the community.",
        context: "Analysis links the fragment to the route theme: knowledge as ethical practice.",
        explanation: "The key idea is that learning matters when it changes how a person lives.",
        quote: "Learning becomes human only when it passes through conscience.",
        source: "Route analysis",
      },
      {
        type: "quotes",
        title: "Quotes",
        text: "Important lines are read as cultural instructions for character and service.",
        content: "Read the quote not as decoration, but as a short instruction about discipline, humility, and responsibility.",
        context: "Quotes in the route work like compact cultural memory.",
        explanation: "The quote stage encourages slow reading and interpretation.",
        quote: "Demand from yourself, not from others, and your worries will follow their own road.",
        source: "Abai Kunanbayev",
      },
      {
        type: "task",
        title: "Interactive task",
        text: "Answer a short quiz and write one reflection about knowledge and conscience.",
        content: "Choose the strongest interpretation: why does Abai connect knowledge with moral growth?",
        context: "The task checks whether the reader sees the route's main idea.",
        explanation: "A good answer links learning with character, action, and responsibility.",
        quote: "Knowledge should awaken the person, not only fill the memory.",
        source: "Route quiz",
        quiz: {
          question: "Why does Abai connect knowledge with moral growth?",
          options: ["Because learning changes character", "Because knowledge is only status"],
        },
      },
      {
        type: "finish",
        title: "Completion",
        text: "Receive soft progress feedback and continue to Alash voices.",
        content: "You completed the Path of Abai. The next recommended route follows language, freedom, and civic responsibility in Alash literature.",
        context: "Completion turns reading into reflection, memory, and a next route.",
        explanation: "This final stage summarizes the route and points the reader forward.",
        quote: "A living word continues in the reader.",
        source: "Route completion",
      },
    ],
  },
  {
    id: "alash-voice",
    title: "Voice of Alash",
    subtitle: "Language, freedom, and civic responsibility in early twentieth-century literature.",
    focusTheme: "Freedom",
    minutes: 36,
    difficulty: "Medium",
    languages: "KZ / RU / EN",
    authorsCount: 2,
    works: ["dulatuly-wake-up-kazakh", "seifullin-thorny-path"],
    recommendedNext: "steppe-poetry",
    steps: [
      { type: "intro", title: "Introduction", text: "The route introduces literature as a voice of education and national self-awareness." },
      { type: "context", title: "Historical context", text: "The Alash period raised questions of language, literacy, autonomy, and modern identity." },
      { type: "author", title: "Author", text: "Dulatuly and Seifullin turn literature into civic awakening, testimony, and historical memory." },
      { type: "work", title: "Work", text: "Wake Up, Kazakh! and The Thorny Path show literature as alarm, witness, and memory." },
      { type: "analysis", title: "Analysis", text: "Freedom appears through language, duty, and the courage to remember." },
      { type: "quotes", title: "Quotes", text: "Read key lines as calls to cultural responsibility." },
      { type: "task", title: "Interactive task", text: "Choose the best interpretation and save a reflection." },
      { type: "finish", title: "Completion", text: "Receive soft progress feedback and a recommendation for the next route." },
    ],
  },
  {
    id: "steppe-poetry",
    title: "Poetry of the Steppe",
    subtitle: "Landscape, music, love, and national feeling in Kazakh poetry.",
    focusTheme: "Love",
    minutes: 30,
    difficulty: "Easy",
    languages: "KZ / RU / EN",
    authorsCount: 2,
    works: ["zhansugurov-kulager", "seifullin-kokshetau", "zhumabayev-sholpan", "makatayev-selected-poetry"],
    recommendedNext: "memory-repression",
    steps: [
      { type: "intro", title: "Introduction", text: "Poetry turns the steppe into sound, image, and emotional memory." },
      { type: "context", title: "Historical context", text: "Kazakh poetry carries oral rhythm into modern literary forms." },
      { type: "author", title: "Author", text: "Zhansugurov and Makatayev give landscape a human voice." },
      { type: "work", title: "Work", text: "Kulager and modern lyric poems show beauty, loss, and love." },
      { type: "analysis", title: "Analysis", text: "Images of horse, mountain, and homeland become cultural symbols." },
      { type: "quotes", title: "Quotes", text: "Quotes are paired with short explanations of image and feeling." },
      { type: "task", title: "Interactive task", text: "Match symbols to meanings and write a short interpretation." },
      { type: "finish", title: "Completion", text: "Complete the route and open a memory-focused recommendation." },
    ],
  },
  {
    id: "memory-repression",
    title: "Memory and Repression",
    subtitle: "Literature, historical pain, and the duty to remember.",
    focusTheme: "Memory",
    minutes: 34,
    difficulty: "Medium",
    languages: "KZ / RU / EN",
    authorsCount: 3,
    works: ["seifullin-thorny-path", "zhumabayev-batyr-bayan", "zhansugurov-kulager", "makatayev-raiymbek"],
    recommendedNext: "oral-tradition",
    steps: [
      { type: "intro", title: "Introduction", text: "This route treats literature as a space where painful history remains speakable." },
      { type: "context", title: "Historical context", text: "Twentieth-century Kazakh literature was shaped by transformation, repression, and survival." },
      { type: "author", title: "Author", text: "Seifullin, Zhumabayev, and Zhansugurov reveal different forms of courage." },
      { type: "work", title: "Work", text: "Selected works show history as personal wound and collective memory." },
      { type: "analysis", title: "Analysis", text: "Memory becomes a moral act rather than nostalgia." },
      { type: "quotes", title: "Quotes", text: "Read quoted fragments with cultural and historical explanations." },
      { type: "task", title: "Interactive task", text: "Answer a comprehension question about memory and responsibility." },
      { type: "finish", title: "Completion", text: "Receive soft progress feedback and open the Heritage Keeper recommendation." },
    ],
  },
  {
    id: "oral-tradition",
    title: "Folklore and Oral Tradition",
    subtitle: "The roots of Kazakh literary imagination.",
    focusTheme: "Identity",
    minutes: 26,
    difficulty: "Easy",
    languages: "KZ / RU / EN",
    authorsCount: 2,
    works: ["auezov-enlik-kebek", "shakarim-three-truths", "shakarim-qalqaman-mamyr"],
    recommendedNext: "abai-path",
    steps: [
      { type: "intro", title: "Introduction", text: "The route begins with oral memory, legend, song, and moral storytelling." },
      { type: "context", title: "Historical context", text: "Before print culture, knowledge moved through voice, performance, and community memory." },
      { type: "author", title: "Author", text: "Auezov and Shakarim transform inherited plots into literary reflection." },
      { type: "work", title: "Work", text: "Drama and philosophical prose preserve oral motifs in written form." },
      { type: "analysis", title: "Analysis", text: "Tradition is shown as a living structure of values and questions." },
      { type: "quotes", title: "Quotes", text: "Key lines are explained through custom, fate, and conscience." },
      { type: "task", title: "Interactive task", text: "Choose how oral tradition shapes modern identity." },
      { type: "finish", title: "Completion", text: "Finish the cycle and return to the Path of Abai." },
    ],
  },
  {
    id: "women-kazakh-literature",
    title: "Women in Kazakh Literature",
    subtitle: "Dignity, voice, memory, and the strength of women in prose and poetry.",
    focusTheme: "Identity",
    minutes: 30,
    difficulty: "Medium",
    languages: "KZ / RU / EN",
    authorsCount: 2,
    works: ["musrepov-ulpan", "ongarsynova-selected-poetry", "auezov-enlik-kebek"],
    recommendedNext: "classics-modern-prose",
    steps: [
      { type: "intro", title: "Introduction", text: "The route opens women's images as centers of dignity, memory, and moral choice." },
      { type: "context", title: "Historical context", text: "Kazakh literature shows women inside family, society, history, and personal voice." },
      { type: "author", title: "Author", text: "Musrepov and Ongarsynova reveal strength through prose character and lyric speech." },
      { type: "work", title: "Work", text: "Ulpan and modern poems frame courage as care, responsibility, and self-respect.", workId: "musrepov-ulpan" },
      { type: "analysis", title: "Analysis", text: "The route reads dignity as action, not decoration." },
      { type: "quotes", title: "Quotes", text: "Key lines show tenderness, courage, and social pressure." },
      { type: "task", title: "Interactive task", text: "Choose how voice changes the meaning of a literary image." },
      { type: "finish", title: "Completion", text: "Complete the route and continue to modern prose." },
    ],
  },
  {
    id: "classics-modern-prose",
    title: "From Classics to Modern Prose",
    subtitle: "Continuity from early prose to modern cultural essays and novels.",
    focusTheme: "Society",
    minutes: 38,
    difficulty: "Medium",
    languages: "KZ / RU / EN",
    authorsCount: 4,
    works: ["mailin-shuganyn-belgisi", "musrepov-ulpan", "suleimenov-az-i-ya", "auezov-abai-path"],
    recommendedNext: "literature-steppe",
    steps: [
      { type: "intro", title: "Introduction", text: "This path connects short prose, epic narration, and modern essay thought." },
      { type: "context", title: "Historical context", text: "Kazakh prose grew from oral memory, realism, historical novels, and cultural interpretation." },
      { type: "author", title: "Author", text: "Mailin, Auezov, Musrepov, and Suleimenov show different forms of prose intelligence." },
      { type: "work", title: "Work", text: "Read a prose fragment as a miniature archive of society and character.", workId: "mailin-shuganyn-belgisi" },
      { type: "analysis", title: "Analysis", text: "Prose turns everyday speech, memory, and history into form." },
      { type: "quotes", title: "Quotes", text: "Compare concise realism with cultural essay language." },
      { type: "task", title: "Interactive task", text: "Match a prose form to the problem it explores." },
      { type: "finish", title: "Completion", text: "Finish the prose bridge and move into the steppe as literary space." },
    ],
  },
  {
    id: "literature-steppe",
    title: "Literature of the Steppe",
    subtitle: "Landscape, homeland, movement, and the cultural geography of Kazakh writing.",
    focusTheme: "Memory",
    minutes: 32,
    difficulty: "Easy",
    languages: "KZ / RU / EN",
    authorsCount: 5,
    works: ["seifullin-kokshetau", "zhansugurov-kulager", "makatayev-raiymbek", "zhabayev-selected-aitys"],
    recommendedNext: "ethics-wisdom",
    steps: [
      { type: "intro", title: "Introduction", text: "The route reads the steppe as image, sound, road, and memory." },
      { type: "context", title: "Historical context", text: "Landscape in Kazakh literature is never empty background; it carries story and belonging." },
      { type: "author", title: "Author", text: "Poets turn mountain, horse, road, and song into cultural signs." },
      { type: "work", title: "Work", text: "Kokshetau and Kulager make place and movement feel alive.", workId: "seifullin-kokshetau" },
      { type: "analysis", title: "Analysis", text: "Place becomes literary memory when emotion and history gather there." },
      { type: "quotes", title: "Quotes", text: "Read images of mountain, lake, road, and horse as symbols." },
      { type: "task", title: "Interactive task", text: "Choose the symbol that best represents cultural memory." },
      { type: "finish", title: "Completion", text: "Complete the landscape route and continue to ethics and wisdom." },
    ],
  },
  {
    id: "ethics-wisdom",
    title: "Ethics and Wisdom",
    subtitle: "Conscience, responsibility, faith, and the moral education of the reader.",
    focusTheme: "Morality",
    minutes: 34,
    difficulty: "Medium",
    languages: "KZ / RU / EN",
    authorsCount: 2,
    works: ["abai-words", "shakarim-three-truths"],
    recommendedNext: "national-identity",
    steps: [
      { type: "intro", title: "Introduction", text: "This route treats reading as ethical self-education." },
      { type: "context", title: "Historical context", text: "Kazakh moral prose and poetry ask how knowledge becomes character." },
      { type: "author", title: "Author", text: "Abai and Shakarim connect wisdom with conscience, action, and responsibility." },
      { type: "work", title: "Work", text: "Book of Words and Three Truths make conscience the center of learning.", workId: "shakarim-three-truths" },
      { type: "analysis", title: "Analysis", text: "Wisdom is shown as discipline, responsibility, and care for others." },
      { type: "quotes", title: "Quotes", text: "Read short lines as practical instructions for character." },
      { type: "task", title: "Interactive task", text: "Choose why conscience matters more than status." },
      { type: "finish", title: "Completion", text: "Finish the ethics path and continue to national identity." },
    ],
  },
  {
    id: "national-identity",
    title: "National Identity in Literature",
    subtitle: "Language, memory, freedom, homeland, and cultural self-definition.",
    focusTheme: "Identity",
    minutes: 40,
    difficulty: "Medium",
    languages: "KZ / RU / EN",
    authorsCount: 6,
    works: ["dulatuly-wake-up-kazakh", "suleimenov-az-i-ya"],
    recommendedNext: "abai-path",
    steps: [
      { type: "intro", title: "Introduction", text: "The route follows identity as language, responsibility, and remembered homeland." },
      { type: "context", title: "Historical context", text: "Kazakh literature repeatedly returns to the question of what keeps a people awake." },
      { type: "author", title: "Author", text: "Alash and modern authors shape identity through language, history, and public voice." },
      { type: "work", title: "Work", text: "Wake Up, Kazakh! frames literature as a civic call.", workId: "dulatuly-wake-up-kazakh" },
      { type: "analysis", title: "Analysis", text: "Identity appears through action: remembering, speaking, reading, and choosing." },
      { type: "quotes", title: "Quotes", text: "Compare lines about language, homeland, and responsibility." },
      { type: "task", title: "Interactive task", text: "Write a short reflection about the word that preserves identity." },
      { type: "finish", title: "Completion", text: "Complete the identity route and return to the Path of Abai." },
    ],
  },
];

const abaiPathStageContent = {
  intro: {
    quote: {
      en: "A person grows when knowledge becomes conscience.",
      ru: "Человек растёт тогда, когда знание становится совестью.",
      kk: "Білім арға айналғанда ғана адам өседі."
    },
    source: { en: "Route introduction", ru: "Введение маршрута", kk: "Маршрут кіріспесі" },
    lead: {
      en: "The route begins with Abai as a guide to inward discipline, knowledge, and civic conscience.",
      ru: "Маршрут начинается с Абая как проводника к внутренней дисциплине, знанию и гражданской совести.",
      kk: "Маршрут Абайды ішкі тәртіпке, білімге және азаматтық арға бастайтын жолбасшы ретінде ашады."
    },
    body: {
      en: [
        "The Path of Abai is not only a biography route. It is a sequence of reading situations where the reader meets Abai’s central questions: what makes knowledge alive, how conscience shapes speech, and why literature can awaken a society.",
        "Begin with the main idea of the route: Kazakh literature becomes a path toward self-education. Abai’s word is valuable because it demands attention, responsibility, and an honest look at one’s own character."
      ],
      ru: [
        "«Путь Абая» — не просто биографический маршрут. Это последовательность читательских ситуаций, где читатель встречает главные вопросы Абая: что делает знание живым, как совесть формирует слово и почему литература способна пробуждать общество.",
        "Начните с главной идеи маршрута: казахская литература становится путём к самообразованию. Слово Абая ценно потому, что требует внимания, ответственности и честного взгляда на собственный характер."
      ],
      kk: [
        "«Абай жолы» тек өмірбаяндық бағыт емес. Бұл оқырманды Абайдың негізгі сұрақтарына әкелетін кезеңдер: білім қалай тірі күшке айналады, ар сөзді қалай қалыптастырады, әдебиет қоғамды қалай оятады.",
        "Маршруттың өзегінен бастаңыз: қазақ әдебиеті өзін-өзі тәрбиелеу жолына айналады. Абай сөзі жауапкершілікке, зейінге және өз мінезіне адал қарауға шақырады."
      ]
    },
    asideCards: [
      {
        type: "context",
        label: { en: "Context", ru: "Контекст", kk: "Контекст" },
        title: { en: "Why start here", ru: "Почему маршрут начинается здесь", kk: "Неге осы жерден басталады" },
        text: {
          en: "Abai’s prose and poetry make reading a moral practice, not a passive archive visit.",
          ru: "Проза и поэзия Абая превращают чтение в нравственную практику, а не в пассивный визит в архив.",
          kk: "Абай прозасы мен поэзиясы оқуды пассив архив емес, адамгершілік тәжірибе етеді."
        }
      },
      {
        type: "quote",
        label: { en: "Key quote", ru: "Ключевая цитата", kk: "Негізгі дәйексөз" },
        title: { en: "A living word", ru: "Живое слово", kk: "Тірі сөз" },
        text: {
          en: "A person grows when knowledge becomes conscience.",
          ru: "Человек растёт тогда, когда знание становится совестью.",
          kk: "Білім арға айналғанда ғана адам өседі."
        }
      }
    ]
  },
  context: {
    quote: {
      en: "The steppe remembers those who served its word.",
      ru: "Степь помнит тех, кто служил её слову.",
      kk: "Дала өз сөзіне қызмет еткендерді ұмытпайды."
    },
    source: { en: "Historical context", ru: "Исторический контекст", kk: "Тарихи контекст" },
    lead: {
      en: "Abai wrote from a century of social tension, changing education, imperial administration, and oral memory.",
      ru: "Абай писал внутри века социальных напряжений, перемен в образовании, имперской администрации и живой устной памяти.",
      kk: "Абай әлеуметтік тартыс, білім өзгерісі, әкімшілік жүйе және ауызша жад қатар өмір сүрген ғасырда жазды."
    },
    body: {
      en: [
        "The nineteenth-century Kazakh steppe was not a static background. It was a field of negotiation: clan authority, Russian imperial administration, new schools, trade, religious learning, and oral tradition all shaped the horizon of Abai’s thought.",
        "This stage asks the reader to see historical context as a living frame. Abai’s criticism of vanity, ignorance, and empty rivalry becomes clearer when placed beside the pressures of public reputation and local power."
      ],
      ru: [
        "Казахская степь XIX века не была неподвижным фоном. Это было пространство напряжённых связей: родовая власть, российская имперская администрация, новые школы, торговля, религиозное обучение и устная традиция вместе формировали горизонт мысли Абая.",
        "На этом этапе важно читать исторический контекст как живую рамку. Критика тщеславия, невежества и пустой борьбы у Абая становится понятнее рядом с давлением общественной репутации и местной власти."
      ],
      kk: [
        "XIX ғасырдағы қазақ даласы жай фон емес еді. Ру беделі, Ресей империялық әкімшілігі, жаңа мектептер, сауда, діни білім және ауызша дәстүр Абай ойының аясын қалыптастырды.",
        "Бұл кезең тарихи контексті тірі орта ретінде оқуға шақырады. Абай сынаған мақтан, надандық және бос тартыс қоғамдық бедел мен жергілікті билік қысымымен байланыста ашылады."
      ]
    }
  },
  author: {
    quote: {
      en: "Do not seek empty praise; seek knowledge and character.",
      ru: "Ищи не пустой похвалы, а знания и характера.",
      kk: "Бос мақтанды емес, білім мен мінезді ізде."
    },
    source: { en: "Abai Kunanbayev", ru: "Абай Кунанбаев", kk: "Абай Құнанбайұлы" },
    lead: {
      en: "Abai is presented as poet, composer, educator, critic, and a demanding reader of his own society.",
      ru: "Абай предстает как поэт, композитор, просветитель, критик и требовательный читатель собственного общества.",
      kk: "Абай ақын, композитор, ағартушы, сыншы және өз қоғамын талаппен оқыған ойшыл ретінде көрінеді."
    },
    body: {
      en: [
        "Abai Kunanbayev joins several roles that are often separated: poet, composer, translator, teacher, and moral critic. His authority does not come only from biography; it comes from the difficulty of the questions he leaves to the reader.",
        "In this route, the author is not a museum figure. Abai becomes a voice that asks how a person should speak, study, govern desire, and recognize responsibility before others."
      ],
      ru: [
        "Абай Кунанбаев соединяет роли, которые часто разделяют: поэт, композитор, переводчик, учитель и нравственный критик. Его авторитет рождается не только из биографии, но и из сложности вопросов, которые он оставляет читателю.",
        "В этом маршруте автор не музейная фигура. Абай становится голосом, который спрашивает, как человеку говорить, учиться, управлять желаниями и признавать ответственность перед другими."
      ],
      kk: [
        "Абай Құнанбайұлы ақын, композитор, аудармашы, ұстаз және моральдық сыншы рөлдерін біріктіреді. Оның беделі өмірбаяннан ғана емес, оқырманға қалдырған ауыр сұрақтарынан туады.",
        "Бұл маршрутта автор музейлік тұлға емес. Абай адамның қалай сөйлеуі, оқу, нәпсіні басқару және өзгеге жауапкершілікпен қарауы туралы сұрайтын дауысқа айналады."
      ]
    }
  },
  work: {
    quote: {
      en: "The Book of Words tests whether thought can become responsibility.",
      ru: "«Книга слов» проверяет, может ли мысль стать ответственностью.",
      kk: "«Қара сөздер» ойдың жауапкершілікке айнала ала ма, соны тексереді."
    },
    source: { en: "The Book of Words", ru: "Книга слов", kk: "Қара сөздер" },
    lead: {
      en: "The Book of Words turns prose into a laboratory of conscience, thought, and social diagnosis.",
      ru: "«Книга слов» превращает прозу в лабораторию совести, мысли и общественного диагноза.",
      kk: "«Қара сөздер» прозаны ар, ой және қоғамдық диагноз зертханасына айналдырады."
    },
    body: {
      en: [
        "The Book of Words is philosophical prose, but it is not abstract in a cold sense. It speaks from ordinary life: disputes, status, education, work, faith, and the difficulty of becoming human.",
        "Read the fragment as a question addressed directly to the reader. Abai does not simply describe society; he tests whether the reader can recognize the same weakness in themselves."
      ],
      ru: [
        "«Книга слов» — философская проза, но не холодная абстракция. Она говорит из повседневной жизни: споры, статус, образование, труд, вера и трудность становления человеком.",
        "Читайте фрагмент как вопрос, обращённый прямо к читателю. Абай не просто описывает общество; он проверяет, способен ли читатель узнать такую же слабость в себе."
      ],
      kk: [
        "«Қара сөздер» философиялық проза, бірақ суық абстракция емес. Ол күнделікті өмірден сөйлейді: дау, мәртебе, білім, еңбек, сенім және адам болудың қиындығы.",
        "Үзіндіні оқырманға тікелей қойылған сұрақ ретінде оқыңыз. Абай қоғамды ғана сипаттамайды; оқырман өз бойындағы әлсіздікті тануға қабілетті ме, соны тексереді."
      ]
    }
  },
  analysis: {
    quote: {
      en: "Learning becomes human only when it passes through conscience.",
      ru: "Учение становится человеческим только тогда, когда проходит через совесть.",
      kk: "Оқу ар арқылы өткенде ғана адамдық мәнге ие болады."
    },
    source: { en: "Route analysis", ru: "Анализ маршрута", kk: "Маршрут талдауы" },
    lead: {
      en: "The central pattern is knowledge as ethical practice: learning must change conduct.",
      ru: "Главный узор маршрута — знание как нравственная практика: учение должно менять поступок.",
      kk: "Маршруттың өзегі — білімнің этикалық тәжірибе болуы: оқу әрекетті өзгертуі керек."
    },
    body: {
      en: [
        "Abai repeatedly refuses decorative knowledge. To know is not to collect status; it is to discipline speech, labor, desire, and judgment. This is why his prose keeps returning to responsibility.",
        "The analytical task is to connect form and idea: short prose, direct address, moral contrast, and repeated questioning create a pressure that keeps the reader involved."
      ],
      ru: [
        "Абай снова и снова отказывается от декоративного знания. Знать — не значит копить статус; значит дисциплинировать речь, труд, желание и суждение. Поэтому его проза постоянно возвращается к ответственности.",
        "Аналитическая задача — связать форму и идею: короткая проза, прямое обращение, нравственный контраст и повторяющиеся вопросы создают напряжение, которое удерживает читателя внутри текста."
      ],
      kk: [
        "Абай сәндік білімнен қайта-қайта бас тартады. Білу — мәртебе жинау емес; сөзді, еңбекті, қалауды және пайымды тәртіпке келтіру. Сондықтан оның прозасы жауапкершілікке қайта оралады.",
        "Талдау міндеті — форма мен идеяны байланыстыру: қысқа проза, тікелей үндеу, моральдық қарама-қарсылық және қайталанған сұрақтар оқырманды мәтін ішінде ұстайды."
      ]
    }
  },
  quotes: {
    quote: {
      en: "Demand from yourself before you demand from others.",
      ru: "Прежде чем требовать от других, спроси с самого себя.",
      kk: "Өзгеден талап етпес бұрын, өзіңнен сұра."
    },
    source: { en: "Abai Kunanbayev", ru: "Абай Кунанбаев", kk: "Абай Құнанбайұлы" },
    lead: {
      en: "Quotes are treated as condensed ethical memory, not decoration.",
      ru: "Цитаты здесь читаются как сжатая этическая память, а не украшение.",
      kk: "Дәйексөздер мұнда әшекей емес, жинақталған этикалық жад ретінде оқылады."
    },
    body: {
      en: [
        "Choose one line and slow down. Ask what the sentence demands from the reader: attention, humility, self-critique, courage, or a different relation to knowledge.",
        "A note is useful when it does not only repeat the quote, but names the pressure inside it. What value is being protected? What weakness is being exposed?"
      ],
      ru: [
        "Выберите одну строку и замедлитесь. Спросите, чего фраза требует от читателя: внимания, смирения, самокритики, мужества или другого отношения к знанию.",
        "Заметка полезна тогда, когда она не повторяет цитату, а называет напряжение внутри неё. Какую ценность текст защищает? Какую слабость раскрывает?"
      ],
      kk: [
        "Бір жолды таңдап, баяу оқыңыз. Сөйлем оқырманнан не талап етеді: зейін, кішіпейілдік, өзін сынау, қайрат немесе білімге басқа қатынас па?",
        "Жазба цитатаны қайталамай, оның ішкі қысымын атаса ғана пайдалы. Мәтін қандай құндылықты қорғайды? Қандай әлсіздікті ашады?"
      ]
    }
  },
  task: {
    quote: {
      en: "Knowledge should awaken the person, not only fill the memory.",
      ru: "Знание должно пробуждать человека, а не только наполнять память.",
      kk: "Білім жадты ғана толтырмай, адамды оятуы керек."
    },
    source: { en: "Route task", ru: "Задание маршрута", kk: "Маршрут тапсырмасы" },
    lead: {
      en: "The task turns route reading into interpretation and a small act of self-positioning.",
      ru: "Задание превращает чтение маршрута в интерпретацию и маленький акт самоопределения.",
      kk: "Тапсырма маршрутты оқуды интерпретацияға және өзін айқындау әрекетіне айналдырады."
    },
    body: {
      en: [
        "Answer the question, then write one sentence in your note: what does Abai’s idea of knowledge ask from a reader today?",
        "The strongest answer connects knowledge with character. It does not reduce Abai to information, nor to a moral slogan."
      ],
      ru: [
        "Ответьте на вопрос, затем запишите одно предложение в заметке: чего абаевское понимание знания требует от читателя сегодня?",
        "Самый сильный ответ связывает знание с характером. Он не сводит Абая ни к информации, ни к нравственному лозунгу."
      ],
      kk: [
        "Сұраққа жауап беріңіз, содан кейін жазбаға бір сөйлем жазыңыз: Абайдың білім туралы ойы бүгінгі оқырманнан не талап етеді?",
        "Ең күшті жауап білімді мінезбен байланыстырады. Ол Абайды ақпаратқа да, құрғақ ұранға да түсірмейді."
      ]
    },
    quiz: {
      question: {
        en: "Why does Abai connect knowledge with moral growth?",
        ru: "Почему Абай связывает знание с нравственным ростом?",
        kk: "Абай неге білімді адамгершілік өсумен байланыстырады?"
      },
      options: [
        {
          en: "Because learning should change character, speech, and responsibility.",
          ru: "Потому что учение должно менять характер, слово и ответственность.",
          kk: "Өйткені оқу мінезді, сөзді және жауапкершілікті өзгертуі керек."
        },
        {
          en: "Because knowledge is mostly a sign of status.",
          ru: "Потому что знание прежде всего знак статуса.",
          kk: "Өйткені білім ең алдымен мәртебе белгісі."
        }
      ],
      explanation: {
        en: "Correct reading links knowledge with conduct and conscience.",
        ru: "Верное чтение связывает знание с поступком и совестью.",
        kk: "Дұрыс оқу білімді әрекетпен және армен байланыстырады."
      }
    }
  },
  finish: {
    quote: {
      en: "A living word continues in the reader.",
      ru: "Живое слово продолжается в читателе.",
      kk: "Тірі сөз оқырманда жалғасады."
    },
    source: { en: "Route completion", ru: "Завершение маршрута", kk: "Маршруттың аяқталуы" },
    lead: {
      en: "The route closes by turning Abai’s questions back toward the reader’s own practice.",
      ru: "Маршрут завершается тем, что вопросы Абая возвращаются к собственной практике читателя.",
      kk: "Маршрут соңында Абай сұрақтары оқырманның өз тәжірибесіне қайта оралады."
    },
    body: {
      en: [
        "Finishing the route does not exhaust Abai. It gives the reader a clearer entry point: knowledge must be tested by conscience, speech by responsibility, and reading by action.",
        "Continue with the next route or return to The Book of Words. The most important result is not a completed page, but a more attentive way of reading."
      ],
      ru: [
        "Завершение маршрута не исчерпывает Абая. Оно даёт читателю более ясную точку входа: знание проверяется совестью, слово — ответственностью, чтение — действием.",
        "Продолжите следующий маршрут или вернитесь к «Книге слов». Главный результат — не закрытая страница, а более внимательный способ чтения."
      ],
      kk: [
        "Маршруттың аяқталуы Абайды тауыспайды. Ол оқырманға анық кіру нүктесін береді: білім армен, сөз жауапкершілікпен, оқу әрекетпен тексеріледі.",
        "Келесі маршрутқа өтіңіз немесе «Қара сөздерге» қайта оралыңыз. Ең маңызды нәтиже — жабылған бет емес, тереңірек оқу тәсілі."
      ]
    }
  }
};

const abaiPath = readingRoutes.find((route) => route.id === "abai-path");

if (abaiPath) {
  abaiPath.steps = abaiPath.steps.map((step) => ({
    ...step,
    ...(abaiPathStageContent[step.type] ?? {}),
  }));
}
