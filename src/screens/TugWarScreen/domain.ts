import { useCallback } from "react";
import type { GamePhase, RoomView, TugState } from "../../types";
import { getRopeMetrics, splitTeams } from "./data";

interface UseTugWarScreenModelParams {
  room: RoomView;
  playerId: string;
  tugState: TugState | null;
  phase: GamePhase;
  onTap: () => void;
}

export function useTugWarScreenModel({ room, playerId, tugState, phase, onTap }: UseTugWarScreenModelParams) {
  const myPlayer = room.players.find((player) => player.playerId === playerId);
  const myTeam = myPlayer?.team ?? "left";
  const isPlaying = phase === "tug-playing";
  const metrics = getRopeMetrics(tugState);
  const teams = splitTeams(room);

  const handleTap = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      if (!isPlaying) return;
      onTap();

      if (navigator.vibrate) {
        navigator.vibrate(10);
      }
    },
    [isPlaying, onTap]
  );

  return {
    myTeam,
    isPlaying,
    ...metrics,
    ...teams,
    handleTap,
  };
}
