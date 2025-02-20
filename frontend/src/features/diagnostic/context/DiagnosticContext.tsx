import { createContext, useContext, useState, ReactNode } from 'react'
import { Question } from '@/shared/types/question'

interface DiagnosticContextType {
  questions: Question[]
  setQuestions: (questions: Question[]) => void
  currentQuestion: number
  setCurrentQuestion: (index: number) => void
  answers: Record<number, boolean>
  setAnswers: (answers: Record<number, boolean>) => void
}

const DiagnosticContext = createContext<DiagnosticContextType | null>(null)

export function DiagnosticProvider({ children }: { children: ReactNode }) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, boolean>>({})

  return (
    <DiagnosticContext.Provider 
      value={{
        questions,
        setQuestions,
        currentQuestion,
        setCurrentQuestion,
        answers,
        setAnswers
      }}
    >
      {children}
    </DiagnosticContext.Provider>
  )
}

export function useDiagnostic() {
  const context = useContext(DiagnosticContext)
  if (!context) throw new Error('useDiagnostic must be used within DiagnosticProvider')
  return context
} 