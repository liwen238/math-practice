/**
 * Question generation utilities
 */

/**
 * Level configurations
 */
const LEVEL_CONFIGS = {
  1: { // 7-8 years
    operandMin: -20,
    operandMax: 50,
    tableMax: 10,
  },
  2: { // 9-10 years
    operandMin: -50,
    operandMax: 100,
    tableMax: 15,
  },
  3: { // 11-12 years
    operandMin: -100,
    operandMax: 100,
    tableMax: 20,
  },
};

/**
 * Generate a random integer between min and max (inclusive)
 */
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate a random integer excluding certain values
 */
function randomIntExcluding(min, max, exclude) {
  let value;
  do {
    value = randomInt(min, max);
  } while (exclude.includes(value));
  return value;
}

/**
 * Shuffle an array using Fisher-Yates algorithm
 */
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Generate addition question
 * @param {number} level - Age level (1, 2, or 3)
 * @param {number} difficulty - Difficulty score (-3 to 3), optional
 */
export function generateAddition(level, difficulty = 0) {
  const config = LEVEL_CONFIGS[level];
  
  // Adjust range based on difficulty
  let min = config.operandMin;
  let max = config.operandMax;
  
  if (difficulty !== 0) {
    const range = max - min;
    const adjustment = (difficulty / 3) * (range * 0.3);
    min = Math.floor(min + adjustment);
    max = Math.floor(max + adjustment);
  }
  
  const operand1 = randomInt(min, max);
  const operand2 = randomInt(min, max);
  const correctAnswer = operand1 + operand2;

  return {
    operand1,
    operand2,
    correctAnswer,
  };
}

/**
 * Generate subtraction question
 * @param {number} level - Age level (1, 2, or 3)
 * @param {number} difficulty - Difficulty score (-3 to 3), optional
 */
export function generateSubtraction(level, difficulty = 0) {
  const config = LEVEL_CONFIGS[level];
  
  // Adjust range based on difficulty
  let min = config.operandMin;
  let max = config.operandMax;
  
  if (difficulty !== 0) {
    const range = max - min;
    const adjustment = (difficulty / 3) * (range * 0.3);
    min = Math.floor(min + adjustment);
    max = Math.floor(max + adjustment);
  }
  
  const operand1 = randomInt(min, max);
  const operand2 = randomInt(min, max);
  const correctAnswer = operand1 - operand2;

  return {
    operand1,
    operand2,
    correctAnswer,
  };
}

/**
 * Generate multiplication question (tables up to level limit)
 * @param {number} level - Age level (1, 2, or 3)
 * @param {number} difficulty - Difficulty score (-3 to 3), optional
 */
export function generateMultiplication(level, difficulty = 0) {
  const config = LEVEL_CONFIGS[level];
  
  // Adjust table max based on difficulty
  let tableMax = config.tableMax;
  if (difficulty !== 0) {
    const adjustment = Math.floor((difficulty / 3) * (config.tableMax * 0.3));
    tableMax = Math.max(1, Math.min(config.tableMax * 2, config.tableMax + adjustment));
  }
  
  const operand1 = randomInt(1, tableMax);
  const operand2 = randomInt(1, tableMax);
  const correctAnswer = operand1 * operand2;

  return {
    operand1,
    operand2,
    correctAnswer,
  };
}

/**
 * Generate division question (exact only, no remainder)
 * @param {number} level - Age level (1, 2, or 3)
 * @param {number} difficulty - Difficulty score (-3 to 3), optional
 */
export function generateDivision(level, difficulty = 0) {
  const config = LEVEL_CONFIGS[level];
  
  // Adjust table max based on difficulty
  let tableMax = config.tableMax;
  if (difficulty !== 0) {
    const adjustment = Math.floor((difficulty / 3) * (config.tableMax * 0.3));
    tableMax = Math.max(1, Math.min(config.tableMax * 2, config.tableMax + adjustment));
  }
  
  // Generate a multiplication first, then reverse it for division
  const divisor = randomInt(1, tableMax);
  const quotient = randomInt(1, tableMax);
  const dividend = divisor * quotient; // This ensures exact division

  return {
    operand1: dividend,
    operand2: divisor,
    correctAnswer: quotient,
  };
}

/**
 * Generate distractors (wrong answers) for a question
 * Ensures 4 unique choices including the correct answer
 */
