import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import QuestionCard from '../components/QuestionCard'
import { saveLastSessionStats, calculateSessionStats } from '../utils/stats'
import { upsertWrongQuestion } from '../utils/wrongQuestions'
import { updateDifficulty } from '../utils/difficulty'
import { generateAdaptiveQuestion, generateQuestion } from '../utils/questionGenerator'
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
      alert('Please select an answer before flipping the card.')
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

    // Record the answer (use actual correctness for statistics)
    const updatedAnswers = [...(session.answers || [])]
    updatedAnswers[session.currentQuestionIndex] = {
      selectedAnswer,
      isCorrect: actuallyCorrect, // Use actual correctness, not self-report
      selfReported: isCorrect, // Store what user reported for reference
      questionId: currentQuestion.id,
    }

    // Update difficulty for this operation (use actual correctness)
    const updatedDifficulties = updateDifficulty(
      session.difficulties || {},
      currentQuestion.operation,
      actuallyCorrect
    )

    // If the answer is actually wrong, save to wrong questions persistence
    if (!actuallyCorrect) {
      upsertWrongQuestion(currentQuestion)
    }

    // Update session
    const updatedSession = {
      ...session,
      answers: updatedAnswers,
      difficulties: updatedDifficulties,
    }

    // Check if this is the last question
    if (session.currentQuestionIndex >= 9) {
      // Calculate and save statistics
      const stats = calculateSessionStats(updatedAnswers)
      saveLastSessionStats(stats)
      
      // Save session to sessionStorage for summary page
      sessionStorage.setItem('currentSession', JSON.stringify(updatedSession))
      navigate('/summary')
      return
    }

    // Generate next question with adaptive difficulty
    const nextQuestionIndex = session.currentQuestionIndex + 1
    
    // Generate the next question using updated difficulty scores
    const nextQuestion = generateAdaptiveQuestion(
      session.level,
      session.operations,
      updatedDifficulties,
      updatedSession.questions,
      `q${nextQuestionIndex + 1}`
    )
    
    if (nextQuestion) {
      updatedSession.questions[nextQuestionIndex] = nextQuestion
    } else {
      // Fallback: generate a question if adaptive generation fails
      const nextOperation = session.operations[Math.floor(Math.random() * session.operations.length)]
      const nextDifficulty = updatedDifficulties[nextOperation] || 0
      const fallbackQuestion = generateQuestion(
        session.level,
        nextOperation,
        `q${nextQuestionIndex + 1}`,
        nextDifficulty
      )
      updatedSession.questions[nextQuestionIndex] = fallbackQuestion
    }

    // Reset for next question FIRST to ensure card starts unflipped
    setIsFlipped(false)
    setSelectedAnswer(null)
    
    // Move to next question
    updatedSession.currentQuestionIndex = nextQuestionIndex
    setSession(updatedSession)
    sessionStorage.setItem('currentSession', JSON.stringify(updatedSession))
  }

  return (
    <div className="session-page">
      <div className="progress-header">
        <h2>Question {questionNumber} of 10</h2>
      </div>

      <div className="card-container">
        <QuestionCard
          key={currentQuestion.id}
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

