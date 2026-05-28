import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { works } from "../data/works";
import {
  getChapterPath,
  getStoryBookByWorkId,
  getStoryChapterByWorkAndNumber,
} from "../data/stories";
import {
  getAdminStoryBookByWorkId,
  getAdminStoryChapterByWorkAndNumber,
  mergeAdminWorks,
} from "../admin/adminContent";
import { useAdminContent } from "../hooks/useAdminContent";
import { useProgressStore } from "../store/useProgressStore";
import "./ChapterReading.css";
import { useI18n } from "../i18n/I18nContext";

function ChapterReading() {
  const {
    t,
    language,
    languages,
    localizeStory,
    localizeStoryInLanguage,
    localizeStoryBook,
    localizeWork,
  } = useI18n();
  const { id, chapterNumber } = useParams();
  const { content: adminContent } = useAdminContent();
  const localizedWorks = mergeAdminWorks(works.map(localizeWork), adminContent, language);
  const work = localizedWorks.find((item) => item.id === id);
  const rawStaticStoryBook = getStoryBookByWorkId(id);
  const rawStaticChapter = getStoryChapterByWorkAndNumber(id, chapterNumber);
  const rawAdminChapter = getAdminStoryChapterByWorkAndNumber(
    id,
    chapterNumber,
    adminContent,
    "en"
  );
  const baseChapter = rawStaticChapter ?? rawAdminChapter;
  const staticStoryBook = localizeStoryBook(rawStaticStoryBook);
  const adminStoryBook = getAdminStoryBookByWorkId(id, adminContent, language);
  const storyBook = staticStoryBook ?? adminStoryBook;
  const chapter =
    localizeStory(rawStaticChapter) ??
    getAdminStoryChapterByWorkAndNumber(id, chapterNumber, adminContent, language);

  const {
    xp,
    streak,
    lives,
    storyProgress,
    finalQuizzes,
    migrateLegacyProgress,
    ensureStory,
    recordChoice,
    recordFinalQuizAnswer,
    advanceScene,
    completeStory,
  } = useProgressStore();
  const [xpPulse, setXpPulse] = useState(null);
  const [choiceCelebration, setChoiceCelebration] = useState(null);
  const [streakReward, setStreakReward] = useState(null);
  const [progressGlow, setProgressGlow] = useState(false);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [activeAnnotation, setActiveAnnotation] = useState(null);
  const annotationAreaRef = useRef(null);
  const [leftComparisonLanguage, setLeftComparisonLanguage] = useState(language);
  const [rightComparisonLanguage, setRightComparisonLanguage] = useState(
    language === "en" ? "ru" : "en"
  );

  useEffect(() => {
    setLeftComparisonLanguage(language);
    setRightComparisonLanguage((currentLanguage) =>
      currentLanguage === language
        ? languages.find((item) => item.code !== language)?.code ?? "en"
        : currentLanguage
    );
  }, [language, languages]);

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
            <h1 className="chapter-fallback__title">{t("chapterNotFound")}</h1>
            <p className="chapter-fallback__text">
              {t("chapterNotFoundText")}
            </p>
            <Link to="/explore" className="chapter-fallback__action">
              {t("backToExplore")}
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
  const currentFragment = work.fragments?.[progress.currentSceneIndex] ?? work.fragments?.[0];
  const leftComparisonScene = localizeStoryInLanguage(
    baseChapter,
    leftComparisonLanguage
  )?.scenes?.[progress.currentSceneIndex];
  const rightComparisonScene = localizeStoryInLanguage(
    baseChapter,
    rightComparisonLanguage
  )?.scenes?.[progress.currentSceneIndex];
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
  const preferredTheme = work.themes?.[0];
  const recommendedWork =
    localizedWorks.find(
      (item) =>
        item.id !== work.id &&
        preferredTheme &&
        item.themes?.includes(preferredTheme)
    ) ?? localizedWorks.find((item) => item.id !== work.id);
  const visibleSceneNumber = Math.min(
    progress.currentSceneIndex + 1,
    chapter.scenes.length
  );
  const answeredSceneCount = Object.keys(progress.choices).length;
  const chapterProgressPercent =
    chapter.scenes.length > 0
      ? Math.round((answeredSceneCount / chapter.scenes.length) * 100)
      : 0;
  const finalQuizAnswers = finalQuizzes[chapter.id] ?? {};
  const finalQuiz = chapter.scenes.slice(0, 3).map((scene) => ({
    id: `final-${scene.id}`,
    question: scene.prompt,
    options: scene.choices.map((choice) => ({
      id: choice.id,
      label: choice.label,
      isCorrect: choice.result.isCorrect,
      explanation: choice.result.explanation,
    })),
  }));
  const answeredFinalQuizCount = finalQuiz.filter(
    (question) => finalQuizAnswers[question.id]
  ).length;
  const chapterChallenges = [
    {
      id: "answer-three",
      title: t("challengeAnswerThree"),
      hint: t("challengeAnswerThreeHint", {
        done: Math.min(answeredSceneCount, 3),
        total: 3,
      }),
      complete: answeredSceneCount >= 3,
    },
    {
      id: "three-correct",
      title: t("challengeThreeCorrect"),
      hint: t("challengeThreeCorrectHint", {
        done: Math.min(correctAnswers, 3),
        total: 3,
      }),
      complete: correctAnswers >= 3,
    },
    {
      id: "compare-languages",
      title: t("challengeCompareLanguages"),
      hint: t("challengeCompareLanguagesHint"),
      complete: isComparisonOpen,
    },
    {
      id: "finish-chapter",
      title: t("challengeFinishChapter"),
      hint: t("challengeFinishChapterHint", {
        done: answeredSceneCount,
        total: chapter.scenes.length,
      }),
      complete: isCompleted || answeredSceneCount >= chapter.scenes.length,
    },
  ];

  const handleChoice = (choice) => {
    const nextCorrectAnswers =
      correctAnswers + (choice.result.isCorrect && !selectedChoiceId ? 1 : 0);

    recordChoice(chapter.id, currentScene.id, choice.id, choice.xp);
    setXpPulse({
      id: `${chapter.id}-${currentScene.id}-${choice.id}`,
      value: choice.xp,
      tone: choice.result.tone,
      status: choice.result.status,
    });
    setChoiceCelebration({
      id: `${chapter.id}-${currentScene.id}-${choice.id}-celebration`,
      tone: choice.result.tone,
      title: choice.result.isCorrect
        ? t("choiceCongratsCorrect")
        : choice.result.tone === "partial"
          ? t("choiceCongratsPartial")
          : t("choiceCongratsIncorrect"),
    });

    if (choice.result.isCorrect) {
      setProgressGlow(true);

      if (nextCorrectAnswers > 0 && nextCorrectAnswers % 3 === 0) {
        setStreakReward({
          id: `${chapter.id}-${currentScene.id}-streak`,
          title: t("insightStreak"),
          text: t("insightStreakText"),
        });
      }
    }
  };

  useEffect(() => {
    if (!xpPulse) return undefined;

    const timeoutId = window.setTimeout(() => {
      setXpPulse(null);
    }, 2400);

    return () => window.clearTimeout(timeoutId);
  }, [xpPulse]);

  useEffect(() => {
    if (!progressGlow) return undefined;

    const timeoutId = window.setTimeout(() => {
      setProgressGlow(false);
    }, 1200);

    return () => window.clearTimeout(timeoutId);
  }, [progressGlow]);

  useEffect(() => {
    if (!choiceCelebration) return undefined;

    const timeoutId = window.setTimeout(() => {
      setChoiceCelebration(null);
    }, 2500);

    return () => window.clearTimeout(timeoutId);
  }, [choiceCelebration]);

  useEffect(() => {
    if (!streakReward) return undefined;

    const timeoutId = window.setTimeout(() => {
      setStreakReward(null);
    }, 2800);

    return () => window.clearTimeout(timeoutId);
  }, [streakReward]);

  useEffect(() => {
    setActiveAnnotation(null);
  }, [progress.currentSceneIndex]);

  useEffect(() => {
    if (!activeAnnotation) return undefined;

    const handlePointerDown = (event) => {
      if (!annotationAreaRef.current?.contains(event.target)) {
        setActiveAnnotation(null);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [activeAnnotation]);

  const handleContinue = () => {
    if (isLastScene) {
      completeStory(chapter.id);
      return;
    }

    advanceScene(chapter.id, chapter.scenes.length);
  };

  const handleFinalQuizAnswer = (question, option) => {
    recordFinalQuizAnswer(chapter.id, question.id, option.id, option.isCorrect);
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
            <Link to={`/reading/${work.id}`} className="chapter-topbar__backButton" aria-label={t("backToBookPage")}>
              ‹
            </Link>

            <div className="chapter-topbar__main">
              <h1 className="chapter-topbar__title">{work.title}</h1>
              <p className="chapter-topbar__subtitle">
                {t("chapter", { number: chapter.chapterNumber })} · {chapter.chapterTitle}
              </p>
            </div>
          </div>

          <div className="chapter-topbar__status">
            <div className="chapter-topbar__progressBlock">
              <div className="chapter-topbar__progressLabels">
                <span>{t("sceneOf", { current: visibleSceneNumber, total: chapter.scenes.length })}</span>
                <span>{t("routePercent", { percent: chapterProgressPercent })}</span>
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

          {!isCompleted && currentScene ? (
            <div className="chapter-topbar__tools">
              <button
                type="button"
                className="chapter-language-toggle"
                onClick={() => setIsComparisonOpen((current) => !current)}
              >
                {isComparisonOpen
                  ? t("hideLanguageComparison")
                  : t("compareLanguages")}
              </button>
            </div>
          ) : null}
        </section>

        <div
          className="chapter-visual"
          style={{ backgroundImage: `url(${work.image})` }}
          aria-hidden="true"
        />

        {!isCompleted ? (
          <section className="chapter-challenges">
            <p className="chapter-sceneCard__eyebrow">{t("miniChallenges")}</p>
            <div className="chapter-challenges__grid">
              {chapterChallenges.map((challenge) => (
                <article
                  key={challenge.id}
                  className={`chapter-challenge ${
                    challenge.complete ? "is-complete" : ""
                  }`}
                >
                  <span aria-hidden="true">{challenge.complete ? "✓" : "•"}</span>
                  <div>
                    <strong>{challenge.title}</strong>
                    <small>{challenge.hint}</small>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {!isCompleted && isComparisonOpen && currentScene ? (
          <section className="chapter-language-compare">
            <p className="chapter-sceneCard__eyebrow">{t("comparisonContext")}</p>
            <div className="chapter-language-compare__grid">
              <LanguageComparisonColumn
                languageLabel={t("language")}
                languages={languages}
                selectedLanguage={leftComparisonLanguage}
                onLanguageChange={setLeftComparisonLanguage}
                scene={leftComparisonScene ?? currentScene}
              />
              <LanguageComparisonColumn
                languageLabel={t("language")}
                languages={languages}
                selectedLanguage={rightComparisonLanguage}
                onLanguageChange={setRightComparisonLanguage}
                scene={rightComparisonScene ?? currentScene}
              />
            </div>
          </section>
        ) : null}

        {choiceCelebration ? (
          <div
            className={`chapter-choice-toast is-${choiceCelebration.tone}`}
            aria-live="polite"
          >
            {choiceCelebration.title}
          </div>
        ) : null}

        {streakReward ? (
          <div className="chapter-reward-toast" aria-live="polite">
            <strong>{streakReward.title}</strong>
            <span>{streakReward.text}</span>
          </div>
        ) : null}

        {isCompleted ? (
          <section className="chapter-completion">
            <p className="chapter-completion__eyebrow">{t("chapterComplete")}</p>
            <h2 className="chapter-completion__title">
              {t("isComplete", { title: chapter.chapterTitle })}
            </h2>
            <div className="chapter-completion__stats">
              <article>
                <span>{t("xpEarned")}</span>
                <strong>{progress.earnedXp}</strong>
              </article>
              <article>
                <span>{t("correctAnswers")}</span>
                <strong>
                  {correctAnswers}/{chapter.scenes.length}
                </strong>
              </article>
            </div>

            <section className="chapter-final-quiz">
              <div className="chapter-final-quiz__head">
                <p className="chapter-completion__eyebrow">{t("finalQuiz")}</p>
                <h3>{t("finalQuizTitle")}</h3>
                <span>
                  {answeredFinalQuizCount}/{finalQuiz.length}
                </span>
              </div>

              <div className="chapter-final-quiz__list">
                {finalQuiz.map((question) => {
                  const selected =
                    finalQuizAnswers[question.id];
                  const selectedOption = question.options.find(
                    (option) => option.id === selected?.optionId
                  );

                  return (
                    <article className="chapter-final-question" key={question.id}>
                      <p>{question.question}</p>
                      <div className="chapter-final-question__options">
                        {question.options.map((option) => (
                          <button
                            key={option.id}
                            type="button"
                            disabled={Boolean(selected)}
                            onClick={() => handleFinalQuizAnswer(question, option)}
                            className={
                              selected?.optionId === option.id
                                ? option.isCorrect
                                  ? "is-correct"
                                  : "is-incorrect"
                                : ""
                            }
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>

                      {selectedOption ? (
                        <div className="chapter-final-question__feedback">
                          <strong>
                            {selectedOption.isCorrect
                              ? t("quizCorrect")
                              : t("quizIncorrect")}
                          </strong>
                          <span>{selectedOption.explanation}</span>
                        </div>
                      ) : null}
                    </article>
                  );
                })}
              </div>
            </section>

            <div className="chapter-completion__actions">
              {nextChapter ? (
                <Link
                  to={getChapterPath(work.id, nextChapter.chapterNumber)}
                  className="chapter-completion__action is-primary"
                >
                  {t("nextChapter")}
                </Link>
              ) : (
                <Link
                  to={`/reading/${work.id}`}
                  className="chapter-completion__action is-primary"
                >
                  {t("returnToBook")}
                </Link>
              )}

              <Link to="/progress" className="chapter-completion__action">
                {t("viewProgress")}
              </Link>
            </div>

            {recommendedWork && preferredTheme ? (
              <section className="chapter-recommendation">
                <p className="chapter-completion__eyebrow">{t("recommendedNext")}</p>
                <div className="chapter-recommendation__grid">
                  <article>
                    <span>{t("recommendedByTheme", { theme: preferredTheme })}</span>
                    <h3>{recommendedWork.title}</h3>
                    <p>{recommendedWork.author}</p>
                    <Link to={`/reading/${recommendedWork.id}`}>
                      {t("openRecommendedWork")}
                    </Link>
                  </article>
                  <article>
                    <span>{t("continueWithTheme")}</span>
                    <h3>{preferredTheme}</h3>
                    <p>{work.title}</p>
                    <Link to={`/explore?theme=${encodeURIComponent(preferredTheme)}`}>
                      {t("exploreTheme")}
                    </Link>
                  </article>
                </div>
              </section>
            ) : null}
          </section>
        ) : (
          <article className="chapter-sceneCard">
            <div className="chapter-sceneCard__head">
              <p className="chapter-sceneCard__eyebrow">{t("sceneFocus")}</p>
              <h2 className="chapter-sceneCard__title">{currentScene.title}</h2>
            </div>

            <section className="chapter-sceneCard__section">
              <p className="chapter-sceneCard__label">{t("context")}</p>
              <div className="chapter-sceneCard__text">
                {currentScene.context.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>

            {currentFragment ? (
              <section
                ref={annotationAreaRef}
                className="chapter-sceneCard__section chapter-fragment"
              >
                <p className="chapter-sceneCard__label">{t("quoteFragment")}</p>
                <blockquote>
                  {renderAnnotatedText(
                    currentFragment.text,
                    currentFragment.annotations,
                    activeAnnotation,
                    setActiveAnnotation
                  )}
                </blockquote>
              </section>
            ) : null}

            <section className="chapter-sceneCard__section">
              <p className="chapter-sceneCard__label">{t("question")}</p>
              <p className="chapter-sceneCard__question">{currentScene.prompt}</p>
            </section>

            <section className="chapter-sceneCard__section">
              <p className="chapter-sceneCard__label">{t("options")}</p>
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
                    <p className="chapter-result__label">{t("result")}</p>
                    <h3 className={`chapter-result__status is-${selectedChoice.result.tone}`}>
                      {selectedChoice.result.status}
                    </h3>
                  </div>
                  <span className="chapter-result__xp">+{selectedChoice.xp} XP</span>
                </div>

                <div className="chapter-result__grid">
                  <article className="chapter-result__card">
                    <p className="chapter-result__cardLabel">{t("explanation")}</p>
                    <p>{selectedChoice.result.explanation}</p>
                  </article>
                  <article className="chapter-result__card">
                    <p className="chapter-result__cardLabel">
                      {t("appearsInWork")}
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
                    {isLastScene ? t("finishChapter") : t("next")}
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

function LanguageComparisonColumn({
  languageLabel,
  languages,
  selectedLanguage,
  onLanguageChange,
  scene,
}) {
  return (
    <article className="chapter-language-column">
      <label>
        <span>{languageLabel}</span>
        <select
          value={selectedLanguage}
          onChange={(event) => onLanguageChange(event.target.value)}
        >
          {languages.map((item) => (
            <option key={item.code} value={item.code}>
              {item.shortLabel}
            </option>
          ))}
        </select>
      </label>

      <h3>{scene.title}</h3>
      <div className="chapter-language-column__context">
        {scene.context.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <p className="chapter-language-column__prompt">{scene.prompt}</p>
    </article>
  );
}

function normalizeWord(value) {
  return value.toLowerCase().replace(/[^\p{L}\p{N}-]+/gu, "");
}

function renderAnnotatedText(text, annotations = [], activeAnnotation, onToggle) {
  const annotationMap = new Map(
    annotations.map((annotation) => [normalizeWord(annotation.word), annotation])
  );

  return text.split(/(\s+)/).map((token, index) => {
    const normalized = normalizeWord(token);
    const annotation = annotationMap.get(normalized);
    const isOpen = activeAnnotation === normalized;

    return annotation ? (
      <span className="chapter-annotated-word-wrap" key={`${token}-${index}`}>
        <button
          type="button"
          className="chapter-annotated-word"
          aria-expanded={isOpen}
          onClick={() => onToggle(isOpen ? null : normalized)}
        >
          {token}
        </button>
        {isOpen ? (
          <span className="chapter-annotation-popover" role="tooltip">
            {annotation.explanation}
          </span>
        ) : null}
      </span>
    ) : (
      <span key={`${token}-${index}`}>{token}</span>
    );
  });
}

export default ChapterReading;
