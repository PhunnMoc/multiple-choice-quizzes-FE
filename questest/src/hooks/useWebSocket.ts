'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { 
  ClientToServerEvents, 
  ServerToClientEvents, 
  ConnectionState, 
  WebSocketConfig 
} from '@/types/websocket';

interface UseWebSocketReturn {
  socket: Socket<ServerToClientEvents, ClientToServerEvents> | null;
  connectionState: ConnectionState;
  connect: () => void;
  disconnect: () => void;
  isConnected: boolean;
  error: string | null;
}

export function useWebSocket(config: WebSocketConfig): UseWebSocketReturn {
  const [connectionState, setConnectionState] = useState<ConnectionState>('disconnected');
  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const socketRef = useRef<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);

  const connect = useCallback(() => {
    if (socketRef.current?.connected || isConnecting) {
      console.log('🔌 WebSocket already connected or connecting, skipping...');
      return;
    }

    console.log('🔌 Attempting to connect to WebSocket at:', config.url);
    setConnectionState('connecting');
    setError(null);
    setIsConnecting(true);

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      console.log('🔑 Auth token:', token ? 'Present' : 'Not present');
      
      const socket = io(config.url, {
        autoConnect: config.options?.autoConnect ?? true,
        reconnection: config.options?.reconnection ?? true,
        reconnectionAttempts: config.options?.reconnectionAttempts ?? 5,
        reconnectionDelay: config.options?.reconnectionDelay ?? 1000,
        timeout: config.options?.timeout ?? 20000,
        auth: {
          token: token
        }
      });

      socketRef.current = socket;

      // Connection events
      socket.on('connect', () => {
        console.log('✅ WebSocket connected successfully:', socket.id);
        setConnectionState('connected');
        setError(null);
        setIsConnecting(false);
      });

      socket.on('disconnect', (reason) => {
        console.log('❌ WebSocket disconnected:', reason);
        setConnectionState('disconnected');
        setIsConnecting(false);
      });

      socket.on('connect_error', (err) => {
        console.error('🚨 WebSocket connection error:', err);
        setConnectionState('error');
        setError(err.message);
        setIsConnecting(false);
      });

      socket.on('reconnect', (attemptNumber) => {
        console.log('WebSocket reconnected after', attemptNumber, 'attempts');
        setConnectionState('connected');
        setError(null);
        setIsConnecting(false);
      });

      socket.on('reconnect_error', (err) => {
        console.error('WebSocket reconnection error:', err);
        setConnectionState('error');
        setError(err.message);
        setIsConnecting(false);
      });

      socket.on('reconnect_failed', () => {
        console.error('WebSocket reconnection failed');
        setConnectionState('error');
        setError('Failed to reconnect to server');
        setIsConnecting(false);
      });

    } catch (err) {
      console.error('Failed to create WebSocket connection:', err);
      setConnectionState('error');
      setError(err instanceof Error ? err.message : 'Unknown error');
      setIsConnecting(false);
    }
  }, [config.url, config.options?.autoConnect, config.options?.reconnection, config.options?.reconnectionAttempts, config.options?.reconnectionDelay, config.options?.timeout, isConnecting]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setConnectionState('disconnected');
    }
  }, []);

  // Store connect function in ref to avoid dependency issues
  const connectRef = useRef(connect);
  connectRef.current = connect;

  // Auto-connect on mount
  useEffect(() => {
    if (config.options?.autoConnect !== false) {
      console.log('🚀 Auto-connecting WebSocket...');
      connectRef.current();
    }
    
    return () => {
      if (socketRef.current) {
        console.log('🧹 Cleaning up WebSocket connection...');
        socketRef.current.disconnect();
        socketRef.current = null;
        setIsConnecting(false);
      }
    };
  }, [config.options?.autoConnect]);

  return {
    socket: socketRef.current,
    connectionState,
    connect,
    disconnect,
    isConnected: connectionState === 'connected',
    error,
  };
}
