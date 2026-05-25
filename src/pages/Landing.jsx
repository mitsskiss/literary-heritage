import { Link } from "react-router-dom";
import { authors } from "../data/authors";
import { works } from "../data/works";
import { useI18n } from "../i18n/I18nContext";

function Landing() {
  const { language, languages, setLanguage, t, localizeAuthors, localizeWorks } = useI18n();
  const localizedAuthors = localizeAuthors(authors);
  const localizedWorks = localizeWorks(works);

  const portalCards = [
    {
      title: t("navAuthors"),
      text: t("landingAuthorsText"),
      href: "/authors",
      image: localizedAuthors[0]?.image,
    },
    {
      title: t("navWorks"),
      text: t("landingWorksText"),
      href: "/works",
      image: localizedWorks[0]?.image,
    },
    {
      title: t("landingEpochs"),
      text: t("landingEpochsText"),
      href: "/explore",
      image: localizedWorks[2]?.image,
    },
    {
      title: t("favorite_quote"),
      text: t("landingQuotesText"),
      href: "/explore",
      image: localizedWorks[3]?.image,
    },
  ];

  const stats = [
    { value: "100+", label: t("navAuthors") },
    { value: "500+", label: t("navWorks") },
    { value: "3", label: t("language") },
    { value: t("landingRoutes"), label: t("startGuidedRoute") },
  ];

  const collections = [
    { title: t("landingPoetry"), image: localizedWorks[0]?.image, href: "/works" },
    { title: t("landingProse"), image: localizedWorks[1]?.image, href: "/works" },
    { title: t("landingFolklore"), image: localizedWorks[2]?.image, href: "/explore" },
    { title: t("landingThoughts"), image: localizedWorks[3]?.image, href: "/explore" },
    { title: t("landingRoutesTitle"), image: localizedWorks[4]?.image, href: "/map" },
  ];

  const platformFeatures = [
    { title: t("compareLanguages"), text: t("landingMultilingualText") },
    { title: t("landingCompareTexts"), text: t("landingCompareText") },
    { title: t("interactiveReading"), text: t("landingInteractiveText") },
    { title: t("headerProgress"), text: t("landingProgressText") },
  ];

  return (
    <main className="miras-home">
      <section className="miras-hero">
        <header className="miras-nav">
          <Link className="miras-brand" to="/">
            <span className="miras-brand__mark" aria-hidden="true" />
            <span>
              <strong>MIRAS</strong>
              <small>{t("brandTitle")}</small>
            </span>
          </Link>

          <nav className="miras-nav__links" aria-label={t("navigation")}>
            <Link to="/authors">{t("navAuthors")}</Link>
            <Link to="/works">{t("navWorks")}</Link>
            <Link to="/explore">{t("landingEpochs")}</Link>
            <Link to="/explore">{t("themes")}</Link>
            <Link to="/explore">{t("favorite_quote")}</Link>
            <Link to="/about">{t("navAbout")}</Link>
          </nav>

          <div className="miras-nav__tools">
            <span aria-hidden="true" className="miras-search-icon" />
            <select
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
              aria-label={t("language")}
            >
              {languages.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.shortLabel}
                </option>
              ))}
            </select>
          </div>
        </header>

        <div className="miras-ornament miras-ornament--left" aria-hidden="true" />
        <div className="miras-ornament miras-ornament--right" aria-hidden="true" />

        <div className="miras-hero__content">
          <p className="miras-kicker">{t("heroKicker")}</p>
          <h1>{t("heroTitle")}</h1>
          <p>{t("heroSubtitle")}</p>
          <div className="miras-hero__actions">
            <Link className="miras-button miras-button--primary" to="/works">
              {t("beginJourney")}
            </Link>
            <Link className="miras-button" to="/authors">
              {t("exploreAuthors")}
            </Link>
          </div>
        </div>

        <div className="miras-scene" aria-hidden="true">
          <div className="miras-scene__mountains" />
          <div className="miras-scene__desk" />
          <div className="miras-scene__book">
            <span />
            <span />
          </div>
          <div className="miras-scene__ink" />
          <div className="miras-scene__quill" />
          <div className="miras-scene__books" />
        </div>
      </section>

      <section className="miras-cards" aria-label={t("siteFeatures")}>
        {portalCards.map((card) => (
          <Link className="miras-card" key={card.title} to={card.href}>
            <div className="miras-card__top">
              <span className="miras-card__symbol" aria-hidden="true" />
              <strong>{card.title}</strong>
            </div>
            <div className="miras-card__image" style={{ backgroundImage: `url(${card.image})` }} />
            <div className="miras-card__bottom">
              <p>{card.text}</p>
              <span aria-hidden="true">›</span>
            </div>
          </Link>
        ))}
      </section>

      <section className="miras-stats" aria-label={t("catalogStats")}>
        {stats.map((item) => (
          <article key={item.label}>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </article>
        ))}
      </section>

      <section className="miras-collections">
        <div className="miras-collections__intro">
          <p>{t("worksKicker")}</p>
          <h2>{t("landingCollections")}</h2>
          <span>{t("landingCollectionsText")}</span>
          <Link to="/works">{t("openAllWorks")}</Link>
        </div>

        <div className="miras-collections__rail">
          {collections.map((item) => (
            <Link className="miras-collection" key={item.title} to={item.href}>
              <img src={item.image} alt="" />
              <strong>{item.title}</strong>
            </Link>
          ))}
        </div>
      </section>

      <section className="miras-platform">
        <div className="miras-platform__intro">
          <p>{t("aboutKicker")}</p>
          <h2>{t("landingPlatformTitle")}</h2>
          <span>{t("landingPlatformText")}</span>
        </div>
        <div className="miras-platform__features">
          {platformFeatures.map((feature) => (
            <article key={feature.title}>
              <span className="miras-feature-icon" aria-hidden="true" />
              <strong>{feature.title}</strong>
              <p>{feature.text}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="miras-footer">
        <div className="miras-footer__brand">
          <span className="miras-brand__mark" aria-hidden="true" />
          <strong>MIRAS</strong>
          <p>{t("footerText")}</p>
        </div>
        <nav aria-label={t("navigation")}>
          <Link to="/authors">{t("navAuthors")}</Link>
          <Link to="/works">{t("navWorks")}</Link>
          <Link to="/explore">{t("navExplore")}</Link>
          <Link to="/about">{t("navAbout")}</Link>
        </nav>
        <div className="miras-footer__subscribe">
          <span>{t("landingSubscribe")}</span>
          <div>
            <input aria-label="Email" placeholder="Ваш e-mail" />
            <button type="button" aria-label={t("landingSubscribe")}>
              →
            </button>
          </div>
        </div>
      </footer>
    </main>
  );
}

export default Landing;
