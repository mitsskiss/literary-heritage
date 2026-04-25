function ThemeCard({ theme, relatedWorks, onExplore }) {
  return (
    <article className="explore-theme-card">
      <h3 className="explore-theme-card__title">{theme.name}</h3>
      <p className="explore-theme-card__description">{theme.description}</p>

      <ul className="explore-theme-card__works">
        {relatedWorks.map((work) => (
          <li key={work.id}>{work.title}</li>
        ))}
      </ul>

      <button type="button" className="explore-theme-card__button" onClick={onExplore}>
        Open theme
      </button>
    </article>
  );
}

export default ThemeCard;
