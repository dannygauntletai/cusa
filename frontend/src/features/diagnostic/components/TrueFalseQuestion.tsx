import { Question } from '@/shared/types/question'

interface TrueFalseQuestionProps {
  question: Question
  onAnswerChange: (answer: string) => void
}

export function TrueFalseQuestion({ 
  question, 
  onAnswerChange 
}: TrueFalseQuestionProps) {
  const handleAnswer = (answer: string) => {
    onAnswerChange(answer)
  }

  return (
    <div className="space-y-4">
      <p className="text-lg font-medium">{question.text}</p>
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => handleAnswer('True')}
          className="px-6 py-3 rounded-lg font-medium transition-colors
            bg-green-100 hover:bg-green-200 text-green-800"
        >
          True
        </button>
        <button
          onClick={() => handleAnswer('False')}
          className="px-6 py-3 rounded-lg font-medium transition-colors
            bg-red-100 hover:bg-red-200 text-red-800"
        >
          False
        </button>
        <button
          onClick={() => handleAnswer('Unknown')}
          className="px-6 py-3 rounded-lg font-medium transition-colors
            bg-gray-100 hover:bg-gray-200 text-gray-800"
        >
          Unknown
        </button>
      </div>
    </div>
  )
} 