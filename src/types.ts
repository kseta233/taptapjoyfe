// ============================================================
// Protocol types — mirrors backend contract (source of truth)
// ============================================================

export type RoomStatus = "waiting" | "countdown" | "racing" | "finished";

// Output contracts (what server sends to client)
export type PlayerView = {
  playerId: string;
  name: string;
  isConnected: boolean;
  isReady: boolean;
  progress: number;
  tapCount: number;
};

export type RoomView = {
  roomId: string;
  gameType: "tap-race";
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

// Client → Server Events
export type ClientEvent =
  | { type: "room.create"; payload: { sessionPlayerId: string; name: string; maxPlayers?: number } }
  | { type: "room.join"; payload: { sessionPlayerId: string; roomId: string; name: string } }
  | { type: "room.ready"; payload: { roomId: string; isReady: boolean } }
  | { type: "room.start"; payload: { roomId: string } }
  | { type: "race.tap"; payload: { roomId: string; clientTs?: number } }
  | { type: "room.leave"; payload: { roomId: string } };

// Server → Client Events
export type ServerEvent =
  | { type: "room.created"; payload: { roomId: string; playerId: string } }
  | { type: "room.joined"; payload: { roomId: string; playerId: string } }
  | { type: "room.state"; payload: RoomView }
  | { type: "race.countdown"; payload: { value: number } }
  | { type: "race.progress"; payload: { players: RacePlayerView[] } }
  | { type: "race.finished"; payload: { rankings: RacePlayerView[] } }
  | { type: "error"; payload: { code: string; message: string } };

// Game phases for UI state machine
export type GamePhase = "lobby" | "room" | "countdown" | "racing" | "result" | "disconnected";
