# Critic — Algebra I Content MC shuffle (Wave 2b)

**Date:** 2026-08-08  
**Critic:** Fresh context (did not build the MC remediation). Harsh.  
**Claim:** [remediation-mc-shuffle.md](./remediation-mc-shuffle.md)  
**Prior FAIL:** [critic-content-wave2.md](./critic-content-wave2.md) — `correctIndex === 0` on virtually all L4–L6 MCs; no runtime shuffle; independent 80% gate gameable by always picking A.

---

## Bar (this gate only)

- Independent mastery not gameable by always picking A
- EN/ES/PL choices stay aligned under shuffle
- 80% gate intact; numeric / LaTeX paths OK
- L4–6 still load + unlock chain OK

---

## Verification

### Runtime shuffle + grade path

| Step | Evidence |
|---|---|
| Fisher–Yates | `shuffleMcChoices.ts` — one `perm` applied to EN/ES/PL; `displayCorrectIndex = perm.indexOf(correctIndex)` |
| Lesson display | `LessonRunner.getViewState` → `getMcShuffle` → HUD gets `mcShuffle.choices[locale]` |
| Lesson grade | `submitAnswer` → `gradeItem(..., getMcShuffle(item))` compares UI index / text to `displayCorrectIndex` |
| Retry freshness | `resetIndependentPhase` bumps `shuffleNonce` and clears cached shuffle |
| Review path | `ReviewRunner` same shuffle + `gradeItem` with `mcShuffle` |
| Call sites | Only `LessonRunner` / `ReviewRunner` call `gradeItem`; both pass shuffle when MC |
| Numeric / LaTeX | `gradeItem` still branches on `acceptNumeric` / `correctLatex` unchanged when no MC choices |

### Authored `correctIndex` histograms (not all-0)

| Pack | MC | Hist `[0,1,2,3]` | Max share | Independent always-A (authored) |
|---|---|---|---|---|
| alg1-l04 | 17 | `[5,4,4,4]` | 29% | 3/10 = 30% |
| alg1-l05 | 17 | `[5,4,4,4]` | 29% | 3/10 = 30% |
| alg1-l06 | 17 | `[5,4,4,4]` | 29% | 3/10 = 30% |
| alg1-l02 | 16 | `[4,4,4,4]` | 25% | — |
| alg1-l03 | 17 | `[5,4,4,4]` | 29% | — |

All packs ≤70% at any single index. Authored always-A alone fails the 0.8 gate (30% ≪ 80%).

### Monte Carlo (shuffle + always pick display index 0)

L5 independent (10 MCs), 5000 trials: **2 / 5000 = 0.04%** pass at ≥80%. Not a viable strategy.

### Locale alignment

84 MCs across L2–L6: shuffled EN/ES/PL keep the authored correct strings at `displayCorrectIndex`; grade-by-index integrity misalignments = **0**.

### Math spot-check (L5/L6 independent keys)

Sampled authored answers still correct after diversification (e.g. `x − 5 > 2` → `x > 7`; flip on `−3x + 6 < 0` → `x > 2`; slope `(2,−1)`–`(5,5)` → `2`).

### Load + unlock

- `import.meta.glob('lesson-*.json')` + `lessonByWorldSite`; packs on disk with `masteryThreshold: 0.8`, 2 teach / 5 guided / 10 independent
- Unlock: L3→`lesson_board_4` → L4→`_5` → L5→`_6` → L6→`_7`; boards 4–6 still in `WorldSites`
- Gate path unchanged: independent results → `completeLessonIfPassed`

Prior FAIL (position bias + no shuffle) is closed.

---

## Verdict: **PASS**

Independent 80% gate is no longer clearable by always picking A; dual-layer fix (runtime shuffle + diversified keys) holds; locales stay paired; numeric/LaTeX and unlock chain intact.

### Residual nits (not deciding)

- No automated unit/regression test locking shuffle↔`displayCorrectIndex` or the always-A fail invariant
- `ReviewRunner` caches shuffle by item index only (no retry nonce); acceptable for review flow
