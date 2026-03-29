import type { RoomView } from "../../types";
import { useRoomScreenModel } from "./domain";
import { RoomScreenView } from "./presentation";

interface Props {
  room: RoomView;
  playerId: string;
  onReady: (isReady: boolean) => void;
  onStart: () => void;
  onLeave: () => void;
}

export function RoomScreen({ room, playerId, onReady, onStart, onLeave }: Props) {
  const model = useRoomScreenModel({ room, playerId });

  return (
    <RoomScreenView
      room={room}
      playerId={playerId}
      isHost={model.isHost}
      isReady={model.isReady}
      connectedPlayersCount={model.connectedPlayers.length}
      canStart={model.canStart}
      onReadyToggle={() => onReady(!model.isReady)}
      onStart={onStart}
      onLeave={onLeave}
    />
  );
}
