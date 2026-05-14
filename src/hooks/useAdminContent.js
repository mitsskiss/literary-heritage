import { useCallback, useEffect, useState } from "react";
import {
  adminContentEventName,
  adminContentStorageKey,
  emptyAdminContent,
  loadAdminContent,
  saveAdminContent,
} from "../admin/adminContent";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../auth/AuthContext";

const remoteRowId = "main";

export function useAdminContent({ canWrite = false } = {}) {
  const { isConfigured, user } = useAuth();
  const [content, setContent] = useState(() => loadAdminContent());
  const [isRemoteLoading, setIsRemoteLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState("local");
  const [syncError, setSyncError] = useState("");

  useEffect(() => {
    const handleChange = (event) => {
      setContent(event.detail ?? loadAdminContent());
    };

    const handleStorage = () => {
      setContent(loadAdminContent());
    };

    window.addEventListener(adminContentEventName, handleChange);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener(adminContentEventName, handleChange);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  useEffect(() => {
    if (!isConfigured || !supabase) {
      setSyncStatus("local");
      return undefined;
    }

    let isMounted = true;

    async function loadRemoteContent() {
      setIsRemoteLoading(true);
      setSyncError("");

      const { data, error } = await supabase
        .from("admin_content")
        .select("content")
        .eq("id", remoteRowId)
        .maybeSingle();

      if (!isMounted) return;

      if (error) {
        setSyncStatus("local");
        setSyncError(error.message);
        setIsRemoteLoading(false);
        return;
      }

      if (data?.content) {
        saveAdminContent(data.content);
        setContent(loadAdminContent());
        setSyncStatus("remote");
      } else {
        setSyncStatus("remote-empty");
      }

      setIsRemoteLoading(false);
    }

    loadRemoteContent();

    return () => {
      isMounted = false;
    };
  }, [isConfigured]);

  const updateContent = useCallback(async (updater) => {
    let nextContent = emptyAdminContent;

    setContent((current) => {
      nextContent =
        typeof updater === "function" ? updater(current) : updater ?? emptyAdminContent;
      saveAdminContent(nextContent);
      return loadAdminContent();
    });

    if (!isConfigured || !supabase) {
      setSyncStatus("local");
      return { ok: true, remote: false };
    }

    if (!canWrite) {
      setSyncError("Only admins can save shared content.");
      return { ok: false, remote: false };
    }

    setSyncError("");

    const { error } = await supabase.from("admin_content").upsert(
      {
        id: remoteRowId,
        content: nextContent,
        updated_by: user?.id ?? null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );

    if (error) {
      window.localStorage.setItem(adminContentStorageKey, JSON.stringify(loadAdminContent()));
      setSyncStatus("local");
      setSyncError(error.message);
      return { ok: false, remote: true, error };
    }

    setSyncStatus("remote");
    return { ok: true, remote: true };
  }, [canWrite, isConfigured, user?.id]);

  return { content, updateContent, isRemoteLoading, syncStatus, syncError };
}
