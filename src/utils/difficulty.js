/**
 * Difficulty management utilities
 */

/**
 * Clamp difficulty value to valid range [-3, 3]
 * @param {number} difficulty - Difficulty score
 * @returns {number} Clamped difficulty
 */
export function clampDifficulty(difficulty) {
  return Math.max(-3, Math.min(3, difficulty))
}

/**
 * Initialize difficulty scores for operations
 * @param {string[]} operations - Array of operation names
 * @returns {Object} Object mapping operations to difficulty scores (default 0)
 */
export function initializeDifficulties(operations) {
  const difficulties = {}
  operations.forEach(op => {
    difficulties[op] = 0
  })
  return difficulties
}

/**
 * Update difficulty for an operation based on answer correctness
 * @param {Object} difficulties - Current difficulties object
 * @param {string} operation - Operation name
 * @param {boolean} isCorrect - Whether the answer was correct
 * @returns {Object} Updated difficulties object
 */
export function updateDifficulty(difficulties, operation, isCorrect) {
  const updated = { ...difficulties }
  if (updated[operation] !== undefined) {
    if (isCorrect) {
      updated[operation] = clampDifficulty(updated[operation] + 1)
    } else {
      updated[operation] = clampDifficulty(updated[operation] - 1)
    }
  }
  return updated
}

/**
 * Get adjusted range based on difficulty and base range
 * @param {number} min - Base minimum
 * @param {number} max - Base maximum
 * @param {number} difficulty - Difficulty score (-3 to 3)
 * @returns {Object} Adjusted {min, max}
 */
export function getAdjustedRange(min, max, difficulty) {
  const range = max - min
  const adjustment = (difficulty / 3) * (range * 0.3) // Adjust up to 30% of range
  
  // Positive difficulty = harder (larger numbers)
  // Negative difficulty = easier (smaller numbers)
  const adjustedMin = Math.floor(min + adjustment)
  const adjustedMax = Math.floor(max + adjustment)
  
  return {
    min: adjustedMin,
    max: adjustedMax,
  }
}

/**
 * Get adjusted table max based on difficulty
 * @param {number} baseTableMax - Base table maximum
 * @param {number} difficulty - Difficulty score (-3 to 3)
 * @returns {number} Adjusted table max
 */
export function getAdjustedTableMax(baseTableMax, difficulty) {
  const adjustment = Math.floor((difficulty / 3) * (baseTableMax * 0.3))
  return Math.max(1, Math.min(baseTableMax * 2, baseTableMax + adjustment))
}

