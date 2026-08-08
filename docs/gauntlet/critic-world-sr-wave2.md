# Critic — World Boards 4–6 + Spaced Review (Wave 2)

**Date:** 2026-08-07  
**Critic:** Fresh context (did not build Wave 2 world/SR). Harsh.  
**Claim:** [wave2-world-sr-notes.md](./wave2-world-sr-notes.md)  
**Live check:** `npm run build` (pass)

---

## Bar (this gate only)

- Boards 4–6 exist and are spread (not stacked)
- Locked boards not interactable until unlock chain
- Spaced review is **REAL in play** (due queue → retrieval items → `recordAttempt`), not schema-only
- `npm run build` green; no Wave-1 world/HUD regress of composition root

---

## What was inspected

| Source | Finding |
|---|---|
| `WorldSites.ts` | `lesson_board_4` @ (22, 8), `_5` @ (−22, 10), `_6` @ (6, 26) — spread across east / west / north; not stacked. |
| `GameApp.pollSiteProximity` / `startLessonAtSite` | Locked lesson boards excluded from proximity set; **E** rejects with LOCKED toast via `unlockedSiteIds`. |
| `PedagogyEngine.unlockedSiteIds` | Single source: `lesson_board_1` + `unlockOnMastery` from completed lessons. |
| L1–L3 JSON unlock chain | L1→`lesson_board_2`, L2→`lesson_board_3`, L3→`hub_region_ruins_east` (**not** a world site; **never** `lesson_board_4`). Boards 4–6 permanently locked until content retargets. |
| `ReviewRunner` + `pickReviewItems` | Real grading path when invoked: `gradeItem` → `recordAttempt` → `rescheduleReview`. |
| `GameApp.maybeStartSpacedReview` | Wired on lesson close and progress-pedestal **E**. |
| `enqueueReview` / progress lifetime | Mastery enqueues with **`days = 1`** (`dueAt = now + 86400000`). Progress is **in-memory only** (`createDefaultProgress` each boot) — no persist, no dev inject. |
| Composition root | `GameApp` still owns world / player / lasers / HUD; Wave-1 wire intact. |
| `npm run build` | **Pass** (`tsc && vite build`). |

---

## Blind A/B

**Would a player ever see a spaced-retrieval chalkboard in a normal play session?**

**No.** Completing a lesson immediately schedules reviews one day out; closing the lesson or hitting the pedestal calls `dueReviews()`, which is empty. Reloading the page clears the queue. The verify note’s “inject due queue in dev” path **does not exist** in code. `ReviewRunner` is a real module sitting behind a gate that never opens in play.

Boards 4–6 are visible props with lock gating that works — but the unlock chain never names them, so they are forever LOCKED under current content (secondary; content handoff is acknowledged in the claim notes).

---

## Verdict: **FAIL**

### Single largest gap

**Spaced review is not reachable in play.** The due-queue → `pickReviewItems` → `ReviewRunner` → `recordAttempt` pipeline is wired, but `enqueueReview(..., 1)` plus non-persisted progress means `dueReviews()` stays empty for every realistic session — so SR remains effectively schema/plumbing theater, not a lived play loop.

### What does meet the bar (not enough to PASS)

- Boards 4–6 placed and geographically spread
- Lock interact gating via `unlockedSiteIds`
- Build green; composition root not regressed

### Explicitly secondary (not the deciding gap)

- L3 `unlockOnMastery` still points at phantom `hub_region_ruins_east` instead of `lesson_board_4`
- No L4–L6 JSON yet (content agent scope)

---

## Evidence note

Wave 1 content FAIL mode was “engine APIs exist but play never drives them.” Wave 2 SR repeats that pattern for the *trigger*: runners exist; the play session never produces a non-empty due queue.
