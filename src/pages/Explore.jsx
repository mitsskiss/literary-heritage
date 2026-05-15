import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { works } from "../data/works";
import {
  communityPreview,
  gamificationData,
  literaryJourneys,
  multimediaContext,
  themeCollections,
  workMetadataById,
} from "../data/exploreData";
import JourneyCard from "../components/explore/JourneyCard";
import ExploreWorkCard from "../components/explore/ExploreWorkCard";
import LiteraryTimeline from "../components/explore/LiteraryTimeline";
import ThemeCard from "../components/explore/ThemeCard";
import ShinyText from "../components/ShinyText";
import "./Explore.css";
import { useI18n } from "../i18n/I18nContext";

const THEME_ORDER = [
  "Identity",
  "Morality",
  "Knowledge",
  "Society",
  "Love",
  "Freedom",
  "Memory",
  "Fate",
];

function highlightMatch(text, query) {
  const normalizedText = text.toLowerCase();
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) return text;

  const matchIndex = normalizedText.indexOf(normalizedQuery);
  if (matchIndex === -1) return text;

  const matchEnd = matchIndex + normalizedQuery.length;

  return (
    <>
      {text.slice(0, matchIndex)}
      <mark className="explore-toolbar__highlight">
        {text.slice(matchIndex, matchEnd)}
      </mark>
      {text.slice(matchEnd)}
    </>
  );
}