export function generateDistractors(correctAnswer, level) {
  const config = LEVEL_CONFIGS[level];
  const distractors = new Set([correctAnswer]);
  
  // Generate distractors that are different from the correct answer
  while (distractors.size < 4) {
    // Generate distractors within a reasonable range
    // Use a range around the correct answer, but also allow some variation
    const range = Math.max(20, Math.abs(correctAnswer) * 2);
    const min = correctAnswer - range;
    const max = correctAnswer + range;
    
    // Ensure we don't go outside level bounds for some operations
    const distractorMin = Math.max(config.operandMin, min);
    const distractorMax = Math.min(config.operandMax * 2, max);
    
    const distractor = randomIntExcluding(
      distractorMin,
      distractorMax,
      Array.from(distractors)
    );
    distractors.add(distractor);
  }

  // Convert to array and shuffle
  return shuffleArray(Array.from(distractors));
}

/**
 * Generate a complete question with choices
 * @param {number} level - Age level (1, 2, or 3)
 * @param {string} operation - Operation type
 * @param {string} questionId - Unique question ID
 * @param {number} difficulty - Difficulty score (-3 to 3), optional
 */
export function generateQuestion(level, operation, questionId, difficulty = 0) {
  let questionData;
  
  switch (operation) {
    case 'add':
      questionData = generateAddition(level, difficulty);
      break;
    case 'subtract':
      questionData = generateSubtraction(level, difficulty);
      break;
    case 'multiply':
      questionData = generateMultiplication(level, difficulty);
      break;
    case 'divide':
      questionData = generateDivision(level, difficulty);
      break;
    default:
      throw new Error(`Unknown operation: ${operation}`);
  }

  const choices = generateDistractors(questionData.correctAnswer, level);

  return {
    id: questionId,
    level,
    operation,
    operand1: questionData.operand1,
    operand2: questionData.operand2,
    correctAnswer: questionData.correctAnswer,
    choices,
  };
}

/**
 * Check if two questions are duplicates
 */
export function areQuestionsDuplicate(q1, q2) {
  return (
    q1.operation === q2.operation &&
    q1.operand1 === q2.operand1 &&
    q1.operand2 === q2.operand2
  );
}

/**
 * Check if a question is a duplicate of any in an array
 */
export function isDuplicate(question, questionArray) {
  return questionArray.some(q => areQuestionsDuplicate(question, q));
}

/**
 * Generate a single question for a session (with adaptive difficulty)
 * @param {number} level - Age level (1, 2, or 3)
 * @param {string[]} operations - Array of available operations
 * @param {Object} difficulties - Object mapping operations to difficulty scores
 * @param {Question[]} existingQuestions - Array of already generated questions (for duplicate check)
 * @param {number} questionId - Unique question ID
 * @returns {Question|null} Generated question or null if couldn't generate
 */
export function generateAdaptiveQuestion(level, operations, difficulties, existingQuestions, questionId) {
  const maxAttempts = 100;
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    // Randomly select an operation
    const operation = operations[randomInt(0, operations.length - 1)];
    const difficulty = difficulties[operation] || 0;
    
    const question = generateQuestion(level, operation, questionId, difficulty);
    
    if (!isDuplicate(question, existingQuestions)) {
      return question;
    }
    
    attempts++;
  }
  
  return null;
}

/**
 * Generate 10 unique questions for a session
 */
export function generateSessionQuestions(level, operations) {
  const questions = [];
  const maxAttempts = 1000; // Prevent infinite loops
  let questionId = 1;

  while (questions.length < 10) {
    // Randomly select an operation
    const operation = operations[randomInt(0, operations.length - 1)];
    
    let attempts = 0;
    let question;
    
    // Try to generate a non-duplicate question
    do {
      question = generateQuestion(level, operation, `q${questionId}`);
      attempts++;
      
      if (attempts > maxAttempts) {
        // If we can't generate a unique question, break to avoid infinite loop
        // This is unlikely but could happen with very restrictive parameters
        console.warn('Could not generate unique question after max attempts');
        break;
      }
    } while (isDuplicate(question, questions));

    if (question && !isDuplicate(question, questions)) {
      questions.push(question);
      questionId++;
    } else {
      // If we couldn't generate a unique question, try a different operation
      // This should be very rare
      break;
    }
  }

  if (questions.length < 10) {
    console.warn(`Only generated ${questions.length} unique questions`);
  }

  return questions;
}

