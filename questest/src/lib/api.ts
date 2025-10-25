import { Quiz, ApiResponse } from '@/types/quiz';

export interface QuizHistory {
  _id: string;
  roomCode: string;
  quizId: string;
  quizTitle: string;
  hostId: string;
  hostName: string;
  participants: Array<{
    playerId: string;
    name: string;
    score: number;
    totalQuestions: number;
    answers: Array<{
      questionIndex: number;
      answerIndex: number;
      isCorrect: boolean;
      timeSpent: number;
      submittedAt: string;
    }>;
  }>;
  questions: Array<{
    questionIndex: number;
    questionText: string;
    options: string[];
    correctAnswerIndex: number;
  }>;
  completionTime: string;
  duration: number;
  createdAt: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  /**
   * Get all quizzes with optional pagination and search
   */
  async getQuizzes(params?: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    search?: string;
  }): Promise<ApiResponse<{ quizzes: Quiz[]; total: number; page: number; limit: number }>> {
    const searchParams = new URLSearchParams();
    
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.sortBy) searchParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) searchParams.append('sortOrder', params.sortOrder);
    if (params?.search) searchParams.append('search', params.search);

    const url = `${API_BASE_URL}/api/quizzes${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    
    const response = await fetch(url, {
      headers: this.getAuthHeaders(),
    });

    return response.json();
  }

  /**
   * Get a specific quiz by ID (without answers)
   */
  async getQuiz(id: string): Promise<ApiResponse<Quiz>> {
    const response = await fetch(`${API_BASE_URL}/api/quizzes/${id}`, {
      headers: this.getAuthHeaders(),
    });

    return response.json();
  }

  /**
   * Get a specific quiz by ID with correct answers
   */
  async getQuizWithAnswers(id: string): Promise<ApiResponse<Quiz>> {
    const response = await fetch(`${API_BASE_URL}/api/quizzes/${id}/answers`, {
      headers: this.getAuthHeaders(),
    });

    return response.json();
  }

  /**
   * Create a new quiz (requires authentication)
   */
  async createQuiz(quizData: {
    title: string;
    authorName?: string;
    questions: Array<{
      questionText: string;
      options: string[];
      correctAnswerIndex: number;
    }>;
  }): Promise<ApiResponse<Quiz>> {
    const response = await fetch(`${API_BASE_URL}/api/quizzes`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(quizData),
    });

    return response.json();
  }

  /**
   * Update an existing quiz (requires authentication)
   */
  async updateQuiz(quizId: string, quizData: {
    title: string;
    authorName?: string;
    questions: Array<{
      questionText: string;
      options: string[];
      correctAnswerIndex: number;
    }>;
  }): Promise<ApiResponse<Quiz>> {
    const response = await fetch(`${API_BASE_URL}/api/quizzes/${quizId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(quizData),
    });

    return response.json();
  }

  /**
   * Get quiz history for a user
   */
  async getQuizHistory(playerId: string): Promise<ApiResponse<QuizHistory[]>> {
    const response = await fetch(`${API_BASE_URL}/api/quiz-history/${playerId}`, {
      headers: this.getAuthHeaders(),
    });

    return response.json();
  }

  /**
   * Get specific quiz history by room code
   */
  async getQuizHistoryByRoomCode(roomCode: string): Promise<ApiResponse<QuizHistory>> {
    const response = await fetch(`${API_BASE_URL}/api/quiz-history/room/${roomCode}`, {
      headers: this.getAuthHeaders(),
    });

    return response.json();
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    return response.json();
  }
}

export const apiService = new ApiService();
