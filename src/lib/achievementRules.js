import { getChaptersByWorkId, hasStoryMode } from "../data/stories";
import { works } from "../data/works";

export function getReadingRows(storyProgress = {}, localizeWork = (work) => work) {
  return works
    .filter((work) => hasStoryMode(work.id))
    .map((work) => {
      const chapters = getChaptersByWorkId(work.id);
      const completed = chapters.filter(
        (chapter) => storyProgress[chapter.id]?.completed
      ).length;
      const started = chapters.some((chapter) => storyProgress[chapter.id]);
      const localizedWork = localizeWork(work);

      return {
        id: work.id,
        title: localizedWork.title,
        image: work.image,
        total: chapters.length,
        completed,
        started,
        percent: chapters.length ? Math.round((completed / chapters.length) * 100) : 0,
      };
    })
    .filter((row) => row.total > 0);
}

export function getReadingStats(storyProgress = {}, localizeWork) {
  const rows = getReadingRows(storyProgress, localizeWork);
  const completedChapters = rows.reduce((sum, row) => sum + row.completed, 0);
  const startedWorks = rows.filter((row) => row.started || row.completed > 0).length;
  const completedWorks = rows.filter((row) => row.completed === row.total).length;

  return {
    rows,
    completedChapters,
    startedWorks,
    completedWorks,
  };
}

export function getAchievementDefinitions({
  xp = 0,
  level = 1,
  streak = 0,
  storyProgress = {},
  reflections = {},
  visitedMap = false,
}) {
  const { completedChapters, completedWorks } = getReadingStats(storyProgress);

  return [
    {
      id: "firstChapter",
      icon: "□",
      unlocked: completedChapters >= 1,
    },
    {
      id: "expert",
      icon: "◎",
      unlocked: Object.keys(reflections).length >= 2 || xp >= 80,
    },
    {
      id: "literator",
      icon: "▰",
      unlocked: level >= 5,
    },
    {
      id: "researcher",
      icon: "◇",
      unlocked: visitedMap,
    },
    {
      id: "threeDay",
      icon: "3",
      unlocked: streak >= 3,
    },
    {
      id: "weekKnowledge",
      icon: "7",
      unlocked: streak >= 7,
    },
    {
      id: "bookworm",
      icon: "◆",
      unlocked: completedChapters >= 5,
    },
    {
      id: "finalist",
      icon: "✓",
      unlocked: completedWorks >= 1,
    },
  ];
}

