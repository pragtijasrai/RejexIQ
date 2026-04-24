# Design Document: DSA Interactive Platform

## Overview

This design transforms the existing static RejexIQ DSA tutorial pages into an interactive learning system. All new functionality is implemented as React JSX components that integrate with the existing `DSAGame.jsx` / `DSAHub.jsx` / `DailyChallenge.jsx` architecture. No backend, no new npm packages, and all state persists in localStorage.

The core additions are:

- `TopicDeepDive.jsx` — split-panel concept + live JS editor
- `DSAVisualizer.jsx` — step-by-step animated visualizations
- `HintSystem.jsx` — four-level progressive hints with XP penalty
- `LPTFlow.jsx` — Learn / Practice / Test tab wrapper per topic
- `ProgressTracker.js` — localStorage read/write helpers + weak-area logic
- `ApproachComparator.jsx` — brute-force vs optimised side-by-side
- `InterviewMode.jsx` — timed random-question simulation
- Updates to `DSAGame.jsx` — new achievements, XP multiplier, Interview Mode tab
- Updates to `DSAHub.jsx` — prerequisite locking, glow animation, last-practiced badge

---

## Architecture

```
DSAGame.jsx  (orchestrator — owns XP, achievements, completed topics)
│
├── DSAHub.jsx  (topic grid — enhanced with locks, glow, last-practiced)
│   └── LPTFlow.jsx  (per-topic Learn/Practice/Test tabs)
│       ├── TopicDeepDive.jsx  (Learn tab: concept + editor)
│       │   └── DSAVisualizer.jsx  (embedded in Learn tab)
│       ├── PracticeTab.jsx  (Practice tab: problems + hints + comparator)
│       │   ├── HintSystem.jsx
│       │   └── ApproachComparator.jsx
│       └── TestTab.jsx  (Test tab: timed MCQ + coding quiz)
│
├── InterviewMode.jsx  (new DSAGame tab)
│
└── ProgressTracker.js  (pure utility — no UI, called by all tabs)
```

Data flows upward via callback props (`onXPEarned`, `onAchievementUnlocked`, `onTopicProgress`) so `DSAGame.jsx` remains the single source of truth for XP and achievements, matching the existing pattern.

---

## Components and Interfaces

### ProgressTracker.js (utility module)

Pure functions — no React, no side effects beyond localStorage.

```js
// Read/write helpers
getProgress()          // → { topics: { [id]: TopicProgress }, interviews: InterviewResult[] }
saveTopicProgress(id, patch)  // merges patch into topics[id]
getTopicProgress(id)   // → TopicProgress | null

// Derived data
getAccuracy(id)        // → number (0–100) | null
getWeakAreas()         // → string[]  (topic ids with accuracy < 60)
getSuggestedTopic(completedIds, allTopicIds)  // → string | null
getLastPracticed(id)   // → string | null  (ISO timestamp)
formatRelativeTime(iso) // → string  e.g. "2 days ago"

// Interview
saveInterviewResult(result)  // appends to interviews array
```

### TopicDeepDive.jsx

Props: `{ topic, onClose, onXPEarned }`

Renders a two-column layout:
- Left: scrollable concept markdown-style content (static JSX per topic, reusing existing tutorial content)
- Right: `<textarea>` code editor + Run button + output area + read-only Java/Python tabs

Uses the same `new Function("console", code)` sandbox pattern from `DailyChallenge.jsx`.

### DSAVisualizer.jsx

Props: `{ type, data?, autoPlay?, speed? }`

`type` is one of: `"array-insert" | "array-delete" | "array-traverse" | "stack-push" | "stack-pop" | "queue-enqueue" | "queue-dequeue" | "tree-bfs" | "tree-dfs" | "bubble-sort" | "merge-sort" | "quick-sort"`

Internal state:
```js
{ steps: Step[], currentStep: number, playing: boolean, speed: number }
```

Each `Step` is `{ state: any, highlight: number[], label: string }`.

Step generation is pure — `generateSteps(type, data)` returns the full `Step[]` array upfront. The component only manages which step index is active.

Controls: ◀ Prev | ▶ Play/Pause | ▶▶ Next | speed slider (200–2000 ms).

### HintSystem.jsx

Props: `{ problemId, hints: string[4], currentXP, onXPDeduct, onHintUsed }`

Internal state: `{ revealed: number }` (0–4, count of revealed hints).

XP costs: `[5, 10, 15, 20]` for hints 1–4.

Renders revealed hints cumulatively. Shows next-hint cost before user clicks. Calls `onXPDeduct(cost)` and `onHintUsed(problemId, level)` on reveal.

### LPTFlow.jsx

Props: `{ topicId, topicMeta, onXPEarned, onAchievementUnlocked, onTopicProgress, completedTopics }`

