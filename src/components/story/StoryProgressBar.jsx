function StoryProgressBar({ current, total, label }) {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="story-progress">
      <div className="story-progress__top">
        <span>{label}</span>
        <strong>{percentage}%</strong>
      </div>
      <div
        className="story-progress__track"
        aria-hidden="true"
      >
        <div
          className="story-progress__fill"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export default StoryProgressBar;
