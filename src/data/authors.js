import archiveAuthors from "../assets/mura/portal-authors.jpg";
import archiveRoutes from "../assets/mura/collection-routes.jpg";
import bookAbai from "../assets/mura/book-abai.svg";
import manuscriptImage from "../assets/mura/abai-manuscript-bg.svg";

const commonsFile = (fileName, width = 900) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(fileName)}?width=${width}`;

const commonsSource = (fileName) =>
  `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(fileName.replaceAll(" ", "_"))}`;

const escapeSvgText = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const createFallbackPortrait = (initials, name, accent = "#b78a45") => {
  const safeInitials = escapeSvgText(initials);
  const safeName = escapeSvgText(name);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1200" viewBox="0 0 900 1200">
  <defs>
    <linearGradient id="paper" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#efe2c7"/>
      <stop offset="0.58" stop-color="#bfa678"/>
      <stop offset="1" stop-color="#173f35"/>
    </linearGradient>
    <radialGradient id="light" cx="47%" cy="31%" r="62%">
      <stop offset="0" stop-color="#fff7dc" stop-opacity="0.72"/>
      <stop offset="1" stop-color="#1f392f" stop-opacity="0"/>
    </radialGradient>
    <filter id="grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.78" numOctaves="4" stitchTiles="stitch"/>
      <feColorMatrix type="saturate" values="0"/>
      <feComponentTransfer>
        <feFuncA type="table" tableValues="0 0.12"/>
      </feComponentTransfer>
    </filter>
  </defs>
  <rect width="900" height="1200" fill="url(#paper)"/>
  <rect width="900" height="1200" fill="url(#light)"/>
  <path d="M116 192h668M116 1008h668" stroke="${accent}" stroke-width="4" opacity="0.56"/>
  <path d="M151 236c120-34 239-45 357-33 93 10 174 32 241 67" fill="none" stroke="#f4e3bf" stroke-width="3" opacity="0.34"/>
  <path d="M146 934c118 35 237 47 358 35 96-10 179-34 250-71" fill="none" stroke="#102f29" stroke-width="5" opacity="0.24"/>
  <path d="M262 444h376c22 0 40 18 40 40v264c0 22-18 40-40 40H262c-22 0-40-18-40-40V484c0-22 18-40 40-40z" fill="#173f35" opacity="0.58"/>
  <path d="M262 444h376c22 0 40 18 40 40v38H222v-38c0-22 18-40 40-40z" fill="${accent}" opacity="0.74"/>
  <path d="M278 556h344M278 620h284M278 684h318" stroke="#f3e4c0" stroke-width="10" stroke-linecap="round" opacity="0.28"/>
  <path d="M224 830c139 58 306 66 502 7" fill="none" stroke="${accent}" stroke-width="13" opacity="0.44"/>
  <text x="450" y="374" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="160" fill="#f3e4c0" opacity="0.92">${safeInitials}</text>
  <text x="450" y="1074" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="29" letter-spacing="4" fill="#f7e9c8" opacity="0.84">${safeName}</text>
  <rect width="900" height="1200" fill="#000" opacity="0.08" filter="url(#grain)"/>
</svg>`;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

const portraitAlt = (en, ru, kk) => ({ en, ru, kk });

const localPlaceholderCredit = "MURA neutral archival placeholder, no likeness claimed";

