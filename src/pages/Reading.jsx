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

function Reading() {
  const { id } = useParams();
  const work = works.find((item) => item.id === id);
  const metadata = workMetadataById[id];
  const storyBook = getStoryBookByWorkId(id);
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
            <h1 className="reading-book-fallback__title">Work not found</h1>
            <p className="reading-book-fallback__text">
              We could not find this literary work in the archive.
            </p>
            <Link to="/explore" className="reading-book-fallback__action">
              Back to explore
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
            Back to explore
          </Link>

          <div className="reading-book-fallback">
            <h1 className="reading-book-fallback__title">{work.title}</h1>
            <p className="reading-book-fallback__text">
              This work is already part of the archive, but its chapter-based
              interactive reading route has not been prepared yet.
            </p>
            <Link to="/explore" className="reading-book-fallback__action">
              Return to archive
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
          Back to explore
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
              <span>{metadata?.period ?? "Literary archive"}</span>
              <span>{metadata?.type ?? "Work"}</span>
              <span>{storyBook.totalMinutes} min route</span>
            </div>

            <h1 className="reading-book-hero__title">{work.title}</h1>
            <p className="reading-book-hero__author">{work.author}</p>
            <p className="reading-book-hero__description">{work.description}</p>
            <p className="reading-book-hero__overview">{storyBook.overview}</p>

            <div className="reading-book-hero__metrics">
              <article>
                <span>Chapters</span>
                <strong>{storyBook.chapters.length}</strong>
              </article>
              <article>
                <span>Scenes</span>
                <strong>{storyBook.totalScenes}</strong>
              </article>
              <article>
                <span>XP route</span>
                <strong>{storyBook.totalXp}</strong>
              </article>
              <article>
                <span>Your XP</span>
                <strong>{xp}</strong>
              </article>
            </div>

            <div className="reading-book-hero__actions">
              <Link
                to={getChapterPath(work.id, nextChapter.chapterNumber)}
                className="reading-book-hero__action is-primary"
              >
                {nextChapter.isStarted && !nextChapter.isCompleted
                  ? "Continue reading"
                  : "Start reading"}
              </Link>
              <Link to="/progress" className="reading-book-hero__action">
                View progress
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
            <p className="reading-book-summary__label">Route progress</p>
            <div className="reading-book-summary__row">
              <h2>{progressPercent}%</h2>
              <span>
                {completedChapters.length} of {chapterCards.length} chapters completed
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
            <p className="reading-book-summary__label">Reader state</p>
            <div className="reading-book-summary__meta">
              <span>Level {level}</span>
              <span>{streak} day streak</span>
              <span>{metadata?.mood ?? "Reflective"} tone</span>
            </div>
          </article>
        </section>

        <section className="reading-book-chapters">
          <div className="reading-book-chapters__head">
            <h2 className="reading-book-chapters__title">Chapter route</h2>
            <p className="reading-book-chapters__meta">
              Move chapter by chapter through the work.
            </p>
          </div>

          <div className="reading-book-chapters__list">
            {chapterCards.map((chapter) => (
              <article key={chapter.id} className="reading-chapter-card">
                <div className="reading-chapter-card__top">
                  <p className="reading-chapter-card__eyebrow">
                    Chapter {chapter.chapterNumber}
                  </p>
                  <span className={`reading-chapter-card__state ${chapter.isCompleted ? "is-complete" : ""}`}>
                    {chapter.isCompleted
                      ? "Completed"
                      : chapter.isStarted
                        ? `Scene ${chapter.currentScene} of ${chapter.scenes.length}`
                        : "Not started"}
                  </span>
                </div>

                <h3 className="reading-chapter-card__title">{chapter.chapterTitle}</h3>
                <p className="reading-chapter-card__text">{chapter.tagline}</p>

                <div className="reading-chapter-card__meta">
                  <span>{chapter.scenes.length} scenes</span>
                  <span>{chapter.estimatedMinutes} min</span>
                  <span>{chapter.completionXp} XP</span>
                </div>

                <Link
                  to={getChapterPath(work.id, chapter.chapterNumber)}
                  className="reading-chapter-card__action"
                >
                  {chapter.isCompleted
                    ? "Replay chapter"
                    : chapter.isStarted
                      ? "Continue chapter"
                      : "Open chapter"}
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
