import { useCallback } from "react";
import type { RoomView, TugState, GamePhase } from "../types";
import { Countdown } from "../components/Countdown";

interface Props {
  room: RoomView;
  playerId: string;
  countdown: number | null;
  tugState: TugState | null;
  phase: GamePhase;
  onTap: () => void;
}

export function TugWarScreen({ room, playerId, countdown, tugState, phase, onTap }: Props) {
  const myPlayer = room.players.find((p) => p.playerId === playerId);
  const myTeam = myPlayer?.team ?? "left";
  const isPlaying = phase === "tug-playing";

  const ropePos = tugState?.ropePosition ?? 0;
  const timeLeft = tugState?.timeLeftMs ?? 60000;
  const leftForce = tugState?.leftForce ?? 0;
  const rightForce = tugState?.rightForce ?? 0;

  // Rope visual offset: map -100..+100 to pixel range
  const maxOffset = 140;
  const ropeOffset = (ropePos / 100) * maxOffset;

  // Timer formatting
  const seconds = Math.ceil(timeLeft / 1000);

  // Danger zone: rope near edge
  const dangerThreshold = 70;
  const isLeftDanger = ropePos <= -dangerThreshold;
  const isRightDanger = ropePos >= dangerThreshold;

  const handleTap = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      if (!isPlaying) return;
      onTap();

      // Haptic
      if (navigator.vibrate) {
        navigator.vibrate(10);
      }
    },
    [isPlaying, onTap]
  );

  return (
    <div
      className="h-full flex flex-col relative select-none overflow-hidden"
      style={{ touchAction: "none" }}
      onPointerDown={handleTap}
    >
      {/* Countdown Overlay */}
      {phase === "countdown" && countdown !== null && (
        <Countdown value={countdown} />
      )}

      {/* Top Bar: Timer + Team indicator */}
      <div className="flex items-center justify-between px-4 pt-6 pb-2 pointer-events-none z-10">
        <div className={`text-sm font-bold px-3 py-1 rounded-full ${
          myTeam === "left"
            ? "bg-blue-500/20 text-blue-400"
            : "bg-orange-500/20 text-orange-400"
        }`}>
          You: {myTeam === "left" ? "⬅ LEFT" : "RIGHT ➡"}
        </div>

        <div className={`text-2xl font-black tabular-nums ${seconds <= 10 ? "text-danger" : "text-text-primary"}`}>
          {seconds}s
        </div>

        <div className="text-xs text-text-muted font-semibold w-20 text-right">
          TAP TO PULL
        </div>
      </div>

      {/* Main Arena */}
      <div className="flex-1 flex flex-col items-center justify-center pointer-events-none relative">
        {/* Danger zones */}
        <div className={`absolute left-0 top-0 bottom-0 w-8 transition-opacity duration-300 ${
          isLeftDanger ? "opacity-100" : "opacity-0"
        } bg-gradient-to-r from-blue-500/30 to-transparent`} />
        <div className={`absolute right-0 top-0 bottom-0 w-8 transition-opacity duration-300 ${
          isRightDanger ? "opacity-100" : "opacity-0"
        } bg-gradient-to-l from-orange-500/30 to-transparent`} />

        {/* Team Labels */}
        <div className="w-full flex justify-between px-6 mb-4">
          <div className="text-center">
            <span className="text-blue-400 text-xs font-bold uppercase">Left Team</span>
            <div className="text-blue-400 text-lg font-black tabular-nums mt-1">
              {tugState?.leftForce ? Math.round(leftForce) : 0}
            </div>
          </div>
          <div className="text-center">
            <span className="text-orange-400 text-xs font-bold uppercase">Right Team</span>
            <div className="text-orange-400 text-lg font-black tabular-nums mt-1">
              {tugState?.rightForce ? Math.round(rightForce) : 0}
            </div>
          </div>
        </div>

        {/* Rope visualization */}
        <div className="relative w-full px-4">
          {/* Track */}
          <div className="h-3 bg-bg-secondary rounded-full relative overflow-hidden mx-8">
            {/* Left zone */}
            <div className="absolute left-0 top-0 bottom-0 w-1/2 bg-blue-500/10" />
            {/* Right zone */}
            <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-orange-500/10" />
            {/* Center line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-text-muted/30 -translate-x-0.5" />
          </div>

          {/* Flag / Knot */}
          <div
            className="absolute top-1/2 -translate-y-1/2 transition-all duration-75 ease-out"
            style={{
              left: `calc(50% + ${ropeOffset}px - 16px)`,
            }}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
              ropePos < -10
                ? "bg-blue-500/30 border-blue-400 text-blue-400"
                : ropePos > 10
                  ? "bg-orange-500/30 border-orange-400 text-orange-400"
                  : "bg-bg-card border-text-muted text-text-primary"
            }`}>
              ⚑
            </div>
          </div>
        </div>

        {/* Rope position indicator */}
        <div className="mt-4 text-center">
          <span className={`text-3xl font-black tabular-nums ${
            ropePos < -10
              ? "text-blue-400"
              : ropePos > 10
                ? "text-orange-400"
                : "text-text-muted"
          }`}>
            {ropePos > 0 ? "+" : ""}{Math.round(ropePos)}
          </span>
        </div>

        {/* Player teams */}
        <div className="w-full flex justify-between px-4 mt-8">
          {/* Left team */}
          <div className="flex flex-col gap-1">
            {room.players
              .filter((p) => p.team === "left")
              .map((p) => (
                <div key={p.playerId} className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    p.playerId === playerId ? "bg-blue-500 text-white" : "bg-blue-500/20 text-blue-400"
                  }`}>
                    {p.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs text-text-secondary truncate max-w-[80px]">
                    {p.name}
                    {p.playerId === playerId && <span className="text-blue-400 ml-1">(you)</span>}
                  </span>
                </div>
              ))}
          </div>

          {/* Right team */}
          <div className="flex flex-col gap-1 items-end">
            {room.players
              .filter((p) => p.team === "right")
              .map((p) => (
                <div key={p.playerId} className="flex items-center gap-2">
                  <span className="text-xs text-text-secondary truncate max-w-[80px] text-right">
                    {p.playerId === playerId && <span className="text-orange-400 mr-1">(you)</span>}
                    {p.name}
                  </span>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    p.playerId === playerId ? "bg-orange-500 text-white" : "bg-orange-500/20 text-orange-400"
                  }`}>
                    {p.name.charAt(0).toUpperCase()}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Bottom: Tap prompt */}
      <div className="pb-8 pt-4 text-center pointer-events-none">
        <p className={`text-lg font-bold ${
          isPlaying
            ? myTeam === "left" ? "text-blue-400" : "text-orange-400"
            : "text-text-muted"
        }`}>
          {isPlaying ? "TAP ANYWHERE TO PULL!" : "Wait..."}
        </p>
      </div>
    </div>
  );
}
