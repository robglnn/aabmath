# Critic — Algebra I Content + Pedagogy (Wave 5 / L13–L15)

**Date:** 2026-08-08  
**Critic:** Fresh context (did not author L13–L15). Harsh.  
**Claim:** [wave5-content-notes.md](./wave5-content-notes.md)  
**Artifacts:** `content/algebra1/lesson-{13,14,15}.json`, `knowledge-points.json`, `standards-index.json`, `src/game/world/WorldSites.ts`, unlock via L12, `loadContent.ts`, `src/ui/math/renderKatex.ts`, `LessonScreen`, `npm run build`

---

## Bar (judged against this)

- Schema vs `types.ts`; objective → teach → guided → independent; **2 / 5 / 10**; `masteryThreshold` 0.8
- EN/ES/PL; high `promptMath`; KaTeX choices not raw `\` / caret-only via `textContent`
- TX TEKS + CCSS; IRT priors; `correctIndex` spread; unlock L12→13→14→15; boards in world; build green

---

## Spot-check: what holds

| Check | Finding |
|---|---|
| Schema / phases | L13–L15: objective→teach→guided→independent; **2 / 5 / 10**; `masteryThreshold` 0.8; fields match `LessonPack` / `LessonItem`; section `itemIds` resolve |
| Locales | EN/ES/PL present on titles, bodies, prompts, feedback, choices; conceptual bare choices localized (not EN-only paste) |
| `promptMath` | **17 / 17** each pack (51 / 51) |
| KaTeX choices | Math MC labels wrapped `$...$` (`$6x^{2}+15x$`, etc.); **0** raw backslash-without-`$`; bare choices are prose T/F / verify / strategy (plain `textContent` path OK) |
| Choice render | `LessonScreen` → `renderChoiceLabel` still wired |
| Standards | TX + CCSS on every item; `lessonCoverage` for `alg1-l13`–`alg1-l15` |
| IRT | `a`/`b`/`c` on all 51 items |
| KP graph | +9 KPs present (distribute/FOIL/multiply; GCF/trinomial.a1/verify; DOS/trinomial.more/perfect.square); no dangling IDs |
| `correctIndex` hist | Each pack `[5,4,4,4]`; independent `[3,2,2,3]` → always-A authored = 30% ≪ 80% |
| Runtime shuffle | Still present (`shuffleMcChoices` + `LessonRunner` / `ReviewRunner`) |
| Unlock chain | L12→`lesson_board_13` → L13→`_14` → L14→`_15` → L15→`_16` teaser |
| World boards | `lesson_board_13|14|15` in `WorldSites.ts` at (18,30), (−30,18), (12,−26) |
| Registration | `import.meta.glob('lesson-*.json')`; fifteen lesson files on disk |
| Build | `npm run build` → **green** (`tsc && vite build`) |

Math spot-check (distribute/FOIL products, GCF + a=1 trinomials, verify FOIL, DOS / perfect-square / more trinomials): authored keys correct, including partial-term stems (`g04` leading term, `i04` linear term, `i07` constant).

---

## Residual (not deciding)

- Many `feedbackCorrect` strings are pure equations and are **identical** EN=ES=PL (L13 ≈10, L15 ≈11) — locales exist, but trilocal prose is thin on feedback.
- L13 `t02` prompt is identical across locales (`FOIL: (x + 2)(x + 3).`) — acronym stem, not a missing translation of instructional text.
- A few independent items ask for a single term / reverse product / concept check rather than a full expand — still on-KP, but thinner mastery signal.
- `lesson_board_16` is unlock teaser only (no world mesh) — same pattern as prior wave teasers.
- No live board playthrough of boards 13–15 in this critic pass.

---

## Verdict: **PASS**

### Single largest remaining gap (non-blocking)

**Equation-cloned feedback across locales** — EN/ES/PL fields are filled, but a large share of correct-feedback is the same math string in all three languages, so the trilocal bar is met structurally while sounding monolingual on success paths. Optional polish; not a gate fail.

Wave 5 clears schema, phases, counts, mastery 0.8, locales, `promptMath`, KaTeX-safe choices, TX+CCSS, IRT, key spread, unlock L12→13→14→15, boards 13–15, and green build.
