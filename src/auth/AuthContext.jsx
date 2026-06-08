import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  cleanAuthCallbackUrl,
  debugAuth,
  initialAuthCallback,
  isSupabaseConfigured,
  normalizeAuthEmail,
  supabase,
} from "../lib/supabaseClient";

const AuthContext = createContext(null);
const PRODUCTION_SITE_URL = "https://mitsskiss.github.io/literary-heritage/";

function withTrailingSlash(value) {
  return value.endsWith("/") ? value : `${value}/`;
}

function getSiteUrl() {
  if (typeof window === "undefined") return PRODUCTION_SITE_URL;

  const basePath = withTrailingSlash(import.meta.env.BASE_URL || "/");
  return `${window.location.origin}${basePath}`;
}

function getAuthRedirectUrl() {
  return `${getSiteUrl()}#/auth/callback`;
}

function getPasswordRecoveryRedirectUrl() {
  return `${getSiteUrl()}#/reset-password`;
}

async function hydrateAuthCallbackSession() {
  if (!supabase || !initialAuthCallback.isCallback) {
    return { data: null, error: null };
  }

  if (initialAuthCallback.errorDescription || initialAuthCallback.errorCode) {
    return {
      data: null,
      error: new Error(initialAuthCallback.errorDescription || initialAuthCallback.errorCode),
    };
  }

  if (initialAuthCallback.accessToken && initialAuthCallback.refreshToken) {
    return supabase.auth.setSession({
      access_token: initialAuthCallback.accessToken,
      refresh_token: initialAuthCallback.refreshToken,
    });
  }

  if (initialAuthCallback.code) {
    return supabase.auth.exchangeCodeForSession(initialAuthCallback.code);
  }

  return { data: null, error: null };
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [authEvent, setAuthEvent] = useState(null);
  const [authRedirectType, setAuthRedirectType] = useState(
    initialAuthCallback.isCallback ? initialAuthCallback.type : null
  );
  const [authCallbackError, setAuthCallbackError] = useState("");
  const [recoveryReady, setRecoveryReady] = useState(false);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return undefined;
    }

    let isMounted = true;

    async function initializeSession() {
      const hydrated = await hydrateAuthCallbackSession();
      if (!isMounted) return;

      if (hydrated?.error) {
        debugAuth("callback hydration error", {
          type: initialAuthCallback.type,
          error: hydrated.error.message,
        });
        setAuthCallbackError(hydrated.error.message);
      }

      const { data } = await supabase.auth.getSession();
      if (!isMounted) return;
      setSession(data.session ?? null);
      debugAuth("initial session loaded", {
        callbackType: initialAuthCallback.type,
        hasSession: Boolean(data.session),
        routePath: initialAuthCallback.routePath,
      });
      if (initialAuthCallback.isCallback) {
        if (initialAuthCallback.type === "recovery") {
          setRecoveryReady(Boolean(data.session));
        }
        setAuthEvent(
          initialAuthCallback.type === "recovery" ? "PASSWORD_RECOVERY" : "SIGNED_IN"
        );
        setAuthRedirectType(initialAuthCallback.type ?? "auth");
        cleanAuthCallbackUrl(initialAuthCallback.type);
      }
      setLoading(false);
    }

    initializeSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, nextSession) => {
        debugAuth("auth event", {
          event,
          hasSession: Boolean(nextSession),
        });
        setAuthEvent(event);
        setSession(nextSession ?? null);
        if (event === "PASSWORD_RECOVERY") {
          setRecoveryReady(Boolean(nextSession));
          setAuthRedirectType("recovery");
        }
        if (initialAuthCallback.isCallback && nextSession) {
          setAuthRedirectType(initialAuthCallback.type ?? "auth");
        }
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
      authEvent,
      authRedirectType,
      authCallbackError,
      recoveryReady,
      isConfigured: isSupabaseConfigured,
      signIn: async ({ email, password }) => {
        if (!supabase) throw new Error("Supabase is not configured");
        const normalizedEmail = normalizeAuthEmail(email);
        debugAuth("signInWithPassword request", { normalizedEmail });
        const currentSession = await supabase.auth.getSession();
        if (currentSession.data.session) {
          await supabase.auth.signOut({ scope: "local" });
        }
        const result = await supabase.auth.signInWithPassword({ email: normalizedEmail, password });
        debugAuth("signInWithPassword response", {
          normalizedEmail,
          hasSession: Boolean(result.data?.session),
          error: result.error?.message,
          errorCode: result.error?.code,
          status: result.error?.status,
        });
        return result;
      },
      signUp: async ({ email, password, displayName }) => {
        if (!supabase) throw new Error("Supabase is not configured");
        const normalizedEmail = normalizeAuthEmail(email);
        debugAuth("signUp request", { normalizedEmail });
        const result = await supabase.auth.signUp({
          email: normalizedEmail,
          password,
          options: {
            emailRedirectTo: getAuthRedirectUrl(),
            data: {
              display_name: displayName,
            },
          },
        });
        return result;
      },
      resendConfirmation: async ({ email }) => {
        if (!supabase) throw new Error("Supabase is not configured");
        const normalizedEmail = normalizeAuthEmail(email);
        debugAuth("resend confirmation request", { normalizedEmail });
        return supabase.auth.resend({
          type: "signup",
          email: normalizedEmail,
          options: {
            emailRedirectTo: getAuthRedirectUrl(),
          },
        });
      },
      resetPassword: async ({ email }) => {
        if (!supabase) throw new Error("Supabase is not configured");
        const normalizedEmail = normalizeAuthEmail(email);
        debugAuth("reset password request", { normalizedEmail });
        return supabase.auth.resetPasswordForEmail(normalizedEmail, {
          redirectTo: getPasswordRecoveryRedirectUrl(),
        });
      },
      updatePassword: async ({ password }) => {
        if (!supabase) throw new Error("Supabase is not configured");
        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData.session?.user) {
          return {
            data: null,
            error: new Error("Password recovery session is missing or expired."),
          };
        }
        const result = await supabase.auth.updateUser({ password });
        debugAuth("update password response", {
          hasUser: Boolean(result.data?.user),
          error: result.error?.message,
          errorCode: result.error?.code,
          status: result.error?.status,
        });
        if (!result.error) {
          setRecoveryReady(false);
          setAuthRedirectType(null);
          await supabase.auth.signOut({ scope: "local" });
          setSession(null);
        }
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
          display_name: updates.display_name,
          bio: updates.bio,
          reading_goal: updates.reading_goal,
          avatar_data_url: updates.avatar_data_url,
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
    [authCallbackError, authEvent, authRedirectType, loading, profile, recoveryReady, session]
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
