'use client';

import React, { useState } from 'react';
import { QuizList } from '@/components/quiz/QuizList';
import { QuizWaitingRoom } from '@/components/quiz/QuizWaitingRoom';
import { QuizProvider } from '@/context/QuizContext';
import { Button } from '@/components/ui/Button';
import * as Typography from '@/components/ui/Typography';

export function HomePage() {
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);
  const [showQuizRoom, setShowQuizRoom] = useState(false);
  const [autoCreateRoom, setAutoCreateRoom] = useState(false);
  const [hostName, setHostName] = useState('');

  const handleJoinQuiz = (quizId: string) => {
    setSelectedQuizId(quizId);
    setAutoCreateRoom(true);
    setHostName('Host'); // Default host name, có thể lấy từ user context sau này
    setShowQuizRoom(true);
  };

  const handleViewDetails = (quizId: string) => {
    // For now, just join the quiz. In the future, this could show a detailed view
    handleJoinQuiz(quizId);
  };

  const handleBackToHome = () => {
    setShowQuizRoom(false);
    setSelectedQuizId(null);
    setAutoCreateRoom(false);
    setHostName('');
  };

  if (showQuizRoom && selectedQuizId) {
    return (
      <QuizProvider>
        <div className="min-h-screen">
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <button
              onClick={handleBackToHome}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Quiz List
            </button>
          </div>
          <QuizWaitingRoom 
            quizId={selectedQuizId} 
            autoCreateRoom={autoCreateRoom}
            hostName={hostName}
          />
        </div>
      </QuizProvider>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quiz List */}
        <QuizList
          onJoinQuiz={handleJoinQuiz}
          onViewDetails={handleViewDetails}
        />

        {/* Call to Action for Creating Quizzes */}
        
      </div>
    </div>
  );
}
