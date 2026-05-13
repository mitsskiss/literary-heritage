import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { isSupabaseConfigured, supabase } from "../lib/supabaseClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return undefined;
    }

    let isMounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) return;
      setSession(data.session ?? null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        setSession(nextSession ?? null);
      }
    );

    return () => {
      isMounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!supabase || !session?.user) {
      setProfile(null);
      return;
    }

    let isMounted = true;

    async function loadProfile() {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .maybeSingle();

      if (!isMounted) return;

      if (error) {
        setProfile(null);
        return;
      }

      setProfile(data ?? null);
    }

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [session]);

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      profile,
      loading,
      isConfigured: isSupabaseConfigured,
      signIn: async ({ email, password }) => {
        if (!supabase) throw new Error("Supabase is not configured");
        return supabase.auth.signInWithPassword({ email, password });
      },
      signUp: async ({ email, password, displayName }) => {
        if (!supabase) throw new Error("Supabase is not configured");
        const result = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              display_name: displayName,
            },
          },
        });
        return result;
      },
      signOut: async () => {
        if (!supabase) return;
        await supabase.auth.signOut();
      },
      updateProfile: async (updates) => {
        if (!supabase || !session?.user) return { data: null, error: null };

        const payload = {
          id: session.user.id,
          email: session.user.email,
          ...updates,
          updated_at: new Date().toISOString(),
        };

        const result = await supabase
          .from("profiles")
          .upsert(payload, { onConflict: "id" })
          .select("*")
          .single();

        if (!result.error) {
          setProfile(result.data ?? null);
        }

        return result;
      },
      refreshProfile: async () => {
        if (!supabase || !session?.user) return null;
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .maybeSingle();
        setProfile(data ?? null);
        return data ?? null;
      },
    }),
    [loading, profile, session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
