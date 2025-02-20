import { 
  QuestionResponse, 
  DomainResponse, 
  DomainCreate,
  QuestionCreate,
  QuestionTypes
} from '@/shared/types/question'

const API_BASE = 'http://localhost:8000/api/v1'

export async function getDomains(params: DomainCreate): Promise<DomainResponse> {
  const response = await fetch(`${API_BASE}/questions/domains`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params)
  })

  if (!response.ok) {
    throw new Error('Failed to analyze topic')
  }

  return response.json()
}

export async function generateDiagnosticQuestions(
  params: QuestionCreate
): Promise<QuestionResponse> {
  const response = await fetch(`${API_BASE}/questions/true-false`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...params,
      question_type: QuestionTypes.TRUE_FALSE // Ensure it's always true/false
    })
  })

  if (!response.ok) {
    throw new Error('Failed to generate questions')
  }

  const data = await response.json()
  return validateQuestionResponse(data)
}

export async function generateShortFormQuestions(
  params: QuestionCreate
): Promise<QuestionResponse> {
  const response = await fetch(`${API_BASE}/questions/short-form`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...params,
      question_type: QuestionTypes.SHORT_ANSWER // Ensure it's always short answer
    })
  })

  if (!response.ok) {
    throw new Error('Failed to generate questions')
  }

  const data = await response.json()
  return validateQuestionResponse(data)
}

function validateQuestionResponse(data: QuestionResponse): QuestionResponse {
  if (!data.questions || !Array.isArray(data.questions)) {
    throw new Error('Invalid response format: missing questions array')
  }

  return {
    questions: data.questions,
    total: data.total || data.questions.length
  }
} 