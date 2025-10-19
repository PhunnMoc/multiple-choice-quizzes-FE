export const QUIZ_CONFIG = {
  DEFAULT_TIME_LIMIT: 30, // seconds
  MAX_PLAYERS: 100,
  POINTS_PER_QUESTION: 1000,
  TIME_BONUS_MULTIPLIER: 0.1,
  MIN_ANSWER_TIME: 1, // seconds
} as const;

export const ANSWER_COLORS = {
  red: '#E53E3E',
  blue: '#3182CE', 
  yellow: '#D69E2E',
  green: '#38A169',
} as const;

export const GAME_STATES = {
  WAITING: 'waiting',
  QUESTION: 'question', 
  RESULTS: 'results',
  LEADERBOARD: 'leaderboard',
  FINISHED: 'finished',
} as const;

export const SAMPLE_QUESTIONS = [
  {
    questionText: 'What is the capital of France?',
    options: ['London', 'Berlin', 'Paris', 'Madrid'],
    correctAnswerIndex: 2, // Paris is at index 2
    timeLimit: 30,
    points: 1000,
  },
  {
    questionText: 'Which planet is known as the Red Planet?',
    options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
    correctAnswerIndex: 1, // Mars is at index 1
    timeLimit: 30,
    points: 1000,
  },
  {
    questionText: 'What is 2 + 2?',
    options: ['3', '4', '5', '6'],
    correctAnswerIndex: 1, // 4 is at index 1
    timeLimit: 15,
    points: 1000,
  },
] as const;
