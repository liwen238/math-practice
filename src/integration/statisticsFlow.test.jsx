import { describe, it, expect, beforeEach, vi } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { renderWithRouter } from '../test/routerHelpers'
import { saveLastSessionStats } from '../utils/stats'

describe('Statistics Flow Integration', () => {
  beforeEach(() => {
    sessionStorage.clear()
    localStorage.clear()
    vi.clearAllMocks()
    global.window.confirm = vi.fn(() => true)
    global.window.alert = vi.fn()
  })

  it('should display statistics after completing a session', async () => {
    // Setup: Complete a session
    const mockSession = {
      answers: [
        { isCorrect: true },
        { isCorrect: true },
        { isCorrect: false },
        { isCorrect: true },
        { isCorrect: true },
        { isCorrect: false },
        { isCorrect: true },
        { isCorrect: true },
        { isCorrect: true },
        { isCorrect: true },
      ],
    }
    sessionStorage.setItem('currentSession', JSON.stringify(mockSession))

    renderWithRouter(['/summary'])

    // Verify statistics are displayed
    await waitFor(() => {
      expect(screen.getByText('Session Complete!')).toBeInTheDocument()
    }, { timeout: 2000 })
    
    // Check for stat values (they might be in different elements)
    const correctElements = screen.getAllByText('8')
    const incorrectElements = screen.getAllByText('2')
    const accuracyElements = screen.getAllByText('80%')
    expect(correctElements.length).toBeGreaterThan(0)
    expect(incorrectElements.length).toBeGreaterThan(0)
    expect(accuracyElements.length).toBeGreaterThan(0)
  })

  it('should save and display statistics in stats page', async () => {
    // Setup: Save some session statistics
    saveLastSessionStats({
      attempted: 10,
      correct: 7,
      incorrect: 3,
      accuracy: 70,
    })

    renderWithRouter(['/stats'])

    // Verify statistics are displayed
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Statistics' })).toBeInTheDocument()
      expect(screen.getByText('Last Session')).toBeInTheDocument()
    })
    
    // Check for stat values (they might be in different elements)
    const correctElements = screen.getAllByText('7')
    const incorrectElements = screen.getAllByText('3')
    const accuracyElements = screen.getAllByText('70%')
    expect(correctElements.length).toBeGreaterThan(0)
    expect(incorrectElements.length).toBeGreaterThan(0)
    expect(accuracyElements.length).toBeGreaterThan(0)
  })

  it('should show overall statistics from multiple sessions', async () => {
    // Setup: Save multiple session statistics
    saveLastSessionStats({ attempted: 10, correct: 8, incorrect: 2, accuracy: 80 })
    saveLastSessionStats({ attempted: 10, correct: 6, incorrect: 4, accuracy: 60 })
    saveLastSessionStats({ attempted: 10, correct: 9, incorrect: 1, accuracy: 90 })

    renderWithRouter(['/stats'])

    // Verify overall statistics
    await waitFor(() => {
      expect(screen.getByText('Overall Statistics')).toBeInTheDocument()
      expect(screen.getByText('Total Sessions:')).toBeInTheDocument()
    })
    
    // Check for total sessions value
    const sessionElements = screen.getAllByText('3')
    expect(sessionElements.length).toBeGreaterThan(0)
  })

  it('should navigate from summary to stats page', async () => {
    const mockSession = {
      answers: [{ isCorrect: true }],
    }
    sessionStorage.setItem('currentSession', JSON.stringify(mockSession))

    renderWithRouter(['/summary'])

    await waitFor(() => {
      expect(screen.getByText('View All Statistics')).toBeInTheDocument()
    }, { timeout: 2000 })

    const viewStatsButton = screen.getByText('View All Statistics')
    fireEvent.click(viewStatsButton)

    // Should navigate to stats page
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Statistics' })).toBeInTheDocument()
    }, { timeout: 2000 })
  })

  it('should show session history when available', async () => {
    // Setup: Save multiple sessions
    saveLastSessionStats({ attempted: 10, correct: 8, incorrect: 2, accuracy: 80 })
    saveLastSessionStats({ attempted: 10, correct: 6, incorrect: 4, accuracy: 60 })

    renderWithRouter(['/stats'])

    await waitFor(() => {
      expect(screen.getByText(/Session History/)).toBeInTheDocument()
    })

    // Click to show history
    const showHistoryButton = screen.getByText('Show History')
    fireEvent.click(showHistoryButton)

    // Verify history is displayed
    await waitFor(() => {
      expect(screen.getByText(/Session History \(2 sessions\)/)).toBeInTheDocument()
    })
  })

  it('should clear all statistics when clear button is clicked', async () => {
    // Setup: Save some statistics
    saveLastSessionStats({ attempted: 10, correct: 7, incorrect: 3, accuracy: 70 })

    renderWithRouter(['/stats'])

    await waitFor(() => {
      expect(screen.getByText('Clear All Statistics')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Clear All Statistics'))

    // Verify statistics are cleared
    await waitFor(() => {
      expect(screen.getByText('No Sessions Yet')).toBeInTheDocument()
    })

    const stats = JSON.parse(localStorage.getItem('sessionStats.v1') || '[]')
    expect(stats.length).toBe(0)
  })
})

