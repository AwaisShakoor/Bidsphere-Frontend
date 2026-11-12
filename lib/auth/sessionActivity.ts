const KEY = "bidsphere:lastActiveAt";

// TODO: restore to 4 * 60 * 60 * 1000 before shipping
export const SESSION_AWAY_MS = 4 * 60 * 60 * 1000;

export function touchSessionActivity() {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, String(Date.now()));
}

export function clearSessionActivity() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}

export function isSessionAway() {
  if (typeof window === "undefined") return false;
  const last = Number(localStorage.getItem(KEY));
  if (!last) return false;
  return Date.now() - last >= SESSION_AWAY_MS;
}
