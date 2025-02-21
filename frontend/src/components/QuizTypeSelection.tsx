import { useState } from 'react'
import type { QuizConfig, QuestionType, DifficultyLevel, QuestionTypeConfig } from '../types/quiz'
import { quizService } from '../services/api'

interface QuizTypeSelectionProps {
  topic: string
  onSubmit: (config: QuizConfig) => void
  onBack: () => void
}

const QuizTypeSelection = ({ topic, onSubmit, onBack }: QuizTypeSelectionProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const MAX_RETRIES = 3
  const [questionTypes, setQuestionTypes] = useState<QuestionTypeConfig[]>([
    { type: 'Multiple Choice', count: 3 }
  ])
  const [difficultyLevel, setDifficultyLevel] = useState<DifficultyLevel>('Medium')
  const [learningObjective, setLearningObjective] = useState('')

  const availableTypes: QuestionType[] = [
    'Multiple Choice',
    'Short Answer',
    'True/False',
    'Fill in the Blank'
  ]

  const difficultyLevels: DifficultyLevel[] = ['Easy', 'Medium', 'Hard']

  const addQuestionType = () => {
    const unusedTypes = availableTypes.filter(
      type => !questionTypes.find(qt => qt.type === type)
    )
    if (unusedTypes.length > 0) {
      setQuestionTypes([
        ...questionTypes,
        { type: unusedTypes[0], count: 1 }
      ])
    }
  }

  const removeQuestionType = (index: number) => {
    setQuestionTypes(questionTypes.filter((_, i) => i !== index))
  }

  const updateQuestionType = (index: number, updates: Partial<QuestionTypeConfig>) => {
    setQuestionTypes(questionTypes.map((qt, i) => 
      i === index ? { ...qt, ...updates } : qt
    ))
  }

  const validateConfig = (): string | null => {
    if (questionTypes.length === 0) {
      return 'At least one question type is required'
    }

    const totalQuestions = questionTypes.reduce((sum, qt) => sum + qt.count, 0)
    if (totalQuestions === 0) {
      return 'Total number of questions must be greater than 0'
    }

    if (totalQuestions > 20) {
      return 'Maximum total questions allowed is 20'
    }

    const invalidCounts = questionTypes.some(qt => qt.count < 1 || qt.count > 10)
    if (invalidCounts) {
      return 'Each question type must have between 1 and 10 questions'
    }

    return null
  }

  const handleSubmit = async () => {
    const validationError = validateConfig()
    if (validationError) {
      setError(validationError)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await quizService.generateQuiz({
        topic,
        question_type: questionTypes[0].type,
        num_questions: questionTypes[0].count,
        difficulty: difficultyLevel
      })
      
      if (response.status === 'error') {
        throw new Error(response.error || 'Failed to generate quiz')
      }
      
      const quizConfig: QuizConfig = {
        topic,
        questionTypes,
        difficultyLevel,
        totalQuestions: questionTypes.reduce((sum, qt) => sum + qt.count, 0),
        questions: response.data.questions
      }
      
      onSubmit(quizConfig)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate quiz'
      setError(errorMessage)
      
      if (retryCount < MAX_RETRIES) {
        setRetryCount(prev => prev + 1)
        setTimeout(() => handleSubmit(), 1000 * (retryCount + 1))
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">Quiz Configuration</h1>
          <p className="mt-2 text-gray-600">Topic: {topic}</p>
        </div>

        <div className="mt-8 space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Question Types</h2>
              <button
                onClick={addQuestionType}
                disabled={questionTypes.length === availableTypes.length}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Add Type
              </button>
            </div>
            
            {questionTypes.map((qt, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-sm space-y-3">
                <div className="flex justify-between items-center">
                  <select
                    value={qt.type}
                    onChange={(e) => updateQuestionType(index, { type: e.target.value as QuestionType })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {availableTypes
                      .filter(type => type === qt.type || !questionTypes.find(existing => existing.type === type))
                      .map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))
                    }
                  </select>
                  <button
                    onClick={() => removeQuestionType(index)}
                    className="ml-2 p-2 text-red-500 hover:text-red-600"
                  >
                    ✕
                  </button>
                </div>
                <div className="flex items-center space-x-2">
                  <label className="text-sm text-gray-600">Number of questions:</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={qt.count}
                    onChange={(e) => updateQuestionType(index, { count: parseInt(e.target.value) })}
                    className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Difficulty Level
            </label>
            <select
              value={difficultyLevel}
              onChange={(e) => setDifficultyLevel(e.target.value as DifficultyLevel)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {difficultyLevels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Learning Objective (Optional)
            </label>
            <input
              type="text"
              value={learningObjective}
              onChange={(e) => setLearningObjective(e.target.value)}
              placeholder="e.g., Understanding basic concepts"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
              {retryCount > 0 && (
                <span className="block sm:inline ml-2">
                  Retry attempt {retryCount} of {MAX_RETRIES}...
                </span>
              )}
            </div>
          )}

          <div className="flex space-x-4">
            <button
              onClick={onBack}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              disabled={isLoading}
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading || questionTypes.length === 0}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Generating Quiz...' : 'Generate Quiz'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuizTypeSelection 