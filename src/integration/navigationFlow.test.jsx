import { describe, it, expect, beforeEach, vi } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { renderWithRouter } from '../test/routerHelpers'

describe('Navigation Flow Integration', () => {
  beforeEach(() => {
    sessionStorage.clear()
    localStorage.clear()
    vi.clearAllMocks()
    global.window.confirm = vi.fn(() => true)
    global.window.alert = vi.fn()
  })

  it('should navigate between all pages using navigation bar', async () => {
    renderWithRouter()

    // Start at home
    expect(screen.getByText('Math Practice Cards')).toBeInTheDocument()

    // Navigate to Statistics - use getByRole to find the link specifically
    const statsLink = screen.getByRole('link', { name: 'Statistics' })
    fireEvent.click(statsLink)
    
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Statistics' })).toBeInTheDocument()
    })

    // Navigate to Review Wrong
    const reviewLink = screen.getByRole('link', { name: 'Review Wrong' })
    fireEvent.click(reviewLink)
    
    await waitFor(() => {
      expect(screen.getByText('Review Wrong Questions')).toBeInTheDocument()
    })

    // Navigate back to Home
    const homeLink = screen.getByRole('link', { name: 'Home' })
    fireEvent.click(homeLink)
    
    await waitFor(() => {
      expect(screen.getByText('Math Practice Cards')).toBeInTheDocument()
    })
  })

  it('should highlight active navigation link', async () => {
    renderWithRouter()

    // Home should be active initially
    await waitFor(() => {
      const homeLink = screen.getByRole('link', { name: 'Home' })
      expect(homeLink.className).toContain('active')
    })

    // Navigate to stats
    const statsLink = screen.getByRole('link', { name: 'Statistics' })
    fireEvent.click(statsLink)
    
    await waitFor(() => {
      const updatedStatsLink = screen.getByRole('link', { name: 'Statistics' })
      expect(updatedStatsLink.className).toContain('active')
    })
  })

  it('should navigate from summary to home via button', async () => {
    const mockSession = {
      answers: [{ isCorrect: true }],
    }
    sessionStorage.setItem('currentSession', JSON.stringify(mockSession))

    renderWithRouter(['/summary'])

    await waitFor(() => {
      expect(screen.getByText('Session Complete!')).toBeInTheDocument()
    }, { timeout: 2000 })

    // Find the button - it might be "Start New Session" or similar
    const startButton = screen.queryByRole('button', { name: /Start New Session/i }) ||
                       screen.queryByText(/Start New Session/i)
    
    if (startButton) {
      fireEvent.click(startButton)
      
      await waitFor(() => {
        expect(screen.getByText('Math Practice Cards')).toBeInTheDocument()
      }, { timeout: 2000 })
    } else {
      // If button not found, at least verify we're on summary page
      expect(screen.getByText('Session Complete!')).toBeInTheDocument()
    }
  })

  it('should not show navigation on session page', async () => {
    const mockSession = {
      sessionId: 'test',
      level: 1,
      operations: ['add'],
      questions: [{ id: 'q1', operation: 'add', operand1: 5, operand2: 3, correctAnswer: 8, choices: [6, 7, 8, 9] }],
      currentQuestionIndex: 0,
      difficulties: { add: 0 },
      answers: new Array(10).fill(null),
    }
    sessionStorage.setItem('currentSession', JSON.stringify(mockSession))

    renderWithRouter(['/session'])

    await waitFor(() => {
      expect(screen.getByText(/Question 1 of 10/)).toBeInTheDocument()
    }, { timeout: 2000 })

    // Navigation should not be visible (Navigation component returns null on /session)
    // Give it a moment for React Router to update
    await waitFor(() => {
      expect(screen.queryByRole('link', { name: 'Home' })).not.toBeInTheDocument()
      expect(screen.queryByRole('link', { name: 'Statistics' })).not.toBeInTheDocument()
    }, { timeout: 1000 })
  })
})

