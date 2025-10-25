'use client';

import React, { useState } from 'react';
import { useQuiz } from '@/context/QuizContext';
import { Button } from '../ui/Button';
import { Leaderboard } from './Leaderboard';
import { DetailedResults } from './DetailedResults';

interface QuizResultsProps {
  results: {
    participants: Array<{
      playerId: string;
      name: string;
      score: number;
      totalQuestions: number;
      answers: Array<{
        questionIndex: number;
        answerIndex: number;
        isCorrect: boolean;
        timeSpent: number;
        submittedAt: Date;
      }>;
    }>;
    questions: Array<{
      questionIndex: number;
      questionText: string;
      options: string[];
      correctAnswerIndex: number;
    }>;
    completedAt: Date;
  };
  onPlayAgain?: () => void;
  onBackToHome?: () => void;
}

export function QuizResults({ results, onPlayAgain, onBackToHome }: QuizResultsProps) {
  const { state } = useQuiz();
  const [showDetailedResults, setShowDetailedResults] = useState(false);
  
  // Calculate statistics
  const totalQuestions = results.participants[0]?.totalQuestions || 0;
  const averageScore = results.participants.reduce((sum, p) => sum + p.score, 0) / results.participants.length;
  const highestScore = Math.max(...results.participants.map(p => p.score));

  // Use questions from results instead of state
  const questions = results.questions || [];

  // Show detailed results if requested
  if (showDetailedResults) {
    return (
      <DetailedResults
        participants={results.participants}
        questions={questions}
        currentPlayerId={state.currentPlayer?.playerId}
        onBack={() => setShowDetailedResults(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Quiz Results
          </h1>
          <p className="text-gray-600 mb-4">
            Congratulations! The quiz has been completed.
          </p>
        </div>

        {/* Leaderboard */}
        <Leaderboard 
          participants={results.participants}
          totalQuestions={totalQuestions}
          currentPlayerId={state.currentPlayer?.playerId}
        />

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {results.participants.length}
            </div>
            <div className="text-sm text-blue-800">Participants</div>
          </div>
          <div className="bg-green-50 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {averageScore.toFixed(1)}
            </div>
            <div className="text-sm text-green-800">Average Score</div>
          </div>
          <div className="bg-yellow-50 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">
              {highestScore}
            </div>
            <div className="text-sm text-yellow-800">Highest Score</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="secondary"
            onClick={() => setShowDetailedResults(true)}
            className="px-8 py-3"
          >
          View Detailed Results
          </Button>
          {onPlayAgain && (
            <button
              onClick={onPlayAgain}
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold rounded-xl transition-all duration-200 transform hover:scale-105"
            >
              Play Again
            </button>
          )}
          {onBackToHome && (
            <Button
              variant="primary"
              size="full"
              onClick={onBackToHome}
            >
              Back to Home
            </Button>
          )}
        </div>

        {/* Quiz Info */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Room Code: {state.roomCode}</p>
        </div>
      </div>
    </div>
  );
}
