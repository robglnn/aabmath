# Critic — Spaced Review due-in-play (Wave 2b)

**Date:** 2026-08-07  
**Critic:** Fresh context (did not build the SR remediation). Harsh.  
**Claim:** [remediation-sr-due-in-play.md](./remediation-sr-due-in-play.md)  
**Prior FAIL:** [critic-world-sr-wave2.md](./critic-world-sr-wave2.md) — `dueAt +1 day` + no persist → `dueReviews()` empty in session  
**Live check:** `npm run build` (pass)

---

## Bar (this gate only)

- Spaced review **REAL in play in a single session**: due queue → retrieval items → `recordAttempt`
- Boards / unlock still OK
- `npm run build` green

---

## Code path verified

| Step | Evidence |
|---|---|
| Mastery enqueue | `PedagogyEngine.completeLessonIfPassed` → `enqueueReviewOnMastery(kpId)` with **`dueAt: now`**, `intervalDays: 0` |
| Persist | `progressStorage.loadPlayerProgress` / `savePlayerProgress` → `localStorage` key `axiom-reach-player-progress`; `GameApp` loads on construct, `persistProgress()` after lesson/review submits, lesson close, locale change |
| Trigger | `maybeStartSpacedReview` on lesson close and `progress_pedestal` **E** |
| Due → items | `dueReviews()` → `pickReviewItems(..., 3)` → `new ReviewRunner(...)` → `openLesson` |
| Grade path | `ReviewRunner.submitAnswer` → `gradeItem` → `recordAttempt` → `rescheduleReview` |
| Debug | `applySrDebugOverride` on boot when `?sr=1` forces queued `dueAt = now` |
| Boards / unlock | Boards 4–6 still in `WorldSites`; L3→`lesson_board_4` → L4→5 → L5→6 chain present in content |
| Build | `tsc && vite build` **pass** |

### Simulation (L1 mastery, no Vite)

After enqueueing L1 KPs at `dueAt = now`: `dueReviews` returns 3 KPs; `pickReviewItems` returns `alg1-l01-i01..i03` → ReviewRunner would open.

---

## Blind A/B

**Would a player see a spaced-retrieval chalkboard in one normal play session?**

**Yes.** Pass independent ≥80% → queue entries due immediately → close the board (or pedestal **E**) → `dueReviews()` non-empty → chalkboard titled “Spaced retrieval” → answers call `recordAttempt` / `rescheduleReview`. Reload keeps the queue via localStorage; `?sr=1` can force due for critic retests.

Prior FAIL (schedule +1d + memory-only progress) is closed.

---

## Verdict: **PASS**

Prior largest gap is remediated. Same-session path is live; persist and optional `?sr=1` support cross-reload / critic inject; build green; boards/unlock intact.

### Residual nits (not deciding)

- `enqueueReviewOnMastery` does not dedupe — re-passing a lesson stacks queue entries
- HUD `hideLesson()` runs before `onLessonClose`; mid-review exit while `canClose()` is false can blank the chalkboard until another site interaction recovers (pre-existing close ordering, not the due-queue gap)
