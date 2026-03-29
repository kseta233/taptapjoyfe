import type { GameType } from "../../types";

export interface HomeGameOption {
  type: GameType;
  emoji: string;
  title: string;
  description: string;
}

export const HOME_GAME_OPTIONS: HomeGameOption[] = [
  {
    type: "tap-race",
    emoji: "🏁",
    title: "Tap Race",
    description: "First to 100 taps wins!",
  },
  {
    type: "tug-war",
    emoji: "🪢",
    title: "Tug of War",
    description: "Team tap battle! Pull the rope!",
  },
];
