# Wave 8 — Algebra I L22–24 content notes

**Date:** 2026-08-08  
**Pipeline:** `docs/pipeline.md` · schema `src/content/types.ts`  
**Author script:** `scripts/author-algebra1-l22-l24.mjs`

## Lessons

| Lesson | Theme | siteId | unlockOnMastery | Items (T/G/I) |
|--------|--------|--------|-----------------|---------------|
| alg1-l22 | Absolute value equations & inequalities | `lesson_board_22` | `lesson_board_23` | 2 / 5 / 10 |
| alg1-l23 | Function notation, domain/range intro | `lesson_board_23` | `lesson_board_24` | 2 / 5 / 10 |
| alg1-l24 | Arithmetic & geometric sequences intro | `lesson_board_24` | `lesson_board_25` (teaser) | 2 / 5 / 10 |

All packs: `masteryThreshold: 0.8`, phases objective→teach→guided→independent, EN/ES/PL prompts + **distinct** trilocal feedback (0 equation-only clones per pack), TX+CCSS standards, IRT priors, diagnostic distractors on MCs. Authored `correctIndex` hist per pack `[5,4,4,4]`. **KaTeX:** `promptMath` on **17/17** items each; math MC choices wrapped in `$...$`. **ES/PL KaTeX:** no English `\text{ or }` (localized `o` / `lub` / `y` / `i`).

## Knowledge points added (9)

- `kp.alg1.absolute.meaning` ← `inequality.meaning`, `solve.two.step`
- `kp.alg1.absolute.equations` ← `absolute.meaning`, `solve.both.sides`
- `kp.alg1.absolute.inequalities` ← `absolute.equations`, `inequality.two.step`
- `kp.alg1.function.notation` ← `function.linear.intro`, `eval.substitute`
- `kp.alg1.function.domain` ← `function.notation`
- `kp.alg1.function.range` ← `function.domain`, `function.notation`
- `kp.alg1.sequence.arithmetic` ← `rate.of.change`, `function.linear.intro`
- `kp.alg1.sequence.geometric` ← `exponential.recognize`, `sequence.arithmetic`
- `kp.alg1.sequence.nth.term` ← `sequence.arithmetic`, `sequence.geometric`

## Unlock chain

… L20→board_21 → **L21→board_22** → L22→board_23 → L23→board_24 → L24→board_25 (teaser; no world mesh required).

## Integration

- `loadContent.ts` globs `lesson-*.json` (L22–L24 auto-load)
- `standards-index.json` `lessonCoverage` for `alg1-l22`–`alg1-l24` (+ `A.5(A/B)`, `A.12(A/B/C/D)`, `A.2(A)`, `A-REI.B.3`, `A-CED.A.1`, `F-IF.A.1/2`, `F-BF.A.1a/2`, `F-LE.A.2`, `6.NS.C.7c`, …)
- World boards 22–24 in `WorldSites.ts` (spread: (30,12), (−30,−16), (16,32))

## Item counts

| Pack | Total |
|------|-------|
| alg1-l22 | 17 |
| alg1-l23 | 17 |
| alg1-l24 | 17 |
| **Wave 8** | **51** |
