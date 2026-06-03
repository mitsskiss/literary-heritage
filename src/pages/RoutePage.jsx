import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { readingRoutes } from "../data/routes";
import { works } from "../data/works";
import { useI18n } from "../i18n/useI18n";
import { useProgressStore } from "../store/useProgressStore";
import "./RoutePage.css";

const ROUTE_STEP_STORAGE_PREFIX = "mura_route_step:";
const ROUTE_NOTES_STORAGE_PREFIX = "mura_route_notes:";
const ROUTE_XP_REWARD = 45;

function getStoredNumber(key, fallback = 0) {
  if (typeof window === "undefined") return fallback;
  const raw = window.localStorage.getItem(key);
  const parsed = Number.parseInt(raw ?? "", 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function getStoredText(key) {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(key) ?? "";
}

function RoutePage() {
  const { routeId } = useParams();
  const { t, language, localizeJourneys, localizeWorks } = useI18n();
  const localizedRoutes = useMemo(() => localizeJourneys(readingRoutes), [localizeJourneys]);
  const route = useMemo(
    () => localizedRoutes.find((item) => item.id === routeId),
    [localizedRoutes, routeId]
  );
  const labels = useMemo(
    () => ({
      routes: t("navExplore"),
      backToRoutes: t("backToExplore"),
      home: t("navHome"),
      routeMissingTitle: t("routeMissingTitle"),
      routeMissingText: t("routeMissingText"),
      works: t("works"),
      authorsContext: t("routeAuthorsContext"),
      stages: t("routeStagesCount"),
      time: t("routePassingTime"),
      level: t("level"),
      language: t("language"),
      yourProgress: t("yourProgress"),
      continueReading: t("continueReading"),
      restart: t("restartRoute"),
      favorite: t("saveFavorite"),
      saved: t("savedFavorite"),
      share: t("shareWork"),
      routeStages: t("routeStages"),
      showAllStages: t("showAllStages"),
      stage: t("stage"),
      compareLanguages: t("compareLanguages"),
      previousStage: t("previousStage"),
      nextStage: t("nextStage"),
      finishRoute: t("completeRoute"),
      completedRoute: t("completedRoute"),
      context: t("context"),
      explanation: t("explanation"),
      quotes: t("quotes"),
      notes: t("notes"),
      source: t("source"),
      listen: t("listen"),
      save: t("save"),
      notePlaceholder: t("routeNotePlaceholder"),
      noteSaved: t("routeNoteSaved"),
      quizTitle: t("routeQuizTitle"),
      quizAction: t("routeQuizAction"),
      quizOptionA: t("routeQuizOptionA"),
      quizOptionB: t("routeQuizOptionB"),
      recommendation: t("recommendedNext"),
      medium: t("mediumRoute"),
      notReady: t("routeNotReady"),
      nextRoute: t("nextRoute"),
    }),
    [t]
  );
  const localizedWorks = localizeWorks(works);
  const favorites = useProgressStore((state) => state.favorites);
  const storyProgress = useProgressStore((state) => state.storyProgress);
  const completeStory = useProgressStore((state) => state.completeStory);
  const toggleFavorite = useProgressStore((state) => state.toggleFavorite);
  const [currentStep, setCurrentStep] = useState(0);
  const [activeTab, setActiveTab] = useState("context");
  const [noteDraft, setNoteDraft] = useState("");
  const [isAllStagesOpen, setIsAllStagesOpen] = useState(false);
  const [isLanguageComparisonOpen, setIsLanguageComparisonOpen] = useState(false);
  const [speakingStepKey, setSpeakingStepKey] = useState("");
  const [listenMessage, setListenMessage] = useState("");
  const [shareMessage, setShareMessage] = useState("");
  const [noteMessage, setNoteMessage] = useState("");
  const [quizAnswers, setQuizAnswers] = useState({});

  const steps = route?.steps ?? [];
  const stepStorageKey = `${ROUTE_STEP_STORAGE_PREFIX}${routeId ?? "missing"}`;
  const noteStorageKey = `${ROUTE_NOTES_STORAGE_PREFIX}${routeId ?? "missing"}`;

  useEffect(() => {
    if (!route) return;
    const storedStep = getStoredNumber(stepStorageKey, 0);
    setCurrentStep(Math.max(0, Math.min(storedStep, route.steps.length - 1)));
    setNoteDraft(getStoredText(noteStorageKey));
    setActiveTab("context");
    setIsAllStagesOpen(false);
    setIsLanguageComparisonOpen(false);
    setShareMessage("");
    setNoteMessage("");
    setListenMessage("");
  }, [route, stepStorageKey, noteStorageKey]);

  useEffect(() => {
    if (!route || typeof window === "undefined") return;
    window.localStorage.setItem(stepStorageKey, String(currentStep));
  }, [currentStep, route, stepStorageKey]);

  const routeWorks = useMemo(() => {
    if (!route) return [];
    return route.works.map((id) => localizedWorks.find((work) => work.id === id)).filter(Boolean);
  }, [localizedWorks, route]);

  if (!route) {
    return (
      <main className="route-page route-page--missing">
        <section className="route-missing-card">
          <p>{labels.routes}</p>
          <h1>{labels.routeMissingTitle}</h1>
          <span>{labels.routeMissingText}</span>
          <div>
            <Link to="/explore">{labels.backToRoutes}</Link>
            <Link to="/">{labels.home}</Link>
          </div>
        </section>
      </main>
    );
  }

  const activeStep = steps[currentStep] ?? steps[0];
  const activeStepKey = `${route.id}:${currentStep}:${activeStep?.type ?? "step"}`;
  const nextRoute = localizedRoutes.find((item) => item.id === route.recommendedNext) ?? localizedRoutes[0];
  const routeState = storyProgress[route.id];
  const isRouteCompleted = Boolean(routeState?.completed);
  const isRouteFavorite = favorites.some((favorite) => favorite.type === "route" && favorite.id === route.id);
  const progressPercent = isRouteCompleted
    ? 100
    : Math.round(((currentStep + 1) / Math.max(steps.length, 1)) * 100);
  const activeWork =
    localizedWorks.find((work) => work.id === activeStep?.workId) ??
    routeWorks.find((work) => activeStep?.text?.includes(work.title)) ??
    routeWorks[0];
  const continueHref = activeWork ? `/reading/${activeWork.id}` : "/works";
  const routeLanguages = route.languages ?? "KZ / RU / EN";
  const getStepTitle = (step) => t(`routeStep_${step.type}`);
  const useCanonicalStepText = language === "en";
  const stepContent = useCanonicalStepText
    ? activeStep.content ?? t(`routeStepContent_${activeStep.type}`)
    : t(`routeStepContent_${activeStep.type}`);
  const stepContext = useCanonicalStepText
    ? activeStep.context ?? t("routeContextFallback", { route: route.title })
    : t("routeContextFallback", { route: route.title });
  const stepExplanation = useCanonicalStepText
    ? activeStep.explanation ?? t("routeExplanationFallback")
    : t("routeExplanationFallback");
  const stepQuote =
    useCanonicalStepText
      ? activeStep.quote ??
        activeWork?.fragments?.[0]?.reflection?.resonanceQuote?.text ??
        activeWork?.fragments?.[0]?.text ??
        t("routeQuoteFallback")
      : t("routeQuoteFallback");
  const stepSource = useCanonicalStepText
    ? activeStep.source ?? activeWork?.author ?? route.title
    : activeWork?.author ?? route.title;
  const quizQuestion = useCanonicalStepText
    ? activeStep.quiz?.question ?? t("routeQuizQuestion")
    : t("routeQuizQuestion");
  const quizOptions =
    useCanonicalStepText && activeStep.quiz?.options?.length
      ? activeStep.quiz.options
      : [labels.quizOptionA, labels.quizOptionB];
  const tabContent = {
    context: stepContext,
    explanation: stepExplanation,
    quotes: stepQuote,
    notes: noteDraft,
  };
  const routeTabs = [
    { key: "theme", label: route.focusTheme, tab: "context" },
    { key: "explanation", label: labels.explanation, tab: "explanation" },
    { key: "quotes", label: labels.quotes, tab: "quotes" },
    { key: "notes", label: labels.notes, tab: "notes" },
  ].filter((item) => item.label);

  const clearTransientMessages = () => {
    setListenMessage("");
    setShareMessage("");
    setNoteMessage("");
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setSpeakingStepKey("");
  };

  const selectStep = (index) => {
    const boundedStep = Math.max(0, Math.min(steps.length - 1, index));
    clearTransientMessages();
    setCurrentStep(boundedStep);
    setActiveTab("context");
    setIsLanguageComparisonOpen(false);
  };

  const saveNote = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(noteStorageKey, noteDraft);
    }
    setNoteMessage(labels.noteSaved);
  };

  const resetRoute = () => {
    selectStep(0);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(stepStorageKey, "0");
    }
  };

  const finishRoute = () => {
    if (!isRouteCompleted) {
      completeStory(route.id, ROUTE_XP_REWARD);
    }
    selectStep(steps.length - 1);
  };

  const toggleRouteFavorite = () => {
    toggleFavorite({
      type: "route",
      id: route.id,
      title: route.title,
      subtitle: route.subtitle,
      href: `/route/${route.id}`,
    });
  };

  const shareRoute = async () => {
    if (typeof window === "undefined") return;
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: route.title, text: route.subtitle, url });
        setShareMessage(t("shareLinkCopied"));
        return;
      }
      await navigator.clipboard?.writeText(url);
      setShareMessage(t("shareLinkCopied"));
    } catch {
      setShareMessage(labels.notReady);
    }
  };

  const goToPreviousStep = () => {
    selectStep(currentStep - 1);
  };

  const goToNextStep = () => {
    selectStep(currentStep + 1);
  };

  const openLanguageComparison = () => {
    setIsLanguageComparisonOpen((current) => !current);
    setActiveTab("explanation");
  };

  const listenToStep = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setSpeakingStepKey("");
      setListenMessage(labels.notReady);
      return;
    }

    if (speakingStepKey === activeStepKey) {
      window.speechSynthesis.cancel();
      setSpeakingStepKey("");
      setListenMessage("");
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(
      [getStepTitle(activeStep), stepContent].filter(Boolean).join(". ")
    );
    const languageCode = language === "ru" ? "ru-RU" : language === "kk" ? "kk-KZ" : "en-US";
    utterance.lang = languageCode;
    utterance.onend = () => {
      setSpeakingStepKey("");
      setListenMessage("");
    };
    utterance.onerror = () => {
      setSpeakingStepKey("");
      setListenMessage(labels.notReady);
    };
    setSpeakingStepKey(activeStepKey);
    setListenMessage(labels.listen);
    window.speechSynthesis.speak(utterance);
  };

  const handleWorkFavorite = () => {
    if (!activeWork) return;
    toggleFavorite({
      type: "work",
      id: activeWork.id,
      title: activeWork.title,
      subtitle: activeWork.author,
      href: `/reading/${activeWork.id}`,
    });
  };

  const handleRouteQuizAnswer = (option, index) => {
    setQuizAnswers((current) => ({
      ...current,
      [activeStepKey]: {
        option,
        isCorrect: index === 0,
      },
    }));
  };

  const activeQuizAnswer = quizAnswers[activeStepKey];
  const activeWorkFavorite = activeWork
    ? favorites.some((favorite) => favorite.type === "work" && favorite.id === activeWork.id)
    : false;

  return (
    <main className="route-page">
      <section className="mura-route-reference">
        <div className="mura-route-reference__head">
          <div>
            <div className="route-breadcrumbs">
              <Link to="/explore">{labels.routes}</Link>
              <span>/</span>
              <strong>{route.title}</strong>
            </div>
            <h1>{route.title}</h1>
            <p>{route.subtitle}</p>
          </div>
          <button type="button" onClick={toggleRouteFavorite} className={isRouteFavorite ? "is-active" : ""}>
            {isRouteFavorite ? labels.saved : labels.favorite}
          </button>
        </div>

        <div className="mura-route-tabs" role="tablist" aria-label={labels.routes}>
          {routeTabs.map((item) => (
            <button
              key={`${route.id}-${item.key}`}
              type="button"
              role="tab"
              aria-selected={activeTab === item.tab}
              className={activeTab === item.tab ? "is-active" : ""}
              onClick={() => setActiveTab(item.tab)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="mura-route-card-grid">
          {routeWorks.slice(0, 4).map((workItem, index) => (
            <article className="mura-route-card" key={workItem.id}>
              <img src={workItem.image} alt={workItem.title} />
              <div>
                <span>{labels.stage} {index + 1}</span>
                <h2>{workItem.title}</h2>
                <p>{workItem.description}</p>
                <small>{workItem.readingTime ?? route.minutes} {t("min")} · {workItem.author}</small>
                <Link to={`/reading/${workItem.id}`}>{labels.continueReading}</Link>
              </div>
            </article>
          ))}
        </div>

        <div className="mura-route-progress-strip">
          <span>{labels.yourProgress}</span>
          <div className="route-progress-track" aria-hidden="true">
            <i style={{ width: `${progressPercent}%` }} />
          </div>
          <strong>{progressPercent}%</strong>
          <Link to={continueHref}>{labels.continueReading}</Link>
          <button type="button" onClick={resetRoute}>{labels.restart}</button>
          <button type="button" onClick={shareRoute}>{labels.share}</button>
          {shareMessage ? <small className="route-action-status">{shareMessage}</small> : null}
        </div>
      </section>

      <section className="route-workspace">
        <aside className="route-timeline-panel">
          <div className="route-panel-heading">
            <h2>{labels.routeStages}</h2>
          </div>
          <ol className="route-timeline">
            {steps.map((step, index) => {
              const isCompleted = index < currentStep || isRouteCompleted;
              const isCurrent = index === currentStep;
              return (
                <li
                  key={`${step.type}-${index}`}
                  className={`${isCompleted ? "is-completed" : ""} ${isCurrent ? "is-current" : ""}`}
                >
                  <button type="button" onClick={() => selectStep(index)}>
                    <span>{isCompleted ? "\u2713" : index + 1}</span>
                    <strong>{getStepTitle(step)}</strong>
                  </button>
                </li>
              );
            })}
          </ol>
          <button
            type="button"
            className="route-show-all"
            aria-expanded={isAllStagesOpen}
            onClick={() => setIsAllStagesOpen((current) => !current)}
          >
            {labels.showAllStages}
          </button>
          {isAllStagesOpen ? (
            <div className="route-stage-list" role="region" aria-label={labels.showAllStages}>
              {steps.map((step, index) => (
                <button
                  type="button"
                  key={`${step.type}-${index}-details`}
                  className={index === currentStep ? "is-current" : ""}
                  onClick={() => selectStep(index)}
                >
                  <span>{labels.stage} {index + 1}</span>
                  <strong>{getStepTitle(step)}</strong>
                  <small>{step.text ?? t(`routeStep_${step.type}`)}</small>
                </button>
              ))}
            </div>
          ) : null}
        </aside>

        <section className="route-active-stage">
          <div className="route-active-stage__top">
            <p>{labels.stage} {currentStep + 1} {t("of")} {steps.length}</p>
            <button
              type="button"
              className={isLanguageComparisonOpen ? "is-active" : ""}
              aria-expanded={isLanguageComparisonOpen}
              onClick={openLanguageComparison}
            >
              {labels.compareLanguages}
            </button>
          </div>
          {isLanguageComparisonOpen ? (
            <div className="route-language-compare" role="region" aria-label={labels.compareLanguages}>
              {routeLanguages.split("/").map((code) => (
                <article key={`${activeStepKey}-${code.trim()}`}>
                  <span>{code.trim()}</span>
                  <strong>{getStepTitle(activeStep)}</strong>
                  <p>{stepContent}</p>
                </article>
              ))}
            </div>
          ) : null}
          <h2>{getStepTitle(activeStep)}</h2>
          <p>{t(`routeStep_${activeStep.type}`)}</p>

          <article className="route-parchment">
            <p>{stepContent}</p>
            {activeWork ? (
              <footer>
                <button
                  type="button"
                  className={speakingStepKey === activeStepKey ? "is-active" : ""}
                  onClick={listenToStep}
                >
                  <span className="route-sound-icon" aria-hidden="true" />
                  {labels.listen}
                </button>
                <button
                  type="button"
                  className={activeWorkFavorite ? "is-active" : ""}
                  aria-label={activeWorkFavorite ? labels.saved : labels.favorite}
                  title={activeWorkFavorite ? labels.saved : labels.favorite}
                  onClick={handleWorkFavorite}
                >
                  <span className="route-bookmark-icon" aria-hidden="true" />
                </button>
                <span className="route-source-pill">{labels.source}: {stepSource}</span>
                {listenMessage ? <small className="route-inline-status">{listenMessage}</small> : null}
              </footer>
            ) : null}
          </article>

          {activeStep.quiz || activeStep.type === "task" ? (
            <div className="route-quiz-card">
              <div>
                <h3>{labels.quizTitle}</h3>
                <p>{quizQuestion}</p>
                {activeQuizAnswer ? (
                  <small className={activeQuizAnswer.isCorrect ? "is-correct" : "is-incorrect"}>
                    {activeQuizAnswer.isCorrect ? t("quizCorrect") : t("quizIncorrect")} {" - "}
                    {stepExplanation}
                  </small>
                ) : null}
              </div>
              <div className="route-quiz-card__options">
                {quizOptions.map((option, index) => (
                  <button
                    key={`${activeStepKey}-${option}`}
                    type="button"
                    className={
                      activeQuizAnswer?.option === option
                        ? activeQuizAnswer.isCorrect
                          ? "is-correct"
                          : "is-incorrect"
                        : ""
                    }
                    disabled={Boolean(activeQuizAnswer)}
                    onClick={() => handleRouteQuizAnswer(option, index)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {activeStep.type === "finish" ? (
            <div className="route-quiz-card route-quiz-card--finish">
              <div>
                <h3>{isRouteCompleted ? labels.completedRoute : labels.finishRoute}</h3>
                <p>{route.subtitle}</p>
              </div>
              <button type="button" onClick={finishRoute}>
                {isRouteCompleted
                  ? labels.completedRoute
                  : t("readingPointsDelta", { count: ROUTE_XP_REWARD })}
              </button>
            </div>
          ) : null}

          <div className="route-stage-nav">
            <button type="button" onClick={goToPreviousStep} disabled={currentStep === 0}>
              {"<"} {labels.previousStage}
            </button>
            <span>{currentStep + 1} / {steps.length}</span>
            {currentStep === steps.length - 1 ? (
              <button type="button" onClick={finishRoute}>
                {isRouteCompleted ? labels.completedRoute : labels.finishRoute}
              </button>
            ) : (
              <button type="button" onClick={goToNextStep}>
                {labels.nextStage} {">"}
              </button>
            )}
          </div>
        </section>

        <aside className="route-context-panel">
          <div className="route-tabs" role="tablist" aria-label={labels.context}>
            {["context", "explanation", "quotes", "notes"].map((tab) => (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={activeTab === tab}
                className={activeTab === tab ? "is-active" : ""}
                onClick={() => setActiveTab(tab)}
              >
                {labels[tab]}
              </button>
            ))}
          </div>

          {activeTab === "notes" ? (
            <div className="route-note-editor">
              <textarea
                value={noteDraft}
                onChange={(event) => {
                  setNoteDraft(event.target.value);
                  setNoteMessage("");
                }}
                placeholder={labels.notePlaceholder}
              />
              <button type="button" onClick={saveNote}>{labels.save}</button>
              {noteMessage ? <small>{noteMessage}</small> : null}
            </div>
          ) : (
            <article className="route-tab-card">
              {activeTab === "quotes" ? <span className="route-quote-mark">&ldquo;</span> : null}
              <p>{tabContent[activeTab]}</p>
              {activeTab === "quotes" ? (
                <small>{stepSource}</small>
              ) : (
                <Link to={activeWork ? `/reading/${activeWork.id}` : "/works"}>
                  {activeWork ? activeWork.title : labels.notReady} {"\u203A"}
                </Link>
              )}
            </article>
          )}

          <article className="route-next-card">
            <span>{labels.recommendation}</span>
            <strong>{nextRoute.title}</strong>
            <p>{nextRoute.subtitle}</p>
            <Link to={`/route/${nextRoute.id}`}>{labels.nextRoute ?? t("nextRoute")}</Link>
          </article>
        </aside>
      </section>
    </main>
  );
}

export default RoutePage;


