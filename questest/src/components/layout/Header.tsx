'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { UserDropdown } from '@/components/ui/UserDropdown';
import { SearchBar } from '@/components/ui/SearchBar';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

export function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [quizCode, setQuizCode] = React.useState('');

  const handleLogout = () => {
    logout();
  };

  const handleQuizCodeChange = (value: string) => {
    setQuizCode(value);
  };

  const handleJoinQuiz = () => {
    if (quizCode.trim()) {
      // TODO: Implement join quiz by code functionality
      console.log('Joining quiz with code:', quizCode);
    }
  };

  const handleCreateQuiz = () => {
    router.push('/create');
  };

  return (
    <header className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Title */}
          <div className="flex items-center">
            <a href="/" className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors">
            Quiz Master
            </a>
            <Button 
              variant="primary" 
              size="md" 
              className="ml-5"
              onClick={handleCreateQuiz}
            >
              Create Quiz
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-4">
            {/* Authenticated user menu - all users are authenticated due to AuthGuard */}
            <div className="flex items-center space-x-4">
              {/* Search Bar for Quiz Code */}
              <div className="hidden md:block">
                <SearchBar
                  value={quizCode}
                  onChange={handleQuizCodeChange}
                  placeholder="Enter quiz code"
                  className="w-48"
                />
              </div>
              
              {/* Join Quiz Button */}
              <Button
                variant="ghost"
                size="md"
                onClick={handleJoinQuiz}
                disabled={!quizCode.trim()}
              >
                Join Quiz
              </Button>
              
              <UserDropdown 
                userName={user?.name || 'User'}
                userInitial={user?.name?.charAt(0).toUpperCase() || 'U'}
                onLogout={handleLogout}
              />
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
