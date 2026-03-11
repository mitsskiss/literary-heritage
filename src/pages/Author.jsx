import { useParams, Link } from "react-router-dom";
import { works } from "../data/works";
import { authors } from "../data/authors";

function Author() {
  const { name } = useParams();

  const authorInfo = authors.find((a) => a.name === name);
  const authorWorks = works.filter((w) => w.author === name);

  if (!authorInfo || !authorWorks.length) {
    return (
      <main style={styles.page}>
        <div style={styles.container}>
          <div style={styles.notFoundBox}>
            <h2 style={styles.notFoundTitle}>Author not found</h2>
            <p style={styles.notFoundText}>
              We could not find this author in the current collection.
            </p>
            <Link to="/authors" style={styles.backBtn}>
              Back to authors
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const themes = [...new Set(authorWorks.flatMap((w) => w.themes))];

  const philosophyNotes = [
    ...new Set(
      authorWorks
        .flatMap((w) => w.fragments)
        .map((f) => f.authorNote)
        .filter(Boolean)
    ),
  ];

  const timelineItems = authorWorks
    .map((work) => {
      const notes = work.fragments
        .map((f) => f.authorNote)
        .filter(Boolean);

      return {
        id: work.id,
        title: work.title,
        year: work.year || "—",
        themes: work.themes || [],
        focus: notes[0] || work.description,
      };
    })
    .sort((a, b) => {
      if (a.year === "—") return 1;
      if (b.year === "—") return -1;
      return a.year - b.year;
    });

  return (
    <main className="author-page" style={styles.page}>
      <div style={styles.container}>
        <Link to="/authors" style={styles.topBackLink}>
          ← Back to authors
        </Link>

        <section style={styles.heroCard}>
          <div style={styles.heroLeft}>
            {authorInfo.image ? (
              <img
                src={authorInfo.image}
                alt={authorInfo.name}
                style={styles.authorPortrait}
              />
            ) : (
              <div style={styles.authorFallback}>
                {authorInfo.name
                  .split(" ")
                  .map((part) => part[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
            )}
          </div>

          <div style={styles.heroRight}>
            <p style={styles.kicker}>LITERARY PROFILE</p>
            <h1 style={styles.title}>{authorInfo.name}</h1>

            {authorInfo.period && (
              <p style={styles.period}>{authorInfo.period}</p>
            )}

            <p style={styles.description}>{authorInfo.description}</p>

            <div style={styles.metaRow}>
              <div style={styles.metaPill}>
                <span style={styles.metaLabel}>Works</span>
                <span style={styles.metaValue}>{authorWorks.length}</span>
              </div>

              <div style={styles.metaPill}>
                <span style={styles.metaLabel}>Themes</span>
                <span style={styles.metaValue}>{themes.length}</span>
              </div>
            </div>
          </div>
        </section>

        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Themes explored</h2>
          </div>

          <div style={styles.themeRow}>
            {themes.map((theme) => (
              <span key={theme} style={styles.themeTag}>
                {theme}
              </span>
            ))}
          </div>
        </section>

        {philosophyNotes.length > 0 && (
          <section style={styles.section}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>Philosophy focus</h2>
            </div>

            <div style={styles.philosophyCard}>
              {philosophyNotes.slice(0, 3).map((note, idx) => (
                <p
                  key={idx}
                  style={{
                    ...styles.philosophyText,
                    marginTop: idx === 0 ? 0 : 14,
                  }}
                >
                  {note}
                </p>
              ))}
            </div>
          </section>
        )}

        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Evolution of ideas</h2>
          </div>

          <div style={styles.timeline}>
            <div style={styles.timelineLine} />

            {timelineItems.map((item, idx) => (
              <div key={item.id} style={styles.timelineItem}>
                <div style={styles.timelineDot} />

                <div style={styles.timelineContent}>
                  <div style={styles.timelineYear}>{item.year}</div>

                  <Link to={`/reading/${item.id}`} style={styles.timelineTitle}>
                    {item.title}
                  </Link>

                  <p style={styles.timelineText}>{item.focus}</p>

                  <div style={styles.timelineThemes}>
                    {item.themes.map((theme, themeIdx) => (
                      <span key={themeIdx}>{theme}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Works</h2>
          </div>

          <div style={styles.worksGrid}>
            {authorWorks.map((work) => (
              <Link
                key={work.id}
                to={`/reading/${work.id}`}
                className="author-work-card"
                style={styles.workCard}
              >
                <div
                  style={{
                    ...styles.workImage,
                    backgroundImage: work.image ? `url(${work.image})` : undefined,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div style={styles.workImageOverlay} />
                </div>

                <div style={styles.workBody}>
                  <div style={styles.workYear}>{work.year || "Unknown year"}</div>
                  <h3 style={styles.workTitle}>{work.title}</h3>
                  <p style={styles.workDesc}>{work.description}</p>

                  <div style={styles.workThemes}>
                    {work.themes.map((theme) => (
                      <span key={theme} style={styles.workTag}>
                        {theme}
                      </span>
                    ))}
                  </div>

                  <span style={styles.workLink}>Open work →</span>
                </div>
              </Link>
            ))}
          </div>
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

  topBackLink: {
    display: "inline-block",
    marginBottom: "24px",
    textDecoration: "none",
    color: "#1f1f1f",
    opacity: 0.7,
    fontSize: "15px",
    fontWeight: 500,
  },

  heroCard: {
    display: "grid",
    gridTemplateColumns: "180px 1fr",
    gap: "28px",
    alignItems: "center",
    background: "rgba(255,255,255,0.66)",
    border: "1px solid rgba(0,0,0,0.06)",
    borderRadius: "28px",
    padding: "28px",
    backdropFilter: "blur(10px)",
    marginBottom: "36px",
  },

  heroLeft: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  authorPortrait: {
    width: "160px",
    height: "160px",
    borderRadius: "24px",
    objectFit: "cover",
    border: "1px solid rgba(0,0,0,0.06)",
  },

  authorFallback: {
    width: "160px",
    height: "160px",
    borderRadius: "24px",
    background: "linear-gradient(135deg, #1f1f1f, #4a4a4a)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "46px",
    fontWeight: 700,
  },

  heroRight: {
    minWidth: 0,
  },

  kicker: {
    margin: 0,
    fontSize: "13px",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    opacity: 0.58,
  },

  title: {
    margin: "10px 0 8px",
    fontSize: "clamp(40px, 6vw, 68px)",
    lineHeight: 1.02,
    fontWeight: 700,
    letterSpacing: "-0.035em",
  },

  period: {
    margin: 0,
    fontSize: "17px",
    opacity: 0.68,
  },

  description: {
    margin: "18px 0 0",
    maxWidth: "760px",
    fontSize: "18px",
    lineHeight: 1.75,
    opacity: 0.84,
  },

  metaRow: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    marginTop: "24px",
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

  section: {
    marginBottom: "38px",
  },

  sectionHeader: {
    marginBottom: "16px",
  },

  sectionTitle: {
    margin: 0,
    fontSize: "28px",
    fontWeight: 700,
  },

  themeRow: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },

  themeTag: {
    padding: "8px 16px",
    borderRadius: "999px",
    background: "#f3efe8",
    border: "1px solid rgba(0,0,0,0.05)",
    fontWeight: 600,
    fontSize: "14px",
  },

  philosophyCard: {
    background: "rgba(255,255,255,0.68)",
    border: "1px solid rgba(0,0,0,0.06)",
    borderRadius: "22px",
    padding: "22px 24px",
    borderLeft: "4px solid #6b7fd9",
  },

  philosophyText: {
    margin: 0,
    fontSize: "16px",
    lineHeight: 1.75,
    opacity: 0.86,
  },

  timeline: {
    position: "relative",
    paddingLeft: "32px",
  },

  timelineLine: {
    position: "absolute",
    left: "7px",
    top: "8px",
    bottom: "8px",
    width: "2px",
    background: "rgba(31,31,31,0.16)",
  },

  timelineItem: {
    position: "relative",
    marginBottom: "28px",
    paddingLeft: "28px",
  },

  timelineDot: {
    position: "absolute",
    left: "-1px",
    top: "8px",
    width: "16px",
    height: "16px",
    borderRadius: "50%",
    background: "#6b7fd9",
    boxShadow: "0 0 0 5px rgba(107,127,217,0.10)",
  },

  timelineContent: {
    background: "rgba(255,255,255,0.58)",
    border: "1px solid rgba(0,0,0,0.05)",
    borderRadius: "18px",
    padding: "18px 20px",
  },

  timelineYear: {
    fontSize: "13px",
    opacity: 0.52,
    marginBottom: "6px",
  },

  timelineTitle: {
    display: "inline-block",
    textDecoration: "none",
    color: "#1f1f1f",
    fontSize: "19px",
    fontWeight: 700,
    marginBottom: "8px",
  },

  timelineText: {
    margin: 0,
    fontSize: "15px",
    lineHeight: 1.7,
    opacity: 0.84,
  },

  timelineThemes: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    marginTop: "12px",
    fontSize: "13px",
    opacity: 0.56,
  },

  worksGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "24px",
    alignItems: "start",
  },

  workCard: {
    textDecoration: "none",
    color: "inherit",
    background: "rgba(255,255,255,0.64)",
    border: "1px solid rgba(0,0,0,0.06)",
    borderRadius: "22px",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    minHeight: "100%",
  },

  workImage: {
    height: "220px",
    background:
      "linear-gradient(135deg, #d9cdbd 0%, #b89f86 35%, #8e6e5b 100%)",
    position: "relative",
  },

  workImageOverlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(to top, rgba(18,18,18,0.45) 0%, rgba(18,18,18,0.08) 50%, rgba(18,18,18,0.02) 100%)",
  },

  workBody: {
    padding: "18px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  workYear: {
    fontSize: "13px",
    opacity: 0.5,
  },

  workTitle: {
    margin: 0,
    fontSize: "24px",
    lineHeight: 1.1,
    fontWeight: 700,
  },

  workDesc: {
    margin: 0,
    fontSize: "15px",
    lineHeight: 1.7,
    opacity: 0.82,
  },

  workThemes: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
    marginTop: "4px",
  },

  workTag: {
    padding: "6px 12px",
    borderRadius: "999px",
    background: "#f3efe8",
    border: "1px solid rgba(0,0,0,0.05)",
    fontSize: "13px",
    fontWeight: 600,
  },

  workLink: {
    marginTop: "6px",
    display: "inline-block",
    fontSize: "15px",
    fontWeight: 600,
    color: "#1f1f1f",
  },

  notFoundBox: {
    maxWidth: "640px",
    margin: "60px auto",
    padding: "32px",
    borderRadius: "24px",
    background: "rgba(255,255,255,0.7)",
    border: "1px solid rgba(0,0,0,0.06)",
    textAlign: "center",
  },

  notFoundTitle: {
    margin: 0,
    fontSize: "32px",
    fontWeight: 700,
  },

  notFoundText: {
    margin: "12px 0 0",
    fontSize: "16px",
    opacity: 0.72,
    lineHeight: 1.7,
  },

  backBtn: {
    display: "inline-block",
    marginTop: "20px",
    padding: "12px 18px",
    borderRadius: "12px",
    background: "#1f1f1f",
    color: "#fff",
    textDecoration: "none",
    fontWeight: 600,
  },
};

export default Author;