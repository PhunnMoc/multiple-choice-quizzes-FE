'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { QuizProvider } from '@/context/QuizContext';
import { QuizWaitingRoom } from '@/components/quiz/QuizWaitingRoom';

export default function QuizRoomWithIdPage() {
  const params = useParams();
  const quizId = params?.id as string;

  if (!quizId) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">Quiz ID not found</p>
        </div>
      </div>
    );
  }

  return (
    <QuizProvider>
      <QuizWaitingRoom 
        quizId={quizId}
        autoCreateRoom={true}
        hostName="Host"
      />
    </QuizProvider>
  );
}
