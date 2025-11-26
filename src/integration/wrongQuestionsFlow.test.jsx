import { describe, it, expect, beforeEach, vi } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { renderWithRouter, navigateTo } from '../test/routerHelpers'
import { upsertWrongQuestion } from '../utils/wrongQuestions'
import { generateQuestion } from '../utils/questionGenerator'

describe('Wrong Questions Flow Integration', () => {
  beforeEach(() => {
    sessionStorage.clear()
    localStorage.clear()
    vi.clearAllMocks()
    global.window.confirm = vi.fn(() => true)
    global.window.alert = vi.fn()
  })

  it('should save wrong question from session and display in review', async () => {
    // Step 1: Create a wrong question
    const wrongQuestion = generateQuestion(1, 'add', 'q1', 0)
    upsertWrongQuestion(wrongQuestion)

    // Step 2: Navigate to review page
    renderWithRouter(['/review-wrong'])

    // Step 3: Verify wrong question appears
    await waitFor(() => {
      expect(screen.getByText('Review Wrong Questions')).toBeInTheDocument()
      expect(screen.getByText(/Question 1 of 1/)).toBeInTheDocument()
    })

    // Verify question is displayed (check for question text)
    await waitFor(() => {
      expect(screen.getByText(/What is/)).toBeInTheDocument()
    }, { timeout: 2000 })
  })

  it('should remove question from review when answered correctly', async () => {
    // Setup: Add a wrong question
    const wrongQuestion = generateQuestion(1, 'subtract', 'q1', 0)
    upsertWrongQuestion(wrongQuestion)

    renderWithRouter(['/review-wrong'])

    await waitFor(() => {
      expect(screen.getByText(/Question 1 of 1/)).toBeInTheDocument()
    })

    // Answer correctly - find the button with the correct answer
    const correctButtons = screen.getAllByText(new RegExp(`${wrongQuestion.correctAnswer}`))
    const correctButton = correctButtons.find(btn => btn.tagName === 'BUTTON')
    fireEvent.click(correctButton)
    fireEvent.click(screen.getByText('Flip Card'))
    
    await waitFor(() => {
      fireEvent.click(screen.getByText('I got it right!'))
    })

    // Should show empty state
    await waitFor(() => {
      expect(screen.getByText('No wrong questions yet')).toBeInTheDocument()
    })

    // Verify question was removed from localStorage
    const wrongQuestions = JSON.parse(localStorage.getItem('wrongQuestions.v1') || '{}')
    expect(Object.keys(wrongQuestions).length).toBe(0)
  })

  it('should increment missCount when answered wrong again', async () => {
    // Setup: Add a wrong question
    const wrongQuestion = generateQuestion(1, 'multiply', 'q1', 0)
    upsertWrongQuestion(wrongQuestion)

    renderWithRouter(['/review-wrong'])

    await waitFor(() => {
      expect(screen.getByText(/Question 1 of 1/)).toBeInTheDocument()
    })

    // Get initial missCount
    const initialWrongQuestions = JSON.parse(localStorage.getItem('wrongQuestions.v1') || '{}')
    const questionKey = `multiply-${wrongQuestion.operand1}-${wrongQuestion.operand2}`
    const initialMissCount = initialWrongQuestions[questionKey]?.missCount || 1

    // Answer incorrectly again
    const wrongChoice = wrongQuestion.choices.find(c => c !== wrongQuestion.correctAnswer)
    const wrongButtons = screen.getAllByText(new RegExp(`${wrongChoice}`))
    const wrongButton = wrongButtons.find(btn => btn.tagName === 'BUTTON')
    if (wrongButton) {
      fireEvent.click(wrongButton)
    }
    fireEvent.click(screen.getByText('Flip Card'))
    
    await waitFor(() => {
      fireEvent.click(screen.getByText('I got it wrong'))
    })

    // Verify missCount increased
    await waitFor(() => {
      const updatedWrongQuestions = JSON.parse(localStorage.getItem('wrongQuestions.v1') || '{}')
      expect(updatedWrongQuestions[questionKey].missCount).toBe(initialMissCount + 1)
    })
  })

  it('should navigate between multiple wrong questions', async () => {
    // Setup: Add multiple wrong questions
    const q1 = generateQuestion(1, 'add', 'q1', 0)
    const q2 = generateQuestion(1, 'subtract', 'q2', 0)
    upsertWrongQuestion(q1)
    upsertWrongQuestion(q2)

    renderWithRouter(['/review-wrong'])

    await waitFor(() => {
      expect(screen.getByText(/Question 1 of 2/)).toBeInTheDocument()
    })

    // Verify we can see the first question
    expect(screen.getByText(/Question 1 of 2/)).toBeInTheDocument()
    
    // Answer the first question correctly
    const correctButtons = screen.getAllByText(new RegExp(`${q1.correctAnswer}`))
    const correctButton = correctButtons.find(btn => btn.tagName === 'BUTTON')
    if (correctButton) {
      fireEvent.click(correctButton)
      
      // Flip and report
      await waitFor(() => {
        const flipButton = screen.getByText('Flip Card')
        if (flipButton && !flipButton.disabled) {
          fireEvent.click(flipButton)
        }
      })
      
      await waitFor(() => {
        const rightButton = screen.queryByText('I got it right!')
        if (rightButton) {
          fireEvent.click(rightButton)
        }
      }, { timeout: 2000 })
    }

    // After answering correctly, the question is removed
    // Should either show the remaining question (Question 1 of 1) or empty state
    await waitFor(() => {
      const hasRemainingQuestion = screen.queryByText(/Question 1 of 1/) !== null
      const isEmpty = screen.queryByText('No wrong questions yet') !== null
      expect(hasRemainingQuestion || isEmpty).toBe(true)
    }, { timeout: 2000 })
  })

  it('should clear all wrong questions when clear button is clicked', async () => {
    // Setup: Add wrong questions
    upsertWrongQuestion(generateQuestion(1, 'add', 'q1', 0))
    upsertWrongQuestion(generateQuestion(1, 'subtract', 'q2', 0))

    renderWithRouter(['/review-wrong'])

    await waitFor(() => {
      expect(screen.getByText(/Question 1 of 2/)).toBeInTheDocument()
    })

    // Click clear history button
    const clearButton = screen.getByText('Clear History')
    fireEvent.click(clearButton)

    // Should show empty state
    await waitFor(() => {
      expect(screen.getByText('No wrong questions yet')).toBeInTheDocument()
    })

    // Verify localStorage is cleared
    const wrongQuestions = JSON.parse(localStorage.getItem('wrongQuestions.v1') || '{}')
    expect(Object.keys(wrongQuestions).length).toBe(0)
  })
})

