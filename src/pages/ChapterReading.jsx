import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { works } from "../data/works";
import {
  getChapterPath,
  getStoryBookByWorkId,
  getStoryChapterByWorkAndNumber,
} from "../data/stories";
import { useProgressStore } from "../store/useProgressStore";
import "./ChapterReading.css";

function ChapterReading() {
  const { id, chapterNumber } = useParams();
  const work = works.find((item) => item.id === id);
  const storyBook = getStoryBookByWorkId(id);
  const chapter = getStoryChapterByWorkAndNumber(id, chapterNumber);

  const {
    xp,
    streak,
    lives,
    storyProgress,
    migrateLegacyProgress,
    ensureStory,
    recordChoice,
    advanceScene,
    completeStory,
  } = useProgressStore();
  const [xpPulse, setXpPulse] = useState(null);
  const [progressGlow, setProgressGlow] = useState(false);

  useEffect(() => {
    migrateLegacyProgress();

    if (chapter) {
      ensureStory(chapter.id);
    }
  }, [chapter, ensureStory, migrateLegacyProgress]);

  if (!work || !storyBook || !chapter) {
    return (
      <main className="chapter-page">
        <div className="chapter-page__container">
          <div className="chapter-fallback">
            <h1 className="chapter-fallback__title">Chapter not found</h1>
            <p className="chapter-fallback__text">
              This reading route could not be opened from the current archive.
            </p>
            <Link to="/explore" className="chapter-fallback__action">
              Back to explore
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const progress = storyProgress[chapter.id] ?? {
    currentSceneIndex: 0,
    completed: false,
    earnedXp: 0,
    choices: {},
  };

  const currentScene = chapter.scenes[progress.currentSceneIndex];
  const selectedChoiceId = currentScene
    ? progress.choices[currentScene.id]
    : null;
  const selectedChoice = currentScene?.choices.find(
    (choice) => choice.id === selectedChoiceId
  );
  const isLastScene = progress.currentSceneIndex === chapter.scenes.length - 1;
  const isCompleted = progress.completed;
  const correctAnswers = chapter.scenes.reduce((sum, scene) => {
    const choiceId = progress.choices[scene.id];
    const selected = scene.choices.find((choice) => choice.id === choiceId);

    return sum + (selected?.result?.isCorrect ? 1 : 0);
  }, 0);
  const nextChapter = storyBook.chapters.find(
    (item) => item.chapterNumber === chapter.chapterNumber + 1
  );
  const visibleSceneNumber = Math.min(
    progress.currentSceneIndex + 1,
    chapter.scenes.length
  );
  const chapterProgressPercent =
    chapter.scenes.length > 0
      ? Math.round(((visibleSceneNumber - 1) / chapter.scenes.length) * 100)
      : 0;

  const handleChoice = (choice) => {
    recordChoice(chapter.id, currentScene.id, choice.id, choice.xp);
    setXpPulse({
      id: `${chapter.id}-${currentScene.id}-${choice.id}`,
      value: choice.xp,
      tone: choice.result.tone,
      status: choice.result.status,
    });

    if (choice.result.isCorrect) {
      setProgressGlow(true);
    }
  };

  useEffect(() => {
    if (!xpPulse) return undefined;

    const timeoutId = window.setTimeout(() => {
      setXpPulse(null);
    }, 1600);

    return () => window.clearTimeout(timeoutId);
  }, [xpPulse]);

  useEffect(() => {
    if (!progressGlow) return undefined;

    const timeoutId = window.setTimeout(() => {
      setProgressGlow(false);
    }, 1200);

    return () => window.clearTimeout(timeoutId);
  }, [progressGlow]);

  const handleContinue = () => {
    if (isLastScene) {
      completeStory(chapter.id);
      return;
    }

    advanceScene(chapter.id, chapter.scenes.length);
  };

  return (
    <main className="chapter-page">
      <div className="chapter-page__container">
        {xpPulse ? (
          <div
            className={`chapter-xp-toast is-${xpPulse.tone}`}
            aria-live="polite"
          >
            <span className="chapter-xp-toast__icon">★</span>
            <div className="chapter-xp-toast__content">
              <strong>+{xpPulse.value} XP</strong>
              <span>{xpPulse.status}</span>
            </div>
          </div>
        ) : null}

        <section className="chapter-topbar">
          <div className="chapter-topbar__header">
            <Link to={`/reading/${work.id}`} className="chapter-topbar__backButton" aria-label="Back to book page">
              ‹
            </Link>

            <div className="chapter-topbar__main">
              <h1 className="chapter-topbar__title">{work.title}</h1>
              <p className="chapter-topbar__subtitle">
                Chapter {chapter.chapterNumber} · {chapter.chapterTitle}
              </p>
            </div>
          </div>

          <div className="chapter-topbar__status">
            <div className="chapter-topbar__progressBlock">
              <div className="chapter-topbar__progressLabels">
                <span>Scene {visibleSceneNumber} of {chapter.scenes.length}</span>
                <span>{chapterProgressPercent}% route</span>
              </div>
              <div className="chapter-topbar__progressTrack" aria-hidden="true">
                <div
                  className={`chapter-topbar__progressFill ${
                    progressGlow ? "is-glowing" : ""
                  }`}
                  style={{ width: `${chapterProgressPercent}%` }}
                />
              </div>
            </div>

              <div className="chapter-topbar__meta">
              <span className="chapter-topbar__metric">
                <strong>🔥</strong> {streak}
              </span>
              <span className="chapter-topbar__metric">
                <strong>♥</strong> {lives}
              </span>
              <span
                className={`chapter-topbar__metric ${
                  xpPulse ? "is-xp-active" : ""
                }`}
              >
                <strong>★</strong> {xp}
              </span>
            </div>
          </div>
        </section>

        <div
          className="chapter-visual"
          style={{ backgroundImage: `url(${work.image})` }}
          aria-hidden="true"
        />

        {isCompleted ? (
          <section className="chapter-completion">
            <p className="chapter-completion__eyebrow">Chapter complete</p>
            <h2 className="chapter-completion__title">
              {chapter.chapterTitle} is complete
            </h2>
            <div className="chapter-completion__stats">
              <article>
                <span>XP earned</span>
                <strong>{progress.earnedXp}</strong>
              </article>
              <article>
                <span>Correct answers</span>
                <strong>
                  {correctAnswers}/{chapter.scenes.length}
                </strong>
              </article>
            </div>

            <div className="chapter-completion__actions">
              {nextChapter ? (
                <Link
                  to={getChapterPath(work.id, nextChapter.chapterNumber)}
                  className="chapter-completion__action is-primary"
                >
                  To the next chapter
                </Link>
              ) : (
                <Link
                  to={`/reading/${work.id}`}
                  className="chapter-completion__action is-primary"
                >
                  Return to book
                </Link>
              )}

              <Link to="/progress" className="chapter-completion__action">
                View progress
              </Link>
            </div>
          </section>
        ) : (
          <article className="chapter-sceneCard">
            <div className="chapter-sceneCard__head">
              <p className="chapter-sceneCard__eyebrow">Scene focus</p>
              <h2 className="chapter-sceneCard__title">{currentScene.title}</h2>
            </div>

            <section className="chapter-sceneCard__section">
              <p className="chapter-sceneCard__label">Context</p>
              <div className="chapter-sceneCard__text">
                {currentScene.context.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>

            <section className="chapter-sceneCard__section">
              <p className="chapter-sceneCard__label">Question</p>
              <p className="chapter-sceneCard__question">{currentScene.prompt}</p>
            </section>

            <section className="chapter-sceneCard__section">
              <p className="chapter-sceneCard__label">Options</p>
              <div className="chapter-sceneCard__choices" role="list">
                {currentScene.choices.map((choice) => (
                  <button
                    key={choice.id}
                    type="button"
                    className={`chapter-choice ${
                      selectedChoiceId === choice.id ? "is-selected" : ""
                    } ${
                      selectedChoiceId && selectedChoiceId !== choice.id
                        ? "is-muted"
                        : ""
                    }`}
                    onClick={() => handleChoice(choice)}
                    disabled={Boolean(selectedChoiceId)}
                  >
                    <span className="chapter-choice__label">{choice.label}</span>
                  </button>
                ))}
              </div>
            </section>

            {selectedChoice ? (
              <section className="chapter-result">
                <div className="chapter-result__top">
                  <div>
                    <p className="chapter-result__label">Result</p>
                    <h3 className={`chapter-result__status is-${selectedChoice.result.tone}`}>
                      {selectedChoice.result.status}
                    </h3>
                  </div>
                  <span className="chapter-result__xp">+{selectedChoice.xp} XP</span>
                </div>

                <div className="chapter-result__grid">
                  <article className="chapter-result__card">
                    <p className="chapter-result__cardLabel">Explanation</p>
                    <p>{selectedChoice.result.explanation}</p>
                  </article>
                  <article className="chapter-result__card">
                    <p className="chapter-result__cardLabel">
                      How it appears in the work
                    </p>
                    <p>{selectedChoice.result.canonNote}</p>
                  </article>
                </div>

                <div className="chapter-result__actions">
                  <button
                    type="button"
                    className="chapter-result__action"
                    onClick={handleContinue}
                  >
                    {isLastScene ? "Finish chapter" : "Next"}
                  </button>
                </div>
              </section>
            ) : null}
          </article>
        )}
      </div>
    </main>
  );
}

export default ChapterReading;
