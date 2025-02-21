import { render, screen, fireEvent } from '@testing-library/react'
import ErrorBoundary from '../components/ErrorBoundary'

describe('ErrorBoundary', () => {
  it('should render error UI when error occurs', () => {
    const ThrowError = () => {
      throw new Error('Test error')
    }

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    )

    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    expect(screen.getByText('Test error')).toBeInTheDocument()
    
    const reloadButton = screen.getByText('Reload Application')
    expect(reloadButton).toBeInTheDocument()
  })
}) 