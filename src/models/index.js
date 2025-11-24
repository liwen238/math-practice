/**
 * Data models for the Math Practice App
 */

/**
 * @typedef {Object} Question
 * @property {string} id - Unique identifier
 * @property {number} level - Age level (1: 7-8, 2: 9-10, 3: 11-12)
 * @property {string} operation - Operation type: 'add', 'subtract', 'multiply', 'divide'
 * @property {number} operand1 - First operand
 * @property {number} operand2 - Second operand
 * @property {number} correctAnswer - The correct answer
 * @property {number[]} choices - Array of 4 choices (shuffled)
 */

/**
 * @typedef {Object} Session
 * @property {string} sessionId - Unique session identifier
 * @property {number} level - Age level (1: 7-8, 2: 9-10, 3: 11-12)
 * @property {string[]} operations - Array of selected operations
 * @property {Question[]} questions - Array of 10 questions
 * @property {number} currentQuestionIndex - Current question index (0-9)
 * @property {number} difficulty - Current difficulty score (-3 to +3)
 */

/**
 * @typedef {Object} WrongRecord
 * @property {string} questionId - Unique identifier for the question
 * @property {Question} question - The question object
 * @property {number} missCount - Number of times missed
 * @property {number[]} timestamps - Array of timestamps when missed
 */

export {};

