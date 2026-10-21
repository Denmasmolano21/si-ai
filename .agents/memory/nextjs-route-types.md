---
name: Next.js route type generation
description: Prevent stale generated route validators from breaking workspace TypeScript checks.
---

Run Next.js route type generation before TypeScript checking after adding, moving, or removing App Router routes.

**Why:** A workspace check can run before `next build`; stale generated route validators may still import a route file that was moved or deleted.

**How to apply:** Keep route type generation in the app's typecheck command so the root workspace check validates the current route tree.
