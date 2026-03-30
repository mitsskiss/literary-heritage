import { Link } from "react-router-dom";
import { works } from "../data/works";
import { authors } from "../data/authors";
import { useEffect, useRef, useState } from "react";
import MetaBalls from "../components/MetaBalls";

const INTRO_SESSION_KEY = "literary_intro_seen";

const movements = [
  {
    name: "Modernism",
    description:
      "Explores fragmented identity, inner consciousness, and new forms of literary expression.",
  },
  {
    name: "Existentialism",
    description:
      "Focuses on freedom, absurdity, isolation, and the search for meaning.",
  },
  {
    name: "Kazakh Enlightenment",
    description:
      "Highlights morality, education, cultural awareness, and intellectual development.",
  },
];

const introHighlights = [
  "Poetry and philosophy",
  "Voices across generations",
  "Stories that shape identity",
];

const introNarrative = [
  "Explore famous authors, literary works, and the ideas behind them.",
  "Every great work of literature is a conversation - not just between the author and their time, but between the text and you.",
  "Read, explore, and reflect on literary works.",
];

const introVisuals = [...works.slice(0, 3), ...authors.slice(0, 2)];

function Landing() {
  const sliderRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [introStage, setIntroStage] = useState(() => {
    if (typeof window === "undefined") return "done";
    return window.sessionStorage.getItem(INTRO_SESSION_KEY) ? "done" : "loading";
  });
  const [isMuted, setIsMuted] = useState(true);
  const [activeNarrativeIndex, setActiveNarrativeIndex] = useState(0);

  useEffect(() => {
    document.body.style.overflow = introStage === "done" ? "" : "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [introStage]);

  useEffect(() => {
    if (introStage !== "loading") return undefined;

    const timer = window.setTimeout(() => {
      setIntroStage("enter");
    }, 1800);

    return () => window.clearTimeout(timer);
  }, [introStage]);

  useEffect(() => {
    if (introStage !== "story") return undefined;

    const timer = window.setTimeout(() => {
      setIntroStage("done");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 6500);

    return () => window.clearTimeout(timer);
  }, [introStage]);

  useEffect(() => {
    if (introStage !== "story") return undefined;

    const interval = window.setInterval(() => {
      setActiveNarrativeIndex((current) => (current + 1) % introNarrative.length);
    }, 2600);

    return () => window.clearInterval(interval);
  }, [introStage]);

  useEffect(() => {
    if (introStage === "done") {
      window.sessionStorage.setItem(INTRO_SESSION_KEY, "true");
    }
  }, [introStage]);

  const handleEnter = () => {
    setActiveNarrativeIndex(0);
    setIntroStage("story");
  };

  const handleSkipIntro = () => {
    window.sessionStorage.setItem(INTRO_SESSION_KEY, "true");
    setIntroStage("done");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleMute = () => {
    setIsMuted((current) => !current);
  };

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -320, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 320, behavior: "smooth" });
    }
  };

  const handleScroll = () => {
    const el = sliderRef.current;
    if (!el) return;

    const maxScroll = el.scrollWidth - el.clientWidth;
    const progress = maxScroll > 0 ? (el.scrollLeft / maxScroll) * 100 : 0;
    setScrollProgress(progress);
  };

  return (
    <main style={styles.page}>
      {introStage !== "done" ? (
        <section className="landing-intro" aria-live="polite">
          <div className="landing-intro__texture" />

          {introStage === "loading" ? (
            <div className="landing-loader">
              <div className="landing-loader__ring" />
              <div className="landing-loader__ring landing-loader__ring--delayed" />
              <p className="landing-loader__label">Preparing the archive</p>
            </div>
          ) : null}

          {introStage === "enter" ? (
            <div className="landing-enter">
              <div className="landing-enter__meta-field">
                <MetaBalls
                  color="#17453f"
                  cursorBallColor="#2f7c70"
                  cursorBallSize={1.2}
                  ballCount={12}
                  animationSize={28}
                  enableMouseInteraction
                  enableTransparency
                  hoverSmoothness={0.15}
                  clumpFactor={0.64}
                  offsetY={4.6}
                  speed={0.3}
                />
              </div>
              <div className="landing-enter__content">
                <p className="landing-enter__eyebrow">Literary Heritage</p>
                <button
                  type="button"
                  className="landing-enter__button"
                  onClick={handleEnter}
                >
                  Enter
                </button>
              </div>
            </div>
          ) : null}

          {introStage === "story" ? (
            <div className="landing-story">
              <div className="landing-story__visual">
                {introVisuals.map((item, index) => (
                  <div
                    key={item.id ?? item.name}
                    className={`landing-story__panel landing-story__panel--${index + 1}`}
                    style={{ backgroundImage: `url(${item.image})` }}
                  />
                ))}
                <div className="landing-story__glow landing-story__glow--one" />
                <div className="landing-story__glow landing-story__glow--two" />
                <div className="landing-story__shade" />
              </div>

              <div className="landing-story__content">
                <div className="landing-story__narrative">
                  <p key={activeNarrativeIndex} className="landing-story__line is-visible is-current">
                    {introNarrative[activeNarrativeIndex]}
                  </p>
                </div>
              </div>

              <div className="landing-story__footer">
                <button
                  type="button"
                  className={`landing-story__sound ${isMuted ? "is-muted" : ""}`}
                  onClick={toggleMute}
                >
                  <span className="landing-story__sound-icon" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                  </span>
                  <span>{isMuted ? "Sound off" : "Sound on"}</span>
                </button>

                <div className="landing-story__chips">
                  {introHighlights.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>

                <button
                  type="button"
                  className="landing-story__skip"
                  onClick={handleSkipIntro}
                >
                  Skip intro
                </button>
              </div>
            </div>
          ) : null}
        </section>
      ) : null}

      <section style={styles.hero}>
        <div className="hero-quote-mark">“</div>
        <div style={styles.heroOverlay}>
          <p style={styles.kicker}>INTERACTIVE LITERARY JOURNEY</p>

          <h1 style={styles.title}>
            Explore famous authors, literary works, and the ideas behind them.
          </h1>

          <p style={styles.subtitle}>
            Read, explore, and reflect on literary works
          </p>

          <div style={styles.actions}>
            <Link to="/explore" style={styles.primaryBtn} className="hero-btn-primary">
  Begin your journey
</Link>

            <Link to="/authors" style={styles.secondaryBtn}>
              Explore authors
            </Link>
          </div>

          <p style={styles.smallNote}>
            just do it
          </p>
        </div>

        <div className="hero-light" />

        <div className="soft-divider">
  <div className="divider-line"></div>
</div>

      </section>

      <section style={styles.trendingSection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Trending Works</h2>

          <div style={styles.navButtons}>
            <button onClick={scrollLeft} style={styles.arrowBtn}>
              ‹
            </button>
            <button onClick={scrollRight} style={styles.arrowBtn}>
              ›
            </button>
          </div>
        </div>

        <div className="slider-wrapper-fade" style={styles.sliderWrapper}>
          <div
            ref={sliderRef}
            className="slider"
            style={styles.slider}
            onScroll={handleScroll}
          >
            {works.map((work, index) => (
              <Link
                key={work.id}
                to={`/reading/${work.id}`}
                style={styles.cardLink}
              >
                <div
                  className="trending-card"
                  style={{
                    ...styles.workCard,
                    marginLeft: index === 0 ? "28px" : "0",
                  }}
                >
                  <div style={styles.rank}>{index + 1}</div>

                  <div
                    className="cardImageArea"
                    style={{
                      ...styles.cardImageArea,
                      backgroundImage: work.image
                        ? `url(${work.image})`
                        : undefined,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    <div className="cardGradient" style={styles.cardGradient} />

                    <div style={styles.cardContent}>
                      <p style={styles.cardAuthor}>{work.author}</p>
                      <h3 style={styles.cardTitle}>{work.title}</h3>
                      <p style={styles.cardDesc}>{work.description}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div style={styles.progressTrack}>
            <div
              style={{
                ...styles.progressBar,
                width: `${Math.max(scrollProgress, 18)}%`,
              }}
            />
          </div>
        </div>
      </section>

      <section style={styles.dualSection}>
        <div style={styles.dualHeader}>
          <h2 style={styles.dualTitle}>Literary World</h2>
          <p style={styles.dualSubtitle}>
            Explore literary heritage through movements and authors.
          </p>
        </div>

        <div style={styles.dualGrid}>
          <div style={styles.dualCard}>
            <div style={styles.blockHeader}>
              <h3 style={styles.blockTitle}>Literary Movements</h3>
              <Link to="/explore" style={styles.blockLink}>
                Explore movements →
              </Link>
            </div>

            <div style={styles.movementList}>
  {movements.map((movement) => (
    <Link
      key={movement.name}
      to="/explore"
      className="movement-item"
      style={styles.movementItem}
    >
      <div style={styles.movementTextWrap}>
        <h4 className="movement-name" style={styles.movementName}>
          {movement.name}
        </h4>
        <p style={styles.movementDescription}>{movement.description}</p>
      </div>

      <span className="movement-arrow">→</span>
    </Link>
  ))}
</div>
          </div>

          <div style={styles.dualCard}>
            <div style={styles.blockHeader}>
              <h3 style={styles.blockTitle}>Featured Authors</h3>
              <Link to="/authors" style={styles.blockLink}>
                Explore authors →
              </Link>
            </div>

            <div style={styles.authorList}>
  {authors.map((author) => (
    <Link
      key={author.name}
      to={`/author/${encodeURIComponent(author.name)}`}
      className="author-item"
      style={styles.authorItem}
    >
      <img
        src={author.image}
        alt={author.name}
        style={styles.authorPortrait}
      />

      <div style={styles.authorInfo}>
        <h4 className="author-name" style={styles.authorName}>
          {author.name}
        </h4>
        <p className="author-meta" style={styles.authorMeta}>
          {author.period}
        </p>
      </div>

      <div className="author-pill">
        Explore
      </div>
    </Link>
  ))}
</div>
          </div>
        </div>
      </section>
      <footer style={styles.footer}>
  <div style={styles.footerTop}>
    <div style={styles.footerBrand}>
      <h3 style={styles.footerTitle}>Literary Heritage</h3>
      <p style={styles.footerText}>
        Interactive platform for exploring literature.
      </p>
    </div>

    <nav style={styles.footerNav}>
      <Link to="/" className="footer-link-hover" style={styles.footerLink}>
        Home
      </Link>
      <Link to="/authors" className="footer-link-hover" style={styles.footerLink}>
        Authors
      </Link>
      <Link to="/explore" className="footer-link-hover" style={styles.footerLink}>
        
      </Link>
      <Link to="/progress" className="footer-link-hover" style={styles.footerLink}>
        Progress
      </Link>
    </nav>
  </div>

  <div style={styles.footerBottom}>
    <p style={styles.footerCopyright}>
      © 2026 Literary Heritage. Developed by Samal Tleuberdikyzy
    </p>
  </div>
</footer>
    </main>
  );
}

const styles = {
  page: {
    background: "#f8f5ef",
    color: "#1f1f1f",
    minHeight: "100vh",
    position: "relative",
  },

  hero: {
    position: "relative",
    minHeight: "88vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px 120px",
    background:
      "linear-gradient(to bottom, #faf7f2 0%, #f8f5ef 70%, #f4efe6 100%)",
    overflow: "hidden",
  },

heroOverlay: {
  maxWidth: "980px",
  width: "100%",
  textAlign: "center",
  zIndex: 2,
  position: "relative"
},

  kicker: {
    margin: 0,
    fontSize: "14px",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    opacity: 0.65,
  },

title: {
  margin: "20px 0 18px",
  fontSize: "clamp(42px, 7vw, 78px)",
  lineHeight: 1.05,
  fontWeight: 700,
  letterSpacing: "-0.035em",

  background:
    "linear-gradient(90deg, #1f1f1f 0%, #3a3a3a 45%, #1f1f1f 100%)",

  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent"
},

  subtitle: {
    margin: "0 auto",
    maxWidth: "760px",
    fontSize: "20px",
    lineHeight: 1.7,
    opacity: 0.82,
  },

  actions: {
    display: "flex",
    justifyContent: "center",
    gap: "14px",
    flexWrap: "wrap",
    marginTop: "30px",
  },

  primaryBtn: {
    display: "inline-block",
    padding: "14px 20px",
    borderRadius: "14px",
    background: "#1f1f1f",
    color: "#fff",
    textDecoration: "none",
    fontWeight: 600,
    fontSize: "15px",
  },

  secondaryBtn: {
    display: "inline-block",
    padding: "14px 20px",
    borderRadius: "14px",
    border: "1px solid rgba(0,0,0,0.14)",
    color: "#1f1f1f",
    textDecoration: "none",
    fontWeight: 600,
    fontSize: "15px",
    background: "rgba(255,255,255,0.55)",
    backdropFilter: "blur(6px)",
  },

  smallNote: {
    marginTop: "20px",
    fontSize: "14px",
    opacity: 0.68,
  },


  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    marginBottom: "22px",
  },

  sectionTitle: {
    margin: 0,
    fontSize: "36px",
    fontWeight: 700,
  },

  navButtons: {
    display: "flex",
    gap: "10px",
  },

  arrowBtn: {
    width: "44px",
    height: "44px",
    borderRadius: "12px",
    border: "1px solid rgba(0,0,0,0.08)",
    background: "#fff",
    cursor: "pointer",
    fontSize: "24px",
    lineHeight: 1,
  },

  sliderWrapper: {
    position: "relative",
  },

  slider: {
    display: "flex",
    gap: "22px",
    overflowX: "auto",
    overflowY: "visible",
    scrollBehavior: "smooth",
    padding: "18px 64px 24px 34px",
  },

  cardLink: {
    textDecoration: "none",
    color: "inherit",
    flex: "0 0 auto",
  },

  workCard: {
    position: "relative",
    width: "300px",
    paddingLeft: "42px",
    overflow: "visible",
    isolation: "isolate",
  },

  rank: {
    position: "absolute",
    left: "0px",
    bottom: "8px",
    fontSize: "96px",
    fontWeight: 700,
    color: "rgba(255,255,255,0.18)",
    WebkitTextStroke: "2px rgba(31,31,31,0.34)",
    zIndex: 8,
    pointerEvents: "none",
    lineHeight: 1,
  },

  cardImageArea: {
    position: "relative",
    zIndex: 2,
    height: "380px",
    borderRadius: "18px",
    overflow: "hidden",
    background:
      "linear-gradient(135deg, #d9cdbd 0%, #b89f86 35%, #8e6e5b 100%)",
    boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
  },

  cardGradient: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(to top, rgba(18,18,18,0.82) 0%, rgba(18,18,18,0.28) 45%, rgba(18,18,18,0.08) 100%)",
  },

  cardContent: {
    position: "absolute",
    inset: 0,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    padding: "20px",
    zIndex: 2,
  },

  cardAuthor: {
    margin: "0 0 8px",
    fontSize: "13px",
    color: "rgba(255,255,255,0.8)",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },

  cardTitle: {
    margin: "0 0 10px",
    fontSize: "28px",
    lineHeight: 1.1,
    color: "#fff",
    fontWeight: 700,
  },

  cardDesc: {
    margin: 0,
    fontSize: "14px",
    lineHeight: 1.55,
    color: "rgba(255,255,255,0.86)",
  },

  progressTrack: {
    height: "4px",
    background: "rgba(0,0,0,0.08)",
    borderRadius: "999px",
    marginTop: "16px",
    overflow: "hidden",
  },

  progressBar: {
    height: "100%",
    background: "linear-gradient(90deg, #a85c77, #6b7fd9)",
    borderRadius: "999px",
    transition: "width 0.2s ease",
  },

  dualSection: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "20px 28px 70px",
  },

  dualHeader: {
    marginBottom: "24px",
  },

  dualTitle: {
    margin: 0,
    fontSize: "36px",
    fontWeight: 700,
  },

  dualSubtitle: {
    margin: "8px 0 0",
    fontSize: "17px",
    opacity: 0.75,
  },

  dualGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "22px",
  },

  dualCard: {
    background: "rgba(255,255,255,0.82)",
    border: "1px solid rgba(0,0,0,0.06)",
    borderRadius: "22px",
    padding: "26px",
    backdropFilter: "blur(8px)",
    boxShadow: "0 8px 24px rgba(0,0,0,0.03)",
  },

  blockHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "14px",
    marginBottom: "22px",
  },

  blockTitle: {
    margin: 0,
    fontSize: "24px",
    fontWeight: 700,
  },

  blockLink: {
    textDecoration: "none",
    color: "#1f1f1f",
    fontSize: "14px",
    fontWeight: 600,
    opacity: 0.72,
  },

  movementList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  movementItem: {
    display: "grid",
    gridTemplateColumns: "1fr auto",
    alignItems: "center",
    gap: "16px",
    padding: "18px 18px",
    borderRadius: "16px",
    background: "#fbfaf7",
    textDecoration: "none",
    color: "#1f1f1f",
    border: "1px solid rgba(0,0,0,0.04)",
    transition:
      "transform 0.25s ease, background 0.25s ease, border-color 0.25s ease",
  },

  movementTextWrap: {
    minWidth: 0,
  },

  movementName: {
    margin: 0,
    fontSize: "18px",
    fontWeight: 700,
    position: "relative",
  },

  movementDescription: {
    margin: "6px 0 0",
    fontSize: "14px",
    lineHeight: 1.6,
    opacity: 0.75,
  },

  authorList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  authorItem: {
    display: "grid",
    gridTemplateColumns: "56px 1fr auto",
    alignItems: "center",
    gap: "14px",
    padding: "14px 16px",
    borderRadius: "16px",
    background: "#fbfaf7",
    textDecoration: "none",
    color: "#1f1f1f",
    border: "1px solid rgba(0,0,0,0.04)",
    transition:
      "transform 0.25s ease, background 0.25s ease, border-color 0.25s ease",
  },

  authorPortrait: {
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    objectFit: "cover",
    flexShrink: 0,
    border: "1px solid rgba(0,0,0,0.06)",
  },

  authorInfo: {
    minWidth: 0,
  },

  authorName: {
    margin: 0,
    fontSize: "17px",
    fontWeight: 700,
  },

  authorMeta: {
    margin: "5px 0 0",
    fontSize: "14px",
    opacity: 0.68,
  },
  footer: {
  maxWidth: "1400px",
  margin: "0 auto",
  padding: "10px 28px 40px",
},

footerTop: {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "32px",
  paddingTop: "28px",
  borderTop: "1px solid rgba(0,0,0,0.08)",
  flexWrap: "wrap",
},

footerBrand: {
  maxWidth: "520px",
},

footerTitle: {
  margin: 0,
  fontSize: "22px",
  fontWeight: 700,
},

footerText: {
  margin: "10px 0 0",
  fontSize: "15px",
  lineHeight: 1.7,
  opacity: 0.76,
},

footerNav: {
  display: "flex",
  gap: "18px",
  flexWrap: "wrap",
  alignItems: "center",
},

footerLink: {
  textDecoration: "none",
  color: "#1f1f1f",
  fontSize: "15px",
  fontWeight: 500,
  opacity: 0.78,
},

footerBottom: {
  marginTop: "22px",
},

footerCopyright: {
  margin: 0,
  fontSize: "13px",
  opacity: 0.58,
},
trendingSection: {
  padding: "100px 28px 60px",
  maxWidth: "1400px",
  margin: "0 auto",
  position: "relative",
  zIndex: 4,
},
};

export default Landing;
