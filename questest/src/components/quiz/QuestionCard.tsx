'use client';

import React, { useState, useEffect } from 'react';
import { useQuiz } from '@/context/QuizContext';
import { Button } from '@/components/ui/Button';

interface QuestionCardProps {
  question: {
    questionIndex: number;
    questionText: string;
    options: string[];
    timeRemaining: number;
    totalQuestions: number;
    startAt: number;
    duration: number;
  };
  onAnswerSubmit: (answerIndex: number) => void;
  isAnswered: boolean;
}

export function QuestionCard({ question, onAnswerSubmit, isAnswered }: QuestionCardProps) {
  const [timeRemaining, setTimeRemaining] = useState(question.timeRemaining / 1000); // Convert to seconds
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  // Timer effect
  useEffect(() => {
    if (timeRemaining <= 0 || isAnswered) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          // Time's up - auto submit if no answer selected
          if (selectedAnswer !== null) {
            onAnswerSubmit(selectedAnswer);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, isAnswered, selectedAnswer, onAnswerSubmit]);

  // Update time remaining when question changes
  useEffect(() => {
    setTimeRemaining(question.timeRemaining / 1000);
    setSelectedAnswer(null);
  }, [question.questionIndex]);

  const handleAnswerClick = (answerIndex: number) => {
    if (isAnswered) return;
    
    console.log('🎯 Answer clicked:', {
      answerIndex: answerIndex,
      questionIndex: question.questionIndex,
      questionText: question.questionText,
      options: question.options
    });
    
    setSelectedAnswer(answerIndex);
    onAnswerSubmit(answerIndex);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
              Question {question.questionIndex + 1} of {question.totalQuestions}
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
              timeRemaining > 5 
                ? 'bg-green-100 text-green-800' 
                : timeRemaining > 2 
                  ? 'bg-yellow-100 text-yellow-800' 
                  : 'bg-red-100 text-red-800'
            }`}>
              {formatTime(timeRemaining)}
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="flex-1 max-w-xs ml-4">
            <div className="bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                style={{ 
                  width: `${((question.duration / 1000 - timeRemaining) / (question.duration / 1000)) * 100}%` 
                }}
              />
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 leading-relaxed">
            {question.questionText}
          </h2>
        </div>

        {/* Answer Options */}
        <div className="space-y-4 mb-8">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerClick(index)}
              disabled={isAnswered}
              className={`w-full p-4 rounded-xl text-left transition-all duration-200 transform hover:scale-105 ${
                isAnswered
                  ? selectedAnswer === index
                    ? 'bg-green-100 border-2 border-green-500 text-green-800'
                    : 'bg-gray-100 text-gray-500 cursor-not-allowed'
                  : selectedAnswer === index
                    ? 'bg-blue-100 border-2 border-blue-500 text-blue-800'
                    : 'bg-gray-50 border-2 border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                  isAnswered
                    ? selectedAnswer === index
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-300 text-gray-600'
                    : selectedAnswer === index
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                }`}>
                  {String.fromCharCode(65 + index)}
                </div>
                <span className="text-lg">{option}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Status */}
        {isAnswered && (
          <div className="text-center">
            <div className="text-lg font-semibold text-green-600 mb-2">
              ✅ Answer Submitted!
            </div>
            <p className="text-gray-600">
              Waiting for other participants...
            </p>
          </div>
        )}

        {timeRemaining <= 0 && !isAnswered && (
          <div className="text-center">
            <div className="text-lg font-semibold text-red-600 mb-2">
              ⏰ Time's Up!
            </div>
            <p className="text-gray-600">
              Moving to next question...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}