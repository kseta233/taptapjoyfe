import { IonBadge, IonButton, IonCard, IonCardContent, IonContent, IonPage, IonText } from "@ionic/react";
import { PlayerCard } from "../../components/PlayerCard";
import { RoomCode } from "../../components/RoomCode";
import type { RoomView } from "../../types";

interface RoomScreenViewProps {
  room: RoomView;
  playerId: string;
  isHost: boolean;
  isReady: boolean;
  connectedPlayersCount: number;
  canStart: boolean;
  onReadyToggle: () => void;
  onStart: () => void;
  onLeave: () => void;
}

export function RoomScreenView({
  room,
  playerId,
  isHost,
  isReady,
  connectedPlayersCount,
  canStart,
  onReadyToggle,
  onStart,
  onLeave,
}: RoomScreenViewProps) {
  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="h-full flex flex-col px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <IonButton onClick={onLeave} fill="clear" color="medium" size="small" className="px-0">
              {"<- Leave"}
            </IonButton>
            <RoomCode code={room.roomId} />
            <div className="w-16"></div>
          </div>

          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-1">
              <IonBadge color={room.gameType === "tug-war" ? "warning" : "primary"} className="text-xs">
                {room.gameType === "tug-war" ? "🪢 Tug of War" : "🏁 Tap Race"}
              </IonBadge>
            </div>
            <IonText color="light"><h2 className="text-3xl font-bold">Waiting Room</h2></IonText>
            <IonText color="medium"><p className="mt-1">{connectedPlayersCount}/{room.maxPlayers} players</p></IonText>
            {room.gameType === "tug-war" && (
              <IonText color="medium"><p className="mt-1 italic">Teams assigned on start</p></IonText>
            )}
          </div>

          <div className="flex-1 flex flex-col gap-3 overflow-y-auto">
            {room.players.map((player) => (
              <PlayerCard
                key={player.playerId}
                player={player}
                isYou={player.playerId === playerId}
                isHost={player.playerId === room.hostPlayerId}
              />
            ))}

            {Array.from({ length: room.maxPlayers - room.players.length }).map((_, i) => (
              <IonCard key={`empty-${i}`} className="border border-dashed border-border bg-transparent shadow-none">
                <IonCardContent className="flex items-center gap-3 px-4 py-3">
                  <div className="w-10 h-10 rounded-full bg-bg-secondary/50 flex items-center justify-center text-text-muted">?</div>
                  <IonText color="medium"><p className="text-sm italic">Waiting for player...</p></IonText>
                </IonCardContent>
              </IonCard>
            ))}
          </div>

          <div className="flex flex-col gap-3 mt-6">
            <IonButton
              onClick={onReadyToggle}
              color={isReady ? "success" : "medium"}
              fill={isReady ? "solid" : "outline"}
              expand="block"
              className={isReady ? "text-success border-success bg-success/20" : undefined}
            >
              {isReady ? "✓ Ready!" : "Ready Up"}
            </IonButton>

            {isHost && (
              <IonButton onClick={onStart} disabled={!canStart} color="primary" expand="block" className="disabled:opacity-30">
                {room.gameType === "tug-war" ? "🪢 Start Tug of War" : "🏁 Start Race"}
              </IonButton>
            )}

            {!isHost && (
              <IonText color="medium"><p className="text-center text-sm">Waiting for host to start...</p></IonText>
            )}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
