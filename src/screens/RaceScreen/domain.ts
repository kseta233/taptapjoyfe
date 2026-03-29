import type { RacePlayerView, RoomView } from "../../types";
import { getRacePlayers, sortRacePlayers } from "./data";

interface UseRaceScreenModelParams {
  room: RoomView;
  playerId: string;
  raceProgress: RacePlayerView[];
}

export function useRaceScreenModel({ room, playerId, raceProgress }: UseRaceScreenModelParams) {
  const players = getRacePlayers(room, raceProgress);
  const sortedPlayers = sortRacePlayers(players, playerId);
  const myProgress = players.find((player) => player.playerId === playerId)?.progress ?? 0;

  return {
    sortedPlayers,
    myProgress,
  };
}
