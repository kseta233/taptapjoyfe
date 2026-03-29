import type { RacePlayerView } from "../../types";
import { useResultScreenModel } from "./domain";
import { ResultScreenView } from "./presentation";

interface Props {
  rankings: RacePlayerView[];
  playerId: string;
  onLeave: () => void;
}

export function ResultScreen({ rankings, playerId, onLeave }: Props) {
  const model = useResultScreenModel({ rankings, playerId });

  return (
    <ResultScreenView
      rankings={rankings}
      playerId={playerId}
      isWinner={model.isWinner}
      winnerName={model.winner?.name}
      winnerTapCount={model.winner?.tapCount}
      onLeave={onLeave}
    />
  );
}
