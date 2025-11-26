/**
 * Application-wide constants
 * Centralizes magic numbers and strings for maintainability
 */

// Session configuration
export const QUESTIONS_PER_SESSION = 10
export const LAST_QUESTION_INDEX = QUESTIONS_PER_SESSION - 1

// Session storage keys
export const SESSION_STORAGE_KEY = 'currentSession'

// Level mappings (age ranges to numeric levels)
export const LEVEL_MAP = {
  '7-8': 1,
  '9-10': 2,
  '11-12': 3,
}

// Reverse mapping for display purposes
export const LEVEL_DISPLAY = {
  1: '7-8',
  2: '9-10',
  3: '11-12',
}

// Operation names
export const OPERATIONS = {
  ADD: 'add',
  SUBTRACT: 'subtract',
  MULTIPLY: 'multiply',
  DIVIDE: 'divide',
}

// Confetti animation configuration
export const CONFETTI_CONFIG = {
  MAIN_BURST: {
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
  },
  SECONDARY_BURST: {
    particleCount: 50,
    spread: 55,
  },
  DELAY_MS: 250,
  LEFT_BURST: {
    angle: 60,
    origin: { x: 0 },
  },
  RIGHT_BURST: {
    angle: 120,
    origin: { x: 1 },
  },
}

// Maximum attempts for question generation
export const MAX_GENERATION_ATTEMPTS = 100
export const MAX_SESSION_GENERATION_ATTEMPTS = 1000

// Session history limits
export const MAX_STORED_SESSIONS = 100

