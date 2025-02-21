import type { APIResponse, QuizRequest, QuizResponse } from '../types/api'

const API_BASE_URL = 'http://localhost:8000'

class APIError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'APIError'
  }
}

export const quizService = {
  generateQuiz: async (request: QuizRequest): Promise<APIResponse<QuizResponse>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/quiz/simple`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      })
      
      if (!response.ok) {
        throw new APIError(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      return {
        data,
        status: 'success'
      }
    } catch (error) {
      console.error('API Error:', error)
      return {
        error: error instanceof Error ? error.message : 'Failed to generate quiz',
        status: 'error'
      }
    }
  }
} 