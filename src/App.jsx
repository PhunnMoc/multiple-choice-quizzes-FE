import React, { useState } from 'react';
import HomePage from './pages/HomePage';
import CreateQuizPage from './pages/CreateQuizPage';
import QuizDetailPage from './pages/QuizDetailPage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedQuizId, setSelectedQuizId] = useState(null);

  // Simple routing logic (in a real app, you'd use React Router)
  const navigateToPage = (page, quizId = null) => {
    setCurrentPage(page);
    setSelectedQuizId(quizId);
    
    // Update URL without page refresh
    const url = new URL(window.location);
    if (page === 'quiz-detail' && quizId) {
      url.searchParams.set('id', quizId);
      url.searchParams.set('page', 'quiz-detail');
    } else if (page === 'create') {
      url.searchParams.set('page', 'create');
    } else {
      url.searchParams.delete('page');
      url.searchParams.delete('id');
    }
    window.history.pushState({}, '', url);
  };

  // Check URL parameters on load
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const page = urlParams.get('page');
    const id = urlParams.get('id');
    
    if (page === 'create') {
      setCurrentPage('create');
    } else if (page === 'quiz-detail' && id) {
      setCurrentPage('quiz-detail');
      setSelectedQuizId(id);
    } else {
      setCurrentPage('home');
    }
  }, []);

  // Handle browser back/forward buttons
  React.useEffect(() => {
    const handlePopState = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const page = urlParams.get('page');
      const id = urlParams.get('id');
      
      if (page === 'create') {
        setCurrentPage('create');
      } else if (page === 'quiz-detail' && id) {
        setCurrentPage('quiz-detail');
        setSelectedQuizId(id);
      } else {
        setCurrentPage('home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'create':
        return <CreateQuizPage onNavigate={navigateToPage} />;
      case 'quiz-detail':
        return <QuizDetailPage quizId={selectedQuizId} onNavigate={navigateToPage} />;
      default:
        return <HomePage onNavigate={navigateToPage} />;
    }
  };

  return (
    <div className="App">
      {renderPage()}
    </div>
  );
}

export default App;
