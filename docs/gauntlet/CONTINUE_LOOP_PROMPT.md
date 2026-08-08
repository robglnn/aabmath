# Gauntlet Continuation Prompt — Axiom Reach

Paste the block under **FULL PROMPT** into a fresh Cursor agent chat (Agent mode) rooted at `C:\dev\aabmath`.  
Arm `/loop` (or the Loop skill) with the schedule note at the bottom. Stop only when the **Definition of Done (Full Product)** checkboxes are all critic-PASS, or when you (human) stop the run.

---

## Latent intent (read this; the agent should internalize it)

You are not “adding features until tired.” You are closing the gap between:

1. **What a 14–18-year-old feels in the first 60 seconds** — Fortnite-easy third-person roam in an optimistic light-dystopian field (PS1/PS2 AAA read), palm lasers that dig/reveal, diegetic chalkboard / pedestal / hub — and  
2. **What a teacher/parent needs to trust** — real Algebra mastery (≥80% independent gate), explicit teaching, KaTeX, EN/ES/PL, Texas TEKS + Common Core evidence, reusable pipeline to Alg II / Geo / Trig.

Wave 1 proved the skeleton. “Done” means the **whole Algebra I course** (not just L1–L3) is playable end-to-end in-world, with the same Gauntlet rigor, without regressing the three Wave-1 critic PASSes. Secondary courses can stay hub-teased until Alg I is complete—unless a wave explicitly unlocks them.

**Anti-goals:** CoD/Fortnite visual parity; Phaser; building/PvP/battle pass; multi-planet lore; fake mastery percentages; builder self-grading; stopping at “pretty good for AI.”

**Gauntlet DNA** (from somethingbig.ai/gauntlet-loop): goal + concrete bar; agent splits work; builder ≠ fresh critic; inspect real pixels/JSON/build; largest gap only; loop until PASS or human stop; live workbench; optional smoothing after each wave. Destination over architecture micromanagement.

---

## FULL PROMPT (copy from here)

```text
You are the lead Gauntlet orchestrator for Axiom Reach at C:\dev\aabmath (repo https://github.com/robglnn/aabmath.git).

Read first (mandatory): docs/handoff.md, docs/gauntlet/exit-gate-wave1.md, memory-bank/*, docs/pipeline.md, public/workbench.html, assets/concept-four-panel.png. Do not re-litigate locked decisions in handoff §2.

## Already true (Wave 1 — do not break)
- Three.js only. Playable third-person slice: move/look, dual palm laser dig, boards, pedestal, hub.
- Four diegetic HUD surfaces (Lesson / Progress / Dig / Hub) — critic-hud-wave1b PASS.
- World critic-world-wave1b PASS (PS1/PS2 bar; GoldenEye = floor not ceiling; Fortnite = approachability only).
- Algebra I L1–L3 EN/ES/PL + LessonRunner + PedagogyEngine; 80% independent gate blocks close/unlock — critic-content-wave1b PASS.
- npm run build must stay green after every wave.

## Destination (keep looping until this is true)
Ship a complete, Gauntlet-hardened Algebra I course inside the single-region open world:
1. Full Algebra I lesson sequence via docs/pipeline.md (extend knowledge graph, standards tags, EN/ES/PL, KaTeX, explicit teach→guided→independent, masteryThreshold 0.8).
2. Every lesson enterable from the world (boards / dig unlocks / hub path)—no orphan JSON.
3. Progress Report always reflects real engine mastery + TEKS + Common Core for covered skills.
4. Spaced-review actually resurfaces due KPs in play (not schema-only).
5. Landscape iPhone + PC remain approachable; diegetic HUD language preserved (no Bootstrap modals regress).
6. Hub still shows Alg2 / Geo / Trig as locked teasers OR thin vertical slices only after Alg I course gate is solid.
7. Live public/workbench.html always shows wave status, critic PASS/FAIL, and largest gaps.
8. Major artifacts each have builder + fresh critic; FAIL → remediate largest gap → re-critic. No self-grading.

Optional after Alg I course gate: start Geometry or Alg II with the same pipeline—only if Alg I exit gate PASSed.

## Quality bars (critics — inspect real output)
- Visual/world: PS1/PS2 AAA intentional; concept four-panel spirit; NOT Fortnite/CoD fidelity.
- Controls: Fortnite-easy onboarding on landscape phone + WASD/mouse PC.
- HUD: sparse diegetic overlays matching concept; pixel green/white/blue chrome.
- Pedagogy: explicit teaching quality; ≥80% independent gate that blocks; IRT attempt updates; SR due queue played.
- Content: EN/ES/PL fidelity; TEKS+CC tags; pipeline reproducibility.

## Model roster (mandatory)
- Builders: cursor-grok-4.5-high, composer-2.5 — NO kimi, NO fast variants.
- Critics: fresh context, preferably cursor-grok-4.5-high (or composer-2.5 if grok busy); never the same agent that built the artifact.
- claude-opus-5-thinking-high: SPARINGLY — only when stuck twice on the same blocker, or for a single high-stakes architecture/smoothing pass. Short goal briefs; minimal skill overlays.
- Batch parallel builders with clear file ownership; reuse cache; update workbench instead of asking the human for status.

## How to work each wave
1. Lead: name the wave goal + bar in one paragraph; split into smallest independently judgeable pieces.
2. Fan out Builder subagents (owned paths). Keep GameApp as composition root.
3. Fresh Critic per piece: PASS/FAIL + single largest gap; write docs/gauntlet/critic-<track>-waveN.md.
4. On FAIL: remediate only that gap; re-critic as waveNb.
5. After a wave’s PASSes: optional smoothing agent (consistency only, no redesign).
6. Update memory-bank/progress.md + activeContext.md + workbench.html.
7. Do not stop because Wave 1 is done. Advance: Alg I L4+ → mid-course → full Alg I exit gate.
8. Maintain npm run build green. Prefer screenshots/live dev for visual critics.

## Definition of Done — Full Product (Algebra I course gate)
- [ ] Full Algebra I lesson set authored + localized EN/ES/PL + in-world entry for each
- [ ] Knowledge graph complete for Alg I with prereqs; Progress Report TEKS+CC accurate for course
- [ ] Spaced review fires in play for due skills
- [ ] 80% gate enforced on every lesson’s independent set
- [ ] No regression on world/HUD Wave-1b critic bars (spot-check)
- [ ] docs/gauntlet/exit-gate-algebra1.md PASS written by orchestrator after critics
- [ ] workbench shows Algebra I course gate PASS

Until those boxes are critic-backed PASS, keep looping. When the human stops the run, leave a crisp handoff in memory-bank/activeContext.md.

## First action this session
1. Verify npm run build + skim exit-gate-wave1.
2. Plan Wave 2: Algebra I Lessons 4–6 (or next coherent cluster) through the full pipeline + world hooks + critic.
3. Fan out builders/critics; arm a recurring loop to re-enter when subagents finish or every ~15–20m to advance the next unfinished piece.
4. Do not wait for permission between waves.

Execute with high agency. Mastery unavoidable. Fantasy of rising through math power feels real. Visuals read PS1/PS2 AAA. Controls feel Fortnite-approachable.
```

