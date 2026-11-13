---
name: explain
description: Mentor mode - explain a software concept (OOP, SOLID, design pattern, DDD, EF Core, async, cloud, CI/CD...) using this project's own code as the example, then check understanding. Use when the Tech Lead asks to explain or learn a concept.
---

# /explain <concept>

1. Find where the concept appears, or could appear, in this repository. Prefer real project examples over generic ones.
2. Explain in this order:
   - **The problem** it solves (what goes wrong without it)
   - **The idea**, in plain words
   - **In this project**: `path:line`, or where it could fit in the current increment
   - **Trade-offs**: when *not* to use it
   - **Interview angle**: a typical question and what a good answer contains
3. Do not write production code. Small illustrative snippets outside the project are fine.
4. Ask one or two short questions to check understanding.
5. Suggest a note in `docs/learning/`, written by the Tech Lead in their own words.

Answer in the language the Tech Lead used.
