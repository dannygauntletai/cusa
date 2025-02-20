import { useState, FormEvent } from 'react'
import { QuestionList } from '@/features/questions/components/QuestionList'
import { Question } from '@/shared/types/question'
import { generateQuestions } from '@/shared/services/questionService'

type Mode = 'catching-up' | 'staying-ahead'

interface SearchInputProps {
  query: string
  setQuery: (query: string) => void
}

export function SearchInput({ query, setQuery }: SearchInputProps) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [mode, setMode] = useState<Mode>('catching-up')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsLoading(true)
    setError('')

    try {
      const response = await generateQuestions(query)
      setQuestions(response.questions)
    } catch (error) {
      console.error(error)
      setError('Failed to generate questions. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form 
        onSubmit={handleSubmit} 
        className="space-y-4"
      >
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-6 pt-6 pb-20 text-lg bg-white border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 text-gray-900 placeholder:text-gradient-light transition-all"
            placeholder={mode === 'catching-up' ? 'What topic do you need help with?' : 'What would you like to learn next?'}
          />

          <div className="absolute left-5 bottom-5 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMode('catching-up')}
              className="px-3 py-1.5 text-sm rounded-full font-medium transition-colors bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 data-[active=true]:bg-blue-500 data-[active=true]:text-white data-[active=true]:border-blue-500"
              data-active={mode === 'catching-up'}
            >
              Catching Up
            </button>
            <button
              type="button"
              onClick={() => setMode('staying-ahead')}
              className="px-3 py-1.5 text-sm rounded-full font-medium transition-colors bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 data-[active=true]:bg-blue-500 data-[active=true]:text-white data-[active=true]:border-blue-500"
              data-active={mode === 'staying-ahead'}
            >
              Staying Ahead
            </button>
          </div>

          <button 
            type="submit"
            className="absolute right-4 bottom-5 p-2 text-gray-400 hover:text-blue-500 transition-colors"
            aria-label="Submit"
          >
            {query.trim() ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 19V5M12 5l-7 7M12 5l7 7" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" x2="12" y1="19" y2="22" />
              </svg>
            )}
          </button>
        </div>
      </form>

      {isLoading && (
        <div className="text-center mt-4">
          <div className="animate-spin h-8 w-8 border-4 border-blue-200 border-t-blue-500 rounded-full mx-auto" />
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg border border-red-100">
          {error}
        </div>
      )}

      <QuestionList questions={questions} />
    </div>
  )
}

export default SearchInput 