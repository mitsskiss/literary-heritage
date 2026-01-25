import { works } from "../data/works";
import { Link, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";

const THEMES = {
  Identity: { color: "#e3f2fd", accent: "#1976d2" },
  Morality: { color: "#fce4ec", accent: "#c2185b" },
  Knowledge: { color: "#e8f5e9", accent: "#2e7d32" },
  Society: { color: "#fff8e1", accent: "#f9a825" },
};

function Explore() {
  const [activeTheme, setActiveTheme] = useState(null);

  const [searchParams] = useSearchParams();
  const themeFromUrl = searchParams.get("theme");

  useEffect(() => {
    if (themeFromUrl) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveTheme(themeFromUrl);
    }
  }, [themeFromUrl]);

  const filteredWorks =
    activeTheme === null
      ? works
      : works.filter((w) => w.themes?.includes(activeTheme));

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <h2 style={styles.title}>Choose a theme</h2>
          <p style={styles.subtitle}>
            Literary works may explore several ideas at once.
          </p>
        </header>

        {/* FILTER */}
        <div style={styles.filterBar}>
          <button
            onClick={() => setActiveTheme(null)}
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
              onClick={() => setActiveTheme(theme)}
              style={{
                ...styles.filterBtn,
                ...(activeTheme === theme ? styles.filterActive : {}),
              }}
            >
              {theme}
            </button>
          ))}
        </div>

        {/* CARDS */}
        {filteredWorks.map((work) => (
          <div key={work.id} style={styles.card}>
            <div style={styles.themeRow}>
              {work.themes.map((t) => (
                <Link
                  key={t}
                  to={`/explore?theme=${encodeURIComponent(t)}`}
                  style={styles.themeTag}
                >
                  {t}
                </Link>
              ))}
            </div>

            <h3>
              <Link
                to={`/reading/${work.id}`}
                style={{ textDecoration: "none", color: "#1f1f1f" }}
              >
                {work.title}
              </Link>
            </h3>

            <Link
              to={`/author/${encodeURIComponent(work.author)}`}
              style={{ fontSize: "14px", opacity: 0.7, textDecoration: "none" }}
            >
              {work.author}
            </Link>

            <p style={styles.description}>{work.description}</p>

            <Link
              to={`/reading/${work.id}`}
              style={{
                marginTop: "12px",
                fontWeight: 600,
                color: "#1f1f1f",
                textDecoration: "none",
              }}
            >
              Read →
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}

const styles = {
  page: { padding: "40px 16px" },
  container: { maxWidth: "1100px", margin: "0 auto" },

  header: { marginBottom: "32px", maxWidth: "720px" },
  title: { margin: 0, fontSize: "32px", fontWeight: 700 },
  subtitle: { marginTop: "10px", fontSize: "18px", opacity: 0.8 },

  filterBar: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    marginBottom: "36px",
  },
  filterBtn: {
    padding: "8px 14px",
    borderRadius: "20px",
    border: "1px solid rgba(0,0,0,0.2)",
    background: "#fff",
    cursor: "pointer",
    fontSize: "14px",
  },
  filterActive: {
    background: "#1f1f1f",
    color: "#fff",
    borderColor: "#1f1f1f",
  },

  card: {
    padding: "20px",
    borderRadius: "16px",
    border: "1px solid rgba(0,0,0,0.06)",
    marginBottom: "18px",
    background: "#fff",
  },
  themeRow: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
    marginBottom: "10px",
  },
  themeTag: {
    padding: "6px 16px",
    borderRadius: "999px",
    background: "#f4f4f4",
    fontWeight: 600,
    fontSize: "14px",
    textDecoration: "none",
    color: "#1f1f1f",
  },
  description: { marginTop: "10px", fontSize: "15px" },
};

export default Explore;
