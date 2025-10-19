import { Quiz, Player, Question, QuizAnswer, GameState } from './quiz';

// WebSocket message types for client-server communication
export interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: number;
}

// Client to Server messages (matching backend events)
export interface ClientToServerEvents {
  // Room events
  'create-room': (data: CreateRoomData) => void;
  'join-room': (data: JoinRoomData) => void;
  
  // Game events
  'start-quiz': (data: StartQuizData) => void;
  'submit-answer': (data: SubmitAnswerData) => void;
  'next-quiz': (data: NextQuizData) => void;
}

// Server to Client messages (matching backend events)
export interface ServerToClientEvents {
  // Room events
  'room-created': (data: RoomCreatedData) => void;
  'room-joined': (data: RoomJoinedData) => void;
  'participant-joined': (data: ParticipantJoinedData) => void;
  'participant-left': (data: ParticipantLeftData) => void;
  'error': (data: ErrorData) => void;
  
  // Game events
  'quiz-started': (data: QuizStartedData) => void;
  'next-question': (data: NextQuestionData) => void;
  'quiz-completed': (data: QuizCompletedData) => void;
  'answer-submitted': (data: AnswerSubmittedData) => void;
}

// Data interfaces for events (matching backend)
export interface CreateRoomData {
  quizId: string;
}

export interface JoinRoomData {
  roomCode: string;
  name: string;
}

export interface StartQuizData {
  roomCode: string;
}

export interface SubmitAnswerData {
  roomCode: string;
  answer: number; // 0-3 index
}

export interface NextQuizData {
  roomCode: string;
}

// Server response data interfaces (matching backend)
export interface RoomCreatedData {
  roomCode: string;
  message: string;
}

export interface RoomJoinedData {
  roomCode: string;
  message: string;
  quizTitle: string;
  participantCount: number;
}

export interface ParticipantJoinedData {
  name: string;
  participantCount: number;
}

export interface ParticipantLeftData {
  name: string;
  participantCount: number;
}

export interface ErrorData {
  message: string;
}

export interface QuizStartedData {
  question: {
    questionIndex: number;
    questionText: string;
    options: string[];
    timeRemaining: number;
  };
  participantCount: number;
}

export interface NextQuestionData {
  question: {
    questionIndex: number;
    questionText: string;
    options: string[];
    timeRemaining: number;
  };
  participantCount: number;
}

export interface QuizCompletedData {
  results: {
    quizTitle: string;
    totalQuestions: number;
    participants: Array<{
      name: string;
      score: number;
      totalQuestions: number;
      answers: any[];
    }>;
    completedAt: Date;
  };
  message: string;
}

export interface AnswerSubmittedData {
  isCorrect: boolean;
  timeSpent: number;
  currentScore: number;
}

// Additional interfaces
export interface PlayerAnswerResult {
  playerId: string;
  playerName: string;
  answerId: string;
  isCorrect: boolean;
  timeToAnswer: number;
  points: number;
}

export interface QuizStats {
  totalQuestions: number;
  totalPlayers: number;
  averageScore: number;
  completionRate: number;
  averageResponseTime: number;
}

// WebSocket connection states
export type ConnectionState = 'connecting' | 'connected' | 'disconnected' | 'error';

// WebSocket configuration
export interface WebSocketConfig {
  url: string;
  options?: {
    autoConnect?: boolean;
    reconnection?: boolean;
    reconnectionAttempts?: number;
    reconnectionDelay?: number;
    timeout?: number;
  };
}
