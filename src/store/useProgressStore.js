import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const STORAGE_KEY = "literary_heritage_state";
const LEGACY_STORAGE_KEY = "literary_progress";
const MAX_LIVES = 5;
const MAX_READING_SESSIONS = 180;
const supportedLanguages = ["kk", "ru", "en"];
const defaultLanguageActivity = {
  kk: { minutes: 0, reads: 0 },
  ru: { minutes: 0, reads: 0 },
  en: { minutes: 0, reads: 0 },
};

function getSafeRecord(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function getSafeArray(value) {
  return Array.isArray(value) ? value : [];
}

function getCompletedStoryIds(storyProgress = {}, completedStories = []) {
  const completedFromProgress = Object.entries(storyProgress)
    .filter(([, value]) => value?.completed)
    .map(([storyId]) => storyId);

  return [...new Set([...(Array.isArray(completedStories) ? completedStories : []), ...completedFromProgress])];
}

function getNowIso() {
  return new Date().toISOString();
}

function getDateKeyFromIso(value = getNowIso()) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return getTodayKey();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getPositiveNumber(value, fallback = 0) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? Math.max(0, numeric) : fallback;
}

function normalizeLanguage(language) {
  return supportedLanguages.includes(language) ? language : null;
}

function normalizeDailyActivity(value) {
  return Object.entries(getSafeRecord(value)).reduce((result, [date, entry]) => {
    const record = getSafeRecord(entry);

    result[date] = {
      minutes: getPositiveNumber(record.minutes),
      reads: getPositiveNumber(record.reads),
      reflections: getPositiveNumber(record.reflections),
      quizzes: getPositiveNumber(record.quizzes),
    };

    return result;
  }, {});
}

function normalizeLanguageActivity(value) {
  const source = getSafeRecord(value);

  return supportedLanguages.reduce((result, language) => {
    const record = getSafeRecord(source[language]);

    result[language] = {
      minutes: getPositiveNumber(record.minutes),
      reads: getPositiveNumber(record.reads),
    };

    return result;
  }, {});
}

function normalizeQuizTopicStats(value) {
  return Object.entries(getSafeRecord(value)).reduce((result, [topic, entry]) => {
    const record = getSafeRecord(entry);
    const correct = getPositiveNumber(record.correct);
    const total = getPositiveNumber(record.total);

    if (topic && total > 0) {
      result[topic] = {
        correct: Math.min(correct, total),
        total,
      };
    }

    return result;
  }, {});
}

function normalizeReadingSessions(value) {
  return getSafeArray(value)
    .map((session) => {
      const record = getSafeRecord(session);
      const createdAt = record.createdAt ?? getNowIso();

      return {
        id: String(record.id ?? `${createdAt}-${record.chapterId ?? record.workId ?? "session"}`),
        storyId: record.storyId ? String(record.storyId) : null,
        workId: record.workId ? String(record.workId) : null,
        chapterId: record.chapterId ? String(record.chapterId) : null,
        minutes: getPositiveNumber(record.minutes),
        language: normalizeLanguage(record.language),
        createdAt,
      };
    })
    .filter((session) => session.minutes > 0)
    .slice(-MAX_READING_SESSIONS);
}

function addDailyActivity(dailyActivity, payload = {}) {
  const date = payload.date ?? getTodayKey();
  const current = normalizeDailyActivity(dailyActivity)[date] ?? {
    minutes: 0,
    reads: 0,
    reflections: 0,
    quizzes: 0,
  };

  return {
    ...normalizeDailyActivity(dailyActivity),
    [date]: {
      minutes: current.minutes + getPositiveNumber(payload.minutes),
      reads: current.reads + getPositiveNumber(payload.reads),
      reflections: current.reflections + getPositiveNumber(payload.reflections),
      quizzes: current.quizzes + getPositiveNumber(payload.quizzes),
    },
  };
}

function addLanguageActivity(languageActivity, language, minutes = 0, reads = 1) {
  const normalizedLanguage = normalizeLanguage(language);
  const currentActivity = normalizeLanguageActivity(languageActivity);

  if (!normalizedLanguage) return currentActivity;

  return {
    ...currentActivity,
    [normalizedLanguage]: {
      minutes: currentActivity[normalizedLanguage].minutes + getPositiveNumber(minutes),
      reads: currentActivity[normalizedLanguage].reads + getPositiveNumber(reads),
    },
  };
}

