import { useState } from 'react'
import './SetupPage.css'

function SetupPage() {
  const [selectedLevel, setSelectedLevel] = useState(null)
  const [selectedOperations, setSelectedOperations] = useState({
    add: false,
    subtract: false,
    multiply: false,
    divide: false,
  })

  const handleLevelChange = (level) => {
    setSelectedLevel(level)
  }

  const handleOperationToggle = (operation) => {
    setSelectedOperations(prev => ({
      ...prev,
      [operation]: !prev[operation]
    }))
  }

  const handleStartSession = () => {
    // Logic will be added in Phase 3
    console.log('Start session clicked')
  }

  return (
    <div className="setup-page">
      <h1>Math Practice Cards</h1>
      <p className="subtitle">Choose your level and operations</p>

      <div className="setup-section">
        <h2>Age Level</h2>
        <div className="level-selector">
          <button
            className={`level-button ${selectedLevel === '7-8' ? 'active' : ''}`}
            onClick={() => handleLevelChange('7-8')}
          >
            7-8
          </button>
          <button
            className={`level-button ${selectedLevel === '9-10' ? 'active' : ''}`}
            onClick={() => handleLevelChange('9-10')}
          >
            9-10
          </button>
          <button
            className={`level-button ${selectedLevel === '11-12' ? 'active' : ''}`}
            onClick={() => handleLevelChange('11-12')}
          >
            11-12
          </button>
        </div>
      </div>

      <div className="setup-section">
        <h2>Operations</h2>
        <div className="operations-selector">
          <button
            className={`operation-button ${selectedOperations.add ? 'active' : ''}`}
            onClick={() => handleOperationToggle('add')}
          >
            +
          </button>
          <button
            className={`operation-button ${selectedOperations.subtract ? 'active' : ''}`}
            onClick={() => handleOperationToggle('subtract')}
          >
            −
          </button>
          <button
            className={`operation-button ${selectedOperations.multiply ? 'active' : ''}`}
            onClick={() => handleOperationToggle('multiply')}
          >
            ×
          </button>
          <button
            className={`operation-button ${selectedOperations.divide ? 'active' : ''}`}
            onClick={() => handleOperationToggle('divide')}
          >
            ÷
          </button>
        </div>
      </div>

      <button
        className="start-session-button"
        onClick={handleStartSession}
      >
        Start Session
      </button>
    </div>
  )
}

export default SetupPage

