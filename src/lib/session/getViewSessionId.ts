export function getViewSessionId() {
  const key = "kalinga_view_session_id";

  const existing = localStorage.getItem(key);
  if (existing) return existing;

  const created =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `session_${Date.now()}_${Math.random().toString(36).slice(2)}`;

  localStorage.setItem(key, created);
  return created;
}
