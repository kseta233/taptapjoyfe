import type { RacePlayerView } from "../types";

interface Props {
  player: RacePlayerView;
  isYou: boolean;
  finishProgress: number;
}

export function ProgressTrack({ player, isYou, finishProgress }: Props) {
  const percent = Math.min((player.progress / finishProgress) * 100, 100);
  const isFinished = player.progress >= finishProgress;

  return (
    <div
      className={`px-3 py-2 rounded-xl transition-all ${
        isYou ? "bg-accent-1/10 border border-accent-1/30" : "bg-bg-card/50"
      }`}
    >
      {/* Player Info Row */}
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2 min-w-0">
          <span className={`text-sm font-bold truncate ${isYou ? "text-accent-1" : "text-text-primary"}`}>
            {player.name}
          </span>
          {isYou && (
            <span className="text-[10px] px-1.5 py-0.5 bg-accent-1/20 text-accent-1 rounded-full font-bold shrink-0">
              YOU
            </span>
          )}
          {!player.isConnected && (
            <span className="text-[10px] px-1.5 py-0.5 bg-danger/20 text-danger rounded-full font-bold shrink-0">
              DC
            </span>
          )}
        </div>
        <span className={`text-sm font-bold tabular-nums ${isFinished ? "text-success" : "text-text-secondary"}`}>
          {player.progress}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="h-3 bg-bg-secondary/80 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-100 ease-out ${
            isFinished
              ? "bg-gradient-to-r from-success to-emerald-400"
              : isYou
                ? "bg-gradient-to-r from-accent-1 to-accent-2"
                : "bg-gradient-to-r from-text-muted to-text-secondary"
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
