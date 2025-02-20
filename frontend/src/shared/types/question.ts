export const QuestionTypes = {
  MULTIPLE_CHOICE: 'Multiple Choice',
  TRUE_FALSE: 'True/False',
  SHORT_ANSWER: 'Short Answer',
  FILL_IN_BLANK: 'Fill in the Blank',
} as const

export type QuestionType = typeof QuestionTypes[keyof typeof QuestionTypes]

export interface Question {
  id: string
  text: string
  questionType: QuestionType
  options?: string[]  // For true/false questions
  answer?: string    // For storing user's answer
  explanation?: string
  is_correct?: boolean
  domain?: string  // Added to track which domain the question belongs to
}

export interface QuestionResponse {
  questions: Question[]
  total: number
}

export interface QuestionCreate {
  prompt: string
  num_questions: number
  question_type: QuestionType
  domains?: string[]
}

export interface Domain {
  name: string
  description: string
}

export interface DomainResponse {
  domains: Domain[]
  single_domain: boolean
} 