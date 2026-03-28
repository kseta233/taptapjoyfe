import type { GameType } from "../types";

interface Props {
  onSelectGame: (gameType: GameType) => void;
}

const GAMES = [
  {
    type: "tap-race" as GameType,
    emoji: "🏁",
    title: "Tap Race",
    description: "First to 100 taps wins!",
    gradient: "from-accent-1 to-accent-2",
    glow: "shadow-[0_0_30px_rgba(99,102,241,0.3)]",
  },
  {
    type: "tug-war" as GameType,
    emoji: "🪢",
    title: "Tug of War",
    description: "Team tap battle! Pull the rope!",
    gradient: "from-orange-500 to-red-500",
    glow: "shadow-[0_0_30px_rgba(249,115,22,0.3)]",
  },
];

export function HomeScreen({ onSelectGame }: Props) {
  return (
    <div className="h-full flex flex-col items-center justify-center px-6 gap-10">
      {/* Logo */}
      <div className="text-center animate-float">
        <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-accent-1 via-accent-2 to-accent-3 bg-clip-text text-transparent">
          TapTapJoy
        </h1>
        <p className="text-text-secondary mt-2 text-sm font-medium">
          Choose your game
        </p>
      </div>

      {/* Game Cards */}
      <div className="w-full max-w-sm flex flex-col gap-4">
        {GAMES.map((game, i) => (
          <button
            key={game.type}
            onClick={() => onSelectGame(game.type)}
            className={`
              w-full p-6 rounded-2xl bg-gradient-to-r ${game.gradient}
              ${game.glow} hover:scale-[1.02] active:scale-[0.98]
              transition-all duration-200 text-left animate-slide-up
            `}
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className="flex items-center gap-4">
              <span className="text-4xl">{game.emoji}</span>
              <div>
                <h2 className="text-xl font-bold text-white">{game.title}</h2>
                <p className="text-white/70 text-sm mt-0.5">{game.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Footer */}
      <p className="text-text-muted text-xs">
        2–4 players • Real-time multiplayer
      </p>
    </div>
  );
}
