import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { works } from "../data/works";
import { workMetadataById } from "../data/exploreData";
import fallbackCover from "../assets/logo.png";
import { useI18n } from "../i18n/I18nContext";
import { useProgressStore } from "../store/useProgressStore";
import { mergeAdminWorks } from "../admin/adminContent";
import { useAdminContent } from "../hooks/useAdminContent";
import "./Works.css";

function Works() {
  const { t, language, localizeWorks, localizeMetadata } = useI18n();
  const [query, setQuery] = useState("");
  const [activeTheme, setActiveTheme] = useState("all");
  const { content: adminContent } = useAdminContent();
  const favorites = useProgressStore((state) => state.favorites);
  const toggleFavorite = useProgressStore((state) => state.toggleFavorite);

  const catalogWorks = useMemo(
    () =>
      mergeAdminWorks(localizeWorks(works), adminContent, language).map((work) => ({
        ...work,
        ...localizeMetadata(work.id, {
          ...(workMetadataById[work.id] ?? {}),
          period: work.period ?? workMetadataById[work.id]?.period,
          type: work.type ?? workMetadataById[work.id]?.type,
          mood: work.mood ?? workMetadataById[work.id]?.mood,
          readingTime: work.readingTime ?? workMetadataById[work.id]?.readingTime,
        }),
      })),
    [adminContent, language, localizeMetadata, localizeWorks]
  );

  const themes = useMemo(
    () => [...new Set(catalogWorks.flatMap((work) => work.themes))],
    [catalogWorks]
  );

  const normalizedQuery = query.trim().toLowerCase();
  const visibleWorks = catalogWorks.filter((work) => {
    const matchesTheme = activeTheme === "all" || work.themes.includes(activeTheme);
    const matchesQuery =
      normalizedQuery.length === 0 ||
      [work.title, work.author, work.period, work.type, work.description]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(normalizedQuery)) ||
      work.themes.some((theme) => theme.toLowerCase().includes(normalizedQuery));

    return matchesTheme && matchesQuery;
  });

  const visibleThemes = [...new Set(visibleWorks.flatMap((work) => work.themes))];
  const isFavorite = (workId) =>
    favorites.some((favorite) => favorite.type === "work" && favorite.id === workId);

  return (
    <main className="works-page">
      <div className="works-page__container">
        <section className="works-hero">
          <p className="works-hero__kicker">{t("worksKicker")}</p>
          <div className="works-hero__content">
            <div>
              <h1>{t("allWorksTitle")}</h1>
              <p>{t("allWorksSubtitle")}</p>
            </div>
            <div className="works-hero__stats" aria-label={t("catalogStats")}>
              <span>
                <strong>{visibleWorks.length}</strong>
                {t("works")}
              </span>
              <span>
                <strong>{visibleThemes.length}</strong>
                {t("themes")}
              </span>
            </div>
          </div>
        </section>

        <section className="works-toolbar" aria-label={t("worksFilters")}>
          <label className="works-toolbar__search">
            <span>{t("searchArchive")}</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("searchPlaceholder")}
            />
          </label>

          <div className="works-toolbar__themes" aria-label={t("themes")}>
            <button
              type="button"
              className={activeTheme === "all" ? "is-active" : ""}
              onClick={() => setActiveTheme("all")}
            >
              {t("allThemes")}
            </button>
            {themes.map((theme) => (
              <button
                key={theme}
                type="button"
                className={activeTheme === theme ? "is-active" : ""}
                onClick={() => setActiveTheme(theme)}
              >
                {theme}
              </button>
            ))}
          </div>
        </section>

        {visibleWorks.length === 0 ? (
          <section className="works-empty">
            <h2>{t("noResults")}</h2>
            <p>{t("noResultsText")}</p>
          </section>
        ) : (
          <section className="works-grid" aria-label={t("allWorksTitle")}>
            {visibleWorks.map((work) => (
              <article className="works-card" key={work.id}>
                <Link
                  to={`/reading/${work.id}`}
                  className="works-card__image"
                  aria-label={`${t("openWork")}: ${work.title}`}
                >
                  <img
                    src={work.image || fallbackCover}
                    alt=""
                    onError={(event) => {
                      event.currentTarget.src = fallbackCover;
                    }}
                  />
                  <span>{work.year}</span>
                </Link>
                <button
                  type="button"
                  className={`works-card__favorite ${isFavorite(work.id) ? "is-favorite" : ""}`}
                  aria-label={
                    isFavorite(work.id)
                      ? `${t("savedFavorite")}: ${work.title}`
                      : `${t("saveFavorite")}: ${work.title}`
                  }
                  title={isFavorite(work.id) ? t("savedFavorite") : t("saveFavorite")}
                  onClick={() =>
                    toggleFavorite({
                      type: "work",
                      id: work.id,
                      title: work.title,
                      subtitle: work.author,
                      href: `/reading/${work.id}`,
                    })
                  }
                >
                  {isFavorite(work.id) ? "♥" : "♡"}
                </button>

                <div className="works-card__body">
                  <div className="works-card__meta">
                    <span>{work.period}</span>
                    <span>{work.readingTime} {t("min")}</span>
                  </div>

                  <h2>{work.title}</h2>
                  <Link
                    to={`/author/${encodeURIComponent(work.canonicalAuthor ?? work.author)}`}
                    className="works-card__author"
                  >
                    {work.author}
                  </Link>
                  <p>{work.description}</p>

                  <div className="works-card__themes">
                    {work.themes.slice(0, 4).map((theme) => (
                      <button
                        type="button"
                        key={theme}
                        onClick={() => setActiveTheme(theme)}
                      >
                        {theme}
                      </button>
                    ))}
                  </div>

                  <div className="works-card__actions">
                    <Link to={`/reading/${work.id}`} className="works-card__primary">
                      {t("startReading")}
                    </Link>
                    <Link to={`/explore?theme=${encodeURIComponent(work.themes[0])}`}>
                      {t("exploreTheme")}
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}

export default Works;