function Explore() {
  const {
    t,
    label,
    localizeCommunity,
    localizeGamification,
    localizeJourneys,
    localizeMetadata,
    localizeMultimedia,
    localizeThemeCollections,
    localizeWorks,
  } = useI18n();
  const pageRef = useRef(null);
  const [searchValue, setSearchValue] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [periodFilter, setPeriodFilter] = useState("all");
  const [sortValue, setSortValue] = useState("featured");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTheme = searchParams.get("theme") || "all";

  const sortOptions = [
    { value: "featured", label: t("featured") },
    { value: "title-asc", label: t("titleAz") },
    { value: "time-asc", label: t("shortestRead") },
    { value: "period-asc", label: t("period") },
  ];

  const localizedWorks = localizeWorks(works);
  const localizedJourneys = localizeJourneys(literaryJourneys);
  const localizedThemeCollections = localizeThemeCollections(themeCollections);
  const localizedGamification = localizeGamification(gamificationData);
  const localizedCommunity = localizeCommunity(communityPreview);
  const localizedMultimedia = localizeMultimedia(multimediaContext);
  const enrichedWorks = localizedWorks.map((work) => ({
    ...work,
    ...localizeMetadata(work.id, workMetadataById[work.id]),
  }));

  const typeOptions = [...new Set(enrichedWorks.map((work) => work.type))];
  const periodOptions = [...new Set(enrichedWorks.map((work) => work.period))];
  const themeOptions = THEME_ORDER.map((theme) => label(theme)).filter((theme) =>
    enrichedWorks.some((work) => work.themes.includes(theme))
  );

  const normalizedQuery = searchValue.trim().toLowerCase();
  const searchSuggestions =
    normalizedQuery.length === 0
      ? []
      : enrichedWorks
          .filter(
            (work) =>
              work.title.toLowerCase().includes(normalizedQuery) ||
              work.author.toLowerCase().includes(normalizedQuery)
          )
          .sort((a, b) => {
            const aStarts = a.title.toLowerCase().startsWith(normalizedQuery);
            const bStarts = b.title.toLowerCase().startsWith(normalizedQuery);
            const aAuthorStarts = a.author.toLowerCase().startsWith(normalizedQuery);
            const bAuthorStarts = b.author.toLowerCase().startsWith(normalizedQuery);

            if (aStarts && !bStarts) return -1;
            if (!aStarts && bStarts) return 1;
            if (aAuthorStarts && !bAuthorStarts) return -1;
            if (!aAuthorStarts && bAuthorStarts) return 1;
            return a.title.localeCompare(b.title);
          })
          .slice(0, 6);

  const filteredWorks = enrichedWorks
    .filter((work) => {
      const matchesTheme =
        activeTheme === "all" || work.themes.includes(activeTheme);
      const matchesType = typeFilter === "all" || work.type === typeFilter;
      const matchesPeriod =
        periodFilter === "all" || work.period === periodFilter;
      const matchesSearch =
        normalizedQuery.length === 0 ||
        work.title.toLowerCase().includes(normalizedQuery) ||
        work.author.toLowerCase().includes(normalizedQuery) ||
        work.description.toLowerCase().includes(normalizedQuery) ||
        work.themes.some((theme) => theme.toLowerCase().includes(normalizedQuery));

      return matchesTheme && matchesType && matchesPeriod && matchesSearch;
    })
    .sort((a, b) => {
      if (sortValue === "title-asc") return a.title.localeCompare(b.title);
      if (sortValue === "time-asc") return a.readingTime - b.readingTime;
      if (sortValue === "period-asc") return a.period.localeCompare(b.period);
      return 0;
    });

  const spotlightWork =
    filteredWorks[0] ??
    enrichedWorks.find((work) => work.id === "dostoevsky-crime") ??
    enrichedWorks[0];

  const recommendationTheme =
    activeTheme !== "all"
      ? activeTheme
      : spotlightWork?.themes?.[0] ?? themeOptions[0];

  const primaryJourney =
    localizedJourneys.find((journey) => journey.focusTheme === recommendationTheme) ??
    localizedJourneys[0];

  const recommendedWorks = enrichedWorks
    .filter(
      (work) =>
        work.id !== spotlightWork.id && work.themes.includes(recommendationTheme)
    )
    .slice(0, 2);

  const visibleThemes = localizedThemeCollections.slice(0, 4);

  const handleThemeSelect = (theme) => {
    const next = new URLSearchParams(searchParams);
    if (!theme || theme === "all") {
      next.delete("theme");
    } else {
      next.set("theme", theme);
    }
    setSearchParams(next, { replace: true });
  };

  const beginJourney = (theme) => {
    handleThemeSelect(label(theme));
  };

  const resetFilters = () => {
    setSearchValue("");
    setTypeFilter("all");
    setPeriodFilter("all");
    setSortValue("featured");
    handleThemeSelect("all");
  };

  const openSuggestedWork = (workId) => {
    setIsSearchFocused(false);
    navigate(`/reading/${workId}`);
  };

  useEffect(() => {
    const root = pageRef.current;
    if (!root) return undefined;

    const items = [...root.querySelectorAll(".explore-reveal")];
    if (!items.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.14,
        rootMargin: "0px 0px -8% 0px",
      }
    );

    items.forEach((item, index) => {
      item.style.setProperty("--reveal-delay", `${Math.min(index * 55, 260)}ms`);
      observer.observe(item);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <main ref={pageRef} className="explore-page">
      <div className="explore-page__container">
        <section className="explore-hero explore-reveal">
          <div className="explore-hero__copy">
            <h1 className="explore-hero__title">
              <ShinyText
                text={t("exploreTitle")}
                speed={3.2}
                delay={1.2}
                color="var(--text)"
                shineColor="var(--accent-strong)"
                spread={118}
                className="page-shiny-title"
              />
            </h1>
            <p className="explore-hero__subtitle">
              {t("exploreSubtitle")}
            </p>
          </div>
        </section>

        <div className="explore-reveal">
          <LiteraryTimeline />
        </div>

        <section
          className="explore-toolbar explore-reveal"
          aria-label={t("exploreFilters")}
        >
          <div className="explore-toolbar__filters">
            <div className="explore-toolbar__searchBox">
              <label className="explore-toolbar__search">
                <input
                  id="explore-search"
                  type="search"
                  value={searchValue}
                  onChange={(event) => setSearchValue(event.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => {
                    window.setTimeout(() => {
                      setIsSearchFocused(false);
                    }, 120);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && searchSuggestions.length > 0) {
                      event.preventDefault();
                      openSuggestedWork(searchSuggestions[0].id);
                    }
                  }}
                  placeholder={t("searchPlaceholder")}
                  aria-label={t("searchArchive")}
                  aria-expanded={isSearchFocused && searchSuggestions.length > 0}
                  aria-controls="explore-search-suggestions"
                />
              </label>

              {isSearchFocused && searchSuggestions.length > 0 ? (
                <div
                  id="explore-search-suggestions"
                  className="explore-toolbar__suggestions"
                  role="listbox"
                  aria-label={t("suggestedBooks")}
                >
                  {searchSuggestions.map((work) => (
                    <button
                      key={work.id}
                      type="button"
                      className="explore-toolbar__suggestion"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => openSuggestedWork(work.id)}
                    >
                      <span className="explore-toolbar__suggestionTitle">
                        {highlightMatch(work.title, normalizedQuery)}
                      </span>
                      <span className="explore-toolbar__suggestionMeta">
                        {work.author}
                      </span>
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="explore-toolbar__themes">
              {themeOptions.map((theme) => (
                <button
                  key={theme}
                  type="button"
                  className={`explore-hero__theme ${
                    activeTheme === theme ? "is-active" : ""
                  }`}
                  onClick={() => handleThemeSelect(theme)}
                >
                  {theme}
                </button>
              ))}
            </div>

            <div className="explore-toolbar__controls">
              <label className="explore-toolbar__field">
                <select
                  value={typeFilter}
                  onChange={(event) => setTypeFilter(event.target.value)}
                  aria-label={t("filterByType")}
                >
                  <option value="all">{t("allTypes")}</option>
                  {typeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label className="explore-toolbar__field">
                <select
                  value={periodFilter}
                  onChange={(event) => setPeriodFilter(event.target.value)}
                  aria-label={t("filterByPeriod")}
                >
                  <option value="all">{t("allPeriods")}</option>
                  {periodOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label className="explore-toolbar__field">
                <select
                  value={sortValue}
                  onChange={(event) => setSortValue(event.target.value)}
                  aria-label={t("sortWorks")}
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <button
                type="button"
                className="explore-toolbar__reset"
                onClick={resetFilters}
              >
                {t("resetFilters")}
              </button>
            </div>
          </div>
        </section>

        <section className="explore-section explore-reveal">
          <div className="explore-section__head">
            <h2 className="explore-section__title">{t("startGuidedRoute")}</h2>
          </div>

          <div className="explore-journeys">
            <article className="explore-journeys__feature">
              <h3 className="explore-journeys__featureTitle">{primaryJourney.title}</h3>
              <p className="explore-journeys__featureText">
                {primaryJourney.description}
              </p>

              <div className="explore-journeys__featureMeta">
                <span>{primaryJourney.works.length} {t("works").toLowerCase()}</span>
                <span>{primaryJourney.minutes} {t("min")}</span>
                <span>{primaryJourney.level}</span>
              </div>

              <button
                type="button"
                className="explore-journeys__featureAction"
                onClick={() => beginJourney(primaryJourney.focusTheme)}
              >
                {t("startRoute")}
              </button>
            </article>

            <div className="explore-journeys__grid">
              {localizedJourneys
                .filter((journey) => journey.id !== primaryJourney.id)
                .slice(0, 3)
                .map((journey) => (
                  <JourneyCard
                    key={journey.id}
                    journey={journey}
                    worksCount={journey.works.length}
                    onBegin={() => beginJourney(journey.focusTheme)}
                  />
                ))}
            </div>
          </div>
        </section>

        <section className="explore-section explore-reveal">
          <div className="explore-section__head">
            <h2 className="explore-section__title">{t("openOneWork")}</h2>
          </div>

          <div className="explore-spotlight">
            <div
              className="explore-spotlight__visual"
              style={{ backgroundImage: `url(${spotlightWork.image})` }}
            />

            <div className="explore-spotlight__content">
              <div className="explore-spotlight__meta">
                <span>{spotlightWork.author}</span>
                <span>{spotlightWork.period}</span>
                <span>{spotlightWork.readingTime} {t("min")}</span>
              </div>

              <h3 className="explore-spotlight__title">{spotlightWork.title}</h3>
              <p className="explore-spotlight__intro">
                {spotlightWork.spotlightIntro}
              </p>

              <div className="explore-spotlight__question">
                <span className="explore-spotlight__label">{t("mainQuestion")}</span>
                <p>{spotlightWork.conflict}</p>
              </div>

              <p className="explore-spotlight__why">
                {t("today")}: {spotlightWork.whyNow}
              </p>

              <Link
                to={`/reading/${spotlightWork.id}`}
                className="explore-spotlight__action"
              >
                {t("startReading")}
              </Link>
            </div>
          </div>
        </section>

        <section className="explore-section explore-reveal">
          <div className="explore-section__head explore-section__head--split">
            <h2 className="explore-section__title">{t("browseCollection")}</h2>
            <p className="explore-section__meta">
              {t("visibleWorks", { count: filteredWorks.length })}
            </p>
          </div>

          {filteredWorks.length === 0 ? (
            <div className="explore-empty">
              <h3 className="explore-empty__title">{t("noResults")}</h3>
              <p className="explore-empty__text">
                {t("noResultsText")}
              </p>
              <button
                type="button"
                className="explore-empty__action"
                onClick={resetFilters}
              >
                {t("resetFilters")}
              </button>
            </div>
          ) : (
            <div className="explore-collection">
              {filteredWorks.map((work) => (
                <ExploreWorkCard
                  key={work.id}
                  work={work}
                  onThemeSelect={handleThemeSelect}
                />
              ))}
            </div>
          )}
        </section>

        <section className="explore-section explore-reveal">
          <div className="explore-section__head">
            <h2 className="explore-section__title">{t("exploreByTheme")}</h2>
          </div>

          <div className="explore-themes">
            {visibleThemes.map((theme) => (
              <ThemeCard
                key={theme.name}
                theme={theme}
                relatedWorks={enrichedWorks.filter((work) =>
                  theme.works.includes(work.id)
                )}
                onExplore={() => beginJourney(theme.name)}
              />
            ))}
          </div>
        </section>

        <section className="explore-section explore-reveal">
          <div className="explore-section__head">
            <h2 className="explore-section__title">{t("trackActivity")}</h2>
          </div>

          <div className="explore-signals">
            <section className="explore-signals__card">
              <p className="explore-signals__label">{t("progress")}</p>
              <div className="explore-signals__stats">
                <div>
                  <span>{t("exploredWorks")}</span>
                  <strong>{localizedGamification.progress.exploredWorks}</strong>
                </div>
                <div>
                  <span>{t("reflectionsSaved")}</span>
                  <strong>{localizedGamification.progress.reflectionsSaved}</strong>
                </div>
                <div>
                  <span>{t("activeJourney")}</span>
                  <strong>{localizedGamification.progress.activeJourney}</strong>
                </div>
              </div>

              <div className="explore-signals__badges">
                {localizedGamification.badges.slice(0, 4).map((badge) => (
                  <span key={badge}>{badge}</span>
                ))}
              </div>
            </section>

            <section className="explore-signals__card">
              <p className="explore-signals__label">{t("recommendedForYou")}</p>
              <div className="explore-signals__recommendations">
                {recommendedWorks.map((work) => (
                  <article key={work.id} className="explore-signals__recommendation">
                    <p>
                      {t("basedOn")}{" "}
                      <strong>{recommendationTheme.toLowerCase()}</strong>
                    </p>
                    <h3>{work.title}</h3>
                    <span>{work.author}</span>
                    <Link to={`/reading/${work.id}`}>{t("openWork")}</Link>
                  </article>
                ))}
              </div>
            </section>

            <section className="explore-signals__card">
              <p className="explore-signals__label">{t("communityPulse")}</p>
              <ul className="explore-signals__list">
                {localizedCommunity.discussions.slice(0, 3).map((discussion) => (
                  <li key={discussion}>{discussion}</li>
                ))}
              </ul>
              <div className="explore-signals__footnote">
                <span>{t("comments", { count: localizedCommunity.counters.comments })}</span>
                <span>{t("likes", { count: localizedCommunity.counters.likes })}</span>
              </div>
            </section>

            <section className="explore-signals__card">
              <p className="explore-signals__label">{t("contextMaterials")}</p>
              <div className="explore-signals__media">
                {localizedMultimedia.slice(0, 3).map((item) => (
                  <article key={item.title}>
                    <span>{item.type}</span>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </section>

        <section className="explore-cta explore-reveal">
          <h2 className="explore-cta__title">{t("continueArchive")}</h2>
          <p className="explore-cta__text">
            {t("continueArchiveText")}
          </p>

          <div className="explore-cta__actions">
            <Link to="/works" className="explore-cta__action is-primary">
              {t("openAllWorks")}
            </Link>
            <button
              type="button"
              className="explore-cta__action"
              onClick={() => beginJourney(primaryJourney.focusTheme)}
            >
              {t("startRoute")}
            </button>
            <button type="button" className="explore-cta__action">
              {t("createAccount")}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Explore;
