import { useParams, Link } from "react-router-dom";
import { works } from "../data/works";
import { useState, useEffect } from "react";
import { loadProgress, saveProgress } from "../utils/storage";

function Reading() {
  const { id } = useParams();
  const work = works.find((w) => String(w.id) === id);

  const [activeAnnotation, setActiveAnnotation] = useState(null);
  // { word, explanation, x, y }

  useEffect(() => {
    const close = () => setActiveAnnotation(null);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  const [progress, setProgress] = useState(() => {
    const initialProgress = loadProgress();
    if (!initialProgress.readWorks.includes(id)) {
      const updated = {
        ...initialProgress,
        readWorks: [...initialProgress.readWorks, id],
      };
      saveProgress(updated);
      return updated;
    }
    return initialProgress;
  });

  if (!work) return <p>Work not found.</p>;

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
    <main style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <h2 style={styles.title}>{work.title}</h2>
<Link to={`/author/${work.author}`} style={styles.authorLink}>
  {work.author}
</Link>

        </header>

        {work.fragments.map((fragment) => (
          <section key={fragment.id} style={styles.fragment}>
            {/* Author perspective */}
            {fragment.authorNote && (
              <div style={styles.authorNote}>
                <strong>Author’s perspective</strong>
                <p style={{ margin: "6px 0 0" }}>{fragment.authorNote}</p>
              </div>
            )}

            {/* Main text */}
            <p style={styles.text}>
              {fragment.text.split(" ").map((word, index) => {
                const clean = word.replace(/[.,]/g, "");
                const annotation = fragment.annotations?.find(
                  (a) => a.word === clean
                );

                if (annotation) {
                  return (
                    <span
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        const rect = e.target.getBoundingClientRect();
                        setActiveAnnotation({
                          ...annotation,
                          x: rect.left + window.scrollX,
                          y: rect.bottom + window.scrollY + 6,
                        });
                      }}
                      style={{
                        ...styles.annotated,
                        backgroundColor:
                          activeAnnotation?.word === annotation.word
                            ? "#ffe58a"
                            : "#fff3cd",
                      }}
                    >
                      {word}{" "}
                    </span>
                  );
                }

                return <span key={index}>{word} </span>;
              })}
            </p>

            {/* Reflection */}
            {fragment.reflection && (
              <div style={styles.reflection}>
                <p style={styles.question}>
                  {fragment.reflection.question}
                </p>

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
                      <em>
                        “{fragment.reflection.resonanceQuote.text}”
                      </em>
                      <div style={styles.resonanceAuthor}>
                        — {fragment.reflection.resonanceQuote.author}
                      </div>
                    </div>
                  )}
              </div>
            )}
          </section>
        ))}
      </div>

      {/* Annotation popover */}
      {activeAnnotation && (
        <div
          style={{
            position: "absolute",
            top: activeAnnotation.y,
            left: activeAnnotation.x,
            background: "#ffffff",
            border: "1px solid rgba(0,0,0,0.15)",
            borderRadius: "10px",
            padding: "10px 12px",
            maxWidth: "260px",
            fontSize: "14px",
            lineHeight: 1.5,
            zIndex: 1000,
            boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <strong>{activeAnnotation.word}</strong>
          <div style={{ marginTop: "4px", opacity: 0.85 }}>
            {activeAnnotation.explanation}
          </div>
        </div>
      )}
    </main>
  );
}

const styles = {
  page: { padding: "40px 16px" },
  container: { maxWidth: "760px", margin: "0 auto" },

  header: { marginBottom: "28px" },
  title: { margin: 0, fontSize: "30px", fontWeight: 700 },
  authorLink: {
    display: "inline-block",
    marginTop: "6px",
    textDecoration: "none",
    color: "#1f1f1f",
    opacity: 0.7,
  },

  fragment: { marginBottom: "34px" },
  text: { fontSize: "18px", lineHeight: 1.7 },

  annotated: {
    cursor: "pointer",
    padding: "2px 4px",
    borderRadius: "6px",
  },

  authorNote: {
    marginBottom: "12px",
    padding: "12px 14px",
    background: "#f2f2f2",
    borderLeft: "4px solid #1f1f1f",
    borderRadius: "8px",
    fontSize: "15px",
    lineHeight: 1.6,
  },

  reflection: {
    marginTop: "14px",
    padding: "14px",
    background: "#f7f7f7",
    borderRadius: "12px",
  },

  question: { margin: "0 0 10px", fontWeight: 600 },

  options: { display: "flex", gap: "8px", flexWrap: "wrap" },

  optionBtn: {
    padding: "8px 12px",
    borderRadius: "10px",
    border: "1px solid rgba(0,0,0,0.2)",
    background: "#fff",
    cursor: "pointer",
  },

  optionActive: {
    background: "#1f1f1f",
    color: "#fff",
  },

  resonance: {
    marginTop: "16px",
    paddingTop: "12px",
    borderTop: "1px dashed rgba(0,0,0,0.2)",
    fontSize: "15px",
    lineHeight: 1.6,
    opacity: 0.9,
  },

  resonanceAuthor: {
    marginTop: "6px",
    fontSize: "14px",
    textAlign: "right",
    opacity: 0.7,
  },
};

export default Reading;
