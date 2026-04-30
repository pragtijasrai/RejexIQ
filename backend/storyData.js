/**
 * Story Mode — in-memory data store
 * Worlds, missions, and user progress
 */

const worlds = [
  { id: "arrays", name: "Array Kingdom", theme: "linear", description: "Master the land of indexed elements", icon: "🏰", color: "#00e5ff" },
  { id: "recursion", name: "Recursion Dungeon", theme: "recursive", description: "Descend into the depths of self-reference", icon: "🌀", color: "#c084fc" },
  { id: "graphs", name: "Graph Maze", theme: "network", description: "Navigate the web of connected nodes", icon: "🕸️", color: "#34d399" }
];

const missions = {
  arrays: [
    {
      id: "arr_m1", worldId: "arrays",
      question: "What is the time complexity of accessing an element by index in an array?",
      options: ["O(n)", "O(1)", "O(log n)", "O(n²)"],
      correctAnswer: "O(1)",
      explanation: "Array access is O(1) — constant time — because elements are stored contiguously in memory. The CPU computes the address directly: base + index × size.",
      xp: 10
    },
    {
      id: "arr_m2", worldId: "arrays",
      question: "What is the time complexity of inserting an element at the beginning of an array?",
      options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
      correctAnswer: "O(n)",
      explanation: "Inserting at the beginning requires shifting all existing elements one position to the right — that's O(n) operations.",
      xp: 10
    },
    {
      id: "arr_m3", worldId: "arrays",
      question: "Which operation is most efficient on a sorted array?",
      options: ["Linear Search", "Binary Search", "Bubble Sort", "Insertion at index 0"],
      correctAnswer: "Binary Search",
      explanation: "Binary Search runs in O(log n) on a sorted array by halving the search space each step — far better than O(n) linear search.",
      xp: 15
    },
    {
      id: "arr_m4", worldId: "arrays",
      question: "What does arr.push() do in JavaScript?",
      options: ["Removes first element", "Adds element to beginning", "Adds element to end", "Removes last element"],
      correctAnswer: "Adds element to end",
      explanation: "arr.push() appends an element to the end of the array in O(1) amortized time.",
      xp: 10
    },
    {
      id: "arr_m5", worldId: "arrays",
      question: "What is the space complexity of an array of n elements?",
      options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
      correctAnswer: "O(n)",
      explanation: "An array of n elements requires O(n) space — one memory slot per element.",
      xp: 10
    }
  ],
  recursion: [
    {
      id: "rec_m1", worldId: "recursion",
      question: "What are the two essential parts of a recursive function?",
      options: ["Loop + condition", "Base case + recursive call", "Stack + queue", "Input + output"],
      correctAnswer: "Base case + recursive call",
      explanation: "Every recursive function needs a base case (to stop recursion) and a recursive call (to reduce the problem). Without a base case, you get infinite recursion.",
      xp: 10
    },
    {
      id: "rec_m2", worldId: "recursion",
      question: "What is the time complexity of computing Fibonacci(n) with naive recursion?",
      options: ["O(n)", "O(n log n)", "O(2ⁿ)", "O(log n)"],
      correctAnswer: "O(2ⁿ)",
      explanation: "Naive Fibonacci makes two recursive calls per step, creating an exponential call tree of size ~2ⁿ.",
      xp: 15
    },
    {
      id: "rec_m3", worldId: "recursion",
      question: "What data structure does the call stack resemble?",
      options: ["Queue", "Heap", "Stack", "Graph"],
      correctAnswer: "Stack",
      explanation: "The call stack is literally a stack — LIFO. Each function call pushes a frame; returning pops it.",
      xp: 10
    }
  ],
  graphs: [
    {
      id: "grp_m1", worldId: "graphs",
      question: "What traversal algorithm uses a queue?",
      options: ["DFS", "BFS", "Dijkstra", "Prim's"],
      correctAnswer: "BFS",
      explanation: "Breadth-First Search uses a queue (FIFO) to explore nodes level by level, guaranteeing shortest path in unweighted graphs.",
      xp: 10
    },
    {
      id: "grp_m2", worldId: "graphs",
      question: "What is the time complexity of BFS on a graph with V vertices and E edges?",
      options: ["O(V)", "O(E)", "O(V + E)", "O(V × E)"],
      correctAnswer: "O(V + E)",
      explanation: "BFS visits every vertex once (O(V)) and traverses every edge once (O(E)), giving O(V + E) total.",
      xp: 15
    },
    {
      id: "grp_m3", worldId: "graphs",
      question: "Which algorithm finds the shortest path in a weighted graph?",
      options: ["BFS", "DFS", "Dijkstra's", "Kruskal's"],
      correctAnswer: "Dijkstra's",
      explanation: "Dijkstra's algorithm uses a priority queue to greedily pick the nearest unvisited node, finding shortest paths in O((V + E) log V).",
      xp: 15
    }
  ]
};

// In-memory user progress store: { [userId]: { xp, level, completedMissions: Set } }
const userProgress = {};

const LEVELS = [
  { name: "Beginner", minXp: 0 },
  { name: "Apprentice", minXp: 30 },
  { name: "Coder", minXp: 80 },
  { name: "Developer", minXp: 150 },
  { name: "Engineer", minXp: 250 },
  { name: "Master", minXp: 400 }
];

function getLevel(xp) {
  let level = LEVELS[0].name;
  for (const l of LEVELS) {
    if (xp >= l.minXp) level = l.name;
  }
  return level;
}

function getOrCreateProgress(userId) {
  if (!userProgress[userId]) {
    userProgress[userId] = { userId, xp: 0, level: "Beginner", completedMissions: [] };
  }
  return userProgress[userId];
}

module.exports = { worlds, missions, userProgress, getLevel, getOrCreateProgress };
