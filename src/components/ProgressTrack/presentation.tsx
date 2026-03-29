import { IonBadge, IonCard, IonCardContent, IonText } from "@ionic/react";
import type { RacePlayerView } from "../../types";
import { getProgressPercent, isProgressFinished } from "./data";

interface Props {
  player: RacePlayerView;
  isYou: boolean;
  finishProgress: number;
}

export function ProgressTrack({ player, isYou, finishProgress }: Props) {
  const percent = getProgressPercent(player.progress, finishProgress);
  const isFinished = isProgressFinished(player.progress, finishProgress);

  return (
    <IonCard
      className={`px-3 py-2 transition-all ${
        isYou ? "bg-accent-1/10 border border-accent-1/30" : "bg-bg-card/50"
      }`}
    >
      <IonCardContent className="p-0">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2 min-w-0">
            <IonText className={`font-bold truncate ${isYou ? "text-accent-1" : "text-text-primary"}`}>
              {player.name}
            </IonText>
            {isYou && (
              <IonBadge color="primary" className="px-1.5 shrink-0">
                YOU
              </IonBadge>
            )}
            {!player.isConnected && (
              <IonBadge color="danger" className="px-1.5 shrink-0">
                DC
              </IonBadge>
            )}
          </div>
          <IonText className={`font-bold tabular-nums ${isFinished ? "text-success" : "text-text-secondary"}`}>
            {player.progress}
          </IonText>
        </div>

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
      </IonCardContent>
    </IonCard>
  );
}
