# Wave 2 — World Hooks (L4–L6) + Spaced Review in Play

**Date:** 2026-08-07  
**Builder scope:** Place lesson boards 4–6 in world; wire real spaced-retrieval flow in PLAY using `PedagogyEngine.dueReviews`.

---

## World site positions (XZ, terrain-grounded)

| siteId | X | Z | Region read | Notes |
|--------|---|---|-------------|-------|
| `lesson_board_1` | -12 | -8 | Starter grassland | Unlocked at spawn |
| `lesson_board_2` | -6 | 4 | Mid grass / forest edge | Unlocks after L1 mastery |
| `lesson_board_3` | 2 | -14 | South grass toward lake | Unlocks after L2 mastery |
| `lesson_board_4` | 22 | 8 | East foothills | Board placed; unlock when L3+ content sets `unlockOnMastery` |
| `lesson_board_5` | -22 | 10 | West pine band | Same — awaits L4/L5 content chain |
| `lesson_board_6` | 6 | 26 | North ruins / mountain approach | Same — awaits L5/L6 content chain |
| `progress_pedestal` | 14 | -6 | East grass | Progress report + SR trigger |
| `hub_plaza` | 0 | 12 | Central hub | Module select |
| `dig_crater_1` | 10 | 18 | North-east dig | Palm laser reveal |

Boards are spread across quadrants (not stacked). L4–L6 JSON is loaded automatically via `import.meta.glob` when `content/algebra1/lesson-04.json` etc. appear; `lessonByWorldSite` resolves `siteId` without code changes.

---

## Unlock gating

- `PedagogyEngine.unlockedSiteIds(lessons)` is the single source of truth: base `lesson_board_1` + every `worldHook.unlockOnMastery` from completed lessons.
- `GameApp` no longer keeps a parallel `Set`; proximity poll and **E** interact both consult `unlockedSiteIds`.
- Locked boards remain visible in world but are excluded from proximity / interact until unlocked.

---

## Spaced review triggers

| Trigger | When | Flow |
|---------|------|------|
| **After lesson close** | Player closes lesson HUD (gate passed or teach/guided only) | If `dueReviews().length > 0` → run 1–3 retrieval items → then dig mode |
| **Progress pedestal E** | Player presses **E** near `progress_pedestal` | If due reviews → retrieval first → then Progress Report HUD |

### Retrieval implementation

1. `PedagogyEngine.dueReviews()` — KPs with `spacedQueue.dueAt <= now` (enqueued on lesson mastery via `completeLessonIfPassed`).
2. `pickReviewItems(content, due, max=3)` — one item per due KP, preferring independent-practice items from L1–L3 packs.
3. `ReviewRunner` — reuses diegetic **Lesson** HUD (chalkboard mount, KaTeX, choice/text input). Phase label: *Spaced retrieval*; footer `SPACED RETRIEVAL`.
4. On each answer: `recordAttempt` + `rescheduleReview(kpId, correct)` (SM-2-ish interval bump / reset).
5. After final item + continue on completion screen → close returns to pending action (dig mode or progress report).

Reviews are **real**: they grade against lesson items, update IRT/mastery attempts, and reschedule the queue — not schema-only.

---

## Content agent handoff

When authoring L4–L6:

```json
"worldHook": {
  "siteId": "lesson_board_4",
  "unlockOnMastery": ["lesson_board_5"]
}
```

Point L3 `unlockOnMastery` at `lesson_board_4` when ready. No world code changes required.

---

## Verify

```bash
npm run build
```

In play: complete L1 (or inject due queue in dev), wait for `dueAt`, close lesson or visit progress pedestal — retrieval chalkboard should appear before returning to roam/dig.
