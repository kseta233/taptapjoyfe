import type { GamePhase, RacePlayerView, RoomView } from "../../types";
import { useRaceScreenModel } from "./domain";
import { RaceScreenView } from "./presentation";

interface Props {
  room: RoomView;
  playerId: string;
  countdown: number | null;
  raceProgress: RacePlayerView[];
  phase: GamePhase;
  onTap: () => void;
}

export function RaceScreen({ room, playerId, countdown, raceProgress, phase, onTap }: Props) {
  const model = useRaceScreenModel({ room, playerId, raceProgress });

  return (
    <RaceScreenView
      countdown={countdown}
      phase={phase}
      players={model.sortedPlayers}
      playerId={playerId}
      myProgress={model.myProgress}
      onTap={onTap}
    />
  );
}
