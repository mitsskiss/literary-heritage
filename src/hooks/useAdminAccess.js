import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { supabase } from "../lib/supabaseClient";

export function useAdminAccess() {
  const { user, profile, loading, isConfigured } = useAuth();
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(isConfigured);

  useEffect(() => {
    if (!isConfigured || !supabase || loading) {
      setCheckingAdmin(false);
      setIsAdminUser(false);
      return undefined;
    }

    if (!user) {
      setCheckingAdmin(false);
      setIsAdminUser(false);
      return undefined;
    }

    if (profile?.role === "admin") {
      setCheckingAdmin(false);
      setIsAdminUser(true);
      return undefined;
    }

    let isMounted = true;

    async function checkAdminAccess() {
      setCheckingAdmin(true);

      const { data, error } = await supabase
        .from("admin_users")
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!isMounted) return;
      setIsAdminUser(Boolean(data && !error));
      setCheckingAdmin(false);
    }

    checkAdminAccess();

    return () => {
      isMounted = false;
    };
  }, [isConfigured, loading, profile?.role, user]);

  return useMemo(
    () => ({
      isAdmin: Boolean(profile?.role === "admin" || isAdminUser),
      checkingAdmin,
      requiresSetup: !isConfigured,
      user,
    }),
    [checkingAdmin, isAdminUser, isConfigured, profile?.role, user]
  );
}
