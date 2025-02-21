import React, { createContext, useContext, useState, useCallback } from 'react'

interface ErrorContextType {
  error: Error | null
  setError: (error: Error | null) => void
  clearError: () => void
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined)

export function ErrorProvider({ children }: { children: React.ReactNode }) {
  const [error, setErrorState] = useState<Error | null>(null)

  const setError = useCallback((error: Error | null) => {
    setErrorState(error)
    if (error) {
      console.error('Global error:', error)
    }
  }, [])

  const clearError = useCallback(() => {
    setErrorState(null)
  }, [])

  return (
    <ErrorContext.Provider value={{ error, setError, clearError }}>
      {children}
    </ErrorContext.Provider>
  )
}

export function useError() {
  const context = useContext(ErrorContext)
  if (context === undefined) {
    throw new Error('useError must be used within an ErrorProvider')
  }
  return context
} 