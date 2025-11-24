/**
 * Simple test script to verify question generator implementation
 * Run this in browser console or Node.js to test
 */

import {
  generateAddition,
  generateSubtraction,
  generateMultiplication,
  generateDivision,
  generateDistractors,
  generateQuestion,
  generateSessionQuestions,
  areQuestionsDuplicate,
  isDuplicate,
} from './questionGenerator.js';

// Test individual generators
console.log('Testing individual generators:');
console.log('Addition:', generateAddition(1));
console.log('Subtraction:', generateSubtraction(2));
console.log('Multiplication:', generateMultiplication(3));
console.log('Division:', generateDivision(1));

// Test distractor generation
console.log('\nTesting distractor generation:');
const distractors = generateDistractors(15, 2);
console.log('Distractors for answer 15:', distractors);
console.log('All unique?', new Set(distractors).size === 4);
console.log('Contains correct answer?', distractors.includes(15));

// Test complete question generation
console.log('\nTesting complete question generation:');
const question = generateQuestion(2, 'add', 'test1');
console.log('Question:', question);
console.log('Has 4 choices?', question.choices.length === 4);
console.log('Contains correct answer?', question.choices.includes(question.correctAnswer));

// Test duplicate detection
console.log('\nTesting duplicate detection:');
const q1 = { operation: 'add', operand1: 5, operand2: 3 };
const q2 = { operation: 'add', operand1: 5, operand2: 3 };
const q3 = { operation: 'add', operand1: 5, operand2: 4 };
console.log('q1 and q2 are duplicates?', areQuestionsDuplicate(q1, q2));
console.log('q1 and q3 are duplicates?', areQuestionsDuplicate(q1, q3));

// Test session question generation
console.log('\nTesting session question generation:');
const sessionQuestions = generateSessionQuestions(2, ['add', 'subtract', 'multiply']);
console.log('Generated questions:', sessionQuestions.length);
console.log('All unique?', sessionQuestions.length === new Set(sessionQuestions.map(q => `${q.operation}-${q.operand1}-${q.operand2}`)).size);

// Verify no duplicates
let hasDuplicates = false;
for (let i = 0; i < sessionQuestions.length; i++) {
  for (let j = i + 1; j < sessionQuestions.length; j++) {
    if (areQuestionsDuplicate(sessionQuestions[i], sessionQuestions[j])) {
      hasDuplicates = true;
      console.error('Found duplicate:', sessionQuestions[i], sessionQuestions[j]);
    }
  }
}
console.log('No duplicates found?', !hasDuplicates);

export {};

