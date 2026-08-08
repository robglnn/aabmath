# Critic — Algebra I Content + Pedagogy (Wave 1)

**Date:** 2026-08-08  
**Critic:** Fresh context (did not author lessons). Harsh.  
**Artifacts:** `content/algebra1/lesson-0{1,2,3}.json`, `knowledge-points.json`, `standards-index.json`, `src/content/types.ts`, `src/content/loadContent.ts`, `src/pedagogy/PedagogyEngine.ts`, `docs/pipeline.md`, playable path via `GameApp` / Lesson HUD  

---

## Bar (judged against this)

- Explicit teach → guided → independent
- KaTeX fields where needed
- EN + ES + PL on prompts/feedback (and section copy)
- `masteryThreshold` 0.8; independent ≥8; guided ≥4
- Knowledge-graph prereqs across L1–L3
- Texas TEKS + Common Core tags on items/KPs
- Heavy pedagogy real for slice (IRT priors, SR hooks in engine; **80% gate can actually block proceed**)
- Pipeline docs so Lesson 4+ can follow the same path

---

## Spot-check: JSON vs `types.ts`

| Pack | Phases | Guided | Independent | `masteryThreshold` | Schema fit |
|---|---|---|---|---|---|
| `alg1-l01` | objective → teach → guided → independent | 5 | 9 | 0.8 | Matches `LessonPack` / `LessonItem` |
| `alg1-l02` | same | 5 | 9 | 0.8 | Same |
| `alg1-l03` | same | 5 | 10 | 0.8 | Same |

- `courseId`, `order`, `worldHook.siteId` / `unlockOnMastery`, `irt.{a,b,c}`, `knowledgePointIds`, section `bodyMath`, item `promptMath` / choices / feedbacks all align with `types.ts`.
- KP graph: 10 nodes; only root `kp.alg1.variable.identify` has empty prereqs; L2/L3 KPs chain from L1 (order-of-ops / eval ← expression parts; equations / solve ← translate + substitute). TX + CCSS present on sampled KPs and items (plus optional CA/FL).
- Pipeline: `docs/pipeline.md` is concrete enough for Lesson 4+ (artifacts, stages, checklist, gate call sites, locale rule).

**Locale sample (9 items across L1–L3):** EN ≠ ES ≠ PL; real Spanish/Polish (not English placeholders); choice-array lengths match across locales; feedbackCorrect/Incorrect filled for all three.

**KaTeX:** Nearly all items carry `promptMath` (or teach `bodyMath`). Two L3 conceptual MCs (`alg1-l03-t01`, `alg1-l03-g05`) omit `promptMath` — acceptable for “which is an equation / which statement” prose, not a wave blocker.

**IRT priors on disk:** Diversified `a`/`b` (and `c`) across items — not a single stub constant.

---

## 80% gate — can it block?

**Unit math in `PedagogyEngine.scoreIndependentSet`:** yes.

- `8/10` → `passed: true` at 0.8  
- `7/10` → `passed: false`  
- `[]` → `passed: false`  

`canProceed` / `completeLessonIfPassed` use that threshold.

**Product / slice reality:** no.

| Check | Finding |
|---|---|
| Does any play path call `scoreIndependentSet` / `lessonPassed` / `completeLessonIfPassed` with independent results? | **No** — grepped `src/`; only definitions in `PedagogyEngine.ts` |
| Does `GameApp` load `LessonPack`s? | **No** — board `E` opens stub `promptLatex: 'x + 3 = 7'` + hardcoded `masteryPercent: 0` |
| Does Lesson close require gate pass? | **No** — `onLessonClose` always returns to dig |
| Are `unlockOnMastery` / `unlockSiteIds` enforced from mastery? | **No** — content hooks exist; engine unlock helper unused in play loop |
| `lessonPassed` length check | Soft hole: mismatched shorter `independentResults` still scores the subset (e.g. `[true]` → pass) instead of requiring full independent `itemIds` |

IRT theta nudge + `enqueueReview` / `dueReviews` exist on the engine class but are never driven by L1–L3 attempts in the running slice. Handoff DoD (“mastery logic real for L1–L3 attempts (not fake percentages)”) is unmet.

---

## Verdict: **FAIL**

### Single largest remaining gap

**The 80% independent-set gate cannot actually block proceed in the playable slice.** L1–L3 JSON, graph, locales, standards, IRT fields, and `scoreIndependentSet` math are ready, but boards never run teach → guided → independent through `PedagogyEngine`; close/unlock ignore `completeLessonIfPassed`. Until independent results for the full lesson set are scored and used to gate completion / `unlockOnMastery`, a student can leave the board without earning ≥80% on the authored independent items.

### One biggest fix (next builder)

Wire one board end-to-end:

1. `loadAlgebra1Content()` → open the matching `LessonPack` by `worldHook.siteId`.
2. Drive phases in order; collect booleans for every independent `itemId`.
3. Call `completeLessonIfPassed(lesson, results)`; only then mark complete and expose `unlockOnMastery`.
4. Harden `lessonPassed` to require `independentResults.length === getIndependentItemIds(lesson).length` (reject partial arrays).
5. Stop hardcoding stub KaTeX / `masteryPercent: 0` as the lesson experience.

Then re-enter critic: fail a set at 70%, confirm unlock denied; pass at ≥80%, confirm next board unlocks.

### Explicitly out of scope for this pass

- Mesh/HUD diegetic polish (other critics)
- Authoring Lesson 4+
- Nitpicking two prose MCs without `promptMath`
