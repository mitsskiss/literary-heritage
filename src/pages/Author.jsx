import { useParams, Link } from "react-router-dom";
import { works } from "../data/works";
import { authors } from "../data/authors";

function Author() {
  const { name } = useParams();

  const authorWorks = works.filter(
    (w) => w.author === name
  );
  const axisX = 24; // одна координата для линии и точки


  if (!authorWorks.length) {
    return <p style={{ padding: "40px" }}>Author not found.</p>;
  }
const timelineItems = authorWorks
  .map((work) => {
    const notes = work.fragments
      .map((f) => f.authorNote)
      .filter(Boolean);

    return {
      id: work.id,
      title: work.title,
      year: work.year,
      themes: work.themes,
      focus: notes[0],
    };
  })
  .sort((a, b) => a.year - b.year);



  const authorInfo = authors.find(
    (a) => a.name === name
  );

  const themes = [
    ...new Set(authorWorks.flatMap((w) => w.themes)),
  ];

  const philosophyNotes = [
    ...new Set(
      authorWorks
        .flatMap((w) => w.fragments)
        .map((f) => f.authorNote)
        .filter(Boolean)
    ),
  ];

  return (
    <main style={{ padding: "40px 16px" }}>
      <div style={{ maxWidth: "760px", margin: "0 auto" }}>

       <header
  style={{
    marginBottom: "36px",
    padding: "24px",
    borderRadius: "20px",
    background: "linear-gradient(180deg, #fafafa, #f2f2f2)",
  }}
>
  <h2 style={{ fontSize: "34px", margin: 0 }}>{name}</h2>

  {authorInfo && (
    <p
      style={{
        marginTop: "12px",
        maxWidth: "560px",
        opacity: 0.8,
        lineHeight: 1.6,
      }}
    >
      {authorInfo.description}
    </p>
  )}
</header>


        <section style={{ marginBottom: "36px" }}>
  <h3 style={{ marginBottom: "12px" }}>Themes explored</h3>

  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
    {themes.map((theme) => (
      <span
        key={theme}
        style={{
          padding: "6px 16px",
          borderRadius: "999px",
          background: "#f4f4f4",
          fontWeight: 600,
          fontSize: "14px",
          cursor: "pointer",
        }}
      >
        {theme}
      </span>
    ))}
  </div>
</section>
{philosophyNotes.length > 0 && (
  <section style={{ marginBottom: "40px" }}>
    <h3 style={{ marginBottom: "12px" }}> Philosophy focus</h3>

    <div
      style={{
        background: "#fcfcfc",
        borderLeft: "4px solid #1f1f1f",
        borderRadius: "14px",
        padding: "18px 20px",
        lineHeight: 1.65,
      }}
    >
      {philosophyNotes.slice(0, 3).map((note, idx) => (
        <p
          key={idx}
          style={{
            margin: idx === 0 ? 0 : "12px 0 0",
            fontSize: "15px",
          }}
        >
          {note}
        </p>
      ))}
    </div>
  </section>
)}
<section>
  {/* TIMELINE */}
<section style={{ marginBottom: "40px" }}>
  <h3 style={{ marginBottom: "20px" }}> Evolution of ideas</h3>

<div
  style={{
    position: "relative",
    paddingLeft: "56px", // ⬅️ было 40px
  }}
>
  
  {/* vertical line */}
  <div
 style={{
    position: "absolute",
    left: axisX,
    top: "8px",
    bottom: "8px",
    width: "2px",
    background: "#1f1f1f",
    opacity: 0.25,
  }}
  />

{timelineItems.map((item, idx) => (
  <div
   key={idx}
  style={{
    position: "relative",
    marginBottom: "36px",
    paddingLeft: axisX + 24, // текст всегда правее оси
  }}
  >
    {/* dot */}
<Link
  to={`/reading/${item.id}`}
  style={{
    position: "absolute",
    left: axisX - 7,
    top: "6px",
    width: "14px",
    height: "14px",
    borderRadius: "50%",
    background: "#1f1f1f",
    zIndex: 2,
    display: "block",
    transition: "transform 0.15s ease, background 0.15s ease",
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = "scale(1.2)";
    e.currentTarget.style.background = "#000";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = "scale(1)";
    e.currentTarget.style.background = "#1f1f1f";
  }}
/>
<div
  style={{
    fontSize: "13px",
    opacity: 0.5,
    marginBottom: "4px",
  }}
>
  {item.year}
</div>



<Link
  to={`/reading/${item.id}`}
  style={{
    textDecoration: "none",
    color: "#1f1f1f",
  }}
>
  <h4 style={{ margin: "0 0 6px", fontSize: "16px" }}>
    {item.title}
  </h4>
</Link>



    <p
      style={{
        margin: 0,
        fontSize: "15px",
        lineHeight: 1.6,
        opacity: 0.85,
      }}
    >
      {item.focus}
    </p>

    <div
      style={{
        marginTop: "8px",
        fontSize: "13px",
        opacity: 0.6,
      }}
    >
      {item.themes.join(" • ")}
    </div>
  </div>
))}
</div>
</section>

  <h3 style={{ marginBottom: "16px" }}>Works</h3>

  {authorWorks.map((work) => (
    <div
      key={work.id}
      style={{
        marginBottom: "18px",
        paddingBottom: "12px",
        borderBottom: "1px solid rgba(0,0,0,0.08)",
      }}
    >
      <Link
        to={`/reading/${work.id}`}
        style={{
          fontWeight: 600,
          fontSize: "16px",
          textDecoration: "none",
          color: "#1f1f1f",
        }}
      >
        {work.title}
      </Link>

      <div style={{ fontSize: "14px", opacity: 0.6, marginTop: "4px" }}>
        {work.themes.join(" • ")}
      </div>
    </div>
  ))}
</section>


      </div>
    </main>
  );
}

export default Author;
