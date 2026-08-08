# Critic remediation — World Wave 1 FAIL → rewire

**Trigger:** [World critic](19e8c91a-4658-4d5d-9c12-893d6262a9c4) FAIL — orphaned modules.

**Fix applied (orchestrator):**
- `GameApp` now calls `buildWorld`, `PlayerController`, `ThirdPersonCamera`, `PalmLaserSystem`, `DigSiteManager`, `InputManager`
- Tick loop: input → move → camera → lasers → dig → world update → render
- HUD dig joystick/fire → `InputManager.setExternal*` (`mountTouch: false` to avoid duplicate controls)
- Touch laser uses pointer hold; E near sites opens lesson / progress / hub
- Stub ground plane removed

**Next:** Fresh critic re-judge live third-person dig slice vs PS1/PS2 + concept bar.
