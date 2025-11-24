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
 */
export function generateAddition(level) {
  const config = LEVEL_CONFIGS[level];
  const operand1 = randomInt(config.operandMin, config.operandMax);
  const operand2 = randomInt(config.operandMin, config.operandMax);
  const correctAnswer = operand1 + operand2;

  return {
    operand1,
    operand2,
    correctAnswer,
  };
}

/**
 * Generate subtraction question
 */
export function generateSubtraction(level) {
  const config = LEVEL_CONFIGS[level];
  const operand1 = randomInt(config.operandMin, config.operandMax);
  const operand2 = randomInt(config.operandMin, config.operandMax);
  const correctAnswer = operand1 - operand2;

  return {
    operand1,
    operand2,
    correctAnswer,
  };
}

/**
 * Generate multiplication question (tables up to level limit)
 */
export function generateMultiplication(level) {
  const config = LEVEL_CONFIGS[level];
  const operand1 = randomInt(1, config.tableMax);
  const operand2 = randomInt(1, config.tableMax);
  const correctAnswer = operand1 * operand2;

  return {
    operand1,
    operand2,
    correctAnswer,
  };
}

/**
 * Generate division question (exact only, no remainder)
 */
export function generateDivision(level) {
  const config = LEVEL_CONFIGS[level];
  // Generate a multiplication first, then reverse it for division
  const divisor = randomInt(1, config.tableMax);
  const quotient = randomInt(1, config.tableMax);
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
 */
export function generateQuestion(level, operation, questionId) {
  let questionData;
  
  switch (operation) {
    case 'add':
      questionData = generateAddition(level);
      break;
    case 'subtract':
      questionData = generateSubtraction(level);
      break;
    case 'multiply':
      questionData = generateMultiplication(level);
      break;
    case 'divide':
      questionData = generateDivision(level);
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

