/**
 * Test setup file for Vitest
 */
import { afterEach, beforeEach, vi } from 'vitest'
import '@testing-library/jest-dom'

// Setup localStorage mock before each test
beforeEach(() => {
  // Create a fresh localStorage mock for each test
  const store = {}
  global.localStorage = {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => { store[key] = value }),
    removeItem: vi.fn((key) => { delete store[key] }),
    clear: vi.fn(() => { 
      Object.keys(store).forEach(key => delete store[key])
    }),
    get length() {
      return Object.keys(store).length
    },
    key: vi.fn((index) => Object.keys(store)[index] || null),
  }
  
  // Mock sessionStorage the same way
  const sessionStore = {}
  global.sessionStorage = {
    getItem: vi.fn((key) => sessionStore[key] || null),
    setItem: vi.fn((key, value) => { sessionStore[key] = value }),
    removeItem: vi.fn((key) => { delete sessionStore[key] }),
    clear: vi.fn(() => { 
      Object.keys(sessionStore).forEach(key => delete sessionStore[key])
    }),
    get length() {
      return Object.keys(sessionStore).length
    },
    key: vi.fn((index) => Object.keys(sessionStore)[index] || null),
  }
  
  // Mock window.confirm and window.alert
  global.window.confirm = vi.fn(() => true)
  global.window.alert = vi.fn()
})

// Cleanup after each test
afterEach(() => {
  // Clear localStorage between tests
  if (global.localStorage && typeof global.localStorage.clear === 'function') {
    global.localStorage.clear()
  }
  if (global.sessionStorage && typeof global.sessionStorage.clear === 'function') {
    global.sessionStorage.clear()
  }
})