Manages `activeTab` state (`"learn" | "practice" | "test"`), persists to localStorage key `lpt_tab_{topicId}`.

### PracticeTab.jsx

Props: `{ topicId, problems, currentXP, onXPEarned, onAchievementUnlocked, onTopicProgress }`

Renders problem list grouped by difficulty. Each problem card expands to show description, editor, `HintSystem`, and `ApproachComparator`.

### ApproachComparator.jsx

Props: `{ problem }` where `problem.approaches = [{ label, code, timeComplexity, spaceComplexity, explanation }]`

Renders two columns (brute / optimised). Each column has a Run button using the Sandbox. Calls `onAchievementUnlocked("optimised_thinker")` when the optimised approach is run.

### TestTab.jsx

Props: `{ topicId, questions, onXPEarned, onAchievementUnlocked, onTopicProgress }`

Timed quiz (configurable per topic, default 10 min). On completion: computes score, awards XP with accuracy multiplier, checks "First Attempt" achievement, persists result.

### InterviewMode.jsx

Props: `{ problems, currentXP, onXPEarned, onAchievementUnlocked }`

State machine: `"idle" | "active" | "done"`.

Timer: 30 min countdown using `setInterval`. Hints locked for first 10 min. On submit/expire: shows feedback panel, awards XP, saves result via `ProgressTracker.saveInterviewResult`.

---

## Data Models

All data lives in localStorage under a single root key `dsa_progress` (JSON).

```js
// Root shape
{
  topics: {
    [topicId: string]: TopicProgress
  },
  interviews: InterviewResult[]
}

// TopicProgress
{
  correctAnswers: number,   // cumulative correct across all tabs
  totalAttempts: number,    // cumulative attempts across all tabs
  lastPracticed: string,    // ISO 8601 timestamp
  hintsUsed: {              // keyed by problemId
    [problemId: string]: number  // count of hints revealed
  },
  testAttempts: number,     // number of times Test tab quiz started
  testBestScore: number,    // 0–100
  lastTab: "learn" | "practice" | "test"
}

// InterviewResult
{
  timestamp: string,        // ISO 8601
  problemId: string,
  timeTakenSeconds: number,
  hintsUsed: number,
  submitted: boolean,       // false = timer expired
  xpEarned: number
}
```

Existing localStorage keys (`dsa_xp`, `dsa_completed`, `dsa_earned`) are unchanged.

### Prerequisite Map (static config in DSAHub.jsx)

```js
const PREREQUISITES = {
  recursion: ["basics"],
  arrays:    ["basics"],
  strings:   ["arrays"],
  control:   ["basics"],
  ll:        ["arrays"],
  stack:     ["ll"],
  queue:     ["ll"],
  trees:     ["arrays", "recursion"],
  bst:       ["trees"],
  heap:      ["trees"],
  hashing:   ["arrays"],
  graphs:    ["bfs", "dfs"],
  bfs:       ["trees"],
  dfs:       ["trees"],
  backtrack: ["recursion"],
  greedy:    ["arrays"],
  dp:        ["recursion", "arrays"],
};
```

### XP Multiplier Logic

```js
function getXPMultiplier(accuracy) {
  if (accuracy >= 80) return 1.5;
  if (accuracy >= 60) return 1.25;
  return 1.0;
}
```

### New Achievements (added to ACHIEVEMENTS array in DSAGame.jsx)

```js
{ id: "no_hints",         icon: "🧠", title: "No Hints Needed",   desc: "Solve a problem without using any hints",              xp: 75  },
{ id: "optimised_thinker",icon: "⚡", title: "Optimised Thinker", desc: "Run the optimised solution in Approach Comparator",    xp: 50  },
{ id: "first_attempt",    icon: "🎯", title: "First Attempt",     desc: "Pass a topic test on the very first try",              xp: 100 },
```

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Hint reveal is strictly sequential

*For any* problem and any sequence of hint requests, the number of revealed hints after k requests equals min(k, 4), and each revealed hint is the hint at index (revealed_count - 1) — hints are never skipped or revealed out of order.

**Validates: Requirements 3.1, 3.2**

---

### Property 2: XP deduction matches hint cost schedule

*For any* starting XP value and any sequence of hint reveals, the XP balance after revealing hint level n equals startXP minus the sum of costs for hints 1 through n (costs: 5, 10, 15, 20), and the balance never goes below zero.

**Validates: Requirements 3.3, 3.5**

---

### Property 3: Accuracy computation round-trips through storage

*For any* topic and any sequence of (correct, total) answer events, saving then loading progress and recomputing accuracy produces the same integer percentage as computing it directly from the in-memory counters.

**Validates: Requirements 5.1, 5.2**

