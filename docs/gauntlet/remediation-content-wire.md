# Critic remediation — Content Wave 1 FAIL → pedagogy wire

**Trigger:** [Content critic](critic-content-wave1.md) FAIL — packs on disk, gate math in engine, but play path never scored independent sets.

**Fix applied:**

1. **`LessonRunner`** (`src/game/lesson/LessonRunner.ts`) drives objective → teach → guided → independent from `LessonPack` sections/items; locale from HUD; KaTeX via `promptMath`; every attempt recorded on `PedagogyEngine`.
2. **`GameApp`** loads `loadAlgebra1Content()`, maps `lesson_board_{1,2,3}` via `lessonByWorldSite`, starts `LessonRunner` on **E** near an unlocked board (no stub `x+3=7`).
3. **80% gate:** after the last independent item, `completeLessonIfPassed(lesson, results)` runs; if accuracy &lt; `masteryThreshold` (0.8): HUD shows gate fail, **close disabled**, independent phase resets for retry; lesson **not** marked complete; `unlockOnMastery` sites stay locked.
4. **`lessonPassed` hardened:** `independentResults.length` must equal `getIndependentItemIds(lesson).length` or gate fails.
5. **Progress Report** (`buildProgressReport.ts`) reads real mastery % and completion from engine after attempts.
6. **World:** `lesson_board_2` and `lesson_board_3` chalkboard sites added; board 1 unlocked by default; board 2/3 unlock only after prior lesson mastery.

**Gate block flow (student-facing):**

```
independent items answered → scoreIndependentSet
  ├─ accuracy ≥ 80% AND full item count → completeLessonIfPassed → unlock next board → close allowed
  └─ else → gate fail UI, close blocked, retry independent set (no completion/unlock)
```

**Files touched:**

| File | Change |
|---|---|
| `src/game/lesson/LessonRunner.ts` | New — phase/item driver + gate |
| `src/game/lesson/gradeItem.ts` | New — MC / numeric / LaTeX grading |
| `src/game/lesson/buildProgressReport.ts` | New — engine-backed report data |
| `src/game/GameApp.ts` | Content + pedagogy + lesson wire |
| `src/pedagogy/PedagogyEngine.ts` | Strict `lessonPassed` length check |
| `src/ui/types.ts` | Extended `LessonScreenData` |
| `src/ui/components/LessonScreen.ts` | Choices, phase, feedback, gate, close lock |
| `src/ui/i18n.ts` | continue / retry / answer strings |
| `src/game/world/WorldSites.ts` | `lesson_board_2`, `lesson_board_3` |
| `public/workbench.html` | Log + status update |

**Next:** Fresh critic — fail independent set at ~70%, confirm unlock denied; pass ≥80%, confirm `lesson_board_2` unlocks after L1.
