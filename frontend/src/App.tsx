import { useState } from 'react'
import HomeScreen from './components/HomeScreen'
import QuizTypeSelection from './components/QuizTypeSelection'
import QuizDisplay from './components/QuizDisplay'
import type { QuizConfig, QuizResult } from './types/quiz'

function App() {
  const [topic, setTopic] = useState<string>('')
  const [showQuizConfig, setShowQuizConfig] = useState(false)
  const [showQuiz, setShowQuiz] = useState(false)
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null)

  const handleTopicSubmit = (newTopic: string) => {
    setTopic(newTopic)
    setShowQuizConfig(true)
  }

  const handleQuizConfigSubmit = (config: QuizConfig) => {
    console.log('Generating quiz with config:', config)
    setShowQuiz(true)
  }

  const handleQuizComplete = (result: QuizResult) => {
    setQuizResult(result)
  }

  if (showQuiz) {
    return (
      <QuizDisplay 
        onComplete={handleQuizComplete}
        onBack={() => setShowQuiz(false)}
      />
    )
  }

  if (showQuizConfig) {
    return (
      <QuizTypeSelection 
        topic={topic}
        onSubmit={handleQuizConfigSubmit}
        onBack={() => setShowQuizConfig(false)}
      />
    )
  }

  return <HomeScreen onSubmit={handleTopicSubmit} />
}

export default App
