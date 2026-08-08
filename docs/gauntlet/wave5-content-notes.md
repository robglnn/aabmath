# Wave 5 — Algebra I L13–15 content notes

**Date:** 2026-08-08  
**Pipeline:** `docs/pipeline.md` · schema `src/content/types.ts`  
**Author script:** `scripts/author-algebra1-l13-l15.mjs`

## Lessons

| Lesson | Theme | siteId | unlockOnMastery | Items (T/G/I) |
|--------|--------|--------|-----------------|---------------|
| alg1-l13 | Multiply polynomials — distribute & FOIL | `lesson_board_13` | `lesson_board_14` | 2 / 5 / 10 |
| alg1-l14 | Factor GCF + simple trinomials (a=1) | `lesson_board_14` | `lesson_board_15` | 2 / 5 / 10 |
| alg1-l15 | Difference of squares + more trinomials | `lesson_board_15` | `lesson_board_16` (teaser) | 2 / 5 / 10 |

All packs: `masteryThreshold: 0.8`, phases objective→teach→guided→independent, EN/ES/PL prompts + feedback, TX+CCSS standards, IRT priors, diagnostic distractors on MCs. Authored `correctIndex` hist per pack `[5,4,4,4]`. **KaTeX:** `promptMath` on **17/17** items each; math MC choices wrapped in `$...$` for `renderChoiceLabel` (no bare ASCII-caret-only labels).

## Knowledge points added (9)

- `kp.alg1.polynomial.distribute` ← `polynomial.classify`, `exponents.product`
- `kp.alg1.polynomial.foil` ← `polynomial.distribute`
- `kp.alg1.polynomial.multiply` ← `polynomial.foil`
- `kp.alg1.factor.gcf` ← `polynomial.distribute`, `polynomial.classify`
- `kp.alg1.factor.trinomial.a1` ← `factor.gcf`, `polynomial.foil`
- `kp.alg1.factor.verify` ← `factor.trinomial.a1`, `polynomial.foil`
- `kp.alg1.factor.difference.squares` ← `factor.gcf`, `polynomial.foil`
- `kp.alg1.factor.trinomial.more` ← `factor.trinomial.a1`
- `kp.alg1.factor.perfect.square` ← `factor.trinomial.a1`, `factor.difference.squares`

## Unlock chain

… L11→board_12 → **L12→board_13** → L13→board_14 → L14→board_15 → L15→board_16 (teaser; no world mesh required).

## Integration

- `loadContent.ts` globs `lesson-*.json` (L13–L15 auto-load)
- `standards-index.json` `lessonCoverage` for `alg1-l13`–`alg1-l15` (+ `A.10(B)`, `A.10(D)`, `A.10(E)`, `A.10(F)`, `A-SSE.A.2`, `A-SSE.B.3a`, …)
- World boards 13–15 in `WorldSites.ts` (spread: (18,30), (−30,18), (12,−26))

## Item counts

| Pack | Total |
|------|-------|
| alg1-l13 | 17 |
| alg1-l14 | 17 |
| alg1-l15 | 17 |
| **Wave 5** | **51** |
