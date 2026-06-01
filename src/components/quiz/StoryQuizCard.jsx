import { useI18n } from "../../i18n/useI18n";

function StoryQuizCard({ quiz, selectedOptionId, onAnswer }) {
  const { t } = useI18n();
  const selectedOption = quiz.options.find((option) => option.id === selectedOptionId);

  return (
    <section className="story-quiz" aria-label={t("knowledgeCheck")}>
      <p className="story-quiz__eyebrow">{t("knowledgeCheck")}</p>
      <h3 className="story-quiz__question">{quiz.question}</h3>

      <div className="story-quiz__options" role="list">
        {quiz.options.map((option) => {
          const isSelected = selectedOptionId === option.id;
          const isCorrectSelected = isSelected && option.isCorrect;
          const isIncorrectSelected = isSelected && !option.isCorrect;

          return (
            <button
              key={option.id}
              type="button"
              className={[
                "story-quiz__option",
                isCorrectSelected ? "is-correct" : "",
                isIncorrectSelected ? "is-incorrect" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => onAnswer(option)}
              disabled={Boolean(selectedOptionId)}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      {selectedOption ? (
        <div className="story-quiz__feedback">
          <strong>
            {selectedOption.isCorrect ? t("correct") : t("tryAgainNextScene")}
          </strong>
          <p>{selectedOption.feedback}</p>
        </div>
      ) : null}
    </section>
  );
}

export default StoryQuizCard;