const authorPortraits = {
  abai: {
    portrait: commonsFile("Abai Kunanbaev.jpg"),
    portraitAlt: portraitAlt(
      "Archival portrait of Abai Kunanbayev",
      "Архивный портрет Абая Кунанбаева",
      "Абай Құнанбайұлының архивтік портреті"
    ),
    portraitCredit: "Wikimedia Commons, public domain archival portrait",
    portraitSource: commonsSource("Abai Kunanbaev.jpg"),
    fallbackPortrait: createFallbackPortrait("AK", "ABAI KUNANBAYEV", "#d2a457"),
    portraitPosition: "center 28%",
  },
  auezov: {
    portrait: commonsFile("Auezov Mukhtar.jpg", 700),
    portraitAlt: portraitAlt(
      "Archival portrait of Mukhtar Auezov",
      "Архивный портрет Мухтара Ауэзова",
      "Мұхтар Әуезовтің архивтік портреті"
    ),
    portraitCredit: "Wikimedia Commons, Great Soviet Encyclopedia archival portrait, public domain",
    portraitSource: commonsSource("Auezov Mukhtar.jpg"),
    fallbackPortrait: createFallbackPortrait("MA", "MUKHTAR AUEZOV", "#c99a54"),
    portraitPosition: "center 32%",
  },
  seifullin: {
    portrait: commonsFile("Saken Seifullin.jpg"),
    portraitAlt: portraitAlt(
      "Archival portrait of Saken Seifullin",
      "Архивный портрет Сакена Сейфуллина",
      "Сәкен Сейфуллиннің архивтік портреті"
    ),
    portraitCredit: "Wikimedia Commons, archival portrait",
    portraitSource: commonsSource("Saken Seifullin.jpg"),
    fallbackPortrait: createFallbackPortrait("SS", "SAKEN SEIFULLIN", "#b48642"),
    portraitPosition: "center 24%",
  },
  zhumabayev: {
    portrait: createFallbackPortrait("MZ", "MAGZHAN ZHUMABAYEV", "#ba8d50"),
    portraitAlt: portraitAlt(
      "Neutral MURA archival placeholder for Magzhan Zhumabayev",
      "Нейтральный архивный placeholder MURA для Магжана Жумабаева",
      "Мағжан Жұмабаевқа арналған бейтарап MURA архивтік placeholder"
    ),
    portraitCredit: localPlaceholderCredit,
    portraitSource: "local:mura-placeholder/magzhan-zhumabayev",
    fallbackPortrait: createFallbackPortrait("MZ", "MAGZHAN ZHUMABAYEV", "#ba8d50"),
    portraitPosition: "center",
  },
  zhansugurov: {
    portrait: commonsFile("Ilyas Jansügirov portrait at Almaty Central State Museum of Kazakhstan.jpg"),
    portraitAlt: portraitAlt(
      "Museum portrait of Ilyas Zhansugurov",
      "Музейный портрет Ильяса Жансугурова",
      "Ілияс Жансүгіровтің музейлік портреті"
    ),
    portraitCredit: "Wikimedia Commons, Almaty Central State Museum of Kazakhstan",
    portraitSource: commonsSource("Ilyas Jansügirov portrait at Almaty Central State Museum of Kazakhstan.jpg"),
    fallbackPortrait: createFallbackPortrait("IZ", "ILYAS ZHANSUGUROV", "#c09a5a"),
    portraitPosition: "center 26%",
  },
  baitursynuly: {
    portrait: commonsFile("Ахмет Байтурсынов.jpg", 900),
    portraitAlt: portraitAlt(
      "Archival portrait of Akhmet Baitursynuly",
      "Архивный портрет Ахмета Байтурсынулы",
      "Ахмет Байтұрсынұлының архивтік портреті"
    ),
    portraitCredit: "Wikimedia Commons, archival portrait, CC BY-SA 4.0",
    portraitSource: commonsSource("Ахмет Байтурсынов.jpg"),
    fallbackPortrait: createFallbackPortrait("AB", "AKHMET BAITURSYNULY", "#bc8c45"),
    portraitPosition: "center 24%",
  },
  shakarim: {
    portrait: commonsFile("Shakarim Qudayberdiuly, reworked, circa 1905.jpg"),
    portraitAlt: portraitAlt(
      "Reworked archival portrait of Shakarim Kudaiberdiuly",
      "Архивный портрет Шакарима Кудайбердиева",
      "Шәкәрім Құдайбердіұлының архивтік портреті"
    ),
    portraitCredit: "Wikimedia Commons, reworked archival portrait circa 1905",
    portraitSource: commonsSource("Shakarim Qudayberdiuly, reworked, circa 1905.jpg"),
    fallbackPortrait: createFallbackPortrait("SK", "SHAKARIM KUDAIBERDIULY", "#b8874c"),
    portraitPosition: "center 22%",
  },
  makatayev: {
    portrait: createFallbackPortrait("MM", "MUKAGALI MAKATAYEV", "#c28b4b"),
    portraitAlt: portraitAlt(
      "Neutral MURA archival placeholder for Mukagali Makatayev",
      "Нейтральный архивный placeholder MURA для Мукагали Макатаева",
      "Мұқағали Мақатаевқа арналған бейтарап MURA архивтік placeholder"
    ),
    portraitCredit: localPlaceholderCredit,
    portraitSource: "local:mura-placeholder/mukagali-makatayev",
    fallbackPortrait: createFallbackPortrait("MM", "MUKAGALI MAKATAYEV", "#c28b4b"),
    portraitPosition: "center",
  },
  zhambyl: {
    portrait: commonsFile("Zhambyl Zhabayuly and Mikhail Kalinin.jpg", 900),
    portraitAlt: portraitAlt(
      "Archival photograph of Zhambyl Zhabayev",
      "Архивная фотография Жамбыла Жабаева",
      "Жамбыл Жабаевтың архивтік фотосуреті"
    ),
    portraitCredit: "Wikimedia Commons, archival photograph",
    portraitSource: commonsSource("Zhambyl Zhabayuly and Mikhail Kalinin.jpg"),
    fallbackPortrait: createFallbackPortrait("ZZ", "ZHAMBYL ZHABAYEV", "#b99555"),
    portraitPosition: "36% 26%",
  },
  dulatuly: {
    portrait: commonsFile("Mirjaqip Dulatov portrait at Almaty Central State Museum of Kazakhstan.jpg"),
    portraitAlt: portraitAlt(
      "Museum portrait of Mirzhakyp Dulatuly",
      "Музейный портрет Миржакипа Дулатова",
      "Міржақып Дулатұлының музейлік портреті"
    ),
    portraitCredit: "Wikimedia Commons, Almaty Central State Museum of Kazakhstan",
    portraitSource: commonsSource("Mirjaqip Dulatov portrait at Almaty Central State Museum of Kazakhstan.jpg"),
    fallbackPortrait: createFallbackPortrait("MD", "MIRZHAKYP DULATULY", "#c19a58"),
    portraitPosition: "center 26%",
  },
  mailin: {
    portrait: createFallbackPortrait("BM", "BEIMBET MAILIN", "#b9844a"),
    portraitAlt: portraitAlt(
      "Neutral MURA archival placeholder for Beimbet Mailin",
      "Нейтральный архивный placeholder MURA для Беимбета Майлина",
      "Бейімбет Майлинге арналған бейтарап MURA архивтік placeholder"
    ),
    portraitCredit: localPlaceholderCredit,
    portraitSource: "local:mura-placeholder/beimbet-mailin",
    fallbackPortrait: createFallbackPortrait("BM", "BEIMBET MAILIN", "#b9844a"),
    portraitPosition: "center",
  },
  musrepov: {
    portrait: createFallbackPortrait("GM", "GABIT MUSREPOV", "#c1904e"),
    portraitAlt: portraitAlt(
      "Neutral MURA archival placeholder for Gabit Musrepov",
      "Нейтральный архивный placeholder MURA для Габита Мусрепова",
      "Ғабит Мүсіреповке арналған бейтарап MURA архивтік placeholder"
    ),
    portraitCredit: localPlaceholderCredit,
    portraitSource: "local:mura-placeholder/gabit-musrepov",
    fallbackPortrait: createFallbackPortrait("GM", "GABIT MUSREPOV", "#c1904e"),
    portraitPosition: "center",
  },
  suleimenov: {
    portrait: commonsFile("Oljas Suleymenov.jpg"),
    portraitAlt: portraitAlt(
      "Black-and-white portrait of Olzhas Suleimenov",
      "Черно-белый портрет Олжаса Сулейменова",
      "Олжас Сүлейменовтің ақ-қара портреті"
    ),
    portraitCredit: "Wikimedia Commons, Igor Meandrov, CC BY 2.0",
    portraitSource: commonsSource("Oljas Suleymenov.jpg"),
    fallbackPortrait: createFallbackPortrait("OS", "OLZHAS SULEIMENOV", "#ad8b55"),
    portraitPosition: "center 28%",
  },
  ongarsynova: {
    portrait: createFallbackPortrait("FO", "FARIZA ONGARSYNOVA", "#b98a58"),
    portraitAlt: portraitAlt(
      "Neutral MURA archival placeholder for Fariza Ongarsynova",
      "Нейтральный архивный placeholder MURA для Фаризы Онгарсыновой",
      "Фариза Оңғарсыноваға арналған бейтарап MURA архивтік placeholder"
    ),
    portraitCredit: localPlaceholderCredit,
    portraitSource: "local:mura-placeholder/fariza-ongarsynova",
    fallbackPortrait: createFallbackPortrait("FO", "FARIZA ONGARSYNOVA", "#b98a58"),
    portraitPosition: "center",
  },
};