---

### Property 4: Weak-area detection threshold invariant

*For any* set of topic progress records, a topic appears in the weak-areas list if and only if its computed accuracy is strictly less than 60 and it has at least one attempt recorded.

**Validates: Requirements 5.3**

---

### Property 5: XP multiplier monotonicity

*For any* two accuracy values a1 ≤ a2, the XP multiplier for a1 is less than or equal to the XP multiplier for a2 — the multiplier is a non-decreasing step function of accuracy.

**Validates: Requirements 9.4**

---

### Property 6: Visualizer step bounds invariant

*For any* visualization type and input data, the current step index is always in the range [0, steps.length - 1], stepping forward at the last step does not advance the index, and stepping backward at step 0 does not decrement the index.

**Validates: Requirements 2.3, 2.4, 2.7**

---

### Property 7: Prerequisite lock consistency

*For any* topic and any set of completed topics, a topic is unlocked if and only if every topic in its prerequisite list appears in the completed set — there is no topic that is simultaneously locked and has all prerequisites satisfied, nor unlocked with an unsatisfied prerequisite.

**Validates: Requirements 8.1, 8.2**

---

### Property 8: Interview timer hint-gate invariant

*For any* interview session, the hint controls are disabled while elapsed time < 600 seconds and enabled once elapsed time ≥ 600 seconds — the gate transitions exactly once per session and never reverts.

**Validates: Requirements 7.3, 7.4**

---

### Property 9: Progress storage round-trip

*For any* TopicProgress object, serializing it to JSON and deserializing it produces an object that is deeply equal to the original.

**Validates: Requirements 5.1, 5.5**

---

## Error Handling

- **Sandbox errors**: Caught with try/catch in the Run handler; error message displayed in the output area with a red style. The editor remains editable.
- **localStorage quota**: Writes are wrapped in try/catch; on failure a non-blocking toast warns the user that progress could not be saved.
- **Missing problem data**: If a topic has no problems defined yet, the Practice tab renders a "Coming soon" placeholder rather than crashing.
- **Invalid step index**: `DSAVisualizer` clamps `currentStep` to `[0, steps.length - 1]` on every state update.
- **Zero attempts accuracy**: `getAccuracy` returns `null` (not 0) when `totalAttempts === 0` to avoid false weak-area detection.

---

## Testing Strategy

### Dual Testing Approach

Both unit tests and property-based tests are required. Unit tests cover specific examples and edge cases; property tests verify universal correctness across generated inputs.

### Property-Based Testing

Library: **fast-check** (already available as a dev dependency in most Vite projects; if not present, add it — it is the only permitted new dev dependency).

Each property test runs a minimum of **100 iterations**.

Tag format: `// Feature: dsa-interactive-platform, Property N: <property text>`

| Property | Test file | fast-check arbitraries |
|---|---|---|
| P1 – Hint sequential | `HintSystem.test.js` | `fc.integer({min:0,max:10})` for request count |
| P2 – XP deduction | `HintSystem.test.js` | `fc.integer({min:0,max:5000})` for startXP, `fc.integer({min:1,max:4})` for hint level |
| P3 – Accuracy round-trip | `ProgressTracker.test.js` | `fc.record({correct: fc.nat(), total: fc.nat()})` |
| P4 – Weak-area threshold | `ProgressTracker.test.js` | `fc.array(fc.record({id: fc.string(), correct: fc.nat(), total: fc.nat({min:1})}))` |
| P5 – Multiplier monotonicity | `ProgressTracker.test.js` | `fc.tuple(fc.integer({min:0,max:100}), fc.integer({min:0,max:100}))` |
| P6 – Visualizer bounds | `DSAVisualizer.test.js` | `fc.constantFrom(...TYPES)`, `fc.array(fc.integer())` for data |
| P7 – Prerequisite lock | `DSAHub.test.js` | `fc.subarray(ALL_TOPIC_IDS)` for completed set |
| P8 – Interview hint gate | `InterviewMode.test.js` | `fc.integer({min:0,max:1800})` for elapsed seconds |
| P9 – Progress round-trip | `ProgressTracker.test.js` | `fc.record(...)` matching TopicProgress shape |

### Unit Tests

- `HintSystem`: verify hint 1 is revealed on first click, verify XP not deducted below zero
- `ProgressTracker`: verify `getSuggestedTopic` returns null when all topics complete, verify `formatRelativeTime` for boundary values (just now, 1 min, 1 hour, 1 day)
- `DSAVisualizer`: verify step count for known inputs (e.g., bubble sort on [3,1,2] produces the expected number of steps)
- `TestTab`: verify XP multiplier is applied correctly for a known score + accuracy combination
- `InterviewMode`: verify timer expiry triggers submission state
