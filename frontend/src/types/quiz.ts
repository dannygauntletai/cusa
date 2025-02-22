export type QuestionType = 'Multiple Choice' | 'Short Answer' | 'True/False' | 'Fill in the Blank'
export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard'

export interface QuestionTypeConfig {
  type: QuestionType
  count: number
}

export interface QuizConfig {
  topic: string
  questionTypes: QuestionTypeConfig[]
  difficultyLevel: DifficultyLevel
  learningObjective?: string
  useWebSearch: boolean
  totalQuestions: number
  questions?: QuizQuestion[]
}

export interface QuizQuestion {
  id: string
  question: string
  options?: string[]  // For multiple choice
  correctAnswer: string
  type: QuestionType
  userAnswer?: string
}

export interface QuizResult {
  totalQuestions: number
  correctAnswers: number
  incorrectAnswers: number
  score: number
  questions: QuizQuestion[]
} 