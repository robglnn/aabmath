# Critic — HUD Wave 1b (Diegetic Remediation)

**Artifact:** Remediating DOM HUD under `src/ui/**` + `src/style.css` HUD sections  
**Reference:** `assets/concept-four-panel.png` + `docs/handoff.md`  
**Prior FAIL:** `docs/gauntlet/critic-hud-wave1.md` (centered modals/forms)  
**Remediation claim:** `docs/gauntlet/remediation-hud-diegetic.md`  
**Critic:** Blind (did not build or remediate)  
**Date:** 2026-08-07  
**Live verify:** `npm run dev` @ `:5174` + screenshots in `docs/gauntlet/shots/critic-hud-*.png`  
**Verdict:** **PASS**

---

## Checklist vs bar

| Requirement | Status | Notes |
|---|---|---|
| Sparse diegetic overlays (not Bootstrap cards) | **PASS** | Lesson left-weighted wood chalkboard; Progress right hologram + pedestal glow; Hub floating right frame; no centered modal shells / ✕ dialogs / PLAY·LOCKED badges |
| Pixel green/white/blue chrome | Present | Tokens + Press Start / VT323; status + vitals match concept corners |
| Rank / score / energy / progress | Present | `StatusPanel` + `VitalsBars` |
| Dig touch chrome | Present | Joystick + MOVE + FIRE LASER; closest to concept (unchanged strength) |
| KaTeX lesson prompts | Present | `renderKatex` on chalkboard path |
| TEKS + CC | Present | Lesson footer + progress standards / alignment lines |
| 80% gate messaging | Present | i18n + gate UI; site interact opens lesson with `showMasteryGate: true` |
| EN / ES / PL | Present | Locale switcher + string table |
| Landscape phone + PC | Present | Clamp/`vmin` + landscape media query; dig pads sized for thumbs |
| `pointer-events` only interactive | Present | `#hud-root` none; `.interactive` / exit / controls auto |

---

## Blind A/B

**Concept-faithful game HUD?** Yes — compositionally.  
**Still a web form / Bootstrap admin?** No — prior modal/form language is gone.

| Surface | vs concept | Judgment |
|---|---|---|
| Dig | Corner chrome + joystick + MOVE/FIRE LASER | Faithful |
| Lesson | Banner + wood-framed slate + standards overlay; answer = underline slot + ▶ SUBMIT, not bordered form row; ◀ exit corner | Faithful enough (DOM stand-in for world board) |
| Progress | Right translucent hologram, sparse readout lines, no gray card/✕ | Faithful |
| Hub | Floating dark frame, green module rows only, radar corner | Faithful |

World stays readable behind every surface. Screenshots confirm sparse overlays, not mid-screen quiz dialogs.

---

## PASS / FAIL

### **PASS**

Prior largest gap (Lesson / Progress / Hub as centered web modals) is closed. Surfaces now read as concept-style diegetic HUD chrome over the world.

---

## Secondary notes (not the gate)

- Lesson answer cluster + ◀ CLOSE remain slightly quiz-adjacent; acceptable as game controls, not modal chrome.
- DOM chalkboard/hologram are screen-space (handoff allows DOM/CSS HUD); they do not track the 3D site meshes — polish, not this FAIL axis.
- Dead scaffold CSS (`.touch-joystick` / `.touch-fire`) still unused — debt from wave1.
- Mastery gate still flag-gated in `LessonScreen`; wiring from `GameApp` site interact is correct for live path.
