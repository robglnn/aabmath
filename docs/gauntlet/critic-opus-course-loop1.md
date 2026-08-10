# Critic — Algebra I Course / Product (Opus 5, loop 1)

**Critic:** `claude-opus-5-thinking-high`, fresh context, did not build any of this
**Date:** 2026-08-08
**Claim under test:** `docs/gauntlet/exit-gate-algebra1.md` — "Algebra I course gate: PASS"
**Artifacts inspected:** `content/algebra1/*.json` (30 lesson packs, 508 items, 91 KPs), `src/pedagogy/`, `src/game/lesson/`, `src/ui/`, production build, and a **live played session** against `vite preview` (walked to `lesson_board_1`, failed the gate, retried, passed, triggered spaced review, opened the Progress Report at the pedestal).

## Verdict

# FAIL

Everything the exit gate lists as PASS is, mechanically, present and real. The gate fails on a bar the exit gate never tested: **whether the 80% mastery gate measures mastery.**

---

## Bar-by-bar, against real artifacts

| Bar | Result | Evidence |
|---|---|---|
| 30 lessons loadable | PASS | `loadContent.ts` globs `lesson-*.json` eagerly; audit parsed 30 packs, orders 1–30, 508 items, 0 dangling `itemIds`, 0 orphan items, 0 duplicate EN prompts course-wide |
| In-world boards 1–30 | PASS | `WorldSites.ts` builds `lesson_board_1`…`lesson_board_30`; walked to board 1 in-play, `E` opened L1 |
| Unlock chain → `course_algebra1_complete` | PASS | Each `worldHook.unlockOnMastery` points at the next board; L30 → `course_algebra1_complete`; `GameApp` maps that id to the ALGEBRA 1 toast + 100% |
| Explicit teach→guided→independent | PASS | Every lesson: `objective > teach > guided > independent` (2 / 5 / 9–10 items). Confirmed live: phase banner walked Learning objective → Teach → Guided practice → Independent practice |
| `masteryThreshold` 0.8 actually blocks | PASS (mechanically) | Live run scored 22% → gate read "Need ≥80% mastery to proceed (22%)", commit button became RETRY INDEPENDENT, **and the exit button went `disabled`** — the player is genuinely trapped in the lesson |
| Spaced review reachable in-session | PASS (mechanically) | Closing L1 immediately opened "Spaced retrieval" 1/3 with a KP title in the header; `rescheduleReview` moved the entry to a 1-day interval |
| KaTeX prompts / choices | PARTIAL | 234/508 `promptMath` carry real TeX; **choices are TeX in L13–L30 but plain ASCII in L1–L12** (0 of 200 choice strings in the first twelve lessons use `$…$`) |
| EN/ES/PL fidelity | PARTIAL | Lesson JSON is genuinely trilingual with correct diacritics (verified byte-level: 50/57 PL strings in L1 carry `ą/ę/ł/ż`, ES carries `¿/á/ó/ñ`); switching to PL mid-review re-rendered prompt, choices, and chrome. **But the Progress Report topic list is hard-coded English** (`lesson.title.en.toUpperCase()`), so the ES report reads "VARIABLES, EXPRESSIONS…: 90% DOMINIO" |
| Progress Report TEKS + CC from engine | PASS (data) / FAIL (surface) | Engine-backed: 30 mastery lines + 30 alignment lines from real `progress.mastery`, footer `TX:A.1(A) · … · CC:A-SSE.A.1`. See the layout defect below |
| Diegetic HUD, no Bootstrap, no wave-1 regress | PARTIAL | Zero Bootstrap/`.modal`/`data-bs-*` in the DOM; HUD is bespoke chalkboard/hologram/pedestal in Press Start 2P. But the Progress Report now overflows the viewport (below) |
| `npm run build` | PASS | `tsc && vite build` clean, 66 modules, 1,671 kB (407 kB gzip), only the chunk-size advisory |

---

## Largest gap

**The 80% mastery gate cannot distinguish mastery from answer recall, because every skill has exactly one fixed multiple-choice form.**

Four facts compound, and I verified all four:

