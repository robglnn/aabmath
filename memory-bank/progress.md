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

## Wave 6 content (PASS)
- Algebra I L16–L18 EN/ES/PL via `scripts/author-algebra1-l16-l18.mjs`
- +9 KPs (zero-product/solve-factoring/check-roots; formula/discriminant/apply; parabola direction/vertex/features)
- Unlock: L15→board_16 → L16→17 → L17→18 → L18→board_19 teaser
- World boards 16–18 in `WorldSites.ts` (spread); correctIndex hist `[5,4,4,4]`
- Notes: `docs/gauntlet/wave6-content-notes.md`
- Item counts: 17 / 17 / 17; promptMath 17/17; distinct EN/ES/PL feedback (0 clones); `npm run build` green
- **Critic wave6 PASS:** `docs/gauntlet/critic-content-wave6.md` — largest gap: EN `\text{ or }` inside ES/PL KaTeX choices (non-blocking)

## Wave 7 content (PASS)
- Algebra I L19–L21 EN/ES/PL via `scripts/author-algebra1-l19-l21.mjs`
- +9 KPs (exp recognize/form/evaluate; radical perfect/simplify/ops; rational simplify/multiply/divide)
- Unlock: L18→board_19 → L19→20 → L20→21 → L21→board_22 teaser
- World boards 19–21 in `WorldSites.ts` (spread); correctIndex hist `[5,4,4,4]`
- Notes: `docs/gauntlet/wave7-content-notes.md`
- Item counts: 17 / 17 / 17; promptMath 17/17; distinct EN/ES/PL feedback (0 clones); no EN `\text{ or }` in ES/PL choices
- **Critic wave7 PASS:** `docs/gauntlet/critic-content-wave7.md` — largest gap: shared EN `\text{vs}` in `promptMath` (`alg1-l20-i05`)

## Wave 8 content (PASS)
- Algebra I L22–L24 EN/ES/PL via `scripts/author-algebra1-l22-l24.mjs`
- +9 KPs (abs meaning/equations/inequalities; function notation/domain/range; arithmetic/geometric/nth-term)
- Unlock: L21→board_22 → L22→23 → L23→24 → L24→board_25 teaser
- World boards 22–24 in `WorldSites.ts` (spread); correctIndex hist `[5,4,4,4]`
- Notes: `docs/gauntlet/wave8-content-notes.md`
- Item counts: 17 / 17 / 17; promptMath 17/17; distinct EN/ES/PL feedback (0 clones); no EN `\text{ or }` in ES/PL choices
- **Critic wave8 PASS:** `docs/gauntlet/critic-content-wave8.md` — largest gap: shared EN `\text{function?}` / `\text{classify}` / `\text{zeros}`

## Wave 9 content (PASS)
- Algebra I L25–L27 EN/ES/PL via `scripts/author-algebra1-l25-l27.mjs`
- +9 KPs (two-var inequality; systems inequalities region/test; scatter/correlation/best-fit; modeling write/multi/choose)
- Unlock: L24→board_25 → L25→26 → L26→27 → L27→board_28 teaser
- World boards 25–27 in `WorldSites.ts` (spread (−16,36), (32,−30), (−34,8)); correctIndex hist `[5,4,4,4]`
- Notes: `docs/gauntlet/wave9-content-notes.md`
- Item counts: 17 / 17 / 17; promptMath 17/17; 0 feedback clones; 0 EN `\text{or/and/yes/no}` in ES/PL; `npm run build` green
- **Critic wave9 PASS:** `docs/gauntlet/critic-content-wave9.md` — largest gap: shared EN `\text{cloud}` / `\text{cause?}` / `\text{grupos/clusters}` in `promptMath`

## Next
- Wave 9 exit gate
- Algebra I course gate (~30) / human playtest
- Harden spaced-review UX and IRT with real attempt data

## Play
```bash
npm run dev
```
- Game: http://localhost:5173/
- Workbench: http://localhost:5173/workbench.html
