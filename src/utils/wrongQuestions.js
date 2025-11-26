/**
 * Wrong questions persistence utilities
 */

const STORAGE_KEY = 'wrongQuestions.v1'

/**
 * Generate a unique key for a question based on its properties
 * @param {Object} question - Question object
 * @returns {string} Unique key for the question
 */
function getQuestionKey(question) {
  return `${question.operation}-${question.operand1}-${question.operand2}`
}

/**
 * Load all wrong questions from localStorage
 * @returns {Object} Object mapping question keys to WrongRecord objects
 */
export function loadWrongQuestions() {
  const data = localStorage.getItem(STORAGE_KEY)
  if (!data) {
    return {}
  }
  try {
    return JSON.parse(data)
  } catch (e) {
    console.error('Error parsing wrong questions:', e)
    return {}
  }
}

/**
 * Save wrong questions to localStorage
 * @param {Object} wrongQuestions - Object mapping question keys to WrongRecord objects
 */
function saveWrongQuestions(wrongQuestions) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(wrongQuestions))
}

/**
 * Add or update a wrong question
 * @param {Object} question - Question object
 * @returns {Object} Updated WrongRecord
 */
export function upsertWrongQuestion(question) {
  const wrongQuestions = loadWrongQuestions()
  const questionKey = getQuestionKey(question)
  
  const existingRecord = wrongQuestions[questionKey]
  
  if (existingRecord) {
    // Update existing record
    existingRecord.missCount += 1
    existingRecord.timestamps.push(Date.now())
    wrongQuestions[questionKey] = existingRecord
  } else {
    // Create new record
    wrongQuestions[questionKey] = {
      questionId: question.id || questionKey,
      question: {
        id: question.id || questionKey,
        level: question.level,
        operation: question.operation,
        operand1: question.operand1,
        operand2: question.operand2,
        correctAnswer: question.correctAnswer,
        choices: question.choices || [],
      },
      missCount: 1,
      timestamps: [Date.now()],
    }
  }
  
  saveWrongQuestions(wrongQuestions)
  return wrongQuestions[questionKey]
}

/**
 * Remove a wrong question (when user gets it correct in review)
 * @param {Object} question - Question object
 */
export function removeWrongQuestion(question) {
  const wrongQuestions = loadWrongQuestions()
  const questionKey = getQuestionKey(question)
  
  if (wrongQuestions[questionKey]) {
    delete wrongQuestions[questionKey]
    saveWrongQuestions(wrongQuestions)
  }
}

/**
 * Get all wrong questions as an array
 * @returns {Array} Array of WrongRecord objects
 */
export function getAllWrongQuestions() {
  const wrongQuestions = loadWrongQuestions()
  return Object.values(wrongQuestions)
}

/**
 * Get count of wrong questions
 * @returns {number} Number of unique wrong questions
 */
export function getWrongQuestionsCount() {
  return getAllWrongQuestions().length
}

/**
 * Clear all wrong questions
 */
export function clearWrongQuestions() {
  localStorage.removeItem(STORAGE_KEY)
}

