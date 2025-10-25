'use client';

import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { H2, H3 } from '../ui/Typography';

interface Question {
  questionIndex: number;
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
}

interface Answer {
  questionIndex: number;
  answerIndex: number;
  isCorrect: boolean;
  timeSpent: number;
  submittedAt: Date;
}

interface Participant {
  playerId: string;
  name: string;
  score: number;
  totalQuestions: number;
  answers: Answer[];
}

interface DetailedResultsProps {
  participants: Participant[];
  questions: Question[];
  currentPlayerId?: string;
  onBack: () => void;
}

export function DetailedResults({ 
  participants, 
  questions, 
  currentPlayerId, 
  onBack 
}: DetailedResultsProps) {
  const [selectedParticipantId, setSelectedParticipantId] = useState<string | null>(
    participants[0]?.playerId || null
  );

  const selectedParticipant = participants.find(p => p.playerId === selectedParticipantId);
  const canViewAll = true; // Allow everyone to view all results

  const getAnswerColor = (isCorrect: boolean) => {
    return isCorrect ? 'text-green-600' : 'text-red-600';
  };

  const getAnswerBackground = (isCorrect: boolean) => {
    return isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200';
  };

  const formatTime = (timeSpent: number) => {
    return `${(timeSpent / 1000).toFixed(1)}s`;
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <H2>Detailed Results</H2>
            <p className="text-gray-600 mt-1">
              View detailed answers for any participant
            </p>
          </div>
          <Button
            variant="ghost"
            onClick={onBack}
            className="px-4 py-2"
          >
            ← Back to Results
          </Button>
        </div>

        {/* Participant Selector */}
        <div className="mb-6">
          <H3 className="mb-3">Select Participant</H3>
          <div className="flex flex-wrap gap-2">
            {participants.map((participant) => (
              <button
                key={participant.playerId}
                onClick={() => setSelectedParticipantId(participant.playerId)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedParticipantId === participant.playerId
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {participant.name} ({participant.score}/{participant.totalQuestions})
              </button>
            ))}
          </div>
        </div>

        {/* Participant Info */}
        {selectedParticipant && (
          <div className="mb-6">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {selectedParticipant.name}
                    {selectedParticipant.playerId === currentPlayerId && (
                      <span className="ml-2 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        You
                      </span>
                    )}
                  </h3>
                  <p className="text-gray-600">
                    Score: {selectedParticipant.score}/{selectedParticipant.totalQuestions} 
                    ({((selectedParticipant.score / selectedParticipant.totalQuestions) * 100).toFixed(1)}%)
                  </p>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${
                    selectedParticipant.score === selectedParticipant.totalQuestions 
                      ? 'text-green-600' 
                      : selectedParticipant.score >= selectedParticipant.totalQuestions * 0.8
                        ? 'text-yellow-600'
                        : 'text-red-600'
                  }`}>
                    {selectedParticipant.score}
                  </div>
                  <div className="text-sm text-gray-500">Total Score</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Questions and Answers */}
        {selectedParticipant && (
          <div className="space-y-6" key={selectedParticipantId}>
            <H3>Question-by-Question Results</H3>
            
            {/* Debug Info */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-yellow-800 mb-2">Debug Info:</h4>
              <div className="text-sm text-yellow-700">
                <p>Selected Participant: {selectedParticipant.name}</p>
                <p>Total Questions: {questions.length}</p>
                <p>Total Answers: {selectedParticipant.answers.length}</p>
                <p>Answers: {JSON.stringify(selectedParticipant.answers.map(a => ({ questionIndex: a.questionIndex, answerIndex: a.answerIndex, isCorrect: a.isCorrect })))}</p>
              </div>
            </div>
            
            {questions.map((question, questionIndex) => {
              const answer = selectedParticipant.answers.find(a => a.questionIndex === questionIndex);
              const isNoAnswer = answer?.answerIndex === -1;
              
              return (
                <div key={questionIndex} className="border border-gray-200 rounded-xl p-6">
                  {/* Question Header */}
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-800">
                      Question {questionIndex + 1}
                    </h4>
                    {answer && (
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        answer.isCorrect 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {answer.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                      </div>
                    )}
                  </div>

                  {/* Question Text */}
                  <p className="text-gray-700 mb-4 font-medium">
                    {question.questionText}
                  </p>

                         {/* Answer Options */}
                         <div className="space-y-2">
                           {question.options.map((option, optionIndex) => {
                             const isSelected = answer?.answerIndex === optionIndex;
                             const isCorrect = optionIndex === question.correctAnswerIndex;
                             
                             return (
                               <div
                                 key={optionIndex}
                                 className={`p-3 rounded-lg border-2 transition-colors ${
                                   isSelected && isCorrect
                                     ? 'bg-green-50 border-green-300 text-green-800'
                                     : isSelected && !isCorrect
                                       ? 'bg-red-50 border-red-300 text-red-800'
                                       : isCorrect
                                         ? 'bg-green-50 border-green-200 text-green-700'
                                         : 'bg-gray-50 border-gray-200 text-gray-700'
                                 }`}
                               >
                                 <div className="flex items-center justify-between">
                                   <span className="font-medium">
                                     {String.fromCharCode(65 + optionIndex)}. {option}
                                   </span>
                                   <div className="flex items-center space-x-2">
                                     {isCorrect && (
                                       <span className="text-green-600 font-bold">✓</span>
                                     )}
                                     {isSelected && !isCorrect && (
                                       <span className="text-red-600 font-bold">✗</span>
                                     )}
                                     {isSelected && (
                                       <span className="text-blue-600 font-bold text-sm">Your Answer</span>
                                     )}
                                     {isNoAnswer && (
                                       <span className="text-gray-500 font-bold text-sm">No Answer</span>
                                     )}
                                   </div>
                                 </div>
                               </div>
                             );
                           })}
                           
                           {/* Show "No Answer" status if user didn't answer */}
                           {isNoAnswer && (
                             <div className="mt-2 p-2 bg-gray-100 rounded text-sm text-gray-600">
                               ⏰ No answer submitted (timeout)
                             </div>
                           )}
                         </div>

                  {/* Debug Info */}
                  {answer && (
                    <div className="mt-2 p-2 bg-gray-100 rounded text-xs">
                      Debug: answerIndex={answer.answerIndex}, correctAnswerIndex={question.correctAnswerIndex}, isCorrect={answer.isCorrect}
                    </div>
                  )}

                  {/* Answer Details */}
                  {answer && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Time Spent:</span>
                          <span className="ml-2 font-medium">{formatTime(answer.timeSpent)}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Submitted:</span>
                          <span className="ml-2 font-medium">
                            {new Date(answer.submittedAt).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
