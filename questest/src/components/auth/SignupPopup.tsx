'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface SignupPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onSwitchToLogin: () => void;
}

type SignupStep = 'form' | 'otp';

export function SignupPopup({ isOpen, onClose, onSuccess, onSwitchToLogin }: SignupPopupProps) {
  const [step, setStep] = useState<SignupStep>('form');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const { signup } = useAuth();

  // Countdown timer for resend OTP
  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const validateForm = () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);

    if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
      setError('Password must contain at least one uppercase letter, one lowercase letter, and one number');
      return false;
    }

    return true;
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setOtpSent(true);
        setStep('otp');
        setSuccess('OTP sent to your email!');
        setCountdown(60); // 60 seconds countdown
      } else {
        setError(data.message || 'Failed to send OTP');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Send OTP error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          otp,
          name,
          password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Save token to localStorage
        if (data.data.token) {
          localStorage.setItem('auth_token', data.data.token);
        }
        
        setSuccess('Account created successfully!');
        setTimeout(() => {
          onSuccess();
          onClose();
          resetForm();
        }, 1500);
      } else {
        setError(data.message || 'OTP verification failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Verify OTP error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/resend-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('OTP resent to your email!');
        setCountdown(60);
      } else {
        setError(data.message || 'Failed to resend OTP');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Resend OTP error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setOtp('');
    setError('');
    setSuccess('');
    setOtpSent(false);
    setCountdown(0);
    setStep('form');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleBackToForm = () => {
    setStep('form');
    setError('');
    setSuccess('');
    setOtp('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {step === 'form' ? 'Sign Up' : 'Verify Email'}
          </h2>
          <p className="text-gray-600">
            {step === 'form' 
              ? 'Create an account to host quiz rooms' 
              : `We sent a 6-digit code to ${email}`
            }
          </p>
        </div>

        {step === 'form' ? (
          <form onSubmit={handleSendOTP} className="space-y-6">
          <div>
            <label htmlFor="signup-name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="signup-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-black"
              required
            />
          </div>

          <div>
            <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="signup-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-black"
              required
            />
          </div>

          <div>
            <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="signup-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password (min 6 chars, 1 uppercase, 1 lowercase, 1 number)"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-black"
              required
              minLength={6}
            />
          </div>

          <div>
            <label htmlFor="signup-confirm-password" className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="signup-confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-black"
              required
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-600">{success}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full font-bold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white'
            }`}
          >
            {isLoading ? 'Sending OTP...' : 'Send Verification Code'}
          </button>
        </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                Verification Code
              </label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Enter 6-digit code"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-black text-center text-2xl tracking-widest"
                maxLength={6}
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {success && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-600">{success}</p>
              </div>
            )}

            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">
                Didn't receive the code?
              </p>
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={countdown > 0 || isLoading}
                className={`text-blue-600 hover:text-blue-800 font-medium ${
                  countdown > 0 ? 'text-gray-400 cursor-not-allowed' : ''
                }`}
              >
                {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading || otp.length !== 6}
              className={`w-full font-bold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 ${
                isLoading || otp.length !== 6
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white'
              }`}
            >
              {isLoading ? 'Verifying...' : 'Verify & Create Account'}
            </button>

            <button
              type="button"
              onClick={handleBackToForm}
              className="w-full py-2 px-4 text-gray-600 hover:text-gray-800 font-medium"
            >
              ← Back to form
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
