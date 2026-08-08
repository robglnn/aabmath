# Wave 3 — Algebra I L7–L9 content notes

**Date:** 2026-08-08  
**Pipeline:** `docs/pipeline.md` · schema `src/content/types.ts`  
**Author script:** `scripts/author-algebra1-l7-l9.mjs`

## Lessons

| Lesson | Theme | siteId | unlockOnMastery | Items (T/G/I) |
|--------|--------|--------|-----------------|---------------|
| alg1-l07 | Slope-intercept form & graphing | `lesson_board_7` | `lesson_board_8` | 2 / 5 / 10 |
| alg1-l08 | Writing equations + parallel slopes | `lesson_board_8` | `lesson_board_9` | 2 / 5 / 10 |
| alg1-l09 | Systems: graphical + substitution intro | `lesson_board_9` | `lesson_board_10` (teaser) | 2 / 5 / 10 |

All packs: `masteryThreshold: 0.8`, phases objective→teach→guided→independent, EN/ES/PL prompts + feedback, TX+CCSS standards, IRT priors, diagnostic distractors on MCs. Authored `correctIndex` hist per pack `[5,4,4,4]` (not all 0); runtime shuffle still applies.

## Knowledge points added (9)

- `kp.alg1.slope.intercept.form` ← `slope.intuition`, `function.linear.intro`
- `kp.alg1.graph.slope.intercept` ← `slope.intercept.form`
- `kp.alg1.intercept.identify` ← `slope.intercept.form`
- `kp.alg1.write.equation.slope.yint` ← `slope.intercept.form`, `graph.slope.intercept`
- `kp.alg1.write.equation.point.slope` ← `write.equation.slope.yint`, `slope.intuition`
- `kp.alg1.parallel.slope` ← `slope.intercept.form`, `write.equation.slope.yint`
- `kp.alg1.systems.meaning` ← `graph.slope.intercept`, `equation.meaning`
- `kp.alg1.systems.graphical` ← `systems.meaning`, `graph.slope.intercept`
- `kp.alg1.systems.substitution` ← `systems.meaning`, `solve.two.step`

## Unlock chain

… L5→board_6 → **L6→board_7** → L7→board_8 → L8→board_9 → L9→board_10 (teaser; no world mesh required).

## Integration

- `loadContent.ts` globs `lesson-*.json` (L7–L9 auto-load)
- `standards-index.json` `lessonCoverage` for `alg1-l07`–`alg1-l09`
- World boards 7–9 placed in `WorldSites.ts` (spread positions; reuse chalkboard mesh)

## Item counts

| Pack | Total |
|------|-------|
| alg1-l07 | 17 |
| alg1-l08 | 17 |
| alg1-l09 | 17 |
| **Wave 3** | **51** |
