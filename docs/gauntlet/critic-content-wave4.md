# Critic — Algebra I Content + Pedagogy (Wave 4 / L10–L12)

**Date:** 2026-08-08  
**Critic:** Fresh context (did not author L10–L12). Harsh.  
**Claim:** [wave4-content-notes.md](./wave4-content-notes.md)  
**Artifacts:** `content/algebra1/lesson-{10,11,12}.json`, `knowledge-points.json`, `standards-index.json`, `src/game/world/WorldSites.ts`, unlock via L9, `loadContent.ts`, `src/ui/math/renderKatex.ts`, `LessonScreen`, `npm run build`

---

## Bar (judged against this)

- Schema vs `types.ts`; objective → teach → guided → independent; ≥4 guided ≥8 independent; `masteryThreshold` 0.8
- EN/ES/PL; `promptMath` coverage; KaTeX choices not raw `\frac` / `\\` via `textContent`
- TX TEKS + CCSS; IRT priors; `correctIndex` spread; unlock L9→10→11→12; boards in world; build green

---

## Spot-check: what holds

| Check | Finding |
|---|---|
| Schema / phases | L10–L12: objective→teach→guided→independent; **2 / 5 / 10**; `masteryThreshold` 0.8; fields match `LessonPack` / `LessonItem` |
| Locales | EN/ES/PL on titles, bodies, prompts, feedback, choices; EN ≠ ES ≠ PL on all 51 prompts |
| `promptMath` | **17 / 17** each pack (51 / 51) |
| KaTeX choices | **0** raw `\` / `\frac` in MC choice strings; `renderChoiceLabel` wired in `LessonScreen` (wave3b path intact) |
| Standards | TX + CCSS on every item; `lessonCoverage` for `alg1-l10`–`alg1-l12` |
| IRT | `a`/`b`/`c` present on all 51 items |
| KP graph | +9 KPs present (`elimination`/`scale`/`verify`, exponents product/quotient/power, polynomial classify/add/subtract); no dangling IDs |
| `correctIndex` hist | Each pack `[5,4,4,4]`; independent `[3,2,2,3]` → always-A authored = 30% ≪ 80% |
| Runtime shuffle | Still present (`shuffleMcChoices` + `LessonRunner` / `ReviewRunner`) |
| Unlock chain | L9→`lesson_board_10` → L10→`_11` → L11→`_12` → L12→`_13` teaser |
| World boards | `lesson_board_10|11|12` in `WorldSites.ts` at (−26,−8), (28,−4), (−4,32) |
| Registration | `import.meta.glob('lesson-*.json')`; twelve lesson files on disk |
| Build | `npm run build` → **green** (`tsc && vite build`) |

Math spot-check on independent keys (elimination + verify pairs, product/quotient/power rules, classify/add/subtract): authored answers correct.

---

## Residual (not deciding)

- MC choices intentionally use ASCII caret / Unicode (`x^7`, `4x^2 + 2x − 4`) rather than KaTeX source — readable as plain text; chalkboard `promptMath` carries the formal render. Visual polish gap only.
- `lesson_board_13` is unlock teaser only (no world mesh) — same pattern as prior wave teasers.
- No live board playthrough of boards 10–12 in this critic pass.

---

## Verdict: **PASS**

### Single largest remaining gap (non-blocking)

**ASCII caret exponents in MC choices vs KaTeX `promptMath` on the chalkboard** — readable and bar-legal (no raw LaTeX in buttons), but not typographically consistent. Optional polish, not a gate fail.

Wave 4 clears schema, phases, counts, mastery 0.8, locales, `promptMath`, KaTeX-safe choices, TX+CCSS, IRT, key spread, unlock L9→10→11→12, boards 10–12, and green build.
