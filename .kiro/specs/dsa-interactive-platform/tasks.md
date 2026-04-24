# Implementation Plan: DSA Interactive Platform

## Overview

Incrementally build the interactive learning system on top of the existing RejexIQ codebase. Each task produces working, integrated code. Testing sub-tasks are placed immediately after the code they validate.

## Tasks

- [ ] 1. Create ProgressTracker utility module
  - Create `src/ProgressTracker.js` with pure functions: `getProgress`, `saveTopicProgress`, `getTopicProgress`, `getAccuracy`, `getWeakAreas`, `getSuggestedTopic`, `getLastPracticed`, `formatRelativeTime`, `saveInterviewResult`
  - Use localStorage key `dsa_progress` with the shape defined in design.md
  - `getAccuracy` returns `null` when `totalAttempts === 0`
  - Wrap all localStorage writes in try/catch
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

  - [ ]* 1.1 Write property tests for ProgressTracker
    - **Property 3: Accuracy computation round-trips through storage** — for any (correct, total) pair, save then load and recompute produces the same integer
    - **Property 4: Weak-area detection threshold invariant** — topic in weak areas iff accuracy < 60 and totalAttempts > 0
    - **Property 5: XP multiplier monotonicity** — getXPMultiplier is non-decreasing
    - **Property 9: Progress storage round-trip** — serialize then deserialize TopicProgress produces deeply equal object
    - Use fast-check; minimum 100 iterations each
    - _Requirements: 5.1, 5.2, 5.3, 9.4_

  - [ ]* 1.2 Write unit tests for ProgressTracker edge cases
    - `getSuggestedTopic` returns null when all topics complete
    - `formatRelativeTime` boundary values: < 60s → "just now", 60s → "1 minute ago", 3600s → "1 hour ago", 86400s → "1 day ago"
    - `getAccuracy` returns null for zero attempts
    - _Requirements: 5.2, 5.6, 5.7_

- [ ] 2. Build HintSystem component
  - Create `src/HintSystem.jsx`
  - Props: `{ problemId, hints, currentXP, onXPDeduct, onHintUsed }`
  - State: `{ revealed: number }` (0–4)
  - XP cost array `[5, 10, 15, 20]`; show next-hint cost before click
  - Guard: if `currentXP < cost`, show warning, do not deduct
  - Reveal hints cumulatively; call `onXPDeduct(cost)` and `onHintUsed(problemId, level)`
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

  - [ ]* 2.1 Write property tests for HintSystem logic
    - **Property 1: Hint reveal is strictly sequential** — after k requests, revealed count = min(k, 4)
    - **Property 2: XP deduction matches hint cost schedule and never goes below zero**
    - Extract pure hint logic functions and test them with fast-check
    - _Requirements: 3.1, 3.2, 3.3, 3.5_

  - [ ]* 2.2 Write unit tests for HintSystem
    - First click reveals hint 1 only
    - XP not deducted when balance < cost
    - Cumulative cost display is correct after 2 reveals
    - _Requirements: 3.3, 3.5, 3.6_

- [ ] 3. Build DSAVisualizer component
  - Create `src/DSAVisualizer.jsx`
  - Implement `generateSteps(type, data)` as a pure function returning `Step[]` where each step is `{ state, highlight: number[], label: string }`
  - Support all 12 types listed in design.md
  - Component state: `{ steps, currentStep, playing, speed }`
  - Controls: Prev / Play-Pause / Next buttons; speed slider clamped to [200, 2000] ms
  - Clamp `currentStep` to `[0, steps.length - 1]` on every update
  - Stop auto-play and show completion indicator when `currentStep === steps.length - 1`
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8_

  - [ ]* 3.1 Write property tests for DSAVisualizer step generation
    - **Property 6: Visualizer step bounds invariant** — currentStep always in [0, steps.length-1]; forward at max does not advance; backward at 0 does not decrement
    - For all 12 types with generated input data, `generateSteps` returns non-empty array, every step has non-empty `highlight` and non-empty `label`
    - Use fast-check with `fc.constantFrom(...TYPES)` and array arbitraries
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.7, 2.8_

  - [ ]* 3.2 Write unit tests for DSAVisualizer
    - Bubble sort on [3,1,2] produces the expected step count
    - Speed slider value is clamped to [200, 2000]
    - _Requirements: 2.5_

