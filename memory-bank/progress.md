# Progress

## Done (Wave 1)
- Workshopped handoff + Memory Bank
- Playable Three.js slice (world, player, dual palm lasers, dig, boards, hub)
- Four diegetic HUD surfaces (Lesson / Progress / Dig / Hub)
- Algebra I L1–L3 EN/ES/PL + knowledge graph + TEKS/CC + pipeline
- LessonRunner wired to PedagogyEngine with **80% independent gate**
- Gauntlet critics **PASS**: world 1b, HUD 1b, content 1b
- Exit gate: `docs/gauntlet/exit-gate-wave1.md`

## Wave 2 (PASS)
- Algebra I L4–L6 EN/ES/PL; boards 4–6; SR in-session; MC shuffle + key diversification
- Exit: `docs/gauntlet/exit-gate-wave2.md`

## Wave 3 content (PASS on KaTeX re-critic)
- Algebra I L7–L9 EN/ES/PL via `docs/pipeline.md` / `scripts/author-algebra1-l7-l9.mjs`
- +9 KPs; standards-index `lessonCoverage` for l07–l09
- Unlock: L6→board_7 → L7→board_8 → L8→board_9 → L9→board_10 teaser
- World boards 7–9 in `WorldSites.ts`; build green; correctIndex hist `[5,4,4,4]`
- Notes: `docs/gauntlet/wave3-content-notes.md`
- KaTeX remediation: `docs/gauntlet/remediation-katex-wave3.md`
- **Critic wave3b PASS:** `docs/gauntlet/critic-content-wave3b.md` — L8 `promptMath` 17/17; MC choice KaTeX; unlock/shuffle/build OK

## Wave 4 content (PASS)
- Algebra I L10–L12 EN/ES/PL via `scripts/author-algebra1-l10-l12.mjs`
- +9 KPs (elimination, exponents, polynomials); `lessonCoverage` l10–l12
- Unlock: L9→board_10 → L10→11 → L11→12 → L12→board_13 teaser
- World boards 10–12 in `WorldSites.ts` (spread); correctIndex hist `[5,4,4,4]`
- Notes: `docs/gauntlet/wave4-content-notes.md`
- Item counts: 17 / 17 / 17; promptMath 17/17; zero raw `\frac` in choices; `npm run build` green
- **Critic wave4 PASS:** `docs/gauntlet/critic-content-wave4.md`

## Wave 5 content (PASS)
- Algebra I L13–L15 EN/ES/PL via `scripts/author-algebra1-l13-l15.mjs`
- +9 KPs (distribute/FOIL/multiply; GCF/trinomial/verify; DOS/more/perfect-square)
- Unlock: L12→board_13 → L13→14 → L14→15 → L15→board_16 teaser
- World boards 13–15 in `WorldSites.ts` (spread); correctIndex hist `[5,4,4,4]`
- Notes: `docs/gauntlet/wave5-content-notes.md`
- Item counts: 17 / 17 / 17; promptMath 17/17; math choices `$...$` KaTeX; `npm run build` green
- **Critic wave5 PASS:** `docs/gauntlet/critic-content-wave5.md` — largest gap: equation-cloned EN=ES=PL feedback (non-blocking)

## Next
- Wave 5 exit gate
- GitHub Pages deploy (if needed)
- Algebra I course gate / human playtest
- Harden spaced-review UX and IRT with real attempt data

## Play
```bash
npm run dev
```
- Game: http://localhost:5173/
- Workbench: http://localhost:5173/workbench.html
