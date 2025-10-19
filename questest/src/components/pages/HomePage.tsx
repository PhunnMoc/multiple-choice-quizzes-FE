'use client';

import React, { useState } from 'react';
import { QuizList } from '@/components/quiz/QuizList';
import { QuizWaitingRoom } from '@/components/quiz/QuizWaitingRoom';

export function HomePage() {
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);
  const [showQuizRoom, setShowQuizRoom] = useState(false);

  const handleJoinQuiz = (quizId: string) => {
    setSelectedQuizId(quizId);
    setShowQuizRoom(true);
  };

  const handleViewDetails = (quizId: string) => {
    // For now, just join the quiz. In the future, this could show a detailed view
    handleJoinQuiz(quizId);
  };

  const handleBackToHome = () => {
    setShowQuizRoom(false);
    setSelectedQuizId(null);
  };

  if (showQuizRoom && selectedQuizId) {
    return (
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
        <QuizWaitingRoom quizId={selectedQuizId} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              🎯 Quiz Master
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Discover and join amazing quizzes created by the community
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-6 py-3">
                <div className="text-2xl font-bold">100+</div>
                <div className="text-sm text-blue-100">Quizzes Available</div>
              </div>
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-6 py-3">
                <div className="text-2xl font-bold">50+</div>
                <div className="text-sm text-blue-100">Active Players</div>
              </div>
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-6 py-3">
                <div className="text-2xl font-bold">24/7</div>
                <div className="text-sm text-blue-100">Available</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Available Quizzes
          </h2>
          <p className="text-gray-600">
            Browse through quizzes created by our community and join the ones that interest you.
          </p>
        </div>

        {/* Quiz List */}
        <QuizList
          onJoinQuiz={handleJoinQuiz}
          onViewDetails={handleViewDetails}
        />

        {/* Call to Action for Creating Quizzes */}
        <div className="mt-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Ready to Create Your Own Quiz?</h3>
          <p className="text-lg mb-6 text-green-100">
            Share your knowledge with the community by creating engaging quizzes.
          </p>
          <button className="bg-white text-green-600 hover:bg-gray-100 font-semibold px-8 py-3 rounded-lg transition-colors duration-200">
            Create Quiz
          </button>
        </div>
      </div>
    </div>
  );
}
