import { getSessionPlayerId } from "../../config";
import type { GamePhase, GameType, RoomView, RacePlayerView, RoomListItem, TugState, TugResult } from "../../types";

export interface GameState {
  phase: GamePhase;
  gameType: GameType;
  room: RoomView | null;
  playerId: string;
  countdown: number | null;
  raceProgress: RacePlayerView[];
  rankings: RacePlayerView[];
  availableRooms: RoomListItem[];
  tugState: TugState | null;
  tugResult: TugResult | null;
  error: string | null;
}

export const initialState: GameState = {
  phase: "home",
  gameType: "tap-race",
  room: null,
  playerId: getSessionPlayerId(),
  countdown: null,
  raceProgress: [],
  rankings: [],
  availableRooms: [],
  tugState: null,
  tugResult: null,
  error: null,
};

export function roomStatusToPhase(status: string, gameType: GameType): GamePhase {
  switch (status) {
    case "waiting":
      return "room";
    case "countdown":
      return "countdown";
    case "playing":
      return gameType === "tug-war" ? "tug-playing" : "racing";
    case "finished":
      return gameType === "tug-war" ? "tug-result" : "result";
    default:
      return "room";
  }
}

export function getRouteFromGameState(state: Pick<GameState, "phase" | "gameType" | "room">): string {
  switch (state.phase) {
    case "home":
      return "/";
    case "game-lobby":
      return "/lobby";
    case "room":
      return state.room ? `/room/${state.room.roomId}` : "/lobby";
    case "countdown":
    case "racing":
      return state.room?.gameType === "tug-war" ? "/tug" : "/race";
    case "tug-playing":
      return "/tug";
    case "result":
      return "/result";
    case "tug-result":
      return "/tug-result";
    default:
      return "/";
  }
}
