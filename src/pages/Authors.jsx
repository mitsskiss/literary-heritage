import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { authors } from "../data/authors";
import { works } from "../data/works";
import { useI18n } from "../i18n/useI18n";
import { mergeAdminAuthors, mergeAdminWorks } from "../admin/adminContent";
import { useAdminContent } from "../hooks/useAdminContent";
import AuthorPortrait from "../components/AuthorPortrait";
import { getAuthorsWithPortrait, getVisibleWorks } from "../utils/authorPortraits";
import "./Author.css";

function Authors() {
  const { t, language, localizeAuthors, localizeWorks } = useI18n();
  const { content: adminContent } = useAdminContent();
  const localizedAuthors = getAuthorsWithPortrait(
    mergeAdminAuthors(localizeAuthors(authors), adminContent, language)
  );
  const localizedWorks = getVisibleWorks(
    mergeAdminWorks(localizeWorks(works), adminContent, language),
    localizedAuthors
  );
  const [query, setQuery] = useState("");
  const [periodFilter, setPeriodFilter] = useState("all");

  const authorRows = useMemo(
    () =>
      localizedAuthors.map((author) => ({
        author,
        works: localizedWorks.filter(
          (work) => work.canonicalAuthor === author.canonicalName
        ),
      })),
    [localizedAuthors, localizedWorks]
  );
  const periods = useMemo(
    () => [...new Set(localizedAuthors.map((author) => author.period).filter(Boolean))],
    [localizedAuthors]
  );
  const visibleAuthors = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return authorRows.filter(({ author, works: authorWorks }) => {
      const matchesPeriod =
        periodFilter === "all" || author.period === periodFilter;
      const searchableText = [
        author.name,
        author.canonicalName,
        author.period,
        author.description,
        ...(author.keyIdeas ?? []),
        ...(author.mainWorks ?? []),
        ...authorWorks.map((work) => work.title),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return matchesPeriod && (!normalizedQuery || searchableText.includes(normalizedQuery));
    });
  }, [authorRows, periodFilter, query]);

  return (
    <main className="authors-page heritage-archive-page">
      <div className="authors-page__container">
        <header className="authors-hero heritage-panel">
          <div>
            <p className="heritage-kicker">{t("authorsKicker")}</p>
            <h1>{t("authorsTitle")}</h1>
            <p>{t("authorsSubtitle")}</p>
          </div>
          <div className="authors-hero__seal" aria-label={t("writersInCollection", { count: localizedAuthors.length })}>
            <strong>{localizedAuthors.length}</strong>
            <span>{t("navAuthors")}</span>
          </div>
        </header>

        <section className="authors-tools heritage-panel" aria-label={t("worksFilters")}>
          <label>
            <span>{t("searchArchive")}</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("authorsSearchPlaceholder")}
            />
          </label>

          <label>
            <span>{t("period")}</span>
            <select
              value={periodFilter}
              onChange={(event) => setPeriodFilter(event.target.value)}
            >
              <option value="all">{t("authorsAllPeriods")}</option>
              {periods.map((period) => (
                <option value={period} key={period}>
                  {period}
                </option>
              ))}
            </select>
          </label>

          <p className="authors-count-note">
            {t("writersInCollection", { count: visibleAuthors.length })}
          </p>
        </section>

        <section className="authors-grid">
          {visibleAuthors.map(({ author, works: authorWorks }) => {
            return (
              <Link
                key={author.canonicalName}
                to={`/author/${encodeURIComponent(author.canonicalName)}`}
                className="author-card"
              >
                <div className="author-card__portrait">
                  <AuthorPortrait author={author} displayName={author.name} language={language} loading="eager" />
                </div>

                <div className="author-card__body">
                  <p className="author-card__period">{author.period}</p>
                  <h2>{author.name}</h2>

                  <p>{author.description}</p>

                  <p className="author-card__meta">
                    {t("worksInProject", { count: authorWorks.length })}
                  </p>

                  <span className="author-link">
                    {t("openAuthor")} <span aria-hidden="true">{"\u2192"}</span>
                  </span>
                </div>
              </Link>
            );
          })}
        </section>

        {visibleAuthors.length === 0 ? (
          <section className="authors-empty heritage-panel" aria-live="polite">
            <h2>{t("authorsNoResults")}</h2>
            <p>{t("authorsNoResultsText")}</p>
          </section>
        ) : null}
      </div>
    </main>
  );
}

export default Authors;
