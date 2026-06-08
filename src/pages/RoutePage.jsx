import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { readingRoutes } from "../data/routes";
import { works } from "../data/works";
import { useI18n } from "../i18n/useI18n";
import { useProgressStore } from "../store/useProgressStore";
import {
  MuraArrowIcon,
  MuraBackIcon,
  MuraBookmarkIcon,
  MuraBookOpenIcon,
  MuraCheckIcon,
  MuraClockIcon,
  MuraGlobeIcon,
  MuraLayersIcon,
  MuraLockIcon,
  MuraQuoteIcon,
  MuraShareIcon,
  MuraTargetIcon,
} from "../components/icons/MuraIconSet";
import "./RoutePage.css";

const ROUTE_STEP_STORAGE_PREFIX = "mura_route_step:";
const ROUTE_MAX_STEP_STORAGE_PREFIX = "mura_route_max_step:";
const ROUTE_NOTES_STORAGE_PREFIX = "mura_route_notes:";
const ROUTE_XP_REWARD = 45;

function getStoredNumber(key, fallback = 0) {
  if (typeof window === "undefined") return fallback;
  const parsed = Number.parseInt(window.localStorage.getItem(key) ?? "", 10);
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
  const localizedWorks = localizeWorks(works);
  const route = useMemo(
    () => localizedRoutes.find((item) => item.id === routeId),
    [localizedRoutes, routeId]
  );
  const favorites = useProgressStore((state) => state.favorites);
  const storyProgress = useProgressStore((state) => state.storyProgress);
  const completeStory = useProgressStore((state) => state.completeStory);
  const toggleFavorite = useProgressStore((state) => state.toggleFavorite);

  const [currentStep, setCurrentStep] = useState(0);
  const [maxUnlockedStep, setMaxUnlockedStep] = useState(0);
  const [noteDraft, setNoteDraft] = useState("");
  const [isAllStagesOpen, setIsAllStagesOpen] = useState(false);
  const [shareMessage, setShareMessage] = useState("");
  const [noteMessage, setNoteMessage] = useState("");
  const [quizAnswers, setQuizAnswers] = useState({});

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
      previousStage: t("previousStage"),
      nextStage: t("nextStage"),
      finishRoute: t("completeRoute"),
      completedRoute: t("completedRoute"),
      context: t("context"),
      quotes: t("quotes"),
      notes: t("notes"),
      save: t("save"),
      notePlaceholder: t("routeNotePlaceholder"),
      noteSaved: t("routeNoteSaved"),
      quizTitle: t("routeQuizTitle"),
      recommendation: t("recommendedNext"),
      notReady: t("routeNotReady"),
      nextRoute: t("nextRoute"),
      of: t("of"),
    }),
    [t]
  );

  const steps = route?.steps ?? [];
  const stepStorageKey = `${ROUTE_STEP_STORAGE_PREFIX}${routeId ?? "missing"}`;
  const maxStepStorageKey = `${ROUTE_MAX_STEP_STORAGE_PREFIX}${routeId ?? "missing"}`;
  const noteStorageKey = `${ROUTE_NOTES_STORAGE_PREFIX}${routeId ?? "missing"}`;

  useEffect(() => {
    if (!route) return;
    const boundedStoredStep = Math.max(
      0,
      Math.min(getStoredNumber(stepStorageKey, 0), route.steps.length - 1)
    );
    const boundedMaxStep = Math.max(
      boundedStoredStep,
      Math.min(getStoredNumber(maxStepStorageKey, boundedStoredStep), route.steps.length - 1)
    );

    setCurrentStep(boundedStoredStep);
    setMaxUnlockedStep(boundedMaxStep);
    setNoteDraft(getStoredText(noteStorageKey));
    setIsAllStagesOpen(false);
    setShareMessage("");
    setNoteMessage("");
  }, [route, stepStorageKey, maxStepStorageKey, noteStorageKey]);

  useEffect(() => {
    if (!route || typeof window === "undefined") return;
    window.localStorage.setItem(stepStorageKey, String(currentStep));
    window.localStorage.setItem(maxStepStorageKey, String(maxUnlockedStep));
  }, [currentStep, maxUnlockedStep, route, stepStorageKey, maxStepStorageKey]);

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
  const routeState = storyProgress[route.id];
  const isRouteCompleted = Boolean(routeState?.completed);
  const isRouteFavorite = favorites.some((favorite) => favorite.type === "route" && favorite.id === route.id);
  const progressPercent = isRouteCompleted
    ? 100
    : Math.round(((maxUnlockedStep + 1) / Math.max(steps.length, 1)) * 100);
  const activeWork =
    localizedWorks.find((work) => work.id === activeStep?.workId) ??
    routeWorks.find((work) => getLocalizedValue(activeStep?.body, language).includes(work.title)) ??
    routeWorks[0];
  const continueHref = activeWork ? `/reading/${activeWork.id}` : "/works";
  const nextRoute = localizedRoutes.find((item) => item.id === route.recommendedNext) ?? localizedRoutes[0];
  const routeLanguages = route.languages ?? "KZ / RU / EN";
  const currentAsideCards = getAsideCards(route, activeStep, activeWork, nextRoute, labels, t, language);
  const quizOptions = activeStep?.quiz?.options?.length
    ? activeStep.quiz.options
    : [t("routeQuizOptionA"), t("routeQuizOptionB")];
  const activeQuizAnswer = quizAnswers[activeStepKey];

  const selectStep = (index) => {
    const bounded = Math.max(0, Math.min(steps.length - 1, index));
    if (bounded > maxUnlockedStep && !isRouteCompleted) return;
    setCurrentStep(bounded);
    setShareMessage("");
    setNoteMessage("");
  };

  const unlockAndSelectStep = (index) => {
    const bounded = Math.max(0, Math.min(steps.length - 1, index));
    setMaxUnlockedStep((current) => Math.max(current, bounded));
    setCurrentStep(bounded);
    setShareMessage("");
    setNoteMessage("");
  };

  const resetRoute = () => {
    setCurrentStep(0);
    setMaxUnlockedStep(0);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(stepStorageKey, "0");
      window.localStorage.setItem(maxStepStorageKey, "0");
    }
  };

  const finishRoute = () => {
    setMaxUnlockedStep(steps.length - 1);
    setCurrentStep(steps.length - 1);
    if (!isRouteCompleted) {
      completeStory(route.id, ROUTE_XP_REWARD);
    }
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
      await navigator.clipboard?.writeText(url);
      setShareMessage(t("shareLinkCopied"));
    } catch {
      if (navigator.share) {
        try {
          await navigator.share({ title: route.title, text: route.subtitle, url });
          setShareMessage(t("shareLinkCopied"));
          return;
        } catch {
          setShareMessage(labels.notReady);
          return;
        }
      }
      setShareMessage(labels.notReady);
    }
  };

  const saveNote = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(noteStorageKey, noteDraft);
    }
    setNoteMessage(labels.noteSaved);
  };

  const goToPreviousStep = () => selectStep(currentStep - 1);
  const goToNextStep = () => {
    if (currentStep === steps.length - 1) {
      finishRoute();
      return;
    }
    unlockAndSelectStep(currentStep + 1);
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

  return (
    <main className="route-page route-page--premium">
      <section className="route-premium-hero">
        <div className="route-breadcrumbs">
          <Link to="/explore">{labels.routes}</Link>
          <span>/</span>
          <strong>{route.title}</strong>
        </div>

        <div className="route-premium-hero__grid">
          <div className="route-premium-hero__copy">
            <h1>{route.title}</h1>
            <p>{route.subtitle}</p>
            <div className="route-premium-stats" aria-label={labels.routes}>
              <RouteStat icon={<MuraBookOpenIcon />} value={routeWorks.length} label={labels.works} />
              <RouteStat icon={<MuraLayersIcon />} value={steps.length} label={labels.stages} />
              <RouteStat icon={<MuraClockIcon />} value={`${route.minutes} ${t("min")}`} label={labels.time} />
              <RouteStat icon={<MuraGlobeIcon />} value={routeLanguages} label={labels.language} />
            </div>
          </div>

          <div className="route-premium-hero__actions" aria-label={labels.routes}>
            <Link className="route-action route-action--primary" to={continueHref}>
              <span>{labels.continueReading}</span>
              <MuraArrowIcon />
            </Link>
            <button
              type="button"
              className={`route-action ${isRouteFavorite ? "is-active" : ""}`}
              onClick={toggleRouteFavorite}
            >
              <MuraBookmarkIcon />
              <span>{isRouteFavorite ? labels.saved : labels.favorite}</span>
            </button>
            <button type="button" className="route-action route-action--icon" onClick={shareRoute} aria-label={labels.share} title={labels.share}>
              <MuraShareIcon />
            </button>
          </div>
        </div>
      </section>

      <section className="route-progress-strip">
        <span>{labels.yourProgress}</span>
        <div className="route-progress-track" aria-hidden="true">
          <i style={{ width: `${progressPercent}%` }} />
        </div>
        <strong>{progressPercent}%</strong>
        <em>{labels.stage} {currentStep + 1} {labels.of} {steps.length}</em>
        {shareMessage ? <small className="route-action-status">{shareMessage}</small> : null}
      </section>

      <section className="route-premium-workspace">
        <aside className="route-stage-rail">
          <div className="route-panel-heading">
            <h2>{labels.routeStages}</h2>
            <button
              type="button"
              aria-expanded={isAllStagesOpen}
              onClick={() => setIsAllStagesOpen((current) => !current)}
            >
              {isAllStagesOpen ? "−" : "+"}
            </button>
          </div>
          <ol className={`route-stage-rail__list ${isAllStagesOpen ? "is-expanded" : ""}`}>
            {steps.map((step, index) => {
              const isCurrent = index === currentStep;
              const isCompleted = isRouteCompleted || index < maxUnlockedStep;
              const isLocked = !isRouteCompleted && index > maxUnlockedStep;
              const stepTitle = getStepTitle(step, t, language);

              return (
                <li
                  key={`${step.type}-${index}`}
                  className={`${isCurrent ? "is-current" : ""} ${isCompleted ? "is-completed" : ""} ${isLocked ? "is-locked" : ""}`}
                >
                  <button
                    type="button"
                    disabled={isLocked}
                    aria-current={isCurrent ? "step" : undefined}
                    title={isLocked ? labels.notReady : stepTitle}
                    onClick={() => selectStep(index)}
                  >
                    <span aria-hidden="true">
                      {isCompleted && !isCurrent ? <MuraCheckIcon /> : isLocked ? <MuraLockIcon /> : index + 1}
                    </span>
                    <strong>{stepTitle}</strong>
                    <small>{isCurrent ? labels.stage : getLocalizedValue(step.railHint, language) || getLocalizedValue(step.eyebrow, language) || ""}</small>
                  </button>
                </li>
              );
            })}
          </ol>
          <button type="button" className="route-show-all" onClick={() => setIsAllStagesOpen((current) => !current)}>
            {labels.showAllStages}
          </button>
        </aside>

        <section className="route-stage-reader" key={activeStepKey}>
          <div className="route-stage-reader__meta">
            <span>{labels.stage} {currentStep + 1} {labels.of} {steps.length}</span>
            <span>{getLocalizedValue(activeStep.eyebrow, language) || getStepTitle(activeStep, t, language)}</span>
          </div>
          <h2>{getStepTitle(activeStep, t, language)}</h2>
          <p className="route-stage-reader__lead">
            {getLocalizedValue(activeStep.lead, language) || getLocalizedValue(activeStep.text, language)}
          </p>

          <article className="route-stage-paper">
            {getLocalizedValue(activeStep.quote, language) ? (
              <blockquote>
                <MuraQuoteIcon />
                <span>{getLocalizedValue(activeStep.quote, language)}</span>
                <cite>{getLocalizedValue(activeStep.source, language) || route.title}</cite>
              </blockquote>
            ) : null}
            {getRouteParagraphs(activeStep, language, t, route).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </article>

          {activeStep.type === "task" || activeStep.quiz ? (
            <article className="route-task-card">
              <div>
                <span><MuraTargetIcon /> {labels.quizTitle}</span>
                <h3>{getLocalizedValue(activeStep.quiz?.question, language) || t("routeQuizQuestion")}</h3>
                {activeQuizAnswer ? (
                  <p className={activeQuizAnswer.isCorrect ? "is-correct" : "is-incorrect"}>
                    {activeQuizAnswer.isCorrect ? t("quizCorrect") : t("quizIncorrect")} ·{" "}
                    {getLocalizedValue(activeStep.quiz?.explanation, language) ||
                      getLocalizedValue(activeStep.explanation, language) ||
                      t("routeExplanationFallback")}
                  </p>
                ) : null}
              </div>
              <div className="route-task-card__options">
                {quizOptions.map((option, index) => {
                  const optionText = getLocalizedValue(option, language);
                  return (
                    <button
                      key={`${activeStepKey}-${optionText}`}
                      type="button"
                      disabled={Boolean(activeQuizAnswer)}
                      className={activeQuizAnswer?.option === option ? (activeQuizAnswer.isCorrect ? "is-correct" : "is-incorrect") : ""}
                      onClick={() => handleRouteQuizAnswer(option, index)}
                    >
                      {optionText}
                    </button>
                  );
                })}
              </div>
            </article>
          ) : null}

          <article className="route-note-editor">
            <label htmlFor="route-note">{labels.notes}</label>
            <textarea
              id="route-note"
              value={noteDraft}
              onChange={(event) => {
                setNoteDraft(event.target.value);
                setNoteMessage("");
              }}
              placeholder={labels.notePlaceholder}
            />
            <div>
              <button type="button" onClick={saveNote}>{labels.save}</button>
              {noteMessage ? <small>{noteMessage}</small> : null}
            </div>
          </article>

          <div className="route-stage-nav">
            <button type="button" onClick={goToPreviousStep} disabled={currentStep === 0}>
              <MuraBackIcon /> {labels.previousStage}
            </button>
            <span>{currentStep + 1} / {steps.length}</span>
            <button type="button" onClick={goToNextStep}>
              {currentStep === steps.length - 1
                ? isRouteCompleted
                  ? labels.completedRoute
                  : labels.finishRoute
                : labels.nextStage}
              <MuraArrowIcon />
            </button>
          </div>
        </section>

        <aside className="route-context-stack">
          {currentAsideCards.map((card) => (
            <article className="route-context-card" key={`${activeStepKey}-${card.type}`}>
              <span>
                {card.icon}
                {card.label}
              </span>
              <h3>{card.title}</h3>
              <p>{card.text}</p>
              {card.href ? <Link to={card.href}>{card.action} <MuraArrowIcon /></Link> : null}
            </article>
          ))}
          <article className="route-next-card">
            <span>{labels.recommendation}</span>
            <strong>{nextRoute.title}</strong>
            <p>{nextRoute.subtitle}</p>
            <Link to={`/route/${nextRoute.id}`}>{labels.nextRoute} <MuraArrowIcon /></Link>
          </article>
          <button type="button" className="route-secondary-reset" onClick={resetRoute}>
            {labels.restart}
          </button>
        </aside>
      </section>
    </main>
  );
}

function RouteStat({ icon, value, label }) {
  return (
    <article>
      {icon}
      <strong>{value}</strong>
      <small>{label}</small>
    </article>
  );
}

function getStepTitle(step, t, language) {
  if (step?.title && typeof step.title !== "string") {
    return getLocalizedValue(step.title, language);
  }

  return t(`routeStep_${step?.type}`) || step?.title || "";
}

function getRouteParagraphs(step, language, t, route) {
  const body = getLocalizedValue(step?.body, language) || getLocalizedValue(step?.content, language);
  if (Array.isArray(body)) return body.filter(Boolean);
  if (typeof body === "string" && body.trim()) return body.split(/\n+/).filter(Boolean);
  return [t(`routeStepContent_${step?.type}`), t("routeContextFallback", { route: route.title })].filter(Boolean);
}

function getAsideCards(route, step, activeWork, nextRoute, labels, t, language) {
  if (Array.isArray(step?.asideCards) && step.asideCards.length) {
    return step.asideCards.slice(0, 3).map((card) => ({
      type: card.type,
      label: getLocalizedValue(card.label, language),
      title: getLocalizedValue(card.title, language),
      text: getLocalizedValue(card.text, language),
      action: getLocalizedValue(card.action, language) || labels.continueReading,
      href: card.href,
      icon: getCardIcon(card.type),
    }));
  }

  return [
    {
      type: "context",
      label: labels.context,
      title: getStepTitle(step, t, language),
      text: getLocalizedValue(step?.context, language) || t("routeContextFallback", { route: route.title }),
      action: activeWork ? activeWork.title : labels.notReady,
      href: activeWork ? `/reading/${activeWork.id}` : "/works",
      icon: <MuraBookOpenIcon />,
    },
    {
      type: "quote",
      label: labels.quotes,
      title: getLocalizedValue(step?.source, language) || route.title,
      text: getLocalizedValue(step?.quote, language) || t("routeQuoteFallback"),
      icon: <MuraQuoteIcon />,
    },
    {
      type: "next",
      label: labels.nextRoute,
      title: nextRoute.title,
      text: nextRoute.subtitle,
      action: labels.nextRoute,
      href: `/route/${nextRoute.id}`,
      icon: <MuraArrowIcon />,
    },
  ];
}

function getCardIcon(type) {
  if (type === "quote") return <MuraQuoteIcon />;
  if (type === "next" || type === "related") return <MuraArrowIcon />;
  if (type === "idea") return <MuraTargetIcon />;
  return <MuraBookOpenIcon />;
}

function getLocalizedValue(value, language = "en") {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map((item) => getLocalizedValue(item, language)).filter(Boolean);
  return (
    value[language] ??
    value.kk ??
    value.kz ??
    value.ru ??
    value.en ??
    Object.values(value)[0] ??
    ""
  );
}

export default RoutePage;