function addQuizTopicResult(quizTopicStats, topic, correct = 0, total = 1) {
  if (!topic) return normalizeQuizTopicStats(quizTopicStats);

  const stats = normalizeQuizTopicStats(quizTopicStats);
  const current = stats[topic] ?? { correct: 0, total: 0 };
  const nextTotal = getPositiveNumber(total, 1);
  const nextCorrect = Math.min(getPositiveNumber(correct), nextTotal);

  return {
    ...stats,
    [topic]: {
      correct: current.correct + nextCorrect,
      total: current.total + nextTotal,
    },
  };
}

function calculateLongestStreak(dailyActivity) {
  const activeDates = Object.entries(normalizeDailyActivity(dailyActivity))
    .filter(([, activity]) => activity.reads > 0 || activity.minutes > 0)
    .map(([date]) => date)
    .sort();

  if (!activeDates.length) return 0;

  let longest = 1;
  let current = 1;

  for (let index = 1; index < activeDates.length; index += 1) {
    const difference = getDayDifference(activeDates[index - 1], activeDates[index]);

    if (difference === 1) {
      current += 1;
      longest = Math.max(longest, current);
    } else if (difference > 1) {
      current = 1;
    }
  }

  return longest;
}

function sanitizeStateShape(state = {}) {
  const storyProgress = getSafeRecord(state.storyProgress);
  const completedStories = getCompletedStoryIds(storyProgress, state.completedStories);
  const readingSessions = normalizeReadingSessions(state.readingSessions);
  const dailyActivity = normalizeDailyActivity(state.dailyActivity);
  const languageActivity = normalizeLanguageActivity(state.languageActivity);
  const quizTopicStats = normalizeQuizTopicStats(state.quizTopicStats);

  return {
    ...state,
    completedStories,
    storyProgress,
    reflections: getSafeRecord(state.reflections),
    achievements: getSafeArray(state.achievements),
    visitedMap: state.visitedMap ?? false,
    favorites: getSafeArray(state.favorites),
    finalQuizzes: getSafeRecord(state.finalQuizzes),
    readingSessions,
    dailyActivity,
    languageActivity,
    quizTopicStats,
    longestStreak: Math.max(
      getPositiveNumber(state.longestStreak),
      calculateLongestStreak(dailyActivity)
    ),
    progressUpdatedAt: state.progressUpdatedAt ?? null,
  };
}

function getTodayKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getDayDifference(previousDate, nextDate) {
  const previous = new Date(`${previousDate}T00:00:00`);
  const next = new Date(`${nextDate}T00:00:00`);
  const msInDay = 1000 * 60 * 60 * 24;
  return Math.round((next - previous) / msInDay);
}

function getLevelFromXp(xp) {
  return Math.floor(xp / 120) + 1;
}

function buildAchievements({ xp, completedStories, reflections }) {
  const achievements = [];

  if (xp >= 1) achievements.push("First Discovery");
  if (completedStories.length >= 1) achievements.push("Story Seeker");
  if (completedStories.length >= 2) achievements.push("Theme Explorer");
  if (Object.keys(reflections).length >= 3) achievements.push("Reflection Writer");
  if (xp >= 180) achievements.push("Heritage Keeper");

  return achievements;
}

function applyDailyActivity(state) {
  const today = getTodayKey();

  if (!state.lastActiveDate) {
    return {
      ...state,
      lastActiveDate: today,
      streak: 1,
    };
  }

  if (state.lastActiveDate === today) {
    return state;
  }

  const difference = getDayDifference(state.lastActiveDate, today);

  if (difference === 1) {
    return {
      ...state,
      lastActiveDate: today,
      streak: state.streak + 1,
    };
  }

  return {
    ...state,
    lastActiveDate: today,
    streak: 1,
  };
}

function ensureStoryState(storyProgress, storyId) {
  if (storyProgress[storyId]) {
    const existing = storyProgress[storyId];

    return {
      ...existing,
      currentSceneIndex: Number(existing.currentSceneIndex) || 0,
      maxSceneIndex: Math.max(
        Number(existing.maxSceneIndex) || 0,
        Number(existing.currentSceneIndex) || 0
      ),
      choices: existing.choices ?? {},
      quizzes: existing.quizzes ?? {},
    };
  }

  return {
    currentSceneIndex: 0,
    maxSceneIndex: 0,
    completed: false,
    earnedXp: 0,
    choices: {},
    quizzes: {},
  };
}

