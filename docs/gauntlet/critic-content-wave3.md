# Critic — Algebra I Content + Pedagogy (Wave 3 / L7–L9)

**Date:** 2026-08-08  
**Critic:** Fresh context (did not author L7–L9). Harsh.  
**Claim:** [wave3-content-notes.md](./wave3-content-notes.md)  
**Artifacts:** `content/algebra1/lesson-0{7,8,9}.json`, `knowledge-points.json`, `standards-index.json`, `src/game/world/WorldSites.ts`, unlock via L6, `loadContent.ts`, `npm run build`

---

## Bar (judged against this)

- Schema vs `types.ts`; teach → guided → independent; ≥4 guided ≥8 independent; `masteryThreshold` 0.8
- EN/ES/PL; **KaTeX**; TX TEKS + CCSS; IRT priors; diagnostic distractors
- `correctIndex` not all-0 (spread); runtime shuffle assumed present
- Unlock L6→`lesson_board_7`→`_8`→`_9`; boards in world; loadable via glob / `lessonByWorldSite`
- `npm run build` green

---

## Spot-check: what holds

| Check | Finding |
|---|---|
| Schema / phases | L7–L9: objective→teach→guided→independent; **2 / 5 / 10**; `masteryThreshold` 0.8; fields match `LessonPack` / `LessonItem` |
| Locales | EN/ES/PL on titles, bodies, prompts, feedback, choices; EN ≠ ES ≠ PL on all 51 prompts |
| Standards | TX + CCSS on every item; `standards-index.json` `lessonCoverage` for `alg1-l07`–`alg1-l09` |
| IRT | Diversified `a`/`b`/`c` on all items |
| Diagnostic tags | Present on all MCs |
| KP graph | +9 KPs present; prereqs chain to `kp.alg1.variable.identify` / L1–L6 roots |
| `correctIndex` hist | Each pack `[5,4,4,4]` (max share ~29%); independent `[3,2,2,3]` → always-A authored = 30% ≪ 80% |
| Runtime shuffle | Still present (`shuffleMcChoices` + `LessonRunner` / `ReviewRunner`) |
| Unlock chain | L6→`lesson_board_7` → L7→`_8` → L8→`_9` → L9→`_10` teaser |
| World boards | `lesson_board_7|8|9` in `WorldSites.ts` (spread positions; chalkboard mesh) |
| Registration | `import.meta.glob('lesson-*.json')` + `lessonByWorldSite`; nine lesson files on disk |
| Build | `npm run build` → **green** (`tsc && vite build`) |

Math spot-check on independent keys (slope-intercept rewrite, point+slope → b, parallel through point, substitution systems): authored answers correct.

---

## Spot-check: what breaks the KaTeX bar

Wave 1 standard: *“Nearly all items carry `promptMath` (or teach `bodyMath`).”* Choices are plain `textContent` in `LessonScreen` (no KaTeX).

| Pack | `promptMath` coverage | Raw `\frac{...}` in MC **choices** (unrendered) |
|---|---|---|
| alg1-l07 | 12 / 17 | `alg1-l07-i05` (independent) |
| alg1-l08 | **2 / 17** | `g01`, `g03`, `g04`, `g05`, `i07` |
| alg1-l09 | 6 / 17 | none |

L8 collapses KaTeX to teach `bodyMath` plus two items. Five L8 MCs (and one L7 independent) put KaTeX source into choice buttons, so players see literal `\frac{1}{2}x + 6` instead of a fraction. That is not “KaTeX where needed” — it is broken math display on the assessment surface.

Secondary (not deciding): KP id `write.equation.point.slope` teaches y=mx+b via a point (no classic point-slope form); graphing is MC-about-points only — acceptable for this slice if KaTeX were fixed.

---

## Verdict: **FAIL**

### Single largest remaining gap

**KaTeX bar miss: L8 ships almost no `promptMath` (2/17), and multiple L7/L8 MC choices embed raw `\frac{...}` strings that `LessonScreen` renders as plain text — students see broken LaTeX on guided/independent items.**

### One biggest fix (next builder)

1. For every MC choice that needs a fraction/equation, either (a) rewrite choices to plain Unicode / `(1/2)` form that reads in `textContent`, **or** (b) render choice labels through KaTeX.
2. Restore wave-1-level `promptMath` on L8 (and thin L9) equation stems so the chalkboard KaTeX area is not empty on most items.
3. Re-spot-check: zero `\frac` / `\\` in choice strings unless choices are KaTeX-rendered; re-enter critic.

### Explicitly out of scope / not re-litigated

- World mesh for `lesson_board_10` teaser
- Live browser playthrough of boards 7–9
- Interactive graphing UI (MC point-checks are the authored substitute)
