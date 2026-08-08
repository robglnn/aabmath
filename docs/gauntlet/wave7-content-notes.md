# Wave 7 — Algebra I L19–21 content notes

**Date:** 2026-08-08  
**Pipeline:** `docs/pipeline.md` · schema `src/content/types.ts`  
**Author script:** `scripts/author-algebra1-l19-l21.mjs`

## Lessons

| Lesson | Theme | siteId | unlockOnMastery | Items (T/G/I) |
|--------|--------|--------|-----------------|---------------|
| alg1-l19 | Exponential growth/decay intro | `lesson_board_19` | `lesson_board_20` | 2 / 5 / 10 |
| alg1-l20 | Radical expressions / square roots | `lesson_board_20` | `lesson_board_21` | 2 / 5 / 10 |
| alg1-l21 | Rational expressions intro | `lesson_board_21` | `lesson_board_22` (teaser) | 2 / 5 / 10 |

All packs: `masteryThreshold: 0.8`, phases objective→teach→guided→independent, EN/ES/PL prompts + **distinct** trilocal feedback (0 equation-only clones per pack), TX+CCSS standards, IRT priors, diagnostic distractors on MCs. Authored `correctIndex` hist per pack `[5,4,4,4]`. **KaTeX:** `promptMath` on **17/17** items each; math MC choices wrapped in `$...$`. **ES/PL KaTeX:** no English `\text{ or }` (localized prose choices / math-only labels).

## Knowledge points added (9)

- `kp.alg1.exponential.recognize` ← `graph.slope.intercept`, `exponents.product`
- `kp.alg1.exponential.form` ← `exponential.recognize`, `exponents.power`
- `kp.alg1.exponential.evaluate` ← `exponential.form`
- `kp.alg1.radical.perfect.squares` ← `exponents.power`, `order.ops`
- `kp.alg1.radical.simplify` ← `radical.perfect.squares`, `factor.gcf`
- `kp.alg1.radical.operations` ← `radical.simplify`
- `kp.alg1.rational.simplify` ← `factor.gcf`, `exponents.quotient`
- `kp.alg1.rational.multiply` ← `rational.simplify`, `factor.trinomial.a1`
- `kp.alg1.rational.divide` ← `rational.multiply`

## Unlock chain

… L17→board_18 → **L18→board_19** → L19→board_20 → L20→board_21 → L21→board_22 (teaser; no world mesh required).

## Integration

- `loadContent.ts` globs `lesson-*.json` (L19–L21 auto-load)
- `standards-index.json` `lessonCoverage` for `alg1-l19`–`alg1-l21` (+ `A.9(B/C/D)`, `A.11(A)`, `A.10(D)`, `F-LE.A.1c`, `F-LE.A.2`, `F-IF.C.7e`, `N-RN.A.2`, `A-APR.D.6`, …)
- World boards 19–21 in `WorldSites.ts` (spread: (−28,18), (22,−28), (−12,30))

## Item counts

| Pack | Total |
|------|-------|
| alg1-l19 | 17 |
| alg1-l20 | 17 |
| alg1-l21 | 17 |
| **Wave 7** | **51** |
