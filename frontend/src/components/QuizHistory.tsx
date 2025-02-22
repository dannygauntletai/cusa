import { useState, useEffect } from 'react'
import { quizService } from '../services/api'
import Modal from './Modal'
import type { QuizSession, QuizQuestion } from '../types/api'

const QuizHistory = () => {
  const [sessions, setSessions] = useState<QuizSession[]>([])
  const [selectedSession, setSelectedSession] = useState<QuizSession | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(0)
  const PAGE_SIZE = 10

  useEffect(() => {
    loadQuizHistory()
  }, [page])

  const loadQuizHistory = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await quizService.getQuizHistory(page * PAGE_SIZE, PAGE_SIZE)
      if (response.status === 'error' || !response.data) {
        throw new Error(response.error || 'Failed to load quiz history')
      }
      // Ensure the response data is an array
      const quizData = Array.isArray(response.data) ? response.data : []
      setSessions(quizData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load quiz history')
    } finally {
      setLoading(false)
    }
  }

  const loadQuizDetails = async (id: number) => {
    try {
      setError(null)
      const response = await quizService.getQuizSession(id)
      console.log('Quiz session response:', response)
      
      if (response.status === 'error' || !response.data) {
        throw new Error(response.error || 'Failed to load quiz details')
      }

      // Initialize questions as empty array if not present
      const sessionData = {
        ...response.data,
        questions: response.data.questions || []
      }

      setSelectedSession(sessionData)
    } catch (err) {
      console.error('Error loading quiz details:', err)
      setError(err instanceof Error ? err.message : 'Failed to load quiz details')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="bg-[#2d2d2d] rounded-xl p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-400">Loading quiz history...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-[#2d2d2d] rounded-xl p-6">
        <div className="text-red-400 mb-4">Error: {error}</div>
        <button 
          onClick={loadQuizHistory}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    )
  }

  if (!sessions || sessions.length === 0) {
    return (
      <div className="bg-[#2d2d2d] rounded-xl p-6">
        <div className="flex flex-col items-center justify-center h-64">
          <div className="text-gray-400 mb-4">No quiz history found</div>
          <div className="text-sm text-gray-500">
            Complete some quizzes to see them here
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#2d2d2d] rounded-xl p-6">
      <h2 className="text-xl font-semibold text-white mb-6">Quiz History</h2>
      
      <div className="space-y-4">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="bg-[#353535] rounded-lg p-4 hover:bg-[#404040] transition-colors cursor-pointer"
            onClick={() => loadQuizDetails(session.id)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-white font-medium">{session.topic}</h3>
                <p className="text-sm text-gray-400">
                  {new Date(session.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <span className="text-sm text-gray-400">
                  {session.total_questions} questions
                </span>
                <p className="text-sm text-gray-400">
                  {session.difficulty_level}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {sessions.length >= PAGE_SIZE && (
        <div className="flex justify-center mt-6 space-x-4">
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-4 py-2 bg-[#353535] text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#404040]"
          >
            Previous
          </button>
          <button
            onClick={() => setPage(p => p + 1)}
            className="px-4 py-2 bg-[#353535] text-white rounded-lg hover:bg-[#404040]"
          >
            Next
          </button>
        </div>
      )}

      {selectedSession && (
        <Modal onClose={() => setSelectedSession(null)}>
          <div className="p-6 max-h-[80vh] overflow-y-auto w-full max-w-6xl">
            <h2 className="text-2xl font-bold text-white mb-4">{selectedSession.topic}</h2>
            <div className="text-sm text-gray-400 mb-6">
              <p>Difficulty: {selectedSession.difficulty_level}</p>
              <p>Date: {formatDate(selectedSession.created_at)}</p>
              <p>Total Questions: {selectedSession.total_questions}</p>
            </div>
            <div className="space-y-6">
              {Array.isArray(selectedSession.questions) && selectedSession.questions.length > 0 ? (
                selectedSession.questions.map((question, index) => (
                  <div key={question.id} className="bg-[#2d2d2d] rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-gray-300 font-medium">
                        Question {index + 1}: {question.question_text}
                      </p>
                      <span className="text-xs text-gray-500">{question.question_type}</span>
                    </div>
                    {question.options && (
                      <div className="ml-4 space-y-1">
                        {(() => {
                          try {
                            const options = JSON.parse(question.options)
                            if (!Array.isArray(options)) {
                              console.error('Options is not an array:', options)
                              return null
                            }
                            return options.map((option: string, i: number) => (
                              <p
                                key={i}
                                className={`text-sm ${
                                  option === question.correct_answer
                                    ? 'text-green-400'
                                    : 'text-gray-400'
                                }`}
                              >
                                • {option}
                              </p>
                            ))
                          } catch (e) {
                            console.error('Failed to parse options:', e, question.options)
                            return null
                          }
                        })()}
                      </div>
                    )}
                    <p className="text-green-400 text-sm mt-2">
                      Correct Answer: {question.correct_answer}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-gray-400 text-center py-4">
                  No questions available for this quiz
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default QuizHistory 