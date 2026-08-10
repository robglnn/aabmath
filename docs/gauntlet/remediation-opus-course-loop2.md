# Critic remediation — Course Opus loop 2 FAIL → R1/R2 + oracle

**Source FAIL:** `docs/gauntlet/critic-opus-course-loop2.md`  
**Date:** 2026-08-08  
**Builder:** Cursor (Grok/Composer) — not the Opus critic

## Fixes

| ID | Fix |
|---|---|
| R1 | `canonicalizeMathAnswer` folds `≤`/`>=`/`\le`/`\ge`/`\frac{a}{b}`/`m/3`/unicode minus; both `acceptNumeric` and `correctLatex` accepted when co-authored (`5` or `x=5`) |
| R2 | Gate-fail screen: `inputMode: 'none'`, no choices/text; stray submits ignored until `__retry__`; partial result vectors never `passed`; `LessonScreen` locks answer affordances when failed/passed |
| Oracle | Independent phase withholds **all** per-item Correct/Incorrect feedback — score only at set end |

## Re-critic bars (loop 3)

1. Typing `x ≤ 12` for L5 `x/4 ≤ 3` grades Correct; `m/3` ≡ `\frac{m}{3}`
2. Fail independent → no live choices; clicking cannot produce "Mastery gate passed!" or softlock
3. Zero-knowledge elimination bot that needs per-item verdicts cannot clear a gate (no verdicts mid-set)
4. Prior loop-2 bars 1–7 still hold
