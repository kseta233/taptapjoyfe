import type { RoomView } from "../types";
import { PlayerCard } from "../components/PlayerCard";
import { RoomCode } from "../components/RoomCode";

interface Props {
  room: RoomView;
  playerId: string;
  onReady: (isReady: boolean) => void;
  onStart: () => void;
  onLeave: () => void;
}

export function RoomScreen({ room, playerId, onReady, onStart, onLeave }: Props) {
  const isHost = room.hostPlayerId === playerId;
  const myPlayer = room.players.find((p) => p.playerId === playerId);
  const isReady = myPlayer?.isReady ?? false;

  const connectedPlayers = room.players.filter((p) => p.isConnected);
  const allReady = connectedPlayers.every((p) => p.isReady);
  const canStart = isHost && allReady && connectedPlayers.length >= 2;

  return (
    <div className="h-full flex flex-col px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onLeave}
          className="text-text-secondary hover:text-text-primary transition-colors text-sm font-medium"
        >
          ← Leave
        </button>
        <RoomCode code={room.roomId} />
        <div className="w-16"></div> {/* Spacer */}
      </div>

      {/* Room Info */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-1">
          <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
            room.gameType === "tug-war"
              ? "bg-orange-500/20 text-orange-400"
              : "bg-accent-1/20 text-accent-1"
          }`}>
            {room.gameType === "tug-war" ? "🪢 Tug of War" : "🏁 Tap Race"}
          </span>
        </div>
        <h2 className="text-xl font-bold text-text-primary">Waiting Room</h2>
        <p className="text-text-secondary text-sm mt-1">
          {connectedPlayers.length}/{room.maxPlayers} players
        </p>
        {room.gameType === "tug-war" && (
          <p className="text-text-muted text-xs mt-1 italic">Teams assigned on start</p>
        )}
      </div>

      {/* Player List */}
      <div className="flex-1 flex flex-col gap-3 overflow-y-auto">
        {room.players.map((player) => (
          <PlayerCard
            key={player.playerId}
            player={player}
            isYou={player.playerId === playerId}
            isHost={player.playerId === room.hostPlayerId}
          />
        ))}

        {/* Empty slots */}
        {Array.from({ length: room.maxPlayers - room.players.length }).map((_, i) => (
          <div
            key={`empty-${i}`}
            className="flex items-center gap-3 px-4 py-3 bg-bg-card/30 border border-border/30 rounded-xl border-dashed"
          >
            <div className="w-10 h-10 rounded-full bg-bg-secondary/50 flex items-center justify-center text-text-muted">
              ?
            </div>
            <span className="text-text-muted text-sm italic">Waiting for player...</span>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 mt-6">
        <button
          onClick={() => onReady(!isReady)}
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
            isReady
              ? "bg-success/20 text-success border-2 border-success"
              : "bg-bg-card border-2 border-border text-text-primary hover:border-accent-1"
          }`}
        >
          {isReady ? "✓ Ready!" : "Ready Up"}
        </button>

        {isHost && (
          <button
            onClick={onStart}
            disabled={!canStart}
            className="w-full py-4 bg-gradient-to-r from-accent-1 to-accent-2 hover:from-accent-2 hover:to-accent-3 rounded-xl font-bold text-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed animate-pulse-glow"
          >
            {room.gameType === "tug-war" ? "🪢 Start Tug of War" : "🏁 Start Race"}
          </button>
        )}

        {!isHost && (
          <p className="text-center text-text-muted text-sm">
            Waiting for host to start...
          </p>
        )}
      </div>
    </div>
  );
}
