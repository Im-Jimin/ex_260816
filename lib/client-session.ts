const KEY = "eokebeoryeo-session-id";

export function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "";

  let id = window.localStorage.getItem(KEY);
  if (!id) {
    id = crypto.randomUUID();
    window.localStorage.setItem(KEY, id);
  }

  if (!document.cookie.split("; ").some((c) => c.startsWith(`${KEY}=`))) {
    document.cookie = `${KEY}=${id}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
  }

  return id;
}

export const SESSION_COOKIE_NAME = KEY;
