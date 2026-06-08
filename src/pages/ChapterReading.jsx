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
import { useI18n } from "../i18n/useI18n";
import { useTheme } from "../theme/ThemeContext";
import {
  MuraBackIcon,
  MuraBookmarkIcon,
  MuraNoteIcon,
  MuraPencilIcon,
  MuraShareIcon,
  MuraSettingsIcon,
} from "../components/icons/MuraIconSet";
import { getWorkDisplayTitle } from "../utils/workTitles";

function ChapterReading() {
  const {
    t,
    language,
    languages,
    setLanguage,
    localizeStory,
    localizeStoryInLanguage,
    localizeStoryBook,
    localizeWork,
  } = useI18n();
  const { toggleTheme } = useTheme();
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
    favorites,
    migrateLegacyProgress,
    ensureStory,
    recordChoice,
    recordFinalQuizAnswer,
    recordReadingSession,
    recordQuizTopicResult,
    advanceScene,
    goToStoryScene,
    completeStory,
    resetStory,
    toggleFavorite,
  } = useProgressStore();
  const [xpPulse, setXpPulse] = useState(null);
  const [choiceCelebration, setChoiceCelebration] = useState(null);
  const [streakReward, setStreakReward] = useState(null);
  const [progressGlow, setProgressGlow] = useState(false);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [activeReaderTab, setActiveReaderTab] = useState("text");
  const [activeAnnotation, setActiveAnnotation] = useState(null);
  const [shareMessage, setShareMessage] = useState("");
  const [quoteNote, setQuoteNote] = useState("");
  const [isQuizVisible, setIsQuizVisible] = useState(false);
  const annotationAreaRef = useRef(null);
  const comparisonSectionRef = useRef(null);
  const quizSectionRef = useRef(null);
  const [leftComparisonLanguage, setLeftComparisonLanguage] = useState(language);
  const [rightComparisonLanguage, setRightComparisonLanguage] = useState(
    language === "en" ? "ru" : "en"
  );
  const saveReadingSessionRef = useRef(() => {});

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

  useEffect(() => {
    if (!chapter || !work) {
      saveReadingSessionRef.current = () => {};
      return undefined;
    }

    const chapterId = chapter.id;
    const workId = work.id;
    let startedAt = 0;
    let isSaved = false;

    const startSession = () => {
      startedAt = Date.now();
      isSaved = false;
    };

    const saveSession = ({ restart = false } = {}) => {
      if (isSaved) return;

      isSaved = true;

      const elapsedMs = Date.now() - startedAt;
      if (elapsedMs < 30_000) {
        if (restart) startSession();
        return;
      }

      recordReadingSession({
        id: `${chapterId}:${language}:${startedAt}`,
        storyId: chapterId,
        workId,
        chapterId,
        minutes: Math.min(180, Math.round(elapsedMs / 60_000)),
        language,
        createdAt: new Date(startedAt).toISOString(),
      });

      if (restart) startSession();
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        saveSession();
        return;
      }

      startSession();
    };

    saveReadingSessionRef.current = saveSession;
    startSession();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      saveSession();
      saveReadingSessionRef.current = () => {};
    };
  }, [chapter, language, recordReadingSession, work]);

  const hasChapterData = Boolean(work && storyBook && chapter);
  const scenes = chapter?.scenes ?? [];
  const progress = chapter
    ? storyProgress[chapter.id] ?? {
        currentSceneIndex: 0,
        completed: false,
        earnedXp: 0,
        choices: {},
      }
    : {
    currentSceneIndex: 0,
    completed: false,
    earnedXp: 0,
    choices: {},
  };

  const currentScene = scenes[progress.currentSceneIndex];
  const currentFragment =
  currentScene?.fragment ??
  work?.fragments?.[progress.currentSceneIndex] ??
  work?.fragments?.[0] ??
  null;

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
  const isLastScene = progress.currentSceneIndex === scenes.length - 1;
  const isCompleted = progress.completed;
  const isWorkFavorite = Boolean(
    work && favorites.some((favorite) => favorite.type === "work" && favorite.id === work.id)
  );
  const correctAnswers = scenes.reduce((sum, scene) => {
    const choiceId = progress.choices[scene.id];
    const selected = scene.choices.find((choice) => choice.id === choiceId);

    return sum + (selected?.result?.isCorrect ? 1 : 0);
  }, 0);
  const nextChapter = storyBook?.chapters.find(
    (item) => item.chapterNumber === chapter?.chapterNumber + 1
  );
  const preferredTheme = work?.themes?.[0];
  const recommendedWork =
    localizedWorks.find(
      (item) =>
        item.id !== work?.id &&
        preferredTheme &&
        item.themes?.includes(preferredTheme)
    ) ?? localizedWorks.find((item) => item.id !== work?.id);
  const visibleSceneNumber = Math.min(
    progress.currentSceneIndex + 1,
    scenes.length
  );
  const sceneTitleLabel =
  getLocalizedValue(currentScene?.displayTitle, language) ||
  getLocalizedValue(currentScene?.title, language) ||
  t("sceneOf", {
    current: visibleSceneNumber,
    total: scenes.length,
  });
  const compareControlLabel =
    language === "kk" ? "Салыстыру" : language === "ru" ? "Сравнить" : "Compare";
  const textTabLabel =
    language === "kk" ? "Мәтін" : language === "ru" ? "Фрагмент" : "Text";
  const explanationTabLabel =
    language === "kk" ? "Түсіндіру" : language === "ru" ? "Объяснение" : "Explanation";
  const historyTabLabel =
    language === "kk"
      ? "Тарихи контекст"
      : language === "ru"
        ? "Контекст"
        : "Historical context";
  const quoteNotePlaceholder =
    language === "kk"
      ? "Цитатаға түсінік жазу..."
      : language === "ru"
        ? "Напишите пояснение к цитате..."
        : "Write a note about this quote...";
  const mainIdeaLabel =
    language === "kk" ? "Негізгі идея" : language === "ru" ? "Главная идея" : "Main idea";
  const lockedSceneLabel =
    language === "kk" ? "Құлыптаулы сахна" : language === "ru" ? "Сцена заблокирована" : "Locked scene";
  const openSceneLabel =
    language === "kk" ? "Сахнаны ашу" : language === "ru" ? "Открыть сцену" : "Open scene";
  const displayWorkTitle = work ? getWorkDisplayTitle(work, language) : "";
  const breadcrumbLabel = work
    ? `${work.author}. ${displayWorkTitle}`
    : "";
  const chapterTitleLabel = getLocalizedValue(chapter?.chapterTitle, language) || chapter?.chapterTitle;
  const retryChapterLabel =
    language === "kk"
      ? "Тарауды қайта оқу"
      : language === "ru"
        ? "Повторить главу"
        : "Retry chapter";
  const answeredSceneCount = Object.keys(progress.choices).length;
  const maxUnlockedSceneIndex = Math.max(
    Number(progress.currentSceneIndex) || 0,
    Number(progress.maxSceneIndex) || 0
  );
  const chapterProgressPercent =
    scenes.length > 0
      ? Math.round((answeredSceneCount / scenes.length) * 100)
      : 0;
  const sceneExplanation =
    getLocalizedValue(currentScene?.explanation, language) ||
    getLocalizedValue(currentScene?.context?.[0], language) ||
    chapter?.tagline;
  const sceneMainIdea =
    getLocalizedValue(currentScene?.mainIdea, language) ||
    getLocalizedValue(currentScene?.choices?.find((choice) => choice.result.isCorrect)?.result?.characterInsight, language) ||
    getLocalizedValue(currentScene?.prompt, language) ||
    chapter?.tagline;
  const sceneHistoricalContext =
    getLocalizedValue(currentScene?.historicalContext, language) ||
    getLocalizedValue(currentScene?.context?.[1], language) ||
    chapter?.tagline;
  const sceneThemes =
    currentScene?.themes?.length ? currentScene.themes : work?.themes ?? [];
  const sceneDifficultWords = getDifficultWordsForLanguage(currentScene, language);
  const sceneAnnotations = getAnnotationEntriesForLanguage(
    currentFragment?.annotations,
    sceneDifficultWords,
    language
  );
  const finalQuizAnswers = chapter ? finalQuizzes[chapter.id] ?? {} : {};
  const finalQuiz = scenes.slice(0, 3).map((scene) => ({
    id: `final-${scene.id}`,
    question: scene.prompt,
    topic: scene.topic ?? scene.category ?? scene.quizTopic ?? null,
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
        total: scenes.length,
      }),
      complete: isCompleted || answeredSceneCount >= scenes.length,
    },
  ];

  const handleChoice = (choice) => {
    if (!chapter || !currentScene) return;

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
    setIsQuizVisible(false);
  }, [progress.currentSceneIndex]);

  useEffect(() => {
    if (!quizSectionRef.current) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsQuizVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -18% 0px", threshold: 0.18 }
    );

    observer.observe(quizSectionRef.current);
    return () => observer.disconnect();
  }, [currentScene?.id, activeReaderTab]);

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
    if (!chapter) return;

    if (isLastScene) {
      saveReadingSessionRef.current();
      completeStory(chapter.id);
      return;
    }

    advanceScene(chapter.id, scenes.length);
  };

  const handleSceneNavigation = (sceneIndex) => {
    if (!chapter || sceneIndex > maxUnlockedSceneIndex) return;

    goToStoryScene(chapter.id, sceneIndex, scenes.length);
    setActiveReaderTab("text");
    setIsComparisonOpen(false);
    setActiveAnnotation(null);

    window.requestAnimationFrame(() => {
      document.querySelector(".chapter-page")?.scrollTo({ top: 0, left: 0 });
    });
  };

  const handleFinalQuizAnswer = (question, option) => {
    if (!chapter) return;

    recordFinalQuizAnswer(chapter.id, question.id, option.id, option.isCorrect);

    if (question.topic) {
      recordQuizTopicResult(question.topic, option.isCorrect ? 1 : 0, 1);
    }
  };

  const handleRetryChapter = () => {
    if (!chapter) return;

    resetStory(chapter.id);
    setActiveReaderTab("text");
    setIsComparisonOpen(false);
    setActiveAnnotation(null);
    setShareMessage("");
    setQuoteNote("");

    window.requestAnimationFrame(() => {
      document.querySelector(".chapter-page")?.scrollTo({ top: 0, left: 0 });
    });
  };

  const handleShare = async () => {
    if (typeof window === "undefined") return;

    setShareMessage("");
    const url = window.location.href;

    const copyUrl = async () => {
      if (navigator.clipboard?.writeText) {
        try {
          await navigator.clipboard.writeText(url);
          return;
        } catch {
          // Fall back to a temporary selection for browsers that deny clipboard API.
        }
      }

      const textArea = document.createElement("textarea");
      textArea.value = url;
      textArea.setAttribute("readonly", "");
      textArea.style.position = "fixed";
      textArea.style.left = "-9999px";
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
    };

    try {
      await copyUrl();
      setShareMessage(t("shareLinkCopied"));
    } catch {
      setShareMessage(t("socialActionFailed"));
    }
  };

  useEffect(() => {
    if (!shareMessage) return undefined;

    const timeoutId = window.setTimeout(() => {
      setShareMessage("");
    }, 2400);

    return () => window.clearTimeout(timeoutId);
  }, [shareMessage]);

  useEffect(() => {
    if (!isComparisonOpen || !comparisonSectionRef.current) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    window.requestAnimationFrame(() => {
      comparisonSectionRef.current?.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start",
      });
    });
  }, [isComparisonOpen]);

  if (!hasChapterData) {
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

  return (
    <main className="chapter-page">
      <div className="chapter-page__container">
        <section className="chapter-topbar">
          <div className="chapter-topbar__header">
            <Link
              to={`/reading/${work.id}`}
              className="chapter-topbar__backButton"
              aria-label={t("backToBookPage")}
              title={t("backToBookPage")}
            >
              <MuraBackIcon />
            </Link>

            <div className="chapter-topbar__main">
              <h1 className="chapter-topbar__title">{breadcrumbLabel}</h1>
              <p className="chapter-topbar__subtitle">
                {t("chapter", { number: chapter.chapterNumber })} {"\u00B7"} {chapterTitleLabel}
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
            </div>
          </div>

          {!isCompleted && currentScene ? (
            <div className="chapter-topbar__tools mura-reader-actions">
              <span className="mura-reader-actions__group" aria-label={t("language")}>
                {languages.map((item) => (
                  <button
                    key={item.code}
                    type="button"
                    className={item.code === language ? "is-active" : ""}
                    onClick={() => setLanguage(item.code)}
                  >
                    {item.shortLabel}
                  </button>
                ))}
              </span>
              <button
                type="button"
                className={`mura-reader-compare-toggle ${
                  isComparisonOpen ? "is-active" : ""
                }`}
                aria-pressed={isComparisonOpen}
                onClick={() => setIsComparisonOpen((current) => !current)}
              >
                {compareControlLabel}
              </button>
              <button
                type="button"
                className={`mura-reader-icon-button ${isWorkFavorite ? "is-active" : ""}`}
                aria-label={isWorkFavorite ? t("savedFavorite") : t("saveFavorite")}
                title={isWorkFavorite ? t("savedFavorite") : t("saveFavorite")}
                onClick={() =>
                  toggleFavorite({
                    type: "work",
                    id: work.id,
                    title: work.title,
                    subtitle: work.author,
                    href: `/reading/${work.id}`,
                  })
                }
              >
                <MuraBookmarkIcon />
              </button>
              <button
                type="button"
                className="mura-reader-icon-button"
                aria-label={t("shareWork")}
                title={t("shareWork")}
                onClick={handleShare}
              >
                <MuraShareIcon />
              </button>
              <button
                type="button"
                className="mura-reader-icon-button"
                aria-label={t("theme")}
                title={t("theme")}
                onClick={toggleTheme}
              >
                <MuraSettingsIcon />
              </button>
              <span className="chapter-topbar__metric">
                <strong>{"\u{1F525}"}</strong> {streak}
              </span>
              <span className="chapter-topbar__metric">
                <strong>{"\u2665"}</strong> {lives}
              </span>
              <span
                className={`chapter-topbar__metric ${
                  xpPulse ? "is-xp-active" : ""
                }`}
              >
                <strong>{"\u2605"}</strong> {xp}
              </span>
            </div>
          ) : null}
        </section>

        {!isCompleted && currentScene ? (
          <section className="chapter-flow-strip" aria-label={t("chapterFlowText")}>
            <p>{t("chapterFlowText")}</p>
            <ol>
              <li className="is-active">
                <span>1</span>
                <strong>{t("chapterReadStep")}</strong>
              </li>
              <li className={selectedChoice ? "is-complete" : ""}>
                <span>{selectedChoice ? "✓" : "2"}</span>
                <strong>{t("chapterChooseStep")}</strong>
              </li>
              <li className={selectedChoice ? "is-active" : ""}>
                <span>3</span>
                <strong>{t("chapterContinueStep")}</strong>
              </li>
            </ol>
          </section>
        ) : null}

        {!isCompleted && currentScene ? (
          <aside className="mura-reader-rail" aria-label={t("routeProgress")}>
            <div className="mura-reader-rail__top">
              <span>{t("routeProgress")}</span>
              <strong>{visibleSceneNumber}/{chapter.scenes.length}</strong>
            </div>
            <ol>
              {scenes.map((scene, index) => {
                const isAnswered = Boolean(progress.choices[scene.id]);
                const isActive = index === progress.currentSceneIndex;
                const isLocked = index > maxUnlockedSceneIndex;
                const sceneLabel =
                  getLocalizedValue(scene.displayTitle, language) ||
                  getLocalizedValue(scene.title, language) ||
                  t("sceneOf", { current: index + 1, total: scenes.length });
                const buttonTitle = isLocked
                  ? `${lockedSceneLabel}: ${sceneLabel}`
                  : `${openSceneLabel}: ${sceneLabel}`;

                return (
                  <li
                    key={scene.id}
                    className={`${isActive ? "is-active" : ""} ${isAnswered ? "is-complete" : ""} ${isLocked ? "is-locked" : ""}`}
                  >
                    <button
                      type="button"
                      className="mura-reader-rail__button"
                      disabled={isLocked}
                      aria-current={isActive ? "step" : undefined}
                      aria-label={buttonTitle}
                      title={buttonTitle}
                      onClick={() => handleSceneNavigation(index)}
                    >
                      {isAnswered && !isActive ? "✓" : index + 1}
                    </button>
                    <small>{scene.sceneNumber ?? index + 1}</small>
                  </li>
                );
              })}
            </ol>
            <div className="mura-reader-rail__foot">
              <span>{chapterProgressPercent}%</span>
            </div>
          </aside>
        ) : null}

        <div
          className="chapter-visual"
          style={{ backgroundImage: `url(${work.image})` }}
          aria-hidden="true"
        />

        {!isCompleted && currentScene ? (
          <aside className="mura-reader-aside">
            <article className="mura-reader-panel">
              <h2>{t("explanation")}</h2>
              <p>{sceneExplanation}</p>
            </article>
            <article className="mura-reader-panel">
              <h2>{mainIdeaLabel}</h2>
              <p>{sceneMainIdea}</p>
            </article>
            <article className="mura-reader-panel">
              <h2>{t("themes")}</h2>
              <div className="mura-reader-tags">
                {sceneThemes.slice(0, 4).map((theme) => (
                  <span key={theme}>{theme}</span>
                ))}
              </div>
            </article>
            {sceneDifficultWords.length ? (
              <article className="mura-reader-panel">
                <h2>{t("difficultWords")}</h2>
                <div className="mura-reader-glossary-list">
                  {sceneDifficultWords.slice(0, 6).map((word) => (
                    <span key={word.term} className="mura-reader-glossary-chip">
                      <strong>{word.term}</strong>
                      <small>{word.meaning}</small>
                    </span>
                  ))}
                </div>
              </article>
            ) : null}
            <article className="mura-reader-panel">
              <h2>{historyTabLabel}</h2>
              <p>{sceneHistoricalContext}</p>
            </article>
          </aside>
        ) : null}

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
          <section className="chapter-language-compare" ref={comparisonSectionRef}>
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

        {streakReward ? (
          <div className="chapter-reward-toast" aria-live="polite">
            <strong>{streakReward.title}</strong>
            <span>{streakReward.text}</span>
          </div>
        ) : null}

        {shareMessage ? (
          <div className="mura-reader-share-toast" role="status" aria-live="polite">
            {shareMessage}
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
                      <p>{getLocalizedValue(question.question, language)}</p>
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
                            {getLocalizedValue(option.label, language)}
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
                          <span>{getLocalizedValue(selectedOption.explanation, language)}</span>
                        </div>
                      ) : null}
                    </article>
                  );
                })}
              </div>
            </section>

            <div className="chapter-completion__actions">
              <button
                type="button"
                className="chapter-completion__action"
                onClick={handleRetryChapter}
              >
                {retryChapterLabel}
              </button>

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
              <p className="chapter-sceneCard__eyebrow">{getLocalizedValue(currentScene.title, language)}</p>
              <h2 className="chapter-sceneCard__title">{sceneTitleLabel}</h2>
            </div>

            <div className="mura-reader-tabs" role="tablist" aria-label={t("context")}>
              <button
                type="button"
                className={activeReaderTab === "text" ? "is-active" : ""}
                role="tab"
                aria-selected={activeReaderTab === "text"}
                onClick={() => setActiveReaderTab("text")}
              >
                {textTabLabel}
              </button>
              <button
                type="button"
                className={activeReaderTab === "explanation" ? "is-active" : ""}
                role="tab"
                aria-selected={activeReaderTab === "explanation"}
                onClick={() => setActiveReaderTab("explanation")}
              >
                {explanationTabLabel}
              </button>
              <button
                type="button"
                className={activeReaderTab === "context" ? "is-active" : ""}
                role="tab"
                aria-selected={activeReaderTab === "context"}
                onClick={() => setActiveReaderTab("context")}
              >
                {historyTabLabel}
              </button>
            </div>


            {activeReaderTab === "text" ? (
              <section
                ref={annotationAreaRef}
                className="chapter-sceneCard__section chapter-fragment"
              >
                <p className="chapter-sceneCard__label">{t("quoteFragment")}</p>

                <blockquote>
                  {currentFragment ? (
                    renderAnnotatedText(
                      getLocalizedValue(currentFragment.text, language),
                      sceneAnnotations,
                      activeAnnotation,
                      setActiveAnnotation
                    )
                  ) : (
                    getSceneParagraphs(currentScene).map((paragraph) => (
                      <p key={getLocalizedValue(paragraph, language)}>
                        {getLocalizedValue(paragraph, language)}
                      </p>
                    ))
                  )}
                </blockquote>

                <label className="mura-reader-note-row">
                  <input
                    type="text"
                    value={quoteNote}
                    onChange={(event) => setQuoteNote(event.target.value)}
                    placeholder={quoteNotePlaceholder}
                  />
                  <span aria-hidden="true">
                    <MuraPencilIcon />
                  </span>
                  <span aria-hidden="true">
                    <MuraNoteIcon />
                  </span>
                </label>
              </section>
            ) : null}

            {activeReaderTab === "explanation" ? (
              <section className="chapter-sceneCard__section chapter-tab-explanation">
                <p className="chapter-sceneCard__label">{t("explanation")}</p>
                <p>{sceneExplanation}</p>
              </section>
            ) : null}

            {activeReaderTab === "context" ? (
              <section className="chapter-sceneCard__section chapter-tab-context">
                <p className="chapter-sceneCard__label">{historyTabLabel}</p>
                <p>{sceneHistoricalContext}</p>
              </section>
            ) : null}

            <section
              className={`chapter-sceneCard__section chapter-quiz-zone ${
                isQuizVisible ? "is-visible" : ""
              }`}
              ref={quizSectionRef}
            >
              <p className="chapter-sceneCard__label">{t("question")}</p>
              <p className="chapter-sceneCard__question">
  {getLocalizedValue(currentScene.prompt, language)}
