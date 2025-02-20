import { useState } from 'react'
import { Question } from '@/shared/types/question'

interface FillInBlankQuestionProps {
  question: Question
  onAnswerChange: (answer: string) => void
}

export function FillInBlankQuestion({ 
  question, 
  onAnswerChange 
}: FillInBlankQuestionProps) {
  const parts = question.text.split('___')
  const numBlanks = parts.length - 1
  
  const [answers, setAnswers] = useState<string[]>(() => new Array(numBlanks).fill(''))
  
  const handleAnswerChange = (index: number, value: string) => {
    setAnswers(prev => {
      const newAnswers = [...prev]
      newAnswers[index] = value
      return newAnswers
    })
  }
  
  const handleSubmit = () => {
    if (answers.some(answer => !answer?.trim())) return
    onAnswerChange(answers.join(' | '))
  }

  return (
    <div className="space-y-6">
      <div className="text-lg leading-relaxed">
        {parts.map((part, index) => (
          <span key={`part-${index}`}>
            {part}
            {index < parts.length - 1 && (
              <input
                type="text"
                value={answers[index]}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
                className="mx-1 w-32 text-center border-b-2 border-gray-300 
                  focus:border-blue-500 focus:outline-none bg-transparent
                  text-blue-600 placeholder:text-gray-400"
                placeholder="..."
              />
            )}
          </span>
        ))}
      </div>
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={answers.some(answer => !answer?.trim())}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg 
            hover:bg-blue-700 transition-colors disabled:bg-gray-400
            disabled:cursor-not-allowed"
        >
          Submit Answer
        </button>
      </div>
    </div>
  )
} 