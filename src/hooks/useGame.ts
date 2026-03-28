import { useState, useCallback, useRef } from "react";
import { useSocket } from "./useSocket";
import { getSessionPlayerId, saveName } from "../config";
import type { GamePhase, RoomView, RacePlayerView, ServerEvent } from "../types";

export interface GameState {
  phase: GamePhase;
  room: RoomView | null;
  playerId: string;
  countdown: number | null;
  raceProgress: RacePlayerView[];
  rankings: RacePlayerView[];
  error: string | null;
}

const initialState: GameState = {
  phase: "lobby",
  room: null,
  playerId: getSessionPlayerId(),
  countdown: null,
  raceProgress: [],
  rankings: [],
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
          case "racing":
            phase = "racing";
            break;
          case "finished":
            phase = "result";
            break;
          default:
            phase = "room";
        }
        setState((s) => ({
          ...s,
          room,
          phase,
          error: null,
        }));
        break;
      }

      case "race.countdown":
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

      case "error":
        setState((s) => ({
          ...s,
          error: event.payload.message,
        }));
        break;
    }
  }, []);

  const { state: socketState, connect, disconnect, send } = useSocket(handleMessage);

  // Actions
  const createRoom = useCallback(
    (name: string, maxPlayers?: number) => {
      saveName(name);
      connect();
      // Need a small delay for connection to establish
      setTimeout(() => {
        send({
          type: "room.create",
          payload: { sessionPlayerId: getSessionPlayerId(), name, maxPlayers },
        });
      }, 500);
    },
    [connect, send]
  );

  const joinRoom = useCallback(
    (roomId: string, name: string) => {
      saveName(name);
      connect();
      setTimeout(() => {
        send({
          type: "room.join",
          payload: { sessionPlayerId: getSessionPlayerId(), roomId: roomId.toUpperCase(), name },
        });
      }, 500);
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

  const startRace = useCallback(() => {
    const room = stateRef.current.room;
    if (!room) return;
    send({ type: "room.start", payload: { roomId: room.roomId } });
  }, [send]);

  const tap = useCallback(() => {
    const room = stateRef.current.room;
    if (!room) return;
    send({ type: "race.tap", payload: { roomId: room.roomId } });
  }, [send]);

  const leaveRoom = useCallback(() => {
    const room = stateRef.current.room;
    if (room) {
      send({ type: "room.leave", payload: { roomId: room.roomId } });
    }
    disconnect();
    setState(initialState);
  }, [send, disconnect]);

  const clearError = useCallback(() => {
    setState((s) => ({ ...s, error: null }));
  }, []);

  return {
    ...state,
    socketState,
    createRoom,
    joinRoom,
    setReady,
    startRace,
    tap,
    leaveRoom,
    clearError,
  };
}
