# ADR-0001: Record architecture decisions

- **Status:** Accepted
- **Date:** 2026-11-13
- **Deciders:** Tech Lead (@RichardFPereira)

## Context
The architecture of TripWeaver is meant to grow from real problems, not to be designed up front. Decisions made along the way must stay visible, both to the people reading the portfolio and to the AI agents, which have no memory between sessions.

## Alternatives considered
| Option | Pros | Cons |
|---|---|---|
| **ADRs in the repository (Markdown)** | Versioned with the code; reviewable in PRs; readable by agents | Requires discipline |
| Wiki or external docs | Rich editing | Drifts from the code |
| No formal record | Zero effort | Decisions get lost and re-debated |

## Decision
Lightweight ADRs (Michael Nygard format) in `docs/adr/`, numbered sequentially and written in English. An ADR is written **when a real problem forces a decision**, never in advance. Only the Tech Lead accepts an ADR. An accepted ADR is not edited; it is superseded by a new one.

## Consequences
**Positive:** the reasoning behind the architecture becomes part of the portfolio, and agents follow past decisions.

**Negative:** some documentation effort, kept small with a short template.
