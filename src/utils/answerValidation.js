/**
 * Answer validation utilities
 * Handles validation and warnings when user self-reports answer correctness
 */

/**
 * Validates user's self-report against the actual answer correctness
 * Shows warning dialogs if there's a mismatch
 * 
 * @param {boolean} isCorrect - User's self-reported correctness
 * @param {boolean} actuallyCorrect - Actual correctness based on selected answer
 * @param {number} selectedAnswer - The answer the user selected
 * @param {number} correctAnswer - The correct answer for the question
 * @returns {boolean} True if validation passes (or user confirms), false if user cancels
 */
export function validateSelfReport(isCorrect, actuallyCorrect, selectedAnswer, correctAnswer) {
  // If self-report matches actual correctness, no validation needed
  if (isCorrect === actuallyCorrect) {
    return true
  }
  
  // Build warning message based on the mismatch
  let warningMessage
  if (isCorrect && !actuallyCorrect) {
    warningMessage = 
      `Warning: You selected ${selectedAnswer}, but the correct answer is ${correctAnswer}.\n\n` +
      `You marked this as "correct", but it's actually wrong. Do you want to continue?`
  } else if (!isCorrect && actuallyCorrect) {
    warningMessage = 
      `Warning: You selected ${selectedAnswer}, which is the correct answer!\n\n` +
      `You marked this as "wrong", but it's actually correct. Do you want to continue?`
  }
  
  // Show confirmation dialog - return false if user cancels
  return window.confirm(warningMessage)
}

