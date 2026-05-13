import { Link } from "react-router-dom";
import { useI18n } from "../../i18n/I18nContext";

function ExploreWorkCard({ work, onThemeSelect }) {
  const { t } = useI18n();
  return (
    <article className="explore-work-card">
      <Link to={`/reading/${work.id}`} className="explore-work-card__visualLink">
        <div
          className="explore-work-card__visual"
          style={{ backgroundImage: `url(${work.image})` }}
        >
          <div className="explore-work-card__visualShade" />
        </div>
      </Link>

      <div className="explore-work-card__body">
        <div className="explore-work-card__top">
          <p className="explore-work-card__period">{work.period}</p>
          <span className="explore-work-card__time">{work.readingTime} {t("min")}</span>
        </div>

        <Link to={`/reading/${work.id}`} className="explore-work-card__titleLink">
          <h3 className="explore-work-card__title">{work.title}</h3>
        </Link>

        <Link
          to={`/author/${encodeURIComponent(work.canonicalAuthor ?? work.author)}`}
          className="explore-work-card__author"
        >
          {work.author}
        </Link>

        <p className="explore-work-card__teaser">{work.description}</p>
        <p className="explore-work-card__relevance">{work.whyNow}</p>

        <div className="explore-work-card__tags">
          {work.themes.map((theme) => (
            <button
              key={theme}
              type="button"
              className="explore-work-card__tag"
              onClick={() => onThemeSelect(theme)}
            >
              {theme}
            </button>
          ))}
        </div>

        <div className="explore-work-card__footer">
          <span className="explore-work-card__progress">
            {t("routeReady", { percent: Math.min(100, work.fragments.length * 28) })}
          </span>
          <Link to={`/reading/${work.id}`} className="explore-work-card__action">
            {t("openWork")}
          </Link>
        </div>
      </div>
    </article>
  );
}

export default ExploreWorkCard;
