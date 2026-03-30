import { Link, useSearchParams } from "react-router-dom";
import { useState } from "react";
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
import ThemeCard from "../components/explore/ThemeCard";
import "./Explore.css";

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "title-asc", label: "Title A-Z" },
  { value: "time-asc", label: "Shortest read" },
  { value: "period-asc", label: "Period" },
];

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
  const [searchValue, setSearchValue] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [periodFilter, setPeriodFilter] = useState("all");
  const [sortValue, setSortValue] = useState("featured");
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTheme = searchParams.get("theme") || "all";

  const enrichedWorks = works.map((work) => ({
    ...work,
    ...workMetadataById[work.id],
  }));

  const typeOptions = [...new Set(enrichedWorks.map((work) => work.type))];
  const periodOptions = [...new Set(enrichedWorks.map((work) => work.period))];
  const themeOptions = THEME_ORDER.filter((theme) =>
    enrichedWorks.some((work) => work.themes.includes(theme))
  );

  const normalizedQuery = searchValue.trim().toLowerCase();

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
    literaryJourneys.find((journey) => journey.focusTheme === recommendationTheme) ??
    literaryJourneys[0];

  const recommendedWorks = enrichedWorks
    .filter(
      (work) =>
        work.id !== spotlightWork.id && work.themes.includes(recommendationTheme)
    )
    .slice(0, 2);

  const visibleThemes = themeCollections.slice(0, 4);

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
    handleThemeSelect(theme);
  };

  const resetFilters = () => {
    setSearchValue("");
    setTypeFilter("all");
    setPeriodFilter("all");
    setSortValue("featured");
    handleThemeSelect("all");
  };

  return (
    <main className="explore-page">
      <div className="explore-page__container">
        <section className="explore-hero">
          <div className="explore-hero__copy">
            <h1 className="explore-hero__title">Explore Literary Worlds</h1>
            <p className="explore-hero__subtitle">
              Discover literature through themes, periods, and guided routes that
              feel quieter, more curated, and easier to navigate.
            </p>
          </div>
        </section>

        <section className="explore-toolbar" aria-label="Explore filters">
          <div className="explore-toolbar__filters">
            <label className="explore-toolbar__search">
              <input
                id="explore-search"
                type="search"
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Search by title, author, theme, or idea"
                aria-label="Search the archive"
              />
            </label>

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
                  aria-label="Filter by type"
                >
                  <option value="all">All types</option>
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
                  aria-label="Filter by historical period"
                >
                  <option value="all">All periods</option>
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
                  aria-label="Sort works"
                >
                  {SORT_OPTIONS.map((option) => (
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
                Reset filters
              </button>
            </div>
          </div>
        </section>

        <section className="explore-section">
          <div className="explore-section__head">
            <h2 className="explore-section__title">Begin with a route, not a list.</h2>
          </div>

          <div className="explore-journeys">
            <article className="explore-journeys__feature">
              <h3 className="explore-journeys__featureTitle">{primaryJourney.title}</h3>
              <p className="explore-journeys__featureText">
                {primaryJourney.description}
              </p>

              <div className="explore-journeys__featureMeta">
                <span>{primaryJourney.works.length} works</span>
                <span>{primaryJourney.minutes} min</span>
                <span>{primaryJourney.level}</span>
              </div>

              <button
                type="button"
                className="explore-journeys__featureAction"
                onClick={() => beginJourney(primaryJourney.focusTheme)}
              >
                Begin journey
              </button>
            </article>

            <div className="explore-journeys__grid">
              {literaryJourneys
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

        <section className="explore-section">
          <div className="explore-section__head">
            <h2 className="explore-section__title">
              Let one work pull you into the archive.
            </h2>
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
                <span>{spotlightWork.readingTime} min</span>
              </div>

              <h3 className="explore-spotlight__title">{spotlightWork.title}</h3>
              <p className="explore-spotlight__intro">
                {spotlightWork.spotlightIntro}
              </p>

              <div className="explore-spotlight__question">
                <span className="explore-spotlight__label">Central tension</span>
                <p>{spotlightWork.conflict}</p>
              </div>

              <p className="explore-spotlight__why">
                Why it matters today: {spotlightWork.whyNow}
              </p>

              <Link
                to={`/reading/${spotlightWork.id}`}
                className="explore-spotlight__action"
              >
                Enter the story
              </Link>
            </div>
          </div>
        </section>

        <section className="explore-section">
          <div className="explore-section__head explore-section__head--split">
            <h2 className="explore-section__title">Readable, curated, and filtered.</h2>
            <p className="explore-section__meta">{filteredWorks.length} visible works</p>
          </div>

          {filteredWorks.length === 0 ? (
            <div className="explore-empty">
              <h3 className="explore-empty__title">Nothing fits the current path.</h3>
              <p className="explore-empty__text">
                Reset the filters and reopen the archive from a broader point of entry.
              </p>
              <button
                type="button"
                className="explore-empty__action"
                onClick={resetFilters}
              >
                Reset filters
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

        <section className="explore-section">
          <div className="explore-section__head">
            <h2 className="explore-section__title">A few strong doors into the archive.</h2>
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

        <section className="explore-section">
          <div className="explore-section__head">
            <h2 className="explore-section__title">
              Keep the supportive layer present, but quiet.
            </h2>
          </div>

          <div className="explore-signals">
            <section className="explore-signals__card">
              <p className="explore-signals__label">Progress</p>
              <div className="explore-signals__stats">
                <div>
                  <span>Explored works</span>
                  <strong>{gamificationData.progress.exploredWorks}</strong>
                </div>
                <div>
                  <span>Reflections saved</span>
                  <strong>{gamificationData.progress.reflectionsSaved}</strong>
                </div>
                <div>
                  <span>Active journey</span>
                  <strong>{gamificationData.progress.activeJourney}</strong>
                </div>
              </div>

              <div className="explore-signals__badges">
                {gamificationData.badges.slice(0, 4).map((badge) => (
                  <span key={badge}>{badge}</span>
                ))}
              </div>
            </section>

            <section className="explore-signals__card">
              <p className="explore-signals__label">Recommended for you</p>
              <div className="explore-signals__recommendations">
                {recommendedWorks.map((work) => (
                  <article key={work.id} className="explore-signals__recommendation">
                    <p>
                      Because you explored{" "}
                      <strong>{recommendationTheme.toLowerCase()}</strong>
                    </p>
                    <h3>{work.title}</h3>
                    <span>{work.author}</span>
                    <Link to={`/reading/${work.id}`}>Open work</Link>
                  </article>
                ))}
              </div>
            </section>

            <section className="explore-signals__card">
              <p className="explore-signals__label">Community pulse</p>
              <ul className="explore-signals__list">
                {communityPreview.discussions.slice(0, 3).map((discussion) => (
                  <li key={discussion}>{discussion}</li>
                ))}
              </ul>
              <div className="explore-signals__footnote">
                <span>{communityPreview.counters.comments} comments</span>
                <span>{communityPreview.counters.likes} likes</span>
              </div>
            </section>

            <section className="explore-signals__card">
              <p className="explore-signals__label">Context materials</p>
              <div className="explore-signals__media">
                {multimediaContext.slice(0, 3).map((item) => (
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

        <section className="explore-cta">
          <h2 className="explore-cta__title">
            Move deeper into the archive when you are ready.
          </h2>
          <p className="explore-cta__text">
            Explore all works, begin a guided route, or keep building a more
            personal reading path.
          </p>

          <div className="explore-cta__actions">
            <Link to="/explore" className="explore-cta__action is-primary">
              Explore all works
            </Link>
            <button
              type="button"
              className="explore-cta__action"
              onClick={() => beginJourney(primaryJourney.focusTheme)}
            >
              Start a guided route
            </button>
            <button type="button" className="explore-cta__action">
              Create an account
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Explore;
