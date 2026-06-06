import { useCallback, useEffect, useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { useAuth } from "../auth/AuthContext";
import { supabase } from "../lib/supabaseClient";
import { useProgressStore } from "../store/useProgressStore";

const SYNC_DEBOUNCE_MS = 1500;

const syncedProgressFields = [
  "xp",
  "level",
  "streak",
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

function warnSync(message, detail) {
  if (!import.meta.env.DEV) return;

  if (detail) {
    console.warn(`[progress-sync] ${message}`, detail);
  } else {
    console.warn(`[progress-sync] ${message}`);
  }
}

function getSafeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function getSafeArray(value) {
  return Array.isArray(value) ? value : [];
}

function countObjectValues(value) {
  return Object.values(getSafeObject(value)).filter((item) => item !== null && item !== undefined).length;
}

function normalizeLanguageActivity(value) {
  const source = getSafeObject(value);

  return ["kk", "ru", "en"].reduce((result, language) => {
    const record = getSafeObject(source[language]);

    result[language] = {
      minutes: Number.isFinite(Number(record.minutes)) ? Math.max(0, Number(record.minutes)) : 0,
      reads: Number.isFinite(Number(record.reads)) ? Math.max(0, Number(record.reads)) : 0,
    };

    return result;
  }, {});
}

function normalizeProgressPayload(value) {
  const progress = getSafeObject(value);

  return {
    xp: Number.isFinite(Number(progress.xp)) ? Number(progress.xp) : 0,
    level: Number.isFinite(Number(progress.level)) ? Number(progress.level) : 1,
    streak: Number.isFinite(Number(progress.streak)) ? Number(progress.streak) : 0,
    lives: Number.isFinite(Number(progress.lives)) ? Number(progress.lives) : 5,
    lastActiveDate: progress.lastActiveDate ?? null,
    completedStories: getSafeArray(progress.completedStories),
    storyProgress: getSafeObject(progress.storyProgress),
    reflections: getSafeObject(progress.reflections),
    achievements: getSafeArray(progress.achievements),
    visitedMap: Boolean(progress.visitedMap),
    favorites: getSafeArray(progress.favorites),
    finalQuizzes: getSafeObject(progress.finalQuizzes),
    readingSessions: getSafeArray(progress.readingSessions),
    dailyActivity: getSafeObject(progress.dailyActivity),
    languageActivity: normalizeLanguageActivity(progress.languageActivity),
    quizTopicStats: getSafeObject(progress.quizTopicStats),
    longestStreak: Number.isFinite(Number(progress.longestStreak))
      ? Math.max(0, Number(progress.longestStreak))
      : 0,
    progressUpdatedAt: progress.progressUpdatedAt ?? null,
    legacyMigrated: Boolean(progress.legacyMigrated),
  };
}

function getProgressRichness(progress) {
  const normalized = normalizeProgressPayload(progress);

  return (
    Math.max(0, normalized.xp) +
    Math.max(0, normalized.streak) +
    normalized.completedStories.length * 20 +
    countObjectValues(normalized.storyProgress) * 16 +
    countObjectValues(normalized.reflections) * 12 +
    normalized.achievements.length * 10 +
    normalized.favorites.length * 6 +
    countObjectValues(normalized.finalQuizzes) * 8 +
    normalized.readingSessions.length * 4 +
    countObjectValues(normalized.dailyActivity) * 6 +
    countObjectValues(normalized.quizTopicStats) * 8 +
    normalized.longestStreak * 3 +
    (normalized.visitedMap ? 4 : 0)
  );
}

function getTimestamp(value) {
  if (!value) return null;

  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? timestamp : null;
}

function createProgressSignature(progress) {
  const normalized = normalizeProgressPayload(progress);

  return JSON.stringify(
    syncedProgressFields.reduce((result, key) => {
      result[key] = normalized[key];
      return result;
    }, {})
  );
}

function chooseProgressToRestore(localProgress, remoteProgress, remoteUpdatedAt) {
  const local = normalizeProgressPayload(localProgress);
  const remote = normalizeProgressPayload({
    ...remoteProgress,
    progressUpdatedAt: remoteProgress?.progressUpdatedAt ?? remoteUpdatedAt ?? null,
  });
  const localRichness = getProgressRichness(local);
  const remoteRichness = getProgressRichness(remote);

  if (remoteRichness === 0 && localRichness > 0) {
    return { source: "local", progress: local };
  }

  if (localRichness === 0 && remoteRichness > 0) {
    return { source: "remote", progress: remote };
  }

  const localUpdatedAt = getTimestamp(local.progressUpdatedAt);
  const remoteProgressUpdatedAt = getTimestamp(remote.progressUpdatedAt) ?? getTimestamp(remoteUpdatedAt);

  if (localUpdatedAt && remoteProgressUpdatedAt && localUpdatedAt !== remoteProgressUpdatedAt) {
    return localUpdatedAt > remoteProgressUpdatedAt
      ? { source: "local", progress: local }
      : { source: "remote", progress: remote };
  }

  if (remoteRichness > localRichness) {
    return { source: "remote", progress: remote };
  }

  return { source: "local", progress: local };
}

async function fetchRemoteProgress(userId) {
  const withUpdatedAt = await supabase
    .from("user_progress")
    .select("progress, updated_at")
    .eq("user_id", userId)
    .maybeSingle();

  if (!withUpdatedAt.error) return withUpdatedAt;

  const withoutUpdatedAt = await supabase
    .from("user_progress")
    .select("progress")
    .eq("user_id", userId)
    .maybeSingle();

  if (!withoutUpdatedAt.error) {
    return {
      ...withoutUpdatedAt,
      data: withoutUpdatedAt.data ? { ...withoutUpdatedAt.data, updated_at: null } : null,
    };
  }

  return withUpdatedAt;
}

export function useProgressSync() {
  const { user, isConfigured } = useAuth();

  const exportProgress = useProgressStore((state) => state.exportProgress);
  const importProgress = useProgressStore((state) => state.importProgress);

  const progressSnapshot = useProgressStore(
    useShallow((state) => ({
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
    }))
  );

  const [lastSyncedAt, setLastSyncedAt] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const hasLoadedRemoteRef = useRef(false);
  const skipNextSaveRef = useRef(false);
  const lastSavedSignatureRef = useRef(null);

  useEffect(() => {
    if (!isConfigured) {
      warnSync("Supabase is not configured; progress will stay local.");
    }
  }, [isConfigured]);

  const syncNow = useCallback(async () => {
    if (!isConfigured || !supabase || !user) return { ok: false };

    setIsSyncing(true);

    const syncedAt = new Date().toISOString();
    const progress = normalizeProgressPayload(exportProgress());
    const progressForRemote = {
      ...progress,
      progressUpdatedAt: progress.progressUpdatedAt ?? syncedAt,
    };
    const progressSignature = createProgressSignature(progress);

    if (lastSavedSignatureRef.current === progressSignature) {
      setIsSyncing(false);
      return { ok: true, skipped: true };
    }

    try {
      const payload = {
        user_id: user.id,
        progress: progressForRemote,
        updated_at: syncedAt,
      };

      let result = await supabase.from("user_progress").upsert(payload, {
        onConflict: "user_id",
      });

      if (result.error) {
        result = await supabase.from("user_progress").upsert(
          {
            user_id: user.id,
            progress: progressForRemote,
          },
          { onConflict: "user_id" }
        );
      }

      if (!result.error) {
        lastSavedSignatureRef.current = progressSignature;
        setLastSyncedAt(syncedAt);
        return { ok: true };
      }

      warnSync("Unable to save progress to Supabase.", result.error);
      return { ok: false, error: result.error };
    } catch (error) {
      warnSync("Progress save failed.", error);
      return { ok: false, error };
    } finally {
      setIsSyncing(false);
    }
  }, [exportProgress, isConfigured, user]);

  useEffect(() => {
    hasLoadedRemoteRef.current = false;
    skipNextSaveRef.current = false;
    lastSavedSignatureRef.current = null;
    setLastSyncedAt(null);
  }, [user?.id]);

  useEffect(() => {
    if (!isConfigured || !supabase || !user || hasLoadedRemoteRef.current) {
      return;
    }

    let isMounted = true;

    async function loadRemoteProgress() {
      const { data, error } = await fetchRemoteProgress(user.id);

      if (!isMounted) return;

      hasLoadedRemoteRef.current = true;

      if (error) {
        warnSync("Unable to restore progress from Supabase.", error);
        return;
      }

      if (data?.progress) {
        const localProgress = normalizeProgressPayload(exportProgress());
        const restoreDecision = chooseProgressToRestore(
          localProgress,
          data.progress,
          data.updated_at
        );

        if (restoreDecision.source === "remote") {
          skipNextSaveRef.current = true;
          importProgress(restoreDecision.progress);
          lastSavedSignatureRef.current = createProgressSignature(restoreDecision.progress);
          setLastSyncedAt(data.updated_at ?? restoreDecision.progress.progressUpdatedAt ?? null);
          return;
        }

        setLastSyncedAt(data.updated_at ?? null);
        await syncNow();
        return;
      }

      try {
        await syncNow();
      } catch (error) {
        warnSync("Initial progress save failed.", error);
      }
    }

    loadRemoteProgress();

    return () => {
      isMounted = false;
    };
  }, [exportProgress, importProgress, isConfigured, syncNow, user]);

  useEffect(() => {
    if (!isConfigured || !user || !hasLoadedRemoteRef.current) {
      return;
    }

    if (skipNextSaveRef.current) {
      skipNextSaveRef.current = false;
      return;
    }

    const progressSignature = createProgressSignature(progressSnapshot);

    if (lastSavedSignatureRef.current === progressSignature) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      syncNow();
    }, SYNC_DEBOUNCE_MS);

    return () => window.clearTimeout(timeoutId);
  }, [isConfigured, user, progressSnapshot, syncNow]);

  return {
    isSyncing,
    lastSyncedAt,
    syncNow,
  };
}
