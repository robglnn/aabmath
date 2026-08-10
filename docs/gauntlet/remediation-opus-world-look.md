# Remediation — Opus world loop 1 (camera look)

**Trigger:** `docs/gauntlet/critic-opus-world-loop1.md` FAIL  
**Largest gap:** `beginFrame()` zeroed `lookDelta` before `getLook()`, freezing yaw/pitch forever.

## Fix

In `GameApp.start()` tick: **read** look / move / fire, **then** `beginFrame()`, then apply camera/player/lasers.

Verified by code order; Opus re-critic (loop 2) must confirm live drag orbits the camera and mountains become reachable.
