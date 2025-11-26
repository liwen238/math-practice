/**
 * Test setup file for Vitest
 */
import { afterEach, beforeEach, vi } from 'vitest'

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
})

// Cleanup after each test
afterEach(() => {
  // Clear localStorage between tests
  if (global.localStorage && typeof global.localStorage.clear === 'function') {
    global.localStorage.clear()
  }
})

