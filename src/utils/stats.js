/**
 * Statistics utilities
 * Handles calculation, storage, and retrieval of session statistics
 */

import { MAX_STORED_SESSIONS } from './constants'

const STATS_STORAGE_KEY = 'sessionStats.v1'

/**
 * Calculate session statistics from answers
 * @param {Array} answers - Array of answer objects with isCorrect property
 * @returns {Object} Statistics object with attempted, correct, incorrect, accuracy
 */
export function calculateSessionStats(answers) {
  const attempted = answers.filter(a => a !== null).length
  const correct = answers.filter(a => a !== null && a.isCorrect === true).length
  const incorrect = answers.filter(a => a !== null && a.isCorrect === false).length
  const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0

  return {
    attempted,
    correct,
    incorrect,
    accuracy,
  }
}

/**
 * Save session stats to localStorage (adds to history)
 * @param {Object} stats - Statistics object
 */
export function saveLastSessionStats(stats) {
  const statsData = {
    ...stats,
    timestamp: Date.now(),
    sessionId: `session-${Date.now()}`,
  }
  
  // Load existing sessions
  const allSessions = loadAllSessionStats()
  
  // Add new session to the array
  allSessions.push(statsData)
  
  // Keep only the last N sessions to prevent localStorage from getting too large
  const recentSessions = allSessions.slice(-MAX_STORED_SESSIONS)
  
  // Save back to localStorage
  localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(recentSessions))
  
  // Also save as last session for backward compatibility
  localStorage.setItem('lastSessionStats.v1', JSON.stringify(statsData))
}

/**
 * Load last session stats from localStorage (for backward compatibility)
 * @returns {Object|null} Statistics object or null if not found
 */
export function loadLastSessionStats() {
  const allSessions = loadAllSessionStats()
  if (allSessions.length === 0) {
    // Try old format for backward compatibility
    const oldData = localStorage.getItem('lastSessionStats.v1')
    if (oldData) {
      return JSON.parse(oldData)
    }
    return null
  }
  // Return the most recent session
  return allSessions[allSessions.length - 1]
}

/**
 * Load all session statistics from localStorage
 * @returns {Array} Array of session statistics objects
 */
export function loadAllSessionStats() {
  const data = localStorage.getItem(STATS_STORAGE_KEY)
  if (!data) {
    // Try to migrate from old format
    const oldData = localStorage.getItem('lastSessionStats.v1')
    if (oldData) {
      try {
        const oldStats = JSON.parse(oldData)
        if (oldStats && oldStats.timestamp) {
          return [oldStats]
        }
      } catch (e) {
        console.error('Error parsing old stats format:', e)
      }
    }
    return []
  }
  try {
    return JSON.parse(data)
  } catch (e) {
    console.error('Error parsing session stats:', e)
    return []
  }
}

/**
 * Calculate overall statistics from all sessions
 * @param {Array} sessions - Array of session statistics
 * @returns {Object} Overall statistics
 */
export function calculateOverallStats(sessions) {
  if (sessions.length === 0) {
    return {
      totalSessions: 0,
      totalAttempted: 0,
      totalCorrect: 0,
      totalIncorrect: 0,
      overallAccuracy: 0,
      averageAccuracy: 0,
    }
  }

  const totalSessions = sessions.length
  const totalAttempted = sessions.reduce((sum, s) => sum + (s.attempted || 0), 0)
  const totalCorrect = sessions.reduce((sum, s) => sum + (s.correct || 0), 0)
  const totalIncorrect = sessions.reduce((sum, s) => sum + (s.incorrect || 0), 0)
  const overallAccuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0
  const averageAccuracy = totalSessions > 0 
    ? Math.round(sessions.reduce((sum, s) => sum + (s.accuracy || 0), 0) / totalSessions)
    : 0

  return {
    totalSessions,
    totalAttempted,
    totalCorrect,
    totalIncorrect,
    overallAccuracy,
    averageAccuracy,
  }
}

/**
 * Clear all session statistics
 */
export function clearAllSessionStats() {
  localStorage.removeItem(STATS_STORAGE_KEY)
  localStorage.removeItem('lastSessionStats.v1')
}