export const authors = [
  {
    name: "Abai Kunanbayev",
    slug: "abai-kunanbayev",
    ...authorPortraits.abai,
    image: authorPortraits.abai.portrait,
    period: "Kazakh Enlightenment · XIX century",
    years: "1845-1904",
    birthplace: "Semey region, Shyngystau",
    roles: ["Poet", "Philosopher", "Composer", "Educator"],
    description:
      "Poet, philosopher, composer, and reformer whose words shaped Kazakh moral and intellectual culture.",
    biography:
      "Abai Kunanbayev renewed Kazakh written literature by joining oral poetic tradition with philosophical reflection, education, music, and civic responsibility. His prose and poetry ask how a person should learn, act, speak, and serve society.",
    keyIdeas: ["Knowledge", "Conscience", "Moral responsibility", "Education", "Cultural renewal"],
    legacy:
      "Abai is treated as a central figure of Kazakh enlightenment and a foundation for modern Kazakh literary thought.",
    mainWorks: ["Book of Words", "Selected poems", "Songs and translations"],
    sourceHint: "Adebiportal, Abai literary archive, public educational materials",
    profile: {
      en: {
        name: "Abai Kunanbayev",
        years: "1845-1904",
        shortDescription:
          "Great Kazakh poet, philosopher, thinker, educator, composer, and founder of modern written Kazakh literature.",
        fullBiography: [
          "Abai Kunanbayev was born in the Shyngystau region into the family of Kunanbay Uskenbayuly, a powerful bi and public figure. His early life joined the living oral tradition of the steppe with strict expectations of responsibility, judgment, and service.",
          "He studied first in a traditional environment and then in a madrasa, where he encountered Arabic, Persian, and Eastern literary culture. Later he expanded his intellectual world through Russian and European literature, reading Pushkin, Lermontov, Krylov, and philosophical prose.",
          "Abai's mature work created a new intellectual language for Kazakh literature. His poems, songs, translations, and the Book of Words speak about knowledge, labor, conscience, faith, justice, and the moral renewal of society.",
        ],
        quote:
          "A person resembles this world: the more you know, the more strongly you feel your responsibility.",
        metadata: [
          {
            label: "Born",
            value: "10 August 1845",
            detail: "Shyngystau mountains, Semey region",
            icon: "calendar",
          },
          {
            label: "Activity",
            value: "Poet, prose writer, translator",
            detail: "Philosopher, composer, educator",
            icon: "feather",
          },
          {
            label: "Epoch",
            value: "XIX century",
            detail: "Second half",
            icon: "globe",
          },
          {
            label: "Language of work",
            value: "Kazakh",
            detail: "Turkic literary tradition",
            icon: "book",
          },
        ],
        tabs: {
          overview: "Overview",
          biography: "Biography",
          works: "Works",
          quotes: "Quotes",
          research: "Articles and research",
          facts: "Facts",
        },
        labels: {
          authors: "Authors",
          save: "Save",
          saved: "Saved",
          share: "Share",
          copied: "Link copied",
          shortBio: "Short biography",
          keyThemes: "Key themes",
          cultureContribution: "Contribution to culture",
          interestingFact: "Interesting fact",
          majorWorks: "Major works",
          viewAll: "View all",
          readFullBio: "Read full biography",
          readAbai: "Read Abai's works",
          readAbaiText: "Enter the wisdom of the great thinker and poet.",
          allWorks: "All works",
          openWork: "Open work",
          unavailable: "Available in works catalog",
          articlesIntro: "Curated materials that help read Abai through history, philosophy, and literary memory.",
        },
        timeline: [
          { year: "1845", text: "Born in the family of Kunanbay Uskenbayuly." },
          { year: "1850-1860", text: "Received traditional education and studied Eastern literature." },
          { year: "1860-1880", text: "Expanded his knowledge through Russian and European literature." },
          { year: "1880-1904", text: "Created major poems, translations, songs, and philosophical prose." },
          { year: "1904", text: "Passed away in the Semipalatinsk region." },
        ],
        keyThemes: [
          "Human and society",
          "Morality",
          "Knowledge and enlightenment",
          "Labor and idleness",
          "Love and compassion",
          "Faith and reason",
          "Justice",
          "Self-knowledge",
        ],
        cultureContribution:
          "Abai laid a foundation for the Kazakh intellectual tradition, joining Eastern wisdom with Western thought. His work deeply influenced literature, language, education, and national self-awareness.",
        interestingFact:
          "Abai was not only a poet, but also a composer. More than twenty songs are traditionally associated with his name and are still performed today.",
        quotes: [
          "The one who does not seek knowledge cannot understand the value of the human path.",
          "Labor, reason, and a warm heart must act together.",
          "A word becomes alive when it awakens conscience in the reader.",
        ],
        works: [
          {
            workId: "abai-words",
            title: "The Book of Words",
            subtitle: "Philosophical prose",
            years: "1890-1904",
            genre: "Philosophical prose",
            image: bookAbai,
          },
          {
            workId: "auezov-abai-path",
            title: "The Path of Abai",
            subtitle: "Epic novel about Abai",
            years: "1942-1956",
            genre: "Novel-epic",
            image: archiveAuthors,
          },
          {
            title: "Poems",
            subtitle: "Poetry",
            years: "1870-1904",
            genre: "Poetry",
            href: "/works",
            image: archiveRoutes,
          },
          {
            title: "Translations",
            subtitle: "Pushkin, Lermontov, Krylov",
            years: "1870-1904",
            genre: "Translations",
            href: "/works",
            image: manuscriptImage,
          },
        ],
        research: [
          {
            title: "Abai and Kazakh enlightenment",
            text: "How Abai linked education with conscience and public responsibility.",
            href: "/route/abai-path",
          },
          {
            title: "Reading the Book of Words",
            text: "A guided entry into Abai's prose, themes, and difficult concepts.",
            href: "/reading/abai-words",
          },
          {
            title: "Abai in literary memory",
            text: "The image of Abai in later Kazakh prose and cultural imagination.",
            href: "/reading/auezov-abai-path",
          },
        ],
        facts: [
          "Abai translated works by Pushkin, Lermontov, Krylov, and other authors into Kazakh cultural language.",
          "His songs combine poetic text, philosophical feeling, and musical form.",
          "The Book of Words is read today as literature, moral philosophy, and cultural self-reflection.",
        ],
      },
      ru: {
        name: "Абай Кунанбаев",
        years: "1845-1904",
        shortDescription:
          "Великий казахский поэт, философ, мыслитель, просветитель и основоположник новой письменной казахской литературы.",
        fullBiography: [
          "Абай Кунанбаев родился в урочище Шынгыстау в семье Кунанбая Ускенбайулы - влиятельного бия и общественного деятеля. Ранние годы Абая соединили живую устную культуру степи с представлением о долге, ответственности и справедливом слове.",
          "Он получил традиционное образование, учился в медресе, познакомился с арабской, персидской и восточной литературой. Позднее Абай расширил круг чтения через русскую и европейскую культуру, обращаясь к Пушкину, Лермонтову, Крылову и философской прозе.",
          "В зрелые годы Абай создал новый интеллектуальный язык казахской литературы. Его стихи, песни, переводы и Книга слов говорят о знании, труде, совести, вере, справедливости и нравственном обновлении общества.",
        ],
        quote:
          "Человек подобен этому миру: чем больше познаешь, тем сильнее чувствуешь свою ответственность.",
        metadata: [
          {
            label: "Родился",
            value: "10 августа 1845",
            detail: "Шынгыстау, Семипалатинская область",
            icon: "calendar",
          },
          {
            label: "Деятельность",
            value: "Поэт, прозаик, переводчик",
            detail: "Философ, композитор, просветитель",
            icon: "feather",
          },
          {
            label: "Эпоха",
            value: "XIX век",
            detail: "Вторая половина",
            icon: "globe",
          },
          {
            label: "Язык творчества",
            value: "Казахский",
            detail: "Тюркская литературная традиция",
            icon: "book",
          },
        ],
        tabs: {
          overview: "Обзор",
          biography: "Биография",
          works: "Произведения",
          quotes: "Цитаты",
          research: "Статьи и исследования",
          facts: "Факты",
        },
        labels: {
          authors: "Авторы",
          save: "Сохранить",
          saved: "Сохранено",
          share: "Поделиться",
          copied: "Ссылка скопирована",
          shortBio: "Краткая биография",
          keyThemes: "Ключевые темы",
          cultureContribution: "Вклад в культуру",
          interestingFact: "Интересный факт",
          majorWorks: "Основные произведения",
          viewAll: "Смотреть все",
          readFullBio: "Читать полную биографию",
          readAbai: "Читайте произведения Абая",
          readAbaiText: "Погрузитесь в мудрость великого мыслителя и поэта.",
          allWorks: "Все произведения",
          openWork: "Открыть произведение",
          unavailable: "Доступно в каталоге произведений",
          articlesIntro: "Материалы, которые помогают читать Абая через историю, философию и литературную память.",
        },
        timeline: [
          { year: "1845", text: "Родился в семье известного бия Кунанбая Ускенбайулы." },
          { year: "1850-1860", text: "Получил традиционное образование, изучал восточную литературу." },
          { year: "1860-1880", text: "Расширил знания через русскую культуру и европейскую литературу." },
          { year: "1880-1904", text: "Создал главные произведения, переводы и философские трактаты." },
          { year: "1904", text: "Ушел из жизни в Семипалатинской области." },
        ],
        keyThemes: [
          "Человек и общество",
          "Нравственность",
          "Знание и просвещение",
          "Труд и лень",
          "Любовь и сострадание",
          "Вера и разум",
          "Справедливость",
          "Самопознание",
        ],
        cultureContribution:
          "Абай заложил основы казахской интеллектуальной традиции, соединив восточную мудрость и западную мысль. Его творчество оказало огромное влияние на развитие литературы, языка и национального самосознания.",
        interestingFact:
          "Абай был не только поэтом, но и композитором. С его именем связывают более двадцати песен, которые исполняются и сегодня.",
        quotes: [
          "Тот, кто не стремится к знанию, не поймет ценности человеческого пути.",
          "Труд, разум и горячее сердце должны действовать вместе.",
          "Слово становится живым, когда пробуждает совесть читателя.",
        ],
        works: [
          {
            workId: "abai-words",
            title: "Слова назидания",
            subtitle: "Қара сөздер",
            years: "1890-1904",
            genre: "Философская проза",
            image: bookAbai,
          },
          {
            workId: "auezov-abai-path",
            title: "Путь Абая",
            subtitle: "Абай жолы",
            years: "1942-1956",
            genre: "Роман-эпопея",
            image: archiveAuthors,
          },
          {
            title: "Стихотворения",
            subtitle: "Өлеңдер",
            years: "1870-1904",
            genre: "Поэзия",
            href: "/works",
            image: archiveRoutes,
          },
          {
            title: "Переводы",
            subtitle: "Пушкин, Лермонтов, Крылов",
            years: "1870-1904",
            genre: "Переводы",
            href: "/works",
            image: manuscriptImage,
          },
        ],
        research: [
          {
            title: "Абай и казахское просвещение",
            text: "Как Абай связал образование, совесть и общественную ответственность.",
            href: "/route/abai-path",
          },
          {
            title: "Чтение Книги слов",
            text: "Маршрут к прозе Абая, ее темам и сложным понятиям.",
            href: "/reading/abai-words",
          },
          {
            title: "Абай в литературной памяти",
            text: "Образ Абая в поздней казахской прозе и культурном воображении.",
            href: "/reading/auezov-abai-path",
          },
        ],
        facts: [
          "Абай переводил Пушкина, Лермонтова, Крылова и других авторов на язык казахской культуры.",
          "Его песни соединяют поэтический текст, философское чувство и музыкальную форму.",
          "Книга слов сегодня читается как литература, нравственная философия и культурное самопознание.",
        ],
      },
      kk: {
        name: "Абай Құнанбайұлы",
        years: "1845-1904",
        shortDescription:
          "Қазақтың ұлы ақыны, ойшылы, ағартушысы, композиторы және жаңа жазба әдебиеттің негізін қалаушы.",
        fullBiography: [
          "Абай Құнанбайұлы Шыңғыстау өңірінде, Құнанбай Өскенбайұлының отбасында дүниеге келді. Оның балалық шағы даладағы ауызша дәстүрмен, билік сөздің жауапкершілігімен және әділет ұғымымен тығыз байланысты болды.",
          "Алғашқы білімін дәстүрлі ортада алып, кейін медреседе оқыды. Абай араб, парсы және шығыс әдебиетін таныды, ал кейін орыс және еуропалық әдебиет арқылы ой-өрісін кеңейтті.",
          "Кемел шағында Абай қазақ әдебиетінің жаңа интеллектуалдық тілін қалыптастырды. Оның өлеңдері, әндері, аудармалары және Қара сөздері білім, еңбек, ар, иман, әділет және қоғамның рухани жаңаруы туралы ой қозғайды.",
        ],
        quote:
          "Адам осы әлемге ұқсайды: неғұрлым көп таныған сайын, жауапкершілігіңді соғұрлым терең сезінесің.",
        metadata: [
          {
            label: "Туған жылы",
            value: "1845 жылғы 10 тамыз",
            detail: "Шыңғыстау, Семей өңірі",
            icon: "calendar",
          },
          {
            label: "Қызметі",
            value: "Ақын, прозаик, аудармашы",
            detail: "Ойшыл, композитор, ағартушы",
            icon: "feather",
          },
          {
            label: "Дәуірі",
            value: "XIX ғасыр",
            detail: "Екінші жартысы",
            icon: "globe",
          },
          {
            label: "Шығармашылық тілі",
            value: "Қазақ тілі",
            detail: "Түркі әдеби дәстүрі",
            icon: "book",
          },
        ],
        tabs: {
          overview: "Шолу",
          biography: "Өмірбаян",
          works: "Шығармалар",
          quotes: "Дәйексөздер",
          research: "Мақалалар мен зерттеулер",
          facts: "Деректер",
        },
        labels: {
          authors: "Авторлар",
          save: "Сақтау",
          saved: "Сақталды",
          share: "Бөлісу",
          copied: "Сілтеме көшірілді",
          shortBio: "Қысқаша өмірбаян",
          keyThemes: "Негізгі тақырыптар",
          cultureContribution: "Мәдениетке қосқан үлесі",
          interestingFact: "Қызықты дерек",
          majorWorks: "Негізгі шығармалар",
          viewAll: "Барлығын көру",
          readFullBio: "Толық өмірбаянды оқу",
          readAbai: "Абай шығармаларын оқыңыз",
          readAbaiText: "Ұлы ойшыл әрі ақынның даналығына бойлаңыз.",
          allWorks: "Барлық шығармалар",
          openWork: "Шығарманы ашу",
          unavailable: "Шығармалар каталогында қолжетімді",
          articlesIntro: "Абайды тарих, философия және әдеби жады арқылы оқуға көмектесетін материалдар.",
        },
        timeline: [
          { year: "1845", text: "Құнанбай Өскенбайұлының отбасында дүниеге келді." },
          { year: "1850-1860", text: "Дәстүрлі білім алып, шығыс әдебиетін үйренді." },
          { year: "1860-1880", text: "Орыс мәдениеті және еуропалық әдебиет арқылы білімін кеңейтті." },
          { year: "1880-1904", text: "Басты шығармаларын, аудармаларын және философиялық қара сөздерін жазды." },
          { year: "1904", text: "Семей өңірінде өмірден өтті." },
        ],
        keyThemes: [
          "Адам және қоғам",
          "Адамгершілік",
          "Білім және ағарту",
          "Еңбек пен жалқаулық",
          "Махаббат пен мейірім",
          "Иман және ақыл",
          "Әділет",
          "Өзін-өзі тану",
        ],
        cultureContribution:
          "Абай шығыс даналығы мен батыс ойларын тоғыстырып, қазақ интеллектуалдық дәстүрінің негізін нығайтты. Оның шығармашылығы әдебиетке, тілге және ұлттық санаға терең ықпал етті.",
        interestingFact:
          "Абай ақын ғана емес, композитор да болған. Оның атымен байланысты жиырмадан астам ән бүгінге дейін орындалады.",
        quotes: [
          "Білімге ұмтылмаған адам адамдық жолдың қадірін түсінбейді.",
          "Еңбек, ақыл және жылы жүрек бірге қызмет етуі керек.",
          "Сөз оқырманның арын оятқанда ғана тірі болады.",
        ],
        works: [
          {
            workId: "abai-words",
            title: "Қара сөздер",
            subtitle: "Слова назидания",
            years: "1890-1904",
            genre: "Философиялық проза",
            image: bookAbai,
          },
          {
            workId: "auezov-abai-path",
            title: "Абай жолы",
            subtitle: "Путь Абая",
            years: "1942-1956",
            genre: "Роман-эпопея",
            image: archiveAuthors,
          },
          {
            title: "Өлеңдер",
            subtitle: "Стихотворения",
            years: "1870-1904",
            genre: "Поэзия",
            href: "/works",
            image: archiveRoutes,
          },
          {
            title: "Аудармалар",
            subtitle: "Пушкин, Лермонтов, Крылов",
            years: "1870-1904",
            genre: "Аудармалар",
            href: "/works",
            image: manuscriptImage,
          },
        ],
        research: [
          {
            title: "Абай және қазақ ағартушылығы",
            text: "Абай білімді ар-ұждан және қоғамдық жауапкершілікпен қалай байланыстырды.",
            href: "/route/abai-path",
          },
          {
            title: "Қара сөздерді оқу",
            text: "Абай прозасына, тақырыптарына және күрделі ұғымдарына бағытталған оқу.",
            href: "/reading/abai-words",
          },
          {
            title: "Абай әдеби жадыда",
            text: "Кейінгі қазақ прозасындағы және мәдени қиялдағы Абай бейнесі.",
            href: "/reading/auezov-abai-path",
          },
        ],
        facts: [
          "Абай Пушкин, Лермонтов, Крылов және басқа авторларды қазақ мәдени тіліне аударды.",
          "Оның әндері поэтикалық сөзді, философиялық сезімді және музыкалық пішінді біріктіреді.",
          "Қара сөздер бүгін әдебиет, моральдық философия және мәдени өзін-өзі тану ретінде оқылады.",
        ],
      },
    },
    workDetail: {
      en: {
        name: "Abai Kunanbayev",
        role: "Poet, philosopher, composer, educator",
        shortBio:
          "Abai renewed Kazakh written literature by joining oral poetry, philosophy, music, and civic responsibility.",
        culturalImportance:
          "He is a central voice of Kazakh enlightenment and one of the foundations of modern Kazakh literary thought.",
        connectionToWork:
          "The Book of Words gathers Abai's reflections on conscience, knowledge, labor, faith, and the moral renewal of society.",
      },
      ru: {
        name: "Абай Кунанбаев",
        role: "Поэт, философ, композитор, просветитель",
        shortBio:
          "Абай обновил казахскую письменную литературу, соединив устную поэзию, философию, музыку и гражданскую ответственность.",
        culturalImportance:
          "Он является центральной фигурой казахского просвещения и основой современной казахской литературной мысли.",
        connectionToWork:
          "Книга слов объединяет размышления Абая о совести, знании, труде, вере и нравственном обновлении общества.",
      },
      kk: {
        name: "Абай Құнанбайұлы",
        role: "Ақын, ойшыл, композитор, ағартушы",
        shortBio:
          "Абай ауызша поэзияны, философиялық ойды, музыканы және азаматтық жауапкершілікті ұштастырып, қазақ жазба әдебиетін жаңартты.",
        culturalImportance:
          "Ол қазақ ағартушылығының өзекті тұлғасы және қазіргі қазақ әдеби ойының негіздерінің бірі.",
        connectionToWork:
          "Қара сөздер Абайдың ар, білім, еңбек, иман және қоғамның рухани жаңаруы туралы ойларын жинақтайды.",
      },
    },
  },
  {
    name: "Mukhtar Auezov",
    ...authorPortraits.auezov,
    image: authorPortraits.auezov.portrait,
    period: "Soviet Kazakh literature · XX century",
    years: "1897-1961",
    birthplace: "Semey region",
    roles: ["Novelist", "Playwright", "Scholar", "Literary historian"],
    description:
      "Novelist, playwright, and scholar best known for The Path of Abai and the literary memory of the steppe.",
    biography:
      "Mukhtar Auezov transformed the life and world of Abai into a major epic of Kazakh prose. His writing connects biography, social change, folklore, drama, and the formation of national cultural memory.",
    keyIdeas: ["National memory", "Historical prose", "Folklore", "Social change", "Human dignity"],
    legacy:
      "Auezov helped define the Kazakh historical novel and remains one of the most important interpreters of Abai's legacy.",
    mainWorks: ["The Path of Abai", "Enlik-Kebek", "Kokserek"],
    sourceHint: "Adebiportal, Mukhtar Auezov museum materials",
  },
  {
    name: "Saken Seifullin",
    ...authorPortraits.seifullin,
    image: authorPortraits.seifullin.portrait,
    period: "Alash and Soviet transition · XX century",
    years: "1894-1938",
    birthplace: "Akmola region",
    roles: ["Poet", "Writer", "Public figure", "Playwright"],
    description:
      "Poet, writer, and public figure whose work connected revolution, memory, and the future of Kazakh letters.",
    biography:
      "Saken Seifullin wrote poetry, prose, drama, and memoirs during a period of political transformation. His work records hope, danger, public duty, and the cost of history.",
    keyIdeas: ["Freedom", "Civic duty", "Memory", "Historical transformation", "Public voice"],
    legacy:
      "Seifullin is remembered as a key figure of early Soviet Kazakh literature and as a writer whose life became part of cultural memory.",
    mainWorks: ["Thorny Path", "Kokshetau", "Poetry and plays"],
    sourceHint: "Adebiportal, Saken Seifullin museum materials",
  },
  {
    name: "Magzhan Zhumabayev",
    ...authorPortraits.zhumabayev,
    image: authorPortraits.zhumabayev.portrait,
    period: "Alash poetry · XX century",
    years: "1893-1938",
    birthplace: "North Kazakhstan region",
    roles: ["Poet", "Teacher", "Translator", "Alash intellectual"],
    description:
      "Lyric poet of freedom, language, and national feeling, remembered for musical imagery and spiritual intensity.",
    biography:
      "Magzhan Zhumabayev brought musical language, symbolic imagery, and emotional intensity into Kazakh poetry. His poems often join love, homeland, freedom, and historical memory.",
    keyIdeas: ["Freedom", "Language", "National feeling", "Beauty", "Memory"],
    legacy:
      "Zhumabayev is one of the most powerful lyric voices of Kazakh literature and a major figure of the Alash generation.",
    mainWorks: ["Batyr Bayan", "Sholpan", "Selected poems"],
    sourceHint: "Adebiportal, Alash literary studies",
  },
  {
    name: "Ilyas Zhansugurov",
    ...authorPortraits.zhansugurov,
    image: authorPortraits.zhansugurov.portrait,
    period: "Soviet Kazakh poetry · XX century",
    years: "1894-1938",
    birthplace: "Jetisu region",
    roles: ["Poet", "Dramatist", "Translator", "Journalist"],
    description:
      "Poet and dramatist whose works celebrate music, landscape, dignity, and the cultural rhythm of the steppe.",
    biography:
      "Ilyas Zhansugurov wrote with a strong sense of rhythm, landscape, and artistic destiny. His poem Kulager turns a horse and song into symbols of beauty, talent, envy, and tragedy.",
    keyIdeas: ["Art", "Landscape", "Memory", "Talent", "Tragedy"],
    legacy:
      "Zhansugurov is a classic voice of Kazakh poetry whose work preserves the sound and image of the steppe.",
    mainWorks: ["Kulager", "The Steppe", "Poems and dramas"],
    sourceHint: "Adebiportal, Kazakh literary history",
  },
  {
    name: "Akhmet Baitursynuly",
    ...authorPortraits.baitursynuly,
    image: authorPortraits.baitursynuly.portrait,
    period: "Alash enlightenment · XX century",
    years: "1872-1937",
    birthplace: "Torgai region",
    roles: ["Educator", "Linguist", "Poet", "Reformer"],
    description:
      "Educator, linguist, poet, and reformer who strengthened Kazakh language, literacy, and cultural self-awareness.",
    biography:
      "Akhmet Baitursynuly connected literature with language reform, education, and national awakening. His poetry and essays treat the word as a tool of civic responsibility.",
    keyIdeas: ["Language", "Education", "Literacy", "Freedom", "Responsibility"],
    legacy:
      "Baitursynuly is central to Kazakh language reform and Alash intellectual history.",
    mainWorks: ["Masa", "Forty Fables", "Language studies"],
    sourceHint: "Adebiportal, Alash studies, language history materials",
  },
  {
    name: "Shakarim Kudaiberdiuly",
    ...authorPortraits.shakarim,
    image: authorPortraits.shakarim.portrait,
    period: "Kazakh spiritual philosophy · XIX-XX century",
    years: "1858-1931",
    birthplace: "Semey region",
    roles: ["Poet", "Thinker", "Historian", "Translator"],
    description:
      "Poet and thinker whose works explore conscience, faith, responsibility, and the moral path of the human being.",
    biography:
      "Shakarim Kudaiberdiuly developed a spiritual and philosophical line in Kazakh literature. His work searches for conscience, truth, faith, and the ethical center of human life.",
    keyIdeas: ["Conscience", "Truth", "Faith", "Morality", "Inner purity"],
    legacy:
      "Shakarim's thought continues Abai's moral questions and deepens the philosophical tradition of Kazakh letters.",
    mainWorks: ["Three Truths", "Qalqaman-Mamyr", "Poems and translations"],
    sourceHint: "Adebiportal, Shakarim studies",
  },
  {
    name: "Mukagali Makatayev",
    ...authorPortraits.makatayev,
    image: authorPortraits.makatayev.portrait,
    period: "Modern Kazakh poetry · XX century",
    years: "1931-1976",
    birthplace: "Almaty region",
    roles: ["Poet", "Lyric writer", "Translator"],
    description:
      "Beloved lyric poet whose poems carry sincerity, homeland, memory, love, and the voice of everyday life.",
    biography:
      "Mukagali Makatayev's poetry speaks with direct emotional force. His lyric world brings together homeland, mother tongue, sincerity, memory, love, and human tenderness.",
    keyIdeas: ["Homeland", "Love", "Sincerity", "Memory", "Human tenderness"],
    legacy:
      "Makatayev remains one of the most widely loved modern Kazakh poets, especially for his accessible and emotionally honest lyric voice.",
    mainWorks: ["Selected Poetry", "Raiymbek! Raiymbek!", "Life-poems"],
    sourceHint: "Adebiportal, modern Kazakh poetry materials",
  },
  {
    name: "Zhambyl Zhabayev",
    ...authorPortraits.zhambyl,
    image: authorPortraits.zhambyl.portrait,
    period: "Zhyrau and Soviet poetry · XIX-XX century",
    years: "1846-1945",
    birthplace: "Zhambyl region",
    roles: ["Aqyn", "Improviser", "Poet", "Oral tradition bearer"],
    description:
      "Legendary aqyn whose improvisational poetry connects oral tradition, public memory, and the voice of the steppe.",
    biography:
      "Zhambyl Zhabayev carried the zhyrau and aqyn tradition into the twentieth century. His verse preserves performance, public address, and the living rhythm of oral Kazakh poetry.",
    keyIdeas: ["Oral tradition", "Memory", "Homeland", "Song", "Public voice"],
    legacy:
      "Zhambyl is remembered as a bridge between traditional improvisational poetry and modern cultural memory.",
    mainWorks: ["Selected aitys and poems", "Leningraders, my children"],
    sourceHint: "Kazakh literary history, public educational materials",
  },
  {
    name: "Mirzhakyp Dulatuly",
    ...authorPortraits.dulatuly,
    image: authorPortraits.dulatuly.portrait,
    period: "Alash literature · XX century",
    years: "1885-1935",
    birthplace: "Torgai region",
    roles: ["Writer", "Poet", "Journalist", "Alash intellectual"],
    description:
      "Alash writer and public thinker whose prose and poetry speak about awakening, education, and national responsibility.",
    biography:
      "Mirzhakyp Dulatuly helped shape modern Kazakh civic literature through poetry, journalism, and prose. His work joins personal fate with questions of language, duty, and public awakening.",
    keyIdeas: ["Awakening", "Freedom", "Education", "Identity", "Responsibility"],
    legacy:
      "Dulatuly is central to Alash literary memory and the formation of modern Kazakh civic prose.",
    mainWorks: ["Wake Up, Kazakh!", "Bakytsyz Zhamal"],
    sourceHint: "Alash studies, Kazakh literary history",
  },
  {
    name: "Beimbet Mailin",
    ...authorPortraits.mailin,
    image: authorPortraits.mailin.portrait,
    period: "Early Soviet Kazakh prose · XX century",
    years: "1894-1938",
    birthplace: "Kostanay region",
    roles: ["Writer", "Playwright", "Journalist"],
    description:
      "Master of short prose and drama who showed village life, social change, humor, and human character.",
    biography:
      "Beimbet Mailin wrote compact stories, plays, and journalism with close attention to everyday people. His prose makes social transformation visible through ordinary speech and character.",
    keyIdeas: ["Village life", "Society", "Humor", "Character", "Change"],
    legacy:
      "Mailin helped define Kazakh short prose and remains valued for humane realism and precise social observation.",
    mainWorks: ["Shuganing belgisi", "Raushan-kommunist", "Short stories"],
    sourceHint: "Kazakh literary history, public educational materials",
  },
  {
    name: "Gabit Musrepov",
    ...authorPortraits.musrepov,
    image: authorPortraits.musrepov.portrait,
    period: "Soviet Kazakh prose and drama · XX century",
    years: "1902-1985",
    birthplace: "North Kazakhstan region",
    roles: ["Novelist", "Playwright", "Essayist", "Translator"],
    description:
      "Major prose writer and dramatist known for refined language, psychological depth, and strong images of dignity.",
    biography:
      "Gabit Musrepov developed Kazakh prose and drama through historical themes, lyrical language, and attention to inner character. His work often highlights motherhood, dignity, and social conscience.",
    keyIdeas: ["Dignity", "Motherhood", "History", "Character", "Language"],
    legacy:
      "Musrepov is a classic of twentieth-century Kazakh prose and drama.",
    mainWorks: ["Ulpan", "The Soldier from Kazakhstan", "Mother-themed stories"],
    sourceHint: "Kazakh literary history, public educational materials",
  },
  {
    name: "Olzhas Suleimenov",
    ...authorPortraits.suleimenov,
    image: authorPortraits.suleimenov.portrait,
    period: "Modern Kazakh literature · XX-XXI century",
    years: "1936-",
    birthplace: "Almaty",
    roles: ["Poet", "Writer", "Public intellectual", "Diplomat"],
    description:
      "Modern poet and public intellectual whose work connects language, history, ecology, and Eurasian cultural memory.",
    biography:
      "Olzhas Suleimenov writes across poetry, cultural history, and public thought. His voice links Kazakh literature with wider questions of language, identity, ecology, and civilization.",
    keyIdeas: ["Language", "History", "Ecology", "Identity", "Eurasian memory"],
    legacy:
      "Suleimenov is one of the most internationally visible modern Kazakh literary voices.",
    mainWorks: ["Az i Ya", "Earth, Bow to Man", "Selected poems"],
    sourceHint: "Modern Kazakh literature, public educational materials",
  },
  {
    name: "Fariza Ongarsynova",
    ...authorPortraits.ongarsynova,
    image: authorPortraits.ongarsynova.portrait,
    period: "Modern Kazakh poetry · XX-XXI century",
    years: "1939-2014",
    birthplace: "Atyrau region",
    roles: ["Poet", "Journalist", "Public figure"],
    description:
      "Powerful lyric poet of dignity, womanhood, homeland, memory, and emotional courage.",
    biography:
      "Fariza Ongarsynova brought a strong personal and civic voice to modern Kazakh poetry. Her poems speak with intensity about identity, tenderness, responsibility, and women's experience.",
    keyIdeas: ["Womanhood", "Dignity", "Homeland", "Memory", "Courage"],
    legacy:
      "Ongarsynova is a defining modern poetic voice and an important figure for women's perspectives in Kazakh literature.",
    mainWorks: ["Selected poems", "Nightingale", "Anxiety"],
    sourceHint: "Modern Kazakh poetry materials",
  },
];

