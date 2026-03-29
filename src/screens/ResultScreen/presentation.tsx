import { IonBadge, IonButton, IonContent, IonPage, IonText } from "@ionic/react";
import type { RacePlayerView } from "../../types";
import { MEDALS, POSITION_COLORS } from "./data";

interface ResultScreenViewProps {
  rankings: RacePlayerView[];
  playerId: string;
  isWinner: boolean;
  winnerName?: string;
  winnerTapCount?: number;
  onLeave: () => void;
}

export function ResultScreenView({
  rankings,
  playerId,
  isWinner,
  winnerName,
  winnerTapCount,
  onLeave,
}: ResultScreenViewProps) {
  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="h-full flex flex-col items-center px-6 py-8">
          <div className="text-center mb-8 animate-slide-up">
            <div className="text-6xl mb-3">{isWinner ? "👑" : "🏁"}</div>
            <IonText color="light"><h2 className="text-3xl font-bold">{isWinner ? "You Won!" : `${winnerName} Wins!`}</h2></IonText>
            <IonText color="medium"><p className="mt-1">{winnerTapCount} taps</p></IonText>
          </div>

          <div className="w-full max-w-sm flex flex-col gap-3 flex-1 overflow-y-auto">
            <IonText color="medium"><h3 className="text-xs uppercase tracking-wide font-semibold">Final Rankings</h3></IonText>

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
                  <span className="text-2xl w-8 text-center">{MEDALS[i] || `${i + 1}`}</span>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-bold text-text-primary truncate">{player.name}</span>
                      {isYou && <IonBadge color="primary" className="text-xs px-2 font-semibold">YOU</IonBadge>}
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-text-secondary text-xs">Progress: {player.progress}</span>
                      <span className="text-text-muted text-xs">•</span>
                      <span className="text-text-secondary text-xs">Taps: {player.tapCount}</span>
                    </div>
                  </div>

                  {player.finishOrder && player.finishOrder <= 3 && (
                    <IonText className="text-success font-bold text-xs">✓ FINISH</IonText>
                  )}
                </div>
              );
            })}
          </div>

          <div className="w-full max-w-sm mt-6">
            <IonButton onClick={onLeave} color="primary" expand="block">
              Back to Lobby
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
