import { useState } from 'react'
import './SessionPage.css'

function SessionPage() {
  const [currentQuestion, setCurrentQuestion] = useState(1)
  const [isFlipped, setIsFlipped] = useState(false)

  const handleFlip = () => {
    setIsFlipped(true)
  }

  const handleChoiceClick = (choice) => {
    // Logic will be added in Phase 3
    console.log('Choice clicked:', choice)
  }

  return (
    <div className="session-page">
      <div className="progress-header">
        <h2>Question {currentQuestion} of 10</h2>
      </div>

      <div className="card-container">
        <div className={`question-card ${isFlipped ? 'flipped' : ''}`}>
          <div className="card-front">
            <div className="question-text">
              <p>What is 5 + 3?</p>
            </div>
            <div className="choices-list">
              <button
                className="choice-button"
                onClick={() => handleChoiceClick('A')}
                disabled={isFlipped}
              >
                A) 6
              </button>
              <button
                className="choice-button"
                onClick={() => handleChoiceClick('B')}
                disabled={isFlipped}
              >
                B) 7
              </button>
              <button
                className="choice-button"
                onClick={() => handleChoiceClick('C')}
                disabled={isFlipped}
              >
                C) 8
              </button>
              <button
                className="choice-button"
                onClick={() => handleChoiceClick('D')}
                disabled={isFlipped}
              >
                D) 9
              </button>
            </div>
            <button
              className="flip-button"
              onClick={handleFlip}
              disabled={isFlipped}
            >
              Flip Card
            </button>
          </div>
          <div className="card-back">
            <div className="answer-text">
              <p className="answer-label">Correct Answer:</p>
              <p className="answer-value">8</p>
            </div>
            <div className="self-report-buttons">
              <button className="report-button correct">I got it right!</button>
              <button className="report-button incorrect">I got it wrong</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SessionPage

