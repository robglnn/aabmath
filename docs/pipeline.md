# Algebra I content pipeline (Lesson 4+)

This is the same path used to produce Lessons 1–3. Follow it for every new Algebra I lesson so graph, standards, locales, and mastery gates stay consistent.

## Artifacts

| Path | Role |
|------|------|
| `content/algebra1/knowledge-points.json` | Knowledge graph nodes (titles EN/ES/PL, prereqs, misconceptions, standards) |
| `content/algebra1/standards-index.json` | Jurisdiction → code → KP mapping; Progress Report uses `primaryDisplay` (TX + CCSS) |
| `content/algebra1/lesson-NN.json` | One `LessonPack` per lesson |
| `src/content/types.ts` | Schema contract — do not invent fields |
| `src/content/loadContent.ts` | Bundles JSON into the game |
| `src/pedagogy/PedagogyEngine.ts` | Attempts, IRT theta nudge, **independent-set ≥ masteryThreshold** gate |

Optional authoring helper (regenerate L1–L3 only if intentionally rewriting): `scripts/author-algebra1-l1-l3.mjs`.

## Stages

1. **Curriculum Architect** — Fix lesson theme, success criteria, and which KPs the lesson delivers. Prefer the union of demanding overlapping standards (TX TEKS + Common Core first).
2. **Knowledge Point Spec** — Add/extend KPs in `knowledge-points.json`. Wire `prerequisites` (and `encompassing` when a KP credits simpler ones). Localize `title`, `successCriteria`, `misconceptions`.
3. **Lesson Designer** — Author `sections` in explicit order: `objective` → `teach` → `guided` → `independent` (optional `retrieval` later). Set `masteryThreshold: 0.8`. Align `worldHook.siteId` with the in-world board (`lesson_board_N`).
4. **Item Author** — For every item: EN/ES/PL `prompt` + `feedbackCorrect` / `feedbackIncorrect`; KaTeX in `promptMath` / section `bodyMath`; `standards` with at least TX + CCSS; `irt: { a?, b, c? }`; MC distractors with `diagnosticTags`. Counts: teach examples + **≥4 guided** + **≥8 independent**.
5. **Pedagogy Critic** — Check prereq edges, distractor diagnostics, threshold wiring (`scoreIndependentSet` / `lessonPassed`), and that independent `itemIds` match items in the pack.
6. **Localization** — Fill ES/PL for every new string (section titles/bodies and all item fields). Do not leave English placeholders.
7. **Integration** — Import the new `lesson-NN.json` in `loadContent.ts`, append to the lessons array, update `standards-index.json` `lessonCoverage`, and point the next board unlock in `worldHook.unlockOnMastery`.

## Lesson JSON checklist

- [ ] `courseId: "algebra1"`, unique `id`, correct `order`
- [ ] `masteryThreshold: 0.8`
- [ ] `knowledgePointIds` ⊆ graph; every item `knowledgePointIds` non-empty
- [ ] Phases present: objective, teach, guided, independent
- [ ] Guided ≥ 4 items; independent ≥ 8 items
- [ ] Every item: three locales for prompt + both feedbacks; TX + CCSS in `standards`
- [ ] MC items: plausible diagnostic distractors + `diagnosticTags`
- [ ] `worldHook.siteId` matches world board id

## Mastery gate (engine)

Independent practice is scored as raw accuracy:

```ts
engine.scoreIndependentSet(results, lesson.masteryThreshold)
// passed iff results.length > 0 && correct/total >= 0.8
```

Call `completeLessonIfPassed(lesson, results)` after the independent set to mark KPs mastered, enqueue spaced review, and expose `unlockOnMastery` site ids.

## Adding Lesson 4 (example)

1. Add KPs (e.g. inequalities or multi-step equations) with prereqs from L3 solve KPs.
2. Create `content/algebra1/lesson-04.json` cloning L3 structure; set `siteId: "lesson_board_4"`.
3. Register import in `loadContent.ts`.
4. Extend `standards-index.json` codes + `lessonCoverage.alg1-l04`.
5. Point L3 `unlockOnMastery` at `lesson_board_4` when the world board exists.
6. Run a Gauntlet critic pass on the JSON (schema + pedagogy bar), then playtest the 80% gate.

## Locales

Supported: `en`, `es`, `pl`. Every `Record<Locale, string>` / `string[]` field must include all three.
