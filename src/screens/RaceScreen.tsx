import type { RoomView, RacePlayerView, GamePhase } from "../types";
import { Countdown } from "../components/Countdown";
import { TapButton } from "../components/TapButton";
import { ProgressTrack } from "../components/ProgressTrack";
import { GAME_CONFIG } from "../config";

interface Props {
  room: RoomView;
  playerId: string;
  countdown: number | null;
  raceProgress: RacePlayerView[];
  phase: GamePhase;
  onTap: () => void;
}

export function RaceScreen({ room, playerId, countdown, raceProgress, phase, onTap }: Props) {
  // Use raceProgress if available (during racing), fallback to room players
  const players: RacePlayerView[] =
    raceProgress.length > 0
      ? raceProgress
      : room.players.map((p) => ({
          playerId: p.playerId,
          name: p.name,
          progress: p.progress,
          tapCount: p.tapCount,
          isConnected: p.isConnected,
        }));

  // Sort: your player first, then by progress descending
  const sorted = [...players].sort((a, b) => {
    if (a.playerId === playerId) return -1;
    if (b.playerId === playerId) return 1;
    return b.progress - a.progress;
  });

  const myPlayer = players.find((p) => p.playerId === playerId);
  const myProgress = myPlayer?.progress ?? 0;

  return (
    <div className="h-full flex flex-col relative">
      {/* Countdown Overlay */}
      {phase === "countdown" && countdown !== null && (
        <Countdown value={countdown} />
      )}

      {/* Progress Tracks */}
      <div className="flex-1 flex flex-col gap-2 px-4 pt-6 pb-4 overflow-y-auto">
        <div className="text-center mb-2">
          <p className="text-text-muted text-xs font-semibold uppercase tracking-wider">
            First to {GAME_CONFIG.FINISH_PROGRESS}
          </p>
        </div>

        {sorted.map((player) => (
          <ProgressTrack
            key={player.playerId}
            player={player}
            isYou={player.playerId === playerId}
            finishProgress={GAME_CONFIG.FINISH_PROGRESS}
          />
        ))}
      </div>

      {/* Tap Area */}
      <div className="px-4 pb-8 pt-2">
        <div className="text-center mb-3">
          <span className="text-4xl font-black text-text-primary tabular-nums">
            {myProgress}
          </span>
          <span className="text-text-muted text-lg font-bold ml-1">
            / {GAME_CONFIG.FINISH_PROGRESS}
          </span>
        </div>

        <TapButton
          onTap={onTap}
          disabled={phase !== "racing"}
        />
      </div>
    </div>
  );
}
