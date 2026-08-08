# Wave 2 — Algebra I L4–L6 content notes

**Date:** 2026-08-08  
**Pipeline:** `docs/pipeline.md` · schema `src/content/types.ts`  
**Author script:** `scripts/author-algebra1-l4-l6.mjs`

## Lessons

| Lesson | Theme | siteId | unlockOnMastery | Items (T/G/I) |
|--------|--------|--------|-----------------|---------------|
| alg1-l04 | Multi-step equations, both sides, verify | `lesson_board_4` | `lesson_board_5` | 2 / 5 / 10 |
| alg1-l05 | Inequalities + number line | `lesson_board_5` | `lesson_board_6` | 2 / 5 / 10 |
| alg1-l06 | Linear functions, rate, slope | `lesson_board_6` | `lesson_board_7` (teaser) | 2 / 5 / 10 |

All packs: `masteryThreshold: 0.8`, phases objective→teach→guided→independent, EN/ES/PL prompts + feedback, TX+CCSS standards, IRT priors, diagnostic distractors on MCs.

## Knowledge points added (9)

- `kp.alg1.solve.multi.step` ← prereq `solve.two.step`
- `kp.alg1.solve.both.sides` ← `solve.multi.step`
- `kp.alg1.equation.verify` ← `equation.meaning`, `solve.one.step`
- `kp.alg1.inequality.meaning` ← `equation.meaning`, `solve.one.step`
- `kp.alg1.inequality.one.step` ← `inequality.meaning`, `solve.one.step`
- `kp.alg1.inequality.two.step` ← `inequality.one.step`, `solve.two.step`
- `kp.alg1.function.linear.intro` ← `solve.two.step`, `eval.substitute`
- `kp.alg1.rate.of.change` ← `function.linear.intro`
- `kp.alg1.slope.intuition` ← `rate.of.change`

## Unlock chain

L1→board_2 → L2→board_3 → **L3→board_4** → L4→board_5 → L5→board_6 → L6→board_7 (teaser; no world mesh required).

## Integration

- `loadContent.ts` globs `lesson-*.json` (L4–L6 auto-load)
- `standards-index.json` `lessonCoverage` for `alg1-l04`–`alg1-l06`
- World boards 4–6 already placed in `WorldSites.ts` (reuse chalkboard mesh)
