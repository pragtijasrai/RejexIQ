/**
 * Story Mode — in-memory data store
 * Worlds, missions, and user progress
 */

const worlds = [
  { id: "arrays",    name: "Array Kingdom",       theme: "linear",    description: "Master the land of indexed elements",          icon: "🏰", color: "#00e5ff" },
  { id: "linkedlist",name: "Linked List Labyrinth",theme: "chain",     description: "Traverse the chains of connected nodes",        icon: "🔗", color: "#f59e0b" },
  { id: "stacks",    name: "Stack Fortress",       theme: "stack",     description: "Conquer the LIFO tower of power",               icon: "🗼", color: "#ff6b9d" },
  { id: "queues",    name: "Queue Citadel",         theme: "queue",     description: "Command the FIFO order of operations",          icon: "🏛️", color: "#34d399" },
  { id: "trees",     name: "Tree Temple",           theme: "tree",      description: "Climb the hierarchical forest of data",         icon: "🌳", color: "#a78bfa" },
  { id: "sorting",   name: "Sorting Sanctum",       theme: "sort",      description: "Bring order to the chaos of unsorted data",     icon: "⚔️", color: "#fbbf24" },
  { id: "recursion", name: "Recursion Dungeon",     theme: "recursive", description: "Descend into the depths of self-reference",     icon: "🌀", color: "#c084fc" },
  { id: "graphs",    name: "Graph Maze",            theme: "network",   description: "Navigate the web of connected nodes",           icon: "🕸️", color: "#34d399" }
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
  ],

  linkedlist: [
    {
      id: "ll_m1", worldId: "linkedlist",
      question: "What is the time complexity of accessing the nth element in a singly linked list?",
      options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
      correctAnswer: "O(n)",
      explanation: "Unlike arrays, linked lists have no index. You must traverse from the head node one by one — O(n) in the worst case.",
      xp: 10
    },
    {
      id: "ll_m2", worldId: "linkedlist",
      question: "What is the time complexity of inserting a node at the HEAD of a linked list?",
      options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
      correctAnswer: "O(1)",
      explanation: "Inserting at the head only requires updating the new node's next pointer and the head pointer — constant time O(1).",
      xp: 10
    },
    {
      id: "ll_m3", worldId: "linkedlist",
      question: "What does each node in a singly linked list contain?",
      options: ["Only data", "Data + two pointers", "Data + next pointer", "Only a pointer"],
      correctAnswer: "Data + next pointer",
      explanation: "Each node in a singly linked list stores a value (data) and a reference (next pointer) to the next node in the chain.",
      xp: 10
    },
    {
      id: "ll_m4", worldId: "linkedlist",
      question: "Which technique detects a cycle in a linked list efficiently?",
      options: ["Binary Search", "Floyd's Cycle Detection (slow/fast pointers)", "Merge Sort", "BFS"],
      correctAnswer: "Floyd's Cycle Detection (slow/fast pointers)",
      explanation: "Floyd's algorithm uses two pointers — slow (1 step) and fast (2 steps). If they meet, a cycle exists. Runs in O(n) time and O(1) space.",
      xp: 20
    },
    {
      id: "ll_m5", worldId: "linkedlist",
      question: "What is the main advantage of a linked list over an array?",
      options: ["Faster random access", "Less memory usage", "Dynamic size + O(1) insert/delete at head", "Better cache performance"],
      correctAnswer: "Dynamic size + O(1) insert/delete at head",
      explanation: "Linked lists grow/shrink dynamically and allow O(1) insertion/deletion at the head without shifting elements like arrays do.",
      xp: 15
    },
    {
      id: "ll_m6", worldId: "linkedlist",
      question: "In a doubly linked list, each node has:",
      options: ["One pointer (next)", "Two pointers (prev + next)", "Three pointers", "No pointers"],
      correctAnswer: "Two pointers (prev + next)",
      explanation: "A doubly linked list node stores data, a pointer to the next node, and a pointer to the previous node — enabling traversal in both directions.",
      xp: 10
    }
  ],

  stacks: [
    {
      id: "stk_m1", worldId: "stacks",
      question: "What principle does a Stack follow?",
      options: ["FIFO", "LIFO", "LILO", "FILO"],
      correctAnswer: "LIFO",
      explanation: "Stack follows Last In, First Out (LIFO) — the last element pushed is the first one popped. Think of a stack of plates.",
      xp: 10
    },
    {
      id: "stk_m2", worldId: "stacks",
      question: "What is the time complexity of push and pop operations on a stack?",
      options: ["O(n)", "O(log n)", "O(1)", "O(n²)"],
      correctAnswer: "O(1)",
      explanation: "Both push (add to top) and pop (remove from top) are O(1) — they only touch the top element, no traversal needed.",
      xp: 10
    },
    {
      id: "stk_m3", worldId: "stacks",
      question: "Which real-world use case uses a stack?",
      options: ["Print queue", "Browser back button history", "CPU scheduling", "Network packet routing"],
      correctAnswer: "Browser back button history",
      explanation: "The browser back button uses a stack — each page you visit is pushed, and pressing back pops the most recent page.",
      xp: 15
    },
    {
      id: "stk_m4", worldId: "stacks",
      question: "What error occurs when you pop from an empty stack?",
      options: ["Overflow", "Underflow", "Null Pointer", "Index Out of Bounds"],
      correctAnswer: "Underflow",
      explanation: "Stack underflow occurs when you try to pop or peek from an empty stack — there's nothing to remove.",
      xp: 10
    },
    {
      id: "stk_m5", worldId: "stacks",
      question: "Which algorithm uses a stack to check balanced parentheses?",
      options: ["Binary Search", "DFS", "Iterative matching with a stack", "BFS"],
      correctAnswer: "Iterative matching with a stack",
      explanation: "Push opening brackets onto a stack. When a closing bracket is found, pop and check if it matches. If the stack is empty at the end, brackets are balanced.",
      xp: 20
    },
    {
      id: "stk_m6", worldId: "stacks",
      question: "What does the 'peek' operation do on a stack?",
      options: ["Removes the top element", "Adds a new element", "Returns the top element without removing it", "Clears the stack"],
      correctAnswer: "Returns the top element without removing it",
      explanation: "Peek (or top) returns the top element of the stack without modifying it — useful for checking what's next without consuming it.",
      xp: 10
    }
  ],

  queues: [
    {
      id: "que_m1", worldId: "queues",
      question: "What principle does a Queue follow?",
      options: ["LIFO", "FIFO", "LILO", "Random"],
      correctAnswer: "FIFO",
      explanation: "Queue follows First In, First Out (FIFO) — the first element enqueued is the first one dequeued. Think of a line at a ticket counter.",
      xp: 10
    },
    {
      id: "que_m2", worldId: "queues",
      question: "What are the two primary operations of a Queue?",
      options: ["Push & Pop", "Insert & Delete", "Enqueue & Dequeue", "Add & Remove"],
      correctAnswer: "Enqueue & Dequeue",
      explanation: "Enqueue adds an element to the rear (back) of the queue. Dequeue removes an element from the front. Both are O(1).",
      xp: 10
    },
    {
      id: "que_m3", worldId: "queues",
      question: "Which traversal algorithm uses a Queue?",
      options: ["DFS", "Inorder Traversal", "BFS", "Postorder Traversal"],
      correctAnswer: "BFS",
      explanation: "Breadth-First Search uses a queue to process nodes level by level — enqueue neighbors, dequeue to visit, repeat.",
      xp: 15
    },
    {
      id: "que_m4", worldId: "queues",
      question: "What is a Circular Queue?",
      options: ["A queue that sorts elements", "A queue where the last position connects back to the first", "A queue with two ends", "A queue with priority"],
      correctAnswer: "A queue where the last position connects back to the first",
      explanation: "A circular queue reuses empty spaces at the front by wrapping the rear pointer around — more memory efficient than a linear queue.",
      xp: 15
    },
    {
      id: "que_m5", worldId: "queues",
      question: "What is a Priority Queue?",
      options: ["A queue where elements are sorted alphabetically", "A queue where elements are served based on priority, not insertion order", "A queue with fixed size", "A double-ended queue"],
      correctAnswer: "A queue where elements are served based on priority, not insertion order",
      explanation: "In a priority queue, each element has a priority. The element with the highest priority is dequeued first, regardless of when it was inserted. Usually implemented with a heap.",
      xp: 20
    },
    {
      id: "que_m6", worldId: "queues",
      question: "What is a Deque (Double-Ended Queue)?",
      options: ["A queue with two separate queues", "A queue where insertion and deletion can happen at both ends", "A sorted queue", "A circular queue"],
      correctAnswer: "A queue where insertion and deletion can happen at both ends",
      explanation: "A Deque allows enqueue and dequeue from both the front and rear — combining features of both stacks and queues.",
      xp: 15
    }
  ],

  trees: [
    {
      id: "tre_m1", worldId: "trees",
      question: "What is the maximum number of children a Binary Tree node can have?",
      options: ["1", "2", "3", "Unlimited"],
      correctAnswer: "2",
      explanation: "In a Binary Tree, each node has at most 2 children — conventionally called the left child and the right child.",
      xp: 10
    },
    {
      id: "tre_m2", worldId: "trees",
      question: "What is the time complexity of searching in a balanced Binary Search Tree (BST)?",
      options: ["O(n)", "O(n²)", "O(log n)", "O(1)"],
      correctAnswer: "O(log n)",
      explanation: "In a balanced BST, each comparison eliminates half the remaining nodes — giving O(log n) search, similar to binary search on arrays.",
      xp: 15
    },
    {
      id: "tre_m3", worldId: "trees",
      question: "Which tree traversal visits nodes in Left → Root → Right order?",
      options: ["Preorder", "Postorder", "Inorder", "Level-order"],
      correctAnswer: "Inorder",
      explanation: "Inorder traversal (Left → Root → Right) visits a BST's nodes in sorted ascending order — very useful for getting sorted output.",
      xp: 15
    },
    {
      id: "tre_m4", worldId: "trees",
      question: "What is the height of a complete binary tree with n nodes?",
      options: ["O(n)", "O(n²)", "O(log n)", "O(1)"],
      correctAnswer: "O(log n)",
      explanation: "A complete binary tree with n nodes has height floor(log₂n) — each level doubles the number of nodes.",
      xp: 15
    },
    {
      id: "tre_m5", worldId: "trees",
      question: "What property makes a tree an AVL tree?",
      options: ["All leaves at same level", "Balance factor of every node is -1, 0, or 1", "All nodes have exactly 2 children", "Root has no parent"],
      correctAnswer: "Balance factor of every node is -1, 0, or 1",
      explanation: "An AVL tree is a self-balancing BST where the height difference (balance factor) between left and right subtrees of any node is at most 1.",
      xp: 20
    },
    {
      id: "tre_m6", worldId: "trees",
      question: "Which traversal uses a queue and visits nodes level by level?",
      options: ["Inorder", "Preorder", "Postorder", "Level-order (BFS)"],
      correctAnswer: "Level-order (BFS)",
      explanation: "Level-order traversal uses a queue to visit all nodes at depth 0, then depth 1, then depth 2, etc. — also known as BFS on trees.",
      xp: 15
    }
  ],

  sorting: [
    {
      id: "srt_m1", worldId: "sorting",
      question: "What is the average time complexity of Quick Sort?",
      options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
      correctAnswer: "O(n log n)",
      explanation: "Quick Sort averages O(n log n) by partitioning around a pivot. The worst case is O(n²) when the pivot is always the smallest or largest element.",
      xp: 15
    },
    {
      id: "srt_m2", worldId: "sorting",
      question: "Which sorting algorithm is stable and has O(n log n) worst-case?",
      options: ["Quick Sort", "Heap Sort", "Merge Sort", "Bubble Sort"],
      correctAnswer: "Merge Sort",
      explanation: "Merge Sort is stable (preserves order of equal elements) and guarantees O(n log n) in all cases by dividing and merging sorted halves.",
      xp: 15
    },
    {
      id: "srt_m3", worldId: "sorting",
      question: "What is the time complexity of Bubble Sort in the worst case?",
      options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
      correctAnswer: "O(n²)",
      explanation: "Bubble Sort compares adjacent elements and swaps them — in the worst case (reverse sorted), it makes n*(n-1)/2 comparisons = O(n²).",
      xp: 10
    },
    {
      id: "srt_m4", worldId: "sorting",
      question: "Which algorithm sorts by building a max-heap and extracting elements?",
      options: ["Merge Sort", "Quick Sort", "Heap Sort", "Insertion Sort"],
      correctAnswer: "Heap Sort",
      explanation: "Heap Sort builds a max-heap from the array, then repeatedly extracts the maximum element. It runs in O(n log n) and uses O(1) extra space.",
      xp: 20
    },
    {
      id: "srt_m5", worldId: "sorting",
      question: "Which sorting algorithm is best for nearly sorted data?",
      options: ["Quick Sort", "Merge Sort", "Insertion Sort", "Heap Sort"],
      correctAnswer: "Insertion Sort",
      explanation: "Insertion Sort is O(n) on nearly sorted data — it only shifts elements that are out of place, making it very efficient for small or nearly sorted arrays.",
      xp: 15
    },
    {
      id: "srt_m6", worldId: "sorting",
      question: "What is the space complexity of Merge Sort?",
      options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
      correctAnswer: "O(n)",
      explanation: "Merge Sort requires O(n) extra space for the temporary arrays used during the merge step — unlike in-place sorts like Heap Sort.",
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
