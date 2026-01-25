import { authors } from "../data/authors";
import { works } from "../data/works";
import { Link } from "react-router-dom";

function Authors() {
  return (
    <main style={{ padding: "40px 16px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <header style={{ marginBottom: "40px" }}>
          <h2 style={{ fontSize: "32px", margin: 0 }}>Authors</h2>
          <p style={{ marginTop: "10px", opacity: 0.75 }}>
            Writers whose ideas are explored through interactive reading.
          </p>
        </header>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "24px",
          }}
        >
          {authors.map((author) => {
            const count = works.filter(
              (w) => w.author === author.name
            ).length;

            return (
              <div
                key={author.name}
                style={{
                  padding: "22px",
                  borderRadius: "16px",
                  border: "1px solid rgba(0,0,0,0.08)",
                  background: "#fff",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <h3 style={{ margin: "0 0 6px" }}>{author.name}</h3>

                <p style={{ fontSize: "15px", opacity: 0.75, lineHeight: 1.5 }}>
                  {author.description}
                </p>

                <p style={{ marginTop: "10px", fontSize: "14px", opacity: 0.6 }}>
                  Works in project: {count}
                </p>

                <Link
                  to={`/author/${encodeURIComponent(author.name)}`}
                  style={{
                    marginTop: "auto",
                    textDecoration: "none",
                    fontWeight: 600,
                    color: "#1f1f1f",
                  }}
                >
                  Open author →
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}

export default Authors;
