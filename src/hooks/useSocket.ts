import { useRef, useState, useCallback, useEffect } from "react";
import { WS_URL } from "../config";
import type { ClientEvent, ServerEvent } from "../types";

type SocketState = "connecting" | "connected" | "disconnected";

export function useSocket(onMessage: (event: ServerEvent) => void) {
  const [state, setState] = useState<SocketState>("disconnected");
  const wsRef = useRef<WebSocket | null>(null);
  const onMessageRef = useRef(onMessage);
  onMessageRef.current = onMessage;

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN || wsRef.current?.readyState === WebSocket.CONNECTING) {
      return;
    }

    setState("connecting");
    const ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      setState("connected");
      console.log("[WS] Connected");
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as ServerEvent;
        onMessageRef.current(data);
      } catch (e) {
        console.error("[WS] Failed to parse message:", e);
      }
    };

    ws.onclose = () => {
      setState("disconnected");
      wsRef.current = null;
      console.log("[WS] Disconnected");
    };

    ws.onerror = (err) => {
      console.error("[WS] Error:", err);
    };

    wsRef.current = ws;
  }, []);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setState("disconnected");
  }, []);

  const send = useCallback((event: ClientEvent) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(event));
    } else {
      console.warn("[WS] Cannot send — not connected");
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      wsRef.current?.close();
    };
  }, []);

  return { state, connect, disconnect, send };
}
