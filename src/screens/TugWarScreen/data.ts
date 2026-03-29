import type { RoomView, TugState } from "../../types";

const MAX_OFFSET = 140;
const DANGER_THRESHOLD = 70;

export function getRopeMetrics(tugState: TugState | null) {
  const ropePos = tugState?.ropePosition ?? 0;
  const leftForce = tugState?.leftForce ?? 0;
  const rightForce = tugState?.rightForce ?? 0;
  const timeLeft = tugState?.timeLeftMs ?? 60000;

  return {
    ropePos,
    ropeOffset: (ropePos / 100) * MAX_OFFSET,
    leftForce,
    rightForce,
    seconds: Math.ceil(timeLeft / 1000),
    isLeftDanger: ropePos <= -DANGER_THRESHOLD,
    isRightDanger: ropePos >= DANGER_THRESHOLD,
  };
}

export function splitTeams(room: RoomView) {
  return {
    leftTeam: room.players.filter((player) => player.team === "left"),
    rightTeam: room.players.filter((player) => player.team === "right"),
  };
}