1. **All 508 items are 4-option multiple choice.** No item in the course asks the student to produce anything. `LessonScreen` computes `inputMode = item.choices ? 'choices' : 'text'`, and since every item has `choices`, the text-entry field is unreachable dead code. `acceptNumeric` (150 items), `correctLatex` (94 items) and `tolerance` are authored into the JSON and read by `gradeItem`, but `gradeItem` short-circuits on the `item.choices` branch first — so those free-response fields never execute. The full-year Algebra I course can be completed without the student ever writing `x = 3`.
2. **A failed gate re-serves the identical set.** `LessonRunner.resetIndependentPhase()` resets `itemIndex` and bumps a shuffle nonce; it does not resample. In my live session I failed L1 at 22%, hit RETRY, and passed at 100% using an answer key I had extracted from `lesson-01.json` *before* the retry — the same nine prompts came back in the same order, only the option order changed.
3. **The feedback hands over the answer before the retry.** During the independent phase `feedbackIncorrect` renders verbatim, and it is written to state the result (`"Order of operations: multiply before add. 4 · 2 = 8, then 3 + 8 = 11 (not 14)."`). So attempt 1 is a free answer key for attempt 2, on the identical items, with unlimited retries and no cooldown or re-teach.
4. **"Spaced" retrieval re-serves the item the student just answered.** `enqueueReviewOnMastery` sets `dueAt = Date.now()`, and `pickReviewItems` *prefers* independent items. On closing L1 the retrieval checkpoint served me "Which is a variable in 2πr?" — literally an item from the independent set I had completed about sixty seconds earlier. That is massed repetition wearing a spaced-repetition label; the first genuine interval only appears after this degenerate review reschedules to 1 day.

Individually each is a design shortcut. Together they mean the headline promise — *"a struggling student cannot advance below 80% mastery"* — is not enforced by the artifact. What is enforced is: see nine items, read nine answers, re-enter, click the nine answers. A student who understands nothing clears all thirty gates and earns `course_algebra1_complete`. The IRT θ updates, mastery percentages, and TEKS/CC alignment marks all derive from those same attempts, so the Progress Report a parent or teacher reads is downstream of an invalid measurement.

The remediation is an item bank, not more lessons: 3–4 parallel forms (or a parameterised generator) per knowledge point, retry drawing an unseen form, answer-revealing feedback withheld until the set is scored, and review items drawn from a form the student has not seen. The schema already supports it — `acceptNumeric`/`correctLatex`/`tolerance`/`diagnosticTags` are authored on all 508 items and `gradeItem` already implements numeric and LaTeX grading. The wiring and the second form per skill are what is missing.

---

## Secondary gaps (ranked, non-blocking for this verdict)

1. **Progress Report overflows the screen at 30 lessons — a real wave-1 regression.** `.hud-hologram` has no `max-height` and no `overflow-y`. With 30 mastery lines + 30 alignment lines it measured **1463 px tall in a 623 px viewport, top edge at y = −410**. The panel title and the first ~14 topics are cut off above the screen; the alignment list runs off the bottom; nothing scrolls. This worked at 3 lessons and broke silently at 30, so waves 4–10 never had a readable Progress Report. On landscape iPhone it will be worse. Screenshot: `docs/gauntlet/shots/critic-opus-course-report.png`.
2. **Progress Report is not localized.** Topic labels come from `lesson.title.en`; only the "% DOMINIO / CUMPLIDO / EN PROGRESO" scaffolding translates. ES/PL players get an English report body.
3. **KaTeX was never backfilled to L1–L12.** The wave-3 KaTeX-choices remediation applied from L13 forward. In the first twelve lessons — the ones every student meets first — choices render as plain `m/3` and `3(n + 4)`, while L21 correctly renders `$\frac{2}{3}\cdot\frac{9}{4}$`. Inconsistent typography exactly where first impressions form.
4. **Mastery is credited per-lesson, not per-skill.** `completeLessonIfPassed` marks *every* KP in the lesson `mastered` off one aggregate score, so a student can miss both items for one of the three KPs, pass at 80% on the strength of the others, and still be certified mastered on the skill they failed.
5. **Course is uniformly templated: 2 teach / 5 guided / 9–10 independent, always.** Thirty lessons of identical shape means no lesson gets extra practice where it is hard (quadratic formula, factoring) and none gets trimmed where it is easy. `lesson-29` "Cumulative Mixed Review" and `lesson-30` "Capstone" carry the same 17 items and the same three fresh KPs as lesson 4 — neither actually pulls items forward from earlier lessons, so the capstone is not cumulative in any structural sense.
6. **Boards 14 and 19 are placed 2 units apart** (`-30,18` and `-28,18`) with 4.2-unit-wide geometry — they intersect visually, and both fall inside the same 6-unit `E` proximity radius.

## Credit where due

The content is not a mock. 91 knowledge points with prerequisites, `encompassing` relations, per-KP `successCriteria` and localized `misconceptions`; 508 items each carrying TX + CCSS codes, IRT `{a,b,c}` priors, and `diagnosticTags` (400 distinct); zero duplicate prompts across thirty lessons; correct-answer index near-uniform across positions (149/122/121/116). Localization is real translation with correct Polish and Spanish orthography, not machine-passthrough — only 3 of 508 prompts collide across locales, and all three are pure-notation stems. The in-world → lesson → gate → unlock → review → report loop genuinely runs end to end from a cold cache. This is a strong pipeline pointed at the wrong assessment model.

## Recommendation

FAIL loop 1. Do **not** author more lessons. Remediate the item bank / gate-integrity gap, then re-run this critic against a lesson whose retry set is provably different from its first set.
