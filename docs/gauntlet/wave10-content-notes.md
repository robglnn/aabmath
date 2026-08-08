# Wave 10 — Algebra I L28–30 content notes (COURSE CAPSTONE)

**Date:** 2026-08-08  
**Pipeline:** `docs/pipeline.md` · schema `src/content/types.ts`  
**Author script:** `scripts/author-algebra1-l28-l30.mjs`

## Lessons

| Lesson | Theme | siteId | unlockOnMastery | Items (T/G/I) |
|--------|--------|--------|-----------------|---------------|
| alg1-l28 | Piecewise functions intro | `lesson_board_28` | `lesson_board_29` | 2 / 5 / 10 |
| alg1-l29 | Cumulative mixed review (expr → eq → fn → quadratic) | `lesson_board_29` | `lesson_board_30` | 2 / 5 / 10 |
| alg1-l30 | Algebra I course capstone / mastery check | `lesson_board_30` | `course_algebra1_complete` | 2 / 5 / 10 |

All packs: `masteryThreshold: 0.8`, phases objective→teach→guided→independent, EN/ES/PL prompts + **distinct** trilocal feedback (0 equation-only clones after polish), TX+CCSS standards, IRT priors, diagnostic distractors on MCs. Authored `correctIndex` hist per pack `[5,4,4,4]`. **KaTeX:** `promptMath` on **17/17** items each; math MC choices wrapped in `$...$`. **ES/PL KaTeX:** no English `\text{or/and/yes/no/true/false}`.

## Knowledge points added (9)

- `kp.alg1.piecewise.meaning` ← `function.notation`, `function.domain`
- `kp.alg1.piecewise.evaluate` ← `piecewise.meaning`, `eval.substitute`
- `kp.alg1.piecewise.graph` ← `piecewise.evaluate`, `graph.slope.intercept`
- `kp.alg1.review.expr.eq` ← `solve.multi.step`, `expression.translate`
- `kp.alg1.review.linear.fn` ← `slope.intercept.form`, `systems.substitution`
- `kp.alg1.review.quadratic` ← `quadratic.formula.apply`, `quadratic.graph.features`
- `kp.alg1.capstone.fluency` ← review.* (three)
- `kp.alg1.capstone.connect` ← `capstone.fluency`, `piecewise.evaluate`
- `kp.alg1.capstone.mastery` ← `capstone.connect`, `modeling.choose`

## Unlock chain

… L26→board_27 → **L27→board_28** → L28→board_29 → L29→board_30 → L30→`course_algebra1_complete`.

## Integration

- `loadContent.ts` globs `lesson-*.json` (L28–L30 auto-load)
- `standards-index.json` `lessonCoverage` for `alg1-l28`–`alg1-l30` (+ `F-IF.C.7b`, `A.12(B)`, `A.5(A)`, `A.8(A)`, …)
- World boards 28–30 in `WorldSites.ts` (spread: (8,38), (−36,−24), (36,18))

## Item counts

| Pack | Total | KP ids |
|------|-------|--------|
| alg1-l28 | 17 | piecewise.meaning / evaluate / graph |
| alg1-l29 | 17 | review.expr.eq / linear.fn / quadratic |
| alg1-l30 | 17 | capstone.fluency / connect / mastery |
| **Wave 10** | **51** | **9 new KPs** |
