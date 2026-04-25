import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const STORAGE_KEY = "literary_heritage_state";
const LEGACY_STORAGE_KEY = "literary_progress";
const MAX_LIVES = 5;

function getCompletedStoryIds(storyProgress = {}) {
  return Object.entries(storyProgress)
    .filter(([, value]) => value?.completed)
    .map(([storyId]) => storyId);
}

function sanitizeStateShape(state) {
  const storyProgress = state.storyProgress ?? {};
  const completedStories = getCompletedStoryIds(storyProgress);

  return {
    ...state,
    completedStories,
    storyProgress,
    reflections: state.reflections ?? {},
    achievements: state.achievements ?? [],
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
  if (storyProgress[storyId]) return storyProgress[storyId];

  return {
    currentSceneIndex: 0,
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
  };
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
            storyProgress: {
              ...state.storyProgress,
              [storyId]: {
                ...storyState,
                currentSceneIndex: nextIndex,
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
          legacyMigrated: true,
        }),
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
        legacyMigrated: state.legacyMigrated,
      }),
    }
  )
);