- [ ] 4. Build TopicDeepDive component
  - Create `src/TopicDeepDive.jsx`
  - Props: `{ topic, onClose, onXPEarned }`
  - Left panel: concept content (import and render existing tutorial JSX per topic via a `TOPIC_CONTENT_MAP`)
  - Right panel: `<textarea>` editor pre-loaded with per-topic starter code; Run button using `new Function("console", code)` sandbox; output area; error display with distinct style
  - Read-only Java/Python reference tabs (syntax-highlighted `<pre>` blocks with `readOnly` / non-editable)
  - Close/back button that calls `onClose()`
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7_

  - [ ]* 4.1 Write unit tests for TopicDeepDive sandbox execution
    - Valid JS code produces output in output area
    - Invalid JS code displays error message with error style class
    - Close button calls onClose
    - _Requirements: 1.4, 1.5, 1.7_

- [ ] 5. Build ApproachComparator component
  - Create `src/ApproachComparator.jsx`
  - Props: `{ problem, currentXP, onXPEarned, onAchievementUnlocked }`
  - Render two columns: brute-force and optimised, each with label, complexity badges, explanation, code block, and Run button
  - Run button uses Sandbox; calls `onAchievementUnlocked("optimised_thinker")` when optimised approach is run
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

  - [ ]* 5.1 Write property tests for ApproachComparator data completeness
    - **Property (from 6.2, 6.3):** For any problem in the problem bank that has both approaches, each approach has non-empty `timeComplexity`, `spaceComplexity`, and `explanation` strings
    - _Requirements: 6.2, 6.3_

- [ ] 6. Build PracticeTab and TestTab components
  - Create `src/PracticeTab.jsx`: renders problems grouped by Easy/Medium/Hard; each problem card expands to show description, editor, `HintSystem`, and `ApproachComparator`; calls `onTopicProgress` after each answer; checks "no_hints" achievement on solve without hints
  - Create `src/TestTab.jsx`: timed quiz (default 10 min); MCQ + coding questions; on completion computes score, applies `getXPMultiplier`, awards XP, checks "first_attempt" achievement, persists result via `ProgressTracker`
  - _Requirements: 4.2, 4.3, 4.4, 4.5, 4.6, 9.1, 9.3_

  - [ ]* 6.1 Write property tests for TestTab XP calculation
    - **Property (from 4.6, 9.4):** For any score percentage and accuracy value, XP awarded = floor(baseXP * score/100 * getXPMultiplier(accuracy)); test with fast-check over score ∈ [0,100] and accuracy ∈ [0,100]
    - _Requirements: 4.6, 9.4_

  - [ ]* 6.2 Write unit tests for PracticeTab and TestTab
    - "no_hints" achievement triggered when problem solved with revealed === 0
    - "first_attempt" achievement triggered on first test completion with passing score
    - Timer expiry triggers submission
    - _Requirements: 9.1, 9.3_

- [ ] 7. Build LPTFlow wrapper component
  - Create `src/LPTFlow.jsx`
  - Props: `{ topicId, topicMeta, onXPEarned, onAchievementUnlocked, onTopicProgress, completedTopics }`
  - Manages `activeTab` state; persists to localStorage key `lpt_tab_{topicId}` on change; restores on mount
  - Renders tab bar (Learn / Practice / Test) and conditionally renders `TopicDeepDive` + `DSAVisualizer`, `PracticeTab`, or `TestTab`
  - _Requirements: 4.1, 4.7_

  - [ ]* 7.1 Write property tests for LPTFlow tab persistence
    - **Property (from 4.7):** For any topicId and any tab value, setting then reading from storage returns the same tab value
    - _Requirements: 4.7_

- [ ] 8. Checkpoint — Ensure all tests pass
  - Run the full test suite; fix any failures before proceeding.
  - Ask the user if questions arise.

