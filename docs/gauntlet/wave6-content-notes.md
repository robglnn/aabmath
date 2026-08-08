# Wave 6 — Algebra I L16–18 content notes

**Date:** 2026-08-08  
**Pipeline:** `docs/pipeline.md` · schema `src/content/types.ts`  
**Author script:** `scripts/author-algebra1-l16-l18.mjs`

## Lessons

| Lesson | Theme | siteId | unlockOnMastery | Items (T/G/I) |
|--------|--------|--------|-----------------|---------------|
| alg1-l16 | Solve quadratics by factoring | `lesson_board_16` | `lesson_board_17` | 2 / 5 / 10 |
| alg1-l17 | Quadratic formula + discriminant | `lesson_board_17` | `lesson_board_18` | 2 / 5 / 10 |
| alg1-l18 | Parabolas — vertex & axis intro | `lesson_board_18` | `lesson_board_19` (teaser) | 2 / 5 / 10 |

All packs: `masteryThreshold: 0.8`, phases objective→teach→guided→independent, EN/ES/PL prompts + **distinct** trilocal feedback (0/17 equation-only clones per pack), TX+CCSS standards, IRT priors, diagnostic distractors on MCs. Authored `correctIndex` hist per pack `[5,4,4,4]`. **KaTeX:** `promptMath` on **17/17** items each; math MC choices wrapped in `$...$`.

## Knowledge points added (9)

- `kp.alg1.quadratic.zero.product` ← `factor.trinomial.a1`, `factor.verify`
- `kp.alg1.quadratic.solve.factoring` ← `quadratic.zero.product`, `factor.trinomial.a1`, `factor.difference.squares`
- `kp.alg1.quadratic.check.roots` ← `quadratic.solve.factoring`
- `kp.alg1.quadratic.formula` ← `quadratic.solve.factoring`
- `kp.alg1.quadratic.discriminant` ← `quadratic.formula`
- `kp.alg1.quadratic.formula.apply` ← `quadratic.formula`, `quadratic.discriminant`
- `kp.alg1.quadratic.parabola.direction` ← `graph.slope.intercept`, `quadratic.solve.factoring`
- `kp.alg1.quadratic.vertex.axis` ← `quadratic.parabola.direction`
- `kp.alg1.quadratic.graph.features` ← `quadratic.vertex.axis`, `quadratic.check.roots`

## Unlock chain

… L14→board_15 → **L15→board_16** → L16→board_17 → L17→board_18 → L18→board_19 (teaser; no world mesh required).

## Integration

- `loadContent.ts` globs `lesson-*.json` (L16–L18 auto-load)
- `standards-index.json` `lessonCoverage` for `alg1-l16`–`alg1-l18` (+ `A.8(A)`, `A.7(A)`, `A-REI.B.4a`, `A-REI.B.4b`, `F-IF.C.7a`, …)
- World boards 16–18 in `WorldSites.ts` (spread: (−20,−22), (30,22), (4,−34))

## Item counts

| Pack | Total |
|------|-------|
| alg1-l16 | 17 |
| alg1-l17 | 17 |
| alg1-l18 | 17 |
| **Wave 6** | **51** |
