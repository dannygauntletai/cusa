/// <reference types="vitest" />
/// <reference types="@testing-library/jest-dom" />

import '@testing-library/jest-dom'
import { vi } from 'vitest'
import type { Mock } from 'vitest'

// Define the electron interface to match the real one
interface ElectronAPI {
  invoke(channel: string, data?: unknown): Promise<unknown>
}

// Extend window with proper typing
declare global {
  interface Window {
    electron: {
      invoke: Mock<Promise<unknown>, [string, unknown?]>
    }
  }
}

// Mock window.electron with properly typed mock
window.electron = {
  invoke: vi.fn()
}

// Mock online/offline events
Object.defineProperty(window.navigator, 'onLine', {
  value: true,
  writable: true,
  configurable: true
}) 