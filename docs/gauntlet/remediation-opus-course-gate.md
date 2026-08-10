# Critic remediation — Course Opus loop 1 FAIL → gate integrity

**Source FAIL:** `docs/gauntlet/critic-opus-course-loop1.md`  
**Date:** 2026-08-08  
**Builder:** Cursor (Composer/Grok) — not the Opus critic

## Largest gap addressed

The 80% gate was measurable as **answer recall** (identical MC set + answer-key feedback + immediate identical SR). Wiring changes below make constructed response real, withhold independent answer keys, reshuffle retries, and stop massed "spaced" retrieval of the just-graded set.

## Changes

| Area | Fix |
|---|---|
| `gradeItem.ts` | Prefer `acceptNumeric` / `correctLatex` before `choices` |
| `LessonRunner` | Independent (and any authored numeric/latex item) uses **text** input; independent feedback is Correct/Incorrect only (no worked answer); gate retry **reshuffles independent item order** |
| `ReviewRunner` | Same constructed-response preference |
| `PedagogyEngine.enqueueReviewOnMastery` | First due = **now + 10 min** (not instant) |
| `pickReviewItems` | Optional `excludeItemIds`; prefers non-independent + constructed items |
| `GameApp` on lesson close | Passes last independent item ids into `pickReviewItems` |
| Progress Report | `.hud-hologram` `max-height` + `overflow-y: auto`; topics use active locale |
| `?sr=1` | Still forces due now for critic/dev (unchanged) |

## Not in this pass (still open / next bank work)

- Parallel forms / parameterized generators per KP (true item bank)
- KaTeX choice backfill L1–L12
- Per-KP mastery instead of per-lesson aggregate
- Cumulative capstone that pulls prior items

## Re-critic bar

Opus (Claude Code CLI) should verify live on L1:

1. Independent items with `acceptNumeric`/`correctLatex` show a text field, not 4 buttons.
2. Wrong answers in independent do **not** print the correct value before the set ends.
3. Fail gate → RETRY → independent order differs from first attempt (or at least is not a fixed authored order).
4. Closing a just-passed lesson does **not** immediately re-serve those same independent stems as "spaced retrieval" (unless `?sr=1`, and even then excluded ids should prefer other forms).
5. Progress Report fits / scrolls in a ~600px-tall viewport; ES/PL topics are localized.
