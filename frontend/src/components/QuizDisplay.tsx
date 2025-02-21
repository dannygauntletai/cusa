import { useState } from 'react'
import type { QuizQuestion, QuizResult } from '../types/quiz'

interface QuizDisplayProps {
  questions: QuizQuestion[]
  onComplete: (result: QuizResult) => void
  onBack: () => void
}

const QuizDisplay = ({ questions = [], onComplete, onBack }: QuizDisplayProps) => {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [showResults, setShowResults] = useState(false)

  // Add loading state if no questions
  if (!questions.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">Loading questions...</p>
        </div>
      </div>
    )
  }

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  const handleSubmit = () => {
    setShowResults(true)
    
    // Calculate results
    const correctAnswers = questions.reduce((count, q) => {
      const userAnswer = answers[q.id]?.toLowerCase().trim() || ''
      const correctAnswer = q.correctAnswer.toLowerCase().trim()

      if (q.type === 'Short Answer') {
        // For short answers, check if key terms are present
        const keyTerms = correctAnswer.split(/[.,\s]+/).filter(term => term.length > 3)
        const matchedTerms = keyTerms.filter(term => 
          userAnswer.includes(term.toLowerCase())
        )
        return count + (matchedTerms.length / keyTerms.length >= 0.7 ? 1 : 0)
      } else {
        // For other types, exact match but case-insensitive
        return count + (userAnswer === correctAnswer ? 1 : 0)
      }
    }, 0)

    const result: QuizResult = {
      totalQuestions: questions.length,
      correctAnswers,
      incorrectAnswers: questions.length - correctAnswers,
      score: (correctAnswers / questions.length) * 100,
      questions: questions.map(q => ({
        ...q,
        userAnswer: answers[q.id]
      }))
    }

    onComplete(result)
  }

  // Add a handler for the back button that considers results state
  const handleBack = () => {
    if (showResults) {
      // Go back to homepage when results are shown
      window.location.reload() // Simple way to reset the entire app state
    } else {
      // Normal back behavior during quiz
      onBack()
    }
  }

  const renderQuestion = (question: QuizQuestion) => {
    switch (question.type) {
      case "Multiple Choice":
        return (
          <div className="space-y-2">
            {question.options?.map((option, idx) => (
              <label key={`${question.id}-option-${idx}`} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={option}
                  checked={answers[question.id] === option}
                  onChange={(e) => handleAnswer(question.id, e.target.value)}
                  disabled={showResults}
                  className="text-blue-500 focus:ring-blue-500"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        )

      case "True/False":
        return (
          <div className="space-x-4">
            {["True", "False"].map((option) => (
              <label key={`${question.id}-${option}`} className="inline-flex items-center space-x-2">
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={option}
                  checked={answers[question.id] === option}
                  onChange={(e) => handleAnswer(question.id, e.target.value)}
                  disabled={showResults}
                  className="text-blue-500 focus:ring-blue-500"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        )

      case "Fill in the Blank":
        return (
          <input
            type="text"
            value={answers[question.id] || ''}
            onChange={(e) => handleAnswer(question.id, e.target.value)}
            disabled={showResults}
            placeholder="Type your answer..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        )

      case "Short Answer":
        return (
          <div className="space-y-2">
            <textarea
              value={answers[question.id] || ''}
              onChange={(e) => handleAnswer(question.id, e.target.value)}
              disabled={showResults}
              placeholder="Type your answer..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {showResults && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700">Model Answer:</p>
                <p className="text-sm text-gray-600">{question.correctAnswer}</p>
                <p className="text-sm font-medium text-gray-700 mt-2">Your Answer:</p>
                <p className="text-sm text-gray-600">{answers[question.id]}</p>
                <p className="text-sm text-gray-500 mt-2 italic">
                  Note: Short answers are evaluated based on key concepts. Your answer may be correct even if it doesn't match exactly.
                </p>
              </div>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">Quiz</h1>
          <p className="mt-2 text-gray-600">Answer all questions below</p>
        </div>

        <div className="space-y-8">
          {questions.map((question, idx) => (
            <div 
              key={`question-${question.id}`}
              className={`bg-white p-6 rounded-lg shadow-sm space-y-4 ${
                showResults ? 
                  answers[question.id]?.toLowerCase() === question.correctAnswer.toLowerCase()
                    ? 'ring-2 ring-green-500'
                    : 'ring-2 ring-red-500'
                  : ''
              }`}
            >
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium text-gray-900">
                  Question {idx + 1}
                </h3>
                {showResults && (
                  <span className={`px-2 py-1 rounded text-sm ${
                    answers[question.id]?.toLowerCase() === question.correctAnswer.toLowerCase()
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {answers[question.id]?.toLowerCase() === question.correctAnswer.toLowerCase()
                      ? 'Correct'
                      : 'Incorrect'}
                  </span>
                )}
              </div>
              <p className="text-gray-700">{question.question}</p>
              {renderQuestion(question)}
              {showResults && answers[question.id]?.toLowerCase() !== question.correctAnswer.toLowerCase() && (
                <p className="text-sm text-red-600 mt-2">
                  Correct answer: {question.correctAnswer}
                </p>
              )}
            </div>
          ))}
        </div>

        {showResults && (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900">Quiz Summary</h2>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Total Questions</p>
                <p className="text-2xl font-bold text-gray-900">{questions.length}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Score</p>
                <p className="text-2xl font-bold text-gray-900">
                  {((Object.entries(answers).filter(([id, answer]) => 
                    answer.toLowerCase() === questions.find(q => q.id === id)?.correctAnswer.toLowerCase()
                  ).length / questions.length) * 100).toFixed(0)}%
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-6">
          {!showResults ? (
            <>
              <button
                onClick={handleBack}
                className="mr-4 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={Object.keys(answers).length !== questions.length}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Submit Quiz
              </button>
            </>
          ) : (
            <button
              onClick={handleBack}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Start New Quiz
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default QuizDisplay 