import { useState, useCallback, useRef } from "react";
import { useSocket } from "./useSocket";
import { getSessionPlayerId, saveName } from "../config";
import type {
  GamePhase,
  GameType,
  RoomView,
  RacePlayerView,
  RoomListItem,
  TugState,
  TugResult,
  ServerEvent,
} from "../types";

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

const initialState: GameState = {
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

export function useGame() {
  const [state, setState] = useState<GameState>(initialState);
  const stateRef = useRef(state);
  stateRef.current = state;

  const handleMessage = useCallback((event: ServerEvent) => {
    switch (event.type) {
      case "room.created":
        setState((s) => ({
          ...s,
          playerId: event.payload.playerId,
          error: null,
        }));
        break;

      case "room.joined":
        setState((s) => ({
          ...s,
          playerId: event.payload.playerId,
          error: null,
        }));
        break;

      case "room.state": {
        const room = event.payload;
        let phase: GamePhase;
        switch (room.status) {
          case "waiting":
            phase = "room";
            break;
          case "countdown":
            phase = "countdown";
            break;
          case "playing":
            phase = room.gameType === "tug-war" ? "tug-playing" : "racing";
            break;
          case "finished":
            phase = room.gameType === "tug-war" ? "tug-result" : "result";
            break;
          default:
            phase = "room";
        }
        setState((s) => ({
          ...s,
          room,
          phase,
          gameType: room.gameType,
          error: null,
        }));
        break;
      }

      case "room.listResult":
        setState((s) => ({
          ...s,
          availableRooms: event.payload.rooms,
        }));
        break;

      case "game.countdown":
        setState((s) => ({
          ...s,
          phase: "countdown",
          countdown: event.payload.value,
        }));
        break;

      case "race.progress":
        setState((s) => ({
          ...s,
          phase: "racing",
          raceProgress: event.payload.players,
        }));
        break;

      case "race.finished":
        setState((s) => ({
          ...s,
          phase: "result",
          rankings: event.payload.rankings,
        }));
        break;

      case "tug.state":
        setState((s) => ({
          ...s,
          phase: "tug-playing",
          tugState: event.payload,
        }));
        break;

      case "tug.finished":
        setState((s) => ({
          ...s,
          phase: "tug-result",
          tugResult: event.payload,
        }));
        break;

      case "error":
        setState((s) => ({
          ...s,
          error: event.payload.message,
        }));
        break;
    }
  }, []);

  const { state: socketState, connect, disconnect, send } = useSocket(handleMessage);

  // ============================================================
  // Navigation Actions
  // ============================================================

  /** Select a game type from home screen → go to game lobby */
  const selectGame = useCallback(
    (gameType: GameType) => {
      setState((s) => ({ ...s, gameType, phase: "game-lobby", availableRooms: [] }));
      connect();
      // Request room list after connection establishes
      setTimeout(() => {
        send({ type: "room.list", payload: { gameType } });
      }, 500);
    },
    [connect, send]
  );

  /** Go back to home screen */
  const backToHome = useCallback(() => {
    disconnect();
    setState({ ...initialState });
  }, [disconnect]);

  /** Refresh room list */
  const refreshRoomList = useCallback(() => {
    const gt = stateRef.current.gameType;
    send({ type: "room.list", payload: { gameType: gt } });
  }, [send]);

  // ============================================================
  // Room Actions
  // ============================================================

  const createRoom = useCallback(
    (name: string, maxPlayers?: number) => {
      saveName(name);
      const gt = stateRef.current.gameType;
      send({
        type: "room.create",
        payload: { sessionPlayerId: getSessionPlayerId(), name, maxPlayers, gameType: gt },
      });
    },
    [send]
  );

  const joinRoom = useCallback(
    (roomId: string, name: string) => {
      saveName(name);
      // If not connected yet (e.g., from share URL), connect first
      if (stateRef.current.phase === "home") {
        connect();
        setTimeout(() => {
          send({
            type: "room.join",
            payload: { sessionPlayerId: getSessionPlayerId(), roomId: roomId.toUpperCase(), name },
          });
        }, 500);
      } else {
        send({
          type: "room.join",
          payload: { sessionPlayerId: getSessionPlayerId(), roomId: roomId.toUpperCase(), name },
        });
      }
    },
    [connect, send]
  );

  const setReady = useCallback(
    (isReady: boolean) => {
      const room = stateRef.current.room;
      if (!room) return;
      send({ type: "room.ready", payload: { roomId: room.roomId, isReady } });
    },
    [send]
  );

  const startGame = useCallback(() => {
    const room = stateRef.current.room;
    if (!room) return;
    send({ type: "room.start", payload: { roomId: room.roomId } });
  }, [send]);

  // ============================================================
  // Game Actions
  // ============================================================

  const tap = useCallback(() => {
    const room = stateRef.current.room;
    if (!room) return;
    send({ type: "race.tap", payload: { roomId: room.roomId } });
  }, [send]);

  const tugTap = useCallback(() => {
    const room = stateRef.current.room;
    if (!room) return;
    send({ type: "tug.tap", payload: { roomId: room.roomId } });
  }, [send]);

  const leaveRoom = useCallback(() => {
    const room = stateRef.current.room;
    if (room) {
      send({ type: "room.leave", payload: { roomId: room.roomId } });
    }
    disconnect();
    setState({ ...initialState });
  }, [send, disconnect]);

  const clearError = useCallback(() => {
    setState((s) => ({ ...s, error: null }));
  }, []);

  return {
    ...state,
    socketState,
    selectGame,
    backToHome,
    refreshRoomList,
    createRoom,
    joinRoom,
    setReady,
    startGame,
    tap,
    tugTap,
    leaveRoom,
    clearError,
  };
}
