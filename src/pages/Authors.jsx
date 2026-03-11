import { Link } from "react-router-dom";
import { authors } from "../data/authors";
import { works } from "../data/works";

function Authors() {
  return (
    <main className="authors-page" style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <p style={styles.kicker}>LITERARY DIRECTORY</p>
          <h1 style={styles.title}>Authors</h1>
          <p style={styles.subtitle}>
            Explore writers whose ideas and works shape the literary journey of the platform.
          </p>
          <p style={styles.meta}>{authors.length} writers in the collection</p>
        </header>

        <section style={styles.grid}>
          {authors.map((author) => {
            const authorWorks = works.filter((work) => work.author === author.name);

            return (
              <Link
                key={author.name}
                to={`/author/${encodeURIComponent(author.name)}`}
                className="author-card"
                style={styles.card}
              >
                <img
                  src={author.image}
                  alt={author.name}
                  className="author-avatar"
                  style={styles.avatar}
                />

                <div style={styles.cardBody}>
                  <h2 style={styles.cardTitle}>{author.name}</h2>
                  <p style={styles.period}>{author.period}</p>

                  <p style={styles.description}>{author.description}</p>

                  <p style={styles.worksMeta}>
                    Works in project: {authorWorks.length}
                  </p>

                  <span className="author-link" style={styles.link}>
                    Open author <span>→</span>
                  </span>
                </div>
              </Link>
            );
          })}
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
    padding: "56px 20px 80px",
  },

  container: {
    maxWidth: "1200px",
    margin: "0 auto",
  },

  header: {
    marginBottom: "40px",
    maxWidth: "760px",
  },

  kicker: {
    margin: 0,
    fontSize: "13px",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    opacity: 0.6,
  },

  title: {
    margin: "10px 0 10px",
    fontSize: "52px",
    lineHeight: 1.05,
    fontWeight: 700,
  },

  subtitle: {
    margin: 0,
    fontSize: "18px",
    lineHeight: 1.7,
    opacity: 0.82,
  },

  meta: {
    marginTop: "14px",
    fontSize: "14px",
    opacity: 0.58,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "28px",
  },

  card: {
    textDecoration: "none",
    color: "inherit",
    background: "rgba(255,255,255,0.55)",
    border: "1px solid rgba(0,0,0,0.06)",
    borderRadius: "24px",
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    backdropFilter: "blur(8px)",
  },

  avatar: {
    width: "76px",
    height: "76px",
    borderRadius: "50%",
    objectFit: "cover",
    marginBottom: "18px",
    border: "1px solid rgba(0,0,0,0.06)",
  },

  cardBody: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
  },

  cardTitle: {
    margin: 0,
    fontSize: "30px",
    lineHeight: 1.1,
    fontWeight: 700,
  },

  period: {
    margin: "8px 0 0",
    fontSize: "15px",
    opacity: 0.68,
  },

  description: {
    margin: "18px 0 0",
    fontSize: "16px",
    lineHeight: 1.7,
    opacity: 0.84,
  },

  worksMeta: {
    margin: "22px 0 0",
    fontSize: "14px",
    opacity: 0.58,
  },

  link: {
    marginTop: "18px",
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "15px",
    fontWeight: 600,
  },
};

export default Authors;