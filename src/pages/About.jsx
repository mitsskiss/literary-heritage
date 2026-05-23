import { Link } from "react-router-dom";
import { useI18n } from "../i18n/I18nContext";
import "./About.css";

const contributorKeys = [
  "aboutRoleDesigner",
  "aboutRoleDeveloper",
  "aboutRoleContent",
  "aboutRoleSupervisor",
];

const sourceKeys = [
  "aboutSourcePrimaryTexts",
  "aboutSourceAuthorStudies",
  "aboutSourceLiteraryTheory",
  "aboutSourceOfficialArchives",
];

const requirementKeys = [
  "aboutRequirementResponsive",
  "aboutRequirementLocalization",
  "aboutRequirementAuth",
  "aboutRequirementAdmin",
  "aboutRequirementSecurity",
  "aboutRequirementInteractive",
];

const productMetrics = [
  { value: "3", labelKey: "aboutMetricLanguages" },
  { value: "CMS", labelKey: "aboutMetricCms" },
  { value: "AA", labelKey: "aboutMetricAccess" },
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
          <div className="about-hero__metrics" aria-label="Project highlights">
            {productMetrics.map((metric) => (
              <article key={metric.labelKey}>
                <strong>{metric.value}</strong>
                <span>{t(metric.labelKey)}</span>
              </article>
            ))}
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
        </section>

        <section className="about-card">
          <div className="about-section-heading">
            <p className="about-kicker">{t("aboutTeamKicker")}</p>
            <h2>{t("aboutTeamTitle")}</h2>
          </div>
          <div className="about-team">
            {contributorKeys.map((key) => (
              <article key={key}>
                <span>{t(key)}</span>
                <strong>{t(`${key}Name`)}</strong>
                <small>{t(`${key}Text`)}</small>
              </article>
            ))}
          </div>
        </section>

        <section className="about-card">
          <div className="about-section-heading">
            <p className="about-kicker">{t("aboutSourcesKicker")}</p>
            <h2>{t("aboutSourcesTitle")}</h2>
          </div>
          <div className="about-sources">
            {sourceKeys.map((key) => (
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
            {requirementKeys.map((key) => (
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