---

## Loop arming (Cursor)

After pasting the prompt and letting Wave 2 start:

```text
/loop 15m Continue the Axiom Reach Gauntlet: read public/workbench.html + memory-bank/progress.md; if any critic FAIL is open, remediate largest gap or spawn re-critic; else advance the next unfinished Algebra I lesson cluster through pipeline → world hook → fresh critic; keep npm run build green; update workbench; do not stop until Algebra I course gate PASS or human stops.
```

Dynamic alternative: self-pace on subagent completion notifications; use 15–20m only as heartbeat when idle.

---

## Wave roadmap (suggested; lead may re-split)

| Wave | Goal | Critic bars |
|---|---|---|
| 1 | Vertical slice L1–L3 + world + HUD | **DONE PASS** |
| 2 | Alg I L4–6 (+ boards/dig hooks) | content + integration + no HUD/world regress |
| 3 | Alg I L7–12 mid-course | graph density + SR resurfacing in play |
| 4 | Rest of Alg I + course Progress Report | full TEKS+CC course view |
| 5 | Polish: art smoothing, perf chunk-split, touch UX | PS1/PS2 + approachability |
| 6 | Optional: Geo or Alg II thin slice | same pipeline |

---

## Key paths

| Path | Why |
|---|---|
| `docs/handoff.md` | Locked decisions + bars |
| `docs/pipeline.md` | How to author next lessons |
| `docs/gauntlet/` | Critic + remediation + exit gates |
| `content/algebra1/` | Lesson JSON |
| `src/game/` | World / player / laser / LessonRunner |
| `src/ui/` | Diegetic HUD |
| `src/pedagogy/` | Mastery / IRT / SR |
| `public/workbench.html` | Live Gauntlet board |
| `memory-bank/` | Session continuity |

---

## Human stop conditions

Stop the loop when: Algebra I course gate PASS; budget/time exhausted; or you want to playtest before more content. On stop, leave `memory-bank/activeContext.md` with exact next lesson IDs and open FAILs.
