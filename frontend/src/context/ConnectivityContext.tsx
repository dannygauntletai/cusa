import React, { createContext, useContext, useState, useEffect } from 'react'

interface ConnectivityContextType {
  isOnline: boolean
  lastOnlineAt: Date | null
}

const ConnectivityContext = createContext<ConnectivityContextType | undefined>(undefined)

export function ConnectivityProvider({ children }: { children: React.ReactNode }) {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [lastOnlineAt, setLastOnlineAt] = useState<Date | null>(
    navigator.onLine ? new Date() : null
  )

  useEffect(() => {
    function handleOnline() {
      setIsOnline(true)
      setLastOnlineAt(new Date())
    }

    function handleOffline() {
      setIsOnline(false)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return (
    <ConnectivityContext.Provider value={{ isOnline, lastOnlineAt }}>
      {children}
    </ConnectivityContext.Provider>
  )
}

export function useConnectivity() {
  const context = useContext(ConnectivityContext)
  if (context === undefined) {
    throw new Error('useConnectivity must be used within a ConnectivityProvider')
  }
  return context
} 