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

  // 1. DSA & Algorithms Track
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

  // 2. Software Design & Architecture Track
  if (cat === "design") {
    if (weekNum === 1) {
      return {
        resourceName: "Clean Code (Robert C. Martin) — Chapter 3: Functions & Clean Code JS Guide",
        resourceCategory: "architecture",
        resourceLabel: "Clean Code (Ch. 3: Functions)",
        referenceUrl: "https://github.com/ryanmcdermott/clean-code-javascript#functions",
        topicBadge: "Clean Function Boundaries",
        taskConcepts: [
          "Clean Function Boundaries",
          "Pure vs Impure Functions",
          "Single Level of Abstraction",
          "Side Effect Isolation",
          "Input/Output Contracts",
        ],
      };
    }

    if (weekNum === 2) {
      return {
        resourceName: "Clean Code (Robert C. Martin) — Chapter 10: Classes & Separation of Concerns",
        resourceCategory: "architecture",
        resourceLabel: "Clean Code (Separation of Concerns)",
        referenceUrl: "https://github.com/ryanmcdermott/clean-code-javascript#classes",
        topicBadge: "Separation of Concerns",
        taskConcepts: [
          "Separation of Concerns",
          "Transport vs Transformation",
          "Retry Policy Isolation",
          "Function Composition",
        ],
      };
    }

    if (weekNum === 3) {
      return {
        resourceName: "Effective TypeScript (Dan Vanderkam) — Item 28: Valid States & Discriminated Unions",
        resourceCategory: "architecture",
        resourceLabel: "Effective TypeScript (Item 28)",
        referenceUrl: "https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions",
        topicBadge: "Tagged Unions & State",
        taskConcepts: [
          "Type-Driven State Modeling",
          "Tagged / Discriminated Unions",
          "Illegal State Elimination",
          "Narrowing Invariants",
        ],
      };
    }

    if (weekNum === 4) {
      return {
        resourceName: "Clean Code & Total TypeScript — Interface Segregation & Reusable Abstractions",
        resourceCategory: "architecture",
        resourceLabel: "Interface Segregation Principle",
        referenceUrl: "https://www.totaltypescript.com/",
        topicBadge: "Interface Segregation",
        taskConcepts: [
          "Interface Segregation Principle (ISP)",
          "Reusable Generic Abstractions",
          "Minimal Interface Contracts",
          "Speculative Generics Avoidance",
        ],
      };
    }

    if (weekNum === 5) {
      return {
        resourceName: "Effective TypeScript (Items 31 & 32) & Clean Architecture — Domain vs Transport Types",
        resourceCategory: "architecture",
        resourceLabel: "Effective TypeScript (Items 31-32)",
        referenceUrl: "https://effectivetypescript.com/",
        topicBadge: "Domain State Modeling",
        taskConcepts: [
          "Single Responsibility Principle (SRP)",
          "Domain vs Transport Types",
          "State Invariants",
          "Boundary Validation Seams",
        ],
      };
    }

    if (weekNum === 6) {
      return {
        resourceName: "MDN Web Docs: HTML Semantic Elements & Accessible Component Boundaries",
        resourceCategory: "architecture",
        resourceLabel: "MDN: Semantic HTML",
        referenceUrl: "https://developer.mozilla.org/en-US/docs/Glossary/Semantics",
        topicBadge: "Semantic Component Boundaries",
        taskConcepts: [
          "Semantic Component Boundaries",
          "Semantic HTML vs Div Soup",
          "Accessible DOM Hierarchy",
          "Form Semantics & Landmark Roles",
        ],
      };
    }

    if (weekNum === 7) {
      return {
        resourceName: "Tailwind CSS & Refactoring UI — Design Tokens & Layout Primitives",
        resourceCategory: "architecture",
        resourceLabel: "Tailwind: Design Tokens",
        referenceUrl: "https://tailwindcss.com/docs/utility-first",
        topicBadge: "Design Tokens & Spacing",
        taskConcepts: [
          "Design Tokens Scale",
          "Layout Primitives",
          "Spacing Conventions",
          "Mobile-First Responsiveness",
        ],
      };
    }

    if (weekNum === 8) {
      return {
        resourceName: "React.dev Official Guide: Thinking in React & Composition over Inheritance",
        resourceCategory: "architecture",
        resourceLabel: "React.dev: Composition",
        referenceUrl: "https://react.dev/learn/thinking-in-react",
        topicBadge: "Component Composition",
        taskConcepts: [
          "Composition over Inheritance",
          "Props Contracts",
          "Unidirectional Data Flow",
          "Component Seams",
        ],
      };
    }

    if (weekNum === 9) {
      return {
        resourceName: "React.dev Official Guide: Extracting State Logic into a Reducer & State Machines",
        resourceCategory: "architecture",
        resourceLabel: "React.dev: Finite State Logic",
        referenceUrl: "https://react.dev/learn/extracting-state-logic-into-a-reducer",
        topicBadge: "State Machine Thinking",
        taskConcepts: [
          "Finite State Machines",
          "Loading / Ready / Error Boundaries",
          "Action Types",
          "State Reducers",
        ],
      };
    }

    if (weekNum === 10) {
      return {
        resourceName: "Refactoring.Guru: Adapter Pattern (API Data Normalization)",
        resourceCategory: "architecture",
        resourceLabel: "Refactoring.Guru: Adapter",
        referenceUrl: "https://refactoring.guru/design-patterns/adapter",
        topicBadge: "Adapter & Data Normalization",
        taskConcepts: [
          "Adapter Pattern",
          "API Normalization Layer",
          "Separation of Presentation & Data Fetching",
          "Contract Decoupling",
        ],
      };
    }

    if (weekNum === 11) {
      return {
        resourceName: "Martin Fowler: Test Doubles (Mocks, Stubs, Fakes) & Dependency Seams",
        resourceCategory: "architecture",
        resourceLabel: "Martin Fowler: Test Doubles",
        referenceUrl: "https://martinfowler.com/bliki/TestDouble.html",
        topicBadge: "Testability & Seams",
        taskConcepts: [
          "Dependency Seams",
          "Test Doubles (Mocks, Stubs, Fakes)",
          "Design for Testability",
          "Inversion of Control",
        ],
      };
    }

    if (weekNum === 12) {
      return {
        resourceName: "Bulletproof React & Clean Architecture — Modular Frontend Boundaries",
        resourceCategory: "architecture",
        resourceLabel: "Bulletproof React: Module Graph",
        referenceUrl: "https://github.com/alan2207/bulletproof-react",
        topicBadge: "Modular Frontend Architecture",
        taskConcepts: [
          "Module Graph",
          "Feature-Based Modular Architecture",
          "Component Contracts",
          "Boundary Enforcement",
        ],
      };
    }

    if (weekNum === 13) {
      return {
        resourceName: "Node.js Best Practices & Architecture: Modular Structure & Error Taxonomy",
        resourceCategory: "architecture",
        resourceLabel: "Node.js Best Practices",
        referenceUrl: "https://github.com/goldbergyoni/nodebestpractices#1-project-structure-practices",
        topicBadge: "Backend Module Boundaries",
        taskConcepts: [
          "Module Boundaries",
          "Error Taxonomy",
          "Dependency Direction",
          "Layered Isolation",
        ],
      };
    }

    if (weekNum === 14) {
      return {
        resourceName: "Martin Fowler: Patterns of Enterprise Application Architecture — Service Layer",
        resourceCategory: "architecture",
        resourceLabel: "Martin Fowler: Service Layer",
        referenceUrl: "https://martinfowler.com/eaaCatalog/serviceLayer.html",
        topicBadge: "Layered Architecture",
        taskConcepts: [
          "Controller / Service / Repository",
          "Thin Route Handlers",
          "Data Transfer Objects (DTOs)",
          "Business Logic Isolation",
        ],
      };
    }

    if (weekNum === 15) {
      return {
        resourceName: "Refactoring.Guru: Strategy Pattern (Interchangeable Validation Rules)",
        resourceCategory: "architecture",
        resourceLabel: "Refactoring.Guru: Strategy Pattern",
        referenceUrl: "https://refactoring.guru/design-patterns/strategy",
        topicBadge: "Strategy Pattern",
        taskConcepts: [
          "Strategy Pattern",
          "Interchangeable Validation Rules",
          "Business Rule Pluggability",
          "Zod Validation Pipelines",
        ],
      };
    }

    if (weekNum === 16) {
      return {
        resourceName: "Martin Fowler: Interceptor & Middleware Pattern — Authentication & Authorization Seams",
        resourceCategory: "architecture",
        resourceLabel: "Middleware & Guard Pattern",
        referenceUrl: "https://www.enterpriseintegrationpatterns.com/patterns/messaging/EnvelopeWrapper.html",
        topicBadge: "Middleware & Security Guards",
        taskConcepts: [
          "Middleware / Guard Pattern",
          "Authentication vs Authorization",
          "Least Privilege Principle",
          "Cross-Cutting Security Seams",
        ],
      };
    }

    if (weekNum === 17) {
      return {
        resourceName: "Martin Fowler: Repository Pattern & Relational Data Modeling",
        resourceCategory: "architecture",
        resourceLabel: "Martin Fowler: Repository Pattern",
        referenceUrl: "https://martinfowler.com/eaaCatalog/repository.html",
        topicBadge: "Repository Interface",
        taskConcepts: [
          "Repository Interface",
          "Domain to Relational Mapping",
          "Foreign Key Integrity",
          "Query Contracts",
        ],
      };
    }

    if (weekNum === 18) {
      return {
        resourceName: "Designing Data-Intensive Applications (Martin Kleppmann) — Chapter 7: Transactions",
        resourceCategory: "architecture",
        resourceLabel: "DDIA (Ch. 7: Transactions)",
        referenceUrl: "https://dataintensive.net/",
        topicBadge: "Transactions & Unit of Work",
        taskConcepts: [
          "Unit of Work Pattern",
          "Transaction Boundaries",
          "ACID Guarantees",
          "Lost Update Prevention & Isolation",
        ],
      };
    }

    if (weekNum === 19) {
      return {
        resourceName: "Drizzle ORM: Data Access Layer & Schema Boundaries",
        resourceCategory: "architecture",
        resourceLabel: "Drizzle ORM: Data Access Layer",
        referenceUrl: "https://orm.drizzle.team/docs/overview",
        topicBadge: "Data Access Layer (DAL)",
        taskConcepts: [
          "Data Access Layer (DAL)",
          "ORM vs Raw SQL Trade-offs",
          "Data Ownership",
          "Schema Migration Isolation",
        ],
      };
    }

    if (weekNum >= 20 && weekNum <= 22) {
      return {
        resourceName: "NestJS Official Documentation: Dependency Injection & Provider Architecture",
        resourceCategory: "architecture",
        resourceLabel: "NestJS Architecture (Tom Ray)",
        referenceUrl: "https://docs.nestjs.com/fundamentals/dependency-injection",
        topicBadge: "NestJS Dependency Injection",
        taskConcepts: [
          "Dependency Injection (DI)",
          "Inversion of Control (IoC)",
          "NestJS Providers & Modules",
          "Decorators & Guards Pipeline",
        ],
      };
    }

    if (weekNum === 23 || weekNum === 24) {
      return {
        resourceName: "Next.js Official Documentation: Server Components & Data Access Layer Architecture",
        resourceCategory: "architecture",
        resourceLabel: "Next.js Data Access Architecture",
        referenceUrl: "https://nextjs.org/learn",
        topicBadge: "Next.js Server DAL",
        taskConcepts: [
          "Server-Side Data Access Layer",
          "Server Components Boundaries",
          "Command/Query Separation (CQS)",
          "Hydration Boundaries",
        ],
      };
    }

    if (weekNum === 25 || weekNum === 26) {
      return {
        resourceName: "The Twelve-Factor App: Disposability, Concurrency & Health Checks",
        resourceCategory: "architecture",
        resourceLabel: "The Twelve-Factor App",
        referenceUrl: "https://12factor.net/disposability",
        topicBadge: "Reliability & Fault Boundaries",
        taskConcepts: [
          "Fault Boundaries",
          "Graceful Shutdown",
          "Health Check Endpoints",
          "Idempotency & Timeouts",
        ],
      };
    }

    if (weekNum >= 27 && weekNum <= 29) {
      return {
        resourceName: "Refactoring (Martin Fowler) — Catalog of Refactorings & PostHog Telemetry Architecture",
        resourceCategory: "architecture",
        resourceLabel: "Refactoring Catalog (Martin Fowler)",
        referenceUrl: "https://refactoring.com/catalog/",
        topicBadge: "Refactoring & Telemetry",
        taskConcepts: [
          "Code Smell Refactoring",
          "Event Naming Taxonomy",
          "Privacy by Design",
          "No-PII Telemetry Boundaries",
        ],
      };
    }

    // Weeks 30–33 (GoF Design Patterns & System Design Primer)
    return {
      resourceName: "Refactoring.Guru: TypeScript Design Patterns & System Design Primer (Donne Martin)",
      resourceCategory: "architecture",
      resourceLabel: "Refactoring.Guru (TypeScript) · System Design Primer",
      referenceUrl: "https://refactoring.guru/design-patterns/typescript",
      topicBadge: "GoF Patterns & System Design",
      taskConcepts: [
        "SOLID Principles",
        "Strategy / Factory / Adapter Patterns",
        "System Design Primer",
        "Scalable System Architecture",
      ],
    };
  }

  // 3. Implementation Track
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
      referenceUrl: "https://vitest.dev/guide/",
      topicBadge: "Hands-on Lab",
      taskConcepts: [
        "Pure Function Implementation",
        "Vitest Unit Test Suite",
        "Input Validation & Edge Cases",
        "Independent Debugging",
      ],
    };
  }

  // 4. Quality Gate Track
  if (cat === "quality") {
    return {
      resourceName: "Engineering Quality Gate: Typecheck, Vitest, Git Commits & docs/retrospectives/",
      resourceCategory: "quality",
      resourceLabel: "Quality & Retrospective Gate",
      referenceUrl: "https://vitest.dev/guide/",
      topicBadge: "Engineering Discipline",
      taskConcepts: [
        "Strict TypeScript Typecheck",
        "Deterministic Test Suite",
        "Atomic Git Commits & PRs",
        "Honest Mistake Retrospective",
      ],
    };
  }

  // 5. Checkpoint Track
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

  // 6. Primary Lecture Course Track
  const courseStr = week.primaryCourses || "Core Syllabus";
  let refUrl: string = "https://frontendmasters.com";

  if (courseStr.toLowerCase().includes("hard parts")) {
    refUrl = "https://frontendmasters.com/courses/javascript-hard-parts-v3/";
  } else if (courseStr.toLowerCase().includes("typescript")) {
    refUrl = "https://www.totaltypescript.com/";
  } else if (courseStr.toLowerCase().includes("css for javascript")) {
    refUrl = "https://css-for-js.dev/";
  } else if (courseStr.toLowerCase().includes("epic react")) {
    refUrl = "https://www.epicreact.dev/";
  } else if (courseStr.toLowerCase().includes("testing fundamentals")) {
    refUrl = "https://vitest.dev/guide/";
  } else if (courseStr.toLowerCase().includes("node.js")) {
    refUrl = "https://frontendmasters.com/courses/node-js-v3/";
  } else if (courseStr.toLowerCase().includes("api design")) {
    refUrl = "https://frontendmasters.com/courses/api-design-nodejs-v5/";
  } else if (courseStr.toLowerCase().includes("sql")) {
    refUrl = "https://www.postgresql.org/docs/current/";
  } else if (courseStr.toLowerCase().includes("nest")) {
    refUrl = "https://www.tomray.dev/nestjs-course";
  } else if (courseStr.toLowerCase().includes("next.js")) {
    refUrl = "https://nextjs.org/learn";
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
