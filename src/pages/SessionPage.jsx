import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import QuestionCard from '../components/QuestionCard'
import './SessionPage.css'

function SessionPage() {
  const navigate = useNavigate()
  const [session, setSession] = useState(null)
  const [isFlipped, setIsFlipped] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState(null)

  useEffect(() => {
    // Load session from sessionStorage
    const sessionData = sessionStorage.getItem('currentSession')
    if (!sessionData) {
      // No session found, redirect to home
      navigate('/')
      return
    }

    const parsedSession = JSON.parse(sessionData)
    setSession(parsedSession)
  }, [navigate])

  if (!session) {
    return <div>Loading...</div>
  }

  const currentQuestion = session.questions[session.currentQuestionIndex]
  const questionNumber = session.currentQuestionIndex + 1

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
    // Record the answer
    const updatedAnswers = [...(session.answers || [])]
    updatedAnswers[session.currentQuestionIndex] = {
      selectedAnswer,
      isCorrect,
      questionId: currentQuestion.id,
    }

    // Update session
    const updatedSession = {
      ...session,
      answers: updatedAnswers,
    }

    // Check if this is the last question
    if (session.currentQuestionIndex >= 9) {
      // Save session to sessionStorage for summary page
      sessionStorage.setItem('currentSession', JSON.stringify(updatedSession))
      navigate('/summary')
      return
    }

    // Move to next question
    updatedSession.currentQuestionIndex = session.currentQuestionIndex + 1
    setSession(updatedSession)
    sessionStorage.setItem('currentSession', JSON.stringify(updatedSession))
    
    // Reset for next question
    setIsFlipped(false)
    setSelectedAnswer(null)
  }

  return (
    <div className="session-page">
      <div className="progress-header">
        <h2>Question {questionNumber} of 10</h2>
      </div>

      <div className="card-container">
        <QuestionCard
          question={currentQuestion}
          selectedAnswer={selectedAnswer}
          isFlipped={isFlipped}
          onChoiceClick={handleChoiceClick}
          onFlip={handleFlip}
          onSelfReport={handleSelfReport}
          getOperationSymbol={getOperationSymbol}
        />
      </div>
    </div>
  )
}

export default SessionPage

