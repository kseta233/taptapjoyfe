import { IonBadge, IonCard, IonCardContent, IonText } from "@ionic/react";
import type { PlayerView } from "../../types";

interface Props {
  player: PlayerView;
  isYou: boolean;
  isHost: boolean;
}

export function PlayerCard({ player, isYou, isHost }: Props) {
  return (
    <IonCard
      className={`px-4 py-3 transition-all ${
        isYou
          ? "bg-accent-1/10 border-accent-1/30"
          : "bg-bg-card border-border"
      } ${!player.isConnected ? "opacity-50" : ""}`}
    >
      <IonCardContent className="p-0">
        <div className="w-full flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
              isYou
                ? "bg-accent-1/20 text-accent-1"
                : "bg-bg-secondary text-text-secondary"
            }`}
          >
            {player.name.charAt(0).toUpperCase()}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <IonText className="font-semibold text-text-primary truncate">
                {player.name}
              </IonText>
              {isYou && (
                <IonBadge color="primary" className="px-1.5">
                  YOU
                </IonBadge>
              )}
              {isHost && (
                <IonBadge color="warning" className="px-1.5">
                  HOST
                </IonBadge>
              )}
            </div>
          </div>

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
      </IonCardContent>
    </IonCard>
  );
}
