import { useState, useEffect } from "react";
import { getSavedName } from "../config";

interface Props {
  onCreateRoom: (name: string, maxPlayers?: number) => void;
  onJoinRoom: (roomId: string, name: string) => void;
}

export function LobbyScreen({ onCreateRoom, onJoinRoom }: Props) {
  const [name, setName] = useState(getSavedName());
  const [roomCode, setRoomCode] = useState(() => {
    const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
    return params.get("room")?.toUpperCase().slice(0, 6) || "";
  });

  const isNameValid = name.trim().length > 0 && name.trim().length <= 20;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const room = params.get("room");
    if (room && isNameValid) {
      onJoinRoom(room.toUpperCase().slice(0, 6), name.trim());
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  return (
    <div className="h-full flex flex-col items-center justify-center px-6 gap-8">
      {/* Logo / Title */}
      <div className="text-center animate-float">
        <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-accent-1 via-accent-2 to-accent-3 bg-clip-text text-transparent">
          TapTapJoy
        </h1>
        <p className="text-text-secondary mt-2 text-sm font-medium">
          Tap to Race. Beat your friends.
        </p>
      </div>

      {/* Name Input */}
      <div className="w-full max-w-sm animate-slide-up">
        <label className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 block">
          Your Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name..."
          maxLength={20}
          className="w-full px-4 py-3 bg-bg-card border border-border rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-1 focus:ring-1 focus:ring-accent-1/50 transition-all text-lg"
        />
      </div>

      {/* Action Buttons */}
      <div className="w-full max-w-sm flex flex-col gap-3 animate-slide-up" style={{ animationDelay: "0.1s" }}>
        <button
          onClick={() => {
            if (!isNameValid) return;
            onCreateRoom(name.trim());
          }}
          disabled={!isNameValid}
          className="w-full py-4 bg-gradient-to-r from-accent-1 to-accent-2 hover:from-accent-2 hover:to-accent-3 rounded-xl font-bold text-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed animate-pulse-glow"
        >
          🏁 Create Room
        </button>

        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-border"></div>
          <span className="text-text-muted text-xs font-semibold uppercase">or</span>
          <div className="h-px flex-1 bg-border"></div>
        </div>

        <div className="flex flex-col gap-3">
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
            className="w-full py-4 bg-bg-card border-2 border-border hover:border-accent-1 rounded-xl font-bold text-lg text-text-primary transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Join Room
          </button>
        </div>
      </div>

      {/* Footer */}
      <p className="text-text-muted text-xs mt-4">
        2–4 players • First to 100 taps wins
      </p>
    </div>
  );
}
