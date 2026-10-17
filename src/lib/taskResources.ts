export interface TaskResourceAttribution {
  resourceName: string;
  resourceCategory: "course" | "dsa" | "architecture" | "implementation" | "quality" | "checkpoint" | "general";
  resourceLabel: string;
  referenceUrl?: string;
  topicBadge: string;
  taskConcepts: string[];
}

export function getTaskResource(
  task: {
    category: string;
    title: string;
    description: string;
  },
  week: {
    weekNumber: number;
    primaryCourses?: string;
    phaseTitle?: string;
    concepts?: string;
  }
): TaskResourceAttribution {
  const cat = task.category.toLowerCase().trim();
  const desc = task.description.toLowerCase();
  const weekNum = week.weekNumber;

  if (cat === "dsa") {
    const dsaConceptsMap: Record<number, string[]> = {
      1: ["Big O Notation", "Time Complexity O(1)/O(n)", "Array Traversal", "Hash Map Lookup"],
      2: ["Hash Maps & Sets", "Frequency Counters", "Lookup Invariants", "Collision Trade-offs"],
      3: ["Two Pointers", "Left/Right Inward Scan", "Array Partitioning", "In-Place Updates"],
      4: ["Sliding Window", "Dynamic Subarrays", "Linear Time O(n)", "Boundary Pointers"],
      5: ["Stacks (LIFO)", "Parentheses Matching", "Monotonic Stack Intro", "LIFO Call Stack"],
      6: ["Binary Search", "Logarithmic Time O(log n)", "Search Space Reduction", "Midpoint Invariants"],
      7: ["Sorting Fundamentals", "Divide & Conquer", "Merge Sort / Quick Sort", "Recursion Depth"],
      8: ["Recursion Foundations", "Base Cases", "Call Stack Tracing", "Recursive Tree Models"],
      9: ["Linked Lists", "Node Pointers", "List Reversal", "Fast & Slow Pointers"],
      10: ["Binary Trees", "Breadth-First Search (BFS)", "Depth-First Search (DFS)", "Tree Levels"],
      11: ["Binary Search Trees (BST)", "Inorder Traversal", "BST Invariants", "Search / Insertion"],
      12: ["Heaps & Priority Queues", "Min-Heap / Max-Heap", "Top-K Elements", "Complete Binary Tree"],
      13: ["Hash Tables Mechanics", "Hash Functions & Collisions", "Chaining vs Open Addressing", "Timed Live Drills"],
      14: ["Two Pointers & Sliding Window", "Mixed Review", "Edge Cases", "Two-Pass Optimizations"],
      15: ["Intervals", "Interval Sorting", "Overlap Detection", "Interval Merging"],
      16: ["Grid BFS / DFS", "Matrix Coordinates", "Visited Set Management", "Connected Components"],
      17: ["Graph Theory", "Adjacency Lists & Matrices", "Graph BFS / DFS", "Cycle Detection"],
      18: ["Backtracking", "State-Space Tree", "Choice / Constraint / Goal", "Pruning Branches"],
      19: ["Dynamic Programming Intro", "Overlapping Subproblems", "Optimal Substructure", "1D Recurrence"],
    };

    const concepts = dsaConceptsMap[weekNum] || [
      "NeetCode 150 Core Patterns",
      "Timed Problem Solving",
      "Complexity Trade-off Defense",
      "Edge-Case Verification",
    ];

    if (weekNum <= 19) {
      return {
        resourceName: "The Last Algorithms Course You'll Need (Frontend Masters — ThePrimeagen)",
        resourceCategory: "dsa",
        resourceLabel: "The Last Algorithms Course · NeetCode",
        referenceUrl: "https://frontendmasters.com/courses/algorithms/",
        topicBadge: `DSA Track (Week ${weekNum})`,
        taskConcepts: concepts,
      };
    } else {
      return {
        resourceName: "NeetCode 150 & Grind 75 Practical Interview Drills",
        resourceCategory: "dsa",
        resourceLabel: "NeetCode 150 · Grind 75",
        referenceUrl: "https://neetcode.io/roadmap",
        topicBadge: `Interview Drills (Week ${weekNum})`,
        taskConcepts: concepts,
      };
    }
  }

  if (cat === "design") {
    const archConceptsMap: Record<number, string[]> = {
      1: ["Function Boundaries", "Pure vs Impure Functions", "Input/Output Contracts", "Side Effect Isolation"],
      2: ["Separation of Concerns", "Transport vs Transformation", "Retry Policy", "Function Composition"],
      3: ["Type-Driven Design", "Tagged / Discriminated Unions", "Illegal State Elimination", "Pattern Matching"],
      4: ["Interface Segregation", "Reusable Abstractions", "Generic Constraints", "Minimal Surface Area"],
      5: ["Single Responsibility Principle (SRP)", "Domain vs Transport Types", "State Modeling", "Validation Seams"],
      6: ["Component Boundaries", "Semantic HTML Primitives", "Accessible Scoping", "Markup Hierarchy"],
      7: ["Design Tokens", "Layout Primitives", "Spacing Conventions", "Mobile-First Design"],
      8: ["Composition over Inheritance", "Props Contracts", "Unidirectional Data Flow", "Component Seams"],
      9: ["Finite State Machines", "Action Boundaries", "Loading / Ready / Error States", "State Reducers"],
      10: ["Adapter Pattern", "API Normalization Layer", "Presentation vs Data Fetching", "Contract Decoupling"],
      11: ["Dependency Seams", "Test Doubles & Mocks", "Design for Testability", "Inversion of Control"],
      12: ["Module Graph", "Frontend Architecture", "Component Contracts", "Bundle Boundaries"],
      13: ["Module Boundaries", "Error Taxonomy", "Dependency Direction", "Node Architecture"],
      14: ["Layered Architecture", "Controller / Service / Repository", "Thin Route Handlers", "DTOs"],
      15: ["Strategy Pattern", "Interchangeable Validation Rules", "Business Logic Isolation", "Zod Pipelines"],
      16: ["Middleware & Guard Pattern", "Authentication vs Authorization", "Least Privilege", "Security Seams"],
      17: ["Repository Interface", "Domain to Relational Mapping", "Foreign Key Integrity", "Query Contracts"],
      18: ["Unit of Work", "Transaction Boundaries", "ACID Guarantees", "Concurrency & Isolation"],
      19: ["Data Access Layer (DAL)", "ORM vs Raw SQL Trade-offs", "Boundary Isolation", "Schema Migrations"],
      20: ["Dependency Injection (DI)", "Inversion of Control (IoC)", "NestJS Providers", "Modular Decomposition"],
      21: ["Guard & Decorator Pattern", "Interceptor Pipeline", "Exception Filters", "Cross-Cutting Concerns"],
      22: ["Observer / Pub-Sub", "Event Emitters", "Background Task Queues", "Framework Trade-offs"],
      23: ["Full-Stack Architecture", "Server Components DAL", "Command/Query Separation", "Hydration Boundaries"],
      24: ["Server Action Safety", "Data Ownership", "Cache Invalidation", "CQS Primitives"],
      25: ["Fault Boundaries", "Idempotency", "Graceful Shutdown", "Defensive Defaults"],
      26: ["Reliability Engineering", "Health Check Architecture", "12-Factor App", "Container Isolation"],
      27: ["Product Telemetry Architecture", "Event Taxonomy", "Privacy by Design", "No-PII Boundaries"],
      28: ["Pub/Sub Analytics Model", "Funnel Tracking", "Feature Flag Seams", "Event Sampling"],
      29: ["Code Smell Refactoring", "Refactoring to Patterns (Fowler)", "Safe Incremental Extraction", "Test Coverage"],
      30: ["SOLID Principles", "Strategy / Factory / Adapter", "Low-Level Design (LLD)", "Object Modeling"],
      31: ["System Design Primer", "Horizontal Scaling & Load Balancing", "Caching & Sharding", "CAP Theorem"],
      32: ["Facade / State / Decorator", "Production Code Audits", "Extensibility vs Over-Engineering"],
      33: ["High-Level Architecture", "Requirements Clarification", "System Trade-off Analysis", "Interview Mocks"],
    };

    const concepts = archConceptsMap[weekNum] || [
      "Software Architecture Principles",
      "Separation of Concerns",
      "System Modularity",
      "Trade-off Analysis",
    ];

    if (weekNum <= 5) {
      return {
        resourceName: "Software Design: Function Boundaries, Tagged Unions & State Modeling",
        resourceCategory: "architecture",
        resourceLabel: "Clean Code & State Modeling",
        referenceUrl: "https://refactoring.guru/design-patterns/typescript",
        topicBadge: "Domain & State Design",
        taskConcepts: concepts,
      };
    } else if (weekNum <= 12) {
      return {
        resourceName: "Frontend Architecture: Component Composition, State Machines & Adapters",
        resourceCategory: "architecture",
        resourceLabel: "Component Architecture & Composition",
        referenceUrl: "https://refactoring.guru/design-patterns/typescript",
        topicBadge: "Component Architecture",
        taskConcepts: concepts,
      };
    } else if (weekNum <= 19) {
      return {
        resourceName: "Backend Architecture: Layered Architecture (Controller / Service / DAL) & Transactions",
        resourceCategory: "architecture",
        resourceLabel: "Enterprise Layered Architecture",
        referenceUrl: "https://refactoring.guru/design-patterns/structural-patterns",
        topicBadge: "Backend Architecture",
        taskConcepts: concepts,
      };
    } else if (weekNum <= 22) {
      return {
        resourceName: "NestJS Architecture: Dependency Injection, Guards, Decorators & Pub/Sub",
        resourceCategory: "architecture",
        resourceLabel: "NestJS Architecture (Tom Ray)",
        referenceUrl: "https://docs.nestjs.com/fundamentals/dependency-injection",
        topicBadge: "Framework Architecture",
        taskConcepts: concepts,
      };
    } else if (weekNum <= 26) {
      return {
        resourceName: "System Architecture: Next.js DAL, Fault Boundaries, Reliability & Docker",
        resourceCategory: "architecture",
        resourceLabel: "Full-Stack System Architecture",
        referenceUrl: "https://nextjs.org/learn",
        topicBadge: "System Architecture",
        taskConcepts: concepts,
      };
    } else if (weekNum <= 29) {
      return {
        resourceName: "Product Architecture: Telemetry Boundaries (PostHog) & Code Smells Refactoring",
        resourceCategory: "architecture",
        resourceLabel: "PostHog & Refactoring (Martin Fowler)",
        referenceUrl: "https://posthog.com/product-engineer/what-is-a-product-engineer",
        topicBadge: "Product Architecture",
        taskConcepts: concepts,
      };
    } else {
      return {
        resourceName: "System Design Primer & GoF Patterns (Ultimate Design Patterns + Refactoring.Guru)",
        resourceCategory: "architecture",
        resourceLabel: "System Design Primer · GoF Patterns",
        referenceUrl: "https://github.com/donnemartin/system-design-primer",
        topicBadge: "System Design & GoF",
        taskConcepts: concepts,
      };
    }
  }

  if (cat === "implementation") {
    if (
      desc.includes("feedback") ||
      desc.includes("feedbackhub") ||
      desc.includes("prd") ||
      desc.includes("user journey") ||
      desc.includes("auth") ||
      desc.includes("deploy") ||
      desc.includes("crud") ||
      desc.includes("schema")
    ) {
      return {
        resourceName: "FeedbackHub Project Specification & Architecture (Section 6 · docs/architecture.md)",
        resourceCategory: "implementation",
        resourceLabel: "FeedbackHub Flagship Spec",
        referenceUrl: "file:///docs/architecture.md",
        topicBadge: "Flagship Portfolio",
        taskConcepts: [
          "FeedbackHub Specification",
          "Multi-Tenant Isolation",
          "Domain Schema & CRUD",
          "End-to-End Testability",
        ],
      };
    }
    return {
      resourceName: "Independent Coding Lab & Unit Tests (Vitest)",
      resourceCategory: "implementation",
      resourceLabel: "Independent Code Lab",
      topicBadge: "Hands-on Lab",
      taskConcepts: [
        "Pure Function Implementation",
        "Vitest Unit Test Suite",
        "Input Validation & Edge Cases",
        "Independent Debugging",
      ],
    };
  }

  if (cat === "quality") {
    return {
      resourceName: "Engineering Quality Gate: Typecheck, Vitest, Git Commits & docs/retrospectives/",
      resourceCategory: "quality",
      resourceLabel: "Quality & Retrospective Gate",
      topicBadge: "Engineering Discipline",
      taskConcepts: [
        "Strict TypeScript Typecheck",
        "Deterministic Test Suite",
        "Atomic Git Commits & PRs",
        "Honest Mistake Retrospective",
      ],
    };
  }

  if (cat === "checkpoint") {
    return {
      resourceName: "Competency Gatekeeper: 5-Minute Independent Explanation & Zero-AI Exit Test",
      resourceCategory: "checkpoint",
      resourceLabel: "Exit Competency Checkpoint",
      topicBadge: "Gatekeeper Test",
      taskConcepts: [
        "Independent Live Coding",
        "Zero-AI Verification",
        "Complexity & Trade-off Explanation",
        "Demonstrated Engineering Proof",
      ],
    };
  }

  // Course category
  const courseStr = week.primaryCourses || "Core Syllabus";
  let refUrl: string | undefined;

  if (courseStr.toLowerCase().includes("hard parts")) {
    refUrl = "https://frontendmasters.com/courses/javascript-hard-parts-v3/";
  } else if (courseStr.toLowerCase().includes("typescript")) {
    refUrl = "https://totaltypescript.com";
  } else if (courseStr.toLowerCase().includes("css for javascript")) {
    refUrl = "https://css-for-js.dev";
  } else if (courseStr.toLowerCase().includes("epic react")) {
    refUrl = "https://epicreact.dev";
  } else if (courseStr.toLowerCase().includes("testing fundamentals")) {
    refUrl = "https://frontendmasters.com/courses/testing-fundamentals/";
  } else if (courseStr.toLowerCase().includes("node.js")) {
    refUrl = "https://frontendmasters.com/courses/node-js-v3/";
  } else if (courseStr.toLowerCase().includes("api design")) {
    refUrl = "https://frontendmasters.com/courses/api-design-nodejs-v5/";
  } else if (courseStr.toLowerCase().includes("sql")) {
    refUrl = "https://frontendmasters.com/courses/complete-intro-sql/";
  } else if (courseStr.toLowerCase().includes("nest")) {
    refUrl = "https://www.tomray.dev/nestjs-course";
  } else if (courseStr.toLowerCase().includes("next.js")) {
    refUrl = "https://frontendmasters.com/courses/next-js-v4/";
  } else if (courseStr.toLowerCase().includes("playwright")) {
    refUrl = "https://frontendmasters.com/courses/playwright/";
  } else if (courseStr.toLowerCase().includes("posthog")) {
    refUrl = "https://posthog.com/product-engineer/what-is-a-product-engineer";
  } else if (courseStr.toLowerCase().includes("system design")) {
    refUrl = "https://github.com/donnemartin/system-design-primer";
  }

  const courseConcepts = week.concepts
    ? week.concepts.split(",").map((c) => c.trim()).filter(Boolean)
    : ["Core Course Concepts", "Video Lectures", "Lab Exercises"];

  return {
    resourceName: courseStr,
    resourceCategory: "course",
    resourceLabel: courseStr.split("+")[0].split("—")[0].trim(),
    referenceUrl: refUrl,
    topicBadge: "Primary Course",
    taskConcepts: courseConcepts,
  };
}
