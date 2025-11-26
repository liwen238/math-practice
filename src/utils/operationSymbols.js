/**
 * Operation symbol mapping utilities
 * Provides consistent mapping between operation names and display symbols
 */

/**
 * Maps operation names to their display symbols
 */
const OPERATION_SYMBOL_MAP = {
  add: '+',
  subtract: '−',
  multiply: '×',
  divide: '÷',
}

/**
 * Get the display symbol for an operation
 * @param {string} operation - Operation name (add, subtract, multiply, divide)
 * @returns {string} Display symbol for the operation
 */
export function getOperationSymbol(operation) {
  return OPERATION_SYMBOL_MAP[operation] || operation
}

