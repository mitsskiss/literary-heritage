import { useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { works } from "../data/works";
import { authors } from "../data/authors";
import { useI18n } from "../i18n/useI18n";
import { useProgressStore } from "../store/useProgressStore";
import { mergeAdminAuthors, mergeAdminWorks } from "../admin/adminContent";
import { useAdminContent } from "../hooks/useAdminContent";
import AuthorPortrait from "../components/AuthorPortrait";
import {
  getAuthorsWithPortrait,
  getVisibleWorks,
} from "../utils/authorPortraits";
import {
  MuraArrowIcon,
  MuraBookOpenIcon,
  MuraBookmarkIcon,
  MuraCalendarIcon,
  MuraFeatherIcon,
  MuraGlobeIcon,
  MuraMapPinIcon,
  MuraQuoteIcon,
  MuraShareIcon,
  MuraSparkIcon,
} from "../components/icons/MuraIconSet";
import "./Author.css";

const tabOrder = ["overview", "biography", "works", "quotes", "research", "facts"];

const defaultTabs = {
  en: {
    overview: "Overview",
    biography: "Biography",
    works: "Works",
    quotes: "Quotes",
    research: "Articles and research",
    facts: "Facts",
  },
  ru: {
    overview: "Обзор",
    biography: "Биография",
    works: "Произведения",
    quotes: "Цитаты",
    research: "Статьи и исследования",
    facts: "Факты",
  },
  kk: {
    overview: "Шолу",
    biography: "Өмірбаян",
    works: "Шығармалар",
    quotes: "Дәйексөздер",
    research: "Мақалалар мен зерттеулер",
    facts: "Деректер",
  },
};

const defaultLabels = {
  en: {
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
    readAbai: "Read author's works",
    readAbaiText: "Continue through the author's works and ideas.",
    allWorks: "All works",
    openWork: "Open work",
    unavailable: "Available in works catalog",
    articlesIntro: "Materials for deeper reading and context.",
  },
  ru: {
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
    readAbai: "Читайте произведения автора",
    readAbaiText: "Продолжайте знакомство с произведениями и идеями автора.",
    allWorks: "Все произведения",
    openWork: "Открыть произведение",
    unavailable: "Доступно в каталоге произведений",
    articlesIntro: "Материалы для более глубокого чтения и контекста.",
  },
  kk: {
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
    readAbai: "Автор шығармаларын оқыңыз",
    readAbaiText: "Автордың шығармалары мен идеяларын оқуды жалғастырыңыз.",
    allWorks: "Барлық шығармалар",
    openWork: "Шығарманы ашу",
    unavailable: "Шығармалар каталогында қолжетімді",
    articlesIntro: "Терең оқу мен контекстке арналған материалдар.",
  },
};

function getProfile(author, language, authorWorks) {
  const profile = author.profile?.[language] ?? author.profile?.en;
  if (profile) return profile;

  const years = author.years ?? "";
  const themes = author.keyIdeas ?? [...new Set(authorWorks.flatMap((work) => work.themes ?? []))];

  return {
    name: author.name,
    years,
    shortDescription: author.description,
    fullBiography: [author.biography ?? author.description].filter(Boolean),
    quote: author.legacy ?? author.description,
    metadata: [
      { label: "Born", value: author.birthplace ?? "Kazakhstan", detail: years, icon: "map" },
      { label: "Activity", value: author.roles?.slice(0, 2).join(", ") ?? author.period, detail: author.period, icon: "feather" },
      { label: "Epoch", value: author.period ?? years, detail: years, icon: "globe" },
      { label: "Language of work", value: "Kazakh", detail: "Literary tradition", icon: "book" },
    ],
    timeline: [
      { year: years || "—", text: author.biography ?? author.description },
      ...authorWorks.slice(0, 3).map((work) => ({ year: work.year ?? "—", text: `${work.title}: ${work.description}` })),
    ].filter((item) => item.text),
    keyThemes: themes,
    cultureContribution: author.legacy ?? author.description,
    interestingFact: author.sourceHint,
    quotes: [author.legacy, author.description].filter(Boolean),
    works: authorWorks.map((work) => ({
      workId: work.id,
      title: work.title,
      subtitle: work.genre,
      years: String(work.year ?? ""),
      genre: work.genre,
      image: work.image,
    })),
    research: [],
    tabs: defaultTabs[language],
    labels: defaultLabels[language],
  };
}

function IconForMeta({ type }) {
  if (type === "calendar") return <MuraCalendarIcon />;
  if (type === "feather") return <MuraFeatherIcon />;
  if (type === "globe") return <MuraGlobeIcon />;
  if (type === "book") return <MuraBookOpenIcon />;
  if (type === "map") return <MuraMapPinIcon />;
  return <MuraSparkIcon />;
}

function createWorks(profileWorks, localizedWorks) {
  const byId = new Map(localizedWorks.map((work) => [work.id, work]));

  return (profileWorks ?? []).map((item) => {
    const linkedWork = item.workId ? byId.get(item.workId) : null;
    return {
      ...item,
      href: item.href ?? (linkedWork ? `/reading/${linkedWork.id}` : "/works"),
      image: item.image ?? linkedWork?.image,
      title: item.title ?? linkedWork?.displayTitle ?? linkedWork?.title,
      subtitle: item.subtitle ?? linkedWork?.shortTitle ?? linkedWork?.genre,
      year: item.years ?? linkedWork?.year,
      genre: item.genre ?? linkedWork?.genre,
      description: item.description ?? linkedWork?.description,
      isRealWork: Boolean(linkedWork),
    };
  });
}

function Author() {
  const { t, language, localizeAuthors, localizeWorks } = useI18n();
  const { favorites, toggleFavorite } = useProgressStore();
  const { content: adminContent } = useAdminContent();
  const { name } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [shareStatus, setShareStatus] = useState("");
  const tabPanelRef = useRef(null);

  const localizedAuthors = getAuthorsWithPortrait(
    mergeAdminAuthors(localizeAuthors(authors), adminContent, language)
  );
  const localizedWorks = getVisibleWorks(
    mergeAdminWorks(localizeWorks(works), adminContent, language),
    localizedAuthors
  );
  const authorInfo = localizedAuthors.find(
    (author) =>
      author.canonicalName === name ||
      author.slug === name ||
      encodeURIComponent(author.canonicalName) === name
  );
  const authorWorks = localizedWorks.filter((work) => work.canonicalAuthor === authorInfo?.canonicalName);

  const profile = useMemo(
    () => (authorInfo ? getProfile(authorInfo, language, authorWorks) : null),
    [authorInfo, authorWorks, language]
  );

  if (!authorInfo || !profile) {
    return (
      <main className="author-page author-page--profile">
        <div className="author-profile-shell">
          <section className="author-page__notFound author-profile-surface">
            <h1>{t("authorNotFound")}</h1>
            <p>{t("authorNotFoundText")}</p>
            <Link to="/authors" className="author-profile-button author-profile-button--gold">
              {t("backToAuthors")}
            </Link>
          </section>
        </div>
      </main>
    );
  }

  const tabs = { ...defaultTabs[language], ...(profile.tabs ?? {}) };
  const labels = { ...defaultLabels[language], ...(profile.labels ?? {}) };
  const displayName = profile.name ?? authorInfo.name;
  const profileWorks = createWorks(profile.works, localizedWorks);
  const isAuthorFavorite = favorites.some(
    (favorite) => favorite.type === "author" && favorite.id === authorInfo.canonicalName
  );

  const handleShare = async () => {
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}${window.location.pathname}#/author/${encodeURIComponent(authorInfo.canonicalName)}`
        : `/author/${encodeURIComponent(authorInfo.canonicalName)}`;
    try {
      await navigator.clipboard?.writeText(url);
      setShareStatus(labels.copied);
    } catch {
      setShareStatus(url);
    }
    window.setTimeout(() => setShareStatus(""), 2200);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const openBiography = () => {
    setActiveTab("biography");
    requestAnimationFrame(() => {
      tabPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const renderWorks = (compact = false) => (
    <div className={`author-profile-works-grid ${compact ? "author-profile-works-grid--compact" : ""}`}>
      {profileWorks.map((work) => {
        const isFavorite = favorites.some((favorite) => favorite.type === "work" && favorite.id === work.workId);
        return (
          <article key={`${work.title}-${work.href}`} className="author-profile-work-card">
            <Link to={work.href} className="author-profile-work-card__link" aria-label={`${labels.openWork}: ${work.title}`}>
              <span className="author-profile-work-card__image">
                {work.image ? <img src={work.image} alt="" /> : null}
              </span>
              <span className="author-profile-work-card__body">
                <span className="author-profile-work-card__tag">{work.genre}</span>
                <strong>{work.title}</strong>
                {work.subtitle ? <span>{work.subtitle}</span> : null}
                <small>{work.year}</small>
              </span>
            </Link>
            {work.workId ? (
              <button
                type="button"
                className={`author-profile-work-card__save ${isFavorite ? "is-saved" : ""}`}
                onClick={() =>
                  toggleFavorite({
                    type: "work",
                    id: work.workId,
                    title: work.title,
                    subtitle: work.genre,
                    href: work.href,
                  })
                }
                aria-label={`${labels.save}: ${work.title}`}
              >
                <MuraBookmarkIcon />
              </button>
            ) : null}
          </article>
        );
      })}
    </div>
  );

  return (
    <main className="author-page author-page--profile">
      <div className="author-profile-shell">
        <section className="author-profile-hero-premium">
          <div className="author-profile-topline">
            <nav className="author-profile-breadcrumb" aria-label="Breadcrumb">
              <Link to="/authors">{labels.authors}</Link>
              <span>/</span>
              <span>{displayName}</span>
            </nav>

            <div className="author-profile-actions">
              <button
                type="button"
                className={`author-profile-button ${isAuthorFavorite ? "is-saved" : ""}`}
                onClick={() =>
                  toggleFavorite({
                    type: "author",
                    id: authorInfo.canonicalName,
                    title: displayName,
                    subtitle: profile.shortDescription,
                    href: `/author/${encodeURIComponent(authorInfo.canonicalName)}`,
                  })
                }
              >
                <MuraBookmarkIcon />
                <span>{isAuthorFavorite ? labels.saved : labels.save}</span>
              </button>
              <button type="button" className="author-profile-button" onClick={handleShare}>
                <MuraShareIcon />
                <span>{labels.share}</span>
              </button>
              {shareStatus ? <span className="author-profile-share-status">{shareStatus}</span> : null}
            </div>
          </div>

          <div className="author-profile-hero-grid">
            <div className="author-profile-portrait">
              <AuthorPortrait
                author={authorInfo}
                displayName={displayName}
                language={language}
                loading="eager"
                showCredit
              />
            </div>

            <div className="author-profile-identity">
              <h1>{displayName}</h1>
              {profile.years ? <p className="author-profile-years">{profile.years}</p> : null}
              <p className="author-profile-lede">{profile.shortDescription}</p>

              <div className="author-profile-meta-grid">
                {(profile.metadata ?? []).map((item) => (
                  <article key={item.label} className="author-profile-meta-card">
                    <span>
                      <IconForMeta type={item.icon} />
                    </span>
                    <div>
                      <small>{item.label}</small>
                      <strong>{item.value}</strong>
                      {item.detail ? <p>{item.detail}</p> : null}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {profile.quote ? (
          <section className="author-profile-quote-card">
            <MuraQuoteIcon />
            <blockquote>{profile.quote}</blockquote>
          </section>
        ) : null}

        <nav className="author-profile-tabs" aria-label="Author profile sections">
          {tabOrder.map((tab) => (
            <button
              key={tab}
              type="button"
              className={activeTab === tab ? "is-active" : ""}
              onClick={() => handleTabChange(tab)}
            >
              {tabs[tab]}
            </button>
          ))}
        </nav>

        <section ref={tabPanelRef} className="author-profile-tab-panel" key={activeTab}>
          {activeTab === "overview" ? (
            <div className="author-profile-overview">
              <article className="author-profile-biography-card">
                <h2>{labels.shortBio}</h2>
                <div className="author-profile-timeline-premium">
                  {(profile.timeline ?? []).map((item) => (
                    <div key={`${item.year}-${item.text}`}>
                      <time>{item.year}</time>
                      <p>{item.text}</p>
                    </div>
                  ))}
                </div>
                <button type="button" className="author-profile-outline-action" onClick={openBiography}>
                  <span>{labels.readFullBio}</span>
                  <MuraArrowIcon />
                </button>
              </article>

              <aside className="author-profile-insights">
                <article>
                  <h3>{labels.keyThemes}</h3>
                  <div className="author-profile-chip-list">
                    {(profile.keyThemes ?? []).map((theme) => (
                      <span key={theme}>{theme}</span>
                    ))}
                  </div>
                </article>
                <article>
                  <h3>{labels.cultureContribution}</h3>
                  <p>{profile.cultureContribution}</p>
                  <MuraFeatherIcon className="author-profile-card-icon" />
                </article>
                <article>
                  <h3>{labels.interestingFact}</h3>
                  <p>{profile.interestingFact}</p>
                  <MuraSparkIcon className="author-profile-card-icon" />
                </article>
              </aside>
            </div>
          ) : null}

          {activeTab === "biography" ? (
            <article className="author-profile-longform author-profile-surface">
              <h2>{tabs.biography}</h2>
              {(profile.fullBiography ?? []).map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <div className="author-profile-timeline-premium author-profile-timeline-premium--inline">
                {(profile.timeline ?? []).map((item) => (
                  <div key={`${item.year}-${item.text}`}>
                    <time>{item.year}</time>
                    <p>{item.text}</p>
                  </div>
                ))}
              </div>
            </article>
          ) : null}

          {activeTab === "works" ? (
            <section className="author-profile-tab-section">
              <div className="author-profile-section-head">
                <h2>{labels.majorWorks}</h2>
                <Link to="/works">
                  {labels.viewAll} <MuraArrowIcon />
                </Link>
              </div>
              {renderWorks(false)}
            </section>
          ) : null}

          {activeTab === "quotes" ? (
            <section className="author-profile-quotes">
              {(profile.quotes ?? []).map((quote) => (
                <article key={quote}>
                  <MuraQuoteIcon />
                  <p>{quote}</p>
                </article>
              ))}
            </section>
          ) : null}

          {activeTab === "research" ? (
            <section className="author-profile-research">
              <p>{labels.articlesIntro}</p>
              <div>
                {(profile.research ?? []).map((item) => (
                  <Link key={item.title} to={item.href} className="author-profile-research-card">
                    <strong>{item.title}</strong>
                    <span>{item.text}</span>
                    <MuraArrowIcon />
                  </Link>
                ))}
              </div>
            </section>
          ) : null}

          {activeTab === "facts" ? (
            <section className="author-profile-facts">
              {(profile.facts ?? []).map((fact) => (
                <article key={fact}>
                  <MuraSparkIcon />
                  <p>{fact}</p>
                </article>
              ))}
            </section>
          ) : null}
        </section>

        {activeTab !== "works" ? (
          <>
            <section className="author-profile-section-head author-profile-section-head--works">
              <h2>{labels.majorWorks}</h2>
              <Link to="/works">
                {labels.viewAll} <MuraArrowIcon />
              </Link>
            </section>
            {renderWorks(true)}
          </>
        ) : null}

        <section className="author-profile-cta">
          <MuraBookOpenIcon />
          <div>
            <h2>{labels.readAbai}</h2>
            <p>{labels.readAbaiText}</p>
          </div>
          <Link to="/works" className="author-profile-button author-profile-button--gold">
            <span>{labels.allWorks}</span>
            <MuraArrowIcon />
          </Link>
        </section>
      </div>
    </main>
  );
}

export default Author;
