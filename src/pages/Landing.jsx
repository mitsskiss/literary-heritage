import { Link } from "react-router-dom";
import { useI18n } from "../i18n/useI18n";
import { authors } from "../data/authors";
import { readingRoutes } from "../data/routes";
import { works } from "../data/works";
import homeHero from "../assets/mura/home-hero-v2.jpg";
import collectionPoetry from "../assets/mura/collection-poetry.jpg";
import collectionProse from "../assets/mura/collection-prose.jpg";
import collectionFolklore from "../assets/mura/collection-folklore.jpg";
import collectionThoughts from "../assets/mura/collection-thoughts.jpg";
import collectionRoutes from "../assets/mura/collection-routes.jpg";
import portalAuthors from "../assets/mura/portal-authors.jpg";
import portalWorks from "../assets/mura/portal-works.jpg";
import portalEpochs from "../assets/mura/portal-epochs.jpg";
import portalQuotes from "../assets/mura/portal-quotes.jpg";

function Landing() {
  const { t } = useI18n();

  const portalCards = [
    {
      title: t("navAuthors"),
      text: t("landingAuthorsText"),
      href: "/authors",
      image: portalAuthors,
    },
    {
      title: t("navWorks"),
      text: t("landingWorksText"),
      href: "/works",
      image: portalWorks,
    },
    {
      title: t("landingEpochs"),
      text: t("landingEpochsText"),
      href: "/epochs",
      image: portalEpochs,
    },
    {
      title: t("favorite_quote"),
      text: t("landingQuotesText"),
      href: "/explore",
      image: portalQuotes,
    },
  ];

  const stats = [
    { value: authors.length, label: t("navAuthors") },
    { value: works.length, label: t("navWorks") },
    { value: "KZ/RU/EN", label: t("landingCulturalAccess") },
    { value: readingRoutes.length, label: t("landingRoutes") },
  ];

  const collections = [
    { title: t("landingPoetry"), image: collectionPoetry, href: "/works" },
    { title: t("landingProse"), image: collectionProse, href: "/works" },
    { title: t("landingFolklore"), image: collectionFolklore, href: "/explore" },
    { title: t("landingThoughts"), image: collectionThoughts, href: "/explore" },
    { title: t("landingRoutesTitle"), image: collectionRoutes, href: "/map" },
  ];

  const platformFeatures = [
    { title: t("compareLanguages"), text: t("landingMultilingualText") },
    { title: t("landingCompareTexts"), text: t("landingCompareText") },
    { title: t("interactiveReading"), text: t("landingInteractiveText") },
    { title: t("dashboard"), text: t("landingProgressText") },
  ];

  return (
    <main className="miras-home">
      <section className="miras-hero" style={{ "--mura-home-hero": `url(${homeHero})` }}>
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
          <strong>MURA</strong>
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
            <input aria-label="Email" placeholder="Email" />
            <button type="button" aria-label={t("landingSubscribe")}>
              {"\u2192"}
            </button>
          </div>
        </div>
      </footer>
    </main>
  );
}

export default Landing;
