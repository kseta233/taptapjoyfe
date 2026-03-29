import { IonCard, IonCardContent, IonContent, IonPage, IonText } from "@ionic/react";
import { Countdown } from "../../components/Countdown";
import { ProgressTrack } from "../../components/ProgressTrack";
import { TapButton } from "../../components/TapButton";
import { GAME_CONFIG } from "../../config";
import type { GamePhase, RacePlayerView } from "../../types";

interface RaceScreenViewProps {
  countdown: number | null;
  phase: GamePhase;
  players: RacePlayerView[];
  playerId: string;
  myProgress: number;
  onTap: () => void;
}

export function RaceScreenView({ countdown, phase, players, playerId, myProgress, onTap }: RaceScreenViewProps) {
  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="h-full flex flex-col relative">
          {phase === "countdown" && countdown !== null && <Countdown value={countdown} />}

          <div className="flex-1 flex flex-col gap-2 px-4 pt-6 pb-4 overflow-y-auto">
            <div className="text-center mb-2">
              <IonText color="medium">
                <p className="text-xs uppercase tracking-wide font-semibold">First to {GAME_CONFIG.FINISH_PROGRESS}</p>
              </IonText>
            </div>

            {players.map((player) => (
              <ProgressTrack
                key={player.playerId}
                player={player}
                isYou={player.playerId === playerId}
                finishProgress={GAME_CONFIG.FINISH_PROGRESS}
              />
            ))}
          </div>

          <div className="px-4 pb-8 pt-2">
            <IonCard className="text-center mb-3 py-2 bg-bg-card/60 border border-border shadow-none">
              <IonCardContent>
                <IonText className="text-4xl font-black tabular-nums text-text-primary">
                  {myProgress}
                </IonText>
                <IonText color="medium" className="text-lg font-bold ml-1">
                  / {GAME_CONFIG.FINISH_PROGRESS}
                </IonText>
              </IonCardContent>
            </IonCard>

            <TapButton onTap={onTap} disabled={phase !== "racing"} />
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
