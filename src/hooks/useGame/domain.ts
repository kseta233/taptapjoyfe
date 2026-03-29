import { useState, useCallback, useRef, useEffect } from "react";
import { useSocket } from "../useSocket";
import { API_URL, getSavedName, getSessionPlayerId, saveName } from "../../config";
import type { GameType, RoomListItem, ServerEvent } from "../../types";
import { type GameState, getRouteFromGameState, initialState, roomStatusToPhase } from "./data";

interface UseGameOptions {
  navigate?: (path: string) => void;
  pathname?: string;
}

export function useGame(options: UseGameOptions = {}) {
  const { navigate, pathname } = options;
  const [state, setState] = useState<GameState>(initialState);
  const stateRef = useRef(state);
  stateRef.current = state;

  // Domain-owned route synchronization for game phase transitions.
  useEffect(() => {
    if (!navigate || !pathname) {
      return;
    }

    if (state.phase === "home" && pathname !== "/") {
      return;
    }

    const target = getRouteFromGameState(state);
    if (pathname !== target) {
      navigate(target);
    }
  }, [navigate, pathname, state.phase, state.gameType, state.room, state.rankings.length, state.tugResult]);

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
        const phase = roomStatusToPhase(room.status, room.gameType);
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

  const {
    state: socketState,
    reconnectAttempt,
    isReconnecting,
    connect,
    disconnect,
    send,
  } = useSocket(handleMessage);
  const prevSocketStateRef = useRef(socketState);

  const fetchLobbyRooms = useCallback(async (gameType: GameType) => {
    try {
      const response = await fetch(`${API_URL}/rooms?gameType=${encodeURIComponent(gameType)}`);
      if (!response.ok) return;

      const data = (await response.json()) as { rooms?: RoomListItem[] };
      setState((s) => ({
        ...s,
        availableRooms: data.rooms ?? [],
      }));
    } catch {
      // Ignore polling failures to keep lobby UX quiet.
    }
  }, []);

  useEffect(() => {
    if (state.phase !== "game-lobby") return;

    const gameType = state.gameType;
    void fetchLobbyRooms(gameType);

    const interval = setInterval(() => {
      void fetchLobbyRooms(gameType);
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, [fetchLobbyRooms, state.phase, state.gameType]);

  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState !== "visible") return;

      const phase = stateRef.current.phase;
      if (phase === "room" || phase === "countdown" || phase === "racing" || phase === "tug-playing") {
        connect();
      }
    };

    const onOnline = () => {
      const phase = stateRef.current.phase;
      if (phase === "room" || phase === "countdown" || phase === "racing" || phase === "tug-playing") {
        connect();
      }
    };

    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("online", onOnline);

    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("online", onOnline);
    };
  }, [connect]);

  useEffect(() => {
    const prev = prevSocketStateRef.current;
    if (prev !== "connected" && socketState === "connected") {
      const current = stateRef.current;
      if (current.phase === "room" || current.phase === "countdown" || current.phase === "racing" || current.phase === "tug-playing") {
        const roomId = current.room?.roomId;
        if (roomId) {
          send({
            type: "room.join",
            payload: {
              sessionPlayerId: getSessionPlayerId(),
              roomId,
              name: getSavedName() || "Player",
            },
          });
        }
      }
    }

    prevSocketStateRef.current = socketState;
  }, [socketState, send]);

  // ============================================================
  // Navigation Actions
  // ============================================================

  /** Select a game type from home screen → go to game lobby */
  const selectGame = useCallback(
    (gameType: GameType) => {
      setState((s) => ({ ...s, gameType, phase: "game-lobby", availableRooms: [] }));
      disconnect();
    },
    [disconnect]
  );

  /** Go back to home screen */
  const backToHome = useCallback(() => {
    disconnect();
    setState({ ...initialState });
  }, [disconnect]);

  /** Refresh room list */
  const refreshRoomList = useCallback(() => {
    const gt = stateRef.current.gameType;
    void fetchLobbyRooms(gt);
  }, [fetchLobbyRooms]);

  // ============================================================
  // Room Actions
  // ============================================================

  const createRoom = useCallback(
    (name: string, maxPlayers?: number) => {
      saveName(name);
      const gt = stateRef.current.gameType;
      connect();
      send({
        type: "room.create",
        payload: { sessionPlayerId: getSessionPlayerId(), name, maxPlayers, gameType: gt },
      });
    },
    [connect, send]
  );

  const joinRoom = useCallback(
    (roomId: string, name: string) => {
      saveName(name);
      connect();
      send({
        type: "room.join",
        payload: { sessionPlayerId: getSessionPlayerId(), roomId: roomId.toUpperCase(), name },
      });
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
    reconnectAttempt,
    isReconnecting,
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
