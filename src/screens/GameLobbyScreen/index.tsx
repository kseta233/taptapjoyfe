import type { GameType, RoomListItem } from "../../types";
import { useGameLobbyModel } from "./domain";
import { GameLobbyScreenView } from "./presentation";

interface Props {
  gameType: GameType;
  availableRooms: RoomListItem[];
  onCreateRoom: (name: string) => void;
  onJoinRoom: (roomId: string, name: string) => void;
  onBack: () => void;
}

export function GameLobbyScreen({ gameType, availableRooms, onCreateRoom, onJoinRoom, onBack }: Props) {
  const model = useGameLobbyModel({ gameType, onJoinRoom });

  const handleCreateRoom = () => {
    if (!model.isNameValid) return;
    onCreateRoom(model.name.trim());
  };

  const handleJoinByCode = () => {
    if (!model.isNameValid || model.roomCode.length < 4) return;
    onJoinRoom(model.roomCode, model.name.trim());
  };

  const handleJoinRoom = (roomId: string) => {
    if (!model.isNameValid) return;
    onJoinRoom(roomId, model.name.trim());
  };

  return (
    <GameLobbyScreenView
      gameType={gameType}
      info={model.info}
      availableRooms={availableRooms}
      name={model.name}
      roomCode={model.roomCode}
      showManualJoin={model.showManualJoin}
      isNameValid={model.isNameValid}
      onNameChange={model.setName}
      onRoomCodeChange={model.setRoomCode}
      onToggleManualJoin={model.toggleManualJoin}
      onCreateRoom={handleCreateRoom}
      onJoinByCode={handleJoinByCode}
      onJoinRoom={handleJoinRoom}
      onBack={onBack}
    />
  );
}
