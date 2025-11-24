import { useNavigate } from 'react-router-dom'
import './SummaryPage.css'

function SummaryPage() {
  const navigate = useNavigate()

  const handleStartNewSession = () => {
    navigate('/')
  }

  return (
    <div className="summary-page">
      <h1>Session Complete!</h1>
      
      <div className="stats-container">
        <div className="stat-item">
          <div className="stat-label">Correct</div>
          <div className="stat-value correct">--</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Incorrect</div>
          <div className="stat-value incorrect">--</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Accuracy</div>
          <div className="stat-value">--%</div>
        </div>
      </div>

      <button
        className="new-session-button"
        onClick={handleStartNewSession}
      >
        Start New Session
      </button>
    </div>
  )
}

export default SummaryPage

