import { 
  Quiz, 
  Player, 
  Question, 
  QuizAnswer, 
  GameState 
} from '@/types/quiz';
import { 
  QuizJoinedData,
  QuizCreatedData,
  PlayerJoinedData,
  PlayerLeftData,
  QuizStartedData,
  QuestionStartedData,
  QuestionEndedData,
  QuizEndedData,
  LeaderboardUpdatedData,
  PlayerAnswerReceivedData,
  PlayerScoreUpdatedData,
  QuizErrorData
} from '@/types/websocket';

/**
 * Transform server quiz data to client format
 */
export function transformServerQuiz(serverQuiz: any): Quiz {
  return {
    id: serverQuiz.id,
    title: serverQuiz.title,
    description: serverQuiz.description,
    questions: serverQuiz.questions || [],
    hostId: serverQuiz.hostId,
    isActive: serverQuiz.isActive,
    currentQuestionIndex: serverQuiz.currentQuestionIndex || 0,
    timeRemaining: serverQuiz.timeRemaining || 0,
    players: serverQuiz.players || [],
    createdAt: new Date(serverQuiz.createdAt),
  };
}

/**
 * Transform server player data to client format
 */
export function transformServerPlayer(serverPlayer: any): Player {
  return {
    id: serverPlayer.id,
    name: serverPlayer.name,
    score: serverPlayer.score || 0,
    isConnected: serverPlayer.isConnected !== false,
    currentAnswer: serverPlayer.currentAnswer,
    answerTime: serverPlayer.answerTime,
  };
}

/**
 * Transform server question data to client format
 */
export function transformServerQuestion(serverQuestion: any): Question {
  return {
    id: serverQuestion.id,
    text: serverQuestion.text,
    options: serverQuestion.options || [],
    correctAnswer: serverQuestion.correctAnswer,
    timeLimit: serverQuestion.timeLimit,
    points: serverQuestion.points || 1000,
  };
}

/**
 * Handle quiz joined event
 */
export function handleQuizJoined(data: QuizJoinedData) {
  return {
    quiz: transformServerQuiz(data.quiz),
    currentPlayer: transformServerPlayer(data.player),
    isHost: data.isHost,
    players: data.players.map(transformServerPlayer),
  };
}

/**
 * Handle quiz created event
 */
export function handleQuizCreated(data: QuizCreatedData) {
  return {
    quiz: transformServerQuiz(data.quiz),
    currentPlayer: transformServerPlayer(data.host),
    isHost: true,
    players: data.players.map(transformServerPlayer),
  };
}

/**
 * Handle player joined event
 */
export function handlePlayerJoined(data: PlayerJoinedData) {
  return {
    newPlayer: transformServerPlayer(data.player),
    players: data.players.map(transformServerPlayer),
  };
}

/**
 * Handle player left event
 */
export function handlePlayerLeft(data: PlayerLeftData) {
  return {
    leftPlayerId: data.playerId,
    players: data.players.map(transformServerPlayer),
  };
}

/**
 * Handle quiz started event
 */
export function handleQuizStarted(data: QuizStartedData) {
  return {
    currentQuestion: transformServerQuestion(data.currentQuestion),
    timeRemaining: data.timeRemaining,
  };
}

/**
 * Handle question started event
 */
export function handleQuestionStarted(data: QuestionStartedData) {
  return {
    question: transformServerQuestion(data.question),
    questionNumber: data.questionNumber,
    totalQuestions: data.totalQuestions,
    timeRemaining: data.timeRemaining,
  };
}

/**
 * Handle question ended event
 */
export function handleQuestionEnded(data: QuestionEndedData) {
  return {
    questionId: data.questionId,
    correctAnswer: data.correctAnswer,
    playerAnswers: data.playerAnswers,
    nextQuestion: data.nextQuestion ? transformServerQuestion(data.nextQuestion) : null,
  };
}

/**
 * Handle quiz ended event
 */
export function handleQuizEnded(data: QuizEndedData) {
  return {
    finalLeaderboard: data.finalLeaderboard.map(transformServerPlayer),
    quizStats: data.quizStats,
  };
}

/**
 * Handle leaderboard updated event
 */
export function handleLeaderboardUpdated(data: LeaderboardUpdatedData) {
  return {
    leaderboard: data.leaderboard.map(transformServerPlayer),
  };
}

/**
 * Handle player answer received event
 */
export function handlePlayerAnswerReceived(data: PlayerAnswerReceivedData) {
  return {
    playerId: data.playerId,
    questionId: data.questionId,
    isCorrect: data.isCorrect,
    points: data.points,
  };
}

/**
 * Handle player score updated event
 */
export function handlePlayerScoreUpdated(data: PlayerScoreUpdatedData) {
  return {
    playerId: data.playerId,
    newScore: data.newScore,
    totalAnswers: data.totalAnswers,
    correctAnswers: data.correctAnswers,
  };
}

/**
 * Handle quiz error event
 */
export function handleQuizError(data: QuizErrorData) {
  return {
    message: data.message,
    code: data.code,
    details: data.details,
  };
}

/**
 * Generate a unique player ID
 */
export function generatePlayerId(): string {
  return Math.random().toString(36).substr(2, 9);
}

/**
 * Generate a unique quiz ID
 */
export function generateQuizId(): string {
  return Math.random().toString(36).substr(2, 9);
}

/**
 * Validate WebSocket message
 */
export function validateWebSocketMessage(message: any): boolean {
  return (
    message &&
    typeof message === 'object' &&
    typeof message.type === 'string' &&
    message.data !== undefined
  );
}

/**
 * Create a WebSocket message
 */
export function createWebSocketMessage(type: string, data: any) {
  return {
    type,
    data,
    timestamp: Date.now(),
  };
}

/**
 * Parse WebSocket message
 */
export function parseWebSocketMessage(message: any) {
  if (!validateWebSocketMessage(message)) {
    throw new Error('Invalid WebSocket message format');
  }
  
  return {
    type: message.type,
    data: message.data,
    timestamp: message.timestamp,
  };
}

/**
 * Check if WebSocket connection is healthy
 */
export function isWebSocketHealthy(socket: any): boolean {
  return socket && socket.connected && socket.readyState === 1;
}

/**
 * Retry WebSocket connection with exponential backoff
 */
export function retryWebSocketConnection(
  connectFn: () => void,
  maxRetries: number = 5,
  baseDelay: number = 1000
) {
  let retryCount = 0;
  
  const retry = () => {
    if (retryCount < maxRetries) {
      const delay = baseDelay * Math.pow(2, retryCount);
      setTimeout(() => {
        retryCount++;
        connectFn();
      }, delay);
    }
  };
  
  return retry;
}
