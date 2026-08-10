# Critic — World / Visual / Controls (Opus 5, loop 1)

**Date:** 2026-08-08
**Critic:** Opus 5, fresh context. Did **not** build this. Prior PASSes read but not honored — judged against live reality only.
**Method:** read `src/game/**` end-to-end; ran `npm run dev`; drove the live build in a real browser (Playwright, 1280×720) with real key/mouse input; 14 screenshots in `docs/gauntlet/shots/opus-w1-*.png`.
**Reference:** `assets/concept-four-panel.png`

---

## Verdict: **FAIL**

### Single largest gap

**The third-person camera cannot look.** `GameApp.start()` calls `input.beginFrame()` — which zeroes `lookDelta` — and then reads `input.getLook()` on the very next synchronous line. Because pointer events can only be delivered *between* frames, `getLook()` returns `{dx: 0, dy: 0}` on every single frame, forever. Camera yaw/pitch are frozen at their constructor values for the entire session.

```103:105:src/game/GameApp.ts
      this.input.beginFrame()
      const look = this.input.getLook()
      this.followCam.applyLook(look.dx, look.dy)
```

Verified live: a real 450 px mouse drag across the canvas produced a **pixel-identical** frame (`opus-w1-01-boot.png` vs `opus-w1-03-drag.png` — only the hub glyphs animated).

This is the largest gap because it is not one bug, it is the load-bearing failure that collapses four separate bar items at once:

1. **Controls bar (Fortnite approachability):** "WASD + look" is half-missing. WASD works; look does not exist.
2. **Intentional third-person bar:** a camera that cannot orbit is not a third-person camera, it is a fixed rail.
3. **Optimistic landscape bar:** every mountain in the game sits at **z = −30 … −68** (`props.ts` `addMountains`). The camera is locked looking toward **+Z**. The player is therefore structurally incapable of ever seeing the mountain range. The same is true of the water body at x = −42 — it can only ever slide past as a gray sliver in the left periphery (visible as exactly that in `opus-w1-13-board.png`). The entire scenic backdrop that the concept art sells is **built and unreachable**.
4. **Palm dual laser fantasy:** aim direction is derived from `player.yaw` only, so with look dead the player can only ever fire in the one direction they happen to be walking. There is no aiming.

Fix the frame-order bug first. Nothing else in this critique can be fairly re-judged until the player can turn their head.

---

## Blind A/B

> Shown `opus-w1-01-boot.png` and `opus-w1-11-dig.png` with no context: **early-2000s console dig adventure**, or **generic Three.js demo**?

**Generic Three.js demo. Not close.**

The tells, in the order a stranger would hit them:

- **Uniform kelly-green plane meeting a flat cyan band at a razor horizon.** No fog, no sky gradient, no clouds, no atmospheric perspective. `grep` for `Fog|shadowMap|toneMapping` across `src/` returns **zero matches**. The concept art's whole mood is haze, warm sun, and cloud — the build has a `MeshBasicMaterial` sphere of one flat color.
- **Nothing casts a shadow.** `terrain.ts` sets `receiveShadow = true`, but `renderer.shadowMap` is never enabled and nothing sets `castShadow`, so it is a dead property. Every object — player, boards, ruins, pines — floats with no contact point. This is the single loudest "untextured engine test" signal in the frame, and it is below the GoldenEye floor, which had blob shadows.
- **Thirty byte-identical chalkboards.** `WorldSites.ts` is 500 lines of `createLessonBoard()` copy-pasted 30 times with only x/z/rotation changed. Seven are visible in the opening frame alone (`opus-w1-01-boot.png`). They read as a warehouse of unplugged televisions, not as sites in a world. There is no landmark, no silhouette hierarchy, no reason to walk toward one board over another.
- **The chalkboards are blank black slabs.** `grep` for `CanvasTexture|Sprite|TextGeometry` returns zero matches — the boards are structurally incapable of showing chalk. The concept art's core image is a board reading `SOLVE FOR X`. `opus-w1-13-board.png` is a featureless black rectangle on legs. The diegetic promise is entirely unimplemented; the "chalkboard" exists only as an HTML overlay.
- **The player character has no silhouette and no animation.** Torso, both arms, and both legs all use the same `suit` material `0x1a1a22`, so the whole body renders as one black mass with a tan cube on top — arms are invisible against the torso in every screenshot. `animateWalk()` applies `rotation.x` to the meshes named `handL`/`handR`, which are **standalone cubes**, not parented to the arms — rotating a cube about its own center produces no visible motion. Legs are never touched. The character slides across the ground as a rigid statue. GoldenEye's Bond had a walk cycle in 1997.

---

## Core fantasy: the dig

This is the game's headline verb and its worst frame. `opus-w1-11-dig.png` / `opus-w1-12-dig2.png`:

