import type { TugResult } from "../../types";

export function getWinnerColor(result: TugResult) {
  if (result.winnerTeam === "left") return "text-blue-400";
  if (result.winnerTeam === "right") return "text-orange-400";
  return "text-text-muted";
}

export function getWinnerLabel(result: TugResult) {
  if (result.winnerTeam === "left") return "Left Team";
  if (result.winnerTeam === "right") return "Right Team";
  return "Draw";
}

export function getTeamPlayers(result: TugResult) {
  return {
    leftPlayers: result.players.filter((player) => player.team === "left"),
    rightPlayers: result.players.filter((player) => player.team === "right"),
  };
}
