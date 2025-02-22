import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary'
import { ErrorProvider } from './context/ErrorContext'
import { ConnectivityProvider } from './context/ConnectivityContext'
import HomeScreen from './components/HomeScreen'
import QuizTypeSelection from './components/QuizTypeSelection'
import QuizDisplay from './components/QuizDisplay'
import ProfileDashboard from './components/ProfileDashboard'
import type { QuizConfig, QuizResult } from './types/quiz'

function App() {
  const [topic, setTopic] = useState('')
  const [quizConfig, setQuizConfig] = useState<QuizConfig | null>(null)
  const navigate = useNavigate()
  const location = useLocation()

  // Update step based on current route
  useEffect(() => {
    const path = location.pathname
    if (path === '/config') {
      setStep('config')
    } else if (path === '/quiz') {
      setStep('quiz')
    } else if (path === '/') {
      setStep('home')
    }
  }, [location])

  const [step, setStep] = useState<'home' | 'config' | 'quiz'>('home')

  const handleTopicSubmit = (selectedTopic: string) => {
    setTopic(selectedTopic)
    setStep('config')
    navigate('/config')
  }

  const handleConfigSubmit = (config: QuizConfig) => {
    setQuizConfig(config)
    setStep('quiz')
    navigate('/quiz')
  }

  const handleQuizComplete = (result: QuizResult) => {
    console.log('Quiz completed:', result)
  }

  const handleBack = () => {
    if (step === 'config') {
      setStep('home')
      navigate('/')
    } else if (step === 'quiz') {
      setStep('config')
      navigate('/config')
    }
  }

  return (
    <ErrorBoundary>
      <ErrorProvider>
        <ConnectivityProvider>
          <Routes>
            <Route index element={<HomeScreen onSubmit={handleTopicSubmit} />} />
            <Route 
              path="/profile" 
              element={<ProfileDashboard onBack={() => navigate('/')} />}
            />
            <Route 
              path="/config" 
              element={
                <QuizTypeSelection
                  topic={topic}
                  onSubmit={handleConfigSubmit}
                  onBack={handleBack}
                />
              }
            />
            <Route 
              path="/quiz" 
              element={
                <QuizDisplay
                  questions={quizConfig?.questions || []}
                  onComplete={handleQuizComplete}
                  onBack={handleBack}
                />
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ConnectivityProvider>
      </ErrorProvider>
    </ErrorBoundary>
  )
}

export default App
