import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import QuestionCard from './QuestionCard'

describe('QuestionCard Component', () => {
  const mockQuestion = {
    id: 'test1',
    level: 1,
    operation: 'add',
    operand1: 5,
    operand2: 3,
    correctAnswer: 8,
    choices: [6, 7, 8, 9],
  }

  const mockGetOperationSymbol = (op) => {
    const symbols = { add: '+', subtract: '−', multiply: '×', divide: '÷' }
    return symbols[op] || op
  }

  const defaultProps = {
    question: mockQuestion,
    selectedAnswer: null,
    isFlipped: false,
    onChoiceClick: vi.fn(),
    onFlip: vi.fn(),
    onSelfReport: vi.fn(),
    getOperationSymbol: mockGetOperationSymbol,
  }

  it('should render question text correctly', () => {
    render(<QuestionCard {...defaultProps} />)
    expect(screen.getByText(/What is 5 \+ 3\?/)).toBeInTheDocument()
  })

  it('should render all 4 choice buttons', () => {
    render(<QuestionCard {...defaultProps} />)
    expect(screen.getByText('A) 6')).toBeInTheDocument()
    expect(screen.getByText('B) 7')).toBeInTheDocument()
    expect(screen.getByText('C) 8')).toBeInTheDocument()
    expect(screen.getByText('D) 9')).toBeInTheDocument()
  })

  it('should call onChoiceClick when a choice is clicked', () => {
    const onChoiceClick = vi.fn()
    render(<QuestionCard {...defaultProps} onChoiceClick={onChoiceClick} />)
    
    fireEvent.click(screen.getByText('A) 6'))
    expect(onChoiceClick).toHaveBeenCalledWith(6)
  })

  it('should highlight selected answer', () => {
    render(<QuestionCard {...defaultProps} selectedAnswer={8} />)
    const selectedButton = screen.getByText('C) 8')
    expect(selectedButton).toHaveClass('selected')
  })

  it('should disable flip button when no answer is selected', () => {
    render(<QuestionCard {...defaultProps} selectedAnswer={null} />)
    const flipButton = screen.getByText('Flip Card')
    expect(flipButton).toBeDisabled()
  })

  it('should enable flip button when answer is selected', () => {
    render(<QuestionCard {...defaultProps} selectedAnswer={8} />)
    const flipButton = screen.getByText('Flip Card')
    expect(flipButton).not.toBeDisabled()
  })

  it('should call onFlip when flip button is clicked', () => {
    const onFlip = vi.fn()
    render(<QuestionCard {...defaultProps} selectedAnswer={8} onFlip={onFlip} />)
    
    fireEvent.click(screen.getByText('Flip Card'))
    expect(onFlip).toHaveBeenCalled()
  })

  it('should disable choice buttons when flipped', () => {
    render(<QuestionCard {...defaultProps} isFlipped={true} />)
    const choiceButtons = screen.getAllByRole('button').filter(btn => 
      btn.textContent?.match(/^[A-D]\)/)
    )
    choiceButtons.forEach(button => {
      expect(button).toBeDisabled()
    })
  })

  it('should show card back when flipped', () => {
    render(<QuestionCard {...defaultProps} isFlipped={true} />)
    expect(screen.getByText('Correct Answer:')).toBeInTheDocument()
    expect(screen.getByText('8')).toBeInTheDocument()
  })

  it('should show self-report buttons on back of card', () => {
    render(<QuestionCard {...defaultProps} isFlipped={true} />)
    expect(screen.getByText('I got it right!')).toBeInTheDocument()
    expect(screen.getByText('I got it wrong')).toBeInTheDocument()
  })

  it('should call onSelfReport with true when correct button is clicked', () => {
    const onSelfReport = vi.fn()
    render(<QuestionCard {...defaultProps} isFlipped={true} onSelfReport={onSelfReport} />)
    
    fireEvent.click(screen.getByText('I got it right!'))
    expect(onSelfReport).toHaveBeenCalledWith(true)
  })

  it('should call onSelfReport with false when incorrect button is clicked', () => {
    const onSelfReport = vi.fn()
    render(<QuestionCard {...defaultProps} isFlipped={true} onSelfReport={onSelfReport} />)
    
    fireEvent.click(screen.getByText('I got it wrong'))
    expect(onSelfReport).toHaveBeenCalledWith(false)
  })

  it('should flip card when clicked and answer is selected', () => {
    const onFlip = vi.fn()
    render(<QuestionCard {...defaultProps} selectedAnswer={8} onFlip={onFlip} />)
    
    const card = screen.getByText(/What is 5 \+ 3\?/).closest('.question-card')
    fireEvent.click(card)
    expect(onFlip).toHaveBeenCalled()
  })

  it('should not flip card when clicked without answer selected', () => {
    const onFlip = vi.fn()
    render(<QuestionCard {...defaultProps} selectedAnswer={null} onFlip={onFlip} />)
    
    const card = screen.getByText(/What is 5 \+ 3\?/).closest('.question-card')
    fireEvent.click(card)
    expect(onFlip).not.toHaveBeenCalled()
  })

  it('should not call onChoiceClick when card is flipped', () => {
    const onChoiceClick = vi.fn()
    render(<QuestionCard {...defaultProps} isFlipped={true} onChoiceClick={onChoiceClick} />)
    
    // Try to click a choice (should be disabled, but if somehow clicked, shouldn't call handler)
    const choiceButton = screen.queryByText('A) 6')
    if (choiceButton && !choiceButton.disabled) {
      fireEvent.click(choiceButton)
      expect(onChoiceClick).not.toHaveBeenCalled()
    }
  })

  it('should render different operations correctly', () => {
    const subtractQuestion = {
      ...mockQuestion,
      operation: 'subtract',
      operand1: 10,
      operand2: 4,
      correctAnswer: 6,
    }
    
    render(<QuestionCard {...defaultProps} question={subtractQuestion} />)
    expect(screen.getByText(/What is 10 − 4\?/)).toBeInTheDocument()
  })
})

