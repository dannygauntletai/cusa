import { useState } from 'react'
import ErrorBoundary from './components/ErrorBoundary'
import { ErrorProvider } from './context/ErrorContext'
import { ConnectivityProvider } from './context/ConnectivityContext'
import HomeScreen from './components/HomeScreen'
import QuizTypeSelection from './components/QuizTypeSelection'
import QuizDisplay from './components/QuizDisplay'
import type { QuizConfig } from './types/quiz'

function App() {
  const [topic, setTopic] = useState<string>('')
  const [showQuizConfig, setShowQuizConfig] = useState(false)
  const [showQuiz, setShowQuiz] = useState(false)

  const handleTopicSubmit = (newTopic: string) => {
    setTopic(newTopic)
    setShowQuizConfig(true)
  }

  const handleQuizConfigSubmit = (config: QuizConfig) => {
    console.log('Generating quiz with config:', config)
    setShowQuiz(true)
  }

  const handleQuizComplete = () => {
    setShowQuiz(false)
    setShowQuizConfig(false)
  }

  return (
    <ErrorBoundary>
      <ErrorProvider>
        <ConnectivityProvider>
          {showQuiz ? (
            <QuizDisplay 
              onComplete={handleQuizComplete}
              onBack={() => setShowQuiz(false)}
            />
          ) : showQuizConfig ? (
            <QuizTypeSelection 
              topic={topic}
              onSubmit={handleQuizConfigSubmit}
              onBack={() => setShowQuizConfig(false)}
            />
          ) : (
            <HomeScreen onSubmit={handleTopicSubmit} />
          )}
        </ConnectivityProvider>
      </ErrorProvider>
    </ErrorBoundary>
  )
}

export default App
