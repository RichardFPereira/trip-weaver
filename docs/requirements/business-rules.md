# Business rules — Increment 1: a trip and its stops

Decided by the Tech Lead on 2026-11-13. A single fixed user; no login, groups, costs or map yet.

## Glossary
| Term | Meaning |
|---|---|
| **Trip** | A planned journey with a name and optional start and end dates. |
| **Stop** | Where the traveller **sleeps** for one or more nights, in one Place. |
| **Place** | A location (a city), stored without depending on any geocoding provider. |
| **Night** | The unit of coverage. A stop with check-in on day 3 and check-out on day 7 covers the nights of 3, 4, 5 and 6. |
| **Activity** | Something done during a stop, such as a day trip. *Not in this increment.* |

## Trip
- **T1.** A trip has a name, and optionally a start date and an end date.
- **T2.** The trip starts on arrival at the first destination, not when leaving home.
- **T3.** Status, derived from the trip dates: `Upcoming`, `Ongoing`, `Past`, or `Unscheduled` (no dates).

## Stop
- **S1.** A stop has a Place, and optionally an arrival date and a departure date.
- **S2.** The departure is **after** the arrival: a stop covers at least one night.
- **S3.** Stops can have dates only if the trip has dates.
- **S4.** Every dated stop lies within the trip period.
- **S5.** Two stops never cover the same night. The departure day of one may be the arrival day of the next.
- **S6.** Arrival may be later than the previous departure (real-world dates, e.g. an overnight flight).
- **S7.** Order: undated stops keep the order in which they were added; dated stops follow chronological order.

## Place
- **P1.** Places are chosen through an autocomplete API, without paid usage.
- **P2.** Only provider-neutral data is stored: name, state or province, country code (ISO 3166-1), and coordinates. No provider IDs.
- **P3.** Country and state are attributes of the Place, never stops of their own.

## Errors vs warnings
| Kind | Rules | Behaviour |
|---|---|---|
| **Invariant (error)** | S2, S3, S4, S5 | The change is **rejected** and the message says why and which stops are involved. The system never adjusts data on its own. |
| **Completeness (warning)** | A night of the trip not covered by any stop | Saved; the warning is shown. |

Example: shortening a trip so that a stop falls outside it is rejected (S4). It is not auto-adjusted.

## Out of scope (for now)
Login · group members and their number · activities · road-trip category · voting · cost splitting · map and routes.
