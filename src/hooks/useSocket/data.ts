export type SocketState = "connecting" | "connected" | "disconnected";

export const RECONNECT_DELAYS_MS = [500, 1000, 2000, 4000, 8000, 15000] as const;
