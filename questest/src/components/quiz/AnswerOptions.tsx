'use client';

import React, { useState, useEffect } from 'react';
import { Question } from '@/types/quiz';

interface AnswerOptionsProps {
  question: Question;
  onAnswerSelect: (answerIndex: number, timeToAnswer: number) => void;
  timeRemaining: number;
  isAnswered: boolean;
}

export function AnswerOptions({ 
  question, 
  onAnswerSelect, 
  timeRemaining,
  isAnswered 
}: AnswerOptionsProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    if (timeRemaining === 0 && !isAnswered) {
      // Auto-submit if time runs out
      onAnswerSelect(-1, question.timeLimit || 30);
    }
  }, [timeRemaining, isAnswered, onAnswerSelect, question.timeLimit]);

  const handleAnswerClick = (answerIndex: number) => {
    if (isAnswered) return;
    
    const timeToAnswer = (question.timeLimit || 30) - timeRemaining;
    setSelectedAnswer(answerIndex);
    onAnswerSelect(answerIndex, timeToAnswer);
  };

  const getOptionColor = (optionIndex: number, isSelected: boolean) => {
    const colors: ('red' | 'blue' | 'yellow' | 'green')[] = ['red', 'blue', 'yellow', 'green'];
    const color = colors[optionIndex];
    
    const baseColors = {
      red: 'bg-red-500',
      blue: 'bg-blue-500', 
      yellow: 'bg-yellow-500',
      green: 'bg-green-500',
    };

    const hoverColors = {
      red: 'hover:bg-red-600',
      blue: 'hover:bg-blue-600',
      yellow: 'hover:bg-yellow-600', 
      green: 'hover:bg-green-600',
    };

    const selectedColors = {
      red: 'bg-red-600 ring-4 ring-red-300',
      blue: 'bg-blue-600 ring-4 ring-blue-300',
      yellow: 'bg-yellow-600 ring-4 ring-yellow-300',
      green: 'bg-green-600 ring-4 ring-green-300',
    };

    if (isAnswered) {
      if (optionIndex === question.correctAnswerIndex) {
        return 'bg-green-600 ring-4 ring-green-300';
      }
      if (isSelected && optionIndex !== question.correctAnswerIndex) {
        return 'bg-red-600 ring-4 ring-red-300';
      }
      return 'bg-gray-400 opacity-50';
    }

    if (isSelected) {
      return selectedColors[color];
    }

    return `${baseColors[color]} ${hoverColors[color]}`;
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {question.options.map((optionText, index) => {
        const optionLabels = ['A', 'B', 'C', 'D'];
        const isSelected = selectedAnswer === index;
        
        return (
          <button
            key={index}
            onClick={() => handleAnswerClick(index)}
            disabled={isAnswered}
            className={`
              p-6 rounded-xl text-white font-bold text-lg
              transition-all duration-200 transform
              ${isAnswered ? 'cursor-not-allowed' : 'hover:scale-105 hover:shadow-lg'}
              ${getOptionColor(index, isSelected)}
            `}
          >
            <div className="flex items-center justify-center space-x-3">
              <div className="w-8 h-8 bg-white bg-opacity-30 rounded-full flex items-center justify-center">
                {optionLabels[index]}
              </div>
              <span>{optionText}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
