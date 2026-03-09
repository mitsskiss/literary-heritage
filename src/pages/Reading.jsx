import { useParams, Link } from "react-router-dom";
import { works } from "../data/works";
import { useState, useEffect } from "react";
import { loadProgress, saveProgress } from "../utils/storage";

function Reading() {
  const { id } = useParams();
  const work = works.find((w) => String(w.id) === id);

  const [activeAnnotation, setActiveAnnotation] = useState(null);

  useEffect(() => {
    const close = () => setActiveAnnotation(null);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  const [progress, setProgress] = useState(() => {
    const initialProgress = loadProgress();

    if (work && !initialProgress.readWorks.includes(id)) {
      const updated = {
        ...initialProgress,
        readWorks: [...initialProgress.readWorks, id],
      };
      saveProgress(updated);
      return updated;
    }

    return initialProgress;
  });

  if (!work) {
    return (
      <main style={styles.page}>
        <div style={styles.container}>
          <div style={styles.notFoundBox}>
            <h2 style={styles.notFoundTitle}>Work not found</h2>
            <p style={styles.notFoundText}>
              We could not find this literary work in the current collection.
            </p>
            <Link to="/explore" style={styles.backBtn}>
              Back to explore
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const handleAnswer = (fragmentId, option) => {
    const updated = {
      ...progress,
      answers: {
        ...progress.answers,
        [fragmentId]: option,
      },
    };

    setProgress(updated);
    saveProgress(updated);
  };

  return (
    <main className="reading-page" style={styles.page}>
      <div style={styles.container}>
        <Link to="/explore" style={styles.topBackLink}>
          ← Back to explore
        </Link>

        <section style={styles.heroCard}>
          <div style={styles.heroImageWrap}>
            <div
              style={{
                ...styles.heroImage,
                backgroundImage: work.image ? `url(${work.image})` : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div style={styles.heroImageOverlay} />
            </div>
          </div>

          <div style={styles.heroContent}>
            <p style={styles.kicker}>INTERACTIVE READING</p>

            <h1 style={styles.title}>{work.title}</h1>

            <Link
              to={`/author/${encodeURIComponent(work.author)}`}
              style={styles.authorLink}
            >
              {work.author}
            </Link>

            {work.description && (
              <p style={styles.description}>{work.description}</p>
            )}

            <div style={styles.metaRow}>
              {work.year && (
                <div style={styles.metaPill}>
                  <span style={styles.metaLabel}>Year</span>
                  <span style={styles.metaValue}>{work.year}</span>
                </div>
              )}

              <div style={styles.metaPill}>
                <span style={styles.metaLabel}>Fragments</span>
                <span style={styles.metaValue}>{work.fragments.length}</span>
              </div>
            </div>

            {work.themes?.length > 0 && (
              <div style={styles.themeRow}>
                {work.themes.map((theme) => (
                  <span key={theme} style={styles.themeTag}>
                    {theme}
                  </span>
                ))}
              </div>
            )}
          </div>
        </section>

        <section style={styles.readingSection}>
          {work.fragments.map((fragment, index) => (
            <article key={fragment.id} style={styles.fragmentCard}>
              <div style={styles.fragmentTop}>
                <span style={styles.fragmentNumber}>
                  Fragment {index + 1}
                </span>
              </div>

              {fragment.authorNote && (
                <div style={styles.authorNote}>
                  <strong style={styles.authorNoteTitle}>
                    Author’s perspective
                  </strong>
                  <p style={styles.authorNoteText}>{fragment.authorNote}</p>
                </div>
              )}

              <p style={styles.text}>
                {fragment.text.split(" ").map((word, wordIndex) => {
                  const clean = word.replace(/[.,!?;:"]/g, "");
                  const annotation = fragment.annotations?.find(
                    (a) => a.word === clean
                  );

                  if (annotation) {
                    return (
                      <span
                        key={wordIndex}
                        onClick={(e) => {
                          e.stopPropagation();
                          const rect = e.target.getBoundingClientRect();

                          setActiveAnnotation({
                            ...annotation,
                            x: rect.left + window.scrollX,
                            y: rect.bottom + window.scrollY + 10,
                          });
                        }}
                        style={{
                          ...styles.annotated,
                          ...(activeAnnotation?.word === annotation.word
                            ? styles.annotatedActive
                            : {}),
                        }}
                      >
                        {word}{" "}
                      </span>
                    );
                  }

                  return <span key={wordIndex}>{word} </span>;
                })}
              </p>

              {fragment.reflection && (
                <div style={styles.reflection}>
                  <p style={styles.question}>{fragment.reflection.question}</p>

                  <div style={styles.options}>
                    {fragment.reflection.options.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => handleAnswer(fragment.id, opt)}
                        style={{
                          ...styles.optionBtn,
                          ...(progress.answers[fragment.id] === opt
                            ? styles.optionActive
                            : {}),
                        }}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>

                  {progress.answers[fragment.id] &&
                    fragment.reflection.resonanceQuote && (
                      <div style={styles.resonance}>
                        <div style={styles.resonanceLine} />
                        <div style={styles.resonanceBody}>
                          <p style={styles.resonanceQuote}>
                            “{fragment.reflection.resonanceQuote.text}”
                          </p>
                          <div style={styles.resonanceAuthor}>
                            — {fragment.reflection.resonanceQuote.author}
                          </div>
                        </div>
                      </div>
                    )}
                </div>
              )}
            </article>
          ))}
        </section>
      </div>

      {activeAnnotation && (
        <div
          style={{
            ...styles.annotationPopover,
            top: activeAnnotation.y,
            left: activeAnnotation.x,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <strong style={styles.annotationWord}>{activeAnnotation.word}</strong>
          <div style={styles.annotationText}>
            {activeAnnotation.explanation}
          </div>
        </div>
      )}
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
    maxWidth: "1100px",
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
    gridTemplateColumns: "320px 1fr",
    gap: "28px",
    alignItems: "stretch",
    background: "rgba(255,255,255,0.68)",
    border: "1px solid rgba(0,0,0,0.06)",
    borderRadius: "28px",
    overflow: "hidden",
    backdropFilter: "blur(10px)",
    marginBottom: "34px",
  },

  heroImageWrap: {
    minHeight: "100%",
  },

  heroImage: {
    height: "100%",
    minHeight: "340px",
    background:
      "linear-gradient(135deg, #d9cdbd 0%, #b89f86 35%, #8e6e5b 100%)",
    position: "relative",
  },

  heroImageOverlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(to top, rgba(18,18,18,0.32) 0%, rgba(18,18,18,0.08) 45%, rgba(18,18,18,0.02) 100%)",
  },

  heroContent: {
    padding: "30px 30px 28px 0",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
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

  authorLink: {
    display: "inline-block",
    textDecoration: "none",
    color: "#1f1f1f",
    opacity: 0.72,
    fontSize: "17px",
    fontWeight: 500,
  },

  description: {
    margin: "18px 0 0",
    fontSize: "17px",
    lineHeight: 1.75,
    opacity: 0.84,
    maxWidth: "640px",
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

  themeRow: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    marginTop: "18px",
  },

  themeTag: {
    padding: "8px 16px",
    borderRadius: "999px",
    background: "#f3efe8",
    border: "1px solid rgba(0,0,0,0.05)",
    fontWeight: 600,
    fontSize: "14px",
  },

  readingSection: {
    display: "flex",
    flexDirection: "column",
    gap: "22px",
  },

  fragmentCard: {
    background: "rgba(255,255,255,0.66)",
    border: "1px solid rgba(0,0,0,0.06)",
    borderRadius: "24px",
    padding: "24px",
    backdropFilter: "blur(8px)",
  },

  fragmentTop: {
    marginBottom: "14px",
  },

  fragmentNumber: {
    display: "inline-block",
    padding: "7px 12px",
    borderRadius: "999px",
    background: "#f3efe8",
    border: "1px solid rgba(0,0,0,0.05)",
    fontSize: "13px",
    fontWeight: 600,
    opacity: 0.78,
  },

  authorNote: {
    marginBottom: "18px",
    padding: "16px 18px",
    background: "#fcfbf8",
    borderLeft: "4px solid #6b7fd9",
    borderRadius: "14px",
  },

  authorNoteTitle: {
    display: "block",
    fontSize: "14px",
    marginBottom: "6px",
  },

  authorNoteText: {
    margin: 0,
    fontSize: "15px",
    lineHeight: 1.7,
    opacity: 0.84,
  },

  text: {
    margin: 0,
    fontSize: "20px",
    lineHeight: 1.9,
  },

  annotated: {
    cursor: "pointer",
    padding: "2px 5px",
    borderRadius: "8px",
    background: "#f7efc7",
    transition: "background 0.2s ease, box-shadow 0.2s ease",
  },

  annotatedActive: {
    background: "#ffe58a",
    boxShadow: "0 0 0 3px rgba(255,229,138,0.35)",
  },

  reflection: {
    marginTop: "22px",
    padding: "18px",
    background: "#fcfbf8",
    borderRadius: "18px",
    border: "1px solid rgba(0,0,0,0.04)",
  },

  question: {
    margin: "0 0 12px",
    fontWeight: 600,
    fontSize: "16px",
  },

  options: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },

  optionBtn: {
    padding: "10px 14px",
    borderRadius: "12px",
    border: "1px solid rgba(0,0,0,0.16)",
    background: "#fff",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 500,
  },

  optionActive: {
    background: "#1f1f1f",
    color: "#fff",
    borderColor: "#1f1f1f",
  },

  resonance: {
    display: "flex",
    gap: "14px",
    marginTop: "18px",
    paddingTop: "12px",
  },

  resonanceLine: {
    width: "3px",
    borderRadius: "999px",
    background: "#6b7fd9",
    flexShrink: 0,
  },

  resonanceBody: {
    minWidth: 0,
  },

  resonanceQuote: {
    margin: 0,
    fontSize: "16px",
    lineHeight: 1.75,
    fontStyle: "italic",
    opacity: 0.9,
  },

  resonanceAuthor: {
    marginTop: "8px",
    fontSize: "14px",
    opacity: 0.68,
  },

  annotationPopover: {
    position: "absolute",
    background: "#ffffff",
    border: "1px solid rgba(0,0,0,0.12)",
    borderRadius: "14px",
    padding: "12px 14px",
    maxWidth: "280px",
    fontSize: "14px",
    lineHeight: 1.6,
    zIndex: 1000,
    boxShadow: "0 14px 30px rgba(0,0,0,0.10)",
  },

  annotationWord: {
    display: "block",
    marginBottom: "4px",
  },

  annotationText: {
    opacity: 0.84,
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

export default Reading;