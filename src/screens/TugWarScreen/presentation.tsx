import { IonBadge, IonCard, IonCardContent, IonContent, IonPage, IonText } from "@ionic/react";
import { Countdown } from "../../components/Countdown";
import type { GamePhase, RoomView } from "../../types";

interface TugWarScreenViewProps {
  room: RoomView;
  playerId: string;
  countdown: number | null;
  phase: GamePhase;
  myTeam: "left" | "right";
  isPlaying: boolean;
  ropePos: number;
  ropeOffset: number;
  leftForce: number;
  rightForce: number;
  seconds: number;
  isLeftDanger: boolean;
  isRightDanger: boolean;
  leftTeam: RoomView["players"];
  rightTeam: RoomView["players"];
  onTapDown: (e: React.PointerEvent) => void;
}

export function TugWarScreenView({
  countdown,
  phase,
  myTeam,
  isPlaying,
  ropePos,
  ropeOffset,
  leftForce,
  rightForce,
  seconds,
  isLeftDanger,
  isRightDanger,
  leftTeam,
  rightTeam,
  playerId,
  onTapDown,
}: TugWarScreenViewProps) {
  return (
    <IonPage>
      <IonContent fullscreen>
        <div
          className="h-full flex flex-col relative select-none overflow-hidden"
          style={{ touchAction: "none" }}
          onPointerDown={onTapDown}
        >
          {phase === "countdown" && countdown !== null && <Countdown value={countdown} />}

          <div className="flex items-center justify-between px-4 pt-6 pb-2 pointer-events-none z-10">
            <IonBadge color={myTeam === "left" ? "primary" : "warning"} className="text-sm px-3 py-1">
              You: {myTeam === "left" ? "<- LEFT" : "RIGHT ->"}
            </IonBadge>

            <IonText className={`text-2xl font-black tabular-nums ${seconds <= 10 ? "text-danger" : "text-text-primary"}`}>
              {seconds}s
            </IonText>

            <IonText color="medium" className="w-20 text-right text-xs uppercase tracking-wide font-semibold">TAP TO PULL</IonText>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center pointer-events-none relative">
            <div className={`absolute left-0 top-0 bottom-0 w-8 transition-opacity duration-300 ${isLeftDanger ? "opacity-100" : "opacity-0"} bg-gradient-to-r from-blue-500/30 to-transparent`} />
            <div className={`absolute right-0 top-0 bottom-0 w-8 transition-opacity duration-300 ${isRightDanger ? "opacity-100" : "opacity-0"} bg-gradient-to-l from-orange-500/30 to-transparent`} />

            <div className="w-full flex justify-between px-6 mb-4">
              <IonCard className="text-center min-w-[120px] bg-bg-card/60 border border-border shadow-none">
                <IonCardContent className="px-4 py-2">
                  <IonText className="text-blue-400 text-xs uppercase tracking-wide font-semibold">Left Team</IonText>
                  <IonText className="block text-blue-400 text-2xl font-bold tabular-nums mt-1">{Math.round(leftForce)}</IonText>
                </IonCardContent>
              </IonCard>
              <IonCard className="text-center min-w-[120px] bg-bg-card/60 border border-border shadow-none">
                <IonCardContent className="px-4 py-2">
                  <IonText className="text-orange-400 text-xs uppercase tracking-wide font-semibold">Right Team</IonText>
                  <IonText className="block text-orange-400 text-2xl font-bold tabular-nums mt-1">{Math.round(rightForce)}</IonText>
                </IonCardContent>
              </IonCard>
            </div>

            <div className="relative w-full px-4">
              <div className="h-3 bg-bg-secondary rounded-full relative overflow-hidden mx-8">
                <div className="absolute left-0 top-0 bottom-0 w-1/2 bg-blue-500/10" />
                <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-orange-500/10" />
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-text-muted/30 -translate-x-0.5" />
              </div>

              <div
                className="absolute top-1/2 -translate-y-1/2 transition-all duration-75 ease-out"
                style={{ left: `calc(50% + ${ropeOffset}px - 16px)` }}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
                    ropePos < -10
                      ? "bg-blue-500/30 border-blue-400 text-blue-400"
                      : ropePos > 10
                        ? "bg-orange-500/30 border-orange-400 text-orange-400"
                        : "bg-bg-card border-text-muted text-text-primary"
                  }`}
                >
                  ⚑
                </div>
              </div>
            </div>

            <div className="mt-4 text-center">
              <IonText className={`text-3xl font-black tabular-nums ${ropePos < -10 ? "text-blue-400" : ropePos > 10 ? "text-orange-400" : "text-text-muted"}`}>
                {ropePos > 0 ? "+" : ""}
                {Math.round(ropePos)}
              </IonText>
            </div>

            <div className="w-full flex justify-between px-4 mt-8">
              <div className="flex flex-col gap-1">
                {leftTeam.map((player) => (
                  <div key={player.playerId} className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${player.playerId === playerId ? "bg-blue-500 text-white" : "bg-blue-500/20 text-blue-400"}`}>
                      {player.name.charAt(0).toUpperCase()}
                    </div>
                    <IonText className="text-xs truncate max-w-[80px]">
                      {player.name}
                      {player.playerId === playerId && <span className="text-blue-400 ml-1">(you)</span>}
                    </IonText>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-1 items-end">
                {rightTeam.map((player) => (
                  <div key={player.playerId} className="flex items-center gap-2">
                    <IonText className="text-xs truncate max-w-[80px] text-right">
                      {player.playerId === playerId && <span className="text-orange-400 mr-1">(you)</span>}
                      {player.name}
                    </IonText>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${player.playerId === playerId ? "bg-orange-500 text-white" : "bg-orange-500/20 text-orange-400"}`}>
                      {player.name.charAt(0).toUpperCase()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pb-8 pt-4 text-center pointer-events-none">
            <IonText className={`text-lg font-semibold ${isPlaying ? (myTeam === "left" ? "text-blue-400" : "text-orange-400") : "text-text-muted"}`}>
              {isPlaying ? "TAP ANYWHERE TO PULL!" : "Wait..."}
            </IonText>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
