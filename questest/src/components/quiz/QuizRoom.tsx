'use client';

import React, { useState, useEffect } from 'react';
import { useQuiz } from '@/context/QuizContext';
import { QuestionCard } from './QuestionCard';
import { AnswerOptions } from './AnswerOptions';
import { Leaderboard } from './Leaderboard';

interface QuizRoomProps {
  quizId: string;
}

export function QuizRoom({ quizId }: QuizRoomProps) {
  const { state, submitAnswer, nextQuestion } = useQuiz();
  const [isAnswered, setIsAnswered] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = state.quiz?.questions[state.quiz.currentQuestionIndex];
  const questionNumber = (state.quiz?.currentQuestionIndex || 0) + 1;
  const totalQuestions = state.quiz?.questions.length || 0;

  useEffect(() => {
    setIsAnswered(false);
    setShowResults(false);
  }, [state.quiz?.currentQuestionIndex]);

  useEffect(() => {
    if (state.timeRemaining === 0 && !isAnswered) {
      setIsAnswered(true);
      setShowResults(true);
      
      // Show results for 3 seconds before moving to next question
      setTimeout(() => {
        if (questionNumber < totalQuestions) {
          nextQuestion();
        } else {
          // Quiz finished
        }
      }, 3000);
    }
  }, [state.timeRemaining, isAnswered, questionNumber, totalQuestions, nextQuestion]);

  const handleAnswerSelect = (answerId: string, timeToAnswer: number) => {
    if (isAnswered || !currentQuestion) return;
    
    setIsAnswered(true);
    setShowResults(true);
    submitAnswer(currentQuestion.id, answerId, timeToAnswer);

    // Show results for 3 seconds before moving to next question
    setTimeout(() => {
      if (questionNumber < totalQuestions) {
        nextQuestion();
      } else {
        // Quiz finished
      }
    }, 3000);
  };

  if (!state.quiz || !currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 flex items-center justify-center">
        <div className="text-white text-xl">Loading quiz...</div>
      </div>
    );
  }

  if (state.gameState === 'waiting') {
    return <div>Waiting for quiz to start...</div>;
  }

  if (state.gameState === 'finished') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              🎉 Quiz Complete!
            </h1>
            <p className="text-gray-600 text-lg">
              Great job! Here's how you did:
            </p>
          </div>

          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl p-6 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">
                {state.currentPlayer?.score.toLocaleString()}
              </div>
              <div className="text-blue-100">Total Points</div>
            </div>
          </div>

          <Leaderboard 
            players={state.quiz.players} 
            currentPlayerId={state.currentPlayer?.id}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-white">
            <h1 className="text-2xl font-bold">{state.quiz.title}</h1>
            <p className="text-blue-100">Question {questionNumber} of {totalQuestions}</p>
          </div>
          <div className="text-white text-right">
            <div className="text-2xl font-bold">{state.currentPlayer?.score.toLocaleString()}</div>
            <div className="text-blue-100">Your Score</div>
          </div>
        </div>

        {/* Question Card */}
        <div className="mb-8">
          <QuestionCard
            question={currentQuestion}
            questionNumber={questionNumber}
            totalQuestions={totalQuestions}
            timeRemaining={state.timeRemaining}
          />
        </div>

        {/* Answer Options */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <AnswerOptions
            question={currentQuestion}
            onAnswerSelect={handleAnswerSelect}
            timeRemaining={state.timeRemaining}
            isAnswered={isAnswered}
          />
        </div>

        {/* Results Overlay */}
        {showResults && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4 text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {isAnswered && state.answers.length > 0 
                  ? (state.answers[state.answers.length - 1].isCorrect ? '✅ Correct!' : '❌ Incorrect')
                  : '⏰ Time\'s Up!'
                }
              </h2>
              <p className="text-gray-600 mb-4">
                {isAnswered && state.answers.length > 0 
                  ? `You earned ${state.answers[state.answers.length - 1].points} points!`
                  : 'Better luck next time!'
                }
              </p>
              <div className="text-sm text-gray-500">
                Next question in 3 seconds...
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
