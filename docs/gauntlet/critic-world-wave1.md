# Critic — World / Player / Palm Laser (Wave 1)

**Date:** 2026-08-08  
**Critic:** Fresh context (did not build). Harsh. Blind A/B vs bar.  
**Artifact:** Third-person world / player / palm laser dig slice  
**Live check:** `npm run dev` @ `http://localhost:5173/` + viewport screenshot  

---

## Bar (judged against this — not Fortnite/CoD fidelity)

- PS1/PS2 AAA intentional look: `flatShading`, limited polys, readable silhouettes, vibrant optimistic landscape
- GoldenEye N64 = **floor** for character/asset fidelity
- Concept spirit: fields, pines, mountains, chalkboard, pedestal, dig crater, dual palm lasers
- Fortnite = control approachability only

---

## What was inspected

| Source | Finding |
|---|---|
| `src/game/GameApp.ts` | Composition root still stub: faceted green `PlaneGeometry`, static camera, empty dig/move HUD hooks. **Does not import** world / player / laser / input. |
| `src/main.ts` | Boots `GameApp` only. |
| `src/game/world/*` | Terrain, pines, mountains, ruins, sites (board / pedestal / hub / crater) exist as modules. |
| `src/game/player/*` | Boxy player + third-person camera exist. |
| `src/game/laser/PalmLaser.ts` | Dual palm beams + dig progress exist. |
| `src/game/input/InputManager.ts` | WASD / look / touch joystick / fire exist. |
| Grep for imports of those modules from composition | **Only** `PlayerController` → `terrain`. Nothing else is reachable from the running app. |
| Live screenshot | Empty green plane + sky + dig HUD chrome. No character, no landscape props, no lasers, no third-person follow. |
| Concept art `assets/concept-four-panel.png` | **Missing** from repo (cannot side-by-side). |

---

## Blind A/B

**Would a player say this reads as early-2000s console third-person, or as a generic Three.js demo?**

**Generic Three.js demo.** Unambiguously. The running build is a Lambert plane under hemisphere + directional light with DOM dig chrome. Zero third-person silhouette. Zero dig fantasy. Orphaned modules may lean PS1 (`flatShading`, cone pines) on paper; they do not exist in the player's frame.

---

## Verdict: **FAIL**

### Single largest remaining gap

**Composition root never wires the slice.** `GameApp` still renders a stub ground and leaves `onFireLaser` / `onJoystick` as no-ops. World, player, camera, lasers, dig sites, and input are dead code sitting beside an empty plane. Until that wiring ships, fidelity debates (GoldenEye character floor, mountain cone quality, concept chalkboard read) are irrelevant — there is no playable third-person dig world to judge.

### One biggest fix (next builder — do this, not a nitpile)

Wire `GameApp` as a real composition root for one tick loop:

1. Remove the stub ground plane.
2. Call `buildWorld(scene)`.
3. Instantiate `PlayerController`, `ThirdPersonCamera`, `PalmLaserSystem`, `DigSiteManager` (from crater site), `InputManager`.
4. Each frame: `input.beginFrame()` → move/look → player update → camera follow → dual palm beams when fire held → dig apply on crater → `updateWorld`.
5. Hook HUD dig callbacks to the same input/fire path (or retire duplicate HUD stubs so one path drives lasers).

Ship a screenshot where a readable low-poly figure stands in the optimistic landscape with dual palm beams hitting a crater. Then re-enter critic for fidelity vs GoldenEye floor / concept sites.

### Explicitly out of scope for this critic pass

- Laundry list of mesh polish (mountain cones, walk anim on hands-only, water opacity, etc.)
- Rewriting the game
- HUD pedagogy / lesson content (other waves)

---

## Evidence note

Favicon 404 only in console; scene renders. Critic judgment is visual + composition, not runtime crash.
