import React, { useState } from 'react';
import { Card, Button, Input, Badge } from '../components/ui';
import { quizAPI } from '../services/api';
import { Plus, Trash2, ArrowLeft, Save } from 'lucide-react';

const CreateQuizPage = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    title: '',
    authorName: '',
    questions: [
      {
        questionText: '',
        options: ['', '', '', ''],
        correctAnswerIndex: 0
      }
    ]
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleQuestionChange = (questionIndex, field, value) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map((question, index) =>
        index === questionIndex ? { ...question, [field]: value } : question
      )
    }));
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map((question, index) =>
        index === questionIndex
          ? {
              ...question,
              options: question.options.map((option, optIndex) =>
                optIndex === optionIndex ? value : option
              )
            }
          : question
      )
    }));
  };

  const addQuestion = () => {
    setFormData(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          questionText: '',
          options: ['', '', '', ''],
          correctAnswerIndex: 0
        }
      ]
    }));
  };

  const removeQuestion = (questionIndex) => {
    if (formData.questions.length > 1) {
      setFormData(prev => ({
        ...prev,
        questions: prev.questions.filter((_, index) => index !== questionIndex)
      }));
    }
  };

  const validateForm = () => {
    const errors = [];

    if (!formData.title.trim()) {
      errors.push('Quiz title is required');
    }

    if (formData.questions.length === 0) {
      errors.push('At least one question is required');
    }

    formData.questions.forEach((question, index) => {
      if (!question.questionText.trim()) {
        errors.push(`Question ${index + 1}: Question text is required`);
      }

      question.options.forEach((option, optIndex) => {
        if (!option.trim()) {
          errors.push(`Question ${index + 1}, Option ${optIndex + 1}: Option text is required`);
        }
      });
    });

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (errors.length > 0) {
      setError(errors.join(', '));
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await quizAPI.createQuiz(formData);
      setSuccess(true);
      
      // Reset form after successful creation
      setTimeout(() => {
        setFormData({
          title: '',
          authorName: '',
          questions: [
            {
              questionText: '',
              options: ['', '', '', ''],
              correctAnswerIndex: 0
            }
          ]
        });
        setSuccess(false);
      }, 3000);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
            <div>
              <h1 className="text-3xl font-bold text-[var(--text-primary)]">Create New Quiz</h1>
              <p className="text-[var(--text-secondary)] mt-1">Build an engaging quiz for your audience</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container py-8">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          {/* Success Message */}
          {success && (
            <Card className="mb-6 border-green-200 bg-green-50">
              <div className="text-green-600 text-center">
                <p className="font-medium">Quiz created successfully!</p>
                <p className="text-sm mt-1">Your quiz is now available for others to take.</p>
              </div>
            </Card>
          )}

          {/* Error Message */}
          {error && (
            <Card className="mb-6 border-red-200 bg-red-50">
              <div className="text-red-600">
                <p className="font-medium">Please fix the following errors:</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            </Card>
          )}

          {/* Quiz Info */}
          <Card className="mb-6">
            <Card.Header>
              <Card.Title>Quiz Information</Card.Title>
              <Card.Description>Basic details about your quiz</Card.Description>
            </Card.Header>
            
            <Card.Content className="space-y-4">
              <Input
                label="Quiz Title"
                placeholder="Enter a descriptive title for your quiz"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
              />
              
              <Input
                label="Author Name"
                placeholder="Your name (optional)"
                value={formData.authorName}
                onChange={(e) => handleInputChange('authorName', e.target.value)}
              />
            </Card.Content>
          </Card>

          {/* Questions */}
          <div className="space-y-6">
            {formData.questions.map((question, questionIndex) => (
              <Card key={questionIndex}>
                <Card.Header>
                  <div className="flex items-center justify-between">
                    <div>
                      <Card.Title className="flex items-center gap-2">
                        Question {questionIndex + 1}
                        <Badge variant="primary">{questionIndex + 1}</Badge>
                      </Card.Title>
                    </div>
                    {formData.questions.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeQuestion(questionIndex)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </Button>
                    )}
                  </div>
                </Card.Header>
                
                <Card.Content className="space-y-4">
                  <Input.Textarea
                    label="Question Text"
                    placeholder="Enter your question here..."
                    value={question.questionText}
                    onChange={(e) => handleQuestionChange(questionIndex, 'questionText', e.target.value)}
                    rows={3}
                    required
                  />
                  
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-[var(--text-primary)]">
                      Answer Options
                    </label>
                    {question.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[var(--accent-color)] text-sm font-medium">
                          {String.fromCharCode(65 + optionIndex)}
                        </div>
                        <Input
                          placeholder={`Option ${String.fromCharCode(65 + optionIndex)}`}
                          value={option}
                          onChange={(e) => handleOptionChange(questionIndex, optionIndex, e.target.value)}
                          className="flex-1"
                          required
                        />
                        <Button
                          type="button"
                          variant={question.correctAnswerIndex === optionIndex ? 'primary' : 'outline'}
                          size="sm"
                          onClick={() => handleQuestionChange(questionIndex, 'correctAnswerIndex', optionIndex)}
                        >
                          {question.correctAnswerIndex === optionIndex ? 'Correct' : 'Mark Correct'}
                        </Button>
                      </div>
                    ))}
                  </div>
                </Card.Content>
              </Card>
            ))}
          </div>

          {/* Add Question Button */}
          <Card className="mb-6">
            <Card.Content className="text-center">
              <Button
                type="button"
                variant="outline"
                onClick={addQuestion}
                className="flex items-center gap-2"
              >
                <Plus size={20} />
                Add Another Question
              </Button>
            </Card.Content>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onNavigate('home')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={loading}
              className="flex items-center gap-2"
            >
              <Save size={20} />
              Create Quiz
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateQuizPage;
