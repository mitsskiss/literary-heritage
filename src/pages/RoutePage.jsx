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

const routeLabels = {
  en: {
    routes: "Interactive routes",
    backToRoutes: "Back to routes",
    home: "Home",
    routeMissingTitle: "Route not found",
    routeMissingText: "This literary route is not in the current archive yet.",
    works: "works",
    authorsContext: "authors / context",
    stages: "stages",
    time: "passing time",
    level: "level",
    language: "language",
    yourProgress: "Your progress",
    continueReading: "Continue reading",
    restart: "Start again",
    favorite: "Add to favorites",
    saved: "Saved",
    share: "Share",
    routeStages: "Route stages",
    showAllStages: "Show all stages",
    stage: "Stage",
    compareLanguages: "Compare languages",
    previousStage: "Previous stage",
    nextStage: "Next stage",
    finishRoute: "Complete route",
    completedRoute: "Route completed",
    context: "Context",
    explanation: "Explanation",
    quotes: "Quotes",
    notes: "Notes",
    source: "Source",
    listen: "Listen",
    save: "Save",
    notePlaceholder: "Write a short thought about this stage...",
    noteSaved: "Saved route note",
    quizTitle: "Deeper understanding",
    quizAction: "Take quiz",
    recommendation: "Recommended next",
    medium: "medium",
    notReady: "Select a stage to continue reading.",
  },
  ru: {
    routes: "Интерактивные маршруты",
    backToRoutes: "К маршрутам",
    home: "На главную",
    routeMissingTitle: "Маршрут не найден",
    routeMissingText: "Этого литературного маршрута пока нет в текущем архиве.",
    works: "произведений",
    authorsContext: "автора / контекста",
    stages: "этапов",
    time: "время прохождения",
    level: "уровень",
    language: "язык",
    yourProgress: "Ваш прогресс",
    continueReading: "Продолжить чтение",
    restart: "Начать сначала",
    favorite: "В избранное",
    saved: "Сохранено",
    share: "Поделиться",
    routeStages: "Этапы маршрута",
    showAllStages: "Показать все этапы",
    stage: "Этап",
    compareLanguages: "Сравнить языки",
    previousStage: "Предыдущий этап",
    nextStage: "Следующий этап",
    finishRoute: "Завершить маршрут",
    completedRoute: "Маршрут завершен",
    context: "Контекст",
    explanation: "Пояснение",
    quotes: "Цитаты",
    notes: "Заметки",
    source: "Источник",
    listen: "Слушать",
    save: "Сохранить",
    notePlaceholder: "Напишите короткую мысль об этом этапе...",
    noteSaved: "Сохраненная заметка маршрута",
    quizTitle: "Глубже понять маршрут",
    quizAction: "Пройти quiz",
    recommendation: "Рекомендуем дальше",
    medium: "средний",
    notReady: "Выберите этап, чтобы продолжить чтение.",
  },
  kk: {
    routes: "Интерактивті маршруттар",
    backToRoutes: "Маршруттарға",
    home: "Басты бет",
    routeMissingTitle: "Маршрут табылмады",
    routeMissingText: "Бұл әдеби маршрут әзірге архивте жоқ.",
    works: "шығарма",
    authorsContext: "автор / контекст",
    stages: "кезең",
    time: "өту уақыты",
    level: "деңгей",
    language: "тіл",
    yourProgress: "Сіздің прогресс",
    continueReading: "Оқуды жалғастыру",
    restart: "Қайта бастау",
    favorite: "Таңдаулыға",
    saved: "Сақталды",
    share: "Бөлісу",
    routeStages: "Маршрут кезеңдері",
    showAllStages: "Барлық кезеңдер",
    stage: "Кезең",
    compareLanguages: "Тілдерді салыстыру",
    previousStage: "Алдыңғы кезең",
    nextStage: "Келесі кезең",
    finishRoute: "Маршрутты аяқтау",
    completedRoute: "Маршрут аяқталды",
    context: "Контекст",
    explanation: "Түсіндірме",
    quotes: "Дәйексөздер",
    notes: "Жазбалар",
    source: "Дереккөз",
    listen: "Тыңдау",
    save: "Сақтау",
    notePlaceholder: "Осы кезең туралы қысқа ой жазыңыз...",
    noteSaved: "Сақталған маршрут жазбасы",
    quizTitle: "Маршрутты тереңірек түсіну",
    quizAction: "Quiz өту",
    recommendation: "Келесі ұсыныс",
    medium: "орташа",
    notReady: "Оқуды жалғастыру үшін кезең таңдаңыз.",
  },
};

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
  const { language, t, localizeWorks } = useI18n();
  const route = readingRoutes.find((item) => item.id === routeId);
  const labels = routeLabels[language] ?? routeLabels.en;
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
  const nextRoute = readingRoutes.find((item) => item.id === route.recommendedNext) ?? readingRoutes[0];
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
  const stepContent = activeStep.content ?? activeStep.text;
  const tabContent = {
    context:
      activeStep.context ??
      `${route.title} connects ${route.focusTheme.toLowerCase()} with the cultural memory of Kazakh literature.`,
    explanation:
      activeStep.explanation ??
      "Read this stage as a guided bridge between historical context, authorial idea, and the meaning of the selected work.",
    quotes:
      activeStep.quote ??
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
          <button type="button" aria-label={labels.share} onClick={shareRoute}>
            <span className="route-share-icon" aria-hidden="true" />
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
                    <strong>{step.title}</strong>
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
          <h2>{activeStep.title}</h2>
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
                <p>{activeStep.quiz?.question ?? t("routeQuizQuestion")}</p>
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
