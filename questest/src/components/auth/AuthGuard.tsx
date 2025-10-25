'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { LoginPopup } from './LoginPopup';
import { SignupPopup } from './SignupPopup';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading, refreshAuth } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    // If not loading and not authenticated, show login popup
    // But don't show if we're refreshing auth state
    if (!isLoading && !isAuthenticated && !isRefreshing) {
      setShowLogin(true);
    }
  }, [isLoading, isAuthenticated, isRefreshing]);

  const handleLoginSuccess = async () => {
    setShowLogin(false);
    setShowSignup(false);
    setIsRefreshing(true);
    // Refresh authentication state to ensure it's up to date
    await refreshAuth();
    setIsRefreshing(false);
  };

  const handleSignupSuccess = async () => {
    setShowLogin(false);
    setShowSignup(false);
    setIsRefreshing(true);
    // Refresh authentication state to ensure it's up to date
    await refreshAuth();
    setIsRefreshing(false);
  };

  const openLogin = () => {
    setShowLogin(true);
    setShowSignup(false);
  };

  const openSignup = () => {
    setShowSignup(true);
    setShowLogin(false);
  };

  const closePopups = () => {
    // Don't allow closing popups if not authenticated
    if (!isAuthenticated) {
      return;
    }
    setShowLogin(false);
    setShowSignup(false);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <div className="text-white text-xl">Loading...</div>
        </div>
      </div>
    );
  }

  // Show login required screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-3xl">🔐</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Login Required
            </h1>
            <p className="text-gray-600">
              Please sign in to access the quiz platform
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={openLogin}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105"
            >
              Sign In
            </button>
            <button
              onClick={openSignup}
              className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105"
            >
              Create Account
            </button>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-xl">
            <h3 className="font-semibold text-blue-800 mb-2">Why do I need to login?</h3>
            <ul className="text-sm text-blue-700 space-y-1 text-left">
              <li>• Access to all community quizzes</li>
              <li>• Create and share your own quizzes</li>
              <li>• Track your quiz performance</li>
              <li>• Join quiz rooms and compete with others</li>
            </ul>
          </div>
        </div>

        {/* Login Popup */}
        <LoginPopup
          isOpen={showLogin}
          onClose={closePopups}
          onSuccess={handleLoginSuccess}
          onSwitchToSignup={openSignup}
        />

        {/* Signup Popup */}
        <SignupPopup
          isOpen={showSignup}
          onClose={closePopups}
          onSuccess={handleSignupSuccess}
          onSwitchToLogin={openLogin}
        />
      </div>
    );
  }

  // User is authenticated, show the protected content
  return <>{children}</>;
}
