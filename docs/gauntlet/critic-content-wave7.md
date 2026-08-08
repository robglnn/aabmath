# Critic — Algebra I Content + Pedagogy (Wave 7 / L19–L21)

**Date:** 2026-08-08  
**Critic:** Fresh context (did not author L19–L21). Harsh.  
**Claim:** [wave7-content-notes.md](./wave7-content-notes.md)  
**Artifacts:** `content/algebra1/lesson-{19,20,21}.json`, `knowledge-points.json`, `standards-index.json`, `src/game/world/WorldSites.ts`, unlock via L18, `loadContent.ts`, `npm run build`

---

## Bar (judged against this)

- Schema vs `types.ts`; objective → teach → guided → independent; **2 / 5 / 10**; `masteryThreshold` 0.8
- EN/ES/PL; **distinct feedback** (not equation clones); high `promptMath`; KaTeX choices not raw `\` / caret-only via `textContent`
- **No English `\text{ or }` in ES/PL KaTeX**
- TX TEKS + CCSS; IRT priors; `correctIndex` spread; unlock L18→19→20→21; boards in world; build green

---

## Spot-check: what holds

| Check | Finding |
|---|---|
| Schema / phases | L19–L21: objective→teach→guided→independent; **2 / 5 / 10**; `masteryThreshold` 0.8; section `itemIds` resolve (0 dangling) |
| Locales | EN/ES/PL on titles, bodies, prompts, feedback, choices; L19 prose MC labels trilocal (0 EN-only paste) |
| Distinct feedback | **0 / 17** identical or equation-only `feedbackCorrect` / `feedbackIncorrect` clones per pack (EN≠ES≠PL prose) |
| ES/PL `\text{ or }` | **0** hits across choices / prompts / feedback / `promptMath` (wave6 residual closed) |
| `promptMath` | **17 / 17** each pack (51 / 51) |
| KaTeX choices | Math MC wrapped `$...$`; **0** raw backslash-without-`$` (L19: 144 wrapped + 60 localized prose; L20/L21: 204/204 wrapped) |
| Standards | TX + CCSS on every item; `lessonCoverage` for `alg1-l19`–`alg1-l21` |
| IRT | `a`/`b`/`c` on all 51 items |
| KP graph | +9 exp/radical/rational KPs present; prerequisites resolve; 0 dangling IDs |
| `correctIndex` hist | Each pack `[5,4,4,4]`; independent `[3,2,2,3]` → always-A authored = 30% ≪ 80% |
| Unlock chain | L18→`lesson_board_19` → L19→`_20` → L20→`_21` → L21→`_22` teaser |
| World boards | `lesson_board_19\|20\|21` in `WorldSites.ts` at (−28,18), (22,−28), (−12,30) |
| Registration | `import.meta.glob('lesson-*.json')`; twenty-one lesson files on disk |
| Build | `npm run build` → **green** (`tsc && vite build`) |

Math spot-check (exp evaluate, radical simplify/ops, rational cancel/multiply/divide): authored keys correct on sampled teach/guided/independent items (incl. `5·2³→40`, `2·3⁴→162`, `√72→6√2`, `√3·√12→6`, `(6x)/(3x)→2`, `(3/4)÷(1/2)→3/2`, `(x²−9)/(x−3)→x+3`).

---

## Residual (not deciding)

- Shared `promptMath` on `alg1-l20-i05` embeds English `\text{vs}` (locale-agnostic field; ES/PL choice labels themselves use `siempre` / `zawsze`).
- `lesson_board_22` is unlock teaser only (no world mesh) — same pattern as prior wave teasers.
- No live board playthrough of boards 19–21 in this critic pass.

---

## Verdict: **PASS**

### Single largest remaining gap (non-blocking)

**Shared English `\text{vs}` in `promptMath`** (`alg1-l20-i05`) — the wave6 gate (`\text{ or }` in ES/PL KaTeX choices) is closed; this is a thinner shared-math localization leak, optional polish.

Wave 7 clears schema, phases, counts, mastery 0.8, distinct EN/ES/PL feedback, no English `\text{ or }` in ES/PL KaTeX, `promptMath`, KaTeX-safe choices, TX+CCSS, IRT, key spread, unlock L18→19→20→21, boards 19–21, and green build.
