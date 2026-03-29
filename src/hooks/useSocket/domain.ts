import { useRef, useState, useCallback, useEffect } from "react";
import { WS_URL } from "../../config";
import type { ClientEvent, ServerEvent } from "../../types";
import { type SocketState, RECONNECT_DELAYS_MS } from "./data";

export function useSocket(onMessage: (event: ServerEvent) => void) {
  const [state, setState] = useState<SocketState>("disconnected");
  const [reconnectAttempt, setReconnectAttempt] = useState(0);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const pendingEventsRef = useRef<ClientEvent[]>([]);
  const reconnectTimerRef = useRef<number | null>(null);
  const reconnectAttemptRef = useRef(0);
  const connectRef = useRef<() => void>(() => {});
  const shouldReconnectRef = useRef(false);
  const isManualCloseRef = useRef(false);
  const onMessageRef = useRef(onMessage);
  onMessageRef.current = onMessage;

  const clearReconnectTimer = useCallback(() => {
    if (reconnectTimerRef.current !== null) {
      window.clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
  }, []);

  const scheduleReconnect = useCallback(() => {
    if (!shouldReconnectRef.current || reconnectTimerRef.current !== null) {
      return;
    }

    const attempt = reconnectAttemptRef.current;
    const baseDelay = RECONNECT_DELAYS_MS[Math.min(attempt, RECONNECT_DELAYS_MS.length - 1)];
    const jitter = Math.floor(Math.random() * 250);
    const delay = baseDelay + jitter;

    reconnectTimerRef.current = window.setTimeout(() => {
      reconnectTimerRef.current = null;
      reconnectAttemptRef.current += 1;
      setReconnectAttempt(reconnectAttemptRef.current);
      connectRef.current();
    }, delay);
  }, []);

  const connect = useCallback(() => {
    shouldReconnectRef.current = true;
    isManualCloseRef.current = false;
    clearReconnectTimer();

    if (wsRef.current?.readyState === WebSocket.OPEN || wsRef.current?.readyState === WebSocket.CONNECTING) {
      return;
    }

    setState("connecting");
    const ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      setState("connected");
      reconnectAttemptRef.current = 0;
      setReconnectAttempt(0);
      setIsReconnecting(false);
      console.log("[WS] Connected");

      // Flush events queued while the socket was connecting.
      for (const pendingEvent of pendingEventsRef.current) {
        ws.send(JSON.stringify(pendingEvent));
      }
      pendingEventsRef.current = [];
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
      pendingEventsRef.current = [];
      console.log("[WS] Disconnected");

      if (!isManualCloseRef.current) {
        setIsReconnecting(true);
        scheduleReconnect();
      }

      isManualCloseRef.current = false;
    };

    ws.onerror = (err) => {
      console.error("[WS] Error:", err);
    };

    wsRef.current = ws;
  }, [clearReconnectTimer, scheduleReconnect]);
  connectRef.current = connect;

  const disconnect = useCallback(() => {
    shouldReconnectRef.current = false;
    isManualCloseRef.current = true;
    clearReconnectTimer();
    reconnectAttemptRef.current = 0;
    setReconnectAttempt(0);
    setIsReconnecting(false);

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    pendingEventsRef.current = [];
    setState("disconnected");
  }, [clearReconnectTimer]);

  const send = useCallback((event: ClientEvent) => {
    const ws = wsRef.current;
    const readyState = ws?.readyState;

    if (ws && readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(event));
      return;
    }

    if (readyState === WebSocket.CONNECTING) {
      pendingEventsRef.current.push(event);
      return;
    }

    if (readyState !== WebSocket.CONNECTING) {
      console.warn("[WS] Cannot send — not connected");
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      shouldReconnectRef.current = false;
      clearReconnectTimer();
      setIsReconnecting(false);
      wsRef.current?.close();
    };
  }, [clearReconnectTimer]);

  return { state, reconnectAttempt, isReconnecting, connect, disconnect, send };
}
