'use client';

import React, { useState } from 'react';
import { useQuiz } from '@/context/QuizContext';

interface QuizWaitingRoomProps {
  quizId: string;
}

export function QuizWaitingRoom({ quizId }: QuizWaitingRoomProps) {
  const { state, joinQuiz, createQuiz, startQuiz } = useQuiz();
  const [playerName, setPlayerName] = useState('');
  const [hasJoined, setHasJoined] = useState(false);
  const [isCreatingQuiz, setIsCreatingQuiz] = useState(false);

  const handleJoinQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim()) {
      if (isCreatingQuiz) {
        createQuiz(quizId); // Create room with quiz ID
      } else {
        // For joining, we need a room code - for now, let's use a placeholder
        // In a real app, the user would enter a room code
        const roomCode = prompt('Enter room code:') || 'TEST123';
        joinQuiz(roomCode, playerName.trim());
      }
      setHasJoined(true);
    }
  };

  const handleStartQuiz = () => {
    startQuiz();
  };

  if (!hasJoined) {
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
          {/* Quiz Info */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {state.quiz?.title}
            </h2>
            <p className="text-gray-600 mb-4">
              {state.quiz?.description}
            </p>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Questions: {state.quiz?.questions.length}</span>
              <span>Players: {state.quiz?.players.length}</span>
            </div>
          </div>

          {/* Players List */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Players ({state.quiz?.players.length || 0})
            </h3>
            <div className="space-y-2">
              {state.quiz?.players.map((player) => (
                <div
                  key={player.id}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    player.id === state.currentPlayer?.id 
                      ? 'bg-blue-100 border-2 border-blue-300' 
                      : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${player.isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="font-medium">
                      {player.name}
                      {player.id === state.currentPlayer?.id && ' (You)'}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {player.score} pts
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Start Button (for host) */}
          {state.isHost && (
            <button
              onClick={handleStartQuiz}
              className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white font-bold py-3 px-6 rounded-xl hover:from-green-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105"
            >
              Start Quiz
            </button>
          )}

          {!state.isHost && (
            <div className="text-center text-gray-500">
              Waiting for host to start the quiz...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
