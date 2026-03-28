import type { RacePlayerView } from "../types";

interface Props {
  rankings: RacePlayerView[];
  playerId: string;
  onLeave: () => void;
}

const MEDALS = ["🥇", "🥈", "🥉", "4️⃣"];
const POSITION_COLORS = [
  "from-yellow-400/20 to-yellow-600/10 border-yellow-500/40",
  "from-gray-300/20 to-gray-500/10 border-gray-400/40",
  "from-amber-600/20 to-amber-800/10 border-amber-600/40",
  "from-bg-card to-bg-card border-border",
];

export function ResultScreen({ rankings, playerId, onLeave }: Props) {
  const winner = rankings[0];
  const isWinner = winner?.playerId === playerId;

  return (
    <div className="h-full flex flex-col items-center px-6 py-8">
      {/* Winner Announcement */}
      <div className="text-center mb-8 animate-slide-up">
        <div className="text-6xl mb-3">
          {isWinner ? "👑" : "🏁"}
        </div>
        <h2 className="text-3xl font-black text-text-primary">
          {isWinner ? "You Won!" : `${winner?.name} Wins!`}
        </h2>
        <p className="text-text-secondary mt-1">
          {winner?.tapCount} taps
        </p>
      </div>

      {/* Rankings */}
      <div className="w-full max-w-sm flex flex-col gap-3 flex-1 overflow-y-auto">
        <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider">
          Final Rankings
        </h3>

        {rankings.map((player, i) => {
          const isYou = player.playerId === playerId;
          return (
            <div
              key={player.playerId}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border bg-gradient-to-r transition-all animate-slide-up ${
                POSITION_COLORS[i] || POSITION_COLORS[3]
              } ${isYou ? "ring-2 ring-accent-1/50" : ""}`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {/* Medal / Position */}
              <span className="text-2xl w-8 text-center">
                {MEDALS[i] || `${i + 1}`}
              </span>

              {/* Player Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-text-primary truncate">
                    {player.name}
                  </span>
                  {isYou && (
                    <span className="text-xs px-2 py-0.5 bg-accent-1/20 text-accent-1 rounded-full font-semibold">
                      YOU
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-text-secondary text-xs">
                    Progress: {player.progress}
                  </span>
                  <span className="text-text-muted text-xs">•</span>
                  <span className="text-text-secondary text-xs">
                    Taps: {player.tapCount}
                  </span>
                </div>
              </div>

              {/* Finish indicator */}
              {player.finishOrder && player.finishOrder <= 3 && (
                <span className="text-success text-xs font-bold">
                  ✓ FINISH
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="w-full max-w-sm mt-6">
        <button
          onClick={onLeave}
          className="w-full py-4 bg-gradient-to-r from-accent-1 to-accent-2 hover:from-accent-2 hover:to-accent-3 rounded-xl font-bold text-lg transition-all"
        >
          Back to Lobby
        </button>
      </div>
    </div>
  );
}
