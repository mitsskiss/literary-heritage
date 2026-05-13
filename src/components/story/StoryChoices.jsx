import { useI18n } from "../../i18n/I18nContext";

function StoryChoices({ choices, selectedChoiceId, onSelect }) {
  const { t } = useI18n();
  return (
    <div className="story-choices" role="list" aria-label={t("sceneChoices")}>
      {choices.map((choice) => {
        const isSelected = selectedChoiceId === choice.id;

        return (
          <button
            key={choice.id}
            type="button"
            className={`story-choices__button ${isSelected ? "is-selected" : ""}`}
            onClick={() => onSelect(choice)}
            disabled={Boolean(selectedChoiceId)}
          >
            {choice.label}
          </button>
        );
      })}
    </div>
  );
}

export default StoryChoices;
