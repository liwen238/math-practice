
# Math Practice App — Software Specification (React, Web)

## 1. Overview
**Product name (working):** Math Practice Cards  
**Audience:** Children ages 7–12 (classroom-style UI)  
**Platform:** Web-only, built with React  
**Core idea:** 10-question practice sessions using flippable multiple-choice cards. Track performance per session and persist “wrong questions” locally for review.

## 2. Goals & Success Criteria
### Goals
1. Help children practice addition, subtraction, multiplication, and division.
2. Provide age-based fixed levels with adaptive difficulty.
3. Offer a classroom-style card interface (flip to reveal answer).
4. Track performance per session.
5. Persist wrong questions locally and allow review.

### Success Criteria
- Clear usability for children.
- Adaptive difficulty works.
- Wrong questions persist.
- Stats page accurately reflects last session.

## 3. Target Users & Personas
- Students (primary)
- Teachers/parents (secondary)

## 4. User Stories
- Select level & operations.
- View 10-question card session.
- Flip card to reveal answer.
- Mark right/wrong.
- Review wrong questions.
- View session statistics.

## 5. Functional Requirements
### 5.1 Session Setup
- Select age level (7–8, 9–10, 11–12).
- Select operations.
- Start 10-question session.

### 5.2 Question Cards
- Front: question + 4 choices.
- Back: correct answer + self-report buttons.

### 5.3 Card Flip Behavior
- Flip to reveal answer.
- After flip, choices disabled.

### 5.4 Answer Flow
- User selects a choice.
- Flip card.
- Self-report correctness.
- Auto-advance to next card.

### 5.5 Wrong Question Persistence
- Stored in localStorage.
- Keep missCount + timestamp.

### 5.6 Review Wrong Questions Mode
- Card-based review.
- Correcting removes from list.

### 5.7 Statistics Page
- Per-session stats only.
- Shows correct / incorrect / accuracy.

## 6. Adaptive Difficulty Rules
### Age Level Baselines
- L1 (7–8): operands −20 to 50; ×/÷ tables up to 10.
- L2 (9–10): operands −50 to 100; tables up to 15.
- L3 (11–12): operands −100 to 100; tables up to 20.

### Difficulty Adjustment
- Difficulty score d ∈ [−3..+3].
- Right → d+1; wrong → d−1.

## 7. Question Generation
- Random generation.
- No duplicates in a session.

### 7.2 Operation Rules
- Add/sub: allow negatives.
- Mul: tables up to level limit.
- Div: exact only (no remainder).

### 7.3 Distractors
- 3 distractors + 1 correct.
- Ensure uniqueness.

## 8. UI Requirements
### Screens
- Home/setup
- Practice session
- Session summary
- Statistics
- Wrong review

### Layout
- Large readable text.
- Classroom-like style.

## 9. Technical Architecture
- React + hooks.
- React Router.
- localStorage persistence.

### Routing
/ → Setup  
/session → Practice  
/summary → Summary  
/stats → Stats  
/review-wrong → Review wrong questions  

## 10. Data Models
### Question
- id, level, operation, operands, correct answer, choices.

### Session
- sessionId, level, operations, questions, progress, difficulty.

### WrongRecord
- question, missCount, timestamps.

## 11. Component Breakdown
- AppShell
- SetupPage
- SessionPage
- QuestionCard
- ChoicesList
- SelfReportButtons
- SummaryPage
- StatsPage
- WrongReviewPage
- ProgressHeader

## 12. Persistence Strategy
- localStorage keys:
  - wrongQuestions.v1
  - lastSessionStats.v1

## 13. Edge Cases
- No operation selected.
- Choice collisions.
- Avoid division by zero.

## 14. Non-Functional Requirements
- Fast generation (<100ms).
- Offline-friendly.
- Accessible.

## 15. Out of Scope (v1)
- User accounts.
- Multi-session history.
- Audio.
- Remainder division.

## 16. Acceptance Criteria
- 10 questions per session.
- Adaptive difficulty works.
- Wrong questions persist.
- Stats show correct values.

