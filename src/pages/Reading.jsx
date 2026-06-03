import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { works } from "../data/works";
import { workMetadataById } from "../data/exploreData";
import {
  getChapterPath,
  getStoryBookByWorkId,
  hasStoryMode,
} from "../data/stories";
import { getAdminStoryBookByWorkId, mergeAdminWorks } from "../admin/adminContent";
import { useAdminContent } from "../hooks/useAdminContent";
import { useProgressStore } from "../store/useProgressStore";
import BookSocial from "../components/BookSocial";
import "./Reading.css";
import { useI18n } from "../i18n/useI18n";

function Reading() {
  const { t, language, localizeMetadata, localizeStoryBook, localizeWork } = useI18n();
  const { id } = useParams();
  const { content: adminContent } = useAdminContent();
  const allWorks = mergeAdminWorks(works.map(localizeWork), adminContent, language);
  const work = allWorks.find((item) => item.id === id);
  const metadata = localizeMetadata(id, {
    ...(workMetadataById[id] ?? {}),
    period: work?.period ?? workMetadataById[id]?.period,
    type: work?.type ?? workMetadataById[id]?.type,
    mood: work?.mood ?? workMetadataById[id]?.mood,
  });
  const staticStoryBook = localizeStoryBook(getStoryBookByWorkId(id));
  const adminStoryBook = getAdminStoryBookByWorkId(id, adminContent, language);
  const storyBook = staticStoryBook ?? adminStoryBook;
  const {
    xp,
    level,
    streak,
    storyProgress,
    favorites,
    migrateLegacyProgress,
    toggleFavorite,
  } =
    useProgressStore();

  useEffect(() => {
    migrateLegacyProgress();
  }, [migrateLegacyProgress]);

  if (!work) {
    return (
      <main className="reading-book-page">
        <div className="reading-book-page__container">
          <div className="reading-book-fallback">
            <h1 className="reading-book-fallback__title">{t("workNotFound")}</h1>
            <p className="reading-book-fallback__text">
              {t("workNotFoundText")}
            </p>
            <Link to="/explore" className="reading-book-fallback__action">
              {t("backToExplore")}
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if ((!hasStoryMode(id) && !adminStoryBook) || !storyBook) {
    return (
      <main className="reading-book-page">
        <div className="reading-book-page__container">
          <Link to="/explore" className="reading-book-page__backLink">
            {t("backToExplore")}
          </Link>

          <div className="reading-book-fallback">
            <h1 className="reading-book-fallback__title">{work.title}</h1>
            <p className="reading-book-fallback__text">
              {t("routeNotPrepared")}
            </p>
            <Link to="/explore" className="reading-book-fallback__action">
              {t("returnArchive")}
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const chapterCards = storyBook.chapters.map((chapter) => {
    const progress = storyProgress[chapter.id];
    const currentScene = (progress?.currentSceneIndex ?? 0) + 1;
    const isCompleted = Boolean(progress?.completed);
    const isStarted = Boolean(progress);

    return {
      ...chapter,
      progress,
      currentScene,
      isCompleted,
      isStarted,
    };
  });

  const nextChapter =
    chapterCards.find((chapter) => !chapter.isCompleted) ?? chapterCards[0];
  const completedChapters = chapterCards.filter((chapter) => chapter.isCompleted);
  const totalScenes = storyBook.totalScenes;
  const completedScenes = chapterCards.reduce((sum, chapter) => {
    if (chapter.isCompleted) return sum + chapter.scenes.length;
    if (!chapter.progress) return sum;

    return sum + Math.max(chapter.currentScene - 1, 0);
  }, 0);
  const progressPercent =
    totalScenes > 0 ? Math.round((completedScenes / totalScenes) * 100) : 0;
  const isWorkFavorite = favorites.some(
    (favorite) => favorite.type === "work" && favorite.id === work.id
  );
  const isFavorite = (type, favoriteId) =>
    favorites.some(
      (favorite) => favorite.type === type && favorite.id === favoriteId
    );

  return (
    <main className="reading-book-page">
      <div className="reading-book-page__container">
        <Link to="/explore" className="reading-book-page__backLink">
          {t("backToExplore")}
        </Link>

        <section className="reading-book-hero">
          <div className="reading-book-hero__media">
            <div
              className="reading-book-hero__cover"
              style={{ backgroundImage: `url(${work.image})` }}
            />
          </div>

          <div className="reading-book-hero__content">
            <div className="reading-book-hero__metaLine">
              <span>{metadata?.period ?? t("literaryArchive")}</span>
              <i aria-hidden="true" />
              <span>{metadata?.type ?? t("work")}</span>
              <i aria-hidden="true" />
              <span>{t("minRoute", { count: storyBook.totalMinutes })}</span>
            </div>

            <h1 className="reading-book-hero__title">{work.title}</h1>
            <p className="reading-book-hero__author">{work.author}</p>
            <p className="reading-book-hero__description">{work.description}</p>
            <p className="reading-book-hero__overview">{storyBook.overview}</p>

            <div className="reading-book-hero__metrics">
              <article>
                <span>{t("chapters")}</span>
                <strong>{storyBook.chapters.length}</strong>
              </article>
              <article>
                <span>{t("scenes")}</span>
                <strong>{storyBook.totalScenes}</strong>
              </article>
              <article>
                <span>{t("xpRoute")}</span>
                <strong>{storyBook.totalXp}</strong>
              </article>
              <article>
                <span>{t("yourXp")}</span>
                <strong>{xp}</strong>
              </article>
            </div>

            <div className="reading-book-hero__actions">
              <Link
                to={getChapterPath(work.id, nextChapter.chapterNumber)}
                className="reading-book-hero__action is-primary"
              >
                {nextChapter.isStarted && !nextChapter.isCompleted
                  ? t("continueReading")
                  : t("startReading")}
              </Link>
              <Link to="/progress" className="reading-book-hero__action">
                {t("viewProgress")}
              </Link>
              <button
                type="button"
                className={`reading-book-hero__action ${
                  isWorkFavorite ? "is-favorite" : ""
                }`}
                onClick={() =>
                  toggleFavorite({
                    type: "work",
                    id: work.id,
                    title: work.title,
                    subtitle: work.author,
                    href: `/reading/${work.id}`,
                  })
                }
              >
                {isWorkFavorite ? t("savedFavorite") : t("saveFavorite")}
              </button>
            </div>

            <div className="mura-book-reference-row">
              <article className="mura-book-progress-card">
                <span>{t("routeProgress")}</span>
                <strong>{progressPercent}%</strong>
                <div className="mura-ref-progress" aria-hidden="true">
                  <i style={{ width: `${progressPercent}%` }} />
                </div>
                <small>{t("chaptersCompleted", { done: completedChapters.length, total: chapterCards.length })}</small>
              </article>
              <article className="mura-book-quote-card">
                <span aria-hidden="true">&ldquo;</span>
                <p>
                  {work.fragments?.[0]?.reflection?.resonanceQuote?.text ??
                    work.fragments?.[0]?.text ??
                    storyBook.overview}
                </p>
                <small>{work.fragments?.[0]?.reflection?.resonanceQuote?.author ?? work.author}</small>
              </article>
            </div>

            <div className="reading-book-hero__themes">
              <p>{t("themes")}</p>
              {work.themes.map((theme) => (
                <button
                  key={theme}
                  type="button"
                  className={`reading-book-theme ${
                    isFavorite("theme", `${work.id}:${theme}`) ? "is-favorite" : ""
                  }`}
                  onClick={() =>
                    toggleFavorite({
                      type: "theme",
                      id: `${work.id}:${theme}`,
                      title: theme,
                      subtitle: work.title,
                      href: `/reading/${work.id}`,
                    })
                  }
                >
                  {theme}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="reading-flow-guide" aria-label={t("readingFlowTitle")}>
          <div>
            <p className="reading-flow-guide__label">{t("readingFlowTitle")}</p>
            <h2>{t("chapterRoute")}</h2>
          </div>
          <ol>
            <li>
              <strong>{t("readingFlowStepOne")}</strong>
              <span>{t("readingFlowStepOneText")}</span>
            </li>
            <li>
              <strong>{t("readingFlowStepTwo")}</strong>
              <span>{t("readingFlowStepTwoText")}</span>
            </li>
            <li>
              <strong>{t("readingFlowStepThree")}</strong>
              <span>{t("readingFlowStepThreeText")}</span>
            </li>
          </ol>
        </section>

        {work.fragments?.length > 0 ? (
          <section className="reading-book-fragments">
            <div className="reading-book-fragments__head">
              <h2>{t("realFragments")}</h2>
              <p>{t("realFragmentsText")}</p>
            </div>

            <div className="reading-book-fragments__grid">
              {work.fragments.map((fragment) => {
                const favoriteId = `${work.id}:${fragment.id}`;
                const isFragmentFavorite = isFavorite("quote", favoriteId);

                return (
                  <article className="reading-fragment-card" key={fragment.id}>
                    <div className="reading-fragment-card__top">
                      <p>{t("quoteFragment")}</p>
                      <button
                        type="button"
                        className={`reading-fragment-card__save ${
                          isFragmentFavorite ? "is-favorite" : ""
                        }`}
                        onClick={() =>
                          toggleFavorite({
                            type: "quote",
                            id: favoriteId,
                            title: fragment.text,
                            subtitle: work.title,
                            href: `/reading/${work.id}`,
                          })
                        }
                      >
                        {isFragmentFavorite ? t("savedFavorite") : t("saveFavorite")}
                      </button>
                    </div>
                    <blockquote>{fragment.text}</blockquote>
                    <p className="reading-fragment-card__note">
                      {fragment.authorNote}
                    </p>

                    {fragment.annotations?.length > 0 ? (
                      <div className="reading-fragment-card__annotations">
                        {fragment.annotations.map((annotation) => (
                          <span key={annotation.word}>
                            <strong>{annotation.word}</strong>
                            {annotation.explanation}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </article>
                );
              })}
            </div>
          </section>
        ) : null}

        <section className="reading-book-summary">
          <article className="reading-book-summary__card">
            <p className="reading-book-summary__label">{t("routeProgress")}</p>
            <div className="reading-book-summary__row">
              <h2>{progressPercent}%</h2>
              <span>
                {t("chaptersCompleted", { done: completedChapters.length, total: chapterCards.length })}
              </span>
            </div>
            <div className="reading-book-summary__track" aria-hidden="true">
              <div
                className="reading-book-summary__fill"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </article>

          <article className="reading-book-summary__card">
            <p className="reading-book-summary__label">{t("readerState")}</p>
            <div className="reading-book-summary__meta">
              <span>{t("levelValue", { level })}</span>
              <span>{t("dayStreak", { count: streak })}</span>
              <span>{t("tone", { mood: metadata?.mood ?? t("reflectiveMood") })}</span>
            </div>
          </article>
        </section>

        <section className="reading-book-chapters">
          <div className="reading-book-chapters__head">
            <h2 className="reading-book-chapters__title">{t("chapterRoute")}</h2>
            <p className="reading-book-chapters__meta">
              {t("chapterRouteText")}
            </p>
          </div>

          <nav className="mura-book-chapter-tabs" aria-label={t("chapterRoute")}>
            {chapterCards.map((chapter) => (
              <Link
                key={`${chapter.id}-tab`}
                to={getChapterPath(work.id, chapter.chapterNumber)}
                className={chapter.isStarted ? "is-started" : ""}
              >
                {chapter.chapterNumber}-{t("sceneFocus").split(" ")[0]}
              </Link>
            ))}
          </nav>

          <div className="reading-book-chapters__list">
            {chapterCards.map((chapter) => (
              <article key={chapter.id} className="reading-chapter-card">
                <div className="reading-chapter-card__top">
                  <p className="reading-chapter-card__eyebrow">
                    {t("chapter", { number: chapter.chapterNumber })}
                  </p>
                  <span className={`reading-chapter-card__state ${chapter.isCompleted ? "is-complete" : ""}`}>
                    {chapter.isCompleted
                      ? t("completed")
                      : chapter.isStarted
                        ? t("sceneOf", { current: chapter.currentScene, total: chapter.scenes.length })
                        : t("notStarted")}
                  </span>
                </div>

                <h3 className="reading-chapter-card__title">{chapter.chapterTitle}</h3>
                <p className="reading-chapter-card__text">{chapter.tagline}</p>

                <div className="reading-chapter-card__meta">
                  <span>{chapter.scenes.length} {t("scenes").toLowerCase()}</span>
                  <span>{chapter.estimatedMinutes} {t("min")}</span>
                  <span>{t("readingPointsValue", { count: chapter.completionXp })}</span>
                </div>

                <Link
                  to={getChapterPath(work.id, chapter.chapterNumber)}
                  className="reading-chapter-card__action"
                >
                  {chapter.isCompleted
                    ? t("replayChapter")
                    : chapter.isStarted
                      ? t("continueChapter")
                      : t("openChapter")}
                </Link>
              </article>
            ))}
          </div>
        </section>

        <BookSocial work={work} />
      </div>
    </main>
  );
}

export default Reading;
