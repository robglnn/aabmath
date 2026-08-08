# Critic — Algebra I Content + Pedagogy (Wave 9 / L25–L27)

**Date:** 2026-08-08  
**Critic:** Fresh context (did not author L25–L27). Harsh.  
**Claim:** [wave9-content-notes.md](./wave9-content-notes.md)  
**Artifacts:** `content/algebra1/lesson-{25,26,27}.json`, `knowledge-points.json`, `standards-index.json`, `src/game/world/WorldSites.ts`, unlock via L24, `loadContent.ts`, `npm run build`

---

## Bar (judged against this)

- Schema vs `types.ts`; objective → teach → guided → independent; **2 / 5 / 10**; `masteryThreshold` 0.8
- EN/ES/PL; **distinct feedback** (not equation clones); high `promptMath`; KaTeX choices not raw `\` / caret-only via `textContent`
- **Minimize English in ES/PL KaTeX** (no `\text{ or/and/yes/no }` leakage)
- TX TEKS + CCSS; IRT priors; `correctIndex` spread; unlock L24→25→26→27; boards in world; build green

---

## Spot-check: what holds

| Check | Finding |
|---|---|
| Schema / phases | L25–L27: objective→teach→guided→independent; **2 / 5 / 10**; `masteryThreshold` 0.8; section `itemIds` resolve (0 dangling) |
| Locales | EN/ES/PL on titles, bodies, prompts, feedback, choices; prose MC trilocal (boundary labels, association, modeling structure) |
| Distinct feedback | **0** identical EN=ES or EN=PL `feedbackCorrect` / `feedbackIncorrect` clones; **0** prompt clones |
| ES/PL EN `\text{or/and/yes/no}` | **0** hits — ES uses `sí`/`falso`/`o`/`y` patterns; PL uses `tak`/`nie`/`lub`/`i` |
| `promptMath` | **17 / 17** each pack (51 / 51) |
| KaTeX choices | Math MC wrapped `$...$`; **0** raw backslash-without-`$` (204 wrapped per pack) |
| Standards | TX + CCSS on every item; `lessonCoverage` for `alg1-l25`–`alg1-l27` |
| IRT | `a`/`b`/`c` on all 51 items |
| KP graph | +9 inequality/scatter/modeling KPs present; prerequisites resolve; 0 dangling IDs |
| `correctIndex` hist | Each pack `[5,4,4,4]`; independent `[3,2,2,3]` → always-A authored = 30% ≪ 80% |
| Unlock chain | L24→`lesson_board_25` → L25→`_26` → L26→`_27` → L27→`_28` teaser |
| World boards | `lesson_board_25\|26\|27` in `WorldSites.ts` at (−16,36), (32,−30), (−34,8) |
| Registration | `import.meta.glob('lesson-*.json')`; twenty-seven lesson files on disk |
| Build | `npm run build` → **green** (`tsc && vite build`) |

Math spot-check (half-planes/test points; association/r/fit; write/solve/choose models): authored keys correct on sampled teach/guided/independent items (incl. `y>2x−1→dashed`, `(3,2)∉{y≥1,x≤2}`, `{(0,0),(1,3),(4,0)}` count 2 under `y≥2x,x≥0`, `y=0.5x+2@x=8→6`, `|r|≈1⇏cause`, `20+0.10t=32→t=120`, `2(w+(w+3))=30→w=6`, weighted mean `5.8`).

---

## Residual (not deciding)

- Shared English (or bilingual mash) in locale-agnostic KaTeX: `alg1-l26-g02` `\text{cloud}`, `alg1-l26-i02` `\text{cause?}`, `alg1-l26-i07` `\text{grupos/clusters}`, `alg1-l27-g04` `\text{var}`/`\text{eq}`, `alg1-l27-i03` `\text{const}`, L27 teach `bodyMath` `\text{eq}` — same class as wave8 `\text{function?}` / `\text{classify}` (not ES/PL choice leakage).
- `lesson_board_28` is unlock teaser only (no world mesh) — same pattern as prior wave teasers.
- No live board playthrough of boards 25–27 in this critic pass.

---

## Verdict: **PASS**

### Single largest remaining gap (non-blocking)

**Shared English / bilingual mash in locale-agnostic `promptMath` / `bodyMath`** (`cloud`, `cause?`, `grupos/clusters`, `eq`/`var`/`const`) — the ES/PL choice gate (`\text{or/and/yes/no}`) is closed; this is thinner shared-math localization polish, optional.

Wave 9 clears schema, phases, counts, mastery 0.8, distinct EN/ES/PL feedback, no English `\text{or/and/yes/no}` in ES/PL KaTeX, `promptMath`, KaTeX-safe choices, TX+CCSS, IRT, key spread, unlock L24→25→26→27, boards 25–27, and green build.
