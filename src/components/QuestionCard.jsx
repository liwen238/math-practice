import './QuestionCard.css'

function QuestionCard({
  question,
  selectedAnswer,
  isFlipped,
  onChoiceClick,
  onFlip,
  onSelfReport,
  getOperationSymbol,
}) {
  const questionText = `What is ${question.operand1} ${getOperationSymbol(question.operation)} ${question.operand2}?`

  const handleCardClick = () => {
    if (!isFlipped && selectedAnswer !== null) {
      onFlip()
    }
  }

  return (
    <div 
      className={`question-card ${isFlipped ? 'flipped' : ''}`}
      onClick={handleCardClick}
    >
      <div className="card-front">
        <div className="question-text">
          <p>{questionText}</p>
        </div>
        <div className="choices-list" onClick={(e) => e.stopPropagation()}>
          {question.choices.map((choice, index) => {
            const choiceLabel = String.fromCharCode(65 + index) // A, B, C, D
            const isSelected = selectedAnswer === choice
            return (
              <button
                key={index}
                className={`choice-button ${isSelected ? 'selected' : ''}`}
                onClick={() => onChoiceClick(choice)}
                disabled={isFlipped}
              >
                {choiceLabel}) {choice}
              </button>
            )
          })}
        </div>
        <div onClick={(e) => e.stopPropagation()}>
          <button
            className="flip-button"
            onClick={onFlip}
            disabled={isFlipped || selectedAnswer === null}
          >
            Flip Card
          </button>
        </div>
      </div>
      <div className="card-back">
        <div className="answer-text">
          <p className="answer-label">Correct Answer:</p>
          <p className="answer-value">{question.correctAnswer}</p>
        </div>
        <div className="self-report-buttons">
          <button
            className="report-button correct"
            onClick={() => onSelfReport(true)}
          >
            I got it right!
          </button>
          <button
            className="report-button incorrect"
            onClick={() => onSelfReport(false)}
          >
            I got it wrong
          </button>
        </div>
      </div>
    </div>
  )
}

export default QuestionCard

