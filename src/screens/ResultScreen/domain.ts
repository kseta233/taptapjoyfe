import type { RacePlayerView } from "../../types";

interface UseResultScreenModelParams {
  rankings: RacePlayerView[];
  playerId: string;
}

export function useResultScreenModel({ rankings, playerId }: UseResultScreenModelParams) {
  const winner = rankings[0];
  const isWinner = winner?.playerId === playerId;

  return {
    winner,
    isWinner,
  };
}
