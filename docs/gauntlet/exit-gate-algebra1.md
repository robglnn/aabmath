# Exit Gate — Algebra I Course

**Date:** 2026-08-08  
**Orchestrator:** Parent after Waves 1–10 critic PASSes  
**Play:** https://robglnn.github.io/aabmath/

## Definition of Done (from CONTINUE_LOOP_PROMPT)

| Criterion | Status |
|---|---|
| Full Algebra I lesson set EN/ES/PL + in-world entry | **PASS** — 30 lessons, 30 boards |
| Knowledge graph + Progress Report TEKS+CC | **PASS** — graph + standards-index + engine-backed report |
| Spaced review fires in play | **PASS** — critic-world-sr-wave2b |
| 80% gate on every independent set | **PASS** — PedagogyEngine + LessonRunner (wave1b+) |
| No Wave-1 world/HUD regress | **PASS** — composition + diegetic HUD retained |
| `exit-gate-algebra1.md` | **This document** |
| Workbench shows course gate PASS | **Updated** |

## Wave scoreboard

| Wave | Lessons | Critic |
|---|---|---|
| 1 | L1–3 + world/HUD/pedagogy | PASS (1b tracks) |
| 2 | L4–6 + SR + MC shuffle | PASS |
| 3 | L7–9 + KaTeX choices | PASS |
| 4 | L10–12 | PASS |
| 5 | L13–15 | PASS |
| 6 | L16–18 | PASS |
| 7 | L19–21 | PASS |
| 8 | L22–24 | PASS |
| 9 | L25–27 | PASS |
| 10 | L28–30 capstone | PASS (`critic-content-wave10.md`) |

## Integration notes

- Unlock chain: `lesson_board_1` → … → `lesson_board_30` → `course_algebra1_complete`
- Completing L30 shows **ALGEBRA 1** unlock toast + rank/progress 100%
- GitHub Pages deploy on `main` with `GITHUB_PAGES=true` base `/aabmath/`

## Residual (non-blocking / ask Harrison later)

- Bundle size ~1.6MB — code-split later
- Some locale-agnostic English in `promptMath` stubs
- Optional Geometry / Alg II thin slices (per handoff: ask after course gate)

## Verdict

**Algebra I course gate: PASS.**
