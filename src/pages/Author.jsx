import { useParams, Link } from "react-router-dom";
import { works } from "../data/works";
import { authors } from "../data/authors";
import { useI18n } from "../i18n/I18nContext";
import { useProgressStore } from "../store/useProgressStore";
import { mergeAdminAuthors, mergeAdminWorks } from "../admin/adminContent";
import { useAdminContent } from "../hooks/useAdminContent";
import "./Author.css";

function Author() {
  const { t, language, localizeAuthors, localizeWorks } = useI18n();
  const { favorites, toggleFavorite } = useProgressStore();
  const { content: adminContent } = useAdminContent();
  const { name } = useParams();

  const localizedAuthors = mergeAdminAuthors(localizeAuthors(authors), adminContent, language);
  const localizedWorks = mergeAdminWorks(localizeWorks(works), adminContent, language);
  const authorInfo = localizedAuthors.find((a) => a.canonicalName === name);
  const authorWorks = localizedWorks.filter((w) => w.canonicalAuthor === name);

  if (!authorInfo || !authorWorks.length) {
    return (
      <main className="author-page heritage-archive-page">
        <div className="author-page__container">
          <section className="author-page__notFound heritage-panel">
            <h1>{t("authorNotFound")}</h1>
            <p>{t("authorNotFoundText")}</p>
            <Link to="/authors" className="heritage-button heritage-button--primary">
              {t("backToAuthors")}
            </Link>
          </section>
        </div>
      </main>
    );
  }

  const themes = [...new Set(authorWorks.flatMap((work) => work.themes ?? []))];
  const philosophyNotes = [...new Set(authorWorks.map((work) => work.description).filter(Boolean))];
  const isAuthorFavorite = favorites.some(
    (favorite) => favorite.type === "author" && favorite.id === authorInfo.canonicalName
  );
  const initials = authorInfo.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const timelineItems = authorWorks
    .map((work) => ({
      id: work.id,
      title: work.title,
      year: work.year || t("unknownYear"),
      themes: work.themes || [],
      focus: work.description,
    }))
    .sort((a, b) => {
      const left = Number(a.year);
      const right = Number(b.year);
      if (Number.isNaN(left)) return 1;
      if (Number.isNaN(right)) return -1;
      return left - right;
    });

  return (
    <main className="author-page heritage-archive-page">
      <div className="author-page__container">
        <Link to="/authors" className="author-page__back">
          ← {t("backToAuthors")}
        </Link>

        <section className="author-profile-hero heritage-panel">
          <div className="author-profile-hero__media">
            {authorInfo.image ? (
              <img
                src={authorInfo.image}
                alt={authorInfo.name}
                className="author-profile-hero__portrait"
              />
            ) : (
              <div className="author-profile-hero__fallback" aria-hidden="true">
                {initials}
              </div>
            )}
          </div>

          <div className="author-profile-hero__content">
            <p className="heritage-kicker">{t("literaryProfile")}</p>
            <h1>{authorInfo.name}</h1>
            {authorInfo.period ? <p className="author-profile-hero__period">{authorInfo.period}</p> : null}
            <p className="author-profile-hero__description">{authorInfo.description}</p>

            <div className="author-profile-hero__actions">
              <button
                type="button"
                className={`heritage-button heritage-button--primary ${isAuthorFavorite ? "is-saved" : ""}`}
                onClick={() =>
                  toggleFavorite({
                    type: "author",
                    id: authorInfo.canonicalName,
                    title: authorInfo.name,
                    subtitle: authorInfo.period,
                    href: `/author/${encodeURIComponent(authorInfo.canonicalName)}`,
                  })
                }
              >
                {isAuthorFavorite ? t("savedFavorite") : t("saveFavorite")}
              </button>
              <Link to="/works" className="heritage-button">
                {t("openAllWorks")}
              </Link>
            </div>
          </div>
        </section>

        <section className="author-profile-statband">
          <article>
            <strong>{authorWorks.length}</strong>
            <span>{t("works")}</span>
          </article>
          <article>
            <strong>{themes.length}</strong>
            <span>{t("themes")}</span>
          </article>
          <article>
            <strong>{timelineItems[0]?.year ?? "—"}</strong>
            <span>{t("period")}</span>
          </article>
        </section>

        <section className="author-profile-layout">
          <aside className="author-profile-side heritage-panel">
            <h2>{t("themesExplored")}</h2>
            <div className="author-profile-themes">
              {themes.map((theme) => (
                <span key={theme}>{theme}</span>
              ))}
            </div>
          </aside>

          <div className="author-profile-main">
            {philosophyNotes.length > 0 ? (
              <section className="author-profile-section heritage-panel">
                <p className="heritage-kicker">{t("philosophyFocus")}</p>
                {philosophyNotes.slice(0, 3).map((note) => (
                  <p key={note}>{note}</p>
                ))}
              </section>
            ) : null}

            <section className="author-profile-section heritage-panel">
              <div className="author-profile-section__head">
                <p className="heritage-kicker">{t("evolutionIdeas")}</p>
                <h2>{t("works")}</h2>
              </div>
              <div className="author-profile-timeline">
                {timelineItems.map((item, index) => (
                  <article key={item.id} className="author-profile-timeline__item">
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <div>
                      <small>{item.year}</small>
                      <Link to={`/reading/${item.id}`}>{item.title}</Link>
                      <p>{item.focus}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </section>

        <section className="author-profile-works">
          {authorWorks.map((work) => (
            <Link
              key={work.id}
              to={`/reading/${work.id}`}
              className="author-work-card"
            >
              <div className="author-work-card__image">
                {work.image ? <img src={work.image} alt="" /> : null}
              </div>
              <div className="author-work-card__body">
                <small>{work.year || t("unknownYear")}</small>
                <h3>{work.title}</h3>
                <p>{work.description}</p>
                <div className="author-work-card__tags">
                  {(work.themes ?? []).slice(0, 3).map((theme) => (
                    <span key={theme}>{theme}</span>
                  ))}
                </div>
                <strong>{t("openWork")} →</strong>
              </div>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}

export default Author;
