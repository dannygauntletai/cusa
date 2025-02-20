import { Question } from '@/shared/types/question'

interface MultipleChoiceQuestionProps {
  question: Question
  onAnswerChange: (answer: string) => void
}

export function MultipleChoiceQuestion({ 
  question, 
  onAnswerChange 
}: MultipleChoiceQuestionProps) {
  return (
    <div className="space-y-4">
      <p className="text-lg font-medium">{question.text}</p>
      <div className="flex flex-col space-y-3">
        {question.options?.map((option, index) => (
          <button
            key={index}
            onClick={() => onAnswerChange(option)}
            className="px-6 py-3 rounded-lg font-medium transition-colors
              bg-blue-100 hover:bg-blue-200 text-blue-800 text-left"
          >
            {option}
          </button>
        ))}
        <button
          onClick={() => onAnswerChange('Unknown')}
          className="px-6 py-3 rounded-lg font-medium transition-colors
            bg-gray-100 hover:bg-gray-200 text-gray-800"
        >
          Unknown
        </button>
      </div>
    </div>
  )
} 