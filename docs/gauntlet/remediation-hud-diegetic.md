# HUD Diegetic Remediation — Wave 1

**Date:** 2026-08-07  
**Critic gap addressed:** Lesson / Progress / Hub read as centered web modals and quiz forms instead of sparse diegetic game chrome over world-anchored panels.

## What changed

### Lesson (`LessonScreen.ts` + CSS)
- Removed centered green modal frame wrapping the whole lesson.
- Banner (`LESSON: ALGEBRA 1`) floats at top center; world stays visible behind.
- Chalkboard is a wood-framed in-world mount (left-weighted), KaTeX on green slate with cyan glow.
- Answer affordance is a game control: underline slot + `▶ SUBMIT` pixel button — no bordered text-field row.
- Replaced ✕ / Close form buttons with sparse `◀ BACK` corner exit.
- Standards footer pinned bottom-center as overlay text.

### Progress Report (`ProgressReport.ts` + CSS)
- Removed centered gray card + ✕ dialog.
- Right-weighted translucent hologram panel with pedestal glow (stone readout).
- Sparse readout lines; no modal chrome or close icon in frame.

### Main Hub (`MainHub.ts` + CSS)
- Removed centered card, ✕, and PLAY/LOCKED badge chips.
- Floating translucent black frame over vista (right side); green module rows only.
- Radar stub stays bottom-left corner; no Bootstrap-style list buttons.

### Shared
- `.hud-screen` no longer flex-centers modal boxes; overlays are positioned sparse.
- `HudController` API unchanged (`showLesson`, `showProgressReport`, `showMainHub`, callbacks).

## Not in scope (critic secondary notes)
- Mastery gate default-on flag
- Dead `.touch-joystick` scaffold CSS cleanup

## Verify
```bash
npm run build
```
Open lesson board / progress pedestal / hub plaza in-world (E near sites).
