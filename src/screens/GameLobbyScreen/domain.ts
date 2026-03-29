import { useEffect, useMemo, useState } from "react";
import { getSavedName } from "../../config";
import type { GameType } from "../../types";
import { GAME_LOBBY_INFO, getInitialRoomCode, normalizeRoomCode } from "./data";

interface UseGameLobbyModelParams {
  gameType: GameType;
  onJoinRoom: (roomId: string, name: string) => void;
}

export function useGameLobbyModel({ gameType, onJoinRoom }: UseGameLobbyModelParams) {
  const [name, setName] = useState(getSavedName());
  const [roomCode, setRoomCode] = useState(getInitialRoomCode);
  const [showManualJoin, setShowManualJoin] = useState(false);

  const isNameValid = name.trim().length > 0 && name.trim().length <= 20;
  const info = GAME_LOBBY_INFO[gameType];

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const room = params.get("room");
    if (room && isNameValid) {
      onJoinRoom(normalizeRoomCode(room), name.trim());
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [isNameValid, name, onJoinRoom]);

  const normalizedRoomCode = useMemo(() => normalizeRoomCode(roomCode), [roomCode]);

  return {
    name,
    setName,
    roomCode: normalizedRoomCode,
    setRoomCode: (value: string) => setRoomCode(normalizeRoomCode(value)),
    showManualJoin,
    toggleManualJoin: () => setShowManualJoin((prev) => !prev),
    isNameValid,
    info,
  };
}
