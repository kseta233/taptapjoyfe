import { IonButton, IonCard, IonCardContent, IonContent, IonPage, IonText } from "@ionic/react";
import type { TugResult } from "../../types";

interface TugWarResultScreenViewProps {
  result: TugResult;
  playerId: string;
  isDraw: boolean;
  isWinner: boolean;
  winnerColor: string;
  winnerLabel: string;
  leftPlayers: TugResult["players"];
  rightPlayers: TugResult["players"];
  onLeave: () => void;
}

export function TugWarResultScreenView({
  result,
  playerId,
  isDraw,
  isWinner,
  winnerColor,
  winnerLabel,
  leftPlayers,
  rightPlayers,
  onLeave,
}: TugWarResultScreenViewProps) {
  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="h-full flex flex-col items-center px-6 py-8">
          <div className="text-center mb-6 animate-slide-up">
            <div className="text-6xl mb-3">{isDraw ? "🤝" : isWinner ? "🏆" : "😤"}</div>
            <IonText className={`text-3xl font-bold ${winnerColor}`}>
              <h2>{isDraw ? "It's a Draw!" : isWinner ? "You Won!" : `${winnerLabel} Wins!`}</h2>
            </IonText>
            <IonText color="medium" className="mt-1">
              Final position: {result.finalRopePosition > 0 ? "+" : ""}
              {Math.round(result.finalRopePosition)}
            </IonText>
          </div>

          <div className="w-full max-w-sm mb-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <div className="h-4 bg-bg-secondary rounded-full relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1/2 bg-blue-500/10" />
              <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-orange-500/10" />
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-text-muted/30" />
              <div
                className="absolute top-0 bottom-0 w-3 rounded-full bg-white/80"
                style={{ left: `calc(50% + ${(result.finalRopePosition / 100) * 45}% - 6px)` }}
              />
            </div>
          </div>

          <div className="w-full max-w-sm flex gap-3 mb-6 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <IonCard className={`flex-1 ${result.winnerTeam === "left" ? "bg-blue-500/10 border-blue-500/40" : "bg-bg-card border-border"}`}>
              <IonCardContent className="p-4">
                <div className="mb-2 flex items-center justify-between">
                  <IonText className="text-blue-400 text-xs uppercase tracking-wide font-semibold">Left</IonText>
                {result.winnerTeam === "left" && <span className="text-xs">🏆</span>}
                </div>
                <IonText className="block text-blue-400 text-2xl font-bold">{result.leftTotalTaps}</IonText>
                <IonText color="medium">total taps</IonText>
              </IonCardContent>
            </IonCard>

            <IonCard className={`flex-1 ${result.winnerTeam === "right" ? "bg-orange-500/10 border-orange-500/40" : "bg-bg-card border-border"}`}>
              <IonCardContent className="p-4">
                <div className="mb-2 flex items-center justify-between">
                  <IonText className="text-orange-400 text-xs uppercase tracking-wide font-semibold">Right</IonText>
                {result.winnerTeam === "right" && <span className="text-xs">🏆</span>}
                </div>
                <IonText className="block text-orange-400 text-2xl font-bold">{result.rightTotalTaps}</IonText>
                <IonText color="medium">total taps</IonText>
              </IonCardContent>
            </IonCard>
          </div>

          <div className="w-full max-w-sm flex-1 overflow-y-auto animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <IonText color="medium"><h3 className="mb-3 text-xs uppercase tracking-wide font-semibold">Player Stats</h3></IonText>

            <div className="flex gap-3">
              <div className="flex-1 flex flex-col gap-2">
                {leftPlayers.map((player) => (
                  <IonCard
                    key={player.playerId}
                    className={`px-3 py-2 rounded-lg ${
                      player.playerId === playerId ? "bg-blue-500/10 border border-blue-500/30" : "bg-bg-card"
                    }`}
                  >
                    <IonCardContent className="p-0">
                      <div className="w-full flex items-center justify-between">
                        <IonText className="text-xs text-text-primary truncate max-w-[80px]">
                          {player.name}
                          {player.playerId === playerId && <span className="text-blue-400 ml-1">★</span>}
                        </IonText>
                        <IonText className="text-xs font-bold text-blue-400">{player.tapCount}</IonText>
                      </div>
                    </IonCardContent>
                  </IonCard>
                ))}
              </div>

              <div className="flex-1 flex flex-col gap-2">
                {rightPlayers.map((player) => (
                  <IonCard
                    key={player.playerId}
                    className={`px-3 py-2 rounded-lg ${
                      player.playerId === playerId ? "bg-orange-500/10 border border-orange-500/30" : "bg-bg-card"
                    }`}
                  >
                    <IonCardContent className="p-0">
                      <div className="w-full flex items-center justify-between">
                        <IonText className="text-xs text-text-primary truncate max-w-[80px]">
                          {player.name}
                          {player.playerId === playerId && <span className="text-orange-400 ml-1">★</span>}
                        </IonText>
                        <IonText className="text-xs font-bold text-orange-400">{player.tapCount}</IonText>
                      </div>
                    </IonCardContent>
                  </IonCard>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full max-w-sm mt-6">
            <IonButton onClick={onLeave} color="primary" expand="block">
              Back to Home
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
