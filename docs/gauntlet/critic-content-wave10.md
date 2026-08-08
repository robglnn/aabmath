# Critic — Algebra I Content + Pedagogy (Wave 10 / L28–L30 COURSE CAPSTONE)

**Date:** 2026-08-08  
**Critic:** Fresh context (did not author L28–L30). Harsh.  
**Claim:** [wave10-content-notes.md](./wave10-content-notes.md)  
**Artifacts:** `content/algebra1/lesson-{28,29,30}.json`, `knowledge-points.json`, `standards-index.json`, `src/game/world/WorldSites.ts`, unlock via L27 → `course_algebra1_complete`, `loadContent.ts`, `npm run build`

---

## Bar (judged against this)

- Schema vs `types.ts`; objective → teach → guided → independent; **2 / 5 / 10**; `masteryThreshold` 0.8
- EN/ES/PL; **distinct feedback** (not equation clones); high `promptMath`; KaTeX choices not raw `\` / caret-only via `textContent`
- **Minimize English in ES/PL KaTeX** (no `\text{ or/and/yes/no }` leakage)
- TX TEKS + CCSS; IRT priors; `correctIndex` spread; unlock L27→28→29→30→`course_algebra1_complete`; boards 28–30 in world; build green
- L29 / L30 must **feel** cumulative / course-capstone (not another single-skill wave)

---

## Spot-check: what holds

| Check | Finding |
|---|---|
| Schema / phases | L28–L30: objective→teach→guided→independent; **2 / 5 / 10**; `masteryThreshold` 0.8; section `itemIds` resolve (0 dangling) |
| Locales | EN/ES/PL on titles, bodies, prompts, feedback, choices; prose MC trilocal (piecewise endpoints, parabola direction, correlation, units-check) |
| Distinct feedback | **0** identical EN=ES or EN=PL `feedbackCorrect` / `feedbackIncorrect` clones; **0** prompt clones |
| ES/PL EN `\text{or/and/yes/no}` | **0** whole-word hits — ES/PL use `verdadero`/`falso`/`prawda`/`fałsz` / localized endpoint & habit labels |
| `promptMath` | **17 / 17** each pack (51 / 51) |
| KaTeX choices | Math MC wrapped `$...$`; **0** raw backslash-without-`$` |
| Standards | TX + CCSS on every item; `lessonCoverage` for `alg1-l28`–`alg1-l30` (incl. `F-IF.C.7b`, `A.12(B)`, `A.5(A)`, `A.8(A)`, …) |
| IRT | `a`/`b`/`c` on all 51 items |
| KP graph | +9 piecewise / review / capstone KPs present; prerequisites resolve; 0 dangling IDs |
| `correctIndex` hist | Each pack `[5,4,4,4]`; independent `[3,2,2,3]` → always-A authored ≈ 29% ≪ 80% |
| Unlock chain | L27→`lesson_board_28` → L28→`_29` → L29→`_30` → L30→`course_algebra1_complete` |
| World boards | `lesson_board_28\|29\|30` in `WorldSites.ts` at (8,38), (−36,−24), (36,18) |
| Registration | `import.meta.glob('lesson-*.json')`; thirty lesson files on disk |
| Build | `npm run build` → **green** (`tsc && vite build`) |
| Cumulative / capstone feel | **L29** mixes expr/eq, linear/fn/systems, quadratic (factor/discriminant/vertex/formula) — reads as review. **L30** mixes solve/simplify/slope/zero-product/system/parabola/inequality/exponents + guided piecewise/modeling/scatter + formula — reads as mastery check |

Math spot-check (piecewise eval/junction/endpoints; mixed review; capstone): authored keys correct on sampled items (incl. `f(4)=8`, `f(−2)=−1`, `g(1)=−1` on ≤ piece, `h(5)=5`/`h(0)=3`, `(2x²+3x)−(x²−x)=x²+4x`, `x²−5x+6→2∨3`, `5x−3=2x+9→4`, `2(x+3)=x+10→4`, `(x−4)(x+1)=0→4∨−1`, `x+1=−x+5→2`, `x=(5±√9)/2→4∨1`).

---

## Residual (not deciding)

- Shared English in locale-agnostic KaTeX: `alg1-l28-i03` `\text{piecewise}`, `alg1-l28-i07` `\text{ for one }`, `alg1-l28-i10` `\text{jump}`, `alg1-l30-t01` `\text{classify}`/`\text{solve}`, `alg1-l30-t02` `\text{eq}`/`\text{graph}`/`\text{table}`, `alg1-l30-i09` `\text{units?}` — same class as wave8/9 residuals (not ES/PL choice leakage).
- `course_algebra1_complete` is an unlock **token** only: `PedagogyEngine.unlockedSiteIds` will add it after L30 mastery, but there is **no** matching `WorldSites` mesh / HUD ceremony yet (course-gate work).
- L30 teach is metacognitive T/F tips; independent remains mostly atomized single-skill MC (connective multi-step density thin vs `capstone.connect` naming).
- No live board playthrough of boards 28–30 in this critic pass.

---

## Verdict: **PASS**

### Single largest remaining gap (non-blocking)

**Shared English stubs in locale-agnostic `promptMath` / `bodyMath`** (`piecewise`, `for one`, `jump`, `classify`/`solve`, `eq`/`graph`/`table`, `units?`) — the ES/PL choice gate (`\text{or/and/yes/no}`) is closed; this is thinner shared-math localization polish. Course-gate follow-up: wire a player-facing affordance for `course_algebra1_complete`.

Wave 10 clears schema, phases, counts, mastery 0.8, distinct EN/ES/PL feedback, no English `\text{or/and/yes/no}` in ES/PL KaTeX, `promptMath`, KaTeX-safe choices, TX+CCSS, IRT, key spread, unlock L27→28→29→30→`course_algebra1_complete`, boards 28–30, cumulative/capstone feel on L29/L30, and green build.
