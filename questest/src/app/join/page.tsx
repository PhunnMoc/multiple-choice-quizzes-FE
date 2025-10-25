'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { QuizWaitingRoom } from '@/components/quiz/QuizWaitingRoom';
import { QuizProvider } from '@/context/QuizContext';
import { Button } from '@/components/ui/Button';

export default function JoinQuizPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [roomCode, setRoomCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [showWaitingRoom, setShowWaitingRoom] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  // Get room code from URL params
  useEffect(() => {
    const codeFromUrl = searchParams.get('code');
    if (codeFromUrl) {
      setRoomCode(codeFromUrl.toUpperCase());
    }
  }, [searchParams]);

  const handleJoinQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomCode.trim() || !playerName.trim()) {
      alert('Please enter both room code and your name');
      return;
    }

    setIsJoining(true);
    // Simulate a brief loading to show the join process
    setTimeout(() => {
      setShowWaitingRoom(true);
    }, 500);
  };

  const handleBackToHome = () => {
    router.push('/');
  };

  if (showWaitingRoom) {
    return (
      <QuizProvider>
        <div className="min-h-screen">
          <QuizWaitingRoom 
            quizId="" // We don't have quizId when joining by code
            roomCode={roomCode}
            playerName={playerName}
            isJoining={true}
          />
        </div>
      </QuizProvider>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Join Quiz Room
          </h1>
          <p className="text-gray-600">
            Enter the quiz code to join an existing room
          </p>
        </div>

        <form onSubmit={handleJoinQuiz} className="space-y-6">
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

          <div>
            <label htmlFor="playerName" className="block text-sm font-medium text-gray-700 mb-2">
              Display Name
            </label>
            <input
              type="text"
              id="playerName"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              required
            />
          </div>

          <div className="flex space-x-4">
            <Button
              type="button"
              variant="ghost"
              size="full"
              onClick={handleBackToHome}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="full"
              disabled={!roomCode.trim() || !playerName.trim() || isJoining}
              className="flex-1"
            >
              {isJoining ? 'Joining...' : 'Join Quiz'}
            </Button>
          </div>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-xl">
          <h3 className="font-semibold text-blue-800 mb-2">💡 How to join:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Get the room code from the quiz host</li>
            <li>• Enter the code and your name above</li>
            <li>• Wait for the host to start the quiz</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
