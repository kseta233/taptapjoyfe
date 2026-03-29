import type { RoomView } from "../../types";
import { canHostStartGame, getConnectedPlayers } from "./data";

interface UseRoomScreenModelParams {
  room: RoomView;
  playerId: string;
}

export function useRoomScreenModel({ room, playerId }: UseRoomScreenModelParams) {
  const isHost = room.hostPlayerId === playerId;
  const myPlayer = room.players.find((player) => player.playerId === playerId);
  const isReady = myPlayer?.isReady ?? false;
  const connectedPlayers = getConnectedPlayers(room);
  const canStart = canHostStartGame(room, playerId);

  return {
    isHost,
    isReady,
    connectedPlayers,
    canStart,
  };
}
