import { useState } from 'react'
import ErrorBoundary from './components/ErrorBoundary'
import { ErrorProvider } from './context/ErrorContext'
import { ConnectivityProvider } from './context/ConnectivityContext'
import HomeScreen from './components/HomeScreen'
import QuizTypeSelection from './components/QuizTypeSelection'
import QuizDisplay from './components/QuizDisplay'
import type { QuizConfig, QuizResult } from './types/quiz'

function App() {
  const [step, setStep] = useState<'home' | 'config' | 'quiz'>('home')
  const [topic, setTopic] = useState('')
  const [quizConfig, setQuizConfig] = useState<QuizConfig | null>(null)

  const handleTopicSubmit = (selectedTopic: string) => {
    setTopic(selectedTopic)
    setStep('config')
  }

  const handleConfigSubmit = (config: QuizConfig) => {
    setQuizConfig(config)
    setStep('quiz')
  }

  const handleQuizComplete = (result: QuizResult) => {
    console.log('Quiz completed:', result)
  }

  const handleBack = () => {
    if (step === 'config') {
      setStep('home')
    } else if (step === 'quiz') {
      setStep('config')
    }
  }

  return (
    <ErrorBoundary>
      <ErrorProvider>
        <ConnectivityProvider>
          {step === 'home' && (
            <HomeScreen onSubmit={handleTopicSubmit} />
          )}
          {step === 'config' && (
            <QuizTypeSelection
              topic={topic}
              onSubmit={handleConfigSubmit}
              onBack={handleBack}
            />
          )}
          {step === 'quiz' && quizConfig && (
            <QuizDisplay
              questions={quizConfig.questions || []}
              onComplete={handleQuizComplete}
              onBack={handleBack}
            />
          )}
        </ConnectivityProvider>
      </ErrorProvider>
    </ErrorBoundary>
  )
}

export default App
