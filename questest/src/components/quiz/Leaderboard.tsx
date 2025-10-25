'use client';

import React from 'react';
import { H3 } from '../ui/Typography';

interface Participant {
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
}

interface LeaderboardProps {
  participants: Participant[];
  totalQuestions: number;
  currentPlayerId?: string;
}

export function Leaderboard({ participants, totalQuestions, currentPlayerId }: LeaderboardProps) {
  // Sort participants by score (descending)
  const sortedParticipants = [...participants].sort((a, b) => b.score - a.score);
  
  // Get top 3 for podium
  const top3 = sortedParticipants.slice(0, 3);
  const rest = sortedParticipants.slice(3);

  const getScoreColor = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    if (percentage >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBackground = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return 'bg-green-100';
    if (percentage >= 60) return 'bg-yellow-100';
    if (percentage >= 40) return 'bg-orange-100';
    return 'bg-red-100';
  };

  return (
    <div className="mb-8">
    
      {/* Full Leaderboard List */}
      <div className="bg-white rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <H3>Full Leaderboard</H3>
        </div>
        
        <div className="space-y-3">
          {sortedParticipants.map((participant, index) => (
            <div
              key={participant.playerId}
              className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                index === 0 
                  ? 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-2 border-yellow-300 shadow-lg' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-4">
                {/* Rank Circle */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  index === 0 
                    ? 'bg-yellow-400 shadow-md' 
                    : 'bg-gray-200'
                }`}>
                  <span className={`text-sm font-semibold ${
                    index === 0 ? 'text-white' : 'text-gray-700'
                  }`}>{index + 1}</span>
                </div>
                {/* Name and Info */}
                <div>
                  <div className={`font-medium ${
                    index === 0 ? 'text-yellow-800 text-lg' : 'text-gray-800'
                  }`}>
                    {participant.name}
                    {participant.playerId === currentPlayerId && (
                      <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        You
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    {`${participant.score}/${totalQuestions} correct`}
                  </div>
                </div>
              </div>
              
              {/* Score and Performance */}
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className={`text-lg font-bold ${getScoreColor(participant.score, totalQuestions)}`}>
                    {participant.score}
                  </div>
                  <div className={`text-xs px-2 py-1 rounded-full ${getScoreBackground(participant.score, totalQuestions)} ${getScoreColor(participant.score, totalQuestions)}`}>
                    {((participant.score / totalQuestions) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}