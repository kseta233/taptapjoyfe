import type { RacePlayerView, RoomView } from "../../types";

export function getRacePlayers(room: RoomView, raceProgress: RacePlayerView[]) {
  if (raceProgress.length > 0) {
    return raceProgress;
  }

  return room.players.map((player) => ({
    playerId: player.playerId,
    name: player.name,
    progress: player.progress,
    tapCount: player.tapCount,
    isConnected: player.isConnected,
  }));
}

export function sortRacePlayers(players: RacePlayerView[], playerId: string) {
  return [...players].sort((a, b) => {
    if (a.playerId === playerId) return -1;
    if (b.playerId === playerId) return 1;
    return b.progress - a.progress;
  });
}
