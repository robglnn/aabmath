# Critic — Algebra I Content + Pedagogy (Wave 2 / L4–L6)

**Date:** 2026-08-08  
**Critic:** Fresh context (did not author L4–L6). Harsh.  
**Artifacts:** `content/algebra1/lesson-0{4,5,6}.json`, `knowledge-points.json`, `standards-index.json`, `src/content/loadContent.ts`, `src/content/types.ts`, `docs/gauntlet/wave2-content-notes.md`, `docs/pipeline.md`, unlock via L3 + `PedagogyEngine` / `LessonRunner`

---

## Bar (judged against this)

- Schema vs `types.ts`; teach → guided → independent; ≥4 guided ≥8 independent; `masteryThreshold` 0.8
- EN/ES/PL on prompts/feedback; KaTeX; TX TEKS + CCSS; IRT priors; diagnostic distractors
- KP graph prereqs from L1–L3 into L4–6
- Unlock chain L3→`lesson_board_4`→`board_5`→`board_6` (not orphan ruins hub)
- Lessons loadable via `loadContent` / `lessonByWorldSite`
- 80% gate still enforced by `PedagogyEngine` when packs run (code path exists)

---

## Spot-check: what holds

| Check | Finding |
|---|---|
| Schema / phases | L4–L6: objective→teach→guided→independent; 2 / 5 / 10 items; `masteryThreshold` 0.8; fields align with `LessonPack` / `LessonItem` |
| Locales | EN/ES/PL on titles, bodies, prompts, feedback, choices; EN ≠ ES ≠ PL on sampled prompts |
| Standards | TX + CCSS on sampled items; `standards-index.json` `lessonCoverage` for `alg1-l04`–`alg1-l06` |
| IRT | Diversified `a`/`b`/`c` priors present |
| Diagnostic tags | Present on all MCs |
| KP graph | +9 KPs; prereqs chain into L1–L3 roots (`variable.identify` reachable) |
| Unlock chain | L3→`lesson_board_4` → L4→`_5` → L5→`_6` → L6→`_7` teaser (no orphan `hub_region_ruins_east`) |
| Registration | `import.meta.glob('lesson-*.json')` + `lessonByWorldSite`; six lesson files on disk |
| 80% gate path | Unchanged: `LessonRunner` → `completeLessonIfPassed`; fail blocks close/unlock |

Math spot-check on L4–L5 equations/inequalities and L6 slope/rate items: authored keys look correct.

---

## Spot-check: what breaks assessment validity

`LessonRunner` / `gradeItem` present choices in authored order with **no shuffle**. `correctIndex` distribution:

| Pack | MC count | Index hist `[0,1,2,3]` | Non-zero keys |
|---|---|---|---|
| alg1-l01 (wave1) | 16 | `[5,6,5,0]` | 11 |
| alg1-l04 | 17 | `[16,1,0,0]` | **1** |
| alg1-l05 | 17 | `[17,0,0,0]` | **0** |
| alg1-l06 | 17 | `[17,0,0,0]` | **0** |

L5 and L6 put the correct answer in slot A on **every** item (including the full independent set of 10). A student who always taps the first choice clears independent practice at 100% and unlocks the next board without demonstrating the skill. Diagnostic distractors and IRT priors become theater; the 80% gate still *runs*, but it no longer *measures*.

Secondary (not the largest gap): several L6 items omit `promptMath` despite numeric/conceptual stems that would benefit from KaTeX — acceptable as prose per wave1 precedent, not the blocker.

---

## Verdict: **FAIL**

### Single largest remaining gap

**Answer-key position bias: `correctIndex === 0` on virtually all L4–L6 MCs (100% on L5/L6), with no runtime choice shuffle — the independent 80% gate is gameable by always picking A.**

### One biggest fix (next builder)

1. Reshuffle choice arrays so correct answers are roughly uniform across indices 0–3 (especially independent items), **or** shuffle at render time in `LessonRunner`/`LessonScreen` while grading by stable choice id / remapped index.
2. Re-spot-check L4–L6 histograms (target roughly balanced; reject packs with &gt;70% keys at a single index).
3. Re-enter critic; do not claim content PASS until independent sets cannot be cleared by position alone.

### Explicitly out of scope / not re-litigated

- World mesh for `lesson_board_7` teaser
- SR-due-in-play / world critic FAIL (separate lane)
- Live browser playthrough of boards 4–6
