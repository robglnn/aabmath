# Wave 4 — Algebra I L10–L12 content notes

**Date:** 2026-08-08  
**Pipeline:** `docs/pipeline.md` · schema `src/content/types.ts`  
**Author script:** `scripts/author-algebra1-l10-l12.mjs`

## Lessons

| Lesson | Theme | siteId | unlockOnMastery | Items (T/G/I) |
|--------|--------|--------|-----------------|---------------|
| alg1-l10 | Systems — elimination + checking | `lesson_board_10` | `lesson_board_11` | 2 / 5 / 10 |
| alg1-l11 | Exponent properties (product/quotient/power) | `lesson_board_11` | `lesson_board_12` | 2 / 5 / 10 |
| alg1-l12 | Polynomials — classify / add / subtract | `lesson_board_12` | `lesson_board_13` (teaser) | 2 / 5 / 10 |

All packs: `masteryThreshold: 0.8`, phases objective→teach→guided→independent, EN/ES/PL prompts + feedback, TX+CCSS standards, IRT priors, diagnostic distractors on MCs. Authored `correctIndex` hist per pack `[5,4,4,4]`. **KaTeX:** `promptMath` on **17/17** items each; **0** raw `\frac` / `\\` in MC choice strings (Unicode / plain exponents in choices).

## Knowledge points added (9)

- `kp.alg1.systems.elimination` ← `systems.meaning`, `systems.substitution`
- `kp.alg1.systems.elimination.scale` ← `systems.elimination`
- `kp.alg1.systems.verify` ← `systems.meaning`, `equation.verify`
- `kp.alg1.exponents.product` ← `order.ops`, `expression.parts`
- `kp.alg1.exponents.quotient` ← `exponents.product`
- `kp.alg1.exponents.power` ← `exponents.product`
- `kp.alg1.polynomial.classify` ← `expression.parts`, `exponents.product`
- `kp.alg1.polynomial.add` ← `polynomial.classify`, `expression.parts`
- `kp.alg1.polynomial.subtract` ← `polynomial.add`

## Unlock chain

… L8→board_9 → **L9→board_10** → L10→board_11 → L11→board_12 → L12→board_13 (teaser; no world mesh required).

## Integration

- `loadContent.ts` globs `lesson-*.json` (L10–L12 auto-load)
- `standards-index.json` `lessonCoverage` for `alg1-l10`–`alg1-l12` (+ `A.11(B)`, `A.10(A)`, `A-REI.C.5`, `8.EE.A.1`, `A-APR.A.1`, …)
- World boards 10–12 in `WorldSites.ts` (spread: (−26,−8), (28,−4), (−4,32))

## Item counts

| Pack | Total |
|------|-------|
| alg1-l10 | 17 |
| alg1-l11 | 17 |
| alg1-l12 | 17 |
| **Wave 4** | **51** |