</p>

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
                    <span className="chapter-choice__label">{getLocalizedValue(choice.label, language)}</span>
                  </button>
                ))}
              </div>
              {selectedChoice ? (
              <section className="chapter-result">
                <div className="chapter-result__top">
                  <div>
                    <p className="chapter-result__label">{t("result")}</p>
                    <h3 className={`chapter-result__status is-${selectedChoice.result.tone}`}>
                      {getResultStatusLabel(selectedChoice.result, language)}
                    </h3>
                  </div>
                  <div className="chapter-result__feedbackStack">
                    <span className="chapter-result__xp">
                      {t("readingPointsDelta", { count: selectedChoice.xp })}
                    </span>
                    {xpPulse ? (
                      <span className={`chapter-xp-toast is-${xpPulse.tone}`} aria-live="polite">
                        {t("readingPointsDelta", { count: xpPulse.value })}
                      </span>
                    ) : null}
                    {choiceCelebration ? (
                      <span
                        className={`chapter-choice-toast is-${choiceCelebration.tone}`}
                        aria-live="polite"
                      >
                        {choiceCelebration.title}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="chapter-result__grid">
                  <article className="chapter-result__card">
                    <p className="chapter-result__cardLabel">{t("explanation")}</p>
                    <p>{getLocalizedValue(selectedChoice.result.explanation, language)}</p>
                  </article>
                  <article className="chapter-result__card">
                    <p className="chapter-result__cardLabel">
                      {t("appearsInWork")}
                    </p>
                    <p>{getLocalizedValue(selectedChoice.result.canonNote, language)}</p>
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
            </section>
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

      <h3>{getLocalizedValue(scene.title, selectedLanguage)}</h3>
      <div className="chapter-language-column__context">
        {getSceneParagraphs(scene).map((paragraph) => {
          const localizedParagraph = getLocalizedValue(paragraph, selectedLanguage);

          return <p key={localizedParagraph}>{localizedParagraph}</p>;
        })}
      </div>
      <p className="chapter-language-column__prompt">{getLocalizedValue(scene.prompt, selectedLanguage)}</p>
    </article>
  );
}
function getLocalizedValue(value, language = "en") {
  if (!value) return "";
  if (typeof value === "string") return value;

  return (
    value[language] ??
    value.ru ??
    value.en ??
    value.kk ??
    Object.values(value)[0] ??
    ""
  );
}
function normalizeWord(value) {
  return String(value).toLowerCase().replace(/[^\p{L}\p{N}-]+/gu, "");
}

function getLanguageAliases(language = "en") {
  if (language === "kk" || language === "kz") return ["kk", "kz"];
  if (language === "ru") return ["ru"];
  return ["en"];
}

function getDifficultWordsForLanguage(scene, language = "en") {
  const glossary = scene?.difficultWords;
  if (!glossary) return [];

  if (Array.isArray(glossary)) {
    return [];
  }

  const localizedWords = getLanguageAliases(language)
    .flatMap((code) => glossary[code] ?? [])
    .filter(Boolean);

  return localizedWords
    .map((entry) => {
      if (typeof entry === "string") {
        return {
          term: entry,
          meaning: "",
          note: "",
          forms: [],
        };
      }

      return {
        term: entry.term ?? "",
        meaning: entry.meaning ?? "",
        note: entry.note ?? "",
        forms: Array.isArray(entry.forms) ? entry.forms : [],
      };
    })
    .filter((entry) => entry.term);
}

function getAnnotationEntriesForLanguage(annotations = [], difficultWords = [], language = "en") {
  if (difficultWords.length) {
    return difficultWords.map((entry) => ({
      term: entry.term,
      meaning: entry.meaning,
      note: entry.note,
      forms: [entry.term, ...(entry.forms ?? [])],
    }));
  }

  return annotations
    .map((annotation) => {
      const term = getLocalizedValue(annotation.word, language);
      const meaning = getLocalizedValue(annotation.explanation, language);

      return term && meaning
        ? {
            term,
            meaning,
            note: "",
            forms: [term],
          }
        : null;
    })
    .filter(Boolean);
}

function renderAnnotatedText(text, annotations = [], activeAnnotation, onToggle) {
  const annotationMap = new Map(
    annotations.flatMap((annotation) => {
      const terms = [annotation.term, ...(annotation.forms ?? [])].filter(Boolean);

      return terms.map((term) => [normalizeWord(term), annotation]);
    })
  );

  return String(text).split(/(\s+)/).map((token, index) => {
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
            <strong>{annotation.term}</strong>
            <span>{annotation.meaning}</span>
            {annotation.note ? <small>{annotation.note}</small> : null}
          </span>
        ) : null}
      </span>
    ) : (
      <span key={`${token}-${index}`}>{token}</span>
    );
  });
}
function getSceneParagraphs(scene) {
  if (Array.isArray(scene?.context) && scene.context.length) {
    return scene.context;
  }

  if (scene?.fragment?.text) {
    return [scene.fragment.text];
  }

  if (scene?.explanation) {
    return [scene.explanation];
  }

  return [];
}

function getResultStatusLabel(result, language = "en") {
  if (!result) return "";
  const tone = result.tone;

  if (tone === "correct") {
    return language === "kk" ? "Дұрыс" : language === "ru" ? "Верно" : "Correct";
  }

  if (tone === "partial") {
    return language === "kk"
      ? "Ішінара дұрыс"
      : language === "ru"
        ? "Частично верно"
        : "Partially correct";
  }

  return language === "kk"
    ? "Дәл емес"
    : language === "ru"
      ? "Не совсем точно"
      : "Not quite accurate";
}

export default ChapterReading;

