import { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { GradientText } from '@/components/ui/GradientText'
import { Question, Domain } from '@/shared/types/question'
import { generateDiagnosticQuestions, generateShortFormQuestions, getDomains } from '@/shared/services/questionService'
import { DiagnosticTest } from '@/features/diagnostic/components/DiagnosticTest'
import { DomainSelector } from '@/features/diagnostic/components/DomainSelector'
import { LoadingSlides } from '@/features/diagnostic/components/LoadingSlides'

type DiagnosticStage = 
  | 'loading' 
  | 'domain-select' 
  | 'generating-l1' 
  | 'ready-l1' 
  | 'active-l1'
  | 'generating-l2'
  | 'ready-l2'
  | 'active-l2'
  | 'complete'

const INTRO_SLIDES = [
  "Hello, you are about to complete a CUSA diagnostic test",
  "This test is designed to measure your Webb's depth of knowledge (DOK)",
  "Please allow us a few moments to generate the questions on your topic"
]

const LEVEL2_SLIDES = [
  "You've finished Level 1",
  "Now let's move on to Level 2",
  "These questions will test your understanding and application",
  "Please allow us a few moments to generate them"
]

export function DiagnosticPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const prompt = location.state?.prompt
  const hasCalledApi = useRef(false)
  const selectedDomainsRef = useRef<string[]>([])

  const [stage, setStage] = useState<DiagnosticStage>('loading')
  const [questions, setQuestions] = useState<Question[]>([])
  const [error, setError] = useState('')
  const [domains, setDomains] = useState<Domain[]>([])

  // Fetch domains when component mounts
  useEffect(() => {
    if (!prompt) {
      navigate('/')
      return
    }

    if (!hasCalledApi.current) {
      hasCalledApi.current = true
      fetchDomains()
    }
  }, [prompt, navigate])

  const fetchDomains = async () => {
    try {
      const response = await getDomains(prompt)
      setDomains(response.domains)
      setStage('domain-select')
    } catch (err) {
      setError('Failed to analyze topic')
      console.error(err)
    }
  }

  const handleDomainSelect = async (selectedDomains: string[]) => {
    try {
      selectedDomainsRef.current = selectedDomains
      setStage('generating-l1')
      const response = await generateDiagnosticQuestions(prompt, selectedDomains)
      setQuestions(response.questions)
      setStage('ready-l1')
    } catch (err) {
      console.error('Error generating questions:', err)
      setError('Failed to generate questions. Please try again.')
    }
  }

  const handleLevel1Complete = async (score: number) => {
    try {
      setStage('generating-l2')
      const response = await generateShortFormQuestions(prompt, selectedDomainsRef.current)
      setQuestions(response.questions)
      setStage('ready-l2')
    } catch (err) {
      console.error('Error generating Level 2 questions:', err)
      setError('Failed to generate Level 2 questions. Please try again.')
    }
  }

  const handleLevel2Complete = (score: number) => {
    setStage('complete')
  }

  const handleStart = (level: 1 | 2) => {
    setStage(level === 1 ? 'active-l1' : 'active-l2')
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <p className="text-red-600 text-lg">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // Show domain selector
  if (stage === 'domain-select') {
    return (
      <div className="min-h-screen p-8">
        <DomainSelector 
          domains={domains}
          onSelect={handleDomainSelect}
        />
      </div>
    )
  }

  // Show loading slides while generating questions
  if (stage === 'generating-l1') {
    return <LoadingSlides slides={INTRO_SLIDES} />
  }

  if (stage === 'generating-l2') {
    return <LoadingSlides slides={LEVEL2_SLIDES} />
  }

  // Show active test for either level
  if (stage === 'active-l1' || stage === 'active-l2') {
    return (
      <div className="container mx-auto px-4 py-8">
        <DiagnosticTest 
          questions={questions}
          onComplete={stage === 'active-l1' ? handleLevel1Complete : handleLevel2Complete}
        />
      </div>
    )
  }

  // Show start screen for Level 1
  if (stage === 'ready-l1') {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center space-y-6">
          <h2 className="text-2xl font-bold">
            <GradientText light>Level 1 - Factual Recall</GradientText>
          </h2>
          <p className="text-gray-600">
            Answer {questions.length} questions to test your knowledge
          </p>
          <button
            onClick={() => handleStart(1)}
            className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Start
          </button>
        </div>
      </div>
    )
  }

  // Show start screen for Level 2
  if (stage === 'ready-l2') {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center space-y-6">
          <h2 className="text-2xl font-bold">
            <GradientText light>Level 2 - Short Form Questions</GradientText>
          </h2>
          <p className="text-gray-600">
            Take your time to answer {questions.length} short-form questions
          </p>
          <button
            onClick={() => handleStart(2)}
            className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Start
          </button>
        </div>
      </div>
    )
  }

  // Show completion state
  if (stage === 'complete') {
    return (
      <div className="flex items-center justify-center min-h-screen p-8">
        <div className="max-w-2xl w-full space-y-8 text-center">
          <h2 className="text-4xl font-bold">Test Complete!</h2>
          <button
            onClick={() => navigate('/')}
            className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Return Home
          </button>
        </div>
      </div>
    )
  }

  // Default loading state
  return <LoadingSlides slides={INTRO_SLIDES} />
} 