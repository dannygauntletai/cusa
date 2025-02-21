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