import type { APIResponse, QuizRequest, QuizResponse, QuizSession } from '../types/api'

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
      const response = await fetch(`${API_BASE_URL}/api/quiz`, {
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
  },

  getQuizHistory: async (skip: number = 0, limit: number = 10): Promise<APIResponse<any>> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/quiz/history?skip=${skip}&limit=${limit}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      
      if (!response.ok) {
        throw new Error('Failed to fetch quiz history')
      }
      
      const data = await response.json()
      return {
        data,
        status: 'success'
      }
    } catch (error) {
      console.error('API Error:', error)
      return {
        error: error instanceof Error ? error.message : 'Failed to fetch quiz history',
        status: 'error'
      }
    }
  },

  getQuizSession: async (quizId: number): Promise<APIResponse<QuizSession>> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/quiz/${quizId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      
      if (!response.ok) {
        throw new Error('Failed to fetch quiz details')
      }
      
      const data = await response.json()
      // Ensure questions array exists
      const sessionData = {
        ...data,
        questions: data.questions || []
      }
      
      return {
        data: sessionData,
        status: 'success'
      }
    } catch (error) {
      console.error('API Error:', error)
      return {
        error: error instanceof Error ? error.message : 'Failed to fetch quiz details',
        status: 'error'
      }
    }
  }
} 