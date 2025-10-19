'use client';

import { useState, useEffect, useCallback } from 'react';

interface UseQuizTimerProps {
  initialTime: number;
  onTimeUp?: () => void;
  isActive?: boolean;
}

export function useQuizTimer({ 
  initialTime, 
  onTimeUp, 
  isActive = true 
}: UseQuizTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);

  const startTimer = useCallback(() => {
    setIsRunning(true);
  }, []);

  const stopTimer = useCallback(() => {
    setIsRunning(false);
  }, []);

  const resetTimer = useCallback((newTime?: number) => {
    setTimeRemaining(newTime || initialTime);
    setIsRunning(false);
  }, [initialTime]);

  useEffect(() => {
    if (!isActive || !isRunning) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          onTimeUp?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, isRunning, onTimeUp]);

  return {
    timeRemaining,
    isRunning,
    startTimer,
    stopTimer,
    resetTimer,
  };
}
