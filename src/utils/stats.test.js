import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  calculateSessionStats,
  saveLastSessionStats,
  loadLastSessionStats,
  loadAllSessionStats,
  calculateOverallStats,
  clearAllSessionStats,
} from './stats'

describe('Statistics Utilities', () => {
  beforeEach(() => {
    // Clear localStorage (jsdom doesn't have clear())
    const keys = Object.keys(localStorage)
    keys.forEach(key => localStorage.removeItem(key))
  })

  describe('calculateSessionStats', () => {
    it('should calculate correct statistics', () => {
      const answers = [
        { isCorrect: true },
        { isCorrect: true },
        { isCorrect: false },
        { isCorrect: true },
        null,
      ]
      const stats = calculateSessionStats(answers)
      expect(stats.attempted).toBe(4)
      expect(stats.correct).toBe(3)
      expect(stats.incorrect).toBe(1)
      expect(stats.accuracy).toBe(75)
    })

    it('should handle all correct answers', () => {
      const answers = [
        { isCorrect: true },
        { isCorrect: true },
        { isCorrect: true },
      ]
      const stats = calculateSessionStats(answers)
      expect(stats.accuracy).toBe(100)
      expect(stats.correct).toBe(3)
      expect(stats.incorrect).toBe(0)
    })

    it('should handle all incorrect answers', () => {
      const answers = [
        { isCorrect: false },
        { isCorrect: false },
      ]
      const stats = calculateSessionStats(answers)
      expect(stats.accuracy).toBe(0)
      expect(stats.correct).toBe(0)
      expect(stats.incorrect).toBe(2)
    })

    it('should handle empty answers', () => {
      const answers = [null, null, null]
      const stats = calculateSessionStats(answers)
      expect(stats.attempted).toBe(0)
      expect(stats.accuracy).toBe(0)
    })

    it('should round accuracy correctly', () => {
      const answers = [
        { isCorrect: true },
        { isCorrect: false },
      ] // 50%
      const stats = calculateSessionStats(answers)
      expect(stats.accuracy).toBe(50)
    })
  })

  describe('saveLastSessionStats and loadLastSessionStats', () => {
    it('should save and load last session stats', () => {
      const stats = {
        attempted: 10,
        correct: 7,
        incorrect: 3,
        accuracy: 70,
      }
      saveLastSessionStats(stats)
      const loaded = loadLastSessionStats()
      expect(loaded.attempted).toBe(10)
      expect(loaded.correct).toBe(7)
      expect(loaded.incorrect).toBe(3)
      expect(loaded.accuracy).toBe(70)
      expect(loaded).toHaveProperty('timestamp')
      expect(loaded).toHaveProperty('sessionId')
    })

    it('should return null when no stats exist', () => {
      expect(loadLastSessionStats()).toBeNull()
    })
  })

  describe('loadAllSessionStats', () => {
    it('should load all session stats', () => {
      const stats1 = { attempted: 10, correct: 8, incorrect: 2, accuracy: 80 }
      const stats2 = { attempted: 10, correct: 6, incorrect: 4, accuracy: 60 }
      
      saveLastSessionStats(stats1)
      saveLastSessionStats(stats2)
      
      const allSessions = loadAllSessionStats()
      expect(allSessions.length).toBe(2)
      expect(allSessions[0].accuracy).toBe(80)
      expect(allSessions[1].accuracy).toBe(60)
    })

    it('should return empty array when no stats exist', () => {
      expect(loadAllSessionStats()).toEqual([])
    })
  })

  describe('calculateOverallStats', () => {
    it('should calculate overall statistics correctly', () => {
      const sessions = [
        { attempted: 10, correct: 8, incorrect: 2, accuracy: 80 },
        { attempted: 10, correct: 6, incorrect: 4, accuracy: 60 },
        { attempted: 10, correct: 9, incorrect: 1, accuracy: 90 },
      ]
      const overall = calculateOverallStats(sessions)
      expect(overall.totalSessions).toBe(3)
      expect(overall.totalAttempted).toBe(30)
      expect(overall.totalCorrect).toBe(23)
      expect(overall.totalIncorrect).toBe(7)
      expect(overall.overallAccuracy).toBe(77) // 23/30 rounded
      expect(overall.averageAccuracy).toBe(77) // (80+60+90)/3 rounded
    })

    it('should handle empty sessions', () => {
      const overall = calculateOverallStats([])
      expect(overall.totalSessions).toBe(0)
      expect(overall.totalAttempted).toBe(0)
      expect(overall.overallAccuracy).toBe(0)
    })

    it('should handle single session', () => {
      const sessions = [
        { attempted: 10, correct: 7, incorrect: 3, accuracy: 70 },
      ]
      const overall = calculateOverallStats(sessions)
      expect(overall.totalSessions).toBe(1)
      expect(overall.overallAccuracy).toBe(70)
      expect(overall.averageAccuracy).toBe(70)
    })
  })

  describe('clearAllSessionStats', () => {
    it('should clear all session statistics', () => {
      saveLastSessionStats({ attempted: 10, correct: 8, incorrect: 2, accuracy: 80 })
      expect(loadAllSessionStats().length).toBeGreaterThan(0)
      
      clearAllSessionStats()
      expect(loadAllSessionStats().length).toBe(0)
      expect(loadLastSessionStats()).toBeNull()
    })
  })
})

