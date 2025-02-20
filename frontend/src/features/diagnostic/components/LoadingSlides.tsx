import { useState, useEffect } from 'react'

interface LoadingSlidesProps {
  slides: string[]
}

export function LoadingSlides({ slides }: LoadingSlidesProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => 
        prev < slides.length - 1 ? prev + 1 : prev
      )
    }, 4000)

    return () => clearInterval(timer)
  }, [slides.length])

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="text-center space-y-8">
        <div className="animate-pulse">
          <div className="h-4 w-4 bg-blue-500 rounded-full mx-auto mb-4" />
        </div>
        <p className="text-xl font-medium text-gray-700 animate-fade-in">
          {slides[currentSlide]}
        </p>
      </div>
    </div>
  )
} 