'use client';

import { useEffect, useCallback, useRef } from 'react';
import { useWebSocket } from './useWebSocket';
import { 
  ClientToServerEvents, 
  ServerToClientEvents,
  CreateRoomData,
  JoinRoomData,
  SubmitAnswerData,
  StartQuizData,
  NextQuizData,
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
import { Quiz, Player, Question, QuizAnswer } from '@/types/quiz';

interface UseQuizWebSocketProps {
  onRoomCreated?: (data: RoomCreatedData) => void;
  onRoomJoined?: (data: RoomJoinedData) => void;
  onParticipantJoined?: (data: ParticipantJoinedData) => void;
  onParticipantLeft?: (data: ParticipantLeftData) => void;
  onQuizStarted?: (data: QuizStartedData) => void;
  onNextQuestion?: (data: NextQuestionData) => void;
  onQuizCompleted?: (data: QuizCompletedData) => void;
  onAnswerSubmitted?: (data: AnswerSubmittedData) => void;
  onError?: (data: ErrorData) => void;
}

interface UseQuizWebSocketReturn {
  // Connection
  isConnected: boolean;
  connectionState: string;
  error: string | null;
  connect: () => void;
  disconnect: () => void;
  
  // Room actions
  createRoom: (data: CreateRoomData) => void;
  joinRoom: (data: JoinRoomData) => void;
  
  // Game actions
  startQuiz: (data: StartQuizData) => void;
  submitAnswer: (data: SubmitAnswerData) => void;
  nextQuiz: (data: NextQuizData) => void;
}

export function useQuizWebSocket(
  serverUrl: string = 'http://localhost:3001', // Backend runs on port 3001
  callbacks: UseQuizWebSocketProps = {}
): UseQuizWebSocketReturn {
  const { socket, isConnected, connectionState, error, connect, disconnect } = useWebSocket({
    url: serverUrl,
    options: {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    }
  });

  // Store callbacks in ref to avoid re-registering listeners
  const callbacksRef = useRef(callbacks);
  callbacksRef.current = callbacks;

  // Register event listeners
  useEffect(() => {
    if (!socket) return;

    const handleRoomCreated = (data: RoomCreatedData) => {
      console.log('Room created:', data);
      callbacksRef.current.onRoomCreated?.(data);
    };

    const handleRoomJoined = (data: RoomJoinedData) => {
      console.log('Room joined:', data);
      callbacksRef.current.onRoomJoined?.(data);
    };

    const handleParticipantJoined = (data: ParticipantJoinedData) => {
      console.log('Participant joined:', data);
      callbacksRef.current.onParticipantJoined?.(data);
    };

    const handleParticipantLeft = (data: ParticipantLeftData) => {
      console.log('Participant left:', data);
      callbacksRef.current.onParticipantLeft?.(data);
    };

    const handleQuizStarted = (data: QuizStartedData) => {
      console.log('Quiz started:', data);
      callbacksRef.current.onQuizStarted?.(data);
    };

    const handleNextQuestion = (data: NextQuestionData) => {
      console.log('Next question:', data);
      callbacksRef.current.onNextQuestion?.(data);
    };

    const handleQuizCompleted = (data: QuizCompletedData) => {
      console.log('Quiz completed:', data);
      callbacksRef.current.onQuizCompleted?.(data);
    };

    const handleAnswerSubmitted = (data: AnswerSubmittedData) => {
      console.log('Answer submitted:', data);
      callbacksRef.current.onAnswerSubmitted?.(data);
    };

    const handleError = (data: ErrorData) => {
      console.error('Error:', data);
      callbacksRef.current.onError?.(data);
    };

    // Register all event listeners
    socket.on('room-created', handleRoomCreated);
    socket.on('room-joined', handleRoomJoined);
    socket.on('participant-joined', handleParticipantJoined);
    socket.on('participant-left', handleParticipantLeft);
    socket.on('quiz-started', handleQuizStarted);
    socket.on('next-question', handleNextQuestion);
    socket.on('quiz-completed', handleQuizCompleted);
    socket.on('answer-submitted', handleAnswerSubmitted);
    socket.on('error', handleError);

    // Cleanup listeners on unmount
    return () => {
      socket.off('room-created', handleRoomCreated);
      socket.off('room-joined', handleRoomJoined);
      socket.off('participant-joined', handleParticipantJoined);
      socket.off('participant-left', handleParticipantLeft);
      socket.off('quiz-started', handleQuizStarted);
      socket.off('next-question', handleNextQuestion);
      socket.off('quiz-completed', handleQuizCompleted);
      socket.off('answer-submitted', handleAnswerSubmitted);
      socket.off('error', handleError);
    };
  }, [socket]);

  // Room actions
  const createRoom = useCallback((data: CreateRoomData) => {
    if (socket && isConnected) {
      socket.emit('create-room', data);
    } else {
      console.error('Cannot create room: WebSocket not connected');
    }
  }, [socket, isConnected]);

  const joinRoom = useCallback((data: JoinRoomData) => {
    if (socket && isConnected) {
      socket.emit('join-room', data);
    } else {
      console.error('Cannot join room: WebSocket not connected');
    }
  }, [socket, isConnected]);

  // Game actions
  const startQuiz = useCallback((data: StartQuizData) => {
    if (socket && isConnected) {
      socket.emit('start-quiz', data);
    } else {
      console.error('Cannot start quiz: WebSocket not connected');
    }
  }, [socket, isConnected]);

  const submitAnswer = useCallback((data: SubmitAnswerData) => {
    if (socket && isConnected) {
      socket.emit('submit-answer', data);
    } else {
      console.error('Cannot submit answer: WebSocket not connected');
    }
  }, [socket, isConnected]);

  const nextQuiz = useCallback((data: NextQuizData) => {
    if (socket && isConnected) {
      socket.emit('next-quiz', data);
    } else {
      console.error('Cannot go to next question: WebSocket not connected');
    }
  }, [socket, isConnected]);

  return {
    // Connection
    isConnected,
    connectionState,
    error,
    connect,
    disconnect,
    
    // Room actions
    createRoom,
    joinRoom,
    
    // Game actions
    startQuiz,
    submitAnswer,
    nextQuiz,
  };
}
