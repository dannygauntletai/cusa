import { QuestionCreate, QuestionResponse, QuestionType } from '../shared/types/question'

export async function generateQuestions(prompt: string): Promise<QuestionResponse> {
  const response = await fetch('http://localhost:8000/api/v1/questions/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt,
      num_questions: 5,
      question_type: QuestionType.TRUE_FALSE,
    } as QuestionCreate),
  })

  if (!response.ok) {
    throw new Error('Failed to generate questions')
  }

  return response.json()
} 