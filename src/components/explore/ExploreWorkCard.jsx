import { Link } from "react-router-dom";

function ExploreWorkCard({ work, onThemeSelect }) {
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
          <span className="explore-work-card__time">{work.readingTime} min</span>
        </div>

        <Link to={`/reading/${work.id}`} className="explore-work-card__titleLink">
          <h3 className="explore-work-card__title">{work.title}</h3>
        </Link>

        <Link
          to={`/author/${encodeURIComponent(work.author)}`}
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
            {Math.min(100, work.fragments.length * 28)}% guide ready
          </span>
          <Link to={`/reading/${work.id}`} className="explore-work-card__action">
            Explore Work
          </Link>
        </div>
      </div>
    </article>
  );
}

export default ExploreWorkCard;
