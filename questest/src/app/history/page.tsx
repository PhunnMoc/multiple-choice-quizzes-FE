'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiService, QuizHistory } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import * as Typography from '@/components/ui/Typography';

export default function HistoryPage() {
  const router = useRouter();
  const [histories, setHistories] = useState<QuizHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedHistory, setSelectedHistory] = useState<QuizHistory | null>(null);

  useEffect(() => {
    loadQuizHistory();
  }, []);

  const loadQuizHistory = async () => {
    try {
      setLoading(true);
      // For now, use a dummy playerId. In real app, get from auth context
      const playerId = 'current-user'; // This should come from auth context
      const response = await apiService.getQuizHistory(playerId);
      
      if (response.success) {
        setHistories(response.data || []);
      } else {
        setError('Failed to load quiz history');
      }
    } catch (err) {
      setError('Error loading quiz history');
      console.error('Error loading quiz history:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBackground = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return 'bg-green-100';
    if (percentage >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <Typography.H3>Loading quiz history...</Typography.H3>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Typography.H3 className="text-red-600 mb-4">{error}</Typography.H3>
          <Button onClick={loadQuizHistory} variant="primary">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Typography.H2>Quiz History</Typography.H2>
              <Typography.P className="text-gray-600 mt-1">
                View your quiz participation history
              </Typography.P>
            </div>
            <Button
              onClick={() => router.push('/')}
              variant="secondary"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {histories.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📚</div>
            <Typography.H3 className="text-gray-600 mb-2">No Quiz History</Typography.H3>
            <Typography.P className="text-gray-500 mb-6">
              You haven't participated in any quizzes yet.
            </Typography.P>
            <Button
              onClick={() => router.push('/')}
              variant="primary"
            >
              Start Your First Quiz
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {histories.map((history) => (
              <div
                key={history._id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedHistory(history)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <Typography.H3 className="text-lg font-semibold text-gray-900">
                      {history.quizTitle}
                    </Typography.H3>
                    <Typography.P className="text-sm text-gray-600">
                      Room: {history.roomCode} • Host: {history.hostName}
                    </Typography.P>
                  </div>
                  <div className="text-right">
                    <Typography.P className="text-sm text-gray-500">
                      {formatDate(history.completionTime)}
                    </Typography.P>
                    <Typography.P className="text-xs text-gray-400">
                      Duration: {formatDuration(history.duration)}
                    </Typography.P>
                  </div>
                </div>

                {/* Participants Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Typography.P className="text-sm text-gray-600">Participants</Typography.P>
                    <Typography.H3 className="text-xl font-bold text-blue-600">
                      {history.participants.length}
                    </Typography.H3>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Typography.P className="text-sm text-gray-600">Questions</Typography.P>
                    <Typography.H3 className="text-xl font-bold text-green-600">
                      {history.questions.length}
                    </Typography.H3>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Typography.P className="text-sm text-gray-600">Your Score</Typography.P>
                    <Typography.H3 className={`text-xl font-bold ${getScoreColor(
                      history.participants.find(p => p.playerId === 'current-user')?.score || 0,
                      history.questions.length
                    )}`}>
                      {history.participants.find(p => p.playerId === 'current-user')?.score || 0}/{history.questions.length}
                    </Typography.H3>
                  </div>
                </div>

                {/* Participants List */}
                <div className="mt-4">
                  <Typography.P className="text-sm font-medium text-gray-700 mb-2">
                    Participants:
                  </Typography.P>
                  <div className="flex flex-wrap gap-2">
                    {history.participants.map((participant) => (
                      <div
                        key={participant.playerId}
                        className={`px-3 py-1 rounded-full text-sm ${
                          participant.playerId === 'current-user'
                            ? 'bg-blue-100 text-blue-800 font-semibold'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {participant.name} ({participant.score}/{participant.totalQuestions})
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* History Detail Modal */}
      {selectedHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <Typography.H2>Quiz Details</Typography.H2>
              <Button
                onClick={() => setSelectedHistory(null)}
                variant="secondary"
              >
                Close
              </Button>
            </div>

            <div className="space-y-6">
              {/* Quiz Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <Typography.H3 className="mb-2">{selectedHistory.quizTitle}</Typography.H3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <Typography.P className="text-gray-600">Room Code</Typography.P>
                    <Typography.P className="font-semibold">{selectedHistory.roomCode}</Typography.P>
                  </div>
                  <div>
                    <Typography.P className="text-gray-600">Host</Typography.P>
                    <Typography.P className="font-semibold">{selectedHistory.hostName}</Typography.P>
                  </div>
                  <div>
                    <Typography.P className="text-gray-600">Questions</Typography.P>
                    <Typography.P className="font-semibold">{selectedHistory.questions.length}</Typography.P>
                  </div>
                  <div>
                    <Typography.P className="text-gray-600">Duration</Typography.P>
                    <Typography.P className="font-semibold">{formatDuration(selectedHistory.duration)}</Typography.P>
                  </div>
                </div>
              </div>

              {/* Participants Results */}
              <div>
                <Typography.H3 className="mb-4">Results</Typography.H3>
                <div className="space-y-3">
                  {selectedHistory.participants
                    .sort((a, b) => b.score - a.score)
                    .map((participant, index) => (
                      <div
                        key={participant.playerId}
                        className={`flex items-center justify-between p-4 rounded-lg border-2 ${
                          participant.playerId === 'current-user'
                            ? 'border-blue-300 bg-blue-50'
                            : 'border-gray-200 bg-white'
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            index === 0 ? 'bg-yellow-400' : 'bg-gray-200'
                          }`}>
                            <span className={`text-sm font-semibold ${
                              index === 0 ? 'text-white' : 'text-gray-700'
                            }`}>
                              {index + 1}
                            </span>
                          </div>
                          <div>
                            <Typography.P className={`font-medium ${
                              participant.playerId === 'current-user' ? 'text-blue-800' : 'text-gray-800'
                            }`}>
                              {participant.name}
                              {participant.playerId === 'current-user' && (
                                <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                  You
                                </span>
                              )}
                            </Typography.P>
                            <Typography.P className="text-sm text-gray-500">
                              {participant.score}/{participant.totalQuestions} correct
                            </Typography.P>
                          </div>
                        </div>
                        <div className="text-right">
                          <Typography.P className={`text-lg font-bold ${getScoreColor(participant.score, participant.totalQuestions)}`}>
                            {participant.score}
                          </Typography.P>
                          <Typography.P className={`text-xs px-2 py-1 rounded-full ${getScoreBackground(participant.score, participant.totalQuestions)} ${getScoreColor(participant.score, participant.totalQuestions)}`}>
                            {((participant.score / participant.totalQuestions) * 100).toFixed(1)}%
                          </Typography.P>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
