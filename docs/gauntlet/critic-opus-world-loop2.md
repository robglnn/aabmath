# Critic — World / Visual / Controls (Opus 5, loop 2)

**Date:** 2026-08-08
**Critic:** Opus 5, fresh context. Did **not** build the remediation. Judged against live pixels only.
**Trigger:** `docs/gauntlet/critic-opus-world-loop1.md` FAIL → `docs/gauntlet/remediation-opus-world-look.md`
**Method:** read `src/game/GameApp.ts`, `input/InputManager.ts`, `player/ThirdPersonCamera.ts`, `player/PlayerController.ts`, `laser/PalmLaser.ts`, `world/props.ts`; ran `npm run dev` (port 5177); drove the live build in a real Chromium at 1280×720 with real `mouse.down` → stepped `mouse.move` → `mouse.up` drags and real keyboard input. 8 screenshots in `docs/gauntlet/shots/opus-w2-*.png`.

---

## Verdict: **PASS** (on the loop-1 largest gap: camera look)

### The gap is closed

**Code.** The tick now reads input before draining it:

```103:111:src/game/GameApp.ts
      // Read input FIRST — beginFrame() zeroes lookDelta; doing it before getLook
      // permanently freezes the camera (Opus world critic loop1).
      const look = this.input.getLook()
      const move = this.input.getMove()
      const firing = this.input.isFireHeld()
      this.input.beginFrame()

      this.followCam.applyLook(look.dx, look.dy)
```

`InputManager.onPointerMove` accumulates into `lookDelta` between frames; `getLook()` now sees that accumulation before `beginFrame()` clears it. The ordering is correct, and it is correct for `firePressed` too.

**Live proof.** I did not accept the code read on its own — every claim below is from a real drag on the live canvas.

| Shot | Input | Result |
|---|---|---|
| `opus-w2-01-boot.png` | none | spawn view: player's back, chalkboards left, two distant peaks |
| `opus-w2-02-drag450.png` | 450 px right-drag, 45 pointer steps | camera orbited ≈ 103° — completely different geometry, ruin edge now filling the left third |
| `opus-w2-03-mountains.png` | +340 px further right-drag | ≈ 181° from spawn: the megalith ruin, the plaza, and the board cluster are now in frame |
| `opus-w2-04-pitchup.png` | 200 px down-drag | pitch changed (clamped at `MIN_PITCH = -0.35`); horizon dropped, camera lowered |
| `opus-w2-10-orbit0..3.png` | four consecutive 390 px drags | a full, continuous 360° orbit. `orbit1` puts the **entire mountain range across the horizon** |
| `opus-w2-20-strafe-look.png` | `KeyW` held **while** dragging 240 px | move and look compose correctly; camera-relative movement steers with the drag |

Loop 1's decisive evidence was a pixel-identical frame across a 450 px drag. That is gone: boot vs. drag, drag vs. mountains, and mountains vs. pitch are all byte-different, and the difference is unambiguously camera pose, not the animated hub glyphs — the whole scene reprojects.

### The four collapsed bar items, re-judged

1. **Controls (Fortnite approachability):** WASD + drag-to-look both work, and work simultaneously. Restored.
2. **Intentional third-person:** the camera is a real orbit rig again — full 360° yaw, smoothed follow at `1 - exp(-8dt)`. Restored.
3. **Optimistic landscape:** `addMountains` places six peaks at z = −30 … −68. They are now reachable — `opus-w2-10-orbit1.png` is a horizon-spanning mountain range, and the water body is visible as a large plate in `opus-w2-10-orbit0/2` and `opus-w2-20`. The scenic backdrop is built **and** viewable. This was the specific loop-1 charge and it no longer holds.
4. **Aiming:** aim direction now tracks where the player is facing, and the player faces where the camera does when moving. Partially restored — see secondary #2.

---

## Secondaries — confirmed still open, **non-blocking**

Per the gate, I am passing on the largest gap and recording the rest. None of these were the loop-1 deciding gap and none of them re-break look.

| # | Finding | Status |
|---|---|---|
| 1 | **No fog, no shadows, no tone mapping.** `grep` for `shadowMap\|castShadow\|Fog\|toneMapping` across `src/` still returns **zero matches**. Flat green plane, razor horizon. This is now the largest remaining visual gap and should be the next remediation. | Open |
| 2 | **Dig beams still fire into the ground.** `PalmLaser.aimBeam` still calls `beam.lookAt(target)` and then `beam.rotateX(Math.PI / 2)` at line 193, on geometry already pre-rotated at line 129. `opus-w2-21-fire.png` shows only a faint orange smear at the player's feet — no beam. Loop 1 ranked this #2 in the remediation order; it was not done. | Open |
| 3 | **Aim is decoupled from look while standing still.** `PlayerController.yaw` is only assigned inside the movement branch (`this.yaw = Math.atan2(dir.x, dir.z)`), and `getAimDirection` uses `player.yaw`. Orbit the camera without moving and the lasers still point the old way. Look works; *aiming with look* does not. | Open |
| 4 | **No camera collision or occlusion push-in.** `opus-w2-20-strafe-look.png` has a hub glyph filling the bottom-right quadrant because the camera drove through it, and the camera clips the pedestal. `Raycaster` still has zero matches in `src/`. | Open |
| 5 | **Pitch range is very tight** — `MIN_PITCH = -0.35`, `MAX_PITCH = 0.55` (≈ −20° to +31°). You cannot look up at the sky or down at your own dig site. Functional, but it is the thinnest part of the restored camera. | Open |
| 6 | Blank identical chalkboards (`CanvasTexture` still zero matches), no walk cycle, buried crater, single dig site, no collision. | Open, all as loop 1 |

---

## Why this is a PASS and not a FAIL

The bar for this gate is "look must work — mouse drag orbits, mountains/water reachable by looking, Fortnite-*approachable* controls, not Fortnite fidelity." All three clauses are now demonstrably true against live pixels. The remaining items are fidelity and polish, which the bar explicitly does not gate on, and the instruction for this loop is to pass on the largest-gap gate when the largest gap is closed.

The one thing I would flag to the orchestrator: loop 1's remediation order listed the `aimBeam` double-rotate as step 2 and it was skipped. It is a one-line deletion. It should ride along with the fog/shadow pass rather than waiting for another full loop.

## Recommended next remediation (unchanged priority from loop 1, minus the fixed item)

1. Delete the second `beam.rotateX(Math.PI / 2)` in `PalmLaser.aimBeam` (one line).
2. Drive `player.yaw` from `followCam.yaw` when idle so aiming follows look.
3. `renderer.shadowMap.enabled` + `castShadow` on sun/props/player, and `scene.fog` with a matching sky gradient — highest fidelity-per-line change available.
4. Widen `MAX_PITCH` and add camera occlusion push-in.
