'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Quiz, Player, Question, GameState, QuizAnswer } from '@/types/quiz';
import { SAMPLE_QUESTIONS } from '@/constants/quiz';
import { useQuizWebSocket } from '@/hooks/useQuizWebSocket';
import { 
  RoomCreatedData,
  RoomJoinedData,
  RoomCancelledData,
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
  // Room management fields
  roomCode: string | null;
  quizTitle: string | null;
  hostName: string | null;
  participantCount: number;
  participants: Array<{
    playerId: string;
    name: string;
    score: number;
    isConnected: boolean;
    isReady: boolean;
  }>;
  currentQuestion: any | null;
  quizResults: any | null;
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
  | { type: 'SET_ROOM_CODE'; payload: string }
  | { type: 'SET_QUIZ_TITLE'; payload: string }
  | { type: 'SET_HOST_NAME'; payload: string }
  | { type: 'SET_CURRENT_QUESTION'; payload: any }
  | { type: 'SET_QUIZ_RESULTS'; payload: any }
  | { type: 'UPDATE_PARTICIPANTS'; payload: { count: number; participants: Array<{ playerId: string; name: string; score: number; isConnected: boolean; isReady: boolean }> } }
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
  // Room management fields
  roomCode: null,
  quizTitle: null,
  hostName: null,
  participantCount: 0,
  participants: [],
  currentQuestion: null,
  quizResults: null,
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
    case 'SET_ROOM_CODE':
      console.log('🎮 Reducer: SET_ROOM_CODE', action.payload);
      return { ...state, roomCode: action.payload };
    case 'SET_QUIZ_TITLE':
      console.log('🎮 Reducer: SET_QUIZ_TITLE', action.payload);
      return { ...state, quizTitle: action.payload };
    case 'SET_HOST_NAME':
      console.log('🎮 Reducer: SET_HOST_NAME', action.payload);
      return { ...state, hostName: action.payload };
    case 'SET_CURRENT_QUESTION':
      console.log('🎮 Reducer: SET_CURRENT_QUESTION', action.payload);
      return { ...state, currentQuestion: action.payload };
    case 'SET_QUIZ_RESULTS':
      console.log('🎮 Reducer: SET_QUIZ_RESULTS', action.payload);
      return { ...state, quizResults: action.payload };
    case 'UPDATE_PARTICIPANTS':
      console.log('🎮 Reducer: UPDATE_PARTICIPANTS', action.payload);
      return { 
        ...state, 
        participantCount: action.payload.count,
        participants: action.payload.participants
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
  const router = useRouter();
  
  // Only log initialization once
  const isInitialized = useRef(false);
  if (!isInitialized.current) {
    console.log('🎮 QuizProvider initialized');
    isInitialized.current = true;
  }

  // WebSocket connection
  const websocket = useQuizWebSocket(process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3002', {
    onRoomCreated: useCallback((data: RoomCreatedData) => {
      console.log('🎮 Room created:', data.roomCode);
      console.log('🎮 Setting state:', { 
        gameState: 'waiting', 
        roomCode: data.roomCode, 
        isHost: true,
        participantCount: data.participantCount,
        participants: data.participants
      });
      dispatch({ type: 'SET_GAME_STATE', payload: 'waiting' });
      dispatch({ type: 'SET_ROOM_CODE', payload: data.roomCode });
      dispatch({ type: 'SET_HOST', payload: true });
      // Store room code for future use
      if (typeof window !== 'undefined') {
        localStorage.setItem('current_room_code', data.roomCode);
      }
      // Set participant count and list from server
      dispatch({ 
        type: 'UPDATE_PARTICIPANTS', 
        payload: { 
          count: data.participantCount,
          participants: data.participants
        } 
      });
    }, []),

    onRoomJoined: useCallback((data: RoomJoinedData) => {
      console.log('Room joined:', data);
      dispatch({ type: 'SET_GAME_STATE', payload: 'waiting' });
      dispatch({ type: 'SET_ROOM_CODE', payload: data.roomCode });
      dispatch({ type: 'SET_QUIZ_TITLE', payload: data.quizTitle });
      // Find host name from participants (first participant is usually the host)
      const hostParticipant = data.participants.find(p => p.playerId === data.participants[0]?.playerId);
      if (hostParticipant) {
        dispatch({ type: 'SET_HOST_NAME', payload: hostParticipant.name });
      }
      dispatch({ 
        type: 'UPDATE_PARTICIPANTS', 
        payload: { 
          count: data.participantCount,
          participants: data.participants
        } 
      });
    }, []),

    onRoomCancelled: useCallback((data: RoomCancelledData) => {
      console.log('🎮 Room cancelled event received:', data);
      // Reset quiz state and show alert
      dispatch({ type: 'RESET_QUIZ' });
      // Show alert to user
      alert(data.message);
      // Redirect to home page
      router.push('/');
    }, [router]),

    onParticipantJoined: useCallback((data: ParticipantJoinedData) => {
      console.log('Participant joined:', data);
      // Update participant count and list
      dispatch({ 
        type: 'UPDATE_PARTICIPANTS', 
        payload: { 
          count: data.participantCount,
          participants: data.participants
        } 
      });
    }, []),

    onParticipantLeft: useCallback((data: ParticipantLeftData) => {
      console.log('Participant left:', data);
      // Update participant count and list
      dispatch({ 
        type: 'UPDATE_PARTICIPANTS', 
        payload: { 
          count: data.participantCount,
          participants: data.participants
        } 
      });
    }, []),

    onQuizStarted: useCallback((data: QuizStartedData) => {
      console.log('Quiz started:', data);
      dispatch({ type: 'SET_GAME_STATE', payload: 'question' });
      dispatch({ type: 'SET_CURRENT_QUESTION', payload: data.question });
      dispatch({ type: 'UPDATE_TIME', payload: data.question.timeRemaining / 1000 }); // Convert to seconds
      dispatch({ type: 'UPDATE_LEADERBOARD', payload: data.leaderboard });
    }, []),

    onNextQuestion: useCallback((data: NextQuestionData) => {
      console.log('Next question:', data);
      dispatch({ type: 'SET_GAME_STATE', payload: 'question' });
      dispatch({ type: 'SET_CURRENT_QUESTION', payload: data.question });
      dispatch({ type: 'UPDATE_TIME', payload: data.question.timeRemaining / 1000 }); // Convert to seconds
      dispatch({ type: 'UPDATE_LEADERBOARD', payload: data.leaderboard });
    }, []),

    onQuizCompleted: useCallback((data: QuizCompletedData) => {
      dispatch({ type: 'SET_GAME_STATE', payload: 'finished' });
      dispatch({ type: 'SET_QUIZ_RESULTS', payload: data.results });
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
      
      // If room not found error, it might mean the room was cancelled
      if (data.message === 'Room not found') {
        console.log('Room not found - likely cancelled by host');
        dispatch({ type: 'RESET_QUIZ' });
        alert('The quiz room has been cancelled by the host.');
        router.push('/');
        return;
      }
      
      dispatch({ type: 'SET_CONNECTION', payload: { isConnected: false, error: data.message } });
    }, [router]),
  });

  // Update connection state
  useEffect(() => {
    console.log('🔌 WebSocket connection state changed:', websocket.isConnected, websocket.connectionState, websocket.error);
    dispatch({ type: 'SET_CONNECTION', payload: { isConnected: websocket.isConnected, error: websocket.error || undefined } });
  }, [websocket.isConnected, websocket.connectionState, websocket.error]);

  // Room status check interval
  useEffect(() => {
    if (!state.roomCode || !state.isConnected) return;

    const checkRoomStatus = () => {
      if (websocket.isConnected && state.roomCode) {
        console.log('🔍 Checking room status for:', state.roomCode);
        websocket.checkRoomStatus({ roomCode: state.roomCode });
      }
    };

    // Check room status every 5 seconds
    const interval = setInterval(checkRoomStatus, 5000);

    return () => clearInterval(interval);
  }, [state.roomCode, state.isConnected, websocket]);

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

    if (!state.roomCode) {
      console.error('No room code found in state');
      return;
    }

    websocket.submitAnswer({
      roomCode: state.roomCode,
      answer: answerIndex,
    });
  }, [websocket, state.roomCode]);

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
