import { Link } from "react-router-dom";
import AboutRail, { AboutIcon } from "../components/AboutRail";
import { useI18n } from "../i18n/useI18n";
import aboutHeroArchive from "../assets/about-hero-archive.png";
import memoryImage from "../assets/about-memory-heritage.png";
import "./About.css";

const stats = [
  { key: "works", value: "12,450+", icon: "book" },
  { key: "authors", value: "1,280+", icon: "author" },
  { key: "routes", value: "86", icon: "map" },
];

const journeySteps = [
  { key: "collect", number: "01", icon: "source" },
  { key: "digitize", number: "02", icon: "scan" },
  { key: "curate", number: "03", icon: "tag" },
  { key: "connect", number: "04", icon: "connect" },
  { key: "share", number: "05", icon: "share" },
];

const values = [
  { key: "authenticity", icon: "shield" },
  { key: "accessibility", icon: "lock" },
  { key: "integrity", icon: "balance" },
  { key: "innovation", icon: "spark" },
];

const memoryStats = [
  { key: "archives", value: "35+" },
  { key: "years", value: "7" },
  { key: "access", value: "24/7" },
];

function About() {
  const { t } = useI18n();

  return (
    <main className="about-page">
      <div className="about-shell">
        <nav className="about-breadcrumb" aria-label={t("navigation")}>
          <Link to="/">{t("navHome")}</Link>
          <span aria-hidden="true">&gt;</span>
          <span>{t("aboutBreadcrumbCurrent")}</span>
        </nav>

        <section className="about-hero" aria-labelledby="about-title">
          <div className="about-hero__copy">
            <p className="about-kicker">{t("aboutHeroKicker")}</p>
            <h1 id="about-title">{t("aboutHeroTitle")}</h1>
            <p className="about-hero__subtitle">{t("aboutHeroSubtitle")}</p>
            <div className="about-divider" aria-hidden="true">
              <span />
              <i />
            </div>
            <p className="about-hero__intro">{t("aboutHeroIntro")}</p>
            <div className="about-hero__actions">
              <Link to="/works" className="about-button about-button--primary">
                <AboutIcon kind="source" />
                {t("aboutExploreArchive")}
              </Link>
              <Link to="/explore" className="about-button about-button--secondary">
                <AboutIcon kind="globe" />
                {t("aboutHowWorks")}
              </Link>
            </div>
          </div>

          <div className="about-hero__visual" aria-hidden="true">
            <img src={aboutHeroArchive} alt="" />
          </div>
        </section>

        <section className="about-stats" aria-label={t("aboutStatsLabel")}>
          {stats.map((item) => (
            <article className="about-stat-card" key={item.key}>
              <span className="about-stat-card__icon" aria-hidden="true">
                <AboutIcon kind={item.icon} />
              </span>
              <div>
                <strong>{item.value}</strong>
                <h2>{t(`aboutStat${capitalize(item.key)}Title`)}</h2>
                <p>{t(`aboutStat${capitalize(item.key)}Text`)}</p>
              </div>
            </article>
          ))}
        </section>

        <section className="about-journey-card">
          <h2>{t("aboutJourneyTitle")}</h2>
          <div className="about-journey">
            {journeySteps.map((step) => (
              <article className="about-journey-step" key={step.key}>
                <span className="about-journey-step__icon" aria-hidden="true">
                  <AboutIcon kind={step.icon} />
                </span>
                <strong>{step.number}</strong>
                <h3>{t(`aboutJourney${capitalize(step.key)}Title`)}</h3>
                <p>{t(`aboutJourney${capitalize(step.key)}Text`)}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="about-lower-grid about-lower-grid--adaptive">
  <article className="about-values-card about-values-card--adaptive">
    <div className="about-card-title">
      <span className="about-gold-star" aria-hidden="true" />
      <h2>{t("aboutValuesTitle")}</h2>
    </div>

    <div className="about-values-grid about-values-grid--adaptive">
      {values.map((item) => (
        <section className="about-value-item about-value-item--adaptive" key={item.key}>
          <span className="about-icon-box" aria-hidden="true">
            <AboutIcon kind={item.icon} />
          </span>

          <span className="about-value-item__text">
            <strong>{t(`aboutValue${capitalize(item.key)}Title`)}</strong>
            <small>{t(`aboutValue${capitalize(item.key)}Text`)}</small>
          </span>
        </section>
      ))}
    </div>
  </article>

  <article className="about-memory-card about-memory-card--adaptive">
    <div className="about-memory-card__image" aria-hidden="true">
      <img src={memoryImage} alt="" />
    </div>

    <div className="about-memory-card__copy">
      <div className="about-card-title">
        <span className="about-gold-star" aria-hidden="true" />
        <h2>{t("aboutMemoryTitle")}</h2>
      </div>

      <p>{t("aboutMemoryText")}</p>

      <div className="about-memory-stats">
        {memoryStats.map((item) => (
          <span key={item.key}>
            <strong>{item.value}</strong>
            <small>{t(`aboutMemory${capitalize(item.key)}Label`)}</small>
          </span>
        ))}
      </div>
    </div>
  </article>
</section>


        <aside className="about-inline-rail">
          <AboutRail />
        </aside>
      </div>
    </main>
  );
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default About;
