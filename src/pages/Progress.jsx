import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { literaryEpochs } from "../data/epochs";
import { readingRoutes } from "../data/routes";
import { works } from "../data/works";
import {
  getChapterPath,
  getChaptersByWorkId,
  hasStoryMode,
} from "../data/stories";
import { useProgressStore } from "../store/useProgressStore";
import { useI18n } from "../i18n/useI18n";
import "./Progress.css";

const progressDashboardFallback = {
  overallCompletion: 42,
  worksRead: 18,
  worksTotal: 43,
  // Demo study-time values until study activity is connected to Supabase/store.
  hoursStudied: "36h 24m",
  monthHours: "8h 17m",
  reflectionsWritten: 24,
  monthReflections: 6,
  currentEra: "Early 20th Century",
  currentEraNote: "Continue exploring the birth of modern Kazakh literature.",
  activeRoute: {
    title: "Early 20th Century Classics",
    years: "1900-1930s",
    routeId: "alash-voice",
    progress: 68,
    completed: 7,
    total: 11,
  },
  chapters: [
    { title: "Abai. Kara Sozder (Selections)", value: 100 },
    { title: "Mukhtar Auezov. The Path of Abai", value: 76 },
    { title: "Ilyas Zhansugurov. Kulager", value: 40 },
    { title: "Saken Seifullin. Kyzyl Kyrlysha", value: 15 },
    { title: "Beyimbet Mailin. Shyra", value: 0 },
  ],
  // Demo quiz metrics until quiz aggregate analytics are available.
  quizAccuracy: 84,
  quizCount: 38,
  // Demo activity chart values until dated study sessions are available.
  activityUnit: "Hours per day",
  activityPoints: [
    0.8, 0.8, 0.7, 1.6, 1.8, 2.0, 1.6, 1.2, 1.0, 1.3, 1.6, 1.8, 2.6, 3.3, 2.6,
    1.5, 2.2, 2.1, 1.8, 2.0, 2.6, 2.3, 2.0, 1.1, 0.8,
  ],
  activityLabels: ["Apr 20", "Apr 27", "May 4", "May 11", "May 18"],
  activityHighlight: {
    index: 13,
    label: "May 15",
    value: "2h 45m",
  },
  achievements: [
    { title: "First Steps", text: "Read your first work", date: "Apr 10", icon: "trophy" },
    { title: "Explorer", text: "Completed a literary epoch", date: "Apr 28", icon: "compass" },
    { title: "Dedicated Reader", text: "7-day reading streak", date: "May 9", icon: "flame" },
    { title: "Deep Thinker", text: "Wrote 10 reflections", date: "May 12", icon: "feather" },
  ],
  nextWork: {
    workId: "dulatuly-wake-up-kazakh",
    routeId: "alash-voice",
    author: "Mirzhakyp Dulatov",
    title: "Oyan, Qazaq!",
    year: "1913",
    genre: "Poetry",
  },
  // Demo skill diagnostics until assessment tags are connected to stored results.
  strengthen: [
    { label: "Literary Analysis", value: 42 },
    { label: "Historical Context", value: 58 },
    { label: "Poetic Forms", value: 37 },
    { label: "Philosophical Themes", value: 61 },
  ],
  // Demo language mastery until per-language reading metrics are available.
  languageMastery: [
    { label: "Kazakh", value: 88, tone: "green" },
    { label: "Russian", value: 63, tone: "gold" },
    { label: "English", value: 41, tone: "green" },
  ],
  // fallback pattern until daily activity history is implemented
  streakDays: [
    0, 0, 0, 0, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1,
    1, 0, 1, 1, 15, 0, 0,
    0, 0, 1, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0,
  ],
  longestStreak: 21,
};

const activityMetricOptions = [
  { id: "hours", labelKey: "progressDashboardHoursPerDay" },
  { id: "reads", labelKey: "progressDashboardReadsPerDay" },
  { id: "quizzes", labelKey: "progressDashboardQuizzesPerDay" },
];

const timelineStageDefinitions = [
  {
    id: "pre-enlightenment",
    titleKey: "progressDashboardEraPre",
    subtitleKey: "progressDashboardEraPreSubtitle",
    range: "0-5%",
    icon: "tower",
    epochIds: ["oral-heritage", "zhyrau-poetry"],
  },
  {
    id: "enlightenment",
    titleKey: "progressDashboardEraEnlightenment",
    subtitleKey: "progressDashboardEraEnlightenmentSubtitle",
    range: "6-25%",
    icon: "book",
    epochIds: ["kazakh-enlightenment"],
  },
  {
    id: "early-20",
    titleKey: "progressDashboardEraEarly20",
    subtitleKey: "progressDashboardEraEarly20Subtitle",
    range: "26-50%",
    icon: "tree",
    epochIds: ["alash"],
  },
  {
    id: "soviet",
    titleKey: "progressDashboardEraSovietYears",
    subtitleKey: "progressDashboardEraSovietSubtitle",
    range: "51-75%",
    icon: "mountain",
    epochIds: ["soviet-kazakh"],
  },
  {
    id: "independence",
    titleKey: "progressDashboardEraIndependence",
    subtitleKey: "progressDashboardEraIndependenceSubtitle",
    range: "76-100%",
    icon: "hand",
    epochIds: ["independence-modern"],
  },
];

function getSafeRecord(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function getSafeArray(value) {
  return Array.isArray(value) ? value : [];
}

function countStoredItems(value) {
  if (Array.isArray(value)) return value.length;
  if (value && typeof value === "object") {
    return Object.values(value).filter((item) => item !== null && item !== undefined).length;
  }
  return null;
}

function getNumericValue(value, fallback) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function safePercent(value, fallback = 0) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return fallback;
  return Math.max(0, Math.min(100, Math.round(numeric)));
}

function getCompletedStoryIds(storyProgress, completedStories) {
  const completedFromArray = getSafeArray(completedStories);
  const completedFromProgress = Object.entries(getSafeRecord(storyProgress))
    .filter(([, state]) => state?.completed)
    .map(([storyId]) => storyId);

  return [...new Set([...completedFromArray, ...completedFromProgress])];
}

function getChapterCompletionValue(chapter, chapterState) {
  if (chapterState?.completed) return 100;

  const sceneCount = Array.isArray(chapter?.scenes) ? chapter.scenes.length : 0;
  const currentSceneIndex = Number(chapterState?.currentSceneIndex);

  if (!Number.isFinite(currentSceneIndex) || sceneCount <= 0) return 0;

  return safePercent((Math.min(currentSceneIndex + 1, sceneCount) / sceneCount) * 100);
}

