import { useState } from 'react'
import { Question } from '@/shared/types/question'

interface ShortFormQuestionProps {
  question: Question
  onAnswerChange: (answer: string) => void
}

export function ShortFormQuestion({ question, onAnswerChange }: ShortFormQuestionProps) {
  const [answer, setAnswer] = useState('')

  const handleSubmit = () => {
    if (!answer.trim()) return
    onAnswerChange(answer)
  }

  return (
    <div className="space-y-4">
      <p className="text-lg font-medium">{question.text}</p>
      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        rows={4}
        placeholder="Type your answer here..."
      />
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={!answer.trim()}
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