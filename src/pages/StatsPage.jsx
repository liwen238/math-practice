import './StatsPage.css'

function StatsPage() {
  return (
    <div className="stats-page">
      <h1>Statistics</h1>
      
      <div className="stats-layout">
        <div className="stats-section">
          <h2>Last Session</h2>
          <div className="stats-placeholder">
            <p>Correct: --</p>
            <p>Incorrect: --</p>
            <p>Accuracy: --%</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatsPage

