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
  <path d="M168 974c58-181 149-276 273-286 125-10 220 76 286 258" fill="#1e4036" opacity="0.74"/>
  <ellipse cx="450" cy="382" rx="162" ry="184" fill="#ddc396" opacity="0.74"/>
  <path d="M291 356c26-105 95-164 202-157 90 6 145 63 170 171-64-53-137-77-218-72-73 4-130 23-154 58z" fill="#26392f" opacity="0.86"/>
  <path d="M342 522c69 68 179 68 247 0 6 72-45 132-124 133-80 0-131-59-123-133z" fill="#9d7b54" opacity="0.42"/>
  <circle cx="331" cy="393" r="7" fill="#17342d" opacity="0.62"/>
  <circle cx="582" cy="393" r="7" fill="#17342d" opacity="0.62"/>
  <path d="M250 991c122 54 285 67 501 5" fill="none" stroke="${accent}" stroke-width="10" opacity="0.52"/>
  <path d="M155 181h590M155 1024h590" stroke="${accent}" stroke-width="3" opacity="0.54"/>
  <text x="450" y="822" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="152" fill="#f3e4c0" opacity="0.9">${safeInitials}</text>
  <text x="450" y="1074" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="29" letter-spacing="4" fill="#f7e9c8" opacity="0.84">${safeName}</text>
  <rect width="900" height="1200" fill="#000" opacity="0.08" filter="url(#grain)"/>
</svg>`;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

const createMuraGeneratedPortrait = ({
  seed,
  accent = "#b78a45",
  robe = "#2f463c",
  skin = "#d6b98f",
  hair = "#2d2a25",
  beard = "none",
  glasses = false,
  headwear = "none",
  feminine = false,
  elder = false,
  face = "oval",
}) => {
  const faceWidth = face === "wide" ? 178 : face === "narrow" ? 142 : 160;
  const faceHeight = elder ? 208 : 190;
  const nose = face === "narrow" ? "M450 420c-10 42-20 75-29 100 20 10 39 10 58 0-10-24-20-58-29-100z" : "M450 414c-13 47-24 83-35 109 24 12 46 12 70 0-12-25-23-62-35-109z";
  const mouth = elder ? "M397 579c34 27 72 29 108 0" : "M402 570c35 17 66 17 98 0";
  const beardPath = beard === "full"
    ? '<path d="M326 515c17 146 70 230 124 230 58 0 111-85 126-230-43 62-206 62-250 0z" fill="#efe4cf" opacity="0.82"/><path d="M370 602c34 86 120 89 160 0" fill="none" stroke="#bcae98" stroke-width="11" opacity="0.45"/>'
    : beard === "trim"
      ? '<path d="M379 563c24 56 117 57 144 0-22 87-122 88-144 0z" fill="#51483e" opacity="0.72"/>'
      : beard === "moustache"
        ? '<path d="M368 532c34-26 59-14 82 0 24-15 52-27 85 1-30 31-58 26-85 5-28 20-54 23-82-6z" fill="#2a2824" opacity="0.86"/>'
        : "";
  const glassesSvg = glasses
    ? '<g fill="none" stroke="#2a312b" stroke-width="9" opacity="0.88"><circle cx="384" cy="422" r="43"/><circle cx="516" cy="422" r="43"/><path d="M427 422h46"/></g>'
    : "";
  const headwearSvg = headwear === "hat"
    ? `<path d="M295 330c20-103 91-154 155-154 80 0 141 55 160 154-82-31-221-31-315 0z" fill="${hair}"/><path d="M291 326c90 30 230 32 320 1" fill="none" stroke="${accent}" stroke-width="15" opacity="0.62"/>`
    : headwear === "aqyn"
      ? '<path d="M284 331c13-98 82-168 166-168 86 0 154 70 167 168-83-43-248-43-333 0z" fill="#eee5d5"/><path d="M303 322c82-35 210-35 294 0" fill="none" stroke="#91806a" stroke-width="18" opacity="0.48"/>'
      : headwear === "scarf"
        ? `<path d="M300 344c20-109 84-170 159-170 78 0 138 66 154 172-85-42-215-45-313-2z" fill="${accent}" opacity="0.84"/><path d="M314 354c68-48 193-53 280 0" fill="none" stroke="#f1dfb8" stroke-width="13" opacity="0.52"/>`
        : `<path d="M303 346c28-113 95-158 158-158 74 0 122 52 142 159-71-65-214-66-300-1z" fill="${hair}"/>`;
  const hairSide = feminine
    ? `<path d="M308 363c-44 99-16 241 64 288-13-84-9-206 39-318z" fill="${hair}" opacity="0.86"/><path d="M591 363c42 99 13 241-66 288 14-84 9-206-38-318z" fill="${hair}" opacity="0.86"/>`
    : `<path d="M322 360c-38 75-29 170 17 221 0-72 15-145 58-220z" fill="${hair}" opacity="0.74"/><path d="M578 360c39 74 28 169-18 221 0-72-15-145-58-220z" fill="${hair}" opacity="0.74"/>`;
  const collar = feminine
    ? `<path d="M322 843c68-78 186-80 256 0" fill="none" stroke="${accent}" stroke-width="18" opacity="0.54"/><path d="M389 706l61 96 61-96" fill="none" stroke="#ead7b5" stroke-width="20" opacity="0.7"/>`
    : `<path d="M360 693l90 122 90-122-90 42z" fill="#ead7b5" opacity="0.9"/><path d="M407 712l43 102 42-102" fill="${accent}" opacity="0.76"/>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="1280" viewBox="0 0 960 1280">
  <defs>
    <linearGradient id="bg-${seed}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#f0e4cf"/>
      <stop offset="0.48" stop-color="#c8af81"/>
      <stop offset="1" stop-color="#0b332b"/>
    </linearGradient>
    <radialGradient id="halo-${seed}" cx="47%" cy="32%" r="58%">
      <stop offset="0" stop-color="#fff7dd" stop-opacity="0.82"/>
      <stop offset="1" stop-color="#0c332b" stop-opacity="0"/>
    </radialGradient>
    <filter id="grain-${seed}">
      <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="5" stitchTiles="stitch"/>
      <feColorMatrix type="saturate" values="0"/>
      <feComponentTransfer><feFuncA type="table" tableValues="0 0.13"/></feComponentTransfer>
    </filter>
  </defs>
  <rect width="960" height="1280" fill="url(#bg-${seed})"/>
  <rect width="960" height="1280" fill="url(#halo-${seed})"/>
  <path d="M118 184h724M118 1074h724" stroke="${accent}" stroke-width="4" opacity="0.38"/>
  <g transform="translate(0 -150)">
  <path d="M171 995c65-183 172-278 282-285 121-7 235 85 326 285" fill="${robe}" opacity="0.94"/>
  <path d="M225 1001c120 72 345 92 555 2" fill="none" stroke="${accent}" stroke-width="17" opacity="0.36"/>
  ${collar}
  ${hairSide}
  ${headwearSvg}
  <ellipse cx="450" cy="426" rx="${faceWidth}" ry="${faceHeight}" fill="${skin}" opacity="0.98"/>
  <path d="M331 386c42-27 82-29 121-5M504 382c39-25 79-23 119 4" fill="none" stroke="#2f332e" stroke-width="14" stroke-linecap="round" opacity="0.76"/>
  <ellipse cx="386" cy="430" rx="14" ry="10" fill="#1d241f"/><ellipse cx="517" cy="430" rx="14" ry="10" fill="#1d241f"/>
  ${glassesSvg}
  <path d="${nose}" fill="#a97955" opacity="0.34"/>
  ${beardPath}
  <path d="${mouth}" fill="none" stroke="#45382e" stroke-width="10" stroke-linecap="round" opacity="0.74"/>
  <path d="M312 612c73 67 201 68 278 0" fill="none" stroke="#7c654f" stroke-width="8" opacity="0.26"/>
  </g>
  <path d="M156 230c70-28 139-38 208-32M604 208c72-15 139-7 201 24" fill="none" stroke="#f2dfb8" stroke-width="3" opacity="0.28"/>
  <rect width="960" height="1280" fill="#000" opacity="0.08" filter="url(#grain-${seed})"/>
</svg>`;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

const portraitAlt = (en, ru, kk) => ({ en, ru, kk });

const generatedPortraitCredit = "MURA generated archival portrait, based on public-domain literary iconography";

const generatedPortraits = {
  auezov: createMuraGeneratedPortrait({
    seed: "auezov",
    accent: "#b98b43",
    robe: "#273b35",
    skin: "#d2b083",
    hair: "#232522",
    glasses: false,
    beard: "none",
    face: "wide",
  }),
  zhumabayev: createMuraGeneratedPortrait({
    seed: "zhumabayev",
    accent: "#c59b57",
    robe: "#203c35",
    skin: "#d8b889",
    hair: "#25231f",
    beard: "moustache",
    face: "narrow",
  }),
  baitursynuly: createMuraGeneratedPortrait({
    seed: "baitursynuly",
    accent: "#bf8b3e",
    robe: "#273934",
    skin: "#d1af82",
    hair: "#24231f",
    glasses: true,
    beard: "trim",
    face: "oval",
  }),
  makatayev: createMuraGeneratedPortrait({
    seed: "makatayev",
    accent: "#b98545",
    robe: "#243d38",
    skin: "#d7b78a",
    hair: "#24221f",
    beard: "none",
    face: "oval",
  }),
  zhambyl: createMuraGeneratedPortrait({
    seed: "zhambyl",
    accent: "#c6a15e",
    robe: "#34473d",
    skin: "#d4b88e",
    hair: "#eee5d5",
    beard: "full",
    headwear: "aqyn",
    elder: true,
    face: "wide",
  }),
  mailin: createMuraGeneratedPortrait({
    seed: "mailin",
    accent: "#ba8847",
    robe: "#283f39",
    skin: "#d3b184",
    hair: "#25221e",
    beard: "none",
    face: "wide",
  }),
  musrepov: createMuraGeneratedPortrait({
    seed: "musrepov",
    accent: "#c0904e",
    robe: "#243b35",
    skin: "#d1ae82",
    hair: "#302b25",
    beard: "moustache",
    elder: true,
    face: "wide",
  }),
  ongarsynova: createMuraGeneratedPortrait({
    seed: "ongarsynova",
    accent: "#b98757",
    robe: "#25433c",
    skin: "#d8b98d",
    hair: "#302a26",
    headwear: "scarf",
    feminine: true,
    face: "oval",
  }),
};

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
    portrait: generatedPortraits.auezov,
    portraitAlt: portraitAlt(
      "MURA generated archival portrait of Mukhtar Auezov",
      "Сгенерированный архивный портрет MURA для Мухтара Ауэзова",
      "Мұхтар Әуезовке арналған MURA архивтік портреті"
    ),
    portraitCredit: generatedPortraitCredit,
    portraitSource: "local:mura-generated/mukhtar-auezov",
    fallbackPortrait: generatedPortraits.auezov,
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
    portrait: generatedPortraits.zhumabayev,
    portraitAlt: portraitAlt(
      "MURA generated archival portrait of Magzhan Zhumabayev",
      "Сгенерированный архивный портрет MURA для Магжана Жумабаева",
      "Мағжан Жұмабаевқа арналған MURA архивтік портреті"
    ),
    portraitCredit: generatedPortraitCredit,
    portraitSource: "local:mura-generated/magzhan-zhumabayev",
    fallbackPortrait: generatedPortraits.zhumabayev,
    portraitPosition: "center 36%",
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
    portrait: generatedPortraits.baitursynuly,
    portraitAlt: portraitAlt(
      "MURA generated archival portrait of Akhmet Baitursynuly",
      "Сгенерированный архивный портрет MURA для Ахмета Байтурсынулы",
      "Ахмет Байтұрсынұлына арналған MURA архивтік портреті"
    ),
    portraitCredit: generatedPortraitCredit,
    portraitSource: "local:mura-generated/akhmet-baitursynuly",
    fallbackPortrait: generatedPortraits.baitursynuly,
    portraitPosition: "center 32%",
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
    portrait: generatedPortraits.makatayev,
    portraitAlt: portraitAlt(
      "MURA generated archival portrait of Mukagali Makatayev",
      "Сгенерированный архивный портрет MURA для Мукагали Макатаева",
      "Мұқағали Мақатаевқа арналған MURA архивтік портреті"
    ),
    portraitCredit: generatedPortraitCredit,
    portraitSource: "local:mura-generated/mukagali-makatayev",
    fallbackPortrait: generatedPortraits.makatayev,
    portraitPosition: "center 35%",
  },
  zhambyl: {
    portrait: generatedPortraits.zhambyl,
    portraitAlt: portraitAlt(
      "MURA generated archival portrait of Zhambyl Zhabayev",
      "Сгенерированный архивный портрет MURA для Жамбыла Жабаева",
      "Жамбыл Жабаевқа арналған MURA архивтік портреті"
    ),
    portraitCredit: generatedPortraitCredit,
    portraitSource: "local:mura-generated/zhambyl-zhabayev",
    fallbackPortrait: generatedPortraits.zhambyl,
    portraitPosition: "center 30%",
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
    portrait: generatedPortraits.mailin,
    portraitAlt: portraitAlt(
      "MURA generated archival portrait of Beimbet Mailin",
      "Сгенерированный архивный портрет MURA для Беимбета Майлина",
      "Бейімбет Майлинге арналған MURA архивтік портреті"
    ),
    portraitCredit: generatedPortraitCredit,
    portraitSource: "local:mura-generated/beimbet-mailin",
    fallbackPortrait: generatedPortraits.mailin,
    portraitPosition: "center 32%",
  },
  musrepov: {
    portrait: generatedPortraits.musrepov,
    portraitAlt: portraitAlt(
      "MURA generated archival portrait of Gabit Musrepov",
      "Сгенерированный архивный портрет MURA для Габита Мусрепова",
      "Ғабит Мүсіреповке арналған MURA архивтік портреті"
    ),
    portraitCredit: generatedPortraitCredit,
    portraitSource: "local:mura-generated/gabit-musrepov",
    fallbackPortrait: generatedPortraits.musrepov,
    portraitPosition: "center 30%",
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
    portrait: generatedPortraits.ongarsynova,
    portraitAlt: portraitAlt(
      "MURA generated archival portrait of Fariza Ongarsynova",
      "Сгенерированный архивный портрет MURA для Фаризы Онгарсыновой",
      "Фариза Оңғарсыноваға арналған MURA архивтік портреті"
    ),
    portraitCredit: generatedPortraitCredit,
    portraitSource: "local:mura-generated/fariza-ongarsynova",
    fallbackPortrait: generatedPortraits.ongarsynova,
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