function getQuizRecordStats(record) {
  if (!record || typeof record !== "object") return null;

  const directPercent = [record.scorePercent, record.percentage, record.score]
    .map((value) => Number(value))
    .find((value) => Number.isFinite(value) && value >= 0);

  if (Number.isFinite(directPercent)) {
    return { correct: safePercent(directPercent), total: 100, count: 1 };
  }

  const correctAnswers = Number(record.correctAnswers ?? record.correct);
  const totalQuestions = Number(record.totalQuestions ?? record.total);

  if (
    Number.isFinite(correctAnswers) &&
    Number.isFinite(totalQuestions) &&
    totalQuestions > 0
  ) {
    return {
      correct: Math.max(0, correctAnswers),
      total: Math.max(0, totalQuestions),
      count: 1,
    };
  }

  if (typeof record.isCorrect === "boolean") {
    return { correct: record.isCorrect ? 1 : 0, total: 1, count: 1 };
  }

  return null;
}

function getQuizStats(finalQuizzes, fallback) {
  const stack = Object.values(getSafeRecord(finalQuizzes));
  let correct = 0;
  let total = 0;
  let count = 0;

  while (stack.length) {
    const item = stack.pop();
    const itemStats = getQuizRecordStats(item);

    if (itemStats) {
      correct += itemStats.correct;
      total += itemStats.total;
      count += itemStats.count;
      continue;
    }

    if (item && typeof item === "object") {
      stack.push(...Object.values(item));
    }
  }

  if (total <= 0 || count <= 0) {
    return {
      accuracy: fallback.quizAccuracy,
      count: fallback.quizCount,
      isFallback: true,
    };
  }

  return {
    accuracy: safePercent((correct / total) * 100),
    count,
    isFallback: false,
  };
}

