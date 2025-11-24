import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { generateSessionQuestions } from '../utils/questionGenerator'
import './SetupPage.css'

function SetupPage() {
  const navigate = useNavigate()
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
    // Validate selections
    if (!selectedLevel) {
      alert('Please select an age level')
      return
    }

    // Convert level string to number
    const levelMap = {
      '7-8': 1,
      '9-10': 2,
      '11-12': 3,
    }
    const level = levelMap[selectedLevel]

    // Convert operation toggles to array
    const operations = []
    if (selectedOperations.add) operations.push('add')
    if (selectedOperations.subtract) operations.push('subtract')
    if (selectedOperations.multiply) operations.push('multiply')
    if (selectedOperations.divide) operations.push('divide')

    if (operations.length === 0) {
      alert('Please select at least one operation')
      return
    }

    // Generate questions
    const questions = generateSessionQuestions(level, operations)

    // Create session object
    const session = {
      sessionId: `session-${Date.now()}`,
      level,
      operations,
      questions,
      currentQuestionIndex: 0,
      difficulty: 0,
      answers: new Array(10).fill(null), // Track answers for each question
    }

    // Store session in sessionStorage (temporary, for current session)
    sessionStorage.setItem('currentSession', JSON.stringify(session))

    // Navigate to session page
    navigate('/session')
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

