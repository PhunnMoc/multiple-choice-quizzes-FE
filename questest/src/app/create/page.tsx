'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { H1, H2, H3, Subtle } from '@/components/ui/Typography';
import { apiService } from '@/lib/api';

interface Question {
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
}

export default function CreateQuizPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [questions, setQuestions] = useState<Question[]>([
    {
      questionText: '',
      options: ['', '', '', ''],
      correctAnswerIndex: 0
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const addQuestion = () => {
    setQuestions([...questions, {
      questionText: '',
      options: ['', '', '', ''],
      correctAnswerIndex: 0
    }]);
  };

  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    setQuestions(updatedQuestions);
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(updatedQuestions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Validate form
      if (!title.trim()) {
        setError('Quiz title is required');
        return;
      }

      if (questions.some(q => !q.questionText.trim())) {
        setError('All questions must have text');
        return;
      }

      if (questions.some(q => q.options.some(opt => !opt.trim()))) {
        setError('All options must be filled');
        return;
      }

      const quizData = {
        title: title.trim(),
        authorName: authorName.trim() || undefined,
        questions: questions.map(q => ({
          questionText: q.questionText.trim(),
          options: q.options.map(opt => opt.trim()),
          correctAnswerIndex: q.correctAnswerIndex
        }))
      };

      const response = await apiService.createQuiz(quizData);

      if (response.success) {
        router.push('/');
      } else {
        setError(response.message || 'Failed to create quiz');
      }
    } catch (err) {
      console.error('Error creating quiz:', err);
      setError('An error occurred while creating the quiz');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            size="md"
            onClick={() => router.back()}
            className="mb-4"
          >
            ←
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Quiz Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <H2 className="mb-4">Quiz Information</H2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quiz Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter quiz title"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent outline-none transition-all font-[Euclid_Circular_A,Helvetica_Neue,Helvetica,Arial,sans-serif] text-[13px]  text-black"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Author Name
                </label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Enter your name (optional)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent outline-none transition-all font-[Euclid_Circular_A,Helvetica_Neue,Helvetica,Arial,sans-serif] text-[13px]  text-black"
                />
              </div>
            </div>
          </div>

          {/* Questions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <H2>Questions</H2>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={addQuestion}
              >
                + Add Question
              </Button>
            </div>

            <div className="space-y-6">
              {questions.map((question, questionIndex) => (
                <div key={questionIndex} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <H3>Question {questionIndex + 1}</H3>
                    {questions.length > 1 && (
                      <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        onClick={() => removeQuestion(questionIndex)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>

                  {/* Question Text */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Question Text *
                    </label>
                    <textarea
                      value={question.questionText}
                      onChange={(e) => updateQuestion(questionIndex, 'questionText', e.target.value)}
                      placeholder="Enter your question"
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2  transition-all font-[Euclid_Circular_A,Helvetica_Neue,Helvetica,Arial,sans-serif] text-[13px]  text-black"
                      required
                    />
                  </div>

                  {/* Options */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Answer Options *
                    </label>
                    {question.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name={`correct-${questionIndex}`}
                          checked={question.correctAnswerIndex === optionIndex}
                          onChange={() => updateQuestion(questionIndex, 'correctAnswerIndex', optionIndex)}
                          className="w-4 h-4"
                        />
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => updateOption(questionIndex, optionIndex, e.target.value)}
                          placeholder={`Option ${optionIndex + 1}`}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2  focus:border-transparent transition-all font-[Euclid_Circular_A,Helvetica_Neue,Helvetica,Arial,sans-serif] text-[13px] text-black"
                          required
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="ghost"
              size="lg"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
            >
              Create Quiz
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
