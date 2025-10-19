'use client';

import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export default function DebugPage() {
  const [connectionStatus, setConnectionStatus] = useState('Not connected');
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  useEffect(() => {
    addLog('Attempting to connect to WebSocket...');
    
    const socket = io('http://localhost:3001', {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on('connect', () => {
      addLog(`✅ Connected successfully! Socket ID: ${socket.id}`);
      setConnectionStatus('Connected');
    });

    socket.on('disconnect', (reason) => {
      addLog(`❌ Disconnected: ${reason}`);
      setConnectionStatus('Disconnected');
    });

    socket.on('connect_error', (error) => {
      addLog(`🚨 Connection error: ${error.message}`);
      setConnectionStatus('Error');
    });

    socket.on('reconnect', (attemptNumber) => {
      addLog(`🔄 Reconnected after ${attemptNumber} attempts`);
      setConnectionStatus('Connected');
    });

    socket.on('reconnect_error', (error) => {
      addLog(`🚨 Reconnection error: ${error.message}`);
    });

    socket.on('reconnect_failed', () => {
      addLog('❌ Reconnection failed');
      setConnectionStatus('Failed');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">WebSocket Debug Page</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Connection Status</h2>
          <div className={`inline-block px-4 py-2 rounded-full text-white font-medium ${
            connectionStatus === 'Connected' ? 'bg-green-500' : 
            connectionStatus === 'Error' ? 'bg-red-500' : 
            connectionStatus === 'Failed' ? 'bg-red-600' : 'bg-yellow-500'
          }`}>
            {connectionStatus}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Connection Logs</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
            {logs.map((log, index) => (
              <div key={index} className="mb-1">{log}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
