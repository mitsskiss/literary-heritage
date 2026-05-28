import { Link } from "react-router-dom";
import { authors } from "../data/authors";
import { works } from "../data/works";
import { useI18n } from "../i18n/I18nContext";
import { mergeAdminAuthors, mergeAdminWorks } from "../admin/adminContent";
import { useAdminContent } from "../hooks/useAdminContent";
import "./Author.css";

function Authors() {
  const { t, language, localizeAuthors, localizeWorks } = useI18n();
  const { content: adminContent } = useAdminContent();
  const localizedAuthors = mergeAdminAuthors(localizeAuthors(authors), adminContent, language);
  const localizedWorks = mergeAdminWorks(localizeWorks(works), adminContent, language);

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

        <section className="authors-grid">
          {localizedAuthors.map((author) => {
            const authorWorks = localizedWorks.filter(
              (work) => work.canonicalAuthor === author.canonicalName
            );

            return (
              <Link
                key={author.canonicalName}
                to={`/author/${encodeURIComponent(author.canonicalName)}`}
                className="author-card"
              >
                <div className="author-card__portrait">
                  <img
                    src={author.image}
                    alt={author.name}
                    className="author-avatar"
                  />
                </div>

                <div className="author-card__body">
                  <p className="author-card__period">{author.period}</p>
                  <h2>{author.name}</h2>

                  <p>{author.description}</p>

                  <p className="author-card__meta">
                    {t("worksInProject", { count: authorWorks.length })}
                  </p>

                  <span className="author-link">
                    {t("openAuthor")} <span aria-hidden="true">→</span>
                  </span>
                </div>
              </Link>
            );
          })}
        </section>
      </div>
    </main>
  );
}

export default Authors;

