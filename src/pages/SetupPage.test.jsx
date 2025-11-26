import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import SetupPage from './SetupPage'

// Mock the question generator
vi.mock('../utils/questionGenerator', () => ({
  generateAdaptiveQuestion: vi.fn(() => ({
    id: 'q1',
    level: 1,
    operation: 'add',
    operand1: 5,
    operand2: 3,
    correctAnswer: 8,
    choices: [6, 7, 8, 9],
  })),
  generateQuestion: vi.fn(() => ({
    id: 'q1',
    level: 1,
    operation: 'add',
    operand1: 5,
    operand2: 3,
    correctAnswer: 8,
    choices: [6, 7, 8, 9],
  })),
}))

// Mock useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

const renderSetupPage = () => {
  return render(
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <SetupPage />
    </BrowserRouter>
  )
}

describe('SetupPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    global.window.alert = vi.fn()
  })

  it('should render the page title', () => {
    renderSetupPage()
    expect(screen.getByText('Math Practice Cards')).toBeInTheDocument()
  })

  it('should render all age level buttons', () => {
    renderSetupPage()
    expect(screen.getByText('7-8')).toBeInTheDocument()
    expect(screen.getByText('9-10')).toBeInTheDocument()
    expect(screen.getByText('11-12')).toBeInTheDocument()
  })

  it('should render all operation buttons', () => {
    renderSetupPage()
    expect(screen.getByText('+')).toBeInTheDocument()
    expect(screen.getByText('−')).toBeInTheDocument()
    expect(screen.getByText('×')).toBeInTheDocument()
    expect(screen.getByText('÷')).toBeInTheDocument()
  })

  it('should highlight selected level', () => {
    renderSetupPage()
    const levelButton = screen.getByText('7-8')
    fireEvent.click(levelButton)
    expect(levelButton).toHaveClass('active')
  })

  it('should highlight selected operation', () => {
    renderSetupPage()
    const addButton = screen.getByText('+')
    fireEvent.click(addButton)
    expect(addButton).toHaveClass('active')
  })

  it('should disable start button when no level is selected', () => {
    renderSetupPage()
    const startButton = screen.getByText('Start Session')
    expect(startButton).toBeDisabled()
  })

  it('should disable start button when no operations are selected', () => {
    renderSetupPage()
    const levelButton = screen.getByText('7-8')
    fireEvent.click(levelButton)
    
    const startButton = screen.getByText('Start Session')
    expect(startButton).toBeDisabled()
  })

  it('should enable start button when level and operation are selected', () => {
    renderSetupPage()
    fireEvent.click(screen.getByText('7-8'))
    fireEvent.click(screen.getByText('+'))
    
    const startButton = screen.getByText('Start Session')
    expect(startButton).not.toBeDisabled()
  })

  it('should disable start button when no level is selected (prevents click)', () => {
    renderSetupPage()
    fireEvent.click(screen.getByText('+'))
    const startButton = screen.getByText('Start Session')
    
    // Button should be disabled, so clicking won't trigger handler
    expect(startButton).toBeDisabled()
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('should disable start button when no operations are selected (prevents click)', () => {
    renderSetupPage()
    fireEvent.click(screen.getByText('7-8'))
    const startButton = screen.getByText('Start Session')
    
    // Button should be disabled, so clicking won't trigger handler
    expect(startButton).toBeDisabled()
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('should navigate to session page when valid selections are made', async () => {
    renderSetupPage()
    fireEvent.click(screen.getByText('7-8'))
    fireEvent.click(screen.getByText('+'))
    fireEvent.click(screen.getByText('Start Session'))
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/session')
    })
  })

  it('should allow multiple operations to be selected', () => {
    renderSetupPage()
    fireEvent.click(screen.getByText('+'))
    fireEvent.click(screen.getByText('−'))
    
    expect(screen.getByText('+')).toHaveClass('active')
    expect(screen.getByText('−')).toHaveClass('active')
  })

  it('should toggle operations on and off', () => {
    renderSetupPage()
    const addButton = screen.getByText('+')
    
    fireEvent.click(addButton)
    expect(addButton).toHaveClass('active')
    
    fireEvent.click(addButton)
    expect(addButton).not.toHaveClass('active')
  })

  it('should save session to sessionStorage when starting', async () => {
    renderSetupPage()
    fireEvent.click(screen.getByText('9-10'))
    fireEvent.click(screen.getByText('×'))
    fireEvent.click(screen.getByText('Start Session'))
    
    await waitFor(() => {
      const sessionData = sessionStorage.getItem('currentSession')
      expect(sessionData).not.toBeNull()
      const session = JSON.parse(sessionData)
      expect(session.level).toBe(2)
      expect(session.operations).toContain('multiply')
    })
  })
})

