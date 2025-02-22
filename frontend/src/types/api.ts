export interface APIResponse<T> {
  data?: T
  error?: string
  status: 'success' | 'error'
}

export interface QuizRequest {
  topic: string
  question_type: string
  num_questions: number
  difficulty: string
}

export interface QuizResponse {
  questions: Array<{
    id: number
    question: string
    options?: string[]
    correctAnswer: string
    type: string
  }>
}

export interface QuizQuestion {
  id: number
  question_text: string
  question_type: string
  correct_answer: string
  options: string
  quiz_session_id: number
}

export interface QuizSession {
  id: number
  topic: string
  difficulty_level: string
  total_questions: number
  created_at: string
  questions?: QuizQuestion[]
} 