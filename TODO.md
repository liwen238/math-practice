# Math Practice App — Implementation TODO (Easy → Hard)

## Phase 0 — Project Skeleton (very easy)
- [x] Initialize React app (Vite or CRA).
- [x] Add routing (React Router) and basic page shells:
  - [x] `/` SetupPage
  - [x] `/session` SessionPage
  - [x] `/summary` SummaryPage
  - [x] `/stats` StatsPage
  - [x] `/review-wrong` WrongReviewPage
- [x] Create a simple AppShell layout (classroom-style centered content).

## Phase 1 — Static UI Flow (easy)
- [x] SetupPage UI:
  - [x] Age level selector (7–8, 9–10, 11–12).
  - [x] Operation toggles (+, −, ×, ÷).
  - [x] "Start Session" button (no logic yet).
- [x] SessionPage UI scaffolding:
  - [x] Progress header placeholder ("Question X of 10").
  - [x] Card placeholder with "Flip" button.
  - [x] Four choice buttons (static text).
- [x] SummaryPage UI:
  - [x] Placeholder for correct/incorrect stats.
  - [x] "Start New Session" button.
- [x] StatsPage UI:
  - [x] Placeholder stats layout.
- [x] WrongReviewPage UI:
  - [x] Empty-state message ("No wrong questions yet").

## Phase 2 — Core Question Engine (medium-easy)
- [ ] Define data models:
  - [ ] `Question`, `Session`, `WrongRecord`.
- [ ] Implement random question generators:
  - [ ] Addition generator (with negatives allowed).
  - [ ] Subtraction generator (with negatives allowed).
  - [ ] Multiplication generator (tables up to 20).
  - [ ] Division generator (exact only).
- [ ] Implement distractor/choices generator:
  - [ ] Produce 4 unique choices.
  - [ ] Shuffle choices.
- [ ] Implement “no duplicates within session” logic.

## Phase 3 — Session Logic (medium)
- [ ] Start Session from SetupPage.
- [ ] Render current question in SessionPage.
- [ ] Track selectedAnswer.
- [ ] Disable choice buttons after flipping.
- [ ] Auto-advance to next card.
- [ ] Navigate to `/summary` after 10 questions.

## Phase 4 — Card Interaction (medium)
- [ ] Implement QuestionCard component with flip.
- [ ] Front/back rendering.
- [ ] Flip button / card click.
- [ ] Show correct answer & self-report buttons on back.

## Phase 5 — Per-Session Statistics (medium-hard)
- [ ] Track attempted, correct, incorrect.
- [ ] Populate SummaryPage.
- [ ] Save last session stats to localStorage.
- [ ] Implement StatsPage.

## Phase 6 — Wrong Question Persistence (hard)
- [ ] Create persistence store for wrong questions.
- [ ] Save wrong questions to localStorage.
- [ ] Upsert with missCount & timestamp.

## Phase 7 — Review Wrong Questions Mode (harder)
- [ ] Build WrongReviewPage with question cards.
- [ ] Correcting removes from list.
- [ ] Wrong again updates missCount.

## Phase 8 — Adaptive Difficulty (hardest)
- [ ] Add difficulty score per operation.
- [ ] Update on right/wrong.
- [ ] Adjust generator ranges using difficulty.

## Phase 9 — Polish (optional)
- [ ] Clear wrong-question history button.
- [ ] Improved UI.
- [ ] Guardrails for missing operations.
- [ ] Basic unit tests.
