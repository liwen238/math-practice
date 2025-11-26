import { describe, it, expect, beforeEach, vi } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { renderWithRouter } from '../test/routerHelpers'
import { generateQuestion } from '../utils/questionGenerator'

describe('Session Flow Integration', () => {
  beforeEach(() => {
    sessionStorage.clear()
    localStorage.clear()
    vi.clearAllMocks()
    global.window.confirm = vi.fn(() => true)
    global.window.alert = vi.fn()
  })

  it('should complete full session flow: setup → session → summary', async () => {
    renderWithRouter()

    // Step 1: Setup Page - Select level and operations
    expect(screen.getByText('Math Practice Cards')).toBeInTheDocument()
    fireEvent.click(screen.getByText('7-8'))
    fireEvent.click(screen.getByText('+'))
    fireEvent.click(screen.getByText('Start Session'))

    // Step 2: Session Page - Should navigate and show question
    await waitFor(() => {
      expect(screen.getByText(/Question 1 of 10/)).toBeInTheDocument()
    })

    // Verify session was saved
    const sessionData = sessionStorage.getItem('currentSession')
    expect(sessionData).not.toBeNull()
    const session = JSON.parse(sessionData)
    expect(session.level).toBe(1)
    expect(session.operations).toContain('add')
    expect(session.questions.length).toBeGreaterThan(0)
  })

  it('should handle question flow: select answer → flip → report', async () => {
    // Setup: Create a session and navigate to session page
    const mockQuestion = generateQuestion(1, 'add', 'q1', 0)
    const mockSession = {
      sessionId: 'test-session',
      level: 1,
      operations: ['add'],
      questions: [mockQuestion],
      currentQuestionIndex: 0,
      difficulties: { add: 0 },
      answers: new Array(10).fill(null),
    }
    sessionStorage.setItem('currentSession', JSON.stringify(mockSession))

    renderWithRouter(['/session'])

    await waitFor(() => {
      expect(screen.getByText(/Question 1 of 10/)).toBeInTheDocument()
    })

    // Select an answer
    const choiceButtons = screen.getAllByText(new RegExp(`${mockQuestion.choices[0]}`))
    const choiceButton = choiceButtons.find(btn => btn.tagName === 'BUTTON')
    if (choiceButton) {
      fireEvent.click(choiceButton)
    }

    // Flip card
    const flipButton = screen.getByText('Flip Card')
    expect(flipButton).not.toBeDisabled()
    fireEvent.click(flipButton)

    // Verify card is flipped
    await waitFor(() => {
      expect(screen.getByText('Correct Answer:')).toBeInTheDocument()
    })

    // Report answer
    const correctButton = screen.getByText('I got it right!')
    fireEvent.click(correctButton)

    // Should advance to next question or summary
    await waitFor(() => {
      const session = JSON.parse(sessionStorage.getItem('currentSession'))
      expect(session.answers[0]).not.toBeNull()
    })
  })

  it('should save wrong questions when user reports incorrect', async () => {
    const mockQuestion = generateQuestion(1, 'add', 'q1', 0)
    const mockSession = {
      sessionId: 'test-session',
      level: 1,
      operations: ['add'],
      questions: [mockQuestion],
      currentQuestionIndex: 0,
      difficulties: { add: 0 },
      answers: new Array(10).fill(null),
    }
    sessionStorage.setItem('currentSession', JSON.stringify(mockSession))

    renderWithRouter(['/session'])

    await waitFor(() => {
      expect(screen.getByText(/Question 1 of 10/)).toBeInTheDocument()
    })

    // Select wrong answer
    const wrongChoice = mockQuestion.choices.find(c => c !== mockQuestion.correctAnswer)
    const wrongButtons = screen.getAllByText(new RegExp(`${wrongChoice}`))
    const wrongButton = wrongButtons.find(btn => btn.tagName === 'BUTTON')
    if (wrongButton) {
      fireEvent.click(wrongButton)
    }

    // Flip and report wrong
    fireEvent.click(screen.getByText('Flip Card'))
    await waitFor(() => {
      fireEvent.click(screen.getByText('I got it wrong'))
    })

    // Verify wrong question was saved
    await waitFor(() => {
      const wrongQuestions = JSON.parse(localStorage.getItem('wrongQuestions.v1') || '{}')
      expect(Object.keys(wrongQuestions).length).toBeGreaterThan(0)
    })
  })

  it('should update difficulty based on answers', async () => {
    const mockQuestion = generateQuestion(1, 'add', 'q1', 0)
    const mockSession = {
      sessionId: 'test-session',
      level: 1,
      operations: ['add'],
      questions: [mockQuestion],
      currentQuestionIndex: 0,
      difficulties: { add: 0 },
      answers: new Array(10).fill(null),
    }
    sessionStorage.setItem('currentSession', JSON.stringify(mockSession))

    renderWithRouter(['/session'])

    await waitFor(() => {
      expect(screen.getByText(/Question 1 of 10/)).toBeInTheDocument()
    })

    // Answer correctly - find the button with the correct answer
    const correctButtons = screen.getAllByText(new RegExp(`${mockQuestion.correctAnswer}`))
    const correctButton = correctButtons.find(btn => btn.tagName === 'BUTTON')
    fireEvent.click(correctButton)
    fireEvent.click(screen.getByText('Flip Card'))
    
    await waitFor(() => {
      fireEvent.click(screen.getByText('I got it right!'))
    })

    // Verify difficulty was updated
    await waitFor(() => {
      const session = JSON.parse(sessionStorage.getItem('currentSession'))
      expect(session.difficulties.add).toBe(1) // Should increment from 0 to 1
    })
  })

  it('should navigate to summary after 10 questions', async () => {
    // Create session with 9 questions answered
    const mockQuestions = Array.from({ length: 10 }, (_, i) => 
      generateQuestion(1, 'add', `q${i + 1}`, 0)
    )
    const mockSession = {
      sessionId: 'test-session',
      level: 1,
      operations: ['add'],
      questions: mockQuestions,
      currentQuestionIndex: 9, // Last question
      difficulties: { add: 0 },
      answers: Array.from({ length: 9 }, () => ({ isCorrect: true, selectedAnswer: 8 }))
        .concat([null]), // 9 answered, 1 remaining
    }
    sessionStorage.setItem('currentSession', JSON.stringify(mockSession))

    renderWithRouter(['/session'])

    await waitFor(() => {
      expect(screen.getByText(/Question 10 of 10/)).toBeInTheDocument()
    })

    // Answer last question
    const currentQuestion = mockQuestions[9]
    const choiceButtons = screen.getAllByText(new RegExp(`${currentQuestion.choices[0]}`))
    const choiceButton = choiceButtons.find(btn => btn.tagName === 'BUTTON')
    if (choiceButton) {
      fireEvent.click(choiceButton)
    }
    
    await waitFor(() => {
      const flipButton = screen.getByText('Flip Card')
      expect(flipButton).not.toBeDisabled()
      fireEvent.click(flipButton)
    })
    
    await waitFor(() => {
      const rightButton = screen.getByText('I got it right!')
      fireEvent.click(rightButton)
    })

    // Should navigate to summary
    await waitFor(() => {
      expect(screen.getByText('Session Complete!')).toBeInTheDocument()
    }, { timeout: 3000 })

    // Verify stats were saved
    const stats = JSON.parse(localStorage.getItem('sessionStats.v1') || '[]')
    expect(stats.length).toBeGreaterThan(0)
  })
})

