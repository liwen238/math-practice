import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { generateAdaptiveQuestion, generateQuestion } from '../utils/questionGenerator'
import { initializeDifficulties } from '../utils/difficulty'
import { LEVEL_MAP, OPERATIONS, QUESTIONS_PER_SESSION, SESSION_STORAGE_KEY } from '../utils/constants'
import './SetupPage.css'

/**
 * SetupPage Component
 * Initial page where users select age level and operations for their practice session
 * Validates selections and creates a new session with the first question
 */
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
    // Validate level selection
    if (!selectedLevel) {
      alert('Please select an age level to continue.')
      return
    }

    // Convert level string to numeric level
    const level = LEVEL_MAP[selectedLevel]
    if (!level) {
      alert('Invalid level selected.')
      return
    }

    // Convert operation toggles to array of operation names
    const operations = convertOperationsToArray(selectedOperations)

    // Guardrail: Ensure at least one operation is selected
    if (operations.length === 0) {
      alert('Please select at least one operation (+, −, ×, or ÷) to start a practice session.')
      return
    }

    // Initialize session with first question
    const session = createNewSession(level, operations)

    // Store session in sessionStorage (temporary, for current session)
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session))

    // Navigate to session page
    navigate('/session')
  }

  /**
   * Convert operation toggle state to array of operation names
   * @param {Object} selectedOperations - Object with boolean flags for each operation
   * @returns {string[]} Array of selected operation names
   */
  const convertOperationsToArray = (selectedOperations) => {
    const operations = []
    if (selectedOperations.add) operations.push(OPERATIONS.ADD)
    if (selectedOperations.subtract) operations.push(OPERATIONS.SUBTRACT)
    if (selectedOperations.multiply) operations.push(OPERATIONS.MULTIPLY)
    if (selectedOperations.divide) operations.push(OPERATIONS.DIVIDE)
    return operations
  }

  /**
   * Create a new session object with initial question
   * @param {number} level - Numeric level (1, 2, or 3)
   * @param {string[]} operations - Array of operation names
   * @returns {Object} Session object
   */
  const createNewSession = (level, operations) => {
    // Initialize difficulty scores for selected operations
    const initialDifficulties = initializeDifficulties(operations)
    
    // Generate first question (difficulty starts at 0)
    const firstQuestion = generateAdaptiveQuestion(
      level,
      operations,
      initialDifficulties,
      [],
      'q1'
    ) || generateQuestion(level, operations[0], 'q1', 0)

    return {
      sessionId: `session-${Date.now()}`,
      level,
      operations,
      questions: [firstQuestion], // Start with just the first question
      currentQuestionIndex: 0,
      difficulties: initialDifficulties, // Difficulty per operation
      answers: new Array(QUESTIONS_PER_SESSION).fill(null), // Track answers for each question
    }
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

      <div className="setup-actions">
        <button
          className={`start-session-button ${!selectedLevel || Object.values(selectedOperations).every(v => !v) ? 'disabled' : ''}`}
          onClick={handleStartSession}
          disabled={!selectedLevel || Object.values(selectedOperations).every(v => !v)}
        >
          Start Session
        </button>
      </div>
    </div>
  )
}

export default SetupPage

