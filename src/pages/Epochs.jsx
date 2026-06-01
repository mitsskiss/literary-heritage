import { Link } from "react-router-dom";
import { literaryEpochs } from "../data/epochs";
import { works } from "../data/works";
import { useI18n } from "../i18n/useI18n";
import "./Epochs.css";

function Epochs() {
  const { t, localizeWorks } = useI18n();
  const localizedWorks = localizeWorks(works);

  return (
    <main className="epochs-page">
      <section className="epochs-hero">
        <p className="heritage-kicker">{t("landingEpochs")}</p>
        <h1>{t("epochsTitle")}</h1>
        <p>{t("epochsSubtitle")}</p>
      </section>

      <section className="epochs-timeline">
        {literaryEpochs.map((epoch, index) => {
          const relatedWorks = localizedWorks.filter((work) => epoch.works.includes(work.id));
          return (
            <article className="epoch-card" key={epoch.id}>
              <span className="epoch-card__number">{String(index + 1).padStart(2, "0")}</span>
              <div>
                <p>{epoch.years}</p>
                <h2>{epoch.title}</h2>
                <span>{epoch.description}</span>
                <div className="epoch-card__chips">
                  {epoch.authors.slice(0, 3).map((author) => <small key={author}>{author}</small>)}
                </div>
              </div>
              <aside>
                {relatedWorks.slice(0, 2).map((work) => (
                  <Link to={`/reading/${work.id}`} key={work.id}>
                    <img src={work.image} alt="" />
                    <strong>{work.title}</strong>
                  </Link>
                ))}
                <Link className="epoch-card__action" to={`/works?epoch=${epoch.id}`}>
                  {t("openAllWorks")}
                </Link>
              </aside>
            </article>
          );
        })}
      </section>
    </main>
  );
}

export default Epochs;
