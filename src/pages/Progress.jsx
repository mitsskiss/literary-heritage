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

function Progress() {
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

  const storyEnabledWorks = works.filter((work) => hasStoryMode(work.id));

  const completedWorks = storyEnabledWorks.filter((work) =>
    getChaptersByWorkId(work.id).every(
      (chapter) => storyProgress[chapter.id]?.completed
    )
  );
  const activeStories = storyEnabledWorks.flatMap((work) =>
    getChaptersByWorkId(work.id)
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

  return (
    <main className="progress-page">
      <div className="progress-page__container">
        <section className="progress-hero">
          <div className="progress-hero__copy">
            <p className="progress-hero__eyebrow">Your literary journey</p>
            <h1 className="progress-hero__title">Progress that feels alive.</h1>
            <p className="progress-hero__subtitle">
              Track XP, maintain your streak, and see how your story-based reading
              path is unfolding across the archive.
            </p>
          </div>

          <div className="progress-hero__stats">
            <article className="progress-stat">
              <span>XP</span>
              <strong>{xp}</strong>
            </article>
            <article className="progress-stat">
              <span>Level</span>
              <strong>{level}</strong>
            </article>
            <article className="progress-stat">
              <span>Streak</span>
              <strong>{streak} days</strong>
            </article>
            <article className="progress-stat">
              <span>Lives</span>
              <strong>{lives}</strong>
            </article>
          </div>
        </section>

        <section className="progress-overview">
          <div className="progress-overview__card">
            <p className="progress-overview__label">Collection progress</p>
            <div className="progress-overview__row">
              <h2>{completionRate}%</h2>
              <span>
                {completedWorks.length} of {storyEnabledWorks.length} works completed
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
            <p className="progress-overview__label">Achievements</p>
            <div className="progress-overview__badges">
              {achievements.length > 0 ? (
                achievements.map((achievement) => (
                  <span key={achievement}>{achievement}</span>
                ))
              ) : (
                <span>Start your first story</span>
              )}
            </div>
          </div>
        </section>

        <section className="progress-section">
          <div className="progress-section__head">
            <h2>Active stories</h2>
            <span>{activeStories.length} in progress</span>
          </div>

          {activeStories.length === 0 ? (
            <div className="progress-empty">
              <h3>No active stories yet</h3>
              <p>
                Begin one of the story experiences from Explore and your active
                sessions will appear here.
              </p>
              <Link to="/explore">Explore stories</Link>
            </div>
          ) : (
            <div className="progress-cards">
              {activeStories.map((story) => (
                <article key={story.id} className="progress-story-card">
                  <p className="progress-story-card__eyebrow">In progress</p>
                  <h3>{story.title}</h3>
                  <p>
                    {story.author} · Chapter {story.chapterNumber}: {story.chapterTitle}
                  </p>
                  <div className="progress-story-card__meta">
                    <span>
                      Scene {story.currentScene}/{story.totalScenes}
                    </span>
                    <span>{story.earnedXp} XP earned</span>
                  </div>
                  <Link to={getChapterPath(story.workId, story.chapterNumber)}>
                    Continue chapter
                  </Link>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="progress-section">
          <div className="progress-section__head">
            <h2>Completed stories</h2>
            <span>{completedWorks.length} finished</span>
          </div>

          {completedWorks.length === 0 ? (
            <div className="progress-empty">
              <h3>You have not completed a story yet</h3>
              <p>
                Finish one interactive story to start building your archive of completed works.
              </p>
            </div>
          ) : (
            <div className="progress-cards">
              {completedWorks.map((work) => {
                const chapters = getChaptersByWorkId(work.id);
                const totalXp = chapters.reduce(
                  (sum, chapter) => sum + (storyProgress[chapter.id]?.earnedXp ?? 0),
                  0
                );

                return (
                  <article key={work.id} className="progress-story-card is-complete">
                    <p className="progress-story-card__eyebrow">Completed</p>
                    <h3>{work.title}</h3>
                    <p>{work.author}</p>
                    <div className="progress-story-card__meta">
                      <span>{work.themes[0]}</span>
                      <span>{totalXp} XP total</span>
                    </div>
                    <Link to={`/reading/${work.id}`}>Open work</Link>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <section className="progress-section">
          <div className="progress-section__head">
            <h2>Recent reflections</h2>
            <span>{Object.keys(reflections).length} saved</span>
          </div>

          {reflectionEntries.length === 0 ? (
            <div className="progress-empty">
              <h3>No reflections yet</h3>
              <p>
                Quiz answers and interpretive choices will appear here as you move
                through the stories.
              </p>
            </div>
          ) : (
            <div className="progress-reflections">
              {reflectionEntries.map(([key, value]) => {
                const [storyId, sceneId] = key.split(":");
                const story = getStoryById(storyId);
                const work = works.find(
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
