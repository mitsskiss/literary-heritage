import { works } from "../data/works";
import { loadProgress } from "../utils/storage";
import { Link } from "react-router-dom";

function Progress() {
  const progress = loadProgress();

  const readWorks = works.filter((w) =>
    progress.readWorks.includes(w.id)
  );

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <h2 style={styles.title}>Your reading journey</h2>
          <p style={styles.subtitle}>
            This space reflects what you have explored so far.
          </p>
        </header>

        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>Explored works</h3>

          {readWorks.length === 0 && (
            <p style={styles.empty}>
              You haven’t started reading yet.
            </p>
          )}

          {readWorks.map((work) => (
            <article key={work.id} style={styles.card}>
              <h4 style={styles.cardTitle}>{work.title}</h4>
              <p style={styles.author}>{work.author}</p>

              <Link to={`/reading/${work.id}`} style={styles.link}>
                Continue reading →
              </Link>
            </article>
          ))}
        </section>

        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>Your reflections</h3>

          {Object.keys(progress.answers).length === 0 && (
            <p style={styles.empty}>
              Your reflections will appear here as you read.
            </p>
          )}

          {Object.entries(progress.answers).map(([fragmentId, answer]) => (
            <div key={fragmentId} style={styles.reflection}>
              <p style={styles.reflectionText}>
                <strong>Fragment:</strong> {fragmentId}
              </p>
              <p style={styles.answer}>
                <strong>Your response:</strong> {answer}
              </p>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}

const styles = {
  page: { padding: "40px 16px" },
  container: { maxWidth: "860px", margin: "0 auto" },

  header: { marginBottom: "34px" },
  title: { margin: 0, fontSize: "32px", fontWeight: 700 },
  subtitle: {
    marginTop: "10px",
    fontSize: "18px",
    lineHeight: 1.6,
    opacity: 0.8,
  },

  section: { marginBottom: "36px" },
  sectionTitle: {
    marginBottom: "14px",
    fontSize: "22px",
    fontWeight: 600,
  },

  empty: {
    opacity: 0.7,
    fontStyle: "italic",
  },

  card: {
    padding: "18px",
    marginBottom: "14px",
    borderRadius: "14px",
    border: "1px solid rgba(0,0,0,0.06)",
    background: "#fff",
  },
  cardTitle: { margin: 0, fontSize: "18px" },
  author: { marginTop: "6px", opacity: 0.65 },

  link: {
    display: "inline-block",
    marginTop: "10px",
    textDecoration: "none",
    fontWeight: 600,
    color: "#1f1f1f",
  },

  reflection: {
    padding: "14px",
    marginBottom: "12px",
    background: "#f7f7f7",
    borderRadius: "12px",
  },
  reflectionText: { margin: 0, fontSize: "14px", opacity: 0.7 },
  answer: { margin: "6px 0 0", fontSize: "15px" },
};

export default Progress;
