# Handoff: Axiom Reach — High-School Math Open World (Workshopped)

**Project:** Axiom Reach (codename; working title open)  
**Repo:** https://github.com/robglnn/aabmath.git → `C:\dev\aabmath`  
**Runtime:** **Three.js only** (no Phaser)  
**Platforms:** Landscape iPhone touch + PC web  
**Audience:** High-school Algebra I / II, Geometry, Trig (PSAT/SAT/ACT-adjacent)  
**Languages (Lessons 1–3):** English, Spanish, Polish — full UI strings + instructional text + feedback  
**Math:** KaTeX / LaTeX only — no image-based math  
**Mastery gate:** **≥80%** on independent practice to proceed / complete a skill or lesson  

This document is the source of truth after grilling (2026-08-07). Use **Gauntlet Loops** for every major artifact. Builder ≠ critic. Keep looping against concrete bars.

---

## 1. Vision & North Star

A **third-person, approachable, Fortnite-easy-to-pick-up** math adventure in an **optimistic light-dystopian** open landscape. Visual target is **PS1 / PS2 AAA** — not Fortnite or CoD fidelity. Players rise in rank by demonstrating real mathematical mastery. Pedagogy is non-negotiable; fantasy makes mastery feel powerful.

**Success:** A strong student accelerates but still hits mastery gates and spaced retrieval. A struggling student gets explicit instruction and cannot advance below 80% mastery. Content is authored once, tagged for standards, delivered through a reusable pipeline.

---

## 2. Locked Decisions (Grilling)

| Decision | Lock |
|---|---|
| Visual bar | **PS1/PS2 AAA.** GoldenEye N64 = **floor** for characters/assets, not ceiling. BOTW = scoped scenery/freedom feel only. Fortnite = approachability, not look. |
| Engine | **Three.js only.** No Phaser. HUD = DOM/CSS (or thin canvas overlay) in pixel/retro HUD language from concept art. |
| v1 verbs | Move/look, **palm laser dig/reveal**, lesson interact, hub module select. **No** building, PvP, battle pass, or social layer in v1. |
| World | **Single contiguous region**, light lore only. No multi-planetary politics / cutscene campaign in v1. |
| Pedagogy depth | **Keep heavy pieces:** knowledge graph, IRT, spaced review, multi-jurisdiction tags — real for the Lesson 1–3 slice, not UI mocks. |
| Content slice (this run) | **Algebra I Lessons 1–3** fully authored EN/ES/PL. Same pipeline later fills rest of Alg I → Alg II → Geo → Trig. |
| Localization | **Spanish + Polish required** for first 3 lessons (and their UI/feedback). |
| Concept reference | `assets/concept-four-panel.png` — Lesson, Progress Report, Laser dig, Main Hub. |

---

## 3. Quality Bars (Gauntlet Critics)

Critics must inspect **real output** (running build, screenshots, structured content), not builder summaries.

| Domain | Bar |
|---|---|
| World / characters / lasers | Side-by-side vs **PS1/PS2 third-person** reference + concept art. Pass if it reads as intentional early-2000s AAA, not muddy modern mid-poly. |
| Camera / controls | Approachable like Fortnite onboarding: clear touch joystick + PC WASD/mouse; landscape phone usable. |
| HUD / UX | Matches concept: rank, score, energy/health-style bars, progress, module select, standards line. Pixel/high-contrast green-white-blue. |
| Pedagogy | Explicit teach (I/We/You), KaTeX, immediate feedback, **80% mastery gate**, prerequisite-aware graph for the 3-lesson slice. |
| Standards | Items/skills tagged; Progress Report can show **Texas TEKS + Common Core** for covered material (schema supports wider jurisdiction list). |
| Localization | ES/PL mathematically faithful; UI complete for those strings in the slice. |

**Reject:** Critic failing the game for “not looking like Fortnite/CoD.” That is out of scope.

---

## 4. Setting (Light Lore)

**Tone:** Optimistic light dystopia — hopeful, colorful, slightly absurd, upward possibility. Influences for *flavor only:* Red Rising (merit ranks), Hitchhiker (wit), Valerian (wonder) — **not** full adaptations.

**Place:** One starter region — grassland → pine forest → river/lake → mountain foothills → light ruins under a bright sky. Floating math glyphs near hub. Chalkboard lesson sites; stone pedestal progress report; crater dig sites for laser excavation.

Math fluency unlocks rank, energy systems, and zone permissions. Violence stylized if any; death rare/reversible. No story completion required for math progress.

---

## 5. Core Loop (v1)

1. Spawn in region / enter **Main Hub** → select module (Alg 1 highlighted for slice; others visible locked or teaser).
2. Free roam: move, look, palm-laser **dig/reveal** artifacts that gate or cue skills.
3. Enter **Lesson** site → explicit instruction + guided + independent (KaTeX).
4. Hit **≥80% mastery** → unlock proceed / next skill / dig reward / rank tick.
5. Check **Progress Report** (mastery %, TEKS + CC alignment).
6. Spaced retrieval pulls prior skills back (schema live; scheduling real for L1–L3 graph).

Math is the world’s power language — not a bolted-on quiz overlay when avoidable.

---

## 6. Pedagogy Engine (Non-Negotiable — real for L1–L3)

Priority order unchanged from original research stack:

1. **Explicit teaching** (model → guided → independent; success criteria upfront; worked examples; low extraneous load during teach).
2. **Knowledge graph** — atomic skills, prerequisites, encompassing relations where defined for the slice.
3. **Cognitive load** — clean teach UI; no lore spam during instruction.
4. **IRT** — ability θ + item params; start 1PL/Rasch-capable, schema ready for 2PL; update from attempts in L1–L3.
5. **Spaced repetition + mastery** — cannot proceed below **80%** on the lesson/skill gate; review queue persists.
6. **Immediate feedback** — correct/incorrect with actionable path; diagnostic distractors when possible.

