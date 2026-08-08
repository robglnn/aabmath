# Critic remediation — Wave 2 SR FAIL → due in play

**Trigger:** [World/SR critic](critic-world-sr-wave2.md) FAIL — `ReviewRunner` wired but `dueReviews()` empty in every realistic session.

**Root cause:** Mastery enqueued reviews at `now + 1 day`; progress was in-memory only; no dev inject. Closing a lesson or hitting the progress pedestal called `maybeStartSpacedReview`, which saw an empty due queue.

**Fix applied:**

1. **`progressStorage.ts`** — `loadPlayerProgress` / `savePlayerProgress` persist full `PlayerProgress` (including `spacedQueue`, `mastery`, `completedLessons`, `theta`, `score`, `locale`) to `localStorage` key `axiom-reach-player-progress`. `GameApp` loads on boot and saves after lesson/review attempts, lesson close, and locale change.
2. **`PedagogyEngine.enqueueReviewOnMastery`** — first enqueue after lesson mastery sets `dueAt = now` (in-session). `rescheduleReview` after a correct retrieval still pushes longer intervals (days).
3. **Review path unchanged:** `dueReviews` → `pickReviewItems` → `ReviewRunner` → `recordAttempt` → `rescheduleReview`.
4. **Debug (optional):** `?sr=1` forces all queued reviews due now (for critics testing persisted queues).

**How a player triggers SR in one session:**

```
Complete lesson independent set ≥ 80%
  → completeLessonIfPassed enqueues each KP with dueAt = now
  → persist to localStorage
Close lesson (or press E at progress_pedestal)
  → maybeStartSpacedReview
  → dueReviews() non-empty
  → ReviewRunner (1–3 retrieval items)
  → recordAttempt + rescheduleReview (next due in hours/days)
```

**Files touched:**

| File | Change |
|---|---|
| `src/pedagogy/progressStorage.ts` | New — load/save/normalize + `?sr=1` override |
| `src/pedagogy/PedagogyEngine.ts` | `enqueueReviewOnMastery` (in-session due) |
| `src/game/GameApp.ts` | Load progress on boot; persist on mutations |
| `public/workbench.html` | SR line → REMEDIATED awaiting critic |
| `docs/gauntlet/remediation-sr-due-in-play.md` | This note |

**Next:** Fresh critic — pass L1 ≥80%, close board, confirm spaced-retrieval chalkboard; reload page, confirm queue survives and pedestal can reopen SR when due.
