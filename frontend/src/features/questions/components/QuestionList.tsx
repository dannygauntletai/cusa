import { useState } from 'react'
import { Question } from '@/shared/types/question'

interface QuestionListProps {
  questions: Question[]
}

export function QuestionList({ questions }: QuestionListProps) {
  const [userAnswers, setUserAnswers] = useState<Record<number, boolean>>({})
  const [showResults, setShowResults] = useState(false)

  if (!questions.length) return null

  const handleAnswer = (index: number, answer: boolean) => {
    setUserAnswers(prev => ({
      ...prev,
      [index]: answer
    }))
  }

  const checkAnswers = () => {
    setShowResults(true)
  }

  const resetQuiz = () => {
    setUserAnswers({})
    setShowResults(false)
  }

  return (
    <div className="space-y-4 mt-6">
      {questions.map((question, index) => (
        <div 
          key={index} 
          className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm"
        >
          <p className="text-lg font-medium text-gray-900">{question.question}</p>
          
          {!showResults ? (
            <div className="mt-3 space-x-4">
              <button
                onClick={() => handleAnswer(index, true)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  userAnswers[index] === true 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                True
              </button>
              <button
                onClick={() => handleAnswer(index, false)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  userAnswers[index] === false 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                False
              </button>
            </div>
          ) : (
            <div className="mt-2">
              <p className={`text-sm ${
                userAnswers[index] === question.answer 
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}>
                Your answer: {userAnswers[index] ? 'True' : 'False'}
                {' '}
                ({userAnswers[index] === question.answer ? 'Correct' : 'Incorrect'})
              </p>
              <p className="text-sm text-gray-600">
                Correct answer: {question.answer ? 'True' : 'False'}
              </p>
              {question.explanation && (
                <p className="mt-2 text-sm text-gray-500">
                  {question.explanation}
                </p>
              )}
            </div>
          )}
        </div>
      ))}

      {questions.length > 0 && (
        <div className="mt-6 flex justify-center">
          {!showResults ? (
            <button
              onClick={checkAnswers}
              disabled={Object.keys(userAnswers).length !== questions.length}
              className="px-6 py-3 bg-blue-500 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Check Answers
            </button>
          ) : (
            <button
              onClick={resetQuiz}
              className="px-6 py-3 bg-blue-500 text-white rounded-xl font-medium"
            >
              Try Again
            </button>
          )}
        </div>
      )}
    </div>
  )
} 