import { useState, useEffect } from "react";
import { getSavedName } from "../config";
import type { GameType, RoomListItem } from "../types";

interface Props {
  gameType: GameType;
  availableRooms: RoomListItem[];
  onCreateRoom: (name: string) => void;
  onJoinRoom: (roomId: string, name: string) => void;
  onBack: () => void;
}

const GAME_INFO: Record<GameType, { emoji: string; title: string; color: string }> = {
  "tap-race": { emoji: "🏁", title: "Tap Race", color: "text-accent-1" },
  "tug-war": { emoji: "🪢", title: "Tug of War", color: "text-orange-400" },
};

export function GameLobbyScreen({ gameType, availableRooms, onCreateRoom, onJoinRoom, onBack }: Props) {
  const [name, setName] = useState(getSavedName());
  const [roomCode, setRoomCode] = useState(() => {
    const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
    return params.get("room")?.toUpperCase().slice(0, 6) || "";
  });
  const [showManualJoin, setShowManualJoin] = useState(false);

  const isNameValid = name.trim().length > 0 && name.trim().length <= 20;
  const info = GAME_INFO[gameType];

  // Auto-join from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const room = params.get("room");
    if (room && isNameValid) {
      onJoinRoom(room.toUpperCase().slice(0, 6), name.trim());
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  return (
    <div className="h-full flex flex-col px-6 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="text-text-secondary hover:text-text-primary transition-colors text-sm font-medium"
        >
          ← Back
        </button>
        <div className="flex items-center gap-2">
          <span className="text-xl">{info.emoji}</span>
          <h2 className={`text-lg font-bold ${info.color}`}>{info.title}</h2>
        </div>
      </div>

      {/* Name Input */}
      <div className="mb-4">
        <label className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 block">
          Your Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name..."
          maxLength={20}
          className="w-full px-4 py-3 bg-bg-card border border-border rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-1 focus:ring-1 focus:ring-accent-1/50 transition-all"
        />
      </div>

      {/* Create Room */}
      <button
        onClick={() => {
          if (!isNameValid) return;
          onCreateRoom(name.trim());
        }}
        disabled={!isNameValid}
        className="w-full py-4 bg-gradient-to-r from-accent-1 to-accent-2 hover:from-accent-2 hover:to-accent-3 rounded-xl font-bold text-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed mb-4 animate-pulse-glow"
      >
        + Create Room
      </button>

      {/* Room List */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider">
            Available Rooms
          </h3>
          <button
            onClick={() => setShowManualJoin(!showManualJoin)}
            className="text-xs text-accent-1 hover:text-accent-2 font-semibold transition-colors"
          >
            {showManualJoin ? "Hide Code" : "Enter Code"}
          </button>
        </div>

        {/* Manual Join */}
        {showManualJoin && (
          <div className="flex flex-col gap-2 mb-4 animate-slide-up">
            <input
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase().slice(0, 6))}
              placeholder="ROOM CODE"
              maxLength={6}
              className="w-full px-4 py-3 bg-bg-card border border-border rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-1 focus:ring-1 focus:ring-accent-1/50 transition-all text-center font-mono text-lg tracking-widest uppercase"
            />
            <button
              onClick={() => {
                if (!isNameValid || roomCode.length < 4) return;
                onJoinRoom(roomCode, name.trim());
              }}
              disabled={!isNameValid || roomCode.length < 4}
              className="w-full py-3 bg-bg-card border-2 border-border hover:border-accent-1 rounded-xl font-bold text-text-primary transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Join by Code
            </button>
          </div>
        )}

        {/* Room Cards */}
        {availableRooms.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <span className="text-4xl mb-3">🏜️</span>
            <p className="text-text-secondary text-sm">No rooms yet</p>
            <p className="text-text-muted text-xs mt-1">Create one and invite friends!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {availableRooms.map((room) => (
              <button
                key={room.roomId}
                onClick={() => {
                  if (!isNameValid) return;
                  onJoinRoom(room.roomId, name.trim());
                }}
                disabled={!isNameValid}
                className="w-full flex items-center justify-between px-4 py-3 bg-bg-card border border-border rounded-xl hover:border-accent-1/50 transition-all text-left disabled:opacity-40"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-accent-1 tracking-wider">
                      {room.roomId}
                    </span>
                  </div>
                  <p className="text-text-secondary text-xs mt-0.5 truncate">
                    Host: {room.hostName}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-text-secondary text-xs font-medium">
                    {room.playerCount}/{room.maxPlayers}
                  </span>
                  <span className="text-accent-1 text-xs font-bold">JOIN →</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
