import { useGame } from "./hooks/useGame";
import { LobbyScreen } from "./screens/LobbyScreen";
import { RoomScreen } from "./screens/RoomScreen";
import { RaceScreen } from "./screens/RaceScreen";
import { ResultScreen } from "./screens/ResultScreen";

export default function App() {
  const game = useGame();

  // Error toast
  const errorToast = game.error ? (
    <div
      className="fixed top-4 left-4 right-4 z-50 bg-danger/90 text-white px-4 py-3 rounded-xl text-sm font-medium text-center backdrop-blur-sm animate-slide-up cursor-pointer"
      onClick={game.clearError}
    >
      {game.error}
    </div>
  ) : null;

  // Disconnected overlay
  if (game.socketState === "disconnected" && game.phase !== "lobby") {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-6 px-6">
        {errorToast}
        <div className="text-6xl">😵</div>
        <h2 className="text-2xl font-bold text-text-primary">Disconnected</h2>
        <p className="text-text-secondary text-center">Connection lost. Go back to lobby and rejoin.</p>
        <button
          onClick={game.leaveRoom}
          className="px-8 py-3 bg-accent-1 hover:bg-accent-2 rounded-xl font-semibold transition-colors"
        >
          Back to Lobby
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {errorToast}

      {game.phase === "lobby" && (
        <LobbyScreen
          onCreateRoom={game.createRoom}
          onJoinRoom={game.joinRoom}
        />
      )}

      {game.phase === "room" && game.room && (
        <RoomScreen
          room={game.room}
          playerId={game.playerId}
          onReady={game.setReady}
          onStart={game.startRace}
          onLeave={game.leaveRoom}
        />
      )}

      {(game.phase === "countdown" || game.phase === "racing") && game.room && (
        <RaceScreen
          room={game.room}
          playerId={game.playerId}
          countdown={game.countdown}
          raceProgress={game.raceProgress}
          phase={game.phase}
          onTap={game.tap}
        />
      )}

      {game.phase === "result" && (
        <ResultScreen
          rankings={game.rankings}
          playerId={game.playerId}
          onLeave={game.leaveRoom}
        />
      )}
    </div>
  );
}
