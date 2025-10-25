'use client';

import React from 'react';
import { QuizList } from '@/components/quiz/QuizList';
import { Button } from '@/components/ui/Button';
import * as Typography from '@/components/ui/Typography';

export function HomePage() {
  const handleViewDetails = (quizId: string) => {
    // This will be handled by QuizCard navigation
    console.log('View details for quiz:', quizId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quiz List */}
        <QuizList
          onViewDetails={handleViewDetails}
        />

        {/* Call to Action for Creating Quizzes */}
        
      </div>
    </div>
  );
}
