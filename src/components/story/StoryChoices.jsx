function StoryChoices({ choices, selectedChoiceId, onSelect }) {
  return (
    <div className="story-choices" role="list" aria-label="Scene choices">
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
