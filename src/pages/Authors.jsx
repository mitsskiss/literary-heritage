import { Link } from "react-router-dom";
import { authors } from "../data/authors";
import { works } from "../data/works";
import { useI18n } from "../i18n/I18nContext";
import { mergeAdminAuthors, mergeAdminWorks } from "../admin/adminContent";
import { useAdminContent } from "../hooks/useAdminContent";
import ShinyText from "../components/ShinyText";

function Authors() {
  const { t, language, localizeAuthors, localizeWorks } = useI18n();
  const { content: adminContent } = useAdminContent();
  const localizedAuthors = mergeAdminAuthors(localizeAuthors(authors), adminContent, language);
  const localizedWorks = mergeAdminWorks(localizeWorks(works), adminContent, language);

  return (
    <main className="authors-page" style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <p style={styles.kicker}>{t("authorsKicker")}</p>
          <h1 style={styles.title}>
            <ShinyText
              text={t("authorsTitle")}
              speed={3.2}
              delay={1.2}
              color="var(--text)"
              shineColor="var(--accent-strong)"
              spread={118}
              className="page-shiny-title"
            />
          </h1>
          <p style={styles.subtitle}>
            {t("authorsSubtitle")}
          </p>
          <p style={styles.meta}>{t("writersInCollection", { count: localizedAuthors.length })}</p>
        </header>

        <section style={styles.grid}>
          {localizedAuthors.map((author) => {
            const authorWorks = localizedWorks.filter(
              (work) => work.canonicalAuthor === author.canonicalName
            );

            return (
              <Link
                key={author.canonicalName}
                to={`/author/${encodeURIComponent(author.canonicalName)}`}
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
                    {t("worksInProject", { count: authorWorks.length })}
                  </p>

                  <span className="author-link" style={styles.link}>
                    {t("openAuthor")} <span>&gt;</span>
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
    padding: "110px 20px 80px",
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
    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
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

