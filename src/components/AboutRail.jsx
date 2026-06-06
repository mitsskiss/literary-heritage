import { Link } from "react-router-dom";
import { useI18n } from "../i18n/useI18n";

const principleKeys = [
  { key: "credible", icon: "source" },
  { key: "rigor", icon: "globe" },
  { key: "open", icon: "flower" },
  { key: "context", icon: "nodes" },
  { key: "preserve", icon: "seal" },
];

const partnerMarks = ["seal", "library", "rosette", "museum"];

function AboutRail() {
  const { t } = useI18n();

  return (
    <div className="about-rail" aria-label={t("aboutRailTitle")}>
      <article className="about-rail-card">
        <div className="about-rail-card__heading">
          <span className="about-gold-star" aria-hidden="true" />
          <div>
            <h2>{t("aboutRailTitle")}</h2>
            <p>{t("aboutRailSubtitle")}</p>
          </div>
        </div>

        <div className="about-principles">
          {principleKeys.map((item) => (
            <section className="about-principle" key={item.key}>
              <span className="about-icon-box" aria-hidden="true">
                <AboutIcon kind={item.icon} />
              </span>
              <span>
                <strong>{t(`aboutPrinciple${capitalize(item.key)}Title`)}</strong>
                <small>{t(`aboutPrinciple${capitalize(item.key)}Text`)}</small>
              </span>
            </section>
          ))}
        </div>
      </article>

      <article className="about-rail-card about-partners">
        <h2>{t("aboutPartnersTitle")}</h2>
        <p>{t("aboutPartnersText")}</p>
        <div className="about-partner-logos" aria-label={t("aboutPartnersTitle")}>
          {partnerMarks.map((mark) => (
            <span key={mark}>
              <PartnerMark kind={mark} />
            </span>
          ))}
        </div>
        <Link to="/about" className="about-partners__link">
          {t("aboutPartnersLink")}
          <span aria-hidden="true">→</span>
        </Link>
      </article>
    </div>
  );
}

