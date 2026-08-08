# Critic — Algebra I Content + Pedagogy (Wave 1b)

**Date:** 2026-08-08  
**Critic:** Fresh context (did not author remediation). Harsh.  
**Prior FAIL:** [critic-content-wave1.md](critic-content-wave1.md) — packs on disk; play path never scored via `PedagogyEngine`.  
**Remediation claim:** [remediation-content-wire.md](remediation-content-wire.md) + `LessonRunner`.

---

## Bar (this gate only)

Schema / locales / KaTeX / graph / standards already claimed OK. **This pass judges only:** can the **80% independent mastery gate actually block proceed/unlock in the play path**, using **real packs** + **PedagogyEngine**?

---

## Trace (play path)

| Check | Finding |
|---|---|
| Real packs on board **E** | **Yes** — `GameApp` calls `loadAlgebra1Content()`; `startLessonAtSite` → `lessonByWorldSite` → `new LessonRunner(lesson, pedagogy, locale)`. No stub `x+3=7`. |
| Phases + independent results | **Yes** — `LessonRunner` drives objective → teach → guided → independent; pushes one boolean per independent item; on last item calls `completeLessonIfPassed(lesson, independentResults)`. |
| Length harden | **Yes** — `lessonPassed` requires `independentResults.length === getIndependentItemIds(lesson).length`; short arrays fail. |
| Fail &lt; 0.8 | **Yes** — no `completedLessons` push; `unlockSiteIds` empty; `gateFailed` → `closeDisabled` / `canClose()===false`; GameApp `onLessonClose` no-ops; independent retry via `__retry__`. |
| Pass ≥ 0.8 | **Yes** — lesson marked complete; `unlockOnMastery` applied (`alg1-l01` → `lesson_board_2`); boards 2/3 start locked; proximity/start reject locked sites. |
| LessonScreen | Exit disabled when `closeDisabled`; gate fail/pass copy; retry submit action. |

World sites include `lesson_board_1|2|3`. Unlock chain: L1→board_2, L2→board_3.

---

## Smoke (engine + runner path)

`npx tsx scripts/smoke-gate.mts` against L1 (9 independent, threshold 0.8):

| Case | Result |
|---|---|
| 6/9 (~67%) | `lessonPassed=false`; completed `[]`; unlock `[]`; runner `canClose=false`, `closeDisabled=true` |
| 8/9 (~89%) | completed `["alg1-l01"]`; unlock `["lesson_board_2"]`; runner `gatePassed=true` |
| `[true]` short array | `lessonPassed=false` |
| Full `submitAnswer` walk ~70% / ≥80% | Same block vs unlock behavior |

---

## Verdict: **PASS**

Play path loads authored L1–L3 packs, scores the full independent set through `PedagogyEngine.completeLessonIfPassed` / `lessonPassed`, and uses that result to block close + deny unlock on fail, or complete + unlock the next board on pass.

### Explicitly out of scope / not re-litigated

- Mid-lesson abandon before finishing independent (no unlock; gate not yet evaluated)
- HUD diegetic polish, Lesson 4+, live browser playthrough
- Cosmetic gate % while independent is in progress
