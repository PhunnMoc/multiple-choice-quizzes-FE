'use client';

import React from 'react';
import { Quiz } from '@/types/quiz';
import { Button } from '../ui/Button';
import { useRouter } from 'next/navigation';

interface QuizCardProps {
  quiz: Quiz;
  onJoinQuiz: (quizId: string) => void;
  onViewDetails: (quizId: string) => void;
}

export function QuizCard({ quiz, onJoinQuiz, onViewDetails }: QuizCardProps) {
  const router = useRouter();
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleViewDetails = () => {
    router.push(`/edit/${quiz.id}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
      <div className="p-6">
        {/* Quiz Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
              {quiz.title}
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              by <span className="font-semibold text-black">{quiz.authorName || 'Anonymous'}</span>
            </p>
          </div>
        </div>

        {/* Quiz Stats */}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              {quiz.questions?.length || 0} questions
            </span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              ~{Math.ceil((quiz.questions?.length || 0) * 0.5)} min
            </span>
          </div>
          <span className="text-gray-500">
            {formatDate(typeof quiz.createdAt === 'string' ? quiz.createdAt : new Date().toISOString())}
          </span>
        </div>

        {/* Quiz Description */}
        {quiz.authorName && (
          <p className="text-gray-700 text-sm mb-4 line-clamp-2">
            {quiz.authorName}
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <Button
            variant="primary"
            size="full"
            onClick={() => onJoinQuiz(quiz.id)}
            className="flex-1"
          >
            Start Quiz Room
          </Button>
          <Button
            variant="ghost"
            size="md"
            onClick={handleViewDetails}
            className="px-4 font-medium"
          >
            Edit
          </Button>
        </div>
      </div>
    </div>
  );
}
