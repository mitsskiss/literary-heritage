function SectionIntro({ eyebrow, title, description, meta }) {
  return (
    <div className="explore-section-intro">
      {eyebrow ? <p className="explore-section-intro__eyebrow">{eyebrow}</p> : null}
      <div className="explore-section-intro__row">
        <div>
          <h2 className="explore-section-intro__title">{title}</h2>
          {description ? (
            <p className="explore-section-intro__description">{description}</p>
          ) : null}
        </div>
        {meta ? <span className="explore-section-intro__meta">{meta}</span> : null}
      </div>
    </div>
  );
}

export default SectionIntro;
