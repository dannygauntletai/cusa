import { 
  QuestionResponse, 
  DomainResponse, 
  DomainCreate,
  QuestionCreate
} from '@/shared/types/question'
import { apiClient } from './apiClient'

export async function getDomains(params: DomainCreate): Promise<DomainResponse> {
  const response = await apiClient.post<DomainResponse>('/questions/domains', params)
  return response.data
}

export async function generateDiagnosticQuestions(
  params: QuestionCreate
): Promise<QuestionResponse> {
  const response = await apiClient.post<QuestionResponse>('/questions/true-false', params)
  return response.data
}

export async function generateShortFormQuestions(
  params: QuestionCreate
): Promise<QuestionResponse> {
  const response = await apiClient.post<QuestionResponse>('/questions/short-form', params)
  return response.data
}

export async function generateMultipleChoiceQuestions(
  params: QuestionCreate
): Promise<QuestionResponse> {
  const response = await apiClient.post<QuestionResponse>('/questions/multiple-choice', params)
  return response.data
}

export async function generateFillInBlankQuestions(
  params: QuestionCreate
): Promise<QuestionResponse> {
  const response = await apiClient.post<QuestionResponse>('/questions/fill-in-blank', params)
  return response.data
}