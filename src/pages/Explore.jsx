import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { authors } from "../data/authors";
import { works } from "../data/works";
import { workMetadataById } from "../data/exploreData";
import { readingRoutes } from "../data/routes";
import { useI18n } from "../i18n/useI18n";
import { useProgressStore } from "../store/useProgressStore";
import exploreHero from "../assets/mura/routes-hero.jpg";
import "./Explore.css";

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

function Explore() {
  const {
    t,
    label,
    localizeJourneys,
    localizeMetadata,
    localizeWorks,
    localizeAuthors,
  } = useI18n();
  const navigate = useNavigate();
  const pageRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [authorFilter, setAuthorFilter] = useState("all");
  const [periodFilter, setPeriodFilter] = useState("all");
  const [languageFilter, setLanguageFilter] = useState("all");
  const [durationFilter, setDurationFilter] = useState("all");
  const [searchValue, setSearchValue] = useState("");
  const completedStories = useProgressStore((state) => state.completedStories);
  const storyProgress = useProgressStore((state) => state.storyProgress);
  const reflections = useProgressStore((state) => state.reflections);

  const activeTheme = searchParams.get("theme") || "all";
  const localizedWorks = localizeWorks(works).map((work) => ({
    ...work,
    ...localizeMetadata(work.id, workMetadataById[work.id]),
  }));
  const localizedAuthors = localizeAuthors(authors);
  const localizedJourneys = localizeJourneys(readingRoutes);

  const themeOptions = THEME_ORDER.map((theme) => ({ value: theme, label: label(theme) }));
  const authorOptions = [...new Set(localizedWorks.map((work) => work.author))];
  const periodOptions = [...new Set(localizedWorks.map((work) => work.period))];

  const filteredJourneys = useMemo(() => {
    return localizedJourneys.filter((journey) => {
      const routeWorks = journey.works
        .map((id) => localizedWorks.find((work) => work.id === id))
        .filter(Boolean);
      const routeAuthors = routeWorks.map((work) => work.author);
      const routePeriods = routeWorks.map((work) => work.period);
      const normalizedSearch = searchValue.trim().toLowerCase();
      const routeDescription = journey.description ?? journey.subtitle ?? "";
      const matchesTheme =
        activeTheme === "all" ||
        journey.canonicalFocusTheme === activeTheme ||
        journey.focusTheme === activeTheme;
      const matchesAuthor = authorFilter === "all" || routeAuthors.includes(authorFilter);
      const matchesPeriod = periodFilter === "all" || routePeriods.includes(periodFilter);
      const matchesDuration =
        durationFilter === "all" ||
        (durationFilter === "short" && journey.minutes <= 25) ||
        (durationFilter === "medium" && journey.minutes > 25 && journey.minutes <= 35) ||
        (durationFilter === "long" && journey.minutes > 35);
      const matchesSearch =
        !normalizedSearch ||
        journey.title.toLowerCase().includes(normalizedSearch) ||
        routeDescription.toLowerCase().includes(normalizedSearch) ||
        routeWorks.some((work) => work.title.toLowerCase().includes(normalizedSearch));

      return matchesTheme && matchesAuthor && matchesPeriod && matchesDuration && matchesSearch;
    });
  }, [activeTheme, authorFilter, durationFilter, localizedJourneys, localizedWorks, periodFilter, searchValue]);

  const primaryJourney = filteredJourneys[0] ?? localizedJourneys[0];
  const primaryWork = localizedWorks.find((work) => work.id === primaryJourney?.works?.[0]) ?? localizedWorks[0];
  const completedCount = completedStories.length;
  const progressPercent = Math.min(100, Math.round((completedCount / Math.max(localizedJourneys.length, 1)) * 100));
  const continueStep = Object.values(storyProgress).find((story) => !story?.completed);

  const handleThemeSelect = (theme) => {
    const next = new URLSearchParams(searchParams);
    if (!theme || theme === "all") {
      next.delete("theme");
    } else {
      next.set("theme", theme);
    }
    setSearchParams(next, { replace: true });
  };

  const resetFilters = () => {
    setAuthorFilter("all");
    setPeriodFilter("all");
    setLanguageFilter("all");
    setDurationFilter("all");
    setSearchValue("");
    handleThemeSelect("all");
  };

  const openRoute = (journey) => {
    handleThemeSelect(journey.canonicalFocusTheme ?? journey.focusTheme);
    navigate(`/route/${journey.id}`);
  };

  useEffect(() => {
    const root = pageRef.current;
    if (!root) return undefined;
    const items = [...root.querySelectorAll(".explore-reveal")];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    items.forEach((item, index) => {
      item.style.setProperty("--reveal-delay", `${Math.min(index * 60, 300)}ms`);
      observer.observe(item);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <main ref={pageRef} className="explore-page heritage-archive-page">
      <section className="explore-archive-hero" style={{ backgroundImage: `url(${exploreHero})` }}>
        <div className="explore-archive-hero__content explore-reveal">
          <p className="heritage-kicker">{t("interactiveRoutesKicker")}</p>
          <h1>{t("interactiveRoutesTitle")}</h1>
          <p>{t("interactiveRoutesSubtitle")}</p>
          <div className="explore-archive-hero__rule" aria-hidden="true" />
          <div className="explore-archive-hero__actions">
            <button type="button" onClick={() => openRoute(primaryJourney)} className="heritage-button is-gold">
              {t("startRoute")}
            </button>
            <a href="#routes" className="heritage-button">
              {t("viewAllRoutes")}
            </a>
          </div>
        </div>
      </section>

      <div className="explore-archive-layout">
        <section className="explore-archive-main">
          <div className="explore-stat-band explore-reveal" aria-label={t("catalogStats")}>
            <article>
              <span className="heritage-stat-icon is-book" aria-hidden="true" />
              <strong>{localizedJourneys.length}</strong>
              <small>{t("routesCount")}</small>
            </article>
            <article>
              <span className="heritage-stat-icon is-quill" aria-hidden="true" />
              <strong>{localizedAuthors.length}+</strong>
              <small>{t("navAuthors")}</small>
            </article>
            <article>
              <span className="heritage-stat-icon is-stack" aria-hidden="true" />
              <strong>{localizedWorks.length}+</strong>
              <small>{t("navWorks")}</small>
            </article>
            <article>
              <span className="heritage-stat-icon is-globe" aria-hidden="true" />
              <strong>3</strong>
              <small>{t("language")}</small>
            </article>
          </div>

          <section className="explore-route-flow explore-reveal" aria-label={t("readingFlowTitle")}>
            <article>
              <span>1</span>
              <strong>{t("startRoute")}</strong>
              <p>{t("readingFlowStepOneText")}</p>
            </article>
            <article>
              <span>2</span>
              <strong>{t("compareLanguages")}</strong>
              <p>{t("chapterFlowText")}</p>
            </article>
            <article>
              <span>3</span>
              <strong>{t("viewProgress")}</strong>
              <p>{t("readingFlowStepThreeText")}</p>
            </article>
          </section>

          <section id="routes" className="explore-recommendations explore-reveal">
            <div className="heritage-section-head">
              <h2>{t("recommendedRoutes")}</h2>
              <button type="button" onClick={resetFilters}>{t("resetFilters")}</button>
            </div>

            <label className="explore-route-search">
              <span className="heritage-icon heritage-icon--search" aria-hidden="true" />
              <input
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder={t("searchPlaceholder")}
                aria-label={t("searchArchive")}
              />
            </label>

            <section className="explore-filter-card explore-filter-card--inline explore-reveal" aria-label={t("exploreFilters")}>
              <div className="explore-filter-card__head">
                <h2>{t("routeFilters")}</h2>
                <p>{t("routeFiltersHint")}</p>
              </div>
              <FilterSelect label={t("navAuthors")} value={authorFilter} onChange={setAuthorFilter} options={[{ value: "all", label: t("allAuthors") }, ...authorOptions.map((author) => ({ value: author, label: author }))]} />
              <FilterSelect label={t("period")} value={periodFilter} onChange={setPeriodFilter} options={[{ value: "all", label: t("allPeriods") }, ...periodOptions.map((period) => ({ value: period, label: period }))]} />
              <FilterSelect label={t("themes")} value={activeTheme} onChange={handleThemeSelect} options={[{ value: "all", label: t("allThemes") }, ...themeOptions]} />
              <FilterSelect label={t("language")} value={languageFilter} onChange={setLanguageFilter} options={[{ value: "all", label: t("allLanguages") }, { value: "kk", label: "KZ" }, { value: "ru", label: "RU" }, { value: "en", label: "EN" }]} />
              <FilterSelect label={t("duration")} value={durationFilter} onChange={setDurationFilter} options={[{ value: "all", label: t("anyDuration") }, { value: "short", label: t("shortRoute") }, { value: "medium", label: t("mediumRoute") }, { value: "long", label: t("longRoute") }]} />
              <button type="button" onClick={resetFilters}>{t("apply")}</button>
            </section>

            <div className="explore-route-grid">
              {filteredJourneys.slice(0, 4).map((journey, index) => {
                const routeWorks = journey.works
                  .map((id) => localizedWorks.find((work) => work.id === id))
                  .filter(Boolean);
                const cover = routeWorks[index % Math.max(routeWorks.length, 1)]?.image ?? primaryWork?.image;
                const completedSteps = routeWorks.filter((work) => completedStories.includes(work.id)).length;

                return (
                  <article className="explore-route-card" key={journey.id}>
                    <div className="explore-route-card__image" style={{ backgroundImage: `url(${cover})` }} />
                    <div className="explore-route-card__body">
                      <h3>{journey.title}</h3>
                      <p>{journey.description ?? journey.subtitle}</p>
                      <div className="explore-route-card__steps" aria-label={t("routeProgress")}>
                        {routeWorks.map((work, stepIndex) => (
                          <span
                            key={work.id}
                            className={stepIndex < Math.max(completedSteps, 1) ? "is-complete" : ""}
                          />
                        ))}
                      </div>
                      <div className="explore-route-card__meta">
                        <span>{routeWorks.length} {t("works").toLowerCase()}</span>
                        <span>{journey.minutes} {t("min")}</span>
                      </div>
                      <button type="button" onClick={() => openRoute(journey)}>
                        {completedSteps > 0 ? t("continue") : t("startRoute")}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="explore-continue-panel explore-reveal">
            <div className="explore-continue-panel__image" style={{ backgroundImage: `url(${primaryWork?.image})` }} />
            <div>
              <p className="heritage-kicker">{t("continueReading")}</p>
              <h2>{primaryJourney?.title}</h2>
              <span>{t("currentRoute")}</span>
              <strong>{t("stage")} {continueStep?.currentSceneIndex ? continueStep.currentSceneIndex + 1 : 3} {t("of")} {primaryJourney?.works?.length ?? 3}</strong>
              <div className="heritage-progress-line">
                <span style={{ width: `${progressPercent || 40}%` }} />
              </div>
            </div>
            <button type="button" onClick={() => openRoute(primaryJourney)} className="heritage-button is-gold">
              {t("continueReading")}
            </button>
            <aside>
              <p>{t("recommendedForYou")}</p>
              {localizedWorks.slice(0, 2).map((work) => (
                <Link key={work.id} to={`/reading/${work.id}`}>
                  <img src={work.image} alt="" />
                  <span>
                    <strong>{work.title}</strong>
                    <small>{work.themes.slice(0, 2).join(", ")}</small>
                  </span>
                </Link>
              ))}
            </aside>
          </section>
        </section>

        <aside className="explore-archive-aside">
          <section className="explore-progress-card explore-reveal">
            <h2>{t("yourProgress")}</h2>
            <div className="explore-progress-ring" style={{ "--value": `${progressPercent}%` }}>
              <strong>{progressPercent}%</strong>
            </div>
            <p>{t("completedRoutesText", { completed: completedCount, total: localizedJourneys.length })}</p>
            <Link to="/progress">{t("viewProgress")}</Link>
          </section>

          <section className="explore-notes-card explore-reveal">
            <h2>{t("reflectionsSaved")}</h2>
            <strong>{Object.keys(reflections).length}</strong>
            <p>{t("archiveNotesHint")}</p>
          </section>
        </aside>
      </div>
    </main>
  );
}

function FilterSelect({ label, value, onChange, options }) {
  return (
    <label>
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option value={option.value} key={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export default Explore;
