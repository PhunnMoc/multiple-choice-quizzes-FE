'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { Quiz, Player, Question, GameState, QuizAnswer } from '@/types/quiz';
import { SAMPLE_QUESTIONS } from '@/constants/quiz';
import { useQuizWebSocket } from '@/hooks/useQuizWebSocket';
import { 
  RoomCreatedData,
  RoomJoinedData,
  ParticipantJoinedData,
  ParticipantLeftData,
  QuizStartedData,
  NextQuestionData,
  QuizCompletedData,
  AnswerSubmittedData,
  ErrorData
} from '@/types/websocket';

interface QuizState {
  quiz: Quiz | null;
  currentPlayer: Player | null;
  gameState: GameState;
  timeRemaining: number;
  answers: QuizAnswer[];
  leaderboard: Player[];
  isHost: boolean;
  isConnected: boolean;
  connectionError: string | null;
}

type QuizAction =
  | { type: 'SET_QUIZ'; payload: Quiz }
  | { type: 'SET_PLAYER'; payload: Player }
  | { type: 'SET_GAME_STATE'; payload: GameState }
  | { type: 'UPDATE_TIME'; payload: number }
  | { type: 'ADD_ANSWER'; payload: QuizAnswer }
  | { type: 'UPDATE_LEADERBOARD'; payload: Player[] }
  | { type: 'SET_HOST'; payload: boolean }
  | { type: 'SET_CONNECTION'; payload: { isConnected: boolean; error?: string } }
  | { type: 'UPDATE_PLAYER_SCORE'; payload: number }
  | { type: 'RESET_QUIZ' };

const initialState: QuizState = {
  quiz: null,
  currentPlayer: null,
  gameState: 'waiting',
  timeRemaining: 0,
  answers: [],
  leaderboard: [],
  isHost: false,
  isConnected: false,
  connectionError: null,
};

function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case 'SET_QUIZ':
      return { ...state, quiz: action.payload };
    case 'SET_PLAYER':
      return { ...state, currentPlayer: action.payload };
    case 'SET_GAME_STATE':
      return { ...state, gameState: action.payload };
    case 'UPDATE_TIME':
      return { ...state, timeRemaining: action.payload };
    case 'ADD_ANSWER':
      return { ...state, answers: [...state.answers, action.payload] };
    case 'UPDATE_LEADERBOARD':
      return { ...state, leaderboard: action.payload };
    case 'SET_HOST':
      return { ...state, isHost: action.payload };
    case 'SET_CONNECTION':
      return { 
        ...state, 
        isConnected: action.payload.isConnected,
        connectionError: action.payload.error || null
      };
    case 'UPDATE_PLAYER_SCORE':
      return {
        ...state,
        currentPlayer: state.currentPlayer ? {
          ...state.currentPlayer,
          score: action.payload
        } : null
      };
    case 'RESET_QUIZ':
      return initialState;
    default:
      return state;
  }
}

interface QuizContextType {
  state: QuizState;
  dispatch: React.Dispatch<QuizAction>;
  joinQuiz: (roomCode: string, playerName: string) => void;
  createQuiz: (quizId: string) => void;
  submitAnswer: (answerIndex: number) => void;
  startQuiz: () => void;
  nextQuestion: () => void;
  endQuiz: () => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export function QuizProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(quizReducer, initialState);
  
  console.log('🎮 QuizProvider initialized');

