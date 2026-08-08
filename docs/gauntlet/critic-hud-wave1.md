# Critic — HUD Wave 1

**Artifact:** Four DOM HUD surfaces under `src/ui/**`  
**Reference:** `assets/concept-four-panel.png`  
**Critic:** Blind (did not build)  
**Date:** 2026-08-07  
**Verdict:** **FAIL**

---

## Checklist vs bar

| Requirement | Status | Notes |
|---|---|---|
| Four surfaces: Lesson, Progress Report, Dig, Main Hub | Present | Wired via `HudController` + `GameApp` show/hide APIs |
| Pixel high-contrast green/white/blue | Partial | CSS tokens match palette; still reads as flat CSS cards, not concept chrome |
| Rank / score / energy / progress visible | Present | `StatusPanel` + `VitalsBars` chrome |
| Landscape iPhone + PC usable | Partial | Clamp/`vmin` + landscape media query; dig pads sized for touch |
| `pointer-events` only on interactive parts | Present | `#hud-root` none; `.interactive` auto |
| KaTeX lesson prompts | Present | `renderKatex` on lesson chalkboard |
| TEKS + CC footer | Present | Lesson footer + progress standards line |
| 80% mastery gate messaging | Partial | i18n + gate UI exist; **opt-in** via `showMasteryGate` (default lesson hide) |
| EN / ES / PL locale | Present | `LocaleSwitcher` + `i18n.ts` string table |
| Feels like game HUD, not Bootstrap admin | **FAIL** | See largest gap |

---

## Blind judgment

**Concept-faithful game HUD?** No.  
**Generic retro-skinned web UI?** Yes.

What works: dig overlay (joystick + MOVE + FIRE LASER + unlock toast) is the closest panel to the concept; chrome vitals/status are recognizable game HUD pieces; wiring API is clean.

What breaks the illusion: Lesson / Progress / Hub are **centered modal cards** — green/gray bordered boxes with form rows, ✕ closes, and vertical module lists with PLAY/LOCKED badges. Concept art shows sparse overlays over **in-world** chalkboard / stone tablet / floating hub glyph field, not admin dialogs floating mid-screen.

---

## PASS / FAIL

### **FAIL**

**Single largest gap:** Lesson / Progress / Hub read as centered web modals and quiz forms (answer input + Submit/Close, ✕ dialogs, badge lists) instead of the concept’s sparse diegetic game chrome over world-anchored panels.

---

## Secondary notes (not the gate)

- Dead scaffold CSS (`.touch-joystick` / `.touch-fire`) unused while dig uses `.hud-*` — polish debt.
- Hub defaults include Algebra 1 + locked teasers (fine for slice) but badge chrome pushes “settings menu.”
- Mastery gate copy is buried behind a flag; concept bar expects the gate language to be visible when lessons run.
- No rebuild attempted; gap is compositional/visual language, not a one-line bug.

---

## Recommended next builder pass (non-binding)

1. Strip modal density: lesson = chalkboard + overlays only; answer affordance as game control, not text-field form chrome.
2. Progress = tablet-shaped overlay matching concept layout, not gray card + list.
3. Hub = concept black frame + green module rows without web-badge/✕ dialog language; keep radar/chrome sparse.
4. Default-show mastery gate when lesson opens from pedagogy.
