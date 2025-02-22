import { useState, useEffect } from 'react'
import { quizService } from '../services/api'
import Modal from './Modal'
import type { QuizSession } from '../types/api'

const ITEMS_PER_PAGE = 5

const QuizHistory = () => {
  const [sessions, setSessions] = useState<QuizSession[]>([])
  const [selectedSession, setSelectedSession] = useState<QuizSession | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(0)

  useEffect(() => {
    loadQuizHistory()
  }, [])

  const loadQuizHistory = async () => {
    try {
      setLoading(true)
      const response = await quizService.getQuizHistory()
      setSessions(response.data || [])
    } catch (err) {
      setError('Failed to load quiz history')
    } finally {
      setLoading(false)
    }
  }

  // Calculate pagination values
  const totalPages = Math.ceil(sessions.length / ITEMS_PER_PAGE)
  const paginatedSessions = sessions.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  )

  const loadQuizDetails = async (id: number) => {
    try {
      const response = await quizService.getQuizSession(id)
      if (response.data) {
        setSelectedSession(response.data)
      }
    } catch (err) {
      console.error('Failed to load quiz details:', err)
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
    return <div className="p-6 text-gray-400">Loading history...</div>
  }

  if (error) {
    return <div className="p-6 text-red-400">{error}</div>
  }

  if (!sessions.length) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-400">No quiz history available</p>
        <p className="text-sm text-gray-500 mt-2">Complete some quizzes to see them here</p>
      </div>
    )
  }

  return (
    <>
      <div className="divide-y divide-gray-700">
        {paginatedSessions.map(session => (
          <div
            key={session.id}
            className="p-4 hover:bg-[#353535] transition-colors cursor-pointer first:rounded-t-xl last:rounded-b-xl"
            onClick={() => loadQuizDetails(session.id)}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium text-white mb-1">{session.topic}</h3>
                <p className="text-sm text-gray-400">
                  {new Date(session.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-300 mb-1">
                  {session.total_questions} questions
                </p>
                <span className="text-xs px-2 py-1 bg-[#404040] rounded-full text-gray-300">
                  {session.difficulty_level}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center px-4 py-3 bg-[#353535] mt-4 rounded-lg">
          <button
            onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
            disabled={currentPage === 0}
            className="px-3 py-1 text-sm text-gray-300 hover:bg-[#404040] rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <div className="text-sm text-gray-400">
            Page {currentPage + 1} of {totalPages}
          </div>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={currentPage === totalPages - 1}
            className="px-3 py-1 text-sm text-gray-300 hover:bg-[#404040] rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      {/* Quiz Details Modal */}
      {selectedSession && (
        <Modal onClose={() => setSelectedSession(null)}>
          <div className="p-6 max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-4">{selectedSession.topic}</h2>
            <div className="flex gap-4 text-sm text-gray-400 mb-6">
              <span className="px-2 py-1 bg-[#353535] rounded-full">
                {selectedSession.difficulty_level}
              </span>
              <span>{formatDate(selectedSession.created_at)}</span>
              <span>{selectedSession.total_questions} questions</span>
            </div>
            <div className="space-y-4">
              {selectedSession.questions?.map((question, index) => (
                <div key={question.id} className="bg-[#353535] rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <p className="text-gray-200 font-medium flex-1">
                      <span className="text-gray-400 mr-2">Q{index + 1}.</span>
                      {question.question_text}
                    </p>
                    <span className="text-xs px-2 py-1 bg-[#404040] rounded-full text-gray-300 ml-4">
                      {question.question_type}
                    </span>
                  </div>
                  {question.options && (
                    <div className="space-y-2 ml-6 mb-3">
                      {JSON.parse(question.options).map((option: string, i: number) => (
                        <p
                          key={i}
                          className={`text-sm ${
                            option === question.correct_answer
                              ? 'text-green-400'
                              : 'text-gray-400'
                          }`}
                        >
                          {option === question.correct_answer ? '✓' : '•'} {option}
                        </p>
                      ))}
                    </div>
                  )}
                  <p className="text-green-400 text-sm ml-6">
                    Correct Answer: {question.correct_answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}

export default QuizHistory 