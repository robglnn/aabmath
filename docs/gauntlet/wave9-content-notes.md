# Wave 9 — Algebra I L25–27 content notes

**Date:** 2026-08-08  
**Pipeline:** `docs/pipeline.md` · schema `src/content/types.ts`  
**Author script:** `scripts/author-algebra1-l25-l27.mjs`

## Lessons

| Lesson | Theme | siteId | unlockOnMastery | Items (T/G/I) |
|--------|--------|--------|-----------------|---------------|
| alg1-l25 | Systems of linear inequalities (graphical region) | `lesson_board_25` | `lesson_board_26` | 2 / 5 / 10 |
| alg1-l26 | Scatter plots, correlation, line of best fit | `lesson_board_26` | `lesson_board_27` | 2 / 5 / 10 |
| alg1-l27 | Algebra I modeling / mixed multi-step apps | `lesson_board_27` | `lesson_board_28` (teaser) | 2 / 5 / 10 |

All packs: `masteryThreshold: 0.8`, phases objective→teach→guided→independent, EN/ES/PL prompts + **distinct** trilocal feedback (0 equation-only clones after polish), TX+CCSS standards, IRT priors, diagnostic distractors on MCs. Authored `correctIndex` hist per pack `[5,4,4,4]`. **KaTeX:** `promptMath` on **17/17** items each; math MC choices wrapped in `$...$`. **ES/PL KaTeX:** no English `\text{or/and/yes/no}`; Spanish uses `sí`/`falso` / localized labels (`o` / `lub` / `y` / `i` patterns avoided by symbol/`\vee` where needed).

## Knowledge points added (9)

- `kp.alg1.inequality.two.var` ← `graph.slope.intercept`, `inequality.meaning`
- `kp.alg1.systems.inequalities.region` ← `inequality.two.var`, `systems.meaning`
- `kp.alg1.systems.inequalities.test` ← `systems.inequalities.region`
- `kp.alg1.scatter.interpret` ← `rate.of.change`, `graph.slope.intercept`
- `kp.alg1.correlation.direction` ← `scatter.interpret`
- `kp.alg1.line.best.fit` ← `correlation.direction`, `write.equation.slope.yint`
- `kp.alg1.modeling.write` ← `expression.translate`, `write.equation.slope.yint`
- `kp.alg1.modeling.multi.step` ← `modeling.write`, `solve.multi.step`
- `kp.alg1.modeling.choose` ← `modeling.multi.step`, `systems.verify`

## Unlock chain

… L23→board_24 → **L24→board_25** → L25→board_26 → L26→board_27 → L27→board_28 (teaser; no world mesh required).

## Integration

- `loadContent.ts` globs `lesson-*.json` (L25–L27 auto-load)
- `standards-index.json` `lessonCoverage` for `alg1-l25`–`alg1-l27` (+ `A.3(D/H)`, `A.4(A/B/C)`, `A-REI.D.12`, `A-CED.A.1/2/3`, `S-ID.B.6/6a`, `S-ID.C.7/8/9`, …)
- World boards 25–27 in `WorldSites.ts` (spread: (−16,36), (32,−30), (−34,8))

## Item counts

| Pack | Total |
|------|-------|
| alg1-l25 | 17 |
| alg1-l26 | 17 |
| alg1-l27 | 17 |
| **Wave 9** | **51** |
