# Critic — Algebra I Content + Pedagogy (Wave 3b / KaTeX re-check)

**Date:** 2026-08-08  
**Critic:** Fresh context (did not author remediation). Harsh.  
**Claim:** [remediation-katex-wave3.md](./remediation-katex-wave3.md)  
**Prior FAIL:** [critic-content-wave3.md](./critic-content-wave3.md)  
**Artifacts:** `src/ui/math/renderKatex.ts`, `src/ui/components/LessonScreen.ts`, `content/algebra1/lesson-0{7,8,9}.json`, unlock/shuffle paths, `npm run build`

---

## Bar (judged against this)

- Nearly all math items carry `promptMath` (wave-1 KaTeX bar)
- MC LaTeX renders as math (not raw `\` / `\frac` via `textContent`)
- Unlock / schema / shuffle still OK
- `npm run build` green

---

## Spot-check: remediation holds

| Check | Finding |
|---|---|
| Choice render path | `LessonScreen` uses `renderChoiceLabel` (not bare `textContent`). `containsLatex` → `normalizeLatex` → inline `katex.render`. ReviewRunner shares `LessonScreen`. |
| Live fraction proof | Playwright screenshot of L8 `g01` labels (`y = \frac{1}{2}x + 6`, etc.) via same render path — stacked fractions visible; `.katex` + `.mfrac` present. Favicon 404 only. |
| L8 `promptMath` | **17 / 17** (was 2/17) |
| L9 `promptMath` | **12 / 17** — remaining five are conceptual (solution definition, parallel/coincide meaning, graphical estimate, why intersection) — acceptable |
| L7 `promptMath` | **12 / 17** — unchanged; still wave-1 level; `\frac` choices on `i05` now KaTeX-eligible |
| Schema / gate | L7–L9 `masteryThreshold` 0.8; unlock L6→`_7`→`_8`→`_9`→`_10` teaser; boards in `WorldSites.ts` |
| Shuffle | `shuffleMcChoices` still wired in `LessonRunner` / `ReviewRunner` |
| Build | `npm run build` → **green** (`tsc && vite build`) |

Unicode minus (−) inside LaTeX choice strings renders under KaTeX (`throwOnError: true` spot-check OK). Plain Unicode-only choices (no `\`) correctly stay `textContent`.

---

## Residual (not deciding)

- L7 still omits `promptMath` on a few equation stems (`i04`, `i08`, `i09`) — pre-existing wave-1 thinness; not the wave3 fail mode.
- Live proof exercised the `renderChoiceLabel` contract (mirrors production), not a full LessonRunner board playthrough of boards 7–9.

---

## Verdict: **PASS**

Prior largest gap closed: L8 chalkboard math restored; MC `\frac` choices render through KaTeX instead of raw backslashes; unlock/schema/shuffle intact; build green.
