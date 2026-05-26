import { Link, useParams } from "react-router-dom";
import { readingRoutes } from "../data/routes";
import { works } from "../data/works";
import { useI18n } from "../i18n/I18nContext";
import { useProgressStore } from "../store/useProgressStore";
import "./RoutePage.css";

function RoutePage() {
  const { routeId } = useParams();
  const { t, localizeWorks } = useI18n();
  const completeStory = useProgressStore((state) => state.completeStory);
  const route = readingRoutes.find((item) => item.id === routeId) ?? readingRoutes[0];
  const nextRoute = readingRoutes.find((item) => item.id === route.recommendedNext) ?? readingRoutes[0];
  const localizedWorks = localizeWorks(works);
  const routeWorks = route.works.map((id) => localizedWorks.find((work) => work.id === id)).filter(Boolean);
  const cover = routeWorks[0]?.image;

  const finishRoute = () => {
    completeStory(route.id, 45);
  };

  return (
    <main className="route-page">
      <section className="route-hero">
        <div>
          <p className="heritage-kicker">{t("interactiveRoutesTitle")}</p>
          <h1>{route.title}</h1>
          <p>{route.subtitle}</p>
          <div className="route-hero__meta">
            <span>{route.minutes} {t("min")}</span>
            <span>{routeWorks.length} {t("works").toLowerCase()}</span>
            <span>{route.focusTheme}</span>
          </div>
        </div>
        {cover ? <img src={cover} alt="" /> : null}
      </section>

      <section className="route-steps">
        {route.steps.map((step, index) => (
          <article className="route-step" key={`${step.type}-${index}`}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <div>
              <p>{t(`routeStep_${step.type}`)}</p>
              <h2>{step.title}</h2>
              <strong>{step.text}</strong>
              {step.type === "work" ? (
                <div className="route-step__works">
                  {routeWorks.map((work) => (
                    <Link key={work.id} to={`/reading/${work.id}`}>
                      <img src={work.image} alt="" />
                      <span>{work.title}</span>
                    </Link>
                  ))}
                </div>
              ) : null}
              {step.type === "task" ? (
                <div className="route-task">
                  <p>{t("routeQuizQuestion")}</p>
                  <button type="button">{t("routeQuizOptionA")}</button>
                  <button type="button">{t("routeQuizOptionB")}</button>
                </div>
              ) : null}
              {step.type === "finish" ? (
                <div className="route-finish">
                  <button type="button" onClick={finishRoute}>{t("completeRoute")}</button>
                  <Link to={`/route/${nextRoute.id}`}>{t("nextRoute")}: {nextRoute.title}</Link>
                </div>
              ) : null}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

export default RoutePage;
