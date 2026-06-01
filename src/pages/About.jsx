import { Link } from "react-router-dom";
import { useI18n } from "../i18n/useI18n";
import "./About.css";

const conceptKeys = [
  "aboutConceptDigitalHumanities",
  "aboutConceptYouth",
  "aboutConceptUdl",
  "aboutConceptTranslingual",
  "aboutConceptStorytelling",
  "aboutConceptGamification",
];

const architectureKeys = [
  "aboutArchitectureContent",
  "aboutArchitectureInteraction",
  "aboutArchitectureGamification",
  "aboutArchitectureUserData",
  "aboutArchitectureAdmin",
];

const methodKeys = [
  "aboutMethodRepresentation",
  "aboutMethodEngagement",
  "aboutMethodAction",
  "aboutMethodBridge",
];

function About() {
  const { t } = useI18n();

  return (
    <main className="about-page">
      <div className="about-shell">
        <section className="about-hero">
          <p className="about-kicker">{t("aboutKicker")}</p>
          <h1>{t("aboutTitle")}</h1>
          <p>{t("aboutIntro")}</p>
          <div className="about-hero__statement" aria-label={t("aboutMethodologySummary")}>
            <span>{t("aboutStatementArchive")}</span>
            <span>{t("aboutStatementAccess")}</span>
            <span>{t("aboutStatementArchitecture")}</span>
          </div>
          <div className="about-hero__actions">
            <Link to="/works">{t("navWorks")}</Link>
            <Link to="/explore">{t("navExplore")}</Link>
          </div>
        </section>

        <section className="about-grid">
          <article className="about-card is-wide">
            <p className="about-kicker">{t("aboutMissionKicker")}</p>
            <h2>{t("aboutMissionTitle")}</h2>
            <p>{t("aboutMissionText")}</p>
          </article>

          <article className="about-card">
            <p className="about-kicker">{t("aboutUniversityKicker")}</p>
            <h2>{t("aboutUniversityTitle")}</h2>
            <p>{t("aboutUniversityText")}</p>
          </article>

          <article className="about-card">
            <p className="about-kicker">{t("aboutDifferenceKicker")}</p>
            <h2>{t("aboutDifferenceTitle")}</h2>
            <p>{t("aboutDifferenceText")}</p>
          </article>
        </section>

        <section className="about-card">
          <div className="about-section-heading">
            <p className="about-kicker">{t("aboutConceptKicker")}</p>
            <h2>{t("aboutConceptTitle")}</h2>
          </div>
          <div className="about-team about-concept-grid">
            {conceptKeys.map((key) => (
              <article key={key}>
                <span>{t(`${key}Kicker`)}</span>
                <strong>{t(key)}</strong>
                <small>{t(`${key}Text`)}</small>
              </article>
            ))}
          </div>
        </section>

        <section className="about-card">
          <div className="about-section-heading">
            <p className="about-kicker">{t("aboutArchitectureKicker")}</p>
            <h2>{t("aboutArchitectureTitle")}</h2>
          </div>
          <div className="about-sources">
            {architectureKeys.map((key) => (
              <article key={key}>
                <strong>{t(key)}</strong>
                <p>{t(`${key}Text`)}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="about-card">
          <div className="about-section-heading">
            <p className="about-kicker">{t("aboutComplianceKicker")}</p>
            <h2>{t("aboutComplianceTitle")}</h2>
          </div>
          <div className="about-checklist" aria-label="Requirement checklist">
            {methodKeys.map((key) => (
              <span key={key}>{t(key)}</span>
            ))}
          </div>
        </section>

        <section className="about-contact">
          <div>
            <p className="about-kicker">{t("aboutContactKicker")}</p>
            <h2>{t("aboutContactTitle")}</h2>
            <p>{t("aboutContactText")}</p>
          </div>
          <Link to="/profile">{t("profile")}</Link>
        </section>
      </div>
    </main>
  );
}

export default About;
