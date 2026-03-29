import type { GameType } from "../../types";
import { useHomeScreenModel } from "./domain";
import { HomeScreenView } from "./presentation";

interface Props {
  onSelectGame: (gameType: GameType) => void;
}

export function HomeScreen({ onSelectGame }: Props) {
  const model = useHomeScreenModel();
  return <HomeScreenView games={model.games} onSelectGame={onSelectGame} />;
}
