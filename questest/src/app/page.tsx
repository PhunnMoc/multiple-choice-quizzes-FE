'use client';

import React from 'react';
import { QuizProvider } from '@/context/QuizContext';
import { QuizWaitingRoom } from '@/components/quiz/QuizWaitingRoom';

export default function Home() {
  return (
    <QuizProvider>
      <QuizWaitingRoom quizId="sample-quiz-123" />
    </QuizProvider>
  );
}
