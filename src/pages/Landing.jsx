import { Link } from "react-router-dom";

function Landing() {
  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <p style={styles.kicker}>Interactive Literary Journey</p>
          <h1 style={styles.title}>
            Literature is not something you memorize. <br />
            It is something you experience.
          </h1>
          <p style={styles.subtitle}>
            Explore literary heritage through meaning, reflection, and small interactive
            moments that turn reading into dialogue.
          </p>
        </header>

        <section style={styles.actions}>
          <Link to="/explore" style={styles.primaryBtn}>
            Begin your journey
          </Link>
          <Link to="/progress" style={styles.secondaryBtn}>
            My path
          </Link>
        </section>

        <footer style={styles.footer}>
          <p style={styles.footerText}>
            Start with a theme that feels close to you. No grades. No pressure.
          </p>
        </footer>
      </div>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 16px",
    background: "#fdfbf7",
    color: "#1f1f1f",
  },
  container: {
    width: "100%",
    maxWidth: "860px",
    padding: "48px 28px",
    background: "#ffffff",
    border: "1px solid rgba(0,0,0,0.06)",
    borderRadius: "18px",
  },
  header: {
    marginBottom: "28px",
  },
  kicker: {
    margin: 0,
    fontSize: "14px",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    opacity: 0.7,
  },
  title: {
    margin: "14px 0 10px",
    fontSize: "40px",
    lineHeight: 1.15,
    fontWeight: 700,
  },
  subtitle: {
    margin: 0,
    fontSize: "18px",
    lineHeight: 1.6,
    opacity: 0.85,
  },
  actions: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    marginTop: "26px",
  },
  primaryBtn: {
    display: "inline-block",
    padding: "12px 16px",
    borderRadius: "12px",
    background: "#1f1f1f",
    color: "#fff",
    textDecoration: "none",
    fontWeight: 600,
  },
  secondaryBtn: {
    display: "inline-block",
    padding: "12px 16px",
    borderRadius: "12px",
    background: "transparent",
    border: "1px solid rgba(0,0,0,0.18)",
    color: "#1f1f1f",
    textDecoration: "none",
    fontWeight: 600,
  },
  footer: {
    marginTop: "34px",
    paddingTop: "18px",
    borderTop: "1px solid rgba(0,0,0,0.06)",
  },
  footerText: {
    margin: 0,
    fontSize: "14px",
    opacity: 0.75,
  },
};

export default Landing;
