# Requirements Document

## Introduction

This feature transforms the existing static DSA tutorial pages in the RejexIQ React SPA into a fully interactive learning system. The platform already has gamification (XP, levels, achievements), topic navigation, and a daily challenge with JS sandbox execution. The enhancement adds split-panel deep-dive views, animated visualizers, a progressive hint system, a structured Learn→Practice→Test flow per topic, intelligent progress tracking, solution comparison, an interview simulation mode, prerequisite locking, and gamification upgrades — all running entirely in the browser with localStorage persistence and no new npm packages.

## Glossary

- **Platform**: The RejexIQ React SPA (DSAGame.jsx, DSAHub.jsx, and related files)
- **Topic**: One of the 19 DSA subjects (e.g., Arrays, Trees, Dynamic Programming)
- **Sandbox**: The existing `new Function()` JavaScript execution environment used in DailyChallenge.jsx
- **XP_System**: The existing experience-point and level system managed in DSAGame.jsx
- **Achievement_System**: The existing achievement unlock and toast system in DSAGame.jsx
- **Progress_Store**: localStorage keys used to persist all user state
- **Deep_Dive**: The split-panel view opened when a user selects a topic
- **Visualizer**: The animated step-by-step data structure / algorithm animation component
- **Hint_System**: The four-level progressive hint mechanism attached to practice problems
- **LPT_Flow**: The Learn → Practice → Test three-tab flow per topic
- **Progress_Tracker**: The component that records accuracy, timestamps, and weak-area detection
- **Interview_Mode**: The timed, hint-restricted random-question simulation mode
- **Approach_Comparator**: The side-by-side brute-force vs optimised solution display

## Requirements

---

### Requirement 1: Topic Deep-Dive Mode

**User Story:** As a learner, I want to open a focused split-panel view for any topic, so that I can read the concept explanation and run JavaScript code side-by-side without switching pages.

#### Acceptance Criteria

1. WHEN a user clicks a topic card in DSAHub, THE Platform SHALL open the Deep_Dive panel for that topic without navigating away from the SPA.
2. THE Deep_Dive SHALL display a left panel containing a structured concept explanation with key patterns for the selected topic.
3. THE Deep_Dive SHALL display a right panel containing a live JavaScript code editor pre-loaded with a starter snippet for the selected topic.
4. WHEN a user clicks the Run button, THE Sandbox SHALL execute the JavaScript code and display the output below the editor within 2 seconds.
5. IF the Sandbox execution throws an error, THEN THE Deep_Dive SHALL display the error message in the output area with a distinct error style.
6. THE Deep_Dive SHALL display Java and Python reference implementations for the selected topic as read-only, syntax-highlighted code blocks.
7. WHEN the Deep_Dive is open, THE Platform SHALL provide a close or back control that returns the user to the topic list view.

---

### Requirement 2: DSA Visualizer

**User Story:** As a learner, I want to watch animated step-by-step visualizations of data structure operations and sorting algorithms, so that I can understand how they work at a mechanical level.

#### Acceptance Criteria

1. THE Visualizer SHALL support animations for the following operations: array insertion, array deletion, array traversal, stack push, stack pop, queue enqueue, queue dequeue, tree BFS traversal, tree DFS traversal, bubble sort, merge sort, and quick sort.
2. WHEN a user initiates a visualization, THE Visualizer SHALL highlight the element or node currently being operated on at each step.
3. THE Visualizer SHALL provide a Step Forward control that advances the animation by exactly one operation step.
4. THE Visualizer SHALL provide a Step Backward control that reverses the animation by exactly one operation step.
5. THE Visualizer SHALL provide a speed slider that adjusts the auto-play interval between steps from 200 ms to 2000 ms.
6. THE Visualizer SHALL provide a Play/Pause control that auto-advances through all steps at the selected speed.
7. WHEN the visualization reaches the final step, THE Visualizer SHALL display a completion indicator and stop auto-play.
8. THE Visualizer SHALL display a text label describing the current operation at each step.

---

### Requirement 3: Smart Hint System

**User Story:** As a learner, I want access to progressive hints for practice problems, so that I can get unstuck without immediately seeing the full solution.

#### Acceptance Criteria

1. THE Hint_System SHALL provide exactly four hint levels for each practice problem: a conceptual clue, a directional hint, pseudocode, and the full solution approach.
2. WHEN a user requests a hint, THE Hint_System SHALL reveal only the next unrevealed hint level; previously revealed hints SHALL remain visible.
3. THE Hint_System SHALL deduct XP from the user's XP_System balance for each hint revealed, according to the penalty schedule: hint 1 costs 5 XP, hint 2 costs 10 XP, hint 3 costs 15 XP, hint 4 costs 20 XP.
4. WHEN a hint is revealed, THE Platform SHALL record the hint usage count for that problem in the Progress_Store.
5. IF the user's current XP balance is less than the cost of the next hint, THEN THE Hint_System SHALL display a warning and SHALL NOT deduct XP below zero.
6. THE Hint_System SHALL display the total XP cost incurred for hints on the current problem before the user requests each hint.

---

### Requirement 4: Learn → Practice → Test Flow

**User Story:** As a learner, I want a structured three-tab flow for each topic, so that I can progress from understanding concepts to practising problems to testing my knowledge in a single coherent experience.

#### Acceptance Criteria

