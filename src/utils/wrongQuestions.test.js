import { describe, it, expect, beforeEach } from 'vitest'
import {
  loadWrongQuestions,
  upsertWrongQuestion,
  removeWrongQuestion,
  getAllWrongQuestions,
  getWrongQuestionsCount,
  clearWrongQuestions,
} from './wrongQuestions'

describe('Wrong Questions Persistence', () => {
  beforeEach(() => {
    // Clear localStorage (jsdom doesn't have clear())
    const keys = Object.keys(localStorage)
    keys.forEach(key => localStorage.removeItem(key))
  })

  describe('upsertWrongQuestion', () => {
    it('should create a new wrong question record', () => {
      const question = {
        id: 'q1',
        level: 1,
        operation: 'add',
        operand1: 5,
        operand2: 3,
        correctAnswer: 8,
        choices: [6, 7, 8, 9],
      }
      
      const record = upsertWrongQuestion(question)
      expect(record.missCount).toBe(1)
      expect(record.timestamps.length).toBe(1)
      expect(record.question.operand1).toBe(5)
      expect(record.question.operand2).toBe(3)
    })

    it('should increment missCount for existing question', () => {
      const question = {
        operation: 'add',
        operand1: 5,
        operand2: 3,
        correctAnswer: 8,
      }
      
      upsertWrongQuestion(question)
      const record = upsertWrongQuestion(question)
      
      expect(record.missCount).toBe(2)
      expect(record.timestamps.length).toBe(2)
    })

    it('should handle questions with same operands but different operations', () => {
      const addQuestion = { operation: 'add', operand1: 5, operand2: 3, correctAnswer: 8 }
      const subQuestion = { operation: 'subtract', operand1: 5, operand2: 3, correctAnswer: 2 }
      
      upsertWrongQuestion(addQuestion)
      upsertWrongQuestion(subQuestion)
      
      const all = getAllWrongQuestions()
      expect(all.length).toBe(2)
    })
  })

  describe('removeWrongQuestion', () => {
    it('should remove a wrong question', () => {
      const question = {
        operation: 'add',
        operand1: 5,
        operand2: 3,
        correctAnswer: 8,
      }
      
      upsertWrongQuestion(question)
      expect(getWrongQuestionsCount()).toBe(1)
      
      removeWrongQuestion(question)
      expect(getWrongQuestionsCount()).toBe(0)
    })

    it('should not error when removing non-existent question', () => {
      const question = {
        operation: 'add',
        operand1: 10,
        operand2: 5,
        correctAnswer: 15,
      }
      
      expect(() => removeWrongQuestion(question)).not.toThrow()
    })
  })

  describe('getAllWrongQuestions', () => {
    it('should return all wrong questions', () => {
      const q1 = { operation: 'add', operand1: 5, operand2: 3, correctAnswer: 8 }
      const q2 = { operation: 'subtract', operand1: 10, operand2: 4, correctAnswer: 6 }
      
      upsertWrongQuestion(q1)
      upsertWrongQuestion(q2)
      
      const all = getAllWrongQuestions()
      expect(all.length).toBe(2)
    })

    it('should return empty array when no wrong questions', () => {
      expect(getAllWrongQuestions()).toEqual([])
    })
  })

  describe('getWrongQuestionsCount', () => {
    it('should return correct count', () => {
      expect(getWrongQuestionsCount()).toBe(0)
      
      upsertWrongQuestion({ operation: 'add', operand1: 5, operand2: 3, correctAnswer: 8 })
      expect(getWrongQuestionsCount()).toBe(1)
      
      upsertWrongQuestion({ operation: 'subtract', operand1: 10, operand2: 4, correctAnswer: 6 })
      expect(getWrongQuestionsCount()).toBe(2)
    })
  })

  describe('clearWrongQuestions', () => {
    it('should clear all wrong questions', () => {
      upsertWrongQuestion({ operation: 'add', operand1: 5, operand2: 3, correctAnswer: 8 })
      upsertWrongQuestion({ operation: 'subtract', operand1: 10, operand2: 4, correctAnswer: 6 })
      
      expect(getWrongQuestionsCount()).toBe(2)
      clearWrongQuestions()
      expect(getWrongQuestionsCount()).toBe(0)
    })
  })
})

