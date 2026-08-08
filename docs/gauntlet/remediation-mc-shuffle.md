# Critic remediation — Wave 2 content FAIL → MC shuffle + key diversification

**Trigger:** [Content critic wave2](critic-content-wave2.md) FAIL — L5/L6 (and nearly L4) put every MC `correctIndex` at 0 with no runtime shuffle; independent 80% gate gameable by always picking A.

**Root cause:** `LessonRunner` presented authored choice order; `gradeItem` compared the UI slot index to `correctIndex`. L5/L6 authored keys were 100% at index 0.

**Fix applied (dual layer for durability):**

### 1. Runtime shuffle

- **`shuffleMcChoices.ts`** — Fisher–Yates permutation applied identically to EN/ES/PL choice arrays; returns `displayCorrectIndex` (where the authored correct answer lands after shuffle).
- **`LessonRunner`** — caches shuffle per `phase:itemIndex:shuffleNonce`; bumps nonce on independent retry so re-attempts get fresh permutations; passes shuffled choices to HUD and shuffle state to `gradeItem`.
- **`ReviewRunner`** — same shuffle per review item index.
- **`gradeItem`** — optional `mcShuffle` argument; grades against `displayCorrectIndex` and shuffled choice text. Numeric (`acceptNumeric`) and LaTeX (`correctLatex`) paths unchanged.

**Grading after shuffle:**

```
UI shows shuffled choices; click sends display index (0..n-1)
  → gradeItem compares index to displayCorrectIndex
  → or compares answer text to shuffledChoices[locale][displayCorrectIndex]
Authored correctIndex / choice order in JSON is never used at grade time when shuffle is active.
```

### 2. Content diversification

Reordered choice arrays so `correctIndex` is spread across 0–3 (target ≤70% at any single index):

| Pack | MC count | Index hist `[0,1,2,3]` |
|---|---|---|
| alg1-l04 | 17 | `[5,4,4,4]` |
| alg1-l05 | 17 | `[5,4,4,4]` |
| alg1-l06 | 17 | `[5,4,4,4]` |
| alg1-l02 | 16 | `[4,4,4,4]` |
| alg1-l03 | 17 | `[5,4,4,4]` |
| alg1-l01 | 16 | `[5,6,5,0]` (already OK — no change) |

**Files touched:**

| File | Change |
|---|---|
| `src/game/lesson/shuffleMcChoices.ts` | New — locale-synced permutation |
| `src/game/lesson/gradeItem.ts` | Optional `mcShuffle` for graded slot |
| `src/game/lesson/LessonRunner.ts` | Shuffle on MC display; retry nonce |
| `src/game/lesson/ReviewRunner.ts` | Shuffle on MC display |
| `content/algebra1/lesson-04.json` | Reordered choices; diversified keys |
| `content/algebra1/lesson-05.json` | Reordered choices; diversified keys |
| `content/algebra1/lesson-06.json` | Reordered choices; diversified keys |
| `content/algebra1/lesson-02.json` | Reordered choices; diversified keys |
| `content/algebra1/lesson-03.json` | Reordered choices; diversified keys |
| `public/workbench.html` | Content line → REMEDIATED awaiting critic |
| `docs/gauntlet/remediation-mc-shuffle.md` | This note |

**Preserved:** `masteryThreshold` 0.8; `completeLessonIfPassed` gate path; numeric and LaTeX item grading.

**Next:** Fresh critic — histogram check on L4–L6; play independent set and confirm always-A no longer passes; verify EN/ES/PL choice order stays aligned after shuffle.
