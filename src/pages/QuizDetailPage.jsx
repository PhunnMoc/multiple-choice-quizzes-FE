import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from '../components/ui';
import { quizAPI, formatDate } from '../services/api';
import { ArrowLeft, Play, Eye, Calendar, User, BookOpen } from 'lucide-react';

const QuizDetailPage = ({ quizId, onNavigate }) => {
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAnswers, setShowAnswers] = useState(false);

  // Use quizId from props or get from URL
  const currentQuizId = quizId || new URLSearchParams(window.location.search).get('id');

  useEffect(() => {
    if (currentQuizId) {
      fetchQuiz();
    } else {
      setError('Quiz ID not provided');
      setLoading(false);
    }
  }, [currentQuizId]);

  const fetchQuiz = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await quizAPI.getQuizById(currentQuizId);
      setQuiz(response.data.quiz);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuizWithAnswers = async () => {
    try {
      setLoading(true);
      const response = await quizAPI.getQuizWithAnswers(currentQuizId);
      setQuiz(response.data.quiz);
      setShowAnswers(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--accent-color)] flex items-center justify-center">
        <Card className="text-center p-8">
          <div className="animate-spin w-8 h-8 border-4 border-[var(--primary-color)] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-[var(--text-secondary)]">Loading quiz...</p>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--accent-color)] flex items-center justify-center">
        <Card className="text-center p-8 max-w-md">
          <div className="text-red-500 mb-4">
            <BookOpen className="w-16 h-16 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
            Quiz Not Found
          </h2>
          <p className="text-[var(--text-secondary)] mb-6">{error}</p>
          <Button onClick={() => onNavigate('home')}>
            <ArrowLeft size={20} className="mr-2" />
            Go Back
          </Button>
        </Card>
      </div>
    );
  }

  if (!quiz) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[var(--accent-color)]">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-[var(--border-color)]">
        <div className="container py-6">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onNavigate('home')}
            >
              <ArrowLeft size={20} className="mr-2" />
              Back to Quizzes
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-[var(--text-primary)]">{quiz.title}</h1>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1 text-[var(--text-secondary)]">
                  <User size={16} />
                  <span>{quiz.authorName || 'Anonymous'}</span>
                </div>
                <div className="flex items-center gap-1 text-[var(--text-secondary)]">
                  <Calendar size={16} />
                  <span>{formatDate(quiz.createdAt)}</span>
                </div>
                <Badge variant="primary">
                  {quiz.questions.length} questions
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          {/* Quiz Actions */}
          <Card className="mb-6">
            <Card.Content>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-1">
                    Ready to take this quiz?
                  </h3>
                  <p className="text-[var(--text-secondary)]">
                    Test your knowledge with {quiz.questions.length} carefully crafted questions.
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={fetchQuizWithAnswers}>
                    <Eye size={20} className="mr-2" />
                    View Answers
                  </Button>
                  <Button size="lg">
                    <Play size={20} className="mr-2" />
                    Start Quiz
                  </Button>
                </div>
              </div>
            </Card.Content>
          </Card>

          {/* Questions Preview */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">
              {showAnswers ? 'Quiz with Answers' : 'Questions Preview'}
            </h2>
            
            {quiz.questions.map((question, index) => (
              <Card key={question.id || index}>
                <Card.Header>
                  <Card.Title className="flex items-center gap-3">
                    <Badge variant="primary">{index + 1}</Badge>
                    Question {index + 1}
                  </Card.Title>
                </Card.Header>
                
                <Card.Content>
                  <p className="text-lg text-[var(--text-primary)] mb-4">
                    {question.questionText}
                  </p>
                  
                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => {
                      const isCorrect = showAnswers && question.correctAnswerIndex === optionIndex;
                      return (
                        <div
                          key={optionIndex}
                          className={`
                            p-3 rounded-lg border transition-colors
                            ${isCorrect 
                              ? 'border-green-500 bg-green-50 text-green-800' 
                              : 'border-[var(--border-color)] bg-white'
                            }
                          `}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`
                              flex items-center justify-center w-6 h-6 rounded-full text-sm font-medium
                              ${isCorrect 
                                ? 'bg-green-500 text-white' 
                                : 'bg-[var(--accent-color)] text-[var(--text-primary)]'
                              }
                            `}>
                              {String.fromCharCode(65 + optionIndex)}
                            </div>
                            <span>{option}</span>
                            {isCorrect && (
                              <Badge variant="success" className="ml-auto">
                                Correct Answer
                              </Badge>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card.Content>
              </Card>
            ))}
          </div>

          {/* Quiz Stats */}
          <Card className="mt-8">
            <Card.Header>
              <Card.Title>Quiz Statistics</Card.Title>
            </Card.Header>
            
            <Card.Content>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[var(--primary-color)] mb-1">
                    {quiz.questions.length}
                  </div>
                  <div className="text-[var(--text-secondary)]">Total Questions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[var(--primary-color)] mb-1">
                    {quiz.questions.reduce((sum, q) => sum + q.options.length, 0)}
                  </div>
                  <div className="text-[var(--text-secondary)]">Total Options</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[var(--primary-color)] mb-1">
                    {Math.round(quiz.questions.length * 2.5)}min
                  </div>
                  <div className="text-[var(--text-secondary)]">Estimated Time</div>
                </div>
              </div>
            </Card.Content>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QuizDetailPage;
