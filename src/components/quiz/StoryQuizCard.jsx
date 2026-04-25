function StoryQuizCard({ quiz, selectedOptionId, onAnswer }) {
  const selectedOption = quiz.options.find((option) => option.id === selectedOptionId);

  return (
    <section className="story-quiz" aria-label="Knowledge check">
      <p className="story-quiz__eyebrow">Knowledge check</p>
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
          <strong>{selectedOption.isCorrect ? "Correct" : "Try again in the next scene"}</strong>
          <p>{selectedOption.feedback}</p>
        </div>
      ) : null}
    </section>
  );
}

export default StoryQuizCard;
