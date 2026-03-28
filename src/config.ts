export const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:3001";

export const GAME_CONFIG = {
  FINISH_PROGRESS: 100,
} as const;

// Generate or retrieve sessionPlayerId from localStorage
export function getSessionPlayerId(): string {
  const key = "taptapjoy_session_id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

// Get/set saved player name
export function getSavedName(): string {
  return localStorage.getItem("taptapjoy_name") || "";
}

export function saveName(name: string): void {
  localStorage.setItem("taptapjoy_name", name);
}
