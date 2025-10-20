export interface Question {
  questionText: string;
  options: string[]; // Backend uses simple string array
  correctAnswerIndex: number; // Backend uses 0-3 index
  timeLimit?: number; // in seconds (optional, backend uses 30s default)
  points?: number; // optional
}

export interface AnswerOption {
  id: string;
  text: string;
  color: 'red' | 'blue' | 'yellow' | 'green';
}

export interface Player {
  id: string;
  name: string;
  score: number;
  isConnected: boolean;
  currentAnswer?: string;
  answerTime?: number;
}

export interface Quiz {
  id: string; // API returns 'id' instead of '_id'
  title: string;
  authorName?: string; // Backend uses authorName instead of description
  creator: string; // Backend uses creator (user ID)
  questions: Question[];
  createdAt: Date;
  updatedAt: Date;
}

export interface QuizRoom {
  roomCode: string; // Backend uses room codes
  quiz: Quiz;
  participants: Map<string, Participant>; // Backend uses Map structure
  currentQuestion: number; // Backend uses question index
  isActive: boolean;
  isCompleted: boolean;
  hostId: string;
}

export interface Participant {
  name: string;
  answers: AnswerResponse[];
  score: number;
  joinedAt: Date;
}

export interface AnswerResponse {
  questionIndex: number;
  answer: number; // 0-3 index
  isCorrect: boolean;
  timeSpent: number;
}

export interface QuizAnswer {
  playerId: string;
  questionId: string;
  answerId: string;
  isCorrect: boolean;
  timeToAnswer: number;
  points: number;
}

export type GameState = 'waiting' | 'question' | 'results' | 'leaderboard' | 'finished';

// Authentication types
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Array<{
    field: string;
    message: string;
    value: any;
  }>;
}
