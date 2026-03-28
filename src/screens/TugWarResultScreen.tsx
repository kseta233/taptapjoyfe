import type { TugResult } from "../types";

interface Props {
  result: TugResult;
  playerId: string;
  onLeave: () => void;
}

export function TugWarResultScreen({ result, playerId, onLeave }: Props) {
  const myPlayer = result.players.find((p) => p.playerId === playerId);
  const myTeam = myPlayer?.team;
  const isWinner =
    result.winnerTeam !== "draw" && myTeam === result.winnerTeam;
  const isDraw = result.winnerTeam === "draw";

  const leftPlayers = result.players.filter((p) => p.team === "left");
  const rightPlayers = result.players.filter((p) => p.team === "right");

  const winnerColor =
    result.winnerTeam === "left"
      ? "text-blue-400"
      : result.winnerTeam === "right"
        ? "text-orange-400"
        : "text-text-muted";

  const winnerLabel =
    result.winnerTeam === "left"
      ? "Left Team"
      : result.winnerTeam === "right"
        ? "Right Team"
        : "Draw";

  return (
    <div className="h-full flex flex-col items-center px-6 py-8">
      {/* Winner Announcement */}
      <div className="text-center mb-6 animate-slide-up">
        <div className="text-6xl mb-3">
          {isDraw ? "🤝" : isWinner ? "🏆" : "😤"}
        </div>
        <h2 className={`text-3xl font-black ${winnerColor}`}>
          {isDraw ? "It's a Draw!" : isWinner ? "You Won!" : `${winnerLabel} Wins!`}
        </h2>
        <p className="text-text-secondary mt-1 text-sm">
          Final position: {result.finalRopePosition > 0 ? "+" : ""}{Math.round(result.finalRopePosition)}
        </p>
      </div>

      {/* Rope final position visualization */}
      <div className="w-full max-w-sm mb-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
        <div className="h-4 bg-bg-secondary rounded-full relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1/2 bg-blue-500/10" />
          <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-orange-500/10" />
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-text-muted/30" />
          <div
            className="absolute top-0 bottom-0 w-3 rounded-full bg-white/80"
            style={{
              left: `calc(50% + ${(result.finalRopePosition / 100) * 45}% - 6px)`,
            }}
          />
        </div>
      </div>

      {/* Team Scores */}
      <div className="w-full max-w-sm flex gap-3 mb-6 animate-slide-up" style={{ animationDelay: "0.2s" }}>
        {/* Left Team */}
        <div className={`flex-1 p-4 rounded-xl border ${
          result.winnerTeam === "left"
            ? "bg-blue-500/10 border-blue-500/40"
            : "bg-bg-card border-border"
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-blue-400 text-xs font-bold uppercase">Left</span>
            {result.winnerTeam === "left" && <span className="text-xs">🏆</span>}
          </div>
          <div className="text-blue-400 text-2xl font-black">{result.leftTotalTaps}</div>
          <div className="text-text-muted text-xs">total taps</div>
        </div>

        {/* Right Team */}
        <div className={`flex-1 p-4 rounded-xl border ${
          result.winnerTeam === "right"
            ? "bg-orange-500/10 border-orange-500/40"
            : "bg-bg-card border-border"
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-orange-400 text-xs font-bold uppercase">Right</span>
            {result.winnerTeam === "right" && <span className="text-xs">🏆</span>}
          </div>
          <div className="text-orange-400 text-2xl font-black">{result.rightTotalTaps}</div>
          <div className="text-text-muted text-xs">total taps</div>
        </div>
      </div>

      {/* Player Breakdown */}
      <div className="w-full max-w-sm flex-1 overflow-y-auto animate-slide-up" style={{ animationDelay: "0.3s" }}>
        <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
          Player Stats
        </h3>

        <div className="flex gap-3">
          {/* Left column */}
          <div className="flex-1 flex flex-col gap-2">
            {leftPlayers.map((p) => (
              <div
                key={p.playerId}
                className={`flex items-center justify-between px-3 py-2 rounded-lg ${
                  p.playerId === playerId ? "bg-blue-500/10 border border-blue-500/30" : "bg-bg-card"
                }`}
              >
                <span className="text-xs text-text-primary truncate max-w-[80px]">
                  {p.name}
                  {p.playerId === playerId && <span className="text-blue-400 ml-1">★</span>}
                </span>
                <span className="text-xs font-bold text-blue-400">{p.tapCount}</span>
              </div>
            ))}
          </div>

          {/* Right column */}
          <div className="flex-1 flex flex-col gap-2">
            {rightPlayers.map((p) => (
              <div
                key={p.playerId}
                className={`flex items-center justify-between px-3 py-2 rounded-lg ${
                  p.playerId === playerId ? "bg-orange-500/10 border border-orange-500/30" : "bg-bg-card"
                }`}
              >
                <span className="text-xs text-text-primary truncate max-w-[80px]">
                  {p.name}
                  {p.playerId === playerId && <span className="text-orange-400 ml-1">★</span>}
                </span>
                <span className="text-xs font-bold text-orange-400">{p.tapCount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="w-full max-w-sm mt-6">
        <button
          onClick={onLeave}
          className="w-full py-4 bg-gradient-to-r from-accent-1 to-accent-2 hover:from-accent-2 hover:to-accent-3 rounded-xl font-bold text-lg transition-all"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
