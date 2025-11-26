import { describe, it, expect } from 'vitest'
import {
  clampDifficulty,
  initializeDifficulties,
  updateDifficulty,
  getAdjustedRange,
  getAdjustedTableMax,
} from './difficulty'

describe('Difficulty Utilities', () => {
  describe('clampDifficulty', () => {
    it('should clamp values to -3 to 3 range', () => {
      expect(clampDifficulty(-5)).toBe(-3)
      expect(clampDifficulty(5)).toBe(3)
      expect(clampDifficulty(0)).toBe(0)
      expect(clampDifficulty(-3)).toBe(-3)
      expect(clampDifficulty(3)).toBe(3)
    })

    it('should keep values within range unchanged', () => {
      expect(clampDifficulty(-2)).toBe(-2)
      expect(clampDifficulty(2)).toBe(2)
      expect(clampDifficulty(1)).toBe(1)
    })
  })

  describe('initializeDifficulties', () => {
    it('should initialize all operations to 0', () => {
      const difficulties = initializeDifficulties(['add', 'subtract', 'multiply'])
      expect(difficulties.add).toBe(0)
      expect(difficulties.subtract).toBe(0)
      expect(difficulties.multiply).toBe(0)
    })

    it('should handle empty operations array', () => {
      const difficulties = initializeDifficulties([])
      expect(Object.keys(difficulties).length).toBe(0)
    })
  })

  describe('updateDifficulty', () => {
    it('should increment difficulty on correct answer', () => {
      const difficulties = { add: 0 }
      const updated = updateDifficulty(difficulties, 'add', true)
      expect(updated.add).toBe(1)
    })

    it('should decrement difficulty on wrong answer', () => {
      const difficulties = { add: 0 }
      const updated = updateDifficulty(difficulties, 'add', false)
      expect(updated.add).toBe(-1)
    })

    it('should clamp difficulty at maximum', () => {
      const difficulties = { add: 3 }
      const updated = updateDifficulty(difficulties, 'add', true)
      expect(updated.add).toBe(3) // Should stay at 3
    })

    it('should clamp difficulty at minimum', () => {
      const difficulties = { add: -3 }
      const updated = updateDifficulty(difficulties, 'add', false)
      expect(updated.add).toBe(-3) // Should stay at -3
    })

    it('should not modify other operations', () => {
      const difficulties = { add: 1, subtract: 2 }
      const updated = updateDifficulty(difficulties, 'add', true)
      expect(updated.add).toBe(2)
      expect(updated.subtract).toBe(2) // Unchanged
    })

    it('should handle non-existent operation gracefully', () => {
      const difficulties = { add: 1 }
      const updated = updateDifficulty(difficulties, 'multiply', true)
      expect(updated.add).toBe(1) // Unchanged
      expect(updated.multiply).toBeUndefined()
    })
  })

  describe('getAdjustedRange', () => {
    it('should return adjusted range for positive difficulty', () => {
      const result = getAdjustedRange(0, 100, 3)
      expect(result.min).toBeGreaterThan(0)
      expect(result.max).toBeGreaterThan(100)
    })

    it('should return adjusted range for negative difficulty', () => {
      const result = getAdjustedRange(0, 100, -3)
      expect(result.min).toBeLessThan(0)
      expect(result.max).toBeLessThan(100)
    })

    it('should return original range for zero difficulty', () => {
      const result = getAdjustedRange(10, 50, 0)
      expect(result.min).toBe(10)
      expect(result.max).toBe(50)
    })
  })

  describe('getAdjustedTableMax', () => {
    it('should increase table max for positive difficulty', () => {
      const result = getAdjustedTableMax(10, 3)
      expect(result).toBeGreaterThan(10)
    })

    it('should decrease table max for negative difficulty', () => {
      const result = getAdjustedTableMax(10, -3)
      expect(result).toBeLessThan(10)
    })

    it('should never return less than 1', () => {
      const result = getAdjustedTableMax(5, -10)
      expect(result).toBeGreaterThanOrEqual(1)
    })

    it('should return original for zero difficulty', () => {
      const result = getAdjustedTableMax(10, 0)
      expect(result).toBe(10)
    })
  })
})