function PartnerMark({ kind }) {
  const marks = {
    seal: (
      <>
        <circle cx="16" cy="16" r="11" />
        <circle cx="16" cy="16" r="7" />
        <path d="M16 9.5 18.1 14l4.8.6-3.5 3.2.9 4.7-4.3-2.3-4.3 2.3.9-4.7-3.5-3.2 4.8-.6Z" />
      </>
    ),
    library: (
      <>
        <path d="M6 24h20" />
        <path d="M8 21V12l8-5 8 5v9" />
        <path d="M11 21v-7" />
        <path d="M16 21v-8" />
        <path d="M21 21v-7" />
        <path d="M7 12h18" />
      </>
    ),
    rosette: (
      <>
        <circle cx="16" cy="16" r="10" />
        <path d="M16 6v20" />
        <path d="M6 16h20" />
        <path d="m8.9 8.9 14.2 14.2" />
        <path d="m23.1 8.9-14.2 14.2" />
        <circle cx="16" cy="16" r="3.3" />
      </>
    ),
    museum: (
      <>
        <path d="M5.5 24.5h21" />
        <path d="M7.5 12.5h17" />
        <path d="M9 12.5v12" />
        <path d="M14 12.5v12" />
        <path d="M19 12.5v12" />
        <path d="M24 12.5v12" />
        <path d="M6.5 10.5 16 5l9.5 5.5Z" />
      </>
    ),
  };

  return (
    <svg viewBox="0 0 32 32" focusable="false" aria-hidden="true">
      {marks[kind] ?? marks.seal}
    </svg>
  );
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function AboutIcon({ kind }) {
  const icons = {
    book: (
      <>
        <path d="M5 5.5h5a3 3 0 0 1 3 3v10a3 3 0 0 0-3-3H5Z" />
        <path d="M13 8.5a3 3 0 0 1 3-3h3v10h-3a3 3 0 0 0-3 3Z" />
      </>
    ),
    author: (
      <>
        <circle cx="12" cy="8" r="3" />
        <path d="M6.5 19a5.6 5.6 0 0 1 11 0" />
      </>
    ),
    map: (
      <>
        <path d="M5 6.5 10 5l5 1.5 4-1.5v12.5L15 19l-5-1.5L5 19Z" />
        <path d="M10 5v12.5" />
        <path d="M15 6.5V19" />
      </>
    ),
    source: (
      <>
        <path d="M7 4.5h8l3 3v12H7Z" />
        <path d="M15 4.5v3h3" />
        <path d="M9.5 11h6" />
        <path d="M9.5 14h5" />
      </>
    ),
    globe: (
      <>
        <circle cx="12" cy="12" r="7.5" />
        <path d="M4.8 12h14.4" />
        <path d="M12 4.5c2 2.1 3 4.6 3 7.5s-1 5.4-3 7.5" />
        <path d="M12 4.5c-2 2.1-3 4.6-3 7.5s1 5.4 3 7.5" />
      </>
    ),
    flower: (
      <>
        <path d="M12 8.5c1.4-3.2 4.8-2.7 4.8.2 2.9 0 3.4 3.4.2 4.8 3.2 1.4 2.7 4.8-.2 4.8 0 2.9-3.4 3.4-4.8.2-1.4 3.2-4.8 2.7-4.8-.2-2.9 0-3.4-3.4-.2-4.8-3.2-1.4-2.7-4.8.2-4.8 0-2.9 3.4-3.4 4.8-.2Z" />
        <circle cx="12" cy="13.5" r="2" />
      </>
    ),
    nodes: (
      <>
        <circle cx="7" cy="8" r="2" />
        <circle cx="17" cy="7" r="2" />
        <circle cx="16" cy="17" r="2" />
        <circle cx="6" cy="16" r="2" />
        <path d="m9 8 6-.8" />
        <path d="m16.6 9 0 6" />
        <path d="m14.2 17-6.2-.7" />
        <path d="m7 10 0 4" />
      </>
    ),
    seal: (
      <>
        <circle cx="12" cy="10" r="5.5" />
        <path d="m9 15-1 5 4-2 4 2-1-5" />
        <path d="m9.8 10 1.5 1.5 3-3" />
      </>
    ),
    scan: (
      <>
        <path d="M6 8V5h3" />
        <path d="M15 5h3v3" />
        <path d="M18 16v3h-3" />
        <path d="M9 19H6v-3" />
        <path d="M8 12h8" />
      </>
    ),
    tag: (
      <>
        <path d="M4.5 12.5 12 5h6.5v6.5L11 19Z" />
        <circle cx="15.5" cy="8.5" r="1.3" />
      </>
    ),
    connect: (
      <>
        <circle cx="6" cy="12" r="2" />
        <circle cx="18" cy="6" r="2" />
        <circle cx="18" cy="18" r="2" />
        <path d="m8 11 8-4" />
        <path d="m8 13 8 4" />
      </>
    ),
    share: (
      <>
        <circle cx="8" cy="9" r="3" />
        <path d="M4.5 19a5 5 0 0 1 7 0" />
        <path d="M15 7h4" />
        <path d="M17 5v4" />
        <path d="M15 14h4" />
      </>
    ),
    lock: (
      <>
        <rect x="5.5" y="10" width="13" height="9" rx="2" />
        <path d="M8.5 10V7.8a3.5 3.5 0 0 1 7 0V10" />
      </>
    ),
    balance: (
      <>
        <path d="M12 5v14" />
        <path d="M7 7h10" />
        <path d="m7 7-3 6h6Z" />
        <path d="m17 7-3 6h6Z" />
      </>
    ),
    spark: (
      <>
        <path d="M12 3.5 14 10l6.5 2-6.5 2-2 6.5-2-6.5-6.5-2 6.5-2Z" />
      </>
    ),
    shield: (
      <>
        <path d="M12 4.5 18 7v4.5c0 3.6-2.2 6.4-6 8-3.8-1.6-6-4.4-6-8V7Z" />
        <path d="m9.3 12.2 1.8 1.8 3.8-4.1" />
      </>
    ),
  };

  return (
    <svg viewBox="0 0 24 24" focusable="false">
      {icons[kind] ?? icons.source}
    </svg>
  );
}

export default AboutRail;
