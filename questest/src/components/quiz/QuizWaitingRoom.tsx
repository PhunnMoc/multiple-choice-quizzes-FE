'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useQuiz } from '@/context/QuizContext';
import { useClipboard } from '@/hooks/useClipboard';
import { QuestionCard } from './QuestionCard';

interface QuizWaitingRoomProps {
  quizId: string;
  autoCreateRoom?: boolean;
  hostName?: string;
  roomCode?: string;
  playerName?: string;
  isJoining?: boolean;
}

export function QuizWaitingRoom({ 
  quizId, 
  autoCreateRoom = false, 
  hostName = '', 
  roomCode: propRoomCode = '', 
  playerName: propPlayerName = '', 
  isJoining = false 
}: QuizWaitingRoomProps) {
  const { state, joinQuiz, createQuiz, startQuiz } = useQuiz();
  const { copyToClipboard, isCopied, error: clipboardError } = useClipboard();
  const [playerName, setPlayerName] = useState(hostName || propPlayerName || '');
  const [roomCode, setRoomCode] = useState(propRoomCode || '');
  const [hasJoined, setHasJoined] = useState(false);
  const [isCreatingQuiz, setIsCreatingQuiz] = useState(autoCreateRoom);
  const [isAnswered, setIsAnswered] = useState(false);

  // Auto-create room when autoCreateRoom is true and we have a host name
  useEffect(() => {
    if (autoCreateRoom && hostName && state.isConnected && !hasJoined) {
      console.log('🎮 Auto-creating room with host name:', hostName);
      createQuiz(quizId);
      setHasJoined(true);
    }
  }, [autoCreateRoom, hostName, state.isConnected, hasJoined, createQuiz, quizId]);

  // Auto-join room when joining with room code and player name
  useEffect(() => {
    if (isJoining && propRoomCode && propPlayerName && state.isConnected && !hasJoined) {
      console.log('🎮 Auto-joining room with code:', propRoomCode, 'and player:', propPlayerName);
      joinQuiz(propRoomCode, propPlayerName);
      setHasJoined(true);
    }
  }, [isJoining, propRoomCode, propPlayerName, state.isConnected, hasJoined, joinQuiz]);

  // Debug log current state only when it changes
  const prevState = useRef<any>(null);
  useEffect(() => {
    const currentState = {
      roomCode: state.roomCode,
      participantCount: state.participantCount,
      participants: state.participants,
      isHost: state.isHost,
      isConnected: state.isConnected,
      autoCreateRoom,
      hostName
    };
    
    if (JSON.stringify(prevState.current) !== JSON.stringify(currentState)) {
      console.log('🎮 QuizWaitingRoom state changed:', currentState);
      prevState.current = currentState;
    }
  }, [state.roomCode, state.participantCount, state.participants, state.isHost, state.isConnected, autoCreateRoom, hostName]);

  const handleJoinQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim()) {
      if (isCreatingQuiz) {
        createQuiz(quizId); // Create room with quiz ID
      } else {
        // For joining, we need a room code
        if (!roomCode.trim()) {
          alert('Please enter a room code');
          return;
        }
        joinQuiz(roomCode.trim(), playerName.trim());
      }
      setHasJoined(true);
    }
  };

  const handleStartQuiz = () => {
    startQuiz();
  };

  const handleAnswerSubmit = (answerIndex: number) => {
    if (state.roomCode && state.socket) {
      state.socket.emit('submit-answer', {
        roomCode: state.roomCode,
        answer: answerIndex
      });
    }
  };

  // Show question card when quiz is active
  console.log('🎮 QuizWaitingRoom render check:', {
    gameState: state.gameState,
    currentQuestion: state.currentQuestion,
    shouldShowQuestion: state.gameState === 'question' && state.currentQuestion
  });
  
  if (state.gameState === 'question' && state.currentQuestion) {
    return (
      <QuestionCard
        question={state.currentQuestion}
        onAnswerSubmit={handleAnswerSubmit}
        isAnswered={isAnswered}
      />
    );
  }

  // Show loading state when auto-creating room
  if (autoCreateRoom && !hasJoined) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              🎮 Creating Quiz Room
            </h1>
            <p className="text-gray-600">
              Setting up your quiz room...
            </p>
            
            {/* Connection Status */}
            <div className="mt-4 flex items-center justify-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                state.isConnected ? 'bg-green-500' : 'bg-red-500'
              }`} />
              <span className={`text-sm font-medium ${
                state.isConnected ? 'text-green-600' : 'text-red-600'
              }`}>
                {state.isConnected ? 'Connected' : 'Connecting...'}
              </span>
            </div>
            
            {state.connectionError && (
              <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{state.connectionError}</p>
              </div>
            )}
          </div>

          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Please wait while we create your quiz room...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!hasJoined && !autoCreateRoom) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {isCreatingQuiz ? '🎮 Create Quiz' : '🎯 Join Quiz'}
            </h1>
            <p className="text-gray-600">
              {isCreatingQuiz 
                ? 'Enter your name to create a new quiz room' 
                : 'Enter your name to join the quiz room'
              }
            </p>
            
            {/* Connection Status */}
            <div className="mt-4 flex items-center justify-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                state.isConnected ? 'bg-green-500' : 'bg-red-500'
              }`} />
              <span className={`text-sm font-medium ${
                state.isConnected ? 'text-green-600' : 'text-red-600'
              }`}>
                {state.isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            
            {state.connectionError && (
              <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{state.connectionError}</p>
              </div>
            )}
          </div>

          <form onSubmit={handleJoinQuiz} className="space-y-6">
            <div>
              <label htmlFor="playerName" className="block text-sm font-medium text-gray-700 mb-2">
                Your Name
              </label>
              <input
                type="text"
                id="playerName"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder={isCreatingQuiz ? "Enter host name..." : "Enter your name..."}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                required
              />
            </div>

            {!isCreatingQuiz && (
              <div>
                <label htmlFor="roomCode" className="block text-sm font-medium text-gray-700 mb-2">
                  Room Code
                </label>
                <input
                  type="text"
                  id="roomCode"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  placeholder="Enter room code (e.g., ABC123)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  required
                />
                <p className="mt-1 text-sm text-gray-500">
                  Ask the host for the room code to join their quiz
                </p>
              </div>
            )}

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setIsCreatingQuiz(false)}
                className={`flex-1 py-2 px-4 rounded-xl font-medium transition-all ${
                  !isCreatingQuiz 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Join Quiz
              </button>
              <button
                type="button"
                onClick={() => setIsCreatingQuiz(true)}
                className={`flex-1 py-2 px-4 rounded-xl font-medium transition-all ${
                  isCreatingQuiz 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Create Quiz
              </button>
            </div>

            <button
              type="submit"
              disabled={!state.isConnected}
              className={`w-full font-bold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 ${
                !state.isConnected
                  ? 'bg-gray-400 cursor-not-allowed'
                  : isCreatingQuiz
                    ? 'bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white'
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white'
              }`}
            >
              {!state.isConnected 
                ? 'Connecting...' 
                : isCreatingQuiz 
                  ? 'Create Quiz Room' 
                  : 'Join Quiz Room'
              }
            </button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-xl">
            <h3 className="font-semibold text-blue-800 mb-2">💡 Testing Tips:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• <strong>Create Quiz:</strong> You'll be the host with start controls</li>
              <li>• <strong>Join Quiz:</strong> You'll be a regular player</li>
              <li>• <strong>Host names:</strong> Names containing "host" or "admin" become hosts automatically</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🎮 Quiz Room
          </h1>
          <p className="text-gray-600">
            Waiting for the quiz to start...
          </p>
        </div>

        <div className="space-y-6">
          {/* Room Info */}
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {state.quizTitle || state.quiz?.title || 'Quiz Room'}
                </h2>
                {state.hostName && (
                  <p className="text-sm text-gray-600 mt-1">
                    Hosted by <span className="font-semibold text-blue-600">{state.hostName}</span>
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  state.isConnected ? 'bg-green-500' : 'bg-red-500'
                }`} />
                <span className={`text-sm font-medium ${
                  state.isConnected ? 'text-green-600' : 'text-red-600'
                }`}>
                  {state.isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-white rounded-lg p-3">
                <div className="text-gray-500 mb-1">Room Code</div>
                <div className="font-bold text-lg text-blue-600">
                  {state.roomCode || 'N/A'}
                </div>
              </div>
              <div className="bg-white rounded-lg p-3">
                <div className="text-gray-500 mb-1">Participants</div>
                <div className="font-bold text-lg text-green-600">
                  {state.participantCount || 0}
                </div>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-500">
              <span>Questions: {state.quiz?.questions?.length || 0}</span>
              <span>Max Players: 50</span>
            </div>
          </div>

          {/* Participants List */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Participants ({state.participantCount || 0})
            </h3>
            <div className="space-y-2">
              {state.participants && state.participants.length > 0 ? (
                state.participants.map((participant) => (
                  <div
                    key={participant.playerId}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      participant.playerId === state.currentPlayer?.playerId 
                        ? 'bg-blue-100 border-2 border-blue-300' 
                        : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        participant.isConnected !== false ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                      <span className="font-medium">
                        {participant.name}
                        {participant.playerId === state.currentPlayer?.playerId && ' (You)'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">
                        {participant.score || 0} pts
                      </span>
                      {participant.isReady && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          Ready
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <div className="text-4xl mb-2">👥</div>
                  <p>No participants yet</p>
                  <p className="text-sm">Share the room code to invite others!</p>
                </div>
              )}
            </div>
          </div>

          {/* Room Code Display */}
          {state.roomCode && (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">
                📋 Room Code
              </h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2 font-mono tracking-wider">
                  {state.roomCode}
                </div>
                <p className="text-sm text-blue-600 mb-4">
                  Share this code with others to join your quiz
                </p>
                <button
                  onClick={() => {
                    if (state.roomCode) {
                      copyToClipboard(state.roomCode);
                    }
                  }}
                  className={`px-4 py-2 rounded-lg transition-colors text-sm ${
                    isCopied 
                      ? 'bg-green-500 text-white' 
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  {isCopied ? '✅ Copied!' : '📋 Copy Code'}
                </button>
                {clipboardError && (
                  <p className="text-xs text-red-500 mt-1">
                    Copy failed: {clipboardError}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Start Button (for host) */}
          {state.isHost && (
            <button
              onClick={handleStartQuiz}
              disabled={!state.participantCount || state.participantCount < 1}
              className={`w-full font-bold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 ${
                !state.participantCount || state.participantCount < 1
                  ? 'bg-gray-400 cursor-not-allowed text-gray-600'
                  : 'bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white'
              }`}
            >
              {!state.participantCount || state.participantCount < 1
                ? 'Waiting for participants...'
                : `Start Quiz (${state.participantCount} participants)`
              }
            </button>
          )}

          {!state.isHost && (
            <div className="text-center text-gray-500">
              <div className="text-2xl mb-2">⏳</div>
              <p>Waiting for host to start the quiz...</p>
              <p className="text-sm mt-1">
                {state.participantCount || 0} participant{state.participantCount !== 1 ? 's' : ''} ready
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
