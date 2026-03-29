import { IonButton, IonContent, IonInput, IonPage, IonText } from "@ionic/react";
import type { GameType, RoomListItem } from "../../types";
import type { GameLobbyInfo } from "./data";

interface GameLobbyScreenViewProps {
  gameType: GameType;
  info: GameLobbyInfo;
  availableRooms: RoomListItem[];
  name: string;
  roomCode: string;
  showManualJoin: boolean;
  isNameValid: boolean;
  onNameChange: (value: string) => void;
  onRoomCodeChange: (value: string) => void;
  onToggleManualJoin: () => void;
  onCreateRoom: () => void;
  onJoinByCode: () => void;
  onJoinRoom: (roomId: string) => void;
  onBack: () => void;
}

export function GameLobbyScreenView({
  info,
  availableRooms,
  name,
  roomCode,
  showManualJoin,
  isNameValid,
  onNameChange,
  onRoomCodeChange,
  onToggleManualJoin,
  onCreateRoom,
  onJoinByCode,
  onJoinRoom,
  onBack,
}: GameLobbyScreenViewProps) {
  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="h-full flex flex-col px-6 py-8">
          <div className="flex items-center gap-3 mb-6">
            <IonButton onClick={onBack} fill="clear" color="medium" size="small" className="px-0">
              {"<- Back"}
            </IonButton>
            <div className="flex items-center gap-2">
              <span className="text-xl">{info.emoji}</span>
              <h2 className={`text-lg font-bold ${info.color}`}>{info.title}</h2>
            </div>
          </div>

          <div className="mb-4">
            <IonText color="medium">
              <label className="mb-2 block text-xs uppercase tracking-wide font-semibold">Your Name</label>
            </IonText>
            <IonInput
              type="text"
              value={name}
              onIonInput={(e) => onNameChange(e.detail.value ?? "")}
              placeholder="Enter your name..."
              maxlength={20}
              fill="outline"
              className="rounded-xl"
            />
          </div>

          <IonButton
            onClick={onCreateRoom}
            disabled={!isNameValid}
            expand="block"
            color="primary"
            size="default"
            className="mb-4"
          >
            + Create Room
          </IonButton>

          <div className="flex-1 overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <IonText color="medium">
                <h3 className="text-xs uppercase tracking-wide font-semibold">Available Rooms</h3>
              </IonText>
              <IonButton
                onClick={onToggleManualJoin}
                fill="clear"
                color="primary"
                size="small"
                className="px-0 text-xs"
              >
                {showManualJoin ? "Hide Code" : "Enter Code"}
              </IonButton>
            </div>

            {showManualJoin && (
              <div className="flex flex-col gap-2 mb-4 animate-slide-up">
                <IonInput
                  type="text"
                  value={roomCode}
                  onIonInput={(e) => onRoomCodeChange((e.detail.value ?? "").toUpperCase())}
                  placeholder="ROOM CODE"
                  maxlength={6}
                  fill="outline"
                  className="rounded-xl font-mono tracking-wider"
                />
                <IonButton
                  onClick={onJoinByCode}
                  disabled={!isNameValid || roomCode.length < 4}
                  expand="block"
                  fill="outline"
                  color="medium"
                >
                  Join by Code
                </IonButton>
              </div>
            )}

            {availableRooms.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <span className="text-4xl mb-3">🏜️</span>
                <IonText color="light"><p>No rooms yet</p></IonText>
                <IonText color="medium"><p className="mt-1">Create one and invite friends!</p></IonText>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {availableRooms.map((room) => (
                  <IonButton
                    key={room.roomId}
                    onClick={() => onJoinRoom(room.roomId)}
                    disabled={!isNameValid}
                    expand="block"
                    fill="outline"
                    color="medium"
                    className="text-left"
                  >
                    <div className="w-full flex items-center justify-between gap-3 px-1">
                      <div className="min-w-0 text-left">
                        <span className="font-mono font-bold text-sm text-accent-1 tracking-wider">{room.roomId}</span>
                        <p className="text-text-secondary text-xs mt-0.5 truncate">Host: {room.hostName}</p>
                      </div>
                      <div className="shrink-0 flex items-center gap-2">
                        <span className="text-text-secondary text-xs font-medium">{room.playerCount}/{room.maxPlayers}</span>
                        <span className="text-accent-1 text-xs font-bold">{"JOIN ->"}</span>
                      </div>
                    </div>
                  </IonButton>
                ))}
              </div>
            )}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
