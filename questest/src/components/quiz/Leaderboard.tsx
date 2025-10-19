'use client';

import React from 'react';
import { Player } from '@/types/quiz';

interface LeaderboardProps {
  players: Player[];
  currentPlayerId?: string;
}

export function Leaderboard({ players, currentPlayerId }: LeaderboardProps) {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
        🏆 Leaderboard
      </h2>
      
      <div className="space-y-4">
        {sortedPlayers.map((player, index) => (
          <div
            key={player.id}
            className={`
              flex items-center justify-between p-4 rounded-xl
              ${player.id === currentPlayerId 
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                : 'bg-gray-50 hover:bg-gray-100'
              }
              transition-all duration-200
            `}
          >
            <div className="flex items-center space-x-4">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg
                ${player.id === currentPlayerId 
                  ? 'bg-white bg-opacity-30' 
                  : getRankColor(index)
                }
              `}>
                {index + 1}
              </div>
              <div>
                <div className="font-semibold text-lg">
                  {player.name}
                  {player.id === currentPlayerId && ' (You)'}
                </div>
                <div className={`text-sm ${player.id === currentPlayerId ? 'text-blue-100' : 'text-gray-500'}`}>
                  {player.isConnected ? '🟢 Connected' : '🔴 Disconnected'}
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className={`text-2xl font-bold ${player.id === currentPlayerId ? 'text-white' : 'text-gray-800'}`}>
                {player.score.toLocaleString()}
              </div>
              <div className={`text-sm ${player.id === currentPlayerId ? 'text-blue-100' : 'text-gray-500'}`}>
                points
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function getRankColor(rank: number): string {
  switch (rank) {
    case 0:
      return 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white'; // Gold
    case 1:
      return 'bg-gradient-to-r from-gray-300 to-gray-400 text-white'; // Silver
    case 2:
      return 'bg-gradient-to-r from-orange-400 to-orange-500 text-white'; // Bronze
    default:
      return 'bg-gray-200 text-gray-700';
  }
}
