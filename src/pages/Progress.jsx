import { works } from "../data/works";
import { loadProgress } from "../utils/storage";
import { Link } from "react-router-dom";

function Progress() {
  const progress = loadProgress();

  const readWorks = works.filter((w) => progress.readWorks.includes(w.id));
  const reflections = Object.entries(progress.answers);

  const totalWorks = works.length;
  const completedWorks = readWorks.length;
  const completionRate =
    totalWorks > 0 ? Math.round((completedWorks / totalWorks) * 100) : 0;

  return (
    <main className="progress-page" style={styles.page}>
      <div style={styles.container}>
        <section style={styles.heroCard}>
          <div style={styles.heroLeft}>
            <p style={styles.kicker}>READING DASHBOARD</p>
            <h1 style={styles.title}>Your reading journey</h1>
            <p style={styles.subtitle}>
              This space reflects what you have explored so far through reading,
              reflection, and interaction with literary fragments.
            </p>

            <div style={styles.progressWrap}>
              <div style={styles.progressTopRow}>
                <span style={styles.progressLabel}>Collection progress</span>
                <span style={styles.progressPercent}>{completionRate}%</span>
              </div>

              <div style={styles.progressTrack}>
                <div
                  style={{
                    ...styles.progressBar,
                    width: `${completionRate}%`,
                  }}
                />
              </div>
            </div>
          </div>

          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={styles.statValue}>{completedWorks}</div>
              <div style={styles.statLabel}>Explored works</div>
            </div>

            <div style={styles.statCard}>
              <div style={styles.statValue}>{reflections.length}</div>
              <div style={styles.statLabel}>Reflections saved</div>
            </div>

            <div style={styles.statCard}>
              <div style={styles.statValue}>{totalWorks}</div>
              <div style={styles.statLabel}>Works in collection</div>
            </div>
          </div>
        </section>

        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Explored works</h2>
            {readWorks.length > 0 && (
              <span style={styles.sectionMeta}>
                {readWorks.length} completed
              </span>
            )}
          </div>

          {readWorks.length === 0 ? (
            <div style={styles.emptyCard}>
              <h3 style={styles.emptyTitle}>You haven’t started reading yet</h3>
              <p style={styles.emptyText}>
                Begin with one work and your progress will start appearing here.
              </p>
              <Link to="/explore" style={styles.emptyBtn}>
                Explore works
              </Link>
            </div>
          ) : (
            <div style={styles.worksGrid}>
              {readWorks.map((work) => (
                <Link
                  key={work.id}
                  to={`/reading/${work.id}`}
                  className="progress-work-card"
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
                    <div style={styles.workTopRow}>
                      <span style={styles.workStatus}>Read</span>
                      {work.year && <span style={styles.workYear}>{work.year}</span>}
                    </div>

                    <h3 style={styles.workTitle}>{work.title}</h3>
                    <p style={styles.workAuthor}>{work.author}</p>

                    {work.themes?.length > 0 && (
                      <div style={styles.workThemes}>
                        {work.themes.map((theme) => (
                          <span key={theme} style={styles.workTag}>
                            {theme}
                          </span>
                        ))}
                      </div>
                    )}

                    <span style={styles.workLink}>Continue reading →</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Your reflections</h2>
            {reflections.length > 0 && (
              <span style={styles.sectionMeta}>
                {reflections.length} responses
              </span>
            )}
          </div>

          {reflections.length === 0 ? (
            <div style={styles.emptyCard}>
              <h3 style={styles.emptyTitle}>No reflections yet</h3>
              <p style={styles.emptyText}>
                Your responses to reflective questions will appear here as you read.
              </p>
            </div>
          ) : (
            <div style={styles.reflectionsList}>
              {reflections.map(([fragmentId, answer]) => (
                <div key={fragmentId} style={styles.reflectionCard}>
                  <div style={styles.reflectionTop}>
                    <span style={styles.reflectionLabel}>Fragment</span>
                    <span style={styles.reflectionFragment}>{fragmentId}</span>
                  </div>

                  <div style={styles.reflectionAnswerBlock}>
                    <span style={styles.reflectionAnswerLabel}>Your response</span>
                    <p style={styles.reflectionAnswer}>{answer}</p>
                  </div>
                </div>
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
    gridTemplateColumns: "1.4fr 1fr",
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

  progressWrap: {
    marginTop: "24px",
  },

  progressTopRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
    gap: "12px",
  },

  progressLabel: {
    fontSize: "14px",
    opacity: 0.64,
  },

  progressPercent: {
    fontSize: "14px",
    fontWeight: 700,
  },

  progressTrack: {
    height: "10px",
    background: "rgba(0,0,0,0.08)",
    borderRadius: "999px",
    overflow: "hidden",
  },

  progressBar: {
    height: "100%",
    borderRadius: "999px",
    background: "linear-gradient(90deg, #6b7fd9, #8b63d9)",
    transition: "width 0.35s ease",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "14px",
    alignContent: "start",
  },

  statCard: {
    background: "#fcfbf8",
    border: "1px solid rgba(0,0,0,0.05)",
    borderRadius: "20px",
    padding: "20px",
  },

  statValue: {
    fontSize: "34px",
    fontWeight: 700,
    lineHeight: 1,
  },

  statLabel: {
    marginTop: "8px",
    fontSize: "14px",
    opacity: 0.66,
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
    maxWidth: "680px",
  },

  emptyBtn: {
    display: "inline-block",
    marginTop: "18px",
    padding: "12px 18px",
    borderRadius: "12px",
    background: "#1f1f1f",
    color: "#fff",
    textDecoration: "none",
    fontWeight: 600,
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

  workTopRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "10px",
  },

  workStatus: {
    display: "inline-block",
    padding: "6px 10px",
    borderRadius: "999px",
    background: "rgba(107,127,217,0.12)",
    color: "#4d63c7",
    fontSize: "12px",
    fontWeight: 700,
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

  workAuthor: {
    margin: 0,
    fontSize: "15px",
    opacity: 0.68,
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

  reflectionsList: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },

  reflectionCard: {
    background: "rgba(255,255,255,0.64)",
    border: "1px solid rgba(0,0,0,0.06)",
    borderRadius: "20px",
    padding: "18px 20px",
  },

  reflectionTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    marginBottom: "12px",
    flexWrap: "wrap",
  },

  reflectionLabel: {
    fontSize: "13px",
    opacity: 0.52,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },

  reflectionFragment: {
    fontSize: "14px",
    fontWeight: 600,
    opacity: 0.78,
  },

  reflectionAnswerBlock: {
    background: "#fcfbf8",
    border: "1px solid rgba(0,0,0,0.04)",
    borderRadius: "16px",
    padding: "14px 16px",
  },

  reflectionAnswerLabel: {
    display: "block",
    fontSize: "13px",
    opacity: 0.54,
    marginBottom: "8px",
  },

  reflectionAnswer: {
    margin: 0,
    fontSize: "16px",
    lineHeight: 1.7,
    fontWeight: 500,
  },
};

export default Progress;