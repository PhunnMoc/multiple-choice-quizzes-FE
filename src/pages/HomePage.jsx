import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Badge } from '../components/ui';
import { quizAPI, formatDate, truncateText } from '../services/api';
import { Plus, Search, BookOpen, Users, Calendar } from 'lucide-react';

const HomePage = ({ onNavigate }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);

  const fetchQuizzes = async (page = 1, search = '') => {
    try {
      setLoading(true);
      setError(null);
      const response = await quizAPI.getQuizzes({
        page,
        limit: 9,
        search: search || undefined
      });
      
      setQuizzes(response.data.quizzes);
      setPagination(response.data.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes(currentPage, searchTerm);
  }, [currentPage]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchQuizzes(1, searchTerm);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const stats = [
    { label: 'Total Quizzes', value: pagination.totalQuizzes || 0, icon: BookOpen },
    { label: 'Questions', value: quizzes.reduce((sum, quiz) => sum + quiz.questionsCount, 0), icon: Users },
    { label: 'Authors', value: new Set(quizzes.map(q => q.authorName)).size, icon: Calendar }
  ];

  return (
    <div className="min-h-screen bg-[var(--accent-color)]">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-[var(--border-color)]">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[var(--text-primary)]">Quiz Platform</h1>
              <p className="text-[var(--text-secondary)] mt-1">Create and share interactive quizzes</p>
            </div>
            <Button 
              size="lg" 
              className="flex items-center gap-2"
              onClick={() => onNavigate('create')}
            >
              <Plus size={20} />
              Create Quiz
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <div className="flex items-center justify-center mb-3">
                <div className="p-3 bg-[var(--primary-color)] bg-opacity-10 rounded-full">
                  <stat.icon className="w-6 h-6 text-[var(--primary-color)]" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-[var(--text-primary)]">{stat.value}</h3>
              <p className="text-[var(--text-secondary)]">{stat.label}</p>
            </Card>
          ))}
        </div>

        {/* Search */}
        <Card className="mb-8">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search quizzes by title or author..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Button type="submit" className="flex items-center gap-2">
              <Search size={20} />
              Search
            </Button>
          </form>
        </Card>

        {/* Error State */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <div className="text-red-600 text-center">
              <p className="font-medium">Error loading quizzes</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </Card>
        )}

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-3"></div>
                <div className="h-3 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </Card>
            ))}
          </div>
        )}

        {/* Quiz Grid */}
        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {quizzes.map((quiz) => (
                <Card key={quiz.id} hover className="animate-fade-in">
                  <Card.Header>
                    <Card.Title className="text-lg">{quiz.title}</Card.Title>
                    <Card.Description>
                      by {quiz.authorName || 'Anonymous'}
                    </Card.Description>
                  </Card.Header>
                  
                  <Card.Content>
                    <div className="flex items-center gap-4 mb-4">
                      <Badge variant="primary">
                        {quiz.questionsCount} questions
                      </Badge>
                      <span className="text-sm text-[var(--text-secondary)]">
                        {formatDate(quiz.createdAt)}
                      </span>
                    </div>
                  </Card.Content>
                  
                  <Card.Footer>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => onNavigate('quiz-detail', quiz.id)}
                      >
                        View Quiz
                      </Button>
                      <Button variant="ghost" size="sm">
                        Take Quiz
                      </Button>
                    </div>
                  </Card.Footer>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination.hasPrevPage}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  Previous
                </Button>
                
                <span className="px-4 py-2 text-sm text-[var(--text-secondary)]">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination.hasNextPage}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Next
                </Button>
              </div>
            )}

            {/* Empty State */}
            {quizzes.length === 0 && (
              <Card className="text-center py-12">
                <BookOpen className="w-16 h-16 text-[var(--text-secondary)] mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                  No quizzes found
                </h3>
                <p className="text-[var(--text-secondary)] mb-6">
                  {searchTerm ? 'Try adjusting your search terms' : 'Be the first to create a quiz!'}
                </p>
                <Button 
                  size="lg"
                  onClick={() => onNavigate('create')}
                >
                  <Plus size={20} className="mr-2" />
                  Create Your First Quiz
                </Button>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;
