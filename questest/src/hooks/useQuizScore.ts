'use client';

import { useMemo } from 'react';
import { QuizAnswer, Question } from '@/types/quiz';
import { QUIZ_CONFIG } from '@/constants/quiz';

interface UseQuizScoreProps {
  answers: QuizAnswer[];
  questions: Question[];
}

export function useQuizScore({ answers, questions }: UseQuizScoreProps) {
  const scoreData = useMemo(() => {
    const totalScore = answers.reduce((sum, answer) => sum + answer.points, 0);
    const correctAnswers = answers.filter(answer => answer.isCorrect).length;
    const totalQuestions = questions.length;
    const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
    
    // Calculate average response time
    const totalResponseTime = answers.reduce((sum, answer) => sum + answer.timeToAnswer, 0);
    const averageResponseTime = answers.length > 0 ? totalResponseTime / answers.length : 0;

    // Calculate speed bonus (faster answers get more points)
    const speedBonus = answers.reduce((sum, answer) => {
      if (!answer.isCorrect) return sum;
      const question = questions.find(q => q.id === answer.questionId);
      if (!question) return sum;
      
      const timeBonus = Math.max(0, (question.timeLimit - answer.timeToAnswer) * 10);
      return sum + timeBonus;
    }, 0);

    return {
      totalScore,
      correctAnswers,
      totalQuestions,
      accuracy,
      averageResponseTime,
      speedBonus,
      answers,
    };
  }, [answers, questions]);

  return scoreData;
}
