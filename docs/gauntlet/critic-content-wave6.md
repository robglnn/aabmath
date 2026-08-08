# Critic — Algebra I Content + Pedagogy (Wave 6 / L16–L18)

**Date:** 2026-08-08  
**Critic:** Fresh context (did not author L16–L18). Harsh.  
**Claim:** [wave6-content-notes.md](./wave6-content-notes.md)  
**Artifacts:** `content/algebra1/lesson-{16,17,18}.json`, `knowledge-points.json`, `standards-index.json`, `src/game/world/WorldSites.ts`, unlock via L15, `loadContent.ts`, `src/ui/math/renderKatex.ts`, `LessonScreen`, `npm run build`

---

## Bar (judged against this)

- Schema vs `types.ts`; objective → teach → guided → independent; **2 / 5 / 10**; `masteryThreshold` 0.8
- EN/ES/PL; **distinct feedback** (not equation clones); high `promptMath`; KaTeX choices not raw `\` / caret-only via `textContent`
- TX TEKS + CCSS; IRT priors; `correctIndex` spread; unlock L15→16→17→18; boards in world; build green

---

## Spot-check: what holds

| Check | Finding |
|---|---|
| Schema / phases | L16–L18: objective→teach→guided→independent; **2 / 5 / 10**; `masteryThreshold` 0.8; fields match `LessonPack` / `LessonItem`; section `itemIds` resolve (0 dangling) |
| Locales | EN/ES/PL on titles, bodies, prompts, feedback, choices; prose MC labels localized (0 EN-only paste) |
| Distinct feedback | **0 / 17** `feedbackCorrect` equation clones per pack (EN≠ES≠PL prose); incorrect: **1** identical equation string (`alg1-l17-i05`) — wave5 gap largely closed |
| `promptMath` | **17 / 17** each pack (51 / 51) |
| KaTeX choices | Math MC wrapped `$...$`; **0** raw backslash-without-`$`; bare choices are localized prose (direction / count / extrema) |
| Choice render | `LessonScreen` → `renderChoiceLabel` still wired; runtime `shuffleMcChoices` intact |
| Standards | TX + CCSS on every item; `lessonCoverage` for `alg1-l16`–`alg1-l18` |
| IRT | `a`/`b`/`c` on all 51 items |
| KP graph | +9 quadratic KPs present; prerequisites resolve; no dangling IDs |
| `correctIndex` hist | Each pack `[5,4,4,4]`; independent `[3,2,2,3]` → always-A authored = 30% ≪ 80% |
| Unlock chain | L15→`lesson_board_16` → L16→`_17` → L17→`_18` → L18→`_19` teaser |
| World boards | `lesson_board_16\|17\|18` in `WorldSites.ts` at (−20,−22), (30,22), (4,−34) |
| Registration | `import.meta.glob('lesson-*.json')`; eighteen lesson files on disk |
| Build | `npm run build` → **green** (`tsc && vite build`) |

Math spot-check (zero-product / factoring roots, discriminant & formula apply, parabola direction / axis / vertex): authored keys correct on sampled teach/guided/independent items (incl. `3x²−12x=0` → `{0,4}`, `2x²−3x−2=0` → `{2,−1/2}`, vertex of `x²+6x+5` → `(−3,−4)`).

---

## Residual (not deciding)

- **ES/PL math choices still embed English `\text{ or }`** (~104 labels) — feedback is trilocal; conjunction inside KaTeX is not.
- One incorrect-feedback equation clone: `alg1-l17-i05` (`b² − 4ac = 1 − 4·1·1 = −3.` identical EN/ES/PL).
- `lesson_board_19` is unlock teaser only (no world mesh) — same pattern as prior wave teasers.
- No live board playthrough of boards 16–18 in this critic pass.

---

## Verdict: **PASS**

### Single largest remaining gap (non-blocking)

**English `or` inside ES/PL KaTeX choice labels** — trilocal feedback (the wave5 fail mode) is fixed, but solution-pair choices still say `\text{ or }` in Spanish and Polish. Optional polish; not a gate fail.

Wave 6 clears schema, phases, counts, mastery 0.8, distinct EN/ES/PL feedback, `promptMath`, KaTeX-safe choices, TX+CCSS, IRT, key spread, unlock L15→16→17→18, boards 16–18, and green build.
