# Critic — Algebra I Content + Pedagogy (Wave 8 / L22–L24)

**Date:** 2026-08-08  
**Critic:** Fresh context (did not author L22–L24). Harsh.  
**Claim:** [wave8-content-notes.md](./wave8-content-notes.md)  
**Artifacts:** `content/algebra1/lesson-{22,23,24}.json`, `knowledge-points.json`, `standards-index.json`, `src/game/world/WorldSites.ts`, unlock via L21, `loadContent.ts`, `npm run build`

---

## Bar (judged against this)

- Schema vs `types.ts`; objective → teach → guided → independent; **2 / 5 / 10**; `masteryThreshold` 0.8
- EN/ES/PL; **distinct feedback** (not equation clones); high `promptMath`; KaTeX choices not raw `\` / caret-only via `textContent`
- **No English `\text{ or }` in ES/PL KaTeX**
- TX TEKS + CCSS; IRT priors; `correctIndex` spread; unlock L21→22→23→24; boards in world; build green

---

## Spot-check: what holds

| Check | Finding |
|---|---|
| Schema / phases | L22–L24: objective→teach→guided→independent; **2 / 5 / 10**; `masteryThreshold` 0.8; section `itemIds` resolve (0 dangling) |
| Locales | EN/ES/PL on titles, bodies, prompts, feedback, choices; prose MC trilocal (L22 i06, L23 domain/function defs, L24 classify labels) |
| Distinct feedback | **0** identical EN/ES/PL `feedbackCorrect` / `feedbackIncorrect` clones per pack |
| ES/PL `\text{ or }` | **0** hits — ES uses `o` / `solo` / `y`; PL uses `lub` / `tylko` / `i` |
| `promptMath` | **17 / 17** each pack (51 / 51) |
| KaTeX choices | Math MC wrapped `$...$`; **0** raw backslash-without-`$` (L22: 189 wrapped + 15 prose; L23: 168 + 36; L24: 192 + 12) |
| Standards | TX + CCSS on every item; `lessonCoverage` for `alg1-l22`–`alg1-l24` |
| IRT | `a`/`b`/`c` on all 51 items |
| KP graph | +9 abs/function/sequence KPs present; prerequisites resolve; 0 dangling IDs |
| `correctIndex` hist | Each pack `[5,4,4,4]`; independent `[3,2,2,3]` → always-A authored = 30% ≪ 80% |
| Unlock chain | L21→`lesson_board_22` → L22→`_23` → L23→`_24` → L24→`_25` teaser |
| World boards | `lesson_board_22\|23\|24` in `WorldSites.ts` at (30,12), (−30,−16), (16,32) |
| Registration | `import.meta.glob('lesson-*.json')`; twenty-four lesson files on disk |
| Build | `npm run build` → **green** (`tsc && vite build`) |

Math spot-check (abs evaluate/equations/inequalities; f(a)/domain/range; arithmetic/geometric/nth-term): authored keys correct on sampled teach/guided/independent items (incl. `|2x−1|=7→x=4 or −3`, `|2x+1|≤5→−3≤x≤2`, `|3x−6|>9→x<−1 or x>5`, `f(4)=11`, `g(−3)=8`, `f(g(5))=3`, `r=1/2` from `a₁=8,a₃=2`, `a₄=−54` for `a₁=2,r=−3`).

---

## Residual (not deciding)

- Shared English in locale-agnostic KaTeX: `alg1-l23-i08` `promptMath` `\text{function?}`, `alg1-l24-i09` `\text{classify}`, L23 teach `bodyMath` `\text{zeros}` — same class as wave7 `\text{vs}` (not ES/PL choice leakage).
- `lesson_board_25` is unlock teaser only (no world mesh) — same pattern as prior wave teasers.
- No live board playthrough of boards 22–24 in this critic pass.

---

## Verdict: **PASS**

### Single largest remaining gap (non-blocking)

**Shared English `\text{…}` in locale-agnostic `promptMath` / `bodyMath`** (`function?`, `classify`, `zeros`) — the ES/PL choice gate (`\text{ or }`) is closed; this is thinner shared-math localization polish, optional.

Wave 8 clears schema, phases, counts, mastery 0.8, distinct EN/ES/PL feedback, no English `\text{ or }` in ES/PL KaTeX, `promptMath`, KaTeX-safe choices, TX+CCSS, IRT, key spread, unlock L21→22→23→24, boards 22–24, and green build.
