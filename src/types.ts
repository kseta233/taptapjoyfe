// ============================================================
// Protocol types — mirrors backend contract (source of truth)
// ============================================================

export type GameType = "tap-race" | "tug-war";
export type RoomStatus = "waiting" | "countdown" | "playing" | "finished";

// Output contracts (what server sends to client)
export type PlayerView = {
  playerId: string;
  name: string;
  isConnected: boolean;
  isReady: boolean;
  progress: number;
  tapCount: number;
  team?: "left" | "right";
};

export type RoomView = {
  roomId: string;
  gameType: GameType;
  status: RoomStatus;
  hostPlayerId: string;
  players: PlayerView[];
  maxPlayers: number;
  finishProgress: number;
};

export type RacePlayerView = {
  playerId: string;
  name: string;
  progress: number;
  tapCount: number;
  finishOrder?: number;
  isConnected: boolean;
};

export type RoomListItem = {
  roomId: string;
  gameType: GameType;
  hostName: string;
  playerCount: number;
  maxPlayers: number;
  status: "waiting";
};

export type TugState = {
  ropePosition: number;
  timeLeftMs: number;
  leftForce: number;
  rightForce: number;
};

export type TugResult = {
  winnerTeam: "left" | "right" | "draw";
  finalRopePosition: number;
  leftTotalTaps: number;
  rightTotalTaps: number;
  players: Array<{
    playerId: string;
    name: string;
    team: "left" | "right";
    tapCount: number;
  }>;
};

// Client → Server Events
export type ClientEvent =
  | { type: "room.create"; payload: { sessionPlayerId: string; name: string; maxPlayers?: number; gameType?: GameType } }
  | { type: "room.join"; payload: { sessionPlayerId: string; roomId: string; name: string } }
  | { type: "room.ready"; payload: { roomId: string; isReady: boolean } }
  | { type: "room.start"; payload: { roomId: string } }
  | { type: "room.leave"; payload: { roomId: string } }
  | { type: "room.list"; payload: { gameType: GameType } }
  | { type: "race.tap"; payload: { roomId: string; clientTs?: number } }
  | { type: "tug.tap"; payload: { roomId: string; clientTs?: number } };

// Server → Client Events
export type ServerEvent =
  | { type: "room.created"; payload: { roomId: string; playerId: string } }
  | { type: "room.joined"; payload: { roomId: string; playerId: string } }
  | { type: "room.state"; payload: RoomView }
  | { type: "room.listResult"; payload: { rooms: RoomListItem[] } }
  | { type: "game.countdown"; payload: { value: number } }
  | { type: "race.progress"; payload: { players: RacePlayerView[] } }
  | { type: "race.finished"; payload: { rankings: RacePlayerView[] } }
  | { type: "tug.state"; payload: TugState }
  | { type: "tug.finished"; payload: TugResult }
  | { type: "error"; payload: { code: string; message: string } };

// Game phases for UI state machine
export type GamePhase =
  | "home"
  | "game-lobby"
  | "room"
  | "countdown"
  | "racing"      // tap-race playing
  | "tug-playing"  // tug-war playing
  | "result"
  | "tug-result"
  | "disconnected";
