import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import QuestionCard from '../components/QuestionCard'
import { saveLastSessionStats, calculateSessionStats } from '../utils/stats'
import { upsertWrongQuestion } from '../utils/wrongQuestions'
import { updateDifficulty } from '../utils/difficulty'
import { generateAdaptiveQuestion, generateQuestion } from '../utils/questionGenerator'
import { getOperationSymbol } from '../utils/operationSymbols'
import { triggerConfetti } from '../utils/confetti'
import { validateSelfReport } from '../utils/answerValidation'
import { QUESTIONS_PER_SESSION, LAST_QUESTION_INDEX, SESSION_STORAGE_KEY } from '../utils/constants'
import './SessionPage.css'

/**
 * SessionPage Component
 * Main practice session page where users answer questions
 * Handles question progression, answer validation, difficulty adjustment, and session completion
 */
function SessionPage() {
  const navigate = useNavigate()
  const [session, setSession] = useState(null)
  const [isFlipped, setIsFlipped] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState(null)

  useEffect(() => {
    // Load session from sessionStorage on mount
    // If no session exists, redirect to setup page
    const sessionData = sessionStorage.getItem(SESSION_STORAGE_KEY)
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

  /**
   * Handle user's self-report of answer correctness
   * Validates the report against actual answer, updates difficulty, saves wrong questions,
   * and either moves to next question or completes the session
   * 
   * @param {boolean} isCorrect - User's self-reported correctness
   */
  const handleSelfReport = (isCorrect) => {
    // Determine actual correctness based on selected answer
    const actuallyCorrect = selectedAnswer === currentQuestion.correctAnswer
    
    // Validate self-report and show warnings if there's a mismatch
    // Returns false if user cancels after seeing warning
    if (!validateSelfReport(isCorrect, actuallyCorrect, selectedAnswer, currentQuestion.correctAnswer)) {
      return // User cancelled after seeing warning
    }
    
    // Trigger confetti animation when user correctly reports a correct answer
    if (isCorrect && actuallyCorrect) {
      triggerConfetti()
    }

    // Record the answer (use actual correctness for statistics, not self-report)
    const updatedAnswers = [...(session.answers || [])]
    updatedAnswers[session.currentQuestionIndex] = {
      selectedAnswer,
      isCorrect: actuallyCorrect, // Use actual correctness for statistics
      selfReported: isCorrect, // Store what user reported for reference
      questionId: currentQuestion.id,
    }

    // Update difficulty for this operation based on actual correctness
    // This ensures adaptive difficulty reflects true performance
    const updatedDifficulties = updateDifficulty(
      session.difficulties || {},
      currentQuestion.operation,
      actuallyCorrect
    )

    // If the answer is actually wrong, save to wrong questions for review
    if (!actuallyCorrect) {
      upsertWrongQuestion(currentQuestion)
    }

    // Update session with new answers and difficulties
    const updatedSession = {
      ...session,
      answers: updatedAnswers,
      difficulties: updatedDifficulties,
    }

    // Check if this is the last question - if so, complete the session
    if (session.currentQuestionIndex >= LAST_QUESTION_INDEX) {
      // Calculate and save statistics
      const stats = calculateSessionStats(updatedAnswers)
      saveLastSessionStats(stats)
      
      // Save session to sessionStorage for summary page
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(updatedSession))
      navigate('/summary')
      return
    }

    // Generate next question with adaptive difficulty based on updated scores
    const nextQuestionIndex = session.currentQuestionIndex + 1
    const nextQuestion = generateNextQuestion(
      session.level,
      session.operations,
      updatedDifficulties,
      updatedSession.questions,
      nextQuestionIndex
    )
    
    if (nextQuestion) {
      updatedSession.questions[nextQuestionIndex] = nextQuestion
    }

    // Reset card state for next question (must happen before updating session)
    setIsFlipped(false)
    setSelectedAnswer(null)
    
    // Move to next question
    updatedSession.currentQuestionIndex = nextQuestionIndex
    setSession(updatedSession)
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(updatedSession))
  }

  /**
   * Generate the next question for the session
   * Attempts adaptive generation first, falls back to simple generation if needed
   */
  const generateNextQuestion = (level, operations, difficulties, existingQuestions, questionIndex) => {
    const questionId = `q${questionIndex + 1}`
    
    // Try adaptive generation first
    const adaptiveQuestion = generateAdaptiveQuestion(
      level,
      operations,
      difficulties,
      existingQuestions,
      questionId
    )
    
    if (adaptiveQuestion) {
      return adaptiveQuestion
    }
    
    // Fallback: generate a question if adaptive generation fails
    const nextOperation = operations[Math.floor(Math.random() * operations.length)]
    const nextDifficulty = difficulties[nextOperation] || 0
    return generateQuestion(level, nextOperation, questionId, nextDifficulty)
  }

  return (
    <div className="session-page">
      <div className="progress-header">
        <h2>Question {questionNumber} of {QUESTIONS_PER_SESSION}</h2>
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

