import { Link } from "react-router-dom";
import { useState } from "react";
import { useI18n } from "../i18n/useI18n";
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
import "./Landing.css";

function Landing() {
  const { t } = useI18n();
  const [subscriberEmail, setSubscriberEmail] = useState("");
  const [subscribeMessage, setSubscribeMessage] = useState("");

  const portalCards = [
    {
      title: t("navWorks"),
      text: t("landingWorksText"),
      href: "/works",
      image: portalWorks,
      icon: "book",
    },
    {
      title: t("navAuthors"),
      text: t("landingAuthorsText"),
      href: "/authors",
      image: portalAuthors,
      icon: "pen",
    },
    {
      title: t("landingEpochs"),
      text: t("landingEpochsText"),
      href: "/epochs",
      image: portalEpochs,
      icon: "horse",
    },
    {
      title: t("favorite_quote"),
      text: t("landingQuotesText"),
      href: "/explore",
      image: portalQuotes,
      icon: "star",
    },
  ];

  const stats = [
    { value: "3,000+", label: t("navWorks"), icon: "book" },
    { value: "600+", label: t("navAuthors"), icon: "pen" },
    { value: "1,500+", label: `${t("landingEpochs")} & ${t("navWorks")}`, icon: "horse" },
    { value: "120+", label: t("landingRoutes"), icon: "star" },
  ];

  const collections = [
    { title: t("landingPoetry"), image: collectionPoetry, href: "/works" },
    { title: t("landingProse"), image: collectionProse, href: "/works" },
    { title: t("landingFolklore"), image: collectionFolklore, href: "/explore" },
    { title: t("landingThoughts"), image: collectionThoughts, href: "/explore" },
    { title: t("landingRoutesTitle"), image: collectionRoutes, href: "/map" },
  ];

  const platformFeatures = [
    { title: t("compareLanguages"), text: t("landingMultilingualText"), icon: "language" },
    { title: t("landingCompareTexts"), text: t("landingCompareText"), icon: "book" },
    { title: t("interactiveReading"), text: t("landingInteractiveText"), icon: "route" },
    { title: t("dashboard"), text: t("landingProgressText"), icon: "star" },
  ];

  const socialLinks = [
    { label: "Instagram", icon: "instagram" },
    { label: "Facebook", icon: "facebook" },
    { label: "YouTube", icon: "youtube" },
    { label: "VK", icon: "vk" },
  ];

  const handleSubscribe = () => {
    const email = subscriberEmail.trim();
    if (!email) return;

    if (typeof window !== "undefined") {
      window.localStorage.setItem("mura_newsletter_email", email);
    }
    setSubscribeMessage(t("landingSubscribeSaved"));
  };

  return (
    <main className="miras-home">
      <section className="miras-hero" style={{ "--mura-home-hero": `url(${homeHero})` }}>
        <div className="miras-ornament miras-ornament--left" aria-hidden="true" />
        <div className="miras-ornament miras-ornament--center" aria-hidden="true" />
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

        <div className="miras-hero__dots" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </div>
      </section>

      <section className="miras-cards" aria-label={t("siteFeatures")}>
        {portalCards.map((card) => (
          <Link className="miras-card" key={card.title} to={card.href}>
            <div className="miras-card__label">
              <MirasDecorIcon type={card.icon} />
              <span>{card.title}</span>
              <small>{t("explore")}</small>
            </div>
            <div className="miras-card__image" style={{ backgroundImage: `url(${card.image})` }} />
            <div className="miras-card__bottom">
              <MirasDecorIcon type={card.icon} />
              <div>
                <strong>{card.title}</strong>
                <p>{card.text}</p>
              </div>
              <span className="miras-card__arrow" aria-hidden="true">{"\u2192"}</span>
            </div>
          </Link>
        ))}
      </section>

      <section className="miras-stats" aria-label={t("catalogStats")}>
        {stats.map((item) => (
          <article key={item.label}>
            <MirasDecorIcon type={item.icon} className="miras-stat-icon" />
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
              <span>
                <strong>{item.title}</strong>
                <small>{t("explore")}</small>
              </span>
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
              <MirasDecorIcon type={feature.icon} className="miras-feature-icon" />
              <strong>{feature.title}</strong>
              <p>{feature.text}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="miras-footer">
        <div className="miras-footer__brand">
          <MirasDecorIcon type="ornament" className="miras-brand__mark" />
          <strong>MURA</strong>
          <p>{t("footerText")}</p>
        </div>
        <nav aria-label={t("navigation")}>
          <strong>{t("navigation")}</strong>
          <Link to="/works">{t("navWorks")}</Link>
          <Link to="/authors">{t("navAuthors")}</Link>
          <Link to="/epochs">{t("landingEpochs")}</Link>
          <Link to="/explore">{t("navExplore")}</Link>
        </nav>
        <nav aria-label={t("aboutKicker")}>
          <strong>{t("aboutKicker")}</strong>
          <Link to="/about">{t("navAbout")}</Link>
          <Link to="/map">{t("navMap")}</Link>
          <Link to="/progress">{t("navProgress")}</Link>
        </nav>
        <div className="miras-footer__subscribe">
          <span>{t("landingSubscribe")}</span>
          <div>
            <input
              aria-label="Email"
              placeholder={t("landingEmailPlaceholder")}
              type="email"
              value={subscriberEmail}
              onChange={(event) => {
                setSubscriberEmail(event.target.value);
                setSubscribeMessage("");
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleSubscribe();
                }
              }}
            />
            <button type="button" aria-label={t("landingSubscribe")} onClick={handleSubscribe}>
              {"\u2192"}
            </button>
          </div>
          {subscribeMessage ? <small role="status">{subscribeMessage}</small> : null}
        </div>
        <div className="miras-footer__social" aria-label={t("landingFollowUs")}>
          <strong>{t("landingFollowUs")}</strong>
          <div>
            {socialLinks.map((item) => (
              <span key={item.label} aria-label={item.label} role="img">
                <MirasSocialIcon type={item.icon} />
              </span>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}

function MirasDecorIcon({ type = "ornament", className = "miras-decor-icon" }) {
  const paths = {
    book: (
      <>
        <path d="M4 5.6c2.4-.8 4.8-.5 7 .9v11c-2.2-1.4-4.6-1.7-7-.9V5.6Z" />
        <path d="M20 5.6c-2.4-.8-4.8-.5-7 .9v11c2.2-1.4 4.6-1.7 7-.9V5.6Z" />
        <path d="M12 6.4v12.2" />
      </>
    ),
    pen: (
      <>
        <path d="M15.8 3.8 20.2 8 9.4 18.8 4 20l1.2-5.4L15.8 3.8Z" />
        <path d="m14.2 5.4 4.4 4.4" />
        <path d="M5.2 14.6 9.4 18.8" />
      </>
    ),
    horse: (
      <>
        <path d="M5 17.5c1.5-4.5 4.3-6.9 8.6-7.2l1-3.3 4.4 3.5-2.2 2.1 1.1 5" />
        <path d="M8.4 17.5v-4.1" />
        <path d="M13.2 17.5v-4.7" />
        <path d="M14.5 8.2c-2.1-2.5-4.6-3.2-7.7-2.1" />
      </>
    ),
    language: (
      <>
        <path d="M4 6h9" />
        <path d="M8.5 4v2" />
        <path d="M6 18l5-12" />
        <path d="M5.2 11.4c1.8 2.1 4.1 3.3 6.8 3.6" />
        <path d="M14 18h6" />
        <path d="m15 18 3-7 3 7" />
      </>
    ),
    route: (
      <>
        <path d="M5 17.5c3.5-7.8 9.5-3.2 14-11" />
        <path d="M6.5 7.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z" />
        <path d="M17.5 21.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z" />
      </>
    ),
    star: (
      <>
        <path d="m12 3 2.1 6 6.3.1-5 3.8 1.8 6.1-5.2-3.5L6.8 19l1.8-6.1-5-3.8 6.3-.1L12 3Z" />
      </>
    ),
    ornament: (
      <>
        <path d="M12 3c2.2 2.9 2.2 5 0 6.4C9.8 8 9.8 5.9 12 3Z" />
        <path d="M12 21c-2.2-2.9-2.2-5 0-6.4 2.2 1.4 2.2 3.5 0 6.4Z" />
        <path d="M3 12c2.9-2.2 5-2.2 6.4 0-1.4 2.2-3.5 2.2-6.4 0Z" />
        <path d="M21 12c-2.9 2.2-5 2.2-6.4 0 1.4-2.2 3.5-2.2 6.4 0Z" />
        <circle cx="12" cy="12" r="2.2" />
      </>
    ),
  };

  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      {paths[type] ?? paths.ornament}
    </svg>
  );
}

function MirasSocialIcon({ type }) {
  const paths = {
    instagram: (
      <>
        <rect x="5" y="5" width="14" height="14" rx="4" />
        <circle cx="12" cy="12" r="3.2" />
        <path d="M16.5 7.7h.1" />
      </>
    ),
    facebook: <path d="M13.4 20v-7h2.2l.4-3h-2.6V8.1c0-.9.3-1.5 1.6-1.5h1.1V4a15 15 0 0 0-2.1-.1c-2.3 0-3.9 1.4-3.9 4v2.1H8v3h2.1v7h3.3Z" />,
    youtube: (
      <>
        <path d="M4.6 8.2c.2-1.2 1.1-2.1 2.3-2.2 3.4-.3 6.8-.3 10.2 0 1.2.1 2.1 1 2.3 2.2.3 2.5.3 5.1 0 7.6-.2 1.2-1.1 2.1-2.3 2.2-3.4.3-6.8.3-10.2 0-1.2-.1-2.1-1-2.3-2.2-.3-2.5-.3-5.1 0-7.6Z" />
        <path d="m10.5 9.2 4.4 2.8-4.4 2.8V9.2Z" />
      </>
    ),
    vk: <path d="M4 7h3l2.4 5.1c.4.8.8 1.2 1.1 1.2.2 0 .4-.3.4-1V7h2.7v3.1c0 .8.2 1.1.5 1.1.4 0 1.1-.9 2.1-4.2H19c-.9 2.8-1.8 4.6-2.7 5.5 1.2.8 2.4 2.3 3.7 4.5h-3.1c-.9-1.5-1.7-2.3-2.3-2.3-.5 0-.8.4-.9 1.1V17h-1.4C8.3 17 5.6 13.7 4 7Z" />,
  };

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {paths[type]}
    </svg>
  );
}

export default Landing;
