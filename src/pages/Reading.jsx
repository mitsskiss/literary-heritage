import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { works } from "../data/works";
import { workMetadataById } from "../data/exploreData";
import {
  getChapterPath,
  getStoryBookByWorkId,
  hasStoryMode,
} from "../data/stories";
import { useProgressStore } from "../store/useProgressStore";
import "./Reading.css";
import { useI18n } from "../i18n/I18nContext";

function Reading() {
  const { t, localizeMetadata, localizeStoryBook, localizeWork } = useI18n();
  const { id } = useParams();
  const work = localizeWork(works.find((item) => item.id === id));
  const metadata = localizeMetadata(id, workMetadataById[id]);
  const storyBook = localizeStoryBook(getStoryBookByWorkId(id));
  const { xp, level, streak, storyProgress, migrateLegacyProgress } =
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

  if (!hasStoryMode(id) || !storyBook) {
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
            <div className="reading-book-hero__topline">
              <span>{metadata?.period ?? t("literaryArchive")}</span>
              <span>{metadata?.type ?? t("work")}</span>
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
            </div>

            <div className="reading-book-hero__themes">
              {work.themes.map((theme) => (
                <span key={theme}>{theme}</span>
              ))}
            </div>
          </div>
        </section>

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
              <span>{t("tone", { mood: metadata?.mood ?? "Reflective" })}</span>
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
                  <span>{chapter.completionXp} XP</span>
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
      </div>
    </main>
  );
}

export default Reading;
