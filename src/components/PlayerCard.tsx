import type { PlayerView } from "../types";

interface Props {
  player: PlayerView;
  isYou: boolean;
  isHost: boolean;
}

export function PlayerCard({ player, isYou, isHost }: Props) {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
        isYou
          ? "bg-accent-1/10 border-accent-1/30"
          : "bg-bg-card border-border"
      } ${!player.isConnected ? "opacity-50" : ""}`}
    >
      {/* Avatar */}
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
          isYou
            ? "bg-accent-1/20 text-accent-1"
            : "bg-bg-secondary text-text-secondary"
        }`}
      >
        {player.name.charAt(0).toUpperCase()}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-text-primary truncate">
            {player.name}
          </span>
          {isYou && (
            <span className="text-[10px] px-1.5 py-0.5 bg-accent-1/20 text-accent-1 rounded-full font-bold">
              YOU
            </span>
          )}
          {isHost && (
            <span className="text-[10px] px-1.5 py-0.5 bg-warning/20 text-warning rounded-full font-bold">
              HOST
            </span>
          )}
        </div>
      </div>

      {/* Ready Status */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all ${
          player.isReady
            ? "bg-success/20 text-success"
            : "bg-bg-secondary text-text-muted"
        }`}
      >
        {player.isReady ? "✓" : "·"}
      </div>
    </div>
  );
}
