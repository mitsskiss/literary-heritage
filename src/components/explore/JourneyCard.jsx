import { useI18n } from "../../i18n/I18nContext";

function JourneyCard({ journey, worksCount, onBegin }) {
  const { t } = useI18n();
  return (
    <article className="explore-journey-card">
      <h3 className="explore-journey-card__title">{journey.title}</h3>
      <p className="explore-journey-card__description">{journey.description}</p>

      <div className="explore-journey-card__meta">
        <span>{worksCount} {t("works").toLowerCase()}</span>
        <span>{journey.minutes} {t("min")}</span>
        <span>{journey.level}</span>
      </div>

      <button type="button" className="explore-journey-card__button" onClick={onBegin}>
        {t("startRoute")}
      </button>
    </article>
  );
}

export default JourneyCard;
