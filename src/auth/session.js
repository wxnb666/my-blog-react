const STORAGE_KEY = "blog_session_v1";

/** @returns {{ token: string, user: { id: number, username: string, role: "owner" | "reader" } } | null} */
export function getSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data?.token || !data?.user?.username) return null;
    return data;
  } catch {
    return null;
  }
}

export function setSession(payload) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

export function clearSession() {
  localStorage.removeItem(STORAGE_KEY);
}

export function isOwnerSession() {
  return getSession()?.user?.role === "owner";
}