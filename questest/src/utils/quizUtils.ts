import { Question, Player, QuizAnswer } from '@/types/quiz';
import { QUIZ_CONFIG } from '@/constants/quiz';

/**
 * Calculate points for a quiz answer based on correctness and speed
 */
export function calculatePoints(
  isCorrect: boolean,
  timeToAnswer: number,
  timeLimit: number,
  basePoints: number = QUIZ_CONFIG.POINTS_PER_QUESTION
): number {
  if (!isCorrect) return 0;

  const timeBonus = Math.max(0, (timeLimit - timeToAnswer) * 10);
  return basePoints + timeBonus;
}

/**
 * Generate a random quiz ID
 */
export function generateQuizId(): string {
  return Math.random().toString(36).substr(2, 9);
}

/**
 * Generate a random player ID
 */
export function generatePlayerId(): string {
  return Math.random().toString(36).substr(2, 9);
}

/**
 * Sort players by score (descending)
 */
export function sortPlayersByScore(players: Player[]): Player[] {
  return [...players].sort((a, b) => b.score - a.score);
}

/**
 * Get player rank from leaderboard
 */
export function getPlayerRank(playerId: string, players: Player[]): number {
  const sortedPlayers = sortPlayersByScore(players);
  return sortedPlayers.findIndex(player => player.id === playerId) + 1;
}

/**
 * Calculate quiz statistics
 */
export function calculateQuizStats(answers: QuizAnswer[], questions: Question[]) {
  const totalQuestions = questions.length;
  const correctAnswers = answers.filter(answer => answer.isCorrect).length;
  const totalScore = answers.reduce((sum, answer) => sum + answer.points, 0);
  const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
  
  const averageResponseTime = answers.length > 0 
    ? answers.reduce((sum, answer) => sum + answer.timeToAnswer, 0) / answers.length 
    : 0;

  return {
    totalQuestions,
    correctAnswers,
    totalScore,
    accuracy,
    averageResponseTime,
  };
}

/**
 * Format time in seconds to MM:SS format
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Validate quiz data
 */
export function validateQuiz(quiz: Partial<Question>): boolean {
  return !!(
    quiz.text &&
    quiz.options &&
    quiz.options.length >= 2 &&
    quiz.correctAnswer &&
    quiz.timeLimit &&
    quiz.timeLimit > 0
  );
}
