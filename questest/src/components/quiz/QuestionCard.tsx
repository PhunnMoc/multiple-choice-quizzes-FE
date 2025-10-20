'use client';

import React from 'react';
import { Question } from '@/types/quiz';

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  timeRemaining: number;
}

export function QuestionCard({ 
  question, 
  questionNumber, 
  totalQuestions, 
  timeRemaining 
}: QuestionCardProps) {
  const progressPercentage = (timeRemaining / question.timeLimit) * 100;

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-sm font-medium text-gray-500">
          Question {questionNumber} of {totalQuestions}
        </div>
        <div className="text-2xl font-bold text-gray-800">
          {timeRemaining}s
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 mb-8">
        <div 
          className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-1000 ease-linear"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Question Text */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 leading-tight">
          {question.questionText}
        </h2>
      </div>

      {/* Answer Options */}
      <div className="grid grid-cols-2 gap-4">
        {question.options.map((option) => (
          <button
            key={option}
            className={`
              p-6 rounded-xl text-white font-bold text-lg
              transition-all duration-200 hover:scale-105 hover:shadow-lg
              ${getOptionColor(option.color)}
            `}
          >
            <div className="flex items-center justify-center space-x-3">
              <div className="w-8 h-8 bg-white bg-opacity-30 rounded-full flex items-center justify-center">
                {option.toUpperCase()}
              </div>
              <span>{option}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function getOptionColor(color: string): string {
  switch (color) {
    case 'red':
      return 'bg-red-500 hover:bg-red-600';
    case 'blue':
      return 'bg-blue-500 hover:bg-blue-600';
    case 'yellow':
      return 'bg-yellow-500 hover:bg-yellow-600';
    case 'green':
      return 'bg-green-500 hover:bg-green-600';
    default:
      return 'bg-gray-500 hover:bg-gray-600';
  }
}
