'use client';

import React from 'react';
import { QuizProvider } from '@/context/QuizContext';
import { QuizRoom } from '@/components/quiz/QuizRoom';

interface QuizPageProps {
  params: {
    id: string;
  };
}

export default function QuizPage({ params }: QuizPageProps) {
  return (
    <QuizProvider>
      <QuizRoom quizId={params.id} />
    </QuizProvider>
  );
}