function getWorkChapterProgress(work, storyProgress) {
  const chapters = getChaptersByWorkId(work.id);

  if (!chapters.length) return null;

  const values = chapters.map((chapter) =>
    getChapterCompletionValue(chapter, storyProgress[chapter.id])
  );

  return safePercent(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function getActiveRouteStats({ storyEnabledWorks, storyProgress, activeRouteWork, fallback }) {
  const routeId =
    activeRouteWork?.routeId ??
    storyEnabledWorks
      .map((work) => ({
        routeId: work.routeId,
        progress: getWorkChapterProgress(work, storyProgress) ?? 0,
      }))
      .filter((item) => item.routeId && item.progress > 0)
      .sort((left, right) => right.progress - left.progress)[0]?.routeId ??
    fallback.routeId;

  const routeWorks = storyEnabledWorks.filter((work) => work.routeId === routeId);

  if (!routeId || !routeWorks.length) {
    return {
      routeId: fallback.routeId,
      progress: fallback.progress,
      completed: fallback.completed,
      total: fallback.total,
      isFallback: true,
    };
  }

  const progressValues = routeWorks
    .map((work) => getWorkChapterProgress(work, storyProgress))
    .filter((value) => value !== null);

  if (!progressValues.length || progressValues.every((value) => value === 0)) {
    return {
      routeId,
      progress: fallback.progress,
      completed: fallback.completed,
      total: fallback.total,
      isFallback: true,
    };
  }

  return {
    routeId,
    progress: safePercent(
      progressValues.reduce((sum, value) => sum + value, 0) / progressValues.length
    ),
    completed: progressValues.filter((value) => value >= 100).length,
    total: routeWorks.length,
    isFallback: false,
  };
}

function getChapterCompletionItems({ storyEnabledWorks, storyProgress, localizeStory, fallback }) {
  const items = storyEnabledWorks.flatMap((work, workIndex) =>
    getChaptersByWorkId(work.id).map((chapter, chapterIndex) => {
      const localizedChapter = localizeStory(chapter);
      const state = storyProgress[chapter.id];
      const value = getChapterCompletionValue(chapter, state);

      return {
        title: localizedChapter?.chapterTitle ?? localizedChapter?.shortTitle ?? work.title,
        value,
        sortGroup: state && !state.completed ? 0 : state?.completed ? 1 : 2,
        sortIndex: workIndex * 100 + chapterIndex,
      };
    })
  );

  if (!items.length) return fallback;

  return items
    .sort((left, right) => left.sortGroup - right.sortGroup || right.value - left.value || left.sortIndex - right.sortIndex)
    .slice(0, 5)
    .map(({ title, value }) => ({ title, value: safePercent(value) }));
}

function getRecommendedWork({ localizedWorks, storyEnabledWorks, storyProgress, fallback }) {
  const fallbackWork =
    localizedWorks.find((work) => work.id === fallback.workId) ?? null;
  const activeRouteId =
    storyEnabledWorks.find((work) =>
      getChaptersByWorkId(work.id).some((chapter) => storyProgress[chapter.id] && !storyProgress[chapter.id]?.completed)
    )?.routeId ?? fallbackWork?.routeId ?? fallback.routeId;
  const unreadStoryWork = storyEnabledWorks.find((work) => {
    const chapters = getChaptersByWorkId(work.id);
    return (
      work.routeId === activeRouteId &&
      chapters.length > 0 &&
      !chapters.every((chapter) => storyProgress[chapter.id]?.completed)
    );
  });
  const unreadAnyWork = localizedWorks.find((work) => {
    const chapters = getChaptersByWorkId(work.id);
    return chapters.length
      ? !chapters.every((chapter) => storyProgress[chapter.id]?.completed)
      : !storyProgress[work.id]?.completed;
  });
  const selected = unreadStoryWork ?? unreadAnyWork ?? fallbackWork;

  if (!selected) return fallback;

  return {
    workId: selected.id,
    routeId: selected.routeId ?? fallback.routeId,
    author: selected.author ?? fallback.author,
    title: selected.title ?? fallback.title,
    year: selected.year ? String(selected.year) : fallback.year,
    genre: selected.genre ?? fallback.genre,
    image: getBestWorkImage(selected),
    imageAlt: `${selected.title ?? fallback.title} - ${selected.author ?? fallback.author}`,
  };
}

function getBestWorkImage(work) {
  if (!work || typeof work !== "object") return null;

  return (
    work.cover ??
    work.coverUrl ??
    work.image ??
    work.imageUrl ??
    work.portrait ??
    work.authorImage ??
    work.thumbnail ??
    null
  );
}

function getRouteForEpochStage(stage) {
  const epoch = literaryEpochs.find((item) => stage.epochIds.includes(item.id));
  const epochWorkIds = new Set(epoch?.works ?? []);
  const route = readingRoutes.find((item) =>
    getSafeArray(item.works).some((workId) => epochWorkIds.has(workId))
  );

  if (route?.id) return `/route/${route.id}`;
  if (epoch?.id) return `/works?epoch=${epoch.id}`;
  return "/epochs";
}

function getFallbackTimelineIndex(overallCompletion) {
  if (overallCompletion <= 5) return 0;
  if (overallCompletion <= 25) return 1;
  if (overallCompletion <= 50) return 2;
  if (overallCompletion <= 75) return 3;
  return 4;
}

function getTimelineItems({ localizedWorks, storyProgress, overallCompletion, t }) {
  const workById = new Map(localizedWorks.map((work) => [work.id, work]));
  const items = timelineStageDefinitions.map((stage) => {
    const stageWorks = literaryEpochs
      .filter((epoch) => stage.epochIds.includes(epoch.id))
      .flatMap((epoch) => epoch.works)
      .map((workId) => workById.get(workId))
      .filter(Boolean);
    const progressValues = stageWorks
      .map((work) => {
        const chapterProgress = getWorkChapterProgress(work, storyProgress);
        if (chapterProgress !== null) return chapterProgress;
        return storyProgress[work.id]?.completed ? 100 : 0;
      })
      .filter((value) => Number.isFinite(value));
    const progress = progressValues.length
      ? safePercent(progressValues.reduce((sum, value) => sum + value, 0) / progressValues.length)
      : 0;

    return {
      ...stage,
      title: t(stage.titleKey),
      subtitle: t(stage.subtitleKey),
      to: getRouteForEpochStage(stage),
      progress,
    };
  });
  const hasEpochProgress = items.some((item) => item.progress > 0);
  const activeEpochIndex = items.findIndex((item) => item.progress > 0 && item.progress < 100);
  const lastCompleteEpochIndex = items.reduce(
    (result, item, index) => (item.progress >= 100 ? index : result),
    -1
  );
  const currentIndex = hasEpochProgress
    ? activeEpochIndex >= 0
      ? activeEpochIndex
      : Math.min(lastCompleteEpochIndex + 1, items.length - 1)
    : getFallbackTimelineIndex(overallCompletion);
  const normalizedCurrentIndex = Math.max(0, currentIndex);

  return items.map((item, index) => ({
    ...item,
    isCurrent: index === normalizedCurrentIndex,
    isComplete: hasEpochProgress ? item.progress >= 100 : index < normalizedCurrentIndex,
  }));
}

function getDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatMinutes(totalMinutes) {
  const minutes = Math.max(0, Math.round(Number(totalMinutes) || 0));
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours <= 0) return `${remainingMinutes}m`;
  return `${hours}h ${String(remainingMinutes).padStart(2, "0")}m`;
}

function getDailyActivityEntry(dailyActivity, dateKey) {
  const entry = getSafeRecord(dailyActivity)[dateKey];

  return {
    minutes: getNumericValue(entry?.minutes, 0),
    reads: getNumericValue(entry?.reads, 0),
    reflections: getNumericValue(entry?.reflections, 0),
    quizzes: getNumericValue(entry?.quizzes, 0),
  };
}

function hasRealDailyActivity(dailyActivity) {
  return Object.values(getSafeRecord(dailyActivity)).some((entry) => {
    const activity = getSafeRecord(entry);
    return (
      getNumericValue(activity.minutes, 0) > 0 ||
      getNumericValue(activity.reads, 0) > 0 ||
      getNumericValue(activity.reflections, 0) > 0 ||
      getNumericValue(activity.quizzes, 0) > 0
    );
  });
}

function getHoursStats({ readingSessions, dailyActivity, fallback }) {
  const sessions = getSafeArray(readingSessions);
  const hasSessions = sessions.some((session) => getNumericValue(session?.minutes, 0) > 0);
  const hasDaily = hasRealDailyActivity(dailyActivity);

  if (!hasSessions && !hasDaily) {
    // fallback until reading session tracking is implemented
    return {
      hoursStudied: fallback.hoursStudied,
      monthHours: fallback.monthHours,
      totalMinutes: 0,
      isFallback: true,
    };
  }

  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const dailyEntries = Object.entries(getSafeRecord(dailyActivity));
  const totalMinutes = hasDaily
    ? dailyEntries.reduce((sum, [, entry]) => sum + getNumericValue(entry?.minutes, 0), 0)
    : sessions.reduce((sum, session) => sum + getNumericValue(session?.minutes, 0), 0);
  const monthMinutes = hasDaily
    ? dailyEntries
        .filter(([date]) => date.startsWith(currentMonth))
        .reduce((sum, [, entry]) => sum + getNumericValue(entry?.minutes, 0), 0)
    : sessions
        .filter((session) => String(session?.createdAt ?? "").startsWith(currentMonth))
        .reduce((sum, session) => sum + getNumericValue(session?.minutes, 0), 0);

  return {
    hoursStudied: formatMinutes(totalMinutes),
    monthHours: formatMinutes(monthMinutes),
    totalMinutes,
    isFallback: false,
  };
}

function formatActivityMetricValue(value, metric, formatters = {}) {
  const count = Math.round(value);

  if (metric === "hours") return formatMinutes(value * 60);
  if (metric === "reads" && formatters.reads) return formatters.reads(count);
  if (metric === "quizzes" && formatters.quizzes) return formatters.quizzes(count);
  return String(count);
}

function getActivityMetricValue(entry, metric) {
  if (metric === "reads") return getNumericValue(entry.reads, 0);
  if (metric === "quizzes") return getNumericValue(entry.quizzes, 0);
  return getNumericValue(entry.minutes, 0) / 60;
}

function getActivityChartData({ dailyActivity, fallbackLabels, fallback, metric, formatters }) {
  if (!hasRealDailyActivity(dailyActivity)) {
    const fallbackPoints =
      metric === "hours"
        ? fallback.activityPoints
        : Array.from({ length: fallback.activityPoints.length }, () => 0);
    const highlightIndex =
      metric === "hours" ? fallback.activityHighlight.index : fallbackPoints.length - 1;

    return {
      points: fallbackPoints,
      labels: fallbackLabels,
      highlight: {
        index: highlightIndex,
        label: fallback.activityHighlight.label,
        value:
          metric === "hours"
            ? fallback.activityHighlight.value
            : formatActivityMetricValue(fallbackPoints[highlightIndex] ?? 0, metric, formatters),
      },
      isFallback: true,
    };
  }

  const now = new Date();
  const days = Array.from({ length: 30 }, (_, index) => {
    const date = new Date(now);
    date.setDate(now.getDate() - (29 - index));
    return date;
  });
  const points = days.map((date) =>
    getActivityMetricValue(getDailyActivityEntry(dailyActivity, getDateKey(date)), metric)
  );
  const maxIndex = points.reduce(
    (bestIndex, value, index) => (value >= points[bestIndex] ? index : bestIndex),
    0
  );
  const labelFormatter = new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" });

  return {
    points,
    labels: [0, 7, 14, 21, 29].map((index) => labelFormatter.format(days[index])),
    highlight: {
      index: maxIndex,
      label: labelFormatter.format(days[maxIndex]),
      value: formatActivityMetricValue(points[maxIndex], metric, formatters),
    },
    isFallback: false,
  };
}

function isReadingActivity(entry) {
  return getNumericValue(entry?.minutes, 0) > 0 || getNumericValue(entry?.reads, 0) > 0;
}

function getDayDifference(previousDate, nextDate) {
  const previous = new Date(`${previousDate}T00:00:00`);
  const next = new Date(`${nextDate}T00:00:00`);
  const msInDay = 1000 * 60 * 60 * 24;
  return Math.round((next - previous) / msInDay);
}

function getReadingStreakStats(dailyActivity, fallbackCurrent, fallbackLongest) {
  const activeDates = Object.entries(getSafeRecord(dailyActivity))
    .filter(([, entry]) => isReadingActivity(entry))
    .map(([date]) => date)
    .sort();

  if (!activeDates.length) {
    return {
      current: fallbackCurrent,
      longest: fallbackLongest,
      isFallback: true,
    };
  }

  let longest = 1;
  let running = 1;

  for (let index = 1; index < activeDates.length; index += 1) {
    const difference = getDayDifference(activeDates[index - 1], activeDates[index]);

    if (difference === 1) {
      running += 1;
      longest = Math.max(longest, running);
    } else if (difference > 1) {
      running = 1;
    }
  }

  let current = 0;
  const activeDateSet = new Set(activeDates);
  const cursor = new Date();

  while (activeDateSet.has(getDateKey(cursor))) {
    current += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return {
    current,
    longest,
    isFallback: false,
  };
}

function getStreakCalendarData({ dailyActivity, fallbackDays, fallbackCurrent, fallbackLongest }) {
  if (!hasRealDailyActivity(dailyActivity)) {
    // fallback pattern until daily activity history is implemented
    return {
      days: fallbackDays.map((day, index) => ({
        label: day ? "\u2713" : "",
        isActive: Boolean(day),
        isFeatured: day === 15 && index === 18,
        title: day ? "Demo reading activity" : "No reading activity",
      })),
      current: fallbackCurrent,
      longest: fallbackLongest,
      isFallback: true,
    };
  }

  const now = new Date();
  const todayKey = getDateKey(now);
  const dateLabelFormatter = new Intl.DateTimeFormat(undefined, { month: "long", day: "numeric" });
  const days = Array.from({ length: 35 }, (_, index) => {
    const date = new Date(now);
    date.setDate(now.getDate() - (34 - index));
    const dateKey = getDateKey(date);
    const entry = getDailyActivityEntry(dailyActivity, dateKey);
    const isActive = isReadingActivity(entry);

    return {
      label: isActive ? "\u2713" : "",
      isActive,
      isFeatured: dateKey === todayKey,
      title: `${dateLabelFormatter.format(date)}: ${formatMinutes(entry.minutes)}, ${entry.reads} reads, ${entry.quizzes} quizzes`,
    };
  });
  const streakStats = getReadingStreakStats(dailyActivity, 0, 0);

  return {
    days,
    current: streakStats.current,
    longest: streakStats.longest,
    isFallback: false,
  };
}

function getLanguageMasteryItems({ languageActivity, fallback, labels }) {
  const activity = getSafeRecord(languageActivity);
  const rows = [
    { code: "kk", label: labels.kk, tone: "green" },
    { code: "ru", label: labels.ru, tone: "gold" },
    { code: "en", label: labels.en, tone: "green" },
  ].map((item) => {
    const record = getSafeRecord(activity[item.code]);
    return {
      ...item,
      minutes: getNumericValue(record.minutes, 0),
      reads: getNumericValue(record.reads, 0),
    };
  });
  const total = rows.reduce((sum, item) => sum + item.minutes + item.reads, 0);

  if (total <= 0) return fallback;

  return rows.map((item) => ({
    label: item.label,
    tone: item.tone,
    value: safePercent(((item.minutes + item.reads) / total) * 100),
  }));
}

function getStrengthenItems({ quizTopicStats, fallback, labels }) {
  const topics = [
    { key: "literaryAnalysis", label: labels.literaryAnalysis },
    { key: "historicalContext", label: labels.historicalContext },
    { key: "poeticForms", label: labels.poeticForms },
    { key: "philosophicalThemes", label: labels.philosophicalThemes },
  ];
  const rows = topics.map((topic) => {
    const stats = getSafeRecord(quizTopicStats)[topic.key];
    const total = getNumericValue(stats?.total, 0);
    const correct = getNumericValue(stats?.correct, 0);

    return {
      label: topic.label,
      total,
      value: total > 0 ? safePercent(100 - (correct / total) * 100) : 0,
    };
  });

  if (!rows.some((row) => row.total > 0)) return fallback;

  return rows.map(({ label, value }) => ({ label, value }));
}

function getFirstReadingRoute(storyEnabledWorks, allWorks) {
  const firstStoryWork = storyEnabledWorks.find((work) => getChaptersByWorkId(work.id).length > 0);
  const firstChapter = firstStoryWork ? getChaptersByWorkId(firstStoryWork.id)[0] : null;

  if (firstStoryWork && firstChapter) {
    return getChapterPath(firstStoryWork.id, firstChapter.chapterNumber);
  }

  const firstWork = allWorks.find((work) => work?.id);
  return firstWork ? `/reading/${firstWork.id}` : "/works";
}

function getCurrentReadingRoute(activeStories, firstReadingRoute) {
  const activeStory = activeStories[0];

  if (!activeStory) return firstReadingRoute;

  return getChapterPath(activeStory.workId, activeStory.chapterNumber);
}

function scrollToProgressTarget(targetId) {
  if (typeof document === "undefined") return;

  document.getElementById(targetId)?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

function Progress() {
  const { t, localizeAchievement, localizeStory, localizeWorks } = useI18n();
  const [activityMetric, setActivityMetric] = useState("hours");
  const {
    xp,
    level,
    streak,
    completedStories,
    storyProgress,
    reflections,
    achievements,
    finalQuizzes,
    readingSessions,
    dailyActivity,
    languageActivity,
    quizTopicStats,
    migrateLegacyProgress,
  } = useProgressStore();

  useEffect(() => {
    migrateLegacyProgress();
  }, [migrateLegacyProgress]);

  const safeStoryProgress = getSafeRecord(storyProgress);
  const safeAchievements = getSafeArray(achievements);
  const completedStoryIds = getCompletedStoryIds(safeStoryProgress, completedStories);
  const localizedWorks = localizeWorks(getSafeArray(works));
  const hasRealWorks = localizedWorks.length > 0;
  const worksTotal =
    hasRealWorks ? localizedWorks.length : progressDashboardFallback.worksTotal;
  const storyEnabledWorks = localizedWorks.filter((work) => hasStoryMode(work.id));
  const completedWorks = storyEnabledWorks.filter((work) =>
    getChaptersByWorkId(work.id).every((chapter) => safeStoryProgress[chapter.id]?.completed)
  );
  const completedWorkIdsFromStories = new Set(
    completedStoryIds.flatMap((storyId) =>
      storyEnabledWorks
        .filter((work) => getChaptersByWorkId(work.id).some((chapter) => chapter.id === storyId))
        .map((work) => work.id)
    )
  );
  const worksRead =
    completedWorks.length > 0
      ? completedWorks.length
      : completedWorkIdsFromStories.size > 0
        ? completedWorkIdsFromStories.size
        : completedStoryIds.length;
  const overallCompletion =
    hasRealWorks && worksTotal > 0
      ? Math.round((Math.min(worksRead, worksTotal) / worksTotal) * 100)
      : progressDashboardFallback.overallCompletion;
  const startedStories = Object.values(safeStoryProgress).filter(Boolean);
  const activeStories = storyEnabledWorks.flatMap((work) =>
    getChaptersByWorkId(work.id)
      .map(localizeStory)
      .filter((chapter) => {
        const chapterState = safeStoryProgress[chapter.id];
        return chapterState && !chapterState.completed;
      })
      .map((chapter) => ({
        id: chapter.id,
        workId: work.id,
        chapterNumber: chapter.chapterNumber,
        title: work.title,
        chapterTitle: chapter.chapterTitle,
        currentScene: getNumericValue(safeStoryProgress[chapter.id]?.currentSceneIndex, 0) + 1,
        totalScenes: chapter.scenes.length,
      }))
  );
  const reflectionCount = countStoredItems(reflections) ?? progressDashboardFallback.reflectionsWritten;
  const firstReadingRoute = getFirstReadingRoute(storyEnabledWorks, localizedWorks);
  const currentReadingRoute = getCurrentReadingRoute(activeStories, firstReadingRoute);
  const activeRouteWork = localizedWorks.find((work) => work.id === activeStories[0]?.workId);
  const quizStats = getQuizStats(finalQuizzes, progressDashboardFallback);
  const translatedActivityLabels = [
    t("progressDashboardApr20"),
    t("progressDashboardApr27"),
    t("progressDashboardMay4"),
    t("progressDashboardMay11"),
    t("progressDashboardMay18"),
  ];
  const hoursStats = getHoursStats({
    readingSessions,
    dailyActivity,
    fallback: progressDashboardFallback,
  });
  const activityChartData = getActivityChartData({
    dailyActivity,
    fallbackLabels: translatedActivityLabels,
    fallback: progressDashboardFallback,
    metric: activityMetric,
    formatters: {
      reads: (count) => t("progressDashboardReadsTooltip", { count }),
      quizzes: (count) => t("progressDashboardQuizzesTooltip", { count }),
    },
  });
  const streakCalendarData = getStreakCalendarData({
    dailyActivity,
    fallbackDays: progressDashboardFallback.streakDays,
    fallbackCurrent: getNumericValue(streak, 12),
    fallbackLongest: progressDashboardFallback.longestStreak,
  });
  const activeRouteStats = getActiveRouteStats({
    storyEnabledWorks,
    storyProgress: safeStoryProgress,
    activeRouteWork,
    fallback: progressDashboardFallback.activeRoute,
  });
  const routeDetailsRoute = activeRouteStats.routeId ? `/route/${activeRouteStats.routeId}` : "/explore";
  const timelineItems = getTimelineItems({
    localizedWorks,
    storyProgress: safeStoryProgress,
    overallCompletion,
    t,
  });
  const currentTimelineItem =
    timelineItems.find((item) => item.isCurrent) ?? timelineItems[0];
  const calendarLabel = streakCalendarData.isFallback
    ? t("progressDashboardMay2025")
    : new Intl.DateTimeFormat(undefined, { month: "long", year: "numeric" }).format(new Date());
  const recommendedWork = getRecommendedWork({
    localizedWorks,
    storyEnabledWorks,
    storyProgress: safeStoryProgress,
    fallback: progressDashboardFallback.nextWork,
  });
  const recommendedReadingRoute = recommendedWork.workId
    ? `/reading/${recommendedWork.workId}`
    : firstReadingRoute;
  const fallbackAchievementRows = [
    {
      title: t("progressDashboardAchievementFirstSteps"),
      text: t("progressDashboardAchievementFirstStepsText"),
      date: t("progressDashboardApr10"),
      icon: "trophy",
    },
    {
      title: t("progressDashboardAchievementExplorer"),
      text: t("progressDashboardAchievementExplorerText"),
      date: t("progressDashboardApr28"),
      icon: "compass",
    },
    {
      title: t("progressDashboardAchievementDedicatedReader"),
      text: t("progressDashboardAchievementDedicatedReaderText"),
      date: t("progressDashboardMay9"),
      icon: "flame",
    },
    {
      title: t("progressDashboardAchievementDeepThinker"),
      text: t("progressDashboardAchievementDeepThinkerText"),
      date: t("progressDashboardMay12"),
      icon: "feather",
    },
  ];
  const realAchievementRows = safeAchievements.slice(0, 4).map((achievement, index) => ({
    title: localizeAchievement(achievement),
    text: index === 0 ? t("progressDashboardUnlockedCurrent") : t("progressDashboardMilestone"),
    date: t("progressDashboardUnlocked"),
    icon: progressDashboardFallback.achievements[index]?.icon ?? "trophy",
  }));
  const visibleAchievements = [...realAchievementRows, ...fallbackAchievementRows].slice(0, 4);
  const chapterCompletionRows = getChapterCompletionItems({
    storyEnabledWorks,
    storyProgress: safeStoryProgress,
    localizeStory,
    fallback: progressDashboardFallback.chapters,
  });
  const translatedStrengthenFallback = [
    t("progressDashboardLiteraryAnalysis"),
    t("progressDashboardHistoricalContext"),
    t("progressDashboardPoeticForms"),
    t("progressDashboardPhilosophicalThemes"),
  ].map((label, index) => ({
    ...progressDashboardFallback.strengthen[index],
    label,
  }));
  const translatedLanguageMasteryFallback = [
    t("progressDashboardKazakh"),
    t("progressDashboardRussian"),
    t("progressDashboardEnglish"),
  ].map((label, index) => ({
    ...progressDashboardFallback.languageMastery[index],
    label,
  }));
  const translatedStrengthen = getStrengthenItems({
    quizTopicStats,
    fallback: translatedStrengthenFallback,
    labels: {
      literaryAnalysis: t("progressDashboardLiteraryAnalysis"),
      historicalContext: t("progressDashboardHistoricalContext"),
      poeticForms: t("progressDashboardPoeticForms"),
      philosophicalThemes: t("progressDashboardPhilosophicalThemes"),
    },
  });
  const translatedLanguageMastery = getLanguageMasteryItems({
    languageActivity,
    fallback: translatedLanguageMasteryFallback,
    labels: {
      kk: t("progressDashboardKazakh"),
      ru: t("progressDashboardRussian"),
      en: t("progressDashboardEnglish"),
    },
  });

  return (
    <main className="progress-page">
      <div className="progress-dashboard">
        <header className="progress-dashboard__header">
          <p>{t("progressDashboardLabel")}</p>
          <h1>{t("progressDashboardTitle")}</h1>
          <span>{t("progressDashboardSubtitle")}</span>
        </header>

        <section className="progress-stats-grid" aria-label={t("progressDashboardSummaryLabel")}>
          <StatCard
            label={t("progressDashboardOverallCompletion")}
            value={`${overallCompletion}%`}
            text={t("progressDashboardSteadyProgress")}
            action={t("progressDashboardViewDetails")}
            onAction={() => scrollToProgressTarget("progress-details")}
            ringValue={overallCompletion}
          />
          <StatCard
            label={t("progressDashboardWorksRead")}
            value={worksRead}
            text={t("progressDashboardWorksTotal", { total: worksTotal })}
            action={t("progressDashboardViewLibrary")}
            actionTo="/works"
            icon="book"
          />
          <StatCard
            label={t("progressDashboardHoursStudied")}
            value={hoursStats.hoursStudied}
            text={t("progressDashboardThisMonthValue", { value: hoursStats.monthHours })}
            action={t("progressDashboardViewActivity")}
            onAction={() => scrollToProgressTarget("progress-activity")}
            icon="clock"
          />
          <StatCard
            label={t("progressDashboardReflectionsWritten")}
            value={reflectionCount}
            text={t("progressDashboardThisMonthValue", { value: progressDashboardFallback.monthReflections })}
            action={t("progressDashboardViewJournal")}
            actionTo="/profile"
            icon="feather"
          />
        </section>

        <section className="progress-dashboard__grid" id="progress-details">
          <div className="progress-dashboard__main">
            <section className="progress-panel progress-panel--timeline">
              <div className="progress-panel__head">
                <h2>{t("progressDashboardJourneyTitle")}</h2>
              </div>
              <JourneyTimeline items={timelineItems} />
              <div className="progress-timeline-note">
                <p>
                  {t("progressDashboardYouAreHere")}: {currentTimelineItem.title}.{" "}
                  {t("progressDashboardJourneyNote")}
                </p>
                <Link className="progress-action-button" to="/epochs">{t("progressDashboardViewAllEpochs")}</Link>
              </div>
            </section>

            <div className="progress-dashboard__triple">
              <section className="progress-panel progress-panel--route">
                <div className="progress-panel__head">
                  <h2>
                    <Icon name="route" />
                    {t("progressDashboardActiveRoute")}
                  </h2>
                </div>
                <h3>{t("progressDashboardActiveRouteTitle")}</h3>
                <p>{progressDashboardFallback.activeRoute.years}</p>
                <ProgressBar value={activeRouteStats.progress} label={t("progressDashboardLabel")} />
                <small>
                  {t("progressDashboardWorksCompleted", {
                    completed: activeRouteStats.completed,
                    total: activeRouteStats.total,
                  })}
                </small>
                <div className="progress-card-action-row">
                  <Link className="progress-action-button progress-button" to={currentReadingRoute}>
                    {t("continueReading")} <span aria-hidden="true">-&gt;</span>
                  </Link>
                  <Link className="progress-action-link progress-link" to={routeDetailsRoute}>
                    {t("progressDashboardRouteDetails")}
                  </Link>
                </div>
              </section>

              <section className="progress-panel progress-panel--chapters">
                <div className="progress-panel__head">
                  <h2>{t("progressDashboardChapterCompletion")}</h2>
                </div>
                <div className="progress-list">
                  {chapterCompletionRows.map((chapter) => (
                    <ProgressBar key={chapter.title} value={chapter.value} label={chapter.title} compact />
                  ))}
                </div>
              </section>

              <section className="progress-panel progress-panel--accuracy">
                <div className="progress-panel__head">
                  <h2>{t("progressDashboardQuizAccuracy")}</h2>
                </div>
                <ProgressRing value={quizStats.accuracy} size={126} strokeWidth={10}>
                  <strong>{quizStats.accuracy}%</strong>
                  <span>{t("progressDashboardAverage")}</span>
                </ProgressRing>
                <p>{t("progressDashboardBasedOnQuizzes", { count: quizStats.count })}</p>
                <Link className="progress-action-button progress-button progress-button--wide" to={currentReadingRoute}>
                  {t("progressDashboardReviewQuizzes")} <span aria-hidden="true">-&gt;</span>
                </Link>
              </section>
            </div>

            <div className="progress-dashboard__double">
              <section className="progress-panel progress-panel--activity" id="progress-activity">
                <div className="progress-panel__head progress-panel__head--split">
                  <h2>{t("progressDashboardStudyActivity")} <span>({t("progressDashboardLast30Days")})</span></h2>
                  <select
                    className="progress-activity-select"
                    value={activityMetric}
                    aria-label={t("progressDashboardActivityMetric")}
                    onChange={(event) => setActivityMetric(event.target.value)}
                  >
                    {activityMetricOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {t(option.labelKey)}
                      </option>
                    ))}
                  </select>
                </div>
                <ActivityChart
                  points={activityChartData.points}
                  labels={activityChartData.labels}
                  highlight={
                    activityChartData.isFallback
                      ? {
                          ...activityChartData.highlight,
                          label: t("progressDashboardMay15"),
                        }
                      : activityChartData.highlight
                  }
                />
              </section>

              <section className="progress-panel progress-panel--streak">
                <div className="progress-panel__head progress-panel__head--split">
                  <h2>{t("progressDashboardReadingStreak")}</h2>
                  <span>{calendarLabel}</span>
                </div>
                <StreakCalendar
                  days={streakCalendarData.days}
                  streak={streakCalendarData.current}
                  longest={streakCalendarData.longest}
                  t={t}
                />
              </section>
            </div>
          </div>

          <aside className="progress-dashboard__side">
            <section className="progress-panel progress-side-card" id="progress-achievements">
              <div className="progress-panel__head progress-panel__head--split">
                <h2>{t("progressDashboardAchievements")}</h2>
                <button
                  className="progress-action-link"
                  type="button"
                  onClick={() => scrollToProgressTarget("progress-achievements")}
                >
                  {t("progressDashboardViewAll")} <span aria-hidden="true">-&gt;</span>
                </button>
              </div>
              <div className="progress-achievements">
                {visibleAchievements.map((achievement) => (
                  <article key={`${achievement.title}-${achievement.date}`}>
                    <span className="progress-achievements__icon">
                      <Icon name={achievement.icon} />
                    </span>
                    <div>
                      <strong>{achievement.title}</strong>
                      <small>{achievement.text}</small>
                    </div>
                    <time>{achievement.date}</time>
                  </article>
                ))}
              </div>
            </section>

            <section className="progress-panel progress-side-card progress-recommendation">
              <div className="progress-panel__head progress-panel__head--split">
                <h2>{t("progressDashboardNextRecommendedWork")}</h2>
                <Icon name="bookmark" />
              </div>
              <div className="progress-recommendation__body">
                {recommendedWork.image ? (
                  <img
                    className="progress-book-cover"
                    src={recommendedWork.image}
                    alt={recommendedWork.imageAlt}
                  />
                ) : (
                  <div className="progress-book-cover" aria-hidden="true">
                    <span />
                  </div>
                )}
                <div>
                  <p>{recommendedWork.author}</p>
                  <h3>{recommendedWork.title}</h3>
                  <div className="progress-tags">
                    <span>{recommendedWork.year}</span>
                    <span>
                      {recommendedWork.genre === progressDashboardFallback.nextWork.genre
                        ? t("progressDashboardPoetry")
                        : recommendedWork.genre}
                    </span>
                  </div>
                </div>
              </div>
              <Link className="progress-action-button progress-button progress-button--wide" to={recommendedReadingRoute}>
                {t("startReading")} <span aria-hidden="true">-&gt;</span>
              </Link>
            </section>

            <section className="progress-panel progress-side-card">
              <div className="progress-panel__head progress-panel__head--split">
                <h2>{t("progressDashboardAreasToStrengthen")}</h2>
                <Link className="progress-action-link" to="/explore">{t("progressDashboardViewAll")} <span aria-hidden="true">-&gt;</span></Link>
              </div>
              <div className="progress-list">
                {translatedStrengthen.map((item) => (
                  <ProgressBar key={item.label} value={item.value} label={item.label} compact />
                ))}
              </div>
            </section>

            <section className="progress-panel progress-side-card" id="progress-languages">
              <div className="progress-panel__head progress-panel__head--split">
                <h2>{t("progressDashboardLanguageMastery")}</h2>
                <Link className="progress-action-link" to={firstReadingRoute}>{t("progressDashboardCompareLanguages")} <span aria-hidden="true">-&gt;</span></Link>
              </div>
              <div className="progress-list">
                {translatedLanguageMastery.map((item) => (
                  <ProgressBar
                    key={item.label}
                    value={item.value}
                    label={item.label}
                    tone={item.tone}
                    compact
                  />
                ))}
              </div>
            </section>
          </aside>
        </section>

        <footer className="progress-dashboard__footer">
          <span>{t("progressDashboardFooterBrand")}</span>
          <span>
            {t("progressDashboardFooterStats", {
              level,
              xp,
              records: startedStories.length,
              reflections: reflectionCount,
              percent: overallCompletion,
            })}
          </span>
        </footer>
      </div>
    </main>
  );
}

function StatCard({ label, value, text, action, actionTo, onAction, icon, ringValue }) {
  return (
    <article className="progress-stat-card">
      {typeof ringValue === "number" ? (
        <ProgressRing value={ringValue} size={102} strokeWidth={8}>
          <strong>{value}</strong>
        </ProgressRing>
      ) : (
        <span className="progress-stat-card__icon">
          <Icon name={icon} />
        </span>
      )}
      <div>
        <strong>{value}</strong>
        <h2>{label}</h2>
        <p>{text}</p>
        {actionTo ? (
          <Link className="progress-action-link" to={actionTo}>
            {action} <span aria-hidden="true">-&gt;</span>
          </Link>
        ) : (
          <button className="progress-action-link" type="button" onClick={onAction}>
            {action} <span aria-hidden="true">-&gt;</span>
          </button>
        )}
      </div>
    </article>
  );
}

function ProgressRing({ value, size = 108, strokeWidth = 8, children }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (Math.max(0, Math.min(value, 100)) / 100) * circumference;

  return (
    <div className="progress-ring" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle
          className="progress-ring__track"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <circle
          className="progress-ring__value"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
        />
      </svg>
      <div className="progress-ring__content">{children}</div>
    </div>
  );
}

function ProgressBar({ value, label, tone = "green", compact = false }) {
  return (
    <div className={`progress-bar ${compact ? "is-compact" : ""}`} data-tone={tone}>
      <div className="progress-bar__top">
        <span>{label}</span>
        <strong>{value}%</strong>
      </div>
      <div className="progress-bar__track" aria-hidden="true">
        <i style={{ width: `${Math.max(0, Math.min(value, 100))}%` }} />
      </div>
    </div>
  );
}

function JourneyTimeline({ items }) {
  return (
    <ol className="progress-timeline">
      {items.map((era, index) => (
        <li
          key={`${era.id}-${index}`}
          className={`${era.isCurrent ? "is-current" : ""} ${era.isComplete ? "is-complete" : ""}`}
        >
          <Link to={era.to} className="progress-timeline__link">
            <span className="progress-timeline__marker">
              <span className="progress-timeline__node">
                <Icon name={era.icon} />
              </span>
            </span>
            <span className="progress-timeline__label">
              <strong>{era.title}</strong>
              <small>{era.subtitle}</small>
              <em>{era.range}</em>
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
}

function ActivityChart({ points, labels, highlight }) {
  const width = 560;
  const height = 172;
  const paddingX = 28;
  const paddingY = 18;
  const max = Math.max(...points, 4);
  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;
  const plotted = points.map((point, index) => {
    const x = paddingX + (index / Math.max(points.length - 1, 1)) * chartWidth;
    const y = paddingY + chartHeight - (point / max) * chartHeight;
    return { x, y, value: point };
  });
  const path = plotted.map((point) => `${point.x},${point.y}`).join(" ");
  const highlighted = plotted[highlight.index] ?? plotted[0];

  return (
    <div className="progress-activity-chart">
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((line) => {
          const y = paddingY + (line / 4) * chartHeight;
          return <line key={line} x1={paddingX} x2={width - paddingX} y1={y} y2={y} />;
        })}
        <polyline className="progress-activity-chart__area" points={`${path}`} />
        <polyline className="progress-activity-chart__line" points={path} />
        {plotted.map((point, index) => (
          <circle key={`${point.x}-${index}`} cx={point.x} cy={point.y} r={index === highlight.index ? 5 : 3.7} />
        ))}
      </svg>
      <div
        className="progress-activity-chart__tooltip"
        style={{ left: `${(highlighted.x / width) * 100}%`, top: `${(highlighted.y / height) * 100}%` }}
      >
        <strong>{highlight.label}</strong>
        <span>{highlight.value}</span>
      </div>
      <div className="progress-activity-chart__labels">
        {labels.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
    </div>
  );
}

function StreakCalendar({ days, streak, longest, t }) {
  const weekDays = [
    t("progressDashboardWeekMon"),
    t("progressDashboardWeekTue"),
    t("progressDashboardWeekWed"),
    t("progressDashboardWeekThu"),
    t("progressDashboardWeekFri"),
    t("progressDashboardWeekSat"),
    t("progressDashboardWeekSun"),
  ];

  return (
    <div className="progress-streak">
      <div className="progress-streak__summary">
        <Icon name="flame" />
        <strong>{streak}</strong>
        <span>{t("progressDashboardDays")}</span>
        <small>{t("progressDashboardLongestStreak", { count: longest })}</small>
      </div>
      <div className="progress-streak__calendar">
        <div className="progress-streak__weekdays">
          {weekDays.map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>
        <div className="progress-streak__days">
          {days.map((day, index) => (
            <span
              key={`${day.label}-${index}`}
              className={day.isActive ? "is-active" : ""}
              data-featured={day.isFeatured || undefined}
              title={day.title}
              aria-label={day.title}
              tabIndex={0}
            >
              {day.label}
            </span>
          ))}
        </div>
      </div>
      <p>{t("progressDashboardNextMilestone", { count: 15 })}</p>
    </div>
  );
}

function Icon({ name }) {
  const icons = {
    book: (
      <>
        <path d="M4.5 5.5h6.2a3.2 3.2 0 0 1 3.2 3.2v11.8a3.2 3.2 0 0 0-3.2-3.2H4.5Z" />
        <path d="M13.9 8.7a3.2 3.2 0 0 1 3.2-3.2h5.4v11.8h-5.4a3.2 3.2 0 0 0-3.2 3.2Z" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="8.2" />
        <path d="M12 7.4V12l3.2 2" />
      </>
    ),
    feather: (
      <>
        <path d="M20.2 3.8c-7.8.8-12.7 5.5-14.5 14.2l-2 2" />
        <path d="M8 17.8c2.2-.3 4.5-1.6 6.8-3.9 2.2-2.2 4-5.6 5.4-10.1" />
        <path d="M8.2 12.8h5.3" />
      </>
    ),
    route: (
      <>
        <path d="M5 18c3.8-8.4 10.2 4.2 14-7.8" />
        <circle cx="5" cy="18" r="1.8" />
        <circle cx="19" cy="10.2" r="1.8" />
      </>
    ),
    trophy: (
      <>
        <path d="M8 5h8v4.8a4 4 0 0 1-8 0Z" />
        <path d="M8 7H5.5a3 3 0 0 0 3 3" />
        <path d="M16 7h2.5a3 3 0 0 1-3 3" />
        <path d="M12 14v3.5" />
        <path d="M8.8 20h6.4" />
      </>
    ),
    compass: (
      <>
        <circle cx="12" cy="12" r="8.2" />
        <path d="m14.6 7.8-1.5 5.3-4.2 3.1 1.5-5.3Z" />
      </>
    ),
    flame: (
      <>
        <path d="M12.2 21c-3.6 0-6-2.5-6-5.8 0-2.7 1.6-4.4 3.1-5.9.8-.8 1.6-1.7 1.7-2.9 2.8 1.7 4.5 3.8 4.5 6.2.7-.5 1.1-1.4 1.2-2.5 1.2 1.2 2 2.9 2 5.1 0 3.3-2.8 5.8-6.5 5.8Z" />
      </>
    ),
    bookmark: (
      <path d="M7 4.5h10v15l-5-3-5 3Z" />
    ),
    tower: (
      <>
        <path d="M12 4.5 8 10h8Z" />
        <path d="M9.4 10v8.5" />
        <path d="M14.6 10v8.5" />
        <path d="M7.5 19h9" />
      </>
    ),
    tree: (
      <>
        <path d="M12 4.5v15" />
        <path d="M12 9.5 7.8 6.8" />
        <path d="M12 12.8 17 9.4" />
        <path d="M8.4 19h7.2" />
      </>
    ),
    mountain: (
      <path d="m4 18 5.2-8.2 3.4 5.1 2.3-3.3L20 18Z" />
    ),
    hand: (
      <>
        <path d="M7.3 13.2V8.5a1.2 1.2 0 0 1 2.4 0v4.1" />
        <path d="M9.7 12V6.8a1.2 1.2 0 0 1 2.4 0v5" />
        <path d="M12.1 12.2V7.8a1.2 1.2 0 0 1 2.4 0v5" />
        <path d="M14.5 13.3V10a1.2 1.2 0 0 1 2.4 0v4.2c0 4.4-2.3 6.6-5.2 6.6-2.1 0-3.4-.9-4.7-2.4l-2-2.4a1.3 1.3 0 0 1 1.9-1.8l1.3 1.1" />
      </>
    ),
  };

  return (
    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
      {icons[name] ?? icons.book}
    </svg>
  );
}

export default Progress;
