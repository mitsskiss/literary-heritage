function JourneyCard({ journey, worksCount, onBegin }) {
  return (
    <article className="explore-journey-card">
      <h3 className="explore-journey-card__title">{journey.title}</h3>
      <p className="explore-journey-card__description">{journey.description}</p>

      <div className="explore-journey-card__meta">
        <span>{worksCount} works</span>
        <span>{journey.minutes} min</span>
        <span>{journey.level}</span>
      </div>

      <button type="button" className="explore-journey-card__button" onClick={onBegin}>
        Start route
      </button>
    </article>
  );
}

export default JourneyCard;
