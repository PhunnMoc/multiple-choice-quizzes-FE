'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';

export function Header() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Title */}
          <div className="flex items-center">
            <a href="/" className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors">
              🎯 Quiz Master
            </a>
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-4">
            {/* Authenticated user menu - all users are authenticated due to AuthGuard */}
            <div className="flex items-center space-x-4">
              <nav className="hidden md:flex items-center space-x-4">
                <a href="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                  Home
                </a>
                <a href="/my-quizzes" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                  My Quizzes
                </a>
                <a href="/create" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                  Create Quiz
                </a>
              </nav>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-gray-700 font-medium hidden sm:block">
                  {user?.name}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
