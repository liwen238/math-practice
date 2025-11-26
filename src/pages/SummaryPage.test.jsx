import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import SummaryPage from './SummaryPage'

// Mock useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

const renderSummaryPage = () => {
  return render(
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <SummaryPage />
    </BrowserRouter>
  )
}

describe('SummaryPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    sessionStorage.clear()
  })

  it('should show loading state when no session data', () => {
    renderSummaryPage()
    expect(screen.getByText('Session Complete!')).toBeInTheDocument()
    expect(screen.getByText('Loading statistics...')).toBeInTheDocument()
  })

  it('should display session statistics', async () => {
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
    
    renderSummaryPage()
    
    await waitFor(() => {
      expect(screen.getByText('8')).toBeInTheDocument() // Correct count
      expect(screen.getByText('2')).toBeInTheDocument() // Incorrect count
    })
  })

  it('should calculate and display accuracy', async () => {
    const mockSession = {
      answers: [
        { isCorrect: true },
        { isCorrect: true },
        { isCorrect: false },
        { isCorrect: true },
      ],
    }
    sessionStorage.setItem('currentSession', JSON.stringify(mockSession))
    
    renderSummaryPage()
    
    await waitFor(() => {
      expect(screen.getByText('75%')).toBeInTheDocument() // 3/4 = 75%
    })
  })

  it('should navigate to home when Start New Session is clicked', async () => {
    const mockSession = {
      answers: [{ isCorrect: true }],
    }
    sessionStorage.setItem('currentSession', JSON.stringify(mockSession))
    
    renderSummaryPage()
    
    await waitFor(() => {
      expect(screen.getByText('Start New Session')).toBeInTheDocument()
    })
    
    fireEvent.click(screen.getByText('Start New Session'))
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/')
      expect(sessionStorage.getItem('currentSession')).toBeNull()
    })
  })

  it('should navigate to stats when View All Statistics is clicked', async () => {
    const mockSession = {
      answers: [{ isCorrect: true }],
    }
    sessionStorage.setItem('currentSession', JSON.stringify(mockSession))
    
    renderSummaryPage()
    
    await waitFor(() => {
      expect(screen.getByText('View All Statistics')).toBeInTheDocument()
    })
    
    fireEvent.click(screen.getByText('View All Statistics'))
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/stats')
    })
  })

  it('should display correct stat values', async () => {
    const mockSession = {
      answers: [
        { isCorrect: true },
        { isCorrect: true },
        { isCorrect: false },
      ],
    }
    sessionStorage.setItem('currentSession', JSON.stringify(mockSession))
    
    renderSummaryPage()
    
    await waitFor(() => {
      const correctValue = screen.getByText('2').closest('.stat-value.correct')
      const incorrectValue = screen.getByText('1').closest('.stat-value.incorrect')
      expect(correctValue).toBeInTheDocument()
      expect(incorrectValue).toBeInTheDocument()
    })
  })
})

