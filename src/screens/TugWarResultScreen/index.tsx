import type { TugResult } from "../../types";
import { useTugWarResultScreenModel } from "./domain";
import { TugWarResultScreenView } from "./presentation";

interface Props {
  result: TugResult;
  playerId: string;
  onLeave: () => void;
}

export function TugWarResultScreen({ result, playerId, onLeave }: Props) {
  const model = useTugWarResultScreenModel({ result, playerId });

  return (
    <TugWarResultScreenView
      result={result}
      playerId={playerId}
      isDraw={model.isDraw}
      isWinner={model.isWinner}
      winnerColor={model.winnerColor}
      winnerLabel={model.winnerLabel}
      leftPlayers={model.leftPlayers}
      rightPlayers={model.rightPlayers}
      onLeave={onLeave}
    />
  );
}
