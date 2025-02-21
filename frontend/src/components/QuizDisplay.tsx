import { useState } from 'react'
import type { QuizQuestion, QuizResult } from '../types/quiz'

interface QuizDisplayProps {
  questions: QuizQuestion[]
  onComplete: (result: QuizResult) => void
  onBack: () => void
}

const QuizDisplay = ({ questions = [], onComplete, onBack }: QuizDisplayProps) => {
  const [answers, setAnswers] = useState<Record<number, string>>({})
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

  const handleAnswer = (questionId: number, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  const handleSubmit = () => {
    const result: QuizResult = {
      totalQuestions: questions.length,
      correctAnswers: questions.filter(q => 
        answers[q.id]?.toLowerCase() === q.correctAnswer.toLowerCase()
      ).length,
      incorrectAnswers: questions.length - questions.filter(q => 
        answers[q.id]?.toLowerCase() === q.correctAnswer.toLowerCase()
      ).length,
      score: (questions.filter(q => 
        answers[q.id]?.toLowerCase() === q.correctAnswer.toLowerCase()
      ).length / questions.length) * 100,
      questions: questions.map(q => ({
        ...q,
        userAnswer: answers[q.id]
      }))
    }
    
    setShowResults(true)
    onComplete(result)
  }

  const renderQuestion = (question: QuizQuestion) => {
    switch (question.type) {
      case "Multiple Choice":
        return (
          <div className="space-y-2">
            {question.options?.map((option, idx) => (
              <label key={idx} className="flex items-center space-x-2">
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
              <label key={option} className="inline-flex items-center space-x-2">
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
              key={question.id} 
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

        <div className="flex justify-between pt-6">
          <button
            onClick={onBack}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Back
          </button>
          {!showResults && (
            <button
              onClick={handleSubmit}
              disabled={Object.keys(answers).length !== questions.length}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Submit Quiz
            </button>
          )}
        </div>

        {showResults && (
          <div className="mt-8 bg-white p-6 rounded-lg shadow-sm">
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
                    answer.toLowerCase() === questions.find(q => q.id === Number(id))?.correctAnswer.toLowerCase()
                  ).length / questions.length) * 100).toFixed(0)}%
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default QuizDisplay 