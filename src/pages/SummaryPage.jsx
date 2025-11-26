import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { calculateSessionStats } from '../utils/stats'
import { SESSION_STORAGE_KEY } from '../utils/constants'
import './SummaryPage.css'

function SummaryPage() {
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)

  useEffect(() => {
    // Load session from sessionStorage and calculate statistics
    const sessionData = sessionStorage.getItem(SESSION_STORAGE_KEY)
    if (sessionData) {
      const session = JSON.parse(sessionData)
      const calculatedStats = calculateSessionStats(session.answers)
      setStats(calculatedStats)
    }
  }, [])

  const handleStartNewSession = () => {
    // Clear session from sessionStorage
    sessionStorage.removeItem(SESSION_STORAGE_KEY)
    navigate('/')
  }

  const handleViewStatistics = () => {
    navigate('/stats')
  }

  if (!stats) {
    return (
      <div className="summary-page">
        <h1>Session Complete!</h1>
        <p>Loading statistics...</p>
      </div>
    )
  }

  return (
    <div className="summary-page">
      <h1>Session Complete!</h1>
      
      <div className="stats-container">
        <div className="stat-item">
          <div className="stat-label">Correct</div>
          <div className="stat-value correct">{stats.correct}</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Incorrect</div>
          <div className="stat-value incorrect">{stats.incorrect}</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Accuracy</div>
          <div className="stat-value">{stats.accuracy}%</div>
        </div>
      </div>

      <div className="summary-actions">
        <button
          className="new-session-button"
          onClick={handleStartNewSession}
        >
          Start New Session
        </button>
        <button
          className="view-stats-button"
          onClick={handleViewStatistics}
        >
          View All Statistics
        </button>
      </div>
    </div>
  )
}

export default SummaryPage

