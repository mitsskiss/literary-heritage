import { works } from "../data/works";
import { Link, useSearchParams } from "react-router-dom";

const THEMES = {
  Identity: { color: "#e3f2fd", accent: "#1976d2" },
  Morality: { color: "#fce4ec", accent: "#c2185b" },
  Knowledge: { color: "#e8f5e9", accent: "#2e7d32" },
  Society: { color: "#fff8e1", accent: "#f9a825" },
};

function Explore() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTheme = searchParams.get("theme");

  const handleThemeChange = (theme) => {
    if (!theme) {
      setSearchParams({});
    } else {
      setSearchParams({ theme });
    }
  };

  const filteredWorks =
    activeTheme === null
      ? works
      : works.filter((w) => w.themes?.includes(activeTheme));

  return (
    <main className="explore-page" style={styles.page}>
      <div style={styles.container}>
        <section style={styles.heroCard}>
          <div style={styles.heroLeft}>
            <p style={styles.kicker}>CURATED READING</p>
            <h1 style={styles.title}>Explore by theme</h1>
            <p style={styles.subtitle}>
              Literary works often speak through several ideas at once. Choose a
              theme and discover texts through identity, morality, knowledge,
              and society.
            </p>

            <div style={styles.metaRow}>
              <div style={styles.metaPill}>
                <span style={styles.metaLabel}>Works</span>
                <span style={styles.metaValue}>{filteredWorks.length}</span>
              </div>

              <div style={styles.metaPill}>
                <span style={styles.metaLabel}>Themes</span>
                <span style={styles.metaValue}>{Object.keys(THEMES).length}</span>
              </div>
            </div>
          </div>

          <div style={styles.heroRight}>
            <div style={styles.filterPanel}>
              <p style={styles.filterPanelTitle}>Browse themes</p>

              <div style={styles.filterBar}>
                <button
                  onClick={() => handleThemeChange(null)}
                  className="explore-filter-btn"
                  style={{
                    ...styles.filterBtn,
                    ...(activeTheme === null ? styles.filterActive : {}),
                  }}
                >
                  All themes
                </button>

                {Object.keys(THEMES).map((theme) => (
                  <button
                    key={theme}
                    onClick={() => handleThemeChange(theme)}
                    className="explore-filter-btn"
                    style={{
                      ...styles.filterBtn,
                      ...(activeTheme === theme ? styles.filterActive : {}),
                    }}
                  >
                    {theme}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>
              {activeTheme ? `${activeTheme} works` : "All works"}
            </h2>

            <span style={styles.sectionMeta}>
              {filteredWorks.length} result{filteredWorks.length === 1 ? "" : "s"}
            </span>
          </div>

          {filteredWorks.length === 0 ? (
            <div style={styles.emptyCard}>
              <h3 style={styles.emptyTitle}>No works found</h3>
              <p style={styles.emptyText}>
                There are no works for this theme in the current collection.
              </p>
              <button
                onClick={() => handleThemeChange(null)}
                style={styles.emptyBtn}
              >
                Show all themes
              </button>
            </div>
          ) : (
            <div style={styles.grid}>
              {filteredWorks.map((work) => (
                <article
                  key={work.id}
                  className="explore-work-card"
                  style={styles.card}
                >
                  <Link to={`/reading/${work.id}`} style={styles.imageLink}>
                    <div
                      style={{
                        ...styles.cardImage,
                        backgroundImage: work.image ? `url(${work.image})` : undefined,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      <div style={styles.cardImageOverlay} />
                    </div>
                  </Link>

                  <div style={styles.cardBody}>
                    <div style={styles.themeRow}>
                      {work.themes.map((t) => (
                        <Link
                          key={t}
                          to={`/explore?theme=${encodeURIComponent(t)}`}
                          style={{
                            ...styles.themeTag,
                            background: THEMES[t]?.color || "#f4f4f4",
                            color: THEMES[t]?.accent || "#1f1f1f",
                          }}
                        >
                          {t}
                        </Link>
                      ))}
                    </div>

                    <Link to={`/reading/${work.id}`} style={styles.cardTitleLink}>
                      <h3 style={styles.cardTitle}>{work.title}</h3>
                    </Link>

                    <Link
                      to={`/author/${encodeURIComponent(work.author)}`}
                      style={styles.authorLink}
                    >
                      {work.author}
                    </Link>

                    <p style={styles.description}>{work.description}</p>

                    <div style={styles.cardBottom}>
                      {work.year && (
                        <span style={styles.yearPill}>{work.year}</span>
                      )}

                      <Link to={`/reading/${work.id}`} style={styles.readLink}>
                        Read →
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

const styles = {
  page: {
    position: "relative",
    minHeight: "100vh",
    background: "#f8f5ef",
    color: "#1f1f1f",
    padding: "48px 20px 80px",
  },

  container: {
    maxWidth: "1180px",
    margin: "0 auto",
  },

  heroCard: {
    display: "grid",
    gridTemplateColumns: "1.2fr 0.8fr",
    gap: "28px",
    background: "rgba(255,255,255,0.68)",
    border: "1px solid rgba(0,0,0,0.06)",
    borderRadius: "28px",
    padding: "28px",
    backdropFilter: "blur(10px)",
    marginBottom: "34px",
  },

  heroLeft: {
    minWidth: 0,
  },

  heroRight: {
    display: "flex",
    alignItems: "stretch",
  },

  kicker: {
    margin: 0,
    fontSize: "13px",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    opacity: 0.58,
  },

  title: {
    margin: "10px 0 10px",
    fontSize: "clamp(36px, 5vw, 58px)",
    lineHeight: 1.02,
    fontWeight: 700,
    letterSpacing: "-0.03em",
  },

  subtitle: {
    margin: 0,
    fontSize: "17px",
    lineHeight: 1.75,
    opacity: 0.84,
    maxWidth: "680px",
  },

  metaRow: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    marginTop: "22px",
  },

  metaPill: {
    display: "inline-flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px 14px",
    borderRadius: "999px",
    background: "#f3efe8",
    border: "1px solid rgba(0,0,0,0.05)",
  },

  metaLabel: {
    fontSize: "13px",
    opacity: 0.6,
  },

  metaValue: {
    fontSize: "14px",
    fontWeight: 700,
  },

  filterPanel: {
    width: "100%",
    background: "#fcfbf8",
    border: "1px solid rgba(0,0,0,0.05)",
    borderRadius: "22px",
    padding: "20px",
  },

  filterPanelTitle: {
    margin: "0 0 14px",
    fontSize: "16px",
    fontWeight: 700,
  },

  filterBar: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },

  filterBtn: {
    padding: "10px 16px",
    borderRadius: "999px",
    border: "1px solid rgba(0,0,0,0.12)",
    background: "#fff",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 600,
    color: "#1f1f1f",
  },

  filterActive: {
    background: "#1f1f1f",
    color: "#fff",
    borderColor: "#1f1f1f",
  },

  section: {
    marginBottom: "38px",
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    marginBottom: "16px",
  },

  sectionTitle: {
    margin: 0,
    fontSize: "28px",
    fontWeight: 700,
  },

  sectionMeta: {
    fontSize: "14px",
    opacity: 0.58,
  },

  emptyCard: {
    background: "rgba(255,255,255,0.64)",
    border: "1px solid rgba(0,0,0,0.06)",
    borderRadius: "24px",
    padding: "28px",
  },

  emptyTitle: {
    margin: 0,
    fontSize: "24px",
    fontWeight: 700,
  },

  emptyText: {
    margin: "10px 0 0",
    fontSize: "16px",
    lineHeight: 1.75,
    opacity: 0.76,
  },

  emptyBtn: {
    marginTop: "18px",
    padding: "12px 18px",
    borderRadius: "12px",
    background: "#1f1f1f",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "24px",
    alignItems: "start",
  },

  card: {
    background: "rgba(255,255,255,0.64)",
    border: "1px solid rgba(0,0,0,0.06)",
    borderRadius: "22px",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    minHeight: "100%",
  },

  imageLink: {
    display: "block",
    textDecoration: "none",
  },

  cardImage: {
    height: "220px",
    background:
      "linear-gradient(135deg, #d9cdbd 0%, #b89f86 35%, #8e6e5b 100%)",
    position: "relative",
  },

  cardImageOverlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(to top, rgba(18,18,18,0.45) 0%, rgba(18,18,18,0.08) 50%, rgba(18,18,18,0.02) 100%)",
  },

  cardBody: {
    padding: "18px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  themeRow: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },

  themeTag: {
    padding: "6px 12px",
    borderRadius: "999px",
    fontWeight: 600,
    fontSize: "13px",
    textDecoration: "none",
  },

  cardTitleLink: {
    textDecoration: "none",
    color: "#1f1f1f",
  },

  cardTitle: {
    margin: 0,
    fontSize: "24px",
    lineHeight: 1.1,
    fontWeight: 700,
  },

  authorLink: {
    textDecoration: "none",
    color: "#1f1f1f",
    opacity: 0.68,
    fontSize: "15px",
  },

  description: {
    margin: 0,
    fontSize: "15px",
    lineHeight: 1.7,
    opacity: 0.82,
  },

  cardBottom: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    marginTop: "6px",
    flexWrap: "wrap",
  },

  yearPill: {
    padding: "6px 10px",
    borderRadius: "999px",
    background: "#f3efe8",
    border: "1px solid rgba(0,0,0,0.05)",
    fontSize: "12px",
    fontWeight: 700,
    opacity: 0.72,
  },

  readLink: {
    textDecoration: "none",
    fontSize: "15px",
    fontWeight: 600,
    color: "#1f1f1f",
  },
};

export default Explore;