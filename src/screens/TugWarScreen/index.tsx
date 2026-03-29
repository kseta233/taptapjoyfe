import type { GamePhase, RoomView, TugState } from "../../types";
import { useTugWarScreenModel } from "./domain";
import { TugWarScreenView } from "./presentation";

interface Props {
  room: RoomView;
  playerId: string;
  countdown: number | null;
  tugState: TugState | null;
  phase: GamePhase;
  onTap: () => void;
}

export function TugWarScreen({ room, playerId, countdown, tugState, phase, onTap }: Props) {
  const model = useTugWarScreenModel({ room, playerId, tugState, phase, onTap });

  return (
    <TugWarScreenView
      room={room}
      playerId={playerId}
      countdown={countdown}
      phase={phase}
      myTeam={model.myTeam}
      isPlaying={model.isPlaying}
      ropePos={model.ropePos}
      ropeOffset={model.ropeOffset}
      leftForce={model.leftForce}
      rightForce={model.rightForce}
      seconds={model.seconds}
      isLeftDanger={model.isLeftDanger}
      isRightDanger={model.isRightDanger}
      leftTeam={model.leftTeam}
      rightTeam={model.rightTeam}
      onTapDown={model.handleTap}
    />
  );
}
