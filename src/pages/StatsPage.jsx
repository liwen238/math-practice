import { useState, useEffect } from 'react'
import { loadAllSessionStats, loadLastSessionStats, calculateOverallStats, clearAllSessionStats } from '../utils/stats'
import './StatsPage.css'

function StatsPage() {
  const [allSessions, setAllSessions] = useState([])
  const [overallStats, setOverallStats] = useState(null)
  const [lastSession, setLastSession] = useState(null)
  const [showHistory, setShowHistory] = useState(false)

  useEffect(() => {
    const sessions = loadAllSessionStats()
    const last = loadLastSessionStats()
    const overall = calculateOverallStats(sessions)
    
    setAllSessions(sessions)
    setLastSession(last)
    setOverallStats(overall)
  }, [])

  const handleClearStats = () => {
    if (window.confirm('Are you sure you want to clear all session statistics? This cannot be undone.')) {
      clearAllSessionStats()
      setAllSessions([])
      setLastSession(null)
      setOverallStats(calculateOverallStats([]))
    }
  }

  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleString()
  }

  const formatDateShort = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  if (allSessions.length === 0) {
    return (
      <div className="stats-page">
        <h1>Statistics</h1>
        <div className="stats-layout">
          <div className="stats-section">
            <h2>No Sessions Yet</h2>
            <div className="stats-placeholder">
              <p>No session data available yet.</p>
              <p>Complete a practice session to see statistics here.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="stats-page">
      <h1>Statistics</h1>
      
      <div className="stats-layout">
        {/* Overall Statistics */}
        {overallStats && overallStats.totalSessions > 0 && (
          <div className="stats-section overall-stats">
            <h2>Overall Statistics</h2>
            <div className="stats-display">
              <div className="stat-row">
                <span className="stat-label">Total Sessions:</span>
                <span className="stat-value">{overallStats.totalSessions}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Total Correct:</span>
                <span className="stat-value correct">{overallStats.totalCorrect}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Total Incorrect:</span>
                <span className="stat-value incorrect">{overallStats.totalIncorrect}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Total Attempted:</span>
                <span className="stat-value">{overallStats.totalAttempted}</span>
              </div>
              <div className="stat-row highlight">
                <span className="stat-label">Overall Accuracy:</span>
                <span className="stat-value">{overallStats.overallAccuracy}%</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Average Accuracy:</span>
                <span className="stat-value">{overallStats.averageAccuracy}%</span>
              </div>
            </div>
          </div>
        )}

        {/* Last Session */}
        {lastSession && (
          <div className="stats-section">
            <h2>Last Session</h2>
            {lastSession.timestamp && (
              <p className="stats-timestamp">Completed: {formatDate(lastSession.timestamp)}</p>
            )}
            <div className="stats-display">
              <div className="stat-row">
                <span className="stat-label">Correct:</span>
                <span className="stat-value correct">{lastSession.correct}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Incorrect:</span>
                <span className="stat-value incorrect">{lastSession.incorrect}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Accuracy:</span>
                <span className="stat-value">{lastSession.accuracy}%</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Attempted:</span>
                <span className="stat-value">{lastSession.attempted}</span>
              </div>
            </div>
          </div>
        )}

        {/* Session History */}
        {allSessions.length > 1 && (
          <div className="stats-section">
            <div className="section-header">
              <h2>Session History ({allSessions.length} sessions)</h2>
              <button
                className="toggle-history-button"
                onClick={() => setShowHistory(!showHistory)}
              >
                {showHistory ? 'Hide' : 'Show'} History
              </button>
            </div>
            {showHistory && (
              <div className="session-history">
                {allSessions.slice().reverse().map((session, reversedIndex) => {
                  // Always include index in key to guarantee uniqueness, even if sessionId or timestamp are duplicated
                  const uniqueKey = `${session.sessionId || session.timestamp || 'session'}-${reversedIndex}`
                  return (
                    <div key={uniqueKey} className="session-item">
                      <div className="session-header">
                        <span className="session-date">{formatDateShort(session.timestamp)}</span>
                        <span className="session-accuracy">{session.accuracy}%</span>
                      </div>
                      <div className="session-details">
                        <span className="session-stat correct">{session.correct} correct</span>
                        <span className="session-stat incorrect">{session.incorrect} incorrect</span>
                        <span className="session-stat">{session.attempted} total</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Clear Stats Button */}
        <div className="clear-stats-section">
          <button
            className="clear-stats-button"
            onClick={handleClearStats}
          >
            Clear All Statistics
          </button>
        </div>
      </div>
    </div>
  )
}

export default StatsPage