- **The beams point straight down at the player's feet.** `PalmLaser.aimBeam` calls `beam.lookAt(target)` — which already aligns local +Z at the target, because the geometry was pre-rotated with `beamGeo.rotateX(Math.PI/2)` — and then calls `beam.rotateX(Math.PI/2)` **again**, sending local +Z to −Y. The result on screen is two ~0.8-unit stubs beside the shins (cyan left, orange right) that terminate at the grass. They read as glowing leg-warmers. The concept panel shows two dramatic beams crossing and converging on a glowing pit; the build shows nothing of the kind.
- **The camera sits directly behind the player**, so even a correct forward beam would be almost entirely occluded by the player's own back (`opus-w1-09-beam.png`, where the only beam evidence is a faint smear on the ground).
- **The crater is invisible.** `dig_crater_1` is placed at terrain height − 0.15 with its pit cylinder at y = −0.3, i.e. below the ground plane; the rim `RingGeometry` z-fights the terrain into a dark maroon smudge. The dig happens on a featureless lawn.
- **There is exactly one dig site** in a 200 × 200 world. `DigSiteManager` is constructed with a single hard-coded crater.
- **Standing on the crater makes it undiggable** — `applyLaser` skips any site with `along < 0.5`, so the player must intuit that they should back up.
- **The reveal has no impact.** No particles, no dust, no sparks, no crater deformation, no screen shake, no sound. The revealed artifact is an octahedron that rises behind the player, out of frame. Feedback is a plain HTML `GEOMETRY UNLOCKED` box at the top of the screen.

---

## Other findings (not deciding, but load-bearing)

| # | Finding | Evidence |
|---|---|---|
| 1 | **No collision of any kind.** `grep collision\|raycast\|Raycaster` → zero matches. The player walks through boards, ruins, pines, mountains, and the lake. | `opus-w1-06-firing.png` — camera fully embedded inside a ruin pillar, gray slab filling the screen, player invisible |
| 2 | **No camera collision / occlusion push-in.** The camera clips through world geometry rather than pulling toward the player. | `opus-w1-06`, `opus-w1-13` — the player is hidden behind a chalkboard the camera has clipped into |
| 3 | **No interaction prompt.** `E` is the interact key and is advertised nowhere in-world or in the HUD. There is no proximity glyph, no highlight, no button hint. A player has no way to discover it. | `opus-w1-13-board.png` — standing at the board, HUD shows only MOVE / FIRE LASER |
| 4 | **Water is a detached floating plate.** `createWaterHint` builds a plane at `terrainHeight − 0.55` with no shoreline blend and no relation to a basin, so it reads as a gray-blue sheet hovering over the grass. | `opus-w1-13-board.png`, mid-left |
| 5 | **Hub glyphs intersect the player.** Floating octahedrons orbit at y ≈ 2.2 and pass straight through the character's head. | `opus-w1-04-walkW.png` |
| 6 | **Terrain is effectively flat.** `PlaneGeometry(200, 200, 48, 48)` → 4.2 units per quad, with a summed-sine amplitude of roughly ±2 units. At eye level there is no readable relief. The concept art's rolling fields and boulder fields do not exist. | all screenshots |
| 7 | **Player snaps to terrain height with no smoothing**, no jump, no gravity, no slope response. | `PlayerController.snapToGround` |
| 8 | **Shared-temp-vector aliasing in the laser system.** `getAimPoint()` returns `this.tmpTarget`; `getAimDirection()` is then called and overwrites `this.tmpTarget` before `lasers.update(..., aimPoint)` consumes it. Currently benign (12 vs 10 scalar) but it is a live aliasing bug. | `GameApp.ts:120-122`, `PalmLaser.ts:171-184` |
| 9 | **Lesson overlay text collides.** Title and body lines overlap at 1280×720; the header runs off the panel. | `opus-w1-14-lesson.png` |

---

## What is actually working

Credit where due, so the remediation does not thrash what is fine:

- `flatShading: true` is used consistently across terrain, props, sites, and the player — the faceted material language is right.
- Movement is correctly camera-relative and feels responsive at `MOVE_SPEED = 7`.
- The HUD frame (rank / score / progress, TEKS + Common Core standard line, EN/ES/PL locale switch) is legible and on-concept.
- The lesson/review/pedagogy wiring behind the boards is real and works end-to-end; this critique is about world, visual, and controls only, per the gate.
- Site proximity → `E` → lesson → unlock → toast is a complete loop. The bones of the game are here; the presentation and the camera are not.

---

## Recommended remediation order

1. **Fix the look bug.** Move `beginFrame()` to the *end* of the tick (or have `getLook()` drain-and-reset). One-line class of fix, unblocks everything.
2. **Fix `aimBeam`** — delete the second `beam.rotateX(Math.PI / 2)`. Then bias the follow camera slightly off-shoulder so the beams are not eclipsed by the player's back.
3. **Turn on shadows** (`renderer.shadowMap.enabled`, `castShadow` on sun + props + player) and **add `scene.fog`** with a matching sky gradient. Highest visual-fidelity-per-line change available.
4. **Give the character a silhouette** — different material for arms/gloves vs torso, and parent the hands to actual arm pivots so the walk cycle reads.
5. **Make the crater visible** and add at least a handful of dig sites with impact FX.
6. **Kill the 30-identical-board array.** Vary board dressing, cluster them into 3–4 themed sites with landmarks, and put chalk on them via `CanvasTexture`.
7. Add capsule-vs-prop collision and camera occlusion push-in.
