import { useEffect } from "react";
import { Link } from "react-router-dom";
import { works } from "../data/works";
import {
  getChapterPath,
  getChaptersByWorkId,
  getStoryById,
  hasStoryMode,
} from "../data/stories";
import { useProgressStore } from "../store/useProgressStore";
import "./Progress.css";
import { useI18n } from "../i18n/useI18n";

function Progress() {
  const { t, localizeAchievement, localizeStory, localizeWorks } = useI18n();
  const {
    xp,
    level,
    streak,
    lives,
    storyProgress,
    reflections,
    achievements,
    migrateLegacyProgress,
  } = useProgressStore();

  useEffect(() => {
    migrateLegacyProgress();
  }, [migrateLegacyProgress]);

  const localizedWorks = localizeWorks(works);
  const storyEnabledWorks = localizedWorks.filter((work) => hasStoryMode(work.id));

  const completedWorks = storyEnabledWorks.filter((work) =>
    getChaptersByWorkId(work.id).every(
      (chapter) => storyProgress[chapter.id]?.completed
    )
  );

  const activeStories = storyEnabledWorks.flatMap((work) =>
    getChaptersByWorkId(work.id)
      .map(localizeStory)
      .filter((chapter) => {
        const chapterState = storyProgress[chapter.id];
        return chapterState && !chapterState.completed;
      })
      .map((chapter) => {
        const chapterState = storyProgress[chapter.id];

        return {
          id: chapter.id,
          workId: work.id,
          chapterNumber: chapter.chapterNumber,
          title: work.title,
          chapterTitle: chapter.chapterTitle,
          author: work.author,
          currentScene: chapterState.currentSceneIndex + 1,
          totalScenes: chapter.scenes.length,
          earnedXp: chapterState.earnedXp,
        };
      })
  );

  const reflectionEntries = Object.entries(reflections).slice(-6).reverse();
  const completionRate =
    storyEnabledWorks.length > 0
      ? Math.round((completedWorks.length / storyEnabledWorks.length) * 100)
      : 0;
  const unlockedAchievements = achievements.length;
  const supportMetrics = [
    {
      label: t("readingPointsShort"),
      value: xp,
      text: t("progressPointsHelp"),
    },
    {
      label: t("level"),
      value: level,
      text: t("progressLevelHelp"),
    },
    {
      label: t("streak"),
      value: t("days", { count: streak }),
      text: t("progressStreakHelp"),
    },
    {
      label: t("lives"),
      value: `${lives}/5`,
      text: t("progressLivesHelp"),
    },
  ];

  return (
    <main className="progress-page">
      <div className="progress-page__container">
        <section className="progress-hero">
          <div className="progress-hero__copy">
            <p className="progress-hero__eyebrow">{t("dashboard")}</p>
            <h1 className="progress-hero__title">{t("progressTitle")}</h1>
            <p className="progress-hero__subtitle">
              {t("progressSubtitle")}
            </p>
          </div>

          <div className="progress-hero__stats">
            {supportMetrics.map((metric) => (
              <article className="progress-stat" key={metric.label}>
                <span>{metric.label}</span>
                <strong>{metric.value}</strong>
                <small>{metric.text}</small>
              </article>
            ))}
          </div>
        </section>

        <section className="progress-overview">
          <div className="progress-overview__card">
            <p className="progress-overview__label">{t("archiveProgress")}</p>
            <div className="progress-overview__row">
              <h2>{completionRate}%</h2>
              <span>
                {t("worksCompleted", { done: completedWorks.length, total: storyEnabledWorks.length })}
              </span>
            </div>
            <div className="progress-overview__track" aria-hidden="true">
              <div
                className="progress-overview__fill"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>

          <div className="progress-overview__card">
            <p className="progress-overview__label">{t("achievements")}</p>
            <div className="progress-overview__row">
              <h2>{unlockedAchievements}</h2>
              <span>{t("interpretiveMilestonesText")}</span>
            </div>
            <div className="progress-overview__badges">
              {achievements.length > 0 ? (
                achievements.map((achievement) => (
                  <span key={achievement}>{localizeAchievement(achievement)}</span>
                ))
              ) : (
                <span>{t("finishFirstChapter")}</span>
              )}
            </div>
          </div>
        </section>

        <section className="progress-section">
          <div className="progress-section__head">
            <div>
              <p>{t("readingJourney")}</p>
              <h2>{t("activeRuns")}</h2>
            </div>
            <span>{t("inProgressCount", { count: activeStories.length })}</span>
          </div>

          {activeStories.length === 0 ? (
            <div className="progress-empty">
              <h3>{t("noActiveRuns")}</h3>
              <p>{t("noActiveRunsText")}</p>
              <Link to="/explore">{t("openExplore")}</Link>
            </div>
          ) : (
            <div className="progress-cards">
              {activeStories.map((story) => (
                <article key={story.id} className="progress-story-card">
                  <p className="progress-story-card__eyebrow">{t("inProgress")}</p>
                  <h3>{story.title}</h3>
                  <p>
                    {story.author} | {t("chapter", { number: story.chapterNumber })}: {story.chapterTitle}
                  </p>
                  <div className="progress-story-card__meta">
                    <span>
                      {t("sceneOf", { current: story.currentScene, total: story.totalScenes })}
                    </span>
                    <span>{t("xpEarnedValue", { count: story.earnedXp })}</span>
                  </div>
                  <Link to={getChapterPath(story.workId, story.chapterNumber)}>
                    {t("continue")}
                  </Link>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="progress-section">
          <div className="progress-section__head">
            <div>
              <p>{t("readingArchive")}</p>
              <h2>{t("completedRuns")}</h2>
            </div>
            <span>{t("finishedCount", { count: completedWorks.length })}</span>
          </div>

          {completedWorks.length === 0 ? (
            <div className="progress-empty">
              <h3>{t("noCompletedRuns")}</h3>
              <p>{t("noCompletedRunsText")}</p>
            </div>
          ) : (
            <div className="progress-cards">
              {completedWorks.map((work) => {
                const chapters = getChaptersByWorkId(work.id).map(localizeStory);
                const totalXp = chapters.reduce(
                  (sum, chapter) => sum + (storyProgress[chapter.id]?.earnedXp ?? 0),
                  0
                );

                return (
                  <article key={work.id} className="progress-story-card is-complete">
                    <p className="progress-story-card__eyebrow">{t("completed")}</p>
                    <h3>{work.title}</h3>
                    <p>{work.author}</p>
                    <div className="progress-story-card__meta">
                      <span>{work.themes[0]}</span>
                      <span>{t("xpTotal", { count: totalXp })}</span>
                    </div>
                    <Link to={`/reading/${work.id}`}>{t("openWork")}</Link>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <section className="progress-section">
          <div className="progress-section__head">
            <div>
              <p>{t("reflectionLog")}</p>
              <h2>{t("recentChoices")}</h2>
            </div>
            <span>{t("savedCount", { count: Object.keys(reflections).length })}</span>
          </div>

          {reflectionEntries.length === 0 ? (
            <div className="progress-empty">
              <h3>{t("noSavedChoices")}</h3>
              <p>{t("noSavedChoicesText")}</p>
            </div>
          ) : (
            <div className="progress-reflections">
              {reflectionEntries.map(([key, value]) => {
                const [storyId, sceneId] = key.split(":");
                const story = getStoryById(storyId);
                const work = localizedWorks.find(
                  (item) => item.id === (story?.workId ?? storyId)
                );

                return (
                  <article key={key} className="progress-reflection-card">
                    <p className="progress-reflection-card__eyebrow">
                      {work?.title ?? storyId}
                    </p>
                    <h3>{sceneId}</h3>
                    <p>{String(value)}</p>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default Progress;
