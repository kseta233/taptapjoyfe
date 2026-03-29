import type { RoomView } from "../../types";

export function getConnectedPlayers(room: RoomView) {
  return room.players.filter((player) => player.isConnected);
}

export function canHostStartGame(room: RoomView, playerId: string) {
  const connectedPlayers = getConnectedPlayers(room);
  const allReady = connectedPlayers.every((player) => player.isReady);
  const isHost = room.hostPlayerId === playerId;
  return isHost && allReady && connectedPlayers.length >= 2;
}
