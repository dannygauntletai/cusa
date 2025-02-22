import type { APIResponse, QuizRequest, QuizResponse, QuizSession } from '../types/api'
import type { QuestionType, DifficultyLevel } from '../types/quiz'

const API_BASE_URL = 'http://localhost:8000'

class APIError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'APIError'
  }
}

interface GenerateQuizRequest {
  topic: string
  question_type: QuestionType
  num_questions: number
  difficulty: DifficultyLevel
  use_web_search: boolean
}

export const quizService = {
  generateQuiz: async (request: GenerateQuizRequest): Promise<APIResponse<QuizResponse>> => {
    try {
      console.log('API: Sending quiz generation request with web_search:', request.use_web_search)
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
      console.log('API: Received response:', data)
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
  },

  transcribeAudio: async (audioBlob: Blob): Promise<string> => {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');

    const response = await fetch('http://localhost:8000/api/speech/transcribe', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Transcription failed');
    }

    const data = await response.json();
    return data.text;
  }
} 