function createUpdatedState(baseState) {
  const normalizedBaseState = sanitizeStateShape(baseState);
  const nextState = applyDailyActivity(normalizedBaseState);
  const level = getLevelFromXp(nextState.xp);
  const achievements = buildAchievements(nextState);

  return {
    ...nextState,
    level,
    achievements,
    progressUpdatedAt: getNowIso(),
  };
}

const progressStateKeys = [
  "xp",
  "streak",
  "level",
  "lives",
  "lastActiveDate",
  "completedStories",
  "storyProgress",
  "reflections",
  "achievements",
  "visitedMap",
  "favorites",
  "finalQuizzes",
  "readingSessions",
  "dailyActivity",
  "languageActivity",
  "quizTopicStats",
  "longestStreak",
  "progressUpdatedAt",
  "legacyMigrated",
];

function pickProgressState(state) {
  return progressStateKeys.reduce((result, key) => {
    result[key] = state[key];
    return result;
  }, {});
}

export const useProgressStore = create(
  persist(
    (set, get) => ({
      xp: 0,
      streak: 0,
      level: 1,
      lives: MAX_LIVES,
      lastActiveDate: null,
      completedStories: [],
      storyProgress: {},
      reflections: {},
      achievements: [],
      visitedMap: false,
      favorites: [],
      finalQuizzes: {},
      readingSessions: [],
      dailyActivity: {},
      languageActivity: defaultLanguageActivity,
      quizTopicStats: {},
      longestStreak: 0,
      progressUpdatedAt: null,
      legacyMigrated: false,

      migrateLegacyProgress: () => {
        if (get().legacyMigrated || typeof window === "undefined") return;

        const raw = window.localStorage.getItem(LEGACY_STORAGE_KEY);

        if (!raw) {
          set({ legacyMigrated: true });
          return;
        }

        try {
          const parsed = JSON.parse(raw);
          const reflections = parsed.answers ?? {};
          const migratedState = createUpdatedState({
            ...get(),
            xp: Math.max(get().xp, Object.keys(reflections).length * 8),
            reflections: {
              ...reflections,
              ...get().reflections,
            },
            legacyMigrated: true,
          });

          set(migratedState);
        } catch {
          set({ legacyMigrated: true });
        }
      },

      ensureStory: (storyId) => {
        set((state) => {
          if (state.storyProgress[storyId]) return state;

          return {
            ...state,
            progressUpdatedAt: getNowIso(),
            storyProgress: {
              ...state.storyProgress,
              [storyId]: ensureStoryState(state.storyProgress, storyId),
            },
          };
        });
      },

      recordChoice: (storyId, sceneId, choiceId, xpGain = 0) => {
        set((state) => {
          const storyState = ensureStoryState(state.storyProgress, storyId);

          if (storyState.choices[sceneId]) return state;

          const updatedStoryState = {
            ...storyState,
            maxSceneIndex: Math.max(
              storyState.maxSceneIndex ?? storyState.currentSceneIndex ?? 0,
              storyState.currentSceneIndex ?? 0
            ),
            choices: {
              ...storyState.choices,
              [sceneId]: choiceId,
            },
            earnedXp: storyState.earnedXp + xpGain,
          };

          return createUpdatedState({
            ...state,
            xp: state.xp + xpGain,
            storyProgress: {
              ...state.storyProgress,
              [storyId]: updatedStoryState,
            },
          });
        });
      },

      recordQuizAnswer: (
        storyId,
        sceneId,
        optionId,
        isCorrect,
        rewardXp = 0,
        reflectionText = ""
      ) => {
        set((state) => {
          const storyState = ensureStoryState(state.storyProgress, storyId);

          if (storyState.quizzes[sceneId]) return state;

          const xpGain = isCorrect ? rewardXp : 0;
          const updatedStoryState = {
            ...storyState,
            maxSceneIndex: Math.max(
              storyState.maxSceneIndex ?? storyState.currentSceneIndex ?? 0,
              storyState.currentSceneIndex ?? 0
            ),
            quizzes: {
              ...storyState.quizzes,
              [sceneId]: {
                optionId,
                isCorrect,
              },
            },
            earnedXp: storyState.earnedXp + xpGain,
          };

          return createUpdatedState({
            ...state,
            xp: state.xp + xpGain,
            lives: isCorrect ? state.lives : Math.max(0, state.lives - 1),
            dailyActivity: addDailyActivity(state.dailyActivity, {
              reflections: 1,
              quizzes: 1,
            }),
            reflections: {
              ...state.reflections,
              [`${storyId}:${sceneId}`]: reflectionText || optionId,
            },
            storyProgress: {
              ...state.storyProgress,
              [storyId]: updatedStoryState,
            },
          });
        });
      },

      advanceScene: (storyId, totalScenes) => {
        set((state) => {
          const storyState = ensureStoryState(state.storyProgress, storyId);
          const nextIndex = Math.min(
            storyState.currentSceneIndex + 1,
            totalScenes - 1
          );

          return {
            ...state,
            progressUpdatedAt: getNowIso(),
            storyProgress: {
              ...state.storyProgress,
              [storyId]: {
                ...storyState,
                currentSceneIndex: nextIndex,
                maxSceneIndex: Math.max(storyState.maxSceneIndex ?? 0, nextIndex),
              },
            },
          };
        });
      },

      goToStoryScene: (storyId, sceneIndex, totalScenes) => {
        set((state) => {
          const storyState = ensureStoryState(state.storyProgress, storyId);
          const safeIndex = Math.max(
            0,
            Math.min(Number(sceneIndex) || 0, Math.max(0, totalScenes - 1))
          );

          return {
            ...state,
            progressUpdatedAt: getNowIso(),
            storyProgress: {
              ...state.storyProgress,
              [storyId]: {
                ...storyState,
                currentSceneIndex: safeIndex,
                maxSceneIndex: Math.max(storyState.maxSceneIndex ?? 0, safeIndex),
              },
            },
          };
        });
      },

      completeStory: (storyId, bonusXp = 0) => {
        set((state) => {
          const storyState = ensureStoryState(state.storyProgress, storyId);

          if (storyState.completed) return state;

          return createUpdatedState({
            ...state,
            xp: state.xp + bonusXp,
            lives: Math.min(MAX_LIVES, state.lives + 1),
            storyProgress: {
              ...state.storyProgress,
              [storyId]: {
                ...storyState,
                completed: true,
                earnedXp: storyState.earnedXp + bonusXp,
              },
            },
          });
        });
      },

      resetStory: (storyId) => {
        set((state) => {
          const nextStoryProgress = { ...state.storyProgress };
          delete nextStoryProgress[storyId];

          const nextFinalQuizzes = { ...state.finalQuizzes };
          delete nextFinalQuizzes[storyId];

          return {
            ...state,
            progressUpdatedAt: getNowIso(),
            completedStories: state.completedStories.filter((id) => id !== storyId),
            storyProgress: {
              ...nextStoryProgress,
              [storyId]: ensureStoryState(nextStoryProgress, storyId),
            },
            finalQuizzes: nextFinalQuizzes,
          };
        });
      },

      toggleFavorite: (item) => {
        set((state) => {
          const exists = state.favorites.some(
            (favorite) => favorite.id === item.id && favorite.type === item.type
          );

          return {
            ...state,
            progressUpdatedAt: getNowIso(),
            favorites: exists
              ? state.favorites.filter(
                  (favorite) =>
                    !(favorite.id === item.id && favorite.type === item.type)
                )
              : [
                  {
                    ...item,
                    savedAt: new Date().toISOString(),
                  },
                  ...state.favorites,
                ],
          };
        });
      },

      recordFinalQuizAnswer: (storyId, questionId, optionId, isCorrect) => {
        set((state) => {
          const currentQuiz = state.finalQuizzes[storyId] ?? {};

          if (currentQuiz[questionId]) return state;

          return createUpdatedState({
            ...state,
            xp: state.xp + (isCorrect ? 10 : 0),
            lives: isCorrect ? state.lives : Math.max(0, state.lives - 1),
            dailyActivity: addDailyActivity(state.dailyActivity, {
              quizzes: 1,
            }),
            finalQuizzes: {
              ...state.finalQuizzes,
              [storyId]: {
                ...currentQuiz,
                [questionId]: {
                  optionId,
                  isCorrect,
                },
              },
            },
          });
        });
      },

      recordReadingSession: (payload = {}) =>
        set((state) => {
          const createdAt = payload.createdAt ?? getNowIso();
          const rawMinutes = Number(payload.minutes);

          if (!Number.isFinite(rawMinutes) || rawMinutes <= 0) return state;

          const hasUsefulContext = Boolean(payload.storyId || payload.workId || payload.chapterId);

          if (!hasUsefulContext) return state;

          const minutes = Math.min(180, Math.max(1, Math.round(rawMinutes)));
          const language = normalizeLanguage(payload.language);
          const existingSessions = normalizeReadingSessions(state.readingSessions);
          const session = {
            id: String(
              payload.id ??
                `${createdAt}-${payload.chapterId ?? payload.storyId ?? payload.workId ?? "reading"}`
            ),
            storyId: payload.storyId ? String(payload.storyId) : null,
            workId: payload.workId ? String(payload.workId) : null,
            chapterId: payload.chapterId ? String(payload.chapterId) : null,
            minutes,
            language,
            createdAt,
          };
          const createdAtTime = new Date(createdAt).getTime();
          const hasNearDuplicate = existingSessions.some((item) => {
            const itemTime = new Date(item.createdAt).getTime();

            return (
              item.chapterId === session.chapterId &&
              item.language === session.language &&
              Number.isFinite(itemTime) &&
              Number.isFinite(createdAtTime) &&
              Math.abs(itemTime - createdAtTime) < 30_000
            );
          });

          if (hasNearDuplicate) return state;

          const dailyActivity = addDailyActivity(state.dailyActivity, {
            date: getDateKeyFromIso(createdAt),
            minutes,
            reads: 1,
          });

          return createUpdatedState({
            ...state,
            readingSessions: [...existingSessions, session].slice(-MAX_READING_SESSIONS),
            dailyActivity,
            languageActivity: addLanguageActivity(state.languageActivity, language, minutes, 1),
            longestStreak: Math.max(
              getPositiveNumber(state.longestStreak),
              calculateLongestStreak(dailyActivity)
            ),
          });
        }),

      recordDailyActivity: (payload = {}) =>
        set((state) => {
          const dailyActivity = addDailyActivity(state.dailyActivity, payload);

          return createUpdatedState({
            ...state,
            dailyActivity,
            longestStreak: Math.max(
              getPositiveNumber(state.longestStreak),
              calculateLongestStreak(dailyActivity)
            ),
          });
        }),

      recordLanguageActivity: (language, minutes = 0) =>
        set((state) =>
          createUpdatedState({
            ...state,
            languageActivity: addLanguageActivity(state.languageActivity, language, minutes, 1),
          })
        ),

      recordQuizTopicResult: (topic, correct, total = 1) =>
        set((state) =>
          createUpdatedState({
            ...state,
            quizTopicStats: addQuizTopicResult(state.quizTopicStats, topic, correct, total),
          })
        ),

      updateLongestStreak: () =>
        set((state) => ({
          longestStreak: calculateLongestStreak(state.dailyActivity),
          progressUpdatedAt: getNowIso(),
        })),

      normalizeAnalyticsFields: () =>
        set((state) => ({
          ...sanitizeStateShape(state),
          progressUpdatedAt: getNowIso(),
        })),

      markMapVisited: () =>
        set({
          visitedMap: true,
          progressUpdatedAt: getNowIso(),
        }),

      resetAllProgress: () =>
        set({
          xp: 0,
          streak: 0,
          level: 1,
          lives: MAX_LIVES,
          lastActiveDate: null,
          completedStories: [],
          storyProgress: {},
          reflections: {},
          achievements: [],
          visitedMap: false,
          favorites: [],
          finalQuizzes: {},
          readingSessions: [],
          dailyActivity: {},
          languageActivity: defaultLanguageActivity,
          quizTopicStats: {},
          longestStreak: 0,
          progressUpdatedAt: getNowIso(),
          legacyMigrated: true,
        }),

      exportProgress: () => pickProgressState(get()),

      importProgress: (nextProgress) =>
        set((state) =>
          sanitizeStateShape({
            ...state,
            ...nextProgress,
          })
        ),
    }),
    {
      name: STORAGE_KEY,
      version: 2,
      storage: createJSONStorage(() => localStorage),
      migrate: (persistedState) => sanitizeStateShape(persistedState),
      partialize: (state) => ({
        xp: state.xp,
        streak: state.streak,
        level: state.level,
        lives: state.lives,
        lastActiveDate: state.lastActiveDate,
        completedStories: state.completedStories,
        storyProgress: state.storyProgress,
        reflections: state.reflections,
        achievements: state.achievements,
        visitedMap: state.visitedMap,
        favorites: state.favorites,
        finalQuizzes: state.finalQuizzes,
        readingSessions: state.readingSessions,
        dailyActivity: state.dailyActivity,
        languageActivity: state.languageActivity,
        quizTopicStats: state.quizTopicStats,
        longestStreak: state.longestStreak,
        progressUpdatedAt: state.progressUpdatedAt,
        legacyMigrated: state.legacyMigrated,
      }),
    }
  )
);
