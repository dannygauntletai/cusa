export enum QuestionType {
  MULTIPLE_CHOICE = "Multiple Choice",
  TRUE_FALSE = "True/False",
  SHORT_ANSWER = "Short Answer",
  FILL_IN_BLANK = "Fill in the Blank"
}

export interface Question {
  question: string
  answer: boolean
  explanation?: string
}

export interface QuestionResponse {
  questions: Question[]
  total: number
}

export interface QuestionCreate {
  prompt: string
  num_questions?: number
  question_type?: QuestionType
} 