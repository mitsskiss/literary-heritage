import { useCallback, useEffect, useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { useAuth } from "../auth/AuthContext";
import { supabase } from "../lib/supabaseClient";
import { useProgressStore } from "../store/useProgressStore";

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
      legacyMigrated: state.legacyMigrated,
    }))
  );

  const [lastSyncedAt, setLastSyncedAt] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const hasLoadedRemoteRef = useRef(false);

  const syncNow = useCallback(async () => {
    if (!isConfigured || !supabase || !user) return { ok: false };

    setIsSyncing(true);

    const progress = exportProgress();
    const syncedAt = new Date().toISOString();

    const { error } = await supabase.from("user_progress").upsert(
      {
        user_id: user.id,
        progress,
        updated_at: syncedAt,
      },
      { onConflict: "user_id" }
    );

    setIsSyncing(false);

    if (!error) {
      setLastSyncedAt(syncedAt);
      return { ok: true };
    }

    return { ok: false, error };
  }, [exportProgress, isConfigured, user]);

  useEffect(() => {
    hasLoadedRemoteRef.current = false;
  }, [user?.id]);

  useEffect(() => {
    if (!isConfigured || !supabase || !user || hasLoadedRemoteRef.current) {
      return;
    }

    let isMounted = true;

    async function loadRemoteProgress() {
      const { data, error } = await supabase
        .from("user_progress")
        .select("progress, updated_at")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!isMounted) return;

      hasLoadedRemoteRef.current = true;

      if (!error && data?.progress) {
        importProgress(data.progress);
        setLastSyncedAt(data.updated_at ?? null);
      } else {
        await syncNow();
      }
    }

    loadRemoteProgress();

    return () => {
      isMounted = false;
    };
  }, [importProgress, isConfigured, syncNow, user]);

  useEffect(() => {
    if (!isConfigured || !user || !hasLoadedRemoteRef.current) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      syncNow();
    }, 1200);

    return () => window.clearTimeout(timeoutId);
  }, [isConfigured, user, progressSnapshot, syncNow]);

  return {
    isSyncing,
    lastSyncedAt,
    syncNow,
  };
}