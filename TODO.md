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
- [x] Define data models:
  - [x] `Question`, `Session`, `WrongRecord`.
- [x] Implement random question generators:
  - [x] Addition generator (with negatives allowed).
  - [x] Subtraction generator (with negatives allowed).
  - [x] Multiplication generator (tables up to 20).
  - [x] Division generator (exact only).
- [x] Implement distractor/choices generator:
  - [x] Produce 4 unique choices.
  - [x] Shuffle choices.
- [x] Implement "no duplicates within session" logic.

## Phase 3 — Session Logic (medium)
- [x] Start Session from SetupPage.
- [x] Render current question in SessionPage.
- [x] Track selectedAnswer.
- [x] Disable choice buttons after flipping.
- [x] Auto-advance to next card.
- [x] Navigate to `/summary` after 10 questions.

## Phase 4 — Card Interaction (medium)
- [x] Implement QuestionCard component with flip.
- [x] Front/back rendering.
- [x] Flip button / card click.
- [x] Show correct answer & self-report buttons on back.

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
