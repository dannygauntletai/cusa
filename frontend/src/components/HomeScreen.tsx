import { useState, useEffect } from 'react'
import { useConnectivity } from '../hooks/useConnectivity'

interface HomeScreenProps {
  onSubmit: (topic: string) => void
}

const HomeScreen = ({ onSubmit }: HomeScreenProps) => {
  const [topic, setTopic] = useState('')
  const [useWebSearch, setUseWebSearch] = useState(false)
  const isOnline = useConnectivity()
  
  // Disable web search when offline
  useEffect(() => {
    if (!isOnline) {
      setUseWebSearch(false)
    }
  }, [isOnline])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (topic.trim()) {
      onSubmit(topic.trim())
    }
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">CUSA Quiz</h1>
          <p className="mt-2 text-gray-600">Enter a topic to generate your quiz</p>
        </div>
        
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter your topic..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="webSearch"
              checked={useWebSearch}
              onChange={(e) => setUseWebSearch(e.target.checked)}
              disabled={!isOnline}
              className={`rounded focus:ring-blue-500 ${
                isOnline ? 'text-blue-500 cursor-pointer' : 'text-gray-400 cursor-not-allowed'
              }`}
            />
            <label 
              htmlFor="webSearch" 
              className={`${isOnline ? 'text-gray-700' : 'text-gray-400'}`}
            >
              Enable web search {!isOnline && '(currently offline)'}
            </label>
          </div>

          <button
            type="submit"
            disabled={!topic.trim()}
            className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  )
}

export default HomeScreen