1. THE LPT_Flow SHALL present three tabs for each topic: Learn, Practice, and Test.
2. THE Learn tab SHALL display the concept explanation and the Visualizer for the topic.
3. THE Practice tab SHALL display a set of problems categorised as Easy, Medium, and Hard, each with the Hint_System attached.
4. THE Test tab SHALL present a timed quiz containing both MCQ and coding problems for the topic.
5. WHEN a user completes the Test tab quiz, THE Platform SHALL display a score summary and feedback for each question.
6. WHEN a user completes the Test tab quiz, THE Platform SHALL award XP via the XP_System proportional to the score achieved.
7. THE Platform SHALL persist the user's last active tab per topic in the Progress_Store so that reopening a topic restores the last tab.

---

### Requirement 5: Intelligent Progress Tracking

**User Story:** As a learner, I want the platform to track my accuracy and identify my weak areas, so that I receive personalised guidance on what to study next.

#### Acceptance Criteria

1. THE Progress_Tracker SHALL record the number of correct answers and total attempts per topic in the Progress_Store after every answered question.
2. THE Progress_Tracker SHALL compute a per-topic accuracy percentage as (correct answers / total attempts) × 100, rounded to the nearest integer.
3. WHEN a topic's accuracy falls below 60%, THE Progress_Tracker SHALL mark that topic as a weak area in the Progress_Store.
4. THE Platform SHALL display a "Suggested Next Topic" recommendation on the dashboard, selecting the weak-area topic with the lowest accuracy.
5. THE Progress_Tracker SHALL record a "last practiced" ISO timestamp per topic in the Progress_Store whenever the user answers a question in that topic.
6. THE Platform SHALL display the "last practiced" timestamp on each topic card in DSAHub in a human-readable relative format (e.g., "2 days ago").
7. WHEN no weak areas exist, THE Platform SHALL suggest the next uncompleted topic in the curriculum order as the recommended topic.

---

### Requirement 6: Compare Approaches

**User Story:** As a learner, I want to see both a brute-force and an optimised solution for each problem, so that I can understand why the optimisation works and how to think about trade-offs.

#### Acceptance Criteria

1. THE Approach_Comparator SHALL display a brute-force solution and an optimised solution side by side for each problem that has both approaches defined.
2. THE Approach_Comparator SHALL display the time complexity and space complexity label for each approach.
3. THE Approach_Comparator SHALL display a written explanation of why the optimised approach improves on the brute-force approach.
4. WHEN a user selects an approach to run, THE Sandbox SHALL execute that approach's code and display the output.
5. THE Approach_Comparator SHALL be accessible from the Practice tab of the LPT_Flow after the user has attempted the problem or explicitly requested to view it.

---

### Requirement 7: Interview Mode

**User Story:** As a learner preparing for technical interviews, I want a timed simulation mode with a random DSA question, so that I can practise under realistic interview conditions.

#### Acceptance Criteria

1. THE Platform SHALL provide an Interview Mode accessible from DSAGame as a distinct tab or section.
2. WHEN Interview Mode starts, THE Platform SHALL select a random problem from the full problem pool and start a 30-minute countdown timer.
3. WHILE the countdown timer is running and less than 10 minutes have elapsed, THE Platform SHALL disable the hint controls.
4. WHEN 10 minutes have elapsed on the countdown timer, THE Platform SHALL enable the Hint_System for the active interview problem.
5. WHEN a user submits their solution or the timer expires, THE Platform SHALL display feedback including the correct solution, time taken, and whether hints were used.
6. THE Platform SHALL award XP via the XP_System upon interview completion: base XP for submission, bonus XP if no hints were used, and bonus XP if submitted before the timer expires.
7. THE Platform SHALL record each interview attempt result (score, hints used, time taken) in the Progress_Store.

---

### Requirement 8: UI Behaviour Improvements

**User Story:** As a learner, I want the topic cards to reflect prerequisites, my current position, and recent activity, so that I can navigate the curriculum in a logical order and quickly resume where I left off.

#### Acceptance Criteria

1. THE Platform SHALL define a prerequisite map for topics (e.g., Trees requires Arrays and Recursion to be completed) and store it as static configuration.
2. WHEN a topic's prerequisites have not been completed, THE Platform SHALL display that topic card in a locked visual state and SHALL prevent opening the Deep_Dive for that topic.
3. THE Platform SHALL display a "Continue Learning" button on the dashboard that navigates directly to the last topic the user was actively studying.
4. WHEN a topic is the currently active topic, THE Platform SHALL apply a glow or pulse CSS animation to that topic card.
5. THE Platform SHALL display the "last practiced" relative timestamp on each topic card that has been visited at least once.
6. IF a user attempts to open a locked topic, THEN THE Platform SHALL display a tooltip or message listing the prerequisite topics that must be completed first.

---

### Requirement 9: Gamification Upgrades

**User Story:** As a learner, I want new achievements and XP multipliers tied to my performance quality, so that I am rewarded for solving problems efficiently and without assistance.

#### Acceptance Criteria

1. THE Achievement_System SHALL include a new achievement "No Hints Needed" awarded when a user solves a practice problem without using any hints.
2. THE Achievement_System SHALL include a new achievement "Optimised Thinker" awarded when a user selects and runs the optimised solution in the Approach_Comparator.
3. THE Achievement_System SHALL include a new achievement "First Attempt" awarded when a user completes a topic's Test tab quiz with a passing score on the first attempt.
4. THE XP_System SHALL apply an accuracy-based XP multiplier when awarding XP for correct answers: 1.0× for accuracy below 60%, 1.25× for accuracy between 60% and 79%, and 1.5× for accuracy of 80% or above.
5. WHEN a new achievement is unlocked, THE Achievement_System SHALL display the existing achievement toast notification and persist the earned state in the Progress_Store.
6. THE Platform SHALL display the accuracy-based multiplier value to the user at the moment XP is awarded so the user understands the bonus applied.
