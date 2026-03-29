import { IonButton, IonContent, IonPage, IonText } from "@ionic/react";
import type { GameType } from "../../types";
import type { HomeGameOption } from "./data";

interface HomeScreenViewProps {
  games: HomeGameOption[];
  onSelectGame: (gameType: GameType) => void;
}

export function HomeScreenView({ games, onSelectGame }: HomeScreenViewProps) {
  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="h-full flex flex-col items-center justify-center px-6 gap-10">
          <div className="text-center animate-float">
            <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-accent-1 via-accent-2 to-accent-3 bg-clip-text text-transparent">
              TapTapJoy
            </h1>
            <IonText color="medium">
              <p className="mt-2 font-medium">Choose your game</p>
            </IonText>
          </div>

          <div className="w-full max-w-sm flex flex-col gap-4">
            {games.map((game, i) => (
              <IonButton
                key={game.type}
                onClick={() => onSelectGame(game.type)}
                expand="block"
                fill="solid"
                color="primary"
                className="w-full rounded-2xl text-left animate-slide-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="w-full flex items-center gap-4 px-3 py-2">
                  <span className="text-4xl">{game.emoji}</span>
                  <div className="text-left">
                    <h2 className="text-xl font-bold text-white">
                      {game.title}
                    </h2>
                    <p className="text-white/70 mt-0.5">{game.description}</p>
                  </div>
                </div>
              </IonButton>
            ))}
          </div>

          <IonText color="medium">
            <p>2-4 players • Real-time multiplayer</p>
          </IonText>
        </div>
      </IonContent>
    </IonPage>
  );
}
