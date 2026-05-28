import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { readingRoutes } from "../data/routes";
import { works } from "../data/works";
import { useI18n } from "../i18n/I18nContext";
import { useProgressStore } from "../store/useProgressStore";
import routesHero from "../assets/mura/routes-hero.png";
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
  const { t, localizeJourneys, localizeWorks } = useI18n();
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

  const steps = route?.steps ?? [];
  const stepStorageKey = `${ROUTE_STEP_STORAGE_PREFIX}${routeId ?? "missing"}`;
  const noteStorageKey = `${ROUTE_NOTES_STORAGE_PREFIX}${routeId ?? "missing"}`;

  useEffect(() => {
    if (!route) return;
    const storedStep = getStoredNumber(stepStorageKey, 0);
    setCurrentStep(Math.max(0, Math.min(storedStep, route.steps.length - 1)));
    setNoteDraft(getStoredText(noteStorageKey));
    setActiveTab("context");
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
  const nextRoute = localizedRoutes.find((item) => item.id === route.recommendedNext) ?? localizedRoutes[0];
  const routeState = storyProgress[route.id];
  const isRouteCompleted = Boolean(routeState?.completed);
  const isRouteFavorite = favorites.some((favorite) => favorite.type === "route" && favorite.id === route.id);
  const progressPercent = Math.round(((currentStep + 1) / steps.length) * 100);
  const activeWork =
    localizedWorks.find((work) => work.id === activeStep?.workId) ??
    routeWorks.find((work) => activeStep?.text?.includes(work.title)) ??
    routeWorks[0];
  const continueHref = activeWork ? `/reading/${activeWork.id}` : "/works";
  const uniqueAuthors = new Set(routeWorks.map((work) => work.author)).size || route.authorsCount || 1;
  const heroImage = route.heroImage ?? routesHero;
  const portraitImage = route.portraitImage ?? routeWorks[0]?.image;
  const routeDifficulty = route.difficulty ?? labels.medium;
  const routeLanguages = route.languages ?? "KZ / RU / EN";
  const getStepTitle = (step) => t(`routeStep_${step.type}`);
  const stepContent = t(`routeStepContent_${activeStep.type}`);
  const tabContent = {
    context:
      t("routeContextFallback", { route: route.title }),
    explanation:
      t("routeExplanationFallback"),
    quotes:
      t("routeQuoteFallback") ??
      activeWork?.fragments?.[0]?.reflection?.resonanceQuote?.text ??
      activeWork?.fragments?.[0]?.text ??
      route.subtitle,
    notes: noteDraft,
  };

  const saveNote = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(noteStorageKey, noteDraft);
    }
  };

  const resetRoute = () => {
    setCurrentStep(0);
    setActiveTab("context");
    if (typeof window !== "undefined") {
      window.localStorage.setItem(stepStorageKey, "0");
    }
  };

  const finishRoute = () => {
    if (!isRouteCompleted) {
      completeStory(route.id, ROUTE_XP_REWARD);
    }
    setCurrentStep(steps.length - 1);
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
        return;
      }
      await navigator.clipboard?.writeText(url);
    } catch {
      // Sharing can be cancelled by the user; the route page should stay quiet.
    }
  };

  const goToPreviousStep = () => {
    setCurrentStep((step) => Math.max(0, step - 1));
  };

  const goToNextStep = () => {
    setCurrentStep((step) => Math.min(steps.length - 1, step + 1));
  };

  return (
    <main className="route-page">
      <section className="route-journey-hero" style={{ "--route-hero-image": `url(${heroImage})` }}>
        <div className="route-breadcrumbs">
          <Link to="/explore">{labels.routes}</Link>
          <span>/</span>
          <strong>{route.title}</strong>
        </div>
        {portraitImage ? <img className="route-journey-hero__portrait" src={portraitImage} alt="" /> : null}
        <div className="route-journey-hero__copy">
          <h1>{route.title}</h1>
          <p>{route.subtitle}</p>
        </div>
      </section>

      <section className="route-stat-band" aria-label={t("catalogStats")}>
        <article>
          <span className="route-stat-icon route-stat-icon--book" />
          <strong>{routeWorks.length}</strong>
          <small>{labels.works}</small>
        </article>
        <article>
          <span className="route-stat-icon route-stat-icon--authors" />
          <strong>{uniqueAuthors}</strong>
          <small>{labels.authorsContext}</small>
        </article>
        <article>
          <span className="route-stat-icon route-stat-icon--flag" />
          <strong>{steps.length}</strong>
          <small>{labels.stages}</small>
        </article>
        <article>
          <span className="route-stat-icon route-stat-icon--time" />
          <strong>{route.minutes}</strong>
          <small>{labels.time}</small>
        </article>
        <article>
          <span className="route-stat-icon route-stat-icon--level" />
          <strong>{routeDifficulty}</strong>
          <small>{labels.level}</small>
        </article>
        <article>
          <span className="route-stat-icon route-stat-icon--globe" />
          <strong>{routeLanguages}</strong>
          <small>{labels.language}</small>
        </article>
      </section>

      <section className="route-action-bar">
        <div className="route-action-bar__progress">
          <span>{labels.yourProgress}</span>
          <div className="route-progress-track" aria-hidden="true">
            <i style={{ width: `${progressPercent}%` }} />
          </div>
          <strong>{progressPercent}%</strong>
        </div>
        <div className="route-action-bar__buttons">
          <Link to={continueHref}>{labels.continueReading}</Link>
          <button type="button" onClick={resetRoute}>{labels.restart}</button>
          <button
            type="button"
            className={isRouteFavorite ? "is-active" : ""}
            onClick={toggleRouteFavorite}
          >
            {isRouteFavorite ? labels.saved : labels.favorite}
          </button>
          <button
            type="button"
            className="route-share-button"
            aria-label={labels.share}
            title={labels.share}
            onClick={shareRoute}
          >
            <span className="route-share-icon" aria-hidden="true" />
            <span>{labels.share}</span>
          </button>
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
                  <button type="button" onClick={() => setCurrentStep(index)}>
                    <span>{isCompleted ? "✓" : index + 1}</span>
                    <strong>{getStepTitle(step)}</strong>
                  </button>
                </li>
              );
            })}
          </ol>
          <button type="button" className="route-show-all">
            {labels.showAllStages}
          </button>
        </aside>

        <section className="route-active-stage">
          <div className="route-active-stage__top">
            <p>{labels.stage} {currentStep + 1} {t("of")} {steps.length}</p>
            <button type="button">{labels.compareLanguages}</button>
          </div>
          <h2>{getStepTitle(activeStep)}</h2>
          <p>{t(`routeStep_${activeStep.type}`)}</p>

          <article className="route-parchment">
            <p>{stepContent}</p>
            {activeWork ? (
              <footer>
                <button type="button">
                  <span className="route-sound-icon" aria-hidden="true" />
                  {labels.listen}
                </button>
                <button type="button" aria-label={labels.favorite}>
                  <span className="route-bookmark-icon" aria-hidden="true" />
                </button>
                <span>{labels.source}: {activeStep.source ?? activeWork.title}</span>
              </footer>
            ) : null}
          </article>

          {activeStep.quiz || activeStep.type === "task" ? (
            <div className="route-quiz-card">
              <div>
                <h3>{labels.quizTitle}</h3>
                <p>{t("routeQuizQuestion")}</p>
              </div>
              <button type="button">{labels.quizAction}</button>
            </div>
          ) : null}

          {activeStep.type === "finish" ? (
            <div className="route-quiz-card route-quiz-card--finish">
              <div>
                <h3>{isRouteCompleted ? labels.completedRoute : labels.finishRoute}</h3>
                <p>{route.subtitle}</p>
              </div>
              <button type="button" onClick={finishRoute}>
                {isRouteCompleted ? labels.completedRoute : `+${ROUTE_XP_REWARD} XP`}
              </button>
            </div>
          ) : null}

          <div className="route-stage-nav">
            <button type="button" onClick={goToPreviousStep} disabled={currentStep === 0}>
              ← {labels.previousStage}
            </button>
            <span>{currentStep + 1} / {steps.length}</span>
            {currentStep === steps.length - 1 ? (
              <button type="button" onClick={finishRoute}>
                {isRouteCompleted ? labels.completedRoute : labels.finishRoute}
              </button>
            ) : (
              <button type="button" onClick={goToNextStep}>
                {labels.nextStage} →
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
                onChange={(event) => setNoteDraft(event.target.value)}
                placeholder={labels.notePlaceholder}
              />
              <button type="button" onClick={saveNote}>{labels.save}</button>
              {noteDraft ? <small>{labels.noteSaved}</small> : null}
            </div>
          ) : (
            <article className="route-tab-card">
              {activeTab === "quotes" ? <span className="route-quote-mark">“</span> : null}
              <p>{tabContent[activeTab]}</p>
              {activeTab === "quotes" ? (
                <small>— {activeWork?.author ?? route.title}</small>
              ) : (
                <Link to={activeWork ? `/reading/${activeWork.id}` : "/works"}>
                  {activeWork ? activeWork.title : labels.notReady} →
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

