import type { TugResult } from "../../types";
import { getTeamPlayers, getWinnerColor, getWinnerLabel } from "./data";

interface UseTugWarResultScreenModelParams {
  result: TugResult;
  playerId: string;
}

export function useTugWarResultScreenModel({ result, playerId }: UseTugWarResultScreenModelParams) {
  const myPlayer = result.players.find((player) => player.playerId === playerId);
  const myTeam = myPlayer?.team;
  const isDraw = result.winnerTeam === "draw";
  const isWinner = result.winnerTeam !== "draw" && myTeam === result.winnerTeam;
  const winnerColor = getWinnerColor(result);
  const winnerLabel = getWinnerLabel(result);
  const { leftPlayers, rightPlayers } = getTeamPlayers(result);

  return {
    isDraw,
    isWinner,
    winnerColor,
    winnerLabel,
    leftPlayers,
    rightPlayers,
  };
}
