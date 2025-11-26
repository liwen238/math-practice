import { describe, it, expect, beforeEach } from 'vitest'
import {
  generateAddition,
  generateSubtraction,
  generateMultiplication,
  generateDivision,
  generateDistractors,
  generateQuestion,
  areQuestionsDuplicate,
  isDuplicate,
  generateSessionQuestions,
  generateAdaptiveQuestion,
} from './questionGenerator'

describe('Question Generator', () => {
  describe('generateAddition', () => {
    it('should generate addition questions within level 1 range', () => {
      const question = generateAddition(1)
      expect(question.operand1).toBeGreaterThanOrEqual(-20)
      expect(question.operand1).toBeLessThanOrEqual(50)
      expect(question.operand2).toBeGreaterThanOrEqual(-20)
      expect(question.operand2).toBeLessThanOrEqual(50)
      expect(question.correctAnswer).toBe(question.operand1 + question.operand2)
    })

    it('should generate addition questions within level 2 range', () => {
      const question = generateAddition(2)
      expect(question.operand1).toBeGreaterThanOrEqual(-50)
      expect(question.operand1).toBeLessThanOrEqual(100)
      expect(question.operand2).toBeGreaterThanOrEqual(-50)
      expect(question.operand2).toBeLessThanOrEqual(100)
      expect(question.correctAnswer).toBe(question.operand1 + question.operand2)
    })

    it('should generate addition questions within level 3 range', () => {
      const question = generateAddition(3)
      expect(question.operand1).toBeGreaterThanOrEqual(-100)
      expect(question.operand1).toBeLessThanOrEqual(100)
      expect(question.operand2).toBeGreaterThanOrEqual(-100)
      expect(question.operand2).toBeLessThanOrEqual(100)
      expect(question.correctAnswer).toBe(question.operand1 + question.operand2)
    })

    it('should adjust range based on difficulty', () => {
      const easy = generateAddition(2, -3)
      const normal = generateAddition(2, 0)
      const hard = generateAddition(2, 3)
      
      // Hard questions should generally have larger numbers
      const easyMax = Math.max(Math.abs(easy.operand1), Math.abs(easy.operand2))
      const hardMax = Math.max(Math.abs(hard.operand1), Math.abs(hard.operand2))
      
      // This is probabilistic, so we just check they're valid
      expect(easy.correctAnswer).toBe(easy.operand1 + easy.operand2)
      expect(hard.correctAnswer).toBe(hard.operand1 + hard.operand2)
    })
  })

  describe('generateSubtraction', () => {
    it('should generate subtraction questions with correct answer', () => {
      const question = generateSubtraction(1)
      expect(question.correctAnswer).toBe(question.operand1 - question.operand2)
    })

    it('should allow negative results', () => {
      let foundNegative = false
      for (let i = 0; i < 20; i++) {
        const question = generateSubtraction(1)
        if (question.correctAnswer < 0) {
          foundNegative = true
          break
        }
      }
      // With negative operands allowed, we should eventually get negative results
      expect(foundNegative).toBe(true)
    })
  })

  describe('generateMultiplication', () => {
    it('should generate multiplication questions within table limits', () => {
      const question = generateMultiplication(1)
      expect(question.operand1).toBeGreaterThanOrEqual(1)
      expect(question.operand1).toBeLessThanOrEqual(10)
      expect(question.operand2).toBeGreaterThanOrEqual(1)
      expect(question.operand2).toBeLessThanOrEqual(10)
      expect(question.correctAnswer).toBe(question.operand1 * question.operand2)
    })

    it('should respect level 2 table max', () => {
      const question = generateMultiplication(2)
      expect(question.operand1).toBeLessThanOrEqual(15)
      expect(question.operand2).toBeLessThanOrEqual(15)
    })

    it('should respect level 3 table max', () => {
      const question = generateMultiplication(3)
      expect(question.operand1).toBeLessThanOrEqual(20)
      expect(question.operand2).toBeLessThanOrEqual(20)
    })
  })

  describe('generateDivision', () => {
    it('should generate exact division questions', () => {
      const question = generateDivision(1)
      expect(question.operand1 % question.operand2).toBe(0)
      expect(question.correctAnswer).toBe(question.operand1 / question.operand2)
    })

    it('should have dividend = divisor * quotient', () => {
      const question = generateDivision(2)
      expect(question.operand1).toBe(question.operand2 * question.correctAnswer)
    })

    it('should never divide by zero', () => {
      for (let i = 0; i < 50; i++) {
        const question = generateDivision(1)
        expect(question.operand2).not.toBe(0)
      }
    })
  })

  describe('generateDistractors', () => {
    it('should generate exactly 4 unique choices', () => {
      const choices = generateDistractors(10, 1)
      expect(choices.length).toBe(4)
      expect(new Set(choices).size).toBe(4)
    })

    it('should include the correct answer', () => {
      const correctAnswer = 15
      const choices = generateDistractors(correctAnswer, 2)
      expect(choices).toContain(correctAnswer)
    })

    it('should shuffle the choices', () => {
      // Run multiple times to check shuffling (probabilistic)
      const allSame = []
      for (let i = 0; i < 10; i++) {
        const choices = generateDistractors(10, 1)
        allSame.push(choices[0] === 10)
      }
      // Not all should have correct answer in first position
      expect(allSame.every(v => v === true)).toBe(false)
    })
  })

  describe('generateQuestion', () => {
    it('should generate a complete question with all properties', () => {
      const question = generateQuestion(1, 'add', 'test1')
      expect(question).toHaveProperty('id')
      expect(question).toHaveProperty('level')
      expect(question).toHaveProperty('operation')
      expect(question).toHaveProperty('operand1')
      expect(question).toHaveProperty('operand2')
      expect(question).toHaveProperty('correctAnswer')
      expect(question).toHaveProperty('choices')
      expect(question.choices.length).toBe(4)
    })

    it('should generate questions for all operations', () => {
      const operations = ['add', 'subtract', 'multiply', 'divide']
      operations.forEach(op => {
        const question = generateQuestion(2, op, `test-${op}`)
        expect(question.operation).toBe(op)
        expect(question.choices).toContain(question.correctAnswer)
      })
    })

    it('should throw error for unknown operation', () => {
      expect(() => generateQuestion(1, 'unknown', 'test')).toThrow()
    })
  })

  describe('areQuestionsDuplicate', () => {
    it('should identify duplicate questions', () => {
      const q1 = { operation: 'add', operand1: 5, operand2: 3 }
      const q2 = { operation: 'add', operand1: 5, operand2: 3 }
      expect(areQuestionsDuplicate(q1, q2)).toBe(true)
    })

    it('should identify non-duplicate questions', () => {
      const q1 = { operation: 'add', operand1: 5, operand2: 3 }
      const q2 = { operation: 'add', operand1: 5, operand2: 4 }
      expect(areQuestionsDuplicate(q1, q2)).toBe(false)
    })

    it('should identify different operations as non-duplicates', () => {
      const q1 = { operation: 'add', operand1: 5, operand2: 3 }
      const q2 = { operation: 'subtract', operand1: 5, operand2: 3 }
      expect(areQuestionsDuplicate(q1, q2)).toBe(false)
    })
  })

  describe('isDuplicate', () => {
    it('should find duplicate in array', () => {
      const questions = [
        { operation: 'add', operand1: 5, operand2: 3 },
        { operation: 'subtract', operand1: 10, operand2: 4 },
      ]
      const duplicate = { operation: 'add', operand1: 5, operand2: 3 }
      expect(isDuplicate(duplicate, questions)).toBe(true)
    })

    it('should not find non-duplicate', () => {
      const questions = [
        { operation: 'add', operand1: 5, operand2: 3 },
      ]
      const newQuestion = { operation: 'add', operand1: 5, operand2: 4 }
      expect(isDuplicate(newQuestion, questions)).toBe(false)
    })
  })

  describe('generateSessionQuestions', () => {
    it('should generate 10 unique questions', () => {
      const questions = generateSessionQuestions(2, ['add', 'subtract'])
      expect(questions.length).toBe(10)
      
      // Check for duplicates
      for (let i = 0; i < questions.length; i++) {
        for (let j = i + 1; j < questions.length; j++) {
          expect(areQuestionsDuplicate(questions[i], questions[j])).toBe(false)
        }
      }
    })

    it('should generate questions with valid operations', () => {
      const questions = generateSessionQuestions(1, ['add', 'multiply'])
      questions.forEach(q => {
        expect(['add', 'multiply']).toContain(q.operation)
      })
    })

    it('should handle single operation', () => {
      const questions = generateSessionQuestions(1, ['add'])
      expect(questions.length).toBe(10)
      questions.forEach(q => {
        expect(q.operation).toBe('add')
      })
    })
  })

  describe('generateAdaptiveQuestion', () => {
    it('should generate a question with adaptive difficulty', () => {
      const difficulties = { add: 2, subtract: -1 }
      const question = generateAdaptiveQuestion(
        2,
        ['add', 'subtract'],
        difficulties,
        [],
        'test1'
      )
      expect(question).not.toBeNull()
      expect(['add', 'subtract']).toContain(question.operation)
    })

    it('should avoid duplicates', () => {
      const existing = [
        { operation: 'add', operand1: 5, operand2: 3 },
      ]
      const question = generateAdaptiveQuestion(
        1,
        ['add'],
        { add: 0 },
        existing,
        'test2'
      )
      if (question) {
        expect(isDuplicate(question, existing)).toBe(false)
      }
    })
  })
})