Talented students move faster through the graph but still face mastery gates and retrieval.

---

## 7. Content Architecture & Pipeline

- **Courses later:** Algebra I → Geometry → Algebra II → Trig/Precalc-relevant.
- **This run:** Algebra I Lessons 1–3 only, full pipeline exercised end-to-end.
- Lessons = delivery over the knowledge graph; graph is the durable asset.
- Author once; tag standards; jurisdiction selection changes **reporting**, not item banks.
- Efficiency: design to union of requirements; prefer more demanding overlapping version.

### Pipeline stages (must work for L1–L3 and be reusable)

1. Curriculum Architect  
2. Knowledge Point Spec  
3. Lesson Designer (explicit sequence)  
4. Item Author (tags, distractors, IRT priors)  
5. Pedagogy Critic (Gauntlet)  
6. Localization EN → ES / PL  
7. Integration into engine content format  

Store versioned structured JSON (or equivalent) the game consumes directly.

---

## 8. Standards

Schema supports: CA, NJ, MI, TX, NY, IL, MO, FL, WA, DC, OH, MN + Common Core.

**v1 Progress Report UX:** surface **Texas TEKS + Common Core** for skills covered in Lessons 1–3 (concept art callout). Other jurisdictions tagged in data where cheap; full dashboards later.

---

## 9. UI Surfaces (Concept — four panels)

1. **Lesson** — chalkboard / teach + solve; standards footer; rank/score HUD.  
2. **Progress Report** — mastery by topic, sample trig/geo lines as schema allows, “STANDARD ALIGNMENT”; vitals bars.  
3. **Laser dig/find** — palm lasers excavate; touch controls (joystick, fire); unlock messaging.  
4. **Main Hub** — select module Alg 2 / Trig / Geometry (Alg 1 playable); radar; rank/score/progress.

---

## 10. Technical Requirements

- Three.js third-person camera; low-poly PS1/PS2 aesthetic; modern-enough lighting without breaking the era read.
- Touch: landscape joystick + actions; PC: keyboard/mouse.
- KaTeX for all math.
- Data model day one: IRT fields, SR state, encompassing credit, multi-jurisdiction tags.
- Accessibility: high-contrast HUD option; SR-friendly math where feasible in web stack.
- Live **workbench** (`workbench.html` or equivalent) updated as Gauntlet progresses.

---

## 11. Algebra I — Lessons 1–3 (This Run)

Working titles (refine via architect agent):

1. **Variables, Expressions, and the Language of Algebra**  
2. **Evaluating Expressions & Order of Operations with Variables**  
3. **From Expressions to Equations — Equality and Solving Simple Linear Equations**  

Each must ship: structured content, KP + prereqs, standards tags, EN/ES/PL, mastery gate ≥80%, in-world integration notes, Gauntlet critic report.

---

## 12. Gauntlet Loop (Project-Adapted)

From [Gauntlet Loop](https://somethingbig.ai/gauntlet-loop) — tips only; model roster is ours:

1. Lead gives **goal + concrete bar** (not architecture micromanagement).  
2. Split into smallest independently judgeable pieces.  
3. Each piece: **Builder** + separate **Critic** (fresh context).  
4. Critic inspects real artifact; blind A/B vs bar when possible; returns **largest gap**.  
5. Loop until pass or human stop.  
6. Optional smoothing pass after a wave so pieces feel like one game.  
7. Maintain live workbench; don’t interrupt loops for status.

### Model roster (mandatory)

| Role | Models |
|---|---|
| Efficiency builders | `cursor-grok-4.5-high`, `composer-2.5` (**no** fast variants, **no** Kimi) |
| Frontier / sparse | `claude-opus-5-thinking-high` — sparingly; short goal briefs, minimal skill overlays |
| Orchestrator | Parent agent; escalate planning only when stuck twice or high-stakes architecture |

Batch related work; reuse context/cache; critics stay clean.

### First-wave Gauntlet targets

- Playable region + character + palm laser dig  
- Four UI surfaces wired  
- L1–L3 content + graph + IRT/SR schema + 80% gates  
- EN/ES/PL for L1–L3  
- TEKS + CC progress reporting for covered skills  
- Pipeline docs + example so Lesson 4+ can follow the same path  

---

## 13. Acceptance Criteria (This Run)

- [x] Playable Three.js slice: move/look, laser dig, lesson entry, hub module select  
- [x] Four concept UI surfaces functional for the slice  
- [x] Algebra I Lessons 1–3 structured, KaTeX, explicit sequence, **≥80% mastery gate**, EN/ES/PL  
- [x] Knowledge points + prereqs + standards tags; Progress Report shows TEKS + CC for covered material  
- [x] IRT + spaced-review + mastery logic real for L1–L3 attempts (not fake percentages)  
- [x] Pipeline documented + demonstrated by producing all three lessons the same way  
- [x] Major pieces passed Gauntlet critic vs PS1/PS2 + concept bars  
- [x] Approachable controls on landscape iPhone + PC web  

See `docs/gauntlet/exit-gate-wave1.md`.
---

## 14. Out of Scope (This Run)

- Phaser, building, PvP, battle pass, full multiplayer  
- Multi-region / multi-planetary narrative  
- Full Algebra I (beyond L1–L3) and other courses’ full content  
- Voice acting  
- Matching Fortnite/CoD visual fidelity  

---

**Execute with high agency.** Destination over micromanagement. When in doubt: mastery unavoidable, fantasy of rising through math power feels real, visuals read PS1/PS2 AAA, controls feel Fortnite-approachable.
