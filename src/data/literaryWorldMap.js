const commonsImage = (fileName) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(fileName)}`;

const tr = (en, ru, kk) => ({ en, ru, kk });

export const mapCategoryMeta = {
  museum: { label: "Museum", color: "#c89531", icon: "museum" },
  memorial: { label: "Memorial", color: "#b58a42", icon: "memorial" },
  archive: { label: "Archive", color: "#6fb094", icon: "archive" },
  library: { label: "Library", color: "#3f8f7b", icon: "library" },
  route: { label: "Route point", color: "#d09a3c", icon: "route" },
  city: { label: "Literary center", color: "#7aa6b8", icon: "city" },
  spiritual: { label: "Spiritual heritage", color: "#b88a3f", icon: "book" },
};

const authors = {
  abai: {
    id: "abai-kunanbayev",
    name: tr("Abai Kunanbayev", "Абай Кунанбаев", "Абай Құнанбайұлы"),
    href: "/author/Abai%20Kunanbayev",
  },
  auezov: {
    id: "mukhtar-auezov",
    name: tr("Mukhtar Auezov", "Мухтар Ауэзов", "Мұхтар Әуезов"),
    href: "/author/Mukhtar%20Auezov",
  },
  baitursynuly: {
    id: "akhmet-baitursynuly",
    name: tr("Akhmet Baitursynuly", "Ахмет Байтурсынулы", "Ахмет Байтұрсынұлы"),
    href: "/author/Akhmet%20Baitursynuly",
  },
  seifullin: {
    id: "saken-seifullin",
    name: tr("Saken Seifullin", "Сакен Сейфуллин", "Сәкен Сейфуллин"),
    href: "/author/Saken%20Seifullin",
  },
  zhansugurov: {
    id: "ilyas-zhansugurov",
    name: tr("Ilyas Zhansugurov", "Ильяс Жансугуров", "Ілияс Жансүгіров"),
    href: "/author/Ilyas%20Zhansugurov",
  },
  zhambyl: {
    id: "zhambyl-zhabayev",
    name: tr("Zhambyl Zhabayev", "Жамбыл Жабаев", "Жамбыл Жабаев"),
    href: "/author/Zhambyl%20Zhabayev",
  },
  magzhan: {
    id: "magzhan-zhumabayev",
    name: tr("Magzhan Zhumabayev", "Магжан Жумабаев", "Мағжан Жұмабаев"),
    href: "/author/Magzhan%20Zhumabayev",
  },
  musrepov: {
    id: "gabit-musrepov",
    name: tr("Gabit Musrepov", "Габит Мусрепов", "Ғабит Мүсірепов"),
    href: "/author/Gabit%20Musrepov",
  },
  mukanov: {
    id: "sabit-mukanov",
    name: tr("Sabit Mukanov", "Сабит Муканов", "Сәбит Мұқанов"),
    href: "/authors",
  },
  yasawi: {
    id: "khoja-ahmed-yasawi",
    name: tr("Khoja Ahmed Yasawi", "Ходжа Ахмед Ясави", "Қожа Ахмет Ясауи"),
    href: "/authors",
  },
};

const works = {
  abaiWords: {
    id: "abai-words",
    title: tr("The Book of Words", "Книга слов", "Қара сөздер"),
    href: "/reading/abai-words",
  },
  abaiPath: {
    id: "auezov-abai-path",
    title: tr("The Path of Abai", "Путь Абая", "Абай жолы"),
    href: "/reading/auezov-abai-path",
  },
  masa: {
    id: "baitursynuly-masa",
    title: tr("Masa", "Маса", "Маса"),
    href: "/reading/baitursynuly-masa",
  },
  thornyPath: {
    id: "seifullin-thorny-path",
    title: tr("The Thorny Path", "Тернистый путь", "Тар жол, тайғақ кешу"),
    href: "/reading/seifullin-thorny-path",
  },
  kulager: {
    id: "zhansugurov-kulager",
    title: tr("Kulager", "Кулагер", "Құлагер"),
    href: "/reading/zhansugurov-kulager",
  },
  batyrBayan: {
    id: "zhumabayev-batyr-bayan",
    title: tr("Batyr Bayan", "Батыр Баян", "Батыр Баян"),
    href: "/reading/zhumabayev-batyr-bayan",
  },
  zhambylAitys: {
    id: "zhabayev-selected-aitys",
    title: tr("Selected Aitys and Poems", "Избранные айтысы и стихи", "Таңдамалы айтыстар мен өлеңдер"),
    href: "/reading/zhabayev-selected-aitys",
  },
  ulpan: {
    id: "musrepov-ulpan",
    title: tr("Ulpan", "Улпан", "Ұлпан"),
    href: "/reading/musrepov-ulpan",
  },
};

const routes = {
  abaiPath: {
    id: "abai-path",
    label: tr("The Path of Abai", "Путь Абая", "Абай жолы"),
    href: "/route/abai-path",
  },
  classics: {
    id: "classics-modern-prose",
    label: tr("From Classics to Modern Prose", "От классики к современной прозе", "Классикадан қазіргі прозаға"),
    href: "/route/classics-modern-prose",
  },
  memory: {
    id: "memory-repression",
    label: tr("Memory and Repression", "Память и репрессии", "Жады және қуғын-сүргін"),
    href: "/route/memory-repression",
  },
  oral: {
    id: "oral-tradition",
    label: tr("Folklore and Oral Tradition", "Фольклор и устная традиция", "Фольклор және ауызша дәстүр"),
    href: "/route/oral-tradition",
  },
  women: {
    id: "women-kazakh-literature",
    label: tr("Women in Kazakh Literature", "Женщины в казахской литературе", "Қазақ әдебиетіндегі әйелдер"),
    href: "/route/women-kazakh-literature",
  },
  ethics: {
    id: "ethics-wisdom",
    label: tr("Ethics and Wisdom", "Этика и мудрость", "Әдеп және даналық"),
    href: "/route/ethics-wisdom",
  },
};

export const literaryWorldMarkers = [
  {
    id: "abai-museum-semey",
    title: tr("Abai Literary-Memorial Museum", "Литературно-мемориальный музей Абая", "Абайдың әдеби-мемориалдық музейі"),
    name: "Abai Literary-Memorial Museum",
    author: "Abai Kunanbayev",
    regionId: "abai-region",
    region: tr("Abai region", "Абайская область", "Абай облысы"),
    city: tr("Semey", "Семей", "Семей"),
    category: "museum",
    type: tr("Museum-reserve", "Музей-заповедник", "Музей-қорық"),
    coordinates: { lat: 50.4112, lng: 80.2492 },
    shortDescription: tr(
      "The central museum of Abai's literary memory in Semey.",
      "Главный музей литературной памяти Абая в Семее.",
      "Семейдегі Абай әдеби мұрасының негізгі музейі."
    ),
    fullDescription: tr(
      "The Abai museum in Semey anchors the map in manuscripts, portraits, editions, and the city where Abai is studied as a poet, thinker, composer, and moral voice. It gives readers a concrete entry point into the schools, journals, family memory, and research traditions that keep Abai's work present. Through this place, the map connects The Book of Words with Semey's role as one of Kazakhstan's key literary memory centers.",
      "Музей Абая в Семее связывает рукописи, портреты, издания и городской контекст, где Абая читают как поэта, мыслителя, композитора и нравственный голос.",
      "Семейдегі Абай музейі қолжазбаларды, портреттерді, басылымдарды және ақынды ойшыл, композитор әрі рухани тұлға ретінде танытатын қалалық ортаны біріктіреді."
    ),
    significance: {
      en: "This museum is the clearest entry point into Abai's written legacy. It connects manuscripts, portraits, editions, and Semey's intellectual history so readers understand why Abai became a national literary and ethical reference point.",
    },
    relatedAuthors: [authors.abai],
    relatedWorks: [works.abaiWords],
    routeLinks: [routes.abaiPath],
    imageUrl: "https://crm.e-museum.kz/emuseum/museum/MuseumGal/2cdc287f-2fbc-40a1-bbbf-dff46fe8d736.jpeg",
    imagePosition: "center bottom",
    imageAlt: tr("Facade of the Abai museum in Semey", "Фасад музея Абая в Семее", "Семейдегі Абай музейінің қасбеті"),
    imageCredit: "e-museum.kz / Museums of Kazakhstan",
    sourceUrl: "https://e-museum.kz/en/museum/68da379907229623e-en/",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=50.4112,80.2492",
  },
  {
    id: "alash-arystary-semey",
    title: tr("Alash Arystary Museum", "Музей «Алаш арыстары»", "«Алаш арыстары» музейі"),
    name: "Alash Arystary Museum",
    author: "Akhmet Baitursynuly",
    regionId: "abai-region",
    region: tr("Abai region", "Абайская область", "Абай облысы"),
    city: tr("Semey", "Семей", "Семей"),
    category: "archive",
    type: tr("Intellectual memory museum", "Музей интеллектуальной памяти", "Зияткерлік жады музейі"),
    coordinates: { lat: 50.407024, lng: 80.256447 },
    shortDescription: tr(
      "A Semey site for Alash thinkers, language reform, newspapers, and civic responsibility.",
      "Семейская точка памяти об Алаш, языковой реформе, газетах и гражданской ответственности.",
      "Алаш зиялылары, тіл реформасы, баспасөз және азаматтық жауапкершілік туралы Семейдегі жады орны."
    ),
    fullDescription: tr(
      "The museum expands the map beyond one biography and places Kazakh literature beside education, journalism, political courage, and the early twentieth-century Alash movement. It helps explain why newspapers, textbooks, public language, and civic essays were literary acts as well as political ones. The Semey location keeps the Alash story close to the same urban archive that shaped Abai and Auezov.",
      "Музей выводит карту за пределы одной биографии и показывает литературу рядом с просвещением, журналистикой, политической смелостью и движением Алаш начала XX века.",
      "Бұл музей картаны бір тұлғадан кеңейтіп, әдебиетті ағарту, журналистика, азаматтық батылдық және XX ғасыр басындағы Алаш қозғалысымен байланыстырады."
    ),
    significance: {
      en: "This site shows literature as civic work: language reform, journalism, education, and public responsibility. It makes the Alash movement visible as part of Kazakhstan's literary memory, not only as political history.",
    },
    relatedAuthors: [authors.baitursynuly, authors.auezov],
    relatedWorks: [works.masa],
    routeLinks: [routes.memory],
    imageUrl: commonsImage("Alash arystary museum b.jpg"),
    imageAlt: tr("Alash Arystary museum building in Semey", "Здание музея «Алаш арыстары» в Семее", "Семейдегі «Алаш арыстары» музейінің ғимараты"),
    imageCredit: "Wikimedia Commons / Ерден Карсыбеков",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Alash_arystary_museum_b.jpg",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=50.407024,80.256447",
  },
  {
    id: "zhidebai-borili-abai",
    title: tr("Zhidebai-Borili Abai Museum-Reserve", "Жидебай-Борили, музей-заповедник Абая", "Жидебай-Бөрілі Абай музей-қорығы"),
    name: "Zhidebai-Borili Abai Museum-Reserve",
    author: "Abai Kunanbayev",
    regionId: "abai-region",
    region: tr("Abai region", "Абайская область", "Абай облысы"),
    city: tr("Zhidebai", "Жидебай", "Жидебай"),
    category: "memorial",
    type: tr("Memorial complex", "Мемориальный комплекс", "Мемориалдық кешен"),
    coordinates: { lat: 49.6225, lng: 80.1589 },
    shortDescription: tr(
      "The steppe memorial landscape connected with Abai's final years and family memory.",
      "Степной мемориальный ландшафт, связанный с последними годами Абая и семейной памятью.",
      "Абайдың соңғы жылдары мен әулет жадына қатысты дала мемориалдық кеңістігі."
    ),
    fullDescription: tr(
      "Zhidebai-Borili gives the map a landscape dimension: Abai is seen through aul memory, steppe routes, graves, family history, and living remembrance. The place moves Abai from the museum archive into the rural landscape where his biography, family circle, and ethical thought are remembered together. It also helps readers understand why the Abai route is both literary and memorial.",
      "Жидебай-Борили добавляет карте ландшафтное измерение: Абай здесь связан с памятью аула, степными дорогами, могилами, семейной историей и живым почитанием.",
      "Жидебай-Бөрілі картаға кеңістік береді: Абай мұнда ауыл жадымен, дала жолдарымен, қорымдармен, әулет тарихымен және тірі құрметпен байланысады."
    ),
    significance: {
      en: "Zhidebai-Borili moves Abai from archive to landscape. The memorial complex ties his late years, family memory, burial places, and steppe routes into one living geography of Kazakh literature.",
    },
    relatedAuthors: [authors.abai, authors.auezov],
    relatedWorks: [works.abaiWords, works.abaiPath],
    routeLinks: [routes.abaiPath],
    imageUrl: commonsImage("Auezov House in Borli.JPG"),
    imageAlt: tr("Historic house in Borili", "Исторический дом в Бөрілі", "Бөрілідегі тарихи үй"),
    imageCredit: "Wikimedia Commons",
    sourceUrl: "https://abai-museum.kz/?lang=en",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Zhidebai%20Borili%20Abai%20Museum%20Reserve",
  },
  {
    id: "auezov-house-almaty",
    title: tr("M. Auezov House Museum", "Дом-музей Мухтара Ауэзова", "Мұхтар Әуезовтің үй-музейі"),
    name: "M. Auezov House Museum",
    author: "Mukhtar Auezov",
    regionId: "almaty",
    region: tr("Almaty", "Алматы", "Алматы"),
    city: tr("Almaty", "Алматы", "Алматы"),
    category: "museum",
    type: tr("House museum", "Дом-музей", "Үй-музей"),
    coordinates: { lat: 43.2476, lng: 76.9503 },
    shortDescription: tr(
      "The Almaty home where Auezov lived and worked on the Abai epic.",
      "Алматинский дом, где Ауэзов жил и работал над эпопеей об Абае.",
      "Әуезов өмір сүріп, Абай эпопеясына еңбек еткен Алматыдағы үй."
    ),
    fullDescription: tr(
      "The house museum connects literary biography with the creation of Abai's epic image and shows how a place of work, drafts, and memory becomes part of a national archive. Auezov's Almaty home lets the map show the labor behind The Path of Abai: study, revision, family rooms, and the writer's everyday environment. It also links the Abai tradition with modern Kazakh prose and literary scholarship.",
      "Дом-музей связывает литературную биографию с созданием эпического образа Абая и показывает, как место труда, черновиков и памяти становится частью национального архива.",
      "Үй-музей әдеби өмірбаянды Абайдың эпикалық бейнесімен байланыстырып, еңбек, қолжазба және жады орнының ұлттық архивке қалай айналатынын көрсетеді."
    ),
    significance: {
      en: "This house explains how Auezov turned Abai's life into epic prose. It preserves the working environment behind The Path of Abai and connects biography, drafts, domestic memory, and national literary scholarship.",
    },
    relatedAuthors: [authors.auezov, authors.abai],
    relatedWorks: [works.abaiPath],
    routeLinks: [routes.abaiPath, routes.classics],
    imageUrl: commonsImage("ALADomAuezova.JPG"),
    imageAlt: tr("Mukhtar Auezov House Museum in Almaty", "Дом-музей Мухтара Ауэзова в Алматы", "Алматыдағы Мұхтар Әуезовтің үй-музейі"),
    imageCredit: "Wikimedia Commons / Ds02006",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:ALADomAuezova.JPG",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=43.2476,76.9503",
  },
  {
    id: "baitursynuly-house-almaty",
    title: tr("Akhmet Baitursynuly House Museum", "Дом-музей Ахмета Байтурсынулы", "Ахмет Байтұрсынұлының музей-үйі"),
    name: "Akhmet Baitursynuly House Museum",
    author: "Akhmet Baitursynuly",
    regionId: "almaty",
    region: tr("Almaty", "Алматы", "Алматы"),
    city: tr("Almaty", "Алматы", "Алматы"),
    category: "memorial",
    type: tr("Memorial house museum", "Мемориальный дом-музей", "Мемориалдық үй-музей"),
    coordinates: { lat: 43.2461, lng: 76.9269 },
    shortDescription: tr(
      "The Almaty house where Baitursynuly lived in 1934-1937.",
      "Алматинский дом, где Байтурсынулы жил в 1934-1937 годах.",
      "Байтұрсынұлы 1934-1937 жылдары тұрған Алматыдағы үй."
    ),
    fullDescription: tr(
      "The museum links language reform, teaching, Alash public thought, and the fragile domestic setting of the last years before repression. It is important because Baitursynuly's literary work cannot be separated from alphabet reform, education, journalism, and public speech. The house turns a broad national story into a specific address in Almaty where visitors can connect texts with a human biography.",
      "Музей связывает реформу языка, просвещение, общественную мысль Алаш и хрупкое домашнее пространство последних лет перед репрессиями.",
      "Музей тіл реформасын, ағартушылықты, Алаш ойларын және қуғын-сүргін алдындағы соңғы жылдардың үй кеңістігін біріктіреді."
    ),
    significance: {
      en: "This house anchors language reform, alphabet modernization, pedagogy, and Alash public thought in one intimate place. It keeps Baitursynuly's literary and civic work connected to the difficult memory of repression.",
    },
    relatedAuthors: [authors.baitursynuly],
    relatedWorks: [works.masa],
    routeLinks: [routes.memory],
    imageUrl: commonsImage("Akhmet Baytursynov's memory museum in Almaty.JPG"),
    imageAlt: tr("Akhmet Baitursynuly House Museum in Almaty", "Дом-музей Ахмета Байтурсынулы в Алматы", "Алматыдағы Ахмет Байтұрсынұлы музей-үйі"),
    imageCredit: "Wikimedia Commons",
    sourceUrl: "https://almatymuseums.kz/en/vnutrennyaya-muzeya-baytursynova",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=43.2461,76.9269",
  },
  {
    id: "national-library-almaty",
    title: tr("National Library of Kazakhstan", "Национальная библиотека Казахстана", "Қазақстан Ұлттық кітапханасы"),
    name: "National Library of Kazakhstan",
    author: "Kazakh literature",
    regionId: "almaty",
    region: tr("Almaty", "Алматы", "Алматы"),
    city: tr("Almaty", "Алматы", "Алматы"),
    category: "library",
    type: tr("National library", "Национальная библиотека", "Ұлттық кітапхана"),
    coordinates: { lat: 43.2389, lng: 76.9456 },
    shortDescription: tr(
      "A major book depository and research center for Kazakh literary heritage.",
      "Крупное книгохранилище и исследовательский центр казахского литературного наследия.",
      "Қазақ әдеби мұрасының ірі кітап қоры және зерттеу орталығы."
    ),
    fullDescription: tr(
      "The library makes Almaty visible as a literary center where texts are preserved, catalogued, researched, exhibited, and returned to readers. Its collections connect classic editions, rare publications, literary scholarship, and public reading culture. On the map it acts as the institutional memory of Kazakh literature rather than the home of one author.",
      "Библиотека показывает Алматы как литературный центр, где тексты сохраняют, каталогизируют, изучают, выставляют и возвращают читателям.",
      "Кітапхана Алматыны мәтіндер сақталатын, жүйеленетін, зерттелетін, көрмеге шығарылатын және оқырманға қайта оралатын әдеби орталық ретінде танытады."
    ),
    significance: {
      en: "The National Library represents preservation, research, cataloguing, exhibition, and public reading. It gives the map a major institutional place where many authors and works remain accessible together.",
    },
    relatedAuthors: [authors.abai, authors.auezov, authors.baitursynuly],
    relatedWorks: [works.abaiWords, works.masa],
    routeLinks: [routes.classics],
    imageUrl: commonsImage("National Library of the Republic of Kazakhstan in Almaty.jpg"),
    imageAlt: tr("National Library of Kazakhstan in Almaty", "Национальная библиотека Казахстана в Алматы", "Алматыдағы Қазақстан Ұлттық кітапханасы"),
    imageCredit: "Wikimedia Commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:National_Library_of_the_Republic_of_Kazakhstan_in_Almaty.jpg",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=43.2389,76.9456",
  },
  {
    id: "mukanov-musrepov-almaty",
    title: tr("S. Mukanov and G. Musrepov Museum Complex", "Музейный комплекс С. Муканова и Г. Мусрепова", "С. Мұқанов пен Ғ. Мүсірепов музей кешені"),
    name: "Sabit Mukanov and Gabit Musrepov Museum Complex",
    author: "Gabit Musrepov",
    regionId: "almaty",
    region: tr("Almaty", "Алматы", "Алматы"),
    city: tr("Almaty", "Алматы", "Алматы"),
    category: "museum",
    type: tr("Memorial museum complex", "Мемориальный музейный комплекс", "Мемориалдық музей кешені"),
    coordinates: { lat: 43.2522, lng: 76.9416 },
    shortDescription: tr(
      "A two-author museum preserving prose, drama, apartments, editions, and manuscripts.",
      "Музей двух авторов, сохраняющий прозу, драматургию, квартиры, издания и рукописи.",
      "Проза, драматургия, пәтерлер, басылымдар мен қолжазбаларды сақтайтын екі автор музейі."
    ),
    fullDescription: tr(
      "The complex shows how twentieth-century literary memory lives in apartments, manuscripts, books, and everyday objects connected with Mukanov and Musrepov.",
      "Комплекс показывает, как литературная память XX века живет в квартирах, рукописях, книгах и бытовых предметах, связанных с Мукановым и Мусреповым.",
      "Кешен XX ғасыр әдеби жадының Мұқанов пен Мүсіреповке қатысты пәтерлерде, қолжазбаларда, кітаптарда және тұрмыстық заттарда қалай сақталатынын көрсетеді."
    ),
    significance: {
      en: "The complex shows modern prose and drama through lived interiors, manuscripts, editions, and two linked author biographies. It gives Almaty a dense twentieth-century literary memory point.",
    },
    relatedAuthors: [authors.mukanov, authors.musrepov],
    relatedWorks: [works.ulpan],
    routeLinks: [routes.classics, routes.women],
    imageUrl: commonsImage("Sabit Mukanov Museum Almaty.jpg"),
    imageAlt: tr("Literary museum complex in Almaty", "Литературный музейный комплекс в Алматы", "Алматыдағы әдеби музей кешені"),
    imageCredit: "Visit Almaty",
    sourceUrl: "https://visitalmaty.kz/en/literary-and-memorial-museum-complex-of-sabit-mukanov-and-gabit-musrepov/",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=43.2522,76.9416",
  },
  {
    id: "saken-seifullin-museum-astana",
    title: tr("Saken Seifullin Museum", "Музей Сакена Сейфуллина", "Сәкен Сейфуллин музейі"),
    name: "Saken Seifullin Museum",
    author: "Saken Seifullin",
    regionId: "astana",
    region: tr("Astana", "Астана", "Астана"),
    city: tr("Astana", "Астана", "Астана"),
    category: "museum",
    type: tr("Literary museum", "Литературный музей", "Әдеби музей"),
    coordinates: { lat: 51.171335, lng: 71.42373 },
    shortDescription: tr(
      "An Astana literary museum connected with Seifullin's poetry, public service, and twentieth-century memory.",
      "Литературный музей Астаны, связанный с поэзией, общественной службой и памятью XX века.",
      "Сейфуллин поэзиясы, қоғамдық қызметі және XX ғасыр жадымен байланысты Астанадағы әдеби музей."
    ),
    fullDescription: tr(
      "The museum links the capital with the literary and political drama of the twentieth century: civic courage, repression, public writing, and modern Kazakh poetry. Seifullin's legacy is shown through poetry, public service, biography, and the memory of political violence. For the map, the museum makes Astana part of the literary archive rather than only a contemporary capital.",
      "Музей связывает столицу с литературной и политической драмой XX века: гражданской смелостью, репрессиями, общественным словом и современной казахской поэзией.",
      "Музей астананы XX ғасырдың әдеби-саяси драмасымен: азаматтық батылдықпен, қуғын-сүргінмен, қоғамдық сөзбен және жаңа қазақ поэзиясымен байланыстырады."
    ),
    significance: {
      en: "This museum links the capital with twentieth-century public writing, poetry, state service, and repression memory. It helps readers see Seifullin as both a literary figure and a witness to civic risk.",
    },
    relatedAuthors: [authors.seifullin],
    relatedWorks: [works.thornyPath],
    routeLinks: [routes.memory],
    imageUrl: commonsImage("Saken Seifullin Museum Astana.jpg"),
    imageAlt: tr("Saken Seifullin Museum in Astana", "Музей Сакена Сейфуллина в Астане", "Астанадағы Сәкен Сейфуллин музейі"),
    imageCredit: "Visit Astana",
    sourceUrl: "https://www.visitastana.kz/en/about-city/what-to-see/the-state-museum-named-after-s-seifullin/",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=51.171335,71.42373",
  },
  {
    id: "national-academic-library-astana",
    title: tr("National Academic Library", "Национальная академическая библиотека", "Ұлттық академиялық кітапхана"),
    name: "National Academic Library of the Republic of Kazakhstan",
    author: "Kazakh literature",
    regionId: "astana",
    region: tr("Astana", "Астана", "Астана"),
    city: tr("Astana", "Астана", "Астана"),
    category: "library",
    type: tr("Academic library", "Академическая библиотека", "Академиялық кітапхана"),
    coordinates: { lat: 51.12694, lng: 71.42694 },
    shortDescription: tr(
      "A national research library and public reading space in the capital.",
      "Национальная исследовательская библиотека и публичное пространство чтения в столице.",
      "Елордадағы ұлттық зерттеу кітапханасы және қоғамдық оқу кеңістігі."
    ),
    fullDescription: tr(
      "The Astana library gives the map a second national book center, connecting contemporary scholarship, public reading, rare editions, and cultural programming.",
      "Астанинская библиотека добавляет карте второй национальный книжный центр, соединяя современную науку, публичное чтение, редкие издания и культурные программы.",
      "Астанадағы кітапхана картаға екінші ұлттық кітап орталығын қосып, қазіргі ғылымды, қоғамдық оқуды, сирек басылымдарды және мәдени бағдарламаларды біріктіреді."
    ),
    significance: {
      en: "The National Academic Library broadens the map from memorial museums to living research infrastructure. It ties rare books, public reading, scholarship, and cultural programming to the capital.",
    },
    relatedAuthors: [authors.abai, authors.seifullin],
    relatedWorks: [works.thornyPath],
    routeLinks: [routes.memory, routes.classics],
    imageUrl: commonsImage("Asiatic Russia, Volumes 1 and 2 WDL6946.jpg"),
    imageAlt: tr("Rare book collection connected with the National Academic Library", "Редкое издание из фонда Национальной академической библиотеки", "Ұлттық академиялық кітапхана қорындағы сирек басылым"),
    imageCredit: "Wikimedia Commons / World Digital Library",
    sourceUrl: "https://nabrk.kz/en/page/how-get-library",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=51.12694,71.42694",
  },
  {
    id: "ilyas-zhansugurov-museum-taldykorgan",
    title: tr("I. Zhansugurov Literary Museum", "Литературный музей И. Жансугурова", "І. Жансүгіров әдеби музейі"),
    name: "I. Zhansugurov Literary Museum",
    author: "Ilyas Zhansugurov",
    regionId: "zhetysu",
    region: tr("Zhetysu region", "Жетысуская область", "Жетісу облысы"),
    city: tr("Taldykorgan", "Талдыкорган", "Талдықорған"),
    category: "museum",
    type: tr("Regional literary museum", "Областной литературный музей", "Облыстық әдеби музей"),
    coordinates: { lat: 45.017806, lng: 78.384361 },
    shortDescription: tr(
      "A Taldykorgan center for studying Ilyas Zhansugurov's poetry and archives.",
      "Талдыкорганский центр изучения поэзии и архива Ильяса Жансугурова.",
      "Ілияс Жансүгіров поэзиясы мен архивін зерттейтін Талдықорғандағы орталық."
    ),
    fullDescription: tr(
      "The museum adds Zhetysu to the map through Kulager, manuscripts, regional literary memory, and the fate of one of the central poets of the 1930s.",
      "Музей добавляет на карту Жетысу через «Кулагера», рукописи, региональную литературную память и судьбу одного из ключевых поэтов 1930-х годов.",
      "Музей картаға Жетісуды «Құлагер», қолжазбалар, өңірлік әдеби жады және 1930-жылдардағы ірі ақын тағдыры арқылы қосады."
    ),
    significance: {
      en: "The museum brings Zhetysu into the literary map through Kulager, archives, and the memory of a major poet of the 1930s. It connects regional place with national poetic canon.",
    },
    relatedAuthors: [authors.zhansugurov],
    relatedWorks: [works.kulager],
    routeLinks: [routes.memory],
    imageUrl: commonsImage("Ilyas Jansügirov portrait at Almaty Central State Museum of Kazakhstan.jpg"),
    imageAlt: tr("Portrait of Ilyas Zhansugurov", "Портрет Ильяса Жансугурова", "Ілияс Жансүгіров портреті"),
    imageCredit: "Wikimedia Commons / Nurken",
    sourceUrl: "https://cultural.kz/slider/images/221-en.pdf",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=45.017806,78.384361",
  },
  {
    id: "zhambyl-museum-almaty-region",
    title: tr("Zhambyl Zhabayev Literary-Memorial Museum", "Литературно-мемориальный музей Жамбыла Жабаева", "Жамбыл Жабаевтың әдеби-мемориалдық музейі"),
    name: "Zhambyl Zhabayev Literary-Memorial Museum",
    author: "Zhambyl Zhabayev",
    regionId: "almaty-region",
    region: tr("Almaty region", "Алматинская область", "Алматы облысы"),
    city: tr("Zhambyl village", "село Жамбыл", "Жамбыл ауылы"),
    category: "memorial",
    type: tr("Literary memorial estate", "Литературная мемориальная усадьба", "Әдеби-мемориалдық мекен"),
    coordinates: { lat: 43.144305, lng: 76.180434 },
    shortDescription: tr(
      "The estate museum and garden where the akyn's late-life memory is preserved.",
      "Усадьба-музей и сад, где хранится память о поздних годах акына.",
      "Ақынның соңғы жылдар жады сақталған музей-үй мен бақ."
    ),
    fullDescription: tr(
      "The Zhambyl museum brings oral poetry onto the map through a house, garden, mausoleum, performance memory, and the public voice of the akyn tradition.",
      "Музей Жамбыла вводит на карту устную поэзию через дом, сад, мавзолей, память исполнения и общественный голос традиции акынов.",
      "Жамбыл музейі ауызша поэзияны үй, бақ, кесене, орындаушылық жады және ақындық дәстүрдің қоғамдық үні арқылы картаға енгізеді."
    ),
    significance: {
      en: "This estate gives oral poetry a physical place on the map. It links Zhambyl's late-life home, performance memory, garden, mausoleum, and the public voice of the akyn tradition.",
    },
    relatedAuthors: [authors.zhambyl],
    relatedWorks: [works.zhambylAitys],
    routeLinks: [routes.oral],
    imageUrl: commonsImage("Zhambyl Zhabaev's guest room 02.jpg"),
    imageAlt: tr("Guest room in the Zhambyl Zhabayev museum", "Гостиная в музее Жамбыла Жабаева", "Жамбыл Жабаев музейіндегі қонақ бөлме"),
    imageCredit: "Wikimedia Commons / Zhambyl museum",
    sourceUrl: "https://en.tengrinews.kz/guide-map_object/60/",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=43.144305,76.180434",
  },
  {
    id: "magzhan-monument-petropavl",
    title: tr("Magzhan Zhumabayev Monument", "Памятник Магжану Жумабаеву", "Мағжан Жұмабаев ескерткіші"),
    name: "Magzhan Zhumabayev Monument",
    author: "Magzhan Zhumabayev",
    regionId: "north-kazakhstan",
    region: tr("North Kazakhstan region", "Северо-Казахстанская область", "Солтүстік Қазақстан облысы"),
    city: tr("Petropavl", "Петропавловск", "Петропавл"),
    category: "memorial",
    type: tr("Literary monument", "Литературный памятник", "Әдеби ескерткіш"),
    coordinates: { lat: 54.872025, lng: 69.129578 },
    shortDescription: tr(
      "A public memorial point for Magzhan's poetry and northern Kazakhstan's literary memory.",
      "Публичная мемориальная точка поэзии Магжана и литературной памяти Северного Казахстана.",
      "Мағжан поэзиясы мен Солтүстік Қазақстан әдеби жадының қоғамдық ескерткіш нүктесі."
    ),
    fullDescription: tr(
      "The Petropavl marker connects Magzhan Zhumabayev with the northern cityscape, education, symbolism, exile memory, and the poem Batyr Bayan.",
      "Петропавловская точка связывает Магжана Жумабаева с северным городским ландшафтом, образованием, символизмом, памятью ссылки и поэмой «Батыр Баян».",
      "Петропавлдағы нүкте Мағжан Жұмабаевты солтүстік қалалық кеңістікпен, біліммен, символизммен, айдаудың жадымен және «Батыр Баян» поэмасымен байланыстырады."
    ),
    significance: {
      en: "The Petropavl marker keeps Magzhan's northern geography visible. It connects public monument, education, symbolism, exile memory, and Batyr Bayan.",
    },
    relatedAuthors: [authors.magzhan],
    relatedWorks: [works.batyrBayan],
    routeLinks: [routes.memory],
    imageUrl: commonsImage("Petropavl-statue.jpg"),
    imageAlt: tr("Monument to Magzhan Zhumabayev in Petropavl", "Памятник Магжану Жумабаеву в Петропавловске", "Петропавлдағы Мағжан Жұмабаев ескерткіші"),
    imageCredit: "Wikimedia Commons / Hanno Böck",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Petropavl-statue.jpg",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=54.872025,69.129578",
  },
  {
    id: "yasawi-mausoleum-turkistan",
    title: tr("Mausoleum of Khoja Ahmed Yasawi", "Мавзолей Ходжи Ахмеда Ясави", "Қожа Ахмет Ясауи кесенесі"),
    name: "Mausoleum of Khoja Ahmed Yasawi",
    author: "Khoja Ahmed Yasawi",
    regionId: "turkistan",
    region: tr("Turkistan region", "Туркестанская область", "Түркістан облысы"),
    city: tr("Turkistan", "Туркестан", "Түркістан"),
    category: "spiritual",
    type: tr("Spiritual-literary heritage", "Духовно-литературное наследие", "Рухани-әдеби мұра"),
    coordinates: { lat: 43.2977, lng: 68.2719 },
    shortDescription: tr(
      "A UNESCO landmark tied to Turkic Sufi poetry, hikmet, and pilgrimage memory.",
      "Памятник ЮНЕСКО, связанный с тюркской суфийской поэзией, хикметами и памятью паломничества.",
      "Түркі сопылық поэзиясы, хикметтер және зиярат жадымен байланысты ЮНЕСКО ескерткіші."
    ),
    fullDescription: tr(
      "The Yasawi mausoleum places Kazakh literature beside older Turkic spiritual vocabulary, oral devotion, pilgrimage, ethics, and the poetic form of hikmet.",
      "Мавзолей Ясави ставит казахскую литературу рядом с древним тюркским духовным словарем, устным почитанием, паломничеством, этикой и формой хикмета.",
      "Ясауи кесенесі қазақ әдебиетін көне түркі рухани сөздігімен, ауызша құрметпен, зияратпен, әдеппен және хикмет поэтикасымен байланыстырады."
    ),
    significance: {
      en: "The mausoleum extends the map toward older Turkic spiritual literature. It connects pilgrimage, ethics, oral devotion, and the poetic form of hikmet.",
    },
    relatedAuthors: [authors.yasawi],
    relatedWorks: [],
    routeLinks: [routes.oral, routes.ethics],
    imageUrl: commonsImage("Mausoleum of Khoja Ahmed Yasawi (7519829678).jpg"),
    imageAlt: tr("Mausoleum of Khoja Ahmed Yasawi in Turkistan", "Мавзолей Ходжи Ахмеда Ясави в Туркестане", "Түркістандағы Қожа Ахмет Ясауи кесенесі"),
    imageCredit: "Wikimedia Commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Mausoleum_of_Khoja_Ahmed_Yasawi_(7519829678).jpg",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=43.2977,68.2719",
  },
];

export const mapBounds = {
  minYear: 1100,
  maxYear: 2026,
  defaultYear: 2026,
};
