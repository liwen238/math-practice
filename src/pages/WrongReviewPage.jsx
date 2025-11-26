import { useState, useEffect } from 'react'
import QuestionCard from '../components/QuestionCard'
import { getAllWrongQuestions, removeWrongQuestion, upsertWrongQuestion, clearWrongQuestions } from '../utils/wrongQuestions'
import { generateDistractors } from '../utils/questionGenerator'
import './WrongReviewPage.css'

function WrongReviewPage() {
  const [wrongQuestions, setWrongQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState(null)

  useEffect(() => {
    // Load wrong questions
    const questions = getAllWrongQuestions()
    setWrongQuestions(questions)
  }, [])

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all wrong question history? This cannot be undone.')) {
      clearWrongQuestions()
      setWrongQuestions([])
      setCurrentIndex(0)
      setIsFlipped(false)
      setSelectedAnswer(null)
    }
  }

  if (wrongQuestions.length === 0) {
    return (
      <div className="wrong-review-page">
        <h1>Review Wrong Questions</h1>
        
        <div className="empty-state">
          <p className="empty-message">No wrong questions yet</p>
          <p className="empty-subtitle">Practice some questions to see them here!</p>
        </div>
      </div>
    )
  }

  const currentRecord = wrongQuestions[currentIndex]
  let currentQuestion = currentRecord.question
  
  // Ensure question has choices (regenerate if missing)
  if (!currentQuestion.choices || currentQuestion.choices.length === 0) {
    currentQuestion = {
      ...currentQuestion,
      choices: generateDistractors(currentQuestion.correctAnswer, currentQuestion.level),
    }
  }
  
  const questionNumber = currentIndex + 1
  const totalQuestions = wrongQuestions.length

  const getOperationSymbol = (operation) => {
    switch (operation) {
      case 'add': return '+'
      case 'subtract': return '−'
      case 'multiply': return '×'
      case 'divide': return '÷'
      default: return operation
    }
  }

  const handleChoiceClick = (choiceValue) => {
    if (isFlipped) return
    setSelectedAnswer(choiceValue)
  }

  const handleFlip = () => {
    if (selectedAnswer === null) {
      alert('Please select an answer before flipping the card')
      return
    }
    setIsFlipped(true)
  }

  const handleSelfReport = (isCorrect) => {
    // Check if the selected answer is actually correct
    const actuallyCorrect = selectedAnswer === currentQuestion.correctAnswer
    
    // Warn user if their self-report doesn't match the actual answer
    if (isCorrect && !actuallyCorrect) {
      if (!window.confirm(
        `Warning: You selected ${selectedAnswer}, but the correct answer is ${currentQuestion.correctAnswer}.\n\n` +
        `You marked this as "correct", but it's actually wrong. Do you want to continue?`
      )) {
        return // User cancelled, don't proceed
      }
    } else if (!isCorrect && actuallyCorrect) {
      if (!window.confirm(
        `Warning: You selected ${selectedAnswer}, which is the correct answer!\n\n` +
        `You marked this as "wrong", but it's actually correct. Do you want to continue?`
      )) {
        return // User cancelled, don't proceed
      }
    }

    // Use actual correctness for the logic
    if (actuallyCorrect) {
      // Remove from wrong questions list (they got it right)
      removeWrongQuestion(currentQuestion)
      
      // Update local state
      const updated = wrongQuestions.filter((_, index) => index !== currentIndex)
      setWrongQuestions(updated)
      
      // If this was the last question, show empty state
      if (updated.length === 0) {
        return
      }
      
      // Adjust current index if needed
      if (currentIndex >= updated.length) {
        setCurrentIndex(updated.length - 1)
      }
    } else {
      // Wrong again - update missCount
      upsertWrongQuestion(currentQuestion)
      
      // Update local state to reflect new missCount
      const updated = [...wrongQuestions]
      updated[currentIndex] = {
        ...currentRecord,
        missCount: currentRecord.missCount + 1,
        timestamps: [...currentRecord.timestamps, Date.now()],
      }
      setWrongQuestions(updated)
      
      // Move to next question
      if (currentIndex < wrongQuestions.length - 1) {
        setCurrentIndex(currentIndex + 1)
      } else {
        // If last question, go back to first
        setCurrentIndex(0)
      }
    }
    
    // Reset for next question
    setIsFlipped(false)
    setSelectedAnswer(null)
  }

  const handleNext = () => {
    if (currentIndex < wrongQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setIsFlipped(false)
      setSelectedAnswer(null)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setIsFlipped(false)
      setSelectedAnswer(null)
    }
  }

  return (
    <div className="wrong-review-page">
      <h1>Review Wrong Questions</h1>
      
      <div className="review-header">
        <p className="review-progress">
          Question {questionNumber} of {totalQuestions}
        </p>
        {currentRecord.missCount > 1 && (
          <p className="miss-count">
            Missed {currentRecord.missCount} times
          </p>
        )}
      </div>

      <div className="card-container">
        <QuestionCard
          key={currentQuestion.id || currentIndex}
          question={currentQuestion}
          selectedAnswer={selectedAnswer}
          isFlipped={isFlipped}
          onChoiceClick={handleChoiceClick}
          onFlip={handleFlip}
          onSelfReport={handleSelfReport}
          getOperationSymbol={getOperationSymbol}
        />
      </div>

      {wrongQuestions.length > 1 && (
        <div className="navigation-buttons">
          <button
            className="nav-button"
            onClick={handlePrevious}
            disabled={currentIndex === 0 || isFlipped}
          >
            Previous
          </button>
          <button
            className="nav-button"
            onClick={handleNext}
            disabled={currentIndex === wrongQuestions.length - 1 || isFlipped}
          >
            Next
          </button>
        </div>
      )}

      <div className="clear-history-section">
        <button
          className="clear-history-button"
          onClick={handleClearHistory}
        >
          Clear History
        </button>
      </div>
    </div>
  )
}

export default WrongReviewPage

