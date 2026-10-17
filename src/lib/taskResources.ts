export interface TaskResourceAttribution {
  resourceName: string;
  resourceCategory: "course" | "dsa" | "architecture" | "implementation" | "quality" | "checkpoint" | "general";
  resourceLabel: string;
  referenceUrl?: string;
  topicBadge: string;
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
  }
): TaskResourceAttribution {
  const cat = task.category.toLowerCase().trim();
  const desc = task.description.toLowerCase();
  const weekNum = week.weekNumber;

  if (cat === "dsa") {
    if (weekNum <= 19) {
      return {
        resourceName: "The Last Algorithms Course You'll Need (Frontend Masters — ThePrimeagen)",
        resourceCategory: "dsa",
        resourceLabel: "The Last Algorithms Course · NeetCode",
        referenceUrl: "https://frontendmasters.com/courses/algorithms/",
        topicBadge: `DSA Track (Week ${weekNum})`,
      };
    } else {
      return {
        resourceName: "NeetCode 150 & Grind 75 Practical Interview Drills",
        resourceCategory: "dsa",
        resourceLabel: "NeetCode 150 · Grind 75",
        referenceUrl: "https://neetcode.io/roadmap",
        topicBadge: `Interview Drills (Week ${weekNum})`,
      };
    }
  }

  if (cat === "design") {
    if (weekNum <= 5) {
      return {
        resourceName: "Software Design: Function Boundaries, Tagged Unions & State Modeling",
        resourceCategory: "architecture",
        resourceLabel: "Clean Code & State Modeling",
        referenceUrl: "https://refactoring.guru/design-patterns/typescript",
        topicBadge: "Domain & State Design",
      };
    } else if (weekNum <= 12) {
      return {
        resourceName: "Frontend Architecture: Component Composition, State Machines & Adapters",
        resourceCategory: "architecture",
        resourceLabel: "Component Architecture & Composition",
        referenceUrl: "https://refactoring.guru/design-patterns/typescript",
        topicBadge: "Component Architecture",
      };
    } else if (weekNum <= 19) {
      return {
        resourceName: "Backend Architecture: Layered Architecture (Controller / Service / DAL) & Transactions",
        resourceCategory: "architecture",
        resourceLabel: "Enterprise Layered Architecture",
        referenceUrl: "https://refactoring.guru/design-patterns/structural-patterns",
        topicBadge: "Backend Architecture",
      };
    } else if (weekNum <= 22) {
      return {
        resourceName: "NestJS Architecture: Dependency Injection, Guards, Decorators & Pub/Sub",
        resourceCategory: "architecture",
        resourceLabel: "NestJS Architecture (Tom Ray)",
        referenceUrl: "https://docs.nestjs.com/fundamentals/dependency-injection",
        topicBadge: "Framework Architecture",
      };
    } else if (weekNum <= 26) {
      return {
        resourceName: "System Architecture: Next.js DAL, Fault Boundaries, Reliability & Docker",
        resourceCategory: "architecture",
        resourceLabel: "Full-Stack System Architecture",
        referenceUrl: "https://nextjs.org/learn",
        topicBadge: "System Architecture",
      };
    } else if (weekNum <= 29) {
      return {
        resourceName: "Product Architecture: Telemetry Boundaries (PostHog) & Code Smells Refactoring",
        resourceCategory: "architecture",
        resourceLabel: "PostHog & Refactoring (Martin Fowler)",
        referenceUrl: "https://posthog.com/product-engineer/what-is-a-product-engineer",
        topicBadge: "Product Architecture",
      };
    } else {
      return {
        resourceName: "System Design Primer & GoF Patterns (Ultimate Design Patterns + Refactoring.Guru)",
        resourceCategory: "architecture",
        resourceLabel: "System Design Primer · GoF Patterns",
        referenceUrl: "https://github.com/donnemartin/system-design-primer",
        topicBadge: "System Design & GoF",
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
      };
    }
    return {
      resourceName: "Independent Coding Lab & Unit Tests (Vitest)",
      resourceCategory: "implementation",
      resourceLabel: "Independent Code Lab",
      topicBadge: "Hands-on Lab",
    };
  }

  if (cat === "quality") {
    return {
      resourceName: "Engineering Quality Gate: Typecheck, Vitest, Git Commits & docs/retrospectives/",
      resourceCategory: "quality",
      resourceLabel: "Quality & Retrospective Gate",
      topicBadge: "Engineering Discipline",
    };
  }

  if (cat === "checkpoint") {
    return {
      resourceName: "Competency Gatekeeper: 5-Minute Independent Explanation & Zero-AI Exit Test",
      resourceCategory: "checkpoint",
      resourceLabel: "Exit Competency Checkpoint",
      topicBadge: "Gatekeeper Test",
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

  return {
    resourceName: courseStr,
    resourceCategory: "course",
    resourceLabel: courseStr.split("+")[0].split("—")[0].trim(),
    referenceUrl: refUrl,
    topicBadge: "Primary Course",
  };
}
