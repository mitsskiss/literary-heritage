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

  const callbackHash = hash.startsWith("/auth?")
    ? hash.slice("/auth?".length)
    : hash.startsWith("/auth#")
      ? hash.slice("/auth#".length)
      : hash;
  const hashParams = new URLSearchParams(callbackHash);
  const searchParams = new URLSearchParams(search);
  const hashHasCallback = hasAuthCallbackParams(hashParams);
  const searchHasCallback = hasAuthCallbackParams(searchParams);
  const params = hashHasCallback ? hashParams : searchParams;
  const isCallback = hashHasCallback || searchHasCallback;

  if (isCallback && hashHasCallback && callbackHash !== hash) {
    const cleanUrl = `${window.location.origin}${window.location.pathname}${window.location.search}#${callbackHash}`;
    window.history.replaceState(window.history.state, "", cleanUrl);
  }

  return {
    isCallback,
    type: params.get("type"),
  };
}

function hasAuthCallbackParams(params) {
  return Boolean(
    params.has("access_token") ||
      params.has("refresh_token") ||
      params.has("error_description") ||
      params.has("error_code") ||
      params.has("code")
  );
}

export const initialAuthCallback = readAuthCallbackFromLocation();
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
