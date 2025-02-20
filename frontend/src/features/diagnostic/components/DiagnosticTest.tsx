import { useState } from 'react'
import { Question } from '@/shared/types/question'
import { TrueFalseQuestion } from './TrueFalseQuestion'
import { ShortFormQuestion } from './ShortFormQuestion'
import { QuestionTypes } from '@/shared/types/question'
import { MultipleChoiceQuestion } from './MultipleChoiceQuestion'
import { FillInBlankQuestion } from './FillInBlankQuestion'

interface TestResult {
  questionId: number
  question: string
  userAnswer: string
  correctAnswer: string
  isCorrect: boolean
  timeTaken: number
  domain?: string
}

interface DiagnosticTestProps {
  questions: Question[]
  onComplete: (score: number) => void
}

export function DiagnosticTest({ questions, onComplete }: DiagnosticTestProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<TestResult[]>([])
  
  const currentQuestion = questions[currentIndex]

  const handleAnswerSubmit = (answer: string) => {
    const result: TestResult = {
      questionId: currentIndex,
      question: currentQuestion.text,
      userAnswer: answer,
      correctAnswer: currentQuestion.answer || '',
      isCorrect: answer.toLowerCase() === (currentQuestion.answer || '').toLowerCase(),
      timeTaken: 0,
      domain: currentQuestion.domain
    }

    const newAnswers = [...answers, result]
    setAnswers(newAnswers)

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1)
    } else {
      // Test complete - save results and calculate score
      saveResults(newAnswers)
      const score = calculateScore(newAnswers)
      onComplete(score)
    }
  }

  function calculateScore(results: TestResult[]): number {
    return results.reduce((acc, result) => acc + (result.isCorrect ? 1 : 0), 0)
  }

  function saveResults(results: TestResult[]) {
    try {
      const existingResults = JSON.parse(localStorage.getItem('diagnosticResults') || '[]')
      const updatedResults = [...existingResults, {
        timestamp: new Date().toISOString(),
        results
      }]
      localStorage.setItem('diagnosticResults', JSON.stringify(updatedResults))
    } catch (err) {
      console.error('Error saving results to cache:', err)
    }
  }

  const renderQuestion = () => {
    if (!currentQuestion) return null

    switch (currentQuestion.questionType) {
      case QuestionTypes.TRUE_FALSE:
        return (
          <TrueFalseQuestion 
            question={currentQuestion}
            onAnswerChange={handleAnswerSubmit}
          />
        )
      
      case QuestionTypes.MULTIPLE_CHOICE:
        return (
          <MultipleChoiceQuestion 
            question={currentQuestion}
            onAnswerChange={handleAnswerSubmit}
          />
        )
      
      case QuestionTypes.FILL_IN_BLANK:
        return (
          <FillInBlankQuestion 
            question={currentQuestion}
            onAnswerChange={handleAnswerSubmit}
          />
        )
      
      case QuestionTypes.SHORT_ANSWER:
        return (
          <ShortFormQuestion 
            question={currentQuestion}
            onAnswerChange={handleAnswerSubmit}
          />
        )
      
      default:
        return null
    }
  }

  if (!questions.length) {
    return (
      <div className="text-center">
        <p>No questions available</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-lg font-medium">
        Question {currentIndex + 1} of {questions.length}
      </div>

      {renderQuestion()}
    </div>
  )
} 