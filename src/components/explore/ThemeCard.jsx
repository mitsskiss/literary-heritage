import { useI18n } from "../../i18n/I18nContext";

function ThemeCard({ theme, relatedWorks, onExplore }) {
  const { t } = useI18n();
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
        {t("openTheme")}
      </button>
    </article>
  );
}

export default ThemeCard;
