import { describe, it, expect, vi } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { ConnectivityProvider, useConnectivity } from '../context/ConnectivityContext'

// Test component that displays connectivity status
const TestComponent = () => {
  const { isOnline } = useConnectivity()
  return <div data-testid="status">{isOnline ? 'online' : 'offline'}</div>
}

describe('Connectivity Context', () => {
  beforeEach(() => {
    // Reset navigator.onLine to true before each test
    Object.defineProperty(window.navigator, 'onLine', {
      configurable: true,
      value: true
    })
  })

  it('should track online status', async () => {
    render(
      <ConnectivityProvider>
        <TestComponent />
      </ConnectivityProvider>
    )
    
    // Initial state should be online
    expect(screen.getByTestId('status')).toHaveTextContent('online')
    
    // Simulate going offline
    await act(async () => {
      Object.defineProperty(window.navigator, 'onLine', {
        configurable: true,
        value: false
      })
      window.dispatchEvent(new Event('offline'))
    })
    expect(screen.getByTestId('status')).toHaveTextContent('offline')
    
    // Simulate going online
    await act(async () => {
      Object.defineProperty(window.navigator, 'onLine', {
        configurable: true,
        value: true
      })
      window.dispatchEvent(new Event('online'))
    })
    expect(screen.getByTestId('status')).toHaveTextContent('online')
  })
}) 