import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add any auth tokens here in the future
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const message = error.response?.data?.message || error.message || 'An error occurred';
    return Promise.reject(new Error(message));
  }
);

// Quiz API functions
export const quizAPI = {
  // Get all quizzes with optional pagination and search
  getQuizzes: async (params = {}) => {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc', search } = params;
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sortBy,
      sortOrder,
      ...(search && { search })
    });
    
    return api.get(`/quizzes?${queryParams}`);
  },

  // Get quiz by ID
  getQuizById: async (id) => {
    return api.get(`/quizzes/${id}`);
  },

  // Get quiz with answers
  getQuizWithAnswers: async (id) => {
    return api.get(`/quizzes/${id}/answers`);
  },

  // Create new quiz
  createQuiz: async (quizData) => {
    return api.post('/quizzes', quizData);
  },

  // Health check
  healthCheck: async () => {
    return api.get('/health');
  }
};

// Utility functions
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export default api;