  // WebSocket connection
  const websocket = useQuizWebSocket(process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3000', {
    onRoomCreated: useCallback((data: RoomCreatedData) => {
      console.log('Room created:', data.roomCode);
      // Store room code for future use
      if (typeof window !== 'undefined') {
        localStorage.setItem('current_room_code', data.roomCode);
      }
    }, []),

    onRoomJoined: useCallback((data: RoomJoinedData) => {
      console.log('Room joined:', data);
      dispatch({ type: 'SET_GAME_STATE', payload: 'waiting' });
    }, []),

    onParticipantJoined: useCallback((data: ParticipantJoinedData) => {
      console.log('Participant joined:', data);
      // Update participant count in UI
    }, []),

    onParticipantLeft: useCallback((data: ParticipantLeftData) => {
      console.log('Participant left:', data);
      // Update participant count in UI
    }, []),

    onQuizStarted: useCallback((data: QuizStartedData) => {
      console.log('Quiz started:', data);
      dispatch({ type: 'SET_GAME_STATE', payload: 'question' });
      dispatch({ type: 'UPDATE_TIME', payload: data.question.timeRemaining / 1000 }); // Convert to seconds
    }, []),

    onNextQuestion: useCallback((data: NextQuestionData) => {
      console.log('Next question:', data);
      dispatch({ type: 'SET_GAME_STATE', payload: 'question' });
      dispatch({ type: 'UPDATE_TIME', payload: data.question.timeRemaining / 1000 }); // Convert to seconds
    }, []),

    onQuizCompleted: useCallback((data: QuizCompletedData) => {
      console.log('Quiz completed:', data);
      dispatch({ type: 'SET_GAME_STATE', payload: 'finished' });
      // Update leaderboard with final results
      const players = data.results.participants.map(p => ({
        id: p.name, // Use name as ID for now
        name: p.name,
        score: p.score,
        isConnected: true
      }));
      dispatch({ type: 'UPDATE_LEADERBOARD', payload: players });
    }, []),

    onAnswerSubmitted: useCallback((data: AnswerSubmittedData) => {
      console.log('Answer submitted:', data);
      // Update current player's score - use dispatch directly without state dependency
      dispatch({ type: 'UPDATE_PLAYER_SCORE', payload: data.currentScore });
    }, []),

    onError: useCallback((data: ErrorData) => {
      console.error('WebSocket error:', data);
      dispatch({ type: 'SET_CONNECTION', payload: { isConnected: false, error: data.message } });
    }, []),
  });

  // Update connection state
  useEffect(() => {
    console.log('🔌 WebSocket connection state changed:', websocket.isConnected, websocket.connectionState, websocket.error);
    dispatch({ type: 'SET_CONNECTION', payload: { isConnected: websocket.isConnected, error: websocket.error || undefined } });
  }, [websocket.isConnected, websocket.connectionState, websocket.error]);

  // Timer effect
  useEffect(() => {
    if (state.gameState === 'question' && state.timeRemaining > 0) {
      const timer = setInterval(() => {
        dispatch({ type: 'UPDATE_TIME', payload: state.timeRemaining - 1 });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [state.gameState, state.timeRemaining]);

  const joinQuiz = useCallback((roomCode: string, playerName: string) => {
    if (!websocket.isConnected) {
      console.error('WebSocket not connected');
      return;
    }

    websocket.joinRoom({
      roomCode,
      name: playerName,
    });
  }, [websocket]);

  const createQuiz = useCallback((quizId: string) => {
    if (!websocket.isConnected) {
      console.error('WebSocket not connected');
      return;
    }

    websocket.createRoom({
      quizId,
    });
  }, [websocket]);

  const submitAnswer = useCallback((answerIndex: number) => {
    if (!websocket.isConnected) return;

    const roomCode = typeof window !== 'undefined' ? localStorage.getItem('current_room_code') : null;
    if (!roomCode) {
      console.error('No room code found');
      return;
    }

    websocket.submitAnswer({
      roomCode,
      answer: answerIndex,
    });
  }, [websocket]);

  const startQuiz = useCallback(() => {
    if (!websocket.isConnected) return;

    const roomCode = typeof window !== 'undefined' ? localStorage.getItem('current_room_code') : null;
    if (!roomCode) {
      console.error('No room code found');
      return;
    }

    websocket.startQuiz({
      roomCode,
    });
  }, [websocket]);

  const nextQuestion = useCallback(() => {
    if (!websocket.isConnected) return;

    const roomCode = typeof window !== 'undefined' ? localStorage.getItem('current_room_code') : null;
    if (!roomCode) {
      console.error('No room code found');
      return;
    }

    websocket.nextQuiz({
      roomCode,
    });
  }, [websocket]);

  const endQuiz = useCallback(() => {
    // Quiz ends automatically when all questions are answered
    console.log('Quiz ended');
  }, []);

  const value: QuizContextType = {
    state,
    dispatch,
    joinQuiz,
    createQuiz,
    submitAnswer,
    startQuiz,
    nextQuestion,
    endQuiz,
  };

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
}