- [ ] 9. Build InterviewMode component
  - Create `src/InterviewMode.jsx`
  - Props: `{ problems, currentXP, onXPEarned, onAchievementUnlocked }`
  - State machine: `"idle" | "active" | "done"`
  - On start: select random problem from pool; start 30-min `setInterval` countdown
  - Hint controls disabled while `elapsedSeconds < 600`; enabled once `elapsedSeconds >= 600` (gate transitions exactly once)
  - On submit or timer expiry: transition to "done", show feedback (correct solution, time taken, hints used), award XP (base + no-hint bonus + early-submit bonus), save result via `ProgressTracker.saveInterviewResult`
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7_

  - [ ]* 9.1 Write property tests for InterviewMode
    - **Property 7: Interview results round-trip** — after saving a result, reading interviews array contains that result
    - **Property 8: Interview timer hint-gate invariant** — for any elapsed seconds, hint enabled iff elapsed >= 600; gate never reverts
    - **Property (from 7.1):** Selected problem is always a member of the problems pool
    - _Requirements: 7.1, 7.3, 7.4, 7.7_

  - [ ]* 9.2 Write unit tests for InterviewMode
    - Timer expiry triggers "done" state
    - XP formula correct for (hintsUsed=0, timeTaken=900) and (hintsUsed=2, timeTaken=1800)
    - _Requirements: 7.5, 7.6_

- [ ] 10. Update DSAHub with prerequisite locking, glow, and last-practiced badges
  - Add `PREREQUISITES` static config map to `DSAHub.jsx` (as defined in design.md)
  - `isLocked(topicId, completedTopics)` helper: returns true if any prerequisite is not in completedTopics
  - Locked topic cards: apply locked visual style; clicking shows tooltip listing unsatisfied prerequisites; does not open Deep_Dive
  - Active topic card: apply `topic-card-active` CSS class with glow/pulse keyframe animation
  - Each visited topic card: render `formatRelativeTime(lastPracticed)` badge from ProgressTracker
  - "Continue Learning" button: reads last active topic from ProgressTracker and navigates to it
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_

  - [ ]* 10.1 Write property tests for prerequisite locking
    - **Property 7: Prerequisite lock consistency** — for any topic and any completed set, isLocked returns true iff at least one prerequisite is absent from the completed set
    - Use fast-check with `fc.subarray(ALL_TOPIC_IDS)` for completed set
    - _Requirements: 8.1, 8.2_

  - [ ]* 10.2 Write unit tests for DSAHub UI behaviour
    - Locked topic click shows prerequisite tooltip, not Deep_Dive
    - "Continue Learning" button renders when lastActiveTopic exists in storage
    - Last-practiced badge renders for visited topics
    - _Requirements: 8.3, 8.5, 8.6_

- [ ] 11. Update DSAGame with new achievements, XP multiplier display, and Interview Mode tab
  - Add three new achievement objects to `ACHIEVEMENTS` array in `DSAGame.jsx`: `no_hints`, `optimised_thinker`, `first_attempt`
  - Add `getXPMultiplier(accuracy)` function (step function: <60 → 1.0, 60–79 → 1.25, ≥80 → 1.5)
  - Update `addXp` calls from new tabs to pass and display the multiplier value in the XP popup (e.g., "+150 XP ×1.5")
  - Add "Interview" tab to `DSAGame` tab bar; render `InterviewMode` component in that tab
  - Wire `onAchievementUnlocked` and `onXPEarned` callbacks from all new components up to DSAGame handlers
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 7.1_

  - [ ]* 11.1 Write unit tests for DSAGame gamification upgrades
    - New achievements appear in achievements tab
    - XP popup shows multiplier string when multiplier > 1.0
    - Interview tab renders InterviewMode component
    - _Requirements: 9.5, 9.6_

- [ ] 12. Wire LPTFlow into DSAHub and integrate ProgressTracker calls
  - Replace the existing per-topic component renders in `DSAHub.jsx` with `LPTFlow` for each topic
  - Pass `onTopicProgress` callback from DSAHub → DSAGame that calls `ProgressTracker.saveTopicProgress` and updates `completedTopics` state
  - Render "Suggested Next Topic" banner in DSAGame learn tab using `ProgressTracker.getSuggestedTopic`
  - _Requirements: 5.4, 4.1, 1.1_

- [ ] 13. Final checkpoint — Ensure all tests pass and existing functionality is intact
  - Run the full test suite; verify no regressions in existing DSAGame, DSAHub, and DailyChallenge behaviour.
  - Ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Each task references specific requirements for traceability
- Property tests use fast-check with minimum 100 iterations per property
- Unit tests focus on specific examples, edge cases, and error conditions
- Checkpoints (tasks 8 and 13) ensure incremental validation
- All new files must be `.jsx` (except `ProgressTracker.js` which has no JSX)
- No new runtime npm packages; fast-check is a dev dependency only
