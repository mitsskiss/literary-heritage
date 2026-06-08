import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

function readAuthCallbackFromLocation() {
  if (typeof window === "undefined") {
    return { isCallback: false, type: null };
  }

  const hash = window.location.hash.startsWith("#")
    ? window.location.hash.slice(1)
    : window.location.hash;
  const search = window.location.search.startsWith("?")
    ? window.location.search.slice(1)
    : window.location.search;

  const routePath = readHashRoute(hash);
  const hashParams = readCallbackParamsFromHash(hash);
  const searchParams = new URLSearchParams(search);
  const hashHasCallback = hasAuthCallbackParams(hashParams);
  const searchHasCallback = hasAuthCallbackParams(searchParams);
  const params = hashHasCallback ? hashParams : searchParams;
  const isCallback = hashHasCallback || searchHasCallback;

  return {
    isCallback,
    type: params.get("type") ?? (routePath === "/reset-password" ? "recovery" : null),
    routePath,
    accessToken: params.get("access_token"),
    refreshToken: params.get("refresh_token"),
    code: params.get("code"),
    errorCode: params.get("error_code") ?? params.get("error"),
    errorDescription: params.get("error_description"),
  };
}

function hasAuthCallbackParams(params) {
  return Boolean(
    params.has("access_token") ||
      params.has("refresh_token") ||
      params.has("error_description") ||
      params.has("error_code") ||
      params.has("error") ||
      params.has("code")
  );
}

function readHashRoute(hash) {
  if (!hash.startsWith("/")) return null;
  const [routePart] = hash.split("#");
  return routePart.split("?")[0] || null;
}

function readCallbackParamsFromHash(hash) {
  const candidates = [hash];

  hash.split("#").forEach((part) => {
    candidates.push(part);
    const queryIndex = part.indexOf("?");
    if (queryIndex >= 0) {
      candidates.push(part.slice(queryIndex + 1));
    }
  });

  const normalizedCandidates = candidates
    .map((candidate) => candidate.replace(/^#/, ""))
    .map((candidate) => {
      if (candidate.startsWith("/auth?")) return candidate.slice("/auth?".length);
      if (candidate.startsWith("/auth/callback?")) return candidate.slice("/auth/callback?".length);
      if (candidate.startsWith("/reset-password?")) return candidate.slice("/reset-password?".length);
      if (candidate.startsWith("/auth#")) return candidate.slice("/auth#".length);
      if (candidate.startsWith("/auth/callback#")) return candidate.slice("/auth/callback#".length);
      if (candidate.startsWith("/reset-password#")) return candidate.slice("/reset-password#".length);
      return candidate;
    });

  const matching = normalizedCandidates
    .map((candidate) => new URLSearchParams(candidate))
    .find(hasAuthCallbackParams);

  return matching ?? new URLSearchParams();
}

export function cleanAuthCallbackUrl(type = initialAuthCallback.type) {
  if (typeof window === "undefined") return;

  const searchParams = new URLSearchParams(window.location.search);
  ["access_token", "refresh_token", "code", "type", "error", "error_code", "error_description"].forEach((key) => {
    searchParams.delete(key);
  });

  const search = searchParams.toString() ? `?${searchParams.toString()}` : "";
  const route = type === "recovery" ? "/reset-password" : "/auth/callback";
  const cleanUrl = `${window.location.origin}${window.location.pathname}${search}#${route}`;
  window.history.replaceState(window.history.state, "", cleanUrl);
}

export const initialAuthCallback = readAuthCallbackFromLocation();
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  : null;
