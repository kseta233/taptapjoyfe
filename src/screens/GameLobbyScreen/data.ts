import type { GameType } from "../../types";

export interface GameLobbyInfo {
  emoji: string;
  title: string;
  color: string;
}

export const GAME_LOBBY_INFO: Record<GameType, GameLobbyInfo> = {
  "tap-race": { emoji: "🏁", title: "Tap Race", color: "text-accent-1" },
  "tug-war": { emoji: "🪢", title: "Tug of War", color: "text-orange-400" },
};

export function getInitialRoomCode() {
  const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
  return params.get("room")?.toUpperCase().slice(0, 6) || "";
}

export function normalizeRoomCode(value: string) {
  return value.toUpperCase().slice(0, 6);
}
