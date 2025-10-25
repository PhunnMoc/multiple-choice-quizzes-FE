'use client';

import React from 'react';
import { useQuiz } from '@/context/QuizContext';

interface QuizResultsProps {
  results: {
    participants: Array<{
      playerId: string;
      name: string;
      score: number;
      totalQuestions: number;
      answers: Array<{
        questionIndex: number;
        answer: number;
        isCorrect: boolean;
        timeSpent: number;
        submittedAt: Date;
      }>;
    }>;
    completedAt: Date;
  };
  onPlayAgain?: () => void;
  onBackToHome?: () => void;
}

export function QuizResults({ results, onPlayAgain, onBackToHome }: QuizResultsProps) {
  const { state } = useQuiz();
  
  // Sort participants by score (highest first)
  const sortedParticipants = results.participants.sort((a, b) => b.score - a.score);
  
  // Calculate statistics
  const totalQuestions = results.participants[0]?.totalQuestions || 0;
  const averageScore = results.participants.reduce((sum, p) => sum + p.score, 0) / results.participants.length;
  const highestScore = Math.max(...results.participants.map(p => p.score));
  const completionTime = new Date(results.completedAt).toLocaleString();

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return '🥇';
      case 1: return '🥈';
      case 2: return '🥉';
      default: return `${index + 1}.`;
    }
  };

  const getScoreColor = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBackground = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return 'bg-green-100';
    if (percentage >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🏆 Quiz Results
          </h1>
          <p className="text-gray-600 mb-4">
            Congratulations! The quiz has been completed.
          </p>
          <div className="text-sm text-gray-500">
            Completed at: {completionTime}
          </div>
        </div>

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

        {/* Leaderboard */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            🎯 Final Leaderboard
          </h2>
          <div className="space-y-4">
            {sortedParticipants.map((participant, index) => (
              <div
                key={participant.playerId}
                className={`flex items-center justify-between p-6 rounded-xl transition-all duration-200 ${
                  index === 0 
                    ? 'bg-gradient-to-r from-yellow-100 to-yellow-200 border-2 border-yellow-300 shadow-lg' 
                    : index === 1
                      ? 'bg-gradient-to-r from-gray-100 to-gray-200 border-2 border-gray-300'
                      : index === 2
                        ? 'bg-gradient-to-r from-orange-100 to-orange-200 border-2 border-orange-300'
                        : 'bg-gray-50 border border-gray-200'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`text-2xl font-bold ${
                    index === 0 ? 'text-yellow-600' : 
                    index === 1 ? 'text-gray-600' : 
                    index === 2 ? 'text-orange-600' : 'text-gray-500'
                  }`}>
                    {getRankIcon(index)}
                  </div>
                  <div>
                    <div className="font-semibold text-lg text-gray-800">
                      {participant.name}
                      {participant.playerId === state.currentPlayer?.playerId && (
                        <span className="ml-2 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          You
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      {participant.score}/{totalQuestions} correct answers
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`text-3xl font-bold ${getScoreColor(participant.score, totalQuestions)}`}>
                    {participant.score}
                  </div>
                  <div className={`text-sm px-3 py-1 rounded-full ${getScoreBackground(participant.score, totalQuestions)} ${getScoreColor(participant.score, totalQuestions)}`}>
                    {((participant.score / totalQuestions) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Results */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            📊 Detailed Results
          </h3>
          <div className="space-y-4">
            {sortedParticipants.map((participant) => (
              <div key={participant.playerId} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-800">
                    {participant.name}
                    {participant.playerId === state.currentPlayer?.playerId && (
                      <span className="ml-2 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        You
                      </span>
                    )}
                  </h4>
                  <div className={`font-bold ${getScoreColor(participant.score, totalQuestions)}`}>
                    {participant.score}/{totalQuestions} ({((participant.score / totalQuestions) * 100).toFixed(1)}%)
                  </div>
                </div>
                
                <div className="grid grid-cols-5 gap-2">
                  {Array.from({ length: totalQuestions }, (_, i) => {
                    const answer = participant.answers.find(a => a.questionIndex === i);
                    return (
                      <div
                        key={i}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          answer 
                            ? answer.isCorrect 
                              ? 'bg-green-500 text-white' 
                              : 'bg-red-500 text-white'
                            : 'bg-gray-300 text-gray-600'
                        }`}
                        title={answer ? `Question ${i + 1}: ${answer.isCorrect ? 'Correct' : 'Incorrect'}` : `Question ${i + 1}: Not answered`}
                      >
                        {answer ? (answer.isCorrect ? '✓' : '✗') : '?'}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {onPlayAgain && (
            <button
              onClick={onPlayAgain}
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold rounded-xl transition-all duration-200 transform hover:scale-105"
            >
              🎮 Play Again
            </button>
          )}
          {onBackToHome && (
            <button
              onClick={onBackToHome}
              className="px-8 py-3 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-bold rounded-xl transition-all duration-200 transform hover:scale-105"
            >
              🏠 Back to Home
            </button>
          )}
        </div>

        {/* Quiz Info */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Quiz: {state.quizTitle || 'Unknown Quiz'}</p>
          <p>Room Code: {state.roomCode}</p>
        </div>
      </div>
    </div>
  );
}
